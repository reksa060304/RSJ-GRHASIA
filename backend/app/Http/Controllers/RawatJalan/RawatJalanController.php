<?php
/**
 * Created by PhpStorm.
 * User: Egie Ramdan
 * Date: 08/08/2018
 * Time: 16.17
 */
/**
 * Created by PhpStorm.
 * User: as@epic
 * Date: 9/19/2017
 * Time: 11:44 PM
 */
/**
 * Created by PhpStorm.
 * User: nengepic
 * Date: 08/08/2019
 * Time: 14:04
 */

namespace App\Http\Controllers\RawatJalan;

use App\Http\Controllers\ApiController;
use App\Master\KelompokTransaksi;
use App\Master\Pasien;
use App\Master\TempatTidur;
use App\Transaksi\AntrianPasienDiperiksa;
use App\Transaksi\IndikatorPasienJatuh;
use App\Transaksi\RegistrasiPelayananPasien;
use App\Transaksi\SuratKeterangan;
use App\Transaksi\DiagnosaPasien;
use App\Transaksi\PemakaianAsuransi;
use App\Transaksi\StrukBuktiPenerimaan;
use App\Transaksi\StrukBuktiPengeluaran;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Transaksi\PelayananPasienPetugas;
use App\Transaksi\PasienDaftar;
use App\Transaksi\StrukPelayanan;
use App\Transaksi\PelayananPasien;
use App\Transaksi\PelayananPasienDetail;
use App\Transaksi\StrukPelayananPenjamin;
use App\Transaksi\TempBilling;
use App\Master\JenisPetugasPelaksana;
use App\Master\Pegawai;
use App\Master\Ruangan;
use App\Master\Departemen;

//use App\Transaksi\StrukPelayananDetailK;
use App\Transaksi\HistoriCetakDokumen;
use App\Transaksi\EPPS;
use App\Transaksi\EPPSDetail;
use App\Traits\Valet;
use App\Traits\PelayananPasienTrait;
use DB;
use App\Transaksi\PostingJurnalTransaksi;
use App\Transaksi\LogAcc;
use App\Traits\SettingDataFixedTrait;
use Carbon\Carbon;
use App\Transaksi\MonitoringTaskId;

class RawatJalanController extends ApiController
{
    use Valet, PelayananPasienTrait;

    public function __construct()
    {
        parent::__construct($skip_authentication = false);
    }
    public function getDataComboDokter(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin = $request->all();
        $dataInstalasi = \DB::table('departemen_m as dp')
            ->where('dp.kdprofile',$idProfile)
            ->whereIn('dp.id', array(3, 14, 16, 17, 18, 19, 24, 25, 26, 27, 28, 35))
            ->where('dp.statusenabled', true)
            ->orderBy('dp.namadepartemen')
            ->get();

        $dataRuangan = \DB::table('ruangan_m as ru')
            ->where('ru.kdprofile',$idProfile)
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();

        $dept = \DB::table('departemen_m as dept')
            ->where('dept.kdprofile',$idProfile)
            ->where('dept.id', '18')
            ->orderBy('dept.namadepartemen')
            ->get();

        $deptRajalInap = \DB::table('departemen_m as dept')
            ->where('dept.kdprofile',$idProfile)
            ->whereIn('dept.id', [16,17,35])
            ->orderBy('dept.namadepartemen')
            ->get();
        $deptJalan = explode (',',$this->settingDataFixed('kdDepartemenRawatJalanFix',$idProfile));
        $kdDepartemenRawatJalan = [];
        foreach ($deptJalan as $item){
            $kdDepartemenRawatJalan []=  (int)$item;
        }
        $ruanganRajal = \DB::table('ruangan_m as ru')
            ->where('ru.kdprofile',$idProfile)
            ->where('statusenabled',true)
            ->wherein('ru.objectdepartemenfk', $kdDepartemenRawatJalan)
            ->orderBy('ru.namaruangan')
            ->get();

        $ruanganRanap = \DB::table('ruangan_m as ru')
            ->where('ru.kdprofile',$idProfile)
            ->where('statusenabled',true)
            ->wherein('ru.objectdepartemenfk', [16,17,35])
            ->orderBy('ru.namaruangan')
            ->get();

       $dataDokter = \DB::table('pegawai_m as ru')
           ->where('ru.statusenabled', true)
           ->where('ru.objectjenispegawaifk', 1)
           ->orderBy('ru.namalengkap')
           ->get();
//        foreach ($dataInstalasi as $item) {
//            $detail = [];
//            foreach ($dataRuangan as $item2) {
//                if ($item->id == $item2->objectdepartemenfk) {
//                    $detail[] = array(
//                        'id' => $item2->id,
//                        'ruangan' => $item2->namaruangan,
//                    );
//                }
//            }
//
//            $dataDepartemen[] = array(
//                'id' => $item->id,
//                'departemen' => $item->namadepartemen,
//                'ruangan' => $detail,
//            );
//        }
//        $dataKelompok = \DB::table('kelompokpasien_m as kp')
//            ->select('kp.id', 'kp.kelompokpasien')
//            ->where('kp.statusenabled', true)
//            ->orderBy('kp.kelompokpasien')
//            ->get();
//
//        $dataKelas = \DB::table('kelas_m as kl')
//            ->select('kl.id', 'kl.reportdisplay')
//            ->where('kl.statusenabled', true)
//            ->orderBy('kl.reportdisplay')
//            ->get();
//
//        $pembatalan = \DB::table('pembatal_m as p')
//            ->select('p.id', 'p.name')
//            ->where('p.statusenabled', true)
//            ->orderBy('p.name')
//            ->get();
//
//        $jenisDiagnosa = \DB::table('jenisdiagnosa_m as jd')
//            ->select('jd.id', 'jd.jenisdiagnosa')
////            ->where('jd.id',5)
//            ->where('jd.statusenabled', true)
//            ->orderBy('jd.jenisdiagnosa')
//            ->get();
//
//        $kdeDiagnosa = \DB::table('diagnosa_m as dm')
//            ->select('dm.id','dm.kddiagnosa')
//            ->where('dm.statusenabled', true)
//            ->orderBy('dm.id')
//            ->get();
//
//        $Diagnosa = \DB::table('diagnosa_m as dm')
//            ->select('dm.id','dm.namadiagnosa')
//            ->where('dm.statusenabled', true)
//            ->orderBy('dm.id')
//            ->get();
        $deptJalan = explode(',',$this->settingDataFixed('PemanggilAntrianByDepartementDokter',$idProfile));
        $PemanggilAntrianByDepartement = [];
        foreach ($deptJalan as $item) {
            $PemanggilAntrianByDepartement[] =  (int)$item;
        }
$ruangdokter = \DB::table('ruangan_m as ru')
        ->whereIn('ru.objectdepartemenfk', $PemanggilAntrianByDepartement)
        ->where('ru.statusenabled', true)
        ->where('ru.kdprofile', $idProfile)
        ->orderBy('ru.id')
        ->get();
        $result = array(
//            'departemen' => $dataDepartemen,
//            'kelompokpasien' => $dataKelompok,
           'dokter' => $dataDokter,
//            'datalogin' => $dataLogin,
//            'kelas' => $dataKelas,
            'dept' => $dept,
            'ruanganRajal' => $ruanganRajal,
            'ruanganRanap' => $ruanganRanap,
            'deptrirj' => $deptRajalInap,
            'ruanganall' => $dataRuangan,
            'ruangdokter'=> $ruangdokter,
//            'pembatalan' => $pembatalan,
//            'jenisdiagnosa'=> $jenisDiagnosa,
//            'diagnosa'=> $Diagnosa,
//            'kddiagnosa'=> $kdeDiagnosa,
            'message' => 'as@epic',
        );
        return $this->respond($result);
    }
    public function getDokters(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin = $request->all();
        $dataDokters = \DB::table('pegawai_m as p')
            ->select('p.id','p.namalengkap')
            ->where('p.kdprofile',$idProfile)
            ->where('p.statusenabled', true)
            ->where('p.objectjenispegawaifk', 1)
            ->orderBy('p.namalengkap')
            ->get();

        $result = array(
            'dokter'=> $dataDokters,
            'message' => 'ramdanegie',
        );

        return $this->respond($result);
    }
    public function getDataComboSurat( Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $js = \DB::table('jenissurat_m')
            ->select('*')
            ->where('statusenabled',true)
            ->get();
        $pegawai = \DB::table('pegawai_m as pg ')
            ->select('pg.namalengkap', 'pg.id')
            ->where('pg.kdprofile',$idProfile)
            ->where('statusenabled',true)
            ->get();
        $result = array(
            'jenisSurat' => $js,
            'listPegawai'=>$pegawai,
            'message' => 'ridwan',
        );
        return $this->respond($result);
    }
    public function getDataComboOperator(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->join('pegawai_m as pg','pg.id','=','lu.objectpegawaifk')
            ->select('lu.objectpegawaifk','pg.namalengkap')
            ->where('pg.kdprofile',$idProfile)
            ->where('lu.id',$dataLogin['userData']['id'])
            ->first();

        $dataInstalasi = \DB::table('departemen_m as dp')
//            ->whereIn('dp.id', array(3, 14, 16, 17, 18, 19, 24, 25, 26, 27, 28, 35))
            ->where('dp.kdprofile',$idProfile)
            ->where('dp.statusenabled', true)
            ->orderBy('dp.namadepartemen')
            ->get();

        $dataRuangan = \DB::table('ruangan_m as ru')
            ->where('ru.kdprofile',$idProfile)
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();

        $dept = \DB::table('departemen_m as dept')
            ->where('dept.kdprofile',$idProfile)
            ->where('dept.id', '18')
            ->where('dept.statusenabled', true)
            ->orderBy('dept.namadepartemen')
            ->get();

        $deptRajalInap = \DB::table('departemen_m as dept')
            ->where('dept.kdprofile',$idProfile)
            ->whereIn('dept.id', [18, 16])
            ->where('dept.statusenabled', true)
            ->orderBy('dept.namadepartemen')
            ->get();

        $ruanganRi = \DB::table('ruangan_m as ru')
            ->where('ru.kdprofile',$idProfile)
            ->wherein('ru.objectdepartemenfk', ['18', '28'])
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();

        $dataDokter = \DB::table('pegawai_m as ru')
            ->where('ru.kdprofile',$idProfile)
            ->where('ru.statusenabled', true)
            ->where('ru.objectjenispegawaifk', 1)
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
            ->orderBy('dm.id')
            ->get();

        $KelompokKerja = \DB::table('kelompokkerja_m as dm')
            ->select('dm.id', 'dm.kelompokkerja')
            ->where('dm.statusenabled', true)
            ->orderBy('dm.id')
            ->get();

        $dataJenisKelamin = \DB::table('jeniskelamin_m as jk')
            ->where('jk.statusenabled', true)
            ->orderBy('jk.jeniskelamin')
            ->get();
        $deptJalan = explode(',',$this->settingDataFixed('PemanggilAntrianByDepartement',$idProfile));
        $PemanggilAntrianByDepartement = [];
        foreach ($deptJalan as $item) {
            $PemanggilAntrianByDepartement[] =  (int)$item;
        }
        $ruangperawat = \DB::table('ruangan_m as ru')
        ->whereIn('ru.objectdepartemenfk',$PemanggilAntrianByDepartement )
        ->where('ru.statusenabled', true)
        ->where('ru.kdprofile', $idProfile)
        ->orderBy('ru.id')
        ->get();
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
        //    'kddiagnosa' => $kdeDiagnosa,
            'kelompokkerjahead' => $KelompokKerjaHead,
            'kelompokkerja' => $KelompokKerja,
            'pegawaiLogin' => $dataPegawai->namalengkap,
            'jeniskelamin' => $dataJenisKelamin,
            'ruangperawat'=> $ruangperawat,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }
    public function getDaftarRegistrasiDokterRajal(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $filter = $request->all();
        $data = \DB::table('antrianpasiendiperiksa_t as apd')
            ->join('pasiendaftar_t as pd','pd.norec','=','apd.noregistrasifk')
            // ->leftjoin('batalregistrasi_t as br','br.pasiendaftarfk','=','pd.norec')
//            ->leftjoin('strukpelayanan_t as sp','sp.norec','=','pd.nostruklastfk')
//            ->leftjoin('strukbuktipenerimaan_t as sbm','sbm.norec','=','pd.nosbmlastfk')
            ->join('pasien_m as ps', 'ps.id','=','pd.nocmfk')
            ->leftjoin('alamat_m as alm', 'ps.id','=','alm.nocmfk')
            ->leftjoin('jeniskelamin_m as jk','jk.id','=','ps.objectjeniskelaminfk')
            ->join('kelas_m as kls','kls.id','=','pd.objectkelasfk')
            ->join('ruangan_m as ru','ru.id','=','apd.objectruanganfk')
            // ->leftJoin('departemen_m as dept','dept.id','=','ru.objectdepartemenfk')
            ->leftJoin('pegawai_m as pg','pg.id','=','apd.objectpegawaifk')
            ->leftJoin('pegawai_m as pg2','pg2.id','=','apd.residencefk')
            ->Join('kelompokpasien_m as kp','kp.id','=','pd.objectkelompokpasienlastfk')
            ->leftjoin('rekanan_m as rek','rek.id','=','pd.objectrekananfk')
            ->leftjoin('antrianpasienregistrasi_t as apr', function ($join){
                $join->on('apr.noreservasi','=','pd.statusschedule');
                $join->on('apr.nocmfk','=','pd.nocmfk');
            })
            ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('asuransipasien_m as asu', 'pa.objectasuransipasienfk', '=', 'asu.id')
            ->leftjoin('kelas_m as klstg','klstg.id','=','asu.objectkelasdijaminfk')
//            ->leftjoin('detaildiagnosapasien_t AS ddp','ddp.noregistrasifk','=','apd.norec')
//            ->leftjoin('diagnosapasien_t AS dp','dp.norec','=','ddp.objectdiagnosapasienfk')
//            ->leftjoin('diagnosa_m as dg','ddp.objectdiagnosafk','=','dg.id')
            // ->leftjoin('pelayananpasien_t as pp','pp.noregistrasifk','=','apd.norec')
            ->select('pd.tglregistrasi','ps.nocm','pd.nocmfk','pd.noregistrasi','ps.namapasien','ps.tgllahir','jk.jeniskelamin','apd.objectruanganfk','ru.namaruangan','kls.id as idkelas','kls.namakelas',
                            'pd.objectkelompokpasienlastfk','kp.kelompokpasien','rek.namarekanan','apd.objectpegawaifk','pg.namalengkap as namadokter','pd.norec as norec_pd','apd.norec as norec_apd','apd.objectasalrujukanfk',
                            'apd.tgldipanggildokter','apd.statuspasien as statuspanggil','pd.statuspasien','apd.tgldipanggildokter','apd.tgldipanggilsuster','apr.noreservasi','apd.noantrian',
                            'apr.tanggalreservasi',  'alm.alamatlengkap','klstg.namakelas as kelasdijamin', 'apd.tglselesaiperiksa','pd.objectruanganlastfk', 'ru.objectdepartemenfk',
//                'ps.foto',
                'apd.norec as norec_apd',
                'ru.ipaddress','ps.iskompleks','apd.residencefk','pg2.namalengkap as residence'
                // ,DB::raw('case when pp.noregistrasifk is null then \'false\' else \'true\' end as statuslayanan'))
                ,DB::raw('case when apd.ispelayananpasien is null then \'false\' else \'true\' end as statuslayanan'))
            // ->whereNull('br.norec')
            ->where('apd.kdprofile', $idProfile)
            ->where('pd.statusenabled',true)
            ->where('ps.statusenabled',true);
//            ->whereNotIn('ru.objectdepartemenfk',[27,3]);
        // ->groupBy('pd.tglregistrasi','ps.nocm','pd.noregistrasi','ps.namapasien','ps.tgllahir','jk.jeniskelamin','apd.objectruanganfk','ru.namaruangan','kls.id','kls.namakelas',
        //           'kp.kelompokpasien','rek.namarekanan','apd.objectpegawaifk','pg.namalengkap','br.norec','pd.norec','apd.norec','apd.objectasalrujukanfk',
        //           'apd.tgldipanggildokter','apd.statuspasien','pd.statuspasien','apd.tgldipanggildokter','apd.tgldipanggilsuster','apr.noreservasi',
        //           'apr.tanggalreservasi','pp.noregistrasifk','apd.noantrian','alm.alamatlengkap');

        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '<=', $filter['tglAkhir']);
        }
        if (isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined") {
            $data = $data->where('ru.id', '=', $filter['ruangId']);
        }
        if (isset($filter['dokId']) && $filter['dokId'] != "" && $filter['dokId'] != "undefined") {
            $data = $data->where('pg.id', '=', $filter['dokId']);
        }
        if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
            $data = $data->where('pd.noregistrasi','=', $filter['noreg']);
        }
        if (isset($filter['norm']) && $filter['norm'] != "" && $filter['norm'] != "undefined") {
            $data = $data->where('ps.nocm', 'ilike', '%' . $filter['norm'] . '%');
        }
        if (isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $data = $data->where('ps.namapasien', 'ilike', '%' . $filter['nama'] . '%');
        }
        if (isset($filter['norecApd']) && $filter['norecApd'] != "" && $filter['norecApd'] != "undefined") {
            $data = $data->where('apd.norec',  $filter['norecApd'] );
        }
        if(isset($request['ruanganArr']) && $request['ruanganArr']!="" && $request['ruanganArr']!="undefined"){
            $arrRuang = explode(',',$request['ruanganArr']) ;
            $kodeRuang = [];
            foreach ( $arrRuang as $item){
                $kodeRuang[] = (int) $item;
            }
            $data = $data->whereIn('ru.id',$kodeRuang);
        }
        if (isset($filter['jmlRow']) && $filter['jmlRow'] != "" && $filter['jmlRow'] != "undefined") {
            $data = $data->take($filter['jmlRow']);
        }
        $data = $data->whereIn('ru.objectdepartemenfk',[18,24,28,26,30,34]);
//        $data = $data->orderBy('pd.tglregistrasi');
        $data = $data->orderBy('apd.noantrian');
        $data = $data->get();
        $norecaPd = '';
        foreach ($data as $ob){
            $norecaPd = $norecaPd.",'".$ob->norec_apd . "'";
            $ob->kddiagnosa = [];
        }
        $norecaPd = substr($norecaPd, 1, strlen($norecaPd)-1);
        $diagnosa = [];
        if($norecaPd!= ''){
            $diagnosa = DB::select(DB::raw("
               select dg.kddiagnosa,ddp.noregistrasifk as norec_apd
               from detaildiagnosapasien_t as ddp
               left join diagnosapasien_t as dp on dp.norec=ddp.objectdiagnosapasienfk
               left join diagnosa_m as dg on ddp.objectdiagnosafk=dg.id
               where ddp.noregistrasifk in ($norecaPd) "));
            $i = 0;
//            $d['d']= $diagnosa;
//            $d['da']= $norecaPd;
//            return $this->respond($d);
           foreach ($data as $h){
               $data[$i]->kddiagnosa = [];
               foreach ($diagnosa as $d){
                   if($data[$i]->norec_apd == $d->norec_apd){
                       $data[$i]->kddiagnosa[] = $d->kddiagnosa;
                   }
               }
               $i++;
//               if($data[$i]->kddiagnosa!=''){
//                   $data[$i]->kddiagnosa = substr($data[$i]->kddiagnosa,1);
//               }
           }
        }
        //        if(count($data) > 0){
//            foreach ($data as $item){
//                if($item->foto != null ){
//                    $item->foto = "data:image/jpeg;base64," . base64_encode($item->foto);
//                }
//            }
//        }
        return $this->respond($data);
    }
    public function pasienBatalPanggil(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        DB::beginTransaction();
        try {

            if ($request['norec_apd']!=null) {
                $ddddd = AntrianPasienDiperiksa::where('norec', $request['norec_apd'])
                    ->where('kdprofile', $idProfile)
                    ->update([
                            'statusantrian' => 0]

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
                "struk" => $ddddd,//$noResep,,//$noResep,
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
    public function updateDokterAntrian(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        DB::beginTransaction();
        try {

            if ($request['norec_apd']!=null) {
                $apd =  AntrianPasienDiperiksa::where('norec', $request['norec_apd'])->where('kdprofile', $idProfile)->first();
                $ddddd = AntrianPasienDiperiksa::where('norec', $request['norec_apd'])
                    ->where('kdprofile', $idProfile)
                    ->update([
                            'objectpegawaifk' => $request['iddokter']
                        ]

                    );

                $pasienDaftar = PasienDaftar::where('norec',$apd->noregistrasifk)
                    ->where('kdprofile', $idProfile)
                    ->update([
                    'objectpegawaifk' => $request['iddokter']
                ]);
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
                "struk" => $ddddd,//$noResep,,//$noResep,
                "as" => 'ramdanegie',
            );
        } else {
            $transMessage = "Simpan  Tanggal Pulang Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "struk" => $ddddd,
                "as" => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveIndikatorPasienJatuh(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        DB::beginTransaction();
        try{
            if ($request['norec'] == ''){
                $new = new IndikatorPasienJatuh();
                $new->kdprofile = $idProfile;
                $new->norec = $new->generateNewId();

            }else{
                $new = IndikatorPasienJatuh::where('norec', $request['norec'])->first();
            }

            $new->statusenabled = $request['statusenabled'];
            $pasien = Pasien::where('nocm', $request['nocm'])->first();
            if(isset($request['nocmfk'])){
                $new->nocmfk = $request['nocmfk'] ;
            }ELSE{
                $new->nocmfk =$pasien->id;
            }

            $new->noregistrasifk = $request['noregistrasifk'] ;
            $new->tgljatuh = $request['tgljatuh'] ;
            $new->keterangan = $request['keterangan'] ;
            $new->jumlah = $request['jumlah'] ;
            $new->save();

            $transStatus = 1;
        } catch (\Exception $e) {
            $transStatus = false;
        }

        if ($transStatus) {
            $transMessage = 'Sukses';
            DB::commit();
            $result = array(
                'status' => 201,
                'result' => $new,
                'as' => 'inhuman',
            );
        } else {
            $transMessage = 'Simpan Gagal';
            DB::rollBack();
            $result = array(
                'status' => 400,
                'as' => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function savePanggilDokter(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        DB::beginTransaction();
        try {
            $apd = AntrianPasienDiperiksa::where('norec',$request['norec_apd'])->where('kdprofile', $idProfile)->first();
            if(isset($request['kelompokUser']) && $request['kelompokUser'] != 'suster' ){

                if($apd->tgldipanggildokter == null){
                    AntrianPasienDiperiksa::where('norec', $request['norec_apd'])
                        ->where('kdprofile', $idProfile)
                        ->update([
                            'tgldipanggildokter' => date('Y-m-d H:i:s'),
                        ]);
                }

            }else{
                if($apd->tgldipanggilsuster == null) {
                    AntrianPasienDiperiksa::where('norec', $request['norec_apd'])
                        ->where('kdprofile', $idProfile)
                        ->update([
                            'tgldipanggilsuster' => date('Y-m-d H:i:s'),
                        ]);
                }
            }
            $norecs = AntrianPasienDiperiksa::where('norec', $request['norec_apd'])
            ->where('kdprofile', $idProfile)
            ->first();
   

            $pd = PasienDaftar::where('norec', $norecs->noregistrasifk)->first();
            $ihs = null;
            if($pd->ihs_in_progress == null){
                PasienDaftar::where('norec', $norecs->noregistrasifk)->update([
                    'ihs_in_progress'=> date('Y-m-d H:i:s'),
                ]);
                $objetoRequest = new \Illuminate\Http\Request();
                $objetoRequest ['noregistrasi']= $pd->noregistrasi;
                if($pd->ihs_diagnosis != null){
                    $objetoRequest ['diagnosis']=  json_decode($pd->ihs_diagnosis);
                }
                $ihs = app('App\Http\Controllers\Bridging\IHSController')->Encounter($objetoRequest,true);
               
            }       
            $transStatus ='true';
            $transMessage = "Sukses";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Gagal";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "Encounter" => $ihs,
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
    public function saveDaftarSurat(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        DB::beginTransaction();
        try {
        $jenisSurat = DB::table('jenissurat_m')
            ->select('*')
            ->where('id',$request['jenissuratID'])
            ->first();
        $kodeSurat = '';
        if(!empty($jenisSurat)){
            $kodeSurat =$jenisSurat->kodeexternal;
        }

        $bln = date('m');
        $romawi = $this->KonDecRomawi($bln);
        $pre ='/RSM/'.$kodeSurat.'/'.$romawi.'/'.date('Y');
        $pre2 =date('Y').'/'.$bln.'/';
//        $nosurat= $this->genCode(new SuratKeterangan(),'nosint',21,$pre);
        $nosint= $pre2.$this->genCode2(new SuratKeterangan(),'nosint',3).'/RSM/'.$kodeSurat;
        $nosurat = substr(trim($nosint),8,3).$pre;

//        return $nosint;

            if($request['norec'] == ''){
                $newptp = new SuratKeterangan();
                $newptp->norec = $newptp->generateNewId();
                $newptp->statusenabled = true;
                $newptp->kdprofile = $idProfile;
                $newptp->pasiendaftarfk = $request['pasiendaftarfk'];
            }else{
                $newptp = SuratKeterangan::where('norec',$request['norec'])->first();
                $nosint= str_replace(substr(trim($newptp->nosint),16),$kodeSurat,$newptp->nosint);
                $nosurat=str_replace(substr(trim($newptp->nosint),16),$kodeSurat,$newptp->nosurat);
            }


            $newptp->tglsurat =  $request['tglsurat'];
            $newptp->pegawaifk =  $request['namapegID'];
            $newptp->dokterfk =  $request['dokterID'];
            $newptp->jenissuratfk =  $request['jenissuratID'];
            $newptp->keterangan =  $request['keterangan'];
            $newptp->nosurat =  $nosurat;
            $newptp->nosint = $nosint;


            $newptp->save();

            $transMessage = "Simpan Surat Keterangan Berhasil";
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Surat Keterangan gagal";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "data" =>$newptp,
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            DB::rollBack();
            $result = array(
//				"noRec" =>$noRec,
                "status" => 400,
                "message" => $transMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDetailpasienSurat(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $pelayanan = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
            ->join('pasien_m as pas', 'pas.id', '=', 'pd.nocmfk')
            ->leftjoin('agama_m as ag', 'ag.id', '=', 'pas.objectagamafk')
            ->leftjoin('jeniskelamin_m as jkel', 'jkel.id', '=', 'pas.objectjeniskelaminfk')
            ->leftjoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftjoin('kelas_m as kls2', 'kls2.id', '=', 'pd.objectkelasfk')
            ->join('ruangan_m as ru2', 'ru2.id', '=', 'pd.objectruanganlastfk')
            ->leftjoin('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
            ->leftjoin('kamar_m as kamar', 'kamar.id', '=', 'apd.objectkamarfk')
            ->leftjoin('pendidikan_m as pdd', 'pas.objectpendidikanfk','=','pdd.id' )
            ->leftjoin('alamat_m as al','al.nocmfk','=','pas.id')
            ->leftjoin ('pekerjaan_m as pk','pas.objectpekerjaanfk','=','pk.id')
            ->select( 'apd.norec as norec_apd', 'pd.nocmfk','al.alamatlengkap','pdd.pendidikan','pk.pekerjaan',
                'pd.nocmfk', 'pd.nostruklastfk', 'ag.id as agid', 'ag.agama', 'pas.tgllahir',
                'kp.id as kpid', 'kp.kelompokpasien as jenisPasien', 'pas.objectstatusperkawinanfk', 'pas.namaayah', 'pas.namasuamiistri',
                'pas.id as pasid', 'pas.nocm as noCm', 'jkel.id as jkelid', 'jkel.jeniskelamin', 'jkel.reportdisplay as jenisKelamin', 'pd.noregistrasi as noRegistrasi', 'pas.namapasien as namaPasien',
                'pd.tglregistrasi as tglMasuk', 'pd.norec as norec_pd', 'pd.tglpulang as tglPulang', 'pas.notelepon',
                'pd.objectrekananfk as rekananid', 'kls2.id as klsid2', 'kls2.namakelas as kelasRawat',
                'rk.namarekanan as namaPenjamin','ru2.namaruangan as lastRuangan','sp.nostruk','sp.norec as strukfk','pd.statuspasien as StatusPasien'
            )
            ->where('pd.kdprofile',$idProfile)
            ->take(1)
            ->where('pd.noregistrasi', $request['noregistrasi'])
            ->get();


        $result = array(
            'data' => $pelayanan,
            'message' => 'as@epic',
        );

        return $this->respond($pelayanan);
    }
    public function getDaftarSurat(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $filter = $request->all();
        $data = \DB::table('suratketerangan_t as sk')
            ->join('pasiendaftar_t as pd', 'pd.norec','=','sk.pasiendaftarfk')
            ->leftJoin('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            //            ->leftjoin('antrianpasiendiperiksa_t as apd','apd.noregistrasifk','=','pd.norec')
            ->leftjoin('loginuser_s as lu', 'lu.id', '=', 'sk.pegawaifk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'lu.objectpegawaifk')
            ->leftjoin('pegawai_m as pg2', 'pg2.id', '=', 'sk.dokterfk')
            ->leftJoin('alamat_m as alm', 'alm.nocmfk', '=', 'ps.id')
            ->leftjoin('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->leftJoin('golongandarah_m as gol','gol.id','=','ps.objectgolongandarahfk')
            ->leftJoin('jenissurat_m as js','js.id','=','sk.jenissuratfk')
            ->select('sk.*','pd.tglregistrasi','pd.noregistrasi','ps.namapasien','ps.nocm','ps.tgllahir',
                'pg2.namalengkap as namadokter','pg.namalengkap as namapegawai','jk.jeniskelamin','alm.alamatlengkap','gol.golongandarah','js.name as namasurat')
            ->where('sk.kdprofile', $idProfile)
            ->where('sk.statusenabled', true);

        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('sk.tglsurat', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $data = $data->where('sk.tglsurat', '<=', $filter['tglAkhir']);
        }

//       if (isset($filter['deptId']) && $filter['deptId'] != "" && $filter['deptId'] != "undefined") {
//           $data = $data->where('dept.id', '=', $filter['deptId']);
//       }
//       if (isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined") {
//           $data = $data->where('ru.id', '=', $filter['ruangId']);
//       }
//       if (isset($filter['kelId']) && $filter['kelId'] != "" && $filter['kelId'] != "undefined") {
//           $data = $data->where('kp.id', '=', $filter['kelId']);
//       }
        if (isset($filter['dokId']) && $filter['dokId'] != "" && $filter['dokId'] != "undefined") {
            $data = $data->where('pg2.id', '=', $filter['dokId']);
        }
//       if (isset($filter['sttts']) && $filter['sttts'] != "" && $filter['sttts'] != "undefined") {
//           $data = $data->where('pd.statuspasien', '=', $filter['sttts']);
//       }
        if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $filter['noreg']);
        }
        if (isset($filter['norm']) && $filter['norm'] != "" && $filter['norm'] != "undefined") {
            $data = $data->where('ps.nocm', 'ilike', '%' . $filter['norm'] . '%');
        }
        if (isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $data = $data->where('ps.namapasien', 'ilike', '%' . $filter['nama'] . '%');
        }
        if (isset($filter['jmlRows']) && $filter['jmlRows'] != "" && $filter['jmlRows'] != "undefined") {
            $data = $data->take($filter['jmlRows']);
        }
        $data = $data->orderBy('sk.tglsurat');
//       $data = $data->groupBy('pd.norec', 'pd.statusenabled', 'pd.tglregistrasi', 'ps.nocm', 'pd.nocmfk', 'pd.noregistrasi',
//           'ru.namaruangan', 'ps.namapasien',
//           'kp.kelompokpasien', 'rek.namarekanan', 'pg.namalengkap', 'pd.tglpulang', 'pd.statuspasien',
//           'pa.nosep', 'br.norec', 'pa.norec', 'pa.objectasuransipasienfk', 'pd.objectpegawaifk', 'pd.objectruanganlastfk',
//           'pd.nostruklastfk', 'ps.tgllahir','pd.objectkelasfk','kls.namakelas','ps.objectjeniskelaminfk','jk.jeniskelamin',
//           'alm.alamatlengkap','pd.jenispelayanan','jp.jenispelayanan','gol.golongandarah');
//        $data = $data->take($filter['jmlRows']);
        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'ridwan',
        );
        return $this->respond($result);
    }
    public function getDaftarPasienByDiagnosa(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $filter = $request->all();
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftjoin('antrianpasiendiperiksa_t as apd','apd.noregistrasifk','=','pd.norec')
            ->leftjoin('diagnosatindakanpasien_t as dtp','dtp.objectpasienfk','=','apd.norec')
            ->leftjoin('detaildiagnosapasien_t as ddp','ddp.noregistrasifk','=', 'apd.norec')
            ->leftjoin('detaildiagnosatindakanpasien_t as ddtp','ddtp.objectdiagnosatindakanpasienfk','=','dtp.norec')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftJoin('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            ->leftjoin('batalregistrasi_t as br', 'br.pasiendaftarfk', '=', 'pd.norec')
            ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
            ->leftJoin('strukpelayanan_t as sp', 'sp.norec', '=', 'pd.nostruklastfk')
            ->leftJoin('strukbuktipenerimaan_t as sbm', 'sbm.norec', '=', 'pd.nosbmlastfk')
            ->leftjoin('loginuser_s as lu', 'lu.id', '=', 'sbm.objectpegawaipenerimafk')
            ->leftjoin('pegawai_m as pgs', 'pgs.id', '=', 'lu.objectpegawaifk')
            ->leftjoin('rekanan_m as rek', 'rek.id', '=', 'pd.objectrekananfk')
            ->leftjoin('diagnosa_m as dg','dg.id','=','ddp.objectdiagnosafk')
            ->leftjoin('diagnosatindakan_m as dt','dt.id','=','ddtp.objectdiagnosatindakanfk')
            ->select('pd.norec','pd.statusenabled','pd.tglregistrasi','ps.nocm','pd.nocmfk','pd.noregistrasi','ru.namaruangan','ps.namapasien','kp.kelompokpasien',
                'rek.namarekanan','pg.namalengkap as namadokter','pd.tglpulang','pd.statuspasien','pa.norec as norec_pa','pa.objectasuransipasienfk',
                'pd.objectpegawaifk as pgid','pd.objectruanganlastfk','pa.nosep as nosep','br.norec as norec_br','pd.nostruklastfk',
                'ddp.objectdiagnosafk','dg.kddiagnosa','dg.namadiagnosa','ddp.objectjenisdiagnosafk',
                'ddtp.objectdiagnosatindakanfk','dt.kddiagnosatindakan','dt.namadiagnosatindakan')
            ->where('pd.kdprofile', $idProfile)
            ->whereNull('br.norec')
            ->where('ddp.objectjenisdiagnosafk',1);

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
        if (isset($filter['objectdiagnosafk']) && $filter['objectdiagnosafk'] != "" && $filter['objectdiagnosafk'] != "undefined") {
            $data = $data->where('ddp.objectdiagnosafk', '=', $filter['objectdiagnosafk']);
        }
        if (isset($filter['objectdiagnosatindakanfk']) && $filter['objectdiagnosatindakanfk'] != "" && $filter['objectdiagnosatindakanfk'] != "undefined") {
            $data = $data->where('ddtp.objectdiagnosatindakanfk', '=', $filter['objectdiagnosatindakanfk']);
        }
        $data = $data->orderBy('pd.noregistrasi');
        $data = $data->groupBy('pd.norec','pd.statusenabled','pd.tglregistrasi','ps.nocm','pd.nocmfk','pd.noregistrasi','ru.namaruangan','ps.namapasien','kp.kelompokpasien',
            'rek.namarekanan','pg.namalengkap','pd.tglpulang','pd.statuspasien','pa.nosep','br.norec','pa.norec','pa.objectasuransipasienfk','pd.objectpegawaifk',
            'pd.objectruanganlastfk','pd.nostruklastfk','dg.kddiagnosa','dg.namadiagnosa','dt.kddiagnosatindakan',
            'ddtp.objectdiagnosatindakanfk','dt.namadiagnosatindakan','dg.kddiagnosa','dt.kddiagnosatindakan','ddp.objectdiagnosafk','ddp.objectjenisdiagnosafk');
//        $data = $data->take(50);
        $data = $data->get();

        $result = array(
            'data' => $data,
            'message' => 'Cepot',
        );
        return $this->respond($result);
    }
    public function getOrderKonsul(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $arrRuangId = [];
        if(isset($request['perawatId']) && $request['perawatId'] != ''){
            $dataruangan = \DB::table('maploginusertoruangan_s as mlu')
                ->join('ruangan_m as ru','ru.id','=','mlu.objectruanganfk')
                ->select('ru.id','ru.namaruangan')
                ->where('mlu.kdprofile', $idProfile)
                ->where('mlu.objectloginuserfk',$request['perawatId'])
                ->get();

            if(count($dataruangan) > 0){
                foreach ($dataruangan as $item){
                    $arrRuangId []  =$item->id ;
                }
            }
        }


        $kelTrans = KelompokTransaksi::where('kelompoktransaksi','KONSULTASI DOKTER')->first();
        $data= \DB::table('strukorder_t as so')
            ->Join ('pasiendaftar_t as pd','pd.norec','=','so.noregistrasifk')
            ->Join('pasien_m as ps','ps.id','=','pd.nocmfk')
            ->leftJoin('ruangan_m as ru','ru.id','=','so.objectruanganfk')
            ->leftJoin('ruangan_m as rutuju','rutuju.id','=','so.objectruangantujuanfk')
            ->leftJoin('pegawai_m as pg','pg.id','=','so.objectpegawaiorderfk')
            ->leftJoin('pegawai_m as pet','pet.id','=','so.objectpetugasfk')
            ->leftJoin('antrianpasiendiperiksa_t as apd','apd.objectstrukorderfk','=','so.norec')
            ->select('so.norec','so.noorder','so.tglorder','ru.namaruangan as ruanganasal','pg.namalengkap',
                'rutuju.namaruangan as ruangantujuan','pet.namalengkap as pengonsul',
                'pd.noregistrasi','pd.tglregistrasi','ps.nocm','so.keteranganorder','pd.norec as norec_pd',
                'ps.namapasien','pg.id as pegawaifk','so.objectruangantujuanfk','so.objectruanganfk','apd.norec as norec_apd')
            ->where('so.kdprofile', $idProfile)
            ->where('so.statusenabled',true)
            ->wherenull('apd.norec')
            ->where('so.objectkelompoktransaksifk',$kelTrans->id)
            ->orderBy('so.tglorder','desc');
        if(isset($request['norecpd']) && $request['norecpd'] != ''){
            $data = $data->where('pd.norec', $request['norecpd']);
        }
        if(isset($request['dokterid']) && $request['dokterid'] != ''){
            $data = $data->where('pg.id', $request['dokterid']);
        }
        if(isset($request['perawatId']) && $request['perawatId'] != ''){
            $data = $data->whereIn('rutuju.id',$arrRuangId);
        }

        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'Inhuman',
        );
        return $this->respond($result);
    }
    public function saveKonsulFromOrder(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        DB::beginTransaction();
        try {
            $pd = PasienDaftar::where('norec',$request['norec_pd'])->first();
            $apd = AntrianPasienDiperiksa::where('noregistrasifk',$request['norec_pd'])->first();
            $dataAPD = new AntrianPasienDiperiksa;
            $dataAPD->norec = $dataAPD->generateNewId();
            $dataAPD->kdprofile = $idProfile;
            $dataAPD->statusenabled = true;
            $dataAPD->objectasalrujukanfk = $apd->objectasalarujukanfk;
            $dataAPD->objectkelasfk = $request['kelasfk'];
            $dataAPD->noantrian = $request['noantrian'];
            $dataAPD->noregistrasifk = $request['norec_pd'];
            $dataAPD->objectpegawaifk = $request['dokterfk'];
            $dataAPD->objectruanganfk = $request['objectruangantujuanfk'];
            $dataAPD->statusantrian = 0;
            $dataAPD->statuspasien = 1;
            $dataAPD->statuskunjungan = 'LAMA';
            $dataAPD->statuspenyakit = 'BARU';
            $dataAPD->objectruanganasalfk = $request['objectruanganasalfk'];;
            $dataAPD->tglregistrasi = $pd->tglregistrasi;//date('Y-m-d H:i:s');
            $dataAPD->tglkeluar = date('Y-m-d H:i:s');
            $dataAPD->tglmasuk = date('Y-m-d H:i:s');
            $dataAPD->objectstrukorderfk = $request['norec_so'];
            $dataAPD->save();

            // $strukOrder = StrukOrder::where('norec',$request['norec_so'])->update([
            //         'keteranganlainnya' =>$request['jawaban'] 
            //     ]);

            $dataAPDnorec = $dataAPD->norec;
            $transStatus = 'true';
            $transMessage = "simpan AntrianPasienDiperiksa";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan Gagal";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => $dataAPD,
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getComboS(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataInstalasi = \DB::table('departemen_m as dp')
            ->where('dp.kdprofile', $idProfile)
            ->whereIn('dp.id', array(3, 14, 16, 17, 18, 19, 24, 25, 26, 27, 28, 35))
            ->where('dp.statusenabled', true)
            ->orderBy('dp.namadepartemen')
            ->get();

        $dataRuangan = \DB::table('ruangan_m as ru')
            ->where('ru.kdprofile', $idProfile)
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();



        $dataDokter = \DB::table('pegawai_m as ru')
            ->where('ru.kdprofile', $idProfile)
            ->where('ru.statusenabled', true)
            ->where('ru.objectjenispegawaifk', 1)
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


        $result = array(
            'departemen' => $dataDepartemen,
            'kelompokpasien' => $dataKelompok,
            'dokter' => $dataDokter,

            'message' => 'as@epic',
        );

        return $this->respond($result);
    }
    public function getPemeriksaanKeluarLab(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $data = \DB::table('pelayananpasien_t as pp ')
            ->leftjoin('antrianpasiendiperiksa_t as apd','apd.norec','=','pp.noregistrasifk')
            ->LEFTJOIN('pasiendaftar_t as pd','pd.norec','=','apd.noregistrasifk')
            ->LEFTJOIN('kelompokpasien_m as kps','kps.id','=','pd.objectkelompokpasienlastfk')
            ->LEFTJOIN('ruangan_m as ru','ru.id','=','apd.objectruanganfk')
            ->LEFTJOIN('ruangan_m as ru2','ru2.id','=','pd.objectruanganlastfk')
            ->LEFTJOIN('pasien_m as ps','ps.id','=','pd.nocmfk')
            ->LEFTJOIN('pegawai_m as p','p.id','=','apd.objectpegawaifk')
            ->LEFTJOIN('produk_m as prd','prd.id','=','pp.produkfk')
            ->select('pp.norec','pd.norec as norecpd', 'pd.noregistrasi','pp.tglpelayanan' ,
                'ru.namaruangan' ,'p.namalengkap','ps.nocm','ps.namapasien',  'kps.kelompokpasien',
                'prd.namaproduk','pp.jumlah','pp.keteranganlain','pd.tglregistrasi','ru2.namaruangan as ruanganlast'
            )
            ->where('pp.kdprofile',$idProfile);
        if(isset($request['tglAwal']) && $request['tglAwal']!="" && $request['tglAwal']!="undefined"){
            $data = $data->where('pp.tglpelayanan','>=', $request['tglAwal']);
        }
        if(isset($request['tglAkhir']) && $request['tglAkhir']!="" && $request['tglAkhir']!="undefined"){
            $data = $data->where('pp.tglpelayanan','<=', $request['tglAkhir']);
        }
        if(isset($request['noregistrasi']) && $request['noregistrasi']!="" && $request['noregistrasi']!="undefined"){
            $data = $data->where('pd.noregistrasi','=', $request['noregistrasi']);
        }
        if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('ps.nocm','ilike','%'.$request['nocm'].'%');
        }
        if(isset($request['namapasien']) && $request['namapasien']!="" && $request['namapasien']!="undefined"){
            $data = $data->where('ps.namapasien','ilike','%'.$request['namapasien'].'%');
        }
//        if(isset($request['noOrder']) && $request['noOrder']!="" && $request['noOrder']!="undefined"){
//            $data = $data->where('so.noorder','ilike','%'.$request['noOrder'].'%');
//        }
        if(isset($request['kelPasienId']) && $request['kelPasienId']!="" && $request['kelPasienId']!="undefined"){
            $data = $data->where('kps.id','=', $request['kelPasienId']);
        }
        if(isset($request['ruangId']) && $request['ruangId']!="" && $request['ruangId']!="undefined"){
            $data = $data->where('ru2.id','=', $request['ruangId']);
        }
        if(isset($request['deptId']) && $request['deptId']!="" && $request['deptId']!="undefined"){
            $data = $data->where('ru.objectdepartemenfk','=', $request['deptId']);
        }
        if(isset($request['jmlRows']) && $request['jmlRows']!="" && $request['jmlRows']!="undefined"){
            $data = $data->take($request['jmlRows']);
        }
        $data = $data->where('pp.keteranganlain','Pemeriksaan Keluar');
//        $data = $data->where('apd.objectruanganfk',276);
        $data = $data->orderBy('pp.tglpelayanan');
//        $data = $data->distinct();
        $data = $data->get();

//        //$results =array();
//        foreach ($data as $item){
//            $details = DB::select(DB::raw("
//                            select so.tglorder,so.noorder,
//                            pr.id,pr.namaproduk,op.qtyproduk
//                            from strukorder_t as so
//                            left join orderpelayanan_t as op on op.noorderfk = so.norec
//                            left join pasiendaftar_t as pd on pd.norec=so.noregistrasifk
//                            left join produk_m as pr on pr.id=op.objectprodukfk
//                            left join ruangan_m as ru on ru.id=so.objectruanganfk
//                            left join ruangan_m as ru2 on ru2.id=so.objectruangantujuanfk
//                            left join pegawai_m as p on p.id=so.objectpegawaiorderfk
//                            where so.noorder=:noorder
//                            and op.keteranganlainnya = 'isPemeriksaanKeluar'"),
//                array(
//                    'noorder' => $item->noorder,
//                )
//            );
//            $results[] = array(
//                'tglorder' => $item->tglorder,
//                'noorder' => $item->noorder,
//                'norec' => $item->norec,
//                'nocm' => $item->nocm,
//                'namapasien' => $item->namapasien,
//                'noregistrasi' => $item->noregistrasi,
//                'kelompokpasien' => $item->kelompokpasien,
//                'norecpd' => $item->norecpd,
////                'norecapd' => $item->norecapd,
//                'namaruanganasal' => $item->ruanganasal,
//                'namaruangantujuan' => $item->ruangantujuan,
//                'dokter' => $item->namalengkap,
//                'statusorder'=>$item->statusorder,
//                'details' => $details,
//            );
//        }

        $result = array(
            'data' => $data,
            'message' => 'er@epic',
        );

        return $this->respond($result);
    }
    public function savePasienKompleks(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        DB::beginTransaction();
        try {
            $pasien = Pasien::where('nocm',$request['nocm'])
                ->where('kdprofile',$idProfile)
                ->update([
                    'iskompleks' => $request['iskompleks']
                ]
            );

            $transStatus = 'true';
            $transMessage = "Sukses";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan Gagal";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,

            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveResidence(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        DB::beginTransaction();
        try {

            if ($request['norec_apd']!=null) {
                $apd =  AntrianPasienDiperiksa::where('norec', $request['norec_apd'])->where('kdprofile',$idProfile)->first();
                $ddddd = AntrianPasienDiperiksa::where('norec', $request['norec_apd'])
                    ->where('kdprofile',$idProfile)
                    ->update([
                            'residencefk' => $request['iddokter']
                        ]
                    );

                $pasienDaftar = PasienDaftar::where('norec',$apd->noregistrasifk)
                    ->where('kdprofile',$idProfile)
                    ->update([
                    'residencefk' => $request['iddokter']
                ]);
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
                "struk" => $ddddd,//$noResep,,//$noResep,
                "as" => 'ramdanegie',
            );
        } else {
            $transMessage = "Simpan Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "struk" => $ddddd,
                "as" => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDaftarKonsulFromOrder(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $filter = $request->all();
        $data = \DB::table('antrianpasiendiperiksa_t as apd')
            ->Join('strukorder_t as so','so.norec','=','apd.objectstrukorderfk')
            ->join('pasiendaftar_t as pd','pd.norec','=','apd.noregistrasifk')
            ->join('pasien_m as ps', 'ps.id','=','pd.nocmfk')
            ->leftjoin('alamat_m as alm', 'ps.id','=','alm.nocmfk')
            ->leftjoin('jeniskelamin_m as jk','jk.id','=','ps.objectjeniskelaminfk')
            ->join('kelas_m as kls','kls.id','=','pd.objectkelasfk')
            ->join('ruangan_m as ru','ru.id','=','apd.objectruanganfk')
            ->leftJoin('ruangan_m as ruasal', 'ruasal.id', '=', 'so.objectruanganfk')
            // ->leftJoin('departemen_m as dept','dept.id','=','ru.objectdepartemenfk')
            ->leftJoin('pegawai_m as pg','pg.id','=','apd.objectpegawaifk')
            ->leftJoin('pegawai_m as pg2','pg2.id','=','apd.residencefk')
            ->Join('kelompokpasien_m as kp','kp.id','=','pd.objectkelompokpasienlastfk')
            ->leftjoin('rekanan_m as rek','rek.id','=','pd.objectrekananfk')
            ->leftjoin('antrianpasienregistrasi_t as apr', function ($join){
                $join->on('apr.noreservasi','=','pd.statusschedule');
                $join->on('apr.nocmfk','=','pd.nocmfk');
            })
            ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('asuransipasien_m as asu', 'pa.objectasuransipasienfk', '=', 'asu.id')
            ->leftjoin('kelas_m as klstg','klstg.id','=','asu.objectkelasdijaminfk')
            ->select('apd.tglmasuk as tglregistrasi','ps.nocm','pd.noregistrasi','ps.namapasien','ps.tgllahir','jk.jeniskelamin','apd.objectruanganfk','ru.namaruangan','kls.id as idkelas','kls.namakelas',
                'kp.kelompokpasien','rek.namarekanan','apd.objectpegawaifk','pg.namalengkap as namadokter','pd.norec as norec_pd','apd.norec as norec_apd','apd.objectasalrujukanfk',
                'apd.tgldipanggildokter','apd.statuspasien as statuspanggil','pd.statuspasien','apd.tgldipanggildokter','apd.tgldipanggilsuster','apr.noreservasi','apd.noantrian',
                'apr.tanggalreservasi',  'alm.alamatlengkap','klstg.namakelas as kelasdijamin',
                'ru.ipaddress','ps.iskompleks','apd.residencefk','pg2.namalengkap as residence', 'ruasal.id as idruanganasal'
                , 'ruasal.namaruangan as namaruanganasal', 'so.norec as norec_so', 'so.keteranganorder', 'so.keteranganlainnya'
                ,DB::raw('case when apd.ispelayananpasien is null then \'false\' else \'true\' end as statuslayanan'))
            ->where('apd.kdprofile', $idProfile)
            ->where('pd.statusenabled',true)
            ->where('ps.statusenabled',true);

        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('apd.tglmasuk', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $data = $data->where('apd.tglmasuk', '<=', $filter['tglAkhir']);
        }
        if (isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined") {
            $data = $data->where('ru.id', '=', $filter['ruangId']);
        }
        if (isset($filter['dokId']) && $filter['dokId'] != "" && $filter['dokId'] != "undefined") {
            $data = $data->where('pg.id', '=', $filter['dokId']);
        }
        if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
            $data = $data->where('pd.noregistrasi','=', $filter['noreg']);
        }
        if (isset($filter['norm']) && $filter['norm'] != "" && $filter['norm'] != "undefined") {
            $data = $data->where('ps.nocm', 'ilike', '%' . $filter['norm'] . '%');
        }
        if (isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $data = $data->where('ps.namapasien', 'ilike', '%' . $filter['nama'] . '%');
        }
        if (isset($filter['norecApd']) && $filter['norecApd'] != "" && $filter['norecApd'] != "undefined") {
            $data = $data->where('apd.norec',  $filter['norecApd'] );
        }
        if(isset($request['ruanganArr']) && $request['ruanganArr']!="" && $request['ruanganArr']!="undefined"){
            $arrRuang = explode(',',$request['ruanganArr']) ;
            $kodeRuang = [];
            foreach ( $arrRuang as $item){
                $kodeRuang[] = (int) $item;
            }
            $data = $data->whereIn('ru.id',$kodeRuang);
        }
        if (isset($filter['jmlRow']) && $filter['jmlRow'] != "" && $filter['jmlRow'] != "undefined") {
            $data = $data->take($filter['jmlRow']);
        }
        $data = $data->whereIn('ru.objectdepartemenfk',[18,24,28,26,30,34]);
//        $data = $data->orderBy('pd.tglregistrasi');
        $data = $data->orderBy('apd.noantrian');
        $data = $data->get();
//        if(count($data) > 0){
//            foreach ($data as $item){
//                if($item->foto != null ){
//                    $item->foto = "data:image/jpeg;base64," . base64_encode($item->foto);
//                }
//            }
//        }
        return $this->respond($data);
    }

    public function saveSelesaiPeriksa(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        DB::beginTransaction();
        try {
            $apd = AntrianPasienDiperiksa::where('norec',$request['norec_apd'])->where('kdprofile', $idProfile)->first();
            if(isset($request['kelompokUser']) && $request['kelompokUser'] == 'dokter' ){

                if($apd->tglselesaiperiksa == null){
                    AntrianPasienDiperiksa::where('norec', $request['norec_apd'])
                        ->where('kdprofile', $idProfile)
                        ->update([
                            'tglselesaiperiksa' => date('Y-m-d H:i:s'),
                        ]);
                }

            }
            $transStatus ='true';
            $transMessage = "Sukses";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Gagal";
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

    public function SimpanMeninggalPasien(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tglAyeuna = date('Y-m-d H:i:s');
        $r_NewPD=$request['pasiendaftar'];
        DB::beginTransaction();
        try{

            $updatePD= PasienDaftar::where('noregistrasi', $r_NewPD['noregistrasi'])
                ->where('kdprofile', $kdProfile)
                ->update([
                    'objectkondisipasienfk' => $r_NewPD['objectkondisipasienfk'],
                    'objectstatuskeluarfk' => $r_NewPD['objectstatuskeluarfk'],
                    'objectpenyebabkematianfk' => $r_NewPD['objectpenyebabkematianfk'],
                    'tglmeninggal' => $r_NewPD['tglmeninggal'],
                    'keteranganpenyebabkematian' => $r_NewPD['keterangankematian'],
//                    'objectruanganlastfk' => $r_NewPD['ruangantujuan'],
                ]);

            if ($r_NewPD['nocmfk'] != 'undefined' && $r_NewPD['objectstatuskeluarfk']== 5) {
                $updatePS= Pasien::where('id', $r_NewPD['nocmfk'])
                    ->update([
                            'tglmeninggal' => $r_NewPD['tglmeninggal'],
                        ]
                    );
            }

            $updateAPD= AntrianPasienDiperiksa::where('norec', $r_NewPD['norec_apd'])->where('kdprofile', $kdProfile)
                ->update([
                        'tglkeluar' => $r_NewPD['tglmeninggal'],
                    ]
                );

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
                'as' => 'ea@epic',
            );
        } else {
            $transMessage = "GAGAL";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function SimpanPulangPasien(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tglAyeuna = date('Y-m-d H:i:s');
        $r_NewPD=$request['pasiendaftar'];
        DB::beginTransaction();
        try{

            $updatePD= PasienDaftar::where('noregistrasi', $r_NewPD['noregistrasi'])
                ->where('kdprofile', $kdProfile)
                ->update([
                    'objectkondisipasienfk' => $r_NewPD['objectkondisipasienfk'],
                    'objectstatuskeluarfk' => $r_NewPD['objectstatuskeluarfk'],
                    'objectstatuspulangfk' => $r_NewPD['objectstatuspulangfk'],
                    // 'objectpenyebabkematianfk' => $r_NewPD['objectpenyebabkematianfk'],
                    // 'tglmeninggal' => $r_NewPD['tglmeninggal'],
                    // 'keteranganpenyebabkematian' => $r_NewPD['keterangankematian'],
//                    'objectruanganlastfk' => $r_NewPD['ruangantujuan'],
                ]);

            // if ($r_NewPD['nocmfk'] != 'undefined' && $r_NewPD['objectstatuskeluarfk']== 5) {
            //     $updatePS= Pasien::where('id', $r_NewPD['nocmfk'])
            //         ->update([
            //                 'tglmeninggal' => $r_NewPD['tglmeninggal'],
            //             ]
            //         );
            // }

            // $updateAPD= AntrianPasienDiperiksa::where('norec', $r_NewPD['norec_apd'])->where('kdprofile', $kdProfile)
            //     ->update([
            //             'tglkeluar' => $r_NewPD['tglmeninggal'],
            //         ]
            //     );

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
                'as' => 'ea@epic',
            );
        } else {
            $transMessage = "GAGAL";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getComboPsikologi(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $jenisnorma = \DB::table('jenisnorma_m')->where('kdprofile', $kdProfile)
        ->where('statusenabled', true)
        ->get();
        $normapsikologi = \DB::table('normapsikologi_m as np')
        ->join('jenisnorma_m as jn', 'jn.id','=','np.objectjenisnormafk')
        ->select('np.*', 'jn.jenisnorma')
        ->where('np.kdprofile', $kdProfile)
        ->where('np.statusenabled', true)->orderBy('jn.id','asc')
        ->get();
        $result = array(
            'jenisnorma'=>$jenisnorma,
            'normapsikologi'=> $normapsikologi,
            'as'=>'Fizi'
        );
        return $this->respond($result);
    }
    public function saveNormaPsikologi(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $idMax = \DB::table('normapsikologi_m')->max('id');
        $crud="";
        \DB::beginTransaction();
        try {
            if (isset($request['iddel'])) {
                $crud = "Hapus";
                \DB::table('normapsikologi_m')->where('id', $request['iddel'])->delete();
            } else {
                if($request['id'] == null){
                    $crud = "Simpan";
                    \DB::table('normapsikologi_m')->insert([
                        'id'=> $idMax+1,
                        'kdprofile'=> $kdProfile,
                        'statusenabled'=> true,
                        'kodeexternal'=> $idMax+1,
                        'objectjenisnormafk'=> $request['objectjenisnormafk'],
                        'umurmin'=> $request['umurmin'],
                        'umurmax'=> $request['umurmax'],
                        'nilai'=> $request['nilai'],
                    ]);
                }else if($request['id'] != null){
                    $crud = "Ubah";
                    \DB::table('normapsikologi_m')->where('id', $request['id'])->update([
                        'objectjenisnormafk'=> $request['objectjenisnormafk'],
                        'umurmin'=> $request['umurmin'],
                        'umurmax'=> $request['umurmax'],
                        'nilai'=> $request['nilai'],
                    ]);
                }
            }
            
            
            $transStatus= 'true';
        } catch (\Throwable $th) {
            $transStatus= 'false';
            
        }
        if ($transStatus == 'true') {
            DB::commit();
            $transMessage = $crud.' berhasil';
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'ea@epic',
            );
        } else {
            $transMessage = $crud." gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveEPPS(Request $request)
    {
        
        $kdProfile = (int) $this->getDataKdProfile($request);
        $crud="";
        $norecMA = substr(\Webpatser\Uuid\Uuid::generate(), 0, 32);
        \DB::beginTransaction();
        try {
            $crud = "Simpan";
            if($request['norec'] == ''){
                $MA = new EPPS();
                $MA->norec = $norecMA;
                $MA->kdprofile = $kdProfile;
                $MA->statusenabled = true;
            } else if($request['norec'] != ''){
                $MA= EPPS::where('norec',$request['norec'])
                    ->where('kdprofile', $kdProfile)
                    ->first();
            }
            
            $MA->objectapdfk =  $request['norec_apd'];
            $MA->tgltes =  $request['tgltes'];
            $MA->konsistensi =  $request['konsistensi'];
            $MA->ach = $request['skolom1'];
            $MA->def = $request['skolom2'];
            $MA->ord = $request['skolom3'];
            $MA->exh = $request['skolom4'];
            $MA->aut = $request['skolom5'];
            $MA->aff = $request['skolom6'];
            $MA->int = $request['skolom7'];
            $MA->suc = $request['skolom8'];
            $MA->dom = $request['skolom9'];
            $MA->aba = $request['skolom10'];
            $MA->nur = $request['skolom11'];
            $MA->chg = $request['skolom12'];
            $MA->end = $request['skolom13'];
            $MA->het = $request['skolom14'];
            $MA->agg = $request['skolom15'];
            $MA->r1 = $request['rkolom1'];
            $MA->r2 = $request['rkolom2'];
            $MA->r3 = $request['rkolom3'];
            $MA->r4 = $request['rkolom4'];
            $MA->r5 = $request['rkolom5'];
            $MA->r6 = $request['rkolom6'];
            $MA->r7 = $request['rkolom7'];
            $MA->r8 = $request['rkolom8'];
            $MA->r9 = $request['rkolom9'];
            $MA->r10 = $request['rkolom10'];
            $MA->r11 = $request['rkolom11'];
            $MA->r12 = $request['rkolom12'];
            $MA->r13 = $request['rkolom13'];
            $MA->r14 = $request['rkolom14'];
            $MA->r15 = $request['rkolom15'];
            $MA->c1 = $request['ckolom1'];
            $MA->c2 = $request['ckolom2'];
            $MA->c3 = $request['ckolom3'];
            $MA->c4 = $request['ckolom4'];
            $MA->c5 = $request['ckolom5'];
            $MA->c6 = $request['ckolom6'];
            $MA->c7 = $request['ckolom7'];
            $MA->c8 = $request['ckolom8'];
            $MA->c9 = $request['ckolom9'];
            $MA->c10 = $request['ckolom10'];
            $MA->c11 = $request['ckolom11'];
            $MA->c12 = $request['ckolom12'];
            $MA->c13 = $request['ckolom13'];
            $MA->c14 = $request['ckolom14'];
            $MA->c15 = $request['ckolom15'];
            $MA->save();

            for($i = 0; $i < 5; $i++){

                if($request['norec'] == ''){
                    $MAD = new EPPSDetail();
                    $MAD->norec = $MAD->generateNewId();
                    $MAD->kdprofile = $kdProfile;
                    $MAD->statusenabled = true;
                    $MAD->objecteppsfk = $MA->norec;
                }else if($request['norec'] != ''){
                    $MAD= EPPSDetail::where('objecteppsfk',$request['norec'])
                    ->where('nourut', $request['array']['jawaban0'][$i]['no'])
                    ->first();
                }
                $MAD->nourut = $request['array']['jawaban0'][$i]['no'];
                $MAD->jawaban = $request['array']['jawaban0'][$i]['jawaban'];
                $MAD->save();

                if($request['norec'] == ''){
                    $MAD1 = new EPPSDetail();
                    $MAD1->norec = $MAD1->generateNewId();
                    $MAD1->kdprofile = $kdProfile;
                    $MAD1->statusenabled = true;
                    $MAD1->objecteppsfk = $MA->norec;
                }else if($request['norec'] != ''){
                    $MAD1= EPPSDetail::where('objecteppsfk',$request['norec'])
                    ->where('nourut', $request['array']['jawaban1'][$i]['no'])
                    ->first();
                }
                $MAD1->nourut = $request['array']['jawaban1'][$i]['no'];
                $MAD1->jawaban = $request['array']['jawaban1'][$i]['jawaban'];
                $MAD1->save();
                
                if($request['norec'] == ''){
                    $MAD2 = new EPPSDetail();
                    $MAD2->norec = $MAD2->generateNewId();
                    $MAD2->kdprofile = $kdProfile;
                    $MAD2->statusenabled = true;
                    $MAD2->objecteppsfk = $MA->norec;
                }else if($request['norec'] != ''){
                    $MAD2= EPPSDetail::where('objecteppsfk',$request['norec'])
                    ->where('nourut', $request['array']['jawaban2'][$i]['no'])
                    ->first();
                }
                $MAD2->nourut = $request['array']['jawaban2'][$i]['no'];
                $MAD2->jawaban = $request['array']['jawaban2'][$i]['jawaban'];
                $MAD2->save();

                if($request['norec'] == ''){
                    $MAD3 = new EPPSDetail();
                    $MAD3->norec = $MAD3->generateNewId();
                    $MAD3->kdprofile = $kdProfile;
                    $MAD3->statusenabled = true;
                    $MAD3->objecteppsfk = $MA->norec;
                }else if($request['norec'] != ''){
                    $MAD3= EPPSDetail::where('objecteppsfk',$request['norec'])
                    ->where('nourut', $request['array']['jawaban3'][$i]['no'])
                    ->first();
                }
                $MAD3->nourut = $request['array']['jawaban3'][$i]['no'];
                $MAD3->jawaban = $request['array']['jawaban3'][$i]['jawaban'];
                $MAD3->save();

                if($request['norec'] == ''){
                    $MAD4 = new EPPSDetail();
                    $MAD4->norec = $MAD4->generateNewId();
                    $MAD4->kdprofile = $kdProfile;
                    $MAD4->statusenabled = true;
                    $MAD4->objecteppsfk = $MA->norec;
                }else if($request['norec'] != ''){
                    $MAD4= EPPSDetail::where('objecteppsfk',$request['norec'])
                    ->where('nourut', $request['array']['jawaban4'][$i]['no'])
                    ->first();
                }
                $MAD4->nourut = $request['array']['jawaban4'][$i]['no'];
                $MAD4->jawaban = $request['array']['jawaban4'][$i]['jawaban'];
                $MAD4->save();

                if($request['norec'] == ''){
                    $MAD5 = new EPPSDetail();
                    $MAD5->norec = $MAD5->generateNewId();
                    $MAD5->kdprofile = $kdProfile;
                    $MAD5->statusenabled = true;
                    $MAD5->objecteppsfk = $MA->norec;
                }else if($request['norec'] != ''){
                    $MAD5= EPPSDetail::where('objecteppsfk',$request['norec'])
                    ->where('nourut', $request['array']['jawaban5'][$i]['no'])
                    ->first();
                }
                $MAD5->nourut = $request['array']['jawaban5'][$i]['no'];
                $MAD5->jawaban = $request['array']['jawaban5'][$i]['jawaban'];
                $MAD5->save();

                if($request['norec'] == ''){
                    $MAD6 = new EPPSDetail();
                    $MAD6->norec = $MAD6->generateNewId();
                    $MAD6->kdprofile = $kdProfile;
                    $MAD6->statusenabled = true;
                    $MAD6->objecteppsfk = $MA->norec;
                }else if($request['norec'] != ''){
                    $MAD6= EPPSDetail::where('objecteppsfk',$request['norec'])
                    ->where('nourut', $request['array']['jawaban6'][$i]['no'])
                    ->first();
                }
                $MAD6->nourut = $request['array']['jawaban6'][$i]['no'];
                $MAD6->jawaban = $request['array']['jawaban6'][$i]['jawaban'];
                $MAD6->save();

                if($request['norec'] == ''){
                    $MAD7 = new EPPSDetail();
                    $MAD7->norec = $MAD7->generateNewId();
                    $MAD7->kdprofile = $kdProfile;
                    $MAD7->statusenabled = true;
                    $MAD7->objecteppsfk = $MA->norec;
                }else if($request['norec'] != ''){
                    $MAD7= EPPSDetail::where('objecteppsfk',$request['norec'])
                    ->where('nourut', $request['array']['jawaban7'][$i]['no'])
                    ->first();
                }
                $MAD7->nourut = $request['array']['jawaban7'][$i]['no'];
                $MAD7->jawaban = $request['array']['jawaban7'][$i]['jawaban'];
                $MAD7->save();

                if($request['norec'] == ''){
                    $MAD8 = new EPPSDetail();
                    $MAD8->norec = $MAD8->generateNewId();
                    $MAD8->kdprofile = $kdProfile;
                    $MAD8->statusenabled = true;
                    $MAD8->objecteppsfk = $MA->norec;
                }else if($request['norec'] != ''){
                    $MAD8= EPPSDetail::where('objecteppsfk',$request['norec'])
                    ->where('nourut', $request['array']['jawaban8'][$i]['no'])
                    ->first();
                }
                $MAD8->nourut = $request['array']['jawaban8'][$i]['no'];
                $MAD8->jawaban = $request['array']['jawaban8'][$i]['jawaban'];
                $MAD8->save();

                if($request['norec'] == ''){
                    $MAD9 = new EPPSDetail();
                    $MAD9->norec = $MAD9->generateNewId();
                    $MAD9->kdprofile = $kdProfile;
                    $MAD9->statusenabled = true;
                    $MAD9->objecteppsfk = $MA->norec;
                }else if($request['norec'] != ''){
                    $MAD9= EPPSDetail::where('objecteppsfk',$request['norec'])
                    ->where('nourut', $request['array']['jawaban9'][$i]['no'])
                    ->first();
                }
                $MAD9->nourut = $request['array']['jawaban9'][$i]['no'];
                $MAD9->jawaban = $request['array']['jawaban9'][$i]['jawaban'];
                $MAD9->save();

                if($request['norec'] == ''){
                    $MAD10 = new EPPSDetail();
                    $MAD10->norec = $MAD10->generateNewId();
                    $MAD10->kdprofile = $kdProfile;
                    $MAD10->statusenabled = true;
                    $MAD10->objecteppsfk = $MA->norec;
                }else if($request['norec'] != ''){
                    $MAD10= EPPSDetail::where('objecteppsfk',$request['norec'])
                    ->where('nourut', $request['array']['jawaban10'][$i]['no'])
                    ->first();
                }
                $MAD10->nourut = $request['array']['jawaban10'][$i]['no'];
                $MAD10->jawaban = $request['array']['jawaban10'][$i]['jawaban'];
                $MAD10->save();

                if($request['norec'] == ''){
                    $MAD11 = new EPPSDetail();
                    $MAD11->norec = $MAD11->generateNewId();
                    $MAD11->kdprofile = $kdProfile;
                    $MAD11->statusenabled = true;
                    $MAD11->objecteppsfk = $MA->norec;
                }else if($request['norec'] != ''){
                    $MAD11= EPPSDetail::where('objecteppsfk',$request['norec'])
                    ->where('nourut', $request['array']['jawaban11'][$i]['no'])
                    ->first();
                }
                $MAD11->nourut = $request['array']['jawaban11'][$i]['no'];
                $MAD11->jawaban = $request['array']['jawaban11'][$i]['jawaban'];
                $MAD11->save();

                if($request['norec'] == ''){
                    $MAD12 = new EPPSDetail();
                    $MAD12->norec = $MAD12->generateNewId();
                    $MAD12->kdprofile = $kdProfile;
                    $MAD12->statusenabled = true;
                    $MAD12->objecteppsfk = $MA->norec;
                }else if($request['norec'] != ''){
                    $MAD12= EPPSDetail::where('objecteppsfk',$request['norec'])
                    ->where('nourut', $request['array']['jawaban12'][$i]['no'])
                    ->first();
                }
                $MAD12->nourut = $request['array']['jawaban12'][$i]['no'];
                $MAD12->jawaban = $request['array']['jawaban12'][$i]['jawaban'];
                $MAD12->save();

                if($request['norec'] == ''){
                    $MAD13 = new EPPSDetail();
                    $MAD13->norec = $MAD13->generateNewId();
                    $MAD13->kdprofile = $kdProfile;
                    $MAD13->statusenabled = true;
                    $MAD13->objecteppsfk = $MA->norec;
                }else if($request['norec'] != ''){
                    $MAD13= EPPSDetail::where('objecteppsfk',$request['norec'])
                    ->where('nourut', $request['array']['jawaban13'][$i]['no'])
                    ->first();
                }
                $MAD13->nourut = $request['array']['jawaban13'][$i]['no'];
                $MAD13->jawaban = $request['array']['jawaban13'][$i]['jawaban'];
                $MAD13->save();

                if($request['norec'] == ''){
                    $MAD14 = new EPPSDetail();
                    $MAD14->norec = $MAD14->generateNewId();
                    $MAD14->kdprofile = $kdProfile;
                    $MAD14->statusenabled = true;
                    $MAD14->objecteppsfk = $MA->norec;
                }else if($request['norec'] != ''){
                    $MAD14= EPPSDetail::where('objecteppsfk',$request['norec'])
                    ->where('nourut', $request['array']['jawaban14'][$i]['no'])
                    ->first();
                }
                $MAD14->nourut = $request['array']['jawaban14'][$i]['no'];
                $MAD14->jawaban = $request['array']['jawaban14'][$i]['jawaban'];
                $MAD14->save();

                if($request['norec'] == ''){
                    $MAD15 = new EPPSDetail();
                    $MAD15->norec = $MAD15->generateNewId();
                    $MAD15->kdprofile = $kdProfile;
                    $MAD15->statusenabled = true;
                    $MAD15->objecteppsfk = $MA->norec;
                }else if($request['norec'] != ''){
                    $MAD15= EPPSDetail::where('objecteppsfk',$request['norec'])
                    ->where('nourut', $request['array']['jawaban15'][$i]['no'])
                    ->first();
                }
                $MAD15->nourut = $request['array']['jawaban15'][$i]['no'];
                $MAD15->jawaban = $request['array']['jawaban15'][$i]['jawaban'];
                $MAD15->save();

                if($request['norec'] == ''){
                    $MAD16 = new EPPSDetail();
                    $MAD16->norec = $MAD16->generateNewId();
                    $MAD16->kdprofile = $kdProfile;
                    $MAD16->statusenabled = true;
                    $MAD16->objecteppsfk = $MA->norec;
                }else if($request['norec'] != ''){
                    $MAD16= EPPSDetail::where('objecteppsfk',$request['norec'])
                    ->where('nourut', $request['array']['jawaban16'][$i]['no'])
                    ->first();
                }
                $MAD16->nourut = $request['array']['jawaban16'][$i]['no'];
                $MAD16->jawaban = $request['array']['jawaban16'][$i]['jawaban'];
                $MAD16->save();

                if($request['norec'] == ''){
                    $MAD17 = new EPPSDetail();
                    $MAD17->norec = $MAD17->generateNewId();
                    $MAD17->kdprofile = $kdProfile;
                    $MAD17->statusenabled = true;
                    $MAD17->objecteppsfk = $MA->norec;
                }else if($request['norec'] != ''){
                    $MAD17= EPPSDetail::where('objecteppsfk',$request['norec'])
                    ->where('nourut', $request['array']['jawaban17'][$i]['no'])
                    ->first();
                }
                $MAD17->nourut = $request['array']['jawaban17'][$i]['no'];
                $MAD17->jawaban = $request['array']['jawaban17'][$i]['jawaban'];
                $MAD17->save();

                if($request['norec'] == ''){
                    $MAD18 = new EPPSDetail();
                    $MAD18->norec = $MAD18->generateNewId();
                    $MAD18->kdprofile = $kdProfile;
                    $MAD18->statusenabled = true;
                    $MAD18->objecteppsfk = $MA->norec;
                }else if($request['norec'] != ''){
                    $MAD18= EPPSDetail::where('objecteppsfk',$request['norec'])
                    ->where('nourut', $request['array']['jawaban18'][$i]['no'])
                    ->first();
                }
                $MAD18->nourut = $request['array']['jawaban18'][$i]['no'];
                $MAD18->jawaban = $request['array']['jawaban18'][$i]['jawaban'];
                $MAD18->save();

                if($request['norec'] == ''){
                    $MAD19 = new EPPSDetail();
                    $MAD19->norec = $MAD19->generateNewId();
                    $MAD19->kdprofile = $kdProfile;
                    $MAD19->statusenabled = true;
                    $MAD19->objecteppsfk = $MA->norec;
                }else if($request['norec'] != ''){
                    $MAD19= EPPSDetail::where('objecteppsfk',$request['norec'])
                    ->where('nourut', $request['array']['jawaban19'][$i]['no'])
                    ->first();
                }
                $MAD19->nourut = $request['array']['jawaban19'][$i]['no'];
                $MAD19->jawaban = $request['array']['jawaban19'][$i]['jawaban'];
                $MAD19->save();

                if($request['norec'] == ''){
                    $MAD20 = new EPPSDetail();
                    $MAD20->norec = $MAD20->generateNewId();
                    $MAD20->kdprofile = $kdProfile;
                    $MAD20->statusenabled = true;
                    $MAD20->objecteppsfk = $MA->norec;
                }else if($request['norec'] != ''){
                    $MAD20= EPPSDetail::where('objecteppsfk',$request['norec'])
                    ->where('nourut', $request['array']['jawaban20'][$i]['no'])
                    ->first();
                }
                $MAD20->nourut = $request['array']['jawaban20'][$i]['no'];
                $MAD20->jawaban = $request['array']['jawaban20'][$i]['jawaban'];
                $MAD20->save();

                if($request['norec'] == ''){
                    $MAD21 = new EPPSDetail();
                    $MAD21->norec = $MAD21->generateNewId();
                    $MAD21->kdprofile = $kdProfile;
                    $MAD21->statusenabled = true;
                    $MAD21->objecteppsfk = $MA->norec;
                }else if($request['norec'] != ''){
                    $MAD21= EPPSDetail::where('objecteppsfk',$request['norec'])
                    ->where('nourut', $request['array']['jawaban21'][$i]['no'])
                    ->first();
                }
                $MAD21->nourut = $request['array']['jawaban21'][$i]['no'];
                $MAD21->jawaban = $request['array']['jawaban21'][$i]['jawaban'];
                $MAD21->save();

                if($request['norec'] == ''){
                    $MAD22 = new EPPSDetail();
                    $MAD22->norec = $MAD22->generateNewId();
                    $MAD22->kdprofile = $kdProfile;
                    $MAD22->statusenabled = true;
                    $MAD22->objecteppsfk = $MA->norec;
                }else if($request['norec'] != ''){
                    $MAD22= EPPSDetail::where('objecteppsfk',$request['norec'])
                    ->where('nourut', $request['array']['jawaban22'][$i]['no'])
                    ->first();
                }
                $MAD22->nourut = $request['array']['jawaban22'][$i]['no'];
                $MAD22->jawaban = $request['array']['jawaban22'][$i]['jawaban'];
                $MAD22->save();

                if($request['norec'] == ''){
                    $MAD23 = new EPPSDetail();
                    $MAD23->norec = $MAD23->generateNewId();
                    $MAD23->kdprofile = $kdProfile;
                    $MAD23->statusenabled = true;
                    $MAD23->objecteppsfk = $MA->norec;
                }else if($request['norec'] != ''){
                    $MAD23= EPPSDetail::where('objecteppsfk',$request['norec'])
                    ->where('nourut', $request['array']['jawaban23'][$i]['no'])
                    ->first();
                }
                $MAD23->nourut = $request['array']['jawaban23'][$i]['no'];
                $MAD23->jawaban = $request['array']['jawaban23'][$i]['jawaban'];
                $MAD23->save();

                if($request['norec'] == ''){
                    $MAD24 = new EPPSDetail();
                    $MAD24->norec = $MAD24->generateNewId();
                    $MAD24->kdprofile = $kdProfile;
                    $MAD24->statusenabled = true;
                    $MAD24->objecteppsfk = $MA->norec;
                }else if($request['norec'] != ''){
                    $MAD24= EPPSDetail::where('objecteppsfk',$request['norec'])
                    ->where('nourut', $request['array']['jawaban24'][$i]['no'])
                    ->first();
                }
                $MAD24->nourut = $request['array']['jawaban24'][$i]['no'];
                $MAD24->jawaban = $request['array']['jawaban24'][$i]['jawaban'];
                $MAD24->save();

                if($request['norec'] == ''){
                    $MAD25 = new EPPSDetail();
                    $MAD25->norec = $MAD25->generateNewId();
                    $MAD25->kdprofile = $kdProfile;
                    $MAD25->statusenabled = true;
                    $MAD25->objecteppsfk = $MA->norec;
                }else if($request['norec'] != ''){
                    $MAD25= EPPSDetail::where('objecteppsfk',$request['norec'])
                    ->where('nourut', $request['array']['jawaban25'][$i]['no'])
                    ->first();
                }
                $MAD25->nourut = $request['array']['jawaban25'][$i]['no'];
                $MAD25->jawaban = $request['array']['jawaban25'][$i]['jawaban'];
                $MAD25->save();

                if($request['norec'] == ''){
                    $MAD26 = new EPPSDetail();
                    $MAD26->norec = $MAD26->generateNewId();
                    $MAD26->kdprofile = $kdProfile;
                    $MAD26->statusenabled = true;
                    $MAD26->objecteppsfk = $MA->norec;
                }else if($request['norec'] != ''){
                    $MAD26= EPPSDetail::where('objecteppsfk',$request['norec'])
                    ->where('nourut', $request['array']['jawaban26'][$i]['no'])
                    ->first();
                }
                $MAD26->nourut = $request['array']['jawaban26'][$i]['no'];
                $MAD26->jawaban = $request['array']['jawaban26'][$i]['jawaban'];
                $MAD26->save();

                if($request['norec'] == ''){
                    $MAD27 = new EPPSDetail();
                    $MAD27->norec = $MAD27->generateNewId();
                    $MAD27->kdprofile = $kdProfile;
                    $MAD27->statusenabled = true;
                    $MAD27->objecteppsfk = $MA->norec;
                }else if($request['norec'] != ''){
                    $MAD27= EPPSDetail::where('objecteppsfk',$request['norec'])
                    ->where('nourut', $request['array']['jawaban27'][$i]['no'])
                    ->first();
                }
                $MAD27->nourut = $request['array']['jawaban27'][$i]['no'];
                $MAD27->jawaban = $request['array']['jawaban27'][$i]['jawaban'];
                $MAD27->save();

                if($request['norec'] == ''){
                    $MAD28 = new EPPSDetail();
                    $MAD28->norec = $MAD28->generateNewId();
                    $MAD28->kdprofile = $kdProfile;
                    $MAD28->statusenabled = true;
                    $MAD28->objecteppsfk = $MA->norec;
                }else if($request['norec'] != ''){
                    $MAD28= EPPSDetail::where('objecteppsfk',$request['norec'])
                    ->where('nourut', $request['array']['jawaban28'][$i]['no'])
                    ->first();
                }
                $MAD28->nourut = $request['array']['jawaban28'][$i]['no'];
                $MAD28->jawaban = $request['array']['jawaban28'][$i]['jawaban'];
                $MAD28->save();

                if($request['norec'] == ''){
                    $MAD29 = new EPPSDetail();
                    $MAD29->norec = $MAD29->generateNewId();
                    $MAD29->kdprofile = $kdProfile;
                    $MAD29->statusenabled = true;
                    $MAD29->objecteppsfk = $MA->norec;
                }else if($request['norec'] != ''){
                    $MAD29= EPPSDetail::where('objecteppsfk',$request['norec'])
                    ->where('nourut', $request['array']['jawaban29'][$i]['no'])
                    ->first();
                }
                $MAD29->nourut = $request['array']['jawaban29'][$i]['no'];
                $MAD29->jawaban = $request['array']['jawaban29'][$i]['jawaban'];
                $MAD29->save();

                if($request['norec'] == ''){
                    $MAD30 = new EPPSDetail();
                    $MAD30->norec = $MAD30->generateNewId();
                    $MAD30->kdprofile = $kdProfile;
                    $MAD30->statusenabled = true;
                    $MAD30->objecteppsfk = $MA->norec;
                }else if($request['norec'] != ''){
                    $MAD30= EPPSDetail::where('objecteppsfk',$request['norec'])
                    ->where('nourut', $request['array']['jawaban30'][$i]['no'])
                    ->first();
                }
                $MAD30->nourut = $request['array']['jawaban30'][$i]['no'];
                $MAD30->jawaban = $request['array']['jawaban30'][$i]['jawaban'];
                $MAD30->save();

                if($request['norec'] == ''){
                    $MAD31 = new EPPSDetail();
                    $MAD31->norec = $MAD31->generateNewId();
                    $MAD31->kdprofile = $kdProfile;
                    $MAD31->statusenabled = true;
                    $MAD31->objecteppsfk = $MA->norec;
                }else if($request['norec'] != ''){
                    $MAD31= EPPSDetail::where('objecteppsfk',$request['norec'])
                    ->where('nourut', $request['array']['jawaban31'][$i]['no'])
                    ->first();
                }
                $MAD31->nourut = $request['array']['jawaban31'][$i]['no'];
                $MAD31->jawaban = $request['array']['jawaban31'][$i]['jawaban'];
                $MAD31->save();

                if($request['norec'] == ''){
                    $MAD32 = new EPPSDetail();
                    $MAD32->norec = $MAD32->generateNewId();
                    $MAD32->kdprofile = $kdProfile;
                    $MAD32->statusenabled = true;
                    $MAD32->objecteppsfk = $MA->norec;
                }else if($request['norec'] != ''){
                    $MAD32= EPPSDetail::where('objecteppsfk',$request['norec'])
                    ->where('nourut', $request['array']['jawaban32'][$i]['no'])
                    ->first();
                }
                $MAD32->nourut = $request['array']['jawaban32'][$i]['no'];
                $MAD32->jawaban = $request['array']['jawaban32'][$i]['jawaban'];
                $MAD32->save();

                if($request['norec'] == ''){
                    $MAD33 = new EPPSDetail();
                    $MAD33->norec = $MAD33->generateNewId();
                    $MAD33->kdprofile = $kdProfile;
                    $MAD33->statusenabled = true;
                    $MAD33->objecteppsfk = $MA->norec;
                }else if($request['norec'] != ''){
                    $MAD33= EPPSDetail::where('objecteppsfk',$request['norec'])
                    ->where('nourut', $request['array']['jawaban33'][$i]['no'])
                    ->first();
                }
                $MAD33->nourut = $request['array']['jawaban33'][$i]['no'];
                $MAD33->jawaban = $request['array']['jawaban33'][$i]['jawaban'];
                $MAD33->save();

                if($request['norec'] == ''){
                    $MAD34 = new EPPSDetail();
                    $MAD34->norec = $MAD34->generateNewId();
                    $MAD34->kdprofile = $kdProfile;
                    $MAD34->statusenabled = true;
                    $MAD34->objecteppsfk = $MA->norec;
                }else if($request['norec'] != ''){
                    $MAD34= EPPSDetail::where('objecteppsfk',$request['norec'])
                    ->where('nourut', $request['array']['jawaban34'][$i]['no'])
                    ->first();
                }
                $MAD34->nourut = $request['array']['jawaban34'][$i]['no'];
                $MAD34->jawaban = $request['array']['jawaban34'][$i]['jawaban'];
                $MAD34->save();

                if($request['norec'] == ''){
                    $MAD35 = new EPPSDetail();
                    $MAD35->norec = $MAD35->generateNewId();
                    $MAD35->kdprofile = $kdProfile;
                    $MAD35->statusenabled = true;
                    $MAD35->objecteppsfk = $MA->norec;
                }else if($request['norec'] != ''){
                    $MAD35= EPPSDetail::where('objecteppsfk',$request['norec'])
                    ->where('nourut', $request['array']['jawaban35'][$i]['no'])
                    ->first();
                }
                $MAD35->nourut = $request['array']['jawaban35'][$i]['no'];
                $MAD35->jawaban = $request['array']['jawaban35'][$i]['jawaban'];
                $MAD35->save();

                if($request['norec'] == ''){
                    $MAD36 = new EPPSDetail();
                    $MAD36->norec = $MAD36->generateNewId();
                    $MAD36->kdprofile = $kdProfile;
                    $MAD36->statusenabled = true;
                    $MAD36->objecteppsfk = $MA->norec;
                }else if($request['norec'] != ''){
                    $MAD36= EPPSDetail::where('objecteppsfk',$request['norec'])
                    ->where('nourut', $request['array']['jawaban36'][$i]['no'])
                    ->first();
                }
                $MAD36->nourut = $request['array']['jawaban36'][$i]['no'];
                $MAD36->jawaban = $request['array']['jawaban36'][$i]['jawaban'];
                $MAD36->save();

                if($request['norec'] == ''){
                    $MAD37 = new EPPSDetail();
                    $MAD37->norec = $MAD37->generateNewId();
                    $MAD37->kdprofile = $kdProfile;
                    $MAD37->statusenabled = true;
                    $MAD37->objecteppsfk = $MA->norec;
                }else if($request['norec'] != ''){
                    $MAD37= EPPSDetail::where('objecteppsfk',$request['norec'])
                    ->where('nourut', $request['array']['jawaban37'][$i]['no'])
                    ->first();
                }
                $MAD37->nourut = $request['array']['jawaban37'][$i]['no'];
                $MAD37->jawaban = $request['array']['jawaban37'][$i]['jawaban'];
                $MAD37->save();

                if($request['norec'] == ''){
                    $MAD38 = new EPPSDetail();
                    $MAD38->norec = $MAD38->generateNewId();
                    $MAD38->kdprofile = $kdProfile;
                    $MAD38->statusenabled = true;
                    $MAD38->objecteppsfk = $MA->norec;
                }else if($request['norec'] != ''){
                    $MAD38= EPPSDetail::where('objecteppsfk',$request['norec'])
                    ->where('nourut', $request['array']['jawaban38'][$i]['no'])
                    ->first();
                }
                $MAD38->nourut = $request['array']['jawaban38'][$i]['no'];
                $MAD38->jawaban = $request['array']['jawaban38'][$i]['jawaban'];
                $MAD38->save();

                if($request['norec'] == ''){
                    $MAD39 = new EPPSDetail();
                    $MAD39->norec = $MAD39->generateNewId();
                    $MAD39->kdprofile = $kdProfile;
                    $MAD39->statusenabled = true;
                    $MAD39->objecteppsfk = $MA->norec;
                }else if($request['norec'] != ''){
                    $MAD39= EPPSDetail::where('objecteppsfk',$request['norec'])
                    ->where('nourut', $request['array']['jawaban39'][$i]['no'])
                    ->first();
                }
                $MAD39->nourut = $request['array']['jawaban39'][$i]['no'];
                $MAD39->jawaban = $request['array']['jawaban39'][$i]['jawaban'];
                $MAD39->save();

                if($request['norec'] == ''){
                    $MAD40 = new EPPSDetail();
                    $MAD40->norec = $MAD40->generateNewId();
                    $MAD40->kdprofile = $kdProfile;
                    $MAD40->statusenabled = true;
                    $MAD40->objecteppsfk = $MA->norec;
                }else if($request['norec'] != ''){
                    $MAD40= EPPSDetail::where('objecteppsfk',$request['norec'])
                    ->where('nourut', $request['array']['jawaban40'][$i]['no'])
                    ->first();
                }
                $MAD40->nourut = $request['array']['jawaban40'][$i]['no'];
                $MAD40->jawaban = $request['array']['jawaban40'][$i]['jawaban'];
                $MAD40->save();

                if($request['norec'] == ''){
                    $MAD41 = new EPPSDetail();
                    $MAD41->norec = $MAD41->generateNewId();
                    $MAD41->kdprofile = $kdProfile;
                    $MAD41->statusenabled = true;
                    $MAD41->objecteppsfk = $MA->norec;
                }else if($request['norec'] != ''){
                    $MAD41= EPPSDetail::where('objecteppsfk',$request['norec'])
                    ->where('nourut', $request['array']['jawaban41'][$i]['no'])
                    ->first();
                }
                $MAD41->nourut = $request['array']['jawaban41'][$i]['no'];
                $MAD41->jawaban = $request['array']['jawaban41'][$i]['jawaban'];
                $MAD41->save();

                if($request['norec'] == ''){
                    $MAD42 = new EPPSDetail();
                    $MAD42->norec = $MAD42->generateNewId();
                    $MAD42->kdprofile = $kdProfile;
                    $MAD42->statusenabled = true;
                    $MAD42->objecteppsfk = $MA->norec;
                }else if($request['norec'] != ''){
                    $MAD42= EPPSDetail::where('objecteppsfk',$request['norec'])
                    ->where('nourut', $request['array']['jawaban42'][$i]['no'])
                    ->first();
                }
                $MAD42->nourut = $request['array']['jawaban42'][$i]['no'];
                $MAD42->jawaban = $request['array']['jawaban42'][$i]['jawaban'];
                $MAD42->save();

                if($request['norec'] == ''){
                    $MAD43 = new EPPSDetail();
                    $MAD43->norec = $MAD43->generateNewId();
                    $MAD43->kdprofile = $kdProfile;
                    $MAD43->statusenabled = true;
                    $MAD43->objecteppsfk = $MA->norec;
                }else if($request['norec'] != ''){
                    $MAD43= EPPSDetail::where('objecteppsfk',$request['norec'])
                    ->where('nourut', $request['array']['jawaban43'][$i]['no'])
                    ->first();
                }
                $MAD43->nourut = $request['array']['jawaban43'][$i]['no'];
                $MAD43->jawaban = $request['array']['jawaban43'][$i]['jawaban'];
                $MAD43->save();

                if($request['norec'] == ''){
                    $MAD44 = new EPPSDetail();
                    $MAD44->norec = $MAD44->generateNewId();
                    $MAD44->kdprofile = $kdProfile;
                    $MAD44->statusenabled = true;
                    $MAD44->objecteppsfk = $MA->norec;
                }else if($request['norec'] != ''){
                    $MAD44= EPPSDetail::where('objecteppsfk',$request['norec'])
                    ->where('nourut', $request['array']['jawaban44'][$i]['no'])
                    ->first();
                }
                $MAD44->nourut = $request['array']['jawaban44'][$i]['no'];
                $MAD44->jawaban = $request['array']['jawaban44'][$i]['jawaban'];
                $MAD44->save();
            }


            $transStatus= 'true';
        } catch (\Throwable $th) {
            $transStatus= 'false';
            
        }
        if ($transStatus == 'true') {
            DB::commit();
            $transMessage = $crud.' berhasil';
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'ea@epic',
            );
        } else {
            $transMessage = $crud." gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'line'=> $th->getLine(),
                'message'=> $th->getMessage(),
                'as' => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getEPPS(Request $request)
    {
        $apd = $request['apd'];
        $data = \DB::select(DB::raw("select ep.*, epd.nourut, REPLACE(epd.jawaban, ' ', '') jawaban FROM
        epps_t ep
        inner join eppsdetail_t epd on ep.norec = epd.objecteppsfk
        where ep.statusenabled = true and ep.kdprofile = 30
        and epd.statusenabled = true and epd.kdprofile = 30 
        and ep.objectapdfk = '$apd'
        "));
        $result = array(
            "data"=> $data,
            "as"=> 'Laras'
        );
        return $this->respond($result);
    }

    public function getDdaftarRegistrasiPsikologi(Request $request)
    {
        $noregistrasi = "";
        if(isset($request['noregistrasi'])){
            $noregistrasi = "and pd.noregistrasi ='". $request['noregistrasi']."'";
        }
        //norec dibawah adalah norec apd
        $data = \DB::select(DB::raw("SELECT
            apd.norec,
            apd.tglmasuk,
            ps.tgllahir,
            pd.noregistrasi,
            ps.nocm,
            ps.namapasien,
            ru.namaruangan,
            ke.namakelas,
            apd.tglkeluar,
            ps.objectjeniskelaminfk,
            ps.namapasien, EXTRACT(YEAR from AGE(apd.tglmasuk, ps.tgllahir)) as umur
        FROM
            antrianpasiendiperiksa_t apd
            INNER JOIN pasiendaftar_t pd ON pd.norec = apd.noregistrasifk
            INNER JOIN pasien_m ps ON ps.ID = pd.nocmfk
            INNER JOIN ruangan_m ru ON ru.ID = apd.objectruanganfk 
            INNER JOIN kelas_m ke on ke.id = apd.objectkelasfk
        WHERE
            apd.objectruanganfk = 767
            and pd.statusenabled = true
            and pd.kdprofile = 30
            $noregistrasi
            and apd.tglmasuk between '$request[tglawal]' and '$request[tglakhir]' 
        "));
        $result = array(
            "data"=> $data,
            "as"=> 'FIzi'
        );
        return $this->respond($result);
    }
    public function saveInputHasilPsikologi(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        // $idMax = \DB::table('normapsikologi_m')->max('id');
        $crud="";
        \DB::beginTransaction();
            $datapsikologi = $request['datapsikologi'];

        try {
            if(isset($request['delete'])){
                    \DB::table('inputhasilpsikologi_t')->where('norec', $request['norecs'])->delete();
                $crud = "Hapus CFIT";

            }

            foreach ($datapsikologi as $dp) {
                
                if($dp['norec'] == ""){
                \DB::table('inputhasilpsikologi_t')->insert([
                    'norec'=>substr(\Webpatser\Uuid\Uuid::generate(), 0, 32),
                    'kdprofile'=> $kdProfile,
                    'statusenabled'=> true,
                    'tglinput'=> date('Y-m-d'),
                    'nomor'=>$dp['nomor'],
                    'norec_apd'=>$dp['norec_apd'],
                    'jawaban'=>$dp['jawaban'],
                    'test'=>$dp['test'],
                    'cfit'=>$dp['cfit'],
                    'nilai'=>$dp['nilai'],
                ]);
                $crud = "Simpan CFIT";
                } else {
                    \DB::table('inputhasilpsikologi_t')->where('norec', $dp['norec'])->update([
                    'tglinput'=> date('Y-m-d'),
                    'nomor'=>$dp['nomor'],
                    'norec_apd'=>$dp['norec_apd'],
                    'jawaban'=>$dp['jawaban'],
                    'test'=>$dp['test'],
                    'cfit'=>$dp['cfit'],
                    'nilai'=>$dp['nilai'],
                ]);
                $crud = "Ubah CFIT";
                }
            }
            
            
            $transStatus= 'true';
        } catch (\Throwable $th) {
            $transStatus= 'false';
            
        }
        if ($transStatus == 'true') {
            DB::commit();
            $transMessage = $crud.' berhasil';
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'ea@epic',
            );
        } else {
            $transMessage = $crud." gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'e'=> $th->getLine(),
                'msg'=> $th->getMessage(),
                'as' => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getHasilCFITDetail(Request $request)
    {
        $data = \DB::select(DB::raw("
        select * from inputhasilpsikologi_t where norec_apd ilike '$request[norec_apd]' order by cfit asc, test asc, nomor asc
        "));
        $result = array(
            'data'=> $data,
            'as'=> 'Fizi'
        );
        return $this->respond($result);
    }
    public function getKunciJawabanCFIT(Request $request)
    {   
        $kdProfile = (int) $this->getDataKdProfile($request);
        $data = \DB::select(DB::raw("SELECT * from kuncijawabancfit_m where kdprofile = $kdProfile and statusenabled = true"));
        $result = array(
            "data"=> $data,
            'as'=> 'Fizi'
        );
        return $this->respond($result);
    }
    public function getNormaSkala(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $umurmax = '';
        if($request['umurmax']=='null'){
            $umurmax = 'and umurmax is null';
        } else{
            $umurmax = 'and umurmax = ' . $request['umurmax'];

        }
        $data = \DB::select(DB::raw("SELECT * from normaskala_m where rawscores = $request[rawscores] and umurmin = $request[umurmin] and statusenabled = true and kdprofile = $kdProfile
        $umurmax
        "));
        $result = array(
            'data'=> $data,
            'as'=>'Fizi' 
        );
        return $this->respond($result);
    }
    public function kirimIQNormaSkala(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        // $idMax = \DB::table('normapsikologi_m')->max('id');
        $crud="";
        \DB::beginTransaction();
            $datapsikologi = $request['datapsikologi'];

        try {
            
            \DB::table('antrianpasiendiperiksa_t')->where('norec', $request['norec'])->update([
                'skoriq'=> $request['skoriq']
            ]);
            $crud = "Simpan CFIT";
            
            
            $transStatus= 'true';
        } catch (\Throwable $th) {
            $transStatus= 'false';
            
        }
        if ($transStatus == 'true') {
            DB::commit();
            $transMessage = $crud.' berhasil';
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'ea@epic',
            );
        } else {
            $transMessage = $crud." gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveKraepelin(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        // $idMax = \DB::table('normapsikologi_m')->max('id');
        $crud="";
        \DB::beginTransaction();
            $datapsikologi = $request['data'];

        try {
            if(isset($request['delete'])){
                    \DB::table('inputhasilkraepelin_t')->where('norec', $request['norec'])->delete();
                $crud = "Hapus Kraepelin";

            }
          foreach ($datapsikologi as $dp) {
                if($dp['norec'] == ""){
                \DB::table('inputhasilkraepelin_t')->insert([
                    'norec'=>substr(\Webpatser\Uuid\Uuid::generate(), 0, 32),
                    'kdprofile'=> $kdProfile,
                    'statusenabled'=> true,
                    'tglinput'=> date('Y-m-d'),
                    'lajur'=>$dp['lajur'],
                    'norec_apd'=>$dp['norec_apd'],
                    'nilai'=>$dp['nilai'],
                ]);
                $crud = "Simpan Kraepelin";
                } else {
                    \DB::table('inputhasilkraepelin_t')->where('norec', $dp['norec'])->update([
                    'tglinput'=> date('Y-m-d'),
                    'lajur'=>$dp['lajur'],
                    'norec_apd'=>$dp['norec_apd'],
                    'nilai'=>$dp['nilai'],
                ]);
                $crud = "Ubah Kraepelin";
                }
            }
            
            
            $transStatus= 'true';
        } catch (\Throwable $th) {
            $transStatus= 'false';
            
        }
        if ($transStatus == 'true') {
            DB::commit();
            $transMessage = $crud.' berhasil';
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'ea@epic',
            );
        } else {
            $transMessage = $crud." gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'e'=> $th->getLine(),
                'ee'=> $th->getMessage(),
                'as' => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDataKraepelin(Request $request)
    {
        $data = \DB::select(DB::raw("
        select * from inputhasilkraepelin_t where norec_apd ilike '$request[norec_apd]' and statusenabled = true and kdprofile = 30 order by lajur asc, nilai asc
        "));
        $data2 = \DB::select(DB::raw("
        select * from inputhasilkraepelind_t where norec_apd ilike '$request[norec_apd]'  and statusenabled = true and kdprofile = 30
        "));
        $result = array(
            'data'=> $data,
            'data2'=> $data2,
            'as'=> 'Fizi'
        );
        return $this->respond($result);
    }
    public function getNormaKraepelin(Request $request)
    {
        $panker = $request['panker'];
        $hanker = $request['hanker'];
        $tianker = $request['tianker'];
        $janker = $request['janker'];
        $pendidikan = $request['pendidikan'];
        $data = \DB::select(DB::raw("
        SELECT 'Kecepatan Kerja' as kompetensi, 'Kuantitas pekerjaan dalam satu waktu' as pengertian, '$panker' as skor, hasil as hasil FROM normakraepelin_m where objectpendidikanfk = $pendidikan and min <= $panker and max >= $panker  and keterangan ilike 'Panker'
        union all
        SELECT 'Ketelitian Kerja' as kompetensi, 'Jumlah kesalahan saat bekerja' as pengertian, '$tianker' as skor, hasil as hasil FROM normakraepelin_m where objectpendidikanfk = $pendidikan and min >= $tianker and max <= $tianker and keterangan ilike 'Tianker'
        union all
        SELECT 'Keajegan Kerja' as kompetensi, 'Kestabilan kerja saat menghadapi tekanan' as pengertian, '$janker' as skor, hasil as hasil FROM normakraepelin_m where objectpendidikanfk = $pendidikan and min >= $janker and max <= $janker and keterangan ilike 'Janker'
        union all
        SELECT 'Ketahanan Kerja' as kompetensi, 'Kemampuan bertahan dalam pekerjaan monoton' as pengertian, '$hanker' as skor, hasil as hasil FROM normakraepelin_m where objectpendidikanfk = $pendidikan and min <= $hanker and max >= $hanker and keterangan ilike 'Hanker'
        "));
        $result = array(
            'data'=>$data,
            'as'=>'Fizi'
        );
        return $this->respond($result);
    }
    public function saveHasilKraepelin(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        // $idMax = \DB::table('normapsikologi_m')->max('id');
        $crud="";
        \DB::beginTransaction();
            $datapsikologi = $request['data'];

        try {
            $ceknorec_apd = \DB::table('inputhasilkraepelind_t')->where('norec_apd', $request['norec_apd'])->get();
            if(count($ceknorec_apd) > 0){
                \DB::table('inputhasilkraepelind_t')->where('norec_apd', $request['norec_apd'])->update([
                    'statusenabled'=> false
                ]);
            }else{

            }
          foreach ($datapsikologi as $dp) {
                if($request['norec'] == ""){
                \DB::table('inputhasilkraepelind_t')->insert([
                    'norec'=>substr(\Webpatser\Uuid\Uuid::generate(), 0, 32),
                    'kdprofile'=> $kdProfile,
                    'statusenabled'=> true,
                    'tglinput'=> date('Y-m-d'),
                    'kompetensi'=>$dp['kompetensi'],
                    'norec_apd'=>$request['norec_apd'],
                    'pengertian'=>$dp['pengertian'],
                    'skor'=>$dp['skor'],
                    'hasil'=>$dp['hasil'],
                ]);
                $crud = "Simpan Hasil Kraepelin";
                } else {
                    \DB::table('inputhasilkraepelind_t')->where('norec', $request['norec'])->update([
                    'tglinput'=> date('Y-m-d'),
                    'kompetensi'=>$dp['kompetensi'],
                    'norec_apd'=>$request['norec_apd'],
                    'pengertian'=>$dp['pengertian'],
                    'skor'=>$dp['skor'],
                    'hasil'=>$dp['hasil'],
                ]);
                $crud = "Ubah Hasil Kraepelin";
                }
            }
            
            
            $transStatus= 'true';
        } catch (\Throwable $th) {
            $transStatus= 'false';
            
        }
        if ($transStatus == 'true') {
            DB::commit();
            $transMessage = $crud.' berhasil';
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'ea@epic',
            );
        } else {
            $transMessage = $crud." gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'e'=> $th->getLine(),
                'ee'=> $th->getMessage(),
                'as' => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveIST(Request $request)
    {
         $kdProfile = (int) $this->getDataKdProfile($request);
        // $idMax = \DB::table('normapsikologi_m')->max('id');
        $crud="";
        \DB::beginTransaction();
            $datapsikologi = $request['data'];

        try {
            if(isset($request['delete'])){
                DB::table('inputhasilist_t')->where('norec', $request['norec'])->delete();
                $crud = "Hapus Hasil IST";
            }
          foreach ($datapsikologi as $dp) {
                if($dp['norec'] == ""){
                    \DB::table('inputhasilist_t')->insert([
                        'norec'=>substr(\Webpatser\Uuid\Uuid::generate(), 0, 32),
                        'kdprofile'=> $kdProfile,
                        'statusenabled'=> true,
                        'tglinput'=> date('Y-m-d'),
                        'tujuan'=>$dp['tujuan'],
                        'nomor'=>$dp['nomor'],
                        'test'=>$dp['test'],
                        'jawaban'=>$dp['jawaban'],
                        'nilai'=>$dp['nilai'],
                        'norec_apd'=>$dp['norec_apd'],
                        
                    ]);
                    $crud = "Simpan Hasil IST";
                } else {
                    \DB::table('inputhasilist_t')->where('norec', $dp['norec'])->update([
                    'statusenabled'=> true,
                    'tglinput'=> date('Y-m-d'),
                    'tujuan'=>$dp['tujuan'],
                    'nomor'=>$dp['nomor'],
                    'test'=>$dp['test'],
                    'jawaban'=>$dp['jawaban'],
                    'nilai'=>$dp['nilai'],
                    'norec_apd'=>$dp['norec_apd'],
                ]);
                $crud = "Ubah Hasil IST";
                }
        }
            if(isset($request['delete'])){
                    \DB::table('inputhasilist_t')->where('norec', $request['norec'])->delete();
                $crud = "Hapus Data IST";

            } 
            
            
            $transStatus= 'true';
        } catch (\Throwable $th) {
            $transStatus= 'false';
            
        }
        if ($transStatus == 'true') {
            DB::commit();
            $transMessage = $crud.' berhasil';
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'ea@epic',
            );
        } else {
            $transMessage = $crud." gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'e'=> $th->getLine(),
                'ee'=> $th->getMessage(),
                'as' => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getKunJawIST(Request $request)
    {
        $data = \DB::select(DB::raw("SELECT * FROM kuncijawabanist_m where kdprofile = 30 and statusenabled = true"));

        $result = array(
            'data'=> $data,
            'as'=> 'FIziInipi'
        );
        return $this->respond($result);
    }
    public function getHasilIST(Request $request)
    {
        $data = \DB::select(DB::raw("SELECT * from inputhasilist_t where norec_apd ilike '$request[norec_apd]' order by nomor asc"));
        $result = array(
            "data"=> $data,
            'as'=> 'Fizi'
        );
        return $this->respond($result);
    }
    public function getNormaIST(Request $request)
    {
        $rw = $request['norma'];
        $data = \DB::select(DB::raw("
        SELECT sw, rw, test from normaist_m where umur >= $request[umur1] and umur <= $request[umur2] and rw = $rw[se] and test ilike 'se'
        union all
        SELECT sw, rw, test from normaist_m where umur >= $request[umur1] and umur <= $request[umur2] and rw = $rw[wa] and test ilike 'wa'
        union all
        SELECT sw, rw, test from normaist_m where umur >= $request[umur1] and umur <= $request[umur2] and rw = $rw[an] and test ilike 'an'
        union all
        SELECT sw, rw, test from normaist_m where umur >= $request[umur1] and umur <= $request[umur2] and rw = $rw[ge] and test ilike 'ge'
        union all
        SELECT sw, rw, test from normaist_m where umur >= $request[umur1] and umur <= $request[umur2] and rw = $rw[me] and test ilike 'me'
        union all
        SELECT sw, rw, test from normaist_m where umur >= $request[umur1] and umur <= $request[umur2] and rw = $rw[ra] and test ilike 'ra'
        union all
        SELECT sw, rw, test from normaist_m where umur >= $request[umur1] and umur <= $request[umur2] and rw = $rw[zr] and test ilike 'zr'
        union all
        SELECT sw, rw, test from normaist_m where umur >= $request[umur1] and umur <= $request[umur2] and rw = $rw[fa] and test ilike 'fa'
        union all
        SELECT sw, rw, test from normaist_m where umur >= $request[umur1] and umur <= $request[umur2] and rw = $rw[wu] and test ilike 'wu'
        "));
        $test = "";
        $rwsum= 0;
        $umur = $request['umur1'];
        $gesamt = 0;
        $iq=0;
        foreach ($data as $dt) {
            $rwsum+=$dt->rw;
        }
        if($umur >= 19 && $umur <= 20){
            $umur = 20;
        } else if($umur >= 21 && $umur <= 24){
            $umur = 24;
        } else if($umur >= 25 && $umur <= 28){
            $umur = 28;
        } else if($umur >= 29 && $umur <= 33){
            $umur = 33;
        } else if($umur >= 34 && $umur <= 39){
            $umur = 39;
        } else if($umur >= 40 && $umur <= 45){
            $umur = 45;
        } else if($umur >= 46){
            $umur = 60;
        }
        $datagesamt = \DB::table('gesamt_m')->where('umur', $umur)->where('rw', $rwsum)->select('sw')->get();
        foreach ($datagesamt as $dg) {
            $gesamt = $dg->sw;
        }

        $dataiq = \DB::table('gesamt_m')->where('umur', $umur)->where('rw', $gesamt)->select('iq')->get();
        foreach ($dataiq as $di) {
            $iq = $di->iq;
        }
        $result = array(
            "data"=> $data,
            'rw'=> $rwsum,
            'umur'=>$umur,
            'gesamt'=>$gesamt,
            'iq'=>$iq,
            'as'=> 'Fizi'
        );
        
        return $this->respond($result);
    }
    public function saveHasilISTDetail(Request $request)
    {
          $kdProfile = (int) $this->getDataKdProfile($request);
        // $idMax = \DB::table('normapsikologi_m')->max('id');
        $crud="";
        \DB::beginTransaction();
            $se= $request['se'];
            $an= $request['an'];
            $fa= $request['fa'];
            $wa= $request['wa'];
            $ge= $request['ge'];
            $me= $request['me'];
            $zr= $request['zr'];
            $wu= $request['wu'];
            $ra= $request['ra'];
            $jml= $request['jml'];
        try {

            $ceknorec_apd = \DB::table('inputhasilistd_t')->where('norec_apd', $request['norec_apd'])->get();
            if(count($ceknorec_apd) > 0){
                \DB::table('inputhasilistd_t')->where('norec_apd', $request['norec_apd'])->update([
                    'statusenabled'=> false
                ]);
            }else{

            }
            if($request['norec'] == ""){
            \DB::table('inputhasilistd_t')->insert([
                'norec'=>substr(\Webpatser\Uuid\Uuid::generate(), 0, 32),
                'kdprofile'=> $kdProfile,
                'statusenabled'=> true,
                'tglinput'=> date('Y-m-d'),
                'norec_apd'=>$request['norec_apd'],
                'se_rw'=>$se['rw'],'se_sw'=>$se['sw'],
                'an_rw'=>$an['rw'],'an_sw'=>$an['sw'],
                'fa_rw'=>$fa['rw'],'fa_sw'=>$fa['sw'],
                'wa_rw'=>$wa['rw'],'wa_sw'=>$wa['sw'],
                'ge_rw'=>$ge['rw'],'ge_sw'=>$ge['sw'],
                'me_rw'=>$me['rw'],'me_sw'=>$me['sw'],
                'zr_rw'=>$zr['rw'],'zr_sw'=>$zr['sw'],
                'wu_rw'=>$wu['rw'],'wu_sw'=>$wu['sw'],
                'ra_rw'=>$ra['rw'],'ra_sw'=>$ra['sw'],
                'jml_rw'=>$jml['rw'],'jml_sw'=>$jml['sw'],
                'iq'=>$request['iq'],
                'dominasi'=>$request['dominasi']
            ]);
            $crud = "Simpan Hasil IST";
            } else {
                \DB::table('inputhasilistd_t')->where('norec', $dp['norec'])->update([
                'tglinput'=> date('Y-m-d'),
                'norec_apd'=>$request['norec_apd'],
            ]);
            $crud = "Ubah Hasil IST";
            }
            
            
            $transStatus= 'true';
        } catch (\Throwable $th) {
            $transStatus= 'false';
            
        }
        if ($transStatus == 'true') {
            DB::commit();
            $transMessage = $crud.' berhasil';
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'ea@epic',
            );
        } else {
            $transMessage = $crud." gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'e'=> $th->getLine(),
                'ee'=> $th->getMessage(),
                'as' => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveMonitoringTaksId(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $deptJalan = explode(',', $this->settingDataFixed('kdDepartemenRawatJalanFix', $idProfile));
        $kdDepartemenRawatJalan = [];
        foreach ($deptJalan as $item) {
            $kdDepartemenRawatJalan[] =  (int)$item;
        }
        DB::beginTransaction();
        try {

            // Cek Pasien Rawat Jalan
            $data = DB::table("pasiendaftar_t as pd")
                ->join('ruangan_m as rm', 'rm.id', '=', 'pd.objectruanganlastfk')
                ->where('pd.kdprofile', $idProfile)
                ->where('pd.statusenabled', true)
                ->where('pd.norec', $request['noregistrasifk'])
                ->wherein('rm.objectdepartemenfk', $kdDepartemenRawatJalan)
                ->first();

            if (!empty($data)) {
                $monitoring = MonitoringTaskId::where('noregistrasifk', $request['noregistrasifk'])
                    ->where('taskid', $request['taskid'])
                    ->where('kdprofile', $idProfile)
                    ->where('statusenabled', true)
                    ->first();

                if (empty($monitoring)) {
                    // insert data monitoring task id
                    $monitoring = new MonitoringTaskId();
                    $monitoring->norec = $monitoring->generateNewId();
                    $monitoring->kdprofile = $idProfile;
                    $monitoring->statusenabled = true;
                    $monitoring->noregistrasifk = $request['noregistrasifk'];
                    $monitoring->taskid = $request['taskid'];
                    $monitoring->waktu = $request['waktu'];
                    $monitoring->statuskirim = $request['statuskirim'];
                    $monitoring->save();
                } else {
                    // update data monitoring task id jika status kirim true
                    if ($request['statuskirim']) {
                        $monitoring->waktu = $request['waktu'];
                        $monitoring->statuskirim = $request['statuskirim'];
                        $monitoring->save();
                    }
                }
            }

            $transStatus = true;
            $transMessage = "Simpan Berhasil";
        } catch (\Exception $e) {
            $transStatus = false;
            $transMessage = "Simpan Gagal";
        }

        if ($transStatus) {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'hs@epic'
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "as" => 'hs@epic',
                'e'=> $e->getLine(). $e->getMessage()
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getComboAntrol(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $deptJalan = explode (',',$this->settingDataFixed('kdDepartemenRawatJalanFix',$idProfile));
        $kdDepartemenRawatJalan = [];
        foreach ($deptJalan as $item){
            $kdDepartemenRawatJalan []=  (int)$item;
        }
        $ruanganRajal = \DB::table('ruangan_m as ru')
            ->where('ru.kdprofile',$idProfile)
            ->where('statusenabled',true)
            ->wherein('ru.objectdepartemenfk', $kdDepartemenRawatJalan)
            ->orderBy('ru.namaruangan')
            ->get();



        $dataKelompok = \DB::table('kelompokpasien_m as ru')
           ->where('ru.statusenabled', true)
           ->orderBy('ru.kelompokpasien')
           ->get();

        $result = array(
            'kelompokpasien' => $dataKelompok,
            'ruanganRajal' => $ruanganRajal,
            'message' => 'as@epic',
        );
        return $this->respond($result);
    }
    public function disabledMonitoringTaksId(Request $request){
        $kdProfile = $this->getDataKdProfile($request);

        DB::beginTransaction();
        try {


            $monitoring = MonitoringTaksId::where('noregistrasifk', $request['noregistrasifk'])
            ->where('kdprofile', $kdProfile)
            ->update(['statusenabled'=> false]);

            $transStatus = true;
            $transMessage = "Simpan Berhasil";
        } catch (\Exception $e) {
            $transStatus = false;
            $transMessage = "Simpan Gagal";
        }

        if ($transStatus) {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'hs@epic'
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "as" => 'hs@epic'
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getMonitoringTaksId(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $data = MonitoringTaskId::where('noregistrasifk', $request['norec_pd'])
            ->where('kdprofile', '=', $idProfile)
            ->where('statusenabled', true)
            ->where('taskid', '<=', $request['taskid'])
            ->orderBy('taskid', 'asc')
            ->get();

        return $data;
    }
    public function getInformasiMonitoringTaksId(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $tglawal = $request['tglAwal'];
        $tglakhir = $request['tglAkhir'];

        $nocm = "";
        if(isset($request['norm']) && $request['norm'] != '' && $request['norm'] != null) {
            $nocm = " and ps.nocm = '". $request['norm'] ."'";
        }
        $nama = "";
        if(isset($request['nama']) && $request['nama'] != '' && $request['nama'] != null) {
            $nama = " and ps.namapasien ilike '%". $request['nama'] ."%'";
        }
        $ruangId = "";
        if(isset($request['ruangId']) && $request['ruangId'] != '' && $request['ruangId'] != null) {
            $ruangId = " and rm.id = '". $request['ruangId'] ."'";
        }
        $kdBooking = "";
        if(isset($request['kdBooking']) && $request['kdBooking'] != '' && $request['kdBooking'] != null) {
            $kdBooking = " and sx.noregistrasi = '". $request['kdBooking'] ."'";
        }
        $kelId = "";
        if (isset($request['kelId']) && $request['kelId'] != '' && $request['kelId'] != null) {
            $kelId = " and kp.id = '" . $request['kelId'] . "'";
        }

        $data = collect(DB::select("
            WITH sumber AS (
                select * from (
                    select
                    ps.nocm as norm,
                    case when pd.ismobilejkn = true then pd.statusschedule else pd.noregistrasi end as noregistrasi,
                    mt.noregistrasifk,
                    pd.tglregistrasi,
                    ps.namapasien,
                    rm.namaruangan,
                    mt.taskid,
                    mt.waktu,
                    mt.statuskirim,
                    row_number() over(PARTITION BY mt.noregistrasifk,mt.taskid ORDER BY taskid) as nomor
                    from monitoringtaskid_t mt
                    inner join pasiendaftar_t pd on pd.norec = mt.noregistrasifk
                    inner join ruangan_m rm on rm.id = pd.objectruanganasalfk
                    inner join pasien_m ps on ps.id = pd.nocmfk
                    left join kelompokpasien_m kp on kp.id = pd.objectkelompokpasienlastfk
                    where pd.statusenabled = true
                    and rm.objectdepartemenfk = 18
                    and pd.tglregistrasi between '$tglawal' and '$tglakhir'
                    $nocm
                    $nama
                    $ruangId
                    $kelId
                ) x
                where x.nomor = 1
            )
            select sx.norm, sx.noregistrasi, sx.tglregistrasi, sx.namapasien, sx.namaruangan, sx.noregistrasifk,
            (select sz.waktu from sumber sz where sz.noregistrasi = sx.noregistrasi and sz.taskid = 1) as taksid_1,
            (select sz.statuskirim from sumber sz where sz.noregistrasi = sx.noregistrasi and sz.taskid = 1) as status_1,
            (select sz.waktu from sumber sz where sz.noregistrasi = sx.noregistrasi and sz.taskid = 2) as taksid_2,
            (select sz.statuskirim from sumber sz where sz.noregistrasi = sx.noregistrasi and sz.taskid = 2) as status_2,
            (select sz.waktu from sumber sz where sz.noregistrasi = sx.noregistrasi and sz.taskid = 3) as taksid_3,
            (select sz.statuskirim from sumber sz where sz.noregistrasi = sx.noregistrasi and sz.taskid = 3) as status_3,
            (select sz.waktu from sumber sz where sz.noregistrasi = sx.noregistrasi and sz.taskid = 4) as taksid_4,
            (select sz.statuskirim from sumber sz where sz.noregistrasi = sx.noregistrasi and sz.taskid = 4) as status_4,
            (select sz.waktu from sumber sz where sz.noregistrasi = sx.noregistrasi and sz.taskid = 5) as taksid_5,
            (select sz.statuskirim from sumber sz where sz.noregistrasi = sx.noregistrasi and sz.taskid = 5) as status_5,
            (select sz.waktu from sumber sz where sz.noregistrasi = sx.noregistrasi and sz.taskid = 6) as taksid_6,
            (select sz.statuskirim from sumber sz where sz.noregistrasi = sx.noregistrasi and sz.taskid = 6) as status_6,
            (select sz.waktu from sumber sz where sz.noregistrasi = sx.noregistrasi and sz.taskid = 7) as taksid_7,
            (select sz.statuskirim from sumber sz where sz.noregistrasi = sx.noregistrasi and sz.taskid = 7) as status_7
            from sumber sx
            where 1=1
            $kdBooking
            GROUP BY sx.norm, sx.noregistrasi, sx.tglregistrasi, sx.namapasien, sx.namaruangan, sx.noregistrasifk
            ORDER BY sx.noregistrasi
        "));

        foreach($data as $item) {
            $item->taksid_1 = $item->taksid_1 == null ? "-" : date('Y-m-d H:i', $item->taksid_1 / 1000);
            $item->taksid_2 = $item->taksid_2 == null ? "-" : date('Y-m-d H:i', $item->taksid_2 / 1000);
            $item->taksid_3 = $item->taksid_3 == null ? "-" : date('Y-m-d H:i', $item->taksid_3 / 1000);
            $item->taksid_4 = $item->taksid_4 == null ? "-" : date('Y-m-d H:i', $item->taksid_4 / 1000);
            $item->taksid_5 = $item->taksid_5 == null ? "-" : date('Y-m-d H:i', $item->taksid_5 / 1000);
            $item->taksid_6 = $item->taksid_6 == null ? "-" : date('Y-m-d H:i', $item->taksid_6 / 1000);
            $item->taksid_7 = $item->taksid_7 == null ? "-" : date('Y-m-d H:i', $item->taksid_7 / 1000);
        }

        return $this->respond($data);
    }
    public function LaporanPermintaanMakanGizi(Request $request)
    {
        // $tgl = \DB::select(DB::raw("SELECT GENERATE_SERIES(date_part('day', '2022-10-01'::date)::integer ,date_part('day', '2022-10-01'::date + '1 month'::interval - '1 day'::interval)::integer)"));
        $kdProfile = (int) $this->getDataKdProfile($request);
        $ruangan = '';
        if(isset($request['ruangan'])){
            $ruangan = "and x.objectruanganfk = $request[ruangan]";
        }
        $main = \DB::select(DB::raw("select id, jenisdiet from jenisdiet_m where statusenabled = true and kdprofile = $kdProfile "));
        $data = \DB::select(DB::raw("SELECT jd.id, jd.jenisdiet,
        count(jd.id)filter(where  date_part('day',x.tglmenu)= 1)as a1, 
        count(jd.id)filter(where  date_part('day',x.tglmenu)= 2)as a2,
        count(jd.id)filter(where  date_part('day',x.tglmenu)= 3)as a3,
        count(jd.id)filter(where  date_part('day',x.tglmenu)= 4)as a4,
        count(jd.id)filter(where  date_part('day',x.tglmenu)= 5)as a5,
        count(jd.id)filter(where  date_part('day',x.tglmenu)= 6)as a6,
        count(jd.id)filter(where  date_part('day',x.tglmenu)= 7)as a7,
        count(jd.id)filter(where  date_part('day',x.tglmenu)= 8)as a8,
        count(jd.id)filter(where  date_part('day',x.tglmenu)= 9)as a9,
        count(jd.id)filter(where  date_part('day',x.tglmenu)= 10)as a10,
        count(jd.id)filter(where  date_part('day',x.tglmenu)= 11)as a11,
        count(jd.id)filter(where  date_part('day',x.tglmenu)= 12)as a12,
        count(jd.id)filter(where  date_part('day',x.tglmenu)= 13)as a13,
        count(jd.id)filter(where  date_part('day',x.tglmenu)= 14)as a14,
        count(jd.id)filter(where  date_part('day',x.tglmenu)= 15)as a15,
        count(jd.id)filter(where  date_part('day',x.tglmenu)= 16)as a16,
        count(jd.id)filter(where  date_part('day',x.tglmenu)= 17)as a17,
        count(jd.id)filter(where  date_part('day',x.tglmenu)= 18)as a18,
        count(jd.id)filter(where  date_part('day',x.tglmenu)= 19)as a19,
        count(jd.id)filter(where  date_part('day',x.tglmenu)= 20)as a20,
        count(jd.id)filter(where  date_part('day',x.tglmenu)= 21)as a21,
        count(jd.id)filter(where  date_part('day',x.tglmenu)= 22)as a22,
        count(jd.id)filter(where  date_part('day',x.tglmenu)= 23)as a23,
        count(jd.id)filter(where  date_part('day',x.tglmenu)= 24)as a24,
        count(jd.id)filter(where  date_part('day',x.tglmenu)= 25)as a25,
        count(jd.id)filter(where  date_part('day',x.tglmenu)= 26)as a26,
        count(jd.id)filter(where  date_part('day',x.tglmenu)= 27)as a27,
        count(jd.id)filter(where  date_part('day',x.tglmenu)= 28)as a28,
        count(jd.id)filter(where  date_part('day',x.tglmenu)= 29)as a29,
        count(jd.id)filter(where  date_part('day',x.tglmenu)= 30)as a30,
        count(jd.id)filter(where  date_part('day',x.tglmenu)= 31)as a31 
            FROM (SELECT op.objectruanganfk, unnest(string_to_array(op.arrjenisdiet, ','))::integer as diet, so.tglorder as tglmenu FROM orderpelayanan_t op 
            inner join strukorder_t so on so.norec = op.strukorderfk
            where op.keteranganlainnya_quo ilike 'Order Gizi'and op.kdprofile = 30 and op.statusenabled = true 
            )as x
            inner join jenisdiet_m jd on jd.id = x.diet
            where date_part('month', x.tglmenu)= $request[bulan] and date_part('year', x.tglmenu) = $request[tahun] $ruangan
            GROUP BY jd.jenisdiet, jd.id
            ORDER BY jd.id asc
        "));
        
        $jenisdiet = '';
        $a1=0; $a2=0; $a3=0; $a4=0; $a5=0; $a6=0; $a7=0; $a8=0; $a9=0; $a10 = 0; $a11 = 0; $a12 = 0; $a13 = 0; $a14 = 0; $a15 = 0; $a16 = 0; $a17 = 0; $a18 = 0; $a19 = 0; 
        $a20 = 0; $a21 = 0; $a22 = 0; $a23 = 0; $a24 = 0; $a25 = 0; $a26 = 0; $a27 = 0; $a28 = 0; $a29 = 0; $a30 = 0; $a31 = 0; $total = 0;
        $detail = [];
        foreach ($main as $m) {
            // $jenisdiet = '';
            $a1=0; $a2=0; $a3=0; $a4=0; $a5=0; $a6=0; $a7=0; $a8=0; $a9=0; $a10 = 0; $a11 = 0; $a12 = 0; $a13 = 0; $a14 = 0; $a15 = 0; $a16 = 0; $a17 = 0; $a18 = 0; $a19 = 0; 
            $a20 = 0; $a21 = 0; $a22 = 0; $a23 = 0; $a24 = 0; $a25 = 0; $a26 = 0; $a27 = 0; $a28 = 0; $a29 = 0; $a30 = 0; $a31 = 0; $total = 0;
            $jenisdiet = $m->jenisdiet;
            
            foreach ($data as $d) {
                if($d->id == $m->id){
                    $a1 = $d->a1;
                    $a2 = $d->a2;
                    $a3 = $d->a3;
                    $a4 = $d->a4;
                    $a5 = $d->a5;
                    $a6 = $d->a6;
                    $a7 = $d->a7;
                    $a8 = $d->a8;
                    $a9 = $d->a9;
                    $a10 = $d->a10;
                    $a11 = $d->a11;
                    $a12 = $d->a12;
                    $a13 = $d->a13;
                    $a14 = $d->a14;
                    $a15 = $d->a15;
                    $a16 = $d->a16;
                    $a17 = $d->a17;
                    $a18 = $d->a18;
                    $a19 = $d->a19;
                    $a20 = $d->a20;
                    $a21 = $d->a21;
                    $a22 = $d->a22;
                    $a23 = $d->a23;
                    $a24 = $d->a24;
                    $a25 = $d->a25;
                    $a26 = $d->a26;
                    $a27 = $d->a27;
                    $a28 = $d->a28;
                    $a29 = $d->a29;
                    $a30 = $d->a30;
                    $a31 = $d->a31;
                    
                }
                $total = $a1+ $a2+ $a3+ $a4+ $a5+ $a6+ $a7+ $a8+ $a9+ $a10+ $a11+ $a12+ $a13+ $a14+ $a15+ 
                    $a16+ $a17+ $a18+ $a19+ $a20+ $a21+ $a22+ $a23+ $a24+ $a25+ $a26+ $a27+ $a28+ $a29+ $a30+ $a31;
                   
            }
            $detail[] = array(
                'jenisdiet'=> $jenisdiet,
                'a1'=> $a1,
                'a2'=> $a2,
                'a3'=> $a3,
                'a4'=> $a4,
                'a5'=> $a5,
                'a6'=> $a6,
                'a7'=> $a7,
                'a8'=> $a8,
                'a9'=> $a9,
                'a10'=> $a10,
                'a11'=> $a11,
                'a12'=> $a12,
                'a13'=> $a13,
                'a14'=> $a14,
                'a15'=> $a15,
                'a16'=> $a16,
                'a17'=> $a17,
                'a18'=> $a18,
                'a19'=> $a19,
                'a20'=> $a20,
                'a21'=> $a21,
                'a22'=> $a22,
                'a23'=> $a23,
                'a24'=> $a24,
                'a25'=> $a25,
                'a26'=> $a26,
                'a27'=> $a27,
                'a28'=> $a28,
                'a29'=> $a29,
                'a30'=> $a30,
                'a31'=> $a31,
                'total'=> $total,
            );
        }
        $result = array(
            'data'=> $detail,
            'as'=> 'Fizichann'
        );
        return $this->respond($result);

    }
    public function LaporanPermintaanMakanGiziBangsal(Request $request)
    {
        $tglmain = \DB::select(DB::raw("SELECT GENERATE_SERIES(date_part('day', '$request[tahun]-$request[bulan]-01'::date)::integer ,date_part('day', '$request[tahun]-$request[bulan]-01'::date + '1 month'::interval - '1 day'::interval)::integer) tglmenu"));
        $kdProfile = (int) $this->getDataKdProfile($request);
        // $main = \DB::select(DB::raw("select id, jenisdiet from jenisdiet_m where statusenabled = true and kdprofile = $kdProfile "));
        $data = \DB::select(DB::raw("SELECT x.tglmenu,
        CASE WHEN x.reportdisplay = 'vip' THEN count(x.arrjenisdiet)else 0 END as vip,
        CASE WHEN x.reportdisplay = 'kelas_3' THEN count(x.arrjenisdiet)else 0 END as kelas_3,
        CASE WHEN x.reportdisplay = 'kelas_2' THEN count(x.arrjenisdiet)else 0 END as kelas_2,
        CASE WHEN x.reportdisplay = 'kelas_1' THEN count(x.arrjenisdiet)else 0 END as kelas_1,
        CASE WHEN x.reportdisplay = 'Non Kelas' AND x.idr = 802 THEN count(x.arrjenisdiet)else 0 END as arimbi,
        CASE WHEN x.reportdisplay = 'Non Kelas' AND x.idr = 792 THEN count(x.arrjenisdiet)else 0 END as bima,
        CASE WHEN x.reportdisplay = 'Non Kelas' AND x.idr = 796 THEN count(x.arrjenisdiet)else 0 END as drupadi,
        CASE WHEN x.reportdisplay = 'Non Kelas' AND x.idr = 800 THEN count(x.arrjenisdiet)else 0 END as kresna,
        CASE WHEN x.reportdisplay = 'Non Kelas' AND x.idr = 805 THEN count(x.arrjenisdiet)else 0 END as yudistira
        FROM (SELECT date_part('day', so.tglorder)tglmenu, unnest(string_to_array(op.arrjenisdiet, ','))arrjenisdiet, ke.reportdisplay, ru.id idr FROM orderpelayanan_t op inner join kelas_m ke on ke.id = op.objectkelasfk
        inner join strukorder_t so on so.norec =op.strukorderfk
        inner join ruangan_m ru on ru.id = op.objectruanganfk where op.keteranganlainnya_quo ilike 'Order Gizi'
            and date_part('month', so.tglorder) = $request[bulan] and date_part('year', so.tglorder) = $request[tahun])as x
            GROUP BY x.tglmenu, x.reportdisplay, x.idr
        "));
        $tgl = '';
        $vip = 0;
        $k3=0;
        $k2=0;
        $k1=0;
        $arimbi = 0;
        $bima = 0;
        $drupadi = 0;
        $kresna = 0;
        $yudistira = 0;
        $total=0;
        $detail=[];
        foreach ($tglmain as $t) {
            $tgl = '';
            $vip = 0;
            $k3=0;
            $k2=0;
            $k1=0;
            $arimbi = 0;
            $bima = 0;
            $drupadi = 0;
            $kresna = 0;
            $yudistira = 0;
            $total=0;   
            $tgl = $t->tglmenu;
            foreach ($data as $d) {
                if($t->tglmenu == $d->tglmenu){
                    // $tgl = $t->tglmenu;
                    $vip += $d->vip;
                    $k3+=$d->kelas_3;
                    $k2+=$d->kelas_2;
                    $k1+=$d->kelas_1;
                    $arimbi += $d->arimbi;
                    $bima += $d->bima;
                    $drupadi += $d->drupadi;
                    $kresna += $d->kresna;
                    $yudistira += $d->yudistira;
                    // break;
                }
                    $total=$vip+$k1+$k2+$k3+$arimbi+$bima+$drupadi+$kresna+$yudistira;
            }
            $detail[]= array(
                'tglmenu'=>$tgl,
                'vip'=> $vip,
                'kelas_1'=> $k1,
                'kelas_2'=> $k2,
                'kelas_3'=> $k3,
                'arimbi'=> $arimbi,
                'bima'=> $bima,
                'drupadi'=> $drupadi,
                'kresna'=> $kresna,
                'yudistira'=> $yudistira,
                'jumlah'=> $total,
            );
        }
        

        $result = array(
            'data'=> $detail,
            'as'=> 'Fizichann'
        );
        return $this->respond($result);

    }
    public function LaporanPermintaanMakanGiziWaktu(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $main = \DB::select(DB::raw("select id, jenisdiet from jenisdiet_m where statusenabled = true and kdprofile = $kdProfile "));
        $data = DB::select(DB::raw("SELECT date_part('day', x.tglmenu::date), jd.jenisdiet,jd.id,
            /*pagi*/
            count(x.arr)filter(where jw.id in(0,3,6) and ke.reportdisplay ilike 'vip') as vip1,
            count(x.arr)filter(where jw.id in(0,3,6) and ke.reportdisplay ilike 'kelas_3') as k31,
            count(x.arr)filter(where jw.id in(0,3,6) and ke.reportdisplay ilike 'kelas_2') as k21,
            count(x.arr)filter(where jw.id in(0,3,6) and ke.reportdisplay ilike 'kelas_1') as k11,
            count(x.arr)filter(where jw.id in(0,3,6) and ke.reportdisplay ilike 'Non Kelas' and ru.id =802 ) as arimbi1,
            count(x.arr)filter(where jw.id in(0,3,6) and ke.reportdisplay ilike 'Non Kelas' and ru.id =792 ) as bima1,
            count(x.arr)filter(where jw.id in(0,3,6) and ke.reportdisplay ilike 'Non Kelas' and ru.id =796 ) as drupadi1,
            count(x.arr)filter(where jw.id in(0,3,6) and ke.reportdisplay ilike 'Non Kelas' and ru.id =800 ) as kresna1,
            count(x.arr)filter(where jw.id in(0,3,6) and ke.reportdisplay ilike 'Non Kelas' and ru.id =805 ) as yudistira1,
            count(x.arr)filter(where jw.id in(0,3,6)) as jumlah1,

            /*siang*/
            count(x.arr)filter(where jw.id in(1,4,6) and ke.reportdisplay ilike 'vip') as vip2,
            count(x.arr)filter(where jw.id in(1,4,6) and ke.reportdisplay ilike 'kelas_3') as k32,
            count(x.arr)filter(where jw.id in(1,4,6) and ke.reportdisplay ilike 'kelas_2') as k22,
            count(x.arr)filter(where jw.id in(1,4,6) and ke.reportdisplay ilike 'kelas_1') as k12,
            count(x.arr)filter(where jw.id in(1,4,6) and ke.reportdisplay ilike 'Non Kelas' and ru.id =802 ) as arimbi2,
            count(x.arr)filter(where jw.id in(1,4,6) and ke.reportdisplay ilike 'Non Kelas' and ru.id =792 ) as bima2,
            count(x.arr)filter(where jw.id in(1,4,6) and ke.reportdisplay ilike 'Non Kelas' and ru.id =796 ) as drupadi2,
            count(x.arr)filter(where jw.id in(1,4,6) and ke.reportdisplay ilike 'Non Kelas' and ru.id =800 ) as kresna2,
            count(x.arr)filter(where jw.id in(1,4,6) and ke.reportdisplay ilike 'Non Kelas' and ru.id =805 ) as yudistira2,
            count(x.arr)filter(where jw.id in(1,4,6)) as jumlah2,

            /*sore*/
            count(x.arr)filter(where jw.id in(2,5,6) and ke.reportdisplay ilike 'vip') as vip3,
            count(x.arr)filter(where jw.id in(2,5,6) and ke.reportdisplay ilike 'kelas_3') as k33,
            count(x.arr)filter(where jw.id in(2,5,6) and ke.reportdisplay ilike 'kelas_2') as k23,
            count(x.arr)filter(where jw.id in(2,5,6) and ke.reportdisplay ilike 'kelas_1') as k13,
            count(x.arr)filter(where jw.id in(2,5,6) and ke.reportdisplay ilike 'Non Kelas' and ru.id =802 ) as arimbi3,
            count(x.arr)filter(where jw.id in(2,5,6) and ke.reportdisplay ilike 'Non Kelas' and ru.id =792 ) as bima3,
            count(x.arr)filter(where jw.id in(2,5,6) and ke.reportdisplay ilike 'Non Kelas' and ru.id =796 ) as drupadi3,
            count(x.arr)filter(where jw.id in(2,5,6) and ke.reportdisplay ilike 'Non Kelas' and ru.id =800 ) as kresna3,
            count(x.arr)filter(where jw.id in(2,5,6) and ke.reportdisplay ilike 'Non Kelas' and ru.id =805 ) as yudistira3,
            count(x.arr)filter(where jw.id in(2,5,6)) as jumlah3

            -- /*hari*/
            -- count(x.arr)filter(where   ke.reportdisplay ilike 'vip') as vip4,
            -- count(x.arr)filter(where   ke.reportdisplay ilike 'kelas_3') as k34,
            -- count(x.arr)filter(where   ke.reportdisplay ilike 'kelas_2') as k24,
            -- count(x.arr)filter(where   ke.reportdisplay ilike 'kelas_1') as k14,
            -- count(x.arr)filter(where   ke.reportdisplay ilike 'Non Kelas' and ru.id =802 ) as arimbi4,
            -- count(x.arr)filter(where   ke.reportdisplay ilike 'Non Kelas' and ru.id =792 ) as bima4,
            -- count(x.arr)filter(where   ke.reportdisplay ilike 'Non Kelas' and ru.id =796 ) as drupadi4,
            -- count(x.arr)filter(where   ke.reportdisplay ilike 'Non Kelas' and ru.id =800 ) as kresna4,
            -- count(x.arr)filter(where   ke.reportdisplay ilike 'Non Kelas' and ru.id =805 ) as yudistira4,
            -- count(x.arr)as jumlah4
            from (
            select so.tglorder as tglmenu,unnest(string_to_array(op.arrjenisdiet, ','))arr, op.objectjeniswaktufk, op.objectkelasfk, op.objectruanganfk FROM orderpelayanan_t op 
                inner join strukorder_t so on so.norec = op.strukorderfk where op.keteranganlainnya_quo ilike 'Order Gizi'
            )as x
            inner join jenisdiet_m jd on jd.id = x.arr::integer
            inner join jeniswaktu_m jw on jw.id = x.objectjeniswaktufk
            inner join kelas_m ke on ke.id = x.objectkelasfk
            inner join ruangan_m ru on ru.id = x.objectruanganfk
            where x.tglmenu::date = '$request[periode]'
            GROUP BY jd.jenisdiet, ke.reportdisplay, x.tglmenu,jd.id;
        "));
        $jenisdiet = ''; $vip1=0; $vip2=0; $vip3=0;$vip4 = 0; $k31 = 0; $k32=0;$k33=0;$k34=0; $k21=0;$k22=0;$k23=0;$k24=0; $k11=0;$k12=0;$k13=0;$k14=0; 
        $arimbi1=0;$arimbi2=0;$arimbi3=0;$arimbi4=0;$bima1=0;$bima2=0;$bima3=0;$bima4=0; $drupadi1=0;$drupadi2=0;$drupadi3=0;$drupadi4=0; 
        $kresna1=0;$kresna2=0;$kresna3=0;$kresna4=0; $yudistira1=0;$yudistira2=0;$yudistira3=0;$yudistira4=0;
        $jumlah1=0;$jumlah2=0;$jumlah3=0;$jumlah4=0; $detial=[];
        foreach ($main as $m) {
            $jenisdiet = ''; $vip1=0; $vip2=0; $vip3=0;$vip4 = 0; $k31 = 0; $k32=0;$k33=0;$k34=0; $k21=0;$k22=0;$k23=0;$k24=0; $k11=0;$k12=0;$k13=0;$k14=0; 
            $arimbi1=0;$arimbi2=0;$arimbi3=0;$arimbi4=0;$bima1=0;$bima2=0;$bima3=0;$bima4=0; $drupadi1=0;$drupadi2=0;$drupadi3=0;$drupadi4=0; 
            $kresna1=0;$kresna2=0;$kresna3=0;$kresna4=0; $yudistira1=0;$yudistira2=0;$yudistira3=0;$yudistira4=0;
            $jumlah1=0;$jumlah2=0;$jumlah3=0;$jumlah4=0;
            $jenisdiet = $m->jenisdiet; 
            foreach ($data as $d) {
                if($d->id == $m->id){
                    $vip4 = $d->vip1+ $d->vip2+$d->vip3;
                    $k34 = $d->k31+ $d->k32+$d->k33;
                    $k24 = $d->k21+ $d->k22+$d->k23;
                    $k14 = $d->k11+ $d->k12+$d->k13;
                    $arimbi4 = $d->arimbi1+ $d->arimbi2+$d->arimbi3;
                    $bima4 = $d->bima1+ $d->bima2+$d->bima3;
                    $drupadi4 = $d->drupadi1+ $d->drupadi2+$d->drupadi3;
                    $kresna4 = $d->kresna1+ $d->kresna2+$d->kresna3;
                    $yudistira4 = $d->yudistira1+ $d->yudistira2+$d->yudistira3;
                    $jumlah4 = $d->jumlah1+ $d->jumlah2+$d->jumlah3;
                    $vip1=$d->vip1; $vip2=$d->vip2; $vip3=$d->vip3;
                    $k31 = $d->k31; $k32=$d->k32;$k33=$d->k33;
                    $k21=$d->k21;$k22=$d->k22;$k23=$d->k23; 
                    $k11=$d->k11;$k12=$d->k12;$k13=$d->k13; 
                    $arimbi1=$d->arimbi1;$arimbi2=$d->arimbi2;$arimbi3=$d->arimbi3;
                    $bima1=$d->bima1;$bima2=$d->bima2;$bima3=$d->bima3; 
                    $drupadi1=$d->drupadi1;$drupadi2=$d->drupadi2;$drupadi3=$d->drupadi3; 
                    $kresna1=$d->kresna1;$kresna2=$d->kresna2;$kresna3=$d->kresna3;
                    $yudistira1=$d->yudistira1;$yudistira2=$d->yudistira2;$yudistira3=$d->yudistira3;
                    $jumlah1=$d->jumlah1;$jumlah2=$d->jumlah2;$jumlah3=$d->jumlah3;
                }
            }
            $detail[]=array(
                'jenisdiet'=>$jenisdiet,
                'vip1'=>$vip1,
                'vip2'=>$vip2,
                'vip3'=>$vip3,
                'vip4'=>$vip4,
                'k11'=>$k11,
                'k12'=>$k12,
                'k13'=>$k13,
                'k14'=>$k14,
                'k21'=>$k21,
                'k22'=>$k22,
                'k23'=>$k23,
                'k24'=>$k24,
                'k31'=>$k31,
                'k32'=>$k32,
                'k33'=>$k33,
                'k34'=>$k34,
                'arimbi1'=>$arimbi1,
                'arimbi2'=>$arimbi2,
                'arimbi3'=>$arimbi3,
                'arimbi4'=>$arimbi4,
                'bima1'=>$bima1,
                'bima2'=>$bima2,
                'bima3'=>$bima3,
                'bima4'=>$bima4,
                'yudistira1'=>$yudistira1,
                'yudistira2'=>$yudistira2,
                'yudistira3'=>$yudistira3,
                'yudistira4'=>$yudistira4,
                'kresna1'=>$kresna1,
                'kresna2'=>$kresna2,
                'kresna3'=>$kresna3,
                'kresna4'=>$kresna4,
                'drupadi1'=>$drupadi1,
                'drupadi2'=>$drupadi2,
                'drupadi3'=>$drupadi3,
                'drupadi4'=>$drupadi4,
                'jumlah1'=>$jumlah1,
                'jumlah2'=>$jumlah2,
                'jumlah3'=>$jumlah3,
                'jumlah4'=>$jumlah4,
            );
        }
        $result=array(
            'data'=> $detail,
            'as'=>'Fiz'
        );
        return $this->respond($result);
    }
}