<?php

namespace App\Http\Controllers\EMR;

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use DB;
use PDF;
use App\Web\Profile;
use App\Traits\Valet;
use App\Transaksi\LoggingUser;

class WaResumeController extends ApiController
{
    use Valet;
    /**
     * Ambil daftar pasien yang memiliki data resume medis.
     * Filter: periode, namapasien, nocm, noregistrasi, kelompokpasien
     */
    public function getDaftarPasienResume(Request $request)
    {
        try {
            try { $kdProfile = (int) $this->getDataKdProfile($request) ?: 30; } catch (\Exception $ex) { $kdProfile = 30; }

            $queryResume = DB::table('resumemedis_t as rm')
                ->select(
                    DB::raw("'Resume Medis' as jenis_dokumen"),
                    'rm.norec',
                    'rm.tglresume as tgldokumen',
                    'rm.tglkirimwa',
                    'rm.keteranganlainnya',
                    'ps.nocm',
                    'ps.namapasien',
                    'ps.nohp',
                    'ps.notelepon',
                    'pd.noregistrasi',
                    'pd.tglregistrasi',
                    'kp.kelompokpasien',
                    'ru.namaruangan',
                    'pg.namalengkap as namadokter',
                    DB::raw('CASE WHEN eb.id IS NOT NULL THEN 1 ELSE 0 END as is_tte'),
                    DB::raw("CAST(NULL as VARCHAR) as noemr_pasien"),
                    DB::raw("NULL::integer as emrfk"),
                    DB::raw("CAST(NULL as VARCHAR) as blade"),
                    DB::raw("CAST(NULL as VARCHAR) as norec_apd"),
                    DB::raw("CAST(NULL as VARCHAR) as umur"),
                    DB::raw("CAST(NULL as VARCHAR) as jeniskelamin")
                )
                ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'rm.noregistrasifk')
                ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                ->join('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
                ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
                ->leftJoin('emr_bsre_t as eb', function($join) {
                    $join->on('eb.nocm', '=', 'ps.nocm')
                         ->on('eb.nomoremr', '=', 'rm.koderesume')
                         ->on('eb.noregistrasi', '=', 'pd.noregistrasi')
                         ->where('eb.status', '=', true)
                         ->where('eb.statusenabled', '=', true);
                })
                ->where('rm.kdprofile', $kdProfile)
                ->where('rm.statusenabled', true);

            $queryEmr = DB::table('emrpasien_t as ep')
                ->select(
                    DB::raw("CASE 
                        WHEN ep.emrfk = 3003043 THEN 'Rujukan Edukasi Psikiatri dengan Komorbid Epilepsi'
                        WHEN ep.emrfk = 3003044 THEN 'Rujukan Edukasi Psikiatri dengan Komorbid Sindroma Geriatri'
                        WHEN ep.emrfk = 3003045 THEN 'Rujukan Edukasi Psikiatri dengan Komorbid Hipertensi'
                        WHEN ep.emrfk = 3003046 THEN 'Rujukan Edukasi Psikiatri dengan Komorbid Diabetes'
                        WHEN ep.emrfk = 3003047 THEN 'Rujukan Edukasi Psikiatri dengan Komorbid Tuberculosis'
                        WHEN ep.emrfk = 3003048 THEN 'Rujukan Edukasi Psikiatri'
                        WHEN ep.emrfk = 3003052 THEN 'Rujukan Edukasi Pasien'
                        ELSE 'Rujukan Edukasi'
                    END as jenis_dokumen"),
                    'ep.norec',
                    'ep.tglemr as tgldokumen',
                    'ep.tglkirimwa',
                    DB::raw("'EMR' as keteranganlainnya"),
                    'ps.nocm',
                    'ps.namapasien',
                    'ps.nohp',
                    'ps.notelepon',
                    'pd.noregistrasi',
                    'pd.tglregistrasi',
                    'kp.kelompokpasien',
                    'ru.namaruangan',
                    'pg.namalengkap as namadokter',
                    DB::raw('CASE WHEN eb.id IS NOT NULL THEN 1 ELSE 0 END as is_tte'),
                    'ep.noemr as noemr_pasien',
                    'ep.emrfk',
                    DB::raw("CASE 
                        WHEN ep.emrfk = 3003043 THEN 'rujukan-edukasi-pasien-dengan-komorbid-epilepsi'
                        WHEN ep.emrfk = 3003044 THEN 'rujukan-edukasi-pasien-dengan-komorbid-sindrome-geriatri-low-intake'
                        WHEN ep.emrfk = 3003045 THEN 'fred-hipertensi-dom'
                        WHEN ep.emrfk = 3003046 THEN 'fred-diabetes-dom'
                        WHEN ep.emrfk = 3003047 THEN 'rujukan-edukasi-pasien-dengan-komorbid-tuberculosis'
                        WHEN ep.emrfk = 3003048 THEN 'rujukan-edukasi-psikiatri'
                        WHEN ep.emrfk = 3003052 THEN 'rujukan-edukasi-pasien'
                        ELSE ''
                    END as blade"),
                    'apd.norec as norec_apd',
                    'ep.umur',
                    'ep.jeniskelamin'
                )
                ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'ep.norec_apd')
                ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                ->join('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
                ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
                ->leftJoin('emr_bsre_t as eb', function($join) {
                    $join->on('eb.nocm', '=', 'ps.nocm')
                         ->on('eb.nomoremr', '=', 'ep.noemr')
                         ->on('eb.noregistrasi', '=', 'pd.noregistrasi')
                         ->where('eb.status', '=', true)
                         ->where('eb.statusenabled', '=', true);
                })
                ->where('ep.kdprofile', $kdProfile)
                ->where('ep.statusenabled', true)
                ->whereIn('ep.emrfk', [3003043, 3003044, 3003045, 3003046, 3003047, 3003048, 3003052]);

            // Filter periode
            if (!empty($request['periodeAwal'])) {
                $queryResume->where('rm.tglresume', '>=', $request['periodeAwal']);
                $queryEmr->where('ep.tglemr', '>=', $request['periodeAwal']);
            }
            if (!empty($request['periodeAkhir'])) {
                $queryResume->where('rm.tglresume', '<=', $request['periodeAkhir']);
                $queryEmr->where('ep.tglemr', '<=', $request['periodeAkhir']);
            }

            // Filter nama pasien
            if (!empty($request['namaPasien'])) {
                $queryResume->where('ps.namapasien', 'ilike', '%' . $request['namaPasien'] . '%');
                $queryEmr->where('ps.namapasien', 'ilike', '%' . $request['namaPasien'] . '%');
            }

            // Filter no CM / no RM
            if (!empty($request['noCm'])) {
                $queryResume->where('ps.nocm', 'ilike', '%' . $request['noCm'] . '%');
                $queryEmr->where('ps.nocm', 'ilike', '%' . $request['noCm'] . '%');
            }

            // Filter no registrasi
            if (!empty($request['noRegistrasi'])) {
                $queryResume->where('pd.noregistrasi', 'ilike', '%' . $request['noRegistrasi'] . '%');
                $queryEmr->where('pd.noregistrasi', 'ilike', '%' . $request['noRegistrasi'] . '%');
            }

            // Filter jenis/kelompok pasien
            if (!empty($request['kelompokPasien'])) {
                $queryResume->where('kp.id', (int) $request['kelompokPasien']);
                $queryEmr->where('kp.id', (int) $request['kelompokPasien']);
            }

            $data = $queryResume->union($queryEmr)->orderBy('tgldokumen', 'desc')->get();

            return response()->json([
                'status'  => 200,
                'message' => 'OK',
                'data'    => $data,
            ]);
        } catch (\Exception $e) {
            \Log::error('getDaftarPasienResume error: ' . $e->getMessage());
            return response()->json([
                'status'  => 500,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Kirim dokumen PDF resume medis ke nomor WA pasien.
     * Input: norec (resumemedis_t), kdprofile, noHP (opsional override)
     */
    public function sendWaResume(Request $request)
    {
        try {
            try { $kdProfile = (int) $this->getDataKdProfile($request) ?: 30; } catch (\Exception $ex) { $kdProfile = 30; }
            $norec     = $request['norec'];
            $emrfk     = $request['emrfk'];

            // ── 1. Ambil data lengkap berdasarkan jenis dokumen ─────────────────
            if (!empty($emrfk)) {
                // EMR Document
                $data = DB::table('emrpasien_t as ep')
                    ->select(
                        'ep.norec', 'ep.tglemr as tgldokumen', 'ep.noemr as noemr_pasien', 'ep.emrfk',
                        'ps.nocm', 'ps.namapasien', 'ps.nohp', 'ps.notelepon', 'ps.tgllahir',
                        'kp.kelompokpasien', 'pd.noregistrasi', 'pd.tglregistrasi',
                        'ru.namaruangan', 'pg.namalengkap as namadokter'
                    )
                    ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'ep.norec_apd')
                    ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                    ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                    ->join('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
                    ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                    ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
                    ->where('ep.kdprofile', $kdProfile)
                    ->where('ep.statusenabled', true)
                    ->where('ep.norec', $norec)
                    ->where('ep.emrfk', (int) $emrfk)
                    ->first();
            } else {
                // Resume Medis (Default)
                $data = DB::table('resumemedis_t as rm')
                    ->select(
                        'rm.norec', 'rm.tglresume as tgldokumen', 'rm.keteranganlainnya',
                        'ps.nocm', 'ps.namapasien', 'ps.nohp', 'ps.notelepon', 'ps.tgllahir',
                        'kp.kelompokpasien', 'pd.noregistrasi', 'pd.tglregistrasi',
                        'ru.namaruangan', 'pg.namalengkap as namadokter'
                    )
                    ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'rm.noregistrasifk')
                    ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                    ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                    ->join('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
                    ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                    ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
                    ->where('rm.kdprofile', $kdProfile)
                    ->where('rm.statusenabled', true)
                    ->where('rm.norec', $norec)
                    ->first();
            }

            if (!$data) {
                return response()->json([
                    'status'  => 404,
                    'message' => 'Data dokumen tidak ditemukan.',
                ], 404);
            }

            // ── 2. Tentukan nomor HP tujuan ──────────────────────────────────────
            // Prioritas: dari request (petugas override) → nohp → notelepon
            $noHP = null;
            if (!empty($request['noHP'])) {
                $noHP = trim($request['noHP']);
            } elseif (!empty($data->nohp)) {
                $noHP = trim($data->nohp);
            } elseif (!empty($data->notelepon)) {
                $noHP = trim($data->notelepon);
            }

            if (empty($noHP)) {
                return response()->json([
                    'status'  => 422,
                    'message' => 'Nomor HP pasien tidak tersedia. Silakan masukkan nomor HP secara manual.',
                ], 422);
            }

            // Normalisasi nomor HP → format internasional 62xxx
            $noHP = preg_replace('/[^0-9+]/', '', $noHP);
            if (substr($noHP, 0, 1) === '0') {
                $noHP = '62' . substr($noHP, 1);
            }
            if (substr($noHP, 0, 1) === '+') {
                $noHP = substr($noHP, 1);
            }

            // ── 3. Buat URL publik view (Dengan Token Expiring 7 Hari) ──
            $expires = time() + (7 * 24 * 60 * 60); // 7 hari kedaluwarsa
            $publicBaseUrl = "https://simrs-grhasia.jogjaprov.go.id/service/medifirst2000/";

            if (!empty($emrfk)) {
                // EMR Document
                $blade = '';
                $jenisDokumen = '';
                switch ((int)$emrfk) {
                    case 3003043:
                        $blade = 'rujukan-edukasi-pasien-dengan-komorbid-epilepsi';
                        $jenisDokumen = 'Rujukan Edukasi Psikiatri dengan Komorbid Epilepsi';
                        break;
                    case 3003044:
                        $blade = 'rujukan-edukasi-pasien-dengan-komorbid-sindrome-geriatri-low-intake';
                        $jenisDokumen = 'Rujukan Edukasi Psikiatri dengan Komorbid Sindroma Geriatri';
                        break;
                    case 3003045:
                        $blade = 'fred-hipertensi-dom';
                        $jenisDokumen = 'Rujukan Edukasi Psikiatri dengan Komorbid Hipertensi';
                        break;
                    case 3003046:
                        $blade = 'fred-diabetes-dom';
                        $jenisDokumen = 'Rujukan Edukasi Psikiatri dengan Komorbid Diabetes';
                        break;
                    case 3003047:
                        $blade = 'rujukan-edukasi-pasien-dengan-komorbid-tuberculosis';
                        $jenisDokumen = 'Rujukan Edukasi Psikiatri dengan Komorbid Tuberculosis';
                        break;
                    case 3003048:
                        $blade = 'rujukan-edukasi-psikiatri';
                        $jenisDokumen = 'Rujukan Edukasi Psikiatri';
                        break;
                    case 3003052:
                        $blade = 'rujukan-edukasi-pasien';
                        $jenisDokumen = 'Rujukan Edukasi Pasien';
                        break;
                    default:
                        $blade = 'rujukan-edukasi-pasien';
                        $jenisDokumen = 'Rujukan Edukasi';
                        break;
                }

                $payload = base64_encode($data->norec . '|' . $data->emrfk . '|' . $blade . '|' . $expires . '|' . $kdProfile);
                $secretKey = env('APP_KEY', 'some-random-fallback-key-123!');
                $signature = hash_hmac('sha256', $payload, $secretKey);
                $token = $payload . '.' . $signature;
                $viewUrl = $publicBaseUrl . "report/cetak-emr-publik?token=" . urlencode($token);
            } else {
                // Resume Medis
                $jenisDokumen = 'Resume Medis';
                $payload = base64_encode($data->norec . '|' . $expires . '|' . $kdProfile);
                $secretKey = env('APP_KEY', 'some-random-fallback-key-123!');
                $signature = hash_hmac('sha256', $payload, $secretKey);
                $token = $payload . '.' . $signature;
                $viewUrl = $publicBaseUrl . "report/cetak-resume-medis-v3-publik?token=" . urlencode($token);
            }

            // ── 4. Ambil konfigurasi WaBlas dari settingdatafixed_m ──────────────
            $getWaSetting = function ($namafield) use ($kdProfile) {
                $row = DB::table('settingdatafixed_m')
                    ->where('namafield', $namafield)
                    ->where('kdprofile', $kdProfile)
                    ->where('statusenabled', true)
                    ->first();
                if (!$row) {
                    $row = DB::table('settingdatafixed_m')
                        ->where('namafield', $namafield)
                        ->where('statusenabled', true)
                        ->first();
                }
                return $row ? $row->nilaifield : '';
            };

            $waUrl       = $getWaSetting('urlWhatsap');
            $waToken     = $getWaSetting('tokenWhatsap');
            $waSecretKey = $getWaSetting('secretKeyWhatsap');

            if (empty($waUrl) || empty($waToken) || empty($waSecretKey)) {
                return response()->json([
                    'status'  => 500,
                    'message' => 'Konfigurasi WaBlas (urlWhatsap / tokenWhatsap / secretKeyWhatsap) belum diisi di Setting Data Fixed.',
                ], 500);
            }

            // ── 5. Siapkan Teks Pesan WA ──────────────────────────────────────────
            $message = "Halo, *" . $data->namapasien . "*\n\n"
                . "Berikut kami kirimkan tautan untuk melihat *" . $jenisDokumen . "* Anda.\n\n"
                . "No. Rekam Medis : *" . $data->nocm . "*\n"
                . "No. Registrasi  : *" . $data->noregistrasi . "*\n"
                . "Tanggal Dokumen : *" . $data->tgldokumen . "*\n\n"
                . "Silakan lihat dan unduh dokumen Anda melalui tautan berikut:\n"
                . $viewUrl . "\n\n"
                . "*Catatan:* Link di atas hanya berlaku selama *7 hari* demi keamanan data Anda.\n\n"
                . "Terima kasih telah mempercayakan kesehatan Anda kepada kami.";

            // ── 6. Kirim Pesan Teks via WaBlas ──────────────────────────────
            $payloadMsg = [
                'data' => [
                    [
                        'phone'   => $noHP,
                        'message' => $message,
                    ]
                ]
            ];

            $curlMsg = curl_init();
            curl_setopt($curlMsg, CURLOPT_HTTPHEADER, [
                'Authorization: ' . $waToken . '.' . $waSecretKey,
                'Content-Type: application/json',
            ]);
            curl_setopt($curlMsg, CURLOPT_CUSTOMREQUEST, 'POST');
            curl_setopt($curlMsg, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($curlMsg, CURLOPT_POSTFIELDS, json_encode($payloadMsg));
            curl_setopt($curlMsg, CURLOPT_URL, $waUrl);
            curl_setopt($curlMsg, CURLOPT_SSL_VERIFYHOST, 0);
            curl_setopt($curlMsg, CURLOPT_SSL_VERIFYPEER, 0);

            $resultMsg  = curl_exec($curlMsg);
            $errMsgCurl = curl_error($curlMsg);
            curl_close($curlMsg);

            if ($errMsgCurl) {
                \Log::error("WA Curl error: " . $errMsgCurl);
                return response()->json([
                    'status'  => 500,
                    'message' => 'Gagal menghubungi server WhatsApp: ' . $errMsgCurl,
                ], 500);
            }

            $decodedMsg = json_decode($resultMsg, true);
            if (isset($decodedMsg['status']) && $decodedMsg['status'] === false) {
                $errMsg = $decodedMsg['message'] ?? 'Alasan tidak diketahui';
                return response()->json([
                    'status'  => 500,
                    'message' => 'Gagal mengirim pesan WhatsApp: ' . $errMsg,
                ], 500);
            }

            if (!empty($emrfk)) {
                DB::table('emrpasien_t')
                    ->where('norec', $norec)
                    ->update(['tglkirimwa' => date('Y-m-d H:i:s')]);
            } else {
                DB::table('resumemedis_t')
                    ->where('norec', $norec)
                    ->update(['tglkirimwa' => date('Y-m-d H:i:s')]);
            }

            // Logging User Action
            $dataLogin = $request->all();
            $newId = LoggingUser::max('id');
            $newId = $newId + 1;
            $logUser = new LoggingUser();
            $logUser->id = $newId;
            $logUser->norec = $logUser->generateNewId();
            $logUser->kdprofile = $kdProfile;
            $logUser->statusenabled = true;
            $logUser->jenislog = 'Kirim WA ' . (!empty($emrfk) ? 'EMR' : 'Resume');
            $logUser->noreff = $norec;
            $logUser->referensi = !empty($emrfk) ? 'norec emrpasien_t' : 'norec resumemedis_t';
            $logUser->keterangan = 'Kirim WA ' . $jenisDokumen . ' Pasien: ' . $data->namapasien . ' / No RM: ' . $data->nocm . ' ke HP: ' . $noHP;
            $logUser->objectloginuserfk = isset($dataLogin['userData']['id']) ? $dataLogin['userData']['id'] : null;
            $logUser->tanggal = date('Y-m-d H:i:s');
            $logUser->save();

            \Log::info("WA $jenisDokumen (Teks Link) berhasil dikirim ke $noHP untuk norec=$norec");

            return response()->json([
                'status'  => 200,
                'message' => 'Pesan WhatsApp berisi link ' . $jenisDokumen . ' berhasil dikirim ke ' . $noHP,
                'noHP'    => $noHP,
                'fileUrl' => $viewUrl,
                'mode'    => 'text_link',
            ]);
        } catch (\Exception $e) {
            \Log::error('sendWaResume error: ' . $e->getMessage());
            return response()->json([
                'status'  => 500,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
