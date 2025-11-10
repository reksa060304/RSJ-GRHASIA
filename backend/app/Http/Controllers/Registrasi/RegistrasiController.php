<?php

/**
 * Created by PhpStorm.
 * User: Egie Ramdan
 * Date: 8/2/2019
 * Time: 10:46 AM
 */

namespace App\Http\Controllers\Registrasi;

use App\Http\Controllers\ApiController;
use App\Master\Kelas;
use App\Master\Agama;
use App\Master\Alamat;
use App\Master\AlamatD;
use App\Master\AsuransiPasien;
use App\Master\FlagGenerateNoCm;
use App\Master\JenisDiagnosa;
use App\Master\JenisKelamin;
use App\Master\Pasien;
use App\Master\Pendidikan;
use App\Master\Ruangan;
use App\Master\RunningNumber;
use App\Master\SettingDataFixed;
use App\Master\StatusPerkawinan;
use App\Master\TempatTidur;
use App\Master\KelompokPasien;
use App\Master\Pekerjaan;
use App\Transaksi\AntrianPasienDiperiksa;
use App\Transaksi\AntrianPasienRegistrasi;
use App\Transaksi\BatalRegistrasi;
use App\Transaksi\DetailDiagnosaPasien;
use App\Transaksi\DetailDiagnosaTindakanPasien;
use App\Transaksi\DiagnosaPasien;
use App\Transaksi\DiagnosaTindakanPasien;
use App\Transaksi\EMRPasien;
use App\Transaksi\IdentifikasiPasien;
use App\Transaksi\LoggingUser;
use App\Transaksi\OrderPelayanan;
use App\Transaksi\PasienDaftar;
use App\Transaksi\PelayananPasien;
use App\Transaksi\PelayananPasienDetail;
use App\Transaksi\PelayananPasienPetugas;
use App\Transaksi\PemakaianAsuransi;
use App\Transaksi\RegistrasiPelayananPasien;
use App\Transaksi\RekamMedis;
use App\Transaksi\RisOrder;
use App\Transaksi\StrukKirim;
use App\Transaksi\StrukOrder;
use App\Transaksi\StrukPraOrder;
use App\Transaksi\StrukResep;
use App\Transaksi\TempBilling;
use App\Transaksi\SkriningAwalPasien;
use App\Transaksi\CatatanPasienDaftar;
use App\Transaksi\EMRPasienD;
use App\Transaksi\DokumenPasien;
use Illuminate\Http\Request;
use App\Traits\PelayananPasienTrait;
use DB;
use App\Traits\Valet;
use App\Transaksi\LoggingUserRev;
use Carbon\Carbon;
use phpDocumentor\Reflection\Types\This;
use Webpatser\Uuid\Uuid;

class RegistrasiController extends ApiController
{
    use Valet, PelayananPasienTrait;

    public function __construct()
    {
        parent::__construct($skip_authentication = false);
    }

    public function getPasienByNoCm(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $data = \DB::table('pasien_m as ps')
            ->leftJOIN('alamat_m as alm', 'alm.nocmfk', '=', 'ps.id')
            ->leftjoin('pendidikan_m as pdd', 'ps.objectpendidikanfk', '=', 'pdd.id')
            ->leftjoin('pekerjaan_m as pk', 'ps.objectpekerjaanfk', '=', 'pk.id')
            ->leftjoin('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            //            ->leftjoin ('pasiendaftar_t as pd','pd.nocmfk','=','ps.id')
            ->select(
                'ps.nocm',
                'ps.id as nocmfk',
                'ps.namapasien',
                'ps.objectjeniskelaminfk',
                'jk.jeniskelamin',
                'ps.tgllahir',
                'ps.nokunjunganterakhir',
                'alm.alamatlengkap',
                'pdd.pendidikan',
                'pk.pekerjaan',
                'ps.noidentitas',
                'ps.notelepon',
                'ps.foto',
                'ps.nobpjs',
                'ps.pj1',
                'ps.pj2',
                'ps.pj3'
                //                DB::raw('encode(foto, \'base64\') AS foto'))
            )
            ->where('ps.statusenabled', true)
            ->where('ps.kdprofile', (int)$kdProfile)
            ->where('ps.id', $request['noCm'])
            ->get();

        //        if(count ($data) > 0){
        //            foreach ($data as $item){
        //                if($item->foto != null){
        //                   // $item->foto = "data:image/jpeg;base64," . base64_encode($item->foto);
        //                    $item->foto = "data:image/jpeg;base64," . $item->foto;
        //                }
        //            }
        //        }

        $result = array(
            'data' => $data,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function getDataCombo(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $dataLogin = $request->all();
        $dataInstalasi = \DB::table('departemen_m as dp')
            ->select('dp.id', 'dp.namadepartemen')
            ->whereIn('dp.id', array(3, 14, 16, 17, 18, 19, 24, 25, 26, 27, 28, 35))
            ->where('dp.statusenabled', true)
            ->where('dp.kdprofile', $kdProfile)
            ->orderBy('dp.namadepartemen')
            ->get();
        $dataRuangan = \DB::table('ruangan_m as ru')
            ->select('ru.id', 'ru.namaruangan', 'ru.objectdepartemenfk', 'ru.kdinternal')
            ->where('ru.statusenabled', true)
            ->where('ru.kdprofile', $kdProfile)
            ->orderBy('ru.namaruangan')
            ->get();
        $dataRuanganInap = \DB::table('ruangan_m as ru')
            ->select('ru.id', 'ru.namaruangan', 'ru.objectdepartemenfk')
            ->where('ru.statusenabled', true)
            ->wherein('ru.objectdepartemenfk', [16, 35, 17])
            ->where('ru.kdprofile', $kdProfile)
            ->orderBy('ru.namaruangan')
            ->get();
        $dataRuanganJalan = \DB::table('ruangan_m as ru')
            ->select('ru.id', 'ru.namaruangan', 'ru.objectdepartemenfk')
            ->where('ru.statusenabled', true)
            ->wherein('ru.objectdepartemenfk', [18, 28, 24])
            ->where('ru.kdprofile', $kdProfile)
            ->orderBy('ru.namaruangan')
            ->get();
        //        $dataRuanganEdelweis = \DB::table('ruangan_m as ru')
        //            ->select('ru.id','ru.namaruangan','ru.objectdepartemenfk')
        //            ->where('ru.statusenabled', true)
        //            ->wherein('ru.objectdepartemenfk', [45])
        //            ->orderBy('ru.namaruangan')
        //            ->get();
        $dataDokter = \DB::table('pegawai_m as ru')
            ->where('ru.statusenabled', true)
            ->where('ru.objectjenispegawaifk', 1)
            ->where('ru.kdprofile', $kdProfile)
            ->orderBy('ru.namalengkap')
            ->get();
        $dataAsalRujukan = \DB::table('asalrujukan_m as as')
            ->select('as.id', 'as.asalrujukan')
            ->where('as.statusenabled', true)
            ->orderBy('as.asalrujukan')
            ->get();

        foreach ($dataInstalasi as $item) {
            $detail = [];
            foreach ($dataRuangan as $item2) {
                if ($item->id == $item2->objectdepartemenfk) {
                    $detail[] = array(
                        'id' => $item2->id,
                        'ruangan' => $item2->namaruangan,
                    );
                }
            }

            $dataDepartemen[] = array(
                'id' => $item->id,
                'departemen' => $item->namadepartemen,
                'ruangan' => $detail,
            );
        }
        $dataKelompok = \DB::table('kelompokpasien_m as kp')
            ->select('kp.id', 'kp.kelompokpasien')
            ->where('kp.kelompokpasien', $kdProfile)
            ->where('kp.statusenabled', true)
            ->orderBy('kp.kelompokpasien')
            ->get();

        $dataKelas = \DB::table('kelas_m as kl')
            ->select('kl.id', 'kl.namakelas')
            ->where('kl.kelompokpasien', $kdProfile)
            ->where('kl.statusenabled', true)
            ->orderBy('kl.namakelas')
            ->get();

        $dataKamar = \DB::table('kamar_m as kmr')
            ->select('kmr.id', 'kmr.namakamar')
            ->where('kmr.statusenabled', true)
            ->where('kmr.kdprofile', $kdProfile)
            ->orderBy('kmr.namakamar')
            ->get();
        $dataRekanan = \DB::table('rekanan_m as rk')
            ->select('rk.id', 'rk.namarekanan')
            ->where('rk.statusenabled', true)
            ->where('rk.kdprofile', $kdProfile)
            ->orderBy('rk.namarekanan')
            ->get();
        $dataPegawai = \DB::table('pegawai_m as ru')
            ->where('ru.statusenabled', true)
            //            ->where('ru.objectjenispegawaifk', 1)
            ->where('ru.kdprofile', $kdProfile)
            ->orderBy('ru.namalengkap')
            ->get();

        $dataHubunganPeserta = \DB::table('hubunganpesertaasuransi_m as hp')
            ->select('hp.id', 'hp.hubunganpeserta')
            ->where('hp.kelompokpasien', $kdProfile)
            ->where('hp.statusenabled', true)
            ->orderBy('hp.hubunganpeserta')
            ->get();

        $jenisPelayanan = \DB::table('jenispelayanan_m as jp')
            ->select('jp.kodeinternal as id', 'jp.jenispelayanan')
            ->where('jp.statusenabled', true)
            ->where('jp.kdprofile', $kdProfile)
            ->orderBy('jp.jenispelayanan')
            ->get();

        $result = array(
            'departemen' => $dataDepartemen,
            'ruangan' => $dataRuangan,
            'ruanganranap' => $dataRuanganInap,
            'ruanganrajal' => $dataRuanganJalan,
            //            'ruanganedelweis' => $dataRuanganEdelweis,
            'kelompokpasien' => $dataKelompok,
            'dokter' => $dataDokter,
            'datalogin' => $dataLogin,
            'kelas' => $dataKelas,
            'kamar' => $dataKamar,
            'rekanan' => $dataRekanan,
            'asalrujukan' => $dataAsalRujukan,
            'pegawai' => $dataPegawai,
            'hubunganpeserta' => $dataHubunganPeserta,
            'jenispelayanan' => $jenisPelayanan,

            'message' => 'ramdanegie',
        );

        return $this->respond($result);
    }
    public function getKelasByRuangan(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $data = \DB::table('mapruangantokelas_m as mrk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'mrk.objectruanganfk')
            ->join('kelas_m as kl', 'kl.id', '=', 'mrk.objectkelasfk')
            ->select('kl.id', 'kl.namakelas', 'ru.id as id_ruangan', 'ru.namaruangan')
            ->where('mrk.objectruanganfk', $request['idRuangan'])
            ->where('mrk.kdprofile', (int)$kdProfile)
            ->get();

        $result = array(
            'kelas' => $data,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function getKamarByKelasRuangan(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $data = \DB::table('kamar_m as kmr')
            ->join('ruangan_m as ru', 'ru.id', '=', 'kmr.objectruanganfk')
            ->join('kelas_m as kl', 'kl.id', '=', 'kmr.objectkelasfk')
            ->JOIN('tempattidur_m as tt', function ($join) {
                $join->on('tt.objectkamarfk', '=', 'kmr.id');
                $join->where('tt.objectstatusbedfk', '=', 2);
            })
            ->distinct()
            ->select(
                'kmr.id',
                'kmr.namakamar',
                'kl.id as id_kelas',
                'kl.namakelas',
                'ru.id as id_ruangan',
                'ru.namaruangan',
                'kmr.jumlakamarisi',
                'kmr.qtybed'
            )
            ->where('kmr.objectruanganfk', $request['idRuangan'])
            ->where('kmr.objectkelasfk', $request['idKelas'])
            ->where('kmr.statusenabled', true)
            ->where('kmr.kdprofile', (int)$kdProfile)
            ->get();

        $result = array(
            'kamar' => $data,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function getNoBedByKamar(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $data = \DB::table('tempattidur_m as tt')
            ->join('statusbed_m as sb', 'sb.id', '=', 'tt.objectstatusbedfk')
            ->join('kamar_m as km', 'km.id', '=', 'tt.objectkamarfk')
            ->select('tt.id', 'sb.statusbed', 'tt.reportdisplay')
            ->where('tt.objectkamarfk', $request['idKamar'])
            ->where('km.statusenabled', true)
            ->where('tt.statusenabled', true)
            ->where('tt.kdprofile', (int)$kdProfile)
            ->get();

        $result = array(
            'bed' => $data,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function getRekananSaeutik(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $req = $request->all();
        $datRek = \DB::table('rekanan_m as rek')
            ->select('rek.id', 'rek.namarekanan')
            ->where('rek.statusenabled', true)
            ->where('rek.kdprofile', (int)$kdProfile)
            ->orderBy('rek.namarekanan');

        if (
            isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined"
        ) {
            $datRek = $datRek
                ->where('rek.namarekanan', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%');
            //                ->orWhere('dg.kddiagnosatindakan','ilike',$req['filter']['filters'][0]['value'].'%' )  ;
        }


        $datRek = $datRek->take(10);
        $datRek = $datRek->get();

        return $this->respond($datRek);
    }

    private function generateNoReg($objectModel, $atrribute, $length = 8, $prefix = '')
    {
        $result = $objectModel->where($atrribute, 'ilike', $prefix . '%')->max($atrribute);
        $prefixLen = strlen($prefix);
        $subPrefix = substr(trim($result), $prefixLen);
        return $prefix . (str_pad((int)$subPrefix + 1, $length - $prefixLen, "0", STR_PAD_LEFT));
    }

    public function saveRegistrasiPasien(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProdile = (int)$kdProfile;


        $r_NewPD = $request['pasiendaftar'];
        $r_NewAPD = $request['antrianpasiendiperiksa'];
        //        $countNoAntrian = AntrianPasienDiperiksa::where('objectruanganfk',$r_NewPD['objectruanganfk'])
        //            ->where('tglregistrasi', '>=', $r_NewPD['tglregistrasidate'].' 00:00')
        //            ->where('tglregistrasi', '<=', $r_NewPD['tglregistrasidate'].' 23:59')
        //            ->count('norec');
        //        $noAntrian = $countNoAntrian + 1;

        $cekRiwayatPlafon = PasienDaftar::where('nocmfk', $r_NewPD['nocmfk'])->where('statusenabled', true)->orderBy('tglregistrasi', 'desc')->first();
        $plafonBpjs = 0;
        if (!empty($cekRiwayatPlafon)) {
            $plafonBpjs = (float)$cekRiwayatPlafon->inacbgtotalgrouper;
        }

        if ($r_NewPD['israwatinap'] == 'true') {
            $isRawatInap = 'true';
        } else {
            $isRawatInap = 'false';
        }
        DB::beginTransaction();
        $cekUdahDaftar = PasienDaftar::where('nocmfk', $r_NewPD['nocmfk'])
            ->wherenull('tglpulang')
            ->where('statusenabled', true)
            ->count();
        
        // ada tambahan jika pasien ke lab dan pembiyaan umum maka masih bisa diregistrasi
        // jika bukan umum maka tidak bisa
        if (($cekUdahDaftar > 0 && $r_NewPD['norec_pd'] == '' && $r_NewPD['objectruanganfk'] !== 575) || ($cekUdahDaftar > 0 && $r_NewPD['norec_pd'] == '' && $r_NewPD['objectruanganfk'] == 575) && $r_NewPD['objectkelompokpasienlastfk'] !== 1) {
            $transStatus = 'belumdipulangkan';
        } else {
            //menambahkan kondisi pasien statusnya lama atau baru 
            $isPasienLama = DB::table('pasiendaftar_t')
                ->where('nocmfk', $r_NewPD['nocmfk'])
                ->where('statusenabled', true)
                ->exists();
            $statusPasien = $isPasienLama ? 'LAMA' : 'BARU';
            try {
                //region Save PasienDaftar
                if ($r_NewPD['norec_pd'] == '') {
                    $noRegistrasiSeq = $this->generateCodeBySeqTable(new PasienDaftar, 'noregistrasi', 10, date('ym'), $idProdile);
                    $noAntrian = 0;
                    if ($noRegistrasiSeq == '') {
                        $transMessage = "Gagal mengumpukan data, Coba lagi.!";
                        DB::rollBack();
                        $result = array(
                            "status" => 400,
                            "message"  => $transMessage,
                            "as" => 'as@epic',
                        );
                        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                    }
                    $dataPD = new PasienDaftar();
                    $dataPD->norec = $dataPD->generateNewId();
                    $dataPD->kdprofile = $idProdile;
                    $dataPD->statusenabled = true;
                    $noRegistrasi = $noRegistrasiSeq; //$this->generateNoReg(new PasienDaftar, 'noregistrasi', 10, date('ym'));//$this->getMaxNoregistrasi();
                    $dataPD->objectruanganasalfk = $r_NewPD['objectruanganfk'];
                    if (isset($r_NewPD['statuspasien'])) {
                        // $dataPD->statuspasien = $r_NewPD['statuspasien'];
                        $dataPD->statuspasien = $statusPasien;
                    }

                    //                    $saveAdminstrasi = $this->saveAdministrasi($idProdile);
                } else {
                    $dataPD =  PasienDaftar::where('norec', $r_NewPD['norec_pd'])->where('kdprofile', $idProdile)->first();
                    $noRegistrasi = $dataPD->noregistrasi;
                    //          $delAntrian = AntrianPasienDiperiksa::where('noregistrasifk', $r_NewPD['norec_pd'])
                    //                ->delete();
                    if ($isRawatInap == 'true') {
                        $delRegistrasiPelPasien = RegistrasiPelayananPasien::where('noregistrasifk', $r_NewPD['norec_pd'])
                            ->where('objectruanganfk', $r_NewPD['objectruanganfk'])
                            ->delete();
                    }
                }
                $dataPD->objectruanganlastfk = $r_NewPD['objectruanganfk'];
                $dataPD->objectdokterpemeriksafk =  isset($r_NewPD['objectpegawaifk']) ? $r_NewPD['objectpegawaifk'] : null;
                $dataPD->objectpegawaifk = isset($r_NewPD['objectpegawaifk']) ? $r_NewPD['objectpegawaifk'] : null;
                $dataPD->iskajianawal = false;
                $dataPD->isonsiteservice = 0;
                $dataPD->isregistrasilengkap = 0;
                $dataPD->jenispelayanan = $r_NewPD['tipelayanan'];
                $dataPD->objectkasuspenyakitlastfk = 1;
                $isRawatJalan = isset($r_NewPD['objectdepartemenfk']) && $r_NewPD['objectdepartemenfk'] == 18;
                if ($isRawatInap == 'true') {
                    $dataPD->objectkelasfk = $r_NewPD['objectkelasfk'];
                    if ($dataPD->tglpulang === null) { 
                    $dataPD->tglpulang = null;
                  }
                } else {
                    $dataPD->objectkelasfk = (int)$this->settingDataFixed('kdKelasNonKelasRegistrasi', $idProdile);
                    // untuk pendaftaran pasien rawat jalan saat edit tanggal registrasi ikut terupdate tanggal pulang
                    if ($isRawatJalan && $r_NewPD['norec_pd'] != '') {
                        $dataPD->tglpulang = $r_NewPD['tglregistrasi'];
                    }
                    // pendaftaran pasien baru
                    else if ($dataPD->tglpulang === null) {
                        $dataPD->tglpulang = $r_NewPD['tglregistrasi'];
                    }
                }

                $dataPD->objectkelompokpasienlastfk = $r_NewPD['objectkelompokpasienlastfk'];
                $dataPD->nocmfk = $r_NewPD['nocmfk'];
                $dataPD->objectrekananfk = $r_NewPD['objectrekananfk'];
                $dataPD->statuskasuspenyakit = false;
                //                $cekStatusPasien=PasienDaftar::where('nocmfk', $r_NewPD['nocmfk'])
                //                    ->count('nocmfk');
                //                if ($cekStatusPasien  > 0){
                //                    $statusPasien='LAMA';
                //                }else{
                //                    $statusPasien='BARU';
                //                }
                if (is_null($dataPD->tglcheckin) || 
                        $dataPD->tglcheckin == '1970-01-01 00:00:00' || 
                        $dataPD->tglcheckin == '0000-00-00 00:00:00') {
                        $dataPD->tglcheckin = \Carbon\Carbon::now()->format('Y-m-d H:i:s');
                }
                if (isset($r_NewPD['statusschedule'])) {
                    $dataPD->statusschedule = $r_NewPD['statusschedule'];
                }
                if (isset($r_NewPD['ischeckin'])) {
                    $dataPD->ischeckin = true;
                }
                if (isset($r_NewPD['isjknloket'])) {
                    $dataPD->ismobilejkn = $r_NewPD['isjknloket'];
                    $dataPD->ischeckin = true;
                }
                if (isset($r_NewPD['isjkn'])) {
                    $dataPD->ismobilejkn = $r_NewPD['isjkn'];
                    $dataPD->ischeckin = false;
                }
                $dataPD->tglregistrasi =  $r_NewPD['tglregistrasi'];
                //                $dataPD->objectruanganasalfk = $r_NewPD['objectruanganfk'];
                //region Dibuang Sayang
                //$dataPD->noregistrasifk = $noRegistrasi;
                //$dataPD->objectpenyebabkematianfk = true;
                //$dataPD->objectkondisipasienfk = true;
                //$dataPD->namalengkapambilpasien = true;
                //$dataPD->objecthubungankeluargaambilpasienfk = true;
                //$dataPD->tglpulang = date('Y-m-d H:i:s')
                //$dataPD->ruangannextschedule = true;
                //$dataPD->objectstatuskeluarfk = true;
                //$dataPD->objectstatuspulangfk = true;
                //$dataPD->totalbiaya = true;
                //$dataPD->nostruklastfk = true;
                //$dataPD->nosbmlastfk = true;
                //$dataPD->emergensi = true;
                //$dataPD->tglmeninggal = true;
                //endregion
                $dataPD->noregistrasi = $noRegistrasi;
                $dataPD->inacbgtotalgrouper = $plafonBpjs;
                $dataPD->save();
                $dataPDnorec = $dataPD->norec;
                $dataStatusPasien = $dataPD->statuspasien;
                //endregion
                //region Save AntrianPasienDiperiksa


                if ($r_NewAPD['norec_apd'] == '') {
                    $countNoAntrian = AntrianPasienDiperiksa::where('objectruanganfk', $r_NewPD['objectruanganfk'])
                        ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'antrianpasiendiperiksa_t.noregistrasifk')
                        ->where('antrianpasiendiperiksa_t.kdprofile', $idProdile)
                        ->where('antrianpasiendiperiksa_t.tglmasuk', '>=', $r_NewPD['tglregistrasidate'] . ' 00:00:00')
                        ->where('antrianpasiendiperiksa_t.tglmasuk', '<=', $r_NewPD['tglregistrasidate'] . ' 23:59:59')
                        ->where('antrianpasiendiperiksa_t.statusenabled', true)
                        ->where('pd.statusenabled', true)
                        ->max('noantrian');
                    $noAntrian = $countNoAntrian + 1;
                    //                    return $noAntrian;
                    $dataAPD = new AntrianPasienDiperiksa;
                    $dataAPD->norec = $dataAPD->generateNewId();
                    $dataAPD->kdprofile = (int)$kdProfile;
                    $dataAPD->statusenabled = true;
                    $dataAPD->noantrian = $noAntrian;
                    $dataAPD->tglmasuk = $r_NewAPD['tglregistrasi'];
                    //                    $dataAPD->objectruanganfk = $r_NewAPD['objectruanganfk'];
                } else {
                    $dataAPD =  AntrianPasienDiperiksa::where('norec', $r_NewAPD['norec_apd'])->where('kdprofile', $idProdile)->first();
                    if ($r_NewPD['objectruanganfk'] != $dataAPD->objectruanganfk) {

                        $countNoAntrian = AntrianPasienDiperiksa::where('objectruanganfk', $r_NewPD['objectruanganfk'])
                            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'antrianpasiendiperiksa_t.noregistrasifk')
                            ->where('antrianpasiendiperiksa_t.kdprofile', $idProdile)
                            ->where('antrianpasiendiperiksa_t.tglmasuk', '>=', $r_NewPD['tglregistrasidate'] . ' 00:00:00')
                            ->where('antrianpasiendiperiksa_t.tglmasuk', '<=', $r_NewPD['tglregistrasidate'] . ' 23:59:59')
                            ->where('antrianpasiendiperiksa_t.statusenabled', true)
                            ->where('pd.statusenabled', true)
                            ->max('noantrian');

                        $noAntrian = $countNoAntrian + 1;
                        $dataAPD->noantrian = $noAntrian;
                    }
                    if ($r_NewPD['tglregistrasi'] != $dataAPD->tglmasuk) {

                        $countNoAntrian = AntrianPasienDiperiksa::where('objectruanganfk', $r_NewPD['objectruanganfk'])
                            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'antrianpasiendiperiksa_t.noregistrasifk')
                            ->where('antrianpasiendiperiksa_t.kdprofile', $idProdile)
                            ->where('antrianpasiendiperiksa_t.tglmasuk', '>=', $r_NewPD['tglregistrasidate'] . ' 00:00:00')
                            ->where('antrianpasiendiperiksa_t.tglmasuk', '<=', $r_NewPD['tglregistrasidate'] . ' 23:59:59')
                            ->where('antrianpasiendiperiksa_t.statusenabled', true)
                            ->where('pd.statusenabled', true)
                            ->max('noantrian');

                        $noAntrian = $countNoAntrian + 1;
                        $dataAPD->noantrian = $noAntrian;
                        // FIX: update tglmasuk ke tanggal baru agar perhitungan max(noantrian)
                        // untuk pendaftaran berikutnya di tanggal baru tidak menghasilkan nomor duplikat
                        $dataAPD->tglmasuk = $r_NewPD['tglregistrasi'];
                    }
                    //kosongkan
                    if ($isRawatInap == 'true') {
                        TempatTidur::where('id', $dataAPD->nobed)->update(['objectstatusbedfk' => 2]);
                    }
                }
                //count tgl pasien perruanga
                $dataAPD->objectasalrujukanfk =  $r_NewAPD['objectasalrujukanfk'];
                if (isset($r_NewAPD['objectkamarfk'])) {
                    $dataAPD->objectkamarfk = $r_NewAPD['objectkamarfk'];
                }
                $dataAPD->objectkasuspenyakitfk = null;
                $dataAPD->objectruanganfk = $r_NewPD['objectruanganfk'];
                if ($isRawatInap == 'true') {
                    $dataAPD->objectkelasfk = $r_NewAPD['objectkelasfk'];
                    $dataAPD->tglkeluar = null;
                } else {
                    $dataAPD->objectkelasfk = (int)$this->settingDataFixed('kdKelasNonKelasRegistrasi', (int)$kdProfile);
                    $dataAPD->tglkeluar = $r_NewPD['tglregistrasi'];
                }
                if (isset($r_NewAPD['nobed'])) {
                    $dataAPD->nobed = $r_NewAPD['nobed'];
                }
                $dataAPD->noregistrasifk = $dataPDnorec;
                $dataAPD->objectpegawaifk = isset($r_NewAPD['objectpegawaifk']) && $r_NewAPD['objectpegawaifk'] != null ? $r_NewAPD['objectpegawaifk'] : (isset($r_NewPD['objectpegawaifk']) ? $r_NewPD['objectpegawaifk'] : null);
                $dataAPD->statusantrian = 0;
                $dataAPD->statuskunjungan = $dataStatusPasien;
                $dataAPD->statuspasien = 1;
                $dataAPD->tglregistrasi =  $r_NewAPD['tglregistrasi'];
                // $dataAPD->tglmasuk =$r_NewAPD['tglregistrasi']; dipindahkan ke atas
                $dataAPD->israwatgabung = null;
                //region Dibuang Sayang Oge
                //$dataAPD->tgldipanggildokter = null;
                //$dataAPD->tgldipanggilsuster = null;
                //$dataAPD->objectruanganasalfk = $r_NewAPD['objectruanganfk'];
                //$dataAPD->tglkeluar = null;
                //$dataAPD->statuspenyakit =null;
                //$dataAPD->objectstrukorderfk = null;
                //$dataAPD->objectstrukreturfk = null;
                //$dataAPD->prefixnoantrian = null;
                //$dataAPD->nomasuk = '';
                //$cekRuanganAsal=AntrianPasienDiperiksa::wherenull('objectruanganasalfk')->first();
                //if($cekRuanganAsal->count >0)
                //{
                //    $dataAPD->objectruanganfk = $r_NewAPD['objectruanganfk'];
                //}
                //endregion
                $dataAPD->save();
                //update statusbed jadi Isi
                if ($isRawatInap == 'true') {
                    TempatTidur::where('id', $r_NewAPD['nobed'])->update(['objectstatusbedfk' => 1]);
                }
                //endregion
                //region Save RegistrasiPelayananPasien
                if ($isRawatInap == 'true') {
                    $dataRPP = new RegistrasiPelayananPasien();
                    $dataRPP->norec = $dataRPP->generateNewId();;
                    $dataRPP->kdprofile = (int)$kdProfile;
                    $dataRPP->statusenabled = true;
                    $dataRPP->objectasalrujukanfk = $r_NewAPD['objectasalrujukanfk'];
                    $dataRPP->israwatgabung = $r_NewAPD['israwatgabung'];
                    if (isset($r_NewAPD['objectkamarfk'])) {
                        $dataRPP->objectkamarfk = $r_NewAPD['objectkamarfk'];
                    }
                    $dataRPP->objectkelasfk = $r_NewAPD['objectkelasfk'];
                    $dataRPP->objectkelaskamarfk = $r_NewAPD['objectkelasfk'];
                    $dataRPP->kdpenjaminpasien = 0;
                    $dataRPP->objectkelompokpasienfk = $r_NewPD['objectkelompokpasienlastfk'];
                    $dataRPP->noantrianbydokter = 0;
                    $dataRPP->nocmfk = $r_NewPD['nocmfk'];
                    $dataRPP->noregistrasifk = $dataPDnorec;
                    $dataRPP->objectruanganfk = $r_NewAPD['objectruanganfk'];
                    $dataRPP->objectstatuskeluarfk = null;
                    if (isset($r_NewAPD['nobed'])) {
                        $dataAPD->objecttempattidurfk = $r_NewAPD['nobed'];
                    }
                    $dataRPP->tglmasuk = $r_NewAPD['tglregistrasi'];
                    //region Dibuang Sayang Deui
                    //            $dataRPP->objectkasuspenyakitfk = null;
                    //            $dataRPP->kddokter = null;
                    //            $dataRPP->kddokterperiksanext =  null;
                    //            $dataRPP->objecthasiltriasefk =null;
                    //            $dataRPP->objectkelaskamarrencanafk =null;
                    //            $dataRPP->objectkelaskamartujuanfk =null;
                    //            $dataRPP->objectkelasrencanafk = null;
                    //            $dataRPP->objectkelastujuanfk = null;
                    //            $dataRPP->objectkeadaanumumfk = null;
                    //            $dataRPP->keteranganlainnyaperiksanext = null;
                    //            $dataRPP->keteranganlainnyarencana = '';
                    //            $dataRPP->kodenomorbuktiperjanjian = null;
                    //            $dataRPP->objectkondisipasienfk = null;
                    //            $dataRPP->namatempattujuan =null;
                    //            $dataRPP->noantrian = null;
                    //            $dataRPP->nobed = null;
                    //            $dataRPP->nobedtujuan =  null;
                    //            $dataRPP->prefixnoantrian =  '1';
                    //            $dataRPP->objectruanganasalfk = $r_NewAPD['objectruanganfk'];
                    //            $dataRPP->objectruanganperiksanextfk = $r_NewAPD['objectruanganfk'];
                    //            $dataRPP->objectruanganrencanafk =  null;
                    //            $dataRPP->objectruangantujuanfk =  null;
                    //            $dataRPP->objectstatuskeluarrencanafk =  null;
                    //            $dataRPP->statuspasien =  0;
                    //            $dataRPP->tglkeluar = null;
                    //            $dataRPP->tglkeluarrencana = null;
                    //            $dataRPP->tglperiksanext = null;
                    //            $dataRPP->tglpindah = $request['tglRegistrasi'];
                    //                 $dataRPP->objecttransportasifk = null;
                    //            $dataRPP->objectdetailkamarfk = null;
                    //endregion
                    $dataRPP->save();
                }
                $kdRuanganTeleme = $this->settingDataFixed('kdRuanganTelemedicine', $kdProfile);

                $strukorder = StrukOrder::where('noregistrasifk', $r_NewPD['norec_pd'])->first();
                if (isset($strukorder)) {
                    if ($strukorder->objectruanganfk != $dataAPD->objectruanganfk) {
                        $strukorder->objectruanganfk = $dataAPD->objectruanganfk;
                        $strukorder->save();
                    }
                }

                // tambah catatan
                if(isset($r_NewPD['catatan']) && $r_NewPD['catatan']!='' ){
                    $cp = new CatatanPasienDaftar();
                    $norec = $cp->generateNewId();
                    $cp->norec = $norec;
                    $cp->kdprofile = $kdProfile;
                    $cp->noregistrasifk = $dataPDnorec;
                    $cp->statusenabled = true;
                    $cp->objectpegawaifk = $this->getCurrentUserID() ;//$dataPegawai->objectpegawaifk;
                    $cp->tglcatatan = date('Y-m-d H:i:s');
                    $cp->ruangan = "Pendaftaran";
                    $cp->catatan = $r_NewPD['catatan'];
                    $cp->save();
                }
                // end tambah 

                //endregion
                $transStatus = 'true';
            } catch (\Exception $e) {
                $transStatus = 'false';
            }
        }
        if ($transStatus == 'belumdipulangkan') {
            $transMessage = 'Pasien Belum Dipulangkan';
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'ramdanegie',
            );
        } else if ($transStatus == 'true') {
            if (isset($r_NewPD['isjkn']) && $r_NewPD['isjkn'] == true) {
                $saveAdminstrasi = $this->saveAdministrasi($request);
                $data = DB::table('antrianpasienregistrasi_t')
                    ->where('kdprofile', $kdProfile)
                    ->where('statusenabled', true)
                    ->where('noreservasi', $r_NewPD['statusschedule'])
                    ->update([
                        'isconfirm' => true,
                    ]);
                DB::commit();
                $transMessage = 'OK';
                $result = array(
                    "metadata" => array(
                        "code" => "200",
                        'dataAPD' => $dataAPD,
                        "message" => $transMessage
                    )
                );
                return $this->setStatusCode(200)->respond($result, $transMessage);
            } else {
                DB::commit();
                $antrol = '';
                if ($r_NewPD['norec_pd'] == '' && $r_NewPD['statusschedule'] != '' && $r_NewPD['statusschedule'] != 'Kios-K') {
                    $antrol = $this->saveAntrolV2($r_NewPD['statusschedule']);
                }

                $transMessage = 'SUKSES';
                $objetoRequest = new \Illuminate\Http\Request();
                $objetoRequest['noregistrasi'] = $dataPD->noregistrasi;
                $ihs = app('App\Http\Controllers\Bridging\IHSController')->Encounter($objetoRequest, true);
                if ($dataPD->ismobilejkn == false && ($dataPD->statusschedule != '' || $dataPD->statusschedule != null)) {
                    $request['norec'] = $dataPD->norec;
                    $request['norec_apd'] = $dataAPD->norec;
                    $this->saveAdministrasi($request);
                }

                $result = array(
                    'status' => 201,
                    'message' => $transMessage,
                    'dataPD' => $dataPD,
                    'dataAPD' => $dataAPD,
                    'antrol' => $antrol,
                    'Encounter' => isset($ihs) ? $ihs : null,
                    'as' => 'ramdanegie',
                );
            }
            if ($kdRuanganTeleme == $dataPD->objectruanganlastfk) {
                $request['norec'] = $dataPD->norec;
                $request['norec_apd'] = $dataAPD->norec;

                $saveAdminstrasi = $this->saveAdministrasi($request);
            }
        } else {
            DB::rollBack();
            if (isset($r_NewPD['isjkn']) && $r_NewPD['isjkn'] == true) {
                $transMessage = 'Gagal';
                $result = array(
                    "metadata" => array(
                        "code" => "201",
                        "message" => $transMessage
                    )
                );
                return $this->setStatusCode(201)->respond($result, $transMessage);
            } else {
                $transMessage = 'Simpan Registrasi Gagal';
                $result = array(
                    'status' => 400,
                    'message' => $transMessage,
                    'dataPD' => $dataPD,
                    'e' => $e->getLine() . $e->getMessage(),
                    'as' => 'ramdanegie',
                );
            }
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getPasienByNoRecPD(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->leftjoin(
                'registrasipelayananpasien_t as rpp',
                'rpp.noregistrasifk',
                '=',
                DB::raw("pd.norec and rpp.objectruanganfk=apd.objectruanganfk")
            )
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('departemen_m as dpm', 'dpm.id', '=', 'ru.objectdepartemenfk')
            ->leftjoin('kelas_m as kls', 'kls.id', '=', 'apd.objectkelasfk')
            ->LEFTJOIN('kamar_m as kmr', 'kmr.id', '=', 'rpp.objectkamarfk')
            ->leftjoin('tempattidur_m as tt', 'tt.id', '=', 'rpp.objecttempattidurfk')
            ->leftjoin('asalrujukan_m as ar', 'ar.id', '=', 'apd.objectasalrujukanfk')
            ->leftjoin('jeniskasus_m as jen', 'jen.id', '=', 'pd.objectjeniskasusfk')
            ->leftjoin('kelompokpasien_m as kps', 'kps.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftjoin('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
            ->leftjoin('jenispelayanan_m as jpl', 'jpl.kodeinternal', '=', 'pd.jenispelayanan')
            ->select(
                'pd.norec as norec_pd',
                'pd.noregistrasi',
                'pd.tglregistrasi',
                'pd.objectruanganlastfk',
                'ru.namaruangan',
                'pd.objectkelasfk',
                'kls.namakelas',
                'rpp.objectkamarfk',
                'kmr.namakamar',
                'rpp.objecttempattidurfk',
                'apd.objectasalrujukanfk',
                'ar.asalrujukan',
                'pd.objectkelompokpasienlastfk',
                'kps.kelompokpasien',
                'pd.objectrekananfk',
                'rk.namarekanan',
                'jpl.kodeinternal as objectjenispelayananfk',
                'jpl.jenispelayanan',
                'pd.objectpegawaifk',
                'pg.namalengkap as dokter',
                'ru.objectdepartemenfk',
                'tt.reportdisplay',
                'apd.objectasalrujukanfk',
                'pd.objectjeniskasusfk',
                'jen.jeniskasus',
                'pg.kddokterbpjs',
                'ru.noruangan as kdruanganbpjs',
                DB::raw('case when ru.objectdepartemenfk in (16,35,17) then \'true\'
                when ru.objectdepartemenfk =45 then \'edelweis\' else \'false\' end as israwatinap')
            )
            ->where('pd.norec', $request['norecPD'])
            ->where('apd.norec', $request['norecAPD'])
            ->where('pd.kdprofile', (int)$kdProfile)
            //            ->whereNull('apd.objectruanganasalfk')
            ->get();

        $result = array(
            'data' => $data,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function getDiagnosaSaeutik(Request $request)
    {
        $req = $request->all();
        $datRek = \DB::table('diagnosa_m as dg')
            ->select(
                'dg.id',
                'dg.kddiagnosa',
                'dg.namadiagnosa',
                DB::raw("dg.kddiagnosa || '-' || dg.namadiagnosa as nama")
            )
            // DB::raw("dg.kddiagnosa + '-' + dg.namadiagnosa as nama"))
            ->where('dg.statusenabled', true)
            ->orderBy('dg.kddiagnosa');

        if (
            isset($req['kddiagnosa']) &&
            $req['kddiagnosa'] != "" &&
            $req['kddiagnosa'] != "undefined"
        ) {
            $datRek = $datRek->where('dg.kddiagnosa', 'ilike', '%' . $req['kddiagnosa'] . '%');
        };
        if (
            isset($req['id']) &&
            $req['id'] != "" &&
            $req['id'] != "undefined"
        ) {
            $datRek = $datRek->where('dg.id', '=', $req['id']);
        };

        if (
            isset($req['namadiagnosa']) &&
            $req['namadiagnosa'] != "" &&
            $req['namadiagnosa'] != "undefined"
        ) {
            $datRek = $datRek->where('dg.namadiagnosa', 'ilike', '%' . $req['namadiagnosa'] . '%');
        };
        if (
            isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined"
        ) {
            $datRek = $datRek
                ->where('dg.kddiagnosa', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%');
            //                ->orWhere('dg.kddiagnosatindakan','ilike',$req['filter']['filters'][0]['value'].'%' )  ;
        }


        $datRek = $datRek->take(10);
        $datRek = $datRek->get();

        return $this->respond($datRek);
    }

    public function saveAsuransiPasien(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        DB::beginTransaction();
        try {
            //             $cekSEP = PemakaianAsuransi::where('noregistrasifk','!=',$request['pemakaianasuransi']['noregistrasifk'])
            //                 ->where('nosep', $request['pemakaianasuransi']['nosep'])
            //                 ->where('kdprofile',$kdProfile)
            //                 ->first();
            // //            return $this->respond($cekSEP);
            //             if ($request['pemakaianasuransi']['nosep']!= '' &&!empty($cekSEP)){
            //                 $transMessage = "No SEP sudah ada di pasien lain dengan no Kartu ".$cekSEP->nokepesertaan;
            //                 DB::rollBack();
            //                 $result = array(
            //                     "status" => 400,
            //                     "message"  => $transMessage,
            //                     "as" => 'as@epic',
            //                 );
            //                 return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            //             }
            if ($request['asuransipasien']['kelompokpasien'] != 'null' || $request['asuransipasien']['kelompokpasien'] != 'undefined') {
                $updateKPS = PasienDaftar::where('noregistrasi', $request['asuransipasien']['noregistrasi'])
                    ->update(
                        [
                            'objectkelompokpasienlastfk' =>  $request['asuransipasien']['kelompokpasien'],
                            'objectrekananfk' =>  $request['asuransipasien']['kdpenjaminpasien'],
                        ]
                    );
            }
            if ($request['asuransipasien']['notelpmobile'] != '') {
                $updatepas = Pasien::where('nocm', $request['asuransipasien']['nocm'])
                    ->update(
                        [
                            'notelepon' =>  $request['asuransipasien']['notelpmobile'],
                        ]
                    );
            }

            if ($request['asuransipasien']['id_ap'] == '') {
                $cekAsuransi = AsuransiPasien::where('nocmfk', $request['asuransipasien']['nocmfkpasien'])
                    ->where('kdpenjaminpasien', $request['asuransipasien']['kdpenjaminpasien'])
                    ->where('kdprofile', $kdProfile)
                    ->get();
                if (count($cekAsuransi) > 0) {
                    $dataUpdate = array(
                        'alamatlengkap' => $request['asuransipasien']['alamat'],
                        'objecthubunganpesertafk' => $request['asuransipasien']['objecthubunganpesertafk'],
                        'objectjeniskelaminfk' => $request['asuransipasien']['objectjeniskelaminfk'],
                        'kdinstitusiasal' => $request['asuransipasien']['kdinstitusiasal'],
                        'notelpmobile' => $request['asuransipasien']['notelpmobile'],
                        'jenispeserta' => $request['asuransipasien']['jenispeserta'],
                        'kdprovider' => $request['asuransipasien']['kdprovider'],
                        'nmprovider' => $request['asuransipasien']['nmprovider'],
                        'kdpenjaminpasien' => $request['asuransipasien']['kdpenjaminpasien'],
                        'objectkelasdijaminfk' => $request['asuransipasien']['objectkelasdijaminfk'],
                        'namapeserta' => $request['asuransipasien']['namapeserta'],
                        'nikinstitusiasal' => $request['asuransipasien']['nikinstitusiasal'],
                        'noasuransi' => $request['asuransipasien']['noasuransi'],
                        'noidentitas' => $request['asuransipasien']['noidentitas'],
                        'qasuransi' => $request['asuransipasien']['qasuransi'],
                        'tgllahir' => $request['asuransipasien']['tgllahir'],
                    );
                    AsuransiPasien::where('nocmfk', $request['asuransipasien']['nocmfkpasien'])
                        ->where('kdpenjaminpasien', $request['asuransipasien']['kdpenjaminpasien'])
                        ->where('kdprofile', $kdProfile)
                        ->update($dataUpdate);
                    $newId = $cekAsuransi[0]->id;
                    $dataAP = AsuransiPasien::where('id', $newId)->first();
                } else {
                    $newId = AsuransiPasien::max('id');
                    $newId = $newId + 1;
                    $dataAP = new AsuransiPasien();
                    $dataAP->id = $newId;
                    $dataAP->kdprofile = (int)$kdProfile;
                    $dataAP->statusenabled = true;
                    $dataAP->norec = $dataAP->generateNewId();
                    $dataAP->alamatlengkap = $request['asuransipasien']['alamat'];
                    $dataAP->objecthubunganpesertafk = $request['asuransipasien']['objecthubunganpesertafk'];
                    $dataAP->objectjeniskelaminfk = $request['asuransipasien']['objectjeniskelaminfk'];
                    $dataAP->kdinstitusiasal = $request['asuransipasien']['kdinstitusiasal'];
                    $dataAP->notelpmobile = $request['asuransipasien']['notelpmobile'];
                    $dataAP->jenispeserta = $request['asuransipasien']['jenispeserta'];
                    $dataAP->kdprovider = $request['asuransipasien']['kdprovider'];
                    $dataAP->nmprovider = $request['asuransipasien']['nmprovider'];
                    $dataAP->kdpenjaminpasien = $request['asuransipasien']['kdpenjaminpasien'];
                    $dataAP->objectkelasdijaminfk = $request['asuransipasien']['objectkelasdijaminfk'];
                    $dataAP->namapeserta = $request['asuransipasien']['namapeserta'];
                    $dataAP->nikinstitusiasal = $request['asuransipasien']['nikinstitusiasal'];
                    $dataAP->noasuransi = $request['asuransipasien']['noasuransi'];
                    $dataAP->nocmfk = $request['asuransipasien']['nocmfkpasien'];
                    $dataAP->noidentitas = $request['asuransipasien']['noidentitas'];
                    $dataAP->qasuransi = $request['asuransipasien']['qasuransi'];
                    $dataAP->tgllahir = $request['asuransipasien']['tgllahir'];
                    $dataAP->save();
                    $newId  = $dataAP->id;
                }
            } else {
                $dataAP =  AsuransiPasien::where('id', $request['asuransipasien']['id_ap'])->first();
                $newId = $dataAP->id;
                $dataAP->alamatlengkap = $request['asuransipasien']['alamat'];
                $dataAP->objecthubunganpesertafk = $request['asuransipasien']['objecthubunganpesertafk'];
                $dataAP->objectjeniskelaminfk = $request['asuransipasien']['objectjeniskelaminfk'];
                $dataAP->kdinstitusiasal = $request['asuransipasien']['kdinstitusiasal'];
                $dataAP->notelpmobile = $request['asuransipasien']['notelpmobile'];
                $dataAP->jenispeserta = $request['asuransipasien']['jenispeserta'];
                $dataAP->kdprovider = $request['asuransipasien']['kdprovider'];
                $dataAP->nmprovider = $request['asuransipasien']['nmprovider'];
                $dataAP->kdpenjaminpasien = $request['asuransipasien']['kdpenjaminpasien'];
                $dataAP->objectkelasdijaminfk = $request['asuransipasien']['objectkelasdijaminfk'];
                $dataAP->namapeserta = $request['asuransipasien']['namapeserta'];
                $dataAP->nikinstitusiasal = $request['asuransipasien']['nikinstitusiasal'];
                $dataAP->noasuransi = $request['asuransipasien']['noasuransi'];
                $dataAP->nocmfk = $request['asuransipasien']['nocmfkpasien'];
                $dataAP->noidentitas = $request['asuransipasien']['noidentitas'];
                $dataAP->qasuransi = $request['asuransipasien']['qasuransi'];
                $dataAP->tgllahir = $request['asuransipasien']['tgllahir'];
                $dataAP->save();
            }

            $idAP  = $newId;
            $cekPemakaian = PemakaianAsuransi::where('noregistrasifk', $request['pemakaianasuransi']['noregistrasifk'])
                ->where('kdprofile', $kdProfile)
                ->first();
            if (empty($cekPemakaian)) {
                $dataPA = new PemakaianAsuransi();
                $dataPA->norec = $dataPA->generateNewId();;
                $dataPA->kdprofile = (int)$kdProfile;
                $dataPA->statusenabled = true;
                $dataPA->tglcreate = date('Y-m-d');
            } else {
                $dataPA = $cekPemakaian;
            }
            $dataPA->noregistrasifk = $request['pemakaianasuransi']['noregistrasifk'];
            $dataPA->tglregistrasi = $request['pemakaianasuransi']['tglregistrasi'];
            $dataPA->diagnosisfk = $request['pemakaianasuransi']['diagnosisfk'];
            $dataPA->lakalantas = $request['pemakaianasuransi']['lakalantas'];
            $dataPA->nokepesertaan = $request['pemakaianasuransi']['nokepesertaan'];
            $dataPA->norujukan = $request['pemakaianasuransi']['norujukan'];
            $dataPA->nosep = $request['pemakaianasuransi']['nosep'];
            $dataPA->ppkrujukan = $request['asuransipasien']['kdprovider'];
            $dataPA->tglrujukan = $request['pemakaianasuransi']['tglrujukan'];
            $dataPA->objectasuransipasienfk = $idAP;
            $dataPA->objectdiagnosafk = $request['pemakaianasuransi']['objectdiagnosafk'];
            $dataPA->tanggalsep = $request['pemakaianasuransi']['tanggalsep'];
            $dataPA->catatan = $request['pemakaianasuransi']['catatan'];
            $dataPA->lokasilakalantas = $request['pemakaianasuransi']['lokasilaka'];
            $dataPA->penjaminlaka = $request['pemakaianasuransi']['penjaminlaka'];
            $dataPA->asalrujukanfk = $request['pemakaianasuransi']['asalrujukanfk'];

            /*** nu anyar Vclaim 1.1*/
            if (isset($request['pemakaianasuransi']['cob'])) {
                $dataPA->cob = $request['pemakaianasuransi']['cob'];
            }
            if (isset($request['pemakaianasuransi']['katarak'])) {
                $dataPA->katarak = $request['pemakaianasuransi']['katarak'];
            }
            if (isset($request['pemakaianasuransi']['keteranganlaka'])) {
                $dataPA->keteranganlaka = $request['pemakaianasuransi']['keteranganlaka'];
            }
            if (isset($request['pemakaianasuransi']['tglkejadian'])) {
                $dataPA->tglkejadian = $request['pemakaianasuransi']['tglkejadian'];
            }
            if (isset($request['pemakaianasuransi']['suplesi'])) {
                $dataPA->suplesi = $request['pemakaianasuransi']['suplesi'];
            }
            if (isset($request['pemakaianasuransi']['nosepsuplesi'])) {
                $dataPA->nosepsuplesi = $request['pemakaianasuransi']['nosepsuplesi'];
            }
            if (isset($request['pemakaianasuransi']['kdpropinsi'])) {
                $dataPA->kdpropinsi = $request['pemakaianasuransi']['kdpropinsi'];
            }
            if (isset($request['pemakaianasuransi']['namapropinsi'])) {
                $dataPA->namapropinsi = $request['pemakaianasuransi']['namapropinsi'];
            }
            if (isset($request['pemakaianasuransi']['kdkabupaten'])) {
                $dataPA->kdkabupaten = $request['pemakaianasuransi']['kdkabupaten'];
            }
            if (isset($request['pemakaianasuransi']['namakabupaten'])) {
                $dataPA->namakabupaten = $request['pemakaianasuransi']['namakabupaten'];
            }
            if (isset($request['pemakaianasuransi']['kdkecamatan'])) {
                $dataPA->kdkecamatan = $request['pemakaianasuransi']['kdkecamatan'];
            }
            if (isset($request['pemakaianasuransi']['namakecamatan'])) {
                $dataPA->namakecamatan = $request['pemakaianasuransi']['namakecamatan'];
            }
            if (isset($request['pemakaianasuransi']['nosuratskdp'])) {
                $dataPA->nosuratskdp = $request['pemakaianasuransi']['nosuratskdp'];
            }
            if (isset($request['pemakaianasuransi']['kodedpjp'])) {
                $dataPA->kodedpjp = $request['pemakaianasuransi']['kodedpjp'];
                if (!isset($request['pemakaianasuransi']['kodedpjpmelayani'])) {
                    $dataPA->kodedpjpmelayani = $request['pemakaianasuransi']['kodedpjp'];
                }
            }
            if (isset($request['pemakaianasuransi']['namadpjp'])) {
                $dataPA->namadpjp = $request['pemakaianasuransi']['namadpjp'];
                if (!isset($request['pemakaianasuransi']['namadjpjpmelayanni'])) {
                    $dataPA->namadjpjpmelayanni = $request['pemakaianasuransi']['namadpjp'];
                }
            }
            if (isset($request['pemakaianasuransi']['prolanisprb'])) {
                $dataPA->prolanisprb = $request['pemakaianasuransi']['prolanisprb'];
            }

            if (isset($request['pemakaianasuransi']['polirujukankode'])) {
                $dataPA->polirujukankode = $request['pemakaianasuransi']['polirujukankode'];
            }
            if (isset($request['pemakaianasuransi']['polirujukannama'])) {
                $dataPA->polirujukannama = $request['pemakaianasuransi']['polirujukannama'];
            }
            if (isset($request['pemakaianasuransi']['kodedpjpmelayani'])) {
                $dataPA->kodedpjpmelayani = $request['pemakaianasuransi']['kodedpjpmelayani'];
            }
            if (isset($request['pemakaianasuransi']['namadjpjpmelayanni'])) {
                $dataPA->namadjpjpmelayanni = $request['pemakaianasuransi']['namadjpjpmelayanni'];
            }

            $pemA = $request['pemakaianasuransi'];
            if (isset($pemA['klsrawatnaik'])) {
                $dataPA->klsrawatnaik = $pemA['klsrawatnaik'];
            }
            if (isset($pemA['pembiayaan'])) {
                $dataPA->pembiayaan = $pemA['pembiayaan'];
            }
            if (isset($pemA['penanggungjawab'])) {
                $dataPA->penanggungjawab = $pemA['penanggungjawab'];
            }
            if (isset($pemA['tujuankunj'])) {
                $dataPA->tujuankunj = $pemA['tujuankunj'];
            }
            if (isset($pemA['flagprocedure'])) {
                $dataPA->flagprocedure = $pemA['flagprocedure'];
            }
            if (isset($pemA['kdpenunjang'])) {
                $dataPA->kdpenunjang = $pemA['kdpenunjang'];
            }
            if (isset($pemA['assesmentpel'])) {
                $dataPA->assesmentpel = $pemA['assesmentpel'];
            }
            if (isset($pemA['statuskunjungan'])) {
                $dataPA->statuskunjungan = $pemA['statuskunjungan'];
            }
            if (isset($pemA['poliasalkode'])) {
                $dataPA->poliasalkode = $pemA['poliasalkode'];
            }
            if (isset($pemA['politujuankode'])) {
                $dataPA->politujuankode = $pemA['politujuankode'];
            }


            /*** end nu anyar */
            $dataPA->save();



            if (
                isset($request['asuransipasien']['tgllahir']) && $request['asuransipasien']['tgllahir'] != null
                && isset($request['asuransipasien']['noasuransi']) && $request['asuransipasien']['noasuransi'] != null
            ) {
                $pasien = Pasien::where('id', $request['asuransipasien']['nocmfkpasien'])->update(
                    [
                        'tgllahir' => $request['asuransipasien']['tgllahir'],
                        'nobpjs' => $request['asuransipasien']['noasuransi'],
                        'noidentitas' => $request['asuransipasien']['noidentitas'],
                        'nohp' => $request['asuransipasien']['notelpmobile']

                    ]
                );
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }


        if ($transStatus == 'true') {
            $transMessage = "Simpan Asuransi Pasien";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'PA' => $dataPA,
                'AP' => $dataAP,
                'as' => 'er@epic',
            );
        } else {
            $transMessage = "Gagal Simpan Asuransi Pasien";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                //                'PA' => $dataPA,
                //                'AP' => $dataAP,
                'as' => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getPenjaminByKelompokPasien(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $data = \DB::table('mapkelompokpasientopenjamin_m as mkp')
            ->join('kelompokpasien_m as kp', 'kp.id', '=', 'mkp.objectkelompokpasienfk')
            ->join('rekanan_m as rk', 'rk.id', '=', 'mkp.kdpenjaminpasien')
            ->select('rk.id', 'rk.namarekanan', 'kp.id as id_kelompokpasien', 'kp.kelompokpasien')
            //            ->where('mkp.objectkelompokpasienfk', $request['kdKelompokPasien'])
            ->where('mkp.statusenabled', true)
            ->where('mkp.kdprofile', (int)$kdProfile);
        //            ->get();

        if (isset($request['kdKelompokPasien']) && $request['kdKelompokPasien'] != "" && $request['kdKelompokPasien'] != "undefined") {
            $data = $data->where('mkp.objectkelompokpasienfk', '=', $request['kdKelompokPasien']);
        };
        $data = $data->get();

        $result = array(
            'rekanan' => $data,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }

    public function getAsuransiPasienByNoCm(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $data = \DB::table('asuransipasien_m as ap')
            ->join('pasien_m as ps', 'ps.id', '=', 'ap.nocmfk')
            ->select('ps.nocm', 'ps.namapasien', 'ap.nocmfk', 'ap.id as id_ap')
            ->where('ap.kdprofile', (int)$kdProfile);
        if (isset($request['nocm']) && $request['nocm'] != "" && $request['nocm'] != "undefined") {
            $data = $data->where('ps.nocm', '=', $request['nocm']);
        };
        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function getPasienByNoreg(Request $request)
    {
        $norec_pd = $request['norec_pd'];
        $norec_apd = $request['norec_apd'];
        $kdProfile = $this->getDataKdProfile($request);
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftjoin('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->leftjoin('alamat_m as alm', 'alm.nocmfk', '=', 'ps.id')
            ->leftjoin('pendidikan_m as pdd', 'pdd.id', '=', 'ps.objectpendidikanfk')
            ->leftjoin('pekerjaan_m as pk', 'pk.id', '=', 'ps.objectpekerjaanfk')
            ->leftjoin('kelompokpasien_m as kps', 'kps.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftjoin('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('departemen_m as dpm', 'dpm.id', '=', 'ru.objectdepartemenfk')
            ->leftjoin('pegawai_m as peg', 'peg.id', '=', 'pd.objectpegawaifk')
            ->join('kelas_m as kls', 'kls.id', '=', 'apd.objectkelasfk')
            ->LEFTjoin('jenispelayanan_m as jpl', 'jpl.kodeinternal', '=', 'pd.jenispelayanan')
            ->select(
                'ps.nocm',
                'ps.id as nocmfk',
                'ps.noidentitas',
                'ps.namapasien',
                'pd.noregistrasi',
                'pd.tglregistrasi',
                'jk.jeniskelamin',
                'ps.tgllahir',
                'alm.alamatlengkap',
                'pdd.pendidikan',
                'pk.pekerjaan',
                'ps.nohp as notelepon',
                'ps.objectjeniskelaminfk',
                'apd.objectruanganfk',
                'ru.namaruangan',
                'apd.norec as norec_apd',
                'pd.norec as norec_pd',
                'kps.kelompokpasien',
                'kls.namakelas',
                'apd.objectkelasfk',
                'pd.objectkelompokpasienlastfk',
                'pd.objectrekananfk',
                'rk.namarekanan',
                'pd.objectruanganlastfk',
                'jpl.jenispelayanan',
                'apd.objectasalrujukanfk',
                'ru.kdinternal',
                'ru.id as idruangan',
                'ru.noruangan',
                'jpl.kodeinternal as objectjenispelayananfk',
                'pd.objectpegawaifk',
                'pd.statuspasien',
                'ps.nobpjs',
                'pd.statuspasien',
                'ru.namaexternal',
                'peg.kddokterbpjs',
                'apd.noantrian',
                DB::raw('case when ru.objectdepartemenfk in (16,35,17) then \'true\' else \'false\' end as israwatinap'),
                DB::raw("case when pd.statusschedule = '' then pd.noregistrasi when pd.statusschedule = 'Kios-K' then pd.noregistrasi else pd.statusschedule end as kodebooking")
            )
            ->where('pd.norec', '=', $norec_pd)
            ->where('apd.norec', '=', $norec_apd)
            ->where('pd.kdprofile', (int)$kdProfile)
            ->get();
        //           try {
        //                   $umur = $this->hitungUmur($data->tgllahir);
        //               } catch (\Exception $e) {
        //                   $umur = '-';
        //               }
        return $this->respond($data);

        //        $result = array(
        //            'nocm' => $data->nocm,
        //            'nocmfk' => $data->nocmfk,
        //            'noidentitas' => $data->noidentitas,
        //            'namapasien' => $data->namapasien,
        //            'noregistrasi' => $data->noregistrasi,
        //            'tglregistrasi' => $data->tglregistrasi,
        //            'tgllahir' => $data->tgllahir,
        //            'alamatlengkap' => $data->alamatlengkap,
        //            'pendidikan' => $data->pendidikan,
        //            'pekerjaan' => $data->pekerjaan,
        //            'notelepon' => $data->notelepon,
        //            'objectjeniskelaminfk' =>$data->objectjeniskelaminfk,
        //            'objectruanganfk' => $data->objectruanganfk,
        //            'namaruangan' => $data->namaruangan,
        //            'norec_apd' => $data->norec_apd,
        //            'norec_pd' => $data->norec_pd,
        //            'kelompokpasien' => $data->kelompokpasien,
        //            'namakelas' => $data->namakelas,
        //            'objectkelasfk' =>$data->objectkelasfk,
        //            'objectkelompokpasienlastfk' => $data->objectkelompokpasienlastfk,
        //            'objectrekananfk' =>$data->objectrekananfk,
        //            'namarekanan' => $data->namarekanan,
        //            'objectruanganlastfk' => $data->objectruanganlastfk,
        //            'kdinternal' => $data->kdinternal,
        //            'jenispelayanan' => $data->jenispelayanan,
        ////            'kodeinternal' => $data->kodeinternal,
        //            'objectjenispelayananfk' => $data->objectjenispelayananfk,
        //            'umur' => $umur,

        //        );
        //        return $this->respond($result);
    }

    public function getHistoryPemakaianAsuransi(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $data = \DB::table('pemakaianasuransi_t as pa')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'pa.noregistrasifk')
            ->leftjoin('asuransipasien_m as apn', 'apn.id', '=', 'pa.objectasuransipasienfk')
            ->join('rekanan_m as rek', 'rek.id', '=', 'apn.kdpenjaminpasien')
            ->leftjoin('rekanan_m as rek2', 'rek2.id', '=', 'pd.objectrekananfk')
            ->join('hubunganpesertaasuransi_m as hpa', 'hpa.id', '=', 'apn.objecthubunganpesertafk')
            ->join('kelas_m as kls', 'kls.id', '=', 'apn.objectkelasdijaminfk')
            ->leftjoin('diagnosa_m as dg', 'dg.id', '=', 'pa.objectdiagnosafk')
            ->leftjoin('kelompokpasien_m as kps', 'kps.id', '=', 'pd.objectkelompokpasienlastfk')
            ->select(
                'rek.namarekanan',
                'pd.noregistrasi',
                'pa.nokepesertaan',
                'apn.namapeserta',
                'apn.noasuransi',
                'apn.tgllahir',
                'apn.noidentitas',
                'apn.alamatlengkap',
                'apn.objecthubunganpesertafk',
                'pa.nosep',
                'pa.tanggalsep',
                'apn.objectkelasdijaminfk',
                'kls.namakelas',
                'pa.catatan',
                'pa.norujukan',
                'apn.kdprovider',
                'apn.nmprovider',
                'pa.tglrujukan',
                'pa.objectdiagnosafk',
                'dg.kddiagnosa',
                'dg.namadiagnosa',
                'pa.lakalantas',
                'pa.ppkrujukan',
                'pa.lokasilakalantas',
                'pa.penjaminlaka',
                'pd.objectkelompokpasienlastfk',
                'pd.objectrekananfk',
                'rek2.namarekanan as namarekananpd',
                'kps.kelompokpasien',
                'apn.kdpenjaminpasien',
                'apn.jenispeserta',
                'hpa.hubunganpeserta',
                'apn.tgllahir'
            )
            ->where('pa.norec', $request['noregistrasi'])
            ->where('pa.kdprofile', (int)$kdProfile)
            ->orWhere('pd.noregistrasi', $request['noregistrasi'])
            ->get();

        $result = array(
            'data' => $data,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }

    public function getDaftarPasien(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $data = \DB::table('pasien_m as ps')
            ->leftjoin('alamat_m as alm', function($join) {
                $join->on('alm.nocmfk', '=', 'ps.id')->where('alm.objectjenisalamatfk', '=', 1);
            })
            ->leftjoin('profile_m as pro','pro.id','=','ps.kdprofile')
            ->leftjoin('jeniskelamin_m as jk','jk.id','=','ps.objectjeniskelaminfk')
            ->select('ps.isrmhilang','ps.isinaktif','ps.nocm','ps.namapasien','ps.tgldaftar', 'ps.tgllahir',
                'jk.jeniskelamin','ps.noidentitas','alm.alamatlengkap','ps.nokunjunganterakhir',
                'ps.id as nocmfk','ps.namaayah','ps.notelepon','ps.nohp','ps.tglmeninggal','ps.iskompleks','ps.nobpjs','ps.sidik_jari'//,
//                'ps.foto'
                ,
                DB::raw('case when ps.foto is null then null else \'ada\' end as photo,ps.ihs_number,pro.ihs_id as ihs_profile')
            );
        //        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
        //            $data = $data->where('ps.tgldaftar', '>=', $request['tglAwal']);
        //        }
        //        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
        //            $tgl = $request['tglAkhir'];
        //            $data = $data->where('ps.tgldaftar', '<=', $tgl);
        //        }
        if (isset($request['tglLahir']) && $request['tglLahir'] != "" && $request['tglLahir'] != "undefined") {
            $data = $data->where('ps.tgllahir', '>=', $request['tglLahir'] . ' 00:00');
        };
        if (isset($request['tglLahir']) && $request['tglLahir'] != "" && $request['tglLahir'] != "undefined") {
            $data = $data->where('ps.tgllahir', '<=', $request['tglLahir'] . ' 23:59');
        };
        if (isset($request['norm']) && $request['norm'] != "" && $request['norm'] != "undefined") {
            $data = $data->where('ps.nocm', 'ilike', '%' . $request['norm'] . '%');
            //                ->OrWhere('ps.namapasien', 'ilike', '%'. $request['norm'] .'%');
        };
        if (isset($request['namaPasien']) && $request['namaPasien'] != "" && $request['namaPasien'] != "undefined") {
            $data = $data->where('ps.namapasien', 'ilike', '%' . $request['namaPasien'] . '%');
            //                ->OrWhere('ps.namapasien', 'ilike', '%'. $request['norm'] .'%');
        };
        if (isset($request['alamat']) && $request['alamat'] != "" && $request['alamat'] != "undefined") {
            $data = $data->where('alm.alamatlengkap', 'ilike', '%' . $request['alamat'] . '%');
        };

        if (isset($request['namaAyah']) && $request['namaAyah'] != "" && $request['namaAyah'] != "undefined") {
            $data = $data->where('ps.namaayah', 'ilike', '%' . $request['namaAyah'] . '%');
        };
        if (isset($request['nik']) && $request['nik'] != "" && $request['nik'] != "undefined") {
            $data = $data->where('ps.noidentitas', '=', $request['nik']);
            //                ->OrWhere('ps.namapasien', 'ilike', '%'. $request['norm'] .'%');
        };
        if (isset($request['bpjs']) && $request['bpjs'] != "" && $request['bpjs'] != "undefined") {
            $data = $data->where('ps.nobpjs', '=', $request['bpjs']);
        };
        if (isset($request['Rows']) && $request['Rows'] != "" && $request['Rows'] != "undefined") {
            $data = $data->take(($request['Rows']));
        };
        if (isset($request['inaktif']) && $request['inaktif'] != "" && $request['inaktif'] != "undefined") {
            $data = $data->where('ps.isinaktif', true);
        };
        if (isset($request['rmhilang']) && $request['rmhilang'] != "" && $request['rmhilang'] != "undefined") {
            $data = $data->where('ps.isrmhilang', true);
        };
        $data = $data->where('ps.kdprofile', (int)$kdProfile);
        $data = $data->where('ps.statusenabled',true);
        $data = $data->orderBy('ps.id','desc');
        $data=$data->get();
        $data2= [];
        foreach ($data as $item){
//           if( $item->foto != null){
//               $item->foto = "data:image/jpeg;base64," . base64_encode($item->foto);
//           }
            $data2 [] = array(
                'nocm'=> $item->nocm,
                'namapasien'=> $item->namapasien,
                'tgldaftar'=> $item->tgldaftar,
                'jeniskelamin'=> $item->jeniskelamin,
                'noidentitas'=> $item->noidentitas,
                'alamatlengkap'=> $item->alamatlengkap,
                'nocmfk'=> $item->nocmfk,
                'namaayah'=> $item->namaayah,
                'notelepon'=> $item->notelepon,
                'nohp'=> $item->nohp,
                'tglmeninggal'=> $item->tglmeninggal,
//                'foto'=> $item->foto,
//                'photo'=> $item->photo,
                'iskompleks'=> $item->iskompleks,
                'sidik_jari'=> $item->sidik_jari,
                'isinaktif'=> $item->isinaktif,
                'isrmhilang'=> $item->isrmhilang,
            );
        }
        $result = array(
            'daftar' => $data,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function cekTglPulangPasien(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $data = \DB::table('pasien_m as ps')
            ->leftjoin('pasiendaftar_t as pd', 'pd.nocmfk', '=', 'ps.id')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftjoin('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
            ->select('ps.nocm', 'ps.id as nocmfk', 'ps.namapasien', 'pd.tglpulang')
            ->where('ps.nocm', $request['noCm'])
            ->wherein('ru.objectdepartemenfk', [16, 35, 17])
            ->where('ps.kdprofile', (int)$kdProfile)
            ->get();

        $result = array(
            'data' => $data,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }

    public function getPasienBatalRegistrasi(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];

        $noreg = '';
        if (isset($request['noReg']) && $request['noReg'] != '') {
            $noreg = "and pd.noregistrasi = '" . $request['noReg'] . "'";
        }

        $nocm = '';
        if (isset($request['noCm']) && $request['noCm'] != '') {
            $nocm = "and ps.nocm = '" . $request['noCm'] . "'";
        }

        $namapasien = '';
        if (isset($request['namaPasien']) && $request['namaPasien'] != '') {
            $namapasien = "and ps.namapasien = '" . $request['namaPasien'] . "'";
        }

        $data = DB::select(DB::raw("select apd.norec norecapd, pp.norec norecpp, kp.kelompokpasien, ps.namapasien, pd.tglregistrasi, ps.nocm, pd.norec, pd.noregistrasi, ru.namaruangan, pr.namaproduk, 
        case when pp.statusenabled = false then 0 else j.jumlahpelayanan end as jumlahpelayanan,
        case when pp.statusenabled = false then 0 else pp.harganetto * pp.jumlah end as biaya
        from pasiendaftar_t as pd
		inner join pasien_m as ps on ps.id = pd.nocmfk
        inner join antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
        inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
        inner JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
        inner join produk_m pr on pr.id = pp.produkfk
        inner join kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
        inner join(
            select count(nourut) jumlahpelayanan, tglregistrasi, noregistrasi, norec
            from(
                select DENSE_RANK ( ) OVER ( order by pd.noregistrasi ) nourut, pd.tglregistrasi, pd.norec, pd.noregistrasi, ru.namaruangan, pr.namaproduk
                from pasiendaftar_t as pd
                inner join antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
                inner JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                inner join produk_m pr on pr.id = pp.produkfk
                where pd.kdprofile = 30
                and ru.objectdepartemenfk = 18
                and pd.tglregistrasi::date between '$tglAwal' and to_date('$tglAkhir', 'YYYY-MM-DD') - INTERVAL '1 DAY'
                group by pd.tglregistrasi, pd.norec, pd.noregistrasi, ru.namaruangan, pr.namaproduk
            ) as i group by tglregistrasi, noregistrasi, norec
        ) as j on j.norec = pd.norec
        left join batalregistrasi_t br on br.pasiendaftarfk = pd.norec
        where pd.kdprofile = 30
        and ru.objectdepartemenfk = 18
        and j.jumlahpelayanan = 1
        and pr.id in(5008644, 5008635, 5008645, 5008636)
        and pd.tglregistrasi::date between '$tglAwal' and to_date('$tglAkhir', 'YYYY-MM-DD') - INTERVAL '1 DAY'
        $noreg
        $nocm
        $namapasien
        group by apd.norec, pp.norec, kp.kelompokpasien, ps.namapasien, j.jumlahpelayanan, pd.tglregistrasi, ps.nocm, pd.norec, pd.noregistrasi, ru.namaruangan, pr.namaproduk, pp.harganetto * pp.jumlah
        order by pd.tglregistrasi::date asc"));

        $result = array(
            'data' => $data,
            'message' => 'larasatizka',
        );
        return $this->respond($result);
    }

    public function savePasienBatalRegistrasi(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        DB::beginTransaction();
        try {
            for ($x = 0; $x < count($request['data']); $x++) {
                $PP = PelayananPasien::where('norec', '=', $request['data'][$x]['norecpp'])->first();
                $PP->statusenabled = false;
                $PP->save();
                $PPD = PelayananPasienDetail::where('pelayananpasien', '=', $request['data'][$x]['norecpp'])->first();
                $PPD->statusenabled = false;
                $PPD->save();
                $PD = PasienDaftar::where('norec', '=', $request['data'][$x]['norec'])->first();
                $PD->statusenabled = false;
                $PD->save();
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $PD,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'line' => $e->getLine(),
                'message' => $e->getMessage(),
                'as' => '@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getAntrianPasien(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        if ($request['objectruanganlastfk'] != "") {
            $noreg =  $request['noregistrasi'];
            $ruanganLast = $request['objectruanganlastfk'];
            $data = DB::select(DB::raw("
             select apd.norec as norec_apd,  ps.nocm,  ps.id as nocmfk,  ps.namapasien,  pd.noregistrasi,  apd.objectruanganfk,
             ru.namaruangan,  apd.tglregistrasi,  kls.namakelas,  apd.objectruanganasalfk,
             row_number() over (partition by pd.noregistrasi order by apd.tglmasuk desc) as rownum
             from antrianpasiendiperiksa_t as apd
             inner join pasiendaftar_t as pd on pd.norec = apd.noregistrasifk
             left join ruangan_m as ru on ru.id = apd.objectruanganfk
             inner join pasien_m as ps on ps.id = pd.nocmfk
             inner join kelas_m as kls on kls.id = apd.objectkelasfk
             where apd.kdprofile = $idProfile  and pd.noregistrasi = '$noreg' and apd.objectruanganfk = '$ruanganLast'"));
            //                \DB::table('antrianpasiendiperiksa_t as apd')
            //                ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            //                ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            //                ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            //                ->join('kelas_m as kls', 'kls.id', '=', 'apd.objectkelasfk')
            //                ->select('apd.norec as norec_apd', 'ps.nocm', 'ps.id as nocmfk', 'ps.namapasien', 'pd.noregistrasi', 'apd.objectruanganfk',
            //                    'ru.namaruangan', 'apd.tglregistrasi', 'kls.namakelas', 'apd.objectruanganasalfk')
            //                ->where('pd.noregistrasi', $request['noregistrasi'])
            //                ->where('apd.objectruanganfk', $request['objectruanganlastfk'])
            ////            ->whereNull('apd.objectruanganasalfk')
            //                ->get();
        } else {
            $data = \DB::table('antrianpasiendiperiksa_t as apd')
                ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                ->join('kelas_m as kls', 'kls.id', '=', 'apd.objectkelasfk')
                ->select(
                    'apd.norec as norec_apd',
                    'ps.nocm',
                    'ps.id as nocmfk',
                    'ps.namapasien',
                    'pd.noregistrasi',
                    'apd.objectruanganfk',
                    'ru.namaruangan',
                    'apd.tglregistrasi',
                    'kls.namakelas',
                    'apd.objectruanganasalfk'
                )
                ->where('pd.noregistrasi', $request['noregistrasi'])
                ->where('apd.kdprofile', (int)$kdProfile)
                //                ->where('apd.objectruanganfk', $request['objectruanganlastfk'])
                ->whereNull('apd.objectruanganasalfk')
                ->get();
        }


        $result = array(
            'data' => $data,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function getDataComboRegLama(Request $request)
    {
        $dataLogin = $request->all();
        $kdProfile = $this->getDataKdProfile($request);
        $dataDokter = \DB::table('pegawai_m as ru')
            ->select('ru.id', 'ru.id as dokterId', 'ru.namalengkap as namaDokter', 'ru.id as value', 'ru.namalengkap as namaLengkap')
            ->where('ru.statusenabled', true)
            ->where('ru.objectjenispegawaifk', 1)
            ->where('ru.kdprofile', (int)$kdProfile)
            ->orderBy('ru.namalengkap')
            ->get();


        $result = array(
            'dokter' => $dataDokter,
            'datalogin' => $dataLogin,

            'message' => 'niaramdanegie',
        );

        return $this->respond($result);
    }


    public function getComboPindahPulang(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $dataLogin = $request->all();
        $statusKeluar = \DB::table('statuskeluar_m as st')
            ->select('st.id', 'st.statuskeluar')
            ->where('st.statusenabled', true)
            ->orderBy('st.statuskeluar')
            ->get();
        $kondisiKeluar = \DB::table('kondisipasien_m as kp')
            ->select('kp.id', 'kp.kondisipasien')
            ->where('kp.statusenabled', true)
            ->orderBy('kp.kondisipasien')
            ->get();
        $kelas = \DB::table('kelas_m as kls')
            ->select('kls.id', 'kls.namakelas')
            ->where('kls.statusenabled', true)
            ->orderBy('kls.namakelas')
            ->get();
        $kamar = \DB::table('kamar_m as kmr')
            ->select('kmr.id', 'kmr.namakamar')
            ->where('kmr.statusenabled', true)
            ->orderBy('kmr.namakamar')
            ->get();
        $ruanganInap = \DB::table('ruangan_m as ru')
            ->select('ru.id', 'ru.namaruangan', 'ru.objectdepartemenfk')
            ->where('ru.statusenabled', true)
            ->wherein('ru.objectdepartemenfk', [16, 35, 17])
            ->where('ru.kdprofile', (int)$kdProfile)
            ->orderBy('ru.namaruangan')
            ->get();
        $statusPulang = \DB::table('statuspulang_m as sp')
            ->select('sp.id', 'sp.statuspulang')
            ->where('sp.statusenabled', true)
            ->orderBy('sp.statuspulang')
            ->get();
        $hubunganKeluarga = \DB::table('hubungankeluarga_m as sp')
            ->select('sp.id', 'sp.hubungankeluarga')
            ->where('sp.statusenabled', true)
            ->orderBy('sp.hubungankeluarga')
            ->get();
        $penyebabKematian = \DB::table('penyebabkematian_m as sp')
            ->select('sp.id', 'sp.penyebabkematian')
            ->where('sp.statusenabled', true)
            ->orderBy('sp.penyebabkematian')
            ->get();
        $pindah = \DB::table('statuspulang_m as sp')
            ->select('sp.id', 'sp.statuspulang')
            ->where('sp.statusenabled', true)
            ->where('sp.id', 2)
            ->orderBy('sp.statuspulang')
            ->get();
        $result = array(
            'statuskeluar' => $statusKeluar,
            'kondisipasien' => $kondisiKeluar,
            'kelas' => $kelas,
            'ruanganinap' => $ruanganInap,
            'kamar' => $kamar,
            'statuspulang' => $statusPulang,
            'hubungankeluarga' => $hubunganKeluarga,
            'penyebabkematian' => $penyebabKematian,
            'datalogin' => $dataLogin,
            'pindah' => $pindah,
            'message' => 'ramdanegie',
        );

        return $this->respond($result);
    }
    public function savePindahPasien(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $detLogin = $request->all();
        $tglAyeuna = date('Y-m-d H:i:s');
        $r_NewPD = $request['pasiendaftar'];
        $r_NewAPD = $request['antrianpasiendiperiksa'];

        DB::beginTransaction();
        try {
            //##Update Pasiendaftar##
            if ($r_NewPD['norec_pd'] != 'null' || $r_NewPD['norec_pd'] != 'undefined') {
                $updatePD = PasienDaftar::where('noregistrasi', $r_NewPD['noregistrasi'])
                    ->where('kdprofile', $idProfile)
                    ->update(
                        [
                            'objectruanganlastfk' => $r_NewPD['objectruanganlastfk'],
                            'objectkelasfk' => $r_NewPD['objectkelasfk'],
                        ]
                    );
            }
            if ($r_NewAPD['norec_apd'] != 'null' || $r_NewAPD['norec_apd'] != 'undefined') {
                $updateAPD = AntrianPasienDiperiksa::where('norec', $r_NewAPD['norec_apd'])
                    ->where('kdprofile', $idProfile)
                    ->update(
                        [
                            'tglkeluar' => $r_NewAPD['tglmasuk'],
                        ]
                    );


                $ruangasal = DB::select(
                    DB::raw("select * from antrianpasiendiperiksa_t
                         where kdprofile = $idProfile and noregistrasifk=:noregistrasifk and objectruanganfk=:objectruanganasalfk;"),
                    array(
                        'noregistrasifk' => $r_NewPD['norec_pd'],
                        'objectruanganasalfk' => $r_NewPD['objectruanganasalfk'],
                    )
                );

                //update statusbed jadi Kosong
                foreach ($ruangasal as $Hit) {
                    TempatTidur::where('id', $Hit->nobed)->where('kdprofile', $idProfile)->update(['objectstatusbedfk' => 2]);
                }
            }

            if ($request['strukorder']['norecorder'] != '') {
                $updateSO = StrukOrder::where('norec', $request['strukorder']['norecorder'])
                    ->where('kdprofile', $idProfile)
                    ->update(
                        [
                            'statusorder' => 1,
                            'tglvalidasi' => $tglAyeuna
                        ]
                    );
            }

            $countNoAntrian = AntrianPasienDiperiksa::where('objectruanganfk', $r_NewPD['objectruanganlastfk'])
                ->where('kdprofile', $idProfile)
                ->where('tglregistrasi', '>=', $r_NewPD['tglregistrasidate'] . ' 00:00')
                ->where('tglregistrasi', '<=', $r_NewPD['tglregistrasidate'] . ' 23:59')
                ->count('norec');
            $noAntrian = $countNoAntrian + 1;
            //##Save Antroan Pasien Diperiksa##
            //        try{
            $pd = PasienDaftar::where('norec', $r_NewPD['norec_pd'])->first();
            $dataAPD = new AntrianPasienDiperiksa;
            $dataAPD->norec = $dataAPD->generateNewId();
            $dataAPD->kdprofile = $idProfile;
            $dataAPD->statusenabled = true;
            $dataAPD->objectruanganfk = $r_NewAPD['objectruanganlastfk'];
            $dataAPD->objectasalrujukanfk =  $r_NewAPD['objectasalrujukanfk'];
            $dataAPD->objectkamarfk = $r_NewAPD['objectkamarfk'];
            $dataAPD->objectkasuspenyakitfk = null;
            $dataAPD->objectkelasfk = $r_NewAPD['objectkelasfk'];
            $dataAPD->noantrian = $noAntrian; //count tgl pasien perruanga
            $dataAPD->nobed = $r_NewAPD['nobed'];
            //          $dataAPD->nomasuk = '';
            $dataAPD->noregistrasifk = $r_NewPD['norec_pd'];
            //          $dataAPD->objectpegawaifk = $r_NewAPD['objectpegawaifk'];
            //          $dataAPD->prefixnoantrian = null;
            $dataAPD->statusantrian = 0;
            $dataAPD->statuskunjungan = $r_NewPD['statuspasien'];
            $dataAPD->statuspasien = 1;
            //          $dataAPD->statuspenyakit =null;
            //          $dataAPD->objectstrukorderfk = null;
            //          $dataAPD->objectstrukreturfk = null;
            $dataAPD->tglregistrasi =  $pd->tglregistrasi; //$r_NewAPD['tglregistrasi'];
            //          $dataAPD->tgldipanggildokter = null;
            //          $dataAPD->tgldipanggilsuster = null;
            $dataAPD->objectruanganasalfk = $r_NewPD['objectruanganasalfk'];
            $dataAPD->tglkeluar = null;
            $dataAPD->tglmasuk = $r_NewAPD['tglmasuk'];
            $dataAPD->israwatgabung = $r_NewAPD['israwatgabung'];

            $dataAPD->save();

            //update statusbed jadi Isi
            TempatTidur::where('id', $r_NewAPD['nobed'])->update(['objectstatusbedfk' => 1]);

            ////            $transStatus = 'true';
            ////        } catch (\Exception $e) {
            //            $transStatus = 'false';
            //            $transMessage = "simpan Antrian Pasien";
            //        }
            //      try{
            //##Save Registrasi Pel Pasien##
            $dataRPP = new RegistrasiPelayananPasien();
            $dataRPP->norec = $dataRPP->generateNewId();;
            $dataRPP->kdprofile = $idProfile;
            $dataRPP->statusenabled = true;
            $dataRPP->objectasalrujukanfk = $r_NewAPD['objectasalrujukanfk'];
            //          $dataRPP->objecthasiltriasefk =null;
            $dataRPP->israwatgabung = $r_NewAPD['israwatgabung'];;
            $dataRPP->objectkamarfk = $r_NewAPD['objectkamarfk'];
            //          $dataRPP->objectkasuspenyakitfk = null;
            //          $dataRPP->kddokter = null;
            //          $dataRPP->kddokterperiksanext =  null;
            $dataRPP->objectkelasfk = $r_NewAPD['objectkelasfk'];
            $dataRPP->objectkelaskamarfk = $r_NewAPD['objectkelasfk'];
            //          $dataRPP->objectkelaskamarrencanafk =null;
            //          $dataRPP->objectkelaskamartujuanfk =null;
            //          $dataRPP->objectkelasrencanafk = null;
            //          $dataRPP->objectkelastujuanfk = null;
            $dataRPP->kdpenjaminpasien = 0;
            //          $dataRPP->objectkeadaanumumfk = null;
            $dataRPP->objectkelompokpasienfk = $r_NewPD['objectkelompokpasienlastfk'];
            //          $dataRPP->keteranganlainnyaperiksanext = null;
            $dataRPP->keteranganlainnyarencana = $r_NewAPD['keteranganpindah'];
            //          $dataRPP->kodenomorbuktiperjanjian = null;
            //          $dataRPP->objectkondisipasienfk = null;
            //          $dataRPP->namatempattujuan =null;
            //          $dataRPP->noantrian = null;
            $dataRPP->noantrianbydokter = 0;
            //          $dataRPP->nobed = null;
            //          $dataRPP->nobedtujuan =  null;
            $dataRPP->nocmfk = $r_NewPD['nocmfk'];
            $dataRPP->noregistrasifk = $r_NewPD['norec_pd'];
            //          $dataRPP->prefixnoantrian =  '1';
            $dataRPP->objectruanganasalfk = $r_NewAPD['objectruanganasalfk'];
            $dataRPP->objectruanganfk = $r_NewAPD['objectruanganlastfk'];
            //          $dataRPP->objectruanganperiksanextfk = $r_NewAPD['objectruanganfk'];
            //          $dataRPP->objectruanganrencanafk =  null;
            //          $dataRPP->objectruangantujuanfk =  null;
            $dataRPP->objectstatuskeluarfk = $r_NewPD['objectstatuskeluarfk'];
            //            $dataRPP->objectstatuskeluarrencanafk =  $r_NewPD['objectstatuskeluarfk'];
            //          $dataRPP->statuspasien =  0;
            $dataRPP->objecttempattidurfk = $r_NewAPD['nobed'];
            //          $dataRPP->tglkeluar = null;
            //          $dataRPP->tglkeluarrencana = null;
            $dataRPP->tglmasuk = $r_NewAPD['tglmasuk'];
            //          $dataRPP->tglperiksanext = null;
            $dataRPP->tglpindah = $r_NewAPD['tglmasuk'];
            //          $dataRPP->objecttransportasifk = null;
            //          $dataRPP->objectdetailkamarfk = null;
            $dataRPP->save();
            $dataNorecRPP = $dataRPP->norec;

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan Registrasi Pelayanan Pasien";
        }

        if ($transStatus == 'true') {
            DB::commit();
            $transMessage = 'SUKSES';
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                //                'dataPD' => $dataPD,
                'dataAPD' => $dataAPD,
                'dataRPP' => $dataRPP,
                'as' => 'ramdanegie',
            );
        } else {
            $transMessage = "GAGAL";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                //                'dataPD' => $dataPD,
                'dataAPD' => $dataAPD,
                'dataRPP' => $dataRPP,
                'as' => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function savePulangPasien(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $detLogin = $request->all();
        $tglAyeuna = date('Y-m-d H:i:s');
        $r_NewPD = $request['pasiendaftar'];
        $r_NewAPD = $request['antrianpasiendiperiksa'];
        DB::beginTransaction();
        //##Update Pasiendaftar##
        try {

            if ($r_NewPD['norec_pd'] != 'undefined' && $r_NewPD['noregistrasi'] != 'undefined' && $r_NewPD['objectstatuskeluarfk'] == 5) {
                $updatePD = PasienDaftar::where('noregistrasi', $r_NewPD['noregistrasi'])
                    ->where('kdprofile', $idProfile)
                    ->update(
                        [
                            'objecthubungankeluargaambilpasienfk' => $r_NewPD['objecthubungankeluargaambilpasienfk'],
                            'objectkondisipasienfk' => $r_NewPD['objectkondisipasienfk'],
                            'namalengkapambilpasien' => $r_NewPD['namalengkapambilpasien'],
                            'objectpenyebabkematianfk' => $r_NewPD['objectpenyebabkematianfk'],
                            'objectstatuskeluarfk' => $r_NewPD['objectstatuskeluarfk'],
                            'objectstatuspulangfk' => $r_NewPD['objectstatuspulangfk'],
                            'tglmeninggal' => $r_NewPD['tglmeninggal'],
                            'tglpulang' => $r_NewPD['tglpulang'],
                        ]
                    );
            }
            if ($r_NewPD['norec_pd'] != 'undefined' && $r_NewPD['noregistrasi'] != 'undefined' && $r_NewPD['objectstatuskeluarfk'] == 5 && $r_NewPD['objectpenyebabkematianfk'] == 4) {
                $updatePD = PasienDaftar::where('noregistrasi', $r_NewPD['noregistrasi'])
                    ->where('kdprofile', $idProfile)
                    ->update(
                        [
                            'objecthubungankeluargaambilpasienfk' => $r_NewPD['objecthubungankeluargaambilpasienfk'],
                            'objectkondisipasienfk' => $r_NewPD['objectkondisipasienfk'],
                            'namalengkapambilpasien' => $r_NewPD['namalengkapambilpasien'],
                            'objectpenyebabkematianfk' => $r_NewPD['objectpenyebabkematianfk'],
                            'objectstatuskeluarfk' => $r_NewPD['objectstatuskeluarfk'],
                            'objectstatuspulangfk' => $r_NewPD['objectstatuspulangfk'],
                            'tglmeninggal' => $r_NewPD['tglmeninggal'],
                            'tglpulang' => $r_NewPD['tglpulang'],
                            'keteranganpenyebabkematian' => $r_NewPD['keterangankematian'],
                        ]
                    );
            }
            if ($r_NewPD['norec_pd'] != 'undefined' && $r_NewPD['noregistrasi'] != 'undefined' && $r_NewPD['objectstatuskeluarfk'] != 5) {
                $updatePD = PasienDaftar::where('noregistrasi', $r_NewPD['noregistrasi'])
                    ->where('kdprofile', $idProfile)
                    ->update(
                        [
                            'objecthubungankeluargaambilpasienfk' => $r_NewPD['objecthubungankeluargaambilpasienfk'],
                            'objectkondisipasienfk' => $r_NewPD['objectkondisipasienfk'],
                            'namalengkapambilpasien' => $r_NewPD['namalengkapambilpasien'],
                            //                        'objectpenyebabkematianfk' => $r_NewPD['objectpenyebabkematianfk'],
                            'objectstatuskeluarfk' => $r_NewPD['objectstatuskeluarfk'],
                            'objectstatuspulangfk' => $r_NewPD['objectstatuspulangfk'],
                            //                        'tglmeninggal' => $r_NewPD['tglmeninggal'],
                            'tglpulang' => $r_NewPD['tglpulang'],
                        ]
                    );
            }
            if ($r_NewPD['nocmfk'] != 'undefined' && $r_NewPD['objectstatuskeluarfk'] == 5) {
                $updatePS = Pasien::where('id', $r_NewPD['nocmfk'])
                    ->where('kdprofile', $idProfile)
                    ->update(
                        [
                            'tglmeninggal' => $r_NewPD['tglmeninggal'],
                        ]
                    );
            }
            if ($r_NewAPD['norec_apd'] != 'undefined') {
                $updateAPD = AntrianPasienDiperiksa::where('norec', $r_NewAPD['norec_apd'])->where('kdprofile', $idProfile)
                    ->update(
                        [
                            'tglkeluar' => $r_NewPD['tglpulang'],
                        ]
                    );

                $ruangasal = DB::select(
                    DB::raw("select * from antrianpasiendiperiksa_t
                         where kdprofile = $idProfile and norec=:norec and objectruanganfk=:objectruanganasalfk;"),
                    array(
                        'norec' => $r_NewAPD['norec_apd'],
                        'objectruanganasalfk' => $r_NewAPD['objectruanganlastfk'],
                    )
                );

                //update statusbed jadi Kosong
                foreach ($ruangasal as $Hit) {
                    TempatTidur::where('id', $Hit->nobed)->where('kdprofile', $idProfile)->update(['objectstatusbedfk' => 2]);
                }
            }

            if ($request['strukorder']['norecorder'] != '') {
                $updateSO = StrukOrder::where('norec', $request['strukorder']['norecorder'])
                    ->where('kdprofile', $idProfile)
                    ->update(
                        [
                            'statusorder' => 4,
                            'tglvalidasi' => $tglAyeuna
                        ]
                    );
            }

            if ($r_NewPD['norec_pd'] != 'undefined' && $r_NewPD['noregistrasi'] != 'undefined') {
                // $updateRPP = \DB::table('registrasipelayananpasien_t')
                //     ->select('noregistrasifk','objectruanganfk','tglkeluar')
                //     ->where('objectruanganfk', $r_NewAPD['objectruanganlastfk'])
                //     ->where('noregistrasifk', $r_NewPD['norec_pd'])
                //     ->update([
                //             'objectstatuskeluarfk' => $r_NewPD['objectstatuskeluarfk'],
                //             'tglkeluar' => $r_NewPD['tglpulang'],
                //             'tglkeluarrencana' => $r_NewPD['tglpulang'],
                //         ]
                //     );
                $updateRPP = RegistrasiPelayananPasien::where('objectruanganfk', $r_NewAPD['objectruanganlastfk'])
                    ->where('noregistrasifk', $r_NewPD['norec_pd'])
                    ->where('kdprofile', $idProfile)
                    ->update(
                        [
                            'objectstatuskeluarfk' => $r_NewPD['objectstatuskeluarfk'],
                            'tglkeluar' => $r_NewPD['tglpulang'],
                            'tglkeluarrencana' => $r_NewPD['tglpulang'],
                        ]
                    );
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }



        if ($transStatus == 'true') {
            DB::commit();
            $transMessage = 'SUKSES';
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                //                'dataPD' => $dataPD,
                //                'dataAPD' => $dataAPD,
                //                'dataRPP'=> $dataRPP,
                'as' => 'ramdanegie',
            );
        } else {
            $transMessage = "GAGAL";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                //                'dataPD' => $dataPD,
                //                'dataAPD' => $dataAPD,
                //                'dataRPP'=> $dataRPP,
                'as' => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getPindahPasienByNoreg(Request $request)
    {
        $norec_pd = $request['norec_pd'];
        $norec_apd = $request['norec_apd'];
        $kdProfile = $this->getDataKdProfile($request);
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftjoin('alamat_m as alm', 'alm.nocmfk', '=', 'ps.id')
            ->leftjoin('pendidikan_m as pdd', 'pdd.id', '=', 'ps.objectpendidikanfk')
            ->leftjoin('pekerjaan_m as pk', 'pk.id', '=', 'ps.objectpekerjaanfk')
            ->leftjoin('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->leftjoin('kelompokpasien_m as kps', 'kps.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftjoin('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->join('departemen_m as dpm', 'dpm.id', '=', 'ru.objectdepartemenfk')
            ->leftjoin('pegawai_m as peg', 'peg.id', '=', 'pd.objectpegawaifk')
            ->join('kelas_m as kls', 'kls.id', '=', 'apd.objectkelasfk')
            ->LEFTjoin('jenispelayanan_m as jpl', 'jpl.kodeinternal', '=', 'pd.jenispelayanan')
            ->select(
                'ps.nocm',
                'ps.id as nocmfk',
                'ps.noidentitas',
                'ps.namapasien',
                'pd.noregistrasi',
                'pd.tglregistrasi',
                'jk.jeniskelamin',
                'ps.tgllahir',
                'alm.alamatlengkap',
                'pdd.pendidikan',
                'pk.pekerjaan',
                'ps.notelepon',
                'ps.objectjeniskelaminfk',
                'apd.objectruanganfk',
                'ru.namaruangan',
                'apd.norec as norec_apd',
                'pd.norec as norec_pd',
                'kps.kelompokpasien',
                'kls.namakelas',
                'apd.objectkelasfk',
                'pd.objectkelompokpasienlastfk',
                'pd.objectrekananfk',
                'rk.namarekanan',
                'pd.objectruanganlastfk',
                'jpl.jenispelayanan',
                'apd.objectasalrujukanfk',
                'ru.kdinternal',
                'jpl.kodeinternal as objectjenispelayananfk',
                'pd.objectpegawaifk',
                'pd.statuspasien',
                'pd.objectruanganlastfk',
                'ps.qpasien as id_ibu',
                DB::raw('case when ru.objectdepartemenfk in (16,35,17) then \'true\' else \'false\' end as israwatinap')
            )
            ->where('pd.norec', '=', $norec_pd)
            ->where('apd.norec', '=', $norec_apd)
            ->where('pd.kdprofile', (int)$kdProfile)
            //            ->where('pd.objectruanganlastfk',$ruanganlast)
            //            ->where('apd.objectruanganfk',$ruanganlast)
            ->whereNull('pd.tglpulang')
            ->get();

        return $this->respond($data);
    }


    public function getRuanganLast(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $dataLogin = $request->all();
        $data = \DB::table('pasiendaftar_t as st')
            ->select('st.norec', 'st.objectruanganlastfk')
            ->where('st.norec', $request['norec_pd'])
            ->where('st.kdprofile', (int)$kdProfile)
            ->get();

        $result = array(
            'data' => $data,
            'message' => 'ramdanegie',
        );

        return $this->respond($result);
    }
    public function ubahTanggalRegis(Request $request)
    {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        //##Update Pasiendaftar##
        try {
            $dataRPP = RegistrasiPelayananPasien::where('noregistrasifk', $request['norec_pd'])->count();
            if ($request['tglregistrasi'] != '') {
                if ($dataRPP > 0) {
                    $updatePD = PasienDaftar::where('noregistrasi', $request['noregistrasi'])
                        ->where('kdprofile', (int)$kdProfile)
                        ->update(
                            [
                                'tglregistrasi' => $request['tglregistrasi']

                            ]
                        );
                    $updateAPDs = AntrianPasienDiperiksa::where('norec', $request['norec_apd'])
                        ->where('kdprofile', (int)$kdProfile)
                        ->update(
                            [
                                'tglregistrasi' => $request['tglregistrasi'],
                            ]
                        );
                } else {
                    $updatePD = PasienDaftar::where('noregistrasi', $request['noregistrasi'])
                        ->where('kdprofile', (int)$kdProfile)
                        ->update(
                            [
                                'tglregistrasi' => $request['tglregistrasi'],
                                'tglpulang' => $request['tglregistrasi']
                            ]
                        );
                    $updateAPDs = AntrianPasienDiperiksa::where('norec', $request['norec_apd'])
                        ->where('kdprofile', (int)$kdProfile)
                        ->update(
                            [
                                'tglregistrasi' => $request['tglregistrasi']
                            ]
                        );
                }
                $updatePD = PasienDaftar::where('noregistrasi', $request['noregistrasi'])
                    ->where('kdprofile', (int)$kdProfile)
                    ->update(
                        [
                            'tglregistrasi' => $request['tglregistrasi']
                        ]
                    );
                $updateAPDs = AntrianPasienDiperiksa::where('norec', $request['norec_apd'])
                    ->where('kdprofile', (int)$kdProfile)
                    ->update(
                        [
                            'tglregistrasi' => $request['tglregistrasi']
                        ]
                    );
            }

            if ($request['tglkeluar'] != '' && $request['tglmasuk'] != '') {
                $updateAPD = AntrianPasienDiperiksa::where('norec', $request['norec_apd'])
                    ->where('kdprofile', (int)$kdProfile)
                    ->update(
                        [
                            'tglkeluar' => $request['tglkeluar'],
                            'tglmasuk' => $request['tglmasuk']
                        ]
                    );
                if ($dataRPP > 0) {
                    $updateRPP = \DB::table('registrasipelayananpasien_t')
                        ->select('noregistrasifk', 'objectruanganfk', 'rpp.tglkeluar')
                        ->where('objectruanganfk', $request['ruanganasal'])
                        ->where('noregistrasifk', $request['norec_pd'])
                        ->where('kdprofile', (int)$kdProfile)
                        ->update(
                            [
                                'tglkeluar' => $request['tglkeluar'],
                                'tglmasuk' => $request['tglmasuk']
                            ]
                        );
                }
            }
            if ($request['tglkeluar'] == '' && $request['tglmasuk'] != '') {
                $updateAssPD = AntrianPasienDiperiksa::where('norec', $request['norec_apd'])
                    ->where('kdprofile', (int)$kdProfile)
                    ->update(
                        [
                            'tglmasuk' => $request['tglmasuk']

                        ]
                    );
                if ($dataRPP > 0) {
                    $updatessRPP = \DB::table('registrasipelayananpasien_t')
                        ->select('noregistrasifk', 'objectruanganfk', 'tglkeluar')
                        ->where('objectruanganfk', $request['ruanganasal'])
                        ->where('noregistrasifk', $request['norec_pd'])
                        ->where('kdprofile', (int)$kdProfile)
                        ->update(
                            [
                                'tglmasuk' => $request['tglmasuk']
                            ]
                        );
                }
            }
            if ($request['tglkeluar'] != '' && $request['tglmasuk'] == '') {
                $updatseAPD = AntrianPasienDiperiksa::where('norec', $request['norec_apd'])
                    ->update(
                        [
                            'tglkeluar' => $request['tglkeluar']
                        ]
                    );
                if ($dataRPP  > 0) {
                    $updatsseRPP = \DB::table('registrasipelayananpasien_t')
                        ->select('noregistrasifk', 'objectruanganfk', 'tglkeluar')
                        ->where('objectruanganfk', $request['ruanganasal'])
                        ->where('noregistrasifk', $request['norec_pd'])
                        ->where('kdprofile', (int)$kdProfile)
                        ->update(
                            [
                                'tglkeluar' => $request['tglkeluar']
                            ]
                        );
                }
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan  Pasien";
        }

        if ($transStatus == 'true') {
            DB::commit();
            $transMessage = 'SUKSES';
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'dataPD' => $dataRPP,
                'as' => 'ramdanegie',
            );
        } else {
            $transMessage = "GAGAL";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getNoCmIbu(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $dataLogin = $request->all();
        $data = \DB::table('pasien_m as ps')
            ->leftJoin('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->leftJoin('agama_m as agm', 'agm.id', '=', 'ps.objectagamafk')
            ->leftJoin('pendidikan_m as pdd', 'pdd.id', '=', 'ps.objectpendidikanfk')
            ->leftJoin('alamat_m as alm', 'alm.nocmfk', '=', 'ps.id')
            ->leftJoin('pekerjaan_m as pk', 'pk.id', '=', 'ps.objectpekerjaanfk')
            ->select(
                'ps.id',
                'ps.nocm',
                'ps.namapasien',
                'ps.objectjeniskelaminfk',
                'jk.jeniskelamin',
                'ps.objectagamafk',
                'agm.agama',
                'ps.objectpendidikanfk',
                'pdd.pendidikan',
                'alm.alamatlengkap',
                'ps.namaayah',
                'ps.namaibu',
                'ps.namakeluarga',
                'ps.notelepon',
                'ps.nohp',
                'ps.objectpekerjaanfk',
                'pk.pekerjaan',
                'ps.tgllahir',
                'ps.tempatlahir',
                'ps.namasuamiistri',
                'alm.kodepos',
                'ps.noidentitas'
            )
            ->where('ps.statusenabled', true)
            ->where('ps.kdprofile', (int)$kdProfile)
            ->where('ps.nocm', $request['noCm'])
            ->get();

        $result = array(
            'data' => $data,
            'datalogin' => $dataLogin,
            'message' => 'ramdanegie',
        );

        return $this->respond($result);
    }
    public function getDesaKelurahanPart(Request $request)
    {

        $req = $request->all();
        $Desa = \DB::table('desakelurahan_m as ru')
            ->select('ru.id', 'ru.namadesakelurahan as namaDesaKelurahan', 'ru.kodepos as kodePos')
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namadesakelurahan');

        if (
            isset($req['namadesakelurahan']) &&
            $req['namadesakelurahan'] != "" &&
            $req['namadesakelurahan'] != "undefined"
        ) {
            $Desa = $Desa->where('ru.namadesakelurahan', 'ilike', '%' . $req['namadesakelurahan'] . '%');
        };
        if (
            isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined"
        ) {
            $Desa = $Desa
                ->where('ru.namadesakelurahan', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%');
        }

        $Desa = $Desa->take(10);
        $Desa = $Desa->get();
        return $this->respond($Desa);
    }
    public function getKecamatanPart(Request $request)
    {
        $req = $request->all();
        $kecamatan = \DB::table('kecamatan_m as ru')
            //            ->join('desakelurahan_m as dk','ru.id','=','dk.objectkecamatanfk')
            ->select('ru.id', 'ru.namakecamatan as namaKecamatan')
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namakecamatan');

        if (
            isset($req['namakecamatan']) &&
            $req['namakecamatan'] != "" &&
            $req['namakecamatan'] != "undefined"
        ) {
            $kecamatan = $kecamatan->where('ru.namakecamatan ',  $req['namakecamatan']);
        };
        if (
            isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined"
        ) {
            $kecamatan = $kecamatan
                ->where('ru.namakecamatan', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%');
        }

        $kecamatan = $kecamatan->take(10);
        $kecamatan = $kecamatan->get();
        return $this->respond($kecamatan);
    }
    public function getKotaKabupatenPart(Request $request)
    {
        $req = $request->all();
        $KotaKabupaten = \DB::table('kotakabupaten_m as ru')
            ->select('ru.id', 'ru.namakotakabupaten as namaKotaKabupaten')
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namakotakabupaten');

        if (
            isset($req['namakotakabupaten']) &&
            $req['namakotakabupaten'] != "" &&
            $req['namakotakabupaten'] != "undefined"
        ) {
            $KotaKabupaten = $KotaKabupaten->where('ru.namakotakabupaten', 'ilike', '%' . $req['namakotakabupaten'] . '%');
        };
        if (
            isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined"
        ) {
            $KotaKabupaten = $KotaKabupaten
                ->where('ru.namakotakabupaten', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%');
        }

        $KotaKabupaten = $KotaKabupaten->take(10);
        $KotaKabupaten = $KotaKabupaten->get();
        return $this->respond($KotaKabupaten);
    }
    public function getPropinsiPart(Request $request)
    {
        $req = $request->all();
        $Propinsi = \DB::table('propinsi_m as ru')
            ->select('ru.id', 'ru.namaproxpinsi as namaPropinsi')
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namapropinsi');

        if (
            isset($req['namapropinsi']) &&
            $req['namapropinsi'] != "" &&
            $req['namapropinsi'] != "undefined"
        ) {
            $Propinsi = $Propinsi->where('ru.namapropinsi', 'ilike', '%' . $req['namapropinsi'] . '%');
        };
        if (
            isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined"
        ) {
            $Propinsi = $Propinsi
                ->where('ru.namapropinsi', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%');
        }

        $Propinsi = $Propinsi->take(10);
        $Propinsi = $Propinsi->get();
        return $this->respond($Propinsi);
    }
    public function getAlamatByKodePos(Request $request)
    {
        $dataLogin = $request->all();
        $data = \DB::table('desakelurahan_m as dk')
            ->Join('kecamatan_m as kcm', 'kcm.id', '=', 'dk.objectkecamatanfk')
            ->Join('kotakabupaten_m as kk', 'kk.id', '=', 'dk.objectkotakabupatenfk')
            ->Join('propinsi_m as pp', 'pp.id', '=', 'dk.objectpropinsifk')
            ->select(DB::raw("dk.id,dk.id as objectdesakelurahanfk,UPPER(dk.namadesakelurahan) as namadesakelurahan,dk.kodepos,
			                 dk.objectkecamatanfk,dk.objectkotakabupatenfk,dk.objectpropinsifk,
				             UPPER(kcm.namakecamatan) as namakecamatan,UPPER(kk.namakotakabupaten) as namakotakabupaten,
				             UPPER(pp.namapropinsi) as namapropinsi"))
            ->where('dk.statusenabled', true)
            ->where('dk.kodepos', $request['kodePos'])
            ->get();

        $result = array(
            'data' => $data,
            'datalogin' => $dataLogin,
            'message' => 'ramdanegie',
        );

        return $this->respond($result);
    }
    public function getNegaraPart(Request $request)
    {
        $req = $request->all();
        $neg = \DB::table('negara_m as ru')
            ->select('ru.id', 'ru.namanegara')
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namanegara');

        if (
            isset($req['namanegara']) &&
            $req['namanegara'] != "" &&
            $req['namanegara'] != "undefined"
        ) {
            $neg = $neg->where('ru.namanegara', 'ilike', '%' . $req['namanegara'] . '%');
        };
        if (
            isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined"
        ) {
            $neg = $neg
                ->where('ru.namanegara', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%');
        }

        $neg = $neg->take(10);
        $neg = $neg->get();
        return $this->respond($neg);
    }

    public function savePasienBayi(Request $request)
    {
        $detLogin = $request->all();
        $kdProfile = $this->getDataKdProfile($request);
        DB::beginTransaction();
        $NewPasien = $request['pasien'];
        $NewAlamat = $request['alamat'];
        try {
            $newId2 = 20000000;
            $newId = Pasien::where('id', '>', (float)20000000 - 1)
                ->where('id', '<', (float)25000000)
                ->count('id');
            $newId = (float)$newId2 + (float)$newId;

            $runningNumber = RunningNumber::where('id', 13535)->first();
            $extension = $runningNumber->reset . $runningNumber->extention;
            $noCmTerakhir = $runningNumber->nomer_terbaru + 1;
            $noCm = $extension . $noCmTerakhir;

            $dataPS = new Pasien();
            $dataPS->id = $newId;
            $dataPS->kdprofile = (int)$kdProfile;
            $dataPS->statusenabled = true;
            $dataPS->kodeexternal = $newId;
            $dataPS->norec =  $dataPS->generateNewId();
            $dataPS->nocm = $noCm; //$NewPasien['nocm'];//$noCm;
            $dataPS->namaexternal = $NewPasien['namapasien'];
            $dataPS->reportdisplay =  $NewPasien['namapasien'];
            $dataPS->objectagamafk = $NewPasien['objectagamafk'];
            //            $dataPS->objectgolongandarahfk = $request['xxxx']['xxxxx'];
            $dataPS->objectjeniskelaminfk = $NewPasien['objectjeniskelaminfk'];
            $dataPS->namapasien = $NewPasien['namapasien'];
            $dataPS->objectpekerjaanfk = $NewPasien['objectpekerjaanfk'];
            $dataPS->objectpendidikanfk = $NewPasien['objectpendidikanfk'];
            $dataPS->qpasien =  $NewPasien['pasienIbu']['id']; //id IBU BAYI
            $dataPS->objectstatusperkawinanfk = $NewPasien['objectstatusperkawinanfk'];
            $dataPS->tgldaftar =  date('Y-m-d H:i:s');
            $dataPS->tgllahir = $NewPasien['tgllahir']; // $dt;
            //            $dataPS->objecttitlefk = $request['xxxx']['xxxxx'];
            $dataPS->namaibu = $NewPasien['namaibu'];
            $dataPS->notelepon = $NewPasien['notelepon'];
            $dataPS->noidentitas = $NewPasien['noidentitas'];
            //            $dataPS->tglmeninggal = $request['xxxx']['xxxxx'];
            //            $dataPS->noaditional = $NewPasien['pasienIbu']['id'];
            //            $dataPS->paspor = $request['xxxx']['xxxxx'];
            $dataPS->objectkebangsaanfk = $NewPasien['objectkebangsaanfk'];
            $dataPS->objectnegarafk = $NewPasien['objectnegarafk'];
            //            $dataPS->namadepan = $request['xxxx']['xxxxx'];
            //            $dataPS->namabelakang = $request['xxxx']['xxxxx'];
            //            $dataPS->dokumenrekammedis = $request['xxxx']['xxxxx'];
            $dataPS->namaayah = $NewPasien['namaayah'];
            $dataPS->namasuamiistri = $NewPasien['namasuamiistri'];
            $dataPS->noasuransilain = $NewPasien['noasuransilain'];
            $dataPS->nobpjs = $NewPasien['nobpjs'];
            $dataPS->nohp = $NewPasien['nohp'];
            $dataPS->tempatlahir = $NewPasien['tempatlahir'];
            $dataPS->jamlahir = $NewPasien['jamlahir'];
            $dataPS->save();
            $dataNoCMFk = $dataPS->id;
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan Pasien Baru";
        }
        try {
            $updateRN = RunningNumber::where('id', '13535')
                ->update(
                    [
                        'nomer_terbaru' => $noCmTerakhir

                    ]
                );
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "update Running Number";
        }
        //        try{
        //        $updateGen= FlagGenerateNoCm::where('nocmgenerate', $NewPasien['nocm'])
        //            ->update([
        //                    'status' => '1'
        //                ]
        //            );
        //        $transStatus = 'true';
        //        } catch (\Exception $e) {
        //                $transStatus = 'false';
        //                $transMessage = "update Table Genrate No CM";
        //        }

        try {
            $newId3 = 20000000;
            $newIdAl = Alamat::where('id', '>', (float)20000000 - 1)
                ->where('id', '<', (float)25000000)
                ->count('id');
            $newIdAl = (float)$newId3 + (float)$newIdAl;
            $newIDAlamat = $newIdAl;
            $dataAL = new Alamat();
            $dataAL->id = $newIDAlamat;
            $dataAL->kdprofile = (int)$kdProfile;
            $dataAL->statusenabled = true;
            $dataAL->kodeexternal = $newIDAlamat;
            //            $dataAL->namaexternal = $request['alamatLengkap'];
            $dataAL->norec = $dataAL->generateNewId();
            //            $dataAL->reportdisplay = $request['alamatLengkap'];
            //            $dataAL->alamatemail = $request['xxxx']['xxxxx'];
            $dataAL->alamatlengkap = $NewAlamat['alamatlengkap'];
            //            $dataAL->blackberry = $request['xxxx']['xxxxx'];
            $dataAL->objectdesakelurahanfk = $NewAlamat['objectdesakelurahanfk'];
            //            $dataAL->facebook = $request['xxxx']['xxxxx'];
            //            $dataAL->faksimile1 = $request['xxxx']['xxxxx'];
            //            $dataAL->faksimile2 =$request['xxxx']['xxxxx'];
            //            $dataAL->fixedphone1 =$request['xxxx']['xxxxx'];
            //            $dataAL->fixedphone2 =$request['xxxx']['xxxxx'];
            $dataAL->objecthubungankeluargafk = 7;
            //            $dataAL->isbillingaddress = $request['xxxx']['xxxxx'];
            //            $dataAL->isprimaryaddress = $request['xxxx']['xxxxx'];
            //            $dataAL->isshippingaddress = $request['xxxx']['xxxxx'];
            $dataAL->objectjenisalamatfk = 1;
            $dataAL->kdalamat = $newIDAlamat;
            $dataAL->objectkecamatanfk = $NewAlamat['objectkecamatanfk'];
            //            $dataAL->keteranganlainnya = $request['alamatLengkap'];
            $dataAL->kodepos = $NewAlamat['kodepos'];
            $dataAL->objectkotakabupatenfk = $NewAlamat['objectkotakabupatenfk'];
            //            $dataAL->line =$request['xxxx']['xxxxx'];
            //            $dataAL->mobilephone1 = $request['xxxx']['xxxxx'];
            //            $dataAL->mobilephone2 = $request['xxxx']['xxxxx'];
            $dataAL->namadesakelurahan = $NewAlamat['namadesakelurahan'];
            $dataAL->namakecamatan = $NewAlamat['namakecamatan'];
            $dataAL->namakotakabupaten = $NewAlamat['namakotakabupaten'];
            //            $dataAL->namatempatgedung = $request['xxxx']['xxxxx'];
            $dataAL->objectnegarafk = $NewAlamat['objectnegarafk'];
            $dataAL->nocmfk = $dataNoCMFk;
            $dataAL->objectpegawaifk = $detLogin['userData']['id'];
            $dataAL->objectpropinsifk = $NewAlamat['objectpropinsifk'];
            //            $dataAL->objectrekananfk = $request['xxxx']['xxxxx'];
            //            $dataAL->rtrw = $request['xxxx']['xxxxx'];
            //            $dataAL->twitter = $request['xxxx']['xxxxx'];
            //            $dataAL->website = $request['xxxx']['xxxxx'];
            //            $dataAL->whatsapp = $request['xxxx']['xxxxx'];
            //            $dataAL->yahoomessenger = $request['xxxx']['xxxxx'];
            $dataAL->kecamatan = $NewAlamat['namakecamatan'];
            $dataAL->kotakabupaten = $NewAlamat['namakotakabupaten'];
            //            $dataAL->penanggungjawab_norec = $request['xxxx']['xxxxx'];
            $dataAL->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan Pasien Baru";
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'dataPasien' => $dataPS,
                'dataAlamat' => $dataAL,
                'as' => 'ramdanegie',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transStatus,
                'dataPasien' => $dataPS,
                'dataAlamat' => $dataAL,
                'as' => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
        //        return $this->respond($noCmTerakhir );
    }

    public function saveGenerateNocm(Request $request)
    {
        $detLogin = $request->all();
        DB::beginTransaction();
        //        $data = DB::select(DB::raw("select EXTRACT(HOUR from AGE(NOW(), tgldaftar)) as daterange,
        //            * from generate_nocm where status=:status;"),
        //            array(
        //                'status' =>'0',
        //            )
        //        );
        //        if(count($data)>0){
        //            if($data[0]->daterange>6) {
        //                $dataAya = $data[0]->nocmgenerate;
        //                $transStatus = 'netral';
        //            }
        //        }else{
        //            try{
        $runningNumber = DB::selectOne(
            DB::raw('select nomer_terbaru from running_number where id=13535')
        );
        $awalan = "01";
        $noCmTerakhir = $runningNumber->nomer_terbaru + 1;
        $noCm = $awalan . $noCmTerakhir;

        $updateRN = RunningNumber::where('id', '13535')
            ->update(
                [
                    'nomer_terbaru' => $noCmTerakhir
                ]
            );

        $newId = FlagGenerateNoCm::max('id');
        $newId = $newId + 1;
        $dataGen = new FlagGenerateNoCm();
        $dataGen->norec = $dataGen->generateNewId();
        $dataGen->id = $newId;
        $dataGen->nocmgenerate = $noCm;
        $dataGen->status = '0';
        $dataGen->tgldaftar = $request['tglsekarang'];
        $dataGen->save();

        $transStatus = 'true';
        //        } catch (\Exception $e) {
        //            $transStatus = 'false';
        //            $transMessage = "simpan Running Number";
        //        }
        //        }
        if ($transStatus == 'true') {
            $transMessage = "No RM : " . $dataGen->nocmgenerate;
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'data' => $dataGen->nocmgenerate,
                'as' => 'ramdanegie',
            );
        }
        //        }  if ($transStatus == 'netral'){
        //            $transMessage =   "No RM : " .$dataAya;
        //            $result = array(
        //                'status' => 201,
        //                'message' => $transMessage,
        //                'data' =>$dataAya ,
        //                'as' => 'ramdanegie',
        //            );
        //        }
        else {
            $transMessage = "Error";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transStatus,
                'data' => $dataGen,
                'as' => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
        //        return $this->respond($datas);
    }

    public function getNoCmBelumDipake(Request $request)
    {
        //        $data = DB::select(DB::raw("select EXTRACT(HOUR from AGE(NOW(), tgldaftar)) as daterange,
        //            * from generate_nocm where status=:status;"),
        //            array(
        //                'status' =>'0',
        //            )
        //        );
        $data = DB::select(
            DB::raw("SELECT
                (DATE_PART('day',CURRENT_TIMESTAMP - tgldaftar::timestamp) * 24 +
                DATE_PART('hour',CURRENT_TIMESTAMP - tgldaftar::timestamp) )as hour_range,
                 * from generate_nocm where status=:status
                 order by tgldaftar desc ;"),
            array(
                'status' => '0',
            )
        );
        $result = array(
            'data' => $data,
            'message' => 'ramdanegie',
        );

        return $this->respond($result);
    }


    public function cekPasienDaftarDuaKali(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        // $dataLogin = $request->all();
        $data = \DB::table('pasiendaftar_t as pd')
            ->Join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            // ->Join('ruangan_m as ru','ru.id','=','pd.objectruanganlastfk')
            ->leftJoin('batalregistrasi_t as br', 'br.pasiendaftarfk', '=', 'pd.norec')
            ->select('pd.noregistrasi', 'pd.tglregistrasi', 'pd.objectruanganlastfk')
            ->where('ps.id', $request['nocm'])
            ->where('pd.tglregistrasi', '>=', $request['tglregistrasi'] . ' 00:00')
            ->where('pd.tglregistrasi', '<=', $request['tglregistrasi'] . ' 23:59')
            ->whereNull('br.pasiendaftarfk')
            ->where('pd.kdprofile', (int)$kdProfile)
            ->where('pd.statusenabled', true)
            ->orderBy('pd.noregistrasi', 'desc')
            ->get();

        $result = array(
            'data' => $data,
            'message' => 'ramdanegie',
        );

        return $this->respond($result);
    }
    public function savePasien(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $detLogin = $request->all();
        DB::beginTransaction();
        try {
            //            $noCM = $this->generateCode(new Pasien, 'nocm', 9, 'P');

            //##id pasien kosong 320027863->2105587804
            //##id alamat kosong 7324898->10000000

            $newId2 = 720000;
            $newId = Pasien::where('id', '>', (float)720000 - 1)
                ->where('id', '<', (float)10000000)
                ->count('id');
            $newId = (float)$newId2 + (float)$newId + 4;

            $newId3 = 984000;
            $newIdAl = Alamat::where('id', '>', (float)984000 - 1)
                ->where('id', '<', (float)7300000)
                ->count('id');
            $newIdAl = (float)$newId3 + (float)$newIdAl + 4;

            $dt = date('Y-m-d', strtotime($request['pasien']['tglLahir']));

            $runningNumber = RunningNumber::where('id', 1745)->first();
            $extension = $runningNumber->extention;
            $noCmTerakhir = $runningNumber->nomer_terbaru + 1;
            $noCm = $extension . $noCmTerakhir;

            $dataPS = new Pasien();
            $dataPS->id = $newId;
            $dataPS->kdprofile = (int)$kdProfile;
            $dataPS->statusenabled = true;
            $dataPS->kodeexternal = $newId;
            $dataPS->namaexternal =  $request['pasien']['namaPasien'];
            $dataPS->norec =  $dataPS->generateNewId();
            $dataPS->reportdisplay =  $request['pasien']['namaPasien'];
            $dataPS->objectagamafk = $request['agama']['id'];
            //            $dataPS->objectgolongandarahfk = $request['xxxx']['xxxxx'];
            $dataPS->objectjeniskelaminfk = $request['jenisKelamin']['id'];
            $dataPS->namapasien = $request['pasien']['namaPasien'];
            $dataPS->objectpekerjaanfk = $request['pekerjaan']['id'];
            $dataPS->objectpendidikanfk = $request['pendidikan']['id'];
            $dataPS->qpasien = 1;
            $dataPS->objectstatusperkawinanfk = $request['statusPerkawinan']['id'];
            $dataPS->tgldaftar = date('Y-m-d H:i:s');
            $dataPS->tgllahir = $dt;
            //            $dataPS->objecttitlefk = $request['xxxx']['xxxxx'];
            $dataPS->namaibu = $request['namaIbu'];
            $dataPS->notelepon = $request['noTelepon'];
            $dataPS->noidentitas = $request['pasien']['noIdentitas'];
            //            $dataPS->tglmeninggal = $request['xxxx']['xxxxx'];
            $dataPS->noaditional = $request['noAditional'];
            //            $dataPS->paspor = $request['xxxx']['xxxxx'];
            $dataPS->objectkebangsaanfk = $request['kebangsaan']['id'];
            $dataPS->objectnegarafk = $request['negara']['id'];
            //            $dataPS->namadepan = $request['xxxx']['xxxxx'];
            //            $dataPS->namabelakang = $request['xxxx']['xxxxx'];
            //            $dataPS->dokumenrekammedis = $request['xxxx']['xxxxx'];
            $dataPS->namaayah = $request['namaAyah'];
            $dataPS->namasuamiistri = $request['pasien']['namaSuamiIstri'];
            $dataPS->noasuransilain = $request['pasien']['noAsuransiLain'];
            $dataPS->nobpjs = $request['pasien']['noBpjs'];
            $dataPS->nohp = $request['pasien']['noHp'];
            $dataPS->tempatlahir = $request['pasien']['tempatLahir'] != null && $request['pasien']['tempatLahir'] != '' ? $request['pasien']['tempatLahir'] : null;
            $dataPS->namakeluarga = $request['pasien']['namaKeluarga'];
            //            $dataPS->jamlahir = $request['xxxx']['xxxxx'];
            $dataPS->nocm = $noCm;
            $dataPS->save();
            $dataNoCMFk = $dataPS->id;

            $updateRN = RunningNumber::where('id', 1745)
                ->update(
                    [
                        'nomer_terbaru' => $noCmTerakhir
                    ]
                );

            //            $transStatus = 'true';
            //        } catch (\Exception $e) {
            $transStatus = 'false';
            //            $transMessage = "simpan Pasien Baru";
            //        }

            //        try{
            $newIDAlamat = $newIdAl;
            $dataAL = new Alamat();
            $dataAL->id = $newIDAlamat;
            $dataAL->kdprofile = (int)$kdProfile;
            $dataAL->statusenabled = true;
            $dataAL->kodeexternal = $newIDAlamat;
            //            $dataAL->namaexternal = $request['alamatLengkap'];
            $dataAL->norec = $dataAL->generateNewId();
            //            $dataAL->reportdisplay = $request['alamatLengkap'];
            //            $dataAL->alamatemail = $request['xxxx']['xxxxx'];
            $dataAL->alamatlengkap = $request['alamatLengkap'];
            //            $dataAL->blackberry = $request['xxxx']['xxxxx'];
            $dataAL->objectdesakelurahanfk = $request['desaKelurahan']['id'];
            //            $dataAL->facebook = $request['xxxx']['xxxxx'];
            //            $dataAL->faksimile1 = $request['xxxx']['xxxxx'];
            //            $dataAL->faksimile2 =$request['xxxx']['xxxxx'];
            //            $dataAL->fixedphone1 =$request['xxxx']['xxxxx'];
            //            $dataAL->fixedphone2 =$request['xxxx']['xxxxx'];
            $dataAL->objecthubungankeluargafk = 7;
            //            $dataAL->isbillingaddress = $request['xxxx']['xxxxx'];
            //            $dataAL->isprimaryaddress = $request['xxxx']['xxxxx'];
            //            $dataAL->isshippingaddress = $request['xxxx']['xxxxx'];
            $dataAL->objectjenisalamatfk = 1;
            $dataAL->kdalamat = $newIDAlamat;
            $dataAL->objectkecamatanfk = $request['kecamatan']['id'];
            //            $dataAL->keteranganlainnya = $request['alamatLengkap'];
            $dataAL->kodepos = $request['kodePos'];
            $dataAL->objectkotakabupatenfk = $request['kotaKabupaten']['id'];
            //            $dataAL->line =$request['xxxx']['xxxxx'];
            //            $dataAL->mobilephone1 = $request['xxxx']['xxxxx'];
            //            $dataAL->mobilephone2 = $request['xxxx']['xxxxx'];
            $dataAL->namadesakelurahan = $request['desaKelurahan']['namaDesaKelurahan'];
            $dataAL->namakecamatan = $request['kecamatan']['namaKecamatan'];
            $dataAL->namakotakabupaten = $request['kotaKabupaten']['namaKotaKabupaten'];
            //            $dataAL->namatempatgedung = $request['xxxx']['xxxxx'];
            $dataAL->objectnegarafk = $request['negara']['id'];
            $dataAL->nocmfk = $dataNoCMFk;
            $dataAL->objectpegawaifk = $detLogin['userData']['id'];
            $dataAL->objectpropinsifk = $request['propinsi']['id'];
            //            $dataAL->objectrekananfk = $request['xxxx']['xxxxx'];
            //            $dataAL->rtrw = $request['xxxx']['xxxxx'];
            //            $dataAL->twitter = $request['xxxx']['xxxxx'];
            //            $dataAL->website = $request['xxxx']['xxxxx'];
            //            $dataAL->whatsapp = $request['xxxx']['xxxxx'];
            //            $dataAL->yahoomessenger = $request['xxxx']['xxxxx'];
            $dataAL->kecamatan = $request['kecamatan']['namaKecamatan'];
            $dataAL->kotakabupaten = $request['kotaKabupaten']['namaKotaKabupaten'];
            //            $dataAL->penanggungjawab_norec = $request['xxxx']['xxxxx'];
            $dataAL->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'data' => $dataPS,
                'as' => 'ramdanegie',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transStatus,
                //                'data' =>$dataPS,
                'as' => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function simpanUpdateDokters(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        DB::beginTransaction();
        $transStatus = 'true';
        try {
            $datazz = PasienDaftar::where('norec', $request['norec'])->where('kdprofile', (int)$kdProfile)->first();
            $data = PasienDaftar::where('norec', $request['norec'])
                ->where('kdprofile', (int)$kdProfile)
                ->update(
                    [
                        'objectpegawaifk' => $request['objectpegawaifk']
                    ]
                );
            $data2 = AntrianPasienDiperiksa::where('noregistrasifk', $request['norec'])
                ->where('objectruanganfk', $request['objectruanganlastfk'])
                ->where('kdprofile', (int)$kdProfile)
                ->update(
                    [
                        'objectpegawaifk' => $request['objectpegawaifk']
                    ]
                );
            $transMessage = "Update Dokter berhasil!";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Update Dokter gagal";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function cekNoregistrasi(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $dataLogin = $request->all();
        $data = PasienDaftar::where('noregistrasi', $request['noregistrasi'])
            ->where('kdprofile', (int)$kdProfile)
            ->count();

        $result = array(
            'data' => $data,
            'message' => 'ramdanegie',
        );

        return $this->respond($result);
    }

    public function updateNoregis(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        DB::beginTransaction();
        $transStatus = true;
        $dataLogin = $request->all();
        $noRegistrasi = $this->generateCode(new PasienDaftar(), 'noregistrasi', 10, $this->getDateTime()->format('ym'));

        $data = PasienDaftar::where('norec', $request['norec_pd'])
            ->where('kdprofile', (int)$kdProfile)
            ->update(
                [
                    'noregistrasi' => $noRegistrasi
                ]
            );

        $transMsg = "Simpan  ";
        //
        //            } catch (\Exception $e) {
        //                $transStatus = false;
        //                $transMsg = "Simpan ";
        //
        //            }

        if ($transStatus == true) {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMsg
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMsg
            );
        }
        return $this->respond($result);
        //        return $this->setStatusCode($result['status'])->respond($result, $transMsg);
    }

    public function updatePasien(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        DB::beginTransaction();
        $dataLogin = $request->all();
        $NewPasien = $request['pasien'];
        $NewAlamat = $request['alamat'];
        try {
            if ($NewPasien['id'] != '') {
                $dataPS = Pasien::where('id', $NewPasien['id'])
                    ->where('kdprofile', (int)$kdProfile)
                    ->update(
                        [
                            'objectagamafk' => $NewPasien['objectagamafk'],
                            'objectjeniskelaminfk' => $NewPasien['objectjeniskelaminfk'],
                            'namapasien' => $NewPasien['namapasien'],
                            'objectpekerjaanfk' => $NewPasien['objectpekerjaanfk'],
                            'objectpendidikanfk' => $NewPasien['objectpendidikanfk'],
                            'objectstatusperkawinanfk' => $NewPasien['objectstatusperkawinanfk'],
                            'tgllahir' => $NewPasien['tgllahir'],
                            'namaibu' => $NewPasien['namaibu'],
                            'notelepon' => $NewPasien['notelepon'],
                            'noidentitas' => $NewPasien['noidentitas'],
                            'objectkebangsaanfk' => $NewPasien['objectkebangsaanfk'],
                            'objectnegarafk' => $NewPasien['objectnegarafk'],
                            'namaayah' => $NewPasien['namaayah'],
                            'namasuamiistri' => $NewPasien['namasuamiistri'],
                            'namakeluarga' => $NewPasien['namakeluarga'],
                            'noasuransilain' => $NewPasien['noasuransilain'],
                            'nobpjs' => $NewPasien['nobpjs'],
                            'nohp' => $NewPasien['nohp'],
                            'tempatlahir' => $NewPasien['tempatlahir'],
                            'jamlahir' => $NewPasien['tgllahir']
                        ]
                    );
                $dataAL = Alamat::where('nocmfk', $NewPasien['id'])
                    ->where('kdprofile', (int)$kdProfile)
                    ->update([
                        'alamatlengkap' => $NewAlamat['alamatlengkap'],
                        'objectdesakelurahanfk' =>  $NewAlamat['objectdesakelurahanfk'],
                        'objectkecamatanfk' => $NewAlamat['objectkecamatanfk'],
                        'kodepos' => $NewAlamat['kodepos'],
                        'objectkotakabupatenfk' => $NewAlamat['objectkotakabupatenfk'],
                        'namadesakelurahan' => $NewAlamat['namadesakelurahan'],
                        'namakecamatan' => $NewAlamat['namakecamatan'],
                        'namakotakabupaten' => $NewAlamat['namakotakabupaten'],
                        'objectpegawaifk' => $dataLogin['userData']['id'],
                        'objectpropinsifk' => $NewAlamat['objectpropinsifk'],
                        'kecamatan' => $NewAlamat['namakecamatan'],
                        'kotakabupaten' => $NewAlamat['namakotakabupaten']
                    ]);
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "update Pasien ";
        }

        if ($transStatus == 'true') {
            $transMessage = "Update Berhasil";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'dataPasien' => $dataPS,
                'as' => 'ramdanegie',
            );
        } else {
            $transMessage = "Update Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transStatus,
                'as' => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function updateStatusEnabledPasien(Request $request)
    {
        $kdProfile = (int)$this->getDataKdProfile($request);
        DB::beginTransaction();
        $tglAyeuna = date('Y-m-d H:i:s');
        $dataLogin = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id', $dataLogin['userData']['id'])
            ->where('lu.kdprofile', $kdProfile)
            ->first();

        $pasien = \DB::table('pasien_m')
            ->where('id', $request['idpasien'])
            ->where('statusenabled', true)
            ->where('kdprofile', $kdProfile)
            ->first();

        try {
            if ($request['idpasien'] != '') {
                $dataPS = Pasien::where('id', $request['idpasien'])
                    ->where('kdprofile', (int)$kdProfile)
                    ->update(
                        [
                            'statusenabled' => false,
                        ]
                    );

                /*Logging User*/
                $newId = LoggingUser::max('id');
                $newId = $newId + 1;
                $logUser = new LoggingUser();
                $logUser->id = $newId;
                $logUser->norec = $logUser->generateNewId();
                $logUser->kdprofile = $kdProfile;
                $logUser->statusenabled = true;
                $logUser->jenislog = 'Hapus Pasien';
                $logUser->noreff = $request['idpasien'];
                $logUser->referensi = 'id pasien';
                $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
                $logUser->tanggal = $tglAyeuna;
                $logUser->keterangan = 'Hapus Pasien No Rekam Medis : ' . $pasien->nocm . ', Nama Pasien : ' . $pasien->namapasien;
                $logUser->save();
                /*End Logging User*/
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "update status enabled ";
        }

        if ($transStatus == 'true') {
            $transMessage = "Hapus Berhasil";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'ramdanegie',
            );
        } else {
            $transMessage = "Hapus Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transStatus,
                'as' => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function postingBatalRegistrasi(Request $request)
    {
        $kdProfile = (int)$this->getDataKdProfile($request);
        DB::beginTransaction();
        $tglAyeuna = date('Y-m-d H:i:s');

        try {
            /*Logging User*/
            $logUser = new BatalRegistrasi();
            $logUser->norec = $logUser->generateNewId();
            $logUser->kdprofile = $kdProfile;
            $logUser->statusenabled = true;
            $logUser->alasanpembatalan = '24 jam tanpa pelayanan';
            $logUser->pasiendaftarfk = $request['pasiendaftarfk'];
            $logUser->pegawaifk = 320263;
            $logUser->pembatalanfk =  2;
            $logUser->tanggalpembatalan = $tglAyeuna;
            $logUser->save();

            $pasienDaftar = PasienDaftar::where('norec', $request['pasiendaftarfk'])->first();
            $pasienDaftar->statusenabled = false;
            $pasienDaftar->save();

            $transStatus = 'true';
            /*End Logging User*/
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Posting Berhasil";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'ramdanegie',
            );
        } else {
            $transMessage = "Posting Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transStatus,
                "e" => $e->getMessage() . ' ' . $e->getLine(),
                'as' => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function updateAsuransiPasien(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        DB::beginTransaction();
        $transStatus = 'true';
        try {
            $cek = Pasien::where('nocm', $request['nocm'])->first();
            $data2 = AsuransiPasien::where('nocmfk', $cek->id)
                ->where('kdprofile', (int)$kdProfile)
                ->update([
                    'objectkelasdijaminfk' => $request['objectkelasditanggungfk']
                ]);
            $transMessage = "Update Kelas Ditanggung berhasil";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Update Kelas Ditanggung gagal";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getComboKelas(Request $request)
    {
        $dataLogin = $request->all();
        $data = \DB::table('kelas_m as kls')
            ->select('kls.id', 'kls.namakelas','kls.kodebpjsnaikkelas')
            ->where('kls.statusenabled', true)
            ->orderBy('kls.namakelas')
            ->get();
        $result = array(
            'kelas' => $data
        );
        return $this->respond($result);
    }

    public function getPemakaianAsuransi(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
            ->select('pd.noregistrasi', 'pa.norec as norec_pa', 'pa.objectasuransipasienfk')
            ->where('pd.noregistrasi', $request['noregistrasi'])
            ->where('pd.kdprofile', (int)$kdProfile)
            ->get();

        $result = array(
            'dataz' => $data,
            'message' => 'inhuman',
        );
        return $this->respond($result);
    }

    public function getPsnByNoCm(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $data = \DB::table('pasien_m as ps')
            ->leftJOIN ('alamat_m as alm', function ($join) {
                $join->on('alm.nocmfk', '=', 'ps.id')
                    ->where('alm.objectjenisalamatfk', '=', 1);
            })
            ->leftjoin ('pendidikan_m as pdd','ps.objectpendidikanfk','=','pdd.id')
            ->leftjoin ('pekerjaan_m as pk','ps.objectpekerjaanfk','=','pk.id')
            ->leftjoin ('jeniskelamin_m as jk','jk.id','=','ps.objectjeniskelaminfk')
            ->leftjoin ('agama_m as agm','agm.id','=','ps.objectagamafk')
            ->leftjoin ('statusperkawinan_m as sp','sp.id','=','ps.objectstatusperkawinanfk')
            ->leftjoin ('kebangsaan_m as kb','kb.id','=','ps.objectkebangsaanfk')
            ->leftjoin ('negara_m as ng','ng.id','=','alm.objectnegarafk')
            ->leftjoin ('desakelurahan_m as dsk','dsk.id','=','alm.objectdesakelurahanfk')
            ->leftjoin ('kecamatan_m as kcm','kcm.id','=','alm.objectkecamatanfk')
            ->leftjoin ('kotakabupaten_m as kkb','kkb.id','=','alm.objectkotakabupatenfk')
            ->leftjoin ('propinsi_m as prp','prp.id','=','alm.objectpropinsifk')
            ->leftjoin ('pekerjaan_m as pk1','ps.pekerjaanpenangggungjawab','=','pk1.pekerjaan')
            ->leftjoin ('suku_m as sk','sk.id','=','ps.objectsukufk')
            ->leftjoin ('golongandarah_m as gol','gol.id','=','ps.objectgolongandarahfk')
            ->leftjoin ('jeniskelamin_m as jk1','jk1.jeniskelamin','=','ps.jeniskelaminpenanggungjawab')
            ->leftjoin ('bahasa_m as bh','bh.id','=','ps.bahasafk')
            ->leftjoin ('hambatankomunikasi_m as ham','ham.id','=','ps.hambatankomunikasifk')
            ->leftjoin ('jeniskelamin_m as jk2','jk2.jeniskelamin','=','ps.jeniskelaminpenanggungjawab2')
            ->leftjoin ('pekerjaan_m as pk2','pk2.pekerjaan','=','ps.pekerjaanpenangggungjawab2')
            ->select('ps.nocm','ps.id as nocmfk','ps.namapasien','ps.tgllahir','ps.tempatlahir',
                    'ps.objectjeniskelaminfk','jk.jeniskelamin','ps.objectagamafk','agm.agama','ps.objectstatusperkawinanfk',
                    'sp.statusperkawinan','ps.objectpendidikanfk','pdd.pendidikan','ps.objectpekerjaanfk','pk.pekerjaan',
                    'ps.objectkebangsaanfk','kb.name as kebangsaan','alm.objectnegarafk','ng.namanegara','ps.noidentitas',
                    'ps.nobpjs','ps.noasuransilain','alm.alamatlengkap','alm.kodepos','alm.objectdesakelurahanfk','dsk.namadesakelurahan',
                    'alm.objectkecamatanfk','kcm.namakecamatan','alm.objectkotakabupatenfk','kkb.namakotakabupaten',
                    'alm.objectpropinsifk','prp.namapropinsi','ps.notelepon','ps.nohp','ps.namaayah','ps.namaibu',
                    'ps.namakeluarga','ps.namasuamiistri','ps.penanggungjawab','ps.hubungankeluargapj','ps.pekerjaanpenangggungjawab',
                    'ps.ktppenanggungjawab','ps.alamatrmh','ps.alamatktr','pk1.id as idpek','ps.photo','ps.foto',
                    'ps.objectgolongandarahfk','gol.golongandarah','ps.objectsukufk','sk.suku','ps.bahasa as bahasapj','ps.teleponpenanggungjawab',
                    'ps.dokterpengirim','ps.alamatdokterpengirim','jk1.id as jkidpenanggungjawab','ps.jeniskelaminpenanggungjawab','ps.umurpenanggungjawab','ps.hambatankomunikasifk','ps.bahasafk','ham.hambatankomunikasi','bh.bahasa',
                    'ps.penanggungjawab2','ps.hubungankeluargapj2','ps.pekerjaanpenangggungjawab2','ps.alamatrmh2','ps.bahasa2',
                    'ps.teleponpenanggungjawab2','ps.jeniskelaminpenanggungjawab2','ps.umurpenanggungjawab2','jk2.id as idjk2','pk2.id as idpek2','ps.nik1','ps.nik2','ps.alergi','ps.sidik_jari','ps.noidentitaslain','ps.agamalain','ps.pekerjaanlain')
            ->where('ps.kdprofile', (int)$kdProfile);

        if (isset($request['noCm']) && $request['noCm'] != '' && $request['noCm'] != 'undefined') {
            $data = $data->where('ps.nocm', $request['noCm']);
        }
        if (isset($request['idPasien']) && $request['idPasien'] != '' && $request['idPasien'] != 'undefined') {
            $data = $data->where('ps.id', $request['idPasien']);
        }

        $data=$data->first();
        $dataAlamatD = DB::table('alamat_m as alm')
            ->leftJoin('desakelurahan_m as des', 'des.id', '=', 'alm.objectdesakelurahanfk')
            ->leftJoin('kecamatan_m as kc', 'kc.id', '=', 'alm.objectkecamatanfk')
            ->leftJoin('kotakabupaten_m as kot', 'kot.id', '=', 'alm.objectkotakabupatenfk')
            ->leftJoin('propinsi_m as pro', 'pro.id', '=', 'alm.objectpropinsifk')
            ->leftJoin('negara_m as ng', 'ng.id', '=', 'alm.objectnegarafk')
            ->select(
                'alm.alamatlengkap',
                'alm.rtrw',
                'alm.kodepos',
                'alm.objectdesakelurahanfk',
                'des.namadesakelurahan',
                'alm.objectkecamatanfk',
                'kc.namakecamatan',
                'alm.objectkotakabupatenfk',
                'kot.namakotakabupaten',
                'alm.objectpropinsifk',
                'pro.namapropinsi',
                'alm.objectnegarafk',
                'ng.namanegara'
            )
            ->where('alm.kdprofile', (int)$kdProfile)
            ->where('alm.statusenabled', true)
            ->where('alm.objectjenisalamatfk', 3)
            ->where('alm.nocmfk', $data->nocmfk)
            ->first();
        
        $alamatd = DB::table('alamatd_m')->where('nocmfk',$data->nocmfk)->get();
//        $dt=[];
//        foreach ($data as $itm){
//            $foto = null;
//            if($data->foto != null){
////                $foto = "data:image/jpeg;base64," . base64_encode($data->foto);
//                $details = DB::select(DB::raw("SELECT ps.sidik_jari encode(foto, 'base64') AS data FROM pasien_m WHERE id=:id"),
//                    array(
//                        'id' => $request['idPasien'],
//                    )
//                );
//
//                $foto = "data:image/jpeg;base64," . $details[0]->data;
//            }
            $dt = array(
                'nocm' => $data->nocm,
                'nocmfk' => $data->nocmfk,
                'namapasien' => $data->namapasien,
                'tgllahir' => $data->tgllahir,
                'tempatlahir' => $data->tempatlahir,
                'objectjeniskelaminfk' => $data->objectjeniskelaminfk,
                'jeniskelamin' => $data->jeniskelamin,
                'objectagamafk' => $data->objectagamafk,
                'agama' => $data->agama,
                'agamalain' => $data->agamalain,
                'objectstatusperkawinanfk' => $data->objectstatusperkawinanfk,
                'statusperkawinan' => $data->statusperkawinan,
                'objectpendidikanfk' => $data->objectpendidikanfk,
                'pendidikan' => $data->pendidikan,
                'objectpekerjaanfk' => $data->objectpekerjaanfk,                
                'pekerjaan' => $data->pekerjaan,
                'pekerjaanlain' => $data->pekerjaanlain,
                'objectkebangsaanfk' => $data->objectkebangsaanfk,                
                'kebangsaan' => $data->kebangsaan,
                'objectnegarafk' => $data->objectnegarafk,                
                'namanegara' => $data->namanegara,
                'noidentitas' => $data->noidentitas,                
                'noidentitaslain' => $data->noidentitaslain,              
                'nobpjs' => $data->nobpjs,
                'noasuransilain' => $data->noasuransilain,                
                'alamatlengkap' => $data->alamatlengkap,
                'kodepos' => $data->kodepos,                
                'objectdesakelurahanfk' => $data->objectdesakelurahanfk,
                'namadesakelurahan' => $data->namadesakelurahan,                
                'objectkecamatanfk' => $data->objectkecamatanfk,
                'namakecamatan' => $data->namakecamatan,                
                'objectkotakabupatenfk' => $data->objectkotakabupatenfk,
                'namakotakabupaten' => $data->namakotakabupaten,
                'objectpropinsifk' => $data->objectpropinsifk,
                'namapropinsi' => $data->namapropinsi,
                'notelepon' => $data->notelepon,'nohp' => $data->nohp,
                'namaayah' => $data->namaayah,'namaibu' => $data->namaibu,
                'namakeluarga' => $data->namakeluarga,'namasuamiistri' => $data->namasuamiistri,'penanggungjawab' => $data->penanggungjawab,'hubungankeluargapj' => $data->hubungankeluargapj,
                'pekerjaanpenangggungjawab' => $data->pekerjaanpenangggungjawab,'ktppenanggungjawab' => $data->ktppenanggungjawab,'penanggungjawab' => $data->penanggungjawab,'alamatrmh' => $data->alamatrmh,
                'alamatktr' => $data->alamatktr,'idpek' => $data->idpek,
                'foto' => $data->foto,//$foto,
                'photo' => $data->photo,
                'suku' => $data->suku,
                'objectsukufk' => $data->objectsukufk,
                'golongandarah' => $data->golongandarah,
                'objectgolongandarahfk' => $data->objectgolongandarahfk,
                'bahasa' => $data->bahasa,
                'teleponpenanggungjawab' => $data->teleponpenanggungjawab,
                'dokterpengirim' => $data->dokterpengirim,
                'alamatdokterpengirim' => $data->alamatdokterpengirim,
                'jkidpenanggungjawab' => $data->jkidpenanggungjawab,
                'jeniskelaminpenanggungjawab' => $data->jeniskelaminpenanggungjawab,
                'umurpenanggungjawab' => $data->umurpenanggungjawab,
                'hambatankomunikasifk' => $data->hambatankomunikasifk,
                'bahasafk' => $data->bahasafk,
                'hambatankomunikasi' => $data->hambatankomunikasi,
                'bahasa' => $data->bahasa,
                'penanggungjawab2' => $data->penanggungjawab2,
                'hubungankeluargapj2' => $data->hubungankeluargapj2,
                'pekerjaanpenangggungjawab2' => $data->pekerjaanpenangggungjawab2,
                'alamatrmh2' => $data->alamatrmh2,
                'bahasa2' => $data->bahasa2,
                'teleponpenanggungjawab2' => $data->teleponpenanggungjawab2,
                'jeniskelaminpenanggungjawab2' => $data->jeniskelaminpenanggungjawab2,
                'umurpenanggungjawab2' => $data->umurpenanggungjawab2,
                'idjk2' => $data->idjk2,
                'idpek2' => $data->idpek2,
                'alamatd' => $alamatd,
                'nik1' => $data->nik1,
                'nik2' => $data->nik2,
                'alergi' => $data->alergi,
                'sidik_jari' => $data->sidik_jari,
                'bahasapj' => $data->bahasapj,
                'alamatdomisili' => !empty($dataAlamatD) ? $dataAlamatD->alamatlengkap : null,
                'rtrwdomisili' => !empty($dataAlamatD) ? $dataAlamatD->rtrw : null,
                'kodeposdomisili' => !empty($dataAlamatD) ? $dataAlamatD->kodepos : null,
                'objectdesakelurahandomisilifk' => !empty($dataAlamatD) ? $dataAlamatD->objectdesakelurahanfk : null,
                'namadesakelurahandomisili' => !empty($dataAlamatD) ? $dataAlamatD->namadesakelurahan : null,
                'objectkecamatandomisilifk' => !empty($dataAlamatD) ? $dataAlamatD->objectkecamatanfk : null,
                'namakecamatandomisili' => !empty($dataAlamatD) ? $dataAlamatD->namakecamatan : null,
                'objectkotakabupatendomisilifk' => !empty($dataAlamatD) ? $dataAlamatD->objectkotakabupatenfk : null,
                'namakotakabupatendomisili' => !empty($dataAlamatD) ? $dataAlamatD->namakotakabupaten : null,
                'objectpropinsidomisilifk' => !empty($dataAlamatD) ? $dataAlamatD->objectpropinsifk : null,
                'namapropinsidomisili' => !empty($dataAlamatD) ? $dataAlamatD->namapropinsi : null,
                'objectnegaradomisilifk' => !empty($dataAlamatD) ? $dataAlamatD->objectnegarafk : null,
                'namanegaradomisili' => !empty($dataAlamatD) ? $dataAlamatD->namanegara : null,
            );
//        }
        $result = array(
            'data' => $dt,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function getHistoryPemakaianAsuransiNew(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $data = \DB::table('pemakaianasuransi_t as pa')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'pa.noregistrasifk')
            ->leftjoin('asuransipasien_m as apn', 'apn.id', '=', 'pa.objectasuransipasienfk')
            ->leftjoin('rekanan_m as rek', 'rek.id', '=', 'apn.kdpenjaminpasien')
            ->leftjoin('rekanan_m as rek2', 'rek2.id', '=', 'pd.objectrekananfk')
            ->leftjoin('hubunganpesertaasuransi_m as hpa', 'hpa.id', '=', 'apn.objecthubunganpesertafk')
            ->leftjoin('kelas_m as kls', 'kls.id', '=', 'apn.objectkelasdijaminfk')
            ->leftjoin('diagnosa_m as dg', 'dg.id', '=', 'pa.objectdiagnosafk')
            ->leftjoin('kelompokpasien_m as kps', 'kps.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftjoin('asalrujukan_m as asl', 'asl.id', '=', 'pa.asalrujukanfk')
            ->select(
                'pa.norec',
                'apn.id as norec_ap',
                'rek.namarekanan',
                'pd.noregistrasi',
                'pa.nokepesertaan',
                'apn.namapeserta',
                'apn.noasuransi',
                'apn.tgllahir',
                'apn.noidentitas',
                'apn.alamatlengkap',
                'apn.objecthubunganpesertafk',
                'pa.nosep',
                'pa.tanggalsep',
                'apn.objectkelasdijaminfk',
                'kls.namakelas',
                'pa.catatan',
                'pa.norujukan',
                'apn.kdprovider',
                'apn.nmprovider',
                'pa.tglrujukan',
                'pa.objectdiagnosafk',
                'dg.kddiagnosa',
                'dg.namadiagnosa',
                'pa.lakalantas',
                'pa.ppkrujukan',
                'pa.lokasilakalantas',
                'pa.penjaminlaka',
                'pd.objectkelompokpasienlastfk',
                'pd.objectrekananfk',
                'rek2.namarekanan as namarekananpd',
                'kps.kelompokpasien',
                'apn.kdpenjaminpasien',
                'apn.jenispeserta',
                'hpa.hubunganpeserta',
                'apn.tgllahir',
                'pa.cob',
                'pa.katarak',
                'pa.keteranganlaka',
                'pa.tglkejadian',
                'pa.suplesi',
                'pa.nosepsuplesi',
                'pa.kdpropinsi',
                'pa.namapropinsi',
                'pa.kdkabupaten',
                'pa.namakabupaten',
                'pa.kdkecamatan',
                'pa.namakecamatan',
                'pa.nosuratskdp',
                'pa.kodedpjp',
                'pa.namadpjp',
                'pa.asalrujukanfk',
                'asl.asalrujukan',
                'pa.kodedpjpmelayani',
                'pa.namadjpjpmelayanni',
                'pa.klsrawatnaik',
                'pa.pembiayaan',
                'pa.penanggungjawab',
                'pa.tujuankunj',
                'pa.flagprocedure',
                'pa.kdpenunjang',
                'pa.assesmentpel',
                'pa.tglcreate',
                'pa.statuskunjungan',
                'pa.poliasalkode',
                'pa.politujuankode'
            )
            ->whereRaw(" ( pa.norec='$request[noregistrasi]' or pd.noregistrasi='$request[noregistrasi]')")
            //               ->orWhere('pd.noregistrasi', $request['noregistrasi'])
            //
            ->where('pa.kdprofile', (int)$kdProfile)
            ->get();

        $result = array(
            'data' => $data,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }

    public function getPasienOnlineByNorec($noreservasi, Request $request)
    {
        // $norecReservasi=$request['norecReservasi'];
        $kdProfile = $this->getDataKdProfile($request);
        $data = \DB::table('antrianpasienregistrasi_t as apr')
            ->leftjoin('pasien_m as ps', 'ps.id', '=', 'apr.nocmfk')
            ->leftjoin('agama_m as agm ', 'agm.id', '=', 'apr.objectagamafk')
            ->leftjoin('asalrujukan_m as aru', 'aru.id', '=', 'apr.objectasalrujukanfk')
            ->leftjoin('desakelurahan_m as ds', 'ds.id', '=', 'apr.objectdesakelurahanfk')
            ->leftjoin('jeniskelamin_m as jk', 'jk.id', '=', 'apr.objectjeniskelaminfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'apr.objectpegawaifk')
            ->leftjoin('pekerjaan_m as pkj', 'pkj.id', '=', 'apr.objectpekerjaanfk')
            ->leftjoin('pendidikan_m as pdd', 'pdd.id', '=', 'apr.objectpendidikanfk')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apr.objectruanganfk')
            ->leftjoin('statusperkawinan_m as st', 'st.id', '=', 'apr.objectstatusperkawinanfk')
            ->leftjoin('kelompokpasien_m as kps', 'kps.id', '=', 'apr.objectkelompokpasienfk')
            ->leftjoin('golongandarah_m as gd', 'gd.id', '=', 'apr.objectgolongandarahfk')
            ->leftjoin('hambatankomunikasi_m as hk', 'hk.id', '=', 'apr.objecthambatankomunikasifk')
            ->select(
                'apr.norec',
                'apr.noreservasi',
                'apr.nocmfk',
                'ps.nocm',
                'apr.namapasien',
                'apr.alamatlengkap',
                'apr.namaayah',
                'apr.namaibu',
                'apr.namasuamiistri',
                'apr.noaditional',
                'apr.noasuransilain',
                'apr.noidentitas',
                'apr.notelepon',
                'apr.nobpjs',
                'apr.tempatlahir',
                'apr.tgllahir',
                'apr.tanggalreservasi',
                'apr.tipepasien',
                'apr.objectagamafk',
                'agm.agama',
                'apr.objectasalrujukanfk',
                'aru.asalrujukan',
                'apr.objectdesakelurahanfk',
                'ds.namadesakelurahan',
                'apr.isconfirm',
                'apr.objectjeniskelaminfk',
                'jk.jeniskelamin',
                'apr.objectpegawaifk',
                'pg.namalengkap as dokter',
                'apr.objectpekerjaanfk',
                'pkj.pekerjaan',
                'apr.objectpendidikanfk',
                'pdd.pendidikan',
                'apr.objectruanganfk',
                'ru.namaruangan as ruangantujuan',
                'apr.objectstatusperkawinanfk',
                'st.statusperkawinan',
                'apr.objectkelompokpasienfk',
                'kps.kelompokpasien',
                'gd.golongandarah',
                'apr.objectgolongandarahfk',
                'hk.hambatankomunikasi',
                'apr.objecthambatankomunikasifk',
                'apr.nikpenanggungjawab',
                'apr.namapenanggungjawab',
                'apr.alamatpenanggungjawab',
                'apr.notelppenanggungjawab'
            )
            ->where('apr.norec', $noreservasi)
            ->where('apr.kdprofile', (int)$kdProfile)
            ->first();

        $result = array(
            'data' => $data,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function getMaxNoregistrasi()
    {
        $dateNow = Carbon::now();
        $year = Carbon::createFromFormat('Y-m-d H:i:s', $dateNow)->year;
        $month = Carbon::createFromFormat('Y-m-d H:i:s', $dateNow)->month;
        $tahun = (string)$year;
        $countByMonthAndYear = 0;
        $subStrTahun = substr($tahun, 2, 4);
        $lastNoRegistrasi = collect(\DB::select("select max(p.noregistrasi)  as noregistrasi
            from pasiendaftar_t p where cast(substring(p.noregistrasi, 1,2)as int)='$subStrTahun'
            and cast(substring(p.noregistrasi, 3,2)as int)=$month"))->first();
        if (!empty($lastNoRegistrasi->noregistrasi)) {
            $temp = substr($lastNoRegistrasi->noregistrasi, 4, 10);
            $countByMonthAndYear = (int)$temp;
        }
        $countByMonthAndYear++;

        $monthNow = Carbon::createFromFormat('Y-m-d H:i:s', $dateNow)->month;
        $yearNow = Carbon::createFromFormat('Y-m-d H:i:s', $dateNow)->year;
        $yearNowString = substr((string)$yearNow, 2, 4);
        $dateNowString = (string)$monthNow;
        $countByMonthAndYear = (string)$countByMonthAndYear;
        $countString = null;
        if (!empty($countByMonthAndYear)) {
            if (strlen($countByMonthAndYear) == 1) {
                $countString = '00000' . $countByMonthAndYear;
            } else if (strlen($countByMonthAndYear) == 2) {
                $countString = '0000' . $countByMonthAndYear;
            } else if (strlen($countByMonthAndYear) == 3) {
                $countString = '000' . $countByMonthAndYear;
            } else if (strlen($countByMonthAndYear) == 4) {
                $countString = '00' . $countByMonthAndYear;
            } else if (strlen($countByMonthAndYear) == 5) {
                $countString = '0' . $countByMonthAndYear;
            }
        }
        if (strlen($dateNowString) == 1) {
            $dateNowString = '0' . $monthNow;
        }
        $result = $yearNowString . $dateNowString . $countString;

        return $result;
    }

    public function getApdDetail(Request $request)
    {
        $noregistrasi = $request['noregistrasi'];
        $ruanganlast = $request['ruanganlast'];
        $kdProfile = $this->getDataKdProfile($request);
        $data =   collect(\DB::select("select * from
                (select pd.tglregistrasi,  ps.id as nocmfk,  ps.nocm,  pd.noregistrasi,  ps.namapasien,  ps.tgllahir,
                 jk.jeniskelamin,  apd.objectruanganfk, ru.namaruangan,  kls.id as idkelas,kls.namakelas,  kp.kelompokpasien,  rek.namarekanan,
                 apd.objectpegawaifk,  pg.namalengkap as namadokter,  br.norec,
                 pd.norec as norec_pd, apd.tglmasuk, apd.norec as norec_apd, row_number() over (partition by pd.noregistrasi order by apd.tglmasuk desc) as rownum
                 from antrianpasiendiperiksa_t as apd
                 inner join pasiendaftar_t as pd on pd.norec = apd.noregistrasifk and pd.objectruanganlastfk = apd.objectruanganfk
                 left join batalregistrasi_t as br on br.pasiendaftarfk = pd.norec
                 inner join pasien_m as ps on ps.id = pd.nocmfk
                 left join registrasipelayananpasien_t as rpp on rpp.noregistrasifk=pd.norec
                 left join jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk
                 left join kelas_m as kls on kls.id = pd.objectkelasfk
                 left join ruangan_m as ru on ru.id = apd.objectruanganfk
                 left join departemen_m as dept on dept.id = ru.objectdepartemenfk
                 left join pegawai_m as pg on pg.id = apd.objectpegawaifk
                 left join kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
                 left join rekanan_m as rek on rek.id = pd.objectrekananfk
                 where br.norec is null and apd.kdprofile = $kdProfile
                --and dept.id in (16,  17,  35)
                --and pd.tglpulang is null
                and pd.noregistrasi='$noregistrasi'
                and ru.id= $ruanganlast
              ) as x where x.rownum=1"))->first();

        $result = array(
            'data' => $data,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function getKecamatanByDesaKelurahan($idDesa)
    {
        $kecamatan = \DB::table('kecamatan_m as ru')
            ->join('desakelurahan_m as dk', 'ru.id', '=', 'dk.objectkecamatanfk')
            ->select(
                'ru.id',
                'ru.namakecamatan as namaKecamatan',
                'ru.kdkecamatan as kdKecamatan',
                'ru.objectkotakabupatenfk as kotaKabupatenId',
                'ru.namaexternal as namaExternal',
                'ru.objectpropinsifk as propinsiId'
            )
            ->where('ru.statusenabled', true)
            ->where('dk.id', $idDesa)
            ->orderBy('ru.namakecamatan');
        $kecamatan = $kecamatan->get();
        return $this->respond($kecamatan);
    }

    public function batalPeriksaDelete(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $dataLogin = $request->all();
        DB::beginTransaction();
        try {
            $pasienDaftar = PasienDaftar::where('norec', $request['norec'])->first();
            $data = \DB::table('pasiendaftar_t as pd')
                ->Join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                ->leftJoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
                ->leftJoin('batalregistrasi_t as br', 'br.pasiendaftarfk', '=', 'pd.norec')
                ->Join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                ->Join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
                ->Join('ruangan_m as ru2', 'ru2.id', '=', 'apd.objectruanganfk')
                ->select(
                    'pd.norec',
                    'pd.tglregistrasi',
                    'ps.nocm',
                    'pd.noregistrasi',
                    'ps.namapasien',
                    'pd.objectruanganasalfk',
                    'ru.namaruangan',
                    'br.norec as norec_br',
                    'apd.norec as norec_apd',
                    'ru2.objectdepartemenfk as departemen_apd',
                    'pp.norec as norec_pp',
                    'ru.objectdepartemenfk',
                    'pp.strukresepfk',
                    'apd.objectruanganfk'
                )
                ->where('pd.norec', $request['norec'])
                ->where('pd.kdprofile', (int)$kdProfile)
                ->orderBy('pp.strukresepfk')
                ->get();
            foreach ($data as $items) {
                $message = 'Sukses';
                if ($items->strukresepfk != null) {
                    $message = 'Hapus Resep dulu!';
                    break;
                }
                if ($pasienDaftar->nostruklastfk == null) {
                    if ($request['jenishapus'] == 'hapusregis') {
                        foreach ($data as $item) {
                            if ($item->norec_pp != null) {
                                PelayananPasienPetugas::where('pelayananpasien', $item->norec_pp)->where('kdprofile', (int)$kdProfile)->delete();
                                PelayananPasienDetail::where('pelayananpasien', $item->norec_pp)->where('kdprofile', (int)$kdProfile)->delete();
                                PelayananPasien::where('norec', $item->norec_pp)->where('kdprofile', (int)$kdProfile)->delete();
                            }
                            DetailDiagnosaPasien::where('noregistrasifk', $item->norec_apd)->where('kdprofile', (int)$kdProfile)->delete();
                            DiagnosaPasien::where('noregistrasifk', $item->norec_apd)->where('kdprofile', (int)$kdProfile)->delete();
                        }
                        AntrianPasienDiperiksa::where('noregistrasifk', $request['norec'])->where('kdprofile', (int)$kdProfile)->delete();
                        RegistrasiPelayananPasien::where('noregistrasifk', $request['norec'])->where('kdprofile', (int)$kdProfile)->delete();
                        //                        AntrianPasienDiperiksa::where('noregistrasifk', $request['norec'])->update(
                        //                            [ 'statusenabled' => false]
                        //                        );
                        //                        RegistrasiPelayananPasien::where('noregistrasifk', $request['norec'])->update(
                        //                            [ 'statusenabled' => false]
                        //                        );
                        //region Model Batal Periksa & Logging
                        $newBR = new BatalRegistrasi();
                        $newBR->norec = $newBR->generateNewId();
                        $newBR->kdprofile = (int)$kdProfile;
                        $newBR->statusenabled = true;
                        $newBR->alasanpembatalan = $request['alasanpembatalan'];
                        $newBR->pasiendaftarfk = $request['norec'];
                        $newBR->pegawaifk = $this->getCurrentUserID();
                        $newBR->pembatalanfk = $request['pembatalanfk'];
                        $newBR->tanggalpembatalan = $request['tanggalpembatalan'];
                        $newBR->save();

                        PasienDaftar::where('norec', $request['norec'])
                            ->where('kdprofile', (int)$kdProfile)
                            ->update([
                                'kdprofile' => (int)$kdProfile,
                                'statusenabled' => false,
                                'tglpulang' => $pasienDaftar->tglregistrasi,
                            ]);

                        $newId = LoggingUser::max('id');
                        $newId = $newId + 1;
                        $logUser = new LoggingUser();
                        $logUser->id = $newId;
                        $logUser->norec = $logUser->generateNewId();
                        $logUser->kdprofile = (int)$kdProfile;
                        $logUser->statusenabled = true;
                        $logUser->jenislog = 'Hapus Registrasi';
                        $logUser->noreff = $request['norec'];
                        $logUser->referensi = 'norec Pasien Daftar';
                        $logUser->keterangan = 'hapus semua pelayanan';
                        $logUser->objectloginuserfk = $dataLogin['userData']['id'];
                        $logUser->tanggal = $this->getDateTime()->format('Y-m-d H:i:s');
                        $logUser->save();
                        //endregion
                    } else {
                        foreach ($data as $item) {
                            if ($item->departemen_apd == 16) {
                                if ($item->norec_pp != null) {
                                    PelayananPasienPetugas::where('pelayananpasien', $item->norec_pp)->where('kdprofile', (int)$kdProfile)->delete();
                                    PelayananPasienDetail::where('pelayananpasien', $item->norec_pp)->where('kdprofile', (int)$kdProfile)->delete();
                                    PelayananPasien::where('norec', $item->norec_pp)->where('kdprofile', (int)$kdProfile)->delete();
                                }
                                DetailDiagnosaPasien::where('noregistrasifk', $item->norec_apd)->where('kdprofile', (int)$kdProfile)->delete();
                                DiagnosaPasien::where('noregistrasifk', $item->norec_apd)->where('kdprofile', (int)$kdProfile)->delete();

                                StrukResep::where('pasienfk', $item->norec_apd)
                                    ->where('statusenabled', false)
                                    ->update(['pasienfk' => null]);

                                AntrianPasienDiperiksa::where('noregistrasifk', $request['norec'])
                                    ->where('objectruanganfk', $item->objectruanganfk)->where('kdprofile', (int)$kdProfile)->delete();
                                RegistrasiPelayananPasien::where('noregistrasifk', $request['norec'])
                                    ->where('objectruanganfk', $item->objectruanganfk)->where('kdprofile', (int)$kdProfile)->delete();
                            }
                            if ($item->departemen_apd != 16 && $item->departemen_apd != 3  && $item->departemen_apd != 27) {
                                PasienDaftar::where('norec', $request['norec'])->where('kdprofile', (int)$kdProfile)->update([
                                    'tglpulang' => $pasienDaftar->tglregistrasi,
                                    'objectruanganlastfk' => $item->objectruanganfk,
                                ]);
                            }
                            //                            else{
                            //                                $message = 'Tidak bisa batal Rawat Inap';
                            //                            }
                        }
                        //region Model Batal Periksa & Logging
                        $newId = LoggingUser::max('id');
                        $newId = $newId + 1;
                        $logUser = new LoggingUser();
                        $logUser->id = $newId;
                        $logUser->norec = $logUser->generateNewId();
                        $logUser->kdprofile = (int)$kdProfile;
                        $logUser->statusenabled = true;
                        $logUser->jenislog = 'Batal Rawat Inap';
                        $logUser->noreff = $request['norec'];
                        $logUser->referensi = 'norec Pasien Daftar';
                        $logUser->keterangan = 'hapus semua pelayanan';
                        $logUser->objectloginuserfk = $dataLogin['userData']['id'];
                        $logUser->tanggal = $this->getDateTime()->format('Y-m-d H:i:s');
                        $logUser->save();
                        //endregion
                    }
                }
            }

            $transStatus = 'true';
            $transMessage = $message;
        } catch (\Exception $e) {
            $transStatus = 'false';
            $message = 'Gagal';
            $transMessage = $message;
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "norec_pd" => $request['norec'],
                "as" => 'giw',
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "norec_pd" => $request['norec'],
                "as" => 'giw',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getKamarIbuLast(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $idIbu = $request['id_ibu'];
        $noCm = $request['nocm'];
        $data = DB::select(DB::raw("
                select * from
                            (select pd.norec as norec_pd,  apd.norec as norec_apd,  ps.nocm,
                            pd.noregistrasi,  apd.objectkamarfk,  tt.id as nobed,  kmr.namakamar,
                            tt.reportdisplay as tempattidur,ps.namapasien,
                            kls.id as kelasfk, kls.namakelas,ru.namaruangan,pd.objectruanganlastfk,
                            row_number() over (partition by apd.objectruanganfk order by apd.tglmasuk desc) as rownum
                            from pasiendaftar_t as pd
                            inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec and pd.objectruanganlastfk=apd.objectruanganfk
                            inner join pasien_m as ps on ps.id = pd.nocmfk
                            inner join ruangan_m as ru on ru.id = pd.objectruanganlastfk
                            inner join kelas_m as kls on kls.id = pd.objectkelasfk
                            left join kamar_m as kmr on kmr.id = apd.objectkamarfk
                            left join tempattidur_m as tt on tt.id = apd.nobed
                            where ps.qpasien ='$idIbu'
                            and ps.nocm <> '$noCm'
                            and ps.namapasien not  like '%By Ny%'
                            and pd.tglpulang is null
                            and pd.kdprofile = $idProfile
                ) as x
                where x.rownum =1
               "));

        return $this->respond($data);
    }
    public function getNorecAPD(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $filter = $request->all();
        $noreg = '';
        if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
            $noreg = " AND pd.noregistrasi = '" .  $filter['noreg'] . "'";
        }
        $ruangId = '';
        if (isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined") {
            $ruangId = ' AND apd.objectruanganfk = ' . $filter['ruangId'];
        }
        $namaRuangan = '';
        if (isset($filter['namaRuangan']) && $filter['namaRuangan'] != "" && $filter['namaRuangan'] != "undefined") {
            $ruangId = " AND ru.namaruangan like '%"  . $filter['namaRuangan'] . "%'";
        }
        $data = DB::select(
            DB::raw("select * from
                (select pd.tglregistrasi,pd.noregistrasi, ru.namaruangan,
                 pd.norec as norec_pd, apd.tglmasuk, apd.norec as norec_apd,
                 row_number() over (partition by pd.noregistrasi order by apd.tglmasuk desc) as rownum
                 from antrianpasiendiperiksa_t as apd
                 inner join pasiendaftar_t as pd on pd.norec = apd.noregistrasifk and pd.objectruanganlastfk = apd.objectruanganfk
                 left join batalregistrasi_t as br on br.pasiendaftarfk = pd.norec
                 inner join ruangan_m as ru on ru.id = apd.objectruanganfk
                 where br.norec is null and pd.kdprofile = $idProfile
                and pd.tglpulang is null --and pd.noregistrasi='1808010084'
                $ruangId $noreg  $namaRuangan
              ) as x where x.rownum=1")
        );
        return $this->respond($data);
    }

    public function getComboRegBaru(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $dataLogin = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->join('pegawai_m as pg', 'pg.id', '=', 'lu.objectpegawaifk')
            ->select('lu.objectpegawaifk', 'pg.namalengkap')
            ->where('lu.id', $dataLogin['userData']['id'])
            ->where('lu.kdprofile', $kdProfile)
            ->first();

        $jk = JenisKelamin::where('statusenabled', true)
            ->select(DB::raw("id, UPPER(jeniskelamin) as jeniskelamin"))
            ->where('kdprofile', $kdProfile)
            ->get();

        $agama = Agama::where('statusenabled', true)
            ->select(DB::raw("id, UPPER(agama) as agama"))
            ->where('kdprofile', $kdProfile)
            ->get();

        $statusPerkawinan = StatusPerkawinan::where('statusenabled', true)
            ->select(DB::raw("id, UPPER(statusperkawinan) as statusperkawinan,namaexternal as namadukcapil"))
            ->where('kdprofile', $kdProfile)
            ->get();

        $pendidikan = Pendidikan::where('statusenabled', true)
            ->select(DB::raw("id, UPPER(pendidikan) as pendidikan,namaexternal as namadukcapil"))
            ->where('kdprofile', $kdProfile)
            ->get();

        $pekerjaan = DB::table('pekerjaan_m')
            ->select(DB::raw("id, UPPER(pekerjaan) as pekerjaan,namaexternal as namadukcapil"))
            ->where('statusenabled', true)
            ->where('kdprofile', $kdProfile)
            ->get();

        $gd = DB::table('golongandarah_m')
            ->select(DB::raw("id, UPPER(golongandarah) as golongandarah,namaexternal as namadukcapil"))
            ->where('statusenabled', true)
            ->get();
        $suku = DB::table('suku_m')
            ->select(DB::raw("id, UPPER(suku) as suku"))
            ->where('statusenabled', true)
            ->where('kdprofile', $kdProfile)
            ->get();
        $ham = DB::table('hambatankomunikasi_m')
            ->select(DB::raw("id, UPPER(hambatankomunikasi) as hambatankomunikasi"))
            ->where('statusenabled', true)
            ->where('kdprofile', $kdProfile)
            ->get();
        $bahasa = DB::table('bahasa_m')
            ->select(DB::raw("id, UPPER(bahasa) as bahasa"))
            ->where('statusenabled', true)
            ->where('kdprofile', $kdProfile)
            ->get();
        $jenis = DB::table('jenisalamat_m')
            ->select(DB::raw("id, UPPER(jenisalamat) as jenisalamat"))
            ->where('statusenabled', true)
            ->where('kdprofile', $kdProfile)
            ->get();
        $result = array(
            'jeniskelamin' => $jk,
            'agama' => $agama,
            'statusperkawinan' => $statusPerkawinan,
            'pendidikan' => $pendidikan,
            'pekerjaan' => $pekerjaan,
            'pegawaiLogin' => $dataPegawai->namalengkap,
            'golongandarah' => $gd,
            'suku' => $suku,
            'hambatan' => $ham,
            'bahasa' => $bahasa,
            'jenis' => $jenis,
            'message' => 'inhuman',
        );

        return $this->respond($result);
    }
    public function getComboAddress(Request $request)
    {

        $kebangsaan = DB::table('kebangsaan_m')
            ->select(DB::raw("id, UPPER(name) as name"))
            ->where('statusenabled', true)
            ->get();

        $negara = DB::table('negara_m')
            ->select(DB::raw("id, UPPER(namanegara) as namanegara"))
            ->where('statusenabled', true)
            ->orderBy('namanegara')
            ->get();

        $kotakabupaten = DB::table('kotakabupaten_m')
            ->select(DB::raw("id, UPPER(namakotakabupaten) as namakotakabupaten"))
            ->where('statusenabled', true)
            ->orderBy('namakotakabupaten')
            ->get();

        $propinsi = DB::table('propinsi_m')
            ->select(DB::raw("id, UPPER(namapropinsi) as namapropinsi"))
            ->where('statusenabled', true)
            ->orderBy('namapropinsi')
            ->get();

        $kecamatan = DB::table('kecamatan_m')
            ->select(DB::raw("id, UPPER(namakecamatan) as namakecamatan"))
            ->where('statusenabled', true)
            ->orderBy('namakecamatan')
            ->get();
        $result = array(
            'kebangsaan' => $kebangsaan,
            'negara' => $negara,
            'kotakabupaten' => $kotakabupaten,
            'propinsi' => $propinsi,
            'kecamatan' => $kecamatan,
            'message' => 'inhuman',
        );

        return $this->respond($result);
    }
    public function getDesaKelurahanPaging(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $req = $request->all();
        if (isset($req['filter']['filters'][0]['value'])) {
            $explode = explode(',', $req['filter']['filters'][0]['value']);
            if (count($explode) > 1) {
                $namaDesa = $explode[0];
                $namaKec = $explode[1];
            }
        }

        //        return $namaKec;
        $Desa = \DB::table('desakelurahan_m as ds')
            ->join('kecamatan_m as kc', 'ds.objectkecamatanfk', '=', 'kc.id')
            ->join('kotakabupaten_m as kk', 'ds.objectkotakabupatenfk', '=', 'kk.id')
            ->join('propinsi_m as pp', 'ds.objectpropinsifk', '=', 'pp.id')
            ->select(DB::raw("ds.id,UPPER(ds.namadesakelurahan) as namadesakelurahan,ds.kodepos,
			                 ds.objectkecamatanfk,ds.objectkotakabupatenfk,ds.objectpropinsifk,
				             kc.namakecamatan,kk.namakotakabupaten,pp.namapropinsi"))
            ->where('ds.statusenabled', true)
            ->orderBy('ds.namadesakelurahan');

        if (
            isset($req['namadesakelurahan']) &&
            $req['namadesakelurahan'] != "" &&
            $req['namadesakelurahan'] != "undefined"
        ) {
            $Desa = $Desa->where('ds.namadesakelurahan', 'ilike', '%' . $req['namadesakelurahan'] . '%');
        };
        if (
            isset($req['namakecamatan']) &&
            $req['namakecamatan'] != "" &&
            $req['namakecamatan'] != "undefined"
        ) {
            $Desa = $Desa->where('kc.namakecamatan', 'ilike', '%' . $req['namakecamatan'] . '%');
        };
        if (
            isset($req['iddesakelurahan']) &&
            $req['iddesakelurahan'] != "" &&
            $req['iddesakelurahan'] != "undefined"
        ) {
            $Desa = $Desa->where('ds.id', $req['iddesakelurahan']);
        };
        if (
            isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined"
        ) {
            if (isset($namaDesa) && isset($namaKec)) {
                $Desa = $Desa
                    ->where('ds.namadesakelurahan', 'ilike', '%' . $namaDesa . '%')
                    ->where('kc.namakecamatan', 'ilike', '%' . $namaKec . '%');
            } else {
                $Desa = $Desa
                    ->where('ds.namadesakelurahan', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%')
                    ->Orwhere('kc.namakecamatan', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%');
            }
        }

        $Desa = $Desa->take(20);
        $Desa = $Desa->get();
        $tempDesa = [];
        if (count($Desa) != 0) {
            foreach ($Desa as $item) {
                $tempDesa[] = array(
                    'id' => $item->id,
                    'namadesakelurahan' => $item->namadesakelurahan,
                    'kodepos' => $item->kodepos,
                    'namakecamatan' => $item->namakecamatan,
                    'namakotakabupaten' => $item->namakotakabupaten,
                    'namapropinsi' => $item->namapropinsi,
                    'desa' => $item->namadesakelurahan . ',' . $item->namakecamatan . ',' . $item->namakotakabupaten . ',' .
                        $item->namapropinsi,
                    'objectkecamatanfk' => $item->objectkecamatanfk,
                    'objectkotakabupatenfk' => $item->objectkotakabupatenfk,
                    'objectpropinsifk' => $item->objectpropinsifk,
                );
            }
        }
        return $this->respond($tempDesa);
    }
    public function savePasienFix(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int)$kdProfile;
        $detLogin = $request->all();
        DB::beginTransaction();

        try {

            //region Save Pasien
            if ($request['idpasien'] == '') {
                if (
                    isset($request['pasien']['noIdentitas']) && $request['pasien']['noIdentitas'] != '-'
                    && $request['pasien']['noIdentitas'] != ''
                ) {
                    $cek = Pasien::where('noidentitas', $request['pasien']['noIdentitas'])->where('statusenabled', true)
                        ->where('statusenabled', true)
                        ->first();
                    if (!empty($cek)) {
                        $transMessage = "NIK ini sudah terdaftar sebagai " . $cek->namapasien . ' (' . $cek->nocm . ')';
                        DB::rollBack();
                        $result = array(
                            "status" => 400,
                            "message"  => $transMessage,
                            "as" => 'er@epic',
                        );
                        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                    }
                }
                //				$newId2 = 720000;
                //				$newId = Pasien::where('id','>',(float)720000-1)
                //					->where('id','<',(float)10000000)
                //					->count('id');
                //				$newId = (float)$newId2 + (float)$newId + 4;


                $newId = Pasien::max('id') + 1;
                //region NO CM Penunjang
                if (isset($request['isPenunjang'])  &&  $request['isPenunjang'] == true) {
                    $noCm = $this->generateCodeBySeqTable(new Pasien, 'nocm_penunjang', 9, 'P', $idProfile);
                } else if (isset($request['isTelemedicine'])  &&  $request['isTelemedicine'] == true) {
                    $noCm = $this->generateCodeBySeqTable(new Pasien, 'nocm_telemedicine', 9, 'T', $idProfile);
                }
                //endregion
                else {
                    //region SaveRunningNumber
                    $idRunningNumber = 1745;
                    // if ($request['isbayi'] == true) {
                    //     $idRunningNumber = 13535;
                    // }
                    $runningNumber = RunningNumber::where('id', $idRunningNumber)->where('kdprofile', $idProfile)->first();
                    $extension = $runningNumber->extention;
                    // if ($request['isbayi'] == true) {
                    //     $extension = $runningNumber->reset . $runningNumber->extention;
                    // }
                    $noCmTerakhir = $runningNumber->nomer_terbaru + 1;
                    $noCm = '0' . $extension . $noCmTerakhir;

                    RunningNumber::where('id', $idRunningNumber)
                        ->update(
                            [
                                'nomer_terbaru' => $noCmTerakhir
                            ]
                        );

                    //endregion

                }

                $dataPS = new Pasien();
                $dataPS->id = $newId;
                $dataPS->kdprofile = (int)$kdProfile; //12;
                $dataPS->statusenabled = true;
                $dataPS->kodeexternal = $newId;
                $dataPS->norec =  $dataPS->generateNewId();
            } else {
                $dataPS = Pasien::where('id', $request['idpasien'])->first();
                AlamatD::where('nocmfk', $dataPS->id)->delete();
                $noCm = $dataPS->nocm;
                if ($noCm == null) {
                    if (isset($request['isPenunjang'])  &&  $request['isPenunjang'] == true) {
                        $noCm = $this->generateCodeBySeqTable(new Pasien, 'nocm_penunjang', 9, 'P', $idProfile);
                    } else if (isset($request['isTelemedicine'])  &&  $request['isTelemedicine'] == true) {
                        $noCm = $this->generateCodeBySeqTable(new Pasien, 'nocm_telemedicine', 9, 'T', $idProfile);
                    }
                    //endregion
                    else {
                        //region SaveRunningNumber
                        $idRunningNumber = 1745;
                        // if ($request['isbayi'] == true) {
                        //     $idRunningNumber = 13535;
                        // }
                        $runningNumber = RunningNumber::where('id', $idRunningNumber)->first();
                        $extension = $runningNumber->extention;
                        // if ($request['isbayi'] == true) {
                        //     $extension = $runningNumber->reset . $runningNumber->extention;
                        // }
                        $noCmTerakhir = $runningNumber->nomer_terbaru + 1;
                        $noCm = $extension . $noCmTerakhir;

                        RunningNumber::where('id', $idRunningNumber)
                            ->update(
                                [
                                    'nomer_terbaru' => $noCmTerakhir
                                ]
                            );

                        //endregion

                    }
                }
                $newId = $dataPS->id;
            }
            $dataPS->statusenabled = true;
            $dataPS->namaexternal =  $request['pasien']['namaPasien'];
            $dataPS->reportdisplay =  $request['pasien']['namaPasien'];
            $dataPS->objectagamafk = $request['agama']?$request['agama']['id']:null;
            $dataPS->agamalain = $request['agamaLain']?$request['agamaLain']:null;
            if (isset($request['jenisKelamin']['id'])){
                $dataPS->objectjeniskelaminfk = $request['jenisKelamin']['id'];
            } else {
                $dataPS->objectjeniskelaminfk = $request['jenisKelamin'];
            }
            $dataPS->namapasien = $request['pasien']['namaPasien'];
            $dataPS->objectpekerjaanfk = $request['pekerjaan']?$request['pekerjaan']['id']:null;
            $dataPS->pekerjaanlain = $request['pekerjaanLain']?$request['pekerjaanLain']:null;
            $dataPS->objectpendidikanfk = $request['pendidikan']?$request['pendidikan']['id']:null;
            $dataPS->qpasien = 1;
            $dataPS->objectstatusperkawinanfk = $request['statusPerkawinan'] ? $request['statusPerkawinan']['id'] : null;
            $dataPS->tgldaftar = date('Y-m-d H:i:s');
            $dataPS->tgllahir = $request['pasien']['tglLahir'];
            $dataPS->namaibu = $request['namaIbu'];
            $dataPS->notelepon = $request['noTelepon'];
            $dataPS->noidentitas = $request['pasien']['noIdentitas'];
            $dataPS->noaditional = $request['noAditional'];
            $dataPS->objectkebangsaanfk = $request['kebangsaan'] ? $request['kebangsaan']['id'] : 1;
            $dataPS->objectnegarafk = $request['negara'] ? $request['negara']['id'] : 0;
            $dataPS->namaayah = $request['namaAyah'];
            $dataPS->alergi = $request['alergi'] ? $request['alergi'] : null;
            $dataPS->sidik_jari = $request['sidik_jari'] ? $request['sidik_jari'] : null;
            if (isset($request['pasien']['namaSuamiIstri'])) {
                $dataPS->namasuamiistri = $request['pasien']['namaSuamiIstri'];
            }
            if (isset($request['pasien']['noAsuransiLain'])) {
                $dataPS->noasuransilain = $request['pasien']['noAsuransiLain'];
            }
            $dataPS->nobpjs = $request['pasien']['noBpjs'];
            $dataPS->nohp = $request['pasien']['noHp'];
            if (isset($request['pasien']['tempatLahir']) &&  $request['pasien']['tempatLahir'] != null && $request['pasien']['tempatLahir'] != '') {
                $dataPS->tempatlahir = $request['pasien']['tempatLahir'];
            }
            if (isset($request['pasien']['namaKeluarga'])) {
                $dataPS->namakeluarga = $request['pasien']['namaKeluarga'];
            }
            $timeLahir = date('H:i:s', strtotime($request['pasien']['tglLahir']));
            $dataPS->jamlahir = $request['pasien']['tglLahir'];
            if (isset($request['golonganDarah'])) {
                $dataPS->objectgolongandarahfk = $request['golonganDarah']['id'];
            }
            if (isset($request['suku'])) {
                $dataPS->objectsukufk = $request['suku']['id'];
            }



            //region NonAktif
            //$dateLahir = date('Y-m-d',strtotime($request['pasien']['tglLahir']));
            //$dataPS->namadepan = $request['xxxx']['xxxxx'];
            //$dataPS->namabelakang = $request['xxxx']['xxxxx'];
            //$dataPS->dokumenrekammedis = $request['xxxx']['xxxxx'];
            //$dataPS->objectgolongandarahfk = $request['xxxx']['xxxxx'];
            //$dataPS->objecttitlefk = $request['xxxx']['xxxxx'];
            //$dataPS->tglmeninggal = $request['xxxx']['xxxxx'];
            //$dataPS->paspor = $request['xxxx']['xxxxx'];
            //endregion

            $dataPS->nocm = $noCm;
            if (isset($request['penanggungjawab'])) {
                $dataPS->penanggungjawab = $request['penanggungjawab'];
            }
            if (isset($request['nik1'])) {
                $dataPS->nik1 = $request['nik1'];
            }
            if (isset($request['hubungankeluargapj'])) {
                $dataPS->hubungankeluargapj = $request['hubungankeluargapj'];
            }
            if (isset($request['pekerjaanpenangggungjawab'])) {
                $dataPS->pekerjaanpenangggungjawab = $request['pekerjaanpenangggungjawab'];
            }
            if (isset($request['ktppenanggungjawab'])) {
                $dataPS->ktppenanggungjawab = $request['ktppenanggungjawab'];
            }
            if (isset($request['alamatrmh'])) {
                $dataPS->alamatrmh = $request['alamatrmh'];
            }
            if (isset($request['alamatktr'])) {
                $dataPS->alamatktr = $request['alamatktr'];
            }
            if (isset($request['bahasa'])) {
                $dataPS->bahasa = $request['bahasa'];
            }
            if (isset($request['teleponpenanggungjawab'])) {
                $dataPS->teleponpenanggungjawab = $request['teleponpenanggungjawab'];
            }
            if (isset($request['dokterpengirim'])) {
                $dataPS->dokterpengirim = $request['dokterpengirim'];
            }
            if (isset($request['alamatdokter'])) {
                $dataPS->alamatdokterpengirim = $request['alamatdokter'];
            }
            if (isset($request['jeniskelaminpenanggungjawab'])) {
                $dataPS->jeniskelaminpenanggungjawab = $request['jeniskelaminpenanggungjawab'];
            }
            if (isset($request['umurpenanggungjawab'])) {
                $dataPS->umurpenanggungjawab = $request['umurpenanggungjawab'];
            }
            if (isset($request['isjkn'])) {
                $dataPS->isjkn = $request['isjkn'];
            }
            if (isset($request['pasien']['nomorkk'])) {
                $dataPS->nomorkk = $request['pasien']['nomorkk'];
            }
            if (isset($request['isjkn']) && $request['isjkn'] == true || $request['isjkn'] == "1") {
                $dataPS->foto = $request['pasien'] ? $request['pasien']['image'] : null;
            }
            if (isset($request['hambatan'])) {
                $dataPS->hambatankomunikasifk = $request['hambatan'];
            }
            if (isset($request['bahasaP'])) {
                $dataPS->bahasafk = $request['bahasaP'];
            }

            if (isset($request['penanggungjawab2'])) {
                $dataPS->penanggungjawab2 = $request['penanggungjawab2'];
            }
            if (isset($request['nik2'])) {
                $dataPS->nik2 = $request['nik2'];
            }
            if (isset($request['hubungankeluargapj2'])) {
                $dataPS->hubungankeluargapj2 = $request['hubungankeluargapj2'];
            }
            if (isset($request['pekerjaanpenangggungjawab2'])) {
                $dataPS->pekerjaanpenangggungjawab2 = $request['pekerjaanpenangggungjawab2'];
            }
            if (isset($request['alamatrmh2'])) {
                $dataPS->alamatrmh2 = $request['alamatrmh2'];
            }
            if (isset($request['bahasa2'])) {
                $dataPS->bahasa2 = $request['bahasa2'];
            }
            if (isset($request['teleponpenanggungjawab2'])) {
                $dataPS->teleponpenanggungjawab2 = $request['teleponpenanggungjawab2'];
            }

            if (isset($request['jeniskelaminpenanggungjawab2'])) {
                $dataPS->jeniskelaminpenanggungjawab2 = $request['jeniskelaminpenanggungjawab2'];
            }
            if (isset($request['umurpenanggungjawab2'])) {
                $dataPS->umurpenanggungjawab2 = $request['umurpenanggungjawab2'];
            }
            if (isset($request['noIdentitasLain'])){
                $dataPS->noidentitaslain = $request['noIdentitasLain'];
            }
            $dataPS->save();
            $dataNoCMFk = $newId;
            $nocmfk = $dataPS->id;
            $nocmss = $dataPS->nocm;
            //poto pasien
            if (!empty($request['pasien']['image'])) {
                $dataUrl = $request['pasien']['image']; 
                Pasien::where('id', $nocmfk)->update([
                    'foto' => $dataUrl, 
                ]);
            
            // if (isset($request['pasien']['image'])) {
                //agus
                //                $img =  str_replace('data:image/jpeg;base64,', '', $request['pasien']['image']);
                //                $img = str_replace(' ', '+', $img);
                ////                $string = pack('H*', $img);
                //                $dt = base64_decode($img);
                //                $daritadi = Pasien::where('id',$nocmfk)->first();
                //                $daritadi->foto = $dt;
                //                $daritadi->save();
                //                $img =  $request['pasien']['image'];
                //                $data = unpack("H*hex", $img);
                //                $data = '0x'.$data['hex'];
                //                Pasien::where('id',$nocmfk)->update(
                //                    ['photo' =>  \DB::raw("CONVERT(VARBINARY(MAX), $data) ") ]
                //                );

                /*
                 * simpan ke Storage folder
                 */
                //                $this->storeImageToFolder($nocmss);
                //                $dataPS->photo =$img;

                //#agus

                //egi
                //                $img = $request['pasien']['image'];
                //                $data = unpack("H*hex", $img);
                //                $data = '0x'.$data['hex'];
                //                Pasien::where('id',$nocmfk)->update(
                //                    ['photo' =>  \DB::raw("CONVERT(VARBINARY(MAX), $data) ") ]
                //                );
                //#egi

            }
            //endregion



            //region SaveAlamat
            if ($request['idpasien'] == '') {

                //				$newId3 = 984000;
                //				$newIdAl = Alamat::where('id','>',(float)984000-1)
                //					->where('id','<',(float)7300000)
                //					->count('id');
                //				$newIdAl = (float)$newId3 + (float)$newIdAl + 4;
                //				$idAlamat = $newIdAl; // Alamat::max('id') + 1;
                $idAlamat = Alamat::max('id') + 1;
                $dataAL = new Alamat();
                $dataAL->id = $idAlamat;
                $dataAL->kdprofile = (int)$kdProfile;; //12;
                $dataAL->statusenabled = true;
                $dataAL->kodeexternal = $idAlamat;
                $dataAL->norec = $dataAL->generateNewId();
            } else {
                $dataAL = Alamat::where('nocmfk', $dataNoCMFk)->where('objectjenisalamatfk', 1)->first();
                if (empty($dataAL)) {
                    $idAlamat = Alamat::max('id') + 1;
                    $dataAL = new Alamat();
                    $dataAL->id = $idAlamat;
                    $dataAL->kdprofile = (int)$kdProfile;
                    $dataAL->statusenabled = true;
                    $dataAL->kodeexternal = $idAlamat;
                    $dataAL->norec = $dataAL->generateNewId();
                    $idAlamat = $dataAL->id;
                } else {
                    $idAlamat = $dataAL->id;
                }
            }
            $dataAL->statusenabled = true;
            $dataAL->alamatlengkap = $request['alamatLengkap'];
            $dataAL->objecthubungankeluargafk = 7; //dirisendiri
            if (isset($request['desaKelurahan']['id']) && $request['desaKelurahan']['id'] != null) {
                $dataAL->objectdesakelurahanfk = $request['desaKelurahan']['id'];
            }

            $dataAL->objectjenisalamatfk = 1;
            $dataAL->kdalamat = $idAlamat;
            if (isset($request['kecamatan']['id']) && $request['kecamatan']['id'] != null) {
                $dataAL->objectkecamatanfk = $request['kecamatan']['id'];
            }
            $dataAL->kodepos = $request['kodePos'];
            $dataAL->rtrw = $request['rtRw'];
            if (isset($request['kotaKabupaten']['id']) && $request['kotaKabupaten']['id']!=null){
                $dataAL->objectkotakabupatenfk = $request['kotaKabupaten']['id'];
            }


            if (isset($request['desaKelurahan']['namaDesaKelurahan']) && $request['desaKelurahan']['namaDesaKelurahan'] != null) {
                $dataAL->namadesakelurahan = $request['desaKelurahan']['namaDesaKelurahan'];
            }
            if (isset($request['kecamatan']['namaKecamatan']) && $request['kecamatan']['namaKecamatan'] != null) {
                $dataAL->namakecamatan = $request['kecamatan']['namaKecamatan'];
            }
            if (isset($request['kotaKabupaten']['namaKotaKabupaten']) && $request['kotaKabupaten']['namaKotaKabupaten'] != null) {
                $dataAL->namakotakabupaten = $request['kotaKabupaten']['namaKotaKabupaten'];
            }
            if (isset($request['namapropinsi'])) {
                $dataAL->propinsi = $request['namapropinsi'];
            }
            $dataAL->objectnegarafk = $request['negara']['id'];
            $dataAL->nocmfk = $dataNoCMFk;
            if (isset($detLogin['userData']['id'])) {
                $dataAL->objectpegawaifk = $detLogin['userData']['id'];
            }
            if (isset($request['propinsi']['id']) && $request['propinsi']['id'] != null) {
                $dataAL->objectpropinsifk = $request['propinsi']['id'];
            } else {
                $dataAL->objectpropinsifk = null;
            }
            if (isset($request['kecamatan']['namaKecamatan'])) {
                $dataAL->kecamatan = $request['kecamatan']['namaKecamatan'];
            }
            if (isset($request['kotaKabupaten']['namaKotaKabupaten'])) {
                $dataAL->kotakabupaten = $request['kotaKabupaten']['namaKotaKabupaten'];
            }
            if (isset($request['isjkn'])) {
                $dataAL->isjkn = $request['isjkn'];
            }
            //region nonAktifAlamat
            // $dataAL->namatempatgedung = $request['xxxx']['xxxxx'];
            // $dataAL->facebook = $request['xxxx']['xxxxx'];
            // $dataAL->faksimile1 = $request['xxxx']['xxxxx'];
            // $dataAL->faksimile2 =$request['xxxx']['xxxxx'];
            // $dataAL->fixedphone1 =$request['xxxx']['xxxxx'];
            // $dataAL->fixedphone2 =$request['xxxx']['xxxxx'];
            // $dataAL->namaexternal = $request['alamatLengkap'];
            // $dataAL->reportdisplay = $request['alamatLengkap'];
            // $dataAL->alamatemail = $request['xxxx']['xxxxx'];
            // $dataAL->blackberry = $request['xxxx']['xxxxx'];
            // $dataAL->isbillingaddress = $request['xxxx']['xxxxx'];
            // $dataAL->isprimaryaddress = $request['xxxx']['xxxxx'];
            // $dataAL->isshippingaddress = $request['xxxx']['xxxxx'];
            // $dataAL->keteranganlainnya = $request['alamatLengkap'];
            // $dataAL->line =$request['xxxx']['xxxxx'];
            // $dataAL->mobilephone1 = $request['xxxx']['xxxxx'];
            // $dataAL->mobilephone2 = $request['xxxx']['xxxxx'];
            // $dataAL->objectrekananfk = $request['xxxx']['xxxxx'];
            // $dataAL->rtrw = $request['xxxx']['xxxxx'];
            // $dataAL->twitter = $request['xxxx']['xxxxx'];
            // $dataAL->website = $request['xxxx']['xxxxx'];
            // $dataAL->whatsapp = $request['xxxx']['xxxxx'];
            // $dataAL->yahoomessenger = $request['xxxx']['xxxxx'];
            // $dataAL->penanggungjawab_norec = $request['xxxx']['xxxxx'];
            //endregion
            $dataAL->save();

            // Save Alamat Domisili;
            // if($request['idpasien'] == '') {
            //     $idAlamatD = Alamat::max('id') + 1;
            //     $dataALD = new Alamat();
            //     $dataALD->id = $idAlamatD;
            //     $dataALD->kdprofile = (int)$kdProfile;;//12;
            //     $dataALD->statusenabled = true;
            //     $dataALD->kodeexternal = $idAlamatD;
            //     $dataALD->norec = $dataALD->generateNewId();
            // }else{
            //     $dataALD = Alamat::where('nocmfk', $dataNoCMFk)->where('objectjenisalamatfk', 3)->first();
            //     if(empty($dataALD)){
            //         $idAlamatD = Alamat::max('id') + 1;
            //         $dataALD = new Alamat();
            //         $dataALD->id = $idAlamatD;
            //         $dataALD->kdprofile = (int)$kdProfile;
            //         $dataALD->statusenabled = true;
            //         $dataALD->kodeexternal = $idAlamatD;
            //         $dataALD->norec = $dataALD->generateNewId();
            //         $idAlamatD = $dataALD->id;
            //     }else{
            //         $idAlamatD = $dataALD->id;
            //     }
            // }
            // $dataALD->statusenabled = true;
            // $dataALD->alamatlengkap = $request['alamatDomisili'];
            // $dataALD->objecthubungankeluargafk = 7;//dirisendiri
            // if (isset($request['desaKelurahanDomisili']['id']) && $request['desaKelurahanDomisili']['id']!=null){
            //     $dataALD->objectdesakelurahanfk = $request['desaKelurahanDomisili']['id'];
            // }
            // $dataALD->objectjenisalamatfk = 3; // Domisili
            // $dataALD->kdalamat = $idAlamatD;
            // if (isset($request['kecamatanDomisili']['id']) && $request['kecamatanDomisili']['id']!=null){
            //     $dataALD->objectkecamatanfk = $request['kecamatanDomisili']['id'];
            // }
            // $dataALD->kodepos = $request['kodePosDomisili'];
            // $dataALD->rtrw = $request['rtrwDomisili'];
            // if (isset($request['kotaKabupatenDomisili']['id']) && $request['kotaKabupatenDomisili']['id']!=null){
            //     $dataALD->objectkotakabupatenfk = $request['kotaKabupatenDomisili']['id'];
            // }
            // if (isset($request['desaKelurahanDomisili']['namaDesaKelurahan']) && $request['desaKelurahanDomisili']['namaDesaKelurahan']!=null){
            //     $dataALD->namadesakelurahan = $request['desaKelurahanDomisili']['namaDesaKelurahan'];
            // }
            // if (isset($request['kecamatanDomisili']['namaKecamatan']) && $request['kecamatanDomisili']['namaKecamatan']!=null){
            //     $dataALD->namakecamatan = $request['kecamatanDomisili']['namaKecamatan'];
            // }
            // if (isset($request['kotaKabupatenDomisili']['namaKotaKabupaten']) && $request['kotaKabupatenDomisili']['namaKotaKabupaten']!=null){
            //     $dataALD->namakotakabupaten = $request['kotaKabupatenDomisili']['namaKotaKabupaten'];
            // }
            // // if (isset($request['propinsiDomisili'])){
            // //     $dataALD->propinsi = $request['propinsiDomisili'];
            // // }
            // $dataALD->objectnegarafk = $request['negaraDomisili']['id'];
            // $dataALD->nocmfk = $dataNoCMFk;
            // if (isset($detLogin['userData']['id'])){
            //     $dataALD->objectpegawaifk = $detLogin['userData']['id'];
            // }
            // if (isset($request['propinsi']['id']) &&$request['propinsi']['id']!=null ){
            //     $dataALD->objectpropinsifk = $request['propinsi']['id'];
            // }else{
            //     $dataALD->objectpropinsifk = null;
            // }
            // if (isset($request['kecamatanDomisili']['namaKecamatan'])){
            //     $dataALD->kecamatan = $request['kecamatanDomisili']['namaKecamatan'];
            // }
            // if (isset($request['kotaKabupatenDomisili']['namaKotaKabupaten'])){
            //     $dataALD->kotakabupaten = $request['kotaKabupatenDomisili']['namaKotaKabupaten'];
            // }
            // if (isset($request['isjkn'])){
            //     $dataALD->isjkn = $request['isjkn'];
            // }
            // $dataALD->save();

            //endregion
            if (isset($request['detailalamat'])) {
                foreach ($request['detailalamat'] as $item) {
                    $idAlamat2 = AlamatD::max('id') + 1;
                    $dataAL2 = new AlamatD();
                    $dataAL2->id = $idAlamat2;
                    $dataAL2->kdprofile = (int)$kdProfile;
                    $dataAL2->statusenabled = true;
                    $dataAL2->norec = $dataAL2->generateNewId();
                    $dataAL2->alamatlengkap = $item['alamatlengkap'];
                    $dataAL2->objecthubungankeluargafk = 7;
                    $dataAL2->objectdesakelurahanfk = $item['objectdesakelurahanfk'];
                    $dataAL2->objectjenisalamatfk = $item['objectjenisalamatfk'];
                    $dataAL2->jenisalamat = $item['jenisalamat'];
                    $dataAL2->objectkecamatanfk = $item['objectkecamatanfk'];
                    $dataAL2->kodepos = null;
                    $dataAL2->objectkotakabupatenfk = $item['objectkotakabupatenfk'];
                    $dataAL2->namadesakelurahan = $item['namadesakelurahan'];
                    $dataAL2->namakecamatan = $item['namakecamatan'];
                    $dataAL2->namakotakabupaten = $item['namakotakabupaten'];
                    $dataAL2->propinsi = $item['propinsi'];
                    $dataAL2->nocmfk = $dataNoCMFk;
                    $dataAL2->objectpropinsifk = $item['objectpropinsifk'];
                    $dataAL2->save();
                }
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $dataPS->foto = $dataPS->foto != null ? "data:image/jpeg;base64," . base64_encode($dataPS->foto) : null;
            if (isset($request['isjkn']) && $request['isjkn'] == true || $request['isjkn'] == "1") {
                $result = array(
                    "response" => array(
                        "norm" => $dataPS->nocm
                    ),
                    "metadata" =>
                    array(
                        'message' => "Harap datang ke admisi untuk melengkapi data rekam medis",
                        'code' => '200',
                    )
                );
                return $this->setStatusCode(200)->respond($result, "OK");
            } else {
                $result = array(
                    'status' => 201,
                    'data' => $dataPS,
                    'as' => 'ramdanegie',
                );
            }
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $dataPS->foto = $dataPS->foto != null ? "data:image/jpeg;base64," . base64_encode($dataPS->foto) : null;
            if (isset($request['isjkn']) && $request['isjkn'] == true || $request['isjkn'] == "1") {
                $result = array(
                    "response" => null,
                    "metadata" => array(
                        "code" => 201,
                        "e" => $e->getMessage() . ' ' . $e->getLine(),
                        "message" => "Terjadi Kesalahan"
                    )
                );
                return $this->setStatusCode(201)->respond($result);
            } else {
                $result = array(
                    'status' => 400,
                    'e' => $e->getMessage() . ' ' . $e->getLine(),
                    'as' => 'ramdanegie',
                );
            }
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveIdPasienDoang(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $detLogin = $request->all();
        DB::beginTransaction();
        try {
            //region Save Pasien


            $newId = Pasien::max('id') + 1;
            $dataPS = new Pasien();
            $dataPS->id = $newId;
            $dataPS->kdprofile = (int)$kdProfile;;
            $dataPS->statusenabled = false;
            $dataPS->kodeexternal = $newId;
            $dataPS->norec =  $dataPS->generateNewId();

            $dataPS->save();
            $dataNoCMFk = $newId;


            $idAlamat = Alamat::max('id') + 1;
            $dataAL = new Alamat();
            $dataAL->id = $idAlamat;
            $dataAL->kdprofile = (int)$kdProfile; //12;
            $dataAL->statusenabled = false;
            $dataAL->kodeexternal = $idAlamat;
            $dataAL->norec = $dataAL->generateNewId();
            $dataAL->nocmfk = $dataNoCMFk;
            $dataAL->alamatlengkap = '';
            $dataAL->save();
            //endregion
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            //            $dataPS->foto = "data:image/jpeg;base64," . base64_encode($dataPS->foto);
            $result = array(
                'status' => 201,
                'data' => $newId,
                'as' => 'er@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'as' => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function storeImageToFolder($nocm)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $pasien = Pasien::where('nocm', $nocm)
            ->where('statusenabled', true)->first();
        if (!empty($pasien)) {
            $result = array(
                'status' => 'Sukses menyimpan foto ke Directory ' . '../storage/app/photo/' . $nocm . '.jpg',
                'as' => 'er@epic',
            );
            if ($pasien->photo == null) {
                $settingDataFix = SettingDataFixed::where('namafield', 'photoDefault')->first();
                $pasien->photo = $settingDataFix->gambar;
                $result = array(
                    'status' => 'Photo belum di upload',
                    'as' => 'er@epic',
                );
            }
            $data =  $pasien->photo;

            list($type, $data) = explode(';', $data);
            list(, $data)      = explode(',', $data);
            $data = base64_decode($data);
            $tujuan_upload = 'data_file';
            \Storage::disk('local')->put('photo/' . $nocm . '.jpg', $data);
            //            $data->move($tujuan_upload,$file->getClientOriginalName());
            //            file_put_contents('D:/'.$nocm.'.jpg', $data);
            return $this->respond($result);
        }
    }
    public function getDaftarAntrianPasienDiperiksa(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $filter = $request->all();
        $data = \DB::table('antrianpasiendiperiksa_t as apd')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            //            ->leftjoin('batalregistrasi_t as br','br.pasiendaftarfk','=','pd.norec')
            //            ->leftjoin('strukpelayanan_t as sp','sp.norec','=','pd.nostruklastfk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftjoin('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->leftjoin('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftJoin('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
            ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            //            ->leftjoin('rekanan_m as rek','rek.id','=','pd.objectrekananfk')
            ->select(
                'pd.tglregistrasi',
                'ps.nocm',
                'pd.noregistrasi',
                'ps.namapasien',
                'ps.tgllahir',
                'jk.jeniskelamin',
                'apd.objectruanganfk',
                'ru.namaruangan',
                'kls.id as idkelas',
                'kls.namakelas',
                'kp.kelompokpasien',
                //                'rek.namarekanan',
                'apd.objectpegawaifk',
                'pg.namalengkap as dokter',
                'pg.id as pgid',
                //                'br.norec',
                'pd.norec as norec_pd',
                'apd.norec as norec_apd',
                'apd.objectasalrujukanfk',
                'apd.tgldipanggildokter',
                'apd.noantrian',
                'apd.tglmasuk',
                'ps.id as nocmfk',
                DB::raw("case when apd.statusantrian = '0' then 'MENUNGGU'
					 when apd.statusantrian = '1' then 'DIPANGGIL_SUSTER'
					 when apd.statusantrian = '2' then 'DIPANGGIL_DOKTER'
					 when apd.statusantrian = '3' then 'SELESAI_DIPERIKSA'
					 else 'MENUNGGU' end as statusantrian")
            )
            //            ->whereNull('br.norec')
            ->where('pd.statusenabled', true)
            ->where('apd.kdprofile', (int)$kdProfile);

        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('apd.tglmasuk', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $data = $data->where('apd.tglmasuk', '<=', $filter['tglAkhir']);
        }
        if (isset($filter['ruanganId']) && $filter['ruanganId'] != "" && $filter['ruanganId'] != "undefined") {
            $data = $data->where('ru.id', '=', $filter['ruanganId']);
        }
        if (isset($filter['nocm']) && $filter['nocm'] != "" && $filter['nocm'] != "undefined") {
            $data = $data->where('ps.nocm', 'ilike', '%' . $filter['nocm'] . '%');
            //				->orWhere('ps.namapasien', 'ilike', '%'.$filter['noRmNama'].'%')	;
        }
        if (isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $data = $data->Where('ps.namapasien', 'ilike', '%' . $filter['nama'] . '%');
        }
        //		$data = $data->whereIn('dept.id',[18,24,28,27,3]);
        $data = $data->limit($request['jmlrows']);

        $data = $data->orderBy('apd.tglmasuk', 'desc');

        $data = $data->get();
        $result = array(
            'listData' => $data,
            'as' => 'Inhuman'
        );
        return $this->respond($result);
    }
    public function getComboAntrianPasienOperator(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $dataLogin = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->join('pegawai_m as pg', 'pg.id', '=', 'lu.objectpegawaifk')
            ->select('lu.objectpegawaifk', 'pg.namalengkap')
            ->where('lu.id', $dataLogin['userData']['id'])
            ->where('lu.kdprofile', (int)$kdProfile)
            ->first();
        $ruangan = Ruangan::where('statusenabled', true)
            ->select('id', 'namaruangan', 'objectdepartemenfk')
            ->whereIn('objectdepartemenfk', [3, 18, 16, 24, 28, 27])
            ->where('kdprofile', (int)$kdProfile)
            ->orderBy('namaruangan')
            ->get();
        $jenisDiagnosa = JenisDiagnosa::where('statusenabled', true)
            ->select('id', 'jenisdiagnosa')
            ->orderBy('jenisdiagnosa')
            ->get();
        $kelas = Kelas::where('statusenabled', true)
            ->select('id', 'namakelas')
            ->orderBy('namakelas')
            ->get();
        $idProfile = (int)$kdProfile;
        $pembatalan = DB::select(DB::raw("select id,name from pembatal_m where statusenabled='true' and kdprofile = $idProfile"));

        $result = array(
            'data' => $ruangan,
            'pembatalan' => $pembatalan,
            'jenisdiagnosa' => $jenisDiagnosa,
            'kelas' => $kelas,
            'pegawaiLogin' => $dataPegawai->namalengkap,
            'message' => 'inhuman',
        );

        return $this->respond($result);
    }
    public function getDiagnosaPasienByNorecAPD(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $data = \DB::table('pasiendaftar_t as pd')
            ->select(
                'dg.id',
                'pd.noregistrasi',
                'pd.tglregistrasi',
                'apd.objectruanganfk',
                'ru.namaruangan',
                'apd.norec as norec_apd',
                'ddp.objectdiagnosafk',
                'dg.kddiagnosa',
                'dg.namadiagnosa',
                'ddp.objectjenisdiagnosafk',
                'jd.jenisdiagnosa',
                'dp.norec as norec_diagnosapasien',
                'ddp.norec as norec_detaildpasien',
                'dp.ketdiagnosis',
                'ddp.keterangan'
            )
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->Join('diagnosapasien_t as dp', 'dp.noregistrasifk', '=', 'apd.norec')
            ->leftJoin('detaildiagnosapasien_t as ddp', 'ddp.objectdiagnosapasienfk', '=', 'dp.norec')
            ->leftJoin('diagnosa_m as dg', 'dg.id', '=', 'ddp.objectdiagnosafk')
            ->leftJoin('jenisdiagnosa_m as jd', 'jd.id', '=', 'ddp.objectjenisdiagnosafk')
            ->where('pd.kdprofile', (int)$kdProfile)
            ->where('dp.statusenabled', true);

        if (isset($request['noRec']) && $request['noRec'] != "" && $request['noRec'] != "undefined") {
            $data = $data->where('apd.norec', '=', $request['noRec']);
        };

        $data = $data->get();

        $result = array(
            'data' => $data,
            'message' => 'Inhuman',
        );
        return $this->respond($result);
    }
    public function saveArrDiagnosaPasien(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $dataLogin = $request->all();
        DB::beginTransaction();
        try {
            $pasienDaftar = PasienDaftar::where('norec', $request['norec_pd'])->first();
            foreach ($request['diagnosis'] as $item) {

                $dataDiagnosa = new DiagnosaPasien();
                $dataDiagnosa->norec = $dataDiagnosa->generateNewId();
                $dataDiagnosa->kdprofile = (int)$kdProfile;
                $dataDiagnosa->statusenabled = true;
                $dataDiagnosa->noregistrasifk = $request['norec_apd'];
                if (isset($item['keterangan'])) {
                    $dataDiagnosa->ketdiagnosis = $item['keterangan'];
                }
                $dataDiagnosa->tglregistrasi = $pasienDaftar->tglregistrasi;
                $dataDiagnosa->tglpendaftaran = $pasienDaftar->tglregistrasi;
                $dataDiagnosa->save();
                $norec = $dataDiagnosa->norec;

                $dataDetailDiagnosa = new DetailDiagnosaPasien();
                $dataDetailDiagnosa->norec = $dataDetailDiagnosa->generateNewId();
                $dataDetailDiagnosa->kdprofile = (int)$kdProfile;
                $dataDetailDiagnosa->statusenabled = true;
                $dataDetailDiagnosa->objectpegawaifk = $request['pegawaifk'];
                $dataDetailDiagnosa->noregistrasifk = $request['norec_apd'];
                $dataDetailDiagnosa->tglregistrasi = $pasienDaftar->tglregistrasi;
                $dataDetailDiagnosa->norec = $dataDetailDiagnosa->generateNewId();
                $dataDetailDiagnosa->objectdiagnosafk = $item['iddiagnosa'];
                $dataDetailDiagnosa->objectdiagnosapasienfk = $norec;
                $dataDetailDiagnosa->objectjenisdiagnosafk = $item['jenisdiagnosisid'];
                $dataDetailDiagnosa->tglinputdiagnosa = date('Y-m-d H:i:s');
                if (isset($item['keterangan'])) {
                    $dataDetailDiagnosa->keterangan = $item['keterangan'];
                }
                $dataDetailDiagnosa->save();
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Data Tersimpan";
            DB::commit();
            $result = array(
                'status' => 201,
                'as' => 'inhuman',
            );
        } else {
            $transMessage = "Data Gagal Disimpan";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'as' => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveUpdateKelasAPD(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        DB::beginTransaction();
        try {
            $Rpp = RegistrasiPelayananPasien::where('noregistrasifk', $request['norec_pd'])->get();
            if (count($Rpp) > 0) {
                RegistrasiPelayananPasien::where('tglmasuk', $request['tglmasuk'])
                    ->where('objectruanganfk', $request['objectruanganfk'])
                    ->where('noregistrasifk', $request['norec_pd'])
                    ->where('kdprofile', (int)$kdProfile)
                    ->update([
                        'objectkelasfk' => $request['objectkelasfk']
                    ]);
            }
            PasienDaftar::where('norec', $request['norec_pd'])->where('kdprofile', (int)$kdProfile)->update(
                ['objectkelasfk' => $request['objectkelasfk']]
            );
            AntrianPasienDiperiksa::where('norec', $request['norec_apd'])->where('kdprofile', (int)$kdProfile)->update(
                ['objectkelasfk' => $request['objectkelasfk']]
            );

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Update Kelas Berhasil";
            DB::commit();
            $result = array(
                'status' => 201,
                'as' => 'inhuman',
            );
        } else {
            $transMessage = "Update Kelas Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'as' => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }


    public function saveRencanaPindah(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        DB::beginTransaction();
        $dataLogin = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id', $dataLogin['userData']['id'])
            ->first();
        $r_NewPD = $request['pasiendaftar'];
        $r_NewAPD = $request['antrianpasiendiperiksa'];
        try {

            if ($request['strukorder']['norecorder'] == '') {
                $noOrder = $this->generateCode(new StrukOrder, 'noorder', 14, 'RPP-' . $this->getDateTime()->format('ym'));
                $dataSO = new StrukOrder();
                $dataSO->norec = $dataSO->generateNewId();
                $dataSO->kdprofile = (int)$kdProfile;
                $dataSO->statusenabled = true;
                $dataSO->isdelivered = 0;
                $dataSO->noorder = $noOrder;
                $dataSO->objectkelompoktransaksifk = 122;
            } else {
                $dataSO = StrukOrder::where('norec', $request['strukorder']['norecorder'])->first();
                OrderPelayanan::where('noorderfk', $request['strukorder']['norecorder'])->delete();
            }
            $dataSO->noregistrasifk = $r_NewPD['norec_pd'];
            $dataSO->nocmfk = $r_NewPD['nocmfk'];
            $dataSO->keteranganorder =  $r_NewAPD['keteranganpindah'];
            $dataSO->objectpegawaiorderfk = $dataPegawai->objectpegawaifk;
            $dataSO->qtyjenisproduk = 0;
            $dataSO->qtyproduk = 0;
            $dataSO->objectruanganfk = $r_NewPD['objectruanganlastfk'];
            $dataSO->objectruangantujuanfk = $r_NewAPD['objectruanganlastfk'];
            $dataSO->tglorder = $request['strukorder']['tglorder'];
            $dataSO->tglrencana = $r_NewAPD['tglmasuk'];
            //                $dataSO->statusorder = 0; //pengajuan pindah
            $dataSO->statusorder = 1; //langsung pindah
            $dataSO->totalbeamaterai = 0;
            $dataSO->totalbiayakirim = 0;
            $dataSO->totalbiayatambahan = 0;
            $dataSO->totaldiscount = 0;
            $dataSO->totalhargasatuan = 0;
            $dataSO->totalharusdibayar = 0;
            $dataSO->totalpph = 0;
            $dataSO->totalppn = 0;
            $dataSO->save();
            $dataSO = $dataSO->norec;

            $dataOP = new OrderPelayanan();
            $dataOP->norec = $dataOP->generateNewId();
            $dataOP->kdprofile = (int)$kdProfile;
            $dataOP->statusenabled = true;
            $dataOP->iscito = 0;
            $dataOP->israwatgabung = $r_NewAPD['israwatgabung'];
            $dataOP->objectkamarfk = $r_NewAPD['objectkamarfk'];
            $dataOP->objectkelasfk = $r_NewAPD['objectkelasfk'];
            $dataOP->objectkelaskamarfk = $r_NewAPD['objectkelasfk'];
            $dataOP->nobed = $r_NewAPD['nobed'];
            $dataOP->objectruanganfk = $r_NewPD['objectruanganlastfk'];
            $dataOP->objectruangantujuanfk = $r_NewAPD['objectruanganlastfk'];
            $dataOP->tglpelayanan = $request['strukorder']['tglorder'];
            $dataOP->noorderfk = $dataSO;
            $dataOP->qtyproduk = 0;
            $dataOP->qtyprodukretur = 0;
            $dataOP->strukorderfk = $dataSO;
            $dataOP->save();

            //##Save Registrasi Pel Pasien##
            if ($request['strukorder']['norecrpp'] == '') {
                $dataRPP = new RegistrasiPelayananPasien();
                $dataRPP->norec = $dataRPP->generateNewId();;
                $dataRPP->kdprofile = (int)$kdProfile;
                $dataRPP->statusenabled = true;
            } else {
                $dataRPP = RegistrasiPelayananPasien::where('norec', $request['strukorder']['norecrpp'])->first();
            }
            $dataRPP->objectasalrujukanfk = $r_NewAPD['objectasalrujukanfk'];
            $dataRPP->israwatgabung = $r_NewAPD['israwatgabung'];;
            $dataRPP->objectkelaskamarrencanafk = $r_NewAPD['objectkelasfk'];;
            $dataRPP->objectkelasrencanafk =  $r_NewAPD['objectkelasfk'];
            $dataRPP->kdpenjaminpasien = 0;
            $dataRPP->objectkelompokpasienfk = $r_NewPD['objectkelompokpasienlastfk'];
            $dataRPP->keteranganlainnyarencana = $r_NewAPD['keteranganpindah'];
            $dataRPP->noantrianbydokter = 0;
            $dataRPP->nobedrencana =  $r_NewAPD['nobed'];;
            $dataRPP->nocmfk = $r_NewPD['nocmfk'];
            $dataRPP->noregistrasifk = $r_NewPD['norec_pd'];
            $dataRPP->objectruanganasalfk = $r_NewAPD['objectruanganasalfk'];
            $dataRPP->objectruanganrencanafk =  $r_NewAPD['objectruanganlastfk'];
            $dataRPP->objectstatuskeluarrencanafk =  $r_NewPD['objectstatuskeluarfk'];
            $dataRPP->objecttempattidurrencanafk = $r_NewAPD['nobed'];
            $dataRPP->objectkamarrencanafk = $r_NewAPD['objectkamarfk'];
            $dataRPP->tglkeluarrencana = $r_NewAPD['tglmasuk'];
            $dataRPP->strukorderfk = $dataSO;
            $dataRPP->save();
            $dataNorecRPP = $dataRPP->norec;


            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan Order";
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "noorder" => $dataSO,
                "norecrpp" => $dataNorecRPP,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Simpan Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "nokirim" => $dataSO,
                "norecrpp" => $dataNorecRPP,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDaftarRencanaPindahPasien(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $dataLogin = $request->all();
        $dataRuangan = \DB::table('maploginusertoruangan_s as mlu')
            ->JOIN('ruangan_m as ru', 'ru.id', '=', 'mlu.objectruanganfk')
            ->select('ru.id')
            ->where('mlu.objectloginuserfk', $dataLogin['userData']['id'])
            ->where('mlu.kdprofile', (int)$kdProfile)
            ->get();
        $strRuangan = [];
        foreach ($dataRuangan as $epic) {
            $strRuangan[] = $epic->id;
        }

        $data = \DB::table('strukorder_t as so')
            ->JOIN('orderpelayanan_t as op', 'op.noorderfk', '=', 'so.norec')
            ->JOIN('registrasipelayananpasien_t as rpp', 'rpp.strukorderfk', '=', 'so.norec')
            ->JOIN('pasien_m as pas', 'pas.id', '=', 'so.nocmfk')
            ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'so.noregistrasifk')
            ->JOIN('antrianpasiendiperiksa_t as apd', function ($join) {
                $join->on('apd.noregistrasifk', '=', 'pd.norec');
                $join->on('apd.objectruanganfk', '=', 'pd.objectruanganlastfk');
            })
            ->JOIN('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
            ->JOIN('ruangan_m as ru1', 'ru1.id', '=', 'so.objectruangantujuanfk')
            ->JOIN('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->JOIN('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->select(DB::raw("so.norec as norec_so,pas.nocm,pd.noregistrasi,pas.namapasien,kls.namakelas,ru.namaruangan,
                     ru1.namaruangan as ruanganrencana,so.tglrencana,kp.kelompokpasien,
                     so.statusorder,pd.norec as norec_pd,apd.norec as norec_apd"))
            ->where('so.kdprofile', (int)$kdProfile);

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('so.tglrencana', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];
            $data = $data->where('so.tglrencana', '<=', $tgl);
        }
        if (isset($request['noReg']) && $request['noReg'] != "" && $request['noReg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', 'ilike', '%' . $request['noReg']);
        }
        if (isset($request['noCm']) && $request['noCm'] != "" && $request['noCm'] != "undefined") {
            $data = $data->where('pas.nocm', 'ilike', '%' . $request['noCm']);
        }
        $data = $data->where('so.statusenabled', true);
        $data = $data->where('so.objectkelompoktransaksifk', 122);
        $data = $data->orderBy('so.tglrencana');
        $data = $data->get();

        $result = array(
            'daftar' => $data,
            'datalogin' => $dataLogin,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getDataPasienPindah(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin = $request->all();
        $dataRuangan = \DB::table('maploginusertoruangan_s as mlu')
            ->JOIN('ruangan_m as ru', 'ru.id', '=', 'mlu.objectruanganfk')
            ->select('ru.id')
            ->where('mlu.objectloginuserfk', $dataLogin['userData']['id'])
            ->where('mlu.kdprofile', (int)$kdProfile)
            ->get();
        $strRuangan = [];
        foreach ($dataRuangan as $epic) {
            $strRuangan[] = $epic->id;
        }

        $dataAwal = DB::select(
            DB::raw("select pd.objectruanganlastfk,ru.namaruangan,rpp.objectkamarfk,km.namakamar,
		            rpp.objecttempattidurfk,tt.reportdisplay as nomorbed,rpp.objectkelasfk,kls.namakelas
                    from pasiendaftar_t as pd
                    INNER JOIN registrasipelayananpasien_t as rpp on rpp.noregistrasifk = pd.norec and pd.objectruanganlastfk = rpp.objectruanganfk
                    INNER JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
                    INNER JOIN kamar_m as km on km.id = rpp.objectkamarfk
                    INNER JOIN tempattidur_m as tt on tt.id = rpp.objecttempattidurfk
                    INNER JOIN kelas_m as kls on kls.id = rpp.objectkelasfk
                    where pd.norec=:norec and pd.kdprofile = $idProfile"),
            array(
                'norec' => $request['norec_pd'],
            )
        );

        $dataRencana = DB::select(
            DB::raw("select rpp.objectstatuskeluarrencanafk,sk.statuskeluar,op.objectruangantujuanfk,ru.namaruangan,op.israwatgabung,
                                     rpp.objectkelaskamarrencanafk,kls.namakelas,rpp.objectkamarrencanafk,km.namakamar,
                                     tt.id as nobedrencana,tt.reportdisplay as nomorbed,so.keteranganorder,so.tglrencana
                        from strukorder_t as so
                        INNER JOIN orderpelayanan_t as op on op.noorderfk = so.norec
                        INNER JOIN registrasipelayananpasien_t as rpp on rpp.strukorderfk = so.norec
                        INNER JOIN statuskeluar_m as sk on sk.id = rpp.objectstatuskeluarrencanafk
                        INNER JOIN ruangan_m as ru on ru.id = op.objectruangantujuanfk
                        INNER JOIN kelas_m as kls on kls.id = rpp.objectkelaskamarrencanafk
                        INNER JOIN kamar_m as km on km.id = rpp.objectkamarrencanafk
                        INNER JOIN tempattidur_m as tt on tt.id = rpp.nobedrencana
                        where so.norec=:norec and pd.kdprofile = $idProfile"),
            array(
                'norec' => $request['norec_so'],
            )
        );

        $result = array(
            'dataawal' => $dataAwal,
            'datarencana' => $dataRencana,
            'datalogin' => $dataLogin,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function saveRencanaPulang(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        DB::beginTransaction();
        $dataLogin = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id', $dataLogin['userData']['id'])
            ->first();
        $r_NewPD = $request['pasiendaftar'];
        $r_NewAPD = $request['antrianpasiendiperiksa'];
        try {

            if ($request['strukorder']['norecorder'] == '') {
                $noOrder = $this->generateCode(new StrukOrder, 'noorder', 14, 'RPP-' . $this->getDateTime()->format('ym'));
                $dataSO = new StrukOrder();
                $dataSO->norec = $dataSO->generateNewId();
                $dataSO->kdprofile = (int)$kdProfile;
                $dataSO->statusenabled = true;
                $dataSO->isdelivered = 0;
                $dataSO->noorder = $noOrder;
                $dataSO->objectkelompoktransaksifk = 123;
            } else {
                $dataSO = StrukOrder::where('norec', $request['strukorder']['norecorder'])->first();
                OrderPelayanan::where('noorderfk', $request['strukorder']['norecorder'])->delete();
            }
            $dataSO->noregistrasifk = $r_NewPD['norec_pd'];
            $dataSO->nocmfk = $r_NewPD['nocmfk'];
            $dataSO->keteranganorder =  $r_NewPD['keteranganpulang'];
            $dataSO->objectpegawaiorderfk = $dataPegawai->objectpegawaifk;
            $dataSO->qtyjenisproduk = 0;
            $dataSO->qtyproduk = 0;
            $dataSO->objectruanganfk = $r_NewPD['objectruanganlastfk'];
            $dataSO->objectruangantujuanfk = $r_NewAPD['objectruanganlastfk'];
            $dataSO->tglorder = $request['strukorder']['tglorder'];
            $dataSO->tglrencana = $r_NewPD['tglpulang'];
            $dataSO->statusorder = 4; //3; //rencana pulang (4 status sudah d pulangkan)
            $dataSO->totalbeamaterai = 0;
            $dataSO->totalbiayakirim = 0;
            $dataSO->totalbiayatambahan = 0;
            $dataSO->totaldiscount = 0;
            $dataSO->totalhargasatuan = 0;
            $dataSO->totalharusdibayar = 0;
            $dataSO->totalpph = 0;
            $dataSO->totalppn = 0;
            $dataSO->save();


            $dataSO = $dataSO->norec;
            $dataOP = new OrderPelayanan();
            $dataOP->norec = $dataOP->generateNewId();
            $dataOP->kdprofile = (int)$kdProfile;
            $dataOP->statusenabled = true;
            $dataOP->iscito = 0;
            $dataOP->objectruanganfk = $r_NewPD['objectruanganlastfk'];
            $dataOP->tglpelayanan = $request['strukorder']['tglorder'];
            $dataOP->noorderfk = $dataSO;
            $dataOP->qtyproduk = 0;
            $dataOP->qtyprodukretur = 0;
            $dataOP->strukorderfk = $dataSO;
            $dataOP->save();

            //##Save Registrasi Pel Pasien##
            if ($request['strukorder']['norecrpp'] == '') {
                $dataRPP = new RegistrasiPelayananPasien();
                $dataRPP->norec = $dataRPP->generateNewId();;
                $dataRPP->kdprofile = (int)$kdProfile;
                $dataRPP->statusenabled = true;
            } else {
                $dataRPP = RegistrasiPelayananPasien::where('norec', $request['strukorder']['norecrpp'])->first();
            }
            $dataRPP->kdpenjaminpasien = 0;
            $dataRPP->keteranganlainnyarencana = $r_NewPD['keteranganpulang'];
            $dataRPP->noantrianbydokter = 0;
            $dataRPP->nocmfk = $r_NewPD['nocmfk'];
            $dataRPP->noregistrasifk = $r_NewPD['norec_pd'];
            $dataRPP->objectruanganasalfk = $r_NewAPD['objectruanganlastfk'];
            $dataRPP->objectstatuskeluarrencanafk =  $r_NewPD['objectstatuskeluarfk'];
            $dataRPP->objectstatuspulangrencanafk = $r_NewPD['objectstatuspulangfk'];
            $dataRPP->tglkeluarrencana = $r_NewPD['tglpulang'];
            $dataRPP->objecthubungankeluargaambilpasienfk = $r_NewPD['objecthubungankeluargaambilpasienfk'];
            $dataRPP->objectkondisipasienfk = $r_NewPD['objectkondisipasienfk'];
            $dataRPP->namalengkapambilpasien = $r_NewPD['namalengkapambilpasien'];
            $dataRPP->strukorderfk = $dataSO;
            $dataRPP->save();
            $dataNorecRPP = $dataRPP->norec;


            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan Order";
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "noorder" => $dataSO,
                "norecrpp" => $dataNorecRPP,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Simpan Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "nokirim" => $dataSO,
                "norecrpp" => $dataNorecRPP,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDaftarRencanaPulangPasien(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $dataLogin = $request->all();
        $dataRuangan = \DB::table('maploginusertoruangan_s as mlu')
            ->JOIN('ruangan_m as ru', 'ru.id', '=', 'mlu.objectruanganfk')
            ->select('ru.id')
            ->where('mlu.objectloginuserfk', $dataLogin['userData']['id'])
            ->get();
        $strRuangan = [];
        foreach ($dataRuangan as $epic) {
            $strRuangan[] = $epic->id;
        }

        $data = \DB::table('strukorder_t as so')
            ->JOIN('orderpelayanan_t as op', 'op.noorderfk', '=', 'so.norec')
            ->JOIN('registrasipelayananpasien_t as rpp', 'rpp.strukorderfk', '=', 'so.norec')
            ->JOIN('pasien_m as pas', 'pas.id', '=', 'so.nocmfk')
            ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'so.noregistrasifk')
            ->JOIN('antrianpasiendiperiksa_t as apd', function ($join) {
                $join->on('apd.noregistrasifk', '=', 'pd.norec');
                $join->on('apd.objectruanganfk', '=', 'pd.objectruanganlastfk');
            })
            ->JOIN('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
            ->JOIN('ruangan_m as ru1', 'ru1.id', '=', 'so.objectruangantujuanfk')
            ->JOIN('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->JOIN('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->select(DB::raw("so.norec as norec_so,pas.nocm,pd.noregistrasi,pas.namapasien,kls.namakelas,ru.namaruangan,
                     ru1.namaruangan as ruanganrencana,so.tglrencana,kp.kelompokpasien,
                     so.statusorder,pd.norec as norec_pd,apd.norec as norec_apd"))
            ->where('so.kdprofile', (int)$kdProfile);

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('so.tglrencana', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];
            $data = $data->where('so.tglrencana', '<=', $tgl);
        }
        if (isset($request['noReg']) && $request['noReg'] != "" && $request['noReg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', 'ilike', '%' . $request['noReg']);
        }
        if (isset($request['noCm']) && $request['noCm'] != "" && $request['noCm'] != "undefined") {
            $data = $data->where('pas.nocm', 'ilike', '%' . $request['noCm']);
        }
        $data = $data->where('so.statusenabled', true);
        $data = $data->where('so.objectkelompoktransaksifk', 123);
        $data = $data->orderBy('so.tglrencana');
        $data = $data->get();

        $result = array(
            'daftar' => $data,
            'datalogin' => $dataLogin,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getDataPasienPulang(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin = $request->all();
        $dataRuangan = \DB::table('maploginusertoruangan_s as mlu')
            ->JOIN('ruangan_m as ru', 'ru.id', '=', 'mlu.objectruanganfk')
            ->select('ru.id')
            ->where('mlu.objectloginuserfk', $dataLogin['userData']['id'])
            ->where('mlu.kdprofile', (int)$kdProfile)
            ->get();
        $strRuangan = [];
        foreach ($dataRuangan as $epic) {
            $strRuangan[] = $epic->id;
        }

        $dataAwal = DB::select(
            DB::raw("select pd.objectruanganlastfk,ru.namaruangan,rpp.objectkamarfk,km.namakamar,
		            rpp.objecttempattidurfk,tt.reportdisplay as nomorbed,rpp.objectkelasfk,kls.namakelas
                    from pasiendaftar_t as pd
                    INNER JOIN registrasipelayananpasien_t as rpp on rpp.noregistrasifk = pd.norec and pd.objectruanganlastfk = rpp.objectruanganfk
                    INNER JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
                    INNER JOIN kamar_m as km on km.id = rpp.objectkamarfk
                    INNER JOIN tempattidur_m as tt on tt.id = rpp.objecttempattidurfk
                    INNER JOIN kelas_m as kls on kls.id = rpp.objectkelasfk
                    where pd.norec=:norec and pd.kdprofile = $idProfile"),
            array(
                'norec' => $request['norec_pd'],
            )
        );

        $dataRencana = DB::select(
            DB::raw("select rpp.objectstatuskeluarrencanafk,sk.statuskeluar,rpp.objecthubungankeluargaambilpasienfk,hk.hubungankeluarga,
                                  rpp.objectstatuspulangrencanafk,sp.statuspulang,rpp.namalengkapambilpasien,rpp.tglkeluarrencana,rpp.objectkondisipasienfk,
			                      kp.kondisipasien
                        from strukorder_t as so
                        INNER JOIN orderpelayanan_t as op on op.noorderfk = so.norec
                        INNER JOIN registrasipelayananpasien_t as rpp on rpp.strukorderfk = so.norec
                        INNER JOIN statuskeluar_m as sk on sk.id = rpp.objectstatuskeluarrencanafk
                        INNER JOIN kondisipasien_m as kp on kp.id = objectkondisipasienfk
                        INNER JOIN hubungankeluarga_m as hk on hk.id = rpp.objecthubungankeluargaambilpasienfk
                        INNER JOIN statuspulang_m as sp on sp.id = rpp.objectstatuspulangrencanafk
                        where so.norec=:norec and pd.kdprofile = $idProfile"),
            array(
                'norec' => $request['norec_so'],
            )
        );

        $result = array(
            'dataawal' => $dataAwal,
            'datarencana' => $dataRencana,
            'datalogin' => $dataLogin,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }
    public function getDataComboNEW(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $deptRanap = explode(',', $this->settingDataFixed('kdDepartemenRanapFix', $idProfile));
        $kdDepartemenRawatInap = [];
        foreach ($deptRanap as $itemRanap) {
            $kdDepartemenRawatInap[] =  (int)$itemRanap;
        }
        $deptJalan = explode(',', $this->settingDataFixed('kdDepartemenRawatJalanFix', $idProfile));
        $kdDepartemenRawatJalan = [];
        foreach ($deptJalan as $item) {
            $kdDepartemenRawatJalan[] =  (int)$item;
        }

        $dataRuanganInap = \DB::table('ruangan_m as ru')
            ->select('ru.id', 'ru.namaruangan', 'ru.objectdepartemenfk')
            ->where('ru.statusenabled', true)
            ->wherein('ru.objectdepartemenfk', $kdDepartemenRawatInap)
            ->where('ru.kdprofile', (int)$kdProfile)
            ->orderBy('ru.namaruangan')
            ->get();
        $dataRuanganJalan = \DB::table('ruangan_m as ru')
            ->select('ru.id', 'ru.namaruangan', 'ru.objectdepartemenfk', 'ru.kdinternal as kodebpjs')
            ->where('ru.statusenabled', true)
            ->wherein('ru.objectdepartemenfk', $kdDepartemenRawatJalan)
            ->where('ru.kdprofile', (int)$kdProfile)
            ->orderBy('ru.namaruangan')
            ->get();

        $dataAsalRujukan = \DB::table('asalrujukan_m as as')
            ->select('as.id', 'as.asalrujukan')
            ->where('as.statusenabled', true)
            ->orderBy('as.asalrujukan')
            ->get();


        $dataKelompok = \DB::table('kelompokpasien_m as kp')
            ->select('kp.id', 'kp.kelompokpasien')
            ->where('kp.statusenabled', true)
            //            ->where('kp.kdprofile',(int)$kdProfile)
            ->orderBy('kp.kelompokpasien')
            ->get();

        $dataKelas = \DB::table('kelas_m as kl')
            ->select('kl.id', 'kl.namakelas')
            ->where('kl.statusenabled', true)
            ->orderBy('kl.namakelas')
            ->get();

        $dataKamar = \DB::table('kamar_m as kmr')
            ->select('kmr.id', 'kmr.namakamar')
            ->where('kmr.statusenabled', true)
            ->where('kmr.kdprofile', (int)$kdProfile)
            ->orderBy('kmr.namakamar')
            ->get();

        $dataHubunganPeserta = \DB::table('hubunganpesertaasuransi_m as hp')
            ->select('hp.id', 'hp.hubunganpeserta')
            ->where('hp.statusenabled', true)
            ->where('hp.kdprofile', (int)$kdProfile)
            ->orderBy('hp.hubunganpeserta')
            ->get();

        $jenisPelayanan = \DB::table('jenispelayanan_m as jp')
            ->select('jp.kodeinternal as id', 'jp.jenispelayanan')
            ->where('jp.statusenabled', true)
            ->orderBy('jp.jenispelayanan')
            ->get();
        $pekerjaan = DB::table('pekerjaan_m')
            ->select('id', 'pekerjaan')
            ->where('statusenabled', true)
            ->get();
        $jeniskasus = DB::table('jeniskasus_m')
            ->select('id', 'jeniskasus')
            ->where('statusenabled', true)
            ->where('kdprofile', (int)$kdProfile)
            ->get();

        $result = array(
            'ruanganranap' => $dataRuanganInap,
            'ruanganrajal' => $dataRuanganJalan,
            'kelompokpasien' => $dataKelompok,
            'kelas' => $dataKelas,
            'kamar' => $dataKamar,
            'asalrujukan' => $dataAsalRujukan,
            'hubunganpeserta' => $dataHubunganPeserta,
            'jenispelayanan' => $jenisPelayanan,
            'pekerjaan' => $pekerjaan,
            'jeniskasus' => $jeniskasus,
            'message' => 'ramdanegie',
        );

        return $this->respond($result);
    }

    public function getComboDokterPart(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $kdJenisPegawaiDokter = $this->settingDataFixed('kdJenisPegawaiDokter', $kdProfile);
        $req = $request->all();
        $data = \DB::table('pegawai_m')
            ->select('*', 'kddokterbpjs as kodebpjs')
            ->where('statusenabled', true)
            // ->where('objectjenispegawaifk',$kdJenisPegawaiDokter)
            ->where('kdprofile', (int)$kdProfile)
            ->orderBy('namalengkap');

        if (
            isset($req['namalengkap']) &&
            $req['namalengkap'] != "" &&
            $req['namalengkap'] != "undefined"
        ) {
            $data = $data->where('namalengkap', 'ilike', '%' . $req['namalengkap'] . '%');
        };
        if (
            isset($req['idpegawai']) &&
            $req['idpegawai'] != "" &&
            $req['idpegawai'] != "undefined"
        ) {
            $data = $data->where('id', $req['idpegawai']);
        };
        if (
            isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined"
        ) {
            $data = $data
                ->where('namalengkap', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%');
        }

        $data = $data->take(10);
        $data = $data->get();

        return $this->respond($data);
    }



    public function getPasienDetailTea(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $dataLogin = $request->all();
        $data = \DB::table('pasien_m as pm')
            ->leftJoin('statusperkawinan_m as sp', 'sp.id', '=', 'pm.objectstatusperkawinanfk')
            ->leftJoin('agama_m as ag', 'ag.id', '=', 'pm.objectagamafk')
            ->leftJoin('pekerjaan_m as pk', 'pk.id', '=', 'pm.objectpekerjaanfk')
            ->leftJoin('pendidikan_m as pen', 'pen.id', '=', 'pm.objectpendidikanfk')
            ->leftJoin('alamat_m as alm', 'alm.nocmfk', '=', 'pm.id')
            ->leftJoin('propinsi_m as prop', 'prop.id', '=', 'alm.objectpropinsifk')
            ->leftJoin('golongandarah_m as gd', 'gd.id', '=', 'pm.objectgolongandarahfk')
            ->leftJoin('jeniskelamin_m as jk', 'jk.id', '=', 'pm.objectjeniskelaminfk')
            ->select(DB::raw("pm.nocm,pm.namapasien,pm.tempatlahir,pm.tgllahir,
                     case when sp.statusperkawinan is null then '-' else sp.statusperkawinan end as statusperkawinan,
                     case when ag.agama is null then '-' else ag.agama end as agama,
                     case when pk.pekerjaan is null then '-' else pk.pekerjaan end as pekerjaan,
                     alm.alamatlengkap,alm.namadesakelurahan,alm.kecamatan,
                     alm.kotakabupaten,prop.namapropinsi,alm.kodepos,
                     case when pm.notelepon is null then '-' else pm.notelepon end as notelepon,
                     case when pm.noidentitas is null then '-' else pm.noidentitas end as noidentitas,
                     case when gd.golongandarah is null then '-' else gd.golongandarah end as golongandarah,
                     case when pen.pendidikan is null then '-' else pen.pendidikan end as pendidikan,
                     case when pm.noasuransilain is null then '-' else  pm.noasuransilain end as noasuransilain,
                     case when pm.nobpjs is null then '-' else pm.nobpjs end as nobpjs,jk.jeniskelamin,
                     pm.penanggungjawab,pm.hubungankeluargapj,pm.pekerjaanpenangggungjawab,pm.ktppenanggungjawab,
                     pm.alamatrmh,pm.alamatktr"))
            ->where('pm.id', $request['nocm'])
            ->where('pm.kdprofile', (int)$kdProfile)
            ->first();

        $result = array(
            'data' => $data,
            'message' => 'ea@epic',
        );

        return $this->respond($result);
    }

    public function getAntrianPasienRanap(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('ruangan_m as ru1', 'ru1.id', '=', 'apd.objectruanganasalfk')
            ->select(
                'pd.noregistrasi',
                'pd.tglregistrasi',
                'pd.norec as norec_pd',
                'apd.norec as norec_apd',
                'apd.objectruanganasalfk',
                'ru1.namaruangan as ruangasal',
                'ru1.objectdepartemenfk as deptasal',
                'apd.objectruanganfk',
                'ru.namaruangan',
                'ru.objectdepartemenfk',
                'apd.objectkamarfk',
                'apd.nobed'
            )
            ->where('pd.kdprofile', (int)$kdProfile);
        $filter = $request->all();
        if (isset($filter['noReg']) && $filter['noReg'] != "" && $filter['noReg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $filter['noReg']);
        }
        $data = $data->get();

        $result = array(
            'data' => $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function saveBatalRanap(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        DB::beginTransaction();
        $tglAyeuna = date('Y-m-d H:i:s');
        $dataLogin = $request->all();

        $norecPd = '';
        // $resep = [];
        try {
            foreach ($request['data'] as $item) {
                $norecPd = $item['norec_pd'];
                if ($item['objectdepartemenfk'] == 16) {
                    $data1 = PasienDaftar::where('norec', $item['norec_pd'])
                        ->where('kdprofile', (int)$kdProfile)
                        ->update(
                            [
                                'objectruanganlastfk' => $item['objectruanganasalfk'],
                                'tglpulang' => $item['tglregistrasi']
                            ]
                        );
                    $dataRpp = RegistrasiPelayananPasien::where('noregistrasifk', $item['norec_pd'])->where('kdprofile', (int)$kdProfile)->delete();
                    $data2 = PelayananPasienPetugas::where('nomasukfk', $item['norec_apd'])->where('kdprofile', (int)$kdProfile)->delete();
                    $data3 = PelayananPasienDetail::where('noregistrasifk', $item['norec_apd'])->where('kdprofile', (int)$kdProfile)->delete();
                    $data4 = PelayananPasien::where('noregistrasifk', $item['norec_apd'])->where('kdprofile', (int)$kdProfile)->delete();

                    // $sr = StrukResep::where('pasienfk',$item['norec_apd'])->first();
                    // if(!empty($sr)){
                    //      $resep = array(
                    //         'noresep' => $sr->noresep,
                    //      );

                    // }
                    // $apd = AntrianPasienDiperiksa::where('norec',$item['norec_apd'])
                    //      ->whereNull('tglkeluar')
                    //      ->first();

                    // if(isset($item['nobed']) && $item['nobed'] !='null' && !empty($apd) ){
                    //     //update statusbed jadi Kosong
                    //      TempatTidur::where('id',$item['nobed'])->update(['objectstatusbedfk'=>2]);
                    // }


                    $data6 = AntrianPasienDiperiksa::where('norec', $item['norec_apd'])->where('kdprofile', (int)$kdProfile)->delete();
                }
                //## Logging User
                $newId = LoggingUser::max('id');
                $newId = $newId + 1;
                $logUser = new LoggingUser();
                $logUser->id = $newId;
                $logUser->norec = $logUser->generateNewId();
                $logUser->kdprofile = (int)$kdProfile;
                $logUser->statusenabled = true;
                $logUser->jenislog = 'Batal Ranap Pasien ' . $item['noregistrasi'] . ' Dari Ruangan ' . $item['namaruangan'];
                $logUser->noreff = $norecPd;
                $logUser->referensi = 'norec pasiendaftar';
                $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
                $logUser->tanggal = $tglAyeuna;
                $logUser->save();
            }


            $transStatus = 'true';
            $transMessage = "Batal Ranap Berhasil!";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Batal Ranap gagal";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                // "resep" => $resep,
                "message" => $transMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function updateJenisKelaminPasien(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        try {

            $dataApr = Pasien::where('nocm', $request['norm'])
                ->where('kdprofile', (int)$kdProfile)
                ->update([
                    'objectjeniskelaminfk' => $request['jeniskelamin'],
                ]);

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }


        if ($transStatus == 'true') {
            $transMessage = "Update Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            $transMessage = "Update Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function cekPasienBayar(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $nocm = $request['nocm'];
        $data = DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            // ->join('ruangan_m as ru','ru.id','=','pd.objectruanganlastfk')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            // ->join('strukpelayanan_t as sp','sp.norec','=','pd.nostruklastfk')
            ->leftjoin('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
            // ->leftjoin('batalregistrasi_t as br','br.pasiendaftarfk','=','pd.norec')
            ->select('pd.noregistrasi', 'pd.tglregistrasi')
            ->where('pd.objectkelompokpasienlastfk', '=', 1)
            ->where('pd.statusenabled', true)
            ->whereNull('pp.strukfk')
            // ->whereNull('pd.nosbmlastfk')
            ->where('ps.nocm', $nocm)
            // ->whereRaw("to_char(pd.tglregistrasi,'yyyy-MM-dd') > '2019-06-20'")
            ->where('pd.kdprofile', (int)$kdProfile)
            ->get();
        $status = true;
        $nocm = '';
        $tglregistrasi = '';
        if (count($data) > 0) {
            // foreach ($data as $item) {
            //     if($item->nosbmlastfk ==  null){
            $status = false;
            $tglregistrasi = $data[0]->tglregistrasi;
            // $nocm = $item->nocm ;
            // break;
            // }
            # code...
            // }
        }

        $result = array(
            'status' => $status,
            'nocm' => $nocm,
            'data' => $data,
            'tglregistrasi' => $tglregistrasi,
            'message' => 'ramdan@epic',
        );
        return $this->respond($result);
    }

    public function getDaftarRiwayatRegistrasi(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $data = \DB::table('pasien_m as ps')
            ->join('pasiendaftar_t as pd', 'pd.nocmfk', '=', 'ps.id')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->join('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            // ->leftJoin('batalregistrasi_t as br','br.pasiendaftarfk','=','pd.norec')
            // ->leftjoin('antrianpasiendiperiksa_t as apd','apd.noregistrasifk','=','pd.norec')
            ->select(DB::raw("pd.norec,pd.tglregistrasi,ps.nocm,pd.noregistrasi,ps.namapasien,pd.objectruanganlastfk,kp.kelompokpasien,ru.namaruangan,
                pd.objectpegawaifk,pg.namalengkap as namadokter,pd.tglpulang,ru.objectdepartemenfk,
                CASE when ru.objectdepartemenfk in (16,25,26) then 1 else 0 end as statusinap, CASE
                WHEN pd.tglpulang::date - pd.tglregistrasi::date > '0' and ru.objectdepartemenfk = '16' THEN
                pd.tglpulang::date - pd.tglregistrasi::date
                when pd.tglpulang::date - pd.tglregistrasi::date = '0' and ru.objectdepartemenfk = '16' THEN
                '1' when pd.tglpulang::date - pd.tglregistrasi::date = '0' and ru.objectdepartemenfk != '16' then '0'
                end as lamarawat"))
            ->where('pd.statusenabled', true)
            ->where('ps.kdprofile', (int)$kdProfile);

        //        if(isset($request['tglLahir']) && $request['tglLahir']!="" && $request['tglLahir']!="undefined"){
        //            $data = $data->where('ps.tgllahir','>=', $request['tglLahir'].' 00:00');
        //        };
        //        if(isset($request['tglLahir']) && $request['tglLahir']!="" && $request['tglLahir']!="undefined"){
        //            $data = $data->where('ps.tgllahir','<=', $request['tglLahir'].' 23:59');
        //        };

        if (isset($request['tglhariini']) && $request['tglhariini'] != "" && $request['tglhariini'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '=', '%' . $request['tglhariini'] . '%');
        };

        if (isset($request['norm']) && $request['norm'] != "" && $request['norm'] != "undefined") {
            $data = $data->where('ps.nocm', 'ilike', '%' . $request['norm'] . '%');
        };
        if (isset($request['namaPasien']) && $request['namaPasien'] != "" && $request['namaPasien'] != "undefined") {
            $data = $data->where('ps.namapasien', 'ilike', '%' . $request['namaPasien'] . '%');
        };
        if (isset($request['noReg']) && $request['noReg'] != "" && $request['noReg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $request['noReg']);
        };
        if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
            $data = $data->where('pd.objectruanganlastfk', '=', $request['idRuangan']);
        };



        $data = $data->where('ps.statusenabled', true);
        $data = $data->orderBy('pd.tglregistrasi');
        $data = $data->get();

        // $diagnosa = \DB::table('antrianpasiendiperiksa_t AS apd')
        //             ->join('detaildiagnosapasien_t AS ddp','ddp.noregistrasifk','=','apd.norec')
        //             ->join('diagnosapasien_t AS dp','dp.norec','=','ddp.objectdiagnosapasienfk')
        //             ->join ('diagnosa_m as dg','ddp.objectdiagnosafk','=','dg.id')
        //             ->select(DB::raw("apd.noregistrasifk,ddp.objectjenisdiagnosafk,dg.kddiagnosa AS diagnosa,
        //                              CASE WHEN dp.iskasusbaru = true AND dp.iskasuslama = false THEN 'BARU'
        //                              WHEN dp.iskasuslama = true AND dp.iskasusbaru = false THEN 'LAMA' ELSE '' END kasus"))
        //             ->where('apd.kdprofile', $kdProfile)
        //             ->where('apd.statusenabled', true)
        //             ->get();
        //             $norecaPd = '';
        //             foreach ($data as $ob){
        //                 $norecaPd = $norecaPd.",'".$ob->norec_apd . "'";
        //                 $ob->kddiagnosa = [];
        //             }
        //             $norecaPd = substr($norecaPd, 1, strlen($norecaPd)-1);
        //             $diagnosa = [];
        //             if($norecaPd!= ''){
        //                 $diagnosa = DB::select(DB::raw("
        //                    select dg.kddiagnosa,ddp.noregistrasifk as norec_apd
        //                    from detaildiagnosapasien_t as ddp
        //                    left join diagnosapasien_t as dp on dp.norec=ddp.objectdiagnosapasienfk
        //                    left join diagnosa_m as dg on ddp.objectdiagnosafk=dg.id
        //                    where ddp.noregistrasifk in ($norecaPd) "));
        //                 $i = 0;
        //                foreach ($data as $h){
        //                    $data[$i]->kddiagnosa = [];
        //                    foreach ($diagnosa as $d){
        //                        if($data[$i]->norec_apd == $d->norec_apd){
        //                            $data[$i]->kddiagnosa[] = $d->kddiagnosa;
        //                        }
        //                    }
        //                    $i++;
        //                }
        //             }
        $result = array(
            'daftar' => $data, //array_merge($data,$data2),
            // 'data2' =>$data2,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function updateKamar(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        DB::beginTransaction();
        try {
            $antrians = AntrianPasienDiperiksa::where('noregistrasifk', $request['norec_pd'])
                ->where('objectruanganfk', $request['ruanganlastfk'])
                ->whereNull('tglkeluar')
                ->where('kdprofile', (int)$kdProfile)
                ->first();
            $rpp = RegistrasiPelayananPasien::where('noregistrasifk', $request['norec_pd'])
                ->where('objectruanganfk', $request['ruanganlastfk'])
                ->whereNull('tglkeluar')
                ->where('kdprofile', (int)$kdProfile)
                ->first();

            //			if(!empty($antrians)){
            AntrianPasienDiperiksa::where('norec', $antrians->norec)
                ->where('kdprofile', (int)$kdProfile)
                ->update(
                    [
                        'objectkamarfk' => $request['objectkamarfk'],
                        'nobed' => $request['nobed'],
                    ]
                );

            //			}
            //			if(!empty($rpp)){
            RegistrasiPelayananPasien::where('norec', $rpp->norec)
                ->where('kdprofile', (int)$kdProfile)
                ->update(
                    [
                        'objectkamarfk' => $request['objectkamarfk'],
                        'nobed' => $request['nobed'],
                    ]
                );
            //			}


            //update statusbed jadi Isi
            TempatTidur::where('id', $request['nobed'])->where('kdprofile', (int)$kdProfile)->update(['objectstatusbedfk' => 1]);

            if (isset($request['nobedasal']) && $request['nobedasal'] != 'null' && $request['nobedasal'] != $request['nobed']) {
                //update statusbed jadi Kosong
                TempatTidur::where('id', $request['nobedasal'])->where('kdprofile', (int)$kdProfile)->update(['objectstatusbedfk' => 2]);
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }


        if ($transStatus == 'true') {
            $transMessage = "Update Kamar Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            $transMessage = "Update Kamar Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveBatalRanapRev(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        DB::beginTransaction();
        $tglAyeuna = date('Y-m-d H:i:s');
        $dataLogin = $request->all();

        try {
            $norecPd = $request['data']['norec_pd'];
            $apd = \DB::table('antrianpasiendiperiksa_t as apd')
                ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                ->select('ru.objectdepartemenfk', 'apd.norec', 'apd.objectruanganfk')
                ->where('apd.noregistrasifk', $norecPd)
                ->where('apd.kdprofile', (int)$kdProfile)
                ->get();
            $ruanganAsal = \DB::table('registrasipelayananpasien_t as rpp')
                ->join('ruangan_m as ru', 'ru.id', '=', 'rpp.objectruanganfk')
                ->select('ru.objectdepartemenfk', 'rpp.norec as norec_rpp', 'rpp.objectruanganfk', 'rpp.objectruanganasalfk', 'rpp.keteranganlainnyarencana')
                ->where('rpp.noregistrasifk', $norecPd)
                ->whereNotIn('ru.objectdepartemenfk', [27, 3])
                ->where('rpp.keteranganlainnyarencana', 'Mutasi Gawat Darurat')
                ->where('apd.kdprofile', (int)$kdProfile)
                ->first();


            foreach ($apd as $item) {
                if ($item->objectdepartemenfk == 16) {
                    $pelayanan = PelayananPasien::where('noregistrasifk', $item->norec)->where('kdprofile', (int)$kdProfile)->first();
                    if (!empty($pelayanan)) {
                        $transMessage = 'Pasien sudah mendapatkan pelayanan, hapus pelayanan dulu !';
                        $pel = array('norec_pp' => $pelayanan->norec);
                        return $this->setStatusCode(400)->respond($pel, $transMessage);
                    }

                    if (!empty($ruanganAsal)) {
                        $updatePD = PasienDaftar::where('norec', $norecPd)->where('kdprofile', (int)$kdProfile)
                            ->update(
                                [
                                    'objectruanganlastfk' => $ruanganAsal->objectruanganasalfk,
                                    'tglpulang' => $request['data']['tglregistrasi'],
                                    'objectkelasfk' => 6,
                                ]
                            );
                    } else {
                        $updatePD = PasienDaftar::where('norec', $norecPd)->where('kdprofile', (int)$kdProfile)
                            ->update(
                                [
                                    'statusenabled' => false,
                                    'tglpulang' => $request['data']['tglregistrasi']
                                ]
                            );
                    }
                    $delRPP = RegistrasiPelayananPasien::where('noregistrasifk', $norecPd)->where('kdprofile', (int)$kdProfile)->delete();
                    $delAPD = AntrianPasienDiperiksa::where('noregistrasifk', $norecPd)
                        ->where('kdprofile', (int)$kdProfile)
                        ->where('objectruanganfk', $item->objectruanganfk)
                        ->delete();

                    if (isset($request['data']['nobed']) && $request['data']['nobed'] != 'null') {
                        //update statusbed jadi Kosong
                        TempatTidur::where('id', $request['data']['nobed'])->where('kdprofile', (int)$kdProfile)->update(['objectstatusbedfk' => 2]);
                    }
                }
            }

            ## Logging User
            $newId = LoggingUser::max('id');
            $newId = $newId + 1;
            $logUser = new LoggingUser();
            $logUser->id = $newId;
            $logUser->norec = $logUser->generateNewId();
            $logUser->kdprofile = (int)$kdProfile;
            $logUser->statusenabled = true;
            $logUser->jenislog = 'Batal Rawat Inap';
            $logUser->noreff = $norecPd;
            $logUser->referensi = 'norec pasiendaftar';
            $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
            $logUser->tanggal = $tglAyeuna;
            $logUser->keterangan = 'Batal Rawat Inap dengan No Registrasi ' . $request['data']['noregistrasi'] . ' dari ruangan ' . $request['data']['namaruangan'];
            $logUser->save();

            //
            $transStatus = 'true';
            $transMessage = "Batal Rawat Inap Sukses";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Batal Rawat Inap gagal";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                // "resep" => $resep,
                "message" => $transMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveBatalPindahRuangan(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        DB::beginTransaction();
        $tglAyeuna = date('Y-m-d H:i:s');
        $dataLogin = $request->all();

        try {
            $norecPd = $request['norec_pd'];
            $apd = \DB::table('antrianpasiendiperiksa_t as apd')
                ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                ->select('ru.objectdepartemenfk', 'apd.norec', 'apd.objectruanganfk', 'apd.objectruanganasalfk', 'apd.objectkelasfk', 'apd.nobed', 'apd.objectkamarfk')
                ->where('apd.noregistrasifk', $norecPd)
                ->where('apd.kdprofile', (int)$kdProfile)
                ->get();
            $rpp = RegistrasiPelayananPasien::where('noregistrasifk', $norecPd)
                ->where('objectruanganfk', $request['objectruanganlastfk'])
                ->first();

            $ruanganAsal = \DB::table('registrasipelayananpasien_t as rpp')
                ->join('ruangan_m as ru', 'ru.id', '=', 'rpp.objectruanganfk')
                ->select(
                    'ru.objectdepartemenfk',
                    'rpp.norec as norec_rpp',
                    'rpp.objectruanganfk',
                    'rpp.objectruanganasalfk',
                    'rpp.objectkelasfk',
                    'rpp.objectkamarfk',
                    'rpp.objecttempattidurfk'
                )
                ->where('rpp.noregistrasifk', $norecPd)
                ->where('rpp.objectruanganfk', $rpp->objectruanganasalfk)
                ->whereNotIn('ru.objectdepartemenfk', [27, 3])
                ->where('rpp.kdprofile', (int)$kdProfile)
                ->orderBy('rpp.tglpindah', 'desc')
                ->first();


            foreach ($apd as $item) {
                if ($item->objectdepartemenfk == 16 && $request['objectruanganlastfk'] == $item->objectruanganfk) {
                    $pelayanan = PelayananPasien::where('noregistrasifk', $item->norec)->where('kdprofile', (int)$kdProfile)->first();
                    if (!empty($pelayanan)) {
                        $transMessage = 'Pasien sudah mendapatkan pelayanan, hapus pelayanan dulu !';
                        $pel = array('norec_pp' => $pelayanan->norec);
                        return $this->setStatusCode(400)->respond($pel, $transMessage);
                    } else {
                        $updatePD = PasienDaftar::where('norec', $norecPd)
                            ->where('kdprofile', (int)$kdProfile)
                            ->update(
                                [
                                    'objectruanganlastfk' => $ruanganAsal->objectruanganfk,
                                    'objectkelasfk' => $ruanganAsal->objectkelasfk,
                                ]
                            );

                        $rpp = RegistrasiPelayananPasien::where('noregistrasifk', $norecPd)
                            ->where('objectruanganfk', $request['objectruanganlastfk'])
                            ->whereNull('tglpindah')
                            ->where('kdprofile', (int)$kdProfile)
                            ->delete();
                        $delAPD = AntrianPasienDiperiksa::where('noregistrasifk', $norecPd)
                            ->where('objectruanganfk', $request['objectruanganlastfk'])
                            ->whereNull('tglkeluar')
                            ->where('kdprofile', (int)$kdProfile)
                            ->delete();
                        $updateAPDs = AntrianPasienDiperiksa::where('noregistrasifk', $norecPd)
                            ->where('objectruanganfk', $ruanganAsal->objectruanganfk)
                            ->wherenotnull('tglkeluar')
                            ->where('kdprofile', (int)$kdProfile)
                            ->update(
                                ['tglkeluar' => null]
                            );
                        $updateRpp = RegistrasiPelayananPasien::where('noregistrasifk', $norecPd)
                            ->where('objectruanganfk', $ruanganAsal->objectruanganfk)
                            ->wherenotnull('tglpindah')
                            ->where('kdprofile', (int)$kdProfile)
                            ->update(
                                ['tglpindah' => null]
                            );
                        if (isset($request['nobed']) && $request['nobed'] != 'null') {
                            //update statusbed jadi Kosong
                            TempatTidur::where('id', $request['nobed'])->where('kdprofile', (int)$kdProfile)->update(['objectstatusbedfk' => 2]);
                        }
                        if ($ruanganAsal->objecttempattidurfk != 'null') {
                            //update statusbed jadi Kosong
                            TempatTidur::where('id', $ruanganAsal->objecttempattidurfk)->where('kdprofile', (int)$kdProfile)->update(['objectstatusbedfk' => 1]);
                        }
                        break;
                    }
                }
            }

            ## Logging User
            $newId = LoggingUser::max('id');
            $newId = $newId + 1;
            $logUser = new LoggingUser();
            $logUser->id = $newId;
            $logUser->norec = $logUser->generateNewId();
            $logUser->kdprofile = (int)$kdProfile;
            $logUser->statusenabled = true;
            $logUser->jenislog = 'Batal Pindah Ruangan';
            $logUser->noreff = $norecPd;
            $logUser->referensi = 'norec pasiendaftar';
            $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
            $logUser->tanggal = $tglAyeuna;
            $logUser->keterangan = 'Batal Pindah Ruangan dengan No Registrasi ' . $request['noregistrasi'] . ' dari ruangan ' . $request['namaruangan'];
            $logUser->save();

            //
            $transStatus = 'true';
            $transMessage = "Batal Pindah Ruangan Sukses";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Tidak bisa Batal Pindah Ruangan";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                // "resep" => $resep,
                "message" => $transMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDataComboAsuransiPasien(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $dataAsalRujukan = \DB::table('asalrujukan_m as as')
            ->select('as.id', 'as.asalrujukan')
            ->where('as.statusenabled', true)
            ->where('as.kdprofile', $kdProfile)
            ->orderBy('as.id')
            ->get();


        $dataKelompok = \DB::table('kelompokpasien_m as kp')
            ->select('kp.id', 'kp.kelompokpasien')
            ->where('kp.statusenabled', true)
            ->where('kp.kdprofile', $kdProfile)
            ->orderBy('kp.kelompokpasien')
            ->get();

        $dataKelas = \DB::table('kelas_m as kl')
            ->select('kl.id', 'kl.namakelas')
            ->where('kl.statusenabled', true)
            ->where('kl.kdprofile', $kdProfile)
            ->orderBy('kl.namakelas')
            ->get();


        $dataHubunganPeserta = \DB::table('hubunganpesertaasuransi_m as hp')
            ->select('hp.id', 'hp.hubunganpeserta')
            ->where('hp.statusenabled', true)
            ->where('hp.kdprofile', $kdProfile)
            ->orderBy('hp.hubunganpeserta')
            ->get();


        $result = array(
            'kelompokpasien' => $dataKelompok,
            'kelas' => $dataKelas,
            'asalrujukan' => $dataAsalRujukan,
            'hubunganpeserta' => $dataHubunganPeserta,
            'kodePPKRujukan' => $this->settingDataFixed('kodePPKRujukan', $kdProfile),
            'namaPPKRujukan' => $this->settingDataFixed('namaPPKRujukan', $kdProfile),
            'statusBridgingTemporary' => $this->settingDataFixed('statusBridgingTemporary', $kdProfile),
            'message' => 'ramdanegie',
        );

        return $this->respond($result);
    }
    public  function cekPasienBPJSDaftar(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $tgl = $request['tglRegis'];
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->select('pd.norec', 'pd.noregistrasi')
            ->where('ps.nocm', $request['nocm'])
            ->whereRaw("to_char(pd.tglregistrasi,'yyyy-MM-dd') = '$tgl'")
            ->where('pd.statusenabled', true)
            ->where('pd.objectkelompokpasienlastfk', 2)
            ->where('pd.kdprofile', (int)$kdProfile)
            ->get();


        $result = array(
            'data' =>  $data,
            'msg' => 'er@epic'
        );
        return $this->respond($result);
    }
    public  function cekPasienBPJSDaftarMin30Hr(Request $request)
    {
        $status = false;
        $kdProfile = $this->getDataKdProfile($request);
        $deptJalan = explode(',', $this->settingDataFixed('kdDepartemenRawatJalanFix',  $kdProfile));
        $kdDepartemenRawatJalan = [];
        foreach ($deptJalan as $item) {
            $kdDepartemenRawatJalan[] =  (int)$item;
        }
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->join('ruangan_m as rm', 'rm.id', '=', 'pd.objectruanganlastfk')
            ->select('pd.norec', 'pd.noregistrasi', 'pd.tglregistrasi')
            ->where('ps.id', $request['nocm'])
            ->where('pd.statusenabled', true)
            ->where('pd.objectkelompokpasienlastfk', 2)
            ->where('pd.objectruanganlastfk', $request['idruangan'])
            ->where('pd.kdprofile', (int)$kdProfile)
            ->whereIn('rm.objectdepartemenfk', $kdDepartemenRawatJalan)
            ->orderBy('pd.tglregistrasi', 'desc')
            ->first();

        if ($data) {
            // Menghitung selisih antara tanggal sekarang dan tanggal registrasi terakhir
            $lastRegistrationDate = Carbon::parse($data->tglregistrasi);
            $currentDate = Carbon::parse($request->tglperiksa);
    
            // Jika selisihnya kurang dari 30 hari, maka proses ditolak
            if ($currentDate->diffInDays($lastRegistrationDate) < 29) {
                $status = true; 
            }
        }

        $result = array(
            'data' =>  $data,
            'status' =>  $status,
            'msg' => 'er@epic'
        );
        return $this->respond($result);
    }
    public function getDataPegawaiAll(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $req = $request->all();
        $dataPenulis = \DB::table('pegawai_m as st')
            ->select('st.id', 'st.namalengkap', 'st.nip_pns', 'st.kddokterbpjs as kodebpjs')
            ->where('st.statusenabled', true)
            ->where('st.kdprofile', (int)$kdProfile)
            ->orderBy('st.namalengkap');
        if (
            isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined"
        ) {
            $dataPenulis = $dataPenulis->where('namalengkap', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%');
        };
        if (isset($request['pgid']) && $request['pgid'] != '') {
            $dataPenulis = $dataPenulis->where('id', $request['pgid']);
        }
        $dataPenulis = $dataPenulis->take(10);
        $dataPenulis = $dataPenulis->get();
        foreach ($dataPenulis as $item) {
            $dataPenulis2[] = array(
                'id' => $item->id,
                'namalengkap' => $item->namalengkap,
                'nip_pns' => $item->nip_pns,
                'kodebpjs' => $item->kodebpjs,
            );
        }
        return $this->respond($dataPenulis2);
    }
    public function IdentifikasiBuktiLayanan(Request $request)
    {
        DB::beginTransaction();
        $transStatus = true;
        $dataLogin = $request->all();
        $kdProfile = $this->getDataKdProfile($request);
        $pasien = IdentifikasiPasien::where('noregistrasifk', $request['norec_pd'])->first();
        if ($pasien == '') {
            $ip = new IdentifikasiPasien();
            $norec = $ip->generateNewId();
            $ip->norec = $norec;
            $ip->kdprofile = (int)$kdProfile;
            $ip->statusenabled = true;
            $ip->noregistrasifk = $request['norec_pd'];
            $ip->isbuktilayanan = true;
            $ip->save();
        } else {
            $ip = IdentifikasiPasien::where('noregistrasifk', $request['norec_pd'])
                ->update([
                    'isbuktilayanan' => true,
                ]);
        }


        if ($transStatus == true) {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => 'er@epic'
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => 'er@epic'
            );
        }
        return $this->respond($result);
    }

    public function IdentifikasiSummaryList(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        DB::beginTransaction();
        $transStatus = true;
        $dataLogin = $request->all();

        $pasien = IdentifikasiPasien::where('noregistrasifk', $request['norec_pd'])->first();
        if ($pasien == '') {
            $ip = new IdentifikasiPasien();
            $norec = $ip->generateNewId();
            $ip->norec = $norec;
            $ip->kdprofile = (int)$kdProfile;
            $ip->statusenabled = true;
            $ip->noregistrasifk = $request['norec_pd'];
            $ip->issummarylist = true;
            $ip->save();
        } else {
            $ip = IdentifikasiPasien::where('noregistrasifk', $request['norec_pd'])
                ->update([
                    'issummarylist' => true,
                ]);
        }

        if ($transStatus == true) {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => 'er@epic'
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => 'er@epic'
            );
        }
        return $this->respond($result);
    }

    public function IdentifikasiTracer(Request $request)
    {
        $dataLogin = $request->all();
        $kdProfile = $this->getDataKdProfile($request);
        $pasien = IdentifikasiPasien::where('noregistrasifk', $request['norec_pd'])->first();
        $pasienDaftar = PasienDaftar::where('norec', $request['norec_pd'])->first();
        $tglregAwal = date('Y-m-d 00:00:00', strtotime($pasienDaftar->tglregistrasi));
        $tglregAkhir = date('Y-m-d 23:59:59', strtotime($pasienDaftar->tglregistrasi));
        $qtytracer = $request['qtytracer'];
        DB::beginTransaction();
        try {


            if ($pasien == '') {
                $notracer = $this->generateCodeBySeqTable(new IdentifikasiPasien, 'notracer', 5, date('d'), $kdProfile);
                $countNoAntrian = collect(DB::select("
                    SELECT MAX(noantrian) as nomor
                    FROM identifikasipasien_t AS ip
                    INNER JOIN pasiendaftar_t AS pd ON pd.norec = ip.noregistrasifk
                    WHERE pd.kdprofile = $kdProfile AND pd.statusenabled = true
                    AND pd.tglregistrasi BETWEEN '$tglregAwal' AND '$tglregAkhir'
                "))->first();
                $noAntrian = 0;
                if (empty($countNoAntrian->nomor)) {
                    $noAntrian = $noAntrian + 1;
                } else {
                    $noAntrian = $countNoAntrian->nomor + 1;
                }
                $ip = new IdentifikasiPasien();
                $norec = $ip->generateNewId();
                $ip->norec = $norec;
                $ip->kdprofile = (int)$kdProfile;
                $ip->statusenabled = true;
                $ip->noregistrasifk = $request['norec_pd'];
                $ip->istracer = true;
                $ip->noantriantracer = $notracer;
                $ip->tglregistrasi = $pasienDaftar->tglregistrasi;
                $ip->noantrian = $noAntrian;
                $ip->qtytracer = $qtytracer;
                $ip->save();
            } else {
                $pasienUp = IdentifikasiPasien::where('noregistrasifk', $request['norec_pd'])->first();
                $countNoAntrian = collect(DB::select("
                    SELECT MAX(noantrian) as nomor
                    FROM identifikasipasien_t AS ip
                    INNER JOIN pasiendaftar_t AS pd ON pd.norec = ip.noregistrasifk
                    WHERE pd.kdprofile = $kdProfile AND pd.statusenabled = true
                    AND pd.tglregistrasi BETWEEN '$tglregAwal' AND '$tglregAkhir'
                "))->first();
                $noAntrian = 0;
                if (empty($countNoAntrian->nomor)) {
                    $noAntrian = $noAntrian + 1;
                } else {
                    $noAntrian = $countNoAntrian->nomor + 1;
                }
                if (empty($pasienUp->noantrian)) {
                    $ip = IdentifikasiPasien::where('noregistrasifk', $request['norec_pd'])
                        ->update([
                            'noantrian' => $noAntrian,
                            'istracer' => true,
                            'qtytracer' => $pasienUp->qtytracer + $qtytracer,
                        ]);
                } else {
                    $ip = IdentifikasiPasien::where('noregistrasifk', $request['norec_pd'])
                        ->update([
                            'istracer' => true,
                            'qtytracer' => $pasienUp->qtytracer + $qtytracer,
                        ]);
                }
            }
            $pasienout = IdentifikasiPasien::where('noregistrasifk', $request['norec_pd'])->first();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "";
        }

        if ($transStatus == true) {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => 'er@epic',
                "identifikasi" => $pasienout
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => 'er@epic',
                "identifikasi" => $pasienout
            );
        }
        return $this->respond($result);
    }

    public function IdentifikasiSEP(Request $request)
    {
        DB::beginTransaction();
        $transStatus = true;
        $dataLogin = $request->all();
        $kdProfile = $this->getDataKdProfile($request);
        $pasien = IdentifikasiPasien::where('noregistrasifk', $request['norec_pd'])->first();
        if ($pasien == '') {
            $ip = new IdentifikasiPasien();
            $norec = $ip->generateNewId();
            $ip->norec = $norec;
            $ip->kdprofile = $kdProfile;
            $ip->statusenabled = true;
            $ip->noregistrasifk = $request['norec_pd'];
            $ip->issep = true;
            $ip->save();
        } else {
            $ip = IdentifikasiPasien::where('noregistrasifk', $request['norec_pd'])
                ->update([
                    'issep' => true,
                ]);
        }

        if ($transStatus == true) {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => 'er@epic'
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => 'er@epic'
            );
        }
        return $this->respond($result);
    }

    public function IdentifikasiLabel(Request $request)
    {
        DB::beginTransaction();
        $transStatus = true;
        $dataLogin = $request->all();
        $kdProfile = $this->getDataKdProfile($request);
        $pasien = IdentifikasiPasien::where('noregistrasifk', $request['norec_pd'])->first();
        if ($pasien == '') {
            $ip = new IdentifikasiPasien();
            $norec = $ip->generateNewId();
            $ip->norec = $norec;
            $ip->kdprofile = (int)$kdProfile;
            $ip->statusenabled = true;
            $ip->noregistrasifk = $request['norec_pd'];
            $ip->islabel = $request['islabel'];
            $ip->save();
        } else {
            $ip = IdentifikasiPasien::where('noregistrasifk', $request['norec_pd'])
                ->update([
                    'islabel' => $request['islabel'],
                ]);
        }

        if ($transStatus == true) {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => 'ea@epic'
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => 'ea@epic'
            );
        }
        return $this->respond($result);
    }

    public function IdentifikasiKartuPasien(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        DB::beginTransaction();
        $transStatus = true;
        $dataLogin = $request->all();
        $pasien = IdentifikasiPasien::where('noregistrasifk', $request['norec_pd'])->first();
        if ($pasien == '') {
            $ip = new IdentifikasiPasien();
            $norec = $ip->generateNewId();
            $ip->norec = $norec;
            $ip->kdprofile = (int)$kdProfile;
            $ip->statusenabled = true;
            $ip->noregistrasifk = $request['norec_pd'];
            $ip->iskartupasien = true;
            $ip->save();
        } else {
            $ip = IdentifikasiPasien::where('noregistrasifk', $request['norec_pd'])
                ->update([
                    'iskartupasien' => true,
                ]);
        }

        if ($transStatus == true) {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => 'ea@epic'
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => 'ea@epic'
            );
        }
        return $this->respond($result);
    }

    public function IdentifikasiRMK(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        DB::beginTransaction();
        $transStatus = true;
        $dataLogin = $request->all();

        $pasien = IdentifikasiPasien::where('noregistrasifk', $request['norec_pd'])->first();
        if ($pasien == '') {
            $ip = new IdentifikasiPasien();
            $norec = $ip->generateNewId();
            $ip->norec = $norec;
            $ip->kdprofile = (int)$kdProfile;
            $ip->statusenabled = true;
            $ip->noregistrasifk = $request['norec_pd'];
            $ip->isrmk = true;
            $ip->save();
        } else {
            $ip = IdentifikasiPasien::where('noregistrasifk', $request['norec_pd'])
                ->update([
                    'isrmk' => true,
                ]);
        }

        if ($transStatus == true) {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => 'ea@epic'
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => 'ea@epic'
            );
        }
        return $this->respond($result);
    }
    public function saveDiagnosaPasienRMK(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin = $request->all();
        DB::beginTransaction();
        //        try{
        $dataPegawaiUser = DB::select(
            DB::raw("select pg.id,pg.namalengkap from loginuser_s as lu
                INNER JOIN pegawai_m as pg on lu.objectpegawaifk=pg.id
                where lu.id=:idLoginUser and lu.kdprofile = $idProfile"),
            array(
                'idLoginUser' => $dataLogin['userData']['id'],
            )
        );

        if ($dataLogin['norec_dp'] == '') {
            $dataDiagnosa = new DiagnosaPasien();
            $dataDiagnosa->norec = $dataDiagnosa->generateNewId();
            $dataDiagnosa->kdprofile = $idProfile;
            $dataDiagnosa->statusenabled = true;
        } else {
            $dataDiagnosa = DiagnosaPasien::where('norec', $dataLogin['norec_dp'])->first();
        }
        $dataDiagnosa->noregistrasifk = $dataLogin['noregistrasifk'];
        $dataDiagnosa->ketdiagnosis = 'Diagnosa Pasien';
        $dataDiagnosa->tglregistrasi = $dataLogin['tglpendaftaran'];
        $dataDiagnosa->tglpendaftaran = $dataLogin['tglpendaftaran'];

        try {
            $dataDiagnosa->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan Diagnosa Baru";
        }


        if ($dataLogin['norec_dp'] == '' || $dataLogin['keterangan'] == '') {
            $dataDetailDiagnosa = new DetailDiagnosaPasien();
            $dataDetailDiagnosa->norec = $dataDetailDiagnosa->generateNewId();
            $dataDetailDiagnosa->kdprofile = $idProfile;
            $dataDetailDiagnosa->statusenabled = true;
            $dataDetailDiagnosa->objectpegawaifk = $dataPegawaiUser[0]->id; // $this->getCurrentLoginID();

        } else {
            $dataDetailDiagnosa = DetailDiagnosaPasien::where('objectdiagnosapasienfk', $dataLogin['norec_dp'])->first();
        }

        $dataDetailDiagnosa->noregistrasifk = $dataLogin['noregistrasifk'];
        $dataDetailDiagnosa->tglregistrasi = $dataLogin['tglpendaftaran'];
        $dataDetailDiagnosa->norec = $dataDetailDiagnosa->generateNewId();
        $dataDetailDiagnosa->objectdiagnosafk = $dataLogin['objectdiagnosafk'];
        $dataDetailDiagnosa->objectdiagnosapasienfk = $dataDiagnosa->norec;
        $dataDetailDiagnosa->objectjenisdiagnosafk = $dataLogin['objectjenisdiagnosafk'];
        $dataDetailDiagnosa->tglinputdiagnosa = $dataLogin['tglinputdiagnosa'];
        $dataDetailDiagnosa->keterangan = $dataLogin['keterangan'];
        $dataDetailDiagnosa->objectpegawaifk = $dataPegawaiUser[0]->id; // $this->getCurrentLoginID();


        try {
            $dataDetailDiagnosa->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan Pasien Baru";
        }

        if ($transStatus == 'true') {
            $transMessage = "Data Tersimpan";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'data' => $dataLogin,
                'as' => 'egie@ramdan',
            );
        } else {
            $transMessage = "Data Gagal Disimpan";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message' => $transMessage,
                'data' => $dataLogin,
                'as' => 'egie@ramdan',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
        //        return $this->respond($dataLogin);
    }
    public function updateNoCmInEmrPasienReg(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        DB::beginTransaction();
        try {
            $dataKelas = Kelas::where('id', $request['kelas'])
                ->where('statusenabled', true)
                ->select('id', 'namakelas')
                ->first();

            if (isset($request['nocm']) || $request['nocm'] != "-" | $request['nocm'] != "") {
                $dataUpt = EMRPasien::where('noemr', $request['noemr'])
                    ->where('kdprofile', (int)$kdProfile)
                    ->update([
                        'nocm' => $request['nocm'],
                    ]);
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Update Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            $transMessage = "Update Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function ConfirmOnline(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        //        $data=$request['data'];
        //        return $this->respond($data);
        try {
            //            foreach ($data as $item) {
            $dataApr = AntrianPasienRegistrasi::where('noreservasi', $request['noreservasi'])
                ->where('kdprofile', (int)$kdProfile)
                ->update([
                    'isconfirm' => true,
                    //                        'objectstatusbarang'=> 2
                ]);
            //            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Update Status Gagal";
        }


        if ($transStatus == 'true') {
            $transMessage = "Update Status Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                //                    "as" => 'cepot',
            );
        } else {
            $transMessage = "Update Status Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                //                    "as" => 'Cepot',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function updatePdInEmrPasien(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        DB::beginTransaction();
        try {
            $dataKelas = Kelas::where('id', $request['kelas'])
                ->where('statusenabled', true)
                ->select('id', 'namakelas')
                ->first();

            $dataKelompokPasien = KelompokPasien::where('id', $request['kelompokpasien'])
                ->where('statusenabled', true)
                ->select('id', 'kelompokpasien')
                ->first();

            //            if ($dataKelas == "" && $dataKelompokPasien ==""){
            if (isset($request['norecpd']) || $request['norecpd'] != "-" | $request['norecpd'] != "") {
                $dataUpt = EMRPasien::where('noemr', $request['noemr'])
                    ->where('kdprofile', (int)$kdProfile)
                    ->update([
                        'norec_apd' => $request['norecapd'],
                        'noregistrasifk' => $request['norecpd'],
                        'noregistrasi' => $request['noregistrasi'],
                        'kelompokpasien' => $dataKelompokPasien->kelompokpasien,
                        'namakelas' => $dataKelas->namakelas,
                        'tglregistrasi' => $request['tglregistrasi'],
                    ]);
            }
            //            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Update Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            $transMessage = "Update Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getComboPasienPerjanjian(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $deptJalan = explode(',', $this->settingDataFixed('kdDepartemenReservasiOnline', $kdProfile));
        $kdDepartemenRawatJalan = [];
        foreach ($deptJalan as $item) {
            $kdDepartemenRawatJalan[] =  (int)$item;
        }

        $dataRuanganJalan = \DB::table('ruangan_m as ru')
            ->select('ru.id', 'ru.namaruangan', 'ru.objectdepartemenfk')
            ->where('ru.statusenabled', true)
            ->wherein('ru.objectdepartemenfk', $kdDepartemenRawatJalan)
            ->where('ru.kdprofile', (int)$kdProfile)
            ->orderBy('ru.namaruangan')
            ->get();
        $jk = \DB::table('jeniskelamin_m')
            ->select('id', 'jeniskelamin')
            ->where('statusenabled', true)
            ->orderBy('jeniskelamin')
            ->get();
        $kdJenisPegawaiDokter = $this->settingDataFixed('kdJenisPegawaiDokter', $kdProfile);

        $dkoter = \DB::table('pegawai_m')
            ->select('*')
            ->where('statusenabled', true)
            ->where('objectjenispegawaifk', $kdJenisPegawaiDokter)
            ->where('kdprofile', (int)$kdProfile)
            ->orderBy('namalengkap')
            ->get();

        $kelompokPasien = \DB::table('kelompokpasien_m')
            ->select('id', 'kelompokpasien')
            ->where('statusenabled', true)
            ->orderBy('kelompokpasien')
            ->get();
        $result = array(
            'ruanganrajal' => $dataRuanganJalan,
            'jeniskelamin' => $jk,
            'dokter' => $dkoter,
            'kelompokpasien' => $kelompokPasien,
            'message' => 'ramdan@epic',
        );

        return $this->respond($result);
    }

    public function getPasienPerjanjian(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $data = \DB::table('antrianpasienregistrasi_t as apr')
            ->leftJoin('pasiendaftar_t as pd', 'pd.statusschedule', '=', 'apr.noreservasi')
            ->leftJoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->leftJoin('pasien_m as pm', 'pm.id', '=', 'apr.nocmfk')
            ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'apr.objectruanganfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'apr.objectpegawaifk')
            ->leftJoin('kelompokpasien_m as kps', 'kps.id', '=', 'apr.objectkelompokpasienfk')
            ->select(
                'apr.norec',
                'pm.nocm',
                'apr.noreservasi',
                'apr.tanggalreservasi',
                'apr.objectruanganfk',
                'apr.objectpegawaifk',
                'ru.namaruangan',
                'apr.isconfirm',
                'pg.namalengkap as dokter',
                'apr.notelepon',
                'pm.namapasien',
                'apr.namapasien',
                'apr.objectkelompokpasienfk',
                'kps.kelompokpasien',
                'apr.tglinput',
                'apr.nocmfk',
                'pd.tglcheckin',
                DB::raw('(case when pm.namapasien is null then apr.namapasien else pm.namapasien end) as namapasien,
                (case when apr.isconfirm=\'true\' then \'Confirm\' else \'Reservasi\' end) as status,apr.jamreservasi,apr.ismobilejkn,apd.noantrian,apr.jenis')
            )
            ->where('apr.noreservasi', '<>', '-')
            ->where('apr.statusenabled', true)
            ->where('apr.kdprofile', (int)$kdProfile)
            ->whereNotNull('apr.noreservasi');

        $filter = $request;
        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('apr.tanggalreservasi', '>=', $filter['tglAwal'] . " 00:00:00");
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $tgl = $filter['tglAkhir'] . " 23:59:59"; //. " 23:59:59";
            $data = $data->where('apr.tanggalreservasi', '<=', $tgl);
        }
        if (isset($filter['ruanganId']) && $filter['ruanganId'] != "" && $filter['ruanganId'] != "undefined") {
            $data = $data->where('ru.id', '=', $filter['ruanganId']);
        }
        if (isset($filter['kdReservasi']) && $filter['kdReservasi'] != "" && $filter['kdReservasi'] != "undefined") {
            $data = $data->where('apr.noreservasi', '=', $filter['kdReservasi']);
        }
        if (isset($filter['statusRev']) && $filter['statusRev'] == "Confirm" && $filter['statusRev'] == "Confirm" && $filter['statusRev'] == "Confirm") {
            $data = $data->where('apr.isconfirm', '=', true);
        }
        if (isset($filter['statusRev']) && $filter['statusRev'] == "Reservasi" && $filter['statusRev'] == "Reservasi" && $filter['statusRev'] == "Reservasi") {
            $data = $data->whereNull('apr.isconfirm');
        }
        if (isset($filter['namapasienpm']) && $filter['namapasienpm'] != "" && $filter['namapasienpm'] != "undefined") {
            $data = $data->whereRaw(
                " ( pm.namapasien ilike '%" . $filter['namapasienpm'] . "%' or apr.namapasien ilike '%" . $filter['namapasienpm'] . "%' )"
            );
            // ->orWhere('apr.namapasien','ilike','%'. $filter['namapasienapr'] .'%');
        }

        // if(isset($filter['namapasienapr']) && $filter['namapasienapr'] != "" && $filter['namapasienapr'] != "undefined") {
        //     $data = $data->orWhere('apr.namapasien','ilike','%'. $filter['namapasienapr'] .'%');
        // }
        $data = $data->orderBy('apr.tanggalreservasi', 'asc');
        $data = $data->distinct()->get();

        $result = array(
            'data' => $data,
            'message' => 'cepot',
        );
        return $this->respond($result);
    }
    public function getPasienPerjanjianV2(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $data = \DB::table('antrianpasienregistrasi_t as apr')
            ->leftJoin('pasiendaftar_t as pd', 'pd.statusschedule', '=', 'apr.noreservasi')
            ->leftJoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->leftJoin('pasien_m as pm', 'pm.id', '=', 'apr.nocmfk')
            ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'apr.objectruanganfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'apr.objectpegawaifk')
            ->leftJoin('kelompokpasien_m as kps', 'kps.id', '=', 'apr.objectkelompokpasienfk')
            ->select(
                'apr.tipepasien',
                'pm.tgllahir',
                'apr.norec',
                'pm.nocm',
                'apr.noreservasi',
                'apr.tanggalreservasi',
                'apr.objectruanganfk',
                'apr.objectpegawaifk',
                'ru.namaruangan',
                'apr.isconfirm',
                'pg.namalengkap as dokter',
                'apr.notelepon',
                'pm.namapasien',
                'apr.namapasien',
                'apr.objectkelompokpasienfk',
                'kps.kelompokpasien',
                'apr.tglinput',
                'apr.nocmfk',
                DB::raw('(case when pm.namapasien is null then apr.namapasien else pm.namapasien end) as namapasien,
                (case when apr.isconfirm=\'true\' then \'Confirm\' else \'Reservasi\' end) as status,apr.jamreservasi,apr.ismobilejkn,apd.noantrian,apr.jenis')
            )
            ->where('apr.noreservasi', '<>', '-')
            ->where('apr.statusenabled', true)
            ->where('apr.kdprofile', (int)$kdProfile)
            ->whereNotNull('apr.noreservasi')
            ->where('apr.objectpegawaifk', $request['objectpegawaifk']);
        $filter = $request;
        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('apr.tanggalreservasi', '>=', $filter['tglAwal'] . " 00:00:00");
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $tgl = $filter['tglAkhir'] . " 23:59:59"; //. " 23:59:59";
            $data = $data->where('apr.tanggalreservasi', '<=', $tgl);
        }
        if (isset($filter['ruanganId']) && $filter['ruanganId'] != "" && $filter['ruanganId'] != "undefined") {
            $data = $data->where('ru.id', '=', $filter['ruanganId']);
        }
        if (isset($filter['kdReservasi']) && $filter['kdReservasi'] != "" && $filter['kdReservasi'] != "undefined") {
            $data = $data->where('apr.noreservasi', '=', $filter['kdReservasi']);
        }
        if (isset($filter['statusRev']) && $filter['statusRev'] == "Confirm" && $filter['statusRev'] == "Confirm" && $filter['statusRev'] == "Confirm") {
            $data = $data->where('apr.isconfirm', '=', true);
        }
        if (isset($filter['statusRev']) && $filter['statusRev'] == "Reservasi" && $filter['statusRev'] == "Reservasi" && $filter['statusRev'] == "Reservasi") {
            $data = $data->whereNull('apr.isconfirm');
        }
        if (isset($filter['namapasienpm']) && $filter['namapasienpm'] != "" && $filter['namapasienpm'] != "undefined") {
            $data = $data->whereRaw(
                " ( pm.namapasien ilike '%" . $filter['namapasienpm'] . "%' or apr.namapasien ilike '%" . $filter['namapasienpm'] . "%' )"
            );
            // ->orWhere('apr.namapasien','ilike','%'. $filter['namapasienapr'] .'%');
        }

        // if(isset($filter['namapasienapr']) && $filter['namapasienapr'] != "" && $filter['namapasienapr'] != "undefined") {
        //     $data = $data->orWhere('apr.namapasien','ilike','%'. $filter['namapasienapr'] .'%');
        // }
        $data = $data->orderBy('apr.tanggalreservasi', 'desc');
        $data = $data->get();

        $result = array(
            'data' => $data,
            'message' => 'cepot',
        );
        return $this->respond($result);
    }

    public function getDiagnosaDaftarAntrian(Request $request){
        $req = $request->all();
        $icdIX = \DB::table('diagnosa_m as dg')
            ->select('dg.id', 'dg.kddiagnosa', 'dg.namadiagnosa','dg.kddiagnosa as kdDiagnosa','dg.namadiagnosa as namaDiagnosa')
            ->where('dg.statusenabled', true)
            // ->whereNull('inagrouper')
            ->orderBy('dg.kddiagnosa');

        if (isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined"
        ) {
            $filterValue = str_replace('.', '', $req['filter']['filters'][0]['value']);

            $icdIX = $icdIX->where(function ($q) use ($filterValue) {
                $q->whereRaw("REPLACE(dg.kddiagnosa, '.', '') ILIKE ?", ["%{$filterValue}%"])
                ->orWhereRaw("REPLACE(dg.namadiagnosa, '.', '') ILIKE ?", ["%{$filterValue}%"]);
            })
            // $icdIX = $icdIX
            //     ->where(function ($q) use ($req) {
            //         $q->where('dg.namadiagnosa', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%')
            //         ->orWhere('dg.kddiagnosa', 'ilike', $req['filter']['filters'][0]['value'] . '%');
            //     })
                ->where('dg.statusenabled', true);
        }

        $icdIX = $icdIX->take(10);
        $icdIX = $icdIX->get();

        $data = [];
        if (count($icdIX) > 0) {
            foreach ($icdIX as $item) {
                $data [] = array(
                    'kodeNama' => $item->kdDiagnosa . ' - ' . $item->namaDiagnosa,
                    'id' => $item->id,
                    'kdDiagnosa' => $item->kdDiagnosa,
                    'namaDiagnosa' => $item->namaDiagnosa,

                );

            }
        }

        return $this->respond($data);
    } 
    public function getDataPasienMauBatal(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $filter = $request->all();
        $data = \DB::table('pasiendaftar_t as pd')
            ->leftJoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->Join('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->leftJoin('batalregistrasi_t as br', 'br.pasiendaftarfk', '=', 'pd.norec')
            ->leftJoin('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->select(
                'pd.norec',
                'pd.tglregistrasi',
                'ps.nocm',
                'pd.noregistrasi',
                'ps.namapasien',
                'pd.objectruanganasalfk',
                'ru.namaruangan',
                'br.norec as norec_br',
                'apd.norec as norec_apd',
                'pp.norec as norec_pp'
            );

        if (isset($filter['noReg']) && $filter['noReg'] != "" && $filter['noReg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $filter['noReg']);
        }
        $data = $data->where('pd.kdprofile', (int)$kdProfile);
        $data = $data->orderBy('pd.noregistrasi');
        $data = $data->get();

        return $this->respond($data);
    }

    public function SimpanBatalPeriksa(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin = $request->all();
        DB::beginTransaction();
        $TglPulang = "";
        $dataPegawaiUser = DB::select(
            DB::raw("select pg.id,pg.namalengkap from loginuser_s as lu
                INNER JOIN pegawai_m as pg on lu.objectpegawaifk=pg.id and pg.kdprofile = $idProfile
                where lu.id=:idLoginUser"),
            array(
                'idLoginUser' => $dataLogin['userData']['id'],
            )
        );
        $transStatus = 'true';
        try {
            if ($request['norec_br'] == '') {
                $newBR = new BatalRegistrasi();
                $norec = $newBR->generateNewId();
                $newBR->norec = $norec;
                $newBR->kdprofile = $idProfile;
                $newBR->statusenabled = true;
            } else {
                $newBR = BatalRegistrasi::where('pasiendaftarfk', $request['norec'])->first();
            }
            $newBR->alasanpembatalan = $request['alasanpembatalan'];
            $newBR->pasiendaftarfk = $request['norec'];
            $newBR->pegawaifk = $dataPegawaiUser[0]->id; // $this->getCurrentLoginID();
            $newBR->pembatalanfk = $request['pembatalanfk'];
            $newBR->tanggalpembatalan = $request['tanggalpembatalan'];
            $newBR->save();
            $dataaa = PasienDaftar::where('norec', $request['norec'])->get();
            foreach ($dataaa as $item) {
                $TglPulang = $item->tglpulang;
            }
            //            return $this->respond($TglPulang == null);
            if ($TglPulang != null) {

                $data2 = PasienDaftar::where('norec', $request['norec'])
                    ->where('kdprofile', $idProfile)
                    ->update([
                        //                        'kdprofile' => 0,
                        //                        'isbatal' => 1,
                        'statusenabled' => false,
                    ]);
            } else {
                $data2 = PasienDaftar::where('norec', $request['norec'])
                    ->update([
                        //                        'kdprofile' => 0,
                        //                        'isbatal' => 1,
                        'statusenabled' => false,
                        'tglpulang' => $request['tanggalpembatalan']
                    ]);
            }
            $data2 = PasienDaftar::where('norec', $request['norec'])
                ->where('kdprofile', $idProfile)
                ->update([
                    //                    'kdprofile' => 0,
                    //                    'isbatal' => 1,
                    'statusenabled' => false
                    //                    'tglpulang' => $request['tanggalpembatalan']
                ]);
            AntrianPasienDiperiksa::where('noregistrasifk', $request['norec'])
                // whereNull('tglkeluar') dihapus karena rawat jalan sudah memiliki tglkeluar saat registrasi
                // sehingga kondisi ini mencegah statusenabled diset false untuk pasien rawat jalan
                ->where('kdprofile', $idProfile)
                ->update([
                    'statusenabled' => false,
                    'tglkeluar' => $request['tanggalpembatalan'],
                ]);


            $transMessage = "Batal Periksa Sukses!";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Gagal Batal Periksa";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function pasienBatalPanggil(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        DB::beginTransaction();
        try {

            if ($request['norec_apd'] != null) {
                $ddddd = AntrianPasienDiperiksa::where('norec', $request['norec_apd'])
                    ->where('pd.kdprofile', (int)$kdProfile)
                    ->update(
                        [
                            'statusantrian' => 0
                        ]

                    );
            }
            $transMessage = "Sukses";


            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {

            DB::commit();
            $result = array(
                "status" => 201,
                //                "message" =>   $transMessae,
                "message" => $transMessage,
                "struk" => $ddddd, //$noResep,,//$noResep,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Simpan  Tanggal Pulang Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "struk" => $ddddd,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function deleteDiagnosaPasien(Request $request) {
        $dataLogin = $request->all();
        $kdProfile = $this->getDataKdProfile($request);
        $data1 = null;
        $transStatus = 'false';
        DB::beginTransaction();
        if (isset($request['diagnosa']['norec_ddp']) && $request['diagnosa']['norec_ddp']  != '')  {
            $data1 =  DetailDiagnosaPasien::where('norec', $request['diagnosa']['norec_ddp'])->where('kdprofile', (int)$kdProfile)->first();
            $norecdp = $data1->objectdiagnosapasienfk;
            // dd($norecdp);
            try {
                $data2 = DetailDiagnosaPasien::where('norec', $request['diagnosa']['norec_ddp'])->where('kdprofile', (int)$kdProfile)->delete();
                $data2 = db::table("detaildiagnosapasien_t_copy1")->where('norec', $request['diagnosa']['norec_ddp'])->where('kdprofile', (int)$kdProfile)->delete();
                $transStatus = 'true';
            } catch (\Exception $e) {
                $transStatus = false;

            }
            try {
                $data3 = DiagnosaPasien::where('norec','=',$norecdp)->where('kdprofile', $kdProfile)->delete();
                
                $transStatus = 'true';
            } catch (\Exception $e) {
                $transStatus = false;
            
            }
        }
        if (isset($request['diagnosa']['norec_dp']) && $request['diagnosa']['norec_dp'] != '') {
            try {
                $data1 = DetailDiagnosaPasien::where('objectdiagnosapasienfk', $request['diagnosa']['norec_dp'])->where('kdprofile', $kdProfile)->delete();
                $transStatus = 'true';
            } catch (\Exception $e) {
                $transStatus = false;
            }
            try {
                $data2 = DiagnosaPasien::where('norec', $request['diagnosa']['norec_dp'])->where('kdprofile', $kdProfile)->delete();
                $transStatus = 'true';
            } catch (\Exception $e) {
                $transStatus = false;
            }

        }
        if($transStatus == 'true'){

            if (isset($request['noreg']) && isset($request['eklaim'])) {
                if (isset($request['idrg']) && $request['idrg'] == true) {
                    $diagnosapasien = \DB::table('pasiendaftar_t as pd')
                        ->select('ddp.norec','ddp.objectjenisdiagnosafk')
                        ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                        ->join('detaildiagnosapasien_t as ddp', 'ddp.noregistrasifk', '=', 'apd.norec')
                        ->where('pd.kdprofile', (int)$kdProfile)
                        ->where('pd.noregistrasi', '=', $request['noreg'])
                        ->whereIn('ddp.objectjenisdiagnosafk', [15,16])
                        ->orderBy('ddp.tglinputdiagnosa', 'asc')
                        ->get();

                    $ada15 = false;
                    $norecinput_awal = null;

                    foreach ($diagnosapasien as $item) {
                        if ($item->objectjenisdiagnosafk == 15) {
                            $ada15 = true;
                            break;
                        }

                        // simpan yang tglinput paling awal
                        if ($item->objectjenisdiagnosafk == 16 && $norecinput_awal == null) {
                            $norecinput_awal = $item->norec;
                        }
                    }

                    if (!$ada15 && $norecinput_awal != null) {
                        try {
                            \DB::table('detaildiagnosapasien_t')
                                ->where('norec', $norecinput_awal)
                                ->update(['objectjenisdiagnosafk' => 15]);
                            $transStatus = true;
                        } catch (\Exception $e) {
                            $transStatus = false;
                            $transMessage = $e->getMessage();
                        }
                    }
                }

                if (isset($request['inacbg']) && $request['inacbg'] == true) {
                    $diagnosapasien = \DB::table('pasiendaftar_t as pd')
                        ->select('ddp.norec','ddp.objectjenisdiagnosafk')
                        ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                        ->join('detaildiagnosapasien_t as ddp', 'ddp.noregistrasifk', '=', 'apd.norec')
                        ->where('pd.kdprofile', (int)$kdProfile)
                        ->where('pd.noregistrasi', '=', $request['noreg'])
                        ->whereIn('ddp.objectjenisdiagnosafk', [7,8])
                        ->orderBy('ddp.tglinputdiagnosa', 'asc')
                        ->get();

                    $ada7 = false;
                    $norecinput_awal = null;

                    foreach ($diagnosapasien as $item) {
                        if ($item->objectjenisdiagnosafk == 7) {
                            $ada7 = true;
                            break;
                        }

                        // simpan yang tglinput paling awal
                        if ($item->objectjenisdiagnosafk == 8 && $norecinput_awal == null) {
                            $norecinput_awal = $item->norec;
                        }
                    }

                    if (!$ada7 && $norecinput_awal != null) {
                        try {
                            \DB::table('detaildiagnosapasien_t')
                                ->where('norec', $norecinput_awal)
                                ->update(['objectjenisdiagnosafk' => 7]);
                            $transStatus = true;
                        } catch (\Exception $e) {
                            $transStatus = false;
                            $transMessage = $e->getMessage();
                        }
                    }
                }
                

                
                
            }

            if(isset($request['diagnosa']['norec_ddp']) && $request['diagnosa']['norec_ddp']  != ''){
                $pd = DB::table('pasiendaftar_t as pd')
                ->join('antrianpasiendiperiksa_t as apd','apd.noregistrasifk','=','pd.norec')
                ->select('pd.noregistrasi')
                ->where('apd.norec',$data1->noregistrasifk)
                ->first();
    
                $dataDiagnosa = \DB::table('detaildiagnosapasien_t as dp')
                ->join('diagnosa_m as dg', 'dg.id', '=', 'dp.objectdiagnosafk')
                ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'dp.noregistrasifk')
                ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                ->select('dg.kddiagnosa','pd.norec')
    //            ->where('apd.noregistrasifk',$data[$i]->norec)
                ->wherein('dp.objectjenisdiagnosafk',array(7,8))
                // ->where('pd.tglregistrasi', '>=', $filter['tglAwal'])
                // ->where('pd.tglregistrasi', '<=', $filter['tglAkhir'])
                ->where('pd.kdprofile',$kdProfile)
                ->where('pd.noregistrasi',$pd->noregistrasi)
                ->orderBy('dp.objectjenisdiagnosafk', 'asc')->get();
                
                $dtdt1 = '';
                foreach ($dataDiagnosa as $item2){
                    $dtdt1 = $dtdt1 . '#' .  $item2->kddiagnosa;
                }
               
                try{
                    $updatePd =  PasienDaftar::where('noregistrasi', $pd->noregistrasi)
                    ->update([
                            'icd10' => $dtdt1 == '' ? null : $dtdt1,
                        ]
                    );
                    $transStatus = 'true';
                } catch (\Exception $e) {
                    $transStatus = 'false';
                    $transMessage = "-";
                }
            }
          
        }
        if ($transStatus=='true')
        {    DB::commit();
            $transMessage = "Data Terhapus";
        }
        else{
            DB::rollBack();
            $transMessage = "Data Gagal Dihapus";
        }

        return $this->setStatusCode(201)->respond([], $transMessage);
    }


    public function getDiagnosaPasienByNoreg(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $inacbg = [];
        $emr = [];
        $dtdt = '';
        $jd_id = '';
        $diagnosaawal='';
        $data = \DB::table('pasiendaftar_t as pd')
            ->select('dg.id', 'pd.noregistrasi', 'pd.tglregistrasi', 'apd.objectruanganfk', 'ru.namaruangan', 'apd.norec as norec_apd',
                'ddp.objectdiagnosafk', 'dg.kddiagnosa', 'dg.namadiagnosa', 'ddp.objectjenisdiagnosafk', 'jd.id as jd_id',
                'jd.jenisdiagnosa', 'dp.norec as norec_diagnosapasien', 'ddp.norec as norec_detaildpasien',
                'dp.ketdiagnosis', 'ddp.keterangan','ddp.tglinputdiagnosa','pg.namalengkap')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('diagnosapasien_t as dp', 'dp.noregistrasifk', '=', 'apd.norec')
            ->join('detaildiagnosapasien_t as ddp', 'ddp.objectdiagnosapasienfk', '=', 'dp.norec')
            ->leftJoin('diagnosa_m as dg', 'dg.id', '=', 'ddp.objectdiagnosafk')
            ->leftJoin('jenisdiagnosa_m as jd', 'jd.id', '=', 'ddp.objectjenisdiagnosafk')
            ->leftjoin('pegawai_m as pg','pg.id','=','ddp.objectpegawaifk')
            ->where('pd.kdprofile', (int)$kdProfile);

        if (isset($request['noReg']) && $request['noReg'] != "" && $request['noReg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $request['noReg']);
        };
        $data = $data->whereIn('jd.id', [1,2,5,12,13])->orderBy('jd.id', 'asc')->get();

        if (isset($request['inacbg']) && $request['inacbg'] == 'true') {
            $inacbg = \DB::table('pasiendaftar_t as pd')
            ->select('dg.id', 'pd.noregistrasi', 'pd.tglregistrasi', 'apd.objectruanganfk', 'ru.namaruangan', 'apd.norec as norec_apd',
                'ddp.objectdiagnosafk', 'dg.kddiagnosa', 'dg.namadiagnosa', 'ddp.objectjenisdiagnosafk', 'jd.id as jd_id',
                'jd.jenisdiagnosa' ,'ddp.norec as norec_detaildpasien',
                'ddp.keterangan','ddp.tglinputdiagnosa','pg.namalengkap','dg2.im as is_im')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            // ->join('diagnosapasien_t as dp', 'dp.noregistrasifk', '=', 'apd.norec')
            ->join('detaildiagnosapasien_t as ddp', 'ddp.noregistrasifk', '=', 'apd.norec')
            ->leftJoin('diagnosa_m as dg', 'dg.id', '=', 'ddp.objectdiagnosafk')
            ->leftJoin('diagnosaim_m as dg2', 'dg2.kddiagnosa', '=', 'dg.kddiagnosa')
            ->leftJoin('jenisdiagnosa_m as jd', 'jd.id', '=', 'ddp.objectjenisdiagnosafk')
            ->leftjoin('pegawai_m as pg','pg.id','=','ddp.objectpegawaifk')
            ->where('pd.kdprofile', (int)$kdProfile)
            ->where('pd.noregistrasi', '=', $request['noReg'])
            ->whereIn('jd.id', [17,18])
            ->orderBy('jd.id', 'asc')->get();
            foreach ($inacbg as $ina) {
                $dtdt = $dtdt . '#' .  $ina->kddiagnosa;
            }

        }
        if (isset($request['emr']) && $request['emr'] == 'true') {
            if (isset($request['jd_id'])) {
                $jd_id = (int)$request['jd_id'];
                $emr = \DB::table('pasiendaftar_t as pd')
                ->select('dg.id', 'pd.noregistrasi', 'pd.tglregistrasi', 'apd.objectruanganfk', 'ru.namaruangan', 'apd.norec as norec_apd',
                    'ddp.objectdiagnosafk', 'dg.kddiagnosa', 'dg.namadiagnosa', 'ddp.objectjenisdiagnosafk', 'jd.id as jd_id',
                    'jd.jenisdiagnosa', 'dp.norec as norec_diagnosapasien', 'ddp.norec as norec_detaildpasien',
                    'dp.ketdiagnosis', 'ddp.keterangan','ddp.tglinputdiagnosa','pg.namalengkap')
                ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                ->join('diagnosapasien_t as dp', 'dp.noregistrasifk', '=', 'apd.norec')
                ->join('detaildiagnosapasien_t as ddp', 'ddp.objectdiagnosapasienfk', '=', 'dp.norec')
                ->leftJoin('diagnosa_m as dg', 'dg.id', '=', 'ddp.objectdiagnosafk')
                ->leftJoin('jenisdiagnosa_m as jd', 'jd.id', '=', 'ddp.objectjenisdiagnosafk')
                ->leftjoin('pegawai_m as pg','pg.id','=','ddp.objectpegawaifk')
                ->where('pd.kdprofile', (int)$kdProfile)
                ->where('pd.noregistrasi', '=', $request['noReg'])
                ->where('ru.objectdepartemenfk',$request['depid'])
                ->whereIn('jd.id', [$jd_id])
                ->orderBy('jd.id', 'asc')->get();
                
            } else {
               
                    $emr = \DB::table('pasiendaftar_t as pd')
               ->select('dg.id', 'pd.noregistrasi', 'pd.tglregistrasi', 'apd.objectruanganfk', 'ru.namaruangan', 'apd.norec as norec_apd',
                   'ddp.objectdiagnosafk', 'dg.kddiagnosa', 'dg.namadiagnosa', 'ddp.objectjenisdiagnosafk', 'jd.id as jd_id',
                   'jd.jenisdiagnosa', 'dp.norec as norec_diagnosapasien', 'ddp.norec as norec_detaildpasien',
                   'dp.ketdiagnosis', 'ddp.keterangan','ddp.tglinputdiagnosa','pg.namalengkap')
               ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
               ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
               ->join('diagnosapasien_t as dp', 'dp.noregistrasifk', '=', 'apd.norec')
               ->join('detaildiagnosapasien_t as ddp', 'ddp.objectdiagnosapasienfk', '=', 'dp.norec')
               ->leftJoin('diagnosa_m as dg', 'dg.id', '=', 'ddp.objectdiagnosafk')
               ->leftJoin('jenisdiagnosa_m as jd', 'jd.id', '=', 'ddp.objectjenisdiagnosafk')
               ->leftjoin('pegawai_m as pg','pg.id','=','ddp.objectpegawaifk')
               ->where('pd.kdprofile', (int)$kdProfile)
               ->where('pd.noregistrasi', '=', $request['noReg'])
               ->whereIn('jd.id', [5])
               ->orderBy('jd.id', 'asc')->get();
               
            }

            foreach ($emr as $kode) {
                $diagnosaawal = $diagnosaawal.$kode->kddiagnosa. '-' .$kode->namadiagnosa.', ';
            }

            $jd_id = $emr[0]->jd_id;
           
        }

         
           
        
        $d = [];
        $i = 0;
       
        foreach ($data as $item){
            // if ($item->jd_id == 7 || $item->jd_id == 8 ){
            //     $dtdt = $dtdt . '#' .  $item->kddiagnosa;
            // }
            if ($item->jd_id == 1 || $item->jd_id == 2) {
               $d[$i]['id_diagnosa'] =   $item->id;
               $d[$i]['jd_id'] =   $item->jd_id;
               $d[$i]['kdNama'] =  $item->kddiagnosa . ' - ' .$item->namadiagnosa;
            }
            $i++;
        }
      
        $icd10 =  substr($dtdt,1,strlen($dtdt)-1);
    
        $icd10unu = '';
       $dataunu = [];
        if ($request['unu']== "true") {
            $dataunu = \DB::table('pasiendaftar_t as pd')
            ->select('dg.id', 'pd.noregistrasi', 'pd.tglregistrasi', 'apd.objectruanganfk', 'ru.namaruangan', 'apd.norec as norec_apd',
                'ddp.objectdiagnosafk', 'dg.kddiagnosa', 'dg.namadiagnosa', 'ddp.objectjenisdiagnosafk',
                'jd.jenisdiagnosa', 'dp.norec as norec_diagnosapasien', 'ddp.norec as norec_detaildpasien',
                'dp.ketdiagnosis', 'ddp.keterangan','ddp.tglinputdiagnosa','pg.namalengkap')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('diagnosapasien_t as dp', 'dp.noregistrasifk', '=', 'apd.norec')
            ->join('detaildiagnosapasien_t as ddp', 'ddp.objectdiagnosapasienfk', '=', 'dp.norec')
            ->leftJoin('diagnosa_m as dg', 'dg.id', '=', 'ddp.objectdiagnosafk')
            ->leftJoin('jenisdiagnosa_m as jd', 'jd.id', '=', 'ddp.objectjenisdiagnosafk')
            ->leftjoin('pegawai_m as pg','pg.id','=','ddp.objectpegawaifk')
            ->where('pd.kdprofile', (int)$kdProfile)
            ->whereIn('jd.id', [10,11]);

            if (isset($request['noReg']) && $request['noReg'] != "" && $request['noReg'] != "undefined") {
                $dataunu = $dataunu->where('pd.noregistrasi', '=', $request['noReg']);
            };
            $dataunu = $dataunu->get();

            $dt = '';
            foreach ($dataunu as $item){
               
                $dt = $dt . '#' .  $item->kddiagnosa;
                
            }
            $icd10unu =  substr($dt,1,strlen($dt)-1);
            if ($dt == null) {
                $icd10unu = $icd10 ;
            } else{
                $icd10unu;
            }
        }
       

        $result = array(
            'datas' => $data,
            'icd10' => $icd10,
            'd' => $d,
            'inacbg' => $inacbg,
            'icd10unu' => $icd10unu,
            'dataunu' => $dataunu,
            'dgemr' => $emr,
            'semptenan' => $diagnosaawal,
            'jd_id' => $jd_id,
            'message' => 'Cepot',
        );
        return $this->respond($result);
    }

    public function getDokters(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $dataLogin = $request->all();
        $dataDokters = \DB::table('pegawai_m as p')
            ->select('p.id', 'p.namalengkap')
            ->where('p.statusenabled', true)
            ->where('p.objectjenispegawaifk', 1)
            ->where('p.kdprofile', (int)$kdProfile)
            ->orderBy('p.namalengkap')
            ->get();

        $result = array(
            'dokter' => $dataDokters,
            'message' => 'ramdanegie',
        );

        return $this->respond($result);
    }

    public function getPelayananPasienNonDetail(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $data = \DB::table('pelayananpasien_t as pp')
            ->join('antrianpasiendiperiksa_t as apd ', 'pp.noregistrasifk', '=', 'apd.norec')
            ->join('pasiendaftar_t as pd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('produk_m as pr', 'pp.produkfk', '=', 'pr.id')
            ->leftjoin('detailjenisproduk_m as djp', 'djp.id', '=', 'pr.objectdetailjenisprodukfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->select(
                'pp.norec as noRec',
                'pp.strukfk as noRecStruk',
                'pp.tglpelayanan as tglPelayanan',
                'pr.id as produkId',
                'pp.hargasatuan as hargaSatuan',
                'pp.harganetto as hargaNetto',
                'pr.namaproduk as namaProduk',
                'djp.detailjenisproduk as detailJenisProduk',
                'pp.jumlah',
                'ru.namaruangan as namaRuangan'
            )
            ->where('pd.kdprofile', (int)$kdProfile)
            ->where('pd.norec', $request['norec_pd']);
        $data = $data->get();

        $result = array(
            'data' => $data,
            'message' => 'inhuman',
        );

        return $this->respond($result);
    }
    public function getJenisPelayananByNorecPd(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $norec_pd = $request['norec_pd'];
        $data = \DB::table('pasiendaftar_t as pd')
            ->select('pd.*')
            ->where('pd.norec', $norec_pd)
            ->where('pd.kdprofile', (int)$kdProfile)
            ->first();


        return $this->respond($data);
    }
    public function getStatusClosePeriksa(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $noregistrasi = $request['noregistrasi'];
        $data  = PasienDaftar::where('noregistrasi', $noregistrasi)->where('kdprofile', (int)$kdProfile)->first();
        $status = false;
        $tgl = null;
        if (!empty($data) && $data->isclosing != null) {
            $status = $data->isclosing;
            $tgl = $data->tglclosing;
        }
        $result = array(
            'status' => $status,
            'tglclosing' => $tgl,
            'message' => 'ramdan@epic',
        );
        return $this->respond($result);
    }
    public function getComboTindakanPendaftaran(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $detailLog = $request->all();
        $jenisPelaksana = \DB::table('jenispetugaspelaksana_m as jpp')
            ->where('jpp.statusenabled', true)
            ->orderBy('jpp.jenispetugaspe')
            ->get();
        $pegawai = \DB::table('pegawai_m as pg')
            ->where('pg.statusenabled', true)
            ->where('pg.kdprofile', (int)$kdProfile)
            ->orderBy('pg.namalengkap')
            ->get();

        $dataTarifAdminCito = \DB::table('settingdatafixed_m as rt')
            ->select('rt.namafield', 'rt.nilaifield')
            ->where('rt.statusenabled', true)
            ->where('rt.namafield', 'tarifadmincito')
            ->orderBy('rt.id')
            ->first();

        $result = array(
            'detaillogin' => $detailLog,
            'jenispelaksana' => $jenisPelaksana,
            'pegawai' => $pegawai,
            'tarifcito' => $dataTarifAdminCito,
            'message' => 'ramdanegie',
        );

        return $this->respond($result);
    }

    public function getDaftarRegistrasiPasienOperator(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $filter = $request->all();
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            //            ->leftjoin('antrianpasiendiperiksa_t as apd','apd.noregistrasifk','=','pd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftjoin('emrpasien_t as ept', 'ept.noregistrasifk', '=', 'pd.noregistrasi')
            ->join('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->join('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
            ->join('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            ->leftjoin('batalregistrasi_t as br', 'br.pasiendaftarfk', '=', 'pd.norec')
            ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
            ->leftJoin('strukpelayanan_t as sp', 'sp.norec', '=', 'pd.nostruklastfk')
            ->leftJoin('strukbuktipenerimaan_t as sbm', 'sbm.norec', '=', 'pd.nosbmlastfk')
            //            ->leftjoin('loginuser_s as lu', 'lu.id', '=', 'sbm.objectpegawaipenerimafk')
            //            ->leftjoin('pegawai_m as pgs', 'pgs.id', '=', 'lu.objectpegawaifk')
            ->leftjoin('rekanan_m as rek', 'rek.id', '=', 'pd.objectrekananfk')
            ->leftjoin('asuransipasien_m as asu', 'pa.objectasuransipasienfk', '=', 'asu.id')
            ->leftjoin('kelas_m as klstg', 'klstg.id', '=', 'asu.objectkelasdijaminfk')
            //            ->leftJoin('statuscovid_m as sc', 'sc.id', '=', 'pd.statuscovidfk')
            ->leftJoin('antrianpasiendiperiksa_t as apd', function ($join) {
                $join->on('apd.noregistrasifk', '=', 'pd.norec');
                $join->on('apd.objectruanganfk', '=', 'pd.objectruanganlastfk');
                $join->whereNull('apd.objectruanganasalfk');
            })
            ->leftjoin('asalrujukan_m as ar', 'ar.id', '=', 'apd.objectasalrujukanfk')
            ->leftJoin('detaildiagnosapasien_t as ddt', function ($join) {
                $join->on('ddt.noregistrasifk', '=', 'apd.norec');
                $join->where('ddt.objectjenisdiagnosafk', '=', 1);
            })
            ->leftJOIN(
                'jenispelayanan_m as jpl',
                'pd.jenispelayanan',
                '=',
                DB::raw('cast(jpl.id as text)')
            )
            // ->leftjoin('jenispelayanan_m as jpl', 'jpl.id', '=', 'pd.jenispelayanan')
            ->leftJOIN('jeniskelamin_m as jks', 'jks.id', '=', 'ps.objectjeniskelaminfk')
            ->leftjoin('identifikasipasien_t as it', 'pd.norec', '=', 'it.noregistrasifk')
            ->distinct()
            ->select(
                'ps.ihs_number',
                'ps.noidentitas',
                'pd.isanalis',
                'pd.isrmlengkap',
                'pd.isverifikasidpjp',
                'ps.isinaktif',
                'pd.norec',
                'pd.statusenabled',
                'ps.sidik_jari',
                'ept.kdprofile',
                'pd.tglregistrasi',
                'ps.nocm',
                'pd.nocmfk',
                'pd.noregistrasi',
                'ru.namaruangan',
                'ps.namapasien',
                'kp.kelompokpasien',
                'rek.namarekanan',
                'pg.namalengkap as namadokter',
                'pd.tglpulang',
                'pd.statuspasien',
                'pa.norec as norec_pa',
                'pa.objectasuransipasienfk',
                'pd.objectpegawaifk as pgid',
                'pd.objectruanganlastfk',
                'pa.nosep as nosep',
                'br.norec as norec_br',
                'pd.nostruklastfk',
                'klstg.namakelas as kelasditanggung',
                'kls.namakelas',
                'ps.tgllahir',
                'ru.objectdepartemenfk',
                'pd.objectkelasfk',
                'dept.id as deptid',
                'pa.ppkrujukan',
                'ddt.objectdiagnosafk',
                'jpl.jenispelayanan',
                'pa.objectdiagnosafk as iddiagnosabpjs',
                'ps.nobpjs',
                'jks.jeniskelamin',
                'ps.nohp',
                'pa.statuskunjungan',
                'pa.flagprocedure',
                'pa.poliasalkode',
                'pa.tglcreate',
                'asu.nmprovider',
                'ar.asalrujukan',
                'pd.tglcheckin',
                DB::raw('coalesce(it.qtytracer,0) as qtytracer'),
                DB::raw("pd.ismobilejkn,
                case when pd.ismobilejkn = true then 
                (case when pd.ischeckin = true  then 'Sudah Checkin' else 'Belum Checkin' end) else '-' end as statusjkn,
                case when pd.ismobilejkn = true then pd.statusschedule else '-' end as statusschedule")
            )
            ->whereNull('br.norec')
            ->where('pd.statusenabled', true)
            ->where('pd.kdprofile', (int)$kdProfile);

        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '<=', $filter['tglAkhir']);
        }
        if (isset($filter['deptId']) && $filter['deptId'] != "" && $filter['deptId'] != "undefined") {
            $data = $data->where('dept.id', '=', $filter['deptId']);
        }
        if (isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined") {
            $data = $data->where('ru.id', '=', $filter['ruangId']);
        }
        if (isset($filter['kelId']) && $filter['kelId'] != "" && $filter['kelId'] != "undefined") {
            $data = $data->where('kp.id', '=', $filter['kelId']);
        }
        if (isset($filter['dokId']) && $filter['dokId'] != "" && $filter['dokId'] != "undefined") {
            $data = $data->where('pg.id', '=', $filter['dokId']);
        }
        if (isset($filter['sttts']) && $filter['sttts'] != "" && $filter['sttts'] != "undefined") {
            $data = $data->where('pd.statuspasien', '=', $filter['sttts']);
        }
        if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $filter['noreg']);
        }
        if (isset($filter['norm']) && $filter['norm'] != "" && $filter['norm'] != "undefined") {
            $data = $data->where('ps.nocm', 'ilike', '%' . $filter['norm'] . '%');
        }
        if (isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $data = $data->where('ps.namapasien', 'ilike', '%' . $filter['nama'] . '%');
        }
        if (isset($filter['bpjs']) && $filter['bpjs'] != "" && $filter['bpjs'] != "undefined" && $filter['bpjs'] == 1) {
            $data = $data->whereIn('kp.id', [2, 21, 22, 24, 25]);
        }

        if (isset($filter['jmlRows']) && $filter['jmlRows'] != "" && $filter['jmlRows'] != "undefined") {
            $data = $data->take($filter['jmlRows']);
        }
        if ((isset($filter['isBlmInputSep']) && $filter['isBlmInputSep'] != "" && $filter['isBlmInputSep'] != "undefined" && $filter['isBlmInputSep'] != 'false')
            && (isset($filter['isSepTdkSesuai']) && $filter['isSepTdkSesuai'] != "" && $filter['isSepTdkSesuai'] != "undefined" && $filter['isSepTdkSesuai'] != 'false')
        ) {
            $data = $data->whereIn('kp.id', [10, 2, 4]);
            $data = $data->where(function ($query) {
                $query->where('pa.nosep', null)
                    ->Orwhere('pa.nosep', "")
                    ->Orwhere(function ($query2) {
                        $query2->where('dept.id', 16)
                            ->where('pa.ppkrujukan', '<>', "1202R003");
                    });
            });
        } elseif (isset($filter['isBlmInputSep']) && $filter['isBlmInputSep'] != "" && $filter['isBlmInputSep'] != "undefined" && $filter['isBlmInputSep'] != 'false') {
            $data = $data->whereIn('kp.id', [10, 2, 4]);
            $data = $data->where(function ($query) {
                $query->where('pa.nosep', null)
                    ->Orwhere('pa.nosep', "");
            });
        } elseif (isset($filter['isSepTdkSesuai']) && $filter['isSepTdkSesuai'] != "" && $filter['isSepTdkSesuai'] != "undefined" && $filter['isSepTdkSesuai'] != 'false') {
            $data = $data->whereIn('kp.id', [10, 2, 4]);
            $data = $data->where('dept.id', 16);
            $data = $data->where(function ($query) {
                $query->where('pa.nosep', '<>', null)
                    ->where('pa.nosep', '<>', "");
            });

            $data = $data->where('pa.ppkrujukan', '<>', "1202R003");
        }
        if (isset($filter['jenisPel']) && $filter['jenisPel'] != "" && $filter['jenisPel'] != "undefined") {
            $data = $data->where('pd.jenispelayanan', '=', $filter['jenisPel']);
        }
        if (isset($filter['arId']) && $filter['arId'] != "" && $filter['arId'] != "undefined") {
            $data = $data->where('ar.id', '=', $filter['arId']);
        }

        $data = $data->orderBy('pd.noregistrasi');
        //        $data = $data->groupBy('pd.norec', 'pd.statusenabled', 'pd.tglregistrasi', 'ps.nocm', 'pd.nocmfk', 'pd.noregistrasi',
        //            'ru.namaruangan', 'ps.namapasien',
        //            'kp.kelompokpasien', 'rek.namarekanan', 'pg.namalengkap', 'pd.tglpulang', 'pd.statuspasien',
        //            'pa.nosep', 'br.norec', 'pa.norec', 'pa.objectasuransipasienfk', 'pd.objectpegawaifk', 'pd.objectruanganlastfk',
        //            'pd.nostruklastfk', 'ps.tgllahir');
        //        $data = $data->take($filter['jmlRows']);
        $data = $data->get();

        $data2 = [];
        foreach ($data as $key => $value) {
            //           $diagnosa = \DB::table('antrianpasiendiperiksa_t AS apd')
            //            ->join('detaildiagnosapasien_t AS ddp','ddp.noregistrasifk','=','apd.norec')
            //            ->where('ddp.objectjenisdiagnosafk',1)
            //            ->where('apd.noregistrasifk',$value->norec)
            //            ->where('apd.kdprofile', (int)$kdProfile)
            //            ->first();
            if ($value->isanalis == true) {
                $value->isanalis = '✔';
            }
            if ($value->isrmlengkap == true) {
                $value->isrmlengkap = '✔';
            }
            if ($value->isinaktif == true) {
                $value->isinaktif = '✔';
            }

            if ($value->objectdiagnosafk != null) {
                $value->isdiagnosis = true;
            } else {
                $value->isdiagnosis = false;
            }
            $data2[] =  $value;
            //
            //            // $i = $i+1;
            //        }
            //
            //        for ($i = count($data2) - 1; $i >= 0; $i--) {
            //            if (isset($filter['isnotdiagnosis']) && $filter['isnotdiagnosis'] != "" && $filter['isnotdiagnosis'] != "undefined" && $filter['isnotdiagnosis'] != 'false' && $data2[$i]->isdiagnosis == true){
            //                 array_splice($data2,$i,1);
            //
            //            }
        }
        return $this->respond($data2);
    }

    public function getDataComboOperator(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $dataLogin = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->join('pegawai_m as pg', 'pg.id', '=', 'lu.objectpegawaifk')
            ->select('lu.objectpegawaifk', 'pg.namalengkap')
            ->where('lu.id', $dataLogin['userData']['id'])
            ->where('lu.kdprofile', (int)$kdProfile)
            ->first();

        $dataInstalasi = \DB::table('departemen_m as dp')
            //            ->whereIn('dp.id', array(3, 14, 16, 17, 18, 19, 24, 25, 26, 27, 28, 35))
            ->where('dp.statusenabled', true)
            ->where('dp.kdprofile', (int)$kdProfile)
            ->orderBy('dp.namadepartemen')
            ->get();

        $dataRuangan = \DB::table('ruangan_m as ru')
            ->where('ru.statusenabled', true)
            ->where('ru.kdprofile', (int)$kdProfile)
            ->orderBy('ru.namaruangan')
            ->get();

        $dept = \DB::table('departemen_m as dept')
            ->where('dept.id', '18')
            ->where('dept.statusenabled', true)
            ->where('dept.kdprofile', (int)$kdProfile)
            ->orderBy('dept.namadepartemen')
            ->get();

        $deptRajalInap = \DB::table('departemen_m as dept')
            ->whereIn('dept.id', [18, 16])
            ->where('dept.statusenabled', true)
            ->where('dept.kdprofile', (int)$kdProfile)
            ->orderBy('dept.namadepartemen')
            ->get();

        $ruanganRi = \DB::table('ruangan_m as ru')
            ->wherein('ru.objectdepartemenfk', ['18', '28'])
            ->where('ru.statusenabled', true)
            ->where('ru.kdprofile', (int)$kdProfile)
            ->orderBy('ru.namaruangan')
            ->get();

        $dataDokter = \DB::table('pegawai_m as ru')
            ->where('ru.statusenabled', true)
            ->where('ru.objectjenispegawaifk', 1)
            ->where('ru.kdprofile', (int)$kdProfile)
            ->orderBy('ru.namalengkap')
            ->get();
        foreach ($dataInstalasi as $item) {
            $detail = [];
            foreach ($dataRuangan as $item2) {
                if ($item->id == $item2->objectdepartemenfk) {
                    $detail[] = array(
                        'id' => $item2->id,
                        'ruangan' => $item2->namaruangan,
                    );
                }
            }

            $dataDepartemen[] = array(
                'id' => $item->id,
                'departemen' => $item->namadepartemen,
                'ruangan' => $detail,
            );
        }
        $dataKelompok = \DB::table('kelompokpasien_m as kp')
            ->select('kp.id', 'kp.kelompokpasien')
            ->where('kp.statusenabled', true)
            ->orderBy('kp.kelompokpasien')
            ->get();

        $dataKelas = \DB::table('kelas_m as kl')
            ->select('kl.id', 'kl.reportdisplay')
            ->where('kl.statusenabled', true)
            ->orderBy('kl.reportdisplay')
            ->get();

        $pembatalan = \DB::table('pembatal_m as p')
            ->select('p.id', 'p.name')
            ->where('p.statusenabled', true)
            ->orderBy('p.name')
            ->get();

        $jenisDiagnosa = \DB::table('jenisdiagnosa_m as jd')
            ->select('jd.id', 'jd.jenisdiagnosa')
            //            ->where('jd.id',5)
            ->where('jd.statusenabled', true)
            ->orderBy('jd.jenisdiagnosa')
            ->get();

        //        $kdeDiagnosa = \DB::table('diagnosa_m as dm')
        //            ->select('dm.id', 'dm.kddiagnosa')
        //            ->where('dm.statusenabled', true)
        //            ->orderBy('dm.id')
        //            ->get();
        //
        //        $Diagnosa = \DB::table('diagnosa_m as dm')
        //            ->select('dm.id', 'dm.namadiagnosa')
        //            ->where('dm.statusenabled', true)
        //            ->orderBy('dm.id')
        //            ->get();

        $KelompokKerjaHead = \DB::table('kelompokkerjahead_m as dm')
            ->select('dm.id', 'dm.kelompokkerjahead')
            ->where('dm.statusenabled', true)
            ->where('dm.kdprofile', (int)$kdProfile)
            ->orderBy('dm.id')
            ->get();

        $KelompokKerja = \DB::table('kelompokkerja_m as dm')
            ->select('dm.id', 'dm.kelompokkerja')
            ->where('dm.statusenabled', true)
            ->where('dm.kdprofile', (int)$kdProfile)
            ->orderBy('dm.id')
            ->get();

        $dataJenisKelamin = \DB::table('jeniskelamin_m as jk')
            ->where('jk.statusenabled', true)
            ->orderBy('jk.jeniskelamin')
            ->get();

        $jenisPelayanan = \DB::table('jenispelayanan_m as jp')
            ->select('jp.kodeinternal as id', 'jp.jenispelayanan')
            ->where('jp.statusenabled', true)
            ->where('jp.kdprofile', $kdProfile)
            ->orderBy('jp.jenispelayanan')
            ->get();
        $produkradiologi = DB::table('mapruangantoproduk_m as mpr')
            ->join('produk_m as pr', 'pr.id', '=', 'mpr.objectprodukfk')
            ->select('pr.namaproduk', 'pr.id')
            ->where('mpr.kdprofile', 30)->where('mpr.statusenabled', true)
            ->where('pr.kdprofile', 30)->where('pr.statusenabled', true)
            ->where('mpr.objectruanganfk', 576)->get();

        $result = array(
            'departemen' => $dataDepartemen,
            'kelompokpasien' => $dataKelompok,
            'dokter' => $dataDokter,
            'datalogin' => $dataLogin,
            'kelas' => $dataKelas,
            'dept' => $dept,
            'ruanganRi' => $ruanganRi,
            'deptrirj' => $deptRajalInap,
            'ruanganall' => $dataRuangan,
            'pembatalan' => $pembatalan,
            'jenisdiagnosa' => $jenisDiagnosa,
            //            'diagnosa' => $Diagnosa,
            //            'kddiagnosa' => $kdeDiagnosa,
            'kelompokkerjahead' => $KelompokKerjaHead,
            'kelompokkerja' => $KelompokKerja,
            'pegawaiLogin' => $dataPegawai->namalengkap,
            'jeniskelamin' => $dataJenisKelamin,
            'jenispelayanan' => $jenisPelayanan,
            'produkradiologi' => $produkradiologi,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }
    public function updateTanggalPulang(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        DB::beginTransaction();
        $tglAyeuna = date('Y-m-d H:i:s');
        $dataLogin = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id', $dataLogin['userData']['id'])
            ->first();
        $pasienDaftar = PasienDaftar::where('noregistrasi', $request['noregistrasi'])->where('kdprofile', (int)$kdProfile)->first();
        try {
            $data = $dataAsalRujukan = \DB::table('pasiendaftar_t as pd')
                ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
                ->leftjoin('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
                ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
                ->select('ru.objectdepartemenfk')
                ->where('pd.noregistrasi', $request['noregistrasi'])
                ->where('pd.kdprofile', (int)$kdProfile)
                //                ->whereIn('ru.objectdepartemenfk',array(16,17,35))
                ->first();

            $stt = false;
            if ($data->objectdepartemenfk == 16) {
                $stt = true;
            }
            if ($data->objectdepartemenfk == 17) {
                $stt = true;
            }
            if ($data->objectdepartemenfk == 35) {
                $stt = true;
            }
            if ($data->objectdepartemenfk == 26) {
                $stt = true;
            }

            if ($stt == false) {
                $ddddd = [];
                $transMessage = "Hanya Pasien Rawat Inap yang Bisa Batal Pulang!";
            } else {
                $antrian = AntrianPasienDiperiksa::where('noregistrasifk', $pasienDaftar->norec)
                    ->where('objectruanganfk', $pasienDaftar->objectruanganlastfk)
                    ->where('kdprofile', (int)$kdProfile)
                    ->orderBy('tglmasuk', 'desc')
                    ->first();
                $registrasiPelPas = RegistrasiPelayananPasien::where('noregistrasifk', $pasienDaftar->norec)
                    ->where('objectruanganfk', $pasienDaftar->objectruanganlastfk)
                    ->where('kdprofile', (int)$kdProfile)
                    ->orderBy('tglmasuk', 'desc')
                    ->first();

                if ($request['tglpulang'] == 'null') {
                    $ddddd = PasienDaftar::where('noregistrasi', $request['noregistrasi'])
                        ->where('kdprofile', (int)$kdProfile)
                        ->update(
                            [
                                'tglpulang' => null
                            ]
                            //                        'tglpulang' => $request['tglpulang']]
                        );
                    $apd = AntrianPasienDiperiksa::where('norec', $antrian->norec)
                        ->where('kdprofile', (int)$kdProfile)
                        ->update(['tglkeluar' => null]);
                    $rpp = RegistrasiPelayananPasien::where('norec', $registrasiPelPas->norec)
                        ->where('kdprofile', (int)$kdProfile)
                        ->update(['tglkeluar' => null]);
                } else {
                    $ddddd = PasienDaftar::where('noregistrasi', $request['noregistrasi'])
                        ->where('kdprofile', (int)$kdProfile)
                        ->update(
                            [
                                'tglpulang' => $request['tglpulang']
                            ]
                        );

                    $apd = AntrianPasienDiperiksa::where('norec', $antrian->norec)
                        ->where('kdprofile', (int)$kdProfile)
                        ->update(['tglkeluar' => null]);
                    $rpp = RegistrasiPelayananPasien::where('norec', $registrasiPelPas->norec)
                        ->where('kdprofile', (int)$kdProfile)
                        ->update(['tglkeluar' => null]);
                    //## Logging User
                    $newId = LoggingUser::max('id');
                    $newId = $newId + 1;
                    $logUser = new LoggingUser();
                    $logUser->id = $newId;
                    $logUser->norec = $logUser->generateNewId();
                    $logUser->kdprofile = (int)$kdProfile;
                    $logUser->statusenabled = true;
                    $logUser->jenislog = 'Batal Pulang Pasien';
                    $logUser->noreff = $request['noregistrasi'];
                    $logUser->referensi = 'noregistrasi Pasien';
                    $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
                    $logUser->tanggal = $tglAyeuna;
                    $logUser->save();
                }
                $transMessage = "Sukses";
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {

            DB::commit();
            $result = array(
                "status" => 201,
                //                "message" =>   $transMessae,
                "message" => $transMessage,
                "struk" => $ddddd, //$noResep,,//$noResep,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Simpan  Tanggal Pulang Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "struk" => $ddddd,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function updateNoSEP(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        DB::beginTransaction();
        $transStatus = 'true';
        try {

            $data2 = PemakaianAsuransi::where('noregistrasifk', $request['norec'])
                ->where('kdprofile', (int)$kdProfile)
                ->update([
                    'nokepesertaan' => $request['nokepesertaan'],
                    'nosep' => $request['nosep']
                ]);
            $transMessage = "Update Pemakaian Asuransi berhasil!";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Update Pemakaian Asuransi gagal";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getAPD(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $data = \DB::table('antrianpasiendiperiksa_t as apd')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->join('kelas_m as kls', 'kls.id', '=', 'apd.objectkelasfk')
            ->select(
                'apd.norec as norec_apd',
                'ps.nocm',
                'ps.id as nocmfk',
                'ps.namapasien',
                'pd.noregistrasi',
                'apd.objectruanganfk as id',
                'ru.objectdepartemenfk',
                'ru.namaruangan',
                'apd.tglregistrasi',
                'kls.namakelas',
                'apd.objectruanganasalfk'
            )
            ->where('pd.noregistrasi', $request['noregistrasi'])
            ->where('apd.objectruanganfk', $request['objectruanganlastfk'])
            ->where('pd.kdprofile', (int)$kdProfile)
            ->orderBy('pd.objectruanganlastfk')
            ->get();

        $result = array(
            'ruangan' => $data,
            'message' => 'er@epic',
        );
        return $this->respond($result);
    }
    public function getAccNumberRadiologi(Request $request)
    {
        $data = \DB::table('ris_order as ro')
            ->select('ro.*')
            ->where('ro.order_no', $request['noOrder']);

        $data = $data->get();

        $result = array(
            'data' => $data,
            'message' => 'er@epic',
        );
        return $this->respond($result);
    }

    public function saveMutasiPasien(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        DB::beginTransaction();


        if ($request['tglpulang'] != 'null') {
            $ddddd = PasienDaftar::where('norec', $request['noRecPasienDaftar'])
                ->update(
                    [
                        'tglpulang' => null,
                        'objectruanganlastfk' => $request['ruangan']['id'],
                        'objectkelompokpasienlastfk' => $request['kelompokPasien']['id'],
                        'objectpegawaifk' => $request['pegawai']['id'],
                        'objectkelasfk' => $request['kelas']['id'],
                        'nostruklastfk' => null,
                        'nosbmlastfk' => null,
                        'objectjeniskasusfk' => $request['jeniskasus']['id'],
                        'nokunjungan' =>  $request['kunjungan'],

                    ]
                );
            $ddddd = Pasien::where('id', $request['nocmfk'])
                ->update(
                    [
                        'nokunjunganterakhir' =>  $request['kunjungan'],

                    ]
                );
        }

        try {

            $countNoAntrian = AntrianPasienDiperiksa::where('objectruanganfk', $request['ruangan']['id'])
                ->where('tglregistrasi', '>=', $request['tglRegisDateOnly'] . ' 00:00')
                ->where('tglregistrasi', '<=', $request['tglRegisDateOnly'] . ' 23:59')
                ->count('norec');
            $noAntrian = $countNoAntrian + 1;

            $dataAPD = new AntrianPasienDiperiksa();
            //            $dataAPD->id = $newId;
            $dataAPD->kdprofile = $kdProfile;
            $dataAPD->statusenabled = true;
            $dataAPD->norec =  $dataAPD->generateNewId();
            $dataAPD->objectasalrujukanfk =  $request['asalRujukan']['id'];
            $dataAPD->objectkamarfk = $request['kamar']['id'];
            $dataAPD->objectkasuspenyakitfk = null;
            $dataAPD->objectkelasfk = $request['kelas']['id'];
            $dataAPD->noantrian = $noAntrian; //count tgl pasien perruanga
            $dataAPD->nobed = $request['nomorTempatTidur']['id'];
            //            $dataAPD->nomasuk = '';
            $dataAPD->noregistrasifk = $request['noRecPasienDaftar'];
            $dataAPD->objectpegawaifk = $request['pegawai']['id'];
            //            $dataAPD->prefixnoantrian = null;
            $dataAPD->objectruanganfk = $request['ruangan']['id'];
            $dataAPD->statusantrian = 0;
            $dataAPD->statuskunjungan = $request['statusPasien'];
            $dataAPD->statuspasien = 1;
            //            $dataAPD->statuspenyakit =null;
            //            $dataAPD->objectstrukorderfk = null;
            //            $dataAPD->objectstrukreturfk = null;
            $dataAPD->tglregistrasi =  $request['tglRegistrasi'];
            //            $dataAPD->tgldipanggildokter = null;
            //            $dataAPD->tgldipanggilsuster = null;
            $dataAPD->objectruanganasalfk = $request['objectruanganasalfk'];
            $dataAPD->tglkeluar = null;
            $dataAPD->tglmasuk = $request['tglRegistrasi'];
            $dataAPD->israwatgabung = null;

            $dataAPD->save();

            //update statusbed jadi Isi
            TempatTidur::where('id', $request['nomorTempatTidur']['id'])->update(['objectstatusbedfk' => 1]);

            $dataRPP = new RegistrasiPelayananPasien();
            $dataRPP->norec = $dataRPP->generateNewId();;
            $dataRPP->kdprofile = $kdProfile;
            $dataRPP->statusenabled = true;
            $dataRPP->objectasalrujukanfk = $request['asalRujukan']['id'];
            //            $dataRPP->objecthasiltriasefk =null;
            //            $dataRPP->israwatgabung = null;
            $dataRPP->objectkamarfk = $request['kamar']['id'];
            //            $dataRPP->objectkasuspenyakitfk = null;
            //            $dataRPP->kddokter = null;
            //            $dataRPP->kddokterperiksanext =  null;
            $dataRPP->objectkelasfk = $request['kelas']['id'];
            $dataRPP->objectkelaskamarfk = $request['kelas']['id'];
            //            $dataRPP->objectkelaskamarrencanafk =null;
            //            $dataRPP->objectkelaskamartujuanfk =null;
            //            $dataRPP->objectkelasrencanafk = null;
            //            $dataRPP->objectkelastujuanfk = null;
            $dataRPP->kdpenjaminpasien = 0;
            //            $dataRPP->objectkeadaanumumfk = null;
            $dataRPP->objectkelompokpasienfk = $request['kelompokPasien']['id'];
            //            $dataRPP->keteranganlainnyaperiksanext = null;
            $dataRPP->keteranganlainnyarencana = 'Mutasi Gawat Darurat';
            //            $dataRPP->kodenomorbuktiperjanjian = null;
            //            $dataRPP->objectkondisipasienfk = null;
            //            $dataRPP->namatempattujuan =null;
            //            $dataRPP->noantrian = null;
            $dataRPP->noantrianbydokter = 0;
            //            $dataRPP->nobed = null;
            //            $dataRPP->nobedtujuan =  null;
            $dataRPP->nocmfk = $request['pasien']['id'];
            $dataRPP->noregistrasifk = $request['noRecPasienDaftar'];
            //            $dataRPP->prefixnoantrian =  '1';
            $dataRPP->objectruanganasalfk = $request['objectruanganasalfk'];
            $dataRPP->objectruanganfk = $request['ruangan']['id'];
            $dataRPP->objectruanganperiksanextfk = $request['ruangan']['id'];
            //            $dataRPP->objectruanganrencanafk =  null;
            //            $dataRPP->objectruangantujuanfk =  null;
            $dataRPP->objectstatuskeluarfk = null;
            //            $dataRPP->objectstatuskeluarrencanafk =  null;
            //            $dataRPP->statuspasien =  0;
            $dataRPP->objecttempattidurfk = $request['nomorTempatTidur']['id'];
            //            $dataRPP->tglkeluar = null;
            //            $dataRPP->tglkeluarrencana = null;
            $dataRPP->tglmasuk = $request['tglRegistrasi'];
            //            $dataRPP->tglperiksanext = null;
            $dataRPP->tglpindah = $request['tglRegistrasi'];
            //                 $dataRPP->objecttransportasifk = null;
            //            $dataRPP->objectdetailkamarfk = null;

            $dataRPP->save();

            $noregis = PasienDaftar::select('noregistrasi')
                ->where('norec', $request['noRecPasienDaftar'])
                ->first();

            $namaRuang = Ruangan::select('namaruangan')
                ->where('id', $request['ruangan']['id'])
                ->first();

            if ($noregis) {
                $noregis = $noregis->noregistrasi;
                
                $emr_rm11 =DB::select(DB::raw("SELECT 
                    emrdp.*
                FROM
                    emrpasiend_t AS emrdp
                INNER JOIN emrpasien_t AS emrp ON emrp.noemr = emrdp.emrpasienfk
                INNER JOIN emr_t AS emr ON emr.id = emrdp.emrfk
                WHERE 
                        emrdp.kdprofile = $kdProfile and
                        emrdp.statusenabled = true and
                        emr.id = 3000434 and
                        emrp.noregistrasifk = '$noregis' "));

                if (count($emr_rm11) > 0) {
                    if($emr_rm11[0]->emrpasienfk){
                        // ruang wisma
                        $dataRm11 = new EMRPasienD();
                        $dataRm11->norec = $dataRm11->generateNewId();;
                        $dataRm11->kdprofile = $kdProfile;
                        $dataRm11->statusenabled = true;
                        $dataRm11->emrpasienfk = $emr_rm11[0]->emrpasienfk;
                        $dataRm11->value = $namaRuang->namaruangan;
                        $dataRm11->emrdfk = 3004560;
                        $dataRm11->emrfk = 3000434;
                        $dataRm11->pegawaifk = $emr_rm11[0]->pegawaifk;
                        $dataRm11->tgl = Carbon::now()->format('Y-m-d H:i:s.v');
                        $dataRm11->norec_apd = $emr_rm11[0]->norec_apd ;
                        $dataRm11->save();

                        // kelas dijamin
                        $dataRm11 = new EMRPasienD();
                        $dataRm11->norec = $dataRm11->generateNewId();;
                        $dataRm11->kdprofile = $kdProfile;
                        $dataRm11->statusenabled = true;
                        $dataRm11->emrpasienfk = $emr_rm11[0]->emrpasienfk;
                        $dataRm11->value = '1';
                        // vip
                        if ($request['kelas']['id'] == 4 || $request['kelas']['id'] == 5 || $request['kelas']['id'] == 7 || $request['kelas']['id'] == 8){ 
                        $dataRm11->emrdfk = 3004561;
                        // kelas 1
                        }else if ($request['kelas']['id'] == 3){
                        $dataRm11->emrdfk = 3004562;
                        // kelas 2
                        }else if ($request['kelas']['id'] == 2){
                        $dataRm11->emrdfk = 3004563;
                        // kelas 3
                        }else if ($request['kelas']['id'] == 1){
                        $dataRm11->emrdfk = 3004564;
                        }
                        $dataRm11->emrfk = 3000434;
                        $dataRm11->pegawaifk = $emr_rm11[0]->pegawaifk;
                        $dataRm11->tgl = Carbon::now()->format('Y-m-d H:i:s.v');
                        $dataRm11->norec_apd = $emr_rm11[0]->norec_apd ;
                        $dataRm11->save();


                        // tgl masuk
                        $dataRm11 = new EMRPasienD();
                        $dataRm11->norec = $dataRm11->generateNewId();;
                        $dataRm11->kdprofile = $kdProfile;
                        $dataRm11->statusenabled = true;
                        $dataRm11->emrpasienfk = $emr_rm11[0]->emrpasienfk;
                        $dataRm11->value = Carbon::parse($request['tglRegistrasi'])->format('Y-m-d H:i');
                        $dataRm11->emrdfk = 3004565;
                        $dataRm11->emrfk = 3000434;
                        $dataRm11->pegawaifk = $emr_rm11[0]->pegawaifk;
                        $dataRm11->tgl = Carbon::now()->format('Y-m-d H:i:s.v');
                        $dataRm11->norec_apd = $emr_rm11[0]->norec_apd ;
                        $dataRm11->save();
                    }
                }
            }


            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "SUCCESS";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'data' => $dataAPD,
                'as' => 'mythicramdan',
            );
        } else {
            $transMessage = "FAILED";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transStatus,
                'data' => $dataAPD,
                'as' => 'mythicramdan',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDaftarPasienBatal(Request $request)
    {
        $filter = $request->all();
        $data = \DB::table('batalregistrasi_t as br')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'br.pasiendaftarfk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'br.pegawaifk')
            ->leftjoin('pembatal_m as pmb', 'pmb.id', '=', 'br.pembatalanfk')
            ->join('ruangan_m as r', 'r.id', '=', 'pd.objectruanganlastfk')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->select(
                'pd.norec as norec_pd',
                'br.tanggalpembatalan',
                'br.alasanpembatalan',
                'ps.nocm',
                'ps.namapasien',
                'pd.noregistrasi',
                'pg.namalengkap',
                'pmb.name as pembatal',
                'r.namaruangan',
                'apd.noantrian'
            );

        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('br.tanggalpembatalan', '>=', $filter['tglAwal'] . ' 00:00');
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $data = $data->where('br.tanggalpembatalan', '<=', $filter['tglAkhir'] . ' 23:59');
        }
        if (isset($filter['noReg']) && $filter['noReg'] != "" && $filter['noReg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', 'ilike', '%' . $filter['noReg'] . '%');
        }
        if (isset($filter['noCm']) && $filter['noCm'] != "" && $filter['noCm'] != "undefined") {
            $data = $data->where('ps.nocm', 'ilike', '%' . $filter['noCm'] . '%');
        }
        if (isset($filter['namaPasien']) && $filter['namaPasien'] != "" && $filter['namaPasien'] != "undefined") {
            $data = $data->where('ps.namapasien', 'ilike', '%' . $filter['namaPasien'] . '%');
        }
        $data = $data->groupBy(
            'pd.norec',
            'br.tanggalpembatalan',
            'br.alasanpembatalan',
            'ps.nocm',
            'ps.namapasien',
            'pd.noregistrasi',
            'pg.namalengkap',
            'pmb.name',
            'r.namaruangan',
            'apd.noantrian'
        );

        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'inhuman',
        );
        return $this->respond($result);
    }
    public function getDaftarPasienMeninggal(Request $request)
    {
        $filter = $request->all();
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->join('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->leftjoin('statuskeluar_m as sk', 'sk.id', '=', 'pd.objectstatuskeluarfk')
            ->leftjoin('statuspulang_m as sp', 'sp.id', '=', 'pd.objectstatuspulangfk')
            ->leftjoin('penyebabkematian_m as pk', 'pk.id', '=', 'pd.objectpenyebabkematianfk')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->select(DB::raw("pd.tglregistrasi,pd.noregistrasi,ps.nocm,ps.namapasien,jk.jeniskelamin,ps.tgllahir,
                     sk.statuskeluar,sp.statuspulang,pd.namalengkapambilpasien,
                     case when pd.objectpenyebabkematianfk = 4 then pd.keteranganpenyebabkematian else pk.penyebabkematian end as penyebabkematian,
                     pd.tglmeninggal, ru.namaruangan"))
            ->where('pd.objectstatuskeluarfk', 5);

        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglmeninggal', '>=', $filter['tglAwal'] . ' 00:00');
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $data = $data->where('pd.tglmeninggal', '<=', $filter['tglAkhir'] . ' 23:59');
        }
        if (isset($filter['noReg']) && $filter['noReg'] != "" && $filter['noReg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', 'ilike', '%' . $filter['noReg'] . '%');
        }
        if (isset($filter['noCm']) && $filter['noCm'] != "" && $filter['noCm'] != "undefined") {
            $data = $data->where('ps.nocm', 'ilike', '%' . $filter['noCm'] . '%');
        }
        if (isset($filter['namaPasien']) && $filter['namaPasien'] != "" && $filter['namaPasien'] != "undefined") {
            $data = $data->where('ps.namapasien', 'ilike', '%' . $filter['namaPasien'] . '%');
        }
        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'er@epic',
        );
        return $this->respond($result);
    }

    public function getBayiBaruLahir(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $filter = $request->all();
        $kdPasienBayi = $this->settingDataFixed('KdPasienBayi', $kdProfile);
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->join('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->leftjoin('pasien_m as ps2', 'ps2.id', '=', 'ps.qpasien')
            ->leftjoin('alamat_m as alm', 'alm.nocmfk', '=', 'ps.id')
            ->select(DB::raw("  pd.tglregistrasi,
                    pd.noregistrasi,
                    ps.nocm,
                    ps.namapasien,
                    jk.jeniskelamin,
                    ps.tgllahir,
                case when   ps2.namapasien is not NULL then ps2.namapasien else ps.namaibu end as namaibu,
                ps.namaayah, alm.alamatlengkap"))
            ->where('ps.statusenabled', true)
            ->where('ps.kdprofile', $kdProfile)
            ->where('ps.nocm', 'ilike', '%' . $kdPasienBayi . '%');

        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '>=', $filter['tglAwal'] . ' 00:00');
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '<=', $filter['tglAkhir'] . ' 23:59');
        }
        if (isset($filter['tglLahir']) && $filter['tglLahir'] != "" && $filter['tglLahir'] != "undefined") {
            $data = $data->whereBetween('ps.tgllahir', [$filter['tglLahir'] . ' 00:00', $filter['tglLahir'] . ' 23:59']);
        }

        if (isset($filter['noReg']) && $filter['noReg'] != "" && $filter['noReg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', 'ilike', '%' . $filter['noReg'] . '%');
        }
        if (isset($filter['noCm']) && $filter['noCm'] != "" && $filter['noCm'] != "undefined") {
            $data = $data->where('ps.nocm', 'ilike', '%' . $filter['noCm'] . '%');
        }
        if (isset($filter['namaPasien']) && $filter['namaPasien'] != "" && $filter['namaPasien'] != "undefined") {
            $data = $data->where('ps.namapasien', 'ilike', '%' . $filter['namaPasien'] . '%');
        }
        if (isset($filter['namaIbu']) && $filter['namaIbu'] != "" && $filter['namaIbu'] != "undefined") {
            $data = $data->where('ps.namaibu', 'ilike', '%' . $filter['namaIbu'] . '%');
        }
        if (isset($filter['rows']) && $filter['rows'] != "" && $filter['rows'] != "undefined") {
            $row = (int) $filter['rows'];
            $data = $data->take($row);
        }
        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'er@epic',
        );
        return $this->respond($result);
    }
    public function getComboRiwayatRegis(Request $request)
    {

        $dataInstalasi = \DB::table('departemen_m as dp')
            ->whereIn('dp.id', array(3, 14, 16, 17, 18, 19, 24, 25, 26, 27, 28, 35))
            ->where('dp.statusenabled', true)
            ->orderBy('dp.namadepartemen')
            ->get();

        $dataRuangan = \DB::table('ruangan_m as ru')
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();


        $deptRajalInap = \DB::table('departemen_m as dept')
            ->whereIn('dept.id', [18, 16])
            ->orderBy('dept.namadepartemen')
            ->get();



        foreach ($dataInstalasi as $item) {
            $detail = [];
            foreach ($dataRuangan as $item2) {
                if ($item->id == $item2->objectdepartemenfk) {
                    $detail[] = array(
                        'id' => $item2->id,
                        'ruangan' => $item2->namaruangan,
                    );
                }
            }

            $dataDepartemen[] = array(
                'id' => $item->id,
                'departemen' => $item->namadepartemen,
                'ruangan' => $detail,
            );
        }

        $KategoryDiagnosa = \DB::table('kategorydiagnosa_m as ma')
            ->select('ma.id', 'ma.kategorydiagnosa')
            ->where('ma.statusenabled', true)
            ->orderBy('ma.kategorydiagnosa')
            ->take(100)
            ->get();
        $JenisKelamin = \DB::table('jeniskelamin_m as jr')
            ->select('jr.id', 'jr.jeniskelamin')
            ->where('jr.statusenabled', true)
            ->orderBy('jr.jeniskelamin')
            ->take(100)
            ->get();

        $jenisDiagnosa = \DB::table('jenisdiagnosa_m as ma')
            ->select('ma.id', 'ma.jenisdiagnosa as jenisDiagnosa')
            ->where('ma.statusenabled', true)
            ->orderBy('ma.id')
            ->get();
        $result = array(
            'deptrirj' => $deptRajalInap,
            'kategorydiagnosa' => $KategoryDiagnosa,
            'jeniskelamin' =>   $JenisKelamin,
            'jenisdiagnosa' =>   $jenisDiagnosa,
            'message' => 'er@epic',
        );

        return $this->respond($result);
    }
    public function getPasienByNoCmRiwayatRegis(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $data = \DB::table('pasien_m as ps')
            ->select(
                'ps.nocm',
                'ps.namapasien',
                'ag.agama',
                'ps.nohp',
                'ps.notelepon',
                'ps.namakeluarga',
                'ps.namaibu',
                'ps.namaayah',
                'ps.tempatlahir',
                'ps.tgllahir',
                'alm.alamatlengkap',
                'alm.namakecamatan',
                'alm.kecamatan',
                'ng.namanegara',
                'jk.jeniskelamin',
                'kb.name as kebangsaan',
                'pk.pekerjaan'
            )
            ->leftJoin('alamat_m as alm', 'alm.nocmfk', '=', 'ps.id')
            ->leftJoin('agama_m as ag', 'ag.id', '=', 'ps.objectagamafk')
            ->leftJoin('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->leftJoin('negara_m as ng', 'ng.id', '=', 'ps.objectnegarafk')
            ->leftJoin('kebangsaan_m as kb', 'kb.id', '=', 'ps.objectkebangsaanfk')
            ->leftJoin('pekerjaan_m as pk', 'pk.id', '=', 'ps.objectpekerjaanfk')
            ->where('ps.statusenabled', true)
            ->where('ps.kdprofile', $kdProfile);

        if (isset($request['noCm']) && $request['noCm'] != "" && $request['noCm'] != "undefined") {
            // $data = $data->where('ps.nocm', 'ilike', '%'. $request['noCm']);
            $data = $data->where('ps.nocm', '=', $request['noCm']);
        };
        $data = $data->first();

        $result = array(
            'datas' => $data,
            'message' => 'er@epic',
        );
        return $this->respond($result);
    }
    public function getAntrianPasienByNocmRev(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $deptRanap = explode(',', $this->settingDataFixed('kdDepartemenRanapFix',  $idProfile));
        $kdDepartemenRawatInap = [];
        $result = [];
        foreach ($deptRanap as $itemRanap) {
            $kdDepartemenRawatInap[] =  (int)$itemRanap;
        }

        $deptJalan = explode(',', $this->settingDataFixed('kdDepartemenRawatJalanFix',  $idProfile));
        $kdDepartemenRawatJalan = [];
        foreach ($deptJalan as $item) {
            $kdDepartemenRawatJalan[] =  (int)$item;
        }
        $data = \DB::table('pasien_m as ps')
            ->join('pasiendaftar_t as pd', 'pd.nocmfk', '=', 'ps.id')
            //            ->join('antrianpasiendiperiksa_t as apd','apd.noregistrasifk','=','pd.norec')
            ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftJoin('departemen_m as dpm', 'dpm.id', '=', 'ru.objectdepartemenfk')
            ->leftJoin('pegawai_m as peg', 'peg.id', '=', 'pd.objectpegawaifk')
            ->select(
                'ps.nocm',
                'ps.namapasien',
                'pd.noregistrasi',
                'pd.tglregistrasi',
                'pd.objectpegawaifk',
                'peg.namalengkap',
                'pd.tglpulang',
                'pd.objectruanganasalfk',
                'ru.namaruangan',
                'pd.norec as norec_pd',
                'pd.objectruanganlastfk'
            )
            ->where('ps.kdprofile', $idProfile)
            ->where('pd.statusenabled', true);

        if (isset($request['noCm']) && $request['noCm'] != "" && $request['noCm'] != "noCm") {
            $data = $data->where('ps.nocm', 'ilike', '%' . $request['noCm']);
        };
        if (isset($request['noReg']) && $request['noReg'] != "" && $request['noReg'] != "noReg") {
            $data = $data->where('pd.noregistrasi', '=', $request['noReg']);
        };
        if (isset($request['idDept']) && $request['idDept'] == 16 && $request['idDept'] != "undefined") {
            $data = $data->whereIn('dpm.id', $kdDepartemenRawatInap);
        }
        if (isset($request['idDept']) && $request['idDept'] == 18 && $request['idDept'] != "undefined") {
            $data = $data->whereIn('dpm.id', $kdDepartemenRawatJalan);
        }

        $data = $data->distinct();
        $data = $data->get();

        foreach ($data as $item) {
            $details = DB::select(
                DB::raw("select CASE when ddp.noregistrasifk is null then 0 else 1 end as icd10,
                        dm.kddiagnosa,
			            CASE when dtp.objectpasienfk is null then 0 else 1 end as icd9
                        from antrianpasiendiperiksa_t as apd
                        INNER JOIN  detaildiagnosapasien_t as ddp on ddp.noregistrasifk = apd.norec
                        INNER join diagnosa_m as dm on dm.id = ddp.objectdiagnosafk
                        LEFT JOIN diagnosatindakanpasien_t as dtp on dtp.objectpasienfk = apd.norec
                        LEFT JOIN detaildiagnosatindakanpasien_t as ddtp on ddtp.objectdiagnosatindakanpasienfk = dtp.norec
                        LEFT JOIN diagnosatindakan_m as dt on dt.id = ddtp.objectdiagnosatindakanfk
                        where apd.kdprofile = $idProfile and apd.noregistrasifk=:norec
                        GROUP BY ddp.noregistrasifk,dtp.objectpasienfk, dm.kddiagnosa"),
                array(
                    'norec' => $item->norec_pd,
                )
            );
            $result[] = array(
                'nocm' => $item->nocm,
                'namapasien' => $item->namapasien,
                'noregistrasi' => $item->noregistrasi,
                'tglregistrasi' => $item->tglregistrasi,
                'namalengkap' => $item->namalengkap,
                'tglpulang' => $item->tglpulang,
                'objectruanganasalfk' => $item->objectruanganasalfk,
                'namaruangan' => $item->namaruangan,
                'objectruanganlastfk' => $item->objectruanganlastfk,
                'details' => $details,
            );
        }

        $result = array(
            'datas' => $result,
            //            'result' => $result,
            'message' => 'giw',
        );
        return $this->respond($result);
    }

    public function getIcd9(Request $request)
    {
        $req = $request->all();
        $icdIX = \DB::table('diagnosatindakan_m as dg')
            ->select('dg.id','dg.kddiagnosatindakan as kdDiagnosaTindakan','dg.namadiagnosatindakan as namaDiagnosaTindakan')
            ->where('dg.statusenabled', true)
            // ->whereNull('dg.inagrouper')
            ->orderBy('dg.kddiagnosatindakan');

        if(isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value']!="" &&
            $req['filter']['filters'][0]['value']!="undefined"){
                $filterValue = str_replace('.', '', $req['filter']['filters'][0]['value']);

                $icdIX = $icdIX->where(function($q) use ($filterValue) {
                    $q->whereRaw("REPLACE(dg.kddiagnosatindakan, '.', '') ILIKE ?", ["%{$filterValue}%"])
                    ->orWhereRaw("REPLACE(dg.namadiagnosatindakan, '.', '') ILIKE ?", ["%{$filterValue}%"]);
                })
            // $icdIX = $icdIX
            //     ->where(function($q) use ($req) {
            //         $q->where('dg.namadiagnosatindakan', 'ilike', '%'.$req['filter']['filters'][0]['value'].'%')
            //         ->orWhere('dg.kddiagnosatindakan', 'ilike', $req['filter']['filters'][0]['value'].'%');
            //     })
                ->where('dg.statusenabled', true);
        }


        $icdIX=$icdIX->take(10);
        $icdIX=$icdIX->get();

        $data = [];
        if (count($icdIX) > 0) {
            foreach ($icdIX as $item) {
                $data [] = array(
                    'kdNama' => $item->kdDiagnosaTindakan . ' - ' . $item->namaDiagnosaTindakan,
                    'id' => $item->id,
                    'kdDiagnosaTindakan' => $item->kdDiagnosaTindakan,
                    'namaDiagnosaTindakan' => $item->namaDiagnosaTindakan,

                );

            }
        }

        return $this->respond($data);
    }

    public function getDiagnosaPasienByNoregICD9 ( Request $request) {
        $inacbg = [];
        $dtdt = '';
        $data = \DB::table('pasiendaftar_t as pd')
            ->select('pd.noregistrasi', 'pd.tglregistrasi', 'apd.objectruanganfk', 'ru.namaruangan',
                'apd.norec as norec_apd', 'ddt.objectdiagnosatindakanfk', 'dt.kddiagnosatindakan', 'dt.namadiagnosatindakan',
                'dtp.norec as norec_diagnosapasien', 'ddt.ketdiagnosa','dt.id',
                'ddt.norec as norec_detaildpasien', 'dt.*','ddt.keterangantindakan','pg.namalengkap','ddt.tglinputdiagnosa' )
            ->join('antrianpasiendiperiksa_t as apd','apd.noregistrasifk','=','pd.norec')
            ->join('ruangan_m as ru','ru.id','=','apd.objectruanganfk')
            ->join ('diagnosatindakanpasien_t as dtp','dtp.objectpasienfk','=','apd.norec')
            ->join ('detaildiagnosatindakanpasien_t as ddt','ddt.objectdiagnosatindakanpasienfk','=','dtp.norec')
            ->join ('diagnosatindakan_m as dt','dt.id','=','ddt.objectdiagnosatindakanfk')
            ->leftjoin('pegawai_m as pg','pg.id','=','ddt.objectpegawaifk')
            ->whereNull('ddt.ketdiagnosa');
           
          
//            ->join ('jenisdiagnosa_m as jd','jd.id','=','ddp.objectjenisdiagnosafk');
        if(isset($request['noCm']) && $request['noCm']!="" && $request['noCm']!="undefined"){
            $data = $data->where('ps.nocm','=', $request['noReg']);
        };
        if(isset($request['noReg']) && $request['noReg']!="" && $request['noReg']!="undefined"){
            $data = $data->where('pd.noregistrasi','=', $request['noReg']);
        };
        // if(isset($request['ketdiagnosa']) && $request['ketdiagnosa'] == 0){
        //     $data = $data->where(DB::raw(" ddt.ketdiagnosa In ('unugrouper',null)"));
        // } 
        // else {
        //     $data = $data->whereNull('ddt.ketdiagnosa');
        // }

        if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
            $data = $data->where('apd.objectruanganfk', '=', $request['idDept']);
        };
        if (isset($request['kddiagnosatindakan']) && $request['kddiagnosatindakan'] != "" && $request['kddiagnosatindakan'] != "undefined") {
            $data = $data->where('dt.kddiagnosatindakan', '=', $request['kddiagnosatindakan']);
        }
        $data=$data->orderBy(DB::raw("ketdiagnosa,kddiagnosatindakan"))->get();

        if (isset($request['inacbg']) && [$request['inacbg'] == 'true']) {
            $inacbg = \DB::table('pasiendaftar_t as pd')
            ->select('pd.noregistrasi', 'pd.tglregistrasi', 'apd.objectruanganfk', 'ru.namaruangan',
                'apd.norec as norec_apd', 'ddt.objectdiagnosatindakanfk', 'dt.kddiagnosatindakan', 'dt.namadiagnosatindakan',
                'dtp.norec as norec_diagnosapasien', 'ddt.ketdiagnosa','dt.id',
                'ddt.norec as norec_detaildpasien', 'dt.*','ddt.keterangantindakan','pg.namalengkap','ddt.tglinputdiagnosa','dt2.im as is_im' )
            ->join('antrianpasiendiperiksa_t as apd','apd.noregistrasifk','=','pd.norec')
            ->join('ruangan_m as ru','ru.id','=','apd.objectruanganfk')
            ->join ('diagnosatindakanpasien_t as dtp','dtp.objectpasienfk','=','apd.norec')
            ->join ('detaildiagnosatindakanpasien_t as ddt','ddt.objectdiagnosatindakanpasienfk','=','dtp.norec')
            ->join ('diagnosatindakan_m as dt','dt.id','=','ddt.objectdiagnosatindakanfk')
            ->join ('diagnosatindakanim_m as dt2','dt2.kddiagnosatindakan','=','dt.kddiagnosatindakan')
            ->leftjoin('pegawai_m as pg','pg.id','=','ddt.objectpegawaifk')
            ->where('ddt.ketdiagnosa','=','INAcbg')
            ->where('pd.noregistrasi','=', $request['noReg'])
            ->orderBy(DB::raw("ddt.tglinputdiagnosa"))->get();
            foreach ($inacbg as $ina) {
                $dtdt = $dtdt . '#' .  $ina->kddiagnosatindakan;
            }
        }
        
        // $dtdt = '';
        $d = [];
        $i = 0;
        
        foreach ($data as $item){
        //    if ($item->ketdiagnosa == 'INAcbg') {
        //      $dtdt = $dtdt . '#' .  $item->kddiagnosatindakan;
        //    }
            if ($item->ketdiagnosa == null) {
               $d[$i]['id_diagnosa'] =  $item->id;
               $d[$i]['ketdiagnosa'] = 'INAcbg';
               $d[$i]['kdNama'] =  $item->kddiagnosatindakan . ' - ' .$item->namadiagnosatindakan;
            }
            $i++;
        }
        $icd9 =  substr($dtdt,1,strlen($dtdt)-1);

        $icd9unu = '';
        $dataunu = [];
        if ($request['unu'] == "true") {
            $dataunu = \DB::table('pasiendaftar_t as pd')
            ->select('pd.noregistrasi', 'pd.tglregistrasi', 'apd.objectruanganfk', 'ru.namaruangan',
                'apd.norec as norec_apd', 'ddt.objectdiagnosatindakanfk', 'dt.kddiagnosatindakan', 'dt.namadiagnosatindakan',
                'dtp.norec as norec_diagnosapasien', 
                'ddt.norec as norec_detaildpasien', 'dt.*','ddt.keterangantindakan','pg.namalengkap','ddt.tglinputdiagnosa' )
            ->join('antrianpasiendiperiksa_t as apd','apd.noregistrasifk','=','pd.norec')
            ->join('ruangan_m as ru','ru.id','=','apd.objectruanganfk')
            ->join ('diagnosatindakanpasien_t as dtp','dtp.objectpasienfk','=','apd.norec')
            ->join ('detaildiagnosatindakanpasien_t as ddt','ddt.objectdiagnosatindakanpasienfk','=','dtp.norec')
            ->join ('diagnosatindakan_m as dt','dt.id','=','ddt.objectdiagnosatindakanfk')
            ->leftjoin('pegawai_m as pg','pg.id','=','ddt.objectpegawaifk')
            ->where('pd.noregistrasi','=', $request['noReg'])
            ->where('ddt.ketdiagnosa','=','unugrouper')
            ->orderBy('kddiagnosatindakan','asc')
            ->get();

            
            $dt = '';
            foreach ($dataunu as $item){
            
                $dt = $dt . '#' .  $item->kddiagnosatindakan;
            
            }
            if ($dt == null) {
               $icd9unu = $icd9;
            } else {
                $icd9unu =  substr($dt,1,strlen($dt)-1);
            }

          
        };
        
       

        $result = array(
            'datas' => $data,
            'inacbg' => $inacbg,
            'icd9' => $icd9,
            'icd9unu' => $icd9unu,
            'dataunu' => $dataunu,
            'd' => $d,
            'message' => 'giw@cepot',
        );
        return $this->respond($result);
    }
    public function getPasienDaftarByNoreg(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $data = \DB::table('pasiendaftar_t as pd')
            ->select('pd.noregistrasi', 'pd.objectruanganlastfk', 'ru.namaruangan', 'pd.norec')
            //                ,'apd.norec as norec_apd')
            //            ->select('pd.noregistrasi','apd.objectruanganfk','ru.namaruangan','apd.norec as norec_apd',
            //                'pd.objectruanganlastfk','ru2.namaruangan as ruanganlast')
            //            ->leftJoin('antrianpasiendiperiksa_t as apd','apd.noregistrasifk','=','pd.norec')
            //            ->leftJoin('ruangan_m as ru','ru.id','=','apd.objectruanganfk')
            ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk');
        if (isset($request['noReg']) && $request['noReg'] != "" && $request['noReg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $request['noReg']);
        };
        $data = $data->where('pd.kdprofile', $idProfile);
        $data = $data->get();
        $result = [];

        foreach ($data as $item) {
            $details = DB::select(
                DB::raw("
                     select apd.norec as norec_apd, apd.objectruanganfk, ru.namaruangan
                     from antrianpasiendiperiksa_t as apd
                     inner join ruangan_m as ru on ru.id=apd.objectruanganfk
                     where apd.kdprofile = $idProfile and apd.objectruanganfk=:objectruanganlastfk and  apd.noregistrasifk=:norec"),
                array(
                    'objectruanganlastfk' => $item->objectruanganlastfk,
                    'norec' => $item->norec,
                )
            );
            $result[] = array(
                'noregistrasi' => $item->noregistrasi,
                'objectruanganlastfk' => $item->objectruanganlastfk,
                'namaruangan' => $item->namaruangan,
                'norec' => $item->norec,
                'details' => $details,
            );
        }
        $result = array(
            'data' => $result,
            'message' => 'giw',
        );
        return $this->respond($result);
    }
    public function deleteDiagnosaTindakanPasien(Request $request)
    {
        $dataLogin = $request->all();
        DB::beginTransaction();
        if ($request['diagnosa']['norec_dp'] != '') {
            try {
                $data1 = DetailDiagnosaTindakanPasien::where('objectdiagnosatindakanpasienfk', $request['diagnosa']['norec_dp'])->delete();
                $transStatus = 'true';
            } catch (\Exception $e) {
                $transStatus = false;
            }
            try {
                $data2 = DiagnosaTindakanPasien::where('norec', $request['diagnosa']['norec_dp'])->delete();
                $transStatus = 'true';
            } catch (\Exception $e) {
                $transStatus = false;
            }
        }
        if ($transStatus = 'true') {
            DB::commit();
            $transMessage = "Data Terhapus";
        } else {
            DB::rollBack();
            $transMessage = "Data Gagal Dihapus";
        }
        return $this->setStatusCode(201)->respond([], $transMessage);
    }

    public function saveDiagnosaPasien(Request $request)
    {
        $dataLogin = $request->all();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        DB::beginTransaction();
        //        try{
        $dataPegawaiUser = DB::select(
            DB::raw("select pg.id,pg.namalengkap from loginuser_s as lu
                INNER JOIN pegawai_m as pg on lu.objectpegawaifk=pg.id
                where pg.kdprofile = $idProfile and lu.id=:idLoginUser"),
            array(
                'idLoginUser' => $dataLogin['userData']['id'],
            )
        );

        if ($request['detaildiagnosapasien']['norec_dp'] == '') {
            $dataDiagnosa = new DiagnosaPasien();
            $dataDiagnosa->norec = $dataDiagnosa->generateNewId();
            $dataDiagnosa->kdprofile = $idProfile;
            $dataDiagnosa->statusenabled = true;
        } else {
            $dataDiagnosa =  DiagnosaPasien::where('norec', $request['detaildiagnosapasien']['norec_dp'])->first();
        }

        $dataDiagnosa->noregistrasifk =  $request['detaildiagnosapasien']['noregistrasifk'];
        $dataDiagnosa->ketdiagnosis =  'Diagnosa Pasien';
        $dataDiagnosa->tglregistrasi = null;
        $dataDiagnosa->tglpendaftaran = $request['detaildiagnosapasien']['tglregistrasi'];
        if (isset($request['detaildiagnosapasien']['kasusbaru'])) {
            $dataDiagnosa->iskasusbaru = $request['detaildiagnosapasien']['kasusbaru'];
        }
        if (isset($request['detaildiagnosapasien']['kasuslama'])) {
            $dataDiagnosa->iskasuslama = $request['detaildiagnosapasien']['kasuslama'];
        }
        try {
            $dataDiagnosa->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan Diagnosa Baru";
        }


        if ($request['detaildiagnosapasien']['norec_dp'] == '' || $request['detaildiagnosapasien']['keterangan'] == '') {
            $dataDetailDiagnosa = new DetailDiagnosaPasien();
            $dataDetailDiagnosa->norec = $dataDetailDiagnosa->generateNewId();
            $dataDetailDiagnosa->kdprofile = $idProfile;
            $dataDetailDiagnosa->statusenabled = true;
            //               $dataDetailDiagnosa->keterangan = '-';
            $dataDetailDiagnosa->objectpegawaifk = $dataPegawaiUser[0]->id; // $this->getCurrentLoginID();

        } else {
            $dataDetailDiagnosa =  DetailDiagnosaPasien::where('objectdiagnosapasienfk', $request['detaildiagnosapasien']['norec_dp'])->first();
        }

        $dataDetailDiagnosa->noregistrasifk =  $request['detaildiagnosapasien']['noregistrasifk'];
        $dataDetailDiagnosa->tglregistrasi = $request['detaildiagnosapasien']['tglregistrasi'];
        $dataDetailDiagnosa->norec = $dataDetailDiagnosa->generateNewId();
        $dataDetailDiagnosa->objectdiagnosafk = $request['detaildiagnosapasien']['objectdiagnosafk'];
        $dataDetailDiagnosa->objectdiagnosapasienfk = $dataDiagnosa->norec;
        $dataDetailDiagnosa->objectjenisdiagnosafk = $request['detaildiagnosapasien']['objectjenisdiagnosafk'];
        $dataDetailDiagnosa->tglinputdiagnosa = date('Y-m-d H:i:s'); //$request['detaildiagnosapasien']['tglinputdiagnosa'];
        $dataDetailDiagnosa->keterangan = $request['detaildiagnosapasien']['keterangan'];
        $dataDetailDiagnosa->objectpegawaifk = $dataPegawaiUser[0]->id; // $this->getCurrentLoginID();


        try {
            $dataDetailDiagnosa->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan Pasien Baru";
        }

        if ($transStatus == 'true') {
            $transMessage = "Data Tersimpan";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'data' => $dataDiagnosa,
                'as' => 'egie@ramdan',
            );
        } else {
            $transMessage = "Data Gagal Disimpan";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'data' => $dataDiagnosa,
                'as' => 'egie@ramdan',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveDiagnosaTindakanPasien(Request $request) {
        $dataLogin = $request->all();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        DB::beginTransaction();
        $dataPegawaiUser = DB::select(DB::raw("select pg.id,pg.namalengkap from loginuser_s as lu
                INNER JOIN pegawai_m as pg on lu.objectpegawaifk=pg.id
                where lu.id=:idLoginUser and pg.kdprofile = $idProfile"),
            array(
                'idLoginUser' => $dataLogin['userData']['id'],
            )
        );

//        try{
        if ($request['detaildiagnosatindakanpasien']['norec_dp']==''){
            $dataDiagnosa = new DiagnosaTindakanPasien();
            $dataDiagnosa->norec = $dataDiagnosa->generateNewId();
            $dataDiagnosa->kdprofile = $idProfile;
            $dataDiagnosa->statusenabled = true;
        }else{
            $dataDiagnosa =  DiagnosaTindakanPasien::where('norec',$request['detaildiagnosatindakanpasien']['norec_dp'])->first();
        }
        $dataDiagnosa->objectpasienfk =  $request['detaildiagnosatindakanpasien']['objectpasienfk'];
        $dataDiagnosa->tglpendaftaran = $request['detaildiagnosatindakanpasien']['tglpendaftaran'];
       
      


        try{
            $dataDiagnosa->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan Diagnosa Baru";
        }


        if ($request['detaildiagnosatindakanpasien']['norec_dp']==''){
            $dataDetailDiagnosa = new DetailDiagnosaTindakanPasien();
            $dataDetailDiagnosa->norec = $dataDetailDiagnosa->generateNewId();
            $dataDetailDiagnosa->kdprofile = $idProfile;
            $dataDetailDiagnosa->statusenabled = true;
            $dataDetailDiagnosa->objectpegawaifk = $dataPegawaiUser[0]->id;// $this->getCurrentLoginID();
            if (isset($request['detaildiagnosatindakanpasien']['ketdiagnosa'])) {
                $dataDetailDiagnosa->ketdiagnosa = $request['detaildiagnosatindakanpasien']['ketdiagnosa'];
            }
        }else{
            $dataDetailDiagnosa =  DetailDiagnosaTindakanPasien::where('objectdiagnosatindakanpasienfk',$request['detaildiagnosatindakanpasien']['norec_dp'])->first();
        }

        $dataDetailDiagnosa->objectdiagnosatindakanfk = $request['detaildiagnosatindakanpasien']['objectdiagnosatindakanfk'];
        $dataDetailDiagnosa->objectdiagnosatindakanpasienfk = $dataDiagnosa->norec;
        $dataDetailDiagnosa->jumlah = null;
        $dataDetailDiagnosa->objectpegawaifk = $dataPegawaiUser[0]->id;// $this->getCurrentLoginID()
        
        if(isset( $request['detaildiagnosatindakanpasien']['keterangantindakan'])){
            $dataDetailDiagnosa->keterangantindakan = $request['detaildiagnosatindakanpasien']['keterangantindakan'];
        }

        if (isset($request['detaildiagnosatindakanpasien']['jumlah'])) {
                $dataDetailDiagnosa->jumlah = $request['detaildiagnosatindakanpasien']['jumlah'];
            }

        $dataDetailDiagnosa->tglinputdiagnosa = date('Y-m-d H:i:s');

        try{
            $dataDetailDiagnosa->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan Pasien Baru";
        }

        $pd = DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd','apd.noregistrasifk','=','pd.norec')
            ->select('pd.noregistrasi','objectruanganlastfk')
            ->where('apd.norec',$request['detaildiagnosatindakanpasien']['objectpasienfk'])
            ->first();

        if ($transStatus == 'true') {
            $transMessage = "Data Tersimpan";
            DB::commit();
            $ihs = null;
            if($pd->objectruanganlastfk == 819) {
                $objetoRequest = new \Illuminate\Http\Request();
                $objetoRequest ['noregistrasi']= $pd->noregistrasi;
                $objetoRequest ['inacbg']=true;
                $ihs = app('App\Http\Controllers\Bridging\IHSController')->Procedure($objetoRequest,true);
            }
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'data' => $dataDiagnosa,
                'Procedure' =>  $ihs,
                'as' => 'egie@ramdan',
            );
        } else {
            $transMessage = "Data Gagal Disimpan";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'data' =>$dataDiagnosa,
                'as' => 'egie@ramdan',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getAnamnesis(Request $request)
    {
        $data = \DB::table('anamnesis_t as rm')
            ->select(
                'rm.norec',
                'rm.anamnesisdokter',
                'rm.anamnesissuster',
                'rm.tglinput',
                'rm.noregistrasifk',
                'rm.pegawaifk',
                'pg.namalengkap',
                'rm.ruanganfk',
                'ru.namaruangan',
                'pd.noregistrasi',
                'pd.tglregistrasi',
                'ps.nocm',
                'ps.namapasien'
            )
            ->leftJoin('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'rm.noregistrasifk')
            ->leftJoin('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->leftJoin('pasien_m as ps', 'pd.nocmfk', '=', 'ps.id')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'rm.pegawaifk')
            ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'rm.ruanganfk')
            ->where('rm.statusenabled', true);

        if (isset($request['noregistrasifk']) && $request['noregistrasifk'] != '') {
            $data = $data->where('rm.noregistrasifk', $request['noregistrasifk']);
        }
        if (isset($request['nocm']) && $request['nocm'] != '') {
            $data = $data->where('ps.nocm', $request['nocm']);
        }
        if (isset($request['norec_pd']) && $request['norec_pd'] != '') {
            $data = $data->where('pd.norec', $request['norec_pd']);
        }
        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'Inhuman',
        );
        return $this->respond($result);
    }
    public function getResumeMedisInap(Request $request, $nocm)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $data = \DB::table('resumemedis_t as rm')
            ->select(
                'rm.norec',
                'rm.tglresume',
                'ru.namaruangan',
                'pg.namalengkap as namadokter',
                'rm.ringkasanriwayatpenyakit',
                'rm.pemeriksaanfisik',
                'rm.pemeriksaanpenunjang',
                'rm.hasilkonsultasi',
                'rm.terapi',
                'rm.diagnosisawal',
                'rm.diagnosissekunder',
                'rm.tindakanprosedur',
                'rm.alergi',
                'rm.diet',
                'rm.instruksianjuran',
                'rm.hasillab',
                'rm.kondisiwaktukeluar',
                'rm.pengobatandilanjutkan',
                'rm.koderesume',
                'rm.pegawaifk',
                'pd.noregistrasi',
                'pd.tglregistrasi',
                'ps.nocm',
                'rm.noregistrasifk',
                'ps.namapasien'
            )
            ->Join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'rm.noregistrasifk')
            ->Join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->Join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'rm.pegawaifk')
            ->where('rm.kdprofile', $idProfile)
            ->where('rm.statusenabled', true)
            ->where('ps.nocm', $nocm)
            ->where('rm.keteranganlainnya', 'RawatInap');
        //            ->whereIn('ru.objectdepartemenfk',$iddept);

        $data = $data->get();
        $result = [];
        foreach ($data as $item) {
            $details = DB::select(
                DB::raw("
                   select * from resumemedisdetail_t
                   where kdprofile = $idProfile and resumefk=:norec"),
                array(
                    'norec' => $item->norec,
                )
            );
            $result[] = array(
                'norec' => $item->norec,
                'tglresume' => $item->tglresume,
                'namaruangan' => $item->namaruangan,
                'namadokter' => $item->namadokter,
                'ringkasanriwayatpenyakit' => $item->ringkasanriwayatpenyakit,
                'pemeriksaanfisik' => $item->pemeriksaanfisik,
                'pemeriksaanpenunjang' => $item->pemeriksaanpenunjang,
                'hasilkonsultasi' => $item->hasilkonsultasi,
                'terapi' => $item->terapi,
                'diagnosisawal' => $item->diagnosisawal,
                'diagnosissekunder' => $item->diagnosissekunder,
                'tindakanprosedur' => $item->tindakanprosedur,
                'alergi' => $item->alergi,
                'diet' => $item->diet,
                'instruksianjuran' => $item->instruksianjuran,
                'hasillab' => $item->hasillab,
                'kondisiwaktukeluar' => $item->kondisiwaktukeluar,
                'pengobatandilanjutkan' => $item->pengobatandilanjutkan,
                'koderesume' => $item->koderesume,
                'pegawaifk' => $item->pegawaifk,
                'noregistrasi' => $item->noregistrasi,
                'nocm' => $item->nocm,
                'tglregistrasi' => $item->tglregistrasi,
                'namapasien' => $item->namapasien,
                'noregistrasifk' => $item->noregistrasifk,
                'details' => $details,
            );
        }
        $result = array(
            'data' => $result,
            'message' => 'Inhuman',
        );
        return $this->respond($result);
    }

    public function getDaftarHasilLab(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $results = [];
        $kdDep =  $this->settingDataFixed('KdDepartemenInstalasiLaboratorium', $kdProfile);
        $data = \DB::table('strukorder_t as so')
            ->LEFTJOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'so.noregistrasifk')
            ->LEFTJOIN('ruangan_m as ru', 'ru.id', '=', 'so.objectruanganfk')
            ->LEFTJOIN('ruangan_m as ru2', 'ru2.id', '=', 'so.objectruangantujuanfk')
            ->LEFTJOIN('pegawai_m as p', 'p.id', '=', 'so.objectpegawaiorderfk')
            //            ->LEFTJOIN('resdt as pp','pp.ono','=','so.noorder')
            ->select(
                'so.norec',
                'pd.norec as norecpd',
                'pd.noregistrasi',
                'so.tglorder',
                'so.noorder',
                'ru.namaruangan as ruanganasal',
                'ru2.namaruangan as ruangantujuan',
                'p.namalengkap'
                //                DB::raw('case when pp.ono is null then \'Hasil belum ada\' else \'SELESAI\' end as statusorder')
            )
            ->where('so.kdprofile', (int)$kdProfile);
        if (isset($request['noregistrasi']) && $request['noregistrasi'] != "" && $request['noregistrasi'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $request['noregistrasi']);
        }
        $data = $data->where('ru2.objectdepartemenfk', $kdDep);
        $data = $data->where('so.statusenabled', true);
        //        $data = $data->where('so.kdprofile',true);
        //        $data = $data->where('apd.objectruanganfk',276);
        $data = $data->orderBy('so.tglorder');
        //        $data = $data->distinct();
        $data = $data->get();

        //$results =array();
        foreach ($data as $item) {
            $status = '';
            $resDT = collect(\DB::select("select * from order_lab where no_lab='$item->noorder'"))->first();
            if (!empty($resDT)) {
                $status = 'Selesai';
            } else {
                $status = 'Hasil Belum Ada';
            }
            $details = DB::select(
                DB::raw("
                            select so.tglorder,so.noorder,
                            pr.id,pr.namaproduk,op.qtyproduk
                            from strukorder_t as so
                            left join orderpelayanan_t as op on op.noorderfk = so.norec
                            left join pasiendaftar_t as pd on pd.norec=so.noregistrasifk
                            left join produk_m as pr on pr.id=op.objectprodukfk
                            left join ruangan_m as ru on ru.id=so.objectruanganfk
                            left join ruangan_m as ru2 on ru2.id=so.objectruangantujuanfk
                            left join pegawai_m as p on p.id=so.objectpegawaiorderfk
                            --left JOIN order_lab as lis lis.no_lab= so.noorder AND 
                           -- lis.kode_test =cast (pr.id as VARCHAR) 
                            where so.norec=:norec"),
                array(
                    'norec' => $item->norec,
                )
            );
            $results[] = array(
                'tglorder' => $item->tglorder,
                'noorder' => $item->noorder,
                'norec' => $item->norec,
                'norecpd' => $item->norecpd,
                'namaruanganasal' => $item->ruanganasal,
                'namaruangantujuan' => $item->ruangantujuan,
                'dokter' => $item->namalengkap,
                'statusorder' => $status,
                'details' => $details,
            );
        }

        $result = array(
            'daftar' => $results,
            'message' => 'inhuman',
        );

        return $this->respond($result);
    }

    public function getDaftarHasilRad(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $results = [];
        $data = \DB::table('strukorder_t as so')
            //            ->LEFTJOIN('orderpelayanan_t as op','op.noorderfk','=','so.norec')
            ->LEFTJOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'so.noregistrasifk')
            ->LEFTJOIN('ruangan_m as ru', 'ru.id', '=', 'so.objectruanganfk')
            ->LEFTJOIN('ruangan_m as ru2', 'ru2.id', '=', 'so.objectruangantujuanfk')
            ->LEFTJOIN('pegawai_m as p', 'p.id', '=', 'so.objectpegawaiorderfk')
            //             ->LEFTJOIN('ris_order as pp','pp.order_no','=','so.noorder')
            ->select(
                'so.norec',
                'so.tglorder',
                'so.noorder',
                'ru.namaruangan as ruanganasal',
                'ru2.namaruangan as ruangantujuan',
                'p.namalengkap',
                'so.statusorder'
                //               DB::raw('case when pp.order_no is null then \'PENDING\' else \'SELESAI\' end as statusorder')
            )
            ->where('so.kdprofile', (int)$kdProfile);
        if (isset($request['noregistrasi']) && $request['noregistrasi'] != "" && $request['noregistrasi'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $request['noregistrasi']);
        }
        $data = $data->where('so.objectruangantujuanfk', 576); // syamsu ubah dari awalnya hardcoded 35
        $data = $data->where('so.statusenabled', true);
        $data = $data->orderBy('so.tglorder');
        //        $data = $data->distinct();
        $data = $data->get();
        $status = '';
        foreach ($data as $item) {
            $risorder = RisOrder::where('order_no', $item->noorder)->where('study_remark', '!=', '-')->get(); //->first();
            if (count($risorder)) {
                $status = 'Sudah diproses';
            } else {
                $status = 'Belum diproses';
            }

            $details = DB::select(
                DB::raw("
                            select so.tglorder,so.noorder, op.norec as norecopfk, 
                            pr.id, pr.namaproduk, op.qtyproduk
                            from strukorder_t as so
                            left join orderpelayanan_t as op on op.noorderfk = so.norec
                            left join pasiendaftar_t as pd on pd.norec=so.noregistrasifk
                            left join produk_m as pr on pr.id=op.objectprodukfk
                            left join pegawai_m as p on p.id=so.objectpegawaiorderfk
                            where so.kdprofile = $idProfile and so.noorder=:noorder"),
                // left join ruangan_m as ru on ru.id=so.objectruanganfk
                // left join ruangan_m as ru2 on ru2.id=so.objectruangantujuanfk

                array(
                    'noorder' => $item->noorder,
                )
            );

            $results[] = array(
                'tglorder' => $item->tglorder,
                'noorder' => $item->noorder,
                'norec' => $item->norec,
                'namaruanganasal' => $item->ruanganasal,
                'namaruangantujuan' => $item->ruangantujuan,
                'dokter' => $item->namalengkap,
                'statusorder' => $status,
                'details' => $details,
                'risorder' => $risorder
            );
        }

        $result = array(
            'daftar' => $results,
            'message' => 'inhuman',
        );

        return $this->respond($result);
    }
    public function getImage(Request $request)
    {
        $data = DB::select(DB::raw("
        select * from pasien_m where id=2"));
        $arr = [];
        foreach ($data as $item) {
            $arr = array(
                'photo' => base64_encode($item->foto), //  "data:image/jpeg;base64," . base64_encode($item->foto),
            );
        }
        return $this->respond($arr);
    }
    public function saveImage(Request $request)
    {
        $imageData = $request['photo'];
        $img = $request['photo'];
        $data = unpack("H*hex", $img);
        $data = '0x' . $data['hex'];
        Pasien::where('id', $request['id'])->update(
            ['foto' =>  \DB::raw("CONVERT(image, $data) ")]
        );
        $filteredData = substr($imageData, strpos($imageData, ",") + 1);
        $unencodedData = base64_decode($filteredData);

        //                $daritadi = Pasien::where('id',$request['id'])->first();
        //                $daritadi->foto =$data;
        //                $daritadi->save();
    }

    public function hapusPemakaianAsuransi(Request $request)
    {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        try {
            PemakaianAsuransi::where('norec', $request['norec'])->where('kdprofile', (int)$kdProfile)->delete();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus != 'false') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            $transMessage = "Hapus Pemakaian Asuransi gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveMergeNoRM(Request $request)
    {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        try {
            $pasienAsal = Pasien::where('id', $request['idasal'])
                ->where('kdprofile', (int)$kdProfile)
                ->update(
                    ['statusenabled' => false]
                );
            $pasienTujuan = Pasien::where('nocm', $request['nocmtujuan'])
                ->where('kdprofile', (int)$kdProfile)
                ->where('statusenabled', true)
                ->first();
            if (empty($pasienTujuan)) {
                $transMessage = 'Pasien dengan RM ' .  $request['nocmtujuan'] . ' Tidak ada';
                $result = array(
                    'status' => 400,
                    'message' => $transMessage,
                    //                'data' => $pasienTujuan,
                    'as' => 'er@epic',
                );
                return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }
            $pasienDaftar = PasienDaftar::where('nocmfk',  $request['idasal'])->where('kdprofile', (int)$kdProfile)->update([
                'nocmfk' =>  $pasienTujuan->id
            ]);
            $emrPasien = EMRPasien::where('nocm',  $request['rmAsal'])->where('kdprofile', (int)$kdProfile)->update([
                'nocm' =>  $pasienTujuan->nocm
            ]);
            $rekamMedis = RekamMedis::where('nocm',  $request['rmAsal'])->where('kdprofile', (int)$kdProfile)->update([
                'nocm' =>  $pasienTujuan->nocm
            ]);
            $transStatus = true;
        } catch (\Exception $e) {
            $transStatus = false;
        }

        if ($transStatus == true) {
            DB::commit();
            $transMessage = 'Sukses ';
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                //                'data' => $pasienTujuan,
                'as' => 'er@epic',
            );
        } else {
            $transMessage = 'Simpan Gagal ';
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message' => $transMessage,
                //                'data' => $pasienTujuan,
                'as' => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getLaporanSummaryHambatanKomunikasi(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $data = [];
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $ruanganId = $request['ruanganId'];
        $kelompokId = $request['kelompokPasien'];
        $jenispelayananId = $request['jenisPelayanan'];

        $paramRuangan = ' ';
        if (isset($ruanganId) && $ruanganId != "" && $ruanganId != "undefined") {
            $paramRuangan = ' and pd.objectruanganlastfk = ' . $ruanganId;
        }

        $paramKelompok = ' ';
        if (isset($kelompokId) && $kelompokId != "" && $kelompokId != "undefined") {
            $paramKelompok = ' and pd.objectkelompokpasienlastfk = ' . $kelompokId;
        }

        $paramJenisPelayanan = ' ';
        if (isset($jenispelayananId) && $jenispelayananId != "" && $jenispelayananId != "undefined") {
            if ($jenispelayananId == 1) {
                $paramJenisPelayanan = ' and ru.iseksekutif = false';
            } else {
                $paramJenisPelayanan = ' and ru.iseksekutif = true';
            }
        }

        $deptRawatJalan = $this->settingDataFixed('kdDepartemenRawatJalanFix', $kdProfile);

        $ruangan = DB::select(DB::raw("
            SELECT * FROM ruangan_m where id in(752,753,755,756,757,758,759,761,762,764,765,29,767,768,
            769,770,771,772,773,774,777,782,785,786,576,575)
        "));

        $hambatan = DB::select(DB::raw("
        WITH nonlab AS (
        SELECT distinct
        ru.id,
        pd.norec,
        pd.nocmfk,
        apd.tglmasuk,
        ps.namapasien,
        ru.namaruangan,
        apd.objectruanganfk,
        ps.hambatankomunikasifk,
        ru.objectdepartemenfk
        FROM
        pasiendaftar_t pd
        INNER JOIN pasien_m ps ON ps.ID = pd.nocmfk
        INNER JOIN antrianpasiendiperiksa_t apd ON pd.norec = apd.noregistrasifk
        INNER JOIN ruangan_m ru ON ru.ID = apd.objectruanganfk
        WHERE
        apd.tglmasuk BETWEEN '$tglAwal'
        AND '$tglAkhir'
        $paramKelompok
        AND pd.statusenabled = TRUE
        AND apd.statusenabled = TRUE
        AND ps.statusenabled = TRUE
        AND ru.objectdepartemenfk NOT IN ( 27, 3 )
        and apd.kdprofile=$idProfile
        ORDER BY
        pd.nocmfk,
        apd.tglmasuk ASC
        ),
        lab AS (
        SELECT DISTINCT
        ru.id,
        pp.norec,
        pd.nocmfk,
        pp.tglpelayanan,
        ps.namapasien,
        ru.namaruangan,
        apd.objectruanganfk,
        ps.hambatankomunikasifk,
        ru.objectdepartemenfk
        FROM
        pasiendaftar_t pd
        INNER JOIN pasien_m ps ON ps.ID = pd.nocmfk
        INNER JOIN antrianpasiendiperiksa_t apd ON pd.norec = apd.noregistrasifk
        INNER JOIN ruangan_m ru ON ru.ID = apd.objectruanganfk
        INNER JOIN pelayananpasien_t pp ON apd.norec = pp.noregistrasifk
        WHERE
        pp.tglpelayanan BETWEEN '$tglAwal'
        AND '$tglAkhir'
        $paramKelompok
        AND pd.statusenabled = TRUE
        AND apd.statusenabled = TRUE
        AND ps.statusenabled = TRUE
        AND ru.objectdepartemenfk IN ( 27, 3 )
        and pp.kdprofile=$idProfile
        ORDER BY
        pd.nocmfk,
        pp.tglpelayanan ASC
        )
        SELECT
        nl.id,
        nl.namaruangan,
        COUNT ( nl.hambatankomunikasifk ) FILTER(where nl.hambatankomunikasifk = 1) gangguanbicara,
        COUNT ( nl.hambatankomunikasifk ) FILTER(where nl.hambatankomunikasifk = 2) gangguanlainnya,
        COUNT ( nl.hambatankomunikasifk ) FILTER(where nl.hambatankomunikasifk = 3) gangguanpendengaran,
        COUNT ( nl.hambatankomunikasifk ) FILTER(where nl.hambatankomunikasifk = 4) gangguanpenglihatan,
        COUNT ( nl.hambatankomunikasifk ) FILTER(where nl.hambatankomunikasifk = 5) tidakada

        FROM
        nonlab nl
        INNER JOIN hambatankomunikasi_m hk ON hk.ID = nl.hambatankomunikasifk
        WHERE
        nl.objectdepartemenfk <> 16
            GROUP BY
            nl.namaruangan ,nl.id
            UNION ALL
            SELECT
            l.id,
            l.namaruangan,
            COUNT ( l.hambatankomunikasifk ) FILTER(where l.hambatankomunikasifk = 1) gangguanbicara,
            COUNT ( l.hambatankomunikasifk ) FILTER(where l.hambatankomunikasifk = 2) gangguanlainnya,
            COUNT ( l.hambatankomunikasifk ) FILTER(where l.hambatankomunikasifk = 3) gangguanpendengaran,
            COUNT ( l.hambatankomunikasifk ) FILTER(where l.hambatankomunikasifk = 4) gangguanpenglihatan,
            COUNT ( l.hambatankomunikasifk ) FILTER(where l.hambatankomunikasifk = 5) tidakada
            FROM
            lab l
            INNER JOIN hambatankomunikasi_m hk ON hk.ID = l.hambatankomunikasifk
            WHERE
            l.objectdepartemenfk <> 16
                GROUP BY
                l.namaruangan,l.id
                "));

        $bahasa = DB::select(DB::raw("

            with nonlab as (
            SELECT
            ru.id,
            pd.nocmfk,
            ru.namaruangan,
            apd.objectruanganfk,
            ps.bahasafk,
            ru.objectdepartemenfk
            FROM
            pasiendaftar_t pd
            INNER JOIN pasien_m ps ON ps.ID = pd.nocmfk
            INNER JOIN antrianpasiendiperiksa_t apd ON pd.norec = apd.noregistrasifk
            INNER JOIN ruangan_m ru ON ru.ID = apd.objectruanganfk
            INNER JOIN bahasa_m ba on ba.id = ps.bahasafk
            WHERE
            apd.tglmasuk BETWEEN '$tglAwal'
            AND '$tglAkhir'
            $paramKelompok
            AND pd.statusenabled = TRUE
            AND apd.statusenabled = TRUE
            AND ps.statusenabled = TRUE
            AND ru.objectdepartemenfk NOT IN ( 27, 3 )
            and apd.kdprofile=$idProfile
            GROUP BY
            ru.id,
            pd.nocmfk,
            ru.namaruangan,
            apd.objectruanganfk,
            ps.bahasafk,
            ru.objectdepartemenfk
            ORDER BY
            ru.namaruangan ASC

            ), lab as(
            SELECT
            ru.id,
            pd.nocmfk,
            ru.namaruangan,
            apd.objectruanganfk,
            ps.bahasafk,
            ru.objectdepartemenfk
            FROM
            pasiendaftar_t pd
            INNER JOIN pasien_m ps ON ps.ID = pd.nocmfk
            INNER JOIN antrianpasiendiperiksa_t apd ON pd.norec = apd.noregistrasifk
            INNER JOIN pelayananpasien_t pp on apd.norec = pp.noregistrasifk
            INNER JOIN ruangan_m ru ON ru.ID = apd.objectruanganfk
            INNER JOIN bahasa_m ba on ba.id = ps.bahasafk
            WHERE
            pp.tglpelayanan BETWEEN '$tglAwal'
            AND '$tglAkhir'
            $paramKelompok
            AND pd.statusenabled = TRUE
            AND pp.statusenabled = TRUE
            AND ps.statusenabled = TRUE
            AND ru.objectdepartemenfk IN ( 27, 3 )
            and pp.kdprofile=$idProfile
            GROUP BY
            ru.id,
            pd.nocmfk,
            ru.namaruangan,
            apd.objectruanganfk,
            ps.bahasafk,
            ru.objectdepartemenfk
            ORDER BY
            pd.nocmfk ASC

            )
            SELECT
            nl.id,
            nl.namaruangan,
            COUNT(nl.bahasafk) filter(where nl.bahasafk = 1) asing,
            COUNT(nl.bahasafk) filter(where nl.bahasafk = 2) indonesia,
            COUNT(nl.bahasafk) filter(where nl.bahasafk = 3) daerah,
            COUNT(nl.bahasafk) filter(where nl.bahasafk = 4) isyarat,
            COUNT(nl.bahasafk) filter(where nl.bahasafk not in(1,2,3,4)) lainnya

            FROM nonlab nl
            where
            nl.objectdepartemenfk <>16
                GROUP BY nl.id,nl.namaruangan

                union ALL
                SELECT
                nl.id,
                nl.namaruangan,
                COUNT(nl.bahasafk) filter(where nl.bahasafk = 1) asing,
                COUNT(nl.bahasafk) filter(where nl.bahasafk = 2) indonesia,
                COUNT(nl.bahasafk) filter(where nl.bahasafk = 3) daerah,
                COUNT(nl.bahasafk) filter(where nl.bahasafk = 4) isyarat,
                COUNT(nl.bahasafk) filter(where nl.bahasafk not in(1,2,3,4)) lainnya

                FROM lab nl
                where
                nl.objectdepartemenfk <>16
                    GROUP BY nl.id,nl.namaruangan

                    "));

        $etnis = DB::Select(DB::raw("
            with nonlabrad as (
            SELECT distinct
            ru.id,
            pd.norec,
            pd.nocmfk,
            ru.namaruangan,
            apd.objectruanganfk,
            ps.objectsukufk,
            ru.objectdepartemenfk
            FROM
            pasiendaftar_t pd
            INNER JOIN pasien_m ps ON ps.ID = pd.nocmfk
            INNER JOIN antrianpasiendiperiksa_t apd ON pd.norec = apd.noregistrasifk
            INNER JOIN ruangan_m ru ON ru.ID = apd.objectruanganfk
            INNER JOIN suku_m su on su.id = ps.objectsukufk
            WHERE
            apd.tglmasuk BETWEEN '$tglAwal'
            AND '$tglAkhir'
            $paramKelompok
            AND pd.statusenabled = TRUE
            AND apd.statusenabled = TRUE
            AND ps.statusenabled = TRUE
            AND ru.objectdepartemenfk NOT IN ( 27, 3 )
            and apd.kdprofile=$idProfile
            ORDER BY
            pd.nocmfk ASC
            ), labrad as (
            SELECT distinct
            ru.id,
            pd.norec,
            pd.nocmfk,
            ru.namaruangan,
            apd.objectruanganfk,
            ps.objectsukufk,
            ru.objectdepartemenfk
            FROM
            pasiendaftar_t pd
            INNER JOIN pasien_m ps ON ps.ID = pd.nocmfk
            INNER JOIN antrianpasiendiperiksa_t apd ON pd.norec = apd.noregistrasifk
            INNER JOIN ruangan_m ru ON ru.ID = apd.objectruanganfk
            INNER JOIN suku_m su on su.id = ps.objectsukufk
            		inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
            WHERE
            pp.tglpelayanan BETWEEN '$tglAwal'
            AND '$tglAkhir'
            $paramKelompok
            AND pd.statusenabled = TRUE
            AND apd.statusenabled = TRUE
            AND ps.statusenabled = TRUE
            AND ru.objectdepartemenfk IN ( 27, 3 )

            and apd.kdprofile=$idProfile
            ORDER BY
            pd.nocmfk ASC
            )

            SELECT nl.id, nl.namaruangan, count(nl.objectsukufk) filter(where nl.objectsukufk = 1) as jawa,
            count(nl.objectsukufk) filter(where nl.objectsukufk = 2) as sunda, count(nl.objectsukufk) filter(where
            nl.objectsukufk = 21) as batak, count(nl.objectsukufk) filter(where nl.objectsukufk = 16) as tionhoa,
            count(nl.objectsukufk) filter(where nl.objectsukufk = 9) as papua, count(nl.objectsukufk) filter(where
            nl.objectsukufk not in(1,2,21,16,9)) as lainnya FROM nonlabrad nl where nl.objectdepartemenfk <>16 GROUP BY
                nl.id, nl.namaruangan
                union ALL
                SELECT nl.id, nl.namaruangan, count(nl.objectsukufk) filter(where nl.objectsukufk = 1) as jawa,
                count(nl.objectsukufk) filter(where nl.objectsukufk = 2) as sunda, count(nl.objectsukufk) filter(where
                nl.objectsukufk = 21) as batak, count(nl.objectsukufk) filter(where nl.objectsukufk = 16) as tionhoa,
                count(nl.objectsukufk) filter(where nl.objectsukufk = 9) as papua, count(nl.objectsukufk) filter(where
                nl.objectsukufk not in(1,2,21,16,9)) as lainnya FROM labrad nl where nl.objectdepartemenfk <>16 GROUP BY
                    nl.id, nl.namaruangan
                    "));
        $detail = [];
        //jmlhambatan
        $gangguanbicara = 0;
        $gangguanlainnya = 0;
        $gangguanpendengaran = 0;
        $gangguanpenglihatan = 0;
        $tidakada = 0;
        //bahasa
        $indonesia = 0;
        $daerah = 0;
        $isyarat = 0;
        $lainnya1 = 0;
        $asing = 0;

        //etnis
        $jawa = 0;
        $sunda = 0;
        $batak = 0;
        $tionhoa = 0;
        $papua = 0;
        $lainnya2 = 0;
        //total
        $totalbahasa = 0;
        $totaletnis = 0;
        $totalhambatan = 0;

        foreach ($ruangan as $ru) {
            $gangguanbicara = 0;
            $gangguanlainnya = 0;
            $gangguanpendengaran = 0;
            $gangguanpenglihatan = 0;
            $tidakada = 0;

            $indonesia = 0;
            $daerah = 0;
            $isyarat = 0;
            $lainnya1 = 0;
            $asing = 0;

            $jawa = 0;
            $sunda = 0;
            $batak = 0;
            $tionhoa = 0;
            $papua = 0;
            $lainnya2 = 0;
            $totalbahasa = 0;
            $totaletnis = 0;
            $totalhambatan = 0;

            foreach ($hambatan as $hb) {
                if ($ru->id == $hb->id) {
                    $gangguanbicara = $hb->gangguanbicara;
                    $gangguanlainnya = $hb->gangguanlainnya;
                    $gangguanpendengaran = $hb->gangguanpendengaran;
                    $gangguanpenglihatan = $hb->gangguanpenglihatan;
                    $tidakada = $hb->tidakada;
                    break;
                } else {
                    $gangguanbicara = 0;
                    $gangguanlainnya = 0;
                    $gangguanpendengaran = 0;
                    $gangguanpenglihatan = 0;
                    $tidakada = 0;
                }
            }

            foreach ($bahasa as $ba) {
                if ($ru->id == $ba->id) {
                    $indonesia = $ba->indonesia;
                    $asing = $ba->asing;
                    $daerah = $ba->daerah;
                    $isyarat = $ba->isyarat;
                    $lainnya1 = $ba->lainnya;
                    break;
                } else {
                    $indonesia = 0;
                    $daerah = 0;
                    $isyarat = 0;
                    $lainnya1 = 0;
                    $asing = 0;
                }
            }

            foreach ($etnis as $et) {
                if ($ru->id == $et->id) {
                    $jawa = $et->jawa;
                    $sunda = $et->sunda;
                    $batak = $et->batak;
                    $tionhoa = $et->tionhoa;
                    $papua = $et->papua;
                    $lainnya2 = $et->lainnya;
                    break;
                } else {
                    $jawa = 0;
                    $sunda = 0;
                    $batak = 0;
                    $tionhoa = 0;
                    $papua = 0;
                    $lainnya2 = 0;
                }
            }

            $totalhambatan = $gangguanbicara + $gangguanlainnya + $gangguanpendengaran + $gangguanpenglihatan + $tidakada;
            $totalbahasa = $indonesia + $asing + $daerah + $isyarat + $lainnya1;
            $totaletnis = $jawa + $sunda + $papua + $batak + $lainnya2 + $tionhoa;

            $detail[] = array(
                'namaruangan' => $ru->namaruangan,
                'gangguanbicara' => $gangguanbicara,
                'gangguanlainnya' => $gangguanlainnya,
                'gangguanpendengaran' => $gangguanpendengaran,
                'gangguanpenglihatan' => $gangguanpenglihatan,
                'tidakada' => $tidakada,
                'indonesia' => $indonesia,
                'daerah' => $daerah,
                'isyarat' => $isyarat,
                'lainnya1' => $lainnya1,
                'asing' => $asing,
                'jawa' => $jawa,
                'sunda' => $sunda,
                'batak' => $batak,
                'tionhoa' => $tionhoa,
                'papua' => $papua,
                'lainnya2' => $lainnya2,
                'totalhambatan' => $totalhambatan,
                'totalbahasa' => $totalbahasa,
                'totaletnis' => $totaletnis,

            );
        }
        $result = array(
            'detail' => $detail,
        );

        return $this->respond($result);
    }


    public function getLaporanSummaryKunjungan(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $data = [];
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $ruanganId = $request['ruanganId'];
        $kelompokId = $request['kelompokPasien'];
        $jenispelayananId = $request['jenisPelayanan'];

        $paramRuangan = ' ';
        if (isset($ruanganId) && $ruanganId != "" && $ruanganId != "undefined") {
            $paramRuangan = ' and pd.objectruanganlastfk = ' . $ruanganId;
        }

        $paramKelompok = ' ';
        if (isset($kelompokId) && $kelompokId != "" && $kelompokId != "undefined") {
            $paramKelompok = ' and pd.objectkelompokpasienlastfk = ' . $kelompokId;
        }

        $paramJenisPelayanan = ' ';
        if (isset($jenispelayananId) && $jenispelayananId != "" && $jenispelayananId != "undefined") {
            if ($jenispelayananId == 1) {
                $paramJenisPelayanan = ' and ru.iseksekutif = false';
            } else {
                $paramJenisPelayanan = ' and ru.iseksekutif = true';
            }
        }

        $deptRawatJalan = $this->settingDataFixed('kdDepartemenRawatJalanFix', $kdProfile);

        // $data = DB::select(DB::raw("SELECT ru.namaruangan,kp.kelompokpasien,CASE WHEN jk.id = 1 THEN 1 ELSE 0 END AS laki,
        //          CASE WHEN jk.id = 2 THEN 1 ELSE 0 END AS wanita,CASE WHEN pd.statuspasien = 'BARU' THEN 1 ELSE 0 END AS baru,
        //          CASE WHEN pd.statuspasien = 'LAMA' THEN 1 WHEN pd.statuspasien = '' THEN 1 ELSE 0 END AS lama
        //         FROM pasiendaftar_t as pd
        //         INNER JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
        //         INNER JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
        //         INNER JOIN pasien_m as ps on ps.id = pd.nocmfk
        //         LEFT JOIN jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk
        //         WHERE pd.kdprofile = $idProfile and pd.tglregistrasi BETWEEN '$tglAwal' AND '$tglAkhir'
        //         and ru.objectdepartemenfk in ($deptRawatJalan)
        //         $paramRuangan $paramKelompok "
        // )
        // );
        $data = DB::select(DB::raw("SELECT x.namaruangan,SUM(x.lakibaru) AS lakibaru,SUM(x.lakilama) AS lakilama,SUM(x.wanitabaru) AS wanitabaru,SUM(x.wanitalama) AS wanitalama,
                SUM(x.tunai) as tunai,SUM(x.bpjs) as bpjs,SUM(x.swasta) as swasta,SUM(x.hardient) as hardient,
                SUM(x.iks) as iks,SUM(x.thamrin) as thamrin,SUM(x.jamsostek) as jamsostek,SUM(x.jamkesda)as jamkesda,
                SUM(x.skmm) as skmm,SUM(x.karyawan) as karyawan,SUM(x.jamkesmas) as jamkesmas,
                SUM(x.tunai)+SUM(x.bpjs)+SUM(x.swasta)+SUM(x.hardient)+SUM(x.iks)+SUM(x.jamsostek)+SUM(x.jamkesmas)+SUM(x.jamkesda)+SUM(x.skmm)+SUM(x.karyawan)+SUM(x.thamrin) as jml
                FROM (
                    SELECT ru.namaruangan,
                    CASE WHEN jk.id = 1 and pd.statuspasien = 'BARU'  THEN 1 ELSE 0 END AS lakibaru,
                CASE WHEN jk.id = 1 and pd.statuspasien = 'LAMA'  THEN 1 ELSE 0 END AS lakilama,
                CASE WHEN jk.id = 2 and pd.statuspasien = 'BARU' THEN 1 ELSE 0 END AS wanitabaru,
                CASE WHEN jk.id = 2 and pd.statuspasien = 'LAMA' THEN 1 ELSE 0 END AS wanitalama,
                CASE WHEN pd.objectkelompokpasienlastfk = 1 THEN 1 ELSE 0 END AS tunai,
                CASE WHEN pd.objectkelompokpasienlastfk in (2,11) THEN 1 ELSE 0 END AS bpjs,
                CASE WHEN pd.objectkelompokpasienlastfk = 3 
                and pd.objectrekananfk NOT IN (5906,581183,581184,581185,581186,581187,581140,581136,581162,581187,581188,581165,581168,
                806,581189,581169,581170,581171,581190,581173,581174,581175,581176,581177,581178,581179,
                581180,3269,581182,581191,735,1903,2115,1927,150) THEN 1 ELSE 0 END AS swasta,
                CASE WHEN pd.objectkelompokpasienlastfk = 3 and pd.objectrekananfk IN (581191) THEN 1 ELSE 0 END AS hardient,
                CASE WHEN pd.objectkelompokpasienlastfk = 3 and pd.objectrekananfk IN (5906,581183,581184,581185,581186,581187,581140,581136,581162,581187,581188,581165,581168,
                806,581189,581169,581170,581171,581190,581173,581174,581175,581176,581177,581178,581179,
                581180,3269,581182) THEN 1 ELSE 0 END AS iks,
                CASE WHEN pd.objectkelompokpasienlastfk = 3
                and pd.objectrekananfk IN (735,1903,2115,1927,150) THEN 1 ELSE 0 END AS thamrin,
                CASE WHEN pd.objectkelompokpasienlastfk in (14) THEN 1 ELSE 0 END AS jamsostek,			 
                CASE WHEN pd.objectkelompokpasienlastfk in (8) THEN 1 ELSE 0 END AS jamkesda,
                CASE WHEN pd.objectkelompokpasienlastfk in (15) THEN 1 ELSE 0 END AS skmm,
                CASE WHEN pd.objectkelompokpasienlastfk in (12) THEN 1 ELSE 0 END AS karyawan,
                CASE WHEN pd.objectkelompokpasienlastfk in (17) THEN 1 ELSE 0 END AS jamkesmas 
                FROM pasiendaftar_t AS pd
                INNER JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
                INNER JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
                INNER JOIN pasien_m as ps on ps.id = pd.nocmfk
                LEFT JOIN jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk
                WHERE pd.tglregistrasi BETWEEN '$tglAwal' AND '$tglAkhir' AND pd.statusenabled=true
                AND ru.objectdepartemenfk in (18,24) and pd.kdprofile=$idProfile $paramRuangan $paramKelompok $paramJenisPelayanan) as x
                GROUP BY x.namaruangan
                ORDER BY x.namaruangan ASC"));
        return $this->respond($data);
    }

    public function getLaporanSummaryPendidikan(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $data = [];
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $ruanganId = $request['ruanganId'];
        $kelompokId = $request['kelompokPasien'];
        $jenispelayananId = $request['jenisPelayanan'];

        $paramRuangan = ' ';
        if (isset($ruanganId) && $ruanganId != "" && $ruanganId != "undefined") {
            $paramRuangan = ' and pd.objectruanganlastfk = ' . $ruanganId;
        }

        $paramKelompok = ' ';
        if (isset($kelompokId) && $kelompokId != "" && $kelompokId != "undefined") {
            $paramKelompok = ' and pd.objectkelompokpasienlastfk = ' . $kelompokId;
        }

        $paramJenisPelayanan = ' ';
        if (isset($jenispelayananId) && $jenispelayananId != "" && $jenispelayananId != "undefined") {
            if ($jenispelayananId == 1) {
                $paramJenisPelayanan = ' and ru.iseksekutif = false';
            } else {
                $paramJenisPelayanan = ' and ru.iseksekutif = true';
            }
        }

        $deptRawatJalan = $this->settingDataFixed('kdDepartemenRawatJalanFix', $kdProfile);

        // $data = DB::select(DB::raw("select
        //     apd.tglregistrasi,
        //     -- COUNT(pd.noregistrasi) AS jumlah,
        //     CASE WHEN apd.objectruanganfk IN (565,566,567,577,564,563,564,570) THEN 1 ELSE 0 END AS PSIKIATRI,
        //     CASE WHEN apd.objectruanganfk IN (558,568,569,561,559,575,574,576,576,560,562,573) THEN 1 ELSE 0 END AS NONPSI,
        //     ru.namaruangan,
        //     jk.jeniskelamin,
        //     kp.kelompokpasien,
        //     apd.objectruanganfk,
        //     ru.objectdepartemenfk,
        //     ps.objectpendidikanfk,
        //     pe.pendidikan
        //     from antrianpasiendiperiksa_t as apd
        //     INNER JOIN pasiendaftar_t as pd ON pd.norec=apd.noregistrasifk
        //     INNER JOIN ruangan_m as ru On ru.id=apd.objectruanganfk
        //     INNER JOIN kelompokpasien_m as kp on kp.id=pd.objectkelompokpasienlastfk
        //     INNER JOIN pasien_m as ps on ps.id=pd.nocmfk
        //     INNER JOIN jeniskelamin_m as jk on jk.id=ps.objectjeniskelaminfk
        //     inner JOIN  pendidikan_m as pe on pe.id=ps.objectpendidikanfk
        //     where apd.kdprofile = $idProfile and apd.tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir' AND ru.objectdepartemenfk IN (18,26,3,6,24,34,27)
        //     --and ru.objectdepartemenfk=18
        //     GROUP BY apd.tglregistrasi,ru.namaruangan,
        //     jk.jeniskelamin,
        //     kp.kelompokpasien,
        //     apd.objectruanganfk,
        //     ru.objectdepartemenfk,ps.objectpendidikanfk,
        //     pe.pendidikan
        //     ORDER BY ps.objectpendidikanfk asc "
        // )
        // );
        $data = DB::select(DB::raw("SELECT x.pendidikan,SUM(x.laki) AS laki,SUM(x.wanita) AS wanita,SUM(x.baru) as baru,SUM(x.lama) as lama,
                    SUM(x.tunai) as tunai,SUM(x.bpjs) as bpjs,SUM(x.swasta) as swasta,SUM(x.hardient) as hardient,
                    SUM(x.iks) as iks,SUM(x.thamrin) as thamrin,SUM(x.jamsostek) as jamsostek,SUM(x.jamkesda)as jamkesda,
                    SUM(x.skmm) as skmm,SUM(x.karyawan) as karyawan,SUM(x.jamkesmas) as jamkesmas,
                    SUM(x.tunai)+SUM(x.bpjs)+SUM(x.swasta)+SUM(x.hardient)+SUM(x.iks)+SUM(x.jamsostek)+SUM(x.jamkesmas)+SUM(x.jamkesda)+SUM(x.skmm)+SUM(x.karyawan)+SUM(x.thamrin) as jml
                    FROM (SELECT pe.pendidikan,CASE WHEN jk.id = 1 THEN 1 ELSE 0 END AS laki,
                    CASE WHEN jk.id = 2 THEN 1 ELSE 0 END AS wanita,CASE WHEN pd.statuspasien = 'BARU' THEN 1 ELSE 0 END AS baru,
                    CASE WHEN pd.statuspasien = 'LAMA' THEN 1 WHEN pd.statuspasien = '' THEN 1 ELSE 0 END AS lama,
                    CASE WHEN pd.objectkelompokpasienlastfk = 1 THEN 1 ELSE 0 END AS tunai,
                    CASE WHEN pd.objectkelompokpasienlastfk in (2,11) THEN 1 ELSE 0 END AS bpjs,
                    CASE WHEN pd.objectkelompokpasienlastfk = 3 
                    and pd.objectrekananfk NOT IN (5906,581183,581184,581185,581186,581187,581140,581136,581162,581187,581188,581165,581168,
                    806,581189,581169,581170,581171,581190,581173,581174,581175,581176,581177,581178,581179,
                    581180,3269,581182,581191,735,1903,2115,1927,150) THEN 1 ELSE 0 END AS swasta,
                    CASE WHEN pd.objectkelompokpasienlastfk = 3 and pd.objectrekananfk IN (581191) THEN 1 ELSE 0 END AS hardient,
                    CASE WHEN pd.objectkelompokpasienlastfk = 3 and pd.objectrekananfk IN (5906,581183,581184,581185,581186,581187,581140,581136,581162,581187,581188,581165,581168,
                    806,581189,581169,581170,581171,581190,581173,581174,581175,581176,581177,581178,581179,
                    581180,3269,581182) THEN 1 ELSE 0 END AS iks,
                    CASE WHEN pd.objectkelompokpasienlastfk = 3
                    and pd.objectrekananfk IN (735,1903,2115,1927,150) THEN 1 ELSE 0 END AS thamrin,
                    CASE WHEN pd.objectkelompokpasienlastfk in (14) THEN 1 ELSE 0 END AS jamsostek,			 
                    CASE WHEN pd.objectkelompokpasienlastfk in (8) THEN 1 ELSE 0 END AS jamkesda,
                    CASE WHEN pd.objectkelompokpasienlastfk in (15) THEN 1 ELSE 0 END AS skmm,
                    CASE WHEN pd.objectkelompokpasienlastfk in (12) THEN 1 ELSE 0 END AS karyawan,
                    CASE WHEN pd.objectkelompokpasienlastfk in (17) THEN 1 ELSE 0 END AS jamkesmas 
                    FROM pasiendaftar_t AS pd
                    INNER JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
                    INNER JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
                    INNER JOIN pasien_m as ps on ps.id = pd.nocmfk
                    LEFT JOIN jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk
                    inner JOIN  pendidikan_m as pe on pe.id=ps.objectpendidikanfk
                    WHERE pd.tglregistrasi BETWEEN '$tglAwal' AND '$tglAkhir' AND pd.statusenabled=true
                    AND ru.objectdepartemenfk=18 and pd.kdprofile=$idProfile $paramRuangan $paramKelompok $paramJenisPelayanan) as x
                    GROUP BY x.pendidikan
                    ORDER BY x.pendidikan ASC"));
        return $this->respond($data);
    }

    public function getLaporanSummaryDaerah(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $data = [];
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $ruanganId = $request['ruanganId'];
        $kelompokId = $request['kelompokPasien'];
        $jenispelayananId = $request['jenisPelayanan'];

        $paramRuangan = ' ';
        if (isset($ruanganId) && $ruanganId != "" && $ruanganId != "undefined") {
            $paramRuangan = ' and pd.objectruanganlastfk = ' . $ruanganId;
        }

        $paramKelompok = ' ';
        if (isset($kelompokId) && $kelompokId != "" && $kelompokId != "undefined") {
            $paramKelompok = ' and pd.objectkelompokpasienlastfk = ' . $kelompokId;
        }

        $paramJenisPelayanan = ' ';
        if (isset($jenispelayananId) && $jenispelayananId != "" && $jenispelayananId != "undefined") {
            if ($jenispelayananId == 1) {
                $paramJenisPelayanan = ' and ru.iseksekutif = false';
            } else {
                $paramJenisPelayanan = ' and ru.iseksekutif = true';
            }
        }

        $deptRawatJalan = $this->settingDataFixed('kdDepartemenRawatJalanFix', $kdProfile);

        // $data = DB::select(DB::raw("select
        //     apd.tglregistrasi,
        //     -- COUNT(pd.noregistrasi) AS jumlah,
        //     CASE WHEN apd.objectruanganfk IN (565,566,567,577,564,563,564) THEN 1 ELSE 0 END AS PSIKIATRI,
        //     CASE WHEN apd.objectruanganfk IN (558,568,569,561,559,575,574,576,576,560,562,573) THEN 1 ELSE 0 END AS NONPSI,
        //     ru.namaruangan,
        //     jk.jeniskelamin,
        //     kp.kelompokpasien,
        //     apd.objectruanganfk,
        //     ru.objectdepartemenfk,
        //     al.objectkotakabupatenfk,
        //     kb.namakotakabupaten
        //     from antrianpasiendiperiksa_t as apd
        //     INNER JOIN pasiendaftar_t as pd ON pd.norec=apd.noregistrasifk
        //     INNER JOIN ruangan_m as ru On ru.id=apd.objectruanganfk
        //     INNER JOIN kelompokpasien_m as kp on kp.id=pd.objectkelompokpasienlastfk
        //     INNER JOIN pasien_m as ps on ps.id=pd.nocmfk
        //     INNER JOIN jeniskelamin_m as jk on jk.id=ps.objectjeniskelaminfk
        //     INNER JOIN alamat_m as al on al.nocmfk=ps.id
        //     INNER JOIN kotakabupaten_m as kb on kb.id=al.objectkotakabupatenfk
        //     where apd.kdprofile = $idProfile and apd.tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir' and ru.objectdepartemenfk IN ($deptRawatJalan)
        //         $paramRuangan $paramKelompok
        //     --and ru.objectdepartemenfk=18
        //     GROUP BY apd.tglregistrasi,ru.namaruangan,
        //     jk.jeniskelamin,
        //     kp.kelompokpasien,
        //     apd.objectruanganfk,
        //     ru.objectdepartemenfk,al.objectkotakabupatenfk,
        //     kb.namakotakabupaten"
        // )
        // );
        $data = DB::select(DB::raw("SELECT x.namakotakabupaten,SUM(x.laki) AS laki,SUM(x.wanita) AS wanita,SUM(x.baru) as baru,SUM(x.lama) as lama,
                    SUM(x.tunai) as tunai,SUM(x.bpjs) as bpjs,SUM(x.swasta) as swasta,SUM(x.hardient) as hardient,
                    SUM(x.iks) as iks,SUM(x.thamrin) as thamrin,SUM(x.jamsostek) as jamsostek,SUM(x.jamkesda)as jamkesda,
                    SUM(x.skmm) as skmm,SUM(x.karyawan) as karyawan,SUM(x.jamkesmas) as jamkesmas,
                    SUM(x.tunai)+SUM(x.bpjs)+SUM(x.swasta)+SUM(x.hardient)+SUM(x.iks)+SUM(x.jamsostek)+SUM(x.jamkesmas)+SUM(x.jamkesda)+SUM(x.skmm)+SUM(x.karyawan)+SUM(x.thamrin) as jml
                    FROM (SELECT kb.namakotakabupaten,CASE WHEN jk.id = 1 THEN 1 ELSE 0 END AS laki,
                    CASE WHEN jk.id = 2 THEN 1 ELSE 0 END AS wanita,CASE WHEN pd.statuspasien = 'BARU' THEN 1 ELSE 0 END AS baru,
                    CASE WHEN pd.statuspasien = 'LAMA' THEN 1 WHEN pd.statuspasien = '' THEN 1 ELSE 0 END AS lama,
                    CASE WHEN pd.objectkelompokpasienlastfk = 1 THEN 1 ELSE 0 END AS tunai,
                    CASE WHEN pd.objectkelompokpasienlastfk in (2,11) THEN 1 ELSE 0 END AS bpjs,
                    CASE WHEN pd.objectkelompokpasienlastfk = 3 
                    and pd.objectrekananfk NOT IN (5906,581183,581184,581185,581186,581187,581140,581136,581162,581187,581188,581165,581168,
                    806,581189,581169,581170,581171,581190,581173,581174,581175,581176,581177,581178,581179,
                    581180,3269,581182,581191,735,1903,2115,1927,150) THEN 1 ELSE 0 END AS swasta,
                    CASE WHEN pd.objectkelompokpasienlastfk = 3 and pd.objectrekananfk IN (581191) THEN 1 ELSE 0 END AS hardient,
                    CASE WHEN pd.objectkelompokpasienlastfk = 3 and pd.objectrekananfk IN (5906,581183,581184,581185,581186,581187,581140,581136,581162,581187,581188,581165,581168,
                    806,581189,581169,581170,581171,581190,581173,581174,581175,581176,581177,581178,581179,
                    581180,3269,581182) THEN 1 ELSE 0 END AS iks,
                    CASE WHEN pd.objectkelompokpasienlastfk = 3
                    and pd.objectrekananfk IN (735,1903,2115,1927,150) THEN 1 ELSE 0 END AS thamrin,
                    CASE WHEN pd.objectkelompokpasienlastfk in (14) THEN 1 ELSE 0 END AS jamsostek,			 
                    CASE WHEN pd.objectkelompokpasienlastfk in (8) THEN 1 ELSE 0 END AS jamkesda,
                    CASE WHEN pd.objectkelompokpasienlastfk in (15) THEN 1 ELSE 0 END AS skmm,
                    CASE WHEN pd.objectkelompokpasienlastfk in (12) THEN 1 ELSE 0 END AS karyawan,
                    CASE WHEN pd.objectkelompokpasienlastfk in (17) THEN 1 ELSE 0 END AS jamkesmas 
                    FROM pasiendaftar_t AS pd
                    INNER JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
                    INNER JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
                    INNER JOIN pasien_m as ps on ps.id = pd.nocmfk
                    LEFT JOIN jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk
                    inner JOIN  pendidikan_m as pe on pe.id=ps.objectpendidikanfk
                    INNER JOIN alamat_m as al on al.nocmfk=ps.id
                    INNER JOIN kotakabupaten_m as kb on kb.id=al.objectkotakabupatenfk
                    WHERE pd.tglregistrasi BETWEEN '$tglAwal' AND '$tglAkhir' AND pd.statusenabled=true
                    AND ru.objectdepartemenfk=18 and pd.kdprofile=$idProfile $paramRuangan $paramKelompok $paramJenisPelayanan) as x
                    GROUP BY x.namakotakabupaten
                    ORDER BY x.namakotakabupaten ASC"));
        return $this->respond($data);
    }

    public function getLaporanSummaryPekerjaan(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $data = [];
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $ruanganId = $request['ruanganId'];
        $kelompokId = $request['kelompokPasien'];
        $jenispelayananId = $request['jenisPelayanan'];

        $paramRuangan = ' ';
        if (isset($ruanganId) && $ruanganId != "" && $ruanganId != "undefined") {
            $paramRuangan = ' and pd.objectruanganlastfk = ' . $ruanganId;
        }

        $paramKelompok = ' ';
        if (isset($kelompokId) && $kelompokId != "" && $kelompokId != "undefined") {
            $paramKelompok = ' and pd.objectkelompokpasienlastfk = ' . $kelompokId;
        }

        $paramJenisPelayanan = ' ';
        if (isset($jenispelayananId) && $jenispelayananId != "" && $jenispelayananId != "undefined") {
            if ($jenispelayananId == 1) {
                $paramJenisPelayanan = ' and ru.iseksekutif = false';
            } else {
                $paramJenisPelayanan = ' and ru.iseksekutif = true';
            }
        }

        $deptRawatJalan = $this->settingDataFixed('kdDepartemenRawatJalanFix', $kdProfile);

        // $data = DB::select(DB::raw("select
        //     apd.tglregistrasi,
        //     -- COUNT(pd.noregistrasi) AS jumlah,
        //     CASE WHEN apd.objectruanganfk IN (565,566,567,577,564,563,564) THEN 1 ELSE 0 END AS PSIKIATRI,
        //     CASE WHEN apd.objectruanganfk IN (558,568,569,561,559,575,574,576,576,560,562,573) THEN 1 ELSE 0 END AS NONPSI,
        //     ru.namaruangan,
        //     jk.jeniskelamin,
        //     kp.kelompokpasien,
        //     apd.objectruanganfk,
        //     ru.objectdepartemenfk,
        //     al.objectkotakabupatenfk,
        //     kb.namakotakabupaten,
        //     pek.pekerjaan
        //     from antrianpasiendiperiksa_t as apd
        //     INNER JOIN pasiendaftar_t as pd ON pd.norec=apd.noregistrasifk
        //     INNER JOIN ruangan_m as ru On ru.id=apd.objectruanganfk
        //     INNER JOIN kelompokpasien_m as kp on kp.id=pd.objectkelompokpasienlastfk
        //     INNER JOIN pasien_m as ps on ps.id=pd.nocmfk
        //     INNER JOIN jeniskelamin_m as jk on jk.id=ps.objectjeniskelaminfk
        //     INNER JOIN alamat_m as al on al.nocmfk=ps.id
        //     INNER JOIN kotakabupaten_m as kb on kb.id=al.objectkotakabupatenfk
        //     INNER JOIN pekerjaan_m as pek on pek.id=ps.objectpekerjaanfk
        //     where apd.kdprofile = $idProfile and apd.tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir'  AND ru.objectdepartemenfk IN ($deptRawatJalan)
        //         $paramRuangan $paramKelompok
        //   "
        // )
        // );
        $data = DB::select(DB::raw("SELECT x.pekerjaan,SUM(x.laki) AS laki,SUM(x.wanita) AS wanita,SUM(x.baru) as baru,SUM(x.lama) as lama,
                    SUM(x.tunai) as tunai,SUM(x.bpjs) as bpjs,SUM(x.swasta) as swasta,SUM(x.hardient) as hardient,
                    SUM(x.iks) as iks,SUM(x.thamrin) as thamrin,SUM(x.jamsostek) as jamsostek,SUM(x.jamkesda)as jamkesda,
                    SUM(x.skmm) as skmm,SUM(x.karyawan) as karyawan,SUM(x.jamkesmas) as jamkesmas,
                    SUM(x.tunai)+SUM(x.bpjs)+SUM(x.swasta)+SUM(x.hardient)+SUM(x.iks)+SUM(x.jamsostek)+SUM(x.jamkesmas)+SUM(x.jamkesda)+SUM(x.skmm)+SUM(x.karyawan)+SUM(x.thamrin) as jml
                    FROM (SELECT pek.pekerjaan,CASE WHEN jk.id = 1 THEN 1 ELSE 0 END AS laki,
                    CASE WHEN jk.id = 2 THEN 1 ELSE 0 END AS wanita,CASE WHEN pd.statuspasien = 'BARU' THEN 1 ELSE 0 END AS baru,
                    CASE WHEN pd.statuspasien = 'LAMA' THEN 1 WHEN pd.statuspasien = '' THEN 1 ELSE 0 END AS lama,
                    CASE WHEN pd.objectkelompokpasienlastfk = 1 THEN 1 ELSE 0 END AS tunai,
                    CASE WHEN pd.objectkelompokpasienlastfk in (2,11) THEN 1 ELSE 0 END AS bpjs,
                    CASE WHEN pd.objectkelompokpasienlastfk = 3 
                    and pd.objectrekananfk NOT IN (5906,581183,581184,581185,581186,581187,581140,581136,581162,581187,581188,581165,581168,
                    806,581189,581169,581170,581171,581190,581173,581174,581175,581176,581177,581178,581179,
                    581180,3269,581182,581191,735,1903,2115,1927,150) THEN 1 ELSE 0 END AS swasta,
                    CASE WHEN pd.objectkelompokpasienlastfk = 3 and pd.objectrekananfk IN (581191) THEN 1 ELSE 0 END AS hardient,
                    CASE WHEN pd.objectkelompokpasienlastfk = 3 and pd.objectrekananfk IN (5906,581183,581184,581185,581186,581187,581140,581136,581162,581187,581188,581165,581168,
                    806,581189,581169,581170,581171,581190,581173,581174,581175,581176,581177,581178,581179,
                    581180,3269,581182) THEN 1 ELSE 0 END AS iks,
                    CASE WHEN pd.objectkelompokpasienlastfk = 3
                    and pd.objectrekananfk IN (735,1903,2115,1927,150) THEN 1 ELSE 0 END AS thamrin,
                    CASE WHEN pd.objectkelompokpasienlastfk in (14) THEN 1 ELSE 0 END AS jamsostek,			 
                    CASE WHEN pd.objectkelompokpasienlastfk in (8) THEN 1 ELSE 0 END AS jamkesda,
                    CASE WHEN pd.objectkelompokpasienlastfk in (15) THEN 1 ELSE 0 END AS skmm,
                    CASE WHEN pd.objectkelompokpasienlastfk in (12) THEN 1 ELSE 0 END AS karyawan,
                    CASE WHEN pd.objectkelompokpasienlastfk in (17) THEN 1 ELSE 0 END AS jamkesmas 
                    FROM pasiendaftar_t AS pd
                    INNER JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
                    INNER JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
                    INNER JOIN pasien_m as ps on ps.id = pd.nocmfk
                    LEFT JOIN jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk
                    inner JOIN  pendidikan_m as pe on pe.id=ps.objectpendidikanfk
                    INNER JOIN alamat_m as al on al.nocmfk=ps.id
                    INNER JOIN kotakabupaten_m as kb on kb.id=al.objectkotakabupatenfk
                    INNER JOIN pekerjaan_m as pek on pek.id=ps.objectpekerjaanfk
                    WHERE pd.tglregistrasi BETWEEN '$tglAwal' AND '$tglAkhir' AND pd.statusenabled=true
                    AND ru.objectdepartemenfk=18 and pd.kdprofile=$idProfile $paramRuangan $paramKelompok $paramJenisPelayanan) as x
                    GROUP BY x.pekerjaan
                    ORDER BY x.pekerjaan ASC"));
        return $this->respond($data);
    }

    public function getDataComboSummary(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $deptJalan = explode(',', $this->settingDataFixed('kdDepartemenRawatJalanFix', $kdProfile));
        $deptLab = explode(',', $this->settingDataFixed('KdDepartemenInstalasiLaboratorium', $kdProfile));
        $kdDepartemenRawatJalan = [];
        $kdDepartemenLab = [];
        foreach ($deptJalan as $item) {
            $kdDepartemenRawatJalan[] =  (int)$item;
        }
        foreach ($deptLab as $item) {
            $kdDepartemenLab[] =  (int)$item;
        }

        $dataRuanganJalan = \DB::table('ruangan_m as ru')
            ->select('ru.id', 'ru.namaruangan', 'ru.objectdepartemenfk')
            ->where('ru.kdprofile', $idProfile)
            ->where('ru.statusenabled', true)
            ->wherein('ru.objectdepartemenfk', $kdDepartemenRawatJalan)
            ->orderBy('ru.namaruangan')
            ->get();

        $dataRuanganLab = \DB::table('ruangan_m as ru')
            ->select('ru.id', 'ru.namaruangan', 'ru.objectdepartemenfk')
            ->where('ru.kdprofile', $idProfile)
            ->where('ru.statusenabled', true)
            ->wherein('ru.objectdepartemenfk', $deptLab)
            ->orderBy('ru.namaruangan')
            ->get();

        $result = array(
            'ruanganrajal' => $dataRuanganJalan,
            'ruanganlab' => $dataRuanganLab,
            'message' => 'ramdanegie',
        );

        return $this->respond($result);
    }

    // 2019-12 penambahan arif awal
    public function getDaftarRegistrasiPasienOperatordblama(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $filter = $request->all();
        $data = \DB::connection('sqlsrv2')
            ->table('KUNJUNGANPASIEN as kp')
            ->join('pasien as p', 'p.KD_PASIEN', '=', 'kp.KPKD_PASIEN')
            ->join('DOKTER as dok', 'dok.FMDDOKTER_ID', '=', 'kp.KPKD_DOKTER')
            ->join('CUSTOMER as cus', 'cus.CUSID', '=', 'kp.KD_CUSTOMER')
            ->join('POLIKLINIK as pol', 'pol.FMPKLINIK_ID', '=', 'kp.KPKD_POLY')
            ->limit('10')
            ->select(
                'kp.KPKD_PASIEN as norec',
                'p.NAMAPASIEN as namapasien',
                'kp.KPTGL_PERIKSA as tglregistrasi',
                'kp.KPNO_TRANSAKSI as notransaksi',
                'pol.FMPKLINIKN as poliklinik',
                'dok.FMDDOKTERN as namadokter',
                'cus.NAME as carabayar',
                'kp.KPJAM_MASUK as jam_masuk'
            )
            ->where('kp.KPKD_POLY', '!=', 'PK011');
        // if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
        //     $data = $data->where('kp.KPTGL_PERIKSA', '>=', $filter['tglAwal']);
        // }
        // if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
        //     $data = $data->where('kp.KPTGL_PERIKSA', '<=', $filter['tglAkhir']);
        // }
        if (isset($filter['norm']) && $filter['norm'] != "" && $filter['norm'] != "undefined") {
            $data = $data->where('kp.KPKD_PASIEN', 'ilike', '%' . $filter['norm'] . '%');
        }
        if (isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $data = $data->where('p.NAMAPASIEN', 'ilike', '%' . $filter['nama'] . '%');
        }
        if (isset($filter['jmlRows']) && $filter['jmlRows'] != "" && $filter['jmlRows'] != "undefined") {
            $data = $data->take($filter['jmlRows']);
        }
        if (isset($filter['kelId']) && $filter['kelId'] != "" && $filter['kelId'] != "undefined") {
            $data = $data->where('kp.KD_CUSTOMER', '=', $filter['kelId']);
        }
        if (isset($filter['dokId']) && $filter['dokId'] != "" && $filter['dokId'] != "undefined") {
            $data = $data->where('kp.KPKD_DOKTER', '=', $filter['dokId']);
        }
        if (isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined") {
            $data = $data->where('kp.KPKD_POLY', '=', $filter['ruangId']);
        }

        $data = $data->orderBy('KP.KPTGL_PERIKSA', 'DESC');

        $data = $data->get();
        return $this->respond($data);
    }

    public function getDataComboOperatordblama(Request $request)
    {
        $dataKelompok = \DB::connection('sqlsrv2')
            ->table('CUSTOMER as cus')
            ->join('KUNJUNGANPASIEN as kp', 'kp.KD_CUSTOMER', '=', 'cus.CUSID')
            ->select('cus.CUSID as id', 'cus.NAME as kelompokpasien')
            ->groupBy('cus.CUSID', 'cus.NAME')
            ->orderBy('cus.CUSID', 'desc')
            ->get();

        $dataRuangan = \DB::connection('sqlsrv2')
            ->table('POLIKLINIK as pol')
            ->join('KUNJUNGANPASIEN as kp', 'kp.KPKD_POLY', '=', 'pol.FMPKLINIK_ID')
            ->select('pol.FMPKLINIK_ID as id', 'pol.FMPKLINIKN as namaruangan')
            ->groupBy('pol.FMPKLINIK_ID', 'pol.FMPKLINIKN')
            ->orderBy('pol.FMPKLINIK_ID', 'asc')
            ->get();

        $dataDokter = \DB::connection('sqlsrv2')
            ->table('DOKTER as d')
            ->join('KUNJUNGANPASIEN as kp', 'kp.KPKD_DOKTER', '=', 'd.FMDDOKTER_ID')
            ->select('d.FMDDOKTER_ID as id', 'd.FMDDOKTERN as namalengkap')
            ->groupBy('d.FMDDOKTER_ID', 'd.FMDDOKTERN')
            ->orderBy('d.FMDDOKTERN', 'asc')
            ->get();


        $result = array(
            'departemen' => $dataRuangan,
            'kelompokpasien' => $dataKelompok,
            'dokter' => $dataDokter,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }

    public function getAntrianPasienDbLama(Request $request)
    {

        $notransaksi =  $request['notransaksi'];
        $data = \DB::connection('sqlsrv2')
            ->table('KUNJUNGANPASIEN as kp')
            ->join('pasien as p', 'p.KD_PASIEN', '=', 'kp.KPKD_PASIEN')
            ->join('DOKTER as dok', 'dok.FMDDOKTER_ID', '=', 'kp.KPKD_DOKTER')
            ->join('CUSTOMER as cus', 'cus.CUSID', '=', 'kp.KD_CUSTOMER')
            ->join('POLIKLINIK as pol', 'pol.FMPKLINIK_ID', '=', 'kp.KPKD_POLY')
            ->limit('5')
            ->select(
                'kp.KPKD_PASIEN as norm',
                'p.NAMAPASIEN as namapasien',
                'kp.KPNO_TRANSAKSI as notransaksi',
                'pol.FMPKLINIKN as poliklinik',
                'kp.KPTGL_PERIKSA as tglregistrasi',
                'dok.FMDDOKTERN as namadokter',
                'cus.NAME as namakelas',
                'kp.KPJAM_MASUK as jam_masuk'
            )
            ->where('kp.KPNO_TRANSAKSI', '=', $notransaksi)->get();

        $result = array(
            'data' => $data,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }

    public function getRiwayatPasiendblamaByRm(Request $request)
    {
        $filter = $request->all();
        $data = \DB::connection('sqlsrv2')
            ->table('KUNJUNGANPASIEN as kp')
            ->join('pasien as p', 'p.KD_PASIEN', '=', 'kp.KPKD_PASIEN')
            ->join('DOKTER as dok', 'dok.FMDDOKTER_ID', '=', 'kp.KPKD_DOKTER')
            ->join('CUSTOMER as cus', 'cus.CUSID', '=', 'kp.KD_CUSTOMER')
            ->join('POLIKLINIK as pol', 'pol.FMPKLINIK_ID', '=', 'kp.KPKD_POLY')
            ->select(
                'kp.KPKD_PASIEN as norec',
                'p.NAMAPASIEN as namapasien',
                'kp.KPTGL_PERIKSA as tglregistrasi',
                'kp.KPNO_TRANSAKSI as notransaksi',
                'pol.FMPKLINIKN as poliklinik',
                'dok.FMDDOKTERN as namadokter',
                'cus.NAME as carabayar',
                'kp.KPJAM_MASUK as jam_masuk'
            )
            ->where('kp.KPKD_POLY', '!=', 'PK011')
            ->where('kp.KPKD_PASIEN', '=', $filter['norm']);

        if (isset($filter['jmlRows']) && $filter['jmlRows'] != "" && $filter['jmlRows'] != "undefined") {
            $data = $data->take($filter['jmlRows']);
        }
        if (isset($filter['dokId']) && $filter['dokId'] != "" && $filter['dokId'] != "undefined") {
            $data = $data->where('kp.KPKD_DOKTER', '=', $filter['dokId']);
        }
        if (isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined") {
            $data = $data->where('kp.KPKD_POLY', '=', $filter['ruangId']);
        }

        $data = $data->orderBy('KP.KPTGL_PERIKSA', 'DESC');

        $data = $data->get();
        return $this->respond($data);
    }
    // 2019-12 penambahan arif akhir
    public function cekPiutangPasien(Request $request)
    {
        $nocm = $request['nocm'];
        $kdProfile = $this->getDataKdProfile($request);
        $data = DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->join('strukpelayanan_t as sp', 'sp.norec', '=', 'pd.nostruklastfk')
            ->join('strukpelayananpenjamin_t as spp', 'spp.nostrukfk', '=', 'sp.norec')
            ->select('pd.noregistrasi', 'pd.tglregistrasi')
            ->where('pd.objectkelompokpasienlastfk', '!=', 1)
            ->where('pd.statusenabled', true)
            ->where('ps.nocm', $nocm)
            // ->whereRaw("to_char(pd.tglregistrasi,'yyyy-MM-dd') > '2019-06-20' AND spp.totalharusdibayar != 0")
            ->where('pd.kdprofile', (int)$kdProfile)
            ->orderBy('tglregistrasi', 'desc')
            ->first();
        $status = true;
        $nocm = $nocm; //'';
        $tglregistrasi = '';
        if (!empty($data)) {
            $status = false;
            $tglregistrasi = $data->tglregistrasi;
        }

        $result = array(
            'status' => $status,
            'nocm' => $nocm,
            'data' => $data,
            'tglregistrasi' => $tglregistrasi,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getLaporanSummaryAgama(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $data = [];
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $ruanganId = $request['ruanganId'];
        $kelompokId = $request['kelompokPasien'];
        $jenispelayananId = $request['jenisPelayanan'];

        $paramRuangan = ' ';
        if (isset($ruanganId) && $ruanganId != "" && $ruanganId != "undefined") {
            $paramRuangan = ' and pd.objectruanganlastfk = ' . $ruanganId;
        }

        $paramKelompok = ' ';
        if (isset($kelompokId) && $kelompokId != "" && $kelompokId != "undefined") {
            $paramKelompok = ' and pd.objectkelompokpasienlastfk = ' . $kelompokId;
        }

        $paramJenisPelayanan = ' ';
        if (isset($jenispelayananId) && $jenispelayananId != "" && $jenispelayananId != "undefined") {
            if ($jenispelayananId == 1) {
                $paramJenisPelayanan = ' and ru.iseksekutif = false';
            } else {
                $paramJenisPelayanan = ' and ru.iseksekutif = true';
            }
        }

        $deptRawatJalan = $this->settingDataFixed('kdDepartemenRawatJalanFix', $idProfile);

        // $data = DB::select(DB::raw("select
        // apd.tglregistrasi,
        // -- COUNT(pd.noregistrasi) AS jumlah,
        // CASE WHEN apd.objectruanganfk IN (565,566,567,577,564,563,564) THEN 1 ELSE 0 END AS PSIKIATRI,
        // CASE WHEN apd.objectruanganfk IN (558,568,569,561,559,575,574,576,576,560,562,573) THEN 1 ELSE 0 END AS NONPSI,
        // ru.namaruangan,
        // jk.jeniskelamin,
        // kp.kelompokpasien,
        // apd.objectruanganfk,
        // ru.objectdepartemenfk,
        // ag.agama
        // from antrianpasiendiperiksa_t as apd
        // INNER JOIN pasiendaftar_t as pd ON pd.norec=apd.noregistrasifk
        // INNER JOIN ruangan_m as ru On ru.id=apd.objectruanganfk
        // INNER JOIN kelompokpasien_m as kp on kp.id=pd.objectkelompokpasienlastfk
        // INNER JOIN pasien_m as ps on ps.id=pd.nocmfk
        // INNER JOIN jeniskelamin_m as jk on jk.id=ps.objectjeniskelaminfk
        // INNER JOIN alamat_m as al on al.nocmfk=ps.id
        // INNER JOIN kotakabupaten_m as kb on kb.id=al.objectkotakabupatenfk
        // INNER JOIN pekerjaan_m as pek on pek.id=ps.objectpekerjaanfk
        // LEFT JOIN agama_m as ag on ag.id = ps.objectagamafk
        // where apd.kdprofile = $idProfile and apd.tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir' AND ru.objectdepartemenfk IN (18,26,3,6,24,34,27) AND ru.objectdepartemenfk IN ($deptRawatJalan)
        // $paramRuangan $paramKelompok
        //   "
        // )
        // );
        $data = DB::select(DB::raw("SELECT x.agama,SUM(x.laki) AS laki,SUM(x.wanita) AS wanita,SUM(x.baru) as baru,SUM(x.lama) as lama,
                    SUM(x.tunai) as tunai,SUM(x.bpjs) as bpjs,SUM(x.swasta) as swasta,SUM(x.hardient) as hardient,
                    SUM(x.iks) as iks,SUM(x.thamrin) as thamrin,SUM(x.jamsostek) as jamsostek,SUM(x.jamkesda)as jamkesda,
                    SUM(x.skmm) as skmm,SUM(x.karyawan) as karyawan,SUM(x.jamkesmas) as jamkesmas,
                    SUM(x.tunai)+SUM(x.bpjs)+SUM(x.swasta)+SUM(x.hardient)+SUM(x.iks)+SUM(x.jamsostek)+SUM(x.jamkesmas)+SUM(x.jamkesda)+SUM(x.skmm)+SUM(x.karyawan)+SUM(x.thamrin) as jml
                    FROM (SELECT ag.agama,CASE WHEN jk.id = 1 THEN 1 ELSE 0 END AS laki,
                    CASE WHEN jk.id = 2 THEN 1 ELSE 0 END AS wanita,CASE WHEN pd.statuspasien = 'BARU' THEN 1 ELSE 0 END AS baru,
                    CASE WHEN pd.statuspasien = 'LAMA' THEN 1 WHEN pd.statuspasien = '' THEN 1 ELSE 0 END AS lama,
                    CASE WHEN pd.objectkelompokpasienlastfk = 1 THEN 1 ELSE 0 END AS tunai,
                    CASE WHEN pd.objectkelompokpasienlastfk in (2,11) THEN 1 ELSE 0 END AS bpjs,
                    CASE WHEN pd.objectkelompokpasienlastfk = 3 
                    and pd.objectrekananfk NOT IN (5906,581183,581184,581185,581186,581187,581140,581136,581162,581187,581188,581165,581168,
                    806,581189,581169,581170,581171,581190,581173,581174,581175,581176,581177,581178,581179,
                    581180,3269,581182,581191,735,1903,2115,1927,150) THEN 1 ELSE 0 END AS swasta,
                    CASE WHEN pd.objectkelompokpasienlastfk = 3 and pd.objectrekananfk IN (581191) THEN 1 ELSE 0 END AS hardient,
                    CASE WHEN pd.objectkelompokpasienlastfk = 3 and pd.objectrekananfk IN (5906,581183,581184,581185,581186,581187,581140,581136,581162,581187,581188,581165,581168,
                    806,581189,581169,581170,581171,581190,581173,581174,581175,581176,581177,581178,581179,
                    581180,3269,581182) THEN 1 ELSE 0 END AS iks,
                    CASE WHEN pd.objectkelompokpasienlastfk = 3
                    and pd.objectrekananfk IN (735,1903,2115,1927,150) THEN 1 ELSE 0 END AS thamrin,
                    CASE WHEN pd.objectkelompokpasienlastfk in (14) THEN 1 ELSE 0 END AS jamsostek,			 
                    CASE WHEN pd.objectkelompokpasienlastfk in (8) THEN 1 ELSE 0 END AS jamkesda,
                    CASE WHEN pd.objectkelompokpasienlastfk in (15) THEN 1 ELSE 0 END AS skmm,
                    CASE WHEN pd.objectkelompokpasienlastfk in (12) THEN 1 ELSE 0 END AS karyawan,
                    CASE WHEN pd.objectkelompokpasienlastfk in (17) THEN 1 ELSE 0 END AS jamkesmas 
                    FROM pasiendaftar_t AS pd
                    INNER JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
                    INNER JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
                    INNER JOIN pasien_m as ps on ps.id = pd.nocmfk
                    LEFT JOIN jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk
                    inner JOIN  pendidikan_m as pe on pe.id=ps.objectpendidikanfk
                    INNER JOIN alamat_m as al on al.nocmfk=ps.id
                    INNER JOIN kotakabupaten_m as kb on kb.id=al.objectkotakabupatenfk
                    INNER JOIN pekerjaan_m as pek on pek.id=ps.objectpekerjaanfk
                    LEFT JOIN agama_m as ag on ag.id = ps.objectagamafk
                    WHERE pd.tglregistrasi BETWEEN '$tglAwal' AND '$tglAkhir' AND pd.statusenabled=true
                    AND ru.objectdepartemenfk=18 and pd.kdprofile=$idProfile $paramRuangan $paramKelompok $paramJenisPelayanan) as x
                    GROUP BY x.agama
                    ORDER BY x.agama ASC"));
        return $this->respond($data);
    }

    public function getLaporanSummaryKunjunganTahunan(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $data = [];
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $ruanganId = $request['ruanganId'];
        $kelompokId = $request['kelompokPasien'];
        $jenispelayananId = $request['jenisPelayanan'];

        $paramRuangan = ' ';
        if (isset($ruanganId) && $ruanganId != "" && $ruanganId != "undefined") {
            $paramRuangan = ' and pd.objectruanganlastfk = ' . $ruanganId;
        }

        $paramKelompok = ' ';
        if (isset($kelompokId) && $kelompokId != "" && $kelompokId != "undefined") {
            $paramKelompok = ' and pd.objectkelompokpasienlastfk = ' . $kelompokId;
        }

        $paramJenisPelayanan = ' ';
        if (isset($jenispelayananId) && $jenispelayananId != "" && $jenispelayananId != "undefined") {
            if ($jenispelayananId == 1) {
                $paramJenisPelayanan = ' and ru.iseksekutif = false';
            } else {
                $paramJenisPelayanan = ' and ru.iseksekutif = true';
            }
        }

        $deptRawatJalan = $this->settingDataFixed('kdDepartemenRawatJalanFix', $idProfile);

        // $data = DB::select(DB::raw("select
        // apd.tglregistrasi,
        // -- COUNT(pd.noregistrasi) AS jumlah,
        // CASE WHEN apd.objectruanganfk IN (565,566,567,577,564,563,564) THEN 1 ELSE 0 END AS PSIKIATRI,
        // CASE WHEN apd.objectruanganfk IN (558,568,569,561,559,575,574,576,576,560,562,573) THEN 1 ELSE 0 END AS NONPSI,
        // ru.namaruangan,
        // jk.jeniskelamin,
        // kp.kelompokpasien,
        // apd.objectruanganfk,
        // ru.objectdepartemenfk,
        // ag.agama
        // from antrianpasiendiperiksa_t as apd
        // INNER JOIN pasiendaftar_t as pd ON pd.norec=apd.noregistrasifk
        // INNER JOIN ruangan_m as ru On ru.id=apd.objectruanganfk
        // INNER JOIN kelompokpasien_m as kp on kp.id=pd.objectkelompokpasienlastfk
        // INNER JOIN pasien_m as ps on ps.id=pd.nocmfk
        // INNER JOIN jeniskelamin_m as jk on jk.id=ps.objectjeniskelaminfk
        // INNER JOIN alamat_m as al on al.nocmfk=ps.id
        // INNER JOIN kotakabupaten_m as kb on kb.id=al.objectkotakabupatenfk
        // INNER JOIN pekerjaan_m as pek on pek.id=ps.objectpekerjaanfk
        // LEFT JOIN agama_m as ag on ag.id = ps.objectagamafk
        // where apd.kdprofile = $idProfile and apd.tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir' AND ru.objectdepartemenfk IN (18,26,3,6,24,34,27) AND ru.objectdepartemenfk IN ($deptRawatJalan)
        // $paramRuangan $paramKelompok
        //   "
        // )
        // );
        $data = DB::select(DB::raw("SELECT x.idbulan,x.bulan,SUM(x.laki) AS laki,SUM(x.wanita) AS wanita,SUM(x.baru) as baru,SUM(x.lama) as lama,
                    SUM(x.tunai) as tunai,SUM(x.bpjs) as bpjs,SUM(x.swasta) as swasta,SUM(x.hardient) as hardient,
                    SUM(x.iks) as iks,SUM(x.thamrin) as thamrin,SUM(x.jamsostek) as jamsostek,SUM(x.jamkesda)as jamkesda,
                    SUM(x.skmm) as skmm,SUM(x.karyawan) as karyawan,SUM(x.jamkesmas) as jamkesmas,
                    SUM(x.tunai)+SUM(x.bpjs)+SUM(x.swasta)+SUM(x.hardient)+SUM(x.iks)+SUM(x.jamsostek)+SUM(x.jamkesmas)+SUM(x.jamkesda)+SUM(x.skmm)+SUM(x.karyawan)+SUM(x.thamrin) as jml
                    FROM (SELECT CASE WHEN jk.id = 1 THEN 1 ELSE 0 END AS laki,
                    CASE WHEN jk.id = 2 THEN 1 ELSE 0 END AS wanita,CASE WHEN pd.statuspasien = 'BARU' THEN 1 ELSE 0 END AS baru,
                    CASE WHEN pd.statuspasien = 'LAMA' THEN 1 WHEN pd.statuspasien = '' THEN 1 ELSE 0 END AS lama,
                    CASE WHEN pd.objectkelompokpasienlastfk = 1 THEN 1 ELSE 0 END AS tunai,
                    CASE WHEN pd.objectkelompokpasienlastfk in (2,11) THEN 1 ELSE 0 END AS bpjs,
                    CASE WHEN pd.objectkelompokpasienlastfk = 3 
                    and pd.objectrekananfk NOT IN (5906,581183,581184,581185,581186,581187,581140,581136,581162,581187,581188,581165,581168,
                    806,581189,581169,581170,581171,581190,581173,581174,581175,581176,581177,581178,581179,
                    581180,3269,581182,581191,735,1903,2115,1927,150) THEN 1 ELSE 0 END AS swasta,
                    CASE WHEN pd.objectkelompokpasienlastfk = 3 and pd.objectrekananfk IN (581191) THEN 1 ELSE 0 END AS hardient,
                    CASE WHEN pd.objectkelompokpasienlastfk = 3 and pd.objectrekananfk IN (5906,581183,581184,581185,581186,581187,581140,581136,581162,581187,581188,581165,581168,
                    806,581189,581169,581170,581171,581190,581173,581174,581175,581176,581177,581178,581179,
                    581180,3269,581182) THEN 1 ELSE 0 END AS iks,
                    CASE WHEN pd.objectkelompokpasienlastfk = 3
                    and pd.objectrekananfk IN (735,1903,2115,1927,150) THEN 1 ELSE 0 END AS thamrin,
                    CASE WHEN pd.objectkelompokpasienlastfk in (14) THEN 1 ELSE 0 END AS jamsostek,			 
                    CASE WHEN pd.objectkelompokpasienlastfk in (8) THEN 1 ELSE 0 END AS jamkesda,
                    CASE WHEN pd.objectkelompokpasienlastfk in (15) THEN 1 ELSE 0 END AS skmm,
                    CASE WHEN pd.objectkelompokpasienlastfk in (12) THEN 1 ELSE 0 END AS karyawan,
                    CASE WHEN pd.objectkelompokpasienlastfk in (17) THEN 1 ELSE 0 END AS jamkesmas,
                    case date_part('month',pd.tglregistrasi) when 1 then 1 when 2 then 2 when 3 then 3
                    when 4 then 4 when 5 then 5 when 6 then 6 when 7 then 7 when 8 then 8 when 9 then 9 when 10 then 10
                    when 11 then 11 else 12 end idbulan,
                    case date_part('month',pd.tglregistrasi) when 1 then 'Januari' when 2 then 'Februari' when 3 then 'Maret'
                    when 4 then 'April' when 5 then 'Mei' when 6 then 'Juni' when 7 then 'Juli' when 8 then 'Agustus' when 9 then 'September' when 10 then 'Oktober'
                    when 11 then 'November' else 'Desember' end bulan
                    FROM pasiendaftar_t AS pd
                    INNER JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
                    INNER JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
                    INNER JOIN pasien_m as ps on ps.id = pd.nocmfk
                    LEFT JOIN jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk
                    inner JOIN  pendidikan_m as pe on pe.id=ps.objectpendidikanfk
                    INNER JOIN alamat_m as al on al.nocmfk=ps.id
                    INNER JOIN kotakabupaten_m as kb on kb.id=al.objectkotakabupatenfk
                    INNER JOIN pekerjaan_m as pek on pek.id=ps.objectpekerjaanfk
                    LEFT JOIN agama_m as ag on ag.id = ps.objectagamafk
                    WHERE pd.tglregistrasi BETWEEN '$tglAwal' AND '$tglAkhir' AND pd.statusenabled=true
                    AND ru.objectdepartemenfk=18 and pd.kdprofile=21
                    UNION ALL
                    SELECT 0 AS laki,0 AS wanita,0 AS baru,0 AS lama,0 AS tunai,0 AS bpjs,0 AS swasta,0 AS hardient,
                                0 AS iks,0 AS thamrin,0 AS jamsostek,0 AS jamkesda,0 AS skmm,0 AS karyawan,0 AS jamkesmas,
                                id as idbulan,namabulan AS bulan
                    FROM bulan_m
                    ) as x
                    GROUP BY x.idbulan,x.bulan
                    ORDER BY x.idbulan ASC"));
        return $this->respond($data);
    }

    public function getTopTenDiagnosa(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        // $dataLogin = $request->all();
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $deptId = '';
        if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined" && $request['idDept'] == 18) {
            $deptId = ' and ru.objectdepartemenfk <> 16';
        } else if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined" && $request['idDept'] == 16) {
            $deptId = ' and ru.objectdepartemenfk = 16';
        }
        $carabayarId = '';
        if (isset($request['idCaraBayar']) && $request['idCaraBayar'] != "" && $request['idCaraBayar'] != "undefined") {
            $carabayarId = ' and kp.id = ' . $request['idCaraBayar'];
        }
        $ruanganId = '';
        if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
            $ruanganId = ' and ru.id = ' . $request['idRuangan'];
        }
        $jenisPasien = '';
        if ($request['idjenispasien'] == 1) {
            $jenisPasien = "and dm.kddiagnosa ilike 'F%'";
        } elseif ($request['idjenispasien'] == 2) {
            $jenisPasien = "and dm.kddiagnosa not ilike 'F%'";
        }
        $data = DB::select(DB::raw(
            "select sum(z.jumlah) jumlah, z.kddiagnosa,z.namadiagnosa, sum(z.kasusbarulk) kasusbarulk, sum(z.kasusbarup) kasusbarup, sum(z.kasusbarulk)+sum(z.kasusbarup) as kasus45 from (
            select count(x.kddiagnosa)as jumlah,x.kddiagnosa,x.namadiagnosa,
            sum(case when x.kasusbaru = 1 and x.jeniskelamin like 'LAKI-LAKI' then 1 else 0 end) as kasusbarulk,
            sum(case when x.kasusbaru = 1 and x.jeniskelamin like 'PEREMPUAN' then 1 else 0 end) as kasusbarup from (
            select dm.kddiagnosa,dm.namadiagnosa, case when dp.iskasusbaru = true then 1 else 0 end as kasusbaru,jk.jeniskelamin
                from pasiendaftar_t as pd
                inner join antrianpasiendiperiksa_t as app on app.noregistrasifk = pd.norec 
                inner join pasien_m as ps on ps.id = pd.nocmfk
                inner join jeniskelamin_m as jk on ps.objectjeniskelaminfk = jk.id
                inner join ruangan_m ru on ru.id = app.objectruanganfk
                inner join departemen_m dpm on dpm.id = ru.objectdepartemenfk
                inner join diagnosapasien_t as dp on dp.noregistrasifk = app.norec
                inner join detaildiagnosapasien_t as ddp on ddp.objectdiagnosapasienfk = dp.norec
                inner join diagnosa_m as dm on ddp.objectdiagnosafk = dm.id
                inner join jenisdiagnosa_m jd on jd.id = ddp.objectjenisdiagnosafk
                left join kelompokpasien_m kp on kp.id = pd.objectkelompokpasienlastfk
                where pd.kdprofile = $idProfile and pd.statusenabled = true and dm.kddiagnosa <> '-'  and
                pd.tglregistrasi BETWEEN '$tglAwal' AND '$tglAkhir' and jd.id between 7 and 12
                $deptId
                $carabayarId
                $ruanganId
                $jenisPasien
                )as x GROUP BY x.namadiagnosa ,x.kddiagnosa, x.kasusbaru, x.jeniskelamin) as z
                group by z.kddiagnosa,z.namadiagnosa
                ORDER BY jumlah desc limit 10;"
        ));
        if (count($data) > 0) {
            foreach ($data as $item) {
                $result[] = array(
                    'jumlah' => $item->jumlah,
                    'kddiagnosa' => $item->kddiagnosa,
                    'namadiagnosa' => $item->namadiagnosa,
                    'kasusbarulk' => $item->kasusbarulk,
                    'kasusbarup' => $item->kasusbarup,
                    'kasus45' => $item->kasus45
                );
            }
        } else {
            $result[] = array(
                'jumlah' => 0,
                'kddiagnosa' => null,
                'namadiagnosa' => null,
                'kasusbarulk' => 0,
                'kasusbarup' => 0,
                'kasus45' => 0
            );
        }

        $results = array(
            'result' => $result,
            'message' => 'dy',
        );
        return $this->respond($result);
    }

    public function getTopTenDiagnosa9(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        // $dataLogin = $request->all();
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $deptId = '';
        if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
            $deptId = ' and ru.objectdepartemenfk = ' . $request['idDept'];
        }
        $carabayarId = '';
        if (isset($request['idCaraBayar']) && $request['idCaraBayar'] != "" && $request['idCaraBayar'] != "undefined") {
            $carabayarId = ' and kp.id = ' . $request['idCaraBayar'];
        }
        $ruanganId = '';
        if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
            $ruanganId = ' and ru.id = ' . $request['idRuangan'];
        }

        $data = DB::select(DB::raw(
            "select x.namaruangan, x.kelompokpasien, count(x.kddiagnosa)as jumlah,x.kddiagnosa,x.namadiagnosa from (
            select ru.namaruangan, kp.kelompokpasien, dm.kddiagnosatindakan kddiagnosa,dm.namadiagnosatindakan namadiagnosa
                            from antrianpasiendiperiksa_t as app
                            inner join diagnosatindakanpasien_t as dp on dp.objectpasienfk = app.norec
                            inner join detaildiagnosatindakanpasien_t as ddp on ddp.objectdiagnosatindakanpasienfk = dp.norec
                            inner join diagnosatindakan_m as dm on ddp.objectdiagnosatindakanfk = dm.id
                            left join pasiendaftar_t as pd on pd.norec = app.noregistrasifk
                            left join pasien_m as ps on ps.id = pd.nocmfk
                            left join jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk 
														left join kelompokpasien_m kp on kp.id = pd.objectkelompokpasienlastfk
                            left join alamat_m as alm on alm.nocmfk = ps.id
                            left join kecamatan_m as kec on kec.id = alm.objectkecamatanfk
                            left join kotakabupaten_m as kot on kot.id = alm.objectkotakabupatenfk
                            left join propinsi_m as pro on pro.id = alm.objectpropinsifk
                            left join ruangan_m as ru on ru.id = pd.objectruanganlastfk
                            where app.kdprofile = $idProfile and dm.kddiagnosatindakan <> '-'  and
                            pd.tglregistrasi BETWEEN '$tglAwal' AND '$tglAkhir'
                            $deptId
                            $carabayarId
                            $ruanganId
                            )as x GROUP BY x.namaruangan, x.kelompokpasien, x.namadiagnosa ,x.kddiagnosa
							order by jumlah desc limit 10;"
        ));
        if (count($data) > 0) {
            foreach ($data as $item) {
                $result[] = array(
                    'jumlah' => $item->jumlah,
                    'kddiagnosa' => $item->kddiagnosa,
                    'namadiagnosa' => $item->namadiagnosa,
                    'kelompokpasien' => $item->kelompokpasien,
                );
            }
        } else {
            $result[] = array(
                'jumlah' => 0,
                'kddiagnosa' => null,
                'namadiagnosa' => null,
                'kelompokpasien' => null,
            );
        }

        $results = array(
            'result' => $result,
            'message' => 'dy',
        );
        return $this->respond($result);
    }

    public function getLaporanDemoRIKelompok(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $data = [];
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $ruanganId = $request['ruanganId'];
        $kelompokId = $request['kelompokPasien'];

        $paramRuangan = ' ';
        if (isset($ruanganId) && $ruanganId != "" && $ruanganId != "undefined") {
            $paramRuangan = ' and pd.objectruanganlastfk = ' . $ruanganId;
        }

        $paramKelompok = ' ';
        if (isset($kelompokId) && $kelompokId != "" && $kelompokId != "undefined") {
            $paramKelompok = ' and pd.objectkelompokpasienlastfk = ' . $kelompokId;
        }

        $deptRawatJalan = $this->settingDataFixed('kdDepartemenRawatJalanFix', $idProfile);

        $data = DB::select(
            DB::raw(
                "select
            kp.kelompokpasien,
            COUNT(kp.kelompokpasien) as jumlah

            from antrianpasiendiperiksa_t as apd
            INNER JOIN pasiendaftar_t as pd ON pd.norec=apd.noregistrasifk
            INNER JOIN ruangan_m as ru On ru.id=apd.objectruanganfk
            INNER JOIN kelompokpasien_m as kp on kp.id=pd.objectkelompokpasienlastfk
            INNER JOIN pasien_m as ps on ps.id=pd.nocmfk
            where pd.kdprofile = $idProfile AND apd.tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir' AND ru.objectdepartemenfk = 16
            GROUP BY
            kp.kelompokpasien

            ORDER BY kp.kelompokpasien asc "
            )
        );
        return $this->respond($data);
    }

    public function getLaporanDemoRIPendidikan(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $data = [];
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $ruanganId = $request['ruanganId'];
        $kelompokId = $request['kelompokPasien'];

        $paramRuangan = ' ';
        if (isset($ruanganId) && $ruanganId != "" && $ruanganId != "undefined") {
            $paramRuangan = ' and pd.objectruanganlastfk = ' . $ruanganId;
        }

        $paramKelompok = ' ';
        if (isset($kelompokId) && $kelompokId != "" && $kelompokId != "undefined") {
            $paramKelompok = ' and pd.objectkelompokpasienlastfk = ' . $kelompokId;
        }

        $deptRawatJalan = $this->settingDataFixed('kdDepartemenRawatJalanFix', $idProfile);

        $data = DB::select(
            DB::raw(
                "select
            pe.pendidikan,
            COUNT(pe.pendidikan) as jumlah

            from antrianpasiendiperiksa_t as apd
            INNER JOIN pasiendaftar_t as pd ON pd.norec=apd.noregistrasifk
            INNER JOIN ruangan_m as ru On ru.id=apd.objectruanganfk
            INNER JOIN kelompokpasien_m as kp on kp.id=pd.objectkelompokpasienlastfk
            INNER JOIN pasien_m as ps on ps.id=pd.nocmfk
            INNER JOIN pendidikan_m as pe on pe.id=ps.objectpendidikanfk
            where apd.kdprofile = $idProfile and apd.tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir' AND ru.objectdepartemenfk = 16
            GROUP BY
            pe.pendidikan

            ORDER BY pe.pendidikan asc "
            )
        );
        return $this->respond($data);
    }

    public function getLaporanDemoRIDaerah(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $data = [];
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $ruanganId = $request['ruanganId'];
        $kelompokId = $request['kelompokPasien'];

        $paramRuangan = ' ';
        if (isset($ruanganId) && $ruanganId != "" && $ruanganId != "undefined") {
            $paramRuangan = ' and pd.objectruanganlastfk = ' . $ruanganId;
        }

        $paramKelompok = ' ';
        if (isset($kelompokId) && $kelompokId != "" && $kelompokId != "undefined") {
            $paramKelompok = ' and pd.objectkelompokpasienlastfk = ' . $kelompokId;
        }

        $deptRawatJalan = $this->settingDataFixed('kdDepartemenRawatJalanFix', $idProfile);

        $data = DB::select(
            DB::raw(
                "select
            kb.namakotakabupaten,
            COUNT(kb.namakotakabupaten) as jumlah

            from antrianpasiendiperiksa_t as apd
            INNER JOIN pasiendaftar_t as pd ON pd.norec=apd.noregistrasifk
            INNER JOIN ruangan_m as ru On ru.id=apd.objectruanganfk
            INNER JOIN kelompokpasien_m as kp on kp.id=pd.objectkelompokpasienlastfk
            INNER JOIN pasien_m as ps on ps.id=pd.nocmfk
            INNER JOIN alamat_m as al on al.nocmfk=ps.id
            INNER JOIN kotakabupaten_m as kb on kb.id=al.objectkotakabupatenfk
            where apd.kdprofile = $idProfile and apd.tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir' AND ru.objectdepartemenfk = 16
            GROUP BY
            kb.namakotakabupaten

            ORDER BY kb.namakotakabupaten asc "
            )
        );
        return $this->respond($data);
    }

    public function getLaporanDemoRIPekerjaan(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $data = [];
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $ruanganId = $request['ruanganId'];
        $kelompokId = $request['kelompokPasien'];

        $paramRuangan = ' ';
        if (isset($ruanganId) && $ruanganId != "" && $ruanganId != "undefined") {
            $paramRuangan = ' and pd.objectruanganlastfk = ' . $ruanganId;
        }

        $paramKelompok = ' ';
        if (isset($kelompokId) && $kelompokId != "" && $kelompokId != "undefined") {
            $paramKelompok = ' and pd.objectkelompokpasienlastfk = ' . $kelompokId;
        }

        $deptRawatJalan = $this->settingDataFixed('kdDepartemenRawatJalanFix', $idProfile);

        $data = DB::select(
            DB::raw(
                "select
            pek.pekerjaan,
            COUNT(pek.pekerjaan) as jumlah

            from antrianpasiendiperiksa_t as apd
            INNER JOIN pasiendaftar_t as pd ON pd.norec=apd.noregistrasifk
            INNER JOIN ruangan_m as ru On ru.id=apd.objectruanganfk
            INNER JOIN kelompokpasien_m as kp on kp.id=pd.objectkelompokpasienlastfk
            INNER JOIN pasien_m as ps on ps.id=pd.nocmfk
            INNER JOIN pekerjaan_m as pek on pek.id=ps.objectpekerjaanfk
            where apd.kdprofile = $idProfile and apd.tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir' AND ru.objectdepartemenfk = 16
            GROUP BY
            pek.pekerjaan

            ORDER BY pek.pekerjaan asc "
            )
        );
        return $this->respond($data);
    }

    public function getLaporanDemoRIUsia(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $data = [];
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $ruanganId = $request['ruanganId'];
        $kelompokId = $request['kelompokPasien'];

        $paramRuangan = ' ';
        if (isset($ruanganId) && $ruanganId != "" && $ruanganId != "undefined") {
            $paramRuangan = ' and pd.objectruanganlastfk = ' . $ruanganId;
        }

        $paramKelompok = ' ';
        if (isset($kelompokId) && $kelompokId != "" && $kelompokId != "undefined") {
            $paramKelompok = ' and pd.objectkelompokpasienlastfk = ' . $kelompokId;
        }

        $deptRawatJalan = $this->settingDataFixed('kdDepartemenRawatJalanFix', $idProfile);

        // $data = DB::select(DB::raw("SELECT
        //         z.usia, count(z.usia) as jml
        //     FROM
        //         (
        //             SELECT
        //             CASE
        //             WHEN x.umur >= 1		AND x.umur <= 14 THEN 		'1 - 14 TAHUN'
        //             WHEN x.umur >= 15		AND x.umur <= 24 THEN			'15 - 24 TAHUN'
        //         WHEN x.umur >= 25		AND x.umur <= 44 THEN			'25 - 44 TAHUN'
        //             WHEN x.umur >= 45		AND x.umur <= 64 THEN			'45 - 64 TAHUN'
        //             WHEN x.umur >= 65 	THEN '65 TAHUN KE ATAS'
        //             END AS usia
        //             FROM
        //                 (
        //                     SELECT
        //                         pg.namapasien,
        //                         pg.tgllahir,
        //                         CONVERT (
        //                             INT,
        //                             ROUND(
        //                                 DATEDIFF(HOUR, pg.tgllahir, GETDATE()) / 8766.0,
        //                                 0
        //                             )
        //                         ) AS umur
        //                     FROM antrianpasiendiperiksa_t as apd
        //     INNER JOIN pasiendaftar_t as pd ON pd.norec=apd.noregistrasifk
        //     INNER JOIN ruangan_m as ru On ru.id=apd.objectruanganfk
        //     INNER JOIN kelompokpasien_m as kp on kp.id=pd.objectkelompokpasienlastfk
        //     INNER JOIN pasien_m as pg on pg.id=pd.nocmfk
        //     where apd.kdprofile = $idProfile and apd.tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir' AND ru.objectdepartemenfk = 16
        //                 ) AS x
        //         )
        //     as z GROUP BY z.usia
        //     ORDER BY z.usia ASC "
        // )
        // );

        $data = DB::select(DB::raw("
        with demografiumur as 
(
	SELECT
							pg.namapasien,
							pg.tgllahir,
							cast((DATE_PART( 'year', now( ) :: DATE ) - DATE_PART( 'year', pg.tgllahir :: DATE )) * 12  + 
		(DATE_PART( 'month', now( ) :: DATE ) - DATE_PART( 'month', pg.tgllahir :: DATE)) as INTEGER) /12
		
	 AS umur
						FROM
							antrianpasiendiperiksa_t AS apd
							INNER JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk
							INNER JOIN ruangan_m AS ru ON ru.ID = apd.objectruanganfk
							INNER JOIN kelompokpasien_m AS kp ON kp.ID = pd.objectkelompokpasienlastfk
							INNER JOIN pasien_m AS pg ON pg.ID = pd.nocmfk 
						WHERE
							apd.kdprofile = $idProfile
							AND apd.tglregistrasi BETWEEN '$tglAwal' 
							AND '$tglAkhir' 
							AND ru.objectdepartemenfk = 16 
)
SELECT
	z.usia,
	COUNT ( z.usia ) AS jml 
FROM
	(
	SELECT
	CASE
			WHEN x.umur >= 1 
				AND x.umur <= 14 THEN '1 - 14 TAHUN' 
			WHEN x.umur >= 15 
				AND x.umur <= 24 THEN '15 - 24 TAHUN' 
			WHEN x.umur >= 25 
				AND x.umur <= 44 THEN '25 - 44 TAHUN' 
			WHEN x.umur >= 45 
				AND x.umur <= 64 THEN '45 - 64 TAHUN' 
			WHEN x.umur >= 65 THEN '65 TAHUN KE ATAS' 
	END 
		AS usia 
					FROM demografiumur
						 AS x 
					) AS z 
				GROUP BY
					z.usia 
			ORDER BY
	z.usia ASC;
	
        "));
        return $this->respond($data);
    }

    public function getLaporanDemoRIAgama(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $data = [];
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $ruanganId = $request['ruanganId'];
        $kelompokId = $request['kelompokPasien'];

        $paramRuangan = ' ';
        if (isset($ruanganId) && $ruanganId != "" && $ruanganId != "undefined") {
            $paramRuangan = ' and pd.objectruanganlastfk = ' . $ruanganId;
        }

        $paramKelompok = ' ';
        if (isset($kelompokId) && $kelompokId != "" && $kelompokId != "undefined") {
            $paramKelompok = ' and pd.objectkelompokpasienlastfk = ' . $kelompokId;
        }

        $deptRawatJalan = $this->settingDataFixed('kdDepartemenRawatJalanFix', $idProfile);

        $data = DB::select(
            DB::raw(
                "select
            ag.agama,
            COUNT(ag.agama) as jumlah

            from antrianpasiendiperiksa_t as apd
            INNER JOIN pasiendaftar_t as pd ON pd.norec=apd.noregistrasifk
            INNER JOIN ruangan_m as ru On ru.id=apd.objectruanganfk
            INNER JOIN kelompokpasien_m as kp on kp.id=pd.objectkelompokpasienlastfk
            INNER JOIN pasien_m as ps on ps.id=pd.nocmfk
            INNER JOIN agama_m as ag on ag.id = ps.objectagamafk
            where apd.kdprofile = $idProfile and apd.tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir' AND ru.objectdepartemenfk = 16
            GROUP BY
            ag.agama

            ORDER BY ag.agama asc "
            )
        );
        return $this->respond($data);
    }

    public function getLaporanDemoRIItem(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $data = [];
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $ruanganId = $request['ruanganId'];
        $kelompokId = $request['kelompokPasien'];
        $jumlahTT = (float) $this->settingDataFixed('jmlTempatTidur', $idProfile);

        $paramRuangan = ' ';
        if (isset($ruanganId) && $ruanganId != "" && $ruanganId != "undefined") {
            $paramRuangan = ' and pd.objectruanganlastfk = ' . $ruanganId;
        }

        $paramKelompok = ' ';
        if (isset($kelompokId) && $kelompokId != "" && $kelompokId != "undefined") {
            $paramKelompok = ' and pd.objectkelompokpasienlastfk = ' . $kelompokId;
        }

        $deptRawatJalan = $this->settingDataFixed('kdDepartemenRawatJalanFix', $idProfile);

        $data = DB::select(
            DB::raw("SELECT
            COUNT(ps.noregistrasi) as jumlah,'Masuk' as ket
            FROM pasiendaftar_t as ps
            INNER JOIN ruangan_m as ru on ru.id = ps.objectruanganlastfk
            WHERE ps.tglregistrasi BETWEEN '$tglAwal'::date and '$tglAkhir'::date AND objectdepartemenfk = 16
            union ALL
            SELECT
            COUNT(ps.noregistrasi) as jumlah,'Keluar' as ket
            FROM pasiendaftar_t as ps
            INNER JOIN ruangan_m as ru on ru.id = ps.objectruanganlastfk
            WHERE ps.tglpulang BETWEEN '$tglAwal'::date and '$tglAkhir'::date AND objectdepartemenfk = 16
            union ALL
            SELECT
            COUNT(ps.noregistrasi) as jumlah,'Hidup' as ket
            FROM pasiendaftar_t as ps
            INNER JOIN ruangan_m as ru on ru.id = ps.objectruanganlastfk
            WHERE ps.tglpulang BETWEEN '$tglAwal'::date and '$tglAkhir'::date AND objectdepartemenfk = 16
            and ps.objectkondisipasienfk not in (5,6)
            union ALL
            SELECT
            COUNT(ps.noregistrasi) as jumlah,kp.kondisipasien as ket
            FROM pasiendaftar_t as ps
            INNER JOIN ruangan_m as ru on ru.id = ps.objectruanganlastfk
            INNER JOIN kondisipasien_m as kp on kp.id = ps.objectkondisipasienfk
            WHERE ps.tglpulang BETWEEN '$tglAwal'::date and '$tglAkhir'::date AND objectdepartemenfk = 16
            and ps.objectkondisipasienfk = 5
            group by kp.kondisipasien 
            union ALL
            SELECT
            COUNT(ps.noregistrasi) as jumlah,kp.kondisipasien as ket
            FROM pasiendaftar_t as ps
            INNER JOIN ruangan_m as ru on ru.id = ps.objectruanganlastfk
            INNER JOIN kondisipasien_m as kp on kp.id = ps.objectkondisipasienfk
            WHERE tglpulang BETWEEN '$tglAwal'::date and '$tglAkhir'::date AND objectdepartemenfk = 16
            and ps.objectkondisipasienfk = 6
            group by kp.kondisipasien 
            UNION ALL
            SELECT COUNT (x.noregistrasi) AS jumlah, 'HARI PERAWATAN' as ket
            FROM
            (
            SELECT
            pd.noregistrasi,
            pd.tglpulang,
            date_part('month',pd.tglregistrasi::date) AS bulanregis 
            FROM
            pasiendaftar_t AS pd
            INNER JOIN ruangan_m AS ru ON ru.ID = pd.objectruanganlastfk
            WHERE
            ru.objectdepartemenfk = 16
            AND pd.tglpulang IS NULL
            ) AS x

            UNION ALL
            select sum(x.hari) as jumlah, 'LAMA DIRAWAT' as ket
            from (
            SELECT
            date_part('day', pd.tglpulang- pd.tglregistrasi) as hari ,pd.noregistrasi
            FROM
            pasiendaftar_t AS pd
            INNER JOIN ruangan_m AS ru ON ru. ID = pd.objectruanganlastfk
            WHERE pd.kdprofile = $idProfile and
            pd.tglpulang BETWEEN '$tglAwal'::date and '$tglAkhir'::date and
            ru.objectdepartemenfk = 16
            and pd.tglpulang is not null
            GROUP BY pd.noregistrasi,pd.tglpulang,pd.tglregistrasi
            ) as x
        ")
        );

        $hariPerawatan = DB::select(DB::raw(
            "
        SELECT   COUNT (x.noregistrasi) AS jumlahhariperawatan
                                FROM
                                    (
                                        SELECT
                                            pd.noregistrasi,
                                            pd.tglpulang,
                                            date_part('month',pd.tglregistrasi::date) AS bulanregis 
                                        FROM
                                            pasiendaftar_t AS pd
                                        INNER JOIN ruangan_m AS ru ON ru.ID = pd.objectruanganlastfk
                                        WHERE pd.kdprofile = $idProfile and
                                            ru.objectdepartemenfk = 16
                                        AND pd.tglpulang IS NULL
                                        --AND pd.tglregistrasi NOT BETWEEN '$tglAwal'
                                       --AND '$tglAkhir'
                                    ) AS x"
        ));
        return $this->respond($data);
    }

    public function getLaporanTargetRealisasi(Request $request)
    {
        $tahun = $request['tahun'];
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $data = \DB::select(DB::raw("
                select  x.namaruangan,
	sum(x.Januari) AS Januari,
	sum(x.Februari) AS Februari,
	sum(x.Maret) AS Maret,
	sum(x.April) AS April,
	sum(x.Mei) AS Mei,
	sum(x.Juni) AS Juni,
	sum(x.Juli) AS Juli,
	sum(x.Agustus) AS Agustus,
	sum(x.September) AS September,
	sum(x.Oktober) AS Oktober,
	sum(x.November) AS November,
	sum(x.Desember) AS Desember
	from
	(SELECT
		pd.nocmfk, rg.namaruangan,
				CASE WHEN to_char(pd.tglregistrasi,'m') = '1' THEN 1 ELSE 0 END AS Januari,
CASE WHEN to_char(pd.tglregistrasi,'m') = '2' THEN 1 ELSE 0 END AS Februari,
CASE WHEN to_char(pd.tglregistrasi,'m') = '3' THEN 1 ELSE 0 END AS Maret,
CASE WHEN to_char(pd.tglregistrasi,'m') = '4' THEN 1 ELSE 0 END AS April,
CASE WHEN to_char(pd.tglregistrasi,'m') = '5' THEN 1 ELSE 0 END AS Mei,
CASE WHEN to_char(pd.tglregistrasi,'m') = '6' THEN 1 ELSE 0 END AS Juni,
CASE WHEN to_char(pd.tglregistrasi,'m') = '7' THEN 1 ELSE 0 END AS Juli,
CASE WHEN to_char(pd.tglregistrasi,'m') = '8' THEN 1 ELSE 0 END AS Agustus,
CASE WHEN to_char(pd.tglregistrasi,'m') = '9' THEN 1 ELSE 0 END AS September,
CASE WHEN to_char(pd.tglregistrasi,'m') = '10' THEN 1 ELSE 0 END AS Oktober,
CASE WHEN to_char(pd.tglregistrasi,'m') = '11' THEN 1 ELSE 0 END AS November,
CASE WHEN to_char(pd.tglregistrasi,'m') = '12' THEN 1 ELSE 0 END AS Desember
				FROM pasiendaftar_t as pd
				INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
				INNER JOIN ruangan_m as rg on rg.id = apd.objectruanganfk
				WHERE apd.kdprofile = $idProfile and apd.objectruanganfk IN (566,573,27,570,571,576,575,569)AND to_char(pd.tglregistrasi,'yyyy') = '$tahun'
				GROUP BY pd.nocmfk, rg.namaruangan, pd.tglregistrasi
) as x GROUP BY x.namaruangan

         "));
        return $this->respond($data);
    }

    public function getLaporanIndikatorPelayanan(Request $request)
    {
        $tahun = $request['tahun'];
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $data = \DB::select(DB::raw("
        select x.ket,
        sum(x.Januari) AS Januari,
        sum(x.Februari) AS Februari,
        sum(x.Maret) AS Maret,
        sum(x.April) AS April,
        sum(x.Mei) AS Mei,
        sum(x.Juni) AS Juni,
        sum(x.Juli) AS Juli,
        sum(x.Agustus) AS Agustus,
        sum(x.September) AS September,
        sum(x.Oktober) AS Oktober,
        sum(x.November) AS November,
        sum(x.Desember) AS Desember
        from(
        SELECT
        COUNT(pd.noregistrasi) as jumlah, 'JUMLAH PASIEN RAWAT INAP' as ket,
        CASE WHEN date_part('month',pd.tglregistrasi) = 1 THEN 1 ELSE 0 END AS Januari,
        CASE WHEN date_part('month',pd.tglregistrasi) = 2 THEN 1 ELSE 0 END AS Februari,
        CASE WHEN date_part('month',pd.tglregistrasi) = 3 THEN 1 ELSE 0 END AS Maret,
        CASE WHEN date_part('month',pd.tglregistrasi) = 4 THEN 1 ELSE 0 END AS April,
        CASE WHEN date_part('month',pd.tglregistrasi) = 5 THEN 1 ELSE 0 END AS Mei,
        CASE WHEN date_part('month',pd.tglregistrasi) = 6 THEN 1 ELSE 0 END AS Juni,
        CASE WHEN date_part('month',pd.tglregistrasi) = 7 THEN 1 ELSE 0 END AS Juli,
        CASE WHEN date_part('month',pd.tglregistrasi) = 8 THEN 1 ELSE 0 END AS Agustus,
        CASE WHEN date_part('month',pd.tglregistrasi) = 9 THEN 1 ELSE 0 END AS September,
        CASE WHEN date_part('month',pd.tglregistrasi) = 10 THEN 1 ELSE 0 END AS Oktober,
        CASE WHEN date_part('month',pd.tglregistrasi) = 11 THEN 1 ELSE 0 END AS November,
        CASE WHEN date_part('month',pd.tglregistrasi) = 12 THEN 1 ELSE 0 END AS Desember
        FROM antrianpasiendiperiksa_t as apd
        INNER JOIN pasiendaftar_t as pd on pd.norec = apd.noregistrasifk
        INNER JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
        WHERE apd.kdprofile = $idProfile and ru.objectdepartemenfk = 16 AND date_part('year',pd.tglregistrasi) = $tahun
        GROUP BY pd.tglregistrasi
        )as x GROUP BY x.ket
        UNION ALL
        select x.ket,
        sum(x.Januari) AS Januari,
        sum(x.Februari) AS Februari,
        sum(x.Maret) AS Maret,
        sum(x.April) AS April,
        sum(x.Mei) AS Mei,
        sum(x.Juni) AS Juni,
        sum(x.Juli) AS Juli,
        sum(x.Agustus) AS Agustus,
        sum(x.September) AS September,
        sum(x.Oktober) AS Oktober,
        sum(x.November) AS November,
        sum(x.Desember) AS Desember
        from(
        SELECT
        COUNT(pd.noregistrasi) as jumlah, 'JUMLAH PASIEN RAWAT JALAN' as ket,
        CASE WHEN date_part('month',pd.tglregistrasi) = 1 THEN 1 ELSE 0 END AS Januari,
        CASE WHEN date_part('month',pd.tglregistrasi) = 2 THEN 1 ELSE 0 END AS Februari,
        CASE WHEN date_part('month',pd.tglregistrasi) = 3 THEN 1 ELSE 0 END AS Maret,
        CASE WHEN date_part('month',pd.tglregistrasi) = 4 THEN 1 ELSE 0 END AS April,
        CASE WHEN date_part('month',pd.tglregistrasi) = 5 THEN 1 ELSE 0 END AS Mei,
        CASE WHEN date_part('month',pd.tglregistrasi) = 6 THEN 1 ELSE 0 END AS Juni,
        CASE WHEN date_part('month',pd.tglregistrasi) = 7 THEN 1 ELSE 0 END AS Juli,
        CASE WHEN date_part('month',pd.tglregistrasi) = 8 THEN 1 ELSE 0 END AS Agustus,
        CASE WHEN date_part('month',pd.tglregistrasi) = 9 THEN 1 ELSE 0 END AS September,
        CASE WHEN date_part('month',pd.tglregistrasi) = 10 THEN 1 ELSE 0 END AS Oktober,
        CASE WHEN date_part('month',pd.tglregistrasi) = 11 THEN 1 ELSE 0 END AS November,
        CASE WHEN date_part('month',pd.tglregistrasi) = 12 THEN 1 ELSE 0 END AS Desember
        FROM antrianpasiendiperiksa_t as apd
        INNER JOIN pasiendaftar_t as pd on pd.norec = apd.noregistrasifk
        INNER JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
        WHERE apd.kdprofile = $idProfile and ru.objectdepartemenfk = 18 AND date_part('year',pd.tglregistrasi) = $tahun
        GROUP BY pd.tglregistrasi
        )as x GROUP BY x.ket
        UNION ALL
        select x.ket,
        sum(x.Januari) AS Januari,
        sum(x.Februari) AS Februari,
        sum(x.Maret) AS Maret,
        sum(x.April) AS April,
        sum(x.Mei) AS Mei,
        sum(x.Juni) AS Juni,
        sum(x.Juli) AS Juli,
        sum(x.Agustus) AS Agustus,
        sum(x.September) AS September,
        sum(x.Oktober) AS Oktober,
        sum(x.November) AS November,
        sum(x.Desember) AS Desember
        from(
        SELECT
        COUNT(pd.noregistrasi) as jumlah, 'JUMLAH PASIEN IGD' as ket,
        CASE WHEN date_part('month',pd.tglregistrasi) = 1 THEN 1 ELSE 0 END AS Januari,
        CASE WHEN date_part('month',pd.tglregistrasi) = 2 THEN 1 ELSE 0 END AS Februari,
        CASE WHEN date_part('month',pd.tglregistrasi) = 3 THEN 1 ELSE 0 END AS Maret,
        CASE WHEN date_part('month',pd.tglregistrasi) = 4 THEN 1 ELSE 0 END AS April,
        CASE WHEN date_part('month',pd.tglregistrasi) = 5 THEN 1 ELSE 0 END AS Mei,
        CASE WHEN date_part('month',pd.tglregistrasi) = 6 THEN 1 ELSE 0 END AS Juni,
        CASE WHEN date_part('month',pd.tglregistrasi) = 7 THEN 1 ELSE 0 END AS Juli,
        CASE WHEN date_part('month',pd.tglregistrasi) = 8 THEN 1 ELSE 0 END AS Agustus,
        CASE WHEN date_part('month',pd.tglregistrasi) = 9 THEN 1 ELSE 0 END AS September,
        CASE WHEN date_part('month',pd.tglregistrasi) = 10 THEN 1 ELSE 0 END AS Oktober,
        CASE WHEN date_part('month',pd.tglregistrasi) = 11 THEN 1 ELSE 0 END AS November,
        CASE WHEN date_part('month',pd.tglregistrasi) = 12 THEN 1 ELSE 0 END AS Desember
        FROM antrianpasiendiperiksa_t as apd
        INNER JOIN pasiendaftar_t as pd on pd.norec = apd.noregistrasifk
        INNER JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
        WHERE apd.kdprofile = $idProfile and ru.objectdepartemenfk = 24 AND date_part('year',pd.tglregistrasi) = $tahun
        GROUP BY pd.tglregistrasi
        )as x GROUP BY x.ket

         "));
        return $this->respond($data);
    }

    public function getLaporanJumlahPasienDanCaraBayar(Request $request)
    {
        $tahun = $request['tahun'];
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $data = \DB::select(DB::raw("
                select  x.ket,
            sum(x.Januari) AS Januari,
            sum(x.Februari) AS Februari,
            sum(x.Maret) AS Maret,
            sum(x.April) AS April,
            sum(x.Mei) AS Mei,
            sum(x.Juni) AS Juni,
            sum(x.Juli) AS Juli,
            sum(x.Agustus) AS Agustus,
            sum(x.September) AS September,
            sum(x.Oktober) AS Oktober,
            sum(x.November) AS November,
            sum(x.Desember) AS Desember
            from(
        SELECT
        COUNT(pd.noregistrasi) as jumlah, 'JUMLAH' as ket,
                CASE WHEN date_part('month',pd.tglregistrasi) = 1 THEN 1 ELSE 0 END AS Januari,
                CASE WHEN date_part('month',pd.tglregistrasi) = 2 THEN 1 ELSE 0 END AS Februari,
                CASE WHEN date_part('month',pd.tglregistrasi) = 3 THEN 1 ELSE 0 END AS Maret,
                CASE WHEN date_part('month',pd.tglregistrasi) = 4 THEN 1 ELSE 0 END AS April,
                CASE WHEN date_part('month',pd.tglregistrasi) = 5 THEN 1 ELSE 0 END AS Mei,
                CASE WHEN date_part('month',pd.tglregistrasi) = 6 THEN 1 ELSE 0 END AS Juni,
                CASE WHEN date_part('month',pd.tglregistrasi) = 7 THEN 1 ELSE 0 END AS Juli,
                CASE WHEN date_part('month',pd.tglregistrasi) = 8 THEN 1 ELSE 0 END AS Agustus,
                CASE WHEN date_part('month',pd.tglregistrasi) = 9 THEN 1 ELSE 0 END AS September,
                CASE WHEN date_part('month',pd.tglregistrasi) = 10 THEN 1 ELSE 0 END AS Oktober,
                CASE WHEN date_part('month',pd.tglregistrasi) = 11 THEN 1 ELSE 0 END AS November,
                CASE WHEN date_part('month',pd.tglregistrasi) = 12 THEN 1 ELSE 0 END AS Desember
        FROM pasiendaftar_t as pd
        WHERE  pd.kdprofile = $idProfile and date_part('year', pd.tglregistrasi) = '$tahun'
        GROUP BY pd.tglregistrasi
        )as x GROUP BY x.ket

        UNION ALL

        select  x.ket,
            sum(x.Januari) AS Januari,
            sum(x.Februari) AS Februari,
            sum(x.Maret) AS Maret,
            sum(x.April) AS April,
            sum(x.Mei) AS Mei,
            sum(x.Juni) AS Juni,
            sum(x.Juli) AS Juli,
            sum(x.Agustus) AS Agustus,
            sum(x.September) AS September,
            sum(x.Oktober) AS Oktober,
            sum(x.November) AS November,
            sum(x.Desember) AS Desember
            from(
        SELECT
        COUNT(pd.noregistrasi) as jumlah, 'RI' as ket,
                        CASE WHEN date_part('month',pd.tglregistrasi) = 1 THEN 1 ELSE 0 END AS Januari,
                CASE WHEN date_part('month',pd.tglregistrasi) = 2 THEN 1 ELSE 0 END AS Februari,
                CASE WHEN date_part('month',pd.tglregistrasi) = 3 THEN 1 ELSE 0 END AS Maret,
                CASE WHEN date_part('month',pd.tglregistrasi) = 4 THEN 1 ELSE 0 END AS April,
                CASE WHEN date_part('month',pd.tglregistrasi) = 5 THEN 1 ELSE 0 END AS Mei,
                CASE WHEN date_part('month',pd.tglregistrasi) = 6 THEN 1 ELSE 0 END AS Juni,
                CASE WHEN date_part('month',pd.tglregistrasi) = 7 THEN 1 ELSE 0 END AS Juli,
                CASE WHEN date_part('month',pd.tglregistrasi) = 8 THEN 1 ELSE 0 END AS Agustus,
                CASE WHEN date_part('month',pd.tglregistrasi) = 9 THEN 1 ELSE 0 END AS September,
                CASE WHEN date_part('month',pd.tglregistrasi) = 10 THEN 1 ELSE 0 END AS Oktober,
                CASE WHEN date_part('month',pd.tglregistrasi) = 11 THEN 1 ELSE 0 END AS November,
                CASE WHEN date_part('month',pd.tglregistrasi) = 12 THEN 1 ELSE 0 END AS Desember
        FROM pasiendaftar_t as pd
        INNER JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
        WHERE pd.kdprofile = $idProfile and date_part('year', pd.tglregistrasi) = '$tahun' AND ru.objectdepartemenfk = 16
        GROUP BY pd.tglregistrasi
        )as x GROUP BY x.ket

        UNION ALL

        select  x.ket,
            sum(x.Januari) AS Januari,
            sum(x.Februari) AS Februari,
            sum(x.Maret) AS Maret,
            sum(x.April) AS April,
            sum(x.Mei) AS Mei,
            sum(x.Juni) AS Juni,
            sum(x.Juli) AS Juli,
            sum(x.Agustus) AS Agustus,
            sum(x.September) AS September,
            sum(x.Oktober) AS Oktober,
            sum(x.November) AS November,
            sum(x.Desember) AS Desember
            from(
        SELECT
        COUNT(pd.noregistrasi) as jumlah, 'RJ' as ket,
                        CASE WHEN date_part('month',pd.tglregistrasi) = 1 THEN 1 ELSE 0 END AS Januari,
                CASE WHEN date_part('month',pd.tglregistrasi) = 2 THEN 1 ELSE 0 END AS Februari,
                CASE WHEN date_part('month',pd.tglregistrasi) = 3 THEN 1 ELSE 0 END AS Maret,
                CASE WHEN date_part('month',pd.tglregistrasi) = 4 THEN 1 ELSE 0 END AS April,
                CASE WHEN date_part('month',pd.tglregistrasi) = 5 THEN 1 ELSE 0 END AS Mei,
                CASE WHEN date_part('month',pd.tglregistrasi) = 6 THEN 1 ELSE 0 END AS Juni,
                CASE WHEN date_part('month',pd.tglregistrasi) = 7 THEN 1 ELSE 0 END AS Juli,
                CASE WHEN date_part('month',pd.tglregistrasi) = 8 THEN 1 ELSE 0 END AS Agustus,
                CASE WHEN date_part('month',pd.tglregistrasi) = 9 THEN 1 ELSE 0 END AS September,
                CASE WHEN date_part('month',pd.tglregistrasi) = 10 THEN 1 ELSE 0 END AS Oktober,
                CASE WHEN date_part('month',pd.tglregistrasi) = 11 THEN 1 ELSE 0 END AS November,
                CASE WHEN date_part('month',pd.tglregistrasi) = 12 THEN 1 ELSE 0 END AS Desember
        FROM pasiendaftar_t as pd
        INNER JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
        WHERE pd.kdprofile = $idProfile and date_part('year', pd.tglregistrasi) = '$tahun' AND ru.objectdepartemenfk IN (18)
        GROUP BY pd.tglregistrasi
        )as x GROUP BY x.ket

        UNION ALL

        select  x.ket,
            sum(x.Januari) AS Januari,
            sum(x.Februari) AS Februari,
            sum(x.Maret) AS Maret,
            sum(x.April) AS April,
            sum(x.Mei) AS Mei,
            sum(x.Juni) AS Juni,
            sum(x.Juli) AS Juli,
            sum(x.Agustus) AS Agustus,
            sum(x.September) AS September,
            sum(x.Oktober) AS Oktober,
            sum(x.November) AS November,
            sum(x.Desember) AS Desember
            from(
        SELECT
        COUNT(pd.noregistrasi) as jumlah, 'UMUM' as ket,
                        CASE WHEN date_part('month',pd.tglregistrasi) = 1 THEN 1 ELSE 0 END AS Januari,
                CASE WHEN date_part('month',pd.tglregistrasi) = 2 THEN 1 ELSE 0 END AS Februari,
                CASE WHEN date_part('month',pd.tglregistrasi) = 3 THEN 1 ELSE 0 END AS Maret,
                CASE WHEN date_part('month',pd.tglregistrasi) = 4 THEN 1 ELSE 0 END AS April,
                CASE WHEN date_part('month',pd.tglregistrasi) = 5 THEN 1 ELSE 0 END AS Mei,
                CASE WHEN date_part('month',pd.tglregistrasi) = 6 THEN 1 ELSE 0 END AS Juni,
                CASE WHEN date_part('month',pd.tglregistrasi) = 7 THEN 1 ELSE 0 END AS Juli,
                CASE WHEN date_part('month',pd.tglregistrasi) = 8 THEN 1 ELSE 0 END AS Agustus,
                CASE WHEN date_part('month',pd.tglregistrasi) = 9 THEN 1 ELSE 0 END AS September,
                CASE WHEN date_part('month',pd.tglregistrasi) = 10 THEN 1 ELSE 0 END AS Oktober,
                CASE WHEN date_part('month',pd.tglregistrasi) = 11 THEN 1 ELSE 0 END AS November,
                CASE WHEN date_part('month',pd.tglregistrasi) = 12 THEN 1 ELSE 0 END AS Desember
        FROM pasiendaftar_t as pd
        INNER JOIN kelompokpasien_m as kp on kp.id=pd.objectkelompokpasienlastfk
        WHERE pd.kdprofile = $idProfile and date_part('year', pd.tglregistrasi) = '$tahun' AND kp.id = 1
        GROUP BY pd.tglregistrasi
        )as x GROUP BY x.ket

        UNION ALL

        select  x.ket,
            sum(x.Januari) AS Januari,
            sum(x.Februari) AS Februari,
            sum(x.Maret) AS Maret,
            sum(x.April) AS April,
            sum(x.Mei) AS Mei,
            sum(x.Juni) AS Juni,
            sum(x.Juli) AS Juli,
            sum(x.Agustus) AS Agustus,
            sum(x.September) AS September,
            sum(x.Oktober) AS Oktober,
            sum(x.November) AS November,
            sum(x.Desember) AS Desember
            from(
        SELECT
        COUNT(pd.noregistrasi) as jumlah, 'NON PBI' as ket,
                        CASE WHEN date_part('month',pd.tglregistrasi) = 1 THEN 1 ELSE 0 END AS Januari,
                CASE WHEN date_part('month',pd.tglregistrasi) = 2 THEN 1 ELSE 0 END AS Februari,
                CASE WHEN date_part('month',pd.tglregistrasi) = 3 THEN 1 ELSE 0 END AS Maret,
                CASE WHEN date_part('month',pd.tglregistrasi) = 4 THEN 1 ELSE 0 END AS April,
                CASE WHEN date_part('month',pd.tglregistrasi) = 5 THEN 1 ELSE 0 END AS Mei,
                CASE WHEN date_part('month',pd.tglregistrasi) = 6 THEN 1 ELSE 0 END AS Juni,
                CASE WHEN date_part('month',pd.tglregistrasi) = 7 THEN 1 ELSE 0 END AS Juli,
                CASE WHEN date_part('month',pd.tglregistrasi) = 8 THEN 1 ELSE 0 END AS Agustus,
                CASE WHEN date_part('month',pd.tglregistrasi) = 9 THEN 1 ELSE 0 END AS September,
                CASE WHEN date_part('month',pd.tglregistrasi) = 10 THEN 1 ELSE 0 END AS Oktober,
                CASE WHEN date_part('month',pd.tglregistrasi) = 11 THEN 1 ELSE 0 END AS November,
                CASE WHEN date_part('month',pd.tglregistrasi) = 12 THEN 1 ELSE 0 END AS Desember
        FROM pasiendaftar_t as pd
        INNER JOIN kelompokpasien_m as kp on kp.id=pd.objectkelompokpasienlastfk
        WHERE pd.kdprofile = $idProfile and date_part('year', pd.tglregistrasi) = '$tahun' AND kp.id = 24
        GROUP BY pd.tglregistrasi
        )as x GROUP BY x.ket

        UNION ALL

        select  x.ket,
            sum(x.Januari) AS Januari,
            sum(x.Februari) AS Februari,
            sum(x.Maret) AS Maret,
            sum(x.April) AS April,
            sum(x.Mei) AS Mei,
            sum(x.Juni) AS Juni,
            sum(x.Juli) AS Juli,
            sum(x.Agustus) AS Agustus,
            sum(x.September) AS September,
            sum(x.Oktober) AS Oktober,
            sum(x.November) AS November,
            sum(x.Desember) AS Desember
            from(
        SELECT
        COUNT(pd.noregistrasi) as jumlah, 'PBI' as ket,
                        CASE WHEN date_part('month',pd.tglregistrasi) = 1 THEN 1 ELSE 0 END AS Januari,
                CASE WHEN date_part('month',pd.tglregistrasi) = 2 THEN 1 ELSE 0 END AS Februari,
                CASE WHEN date_part('month',pd.tglregistrasi) = 3 THEN 1 ELSE 0 END AS Maret,
                CASE WHEN date_part('month',pd.tglregistrasi) = 4 THEN 1 ELSE 0 END AS April,
                CASE WHEN date_part('month',pd.tglregistrasi) = 5 THEN 1 ELSE 0 END AS Mei,
                CASE WHEN date_part('month',pd.tglregistrasi) = 6 THEN 1 ELSE 0 END AS Juni,
                CASE WHEN date_part('month',pd.tglregistrasi) = 7 THEN 1 ELSE 0 END AS Juli,
                CASE WHEN date_part('month',pd.tglregistrasi) = 8 THEN 1 ELSE 0 END AS Agustus,
                CASE WHEN date_part('month',pd.tglregistrasi) = 9 THEN 1 ELSE 0 END AS September,
                CASE WHEN date_part('month',pd.tglregistrasi) = 10 THEN 1 ELSE 0 END AS Oktober,
                CASE WHEN date_part('month',pd.tglregistrasi) = 11 THEN 1 ELSE 0 END AS November,
                CASE WHEN date_part('month',pd.tglregistrasi) = 12 THEN 1 ELSE 0 END AS Desember
        FROM pasiendaftar_t as pd
        INNER JOIN kelompokpasien_m as kp on kp.id=pd.objectkelompokpasienlastfk
        WHERE pd.kdprofile = $idProfile and date_part('year', pd.tglregistrasi) = '$tahun' AND kp.id = 10
        GROUP BY pd.tglregistrasi
        )as x GROUP BY x.ket

        UNION ALL

        select  x.ket,
            sum(x.Januari) AS Januari,
            sum(x.Februari) AS Februari,
            sum(x.Maret) AS Maret,
            sum(x.April) AS April,
            sum(x.Mei) AS Mei,
            sum(x.Juni) AS Juni,
            sum(x.Juli) AS Juli,
            sum(x.Agustus) AS Agustus,
            sum(x.September) AS September,
            sum(x.Oktober) AS Oktober,
            sum(x.November) AS November,
            sum(x.Desember) AS Desember
            from(
        SELECT
        COUNT(pd.noregistrasi) as jumlah, 'JAMKESDA' as ket,
                        CASE WHEN date_part('month',pd.tglregistrasi) = 1 THEN 1 ELSE 0 END AS Januari,
                CASE WHEN date_part('month',pd.tglregistrasi) = 2 THEN 1 ELSE 0 END AS Februari,
                CASE WHEN date_part('month',pd.tglregistrasi) = 3 THEN 1 ELSE 0 END AS Maret,
                CASE WHEN date_part('month',pd.tglregistrasi) = 4 THEN 1 ELSE 0 END AS April,
                CASE WHEN date_part('month',pd.tglregistrasi) = 5 THEN 1 ELSE 0 END AS Mei,
                CASE WHEN date_part('month',pd.tglregistrasi) = 6 THEN 1 ELSE 0 END AS Juni,
                CASE WHEN date_part('month',pd.tglregistrasi) = 7 THEN 1 ELSE 0 END AS Juli,
                CASE WHEN date_part('month',pd.tglregistrasi) = 8 THEN 1 ELSE 0 END AS Agustus,
                CASE WHEN date_part('month',pd.tglregistrasi) = 9 THEN 1 ELSE 0 END AS September,
                CASE WHEN date_part('month',pd.tglregistrasi) = 10 THEN 1 ELSE 0 END AS Oktober,
                CASE WHEN date_part('month',pd.tglregistrasi) = 11 THEN 1 ELSE 0 END AS November,
                CASE WHEN date_part('month',pd.tglregistrasi) = 12 THEN 1 ELSE 0 END AS Desember
        FROM pasiendaftar_t as pd
        INNER JOIN kelompokpasien_m as kp on kp.id=pd.objectkelompokpasienlastfk
        WHERE pd.kdprofile = $idProfile and  date_part('year', pd.tglregistrasi) = '$tahun' AND kp.id = 8
        GROUP BY pd.tglregistrasi
        )as x GROUP BY x.ket

        UNION ALL

        select  x.ket,
            sum(x.Januari) AS Januari,
            sum(x.Februari) AS Februari,
            sum(x.Maret) AS Maret,
            sum(x.April) AS April,
            sum(x.Mei) AS Mei,
            sum(x.Juni) AS Juni,
            sum(x.Juli) AS Juli,
            sum(x.Agustus) AS Agustus,
            sum(x.September) AS September,
            sum(x.Oktober) AS Oktober,
            sum(x.November) AS November,
            sum(x.Desember) AS Desember
            from(
        SELECT
        COUNT(pd.noregistrasi) as jumlah, 'JAMKESOS' as ket,
                        CASE WHEN date_part('month',pd.tglregistrasi) = 1 THEN 1 ELSE 0 END AS Januari,
                CASE WHEN date_part('month',pd.tglregistrasi) = 2 THEN 1 ELSE 0 END AS Februari,
                CASE WHEN date_part('month',pd.tglregistrasi) = 3 THEN 1 ELSE 0 END AS Maret,
                CASE WHEN date_part('month',pd.tglregistrasi) = 4 THEN 1 ELSE 0 END AS April,
                CASE WHEN date_part('month',pd.tglregistrasi) = 5 THEN 1 ELSE 0 END AS Mei,
                CASE WHEN date_part('month',pd.tglregistrasi) = 6 THEN 1 ELSE 0 END AS Juni,
                CASE WHEN date_part('month',pd.tglregistrasi) = 7 THEN 1 ELSE 0 END AS Juli,
                CASE WHEN date_part('month',pd.tglregistrasi) = 8 THEN 1 ELSE 0 END AS Agustus,
                CASE WHEN date_part('month',pd.tglregistrasi) = 9 THEN 1 ELSE 0 END AS September,
                CASE WHEN date_part('month',pd.tglregistrasi) = 10 THEN 1 ELSE 0 END AS Oktober,
                CASE WHEN date_part('month',pd.tglregistrasi) = 11 THEN 1 ELSE 0 END AS November,
                CASE WHEN date_part('month',pd.tglregistrasi) = 12 THEN 1 ELSE 0 END AS Desember
        FROM pasiendaftar_t as pd
        INNER JOIN kelompokpasien_m as kp on kp.id=pd.objectkelompokpasienlastfk
        WHERE pd.kdprofile = $idProfile and  date_part('year', pd.tglregistrasi) = '$tahun' AND kp.id = 18
        GROUP BY pd.tglregistrasi
        )as x GROUP BY x.ket

         "));
        return $this->respond($data);
    }

    public function getLaporanJumlahPasienDanCaraBayarIGD(Request $request)
    {
        $tahun = $request['tahun'];
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $data = \DB::select(DB::raw("
        select  x.ket,
        sum(x.Januari) AS Januari,
        sum(x.Februari) AS Februari,
        sum(x.Maret) AS Maret,
        sum(x.April) AS April,
        sum(x.Mei) AS Mei,
        sum(x.Juni) AS Juni,
        sum(x.Juli) AS Juli,
        sum(x.Agustus) AS Agustus,
        sum(x.September) AS September,
        sum(x.Oktober) AS Oktober,
        sum(x.November) AS November,
        sum(x.Desember) AS Desember
        from(
        SELECT
        COUNT(pd.noregistrasi) as jumlah, 'UMUM' as ket,
        CASE WHEN date_part('month',pd.tglregistrasi) = 1 THEN 1 ELSE 0 END AS Januari,
        CASE WHEN date_part('month',pd.tglregistrasi) = 2 THEN 1 ELSE 0 END AS Februari,
        CASE WHEN date_part('month',pd.tglregistrasi) = 3 THEN 1 ELSE 0 END AS Maret,
        CASE WHEN date_part('month',pd.tglregistrasi) = 4 THEN 1 ELSE 0 END AS April,
        CASE WHEN date_part('month',pd.tglregistrasi) = 5 THEN 1 ELSE 0 END AS Mei,
        CASE WHEN date_part('month',pd.tglregistrasi) = 6 THEN 1 ELSE 0 END AS Juni,
        CASE WHEN date_part('month',pd.tglregistrasi) = 7 THEN 1 ELSE 0 END AS Juli,
        CASE WHEN date_part('month',pd.tglregistrasi) = 8 THEN 1 ELSE 0 END AS Agustus,
        CASE WHEN date_part('month',pd.tglregistrasi) = 9 THEN 1 ELSE 0 END AS September,
        CASE WHEN date_part('month',pd.tglregistrasi) = 10 THEN 1 ELSE 0 END AS Oktober,
        CASE WHEN date_part('month',pd.tglregistrasi) = 11 THEN 1 ELSE 0 END AS November,
        CASE WHEN date_part('month',pd.tglregistrasi) = 12 THEN 1 ELSE 0 END AS Desember
        FROM pasiendaftar_t as pd
        INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
        INNER JOIN ruangan_m as rg on rg.id = apd.objectruanganfk
        INNER JOIN kelompokpasien_m as kp on kp.id=pd.objectkelompokpasienlastfk
        WHERE pd.kdprofile = $idProfile and date_part('year', pd.tglregistrasi) = '2022' AND kp.id = 1 AND rg.objectdepartemenfk = 24
        GROUP BY pd.tglregistrasi
        )as x GROUP BY x.ket

        UNION ALL

        select  x.ket,
        sum(x.Januari) AS Januari,
        sum(x.Februari) AS Februari,
        sum(x.Maret) AS Maret,
        sum(x.April) AS April,
        sum(x.Mei) AS Mei,
        sum(x.Juni) AS Juni,
        sum(x.Juli) AS Juli,
        sum(x.Agustus) AS Agustus,
        sum(x.September) AS September,
        sum(x.Oktober) AS Oktober,
        sum(x.November) AS November,
        sum(x.Desember) AS Desember
        from(
        SELECT
        COUNT(pd.noregistrasi) as jumlah, 'NON PBI' as ket,
        CASE WHEN date_part('month',pd.tglregistrasi) = 1 THEN 1 ELSE 0 END AS Januari,
        CASE WHEN date_part('month',pd.tglregistrasi) = 2 THEN 1 ELSE 0 END AS Februari,
        CASE WHEN date_part('month',pd.tglregistrasi) = 3 THEN 1 ELSE 0 END AS Maret,
        CASE WHEN date_part('month',pd.tglregistrasi) = 4 THEN 1 ELSE 0 END AS April,
        CASE WHEN date_part('month',pd.tglregistrasi) = 5 THEN 1 ELSE 0 END AS Mei,
        CASE WHEN date_part('month',pd.tglregistrasi) = 6 THEN 1 ELSE 0 END AS Juni,
        CASE WHEN date_part('month',pd.tglregistrasi) = 7 THEN 1 ELSE 0 END AS Juli,
        CASE WHEN date_part('month',pd.tglregistrasi) = 8 THEN 1 ELSE 0 END AS Agustus,
        CASE WHEN date_part('month',pd.tglregistrasi) = 9 THEN 1 ELSE 0 END AS September,
        CASE WHEN date_part('month',pd.tglregistrasi) = 10 THEN 1 ELSE 0 END AS Oktober,
        CASE WHEN date_part('month',pd.tglregistrasi) = 11 THEN 1 ELSE 0 END AS November,
        CASE WHEN date_part('month',pd.tglregistrasi) = 12 THEN 1 ELSE 0 END AS Desember
        FROM pasiendaftar_t as pd
        INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
        INNER JOIN ruangan_m as rg on rg.id = apd.objectruanganfk
        INNER JOIN kelompokpasien_m as kp on kp.id=pd.objectkelompokpasienlastfk
        WHERE pd.kdprofile = $idProfile and  date_part('year', pd.tglregistrasi) = '$tahun' AND kp.id = 24 AND rg.objectdepartemenfk = 24
        GROUP BY pd.tglregistrasi
        )as x GROUP BY x.ket

        UNION ALL

        select  x.ket,
        sum(x.Januari) AS Januari,
        sum(x.Februari) AS Februari,
        sum(x.Maret) AS Maret,
        sum(x.April) AS April,
        sum(x.Mei) AS Mei,
        sum(x.Juni) AS Juni,
        sum(x.Juli) AS Juli,
        sum(x.Agustus) AS Agustus,
        sum(x.September) AS September,
        sum(x.Oktober) AS Oktober,
        sum(x.November) AS November,
        sum(x.Desember) AS Desember
        from(
        SELECT
        COUNT(pd.noregistrasi) as jumlah, 'BPJS PBI' as ket,
        CASE WHEN date_part('month',pd.tglregistrasi) = 1 THEN 1 ELSE 0 END AS Januari,
        CASE WHEN date_part('month',pd.tglregistrasi) = 2 THEN 1 ELSE 0 END AS Februari,
        CASE WHEN date_part('month',pd.tglregistrasi) = 3 THEN 1 ELSE 0 END AS Maret,
        CASE WHEN date_part('month',pd.tglregistrasi) = 4 THEN 1 ELSE 0 END AS April,
        CASE WHEN date_part('month',pd.tglregistrasi) = 5 THEN 1 ELSE 0 END AS Mei,
        CASE WHEN date_part('month',pd.tglregistrasi) = 6 THEN 1 ELSE 0 END AS Juni,
        CASE WHEN date_part('month',pd.tglregistrasi) = 7 THEN 1 ELSE 0 END AS Juli,
        CASE WHEN date_part('month',pd.tglregistrasi) = 8 THEN 1 ELSE 0 END AS Agustus,
        CASE WHEN date_part('month',pd.tglregistrasi) = 9 THEN 1 ELSE 0 END AS September,
        CASE WHEN date_part('month',pd.tglregistrasi) = 10 THEN 1 ELSE 0 END AS Oktober,
        CASE WHEN date_part('month',pd.tglregistrasi) = 11 THEN 1 ELSE 0 END AS November,
        CASE WHEN date_part('month',pd.tglregistrasi) = 12 THEN 1 ELSE 0 END AS Desember
        FROM pasiendaftar_t as pd
        INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
        INNER JOIN ruangan_m as rg on rg.id = apd.objectruanganfk
        INNER JOIN kelompokpasien_m as kp on kp.id=pd.objectkelompokpasienlastfk
        WHERE  pd.kdprofile = $idProfile and date_part('year', pd.tglregistrasi) = '$tahun' AND kp.id = 10 AND rg.objectdepartemenfk = 24
        GROUP BY pd.tglregistrasi
        )as x GROUP BY x.ket

        UNION ALL

        select  x.ket,
        sum(x.Januari) AS Januari,
        sum(x.Februari) AS Februari,
        sum(x.Maret) AS Maret,
        sum(x.April) AS April,
        sum(x.Mei) AS Mei,
        sum(x.Juni) AS Juni,
        sum(x.Juli) AS Juli,
        sum(x.Agustus) AS Agustus,
        sum(x.September) AS September,
        sum(x.Oktober) AS Oktober,
        sum(x.November) AS November,
        sum(x.Desember) AS Desember
        from(
        SELECT
        COUNT(pd.noregistrasi) as jumlah, 'JAMKESDA' as ket,
        CASE WHEN date_part('month',pd.tglregistrasi) = 1 THEN 1 ELSE 0 END AS Januari,
        CASE WHEN date_part('month',pd.tglregistrasi) = 2 THEN 1 ELSE 0 END AS Februari,
        CASE WHEN date_part('month',pd.tglregistrasi) = 3 THEN 1 ELSE 0 END AS Maret,
        CASE WHEN date_part('month',pd.tglregistrasi) = 4 THEN 1 ELSE 0 END AS April,
        CASE WHEN date_part('month',pd.tglregistrasi) = 5 THEN 1 ELSE 0 END AS Mei,
        CASE WHEN date_part('month',pd.tglregistrasi) = 6 THEN 1 ELSE 0 END AS Juni,
        CASE WHEN date_part('month',pd.tglregistrasi) = 7 THEN 1 ELSE 0 END AS Juli,
        CASE WHEN date_part('month',pd.tglregistrasi) = 8 THEN 1 ELSE 0 END AS Agustus,
        CASE WHEN date_part('month',pd.tglregistrasi) = 9 THEN 1 ELSE 0 END AS September,
        CASE WHEN date_part('month',pd.tglregistrasi) = 10 THEN 1 ELSE 0 END AS Oktober,
        CASE WHEN date_part('month',pd.tglregistrasi) = 11 THEN 1 ELSE 0 END AS November,
        CASE WHEN date_part('month',pd.tglregistrasi) = 12 THEN 1 ELSE 0 END AS Desember
        FROM pasiendaftar_t as pd
        INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
        INNER JOIN ruangan_m as rg on rg.id = apd.objectruanganfk
        INNER JOIN kelompokpasien_m as kp on kp.id=pd.objectkelompokpasienlastfk
        WHERE pd.kdprofile = $idProfile and date_part('year', pd.tglregistrasi) = '$tahun' AND kp.id = 8 AND rg.objectdepartemenfk = 24
        GROUP BY pd.tglregistrasi
        )as x GROUP BY x.ket

        UNION ALL

        select  x.ket,
        sum(x.Januari) AS Januari,
        sum(x.Februari) AS Februari,
        sum(x.Maret) AS Maret,
        sum(x.April) AS April,
        sum(x.Mei) AS Mei,
        sum(x.Juni) AS Juni,
        sum(x.Juli) AS Juli,
        sum(x.Agustus) AS Agustus,
        sum(x.September) AS September,
        sum(x.Oktober) AS Oktober,
        sum(x.November) AS November,
        sum(x.Desember) AS Desember
        from(
        SELECT
        COUNT(pd.noregistrasi) as jumlah, 'JAMKESOS' as ket,
        CASE WHEN date_part('month',pd.tglregistrasi) = 1 THEN 1 ELSE 0 END AS Januari,
        CASE WHEN date_part('month',pd.tglregistrasi) = 2 THEN 1 ELSE 0 END AS Februari,
        CASE WHEN date_part('month',pd.tglregistrasi) = 3 THEN 1 ELSE 0 END AS Maret,
        CASE WHEN date_part('month',pd.tglregistrasi) = 4 THEN 1 ELSE 0 END AS April,
        CASE WHEN date_part('month',pd.tglregistrasi) = 5 THEN 1 ELSE 0 END AS Mei,
        CASE WHEN date_part('month',pd.tglregistrasi) = 6 THEN 1 ELSE 0 END AS Juni,
        CASE WHEN date_part('month',pd.tglregistrasi) = 7 THEN 1 ELSE 0 END AS Juli,
        CASE WHEN date_part('month',pd.tglregistrasi) = 8 THEN 1 ELSE 0 END AS Agustus,
        CASE WHEN date_part('month',pd.tglregistrasi) = 9 THEN 1 ELSE 0 END AS September,
        CASE WHEN date_part('month',pd.tglregistrasi) = 10 THEN 1 ELSE 0 END AS Oktober,
        CASE WHEN date_part('month',pd.tglregistrasi) = 11 THEN 1 ELSE 0 END AS November,
        CASE WHEN date_part('month',pd.tglregistrasi) = 12 THEN 1 ELSE 0 END AS Desember
        FROM pasiendaftar_t as pd
        INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
        INNER JOIN ruangan_m as rg on rg.id = apd.objectruanganfk
        INNER JOIN kelompokpasien_m as kp on kp.id=pd.objectkelompokpasienlastfk
        WHERE pd.kdprofile = $idProfile and date_part('year', pd.tglregistrasi) = '$tahun' AND kp.id = 18 AND rg.objectdepartemenfk = 24
        GROUP BY pd.tglregistrasi
        )as x GROUP BY x.ket
"));
        return $this->respond($data);
    }

    public function getLaporanKinerjaBayarRJ(Request $request)
    {
        $tahun = $request['tahun'];
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $data = DB::select(DB::raw("
                SELECT y.kelompokpasien,
			SUM(JanL) AS JanL,
			SUM(JanW) AS JanW,
			SUM(FebL) AS FebL,
			SUM(FebW) AS FebW,
			SUM(MarL) AS MarL,
			SUM(MarW) AS MarW,
			SUM(AprL) AS AprL,
			SUM(AprW) AS AprW,
			SUM(MeiL) AS MeiL,
			SUM(MeiW) AS MeiW,
			SUM(JunL) AS JunL,
			SUM(JunW) AS JunW,
			SUM(JulL) AS JulL,
			SUM(JulW) AS JulW,
			SUM(AguL) AS AguL,
			SUM(AguW) AS AguW,
			SUM(SepL) AS SepL,
			SUM(SepW) AS SepW,
			SUM(OktL) AS OktL,
			SUM(OktW) AS OktW,
			SUM(NovL) AS NovL,
			SUM(NovW) AS NovW,
			SUM(DesL) AS DesL,
			SUM(DesW) AS DesW,
			SUM(y.Jumlah) AS Jumlah
  FROM
(SELECT DISTINCT x.kelompokpasien,
				CASE WHEN (x.bulan = 1 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS JanL,
				CASE WHEN (x.bulan = 2 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS FebL,
				CASE WHEN (x.bulan = 3 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS MarL,
				CASE WHEN (x.bulan = 4 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS AprL,
				CASE WHEN (x.bulan = 5 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS MeiL,
				CASE WHEN (x.bulan = 6 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS JunL,
				CASE WHEN (x.bulan = 7 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS JulL,
				CASE WHEN (x.bulan = 8 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS AguL,
				CASE WHEN (x.bulan = 9 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS SepL,
				CASE WHEN (x.bulan = 10 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS OktL,
				CASE WHEN (x.bulan = 11 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS NovL,
				CASE WHEN (x.bulan = 12 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS DesL,
				CASE WHEN (x.bulan = 1 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS JanW,
				CASE WHEN (x.bulan = 2 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS FebW,
				CASE WHEN (x.bulan = 3 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS MarW,
				CASE WHEN (x.bulan = 4 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS AprW,
				CASE WHEN (x.bulan = 5 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS MeiW,
				CASE WHEN (x.bulan = 6 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS JunW,
				CASE WHEN (x.bulan = 7 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS JulW,
				CASE WHEN (x.bulan = 8 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS AguW,
				CASE WHEN (x.bulan = 9 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS SepW,
				CASE WHEN (x.bulan = 10 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS OktW,
				CASE WHEN (x.bulan = 11 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS NovW,
				CASE WHEN (x.bulan = 12 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS DesW,
		COUNT(*) AS Jumlah
		FROM
(SELECT kp.kelompokpasien,
			CASE WHEN jk.id = 1 THEN 1 ELSE 0 END AS laki,
			CASE WHEN jk.id = 2 THEN 1 ELSE 0 END AS wanita,
			MONTH(pd.tglregistrasi) AS bulan
		FROM pasiendaftar_t as pd
		INNER JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
		INNER JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
		INNER JOIN pasien_m as ps on ps.id = pd.nocmfk
		LEFT JOIN jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk
		WHERE pd.kdprofile = $idProfile and YEAR(pd.tglregistrasi) = '$tahun' AND ru.objectdepartemenfk IN (3,18,24,26,27,28,30,34,45)) AS x
GROUP BY x.kelompokpasien, x.bulan, x.laki, x.wanita) AS y
GROUP BY y.kelompokpasien

         "));
        return $this->respond($data);
    }

    public function getLaporanKinerjaBayarRI(Request $request)
    {
        $tahun = $request['tahun'];
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $data = DB::select(DB::raw("
                SELECT y.kelompokpasien,
			SUM(JanL) AS JanL,
			SUM(JanW) AS JanW,
			SUM(FebL) AS FebL,
			SUM(FebW) AS FebW,
			SUM(MarL) AS MarL,
			SUM(MarW) AS MarW,
			SUM(AprL) AS AprL,
			SUM(AprW) AS AprW,
			SUM(MeiL) AS MeiL,
			SUM(MeiW) AS MeiW,
			SUM(JunL) AS JunL,
			SUM(JunW) AS JunW,
			SUM(JulL) AS JulL,
			SUM(JulW) AS JulW,
			SUM(AguL) AS AguL,
			SUM(AguW) AS AguW,
			SUM(SepL) AS SepL,
			SUM(SepW) AS SepW,
			SUM(OktL) AS OktL,
			SUM(OktW) AS OktW,
			SUM(NovL) AS NovL,
			SUM(NovW) AS NovW,
			SUM(DesL) AS DesL,
			SUM(DesW) AS DesW,
			SUM(y.Jumlah) AS Jumlah
  FROM
(SELECT DISTINCT x.kelompokpasien,
				CASE WHEN (x.bulan = 1 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS JanL,
				CASE WHEN (x.bulan = 2 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS FebL,
				CASE WHEN (x.bulan = 3 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS MarL,
				CASE WHEN (x.bulan = 4 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS AprL,
				CASE WHEN (x.bulan = 5 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS MeiL,
				CASE WHEN (x.bulan = 6 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS JunL,
				CASE WHEN (x.bulan = 7 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS JulL,
				CASE WHEN (x.bulan = 8 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS AguL,
				CASE WHEN (x.bulan = 9 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS SepL,
				CASE WHEN (x.bulan = 10 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS OktL,
				CASE WHEN (x.bulan = 11 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS NovL,
				CASE WHEN (x.bulan = 12 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS DesL,
				CASE WHEN (x.bulan = 1 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS JanW,
				CASE WHEN (x.bulan = 2 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS FebW,
				CASE WHEN (x.bulan = 3 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS MarW,
				CASE WHEN (x.bulan = 4 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS AprW,
				CASE WHEN (x.bulan = 5 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS MeiW,
				CASE WHEN (x.bulan = 6 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS JunW,
				CASE WHEN (x.bulan = 7 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS JulW,
				CASE WHEN (x.bulan = 8 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS AguW,
				CASE WHEN (x.bulan = 9 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS SepW,
				CASE WHEN (x.bulan = 10 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS OktW,
				CASE WHEN (x.bulan = 11 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS NovW,
				CASE WHEN (x.bulan = 12 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS DesW,
		COUNT(*) AS Jumlah
		FROM
(SELECT kp.kelompokpasien,
			CASE WHEN jk.id = 1 THEN 1 ELSE 0 END AS laki,
			CASE WHEN jk.id = 2 THEN 1 ELSE 0 END AS wanita,
			MONTH(pd.tglregistrasi) AS bulan
		FROM pasiendaftar_t as pd
		INNER JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
		INNER JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
		INNER JOIN pasien_m as ps on ps.id = pd.nocmfk
		LEFT JOIN jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk
		WHERE pd.kdprofile = $idProfile and YEAR(pd.tglregistrasi) = '$tahun' AND ru.objectdepartemenfk=16) AS x
GROUP BY x.kelompokpasien, x.bulan, x.laki, x.wanita) AS y
GROUP BY y.kelompokpasien

         "));
        return $this->respond($data);
    }

    public function getLaporanKinerjaKunjunganIGD(Request $request)
    {
        $tahun = $request['tahun'];
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $data = DB::select(DB::raw("
                SELECT y.KET,
			SUM(JanL) AS JanL,
			SUM(JanW) AS JanW,
			SUM(FebL) AS FebL,
			SUM(FebW) AS FebW,
			SUM(MarL) AS MarL,
			SUM(MarW) AS MarW,
			SUM(AprL) AS AprL,
			SUM(AprW) AS AprW,
			SUM(MeiL) AS MeiL,
			SUM(MeiW) AS MeiW,
			SUM(JunL) AS JunL,
			SUM(JunW) AS JunW,
			SUM(JulL) AS JulL,
			SUM(JulW) AS JulW,
			SUM(AguL) AS AguL,
			SUM(AguW) AS AguW,
			SUM(SepL) AS SepL,
			SUM(SepW) AS SepW,
			SUM(OktL) AS OktL,
			SUM(OktW) AS OktW,
			SUM(NovL) AS NovL,
			SUM(NovW) AS NovW,
			SUM(DesL) AS DesL,
			SUM(DesW) AS DesW,
			SUM(y.Jumlah) AS Jumlah
  FROM
(SELECT DISTINCT x.KET,
				CASE WHEN (x.bulan = 1 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS JanL,
				CASE WHEN (x.bulan = 2 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS FebL,
				CASE WHEN (x.bulan = 3 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS MarL,
				CASE WHEN (x.bulan = 4 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS AprL,
				CASE WHEN (x.bulan = 5 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS MeiL,
				CASE WHEN (x.bulan = 6 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS JunL,
				CASE WHEN (x.bulan = 7 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS JulL,
				CASE WHEN (x.bulan = 8 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS AguL,
				CASE WHEN (x.bulan = 9 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS SepL,
				CASE WHEN (x.bulan = 10 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS OktL,
				CASE WHEN (x.bulan = 11 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS NovL,
				CASE WHEN (x.bulan = 12 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS DesL,
				CASE WHEN (x.bulan = 1 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS JanW,
				CASE WHEN (x.bulan = 2 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS FebW,
				CASE WHEN (x.bulan = 3 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS MarW,
				CASE WHEN (x.bulan = 4 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS AprW,
				CASE WHEN (x.bulan = 5 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS MeiW,
				CASE WHEN (x.bulan = 6 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS JunW,
				CASE WHEN (x.bulan = 7 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS JulW,
				CASE WHEN (x.bulan = 8 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS AguW,
				CASE WHEN (x.bulan = 9 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS SepW,
				CASE WHEN (x.bulan = 10 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS OktW,
				CASE WHEN (x.bulan = 11 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS NovW,
				CASE WHEN (x.bulan = 12 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS DesW,
		COUNT(*) AS Jumlah
		FROM
(SELECT
			CASE WHEN pd.tglpulang IS NOT NULL THEN 'Dipulangkan' ELSE 'Tidak Dipulangkan' end AS KET,

			CASE WHEN jk.id = 1 THEN 1 ELSE 0 END AS laki,
			CASE WHEN jk.id = 2 THEN 1 ELSE 0 END AS wanita,
			MONTH(pd.tglregistrasi) AS bulan
		FROM pasiendaftar_t as pd
		INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
		INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk
		INNER JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
		INNER JOIN pasien_m as ps on ps.id = pd.nocmfk
		LEFT JOIN jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk
		WHERE pd.kdprofile = $idProfile and YEAR(pd.tglregistrasi) = '$tahun' AND ru.objectdepartemenfk IN (24)) AS x
GROUP BY x.KET, x.bulan, x.laki, x.wanita) AS y
GROUP BY y.KET

         "));
        return $this->respond($data);
    }

    public function getLaporanKinerjaPengunjung(Request $request)
    {
        $tahun = $request['tahun'];
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $data = DB::select(DB::raw("
                SELECT y.KET,
			SUM(JanL) AS JanL,
			SUM(JanW) AS JanW,
			SUM(FebL) AS FebL,
			SUM(FebW) AS FebW,
			SUM(MarL) AS MarL,
			SUM(MarW) AS MarW,
			SUM(AprL) AS AprL,
			SUM(AprW) AS AprW,
			SUM(MeiL) AS MeiL,
			SUM(MeiW) AS MeiW,
			SUM(JunL) AS JunL,
			SUM(JunW) AS JunW,
			SUM(JulL) AS JulL,
			SUM(JulW) AS JulW,
			SUM(AguL) AS AguL,
			SUM(AguW) AS AguW,
			SUM(SepL) AS SepL,
			SUM(SepW) AS SepW,
			SUM(OktL) AS OktL,
			SUM(OktW) AS OktW,
			SUM(NovL) AS NovL,
			SUM(NovW) AS NovW,
			SUM(DesL) AS DesL,
			SUM(DesW) AS DesW,
			SUM(y.Jumlah) AS Jumlah
  FROM
(SELECT DISTINCT x.KET,
				CASE WHEN (x.bulan = 1 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS JanL,
				CASE WHEN (x.bulan = 2 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS FebL,
				CASE WHEN (x.bulan = 3 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS MarL,
				CASE WHEN (x.bulan = 4 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS AprL,
				CASE WHEN (x.bulan = 5 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS MeiL,
				CASE WHEN (x.bulan = 6 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS JunL,
				CASE WHEN (x.bulan = 7 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS JulL,
				CASE WHEN (x.bulan = 8 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS AguL,
				CASE WHEN (x.bulan = 9 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS SepL,
				CASE WHEN (x.bulan = 10 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS OktL,
				CASE WHEN (x.bulan = 11 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS NovL,
				CASE WHEN (x.bulan = 12 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS DesL,
				CASE WHEN (x.bulan = 1 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS JanW,
				CASE WHEN (x.bulan = 2 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS FebW,
				CASE WHEN (x.bulan = 3 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS MarW,
				CASE WHEN (x.bulan = 4 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS AprW,
				CASE WHEN (x.bulan = 5 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS MeiW,
				CASE WHEN (x.bulan = 6 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS JunW,
				CASE WHEN (x.bulan = 7 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS JulW,
				CASE WHEN (x.bulan = 8 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS AguW,
				CASE WHEN (x.bulan = 9 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS SepW,
				CASE WHEN (x.bulan = 10 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS OktW,
				CASE WHEN (x.bulan = 11 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS NovW,
				CASE WHEN (x.bulan = 12 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS DesW,
		COUNT(*) AS Jumlah
		FROM
(SELECT
			CASE WHEN pd.statuspasien = 'LAMA' THEN 'Lama' ELSE 'Baru' END as KET,

			CASE WHEN jk.id = 1 THEN 1 ELSE 0 END AS laki,
			CASE WHEN jk.id = 2 THEN 1 ELSE 0 END AS wanita,
			MONTH(pd.tglregistrasi) AS bulan
		FROM pasiendaftar_t as pd
		INNER JOIN pasien_m as ps on ps.id = pd.nocmfk
        LEFT JOIN jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk
		WHERE pd.kdprofile = $idProfile and YEAR(pd.tglregistrasi) = '$tahun') AS x
GROUP BY x.KET, x.bulan, x.laki, x.wanita) AS y
GROUP BY y.KET

         "));
        return $this->respond($data);
    }

    public function getLaporanKinerjaKunjungan(Request $request)
    {
        $tahun = $request['tahun'];
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $data = DB::select(DB::raw("
                SELECT y.KET,
			SUM(JanL) AS JanL,
			SUM(JanW) AS JanW,
			SUM(FebL) AS FebL,
			SUM(FebW) AS FebW,
			SUM(MarL) AS MarL,
			SUM(MarW) AS MarW,
			SUM(AprL) AS AprL,
			SUM(AprW) AS AprW,
			SUM(MeiL) AS MeiL,
			SUM(MeiW) AS MeiW,
			SUM(JunL) AS JunL,
			SUM(JunW) AS JunW,
			SUM(JulL) AS JulL,
			SUM(JulW) AS JulW,
			SUM(AguL) AS AguL,
			SUM(AguW) AS AguW,
			SUM(SepL) AS SepL,
			SUM(SepW) AS SepW,
			SUM(OktL) AS OktL,
			SUM(OktW) AS OktW,
			SUM(NovL) AS NovL,
			SUM(NovW) AS NovW,
			SUM(DesL) AS DesL,
			SUM(DesW) AS DesW,
			SUM(y.Jumlah) AS Jumlah
  FROM
(SELECT DISTINCT x.KET,
				CASE WHEN (x.bulan = 1 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS JanL,
				CASE WHEN (x.bulan = 2 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS FebL,
				CASE WHEN (x.bulan = 3 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS MarL,
				CASE WHEN (x.bulan = 4 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS AprL,
				CASE WHEN (x.bulan = 5 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS MeiL,
				CASE WHEN (x.bulan = 6 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS JunL,
				CASE WHEN (x.bulan = 7 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS JulL,
				CASE WHEN (x.bulan = 8 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS AguL,
				CASE WHEN (x.bulan = 9 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS SepL,
				CASE WHEN (x.bulan = 10 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS OktL,
				CASE WHEN (x.bulan = 11 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS NovL,
				CASE WHEN (x.bulan = 12 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS DesL,
				CASE WHEN (x.bulan = 1 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS JanW,
				CASE WHEN (x.bulan = 2 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS FebW,
				CASE WHEN (x.bulan = 3 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS MarW,
				CASE WHEN (x.bulan = 4 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS AprW,
				CASE WHEN (x.bulan = 5 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS MeiW,
				CASE WHEN (x.bulan = 6 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS JunW,
				CASE WHEN (x.bulan = 7 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS JulW,
				CASE WHEN (x.bulan = 8 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS AguW,
				CASE WHEN (x.bulan = 9 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS SepW,
				CASE WHEN (x.bulan = 10 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS OktW,
				CASE WHEN (x.bulan = 11 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS NovW,
				CASE WHEN (x.bulan = 12 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS DesW,
		COUNT(*) AS Jumlah
		FROM
(SELECT
			CASE WHEN pd.statuspasien = 'LAMA' THEN 'Lama' ELSE 'Baru' END as KET,

			CASE WHEN jk.id = 1 THEN 1 ELSE 0 END AS laki,
			CASE WHEN jk.id = 2 THEN 1 ELSE 0 END AS wanita,
			MONTH(pd.tglregistrasi) AS bulan
		FROM antrianpasiendiperiksa_t as apd
		INNER JOIN pasiendaftar_t as pd on pd.norec	= apd.noregistrasifk
		INNER JOIN pasien_m as ps on ps.id = pd.nocmfk
		LEFT JOIN jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk
		WHERE pd.kdprofile = $idProfile and   YEAR(pd.tglregistrasi) = '$tahun') AS x
GROUP BY x.KET, x.bulan, x.laki, x.wanita) AS y
GROUP BY y.KET

         "));
        return $this->respond($data);
    }

    public function getLaporanKinerjaRawatInap(Request $request)
    {
        $tahun = $request['tahun'];
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $data = DB::select(DB::raw("
                SELECT y.KET,
			SUM(JanL) AS JanL,
			SUM(JanW) AS JanW,
			SUM(FebL) AS FebL,
			SUM(FebW) AS FebW,
			SUM(MarL) AS MarL,
			SUM(MarW) AS MarW,
			SUM(AprL) AS AprL,
			SUM(AprW) AS AprW,
			SUM(MeiL) AS MeiL,
			SUM(MeiW) AS MeiW,
			SUM(JunL) AS JunL,
			SUM(JunW) AS JunW,
			SUM(JulL) AS JulL,
			SUM(JulW) AS JulW,
			SUM(AguL) AS AguL,
			SUM(AguW) AS AguW,
			SUM(SepL) AS SepL,
			SUM(SepW) AS SepW,
			SUM(OktL) AS OktL,
			SUM(OktW) AS OktW,
			SUM(NovL) AS NovL,
			SUM(NovW) AS NovW,
			SUM(DesL) AS DesL,
			SUM(DesW) AS DesW,
			SUM(y.Jumlah) AS Jumlah
  FROM
(SELECT DISTINCT x.KET,
				CASE WHEN (x.bulan = 1 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS JanL,
				CASE WHEN (x.bulan = 2 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS FebL,
				CASE WHEN (x.bulan = 3 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS MarL,
				CASE WHEN (x.bulan = 4 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS AprL,
				CASE WHEN (x.bulan = 5 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS MeiL,
				CASE WHEN (x.bulan = 6 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS JunL,
				CASE WHEN (x.bulan = 7 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS JulL,
				CASE WHEN (x.bulan = 8 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS AguL,
				CASE WHEN (x.bulan = 9 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS SepL,
				CASE WHEN (x.bulan = 10 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS OktL,
				CASE WHEN (x.bulan = 11 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS NovL,
				CASE WHEN (x.bulan = 12 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS DesL,
				CASE WHEN (x.bulan = 1 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS JanW,
				CASE WHEN (x.bulan = 2 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS FebW,
				CASE WHEN (x.bulan = 3 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS MarW,
				CASE WHEN (x.bulan = 4 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS AprW,
				CASE WHEN (x.bulan = 5 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS MeiW,
				CASE WHEN (x.bulan = 6 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS JunW,
				CASE WHEN (x.bulan = 7 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS JulW,
				CASE WHEN (x.bulan = 8 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS AguW,
				CASE WHEN (x.bulan = 9 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS SepW,
				CASE WHEN (x.bulan = 10 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS OktW,
				CASE WHEN (x.bulan = 11 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS NovW,
				CASE WHEN (x.bulan = 12 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS DesW,
		COUNT(*) AS Jumlah
		FROM
(SELECT
			--CASE WHEN pd.statuspasien = 'LAMA' THEN 'Lama' ELSE 'Baru' END as KET,
			COUNT(pd.noregistrasi) as jumlahku,'Masuk' as KET,
			CASE WHEN jk.id = 1 THEN 1 ELSE 0 END AS laki,
			CASE WHEN jk.id = 2 THEN 1 ELSE 0 END AS wanita,
			MONTH(pd.tglregistrasi) AS bulan
		FROM pasiendaftar_t as pd
		INNER JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
		INNER JOIN pasien_m as ps on ps.id = pd.nocmfk
		LEFT JOIN jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk
		WHERE  pd.kdprofile = $idProfile and YEAR(pd.tglregistrasi) = '$tahun' AND ru.objectdepartemenfk = 16
GROUP BY jk.id, pd.tglregistrasi) AS x
GROUP BY x.KET, x.bulan, x.laki, x.wanita) AS y
GROUP BY y.KET

UNION ALL

SELECT y.KET,
			SUM(JanL) AS JanL,
			SUM(JanW) AS JanW,
			SUM(FebL) AS FebL,
			SUM(FebW) AS FebW,
			SUM(MarL) AS MarL,
			SUM(MarW) AS MarW,
			SUM(AprL) AS AprL,
			SUM(AprW) AS AprW,
			SUM(MeiL) AS MeiL,
			SUM(MeiW) AS MeiW,
			SUM(JunL) AS JunL,
			SUM(JunW) AS JunW,
			SUM(JulL) AS JulL,
			SUM(JulW) AS JulW,
			SUM(AguL) AS AguL,
			SUM(AguW) AS AguW,
			SUM(SepL) AS SepL,
			SUM(SepW) AS SepW,
			SUM(OktL) AS OktL,
			SUM(OktW) AS OktW,
			SUM(NovL) AS NovL,
			SUM(NovW) AS NovW,
			SUM(DesL) AS DesL,
			SUM(DesW) AS DesW,
			SUM(y.Jumlah) AS Jumlah
  FROM
(SELECT DISTINCT x.KET,
				CASE WHEN (x.bulan = 1 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS JanL,
				CASE WHEN (x.bulan = 2 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS FebL,
				CASE WHEN (x.bulan = 3 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS MarL,
				CASE WHEN (x.bulan = 4 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS AprL,
				CASE WHEN (x.bulan = 5 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS MeiL,
				CASE WHEN (x.bulan = 6 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS JunL,
				CASE WHEN (x.bulan = 7 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS JulL,
				CASE WHEN (x.bulan = 8 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS AguL,
				CASE WHEN (x.bulan = 9 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS SepL,
				CASE WHEN (x.bulan = 10 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS OktL,
				CASE WHEN (x.bulan = 11 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS NovL,
				CASE WHEN (x.bulan = 12 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS DesL,
				CASE WHEN (x.bulan = 1 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS JanW,
				CASE WHEN (x.bulan = 2 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS FebW,
				CASE WHEN (x.bulan = 3 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS MarW,
				CASE WHEN (x.bulan = 4 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS AprW,
				CASE WHEN (x.bulan = 5 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS MeiW,
				CASE WHEN (x.bulan = 6 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS JunW,
				CASE WHEN (x.bulan = 7 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS JulW,
				CASE WHEN (x.bulan = 8 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS AguW,
				CASE WHEN (x.bulan = 9 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS SepW,
				CASE WHEN (x.bulan = 10 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS OktW,
				CASE WHEN (x.bulan = 11 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS NovW,
				CASE WHEN (x.bulan = 12 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS DesW,
		COUNT(*) AS Jumlah
		FROM
(SELECT pd.noregistrasi, pd.tglpulang,
			--CASE WHEN pd.statuspasien = 'LAMA' THEN 'Lama' ELSE 'Baru' END as KET,
			COUNT(pd.noregistrasi) as jumlahku,'Keluar' as KET,
			CASE WHEN jk.id = 1 THEN 1 ELSE 0 END AS laki,
			CASE WHEN jk.id = 2 THEN 1 ELSE 0 END AS wanita,
			MONTH(pd.tglpulang) AS bulan
		FROM pasiendaftar_t as pd
		INNER JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
		INNER JOIN pasien_m as ps on ps.id = pd.nocmfk
		LEFT JOIN jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk
		WHERE pd.kdprofile = $idProfile and YEAR(pd.tglpulang) = '2020' AND ru.objectdepartemenfk = 16
GROUP BY jk.id, pd.tglpulang, pd.noregistrasi, pd.tglregistrasi) AS x
GROUP BY x.KET, x.bulan, x.laki, x.wanita) AS y
GROUP BY y.KET

UNION ALL
SELECT y.KET,
			SUM(JanL) AS JanL,
			SUM(JanW) AS JanW,
			SUM(FebL) AS FebL,
			SUM(FebW) AS FebW,
			SUM(MarL) AS MarL,
			SUM(MarW) AS MarW,
			SUM(AprL) AS AprL,
			SUM(AprW) AS AprW,
			SUM(MeiL) AS MeiL,
			SUM(MeiW) AS MeiW,
			SUM(JunL) AS JunL,
			SUM(JunW) AS JunW,
			SUM(JulL) AS JulL,
			SUM(JulW) AS JulW,
			SUM(AguL) AS AguL,
			SUM(AguW) AS AguW,
			SUM(SepL) AS SepL,
			SUM(SepW) AS SepW,
			SUM(OktL) AS OktL,
			SUM(OktW) AS OktW,
			SUM(NovL) AS NovL,
			SUM(NovW) AS NovW,
			SUM(DesL) AS DesL,
			SUM(DesW) AS DesW,
			SUM(y.Jumlah) AS Jumlah
  FROM
(SELECT DISTINCT x.KET,
				CASE WHEN (x.bulan = 1 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS JanL,
				CASE WHEN (x.bulan = 2 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS FebL,
				CASE WHEN (x.bulan = 3 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS MarL,
				CASE WHEN (x.bulan = 4 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS AprL,
				CASE WHEN (x.bulan = 5 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS MeiL,
				CASE WHEN (x.bulan = 6 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS JunL,
				CASE WHEN (x.bulan = 7 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS JulL,
				CASE WHEN (x.bulan = 8 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS AguL,
				CASE WHEN (x.bulan = 9 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS SepL,
				CASE WHEN (x.bulan = 10 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS OktL,
				CASE WHEN (x.bulan = 11 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS NovL,
				CASE WHEN (x.bulan = 12 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS DesL,
				CASE WHEN (x.bulan = 1 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS JanW,
				CASE WHEN (x.bulan = 2 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS FebW,
				CASE WHEN (x.bulan = 3 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS MarW,
				CASE WHEN (x.bulan = 4 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS AprW,
				CASE WHEN (x.bulan = 5 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS MeiW,
				CASE WHEN (x.bulan = 6 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS JunW,
				CASE WHEN (x.bulan = 7 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS JulW,
				CASE WHEN (x.bulan = 8 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS AguW,
				CASE WHEN (x.bulan = 9 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS SepW,
				CASE WHEN (x.bulan = 10 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS OktW,
				CASE WHEN (x.bulan = 11 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS NovW,
				CASE WHEN (x.bulan = 12 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS DesW,
		COUNT(*) AS Jumlah
		FROM
(SELECT
			--CASE WHEN pd.statuspasien = 'LAMA' THEN 'Lama' ELSE 'Baru' END as KET,
			COUNT(pd.noregistrasi) as jumlahku,'Hidup' as KET,
			CASE WHEN jk.id = 1 THEN 1 ELSE 0 END AS laki,
			CASE WHEN jk.id = 2 THEN 1 ELSE 0 END AS wanita,
			MONTH(pd.tglpulang) AS bulan
		FROM pasiendaftar_t as pd
		INNER JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
		INNER JOIN pasien_m as ps on ps.id = pd.nocmfk
		LEFT JOIN jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk
		WHERE  pd.kdprofile = $idProfile and YEAR(pd.tglpulang) = '$tahun' AND ru.objectdepartemenfk = 16 AND pd.tglmeninggal IS NULL --pd.objectkondisipasienfk NOT IN (5,6)
GROUP BY jk.id, pd.tglregistrasi,pd.tglpulang) AS x
GROUP BY x.KET, x.bulan, x.laki, x.wanita) AS y
GROUP BY y.KET

UNION ALL

SELECT y.KET,
			SUM(JanL) AS JanL,
			SUM(JanW) AS JanW,
			SUM(FebL) AS FebL,
			SUM(FebW) AS FebW,
			SUM(MarL) AS MarL,
			SUM(MarW) AS MarW,
			SUM(AprL) AS AprL,
			SUM(AprW) AS AprW,
			SUM(MeiL) AS MeiL,
			SUM(MeiW) AS MeiW,
			SUM(JunL) AS JunL,
			SUM(JunW) AS JunW,
			SUM(JulL) AS JulL,
			SUM(JulW) AS JulW,
			SUM(AguL) AS AguL,
			SUM(AguW) AS AguW,
			SUM(SepL) AS SepL,
			SUM(SepW) AS SepW,
			SUM(OktL) AS OktL,
			SUM(OktW) AS OktW,
			SUM(NovL) AS NovL,
			SUM(NovW) AS NovW,
			SUM(DesL) AS DesL,
			SUM(DesW) AS DesW,
			SUM(y.Jumlah) AS Jumlah
  FROM
(SELECT DISTINCT x.KET,
				CASE WHEN (x.bulan = 1 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS JanL,
				CASE WHEN (x.bulan = 2 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS FebL,
				CASE WHEN (x.bulan = 3 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS MarL,
				CASE WHEN (x.bulan = 4 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS AprL,
				CASE WHEN (x.bulan = 5 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS MeiL,
				CASE WHEN (x.bulan = 6 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS JunL,
				CASE WHEN (x.bulan = 7 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS JulL,
				CASE WHEN (x.bulan = 8 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS AguL,
				CASE WHEN (x.bulan = 9 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS SepL,
				CASE WHEN (x.bulan = 10 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS OktL,
				CASE WHEN (x.bulan = 11 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS NovL,
				CASE WHEN (x.bulan = 12 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS DesL,
				CASE WHEN (x.bulan = 1 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS JanW,
				CASE WHEN (x.bulan = 2 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS FebW,
				CASE WHEN (x.bulan = 3 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS MarW,
				CASE WHEN (x.bulan = 4 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS AprW,
				CASE WHEN (x.bulan = 5 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS MeiW,
				CASE WHEN (x.bulan = 6 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS JunW,
				CASE WHEN (x.bulan = 7 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS JulW,
				CASE WHEN (x.bulan = 8 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS AguW,
				CASE WHEN (x.bulan = 9 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS SepW,
				CASE WHEN (x.bulan = 10 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS OktW,
				CASE WHEN (x.bulan = 11 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS NovW,
				CASE WHEN (x.bulan = 12 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS DesW,
		COUNT(*) AS Jumlah
		FROM
(SELECT
			--CASE WHEN pd.statuspasien = 'LAMA' THEN 'Lama' ELSE 'Baru' END as KET,
			COUNT(pd.noregistrasi) as jumlahku,'Meninggal < 24 jam' as KET,
			CASE WHEN jk.id = 1 THEN 1 ELSE 0 END AS laki,
			CASE WHEN jk.id = 2 THEN 1 ELSE 0 END AS wanita,
			MONTH(pd.tglregistrasi) AS bulan
		FROM pasiendaftar_t as pd
		LEFT JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
		LEFT JOIN pasien_m as ps on ps.id = pd.nocmfk
		LEFT JOIN jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk
		WHERE pd.kdprofile = $idProfile and YEAR(pd.tglregistrasi) = '$tahun' AND ru.objectdepartemenfk = 16 AND pd.objectkondisipasienfk = 5
GROUP BY jk.id, pd.tglregistrasi) AS x
GROUP BY x.KET, x.bulan, x.laki, x.wanita) AS y
GROUP BY y.KET

UNION ALL
SELECT y.KET,
			SUM(JanL) AS JanL,
			SUM(JanW) AS JanW,
			SUM(FebL) AS FebL,
			SUM(FebW) AS FebW,
			SUM(MarL) AS MarL,
			SUM(MarW) AS MarW,
			SUM(AprL) AS AprL,
			SUM(AprW) AS AprW,
			SUM(MeiL) AS MeiL,
			SUM(MeiW) AS MeiW,
			SUM(JunL) AS JunL,
			SUM(JunW) AS JunW,
			SUM(JulL) AS JulL,
			SUM(JulW) AS JulW,
			SUM(AguL) AS AguL,
			SUM(AguW) AS AguW,
			SUM(SepL) AS SepL,
			SUM(SepW) AS SepW,
			SUM(OktL) AS OktL,
			SUM(OktW) AS OktW,
			SUM(NovL) AS NovL,
			SUM(NovW) AS NovW,
			SUM(DesL) AS DesL,
			SUM(DesW) AS DesW,
			SUM(y.Jumlah) AS Jumlah
  FROM
(SELECT DISTINCT x.KET,
				CASE WHEN (x.bulan = 1 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS JanL,
				CASE WHEN (x.bulan = 2 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS FebL,
				CASE WHEN (x.bulan = 3 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS MarL,
				CASE WHEN (x.bulan = 4 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS AprL,
				CASE WHEN (x.bulan = 5 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS MeiL,
				CASE WHEN (x.bulan = 6 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS JunL,
				CASE WHEN (x.bulan = 7 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS JulL,
				CASE WHEN (x.bulan = 8 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS AguL,
				CASE WHEN (x.bulan = 9 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS SepL,
				CASE WHEN (x.bulan = 10 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS OktL,
				CASE WHEN (x.bulan = 11 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS NovL,
				CASE WHEN (x.bulan = 12 AND x.laki = 1) THEN SUM(x.laki) ELSE 0 END AS DesL,
				CASE WHEN (x.bulan = 1 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS JanW,
				CASE WHEN (x.bulan = 2 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS FebW,
				CASE WHEN (x.bulan = 3 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS MarW,
				CASE WHEN (x.bulan = 4 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS AprW,
				CASE WHEN (x.bulan = 5 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS MeiW,
				CASE WHEN (x.bulan = 6 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS JunW,
				CASE WHEN (x.bulan = 7 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS JulW,
				CASE WHEN (x.bulan = 8 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS AguW,
				CASE WHEN (x.bulan = 9 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS SepW,
				CASE WHEN (x.bulan = 10 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS OktW,
				CASE WHEN (x.bulan = 11 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS NovW,
				CASE WHEN (x.bulan = 12 AND x.wanita = 1) THEN SUM(x.wanita) ELSE 0 END AS DesW,
		COUNT(*) AS Jumlah
		FROM
(SELECT
			--CASE WHEN pd.statuspasien = 'LAMA' THEN 'Lama' ELSE 'Baru' END as KET,
			COUNT(pd.noregistrasi) as jumlahku,'Meninggal > 24 jam' as KET,
			CASE WHEN jk.id = 1 THEN 1 ELSE 0 END AS laki,
			CASE WHEN jk.id = 2 THEN 1 ELSE 0 END AS wanita,
			MONTH(pd.tglregistrasi) AS bulan
		FROM pasiendaftar_t as pd
		LEFT JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
		LEFT JOIN pasien_m as ps on ps.id = pd.nocmfk
		LEFT JOIN jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk
		WHERE pd.kdprofile = $idProfile and YEAR(pd.tglregistrasi) = '$tahun' AND ru.objectdepartemenfk = 16 AND pd.objectkondisipasienfk = 6
GROUP BY jk.id, pd.tglregistrasi) AS x
GROUP BY x.KET, x.bulan, x.laki, x.wanita) AS y
GROUP BY y.KET



         "));
        return $this->respond($data);
    }

    public function getLaporanSummaryUsia(Request $request)
    {
        $data = [];
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $ruanganId = $request['ruanganId'];
        $kelompokId = $request['kelompokPasien'];
        $paramRuangan = ' ';
        if (isset($ruanganId) && $ruanganId != "" && $ruanganId != "undefined") {
            $paramRuangan = ' and pd.objectruanganlastfk = ' . $ruanganId;
        }

        $paramKelompok = ' ';
        if (isset($kelompokId) && $kelompokId != "" && $kelompokId != "undefined") {
            $paramKelompok = ' and pd.objectkelompokpasienlastfk = ' . $kelompokId;
        }

        $deptRawatJalan = $this->settingDataFixed('kdDepartemenRawatJalanFix', $kdProfile);

        $data = DB::select(
            DB::raw(
                "SELECT
                z.usia, count(z.usia) as jml
            FROM
                (
                    SELECT
                    CASE
                    WHEN x.umur >= 1		AND x.umur <= 14 THEN 		'1 - 14 TAHUN'
                    WHEN x.umur >= 15		AND x.umur <= 24 THEN			'15 - 24 TAHUN'
                WHEN x.umur >= 25		AND x.umur <= 44 THEN			'25 - 44 TAHUN'
                    WHEN x.umur >= 45		AND x.umur <= 64 THEN			'45 - 64 TAHUN'
                    WHEN x.umur >= 65 	THEN '65 TAHUN KE ATAS'
                    END AS usia
                    FROM
                        (
                            SELECT
                                pg.namapasien,
                                pg.tgllahir,
                               DATE_PART('day', now() - pg.tgllahir::timestamp) AS umur
                            FROM antrianpasiendiperiksa_t as apd
            INNER JOIN pasiendaftar_t as pd ON pd.norec=apd.noregistrasifk
            INNER JOIN ruangan_m as ru On ru.id=apd.objectruanganfk
            INNER JOIN kelompokpasien_m as kp on kp.id=pd.objectkelompokpasienlastfk
            INNER JOIN pasien_m as pg on pg.id=pd.nocmfk
            where apd.kdprofile = $idProfile and apd.tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir' AND ru.objectdepartemenfk = 18
                        ) AS x
                )
            as z GROUP BY z.usia
            ORDER BY z.usia ASC "
            )
        );
        return $this->respond($data);
    }
    public function updateSEPIGD(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        DB::beginTransaction();

        try {
            PemakaianAsuransi::where('noregistrasifk', $request['norec'])
                ->where('kdprofile', (int)$kdProfile)
                ->update([
                    'nosep' => ''
                ]);
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus != 'false') {
            $transMessage = "Update SEP";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            $transMessage = "Update SEP Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getSignatureTrans($kdProfile)
    {
        $baseUrl = $this->settingDataFixed('urlTransdataHealthCare', $kdProfile);
        $client = new \GuzzleHttp\Client();
        $get = $client->get($baseUrl . 'get-signature?username=simrs&password=administrator');
        $respond = json_decode($get->getBody()->getContents());
        return $respond;
    }
    public function getDaftarRujukan(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $nik = '';
        $nobpjs = '';
        $namapasien = '';
        $norm = '';
        $norujukan = '';
        if (isset($request['nik'])) {
            $nik = $request['nik'];
        }
        if (isset($request['nobpjs'])) {
            $nobpjs = $request['nobpjs'];
        }
        if (isset($request['namapasien'])) {
            $namapasien = $request['namapasien'];
        }
        if (isset($request['norm'])) {
            $norm = $request['norm'];
        }
        if (isset($request['norujukan'])) {
            $norujukan = $request['norujukan'];
        }
        $getSign = $this->getSignatureTrans($kdProfile);
        $token = $getSign->{'X-AUTH-TOKEN'};

        $baseUrl = $this->settingDataFixed('urlTransdataHealthCare', $kdProfile);
        $curl = \curl_init();
        $url = $baseUrl . 'get-daftar-rujukan?nik=' . $nik . '&nobpjs=' . $nobpjs . '&namapasien=' . $namapasien
            . '&norm=' . $norm . '&norujukan=' . $norujukan;
        // return $url;
        curl_setopt_array($curl, array(
            //                CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL =>  $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            //            CURLOPT_POSTFIELDS => $dataJsonSend,
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json;",
                "X-AUTH-TOKEN: " .  (string)$token,

            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);


        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result =  json_decode($response);
        }

        return $this->respond($result);
    }
    public function getRuanganByKodeInternal($kode, Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $data = \DB::table('ruangan_m')
            ->where('statusenabled', true)
            ->where('kdinternal', '=', $kode)
            ->where('kdprofile', '=', $kdProfile)
            ->first();

        $result = array(
            'data' => $data,
            'as' => 'ramdan@epic',
        );
        return $this->respond($result);
    }

    public function updateRujukanTransdata(Request $request)
    {
        $data = $request['data'];
        $kdProfile = $this->getDataKdProfile($request);
        $baseUrl = $this->settingDataFixed('urlTransdataHealthCare', $kdProfile);
        $getSign = $this->getSignatureTrans($kdProfile);
        $token = $getSign->{'X-AUTH-TOKEN'};

        $curl = curl_init();
        $dataJsonSend = json_encode($data);
        //        return $this->respond(   $baseUrl.'save-medical-record');
        curl_setopt_array($curl, array(
            //                CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $baseUrl . 'update-status-rujukan',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 60,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => $dataJsonSend,
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json;",
                "X-AUTH-TOKEN: " .  (string)$token,

            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);
        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result =  json_decode($response);
        }


        return $this->respond($result);
    }
    public function saveAdministrasi(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        DB::beginTransaction();
        try {
            $antrian = AntrianPasienDiperiksa::where('norec', $request['norec_apd'])
                ->update([
                    'ispelayananpasien' => true
                ]);
            $pasiendaftar = PasienDaftar::where('norec', $request['norec'])->first();
            $data = DB::select(DB::raw("select pp.tglpelayanan,pd.objectkelasfk,
                    pd.objectruanganlastfk
                    from pasiendaftar_t as pd
                    INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                    INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                    INNER JOIN produk_m as pr on pr.id=pp.produkfk
                    INNER JOIN ruangan_m as ru_pd on ru_pd.id=pd.objectruanganlastfk
                    where  pd.norec='$request[norec]'
                    and pd.kdprofile=$kdProfile
                    and pp.status='admin otomatis'
                "));

            if (count($data) == 0) {
                // Cek apakah pasien sudah pernah registrasi di hari yang sama
                $tglRegistrasi = date('Y-m-d', strtotime($pasiendaftar->tglregistrasi));
                $cekSudahDaftarHariIni = DB::table('pasiendaftar_t as pd')
                    ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                    ->join('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
                    ->leftJoin('batalregistrasi_t as br', 'br.pasiendaftarfk', '=', 'pd.norec')
                    ->where('pd.nocmfk', $pasiendaftar->nocmfk)
                    ->where('pd.tglregistrasi', '>=', $tglRegistrasi . ' 00:00')
                    ->where('pd.tglregistrasi', '<=', $tglRegistrasi . ' 23:59')
                    ->where('pd.norec', '!=', $pasiendaftar->norec) // Exclude registrasi saat ini
                    ->where('pp.status', '=', 'admin otomatis')
                    ->whereNull('br.pasiendaftarfk')
                    ->where('pd.kdprofile', (int)$kdProfile)
                    ->where('pd.statusenabled', true)
                    ->exists();

                // Jika sudah pernah daftar hari ini DAN sudah ada admin otomatis, skip penambahan biaya admin
                if ($cekSudahDaftarHariIni) {
                    DB::commit();
                    $result = array(
                        "status" => 201,
                        "message" => "Administrasi Otomatis sudah ada di registrasi sebelumnya hari ini",
                        "as" => 'er@epic',
                    );
                    return $this->setStatusCode($result['status'])->respond($result, "Administrasi Otomatis - Skip (sudah ada hari ini)");
                }

                $status = "";
                if ($pasiendaftar->statuspasien != null) {
                    $status = $pasiendaftar->statuspasien;
                }
                $sirahMacan = DB::select(
                    DB::raw("select hett.* from mapruangantoadministrasi_t as map
                                INNER JOIN harganettoprodukbykelas_m as hett on hett.objectprodukfk=map.objectprodukfk
                                and hett.objectjenispelayananfk =map.jenispelayananfk
                                where map.objectruanganfk=:ruanganid and hett.objectkelasfk=:kelasid
                                and map.jenispelayananfk=:jenispelayanan
                                and map.kdprofile=:kdprofile
                                and map.statuspasien=:statuspasien
                                and map.objectkamarfk is null
                                and hett.statusenabled=true
                                and hett.objectpenjaminfk is null"),
                    array(
                        'ruanganid' => $pasiendaftar->objectruanganlastfk,
                        'kelasid' => $pasiendaftar->objectkelasfk,
                        'jenispelayanan' => $pasiendaftar->jenispelayanan,
                        'kdprofile' => $kdProfile,
                        'statuspasien' => $status,


                    )
                );

                $buntutMacan = DB::select(
                    DB::raw("select hett.* from mapruangantoadministrasi_t as map
                                        INNER JOIN harganettoprodukbykelasd_m as hett on hett.objectprodukfk=map.objectprodukfk
                                        and hett.objectjenispelayananfk =map.jenispelayananfk
                                        where map.objectruanganfk=:ruanganid and hett.objectkelasfk=:kelasid 
                                        and map.jenispelayananfk=:jenispelayanan
                                        and map.kdprofile=:kdprofile
                                        and map.statuspasien=:statuspasien
                                        and map.objectkamarfk is null
                                        and hett.statusenabled=true
                                        and hett.objectpenjaminfk is null"),
                    array(
                        'ruanganid' => $pasiendaftar->objectruanganlastfk,
                        'kelasid' => $pasiendaftar->objectkelasfk,
                        'jenispelayanan' => $pasiendaftar->jenispelayanan,
                        'kdprofile' => $kdProfile,
                        'statuspasien' => $status,
                    )
                );
                //                    return $this->respond($buntutMacan);
                foreach ($sirahMacan as $k) {
                    $PelPasien = new PelayananPasien();
                    $PelPasien->norec = $PelPasien->generateNewId();
                    $PelPasien->kdprofile = $kdProfile;
                    $PelPasien->statusenabled = true;
                    $PelPasien->noregistrasifk = $request['norec_apd']; //$dataDong[0]->norec_apd;
                    $PelPasien->tglregistrasi = $pasiendaftar->tglregistrasi;
                    $PelPasien->hargadiscount = 0; //0;
                    $PelPasien->hargajual = $k->hargasatuan;
                    $PelPasien->hargasatuan = $k->hargasatuan;
                    $PelPasien->jumlah = 1;
                    $PelPasien->kelasfk = $pasiendaftar->objectkelasfk;
                    $PelPasien->kdkelompoktransaksi = 1;
                    $PelPasien->piutangpenjamin = 0;
                    $PelPasien->piutangrumahsakit = 0;
                    $PelPasien->produkfk = $k->objectprodukfk;
                    $PelPasien->stock = 1;
                    $PelPasien->tglpelayanan = date('Y-m-d H:i:s');
                    $PelPasien->harganetto = $k->harganetto1;
                    $PelPasien->status = 'admin otomatis';
                    $PelPasien->save();
                    $PPnorec = $PelPasien->norec;
                    if (isset($PPnorec)) {
                        $ppp = new PelayananPasienPetugas();
                        $ppp->norec = $ppp->generateNewId();
                        $ppp->kdprofile = $kdProfile;
                        $ppp->statusenabled = true;
                        $ppp->nomasukfk = $request['norec_apd'];
                        $ppp->objectjenispetugaspefk = 4;
                        $ppp->pelayananpasien = $PPnorec;
                        $ppp->tglpelayanan = date('Y-m-d H:i:s');
                        $ppp->objectpegawaifk = $request['objectpegawaifk'];
                        $ppp->save();
                    }
                    foreach ($buntutMacan as $itemKomponen) {
                        if ($itemKomponen->objectprodukfk == $k->objectprodukfk) {
                            $PelPasienDetail = new PelayananPasienDetail();
                            $PelPasienDetail->norec = $PelPasienDetail->generateNewId();
                            $PelPasienDetail->kdprofile = $kdProfile;
                            $PelPasienDetail->statusenabled = true;
                            $PelPasienDetail->noregistrasifk = $request['norec_apd'];
                            $PelPasienDetail->aturanpakai = '-';
                            $PelPasienDetail->hargadiscount = 0;
                            $PelPasienDetail->hargajual = $itemKomponen->hargasatuan;
                            $PelPasienDetail->hargasatuan = $itemKomponen->hargasatuan;
                            $PelPasienDetail->jumlah = 1;
                            $PelPasienDetail->keteranganlain = 'admin otomatis';
                            $PelPasienDetail->keteranganpakai2 = '-';
                            $PelPasienDetail->komponenhargafk = $itemKomponen->objectkomponenhargafk;
                            $PelPasienDetail->pelayananpasien = $PPnorec;
                            $PelPasienDetail->piutangpenjamin = 0;
                            $PelPasienDetail->piutangrumahsakit = 0;
                            $PelPasienDetail->produkfk = $itemKomponen->objectprodukfk;
                            $PelPasienDetail->stock = 1;
                            $PelPasienDetail->tglpelayanan = date('Y-m-d H:i:s');
                            $PelPasienDetail->harganetto = $itemKomponen->harganetto1;
                            $PelPasienDetail->save();
                        }
                    }
                }
            }


            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Administrasi Otomatis";

        if ($transStatus == 'true') {
            $transMessage = $transMessage . "";
            DB::commit();
            $result = array(
                "status" => 201,
                //                "data" => $selisihjam,
                "as" => 'er@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 201,
                //                "data" => $data2,
                'e' => $e->getLine(),
                'm' => $e->getMessage(),
                "as" => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getLaporanLabTahunan(Request $request)
    {
        $tahun = $request['tahun'];
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $data = \DB::select(DB::raw("SELECT x.namaproduk, x.detailjenisproduk,
                                    CASE when x.bulan = '01' THEN SUM(x.jumlah) else 0 END AS jan,
                                    CASE when x.bulan = '02' THEN SUM(x.jumlah) else 0 END AS feb,
                                    CASE when x.bulan = '03' THEN SUM(x.jumlah) else 0 END AS mar,
                                    CASE when x.bulan = '04' THEN SUM(x.jumlah) else 0 END AS april,
                                    CASE when x.bulan = '05' THEN SUM(x.jumlah) else 0 END AS mei,
                                    CASE when x.bulan = '06' THEN SUM(x.jumlah) else 0 END AS jun,
                                    CASE when x.bulan = '07' THEN SUM(x.jumlah) else 0 END AS jul,
                                    CASE when x.bulan = '08' THEN SUM(x.jumlah) else 0 END AS aug,
                                    CASE when x.bulan = '09' THEN SUM(x.jumlah) else 0 END AS sep,
                                    CASE when x.bulan = '10' THEN SUM(x.jumlah) else 0 END AS okto,
                                    CASE when x.bulan = '11' THEN SUM(x.jumlah) else 0 END AS nov,
                                    CASE when x.bulan = '12' THEN SUM(x.jumlah) else 0 END AS des,
                                    sum(x.jumlah) as jum
                                     from(

                                    select to_char(pp.tglpelayanan, 'MM') as bulan, pp.jumlah,pr.namaproduk , djp.detailjenisproduk, ru.namaruangan
                                    from pelayananpasien_t as pp 
                                    INNER JOIN produk_m as pr ON pr.id = pp.produkfk
                                    INNER JOIN antrianpasiendiperiksa_t as apd ON apd.norec = pp.noregistrasifk
                                    INNER JOIN detailjenisproduk_m as djp ON djp.id=pr.objectdetailjenisprodukfk
                                    INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk

                                    WHERE apd.objectruanganfk IN (39,41,575) 
                                    AND to_char(pp.tglpelayanan, 'YYYY')='$tahun' 
                                    and pp.kdprofile = 30
                                    AND pp.strukresepfk is NULL) as x
                                    GROUP BY x.bulan, x.namaproduk,x.detailjenisproduk

         "));
        return $this->respond($data);
    }

    public function getDaftarExpRad(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $data = \DB::table('pasiendaftar_t AS pd')
            ->join('antrianpasiendiperiksa_t AS apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('pelayananpasien_t AS pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->LEFTJOIN('strukorder_t AS so', 'so.norec', '=', 'pp.strukorderfk')
            ->join('hasilradiologi_t AS hr', 'hr.pelayananpasienfk', '=', 'pp.norec')
            ->LEFTJOIN('produk_m AS pr', 'pr.id', '=', 'pp.produkfk')
            ->LEFTJOIN('pegawai_m AS pg', 'pg.id', '=', 'hr.pegawaifk')
            ->LEFTJOIN('ruangan_m AS ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->select(DB::raw("
                 pp.norec AS norec_pp,CASE WHEN so.tglorder IS NOT NULL THEN so.tglorder ELSE pp.tglpelayanan END AS tanggal,
                 CASE WHEN so.noorder IS NULL THEN '' ELSE so.noorder END AS noorder,
                 pp.produkfk,pr.namaproduk,hr.pegawaifk,pg.namalengkap,
                 apd.objectruanganfk,ru.namaruangan,so.keteranganlainnya
            "))
            ->where('pd.kdprofile', (int)$kdProfile);

        if (isset($request['noregistrasi']) && $request['noregistrasi'] != "" && $request['noregistrasi'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $request['noregistrasi']);
        }

        $data = $data->where('pd.statusenabled', true);
        $data = $data->get();

        $result = array(
            'daftar' => $data,
            'message' => 'ea@epic',
        );

        return $this->respond($result);
    }

    public function getDetailRegistrasiPasien(Request $request)
    {
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftJoin('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            ->leftJoin('kamar_m as km', 'km.id', '=', 'apd.objectkamarfk')
            ->leftJoin('kelas_m as kls', 'kls.id', '=', 'apd.objectkelasfk')
            ->leftJoin('pasien_m as pm', 'pm.id', '=', 'pd.nocmfk')
            ->leftJoin('tempattidur_m as tt', 'tt.id', '=', 'apd.nobed')
            ->leftJoin('statuspulang_m as sp', 'sp.id', '=', 'pd.objectstatuspulangfk')
            ->select(
                'apd.norec',
                'apd.tglregistrasi',
                'ru.id as ruid_asal',
                'ru.namaruangan',
                'kls.id as kelasid',
                'kls.namakelas',
                'km.namakamar',
                'tt.reportdisplay as nobed',
                'apd.statusantrian',
                'apd.statuskunjungan',
                'apd.tglregistrasi',
                'apd.tgldipanggildokter',
                'apd.tgldipanggilsuster',
                'pg.id as pgid',
                'pg.namalengkap as namadokter',
                'apd.objectasalrujukanfk',
                'pd.nostruklastfk',
                'pd.nosbmlastfk',
                'apd.tglmasuk',
                'apd.tglkeluar',
                'ru.objectdepartemenfk',
                'dept.namadepartemen',
                'pm.tglmeninggal',
                'sp.reportdisplay'
            );

        $filter = $request->all();
        if (isset($filter['noregistrasi']) && $filter['noregistrasi'] != "" && $filter['noregistrasi'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $filter['noregistrasi']);
        }

        $data = $data->groupBy(
            'apd.norec',
            'apd.tglregistrasi',
            'ru.id',
            'ru.namaruangan',
            'kls.id',
            'kls.namakelas',
            'km.namakamar',
            'tt.reportdisplay',
            'apd.statusantrian',
            'apd.statuskunjungan',
            'apd.tglregistrasi',
            'apd.tgldipanggildokter',
            'apd.tgldipanggilsuster',
            'pg.id',
            'pg.namalengkap',
            'apd.objectasalrujukanfk',
            'pd.nostruklastfk',
            'pd.nosbmlastfk',
            'pd.noregistrasi',
            'apd.tglmasuk',
            'apd.tglkeluar',
            'ru.objectdepartemenfk',
            'dept.namadepartemen',
            'pm.tglmeninggal',
            'sp.reportdisplay'
        );
        $data = $data->orderBy('apd.tglregistrasi', 'asc');
        $data = $data->get();
        $diagnosa = \DB::table('antrianpasiendiperiksa_t AS apd')
            ->join('detaildiagnosapasien_t AS ddp', 'ddp.noregistrasifk', '=', 'apd.norec')
            ->join('diagnosapasien_t AS dp', 'dp.norec', '=', 'ddp.objectdiagnosapasienfk')
            ->join('diagnosa_m as dg', 'ddp.objectdiagnosafk', '=', 'dg.id')
            ->select(DB::raw("apd.noregistrasifk,ddp.objectjenisdiagnosafk,dg.kddiagnosa AS diagnosa,
                                     CASE WHEN dp.iskasusbaru = true AND dp.iskasuslama = false THEN 'BARU'
                                     WHEN dp.iskasuslama = true AND dp.iskasusbaru = false THEN 'LAMA' ELSE '' END kasus"))
            ->where('apd.kdprofile', 21)
            ->where('apd.statusenabled', true)
            ->get();
        $norecaPd = '';
        foreach ($data as $ob) {
            $norecaPd = $norecaPd . ",'" . $ob->norec . "'";
            $ob->kddiagnosa = [];
        }
        $norecaPd = substr($norecaPd, 1, strlen($norecaPd) - 1);
        $diagnosa = [];
        if ($norecaPd != '') {
            $diagnosa = DB::select(DB::raw("
                           select dg.kddiagnosa,ddp.noregistrasifk as norec_apd
                           from detaildiagnosapasien_t as ddp
                           left join diagnosapasien_t as dp on dp.norec=ddp.objectdiagnosapasienfk
                           left join diagnosa_m as dg on ddp.objectdiagnosafk=dg.id
                           where ddp.noregistrasifk in ($norecaPd) "));
            $i = 0;
            foreach ($data as $h) {
                $data[$i]->kddiagnosa = [];
                foreach ($diagnosa as $d) {
                    if ($data[$i]->norec == $d->norec_apd) {
                        $data[$i]->kddiagnosa[] = $d->kddiagnosa;
                    }
                }
                $i++;
            }
        }

        return $this->respond($data);
    }

    public function getLaporanMutuRJ(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $dokter = $request['dokter'];
        $ruangan = $request['ruanganId'];
        $paramDokter = '';
        if (isset($dokter) && $dokter != "" && $dokter != "undefined") {
            $paramDokter = ' and pm2.id = ' . $dokter;
        }
        $paramRuangan = '';
        if (isset($ruangan) && $ruangan != "" && $ruangan != "undefined") {
            $paramRuangan = ' and at2.objectruanganfk =  ' . $ruangan;
        }
        $data = \DB::select(DB::raw(
            "select pt.noregistrasi ,at2.tgldipanggilsuster ,at2.tglregistrasi,age(at2.tgldipanggilsuster,at2.tglregistrasi) as selisih, at2.tglselesaiperiksa ,
            ps.nocm ,ps.namapasien , r.namaruangan , km.kelompokpasien , pm2.namalengkap, age(at2.tglselesaiperiksa,at2.tglregistrasi) as wkttunggudokter,
            st.tglresep ,age(st.tglresep,at2.tglselesaiperiksa) as wkttungguobat
            from antrianpasiendiperiksa_t at2 
            inner join pasiendaftar_t pt on pt.norec = at2.noregistrasifk 
            inner join pasien_m ps on ps.id = pt.nocmfk 
            inner join ruangan_m r on r.id = at2.objectruanganfk 
            inner join kelompokpasien_m km on km.id = pt.objectkelompokpasienlastfk 
            inner join departemen_m dm on dm.id = r.objectdepartemenfk 
            inner join pegawai_m pm2 on pm2.id = pt.objectdokterpemeriksafk 
            left join strukresep_t st on st.pasienfk = at2.norec 
            where at2.kdprofile = $kdProfile and at2.statusenabled = true and dm.id = 18 
            $paramDokter
            $paramRuangan
            and at2.tglregistrasi between '$tglAwal' and '$tglAkhir' 
            group by pt.noregistrasi ,at2.tgldipanggilsuster ,at2.tglregistrasi,selisih,
            ps.nocm ,ps.namapasien , r.namaruangan , km.kelompokpasien,pm2.namalengkap,at2.tglselesaiperiksa ,st.tglresep
            order by at2.tglregistrasi  "
        ));
        return $this->respond($data);
    }

    public function getLaporanMutuRad(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $data = \DB::select(DB::raw(
            "select pt.noregistrasi ,hr.tanggal, at2.tglmasuk , age(hr.tanggal,at2.tglmasuk) as selisih,
            ps.nocm ,ps.namapasien , r.namaruangan , km.kelompokpasien , pm.namaproduk ,count(*) as jumlah, pm2.namalengkap 
            from antrianpasiendiperiksa_t at2 
            inner join pasiendaftar_t pt on pt.norec = at2.noregistrasifk 
            inner join pasien_m ps on ps.id = pt.nocmfk 
            inner join pelayananpasien_t pp on pp.noregistrasifk = at2.norec
            inner join hasilradiologi_t hr on hr.pelayananpasienfk =pp.norec
            inner join ruangan_m r on r.id = at2.objectruanganfk 
            inner join kelompokpasien_m km on km.id = pt.objectkelompokpasienlastfk 
            inner join produk_m pm on pm.id = pp.produkfk
            inner join departemen_m dm on dm.id = r.objectdepartemenfk 
            inner join pegawai_m pm2 on pm2.id = pt.objectdokterpemeriksafk 
            where at2.kdprofile = $kdProfile and at2.statusenabled = true and dm.id = 27 and pm.objectdetailjenisprodukfk != 474 and pm.id != 33625
            and at2.tglmasuk between '$tglAwal' and '$tglAkhir'
            group by pt.noregistrasi , hr.tanggal ,at2.tglmasuk,selisih,
            ps.nocm ,ps.namapasien , r.namaruangan , km.kelompokpasien , pm.namaproduk ,pm2.namalengkap"
        ));
        return $this->respond($data);
    }
    public function cekNoBPJSpasienBaru(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        // $dataLogin = $request->all();
        $data = \DB::table('pasien_m as ps')
            ->select('ps.id', 'ps.nocm', 'ps.namapasien', 'ps.nobpjs')
            ->where('ps.nobpjs', '=', $request['nobpjs'])
            ->where('ps.statusenabled', '=', true)
            ->where('ps.id', '<>', $request['idnocm'])
            // ->where('ps.noidentitas','like', '%'.$request['noidentitas'].'%')
            ->where('ps.nobpjs', '=', $request['nobpjs'])
            ->take(1)
            ->where('ps.kdprofile', $kdProfile)
            ->get();

        $result = array(
            'data' => $data,
            'message' => 'snaps',
        );

        return $this->respond($result);
    }
    public function getDaftarPasienDK(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $data = \DB::table('pasien_m as ps')
            ->leftjoin('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->leftjoin('agama_m as ag', 'ag.id', '=', 'ps.objectagamafk')
            ->leftjoin('golongandarah_m as gd', 'gd.id', '=', 'ps.objectgolongandarahfk')
            ->leftjoin('pekerjaan_m as pk', 'pk.id', '=', 'ps.objectpekerjaanfk')
            ->leftjoin('pendidikan_m as pdd', 'pdd.id', '=', 'ps.objectpendidikanfk')
            ->leftjoin('statusperkawinan_m as spkw', 'spkw.id', '=', 'ps.objectstatusperkawinanfk')
            ->join('alamat_m as al', 'al.nocmfk', '=', 'ps.id')
            ->leftjoin('suku_m as sk', 'sk.id', '=', 'ps.objectsukufk')
            ->select(DB::raw("ps.id,ps.nocm,
    ps.noidentitas as nik,  ps.namapasien,  ps.tgllahir,    ps.nohp AS telepon, sk.suku as etnis,
    ps.bahasa,  jk.jeniskelamin,    ag.agama,   gd.golongandarah,   al.alamatlengkap,   al.alamatemail as email,
    ps.namaayah as wali,    'Orang Tua' as hubunganwali,    null as alamatwali,
    null as teleponwali,    null as faksesbpjs, null as alamatfaskes,   null as teleponfaskes,  pk.pekerjaan,
    pdd.pendidikan, spkw.statusperkawinan,ps.nobpjs"))
            ->where('ps.statusenabled', true)
            ->where('ps.namapasien', '!=', '-')
            ->where('ps.kdprofile', $kdProfile);
        $stt = false;
        if (isset($request['nik']) && $request['nik'] != "" && $request['nik'] != "undefined") {
            $data = $data->where('ps.noidentitas', '=', $request['nik']);
            $stt = true;
        }
        if (isset($request['nobpjs']) && $request['nobpjs'] != "" && $request['nobpjs'] != "undefined") {
            $data = $data->where('ps.nobpjs', '=', $request['nobpjs']);
            $stt = true;
        }
        if (isset($request['nocm']) && $request['nocm'] != "" && $request['nocm'] != "undefined") {
            $data = $data->where('ps.nocm', 'like', '%' . $request['nocm'] . '%');
            $stt = true;
        }
        if (isset($request['namapasien']) && $request['namapasien'] != "" && $request['namapasien'] != "undefined") {
            $data = $data->where('ps.namapasien', 'like', '%' . $request['namapasien'] . '%');
            $stt = true;
        }
        if (isset($request['nokk']) && $request['nokk'] != "" && $request['nokk'] != "undefined") {
            //            $data = $data->where('ps.nokk','=', $request['nokk']);
        }
        if (isset($request['limit']) && $request['limit'] != "" && $request['limit'] != "undefined") {
            $data = $data->limit($request['limit']);
        }
        if (isset($request['page']) && $request['page'] != "" && $request['page'] != "undefined") {
            $data = $data->offset($request['page']);
        }
        $data = $data->orderBy('ps.namapasien');
        $data = $data->get();
        if (count($data) > 0) {
            $result = array(
                "data" =>  $data,
                "message" => "Ok",
            );
        } else {
            $result = array(
                "data" =>  [],
                "message" => "Data tidak ditemukan"

            );
        }


        return $this->setStatusCode(200)->respond($result);
    }
    public function updateNoseppa(Request $request)
    {
        DB::beginTransaction();
        try {

            PemakaianAsuransi::where('nosep', $request['noSep'])->update(['nosep' => null]);
            $transStatus = 'true';
            $transMessage = "Simpan Nomor No SEP Berhasil...! ";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Gagal Simpan No SEP ...! ";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
            );
        }
        return $this->respond($result);
    }

    public function saveSkringAwalPasien(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $noregistrasi = $request['noregistrasi'];
        $norec = $request['norec'];
        // $pd = collect(DB::select("
        //     select * from pasiendaftar_t where noregistrasi = '$noregistrasi'
        // "))->first();
        $pd = PasienDaftar::where('noregistrasi', $noregistrasi)->select('nocmfk', 'norec', 'objectruanganlastfk')->first();
        DB::beginTransaction();
        try {
            if ($request['norec'] == '-') {
                $new = new SkriningAwalPasien();
                $norec = $new->generateNewId();
                $new->norec = $norec;
                $new->kdprofile = $kdProfile;
                $new->statusenabled = true;
                $new->nocmfk = $pd->nocmfk;
                $new->norec_pd = $pd->norec;
                $new->objectruanganfk = $pd->objectruanganlastfk;
            } else {
                $new = SkriningAwalPasien::where('norec', $norec)->first();
            }
            $new->kesadaran = $request['kesadaran'];
            $new->transportasi = $request['transportasi'];
            $new->teruskanke = $request['teruskan'];
            $new->ketkhusus = $request['alasan'];
            $new->screentb = $request['tb'];
            $new->keterangankhusus = $request['keterangan'];
            $new->pegawaifk = $request['petugas'];
            $new->save();
            $transMessage = "Simpan Screening Sukses! ";

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Gagal Simpan Screening!";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => "Berhasil Simpan Screening!",
                "data" => $new,
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                'e' => $e->getMessage(),
                'line' => $e->getLine(),
                "message" => "Gagal Simpan Screening!",
            );
        }
        // $result = array(
        //         "status" => 400,
        //         // 'e'=>$e->getMessage(),
        //         // 'line'=>$e->getLine(),
        //         "message" => "Gagal Simpan Screening!",
        //     );
        //     return $this->respond($result);
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDataSkringAwalPasien(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $noregistrasi = $request['noregistrasi'];
        $s = 'undefined';

        $data = \DB::select(DB::raw("
            SELECT sap.*,pd.noregistrasi,to_char(pm.tgllahir, 'DD/MM/YYYY') AS tgllahir,
                   to_char(pd.tglregistrasi, 'DD/MM/YYYY HH24:MI:SS') AS tglregistrasi,
                   jk.jeniskelamin,alm.alamatlengkap,ru.namaruangan,pg.namalengkap
            FROM pasiendaftar_t AS pd
            INNER JOIN skriningawalpasien_t AS sap ON sap.norec_pd = pd.norec
            INNER JOIN pasien_m AS pm ON pm.id = pd.nocmfk
            LEFT JOIN jeniskelamin_m AS jk ON jk.id = pm.objectjeniskelaminfk
            LEFT JOIN alamat_m AS alm ON alm.nocmfk = pm.id
            LEFT JOIN ruangan_m AS ru ON ru.id = sap.objectruanganfk
            LEFT JOIN pegawai_m AS pg ON pg.id = sap.pegawaifk
            WHERE pd.noregistrasi = '$noregistrasi' and sap.statusenabled= true and sap.kdprofile= $kdProfile
        "));

        if (count($data) > 0) {
            $result = array(
                "data" =>  $data,
                "message" => "Ok",
            );
        } else {
            $result = array(
                "data" =>  $s,
                "message" => "Data tidak ditemukan"
            );
        }
        // $result = array(
        //     'data'=> $data,
        //     'as'=> 'Fizi'
        // );
        return $this->respond($result);
    }

    public function deleteSkringAwalPasien(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $norec = $request['norec'];
        DB::beginTransaction();
        try {

            $new = SkriningAwalPasien::where('norec', $request['norec'])
                ->update([
                    "statusenabled" => false,
                ]);
            $transMessage = "Hapus Screening!";

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Gagal Hapus Screening!";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => "Berhasil Hapus Screening!",
                "data" => $new,
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => "Gagal Hapus Screening!",
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDaftarRiwayatRegistrasi1(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);

        // $data = \DB::table('pasien_m as ps')
        //     ->join('pasiendaftar_t as pd','pd.nocmfk','=','ps.id')
        //     ->join('ruangan_m as ru','ru.id','=','pd.objectruanganlastfk')
        //     ->join('kelompokpasien_m as kp','kp.id','=','pd.objectkelompokpasienlastfk')
        //     ->leftjoin('pegawai_m as pg','pg.id','=','pd.objectpegawaifk')
        //     // ->leftJoin('batalregistrasi_t as br','br.pasiendaftarfk','=','pd.norec')
        //     // ->leftjoin('antrianpasiendiperiksa_t as apd','apd.noregistrasifk','=','pd.norec')
        //     ->select(DB::raw("pd.norec,pd.tglregistrasi,ps.nocm,pd.noregistrasi,ps.namapasien,pd.objectruanganlastfk,kp.kelompokpasien,ru.namaruangan,
        //                       pd.objectpegawaifk,pg.namalengkap as namadokter,pd.tglpulang,ru.objectdepartemenfk,
        // 	                  CASE when ru.objectdepartemenfk in (16,25,26) then 1 else 0 end as statusinap"))
        //     ->where('pd.statusenabled',true)
        //     ->where('ps.kdprofile', (int)$kdProfile);

        // if(isset($request['tglhariini']) && $request['tglhariini']!="" && $request['tglhariini']!="undefined") {
        //     $data = $data->where('pd.tglregistrasi', '=', '%'. $request['tglhariini'] .'%');
        // };

        // if(isset($request['norm']) && $request['norm']!="" && $request['norm']!="undefined") {
        //     $data = $data->where('cast(ps.nocm as date)', '=', '%'. $request['norm'] .'%');
        // };




        // $data = $data->where('ps.statusenabled',true);
        // $data = $data->orderBy('pd.tglregistrasi');
        // $data=$data->get();


        $tglhariini = $request['tglhariini'];
        $norm = $request['norm'];
        $data = \DB::select("SELECT
            pd.norec,
            pd.tglregistrasi,
            ps.nocm,
            pd.noregistrasi,
            ps.namapasien,
            pd.objectruanganlastfk,
            kp.kelompokpasien,
            ru.namaruangan,
            pd.objectpegawaifk,
            pg.namalengkap AS namadokter,
            pd.tglpulang,
            ru.objectdepartemenfk,
        CASE
                
                WHEN ru.objectdepartemenfk IN ( 16, 25, 26 ) THEN
                1 ELSE 0 
            END AS statusinap 
        FROM
            pasien_m AS ps
            INNER JOIN pasiendaftar_t AS pd ON pd.nocmfk = ps.
            ID INNER JOIN ruangan_m AS ru ON ru.ID = pd.objectruanganlastfk
            INNER JOIN kelompokpasien_m AS kp ON kp.ID = pd.objectkelompokpasienlastfk
            LEFT JOIN pegawai_m AS pg ON pg.ID = pd.objectpegawaifk 
        WHERE
            pd.statusenabled = TRUE 
            AND ps.kdprofile = $kdProfile
            AND DATE(pd.tglregistrasi) = '%$tglhariini%' 
            AND ps.nocm = '$norm'");

        $result = array(
            'daftar' => $data, //array_merge($data,$data2),
            // 'data2' =>$data2,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }
    public function saveAntrolV2($noreservasi)
    {
        try {
            $json = array(
                "kodebooking" => $noreservasi,
                "taskid" => 3, //pasien lama langsung task 3 //(akhir waktu layan admisi/mulai waktu tunggu poli)
                "waktu" => strtotime(date('Y-m-d H:i:s')) * 1000,
            );
            $objetoRequest = new \Illuminate\Http\Request();
            $objetoRequest['url'] = "antrean/updatewaktu";
            $objetoRequest['jenis'] = "antrean";
            $objetoRequest['method'] = "POST";
            $objetoRequest['data'] = $json;

            $post = app('App\Http\Controllers\Bridging\BridgingBPJSV2Controller')->bpjsTools($objetoRequest);

            if (is_array($post)) {
                $code = $post['metaData']->code;
                $message = $post['metaData']->message;
            } else {
                $cek = json_decode($post->content(), true);
                $code = $cek['metaData']['code'];
                $message = isset($cek['metaData']['message']) ? $cek['metaData']['message'] : "";
            }
            if ($code != '200') {
                $json2 = array(
                    "kodebooking" => $noreservasi,
                    "taskid" => 1,
                    "waktu" => strtotime(date('Y-m-d H:i:s')) * 1000,
                );
                $objetoRequest2 = new \Illuminate\Http\Request();
                $objetoRequest2['url'] = "antrean/updatewaktu";
                $objetoRequest2['jenis'] = "antrean";
                $objetoRequest2['method'] = "POST";
                $objetoRequest2['data'] = $json2;

                $post2 = app('App\Http\Controllers\Bridging\BridgingBPJSV2Controller')->bpjsTools($objetoRequest2);

                $json3 = array(
                    "kodebooking" => $noreservasi,
                    "taskid" => 2,
                    "waktu" => (strtotime(date('Y-m-d H:i:s')) * 1000) - 240000,
                );
                $objetoRequest3 = new \Illuminate\Http\Request();
                $objetoRequest3['url'] = "antrean/updatewaktu";
                $objetoRequest3['jenis'] = "antrean";
                $objetoRequest3['method'] = "POST";
                $objetoRequest3['data'] = $json3;

                $post3 = app('App\Http\Controllers\Bridging\BridgingBPJSV2Controller')->bpjsTools($objetoRequest3);

                $json4 = array(
                    "kodebooking" => $noreservasi,
                    "taskid" => 3,
                    "waktu" => (strtotime(date('Y-m-d H:i:s')) * 1000) - 120000,
                );
                $objetoRequest4 = new \Illuminate\Http\Request();
                $objetoRequest4['url'] = "antrean/updatewaktu";
                $objetoRequest4['jenis'] = "antrean";
                $objetoRequest4['method'] = "POST";
                $objetoRequest4['data'] = $json4;

                $post5 = app('App\Http\Controllers\Bridging\BridgingBPJSV2Controller')->bpjsTools($objetoRequest4);
                if (is_array($post5)) {
                    $code = $post5['metaData']->code;
                    $message = $post5['metaData']->message;
                } else {
                    $cek = json_decode($post5->content(), true);
                    $code = $cek['metaData']['code'];
                    $message = isset($cek['metaData']['message']) ? $cek['metaData']['message'] : "";
                }
                if ($code != '200') {
                    $result = array("metadata" => array("message" => "Add antrol gagal : " . $message, "code" => 201));
                    return $result;
                } else {
                    $result = array("metadata" => array("message" => $message, "code" => 200));
                    return $result;
                }
                $result = array("metadata" => array("message" => "Add antrol gagal : " . $message, "code" => 201));
                return $result;
            } else {
                $result = array("metadata" => array("message" => $message, "code" => 200));
                return $result;
            }
        } catch (\Exception $e) {
            $result = array("metadata" => array("message" => $e->getMessage() . ' ' . $e->getLine(), "code" => 201));
            return $result;
        }
    }
    public function getSEPByNoreg(Request $request)
    {

        $dataz = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->join('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
            ->join('asuransipasien_m as asu', 'pa.objectasuransipasienfk', '=', 'asu.id')
            ->select(
                'ps.nocm',
                'pd.noregistrasi',
                'ru.namaruangan',
                'pa.nosep',
                'pa.ppkrujukan',
                'ps.nobpjs',
                'ps.nohp',
                'pa.statuskunjungan',
                'pa.flagprocedure',
                'pa.poliasalkode',
                'pa.tglcreate',
                'asu.nmprovider'
            )
            ->where('pd.noregistrasi', $request['noreg'])
            ->first();
        $data['namaPPKRujukan'] = $this->settingDataFixed('namaPPKRujukan', 0);
        $data['data']  = $dataz;
        return $this->respond($data);
    }

    public function getLaporanJumlahPasienDanCaraBayarv2(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $tahun = $request['tahun'];
        $ranap = $request['ranap'];
        $rajal = $request['rajal'];

        $departemen = $request->departemen;
        $ruangan = $request->ruangan;

        $tempTahun = '';
        if ($tahun != '') {
            $tempTahun = "AND date_part('year', pd.tglpulang:: DATE) = '$tahun'";
        }

        $tempTanggal = "";

        if (isset($tglAwal) && isset($tglAkhir)) {
            $tempTanggal = "AND pd.tglpulang:: DATE BETWEEN '$tglAwal' AND '$tglAkhir'";
        }

        switch ($ranap) {
            case 1:
                $paramRanap = 'AND ru.ID NOT IN ( 799, 800 ) /*jiwa*/ AND de.ID = 16';
                break;
            case 2:
                $paramRanap = 'and ru.id = 799 /*napza 799*/ and de.id=16';
                break;
            case 3:
                $paramRanap = 'and ru.id = 800 /*umum*/ and de.id=16';
                break;

            default:
                $paramRanap = ' ';
                break;
        }
        $paramDep = '';
        if (isset($departemen) && $departemen != "") {
            $paramDep = ' and ru.objectdepartemenfk =' . $departemen;
        }
        $paramRuangan = '';
        if (isset($ruangan) && $ruangan != "") {
            $paramRuangan = ' and ru.id =' . $ruangan;
        }
        $data = DB::select(DB::raw("
            WITH jumlahpasien AS (
        SELECT DISTINCT
            date_part( 'year', pd.tglpulang :: DATE ) tahun,
            ps.nocm,
            ps.namapasien,
            de.namadepartemen 
        FROM
            pasiendaftar_t pd
            INNER JOIN pasien_m ps ON ps.ID = pd.nocmfk
            INNER JOIN ruangan_m ru ON ru.ID = pd.objectruanganlastfk
            INNER JOIN departemen_m de ON de.ID = ru.objectdepartemenfk 
        WHERE
            pd.kdprofile = $kdProfile
            and pd.statusenabled = true
            and pd.tglpulang is not null
            $paramRanap
            $paramRuangan
            $paramDep
            $tempTanggal
            $tempTahun
        ORDER BY
            nocm ASC 
        ) SELECT
            jp.tahun,
            COUNT ( jp.nocm ) 
        FROM
            jumlahpasien jp 
        GROUP BY
            jp.tahun 
        ORDER BY
            jp.tahun ASC
        
        
        
        "));

        $result = array(
            'data' => $data,
            'message' => 'fazrian@epic'
        );
        return $this->respond($result);
    }
    public function saveAdministrasiMutasi(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        DB::beginTransaction();
        try {
            $antrian = AntrianPasienDiperiksa::where('norec', $request['norec_apd'])
                ->update([
                    'ispelayananpasien' => true
                ]);
            $pasiendaftar = PasienDaftar::where('norec', $request['norec'])->first();
            $data = DB::select(DB::raw("select pp.tglpelayanan,pd.objectkelasfk,
                    pd.objectruanganlastfk
                    from pasiendaftar_t as pd
                    INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                    INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                    INNER JOIN produk_m as pr on pr.id=pp.produkfk
                    INNER JOIN ruangan_m as ru_pd on ru_pd.id=pd.objectruanganlastfk
                    where apd.norec='$request[norec_apd]' and pd.norec='$request[norec]'
                    and pd.kdprofile=$kdProfile
                    and pp.status='admin otomatis'
                "));

            if (count($data) == 0) {
                $status = "";
                if ($pasiendaftar->statuspasien != null) {
                    $status = $pasiendaftar->statuspasien;
                }
                $sirahMacan = DB::select(
                    DB::raw("select hett.* from mapruangantoadministrasi_t as map
                                INNER JOIN harganettoprodukbykelas_m as hett on hett.objectprodukfk=map.objectprodukfk
                                and hett.objectjenispelayananfk =map.jenispelayananfk
                                where map.objectruanganfk=:ruanganid and hett.objectkelasfk=:kelasid
                                and map.jenispelayananfk=:jenispelayanan
                                and map.kdprofile=:kdprofile
                                and map.statuspasien=:statuspasien
                                and map.objectkamarfk is null
                                and hett.statusenabled=true
                                and hett.objectpenjaminfk is null"),
                    array(
                        'ruanganid' => $pasiendaftar->objectruanganlastfk,
                        'kelasid' => $pasiendaftar->objectkelasfk,
                        'jenispelayanan' => $pasiendaftar->jenispelayanan,
                        'kdprofile' => $kdProfile,
                        'statuspasien' => $status,


                    )
                );

                $buntutMacan = DB::select(
                    DB::raw("select hett.* from mapruangantoadministrasi_t as map
                                        INNER JOIN harganettoprodukbykelasd_m as hett on hett.objectprodukfk=map.objectprodukfk
                                        and hett.objectjenispelayananfk =map.jenispelayananfk
                                        where map.objectruanganfk=:ruanganid and hett.objectkelasfk=:kelasid 
                                        and map.jenispelayananfk=:jenispelayanan
                                        and map.kdprofile=:kdprofile
                                        and map.statuspasien=:statuspasien
                                        and map.objectkamarfk is null
                                        and hett.statusenabled=true
                                        and hett.objectpenjaminfk is null"),
                    array(
                        'ruanganid' => $pasiendaftar->objectruanganlastfk,
                        'kelasid' => $pasiendaftar->objectkelasfk,
                        'jenispelayanan' => $pasiendaftar->jenispelayanan,
                        'kdprofile' => $kdProfile,
                        'statuspasien' => $status,
                    )
                );
                //          return $this->respond($buntutMacan);
                foreach ($sirahMacan as $k) {
                    $PelPasien = new PelayananPasien();
                    $PelPasien->norec = $PelPasien->generateNewId();
                    $PelPasien->kdprofile = $kdProfile;
                    $PelPasien->statusenabled = true;
                    $PelPasien->noregistrasifk = $request['norec_apd']; //$dataDong[0]->norec_apd;
                    $PelPasien->tglregistrasi = $pasiendaftar->tglregistrasi;
                    $PelPasien->hargadiscount = 0; //0;
                    $PelPasien->hargajual = $k->hargasatuan;
                    $PelPasien->hargasatuan = $k->hargasatuan;
                    $PelPasien->jumlah = 1;
                    $PelPasien->kelasfk = $pasiendaftar->objectkelasfk;
                    $PelPasien->kdkelompoktransaksi = 1;
                    $PelPasien->piutangpenjamin = 0;
                    $PelPasien->piutangrumahsakit = 0;
                    $PelPasien->produkfk = $k->objectprodukfk;
                    $PelPasien->stock = 1;
                    $PelPasien->tglpelayanan = date('Y-m-d H:i:s');
                    $PelPasien->harganetto = $k->harganetto1;
                    $PelPasien->status = 'admin otomatis';
                    $PelPasien->save();
                    $PPnorec = $PelPasien->norec;
                    foreach ($buntutMacan as $itemKomponen) {
                        if ($itemKomponen->objectprodukfk == $k->objectprodukfk) {
                            $PelPasienDetail = new PelayananPasienDetail();
                            $PelPasienDetail->norec = $PelPasienDetail->generateNewId();
                            $PelPasienDetail->kdprofile = $kdProfile;
                            $PelPasienDetail->statusenabled = true;
                            $PelPasienDetail->noregistrasifk = $request['norec_apd'];
                            $PelPasienDetail->aturanpakai = '-';
                            $PelPasienDetail->hargadiscount = 0;
                            $PelPasienDetail->hargajual = $itemKomponen->hargasatuan;
                            $PelPasienDetail->hargasatuan = $itemKomponen->hargasatuan;
                            $PelPasienDetail->jumlah = 1;
                            $PelPasienDetail->keteranganlain = 'admin otomatis';
                            $PelPasienDetail->keteranganpakai2 = '-';
                            $PelPasienDetail->komponenhargafk = $itemKomponen->objectkomponenhargafk;
                            $PelPasienDetail->pelayananpasien = $PPnorec;
                            $PelPasienDetail->piutangpenjamin = 0;
                            $PelPasienDetail->piutangrumahsakit = 0;
                            $PelPasienDetail->produkfk = $itemKomponen->objectprodukfk;
                            $PelPasienDetail->stock = 1;
                            $PelPasienDetail->tglpelayanan = date('Y-m-d H:i:s');
                            $PelPasienDetail->harganetto = $itemKomponen->harganetto1;
                            $PelPasienDetail->save();
                        }
                    }
                }
            }


            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Administrasi Otomatis";

        if ($transStatus == 'true') {
            $transMessage = $transMessage . "";
            DB::commit();
            $result = array(
                "status" => 201,
                //                "data" => $selisihjam,
                "as" => 'er@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 201,
                //                "data" => $data2,
                "as" => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getPenjagaanMutasiPasien(Request $request)
    {

        $nocm = $request['nocm'];

        $dataz = DB::select(DB::raw("select ru.namaruangan, ps.nocm, pd.* from pasien_m ps
        inner join pasiendaftar_t pd on pd.nocmfk = ps.id
        inner join ruangan_m ru on ru.id = pd.objectruanganlastfk
        inner join departemen_m dp on dp.id = ru.objectdepartemenfk
        where ps.nocm = '$nocm'
        and pd.tglpulang is NULL
        and dp.id = 16"));


        $data['detail']  = $dataz;
        return $this->respond($data);
    }
    public function savePjPasin(request $request)
    {
        try {
            $ps = Pasien::where('id', $request['id'])->first();
            $ps->pj1 = $request['pj1'];
            $ps->pj2 = $request['pj2'];
            $ps->pj3 = $request['pj3'];
            $ps->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Simpan Penanggung Jawab Pasien";

        if ($transStatus == 'true') {
            $transMessage = $transMessage . "";
            DB::commit();
            $result = array(
                "status" => 201,
                //                "data" => $selisihjam,
                "as" => 'er@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 201,
                //                "data" => $data2,
                "as" => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function savePersetujuanUmum(Request $request)
    {
        try {
            $ps = Pasien::where('id', $request['id'])->first();
            $ps->kerahasiaan1 = $request['kerahasiaan1'];
            $ps->kerahasiaan2 = $request['kerahasiaan2'];
            $ps->kerahasiaan3 = $request['kerahasiaan3'];
            $ps->kerahasiaan4 = $request['kerahasiaan4'];
            $ps->privasi1 = $request['privasi1'];
            $ps->privasi2 = $request['privasi2'];
            $ps->privasi3 = $request['privasi3'];
            $ps->privasi4 = $request['privasi4'];
            $ps->ismengizinkan = $request['ismengizinkan'];
            $ps->saksipersetujuan = $request['saksipersetujuan'];
            $ps->pjpersetujuan = $request['pjpersetujuan'];
            $ps->save();

            $pd = PasienDaftar::where('norec', $request['norec_pd'])->first();
            $pd->objectpetugasinformasifk = $request['petugasinformasi'];
            $pd->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Simpan Persetujuan Umum";

        if ($transStatus == 'true') {
            $transMessage = $transMessage . "";
            DB::commit();
            $result = array(
                "status" => 201,
                //                "data" => $selisihjam,
                "as" => 'er@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 201,
                "e" => $e->getLine() . $e->getMessage(),
                "as" => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getPersetujuanUmum(Request $request)
    {
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpetugasinformasifk')
            ->where('pd.norec', $request['norec_pd'])->select('ps.pjpersetujuan', 'ps.saksipersetujuan', 'ps.kerahasiaan1', 'ps.kerahasiaan2', 'ps.kerahasiaan3', 'ps.kerahasiaan4', 'ps.privasi1', 'ps.privasi2', 'ps.privasi3', 'ps.privasi4', 'ps.ismengizinkan', 'pg.namalengkap', 'pg.id')
            ->get();
        $result = array(
            'data' => $data,
            'as' => 'Feezy'
        );
        return $this->respond($result);
    }
    public function getDataAntrean(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int)$kdProfile;
        $norec_pd = $request['norec_pd'];

        $data = collect(DB::select("
            select 
            case when pd.statusschedule <> '' and pd.statusschedule <> 'Kios-K' and pd.objectkelompokpasienlastfk = 2 THEN pd.statusschedule ELSE pd.noregistrasi END as kodebooking
            ,case when pd.objectkelompokpasienlastfk = 2 then 'JKN' else 'NON JKN' end as jenispasien
            ,case when pd.objectkelompokpasienlastfk = 2 then ps.nobpjs else '' end as nomorkartu
            ,ps.noidentitas as nik
            ,case when ps.notelepon is null then '-' else ps.notelepon end as nohp
            ,rm.kdinternal as kodepoli
            ,rm.namaruangan as namapoli
            ,case when pd.statuspasien = 'BARU' then 1 else 0 end as pasienbaru
            ,ps.nocm as norm
            ,to_char(pd.tglregistrasi, 'yyyy-MM-dd') as tanggalperiksa
            ,pg.kddokterbpjs as kodedokter
            ,pg.namalengkap as namadokter
            ,'08:00-16:00' as jampraktek
            ,1 as jeniskunjungan
            ,case when pd.objectkelompokpasienlastfk = 2 then substring(ps.nobpjs || ps.nocm, 1, 19) else '' end as nomorreferensi
            ,rm.prefixnoantrian as nomorantrean
            ,apd.noantrian as angkaantrean
            from pasiendaftar_t pd
            inner join antrianpasiendiperiksa_t apd on apd.noregistrasifk = pd.norec
            inner join pasien_m ps on ps.id = pd.nocmfk
            inner join ruangan_m rm on rm.id = pd.objectruanganlastfk
            left join pegawai_m pg on pg.id = pd.objectpegawaifk
            where pd.norec = '$norec_pd'
        "))->first();


        $result = array(
            'kodebooking' => $data->kodebooking,
            'jenispasien' => $data->jenispasien,
            'nomorkartu' => $data->nomorkartu,
            'nik' => $data->nik,
            'nohp' => $data->nohp,
            'kodepoli' => $data->kodepoli,
            'namapoli' => $data->namapoli,
            'pasienbaru' => $data->pasienbaru,
            'norm' => $data->norm,
            'tanggalperiksa' => $data->tanggalperiksa,
            'kodedokter' => $data->kodedokter,
            'namadokter' => $data->namadokter,
            'jampraktek' => $data->jampraktek,
            'jeniskunjungan' => $data->jeniskunjungan,
            'nomorreferensi' => $data->nomorreferensi,
            'nomorantrean' => $data->nomorantrean . "-" . str_pad((int)$data->angkaantrean, 4, "0", STR_PAD_LEFT),
            'angkaantrean' => $data->angkaantrean,
            'estimasidilayani' => strtotime(date('Y-m-d H:i:s')) * 1000,
            'sisakuotajkn' => 0,
            'kuotajkn' => 0,
            'sisakuotanonjkn' => 0,
            'kuotanonjkn' => 0,
            'keterangan' => ""
        );
        return $this->respond($result);
    }
    public function RMEAnalis(Request $request)
    {
        $wer = '';
        if (isset($request['nocm'])) {
            $wer = 'and ep.nocm=' . $request['nocm'];
        }
        if (isset($request['noreg'])) {
            $wer = "and ep.noregistrasifk='$request[noreg]'";
        }
        $data = DB::select(DB::raw("
        SELECT DISTINCT ep.norec as norec_emr, ep.tglregistrasi, em.caption, em.namaemr, ep.noemr, epd.emrfk, epd.isanalis, epd.islengkap, epd.keterangan, epd.verifikator, em.urlform  FROM emrpasiend_t epd 
        inner join emrpasien_t ep on ep.noemr = epd.emrpasienfk
        inner join emr_t em on em.id = epd.emrfk
        where ep.kdprofile= 30 and ep.statusenabled = true
        $wer
        ORDER BY ep.tglregistrasi desc
        "));
        foreach ($data as $otem) {
            if ($otem->isanalis == true) {
                $otem->isanalis = '✔';
            }
            if ($otem->islengkap == true) {
                $otem->islengkap = '✔';
            }
        }
        $result = array(
            'data' => $data
        );
        return $this->respond($result);
    }
    public function saveMenuAnalis(Request $request)
    {


        try {
            $data = DB::table('emrpasien_t as ep')
                ->join('emrpasiend_t as epd', 'ep.noemr', '=', 'epd.emrpasienfk')
                ->where('ep.noemr', $request['noemr'])
                ->where('epd.emrfk', $request['emrfk'])
                ->where('ep.norec', $request['norec_em'])
                ->select('epd.norec')
                ->get();
            foreach ($data as $item) {
                if ($request['method'] == 'isanalis') {
                    DB::table('emrpasiend_t as epd')->where('epd.norec', $item->norec)->update([
                        'isanalis' => true
                    ]);
                } else if ($request['method'] == 'islengkap') {
                    DB::table('emrpasiend_t as epd')->where('epd.norec', $item->norec)->update([
                        'islengkap' => true
                    ]);
                }
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Simpan";

        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                //                "data" => $selisihjam,
                "as" => 'er@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 201,
                "e" => $e->getLine() . $e->getMessage(),
                "as" => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveKedua(Request $request)
    {
        try {
            $data = DB::table('emrpasien_t as ep')
                ->join('emrpasiend_t as epd', 'ep.noemr', '=', 'epd.emrpasienfk')
                ->where('ep.noemr', $request['noemr'])
                ->where('epd.emrfk', $request['emrfk'])
                ->where('ep.norec', $request['norec_em'])
                ->select('epd.norec')
                ->get();
            foreach ($data as $item) {
                if (isset($request['verifikator'])) {
                    DB::table('emrpasiend_t as epd')->where('epd.norec', $item->norec)->update([
                        'verifikator' => $request['verifikator']
                    ]);
                } else if (isset($request['keterangan'])) {
                    DB::table('emrpasiend_t as epd')->where('epd.norec', $item->norec)->update([
                        'keterangan' => $request['keterangan']
                    ]);
                }
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Simpan";

        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                //                "data" => $selisihjam,
                "as" => 'er@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 201,
                "e" => $e->getLine() . $e->getMessage(),
                "as" => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function riwayatEMRTemp(Request $request)
    {
        $data = DB::select(DB::raw("
        SELECT epd.emrpasienfk, ed.caption, epd.emrdfk, epd.value from emrpasiend_t epd 
        inner join emrd_t ed on ed.id = epd.emrdfk
        where epd.emrfk = $request[emrfk] and epd.emrpasienfk = '$request[noemr]'
        "));

        foreach ($data as $item) {
            $details = DB::select(
                DB::raw("
            SELECT epd.value, pg.namalengkap, epd.tgl	from emrpasiend_temp_t epd 
            inner join pegawai_m pg on pg.id = epd.pegawaifk
            where epd.emrfk =:emrfk and epd.emrpasienfk =:emrpasienfk and epd.emrdfk =:emrdfk

            ORDER BY epd.tgl asc
            "),
                array(
                    "emrfk" => $request['emrfk'],
                    "emrpasienfk" => $request['noemr'],
                    "emrdfk" => $item->emrdfk,
                )
            );
            $item->details = $details;
        }
        $result = array(
            "data" => $data
        );
        return $this->respond($result);
    }
    public function saveSUDAH(Request $request)
    {
        try {

            $pd = PasienDaftar::where('norec', $request['norec'])->first();
            $ps = Pasien::where('id', $pd->nocmfk)->first();
            if ($request['method'] == 'analis') {
                $pd->isanalis = true;
            } else if ($request['method'] == 'verif') {
                $pd->isverifikasidpjp = true;
            } else if ($request['method'] == 'lengkap') {
                $pd->isrmlengkap = true;
            } else if ($request['method'] == 'inaktif') {
                $ps->isinaktif = true;
            }
            $ps->save();
            $pd->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Simpan";

        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                //                "data" => $selisihjam,
                "as" => 'er@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 201,
                "e" => $e->getLine() . $e->getMessage(),
                "as" => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveSUDAHH(Request $request)
    {
        try {

            // $pd = PasienDaftar::where('norec', $request['norec'])->first();
            $ps = Pasien::where('nocm', $request['nocm'])->first();
            if ($request['method'] == 'inaktif') {
                $ps->isinaktif = true;
            } else {
                $ps->isinaktif = null;
            }
            $ps->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Simpan";

        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                //                "data" => $selisihjam,
                "as" => 'er@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 201,
                "e" => $e->getLine() . $e->getMessage(),
                "as" => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getNoRMTerakhir(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idRunningNumber = 1745;
        $runningNumber = RunningNumber::where('id', $idRunningNumber)->where('kdprofile', $kdProfile)->first();
        $extension = $runningNumber->reset;
        $noCmTerakhir = $runningNumber->nomer_terbaru + 1;
        $noCm = $extension . $noCmTerakhir;
        // $noCm = $this->generateCodeBySeqTable(new Pasien, 'nocm', 7, '', $kdProfile);
        // $noCmTerakhir = (int)$noCm;  
        // $data['nocmrunning'] = $noCmTerakhir;
        $data['nocm'] = $noCm;
        return $this->respond($data);
    }
    public function updateNORM(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);

        DB::beginTransaction();
        try {
            $cek =  Pasien::where('nocm', $request['nocm'])
                ->where('statusenabled', true)
                ->first();
            $idRunningNumber = 1745;
            $stt = '';
            if (empty($cek)) {
                RunningNumber::where('id', $idRunningNumber)
                    ->update(
                        [
                            'nomer_terbaru' => $request['nocmbaru']
                        ]
                    );
                Pasien::where('id', $request['id'])
                    ->update(
                        [
                            'nocm' => $request['nocmbaru'],
                            'nocmlama' => $request['nocm']
                        ]
                    );
                $noCm = $request['nocmbaru'];

                $updateEMR =  EMRPasien::where('nocm', $request['nocm'])
                    ->update([
                        'nocm' => $noCm
                    ]);
            } else {

                // $runningNumber = RunningNumber::where('id', $idRunningNumber)->where('kdprofile', $kdProfile)->first();
                // $extension = $runningNumber->extention;

                // $noCmTerakhir = $runningNumber->nomer_terbaru + 1;
                // $noCm = $extension . $noCmTerakhir;

                RunningNumber::where('id', $idRunningNumber)
                    ->update(
                        [
                            'nomer_terbaru' => $request['nocmbaru']
                        ]
                    );
                Pasien::where('id', $request['id'])
                    ->update(
                        [
                            'nocm' => $request['nocmbaru'],
                            'nocmlama' => $request['nocm']
                        ]
                    );
                $updateEMR =  EMRPasien::where('nocm', $request['nocm'])
                    ->update([
                        'nocm' => $request['nocmbaru']
                    ]);
                $stt = ' No RM baru : ' . $request['nocmbaru'];
            }



            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses " . $stt;
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'nocm' => $request['nocmbaru'],
                'as' => '',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transStatus,
                'e'  => $e->getMessage() . ' ' . $e->getLine(),
                'as' => '',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    function saveRMhilang(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        DB::beginTransaction();
        try {
            $update = Pasien::where('nocm', $request['nocm'])->first();
            $update->isrmhilang = true;
            $update->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Update RM Hilang Berhasil!";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => '',
            );
        } else {
            $transMessage = "Update RM Hilang Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transStatus,
                'e'  => $e->getMessage() . ' ' . $e->getLine(),
                'as' => '',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    function getLaporanSensus(Request $request)
    {
        $tglAwal = $request['tahun'] . '-' . $request['bulan'] . '-' . '01';
        $th = $request['bulan'];
        $bl = $request['tahun'];
        $tanggal = DB::select(DB::raw("
            select d::date as tgl
            from generate_series('$tglAwal', '$tglAwal'::date + INTERVAL '1 MONTH - 1 day', '1 day'::interval) d
        "));

        $tanggalmin = DB::select(DB::raw("
            select min(d::date) as tglmin
            from generate_series('$tglAwal', '$tglAwal'::date + INTERVAL '1 MONTH - 1 day', '1 day'::interval) d
        "));

        $tanggalmax = DB::select(DB::raw("
            select max(d::date) as tglmax
            from generate_series('$tglAwal', '$tglAwal'::date + INTERVAL '1 MONTH - 1 day', '1 day'::interval) d
        "));

        $arr = [];
        foreach ($tanggal as $row) {
            $arr[] =  $row->tgl;
        }
        $arrmin = [];
        foreach ($tanggalmin as $rowmin) {
            $arrmin[] =  $rowmin->tglmin;
        }
        $arrmax = [];
        foreach ($tanggalmax as $rowmax) {
            $arrmax[] =  $rowmax->tglmax;
        }


        $tanggalminawal = DB::select(DB::raw("select '$arrmin[0] 23:59:59'::timestamp - interval '1 day ' as tgl"));

        $arrminawal = [];
        foreach ($tanggalminawal as $rowminawal) {
            $arrminawal[] =  $rowminawal->tgl;
        }
        $jumlahtt = DB::select(DB::raw("select '$tglAwal' as tanggal, sum(rm.jumlah_tt) as totalperperiode 
                from riwayatkamar_m rm
                inner join ruangan_m ru on ru.id = rm.objectruanganfk
                inner join(
                    select objectruanganfk,objectkamarfk,max(tanggalawal) as tanggal from riwayatkamar_m
                    where 
                    '$arrmax[0] ' BETWEEN tanggalawal and COALESCE(tanggalakhir,'$arrmax[0] ')
                    group by objectruanganfk,objectkamarfk
                ) as x	
                on rm.objectruanganfk=x.objectruanganfk and rm.objectkamarfk=x.objectkamarfk and rm.tanggalawal = x.tanggal
                where rm.kdprofile = 30 and rm.statusenabled = true
                "));

        $date_series = DB::select(DB::raw("
        WITH date_series AS (
        SELECT generate_series('$arrmin[0]'::date, '$arrmin[0]'::date + INTERVAL '1 month - 1 day', '1 day')::date AS series_date
        )
        SELECT date_part('day', series_date::date)as date FROM date_series
        order by date_series asc
        ;
        "));

        $pasienawalRS = DB::select(DB::raw("
        select  jml, tglinput, date_part('day', tglinput::date)as tgl from pasienawalrs_temp where tglinput::date between '$arrmin[0]' and '$arrmax[0]' 
        GROUP BY jml ,tglinput
        order by tglinput asc
        "));

        $pasienmasuk = DB::select(DB::raw("
        select date_part('day', pd.tglregistrasi::date ) as tgl , count(pd.noregistrasi) as jml from pasiendaftar_t pd 
        inner join ruangan_m ru on ru.id = pd.objectruanganlastfk
        where pd.kdprofile = 30 and pd.statusenabled = true and date_part('month', pd.tglregistrasi::date ) = $th and date_part('year', pd.tglregistrasi::date ) = $bl  and ru.objectdepartemenfk = 16
        group by pd.tglregistrasi::date
        order by pd.tglregistrasi::date asc
        "));

        $pasienaps = DB::select(DB::raw("select count(pd.noregistrasi)as jml, date_part('day', pd.tglpulang::date)as tgl from pasiendaftar_t pd where pd.objectstatuspulangfk = 2 and pd.objectkondisipasienfk not in(6,5) and date_part('month', pd.tglpulang)= $th and date_part('year', pd.tglpulang)=$bl and pd.kdprofile = 30 and pd.statusenabled = true
        GROUP BY pd.tglpulang::date
        order by pd.tglpulang::date asc
        "));
        $pasienapd = DB::select(DB::raw("select count(pd.noregistrasi)as jml, date_part('day', pd.tglpulang::date)as tgl from pasiendaftar_t pd where pd.objectstatuspulangfk in (1,6) and pd.objectkondisipasienfk not in(6,5)and date_part('month', pd.tglpulang)= $th and date_part('year', pd.tglpulang)=$bl and pd.kdprofile = 30 and pd.statusenabled = true
        GROUP BY pd.tglpulang::date
        order by pd.tglpulang::date asc
        "));
        $pasienrujuk = DB::select(DB::raw("select count(pd.noregistrasi)as jml, date_part('day', pd.tglpulang::date)as tgl from pasiendaftar_t pd where pd.objectstatuspulangfk in (4,5,10,11) and pd.objectkondisipasienfk not in(6,5) and date_part('month', pd.tglpulang)= $th and date_part('year', pd.tglpulang)=$bl and pd.kdprofile = 30 and pd.statusenabled = true
        GROUP BY pd.tglpulang::date
        order by pd.tglpulang::date asc
        "));
        $pasienlari = DB::select(DB::raw("select count(pd.noregistrasi)as jml, date_part('day', pd.tglpulang::date)as tgl from pasiendaftar_t pd where pd.objectstatuspulangfk = 3 and pd.objectkondisipasienfk not in(6,5) and date_part('month', pd.tglpulang)= $th and date_part('year', pd.tglpulang)=$bl and pd.kdprofile = 30 and pd.statusenabled = true
        GROUP BY pd.tglpulang::date
        order by pd.tglpulang::date asc
        "));
        $pasiendropping = DB::select(DB::raw("select count(pd.noregistrasi)as jml, date_part('day', pd.tglpulang::date)as tgl from pasiendaftar_t pd where pd.objectstatuspulangfk = 12 and date_part('month', pd.tglpulang)= $th and date_part('year', pd.tglpulang)=$bl and pd.kdprofile = 30 and pd.statusenabled = true
        GROUP BY pd.tglpulang::date
        order by pd.tglpulang::date asc
        "));
        $pasienlbh48 = DB::select(DB::raw("
        select count(pd.noregistrasi)as jml, date_part('day', pd.tglpulang::date)as tgl from pasiendaftar_t pd where pd.objectkondisipasienfk= 6 and date_part('month', pd.tglpulang)= $th and date_part('year', pd.tglpulang)=$bl and pd.kdprofile = 30 and pd.statusenabled = true
        GROUP BY pd.tglpulang::date"));
        $pasienkrg48 = DB::select(DB::raw("
        select count(pd.noregistrasi)as jml, date_part('day', pd.tglpulang::date)as tgl from pasiendaftar_t pd where pd.objectkondisipasienfk= 5 and date_part('month', pd.tglpulang)= $th and date_part('year', pd.tglpulang)=$bl and pd.kdprofile = 30 and pd.statusenabled = true
        GROUP BY pd.tglpulang::date"));
        $pasienmkhs = DB::select(DB::raw("
        select date_part('day', pd.tglregistrasi::date ) as tgl , count(pd.noregistrasi) as jml from pasiendaftar_t pd 
        inner join ruangan_m ru on ru.id = pd.objectruanganlastfk
        where pd.kdprofile = 30 and pd.statusenabled = true and date_part('month', pd.tglregistrasi::date ) =$th and date_part('year', pd.tglregistrasi::date ) = $bl  and ru.objectdepartemenfk = 16 and pd.tglpulang::date = pd.tglregistrasi::date
        group by pd.tglregistrasi::date
        order by pd.tglregistrasi::date asc"));
        $los = DB::select(DB::raw("SELECT sum(x.jml)::integer as jml, x.tgl FROM (select date_part('day', pd.tglpulang::date ) as tgl , case when pd.tglpulang::date = pd.tglregistrasi::date then 1 else sum(pd.tglpulang::date - pd.tglregistrasi::date) end as jml from pasiendaftar_t pd 
        inner join ruangan_m ru on ru.id = pd.objectruanganlastfk
        where pd.kdprofile = 30 and pd.statusenabled = true and date_part('month', pd.tglpulang::date ) =$th and date_part('year', pd.tglpulang::date ) = $bl  and ru.objectdepartemenfk = 16 and pd.tglpulang is not null
        GROUP BY pd.tglregistrasi, pd.tglpulang
        )as x
        GROUP BY x.tgl
        order by x.tgl asc"));
        $data = [];
        $pasienAwal = 0;
        $pasienMasuk = 0;
        $pasienAPS = 0;
        $pasienAPD = 0;
        $pasienRujuk = 0;
        $pasienLari = 0;
        $pasienDropping = 0;
        $jumlahpasienpulang = 0;
        $pasienLBH48 = 0;
        $pasienKRG48 = 0;
        $jumlahsisapasien = 0;
        $pasienMKHS = 0;
        $hariPerawatan = 0;
        $LOS = 0;

        $tgl = 0;
        $detail = [];
        foreach ($date_series as $date) {
            $pasienAwal = 0;
            $pasienMasuk = 0;
            $pasienAPS = 0;
            $pasienAPD = 0;
            $pasienRujuk = 0;
            $pasienLari = 0;
            $pasienDropping = 0;
            $jumlahpasienpulang = 0;
            $pasienLBH48 = 0;
            $pasienKRG48 = 0;
            $jumlahpasienmeninggal = 0;
            $jumlahpasienkeluarrs = 0;
            $jumlahsisapasien = 0;
            $pasienMKHS = 0;
            $hariPerawatan = 0;
            $LOS = 0;
            $jumlah = 0;
            foreach ($pasienawalRS as $psa) {
                if ($date->date == $psa->tgl) {
                    $pasienAwal = $psa->jml;
                }
            }
            foreach ($pasienmasuk as $psm) {
                if ($date->date == $psm->tgl) {
                    $pasienMasuk = $psm->jml;
                }
            }
            foreach ($pasienaps as $psaps) {
                if ($date->date == $psaps->tgl) {
                    $pasienAPS = $psaps->jml;
                }
            }
            foreach ($pasienapd as $psapd) {
                if ($date->date == $psapd->tgl) {
                    $pasienAPD = $psapd->jml;
                }
            }
            foreach ($pasienrujuk as $psrujuk) {
                if ($date->date == $psrujuk->tgl) {
                    $pasienRujuk = $psrujuk->jml;
                }
            }
            foreach ($pasienlari as $pslari) {
                if ($date->date == $pslari->tgl) {
                    $pasienLari = $pslari->jml;
                }
            }
            foreach ($pasiendropping as $psdrop) {
                if ($date->date == $psdrop->tgl) {
                    $pasienDropping = $psdrop->jml;
                }
            }
            foreach ($pasienlbh48 as $pslbh48) {
                if ($date->date == $pslbh48->tgl) {
                    $pasienLBH48 = $pslbh48->jml;
                }
            }
            foreach ($pasienkrg48 as $pskrg48) {
                if ($date->date == $pskrg48->tgl) {
                    $pasienKRG48 = $pskrg48->jml;
                }
            }
            foreach ($pasienmkhs as $psmkhs) {
                if ($date->date == $psmkhs->tgl) {
                    $pasienMKHS = $psmkhs->jml;
                }
            }
            foreach ($los as $l) {
                if ($date->date == $l->tgl) {
                    $LOS = $l->jml;
                }
            }
            $jumlah = $pasienAwal + $pasienMasuk;
            $jumlahpasienpulang = $pasienAPS + $pasienAPD + $pasienRujuk + $pasienLari + $pasienDropping;
            $jumlahpasienmeninggal = $pasienKRG48 + $pasienLBH48;
            $jumlahpasienkeluarrs = $jumlahpasienpulang + $jumlahpasienmeninggal;
            $jumlahsisapasien = $jumlah - $jumlahpasienkeluarrs;
            $hariPerawatan = $jumlahsisapasien + $pasienMKHS;
            $detail[] = array(
                'tgl' => $date->date,
                'pasienawal' => $pasienAwal,
                'pasienmasuk' => $pasienMasuk,
                'jumlah' => $jumlah,
                'pasienaps' => $pasienAPS,
                'pasienapd' => $pasienAPD,
                'pasienrujuk' => $pasienRujuk,
                'pasienlari' => $pasienLari,
                'pasiendropping' => $pasienDropping,
                'jumlahpasienpulang' => $jumlahpasienpulang,
                'pasienlbh48' => $pasienLBH48,
                'pasienkrg48' => $pasienKRG48,
                'jumlahpasienmeninggal' => $jumlahpasienmeninggal,
                'jumlahpasienkeluarrs' => $jumlahpasienkeluarrs,
                'jumlahsisapasien' => $jumlahsisapasien,
                'pasienmkhs' => $pasienMKHS,
                'hariperawatan' => $hariPerawatan,
                'los' => $LOS,

            );
        }
        $result = array(
            'data' => $detail,
            'jumlahtt' => $jumlahtt
        );
        return $this->respond($result);
    }
    function getCoba(Request $request)
    {
        $tglAwal = $request['tahun'] . '-' . $request['bulan'] . '-' . '01';
        $th = $request['bulan'];
        $bl = $request['tahun'];
        $tanggal = DB::select(DB::raw("
            select d::date as tgl
            from generate_series('$tglAwal', '$tglAwal'::date + INTERVAL '1 MONTH - 1 day', '1 day'::interval) d
        "));

        $tanggalmin = DB::select(DB::raw("
            select min(d::date) as tglmin
            from generate_series('$tglAwal', '$tglAwal'::date + INTERVAL '1 MONTH - 1 day', '1 day'::interval) d
        "));

        $tanggalmax = DB::select(DB::raw("
            select max(d::date) as tglmax
            from generate_series('$tglAwal', '$tglAwal'::date + INTERVAL '1 MONTH - 1 day', '1 day'::interval) d
        "));

        $arr = [];
        foreach ($tanggal as $row) {
            $arr[] =  $row->tgl;
        }
        $arrmin = [];
        foreach ($tanggalmin as $rowmin) {
            $arrmin[] =  $rowmin->tglmin;
        }
        $arrmax = [];
        foreach ($tanggalmax as $rowmax) {
            $arrmax[] =  $rowmax->tglmax;
        }


        $tanggalminawal = DB::select(DB::raw("select '$arrmin[0] 23:59:59'::timestamp - interval '1 day ' as tgl"));

        $arrminawal = [];
        foreach ($tanggalminawal as $rowminawal) {
            $arrminawal[] =  $rowminawal->tgl;
        }
        $date_series = DB::select(DB::raw("
        WITH date_series AS (
        SELECT generate_series('$arrmin[0]'::date, '$arrmin[0]'::date + INTERVAL '1 month - 1 day', '1 day')::date AS series_date,
        generate_series('$arrminawal[0]'::date, '$arrmin[0]'::date + INTERVAL '1 month - 1 day', '1 day')::date AS series_dateawal
        )
        SELECT 
        date_part('day', series_date::date)as date,
        series_date::timestamp + interval '23 hours 59 minutes 59 seconds' as datefull,
        series_dateawal::timestamp + interval '23 hours 59 minutes 59 seconds' as datefullawal 

        FROM date_series
        where series_dateawal is not null and series_date is not null
        order by date_series asc
        ;
        "));
        $data = [];
        // return $this->respond($date_series);
        foreach ($date_series as $k) {
            $pasienmasuk = DB::select(DB::raw("
            -- pasien masuk
            select count(pd.norec) as pasienmasuk from pasiendaftar_t pd 
            inner join ruangan_m ru on ru.id = pd.objectruanganlastfk
            where pd.kdprofile = 30 and pd.statusenabled = true and pd.tglregistrasi < '$k->datefullawal'  and ru.objectdepartemenfk = 16"));
            $pasienpulang = DB::select(DB::raw("
            -- pasien pulangg
            SELECT count(pd.norec) as pasienpulang FROM pasiendaftar_t pd 
            inner join ruangan_m ru on ru.id = pd.objectruanganlastfk
            where pd.kdprofile = 30 and pd.statusenabled = true and ru.objectdepartemenfk = 16 and pd.tglpulang < '$k->datefullawal' 
            "));
            $data[] = array(
                'data' => $pasienmasuk[0]->pasienmasuk - $pasienpulang[0]->pasienpulang,
                'tglawal' => $k->datefullawal,
                'tgl' => $k->datefull,
            );
        }

        // foreach ($data as $d) {
        //     db::table('pasienawalrs_temp')->insert([
        //         'norec'=> substr(Uuid::generate(), 0, 32),
        //         'kdprofile'=> 30,
        //         'statusenabled'=> true,
        //         'jml'=> $d['data'],
        //         'tglinput'=> $d['tgl'],
        //     ]);
        // }
        $result = array(
            'data' => $data,
        );
        return $this->respond($result);
    }
    function savePasienAwal(Request $request)
    {
        try {
            $data1 = null;
            foreach ($request['data'] as $r) {
                $data1 = DB::table('pasienawalrs_temp')->where('tglinput', $r['tgl'])->first();
                if ($data1 == null) {
                    db::table('pasienawalrs_temp')->insert([
                        'norec' => substr(Uuid::generate(), 0, 32),
                        'kdprofile' => 30,
                        'statusenabled' => true,
                        'jml' => $r['data'],
                        'tglinput' => $r['tgl'],
                    ]);
                } else {
                    DB::table('pasienawalrs_temp')->where('tglinput', $r['tgl'])->update([
                        'jml' => $r['data'],
                        'tglinput' => $r['tgl'],
                    ]);
                }
            }
            $transStatus = 'true';
        } catch (\Throwable $th) {
            $transStatus = 'false';

            //throw $th;
        }
        if ($transStatus == 'true') {
            $transMessage = "Posting Berhasil!";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $data1,
                'request' => $request,
                'as' => '',
            );
        } else {
            $transMessage = "Posting Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transStatus,
                'e'  => $th->getMessage() . ' ' . $th->getLine(),
                'as' => '',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    function getLaporanSensusBangsal(Request $request)
    {
        $tglAwal = $request['tahun'] . '-' . $request['bulan'] . '-' . '01';
        $th = $request['bulan'];
        $bl = $request['tahun'];
        $ruangan = $request['ruangan'];
        $tanggal = DB::select(DB::raw("
            select d::date as tgl
            from generate_series('$tglAwal', '$tglAwal'::date + INTERVAL '1 MONTH - 1 day', '1 day'::interval) d
        "));

        $tanggalmin = DB::select(DB::raw("
            select min(d::date) as tglmin
            from generate_series('$tglAwal', '$tglAwal'::date + INTERVAL '1 MONTH - 1 day', '1 day'::interval) d
        "));

        $tanggalmax = DB::select(DB::raw("
            select max(d::date) as tglmax
            from generate_series('$tglAwal', '$tglAwal'::date + INTERVAL '1 MONTH - 1 day', '1 day'::interval) d
        "));

        $arr = [];
        foreach ($tanggal as $row) {
            $arr[] =  $row->tgl;
        }
        $arrmin = [];
        foreach ($tanggalmin as $rowmin) {
            $arrmin[] =  $rowmin->tglmin;
        }
        $arrmax = [];
        foreach ($tanggalmax as $rowmax) {
            $arrmax[] =  $rowmax->tglmax;
        }


        $tanggalminawal = DB::select(DB::raw("select '$arrmin[0] 23:59:59'::timestamp - interval '1 day ' as tgl"));

        $arrminawal = [];
        foreach ($tanggalminawal as $rowminawal) {
            $arrminawal[] =  $rowminawal->tgl;
        }
        $jumlahtt = DB::select(DB::raw("select '$tglAwal' as tanggal, sum(rm.jumlah_tt) as totalperperiode 
                from riwayatkamar_m rm
                inner join ruangan_m ru on ru.id = rm.objectruanganfk
                inner join(
                    select objectruanganfk,objectkamarfk,max(tanggalawal) as tanggal from riwayatkamar_m 
                    where 
                    '$arrmax[0] 23:59:59' BETWEEN tanggalawal and COALESCE(tanggalakhir,'$arrmax[0] 23:59:59')
                    and objectruanganfk = $ruangan
                    group by objectruanganfk,objectkamarfk
                ) as x	
                on rm.objectruanganfk=x.objectruanganfk and rm.objectkamarfk=x.objectkamarfk and rm.tanggalawal = x.tanggal
                where rm.kdprofile = 30 and rm.statusenabled = true
                "));

        $date_series = DB::select(DB::raw("
        WITH date_series AS (
        SELECT generate_series('$arrmin[0]'::date, '$arrmin[0]'::date + INTERVAL '1 month - 1 day', '1 day')::date AS series_date
        )
        SELECT date_part('day', series_date::date)as date FROM date_series
        order by date_series asc
        "));
        $pasienawalBangsal = DB::select(DB::raw("
        select  jml, tglinput, date_part('day', tglinput::date)as tgl from pasienawalbangsal_temp where tglinput::date between '$arrmin[0]' and '$arrmax[0]' and objectruanganfk = $request[ruangan] 
        GROUP BY jml ,tglinput
        order by tglinput asc
        "));


        $pasienmasuk = DB::select(DB::raw("
        select date_part('day', apd.tglmasuk::date ) as tgl, count(apd.norec) as jml  from antrianpasiendiperiksa_t apd
        inner join ruangan_m ru on ru.id = apd.objectruanganasalfk
        inner join ruangan_m ru2 on ru2.id = apd.objectruanganfk
        where ru2.id = $ruangan and apd.kdprofile = 30 and apd.statusenabled = true and date_part('month', apd.tglmasuk::date ) = $th and date_part('year', apd.tglmasuk::date ) = $bl 
        GROUP BY apd.tglmasuk::date
        "));
        $pasienmpindahan = DB::select(DB::raw("
        select date_part('day', apd.tglmasuk::date ) as tgl, count(apd.norec) as jml  from antrianpasiendiperiksa_t apd
        inner join ruangan_m ru on ru.id = apd.objectruanganasalfk
        inner join ruangan_m ru2 on ru2.id = apd.objectruanganfk
        where ru.objectdepartemenfk = 16 and ru2.id = $ruangan and apd.kdprofile = 30 and apd.statusenabled = true and date_part('month', apd.tglmasuk::date ) = $th and date_part('year', apd.tglmasuk::date ) = $bl 
        GROUP BY apd.tglmasuk::date
        "));
        $pasiendipindahkan = DB::select(DB::raw("
        select date_part('day', apd.tglkeluar::date ) as tgl, count(apd.norec) as jml  from antrianpasiendiperiksa_t apd
        inner join ruangan_m ru2 on ru2.id = apd.objectruanganfk
        inner join pasiendaftar_t pd on pd.norec = apd.noregistrasifk and pd.tglpulang::date <> apd.tglkeluar::date 
        where ru2.id = $ruangan and apd.kdprofile = 30 and apd.statusenabled = true and date_part('month', apd.tglkeluar::date ) = $th
        and date_part('year', apd.tglkeluar::date ) = $bl
        GROUP BY apd.tglkeluar::date
        "));

        $pasienaps = DB::select(DB::raw("select count(pd.noregistrasi)as jml, date_part('day', pd.tglpulang::date)as tgl from pasiendaftar_t pd where pd.objectstatuspulangfk = 2 and date_part('month', pd.tglpulang)= $th and date_part('year', pd.tglpulang)=$bl and pd.kdprofile = 30 and pd.statusenabled = true 
        and pd.objectruanganlastfk = $request[ruangan]
        GROUP BY pd.tglpulang::date
        order by pd.tglpulang::date asc
        "));
        $pasienapd = DB::select(DB::raw("select count(pd.noregistrasi)as jml, date_part('day', pd.tglpulang::date)as tgl from pasiendaftar_t pd where pd.objectstatuspulangfk = 1 and date_part('month', pd.tglpulang)= $th and date_part('year', pd.tglpulang)=$bl and pd.kdprofile = 30 and pd.statusenabled = true and pd.objectruanganlastfk = $request[ruangan]
        GROUP BY pd.tglpulang::date
        order by pd.tglpulang::date asc
        "));
        $pasienrujuk = DB::select(DB::raw("select count(pd.noregistrasi)as jml, date_part('day', pd.tglpulang::date)as tgl from pasiendaftar_t pd where pd.objectstatuspulangfk in (4,5,10,11) and date_part('month', pd.tglpulang)= $th and date_part('year', pd.tglpulang)=$bl and pd.kdprofile = 30 and pd.statusenabled = true and pd.objectruanganlastfk = $request[ruangan]
        GROUP BY pd.tglpulang::date
        order by pd.tglpulang::date asc
        "));
        $pasienlari = DB::select(DB::raw("select count(pd.noregistrasi)as jml, date_part('day', pd.tglpulang::date)as tgl from pasiendaftar_t pd where pd.objectstatuspulangfk = 3 and date_part('month', pd.tglpulang)= $th and date_part('year', pd.tglpulang)=$bl and pd.kdprofile = 30 and pd.statusenabled = true and pd.objectruanganlastfk = $request[ruangan]
        GROUP BY pd.tglpulang::date
        order by pd.tglpulang::date asc
        "));
        $pasiendropping = DB::select(DB::raw("select count(pd.noregistrasi)as jml, date_part('day', pd.tglpulang::date)as tgl from pasiendaftar_t pd where pd.objectstatuspulangfk = 12 and date_part('month', pd.tglpulang)= $th and date_part('year', pd.tglpulang)=$bl and pd.kdprofile = 30 and pd.statusenabled = true and pd.objectruanganlastfk = $request[ruangan]
        GROUP BY pd.tglpulang::date
        order by pd.tglpulang::date asc
        "));
        $pasienlbh48 = DB::select(DB::raw("
        select count(pd.noregistrasi)as jml, date_part('day', pd.tglpulang::date)as tgl from pasiendaftar_t pd where pd.objectkondisipasienfk= 6 and date_part('month', pd.tglpulang)= $th and date_part('year', pd.tglpulang)=$bl and pd.kdprofile = 30 and pd.statusenabled = true and pd.objectruanganlastfk = $request[ruangan]
        GROUP BY pd.tglpulang::date"));
        $pasienkrg48 = DB::select(DB::raw("
        select count(pd.noregistrasi)as jml, date_part('day', pd.tglpulang::date)as tgl from pasiendaftar_t pd where pd.objectkondisipasienfk= 5 and date_part('month', pd.tglpulang)= 8 and date_part('year', pd.tglpulang)=$bl and pd.kdprofile = 30 and pd.statusenabled = true and pd.objectruanganlastfk = $request[ruangan]
        GROUP BY pd.tglpulang::date"));
        $pasienmkhs = DB::select(DB::raw("
        select date_part('day', apd.tglkeluar::date ) as tgl , count(apd.norec) as jml from pasiendaftar_t pd 
        inner join ruangan_m ru on ru.id = pd.objectruanganlastfk
        inner join antrianpasiendiperiksa_t apd on pd.norec = apd.noregistrasifk
        where pd.kdprofile = 30 and pd.statusenabled = true and date_part('month', apd.tglkeluar::date ) =$th 
        and apd.objectruanganfk = $request[ruangan]
        and date_part('year', apd.tglkeluar::date ) = $bl  and ru.objectdepartemenfk = 16 and apd.tglmasuk::date = apd.tglkeluar::date
        group by apd.tglkeluar::date
        order by apd.tglkeluar::date asc"));
        // $los = DB::select(DB::raw("SELECT sum(x.jml)::integer as jml, x.tgl FROM (select date_part('day', apd.tglkeluar::date ) as tgl , case when apd.tglkeluar::date = apd.tglkeluar::date then 1 else sum(apd.tglkeluar::date - apd.tglkeluar::date) end as jml from pasiendaftar_t pd 
        // inner join antrianpasiendiperiksa_t apd on apd.noregistrasifk = pd.norec
        // inner join ruangan_m ru on ru.id = apd.objectruanganfk
        // where pd.kdprofile = 30 and pd.statusenabled = true and date_part('month', apd.tglkeluar::date ) =$th and date_part('year', apd.tglkeluar::date ) = $bl  and ru.objectdepartemenfk = 16 and apd.tglkeluar is not null and apd.objectruanganfk = $request[ruangan]
        // GROUP BY apd.tglkeluar::date
        // )as x
        // GROUP BY x.tgl
        // order by x.tgl asc"));
        $los = DB::select(DB::raw("            
       WITH riwayat_ruangan AS (        
        -- Track room transfer history for each patient        
        SELECT
          pd.norec,        
          apd.objectruanganfk,
          date_part('day', apd.tglkeluar::date) as tgl_keluar,
          apd.tglmasuk,
          apd.tglkeluar,
          -- Get previous discharge time and room for tracking transfers        
          LAG(apd.tglkeluar) OVER (        
           PARTITION BY pd.norec        
           ORDER BY apd.tglmasuk        
          ) as prev_keluar,        
          LAG(apd.objectruanganfk) OVER (        
           PARTITION BY pd.norec        
           ORDER BY apd.tglmasuk        
          ) as prev_ruangan,        
          -- Create unique identifier for each patient per discharge date        
          ROW_NUMBER() OVER (        
           PARTITION BY pd.norec, date_part('day', apd.tglkeluar::date)        
           ORDER BY apd.tglkeluar        
          ) as pasien_sequence        
        FROM pasiendaftar_t pd        
        INNER JOIN antrianpasiendiperiksa_t apd ON apd.noregistrasifk = pd.norec        
        INNER JOIN ruangan_m ru ON ru.id = apd.objectruanganfk        
        WHERE pd.kdprofile = 30        
          AND pd.statusenabled = true        
          AND date_part('month', apd.tglkeluar::date) = $th        
          AND date_part('year', apd.tglkeluar::date) = $bl        
          AND ru.objectdepartemenfk = 16        
          AND apd.tglkeluar IS NOT NULL        
          AND apd.objectruanganfk = $request[ruangan]        
       ),        
       durasi_per_ruangan AS (        
        -- Calculate duration in hours for each room stay        
        SELECT        
          norec,        
          objectruanganfk,        
          tgl_keluar,        
          pasien_sequence,        
          EXTRACT(EPOCH FROM (        
           CASE        
             WHEN prev_keluar IS NOT NULL THEN tglkeluar - prev_keluar        
             ELSE tglkeluar - tglmasuk        
           END        
          ))/3600 as durasi_jam        
        FROM riwayat_ruangan        
       ),        
       los_per_ruangan AS (        
        -- Convert duration to LOS days based on business rules:        
        -- ≤12 hours = 0 days        
        -- ≤24 hours = 1 day        
        -- >24 hours = ceil(hours/24)        
        SELECT        
          norec,        
          tgl_keluar,        
          pasien_sequence,        
          CASE        
           WHEN durasi_jam <= 12 THEN 0        
           WHEN durasi_jam <= 24 THEN 1        
           ELSE CEIL(durasi_jam/24)::integer        
          END as los        
        FROM durasi_per_ruangan        
       )        
       -- Final aggregation by discharge date        
       SELECT        
        tgl_keluar as tgl,        
        SUM(los)::integer as jml        
       FROM los_per_ruangan        
       GROUP BY tgl_keluar        
       ORDER BY tgl_keluar ASC;        
       "));
        
        $tgl = 0;
        $detail = [];
        foreach ($date_series as $date) {
            $pasienawal = 0;
            $pasienMasuk = 0;
            $pasienPindahan = 0;
            $pasienDipindahkan = 0;
            $jumlah = 0;
            $pasienAPS = 0;
            $pasienAPD = 0;
            $pasienRujuk = 0;
            $pasienLari = 0;
            $pasienDropping = 0;
            $jumlahpasienpulang = 0;
            $pasienLBH48 = 0;
            $pasienKRG48 = 0;
            $pasienMKHS = 0;
            $LOS = 0;
            foreach ($pasienawalBangsal as $psb) {
                if ($date->date == $psb->tgl) {
                    $pasienawal = $psb->jml;
                }
            }
            foreach ($pasienmasuk as $psm) {
                if ($date->date == $psm->tgl) {
                    $pasienMasuk = $psm->jml;
                }
            }
            foreach ($pasienmpindahan as $psmp) {
                if ($date->date == $psmp->tgl) {
                    $pasienPindahan = $psmp->jml;
                }
            }

            foreach ($pasiendipindahkan as $psmp) {
                if ($date->date == $psmp->tgl) {
                    $pasienDipindahkan = $psmp->jml;
                }
            }
            foreach ($pasienaps as $psaps) {
                if ($date->date == $psaps->tgl) {
                    $pasienAPS = $psaps->jml;
                }
            }
            foreach ($pasienapd as $psapd) {
                if ($date->date == $psapd->tgl) {
                    $pasienAPD = $psapd->jml;
                }
            }
            foreach ($pasienrujuk as $psrujuk) {
                if ($date->date == $psrujuk->tgl) {
                    $pasienRujuk = $psrujuk->jml;
                }
            }
            foreach ($pasienlari as $pslari) {
                if ($date->date == $pslari->tgl) {
                    $pasienLari = $pslari->jml;
                }
            }
            foreach ($pasiendropping as $psdrop) {
                if ($date->date == $psdrop->tgl) {
                    $pasienDropping = $psdrop->jml;
                }
            }
            foreach ($pasienlbh48 as $pslbh48) {
                if ($date->date == $pslbh48->tgl) {
                    $pasienLBH48 = $pslbh48->jml;
                }
            }
            foreach ($pasienkrg48 as $pskrg48) {
                if ($date->date == $pskrg48->tgl) {
                    $pasienKRG48 = $pskrg48->jml;
                }
            }
            foreach ($pasienmkhs as $psmkhs) {
                if ($date->date == $psmkhs->tgl) {
                    $pasienMKHS = $psmkhs->jml;
                }
            }
            foreach ($los as $psmkhs) {
                if ($date->date == $psmkhs->tgl) {
                    $LOS = $psmkhs->jml;
                }
            }
            $jumlah = $pasienawal + $pasienMasuk + $pasienPindahan;
            $jumlahpasienpulang = $pasienAPS + $pasienAPD + $pasienRujuk + $pasienLari + $pasienDropping;
            $jumlahpasienmeninggal = $pasienKRG48 + $pasienLBH48;
            $jumlahpasienkeluarrs = $jumlahpasienpulang + $jumlahpasienmeninggal;
            $jumlahpasienkeluar = $pasienDipindahkan + $jumlahpasienkeluarrs;
            $jumlahsisapasien = $jumlah - $jumlahpasienkeluar;
            $hariperawatan = $jumlahsisapasien + $pasienMKHS;
            $detail[] = array(
                'tgl' => $date->date,
                'pasienawal' => $pasienawal,
                'pasienmasuk' => $pasienMasuk,
                'pasienpindahan' => $pasienPindahan,
                'jumlah' => $jumlah,
                'pasiendipindahkan' => $pasienDipindahkan,
                'pasienaps' => $pasienAPS,
                'pasienapd' => $pasienAPD,
                'pasienrujuk' => $pasienRujuk,
                'pasienlari' => $pasienLari,
                'pasiendropping' => $pasienDropping,
                'jumlahpasienpulang' => $jumlahpasienpulang,
                'pasienkrg48' => $pasienKRG48,
                'pasienlbh48' => $pasienLBH48,
                'jumlahpasienmeninggal' => $jumlahpasienmeninggal,
                'jumlahpasienkeluarrs' => $jumlahpasienkeluarrs,
                'jumlahpasienkeluar' => $jumlahpasienkeluar,
                'jumlahsisapasien' => $jumlahsisapasien,
                'pasienmkhs' => $pasienMKHS,
                'hariperawatan' => $hariperawatan,
                'los' => $LOS,
            );
        }
        $result = array(
            'data' => $detail,
            'jumlahtt' => $jumlahtt
        );
        return $this->respond($result);
    }
    function getCobaBangsal(Request $request)
    {
        $tglAwal = $request['tahun'] . '-' . $request['bulan'] . '-' . '01';
        $th = $request['bulan'];
        $bl = $request['tahun'];
        $ruangan = $request['ruangan'];
        $tanggal = DB::select(DB::raw("
            select d::date as tgl
            from generate_series('$tglAwal', '$tglAwal'::date + INTERVAL '1 MONTH - 1 day', '1 day'::interval) d
        "));

        $tanggalmin = DB::select(DB::raw("
            select min(d::date) as tglmin
            from generate_series('$tglAwal', '$tglAwal'::date + INTERVAL '1 MONTH - 1 day', '1 day'::interval) d
        "));

        $tanggalmax = DB::select(DB::raw("
            select max(d::date) as tglmax
            from generate_series('$tglAwal', '$tglAwal'::date + INTERVAL '1 MONTH - 1 day', '1 day'::interval) d
        "));

        $arr = [];
        foreach ($tanggal as $row) {
            $arr[] =  $row->tgl;
        }
        $arrmin = [];
        foreach ($tanggalmin as $rowmin) {
            $arrmin[] =  $rowmin->tglmin;
        }
        $arrmax = [];
        foreach ($tanggalmax as $rowmax) {
            $arrmax[] =  $rowmax->tglmax;
        }


        $tanggalminawal = DB::select(DB::raw("select '$arrmin[0] 23:59:59'::timestamp - interval '1 day ' as tgl"));

        $arrminawal = [];
        foreach ($tanggalminawal as $rowminawal) {
            $arrminawal[] =  $rowminawal->tgl;
        }
        $date_series = DB::select(DB::raw("
        WITH date_series AS (
        SELECT generate_series('$arrmin[0]'::date, '$arrmin[0]'::date + INTERVAL '1 month - 1 day', '1 day')::date AS series_date,
        generate_series('$arrminawal[0]'::date, '$arrmin[0]'::date + INTERVAL '1 month - 1 day', '1 day')::date AS series_dateawal
        )
        SELECT 
        date_part('day', series_date::date)as date,
        series_date::timestamp + interval '23 hours 59 minutes 59 seconds' as datefull,
        series_dateawal::timestamp + interval '23 hours 59 minutes 59 seconds' as datefullawal 

        FROM date_series
        where series_dateawal is not null and series_date is not null
        order by date_series asc
        ;
        "));
        $data = [];
        // return $this->respond($date_series);
        foreach ($date_series as $k) {
            $pasienmasuk = DB::select(DB::raw("
            select count(apd.norec)as pasienmasuk from antrianpasiendiperiksa_t apd
            inner join ruangan_m ru on ru.id = apd.objectruanganasalfk
            inner join ruangan_m ru2 on ru2.id = apd.objectruanganfk
            where  ru2.id = $request[ruangan] and apd.tglmasuk < '$k->datefullawal' and apd.kdprofile = 30 and apd.statusenabled = true
            "));
            $pasienpulang = DB::select(DB::raw("
            select count(apd.norec)as pasienpulang from antrianpasiendiperiksa_t apd
            inner join ruangan_m ru on ru.id = apd.objectruanganasalfk
            inner join ruangan_m ru2 on ru2.id = apd.objectruanganfk
            where  ru2.id = $request[ruangan] and apd.tglkeluar < '$k->datefullawal' and apd.kdprofile = 30 and apd.statusenabled = true
            "));
            $data[] = array(
                'data' => $pasienmasuk[0]->pasienmasuk - $pasienpulang[0]->pasienpulang,
                'tglawal' => $k->datefullawal,
                'tgl' => $k->datefull,
            );
        }

        // foreach ($data as $d) {
        //     db::table('pasienawalrs_temp')->insert([
        //         'norec'=> substr(Uuid::generate(), 0, 32),
        //         'kdprofile'=> 30,
        //         'statusenabled'=> true,
        //         'jml'=> $d['data'],
        //         'tglinput'=> $d['tgl'],
        //     ]);
        // }
        $result = array(
            'data' => $data,
            'ruangan' => $request['ruangan'],
        );
        return $this->respond($result);
    }
    function savePasienAwalBangsal(Request $request)
    {
        try {
            $data1 = null;
            foreach ($request['data'] as $r) {
                $data1 = DB::table('pasienawalbangsal_temp')->where('tglinput', $r['tgl'])->where('objectruanganfk', $request['ruangan'])->first();
                if ($data1 == null) {
                    db::table('pasienawalbangsal_temp')->insert([
                        'norec' => substr(Uuid::generate(), 0, 32),
                        'kdprofile' => 30,
                        'statusenabled' => true,
                        'jml' => $r['data'],
                        'tglinput' => $r['tgl'],
                        'objectruanganfk' => $request['ruangan'],
                    ]);
                } else {
                    DB::table('pasienawalbangsal_temp')->where('objectruanganfk', $request['ruangan'])->where('tglinput', $r['tgl'])->update([
                        'jml' => $r['data'],
                        'tglinput' => $r['tgl'],
                    ]);
                }
            }
            $transStatus = 'true';
        } catch (\Throwable $th) {
            $transStatus = 'false';

            //throw $th;
        }
        if ($transStatus == 'true') {
            $transMessage = "Posting Berhasil!";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $data1,
                'request' => $request,
                'as' => '',
            );
        } else {
            $transMessage = "Posting Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transStatus,
                'e'  => $th->getMessage() . ' ' . $th->getLine(),
                'as' => '',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getHistoriEMR(Request $request)
    {
        $dataLogin = $request->all();
        $kdProfile = (int)$this->getDataKdProfile($request);
        $deptRanap = explode(',', $this->settingDataFixed('kdDepartemenRanapFix', $kdProfile));
        $number = 1000;
        ini_set('max_execution_time', $number);
        $kdDepartemenRawatInap = [];
        foreach ($deptRanap as $itemRanap) {
            $kdDepartemenRawatInap[] =  (int)$itemRanap;
        }
        $data  = \DB::table('settingdatafixed_m')
            ->select('namafield', 'nilaifield')
            ->where('keteranganfungsi', 'inacbg')
            ->where('kdprofile', $kdProfile)
            ->get();
        $dataPegawaiUser = DB::select(
            DB::raw("select pg.id,pg.namalengkap,pg.noidentitas from loginuser_s as lu
                INNER JOIN pegawai_m as pg on lu.objectpegawaifk=pg.id
                where lu.id=:idLoginUser"),
            array(
                'idLoginUser' => $dataLogin['userData']['id'],
            )
        );
        foreach ($data as $item) {
            if ($item->namafield == 'codernik') {
                $codernik = $item->nilaifield;
            }
            if ($item->namafield == 'key') {
                $key = $item->nilaifield;
            }
            if ($item->namafield == 'url') {
                $url = $item->nilaifield;
            }
            if ($item->namafield == 'kodetarif') {
                $kodetarif = $item->nilaifield;
            }
        }

        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->join('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftJoin('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            ->join('antrianpasiendiperiksa_t as apd', function ($join) {
                $join->on('apd.noregistrasifk', '=', 'pd.norec');
                $join->on('apd.objectruanganfk', '=', 'pd.objectruanganlastfk');
            })
            ->leftjoin('asalrujukan_m as asl', 'asl.id', '=', 'apd.objectasalrujukanfk')
            ->leftjoin('pemakaianasuransi_t as pas', 'pas.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('asuransipasien_m as asu', 'asu.id', '=', 'pas.objectasuransipasienfk')
            ->leftjoin('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
            ->leftjoin('kelas_m as kls2', 'kls2.id', '=', 'asu.objectkelasdijaminfk')
            ->leftjoin('hasilgrouping_t as hg', 'hg.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('diagnosaberatbadanbayi_t as dbb', 'dbb.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
            ->leftjoin('apgarscore_t as aps', 'aps.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('statuspulang_m as stp', 'stp.id', '=', 'pd.objectstatuspulangfk')
            ->leftjoin('dokklaim_t as dok', 'dok.noregistrasifk', '=', 'pd.norec')
            ->distinct()
            ->select(
                'pd.norec',
                'pd.tglregistrasi',
                'ps.nocm',
                'pd.noregistrasi',
                'ru.namaruangan',
                'ps.namapasien',
                'kp.kelompokpasien',
                'pd.tglpulang',
                'pd.statuspasien',
                'apd.norec as norec_apd',
                'stp.namaexternal as statuspulang',
                'usiakehamilan',
                'gravida',
                'partus',
                'abortus',
                'pd.pegawaikirim',
                'pd.pegawaisimpan',
                'pd.pegawaigrouper',
                'pd.pegawaifinalklaim',
                'pd.pegeditklaim',
                'pd.tgledit',
                'pd.tglklaim',
                'pg.id as pgid',
                'pg.namalengkap as namadokter',
                'kp.id as kpid',
                'asl.caramasuk_inacbg',
                'stp.kodeexternal',
                'ru.objectdepartemenfk',
                'hg.tglgrouping',
                'hg.special_cmg',
                'hg.response',
                'dp.namadepartemen',
                'pd.objectruanganlastfk as ruanganid',
                DB::raw("case when pas.nosep is null then '-' else pas.nosep end as nosep"),
                'pas.norec as norec_pa',
                DB::raw("null as los, null as jam"),
                DB::raw(" EXTRACT ( YEAR FROM AGE( pd.tglregistrasi, ps.tgllahir ) )|| ' Tahun ' as umur"),
                'pas.nokepesertaan',
                'ps.tgllahir',
                'ps.objectjeniskelaminfk',
                'dept.id as deptid',
                'kls.nourut as nokelasdaftar',
                'kls2.nourut as nokelasdijamin',
                'kls.reportdisplay as namakelasdaftar',
                'kls2.reportdisplay as namakelas',
                'pd.objectstatuspulangfk',
                // 'pd.isventilator',
                // 'pd.lamarawatintensif',
                // 'pd.tglintubasi',
                // 'pd.tglekstubasi',
                'hg.biayanaikkelas',
                'dbb.beratbadan',
                'rk.id as idrekanan',
                'hg.status as statusgrouping',
                'pas.statuscovid',
                'ps.noidentitas',
                'aps.1menit_appear as menit1_appear',
                'aps.1menit_pulse as menit1_pulse',
                'aps.1menit_grimace as menit1_grimace',
                'aps.1menit_activity as menit1_activity',
                'aps.1menit_resp as menit1_resp',
                'aps.5menit_appear as menit5_appear',
                'aps.5menit_pulse as menit5_pulse',
                'aps.5menit_grimace as menit5_grimace',
                'aps.5menit_activity as menit5_activity',
                'aps.5menit_resp as menit5_resp',
                DB::raw(" 'verifikasi'  as status, pas.loscovid,pd.statusklaim"),
                DB::raw("case when hg.totalpiutangpenjamin is null then '-1' else hg.totalpiutangpenjamin end as totalpiutangpenjamin,statuskelengkapandok, COUNT ( dok.* ) || ' Dokumen' as hitungdok")
            )
            ->where('pd.statusenabled', true)
            ->where('pd.kdprofile', $kdProfile)
            ->whereNotNull('pd.tglpulang');


        $filter = $request->all();

        if (isset($filter['ispulang']) && $filter['ispulang'] == true) {
            if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
                $data = $data->where('pd.tglpulang', '>=', $filter['tglAwal']);
            }
        } else {
            if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
                $data = $data->where('pd.tglregistrasi', '>=', $filter['tglAwal']);
            }
        }

        if (isset($filter['ispulang']) && $filter['ispulang'] == true) {
            if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
                $tgl = $filter['tglAkhir']; //." 23:59:59";
                $data = $data->where('pd.tglpulang', '<=', $tgl);
            }
        } else {

            if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
                $tgl = $filter['tglAkhir']; //." 23:59:59";
                $data = $data->where('pd.tglregistrasi', '<=', $tgl);
            }
        }
        if (isset($filter['deptId']) && $filter['deptId'] != "" && $filter['deptId'] != "undefined") {
            $data = $data->where('dept.id', '=', $filter['deptId']);
        }
        if (isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined") {
            $data = $data->where('ru.id', '=', $filter['ruangId']);
        }
        $paramKel  = '';
        if (isset($request['kelId']) && $request['kelId'] != "" && $request['kelId'] != "undefined") {
            $arrKel = explode(',', $request['kelId']);
            $kodeKel = [];
            foreach ($arrKel as $item) {
                $kodeKel[] = (int) $item;
            }
            $paramKel = ' and kp.id in (' . $request['kelId'] . ')';
            $data = $data->whereIn('kp.id', $kodeKel);
        }
        if (isset($filter['dokId']) && $filter['dokId'] != "" && $filter['dokId'] != "undefined") {
            $data = $data->where('pg.id', '=', $filter['dokId']);
        }
        if (isset($filter['sttts']) && $filter['sttts'] != "" && $filter['sttts'] != "undefined") {
            $data = $data->where('pd.statuspasien', '=', $filter['sttts']);
        }
        if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', 'ilike', '%' . $filter['noreg'] . '%');
        }
        if (isset($filter['norm']) && $filter['norm'] != "" && $filter['norm'] != "undefined") {
            $data = $data->where('ps.nocm', 'ilike', '%' . $filter['norm'] . '%');
        }
        if (isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $data = $data->where('ps.namapasien', 'ilike', '%' . $filter['nama'] . '%');
        }
        if (isset($filter['nosep']) && $filter['nosep'] != "" && $filter['nosep'] != "undefined") {
            $data = $data->where('pas.nosep', 'ilike', '%' . $filter['nosep'] . '%');
        }
        if (isset($filter['status']) && $filter['status'] != "" && $filter['status'] != "undefined") {
            $data = $data->where('pd.statusklaim', '=', $filter['status']);
        }
        if (isset($filter['pegklaim']) && $filter['pegklaim'] != "" && $filter['pegklaim'] != "undefined") {
            $data = $data->where('pd.pegawaifinalklaim', 'ilike', '%' . $filter['pegklaim'] . '%');
        }
        $data = $data->orderBy('pd.noregistrasi');
        $data = $data->groupBy(
            'pd.norec',
            'pd.tglregistrasi',
            'ps.nocm',
            'pd.noregistrasi',
            'ru.namaruangan',
            'ps.namapasien',
            'kp.kelompokpasien',
            'pd.tglpulang',
            'pd.statuspasien',
            'apd.norec',
            'stp.namaexternal',
            'usiakehamilan',
            'gravida',
            'partus',
            'abortus',
            'pg.id',
            'pg.namalengkap',
            'kp.id',
            'asl.caramasuk_inacbg',
            'pd.tglklaim',
            'pd.tgledit',
            'pd.pegawaikirim',
            'pd.pegawaisimpan',
            'pd.pegawaigrouper',
            'pd.pegawaifinalklaim',
            'pd.pegeditklaim',
            'stp.kodeexternal',
            'ru.objectdepartemenfk',
            'hg.tglgrouping',
            'hg.special_cmg',
            'hg.response',
            'dp.namadepartemen',
            'pd.objectruanganlastfk',
            'pas.nosep',
            'pas.norec',
            'pas.nokepesertaan',
            'ps.tgllahir',
            'ps.objectjeniskelaminfk',
            'dept.id',
            'kls.nourut',
            'kls2.nourut',
            'hg.totalpiutangpenjamin',
            'kls.reportdisplay',
            'kls2.reportdisplay',
            'pd.objectstatuspulangfk',
            'hg.biayanaikkelas',
            'dbb.beratbadan',
            'rk.id',
            'hg.status',
            'pas.statuscovid',
            'ps.noidentitas',
            'aps.1menit_appear',
            'aps.1menit_pulse',
            'aps.1menit_grimace',
            'aps.1menit_activity',
            'aps.1menit_resp',
            'aps.5menit_appear',
            'aps.5menit_pulse',
            'aps.5menit_grimace',
            'aps.5menit_activity',
            'aps.5menit_resp'
        );
        $data = $data->get();

        foreach ($data as $key => $d) {
            $selisih = date_diff(date_create($d->tglregistrasi), date_create($d->tglpulang));
            $selisih2 = strtotime($d->tglpulang) - strtotime($d->tglregistrasi);
            $jam   = floor($selisih2 / (60 * 60));

            $d->jam = $jam . ':' . $selisih->i;
            $d->los = $selisih->days + 1;
        }

        $noregistrasi = '';
        $norecaPd = '';
        foreach ($data as $item) {
            $noregistrasi = $noregistrasi . ",'" . $item->noregistrasi . "'";
            $norecaPd = $norecaPd . ",'" . $item->norec_apd . "'";
        }
        $noregistrasi = substr($noregistrasi, 1, strlen($noregistrasi) - 1);
        $norecaPd = substr($norecaPd, 1, strlen($norecaPd) - 1);

        if ($noregistrasi != '') {
            $dataTotalBill = DB::select(DB::raw("
                select pd.noregistrasi
                from pasiendaftar_t as pd
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                where pd.kdprofile = $kdProfile and pd.noregistrasi in ($noregistrasi) and pp.produkfk not in (402611)
                group by pd.noregistrasi;
            "));
            $i = 0;
            foreach ($data as $h) {
                $data[$i]->totalbiayars = 0;
                foreach ($dataTotalBill as $d) {
                    if ($data[$i]->noregistrasi == $d->noregistrasi) {
                        // $data[$i]->totalbiayars = ceil($d->total);
                    }
                }
                $i++;
            }
        }

        $i = 0;
        $dtdt = '';
        $tglawalawal = $filter['tglAwal'];
        $tglakhirakhir = $filter['tglAkhir'];
        if (isset($filter['ispulang']) && $filter['ispulang'] == true) {
            $periode = " and pd.tglpulang >= '$tglawalawal' and pd.tglpulang <= '$tglakhirakhir' ";
        } else {
            $periode = " and pd.tglregistrasi >= '$tglawalawal' and pd.tglregistrasi <= '$tglakhirakhir' ";
        }

        $VitalSign = DB::select(DB::raw("
            SELECT* FROM (
                SELECT epd.VALUE, epd.emrdfk, pd.noregistrasi,
                    ROW_NUMBER ( ) OVER ( PARTITION BY epd.emrdfk, pd.noregistrasi ORDER BY epd.tgl DESC ) AS nourut 
                    FROM emrpasiend_t AS epd
                        LEFT JOIN emrpasien_t AS ep ON ep.noemr = epd.emrpasienfk 
                        INNER JOIN pasiendaftar_t AS pd ON pd.noregistrasi = ltrim(rtrim(ep.noregistrasifk))
                    WHERE
                        epd.kdprofile = $kdProfile
                        AND epd.emrfk=147
                        $periode
                        AND ep.statusenabled = TRUE 
                    ORDER BY
                        epd.emrdfk DESC   
                    ) AS x 
                WHERE
                    x.nourut = 1 
                ORDER BY
            x.emrdfk
        "));


        $ventilator = DB::select(DB::raw("
                SELECT x.noregistrasifk, '1' as use_ind,case when x.ventilator_hour<1 then 1 ELSE x.ventilator_hour end as ventilator_hour, x.stop_dttm,x.start_dttm FROM(SELECT ep.noregistrasifk,epd.emrpasienfk, EXTRACT(HOUR FROM (lps.stop_dttm::TIMESTAMP - epd.value::TIMESTAMP)) AS ventilator_hour, epd.value as start_dttm,lps.stop_dttm FROM emrpasiend_t as epd
                INNER JOIN (SELECT emrpasienfk,
                 value as stop_dttm FROM emrpasiend_t 
                WHERE emrfk = 291042 and emrdfk in (318182)) as lps ON lps.emrpasienfk = epd.emrpasienfk
                INNER JOIN emrpasien_t as ep on ep.noemr = epd.emrpasienfk
                WHERE epd.emrfk = 291042 and epd.emrdfk in (318179)) as x 
        "));



        foreach ($data as $item) {
            $item->response = json_decode($item->response);
            $item->sistole = 0;
            $item->diastole = 0;
            $item->birth_weight = 0;
            foreach ($VitalSign as $item2) {
                if ($item->noregistrasi == $item2->noregistrasi) {
                    if ($item2->emrdfk == 4241) {
                        if (str_contains($item2->value, '/')) {
                            $tekanandarah = explode("/", $item2->value);
                            $item->sistole = is_nan((float)$tekanandarah[0]) ? 0 : (float)$tekanandarah[0];
                            $item->diastole = is_nan((float)$tekanandarah[1]) ? 0 : (float)$tekanandarah[1];
                        }
                    }
                    if ($item2->emrdfk == 4243) {
                        $item->birth_weight = is_nan((float)$item2->value) ? 0 : (float)$item2->value;
                    }
                }
            }
        }

        $dataDiagnosa = \DB::table('detaildiagnosapasien_t as dp')
            ->join('diagnosa_m as dg', 'dg.id', '=', 'dp.objectdiagnosafk')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'dp.noregistrasifk')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->select('dg.kddiagnosa', 'apd.objectasalrujukanfk', 'pd.norec')
            //            ->where('apd.noregistrasifk',$data[$i]->norec)
            ->wherein('dp.objectjenisdiagnosafk', array(8, 9))
            // ->where('pd.tglregistrasi', '>=', $filter['tglAwal'])
            // ->where('pd.tglregistrasi', '<=', $filter['tglAkhir'])
            ->where('pd.kdprofile', $kdProfile)
            ->orderBy('dp.objectjenisdiagnosafk', 'asc');

        if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
            $dataDiagnosa = $dataDiagnosa->where('pd.noregistrasi', 'ilike', '%' . $filter['noreg'] . '%');
        }
        if (isset($filter['ispulang']) && $filter['ispulang'] == true) {
            if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
                $dataDiagnosa = $dataDiagnosa->where('pd.tglpulang', '>=', $filter['tglAwal']);
            }
        } else {
            if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
                $dataDiagnosa = $dataDiagnosa->where('pd.tglregistrasi', '>=', $filter['tglAwal']);
            }
        }

        if (isset($filter['ispulang']) && $filter['ispulang'] == true) {
            if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
                $tgl = $filter['tglAkhir']; //." 23:59:59";
                $dataDiagnosa = $dataDiagnosa->where('pd.tglpulang', '<=', $tgl);
            }
        } else {

            if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
                $tgl = $filter['tglAkhir']; //." 23:59:59";
                $dataDiagnosa = $dataDiagnosa->where('pd.tglregistrasi', '<=', $tgl);
            }
        }
        // if (isset($filter['norm']) && $filter['norm'] != "" && $filter['norm'] != "undefined") {
        //     $dataDiagnosa = $dataDiagnosa->where('ps.nocm', 'like', '%' . $filter['norm'] . '%');
        // }
        // if (isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
        //     $dataDiagnosa = $dataDiagnosa->where('ps.namapasien', 'like', '%' . $filter['nama'] . '%');
        // }
        $dataDiagnosa = $dataDiagnosa->get();
        foreach ($data as $item) {
            $dtdt = '';
            $asalRujukan = '';
            $covid19_status_cd = '';
            //            $dataDiagnosa = \DB::table('detaildiagnosapasien_t as dp')
            //                ->join('diagnosa_m as dg', 'dg.id', '=', 'dp.objectdiagnosafk')
            //                ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'dp.noregistrasifk')
            //                ->select('dg.kddiagnosa','apd.objectasalrujukanfk')
            //                ->where('apd.noregistrasifk',$data[$i]->norec)
            //                ->get();
            foreach ($dataDiagnosa as $item2) {
                if ($item2->norec == $data[$i]->norec) {
                    $dtdt = $dtdt . '#' .  $item2->kddiagnosa;
                    $asalRujukan = $item2->objectasalrujukanfk;
                }
            }
            $data[$i]->icd10 = substr($dtdt, 1, strlen($dtdt) - 1);
            $data[$i]->codernik = $dataPegawaiUser[0]->noidentitas;
            $data[$i]->objectasalrujukanfk = $asalRujukan;
            $data[$i]->kodetarif = $kodetarif;
            $i = $i + 1;
        }

        $i = 0;
        $dtdt = '';

        $dataICD9 = \DB::table('diagnosatindakanpasien_t as dpa')
            ->join('detaildiagnosatindakanpasien_t as dp', 'dpa.norec', '=', 'dp.objectdiagnosatindakanpasienfk')
            ->join('diagnosatindakan_m as dg', 'dg.id', '=', 'dp.objectdiagnosatindakanfk')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'dpa.objectpasienfk')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->select('dg.kddiagnosatindakan', 'pd.norec')
            //            ->where('apd.noregistrasifk',$data[$i]->norec)
            // ->where('pd.tglregistrasi', '>=', $filter['tglAwal'])
            // ->where('pd.tglregistrasi', '<=', $filter['tglAkhir'])
            ->where('pd.kdprofile', $kdProfile);
        if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
            $dataICD9 = $dataICD9->where('pd.noregistrasi', 'ilike', '%' . $filter['noreg'] . '%');
        }

        if (isset($filter['ispulang']) && $filter['ispulang'] == true) {
            if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
                $dataICD9 = $dataICD9->where('pd.tglpulang', '>=', $filter['tglAwal']);
            }
        } else {
            if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
                $dataICD9 = $dataICD9->where('pd.tglregistrasi', '>=', $filter['tglAwal']);
            }
        }

        if (isset($filter['ispulang']) && $filter['ispulang'] == true) {
            if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
                $tgl = $filter['tglAkhir']; //." 23:59:59";
                $dataICD9 = $dataICD9->where('pd.tglpulang', '<=', $tgl);
            }
        } else {

            if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
                $tgl = $filter['tglAkhir']; //." 23:59:59";
                $dataICD9 = $dataICD9->where('pd.tglregistrasi', '<=', $tgl);
            }
        }

        $dataICD9 = $dataICD9->get();
        foreach ($data as $item) {
            $data[$i]->jenis_rawat = 2;
            foreach ($kdDepartemenRawatInap as $kddept) {
                if ($kddept == $item->deptid) {
                    $data[$i]->jenis_rawat = 1;
                }
            }
            $dtdt = '';
            //            $dataICD9 = \DB::table('diagnosatindakanpasien_t as dpa')
            //                ->join('detaildiagnosatindakanpasien_t as dp', 'dpa.norec', '=', 'dp.objectdiagnosatindakanpasienfk')
            //                ->join('diagnosatindakan_m as dg', 'dg.id', '=', 'dp.objectdiagnosatindakanfk')
            //                ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'dpa.objectpasienfk')
            //                ->select('dg.kddiagnosatindakan')
            //                ->where('apd.noregistrasifk',$data[$i]->norec)
            //                ->get();
            foreach ($dataICD9 as $item2) {
                if ($item2->norec == $data[$i]->norec) {
                    $dtdt = $dtdt . '#' . $item2->kddiagnosatindakan;
                }
            }
            $data[$i]->icd9 = substr($dtdt, 1, strlen($dtdt) - 1);
            $i = $i + 1;
        }

        $tglawalawal = $filter['tglAwal'];
        $tglakhirakhir = $filter['tglAkhir'];
        $kelompokPasien = $filter['kelId'];
        $noregs = '';
        $norms = '';
        $namas = '';
        if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
            $noregs = " and pd.noregistrasi='$filter[noreg]'";
        }
        if (isset($filter['norm']) && $filter['norm'] != "" && $filter['norm'] != "undefined") {
            $norms = " and ps.nocm='$filter[norm]'";
        }
        if (isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $namas = " and ps.namapasien ilike '%" . $filter['nama'] . "%'";
        }

        if (isset($filter['ispulang']) && $filter['ispulang'] == true) {
            // if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $periode = " and pd.tglpulang >= '$tglawalawal' and pd.tglpulang <= '$tglakhirakhir' ";

            // }
        } else {
            $periode = " and pd.tglregistrasi >= '$tglawalawal' and pd.tglregistrasi <= '$tglakhirakhir' ";
            // }
        }

        $dataTarif16 = DB::select(
            DB::raw("select pd.norec, kpb.namaexternal
            from pasiendaftar_t as pd
            inner join pasien_m as ps on ps.id = pd.nocmfk
            INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
            INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
            INNER JOIN produk_m as pr on pr.id=pp.produkfk
            INNER JOIN kelompokprodukbpjs_m as kpb on kpb.id=pr.objectkelompokprodukbpjsfk
            left join kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
            left join batalregistrasi_t as br on br.pasiendaftarfk = pd.norec
            where br.norec is null   
            and pd.kdprofile=$kdProfile
            and kp.id in ($kelompokPasien) and  pr.id <> 402611
            $periode
            $noregs
            $namas
            $norms
            group  by pd.norec,kpb.namaexternal
            UNION ALL
            select pd.norec, 
            kpb.namaexternal
            from pasiendaftar_t as pd
            inner join pasien_m as ps on ps.id = pd.nocmfk
            INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
            INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
            INNER JOIN produk_m as pr on pr.id=pp.produkfk
            INNER JOIN kelompokprodukbpjs_m as kpb on kpb.id=16
            left join kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
            left join batalregistrasi_t as br on br.pasiendaftarfk = pd.norec
            where br.norec is null   
            and pd.kdprofile=$kdProfile
            and kp.id in ($kelompokPasien) and  pr.id <> 402611
            $periode
            $noregs
            $namas
            $norms
            group  by pd.norec,kpb.namaexternal
            ")
        );
        $i = 0;
        $prosedur_non_bedah = '';
        $prosedur_bedah = '';
        $konsultasi = '';
        $tenaga_ahli = '';
        $keperawatan = '';
        $penunjang = '';
        $radiologi = '';
        $laboratorium = '';
        $pelayanan_darah = '';
        $rehabilitasi = '';
        $kamar = '';
        $rawat_intensif = '';
        $obat = '';
        $obat_kronis = '';
        $obat_kemoterapi = '';
        $alkes = '';
        $bmhp = '';
        $sewa_alat = '';
        foreach ($data as $item) {
            $norecpd = $data[$i]->norec;
            // foreach ($dataTarif16 as $itm) {
            //     if ($itm->norec == $norecpd) {
            //         if ($itm->namaexternal == 'prosedur_non_bedah') {
            //             $prosedur_non_bedah = (float)$itm->ttl;
            //         }
            //         if ($itm->namaexternal == 'prosedur_bedah') {
            //             $prosedur_bedah = (float)$itm->ttl;
            //         }
            //         if ($itm->namaexternal == 'konsultasi') {
            //             // $konsultasi = (float)$itm->ttl;
            //         }
            //         if ($itm->namaexternal == 'tenaga_ahli') {
            //             $tenaga_ahli = (float)$itm->ttl;
            //         }
            //         if ($itm->namaexternal == 'keperawatan') {
            //             // $keperawatan = (float)$itm->ttl;
            //         }
            //         if ($itm->namaexternal == 'penunjang') {
            //             $penunjang = (float)$itm->ttl;
            //         }
            //         if ($itm->namaexternal == 'radiologi') {
            //             $radiologi = (float)$itm->ttl;
            //         }
            //         if ($itm->namaexternal == 'laboratorium') {
            //             $laboratorium = (float)$itm->ttl;
            //         }
            //         if ($itm->namaexternal == 'pelayanan_darah') {
            //             $pelayanan_darah = (float)$itm->ttl;
            //         }
            //         if ($itm->namaexternal == 'rehabilitasi') {
            //             $rehabilitasi = (float)$itm->ttl;
            //         }
            //         if ($itm->namaexternal == 'kamar') {
            //             $kamar = (float)$itm->ttl;
            //         }
            //         if ($itm->namaexternal == 'rawat_intensif') {
            //             $rawat_intensif = (float)$itm->ttl;
            //         }
            //         if ($itm->namaexternal == 'obat') {
            //             $obat = (float)$itm->ttl;
            //         }
            //         if ($itm->namaexternal == 'obat_kronis') {
            //             $obat_kronis = (float)$itm->ttl;
            //         }
            //         if ($itm->namaexternal == 'obat_kemoterapi') {
            //             $obat_kemoterapi = (float)$itm->ttl;
            //         }
            //         if ($itm->namaexternal == 'alkes') {
            //             $alkes = (float)$itm->ttl;
            //         }
            //         if ($itm->namaexternal == 'bmhp') {
            //             $bmhp = (float)$itm->ttl;
            //         }
            //         if ($itm->namaexternal == 'sewa_alat') {
            //             $sewa_alat = (float)$itm->ttl;
            //         }
            //     }
            // }

            // $datatatat = array(
            //     'prosedur_non_bedah' => (float)$prosedur_non_bedah,
            //     'prosedur_bedah' => (float)$prosedur_bedah,
            //     'konsultasi' => (float)$konsultasi,
            //     'tenaga_ahli' => (float)$tenaga_ahli,
            //     'keperawatan' => (float)$keperawatan,
            //     'penunjang' => (float)$penunjang,
            //     'radiologi' => (float)$radiologi,
            //     'laboratorium' => (float)$laboratorium,
            //     'pelayanan_darah' => (float)$pelayanan_darah,
            //     'rehabilitasi' => (float)$rehabilitasi,
            //     'kamar' => (float)$kamar,
            //     'rawat_intensif' => (float)$rawat_intensif,
            //     'obat' => (float)$obat,
            //     'obat_kronis' => (float)$obat_kronis,
            //     'obat_kemoterapi' => (float)$obat_kemoterapi,
            //     'alkes' => (float)$alkes,
            //     'bmhp' => (float)$bmhp,
            //     'sewa_alat' => (float)$sewa_alat,
            // );
            // $prosedur_non_bedah = 0;
            // $prosedur_bedah = 0;
            // $konsultasi = 0;
            // $tenaga_ahli = 0;
            // $keperawatan = 0;
            // $penunjang = 0;
            // $radiologi = 0;
            // $laboratorium = 0;
            // $pelayanan_darah = 0;
            // $rehabilitasi = 0;
            // $kamar = 0;
            // $rawat_intensif = 0;
            // $obat = 0;
            // $obat_kronis = 0;
            // $obat_kemoterapi = 0;
            // $alkes = 0;
            // $bmhp = 0;
            // $sewa_alat = 0;
            // $data[$i]->tarif_rs = $datatatat;

            // $i = $i + 1;
        }
        return $this->respond($data);
    }

    public function getListBerkasMonitoring(Request $r){
        $data = DB::select(DB::raw("SELECT * FROM dokklaim_m
            where statusenabled=true 
            and departemenfk='$r[dpid]'
            order by nourut
            "
        ));
        $cek = DB::table("dokklaim_t")->where('noregistrasifk',$r['noregistrasifk'])->get();
        $res['data'] = $data;
        $res['upload'] = $cek;
        return $this->respond($res);
    }

    public function getParameterDok(Request $request) {
        $noregistrasi = $request['noregistrasi'];
        $user = $request['user'];
        $dataDokasuransi = DB::table("dokklaim_m")
        ->where("id", $request['id'])
        ->where("statusenabled", true)
        ->first();

        try {
            $jsonData = json_decode($dataDokasuransi->config);
            $sql = str_replace('$noregistrasi', "$noregistrasi", $jsonData->sql);
            $sql = str_replace('$user', "$user", $sql);
            $config = collect(DB::select($sql));
            
            $result = [];
            foreach($config as $item) {
                $parameter = "?q=q";
                foreach($item as $fieldName => $fieldValue){
                    $parameter .= "&$fieldName=$fieldValue";
                }
                array_push($result, array(
                    "id" => $dataDokasuransi->id,
                    "param" => $parameter,
                    "namafile" => $dataDokasuransi->namaberkas,
                    "url" => $dataDokasuransi->url,
                    "noregistrasi" => $noregistrasi,
                ));
            }

            $result = array(
                'data' => $result,
            );

        } catch (\Exception $e) {
            $result = array(
                'data' => [],
            );
        }

        return $this->respond($result);
    }

    public function postDokumenKlaim(Request $request) 
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataReq = $request->all();

        // $request->validate([
        //      'fileBerkas'=>'required|mimes:pdf'
        // ]);

        $uploadBerkasPasien = $request->file('fileBerkas');
        $dataRegistrasi = PasienDaftar::where('norec', $dataReq['noregistrasifk'])->first();
        $path = 'dokumen_klaim/'.$dataRegistrasi->noregistrasi;

        DB::beginTransaction();
        try {
            if(is_array($uploadBerkasPasien)) {
                foreach($uploadBerkasPasien as $file) {
                    $extension = $file->getClientOriginalExtension();
                    $filename = $dataReq['namafile'].'_'.$dataRegistrasi->noregistrasi.'.'.$extension;

                    $dataInsert = array(
                        "norec" => substr(Uuid::generate(), 0, 32),
                        "kdprofile" => $idProfile,
                        "statusenabled" => true,
                        "filename" => $filename,
                        "filepath" => $path . '/' . $filename,
                        "nocmfk" => $dataRegistrasi->nocmfk,
                        "noregistrasifk" => $dataReq['noregistrasifk'],
                        "documentklaimfk" => $dataReq['documentklaimfk'],
                        "tglupload" => date('Y-m-d H:i:s'),
                    );
                    DB::table('dokklaim_t')->updateOrInsert(["filename" => $filename], $dataInsert);
                    $file->move(public_path($path), $filename);
                }
            } else {
                $extension = $uploadBerkasPasien->getClientOriginalExtension();
                $filename = $dataReq['namafile'].'_'.$dataRegistrasi->noregistrasi.'.'.$extension;

                $dataInsert = array(
                    "norec" => substr(Uuid::generate(), 0, 32),
                    "kdprofile" => $idProfile,
                    "statusenabled" => true,
                    "filename" => $filename,
                    "filepath" => $path.'/'.$filename,
                    "nocmfk" => $dataRegistrasi->nocmfk,
                    "noregistrasifk" => $dataReq['noregistrasifk'],
                    "documentklaimfk" => $dataReq['documentklaimfk'],
                    "tglupload" => date('Y-m-d H:i:s'),
                );
                DB::table('dokklaim_t')->updateOrInsert(["filename" => $filename], $dataInsert);
                $uploadBerkasPasien->move(public_path($path), $filename);
            }

            $transStatus = true;
        } catch (\Exception $e) {
            $transStatus = false;
        }

        if ($transStatus) {
            $transMessage = 'Simpan Berhasil';
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "dokumen" => $dataInsert,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function deleteDokumenKlaim(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        DB::beginTransaction();
        try {
            $dataRegistrasi = PasienDaftar::where('noregistrasi', $request['noregistrasi'])->first();
            $Dkmn = DB::table("dokklaim_t")
            ->where('noregistrasifk', $dataRegistrasi->norec)
            ->where('documentklaimfk',$request['documentklaimfk'])
            ->where('filename', $request['filename'])
            ->where('kdprofile',$idProfile)
            ->first();
            
            // delete file
            $path = public_path($Dkmn->filepath);
            if (\File::exists($Dkmn->filepath)){
                \File::delete($path);
            }

            // detele data
            DB::table("dokklaim_t")
            ->where('noregistrasifk', $dataRegistrasi->norec)
            ->where('documentklaimfk',$request['documentklaimfk'])
            ->where('filename', $request['filename'])
            ->where('kdprofile',$idProfile)
            ->delete();

            $transStatus = true;
        } catch (\Exception $e) {
            $transStatus = false;
        }

        if ($transStatus) {
            $transMessage = 'Hapus Berhasil';
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Hapus Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getTotalPasienPoliBPJS(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $tgl = $request->input('tglRegis');
        $idruangan = $request->input('idruangan');

        $data = \DB::table('pasiendaftar_t as pd')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganasalfk')
            ->where('pd.kdprofile', (int) $kdProfile)
            ->where('pd.statusenabled', true)
            ->where('pd.objectkelompokpasienlastfk', 2)
            ->whereRaw("to_char(pd.tglregistrasi, 'yyyy-MM-dd') = ?", [$tgl])
            ->where('ru.objectdepartemenfk', 18)
            ->where('ru.id', '=', $idruangan)
            ->selectRaw('COUNT(*) AS pasienterdaftar, pg.kddokterbpjs')
            ->groupBy('pg.kddokterbpjs')
            ->get();

        $result = array(
            'data' =>  $data,
            'msg' => '@epic'
        );
        return $this->respond($result);
    }

    public function getTotalPasienPoliUmum(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $tgl = $request->input('tglRegis');
        $idruangan = $request->input('idruangan');

        $data = \DB::table('pasiendaftar_t as pd')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganasalfk')
            ->where('pd.kdprofile', (int) $kdProfile)
            ->where('pd.statusenabled', true)
            ->where('pd.objectkelompokpasienlastfk' , '<>', 2)
            ->whereRaw("to_char(pd.tglregistrasi, 'yyyy-MM-dd') = ?", [$tgl])
            ->where('ru.objectdepartemenfk', 18)
            ->where('ru.id', '=', $idruangan)
            ->selectRaw('COUNT(*) AS pasienterdaftar, pg.kddokterbpjs')
            ->groupBy('pg.kddokterbpjs')
            ->get();

        $result = array(
            'data' =>  $data,
            'msg' => '@epic'
        );
        return $this->respond($result);
    }

    // Start IDRG
    // ICD10 IDRG
    public function getIcd10Idrg(Request $request)
        {
            $req = $request->all();
            $icdIX = \DB::table('diagnosaim_m as dg')
                ->select(
                    'dg.id',
                    'dg.kddiagnosa as kdDiagnosa',
                    'dg.kddiagnosa2 as kdDiagnosa2',
                    'dg.namadiagnosa as namaDiagnosa',
                    'dg.accpdx',
                    'dg.validcode',
                    'dg.asterisk',
                    'dg.im'
                )
                ->where('dg.statusenabled', true)
                ->where('dg.kodeexternal', 'ILIKE', '%IDRG%')
                ->orderBy('dg.kddiagnosa');

            if (
                isset($req['filter']['filters'][0]['value']) &&
                $req['filter']['filters'][0]['value'] != "" &&
                $req['filter']['filters'][0]['value'] != "undefined"
            ) {
                $icdIX = $icdIX->where(function ($q) use ($req) {
                    $val = $req['filter']['filters'][0]['value'];
                    $q->where('dg.namadiagnosa', 'ilike', '%' . $val . '%')
                        ->orWhere('dg.kddiagnosa2', 'ilike', '%' . $val . '%')
                        ->orWhere('dg.kddiagnosa', 'ilike', '%' . $val . '%');
                });
            }

            $icdIX = $icdIX->take(10)->get();

            $data = [];
            foreach ($icdIX as $item) {

                $nama = $item->namaDiagnosa;
                if ($item->asterisk == 1 || $item->asterisk === true) {
                    $nama .= "*";
                }

                $data[] = [
                    'id'                => $item->id,
                    'kdDiagnosa'        => $item->kdDiagnosa,
                    'kdDiagnosa2'       => $item->kdDiagnosa2,
                    'namaDiagnosa'      => $nama,
                    'kodeNamaDiagnosa'  => $item->kdDiagnosa . ' - ' . $nama . ' (accpdx ' . trim($item->accpdx) . ')',
                    'validcode'         => $item->validcode,
                    'accpdx'            => trim($item->accpdx),
                    'asterisk'          => $item->asterisk,
                    'im'                => $item->im
                ];
            }

            return $this->respond($data);
        }

    // Icd9 IDRG
    public function getIcd9IDRG(Request $request)
        {
        $req = $request->all();
            $icdIX = \DB::table('diagnosatindakanim_m as dg')
                ->select(
                    'dg.id',
                    'dg.kddiagnosatindakan as kdDiagnosaTindakan',
                    'dg.kddiagnosatindakan2 as kdDiagnosaTindakan2',
                    'dg.namadiagnosatindakan as namaDiagnosaTindakan',
                    'dg.validcode',
                    'dg.accpdx',
                    'asterisk',
                    'dg.im'                
                )
                ->where('dg.statusenabled', true)
                ->where('dg.kodeexternal', 'ilike','%IDRG%')
                ->orderBy('dg.kddiagnosatindakan');

            if (
                isset($req['filter']['filters'][0]['value']) &&
                $req['filter']['filters'][0]['value'] != "" &&
                $req['filter']['filters'][0]['value'] != "undefined"
            ) {
                $val = $req['filter']['filters'][0]['value'];
                $icdIX = $icdIX->where(function ($q) use ($val) {
                    $q->where('dg.namadiagnosatindakan', 'ilike', '%' . $val . '%')
                    ->orWhere('dg.kddiagnosatindakan', 'ilike', '%' . $val . '%')
                    ->orWhere('dg.kddiagnosatindakan2', 'ilike', '%' . $val . '%');
                });
            }

            $icdIX = $icdIX->take(10)->get();


            $data = [];
            foreach ($icdIX as $item) {
                $data[] = [
                    'id'                  => $item->id,
                    'kdDiagnosaTindakan'  => $item->kdDiagnosaTindakan,
                    'kdDiagnosaTindakan2' => $item->kdDiagnosaTindakan2,
                    'namaDiagnosaTindakan'=> $item->namaDiagnosaTindakan,
                    'kodeNamaDiagnosaTindakan' => $item->kdDiagnosaTindakan . ' - ' . $item->namaDiagnosaTindakan . ' (accpdx ' .$item->accpdx .')',
                    'validcode'           => $item->validcode,
                    'accpdx'              => $item->accpdx,
                    'asterisk'            => $item->asterisk,
                    'im'                  => $item->im
                ];
            }

            return $this->respond($data);
        }
    
    // Get diagnosa icd 10
 public function getIcd10PasienByNoreg(Request $request)
 {
    $kdProfile = $this->getDataKdProfile($request);
    $data = \DB::table('pasiendaftar_t as pd')
        ->select(
            'ddp.objectpegawaifk',
            'pg.namalengkap',
            'dg.id',
            'pd.noregistrasi',
            'pd.tglregistrasi',
            'apd.objectruanganfk',
            'ru.namaruangan',
            'apd.norec as norec_apd',
            'ddp.objectdiagnosafk',
            'dg.kddiagnosa',
            'dg.namadiagnosa',
            'ddp.objectjenisdiagnosafk',
            'jd.jenisdiagnosa',
            'dp.norec as norec_diagnosapasien',
            'ddp.norec as norec_detaildpasien',
            'dp.ketdiagnosis',
            'ddp.keterangan',
            'ddp.tglinputdiagnosa'
        )
        ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
        ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
        ->join('diagnosapasien_t as dp', 'dp.noregistrasifk', '=', 'apd.norec')
        ->join('detaildiagnosapasien_t as ddp', 'ddp.objectdiagnosapasienfk', '=', 'dp.norec')
        ->leftJoin('diagnosaim_m as dg', 'dg.id', '=', 'ddp.objectdiagnosafk')
        ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'ddp.objectpegawaifk')
        ->leftJoin('jenisdiagnosa_m as jd', 'jd.id', '=', 'ddp.objectjenisdiagnosafk')
        ->where('pd.kdprofile', (int)$kdProfile);

        if (isset($request['noReg']) && $request['noReg'] != "" && $request['noReg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $request['noReg']);
        };

        $data = $data->get();

        $result = array(
            'datas' => $data,
            'message' => 'Cepot',
        );
        return $this->respond($result);
    }

    // Get diagnosa icd 9
    public function getIcd9PasienByNoreg(Request $request)
    {
        $data = \DB::table('pasiendaftar_t as pd')
            ->select(
                'pd.noregistrasi',
                'pd.tglregistrasi',
                'apd.objectruanganfk',
                'ru.namaruangan',
                'apd.norec as norec_apd',
                'ddt.objectdiagnosatindakanfk',
                'ddt.multiplicity',
                'jd.jenisdiagnosa',
                'dt.kddiagnosatindakan',
                'dt.namadiagnosatindakan',
                'dtp.norec as norec_diagnosapasien',
                'ddt.norec as norec_detaildpasien',
                'dt.*',
                'ddt.keterangantindakan',
                'pg.namalengkap',
                'ddt.tglinputdiagnosa'
            )
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('diagnosatindakanpasien_t as dtp', 'dtp.objectpasienfk', '=', 'apd.norec')
            ->join('detaildiagnosatindakanpasien_t as ddt', 'ddt.objectdiagnosatindakanpasienfk', '=', 'dtp.norec')
            ->join('diagnosatindakanim_m as dt', 'dt.id', '=', 'ddt.objectdiagnosatindakanfk')
            ->leftJoin('jenisdiagnosa_m as jd', 'jd.id', '=', 'ddt.objectjenisdiagnosafk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'ddt.objectpegawaifk');
            
        if (isset($request['noCm']) && $request['noCm'] != "" && $request['noCm'] != "undefined") {
            $data = $data->where('ps.nocm', '=', $request['noReg']);
        };
        if (isset($request['noReg']) && $request['noReg'] != "" && $request['noReg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $request['noReg']);
        };
        if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
            $data = $data->where('apd.objectruanganfk', '=', $request['idDept']);
        };
        if (isset($request['kddiagnosatindakan']) && $request['kddiagnosatindakan'] != "" && $request['kddiagnosatindakan'] != "undefined") {
            $data = $data->where('dt.kddiagnosatindakan', '=', $request['kddiagnosatindakan']);
        }
        $data = $data->get();

        $result = array(
            'datas' => $data,
            'message' => 'giw@cepot',
        );
        return $this->respond($result);
    }

    public function getDiagnosaPasienIdrg(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idrg = [];
        $dtdt = '';

        $idrg = \DB::table('pasiendaftar_t as pd')
            ->select('dg.id', 'pd.noregistrasi', 'pd.tglregistrasi', 'apd.objectruanganfk', 'ru.namaruangan', 'apd.norec as norec_apd',
                'ddp.objectdiagnosafk', 'dg.kddiagnosa', 'dg.namadiagnosa', 'ddp.objectjenisdiagnosafk', 'jd.id as jd_id',
                'jd.jenisdiagnosa' ,'ddp.norec as norec_detaildpasien',
                'ddp.keterangan','ddp.tglinputdiagnosa','pg.namalengkap')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            // ->join('diagnosapasien_t as dp', 'dp.noregistrasifk', '=', 'apd.norec')
            ->join('detaildiagnosapasien_t as ddp', 'ddp.noregistrasifk', '=', 'apd.norec')
            ->leftJoin('diagnosa_m as dg', 'dg.id', '=', 'ddp.objectdiagnosafk')
            ->leftJoin('jenisdiagnosa_m as jd', 'jd.id', '=', 'ddp.objectjenisdiagnosafk')
            ->leftjoin('pegawai_m as pg','pg.id','=','ddp.objectpegawaifk')
            ->where('pd.kdprofile', (int)$kdProfile)
            ->where('pd.noregistrasi', '=', $request['noReg'])
            ->whereIn('jd.id', [15,16])
            ->orderBy('jd.id', 'asc')
            ->orderBy('ddp.tglinputdiagnosa', 'asc')->get();

        foreach ($idrg as $ina) {
            $dtdt = $dtdt . '#' .  $ina->kddiagnosa;
        }

        $icd10idrg =  substr($dtdt,1,strlen($dtdt)-1);

        $result = array(
            'idrg' => $idrg,
            'icd10idrg' => $icd10idrg,
            'message' => 'advt',
        );
        return $this->respond($result);
    }

    public function getDiagnosaPasienIdrgIcd9 ( Request $request) {
        $idrg = [];
        $dtdt = '';
        
        $idrg = \DB::table('pasiendaftar_t as pd')
            ->select('pd.noregistrasi', 'pd.tglregistrasi', 'apd.objectruanganfk', 'ru.namaruangan',
                'apd.norec as norec_apd', 'ddt.objectdiagnosatindakanfk', 'dt.kddiagnosatindakan', 'dt.namadiagnosatindakan',
                'dtp.norec as norec_diagnosapasien', 'ddt.ketdiagnosa','dt.id',
                'ddt.norec as norec_detaildpasien', 'dt.*','ddt.keterangantindakan','pg.namalengkap','ddt.tglinputdiagnosa','ddt.jumlah' )
            ->join('antrianpasiendiperiksa_t as apd','apd.noregistrasifk','=','pd.norec')
            ->join('ruangan_m as ru','ru.id','=','apd.objectruanganfk')
            ->join ('diagnosatindakanpasien_t as dtp','dtp.objectpasienfk','=','apd.norec')
            ->join ('detaildiagnosatindakanpasien_t as ddt','ddt.objectdiagnosatindakanpasienfk','=','dtp.norec')
            ->join ('diagnosatindakan_m as dt','dt.id','=','ddt.objectdiagnosatindakanfk')
            ->leftjoin('pegawai_m as pg','pg.id','=','ddt.objectpegawaifk')
            ->where('ddt.ketdiagnosa','=','iDRG')
            ->where('pd.noregistrasi','=', $request['noReg'])
            ->orderBy(DB::raw("ddt.tglinputdiagnosa"))->get();

        $dtdt = '';
        foreach ($idrg as $ina) {
            if ($ina->jumlah > 1) {
                $dtdt .= '#' . $ina->kddiagnosatindakan . '+' . $ina->jumlah;
            } else {
                $dtdt .= '#' . $ina->kddiagnosatindakan;
            }
        }
        
        
        $icd9idrg =  substr($dtdt,1,strlen($dtdt)-1);

        $result = array(
            'idrg' => $idrg,
            'icd9idrg' => $icd9idrg,
            'message' => 'advt',
        );
        return $this->respond($result);
    }

    public function getDaftarRiwayatRegistrasiNew(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $data = \DB::table('pasien_m as ps')
            ->join('pasiendaftar_t as pd','pd.nocmfk','=','ps.id')
            ->join('ruangan_m as ru','ru.id','=','pd.objectruanganlastfk')
            ->join('kelompokpasien_m as kp','kp.id','=','pd.objectkelompokpasienlastfk')
            // ->join('antrianpasiendiperiksa_t as apd', function($j){
            //     $j->on('apd.noregistrasifk','=','pd.norec')
            //     ->on('apd.objectruanganfk', '=','pd.objectruanganlastfk');
            // })
            ->leftjoin('pegawai_m as pg','pg.id','=','pd.objectpegawaifk')
            // ->leftjoin('detaildiagnosapasien_t AS ddp', function($join){
            //     $join->on('ddp.noregistrasifk','=','apd.norec')
            //         ->where('ddp.objectjenisdiagnosafk', '=', 1);
            // })
            // ->leftjoin('diagnosa_m As dg','dg.id','=','ddp.objectdiagnosafk')
            // ->leftJoin('batalregistrasi_t as br','br.pasiendaftarfk','=','pd.norec')
            // ->leftjoin('antrianpasiendiperiksa_t as apd','apd.noregistrasifk','=','pd.norec')
            ->select(DB::raw("pd.norec,pd.tglregistrasi,ps.nocm,pd.noregistrasi,ps.namapasien,pd.objectruanganlastfk,kp.kelompokpasien,ru.namaruangan,
                              pd.objectpegawaifk,pg.namalengkap as namadokter,pd.tglpulang,ru.objectdepartemenfk, null as diagnosa
			                  "))
            ->where('pd.statusenabled',true)
            ->where('ps.kdprofile', (int)$kdProfile)
            ->where('ps.nocm','=',$request['nocm'])
            ->where('ps.statusenabled',true)
            ->orderBy('pd.tglregistrasi','desc')
            ->distinct()
            ->get();

            // foreach ($data as $key => $d) {
            //     $d->namadiagnosa = $d->kddiagnosa .' - ' . $d->namadiagnosa;
            // }

            // $norec_pd = [];
            // foreach ($data as $d){
            //     $norec_pd[] = $d->norec;
            // }

            // $diagnosa = \DB::table('antrianpasiendiperiksa_t as apd')
            // ->leftjoin('detaildiagnosapasien_t AS ddp', function($join){
            //         $join->on('ddp.noregistrasifk','=','apd.norec')
            //             ->whereIn('ddp.objectjenisdiagnosafk',[1,2]);
            //     })
            // ->leftjoin('jenisdiagnosa_m as jd','jd.id','=','ddp.objectjenisdiagnosafk')
            // ->join('diagnosa_m as dg','dg.id','=', 'ddp.objectdiagnosafk')
            // ->select(DB::raw("dg.namadiagnosa, dg.kddiagnosa, jd.jenisdiagnosa, apd.noregistrasifk
            // "))
            // ->whereIn('apd.noregistrasifk',$norec_pd)
            // ->orderBy('ddp.objectjenisdiagnosafk','asc')
            // ->get();
            // // dd($diagnosa);
           
            
            // foreach ($data as $d){
            //     foreach ($diagnosa as $key => $dg) {
            //         if($dg->noregistrasifk == $d->norec){

            //             $d->diagnosa .= $dg->kddiagnosa. ' - '. $dg->namadiagnosa. ' (#'. $dg->jenisdiagnosa. '#) '. ', ';
            //             unset($diagnosa[$key]);
            //         }
            //     }
            // }

        $norec_pd = collect($data)->pluck('norec')->all();

        $diagnosa = \DB::table('antrianpasiendiperiksa_t as apd')
            ->leftJoin('detaildiagnosapasien_t AS ddp', function($join) {
                $join->on('ddp.noregistrasifk', '=', 'apd.norec')
                    ->whereIn('ddp.objectjenisdiagnosafk', [1, 2]);
            })
            ->leftJoin('jenisdiagnosa_m as jd', 'jd.id', '=', 'ddp.objectjenisdiagnosafk')
            ->join('diagnosa_m as dg', 'dg.id', '=', 'ddp.objectdiagnosafk')
            ->select('dg.namadiagnosa', 'dg.kddiagnosa', 'jd.jenisdiagnosa', 'apd.noregistrasifk')
            ->whereIn('apd.noregistrasifk', $norec_pd)
            ->orderBy('ddp.objectjenisdiagnosafk', 'asc')
            ->get();

            $diagnosaGrouped = collect($diagnosa)->groupBy('noregistrasifk');

        foreach ($data as $d) {
            if (isset($diagnosaGrouped[$d->norec])) {
                $diagnosaList = $diagnosaGrouped[$d->norec]->map(function($dg) {
                    return $dg->kddiagnosa . ' - ' . $dg->namadiagnosa . ' (#' . $dg->jenisdiagnosa . '#)';
                })->implode(', ');

                $d->diagnosa = $diagnosaList;
            }
        }


        $result = array(
            'data' => $data,//array_merge($data,$data2),
            // 'data2' =>$data2,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getDiagnosaAll(Request $request){
        $req = $request->all();
        $icdIX = \DB::table('diagnosa_m as dg')
            ->select('dg.id', 'dg.kddiagnosa', 'dg.namadiagnosa','dg.kddiagnosa as kdDiagnosa','dg.namadiagnosa as namaDiagnosa')
            ->where('dg.statusenabled', true)
            ->where('dg.kodeexternal', 'IDRG')
            ->orderBy('dg.kddiagnosa');

        if (isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined"
        ) {
            $filterValue = str_replace('.', '', $req['filter']['filters'][0]['value']);

            $icdIX = $icdIX->where(function ($q) use ($filterValue) {
                $q->whereRaw("REPLACE(dg.kddiagnosa, '.', '') ILIKE ?", ["%{$filterValue}%"])
                ->orWhereRaw("REPLACE(dg.namadiagnosa, '.', '') ILIKE ?", ["%{$filterValue}%"]);
            })
            // $icdIX = $icdIX
            //     ->where(function ($q) use ($req) {
            //         $q->where('dg.namadiagnosa', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%')
            //         ->orWhere('dg.kddiagnosa', 'ilike', $req['filter']['filters'][0]['value'] . '%');
            //     })
                ->where('dg.statusenabled', true);
        }

        $icdIX = $icdIX->take(10);
        $icdIX = $icdIX->get();

        $data = [];
        if (count($icdIX) > 0) {
            foreach ($icdIX as $item) {
                $data [] = array(
                    'kodeNama' => $item->kdDiagnosa . ' - ' . $item->namaDiagnosa,
                    'id' => $item->id,
                    'kdDiagnosa' => $item->kdDiagnosa,
                    'namaDiagnosa' => $item->namaDiagnosa,

                );

            }
        }

        return $this->respond($data);
    } 

    public function getIcd9All(Request $request)
    {
        $req = $request->all();
        $icdIX = \DB::table('diagnosatindakan_m as dg')
            ->select('dg.id','dg.kddiagnosatindakan as kdDiagnosaTindakan','dg.namadiagnosatindakan as namaDiagnosaTindakan')
            ->where('dg.statusenabled', true)
            ->where('dg.kodeexternal', 'IDRG')
            ->orderBy('dg.kddiagnosatindakan');

        if(isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value']!="" &&
            $req['filter']['filters'][0]['value']!="undefined"){
                $filterValue = str_replace('.', '', $req['filter']['filters'][0]['value']);
                $icdIX = $icdIX->where(function($q) use ($filterValue) {
                        $q->whereRaw("REPLACE(dg.kddiagnosatindakan, '.', '') ILIKE ?", ["%{$filterValue}%"])
                        ->orWhereRaw("REPLACE(dg.namadiagnosatindakan, '.', '') ILIKE ?", ["%{$filterValue}%"]);
                })
            // $icdIX = $icdIX
            //     ->where(function($q) use ($req) {
            //         $q->where('dg.namadiagnosatindakan', 'ilike', '%'.$req['filter']['filters'][0]['value'].'%')
            //         ->orWhere('dg.kddiagnosatindakan', 'ilike', $req['filter']['filters'][0]['value'].'%');
            //     })
                ->where('dg.statusenabled', true);
        }


        $icdIX=$icdIX->take(10);
        $icdIX=$icdIX->get();

        $data = [];
        if (count($icdIX) > 0) {
            foreach ($icdIX as $item) {
                $data [] = array(
                    'kdNama' => $item->kdDiagnosaTindakan . ' - ' . $item->namaDiagnosaTindakan,
                    'id' => $item->id,
                    'kdDiagnosaTindakan' => $item->kdDiagnosaTindakan,
                    'namaDiagnosaTindakan' => $item->namaDiagnosaTindakan,

                );

            }
        }

        return $this->respond($data);
    }

    public function saveDiagnosaPasiendua(Request $request) {
        $dataLogin = $request->all();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        DB::beginTransaction();
//        try{
        $dataPegawaiUser = DB::select(DB::raw("select pg.id,pg.namalengkap from loginuser_s as lu
                INNER JOIN pegawai_m as pg on lu.objectpegawaifk=pg.id
                where pg.kdprofile = $idProfile and lu.id=:idLoginUser"),
            array(
                'idLoginUser' => $dataLogin['userData']['id'],
            )
        );
        if ($request['detaildiagnosapasien']['norec_dp']=='' && $request['detaildiagnosapasien']['norec_ddp'] ==''){
            $dataDiagnosa = new DiagnosaPasien();
            $dataDiagnosa->norec = $dataDiagnosa->generateNewId();
            $dataDiagnosa->kdprofile = $idProfile;
            $dataDiagnosa->statusenabled = true;

        }else{
            $datadd =  DetailDiagnosaPasien::where('norec',$request['detaildiagnosapasien']['norec_ddp'])->first();
            $dataDiagnosa =  DiagnosaPasien::where('norec',$datadd->objectdiagnosapasienfk)->first();
        }

        $dataDiagnosa->noregistrasifk =  $request['detaildiagnosapasien']['noregistrasifk'];
        $dataDiagnosa->ketdiagnosis =  'Diagnosa Pasien';
        $dataDiagnosa->tglregistrasi = null;
        $dataDiagnosa->tglpendaftaran = $request['detaildiagnosapasien']['tglregistrasi'];
        if(isset($request['detaildiagnosapasien']['kasusbaru'])){
            $dataDiagnosa->iskasusbaru = $request['detaildiagnosapasien']['kasusbaru'];
        }
        if(isset($request['detaildiagnosapasien']['kasuslama'])){
            $dataDiagnosa->iskasuslama = $request['detaildiagnosapasien']['kasuslama'];
        }
        try{
            $dataDiagnosa->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan Diagnosa Baru";
        }


        if ($request['detaildiagnosapasien']['norec_dp']=='' && $request['detaildiagnosapasien']['norec_ddp'] =='')
        {
            $dataDetailDiagnosa = new DetailDiagnosaPasien();
            $dataDetailDiagnosa->norec = $dataDetailDiagnosa->generateNewId();
            $dataDetailDiagnosa->kdprofile = $idProfile;
            $dataDetailDiagnosa->statusenabled = true;
//               $dataDetailDiagnosa->keterangan = '-';
            $dataDetailDiagnosa->objectpegawaifk = $dataPegawaiUser[0]->id;// $this->getCurrentLoginID();

        }else{
            $dataDetailDiagnosa =  DetailDiagnosaPasien::where('norec',$request['detaildiagnosapasien']['norec_ddp'])->first();
        }

        $dataDetailDiagnosa->noregistrasifk =  $request['detaildiagnosapasien']['noregistrasifk'];
        $dataDetailDiagnosa->tglregistrasi = $request['detaildiagnosapasien']['tglregistrasi'];
        $dataDetailDiagnosa->norec = $dataDetailDiagnosa->generateNewId();
        $dataDetailDiagnosa->objectdiagnosafk = $request['detaildiagnosapasien']['objectdiagnosafk'];
        $dataDetailDiagnosa->objectdiagnosapasienfk = $dataDiagnosa->norec;
        $dataDetailDiagnosa->objectjenisdiagnosafk = $request['detaildiagnosapasien']['objectjenisdiagnosafk'];
        $dataDetailDiagnosa->tglinputdiagnosa = date('Y-m-d H:i:s');//$request['detaildiagnosapasien']['tglinputdiagnosa'];
        $dataDetailDiagnosa->keterangan = $request['detaildiagnosapasien']['keterangan'];
        $dataDetailDiagnosa->objectpegawaifk = $dataPegawaiUser[0]->id;// $this->getCurrentLoginID();


        try{
            $dataDetailDiagnosa->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan Pasien Baru";
        }

        if ($transStatus == 'true'){
            $pd = DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd','apd.noregistrasifk','=','pd.norec')
            ->select('pd.noregistrasi','objectruanganlastfk')
            ->where('apd.norec',$request['detaildiagnosapasien']['noregistrasifk'])
            ->first();

            $dataDiagnosa = \DB::table('detaildiagnosapasien_t as dp')
            ->join('diagnosa_m as dg', 'dg.id', '=', 'dp.objectdiagnosafk')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'dp.noregistrasifk')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->select('dg.kddiagnosa','pd.norec')
//            ->where('apd.noregistrasifk',$data[$i]->norec)
            ->wherein('dp.objectjenisdiagnosafk',array(7,8))
            // ->where('pd.tglregistrasi', '>=', $filter['tglAwal'])
            // ->where('pd.tglregistrasi', '<=', $filter['tglAkhir'])
            ->where('pd.kdprofile',$kdProfile)
            ->where('pd.noregistrasi',$pd->noregistrasi)
            ->orderBy('dp.objectjenisdiagnosafk', 'asc')
            ->orderBy('dp.tglinputdiagnosa')->get();
            
            $dtdt1 = '';
            foreach ($dataDiagnosa as $item2){
                    $dtdt1 = $dtdt1 . '#' .  $item2->kddiagnosa;
            }
           
            try{
                $updatePd =  PasienDaftar::where('noregistrasi', $pd->noregistrasi)
                ->update([
                        'icd10' => $dtdt1,
                    ]
                );
                $transStatus = 'true';
            } catch (\Exception $e) {
                $transStatus = 'false';
                $transMessage = "-";
            }
        }
        if ($transStatus == 'true') {
            $transMessage = "Data Tersimpan";
            DB::commit();
            $ihs = null;
            if($pd->objectruanganlastfk == 819) {
                $objetoRequest = new \Illuminate\Http\Request();
                $objetoRequest ['noregistrasi']= $pd->noregistrasi;
                $objetoRequest ['inacbg']=true;
                $ihs = app('App\Http\Controllers\Bridging\IHSController')->Condition($objetoRequest,true);
            }
          
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'data' => $dataDiagnosa,
                'Condition'=> isset($ihs)? $ihs :null,
                'as' => 'egie@ramdan',
            );
        } else {
            $transMessage = "Data Gagal Disimpan";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'data' =>$dataDiagnosa,
                'error' => $e,
                'as' => 'egie@ramdan',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }

    public function getDiagnosa10Im(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);

        $data = \DB::table('diagnosaim_m as dg')
            ->select(
                'dg.accpdx',
                'dg.validcode',
                'dg.kddiagnosa',
                'dg.namadiagnosa'
            )
            ->where('dg.kdprofile', '=', $kdProfile)
            ->where('dg.statusenabled', '=', true)
            ->where('dg.kddiagnosa', '=', $request['kddiagnosa'])
            ->first();

        $result = array(
            'diagnosa' => $data
        );

        return $this->respond($result);
    }

    public function getDiagnosa9Im(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);

        $data = \DB::table('diagnosatindakanim_m as dg')
            ->select(
                'dg.accpdx',
                'dg.validcode',
                'dg.kddiagnosatindakan',
                'dg.namadiagnosatindakan'
            )
            ->where('dg.kdprofile', '=', $kdProfile)
            ->where('dg.statusenabled', '=', true)
            ->where('dg.kddiagnosatindakan', '=', $request['kddiagnosatindakan'])
            ->first();

        $result = array(
            'diagnosatindakan' => $data
        );

        return $this->respond($result);
    }

    public function saveImportIdrg(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin = $request->all();
        DB::beginTransaction();
        $data = \DB::table('pasiendaftar_t as pd')
            ->select('dg.id as id_diagnosa', 'pd.noregistrasi','ddp.norec as norec_ddp','pd.tglregistrasi',
                'dg.kddiagnosa', 'dg.namadiagnosa','jd.id as jd_id')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('diagnosapasien_t as dp', 'dp.noregistrasifk', '=', 'apd.norec')
            ->join('detaildiagnosapasien_t as ddp', 'ddp.objectdiagnosapasienfk', '=', 'dp.norec')
            ->leftJoin('diagnosa_m as dg', 'dg.id', '=', 'ddp.objectdiagnosafk')
            ->leftJoin('jenisdiagnosa_m as jd', 'jd.id', '=', 'ddp.objectjenisdiagnosafk')
            // ->leftjoin('pegawai_m as pg','pg.id','=','ddp.objectpegawaifk')
            ->where('pd.kdprofile', (int)$kdProfile);


            $data = $data->where('pd.norec', $request['norec_pd']);
        
        $data = $data->whereIn('jd.id', [15,16])->orderBy('ddp.tglinputdiagnosa', 'asc')->get();

        $dataIcd9 = \DB::table('pasiendaftar_t as pd')
            ->select('pd.noregistrasi', 'pd.tglregistrasi','ddt.norec as norec_ddt','dt.id as id_diagnosa','ddt.keterangantindakan' )
            ->join('antrianpasiendiperiksa_t as apd','apd.noregistrasifk','=','pd.norec')
            ->join ('diagnosatindakanpasien_t as dtp','dtp.objectpasienfk','=','apd.norec')
            ->join ('detaildiagnosatindakanpasien_t as ddt','ddt.objectdiagnosatindakanpasienfk','=','dtp.norec')
            ->join ('diagnosatindakan_m as dt','dt.id','=','ddt.objectdiagnosatindakanfk')
            // ->leftjoin('pegawai_m as pg','pg.id','=','ddt.objectpegawaifk')
            ->where('ddt.ketdiagnosa','iDRG')
            ->where('pd.norec',$request['norec_pd'])
            ->orderBy('ddt.tglinputdiagnosa')
            ->get();

            if (isset($request['norec_pd'])) {
                $dataicd10inacbg = \DB::table('detaildiagnosapasien_t as ddp')
                ->join('antrianpasiendiperiksa_t as apd','apd.norec','=','ddp.noregistrasifk')
                ->join('pasiendaftar_t as pd','pd.norec','=','apd.noregistrasifk')
                ->select('ddp.norec as norec_ddp','ddp.objectdiagnosapasienfk')
                ->where('pd.kdprofile', (int)$kdProfile)
                ->whereIn('ddp.objectjenisdiagnosafk', [17,18])->where('pd.norec', $request['norec_pd'])->get();

                $dataicd9inacbg = \DB::table('detaildiagnosatindakanpasien_t as ddt')
                ->join ('diagnosatindakanpasien_t as dtp','dtp.norec','=','ddt.objectdiagnosatindakanpasienfk')
                ->join('antrianpasiendiperiksa_t as apd','apd.norec','=','dtp.objectpasienfk')
                ->join('pasiendaftar_t as pd','pd.norec','=','apd.noregistrasifk')
                ->select('ddt.norec as norec_ddt','dtp.norec as norec_dtp')
                ->where('pd.kdprofile', (int)$kdProfile)
                ->where('ddt.ketdiagnosa', 'INAcbg')->where('pd.norec', $request['norec_pd'])->get();
            }
            
            // return $dataicd9inacbg;

            $norecDdpArray = array_unique(array_map(function($item) {
                return $item->norec_ddp;
            }, $dataicd10inacbg));

            $objectdiagnosapasienfkArray = array_unique(array_map(function($item) {
                return $item->objectdiagnosapasienfk;
            }, $dataicd10inacbg));

            $norecDdtArray = array_unique(array_map(function($item) {
                return $item->norec_ddt;
            }, $dataicd9inacbg));

            $norecDtpArray = array_unique(array_map(function($item) {
                return $item->norec_dtp;
            }, $dataicd9inacbg));
        // return $dataIcd9;
        try{

            if(count($data) > 0){
                if ($norecDdpArray) {
                    DetailDiagnosaPasien::whereIn('norec', $norecDdpArray)->where('kdprofile', $idProfile)->delete();
                }
                
                if ($objectdiagnosapasienfkArray) {
                    DiagnosaPasien::whereIn('norec',$objectdiagnosapasienfkArray)->where('kdprofile', $idProfile)->delete();
                }

                if ($norecDdtArray) {
                    DetailDiagnosaTindakanPasien::wherein('norec', $norecDdtArray)->delete();
                }
                if ($norecDtpArray) {
                    DiagnosaTindakanPasien::wherein('norec', $norecDtpArray)->delete();
                }

                $tglInput = Carbon::now();
                foreach($data as $d){
                    $dataDiagnosa = new DiagnosaPasien();
                    $dataDiagnosa->norec = $dataDiagnosa->generateNewId();
                    $dataDiagnosa->kdprofile = $idProfile;
                    $dataDiagnosa->statusenabled = true;
                    $dataDiagnosa->noregistrasifk =  $request['noregistrasifk'];
                    $dataDiagnosa->ketdiagnosis =  'Diagnosa Pasien';
                    $dataDiagnosa->tglregistrasi = null;
                    $dataDiagnosa->tglpendaftaran = $request['tglregistrasi'];
                    $dataDiagnosa->save();

                    $dataDetailDiagnosa = new DetailDiagnosaPasien();
                    $dataDetailDiagnosa->norec = $dataDetailDiagnosa->generateNewId();
                    $dataDetailDiagnosa->kdprofile = $idProfile;
                    $dataDetailDiagnosa->statusenabled = true;
                    $dataDetailDiagnosa->objectpegawaifk =  $this->getCurrentUserID();// $this->getCurrentLoginID();
                    $dataDetailDiagnosa->noregistrasifk =  $request['noregistrasifk'];
                    $dataDetailDiagnosa->tglregistrasi = $request['tglregistrasi'];
                    $dataDetailDiagnosa->norec = $dataDetailDiagnosa->generateNewId();
                    $dataDetailDiagnosa->objectdiagnosafk = $d->id_diagnosa;
                    $dataDetailDiagnosa->objectdiagnosapasienfk = $dataDiagnosa->norec;
                    if ($d->jd_id == 15) {
                        $dataDetailDiagnosa->objectjenisdiagnosafk = 17;
                    } else {
                        $dataDetailDiagnosa->objectjenisdiagnosafk = 18;
                    }
                    $dataDetailDiagnosa->tglinputdiagnosa = $tglInput->format('Y-m-d H:i:s');//$request['detaildiagnosapasien']['tglinputdiagnosa'];
                    $dataDetailDiagnosa->objectpegawaifk =  $this->getCurrentUserID();

                    $dataDetailDiagnosa->save();

                    $tglInput->addSeconds(3);
                }

                $dataDiagnosa = \DB::table('detaildiagnosapasien_t as dp')
                    ->join('diagnosa_m as dg', 'dg.id', '=', 'dp.objectdiagnosafk')
                    ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'dp.noregistrasifk')
                    ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                    ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                    ->select('dg.kddiagnosa','pd.norec')
        //            ->where('apd.noregistrasifk',$data[$i]->norec)
                    ->wherein('dp.objectjenisdiagnosafk',array(17,18))
                    // ->where('pd.tglregistrasi', '>=', $filter['tglAwal'])
                    // ->where('pd.tglregistrasi', '<=', $filter['tglAkhir'])
                    ->where('pd.kdprofile',$kdProfile)
                    ->where('pd.norec',$request['norec_pd'])
                    ->orderBy('dp.objectjenisdiagnosafk', 'asc')
                    ->orderBy('dp.tglinputdiagnosa')->get();
                    
                    $dtdt1 = '';
                    foreach ($dataDiagnosa as $item2){
                            $dtdt1 = $dtdt1 . '#' .  $item2->kddiagnosa;
                    }
           
                    $updatePd =  PasienDaftar::where('norec', $request['norec_pd'])
                    ->update([
                            'icd10' => $dtdt1,
                        ]
                    );

                $logUser = new LoggingUserRev();        
                $logUser->norec = $logUser->generateNewId();
                $logUser->kdprofile= (int)$kdProfile;
                $logUser->statusenabled=true;
                $logUser->jenislog = 'Import ICD 10 iDRG';
                $logUser->noreff =$request['noregistrasi'];
                $logUser->referensi='noregistrasi';
                $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
                $logUser->tanggal = date('Y-m-d H:i:s');
                $logUser->keterangan = 'Import ICD 10 iDRG ke INACBG '. $request['noregistrasi'];
                $logUser->save();
            }

            if(count($dataIcd9) > 0){
                $tglInput = Carbon::now();

                foreach ($dataIcd9 as $row) {
                    $dataDiagnosaIcd9 = new DiagnosaTindakanPasien();
                    $dataDiagnosaIcd9->norec = $dataDiagnosaIcd9->generateNewId();
                    $dataDiagnosaIcd9->kdprofile = $idProfile;
                    $dataDiagnosaIcd9->statusenabled = true;
                    $dataDiagnosaIcd9->objectpasienfk = $request['noregistrasifk'];
                    $dataDiagnosaIcd9->tglpendaftaran = $request['tglregistrasi'];
                    $dataDiagnosaIcd9->save();

                    $dataDetailDiagnosaIcd9 = new DetailDiagnosaTindakanPasien();
                    $dataDetailDiagnosaIcd9->norec = $dataDetailDiagnosaIcd9->generateNewId();
                    $dataDetailDiagnosaIcd9->kdprofile = $idProfile;
                    $dataDetailDiagnosaIcd9->statusenabled = true;
                    $dataDetailDiagnosaIcd9->objectpegawaifk = $this->getCurrentUserID();
                    $dataDetailDiagnosaIcd9->ketdiagnosa = 'INAcbg';
                    $dataDetailDiagnosaIcd9->objectdiagnosatindakanfk = $row->id_diagnosa;
                    $dataDetailDiagnosaIcd9->objectdiagnosatindakanpasienfk = $dataDiagnosaIcd9->norec;
                    $dataDetailDiagnosaIcd9->jumlah = null;
                    $dataDetailDiagnosaIcd9->keterangantindakan = '-';
                    
                    $dataDetailDiagnosaIcd9->tglinputdiagnosa = $tglInput->format('Y-m-d H:i:s');

                    $dataDetailDiagnosaIcd9->save();

                    
                    $tglInput->addSeconds(3);
                }

                $logUser = new LoggingUserRev();        
                $logUser->norec = $logUser->generateNewId();
                $logUser->kdprofile= (int)$kdProfile;
                $logUser->statusenabled=true;
                $logUser->jenislog = 'Import ICD 9 iDRG';
                $logUser->noreff =$request['noregistrasi'];
                $logUser->referensi='noregistrasi';
                $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
                $logUser->tanggal = date('Y-m-d H:i:s');
                $logUser->keterangan = 'Import ICD 9 iDRG ke INACBG '. $request['noregistrasi'];
                $logUser->save();
            }

            if(count($data) == 0 && count($dataIcd9) == 0){
                $transMessage = "Tidak ada data yang di import";
            }

            
            $transMessage = "Import Berhasil";
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            // $transMessage = "Import Berhasil";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'madep',
            );
        } else {
            $transMessage = "Import gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'madep',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveDiagnosaPasienImport(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int)$kdProfile;
        $dataLogin = $request->all();
        DB::beginTransaction();
        try {
            $dataDetail = $request['detaildiagnosapasien'];
            $noregistrasifk = $dataDetail['noregistrasifk']; // APD norec
            $tglregistrasi = $dataDetail['tglregistrasi'];
            $dataImport = $dataDetail['data'];
            $jenistype = isset($dataDetail['jenistype']) ? $dataDetail['jenistype'] : 'INAcbg';

            $jenisPrimer = ($jenistype == 'iDRG') ? 15 : 17;
            $jenisSekunder = ($jenistype == 'iDRG') ? 16 : 18;

            $existing = \DB::table('detaildiagnosapasien_t as ddp')
                ->select('ddp.norec', 'ddp.objectdiagnosapasienfk')
                ->where('ddp.kdprofile', $idProfile)
                ->where('ddp.noregistrasifk', $noregistrasifk)
                ->whereIn('ddp.objectjenisdiagnosafk', [$jenisPrimer, $jenisSekunder])
                ->get();

            if (count($existing) > 0) {
                $norecDdpArray = array_column($existing, 'norec');
                $objectdiagnosapasienfkArray = array_column($existing, 'objectdiagnosapasienfk');
                DetailDiagnosaPasien::whereIn('norec', $norecDdpArray)->where('kdprofile', $idProfile)->delete();
                DiagnosaPasien::whereIn('norec', $objectdiagnosapasienfkArray)->where('kdprofile', $idProfile)->delete();
            }

            $tglInput = Carbon::now();
            foreach ($dataImport as $d) {
                $idDiagnosa = null;
                if (isset($d['id'])) {
                    $idDiagnosa = $d['id'];
                } else {
                    $dg = \DB::table('diagnosa_m')->where('kddiagnosa', $d['kddiagnosa'])->where('kdprofile', $idProfile)->first();
                    if ($dg) {
                        $idDiagnosa = $dg->id;
                    }
                }

                if ($idDiagnosa) {
                    $dataDiagnosa = new DiagnosaPasien();
                    $dataDiagnosa->norec = $dataDiagnosa->generateNewId();
                    $dataDiagnosa->kdprofile = $idProfile;
                    $dataDiagnosa->statusenabled = true;
                    $dataDiagnosa->noregistrasifk = $noregistrasifk;
                    $dataDiagnosa->ketdiagnosis = 'Diagnosa Pasien';
                    $dataDiagnosa->tglpendaftaran = $tglregistrasi;
                    $dataDiagnosa->save();

                    $dataDetailDiagnosa = new DetailDiagnosaPasien();
                    $dataDetailDiagnosa->norec = $dataDetailDiagnosa->generateNewId();
                    $dataDetailDiagnosa->kdprofile = $idProfile;
                    $dataDetailDiagnosa->statusenabled = true;
                    $dataDetailDiagnosa->objectpegawaifk = $this->getCurrentUserID();
                    $dataDetailDiagnosa->noregistrasifk = $noregistrasifk;
                    $dataDetailDiagnosa->tglregistrasi = $tglregistrasi;
                    $dataDetailDiagnosa->objectdiagnosafk = $idDiagnosa;
                    $dataDetailDiagnosa->objectdiagnosapasienfk = $dataDiagnosa->norec;
                    $dataDetailDiagnosa->objectjenisdiagnosafk = (isset($d['type']) && $d['type'] == 'Primer') ? $jenisPrimer : $jenisSekunder;
                    $dataDetailDiagnosa->tglinputdiagnosa = $tglInput->format('Y-m-d H:i:s');
                    $dataDetailDiagnosa->save();
                    
                    $tglInput->addSeconds(2);
                }
            }

            $pd = \DB::table('antrianpasiendiperiksa_t')->where('norec', $noregistrasifk)->first();
            if ($pd) {
                $dataDiagnosaRows = \DB::table('detaildiagnosapasien_t as dp')
                    ->join('diagnosa_m as dg', 'dg.id', '=', 'dp.objectdiagnosafk')
                    ->select('dg.kddiagnosa')
                    ->where('dp.kdprofile', $idProfile)
                    ->where('dp.noregistrasifk', $noregistrasifk)
                    ->whereIn('dp.objectjenisdiagnosafk', [$jenisPrimer, $jenisSekunder])
                    ->orderBy('dp.objectjenisdiagnosafk', 'asc')
                    ->orderBy('dp.tglinputdiagnosa', 'asc')
                    ->get();
                
                $icd10Str = '';
                foreach ($dataDiagnosaRows as $it) {
                    $icd10Str .= ($icd10Str == '' ? '' : '#') . $it->kddiagnosa;
                }
                PasienDaftar::where('norec', $pd->noregistrasifk)->update(['icd10' => $icd10Str]);
            }

            DB::commit();
            $result = array('status' => 201, 'message' => 'Simpan Berhasil');
        } catch (\Exception $e) {
            DB::rollBack();
            $result = array('status' => 400, 'message' => $e->getMessage());
        }
        return $this->setStatusCode($result['status'])->respond($result, $result['message']);
    }

    public function saveDiagnosaTindakanPasienImport(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int)$kdProfile;
        DB::beginTransaction();
        try {
            $dataDetail = $request['detaildiagnosatindakanpasien'];
            $noregistrasifk = $dataDetail['objectpasienfk']; // APD norec
            $tglregistrasi = $dataDetail['tglpendaftaran'];
            $dataImport = $dataDetail['data'];
            $ketdiagnosa = isset($dataDetail['ketdiagnosa']) ? $dataDetail['ketdiagnosa'] : 'INAcbg';

            $existing = \DB::table('detaildiagnosatindakanpasien_t as ddt')
                ->join('diagnosatindakanpasien_t as dtp', 'dtp.norec', '=', 'ddt.objectdiagnosatindakanpasienfk')
                ->select('ddt.norec', 'dtp.norec as norec_dtp')
                ->where('ddt.kdprofile', $idProfile)
                ->where('dtp.objectpasienfk', $noregistrasifk)
                ->where('ddt.ketdiagnosa', $ketdiagnosa)
                ->get();

            if (count($existing) > 0) {
                $norecDdtArray = array_column($existing, 'norec');
                $norecDtpArray = array_column($existing, 'norec_dtp');
                DetailDiagnosaTindakanPasien::whereIn('norec', $norecDdtArray)->where('kdprofile', $idProfile)->delete();
                DiagnosaTindakanPasien::whereIn('norec', $norecDtpArray)->where('kdprofile', $idProfile)->delete();
            }

            $tglInput = Carbon::now();
            foreach ($dataImport as $d) {
                $idProc = null;
                if (isset($d['id'])) {
                    $idProc = $d['id'];
                } else if (isset($d['kddiagnosatindakan'])) {
                    $dg = \DB::table('diagnosatindakan_m')->where('kddiagnosatindakan', $d['kddiagnosatindakan'])->where('kdprofile', $idProfile)->first();
                    if ($dg) {
                        $idProc = $dg->id;
                    }
                }

                if ($idProc) {
                    $dataDiagnosaIcd9 = new DiagnosaTindakanPasien();
                    $dataDiagnosaIcd9->norec = $dataDiagnosaIcd9->generateNewId();
                    $dataDiagnosaIcd9->kdprofile = $idProfile;
                    $dataDiagnosaIcd9->statusenabled = true;
                    $dataDiagnosaIcd9->objectpasienfk = $noregistrasifk;
                    $dataDiagnosaIcd9->tglpendaftaran = $tglregistrasi;
                    $dataDiagnosaIcd9->save();

                    $dataDetailDiagnosaIcd9 = new DetailDiagnosaTindakanPasien();
                    $dataDetailDiagnosaIcd9->norec = $dataDetailDiagnosaIcd9->generateNewId();
                    $dataDetailDiagnosaIcd9->kdprofile = $idProfile;
                    $dataDetailDiagnosaIcd9->statusenabled = true;
                    $dataDetailDiagnosaIcd9->objectpegawaifk = $this->getCurrentUserID();
                    $dataDetailDiagnosaIcd9->ketdiagnosa = $ketdiagnosa;
                    $dataDetailDiagnosaIcd9->objectdiagnosatindakanfk = $idProc;
                    $dataDetailDiagnosaIcd9->objectdiagnosatindakanpasienfk = $dataDiagnosaIcd9->norec;
                    $dataDetailDiagnosaIcd9->tglinputdiagnosa = $tglInput->format('Y-m-d H:i:s');
                    $dataDetailDiagnosaIcd9->save();

                    $tglInput->addSeconds(2);
                }
            }

            DB::commit();
            $result = array('status' => 201, 'message' => 'Simpan Berhasil');
        } catch (\Exception $e) {
            DB::rollBack();
            $result = array('status' => 400, 'message' => $e->getMessage());
        }
        return $this->setStatusCode($result['status'])->respond($result, $result['message']);
    }
    // End IDRG

    public function getDokumenPasien(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $data = \DB::table('dokumen_pasien_t as dok')
            ->select('dok.*')
            ->where('dok.statusenabled', true)
            ->where('dok.kdprofile', $idProfile);
        if (isset($request['nocm']) && $request['nocm'] != '') {
            $data = $data->where('dok.nocm', $request['nocm']);
        }

        $data = $data->get();

        $result = array(
            'data' => $data,
            'message' => 'er@epic',
        );
        return $this->respond($result);
    }

    public function simpanDokumenPasien(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $dataReq = $request->all();
        $uploadBerkasPasien = $request->file('filePasien');
        $path = 'DokumenPasienM/' . $dataReq['nocm'];

        DB::beginTransaction();
        try {
            $dataDokumen = \DB::table('dokumen_pasien_t as dok')
                ->where('dok.norec', '=', $dataReq['norec'])
                ->where('dok.kdprofile', $kdProfile)
                ->where('dok.statusenabled', true)
                ->first();

            if ($dataDokumen == '' || $dataDokumen == null) {

                if (!empty($uploadBerkasPasien)) {
                    // penamaan file 
                    $extension = $uploadBerkasPasien->getClientOriginalExtension();
                    $filename = $dataReq['namafile'] . '_' . date('YmdHis') . '.' . $extension;

                    $emrDkmn = new DokumenPasien();
                    $norecDkmn = $emrDkmn->generateNewId();
                    $emrDkmn->norec = $norecDkmn;
                    $emrDkmn->kdprofile = $kdProfile;
                    $emrDkmn->statusenabled = true;
                    $emrDkmn->nocm = $dataReq['nocm'];
                    $emrDkmn->tglberkas = date('Y-m-d H:i:s');
                    $emrDkmn->file = $path . '/' . $filename;
                    $emrDkmn->namafile = $filename;
                    $emrDkmn->deskripsi = $dataReq['keterangan'];
                    $emrDkmn->objectberkaspasien = $dataReq['objectberkaspasien'];
                    $emrDkmn->save();
                    $request->file('filePasien')->move($path, $filename);
                }
            } else {
                $emrDkmn = DokumenPasien::where('norec', $dataReq['norec'])->first();
                $emrDkmn->deskripsi = $dataReq['keterangan'];
                $extension = explode('.', $emrDkmn->file)[1];

                if (!empty($uploadBerkasPasien)) {

                    if (\File::exists($emrDkmn->file))
                        \File::delete($emrDkmn->file);

                    // penamaan file 
                    $extension = $uploadBerkasPasien->getClientOriginalExtension();
                    $filename = $dataReq['namafile'] . '_' . date('YmdHis') . '.' . $extension;
                    $emrDkmn->file = $path . '/' . $filename;
                    $request->file('filePasien')->move($path, $filename);
                } else {

                    if (\File::exists($emrDkmn->file)) {
                        $filename = $dataReq['namafile'] . '_' . date('YmdHis') . '.' . $extension;
                        \File::move($emrDkmn->file, $path . '/' . $filename);
                        $emrDkmn->file = $path . '/' . $filename;
                    }
                }

                $emrDkmn->namafile = $dataReq['namafile'] . '_' . date('YmdHis') . '.' . $extension;
                $emrDkmn->objectberkaspasien = $dataReq['objectberkaspasien'];
                $emrDkmn->save();
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = 'Simpan Berhasil';
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "dokumen" => $emrDkmn,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function hapusDokumenPasien(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        DB::beginTransaction();
        try {

            $dokumen = DokumenPasien::where('norec', $request['norec'])
                ->where('kdprofile', $idProfile)
                ->first();

            $path = public_path($dokumen->file);
            $strpathdel = 'DokumenPasienM/' . $dokumen->nocm . '/Deleted';
            $pathdel = public_path($strpathdel . '/' . $dokumen->namafile);
            if (\File::exists($dokumen->file)) {
                \File::delete($path);
            }
            $dokumen->delete();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Data Terhapus";
            DB::commit();
            
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'er@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "as" => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDaftarPasienEmrClose(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        // $tglAwal = $request['tglAwal'];
        // $tglAkhir = $request['tglAkhir'];
        // $noregistrasi = '';
        $filter = $request->all();
        // if (isset($request['noregistrasi']) && $request['noregistrasi'] != "" && $request['noregistrasi'] != "undefined") {
        //     $noregistrasi = " and pd.noregistrasi ilike '%" . $request['noregistrasi'] . "%'";
        // }

        // $data= DB::select(DB::raw("
        // SELECT
        //     pd.tglregistrasi,
        //     ps.nocm,
        //     pd.noregistrasi,
        //     ps.namapasien,
        //     rm.namarekanan,
        //     kp.kelompokpasien,
        //     ru.namaruangan,
        //     pd.statuspasien,
        //     pd.tglpulang,
        //     pd.tglmeninggal,
        //     pd.iscloseemr
        // FROM
        //     pasiendaftar_t as pd 
        //     LEFT JOIN pasien_m as ps on ps.id = pd.nocmfk
        //     LEFT JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
        //     left join rekanan_m as rm on rm.id = pd.objectrekananfk
        //     INNER JOIN kelompokpasien_m AS kp ON kp.id = pd.objectkelompokpasienlastfk
        // WHERE
        //     pd.statusenabled = TRUE
        //     AND pd.kdprofile = $kdProfile
        //     and pd.tglregistrasi between '$tglAwal' and '$tglAkhir'
        //     $openemr
        //     $noregistrasi
        //     "));

        $data = \DB::table('pasiendaftar_t as pd')
                ->leftjoin('pasien_m as ps','ps.id','=','pd.nocmfk')
                ->leftjoin('ruangan_m as ru','ru.id','=','pd.objectruanganlastfk')
                ->leftjoin('rekanan_m as rm','rm.id','=','pd.objectrekananfk')
                ->leftjoin('kelompokpasien_m AS kp','kp.id', '=','pd.objectkelompokpasienlastfk')
                ->leftjoin('antrianpasiendiperiksa_t as apd', function($join){
                    $join->on('apd.noregistrasifk','=','pd.norec')
                        ->on('apd.objectruanganfk','=','pd.objectruanganlastfk');
                })
                // ->join('detaildiagnosapasien_t AS ddp', 'ddp.noregistrasifk' ,'=', 'apd.norec')
                ->select(DB::raw("
                pd.tglregistrasi,ps.nocm,pd.noregistrasi,ps.namapasien,rm.namarekanan,kp.kelompokpasien,ru.namaruangan,
                pd.statuspasien,pd.tglpulang,pd.tglmeninggal,pd.iscloseemr, pd.norec
                "))
                ->where('pd.statusenabled', TRUE)
                ->where('pd.kdprofile', $kdProfile);
        
                
                if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '<=', $filter['tglAkhir']);
        }
        if (isset($filter['isKirim']) && $filter['isKirim'] != "" && $filter['isKirim'] != "undefined") {
            $data = $data->where('pd.iscloseemr', '=', $filter['isKirim']);
        }
        if (isset($filter['isNonKirim']) && $filter['isNonKirim'] != "" && $filter['isNonKirim'] != "undefined") {
            $data = $data->where(function($query) {
                $query->whereNull('pd.iscloseemr')
                      ->orWhere('pd.iscloseemr', '!=', true);
            });
        }
        
        if (isset($filter['noregistrasi']) && $filter['noregistrasi'] != "" && $filter['noregistrasi'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $filter['noregistrasi']);
        }
        
        if (isset($filter['nocm']) && $filter['nocm'] != "" && $filter['nocm'] != "undefined") {
            $data = $data->where('ps.nocm', '=', $filter['nocm']);
        }
        // if(isset($request['isKirim']) && $request['isKirim']!="" && $request['isKirim']!="undefined" && $request['isKirim'] == "true" || $request['isKirim'] == true){
        //     $data = $data->where('pd.iscloseemr');
        // }
        // if(isset($request['isNonKirim']) && $request['isNonKirim']!="" && $request['isNonKirim']!="undefined" && $request['isNonKirim'] == "false" || $request['isNonKirim'] == false){
        //     $data = $data->where('pd.iscloseemr');
        // }
        
        $data = $data->distinct()->get();
        
        $result = array(
            'data' => $data,
            'as' => 'ea@epic'
        );
        return $this->respond($data);
    }

    public function getDaftarReqAkses(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        
        $filter = $request->all();
       
        $data = \DB::table('aksesrekammedis_t as ark')
                ->leftjoin('pasiendaftar_t as pd','pd.norec','=','ark.noregistrasifk')
                ->leftjoin('ruangan_m as ru','ru.id','=','ark.ruanganuserfk')
                ->leftjoin('pasien_m as ps','ps.id','=','pd.nocmfk')
                ->leftjoin('pegawai_m as pg','pg.id','=','ark.pegawaifk')
                ->leftjoin('pegawai_m as pg2','pg2.id','=','ark.pemberiaksesfk')
    
                ->select(DB::raw("
                pd.tglregistrasi,ps.nocm,pd.noregistrasi,ps.namapasien,ru.namaruangan as unitpegawai,
                ark.norec, pg.namalengkap as pegawaidiberiakses, ark.tglawal, ark.tglakhir, ark,tglinput, pg2.namalengkap as pegawaipemberiakses,
                ark.keterangan, ark.tglawalreq, ark.tglakhirreq, ark.tglorder
                "))
                ->where('pd.statusenabled', TRUE)
                ->where('ark.statusenabled', TRUE)
                ->where('ark.statusenabled', TRUE)
                ->whereNotNull('ark.tglawalreq')
                ->where('pd.kdprofile', $kdProfile)
                ->orderBy('ark.tglorder', 'desc');
        
                if (isset($filter['tglawalreq']) && $filter['tglawalreq'] != "" && $filter['tglawalreq'] != "undefined") {
                    $data = $data->where('ark.tglorder', '>=', $filter['tglawalreq']);
                }
                if (isset($filter['tglakhirreq']) && $filter['tglakhirreq'] != "" && $filter['tglakhirreq'] != "undefined") {
                    $data = $data->where('ark.tglorder', '<=', $filter['tglakhirreq']);
                }        
             
        
        $data = $data->distinct()->get();
        
        $result = array(
            'data' => $data,
            'as' => 'rd'
        );
        return $this->respond($result);
    }

    public function simpanOpenEMR(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        DB::beginTransaction();
        try {
            // $datazz = PasienDaftar::where('noregistrasi', $request['noregistrasi'])->where('kdprofile', (int)$kdProfile)->first();
            // if(isset($datazz->iscloseemr = null)){
                PasienDaftar::where('noregistrasi', $request['noregistrasi'])
                ->where('kdprofile', $idProfile)
                ->update([
                    'iscloseemr' => false,
                ]);
            // else {
            //     PasienDaftar::where('noregistrasi', $request['noregistrasi'])
            //     ->where('kdprofile', $idProfile)
            //     ->update([
            //         'iscloseemr' => false,
            //     ]);
            // }
        // try {
        //     $datazz = PasienDaftar::where('norec', $request['norec'])->where('kdprofile', (int)$kdProfile)->first();
        //     if (isset($datazz->iscloseemr) && $datazz->iscloseemr === null) {
        //         $data = PasienDaftar::where('norec', $request['norec'])
        //         ->where('kdprofile', (int)$kdProfile)
        //         ->update([
        //                 'iscloseemr' => true]
        //         );
        //     }else{
        //         $data = PasienDaftar::where('norec', $request['norec'])
        //         ->where('kdprofile', (int)$kdProfile)
        //         ->update([
        //                 'iscloseemr' => true]
        //         );
        //     }
            $transStatus = 'true';
            $transMessage = "EMR Tersedia !";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "EMR Open Harap Hubungi Rekam Medis";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
        // return $this->respond($result, $data);
    }

    public function simpanCloseEMR(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        DB::beginTransaction();
        try {
            // $datazz = PasienDaftar::where('noregistrasi', $request['noregistrasi'])->where('kdprofile', (int)$kdProfile)->first();
            // if(isset($datazz->iscloseemr = null)){
                PasienDaftar::where('noregistrasi', $request['noregistrasi'])
                ->where('kdprofile', $idProfile)
                ->update([
                    'iscloseemr' => true,
                ]);
            // else {
            //     PasienDaftar::where('noregistrasi', $request['noregistrasi'])
            //     ->where('kdprofile', $idProfile)
            //     ->update([
            //         'iscloseemr' => false,
            //     ]);
            // }
        // try {
        //     $datazz = PasienDaftar::where('norec', $request['norec'])->where('kdprofile', (int)$kdProfile)->first();
        //     if (isset($datazz->iscloseemr) && $datazz->iscloseemr === null) {
        //         $data = PasienDaftar::where('norec', $request['norec'])
        //         ->where('kdprofile', (int)$kdProfile)
        //         ->update([
        //                 'iscloseemr' => true]
        //         );
        //     }else{
        //         $data = PasienDaftar::where('norec', $request['norec'])
        //         ->where('kdprofile', (int)$kdProfile)
        //         ->update([
        //                 'iscloseemr' => true]
        //         );
        //     }
            $transStatus = 'true';
            $transMessage = "EMR Terkunci!";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "EMR Gagal Terkunci!";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
        // return $this->respond($result, $data);
    }

    public function postReqKendali(Request $request){
        $idProfile = (int) $this->getDataKdProfile($request);
        $tglAyeuna = date('Y-m-d H:i:s');
        \DB::beginTransaction();
        try{
                $dataInsert = [];
                foreach ($request['dataTambah'] as $item){
                    $dataInsert[] = array(
                        'norec' => substr(Uuid::generate(), 0, 32),
                        'kdprofile' => $idProfile,
                        'statusenabled' => true,
                        'noregistrasifk' => $item['norec_pd'],
                        'pegawaifk' => $item['pegawaifk'],
                        'keterangan' => $item['keterangan'],
                        'tglawalreq' => $item['tglawalreq'],
                        'tglakhirreq' => $item['tglakhirreq'],
                        'ruanganuserfk' => $item['ruanganuserfk'],
                        'isreq' => true,
                        // 'pemberiaksesfk' => $this->getCurrentUserID(),
                        'tglorder' => $tglAyeuna,
                    );
                    if (count($dataInsert) > 5){
                        AksesRekamMedis::insert($dataInsert);
                        $dataInsert = [];
                    }
                }

                AksesRekamMedis::insert($dataInsert);

            

            $transStatus = true;
        } catch (\Exception $e) {
            $transStatus = false;
        }

        if ($transStatus){
            $transMessage = "Request Akses Berhasil";
            \DB::commit();
            $result = array(
                'status' => 201,
            );
        } else {
            $transMessage = "Request Akses Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'as' => 'ea@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function postKendali(Request $request){
        $idProfile = (int) $this->getDataKdProfile($request);
        $tglAyeuna = date('Y-m-d H:i:s');
        \DB::beginTransaction();
        try{
                if(isset($request['norec']) && $request['norec'] != 'undefined'){
                    AksesRekamMedis::where('norec', $request['norec'])->update(
                        [
                            'tglawal' => $request['tglawal'],
                            'tglakhir' => $request['tglakhir'],
                            'pemberiaksesfk' => $this->getCurrentUserID(),
                            'tglinput' => $tglAyeuna,
                        ]
                    );
                } else {
                    $dataInsert = [];
                    foreach ($request['dataTambah'] as $item){
                        $dataInsert[] = array(
                            'norec' => substr(Uuid::generate(), 0, 32),
                            'kdprofile' => $idProfile,
                            'statusenabled' => true,
                            'noregistrasifk' => $item['norec_pd'],
                            'pegawaifk' => $item['pegawaifk'],
                            'keterangan' => $item['keterangan'],
                            'tglawal' => $item['tglawal'],
                            'tglakhir' => $item['tglakhir'],
                            'ruanganuserfk' => $item['ruanganuserfk'],
                            'pemberiaksesfk' => $this->getCurrentUserID(),
                            'tglinput' => $tglAyeuna,
                        );
                        if (count($dataInsert) > 5){
                            AksesRekamMedis::insert($dataInsert);
                            $dataInsert = [];
                        }
                    }
    
                    AksesRekamMedis::insert($dataInsert);
                }
               

            

            $transStatus = true;
        } catch (\Exception $e) {
            $transStatus = false;
        }

        if ($transStatus){
            $transMessage = "Beri Akses Berhasil";
            \DB::commit();
            $result = array(
                'status' => 201,
            );
        } else {
            $transMessage = "Beri Akses Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'as' => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function deleteKendali(Request $request){
        $idProfile = (int) $this->getDataKdProfile($request);
        \DB::beginTransaction();
        try{
            AksesRekamMedis::where('norec', $request['norec'])->where('kdprofile', $idProfile)->delete();
            $transStatus = true;
        } catch (\Exception $e) {
            $transStatus = false;
        }

        if ($transStatus){
            $transMessage = "Hapus Akses Berhasil";
            \DB::commit();
            $result = array(
                'status' => 201,
            );
        } else {
            $transMessage = "Hapus Akses Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'as' => 'rd',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function cekCloseEmr(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $akses = true;

        $pd = PasienDaftar::WHERE('norec',$request['norec_pd'])->where('kdprofile',(int)$kdProfile)->first();
        if($pd->iscloseemr == true){
            $akses = false;
            $cekAkses = AksesRekamMedis::where('noregistrasifk',$request['norec_pd'])->where('pegawaifk',$this->getCurrentUserID())
                ->where('tglawal', '<=', Carbon::now())
                ->where('tglakhir', '>=', Carbon::now())->get();
            if(count($cekAkses) > 0){
                $akses = true;
            }
        }

        $result = array(
            'akses' => $akses,
            'as' => 'rd'
        );
        return $this->respond($result);

    }

    public function getDaftarReqPasienEmrClose(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $filter = $request->all();

        $data = \DB::table('pasiendaftar_t as pd')
                ->leftjoin('pasien_m as ps','ps.id','=','pd.nocmfk')
                ->leftjoin('ruangan_m as ru','ru.id','=','pd.objectruanganlastfk')
                ->leftjoin('rekanan_m as rm','rm.id','=','pd.objectrekananfk')
                ->leftjoin('kelompokpasien_m AS kp','kp.id', '=','pd.objectkelompokpasienlastfk')
                ->leftjoin('antrianpasiendiperiksa_t as apd', function($join){
                    $join->on('apd.noregistrasifk','=','pd.norec')
                        ->on('apd.objectruanganfk','=','pd.objectruanganlastfk');
                })
                // ->join('detaildiagnosapasien_t AS ddp', 'ddp.noregistrasifk' ,'=', 'apd.norec')
                ->select(DB::raw("
                pd.tglregistrasi,ps.nocm,pd.noregistrasi,ps.namapasien,rm.namarekanan,kp.kelompokpasien,ru.namaruangan,
                pd.statuspasien,pd.tglpulang,pd.tglmeninggal,pd.iscloseemr, pd.norec
                "))
                ->where('pd.statusenabled', TRUE)
                ->where('pd.iscloseemr', TRUE)
                ->where('pd.kdprofile', $kdProfile);
        
                
                if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '<=', $filter['tglAkhir']);
        }
        if (isset($filter['isKirim']) && $filter['isKirim'] != "" && $filter['isKirim'] != "undefined") {
            $data = $data->where('pd.iscloseemr', '=', $filter['isKirim']);
        }
        if (isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined") {
            $data = $data->where('ru.id', '=', $filter['ruangId']);
        }
        if (isset($filter['isNonKirim']) && $filter['isNonKirim'] != "" && $filter['isNonKirim'] != "undefined") {
            $data = $data->where(function($query) {
                $query->whereNull('pd.iscloseemr')
                      ->orWhere('pd.iscloseemr', '!=', true);
            });
        }
        
        if (isset($filter['noregistrasi']) && $filter['noregistrasi'] != "" && $filter['noregistrasi'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $filter['noregistrasi']);
        }
        
        if (isset($filter['nocm']) && $filter['nocm'] != "" && $filter['nocm'] != "undefined") {
            $data = $data->where('ps.nocm', '=', $filter['nocm']);
        }
        
        $data = $data->distinct()->get();
        
        $result = array(
            'data' => $data,
            'as' => 'ea@epic'
        );
        return $this->respond($data);
    }

    public function getDaftarAkses(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        
        $filter = $request->all();
       
        $data = \DB::table('aksesrekammedis_t as ark')
                ->leftjoin('pasiendaftar_t as pd','pd.norec','=','ark.noregistrasifk')
                ->leftjoin('ruangan_m as ru','ru.id','=','ark.ruanganuserfk')
                ->leftjoin('pasien_m as ps','ps.id','=','pd.nocmfk')
                ->leftjoin('pegawai_m as pg','pg.id','=','ark.pegawaifk')
                ->leftjoin('pegawai_m as pg2','pg2.id','=','ark.pemberiaksesfk')
    
                ->select(DB::raw("
                pd.tglregistrasi,ps.nocm,pd.noregistrasi,ps.namapasien,ru.namaruangan as unitpegawai,
                ark.norec, pg.namalengkap as pegawaidiberiakses, ark.tglawal, ark.tglakhir, ark,tglinput, pg2.namalengkap as pegawaipemberiakses,
                ark.keterangan
                "))
                ->where('pd.statusenabled', TRUE)
                ->where('ark.statusenabled', TRUE)
                ->where('ark.statusenabled', TRUE)
                ->whereNotNull('ark.tglawal')
                ->where('pd.kdprofile', $kdProfile);
        
                
             
        
        $data = $data->distinct()->get();
        
        $result = array(
            'data' => $data,
            'as' => 'rd'
        );
        return $this->respond($result);
    }
    public function otomatisCloseEmr(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        \DB::beginTransaction();
        try{
            $pd = PasienDaftar::where('kdprofile',$kdProfile)->where('tglpulang', '<=', Carbon::now()->subDays(2))
            ->where(function($query) {
                $query->where('iscloseemr', '!=', true)
                      ->orWhereNull('iscloseemr'); 
            })
            ->where('statusenabled',true)
            ->update(['iscloseemr' => true]);
           
            //  return $this->respond($pd);
            $transStatus = true;
        } catch (\Exception $e) {
            $transStatus = false;
        }
       
       

        if ($transStatus){
            $transMessage = "Close EMR Berhasil";
            \DB::commit();
            $result = array(
                'status' => 201,
            );
        } else {
            $transMessage = "Close EMR Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'as' => 'rd',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getComboDiagnosa(Request $request) {
        $data = \DB::table('diagnosaim_m')
            ->select('id', 'kddiagnosa', 'namadiagnosa')
            ->where('statusenabled', true)
            ->where('kddiagnosa', $request['kddiagnosa'])
            ->get();

        return $this->respond($data);
    }

    public function getComboDiagnosaTindakan(Request $request) {
        $data = \DB::table('diagnosatindakanim_m')
            ->select('id', 'kddiagnosatindakan', 'namadiagnosatindakan')
            ->where('statusenabled', true)
            ->where('kddiagnosatindakan', $request['kddiagnosatindakan'])
            ->get();

        return $this->respond($data);
    }
    public function saveRegistrasiPasienOnline(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProdile = (int)$kdProfile;


        $r_NewPD = $request['pasiendaftar'];
        $r_NewAPD = $request['antrianpasiendiperiksa'];
        //        $countNoAntrian = AntrianPasienDiperiksa::where('objectruanganfk',$r_NewPD['objectruanganfk'])
        //            ->where('tglregistrasi', '>=', $r_NewPD['tglregistrasidate'].' 00:00')
        //            ->where('tglregistrasi', '<=', $r_NewPD['tglregistrasidate'].' 23:59')
        //            ->count('norec');
        //        $noAntrian = $countNoAntrian + 1;

        $cekRiwayatPlafon = PasienDaftar::where('nocmfk', $r_NewPD['nocmfk'])->where('statusenabled', true)->orderBy('tglregistrasi', 'desc')->first();
        $plafonBpjs = 0;
        if (!empty($cekRiwayatPlafon)) {
            $plafonBpjs = (float)$cekRiwayatPlafon->inacbgtotalgrouper;
        }

        if ($r_NewPD['israwatinap'] == 'true') {
            $isRawatInap = 'true';
        } else {
            $isRawatInap = 'false';
        }
        DB::beginTransaction();
        $cekUdahDaftar = PasienDaftar::where('nocmfk', $r_NewPD['nocmfk'])
            ->wherenull('tglpulang')
            ->where('statusenabled', true)
            ->count();
        
        // ada tambahan jika pasien ke lab dan pembiyaan umum maka masih bisa diregistrasi
        // jika bukan umum maka tidak bisa
        if (($cekUdahDaftar > 0 && $r_NewPD['norec_pd'] == '' && $r_NewPD['objectruanganfk'] !== 575) || ($cekUdahDaftar > 0 && $r_NewPD['norec_pd'] == '' && $r_NewPD['objectruanganfk'] == 575) && $r_NewPD['objectkelompokpasienlastfk'] !== 1) {
            $transStatus = 'belumdipulangkan';
        } else {
            //menambahkan kondisi pasien statusnya lama atau baru 
            $isPasienLama = DB::table('pasiendaftar_t')
                ->where('nocmfk', $r_NewPD['nocmfk'])
                ->where('statusenabled', true)
                ->exists();
            $statusPasien = $isPasienLama ? 'LAMA' : 'BARU';
            try {
                //region Save PasienDaftar
                if ($r_NewPD['norec_pd'] == '') {
                    $noRegistrasiSeq = $this->generateCodeBySeqTable(new PasienDaftar, 'noregistrasi', 10, date('ym'), $idProdile);
                    $noAntrian = 0;
                    if ($noRegistrasiSeq == '') {
                        $transMessage = "Gagal mengumpukan data, Coba lagi.!";
                        DB::rollBack();
                        $result = array(
                            "status" => 400,
                            "message"  => $transMessage,
                            "as" => 'as@epic',
                        );
                        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                    }
                    $dataPD = new PasienDaftar();
                    $dataPD->norec = $dataPD->generateNewId();
                    $dataPD->kdprofile = $idProdile;
                    $dataPD->statusenabled = true;
                    $noRegistrasi = $noRegistrasiSeq; //$this->generateNoReg(new PasienDaftar, 'noregistrasi', 10, date('ym'));//$this->getMaxNoregistrasi();
                    $dataPD->objectruanganasalfk = $r_NewPD['objectruanganfk'];
                    if (isset($r_NewPD['statuspasien'])) {
                        // $dataPD->statuspasien = $r_NewPD['statuspasien'];
                        $dataPD->statuspasien = $statusPasien;
                    }

                    //                    $saveAdminstrasi = $this->saveAdministrasi($idProdile);
                } else {
                    $dataPD =  PasienDaftar::where('norec', $r_NewPD['norec_pd'])->where('kdprofile', $idProdile)->first();
                    $noRegistrasi = $dataPD->noregistrasi;
                    //          $delAntrian = AntrianPasienDiperiksa::where('noregistrasifk', $r_NewPD['norec_pd'])
                    //                ->delete();
                    if ($isRawatInap == 'true') {
                        $delRegistrasiPelPasien = RegistrasiPelayananPasien::where('noregistrasifk', $r_NewPD['norec_pd'])
                            ->where('objectruanganfk', $r_NewPD['objectruanganfk'])
                            ->delete();
                    }
                }
                $dataPD->objectruanganlastfk = $r_NewPD['objectruanganfk'];
                $dataPD->objectdokterpemeriksafk =  isset($r_NewPD['objectpegawaifk']) ? $r_NewPD['objectpegawaifk'] : null;
                $dataPD->objectpegawaifk = isset($r_NewPD['objectpegawaifk']) ? $r_NewPD['objectpegawaifk'] : null;
                $dataPD->iskajianawal = false;
                $dataPD->isonsiteservice = 0;
                $dataPD->isregistrasilengkap = 0;
                $dataPD->jenispelayanan = $r_NewPD['tipelayanan'];
                $dataPD->objectkasuspenyakitlastfk = 1;
                $isRawatJalan = isset($r_NewPD['objectdepartemenfk']) && $r_NewPD['objectdepartemenfk'] == 18;
                if ($isRawatInap == 'true') {
                    $dataPD->objectkelasfk = $r_NewPD['objectkelasfk'];
                    if ($dataPD->tglpulang === null) { 
                    $dataPD->tglpulang = null;
                  }
                } else {
                    $dataPD->objectkelasfk = (int)$this->settingDataFixed('kdKelasNonKelasRegistrasi', $idProdile);
                    // untuk pendaftaran pasien rawat jalan saat edit tanggal registrasi ikut terupdate tanggal pulang
                    if ($isRawatJalan && $r_NewPD['norec_pd'] != '') {
                        $dataPD->tglpulang = $r_NewPD['tglregistrasi'];
                    }
                    // pendaftaran pasien baru
                    else if ($dataPD->tglpulang === null) {
                        $dataPD->tglpulang = $r_NewPD['tglregistrasi'];
                    }
                }

                $dataPD->objectkelompokpasienlastfk = $r_NewPD['objectkelompokpasienlastfk'];
                $dataPD->nocmfk = $r_NewPD['nocmfk'];
                $dataPD->objectrekananfk = $r_NewPD['objectrekananfk'];
                $dataPD->statuskasuspenyakit = false;
                //                $cekStatusPasien=PasienDaftar::where('nocmfk', $r_NewPD['nocmfk'])
                //                    ->count('nocmfk');
                //                if ($cekStatusPasien  > 0){
                //                    $statusPasien='LAMA';
                //                }else{
                //                    $statusPasien='BARU';
                //                }
                if (isset($r_NewPD['statusschedule'])) {
                    $dataPD->statusschedule = $r_NewPD['statusschedule'];
                }
                if (isset($r_NewPD['ischeckin'])) {
                    $dataPD->ischeckin = true;
                }
                if (isset($r_NewPD['isjknloket'])) {
                    $dataPD->ismobilejkn = $r_NewPD['isjknloket'];
                    $dataPD->ischeckin = true;
                }
                if (isset($r_NewPD['isjkn'])) {
                    $dataPD->ismobilejkn = $r_NewPD['isjkn'];
                    $dataPD->ischeckin = false;
                }
                $dataPD->tglregistrasi =  $r_NewPD['tglregistrasi'];
                //                $dataPD->objectruanganasalfk = $r_NewPD['objectruanganfk'];
                //region Dibuang Sayang
                //$dataPD->noregistrasifk = $noRegistrasi;
                //$dataPD->objectpenyebabkematianfk = true;
                //$dataPD->objectkondisipasienfk = true;
                //$dataPD->namalengkapambilpasien = true;
                //$dataPD->objecthubungankeluargaambilpasienfk = true;
                //$dataPD->tglpulang = date('Y-m-d H:i:s')
                //$dataPD->ruangannextschedule = true;
                //$dataPD->objectstatuskeluarfk = true;
                //$dataPD->objectstatuspulangfk = true;
                //$dataPD->totalbiaya = true;
                //$dataPD->nostruklastfk = true;
                //$dataPD->nosbmlastfk = true;
                //$dataPD->emergensi = true;
                //$dataPD->tglmeninggal = true;
                //endregion
                $dataPD->noregistrasi = $noRegistrasi;
                $dataPD->inacbgtotalgrouper = $plafonBpjs;
                $dataPD->save();
                $dataPDnorec = $dataPD->norec;
                $dataStatusPasien = $dataPD->statuspasien;
                //endregion
                //region Save AntrianPasienDiperiksa


                if ($r_NewAPD['norec_apd'] == '') {
                    $countNoAntrian = AntrianPasienDiperiksa::where('objectruanganfk', $r_NewPD['objectruanganfk'])
                        ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'antrianpasiendiperiksa_t.noregistrasifk')
                        ->where('antrianpasiendiperiksa_t.kdprofile', $idProdile)
                        ->where('antrianpasiendiperiksa_t.tglmasuk', '>=', $r_NewPD['tglregistrasidate'] . ' 00:00:00')
                        ->where('antrianpasiendiperiksa_t.tglmasuk', '<=', $r_NewPD['tglregistrasidate'] . ' 23:59:59')
                        ->where('antrianpasiendiperiksa_t.statusenabled', true)
                        ->where('pd.statusenabled', true)
                        ->max('noantrian');
                    $noAntrian = $countNoAntrian + 1;
                    //                    return $noAntrian;
                    $dataAPD = new AntrianPasienDiperiksa;
                    $dataAPD->norec = $dataAPD->generateNewId();
                    $dataAPD->kdprofile = (int)$kdProfile;
                    $dataAPD->statusenabled = true;
                    $dataAPD->noantrian = $noAntrian;
                    $dataAPD->tglmasuk = $r_NewAPD['tglregistrasi'];
                    //                    $dataAPD->objectruanganfk = $r_NewAPD['objectruanganfk'];
                } else {
                    $dataAPD =  AntrianPasienDiperiksa::where('norec', $r_NewAPD['norec_apd'])->where('kdprofile', $idProdile)->first();
                    if ($r_NewPD['objectruanganfk'] != $dataAPD->objectruanganfk) {

                        $countNoAntrian = AntrianPasienDiperiksa::where('objectruanganfk', $r_NewPD['objectruanganfk'])
                            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'antrianpasiendiperiksa_t.noregistrasifk')
                            ->where('antrianpasiendiperiksa_t.kdprofile', $idProdile)
                            ->where('antrianpasiendiperiksa_t.tglmasuk', '>=', $r_NewPD['tglregistrasidate'] . ' 00:00:00')
                            ->where('antrianpasiendiperiksa_t.tglmasuk', '<=', $r_NewPD['tglregistrasidate'] . ' 23:59:59')
                            ->where('antrianpasiendiperiksa_t.statusenabled', true)
                            ->where('pd.statusenabled', true)
                            ->max('noantrian');

                        $noAntrian = $countNoAntrian + 1;
                        $dataAPD->noantrian = $noAntrian;
                    }
                    if ($r_NewPD['tglregistrasi'] != $dataAPD->tglmasuk) {

                        $countNoAntrian = AntrianPasienDiperiksa::where('objectruanganfk', $r_NewPD['objectruanganfk'])
                            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'antrianpasiendiperiksa_t.noregistrasifk')
                            ->where('antrianpasiendiperiksa_t.kdprofile', $idProdile)
                            ->where('antrianpasiendiperiksa_t.tglmasuk', '>=', $r_NewPD['tglregistrasidate'] . ' 00:00:00')
                            ->where('antrianpasiendiperiksa_t.tglmasuk', '<=', $r_NewPD['tglregistrasidate'] . ' 23:59:59')
                            ->where('antrianpasiendiperiksa_t.statusenabled', true)
                            ->where('pd.statusenabled', true)
                            ->max('noantrian');

                        $noAntrian = $countNoAntrian + 1;
                        $dataAPD->noantrian = $noAntrian;
                    }
                    //kosongkan
                    if ($isRawatInap == 'true') {
                        TempatTidur::where('id', $dataAPD->nobed)->update(['objectstatusbedfk' => 2]);
                    }
                }
                //count tgl pasien perruanga
                $dataAPD->objectasalrujukanfk =  $r_NewAPD['objectasalrujukanfk'];
                if (isset($r_NewAPD['objectkamarfk'])) {
                    $dataAPD->objectkamarfk = $r_NewAPD['objectkamarfk'];
                }
                $dataAPD->objectkasuspenyakitfk = null;
                $dataAPD->objectruanganfk = $r_NewPD['objectruanganfk'];
                if ($isRawatInap == 'true') {
                    $dataAPD->objectkelasfk = $r_NewAPD['objectkelasfk'];
                    $dataAPD->tglkeluar = null;
                } else {
                    $dataAPD->objectkelasfk = (int)$this->settingDataFixed('kdKelasNonKelasRegistrasi', (int)$kdProfile);
                    $dataAPD->tglkeluar = $r_NewPD['tglregistrasi'];
                }
                if (isset($r_NewAPD['nobed'])) {
                    $dataAPD->nobed = $r_NewAPD['nobed'];
                }
                $dataAPD->noregistrasifk = $dataPDnorec;
                $dataAPD->objectpegawaifk = isset($r_NewAPD['objectpegawaifk']) && $r_NewAPD['objectpegawaifk'] != null ? $r_NewAPD['objectpegawaifk'] : (isset($r_NewPD['objectpegawaifk']) ? $r_NewPD['objectpegawaifk'] : null);
                $dataAPD->statusantrian = 0;
                $dataAPD->statuskunjungan = $dataStatusPasien;
                $dataAPD->statuspasien = 1;
                $dataAPD->tglregistrasi =  $r_NewAPD['tglregistrasi'];
                // $dataAPD->tglmasuk =$r_NewAPD['tglregistrasi']; dipindahkan ke atas
                $dataAPD->israwatgabung = null;
                //region Dibuang Sayang Oge
                //$dataAPD->tgldipanggildokter = null;
                //$dataAPD->tgldipanggilsuster = null;
                //$dataAPD->objectruanganasalfk = $r_NewAPD['objectruanganfk'];
                //$dataAPD->tglkeluar = null;
                //$dataAPD->statuspenyakit =null;
                //$dataAPD->objectstrukorderfk = null;
                //$dataAPD->objectstrukreturfk = null;
                //$dataAPD->prefixnoantrian = null;
                //$dataAPD->nomasuk = '';
                //$cekRuanganAsal=AntrianPasienDiperiksa::wherenull('objectruanganasalfk')->first();
                //if($cekRuanganAsal->count >0)
                //{
                //    $dataAPD->objectruanganfk = $r_NewAPD['objectruanganfk'];
                //}
                //endregion
                $dataAPD->save();
                //update statusbed jadi Isi
                if ($isRawatInap == 'true') {
                    TempatTidur::where('id', $r_NewAPD['nobed'])->update(['objectstatusbedfk' => 1]);
                }
                //endregion
                //region Save RegistrasiPelayananPasien
                if ($isRawatInap == 'true') {
                    $dataRPP = new RegistrasiPelayananPasien();
                    $dataRPP->norec = $dataRPP->generateNewId();;
                    $dataRPP->kdprofile = (int)$kdProfile;
                    $dataRPP->statusenabled = true;
                    $dataRPP->objectasalrujukanfk = $r_NewAPD['objectasalrujukanfk'];
                    $dataRPP->israwatgabung = $r_NewAPD['israwatgabung'];
                    if (isset($r_NewAPD['objectkamarfk'])) {
                        $dataRPP->objectkamarfk = $r_NewAPD['objectkamarfk'];
                    }
                    $dataRPP->objectkelasfk = $r_NewAPD['objectkelasfk'];
                    $dataRPP->objectkelaskamarfk = $r_NewAPD['objectkelasfk'];
                    $dataRPP->kdpenjaminpasien = 0;
                    $dataRPP->objectkelompokpasienfk = $r_NewPD['objectkelompokpasienlastfk'];
                    $dataRPP->noantrianbydokter = 0;
                    $dataRPP->nocmfk = $r_NewPD['nocmfk'];
                    $dataRPP->noregistrasifk = $dataPDnorec;
                    $dataRPP->objectruanganfk = $r_NewAPD['objectruanganfk'];
                    $dataRPP->objectstatuskeluarfk = null;
                    if (isset($r_NewAPD['nobed'])) {
                        $dataAPD->objecttempattidurfk = $r_NewAPD['nobed'];
                    }
                    $dataRPP->tglmasuk = $r_NewAPD['tglregistrasi'];
                    //region Dibuang Sayang Deui
                    //            $dataRPP->objectkasuspenyakitfk = null;
                    //            $dataRPP->kddokter = null;
                    //            $dataRPP->kddokterperiksanext =  null;
                    //            $dataRPP->objecthasiltriasefk =null;
                    //            $dataRPP->objectkelaskamarrencanafk =null;
                    //            $dataRPP->objectkelaskamartujuanfk =null;
                    //            $dataRPP->objectkelasrencanafk = null;
                    //            $dataRPP->objectkelastujuanfk = null;
                    //            $dataRPP->objectkeadaanumumfk = null;
                    //            $dataRPP->keteranganlainnyaperiksanext = null;
                    //            $dataRPP->keteranganlainnyarencana = '';
                    //            $dataRPP->kodenomorbuktiperjanjian = null;
                    //            $dataRPP->objectkondisipasienfk = null;
                    //            $dataRPP->namatempattujuan =null;
                    //            $dataRPP->noantrian = null;
                    //            $dataRPP->nobed = null;
                    //            $dataRPP->nobedtujuan =  null;
                    //            $dataRPP->prefixnoantrian =  '1';
                    //            $dataRPP->objectruanganasalfk = $r_NewAPD['objectruanganfk'];
                    //            $dataRPP->objectruanganperiksanextfk = $r_NewAPD['objectruanganfk'];
                    //            $dataRPP->objectruanganrencanafk =  null;
                    //            $dataRPP->objectruangantujuanfk =  null;
                    //            $dataRPP->objectstatuskeluarrencanafk =  null;
                    //            $dataRPP->statuspasien =  0;
                    //            $dataRPP->tglkeluar = null;
                    //            $dataRPP->tglkeluarrencana = null;
                    //            $dataRPP->tglperiksanext = null;
                    //            $dataRPP->tglpindah = $request['tglRegistrasi'];
                    //                 $dataRPP->objecttransportasifk = null;
                    //            $dataRPP->objectdetailkamarfk = null;
                    //endregion
                    $dataRPP->save();
                }
                $kdRuanganTeleme = $this->settingDataFixed('kdRuanganTelemedicine', $kdProfile);

                $strukorder = StrukOrder::where('noregistrasifk', $r_NewPD['norec_pd'])->first();
                if (isset($strukorder)) {
                    if ($strukorder->objectruanganfk != $dataAPD->objectruanganfk) {
                        $strukorder->objectruanganfk = $dataAPD->objectruanganfk;
                        $strukorder->save();
                    }
                }

                // tambah catatan
                if(isset($r_NewPD['catatan']) && $r_NewPD['catatan']!='' ){
                    $cp = new CatatanPasienDaftar();
                    $norec = $cp->generateNewId();
                    $cp->norec = $norec;
                    $cp->kdprofile = $kdProfile;
                    $cp->noregistrasifk = $dataPDnorec;
                    $cp->statusenabled = true;
                    $cp->objectpegawaifk = $this->getCurrentUserID() ;//$dataPegawai->objectpegawaifk;
                    $cp->tglcatatan = date('Y-m-d H:i:s');
                    $cp->ruangan = "Pendaftaran";
                    $cp->catatan = $r_NewPD['catatan'];
                    $cp->save();
                }
                // end tambah 

                //endregion
                $transStatus = 'true';
            } catch (\Exception $e) {
                $transStatus = 'false';
            }
        }
        if ($transStatus == 'belumdipulangkan') {
            $transMessage = 'Pasien Belum Dipulangkan';
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'ramdanegie',
            );
        } else if ($transStatus == 'true') {
            if (isset($r_NewPD['isjkn']) && $r_NewPD['isjkn'] == true) {
                $saveAdminstrasi = $this->saveAdministrasi($request);
                $data = DB::table('antrianpasienregistrasi_t')
                    ->where('kdprofile', $kdProfile)
                    ->where('statusenabled', true)
                    ->where('noreservasi', $r_NewPD['statusschedule'])
                    ->update([
                        'isconfirm' => true,
                    ]);
                DB::commit();
                $transMessage = 'OK';
                $result = array(
                    "metadata" => array(
                        "code" => "200",
                        'dataAPD' => $dataAPD,
                        "message" => $transMessage
                    )
                );
                return $this->setStatusCode(200)->respond($result, $transMessage);
            } else {
                DB::commit();
                $antrol = '';
                if ($r_NewPD['norec_pd'] == '' && $r_NewPD['statusschedule'] != '' && $r_NewPD['statusschedule'] != 'Kios-K') {
                    $antrol = $this->saveAntrolV2($r_NewPD['statusschedule']);
                }

                $transMessage = 'SUKSES';
                $objetoRequest = new \Illuminate\Http\Request();
                $objetoRequest['noregistrasi'] = $dataPD->noregistrasi;
                $ihs = app('App\Http\Controllers\Bridging\IHSController')->Encounter($objetoRequest, true);
                if ($dataPD->ismobilejkn == false && ($dataPD->statusschedule != '' || $dataPD->statusschedule != null)) {
                    $request['norec'] = $dataPD->norec;
                    $request['norec_apd'] = $dataAPD->norec;
                    $this->saveAdministrasi($request);
                }

                $result = array(
                    'status' => 201,
                    'message' => $transMessage,
                    'dataPD' => $dataPD,
                    'dataAPD' => $dataAPD,
                    'antrol' => $antrol,
                    'Encounter' => isset($ihs) ? $ihs : null,
                    'as' => 'ramdanegie',
                );
            }
            if ($kdRuanganTeleme == $dataPD->objectruanganlastfk) {
                $request['norec'] = $dataPD->norec;
                $request['norec_apd'] = $dataAPD->norec;

                $saveAdminstrasi = $this->saveAdministrasi($request);
            }
        } else {
            DB::rollBack();
            if (isset($r_NewPD['isjkn']) && $r_NewPD['isjkn'] == true) {
                $transMessage = 'Gagal';
                $result = array(
                    "metadata" => array(
                        "code" => "201",
                        "message" => $transMessage
                    )
                );
                return $this->setStatusCode(201)->respond($result, $transMessage);
            } else {
                $transMessage = 'Simpan Registrasi Gagal';
                $result = array(
                    'status' => 400,
                    'message' => $transMessage,
                    'dataPD' => $dataPD,
                    'e' => $e->getLine() . $e->getMessage(),
                    'as' => 'ramdanegie',
                );
            }
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
}
