<?php

namespace App\Http\Controllers\Gizi;
use App\Http\Controllers\ApiController;
use App\Master\SiklusGizi;
use Carbon\Carbon;
use Illuminate\Http\Request;
use DB;
use App\Traits\Valet;
use Webpatser\Uuid\Uuid;
use App\Master\Pegawai;
use App\Master\Pasien;
use App\Master\Ruangan;
use App\Transaksi\StokProdukDetail;
use App\Transaksi\KartuStok;
use App\Transaksi\StrukKirim;
use App\Transaksi\KirimProduk;
use App\Transaksi\StrukClosing;
use App\Transaksi\StokProdukDetailOpname;
use App\Transaksi\StrukOrder;
use App\Transaksi\OrderPelayanan;
use App\Master\JenisDiet;
use App\Master\JenisWaktu;
use App\Master\KategoryDiet;
use App\Transaksi\PasienDaftar;
use App\Transaksi\AntrianPasienDiperiksa;
use App\Transaksi\RiwayatOrderGizi;
class LaporanGiziController extends ApiController
{
    use Valet;
    public function __construct()
    {
        parent::__construct($skip_authentication=false);
    }

    public function saveLabelGizi(Request $request) {
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        try{
            // if ($request['strukkirim']['norec_sk'] == '') {
            $noKirim = $this->generateCode(new StrukKirim, 'nokirim', 14, 'KM-' . $this->getDateTime()->format('ym'),$kdProfile);
            $dataSK = new StrukKirim();
            $dataSK->norec = $dataSK->generateNewId();
            $dataSK->nokirim = $noKirim;
            $dataSK->kdprofile = $kdProfile;
            $dataSK->statusenabled = true;
            $dataSK->tglkirim = $request['tglmenu'];
            // }else{
            //     $dataSK = StrukKirim::where('norec',$request['strukkirim']['norec_sk'])->first();
            //     // $delKP = KirimProduk::where('nokirimfk',$request['strukkirim']['norec_sk'])->delete();
            // }
            $dataSK->objectpegawaipengirimfk = $this->getCurrentUserID();
            $dataSK->objectruanganasalfk = $request['objectruanganasalfk']; /*ruang gizi */
            $dataSK->objectruanganfk = $request['objectruanganasalfk'];
            $dataSK->objectruangantujuanfk = $request['objectruangantujuanfk'];
            $dataSK->jenispermintaanfk = 1; /*transfer */
            $dataSK->objectkelompoktransaksifk = 98;
            // $dataSK->keteranganlainnyakirim = $request['strukkirim']['keterangan'];
            $dataSK->qtydetailjenisproduk = 0;
            $dataSK->qtyproduk = 0;
            $dataSK->totalbeamaterai = 0;
            $dataSK->totalbiayakirim = 0;
            $dataSK->totalbiayatambahan = 0;
            $dataSK->totaldiscount = 0;
            $dataSK->totalhargasatuan =0;
            $dataSK->totalharusdibayar = 0;
            $dataSK->totalpph =0;
            $dataSK->totalppn = 0;
            // if(isset( $request['norec_pd'])){
            $dataSK->noregistrasifk = $request['norec_pd'];
            // }
//            $dataSK->noregistrasifk = $request['strukkirim']['norec_pd'];
            $dataSK->save();
            // return $dataSK;

            $so = StrukOrder::where('norec',$request['norec_so'])->update(
                [
                    'tglpelayananawal' => $request['tglmenu'],
                ]
            );
            OrderPelayanan::where('norec',$request['norec_op'])->update(
                [
                    'objectjeniswaktufk' => $request['jeniswaktu'],
                    'strukkirimfk' => $dataSK->norec,
                ]
            );
            $cekrog = RiwayatOrderGizi::where('tglmenu', $request['tglmenu'])->where('arrjenisdiet',$request['arrjenisdiet'])
            ->where('objectjeniswaktufk',$request['jeniswaktu'])->where('norec_op',$request['norec_op'])->get();
            if(count($cekrog) == 0){
                $rog = new RiwayatOrderGizi;
                $rog->norec = substr(Uuid::generate(), 0, 32);;
                $rog->kdprofile = $kdProfile;
                $rog->statusenabled = true;
                $rog->tglmenu = $request['tglmenu'];
                $rog->arrjenisdiet = $request['arrjenisdiet'];
                $rog->objectjeniswaktufk = $request['jeniswaktu'];
                $rog->objectruanganfk = $request['objectruanganfk'];
                $rog->objectkelasfk = $request['objectkelasfk'];
                $rog->norec_op = $request['norec_op'];
                $rog->save();
            }
            

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Order ";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
//                "strukorder" => $dataSO,
                "as" => 'inhuman',
            );

        } else {
            $transMessage = "Simpan Order Pelayanan Gagal" ;
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "e"=> $e->getMessage() . $e->getLine(),
//                "nokirim" => $dataSO,//$noResep,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function LaporanPermintaanMakanGizi(Request $request)
    {
        // $tgl = \DB::select(DB::raw("SELECT GENERATE_SERIES(date_part('day', '2022-10-01'::date)::integer ,date_part('day', '2022-10-01'::date + '1 month'::interval - '1 day'::interval)::integer)"));
        $kdProfile = (int) $this->getDataKdProfile($request);
        $ruangan = '';
        if(isset($request['ruangan'])){
            $ruangan = "where rog.objectruanganfk = $request[ruangan]";
        }
        $main = \DB::select(DB::raw("select id, jenisdiet from jenisdiet_m where statusenabled = true and kdprofile = $kdProfile "));
        $data = \DB::select(DB::raw("SELECT jd.id,jd.jenisdiet, 
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
            
            FROM (SELECT rog.kdprofile, rog.statusenabled, rog.tglmenu, rog.norec_op,unnest(string_to_array(rog.arrjenisdiet, ','))::integer as arr FROM riwayatordergizi_t rog $ruangan )as x
            inner join jenisdiet_m jd on jd.id = x.arr
            where date_part('month', x.tglmenu)= $request[bulan] and date_part('year', x.tglmenu) = $request[tahun] and x.kdprofile = 30 and x.statusenabled = true 
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
                    $a1 += $d->a1;
                    $a2 += $d->a2;
                    $a3 += $d->a3;
                    $a4 += $d->a4;
                    $a5 += $d->a5;
                    $a6 += $d->a6;
                    $a7 += $d->a7;
                    $a8 += $d->a8;
                    $a9 += $d->a9;
                    $a10 += $d->a10;
                    $a11 += $d->a11;
                    $a12 += $d->a12;
                    $a13 += $d->a13;
                    $a14 += $d->a14;
                    $a15 += $d->a15;
                    $a16 += $d->a16;
                    $a17 += $d->a17;
                    $a18 += $d->a18;
                    $a19 += $d->a19;
                    $a20 += $d->a20;
                    $a21 += $d->a21;
                    $a22 += $d->a22;
                    $a23 += $d->a23;
                    $a24 += $d->a24;
                    $a25 += $d->a25;
                    $a26 += $d->a26;
                    $a27 += $d->a27;
                    $a28 += $d->a28;
                    $a29 += $d->a29;
                    $a30 += $d->a30;
                    $a31 += $d->a31;
                    
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
            CASE WHEN x.reportdisplay = 'kelas_2' THEN	count(x.arrjenisdiet)else 0 END as kelas_2,
            CASE WHEN x.reportdisplay = 'kelas_1' THEN count(x.arrjenisdiet)else 0 END as kelas_1,
            CASE WHEN x.reportdisplay = 'Non Kelas' AND x.idr = 802 THEN count(x.arrjenisdiet)else 0 END as arimbi,
            CASE WHEN x.reportdisplay = 'Non Kelas' AND x.idr = 792 THEN count(x.arrjenisdiet)else 0 END as bima,
            CASE WHEN x.reportdisplay = 'Non Kelas' AND x.idr = 796 THEN count(x.arrjenisdiet)else 0 END as drupadi,
            CASE WHEN x.reportdisplay = 'Non Kelas' AND x.idr = 800 THEN count(x.arrjenisdiet)else 0 END as kresna,
            CASE WHEN x.reportdisplay = 'Non Kelas' AND x.idr = 805 THEN count(x.arrjenisdiet)else 0 END as yudistira
            FROM (SELECT date_part('day', rog.tglmenu)tglmenu, unnest(string_to_array(rog.arrjenisdiet, ','))arrjenisdiet, ke.reportdisplay, ru.id idr FROM riwayatordergizi_t rog 
            inner join kelas_m ke on ke.id = rog.objectkelasfk
            inner join ruangan_m ru on ru.id = rog.objectruanganfk where date_part('month', rog.tglmenu) = $request[bulan] and date_part('year', rog.tglmenu) = $request[tahun])as x
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
            count(x.arr)filter(where jw.id in(0,3) and ke.reportdisplay ilike 'vip') as vip1,
            count(x.arr)filter(where jw.id in(0,3) and ke.reportdisplay ilike 'kelas_3') as k31,
            count(x.arr)filter(where jw.id in(0,3) and ke.reportdisplay ilike 'kelas_2') as k21,
            count(x.arr)filter(where jw.id in(0,3) and ke.reportdisplay ilike 'kelas_1') as k11,
            count(x.arr)filter(where jw.id in(0,3) and ke.reportdisplay ilike 'Non Kelas' and ru.id =802 ) as arimbi1,
            count(x.arr)filter(where jw.id in(0,3) and ke.reportdisplay ilike 'Non Kelas' and ru.id =792 ) as bima1,
            count(x.arr)filter(where jw.id in(0,3) and ke.reportdisplay ilike 'Non Kelas' and ru.id =796 ) as drupadi1,
            count(x.arr)filter(where jw.id in(0,3) and ke.reportdisplay ilike 'Non Kelas' and ru.id =800 ) as kresna1,
            count(x.arr)filter(where jw.id in(0,3) and ke.reportdisplay ilike 'Non Kelas' and ru.id =805 ) as yudistira1,
            count(x.arr)filter(where jw.id in(0,3)) as jumlah1,

            /*siang*/
            count(x.arr)filter(where jw.id in(1,4) and ke.reportdisplay ilike 'vip') as vip2,
            count(x.arr)filter(where jw.id in(1,4) and ke.reportdisplay ilike 'kelas_3') as k32,
            count(x.arr)filter(where jw.id in(1,4) and ke.reportdisplay ilike 'kelas_2') as k22,
            count(x.arr)filter(where jw.id in(1,4) and ke.reportdisplay ilike 'kelas_1') as k12,
            count(x.arr)filter(where jw.id in(1,4) and ke.reportdisplay ilike 'Non Kelas' and ru.id =802 ) as arimbi2,
            count(x.arr)filter(where jw.id in(1,4) and ke.reportdisplay ilike 'Non Kelas' and ru.id =792 ) as bima2,
            count(x.arr)filter(where jw.id in(1,4) and ke.reportdisplay ilike 'Non Kelas' and ru.id =796 ) as drupadi2,
            count(x.arr)filter(where jw.id in(1,4) and ke.reportdisplay ilike 'Non Kelas' and ru.id =800 ) as kresna2,
            count(x.arr)filter(where jw.id in(1,4) and ke.reportdisplay ilike 'Non Kelas' and ru.id =805 ) as yudistira2,
            count(x.arr)filter(where jw.id in(1,4)) as jumlah2,

            /*sore*/
            count(x.arr)filter(where jw.id in(2,5) and ke.reportdisplay ilike 'vip') as vip3,
            count(x.arr)filter(where jw.id in(2,5) and ke.reportdisplay ilike 'kelas_3') as k33,
            count(x.arr)filter(where jw.id in(2,5) and ke.reportdisplay ilike 'kelas_2') as k23,
            count(x.arr)filter(where jw.id in(2,5) and ke.reportdisplay ilike 'kelas_1') as k13,
            count(x.arr)filter(where jw.id in(2,5) and ke.reportdisplay ilike 'Non Kelas' and ru.id =802 ) as arimbi3,
            count(x.arr)filter(where jw.id in(2,5) and ke.reportdisplay ilike 'Non Kelas' and ru.id =792 ) as bima3,
            count(x.arr)filter(where jw.id in(2,5) and ke.reportdisplay ilike 'Non Kelas' and ru.id =796 ) as drupadi3,
            count(x.arr)filter(where jw.id in(2,5) and ke.reportdisplay ilike 'Non Kelas' and ru.id =800 ) as kresna3,
            count(x.arr)filter(where jw.id in(2,5) and ke.reportdisplay ilike 'Non Kelas' and ru.id =805 ) as yudistira3,
            count(x.arr)filter(where jw.id in(2,5)) as jumlah3,

            /*hari*/
            count(x.arr)filter(where   ke.reportdisplay ilike 'vip') as vip4,
            count(x.arr)filter(where   ke.reportdisplay ilike 'kelas_3') as k34,
            count(x.arr)filter(where   ke.reportdisplay ilike 'kelas_2') as k24,
            count(x.arr)filter(where   ke.reportdisplay ilike 'kelas_1') as k14,
            count(x.arr)filter(where   ke.reportdisplay ilike 'Non Kelas' and ru.id =802 ) as arimbi4,
            count(x.arr)filter(where   ke.reportdisplay ilike 'Non Kelas' and ru.id =792 ) as bima4,
            count(x.arr)filter(where   ke.reportdisplay ilike 'Non Kelas' and ru.id =796 ) as drupadi4,
            count(x.arr)filter(where   ke.reportdisplay ilike 'Non Kelas' and ru.id =800 ) as kresna4,
            count(x.arr)filter(where   ke.reportdisplay ilike 'Non Kelas' and ru.id =805 ) as yudistira4,
            count(x.arr)as jumlah4
            from (
            select rog.tglmenu,unnest(string_to_array(rog.arrjenisdiet, ','))arr, rog.objectjeniswaktufk, rog.objectkelasfk, rog.objectruanganfk FROM riwayatordergizi_t rog
            )as x
            inner join jenisdiet_m jd on jd.id = x.arr::integer
            inner join jeniswaktu_m jw on jw.id = x.objectjeniswaktufk
            inner join kelas_m ke on ke.id = x.objectkelasfk
            inner join ruangan_m ru on ru.id = x.objectruanganfk
            where x.tglmenu = '$request[periode]'::date
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
                    $vip1=$d->vip1; $vip2=$d->vip2; $vip3=$d->vip3;$vip4 = $d->vip4; 
                    $k31 = $d->k31; $k32=$d->k32;$k33=$d->k33;$k34=$d->k34; 
                    $k21=$d->k21;$k22=$d->k22;$k23=$d->k23;$k24=$d->k24; 
                    $k11=$d->k11;$k12=$d->k12;$k13=$d->k13;$k14=$d->k14; 
                    $arimbi1=$d->arimbi1;$arimbi2=$d->arimbi2;$arimbi3=$d->arimbi3;$arimbi4=$d->arimbi4;
                    $bima1=$d->bima1;$bima2=$d->bima2;$bima3=$d->bima3;$bima4=$d->bima4; 
                    $drupadi1=$d->drupadi1;$drupadi2=$d->drupadi2;$drupadi3=$d->drupadi3;$drupadi4=$d->drupadi4; 
                    $kresna1=$d->kresna1;$kresna2=$d->kresna2;$kresna3=$d->kresna3;$kresna4=$d->kresna4; 
                    $yudistira1=$d->yudistira1;$yudistira2=$d->yudistira2;$yudistira3=$d->yudistira3;$yudistira4=$d->yudistira4;
                    $jumlah1=$d->jumlah1;$jumlah2=$d->jumlah2;$jumlah3=$d->jumlah3;$jumlah4=$d->jumlah4; 
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
