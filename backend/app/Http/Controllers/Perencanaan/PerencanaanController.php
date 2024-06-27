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
use App\Master\Rekanan;
use App\Transaksi\AntrianPasienDiperiksa;
use App\Transaksi\MataAnggaran;
use App\Transaksi\PasienDaftar;
use App\Transaksi\PelayananPasien;
use App\Transaksi\PelayananPasienDetail;
use App\Transaksi\PelayananPasienPetugas;
use App\Transaksi\RiwayatRealisasi;
use App\Transaksi\StrukPelayananDetail;
use App\Transaksi\StrukRealisasi;
use App\Transaksi\StrukVerifikasi;
use App\Transaksi\StrukVerifikasiAnggaran;
use App\Transaksi\Panjar;
use App\Transaksi\Permen;
use App\Transaksi\Pengembalian;
use App\Transaksi\BKU;
use Illuminate\Http\Request;
use DB;
use App\Transaksi\SeqNumber;

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
use App\Transaksi\LPJ;
use App\Transaksi\PemungutanPajak;
use App\Transaksi\PenyetoranPajak;
use App\Transaksi\JasaGiro;
use App\Transaksi\SPJtoPanjar;
use App\Transaksi\STSKeuangan;
use App\Transaksi\Retur;
use App\Transaksi\Jurnal;
use App\Transaksi\Telemedicine;
use App\Transaksi\LockSPJ;
use App\Master\AsalProduk;
use App\Transaksi\UraianPendapatan;
use phpDocumentor\Reflection\Types\Null_;
use phpDocumentor\Reflection\Types\Parent_;
use Webpatser\Uuid\Uuid;
use App\Master\RunningNumber;
use App\Transaksi\StrukPelayanan;

use App\Transaksi\StrukPerencanaan;
use App\Transaksi\StrukPerencanaanDetail;

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
            ->JOIN ('kelompokanggarsanketiga_m as k3','k3.id','=','rk.objectchildketigafk')
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
        $idpeg = $request['idpegawai'];
        $searchbuatpptkanggaran = '';
        $pegawai = '';
        $listsubkegiatan = [];
        $listsubsubkegiatan = [];
        $lisssss = '';
        $lisssssssssss = '';

        $ispj = false;
        $cariPegawai = null;
        if(isset($request['idpegawai']) && $request['idpegawai'] !== '' && $request['idpegawai'] !== "undefined"){
            $cariPegawai = DB::table('pegawai_m')
                ->where('statusenabled', true)
                ->where('id', $request['idpegawai'])
                ->first();
            
            if($cariPegawai){
                $ispj = $cariPegawai->ispj;
            }
        }


        $setting = \DB::table('settinganggaran_t as st')
            ->join('pegawai_m as pg','pg.id','=','st.objectkepalabludfk')
            ->join('tahapanggaran_m as ta','ta.id','=','st.objecttahapaktivfk')
            ->select('st.*','pg.namalengkap', 'ta.tahap', 'ta.id as idtahap', 'pg.id as idpegawai')
            ->where('st.kdprofile', $idProfile)
            ->where('st.statusenabled', true)
            ->orderBy('st.tahunanggaran')
            ->get();
        if (isset($request['idpegawai']) && $request['idpegawai'] != "" && $request['idpegawai'] != "undefined") {
            $pegawai = 'and dp.objectpptkfk = '.$idpeg;
            foreach ($setting as $st) {
                $ddddd = DB::select(DB::raw("
            select ka1.id as idsubkegiatan, ka1.kode as kodesubkegiatan, ka.id as idsubsubkegiatan, ka.kode as kodesubsubkegiatan from kegiatananggaran_m ka 
            inner join kegiatananggaran_m ka1 on ka.kode ilike ka1.kode || '%' and ka1.div= 3 and ka.statusenabled = true
            where ka.objectpptkfk = $idpeg and ka.tahun ='$st->tahunanggaran'
            "));
            }
            
            $listsubkegiatan = [];
            $listsubsubkegiatan = [];
            foreach ($ddddd as $ddd) {
                $listsubkegiatan[] = $ddd->idsubkegiatan;
                if(isset($request['subsubkegiatan']) && $ddd->kodesubkegiatan == $request['subsubkegiatan']){
                    $listsubsubkegiatan[] = $ddd->idsubsubkegiatan;  
                }  
            }
            $lisssss = join(', ', $listsubkegiatan);
            $lisssssssssss = join(', ', $listsubsubkegiatan);
        }

        $dv = '';
        $thdv = '';
        if (isset($request['div']) && $request['div'] != "" && $request['div'] != "undefined" && $request['div'] == 4) {
            $dv = 'and dp.div = '.$request['div'];
            $thdv = ' and kb.objecttahapfk is not null';
        } else if (isset($request['div']) && $request['div'] != "" && $request['div'] != "undefined" && $request['div'] != 4) {
            $dv = 'and dp.div = '.$request['div'];
        } 

        $tn = '';
        if (isset($tahunanggaran) && $tahunanggaran!= "" && $tahunanggaran!= "undefined") {
            $tn = "and dp.tahun = '$tahunanggaran'";
        }

        $thp = '';
        if (isset($request['tahapaktif']) && $request['tahapaktif'] != "" && $request['tahapaktif'] != "undefined" && $request['tahapaktif'] != 100) {
            $thp = 'and kb.objecttahapfk = '.$request['tahapaktif'];
            $kegiatan = DB::select(DB::raw("select dp.objectjenisbelanjafk, jb.jenisbelanja, dp.objectpptkfk, dp.islockrba, ta.tahap, kb.objecttahapfk, dp.norec, dp0.kode kodesubkegiatan, dp0.keterangan keterangansubkegiatan,
                dp3.kode kodekegiatan, dp3.keterangan keterangankegiatan,
                dp2.kode kodeprogram, dp2.keterangan keteranganprogram,
                dp1.kode kodeurusan, dp1.keterangan keteranganurusan, 
                dp.indikatormasuk, dp.indikatorkeluaran, dp.indikatorhasil, dp.targetmasuk, dp.targetkeluaran, dp.targethasil, 
                            coalesce(sum(kb.subtotal),0) as targetmasuk,dp.id, dp.tahun, dp.kode, dp.keterangan, dp.div, kp.namakelompok, pg.namalengkap, cast(split_part(dp.kode, '.', 1) as int4) as subkodeawal
                            , cast(split_part(dp.kode, '.', 2) as int4) as subkodekedua
                            , case when split_part(dp.kode, '.', 3) = '' then '0' else split_part(dp.kode, '.', 3)::int4 end as subkodeketiga
                            , case when split_part(dp.kode, '.', 4) = '' then '0' else split_part(dp.kode, '.', 4)::int4 end as subkodekeempat
                            , case when split_part(dp.kode, '.', 5) = '' then '0' else split_part(dp.kode, '.', 5)::int4 end as subkodekelima
                            , case when split_part(dp.kode, '.', 6) = '' then '0' else split_part(dp.kode, '.', 6)::int4 end as subkodekeenam
                            , case when split_part(dp.kode, '.', 7) = '' then '0' else split_part(dp.kode, '.', 7)::int4 end as subkodeakhir 
                            from kegiatananggaran_m as dp 
                            left join keteranganbelanja_t as kb on kb.objectkegiatanfk = dp.id
                            and kb.kdprofile = 30 and kb.statusenabled = true 
                            left join kegiatananggaran_m as dp3 on dp.kode ilike dp3.kode || '%' and dp3.div = 2
                            and dp3.kdprofile = 30 and dp3.statusenabled = true 
                            left join kegiatananggaran_m as dp2 on dp3.kode ilike dp2.kode || '%' and dp2.div = 1
                            and dp2.kdprofile = 30 and dp2.statusenabled = true 
                            left join kegiatananggaran_m as dp1 on dp2.kode ilike dp1.kode || '%' and dp1.div = 0
                            and dp1.kdprofile = 30 and dp1.statusenabled = true 
                            left join kegiatananggaran_m as dp0 on dp.kode ilike dp0.kode || '%' and dp0.div = 3
                            and dp0.kdprofile = 30 and dp0.statusenabled = true 
                            left join kelompokanggaran_m as kp on kp.id = dp.div 
                            left join pegawai_m as pg on pg.id = dp.objectpptkfk 
                            left join tahapanggaran_m ta on ta.id = kb.objecttahapfk
                            left join jenisbelanja_m jb on jb.id = dp.objectjenisbelanjafk
                            where dp.kdprofile = 30 and dp.statusenabled = true 
                            and kb.kdprofile = 30 and kb.statusenabled = true 
                            $pegawai
                            $thp
                            $dv
                            $thdv
                            $tn
                            group by dp.objectjenisbelanjafk, jb.jenisbelanja, dp.objectpptkfk, ta.tahap, kb.objecttahapfk, dp.norec, dp0.kode, dp0.keterangan, dp3.kode, dp3.keterangan, dp2.kode, dp2.keterangan, dp1.kode, dp1.keterangan, 
                            dp.indikatormasuk, dp.indikatorkeluaran, dp.indikatorhasil, dp.targetmasuk, dp.targetkeluaran, dp.targethasil, dp.id, dp.kode, dp.div, dp.tahun, dp.keterangan, kp.namakelompok, pg.namalengkap, cast(split_part(dp.kode, '.', 1) as int4)
                            , cast(split_part(dp.kode, '.', 2) as int4)
                            , case when split_part(dp.kode, '.', 3) = '' then '0' else split_part(dp.kode, '.', 3)::int4 end
                            , case when split_part(dp.kode, '.', 4) = '' then '0' else split_part(dp.kode, '.', 4)::int4 end
                            , case when split_part(dp.kode, '.', 5) = '' then '0' else split_part(dp.kode, '.', 5)::int4 end
                            , case when split_part(dp.kode, '.', 6) = '' then '0' else split_part(dp.kode, '.', 6)::int4 end
                            , case when split_part(dp.kode, '.', 7) = '' then '0' else split_part(dp.kode, '.', 7)::int4 end order by subkodeawal asc, subkodekedua asc, subkodeketiga asc, subkodekeempat asc, subkodekelima asc, subkodekeenam asc, subkodeakhir asc"));
        } else if (isset($request['tahapaktif']) && $request['tahapaktif'] != "" && $request['tahapaktif'] != "undefined" && $request['tahapaktif'] == 100) {
            $kegiatan = DB::select(DB::raw("select dp.objectjenisbelanjafk, jb.jenisbelanja, dp.objectpptkfk, dp.islockrba, ta.tahap, kb.objecttahapfk, dp.norec, dp0.kode kodesubkegiatan, dp0.keterangan keterangansubkegiatan,
                dp3.kode kodekegiatan, dp3.keterangan keterangankegiatan,
                dp2.kode kodeprogram, dp2.keterangan keteranganprogram,
                dp1.kode kodeurusan, dp1.keterangan keteranganurusan, 
                dp.indikatormasuk, dp.indikatorkeluaran, dp.indikatorhasil, dp.targetmasuk, dp.targetkeluaran, dp.targethasil, 
                coalesce(sum(kb.subtotal),0) as targetmasuk,dp.id, dp.tahun, dp.kode, dp.keterangan, dp.div, kp.namakelompok, pg.namalengkap, cast(split_part(dp.kode, '.', 1) as int4) as subkodeawal
                            , cast(split_part(dp.kode, '.', 2) as int4) as subkodekedua
                            , case when split_part(dp.kode, '.', 3) = '' then '0' else split_part(dp.kode, '.', 3)::int4 end as subkodeketiga
                            , case when split_part(dp.kode, '.', 4) = '' then '0' else split_part(dp.kode, '.', 4)::int4 end as subkodekeempat
                            , case when split_part(dp.kode, '.', 5) = '' then '0' else split_part(dp.kode, '.', 5)::int4 end as subkodekelima
                            , case when split_part(dp.kode, '.', 6) = '' then '0' else split_part(dp.kode, '.', 6)::int4 end as subkodekeenam
                            , case when split_part(dp.kode, '.', 7) = '' then '0' else split_part(dp.kode, '.', 7)::int4 end as subkodeakhir 
                            from kegiatananggaran_m as dp 
                            left join keteranganbelanja_t as kb on kb.objectkegiatanfk = dp.id
                            and kb.kdprofile = 30 and kb.statusenabled = true 
                            $thdv
                            left join kegiatananggaran_m as dp3 on dp.kode ilike dp3.kode || '%' and dp3.div = 2
                            and dp3.kdprofile = 30 and dp3.statusenabled = true 
                            left join kegiatananggaran_m as dp2 on dp3.kode ilike dp2.kode || '%' and dp2.div = 1
                            and dp2.kdprofile = 30 and dp2.statusenabled = true 
                            left join kegiatananggaran_m as dp1 on dp2.kode ilike dp1.kode || '%' and dp1.div = 0
                            and dp1.kdprofile = 30 and dp1.statusenabled = true 
                            left join kegiatananggaran_m as dp0 on dp.kode ilike dp0.kode || '%' and dp0.div = 3
                            and dp0.kdprofile = 30 and dp0.statusenabled = true 
                            left join kelompokanggaran_m as kp on kp.id = dp.div 
                            left join pegawai_m as pg on pg.id = dp.objectpptkfk 
                            left join tahapanggaran_m ta on ta.id = kb.objecttahapfk
                            left join jenisbelanja_m jb on jb.id = dp.objectjenisbelanjafk
                            where dp.kdprofile = 30 and dp.statusenabled = true 
                            $pegawai
                            $dv
                            $tn
                            group by dp.objectjenisbelanjafk, jb.jenisbelanja, dp.objectpptkfk, ta.tahap, kb.objecttahapfk, dp.norec, dp0.kode, dp0.keterangan, dp3.kode, dp3.keterangan, dp2.kode, dp2.keterangan, dp1.kode, dp1.keterangan, 
                            dp.indikatormasuk, dp.indikatorkeluaran, dp.indikatorhasil, dp.targetmasuk, dp.targetkeluaran, dp.targethasil, dp.id, dp.kode, dp.div, dp.tahun, dp.keterangan, kp.namakelompok, pg.namalengkap, cast(split_part(dp.kode, '.', 1) as int4)
                            , cast(split_part(dp.kode, '.', 2) as int4)
                            , case when split_part(dp.kode, '.', 3) = '' then '0' else split_part(dp.kode, '.', 3)::int4 end
                            , case when split_part(dp.kode, '.', 4) = '' then '0' else split_part(dp.kode, '.', 4)::int4 end
                            , case when split_part(dp.kode, '.', 5) = '' then '0' else split_part(dp.kode, '.', 5)::int4 end
                            , case when split_part(dp.kode, '.', 6) = '' then '0' else split_part(dp.kode, '.', 6)::int4 end
                            , case when split_part(dp.kode, '.', 7) = '' then '0' else split_part(dp.kode, '.', 7)::int4 end order by subkodeawal asc, subkodekedua asc, subkodeketiga asc, subkodekeempat asc, subkodekelima asc, subkodekeenam asc, subkodeakhir asc"));
        } else{
            $kegiatan = DB::select(DB::raw("select dp.objectjenisbelanjafk, jb.jenisbelanja, dp.objectpptkfk, dp.islockrba, ta.tahap, kb.objecttahapfk, dp.norec, dp0.kode kodesubkegiatan, dp0.keterangan keterangansubkegiatan,
                dp3.kode kodekegiatan, dp3.keterangan keterangankegiatan,
                dp2.kode kodeprogram, dp2.keterangan keteranganprogram,
                dp1.kode kodeurusan, dp1.keterangan keteranganurusan, 
                dp.indikatormasuk, dp.indikatorkeluaran, dp.indikatorhasil, dp.targetmasuk, dp.targetkeluaran, dp.targethasil, 
                            coalesce(sum(kb.subtotal),0) as targetmasuk,dp.id, dp.tahun, dp.kode, dp.keterangan, dp.div, kp.namakelompok, pg.namalengkap, cast(split_part(dp.kode, '.', 1) as int4) as subkodeawal
                            , cast(split_part(dp.kode, '.', 2) as int4) as subkodekedua
                            , case when split_part(dp.kode, '.', 3) = '' then '0' else split_part(dp.kode, '.', 3)::int4 end as subkodeketiga
                            , case when split_part(dp.kode, '.', 4) = '' then '0' else split_part(dp.kode, '.', 4)::int4 end as subkodekeempat
                            , case when split_part(dp.kode, '.', 5) = '' then '0' else split_part(dp.kode, '.', 5)::int4 end as subkodekelima
                            , case when split_part(dp.kode, '.', 6) = '' then '0' else split_part(dp.kode, '.', 6)::int4 end as subkodekeenam
                            , case when split_part(dp.kode, '.', 7) = '' then '0' else split_part(dp.kode, '.', 7)::int4 end as subkodeakhir 
                            from kegiatananggaran_m as dp 
                            left join keteranganbelanja_t as kb on kb.objectkegiatanfk = dp.id 
                            and kb.kdprofile = 30 and kb.statusenabled = true 
                            left join kegiatananggaran_m as dp3 on dp.kode ilike dp3.kode || '%' and dp3.div = 2
                            and dp3.kdprofile = 30 and dp3.statusenabled = true 
                            left join kegiatananggaran_m as dp2 on dp3.kode ilike dp2.kode || '%' and dp2.div = 1
                            and dp2.kdprofile = 30 and dp2.statusenabled = true 
                            left join kegiatananggaran_m as dp1 on dp2.kode ilike dp1.kode || '%' and dp1.div = 0
                            and dp1.kdprofile = 30 and dp1.statusenabled = true 
                            left join kegiatananggaran_m as dp0 on dp.kode ilike dp0.kode || '%' and dp0.div = 3
                            and dp0.kdprofile = 30 and dp0.statusenabled = true 
                            left join kelompokanggaran_m as kp on kp.id = dp.div 
                            left join pegawai_m as pg on pg.id = dp.objectpptkfk 
                            left join tahapanggaran_m ta on ta.id = kb.objecttahapfk
                            left join jenisbelanja_m jb on jb.id = dp.objectjenisbelanjafk
                            where dp.kdprofile = 30 and dp.statusenabled = true 
                            $dv
                            $thdv
                            $tn
                            group by dp.objectjenisbelanjafk, jb.jenisbelanja, dp.objectpptkfk, ta.tahap, kb.objecttahapfk, dp.norec, dp0.kode, dp0.keterangan, dp3.kode, dp3.keterangan, dp2.kode, dp2.keterangan, dp1.kode, dp1.keterangan, 
                            dp.indikatormasuk, dp.indikatorkeluaran, dp.indikatorhasil, dp.targetmasuk, dp.targetkeluaran, dp.targethasil, dp.id, dp.kode, dp.div, dp.tahun, dp.keterangan, kp.namakelompok, pg.namalengkap, cast(split_part(dp.kode, '.', 1) as int4)
                            , cast(split_part(dp.kode, '.', 2) as int4)
                            , case when split_part(dp.kode, '.', 3) = '' then '0' else split_part(dp.kode, '.', 3)::int4 end
                            , case when split_part(dp.kode, '.', 4) = '' then '0' else split_part(dp.kode, '.', 4)::int4 end
                            , case when split_part(dp.kode, '.', 5) = '' then '0' else split_part(dp.kode, '.', 5)::int4 end
                            , case when split_part(dp.kode, '.', 6) = '' then '0' else split_part(dp.kode, '.', 6)::int4 end
                            , case when split_part(dp.kode, '.', 7) = '' then '0' else split_part(dp.kode, '.', 7)::int4 end order by subkodeawal asc, subkodekedua asc, subkodeketiga asc, subkodekeempat asc, subkodekelima asc, subkodekeenam asc, subkodeakhir asc"));
        }
        
        $ktahun = '';
        if (isset($request['tahunawal']) && $request['tahunawal'] != "" && $request['tahunawal'] != "undefined") {
            $ktahun =  "and dp.tahun = '".$request['tahunawal']."'";
        }

        $ksubkegiatan = '';
        if (isset($request['subkegiatan']) && $request['subkegiatan'] != "" && $request['subkegiatan'] != "undefined") {
            $ksubkegiatan =  "and dp2.id = '".$request['subkegiatan']."'";
        }

        $ktahap = '';
        if (isset($request['tahap']) && $request['tahap'] != "" && $request['tahap'] != "undefined") {
            $ktahap =  "and ktb.objecttahapfk = ".$request['tahap'];
        }

        // $pptk = '';
        // if (isset($request['objectpptkfk']) && $request['objectpptkfk'] != "" && $request['objectpptkfk'] != "undefined") {
        //     $pptk =  "and dp.objectpptkfk = ".$request['objectpptkfk'];
        // }

        $pptk = '';
        if($ispj == true && $cariPegawai){
            $pptk = "and dp.objectpptkfk=".$cariPegawai->id;
        }

        $kegiatansubsub = DB::select(DB::raw("select dp.headfk, dp.idrelasi, dp.tahun tahunsubsubkegiatan, dp.id idsubsubkegiatan, dp.kode kodesubsubkegiatan, dp.id || '-' || dp.keterangan keterangansubsubkegiatan,
        dp.indikatormasuk, dp.indikatorkeluaran, dp.indikatorhasil, dp.targetmasuk, dp.targetkeluaran, dp.targethasil, dp.div,
        dp.objectjenisbelanjafk, dp.objectpptkfk, dp.id, dp.keterangan
        from kegiatananggaran_m as dp
        inner join kegiatananggaran_m as dp2 on dp.kode ilike dp2.kode || '%'
        inner join keteranganbelanja_t as ktb on ktb.objectkegiatanfk = dp.id
        where dp.kdprofile = $idProfile
        and dp.statusenabled = true
        and dp2.kdprofile = $idProfile 
        and dp2.statusenabled = true 
        and ktb.kdprofile = $idProfile
        and ktb.statusenabled = true
        and dp.div = 4
        and dp2.div = 3
        $ktahap
        $ktahun
        $ksubkegiatan
        $pptk
        group by dp.id, dp.kode, dp.id || '-' || dp.keterangan, dp.tahun, dp.indikatormasuk, dp.indikatorkeluaran, dp.indikatorhasil, dp.targetmasuk, dp.targetkeluaran, dp.targethasil, dp.div,
        dp.objectjenisbelanjafk, dp.objectpptkfk, dp.id, dp.keterangan
        order by dp.kode"));

        $subsubkegiatanangkas = \DB::table('kegiatananggaran_m as dp')
            ->select('dp.id', 'dp.kode', 'dp.keterangan', 'dp.norec')
            ->where('dp.kdprofile', $idProfile)
            ->where('dp.statusenabled', true)
            ->where('dp.div', 4)
            ->orderBy('dp.kode')
            ->get();
        
        $subkegiatantransfer = \DB::table('kegiatananggaran_m as dp')
            ->select('dp.id', 'dp.kode', 'dp.keterangan', 'dp.norec')
            ->where('dp.kdprofile', $idProfile)
            ->where('dp.statusenabled', true)
            ->where('dp.div', 3)
            ->orderBy('dp.kode')
            ->get();
        $kegiatansubsubcombo = \DB::table('kegiatananggaran_m as dp')
            ->select('dp.id', 'dp.kode', 'dp.keterangan')
            ->where('dp.kdprofile', $idProfile)
            ->where('dp.tahun', $tahunanggaran)
            ->where('dp.statusenabled', true)
            ->where('dp.div', 4)
            ->where('dp.kode', 'ilike', "%".$subsubkegiatan."%")->orderBy('dp.kode')->distinct();
            if(isset($request['tahap'])){
                $kegiatansubsubcombo = $kegiatansubsubcombo->join('keteranganbelanja_t as kb','kb.objectkegiatanfk','=','dp.id')
                ->where('kb.objecttahapfk', $tahap);
            }
            if($lisssssssssss != ''){
                $kegiatansubsubcombo = $kegiatansubsubcombo->whereIn('dp.id', $listsubsubkegiatan)->get();
            } else{
            $kegiatansubsubcombo = $kegiatansubsubcombo->get();
            }


        $kegiatancombo = \DB::table('kegiatananggaran_m as dp')
            ->select('dp.id', 'dp.kode', 'dp.keterangan')
            ->where('dp.kdprofile', $idProfile)
            ->where('dp.statusenabled', true)
            ->where('dp.div', 3)
            ->orderBy('dp.kode');
        if($lisssss != ''){
            $kegiatancombo = $kegiatancombo->whereIn('dp.id', $listsubkegiatan)->get();
        } else{
            $kegiatancombo = $kegiatancombo->get();
        }
            // ->get();

        $carabayarcombo = \DB::table('carabayarspj_m as cbs')
            ->select('cbs.id', 'cbs.carabayar')
            ->where('cbs.kdprofile', $idProfile)
            ->where('cbs.statusenabled', true)
            ->get();

        $mataanggarancombo = DB::select(DB::raw("select cbs.id, cbs.kodemataanggaran, cbs.namamataanggaran, cbs.kodemataanggaran || ' - ' || cbs.namamataanggaran as text
        , split_part(cbs.kodemataanggaran, '.', 1) as subkodepertama
        , split_part(cbs.kodemataanggaran, '.', 2) as subkodekedua
        , case when split_part(cbs.kodemataanggaran, '.', 3) = '' then '0' else split_part(cbs.kodemataanggaran, '.', 3)::int4 end as subkodeketiga
        , case when split_part(cbs.kodemataanggaran, '.', 4) = '' then '0' else split_part(cbs.kodemataanggaran, '.', 4)::int4 end as subkodekeempat
        , case when split_part(cbs.kodemataanggaran, '.', 5) = '' then '0' else split_part(cbs.kodemataanggaran, '.', 5)::int4 end as subkodekelima
        from mataanggaran_m as cbs
        where cbs.kdprofile = $idProfile
        and cbs.statusenabled = true
        order by subkodepertama asc, subkodekedua asc, subkodeketiga asc, subkodekeempat asc, subkodekelima asc ;"));

        

        $mataanggarancombodiv = DB::select(DB::raw("select cbs.id, cbs.kodemataanggaran, cbs.namamataanggaran, cbs.kodemataanggaran || ' - ' || cbs.namamataanggaran as text
        , split_part(cbs.kodemataanggaran, '.', 1) as subkodepertama
        , split_part(cbs.kodemataanggaran, '.', 2) as subkodekedua
        , case when split_part(cbs.kodemataanggaran, '.', 3) = '' then '0' else split_part(cbs.kodemataanggaran, '.', 3)::int4 end as subkodeketiga
        , case when split_part(cbs.kodemataanggaran, '.', 4) = '' then '0' else split_part(cbs.kodemataanggaran, '.', 4)::int4 end as subkodekeempat
        , case when split_part(cbs.kodemataanggaran, '.', 5) = '' then '0' else split_part(cbs.kodemataanggaran, '.', 5)::int4 end as subkodekelima
        from mataanggaran_m as cbs
        where cbs.kdprofile = $idProfile
        and cbs.statusenabled = true
        and length(cbs.kodemataanggaran) in (9,10)
        order by subkodepertama asc, subkodekedua asc, subkodeketiga asc, subkodekeempat asc, subkodekelima asc ;"));

        
        
        $direktur = \DB::table('pegawai_m as pg')
            ->select('pg.namalengkap', 'pg.id')
            ->where('pg.kdprofile', $idProfile)
            ->where('pg.statusenabled', true)
            ->where('pg.grade', 1)
            ->orderBy('pg.namalengkap')
            ->get();
        $bendahara = \DB::table('pegawai_m as pg')
            ->select('pg.namalengkap as text', 'pg.id as value')
            ->where('pg.kdprofile', $idProfile)
            ->where('pg.statusenabled', true)
            ->where('pg.objectjabatanfungsionalfk', 1426)
            ->orderBy('pg.namalengkap')
            ->get();

        $tahap = \DB::table('tahapanggaran_m as th')
            ->select('th.tahap', 'th.id')
            ->where('th.kdprofile', $idProfile)
            ->where('th.statusenabled', true)
            ->orderBy('th.id')
            ->get();

        if(!empty($idsubsub) && $idsubsub != "undefined" && $idsubsub != ''){
            $mataanggarancombo = DB::select(DB::raw("select ma.id, ma.kodemataanggaran, ma.namamataanggaran,
            ma.kodemataanggaran || ' - ' || ma.namamataanggaran as text
            from keteranganbelanja_t kb
            INNER JOIN mataanggaran_m ma on ma.id=kb.objectmataanggaranfk
            INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
            where kb.kdprofile = 30 and kb.statusenabled = true
            and ka.id = $idsubsub
            and ma.kdprofile = 30 and ma.statusenabled = true
            and ka.kdprofile = 30 and ka.statusenabled = true
            group by ma.id, ma.kodemataanggaran, ma.namamataanggaran, ma.kodemataanggaran || ' - ' || ma.namamataanggaran"));
        } else{
            $mataanggarancombo = DB::select(DB::raw("select cbs.id, cbs.kodemataanggaran, cbs.namamataanggaran, cbs.kodemataanggaran || ' - ' || cbs.namamataanggaran as text
            , split_part(cbs.kodemataanggaran, '.', 1) as subkodepertama
            , split_part(cbs.kodemataanggaran, '.', 2) as subkodekedua
            , case when split_part(cbs.kodemataanggaran, '.', 3) = '' then '0' else split_part(cbs.kodemataanggaran, '.', 3)::int4 end as subkodeketiga
            , case when split_part(cbs.kodemataanggaran, '.', 4) = '' then '0' else split_part(cbs.kodemataanggaran, '.', 4)::int4 end as subkodekeempat
            , case when split_part(cbs.kodemataanggaran, '.', 5) = '' then '0' else split_part(cbs.kodemataanggaran, '.', 5)::int4 end as subkodekelima
                from mataanggaran_m as cbs
                where cbs.kdprofile = $idProfile
                and cbs.statusenabled = true
            order by subkodepertama asc, subkodekedua asc, subkodeketiga asc, subkodekeempat asc, subkodekelima asc ;"));
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

        $kdiv = '';
        if (isset($request['div']) && $request['div'] != "" && $request['div'] != "undefined" && $request['div'] == "1") {
            $kdiv =  "and ma.kodemataanggaran in('I', 'III')";
        } else if (isset($request['div']) && $request['div'] != "" && $request['div'] != "undefined" && $request['div'] == "4") {
            $kdiv =  "and 
            case 
                when ma.kodemataanggaran ilike 'I.%' then length(ma.kodemataanggaran) in (9,10)
                when ma.kodemataanggaran ilike 'III.%' then length(ma.kodemataanggaran) in (9,10)
            end";
        } else if (isset($request['div']) && $request['div'] != "" && $request['div'] != "undefined" && $request['div'] == "2") {
            $kdiv =  "and 
            case 
                when ma.kodemataanggaran ilike 'I.%' then length(ma.kodemataanggaran) in (3)
                when ma.kodemataanggaran ilike 'III.%' then length(ma.kodemataanggaran) in (5)
            end";
        } else if (isset($request['div']) && $request['div'] != "" && $request['div'] != "undefined" && $request['div'] == "3") {
            $kdiv =  "and 
            case 
                when ma.kodemataanggaran ilike 'I.%' then length(ma.kodemataanggaran) in (5)
                when ma.kodemataanggaran ilike 'III.%' then length(ma.kodemataanggaran) in (7)
            end";
        }

        $mata = DB::select(DB::raw("select ma.id, ma.kodemataanggaran,ma.namamataanggaran,map.id idmap, map.mataanggaranpermen, coalesce(sum(kt.subtotal),0) as total
        , split_part(ma.kodemataanggaran, '.', 1) as subkodepertama
        , split_part(ma.kodemataanggaran, '.', 2) as subkodekedua
        , case when split_part(ma.kodemataanggaran, '.', 3) = '' then '0' else split_part(ma.kodemataanggaran, '.', 3)::int4 end as subkodeketiga
        , case when split_part(ma.kodemataanggaran, '.', 4) = '' then '0' else split_part(ma.kodemataanggaran, '.', 4)::int4 end as subkodekeempat
        , case when split_part(ma.kodemataanggaran, '.', 5) = '' then '0' else split_part(ma.kodemataanggaran, '.', 5)::int4 end as subkodekelima
        from mataanggaran_m ma 
        left JOIN mataanggaranpermen_m map on map.id=ma.mataanggaranpermenfk
		left JOIN keteranganbelanja_t kt on kt.objectmataanggaranfk=ma.id
        where ma.statusenabled = true and ma.kdprofile = 30
        $kdiv
        group by ma.id, ma.kodemataanggaran,ma.namamataanggaran,map.id, map.mataanggaranpermen
                , split_part(ma.kodemataanggaran, '.', 1)
                , split_part(ma.kodemataanggaran, '.', 2)
                , case when split_part(ma.kodemataanggaran, '.', 3) = '' then '0' else split_part(ma.kodemataanggaran, '.', 3)::int4 end
                , case when split_part(ma.kodemataanggaran, '.', 4) = '' then '0' else split_part(ma.kodemataanggaran, '.', 4)::int4 end 
                , case when split_part(ma.kodemataanggaran, '.', 5) = '' then '0' else split_part(ma.kodemataanggaran, '.', 5)::int4 end
        order by subkodepertama asc, subkodekedua asc, subkodeketiga asc, subkodekeempat asc, subkodekelima asc ;
        
            ")
        );

        $mataanggaranpermen = DB::select(DB::raw("select map.id, map2.kode || '.' || map3.kode || '.' || map4.kode || '.' || map.kode as kode,
        map.mataanggaranpermen
        from mataanggaranpermen_m map
        inner join mataanggaranpermen_m map4 on map.mataanggaranpermenfk = map4.id and map4.div = 4
        inner join mataanggaranpermen_m map3 on map4.mataanggaranpermenfk = map3.id and map3.div = 3
        inner join mataanggaranpermen_m map2 on map3.mataanggaranpermenfk = map2.id and map2.div = 2
        where map.kdprofile = 30
        and map.statusenabled = true
        and map2.kdprofile = 30
        and map2.statusenabled = true
        and map3.kdprofile = 30
        and map3.statusenabled = true
        and map4.kdprofile = 30
        and map4.statusenabled = true
        and map.div = 5
        
        union ALL
        
        select map4.id, map2.kode || '.' || map3.kode || '.' || map4.kode as kode,
        map4.mataanggaranpermen
        from mataanggaranpermen_m map4 
        inner join mataanggaranpermen_m map3 on map4.mataanggaranpermenfk = map3.id and map3.div = 3
        inner join mataanggaranpermen_m map2 on map3.mataanggaranpermenfk = map2.id and map2.div = 2
        where map2.kdprofile = 30
        and map2.statusenabled = true
        and map3.kdprofile = 30
        and map3.statusenabled = true
        and map4.kdprofile = 30
        and map4.statusenabled = true
        and map4.div = 4
        
        union ALL
        
        select map3.id, map2.kode || '.' || map3.kode as kode,
        map3.mataanggaranpermen
        from mataanggaranpermen_m map3 
        inner join mataanggaranpermen_m map2 on map3.mataanggaranpermenfk = map2.id and map2.div = 2
        where map2.kdprofile = 30
        and map2.statusenabled = true
        and map3.kdprofile = 30
        and map3.statusenabled = true
        and map3.div = 3
        
        union all 
        
        select map2.id, map2.kode as kode,
        map2.mataanggaranpermen
        from mataanggaranpermen_m map2
        where map2.kdprofile = 30
        and map2.statusenabled = true
        and map2.div = 2
        
        order by kode;
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

        $konsolidasi2 = \DB::table('mataanggaranpermen_m')
            ->select('id','mataanggaranpermen', 'kode', 'mataanggaranpermenfk')
            ->where('kdprofile', $idProfile)
            ->where('statusenabled', true)
            ->where('div', 2)
            ->orderBy('id')
            ->get();
        
        if(!empty($request['konsolidasi2'])){
            $konsolidasi3 = \DB::table('mataanggaranpermen_m')
            ->select('id','mataanggaranpermen', 'kode', 'mataanggaranpermenfk')
            ->where('kdprofile', $idProfile)
            ->where('statusenabled', true)
            ->where('div', 3)
            ->where('mataanggaranpermenfk', $request['konsolidasi2'])
            ->orderBy('id')
            ->get();
        }else{
            $konsolidasi3 = [];
        }

        $konso3 =  DB::select(DB::raw("select map3.id, map3.mataanggaranpermen, map3.kode, map3.mataanggaranpermenfk,
            map2.kode || '.' || map3.kode || ' - ' || map3.mataanggaranpermen as text 
            from mataanggaranpermen_m map3
            inner join mataanggaranpermen_m map2 on map3.mataanggaranpermenfk = map2.id and map2.div = 2
            where map2.kdprofile = 30
            and map2.statusenabled = true
            and map3.kdprofile = 30
            and map3.statusenabled = true
            and map3.div = 3
            order by replace(map2.kode, '.', '' )::int4, replace(map3.kode, '.', '' )::int4
        "));
        
        $konsolidasi4 =  DB::select(DB::raw("select map4.id, map4.mataanggaranpermen, map4.kode, map4.mataanggaranpermenfk,
            map2.kode || '.' || map3.kode || '.' || map4.kode || ' - ' || map4.mataanggaranpermen as text 
            from mataanggaranpermen_m map4
            inner join mataanggaranpermen_m map3 on map4.mataanggaranpermenfk = map3.id and map3.div = 3
            inner join mataanggaranpermen_m map2 on map3.mataanggaranpermenfk = map2.id and map2.div = 2
            where map2.kdprofile = 30
            and map2.statusenabled = true
            and map3.kdprofile = 30
            and map3.statusenabled = true
            and map4.kdprofile = 30
            and map4.statusenabled = true
            and map4.div = 4
            order by replace(map2.kode, '.', '' )::int4, replace(map3.kode, '.', '' )::int4, replace(map4.kode, '.', '' )::int4
        "));
        
        $konsolidasi5 =  DB::select(DB::raw("select map.id, map.mataanggaranpermen, map.kode, map.mataanggaranpermenfk,
            map2.kode || '.' || map3.kode || '.' || map4.kode || '.' || map.kode || ' - ' || map.mataanggaranpermen as text 
            from mataanggaranpermen_m map
            inner join mataanggaranpermen_m map4 on map.mataanggaranpermenfk = map4.id and map4.div = 4
            inner join mataanggaranpermen_m map3 on map4.mataanggaranpermenfk = map3.id and map3.div = 3
            inner join mataanggaranpermen_m map2 on map3.mataanggaranpermenfk = map2.id and map2.div = 2
            where map.kdprofile = 30
            and map.statusenabled = true
            and map2.kdprofile = 30
            and map2.statusenabled = true
            and map3.kdprofile = 30
            and map3.statusenabled = true
            and map4.kdprofile = 30
            and map4.statusenabled = true
            and map.div = 5
            order by replace(map2.kode, '.', '' )::int4, replace(map3.kode, '.', '' )::int4, replace(map4.kode, '.', '' )::int4, replace(map.kode, '.', '' )::int4
        "));
        
        $konsolidasikelima =  DB::select(DB::raw("select map.id, map.mataanggaranpermen, map.kode, map.mataanggaranpermenfk,
            map2.kode || '.' || map3.kode || '.' || map4.kode kodeup, map4.mataanggaranpermen namaup,
            map2.kode || '.' || map3.kode || '.' || map4.kode || '.' || map.kode || ' - ' || map.mataanggaranpermen as text 
            from mataanggaranpermen_m map
            inner join mataanggaranpermen_m map4 on map.mataanggaranpermenfk = map4.id and map4.div = 4
            inner join mataanggaranpermen_m map3 on map4.mataanggaranpermenfk = map3.id and map3.div = 3
            inner join mataanggaranpermen_m map2 on map3.mataanggaranpermenfk = map2.id and map2.div = 2
            where map.kdprofile = 30
            and map.statusenabled = true
            and map2.kdprofile = 30
            and map2.statusenabled = true
            and map3.kdprofile = 30
            and map3.statusenabled = true
            and map4.kdprofile = 30
            and map4.statusenabled = true
            and map.div = 5
            order by replace(map2.kode, '.', '' )::int4, replace(map3.kode, '.', '' )::int4, replace(map4.kode, '.', '' )::int4, replace(map.kode, '.', '' )::int4
        "));

        $konsolidasikeempat =  DB::select(DB::raw("select map4.id, map4.mataanggaranpermen, map4.kode, map4.mataanggaranpermenfk,
            map2.kode || '.' || map3.kode kodeup, map3.mataanggaranpermen namaup,
            map2.kode || '.' || map3.kode || '.' || map4.kode || ' - ' || map4.mataanggaranpermen as text 
            from mataanggaranpermen_m map4
            inner join mataanggaranpermen_m map3 on map4.mataanggaranpermenfk = map3.id and map3.div = 3
            inner join mataanggaranpermen_m map2 on map3.mataanggaranpermenfk = map2.id and map2.div = 2
            where map2.kdprofile = 30
            and map2.statusenabled = true
            and map3.kdprofile = 30
            and map3.statusenabled = true
            and map4.kdprofile = 30
            and map4.statusenabled = true
            and map4.div = 4
            order by replace(map2.kode, '.', '' )::int4, replace(map3.kode, '.', '' )::int4, replace(map4.kode, '.', '' )::int4
        "));
        $tglpanjardate = "";
        $thnpanjar = "";
        if(isset($request['tglsppawal']) && isset($request['tglsppakhir'])){
            $tglpanjardate = " and pj.tglpanjar::date between '$request[tglsppawal]' and '$request[tglsppakhir]'";

        }
        if(isset($request['tahun']) && $request['tahun']!= ''){
            $thnpanjar= " and date_part('year', pj.tglpanjar)=". $request['tahun'];
        }
        $panjar = DB::select(DB::raw("
        select  ntpn, idbill, ppn, pph2,ntpnpph2,idbillpph2,jenispajak2,idpajak2, ntpnpph, idbillpph, pph, jenispajak, idpajak, namamataanggaran, objectbkufk,idmataanggaran, kodemataanggaran, idsubkegiatan, subkegiatan, idsubsubkegiatan, subsubkegiatan,
        norec, nopanjar, uraian, tglpanjar, jumlah, jenispanjar, norealisasi, coalesce(jumlahspj, 0) jumlahspj, sumberpanjar,
        coalesce(sum(jumlahpengembalian), 0) jumlahpengembalian, coalesce(jumlahspj, 0) + coalesce(sum(jumlahpengembalian), 0) totalpemakaian,
        coalesce(jumlah, 0) - (coalesce(jumlahspj, 0) + coalesce(sum(jumlahpengembalian), 0)) selisih
        from(
                select pj.ntpn, pj.idbill, pj.ppn, pj.pph2, pj.ntpnpph2, pj.idbillpph2, jp2.jenispajak as jenispajak2, pj.objectjenispphfk2 as idpajak2, pj.ntpnpph, pj.idbillpph, jp.jenispajak, pj.objectjenispphfk as idpajak, ma.namamataanggaran, ma.id idmataanggaran, ma.kodemataanggaran, subkeg.id idsubkegiatan, 
                subkeg.keterangan subkegiatan, subsubkeg.id idsubsubkegiatan, subsubkeg.keterangan subsubkegiatan, 
                pj.norec, pj.nopanjar, pj.uraian, pj.tglpanjar, pj.jumlah, pj.jenispanjar, pj.pph,
                string_agg(DISTINCT sr.norealisasi, ',') norealisasi,
                sum(stp.jumlahspj) as jumlahspj, pj.sumberpanjar, pj.objectbkufk,
                pp.jumlahpengembalian, pp.norec norecpengembalian
                from panjar_t pj
                inner join mataanggaran_m ma on ma.id = pj.objectmataanggaranfk
                inner join kegiatananggaran_m subkeg on subkeg.id = pj.objectsubkegiatanfk
                inner join kegiatananggaran_m subsubkeg on subsubkeg.id = pj.objectsubsubkegiatanfk
                left join jenispajak_m jp on jp.id = pj.objectjenispphfk
                left join jenispajak_m jp2 on jp2.id = pj.objectjenispphfk2
                left join spjtopanjar_t stp on stp.objectpanjarfk = pj.norec
                and stp.kdprofile = 30
                and stp.statusenabled = true
                left join strukrealisasi_t sr on stp.objectspjfk = sr.norec
                and sr.kdprofile = 30
                and sr.statusenabled = true
                left join pengembalianpanjar_t pp on pp.objectpanjarfk = pj.norec
                and pp.kdprofile = 30
                and pp.statusenabled = true
                where pj.kdprofile = 30
                $thnpanjar
                $tglpanjardate
                and pj.statusenabled = true
                group by pj.ntpn, pj.idbill, pj.ppn, pj.pph2, pj.ntpnpph2, pj.idbillpph2, jp2.jenispajak, pj.objectjenispphfk2, pj.ntpnpph,pj.idbillpph, pj.pph, jp.jenispajak, pj.objectjenispphfk,ma.namamataanggaran, ma.id, ma.kodemataanggaran, subkeg.id, subkeg.keterangan, 
                subsubkeg.id, subsubkeg.keterangan, pj.norec, pj.nopanjar, pj.uraian, pj.tglpanjar, 
                pj.jumlah, pj.jenispanjar, pj.sumberpanjar, pp.jumlahpengembalian, pp.norec,pj.objectbkufk
                order by pj.nopanjar
        ) as x 
        group by ntpn, idbill, ppn, pph2,ntpnpph2,idbillpph2,jenispajak2,idpajak2,  ntpnpph, idbillpph, pph, jenispajak, idpajak, namamataanggaran, objectbkufk, idmataanggaran, kodemataanggaran, idsubkegiatan, subkegiatan, idsubsubkegiatan, subsubkegiatan,
        norec, nopanjar, uraian, tglpanjar, jumlah, jenispanjar, norealisasi, jumlahspj, sumberpanjar
        order by nopanjar asc;
        "));
        // dd( $panjar);
        $tglsppdate = "";
        $thnspp = "";
        if(isset($request['tglsppawal']) && isset($request['tglsppakhir'])){
            $tglsppdate = " and spp.tglspp between '$request[tglsppawal]' and '$request[tglsppakhir]'";

        }
        if(isset($request['tahun']) && $request['tahun']!= ''){
            $thnspp= " and date_part('year', spp.tglspp)=". $request['tahun'];
        }
        $spp = DB::select(DB::raw("select spp.*, spd.nospd , ap.id idasalproduk, ap.asalproduk
        from spp_t spp 
        left join spd_t spd on spd.norec = spp.objectspdfk and spd.statusenabled = true 
        left join asalproduk_m ap on ap.id = spp.objectasalprodukfk and ap.statusenabled = true 
        where spp.statusenabled = true $thnspp $tglsppdate"));
        foreach ($spp as $sp) {
            $nospp = $sp->nospp;

            $details = DB::select(DB::raw("
            select spm.*, spp.nospp, ap.id idasalproduk, ap.asalproduk FROM
                spp_t spp
                inner join spm_t spm on spm.objectsppfk = spp.norec
                left join asalproduk_m ap on ap.id = spm.objectasalprodukfk and ap.statusenabled = true 
                where spp.nospp = '$nospp'
                and spm.statusenabled = true
                ")
            );
            $sp->details = $details;
        }
        $spd = DB::select(DB::raw("select spd.*, spp.nospp, ap.id idasalproduk, ap.asalproduk  from spd_t spd 
        left join spp_t spp on spp.objectspdfk = spd.norec and spp.statusenabled = true 
        left join asalproduk_m ap on ap.id = spd.objectasalprodukfk and ap.statusenabled = true 
        where spd.statusenabled = true"));
        $carispd = DB::select(DB::raw("select spd.nospd, spd.tglspd, spd.nilaispd, spp.norec
        from spd_t spd
        left join spp_t spp on spd.norec = spp.objectspdfk 
        where spp.norec is null"));
        $tglspmdate = "";
        $thnspm = "";
        if(isset($request['tglsppawal']) && isset($request['tglsppakhir'])){
            $tglspmdate = " and spp.tglspp::date between '$request[tglsppawal]' and '$request[tglsppakhir]'";

        }
        if(isset($request['tahun']) && $request['tahun']!= ''){
            $thnspm= " and date_part('year', spp.tglspp)=". $request['tahun'];
        }
        $carispm = DB::select(DB::raw("select spm.*, spp.nospp, spp.tglspp, ap.id idasalproduk, ap.asalproduk
        from spm_t spm
        left join spp_t spp on spp.norec = spm.objectsppfk
        left join asalproduk_m ap on ap.id = spm.objectasalprodukfk and ap.statusenabled = true 
        and spp.statusenabled = true
        where spm.statusenabled = true $tglspmdate $thnspm"));

        $dataAsalProduk = \DB::table('asalproduk_m as ap')
            ->select('ap.id','ap.asalproduk')
            ->where('ap.statusenabled',true)
            ->where('ap.isanggaran',true)
            ->orderBy('ap.asalproduk')
            ->get();


        $result = array(
            'kegiatan' => $kegiatan,
            'subsubkegiatanangkas' => $subsubkegiatanangkas,
            'kegiatansubsub' => $kegiatansubsub,
            'kegiatansubsubcombo' => $kegiatansubsubcombo,
            'kegiatancombo' => $kegiatancombo,
            'mataanggarancombo' => $mataanggarancombo,
            'mataanggaran' => $mata,
            'mataanggaranpermen' => $mataanggaranpermen,
            'keteranganperubahan' => $keteranganperubahan,
            // 'mataanggarancombo' => $mataanggarancombo,
            'mataanggarancombodiv' => $mataanggarancombodiv,
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
            'carispm' => $carispm,
            'asalproduk' => $dataAsalProduk,
            'subkegiatantransfer' => $subkegiatantransfer,
            // 'kelompokketiga' => $ketiga,
            // 'kelompokkeempat' => $keempat,
            // 'kelompokkelima' => $kelima,
            // 'kelompokkeenam' => $keenam,
            // 'rekanan' => $rekanan,
            'datalogin' => $dataLogin,
            'konsolidasi2' => $konsolidasi2,
            'konsolidasi3' => $konsolidasi3,
            'konsolidasi4' => $konsolidasi4,
            'konsolidasi5' => $konsolidasi5,
            'konso3' => $konso3,
            'konsolidasikeempat' => $konsolidasikeempat,
            'konsolidasikelima' => $konsolidasikelima,
            'ppppp'=> $listsubsubkegiatan,
            'bendahara'=> $bendahara,
            'message' => 'epic',
        );

        return $this->respond($result);
    }

    public function getDataComboItemRincian(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $kode =$request['mataanggaran'];
        $idkegiatan = $request['kegiatan'];
        $ma = DB::select(DB::raw("select id from mataanggaran_m where kodemataanggaran = '$kode' and statusenabled = true and kdprofile = 30"));
        $idma = $ma[0]->id;
        $data = DB::select(DB::raw("select * from keteranganbelanja_t where objectkegiatanfk = $idkegiatan and objectmataanggaranfk = $idma and statusenabled = true and kdprofile = 30"));

        $result = array(
            'data' => $data,
        );

        return $this->respond($result);
    }

    public function getDataComboPajak(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $data = DB::select(DB::raw("select id, jenispajak from jenispajak_m where namaexternal ilike '%pph%' and statusenabled = true and kdprofile = 30"));

        $result = array(
            'data' => $data,
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

    public function getDataComboRekananPartSemua(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $req = $request->all();
        $rekanan = \DB::table('rekanan_m as dp')
            ->select('dp.id','dp.namarekanan','dp.npwp','dp.alamatlengkap')
            ->where('dp.kdprofile', $idProfile)
            ->where('dp.statusenabled', true)
            ->where('dp.objectjenisrekananfk', 1)
            ->orderBy('dp.namarekanan');

        if (isset($request['id']) && $request['id'] != "" && $request['id'] != "undefined") {
            $rekanan = $rekanan->where('dp.id','=',$request['id']);
        }
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

    public function deleteRincianBelanja(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin = $request->all();
        $norec = '';
        DB::beginTransaction();
        try{
            if ($request['norec'] != ''){
                $data1 = RealisasiDetail::where('norec', $request['norec'])->where('kdprofile', $idProfile)->first();
                $norec = $data1->strukrealisasifk;
                $data1->statusenabled = false;
                $data1->save();
                
                $update = DB::select(DB::raw("select sum(rd.subtotal) total from strukrealisasi_t sr
                inner join realisasidetail_t rd on sr.norec = rd.strukrealisasifk
                where sr.norec = '$norec'
                and rd.statusenabled = true and rd.kdprofile = 30
                and sr.statusenabled = true and sr.kdprofile = 30"));

                $spj = StrukRealisasi::where('norec', $norec)->where('kdprofile', $idProfile)->first();
                $spj->totalbelanja = $update[0]->total;
                $spj->save();

                
            }
            $transStatus = 'true';
        }
        catch(\Exception $e){
            $transStatus= 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Hapus Berhasil";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $data1,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'line'=> $e->getLine(),
                'message'=> $e->getMessage(),
                'result' => $data1,
                'as' => '@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
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
        $data = DB::table('strukpelayanan_t as sp')
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
        $dataPegawai = DB::table('loginuser_s as lu')
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
        $keempat = DB::table('kelompokanggaranketiga_m as ru')
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
                $MA->idrelasi = $newID + 1;
            }else{
                $MA= KegiatanAnggaran::where('id',$request['id'])
                    ->where('kdprofile', $idProfile)
                    ->first();
            }
            $MA->kode = $request['kode'];
            $MA->keterangan = $request['keterangan'];
            $MA->kodeexternal = $request['kodeexternal'];
            $MA->namaexternal = $request['namaexternal'];
            $MA->reportdisplay = $request['reportdisplay'];
            $MA->tahun = $request['tahun'];
            // $MA->tahap = $request['tahap'];
            $MA->indikatormasuk = $request['indikatormasuk'];
            $MA->indikatorkeluaran = $request['indikatorkeluaran'];
            $MA->indikatorhasil = $request['indikatorhasil'];
            $MA->targetmasuk = $request['targetmasuk'];
            $MA->targetkeluaran = $request['targetkeluaran'];
            $MA->targethasil = $request['targethasil'];
            $MA->div = $request['div'];
            $MA->objectjenisbelanjafk = $request['jenisbelanja'];
            $MA->objectpptkfk = $request['pptk'];
            $MA->headfk = (isset($request['headfk'])) ? $request['headfk'] : null;
            $MA->save();
            if(isset($request['tahap'])){
                $KB = new KeteranganBelanja();
                $KB->norec = $KB->generateNewId();
                $KB->kdprofile = $idProfile;
                $KB->statusenabled = true;
                $KB->objectkegiatanfk = $MA->id;
                $KB->objecttahapfk = $request['tahap'];
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

    public function deleteKegiatanAnggaran(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        try{
            $MA= KegiatanAnggaran::where('id',$request['id'])
                    ->where('kdprofile', $idProfile)
                    ->first();
            $MA->statusenabled = false;
            $MA->save();

            

            if($request['div'] == 4){

                $data = \DB::table('keteranganbelanja_t')->where('objectkegiatanfk',$request['id'])->update([
                    'statusenabled'=> false
                ]);
            }

           $transStatus = 'true';
       } catch (\Exception $e) {
            $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Hapus Berhasil";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $MA,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
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

    public function deleteRincianKegiatanAnggaran(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        try{
            
            $data = \DB::table('keteranganbelanja_t')->where('objectkegiatanfk',$request['id'])->where('objecttahapfk',$request['tahap'])->update([
                'statusenabled'=> false
            ]);

            $cek = KeteranganBelanja::where('objectkegiatanfk',$request['id'])->where('objecttahapfk', '!=', $request['tahap'])->where('statusenabled', true)->first();
            
            if(empty($cek)){
                $KA = \DB::table('kegiatananggaran_m')->where('id',$request['id'])->update([
                    'indikatorkeluaran'=> null,
                    'indikatorhasil'=> null,
                    'targetkeluaran'=> null,
                    'targethasil'=> null,
                ]);
            }


           $transStatus = 'true';
       } catch (\Exception $e) {
            $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Hapus Berhasil";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $cek,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'line'=> $e->getLine(),
                'message'=> $e->getMessage(),
                'result' => $cek,
                'as' => '@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function deleteMataAnggaran(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        try{
            $MA= MataAnggaran::where('id',$request['id'])
                    ->where('kdprofile', $idProfile)
                    ->first();
            $MA->statusenabled = false;
            $MA->save();

           $transStatus = 'true';
       } catch (\Exception $e) {
            $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Hapus Berhasil";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $MA,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
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
                $cek = KegiatanAnggaran::where('kode', '=', $dt['kodesubsubkegiatan'])
                    ->where('tahun', '=', $request['tahunakhir'])
                    ->where('div', $dt['div'])
                    ->first();
                
                $newID = KegiatanAnggaran::max('id');

                $KA = new KegiatanAnggaran();
                $KA->id =  $newID + 1;
                $KA->norec = $KA->generateNewId();
                $KA->kdprofile = $idProfile;
                $KA->statusenabled = true;
                $KA->kode = $dt['kodesubsubkegiatan'];
                // $KA->keterangan = $dt['keterangan'];
                $KA->keterangan = $dt['keterangansubsubkegiatan'];
                $KA->kodeexternal = null;
                $KA->namaexternal = null;
                $KA->reportdisplay = null;
                $KA->tahun = $request['tahunakhir'];
                $KA->indikatormasuk = $dt['indikatormasuk'];
                $KA->indikatorkeluaran = $dt['indikatorkeluaran'];
                $KA->indikatorhasil = $dt['indikatorhasil'];
                $KA->targetmasuk = $dt['targetmasuk'];
                $KA->targetkeluaran = $dt['targetkeluaran'];
                $KA->targethasil = $dt['targethasil'];
                $KA->div = $dt['div'];
                $KA->objectjenisbelanjafk = $dt['objectjenisbelanjafk'];
                $KA->objectpptkfk = $dt['objectpptkfk'];
                $KA->tgltransfer = $request['tgltransfer'];
                $KA->idtransfer = $dt['idsubsubkegiatan'];
                $KA->headfk = (isset($dt['headfk'])) ? $dt['headfk'] : null;
                $KA->idrelasi = (isset($dt['idrelasi'])) ? $dt['idrelasi'] : null;
                $KA->save();
                
                // Keterangan belanja berdasarkan kegiatan anggaran dan tahap
                $KB = KeteranganBelanja::where('objectkegiatanfk',$dt['idsubsubkegiatan'])
                    ->where('objecttahapfk', $awal)
                    ->where('statusenabled', true)
                    ->get();
                
                if(count($KB) > 0){

                    foreach($KB as $k){

                        $MA = new KeteranganBelanja();
                        $norecKS = $MA->generateNewId();
                        $MA->norec = $norecKS;
                        $MA->kdprofile = $idProfile;
                        $MA->statusenabled = true;
                        $MA->objectkegiatanfk = $KA->id;
                        $MA->objectmataanggaranfk = $k->objectmataanggaranfk;
                        $MA->keteranganbelanja = $k->keteranganbelanja;
                        $MA->nourut = $k->nourut;
                        $MA->jml = $k->jml;
                        $MA->hargasatuan = $k->hargasatuan;
                        $MA->subtotal = $k->subtotal;
                        $MA->satuan = $k->satuan;
                        $MA->objectasalprodukfk = $k->objectasalprodukfk;
                        $MA->password = $k->password;
                        $MA->objecttahapfk = $akhir;
                        $MA->tgltransfer = $request['tgltransfer'];
                        $MA->norectransfer = $k->norec;
                        $MA->save();
    
                        // Get alokasi keterangkan belanja (angkas) berdasarkan keterangan belanja
                        $listAngkas = AlokasiKeteranganBelanja::where('keteranganbelanjafk', $k->norec)
                            ->where('statusenabled', true)
                            ->where('kdprofile', $idProfile)
                            ->get();
                        
                        if(count($listAngkas) > 0){
                            // Membuat angkas baru sesuai dengan norec keterangan belanja baru dan tgl transfer
                            foreach($listAngkas as $angkas){
                                $newAngkas = new AlokasiKeteranganBelanja();
                                $newAngkas->norec = $newAngkas->generateNewId();
                                $newAngkas->kdprofile = $idProfile;
                                $newAngkas->statusenabled = true;
                                $newAngkas->keteranganbelanjafk = $MA->norec;
                                $newAngkas->bulanint = $angkas->bulanint;
                                $newAngkas->nilai = $angkas->nilai;
                                $newAngkas->tgltransfer = $request['tgltransfer'];
                                $newAngkas->save();
                            }
                        }
    
                    }
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
                'result' => $KA,
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

        $thn = date("Y", strtotime($request['tglspp']) );
        $tgl = $request['tglspp'];
        try{

                if($request['norec'] == ''){
                    $SP = SPD::where('nospd', '=', $request['nospd'])->first();        
                    $MA = new SPP();
                    $norecKS = $MA->generateNewId();
                    $MA->norec = $norecKS;
                    $MA->kdprofile = $idProfile;
                    $MA->statusenabled = true;

                    // $nos = $this->generateCodeBySeqTableSPP(new SPP, 'nospp', 6, '/',$kdProfile, $thn, $tgl);

                    $runningNumber = RunningNumber::where('id',13543)->first();
                    $nomor = $runningNumber->nomer_terbaru +1;
                    $nos = str_pad((int)$nomor, 5, "0", STR_PAD_LEFT);

                    RunningNumber::where('id', 13543)
                    ->update(
                        [
                            'nomer_terbaru' => $nos
                        ]
                    );

                    $noSPP = '04.00/02.0/'.$nos.'/LS/1.02.2.22.0.00.01.0004/M/1/'.$thn;
                    // return $noSPP;
                    $MA->nospp = $noSPP;
                    
                } else{
                    $SP = SPD::where('nospd', '=', $request['nospd'])->first(); 

                    $MA = SPP::where('norec', '=', $request['norec'])->first();
                }
                   
                    $MA->jenisbukti = $request['jenisbukti'];
                    $MA->dasarpengeluaran = $request['dasarpengeluaran'];
                    $MA->status = $request['statusspp'];
                    $MA->tglspp = $request['tglspp'];
                    $MA->bulan = $request['bulan'];
                    $MA->pengeluaran = $request['pengeluaran'];
                    $MA->tglsah = $request['tglsah'];
                    $MA->nilaispp = $request['nilaispp'];
                    $MA->objectasalprodukfk = $request['objectasalprodukfk'];
                    if(empty($SP)){
                        $MA->objectspdfk = null;
                    } else{
                        $MA->objectspdfk = $SP->norec;
                    }

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
                // 'resultq' => $nos,
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

    public function savePermenKelima(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        try{
                if($request['norec'] == ''){
                    $newID = Permen::max('id');

                    $MA = new Permen();
                    $MA->id = $newID + 1;
                    $MA->kdprofile = $idProfile;
                    $MA->statusenabled = true;
                    $MA->kodeexternal = 'permendagri';
                    $MA->div = 5;


                    $MA = \DB::table('mataanggaranpermen_m')->insert([
                        'id'=>$newID + 1,
                        'kdprofile'=>$idProfile,
                        'statusenabled'=>true,
                        'kodeexternal'=>'permendagri',
                        'div'=>5,
                        'namaexternal'=>$request['nama'],
                        'reportdisplay'=>$request['nama'],
                        'mataanggaranpermen'=>$request['nama'],
                        'kode'=>$request['kode'],
                        'mataanggaranpermenfk'=>$request['keempatfk'],
                    ]);
                    
                } else{

                    $MA = Permen::where('id', '=', $request['norec'])->first();

                    $MA->namaexternal = $request['nama'];
                    $MA->reportdisplay = $request['nama'];
                    $MA->mataanggaranpermen = $request['nama'];
                    $MA->kode = $request['kode'];

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
                'line'=> $e->getLine(),
                'message'=> $e->getMessage(),
                'as' => '@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function savePermenKeempat(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        try{
                if($request['norec'] == ''){
                    $newID = Permen::max('id');

                    $MA = new Permen();
                    $MA->id = $newID + 1;
                    $MA->kdprofile = $idProfile;
                    $MA->statusenabled = true;
                    $MA->kodeexternal = 'permendagri';
                    $MA->div = 4;


                    $MA = \DB::table('mataanggaranpermen_m')->insert([
                        'id'=>$newID + 1,
                        'kdprofile'=>$idProfile,
                        'statusenabled'=>true,
                        'kodeexternal'=>'permendagri',
                        'div'=>4,
                        'namaexternal'=>$request['nama'],
                        'reportdisplay'=>$request['nama'],
                        'mataanggaranpermen'=>$request['nama'],
                        'kode'=>$request['kode'],
                        'mataanggaranpermenfk'=>$request['ketigafk'],
                    ]);
                    
                } else{

                    $MA = Permen::where('id', '=', $request['norec'])->first();

                    $MA->namaexternal = $request['nama'];
                    $MA->reportdisplay = $request['nama'];
                    $MA->mataanggaranpermen = $request['nama'];
                    $MA->kode = $request['kode'];

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
                'line'=> $e->getLine(),
                'message'=> $e->getMessage(),
                'as' => '@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveLPJ(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $bulan = (int)$request['bulan'];
        $tahun = (int)$request['tahun'];

        $thn = date("Y", strtotime($request['tgllpj']) );
        $tgl = date("n", strtotime($request['tgllpj']) );

        $data = DB::select(DB::raw("select sum(jumlahdibayarverif) total from(
        select sr.norec, sr.norealisasi, string_agg(DISTINCT rd.uraian, ',') uraian, cbs.carabayar, ma.kodemataanggaran || '~' || ma.namamataanggaran as mataanggaran,
        sr.keterangan, sr.tglverif, sr.jumlahdibayarverif  FROM
        strukrealisasi_t sr
        inner join realisasidetail_t rd on rd.strukrealisasifk = sr.norec
        inner join carabayarspj_m cbs on cbs.id = sr.objectcarabayarfk
        inner JOIN mataanggaran_m ma on ma.id=sr.objectmataanggaranfk
        where sr.statusenabled = true
        and sr.kdprofile = 30
        and sr.status = 'Sudah Diverifikasi'
        and extract(month from sr.tglrealisasi) = $bulan
        and extract(year from sr.tglrealisasi) = $tahun
        and sr.objectlpjfk is null
        group by sr.norec, sr.norealisasi, cbs.carabayar, ma.kodemataanggaran || '~' || ma.namamataanggaran,
        sr.keterangan, sr.tglverif, sr.jumlahdibayarverif
        ) as x
            ")
        );

        $datas = DB::select(DB::raw("
            select sr.norec, sr.norealisasi, string_agg(DISTINCT rd.uraian, ',') uraian, cbs.carabayar, ma.kodemataanggaran || '~' || ma.namamataanggaran as mataanggaran,
            sr.keterangan, sr.tglverif, sr.jumlahdibayarverif  FROM
            strukrealisasi_t sr
            inner join realisasidetail_t rd on rd.strukrealisasifk = sr.norec
            inner join carabayarspj_m cbs on cbs.id = sr.objectcarabayarfk
            inner JOIN mataanggaran_m ma on ma.id=sr.objectmataanggaranfk
            where sr.statusenabled = true
            and sr.kdprofile = 30
            and sr.status = 'Sudah Diverifikasi'
            and extract(month from sr.tglrealisasi) = $bulan
            and extract(year from sr.tglrealisasi) = $tahun
            and sr.objectlpjfk is null
            group by sr.norec, sr.norealisasi, cbs.carabayar, ma.kodemataanggaran || '~' || ma.namamataanggaran,
            sr.keterangan, sr.tglverif, sr.jumlahdibayarverif
                ")
            );

        try{ 
            if($request['norec'] == ''){
                $MA = new LPJ();
                $norecKS = $MA->generateNewId();
                $MA->norec = $norecKS;
                $MA->kdprofile = $idProfile;
                $MA->statusenabled = true;
                $nos = $this->generateCodeBySeqTable(new LPJ, 'nolpj', 4, ' ',$kdProfile);
                $noLPJ = $nos.'/LPJ/1.02.2.22.0.00.01.0004/'.$tgl.'/'.$thn;
                $MA->nolpj = $noLPJ;
                $MA->tgllpj = $request['tgllpj'];
                $MA->keterangan = $request['keterangan'];
                $MA->periode = $request['periode'];
                $MA->jenis_bukti = $request['jenis_bukti'];
                $MA->total = $data[0]->total;
                $MA->objectasalprodukfk = $request['objectasalprodukfk'];
                $MA->save();

                foreach($datas as $ds){
                    $SP = StrukRealisasi::where('norec', '=', $ds->norec)->first();
                    $SP->objectlpjfk = $MA->norec;
                    $SP->save();
                }
            } else if($request['norec'] != ''){
                $MA = LPJ::where('norec', '=', $request['norec'])->first();
                $MA->keterangan = $request['keterangan'];
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
                'line'=> $e->getLine(),
                'message'=> $e->getMessage(),
                'as' => '@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function deleteLPJ(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        try{ 
            $MA = LPJ::where('norec', '=', $request['norec'])->first();
            $MA->statusenabled = false;
            $MA->save();

           $transStatus = 'true';
       } catch (\Exception $e) {
            $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Hapus";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $MA,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
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

    public function deleteSPJtoPanjar(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        try{ 
            $MA = SPJtoPanjar::where('objectpanjarfk', '=', $request['norecpanjar'])
            ->where('objectspjfk', '=', $request['norecspj'])
            ->where('statusenabled', '=', true)
            ->first();
            $MA->statusenabled = false;
            $MA->save();

           $transStatus = 'true';
       } catch (\Exception $e) {
            $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Hapus";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $MA,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
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

    public function deleteBKU(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        try{ 
            $MA = BKU::where('norec', '=', $request['norec'])
            ->first();
            $MA->statusenabled = false;
            $MA->save();

            $SPM = SPM::where('objectbkufk', '=', $request['norec'])
            ->first();
            if(!empty($SPM)){
                $SPM->objectbkufk = null;
                $SPM->save();
            }

            $SR = StrukRealisasi::where('objectbkufk', '=', $request['norec'])
            ->first();
            if(!empty($SR)){
            $SR->objectbkufk = null;
            $SR->save();
            }

            $PJ = Panjar::where('objectbkufk', '=', $request['norec'])
            ->first();
            if(!empty($PJ)){
            $PJ->objectbkufk = null;
            $PJ->save();
            }

            $PG = Pengembalian::where('objectbkufk', '=', $request['norec'])
            ->first();
            if(!empty($PG)){
            $PG->objectbkufk = null;
            $PG->save();
            }

            $PP = PemungutanPajak::where('objectbkufk', '=', $request['norec'])
            ->first();
            if(!empty($PP)){
            $PP->objectbkufk = null;
            $PP->save();
            }

            $PE = PenyetoranPajak::where('objectbkufk', '=', $request['norec'])
            ->first();
            if(!empty($PE)){
            $PE->objectbkufk = null;
            $PE->save();
            }

            $JG = JasaGiro::where('objectbkufk', '=', $request['norec'])
            ->first();
            if(!empty($JG)){
            $JG->objectbkufk = null;
            $JG->save();
            }

            $SK = STSKeuangan::where('objectbkufk', '=', $request['norec'])
            ->first();
            if(!empty($SK)){
            $SK->objectbkufk = null;
            $SK->save();
            }

           $transStatus = 'true';
       } catch (\Exception $e) {
            $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Hapus";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $MA,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
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

    public function savePajak(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $month = (int)date("m",strtotime($request['tglpph']));
        $year = (int)date("Y",strtotime($request['tglpph']));
        $jumlahpph = 0;
        $jumlahppn = 0;
        $norecspj = $request['norec'];

        try{     
            for($i = 0; $i < count($request['pph']); $i++){
                    $cek = PemungutanPajak::where('norec', '=', $request['pph'][$i]['norecpp'])->where('kdprofile', '=', 30)->where('statusenabled', '=', true)->first();

                    if(empty($cek)){
                        $MA = new PemungutanPajak();
                        $norecKS = $MA->generateNewId();
                        $MA->norec = $norecKS;
                        $MA->kdprofile = $idProfile;
                        $MA->statusenabled = true;
                        $noas = $this->generateCode(new PemungutanPajak, 'nopajak', 3, '', $idProfile);
                        $noa = $this->generateCode(new PemungutanPajak, 'nopajak', 30, '/PJK/1.02.2.22.0.00.01.', $idProfile);
                        $MA->nopajak = $noas.$noa.'/'.$month.'/'.$year;

                        $MP = new PenyetoranPajak();
                        $norecKS = $MP->generateNewId();
                        $MP->norec = $norecKS;
                        $MP->kdprofile = $idProfile;
                        $MP->statusenabled = true;
                        $nops = $this->generateCode(new PenyetoranPajak, 'nopajak', 3, '', $idProfile);
                        $nop = $this->generateCode(new PenyetoranPajak, 'nopajak', 33, '/STRPJK/1.02.2.22.0.00.01.', $idProfile);
                        $MP->nopajak = $nops.$nop.'/'.$month.'/'.$year;
                    } else{
                        $MA = PemungutanPajak::where('norec', '=', $request['pph'][$i]['norecpp'])->first();
                        $MP = PenyetoranPajak::where('norec', '=', $request['pph'][$i]['norecpep'])->first();
                    }
                    
                    
                    $MA->uraianpajak = $request['uraianpajak'];
                    $MA->objectspjfk = $norecspj;
                    $MA->objectjenispphfk = $request['pph'][$i]['objectjenispphfk'];
                    $MA->pph = $request['pph'][$i]['pph'];
                    //$MA->ppn = $request['ppn'];
                    $MA->tglpph = $request['pph'][$i]['tglpph'];
                    //$MA->tglppn = $request['tglppn'];
                    //$MA->idbillppn = $request['idbillppn'];
                    //$MA->ntpnppn = $request['ntpnppn'];
                    $MA->idbillpph = $request['pph'][$i]['idbillpph'];
                    $MA->ntpnpph = $request['pph'][$i]['ntpnpph'];
                    $MA->save();

                    $MP->uraianpajak = $request['uraianpajak'];
                    $MP->objectspjfk = $norecspj;
                    $MP->objectjenispphfk = $request['pph'][$i]['objectjenispphfk'];
                    $MP->pph = $request['pph'][$i]['pph'];
                    //$MP->ppn = $request['ppn'];
                    $MP->tglpph = $request['pph'][$i]['tglpph'];
                    //$MP->tglppn = $request['tglppn'];
                    //$MP->idbillppn = $request['idbillppn'];
                    //$MP->ntpnppn = $request['ntpnppn'];
                    $MP->idbillpph = $request['pph'][$i]['idbillpph'];
                    $MP->ntpnpph = $request['pph'][$i]['ntpnpph'];
                    $MP->save();

                    $SP = StrukRealisasi::where('norec', '=', $request['norec'])->first();
                    $SP->pph = $jumlahpph + $request['pph'][$i]['pph'];
                    $SP->save();
            }
            
            for($x = 0; $x < count($request['ppn']); $x++){
                $cek = PemungutanPajak::where('norec', '=', $request['ppn'][$x]['norecpp'])->where('kdprofile', '=', 30)->where('statusenabled', '=', true)->first();

                if(empty($cek)){
                    $MA = new PemungutanPajak();
                    $norecKS = $MA->generateNewId();
                    $MA->norec = $norecKS;
                    $MA->kdprofile = $idProfile;
                    $MA->statusenabled = true;
                    $noas = $this->generateCode(new PemungutanPajak, 'nopajak', 3, '', $idProfile);
                    $noa = $this->generateCode(new PemungutanPajak, 'nopajak', 30, '/PJK/1.02.2.22.0.00.01.', $idProfile);
                    $MA->nopajak = $noas.$noa.'/'.$month.'/'.$year;

                    $MP = new PenyetoranPajak();
                    $norecKS = $MP->generateNewId();
                    $MP->norec = $norecKS;
                    $MP->kdprofile = $idProfile;
                    $MP->statusenabled = true;
                    $nops = $this->generateCode(new PenyetoranPajak, 'nopajak', 3, '', $idProfile);
                    $nop = $this->generateCode(new PenyetoranPajak, 'nopajak', 33, '/STRPJK/1.02.2.22.0.00.01.', $idProfile);
                    $MP->nopajak = $nops.$nop.'/'.$month.'/'.$year;
                } else{
                    $MA = PemungutanPajak::where('norec', '=', $request['ppn'][$x]['norecpp'])->first();
                    $MP = PenyetoranPajak::where('norec', '=', $request['ppn'][$x]['norecpep'])->first();
                }
                
                
                $MA->uraianpajak = $request['uraianpajak'];
                $MA->objectspjfk = $norecspj;
                // $MA->objectjenispphfk = $request['pph']['objectjenispphfk'];
                $MA->objectjenispphfk = '1';
                //$MA->pph = $request['pph']['pph'];
                $MA->ppn = $request['ppn'][$x]['ppn'];
                //$MA->objectspjfk = $request['pph']['norec'];
                //$MA->tglpph = $request['pph']['tglpph'];
                $MA->tglppn = $request['ppn'][$x]['tglppn'];
                $MA->idbillppn = $request['ppn'][$x]['idbillppn'];
                $MA->ntpnppn = $request['ppn'][$x]['ntpnppn'];
                //$MA->idbillpph = $request['pph']['idbillpph'];
                //$MA->ntpnpph = $request['pph']['ntpnpph'];
                $MA->save();

                $MP->uraianpajak = $request['uraianpajak'];
                $MP->objectspjfk = $norecspj;
                // $MP->objectjenispphfk = $request['pph']['objectjenispphfk'];
                $MP->objectjenispphfk = '1';
                //$MP->pph = $request['pph']['pph'];
                $MP->ppn = $request['ppn'][$x]['ppn'];
                //$MP->objectspjfk = $request['pph']['norec'];
                //$MP->tglpph = $request['pph']['tglpph'];
                $MP->tglppn = $request['ppn'][$x]['tglppn'];
                $MP->idbillppn = $request['ppn'][$x]['idbillppn'];
                $MP->ntpnppn = $request['ppn'][$x]['ntpnppn'];
                //$MP->idbillpph = $request['pph']['idbillpph'];
                //$MP->ntpnpph = $request['pph']['ntpnpph'];
                $MP->save();

                $SP = StrukRealisasi::where('norec', '=', $request['norec'])->first();
                $SP->ppn = $jumlahppn + $request['ppn'][$x]['ppn'];
                $SP->save();
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
                'results' => $MP,
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

    public function saveJasgir(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $month = (int)date("m",strtotime($request['tglpemasukan']));
        $year = (int)date("Y",strtotime($request['tglpemasukan']));

        $thn = date("Y", strtotime($request['tglpemasukan']) );
        $tgl = date("n", strtotime($request['tglpemasukan']) );

        try{ 
                    if($request['norec'] == ''){
                        $MA = new JasaGiro();
                        $norecKS = $MA->generateNewId();
                        $MA->norec = $norecKS;
                        $MA->kdprofile = $idProfile;
                        $MA->statusenabled = true;

                        $nos = $this->generateCodeBySeqTable(new JasaGiro, 'nojasagiro', 4, ' ',$kdProfile);
                        $noJasgir = $nos.'/JG/1.02.2.22.0.00.01.0004/'.$tgl.'/'.$thn;
                        $MA->nojasagiro = $noJasgir;
                    } else{
                        $MA = JasaGiro::where('norec', '=', $request['norec'])->first();
                    }
                    
                    
                    $MA->uraianjasagiro = $request['uraianjasgir'];
                    $MA->tglpemasukan = $request['tglpemasukan'];
                    $MA->jumlahpemasukan = $request['jumlahpemasukan'];
                    $MA->tglpengeluaran = $request['tglpengeluaran'];
                    $MA->jumlahpengeluaran = $request['jumlahpengeluaran'];
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

    public function saveSTSKeuangan(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tglAyeuna = date('Y-m-d H:i:s');
        $thn = date("Y", strtotime($request['tglsts']) );
        $tgl = date("n", strtotime($request['tglsts']) );

        try{ 
                    if($request['norec'] == ''){
                        $MA = new STSKeuangan();
                        $norecKS = $MA->generateNewId();
                        $MA->norec = $norecKS;
                        $MA->kdprofile = $idProfile;
                        $MA->statusenabled = true;

                        $thn = date("Y", strtotime($request['tglsts']) );
                        $nos = $this->generateCodeBySeqTableSTS(new STSKeuangan, 'nojasagiro', 6, ' ',$kdProfile, $thn);
                        $noSTS = $nos.'/STS/'.$tgl.'/'.$thn;
                        $MA->nosts = $noSTS;
                        
                    } else{
                        $MA = STSKeuangan::where('norec', '=', $request['norec'])->first();
                    }
                    
                    $MA->uraiansts = $request['uraiansts'];
                    $MA->tglsts = $request['tglsts'];
                    $MA->nilaists = $request['nilaists'];
                    $MA->objectsubkegiatanfk = $request['objectsubkegiatanfk'];
                    $MA->objectmataanggaranfk = $request['objectmataanggaranfk'];
                    $MA->objectsubsubkegiatanfk = $request['objectsubsubkegiatanfk'];
                    $MA->objectsumberdanafk = $request['objectsumberdanafk'];
                    $MA->tglinput = $tglAyeuna;
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

    public function saveRetur(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        try{ 
                    if($request['norec'] == ''){
                        $MA = new Retur();
                        $norecKS = $MA->generateNewId();
                        $MA->norec = $norecKS;
                        $MA->kdprofile = $idProfile;
                        $MA->statusenabled = true;
                    } else{
                        $MA = Retur::where('norec', '=', $request['norec'])->first();
                    }
                    
                    
                    $MA->keteranganretur = $request['keteranganretur'];
                    $MA->tglretur = $request['tglretur'];
                    $MA->jumlahretur = $request['jumlahretur'];
                    $MA->noretur = $request['noretur'];
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

    public function saveJurnal(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        try{ 
                    if($request['norec'] == ''){
                        $MA = new Jurnal();
                        $norecKS = $MA->generateNewId();
                        $MA->norec = $norecKS;
                        $MA->kdprofile = $idProfile;
                        $MA->statusenabled = true;
                    } else{
                        $MA = Jurnal::where('norec', '=', $request['norec'])->first();
                    }
                    
                    
                    $MA->keteranganjurnal = $request['keteranganjurnal'];
                    $MA->tgljurnal = $request['tgljurnal'];
                    $MA->debet = $request['debet'];
                    $MA->kredit = $request['kredit'];
                    $MA->nojurnal = $request['nojurnal'];
                    $MA->kdakun = $request['kdakun'];
                    $MA->jenis = 1;
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

    public function saveTelemedicine(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        try{ 
                    if($request['norec'] == ''){
                        $MA = new Telemedicine();
                        $norecKS = $MA->generateNewId();
                        $MA->norec = $norecKS;
                        $MA->kdprofile = $idProfile;
                        $MA->statusenabled = true;
                    } else{
                        $MA = Telemedicine::where('norec', '=', $request['norec'])->first();
                    }
                    
                    
                    $MA->kdreservasi = $request['kdreservasi'];
                    $MA->norm = $request['norm'];
                    $MA->tglreservasi = $request['tglreservasi'];
                    $MA->namapasien = $request['namapasien'];
                    $MA->jam = $request['jam'];
                    $MA->nohp = $request['nohp'];
                    $MA->objectruanganfk = $request['objectruanganfk'];
                    $MA->objectkelompokpasienfk = $request['objectkelompokpasienfk'];
                    $MA->objectdokterfk = $request['objectdokterfk'];
                    $MA->nominal = $request['nominal'];
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

    public function saveJurnalP(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        try{ 
                    if($request['norec'] == ''){
                        $MA = new Jurnal();
                        $norecKS = $MA->generateNewId();
                        $MA->norec = $norecKS;
                        $MA->kdprofile = $idProfile;
                        $MA->statusenabled = true;
                    } else{
                        $MA = Jurnal::where('norec', '=', $request['norec'])->first();
                    }
                    
                    
                    $MA->keteranganjurnal = $request['keteranganjurnal'];
                    $MA->tgljurnal = $request['tgljurnal'];
                    $MA->debet = $request['debet'];
                    $MA->kredit = $request['kredit'];
                    $MA->nojurnal = $request['nojurnal'];
                    $MA->kdakun = $request['kdakun'];
                    $MA->jenis = 2;
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

    public function saveBKUDetail(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $ap = 0;
        if($request['asalproduk'] == 'APBD'){
            $ap = 15;
        }elseif($request['asalproduk'] == 'Jasa Layanan'){
            $ap = 18;
        }elseif($request['asalproduk'] == 'DAK'){
            $ap = 21;
        }elseif($request['asalproduk'] == 'Danais'){
            $ap = 2;
        }elseif($request['asalproduk'] == 'SiLPA'){
            $ap = 4;
        }
        $cek = BKU::where('nobku', '=', $request['nobku'])->where('norec', '<>', $request['norec'])->where('objectasalprodukfk', '=', $ap)->first();

        try{ 
            $MA = BKU::where('norec', '=', $request['norec'])->first();
            $MA->tglbku = $request['tglbku'];
            $MA->nobku = $request['nobku'];
            $MA->save();

            $transStatus = 'true';
        // if(empty($cek)){
        //         } else{
        //             $transStatus = 'false';
        //         }
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
            $transMessage = "Simpan Gagal, No BKU Sudah Terpakai";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'as' => '@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveSumberPendapatan(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        try{ 
                    if($request['id'] == ''){
                        $newID = AsalProduk::max('id');

                        $MA = new AsalProduk();
                        $MA->id = $newID + 1;
                        $MA->kdprofile = $idProfile;
                        $MA->statusenabled = true;
                        $MA->kodeexternal = $newID + 1;
                        $MA->norec = $newID + 1;
                        

                    } else{
                        $MA = AsalProduk::where('id', '=', $request['id'])->first();
                    }
                    
                    $MA->namaexternal = $request['asalproduk'];
                    $MA->reportdisplay = $request['asalproduk'];
                    $MA->objectdepartemenfk = null;
                    $MA->objectkelompokprodukfk = null;
                    $MA->asalproduk = $request['asalproduk'];
                    $MA->kdasalproduk = null;
                    $MA->qasalproduk = null;
                    $MA->isanggaran = null;
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

    public function saveUraianPendapatan(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        try{ 
                    if($request['id'] == ''){
                        $newID = UraianPendapatan::max('id');

                        $MA = \DB::table('uraianpendapatan_m')->insert([
                            'id'=>$newID + 1,
                            'kdprofile'=>$idProfile,
                            'statusenabled'=>true,
                            'namaexternal'=>null,
                            'reportdisplay'=>null,
                            'uraianpendapatan'=>$request['uraianpendapatan'],
                            'nourut'=>$request['nourut'],
                            'tahun'=>$request['tahun'],
                            'nouraian'=>$request['nouraian'],
                            'kdrekening'=>$request['kdrekening'],
                        ]);

                    } else{
                        $MA = UraianPendapatan::where('id', '=', $request['id'])->first();
                        $MA->namaexternal = null;
                        $MA->reportdisplay = null;
                        $MA->uraianpendapatan = $request['uraianpendapatan'];
                        $MA->nourut = $request['nourut'];
                        $MA->tahun = $request['tahun'];
                        $MA->nouraian = $request['nouraian'];
                        $MA->kdrekening = $request['kdrekening'];
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
                'line'=> $e->getLine(),
                'message'=> $e->getMessage(),
                'as' => '@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveUraianPendapatanCopy(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tahundari = $request['tahundari'];
        $tahunke = $request['tahunke'];

        try{ 

            $data = DB::select(DB::raw("select * from uraianpendapatan_m where tahun = '$tahundari' and kdprofile = $idProfile and statusenabled = true"));

            foreach($data as $dt){
                $newID = UraianPendapatan::max('id');

                $MA = \DB::table('uraianpendapatan_m')->insert([
                    'id'=>$newID + 1,
                    'kdprofile'=>$idProfile,
                    'statusenabled'=>true,
                    'namaexternal'=>null,
                    'reportdisplay'=>null,
                    'uraianpendapatan'=>$dt->uraianpendapatan,
                    'nourut'=>$dt->nourut,
                    'tahun'=>$request['tahunke'],
                    'nouraian'=>$dt->nouraian,
                    'kdrekening'=>$dt->kdrekening,
                ]);
            }

           $transStatus = 'true';
       } catch (\Exception $e) {
            $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
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

    public function saveBKU(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $penerimaan = 0;
        $pengeluaran = 0;

        $saldoakhir = DB::select(DB::raw("SELECT saldo FROM bukukasumum_t WHERE statusenabled = true AND kdprofile = 30 AND objectasalprodukfk = '" . $request['asalproduk'] . "' ORDER BY nobku DESC LIMIT 1"));
        
        if(count($saldoakhir) == 0){
            $saldofix = 0;
        } else{
            $saldofix = $saldoakhir[0]->saldo;
        }

        //var_dump($saldoakhir);

        try{ 
                    
                    if($request['jenisbukti'] == 1){
                        $MA = new BKU();
                        $norecKS = $MA->generateNewId(); 
                        $MA->norec = $norecKS;
                        $MA->kdprofile = $idProfile;
                        $MA->statusenabled = true;

                        // $noa = $this->generateCodeBKU(new BKU, 'nobku', $request['asalproduk'], 5, '', $idProfile);
                        $runningNumber = RunningNumber::where('id',13542)->first();
                        $nomor = $runningNumber->nomer_terbaru +1;
                        $nos = str_pad((int)$nomor, 5, "0", STR_PAD_LEFT);

                        RunningNumber::where('id', 13542)
                        ->update(
                            [
                                'nomer_terbaru' => $nos
                            ]
                        );

                        $MA->nobku = $nos.'-B02';
                        $MA->objectjenisbuktifk = $request['jenisbukti'];
                        $MA->tglbku = $request['tglbku'];
                        $MA->uraianbku = $request['uraian'];
                        $MA->rekananfk = $request['rekananfk'];
                        $MA->objectasalprodukfk = $request['asalproduk'];

                        $MA->objectmataanggaranfk = null;

                        for($i = 0; $i < count($request['bku']); $i++){
                            $saldofix += $request['bku'][$i]['nilaispm'];
                            $penerimaan += $request['bku'][$i]['nilaispm'];
                        }

                        $MA->tgljam = date('Y-m-d H:i:s');
                        $MA->penerimaan = $penerimaan;
                        $MA->pengeluaran = 0;
                        $MA->saldo = $saldofix;
                        $MA->save();

                        for($x = 0; $x < count($request['bku']); $x++){
                            $MP = SPM::where('norec', '=', $request['bku'][$x]['norec'])->first();
                            $MP->objectbkufk = $MA->norec;
                            $MP->save();
                        }
                    } else if($request['jenisbukti'] == 5){
                        $MA = new BKU();
                        $norecKS = $MA->generateNewId();
                        $MA->norec = $norecKS;
                        $MA->kdprofile = $idProfile;
                        $MA->statusenabled = true;
                        $noa = $this->generateCodeBKU(new BKU, 'nobku', $request['asalproduk'], 5, '', $idProfile);
                        $MA->nobku = $noa.'-B02';
                        $MA->objectjenisbuktifk = $request['jenisbukti'];
                        $MA->tglbku = $request['tglbku'];
                        $MA->uraianbku = $request['uraian'];
                        $MA->rekananfk = $request['rekananfk'];
                        $MA->objectasalprodukfk = $request['asalproduk'];

                        $MA->objectmataanggaranfk = null;

                        for($i = 0; $i < count($request['bku']); $i++){
                            $saldofix += $request['bku'][$i]['jumlahpemasukan'];
                            $saldofix -= $request['bku'][$i]['jumlahpengeluaran'];
                            $penerimaan += $request['bku'][$i]['jumlahpemasukan'];
                            $pengeluaran += $request['bku'][$i]['jumlahpengeluaran'];
                        }

                        $MA->tgljam = date('Y-m-d H:i:s');
                        $MA->penerimaan = $penerimaan;
                        $MA->pengeluaran = $pengeluaran;
                        $MA->saldo = $saldofix;
                        $MA->save();

                        for($x = 0; $x < count($request['bku']); $x++){
                            $MP = JasaGiro::where('norec', '=', $request['bku'][$x]['norec'])->first();
                            $MP->objectbkufk = $MA->norec;
                            $MP->save();
                        }
                    } else if($request['jenisbukti'] == 6){
                        $MA = new BKU();
                        $norecKS = $MA->generateNewId();
                        $MA->norec = $norecKS;
                        $MA->kdprofile = $idProfile;
                        $MA->statusenabled = true;
                        $noa = $this->generateCodeBKU(new BKU, 'nobku', $request['asalproduk'], 5, '', $idProfile);
                        $MA->nobku = $noa.'-B02';
                        $MA->objectjenisbuktifk = $request['jenisbukti'];
                        $MA->tglbku = $request['tglbku'];
                        $MA->uraianbku = $request['uraian'];
                        $MA->rekananfk = $request['rekananfk'];
                        $MA->objectasalprodukfk = $request['asalproduk'];

                        $MA->objectmataanggaranfk = null;

                        for($i = 0; $i < count($request['bku']); $i++){
                            $saldofix += $request['bku'][$i]['nilaists'];
                            $saldofix -= $request['bku'][$i]['nilaists'];
                            $penerimaan += $request['bku'][$i]['nilaists'];
                            $pengeluaran += $request['bku'][$i]['nilaists'];
                        }

                        $MA->tgljam = date('Y-m-d H:i:s');
                        $MA->penerimaan = $penerimaan;
                        $MA->pengeluaran = $pengeluaran;
                        $MA->saldo = $saldofix;
                        $MA->save();

                        for($x = 0; $x < count($request['bku']); $x++){
                            $MP = STSKeuangan::where('norec', '=', $request['bku'][$x]['norec'])->first();
                            $MP->objectbkufk = $MA->norec;
                            $MP->save();
                        }
                    } else if($request['jenisbukti'] == 4){
                        

                        for($i = 0; $i < count($request['bku']); $i++){
                            $saldoakhir = DB::select(DB::raw("select saldo from bukukasumum_t where statusenabled = true and kdprofile = 30 
                            order by tglbku desc limit 1"));
                            if(count($saldoakhir) == 0){
                                $saldofix = 0;
                            } else{
                                $saldofix = $saldoakhir[0]->saldo;
                            }

                            if($request['bku'][$i]['jenis'] == 'Pemungutan'){
                                $MA = new BKU();
                                $norecKS = $MA->generateNewId();
                                $MA->norec = $norecKS;
                                $MA->kdprofile = $idProfile;
                                $MA->statusenabled = true;
                                $noa = $this->generateCodeBKU(new BKU, 'nobku', $request['asalproduk'], 5, '', $idProfile);
                                $MA->nobku = $noa.'-B02';
                                $MA->objectjenisbuktifk = $request['jenisbukti'];
                                $MA->tglbku = $request['tglbku'];
                                $MA->uraianbku = $request['uraian'];
                                $MA->rekananfk = $request['rekananfk'];
                                $MA->objectasalprodukfk = $request['asalproduk'];
                                $MA->objectmataanggaranfk = $request['bku'][$i]['koderek'];
                                $MA->penerimaan = (int)$request['bku'][$i]['pph'] + (int)$request['bku'][$i]['ppn'];
                                $MA->pengeluaran = (int)$request['bku'][$i]['jumlahpengeluaran'];
                                $MA->saldo = (int)$saldofix + (int)$request['bku'][$i]['pph'] + (int)$request['bku'][$i]['ppn'] - (int)$request['bku'][$i]['jumlahpengeluaran'];
                                
                            } else if($request['bku'][$i]['jenis'] == 'Penyetoran'){
                                $MA->pengeluaran = (int)$request['bku'][$i]['pph'] + (int)$request['bku'][$i]['ppn'];
                                $MA->saldo = (((int)$request['bku'][$i]['pph'] + (int)$request['bku'][$i]['ppn']) - ((int)$request['bku'][$i]['pph'] + (int)$request['bku'][$i]['ppn']));
                            }

                            $MA->tgljam = date('Y-m-d H:i:s');
                            $MA->save();

                            if($request['bku'][$i]['jenis'] == 'Pemungutan'){
                                $MP = PemungutanPajak::where('norec', '=', $request['bku'][$i]['norec'])->first();
                                $MP->objectbkufk = $MA->norec;
                                $MP->save();
                            } else if($request['bku'][$i]['jenis'] == 'Penyetoran'){
                                $MP = PenyetoranPajak::where('norec', '=', $request['bku'][$i]['norec'])->first();
                                $MP->objectbkufk = $MA->norec;
                                $MP->save();
                            }
                        }
                    } else if($request['jenisbukti'] == 3){

                        $yes = 'no';

                        // dicomment karena jika ada pengembalian langsung ke $request['jenisbukti'] == 7
                        // for($y = 0; $y < count($request['bku']); $y++){
                        //     if($request['bku'][$y]['jumlahpengembalian'] != '0'){
                        //         $yes = 'oke';
                        //     }
                        // }

                        if($yes == 'oke'){
                            $MA = new BKU();
                            $norecKS = $MA->generateNewId();
                            $MA->norec = $norecKS;
                            $MA->kdprofile = $idProfile;
                            $MA->statusenabled = true;
                            $noa = $this->generateCodeBKU(new BKU, 'nobku', $request['asalproduk'], 5, '', $idProfile);
                            $MA->nobku = $noa.'-B02';
                            $MA->objectjenisbuktifk = $request['jenisbukti'];
                            $MA->tglbku = $request['tglbku'];
                            $MA->uraianbku = $request['uraian'];
                            $MA->rekananfk = $request['rekananfk'];
                            $MA->objectasalprodukfk = $request['asalproduk'];

                            $MA->objectmataanggaranfk = $request['bku'][0]['kodemataanggaran'];

                            for($i = 0; $i < count($request['bku']); $i++){
                                $saldofix -= $request['bku'][$i]['jumlah'];
                                $pengeluaran += $request['bku'][$i]['jumlah'];
                            }

                            $MA->tgljam = date('Y-m-d H:i:s');
                            $MA->penerimaan = 0;
                            $MA->pengeluaran = $pengeluaran;
                            $MA->saldo = $saldofix;
                            $MA->save();

                            for($x = 0; $x < count($request['bku']); $x++){
                                $MP = Panjar::where('norec', '=', $request['bku'][$x]['norec'])->first();
                                $MP->objectbkufk = $MA->norec;
                                $MP->save();
                            }




                            $MB = new BKU();
                            $norecKS = $MB->generateNewId();
                            $MB->norec = $norecKS;
                            $MB->kdprofile = $idProfile;
                            $MB->statusenabled = true;
                            $noa = $this->generateCodeBKU(new BKU, 'nobku', $request['asalproduk'], 5, '', $idProfile);
                            $MB->nobku = $noa.'-B02';
                            $MB->objectjenisbuktifk = $request['jenisbukti'];
                            $MB->tglbku = $request['tglbku'];
                            $MB->uraianbku = $request['uraian'];
                            $MB->rekananfk = $request['rekananfk'];
                            $MB->objectasalprodukfk = $request['asalproduk'];

                            $MB->objectmataanggaranfk = $request['bku'][0]['kodemataanggaran'];

                            for($i = 0; $i < count($request['bku']); $i++){
                                $saldofix += $request['bku'][$i]['jumlahpengembalian'];
                                $penerimaan += $request['bku'][$i]['jumlahpengembalian'];
                            }

                            $MB->tgljam = date('Y-m-d H:i:s');
                            $MB->penerimaan = $penerimaan;
                            $MB->pengeluaran = 0;
                            $MB->saldo = $saldofix;
                            $MB->save();

                            for($x = 0; $x < count($request['bku']); $x++){
                                $MQ = Pengembalian::where('objectpanjarfk', '=', $request['bku'][$x]['norec'])->first();
                                if(!empty($MQ)){
                                    $bla = Pengembalian::where('objectpanjarfk', '=', $request['bku'][$x]['norec'])->get();
                                    foreach ($bla as $ble) {
                                        $ble->objectbkufk = $MB->norec;
                                        $ble->save();
                                    }
                                }
                            }
                        } else if($yes == 'no'){
                            $MA = new BKU();
                            $norecKS = $MA->generateNewId();
                            $MA->norec = $norecKS;
                            $MA->kdprofile = $idProfile;
                            $MA->statusenabled = true;
                            $noa = $this->generateCodeBKU(new BKU, 'nobku', $request['asalproduk'], 5, '', $idProfile);
                            $MA->nobku = $noa.'-B02';
                            $MA->objectjenisbuktifk = $request['jenisbukti'];
                            $MA->tglbku = $request['tglbku'];
                            $MA->uraianbku = $request['uraian'];
                            $MA->rekananfk = $request['rekananfk'];
                            $MA->objectasalprodukfk = $request['asalproduk'];

                            $MA->objectmataanggaranfk = $request['bku'][0]['kodemataanggaran'];

                            for($i = 0; $i < count($request['bku']); $i++){
                                $saldofix -= $request['bku'][$i]['jumlah'];
                                $pengeluaran += $request['bku'][$i]['jumlah'];
                            }

                            $MA->tgljam = date('Y-m-d H:i:s');
                            $MA->penerimaan = 0;
                            $MA->pengeluaran = $pengeluaran;
                            $MA->saldo = $saldofix;
                            $MA->save();

                            for($x = 0; $x < count($request['bku']); $x++){
                                $MP = Panjar::where('norec', '=', $request['bku'][$x]['norec'])->first();
                                $MP->objectbkufk = $MA->norec;
                                $MP->save();
                            }
                        } 
                    }
                    else if($request['jenisbukti'] == 2){
                        $MA = new BKU();
                        $norecKS = $MA->generateNewId();
                        $MA->norec = $norecKS;
                        $MA->kdprofile = $idProfile;
                        $MA->statusenabled = true;
                        $noa = $this->generateCodeBKU(new BKU, 'nobku', $request['asalproduk'], 5, '', $idProfile);
                        $MA->nobku = $noa.'-B02';
                        $MA->objectjenisbuktifk = $request['jenisbukti'];
                        $MA->tglbku = $request['tglbku'];
                        $MA->uraianbku = $request['uraian'];
                        $MA->rekananfk = $request['rekananfk'];
                        $MA->objectasalprodukfk = $request['asalproduk'];

                        $MA->objectmataanggaranfk = $request['bku'][0]['kodemataanggaran'];

                        for($i = 0; $i < count($request['bku']); $i++){
                            if($request['bku'][$i]['carabayar'] == 'TRANSFER BANK'){
                                $saldofix -= $request['bku'][$i]['jumlahdibayarverif'];
                                $saldofix += $request['bku'][$i]['jumlahpanjar'];
                                $penerimaan += $request['bku'][$i]['jumlahpanjar'];
                                $pengeluaran += $request['bku'][$i]['jumlahdibayarverif'];
                            } else if($request['bku'][$i]['carabayar'] == 'PANJAR'){
                                $saldofix -=$request['bku'][$i]['jumlahpanjar'];;
                                $saldofix += $request['bku'][$i]['jumlahdibayarverif'];
                                $penerimaan += $request['bku'][$i]['jumlahdibayarverif'];
                                // $pengeluaran += $request['bku'][$i]['jumlahpanjar'];;
                                $pengeluaran += $request['bku'][$i]['jumlahdibayarverif'];
                            }
                        }

                        $MA->tgljam = date('Y-m-d H:i:s');
                        $MA->penerimaan = $penerimaan;
                        $MA->pengeluaran = $pengeluaran;
                        $MA->saldo = $saldofix;
                        $MA->save();

                        for($x = 0; $x < count($request['bku']); $x++){
                            $MP = StrukRealisasi::where('norec', '=', $request['bku'][$x]['norec'])->first();
                            $MP->objectbkufk = $MA->norec;
                            $MP->save();
                        }
                    }else if($request['jenisbukti'] == 7){
                        $MA = new BKU();
                            $norecKS = $MA->generateNewId();
                            $MA->norec = $norecKS;
                            $MA->kdprofile = $idProfile;
                            $MA->statusenabled = true;
                            $noa = $this->generateCodeBKU(new BKU, 'nobku', $request['asalproduk'], 5, '', $idProfile);
                            $MA->nobku = $noa.'-B02';
                            $MA->objectjenisbuktifk = $request['jenisbukti'];
                            $MA->tglbku = $request['tglbku'];
                            $MA->uraianbku = $request['uraian'];
                            $MA->rekananfk = $request['rekananfk'];
                            $MA->objectasalprodukfk = $request['asalproduk'];

                            $MA->objectmataanggaranfk = $request['bku'][0]['kodemataanggaran'];

                            
                            for($i = 0; $i < count($request['bku']); $i++){
                                $saldofix += $request['bku'][$i]['jumlahpengembalian'];
                                $penerimaan += $request['bku'][$i]['jumlahpengembalian'];
                            }

                            $MA->tgljam = date('Y-m-d H:i:s');
                            $MA->penerimaan = $penerimaan;
                            $MA->pengeluaran = 0;
                            $MA->saldo = $saldofix;
                            $MA->save();

                            // for($x = 0; $x < count($request['bku']); $x++){
                            //     $MP = Panjar::where('norec', '=', $request['bku'][$x]['norec'])->first();
                            //     $MP->objectbkufk = $MA->norec;
                            //     $MP->save();
                            // }


                            for($x = 0; $x < count($request['bku']); $x++){
                                $MQ = Pengembalian::where('objectpanjarfk', '=', $request['bku'][$x]['norec'])->first();
                                if(!empty($MQ)){
                                    $bla = Pengembalian::where('objectpanjarfk', '=', $request['bku'][$x]['norec'])->get();
                                    foreach ($bla as $ble) {
                                        $ble->objectbkufk = $MA->norec;
                                        $ble->save();
                                    }
                                }
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
                'as' => '@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    

    public function deleteTelemedicine(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        try{ 
                    $MA = Telemedicine::where('norec', '=', $request['norec'])->first();
                    $MA->statusenabled = false;
                    $MA->save();

           $transStatus = 'true';
       } catch (\Exception $e) {
            $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Hapus";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $MA,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
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

    public function deleteJurnal(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        try{ 
                    $MA = Jurnal::where('norec', '=', $request['norec'])->first();
                    $MA->statusenabled = false;
                    $MA->save();

           $transStatus = 'true';
       } catch (\Exception $e) {
            $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Hapus";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $MA,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
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

    public function deleteRetur(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        try{ 
                    $MA = Retur::where('norec', '=', $request['norec'])->first();
                    $MA->statusenabled = false;
                    $MA->save();

           $transStatus = 'true';
       } catch (\Exception $e) {
            $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Hapus";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $MA,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
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

    public function deleteJasgir(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        try{ 
                    $MA = JasaGiro::where('norec', '=', $request['norec'])->first();
                    $MA->statusenabled = false;
                    $MA->save();

           $transStatus = 'true';
       } catch (\Exception $e) {
            $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Hapus";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $MA,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
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

    public function deleteSTSKeuangan(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        try{ 
                    $MA = STSKeuangan::where('norec', '=', $request['norec'])->first();
                    $MA->statusenabled = false;
                    $MA->save();

           $transStatus = 'true';
       } catch (\Exception $e) {
            $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Hapus";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $MA,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
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

    public function deleteSumberPendapatan(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        try{ 
                    $MA = AsalProduk::where('id', '=', $request['id'])->first();
                    $MA->statusenabled = false;
                    $MA->save();

           $transStatus = 'true';
       } catch (\Exception $e) {
            $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Hapus";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $MA,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
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

    public function deleteUraianPendapatan(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        try{ 
                    $MA = UraianPendapatan::where('id', '=', $request['id'])->first();
                    $MA->statusenabled = false;
                    $MA->save();

           $transStatus = 'true';
       } catch (\Exception $e) {
            $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Hapus";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $MA,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
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

    public function deletePajak(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        try{        
            $MA = PemungutanPajak::where('objectspjfk', '=', $request['norec'])->where('kdprofile', '=', 30)->where('statusenabled', '=', true)->first();
            $MA->statusenabled = false;
            $MA->save();
            $MP = PenyetoranPajak::where('objectspjfk', '=', $request['norec'])->where('kdprofile', '=', 30)->where('statusenabled', '=', true)->first();
            $MP->statusenabled = false;
            $MP->save();
           $transStatus = 'true';
       } catch (\Exception $e) {
            $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Hapus";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $MA,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
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
        $thn = date("Y", strtotime($request['tglspm']) );
        $tgl = $request['tglspm'];
        try{
                if($request['norec'] == ''){
                    $SP = SPP::where('nospp', '=', $request['nospp'])->first();        
            
                    $MA = new SPM();
                    $norecKS = $MA->generateNewId();
                    $MA->norec = $norecKS;
                    $MA->kdprofile = $idProfile;
                    $MA->statusenabled = true;
                    $MA->objectsppfk = $SP->norec;
                    
                } else{
                    $MA = SPM::where('norec', '=', $request['norec'])->first();
                }

                    $noa = $this->generateCode(new SPM, 'noreg', 5, '', $kdProfile);
                    // $nos = $this->generateCodeBySeqTableSPP(new SPM, 'nospm', 5, '',$kdProfile, $thn, $tgl);

                    $runningNumber = RunningNumber::where('id',13544)->first();
                    $nomor = $runningNumber->nomer_terbaru +1;
                    $nos = str_pad((int)$nomor, 5, "0", STR_PAD_LEFT);

                    RunningNumber::where('id', 13544)
                    ->update(
                        [
                            'nomer_terbaru' => $nos
                        ]
                    );

                    $noSPM = '04.00/03.0/'.$nos.'/LS/1.02.2.22.0.00.01.0004/M/1/'.$thn;
                    $MA->nospm = $noSPM;
                    $MA->jenisbukti = $request['jenisbukti'];
                    $MA->untukpengeluaran = $request['untukpengeluaran'];
                    $MA->status = $request['status'];
                    $MA->tglspm = $request['tglspm'];
                    $MA->tglsah = $request['tglsah'];
                    $MA->nilaispm = $request['nilaispm'];
                    $MA->noreg = $nos;
                    $MA->objectasalprodukfk = $request['objectasalprodukfk'];

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
                if($request['norec'] == ''){
                    $MA = new SPD();
                    $norecKS = $MA->generateNewId();
                    $MA->norec = $norecKS;
                    $MA->kdprofile = $idProfile;
                    $MA->statusenabled = true;
                } else{
                    $MA = SPD::where('norec', '=', $request['norec'])->first();
                }
                    $MA->nospd = $request['nospd'];
                    $MA->tglspd = $request['tglspd'];
                    $MA->nilaispd = $request['nilaispd'];
                    $MA->objectasalprodukfk = $request['objectasalprodukfk'];

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

    public function savePihakKetiga(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        try{
                if($request['id'] == ''){
                    $newID = Rekanan::max('id');

                    $MA = new Rekanan();
                    $norecKS = $MA->generateNewId();
                    $MA->id = $newID+1;
                    $MA->kdprofile = $idProfile;
                    $MA->statusenabled = true;
                    $MA->norec = $norecKS;
                    $MA->kdrekanan = $newID+1;
                    $MA->qrekanan = $newID+1;
                    $MA->objectjenisrekananfk = 1;

                } else{
                    $MA = Rekanan::where('id', '=', $request['id'])->first();
                }
                    $MA->namarekanan = $request['namarekanan'];
                    $MA->npwp = $request['npwp'];
                    $MA->alamatlengkap = $request['alamat'];

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

    public function copyPermen(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        try{
                    $MA = MataAnggaran::where('id', '=', $request['idanggaran'])->first();
                    $MA->mataanggaranpermenfk = $request['idpermen'];

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

    public function PengembalianSPJ(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        try{
            $KB= StrukRealisasi::where('norec',$request['norec'])
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

    public function savePengembalian(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $thn = date("Y", strtotime($request['tglpengembalian']) );
        $tgl = date("n", strtotime($request['tglpengembalian']) );

        try{
            if($request['norec'] == ''){
                $MA = new Pengembalian();
                $MA->norec =  substr(\Webpatser\Uuid\Uuid::generate(), 0, 32);
                $MA->kdprofile = $idProfile;
                $MA->statusenabled = true;
                $nos = $this->generateCodeBySeqTable(new Pengembalian, 'nopengembalian', 6, ' ',$kdProfile);
                $noPengembalian = $nos.'/PJR/1.02.2.22.0.00.01.0004/'.$tgl.'/'.$thn;
                $MA->nopengembalian = $noPengembalian;
                
            } else{
                $MA = Pengembalian::where('norec', '=', $request['norec'])->first();
            }

                $MA->tglpengembalian = $request['tglpengembalian'];
                $MA->objectpanjarfk = $request['norecpanjar'];
                $MA->jumlahpengembalian = $request['jumlahpengembalian'];
                $MA->keterangan = $request['keterangan'];
                $MA->objectsubkegiatanfk = $request['idsubkegiatan'];
                $MA->objectsubsubkegiatanfk = $request['idsubsubkegiatan'];
                $MA->objectmataanggaranfk = $request['idmataanggaran'];
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

    public function saveVerifSPJ(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        try{
            $KB= StrukRealisasi::where('norec',$request['norec'])
                ->first();
            $KB->status = $request['statusverif'];
            $KB->tglverif = $request['tglverif'];
            $KB->objectcarabayarfk = $request['carabayar'];
            $KB->keterangan = $request['keterangan'];
            $KB->jumlahdibayarverif = $request['jumlahdibayarverif'];
            $KB->ppn = $request['ppn'];
            $KB->pph = $request['pph'];
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
        $nopanjar = $request['nopanjar'];

        $data = DB::select(DB::raw("
                select *
                from panjar_t 
                where nopanjar = '$nopanjar'
            ")
        );

        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
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

    public function deleteSPJ(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        try{
            $cek= StrukRealisasi::where('norec',$request['norec'])
                ->whereNotNull('tglverif')
                ->first();

            if(empty($cek)){
                $KB= StrukRealisasi::where('norec',$request['norec'])
                    ->first();
                $KB->statusenabled = false;
                $KB->save();

                $data = \DB::table('realisasidetail_t')->where('strukrealisasifk', $request['norec'])->where('kdprofile', $idProfile)->update([
                    'statusenabled'=> false
                ]);

                $transStatus = 'true';
            } else{
                $transStatus = 'false';
            }
            
       } catch (\Exception $e) {
            $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Hapus";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $cek,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Data Yang Sudah Diverif Tidak Bisa Dihapus";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'=> $transMessage,
                'as' => '@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function deleteSPD(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        try{
                $KB= SPD::where('norec',$request['norec'])
                    ->first();
                $KB->statusenabled = false;
                $KB->save();

                $transStatus = 'true';
            
       } catch (\Exception $e) {
            $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Hapus Berhasil";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'=> $transMessage,
                'as' => '@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function deletePihakKetiga(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        try{
                $KB= Rekanan::where('id',$request['id'])
                    ->first();
                $KB->statusenabled = false;
                $KB->save();

                $transStatus = 'true';
            
       } catch (\Exception $e) {
            $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Hapus Berhasil";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'=> $transMessage,
                'as' => '@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function deleteSPM(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        try{
                $KB= SPM::where('norec',$request['norec'])
                    ->first();
                $KB->statusenabled = false;
                $KB->save();

                $transStatus = 'true';
            
       } catch (\Exception $e) {
            $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Hapus Berhasil";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'=> $transMessage,
                'as' => '@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function deleteSPP(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        try{
                $KB= SPP::where('norec',$request['norec'])
                    ->first();
                $KB->statusenabled = false;
                $KB->save();

                $transStatus = 'true';
            
       } catch (\Exception $e) {
            $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Hapus Berhasil";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'=> $transMessage,
                'as' => '@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function deletePermenKelima(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        try{
                $KB= Permen::where('id',$request['norec'])
                    ->first();
                $KB->statusenabled = false;
                $KB->save();

                $transStatus = 'true';
            
       } catch (\Exception $e) {
            $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Hapus Berhasil";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'=> $transMessage,
                'as' => '@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function deletePermenKeempat(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        try{
                $KB= Permen::where('id',$request['norec'])
                    ->first();
                $KB->statusenabled = false;
                $KB->save();

                $transStatus = 'true';
            
       } catch (\Exception $e) {
            $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Hapus Berhasil";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'=> $transMessage,
                'as' => '@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function deletePanjar(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        try{
                $KB= Panjar::where('norec',$request['norec'])
                    ->first();
                $KB->statusenabled = false;
                $KB->save();

                $transStatus = 'true';
            
       } catch (\Exception $e) {
            $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Hapus Berhasil";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'=> $transMessage,
                'as' => '@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function deletePengembalian(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        try{
                $KB= Pengembalian::where('norec',$request['norec'])
                    ->first();
                $KB->statusenabled = false;
                $KB->save();

                $transStatus = 'true';
            
       } catch (\Exception $e) {
            $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Hapus Berhasil";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'=> $transMessage,
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

       try{
                $MA = new SettingAnggaran();
                $MA->norec =  substr(\Webpatser\Uuid\Uuid::generate(), 0, 32);
                $MA->kdprofile = $idProfile;
                $MA->statusenabled = true;
                $MA->kodeexternal = $MA->norec;
                $MA->namaexternal = $MA->norec;
                $MA->reportdisplay = $MA->norec;
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

            $data = \DB::table('settinganggaran_t')->where('norec', '!=', $MA->norec)->update([
                'statusenabled'=> false,
            ]);
    
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
            $MA->mataanggaranpermenfk = $request['mataanggaranpermenfk'];

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
            $MA->password = $request['password'];

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
        $idpegawai = $request['idpegawai'];

        $stahun = '';
        if(isset($request['tahun']) || $request['tahun'] != ''){
            $stahun = "and ka.tahun = '".$request['tahun']."'";
        }

        $stahap = '';
        $qtahap = '';
        if(isset($request['tahap']) && $request['tahap'] != '' && $request['tahap'] != 'undefined'){
            $stahap = "and kb.objecttahapfk = ".$request['tahap'];
            $qtahap = "and kt.objecttahapfk = ".$request['tahap'];
        }

        $skegiatan = '';
        if(isset($request['kegiatan']) && $request['kegiatan'] != '' && $request['kegiatan'] != 'undefined'){
            $skegiatan = "and kb.objectkegiatanfk = ".$request['kegiatan'];
        }
        $subkegiatan = '';
        if(isset($request['subkegiatan']) && $request['subkegiatan'] != '' && $request['subkegiatan'] != 'undefined'){
            $subkegiatan = "and dp0.kode = '$request[subkegiatan]'";
        }
        $subsubkegiatan = '';
        if(isset($request['subsubkegiatan']) && $request['subsubkegiatan'] != '' && $request['subsubkegiatan'] != 'undefined'){
            $subsubkegiatan = "and ka.kode = '$request[subsubkegiatan]'";
        }
        $smataanggaran = '';
        if(isset($request['mataanggaran']) && $request['mataanggaran'] != '' && $request['mataanggaran'] != 'undefined'){
            $smataanggaran = "and ma.kodemataanggaran = '".$request['mataanggaran']."'";
        }

        $snorec = '';
        if(isset($request['noreckegiatan']) && $request['noreckegiatan'] != '' && $request['noreckegiatan'] != 'undefined'){
            $snorec = "and kt.objectkegiatanfk = ".$request['noreckegiatan'];
        }

        $scek = '';
        if(isset($request['cek']) && $request['cek'] != '' && $request['cek'] != 'undefined'){
            if($request['cek'] == "false"){
                $scek = '';
            }
            else if($request['cek'] == "true"){
                $scek = "where total != 0";
            } 
            
        }

        //var_dump($scek);

        $data = DB::select(DB::raw("select * from(
                select ma.id, ma.kodemataanggaran,ma.namamataanggaran, coalesce(cast(sum(kt.subtotal) as float),0) as total
                , split_part(ma.kodemataanggaran, '.', 1) as subkodepertama
                , split_part(ma.kodemataanggaran, '.', 2) as subkodekedua
                , case when split_part(ma.kodemataanggaran, '.', 3) = '' then '0' else split_part(ma.kodemataanggaran, '.', 3)::int4 end as subkodeketiga
                , case when split_part(ma.kodemataanggaran, '.', 4) = '' then '0' else split_part(ma.kodemataanggaran, '.', 4)::int4 end as subkodekeempat
                , case when split_part(ma.kodemataanggaran, '.', 5) = '' then '0' else split_part(ma.kodemataanggaran, '.', 5)::int4 end as subkodekelima 
                from mataanggaran_m ma
                left JOIN keteranganbelanja_t kt on kt.objectmataanggaranfk=ma.id and kt.statusenabled = true
                $snorec
                where 
                length(ma.kodemataanggaran) in(9,10) 
                and ma.kdprofile=$idProfile
                and ma.statusenabled = true
                group by  ma.id,ma.kodemataanggaran,ma.namamataanggaran
                order by subkodepertama asc, subkodekedua asc, subkodeketiga asc, subkodekeempat asc, subkodekelima asc
                ) as x 
                $scek
                order by subkodepertama asc, subkodekedua asc, subkodeketiga asc, subkodekeempat asc, subkodekelima asc;
            ")
        );

        if(isset($request['idpegawai'])){
            if($request['idpegawai'] != ''){
                $dataKeteranganBelanja = DB::select(DB::raw("
                select kb.*,ma.kodemataanggaran || ' ' || ma.namamataanggaran as mataanggaran,
                ka.kode || ' ' || ka.keterangan as kegiatan,ap.asalproduk,
                ma.kodemataanggaran  
                , split_part(ma.kodemataanggaran, '.', 1) as subkodepertama
                , split_part(ma.kodemataanggaran, '.', 2) as subkodekedua
                , case when split_part(ma.kodemataanggaran, '.', 3) = '' then '0' else split_part(ma.kodemataanggaran, '.', 3)::int4 end as subkodeketiga
                , case when split_part(ma.kodemataanggaran, '.', 4) = '' then '0' else split_part(ma.kodemataanggaran, '.', 4)::int4 end as subkodekeempat
                , case when split_part(ma.kodemataanggaran, '.', 5) = '' then '0' else split_part(ma.kodemataanggaran, '.', 5)::int4 end as subkodekelima, 
                ma.namamataanggaran,ka.kode , ka.keterangan,ka.tahun,ta.tahap,
                dp0.kode kodesubkegiatan, dp0.keterangan keterangansubkegiatan,
                dp3.kode kodekegiatan, dp3.keterangan keterangankegiatan,
                dp1.kode kodeurusan, dp1.keterangan keteranganurusan 
                --,1 as jan,1 as feb,1 as mar, 1 as apr,
                --1 as mei,1 as juni, 1 as juli,1 as agst,1 as sep,1 as okt, 1 as nov,1 as des
                from keteranganbelanja_t kb
                INNER JOIN mataanggaran_m ma on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                inner join kegiatananggaran_m as dp3 on ka.kode ilike dp3.kode || '%' and dp3.div = 2
                inner join kegiatananggaran_m as dp2 on dp3.kode ilike dp2.kode || '%' and dp2.div = 1
                inner join kegiatananggaran_m as dp1 on dp2.kode ilike dp1.kode || '%' and dp1.div = 0
                inner join kegiatananggaran_m as dp0 on ka.kode ilike dp0.kode || '%' and dp0.div = 3
                INNER JOIN asalproduk_m ap on ap.id=kb.objectasalprodukfk
                INNER JOIN tahapanggaran_m ta on ta.id=kb.objecttahapfk
                --inner join settinganggaran_t sa on sa.objecttahapaktivfk = ta.id
                where kb.kdprofile = 30 and kb.statusenabled = true
                and ka.objectpptkfk = $idpegawai
                and ka.kdprofile = 30 and ka.statusenabled = true
                $stahun
                $subkegiatan
                $subsubkegiatan
                $stahap
                group by kb.norec, kb.kdprofile, kb.statusenabled, kb.objectkegiatanfk, kb.objectmataanggaranfk, kb.keteranganbelanja,
                ma.kodemataanggaran || ' ' || ma.namamataanggaran, kb.nourut, kb.jml, kb.hargasatuan, kb.subtotal, kb.satuan,
                kb.objectasalprodukfk, kb.objecttahapfk,
                ka.kode || ' ' || ka.keterangan,ap.asalproduk,
                ma.kodemataanggaran , ma.namamataanggaran,ka.kode , ka.keterangan,ka.tahun,ta.tahap,
                dp0.kode, dp0.keterangan,
                dp3.kode, dp3.keterangan,
                dp1.kode, dp1.keterangan
                order by subkodepertama asc, subkodekedua asc, subkodeketiga asc, subkodekeempat asc, subkodekelima asc"
                )
                );
            } else{
                $dataKeteranganBelanja = DB::select(DB::raw("
                select kb.*,ma.kodemataanggaran || ' ' || ma.namamataanggaran as mataanggaran,
                ka.kode || ' ' || ka.keterangan as kegiatan,ap.asalproduk,
                ma.kodemataanggaran , ma.namamataanggaran,ka.kode , ka.keterangan,ka.tahun,ta.tahap,
                dp0.kode kodesubkegiatan, dp0.keterangan keterangansubkegiatan,
                dp3.kode kodekegiatan, dp3.keterangan keterangankegiatan,
                dp1.kode kodeurusan, dp1.keterangan keteranganurusan
                , split_part(ma.kodemataanggaran, '.', 1) as subkodepertama
                , split_part(ma.kodemataanggaran, '.', 2) as subkodekedua
                , case when split_part(ma.kodemataanggaran, '.', 3) = '' then '0' else split_part(ma.kodemataanggaran, '.', 3)::int4 end as subkodeketiga
                , case when split_part(ma.kodemataanggaran, '.', 4) = '' then '0' else split_part(ma.kodemataanggaran, '.', 4)::int4 end as subkodekeempat
                , case when split_part(ma.kodemataanggaran, '.', 5) = '' then '0' else split_part(ma.kodemataanggaran, '.', 5)::int4 end as subkodekelima
                --,1 as jan,1 as feb,1 as mar, 1 as apr,
                --1 as mei,1 as juni, 1 as juli,1 as agst,1 as sep,1 as okt, 1 as nov,1 as des
                from keteranganbelanja_t kb
                INNER JOIN mataanggaran_m ma on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                inner join kegiatananggaran_m as dp3 on ka.kode ilike dp3.kode || '%' and dp3.div = 2
                inner join kegiatananggaran_m as dp2 on dp3.kode ilike dp2.kode || '%' and dp2.div = 1
                inner join kegiatananggaran_m as dp1 on dp2.kode ilike dp1.kode || '%' and dp1.div = 0
                inner join kegiatananggaran_m as dp0 on ka.kode ilike dp0.kode || '%' and dp0.div = 3
                INNER JOIN asalproduk_m ap on ap.id=kb.objectasalprodukfk
                INNER JOIN tahapanggaran_m ta on ta.id=kb.objecttahapfk
                --inner join settinganggaran_t sa on sa.objecttahapaktivfk = ta.id
                where kb.kdprofile = 30 and kb.statusenabled = true
                and ka.kdprofile = 30 and ka.statusenabled = true
                $stahun
                $stahap
                $subkegiatan
                $subsubkegiatan
                group by kb.norec, kb.kdprofile, kb.statusenabled, kb.objectkegiatanfk, kb.objectmataanggaranfk, kb.keteranganbelanja,
                ma.kodemataanggaran || ' ' || ma.namamataanggaran, kb.nourut, kb.jml, kb.hargasatuan, kb.subtotal, kb.satuan,
                kb.objectasalprodukfk, kb.objecttahapfk,
                ka.kode || ' ' || ka.keterangan,ap.asalproduk,
                ma.kodemataanggaran , ma.namamataanggaran,ka.kode , ka.keterangan,ka.tahun,ta.tahap,
                dp0.kode, dp0.keterangan,
                dp3.kode, dp3.keterangan,
                dp1.kode, dp1.keterangan
                order by subkodepertama asc, subkodekedua asc, subkodeketiga asc, subkodekeempat asc, subkodekelima asc"
                )
                );
            }
        } else{
            $dataKeteranganBelanja = DB::select(DB::raw("
                select kb.*,ma.kodemataanggaran || ' ' || ma.namamataanggaran as mataanggaran,
                ka.kode || ' ' || ka.keterangan as kegiatan,ap.asalproduk,
                ma.kodemataanggaran , ma.namamataanggaran,ka.kode , ka.keterangan,ka.tahun,ta.tahap,
                dp0.kode kodesubkegiatan, dp0.keterangan keterangansubkegiatan,
                dp3.kode kodekegiatan, dp3.keterangan keterangankegiatan,
                dp1.kode kodeurusan, dp1.keterangan keteranganurusan
                , split_part(ma.kodemataanggaran, '.', 1) as subkodepertama
                , split_part(ma.kodemataanggaran, '.', 2) as subkodekedua
                , case when split_part(ma.kodemataanggaran, '.', 3) = '' then '0' else split_part(ma.kodemataanggaran, '.', 3)::int4 end as subkodeketiga
                , case when split_part(ma.kodemataanggaran, '.', 4) = '' then '0' else split_part(ma.kodemataanggaran, '.', 4)::int4 end as subkodekeempat
                , case when split_part(ma.kodemataanggaran, '.', 5) = '' then '0' else split_part(ma.kodemataanggaran, '.', 5)::int4 end as subkodekelima
                --,1 as jan,1 as feb,1 as mar, 1 as apr,
                --1 as mei,1 as juni, 1 as juli,1 as agst,1 as sep,1 as okt, 1 as nov,1 as des
                from keteranganbelanja_t kb
                INNER JOIN mataanggaran_m ma on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                inner join kegiatananggaran_m as dp3 on ka.kode ilike dp3.kode || '%' and dp3.div = 2
                inner join kegiatananggaran_m as dp2 on dp3.kode ilike dp2.kode || '%' and dp2.div = 1
                inner join kegiatananggaran_m as dp1 on dp2.kode ilike dp1.kode || '%' and dp1.div = 0
                inner join kegiatananggaran_m as dp0 on ka.kode ilike dp0.kode || '%' and dp0.div = 3
                INNER JOIN asalproduk_m ap on ap.id=kb.objectasalprodukfk
                INNER JOIN tahapanggaran_m ta on ta.id=kb.objecttahapfk
                --inner join settinganggaran_t sa on sa.objecttahapaktivfk = ta.id
                where kb.kdprofile = 30 and kb.statusenabled = true
                and ka.kdprofile = 30 and ka.statusenabled = true
                $stahun
                $subkegiatan
                $subsubkegiatan
                $stahap
                group by kb.norec, kb.kdprofile, kb.statusenabled, kb.objectkegiatanfk, kb.objectmataanggaranfk, kb.keteranganbelanja,
                ma.kodemataanggaran || ' ' || ma.namamataanggaran, kb.nourut, kb.jml, kb.hargasatuan, kb.subtotal, kb.satuan,
                kb.objectasalprodukfk, kb.objecttahapfk,
                ka.kode || ' ' || ka.keterangan,ap.asalproduk,
                ma.kodemataanggaran , ma.namamataanggaran,ka.kode , ka.keterangan,ka.tahun,ta.tahap,
                dp0.kode, dp0.keterangan,
                dp3.kode, dp3.keterangan,
                dp1.kode, dp1.keterangan
                order by subkodepertama asc, subkodekedua asc, subkodeketiga asc, subkodekeempat asc, subkodekelima asc"
            )
            );
        }

        
        $arrALokasi = [];
        foreach($dataKeteranganBelanja as $item){
            $dataAlokasi = DB::table('alokasiketeranganbelanja_t as ap')
            ->join('keteranganbelanja_t as kb', 'ap.keteranganbelanjafk', '=', 'kb.norec')
            ->join('mataanggaran_m as ma', 'ma.id', '=', 'kb.objectmataanggaranfk')
            ->select('ap.norec', 'ap.keteranganbelanjafk', 'ap.bulanint', 'ap.nilai', 'ma.kodemataanggaran')
            ->where('ap.statusenabled',true)
            ->where('ap.keteranganbelanjafk',$item->norec)
            ->groupBy('ap.norec', 'ap.keteranganbelanjafk', 'ap.bulanint', 'ap.nilai', 'ma.kodemataanggaran')
            ->get();    
            $arrALokasi[] = $dataAlokasi;
        }
        $pegawai = '';
        if(isset($request['idpegawai']) && $request['idpegawai']!= ''){
            $pegawai = "and ka.objectpptkfk = $request[idpegawai]";
        }
        $dataAlokasiMataanggaran = DB::select(DB::raw("select rank()over(order by split_part(kode, '.', 1) asc, split_part(kode, '.', 2)asc,  split_part(kode, '.', 3)asc, split_part(kode, '.', 4)asc, split_part(kode, '.', 5)asc, split_part(kode, '.', 6)::int asc, split_part(kode, '.', 7)::int asc ) as nomor ,kegiatan, kodesubkegiatan, keterangansubkegiatan, kode, keterangan, tahun, tahap, kodemataanggaran, namamataanggaran, mataanggaran, sum(subtotal) subtotal, sum(jan::float8) jan, sum(feb::float8) feb, sum(mar::float8) mar,
        sum(apr::float8) apr, sum(mei::float8) mei, sum(jun::float8) jun, sum(jul::float8) jul, sum(agt::float8) agt, sum(sep::float8) sep,
        sum(okt::float8) okt, sum(nov::float8) nov, sum(des::float8) des,
        coalesce(sum(jan::float8) + sum(feb::float8) + sum(mar::float8) +
        sum(apr::float8) + sum(mei::float8) + sum(jun::float8) + sum(jul::float8) + sum(agt::float8) +
        sum(sep::float8) + sum(okt::float8) + sum(nov::float8) + sum(des::float8), 0) totalbulanan,
        subkodepertama, subkodekedua, subkodeketiga, subkodekeempat, subkodekelima, islockangkas
        from(
		select norec, kodesubkegiatan, keterangansubkegiatan, kode, keterangan, tahun, tahap, kegiatan, kodemataanggaran, namamataanggaran, mataanggaran, subtotal, sum(jan::float8) jan, sum(feb::float8) feb, sum(mar::float8) mar,
        sum(apr::float8) apr, sum(mei::float8) mei, sum(jun::float8) jun, sum(jul::float8) jul, sum(agt::float8) agt, sum(sep::float8) sep,
        sum(okt::float8) okt, sum(nov::float8) nov, sum(des::float8) des,
        subkodepertama, subkodekedua, subkodeketiga, subkodekeempat, subkodekelima, islockangkas
        from(
            select ka.islockangkas, kb.norec, dp0.kode kodesubkegiatan, dp0.keterangan keterangansubkegiatan, ka.kode, ka.keterangan, ka.tahun, ta.tahap, kb.subtotal, ka.kode || ' ' || ka.keterangan as kegiatan, ma.kodemataanggaran, ma.namamataanggaran,
            ma.kodemataanggaran || ' - ' || ma.namamataanggaran mataanggaran, 
            case when ap.bulanint = 1 then coalesce(ap.nilai, '0') end as jan,
            case when ap.bulanint = 2 then coalesce(ap.nilai, '0') end as feb,
            case when ap.bulanint = 3 then coalesce(ap.nilai, '0') end as mar,
            case when ap.bulanint = 4 then coalesce(ap.nilai, '0') end as apr,
            case when ap.bulanint = 5 then coalesce(ap.nilai, '0') end as mei,
            case when ap.bulanint = 6 then coalesce(ap.nilai, '0') end as jun,
            case when ap.bulanint = 7 then coalesce(ap.nilai, '0') end as jul,
            case when ap.bulanint = 8 then coalesce(ap.nilai, '0') end as agt,
            case when ap.bulanint = 9 then coalesce(ap.nilai, '0') end as sep,
            case when ap.bulanint = 10 then coalesce(ap.nilai, '0') end as okt,
            case when ap.bulanint = 11 then coalesce(ap.nilai, '0') end as nov,
            case when ap.bulanint = 12 then coalesce(ap.nilai, '0') end as des
            , split_part(ma.kodemataanggaran, '.', 1) as subkodepertama
            , split_part(ma.kodemataanggaran, '.', 2) as subkodekedua
            , case when split_part(ma.kodemataanggaran, '.', 3) = '' then '0' else split_part(ma.kodemataanggaran, '.', 3)::int4 end as subkodeketiga
            , case when split_part(ma.kodemataanggaran, '.', 4) = '' then '0' else split_part(ma.kodemataanggaran, '.', 4)::int4 end as subkodekeempat
            , case when split_part(ma.kodemataanggaran, '.', 5) = '' then '0' else split_part(ma.kodemataanggaran, '.', 5)::int4 end as subkodekelima
            from keteranganbelanja_t as kb 
            left join alokasiketeranganbelanja_t as ap on ap.keteranganbelanjafk = kb.norec
            and ap.statusenabled = true
            and ap.kdprofile = 30
            inner join mataanggaran_m as ma on ma.id = kb.objectmataanggaranfk
            inner join kegiatananggaran_m ka on ka.id = kb.objectkegiatanfk 
            inner join kegiatananggaran_m as dp0 on ka.kode ilike dp0.kode || '%' and dp0.div = 3
            inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk
            where ka.statusenabled = true
            and ka.kdprofile = 30
            and kb.statusenabled = true
            and kb.kdprofile = 30
            and dp0.statusenabled = true
            and dp0.kdprofile = 30
            and ma.statusenabled = true
            and ma.kdprofile = 30
            $stahun
            $stahap
            $subkegiatan
                $subsubkegiatan
            $smataanggaran
            $pegawai
            group by ka.islockangkas, kb.norec, dp0.kode, dp0.keterangan, ka.kode, ka.keterangan, ka.tahun, ta.tahap, kb.subtotal, ka.kode || ' ' || ka.keterangan, ap.nilai, ap.bulanint, ma.kodemataanggaran, ma.namamataanggaran,
            ma.kodemataanggaran || ' - ' || ma.namamataanggaran
            order by subkodepertama asc, subkodekedua asc, subkodeketiga asc, subkodekeempat asc, subkodekelima asc
        ) as x group by islockangkas, norec, kodesubkegiatan, keterangansubkegiatan, kode, keterangan, tahun, tahap, subtotal, kegiatan, kodemataanggaran, namamataanggaran, mataanggaran, subkodepertama, subkodekedua, subkodeketiga, subkodekeempat, subkodekelima
        order by subkodepertama asc, subkodekedua asc, subkodeketiga asc, subkodekeempat asc, subkodekelima asc
) as y group by islockangkas, kodesubkegiatan, keterangansubkegiatan, kode, keterangan, tahun, tahap, kegiatan, kodemataanggaran, namamataanggaran, mataanggaran, subkodepertama, subkodekedua, subkodeketiga, subkodekeempat, subkodekelima
order by  split_part(kode, '.', 1)asc, split_part(kode, '.', 2)asc,  split_part(kode, '.', 3)asc, split_part(kode, '.', 4)asc, split_part(kode, '.', 5)asc, split_part(kode, '.', 6)::int asc, split_part(kode, '.', 7)::int asc,  subkodepertama asc, subkodekedua asc, subkodeketiga asc, subkodekeempat asc, subkodekelima asc
"));

        $detailalokasimataanggaran = DB::select(DB::raw("select norec, keteranganbelanja, kodesubkegiatan, keterangansubkegiatan, kode, keterangan, tahun, tahap, kegiatan, kodemataanggaran, namamataanggaran, mataanggaran, subtotal, sum(jan::float8) jan, sum(feb::float8) feb, sum(mar::float8) mar,
        sum(apr::float8) apr, sum(mei::float8) mei, sum(jun::float8) jun, sum(jul::float8) jul, sum(agt::float8) agt, sum(sep::float8) sep,
        sum(okt::float8) okt, sum(nov::float8) nov, sum(des::float8) des
        from(
            select kb.norec, kb.keteranganbelanja, dp0.kode kodesubkegiatan, dp0.keterangan keterangansubkegiatan, ka.kode, ka.keterangan, ka.tahun, ta.tahap, kb.subtotal, ka.kode || ' ' || ka.keterangan as kegiatan, ma.kodemataanggaran, ma.namamataanggaran,
            ma.kodemataanggaran || ' - ' || ma.namamataanggaran mataanggaran, 
            case when ap.bulanint = 1 then coalesce(ap.nilai, '0') end as jan,
            case when ap.bulanint = 2 then coalesce(ap.nilai, '0') end as feb,
            case when ap.bulanint = 3 then coalesce(ap.nilai, '0') end as mar,
            case when ap.bulanint = 4 then coalesce(ap.nilai, '0') end as apr,
            case when ap.bulanint = 5 then coalesce(ap.nilai, '0') end as mei,
            case when ap.bulanint = 6 then coalesce(ap.nilai, '0') end as jun,
            case when ap.bulanint = 7 then coalesce(ap.nilai, '0') end as jul,
            case when ap.bulanint = 8 then coalesce(ap.nilai, '0') end as agt,
            case when ap.bulanint = 9 then coalesce(ap.nilai, '0') end as sep,
            case when ap.bulanint = 10 then coalesce(ap.nilai, '0') end as okt,
            case when ap.bulanint = 11 then coalesce(ap.nilai, '0') end as nov,
            case when ap.bulanint = 12 then coalesce(ap.nilai, '0') end as des
            from keteranganbelanja_t as kb 
            left join alokasiketeranganbelanja_t as ap on ap.keteranganbelanjafk = kb.norec
            and ap.statusenabled = true
            and ap.kdprofile = 30
            inner join mataanggaran_m as ma on ma.id = kb.objectmataanggaranfk
            inner join kegiatananggaran_m ka on ka.id = kb.objectkegiatanfk 
            inner join kegiatananggaran_m as dp0 on ka.kode ilike dp0.kode || '%' and dp0.div = 3
            inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk
            where ka.statusenabled = true
            and ka.kdprofile = 30
            and kb.statusenabled = true
            and kb.kdprofile = 30
            and dp0.statusenabled = true
            and dp0.kdprofile = 30
            and ma.statusenabled = true
            and ma.kdprofile = 30
            $stahun
            $subkegiatan
                $subsubkegiatan
            $stahap
            group by kb.norec, kb.keteranganbelanja, dp0.kode, dp0.keterangan, ka.kode, ka.keterangan, ka.tahun, ta.tahap, kb.subtotal, ka.kode || ' ' || ka.keterangan, ap.nilai, ap.bulanint, ma.kodemataanggaran, ma.namamataanggaran,
            ma.kodemataanggaran || ' - ' || ma.namamataanggaran
        ) as x group by norec, keteranganbelanja, kodesubkegiatan, keterangansubkegiatan, kode, keterangan, tahun, tahap, subtotal, kegiatan, kodemataanggaran, namamataanggaran, mataanggaran
        order by kodemataanggaran"));

        $dataAsalProduk = DB::table('asalproduk_m as ap')
            ->select('ap.id','ap.asalproduk')
            ->where('ap.statusenabled',true)
            ->where('ap.isanggaran',true)
            ->orderBy('ap.asalproduk')
            ->get();

        $asalproduk = DB::select(DB::raw("select ap.id, ap.asalproduk
        from kegiatananggaran_m as dp 
        inner join keteranganbelanja_t as kb on kb.objectkegiatanfk = dp.id
        inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk 
        inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
        where kb.kdprofile = 30 and kb.statusenabled = true 
        and dp.kdprofile = 30 and dp.statusenabled = true 
        and ap.kdprofile = 30 and ap.statusenabled = true 
        $stahap
        $skegiatan
        $smataanggaran
        group by ap.id, ap.asalproduk"));

        $result = array(
            'data' => $data,
            'keteranganbelanja' => $dataKeteranganBelanja,
            'asalproduk' => $dataAsalProduk,
            'alokasimataanggaran' => $dataAlokasiMataanggaran,
            'detailalokasimataanggaran' => $detailalokasimataanggaran,
            'asal' => $asalproduk,
            'alokasi' => $arrALokasi,
            'message' => '@epic',
        );

        return $this->respond($result);
    }


    public function getTotalKeterangan(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $tahap = $request['tahap'];
        $rekening = $request['rekening'];
        $subsubkegiatan = '';

        if(isset($request['subsubkegiatan']) && $request['subsubkegiatan'] != "undefined" && $request['subsubkegiatan'] != ""){
            $subsubkegiatan = 'and ka.id = '.$request['subsubkegiatan'];
        }

        $settingRBA = DB::table('settinganggaran_t')
            ->where('statusenabled', true)
            ->where('kdprofile', 30)
            ->first();

        $data = DB::select(DB::raw("
        select coalesce(sum(kb.subtotal),0) totalketerangan
        from kegiatananggaran_m ka 
        inner join keteranganbelanja_t kb on ka.id = kb.objectkegiatanfk
        inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
        where kb.objecttahapfk = ".$tahap."
        and ma.kodemataanggaran = '$rekening'
        $subsubkegiatan
        and kb.statusenabled = TRUE
        and kb.kdprofile = 30    ")
        );

        // cari kode kegiatan
        $cari = DB::table('kegiatananggaran_m')->where('id', $request['subsubkegiatan'])->first();

        // query detail baru
        $detail = DB::select(DB::raw("
            select
                coalesce(sum(rd.subtotal),
                0) totalrealisasidetail
            from
                kegiatananggaran_m ka
            inner join keteranganbelanja_t kb on
                ka.id = kb.objectkegiatanfk
            inner join realisasidetail_t rd on
                rd.keteranganbelanjafk = kb.norec
            inner join mataanggaran_m ma on
                ma.id = kb.objectmataanggaranfk
            where
                ma.kodemataanggaran = '".$rekening."'
                and ka.kode = '".$cari->kode."'
                and ka.tahun = '".$settingRBA->tahunanggaran."'
                and rd.statusenabled = true
                and rd.kdprofile = 30
        "));

        // $detail = DB::select(DB::raw("
        // select coalesce(sum(rd.subtotal),0) totalrealisasidetail
        // from kegiatananggaran_m ka 
        // inner join keteranganbelanja_t kb on ka.id = kb.objectkegiatanfk
        // inner join realisasidetail_t rd on rd.keteranganbelanjafk = kb.norec
        // inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
        // where kb.objecttahapfk = $tahap
        // and ma.kodemataanggaran = '$rekening'
        // $subsubkegiatan
        // and rd.statusenabled = true
        // and rd.kdprofile = 30;
        //     ")
        // );

        $panjar = DB::select(DB::raw("select pj.norec, pj.jumlah, coalesce(pj.jumlahpengembalian, 0) jumlahpengembalian
        from kegiatananggaran_m ka 
        inner join keteranganbelanja_t kb on ka.id = kb.objectkegiatanfk
        inner join realisasidetail_t rd on rd.keteranganbelanjafk = kb.norec
        inner join strukrealisasi_t sr on sr.norec = rd.strukrealisasifk
        inner join panjar_t pj on pj.norec =  sr.objectpanjarfk
        inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
        where kb.objecttahapfk = $tahap
        and ma.kodemataanggaran = '$rekening'
        $subsubkegiatan
        group by pj.norec, pj.jumlah, pj.jumlahpengembalian"));

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
                select ma.namamataanggaran, pj.objectbkufk, pj.pph, pj.pph2, pj.ppn, jp.id idpajak, jp.jenispajak, ma.kodemataanggaran kodemataanggaran, ma.namamataanggaran namamataanggaran, kasub.id idsubkegiatan, 
                kasubsub.id idsubsubkegiatan, kasub.keterangan keterangansubkegiatan, kasubsub.keterangan keterangansubsubkegiatan, 
                pj.norec, pj.nopanjar, pj.uraian, pj.tglpanjar, pj.jumlah, pj.jenispanjar, coalesce(pj.jumlahpengembalian, 0) jumlahpengembalian, pj.sumberpanjar,
                pj.idbill, pj.ntpn, pj.idbillpph, pj.ntpnpph, pj.idbillpph2, pj.ntpnpph2, jp2.id idpajak2, jp2.jenispajak jenispajak2
                from panjar_t pj
                inner join kegiatananggaran_m kasub on kasub.id = pj.objectsubkegiatanfk
                inner join kegiatananggaran_m kasubsub on kasubsub.id = pj.objectsubsubkegiatanfk
                inner join mataanggaran_m ma on ma.id = pj.objectmataanggaranfk
                left join jenispajak_m jp on jp.id = pj.objectjenispphfk
                left join jenispajak_m jp2 on jp2.id = pj.objectjenispphfk2
                and jp.kdprofile = 30
                and jp.statusenabled = true
                where pj.kdprofile = 30
                and pj.statusenabled = true
                and kasub.kdprofile = 30
                and kasub.statusenabled = true
                and kasubsub.kdprofile = 30
                and kasubsub.statusenabled = true
                and ma.kdprofile = 30
                and ma.statusenabled = true;
            ")
        );

        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }

    public function getTotalBelanja(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $norec = $request['norec'];

        $data = DB::select(DB::raw("
        select sum(rd.subtotal) total
        from strukrealisasi_t sr
        inner join realisasidetail_t rd on rd.strukrealisasifk = sr.norec
        where sr.norec = '$norec'
        and rd.statusenabled = true
        and rd.kdprofile = 30;
            ")
        );

        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }

    public function getPPTK(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $id = $request['id'];
        $tahun = $request['tahun'];
        $kode = $request['kode'];
        $data = DB::select(DB::raw("
                select ka.*, pg.namalengkap
                from kegiatananggaran_m ka
                inner join pegawai_m pg on pg.id = ka.objectpptkfk  
                where ka.kdprofile = 30
                and ka.statusenabled = true
                and ka.id = $id and tahun = '$tahun';
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
        $kode = $request['kodemataanggaran'];

        $data = DB::select(DB::raw("
        select pj.norec norecpanjar, ma.id idmataanggaran, ma.kodemataanggaran, subkeg.id idsubkegiatan, subkeg.keterangan subkegiatan, subsubkeg.id idsubsubkegiatan, subsubkeg.keterangan subsubkegiatan, pj.nopanjar, pj.uraian, pj.tglpanjar, pj.jumlah, pj.jenispanjar, pj.jumlahpengembalian, pj.sumberpanjar
        from panjar_t pj
        inner join mataanggaran_m ma on ma.id = pj.objectmataanggaranfk
        inner join kegiatananggaran_m subkeg on subkeg.id = pj.objectsubkegiatanfk
        inner join kegiatananggaran_m subsubkeg on subsubkeg.id = pj.objectsubsubkegiatanfk
        where pj.kdprofile = 30
        and pj.statusenabled = true
        and ma.kdprofile = 30
        and ma.statusenabled = true
        and subkeg.kdprofile = 30
        and subkeg.statusenabled = true
        and subsubkeg.kdprofile = 30
        and subsubkeg.statusenabled = true
        --and ma.kodemataanggaran = '$kode'--munculkan semunya 23-042024
        ")
        );

        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }

    public function getPanjarDipilih(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $norec = $request['norecspj'];

        $data = DB::select(DB::raw("select stp.nourut, pj.norec norecpanjar, ma.id idmataanggaran, ma.kodemataanggaran, subkeg.id idsubkegiatan, subkeg.keterangan subkegiatan, subsubkeg.id idsubsubkegiatan, subsubkeg.keterangan subsubkegiatan, pj.nopanjar, pj.uraian, pj.tglpanjar, pj.jumlah, pj.jenispanjar, pj.jumlahpengembalian, pj.sumberpanjar
                    from panjar_t pj
                inner join spjtopanjar_t stp on stp.objectpanjarfk = pj.norec
                inner join mataanggaran_m ma on ma.id = pj.objectmataanggaranfk
                inner join kegiatananggaran_m subkeg on subkeg.id = pj.objectsubkegiatanfk
                inner join kegiatananggaran_m subsubkeg on subsubkeg.id = pj.objectsubsubkegiatanfk
                where pj.kdprofile = 30
                and pj.statusenabled = true
                and ma.kdprofile = 30
                and ma.statusenabled = true
                and stp.kdprofile = 30
                and stp.statusenabled = true
                and subkeg.kdprofile = 30
                and subkeg.statusenabled = true
                and subsubkeg.kdprofile = 30
                and subsubkeg.statusenabled = true
                and stp.objectspjfk = '$norec'
                order by stp.nourut
            ")
        );

        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }

    public function getPengembalianPanjar(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $norec = $request['norec'];

        $data = DB::select(DB::raw("
        select pj.nopengembalian, ma.id idmataanggaran, ma.kodemataanggaran, subkeg.id idsubkegiatan, subkeg.keterangan subkegiatan, subsubkeg.id idsubsubkegiatan, subsubkeg.keterangan subsubkegiatan, pj.norec, pj.tglpengembalian, pj.jumlahpengembalian, pj.keterangan
        from pengembalianpanjar_t pj
        inner join mataanggaran_m ma on ma.id = pj.objectmataanggaranfk
        inner join kegiatananggaran_m subkeg on subkeg.id = pj.objectsubkegiatanfk
        inner join kegiatananggaran_m subsubkeg on subsubkeg.id = pj.objectsubsubkegiatanfk
        where pj.kdprofile = 30
        and pj.statusenabled = true
        and pj.objectpanjarfk = '$norec'")
        );

        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }

    public function getPengembalianBKU(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $norec = $request['norec'];

        $data = DB::select(DB::raw("
        select ma.id idmataanggaran, ma.kodemataanggaran, subkeg.id idsubkegiatan, subkeg.keterangan subkegiatan, subsubkeg.id idsubsubkegiatan, subsubkeg.keterangan subsubkegiatan, pj.norec, pj.tglpengembalian, pj.jumlahpengembalian, pj.keterangan
        from pengembalianpanjar_t pj
        inner join mataanggaran_m ma on ma.id = pj.objectmataanggaranfk
        inner join kegiatananggaran_m subkeg on subkeg.id = pj.objectsubkegiatanfk
        inner join kegiatananggaran_m subsubkeg on subsubkeg.id = pj.objectsubsubkegiatanfk
        where pj.kdprofile = 30
        and pj.statusenabled = true
        and pj.objectbkufk = '$norec'")
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
        select sum(pj.jumlah) jumlah
        from panjar_t pj
        inner join spjtopanjar_t stp on stp.objectpanjarfk = pj.norec
        inner join strukrealisasi_t sr on stp.objectspjfk = sr.norec
        where sr.norec = '$norec'
        and pj.kdprofile = 30
        and pj.statusenabled = true
        and stp.kdprofile = 30
        and stp.statusenabled = true
        and sr.kdprofile = 30
        and sr.statusenabled = true
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
        where namamataanggaran = '$namamataanggaran'
        and statusenabled = true
        and kdprofile = 30;
            ")
        );

        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }

    public function getLockSPJ(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tahun = $request['tahun'];

        $qsub = '';
        if(isset($request['subsubkegiatan']) && $request['subsubkegiatan'] != "undefined" && $request['subsubkegiatan'] != ""){
            $qsub = "and dp.id = ".$request['subsubkegiatan'];
        }

        $qthp = '';
        if(isset($request['tahap']) && $request['tahap'] != "undefined" && $request['tahap'] != ""){
            $qthp = "and ta.id = ".$request['tahap'];
        }

        $qtahun = '';
        if(isset($request['tahun']) && $request['tahun'] != "undefined" && $request['tahun'] != ""){
            $qtahun = "and dp.tahun = '".$request['tahun']."'";
        }

        $data = DB::select(DB::raw("select dp.norec, ta.id idtahap, ta.tahap, dp0.kode kodesubkegiatan, dp0.keterangan keterangansubkegiatan, dp0.id idsubkegiatan,
        dp.kode kodesubsubkegiatan, dp.keterangan keterangansubsubkegiatan, dp.id idsubsubkegiatan,
        dp0.keterangan || ' ~ ' || dp.keterangan as text, dp.tahun, dp.islock, dp.islockrba
        from kegiatananggaran_m as dp  
        inner join kegiatananggaran_m as dp0 on dp.kode ilike dp0.kode || '%' and dp0.div = 3
        inner join keteranganbelanja_t kb on kb.objectkegiatanfk = dp.id
        inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk
        where dp.statusenabled = true
        and dp.kdprofile = 30
        and dp.div = 4
        and dp0.statusenabled = true
        and dp0.kdprofile = 30
        and kb.statusenabled = true
        and kb.kdprofile = 30
        and ta.statusenabled = true
        and ta.kdprofile = 30 
        $qtahun
        $qthp
        $qsub 
        group by dp.norec, ta.id, ta.tahap, dp0.kode, dp0.keterangan, dp0.id, dp.tahun, dp.islock,
        dp.kode, dp.keterangan, dp.id, dp0.keterangan || ' ~ ' || dp.keterangan, dp.islockrba
            ")
        );

        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }

    public function getLockSPJPerRekening(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $id = $request['subsubkegiatan'];

        $qmata = '';
        if(isset($request['mataanggaran']) && $request['mataanggaran'] != "undefined" && $request['mataanggaran'] != ""){
            $qmata = "and ma.kodemataanggaran = '".$request['mataanggaran']."'";
        }

        $data = DB::select(DB::raw("select '' iscekrekening, dp.tahun, dp.keterangan, dp.id idsubsubkegiatan, kb.islock, ma.id idmataanggaran, ma.kodemataanggaran, ma.namamataanggaran
        , split_part(ma.kodemataanggaran, '.', 1) as subkodepertama
        , split_part(ma.kodemataanggaran, '.', 2) as subkodekedua
        , case when split_part(ma.kodemataanggaran, '.', 3) = '' then '0' else split_part(ma.kodemataanggaran, '.', 3)::int4 end as subkodeketiga
        , case when split_part(ma.kodemataanggaran, '.', 4) = '' then '0' else split_part(ma.kodemataanggaran, '.', 4)::int4 end as subkodekeempat
        , case when split_part(ma.kodemataanggaran, '.', 5) = '' then '0' else split_part(ma.kodemataanggaran, '.', 5)::int4 end as subkodekelima
        from kegiatananggaran_m as dp 
        inner join keteranganbelanja_t kb on kb.objectkegiatanfk = dp.id
        INNER JOIN mataanggaran_m ma on ma.id=kb.objectmataanggaranfk
        where dp.statusenabled = true
        and dp.kdprofile = 30
        and ma.statusenabled = true
        and ma.kdprofile = 30
        and kb.statusenabled = true
        and kb.kdprofile = 30
        and dp.id = $id
        $qmata
        group by dp.keterangan, dp.tahun, dp.id, kb.islock, ma.id, ma.kodemataanggaran, ma.namamataanggaran
        order by subkodepertama asc, subkodekedua asc, subkodeketiga asc, subkodekeempat asc, subkodekelima asc
        
            ")
        );

        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }

    public function saveLockSPJ(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin=$request->all();

        for($i = 0; $i < count($request['data']); $i++){
            $STSK = KegiatanAnggaran::where('norec', '=', $request['data'][$i]['norec'])->first();
            $STSK->islock = $request['data'][$i]['iscek'];
            $STSK->save();
        }
        
        
                
        if($STSK->save()){
            $transStatus = 'true';
        } else{
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Sukses";
            $status = 201;
        } else if ($transStatus == 'false') {
            $transMessage = "Simpan Gagal";
            $status = 400;
        }

        
        $result = array(
            'status' => $status,
            'message'=> $transMessage,
            'as' => 'er@epic',
        );
        return $this->setStatusCode($result['status'])->respond($result, $result['message']);
    }

    public function saveLockRBA(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin=$request->all();

        for($i = 0; $i < count($request['data']); $i++){
            $STSK = KegiatanAnggaran::where('norec', '=', $request['data'][$i]['norec'])->first();
            $STSK->islockrba = $request['data'][$i]['iscek'];
            $STSK->save();
        }
        
        
                
        if($STSK->save()){
            $transStatus = 'true';
        } else{
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Sukses";
            $status = 201;
        } else if ($transStatus == 'false') {
            $transMessage = "Simpan Gagal";
            $status = 400;
        }

        
        $result = array(
            'status' => $status,
            'message'=> $transMessage,
            'as' => 'er@epic',
        );
        return $this->setStatusCode($result['status'])->respond($result, $result['message']);
    }

    public function saveLockSPJRekening(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin=$request->all();

        for($i = 0; $i < count($request['data']); $i++){

            $STSK = KeteranganBelanja::where('objectkegiatanfk', '=', $request['data'][$i]['idsubsubkegiatan'])
            ->where('objectmataanggaranfk', '=', $request['data'][$i]['idmataanggaran'])->first();
            $STSK->islock = $request['data'][$i]['iscek'];
            $STSK->save();
        }
        
        
                
        if($STSK->save()){
            $transStatus = 'true';
        } else{
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Sukses";
            $status = 201;
        } else if ($transStatus == 'false') {
            $transMessage = "Simpan Gagal";
            $status = 400;
        }

        
        $result = array(
            'status' => $status,
            'message'=> $transMessage,
            'as' => 'er@epic',
        );
        return $this->setStatusCode($result['status'])->respond($result, $result['message']);
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
        where ka.id = $keterangan
        and jb.kdprofile = 30
        and jb.statusenabled = true
        and ka.kdprofile = 30
        and ka.statusenabled = true
        ")
        );

        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }

    public function getTotalAnggaranRcn(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $norec = $request['kegiatan'];
        $data = DB::select(DB::raw("
        select ka.norec, ka.keterangan, coalesce(cast(sum(kt.subtotal) as float),0) as total
                from kegiatananggaran_m ka
                inner JOIN keteranganbelanja_t kt on ka.id=kt.objectkegiatanfk
                where ka.kdprofile=30
                and ka.statusenabled = true
				and kt.kdprofile=30
                and kt.statusenabled = true
				and ka.norec = '$norec'
                group by  ka.norec, ka.keterangan
        ")
        );

        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }

    public function getRincianKegiatan(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $id = $request['id'];
        $data = DB::select(DB::raw("
        select dp0.kode kodesubkegiatan, dp0.keterangan keterangansubkegiatan,
        dp3.kode kodekegiatan, dp3.keterangan keterangankegiatan,
        dp2.kode kodeprogram, dp2.keterangan keteranganprogram,
        dp1.kode kodeurusan, dp1.keterangan keteranganurusan, 
        dp.kode kodesubsubkegiatan, dp.keterangan keterangansubsubkegiatan,
        dp.id, dp.norec, dp.kode kodesubsubkegiatan
        from kegiatananggaran_m as dp  
        inner join kegiatananggaran_m as dp3 on dp.kode ilike dp3.kode || '%' and dp3.div = 2
        inner join kegiatananggaran_m as dp2 on dp3.kode ilike dp2.kode || '%' and dp2.div = 1
        inner join kegiatananggaran_m as dp1 on dp2.kode ilike dp1.kode || '%' and dp1.div = 0
        inner join kegiatananggaran_m as dp0 on dp.kode ilike dp0.kode || '%' and dp0.div = 3
        where dp1.kdprofile = 30 and dp1.statusenabled = true 
        and dp2.kdprofile = 30 and dp2.statusenabled = true 
        and dp0.kdprofile = 30 and dp0.statusenabled = true 
        and dp3.kdprofile = 30 and dp3.statusenabled = true 
        and dp.norec = '$id'
        ")
        );

        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }

    public function getSisaPanjar(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $spj = '';
        if(isset($request['spj']) && $request['spj'] != "undefined"){
            $spj = "and stp.objectspjfk = '".$request['spj']."'";
        }

        $panjar = '';
        $spanjar = '';
        $npanjar = '';
        if(isset($request['panjar']) && $request['panjar'] != "undefined"){
            $panjar = "and stp.objectpanjarfk = '".$request['panjar']."'";
            $spanjar = "and objectpanjarfk = '".$request['panjar']."'";
            $npanjar = "and norec = '".$request['panjar']."'";
        }

        //cari total semua spj yang sudah dipakai di panjar itu
        $sisaperpanjar = DB::select(DB::raw("select coalesce(jumlahpanjar,0) jumlahpanjar, coalesce(sum(jumlahspj),0) jumlahspj
            from spjtopanjar_t 
        where kdprofile = 30
        and statusenabled = true
        and objectspjfk != ''
        $spanjar
        group by jumlahpanjar"));

        //jumlah panjar keseluruhan
        $jumlah = DB::select(DB::raw("
        select coalesce(pj.jumlah,0) jumlah 
        from panjar_t pj
        where pj.kdprofile = 30
        and pj.statusenabled = true
        $npanjar
        "));

        $totalbelanja = DB::select(DB::raw("
        select coalesce(sum(totalbelanja),0) totalbelanja 
        from(
            select sr.norec, sr.totalbelanja
            from panjar_t pj
            inner join spjtopanjar_t stp on stp.objectpanjarfk = pj.norec
            inner join strukrealisasi_t sr on stp.objectspjfk = sr.norec 
            where stp.kdprofile = 30
            and stp.statusenabled = true
            and pj.kdprofile = 30
            and pj.statusenabled = true
            and sr.kdprofile = 30
            and sr.statusenabled = true
            $spj
            group by sr.norec, sr.totalbelanja
        ) as x
        "));

        //jumlah pengembalian
        $pengembalian = DB::select(DB::raw("select coalesce(sum(jumlahpengembalian),0) jumlahpengembalian 
        from(
            select pp.jumlahpengembalian, pp.norec
            from panjar_t pj
            inner join pengembalianpanjar_t pp on pp.objectpanjarfk = pj.norec
            where pj.kdprofile = 30
            and pj.statusenabled = true
            and pp.kdprofile = 30
            and pp.statusenabled = true
            $spanjar
            group by pp.jumlahpengembalian, pp.norec
        ) as x
        "));

        $result = array(
            'jumlah' => $jumlah,
            'totalbelanja' => $totalbelanja,
            'pengembalian' => $pengembalian,
            'sisapanjar' => $sisaperpanjar,
            'message' => '@epic',
        );

        return $this->respond($result);
    }

    // public function getSisaPanjarPengembalian(Request $request){
    //     $kdProfile = $this->getDataKdProfile($request);
    //     $idProfile = (int) $kdProfile;

    //     $spj = '';
    //     if(isset($request['spj']) && $request['spj'] != "undefined" && $request['spj'] != ""){
    //         $spj = "and stp.objectspjfk = '".$request['spj']."'";
    //     }

    //     $jumlah = DB::select(DB::raw("
    //     select sum(pj.jumlah) jumlah 
    //     from panjar_t pj
    //     inner join spjtopanjar_t stp on stp.objectpanjarfk = pj.norec
    //     inner join strukrealisasi_t sr on stp.objectspjfk = sr.norec 
    //     where stp.kdprofile = 30
    //     and stp.statusenabled = true
    //     and pj.kdprofile = 30
    //     and pj.statusenabled = true
    //     and sr.kdprofile = 30
    //     and sr.statusenabled = true
    //     $spj
    //     "));

    //     $totalbelanja = DB::select(DB::raw("
    //     select coalesce(sum(totalbelanja),0) totalbelanja 
    //     from(
    //         select sr.norec, sr.totalbelanja
    //         from panjar_t pj
    //         inner join spjtopanjar_t stp on stp.objectpanjarfk = pj.norec
    //         inner join strukrealisasi_t sr on stp.objectspjfk = sr.norec 
    //         where stp.kdprofile = 30
    //         and stp.statusenabled = true
    //         and pj.kdprofile = 30
    //         and pj.statusenabled = true
    //         and sr.kdprofile = 30
    //         and sr.statusenabled = true
    //         $spj
    //         $panjar
    //         group by sr.norec, sr.totalbelanja
    //     ) as x
    //     "));

    //     $pengembalian = DB::select(DB::raw("
    //     select coalesce(sum(pp.jumlahpengembalian),0) jumlahpengembalian 
    //     from panjar_t pj
    //     inner join spjtopanjar_t stp on stp.objectpanjarfk = pj.norec
    //     inner join strukrealisasi_t sr on stp.objectspjfk = sr.norec 
    //     inner join pengembalianpanjar_t pp on pp.objectpanjarfk = pj.norec
    //     where stp.kdprofile = 30
    //     and stp.statusenabled = true
    //     and pj.kdprofile = 30
    //     and pj.statusenabled = true
    //     and sr.kdprofile = 30
    //     and sr.statusenabled = true
    //     and pp.kdprofile = 30
    //     and pp.statusenabled = true
    //     $spj
    //     $panjar
    //     "));

    //     $result = array(
    //         'jumlah' => $jumlah,
    //         'totalbelanja' => $totalbelanja,
    //         'pengembalian' => $pengembalian,
    //         'message' => '@epic',
    //     );

    //     return $this->respond($result);
    // }

    public function getLPJ(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $bulan = $request['bulan'];
        $tahun = (int)$request['tahun'];
        $periode = '';

        if($bulan == '01'){
            $periode = 'Januari';
        }
        else if($bulan == '02'){
            $periode = 'Februari';
        }
        else if($bulan == '03'){
            $periode = 'Maret';
        }
        else if($bulan == '04'){
            $periode = 'April';
        }
        else if($bulan == '05'){
            $periode = 'Mei';
        }
        else if($bulan == '06'){
            $periode = 'Juni';
        }
        else if($bulan == '07'){
            $periode = 'Juli';
        }
        else if($bulan == '08'){
            $periode = 'Agustus';
        }
        else if($bulan == '09'){
            $periode = 'September';
        }
        else if($bulan == '10'){
            $periode = 'Oktober';
        }
        else if($bulan == '11'){
            $periode = 'November';
        }
        else if($bulan == '12'){
            $periode = 'Desember';
        }
        
        $data = DB::select(DB::raw("
        select ap.id idasalproduk, ap.asalproduk, lpj.norec, lpj.tgllpj, lpj.keterangan, coalesce(lpj.total, 0) total, lpj.nolpj, lpj.periode, lpj.jenis_bukti 
        from lpj_t lpj
        left join asalproduk_m ap on ap.id = lpj.objectasalprodukfk and ap.statusenabled = true 
        where lpj.kdprofile = 30 and lpj.statusenabled = true
        and extract(year from lpj.tgllpj) = $tahun
        and lpj.periode = '$periode'
        ")
        );

        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }

    

    public function getDetailSubKegiatan(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $id = $request['kegiatan'];
        $tahun = $request['tahun'];
        $idpeg = $request['idpegawai'];
        $pegawai = '';
        $thp = '';
        if(isset($request['tahap']) && $request['tahap'] != "undefined" && $request['tahap'] != ""){
            $thp = "and kb.objecttahapfk = ".$request['tahap'];
        }
        if (isset($request['idpegawai']) && $request['idpegawai'] != "" && $request['idpegawai'] != "undefined") {
            $pegawai = 'and kg.objectpptkfk = '.$idpeg;
            // foreach ($setting as $st) {
            //     $ddddd = DB::select(DB::raw("
            // select ka1.id as idsubkegiatan, ka1.kode as kodesubkegiatan, ka.id as idsubsubkegiatan, ka.kode as kodesubsubkegiatan from kegiatananggaran_m ka 
            // inner join kegiatananggaran_m ka1 on ka.kode ilike ka1.kode || '%' and ka1.div= 3 and ka.statusenabled = true
            // where ka.objectpptkfk = $idpeg and ka.tahun ='$st->tahunanggaran'
            // "));
            // }
            
            // $listsubkegiatan = [];
            // $listsubsubkegiatan = [];
            // foreach ($ddddd as $ddd) {
            //     $listsubkegiatan[] = $ddd->idsubkegiatan;
            //     if(isset($request['subsubkegiatan']) && $ddd->kodesubkegiatan == $request['subsubkegiatan']){
            //         $listsubsubkegiatan[] = $ddd->idsubsubkegiatan;  
            //     }  
            // }
            // $lisssss = join(', ', $listsubkegiatan);
            // $lisssssssssss = join(', ', $listsubsubkegiatan);
        }
        $data = DB::select(DB::raw("
        select kg.id, kg.kode, kg.keterangan, kg.id || '-' || kg.keterangan as text,
        ta.tahap || '-' || kg.keterangan as texttahap
        from kegiatananggaran_m km 
        inner join kegiatananggaran_m kg on kg.kode ilike km.kode || '%' and kg.div = 4
        inner join keteranganbelanja_t kb on kb.objectkegiatanfk = kg.id
        inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk
        where km.statusenabled = true and km.kdprofile = 30
        and kg.statusenabled = true and kg.kdprofile = 30
        and kb.statusenabled = true and kb.kdprofile = 30
        and km.id = $id
        and kg.tahun = '$tahun'
        $thp
        $pegawai
        group by kg.id, kg.kode, kg.keterangan, kg.id || '-' || kg.keterangan, ta.tahap || '-' || kg.keterangan
        ")
        );

        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }

    public function getBKU(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tglAwal = $request['awal'];
        $tglAkhir = $request['akhir'];

        $rekanan = '';
        if(isset($request['rekanan']) && $request['rekanan'] != '' && $request['rekanan'] != "undefined"){
            $rekanan = " and bku.rekananfk = '".$request['rekanan']."'";
        }

        $asalproduk = '';
        if(isset($request['asalproduk']) && $request['asalproduk'] != '' && $request['asalproduk'] != "undefined"){
            $asalproduk = " and bku.objectasalprodukfk = '".$request['asalproduk']."'";
        }

        $qkey = '';
        if(isset($request['key']) && $request['key'] != '' && $request['key'] != "undefined"){
            $qkey = " and (bku.uraianbku ilike '%".$request['key']."%' or jb.jenisbukti ilike '%".$request['key']."%' or bku.penerimaan::varchar ilike '%".$request['key']."%' or bku.pengeluaran::varchar ilike '%".$request['key']."%')";
        }
        
        // select ap.id idasalproduk, ap.asalproduk, (right(left(bku.nobku, -4), 2))::int4 nourut, rm.namarekanan, bku.norec norecbku, bku.nobku, jb.jenisbukti, jb.id, bku.objectmataanggaranfk kodemataanggaran, bku.tglbku, bku.uraianbku, bku.penerimaan, bku.pengeluaran, bku.saldo
        $data = DB::select(DB::raw("
            SELECT
                ap.id as idasalproduk,
                ap.asalproduk,
                ROW_NUMBER() OVER (ORDER BY bku.tglbku) AS nourut,
                rm.namarekanan,
                bku.norec as norecbku,
                bku.nobku,
                jb.jenisbukti,
                jb.id,
                bku.objectmataanggaranfk as kodemataanggaran,
                bku.tglbku,
                bku.uraianbku,
                bku.penerimaan,
                bku.pengeluaran,
                SUM(bku.penerimaan - bku.pengeluaran) OVER (ORDER BY bku.nobku) AS saldo
            FROM
                bukukasumum_t bku
            LEFT JOIN jenisbukti_m jb ON jb.id = bku.objectjenisbuktifk
            LEFT JOIN rekanan_m rm ON rm.id = bku.rekananfk
            LEFT JOIN asalproduk_m ap ON ap.id = bku.objectasalprodukfk
            WHERE
                bku.statusenabled = true
                AND bku.kdprofile = 30
                    $rekanan
                    $asalproduk
                    $qkey
            AND tglbku BETWEEN '$tglAwal' AND '$tglAkhir'
            ORDER BY nobku DESC
            ")
        );

        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }

    public function getJenisBuktiBKU(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        
        $data = DB::select(DB::raw("
        select id, jenisbukti from jenisbukti_m where kdprofile = 30 and statusenabled = true
        and kodeexternal = 'BKU'
        ")
        );

        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }
    

    public function getRetur(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tglAwal = $request['awal'];
        $tglAkhir = $request['akhir'];
        
        $data = DB::select(DB::raw("
        select *
        from returakuntansi_t where kdprofile = 30 and statusenabled = true
        and tglretur between '$tglAwal' and '$tglAkhir'
        ")
        );

        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }

    


    public function getTelemedicine(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tglAwal = $request['awal'];
        $tglAkhir = $request['akhir'];
        
        $data = DB::select(DB::raw("
        select pt.*, ru.id idruangan, ru.namaruangan, pg.id idpegawai, pg.namalengkap, kp.id idkelompok, kp.kelompokpasien
        from pasientelemedicine_t pt 
        inner join ruangan_m as ru on ru.id = pt.objectruanganfk
        inner join kelompokpasien_m as kp on kp.id = pt.objectkelompokpasienfk
        inner join pegawai_m as pg on pg.id = pt.objectdokterfk
        where pt.kdprofile = 30 and pt.statusenabled = true
        and pt.tglreservasi between '$tglAwal' and '$tglAkhir'
        ")
        );

        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }

    public function getJurnal(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tglAwal = $request['awal'];
        $tglAkhir = $request['akhir'];
        
        $data = DB::select(DB::raw("
        select jpp.*, pr.noaccount kdakun, pr.namaaccount namaakun, pr.id idakun
        from jurnalpenyesuaianpenutupan_t jpp 
        inner join chartofaccount_m as pr on pr.id = jpp.kdakun
        where jpp.kdprofile = 30 and jpp.statusenabled = true
        and jpp.tgljurnal between '$tglAwal' and '$tglAkhir'
        and jpp.jenis = 1
        ")
        );

        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }

    public function getJurnalP(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tglAwal = $request['awal'];
        $tglAkhir = $request['akhir'];
        
        $data = DB::select(DB::raw("
        select jpp.*, pr.noaccount kdakun, pr.namaaccount namaakun, pr.id idakun
        from jurnalpenyesuaianpenutupan_t jpp 
        inner join chartofaccount_m as pr on pr.id = jpp.kdakun
        where jpp.kdprofile = 30 and jpp.statusenabled = true
        and jpp.tgljurnal between '$tglAwal' and '$tglAkhir'
        and jpp.jenis = 2
        ")
        );

        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }

    public function getJasgir(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tglAwal = $request['awal'];
        $tglAkhir = $request['akhir'];
        
        $data = DB::select(DB::raw("
        select objectbkufk, norec, nojasagiro, uraianjasagiro, tglpemasukan, jumlahpemasukan, tglpengeluaran, jumlahpengeluaran 
        from jasagiro_t where kdprofile = 30 and statusenabled = true
        and tglpemasukan between '$tglAwal' and '$tglAkhir'
        ")
        );

        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }

    public function getPanjarBKU(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        if(isset($request['norec']) && $request['norec'] != '' && $request['norec'] != "undefined"){
            $norec = " and pj.objectbkufk = '".$request['norec']."'";
        } else{
            $norec = " and pj.objectbkufk is null ";
        }
        
        $data = DB::select(DB::raw("
        select ma.id idmataanggaran, ma.kodemataanggaran, subkeg.id idsubkegiatan, subkeg.keterangan subkegiatan, subsubkeg.id idsubsubkegiatan, subsubkeg.keterangan subsubkegiatan, pj.norec, pj.tglpanjar, pj.nopanjar, pj.uraian, pj.jumlah, pj.jenispanjar, coalesce(sum(pp.jumlahpengembalian),0) jumlahpengembalian, pj.sumberpanjar 
        from panjar_t pj
        inner join mataanggaran_m ma on ma.id = pj.objectmataanggaranfk
        inner join kegiatananggaran_m subkeg on subkeg.id = pj.objectsubkegiatanfk
        inner join kegiatananggaran_m subsubkeg on subsubkeg.id = pj.objectsubsubkegiatanfk
        left join pengembalianpanjar_t pp on pp.objectpanjarfk = pj.norec
        and pp.kdprofile = 30
        and pp.statusenabled = true
        where pj.kdprofile = 30 and pj.statusenabled = true
        $norec
        group by ma.id, ma.kodemataanggaran, subkeg.id, subkeg.keterangan, subsubkeg.id, subsubkeg.keterangan, pj.norec, pj.tglpanjar, pj.nopanjar, pj.uraian, pj.jumlah, pj.jenispanjar, pj.sumberpanjar
        ")
        );

        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }
    public function getDataPengembalianPanjarBKU(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        // if(isset($request['norec']) && $request['norec'] != '' && $request['norec'] != "undefined"){
        //     $norec = " and pj.objectbkufk = '".$request['norec']."'";
        // } else{
        //     $norec = " and pj.objectbkufk is null ";
        // }
        
        $data = DB::select(DB::raw("
        select ma.id idmataanggaran, ma.kodemataanggaran, subkeg.id idsubkegiatan, subkeg.keterangan subkegiatan, subsubkeg.id idsubsubkegiatan, subsubkeg.keterangan subsubkegiatan, pj.norec, pj.tglpanjar, pp.nopengembalian as nopanjar, pj.uraian, pj.jumlah, pj.jenispanjar, coalesce(sum(pp.jumlahpengembalian),0) jumlahpengembalian, pj.sumberpanjar 
        from panjar_t pj
        inner join mataanggaran_m ma on ma.id = pj.objectmataanggaranfk
        inner join kegiatananggaran_m subkeg on subkeg.id = pj.objectsubkegiatanfk
        inner join kegiatananggaran_m subsubkeg on subsubkeg.id = pj.objectsubsubkegiatanfk
        left join pengembalianpanjar_t pp on pp.objectpanjarfk = pj.norec
        where pj.kdprofile = 30 and pj.statusenabled = true
        and pp.kdprofile = 30
        and pp.statusenabled = true
        and pp.jumlahpengembalian is not null
       
        group by ma.id, ma.kodemataanggaran, subkeg.id, subkeg.keterangan, subsubkeg.id, subsubkeg.keterangan, pj.norec, pj.tglpanjar, pp.nopengembalian, pj.uraian, pj.jumlah, pj.jenispanjar, pj.sumberpanjar
        ")
        );

        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }

    public function getSPMBKU(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $norec = '';
        if(isset($request['norec']) && $request['norec'] != '' && $request['norec'] != "undefined"){
            $norec = " and spm.objectbkufk = '".$request['norec']."'";
        } else{
            $norec = " and spm.objectbkufk is null ";
        }
        
        $data = DB::select(DB::raw("
        select spm.norec, spm.tglspm, spm.nospm, spm.jenisbukti, spm.untukpengeluaran, spm.status, spm.tglsah, 
        coalesce(spm.nilaispm,0) nilaispm, spm.noreg, ap.id idasalproduk, ap.asalproduk 
        from spm_t spm
        inner join asalproduk_m ap on spm.objectasalprodukfk = ap.id
        where spm.kdprofile = 30 
        and spm.statusenabled = true
        $norec
        ")
        );

        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }

    public function getJasgirBKU(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $norec = '';
        if(isset($request['norec']) && $request['norec'] != '' && $request['norec'] != "undefined"){
            $norec = " and objectbkufk = '".$request['norec']."'";
        } else{
            $norec = " and objectbkufk is null ";
        }
        
        $data = DB::select(DB::raw("
        select norec, nojasagiro, uraianjasagiro, tglpemasukan, coalesce(jumlahpemasukan,0) jumlahpemasukan, tglpengeluaran, coalesce(jumlahpengeluaran, 0) jumlahpengeluaran
        from jasagiro_t where kdprofile = 30 and statusenabled = true
        $norec
        ")
        );

        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }

    public function getPajakBKU(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $norecpp = '';
        if(isset($request['norec']) && $request['norec'] != '' && $request['norec'] != "undefined"){
            $norecpp = " and pp.objectbkufk = '".$request['norec']."'";
        } else{
            $norecpp = " and pp.objectbkufk is null ";
        }

        $norecpep = '';
        if(isset($request['norec']) && $request['norec'] != '' && $request['norec'] != "undefined"){
            $norecpep = " and pep.objectbkufk = '".$request['norec']."'";
        } else{
            $norecpep = " and pep.objectbkufk is null ";
        }
        // $data = DB::select(DB::raw("
        // select distinct * from(
        // select pp.objectspjfk, pp.pph, coalesce(pp.ppn,0) ppn, pp.uraianpajak, pp.norec, pp.nopajak, pp.tglpph as tanggal, 'Pemungutan' as jenis,
        // case 
        // when pp.ppn = 0 or pp.ppn is null then jp.namaexternal
        // when pp.ppn != 0 and pp.ppn is not null then jp.namaexternal || ', PPN'
        // end as koderek,
        // pp.pph || ', ' || coalesce(pp.ppn, 0) as jumlahpenerimaan,
        // '0' as jumlahpengeluaran,
        // ap.id idasalproduk, ap.asalproduk
        // from pemungutanpajak_t pp
        // inner join strukrealisasi_t sr on sr.norec = pp.objectspjfk
        // left join jenispajak_m jp on jp.id = pp.objectjenispphfk
        // left join asalproduk_m ap on ap.id = sr.objectasalprodukfk
        // where pp.kdprofile = 30 and pp.statusenabled = true
        // $norecpp

        // union ALL

        // select pep.objectspjfk, pep.pph, coalesce(pep.ppn,0) ppn, pep.uraianpajak, pep.norec, pep.nopajak, pep.tglpph as tanggal, 'Penyetoran' as jenis,
        // case 
        // when pep.ppn = 0 or pep.ppn is null then jp.namaexternal
        // when pep.ppn != 0 and pep.ppn is not null then jp.namaexternal || ', PPN'
        // end as koderek,
        // '0' as jumlahpenerimaan,
        // pep.pph || ', ' || coalesce(pep.ppn, 0) as jumlahpengeluaran,
        // ap.id idasalproduk, ap.asalproduk
        // from pemungutanpajak_t pp
        // inner join strukrealisasi_t sr on sr.norec = pp.objectspjfk
        // inner join penyetoranpajak_t pep on pep.objectspjfk = pp.objectspjfk
        // left join jenispajak_m jp on jp.id = pp.objectjenispphfk
        // left join asalproduk_m ap on ap.id = sr.objectasalprodukfk
        // where pp.kdprofile = 30 and pp.statusenabled = true
        // and pep.kdprofile = 30 and pep.statusenabled = true
        // $norecpep
        // ) as x order by nopajak
        // ")
        // );
        $data = DB::select(DB::raw("
        select distinct x.objectspjfk,	x.pph,	x.ppn,	x.uraianpajak	,	x.norec	,	x.nopajak	,	x.tanggal	,	x.jenis	,	x.koderek	,	x.jumlahpenerimaan	,	x.jumlahpengeluaran	,	x.idasalproduk	,	x.asalproduk from(
            select pp.objectspjfk, coalesce(pp.pph,0) pph, coalesce(pp.ppn,0) ppn, pp.uraianpajak, pp.norec, pp.nopajak,CASE
            WHEN pp.tglpph isnull THEN pp.tglppn
            
            ELSE pp.tglpph
            END AS tanggal, 'Pemungutan' as jenis,
            case
            when pp.ppn = 0 or pp.ppn is null then jp.namaexternal
            when pp.ppn != 0 and pp.ppn is not null then jp.namaexternal 
            end as koderek,            
            case when pp.pph is null then 
           pp.ppn 
            else 
            pp.pph  end AS jumlahpenerimaan,            
            --.pph || ', ' || coalesce(pp.ppn, 0) as jumlahpenerimaan,
            '0' as jumlahpengeluaran,
            ap.id idasalproduk, ap.asalproduk
            from pemungutanpajak_t pp
            inner join strukrealisasi_t sr on sr.norec = pp.objectspjfk
            left join jenispajak_m jp on jp.id = pp.objectjenispphfk
            left join asalproduk_m ap on ap.id = sr.objectasalprodukfk
            where pp.kdprofile = 30 and pp.statusenabled = true
       
            $norecpp
            
            union ALL
            
            SELECT
            pep.objectspjfk,
            COALESCE(pep.pph, 0) AS pph,
            COALESCE(pep.ppn, 0) AS ppn,
            pep.uraianpajak,
            pep.norec,
            pep.nopajak,
            
            CASE
            WHEN pep.tglpph isnull THEN pep.tglppn
            
            ELSE pep.tglpph
            END AS tanggal,
            'Penyetoran' AS jenis,
            CASE
            WHEN pep.ppn = 0 OR pep.ppn IS NULL THEN jp.namaexternal
            WHEN pep.ppn != 0 AND pep.ppn IS NOT NULL THEN jp.namaexternal 
            END AS koderek,
            '0' AS jumlahpenerimaan,
            case when pep.pph is null then 
            pep.ppn 
            else 
            pep.pph  end AS jumlahpengeluaran,
            ap.id AS idasalproduk,
            ap.asalproduk
            FROM
            pemungutanpajak_t pp
            INNER JOIN
            strukrealisasi_t sr ON sr.norec = pp.objectspjfk
            INNER JOIN
            penyetoranpajak_t pep ON pep.objectspjfk = pp.objectspjfk
            LEFT JOIN
            jenispajak_m jp ON jp.id = pep.objectjenispphfk
            LEFT JOIN
            asalproduk_m ap ON ap.id = sr.objectasalprodukfk
            where pp.kdprofile = 30 and pp.statusenabled = true
            and pep.kdprofile = 30 and pep.statusenabled = true
            
            $norecpep
            ) as x order by nopajak
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
        $mata = '';
        if(isset($request['idmataanggaran']) && $request['idmataanggaran'] != '' && $request['idmataanggaran'] != "undefined"){
            $mata = ' and ma.id = '.$request['idmataanggaran'];
        }
        $idmataanggaran= $request['idmataanggaran'];
        
        $data = DB::select(DB::raw("
                select kt.password, kt.norec	,kt.kdprofile	,kt.statusenabled	,kt.objectkegiatanfk	,kt.objectmataanggaranfk	
                ,kt.keteranganbelanja	,kt.nourut	,kt.jml	,cast(kt.hargasatuan as float) as hargasatuan	 ,cast(kt.subtotal as float) as subtotal	,
                kt.satuan	,kt.objectasalprodukfk,ap.asalproduk ,ma.namamataanggaran,ma.kodemataanggaran
                from keteranganbelanja_t kt
                INNER JOIN asalproduk_m ap on ap.id=kt.objectasalprodukfk
                INNER JOIN mataanggaran_m ma on ma.id=kt.objectmataanggaranfk
                where kt.objectkegiatanfk= $idkegiatanfk
                $mata
                and kt.statusenabled = true
                and ma.kdprofile = 30
                and ma.statusenabled = true
                order by kt.nourut
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
                    ->first();
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
                'line'=> $e->getLine(),
                'message'=> $e->getMessage(),
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

        $pegawai = '';
        if(isset($request['idpegawai']) && $request['idpegawai'] != "undefined" && $request['idpegawai'] != ''){
            $pegawai = "and ka.objectpptkfk = ".$request['idpegawai'];
        }

        $status = '';
        if(isset($request['status']) && $request['status'] != "undefined" && $request['status'] != '' && $request['status'] == 0){
            $status = "";
        } else if(isset($request['status']) && $request['status'] != "undefined" && $request['status'] != '' && $request['status'] == 1){
            $status = "and (sr.status is null or sr.status = 'Belum Diverifikasi')";
        } else if(isset($request['status']) && $request['status'] != "undefined" && $request['status'] != '' && $request['status'] == 2){
            $status = "and sr.status = 'Revisi'";
        } else if(isset($request['status']) && $request['status'] != "undefined" && $request['status'] != '' && $request['status'] == 3){
            $status = "and sr.status = 'Sudah Diverifikasi'";
        }

        $data = DB::select(DB::raw("
        select string_agg(DISTINCT rd.uraian, ',') uraian, sr.*, cbs.carabayar, sr.tglverif, sr.keterangan, sr.jumlahdibayarverif, ka.tahun,--sr.norealisasi,sr.deskripsi,sr.totalbelanja,
                pg1.namalengkap as bendahara, pg2.namalengkap as penerima, rkn.namarekanan as pihakketiga,
                ka.kode || '~' || ka.keterangan as kegiatan, ma.kodemataanggaran || '~' || ma.namamataanggaran as mataanggaran,
                dp0.kode kodesubkegiatan, dp0.keterangan keterangansubkegiatan, ma.kodemataanggaran, ma.namamataanggaran, dp0.id idsubkegiatan, ka.keterangan subsubkegiatan, ka.id idsubsubkegiatan,
                ap.id idasalproduk, ap.asalproduk, sr.objectbkufk
                from strukrealisasi_t sr
                inner join realisasidetail_t rd on rd.strukrealisasifk = sr.norec

                left join asalproduk_m ap on ap.id = sr.objectasalprodukfk
                left JOIN kegiatananggaran_m ka on ka.id=sr.objectkegiatanfk
                and ka.kdprofile = 30 and ka.statusenabled=true
                left join kegiatananggaran_m as dp0 on ka.kode ilike dp0.kode || '%' and dp0.div = 3
                and dp0.kdprofile = 30 and dp0.statusenabled=true
                left JOIN rekanan_m rkn on rkn.id=sr.rekananfk
                left JOIN pegawai_m as pg1 on pg1.id=sr.bendaharafk
                left JOIN pegawai_m as pg2 on pg2.id=sr.penerimafk
                left join carabayarspj_m cbs on cbs.id = sr.objectcarabayarfk
                left JOIN mataanggaran_m ma on ma.id=sr.objectmataanggaranfk
                where sr.tglrealisasi between '$tglAwal' and '$tglAkhir'
                and sr.statusenabled = true
                and rd.statusenabled = true
                and rd.kdprofile = 30
                $pegawai
                $status
				group by dp0.kode, dp0.keterangan, sr.norec, cbs.carabayar, sr.tglverif, sr.keterangan, sr.jumlahdibayarverif, sr.kdprofile, sr.statusenabled, sr.tglrealisasi, sr.norealisasi, sr.status, sr.totalbelanja, sr.objectcarabayarfk, sr.rekananfk, sr.deskripsi, sr.objectkegiatanfk, sr.objectmataanggaranfk, sr.bendaharafk, sr.penerimafk, sr.pph, sr.ppn, pg1.namalengkap, pg2.namalengkap, rkn.namarekanan ,
                ka.kode || '~' || ka.keterangan, ma.kodemataanggaran || '~' || ma.namamataanggaran, ka.tahun, ma.kodemataanggaran, ma.namamataanggaran, dp0.id, ka.keterangan, ka.id, ap.id, ap.asalproduk, sr.objectbkufk
                order by sr.norealisasi desc
            ")
        );
        $result = [];
        $strukrealisasifk ='';
        $dataDetail = DB::select(DB::raw("
                    select rd.*,ka.keteranganbelanja,0 as nourut
                    from strukrealisasi_t sr
                inner join realisasidetail_t rd on rd.strukrealisasifk = sr.norec
                    INNER JOIN keteranganbelanja_t ka on ka.norec=rd.keteranganbelanjafk
                    where  rd.statusenabled = true
                    and rd.kdprofile = 30
                    and ka.statusenabled = true
                    and ka.kdprofile = 30
                    and sr.tglrealisasi between  '$tglAwal' and '$tglAkhir'
                ")
            );
        $dataDetail1=[];
        foreach($data as $item){
            // $strukrealisasifk= ;
            $dataDetail1 =[];
            foreach($dataDetail as $detail){
                if($item->norec == $detail->strukrealisasifk){
                    $dataDetail1[]=array(
                        'norec'=> $detail->norec,
                        'kdprofile'	=> $detail->kdprofile,
                        'statusenabled'	=> $detail->statusenabled,
                        'strukrealisasifk'	=> $detail->strukrealisasifk,
                        'uraian'	=> $detail->uraian,
                        'jml'	=> $detail->jml,
                        'satuan'	=> $detail->satuan,
                        'harga'	=> $detail->harga,
                        'subtotal'	=> $detail->subtotal,
                        'keteranganbelanjafk'	=> $detail->keteranganbelanjafk,
                        'keteranganbelanja'	=> $detail->keteranganbelanja,
                        'nourut'	=> $detail->nourut
                    );
                    // break;
                }
                
            }
            
            // $dataDetail = DB::select(DB::raw("
            //         select sr.*,ka.keteranganbelanja,0 as nourut
            //         from realisasidetail_t sr
            //         INNER JOIN keteranganbelanja_t ka on ka.norec=sr.keteranganbelanjafk
            //         where sr.strukrealisasifk = '$strukrealisasifk'
            //         and sr.statusenabled = true
            //         and sr.kdprofile = 30
            //         and ka.statusenabled = true
            //         and ka.kdprofile = 30
            //     ")
            // );
            $result[] = array(
                'strukrealisasifk' => $item->norec,
                'data' => $dataDetail1,
            );
        };


        $result = array(
            'data' => $data,
            'detail' => $result,
            'message' => '@epic',
        );

        return $this->respond($result);
    }

    public function getSTSKeuangan(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tglAwal = $request['awal'];
        $tglAkhir = $request['akhir'];

        $tgl = '';
        if(isset($request['awal']) && isset($request['akhir']) && $request['awal'] != '' && $request['akhir'] != ''){
            $tgl = "and sr.tglsts between '$tglAwal' and '$tglAkhir'";
        }

        $qkey = "";
        if(isset($request['key']) && $request['key'] != '' && $request['key'] != "undefined" && $request['key'] == 'bku'){
            $qkey = "and sr.objectbkufk is null";
        }

        $qnorec = "";
        if(isset($request['norec']) && $request['norec'] != '' && $request['norec'] != "undefined"){
            $qnorec = "and sr.objectbkufk = '".$request['norec']."'";
        }

        $qsubkegiatan = "";
        if(isset($request['idsubkegiatan']) && $request['idsubkegiatan'] != '' && $request['idsubkegiatan'] != "undefined"){
            $qsubkegiatan = "and sr.objectsubkegiatanfk = '".$request['idsubkegiatan']."'";
        }

        $qsubsubkegiatan = "";
        if(isset($request['idsubsubkegiatan']) && $request['idsubsubkegiatan'] != '' && $request['idsubsubkegiatan'] != "undefined"){
            $qsubsubkegiatan = "and sr.objectsubsubkegiatanfk = '".$request['idsubsubkegiatan']."'";
        }

        $data = DB::select(DB::raw("
        select  sr.nosts, sr.objectbkufk, sr.norec, sr.uraiansts, sr.tglsts, sr.nilaists, ma.id idmataanggaran, ma.kodemataanggaran, ma.namamataanggaran,
                ka.id idsubsubkegiatan, ka.keterangan keterangansubsubkegiatan, dp0.id idsubkegiatan, dp0.keterangan keterangansubkegiatan, 
                ap.id idsumberdana, ap.asalproduk, ka.kode || ' - ' || ka.keterangan as subsubkegiatan, dp0.kode || ' - ' || dp0.keterangan as subkegiatan,
                ma.kodemataanggaran || ' - ' || ma.namamataanggaran mataanggaran
                from stskeuangan_t sr
                inner JOIN kegiatananggaran_m ka on ka.id=sr.objectsubsubkegiatanfk
                inner join kegiatananggaran_m as dp0 on dp0.id=sr.objectsubkegiatanfk
                inner JOIN mataanggaran_m ma on ma.id=sr.objectmataanggaranfk
                inner JOIN asalproduk_m ap on ap.id=sr.objectsumberdanafk
                where sr.statusenabled = true
                $tgl
                $qkey
                $qnorec
                $qsubkegiatan
                $qsubsubkegiatan
                and ka.kdprofile = 30 and ka.statusenabled=true
                and dp0.kdprofile = 30 and dp0.statusenabled=true
            ")
        );


        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }

    public function getSPJtoLPJ(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $bulan = (int)$request['bulan'];
        $tahun = (int)$request['tahun'];

        $data = DB::select(DB::raw("
        select sr.norec, sr.norealisasi, string_agg(DISTINCT rd.uraian, ',') uraian, cbs.carabayar, ma.kodemataanggaran || '~' || ma.namamataanggaran as mataanggaran,
        sr.keterangan, sr.tglverif, sr.jumlahdibayarverif  FROM
        strukrealisasi_t sr
        inner join realisasidetail_t rd on rd.strukrealisasifk = sr.norec
        inner join carabayarspj_m cbs on cbs.id = sr.objectcarabayarfk
        inner JOIN mataanggaran_m ma on ma.id=sr.objectmataanggaranfk
        where sr.statusenabled = true
        and sr.kdprofile = 30
        and sr.status = 'Sudah Diverifikasi'
        and extract(month from sr.tglrealisasi) = $bulan
        and extract(year from sr.tglrealisasi) = $tahun
        and sr.objectlpjfk is null
        group by sr.norec, sr.norealisasi, cbs.carabayar, ma.kodemataanggaran || '~' || ma.namamataanggaran,
        sr.keterangan, sr.tglverif, sr.jumlahdibayarverif
            ")
        );

        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }
    public function getSPJtoLPJs(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $bulan = (int)$request['bulan'];
        $tahun = (int)$request['tahun'];

        $data = DB::select(DB::raw("
        select sr.norec, sr.norealisasi, string_agg(DISTINCT rd.uraian, ',') uraian, cbs.carabayar, ma.kodemataanggaran || '~' || ma.namamataanggaran as mataanggaran,
        sr.keterangan, sr.tglverif, sr.jumlahdibayarverif  FROM
        strukrealisasi_t sr
        inner join realisasidetail_t rd on rd.strukrealisasifk = sr.norec
        inner join carabayarspj_m cbs on cbs.id = sr.objectcarabayarfk
        inner JOIN mataanggaran_m ma on ma.id=sr.objectmataanggaranfk
        where sr.statusenabled = true
        and sr.kdprofile = 30
        and sr.status = 'Sudah Diverifikasi'
        and extract(month from sr.tglrealisasi) = $bulan
        and extract(year from sr.tglrealisasi) = $tahun
        
        group by sr.norec, sr.norealisasi, cbs.carabayar, ma.kodemataanggaran || '~' || ma.namamataanggaran,
        sr.keterangan, sr.tglverif, sr.jumlahdibayarverif
            ")
        );

        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }
    public function getSPJtoPajak(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tglAwal = $request['awal'];
        $tglAkhir = $request['akhir'];

        $qkey = '';
        if(isset($request['key']) && $request['key'] != '' && $request['key'] != "undefined"){
            $qkey = " and (sr.jumlahdibayarverif::varchar ilike '%".$request['key']."%' or rd.uraian ilike '%".$request['key']."%' or rkn.namarekanan ilike '%".$request['key']."%' or ma.kodemataanggaran || '~' || ma.namamataanggaran ilike '%".$request['key']."%')";
        }

        $data = DB::select(DB::raw("
        select rkn.namarekanan, sr.norec, sr.norealisasi, string_agg(DISTINCT rd.uraian, ',') uraian, cbs.carabayar, ma.kodemataanggaran || '~' || ma.namamataanggaran as mataanggaran,
        sr.keterangan, sr.tglverif, sr.jumlahdibayarverif, sr.pph, sr.ppn, ka.keterangan as kegiatan, ap.asalproduk FROM
        strukrealisasi_t sr
        inner join realisasidetail_t rd on rd.strukrealisasifk = sr.norec
        inner join carabayarspj_m cbs on cbs.id = sr.objectcarabayarfk
        inner JOIN mataanggaran_m ma on ma.id=sr.objectmataanggaranfk
        left JOIN rekanan_m rkn on rkn.id=sr.rekananfk
        inner join kegiatananggaran_m ka on ka.id = sr.objectkegiatanfk
        inner join asalproduk_m ap on ap.id = sr.objectasalprodukfk
        where sr.statusenabled = true
        and sr.kdprofile = 30
        and sr.tglrealisasi between '$tglAwal' and '$tglAkhir'
        and sr.status = 'Sudah Diverifikasi'
        and (sr.pph <> 0 or sr.ppn<>0)
        $qkey
        group by rkn.namarekanan, sr.norec, sr.norealisasi, cbs.carabayar, ma.kodemataanggaran || '~' || ma.namamataanggaran,
        sr.keterangan, sr.tglverif, sr.jumlahdibayarverif, ka.keterangan,ap.asalproduk
            ")
        );
        foreach ($data as $d) {
            $norec = $d->norec;
            $detail = DB::select(DB::raw("select 
            pep.nopajak nopajakpep, pp.nopajak nopajakpp, pp.uraianpajak, sr.norealisasi,string_agg(DISTINCT rd.uraian, ',') uraian, sr.tglverif tglrealisasi, coalesce(jp.jenispajak,'PPh') as kode, pp.pph as jumlah 
            from strukrealisasi_t sr 
            left join realisasidetail_t rd on rd.strukrealisasifk = sr.norec
            inner join pemungutanpajak_t pp on pp.objectspjfk = sr.norec and pp.statusenabled = true and pp.kdprofile = 30 
            inner join penyetoranpajak_t pep on left(pep.nopajak, 3) = left(pp.nopajak, 3) and pep.statusenabled = true and pep.kdprofile = 30
            left join jenispajak_m jp on jp.id = pp.objectjenispphfk and jp.statusenabled = true and jp.kdprofile = 30
            where sr.norec = '$norec'
            and pp.objectjenispphfk is not null
            group by jp.jenispajak, pep.nopajak, pp.nopajak, pp.uraianpajak, sr.norealisasi, sr.tglverif, pp.pph

            union all

            select 
            pep.nopajak nopajakpep, pp.nopajak nopajakpp, pp.uraianpajak, sr.norealisasi,string_agg(DISTINCT rd.uraian, ',') uraian, sr.tglverif tglrealisasi, 'PPn' as kode, pp.ppn as jumlah 
            from strukrealisasi_t sr 
            left join realisasidetail_t rd on rd.strukrealisasifk = sr.norec
            inner join pemungutanpajak_t pp on pp.objectspjfk = sr.norec and pp.statusenabled = true and pp.kdprofile = 30
            inner join penyetoranpajak_t pep on left(pep.nopajak, 3) = left(pp.nopajak, 3) and pep.statusenabled = true and pep.kdprofile = 30
            where sr.norec = '$norec'
            and pp.objectjenispphfk is null
            group by pep.nopajak, pp.nopajak, pp.uraianpajak, sr.norealisasi, sr.tglverif, pp.ppn
                ")
            );
            $d->details = $detail;
        }

        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }

    public function getSPJBKU(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $norec = '';
        if(isset($request['norec']) && $request['norec'] != '' && $request['norec'] != "undefined"){
            $norec = " and sr.objectbkufk = '".$request['norec']."'";
        } else{
            $norec = " and sr.objectbkufk is null ";
        }

        // $data = DB::select(DB::raw("
        // select rkn.namarekanan, rkn.id idrekanan, ma.kodemataanggaran, pj.norec norecpanjar,
        // case 
        // when pj.jumlah is not null then sr.jumlahdibayarverif
        // when pj.jumlah is null then 0
        // end as jumlahpanjar
        // , sr.norec, sr.norealisasi, string_agg(DISTINCT rd.uraian, ',') uraian, cbs.carabayar, ma.kodemataanggaran || '~' || ma.namamataanggaran as mataanggaran,
        // sr.keterangan, sr.tglverif, sr.jumlahdibayarverif,
        // ap.id idasalproduk, ap.asalproduk
        // FROM
        // strukrealisasi_t sr
        // inner join realisasidetail_t rd on rd.strukrealisasifk = sr.norec
        // inner join carabayarspj_m cbs on cbs.id = sr.objectcarabayarfk
        // inner JOIN mataanggaran_m ma on ma.id=sr.objectmataanggaranfk
        // left join asalproduk_m ap on ap.id = sr.objectasalprodukfk
		// left join panjar_t pj on pj.norec = sr.objectpanjarfk
        // left JOIN rekanan_m rkn on rkn.id=sr.rekananfk
        // where sr.statusenabled = true
        // and sr.kdprofile = 30
        // $norec
        // and sr.status = 'Sudah Diverifikasi'
        // group by ap.id, ap.asalproduk, rkn.namarekanan, rkn.id, ma.kodemataanggaran, pj.norec, pj.jumlah, sr.norec, sr.norealisasi, cbs.carabayar, ma.kodemataanggaran || '~' || ma.namamataanggaran,
        // sr.keterangan, sr.tglverif, sr.jumlahdibayarverif
        //     ")
        // );


         $data = DB::select(DB::raw("
        select rkn.namarekanan, rkn.id idrekanan, ma.kodemataanggaran, pj.norec norecpanjar,
        case 
        when pj.jumlah is not null then pj.jumlah
        when pj.jumlah is null then 0
        end as jumlahpanjar
        , sr.norec, sr.norealisasi, string_agg(DISTINCT rd.uraian, ',') uraian, cbs.carabayar, ma.kodemataanggaran || '~' || ma.namamataanggaran as mataanggaran,
        sr.keterangan, sr.tglverif, sr.jumlahdibayarverif,
        ap.id idasalproduk, ap.asalproduk
        FROM
        strukrealisasi_t sr
        inner join realisasidetail_t rd on rd.strukrealisasifk = sr.norec
        inner join carabayarspj_m cbs on cbs.id = sr.objectcarabayarfk
        inner JOIN mataanggaran_m ma on ma.id=sr.objectmataanggaranfk
        left join asalproduk_m ap on ap.id = sr.objectasalprodukfk
		left join panjar_t pj on pj.norec = sr.objectpanjarfk
        left JOIN rekanan_m rkn on rkn.id=sr.rekananfk
        where sr.statusenabled = true
        and sr.kdprofile = 30
        $norec
        and sr.status = 'Sudah Diverifikasi'
        group by ap.id, ap.asalproduk, rkn.namarekanan, rkn.id, ma.kodemataanggaran, pj.norec, pj.jumlah, sr.norec, sr.norealisasi, cbs.carabayar, ma.kodemataanggaran || '~' || ma.namamataanggaran,
        sr.keterangan, sr.tglverif, sr.jumlahdibayarverif
            ")
        );

        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }

    public function getPajak(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $norec = $request['norec'];

        $data = DB::select(DB::raw("select pp.objectbkufk,pep.objectbkufk,
        pep.nopajak nopajakpep, pp.nopajak nopajakpp, pp.uraianpajak, sr.norealisasi,string_agg(DISTINCT rd.uraian, ',') uraian, sr.tglverif tglrealisasi, jp.jenispajak as kode, pp.pph as jumlah 
        from strukrealisasi_t sr 
        left join realisasidetail_t rd on rd.strukrealisasifk = sr.norec
		inner join pemungutanpajak_t pp on pp.objectspjfk = sr.norec and pp.statusenabled = true and pp.kdprofile = 30 
        inner join penyetoranpajak_t pep on left(pep.nopajak, 3) = left(pp.nopajak, 3) and pep.statusenabled = true and pep.kdprofile = 30
        left join jenispajak_m jp on jp.id = pp.objectjenispphfk and jp.statusenabled = true and jp.kdprofile = 30
        where sr.norec = '$norec'
		and jp.namaexternal ilike '%pph%'
        group by pp.objectbkufk,pep.objectbkufk,jp.jenispajak, pep.nopajak, pp.nopajak, pp.uraianpajak, sr.norealisasi, sr.tglverif, pp.pph

        union all

        select pp.objectbkufk,pep.objectbkufk,
        pep.nopajak nopajakpep, pp.nopajak nopajakpp, pp.uraianpajak, sr.norealisasi,string_agg(DISTINCT rd.uraian, ',') uraian, sr.tglverif tglrealisasi, jp.jenispajak as kode, pp.ppn as jumlah 
        from strukrealisasi_t sr 
        left join realisasidetail_t rd on rd.strukrealisasifk = sr.norec
		inner join pemungutanpajak_t pp on pp.objectspjfk = sr.norec and pp.statusenabled = true and pp.kdprofile = 30
        inner join penyetoranpajak_t pep on left(pep.nopajak, 3) = left(pp.nopajak, 3) and pep.statusenabled = true and pep.kdprofile = 30
        left join jenispajak_m jp on jp.id = pp.objectjenispphfk and jp.statusenabled = true and jp.kdprofile = 30
        where sr.norec = '$norec'
		and jp.namaexternal ilike '%ppn%'
        group by pp.objectbkufk,pep.objectbkufk,jp.jenispajak, pep.nopajak, pp.nopajak, pp.uraianpajak, sr.norealisasi, sr.tglverif, pp.ppn
            ")
        );

        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }

    public function getPajakUdahSave(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $norec = $request['norec'];

        $pph = DB::select(DB::raw("
        select 
        pp.uraianpajak, pep.nopajak nopajakpep, pp.nopajak nopajakpph, pp.uraianpajak, sr.norealisasi,
        jp.jenispajak jenispph, pp.pph, jp.id objectjenispphfk, pp.tglpph, pp.idbillpph, pp.ntpnpph, pp.norec norecpp,
        pep.norec norecpep
            from strukrealisasi_t sr 
        inner join pemungutanpajak_t pp on pp.objectspjfk = sr.norec and pp.statusenabled = true and pp.kdprofile = 30 
        inner join penyetoranpajak_t pep on left(pep.nopajak, 3) = left(pp.nopajak, 3) and pep.statusenabled = true and pep.kdprofile = 30
        left join jenispajak_m jp on jp.id = pp.objectjenispphfk and jp.statusenabled = true and jp.kdprofile = 30
        where sr.norec = '$norec'
        and pp.objectjenispphfk is not null
            ")
        );

        $ppn = DB::select(DB::raw("
        select 
        pp.uraianpajak, pep.nopajak nopajakpep, pp.nopajak nopajakppn, pp.uraianpajak, 
        sr.norealisasi, 'PPN' as jenisppn, pp.ppn, pp.tglppn, pp.idbillppn, pp.ntpnppn,
        pp.norec norecpp, pep.norec norecpep
            from strukrealisasi_t sr 
        inner join pemungutanpajak_t pp on pp.objectspjfk = sr.norec and pp.statusenabled = true and pp.kdprofile = 30
        inner join penyetoranpajak_t pep on left(pep.nopajak, 3) = left(pp.nopajak, 3) and pep.statusenabled = true and pep.kdprofile = 30
        where sr.norec = '$norec'
        and pp.objectjenispphfk is null

            ")
        );

        $result = array(
            'pph' => $pph,
            'ppn' => $ppn,
            'message' => '@epic',
        );

        return $this->respond($result);
    }

    public function getDataSPM(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $nospp = $request['nospp'];

        $data = DB::select(DB::raw("
        select spm.*, spp.nospp, ap.id idasalproduk, ap.asalproduk FROM
            spp_t spp
            inner join spm_t spm on spm.objectsppfk = spp.norec
            left join asalproduk_m ap on ap.id = spm.objectasalprodukfk and ap.statusenabled = true 
            where spp.nospp = '$nospp'
            and spm.statusenabled = true
            ")
        );

        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }

    public function getPassRBA(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $norec = $request['norec'];
        
        // $data = DB::select(DB::raw("
        // select * FROM
        //     keteranganbelanja_t 
        //     where norec = '$norec'
        //     ")
        // );

        // ambil settingrba
        $settingRBA = DB::table('settinganggaran_t')
            ->where('statusenabled', true)
            ->where('kdprofile', 30)
            ->first();

        // ambil keterangan belanja
        $keterangan = DB::table('keteranganbelanja_t')
            ->where('statusenabled', true)
            ->where('norec', $norec)
            ->first();

        // kegiatan anggaran berdasarkan keterangan belanja
        $kegiatan = DB::table('kegiatananggaran_m')
            ->where('statusenabled', true)
            ->where('id', $keterangan->objectkegiatanfk)
            ->where('tahun', $settingRBA->tahunanggaran)
            ->first();

        // ambil kegiatan dengan kode yang sama
        $kegiatan = DB::table('kegiatananggaran_m')
            ->where('statusenabled', true)
            ->where('kode', $kegiatan->kode)
            ->where('tahun', $settingRBA->tahunanggaran)
            ->get();

        $idKegiatan = [];

        // masukkan setiap id kegiatan ke ada dalam array
        foreach($kegiatan as $kegi){
            array_push($idKegiatan, $kegi->id);
        }

        // menghitung spj dari semua tahap
        $sisa_semua_tahap = DB::select(DB::raw("
            SELECT
                SUM(rd.subtotal) AS total_sisa
            FROM keteranganbelanja_t AS kb 
            JOIN realisasidetail_t AS rd ON rd.keteranganbelanjafk = kb.norec 
                AND rd.statusenabled = TRUE 
                AND rd.kdprofile = 30
            WHERE
                kb.statusenabled = TRUE 
                AND kb.kdprofile = 30
                AND kb.objectkegiatanfk IN (".implode(',', $idKegiatan).") 
                AND kb.keteranganbelanja = '".$keterangan->keteranganbelanja."'
        "));
        
    
        // foreach ($data as $d) {
        //     $sisa = DB::select(DB::raw("
        //         select * from realisasidetail_t where keteranganbelanjafk = '".$d->norec."'
        //     "));
        // }
        $result = array(
            // 'data' => $data,
            // 'sisa' => $sisa,
            'keterangan' => $keterangan,
            'sisa' => $sisa_semua_tahap[0],
            'message' => '@epic',
        );

        return $this->respond($result);
    }

    public function getRBABelum(Request $request){

        $permen = '';
        if (isset($request['permen']) && $request['permen'] != "" && $request['permen'] != "undefined") {
            $permen =  "and ma.mataanggaranpermenfk = '".$request['permen']."'";
        }

        $data = DB::select(DB::raw("
        select ma.id, ma.kodemataanggaran,ma.namamataanggaran,map.id idmap, map.mataanggaranpermen, coalesce(sum(kt.subtotal),0) as total
        , split_part(ma.kodemataanggaran, '.', 1) as subkodepertama
        , split_part(ma.kodemataanggaran, '.', 2) as subkodekedua
        , case when split_part(ma.kodemataanggaran, '.', 3) = '' then '0' else split_part(ma.kodemataanggaran, '.', 3)::int4 end as subkodeketiga
        , case when split_part(ma.kodemataanggaran, '.', 4) = '' then '0' else split_part(ma.kodemataanggaran, '.', 4)::int4 end as subkodekeempat
        , case when split_part(ma.kodemataanggaran, '.', 5) = '' then '0' else split_part(ma.kodemataanggaran, '.', 5)::int4 end as subkodekelima
        from mataanggaran_m ma 
        left JOIN mataanggaranpermen_m map on map.id=ma.mataanggaranpermenfk
		left JOIN keteranganbelanja_t kt on kt.objectmataanggaranfk=ma.id
        where ma.statusenabled = true and ma.kdprofile = 30
        and ma.mataanggaranpermenfk is null
        and length(ma.kodemataanggaran) in(9, 10)
        group by ma.id, ma.kodemataanggaran,ma.namamataanggaran,map.id, map.mataanggaranpermen
                , split_part(ma.kodemataanggaran, '.', 1)
                , split_part(ma.kodemataanggaran, '.', 2)
                , case when split_part(ma.kodemataanggaran, '.', 3) = '' then '0' else split_part(ma.kodemataanggaran, '.', 3)::int4 end
                , case when split_part(ma.kodemataanggaran, '.', 4) = '' then '0' else split_part(ma.kodemataanggaran, '.', 4)::int4 end 
                , case when split_part(ma.kodemataanggaran, '.', 5) = '' then '0' else split_part(ma.kodemataanggaran, '.', 5)::int4 end
        order by subkodepertama asc, subkodekedua asc, subkodeketiga asc, subkodekeempat asc, subkodekelima asc ;
            ")
        );

        $detail = DB::select(DB::raw("
        select ma.id, ma.kodemataanggaran,ma.namamataanggaran,map.id idmap, map.mataanggaranpermen, coalesce(sum(kt.subtotal),0) as total
        , split_part(ma.kodemataanggaran, '.', 1) as subkodepertama
        , split_part(ma.kodemataanggaran, '.', 2) as subkodekedua
        , case when split_part(ma.kodemataanggaran, '.', 3) = '' then '0' else split_part(ma.kodemataanggaran, '.', 3)::int4 end as subkodeketiga
        , case when split_part(ma.kodemataanggaran, '.', 4) = '' then '0' else split_part(ma.kodemataanggaran, '.', 4)::int4 end as subkodekeempat
        , case when split_part(ma.kodemataanggaran, '.', 5) = '' then '0' else split_part(ma.kodemataanggaran, '.', 5)::int4 end as subkodekelima
        from mataanggaran_m ma 
        left JOIN mataanggaranpermen_m map on map.id=ma.mataanggaranpermenfk
		left JOIN keteranganbelanja_t kt on kt.objectmataanggaranfk=ma.id
        where ma.statusenabled = true and ma.kdprofile = 30
        and length(ma.kodemataanggaran) in(9, 10)
        $permen
        group by ma.id, ma.kodemataanggaran,ma.namamataanggaran,map.id, map.mataanggaranpermen
                , split_part(ma.kodemataanggaran, '.', 1)
                , split_part(ma.kodemataanggaran, '.', 2)
                , case when split_part(ma.kodemataanggaran, '.', 3) = '' then '0' else split_part(ma.kodemataanggaran, '.', 3)::int4 end
                , case when split_part(ma.kodemataanggaran, '.', 4) = '' then '0' else split_part(ma.kodemataanggaran, '.', 4)::int4 end 
                , case when split_part(ma.kodemataanggaran, '.', 5) = '' then '0' else split_part(ma.kodemataanggaran, '.', 5)::int4 end
        order by subkodepertama asc, subkodekedua asc, subkodeketiga asc, subkodekeempat asc, subkodekelima asc ;
            ")
        );

        $result = array(
            'data' => $data,
            'detail' => $detail,
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
            inner join mataanggaran_m ma on ma.id = sr.objectmataanggaranfk
            left join kegiatananggaran_m kg on km.kode ilike '%' || kg.kode || '%' and kg.div = 3
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
        $thn = date("Y", strtotime($request['tglrealisasi']) );
        $jumlahall = $request['totalbelanja'];
        $jumlahsimpan = 0;
        $ceksisapanjar = 'gak ada';

       try{
            $KM= MataAnggaran::where('kodemataanggaran',$request['objectmataanggaranfk'])
            ->where('statusenabled',true)
                    ->first();

            if ($request['norec']==''){
                $MA = new StrukRealisasi();
                $norecKS = $MA->generateNewId();
                $MA->norec = $norecKS;
                $MA->kdprofile = $idProfile;
                $MA->statusenabled = true;

                // $nos = $this->generateCodeBySeqTable(new StrukRealisasi, 'norealisasi', 6, ' ',$kdProfile);
                $runningNumber = RunningNumber::where('id',13540)->first();
                $nomor = $runningNumber->nomer_terbaru +1;
                $nos = str_pad((int)$nomor, 5, "0", STR_PAD_LEFT);

                RunningNumber::where('id', 13540)
                ->update(
                    [
                        'nomer_terbaru' => $nos
                    ]
                );

                $noRealiasi = $nos.'/BPK/UP/1.02.2.22.0.00.01.0004/B02/'.$thn;
                $MA->norealisasi = $noRealiasi;
            }else{
                $MA= StrukRealisasi::where('norec',$request['norec'])
                    ->where('kdprofile', $idProfile)
                    ->first();
                    
                $jumlahall = (float)$request['totalbelanja'] - (float)$MA->totalbelanja;
            }
            if(isset($request['norealisasi'])){
                $MA->norealisasi = $request['norealisasi'];
            }
            $MA->tglrealisasi = $request['tglrealisasi'];
            $MA->status = null;//$request['status'];
            $MA->totalbelanja = $request['totalbelanja'];
            $MA->rekananfk = $request['rekananfk'];
            $MA->deskripsi = $request['deskripsi'];
            $MA->objectkegiatanfk = $request['objectkegiatanfk'];
            $MA->objectmataanggaranfk = $KM->id;
            $MA->objectcarabayarfk = $request['objectcarabayarfk'];
            $MA->objectasalprodukfk = $request['objectasalprodukfk'];
            $MA->bendaharafk = $request['bendaharafk'];
            $MA->penerimafk = $request['penerimafk'];
            $MA->pph = (float)$request['pph'];
            $MA->ppn = (float)$request['ppn'];
            $MA->objectpanjarfk = isset($request['norecpanjar'][0]) ? $request['norecpanjar'][0]['norecpanjar'] : null;
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
                } else if(!empty($item['norec'])){
                    $DT = RealisasiDetail::where('norec',$item['norec'])
                    ->where('kdprofile', $idProfile)
                    ->first();;
                    $DT->uraian = $item['uraian'];
                    $DT->jml = $item['jml'];
                    $DT->satuan = $item['satuan'];
                    $DT->harga = $item['harga'];
                    $DT->subtotal = $item['subtotal'];
                    $DT->save();
                } 
                
            }

            if($request['norecpanjar'] != null){
                if($jumlahall > 0){
                    for($i = 0; $i < count($request['norecpanjar']); $i++){

                        $npanjar = $request['norecpanjar'][$i]['norecpanjar'];
                        //cari total semua spj yang sudah dipakai di panjar itu
                        $sisaperpanjar = DB::select(DB::raw("select coalesce(jumlahpanjar,0) jumlahpanjar, coalesce(sum(jumlahspj),0) jumlahspj
                        from spjtopanjar_t 
                        where kdprofile = 30
                        and statusenabled = true
                        and objectspjfk != ''
                        and objectpanjarfk = '$npanjar'
                        group by jumlahpanjar"));
    
                        //jumlah panjar keseluruhan
                        $jumlah = DB::select(DB::raw("
                        select coalesce(pj.jumlah,0) jumlah 
                        from panjar_t pj
                        where pj.kdprofile = 30
                        and pj.statusenabled = true
                        and pj.norec = '$npanjar'
                        "));
    
                        //jumlah pengembalian
                        $pengembalian = DB::select(DB::raw("select coalesce(sum(jumlahpengembalian),0) jumlahpengembalian 
                        from(
                            select pp.jumlahpengembalian, pp.norec
                            from panjar_t pj
                            inner join pengembalianpanjar_t pp on pp.objectpanjarfk = pj.norec
                            where pj.kdprofile = 30
                            and pj.statusenabled = true
                            and pp.kdprofile = 30
                            and pp.statusenabled = true
                            and pj.norec = '$npanjar'
                            group by pp.jumlahpengembalian, pp.norec
                        ) as x
                        "));
    
                        $jumlahspj = 0;
                        if(isset($sisaperpanjar) && count($sisaperpanjar) != 0){
                            $jumlahspj = $sisaperpanjar[0]->jumlahspj;
                        }
    
                        $jumlahpanjar = 0;
                        if(isset($jumlah)){
                            $jumlahpanjar = $jumlah[0]->jumlah;
                        }
    
                        $jumlahkembali = 0;
                        if(isset($pengembalian) && count($pengembalian) != 0){
                            $jumlahkembali = $pengembalian[0]->jumlahpengembalian;
                        }
    
                        $jsisa = (float)$jumlahpanjar - (float)$jumlahspj - (float)$jumlahkembali;
                        
                        if($jsisa > 0){
                            if($jumlahall >= $jsisa){
                                $jumlahsimpan = $jsisa;
                                $jumlahall -= $jsisa;
                            } else{
                                $jumlahsimpan = $jumlahall;
                            }
        
                            $norecpanjar = $request['norecpanjar'][$i]['norecpanjar'];
        
                            $sisaperpanjar = DB::select(DB::raw("select jumlahpanjar, sum(jumlahspj) jumlahspj
                                from spjtopanjar_t 
                            where kdprofile = 30
                            and statusenabled = true
                            and objectpanjarfk = '$norecpanjar'
                            group by jumlahpanjar"));
        
                            $cek = SPJtoPanjar::where('objectpanjarfk', '=', $request['norecpanjar'][$i]['norecpanjar'])
                            ->where('objectspjfk', '=', $MA->norec)->where('statusenabled', '=', true)->first();
            
                            if(empty($cek)){
                                $SP = new SPJtoPanjar();
                                $norecKS = $SP->generateNewId();
                                $SP->norec = $norecKS;
                                $SP->kdprofile = $idProfile;
                                $SP->statusenabled = true;
                                $SP->objectpanjarfk = $request['norecpanjar'][$i]['norecpanjar'];
                                $SP->jumlahpanjar = $request['norecpanjar'][$i]['jumlah'];
                                $SP->nourut = $request['norecpanjar'][$i]['nourut'];
                                $SP->jumlahspj = $jumlahsimpan;
                                $SP->objectspjfk = $MA->norec;
            
                            } else{
                                $SP = SPJtoPanjar::where('objectpanjarfk', '=', $request['norecpanjar'][$i]['norecpanjar'])
                                ->where('objectspjfk', '=', $MA->norec)->where('statusenabled', '=', true)->first();
                                $SP->objectpanjarfk = $request['norecpanjar'][$i]['norecpanjar'];
                                $SP->jumlahpanjar = $request['norecpanjar'][$i]['jumlah'];
                                $SP->nourut = $request['norecpanjar'][$i]['nourut'];
                                $SP->jumlahspj += $jumlahsimpan;
                                $SP->objectspjfk = $MA->norec;
                                
                            }
                            $SP->save();
                        }
                    }
                } else{
                    $jumlahall = $jumlahall * (-1);
                    for($i = count($request['norecpanjar'])-1; $i >= 0; $i--){
                        $SP = SPJtoPanjar::where('objectpanjarfk', '=', $request['norecpanjar'][$i]['norecpanjar'])
                            ->where('objectspjfk', '=', $MA->norec)->where('statusenabled', '=', true)->first();
                        if($jumlahall >= $SP->jumlahspj){
                            $SP->jumlahspj -= $SP->jumlahspj;
                            $jumlahall -= $SP->jumlahspj;
                        } else{
                            $SP->jumlahspj -= $jumlahall;
                            $jumlahall -= $jumlahall;
                        }

                        $SP->save();
                    }
                }
                
            }
            $transStatus = 'true';
            
       } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Gagal";
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
            $transMessage = $transMessage;
            DB::rollBack();
            $result = array(
                'status' => 400,
                'messages'=> $transMessage,
                'line'=> $e->getLine(),
                'message'=> $e->getMessage(),
                'as' => '@epic',
            );
            
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveRealisasiSPJVerif(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataRealisasiDetail = [];
        $thn = date("Y", strtotime($request['tglrealisasi']) );
        $jumlahall = $request['totalbelanja'];
        $jumlahsimpan = 0;
        $ceksisapanjar = 'gak ada';

       try{
            $MA= StrukRealisasi::where('norec',$request['norec'])
            ->where('kdprofile', $idProfile)
            ->first();
            $MA->objectcarabayarfk = 2;
            $MA->save();

            if($request['norecpanjar'] != null){
                if($jumlahall > 0){
                    for($i = 0; $i < count($request['norecpanjar']); $i++){

                        $npanjar = $request['norecpanjar'][$i]['norecpanjar'];
                        //cari total semua spj yang sudah dipakai di panjar itu
                        $sisaperpanjar = DB::select(DB::raw("select coalesce(jumlahpanjar,0) jumlahpanjar, coalesce(sum(jumlahspj),0) jumlahspj
                        from spjtopanjar_t 
                        where kdprofile = 30
                        and statusenabled = true
                        and objectspjfk != ''
                        and objectpanjarfk = '$npanjar'
                        group by jumlahpanjar"));
    
                        //jumlah panjar keseluruhan
                        $jumlah = DB::select(DB::raw("
                        select coalesce(pj.jumlah,0) jumlah 
                        from panjar_t pj
                        where pj.kdprofile = 30
                        and pj.statusenabled = true
                        and pj.norec = '$npanjar'
                        "));
    
                        //jumlah pengembalian
                        $pengembalian = DB::select(DB::raw("select coalesce(sum(jumlahpengembalian),0) jumlahpengembalian 
                        from(
                            select pp.jumlahpengembalian, pp.norec
                            from panjar_t pj
                            inner join pengembalianpanjar_t pp on pp.objectpanjarfk = pj.norec
                            where pj.kdprofile = 30
                            and pj.statusenabled = true
                            and pp.kdprofile = 30
                            and pp.statusenabled = true
                            and pj.norec = '$npanjar'
                            group by pp.jumlahpengembalian, pp.norec
                        ) as x
                        "));
    
                        $jumlahspj = 0;
                        if(isset($sisaperpanjar) && count($sisaperpanjar) != 0){
                            $jumlahspj = $sisaperpanjar[0]->jumlahspj;
                        }
    
                        $jumlahpanjar = 0;
                        if(isset($jumlah)){
                            $jumlahpanjar = $jumlah[0]->jumlah;
                        }
    
                        $jumlahkembali = 0;
                        if(isset($pengembalian) && count($pengembalian) != 0){
                            $jumlahkembali = $pengembalian[0]->jumlahpengembalian;
                        }
    
                        $jsisa = (float)$jumlahpanjar - (float)$jumlahspj - (float)$jumlahkembali;
                        
                        if($jsisa > 0){
                            if($jumlahall >= $jsisa){
                                $jumlahsimpan = $jsisa;
                                $jumlahall -= $jsisa;
                            } else{
                                $jumlahsimpan = $jumlahall;
                            }
        
                            $norecpanjar = $request['norecpanjar'][$i]['norecpanjar'];
        
                            $sisaperpanjar = DB::select(DB::raw("select jumlahpanjar, sum(jumlahspj) jumlahspj
                                from spjtopanjar_t 
                            where kdprofile = 30
                            and statusenabled = true
                            and objectpanjarfk = '$norecpanjar'
                            group by jumlahpanjar"));
        
                            $cek = SPJtoPanjar::where('objectpanjarfk', '=', $request['norecpanjar'][$i]['norecpanjar'])
                            ->where('objectspjfk', '=', $MA->norec)->where('statusenabled', '=', true)->first();
            
                            if(empty($cek)){
                                $SP = new SPJtoPanjar();
                                $norecKS = $SP->generateNewId();
                                $SP->norec = $norecKS;
                                $SP->kdprofile = $idProfile;
                                $SP->statusenabled = true;
                                $SP->objectpanjarfk = $request['norecpanjar'][$i]['norecpanjar'];
                                $SP->jumlahpanjar = $request['norecpanjar'][$i]['jumlah'];
                                $SP->nourut = $request['norecpanjar'][$i]['nourut'];
                                $SP->jumlahspj = $jumlahsimpan;
                                $SP->objectspjfk = $MA->norec;
            
                            } else{
                                $SP = SPJtoPanjar::where('objectpanjarfk', '=', $request['norecpanjar'][$i]['norecpanjar'])
                                ->where('objectspjfk', '=', $MA->norec)->where('statusenabled', '=', true)->first();
                                $SP->objectpanjarfk = $request['norecpanjar'][$i]['norecpanjar'];
                                $SP->jumlahpanjar = $request['norecpanjar'][$i]['jumlah'];
                                $SP->nourut = $request['norecpanjar'][$i]['nourut'];
                                $SP->jumlahspj += $jumlahsimpan;
                                $SP->objectspjfk = $MA->norec;
                                
                            }
                            $SP->save();
                        }
                    }
                } else{
                    $jumlahall = $jumlahall * (-1);
                    for($i = count($request['norecpanjar'])-1; $i >= 0; $i--){
                        $SP = SPJtoPanjar::where('objectpanjarfk', '=', $request['norecpanjar'][$i]['norecpanjar'])
                            ->where('objectspjfk', '=', $MA->norec)->where('statusenabled', '=', true)->first();
                        if($jumlahall >= $SP->jumlahspj){
                            $SP->jumlahspj -= $SP->jumlahspj;
                            $jumlahall -= $SP->jumlahspj;
                        } else{
                            $SP->jumlahspj -= $jumlahall;
                            $jumlahall -= $jumlahall;
                        }

                        $SP->save();
                    }
                }
                
            }
            $transStatus = 'true';
            
       } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Gagal";
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
            $transMessage = $transMessage;
            DB::rollBack();
            $result = array(
                'status' => 400,
                'messages'=> $transMessage,
                'line'=> $e->getLine(),
                'message'=> $e->getMessage(),
                'as' => '@epic',
            );
            
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function savePanjar(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tgl = date("n", strtotime($request['tglPanjar']) );
        $thn = date("Y", strtotime($request['tglPanjar']) );
        $kode = $request['mataanggaran'];
        $ma = DB::select(DB::raw("select id from mataanggaran_m where kodemataanggaran = '$kode' and statusenabled = true"));
        try{

            if($request['norec'] == ''){

                $MA = new Panjar();
                $norecKS = $MA->generateNewId();
                $MA->norec = $norecKS;
                $MA->kdprofile = $idProfile;
                $MA->statusenabled = true;
                // $nos = $this->generateCodeBySeqTable(new Panjar, 'nopanjar', 6, ' ',$kdProfile);

                $runningNumber = RunningNumber::where('id',13541)->first();
                $nomor = $runningNumber->nomer_terbaru +1;
                $nos = str_pad((int)$nomor, 5, "0", STR_PAD_LEFT);

                RunningNumber::where('id', 13541)
                ->update(
                    [
                        'nomer_terbaru' => $nos
                    ]
                );

                $noPanjar = $nos.'/PANJAR/1.02.2.22.0.00.01.0004/'.$tgl.'/'.$thn;
                $MA->nopanjar = $noPanjar;
                
                $MA->objectsubkegiatanfk = $request['subkegiatan'];
                $MA->objectsubsubkegiatanfk = $request['subsusbkegiatan'];
                $MA->objectmataanggaranfk = $ma[0]->id;
                
            } else{
                $MA = Panjar::where('norec', '=', $request['norec'])->first();
                $MA->nopanjar = $request['nopanjar'];
            }
                $MA->tglpanjar = $request['tglPanjar'];
                $MA->uraian = $request['uraianPanjar'];
                $MA->jumlah = $request['jumlahpanjar'];
                $MA->sumberpanjar = $request['sumberPanjar'];
                $MA->idbill = $request['idbill'];
                $MA->ntpn = $request['ntpn'];
                $MA->idbillpph = $request['idbillpph'];
                $MA->ntpnpph = $request['ntpnpph'];
                $MA->objectjenispphfk = $request['objectjenispphfk'];
                $MA->pph = $request['pph'];
                $MA->ppn = $request['ppn'];
                $MA->idbillpph2 = $request['idbillpph2'];
                $MA->ntpnpph2 = $request['ntpnpph2'];
                $MA->objectjenispphfk2 = $request['objectjenispphfk2'];
                $MA->pph2 = $request['pph2'];
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

    public function saveSPJPanjar(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $spj = $request['norecspj'];
        $nourut = 1;
        try{
                $cek = DB::select(DB::raw("select nourut
                from spjtopanjar_t
                where kdprofile = 30
                and statusenabled = true
                and objectspjfk = '$spj'
                order by nourut desc
                limit 1"));

                if(!empty($cek)){
                    $nourut = $cek[0]->nourut+1;
                }

                $MA = new SPJtoPanjar();
                $norecKS = $MA->generateNewId();
                $MA->norec = $norecKS;
                $MA->kdprofile = $idProfile;
                $MA->statusenabled = true;
                $MA->objectpanjarfk = $request['details']['norecpanjar'];
                $MA->objectspjfk = $request['norecspj'];
                $MA->nourut = $nourut;
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
    
public function loadComboRincian(Request $request)
    {
        $sumberpendapatan = \DB::table('asalproduk_m')->where('kdprofile', 30)->where('statusenabled', true)->where('isanggaran', null)->orderBy('id', 'asc')->get();        $uraianpendapatan = \DB::table('uraianpendapatan_m')->where('kdprofile', 30)->where('statusenabled', true);
        $rincianpendapatan = \DB::table('rincianpendapatan_t as rp')
        ->join('asalproduk_m as ap','ap.id','=','rp.objectasalprodukfk')
        ->join('uraianpendapatan_m as up','up.id','=','rp.objecturaianpendapatanfk')
        ->select('rp.norec','rp.isperubahan', 'rp.jumlahpendapatan','rp.tahun', 'rp.tglinput', 'rp.keterangan', 'rp.objectasalprodukfk', 'rp.objecturaianpendapatanfk','up.uraianpendapatan','ap.namaexternal', 'rp.uraianpendapatan as uraian')
        ->where('rp.kdprofile', 30)->where('rp.statusenabled', true)->get();

        if(isset($request['tahun']) && $request['tahun'] != ''){
            $uraianpendapatan = $uraianpendapatan->where('tahun', $request['tahun']);
        }

        $uraianpendapatan = $uraianpendapatan->orderBy('nourut')->get();

        $result = array(
            'sumberpendapatan'=> $sumberpendapatan,
            'uraianpendapatan'=> $uraianpendapatan,
            'rincianpendapatan'=> $rincianpendapatan,
            'as'=> 'FiziLucky'
        );
        return $this->respond($result);
    }
    
    public function saveRincianPendapatan(Request $request)
    {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $data = "";
        try {
            if ($request['norec']== "") {
                $data = \DB::table('rincianpendapatan_t')->insert([
                'norec'=>substr(\Webpatser\Uuid\Uuid::generate(), 0, 32),
                'kdprofile'=> $idProfile,
                'statusenabled'=> true,
                'tglinput'=> $request['tglinput'],
                'uraianpendapatan'=> $request['uraianpendapatan'],
                'jumlahpendapatan'=> $request['jumlahpendapatan'],
                'objectasalprodukfk'=> $request['objectasalprodukfk'],
                'objecturaianpendapatanfk'=> $request['objecturaianpendapatanfk'],
                'keterangan'=> $request['keterangan'],
                'isperubahan'=> $request['isperubahan'],
                'tahun'=> date('Y', strtotime($request['tahun']))
                ]);
            } else {
                $data = \DB::table('rincianpendapatan_t')->where('norec',$request['norec'])->update([
                    'norec'=>substr(\Webpatser\Uuid\Uuid::generate(), 0, 32),
                    'kdprofile'=> $idProfile,
                    'statusenabled'=> true,
                    'tglinput'=> $request['tglinput'],
                    'uraianpendapatan'=> $request['uraianpendapatan'],
                    'jumlahpendapatan'=> $request['jumlahpendapatan'],
                    'objectasalprodukfk'=> $request['objectasalprodukfk'],
                    'objecturaianpendapatanfk'=> $request['objecturaianpendapatanfk'],
                    'keterangan'=> $request['keterangan'],
                    'isperubahan'=> $request['isperubahan'],
                    'tahun'=> date('Y', strtotime($request['tahun']))
                ]);
            }
            

            $transStatus = 'true';
        } catch (\Throwable $th) {
            $transStatus = 'false';
        }
        if ($transStatus == 'true') {
            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $data,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'line'=> $th->getLine(),
                'message'=> $th->getMessage(),
                // 'result' => $MA,
                'as' => 'Fizi@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function loadDataRincian(Request $request)
    {
        $data = \DB::select(DB::raw("SELECT * FROM rincianpendapatan_t rp 
        where rp.statusenabled = true and rp.kdprofile = 30 and rp.objectasalprodukfk = 2 and isperubahan = true and rp.norec ilike '74d3fce0-0189-11ed-b9a4-bff4c5c2'"));
    }
    public function hapusRincianPendapatan(Request $request)
    {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $data = "";
        try {
            $data = \DB::table('rincianpendapatan_t')->where('norec', $request['norec'])->delete();
            $transStatus = 'true';
        } catch (\Throwable $th) {
            $transStatus = 'false';
        }
        if ($transStatus == 'true') {
            $transMessage = "Hapus berhasil";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $data,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'line'=> $th->getLine(),
                'message'=> $th->getMessage(),
                // 'result' => $MA,
                'as' => 'Fizi@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function deleteAnggaranKas(Request $request)
    {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $data = "";
        try {
            $data = \DB::table('keteranganbelanja_t')->where('norec', $request['norec'])->where('kdprofile', $idProfile)->update([
                'statusenabled'=> false
            ]);
            $transStatus = 'true';
        } catch (\Throwable $th) {
            $transStatus = 'false';
        }
        if ($transStatus == 'true') {
            $transMessage = "Hapus berhasil";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $data,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'line'=> $th->getLine(),
                'message'=> $th->getMessage(),
                // 'result' => $MA,
                'as' => 'Fizi@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function deleteKegiatanAnggaranCentang(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        try{
            foreach ($request['data'] as $req) {
                $MA= KegiatanAnggaran::where('id',$req['id'])
                    ->where('kdprofile', $idProfile)
                    ->first();
                $MA->statusenabled = false;
                $MA->save();

            

                if($req['div'] == 4){

                    $data = \DB::table('keteranganbelanja_t')->where('objectkegiatanfk',$req['id'])->update([
                        'statusenabled'=> false
                    ]);
                }
            }

           $transStatus = 'true';
       } catch (\Exception $e) {
            $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Hapus Berhasil";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $MA,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
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
    public function deleteAnggaranKass(Request $request)
    {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $data = [];
        $req = $request['data'];
        try {
            foreach ($req as $r) {
                $data[] = DB::table('keteranganbelanja_t')->where('norec', $r['norec'])->where('kdprofile', $idProfile)->update([
                'statusenabled'=> false
                ]);
            }
            $transStatus = 'true';
        } catch (\Throwable $th) {
            $transStatus = 'false';
        }
        if ($transStatus == 'true') {
            $transMessage = "Hapus berhasil";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $data,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'line'=> $th->getLine(),
                'message'=> $th->getMessage(),
                // 'result' => $MA,
                'as' => 'Fizi@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    function getPJ(Request $request) {
        $data = DB::select(DB::raw("select pg.ispj from pegawai_m pg where pg.id = $request[id]"));
        return $this->respond($data);
    }
    public function hapusPanjar(Request $request) {
        DB::beginTransaction();
        try{
            $MA = Panjar::where('norec', '=', $request['data'])->first();
            $MA->statusenabled = false;
            $MA->save();

           $transStatus = 'true';
       } catch (\Exception $e) {
            $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Hapus";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
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

    /**
     * Get data sub sub kegiatan
     */
    public function getSubSubKegiatan(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin = $request->all();

        $tahun = $request['tahun'];
        
        $sql = DB::select(DB::raw("
            SELECT MIN(id) AS id, kode, MIN(keterangan) AS keterangan
            FROM kegiatananggaran_m
            WHERE div = 4
            AND statusenabled = TRUE
            AND tahun='$tahun'
            GROUP BY kode
            ORDER BY kode
        "));

        return $this->respond($sql);
    }

    /**
     * Get data sub sub kegiatan berdasarkan login user
     */
    public function getMapLoginToSubSub(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin = $request->all();

        $sql = DB::select(DB::raw("
            SELECT map.*, lu.namauser, ka.kode, ka.id || '-' || ka.keterangan as keterangan, ka.targetmasuk, ka.targetkeluaran
            FROM maploginusertosubsubkegiatan_s AS map
            LEFT JOIN loginuser_s AS lu ON lu.id = map.objectloginuserfk
            LEFT JOIN kegiatananggaran_m AS ka ON ka.id = map.objectsubsubkegiatanfk
            WHERE map.kdprofile = ".$idProfile."
            AND map.statusenabled = TRUE
            AND lu.id = ".$request['idLogin']."
        "));

        $result = [
            'data' => $sql
        ];

        return $this->respond($result);
    }

    /**
     * Tambah map login user ke subsub kegiatan
     */
    public function saveMapLoginToSubSub(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        
        DB::beginTransaction();
        try{
            $data = DB::table('maploginusertosubsubkegiatan_s')->insert([
                'kdprofile' => $kdProfile,
                'statusenabled' => true,
                'objectsubsubkegiatanfk' => $request['idSubSub'],
                'objectloginuserfk' => $request['idLogin']
            ]);
            $transStatus = true;
        } catch (\Exception $e) {
            $transStatus = false;
        }

        if ($transStatus) {
            $transMessage = 'Sukses';
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $data,
                'as' => 'inhuman',
            );
        } else {
            $transMessage = 'Error';
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    /**
     * Delete map login user ke subsub kegiatan
     */
    public function deleteMapLoginToSubSub(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);

        DB::beginTransaction();
        try{
            $data = DB::table('maploginusertosubsubkegiatan_s')
                ->where('id', $request['idMapLoginSub'])
                ->where('kdprofile', $kdProfile)
                ->delete();
            $transStatus = true;
        } catch (\Exception $e) {
            $transStatus = false;
        }

        if ($transStatus) {
            $transMessage = 'Sukses';
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'inhuman',
            );
        } else {
            $transMessage = 'Error';
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    /**
     * Get data combo untuk input rencana belanja
     */
    public function getComboPerencanaanBelanja(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        // SubSub
        $subSubKegiatan = DB::select(DB::raw("
            SELECT ka.id, ka.id || '-' || ka.keterangan as keterangan
            FROM maploginusertosubsubkegiatan_s AS map
            LEFT JOIN loginuser_s AS lu ON lu.id = map.objectloginuserfk
            LEFT JOIN kegiatananggaran_m AS ka ON ka.id = map.objectsubsubkegiatanfk
            WHERE map.kdprofile = ".$idProfile."
            AND map.statusenabled = TRUE
            AND lu.id = ".$request['idLogin']."
        "));

        // Asal Produk
        $asalProduk = DB::table('asalproduk_m as ap')
            ->select('ap.id','ap.asalproduk')
            ->where('ap.statusenabled',true)
            ->where('ap.isanggaran',true)
            ->orderBy('ap.asalproduk')
            ->get();

        // Produk
        $kdjenisobat = explode (',',$this->settingDataFixed('kdJenisProdukObat',$idProfile));
        $arrkdjenisobat = [];
        foreach ($kdjenisobat as $it){
            $arrkdjenisobat []=  (int)$it;
        }
        $dataProdukAll = DB::table('produk_m as pr')
            ->JOIN('detailjenisproduk_m as djp','djp.id','=','pr.objectdetailjenisprodukfk')
            ->JOIN('jenisproduk_m as jp','jp.id','=','djp.objectjenisprodukfk')
            ->leftJOIN('satuanstandar_m as ss','ss.id','=','pr.objectsatuanstandarfk')
            ->JOIN('stokprodukdetail_t as spd','spd.objectprodukfk','=','pr.id')
            ->select('pr.id','pr.namaproduk')
            ->where('pr.kdprofile', $idProfile)
            ->where('pr.statusenabled',true)
            // ->whereIn('jp.id',[97,283])
            ->whereIn('jp.id',$arrkdjenisobat)
            ->groupBy('pr.id','pr.namaproduk')
            ->orderBy('pr.namaproduk')
            ->get();
        
        //Prioritas
        $prioritas = DB::table('filter_t')->where('keterangan', 'level-rencana')->get(); 

        $result = [
            'subSubKegiatan' => $subSubKegiatan,
            'dataProdukAll' => $dataProdukAll,
            'asalProduk' => $asalProduk,
            'prioritas' => $prioritas,
        ];

        return $this->respond($result);
    }

    /**
     * Get info stock produk yang dipilih berdasarkan ruangan
     */
    public function getInfoStokPerencanaan(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        // Query id ruangan yang hanya digudang
        $kdRuanganDepoRajal = $this->settingDataFixed('kdruanganperencanaan', $idProfile);

        // Query stok produk
        $sql = DB::select(DB::raw("
        SELECT
            ru.id,
            ru.namaruangan,
            CAST ( SUM ( spd.qtyproduk ) AS FLOAT ) AS qtyproduk
        FROM
            stokprodukdetail_t AS spd
            INNER JOIN ruangan_m AS ru ON ru.ID = spd.objectruanganfk
            INNER JOIN strukpelayanan_t AS sk ON sk.norec = spd.nostrukterimafk 
        WHERE
            spd.kdprofile = 30 
            AND spd.objectprodukfk =".$request['produkfk']."
            AND ru.statusenabled = TRUE
            AND spd.objectruanganfk IN(".$kdRuanganDepoRajal.")
        GROUP BY
            ru.namaruangan,
            ru.id
        "));

        return $this->respond($sql);
    }

    /**
     * Simpan data perencanaan
     */
    public function simpanRencanaBelanja(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $strukPerencanaan = new StrukPerencanaan();
        
        $norec = $strukPerencanaan->generateNewId();

        $noStruk = $this->generateCode(new StrukPerencanaan, 'nostruk', 9, 'P' . $this->getDateTime()->format('ym'), $idProfile);
        
        DB::beginTransaction();
        try{

            $struk = DB::table('strukperencanaan_t')->insert([
                'norec' => $norec,
                'kdprofile' => $idProfile,
                'nostruk' => $noStruk, 
                'statusenabled' => true,
                'tgldokumen' => $request['tgldokumen'],
                'objectpegawaifk' => $request['idLogin'],
                'objectruanganasalfk' => $request['idRuangan'],
                'keteranganlainnya' => 'Rencana Usulan Pengadaan',
                'objectsubkegiatanfk' => $request['idSubSubKegiatan'],
                'objectsumberdanafk' => $request['idMataAnggaran'],
            ]);

            foreach($request['dataPerencanaan'] as $item){
                $strukPerencanaanDetail = new StrukPerencanaanDetail();

                DB::table('strukperencanaandetail_t')->insert([
                    'norec' => $strukPerencanaanDetail->generateNewId(),
                    'nostrukfk' => $norec,
                    'kdprofile' => $idProfile,
                    'statusenabled' => TRUE,
                    'objectprodukfk' => (isset($item['produk']['id'])) ? $item['produk']['id'] : null,
                    'namaproduk' => (isset($item['produk']['namaproduk'])) ? $item['produk']['namaproduk'] : null,
                    'namakegiatan' => (isset($item['namaKegiatan'])) ? $item['namaKegiatan'] : null,
                    'qtystok' => (isset($item['stokProduk'])) ? $item['stokProduk'] : null,
                    'qtyrencana' => $item['jumlahRencana'],
                    'hargasatuan' => $item['hargaSatuan'],
                    'keteranganlainnya' => $item['listReverensi'],
                    'isverifikasi' => FALSE,
                ]);
            }
            $transStatus = true;
        }catch (\Exception $e) {
            $transStatus = false;
            $result = $e;
        }

        if ($transStatus) {
            $transMessage = 'Sukses';
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'inhuman',
            );
        } else {
            $transMessage = 'Error';
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $e->getMessage(),
                'as' => 'inhuman',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result);

    }

    /**
     * Get data perencanaan
     */
    public function getRencanaBelanja(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];

        $rencana = DB::select(DB::raw("
            SELECT sp.tglverifikasi, sp.statusenabled, sp.objectsubkegiatanfk, sp.norec, sp.tgldokumen, sp.nostruk, pg.namalengkap, ka.id || '-' || ka.keterangan AS keterangan, ma.kodemataanggaran || '-' || ma.namamataanggaran AS matanggaran, ru.namaruangan
            FROM strukperencanaan_t as sp
            LEFT JOIN pegawai_m as pg ON pg.id = sp.objectpegawaifk
            LEFT JOIN kegiatananggaran_m as ka ON ka.id = sp.objectsubkegiatanfk
            LEFT JOIN mataanggaran_m as ma ON ma.id = sp.objectsumberdanafk
            LEFT JOIN ruangan_m as ru ON ru.id = sp.objectruanganasalfk
            WHERE sp.keteranganlainnya = 'Rencana Usulan Pengadaan'
            AND sp.statusenabled = TRUE
            AND sp.kdprofile = $idProfile
            AND sp.tgldokumen BETWEEN '$tglAwal' AND '$tglAkhir'
            ORDER BY sp.nostruk
        "));

        $data = [];
        foreach($rencana as $key=>$item){
            $detail = DB::select(DB::raw("
                SELECT spd.qtyverifikasi, spd.namakegiatan, spd.hargasatuan, spd.isverifikasi, spd.norec, spd.nostrukfk, spd.objectprodukfk, spd.qtyrencana, spd.qtystok, spd.keteranganlainnya, pr.namaproduk
                FROM strukperencanaandetail_t as spd
                LEFT JOIN produk_m as pr ON pr.id = spd.objectprodukfk
                WHERE spd.nostrukfk = '$item->norec'
                AND spd.statusenabled = TRUE
                AND spd.kdprofile = ".$idProfile."
            "));
            $data[$key]['rencana'] = $item;
            $data[$key]['details'] = $detail;
        }

        return $this->respond($data);
    }

    /**
     * Delete data perencanaan
     */
    public function deleteRencanaBelanja(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        DB::beginTransaction();
        try{

            DB::table('strukperencanaan_t')
                ->where('norec', $request['norec'])
                ->update([
                    'statusenabled' => false
                ]);
            DB::table('strukperencanaandetail_t')
                ->where('nostrukfk', $request['norec'])
                ->update([
                    'statusenabled' => false
                ]);

            $transStatus = true;
        }catch(\Exception $e){
            $transStatus = false;
            $result = $e;
        }

        if ($transStatus) {
            $transMessage = 'Sukses';
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'inhuman',
            );
        } else {
            $transMessage = 'Error';
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $e->getMessage(),
                'as' => 'inhuman',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result);
    }

    /**
     * Edit data perencanaan
     */
    public function editRencanaBelanja(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $rencana = DB::table('strukperencanaan_t as sp')
            ->select(DB::raw("sp.statusenabled, sp.objectsubkegiatanfk, sp.objectsumberdanafk, sp.norec, sp.tgldokumen, sp.nostruk, sp.objectruanganasalfk, pg.namalengkap, ka.id || '-' || ka.keterangan AS keterangan, ma.kodemataanggaran || '-' || ma.namamataanggaran AS matanggaran, ru.namaruangan, dp.namadepartemen AS departemen, ru.objectdepartemenfk"))
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'sp.objectpegawaifk')
            ->leftJoin('kegiatananggaran_m as ka', 'ka.id', '=', 'sp.objectsubkegiatanfk')
            ->leftJoin('mataanggaran_m as ma', 'ma.id', '=', 'sp.objectsumberdanafk')
            ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'sp.objectruanganasalfk')
            ->leftJoin('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
            ->where('sp.keteranganlainnya', '=', 'Rencana Usulan Pengadaan')
            ->where('sp.statusenabled', '=', true)
            ->where('sp.kdprofile', '=', $idProfile)
            ->where('sp.kdprofile', '=', $idProfile)
            ->where('sp.norec', '=', $request['norec'])
            ->first();

        $detail = DB::select(DB::raw("
            SELECT spd.namakegiatan, spd.hargasatuan, spd.isverifikasi, spd.norec, spd.nostrukfk, spd.objectprodukfk, spd.qtyrencana, spd.qtystok, spd.keteranganlainnya, pr.namaproduk
            FROM strukperencanaandetail_t as spd
            LEFT JOIN produk_m as pr ON pr.id = spd.objectprodukfk
            WHERE spd.nostrukfk = '$rencana->norec'
            AND spd.statusenabled = TRUE
            AND spd.kdprofile = $idProfile
        "));

        $subsub = [
            'id' => $rencana->objectsubkegiatanfk,
            'keterangan' => $rencana->keterangan
        ];

        $ruangan = [
            'id' => $rencana->objectruanganasalfk,
            'namaruangan' => $rencana->namaruangan,
            'objectdepartemenfk' => $rencana->objectdepartemenfk,
            'departemen' => $rencana->departemen
        ];

        $mataanggarancombo = DB::select(DB::raw("select cbs.id, cbs.kodemataanggaran, cbs.namamataanggaran, cbs.kodemataanggaran || ' - ' || cbs.namamataanggaran as text
            , split_part(cbs.kodemataanggaran, '.', 1) as subkodepertama
            , split_part(cbs.kodemataanggaran, '.', 2) as subkodekedua
            , case when split_part(cbs.kodemataanggaran, '.', 3) = '' then '0' else split_part(cbs.kodemataanggaran, '.', 3)::int4 end as subkodeketiga
            , case when split_part(cbs.kodemataanggaran, '.', 4) = '' then '0' else split_part(cbs.kodemataanggaran, '.', 4)::int4 end as subkodekeempat
            , case when split_part(cbs.kodemataanggaran, '.', 5) = '' then '0' else split_part(cbs.kodemataanggaran, '.', 5)::int4 end as subkodekelima
            from mataanggaran_m as cbs
            where cbs.kdprofile = $idProfile
            and cbs.statusenabled = true
            and cbs.id = $rencana->objectsumberdanafk 
            order by subkodepertama asc, subkodekedua asc, subkodeketiga asc, subkodekeempat asc, subkodekelima asc ;
        "));

        $rencana->details = $detail;
        $rencana->subsub = $subsub;
        $rencana->mataanggaran = $mataanggarancombo[0];
        $rencana->ruangan = $ruangan;

        // dd($rencana);
        return $this->respond($rencana);
    }

    /**
     * Update data perencanaan
     */
    public function updateRencanaBelanja(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $noStruk = $this->generateCode(new StrukPerencanaan, 'nostruk', 9, 'P' . $this->getDateTime()->format('ym'), $idProfile);
        
        DB::beginTransaction();
        try{

            // Update Perencanaan
            $struk = DB::table('strukperencanaan_t')->where('norec', $request['norec'])->update([
                'kdprofile' => $idProfile,
                'statusenabled' => true,
                'tgldokumen' => $request['tgldokumen'],
                'objectpegawaifk' => $request['idLogin'],
                'objectruanganasalfk' => $request['idRuangan'],
                'keteranganlainnya' => 'Rencana Usulan Pengadaan',
                'objectsubkegiatanfk' => $request['idSubSubKegiatan'],
                'objectsumberdanafk' => $request['idMataAnggaran'],
            ]);

            // Delete Detail Perencanaan Sebelumnya
            DB::table('strukperencanaandetail_t')->where('nostrukfk', $request['norec'])->delete();

            foreach($request['dataPerencanaan'] as $item){
                $strukPerencanaanDetail = new StrukPerencanaanDetail();
                DB::table('strukperencanaandetail_t')->insert([
                    'norec' => $strukPerencanaanDetail->generateNewId(),
                    'nostrukfk' => $request['norec'],
                    'kdprofile' => $idProfile,
                    'statusenabled' => TRUE,
                    'objectprodukfk' => $item['produk']['id'],
                    'qtyrencana' => $item['jumlahRencana'],
                    'qtystok' => $item['stokProduk'],
                    'keteranganlainnya' => $item['listReverensi'],
                    'isverifikasi' => FALSE,
                ]);
            }
            $transStatus = true;
        }catch (\Exception $e) {
            $transStatus = false;
            $result = $e;
        }

        if ($transStatus) {
            $transMessage = 'Sukses';
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'inhuman',
            );
        } else {
            $transMessage = 'Error';
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $e->getMessage(),
                'as' => 'inhuman',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result);

    }

    public function verifikasiRencanaBelanja(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        DB::beginTransaction();
        try{

            // Update Perencanaan
            $struk = DB::table('strukperencanaan_t')->where('norec', $request['norec'])->update([
                'kdprofile' => $idProfile,
                'statusenabled' => true,
                'objectpegawaiveriffk' => $request['idLogin'],
                'tglverifikasi' => $request['tglVerifikasi'],
                'objectprioritasfk' => $request['idPrioritas']
            ]);

            foreach($request['dataPerencanaan'] as $item){
                $strukPerencanaanDetail = new StrukPerencanaanDetail();
                $keteranganBelanja = new KeteranganBelanja();

                /**
                 * Kode ini akan mendisable setiap detail struk pengajuan berdasarkan norec struk pengajuan
                 * Kemudian akan melakukan insert data yang diverifikasi
                 */
                // DB::table('detailperencanaan_t')->where('nostrukfk', $request['norec'])->update([
                //     'statusenabled' => false
                // ]);

                // DB::table('detailperencanaan_t')->insert([
                //     'norec' => $strukPerencanaanDetail->generateNewId(),
                //     'kdprofile' => $idProfile,
                //     'statusenabled' => true,
                //     'nostrukfk' => $request['norec'],
                //     'objectprodukfk' => $item['produk']['id'],
                //     'qtystok' => $item['stokProduk'],
                //     'qtyperencanaan' => $item['jumlahRencana'],
                //     'qtyverifikasi' => $item['jumlahVerifikasi'],
                //     'keteranganlainnya' => $item['listReverensi'],
                //     'isverifikasi' => true
                // ]);


                /**
                 * Kode ini akan meupdate setiap detail struk pengajuan berdasarkan norec detail struk pengajuan
                 * dan apabila tidak ada norec (yang berarti menambah data baru saat verifikasi) maka akan
                 * insert data. apabila data sebelumnya didelete maka data tersebut masih ada dan tidak akan
                 * terdelete.
                 */
                if(isset($item['norec'])){
                    DB::table('strukperencanaandetail_t')->where('norec', $item['norec'])->update([
                        'kdprofile' => $idProfile,
                        'statusenabled' => true,
                        'objectprodukfk' => (isset($item['produk']['id'])) ? $item['produk']['id'] : null,
                        'namaproduk' => (isset($item['produk']['namaproduk'])) ? $item['produk']['namaproduk'] : null,
                        'namakegiatan' => (isset($item['namaKegiatan'])) ? $item['namaKegiatan'] : null,
                        'qtystok' => (isset($item['stokProduk'])) ? $item['stokProduk'] : null,
                        'qtyrencana' => $item['jumlahRencana'],
                        'qtyverifikasi' => $item['jumlahVerifikasi'],
                        'keteranganlainnya' => $item['listReverensi'],
                        'isverifikasi' => true
                    ]);
                }
                else{
                    DB::table('strukperencanaandetail_t')->insert([
                        'norec' => $strukPerencanaanDetail->generateNewId(),
                        'kdprofile' => $idProfile,
                        'statusenabled' => true,
                        'nostrukfk' => $request['norec'],
                        'objectprodukfk' => (isset($item['produk']['id'])) ? $item['produk']['id'] : null,
                        'namaproduk' => (isset($item['produk']['namaproduk'])) ? $item['produk']['namaproduk'] : null,
                        'namakegiatan' => (isset($item['namaKegiatan'])) ? $item['namaKegiatan'] : null,
                        'qtystok' => (isset($item['stokProduk'])) ? $item['stokProduk'] : null,
                        'qtyperencanaan' => $item['jumlahRencana'],
                        'qtyverifikasi' => $item['jumlahVerifikasi'],
                        'keteranganlainnya' => $item['listReverensi'],
                        'isverifikasi' => true
                    ]);
                }

                /**
                 * Simpan ke keterangan belanja
                 */
                DB::table('keteranganbelanja_t')->insert([
                    'norec' => $keteranganBelanja->generateNewId(),
                    'kdprofile' => $idProfile,
                    'statusenabled' => true,
                    'objectkegiatanfk' => $request['idKegiatan'],
                    'objectmataanggaranfk' => $request['idMataAnggaran'],
                    'keteranganbelanja' => (isset($item['produk']['id'])) ? $item['produk']['namaproduk'] : $item['namaKegiatan'],
                    'jml' => $item['jumlahVerifikasi'],
                    'hargasatuan' => $item['hargaSatuan'],
                    'subtotal' => ($item['jumlahVerifikasi'] * $item['hargaSatuan']),
                    'objectasalprodukfk' => $request['idAsalProduk'],
                    'objecttahapfk' => $request['idTahap'],
                ]);
            }
            $transStatus = true;
        }catch (\Exception $e) {
            $transStatus = false;
            $result = $e;
        }

        if ($transStatus) {
            $transMessage = 'Sukses';
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'inhuman',
            );
        } else {
            $transMessage = 'Error';
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $e->getMessage(),
                'as' => 'inhuman',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result);
    }

    public function getLockAngkas(Request $request)
    {

        $data = DB::select(DB::raw("
            SELECT
                ka.ID idsubsubkegiatan,
                ka.kode kodesubsubkegiatan,
                reverse(split_part(reverse(ka.keterangan), '-', 1)) keterangan,
                ka.tahun,
                ka.islock,
                ka.islockrba,
                ka.islockangkas,
                ta.id idtahap,
                ta.tahap,
                ka3.kode kodesubkegiatan,
                ka3.keterangan keterangansubkegiatan,
                ka3.id idsubkegiatan,
                ka3.keterangan || ' ~ ' || reverse(split_part(reverse(ka.keterangan), '-', 1)) AS TEXT
            FROM
                kegiatananggaran_m AS ka
                JOIN kegiatananggaran_m AS ka3 on ka.kode ilike ka3.kode || '%' and ka3.div = 3
                JOIN keteranganbelanja_t AS kb on kb.objectkegiatanfk = ka.id
                JOIN alokasiketeranganbelanja_t AS ak ON ak.keteranganbelanjafk = kb.norec
                JOIN tahapanggaran_m AS ta on ta.id = kb.objecttahapfk
            WHERE
                ka.statusenabled = TRUE 
                AND ka.kdprofile = 30 
                AND ka.div = 4 
                AND ka3.statusenabled = TRUE 
                AND ka3.kdprofile = 30 
                AND kb.statusenabled = TRUE 
                AND kb.kdprofile = 30 
                AND ta.statusenabled = TRUE 
                AND ta.kdprofile = 30
                AND ak.statusenabled = TRUE
                AND ak.kdprofile = 30
                -- disesuaikan
                AND ta.id = ".$request['tahap']."
                AND ka.tahun = '".$request['tahun']."'
            GROUP BY
                ka.norec,
                ta.ID,
                ta.tahap,
                ka3.kode,
                ka3.keterangan,
                ka3.ID,
                ka.tahun,
                ka.islock,
                ka.kode,
                ka.keterangan,
                ka.ID,
                ka3.keterangan || ' ~ ' || ka.keterangan,
                ka.islockrba
            ORDER BY
                ka3.kode,
                CAST(reverse(split_part(reverse(ka.kode), '.', 1)) AS INTEGER)
        "));


        return $this->respond($data);
    }

    public function saveLockAngkas(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);

        for($i = 0; $i < count($request['data']); $i++){
            $STSK = KegiatanAnggaran::where('id', '=', $request['data'][$i]['idsubsubkegiatan'])->first();
            $STSK->islockangkas = $request['data'][$i]['iscek'];
            $STSK->save();
        }
               
        if($STSK->save()){
            $transStatus = 'true';
        } else{
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Lock Angkas Sukses";
            $status = 201;
        } else if ($transStatus == 'false') {
            $transMessage = "Simpan Lock Angkas Gagal";
            $status = 400;
        }

        $result = array(
            'status' => $status,
            'message'=> $transMessage,
            'as' => 'er@epic',
        );

        return $this->setStatusCode($result['status'])->respond($result, $result['message']);
    }
}