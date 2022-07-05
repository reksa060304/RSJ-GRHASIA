<?php
/**
 * Created by PhpStorm.
 * User: Egie Ramdan
 * Date: 11/16/2019
 * Time: 3:05 PM
 */

namespace App\Http\Controllers\Perencanaan;

use App\Http\Controllers\ApiController;
use App\Master\KelompokAnggaranHead;
use App\Master\KelompokAnggaranKedua;
use App\Master\KelompokAnggaranKeempat;
use App\Master\KelompokAnggaranKetiga;
use App\Master\KelompokAnggaranPertama;
use App\Master\KelompokAnggaranKelima;
use App\Master\KelompokAnggaranKeenam;
use App\Transaksi\AntrianPasienDiperiksa;
use App\Transaksi\MataAnggaran;
use App\Transaksi\PasienDaftar;
use App\Transaksi\PelayananPasien;
use App\Transaksi\PelayananPasienDetail;
use App\Transaksi\PelayananPasienPetugas;
use App\Transaksi\RiwayatRealisasi;
use App\Transaksi\StrukRealisasi;
use App\Transaksi\StrukVerifikasi;
use App\Transaksi\StrukVerifikasiAnggaran;
use App\Transaksi\Panjar;
use Illuminate\Http\Request;
use DB;

use App\Transaksi\StrukOrder;
use App\Transaksi\OrderPelayanan;
use App\Transaksi\OrderProduk;
use App\Master\Pegawai;
use App\Traits\Valet;
use App\Transaksi\AlokasiKeteranganBelanja;
use App\Transaksi\KegiatanAnggaran;
use App\Transaksi\SettingAnggaran;
use App\Transaksi\KegiatanBelanja;
use App\Transaksi\KeteranganBelanja;
use App\Transaksi\RealisasiDetail;
use App\Transaksi\SPP;
use App\Transaksi\SPD;
use App\Transaksi\SPM;
use phpDocumentor\Reflection\Types\Null_;
use phpDocumentor\Reflection\Types\Parent_;
use Webpatser\Uuid\Uuid;

class PerencanaanController extends ApiController {
    use Valet;
    public function __construct(){
        parent::__construct($skip_authentication=false);
    }


    public function getPokRKAKL(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin = $request->all();
        $data= \DB::table('mataanggaran_t as rk')
            ->JOIN ('kelompokanggaranhead_m as k0','k0.id','=','rk.objectheadfk')
            ->JOIN ('kelompokanggaranpertama_m as k1','k1.id','=','rk.objectchildpertamafk')
            ->JOIN ('kelompokanggarankedua_m as k2','k2.id','=','rk.objectchildkeduafk')
            ->JOIN ('kelompokanggaranketiga_m as k3','k3.id','=','rk.objectchildketigafk')
            ->JOIN ('kelompokanggarankeempat_m as k4','k4.id','=','rk.objectchildkeempatfk')
            ->select( 'rk.norec','k0.kdkelompokhead','k0.id as id0','k0.kelompokhead','k1.id as id1','k1.childpertama',
                'k2.id as id2','k2.childkedua','k3.id as id3','k3.childketiga',
                'k4.id as id4','k4.childkeempat','rk.mataanggaran','rk.saldoawalblu','rk.saldoawalrm',
                'k1.kdchildpertama','k2.kdchildkedua','k3.kdchildketiga','k4.kdchildkeempat',
                'rk.tahun','rk.tglanggaran','rk.revisidivake')
            ->where('rk.kdprofile', $idProfile);

        $saldoBlu = $data->sum('rk.saldoawalblu');
        $saldoRm = $data->sum('rk.saldoawalrm');

        $filter = $request->all();
//        if(isset($filter['tglAwal']) && $filter['tglAwal']!="" && $filter['tglAwal']!="undefined"){
//            $data = $data->where('rk.tglanggaran','>=', $filter['tglAwal']);
//        }
//        if(isset($filter['tglAkhir']) && $filter['tglAkhir']!="" && $filter['tglAkhir']!="undefined"){
//            $tgl= $filter['tglAkhir'];//." 23:59:59";
//            $data = $data->where('rk.tglanggaran','<=', $tgl);
//        }
        if(isset($filter['tahun']) && $filter['tahun']!="" && $filter['tahun']!="undefined"){
            $data = $data->where('rk.tahun','=', $filter['tahun']);
        }
        if(isset($filter['revisike']) && $filter['revisike']!="" && $filter['revisike']!="undefined"){
            $data = $data->where('rk.revisidivake','=', $filter['revisike']);
        }

        if(isset($filter['childPertama']) && $filter['childPertama']!="" && $filter['childPertama']!="undefined"){
            $data = $data->where('k1.id','=', $filter['childPertama']);
        }
        if(isset($filter['childKedua']) && $filter['childKedua']!="" && $filter['childKedua']!="undefined"){
            $data = $data->where('k2.id','=', $filter['childKedua']);
        }
        if(isset($filter['childKetiga']) && $filter['childKetiga']!="" && $filter['childKetiga']!="undefined"){
            $data = $data->where('k3.id','=', $filter['childKetiga']);
        }
        if(isset($filter['childKeempat']) && $filter['childKeempat']!="" && $filter['childKeempat']!="undefined"){
            $data = $data->where('k4.id','=', $filter['childKeempat']);
        }
        if(isset($filter['childMataAnggaran']) && $filter['childMataAnggaran']!="" && $filter['childMataAnggaran']!="undefined"){
            $data = $data->where('rk.mataanggaran','ilike', '%'.$filter['childMataAnggaran'].'%');
        }

        $data=$data->take(20);
        $data=$data->get();

        $i0=0;
        $s0=0;
        $s1=0;
        $s2=0;
        $a0=[];
        $a1=[];
        $a2=[];
        $a3=[];
        $a4=[];
        $a5=[];
        $t0=0.0;
//        ini_set('max_execution_time', 1000); //6 minutes
        foreach ($data as $item){
            $s0=0;
            $i0=0;
            foreach ($a0 as $a){
                if ($item->id0 == $a0[$i0]['id0']){
                    $s0=1;
                    $a0[$i0]['totalblu'] = $a0[$i0]['totalblu'] + $item->saldoawalblu;
                    $a0[$i0]['totalrm'] = $a0[$i0]['totalrm'] + $item->saldoawalrm;
                }
                $i0 = $i0 + 1;
            }

            foreach ($data as $item1){
                $s1=0;
                $i1=0;
                if ($item1->id0 == $item->id0){
                    foreach ($a1 as $aa){
                        if ( $item1->id1 ==  $a1[$i1]['id1'] ){
                            $s1=1;

                            $a1[$i1]['totalblu'] = $a1[$i1]['totalblu'] + $item1->saldoawalblu;
                            $a1[$i1]['totalrm'] = $a1[$i1]['totalrm'] + $item1->saldoawalrm;
                        }
                        $i1 = $i1 + 1;
                    }
                    foreach ($data as $item2){
                        $s2=0;
                        $i2=0;
                        if ($item1->id0 == $item2->id0 and $item1->id1 == $item2->id1){
                            foreach ($a2 as $aaa){
                                if ($item2->id2 == $a2[$i2]['id2'] ){
                                    $s2=1;
                                    $a2[$i2]['totalblu'] = $a2[$i2]['totalblu'] + $item2->saldoawalblu;
                                    $a2[$i2]['totalrm'] = $a2[$i2]['totalrm'] + $item2->saldoawalrm;
                                }
                                $i2 = $i2 + 1;
                            }
                            foreach ($data as $item3){
                                $s3=0;
                                $i3=0;
                                if ($item3->id0 == $item2->id0 and $item3->id1 == $item2->id1 and  $item3->id2 == $item2->id2){
                                    foreach ($a3 as $aaaa){
                                        if ($item3->id3 == $a3[$i3]['id3']){//$aaaa['id3']   ){
                                            $s3=1;
                                            $a3[$i3]['totalblu'] = $a3[$i3]['totalblu'] + $item3->saldoawalblu;
                                            $a3[$i3]['totalrm'] = $a3[$i3]['totalrm'] + $item3->saldoawalrm;
                                        }
                                        $i3 = $i3 + 1;
                                    }
                                    foreach ($data as $item4){
                                        $s4=0;
                                        $i4=0;
                                        if ($item4->id3 == $item3->id3 and $item4->id0 == $item3->id0 and $item4->id1 == $item4->id1 and  $item4->id2 == $item3->id2){
                                            foreach ($a4 as $aaaaa){
                                                if ($item4->id4 == $a4[$i4]['id4']){
                                                    $s4=1;
                                                    $a4[$i4]['totalblu'] = $a4[$i4]['totalblu'] + $item4->saldoawalblu;
                                                    $a4[$i4]['totalrm'] = $a4[$i4]['totalrm'] + $item4->saldoawalrm;
                                                }
                                                $i4 = $i4 + 1;
                                            }
                                            foreach ($data as $item5){
                                                if ($item5->id4 == $item4->id4 and $item4->id3 == $item5->id3
                                                    and $item4->id0 == $item5->id0 and $item4->id1 == $item5->id1
                                                    and  $item4->id2 == $item5->id2){
                                                    $a5[]= array(
//                                                            'id' => $item5->norec,
//                                                            'id0' => $item5->id0,
//                                                            'kelompokhead' => $item5->kelompokhead,
//                                                            'id1' => $item5->id1,
//                                                            'childpertama' => $item5->childpertama,
//                                                            'id2' => $item5->id2,
//                                                            'childkedua' => $item5->childkedua,
//                                                            'id3' => $item5->id3,
//                                                            'childketiga' => $item5->childketiga,
//                                                            'id4' => $item5->id4,
                                                        'norec' => $item5->norec,
                                                        'mataanggaran' => $item5->mataanggaran,
                                                        'totalblu' => $item5->saldoawalblu,
                                                        'totalrm' => $item5->saldoawalrm,
                                                    );
                                                }
                                            }
                                            if ($s4 == 0 ){
                                                $a4[]= array(
//                                                    'id' => $item4->norec,
//                                                    'id0' => $item4->id0,
//                                                    'kelompokhead' => $item4->kelompokhead,
//                                                    'id1' => $item4->id1,
//                                                    'childpertama' => $item4->childpertama,
//                                                    'id2' => $item4->id2,
//                                                    'childkedua' => $item4->childkedua,
//                                                    'id3' => $item4->id3,
//                                                    'childketiga' => $item4->childketiga,
                                                    'id4' => $item4->id4,
                                                    'kode' => $item4->kdchildkeempat,
                                                    'mataanggaran' => $item4->childkeempat,
                                                    'totalblu' => $item4->saldoawalblu,
                                                    'totalrm' => $item4->saldoawalrm,
                                                    'child' => $a5,
//                                                    'expanded' =>true,
                                                );
                                            }
                                        }
                                        $a5=[];
                                    }
                                    if ($s3 == 0 ){
                                        $a3[]= array(
//                                            'id' => $item3->norec,
//                                            'id0' => $item3->id0,
//                                            'kelompokhead' => $item3->kelompokhead,
//                                            'id1' => $item3->id1,
//                                            'childpertama' => $item3->childpertama,
//                                            'id2' => $item3->id2,
//                                            'childkedua' => $item3->childkedua,
                                            'id3' => $item3->id3,
//                                            'childketiga' => $item3->childketiga,
                                            'kode' => $item3->kdchildketiga,
                                            'mataanggaran' => $item3->childketiga,
                                            'totalblu' => $item3->saldoawalblu,
                                            'totalrm' => $item3->saldoawalrm,
                                            'child' => $a4,
//                                            'expanded' =>true,
                                        );
                                    }
                                }
                                $a4=[];
                            }
                            if ($s2 == 0 ){
                                $a2[]= array(
//                                    'id' => $item2->norec,
//                                    'id0' => $item2->id0,
//                                    'kelompokhead' => $item2->kelompokhead,
//                                    'id1' => $item2->id1,
//                                    'childpertama' => $item2->childpertama,
                                    'id2' => $item2->id2,
//                                    'childkedua' => $item2->childkedua,
                                    'kode' => $item2->kdchildkedua,
                                    'mataanggaran' => $item2->childkedua,
                                    'totalblu' => $item2->saldoawalblu,
                                    'totalrm' => $item2->saldoawalrm,
                                    'child' => $a3,
//                                    'expanded' =>true,
                                );
                            }
                            $a3=[];
                        }
                    }
                    if ($s1 == 0){
                        $a1[]= array(
//                            'id' => $item1->norec,
//                            'id0' => $item1->id0,
//                            'kelompokhead' => $item1->kelompokhead,
                            'id1' => $item1->id1,
//                            'childpertama' => $item1->childpertama,
                            'kode' => $item1->kdchildpertama,
                            'mataanggaran' =>$item1->childpertama,
                            'totalblu' => $item1->saldoawalblu,
                            'totalrm' => $item1->saldoawalrm,
                            'child' => $a2,
//                            'expanded' =>true,
                        );
                    }
                }
                $a2=[];
            }
            if ($s0 == 0){
                $a0[]= array(
//                    'id' => $item->norec,
                    'id0' => $item->id0,
                    'kode'=> $item->kdkelompokhead,
//                    'kelompokhead' => $item->kelompokhead,
                    'mataanggaran' => $item->kelompokhead,
                    'totalblu' => $item->saldoawalblu,
                    'totalrm' => $item->saldoawalrm,
                    'grandtotalblu' => $saldoBlu,
                    'grandtotalrm' => $saldoRm,
                    'child' => $a1,
//                    'expanded' =>true,
                );
            }
            $a1 =[];
        }


        return $this->respond($a0);
    }

    public function saveChild(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
       try{
            if ($request['norec']==''){
                $MA = new MataAnggaran();
                $MA->norec = $MA->generateNewId();
                $MA->kdprofile = $idProfile;
                $MA->statusenabled = true;
                $MA->objectheadfk =  $request['objectheadfk'];

            }else{
                $MA= MataAnggaran::where('norec',$request['norec'])
                    ->where('kdprofile', $idProfile)
                    ->first();
            }
            $MA->objectchildpertamafk = $request['objectchildpertamafk'];
            $MA->objectchildkeduafk =  $request['objectchildkeduafk'];
            $MA->objectchildketigafk =  $request['objectchildketigafk'];
            $MA->objectchildkeempatfk =  $request['objectchildkeempatfk'];
            $MA->objectchildkelimafk =  $request['objectchildkelimafk'];
            $MA->objectchildkeenamfk =  $request['objectchildkeenamfk'];
            $MA->mataanggaran =  $request['mataanggaran'];
            $MA->revisidivake =  $request['revisidivake'];
            $MA->objectasalprodukfk =  $request['objectasalprodukfk'];
            $MA->saldoawalblu =  $request['saldoawalblu'];
            $MA->saldoawalrm =  $request['saldoawalrm'];
            $MA->tglanggaran = date('Y-m-d H:i:s');
            $MA->tahun =  $request['tahun'];
            $MA->kode =   $request['objectchildpertamafk'].$request['objectchildkeduafk'].$request['objectchildketigafk'].$request['objectchildkeempatfk'].$request['objectchildkelimafk'].$request['objectchildkeenamfk'];
            $MA->objectpengendalifk = $request['pengendali'];

            $MA->save();
           $transStatus = 'true';
       } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan Mata Anggaran";
       }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Mata Anggaran Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $MA,
                'as' => 'ramdanegie',
            );
        } else {
            $transMessage = "Simpan Mata Anggaran Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'result' => $MA,
                'as' => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
//        return $this->respond($requestAll);
    }
    public function getDataCombo(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin = $request->all();
        $tahunanggaran = $request['tahun'];
        $tahap = $request['tahap'];
        $subsubkegiatan = $request['subsubkegiatan'];
        $idsubsub = $request['idsubsub'];
        $idmataanggaran = $request['idmataanggaran'];
        $tahapaktif = $request['tahapaktif'];

        $kegiatan = \DB::table('kegiatananggaran_m as dp')
            ->join('kelompokanggaran_m as kp','kp.id','=','dp.div')
            ->select('dp.*','kp.namakelompok')
            ->where('dp.kdprofile', $idProfile)
            ->where('dp.statusenabled', true)
            ->orderBy('dp.kode')
            ->get();

        $kegiatansubsub = \DB::table('kegiatananggaran_m as dp')
            ->join('keteranganbelanja_t as ktb','ktb.objectkegiatanfk','=','dp.id')
            ->select('dp.id', 'dp.kode', 'dp.keterangan')
            ->where('dp.kdprofile', $idProfile)
            ->where('dp.statusenabled', true)
            ->where('dp.div', 4)
            ->where('ktb.objecttahapfk', $tahap)
            ->orderBy('dp.kode')
            ->groupBy('dp.id', 'dp.kode', 'dp.keterangan')
            ->get();
        
        $kegiatansubsubcombo = \DB::table('kegiatananggaran_m as dp')
            ->select('dp.id', 'dp.kode', 'dp.keterangan')
            ->where('dp.kdprofile', $idProfile)
            ->where('dp.statusenabled', true)
            ->where('dp.div', 4)
            ->where('dp.kode', 'ilike', '%'.$subsubkegiatan.'%')
            ->orderBy('dp.kode')
            ->get();

        $kegiatancombo = \DB::table('kegiatananggaran_m as dp')
            ->select('dp.id', 'dp.kode', 'dp.keterangan')
            ->where('dp.kdprofile', $idProfile)
            ->where('dp.statusenabled', true)
            ->where('dp.div', 3)
            ->orderBy('dp.kode')
            ->get();

        $carabayarcombo = \DB::table('carabayarspj_m as cbs')
            ->select('cbs.id', 'cbs.carabayar')
            ->where('cbs.kdprofile', $idProfile)
            ->where('cbs.statusenabled', true)
            ->get();

        $mataanggarancombo = \DB::table('mataanggaran_m as cbs')
            ->select('cbs.id', 'cbs.kodemataanggaran', 'cbs.namamataanggaran')
            ->where('cbs.kdprofile', $idProfile)
            ->where('cbs.statusenabled', true)
            ->get();

        $setting = \DB::table('settinganggaran_t as st')
            ->join('pegawai_m as pg','pg.id','=','st.objectkepalabludfk')
            ->join('tahapanggaran_m as ta','ta.id','=','st.objecttahapaktivfk')
            ->select('st.*','pg.namalengkap', 'ta.tahap', 'ta.id as idtahap', 'pg.id as idpegawai')
            ->where('st.kdprofile', $idProfile)
            ->where('st.statusenabled', true)
            ->where('st.tahunanggaran', $tahunanggaran)
            ->orderBy('st.tahunanggaran')
            ->get();
        
        $direktur = \DB::table('pegawai_m as pg')
            ->select('pg.namalengkap', 'pg.id')
            ->where('pg.kdprofile', $idProfile)
            ->where('pg.statusenabled', true)
            ->where('pg.grade', 1)
            ->orderBy('pg.namalengkap')
            ->get();

        $tahap = \DB::table('tahapanggaran_m as th')
            ->select('th.tahap', 'th.id')
            ->where('th.kdprofile', $idProfile)
            ->where('th.statusenabled', true)
            ->orderBy('th.id')
            ->get();

        if(!empty($idsubsub)){
            $mataanggarancombo = DB::select(DB::raw("select ma.id, ma.kodemataanggaran, ma.namamataanggaran
            from keteranganbelanja_t kb
            INNER JOIN mataanggaran_m ma on ma.id=kb.objectmataanggaranfk
            INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
            where kb.kdprofile = 30 and kb.statusenabled = true
            and ka.id = $idsubsub
            group by ma.id, ma.kodemataanggaran, ma.namamataanggaran"));
        } else{
            $mataanggarancombo = [];
        }

        if(!empty($idmataanggaran) && !empty($tahapaktif)){
            $keteranganperubahan = \DB::table('keteranganbelanja_t as ktb')
            ->select('ktb.norec', 'ktb.keteranganbelanja')
            ->where('ktb.kdprofile', $idProfile)
            ->where('ktb.statusenabled', true)
            ->where('ktb.objectmataanggaranfk', $idmataanggaran)
            ->where('ktb.objecttahapfk', $tahapaktif)
            ->groupBy('ktb.norec', 'ktb.keteranganbelanja')
            ->get();
        } else{
            $keteranganperubahan = [];
        }


        
        

        
        $mata = DB::select(DB::raw("
                select v.id, v.kodemataanggaran,v.namamataanggaran,cast(v.total as float) as total from (
                    select ma.id, ma.kodemataanggaran,ma.namamataanggaran,(x.total) as total  from mataanggaran_m ma 
                    left join
                    (select left(ma.kodemataanggaran,9) as kode,sum(kt.subtotal) as total 
                    from mataanggaran_m ma
                    left JOIN keteranganbelanja_t kt on kt.objectmataanggaranfk=ma.id
                    group by left(ma.kodemataanggaran,9)) as x on x.kode=ma.kodemataanggaran
                    where length(ma.kodemataanggaran)=9
                    union all
                    select ma.id, ma.kodemataanggaran,ma.namamataanggaran,(x.total) as total  from mataanggaran_m ma 
                    left join
                    (select left(ma.kodemataanggaran,5) as kode,sum(kt.subtotal) as total 
                    from mataanggaran_m ma
                    left JOIN keteranganbelanja_t kt on kt.objectmataanggaranfk=ma.id
                    group by left(ma.kodemataanggaran,5)) as x on x.kode=ma.kodemataanggaran
                    where length(ma.kodemataanggaran)=5
                    union all
                    select ma.id, ma.kodemataanggaran,ma.namamataanggaran,(x.total) as total  from mataanggaran_m ma 
                    left join
                    (select left(ma.kodemataanggaran,3) as kode,sum(kt.subtotal) as total 
                    from mataanggaran_m ma
                    left JOIN keteranganbelanja_t kt on kt.objectmataanggaranfk=ma.id
                    group by left(ma.kodemataanggaran,3)) as x on x.kode=ma.kodemataanggaran
                    where length(ma.kodemataanggaran)=3
                    union all
                    select ma.id, ma.kodemataanggaran,ma.namamataanggaran,(x.total) as total  from mataanggaran_m ma 
                    left join
                    (select left(ma.kodemataanggaran,1) as kode,sum(kt.subtotal) as total 
                    from mataanggaran_m ma
                    left JOIN keteranganbelanja_t kt on kt.objectmataanggaranfk=ma.id
                    group by left(ma.kodemataanggaran,1)) as x on x.kode=ma.kodemataanggaran
                    where length(ma.kodemataanggaran)=1
                    ) as v
                order by v.kodemataanggaran
            ")
        );

        
        $kelompok='keteranganAnggaran';
        $keterangan = \DB::table('settingdatafixed_m')
            ->select('namafield','nilaifield')
            ->where('kdprofile', $idProfile)
            ->where('statusenabled', 't')
            ->where('kelompok', '=',$kelompok)
            ->get();

        $jenisanggaran = \DB::table('jenisanggaran_m')
            ->select('jenisanggaran','id')
            ->where('kdprofile', $idProfile)
            ->where('statusenabled', 't')
            ->get();

        $jenisbelanja = \DB::table('jenisbelanja_m')
            ->select('jenisbelanja','id')
            ->where('kdprofile', $idProfile)
            ->where('statusenabled', 't')
            ->get();
        
        $panjar = DB::select(DB::raw("
            select norec, nopanjar, uraian, tglpanjar, jumlah, jenispanjar, coalesce(jumlahpengembalian, 0) jumlahpengembalian, sumberpanjar
            from panjar_t 
            where kdprofile = 30
            and statusenabled = true;
        "));

        $spp = DB::select(DB::raw("select spp.*, spd.nospd from spp_t spp inner join spd_t spd on spd.norec = spp.objectspdfk"));
        $spd = DB::select(DB::raw("select * from spd_t"));
        $carispd = DB::select(DB::raw("select spd.nospd, spd.tglspd, spd.nilaispd, spp.norec
        from spd_t spd
        left join spp_t spp on spd.norec = spp.objectspdfk 
        where spp.norec is null"));


        

    //     $Pengendali = \DB::table('pengendali_m as ru')
    //         ->select('ru.id','ru.pengendali')
    //         ->where('ru.kdprofile', $idProfile)
    //         ->where('ru.statusenabled', true)
    //         ->orderBy('ru.pengendali')
    //         ->get();


        $result = array(
            'kegiatan' => $kegiatan,
            'kegiatansubsub' => $kegiatansubsub,
            'kegiatansubsubcombo' => $kegiatansubsubcombo,
            'kegiatancombo' => $kegiatancombo,
            'mataanggarancombo' => $mataanggarancombo,
            'mataanggaran' => $mata,
            'keteranganperubahan' => $keteranganperubahan,
            'mataanggarancombo' => $mataanggarancombo,
            'jenisanggaran' => $jenisanggaran,
            'jenisbelanja' => $jenisbelanja,
            'keterangan' => $keterangan,
            'panjar' => $panjar,
            'setting' => $setting,
            'tahap' => $tahap,
            'direktur' => $direktur,
            'carabayarcombo' => $carabayarcombo,
            'spp' => $spp,
            'spd' => $spd,
            'carispd' => $carispd,
            // 'kelompokketiga' => $ketiga,
            // 'kelompokkeempat' => $keempat,
            // 'kelompokkelima' => $kelima,
            // 'kelompokkeenam' => $keenam,
            // 'rekanan' => $rekanan,
            'datalogin' => $dataLogin,
            'message' => 'epic',
        );

        return $this->respond($result);
    }
    public function getDataComboRekananPart(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $req = $request->all();
        $rekanan = \DB::table('rekanan_m as dp')
            ->select('dp.id','dp.namarekanan')
            ->where('dp.kdprofile', $idProfile)
            ->where('dp.statusenabled', true)
            ->where('dp.objectjenisrekananfk', 1)
            ->orderBy('dp.namarekanan');
        if (isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined") {
                $rekanan = $rekanan->where('namarekanan', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%');
        };
        $rekanan = $rekanan->take(10);
        $rekanan = $rekanan->get();

        return $this->respond($rekanan);
    }
    public function deleteChildAnggaran(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin = $request->all();
        DB::beginTransaction();
        try{
            if ($request['norec'] != ''){
                $data1 = MataAnggaran::where('norec', $request['norec'])->where('kdprofile', $idProfile)->delete();
                $transStatus = 'true';
            }
        }
        catch(\Exception $e){
            $transStatus= 'false';
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
    public function getKelAnggaranKeempat(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $req=$request->all();
        $keempat = \DB::table('kelompokanggarankeempat_m as ru')
            ->select('ru.id','ru.kdchildkeempat','ru.childkeempat')
            ->where('ru.statusenabled', true)
            ->where('ru.kdprofile', $idProfile)
            ->orderBy('ru.childkeempat');

        if(isset($req['childkeempat']) &&
            $req['childkeempat']!="" &&
            $req['childkeempat']!="undefined"){
            $keempat = $keempat->where('ru.childkeempat','ilike','%'. $req['childkeempat'] .'%');
        };

        if(isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value']!="" &&
            $req['filter']['filters'][0]['value']!="undefined"){
            $keempat = $keempat->where('ru.childkeempat','ilike','%'.$req['filter']['filters'][0]['value'].'%' );
        };

        $keempat = $keempat->take(20);
        $keempat = $keempat->get();

        foreach ($keempat as $item){
            $data[]=array(
                'id' => $item->id,
                'kdchildkeempat' => $item->kdchildkeempat,
                'childkeempat' =>$item->kdchildkeempat.' - '.$item->childkeempat,
            );
        }
        return $this->respond($data);
    }
    public function getChildByNorec(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin = $request->all();
        $data= \DB::table('mataanggaran_t as rk')
            ->JOIN ('kelompokanggaranhead_m as k0','k0.id','=','rk.objectheadfk')
            ->JOIN ('kelompokanggaranpertama_m as k1','k1.id','=','rk.objectchildpertamafk')
            ->JOIN ('kelompokanggarankedua_m as k2','k2.id','=','rk.objectchildkeduafk')
            ->JOIN ('kelompokanggaranketiga_m as k3','k3.id','=','rk.objectchildketigafk')
            ->JOIN ('kelompokanggarankeempat_m as k4','k4.id','=','rk.objectchildkeempatfk')
            ->select( 'rk.norec','k0.kdkelompokhead','k0.id as id0','k0.kelompokhead','k1.id as id1','k1.childpertama',
                'k2.id as id2','k2.childkedua','k3.id as id3','k3.childketiga',
                'k4.id as id4','k4.childkeempat','rk.mataanggaran','rk.saldoawalblu','rk.saldoawalrm',
                'k1.kdchildpertama','k2.kdchildkedua','k3.kdchildketiga','k4.kdchildkeempat',
                'rk.tahun','rk.tglanggaran','rk.revisidivake')
            ->where('rk.norec',$request['norec'])
            ->where('rk.kdprofile', $idProfile)
            ->get();


        $result = array(
            'data' => $data,
            'message' => 'ramdanegie',
        );

        return $this->respond($result);
    }

    public function getDaftarMataAnggaran(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin = $request->all();
        $Pengendali =  ' ';
        $tahun =  ' ';
        $revisiDiva =  ' ';

        if (isset($request['tahun']) && $request['tahun'] != "" && $request['tahun'] != "undefined") {
            $tahun =  ' where tahun =  ' . $request['tahun'];
        }

        if (isset($request['Pengendali']) && $request['Pengendali'] != "" && $request['Pengendali'] != "undefined") {
            $Pengendali =  ' and objectpengendalifk =  ' . $request['Pengendali'];
        }
      
        if (isset($request['revisike']) && $request['revisike'] != "" && $request['revisike'] != "undefined") {
            $revisiDiva =  ' and revisidivake =  ' . $request['revisike'];
        }

        $data = DB::select(DB::raw("select x.kode, x.kd,x.desk,x.totalblu,x.totalrm,x.tahun,x.revisidivake,x.objectpengendalifk from
                (
                        select left(mat.kode,1) + '00000000000000' as kode, ka.kdkelompokhead as kd, upper(ka.kelompokhead) as desk,
                        sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake,
                        mat.objectpengendalifk
                        from mataanggaran_t as mat
                        INNER JOIN kelompokanggaranhead_m as ka on ka.id =mat.objectheadfk
                        group by left(mat.kode,1),ka.kdkelompokhead,ka.kelompokhead,mat.tahun,mat.revisidivake,
                        mat.objectpengendalifk
                        --- *** ---
                        union all
                        --- *** ---
                        select left(mat.kode,1)+ '000000000000' as kode,'--' + ka.kdchildpertama as kd,upper(ka.childpertama) as desk,
                        sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake,mat.objectpengendalifk
                        from mataanggaran_t as mat
                        INNER JOIN kelompokanggaranpertama_m ka on ka.id =mat.objectchildpertamafk
                        group by left(mat.kode,1),ka.kdchildpertama,ka.childpertama,mat.tahun,mat.revisidivake,mat.objectpengendalifk
                    --- *** ---
                        union all
                        --- *** ---
                        select  left(mat.kode,1) + '0000000000'as kode,
                        case when ka.kodeexternal is not null and  ka.kdchildkedua is not NULL then '----' + ka.kodeexternal + ' || ' + ka.kdchildkedua 
                        when ka.kodeexternal is not null and  ka.kdchildkedua is NULL then '----' + ka.kodeexternal 
                        when ka.kodeexternal is  null and  ka.kdchildkedua is not NULL then '----' + ka.kdchildkedua end 
                        as kd,

                        case when ka.childkedua is not null and  ka.namaexternal is not NULL then  ka.childkedua  + ka.namaexternal 
                        when ka.childkedua is not null and  ka.namaexternal is NULL then  ka.childkedua
                        when ka.childkedua is  null and  ka.namaexternal is not NULL then  ka.namaexternal end 
                        as desk,
                
                        sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake,mat.objectpengendalifk
                        from mataanggaran_t as mat
                        INNER JOIN kelompokanggarankedua_m ka on ka.id =mat.objectchildkeduafk
                        group by left(mat.kode,1),ka.kdchildkedua,ka.childkedua,mat.tahun,mat.revisidivake,ka.kodeexternal,mat.objectpengendalifk,ka.namaexternal
                        --- *** ---
                        union all
                        --- *** ---
                            select  left(mat.kode,1) + '00000000'as kode,
                        case when ka.kodeexternal is not null and  ka.kdchildketiga is not NULL then '------' + ka.kodeexternal + ' || ' + ka.kdchildketiga 
                        when ka.kodeexternal is not null and  ka.kdchildketiga is NULL then '------' + ka.kodeexternal 
                        when ka.kodeexternal is  null and  ka.kdchildketiga is not NULL then '------' + ka.kdchildketiga end 
                        as kd,

                        case when ka.childketiga is not null and  ka.namaexternal is not NULL then  ka.childketiga  + ka.namaexternal 
                        when ka.childketiga is not null and  ka.namaexternal is NULL then  ka.childketiga
                        when ka.childketiga is  null and  ka.namaexternal is not NULL then  ka.namaexternal end 
                        as desk,
                        
                        sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake,mat.objectpengendalifk
                        from mataanggaran_t as mat
                        INNER JOIN kelompokanggaranketiga_m ka on ka.id =mat.objectchildketigafk
                        group by left(mat.kode,1),ka.kdchildketiga,ka.childketiga,mat.tahun,mat.revisidivake,ka.kodeexternal,mat.objectpengendalifk,ka.namaexternal

                    union all

                        select  left(mat.kode,1) + '000000'as kode,
                        case when ka.kodeexternal is not null and  ka.kdchildkeempat is not NULL then '----------' + ka.kodeexternal + ' || ' + ka.kdchildkeempat 
                        when ka.kodeexternal is not null and  ka.kdchildkeempat is NULL then '----------' + ka.kodeexternal 
                        when ka.kodeexternal is  null and  ka.kdchildkeempat is not NULL then '----------' + ka.kdchildkeempat end 
                        as kd,

                        case when ka.childkeempat is not null and  ka.namaexternal is not NULL then  ka.childkeempat  + ka.namaexternal 
                        when ka.childkeempat is not null and  ka.namaexternal is NULL then  ka.childkeempat
                        when ka.childkeempat is  null and  ka.namaexternal is not NULL then  ka.namaexternal end 
                        as desk,

                        sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake,mat.objectpengendalifk
                        from mataanggaran_t as mat
                        INNER JOIN kelompokanggarankeempat_m ka on ka.id =mat.objectchildkeempatfk
                        group by left(mat.kode,1),ka.kdchildkeempat,ka.childkeempat,mat.tahun,mat.revisidivake,ka.kodeexternal,mat.objectpengendalifk,ka.namaexternal
                        
                    union ALL

                        select  left(mat.kode,1) + '0000'as kode,
                    case when ka.kodeexternal is not null and  ka.kdchildkelima is not NULL then '------------' + ka.kodeexternal + ' || ' + ka.kdchildkelima 
                        when ka.kodeexternal is not null and  ka.kdchildkelima is NULL then '------------' + ka.kodeexternal 
                        when ka.kodeexternal is  null and  ka.kdchildkelima is not NULL then '------------' + ka.kdchildkelima end 
                        as kd,

                        case when ka.childkelima is not null and  ka.namaexternal is not NULL then  ka.childkelima  + ka.namaexternal 
                        when ka.childkelima is not null and  ka.namaexternal is NULL then  ka.childkelima
                        when ka.childkelima is  null and  ka.namaexternal is not NULL then  ka.namaexternal end 
                        as desk,
                                    --'--------' + ka.kodeexternal + ' || ' + ka.kdchildkelima as kd,ka.childkelima + ka.namaexternal as desk,
                        sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake,mat.objectpengendalifk
                        from mataanggaran_t as mat
                        INNER JOIN kelompokanggarankelima_m ka on ka.id =mat.objectchildkelimafk
                        group by left(mat.kode,1),ka.kdchildkelima,ka.childkelima,mat.tahun,mat.revisidivake,ka.kodeexternal,mat.objectpengendalifk,ka.namaexternal

                    union ALL

                            select  left(mat.kode,1) + '00'as kode,
                    case when ka.kodeexternal is not null and  ka.kdchildkeenam is not NULL then '--------------' + ka.kodeexternal + ' || ' + ka.kdchildkeenam 
                        when ka.kodeexternal is not null and  ka.kdchildkeenam is NULL then '--------------' + ka.kodeexternal 
                        when ka.kodeexternal is  null and  ka.kdchildkeenam is not NULL then '--------------' + ka.kdchildkeenam end 
                        as kd,

                        case when ka.childkeenam is not null and  ka.namaexternal is not NULL then  ka.childkeenam  + ka.namaexternal 
                        when ka.childkeenam is not null and  ka.namaexternal is NULL then  ka.childkeenam
                        when ka.childkeenam is  null and  ka.namaexternal is not NULL then  ka.namaexternal end 
                        as desk,
                --'----------' + ka.kodeexternal + ' || ' + ka.kdchildkeenam as kd,ka.childkeenam + ka.namaexternal as desk,
                        sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake,mat.objectpengendalifk
                        from mataanggaran_t as mat
                        INNER JOIN kelompokanggarankeenam_m ka on ka.id =mat.objectchildkeenamfk
                        group by left(mat.kode,1),ka.kdchildkeenam,ka.childkeenam,mat.tahun,mat.revisidivake,ka.kodeexternal,mat.objectpengendalifk,ka.namaexternal  
            union ALL
                    select left(mat.kode,9) + '~' + norec as kode,'---------------'  as kd,mat.mataanggaran as desk,
                sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake,mat.objectpengendalifk
                from mataanggaran_t as mat
                group by left(mat.kode,9) + '~' +  norec,mat.kode,mat.mataanggaran,mat.tahun,mat.revisidivake,mat.objectpengendalifk
                ) as x
                $tahun
                $revisiDiva
                $Pengendali      
            GROUP BY x.kode,x.kd,x.desk,x.totalblu,x.totalrm,x.tahun,x.revisidivake,x.objectpengendalifk
            order by x.kd asc;
        
        "));

        foreach ($data as $key => $row) {
            $count[$key] = $row->kd;
        }

//        if ($count[$key] != ''){
            array_multisort($count, SORT_DESC, $data);
//        }
        $result = array(
            'data' => $data,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function saveKelHead(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        DB::beginTransaction();
        try{
            if ($request['id']==''){
                $newId = KelompokAnggaranHead::max('id');
                $newId= $newId+1;
                $MA = new KelompokAnggaranHead();
                $MA->id = $newId;
                $MA->kdprofile = $idProfile;
                $MA->statusenabled = true;
            }else{
                $MA= KelompokAnggaranHead::where('id',$request['id'])
                    ->where('kdprofile', $idProfile)
                    ->first();
            }
            $MA->kdkelompokhead = $request['kdkelompokhead'];
            $MA->kelompokhead =  $request['kelompokhead'];
            $MA->kodeexternal =  $request['kodeexternal'];
            $MA->namaexternal =  $request['namaexternal'];

            $MA->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan Mata Anggaran";
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $MA,
                'as' => 'ramdanegie',
            );
        } else {
            $transMessage = "Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'result' => $MA,
                'as' => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveKelPertama(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        DB::beginTransaction();
        try{
            if ($request['id']==''){
                $newId = KelompokAnggaranPertama::max('id');
                $newId= $newId+1;
                $MA = new KelompokAnggaranPertama();
                $MA->id = $newId;
                $MA->kdprofile = $idProfile;
                $MA->statusenabled = true;
            }else{
                $MA= KelompokAnggaranPertama::where('id',$request['id'])
                    ->where('kdprofile', $idProfile)
                    ->first();
            }
            $MA->kdchildpertama = $request['kdchildpertama'];
            $MA->childpertama =  $request['childpertama'];
            $MA->kodeexternal =  $request['kodeexternal'];
            $MA->namaexternal =  $request['namaexternal'];

            $MA->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan Mata Anggaran";
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $MA,
                'as' => 'ramdanegie',
            );
        } else {
            $transMessage = "Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'result' => $MA,
                'as' => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveKelKedua(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        DB::beginTransaction();
        try{

            if ($request['id']==''){
                $newId = KelompokAnggaranKedua::max('id');
                $newId= $newId+1;
                $MA = new KelompokAnggaranKedua();
                $MA->id = $newId;
                $MA->kdprofile = $idProfile;
                $MA->statusenabled = true;
            }else{
                $MA= KelompokAnggaranKedua::where('id',$request['id'])
                    ->where('kdprofile', $idProfile)
                    ->first();
            }
            $MA->kdchildkedua = $request['kdchildkedua'];
            $MA->childkedua =  $request['childkedua'];
            $MA->kodeexternal =  $request['kodeexternal'];
            $MA->namaexternal =  $request['namaexternal'];

            $MA->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan Mata Anggaran";
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $MA,
                'as' => 'ramdanegie',
            );
        } else {
            $transMessage = "Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'result' => $MA,
                'as' => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveKelKetiga(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        DB::beginTransaction();
        try{
            if ($request['id']==''){
                $newId = KelompokAnggaranKetiga::max('id');
                $newId= $newId+1;
                $MA = new KelompokAnggaranKetiga();
                $MA->id = $newId;
                $MA->kdprofile = 0;
                $MA->statusenabled = true;
            }else{
                $MA= KelompokAnggaranKetiga::where('id',$request['id'])
                    ->where('kdprofile', $idProfile)
                    ->first();
            }
            $MA->kdchildketiga = $request['kdchildketiga'];
            $MA->childketiga =  $request['childketiga'];
            $MA->kodeexternal =  $request['kodeexternal'];
            $MA->namaexternal =  $request['namaexternal'];

            $MA->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan Mata Anggaran";
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $MA,
                'as' => 'ramdanegie',
            );
        } else {
            $transMessage = "Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'result' => $MA,
                'as' => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveKelKeempat(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        DB::beginTransaction();
        try{
            foreach ($request['data'] as $item){


            if ($item['id']==''){
                $newId = KelompokAnggaranKeempat::max('id');
                $newId= $newId+1;
                $MA = new KelompokAnggaranKeempat();
                $MA->id = $newId;
                $MA->kdprofile = $idProfile;
                $MA->statusenabled = true;
            }else{
                $MA= KelompokAnggaranKeempat::where('id',$item['id'])
                    ->where('kdprofile', $idProfile)
                    ->first();
            }
            $MA->kdchildkeempat = $item['kdchildkeempat'];
            $MA->childkeempat =  $item['childkeempat'];
            $MA->kodeexternal =  $item['kodeexternal'];
            $MA->namaexternal =  $item['namaexternal'];

            $MA->save();
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan Mata Anggaran";
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $MA,
                'as' => 'ramdanegie',
            );
        } else {
            $transMessage = "Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'result' => $MA,
                'as' => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function deleteKelompokHead(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin = $request->all();
        DB::beginTransaction();
        try{
            if ($request['id'] != ''){
                $data1 = KelompokAnggaranHead::where('id', $request['id'])->where('kdprofile', $idProfile)->delete();
                $transStatus = 'true';
            }
        }
        catch(\Exception $e){
            $transStatus= 'false';
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
    public function deleteKelompokPertama(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin = $request->all();
        DB::beginTransaction();
        try{
            if ($request['id'] != ''){
                $data1 = KelompokAnggaranPertama::where('id', $request['id'])->where('kdprofile', $idProfile)->delete();
                $transStatus = 'true';
            }
        }
        catch(\Exception $e){
            $transStatus= 'false';
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
    public function deleteKelompokKedua(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin = $request->all();
        DB::beginTransaction();
        try{
            if ($request['id'] != ''){
                $data1 = KelompokAnggaranKedua::where('id', $request['id'])->where('kdprofile', $idProfile)->delete();
                $transStatus = 'true';
            }
        }
        catch(\Exception $e){
            $transStatus= 'false';
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
    public function deleteKelompokKetiga(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin = $request->all();
        DB::beginTransaction();
        try{
            if ($request['id'] != ''){
                $data1 = KelompokAnggaranKetiga::where('id', $request['id'])->where('kdprofile', $idProfile)->delete();
                $transStatus = 'true';
            }
        }
        catch(\Exception $e){
            $transStatus= 'false';
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
    public function deleteKelompokKeempat(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin = $request->all();
        DB::beginTransaction();
        try{
            if ($request['id'] != ''){
                $data1 = KelompokAnggaranKeempat::where('id', $request['id'])->where('kdprofile', $idProfile)->delete();
                $transStatus = 'true';
            }
        }
        catch(\Exception $e){
            $transStatus= 'false';
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

    public function getDaftarMonitoringAnggaran(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin = $request->all();
        $data = DB::select(DB::raw("select x.kode,x.kd,x.descc,x.totalblu,x.totalrm,x.tahun,x.revisidivake,x.totalbelanja,((x.totalrm + x.totalblu)- x.totalbelanja) as sisabelanja from
                    (select kode,kd,descc,totalblu,totalrm,tahun,revisidivake,sum(totalbelanja)as totalbelanja from (
                    select left(mat.kode,1)|| '00000000' as kode, ka.kdkelompokhead as kd,upper(ka.kelompokhead) as descc,
                    sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm,mat.tahun as tahun,mat.revisidivake,
                    (case when sr.totalbelanja <> 0 then sum(sr.totalbelanja)
					 else 0 end)as totalbelanja
                    from mataanggaran_t as mat
                    INNER JOIN kelompokanggaranhead_m as ka on cast(ka.id as text)=left(mat.kode,1)
										LEFT JOIN strukrealisasi_t as sr on sr.objectmataanggaranfk = mat.norec
										 where mat.kdprofile = $idProfile
                    group by left(mat.kode,1),ka.kdkelompokhead,ka.kelompokhead,mat.tahun,mat.revisidivake,sr.totalbelanja
                    union all
                    select left(mat.kode,3)|| '000000' as kode,'---' || ka.kdchildpertama as kd,upper(ka.childpertama) as descc,
                    sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun ,mat.revisidivake,
                    (case when sr.totalbelanja <> 0 then sum(sr.totalbelanja)
					else 0 end)as totalbelanja
                    from mataanggaran_t as mat
                    INNER JOIN kelompokanggaranpertama_m ka on cast(ka.id as text)=substring(mat.kode,1,2)
										LEFT JOIN strukrealisasi_t as sr on sr.objectmataanggaranfk = mat.norec
										 where mat.kdprofile = $idProfile
                    group by left(mat.kode,3),ka.kdchildpertama,ka.childpertama,mat.tahun,mat.revisidivake,sr.totalbelanja
                    union all
                    select  left(mat.kode,5) || '0000'as kode,'------' || ka.kdchildkedua as kd,ka.childkedua as descc,
                    sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake,
                    (case when sr.totalbelanja <> 0 then sum(sr.totalbelanja)
					 else 0 end)as totalbelanja
                    from mataanggaran_t as mat
                    INNER JOIN kelompokanggarankedua_m ka on cast(ka.id as text)=substring(mat.kode,3,2)
										LEFT JOIN strukrealisasi_t as sr on sr.objectmataanggaranfk = mat.norec
										 where mat.kdprofile = $idProfile
                    group by left(mat.kode,5),ka.kdchildkedua,ka.childkedua,mat.tahun,mat.revisidivake,sr.totalbelanja
                    union all
                    select left(mat.kode,7) || '00'as kode,'---------' || ka.kdchildketiga as kd,ka.childketiga as descc,
                    sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm,mat.tahun as tahun,mat.revisidivake,
                    (case when sr.totalbelanja <> 0 then sum(sr.totalbelanja)
					 else 0 end)as totalbelanja
                    from mataanggaran_t as mat
                    INNER JOIN kelompokanggaranketiga_m as ka on cast(ka.id as text)=substring(mat.kode,5,2)
										LEFT JOIN strukrealisasi_t as sr on sr.objectmataanggaranfk = mat.norec
										 where mat.kdprofile = $idProfile
                    group by left(mat.kode,7),ka.kdchildketiga,ka.childketiga,mat.tahun,mat.revisidivake,sr.totalbelanja
                    union all
                    select  left(mat.kode,9) as kode,'------------' || ka.kdchildkeempat as kd,ka.childkeempat as descc,
                    sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm,mat.tahun as tahun,mat.revisidivake,
                    (case when sr.totalbelanja <> 0 then sum(sr.totalbelanja)
					 else 0 end)as totalbelanja
                    from mataanggaran_t as mat
                    INNER JOIN kelompokanggarankeempat_m as ka on cast(ka.id as text)=substring(mat.kode,7,3)
										LEFT JOIN strukrealisasi_t as sr on sr.objectmataanggaranfk = mat.norec
										 where mat.kdprofile = $idProfile
                    group by left(mat.kode,9),ka.kdchildkeempat,ka.childkeempat,mat.tahun,mat.revisidivake,sr.totalbelanja
                    union all
                    select left(mat.kode,9) || '~' || mat.norec as kode,'---------------'  as kd,mat.mataanggaran as descc,
                    sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake,
                    (case when sr.totalbelanja <> 0 then sum(sr.totalbelanja)
					 else 0 end)as totalbelanja
                    from mataanggaran_t as mat
										LEFT JOIN strukrealisasi_t as sr on sr.objectmataanggaranfk = mat.norec
										 where mat.kdprofile = $idProfile
                    group by left(mat.kode,9)|| '~' || mat.norec,mat.kode,mat.mataanggaran,mat.tahun,mat.revisidivake,sr.totalbelanja
                    ) as x WHERE tahun=:tahun 
                    and revisidivake=:revisidivake
                    group by kode,kd,descc,totalblu,totalrm,tahun,revisidivake
                    order by kode) as x"),
            array(
                'tahun' => $request['tahun'],
                'revisidivake' => $request['revisike'],
            )
        );

        $result = array(
            'data' => $data,
            'message' => 'ramdanegie',
        );

        return $this->respond($result);
    }

    public function getDaftarRiwayatRealisasi(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin = $request->all();
        $data = \DB::table('strukpelayanan_t as sp')
            ->LEFTJOIN('riwayatrealisasi_t as rr','rr.penerimaanfk','=','sp.norec')
            ->LEFTJOIN('strukrealisasi_t as sr','sr.norec','=','rr.objectstrukrealisasifk')
            ->LEFTJOIN('mataanggaran_t as ma','ma.norec','=','sr.objectmataanggaranfk')
            ->LEFTJOIN('strukbuktipengeluaran_t as sbk', 'sbk.norec', '=', 'sp.nosbklastfk')
            ->LEFTJOIN('rekanan_m as rkn', 'rkn.id', '=', 'sp.objectrekananfk')
            ->LEFTJOIN('pegawai_m as pg', 'pg.id', '=', 'sp.objectpegawaipenerimafk')
            ->LEFTJOIN('ruangan_m as ru', 'ru.id', '=', 'sp.objectruanganfk')
            ->select('sp.tglstruk', 'sp.nostruk', 'rkn.namarekanan', 'pg.namalengkap',
                'ru.namaruangan','sp.norec','sp.nofaktur','sp.tglfaktur','sp.totalharusdibayar','sbk.nosbk',
                'ma.mataanggaran','sr.totalbelanja','sp.keteranganlainnya'
            )
            ->where('sp.kdprofile', $idProfile);
        if (isset($request['tahun']) && $request['tahun'] != "" && $request['tahun'] != "undefined") {
            $data = $data->where('ma.tahun','=',$request['tahun']);
        }
        $data = $data->where('sp.statusenabled', true);
        $data = $data->whereIn('sp.objectkelompoktransaksifk', [35,92]);
//        $data = $data->whereNotIn('sp.kdprofile',[7]);
        $data = $data->orderBy('sp.nostruk');
        $data = $data->get();

        foreach ($data as $item) {
            $details = DB::select(DB::raw("select  pr.namaproduk,ss.satuanstandar,spd.qtyproduk,spd.hargasatuan,spd.hargadiscount,
                                          spd.hargappn,((spd.hargasatuan-spd.hargadiscount+spd.hargappn)*spd.qtyproduk) as total,spd.tglkadaluarsa,spd.nobatch
                                          from strukpelayanandetail_t as spd 
                                          left JOIN produk_m as pr on pr.id=spd.objectprodukfk
                                          left JOIN satuanstandar_m as ss on ss.id=spd.objectsatuanstandarfk
                                          where spd.kdprofile = $idProfile and spd.kdprofile = $idProfile and nostrukfk=:norec"),
                array(
                    'norec' => $item->norec,
                )
            );
            $result[] = array(
                'tglstruk' => $item->tglstruk,
                'nostruk' => $item->nostruk,
                'nofaktur' => $item->nofaktur,
                'tglfaktur' => $item->tglfaktur,
                'namarekanan' => $item->namarekanan,
                'norec' => $item->norec,
                'namaruangan' => $item->namaruangan,
                'namapenerima' => $item->namalengkap,
                'totalharusdibayar' => $item->totalharusdibayar,
                'nosbk' => $item->nosbk,
                'keteranganlainnya' => $item->keteranganlainnya,
                'details' => $details,
            );
        }
        if (count($data) == 0) {
            $result = [];
        }

        $result = array(
            'daftar' => $result,
            'datalogin' => $dataLogin,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }

    public function getDetailVerifikasiUsulan (Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin = $request->all();
        $noKonfirmasi =  $request['noKonfirmasi'];
        $data = DB::select(DB::raw("select sk.*,pg.namalengkap
                from strukkonfirmasi_t as sk
                INNER JOIN pegawai_m as pg on pg.id = sk.objectpegawaifk
                where sk.kdprofile = $idProfile and sk.nokonfirmasi='$noKonfirmasi';"));
        $result = array(
            'data' =>$data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getDaftarUsulanAnggaran(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin = $request->all();
        $dataRuangan = \DB::table('maploginusertoruangan_s as mlu')
            ->JOIN('ruangan_m as ru','ru.id','=','mlu.objectruanganfk')
            ->select('ru.id')
            ->where('kdprofile', $idProfile)
            ->where('mlu.objectloginuserfk',$dataLogin['userData']['id'])
            ->get();
        $strRuangan = [];
        foreach ($dataRuangan as $epic){
            $strRuangan[] = $epic->id;
        }

        $data = \DB::table('strukorder_t as sp')
            ->JOIN('orderpelayanan_t as op','op.noorderfk','=','sp.norec')
            ->JOIN('strukverifikasi_t as sv','sv.norec','=','sp.objectsrukverifikasifk')
            ->LEFTJOIN('pegawai_m as pg','pg.id','=','sp.objectpegawaiorderfk')
            ->LEFTJOIN('pegawai_m as pg2','pg2.id','=','sp.objectpetugasfk')
            ->LEFTJOIN('ruangan_m as ru','ru.id','=','sp.objectruanganfk')
            ->LEFTJOIN('ruangan_m as ru2','ru2.id','=','sp.objectruangantujuanfk')
            ->LEFTJOIN('strukverifikasianggaran_t as sk','sk.norec','=','sp.strukverifikasianggaranfk')
            ->LEFTJOIN('mataanggaran_t as ma','ma.norec','=','sp.objectmataanggaranfk')
            ->LEFTJOIN('asalproduk_m as ap','ap.id','=','op.objectasalprodukfk')
            ->select('sp.norec','sp.tglorder','sp.noorder','pg.namalengkap as penanggungjawab','pg2.namalengkap as mengetahui',
                'sp.tglvalidasi as tglkebutuhan','sp.alamattempattujuan','sp.keteranganlainnya','sp.tglvalidasi','sp.noorderintern',
                'sp.keterangankeperluan','sp.keteranganorder','ru.namaruangan as ruangan','ru.id as ruid',
                'ru2.namaruangan as ruangantujuan','ru2.id as ruidtujuan',
                'sp.totalhargasatuan','sp.status','pg2.nippns','sv.noverifikasi','sv.tglverifikasi','sp.noorderhps','sk.noverifikasi',
                'sk.tglverifikasi','sk.statusterima as statusverifikasi','sk.keteranganlainnya as keteranganlainnya1',
                'ma.norec as mataanggaranfk','ma.mataanggaran','ap.id as apid','ap.asalproduk'
            )
            ->where('sp.kdprofile', $idProfile);

        if(isset($request['tglAwal']) && $request['tglAwal']!="" && $request['tglAwal']!="undefined"){
            $data = $data->where('sp.tglorder','>=', $request['tglAwal']);
        }
        if(isset($request['tglAkhir']) && $request['tglAkhir']!="" && $request['tglAkhir']!="undefined"){
            $tgl= $request['tglAkhir'];
            $data = $data->where('sp.tglorder','<=', $tgl);
        }
        if(isset($request['noorder']) && $request['noorder']!="" && $request['noorder']!="undefined"){
            $data = $data->where('sp.noorder','ilike','%'. $request['noorder']);
        }
        if(isset($request['noKontrak']) && $request['noKontrak']!="" && $request['noKontrak']!="undefined"){
            $data = $data->where('sp.nokontrakspk','ilike','%'. $request['noKontrak']);
        }
        if(isset($request['keterangan']) && $request['keterangan']!="" && $request['keterangan']!="undefined"){
            $data = $data->where('sp.keteranganorder','ilike','%'. $request['keterangan']);
        }
        if(isset($request['produkfk']) && $request['produkfk']!="" && $request['produkfk']!="undefined"){
            $data = $data->where('op.objectprodukfk','=',$request['produkfk']);
        }

        $data = $data->distinct();
        $data = $data->where('sp.statusenabled',true);
//        $data = $data->where('sk.statusterima',1);
        $data = $data->where('sp.objectkelompoktransaksifk',89);
        $data = $data->orderBy('sp.tglorder');
        $data = $data->get();

        $results =array();
        foreach ($data as $item){
            $details = DB::select(DB::raw("
                     select pr.namaproduk,
                    ss.satuanstandar,spd.qtyproduk,spd.hargasatuan,spd.hargadiscount,spd.hargappnquo,spd.hargadiscountquo,
                    (spd.qtyproduk*(spd.hargasatuan)) as total,
                    (spd.qtyprodukkonfirmasi*(spd.hargasatuanquo + hargappnquo - hargadiscountquo)) as totalkonfirmasi,
                    spd.tglpelayananakhir as tglkebutuhan,spd.deskripsiprodukquo as spesifikasi,pr.id as prid,
                    spd.hargasatuanquo,spd.qtyprodukkonfirmasi
                     from orderpelayanan_t as spd 
                    left JOIN produk_m as pr on pr.id=spd.objectprodukfk
                    left JOIN satuanstandar_m as ss on ss.id=spd.objectsatuanstandarfk
                    where spd.kdprofile = $idProfile and strukorderfk=:norec"),
                array(
                    'norec' => $item->norec,
                )
            );

            $results[] = array(
                'tglorder' => $item->tglorder,
                'noorder' => $item->noorder,
                'norec' => $item->norec,
                'penanggungjawab' => $item->penanggungjawab,
                'keterangan' => $item->keteranganorder,
                'koordinator' => $item->keteranganlainnya,
                'tglkebutuhan' => $item->tglkebutuhan,
                'tglusulan' => $item->tglorder,
                'nousulan' => $item->noorderintern,
                'namapengadaan' => $item->keterangankeperluan,
                'mengetahui' => $item->mengetahui,
                'ruangan' => $item->ruangan,
                'ruangantujuan' => $item->ruangantujuan,
                'totalhargasatuan' => $item->totalhargasatuan,
                'status' => $item->status,
//                'noverifikasi' => $item->noverifikasi,
                'noorderhps' => $item->noorderhps,
                'tglverifikasi' => $item->tglverifikasi,
                'noverifikasianggaran' => $item->noverifikasi,
                'statusverifikasi' => $item->statusverifikasi,
                'keteranganverifikasi' => $item->keteranganlainnya1,
//                'keteranganverifikasi' => $item->keteranganverifikasi,
//                'tglkonfirmasi' => $item->tglkonfirmasi,
                'mataanggaranfk' => $item->mataanggaranfk,
                'mataanggaran' => $item->mataanggaran,
                'apid' => $item->apid,
                'asalproduk' => $item->asalproduk,
                'details' => $details,
            );
        }
        $result = array(
            'daftar' => $results,
            'datalogin' => $dataLogin,
            'message' => 'as@epic',
        );
        return $this->respond($result);
    }

    public function getDaftarMataAnggaranForUpk(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin = $request->all();
        $Pengendali =  ' ';
        if (isset($request['Pengendali']) && $request['Pengendali'] != "" && $request['Pengendali'] != "undefined") {
            $Pengendali =  ' and objectpengendalifk =  ' . $request['Pengendali'];
        }
        $data = DB::select(DB::raw("select * from (
                    select left(mat.kode,1)|| '00000000' as kode, ka.kdkelompokhead as kd, upper(ka.kelompokhead) as desc,
                    sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake,
                    mat.objectpengendalifk,mat.norec
                    from mataanggaran_t as mat
                    INNER JOIN kelompokanggaranhead_m as ka on cast(ka.id as text)=left(mat.kode,1)
                    where mat.kdprofile = $idProfile
                    group by left(mat.kode,1),ka.kdkelompokhead,ka.kelompokhead,mat.tahun,mat.revisidivake,
                    mat.objectpengendalifk,mat.norec
                    union all
                    select left(mat.kode,3)|| '000000' as kode,'---' || ka.kdchildpertama as kd,upper(ka.childpertama) as desc,
                    sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake,mat.objectpengendalifk,mat.norec
                    from mataanggaran_t as mat
                    INNER JOIN kelompokanggaranpertama_m ka on cast(ka.id as text)=substring(mat.kode,1,2)
                    where mat.kdprofile = $idProfile
                    group by left(mat.kode,3),ka.kdchildpertama,ka.childpertama,mat.tahun,mat.revisidivake,mat.objectpengendalifk,mat.norec
                    union all
                    select  left(mat.kode,5) || '0000'as kode,'------' || ka.kdchildkedua as kd,ka.childkedua as desc,
                    sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake,mat.objectpengendalifk,mat.norec
                    from mataanggaran_t as mat
                    INNER JOIN kelompokanggarankedua_m ka on cast(ka.id as text)=substring(mat.kode,3,2)
                    where mat.kdprofile = $idProfile
                    group by left(mat.kode,5),ka.kdchildkedua,ka.childkedua,mat.tahun,mat.revisidivake,mat.objectpengendalifk,mat.norec
                    union all
                    select left(mat.kode,7) || '00'as kode,'---------' || ka.kdchildketiga as kd,ka.childketiga as desc,
                    sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm,mat.tahun as tahun,mat.revisidivake,mat.objectpengendalifk,mat.norec
                    from mataanggaran_t as mat
                    INNER JOIN kelompokanggaranketiga_m as ka on cast(ka.id as text)=substring(mat.kode,5,2)
                    where mat.kdprofile = $idProfile
                    group by left(mat.kode,7),ka.kdchildketiga,ka.childketiga,mat.tahun,mat.revisidivake,mat.objectpengendalifk,mat.norec
                    union all
                    select  left(mat.kode,9) as kode,'------------' || ka.kdchildkeempat as kd,ka.childkeempat as desc,
                    sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm,mat.tahun as tahun,mat.revisidivake,mat.objectpengendalifk,mat.norec
                    from mataanggaran_t as mat
                    INNER JOIN kelompokanggarankeempat_m as ka on cast(ka.id as text)=substring(mat.kode,7,3)
                    where mat.kdprofile = $idProfile
                    group by left(mat.kode,9),ka.kdchildkeempat,ka.childkeempat,mat.tahun,mat.revisidivake,mat.objectpengendalifk,mat.norec
                    union all
                    select left(mat.kode,9) || '~' || norec as kode,'---------------'  as kd,mat.mataanggaran as desc,
                    sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake,mat.objectpengendalifk,mat.norec
                    from mataanggaran_t as mat
                    group by left(mat.kode,9)|| '~' || norec,mat.kode,mat.mataanggaran,mat.tahun,mat.revisidivake,mat.objectpengendalifk,mat.norec
                    where mat.kdprofile = $idProfile
                    ) as x WHERE tahun=:tahun 
                    and revisidivake=:revisidivake
                    $Pengendali 
                    order by kode;"),
            array(
                'tahun' => $request['tahun'],
                'revisidivake' => $request['revisike'],
            )
        );

        $result = array(
            'data' => $data,
            'message' => 'ramdanegie',
        );

        return $this->respond($result);
    }

    public function saveVerifikasiAnggaran (Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.kdprofile', $idProfile)
            ->where('lu.id',$dataLogin['userData']['id'])
            ->first();
        $tglAyeuna = date('Y-m-d H:i:s');
        $noveriF='';
        DB::beginTransaction();
        try{
            if ($request['strukverifikasi']['norec'] != '') {

                //#struk Verifikasi
                $noVerifikasi = $this->generateCode(new StrukVerifikasi(),'noverifikasi', 10, 'CA'.$this->getDateTime()->format('Y'));
                $dataSV = new StrukVerifikasiAnggaran();
                $dataSV->norec = $dataSV->generateNewId();
                $dataSV->noverifikasi = $noVerifikasi;
                $dataSV->kdprofile = $idProfile;
                $dataSV->statusenabled = true;
                $dataSV->objectkelompoktransaksifk = 102;
                $dataSV->keteranganlainnya = $request['strukverifikasi']['keterangan'];
                $dataSV->objectpegawaipjawabfk = $dataPegawai->objectpegawaifk;
                $dataSV->namaverifikasi = 'Confirm Anggaran';
                $dataSV->tglverifikasi = $tglAyeuna;
                $dataSV->tgleksekusi = $tglAyeuna;
                $dataSV->statusterima =  $request['strukverifikasi']['status'];
                $dataSV->totalpengajuan = $request['strukverifikasi']['totalpengajuan'];
                $dataSV->totalppn = $request['strukverifikasi']['totalppn'];
                $dataSV->totaldiskon = $request['strukverifikasi']['totaldiskon'];
                $dataSV->save();
                $dataSV = $dataSV->norec;
                $noveriF = $noVerifikasi;
                $dataSO = StrukOrder::where('norec', $request['strukverifikasi']['norec'])
                    ->where('kdprofile', $idProfile)
                    ->update([
                            'strukverifikasianggaranfk' => $dataSV,
                        ]
                    );
            }
//                return $this->respond($noveriF);
            //***** Struk Realisasi *****
            $datanorecSR = '';
            if ($request['strukverifikasi']['norecrealisasi'] == '') {
                $dataSR= new StrukRealisasi();
                $norealisasi = $this->generateCode(new StrukRealisasi(),'norealisasi',10,'RA-'.$this->getDateTime()->format('ym'));
                $dataSR->norec = $dataSR->generateNewId();
                $dataSR->kdprofile = $idProfile;
                $dataSR->statusenabled = true;
                $dataSR->norealisasi = $norealisasi;
                $dataSR->tglrealisasi = $tglAyeuna;
                $dataSR->objectmataanggaranfk = $request['strukverifikasi']['mataanggaran'];
//                $dataSR->status = 1;
                $dataSR->save();
                if($datanorecSR == null){
                    $datanorecSR = $request['strukverifikasi']['norecrealisasi'];
                }else{
                    $datanorecSR = $dataSR->norec;
                }
            }else {
                $dataSR = StrukRealisasi::where('norec', $request['strukverifikasi']['norecrealisasi'])->where('kdprofile', $idProfile)->first();
                $dataSR->tglrealisasi = $tglAyeuna;
                $dataSR->objectmataanggaranfk = $request['strukverifikasi']['mataanggaran'];
                $dataSR->save();
                if($datanorecSR == null){
                    $datanorecSR = $request['strukverifikasi']['norecrealisasi'];
                }else{
                    $datanorecSR = $dataSR->norec;
                }
            }

            //***** Riwayat Realisasi *****
            if ($request['strukverifikasi']['norecrealisasi'] != null) {
                $dataRR= new RiwayatRealisasi();
                $dataRR->norec = $dataRR->generateNewId();
                $dataRR->kdprofile = $idProfile;
                $dataRR->statusenabled = true;
                $dataRR->objectkelompoktransaksifk = 102;
            }else {
                $dataRR = RiwayatRealisasi::where('objectstrukrealisasifk', $request['strukverifikasi']['norecrealisasi'])->where('kdprofile', $idProfile)->first();
            }
            $dataRR->objectstrukrealisasifk = $datanorecSR;
            $dataRR->objectstrukfk = $request['strukverifikasi']['norec'];
            $dataRR->tglrealisasi = $tglAyeuna;
            $dataRR->objectpetugasfk = $dataPegawai->objectpegawaifk;
            $dataRR->noorderintern = $request['strukverifikasi']['nousulan'];
            $dataRR->keteranganlainnya = 'Confirm Anggaran';
            $dataRR->objectverifikasifk = $dataSV;
            $dataRR->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Verifikasi Anggaran";
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Verifikasi Anggaran Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "nousulan" => $request['strukverifikasi']['nousulan'],
                "data" => $dataSV,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Simpan Verifikasi Anggaran Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "norec" => $request['strukverifikasi']['norec'],
                "data" => $dataSV,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getKelAnggaranKeTiga(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $req=$request->all();
        $keempat = \DB::table('kelompokanggaranketiga_m as ru')
            ->select('ru.id','ru.kdchildketiga','ru.childketiga')
            ->where('ru.statusenabled', true)
            ->where('ru.kdprofile', $idProfile)
            ->orderBy('ru.childketiga');

        if(isset($req['childketiga']) &&
            $req['childketiga']!="" &&
            $req['childketiga']!="undefined"){
            $keempat = $keempat->where('ru.childketiga','ilike','%'. $req['childketiga'] .'%');
        };

        if(isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value']!="" &&
            $req['filter']['filters'][0]['value']!="undefined"){
            $keempat = $keempat->where('ru.childketiga','ilike','%'.$req['filter']['filters'][0]['value'].'%' );
        };

        $keempat = $keempat->take(20);
        $keempat = $keempat->get();

        foreach ($keempat as $item){
            $data[]=array(
                'id' => $item->id,
                'kdchildketiga' => $item->kdchildketiga,
                'childketiga' =>$item->kdchildketiga.' - '.$item->childketiga,
            );
        }
        return $this->respond($data);
    }

    public function getKelAnggaranKedua(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $req=$request->all();
        $keempat = \DB::table('kelompokanggarankedua_m as ru')
            ->select('ru.id','ru.kodeexternal','ru.kdchildkedua','ru.childkedua','ru.namaexternal')
            ->where('ru.statusenabled', true)
            ->where('ru.kdprofile', $idProfile)
            ->orderBy('ru.childkedua');

        if(isset($req['childkedua']) &&
            $req['childkedua']!="" &&
            $req['childkedua']!="undefined"){
            $keempat = $keempat->where('ru.childkedua','ilike','%'. $req['childkedua'] .'%');
        };

        if(isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value']!="" &&
            $req['filter']['filters'][0]['value']!="undefined"){
            $keempat = $keempat->where('ru.childkedua','ilike','%'.$req['filter']['filters'][0]['value'].'%' );
        };

        $keempat = $keempat->take(20);
        $keempat = $keempat->get();

        foreach ($keempat as $item){
            $data[]=array(
                'id' => $item->id,
                'kdchildkedua' => $item->kdchildkedua,
                'childkedua' =>$item->kodeexternal.' - '.$item->kdchildkedua.' - '.$item->childkedua.' - '.$item->namaexternal,
            );
        }
        return $this->respond($data);
    }
     public function deleteKelompokAnggaran(Request $request) {
         $kdProfile = $this->getDataKdProfile($request);
         $idProfile = (int) $kdProfile;
        $dataLogin = $request->all();
        DB::beginTransaction();
        try{
            if($request['kelompok'] == 5){
                  if ($request['id'] != ''){
                    $data1 = KelompokAnggaranKelima::where('id', $request['id'])
                        ->where('ru.kdprofile', $idProfile)
                        ->delete();
                    $transStatus = 'true';
                }
            }
            if($request['kelompok'] == 6){
                  if ($request['id'] != ''){
                    $data1 = KelompokAnggaranKeenam::where('id', $request['id'])
                        ->where('ru.kdprofile', $idProfile)
                        ->delete();
                    $transStatus = 'true';
                }
            }
          
        }
        catch(\Exception $e){
            $transStatus= 'false';
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
    public function saveKelompokAnggaran(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        DB::beginTransaction();
        try{
            if($request['kelompok'] == 5){
                if ($request['id']==''){
                    $newId = KelompokAnggaranKelima::max('id');
                    $newId= $newId+1;
                    $MA = new KelompokAnggaranKelima();
                    $MA->id = $newId;
                    $MA->kdprofile = $idProfile;
                    $MA->statusenabled = true;
                }else{
                    $MA= KelompokAnggaranKelima::where('id',$request['id'])
                        ->where('kdprofile', $idProfile)
                        ->first();
                }
                $MA->kdchildkelima = $request['kdkelompok'];
                $MA->childkelima =  $request['namakelompok'];
                $MA->kodeexternal =  $request['kodeexternal'];
                $MA->namaexternal =  $request['namaexternal'];

                $MA->save();
            }
             if($request['kelompok'] == 6){
                if ($request['id']==''){
                    $newId = KelompokAnggaranKeenam::max('id');
                    $newId= $newId+1;
                    $MA = new KelompokAnggaranKeenam();
                    $MA->id = $newId;
                    $MA->kdprofile = $idProfile;
                    $MA->statusenabled = true;
                }else{
                    $MA= KelompokAnggaranKeenam::where('id',$request['id'])
                        ->where('kdprofile', $idProfile)
                        ->first();
                }
                $MA->kdchildkeenam = $request['kdkelompok'];
                $MA->childkeenam =  $request['namakelompok'];
                $MA->kodeexternal =  $request['kodeexternal'];
                $MA->namaexternal =  $request['namaexternal'];

                $MA->save();
            }
           
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan Mata Anggaran";
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $MA,
                'as' => 'ramdanegie',
            );
        } else {
            $transMessage = "Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'result' => $MA,
                'as' => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
     public function getKelAnggaranKelima(Request $request) {
         $kdProfile = $this->getDataKdProfile($request);
         $idProfile = (int) $kdProfile;
        $req=$request->all();
        $keempat = \DB::table('kelompokanggarankelima_m as ru')
            ->select('ru.id','ru.kdchildkelima','ru.childkelima')
            ->where('ru.statusenabled', true)
            ->where('ru.kdprofile', $idProfile)
            ->orderBy('ru.childkelima');

        if(isset($req['childkelima']) &&
            $req['childkelima']!="" &&
            $req['childkelima']!="undefined"){
            $keempat = $keempat->where('ru.childkelima','ilike','%'. $req['childkelima'] .'%');
        };

        if(isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value']!="" &&
            $req['filter']['filters'][0]['value']!="undefined"){
            $keempat = $keempat->where('ru.childkelima','ilike','%'.$req['filter']['filters'][0]['value'].'%' );
        };

        $keempat = $keempat->take(20);
        $keempat = $keempat->get();
         $data=[];
        foreach ($keempat as $item){
            $data[]=array(
                'id' => $item->id,
                'kdchildkelima' => $item->kdchildkelima,
                'childkelima' =>$item->kdchildkelima.' - '.$item->childkelima,
            );
        }
        return $this->respond($data);
    }
     public function getKelAnggaranKeenam(Request $request) {
         $kdProfile = $this->getDataKdProfile($request);
         $idProfile = (int) $kdProfile;
        $req=$request->all();
        $keempat = \DB::table('kelompokanggarankeenam_m as ru')
            ->select('ru.id','ru.kdchildkeenam','ru.childkeenam')
            ->where('ru.statusenabled', true)
            ->where('ru.kdprofile', $idProfile)
            ->orderBy('ru.childkeenam');

        if(isset($req['childkeenam']) &&
            $req['childkeenam']!="" &&
            $req['childkeenam']!="undefined"){
            $keempat = $keempat->where('ru.childkeenam','ilike','%'. $req['childkeenam'] .'%');
        };

        if(isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value']!="" &&
            $req['filter']['filters'][0]['value']!="undefined"){
            $keempat = $keempat->where('ru.childkeenam','ilike','%'.$req['filter']['filters'][0]['value'].'%' );
        };

        $keempat = $keempat->take(20);
        $keempat = $keempat->get();
         $data =[];
        foreach ($keempat as $item){
            $data[]=array(
                'id' => $item->id,
                'kdchildkeenam' => $item->kdchildkeenam,
                'childkeenam' =>$item->kdchildkeenam.' - '.$item->childkeenam,
            );
        }
        return $this->respond($data);
    }
    public function saveKegiatanAnggaran(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
       try{
            if ($request['id']==''){
                $newID = KegiatanAnggaran::max('id');

                $MA = new KegiatanAnggaran();
                $MA->id =  $newID + 1;
                $MA->norec = $newID + 1;
                $MA->kdprofile = $idProfile;
                $MA->statusenabled = true;

                // $KB= KeteranganBelanja::where('objectkegiatanfk',$MA->id)
                //     ->where('kdprofile', $idProfile)
                //     ->get();

            }else{
                $MA= KegiatanAnggaran::where('id',$request['id'])
                    ->where('kdprofile', $idProfile)
                    ->first();
                
                // $KB= KeteranganBelanja::where('objectkegiatanfk',$request['id'])
                //     ->where('kdprofile', $idProfile)
                //     ->get();
            }
            $MA->kode = $request['kode'];
            $MA->keterangan = $request['keterangan'];
            $MA->kodeexternal = $request['kodeexternal'];
            $MA->namaexternal = $request['namaexternal'];
            $MA->reportdisplay = $request['reportdisplay'];
            $MA->tahun = $request['tahun'];
            //$MA->tahap = $request['tahap'];
            $MA->indikatormasuk = $request['indikatormasuk'];
            $MA->indikatorkeluaran = $request['indikatorkeluaran'];
            $MA->indikatorhasil = $request['indikatorhasil'];
            $MA->targetmasuk = $request['targetmasuk'];
            $MA->targetkeluaran = $request['targetkeluaran'];
            $MA->targethasil = $request['targethasil'];
            $MA->div = $request['div'];
            $MA->objectjenisbelanjafk = $request['jenisbelanja'];

            $MA->save();

            // if(!empty($KB)){
            //     foreach($KB as $k){
            //         $k->objecttahapfk = $request['idtahap'];
            //         $k->save();
            //     }
            // }
                
           
            

           $transStatus = 'true';
       } catch (\Exception $e) {
            $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $MA,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'line'=> $e->getLine(),
                'message'=> $e->getMessage(),
                'result' => $MA,
                'as' => '@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveSettingTahap(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $details = $request['details'];
        $awal = $request['tahapawal']['id'];
        $akhir = $request['tahapakhir']['id'];

        try{

            foreach($details as $dt){
                $KB= KeteranganBelanja::where('objectkegiatanfk',$dt['id'])
                    ->where('objecttahapfk', $awal)
                    ->get();
                
                foreach($KB as $k){

                    $MA = new KeteranganBelanja();
                    $norecKS = $MA->generateNewId();
                    $MA->norec = $norecKS;
                    $MA->kdprofile = $idProfile;
                    $MA->statusenabled = true;
                    $MA->objectkegiatanfk = $dt['id'];
                    $MA->objectmataanggaranfk = $k->objectmataanggaranfk;
                    $MA->keteranganbelanja = $k->keteranganbelanja;
                    $MA->nourut = $k->nourut;
                    $MA->jml = $k->jml;
                    $MA->hargasatuan = $k->hargasatuan;
                    $MA->subtotal = $k->subtotal;
                    $MA->satuan = $k->satuan;
                    $MA->objectasalprodukfk = $k->objectasalprodukfk;
                    $MA->objecttahapfk = $akhir;

                    $MA->save();
                }
            }

           $transStatus = 'true';
       } catch (\Exception $e) {
            $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $KB,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'line'=> $e->getLine(),
                'message'=> $e->getMessage(),
                'as' => '@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveSPP(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        try{
                    $SP = SPD::where('nospd', '=', $request['nospd'])->first();        
            
                    $MA = new SPP();
                    $norecKS = $MA->generateNewId();
                    $MA->norec = $norecKS;
                    $MA->kdprofile = $idProfile;
                    $MA->statusenabled = true;
                    $MA->nospp = $request['nospp'];
                    $MA->jenisbukti = $request['jenisbukti'];
                    $MA->dasarpengeluaran = $request['dasarpengeluaran'];
                    $MA->status = $request['statusspp'];
                    $MA->tglspp = $request['tglspp'];
                    $MA->bulan = $request['bulan'];
                    $MA->pengeluaran = $request['pengeluaran'];
                    $MA->tglsah = $request['tglsah'];
                    $MA->nilaispp = $request['nilaispp'];
                    $MA->objectspdfk = $SP->norec;

                    $MA->save();

           $transStatus = 'true';
       } catch (\Exception $e) {
            $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $MA,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'line'=> $e->getLine(),
                'message'=> $e->getMessage(),
                'as' => '@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveSPM(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        try{
                    $SP = SPP::where('nospp', '=', $request['nospp'])->first();        
            
                    $MA = new SPM();
                    $norecKS = $MA->generateNewId();
                    $MA->norec = $norecKS;
                    $MA->kdprofile = $idProfile;
                    $MA->statusenabled = true;
                    $MA->nospm = $request['nospm'];
                    $MA->jenisbukti = $request['jenisbukti'];
                    $MA->untukpengeluaran = $request['untukpengeluaran'];
                    $MA->status = $request['status'];
                    $MA->objectsppfk = $SP->norec;
                    $MA->tglspm = $request['tglspm'];
                    $MA->tglsah = $request['tglsah'];
                    $MA->nilaispm = $request['nilaispm'];
                    $MA->noreg = $request['noreg'];

                    $MA->save();

           $transStatus = 'true';
       } catch (\Exception $e) {
            $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $MA,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'line'=> $e->getLine(),
                'message'=> $e->getMessage(),
                'as' => '@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveSPD(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        try{
                    $MA = new SPD();
                    $norecKS = $MA->generateNewId();
                    $MA->norec = $norecKS;
                    $MA->kdprofile = $idProfile;
                    $MA->statusenabled = true;
                    $MA->nospd = $request['nospd'];
                    $MA->tglspd = $request['tglspd'];
                    $MA->nilaispd = $request['nilaispd'];

                    $MA->save();

           $transStatus = 'true';
       } catch (\Exception $e) {
            $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $MA,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'line'=> $e->getLine(),
                'message'=> $e->getMessage(),
                'as' => '@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function savePerubahanKeterangan(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $details = $request['details'];
        $subsusb = $request['idkegiatan'];

        try{

            foreach($details as $dt){
                $KB= KeteranganBelanja::where('norec',$dt['norec'])
                    ->first();
                $KB->objectkegiatanfk = $subsusb;
                $KB->isperubahan = true;
                $KB->save();
            }

           $transStatus = 'true';
       } catch (\Exception $e) {
            $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $KB,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'line'=> $e->getLine(),
                'message'=> $e->getMessage(),
                'as' => '@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function savePengembalianSPJ(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        try{
            $KB= Panjar::where('norec',$request['norec'])
                ->first();
            $KB->jumlahpengembalian = $request['uangpengembalian'];
            $KB->save();

           $transStatus = 'true';
       } catch (\Exception $e) {
            $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $KB,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'line'=> $e->getLine(),
                'message'=> $e->getMessage(),
                'as' => '@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveVerifSPJ(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        try{
            $KB= StrukRealisasi::where('norec',$request['norec'])
                ->first();
            $KB->status = $request['statusverif'];
            $KB->tglverif = $request['tglverif'];
            $KB->keterangan = $request['keterangan'];
            $KB->jumlahdibayarverif = $request['jumlahdibayarverif'];
            $KB->save();
            $transStatus = 'true';
       } catch (\Exception $e) {
            $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $KB,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'line'=> $e->getLine(),
                'message'=> $e->getMessage(),
                'as' => '@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function savePanjarSPJ(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        try{
            $KB= Panjar::where('nopanjar',$request['nopanjar'])
                ->first();
            $SR= StrukRealisasi::where('norec',$request['norec'])
                ->first();

            $SR->objectpanjarfk = $KB->norec;
            $SR->save();
            $transStatus = 'true';
       } catch (\Exception $e) {
            $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $SR,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'line'=> $e->getLine(),
                'message'=> $e->getMessage(),
                'as' => '@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function batalVerifSPJ(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        try{
            $KB= StrukRealisasi::where('norec',$request['norec'])
                ->first();
            $KB->status = null;
            $KB->tglverif = null;
            $KB->keterangan = null;
            $KB->jumlahdibayarverif = null;
            $KB->save();
            $transStatus = 'true';
       } catch (\Exception $e) {
            $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $KB,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'line'=> $e->getLine(),
                'message'=> $e->getMessage(),
                'as' => '@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveSettingAnggaran(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tahunanggaran = $request['tahunanggaran'];

        $cek = DB::select(DB::raw("select tahunanggaran from settinganggaran_t where tahunanggaran = '$tahunanggaran'"));

       try{
            if (empty($cek)){
                $MA = new SettingAnggaran();
                $MA->norec =  substr(\Webpatser\Uuid\Uuid::generate(), 0, 32);
                $MA->kdprofile = $idProfile;
                $MA->statusenabled = true;
                $MA->kodeexternal = $MA->norec;
                $MA->namaexternal = $MA->norec;
                $MA->reportdisplay = $MA->norec;
            }else{
                $MA= SettingAnggaran::where('tahunanggaran',$request['tahunanggaran'])
                    ->where('kdprofile', $idProfile)
                    ->first();
            }
            $MA->namapemda = $request['namapemda'];
            $MA->kepaladaerah = $request['kepaladaerah'];
            $MA->namakepaladaerah = $request['namakepaladaerah'];
            $MA->namasekda = $request['namasekda'];
            $MA->nipsekda = $request['nipsekda'];
            $MA->namappkd = $request['namappkd'];
            $MA->nipppkd = $request['nipppkd'];
            $MA->pengelolakeuanganblud = $request['pengelolakeuanganblud'];
            $MA->nipkepalablud = $request['nipkepalablud'];
            $MA->alamat = $request['alamat'];
            $MA->kota = $request['kota'];
            $MA->telepon = $request['telepon'];
            $MA->faximile = $request['faximile'];
            $MA->tahunanggaran = $request['tahunanggaran'];
            $MA->objectkepalabludfk = $request['objectkepalabludfk'];
            $MA->objecttahapaktivfk = $request['objecttahapaktivfk'];
            $MA->nomornpwp = $request['nomornpwp'];

            $MA->save();
           $transStatus = 'true';
       } catch (\Exception $e) {
            $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $MA,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'result' => $MA,
                'line'=> $e->getLine(),
                'message'=> $e->getMessage(),
                'as' => '@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getPenjagaanSettingAnggaran(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tahunanggaran = $request['tahunanggaran'];

        $cek = DB::select(DB::raw("select tahunanggaran from settinganggaran_t where tahunanggaran = '$tahunanggaran'"));

       
            $result = array(
                'status' => 201,
                'data' => $cek,
                'as' => '@epic',
            );

        return $this->setStatusCode($result['status'])->respond($result);
    }
    
    public function saveMataAnggaran(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
       try{
            if ($request['id']==''){
                $newID = MataAnggaran::max('id');

                $MA = new MataAnggaran();
                $MA->id =  $newID + 1;
                $MA->norec = $newID + 1;
                $MA->kdprofile = $idProfile;
                $MA->statusenabled = true;

            }else{
                $MA= MataAnggaran::where('id',$request['id'])
                    ->where('kdprofile', $idProfile)
                    ->first();
            }
            $MA->reportdisplay = $request['reportdisplay'];
            $MA->kodemataanggaran = $request['kodemataanggaran'];
            $MA->namamataanggaran = $request['namamataanggaran'];
            $MA->objectjenisanggaranfk = $request['jenisanggaran'];
            $MA->keterangan = $request['keterangan'];
            $MA->kodeexternal = $request['kodeexternal'];
            $MA->namaexternal = $request['namaexternal'];

            $MA->save();
           $transStatus = 'true';
       } catch (\Exception $e) {
            $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $MA,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'result' => $MA,
                'as' => '@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveKeteranganBelanja(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
       try{
            if ($request['norec']==''){
                $MA = new KeteranganBelanja();
                $norecKS = $MA->generateNewId();
                $MA->norec = $norecKS;
                $MA->kdprofile = $idProfile;
                $MA->statusenabled = true;

            }else{
                $MA= KeteranganBelanja::where('norec',$request['norec'])
                    ->where('kdprofile', $idProfile)
                    ->first();
            }
            $MA->objectkegiatanfk = $request['objectkegiatanfk'];
            $MA->objectmataanggaranfk = $request['objectmataanggaranfk'];
            $MA->keteranganbelanja = $request['keteranganbelanja'];
            $MA->nourut = $request['nourut'];
            $MA->jml = $request['jml'];
            $MA->hargasatuan = $request['hargasatuan'];
            $MA->subtotal = $request['subtotal'];
            $MA->satuan = $request['satuan'];
            $MA->objectasalprodukfk = $request['objectasalprodukfk'];
            $MA->objecttahapfk = $request['idtahap'];

            $MA->save();
           $transStatus = 'true';
       } catch (\Exception $e) {
            $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $MA,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'result' => $MA,
                'as' => '@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getTotalMataAnggaran(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $stahun = '';
        if(isset($request['tahun']) || $request['tahun'] != ''){
            $stahun = "and ka.tahun = '".$request['tahun']."'";
        }

        $stahap = '';
        if(isset($request['tahap']) && $request['tahap'] != '' && $request['tahap'] != 'undefined'){
            $stahap = "and kb.objecttahapfk = ".$request['tahap'];
        }



        $data = DB::select(DB::raw("
                select ma.id, ma.kodemataanggaran,ma.namamataanggaran,cast(sum(kt.subtotal) as float) as total 
                from mataanggaran_m ma
                left JOIN keteranganbelanja_t kt on kt.objectmataanggaranfk=ma.id
                where 
                length(ma.kodemataanggaran)= 9 
                and ma.kdprofile=$idProfile
                group by  ma.id,ma.kodemataanggaran,ma.namamataanggaran
                order by ma.kodemataanggaran;
            ")
        );
        $dataKeteranganBelanja = DB::select(DB::raw("
                select kb.*,ma.kodemataanggaran || ' ' || ma.namamataanggaran as mataanggaran,
                ka.kode || ' ' || ka.keterangan as kegiatan,ap.asalproduk,
                ma.kodemataanggaran , ma.namamataanggaran,ka.kode , ka.keterangan,ka.tahun,ta.tahap
                --,1 as jan,1 as feb,1 as mar, 1 as apr,
                --1 as mei,1 as juni, 1 as juli,1 as agst,1 as sep,1 as okt, 1 as nov,1 as des
                from keteranganbelanja_t kb
                INNER JOIN mataanggaran_m ma on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                INNER JOIN asalproduk_m ap on ap.id=kb.objectasalprodukfk
                INNER JOIN tahapanggaran_m ta on ta.id=kb.objecttahapfk
                --inner join settinganggaran_t sa on sa.objecttahapaktivfk = ta.id
                where kb.kdprofile = 30 and kb.statusenabled = true
                $stahun
                $stahap
                group by kb.norec, kb.kdprofile, kb.statusenabled, kb.objectkegiatanfk, kb.objectmataanggaranfk, kb.keteranganbelanja,
                ma.kodemataanggaran || ' ' || ma.namamataanggaran, kb.nourut, kb.jml, kb.hargasatuan, kb.subtotal, kb.satuan,
                kb.objectasalprodukfk, kb.objecttahapfk,
                ka.kode || ' ' || ka.keterangan,ap.asalproduk,
                ma.kodemataanggaran , ma.namamataanggaran,ka.kode , ka.keterangan,ka.tahun,ta.tahap"
            )
        );
        $arrALokasi = [];
        foreach($dataKeteranganBelanja as $item){
            $dataAlokasi = \DB::table('alokasiketeranganbelanja_t as ap')
            ->select('ap.*')
            ->where('ap.statusenabled',true)
            ->where('ap.keteranganbelanjafk',$item->norec)
            ->get();    
            $arrALokasi[] = $dataAlokasi;
        }
        $dataAsalProduk = \DB::table('asalproduk_m as ap')
            ->select('ap.id','ap.asalproduk')
            ->where('ap.statusenabled',true)
            ->orderBy('ap.asalproduk')
            ->get();

        $result = array(
            'data' => $data,
            'keteranganbelanja' => $dataKeteranganBelanja,
            'asalproduk' => $dataAsalProduk,
            'alokasi' => $arrALokasi,
            'message' => '@epic',
        );

        return $this->respond($result);
    }


    public function getTotalKeterangan(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $tahap = $request['tahap'];
        $data = DB::select(DB::raw("
                select sum(kb.subtotal) totalketerangan
                from keteranganbelanja_t kb 
                where kb.objecttahapfk = $tahap;
            ")
        );

        $detail = DB::select(DB::raw("
                select sum(rd.subtotal) totalrealisasidetail
                from keteranganbelanja_t kb
                inner join realisasidetail_t rd on rd.keteranganbelanjafk = kb.norec
                where kb.objecttahapfk = $tahap;
            ")
        );

        $panjar = DB::select(DB::raw("select sum(jumlah-jumlahpengembalian) as panjar
        from(
        select pj.norec, pj.jumlah, coalesce(pj.jumlahpengembalian, 0) jumlahpengembalian
                        from keteranganbelanja_t kb
                        inner join realisasidetail_t rd on rd.keteranganbelanjafk = kb.norec
                                        inner join strukrealisasi_t sr on sr.norec = rd.strukrealisasifk
                                        inner join panjar_t pj on pj.norec =  sr.objectpanjarfk
                        where kb.objecttahapfk = $tahap
        group by pj.norec, pj.jumlah, pj.jumlahpengembalian
        ) as x;"));

        $result = array(
            'data' => $data,
            'detail' => $detail,
            'panjar' => $panjar,
            'message' => '@epic',
        );

        return $this->respond($result);
    }

    public function getPanjar(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $data = DB::select(DB::raw("
                select nopanjar, uraian, tglpanjar, jumlah, jenispanjar, jumlahpengembalian, sumberpanjar
                from panjar_t 
                where kdprofile = 30
                and statusenabled = true;
            ")
        );

        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }

    public function getPanjarAktif(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $data = DB::select(DB::raw("
        select pj.nopanjar, pj.uraian, pj.tglpanjar, pj.jumlah, pj.jenispanjar, pj.jumlahpengembalian, pj.sumberpanjar, sr.objectpanjarfk
        from panjar_t pj
        left join strukrealisasi_t sr on sr.objectpanjarfk = pj.norec
        where pj.kdprofile = 30
        and pj.statusenabled = true
        and sr.objectpanjarfk is null;
            ")
        );

        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }

    public function getOnePanjar(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $norec = $request['norec'];

        $data = DB::select(DB::raw("
        select pj.jumlah
        from panjar_t pj
        left join strukrealisasi_t sr on sr.objectpanjarfk = pj.norec
        where sr.norec = '$norec';
            ")
        );

        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }

    public function getKodemataanggaran(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $namamataanggaran = $request['namamataanggaran'];

        $data = DB::select(DB::raw("
        select kodemataanggaran
        from mataanggaran_m 
        where namamataanggaran = '$namamataanggaran';
            ")
        );

        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }

    public function getTotalRealisasiDetail(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $tahap = $request['tahap'];
        $data = DB::select(DB::raw("
                select sum(rd.subtotal) totalrealisasidetail
                from keteranganbelanja_t kb
                inner join realisasidetail_t rd on rd.keteranganbelanjafk = kb.norec
                where kb.objecttahapfk = $tahap;
            ")
        );

        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }

    public function getPenjagaanVerifSPJ(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $norec = $request['norec'];



        $data = DB::select(DB::raw("
                select tglverif 
                from strukrealisasi_t
                where norec = '$norec'
            ")
        );

        $result = array(
            'detail' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }

    public function getTahapKegiatan(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $id = $request['id'];
        $data = DB::select(DB::raw("
        select ta.id, ta.tahap FROM
        kegiatananggaran_m ka 
        inner join keteranganbelanja_t kb on kb.objectkegiatanfk = ka.id
        inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk
        where ka.id = $id
        limit 1
        ")
        );

        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }
    public function getJenisBelanja(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $keterangan = $request['kegiatan'];
        $data = DB::select(DB::raw("
        select jb.id, jb.jenisbelanja from
        jenisbelanja_m jb 
        inner join kegiatananggaran_m ka on ka.objectjenisbelanjafk = jb.id
        where ka.keterangan = '$keterangan'
        ")
        );

        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }
    public function getKeteranganBelanja(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $idkegiatanfk= $request['objectkegiatanfk'];
        $data = DB::select(DB::raw("
                select kt.norec	,kt.kdprofile	,kt.statusenabled	,kt.objectkegiatanfk	,kt.objectmataanggaranfk	
                ,kt.keteranganbelanja	,kt.nourut	,kt.jml	,cast(kt.hargasatuan as float) as hargasatuan	 ,cast(kt.subtotal as float) as subtotal	,
                kt.satuan	,kt.objectasalprodukfk,ap.asalproduk ,ma.namamataanggaran,ma.kodemataanggaran
                from keteranganbelanja_t kt
                INNER JOIN asalproduk_m ap on ap.id=kt.objectasalprodukfk
                INNER JOIN mataanggaran_m ma on ma.id=kt.objectmataanggaranfk
                where kt.objectkegiatanfk= $idkegiatanfk
            ")
        );

        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }
    
    public function saveAlokasiKeteranganBelanja(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
       try{
           foreach($request['data'] as $item){

                $MAA = AlokasiKeteranganBelanja::where('keteranganbelanjafk',$item['keteranganbelanjafk'])
                    ->where('bulanint',$item['bulanint'])
                    ->where('kdprofile', $idProfile)
                    ->get();
                if(empty($MAA)){
                    $MA = new AlokasiKeteranganBelanja();
                    $norecKS = $MA->generateNewId();
                    $MA->norec = $norecKS;
                    $MA->kdprofile = $idProfile;
                    $MA->statusenabled = true;
                }else{
                    $MA = AlokasiKeteranganBelanja::where('keteranganbelanjafk',$item['keteranganbelanjafk'])
                    ->where('bulanint',$item['bulanint'])
                    ->where('kdprofile', $idProfile)
                    ->first();
                }
                $MA->keteranganbelanjafk = $item['keteranganbelanjafk'];
                $MA->bulanint = (float)$item['bulanint'];
                $MA->nilai = (float)$item['nilai'];

                $MA->save();
                
           }
            
           $transStatus = 'true';
       } catch (\Exception $e) {
            $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $MA,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'result' => $MA,
                'as' => '@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    
    public function getDataSPJ(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];

        $data = DB::select(DB::raw("
        select string_agg(DISTINCT rd.uraian, ',') uraian, sr.*, cbs.carabayar, sr.tglverif, sr.keterangan, sr.jumlahdibayarverif, ka.tahun,--sr.norealisasi,sr.deskripsi,sr.totalbelanja,
                pg1.namalengkap as bendahara, pg2.namalengkap as penerima, rkn.namarekanan as pihakketiga,
                ka.kode || '~' || ka.keterangan as kegiatan, ma.kodemataanggaran || '~' || ma.namamataanggaran as mataanggaran
                from strukrealisasi_t sr
                INNER JOIN kegiatananggaran_m ka on ka.id=sr.objectkegiatanfk
                INNER JOIN mataanggaran_m ma on ma.id=sr.objectmataanggaranfk
                INNER JOIN rekanan_m rkn on rkn.id=sr.rekananfk
                INNER JOIN pegawai_m as pg1 on pg1.id=sr.bendaharafk
                INNER JOIN pegawai_m as pg2 on pg2.id=sr.penerimafk
				inner join realisasidetail_t rd on rd.strukrealisasifk = sr.norec
                left join carabayarspj_m cbs on cbs.id = sr.objectcarabayarfk
                where sr.tglrealisasi between '$tglAwal' and '$tglAkhir'
                and sr.statusenabled = true
								group by sr.norec, cbs.carabayar, sr.tglverif, sr.keterangan, sr.jumlahdibayarverif, sr.kdprofile, sr.statusenabled, sr.tglrealisasi, sr.norealisasi, sr.status, sr.totalbelanja, sr.objectcarabayarfk, sr.rekananfk, sr.deskripsi, sr.objectkegiatanfk, sr.objectmataanggaranfk, sr.bendaharafk, sr.penerimafk, sr.pph, sr.ppn, pg1.namalengkap, pg2.namalengkap, rkn.namarekanan ,
                ka.kode || '~' || ka.keterangan, ma.kodemataanggaran || '~' || ma.namamataanggaran, ka.tahun
            ")
        );
        $result = [];
        $strukrealisasifk ='';
        foreach($data as $item){
            $strukrealisasifk= $item->norec;
            $dataDetail = DB::select(DB::raw("
                    select sr.*,ka.keteranganbelanja,0 as nourut
                    from realisasidetail_t sr
                    INNER JOIN keteranganbelanja_t ka on ka.norec=sr.keteranganbelanjafk
                    where sr.strukrealisasifk = '$strukrealisasifk'
                ")
            );
            $result[] = array(
                'strukrealisasifk' => $strukrealisasifk,
                'data' => $dataDetail,
            );
        };


        $result = array(
            'data' => $data,
            'detail' => $result,
            'message' => '@epic',
        );

        return $this->respond($result);
    }

    public function getDataSPM(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $nospp = $request['nospp'];

        $data = DB::select(DB::raw("
        select spm.*, spp.nospp FROM
            spp_t spp
            inner join spm_t spm on spm.objectsppfk = spp.norec
            where spp.nospp = '$nospp'
            ")
        );

        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }

    public function getJenisAnggaran(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $id = $request['id'];

        $data = DB::select(DB::raw("
                select ja.id, ja.jenisanggaran
                from mataanggaran_m ma
                INNER JOIN jenisanggaran_m ja on ja.id=ma.objectjenisanggaranfk
                where ma.id = $id 
            ")
        );


        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }
    
    public function getCetakSPJ(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $norec = $request['norec'];

        $kegiatan = DB::select(DB::raw("
            select km.keterangan ktsubsub, km.kode kodesubsub, km.tahun, km.div divsubsub, kg.keterangan ktsub, kg.kode kodesub, kg.div divsub
            from strukrealisasi_t sr
            inner join realisasidetail_t rd on rd.strukrealisasifk =sr.norec
            inner join keteranganbelanja_t kb on kb.norec = rd.keteranganbelanjafk
            inner join kegiatananggaran_m km on km.id = kb.objectkegiatanfk
            left join kegiatananggaran_m kg on km.kode ilike '%' || kg.kode || '%' and kg.div = 3
            inner join mataanggaran_m ma on ma.id = sr.objectmataanggaranfk
            where sr.norec = '$norec'
            group by km.keterangan, km.kode, km.tahun, km.div, kg.keterangan, kg.kode, kg.div;
            ")
        );

        $keterangan = DB::select(DB::raw("select kb.keteranganbelanja
        from strukrealisasi_t sr
        inner join realisasidetail_t rd on rd.strukrealisasifk =sr.norec
        inner join keteranganbelanja_t kb on kb.norec = rd.keteranganbelanjafk
        inner join kegiatananggaran_m km on km.id = kb.objectkegiatanfk
        left join kegiatananggaran_m kg on km.kode ilike '%' || kg.kode || '%' and kg.div = 3
        inner join mataanggaran_m ma on ma.id = sr.objectmataanggaranfk
        where sr.norec = '$norec'
        group by kb.keteranganbelanja;"));

        $mataanggaran = DB::select(DB::raw("select ma.namamataanggaran, ma.kodemataanggaran
        from strukrealisasi_t sr
        inner join realisasidetail_t rd on rd.strukrealisasifk =sr.norec
        inner join keteranganbelanja_t kb on kb.norec = rd.keteranganbelanjafk
        inner join kegiatananggaran_m km on km.id = kb.objectkegiatanfk
        left join kegiatananggaran_m kg on km.kode ilike '%' || kg.kode || '%' and kg.div = 3
        inner join mataanggaran_m ma on ma.id = sr.objectmataanggaranfk
        where sr.norec = '$norec'
        group by ma.namamataanggaran, ma.kodemataanggaran;"));

        $spj = DB::select(DB::raw("select 
        sr.pph, sr.ppn
        from strukrealisasi_t sr
        inner join realisasidetail_t rd on rd.strukrealisasifk =sr.norec
        inner join keteranganbelanja_t kb on kb.norec = rd.keteranganbelanjafk
        inner join kegiatananggaran_m km on km.id = kb.objectkegiatanfk
        left join kegiatananggaran_m kg on km.kode ilike '%' || kg.kode || '%' and kg.div = 3
        inner join mataanggaran_m ma on ma.id = sr.objectmataanggaranfk
        where sr.norec = '$norec'
        group by sr.pph, sr.ppn;"));

        $detail = DB::select(DB::raw("select rd.uraian, rd.jml, rd.satuan, rd.harga, rd.subtotal
        from strukrealisasi_t sr
        inner join realisasidetail_t rd on rd.strukrealisasifk =sr.norec
        inner join keteranganbelanja_t kb on kb.norec = rd.keteranganbelanjafk
        inner join kegiatananggaran_m km on km.id = kb.objectkegiatanfk
        left join kegiatananggaran_m kg on km.kode ilike '%' || kg.kode || '%' and kg.div = 3
        inner join mataanggaran_m ma on ma.id = sr.objectmataanggaranfk
        where sr.norec = '$norec'
        group by rd.uraian, rd.jml, rd.satuan, rd.harga, rd.subtotal;"));



        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }
    
    public function saveRealisasiSPJ(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataRealisasiDetail = [];
       try{

        $KM= MataAnggaran::where('kodemataanggaran',$request['objectmataanggaranfk'])
                    ->first();

            if ($request['norec']==''){
                $MA = new StrukRealisasi();
                $norecKS = $MA->generateNewId();
                $MA->norec = $norecKS;
                $MA->kdprofile = $idProfile;
                $MA->statusenabled = true;
                $noRealiasi = $this->generateCodeBySeqTable(new StrukRealisasi, 'norealisasi', 12, 'SPJ' . $this->getDateTime()->format('ym') . '/', $idProfile);
                $MA->norealisasi = $noRealiasi;

            }else{
                $MA= StrukRealisasi::where('norec',$request['norec'])
                    ->where('kdprofile', $idProfile)
                    ->first();
            }
            $MA->tglrealisasi = $request['tglrealisasi'];
            $MA->status = null;//$request['status'];
            $MA->totalbelanja = $request['totalbelanja'];
            $MA->rekananfk = $request['rekananfk'];
            $MA->deskripsi = $request['deskripsi'];
            $MA->objectkegiatanfk = $request['objectkegiatanfk'];
            $MA->objectmataanggaranfk = $KM->id;
            $MA->objectcarabayarfk = $request['objectcarabayarfk'];
            $MA->bendaharafk = $request['bendaharafk'];
            $MA->penerimafk = $request['penerimafk'];
            $MA->pph = (float)$request['pph'];
            $MA->ppn = (float)$request['ppn'];
            $MA->save();

            $norecStrukRealisasiJangInsertTableDetailNa = $MA->norec;

            $dataRealisasiDetail = $request['realisasidetail'];
            foreach($dataRealisasiDetail as $item){
                if(empty($item['norec'])){
                    $DT = new RealisasiDetail();
                    $norecDT = $DT->generateNewId();
                    $DT->norec = $norecDT;
                    $DT->kdprofile = $idProfile;
                    $DT->statusenabled = true;
                    $DT->strukrealisasifk = $norecStrukRealisasiJangInsertTableDetailNa;
                    $DT->uraian = $item['uraian'];
                    $DT->jml = $item['jml'];
                    $DT->satuan = $item['satuan'];
                    $DT->harga = $item['harga'];
                    $DT->subtotal = $item['subtotal'];
                    $DT->keteranganbelanjafk = $item['keteranganbelanjafk'];
                    $DT->save();
                } 
                
            }
           $transStatus = 'true';
       } catch (\Exception $e) {
            $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $MA,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'line'=> $e->getLine(),
                'message'=> $e->getMessage(),
                'result' => $MA,
                'as' => '@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function savePanjar(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        try{
            
            $MA = new Panjar();
            $norecKS = $MA->generateNewId();
            $MA->norec = $norecKS;
            $MA->kdprofile = $idProfile;
            $MA->statusenabled = true;
            $noPanjar = $this->generateCodeBySeqTable(new Panjar, 'nopanjar', 12, 'P' . $this->getDateTime()->format('ym') . '/', $idProfile);
            $MA->nopanjar = $noPanjar;
            $MA->tglpanjar = $request['tglPanjar'];
            $MA->uraian = $request['uraianPanjar'];
            $MA->jumlah = $request['jumlahpanjar'];
            $MA->jenispanjar = 'Pengeluaran';
            $MA->sumberpanjar = $request['sumberPanjar'];
            $MA->save();
           $transStatus = 'true';
       } catch (\Exception $e) {
            $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $MA,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'line'=> $e->getLine(),
                'message'=> $e->getMessage(),
                'result' => $MA,
                'as' => '@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
}