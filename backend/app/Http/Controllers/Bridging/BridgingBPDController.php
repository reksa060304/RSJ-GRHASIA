<?php
/**
 * Controller untuk Bridging Bank BPD
 * API untuk inquiry dan payment flagging tagihan pasien
 */

namespace App\Http\Controllers\Bridging;

use App\Http\Controllers\ApiController;
use App\Traits\SettingDataFixedTrait;
use App\Traits\PelayananPasienTrait;
use App\Traits\InternalList;
use Illuminate\Http\Request;
use DB;

use App\Transaksi\StrukBuktiPenerimaanCaraBayar;
use App\Transaksi\StrukPelayananPenjamin;
use App\Transaksi\StrukBuktiPenerimaan;
use App\Transaksi\PelayananPasien;
use App\Transaksi\StrukPelayanan;
use App\Master\SettingDataFixed;
use App\Transaksi\PasienDaftar;
use App\Transaksi\LoggingUser;
use App\Transaksi\LogAcc;
use App\Traits\Valet;
use App\Web\Profile;

class BridgingBPDController extends ApiController
{
    /**
     * Constructor
     * Skip authentication default Laravel karena menggunakan Basic Auth dari Bank BPD
     */
    // protected $idUser = 13;
    protected $idUser;    // loginuser_s.id
    protected $idPegawai; // pegawai_m.id (derived from loginuser_s)
    
    use Valet, PelayananPasienTrait, SettingDataFixedTrait,InternalList;
    public function __construct()
    {
        parent::__construct($skip_authentication = true);

        // Load idUser for BPD transactions from settings (fallback to 31212)
        try {
            $settingIdUser = SettingDataFixed::where('namafield', 'idUserBPD')->first();
            $settingIdPegawai = SettingDataFixed::where('namafield', 'idPegawaiBPD')->first();
            $this->idUser = ($settingIdUser && isset($settingIdUser->nilaifield)) ? (int)$settingIdUser->nilaifield : 31213;
            $this->idPegawai = ($settingIdPegawai && isset($settingIdPegawai->nilaifield)) ? (int)$settingIdPegawai->nilaifield : 320262088;
        } catch (\Exception $e) {
            $this->idUser = 31213;
            $this->idPegawai = 320262088;
        }
    }

    /**
     * Validasi Basic Auth dari Bank BPD
     * Cek header Authorization: Basic base64(username:password)
     * Validasi ke tabel loginuser_s seperti sistem login SIMRS
     */
    private function validateBPDAuth()
    {
        $authHeader = request()->header('Authorization');
        
        if (!$authHeader) {
            return response()->json([
                'response_code' => '401',
                'response_message' => 'Authorization header tidak ditemukan'
            ], 401);
        }

        // Parse Basic Auth
        if (!preg_match('/Basic\s+(.*)$/i', $authHeader, $matches)) {
            return response()->json([
                'response_code' => '401',
                'response_message' => 'Format Authorization header salah'
            ], 401);
        }

        $credentials = base64_decode($matches[1], true);
        if ($credentials === false) {
            return response()->json([
                'response_code' => '401',
                'response_message' => 'Credentials tidak valid'
            ], 401);
        }

        // Split username dan password
        if (!str_contains($credentials, ':')) {
            return response()->json([
                'response_code' => '401',
                'response_message' => 'Format credentials salah'
            ], 401);
        }

        list($username, $password) = explode(':', $credentials, 2);

        // Validasi ke database loginuser_s (sama seperti LoginController)
        $loginUser = DB::table('loginuser_s')
            ->where('passcode', '=', $this->encryptSHA1($password))
            ->where('namauser', '=', $username)
            ->where('statusenabled', true)
            ->first();

        if (!$loginUser) {
            return response()->json([
                'response_code' => '401',
                'response_message' => 'Username atau password salah'
            ], 401);
        }

        return null; // Autentikasi berhasil
    }

    /**
     * Encrypt password menggunakan SHA1
     * Method ini sama dengan yang ada di LoginController
     */
    private function encryptSHA1($pass)
    {
        return sha1($pass);
    }

    /**
     * API Inquiry - Mendapatkan informasi tagihan pasien
     * GET /api/inquiry?no_rm=123456789&id_ruangan=1 (optional)
     * 
     * Parameter:
     * - no_rm: Nomor Rekam Medis dari pasien_m.nocm
     * - id_ruangan: (optional) Filter berdasarkan ruangan
     */
    public function inquiry(Request $request)
    {
        // Validasi Basic Auth dari Bank BPD
        $authResult = $this->validateBPDAuth();
        if ($authResult !== null) {
            return $authResult; // Return error response jika auth gagal
        }

        try {
            $profile = Profile::where('statusenabled', true)->first();
            $kdProfile = $profile->id;
            $idProdukDeposit = SettingDataFixed::where('namafield', 'idProdukDeposit')->first();
            $noRm = $request->query('no_rm');

            // Step 1: Cari pasien berdasarkan no_rm (nocm) di tabel pasien_m
            $pasien = DB::table('pasien_m as p')
                ->leftjoin('jeniskelamin_m as jk', 'jk.id', '=', 'p.objectjeniskelaminfk')
                ->leftjoin('alamat_m as al', 'al.nocmfk', '=', 'p.id')
                ->select(
                    'p.id as id_pasien', 
                    'p.nocm as no_rm', 
                    'p.namapasien', 
                    'p.tgllahir',
                    'al.alamatlengkap as alamat', 
                    'jk.reportdisplay as jenis_kelamin'
                )
                ->where('p.nocm', $noRm)
                ->where('p.statusenabled', true)
                ->first();

            if (!$pasien) {
                return response()->json([
                    'response_code' => '87',
                    'response_message' => 'bill not found'
                ], 404);
            }

            // Step 2: Ambil data registrasi/kunjungan terakhir berdasarkan tglregistrasi
            $pasienDaftar = DB::table('pasiendaftar_t as pd')
                ->where('pd.nocmfk', $pasien->id_pasien)
                ->where('pd.statusenabled', true)
                ->orderBy('pd.tglregistrasi', 'DESC')
                ->first();

            if (!$pasienDaftar) {
                return response()->json([
                    'response_code' => '87',
                    'response_message' => 'bill not found'
                ], 404);
            }

            // Step 3: Check sudah bayar atau belum
            // Cek apakah masih ada pelayanan yang belum diverifikasi (strukfk IS NULL)
            $pelayananBelumBayar = DB::table('antrianpasiendiperiksa_t as apd')
                ->join('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
                ->where('apd.noregistrasifk', $pasienDaftar->norec)
                ->where('pp.statusenabled', true)
                ->whereNull('pp.strukfk')
                ->count();

            if (($pasienDaftar->nostruklastfk != null || $pasienDaftar->nosbmlastfk != null) && $pelayananBelumBayar == 0) {
                return response()->json([
                    'response_code' => '88',
                    'response_message' => 'bill already paid',
                ], 400);
            } else {
                // Query data pelayanan dengan joins lengkap
                $pelayanan = DB::table('pasiendaftar_t as pd')
                    ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                    ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
                    ->leftjoin('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
                    ->leftjoin('kelas_m as kl', 'kl.id', '=', 'apd.objectkelasfk')
                    ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                    ->leftjoin('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
                    ->leftjoin('strukbuktipenerimaan_t as sbm', 'sp.nosbmlastfk', '=', 'sbm.norec')
                    ->select(
                        'pp.norec', 'pp.tglpelayanan', 'pp.rke', 'pr.id as prid', 'pr.namaproduk', 
                        'pp.jumlah', 'kl.id as klid', 'kl.namakelas',
                        'ru.id as ruid', 'ru.namaruangan', 'pp.produkfk', 'pp.hargajual', 'pp.hargadiscount', 
                        'sp.nostruk', 'sp.tglstruk', 'apd.norec as norec_apd',
                        'sbm.nosbm', 'sp.norec as norec_sp', 'pp.jasa'
                    )
                    ->where('pd.norec', $pasienDaftar->norec)
                    ->where('pp.statusenabled', true)
                    ->whereNull('pp.strukfk')
                    ->orderBy('pp.tglpelayanan')
                    ->orderBy('pp.rke');
    
                // Filter berdasarkan id_ruangan jika ada
                if ($request->has('id_ruangan') && $request->query('id_ruangan') != "" && $request->query('id_ruangan') != "undefined") {
                    $pelayanan = $pelayanan->where('apd.objectruanganfk', '=', $request->query('id_ruangan'));
                }
    
                $pelayanan = $pelayanan->get();
    
                // Query untuk menghitung total yang sudah dibayar
                $dataTotalDibayar = DB::select(
                    DB::raw(
                        "SELECT SUM(((CASE WHEN pp.hargajual IS NULL THEN 0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN 0 ELSE pp.hargadiscount END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN 0 ELSE pp.jasa END) as total
                        FROM pasiendaftar_t as pd
                        INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                        INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                        INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                        WHERE pd.norec=:norec AND sp.nosbmlastfk IS NOT NULL AND pp.produkfk NOT IN (402611)"
                    ),
                    ['norec' => $pasienDaftar->norec]
                );
    
                $totalBilling = 0;
                $tagihanArray = [];
                $noKwitansi = 1;
    
                if (count($pelayanan) > 0) {
                    foreach ($pelayanan as $value) {
                        // Skip deposit dan produk null
                        if ($value->produkfk == (int)$idProdukDeposit->nilaifield) {
                            continue;
                        }
                        if ($value->namaproduk == null) {
                            continue;
                        }
    
                        $jasa = (isset($value->jasa) && $value->jasa != "" && $value->jasa != "undefined") ? $value->jasa : 0;
                        $harga = (float)$value->hargajual;
                        $diskon = (float)$value->hargadiscount;
                        $subtotal = (($harga - $diskon) * $value->jumlah) + $jasa;
    
                        $tagihanArray[] = [
                            'no_kwitansi' => $noKwitansi,
                            'keterangan' => $value->namaproduk,
                            'nominal' => number_format($subtotal, 2, '.', '')
                        ];
    
                        $totalBilling += $subtotal;
                        $noKwitansi++;
                    }
                }
    
                // Jika ada tagihan, lakukan verifikasi terlebih dahulu untuk mendapatkan nomor verifikasi (nostruk)
                if ($totalBilling > 0) {
                    $datachecklist = [];
                    foreach ($pelayanan as $p) {
                        if (isset($p->norec)) {
                            $datachecklist[] = ['norec' => $p->norec];
                        }
                    }
    
                    $payload = [
                        'noRegistrasi' => $pasienDaftar->noregistrasi,
                        'jumlahBayar' => $totalBilling,
                        'cekMultiPenjamin' => false,
                        'totalKlaim' => 0
                    ];
    
                    $verif = $this->simpanVerifikasiTagihan($payload);
                    $transactionId = null;
                    $verCode = null;
                    $verContent = null;

                    if (is_object($verif) && method_exists($verif, 'getStatusCode')) {
                        $verCode = $verif->getStatusCode();
                        $verContent = json_decode($verif->getContent(), true);
                    } elseif (is_string($verif)) {
                        $verContent = json_decode($verif, true);
                    } elseif (is_array($verif)) {
                        $verContent = $verif;
                    }

                    if ($verCode == 201 && isset($verContent['result']['nostruk'])) {
                        $transactionId = $verContent['result']['nostruk'];
                    } else {
                        $transactionId = null;
                    }
                }
    
                // Format tanggal lahir dd/mm/yyyy
                $tglLahir = '';
                if (isset($pasien->tgllahir) && $pasien->tgllahir) {
                    $tglLahir = date('d/m/Y', strtotime($pasien->tgllahir));
                }
    
                // If there is a billing amount but verification didn't produce a nostruk,
                // return an explicit error so bank won't attempt payment with an invalid id.
                if ($totalBilling > 0 && $transactionId == null) {
                    return response()->json([
                        'response_code' => '96',
                        'response_message' => 'system malfunction',
                        // 'error_details' => $pesanGagal,
                    ], 500);
                }
    
                return response()->json([
                    'response_code' => '00',
                    'response_message' => 'success',
                    'no_rm' => $pasien->no_rm,
                    'nama_pasien' => $pasien->namapasien,
                    'alamat_pasien' => $pasien->alamat,
                    'jenis_kelamin' => $pasien->jenis_kelamin,
                    'tanggal_lahir' => $tglLahir,
                    'total_tagihan' => number_format($totalBilling, 2, '.', ''),
                    'transaction_id' => $transactionId,
                    'tagihan' => $tagihanArray
                ], 200);
            }
        } catch (\Exception $e) {
            return response()->json([
                'response_code' => '96',
                'response_message' => 'system malfunction',
                'error_details' => $e->getMessage(). '\n Line: '.$e->getLine()
            ], 500);
        }
    }

    public function simpanVerifikasiTagihan($request){
        $profile = Profile::where('statusenabled', true)->first();
        $idProfile = $profile->id;
        $noRegister = $request['noRegistrasi'];
        $transStatus = true;
        $transMsg = null;
        $totalBilling = 0;
        $totalDeposit = 0;
        DB::beginTransaction();

        $pasienDaftar = PasienDaftar::where('noregistrasi', $noRegister)->where('kdprofile', $idProfile)->first();
        $pelayanan = $pasienDaftar->pelayanan_pasien()->select('pelayananpasien_t.*')->whereNull('strukfk')->get();
        $pelayananDetail = $pasienDaftar->pelayanan_pasien_detail()->whereNull('strukfk')->get();
        $dataPD = \DB::table('pasiendaftar_t as pd')
            ->JOIN('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->select('ru.objectdepartemenfk')
            ->where('pd.noregistrasi', $noRegister)
            ->where('pd.kdprofile', $idProfile)
            ->first();

        if ($dataPD->objectdepartemenfk == 16) {
            $isRawatInap = true;
        } else {
            $isRawatInap = false;
        }
        if (count($pelayanan) == 0) {
            $transStatus = false;
            $transMsg = "Pelayanan yang dilakukan pasien tidak ada.";
        }

        if ($transStatus) {
            $noStruk = $this->generateCode(new StrukPelayanan, 'nostruk', 10, 'S', $idProfile);
            $strukPelayanan = new StrukPelayanan();
            $strukPelayanan->norec = $strukPelayanan->generateNewId();
            $strukPelayanan->statusenabled = true;

            foreach ($pelayanan as $pel) {
                $harga = ($pel->hargajual == null) ? 0 : $pel->hargajual;
                $diskon = ($pel->hargadiscount == null) ? 0 : $pel->hargadiscount;
                if ($pel->nilainormal == -1) {
                    $totalDeposit += ($harga * $pel->jumlah);
                } else {
                    $totalBilling += (($harga - $diskon) * $pel->jumlah) + $pel->jasa;
                }
            }

            $strukPelayanan->kdprofile = $idProfile;
            $strukPelayanan->nocmfk = $pasienDaftar->nocmfk;
            $strukPelayanan->noregistrasifk = $pasienDaftar->norec;
            $strukPelayanan->objectkelaslastfk = $pasienDaftar->objectkelasfk;
            $strukPelayanan->objectkelompoktransaksifk = 1;
            $strukPelayanan->objectpegawaipenerimafk = $this->idPegawai;// $this->getCurrentLoginID();
            $strukPelayanan->nostruk = $noStruk;
            $strukPelayanan->totalharusdibayar = $totalBilling - $totalDeposit;
            $strukPelayanan->tglstruk = $this->getDateTime();
            $strukPelayanan->objectruanganfk = $pasienDaftar->objectruanganlastfk;
            $strukPelayanan->save();
            if ($transStatus) {
                foreach ($pelayanan as $pel) {
                    $pel->strukfk = $strukPelayanan->norec;
                    try {
                        $pel->save();
                    } catch (\Exception $e) {
                        $transStatus = false;
                        $transMsg = "Transaksi Gagal (update pp)";
                        break;
                    }
                }
            }
        }

        if ($transStatus) {
            foreach ($pelayananDetail as $pelDel) {
                $pelDel->strukfk = $strukPelayanan->norec;
                try {
                    $pelDel->save();
                } catch (\Exception $e) {
                    $transStatus = false;
                    $transMsg = "Transaksi Gagal (insert SP)";
                    break;
                }
            }

        }

        $totalKlaim = (float)$request['totalKlaim'];
        if ($transStatus && $totalKlaim > 0) {
            $strukPelayanan->totalharusdibayar -= $totalKlaim;
            $strukPelayanan->totalprekanan = $totalKlaim;
            if ($pasienDaftar->objectkelompokpasienlastfk == $this->getKelompokPasienPerjanjian()) {
                $rekananpenjamin_id = 0;
            } elseif ($pasienDaftar->objectkelompokpasienlastfk == 2 || $pasienDaftar->objectkelompokpasienlastfk == 4) {
                $rekananpenjamin_id = 2552;
            } else {
                $rekananpenjamin_id = 0; //masih bypass. yang kelompok pasien penjanjian diisini cuma kondisinhya jiga ada klim tapi gak penjaminnya..

            }
            $SPPenjamin = new StrukPelayananPenjamin();
            $SPPenjamin->norec = $SPPenjamin->generateNewId();
            $SPPenjamin->kdprofile = $idProfile;
            $SPPenjamin->kdkelompokpasien = $pasienDaftar->objectkelompokpasienlastfk;
            $SPPenjamin->kdrekananpenjamin = $rekananpenjamin_id;
            $SPPenjamin->totalbiaya = $totalBilling;
            $SPPenjamin->totalsudahppenjamin = $totalKlaim;
            $SPPenjamin->totalsisaharusdibayar = $totalKlaim;
            $SPPenjamin->totalppenjamin = $totalKlaim;
            $SPPenjamin->totalharusdibayar = $totalKlaim;
            $SPPenjamin->totalsudahdibayar = 0;
            $SPPenjamin->totalsudahdibebaskan = 0;
            $SPPenjamin->totalsisapiutang = $totalKlaim;
            $SPPenjamin->totaldibayarlebih = 0;
            $SPPenjamin->nostrukfk = $strukPelayanan->norec;
            $pasienDaftar->nostruklastfk = $strukPelayanan->norec;
            try {
                $SPPenjamin->save();
            } catch (\Exception $e) {
                $transStatus = false;
                $transMsg = "Transaksi Gagal (Insert SPP)";
            }
        }

        if ($transStatus) {
            $pasienDaftar->nostruklastfk = $strukPelayanan->norec;
            try {
                $pasienDaftar->save();
            } catch (\Exception $e) {
                $transStatus = false;
                $transMsg = "Transaksi Gagal (update Pdaf)";
            }
        }

        if ($transStatus) {
            $logAcc = new  LogAcc;
            $logAcc->norec = $logAcc->generateNewId();
            $logAcc->jenistransaksi = 'Verifikasi TataRekening Bank BPD';
            $logAcc->noreff = $strukPelayanan->norec;
            $logAcc->status = 0;
            $logAcc->tanggal = $this->getDateTime()->format('Y-m-d H:i:s');
            try {
                $logAcc->save();
            } catch (\Exception $e) {
                $transStatus = false;
                $transMsg = "Simpan logAcc Gagal {SP}";

            }
        }
        
        if ($transStatus) {
            try {
                $strukPelayanan->save();
            } catch (\Exception $e) {
                $transStatus = false;
                $transMsg = "Simpan Biaya Administrasi Gagal {SP}";

            }
        }
        if ($transStatus) {
            $newId = LoggingUser::max('id');
            $newId = ($newId ?? 0) + 1;
            $logUser = new LoggingUser();
            $logUser->id = $newId;
            $logUser->norec = $logUser->generateNewId();
            $logUser->kdprofile = $idProfile;
            $logUser->statusenabled = true;
            $logUser->jenislog = 'Verifikasi TataRekening Bank BPD';
            $logUser->noreff = $strukPelayanan->norec;
            $logUser->referensi = 'norec Struk Pelayanan';
            $logUser->keterangan = 'Verifikasi TataRekening melalui Bank BPD untuk pasien registrasi ' . $noRegister . ' - No Struk: ' . $strukPelayanan->nostruk;
            $logUser->objectloginuserfk = $this->idUser;
            $logUser->tanggal = $this->getDateTime()->format('Y-m-d H:i:s');

            try {
                $logUser->save();
            } catch (\Exception $e) {
                $transStatus = false;
                $transMsg = "Simpan LoggingUser Gagal {LU}";
            }
        }
        if ($transStatus) {
            $this->setStatusCode(201);
            $transMsg = "Transaksi Berhasil";
            DB::commit();
            // DB::rollBack(); //testing doang
            return $this->respond([
                'result' => [
                    'nostruk' => isset($strukPelayanan->nostruk) ? $strukPelayanan->nostruk : null
                ]
            ], $transMsg);
        } else {
            $this->setStatusCode(400);
            DB::rollBack();
            return $this->respond([], $transMsg);
        }
    }
    /**
     * API Payment - Flagging tagihan pasien (marking as paid)
     * POST /api/payment
     * 
     * Request body:
     * {
     *    "no_rm": "123456789",
     *    "transaction_method": "QRIS",
     *    "transaction_id": "1234567890",
     *    "transaction_time": "01/12/2025 23:59:59",
     *    "tagihan": [
     *        {
     *            "no_kwitansi": "1",
     *            "keterangan": "Pemeriksaan Dokter",
     *            "nominal": "100000.00"
     *        }
     *    ]
     * }
     */
    public function payment(Request $request)
    {
        // Validasi Basic Auth dari Bank BPD
        $authResult = $this->validateBPDAuth();
        if ($authResult !== null) {
            return $authResult; // Return error response jika auth gagal
        }

        try {
            $profile = Profile::where('statusenabled', true)->first();
            $kdProfile = $profile->id;

            // Ambil struktur pelayanan
            $strukPelayanan = StrukPelayanan::where('nostruk', $request['transaction_id'])->first();

            if (!$strukPelayanan) {
                return response()->json([
                    'response_code' => '87',
                    'response_message' => 'bill not found'
                ], 404);
            }

            // Check sudah bayar atau belum
            if ($strukPelayanan->nosbmlastfk != null) {
                return response()->json([
                    'response_code' => '88',
                    'response_message' => 'bill already paid'
                ], 400);
            }

            // Hitung total
            $totalBayar = 0;
            foreach ($request->input('tagihan') as $tagihan) {
                $totalBayar += (float)$tagihan['nominal'];
            }

            DB::beginTransaction();

            // Buat bukti penerimaan
            $strukBuktiPenerimaan = new StrukBuktiPenerimaan();
            $strukBuktiPenerimaan->norec = $strukBuktiPenerimaan->generateNewId();
            $strukBuktiPenerimaan->kdprofile = $kdProfile;
            $strukBuktiPenerimaan->keteranganlainnya = "Pembayaran Melalui Si Banter BPD DIY";
            $strukBuktiPenerimaan->statusenabled = 1;
            $strukBuktiPenerimaan->nostrukfk = $strukPelayanan->norec;
            $strukBuktiPenerimaan->objectkelompokpasienfk = $strukPelayanan->pasien_daftar->pasien->objectkelompokpasienfk;
            $strukBuktiPenerimaan->objectkelompoktransaksifk = 1;
            $strukBuktiPenerimaan->objectpegawaipenerimafk = $this->idUser;
            $strukBuktiPenerimaan->tglsbm = date('Y-m-d H:i:s');
            $strukBuktiPenerimaan->totaldibayar = $totalBayar;
            $strukBuktiPenerimaan->nosbm = $this->generateCode(new StrukBuktiPenerimaan, 'nosbm', 14, 'RV-' . $this->getDateTime()->format('ym'), $kdProfile); 
            $strukBuktiPenerimaan->save();
            
            // Tentukan ID cara bayar
            $settingField = ($request->input('transaction_method') == 'QRIS') 
                ? 'idCaraBayarSiBanterQRIS' 
                : 'idCaraBayarSiBanterVA';
            $settingCaraBayar = SettingDataFixed::where('namafield', $settingField)->first();
            $objectCaraBayarFk = ($settingCaraBayar && isset($settingCaraBayar->nilaifield)) 
                ? (int)$settingCaraBayar->nilaifield 
                : (($request->input('transaction_method') == 'QRIS') ? 13 : 14); 

            // Buat cara pembayaran
            $SBPCB = new StrukBuktiPenerimaanCaraBayar();
            $SBPCB->norec = $SBPCB->generateNewId();
            $SBPCB->kdprofile = $kdProfile;
            $SBPCB->statusenabled = 1;
            $SBPCB->nosbmfk = $strukBuktiPenerimaan->norec;
            $SBPCB->objectcarabayarfk = $objectCaraBayarFk;
            $SBPCB->totaldibayar = $totalBayar;
            $SBPCB->save();

            // Update struktur pelayanan
            $strukPelayanan->nosbmlastfk = $strukBuktiPenerimaan->norec;

            try {
                $strukPelayanan->save();
            } catch (\Exception $e) {
                DB::rollBack();
                return response()->json([
                    'response_code' => '96',
                    'response_message' => 'system malfunction',
                    'error_details' => $e->getMessage()
                ], 500);
            }

            // Update pasien daftar
            $pasienDaftarModel = PasienDaftar::where('norec', $strukPelayanan->pasien_daftar->norec)->first();
            $pasienDaftarModel->nosbmlastfk = $strukBuktiPenerimaan->norec;

            try {
                $pasienDaftarModel->save();
            } catch (\Exception $e) {
                DB::rollBack();
                return response()->json([
                    'response_code' => '96',
                    'response_message' => 'system malfunction',
                    'error_details' => $e->getMessage()
                ], 500);
            }

            // Catat log accounting
            $logAcc = new LogAcc();
            $logAcc->norec = $logAcc->generateNewId();
            $logAcc->jenistransaksi = 'Pembayaran Tagihan Bank BPD';
            $logAcc->noreff = $strukBuktiPenerimaan->norec;
            $logAcc->status = 0;
            $logAcc->tanggal = $this->getDateTime()->format('Y-m-d H:i:s');

            try {
                $logAcc->save();
            } catch (\Exception $e) {
                DB::rollBack();
                return response()->json([
                    'response_code' => '96',
                    'response_message' => 'system malfunction',
                    'error_details' => $e->getMessage()
                ], 500);
            }

            // Catat logging user
            $newId = LoggingUser::max('id');
            $newId = ($newId ?? 0) + 1;
            $logUser = new LoggingUser();
            $logUser->id = $newId;
            $logUser->norec = $logUser->generateNewId();
            $logUser->kdprofile = $kdProfile;
            $logUser->statusenabled = true;
            $logUser->jenislog = 'Pembayaran Tagihan Bank BPD';
            $logUser->noreff = $strukBuktiPenerimaan->norec;
            $logUser->referensi = $request->input('transaction_id');
            $logUser->keterangan = 'Pembayaran via ' . $request->input('transaction_method') . ' - No SBM: ' . $strukBuktiPenerimaan->nosbm . ' - No Registrasi: ' . $strukPelayanan->pasien_daftar->noregistrasi;
            $logUser->objectloginuserfk = $this->idUser;
            $logUser->tanggal = $this->getDateTime()->format('Y-m-d H:i:s');

            try {
                $logUser->save();
                PasienDaftar::where('noregistrasi', $strukPelayanan->pasien_daftar->noregistrasi)
                ->where('kdprofile', $kdProfile)
                ->update([
                    'isclosing' => true,
                    'tglclosing' => $this->getDateTime()->format('Y-m-d H:i:s')
                ]);
            } catch (\Exception $e) {
                DB::rollBack();
                return response()->json([
                    'response_code' => '96',
                    'response_message' => 'system malfunction',
                    'error_details' => $e->getMessage()
                ], 500);
            }

            DB::commit();
            // DB::rollBack(); // For testing only

            return response()->json([
                'response_code' => '00',
                'response_message' => 'success',
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'response_code' => '96',
                'response_message' => 'system malfunction',
                'error_details' => $e->getMessage(). 'Line: '.$e->getLine()
            ], 500);
        }
    }

    protected function getDepositPasien($noregistrasi)
    {
        $idProdukDeposit = SettingDataFixed::where('namafield', 'idProdukDeposit')->first();
        $deposit = 0;
        $pasienDaftar  = PasienDaftar::has('pelayanan_pasien')->where('noregistrasi', $noregistrasi)->first();
        if ($pasienDaftar) {
            $depositList = $pasienDaftar->pelayanan_pasien()->where('nilainormal', '-1')->whereNull('strukfk')->get();
            foreach ($depositList as $item) {
                if ($item->produkfk == (int)$idProdukDeposit->nilaifield) {
                    $deposit = $deposit + $item->hargasatuan;
                }
            }
        }
        return $deposit;
    }
}
