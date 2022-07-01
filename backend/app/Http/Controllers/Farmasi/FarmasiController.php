<?php
//“Great men are not born great, they grow great . . .”
//― Mario Puzo, The Godfather
/**
 * Created by PhpStorm.
 * User: as@epic
 * Date: 08/08/2017
 * Time: 12:48
 */

/**
 * Created by PhpStorm.
 * User: nengepic
 * Date: 09/08/2019
 * Time: 10:19
 */

namespace App\Http\Controllers\Farmasi;

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use App\Traits\Valet;
use DB;

use App\Transaksi\StrukOrder;
use App\Transaksi\StrukResep;
use App\Transaksi\OrderPelayanan;
use App\Master\LoginUser;



class FarmasiController extends ApiController
{
    use Valet;

    public function __construct()
    {
        parent::__construct($skip_authentication = false);
    }
    public function getDataComboDaftarPasien(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $deptPelayanan = explode (',',$this->settingDataFixed('kdDepartemenPelayanan',$idProfile));
        $kdDepartemenRawatPelayanan = [];
        foreach ($deptPelayanan as $itemPelayanan){
            $kdDepartemenRawatPelayanan []=  (int)$itemPelayanan;
        }
        $dataInstalasi = \DB::table('departemen_m as dp')
            ->where('dp.kdprofile', $idProfile)
            ->whereIn('dp.id',$kdDepartemenRawatPelayanan)
            ->where('dp.statusenabled',true)
            ->get();
        $dataRuangan = \DB::table('ruangan_m as ru')
            ->where('ru.kdprofile', $idProfile)
            ->where('ru.statusenabled',true)
            ->get();
        foreach ($dataInstalasi as $item){
            $detail=[];
            foreach ($dataRuangan  as $item2){
                if ($item->id == $item2->objectdepartemenfk){
                    $detail[] =array(
                        'id' =>   $item2->id,
                        'ruangan' =>   $item2->namaruangan,
                    );
                }
            }

            $dataDepartemen[]=array(
                'id' =>   $item->id,
                'departemen' =>   $item->namadepartemen,
                'ruangan' => $detail,
            );
        }
        $dataKelompok = \DB::table('kelompokpasien_m as kp')
            ->select('kp.id','kp.kelompokpasien')
            ->where('kp.statusenabled',true)
            ->get();
        $dataRuanganInap = \DB::table('ruangan_m as ru')
            ->where('ru.kdprofile', $idProfile)
            ->where('ru.statusenabled', true)
            ->whereIn('ru.objectdepartemenfk', [16,25])
            ->orderBy('ru.namaruangan')
            ->get();
        $dataJenisKelamin = \DB::table('jeniskelamin_m as jk')
            ->where('jk.statusenabled', true)
            ->orderBy('jk.jeniskelamin')
            ->get();
        $dataRuanganFarmasi = \DB::table('ruangan_m as ru')
            ->where('ru.kdprofile', $idProfile)
            ->where('ru.statusenabled', true)
            ->whereIn('ru.objectdepartemenfk', [14])
            ->orderBy('ru.namaruangan')
            ->get();

        $list = explode(',',$this->settingDataFixed('KdDepartemenPelayanan', $kdProfile));
        $kdDepartemenPelayanan = [];
        foreach ($list as $otem){
            $kdDepartemenPelayanan [] = (int)$otem;
        }
        $dataRuanganPelayanan = \DB::table('ruangan_m as ru')
            ->select('ru.id','ru.namaruangan')
            ->where('ru.kdprofile', $idProfile)
            ->where('ru.statusenabled', true)
            ->whereIn('ru.objectdepartemenfk', $kdDepartemenPelayanan)
            ->orderBy('ru.namaruangan')
            ->get();

        $result = array(
            'departemen' => $dataDepartemen,
            'kelompokpasien' =>   $dataKelompok,
            'ruangan' => $dataRuangan,
            'jeniskelamin' => $dataJenisKelamin,
            'ruanganinap' => $dataRuanganInap,
            'ruanganfarmasi' => $dataRuanganFarmasi,
            'ruanganpelayanan' => $dataRuanganPelayanan,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }
    public function getDaftarPasien(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $data = \DB::table('pasiendaftar_t as pd','pd.norec')
            ->leftjoin('registrasipelayananpasien_t as rpp','pd.norec','=','rpp.noregistrasifk')
//            ->JOIN('ruangan_m as ru','ru.id','=','apd.objectruanganfk')
//            ->JOIN('departemen_m as dp','dp.id','=','ru.objectdepartemenfk')
            ->JOIN ('pasien_m as ps','ps.id','=','pd.nocmfk')
            ->leftjoin('ruangan_m as ru','ru.id','=','pd.objectruanganlastfk')
            ->leftjoin('departemen_m as dp','dp.id','=','ru.objectdepartemenfk')
            ->leftJoin('jeniskelamin_m as jk','jk.id','=','ps.objectjeniskelaminfk')
            ->JOIN('kelompokpasien_m as kp','kp.id','=','pd.objectkelompokpasienlastfk')
            ->leftJoin('rekanan_m as rk','rk.id','=','pd.objectrekananfk')
            ->JOIN('kelas_m as kl','kl.id','=','pd.objectkelasfk')
            ->leftJoin('batalregistrasi_t as br','br.pasiendaftarfk','=','pd.norec')            
            ->select('pd.noregistrasi','ps.nocm','ps.namapasien','jk.jeniskelamin',
                'kp.id as kpid','kp.kelompokpasien','rk.namarekanan','kl.namakelas','kl.id as klid',
                'pd.tglregistrasi','pd.tglpulang','ps.tgllahir','rpp.noregistrasifk as rpp','pd.nostruklastfk','pd.norec as norec_pd','ru.namaruangan','dp.namadepartemen','pd.isclosing',
                DB::raw("
                case when pd.isclosing is null 
                    then 'Belum Closing' else 'Sudah Closing' 
                end closingkasir
                ,case when pd.nostruklastfk is null 
                    then 'Belum Verif' else 'Sudah Verif' 
                end verifkasir ")
            )
            ->where('pd.kdprofile', $idProfile)
            ->where('pd.statusenabled', true)
            ->whereNull('br.pasiendaftarfk')
            ->orderBy('pd.noregistrasi');

        if(isset($request['tglAwal']) && $request['tglAwal']!="" && $request['tglAwal']!="undefined"){
           // $data = $data->where('pd.tglregistrasi','>=', $request['tglAwal']);
            $tgl= $request['tglAkhir']." 23:59:59";
            $data = $data->whereRaw(" ((pd.tglregistrasi between '".$request['tglAwal']."' and '".$tgl."') or (pd.tglpulang between '".$request['tglAwal']."' and '".$tgl."')) ");
        }
        // if(isset($request['tglAkhir']) && $request['tglAkhir']!="" && $request['tglAkhir']!="undefined"){
        //     $tgl= $request['tglAkhir']." 23:59:59";
        //     $data = $data->where('pd.tglregistrasi','<=', $tgl);
        // }
        if(isset($request['dpid']) && $request['dpid']!="" && $request['dpid']!="undefined"){
            $data = $data->where('dp.id', $request['dpid']);
        }
        if(isset($request['kpid']) && $request['kpid']!="" && $request['kpid']!="undefined"){
            $data = $data->where('kp.id', $request['kpid']);
        }
        if(isset($request['noregistrasi']) && $request['noregistrasi']!="" && $request['noregistrasi']!="undefined"){
            $data = $data->where('pd.noregistrasi','ilike','%'. $request['noregistrasi'].'%');
        }
        if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('ps.nocm','ilike','%'. $request['nocm'].'%');
        }
        if(isset($request['namapasien']) && $request['namapasien']!="" && $request['namapasien']!="undefined"){
            $data = $data->where('ps.namapasien','ilike','%'. $request['namapasien'].'%');
        }

        $data = $data->groupBy('pd.noregistrasi','ps.nocm','ps.namapasien','jk.jeniskelamin',
            'kp.id','kp.kelompokpasien','rk.namarekanan','kl.namakelas','kl.id',
            'pd.tglregistrasi','pd.tglpulang','ps.tgllahir','rpp.noregistrasifk','pd.nostruklastfk','pd.norec','ru.namaruangan','dp.namadepartemen');
//        $data = \DB::table('antrianpasiendiperiksa_t as apd')
//            ->join('pasiendaftar_t as pd','pd.norec','=','apd.noregistrasifk')
//            ->leftjoin('registrasipelayananpasien_t as rpp','pd.norec','=','rpp.noregistrasifk')
//            ->JOIN('ruangan_m as ru','ru.id','=','apd.objectruanganfk')
//            ->JOIN('departemen_m as dp','dp.id','=','ru.objectdepartemenfk')
//            ->JOIN ('pasien_m as ps','ps.id','=','pd.nocmfk')
//            ->leftJoin('jeniskelamin_m as jk','jk.id','=','ps.objectjeniskelaminfk')
//            ->JOIN('kelompokpasien_m as kp','kp.id','=','pd.objectkelompokpasienlastfk')
//            ->leftJoin('rekanan_m as rk','rk.id','=','pd.objectrekananfk')
//            ->JOIN('kelas_m as kl','kl.id','=','pd.objectkelasfk')
//            ->leftJoin('batalregistrasi_t as br','br.pasiendaftarfk','=','pd.norec')
//            ->select('ru.namaruangan','pd.noregistrasi','ps.nocm','ps.namapasien','jk.jeniskelamin',
//                'kp.id as kpid','kp.kelompokpasien','rk.namarekanan','kl.namakelas','kl.id as klid',
//                'pd.tglregistrasi','pd.tglpulang','ps.tgllahir','apd.norec','rpp.noregistrasifk as rpp','pd.nostruklastfk','pd.norec as norec_pd')
//            ->where('apd.kdprofile', $idProfile)
//            ->where('pd.statusenabled', true)
//            ->whereNull('br.pasiendaftarfk')
//            ->orderBy('pd.noregistrasi');
//
//        if(isset($request['tglAwal']) && $request['tglAwal']!="" && $request['tglAwal']!="undefined"){
//            $data = $data->where('pd.tglregistrasi','>=', $request['tglAwal']);
//        }
//        if(isset($request['tglAkhir']) && $request['tglAkhir']!="" && $request['tglAkhir']!="undefined"){
//            $tgl= $request['tglAkhir']." 23:59:59";
//            $data = $data->where('pd.tglregistrasi','<=', $tgl);
//        }
//        if(isset($request['ruid']) && $request['ruid']!="" && $request['ruid']!="undefined"){
//            $data = $data->where('ru.id', $request['ruid']);
//        }
//        if(isset($request['dpid']) && $request['dpid']!="" && $request['dpid']!="undefined"){
//            $data = $data->where('dp.id', $request['dpid']);
//        }
//        if(isset($request['kpid']) && $request['kpid']!="" && $request['kpid']!="undefined"){
//            $data = $data->where('kp.id', $request['kpid']);
//        }
//        if(isset($request['noregistrasi']) && $request['noregistrasi']!="" && $request['noregistrasi']!="undefined"){
//            $data = $data->where('pd.noregistrasi','ilike','%'. $request['noregistrasi'].'%');
//        }
//        if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
//            $data = $data->where('ps.nocm','ilike','%'. $request['nocm'].'%');
//        }
//        if(isset($request['namapasien']) && $request['namapasien']!="" && $request['namapasien']!="undefined"){
//            $data = $data->where('ps.namapasien','ilike','%'. $request['namapasien'].'%');
//        }
//
//        $data = $data->groupBy('ru.namaruangan','pd.noregistrasi','ps.nocm','ps.namapasien','jk.jeniskelamin',
//            'kp.id','kp.kelompokpasien','rk.namarekanan','kl.namakelas','kl.id',
//            'pd.tglregistrasi','pd.tglpulang','ps.tgllahir','apd.norec','rpp.noregistrasifk','pd.nostruklastfk','pd.norec');

        $data = $data->take(300);
        $data = $data->get();
        return $this->respond($data);
    }
    public function getDaftarPasienRI(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $data = \DB::table('pasiendaftar_t as pd')
            ->leftjoin('registrasipelayananpasien_t as rpp','pd.norec','=','rpp.noregistrasifk')
            ->leftjoin('antrianpasiendiperiksa_t as apd','pd.norec','=','apd.noregistrasifk')
            ->JOIN('ruangan_m as ru','ru.id','=','pd.objectruanganlastfk')
            ->JOIN('departemen_m as dp','dp.id','=','ru.objectdepartemenfk')
            ->JOIN ('pasien_m as ps','ps.id','=','pd.nocmfk')
            ->leftJoin('jeniskelamin_m as jk','jk.id','=','ps.objectjeniskelaminfk')
            ->JOIN('kelompokpasien_m as kp','kp.id','=','pd.objectkelompokpasienlastfk')
            ->leftJoin('rekanan_m as rk','rk.id','=','pd.objectrekananfk')
            ->JOIN('kelas_m as kl','kl.id','=','pd.objectkelasfk')
            ->leftJoin('batalregistrasi_t as br','br.pasiendaftarfk','=','pd.norec')
            ->select('ru.namaruangan','pd.noregistrasi','ps.nocm','ps.namapasien','jk.jeniskelamin',
                'kp.id as kpid','kp.kelompokpasien','rk.namarekanan','kl.namakelas','kl.id as klid',
                'pd.tglregistrasi','pd.tglpulang','ps.tgllahir','rpp.noregistrasifk as rpp','pd.nostruklastfk','apd.norec','pd.norec as norec_pd')
            ->where('pd.kdprofile', $idProfile)
            ->where('pd.statusenabled', true)
            ->whereNull('br.pasiendaftarfk')
            ->orderBy('pd.noregistrasi');

//        if(isset($request['tglAwal']) && $request['tglAwal']!="" && $request['tglAwal']!="undefined"){
//            $data = $data->where('pd.tglregistrasi','>=', $request['tglAwal']);
//        }
//        if(isset($request['tglAkhir']) && $request['tglAkhir']!="" && $request['tglAkhir']!="undefined"){
//            $tgl= $request['tglAkhir']." 23:59:59";
//            $data = $data->where('pd.tglregistrasi','<=', $tgl);
//        }
        if(isset($request['ruid']) && $request['ruid']!="" && $request['ruid']!="undefined"){
            $data = $data->where('ru.id', $request['ruid']);
        }
//        if(isset($request['dpid']) && $request['dpid']!="" && $request['dpid']!="undefined"){
//            $data = $data->where('dp.id', $request['dpid']);
//        }
//        if(isset($request['kpid']) && $request['kpid']!="" && $request['kpid']!="undefined"){
//            $data = $data->where('kp.id', $request['kpid']);
//        }
        if(isset($request['noregistrasi']) && $request['noregistrasi']!="" && $request['noregistrasi']!="undefined"){
            $data = $data->where('pd.noregistrasi','ilike','%'. $request['noregistrasi'].'%');
        }
        if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('ps.nocm','ilike','%'. $request['nocm'].'%');
        }
        if(isset($request['namapasien']) && $request['namapasien']!="" && $request['namapasien']!="undefined"){
            $data = $data->where('ps.namapasien','ilike','%'. $request['namapasien'].'%');
        }

        $data = $data->groupBy('ru.namaruangan','pd.noregistrasi','ps.nocm','ps.namapasien','jk.jeniskelamin',
            'kp.id','kp.kelompokpasien','rk.namarekanan','kl.namakelas','kl.id',
            'pd.tglregistrasi','pd.tglpulang','ps.tgllahir','rpp.noregistrasifk','pd.nostruklastfk','apd.norec','pd.norec');
        $data = $data->where('dp.id','=',16);
        $data = $data->whereNull('pd.tglpulang');
        $data = $data->whereNull('apd.tglkeluar');
        $data = $data->take(50);
        $data = $data->get();
        return $this->respond($data);
    }
    public function getDaftarResep(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin = $request->all();
        $data = \DB::table('strukresep_t as sr')
            ->JOIN('antrianpasiendiperiksa_t as apd','apd.norec','=','sr.pasienfk')
            ->JOIN('pasiendaftar_t as pd','pd.norec','=','apd.noregistrasifk')
            ->JOIN('pasien_m as ps','ps.id','=','pd.nocmfk')
            ->JOIN('pegawai_m as pg','pg.id','=','sr.penulisresepfk')
            ->JOIN('ruangan_m as ru','ru.id','=','apd.objectruanganfk')
            ->JOIN('departemen_m as dp','dp.id','=','ru.objectdepartemenfk')
            ->JOIN('ruangan_m as ru2','ru2.id','=','sr.ruanganfk')
            ->JOIN('jeniskelamin_m as jk','jk.id','=','ps.objectjeniskelaminfk')
            ->JOIN('kelompokpasien_m as kp','kp.id','=','pd.objectkelompokpasienlastfk')
            ->leftJoin('rekanan_m as rk','rk.id','=','pd.objectrekananfk')
            ->JOIN('kelas_m as kl','kl.id','=','pd.objectkelasfk')
            ->JOIN('ruangan_m as ru1','ru1.id','=','sr.ruanganfk')
            ->select('sr.norec','sr.statusenabled','sr.noresep','sr.tglresep','ps.id as psid','pd.noregistrasi','ps.nocm','ps.namapasien','ru.id as ruid',
                'ru.namaruangan','pg.id as pgid','pg.namalengkap as dokter','ru2.id as ruapotikid',
                'ru2.namaruangan as namaruanganapotik','jk.jeniskelamin','ps.tgllahir','kl.id as klid','kl.namakelas',
                'pd.tglregistrasi','apd.norec as norec_apd','kp.kelompokpasien','pd.norec as norec_pd',
                DB::raw("
                case when pd.isclosing is null 
                    then 'Belum Closing' else 'Sudah Closing' 
                end closingkasir
                ,case when pd.nostruklastfk is null 
                    then 'Belum Verif' else 'Sudah Verif' 
                end verifkasir ")
                )
            ->where('sr.kdprofile', $idProfile)
            ->where('pd.statusenabled', true);
//            ->where('sr.statusenabled' != 'f');
        //where('sr.statusenabled' != 'f');

        if(isset($request['tglAwal']) && $request['tglAwal']!="" && $request['tglAwal']!="undefined"){
            $data = $data->where('sr.tglresep','>=', $request['tglAwal']);
        }
        if(isset($request['tglAkhir']) && $request['tglAkhir']!="" && $request['tglAkhir']!="undefined"){
            $tgl= $request['tglAkhir'];
            $data = $data->where('sr.tglresep','<=', $tgl);
        }
        if(isset($request['noresep']) && $request['noresep']!="" && $request['noresep']!="undefined"){
            $data = $data->where('sr.noresep','ilike','%'. $request['noresep']);
        }
        if(isset($request['noregistrasi']) && $request['noregistrasi']!="" && $request['noregistrasi']!="undefined"){
            $data = $data->where('pd.noregistrasi','=', $request['noregistrasi']);
        }
        if(isset($request['ruid']) && $request['ruid']!="" && $request['ruid']!="undefined"){
            $data = $data->where('ru.id', $request['ruid']);
        }
        if(isset($request['dpid']) && $request['dpid']!="" && $request['dpid']!="undefined"){
            $data = $data->where('dp.id', $request['dpid']);
        }
        if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('ps.nocm','ilike','%'. $request['nocm'].'%');
        }
        if(isset($request['namapasien']) && $request['namapasien']!="" && $request['namapasien']!="undefined"){
            $data = $data->where('ps.namapasien','ilike','%'. $request['namapasien'].'%');
        }
        if(isset($request['status']) && $request['status']!="" && $request['status']!="undefined"){
            $data = $data->where('sr.status', $request['status']);
        }
        if ($request['noresep']!="" && $request['noregistrasi']!="" && $request['ruid']!="" && $request['dpid']!=""
            && $request['noresep']!="" && $request['namapasien']!="" && $request['status']!=""){
        }
        if(isset($request['IdFarmasi']) && $request['IdFarmasi']!="" && $request['IdFarmasi']!="undefined"){
            $data = $data->where('sr.ruanganfk', $request['IdFarmasi']);
        }
//        if(isset($request['jenisobatfk']) && $request['jenisobatfk']!="" && $request['jenisobatfk']!="undefined"){
//            $data = $data->where('pp.jenisobatfk', $request['jenisobatfk']);
//        }
//        $data = $data->where('sr.statusenabled',t);
//        $data = $data->orwhere('sr.statusenabled',null);
        $data = $data->where(function($q) {
            $q->where('sr.statusenabled', true)
                ->orWhere('sr.statusenabled', null);
        });
        $data = $data->take($request['jmlRows']);
        $data = $data->orderby('sr.noresep','desc');
        $data = $data->get();
//        foreach ($data as $item){
//
//            $pelayananpasien = \DB::table('strukresep_t as sr')
//                ->JOIN('pelayananpasien_t as pp','pp.strukresepfk','=','sr.norec')
//                ->JOIN('jeniskemasan_m as jk','jk.id','=','pp.jeniskemasanfk')
//                ->select('sr.noresep','jk.id as jkid','jk.jeniskemasan')
//                ->where('sr.norec',$item->norec )
//                ->where('jk.id',1 )//racikan
//                ->first();
//            if(!empty($pelayananpasien)){
//                $item->jenis = 'Racikan';
//            }else{
//                $item->jenis = 'Non Racikan';
//            }
//        }
        $result = array(
            'daftar' => $data,
            'datalogin' => $dataLogin,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }
    public function getDaftarReturObat(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin = $request->all();
        $data = \DB::table('strukretur_t as srt')
            ->LEFTJOIN('strukresep_t as sr','sr.norec','=','srt.strukresepfk')
            ->LEFTJOIN('antrianpasiendiperiksa_t as apd','apd.norec','=','sr.pasienfk')
            ->LEFTJOIN('pasiendaftar_t as pd','pd.norec','=','apd.noregistrasifk')
            ->LEFTJOIN('pasien_m as ps','ps.id','=','pd.nocmfk')
            ->LEFTJOIN('pegawai_m as pg','pg.id','=','srt.objectpegawaifk')
            ->LEFTJOIN('ruangan_m as ru','ru.id','=','srt.objectruanganfk')
            ->LEFTJOIN('strukpelayanan_t as sp','sp.norec','=','srt.strukresepfk')
            ->select('srt.tglretur','srt.noretur','pd.noregistrasi','ps.nocm','ps.namapasien','pg.namalengkap',
                'ru.namaruangan','srt.norec','srt.keteranganlainnya','sp.nostruk_intern as nocm_sp','sp.namapasien_klien as namapasien_sp'
            )
            ->where('srt.kdprofile', $idProfile);

        if(isset($request['tglAwal']) && $request['tglAwal']!="" && $request['tglAwal']!="undefined"){
            $data = $data->where('srt.tglretur','>=', $request['tglAwal']);
        }
        if(isset($request['tglAkhir']) && $request['tglAkhir']!="" && $request['tglAkhir']!="undefined"){
            $tgl= $request['tglAkhir'];
            $data = $data->where('srt.tglretur','<=', $tgl);
        }
        if(isset($request['nostruk']) && $request['nostruk']!="" && $request['nostruk']!="undefined"){
            $data = $data->where('srt.noretur','ilike','%'. $request['nostruk']);
        }
//        if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
//            $data = $data->where('sp.nostruk_intern','like','%'. $request['nocm'].'%');
//        }
//        if(isset($request['namapasien']) && $request['namapasien']!="" && $request['namapasien']!="undefined"){
//            $data = $data->where('sp.namapasien_klien','like','%'. $request['namapasien'].'%');
//        }
        $data = $data->where('srt.statusenabled',true);
        $data = $data->orderBy('srt.noretur');
        $data = $data->get();
        $results = [];
        foreach ($data as $item){
            $details = DB::select(DB::raw("
                select spd.tglpelayanan, spd.rke,jkm.jeniskemasan,pr.namaproduk,
                ss.satuanstandar,spd.jumlah,spd.hargasatuan,spd.hargadiscount,
                spd.jasa,((spd.hargasatuan-spd.hargadiscount)*spd.jumlah)+spd.jasa as total from pelayananpasienretur_t as spd
                INNER JOIN produk_m as pr on pr.id=spd.produkfk
                INNER JOIN jeniskemasan_m as jkm on jkm.id=spd.jeniskemasanfk
                INNER JOIN satuanstandar_m as ss on ss.id=spd.satuanviewfk
                where spd.kdprofile = $idProfile and strukreturfk=:norec"),
                array(
                    'norec' => $item->norec,
                )
            );
            $namapasien = $item->namapasien;
            $nocm = $item->nocm;
            $noregistrasi = $item->noregistrasi;
            if( is_null($item->noregistrasi )){
                $namapasien =  $item->namapasien_sp;
                $nocm = $item->nocm_sp;
                $noregistrasi = '-';
            }

            $results[] = array(
                'tglretur' => $item->tglretur,
                'noretur' => $item->noretur,
                'noregistrasi' => $noregistrasi,
                'nocm' =>$nocm,
                'namapasien' => $namapasien,
                'namalengkap' => $item->namalengkap,
                'namaruangan' => $item->namaruangan,
                'norec' => $item->norec,
                'keteranganlainnya' => $item->keteranganlainnya,
//                'details' => $details,
            );
        }

        $result = array(
            'daftar' => $results,
            'datalogin' => $dataLogin,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }

    public function getDaftarPaketObatPasien(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin = $request->all();
        $dataRuangan = \DB::table('maploginusertoruangan_s as mlu')
            ->JOIN('ruangan_m as ru','ru.id','=','mlu.objectruanganfk')
            ->select('ru.id')
            ->where('mlu.kdprofile', $idProfile)
            ->where('mlu.objectloginuserfk',$dataLogin['userData']['id'])
            ->get();
        $strRuangan = [];
        foreach ($dataRuangan as $epic){
            $strRuangan[] = $epic->id;
        }
        $data = [];
        $data = \DB::table('strukkirim_t as sp')
            ->LEFTJOIN('pegawai_m as pg','pg.id','=','sp.objectpegawaipengirimfk')
            ->LEFTJOIN('ruangan_m as ru','ru.id','=','sp.objectruanganasalfk')
            ->LEFTJOIN('ruangan_m as ru2','ru2.id','=','sp.objectruangantujuanfk')
            ->LEFTJOIN('antrianpasiendiperiksa_t as apd','apd.norec','=','sp.noregistrasifk')
            ->LEFTJOIN('pasiendaftar_t as pd','pd.norec','=','apd.noregistrasifk')
            ->LEFTJOIN('pasien_m as ps','ps.id','=','pd.nocmfk')
            ->select('sp.norec','sp.tglkirim','sp.nokirim','sp.jenispermintaanfk','pg.namalengkap',
                'ru.namaruangan as ruanganasal','ru2.namaruangan as ruangantujuan','sp.keteranganlainnyakirim','ps.namapasien',
                'pd.noregistrasi','sp.noregistrasifk'
            )
            ->where('mlu.kdprofile', $idProfile);

        if(isset($request['tglAwal']) && $request['tglAwal']!="" && $request['tglAwal']!="undefined"){
            $data = $data->where('sp.tglkirim','>=', $request['tglAwal']);
        }
        if(isset($request['tglAkhir']) && $request['tglAkhir']!="" && $request['tglAkhir']!="undefined"){
            $tgl= $request['tglAkhir'];
            $data = $data->where('sp.tglkirim','<=', $tgl);
        }
        if(isset($request['nokirim']) && $request['nokirim']!="" && $request['nokirim']!="undefined"){
            $data = $data->where('sp.nokirim','ilike','%'. $request['nokirim']);
        }
        if(isset($request['ruangantujuanfk']) && $request['ruangantujuanfk']!="" && $request['ruangantujuanfk']!="undefined"){
            $data = $data->where('ru2.id','=', $request['ruangantujuanfk']);
        }
        if(isset($request['noregistrasi']) && $request['noregistrasi']!="" && $request['noregistrasi']!="undefined"){
            $data = $data->where('pd.noregistrasi','=', $request['noregistrasi']);
        }
        $data = $data->where('sp.statusenabled',true);
        $data = $data->where('sp.objectkelompoktransaksifk',34);
//        $data = $data->wherein('sp.objectruanganasalfk',$strRuangan);
        $data = $data->wherenotnull('sp.noregistrasifk');
        $data = $data->where('sp.noregistrasifk','<>','0');
        $data = $data->orderBy('sp.nokirim');
        $data = $data->get();

        $results =array();
        foreach ($data as $item){
            $details = DB::select(DB::raw("
                     select  pr.namaproduk,
                    ss.satuanstandar,spd.qtyproduk
                     from kirimproduk_t as spd 
                    left JOIN produk_m as pr on pr.id=spd.objectprodukfk
                    left JOIN satuanstandar_m as ss on ss.id=spd.objectsatuanstandarfk
                    where spd.kdprofile = $idProfile and nokirimfk=:norec and spd.qtyproduk <> 0"),
                array(
                    'norec' => $item->norec,
                )
            );
            $jeniskirim ='';
            if ($item->jenispermintaanfk == 1){
                $jeniskirim ='Amprahan';
            }
            if ($item->jenispermintaanfk == 2){
                $jeniskirim ='Transfer';
            }
            $results[] = array(
                'status' => 'Kirim Barang',
                'tglstruk' => $item->tglkirim,
                'nostruk' => $item->nokirim,
                'jeniskirim' => $jeniskirim,
                'norec' => $item->norec,
                'namaruanganasal' => $item->ruanganasal,
                'namaruangantujuan' => $item->ruangantujuan,
                'petugas' => $item->namalengkap,
                'keterangan' => $item->keteranganlainnyakirim,
                'namapasien' => $item->namapasien,
                'noregistrasi' => $item->noregistrasi,
                'norec_apd' => $item->noregistrasifk,
                'details' => $details,
            );
        }

        $result = array(
            'daftar' => $results,
            'datalogin' => $dataLogin,
            'message' => 'as@epic',
            'str' => $strRuangan,
        );

        return $this->respond($result);
    }

    public function getDaftarReturObatDetail(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $data = \DB::table('strukretur_t as srt')
            ->leftJoin('strukresep_t as sr','sr.norec','=','srt.strukresepfk')
            ->leftJoin('antrianpasiendiperiksa_t as apd','apd.norec','=','sr.pasienfk')
            ->leftJoin('strukpelayanan_t as sp','sp.norec','=','srt.strukresepfk')
            ->leftJoin('pasiendaftar_t as pd','pd.norec','=','apd.noregistrasifk')
            ->leftJoin('pelayananpasienretur_t as spd','spd.strukreturfk','=', 'srt.norec')
            ->join('produk_m as pr','pr.id','=','spd.produkfk')
            ->join('jeniskemasan_m as jkm','jkm.id','=','spd.jeniskemasanfk')
            ->join('satuanstandar_m as ss','ss.id','=','spd.satuanviewfk')
            ->leftJoin('pasien_m as ps','ps.id','=','pd.nocmfk')
            ->leftJoin('pegawai_m as pg','pg.id','=','srt.objectpegawaifk')
            ->leftJoin('ruangan_m as ru','ru.id','=','srt.objectruanganfk')
            ->leftJoin('ruangan_m as ru1','ru1.id','=','apd.objectruanganfk')
            ->select(DB::raw("srt.tglretur,srt.noretur,CASE WHEN pd.noregistrasi IS NULL THEN '-' ELSE pd.noregistrasi END AS noregistrasi,
                    CASE WHEN ps.nocm IS NULL THEN sp.nostruk_intern ELSE ps.nocm END AS nocm,
                    CASE WHEN ps.namapasien IS NULL THEN sp.namapasien_klien ELSE ps.namapasien END AS namapasien,
                    CASE WHEN ru1.namaruangan IS NULL THEN '-' ELSE ru1.namaruangan END as unitlayanan,
                    ps.namapasien,pg.namalengkap,ru.namaruangan AS depo,srt.norec,srt.keteranganlainnya,
                    spd.tglpelayanan, spd.rke,jkm.jeniskemasan,pr.namaproduk,ss.satuanstandar,spd.jumlah,spd.hargasatuan,
                    spd.hargadiscount,spd.jasa,((spd.hargasatuan-spd.hargadiscount)*spd.jumlah)+spd.jasa as total"))
            ->where('srt.kdprofile', $idProfile);

        if(isset($request['tglAwal']) && $request['tglAwal']!="" && $request['tglAwal']!="undefined"){
            $data = $data->where('srt.tglretur','>=', $request['tglAwal']);
        }

        if(isset($request['tglAkhir']) && $request['tglAkhir']!="" && $request['tglAkhir']!="undefined"){
            $tgl= $request['tglAkhir'];
            $data = $data->where('srt.tglretur','<=', $tgl);
        }

        if(isset($request['nostruk']) && $request['nostruk']!="" && $request['nostruk']!="undefined"){
            $data = $data->where('srt.noretur','ilike','%'. $request['nostruk']);
        }

        if(isset($request['idDepo']) && $request['idDepo']!="" && $request['idDepo']!="undefined"){
            $data = $data->where('ru.id','=', $request['idDepo']);
        }

        if(isset($request['idRuangLayanan']) && $request['idRuangLayanan']!="" && $request['idRuangLayanan']!="undefined"){
            $data = $data->where('ru1.id','=', $request['idRuangLayanan']);
        }

        $data = $data->where('srt.statusenabled',true);
        $data = $data->orderBy('srt.noretur');
        $data = $data->get();

        $result = array(
            'daftar' => $data,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }

    public function getDaftarOrderProduksiSteril(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $data = \DB::table('strukorder_t as so')
            ->JOIN('pasien_m as ps','ps.id','=','so.nocmfk')
            ->JOIN('jeniskelamin_m as jk','jk.id','=','ps.objectjeniskelaminfk')
            ->JOIN('ruangan_m as ru','ru.id','=','so.objectruanganfk')
            ->JOIN('ruangan_m as ru2','ru2.id','=','so.objectruangantujuanfk')
            ->leftJOIN('pegawai_m as pg','pg.id','=','so.objectpegawaiorderfk')
            ->JOIN('pasiendaftar_t as pd','pd.norec','=','so.noregistrasifk')
            ->JOIN('kelas_m as kl','kl.id','=','pd.objectkelasfk')
            ->leftJOIN('antrianpasiendiperiksa_t as apd', function($join){
                $join->on('apd.noregistrasifk','=','pd.norec')
                    ->on('apd.objectruanganfk', '=', 'so.objectruanganfk')
                    ->on('apd.objectpegawaifk', '=', 'so.objectpegawaiorderfk');
            })
            ->leftJOIN('kelompokpasien_m as kp','kp.id','=','pd.objectkelompokpasienlastfk')
            ->select('so.noorder','ps.nocm','ps.namapasien','jk.jeniskelamin','ru.namaruangan as namaruanganrawat',
                'so.tglorder','pg.namalengkap','ru2.namaruangan',
                'so.statusorder','so.namapengambilorder','so.noregistrasifk',
                'pd.noregistrasi','kp.kelompokpasien',
                'apd.norec as norec_apd',
                'pd.tglregistrasi','ps.tgllahir','kl.namakelas','kl.id as klid','so.tglambilorder')
            ->where('so.kdprofile', $idProfile);

        if(isset($request['tglAwal']) && $request['tglAwal']!="" && $request['tglAwal']!="undefined"){
            $data = $data->where('so.tglorder','>=', $request['tglAwal']);
        }
        if(isset($request['tglAkhir']) && $request['tglAkhir']!="" && $request['tglAkhir']!="undefined"){
            $tgl= $request['tglAkhir']." 23:59:59";
            $data = $data->where('so.tglorder','<=', $tgl);
        }
        if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('ps.nocm','ilike','%'. $request['nocm'].'%');
        }
        if(isset($request['norec_apd']) && $request['norec_apd']!="" && $request['norec_apd']!="undefined"){
            $data = $data->where('apd.norec', $request['norec_apd']);
        }
        $data = $data->where('so.keteranganorder','=', 'Order Produksi Steril');
        $data = $data->where('so.objectkelompoktransaksifk', 4);
        $data = $data->get();
        $status ='';

        $result=[];
        foreach ($data as $item){
            if ($item->statusorder == 0){$status='Menunggu';};
            if ($item->statusorder == 5){$status='Verifikasi';};
            if ($item->statusorder == 1){$status='Produksi';};
            if ($item->statusorder == 2){$status='Packaging';};
            if ($item->statusorder == 3){$status='Selesai';};
            if ($item->statusorder == 4){$status='Penyerahan Obat';};
            if ($item->tglambilorder != null){$status='Sudah Di Ambil';};
            $result[] = array(
                'noregistrasi' => $item->noregistrasi,
                'norec' => $item->noregistrasifk,
                'tglregistrasi' => $item->tglregistrasi,
                'norec_apd' => $item->norec_apd,
                'noorder' => $item->noorder,
                'nocm' => $item->nocm,
                'namapasien' => $item->namapasien,
                'jeniskelamin' => $item->jeniskelamin,
                'namaruanganrawat' => $item->namaruanganrawat,
                'tglorder' => $item->tglorder,
                'namalengkap' => $item->namalengkap,
                'kelompokpasien' => $item->kelompokpasien,
                'namaruangan' => $item->namaruangan,
                'statusorder' => $status,
                'namapengambilorder' => $item->namapengambilorder,
                'tgllahir' => $item->tgllahir,
                'klid' => $item->klid,
                'namakelas' => $item->namakelas,
            );
        }

        return $this->respond($result);
    }

    public function getTransaksiPelayananApotik(Request $request) {
        ini_set('memory_limit', '1024M');
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $detail=$request->all();
        $result=[];
        $data = \DB::table('pelayananpasien_t as pp')
            ->JOIN('antrianpasiendiperiksa_t as apd','apd.norec','=','pp.noregistrasifk')
            ->JOIN('pasiendaftar_t as pd','pd.norec','=','apd.noregistrasifk')
            ->JOIN('pasien_m as ps','ps.id','=','pd.nocmfk')
            ->JOIN('jeniskelamin_m as jk','jk.id','=','ps.objectjeniskelaminfk')
            ->JOIN('produk_m as pr','pr.id','=','pp.produkfk')
            ->JOIN('ruangan_m as ru','ru.id','=','apd.objectruanganfk') /* ruangan pasien*/ 
            ->JOIN('jeniskemasan_m as jkm','jkm.id','=','pp.jeniskemasanfk')
            ->leftJoin('jenisracikan_m as jra','jra.id','=','pp.jenisobatfk')
            ->leftJoin('satuanstandar_m as ss','ss.id','=','pp.satuanviewfk')
            ->leftJoin('satuanstandar_m as ss2','ss2.id','=','pr.objectsatuanstandarfk')
            ->JOIN('detailjenisproduk_m as djp','djp.id','=','pr.objectdetailjenisprodukfk')
            ->JOIN('jenisproduk_m as jp','jp.id','=','djp.objectjenisprodukfk')
            ->leftJOIN('strukpelayanan_t as sp','sp.norec','=','pp.strukfk')
            ->leftJOIN('konversisatuan_t as ks', function($join){
                $join->on('ks.objekprodukfk', '=', 'pr.id')
                    ->on('ks.satuanstandar_tujuan', '=', 'pp.satuanviewfk');
            })
            ->leftJOIN('strukresep_t as sr','sr.norec','=','pp.strukresepfk')
            ->leftJOIN('ruangan_m as ru2','ru2.id','=','sr.ruanganfk') /* ruangan depo*/ 
            ->leftJOIN('pegawai_m as dok','dok.id','=','sr.penulisresepfk')
            ->leftJOIN('rm_sediaan_m AS rs','rs.id','=','pr.objectsediaanfk')
            ->leftJoin('satuanresep_m as sn','sn.id','=','pp.satuanresepfk')
            ->select('ps.nocm','ps.namapasien','jk.jeniskelamin','pp.tglpelayanan','pp.produkfk','pr.namaproduk',
                'ss.satuanstandar','pp.jumlah','pp.hargasatuan','pp.hargadiscount','sp.nostruk','pd.noregistrasi',
                'ks.nilaikonversi','ss2.satuanstandar as satuanstandar2','sr.noresep','sr.norec as norec_resep','pp.rke',
                'jkm.jeniskemasan','jk.id as jkid','pp.jenisobatfk','jra.jenisracikan','pp.jasa','ru2.id as namaruanganasalid','ru2.id as ruangandepoid','ru2.namaruangan as ruangandepo',
                'pp.aturanpakai','ru.namaruangan','dok.id as dokterid','dok.namalengkap as dokter','pp.ispagi','pp.issiang','pp.ismalam','pp.issore','pp.iskronis','sr.isreseppulang as reseppulang',
                DB::raw("CASE WHEN pr.kekuatan IS NOT NULL AND rs.name IS NOT NULL THEN pr.kekuatan || ' ' || rs.name ELSE '' END AS kekuatan,
                               sn.satuanresep,pp.satuanresepfk,pp.tglkadaluarsa,pp.dosis,djp.detailjenisproduk,jp.jenisproduk,apd.norec norec_apd,pd.norec norec_pd,apd.objectkelasfk klid,pp.keteranganpakai"))
            ->where('pp.kdprofile', $idProfile)
            ->where('jp.id',97)
            ->where('sr.statusenabled', true)
            ->where('pd.statusenabled', true)
            ->orderBy('pp.tglpelayanan','pp.rke');
        if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('ps.nocm','=', $request['nocm']);
        }
        // if(isset($request['noregistrasifk']) && $request['noregistrasifk']!="" && $request['noregistrasifk']!="undefined"){
        //     $data = $data->where('pp.noregistrasifk','=', $request['noregistrasifk']);
        // }
        if(isset($request['noReg']) && $request['noReg']!="" && $request['noReg']!="undefined"){
            $data = $data->where('pd.noregistrasi','=', $request['noReg']);
        }
        if(isset($request['norec_resep']) && $request['norec_resep']!="" && $request['norec_resep']!="undefined"){
            $data = $data->where('sr.norec','=', $request['norec_resep']);
        }
        if(isset($request['tglAwal']) && $request['tglAwal']!="" && $request['tglAwal']!="undefined"){
            $data = $data->where('pp.tglpelayanan','>=', $request['tglAwal']);
        }
        if(isset($request['tglAkhir']) && $request['tglAkhir']!="" && $request['tglAkhir']!="undefined"){
            $tgl= $request['tglAkhir'];
            $data = $data->where('pp.tglpelayanan','<=', $tgl);
        }
        if(isset($request['dokter']) && $request['dokter']!="" && $request['dokter']!="undefined"){
            $data = $data->where('dok.id','=', $request['dokter']);
        }
        if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
            $data = $data->where('ru.id','=', $request['ruangan']);
        }
        if (isset($request['nik']) && $request['nik'] != '') {
            $data = $data->where('ps.noidentitas', $request['nik']);
        }
        $data = $data->get();

        $rke=0;
        foreach ($data as $item){
            if (isset($item->nilaikonversi)){
                $nKonversi = $item->nilaikonversi;
            }else{
                $nKonversi=1;
            }
            if (isset($item->satuanstandar)){
                $ss = $item->satuanstandar;
            }else{
                $ss = $item->satuanstandar2;
            }
            $JenisKemasan=$item->jeniskemasan;
            if(isset($item->jenisracikan)){
                $JenisKemasan=$item->jeniskemasan .'/'. $item->jenisracikan;
            }
//            $tarifjasa =0;
//            $qty20 =0;
//            if ($item->jkid == 2){
//                $tarifjasa = 800;
//            }
////            $rke = 0;
//            if ($item->rke != $rke) {
//                if ($item->jkid == 1) {
//                    $rke=$item->rke;
//                    $qty20 = number_format($item->jumlah / 20, 0);
//                    if ($item->jumlah % 20 == 0) {
//                        $qty20 = $qty20;
//                    } else {
//                        $qty20 = $qty20 + 1;
//                    }
//
//                    $tarifjasa = 800 * $qty20;
//                }
//            }
            $jasa=0;
            if(isset($item->jasa) && $item->jasa!="" && $item->jasa!="undefined"){
                $jasa=$item->jasa;
            }

            $result[]=array(
                'nocm' => $item->nocm,
                'namapasien' => $item->namapasien,
                'jeniskelamin' => $item->jeniskelamin,
                'tglpelayanan' => $item->tglpelayanan,
                'produkfk' => $item->produkfk,
                'namaproduk' => $item->namaproduk,
                'satuanstandar' => $ss,
                'jumlah' => (float)$item->jumlah / (float)$nKonversi,
                'hargasatuan' => $item->hargasatuan,
                'hargadiscount' => $item->hargadiscount,
                'nostruk' => $item->nostruk,
                'noregistrasi' => $item->noregistrasi,
                'noresep' => $item->noresep,// .'/'.$item->noregistrasi,
                'rke' => $item->rke,
                'jeniskemasan' => $JenisKemasan,
                'norec_resep' =>  $item->norec_resep,
                'norec_apd' =>  $item->norec_apd,
                'detail' => $detail,
                'jasa' =>$jasa,
                'ruangandepoid' => $item->ruangandepoid,
                'namaruangandepo' => $item->ruangandepo,
                'aturanpakai' => $item->aturanpakai,
                'dokter' => $item->dokter,
                'dokterid' => $item->dokterid,
                'pemberiresep' => $item->dokter,
                'namaruanganasalid' => $item->namaruanganasalid,
                'namaruangan' => $item->namaruangan,
                'kekuatan' => $item->kekuatan,
                'ispagi' => $item->ispagi,
                'issiang' => $item->issiang,
                'ismalam' => $item->ismalam,
                'issore' => $item->issore,
                'iskronis' => $item->iskronis,
                'satuanresepfk' => $item->satuanresepfk,
                'satuanresep' => $item->satuanresep,
                'tglkadaluarsa' => $item->tglkadaluarsa,
                'dosis' => $item->dosis,
                'detailjenisproduk' => $item->detailjenisproduk,
                'jenisproduk' => $item->jenisproduk,
                'reseppulang' =>$item->reseppulang,
                'norec_pd' => $item->norec_pd,
                'klid' => $item->klid,
                'keteranganpakai' => $item->keteranganpakai,
                
            );
        }
        return $this->respond($result);
    }
}