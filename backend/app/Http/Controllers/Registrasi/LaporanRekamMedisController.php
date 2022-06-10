<?php
/**
 * Created by PhpStorm.
 * User: Egie Ramdan
 * Date: 8/15/2019
 * Time: 3:47 PM
 */

namespace App\Http\Controllers\Registrasi;
use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use DB;
use App\Traits\Valet;
use Webpatser\Uuid\Uuid;
use App\Master\CaraBayar;
use App\Master\JenisLaporan;
use App\Master\KelompokLaporan;
use App\Master\MapProdukToLaporanRl;
use App\Master\Ruangan;
use App\Master\Pegawai;

class LaporanRekamMedisController extends   ApiController
{
    use Valet;

    public function __construct()
    {
        parent::__construct($skip_authentication = false);

    }
    public function getMapLaporanRL(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $data = \DB::table('mapproduktolaporanrl_m as mptlr')
            ->join('produk_m as pro','pro.id','=','mptlr.produkfk')
            ->join('jenislaporan_m as jl','jl.id','=','mptlr.objectjenislaporanfk')
            ->join('kelompoklaporan_m as kl','kl.id','=','mptlr.objectkontenlaporanfk')
            ->select('mptlr.norec','pro.id as idproduk','pro.namaproduk','jl.id','jl.jenislaporan',
                'kl.id as idkelompoklaporan','kl.kelompoklaporan')
            ->where('mptlr.kdprofile', $idProfile)
            ->where('mptlr.statusenabled',true)
            ->orderBy('jl.id','asc');

        if(isset($request['idKonten']) && $request['idKonten'] != "" && $request['idKonten'] != "undefined") {
            $data = $data->where('kl.id','=', $request['idKonten']);
        }
//         if(isset($request['idMap']) && $request['idMap'] != "" && $request['idMap'] != "undefined") {
//            $data = $data->where('mptlr.norec','=', $request['idMap']);
//         }

        $data = $data->get();
        return $this->respond($data);
    }
    public function getComboMappingRL(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin = $request->all();
        $kdJeniPegawaiDokter = (int) $this->settingDataFixed('KdJenisPegawaiDokter',$idProfile);
        $kdDeptRanapAll = explode(',',$this->settingDataFixed('KdDepartemenRIAll',$idProfile));
        $kdDepartemenRanapAll = [];
        foreach ($kdDeptRanapAll as $items){
            $kdDepartemenRanapAll []=  (int)$items;
        }
        $dataPenulis = Pegawai::where('statusenabled',true)
            ->where('objectjenispegawaifk',$kdJeniPegawaiDokter)
            ->where('kdprofile', $idProfile)
            ->get();

        foreach ($dataPenulis as $item){
            $dataPenulis2[]=array(
                'id' => $item->id,
                'namalengkap' => $item->namalengkap,
            );
        }

        $dataRuangan = \DB::table('maploginusertoruangan_s as mlu')
            ->JOIN('ruangan_m as ru','ru.id','=','mlu.objectruanganfk')
            ->select('ru.id','ru.namaruangan')
            ->where('mlu.kdprofile', $idProfile)
            ->where('mlu.objectloginuserfk',$dataLogin['userData']['id'])
            ->get();

        $dataRuanganall = \DB::table('ruangan_m as ru')
            ->select('ru.id','ru.namaruangan')
            ->where('ru.kdprofile', $idProfile)
            ->where('ru.statusenabled',true)
            ->orderBy('ru.namaruangan')
            ->get();

        $dataRuanganPelayanan = \DB::table('ruangan_m as ru')
            ->select('ru.id','ru.namaruangan')
            ->where('ru.kdprofile', $idProfile)
            ->where('ru.objectdepartemenfk',16)
            ->where('ru.statusenabled',true)
            ->orderBy('ru.namaruangan')
            ->get();
        
        $dataRuanganRajal = \DB::table('ruangan_m as ru')
            ->select('ru.id','ru.namaruangan')
            ->where('ru.kdprofile', $idProfile)
            ->whereIn('ru.objectdepartemenfk',[18,24])
            ->where('ru.statusenabled',true)
            ->orderBy('ru.namaruangan')
            ->get();


        $dataCaraBayar = \DB::table('carabayar_m as cb')
            ->select('cb.id','cb.carabayar')
            ->where('cb.kdprofile', $idProfile)
            ->where('cb.statusenabled',true)
            ->get();

        $dataJenisLaporan = \DB::table('jenislaporan_m as jl')
            ->select('jl.id','jl.jenislaporan')
            ->where('jl.kdprofile', $idProfile)
            ->where('jl.statusenabled',true)
            ->get();

        $dataKelompokLaporan = \DB::table('kelompoklaporan_m as kl')
            ->select('kl.id','kl.kelompoklaporan')
            ->where('kl.kdprofile', $idProfile)
            ->where('kl.statusenabled',true)
            ->get();

        $dataPegawaiUser = DB::select(DB::raw("select pg.id,pg.namalengkap from loginuser_s as lu
                INNER JOIN pegawai_m as pg on lu.objectpegawaifk=pg.id
                where lu.kdprofile = $idProfile and lu.id=:idLoginUser"),
            array(
                'idLoginUser' => $dataLogin['userData']['id'],
            )
        );

        $result = array(
           'ruanganranap' =>   $dataRuanganPelayanan,
//            'ruangan' => $dataRuangan,
            'ruanganrajal' => $dataRuanganRajal,
            'ruanganall' => $dataRuanganall,
//            'produk' => $dataProduk,
//            'caraBayar' => $dataCaraBayar,
            'jenisLaporan' => $dataJenisLaporan,
            'kelompokLaporan' => $dataKelompokLaporan,
            'detaillogin' => $dataPegawaiUser,
            'message' => 'as@cepot',
        );

        return $this->respond($result);
    }
    public function deleteMapProdukToLaporanRL(Request $request) {
        $dataLogin = $request->all();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        DB::beginTransaction();
        if ($request['mapping']['norec'] != ''){
            try{
                $data1 = MapProdukToLaporanRl::where('norec', $request['mapping']['norec'])->where('kdprofile', $idProfile)->delete();
                $transStatus = 'true';
            }
            catch(\Exception $e){
                $transStatus= false;
            }
        }
        if ($transStatus='true')
        {    DB::commit();
            $transMessage = "Data Terhapus";
        }
        else{
            DB::rollBack();
            $transMessage = "Data Gagal Dihapus";
        }
        return $this->setStatusCode(201)->respond([], $transMessage);
    }
    public function getProdukMapLaporanRL(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $kdPelayanan = explode(',',$this->settingDataFixed('KdlistPelayanan',$idProfile));
        $kdListPelayanan = [];
        foreach ($kdPelayanan as $items){
            $kdListPelayanan []=  (int)$items;
        }
        $dataProduk = \DB::table('produk_m as pro')
            ->leftJoin('detailjenisproduk_m as djp','djp.id','=','pro.objectdetailjenisprodukfk')
            ->leftJoin('jenisproduk_m as jp','jp.id','=','djp.objectjenisprodukfk')
            ->leftJoin('kelompokproduk_m as kp','kp.id','=','jp.objectkelompokprodukfk')
            ->select('pro.id as idproduk','pro.namaproduk','djp.id as iddetail','djp.detailjenisproduk',
                'jp.id as idjenis','jp.jenisproduk','jp.objectkelompokprodukfk','kp.kelompokproduk')
            ->where('pro.kdprofile', $idProfile)
            ->whereIn('jp.objectkelompokprodukfk',$kdListPelayanan)
            ->where('pro.statusenabled',true)
            ->orderBy('pro.namaproduk');
        if(isset($request['filter']['filters'][0]['value']) &&
            $request['filter']['filters'][0]['value']!="" &&
            $request['filter']['filters'][0]['value']!="undefined"){
            $dataProduk = $dataProduk->where('pro.namaproduk','ilike','%'. $request['filter']['filters'][0]['value'].'%' );
        };

        $dataProduk=$dataProduk->take(10);
        $dataProduk=$dataProduk->get();
//        $result = array(
//            'data'=>$dataProduk,
//            'message' => 'as@cepot',
//        );

        return $this->respond($dataProduk);
    }

    public function SaveMappingRl(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $req = $request;
        try {
//        return $this->respond($req);
        if ($request['norec'] == '') {
            $newMap = new MapProdukToLaporanRl();
            $norecMap = $newMap->generateNewId();
            $newMap->norec = $norecMap;
            $newMap->kdprofile = $idProfile;
            $newMap->statusenabled = true;
        }else{
            $newMap = MapProdukToLaporanRl::where('norec',$request['norec'])->first();
        }
        $newMap->objectjenislaporanfk = $request['objectjenislaporanfk'];
        $newMap->objectkontenlaporanfk = $request['objectkelompokkontenfk'];
        $newMap->produkfk = $request['produkfk'];

          $newMap->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        if ($transStatus == 'true') {
            $transMessage = "Simpan Mapping Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "map" => $newMap,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Simpan Mapping Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "map" => $newMap,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDataRL31RawatInap(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];   

        $data10=[];

        $tanggalmin = DB::select(DB::raw("
            select min(d::date) as tglmin
            from generate_series('$tglAwal', '$tglAwal'::date + INTERVAL '1 MONTH - 1 day', '1 day'::interval) d
        "));

        $tanggalmax = DB::select(DB::raw("
            select min(d::date) as tglmax
            from generate_series('$tglAkhir', '$tglAkhir'::date + INTERVAL '1 MONTH - 1 day', '1 day'::interval) d
        "));
        
        $monthtahunmonth = (int) date('m', strtotime($tglAwal));
        $yeartahunmonth = (int) date('Y', strtotime($tglAwal));
        

        $tahunmonthq = DB::select(DB::raw("select to_char(daterange::date, 'YYYY-mm') as tahun
        from generate_series('$yeartahunmonth-$monthtahunmonth-01'::date, '$tglAkhir'::date, '1 month') as daterange"));
        
        $arrmin = [];
        foreach($tanggalmin as $rowmin)
        {
            $arrmin[] =  $rowmin->tglmin;
        }
        $arrmax = [];
        foreach($tanggalmax as $rowmax)
        {
            $arrmax[] =  $rowmax->tglmax;
        }
        
        
        $tanggalminawal = DB::select(DB::raw("select '$arrmin[0] 23:59:59'::timestamp - interval '1 day ' as tgl"));

        $arrminawal = [];
        foreach($tanggalminawal as $rowminawal)
        {
            $arrminawal[] =  $rowminawal->tgl;
        }

        $tanggalmaxawal = DB::select(DB::raw("select '$arrmax[0] 23:59:59'::timestamp - interval '1 day ' as tgl"));

        $arrmaxawal = [];
        foreach($tanggalmaxawal as $rowmaxawal)
        {
            $arrmaxawal[] =  $rowmaxawal->tgl;
        }



            $dataKemarin = DB::select(DB::raw("select extract(year from (tgl::date + interval '1 day')::date) as tgl, sum(jumlah) as jumlah from(
                (select tgl as tgl,jumlah from (select tgl, case when jumlah is null then 0 else sum(jumlah) end as jumlah from(
                    with cte as(
                    select d as tgl
                    from generate_series('$arrminawal[0]', '$arrmaxawal[0]'::timestamp + INTERVAL '0 day', '1 day'::interval) d
                    )
                    select * FROM
                    cte
                    left join(
                    select noregistrasi, norec, tgl as tglapd, jumlah, tglpulang, tglkeluar, ruanganasal, ruangantujuan from (select pd.noregistrasi, apd.norec, apd.tglmasuk as tgl, pd.tglpulang, apd.tglkeluar, count(apd.tglmasuk) as jumlah, ru1.namaruangan ruanganasal, ru.namaruangan ruangantujuan
                    FROM pasiendaftar_t as pd
                    INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                    INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk = 16
                    inner JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk <> 16
                    where pd.kdprofile = $idProfile
                    and pd.statusenabled = true
                    group by apd.tglmasuk, apd.tglkeluar, pd.tglpulang, pd.noregistrasi, apd.norec, ru.namaruangan, ru1.namaruangan
                    ) as x
                                    
                    UNION ALL
                                    
                    select noregistrasi, norec, tgl as tglapd, jumlah, tglpulang, tglkeluar, ruanganasal, ruangantujuan from (select pd.noregistrasi, apd.norec, apd.tglmasuk as tgl, pd.tglpulang, apd.tglkeluar, count(apd.tglmasuk) as jumlah, ru1.namaruangan ruanganasal, ru.namaruangan ruangantujuan
                    FROM pasiendaftar_t as pd
                    INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                    INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk = 16
                    inner JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk = 16
                    where pd.kdprofile = $idProfile
                    and pd.statusenabled = true
                    group by apd.tglmasuk, apd.tglkeluar, pd.tglpulang, pd.noregistrasi, apd.norec, ru.namaruangan, ru1.namaruangan
                    ) as x
                    ) as y on cte.tgl between y.tglapd and coalesce(y.tglkeluar,now())
                ) as e
                group by e.tgl, e.jumlah
                order by e.tgl) as i)
            ) as f group by extract(year from (tgl::date + interval '1 day')::date)"));
            
            //var_dump($dataKemarin);            

            $data = DB::select(DB::raw("
            select tgl, sum(jumlah) as jumlah from(
                select tgl, jumlah from (select extract(year from apd.tglmasuk) as tgl, count(apd.tglmasuk) as jumlah
                    FROM pasiendaftar_t as pd
                    INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                    INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk = 16
                    inner JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk <> 16
                    where pd.kdprofile = $idProfile 
                    and pd.statusenabled = true
                    and cast(apd.tglmasuk as date) between '$tglAwal' and '$tglAkhir'
                    group by extract(year from apd.tglmasuk)
                ) as x
            ) as f group by tgl"));
            
            $dataPindah = DB::select(DB::raw("
            select tgl, sum(jumlah) as jumlah from(
                select tgl, jumlah from (select extract(year from apd.tglmasuk) as tgl, count(apd.tglmasuk) as jumlah
                    FROM pasiendaftar_t as pd
                    INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                    INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk = 16
                    INNER JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk = 16
                    where pd.kdprofile = $idProfile 
                    and pd.statusenabled = true
                    and cast(apd.tglmasuk as date) between '$tglAwal' and '$tglAkhir' 
                    group by extract(year from apd.tglmasuk)
                ) as x
            ) as z group by tgl"));
            
            $dataDipindahkan = DB::select(DB::raw("
            select tgl, sum(jumlah) as jumlah from(select tgl, jumlah from (
                select extract(year from apd.tglkeluar) as tgl, count(apd.tglkeluar) as jumlah
                    FROM pasiendaftar_t as pd
                    INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                    INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk = 16
                    INNER JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk = 16
                    where pd.kdprofile = $idProfile 
                    and pd.statusenabled = true
                    and cast(apd.tglkeluar as date) between '$tglAwal' and '$tglAkhir' 
                    and apd.tglkeluar <> coalesce(pd.tglpulang,now())
                    and apd.tglkeluar > apd.tglmasuk
                    group by extract(year from apd.tglkeluar)
                ) as x
                
                union all
                
                select tgl, jumlah from (
                    select extract(year from apd.tglkeluar) as tgl, count(apd.tglkeluar) as jumlah
                    FROM pasiendaftar_t as pd
                    INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                    INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk = 16
                    INNER JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk <> 16
                    where pd.kdprofile = $idProfile 
                    and pd.statusenabled = true
                    and cast(apd.tglkeluar as date) between '$tglAwal' and '$tglAkhir' 
                    and apd.tglkeluar <> coalesce(pd.tglpulang,now())
                    and apd.tglkeluar > apd.tglmasuk
                    group by extract(year from apd.tglkeluar)
                ) as x
            ) as y group by tgl"));
            
            $dataMinggal = DB::select(DB::raw("
            select extract(year from pd.tglmeninggal) as tgl, count(pm.namapasien) jumlah
                FROM pasiendaftar_t as pd
                INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
                inner join kondisipasien_m kps on kps.id = pd.objectkondisipasienfk
                inner join ruangan_m ru on ru.id = pd.objectruanganlastfk
                where pd.kdprofile = $idProfile and pd.statusenabled = true
                and cast(pd.tglmeninggal as date) between '$tglAwal' and '$tglAkhir'
                and ru.objectdepartemenfk = 16
            group by extract(year from pd.tglmeninggal)"));
            
            $dataPulang = DB::select(DB::raw("
            select max(apd.tglkeluar), extract(year from pd.tglpulang) as tgl, count(pd.tglpulang) as jumlah
                FROM pasiendaftar_t as pd
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                inner JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
                where pd.kdprofile = $idProfile and pd.statusenabled = true
                and cast(pd.tglpulang as date) between '$tglAwal' and '$tglAkhir'
                and pd.tglpulang = apd.tglkeluar
                and ru.objectdepartemenfk = 16
                and (pd.objectstatuspulangfk not in (2,3) or pd.objectstatuspulangfk is null)
                and apd.tglmasuk <> apd.tglkeluar
            group by extract(year from pd.tglpulang)"));

            $dataPulangAPS = DB::select(DB::raw("
            select extract(year from pd.tglpulang) as tgl, count(pm.namapasien) jumlah
                FROM pasiendaftar_t as pd
                INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
                INNER JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
                where pd.kdprofile = $idProfile and pd.statusenabled = true
                and cast(pd.tglpulang as date) between '$tglAwal' and '$tglAkhir'
                and pd.objectstatuspulangfk = 2
                and ru.objectdepartemenfk = 16
                and pd.tglpulang is not null
            group by extract(year from pd.tglpulang)"));
                
            $dataPulangMelarikanDiri = DB::select(DB::raw("
            select extract(year from pd.tglpulang) as tgl, count(pm.namapasien) jumlah
                FROM pasiendaftar_t as pd
                INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
                INNER JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
                where pd.kdprofile = $idProfile and pd.statusenabled = true
                and cast(pd.tglpulang as date) between '$tglAwal' and '$tglAkhir'
                and pd.objectstatuspulangfk = 3
                and ru.objectdepartemenfk = 16
                and pd.tglpulang is not null
            group by extract(year from pd.tglpulang)"));
            
            $dataMeninggalLebihDari = DB::select(DB::raw("
            select extract(year from pd.tglmeninggal) as tgl, count(pm.namapasien) jumlah
                FROM pasiendaftar_t as pd
                INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
                inner join kondisipasien_m kps on kps.id = pd.objectkondisipasienfk
                inner join ruangan_m ru on ru.id = pd.objectruanganlastfk
                where pd.kdprofile = $idProfile and pd.statusenabled = true
                and cast(pd.tglmeninggal as date) between '$tglAwal' and '$tglAkhir'
                and pd.objectkondisipasienfk = 6
                and ru.objectdepartemenfk = 16
            group by extract(year from pd.tglmeninggal)"));
            
            $lamadirawat = DB::select(DB::raw("
            select extract(year from y.tgl) as tgl, sum(y.totallama) as jumlah from(
                select x.tgl, sum(x.lamadirawat) as totallama from(
                with cte as (
                    select pdt.norec, min(apdt.tglmasuk::date) tglmasuk from pasiendaftar_t as pdt
                    inner join antrianpasiendiperiksa_t as apdt on apdt.noregistrasifk = pdt.norec
                    inner join ruangan_m as rum on rum.id = apdt.objectruanganfk
                    where rum.objectdepartemenfk = 16
                    and pdt.statusenabled = TRUE
                    and pdt.kdprofile = 30
                    and pdt.tglpulang::date between '$tglAwal' and '$tglAkhir'
                    group by pdt.norec, apdt.objectruanganfk
                )
                
                select pd.tglpulang::date as tgl, cte.tglmasuk as tanggalmasuk,
                case when pd.tglpulang::date-cte.tglmasuk::date = 0 then 1 else  (pd.tglpulang::date-cte.tglmasuk) + 1 end as lamadirawat
                    FROM pasiendaftar_t as pd
                    INNER JOIN cte on cte.norec = pd.norec
                    WHERE pd.kdprofile = 30 and pd.tglpulang is not null and cast(pd.tglpulang as date) between '$arrmin[0]' and '$arrmax[0]'
                    group by pd.tglpulang::date, cte.tglmasuk
                    order by pd.tglpulang::date
                ) as x group by x.tgl
            ) as y group by extract(year from y.tgl);"));


            $ratarata = DB::select(DB::raw("with cte as(
                select extract(year from month) as year, sum(days) as jumlah from(
                    SELECT date_trunc('month',dt) AS month,
                    COUNT(*) as days
                    FROM generate_series( DATE '$tglAwal',DATE '$tglAkhir',interval '1 DAY' )
                    as dt group by date_trunc('month',dt) 
                    order by month
                ) as x group by extract(year from month)
            )
            SELECT extract(year from pd.tglpulang) as tgl, count(pd.noregistrasi), cte.jumlah, count(pd.noregistrasi)/cte.jumlah as total
                FROM
                pasiendaftar_t pd
                inner join ruangan_m ru on ru.id = pd.objectruanganlastfk
                inner join cte on cte.year = extract(year from pd.tglpulang)
                WHERE pd.tglpulang BETWEEN '$tglAwal' and '$tglAkhir'
                and pd.kdprofile = 30
                and pd.statusenabled=true
                and ru.objectdepartemenfk = 16
            group by extract(year from pd.tglpulang), cte.jumlah"));

            $jumlahdays = DB::select(DB::raw("SELECT '$tglAkhir'::date - '$tglAwal'::date + 1 as jumlahhari"));
            //var_dump($jumlahdays[0]->jumlahhari);
            $jumlah = $jumlahdays[0]->jumlahhari;

            $jumlahttkalihari = 0;
            $jumlahgrandtotaltt = 0;
            $hari = 0;
            $hariawal = (int) date('d', strtotime($tglAwal));
            $i = 0;
            $j = 0;
            $tracetahun = 1999;
            $datas = [];
            $datatt = [];
            $jumlahfix = 0;

            foreach($tahunmonthq as $q){
                //var_dump($jumlah);
                if($jumlah >= 28){
                    if($hariawal > 1){
                        $hari = (cal_days_in_month(CAL_GREGORIAN, date('m', strtotime($q->tahun)), date('Y', strtotime($q->tahun))) - $hariawal +1);
                        $jumlah -=  $hari;
                        $hariawal = 1;
                        //var_dump($jumlah);
                    } else{
                        $hari = cal_days_in_month(CAL_GREGORIAN, date('m', strtotime($q->tahun)), date('Y', strtotime($q->tahun)));
                        $jumlah -= $hari;
                        $hari = cal_days_in_month(CAL_GREGORIAN, date('m', strtotime($q->tahun)), date('Y', strtotime($q->tahun)));
                        //var_dump($jumlah);
                    }
                } else{
                    $hari = $jumlah;
                    //var_dump($jumlah);
                }
                //var_dump($hariawal);
                //var_dump($q);
                //var_dump($hari);

                $jumlahtt = DB::select(DB::raw("select '$q->tahun-$hari' as tanggal, sum(rm.jumlah_tt) as totalperperiode 
                    from riwayatkamar_m rm
                    inner join ruangan_m ru on ru.id = rm.objectruanganfk
                    inner join(
                        select objectruanganfk,objectkamarfk,max(tanggalawal) as tanggal from riwayatkamar_m 
                        where 
                        '$q->tahun-$hari 23:59:59' BETWEEN tanggalawal and COALESCE(tanggalakhir,'$q->tahun-$hari 23:59:59')
                        group by objectruanganfk,objectkamarfk
                    ) as x	
                    on rm.objectruanganfk=x.objectruanganfk and rm.objectkamarfk=x.objectkamarfk and rm.tanggalawal = x.tanggal
                    where rm.kdprofile = $idProfile and rm.statusenabled = true"));

                    //var_dump($jumlahtt);
                if(date('Y', strtotime($q->tahun)) != $tracetahun){
                    $datas[$i]['tahun'] = date('Y', strtotime($q->tahun));
                    $tracetahun = date('Y', strtotime($q->tahun));
                    $i++;
                }

                if($tracetahun == date('Y', strtotime($q->tahun))){
                    $datatt[$j]['jumlahttkalihari'] = $hari*$jumlahtt[0]->totalperperiode;
                    $datatt[$j]['jumlahgrandtotaltt'] = $jumlahtt[0]->totalperperiode;
                    $datatt[$j]['tahun'] = date('Y', strtotime($q->tahun));
                    $j++;
                }

                $jumlahfix += $hari*$jumlahtt[0]->totalperperiode;

                //var_dump($jumlahfix);

                //var_dump($q->tahun);
                //var_dump($hari);
            }

            // var_dump($datatt);
            // var_dump($datas);
            // var_dump($data);
            
            $bor = 0;
            $alos = 0;
            $toi = 0;
            $bto = 0;
            $ndr = 0;
            $gdr = 0;
            $jumlahpasienpindah = 0;
            $jumlahpasienawal = 0;
            $jumlahpasienmasuk = 0;
            $jumlahpasiendipindahkan = 0;
            $jumlahpasienmeninggal = 0;
            $jumlahpasienpulang = 0;
            $jumlahpasienmeninggallebihdari = 0;
            $jumlahpindah = 0;
            $jumlahmasuk = 0;
            $jumlahhariperawatan = 0;
            $jumlahpulang = 0;
            $jumlahpasienpulangaps = 0;
            $jumlahpasienpulangmelarikandiri = 0;
            $jumlahtttotal = 0;
            $jumlahbortt = 0;
            $jumlahborhariperawatan = 0;
            $jumlahharidirawat = 0;
            $tt = 0;
            $ttperperiode = 0;
            $hasilrata = 0;

            foreach($datas as $thn){

                $tt = 0;
                $ttperperiode = 0;
                // $tt = $data10[$i]['jumlahgrandtotaltt'];
                // $ttperperiode = $data10[$i]['jumlahttkalihari'];

                foreach($datatt as $dtt){
                    
                    if($thn['tahun'] == $dtt['tahun']){
                        $tt += $dtt['jumlahgrandtotaltt'];
                        $ttperperiode += $dtt['jumlahttkalihari'];
                        // var_dump( $dtt['tahun']);
                        // var_dump( $ttperperiode);
                    }
                }

                foreach($dataKemarin as $awal){
                    if($thn['tahun'] == $awal->tgl){
                        $jumlahpasienawal = $awal->jumlah;
                    }
                }

                foreach($data as $masuk){
                    if($thn['tahun'] == $masuk->tgl){
                        $jumlahpasienmasuk = $masuk->jumlah;
                    }
                }

                foreach($dataPindah as $pindah){
                    if($thn['tahun'] == $pindah->tgl){
                        $jumlahpasienpindah = $pindah->jumlah;
                    }
                }

                foreach($dataDipindahkan as $dipindah){
                    if($thn['tahun'] == $dipindah->tgl){
                        $jumlahpasiendipindahkan = $dipindah->jumlah;
                    }
                }

                foreach($dataMinggal as $meninggal){
                    if($thn['tahun'] == $meninggal->tgl){
                        $jumlahpasienmeninggal = $meninggal->jumlah;
                    }
                }

                foreach($dataPulang as $pulang){
                    if($thn['tahun'] == $pulang->tgl){
                        $jumlahpasienpulang = $pulang->jumlah;
                    }
                }

                foreach($dataPulangAPS as $pulangaps){
                    if($thn['tahun'] == $pulangaps->tgl){
                        $jumlahpasienpulangaps = $pulangaps->jumlah;
                    }
                }

                foreach($dataPulangMelarikanDiri as $pulanglari){
                    if($thn['tahun'] == $pulanglari->tgl){
                        $jumlahpasienpulangmelarikandiri = $pulanglari->jumlah;
                    }
                }

                foreach($dataMeninggalLebihDari as $meninggallebih){
                    if($thn['tahun'] == $meninggallebih->tgl){
                        $jumlahpasienmeninggallebihdari = $meninggallebih->jumlah;
                    }
                }

                foreach($lamadirawat as $lama){
                    if($thn['tahun'] == $lama->tgl){
                        $jumlahharidirawat = $lama->jumlah;
                    }
                }

                foreach($ratarata as $rata){
                    if($thn['tahun'] == $rata->tgl){
                        $hasilrata = $rata->total;
                    }
                }


                $jumlahhariperawatantt = $jumlahpasienawal + $jumlahpasienmasuk + $jumlahpasienpindah;
                $jumlahpulang = $jumlahpasiendipindahkan + $jumlahpasienpulang + $jumlahpasienpulangaps + $jumlahpasienpulangmelarikandiri;
    
                // var_dump($jumlahharidirawat);
                // var_dump($jumlahpulang);
                // var_dump($tt);
                // var_dump($ttperperiode);
                
                
                
                    if($jumlahpulang == 0){
                        $bor = $jumlahhariperawatantt/$ttperperiode*100;
                        $alos = 0;
                        $toi = 0;
                        $bto = $jumlahpulang/$tt;
                        $ndr = 0;
                        $gdr = 0;
                    } else{
                        $bor = $jumlahhariperawatantt/$ttperperiode*100;
                        $alos = $jumlahharidirawat/$jumlahpulang;
                        $toi = ($ttperperiode - $jumlahhariperawatantt)/$jumlahpulang;
                        $bto = $jumlahpulang/$tt;
                        $ndr = $jumlahpasienmeninggallebihdari/$jumlahpulang*1000;
                        $gdr = $jumlahpasienmeninggal/$jumlahpulang*1000;
                    }
                
                
    
                $data10[] = array(
                    'bor' =>(float) number_format($bor,2),
                    'alos' =>(float) number_format($alos,2),
                    'bto' =>(float) number_format($bto,2),
                    'toi' => (float)number_format($toi,2),
                    'gdr' => (float)number_format($gdr,2),
                    'ndr' => (float) number_format($ndr,2),
                    'tahun' => $thn['tahun'],
                    'hasil' => (float) number_format($hasilrata,2),
                );
            }

        $result = array(
            'data' => $data10,
            'message' => 'as@cepot',
        );
        return $this->respond($result);
    }
    public function getDataRL13TempatTidur(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tglAwal = $request['tglAwal'];  

        $main = array("Penyakit Dalam", "Kesehatan Anak", "Obstetri", "Ginekologi", "Bedah", "Bedah Ortopedhi", "Bedah Saraf", "Luka Bakar", "Saraf", "Jiwa", "Psikologi", "Penatalaksanaan Penyalahgunaan NAPZA", "THT", "Mata", "Kulit dan Kelamin", "Kardiologi", "Paru-paru", "Geriatri", "Radioterapi", "Kedokteran Nuklir", "Kusta", "Rehabilitasi Medik", "Isolasi", "ICU", "ICCU", "NICU / PICU", "Umum", "Gigi & Mulut", "Pelayanan Rawat Darurat", "Perinatologi/Bayi");
        
        $jumlahperkelas = DB::select(DB::raw("select extract(year from x.tanggal::date) as year, sum(x.kelasvip) jumlahkelasvip, sum(x.kelassatu) jumlahkelassatu, sum(x.kelasdua) jumlahkelasdua, sum(x.kelastiga) jumlahkelastiga, sum(x.kelaskhusus) jumlahkelaskhusus, sum(x.kelasvip) + sum(x.kelassatu) + sum(x.kelasdua) + sum(x.kelastiga) + sum(x.kelaskhusus) totaltt from(
            select '$tglAwal-01' as tanggal,
            case when ks.id = 4 then sum(rm.jumlah_tt) else 0 end as kelasvip,
            case when ks.id = 3 then sum(rm.jumlah_tt) else 0 end as kelassatu,
            case when ks.id = 2 then sum(rm.jumlah_tt) else 0 end as kelasdua,
            case when ks.id = 1 then sum(rm.jumlah_tt) else 0 end as kelastiga,
            case when ks.id = 6 then sum(rm.jumlah_tt) else 0 end as kelaskhusus
                from riwayatkamar_m rm
            inner join ruangan_m ru on ru.id = rm.objectruanganfk
            inner join kamar_m km on km.id = rm.objectkamarfk
            inner join kelas_m ks on ks.id = rm.objectkelasfk
            inner join(
                select objectruanganfk,objectkamarfk,max(tanggalawal) as tanggal 
                from riwayatkamar_m 
                where 
                '$tglAwal-01 23:59:59' BETWEEN tanggalawal and COALESCE(tanggalakhir,'$tglAwal-01 23:59:59')
                group by objectruanganfk,objectkamarfk
            ) as x	
            on rm.objectruanganfk=x.objectruanganfk 
            and rm.objectkamarfk=x.objectkamarfk 
            and rm.tanggalawal = x.tanggal
            and ks.id in (1, 2, 3, 4, 6)
            where rm.kdprofile = $idProfile 
            and rm.statusenabled = true
            group by ks.id) as x group by extract(year from x.tanggal::date)"));

        $currentmain = "Larasatizka";

        $jumlahtt = 0;
        $kelasvvip = 0;
        $kelasvip = 0;
        $kelassatu = 0; 
        $kelasdua = 0; 
        $kelastiga = 0; 
        $kelaskhusus = 0; 

        foreach($main as $row){
            $jumlahtt = 0;
            $kelasvvip = 0;
            $kelasvip = 0;
            $kelassatu = 0; 
            $kelasdua = 0; 
            $kelastiga = 0; 
            $kelaskhusus = 0;
            if($row != $currentmain){
                foreach($jumlahperkelas as $jml){
                    $year = $jml->year;
                    if($row == "Jiwa" || $row == "Umum" || $row == "Penatalaksanaan Penyalahgunaan NAPZA"){
                        $jumlahtt = $jml->totaltt;
                        $kelasvip = $jml->jumlahkelasvip;
                        $kelassatu = $jml->jumlahkelassatu; 
                        $kelasdua = $jml->jumlahkelasdua; 
                        $kelastiga = $jml->jumlahkelastiga; 
                        $kelaskhusus = $jml->jumlahkelaskhusus;
                    }
                }

                $data10[] = array(
                    'pelayanan' => $row,
                    'year' => $year,
                    'jumlahkelasvvip' => $kelasvvip,
                    'jumlahkelasvip' => $kelasvip,
                    'jumlahkelassatu' => $kelassatu,
                    'jumlahkelasdua' => $kelasdua,
                    'jumlahkelastiga' => $kelastiga,
                    'jumlahkelaskhusus' => $kelaskhusus,
                    'totaltt' => $jumlahtt,
                );


            }
            $currentmain = $row;
        }

        $result = array(
            'data' => $data10,
            'message' => 'as@cepot',
        );
        return $this->respond($result);
    }
    public function getDataRL31YangRawatInap(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tglAwal = $request['tglAwal'];   

        $main = array("Penyakit Dalam", "Kesehatan Anak", "Obstetri", "Ginekologi", "Bedah", "Bedah Ortopedhi", "Bedah Saraf", "Luka Bakar", "Saraf", "Jiwa", "Psikologi", "Penatalaksanaan Penyalahgunaan NAPZA", "THT", "Mata", "Kulit dan Kelamin", "Kardiologi", "Paru-paru", "Geriatri", "Radioterapi", "Kedokteran Nuklir", "Kusta", "Rehabilitasi Medik", "Isolasi", "ICU", "ICCU", "NICU / PICU", "Umum", "Gigi & Mulut", "Pelayanan Rawat Darurat", "SUB TOTAL", "Perinatologi", "TOTAL");


        
        $pasienawalperhari = DB::select(DB::raw("select tgl, sum(jumlah) as total, ruanganasal from (
            select tgl, jumlah, ruanganasal from (select apd.tglmasuk::date as tgl, count(apd.tglmasuk) as jumlah, ru1.namaruangan as ruanganasal
            FROM pasiendaftar_t as pd
            INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
            INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk IN (16)
            LEFT JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk NOT IN (16)
            where pd.kdprofile = $idProfile 
            and pd.statusenabled = true
            and cast(apd.tglmasuk as date) between '$tglAwal-01-01'::date - interval '1 day' and '$tglAwal-12-31'::date - interval '1 day'
            and apd.tglmasuk::date != pd.tglpulang::date 
            group by apd.tglmasuk::date, ru1.namaruangan
            ) as x

            UNION ALL

            select tgl, jumlah, ruanganasal from (select apd.tglmasuk::date as tgl, count(apd.tglmasuk) as jumlah, ru1.namaruangan as ruanganasal
            FROM pasiendaftar_t as pd
            INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
            INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk IN (16)
            inner JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk IN (16)
            where pd.kdprofile = $idProfile 
            and pd.statusenabled = true
            and cast(apd.tglmasuk as date) between '$tglAwal-01-01'::date - interval '1 day' and '$tglAwal-12-31'::date - interval '1 day'
            and apd.tglmasuk::date != pd.tglpulang::date 
            group by apd.tglmasuk::date, ru1.namaruangan
            ) as x
            ) as y 
            group by tgl, ruanganasal"));

            

        $pasienmasuk = DB::select(DB::raw("select tgl, jumlah total, ruanganasal from (select apd.tglmasuk::date as tgl, count(apd.tglmasuk) as jumlah, ru1.namaruangan ruanganasal
        FROM pasiendaftar_t as pd
        INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
        INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk IN (16)
        LEFT JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and (ru1.objectdepartemenfk NOT IN (16) or apd.objectruanganasalfk is null)
        where pd.kdprofile = $idProfile 
        and pd.statusenabled = true
        and cast(apd.tglmasuk as date) between '$tglAwal-01-01' and '$tglAwal-12-31' 
        group by apd.tglmasuk::date, ru1.namaruangan
        ) as x"));

        
        $pasienawal = DB::select(DB::raw("select tgl, sum(jumlah) as total, ruanganasal from (
            select tgl, jumlah, ruanganasal from (select apd.tglmasuk::date as tgl, count(apd.tglmasuk) as jumlah, ru1.namaruangan as ruanganasal
            FROM pasiendaftar_t as pd
            INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
            INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk IN (16)
            LEFT JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk NOT IN (16)
            where pd.kdprofile = $idProfile 
            and pd.statusenabled = true
            and cast(apd.tglmasuk as date) = '$tglAwal-01-01'::date - INTERVAL '1 DAY' and pd.tglpulang::date >= '$tglAwal-01-01'::date 
            group by apd.tglmasuk::date, ru1.namaruangan
            ) as x

            UNION ALL

            select tgl, jumlah, ruanganasal from (select apd.tglmasuk::date as tgl, count(apd.tglmasuk) as jumlah, ru1.namaruangan as ruanganasal
            FROM pasiendaftar_t as pd
            INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
            INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk IN (16)
            inner JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk IN (16)
            where pd.kdprofile = $idProfile 
            and pd.statusenabled = true
            and cast(apd.tglmasuk as date) = '$tglAwal-01-01'::date - INTERVAL '1 DAY' and pd.tglpulang::date >= '$tglAwal-01-01'::date
            group by apd.tglmasuk::date, ru1.namaruangan
            ) as x
            ) as y 
            group by tgl, ruanganasal"));


            
        $pasienakhir = DB::select(DB::raw("select tgl, sum(jumlah) as total, ruanganasal from (
            select tgl, jumlah, ruanganasal from (select apd.tglmasuk::date as tgl, count(apd.tglmasuk) as jumlah, ru1.namaruangan as ruanganasal
            FROM pasiendaftar_t as pd
            INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
            INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk IN (16)
            LEFT JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk NOT IN (16)
            where pd.kdprofile = $idProfile 
            and pd.statusenabled = true
            and cast(apd.tglmasuk as date) = '$tglAwal-12-31'::date
            group by apd.tglmasuk::date, ru1.namaruangan
            ) as x

            UNION ALL

            select tgl, jumlah, ruanganasal from (select apd.tglmasuk::date as tgl, count(apd.tglmasuk) as jumlah, ru1.namaruangan as ruanganasal
            FROM pasiendaftar_t as pd
            INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
            INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk IN (16)
            inner JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk IN (16)
            where pd.kdprofile = $idProfile 
            and pd.statusenabled = true
            and cast(apd.tglmasuk as date) = '$tglAwal-12-31'::date
            group by apd.tglmasuk::date, ru1.namaruangan
            ) as x
            ) as y 
            group by tgl, ruanganasal"));
            
            
        $lamahari = DB::select(DB::raw("select sum(y.totallama) as total, y.ruanganasal from(
            select x.tanggalpulang, sum(x.lamadirawat) as totallama, x.ruanganasal from(
            with cte as (
                select pdt.norec, min(apdt.tglmasuk::date) tglmasuk from pasiendaftar_t as pdt
                inner join antrianpasiendiperiksa_t as apdt on apdt.noregistrasifk = pdt.norec
                inner join ruangan_m as rum on rum.id = apdt.objectruanganfk
                where rum.objectdepartemenfk = 16
                and pdt.statusenabled = TRUE
                and pdt.kdprofile = 30
                and pdt.tglpulang::date between '$tglAwal-01-01' and '$tglAwal-12-31'
                group by pdt.norec, apdt.objectruanganfk
            ),
						cteruangan as (
                select pdt.norec, min(apdt.tglmasuk::date) tglmasuk, rum.namaruangan from pasiendaftar_t as pdt
                inner join antrianpasiendiperiksa_t as apdt on apdt.noregistrasifk = pdt.norec
                inner join ruangan_m as rum on rum.id = apdt.objectruanganfk
                where (rum.id = 765 or rum.id = 768)
                and pdt.kdprofile = 30
                and pdt.tglpulang::date between '$tglAwal-01-01' and '$tglAwal-12-31'
                group by pdt.norec, apdt.objectruanganfk, rum.namaruangan
            )
            
            select pd.tglpulang::date as tanggalpulang, cte.tglmasuk as tanggalmasuk, cteruangan.namaruangan as ruanganasal,
            case when pd.tglpulang::date-cte.tglmasuk::date = 0 then 1 else  pd.tglpulang::date-cte.tglmasuk end as lamadirawat
                        FROM pasiendaftar_t as pd
                        INNER JOIN cte on cte.norec = pd.norec
												inner join cteruangan on cteruangan.norec = pd.norec
                        WHERE pd.kdprofile = 30 and pd.tglpulang is not null and cast(pd.tglpulang as date) between '$tglAwal-01-01' and '$tglAwal-12-31'
                                    group by pd.tglpulang::date, cte.tglmasuk, cteruangan.namaruangan 
                                    order by pd.tglpulang::date) as x group by x.tanggalpulang, x.ruanganasal) as y group by y.ruanganasal"));

                                    
            $hidup = DB::select(DB::raw("with cte as(
                select min(apd.tglmasuk), ru.namaruangan, pd.norec
                FROM pasiendaftar_t as pd
                inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk
                where pd.kdprofile = $kdProfile and pd.statusenabled = true and ru.objectdepartemenfk <> 16
                group by ru.namaruangan, pd.norec
                )
                select pd.tglpulang::date as tgl, count(pd.noregistrasi) total, cte.namaruangan ruanganasal
                            FROM pasiendaftar_t as pd
                                        INNER JOIN ruangan_m as rum on rum.id = pd.objectruanganlastfk
                                        inner join cte on pd.norec = cte.norec
                            where pd.kdprofile = $kdProfile and pd.statusenabled = true
                                        and cast(pd.tglpulang as date) between '$tglAwal-01-01' and '$tglAwal-12-31'
                                        and rum.objectdepartemenfk = 16
                            and pd.tglpulang is not null
                                        group by pd.tglpulang::date, cte.namaruangan"));

            $meninggal = DB::select(DB::raw("with cte as(
                select min(apd.tglmasuk), ru.namaruangan, pd.norec
                FROM pasiendaftar_t as pd
                inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk
                where pd.kdprofile = $kdProfile and pd.statusenabled = true and ru.objectdepartemenfk <> 16
                group by ru.namaruangan, pd.norec
                )
                select pd.tglmeninggal::date as tgl, count(pd.noregistrasi) total, cte.namaruangan as ruanganasal, kps.id
                            FROM pasiendaftar_t as pd
                                        inner join kondisipasien_m kps on kps.id = pd.objectkondisipasienfk
                            inner join ruangan_m ru on ru.id = pd.objectruanganlastfk
                                        inner join cte on cte.norec = pd.norec
                            where pd.kdprofile = $kdProfile and pd.statusenabled = true
                                        and cast(pd.tglmeninggal as date) between '$tglAwal-01-01' and '$tglAwal-12-31'
                            and ru.objectdepartemenfk = 16
                                        group by pd.tglmeninggal::date, cte.namaruangan, kps.id"));


            $kelas = DB::select(DB::raw("select tgl, sum(jumlah) as total, ruanganasal, objectkelasfk from (
                select tgl, jumlah, ruanganasal, objectkelasfk from (select apd.tglmasuk::date as tgl, count(apd.tglmasuk) as jumlah, ru1.namaruangan as ruanganasal, apd.objectkelasfk
                FROM pasiendaftar_t as pd
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk IN (16)
                LEFT JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk NOT IN (16)
                where pd.kdprofile = $idProfile 
                and pd.statusenabled = true
                and cast(apd.tglmasuk as date) between '$tglAwal-01-01' and '$tglAwal-12-31'
                group by apd.tglmasuk::date, ru1.namaruangan, apd.objectkelasfk
                ) as x
    
                UNION ALL
    
                select tgl, jumlah, ruanganasal, objectkelasfk from (select apd.tglmasuk::date as tgl, count(apd.tglmasuk) as jumlah, ru1.namaruangan as ruanganasal, apd.objectkelasfk
                FROM pasiendaftar_t as pd
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk IN (16)
                inner JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk IN (16)
                where pd.kdprofile = $idProfile 
                and pd.statusenabled = true
                and cast(apd.tglmasuk as date) between '$tglAwal-01-01' and '$tglAwal-12-31'
                group by apd.tglmasuk::date, ru1.namaruangan, apd.objectkelasfk
                ) as x group by tgl, ruanganasal, objectkelasfk, x.jumlah
                ) as y 
                group by tgl, ruanganasal, objectkelasfk"));

        $profile = DB::select(DB::raw("select namakota, namalengkap, namapemerintahan, id idprofile
        from profile_m where id = $kdProfile"));


        $main = array("Penyakit Dalam", "Kesehatan Anak", "Obstetri", "Ginekologi", "Bedah", "Bedah Ortopedhi", "Bedah Saraf", "Luka Bakar", "Saraf", "Jiwa", "Psikologi", "Penatalaksanaan Penyalahgunaan NAPZA", "THT", "Mata", "Kulit dan Kelamin", "Kardiologi", "Paru-paru", "Geriatri", "Radioterapi", "Kedokteran Nuklir", "Kusta", "Rehabilitasi Medik", "Isolasi", "ICU", "ICCU", "NICU / PICU", "Umum", "Gigi & Mulut", "Pelayanan Rawat Darurat", "Perinatologi", "SUB TOTAL", "Perinatologi", "TOTAL");
        $currentmain = "Larasatizka";

        $jumlahpasienawal = 0;
        $jumlahpasienmasuk = 0;
        $jumlahpasienhidup = 0;
        $jumlahpasienkurang = 0;
        $jumlahpasienlebih = 0;
        $jumlahlamadirawat = 0;
        $jumlahpasienakhir = 0;
        $jumlahhariperawatan = 0;
        $jumlahvvip = 0;
        $jumlahvip = 0;
        $jumlahsatu = 0;
        $jumlahdua = 0;
        $jumlahtiga = 0;
        $jumlahkhusus = 0;
        $jumlahpasienawalperhari = 0;

        foreach($main as $row){
            $jumlahpasienawal = 0;
            $jumlahpasienmasuk = 0;
            $jumlahpasienhidup = 0;
            $jumlahpasienkurang = 0;
            $jumlahpasienlebih = 0;
            $jumlahlamadirawat = 0;
            $jumlahpasienakhir = 0;
            $jumlahhariperawatan = 0;
            $jumlahpasienawalperhari = 0;
            $jumlahvvip = 0;
            $jumlahvip = 0;
            $jumlahsatu = 0;
            $jumlahdua = 0;
            $jumlahtiga = 0;
            $jumlahkhusus = 0;
            if($row != $currentmain){

                foreach($profile as $pr){
                    $koders = $pr->idprofile;
                    $namakota = $pr->namakota;
                    $namars = $pr->namalengkap;
                }
                foreach($pasienawal as $pa){
                    if($row == "Jiwa" && $pa->ruanganasal == "UGD (Pasien Jiwa)"){
                        $jumlahpasienawal += $pa->total;
                    } else if($row == "Penatalaksanaan Penyalahgunaan NAPZA" && $pa->ruanganasal == "NAPZA"){
                        $jumlahpasienawal += $pa->total;
                    }
                }
                foreach($pasienmasuk as $pm){
                    if($row == "Jiwa" && $pm->ruanganasal == "UGD (Pasien Jiwa)"){
                        $jumlahpasienmasuk += $pm->total;
                    } else if($row == "Penatalaksanaan Penyalahgunaan NAPZA" && $pm->ruanganasal == "NAPZA"){
                        $jumlahpasienmasuk += $pm->total;
                    }
                }
                foreach($hidup as $hd){
                    if($row == "Jiwa" && $hd->ruanganasal == "UGD (Pasien Jiwa)"){
                        $jumlahpasienhidup += $hd->total;
                    } else if($row == "Penatalaksanaan Penyalahgunaan NAPZA" && $hd->ruanganasal == "NAPZA"){
                        $jumlahpasienhidup += $hd->total;
                    }
                }
                foreach($meninggal as $mg){
                    if($row == "Jiwa" && $mg->ruanganasal == "UGD (Pasien Jiwa)" && $mg->id == 5){
                        $jumlahpasienkurang += $mg->total;
                    } else if($row == "Penatalaksanaan Penyalahgunaan NAPZA" && $mg->ruanganasal == "NAPZA" && $mg->id == 5){
                        $jumlahpasienkurang += $mg->total;
                    } else if($row == "Jiwa" && $mg->ruanganasal == "UGD (Pasien Jiwa)" && $mg->id == 6){
                        $jumlahpasienlebih += $mg->total;
                    } else if($row == "Penatalaksanaan Penyalahgunaan NAPZA" && $mg->ruanganasal == "NAPZA" && $mg->id == 6){
                        $jumlahpasienlebih += $mg->total;
                    }
                }
                foreach($lamahari as $lh){
                    if($row == "Jiwa" && $lh->ruanganasal == "UGD (Pasien Jiwa)"){
                        $jumlahlamadirawat += $lh->total;
                    } else if($row == "Penatalaksanaan Penyalahgunaan NAPZA" && $lh->ruanganasal == "NAPZA"){
                        $jumlahlamadirawat += $lh->total;
                    }
                }
                foreach($pasienakhir as $pa){
                    if($row == "Jiwa" && $pa->ruanganasal == "UGD (Pasien Jiwa)"){
                        $jumlahpasienakhir += $pa->total;
                    } else if($row == "Penatalaksanaan Penyalahgunaan NAPZA" && $pa->ruanganasal == "NAPZA"){
                        $jumlahpasienakhir += $pa->total;
                    }
                }
                foreach($kelas as $kl){
                    if($row == "Jiwa" && $kl->ruanganasal == "UGD (Pasien Jiwa)" && $kl->objectkelasfk == 4){
                        $jumlahvip += $kl->total;
                    } else if($row == "Penatalaksanaan Penyalahgunaan NAPZA" && $kl->ruanganasal == "NAPZA" && $kl->objectkelasfk == 4){
                        $jumlahvip += $kl->total;
                    } else if($row == "Jiwa" && $kl->ruanganasal == "UGD (Pasien Jiwa)" && $kl->objectkelasfk == 3){
                        $jumlahsatu += $kl->total;
                    } else if($row == "Penatalaksanaan Penyalahgunaan NAPZA" && $kl->ruanganasal == "NAPZA" && $kl->objectkelasfk == 3){
                        $jumlahsatu += $kl->total;
                    } else if($row == "Jiwa" && $kl->ruanganasal == "UGD (Pasien Jiwa)" && $kl->objectkelasfk == 2){
                        $jumlahdua += $kl->total;
                    } else if($row == "Penatalaksanaan Penyalahgunaan NAPZA" && $kl->ruanganasal == "NAPZA" && $kl->objectkelasfk == 2){
                        $jumlahdua += $kl->total;
                    } else if($row == "Jiwa" && $kl->ruanganasal == "UGD (Pasien Jiwa)" && $kl->objectkelasfk == 1){
                        $jumlahsatu += $kl->total;
                    } else if($row == "Penatalaksanaan Penyalahgunaan NAPZA" && $kl->ruanganasal == "NAPZA" && $kl->objectkelasfk == 1){
                        $jumlahsatu += $kl->total;
                    } else if($row == "Jiwa" && $kl->ruanganasal == "UGD (Pasien Jiwa)" && $kl->objectkelasfk == 6){
                        $jumlahkhusus += $kl->total;
                    } else if($row == "Penatalaksanaan Penyalahgunaan NAPZA" && $kl->objectkelasfk == 6 && $kl->ruanganasal == "NAPZA"){
                        $jumlahkhusus += $kl->total;
                    }
                }
                foreach($pasienawalperhari as $pap){
                    if($row == "Jiwa" && $pap->ruanganasal == "UGD (Pasien Jiwa)"){
                        $jumlahpasienawalperhari += $pap->total;
                    } else if($row == "Penatalaksanaan Penyalahgunaan NAPZA" && $pap->ruanganasal == "NAPZA"){
                        $jumlahpasienawalperhari += $pap->total;
                    }
                }

                $jumlahhariperawatan = $jumlahpasienmasuk + $jumlahpasienawalperhari;

                $data10[] = array(
                    'pelayanan' => $row,
                    'koders' => $koders,
                    'namakota' => $namakota,
                    'namars' => $namars,
                    'jumlahpasienawal' => $jumlahpasienawal,
                    'jumlahpasienmasuk' => $jumlahpasienmasuk,
                    'jumlahpasienhidup' => $jumlahpasienhidup,
                    'jumlahpasienkurang' => $jumlahpasienkurang,
                    'jumlahpasienlebih' => $jumlahpasienlebih,
                    'jumlahlamadirawat' => $jumlahlamadirawat,
                    'jumlahpasienakhir' => $jumlahpasienakhir,
                    'jumlahhariperawatan' => $jumlahhariperawatan,
                    'jumlahvvip' => $jumlahvvip,
                    'jumlahvip' => $jumlahvip,
                    'jumlahsatu' => $jumlahsatu,
                    'jumlahdua' => $jumlahdua,
                    'jumlahtiga' => $jumlahtiga,
                    'jumlahkhusus' => $jumlahkhusus,
                );


            }
            $currentmain = $row;
        }

        $result = array(
            'data' => $data10,
            'message' => 'as@cepot',
        );
        return $this->respond($result);
    }
    public function getLaporanRL32RawatDarurat(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];

        $main = array("Bedah", "Non Bedah", "Kebidanan", "Psikiatrik", "Anak", "TOTAL");

        $data10 = DB::select(DB::raw("select x.namaruangan, sum(jumlahrujukan) as jumlahrujukanfix, sum(jumlahnonrujukan) jumlahnonrujukanfix, 
        sum(jumlahdirawat) as jumlahdirawatfix, sum(jumlahdirujuk) jumlahdirujukfix, sum(jumlahpulang) jumlahpulangfix,
        sum(jumlahmeninggal) jumlahmeninggalfix 
        from(
            select ru.namaruangan, min(apd.tglmasuk), pd.noregistrasi, apd.objectruanganfk, pd.objectruanganlastfk, pd.tglpulang, pd.objectstatuspulangfk,
            case when apd.objectasalrujukanfk in(1,2,3,4,8,9,11,12,13,14,15,16,17) then count(pd.noregistrasi) else 0 end as jumlahrujukan,
            case when apd.objectasalrujukanfk in(5,6,7,10) then count(pd.noregistrasi) else 0 end as jumlahnonrujukan,
            case when (pd.objectruanganlastfk <> apd.objectruanganfk and pd.objectstatuspulangfk is null) or (pd.objectruanganlastfk <> apd.objectruanganfk and pd.objectstatuspulangfk not in(10,11,5,4)) then count(pd.noregistrasi) else 0 end as jumlahdirawat,
            case when pd.objectstatuspulangfk in(10,11,5,4) then count(pd.noregistrasi) else 0 end as jumlahdirujuk,
            case when min(apd.tglmasuk) = pd.tglpulang and pd.objectruanganlastfk = apd.objectruanganfk and pd.objectstatuspulangfk is null then count(pd.noregistrasi) else 0 end as jumlahpulang,
            case when pd.objectstatuspulangfk = 9 and pd.objectruanganlastfk = apd.objectruanganfk then count(pd.noregistrasi) else 0 end as jumlahmeninggal
            FROM
            pasiendaftar_t pd
            INNER JOIN antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
            INNER JOIN pasien_m ps on ps.id=pd.nocmfk
            inner join ruangan_m ru on ru.id = apd.objectruanganfk
            where pd.kdprofile = 30 and pd.statusenabled = TRUE
            and pd.tglregistrasi between '$tglAwal' and '$tglAkhir'
            and apd.tglmasuk between '$tglAwal' and '$tglAkhir'
            and ru.id in (765, 766, 768)
            group by ru.namaruangan, pd.noregistrasi, apd.objectruanganfk, pd.objectruanganlastfk, pd.tglpulang, pd.objectstatuspulangfk, apd.objectasalrujukanfk, pd.objectstatuspulangfk, pd.objectruanganlastfk, apd.objectruanganfk
        ) as x group by x.namaruangan;
        "));
        //var_dump($data10);

        $rujukan = 0;
        $nonrujukan = 0;
        $dirawat = 0;
        $dirujuk = 0;
        $pulang = 0;
        $meninggal = 0;

        foreach($main as $row){
            $rujukan = 0;
            $nonrujukan = 0;
            $dirawat = 0;
            $dirujuk = 0;
            $pulang = 0;
            $meninggal = 0;

                if($row == 'Psikiatrik'){
                    $rujukan = $data10[0]->jumlahrujukanfix;
                    $nonrujukan = $data10[0]->jumlahnonrujukanfix;
                    $dirawat = $data10[0]->jumlahdirawatfix;
                    $dirujuk = $data10[0]->jumlahdirujukfix;
                    $pulang = $data10[0]->jumlahpulangfix;
                    $meninggal = $data10[0]->jumlahmeninggalfix;
                }

                $datas[] = array(
                    'namaruangan' => $row,
                    'jumlahrujukanfix' => $rujukan,
                    'jumlahnonrujukanfix' => $nonrujukan,
                    'jumlahdirawatfix' => $dirawat,
                    'jumlahdirujukfix' => $dirujuk,
                    'jumlahpulangfix' => $pulang,
                    'jumlahmeninggalfix' => $meninggal,
                );
        }

        $result = array(
            'data' => $datas,
            'message' => 'er@epic',

        );

        return $this->respond($result);
    }

    public function getKegiatanKesehatanGigidanMulut(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $KdJenisLapGigiMulut = (int) $this->settingDataFixed('KdJenisLapGigiMulut',$idProfile);
        $dataLogin = $request->all();
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '= ', 'apd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->join('detailjenisproduk_m as djp', 'djp.id', '=', 'pr.objectdetailjenisprodukfk')
            ->join('jenisproduk_m as jp', 'jp.id', '=', 'djp.objectjenisprodukfk')
            ->join('kelompokproduk_m as kp', 'kp.id', '=', 'jp.objectkelompokprodukfk')
            ->join('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
            ->join('mapproduktolaporanrl_m as mpptrl','mpptrl.produkfk','=','pr.id')
            ->join('kelompoklaporan_m as kl','kl.id','=','mpptrl.objectkontenlaporanfk')
            ->join('jenislaporan_m as jl','jl.id','=','mpptrl.objectjenislaporanfk')
            ->select('jl.jenislaporan','kl.kelompoklaporan',
                (DB::raw('COUNT(mpptrl.objectkontenlaporanfk) as jumlah'))
//            ->select('pp.norec','pr.id','pr.namaproduk',
//                (DB::raw('case
//                          when pr.id in (401790,401791,478,479)
//                                    then \'Pencabutan Gigi Tetap\'
//                          when pr.id in (15366,401789,402686,402692,15247,15364,15245,401796,477,502,15467)
//                                    then \'Pencabutan Gigi Sulung\'
//                          when pr.id in (401854,10003505,401855,493,493119,401548,402852,574,612)
//                                    then \'Pembersihan karang gigi\'
//                          when pp.produkfk in (401864,401862,401865,401861,401863,401866,401867,401868,494,495,496,497,498,499,532)
//                                    then \'Tumpatan Gigi\'
//                          when pp.produkfk in (15728,401872,523,401829,401830,402991,19856,19859,19851,402046,10012701,536,731)
//                                    then \'Orthodonti\'
//                          when pp.produkfk in (546,724,723,403077,401817)
//                                    then \'Jacket/Bridge\'
//			              else \'-\'
//			              end as jeniskegiatan'))
            )
            ->where('pd.kdprofile', $idProfile)
            ->where('jl.id',$KdJenisLapGigiMulut)
            ->groupBy('mpptrl.objectkontenlaporanfk','jl.jenislaporan','kl.kelompoklaporan');
//            ->where('ru.id', 4)
//            ->whereNotIn('djp.objectjenisprodukfk',[97])
//            ->wherein('kp.id', [1, 2, 3, 4, 8, 9, 10, 11, 13, 14])
//            ->whereNull('sp.statusenabled');

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pp.tglpelayanan', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];
            $data = $data->where('pp.tglpelayanan', '<=', $tgl);
        }

        $data = $data->get();
//        $data10 = [];
//        $jml = 0;
//        $jmlCentralLine = 0;
//        $jmlKateterUrine = 0;
//
//        foreach ($data as $item) {
//            $sama = false;
//            $i = 0;
//            foreach ($data10 as $dat) {
//                if ($item->jeniskegiatan == $data10[$i]['jeniskegiatan']) {
//                    $sama = true;
//                    $jml = (float)$dat['jumlah'] + 1;
//                    $data10[$i]['jumlah'] = $jml;
//
//                    $data10[$i]['Total'] = (float)$dat['Total'] + 1;
//                }
//                $i = $i + 1;
//            }
//            if ($sama == false) {
//
//                $data10[] = array(
//                    'jeniskegiatan'=>$item->jeniskegiatan,
//                    'Total' => 1,
//                    'jumlah' => 1,
//                );
//            }
//
//            foreach ($data10 as $key => $row) {
//                $count[$key] = $row['jumlah'];
//            }
//            array_multisort($count, SORT_DESC, $data10);
//        }

        $result = array(
//            'data' => $data10,
            'data' => $data,
            'message' => 'kabayan',
        );

        return $this->respond($result);
    }
    public function getLaporanRL34Kebidanan(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $KdJenisLapKebidanan = (int) $this->settingDataFixed('KdJenisLapKebidanan', $idProfile);
        $KdRuangKebidanan = explode(',', $this->settingDataFixed('KdRuangKebidanan', $idProfile));
        $dataLogin = $request->all();
        $kdListRuanganKebidanan = [];
        foreach ($KdRuangKebidanan as $item){
            $kdListRuanganKebidanan [] = (int) $item;
        }
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('departemen_m as dpm', 'dpm.id', '=', 'ru.objectdepartemenfk')
            ->join('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->join('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->join('mapproduktolaporanrl_m as mprl','mprl.produkfk','=','pp.produkfk')
            ->join('jenislaporan_m as jl','jl.id','=','mprl.objectjenislaporanfk')
            ->join('kelompoklaporan_m as kl','kl.id','=','mprl.objectkontenlaporanfk')
            ->join('detailjenisproduk_m as djp', 'djp.id', '=', 'pr.objectdetailjenisprodukfk')
            ->join('jenisproduk_m as jp', 'jp.id', '=', 'djp.objectjenisprodukfk')
            ->join('asalrujukan_m as ar', 'ar.id', '=', 'apd.objectasalrujukanfk')
            ->leftjoin ('statuskeluar_m as stk','stk.id','=','pd.objectstatuskeluarfk')
            ->leftJoin('kelompokproduk_m as kp', 'kp.id', '=', 'jp.objectkelompokprodukfk')
            ->select( 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk',
                'apd.objectasalrujukanfk', 'ar.asalrujukan','pd.objectstatuskeluarfk','apd.objectruanganfk',
                'kl.kelompoklaporan as jenispelayanan'
//                DB::raw('(case when pr.id =402494 then \'Persalinan Normal\'
//                        when pr.id in (15375,15386,15387,15388,15477) then \'Sectio Caesaria\'
//                        else \'-\'
//                         end) as jenispelayanan ')
            )
            ->where('pd.kdprofile', $idProfile)
            ->where('jl.id', $KdJenisLapKebidanan)//laporan RL 34
            ->whereIn('apd.objectruanganfk', $kdListRuanganKebidanan);


        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pp.tglpelayanan', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];
            $data = $data->where('pp.tglpelayanan', '<=', $tgl);
        }

        $data = $data->get();

        $data10 = [];
        $jml = 0;
        $rujukanRS = 0;
        $rujukanBidan = 0;
        $rujukanPuskes = 0;
        $rujukanFaskesLain = 0;
        $jmlMedisHidup = 0;
        $jmlMedisMati = 0;
        $jmlTotalMedis = 0;
        $jmlNonMedisHidup = 0;
        $jmlNonMedisMati = 0;
        $jmlTotalNonMedis = 0;
        $nonRujukanHidup=0;
        $nonRujukanMati=0;
        $totalNonRujukan=0;
        $dirujuk=0;
        $sama = false;


        foreach ($data as $item) {
            $sama = false;
            $i = 0;
            $o = 0;
            foreach ($data10 as $hideung) {
                if ($item->jenispelayanan == $data10[$i]['jenispelayanan']) {
                    $sama = true;
                    $jml = (float)$hideung['jumlah'] + 1;
                    $data10[$i]['jumlah'] = $jml;

                    //RS=2, puskes=1, faskeslan=3, non rujikan =5, klinik=3
                    //statuskeluar --->1 pulang , 2 pindah,3 rajal, 4 rujuk, 5 meningggal

                    if ($item->objectasalrujukanfk == 2) {
                        $data10[$i]['rujukanRS'] = (float)$hideung['rujukanRS'] + 1;
                    } else if ($item->objectasalrujukanfk == 1) {
                        $data10[$i]['rujukanPuskes'] = (float)$hideung['rujukanPuskes'] + 1;
                    } else if ($item->objectasalrujukanfk == 3 || $item->objectasalrujukanfk ==4) {
                        $data10[$i]['rujukanFaskesLain'] = (float)$hideung['rujukanFaskesLain'] + 1;
                    }
                    if (($item->objectasalrujukanfk == 2 || $item->objectasalrujukanfk == 1 ||$item->objectasalrujukanfk == 3)&& $item->objectstatuskeluarfk==1 ) {
                        $data10[$i]['jmlMedisHidup'] = (float)$hideung['jmlMedisHidup'] + 1;
                    } else if (($item->objectasalrujukanfk == 2 || $item->objectasalrujukanfk == 1 ||$item->objectasalrujukanfk == 3)&& $item->objectstatuskeluarfk==5 ) {
                        $data10[$i]['jmlMedisMati'] = (float)$hideung['jmlMedisMati'] + 1;
                    }
                    if (($item->objectasalrujukanfk == 5 ||$item->objectasalrujukanfk == 4) && $item->objectstatuskeluarfk==1) {
                        $data10[$i]['jmlNonMedisHidup'] = (float)$hideung['jmlNonMedisHidup'] + 1;
                    } else if (($item->objectasalrujukanfk == 5 ||$item->objectasalrujukanfk == 4) && $item->objectstatuskeluarfk==5) {
                        $data10[$i]['jmlNonMedisMati'] = (float)$hideung['jmlNonMedisMati'] + 1;
                    }  if ($item->objectstatuskeluarfk == 4) {
                        $data10[$i]['dirujuk'] = (float)$hideung['dirujuk'] + 1;
                    }

                    $data10[$i]['jmlTotalMedis'] = $data10[$i]['rujukanRS'] + $data10[$i]['rujukanPuskes']+$data10[$i]['rujukanFaskesLain'] + $data10[$i]['jmlMedisHidup']+ $data10[$i]['jmlMedisMati'];
                    $data10[$i]['jmlTotalNonMedis'] = $data10[$i]['jmlNonMedisHidup'] + $data10[$i]['jmlNonMedisMati'];

                }
                $i = $i + 1;
            }

            if ($sama == false) {
                if ($item->objectasalrujukanfk == 2) {
                    $rujukanRS = 1;$rujukanBidan = 0;$rujukanPuskes = 0;$rujukanFaskesLain = 0;$jmlMedisHidup = 0;$jmlMedisMati = 0;
                    $jmlTotalMedis = 0;$jmlNonMedisHidup = 0;$jmlNonMedisMati = 0;$jmlTotalNonMedis = 0;$nonRujukanHidup=0;$nonRujukanMati=0;
                    $totalNonRujukan=0;$dirujuk=0;
                } else if ($item->objectasalrujukanfk == 1) {
                    $rujukanRS = 0;$rujukanBidan = 0;$rujukanPuskes = 1;$rujukanFaskesLain = 0;$jmlMedisHidup = 0;$jmlMedisMati = 0;
                    $jmlTotalMedis = 0;$jmlNonMedisHidup = 0;$jmlNonMedisMati = 0;$jmlTotalNonMedis = 0;$nonRujukanHidup=0;$nonRujukanMati=0;
                    $totalNonRujukan=0;$dirujuk=0;
                } else if ($item->objectasalrujukanfk == 3 || $item->objectasalrujukanfk ==4) {
                    $rujukanRS = 0;$rujukanBidan = 0;$rujukanPuskes = 0;$rujukanFaskesLain = 1;$jmlMedisHidup = 0;$jmlMedisMati = 0;
                    $jmlTotalMedis = 0;$jmlNonMedisHidup = 0;$jmlNonMedisMati = 0;$jmlTotalNonMedis = 0;$nonRujukanHidup=0;$nonRujukanMati=0;
                    $totalNonRujukan=0;$dirujuk=0;
                }  if (($item->objectasalrujukanfk == 2 || $item->objectasalrujukanfk == 1 ||$item->objectasalrujukanfk == 3)&& $item->objectstatuskeluarfk==1 ) {
                    $rujukanRS = 0;$rujukanBidan = 0;$rujukanPuskes = 0;$rujukanFaskesLain = 0;$jmlMedisHidup = 1;$jmlMedisMati = 0;
                    $jmlTotalMedis = 0;$jmlNonMedisHidup = 0;$jmlNonMedisMati = 0;$jmlTotalNonMedis = 0;$nonRujukanHidup=0;$nonRujukanMati=0;
                    $totalNonRujukan=0;$dirujuk=0;
                } else if (($item->objectasalrujukanfk == 2 || $item->objectasalrujukanfk == 1 ||$item->objectasalrujukanfk == 3)&& $item->objectstatuskeluarfk==5 ) {
                    $rujukanRS = 0;$rujukanBidan = 0;$rujukanPuskes = 0;$rujukanFaskesLain = 0;$jmlMedisHidup = 0;$jmlMedisMati = 1;
                    $jmlTotalMedis = 0;$jmlNonMedisHidup = 0;$jmlNonMedisMati = 0;$jmlTotalNonMedis = 0;$nonRujukanHidup=0;$nonRujukanMati=0;
                    $totalNonRujukan=0;$dirujuk=0;
                }
                if (($item->objectasalrujukanfk == 5 ||$item->objectasalrujukanfk == 4)&& $item->objectstatuskeluarfk==1) {
                    $rujukanRS = 0;$rujukanBidan = 0;$rujukanPuskes = 0;$rujukanFaskesLain = 0;$jmlMedisHidup = 0;$jmlMedisMati = 0;
                    $jmlTotalMedis = 0;$jmlNonMedisHidup = 1;$jmlNonMedisMati = 0;$jmlTotalNonMedis = 0;$nonRujukanHidup=0;$nonRujukanMati=0;
                    $totalNonRujukan=0;$dirujuk=0;
                } else if (($item->objectasalrujukanfk == 5 ||$item->objectasalrujukanfk == 4) && $item->objectstatuskeluarfk==5) {
                    $rujukanRS = 0;$rujukanBidan = 0;$rujukanPuskes = 0;$rujukanFaskesLain = 0;$jmlMedisHidup = 0;$jmlMedisMati = 0;
                    $jmlTotalMedis = 0;$jmlNonMedisHidup = 0;$jmlNonMedisMati = 1;$jmlTotalNonMedis = 0;$nonRujukanHidup=0;$nonRujukanMati=0;
                    $totalNonRujukan=0;$dirujuk=0;
                }  if ($item->objectstatuskeluarfk == 4) {
                    $rujukanRS = 0;$rujukanBidan = 0;$rujukanPuskes = 0;$rujukanFaskesLain = 0;$jmlMedisHidup = 0;$jmlMedisMati = 0;
                    $jmlTotalMedis = 0;$jmlNonMedisHidup = 0;$jmlNonMedisMati = 0;$jmlTotalNonMedis = 0;$nonRujukanHidup=0;$nonRujukanMati=0;
                    $totalNonRujukan=0;$dirujuk=1;
                }

                $data10[] = array(
//                    'produkfk' => $item->produkfk,
                    'jenispelayanan' => $item->jenispelayanan,
                    'jumlah' => 1,

                    'rujukanRS'=> $rujukanRS,
                    'rujukanFaskesLain'=> $rujukanFaskesLain ,
                    'rujukanPuskes'=> $rujukanPuskes ,
                    'rujukanBidan'=> 0 ,
                    'jmlMedisHidup'=> $jmlMedisHidup,
                    'jmlMedisMati'=> $jmlMedisMati,
                    'jmlTotalMedis'=>$jmlTotalMedis ,
                    'jmlNonMedisHidup'=> $jmlNonMedisHidup ,
                    'jmlNonMedisMati'=> $jmlNonMedisMati,
                    'jmlTotalNonMedis'=> $jmlTotalNonMedis,
                    'nonRujukanHidup'=> $nonRujukanHidup,
                    'nonRujukanMati'=> $nonRujukanMati,
                    'totalNonRujukan'=> $totalNonRujukan,
                    'dirujuk'=> $dirujuk,
                    'jmlTotalMedis'=>$jmlTotalMedis,
                    'jmlTotalNonMedis'=>$jmlTotalNonMedis,
                );
            }

            foreach ($data10 as $key => $row) {
                $count[$key] = $row['jumlah'];
            }

            array_multisort($count, SORT_DESC, $data10);
        }
        $result = array(
            'data' => $data10,
            'message' => 'er@epic',

        );

        return $this->respond($result);
    }
    public function getLaporanRL35Perinatologi(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $KdJenisLapPerinatologi = (int)$this->settingDataFixed('KdJenisLapPerinatologi', $idProfile);
        $KdRuangKebidanan = explode(',', $this->settingDataFixed('KdRuangKebidanan', $idProfile));
        $kdListRuanganKebidanan = [];
        foreach ($KdRuangKebidanan as $item){
            $kdListRuanganKebidanan [] = (int) $item;
        }
        $dataLogin = $request->all();
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('departemen_m as dpm', 'dpm.id', '=', 'ru.objectdepartemenfk')
            ->join('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->join('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->join('mapproduktolaporanrl_m as mprl','mprl.produkfk','=','pp.produkfk')
            ->join('jenislaporan_m as jl','jl.id','=','mprl.objectjenislaporanfk')
            ->join('kelompoklaporan_m as kl','kl.id','=','mprl.objectkontenlaporanfk')
            ->join('detailjenisproduk_m as djp', 'djp.id', '=', 'pr.objectdetailjenisprodukfk')
            ->join('jenisproduk_m as jp', 'jp.id', '=', 'djp.objectjenisprodukfk')
            ->join('asalrujukan_m as ar', 'ar.id', '=', 'apd.objectasalrujukanfk')
            ->leftjoin ('statuskeluar_m as stk','stk.id','=','pd.objectstatuskeluarfk')
            ->leftJoin('kelompokproduk_m as kp', 'kp.id', '=', 'jp.objectkelompokprodukfk')
            ->select( 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk',
                'apd.objectasalrujukanfk', 'ar.asalrujukan','pd.objectstatuskeluarfk','apd.objectruanganfk',
                'kl.kelompoklaporan as jenispelayanan'
//                DB::raw('(case when pr.id =402494 then \'Persalinan Normal\'
//                        when pr.id in (15375,15386,15387,15388,15477) then \'Sectio Caesaria\'
//                        else \'-\'
//                         end) as jenispelayanan ')
            )
//            ->where('dpm.id', 24)
            ->where('pd.kdprofile', $idProfile)
            ->where('jl.id', $KdJenisLapPerinatologi)//laporan RL 35
            ->whereIn('apd.objectruanganfk', $kdListRuanganKebidanan);


        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pp.tglpelayanan', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];
            $data = $data->where('pp.tglpelayanan', '<=', $tgl);
        }

        $data = $data->get();

        $data10 = [];
        $jml = 0;
        $rujukanRS = 0;
        $rujukanBidan = 0;
        $rujukanPuskes = 0;
        $rujukanFaskesLain = 0;
        $jmlMedisHidup = 0;
        $jmlMedisMati = 0;
        $jmlTotalMedis = 0;
        $jmlNonMedisHidup = 0;
        $jmlNonMedisMati = 0;
        $jmlTotalNonMedis = 0;
        $nonRujukanHidup=0;
        $nonRujukanMati=0;
        $totalNonRujukan=0;
        $dirujuk=0;
        $sama = false;


        foreach ($data as $item) {
            $sama = false;
            $i = 0;
            $o = 0;
            foreach ($data10 as $hideung) {
                if ($item->jenispelayanan == $data10[$i]['jenispelayanan']) {
                    $sama = true;
                    $jml = (float)$hideung['jumlah'] + 1;
                    $data10[$i]['jumlah'] = $jml;

                    //RS=2, puskes=1, faskeslan=3, non rujikan =5, klinik=3
                    //statuskeluar --->1 pulang , 2 pindah,3 rajal, 4 rujuk, 5 meningggal

                    if ($item->objectasalrujukanfk == 2) {
                        $data10[$i]['rujukanRS'] = (float)$hideung['rujukanRS'] + 1;
                    } else if ($item->objectasalrujukanfk == 1) {
                        $data10[$i]['rujukanPuskes'] = (float)$hideung['rujukanPuskes'] + 1;
                    } else if ($item->objectasalrujukanfk == 3 || $item->objectasalrujukanfk ==4) {
                        $data10[$i]['rujukanFaskesLain'] = (float)$hideung['rujukanFaskesLain'] + 1;
                    }
                    if (($item->objectasalrujukanfk == 2 || $item->objectasalrujukanfk == 1 ||$item->objectasalrujukanfk == 3)&& $item->objectstatuskeluarfk==1 ) {
                        $data10[$i]['jmlMedisHidup'] = (float)$hideung['jmlMedisHidup'] + 1;
                    } else if (($item->objectasalrujukanfk == 2 || $item->objectasalrujukanfk == 1 ||$item->objectasalrujukanfk == 3)&& $item->objectstatuskeluarfk==5 ) {
                        $data10[$i]['jmlMedisMati'] = (float)$hideung['jmlMedisMati'] + 1;
                    }
                    if (($item->objectasalrujukanfk == 5 ||$item->objectasalrujukanfk == 4) && $item->objectstatuskeluarfk==1) {
                        $data10[$i]['jmlNonMedisHidup'] = (float)$hideung['jmlNonMedisHidup'] + 1;
                    } else if (($item->objectasalrujukanfk == 5 ||$item->objectasalrujukanfk == 4) && $item->objectstatuskeluarfk==5) {
                        $data10[$i]['jmlNonMedisMati'] = (float)$hideung['jmlNonMedisMati'] + 1;
                    }  if ($item->objectstatuskeluarfk == 4) {
                        $data10[$i]['dirujuk'] = (float)$hideung['dirujuk'] + 1;
                    }

                    $data10[$i]['jmlTotalMedis'] = $data10[$i]['rujukanRS'] + $data10[$i]['rujukanPuskes']+$data10[$i]['rujukanFaskesLain'] + $data10[$i]['jmlMedisHidup']+ $data10[$i]['jmlMedisMati'];
                    $data10[$i]['jmlTotalNonMedis'] = $data10[$i]['jmlNonMedisHidup'] + $data10[$i]['jmlNonMedisMati'];

                }
                $i = $i + 1;
            }

            if ($sama == false) {
                if ($item->objectasalrujukanfk == 2) {
                    $rujukanRS = 1;$rujukanBidan = 0;$rujukanPuskes = 0;$rujukanFaskesLain = 0;$jmlMedisHidup = 0;$jmlMedisMati = 0;
                    $jmlTotalMedis = 0;$jmlNonMedisHidup = 0;$jmlNonMedisMati = 0;$jmlTotalNonMedis = 0;$nonRujukanHidup=0;$nonRujukanMati=0;
                    $totalNonRujukan=0;$dirujuk=0;
                } else if ($item->objectasalrujukanfk == 1) {
                    $rujukanRS = 0;$rujukanBidan = 0;$rujukanPuskes = 1;$rujukanFaskesLain = 0;$jmlMedisHidup = 0;$jmlMedisMati = 0;
                    $jmlTotalMedis = 0;$jmlNonMedisHidup = 0;$jmlNonMedisMati = 0;$jmlTotalNonMedis = 0;$nonRujukanHidup=0;$nonRujukanMati=0;
                    $totalNonRujukan=0;$dirujuk=0;
                } else if ($item->objectasalrujukanfk == 3 || $item->objectasalrujukanfk ==4) {
                    $rujukanRS = 0;$rujukanBidan = 0;$rujukanPuskes = 0;$rujukanFaskesLain = 1;$jmlMedisHidup = 0;$jmlMedisMati = 0;
                    $jmlTotalMedis = 0;$jmlNonMedisHidup = 0;$jmlNonMedisMati = 0;$jmlTotalNonMedis = 0;$nonRujukanHidup=0;$nonRujukanMati=0;
                    $totalNonRujukan=0;$dirujuk=0;
                }  if (($item->objectasalrujukanfk == 2 || $item->objectasalrujukanfk == 1 ||$item->objectasalrujukanfk == 3)&& $item->objectstatuskeluarfk==1 ) {
                    $rujukanRS = 0;$rujukanBidan = 0;$rujukanPuskes = 0;$rujukanFaskesLain = 0;$jmlMedisHidup = 1;$jmlMedisMati = 0;
                    $jmlTotalMedis = 0;$jmlNonMedisHidup = 0;$jmlNonMedisMati = 0;$jmlTotalNonMedis = 0;$nonRujukanHidup=0;$nonRujukanMati=0;
                    $totalNonRujukan=0;$dirujuk=0;
                } else if (($item->objectasalrujukanfk == 2 || $item->objectasalrujukanfk == 1 ||$item->objectasalrujukanfk == 3)&& $item->objectstatuskeluarfk==5 ) {
                    $rujukanRS = 0;$rujukanBidan = 0;$rujukanPuskes = 0;$rujukanFaskesLain = 0;$jmlMedisHidup = 0;$jmlMedisMati = 1;
                    $jmlTotalMedis = 0;$jmlNonMedisHidup = 0;$jmlNonMedisMati = 0;$jmlTotalNonMedis = 0;$nonRujukanHidup=0;$nonRujukanMati=0;
                    $totalNonRujukan=0;$dirujuk=0;
                }
                if (($item->objectasalrujukanfk == 5 ||$item->objectasalrujukanfk == 4)&& $item->objectstatuskeluarfk==1) {
                    $rujukanRS = 0;$rujukanBidan = 0;$rujukanPuskes = 0;$rujukanFaskesLain = 0;$jmlMedisHidup = 0;$jmlMedisMati = 0;
                    $jmlTotalMedis = 0;$jmlNonMedisHidup = 1;$jmlNonMedisMati = 0;$jmlTotalNonMedis = 0;$nonRujukanHidup=0;$nonRujukanMati=0;
                    $totalNonRujukan=0;$dirujuk=0;
                } else if (($item->objectasalrujukanfk == 5 ||$item->objectasalrujukanfk == 4) && $item->objectstatuskeluarfk==5) {
                    $rujukanRS = 0;$rujukanBidan = 0;$rujukanPuskes = 0;$rujukanFaskesLain = 0;$jmlMedisHidup = 0;$jmlMedisMati = 0;
                    $jmlTotalMedis = 0;$jmlNonMedisHidup = 0;$jmlNonMedisMati = 1;$jmlTotalNonMedis = 0;$nonRujukanHidup=0;$nonRujukanMati=0;
                    $totalNonRujukan=0;$dirujuk=0;
                }  if ($item->objectstatuskeluarfk == 4) {
                    $rujukanRS = 0;$rujukanBidan = 0;$rujukanPuskes = 0;$rujukanFaskesLain = 0;$jmlMedisHidup = 0;$jmlMedisMati = 0;
                    $jmlTotalMedis = 0;$jmlNonMedisHidup = 0;$jmlNonMedisMati = 0;$jmlTotalNonMedis = 0;$nonRujukanHidup=0;$nonRujukanMati=0;
                    $totalNonRujukan=0;$dirujuk=1;
                }

                $data10[] = array(
//                    'produkfk' => $item->produkfk,
                    'jenispelayanan' => $item->jenispelayanan,
                    'jumlah' => 1,

                    'rujukanRS'=> $rujukanRS,
                    'rujukanFaskesLain'=> $rujukanFaskesLain ,
                    'rujukanPuskes'=> $rujukanPuskes ,
                    'rujukanBidan'=> 0 ,
                    'jmlMedisHidup'=> $jmlMedisHidup,
                    'jmlMedisMati'=> $jmlMedisMati,
                    'jmlTotalMedis'=>$jmlTotalMedis ,
                    'jmlNonMedisHidup'=> $jmlNonMedisHidup ,
                    'jmlNonMedisMati'=> $jmlNonMedisMati,
                    'jmlTotalNonMedis'=> $jmlTotalNonMedis,
                    'nonRujukanHidup'=> $nonRujukanHidup,
                    'nonRujukanMati'=> $nonRujukanMati,
                    'totalNonRujukan'=> $totalNonRujukan,
                    'dirujuk'=> $dirujuk,

                );
            }

            foreach ($data10 as $key => $row) {
                $count[$key] = $row['jumlah'];
            }

            array_multisort($count, SORT_DESC, $data10);
        }
        $result = array(
            'data' => $data10,
            'message' => 'er@epic',

        );

        return $this->respond($result);
    }
    public function getLaporanRL36Pembedahan(Request $request){
        $idProfile = (int) $this->getDataKdProfile($request);
        $KdJenisLapPembedahan = (int) $this->settingDataFixed('KdJenisLapPembedahan', $idProfile);
//        $dataLogin = $request->all();
        $data = \DB::table('antrianpasiendiperiksa_t as apd')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('departemen_m as dpm', 'dpm.id', '=', 'ru.objectdepartemenfk')
            ->join('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->join('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->join('mapproduktolaporanrl_m as mprl','mprl.produkfk','=','pp.produkfk')
            ->join('jenislaporan_m as jl','jl.id','=','mprl.objectjenislaporanfk')
            ->join('kelompoklaporan_m as kl','kl.id','=','mprl.objectkontenlaporanfk')
            ->join('detailjenisproduk_m as djp', 'djp.id', '=', 'pr.objectdetailjenisprodukfk')
            ->join('jenisproduk_m as jp', 'jp.id', '=', 'djp.objectjenisprodukfk')
            ->leftJoin('kelompokproduk_m as kp', 'kp.id', '=', 'jp.objectkelompokprodukfk')
            ->select('pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk', 'pr.objectdetailjenisprodukfk',
                'djp.detailjenisproduk','kl.kelompoklaporan as spesialisasi')
            ->where('apd.kdprofile', $idProfile)
            ->where('jl.id',$KdJenisLapPembedahan);
//                DB::raw('(case when ru.id = 44 then \'Bedah\'
//                                when ru.id in (18,3,45,464) then \'Obstetrik & Ginekologi\'
//                                when ru.id =198 then \'Bedah Saraf\'
//                                when ru.id =6 then \'THT\'
//                                when ru.id =5 then \'Mata\'
//                                when ru.id =7 then \'Kulit & Kelamin\'
//                                when ru.id =4 then \'Gigi & Mulut\'
//                                when ru.id =1 then \'Bedah Anak\'
//                                when  ru.id=98 then \'Kardiovaskuler\'
//                                when ru.id =13 then \'Bedah Orthopedi\'
//                                when  ru.id= 35 then \'Thorax\'
//                                when  ru.id =240 then \'Urologi\'
//                                else \'Lain-lain\' end ) as spesialisasi')
//            )
        //PEMATOKAN :(((((
//            ->whereIn('ru.id', [44, 18, 3, 45, 464, 198, 6, 5, 7, 4, 1, 98, 13, 35, 240])
//            ->wherein('pr.objectdetailjenisprodukfk', [62, 138, 429, 431, 428, 78, 139, 430, 432, 426, 51,
//                427, 425, 433, 51, 427, 425, 433, 48, 140, 437, 434, 9, 52,
//                141, 435, 41, 56, 146, 438, 45, 39, 61, 70, 77, 54, 424, 421,
//                418, 66, 7, 64, 73, 47, 136, 423, 420, 417, 33, 143, 409, 412,
//                411, 60, 63, 6, 410, 414, 408, 415, 413, 142, 411]);
        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pp.tglpelayanan', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];
            $data = $data->where('pp.tglpelayanan', '<=', $tgl);
        }

        $data = $data->get();

        $data10 = [];
        $jml = 0;
        $khusus = 0;
        $besar = 0;
        $sedang = 0;
        $kecil = 0;
        $lainnya = 0;

        $sama = false;


        foreach ($data as $item) {
            $sama = false;
            $i = 0;
            $o = 0;
            foreach ($data10 as $hideung) {
                if ($item->spesialisasi == $data10[$i]['spesialisasi']) {
                    $sama = true;
                    $jml = (float)$hideung['jumlah'] + 1;
                    $data10[$i]['jumlah'] = $jml;
                    if ($item->objectdetailjenisprodukfk == 62 || $item->objectdetailjenisprodukfk == 78 || $item->objectdetailjenisprodukfk == 51
                        || $item->objectdetailjenisprodukfk == 138 || $item->objectdetailjenisprodukfk == 139 || $item->objectdetailjenisprodukfk == 427
                        || $item->objectdetailjenisprodukfk == 429 || $item->objectdetailjenisprodukfk == 430 || $item->objectdetailjenisprodukfk == 425
                        || $item->objectdetailjenisprodukfk == 431 || $item->objectdetailjenisprodukfk == 432 || $item->objectdetailjenisprodukfk == 433
                        || $item->objectdetailjenisprodukfk == 428 || $item->objectdetailjenisprodukfk == 426
                    ) {
                        $data10[$i]['besar'] = (float)$hideung['besar'] + 1;
                    } else if ($item->objectdetailjenisprodukfk == 9 || $item->objectdetailjenisprodukfk == 41 || $item->objectdetailjenisprodukfk == 45
                        || $item->objectdetailjenisprodukfk == 48 || $item->objectdetailjenisprodukfk == 52 || $item->objectdetailjenisprodukfk == 56
                        || $item->objectdetailjenisprodukfk == 140 || $item->objectdetailjenisprodukfk == 141 || $item->objectdetailjenisprodukfk == 146
                        || $item->objectdetailjenisprodukfk == 437 || $item->objectdetailjenisprodukfk == 435 || $item->objectdetailjenisprodukfk == 438
                        || $item->objectdetailjenisprodukfk == 434
                    ) {
                        $data10[$i]['khusus'] = (float)$hideung['khusus'] + 1;
                    } else if ($item->objectdetailjenisprodukfk == 26 || $item->objectdetailjenisprodukfk == 30 || $item->objectdetailjenisprodukfk == 33
                        || $item->objectdetailjenisprodukfk == 36 || $item->objectdetailjenisprodukfk == 39 || $item->objectdetailjenisprodukfk == 7
                        || $item->objectdetailjenisprodukfk == 43 || $item->objectdetailjenisprodukfk == 61 || $item->objectdetailjenisprodukfk == 64
                        || $item->objectdetailjenisprodukfk == 68 || $item->objectdetailjenisprodukfk == 70 || $item->objectdetailjenisprodukfk == 73
                        || $item->objectdetailjenisprodukfk == 76 || $item->objectdetailjenisprodukfk == 77 || $item->objectdetailjenisprodukfk == 47
                        || $item->objectdetailjenisprodukfk == 50 || $item->objectdetailjenisprodukfk == 54 || $item->objectdetailjenisprodukfk == 136
                        || $item->objectdetailjenisprodukfk == 137 || $item->objectdetailjenisprodukfk == 424 || $item->objectdetailjenisprodukfk == 423
                        || $item->objectdetailjenisprodukfk == 422 || $item->objectdetailjenisprodukfk == 421 || $item->objectdetailjenisprodukfk == 420
                        || $item->objectdetailjenisprodukfk == 419 || $item->objectdetailjenisprodukfk == 418 || $item->objectdetailjenisprodukfk == 417
                        || $item->objectdetailjenisprodukfk == 416 || $item->objectdetailjenisprodukfk == 66
                    ) {
                        $data10[$i]['sedang'] = (float)$hideung['sedang'] + 1;
                    } else if ($item->objectdetailjenisprodukfk == 60 || $item->objectdetailjenisprodukfk == 63 || $item->objectdetailjenisprodukfk == 142
                        || $item->objectdetailjenisprodukfk == 143 || $item->objectdetailjenisprodukfk == 6 || $item->objectdetailjenisprodukfk == 408
                        || $item->objectdetailjenisprodukfk == 409 || $item->objectdetailjenisprodukfk == 410 || $item->objectdetailjenisprodukfk == 415
                        || $item->objectdetailjenisprodukfk == 412 || $item->objectdetailjenisprodukfk == 414 || $item->objectdetailjenisprodukfk == 413
                        || $item->objectdetailjenisprodukfk == 411
                    ) {
                        $data10[$i]['kecil'] = (float)$hideung['kecil'] + 1;
                    }
//                    else  {
//                        $data10[$i]['lainnya'] = (float)$hideung['lainnya'] + 1;
//                    }

                }
                $i = $i + 1;
            }

            if ($sama == false) {
                if ($item->objectdetailjenisprodukfk == 62 || $item->objectdetailjenisprodukfk == 78 || $item->objectdetailjenisprodukfk == 51
                    || $item->objectdetailjenisprodukfk == 138 || $item->objectdetailjenisprodukfk == 139 || $item->objectdetailjenisprodukfk == 427
                    || $item->objectdetailjenisprodukfk == 429 || $item->objectdetailjenisprodukfk == 430 || $item->objectdetailjenisprodukfk == 425
                    || $item->objectdetailjenisprodukfk == 431 || $item->objectdetailjenisprodukfk == 432 || $item->objectdetailjenisprodukfk == 433
                    || $item->objectdetailjenisprodukfk == 428 || $item->objectdetailjenisprodukfk == 426
                ) {
                    $khusus = 0;
                    $besar = 1;
                    $sedang = 0;
                    $kecil = 0;
                    $lainnya = 0;
                } else if ($item->objectdetailjenisprodukfk == 9 || $item->objectdetailjenisprodukfk == 41 || $item->objectdetailjenisprodukfk == 45
                    || $item->objectdetailjenisprodukfk == 48 || $item->objectdetailjenisprodukfk == 52 || $item->objectdetailjenisprodukfk == 56
                    || $item->objectdetailjenisprodukfk == 140 || $item->objectdetailjenisprodukfk == 141 || $item->objectdetailjenisprodukfk == 146
                    || $item->objectdetailjenisprodukfk == 437 || $item->objectdetailjenisprodukfk == 435 || $item->objectdetailjenisprodukfk == 438
                    || $item->objectdetailjenisprodukfk == 434
                ) {
                    $khusus = 1;
                    $besar = 0;
                    $sedang = 0;
                    $kecil = 0;
                    $lainnya = 0;
                } else if ($item->objectdetailjenisprodukfk == 26 || $item->objectdetailjenisprodukfk == 30 || $item->objectdetailjenisprodukfk == 33
                    || $item->objectdetailjenisprodukfk == 36 || $item->objectdetailjenisprodukfk == 39 || $item->objectdetailjenisprodukfk == 7
                    || $item->objectdetailjenisprodukfk == 43 || $item->objectdetailjenisprodukfk == 61 || $item->objectdetailjenisprodukfk == 64
                    || $item->objectdetailjenisprodukfk == 68 || $item->objectdetailjenisprodukfk == 70 || $item->objectdetailjenisprodukfk == 73
                    || $item->objectdetailjenisprodukfk == 76 || $item->objectdetailjenisprodukfk == 77 || $item->objectdetailjenisprodukfk == 47
                    || $item->objectdetailjenisprodukfk == 50 || $item->objectdetailjenisprodukfk == 54 || $item->objectdetailjenisprodukfk == 136
                    || $item->objectdetailjenisprodukfk == 137 || $item->objectdetailjenisprodukfk == 424 || $item->objectdetailjenisprodukfk == 423
                    || $item->objectdetailjenisprodukfk == 422 || $item->objectdetailjenisprodukfk == 421 || $item->objectdetailjenisprodukfk == 420
                    || $item->objectdetailjenisprodukfk == 419 || $item->objectdetailjenisprodukfk == 418 || $item->objectdetailjenisprodukfk == 417
                    || $item->objectdetailjenisprodukfk == 416 || $item->objectdetailjenisprodukfk == 66
                ) {
                    $khusus = 0;
                    $besar = 0;
                    $sedang = 1;
                    $kecil = 0;
                    $lainnya = 0;
                } else if ($item->objectdetailjenisprodukfk == 60 || $item->objectdetailjenisprodukfk == 63 || $item->objectdetailjenisprodukfk == 142
                    || $item->objectdetailjenisprodukfk == 143 || $item->objectdetailjenisprodukfk == 6 || $item->objectdetailjenisprodukfk == 408
                    || $item->objectdetailjenisprodukfk == 409 || $item->objectdetailjenisprodukfk == 410 || $item->objectdetailjenisprodukfk == 415
                    || $item->objectdetailjenisprodukfk == 412 || $item->objectdetailjenisprodukfk == 414 || $item->objectdetailjenisprodukfk == 413
                    || $item->objectdetailjenisprodukfk == 411
                ) {
                    $khusus = 0;
                    $besar = 0;
                    $sedang = 0;
                    $kecil = 1;
                    $lainnya = 0;
                }
//                else{
//                    $lainnya=1;
//                }


                $data10[] = array(
//                    'produkfk' => $item->produkfk,
                    'spesialisasi' => $item->spesialisasi,
                    'jumlah' => 1,
                    'khusus' => $khusus,
                    'besar' => $besar,
                    'sedang' => $sedang,
                    'kecil' => $kecil,
//                    'lainnya' => $lainnya,
                );
            }

            foreach ($data10 as $key => $row) {
                $count[$key] = $row['jumlah'];
            }

            array_multisort($count, SORT_DESC, $data10);
        }
        $result = array(
            'data' => $data10,
            'message' => 'er@epic',

        );

        return $this->respond($result);
    }
    public function getLaporanRL37(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tglAwal = $request['tglAwal']; 
        $tglAkhir = $request['tglAkhir']; 

        $main = array("RADIODIAGNOSTIK", "Foto tanpa bahan kontras", "Foto dengan bahan kontras", "Foto dengan rol film", "Flouroskopi",
        "Foto Gigi :", "C.T. Scan :", "Lymphografi", "Angiograpi", "Lain-Lain", "RADIOTHERAPI", "Jumlah Kegiatan Radiotherapi", "Lain-Lain",
        "KEDOKTERAN NUKLIR", "Jumlah Kegiatan Diagnostik", "Jumlah Kegiatan Therapi", "Lain-Lain", "IMAGING/PENCITRAAN USG", "USG", "MRI", "Lain-lain", "TOTAL");

        $data10 = DB::select(DB::raw("SELECT ru.namaruangan, pr.namaproduk, sum(ppd.jumlah) as jumlah
            FROM
            pasiendaftar_t pd
            INNER JOIN antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
            INNER JOIN pasien_m ps on ps.id=pd.nocmfk
            inner join ruangan_m ru on ru.id = apd.objectruanganfk
            inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
            inner join pelayananpasiendetail_t ppd on ppd.pelayananpasien = pp.norec
            inner  join produk_m pr on pr.id=pp.produkfk
            WHERE pp.tglpelayanan BETWEEN '$tglAwal' and '$tglAkhir'
            and apd.kdprofile = 30
            and pd.kdprofile = 30
            and apd.statusenabled = true
            and pd.statusenabled=true
            and pp.isobat is null
            and ru.id = 576
            and pr.id not in (5008635, 5008644)
        group by ru.namaruangan, pr.namaproduk"));

        $jumlah = 0;
        foreach($main as $row){
            $jumlah = 0;
            
            if($row == 'Foto tanpa bahan kontras'){
                foreach($data10 as $data){
                    $jumlah += $data->jumlah;
                }
            }

            $datas[] = array(
                'namaruangan' => $row,
                'jumlahtotal' => $jumlah,
            );
        }

        $result = array(
            'data' => $datas,
            'message' => 'er@epic',

        );

        return $this->respond($result);
    }


    public function getPemeriksaanLab(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tglAwal = $request['tglAwal']; 
        $tglAkhir = $request['tglAkhir']; 

        $main = array('HEMATOLOGI', 'Sitologi Sel Darah', 'Eosinofil, hitung jumlah', 'Eritrosit, hitung jumlah', 'Leukosit, hitung jenis', 'Leukosit, hitung jumlah',
        'Limfosit plasma biru, hitung jumlah', 'Morfologi sel', 'Retikulosit, hitung jumlah', 'Trombosit, hitung jumlah', 'Sitokimia darah', 'Besi, pewarnaan', 'Neutrophil Alkaline Phosphatase/NAP, pewarnaan',
        'Nitroblue tetrazoleum, pewarnaan', 'Periodic Acid Schiff/PAS, pewarnaan', 'Peroksidase, pewarnaan', 'Sudan Black B, pewarnaan', 'Analisa Hb', 'Hemoglobin A2, penetapan kadar', 'Hemoglobin F, identifikasi',
        'Hemoglobin F, penetapan kadar', 'Perbankan Darah', "Coomb's, percob. direk, indirek", 'Penetapan gol darah A, B, O, Rh dll', 'Uji saring antibodi pada darah donor', 'Uji silang mayor/minor',
        'Hemostasis', 'Agregasi trombosit', 'Antitrombin III', 'Cryofibrinogen/cryoglobulin', 'D Dimer', 'Euglobulin Clotlysis', 'Faktor pembekuan V, VII, VIII, IX, X', 'Faktor pembekuan VIII, IX, X, penetapan kadar',
        'Faktor pembekuan XII, XIII, penetapan kadar', 'Fibrinogen Degradation Product/FDP', 'Fibrinogen, penetapan kadar', 'Pembekuan, masa', 'Pembendungan, percobaan', 'Perdarahan, masa', 'Plasminogen activator inhibitor -1/PAI-1',
        'Protein C', 'Protein S', 'Protrombin plasma, masa', 'Retraksi bekuan', 'Trombin, masa', 'Trombin, penetapan waktu seri', 'Tromboplastin, masa partial teraktivasi', 'Trombotest/Owren Test', 'Pemeriksaan lain',
        'Eritrosit, ketahanan osmotik', "Ham's test", 'Hematokrit, penetapan nilai', 'Hemoglobin Eritrosit Rata-rata/HER', 'Konsentrasi Hemoglobin Eritrosit Rata-rata/KHER', 'Laju endapan darah', 'Sel L.E.', 'Volume Eritrosit Rata-rata/VER',
        'KIMIA KLINIK', 'Protein dan NPN', 'Albumin', 'Amoniak', 'Asam urat', 'Bilirubin', 'Gamma globulin', 'Globulin', 'Haptoglobin', 'Kreatinin', 'Methemoglobin', 'Mikroalbumin', 'Myoglobin', 'Porfirin', 'Protein Bence Jones', 'Protein Elektroforesis',
        'Protein Esbach', 'Protein, penetapan kualitatif', 'Protein, penetapan semikuantitatif', 'Protein Total, penetapan kuantitatif', 'Urea/BUN', 'Urobilin', 'Urobilinogen', 'Karbohidrat', 'Amilum', 'Fruktosa', 'Galaktosa', 'Glukosa', 'Laktosa',
        'Lipid, Lipoprotein, Apoprotein', 'Apoprotein A/B', 'Fosfolipid/serebrosit/sfingolipid', 'Kolesterol High Density Lipoprotein (HDL)', 'Kolesterol Low Density Lipoprotein (LDL)', 'Kolesterol total', 'Lipid total', 'Lipoprotein (a) / Lp (a)',
        'Small Dense LDL', 'Trigliserida', 'Enzim', 'Alkali fosfatase', 'Aldolase/ALD', 'Amilase', 'Asam fosfatase', 'Cholinesterase', 'Creatinin, Kinase, MB Iso enzym', 'Creatinin, Phosphokinase CPK-NAC = Creatinin Kinas', 'Gamma GT/Glutamil Transferase',
        'Glutamat Lakto Dehidrogenase/GLDH', 'Glutamat Oksaloasetik Transaminase/GOT=Aspartat Am', 'Glutamat Piruvat Transaminase/GPT = Alanin Amino T', 'Hidroksi Butirik Dehidrogenase/HBDH', 'Isositrat Dehidrogenase/ICD', 'Laktat Dehidrogenase/LDH', 'Leucine Amino Peptidase/LAP',
        'Lipase', 'Mikronutrient dan Monitoring kadar terapi obat', 'Aminofilin/Teofilin', 'Asam folat', 'Besi, penetapan kadar', 'Besi - TIBC', 'Besi, unsaturated IBC', 'Digitoksin', 'Digoksin', 'Fenitoin', 'Fenobarbital', 'Ferritin', 'Iodium', 'Isoniazid',
        'Karbamazepin', 'Magnesium', 'Metotreksat', 'Propanolol', 'Seng', 'Siklosporin', 'Tembaga', 'Vitamin A', 'Vitamin B12', 'Elektrolit', 'Fosfat anorganik', 'Kalium', 'Kalsium', 'Klorida', 'Natrium', 'Magnesium', 'Fungsi Organ', 'Asam laktat', 'Creatinin clearance', 'Cystatin C',
        'Indeks ikterus', 'Insulin clearance', 'Insulin dalam plasma', 'Kalsium', 'Lemak, tes absorbsi', 'Urea clearance', 'Hormon dan Fungsi Endokrin', 'Adenocorticotropin Hormon/ACTH', 'Anti Diuretik Hormon/ADH Respon', 'Aldosteron', 'Calcitonin', 'C Peptide', 'Estrogen', 'Estradiol, 17 Beta',
        'Follicle Stimulating Hormon', 'Fruktosamin', 'Gastrin', 'Glucocorticoid', 'Growth Hormon', 'Hb glikosilat/HbA1c', 'Human Chorionic Gonadotropin/HCG', 'Insulin Growth Factor 1 / IGF1', 'Iodine uptake dan saturasi/T3 dan T4 uptake', 'Insulin', 'Keton', 'Kortisol', 'Luteinizing Hormon/LH', 
        'Pankreas, fungsi dengan tes triolen', 'Pregnandiol', 'Progesteron', 'Prolaktin', 'Renin', 'Testosteron', 'Thyroglobulin', 'Thyroxin dalam serum/T4', 'Thyrotropic Release Factor Assay', 'Thyroid Stimulating Hormon/TSH', 'Thyroid, tes fungsi yang lain', 'Vinyl Mandelic Acid/VMA', 'Pemeriksaan Lain',
        'Analisa batu', 'Analisa cairan otak', 'Analisa cairan sendi', 'Analisa cairan tubuh', 'Analisa sperma:volume, bau, warna, liquefaksi, vis', 'Analisa tinja: sel darah, lemak, sisa makanan', 'Hemosiderin', 'Homosistein', 'Oval fat bodies', 'Sel, hitung jenis', 'Sel, hitung jumlah', 'Tes kehamilan', 
        'Troponin T/I', 'Urinalisis', 'TOTAL');

        $data10 = DB::select(DB::raw("SELECT ru.namaruangan, pr.namaproduk, sum(ppd.jumlah) as jumlah
            FROM
            pasiendaftar_t pd
            INNER JOIN antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
            INNER JOIN pasien_m ps on ps.id=pd.nocmfk
            inner join ruangan_m ru on ru.id = apd.objectruanganfk
            inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
            inner join pelayananpasiendetail_t ppd on ppd.pelayananpasien = pp.norec
            inner  join produk_m pr on pr.id=pp.produkfk
            WHERE pp.tglpelayanan BETWEEN '$tglAwal' and '$tglAkhir'
            and apd.kdprofile = 30
            and pd.kdprofile = 30
            and apd.statusenabled = true
            and pd.statusenabled=true
            and pp.isobat is null
            and ru.id = 575
            and pr.id not in (5008635, 5008644)
        group by ru.namaruangan, pr.namaproduk"));

        $jumlah = 0;
        foreach($main as $row){
            $jumlah = 0;
            foreach($data10 as $data){
                if($row == 'Eosinofil, hitung jumlah' && ($data->namaproduk == 'Darah rutin 5 diff' || $data->namaproduk == 'Darah lengkap 5 diff + LED')){
                    $jumlah += $data->jumlah;
                } else if($row == 'Eritrosit, hitung jumlah' && ($data->namaproduk == 'Darah rutin 5 diff' || $data->namaproduk == 'Darah lengkap 5 diff + LED' || $data->namaproduk == 'Darah rutin 3 diff' || $data->namaproduk == 'Jumlah eritrosit')){
                    $jumlah += $data->jumlah;
                } else if($row == 'Leukosit, hitung jenis' && ($data->namaproduk == 'Darah rutin 5 diff' || $data->namaproduk == 'Darah lengkap 5 diff + LED' || $data->namaproduk == 'Darah rutin 3 diff' || $data->namaproduk == 'Hitung jenis lekosit')){
                    $jumlah += $data->jumlah;
                } else if($row == 'Leukosit, hitung jumlah' && ($data->namaproduk == 'Darah rutin 5 diff' || $data->namaproduk == 'Darah lengkap 5 diff + LED' || $data->namaproduk == 'Darah rutin 3 diff' || $data->namaproduk == 'Jumlah lekosit')){
                    $jumlah += $data->jumlah;
                } else if($row == 'Morfologi sel' && $data->namaproduk == 'Gambaran darah tepi'){
                    $jumlah += $data->jumlah;
                } else if($row == 'Retikulosit, hitung jumlah' && $data->namaproduk == 'Retikulosit'){
                    $jumlah += $data->jumlah;
                } else if($row == 'Trombosit, hitung jumlah' && ($data->namaproduk == 'Darah rutin 5 diff' || $data->namaproduk == 'Darah lengkap 5 diff + LED' || $data->namaproduk == 'Darah rutin 3 diff' || $data->namaproduk == 'Jumlah trombosit')){
                    $jumlah += $data->jumlah;
                } else if($row == 'Penetapan gol darah A, B, O, Rh dll' && $data->namaproduk == 'Golongan darah'){
                    $jumlah += $data->jumlah;
                } else if($row == 'D Dimer' && $data->namaproduk == 'D-DIMER'){
                    $jumlah += $data->jumlah;
                } else if($row == 'Pembekuan, masa' && $data->namaproduk == 'Waktu pembekuan'){
                    $jumlah += $data->jumlah;
                } else if($row == 'Perdarahan, masa' && $data->namaproduk == 'Waktu perdarahan'){
                    $jumlah += $data->jumlah;
                } else if($row == 'Hematokrit, penetapan nilai' && ($data->namaproduk == 'Darah rutin 5 diff' || $data->namaproduk == 'Darah lengkap 5 diff + LED' || $data->namaproduk == 'Darah rutin 3 diff' || $data->namaproduk == 'Hematokrit')){
                    $jumlah += $data->jumlah;
                } else if($row == 'Hemoglobin Eritrosit Rata-rata/HER' && ($data->namaproduk == 'Darah rutin 5 diff' || $data->namaproduk == 'Darah lengkap 5 diff + LED' || $data->namaproduk == 'Darah rutin 3 diff' || $data->namaproduk == 'Indeks eritrosit ( MCV / MCH / MCHC )')){
                    $jumlah += $data->jumlah;
                } else if($row == 'Konsentrasi Hemoglobin Eritrosit Rata-rata/KHER' && ($data->namaproduk == 'Darah rutin 5 diff' || $data->namaproduk == 'Darah lengkap 5 diff + LED' || $data->namaproduk == 'Darah rutin 3 diff' || $data->namaproduk == 'Indeks eritrosit ( MCV / MCH / MCHC )')){
                    $jumlah += $data->jumlah;
                } else if($row == 'Laju endapan darah' && ($data->namaproduk == 'Darah lengkap 5 diff + LED' || $data->namaproduk == 'Laju endap darah ( LED )')){
                    $jumlah += $data->jumlah;
                } else if($row == 'Volume Eritrosit Rata-rata/VER' && ($data->namaproduk == 'Darah rutin 5 diff' || $data->namaproduk == 'Darah lengkap 5 diff + LED' || $data->namaproduk == 'Darah rutin 3 diff' || $data->namaproduk == 'Indeks eritrosit ( MCV / MCH / MCHC )')){
                    $jumlah += $data->jumlah;
                } else if($row == 'Albumin' && $data->namaproduk == 'Albumin'){
                    $jumlah += $data->jumlah;
                } else if($row == 'Asam urat' && $data->namaproduk == 'Asam urat'){
                    $jumlah += $data->jumlah;
                } else if($row == 'Bilirubin' && ($data->namaproduk == 'Bilirubin total' || $data->namaproduk == 'Bilirubin direk' || $data->namaproduk == 'Bilirubin Indirect')){
                    $jumlah += $data->jumlah;
                } else if($row == 'Globulin' && $data->namaproduk == 'Globulin'){
                    $jumlah += $data->jumlah;
                } else if($row == 'Kreatinin' && $data->namaproduk == 'Kreatinin'){
                    $jumlah += $data->jumlah;
                } else if($row == 'Protein Total, penetapan kuantitatif' && $data->namaproduk == 'Protein total'){
                    $jumlah += $data->jumlah;
                } else if($row == 'Urea/BUN' && $data->namaproduk == 'Ureum'){
                    $jumlah += $data->jumlah;
                } else if($row == 'Urobilin' && ($data->namaproduk == 'Bilirubin Urin' || $data->namaproduk == 'Urin rutin / lengkap' || $data->namaproduk == 'Urine rutin' || $data->namaproduk == 'Protein Urin')){
                    $jumlah += $data->jumlah;
                } else if($row == 'Urobilinogen' && ($data->namaproduk == 'Bilirubin Urin' || $data->namaproduk == 'Urin rutin / lengkap' || $data->namaproduk == 'Urine rutin' || $data->namaproduk == 'Protein Urin')){
                    $jumlah += $data->jumlah;
                } else if($row == 'Glukosa' && ($data->namaproduk == 'Gula darah puasa' || $data->namaproduk == 'Gula darah 2 jam' || $data->namaproduk == 'Gula darah sewaktu' || $data->namaproduk == 'Gula darah ( 1x pemeriksaan )' || $data->namaproduk == 'Glukosa POCT')){
                    $jumlah += $data->jumlah;
                } else if($row == 'Kolesterol High Density Lipoprotein (HDL)' && $data->namaproduk == 'HDL'){
                    $jumlah += $data->jumlah;
                } else if($row == 'Kolesterol Low Density Lipoprotein (LDL)' && ($data->namaproduk == 'LDL ( indirect )' || $data->namaproduk == 'LDL ( direct )')){
                    $jumlah += $data->jumlah;
                } else if($row == 'Kolesterol total' && $data->namaproduk == 'Cholesterol total'){
                    $jumlah += $data->jumlah;
                } else if($row == 'Trigliserida' && $data->namaproduk == 'Trigliserida'){
                    $jumlah += $data->jumlah;
                } else if($row == 'Creatinin, Kinase, MB Iso enzym' && $data->namaproduk == 'CKMB / Creatinin Kinase Myocardial Band'){
                    $jumlah += $data->jumlah;
                } else if($row == 'Gamma GT/Glutamil Transferase' && $data->namaproduk == 'Gama GT'){
                    $jumlah += $data->jumlah;
                } else if($row == 'Glutamat Oksaloasetik Transaminase/GOT=Aspartat Am' && $data->namaproduk == 'SGOT'){
                    $jumlah += $data->jumlah;
                } else if($row == 'Glutamat Piruvat Transaminase/GPT = Alanin Amino T' && $data->namaproduk == 'SGPT'){
                    $jumlah += $data->jumlah;
                } else if($row == 'Besi, penetapan kadar' && $data->namaproduk == 'Fe / besi serum'){
                    $jumlah += $data->jumlah;
                } else if($row == 'Ferritin' && $data->namaproduk == 'Ferritin'){
                    $jumlah += $data->jumlah;
                } else if($row == 'Kalium' && $data->namaproduk == 'Panel Elektrolit ( Na , K , Cl )'){
                    $jumlah += $data->jumlah;
                } else if($row == 'Klorida' && $data->namaproduk == 'Panel Elektrolit ( Na , K , Cl )'){
                    $jumlah += $data->jumlah;
                } else if($row == 'Natrium' && $data->namaproduk == 'Panel Elektrolit ( Na , K , Cl )'){
                    $jumlah += $data->jumlah;
                } else if($row == 'Hb glikosilat/HbA1c' && $data->namaproduk == 'HbA1c'){
                    $jumlah += $data->jumlah;
                } else if($row == 'Iodine uptake dan saturasi/T3 dan T4 uptake' && ($data->namaproduk == 'T4' || $data->namaproduk == 'T3')){
                    $jumlah += $data->jumlah;
                } else if($row == 'Thyroxin dalam serum/T4' && $data->namaproduk == 'T4'){
                    $jumlah += $data->jumlah;
                } else if($row == 'Thyroid Stimulating Hormon/TSH' && $data->namaproduk == 'TSH ( thyroid stimulating hormone )'){
                    $jumlah += $data->jumlah;
                } else if($row == 'Thyroid, tes fungsi yang lain' && ($data->namaproduk == 'FT4' || $data->namaproduk == 'FT3')){
                    $jumlah += $data->jumlah;
                } else if($row == 'Analisa tinja: sel darah, lemak, sisa makanan' && $data->namaproduk == 'Faeces rutin'){
                    $jumlah += $data->jumlah;
                } else if($row == 'Tes kehamilan' && $data->namaproduk == 'Tes Kehamilan'){
                    $jumlah += $data->jumlah;
                } else if($row == 'Troponin T/I' && $data->namaproduk == 'TROPONIN'){
                    $jumlah += $data->jumlah;
                } else if($row == 'Urinalisis' && ($data->namaproduk == 'Bilirubin Urin' || $data->namaproduk == 'Urin rutin / lengkap' || $data->namaproduk == 'Urine rutin' || $data->namaproduk == 'Protein Urin')){
                    $jumlah += $data->jumlah;
                }
            }

            $datas[] = array(
                'namaruangan' => $row,
                'jumlahtotal' => $jumlah,
            );
        }

        $result = array(
            'data' => $datas,
            'message' => 'as@cepot',
        );
        return $this->respond($result);
    }
    public function getPelayananRehab(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tglAwal = $request['tglAwal']; 
        $tglAkhir = $request['tglAkhir']; 
        $i = 0;

        $main = array('Medis', 'Gait Analyzer', 'EMG', 'Uro Dinamic', 'Side Back', 'E N Tree', 'Spyrometer',
        'Staic Bike', 'Tread Mill', 'Body Platysmograf', 'lain-lain', 'Fisioterapi', 'Latihan Fisik', 'Aktinoterapi', 'Elektroterapi', 
        'Hidroterapi', 'Traksi Lumbal & Cervical', 'Lain-lain', 'Okupasiterapi', 'Snoosien Room', 'Sensori Integrasi', 'Latihan aktivitas kehidupan sehari-hari',
        'Proper Body Mekanik', 'Pembuatan Alat Lontar & Adaptasi Alat', 'Analisa Persiapan Kerja', 'Latihan Relaksasi', 'Analisa & Intervensi, Persepsi, Kognitif, Psikomot',
        'Lain-lain', 'Terapi Wicara', 'Fungsi Bicara', 'Fungsi Bahasa / Laku', 'Fungsi Menelan', 'Lain-lain', 'Psikologi', 'Psikolog Anak', 'Psikolog Dewasa', 'Lain-lain', 'Sosial Medis',
        'Evaluasi Lingkungan Rumah', 'Evaluasi Ekonomi', 'Evaluasi Pekerjaan', 'Lain-lain', 'Ortotik Prostetik', 'Pembuatan Alat Bantu', 'Pembuatan Alat Anggota Tiruan', 'Lain-Lain', 'Kunjungan Rumah', 'Total');

        $data10 = DB::select(DB::raw("SELECT ru.namaruangan, pr.namaproduk, sum(ppd.jumlah) as jumlah
                FROM
                pasiendaftar_t pd
                INNER JOIN antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                INNER JOIN pasien_m ps on ps.id=pd.nocmfk
                inner join ruangan_m ru on ru.id = apd.objectruanganfk
                inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
                inner join pelayananpasiendetail_t ppd on ppd.pelayananpasien = pp.norec
                inner  join produk_m pr on pr.id=pp.produkfk
                WHERE pp.tglpelayanan BETWEEN '$tglAwal' and '$tglAkhir'
                and apd.kdprofile = 30
                and pd.kdprofile = 30
                and apd.statusenabled = true
                and pd.statusenabled=true
                and pp.isobat is null
                and ru.id = 786
                and pr.id not in (5008635, 5008644)
                group by ru.namaruangan, pr.namaproduk

        union all

                SELECT ru.namaruangan, pr.namaproduk, sum(ppd.jumlah) as jumlah
                FROM
                pasiendaftar_t pd
                INNER JOIN antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                INNER JOIN pasien_m ps on ps.id=pd.nocmfk
                inner join ruangan_m ru on ru.id = apd.objectruanganfk
                inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
                inner join pelayananpasiendetail_t ppd on ppd.pelayananpasien = pp.norec
                inner  join produk_m pr on pr.id=pp.produkfk
                WHERE pp.tglpelayanan BETWEEN '$tglAwal' and '$tglAkhir'
                and apd.kdprofile = 30
                and pd.kdprofile = 30
                and apd.statusenabled = true
                and pd.statusenabled=true
                and pp.isobat is null
                and ru.id = 762
                and pr.id not in (5008635, 5008644)
        group by ru.namaruangan, pr.namaproduk

        union ALL


            SELECT ru.namaruangan, pr.namaproduk, sum(ppd.jumlah) as jumlah
                FROM
                pasiendaftar_t pd
                INNER JOIN antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                INNER JOIN pasien_m ps on ps.id=pd.nocmfk
                inner join ruangan_m ru on ru.id = apd.objectruanganfk
                inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
                inner join pelayananpasiendetail_t ppd on ppd.pelayananpasien = pp.norec
                inner  join produk_m pr on pr.id=pp.produkfk
                WHERE pp.tglpelayanan BETWEEN '$tglAwal' and '$tglAkhir'
                and apd.kdprofile = 30
                and pd.kdprofile = 30
                and apd.statusenabled = true
                and pd.statusenabled=true
                and pp.isobat is null
                and ru.id = 774
                and pr.id not in (5008635, 5008644)
        group by ru.namaruangan, pr.namaproduk

        union ALL

        SELECT ru.namaruangan, pr.namaproduk, sum(ppd.jumlah) as jumlah
                FROM
                pasiendaftar_t pd
                INNER JOIN antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                INNER JOIN pasien_m ps on ps.id=pd.nocmfk
                inner join ruangan_m ru on ru.id = apd.objectruanganfk
                inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
                inner join pelayananpasiendetail_t ppd on ppd.pelayananpasien = pp.norec
                inner  join produk_m pr on pr.id=pp.produkfk
                WHERE pp.tglpelayanan BETWEEN '$tglAwal' and '$tglAkhir'
                and apd.kdprofile = 30
                and pd.kdprofile = 30
                and apd.statusenabled = true
                and pd.statusenabled=true
                and pp.isobat is null
                and ru.id = 777
                and pr.id not in (5008635, 5008644)
        group by ru.namaruangan, pr.namaproduk"));

        $jumlah = 0;
        foreach($main as $row){
            $jumlah = 0;
            foreach($data10 as $data){
                if($row == 'lain-lain' && $i == 10 && ($data->namaproduk == 'Biaya kunjungan & konsul klinik spesialis' || $data->namaproduk == 'Casting' || $data->namaproduk == 'Dry needing' || $data->namaproduk == 'High level laser therapy' || $data->namaproduk == 'Injeksi botulinum toksin A ( tiap titik )' || $data->namaproduk == 'Injeksi guided USG' || $data->namaproduk == 'Injeksi intraartikular / joint / tendon / soft tissue' || $data->namaproduk == 'Injeksi Intramuskuler' || $data->namaproduk == 'Low level laser therapy' || $data->namaproduk == 'Spray and stretch' || $data->namaproduk == 'Uji kardiorespirasi ( 6m walk , step test )')){
                    $jumlah += $data->jumlah;
                }

                else if($row == 'E M G' && ($data->namaproduk == 'EMG needle ( belum termasuk needle , diresepkan tersendiri )' || $data->namaproduk == 'EMG Surface / NCV test / spasmofili test')){
                    $jumlah += $data->jumlah;
                }

                else if($row == 'Tread Mill' && $data->namaproduk == 'Treadmill testing / uji kebugaran / exercise testing'){
                    $jumlah += $data->jumlah;
                }

                else if($row == 'Latihan Fisik' && ($data->namaproduk == 'Exercise A ( ringan ) dengan alat Shoulder wheel / finger wall' || $data->namaproduk == 'Exercise A ( ringan ) tanpa alat 15 menit' || $data->namaproduk == 'Exercise B ( sedang ) dengan alat pararel bar / static bycycle' || $data->namaproduk == 'Exercise B ( sedang ) tanpa alat 20 menit' || $data->namaproduk == 'Exercise C ( berat ) dengan alat yaitu ulley / latihan jalan menggunakan alat bantu / peralatan di tumbuh kembang anak' || $data->namaproduk == 'Exercise C ( berat ) tanpa alat 30 menit' || $data->namaproduk == 'Exercise Khusus')){
                    $jumlah += $data->jumlah;
                }

                else if($row == 'Aktinoterapi' && ($data->namaproduk == 'Diatermi / SWD ( Soft Wafe Diathermi )' || $data->namaproduk == 'Infra Red ( IR )' || $data->namaproduk == 'MWD ( Mikowave Diathermi )' || $data->namaproduk == 'Parafin Bath')){
                    $jumlah += $data->jumlah;
                }

                else if($row == 'Elektroterapi' && ($data->namaproduk == 'Biofeedback' || $data->namaproduk == 'Faradisasi' || $data->namaproduk == 'Interferensi' || $data->namaproduk == 'TENS ( Transcutaneus Electrial Nerve Stimulation )' || $data->namaproduk == 'US ( Ultrasound Therapy )')){
                    $jumlah += $data->jumlah;
                }

                else if($row == 'Sensori Integrasi' && $data->namaproduk == 'Terapi sensori integrasi'){
                    $jumlah += $data->jumlah;
                }

                else if($row == 'Latihan aktivitas kehidupan sehari-hari' && $data->namaproduk == 'Terapi Activity Daily Living ( ADL ) rawat jalan'){
                    $jumlah += $data->jumlah;
                }

                else if($row == 'Proper Body Mekanik' && $data->namaproduk == 'Proper Body mechanic ( PBM )'){
                    $jumlah += $data->jumlah;
                }

                else if($row == 'Analisa & Intervensi, Persepsi, Kognitif, Psikomot' && ($data->namaproduk == 'Latihan akademik / pre akademik' || $data->namaproduk == 'Latihan Koordinasi dan Motorik' || $data->namaproduk == 'Terapi perilaku / bermain / leisure')){
                    $jumlah += $data->jumlah;
                }

                else if($row == 'Lain-lain' && $i == 27 && $data->namaproduk == 'Assesment Okupasi Terapi'){
                    $jumlah += $data->jumlah;
                }

                else if($row == 'Fungsi Bicara' && ($data->namaproduk == 'Latihan Artikulasi' || $data->namaproduk == 'Latihan Irama Kelancaran')){
                    $jumlah += $data->jumlah;
                }

                else if($row == 'Fungsi Bahasa / Laku' && ($data->namaproduk == 'Latihan Bahasa Ekspresif' || $data->namaproduk == 'Latihan Bahasa Reseptif')){
                    $jumlah += $data->jumlah;
                }

                else if($row == 'Lain-lain' && $i == 32 && ($data->namaproduk == 'Assesment Terapi Wicara' || $data->namaproduk == 'Latihan Oral Motor ( Terpapar Infeksi lebih tinggi )')){
                    $jumlah += $data->jumlah;
                }
            }

            $datas[] = array(
                'namaruangan' => $row,
                'jumlahtotal' => $jumlah,
            );

            $i++;
        }

        $result = array(
            'data' => $datas,
            'message' => 'as@cepot',
        );
        return $this->respond($result);
    }
    public function getLaporanRL310Khusus(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tglAwal = $request['tglAwal']; 
        $tglAkhir = $request['tglAkhir']; 

        $data10 = DB::select(DB::raw("SELECT namaruangan, 'TOTAL' as namaproduk, sum(jumlah) as jumlah from(
            SELECT ru.namaruangan, pr.namaproduk, sum(ppd.jumlah) as jumlah
                    FROM
                    pasiendaftar_t pd
                    INNER JOIN antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                    INNER JOIN pasien_m ps on ps.id=pd.nocmfk
                    inner join ruangan_m ru on ru.id = apd.objectruanganfk
                    inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
                    inner join pelayananpasiendetail_t ppd on ppd.pelayananpasien = pp.norec
                    inner  join produk_m pr on pr.id=pp.produkfk
                    WHERE pp.tglpelayanan BETWEEN '$tglAwal' and '$tglAkhir'
                    and apd.kdprofile = 30
                    and pd.kdprofile = 30
                    and apd.statusenabled = true
                    and pd.statusenabled=true
                    and pp.isobat is null
                    and ru.id = 776
                    and pr.id not in (5008635, 5008644)
                group by ru.namaruangan, pr.namaproduk
            ) as i group by namaruangan

            union ALL

            SELECT ' ' namaruangan, pr.namaproduk, sum(ppd.jumlah) as jumlah
                                FROM
                                pasiendaftar_t pd
                                INNER JOIN antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                                INNER JOIN pasien_m ps on ps.id=pd.nocmfk
                                inner join ruangan_m ru on ru.id = apd.objectruanganfk
                                inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
                                inner join pelayananpasiendetail_t ppd on ppd.pelayananpasien = pp.norec
                                inner  join produk_m pr on pr.id=pp.produkfk
                                WHERE pp.tglpelayanan BETWEEN '$tglAwal' and '$tglAkhir'
                                and apd.kdprofile = 30
                                and pd.kdprofile = 30
                                and apd.statusenabled = true
                                and pd.statusenabled=true
                                and pp.isobat is null
                                and ru.id = 776
                                and pr.id not in (5008635, 5008644)
                group by ru.namaruangan, pr.namaproduk

            union all


            SELECT ru.namaruangan, 'TOTAL' as namaproduk, sum(ppd.jumlah) as jumlah
                                FROM
                                pasiendaftar_t pd
                                INNER JOIN antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                                INNER JOIN pasien_m ps on ps.id=pd.nocmfk
                                inner join ruangan_m ru on ru.id = apd.objectruanganfk
                                inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
                                inner join pelayananpasiendetail_t ppd on ppd.pelayananpasien = pp.norec
                                inner  join produk_m pr on pr.id=pp.produkfk
                                WHERE pp.tglpelayanan BETWEEN '$tglAwal' and '$tglAkhir'
                                and apd.kdprofile = 30
                                and pd.kdprofile = 30
                                and apd.statusenabled = true
                                and pd.statusenabled=true
                                and pp.isobat is null
                                and ru.id = 768
                                and pr.id not in (5008635, 5008644)
                group by ru.namaruangan
            union ALL

            SELECT ' ' namaruangan, pr.namaproduk, sum(ppd.jumlah) as jumlah
                                FROM
                                pasiendaftar_t pd
                                INNER JOIN antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                                INNER JOIN pasien_m ps on ps.id=pd.nocmfk
                                inner join ruangan_m ru on ru.id = apd.objectruanganfk
                                inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
                                inner join pelayananpasiendetail_t ppd on ppd.pelayananpasien = pp.norec
                                inner  join produk_m pr on pr.id=pp.produkfk
                                WHERE pp.tglpelayanan BETWEEN '$tglAwal' and '$tglAkhir'
                                and apd.kdprofile = 30
                                and pd.kdprofile = 30
                                and apd.statusenabled = true
                                and pd.statusenabled=true
                                and pp.isobat is null
                                and ru.id = 768
                                and pr.id not in (5008635, 5008644)
                group by ru.namaruangan, pr.namaproduk

            union all


                        SELECT  'Psikologi / Psikometri' as namaruangan, 'TOTAL' as namaproduk, sum(ppd.jumlah) as jumlah
                                FROM
                                pasiendaftar_t pd
                                INNER JOIN antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                                INNER JOIN pasien_m ps on ps.id=pd.nocmfk
                                inner join ruangan_m ru on ru.id = apd.objectruanganfk
                                inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
                                inner join pelayananpasiendetail_t ppd on ppd.pelayananpasien = pp.norec
                                inner  join produk_m pr on pr.id=pp.produkfk
                                WHERE pp.tglpelayanan BETWEEN '$tglAwal' and '$tglAkhir'
                                and apd.kdprofile = 30
                                and pd.kdprofile = 30
                                and apd.statusenabled = true
                                and pd.statusenabled=true
                                and pp.isobat is null
                                and ru.id in (791, 767, 807)
                                and pr.id not in (5008635, 5008644)
            union ALL

            SELECT ' ' namaruangan, pr.namaproduk, sum(ppd.jumlah) as jumlah
                                FROM
                                pasiendaftar_t pd
                                INNER JOIN antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                                INNER JOIN pasien_m ps on ps.id=pd.nocmfk
                                inner join ruangan_m ru on ru.id = apd.objectruanganfk
                                inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
                                inner join pelayananpasiendetail_t ppd on ppd.pelayananpasien = pp.norec
                                inner  join produk_m pr on pr.id=pp.produkfk
                                WHERE pp.tglpelayanan BETWEEN '$tglAwal' and '$tglAkhir'
                                and apd.kdprofile = 30
                                and pd.kdprofile = 30
                                and apd.statusenabled = true
                                and pd.statusenabled=true
                                and pp.isobat is null
                                and ru.id in (791, 767, 807)
                                and pr.id not in (5008635, 5008644)
                group by ru.namaruangan, pr.namaproduk"));

        $result = array(
            'data' => $data10,
            'message' => 'as@cepot',
        );
        return $this->respond($result);
    }
    public function getLaporanRL311KesehatanJiwa(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tglAwal = $request['tglAwal']; 
        $tglAkhir = $request['tglAkhir']; 
        
        $data10 = DB::select(DB::raw("SELECT namaruangan, 'TOTAL' as namaproduk, sum(jumlah) as jumlah from(
            SELECT ru.namaruangan, pr.namaproduk, sum(ppd.jumlah) as jumlah
                    FROM
                    pasiendaftar_t pd
                    INNER JOIN antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                    INNER JOIN pasien_m ps on ps.id=pd.nocmfk
                    inner join ruangan_m ru on ru.id = apd.objectruanganfk
                    inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
                    inner join pelayananpasiendetail_t ppd on ppd.pelayananpasien = pp.norec
                    inner  join produk_m pr on pr.id=pp.produkfk
                    WHERE pp.tglpelayanan BETWEEN '$tglAwal' and '$tglAkhir'
                    and apd.kdprofile = 30
                    and pd.kdprofile = 30
                    and apd.statusenabled = true
                    and pd.statusenabled=true
                    and pp.isobat is null
                    and ru.id = 782
                    and pr.id not in (5008635, 5008644)
                group by ru.namaruangan, pr.namaproduk
            ) as i group by namaruangan

            union ALL

            SELECT ' ' namaruangan, pr.namaproduk, sum(ppd.jumlah) as jumlah
                                FROM
                                pasiendaftar_t pd
                                INNER JOIN antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                                INNER JOIN pasien_m ps on ps.id=pd.nocmfk
                                inner join ruangan_m ru on ru.id = apd.objectruanganfk
                                inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
                                inner join pelayananpasiendetail_t ppd on ppd.pelayananpasien = pp.norec
                                inner  join produk_m pr on pr.id=pp.produkfk
                                WHERE pp.tglpelayanan BETWEEN '$tglAwal' and '$tglAkhir'
                                and apd.kdprofile = 30
                                and pd.kdprofile = 30
                                and apd.statusenabled = true
                                and pd.statusenabled=true
                                and pp.isobat is null
                                and ru.id = 782
                                and pr.id not in (5008635, 5008644)
                group by ru.namaruangan, pr.namaproduk

            union all


            SELECT ru.namaruangan, 'TOTAL' as namaproduk, sum(ppd.jumlah) as jumlah
                                FROM
                                pasiendaftar_t pd
                                INNER JOIN antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                                INNER JOIN pasien_m ps on ps.id=pd.nocmfk
                                inner join ruangan_m ru on ru.id = apd.objectruanganfk
                                inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
                                inner join pelayananpasiendetail_t ppd on ppd.pelayananpasien = pp.norec
                                inner  join produk_m pr on pr.id=pp.produkfk
                                WHERE pp.tglpelayanan BETWEEN '$tglAwal' and '$tglAkhir'
                                and apd.kdprofile = 30
                                and pd.kdprofile = 30
                                and apd.statusenabled = true
                                and pd.statusenabled=true
                                and pp.isobat is null
                                and ru.id = 752
                                and pr.id not in (5008635, 5008644)
                group by ru.namaruangan
            union ALL

            SELECT ' ' namaruangan, pr.namaproduk, sum(ppd.jumlah) as jumlah
                                FROM
                                pasiendaftar_t pd
                                INNER JOIN antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                                INNER JOIN pasien_m ps on ps.id=pd.nocmfk
                                inner join ruangan_m ru on ru.id = apd.objectruanganfk
                                inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
                                inner join pelayananpasiendetail_t ppd on ppd.pelayananpasien = pp.norec
                                inner  join produk_m pr on pr.id=pp.produkfk
                                WHERE pp.tglpelayanan BETWEEN '$tglAwal' and '$tglAkhir'
                                and apd.kdprofile = 30
                                and pd.kdprofile = 30
                                and apd.statusenabled = true
                                and pd.statusenabled=true
                                and pp.isobat is null
                                and ru.id = 752
                                and pr.id not in (5008635, 5008644)
                group by ru.namaruangan, pr.namaproduk

                        union all

                        SELECT ru.namaruangan, 'TOTAL' as namaproduk, sum(ppd.jumlah) as jumlah
                                            FROM
                                            pasiendaftar_t pd
                                            INNER JOIN antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                                            INNER JOIN pasien_m ps on ps.id=pd.nocmfk
                                            inner join ruangan_m ru on ru.id = apd.objectruanganfk
                                            inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
                                            inner join pelayananpasiendetail_t ppd on ppd.pelayananpasien = pp.norec
                                            inner  join produk_m pr on pr.id=pp.produkfk
                                            WHERE pp.tglpelayanan BETWEEN '$tglAwal' and '$tglAkhir'
                                            and apd.kdprofile = 30
                                            and pd.kdprofile = 30
                                            and apd.statusenabled = true
                                            and pd.statusenabled=true
                                            and pp.isobat is null
                                            and ru.id = 785
                                            and pr.id not in (5008635, 5008644)
                            group by ru.namaruangan
                        union ALL

                        SELECT ' ' namaruangan, pr.namaproduk, sum(ppd.jumlah) as jumlah
                                            FROM
                                            pasiendaftar_t pd
                                            INNER JOIN antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                                            INNER JOIN pasien_m ps on ps.id=pd.nocmfk
                                            inner join ruangan_m ru on ru.id = apd.objectruanganfk
                                            inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
                                            inner join pelayananpasiendetail_t ppd on ppd.pelayananpasien = pp.norec
                                            inner  join produk_m pr on pr.id=pp.produkfk
                                            WHERE pp.tglpelayanan BETWEEN '$tglAwal' and '$tglAkhir'
                                            and apd.kdprofile = 30
                                            and pd.kdprofile = 30
                                            and apd.statusenabled = true
                                            and pd.statusenabled=true
                                            and pp.isobat is null
                                            and ru.id = 785
                                            and pr.id not in (5008635, 5008644)
                            group by ru.namaruangan, pr.namaproduk

                        union all


                        SELECT ru.namaruangan, 'TOTAL' as namaproduk, sum(ppd.jumlah) as jumlah
                                FROM
                                pasiendaftar_t pd
                                INNER JOIN antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                                INNER JOIN pasien_m ps on ps.id=pd.nocmfk
                                inner join ruangan_m ru on ru.id = apd.objectruanganfk
                                inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
                                inner join pelayananpasiendetail_t ppd on ppd.pelayananpasien = pp.norec
                                inner  join produk_m pr on pr.id=pp.produkfk
                                WHERE pp.tglpelayanan BETWEEN '$tglAwal' and '$tglAkhir'
                                and apd.kdprofile = 30
                                and pd.kdprofile = 30
                                and apd.statusenabled = true
                                and pd.statusenabled=true
                                and pp.isobat is null
                                and ru.id = 765
                                and pr.id not in (5008635, 5008644)
                group by ru.namaruangan
            union ALL

            SELECT ' ' namaruangan, pr.namaproduk, sum(ppd.jumlah) as jumlah
                                FROM
                                pasiendaftar_t pd
                                INNER JOIN antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                                INNER JOIN pasien_m ps on ps.id=pd.nocmfk
                                inner join ruangan_m ru on ru.id = apd.objectruanganfk
                                inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
                                inner join pelayananpasiendetail_t ppd on ppd.pelayananpasien = pp.norec
                                inner  join produk_m pr on pr.id=pp.produkfk
                                WHERE pp.tglpelayanan BETWEEN '$tglAwal' and '$tglAkhir'
                                and apd.kdprofile = 30
                                and pd.kdprofile = 30
                                and apd.statusenabled = true
                                and pd.statusenabled=true
                                and pp.isobat is null
                                and ru.id = 765
                                and pr.id not in (5008635, 5008644)
                group by ru.namaruangan, pr.namaproduk"));

        $result = array(
            'data' => $data10,
            'message' => 'as@cepot',
        );
        return $this->respond($result);
    }
    public function getLaporanRL312KeluargaBerencana(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $KdJenisLapKB = (int) $this->settingDataFixed('KdJenisLapKB', $kdProfile);
        //#WIth Mapp
        $data = \DB::table('pasiendaftar_t as pd')
            ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '= ', 'apd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('departemen_m as dpm', 'dpm.id', '=', 'ru.objectdepartemenfk')
            ->join('produk_m as prd', 'prd.id', '=', 'pp.produkfk')
            ->join('mapproduktolaporanrl_m as mprl','mprl.produkfk','=','pp.produkfk')
            ->join('jenislaporan_m as jl','jl.id','=','mprl.objectjenislaporanfk')
            ->join('kelompoklaporan_m as kl','kl.id','=','mprl.objectkontenlaporanfk')
            ->select(
//                'prd.namaproduk',
                'kl.kelompoklaporan as namaproduk',
                DB::raw('
                 COUNT(prd.namaproduk) as jmltindakan')
            )
            ->groupBy('kl.kelompoklaporan')
            ->where('pd.kdprofile', $KdJenisLapKB)
            ->where('jl.id',$KdJenisLapKB);


        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pp.tglpelayanan', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];
            $data = $data->where('pp.tglpelayanan', '<=', $tgl);
        }

        $data = $data->get();

        $result = array(
            'data' => $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }
    public function getPengadaanObat(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $KdJenisLapFarmasi = (int) $this->settingDataFixed('KdJenisLapFarmasi', $kdProfile);
//        $dataLogin = $request->all();
//
//        $data = \DB::table('produk_m as prd')
//            ->join('stokprodukdetail_t as spd','spd.objectprodukfk','=','prd.id')
//            ->join('ruangan_m as ru','ru.id','=','spd.objectruanganfk')
//            ->join('departemen_m as dpm','dpm.id','=','ru.objectdepartemenfk')
//
//            ->select('prd.namaproduk', 'spd.qtyproduk','spd.objectruanganfk','ru.namaruangan','ru.objectdepartemenfk',
//                'prd.id as idproduk', 'prd.isgeneric', 'spd.tglpelayanan',
//
////            case when prd.isgeneric = true then 'Obat Generik(Formularium + Non Formularium)'
//                DB::raw('(case when prd.objectstatusprodukfk = 1 and prd.isgeneric =\'f\' THEN \'Obat Non Generik Non Formularium\'
//                          when prd.objectstatusprodukfk = 2 and prd.isgeneric =\'f\' THEN \'Obat Non Generik Formularium\'
//                          else \'Obat Generik(Formularium + Non Formularium)\' end) as detailobat'
//                )
//            )
//
//            ->where('prd.objectdetailjenisprodukfk', 474);
//
//        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
//            $data = $data->where('spd.tglpelayanan', '>=', $request['tglAwal']);
//        }
//        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
//            $tgl = $request['tglAkhir'];
//            $data = $data->where('spd.tglpelayanan', '<=', $tgl);
//        }
//        $data = $data->get();
//
//        $data10 = [];
//        $jml = 0;
//        $sama = false;
//
//        $JmlGenerik = 0;
//        $stokFormula = 0;
//        $stokObat =0;
//
//        foreach ($data as $item) {
//            $sama = false;
//            $i = 0;
//            foreach ($data10 as $hideung) {
//                if ($item->detailobat == $data10[$i]['detailobat']) {
//                    $sama = true;
//                    $jml = (float)$hideung['jumlah'] + 1;
//                    $data10[$i]['jumlah'] = $jml;
//
//                    if ($item->isgeneric == true)
//                    {
//                        $data10[$i]['JmlGeneric'] = (float)$hideung['JmlGeneric'] + 1;
//                    }
//                    $data10[$i]['Total'] = (float)$hideung['Total'] + 1;
//                    $data10[$i]['Totalitem'] = (float)$hideung['Total'] + $data10[$i]['JmlGeneric'];
//
//                }
//                $i = $i + 1;
//            }
//
//            if ($sama == false) {
//
//                if ($item->isgeneric == true)
//                {
//                    $JmlGenerik = 1;
//                    $stokFormula = 0;
//                    $stokObat =0;
//                }
//
//                $data10[] = array(
//                    'detailobat' => $item->detailobat,
//                    'Total' => 1,
//                    'JmlGeneric' => $JmlGenerik,
//                    'Totalitem' => 1 + $JmlGenerik,
//                    'jumlah' => 1,
//                );
//            }
//
//            foreach ($data10 as $key => $row) {
//                $count[$key] = $row['jumlah'];
//            }
//
//            array_multisort($count, SORT_DESC, $data10);
//        }
//
//        $result = array(
//            'data' => $data10,
//            'message' => 'as@cepot',
//        );
//        return $this->respond($result);


//    #with Mapping
        $data = \DB::table('produk_m as prd')
            ->join('stokprodukdetail_t as spd','spd.objectprodukfk','=','prd.id')
            ->join('mapproduktolaporanrl_m as mprl','mprl.produkfk','=','spd.objectprodukfk')
            ->join('jenislaporan_m as jl','jl.id','=','mprl.objectjenislaporanfk')
            ->join('kelompoklaporan_m as kl','kl.id','=','mprl.objectkontenlaporanfk')
            ->join('ruangan_m as ru','ru.id','=','spd.objectruanganfk')
            ->join('departemen_m as dpm','dpm.id','=','ru.objectdepartemenfk')
            ->select('prd.namaproduk',
                'kl.kelompoklaporan as detailobat',
                DB::raw('count(prd.id) as jumlahitem,sum(spd.qtyproduk) as jumlahtersedia'))
            ->groupBy('prd.namaproduk','prd.id','kl.kelompoklaporan')
            ->where('prd.kdprofile', $kdProfile)
            ->where('jl.id', $KdJenisLapFarmasi);

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('spd.tglpelayanan', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];
            $data = $data->where('spd.tglpelayanan', '<=', $tgl);
        }
        $data = $data->get();

        $data10 = [];
        foreach ($data as $item) {
            $sama = false;
            $i = 0;
            foreach ($data10 as $hideung) {
                if ($item->detailobat == $data10[$i]['detailobat']) {
                    $sama = true;
                    $jml = (float)$hideung['jumlah'] + 1;
                    $data10[$i]['jumlah'] = $jml;
                }
                $i = $i + 1;
            }

            if ($sama == false) {

                $data10[] = array(
                    'detailobat' => $item->detailobat,
                    'jumlahtersedia' => $item->jumlahtersedia,
                    'jumlahfortersedia'=>0,
//                    'Total' => 1,
//                    'JmlGeneric' => $JmlGenerik,
//                    'Totalitem' => 1 + $JmlGenerik,
                    'jumlah' => 1,
                );
            }

            foreach ($data10 as $key => $row) {
                $count[$key] = $row['jumlah'];
            }
            array_multisort($count, SORT_DESC, $data10);
        }
        $result = array(
            'data' => $data10,
            'message' => 'as@lancelot',
        );
        return $this->respond($result);
    }

    public function getRL314Rujukan(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];

        $main = array('Penyakit Dalam', 'Bedah', 'Kesehatan Anak', 'Obsterik & Ginekologi', 'Keluarga Berencana', 'Saraf', 'Jiwa',
        'THT', 'Mata', 'Kulit & Kelamin', 'Gigi & Mulut', 'Radiologi', 'Paru-Paru', 'Spesialis Lain', 'TOTAL');

        $data10 = DB::select(DB::raw("select namaruangan, id, sum(diterimadaripuskesmas) diterimadaripuskesmas, sum(diterimadarifaskeslain) diterimadarifaskeslain,
        sum(diterimadarirslain) diterimadarirslain, sum(dirujukbalikkepuskesmas) dirujukbalikkepuskesmas, sum(dirujukbalikkefaskeslain)
        dirujukbalikkefaskeslain, sum(dirujukbalikkersasal) dirujukbalikkersasal, sum(pasienrujukan) pasienrujukan, sum(datangsendiri)
        datangsendiri, sum(diterimakembali) diterimakembali 
        from(
            select ru.namaruangan, ru.id,
            case when aj.id = 1 then count(pd.noregistrasi) else 0 end as diterimadaripuskesmas,
            case when aj.id not in (1,2,5,6,7,10) then count(pd.noregistrasi) else 0 end as diterimadarifaskeslain,
            case when aj.id = 2 then count(pd.noregistrasi) else 0 end as diterimadarirslain,
            case when aj.id = 1 and sp.id = 10 then count(pd.noregistrasi) else 0 end as dirujukbalikkepuskesmas,
            case when aj.id not in (1,2,5,6,7,10) and sp.id in (11, 4) then count(pd.noregistrasi) else 0 end as dirujukbalikkefaskeslain,
            case when aj.id = 2 and sp.id = 5 then count(pd.noregistrasi) else 0 end as dirujukbalikkersasal,
        
            case when aj.id in(1,2,3,4,8,9,11,12,13,14,15,16,17) and sp.id in (4,5,10,11) then count(pd.noregistrasi) else 0 end as pasienrujukan,
            case when aj.id in(1,2,3,4,8,9,11,12,13,14,15,16,17) and sp.id = 5 then count(pd.noregistrasi) else 0 end as datangsendiri,
            case when aj.id in(1,2,3,4,8,9,11,12,13,14,15,16,17) and sp.id = 6 then count(pd.noregistrasi) else 0 end as diterimakembali
            FROM
                pasiendaftar_t pd
            INNER JOIN antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
            inner join asalrujukan_m aj on aj.id = apd.objectasalrujukanfk
            inner join statuspulang_m sp on sp.id = pd.objectstatuspulangfk
            inner join ruangan_m ru on ru.id = apd.objectruanganfk
            where apd.tglmasuk between '$tglAwal' and '$tglAkhir'
            group by ru.namaruangan, aj.id, sp.id, ru.id
        ) as x group by namaruangan, id"));

        $diterimadaripuskesmas = 0;
        $diterimadarifaskeslain = 0;
        $diterimadarirslain = 0;
        $dirujukbalikkepuskesmas = 0;
        $dirujukbalikkefaskeslain = 0;
        $dirujukbalikkersasal = 0;
        $pasienrujukan = 0;
        $datangsendiri = 0;
        $diterimakembali = 0;

        foreach($main as $row){
            $diterimadaripuskesmas = 0;
            $diterimadarifaskeslain = 0;
            $diterimadarirslain = 0;
            $dirujukbalikkepuskesmas = 0;
            $dirujukbalikkefaskeslain = 0;
            $dirujukbalikkersasal = 0;
            $pasienrujukan = 0;
            $datangsendiri = 0;
            $diterimakembali = 0;
            foreach($data10 as $data){
                if($row == "Penyakit Dalam" && $data->id == 765){
                    $diterimadaripuskesmas += $data->diterimadaripuskesmas;
                    $diterimadarifaskeslain += $data->diterimadarifaskeslain;
                    $diterimadarirslain += $data->diterimadarirslain;
                    $dirujukbalikkepuskesmas += $data->dirujukbalikkepuskesmas;
                    $dirujukbalikkefaskeslain += $data->dirujukbalikkefaskeslain;
                    $dirujukbalikkersasal += $data->dirujukbalikkersasal;
                    $pasienrujukan += $data->pasienrujukan;
                    $datangsendiri += $data->datangsendiri;
                    $diterimakembali += $data->diterimakembali;
                } else if($row == "Bedah" && $data->id == 44){
                    $diterimadaripuskesmas += $data->diterimadaripuskesmas;
                    $diterimadarifaskeslain += $data->diterimadarifaskeslain;
                    $diterimadarirslain += $data->diterimadarirslain;
                    $dirujukbalikkepuskesmas += $data->dirujukbalikkepuskesmas;
                    $dirujukbalikkefaskeslain += $data->dirujukbalikkefaskeslain;
                    $dirujukbalikkersasal += $data->dirujukbalikkersasal;
                    $pasienrujukan += $data->pasienrujukan;
                    $datangsendiri += $data->datangsendiri;
                    $diterimakembali += $data->diterimakembali;
                } else if($row == "Kesehatan Anak" && ($data->id == 753 || $data->id == 775)){
                    $diterimadaripuskesmas += $data->diterimadaripuskesmas;
                    $diterimadarifaskeslain += $data->diterimadarifaskeslain;
                    $diterimadarirslain += $data->diterimadarirslain;
                    $dirujukbalikkepuskesmas += $data->dirujukbalikkepuskesmas;
                    $dirujukbalikkefaskeslain += $data->dirujukbalikkefaskeslain;
                    $dirujukbalikkersasal += $data->dirujukbalikkersasal;
                    $pasienrujukan += $data->pasienrujukan;
                    $datangsendiri += $data->datangsendiri;
                    $diterimakembali += $data->diterimakembali;
                } else if($row == "Saraf" && $data->id == 755){
                    $diterimadaripuskesmas += $data->diterimadaripuskesmas;
                    $diterimadarifaskeslain += $data->diterimadarifaskeslain;
                    $diterimadarirslain += $data->diterimadarirslain;
                    $dirujukbalikkepuskesmas += $data->dirujukbalikkepuskesmas;
                    $dirujukbalikkefaskeslain += $data->dirujukbalikkefaskeslain;
                    $dirujukbalikkersasal += $data->dirujukbalikkersasal;
                    $pasienrujukan += $data->pasienrujukan;
                    $datangsendiri += $data->datangsendiri;
                    $diterimakembali += $data->diterimakembali;
                } else if($row == "Jiwa" && ($data->id == 785 || $data->id == 752 || $data->id == 782)){
                    $diterimadaripuskesmas += $data->diterimadaripuskesmas;
                    $diterimadarifaskeslain += $data->diterimadarifaskeslain;
                    $diterimadarirslain += $data->diterimadarirslain;
                    $dirujukbalikkepuskesmas += $data->dirujukbalikkepuskesmas;
                    $dirujukbalikkefaskeslain += $data->dirujukbalikkefaskeslain;
                    $dirujukbalikkersasal += $data->dirujukbalikkersasal;
                    $pasienrujukan += $data->pasienrujukan;
                    $datangsendiri += $data->datangsendiri;
                    $diterimakembali += $data->diterimakembali;
                } else if($row == "Jiwa" && ($data->id == 785 || $data->id == 752 || $data->id == 782)){
                    $diterimadaripuskesmas += $data->diterimadaripuskesmas;
                    $diterimadarifaskeslain += $data->diterimadarifaskeslain;
                    $diterimadarirslain += $data->diterimadarirslain;
                    $dirujukbalikkepuskesmas += $data->dirujukbalikkepuskesmas;
                    $dirujukbalikkefaskeslain += $data->dirujukbalikkefaskeslain;
                    $dirujukbalikkersasal += $data->dirujukbalikkersasal;
                    $pasienrujukan += $data->pasienrujukan;
                    $datangsendiri += $data->datangsendiri;
                    $diterimakembali += $data->diterimakembali;
                } else if($row == "Kulit & Kelamin" && $data->id == 754){
                    $diterimadaripuskesmas += $data->diterimadaripuskesmas;
                    $diterimadarifaskeslain += $data->diterimadarifaskeslain;
                    $diterimadarirslain += $data->diterimadarirslain;
                    $dirujukbalikkepuskesmas += $data->dirujukbalikkepuskesmas;
                    $dirujukbalikkefaskeslain += $data->dirujukbalikkefaskeslain;
                    $dirujukbalikkersasal += $data->dirujukbalikkersasal;
                    $pasienrujukan += $data->pasienrujukan;
                    $datangsendiri += $data->datangsendiri;
                    $diterimakembali += $data->diterimakembali;
                } else if($row == "Gigi & Mulut" && $data->id == 759){
                    $diterimadaripuskesmas += $data->diterimadaripuskesmas;
                    $diterimadarifaskeslain += $data->diterimadarifaskeslain;
                    $diterimadarirslain += $data->diterimadarirslain;
                    $dirujukbalikkepuskesmas += $data->dirujukbalikkepuskesmas;
                    $dirujukbalikkefaskeslain += $data->dirujukbalikkefaskeslain;
                    $dirujukbalikkersasal += $data->dirujukbalikkersasal;
                    $pasienrujukan += $data->pasienrujukan;
                    $datangsendiri += $data->datangsendiri;
                    $diterimakembali += $data->diterimakembali;
                } else if($row == "Radiologi" && $data->id == 576){
                    $diterimadaripuskesmas += $data->diterimadaripuskesmas;
                    $diterimadarifaskeslain += $data->diterimadarifaskeslain;
                    $diterimadarirslain += $data->diterimadarirslain;
                    $dirujukbalikkepuskesmas += $data->dirujukbalikkepuskesmas;
                    $dirujukbalikkefaskeslain += $data->dirujukbalikkefaskeslain;
                    $dirujukbalikkersasal += $data->dirujukbalikkersasal;
                    $pasienrujukan += $data->pasienrujukan;
                    $datangsendiri += $data->datangsendiri;
                    $diterimakembali += $data->diterimakembali;
                } else if($row == "Spesialis Lain" && $data->id != 765 && $data->id != 44 && $data->id != 753 && $data->id != 775 && $data->id != 755 && $data->id != 785 && $data->id != 752
                && $data->id != 782 && $data->id != 754 && $data->id != 759 && $data->id != 576){
                    $diterimadaripuskesmas += $data->diterimadaripuskesmas;
                    $diterimadarifaskeslain += $data->diterimadarifaskeslain;
                    $diterimadarirslain += $data->diterimadarirslain;
                    $dirujukbalikkepuskesmas += $data->dirujukbalikkepuskesmas;
                    $dirujukbalikkefaskeslain += $data->dirujukbalikkefaskeslain;
                    $dirujukbalikkersasal += $data->dirujukbalikkersasal;
                    $pasienrujukan += $data->pasienrujukan;
                    $datangsendiri += $data->datangsendiri;
                    $diterimakembali += $data->diterimakembali;
                }

            }

            $datas[] = array(
                'namaruangan' =>  $row,
                'diterimadaripuskesmas' => $diterimadaripuskesmas,
                'diterimadarifaskeslain' => $diterimadarifaskeslain,
                'diterimadarirslain' => $diterimadarirslain,
                'dirujukbalikkepuskesmas' => $dirujukbalikkepuskesmas,
                'dirujukbalikkefaskeslain' => $dirujukbalikkefaskeslain,
                'dirujukbalikkersasal' => $dirujukbalikkersasal,
                'pasienrujukan' => $pasienrujukan,
                'datangsendiri' => $datangsendiri,
                'diterimakembali' => $diterimakembali, 
            );
        }

        $result = array(
            'data' => $datas,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getRL315CaraBayar(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];

        $main = array('Membayar Sendiri', 'Asuransi:', 'Asuransi Pemerintah', 'Asuransi Swasta', 'Keringanan (Cost Sharing)', 'Gratis', 
        'Kartu Sehat', 'Keterangan Tidak Mampu', 'Lain-Lain', 'TOTAL');

        $data10 = DB::select(DB::raw("select kelompokpasien, sum(pasienranapjpk) pasienranapjpk, sum(pasienranapjld) pasienranapjld, sum(pasienrajal) pasienrajal, sum(pasienrajallab) pasienrajallab,
        sum(pasienrajalrad) pasienrajalrad, sum(pasienrajallain) pasienrajallain 
        from(
            select kp.kelompokpasien, 
            case when ru.objectdepartemenfk = 16 and pd.tglpulang <> pd.tglregistrasi and pd.tglpulang is not null then count(pd.noregistrasi) end as pasienranapjpk,
            case when ru.objectdepartemenfk = 16 and pd.tglpulang is not null then sum(x.lamadirawat) end as pasienranapjld,
            case when ru.objectdepartemenfk <> 16 and pd.tglpulang = pd.tglregistrasi then count(pd.noregistrasi) end as pasienrajal,
            case when ru.objectdepartemenfk <> 16 and ru.id = 575 and pd.tglpulang = pd.tglregistrasi then count(pd.noregistrasi) end as pasienrajallab,
            case when ru.objectdepartemenfk <> 16 and ru.id = 576 and pd.tglpulang = pd.tglregistrasi then count(pd.noregistrasi) end as pasienrajalrad,
            case when ru.objectdepartemenfk <> 16 and ru.id not in (576, 575) and pd.tglpulang = pd.tglregistrasi then count(pd.noregistrasi) end as pasienrajallain
            from
                pasiendaftar_t pd
            inner join kelompokpasien_m kp on kp.id = pd.objectkelompokpasienlastfk
            inner join ruangan_m ru on ru.id = pd.objectruanganlastfk
            left join(
                with cte as (
                    select pdt.norec, min(apdt.tglmasuk::date) tglmasuk from pasiendaftar_t as pdt
                    inner join antrianpasiendiperiksa_t as apdt on apdt.noregistrasifk = pdt.norec
                    inner join ruangan_m as rum on rum.id = apdt.objectruanganfk
                    where rum.objectdepartemenfk = 16
                    and pdt.statusenabled = TRUE
                    and pdt.kdprofile = 30
                    and pdt.tglpulang::date between '$tglAwal' and '$tglAkhir'
                    group by pdt.norec, apdt.objectruanganfk
                )
                                            
                select pd.noregistrasi,
                case when pd.tglpulang::date-cte.tglmasuk::date = 0 then 1 else  (pd.tglpulang::date-cte.tglmasuk) + 1 end as lamadirawat
                FROM pasiendaftar_t as pd
                INNER JOIN cte on cte.norec = pd.norec
                WHERE pd.kdprofile = 30 and pd.tglpulang is not null and cast(pd.tglpulang as date) between '2022-05-01 00:00' and '2022-06-07 23:59'
                group by pd.tglpulang::date, cte.tglmasuk, pd.noregistrasi
                order by pd.tglpulang::date
            ) as x on x.noregistrasi = pd.noregistrasi
            where pd.tglregistrasi between '$tglAwal' and '$tglAkhir'
            group by kp.kelompokpasien, pd.tglpulang, pd.tglregistrasi, ru.objectdepartemenfk, ru.id
        ) as c group by kelompokpasien"));

        $pasienranapjpk = 0;
        $pasienranapjld = 0;
        $pasienrajal = 0;
        $pasienrajallab = 0;
        $pasienrajalrad = 0;
        $pasienrajallain = 0;
        foreach($main as $row){
            $pasienranapjpk = 0;
            $pasienranapjld = 0;
            $pasienrajal = 0;
            $pasienrajallab = 0;
            $pasienrajalrad = 0;
            $pasienrajallain = 0;
            foreach($data10 as $data){
                if($row == 'Membayar Sendiri' && $data->kelompokpasien == 'Umum/Pribadi'){
                    $pasienranapjpk += $data->pasienranapjpk;
                    $pasienranapjld += $data->pasienranapjld;
                    $pasienrajal += $data->pasienrajal;
                    $pasienrajallab += $data->pasienrajallab;
                    $pasienrajalrad += $data->pasienrajalrad;
                    $pasienrajallain += $data->pasienrajallain;
                } else if($row == 'Asuransi Pemerintah' && ($data->kelompokpasien == 'BPJS' || $data->kelompokpasien == 'Jamsostek' 
                || $data->kelompokpasien == 'Kemenkes' || $data->kelompokpasien == 'BPJS KELAS I' || $data->kelompokpasien == 'BPJS KELAS II'
                || $data->kelompokpasien == 'BPJS KELAS III PBI' || $data->kelompokpasien == 'BPJS KELAS III NON PBI (Mandiri)' || $data->kelompokpasien == 'Proses BPJS'
                || $data->kelompokpasien == 'Proses Jamkesda' || $data->kelompokpasien == 'Proses JKS' || $data->kelompokpasien == 'Jamkesos'
                || $data->kelompokpasien == 'IPWL' || $data->kelompokpasien == 'Jamkesmas' || $data->kelompokpasien == 'Jamkesda')){
                    $pasienranapjpk += $data->pasienranapjpk;
                    $pasienranapjld += $data->pasienranapjld;
                    $pasienrajal += $data->pasienrajal;
                    $pasienrajallab += $data->pasienrajallab;
                    $pasienrajalrad += $data->pasienrajalrad;
                    $pasienrajallain += $data->pasienrajallain;
                } else if($row == 'Asuransi Swasta' && ($data->kelompokpasien == 'Perusahaan' || $data->kelompokpasien == 'Karyawan')){
                    $pasienranapjpk += $data->pasienranapjpk;
                    $pasienranapjld += $data->pasienranapjld;
                    $pasienrajal += $data->pasienrajal;
                    $pasienrajallab += $data->pasienrajallab;
                    $pasienrajalrad += $data->pasienrajalrad;
                    $pasienrajallain += $data->pasienrajallain;
                } else if($row == 'Gratis' && $data->kelompokpasien == 'Gratis rawat jalan'){
                    $pasienranapjpk += $data->pasienranapjpk;
                    $pasienranapjld += $data->pasienranapjld;
                    $pasienrajal += $data->pasienrajal;
                    $pasienrajallab += $data->pasienrajallab;
                    $pasienrajalrad += $data->pasienrajalrad;
                    $pasienrajallain += $data->pasienrajallain;
                } else if($row == 'Keterangan Tidak Mampu' && $data->kelompokpasien == 'SKMM'){
                    $pasienranapjpk += $data->pasienranapjpk;
                    $pasienranapjld += $data->pasienranapjld;
                    $pasienrajal += $data->pasienrajal;
                    $pasienrajallab += $data->pasienrajallab;
                    $pasienrajalrad += $data->pasienrajalrad;
                    $pasienrajallain += $data->pasienrajallain;
                } else if($row == 'Lain-Lain' && $data->kelompokpasien == 'Asuransi lain'){
                    $pasienranapjpk += $data->pasienranapjpk;
                    $pasienranapjld += $data->pasienranapjld;
                    $pasienrajal += $data->pasienrajal;
                    $pasienrajallab += $data->pasienrajallab;
                    $pasienrajalrad += $data->pasienrajalrad;
                    $pasienrajallain += $data->pasienrajallain;
                }

            }

            $datas[] = array(
                'carabayar' =>  $row,
                'pasienranapjpk' => $pasienranapjpk,
                'pasienranapjld' => $pasienranapjld,
                'pasienrajal' => $pasienrajal,
                'pasienrajallab' => $pasienrajallab,
                'pasienrajalrad' => $pasienrajalrad,
                'pasienrajallain' => $pasienrajallain,
            );
        }

        $result = array(
            'data' => $datas,
            'message' => 'er@epic',
        );
        return $this->respond($result);
    }
    public function getPelayananResep(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $KdJenisLapFarmasi = (int) $this->settingDataFixed('KdJenisLapFarmasi', $kdProfile);
//        $dataLogin = $request->all();
//
//        $data = \DB::table('pasiendaftar_t as pd')
//            ->join('antrianpasiendiperiksa_t as apd','apd.noregistrasifk','=','pd.norec')
//            ->leftJoin('pelayananpasien_t as pp','pp.noregistrasifk','=','apd.norec')
//            ->join('ruangan_m as ru','ru.id','=','apd.objectruanganfk')
//            ->join('departemen_m as dpm','dpm.id','=','ru.objectdepartemenfk')
//            ->join('produk_m as prd','prd.id','=','pp.produkfk')
//            ->select('prd.namaproduk','apd.objectruanganfk','ru.namaruangan','ru.objectdepartemenfk',
//                'prd.id as idproduk', 'prd.objectdetailjenisprodukfk',
//
//                DB::raw('(case when ru.objectdepartemenfk in (16, 17, 35, 26) then \'Rawat Inap\'
//                        when ru.objectdepartemenfk in (18, 27, 3, 28) then \'Rawat Jalan\'
//                        when prd.id = 24 then \'IGD\'
//                        else null end) as deptpelayanan,
//                        (case when prd.objectstatusprodukfk = 1 and prd.isgeneric =\'f\' THEN \'Obat Non Generik Non Formularium\'
//                        when prd.objectstatusprodukfk = 2 and prd.isgeneric =\'f\' THEN \'Obat Non Generik Formularium\'
//                        else \'Obat Generik(Formularium + Non Formularium)\' end) as detailobat'
//                )
//            )
//
//            ->where('prd.objectdetailjenisprodukfk', 474);
//
////        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
////            $data = $data->where('pd.tglregistrasi', '>=', $request['tglAwal']);
////        }
////        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
////            $tgl = $request['tglAkhir'];
////            $data = $data->where('pd.tglregistrasi', '<=', $tgl);
////        }
//        $data = $data->get();
//
//        $data10 = [];
//        $jml = 0;
//        $sama = false;
//
//        $JmlRajal = 0;
//        $JmlRI = 0;
//        $JmlIGD = 0;
//
//        foreach ($data as $item) {
//            $sama = false;
//            $i = 0;
//            foreach ($data10 as $hideung) {
//                if ($item->detailobat == $data10[$i]['detailobat']) {
//                    $sama = true;
//                    $jml = (float)$hideung['jumlah'] + 1;
//                    $data10[$i]['jumlah'] = $jml;
//
//                    if ($item->deptpelayanan == 'Rawat Inap')
//                    {
//                        $data10[$i]['JmlRawatInap'] = (float)$hideung['JmlRawatInap'] + 1;
//                    }
//                    elseif ($item->deptpelayanan == 'Rawat Jalan')
//                    {
//                        $data10[$i]['Jmlrj'] = (float)$hideung['Jmlrj'] + 1;
//                    }
//                    elseif ($item->deptpelayanan == 'IGD')
//                    {
//                        $data10[$i]['JmlIGD'] = (float)$hideung['JmlIGD'] + 1;
//                    }
//                }
//                $i = $i + 1;
//            }
//
//            if ($sama == false) {
//
//                if ($item->deptpelayanan == 'Rawat Inap')
//                {
//                    $JmlRajal = 0;
//                    $JmlRI = 1;
//                    $JmlIGD = 0;
//                }
//                elseif ($item->deptpelayanan == 'Rawat Jalan')
//                {
//                    $JmlRajal = 1;
//                    $JmlRI = 0;
//                    $JmlIGD = 0;
//                }
//                elseif ($item->deptpelayanan == 'IGD')
//                {
//                    $JmlRajal = 0;
//                    $JmlRI = 0;
//                    $JmlIGD = 1;
//                }
//                $data10[] = array(
//                    'detailobat' => $item->detailobat,
//                    'JmlRawatInap' => $JmlRI,
//                    'Jmlrj' => $JmlRajal,
//                    'JmlIGD' => $JmlIGD,
//                    'jumlah' => 1,
//                );
//            }
//
//            foreach ($data10 as $key => $row) {
//                $count[$key] = $row['jumlah'];
//            }
//
//            array_multisort($count, SORT_DESC, $data10);
//        }
//
//        $result = array(
//            'data' => $data10,
//            'message' => 'as@cepot',
//        );
//        return $this->respond($result);

        //#WITH MAPPING
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd','apd.noregistrasifk','=','pd.norec')
            ->leftJoin('pelayananpasien_t as pp','pp.noregistrasifk','=','apd.norec')
            ->join('mapproduktolaporanrl_m as mprl','mprl.produkfk','=','pp.produkfk')
            ->join('jenislaporan_m as jl','jl.id','=','mprl.objectjenislaporanfk')
            ->join('kelompoklaporan_m as kl','kl.id','=','mprl.objectkontenlaporanfk')
            ->join('ruangan_m as ru','ru.id','=','apd.objectruanganfk')
            ->join('departemen_m as dpm','dpm.id','=','ru.objectdepartemenfk')
            ->join('produk_m as prd','prd.id','=','pp.produkfk')
            ->select('prd.namaproduk','apd.objectruanganfk','ru.namaruangan','kl.kelompoklaporan as detailobat',
                'pp.tglpelayanan',
                DB::raw('(case when ru.objectdepartemenfk in (16, 17, 35, 26) then \'Rawat Inap\'
                        when ru.objectdepartemenfk in (18, 27, 3, 28) then \'Rawat Jalan\'
                        when ru.objectdepartemenfk = 24 then \'IGD\'
                        else null end) as deptpelayanan'
                )
            )
            ->where('pd.kdprofile', $kdProfile)
            ->where('jl.id', $KdJenisLapFarmasi);

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pp.tglpelayanan', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];
            $data = $data->where('pp.tglpelayanan', '<=', $tgl);
        }
        $data = $data->get();

        $data10 = [];
        $jml = 0;
        $sama = false;

        $JmlRajal = 0;
        $JmlRI = 0;
        $JmlIGD = 0;

        foreach ($data as $item) {
            $sama = false;
            $i = 0;
            foreach ($data10 as $hideung) {
                if ($item->detailobat == $data10[$i]['detailobat']) {
                    $sama = true;
                    $jml = (float)$hideung['jumlah'] + 1;
                    $data10[$i]['jumlah'] = $jml;

                    if ($item->deptpelayanan == 'Rawat Inap')
                    {
                        $data10[$i]['JmlRawatInap'] = (float)$hideung['JmlRawatInap'] + 1;
                    }
                    elseif ($item->deptpelayanan == 'Rawat Jalan')
                    {
                        $data10[$i]['Jmlrj'] = (float)$hideung['Jmlrj'] + 1;
                    }
                    elseif ($item->deptpelayanan == 'IGD')
                    {
                        $data10[$i]['JmlIGD'] = (float)$hideung['JmlIGD'] + 1;
                    }
                }
                $i = $i + 1;
            }

            if ($sama == false) {

                if ($item->deptpelayanan == 'Rawat Inap')
                {
                    $JmlRajal = 0;
                    $JmlRI = 1;
                    $JmlIGD = 0;
                }
                elseif ($item->deptpelayanan == 'Rawat Jalan')
                {
                    $JmlRajal = 1;
                    $JmlRI = 0;
                    $JmlIGD = 0;
                }
                elseif ($item->deptpelayanan == 'IGD')
                {
                    $JmlRajal = 0;
                    $JmlRI = 0;
                    $JmlIGD = 1;
                }
                $data10[] = array(
                    'detailobat' => $item->detailobat,
//                    'namaruangan' => $item->namaruangan,
//                    'namaproduk' => $item->namaproduk,
//                    'tglpelayanan' => $item->tglpelayanan,
                    'JmlRawatInap' => $JmlRI,
                    'Jmlrj' => $JmlRajal,
                    'JmlIGD' => $JmlIGD,
                    'jumlah' => 1,
                );
            }

            foreach ($data10 as $key => $row) {
                $count[$key] = $row['jumlah'];
            }

            array_multisort($count, SORT_DESC, $data10);
        }

        $result = array(
            'data' => $data10,
            'message' => 'as@lancelot',
        );
        return $this->respond($result);
    }
    public function getLaporanRL4aRawatInap(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tglAwal = $request['tglAwal'];
        $data10 = [];

        $data = DB::select(DB::raw("select ddtd.id, pd.tglregistrasi,app.statuspenyakit,ddtd.nodtd,ddtd.nodaftarterperinci, lower(ddtd.golongansebabpenyakit) as golongansebabpenyakit, ddp.objectjenisdiagnosafk, jd.jenisdiagnosa, pd.tglpulang,
        ps.tgllahir as tglLahir,
        EXTRACT(YEAR from AGE(pd.tglregistrasi, ps.tgllahir)) as umuryear,
        DATE_PART('day', pd.tglregistrasi::timestamp - ps.tgllahir::timestamp) as umurday,
        ps.objectjeniskelaminfk,pd.objectstatuskeluarfk,sk.statuskeluar, sp.statuspulang
        from pasiendaftar_t as pd
        inner join antrianpasiendiperiksa_t as app on app.noregistrasifk = pd.norec 
		inner join pasien_m as ps on ps.id = pd.nocmfk
		inner join jeniskelamin_m as jk on ps.objectjeniskelaminfk = jk.id
		inner join ruangan_m ru on ru.id = app.objectruanganfk
		inner join departemen_m dpm on dpm.id = ru.objectdepartemenfk
		inner join diagnosapasien_t as dp on dp.noregistrasifk = app.norec
        inner join detaildiagnosapasien_t as ddp on ddp.objectdiagnosapasienfk = dp.norec
		inner join jenisdiagnosa_m jd on jd.id = ddp.objectjenisdiagnosafk
        inner join diagnosa_m as dm on ddp.objectdiagnosafk = dm.id
        inner join mappingrlmorbiditas_m as mpr on mpr.kddiagnosa = dm.kddiagnosa
        inner join diagnosadtd_m as ddtd on ddtd.nodtd = mpr.nodtd
		left join statuskeluar_m sk on sk.id = pd.objectstatuskeluarfk
        left join statuspulang_m sp on sp.id = pd.objectstatuspulangfk
        where pd.statusenabled = true 
        and pd.kdprofile = $kdProfile 
        and ru.objectdepartemenfk = 16
        --and (jd.id = 1 or jd.id = 7)
        and ddtd.id between 1 and 507
        and pd.tglregistrasi between '$tglAwal-01-01' and '$tglAwal-12-31'
        order by ddtd.id"));

        $id = DB::select(DB::raw("select ddtd.id, ddtd.nodtd, ddtd.nodaftarterperinci, ddtd.golongansebabpenyakit, pr.id idprofile, pr.namakota, pr.namapemerintahan, pr.namalengkap from diagnosadtd_m ddtd
        inner join profile_m pr on pr.id = ddtd.kdprofile
        where ddtd.id between 1 and 507 and pr.id = $kdProfile order by ddtd.id"));

        
        $jumlahumur0hs6hl = 0;
        $jumlahumur0hs6hp = 0;
        $jumlahumur7hs28hl = 0;
        $jumlahumur7hs28hp = 0;
        $jumlahumur29hs1tl = 0;
        $jumlahumur29hs1tp = 0;
        $jumlahumur2ts4tl = 0;
        $jumlahumur2ts4tp = 0;
        $jumlahumur5ts14tl = 0;
        $jumlahumur5ts14tp = 0;
        $jumlahumur15ts24tl = 0;
        $jumlahumur15ts24tp = 0;
        $jumlahumur25ts44tl = 0;
        $jumlahumur25ts44tp = 0;
        $jumlahumur45ts64tl = 0;
        $jumlahumur45ts64tp = 0;
        $jumlahumurlebih64l = 0;
        $jumlahumurlebih64p = 0;
        $jumlahpasienkeluarhml = 0;
        $jumlahpasienkeluarhmp = 0;
        $totalpasienkeluarhm = 0;
        $jumlahpasienkeluarmati = 0;

        $currentid = 99999;

        foreach($id as $row){
            $namakota = $row->namakota;
            $namalengkap = $row->namalengkap;
            $namapemerintahan = $row->namapemerintahan;
            $kode = $row->idprofile;
            $nodaftarterperinci = $row->nodaftarterperinci;
            $golongansebabpenyakit = $row->golongansebabpenyakit;
            $nodtd = $row->nodtd;

            $jumlahumur0hs6hl = 0;
                    $jumlahumur0hs6hp = 0;
                    $jumlahumur7hs28hl = 0;
                    $jumlahumur7hs28hp = 0;
                    $jumlahumur29hs1tl = 0;
                    $jumlahumur29hs1tp = 0;
                    $jumlahumur2ts4tl = 0;
                    $jumlahumur2ts4tp = 0;
                    $jumlahumur5ts14tl = 0;
                    $jumlahumur5ts14tp = 0;
                    $jumlahumur15ts24tl = 0;
                    $jumlahumur15ts24tp = 0;
                    $jumlahumur25ts44tl = 0;
                    $jumlahumur25ts44tp = 0;
                    $jumlahumur45ts64tl = 0;
                    $jumlahumur45ts64tp = 0;
                    $jumlahumurlebih64l = 0;
                    $jumlahumurlebih64p = 0;
                    $jumlahpasienkeluarhml = 0;
                    $jumlahpasienkeluarhmp = 0;
                    $jumlahpasienkeluarmati = 0;
                    $totalpasienkeluarhm = 0;

            if($row->id != $currentid){
                foreach ($data as $item) {
                    if($row->id == $item->id){
                        if($item->umurday <= 6){
                            if($item->objectjeniskelaminfk == 1){
                                $jumlahumur0hs6hl++;
                            } else if($item->objectjeniskelaminfk == 2){
                                $jumlahumur0hs6hp++;
                            }
                        }
                        else if($item->umurday >= 7 && $item->umurday <= 28){
                            if($item->objectjeniskelaminfk == 1){
                                $jumlahumur7hs28hl++;
                            } else if($item->objectjeniskelaminfk == 2){
                                $jumlahumur7hs28hp++;
                            }
                        }
                        else if($item->umurday >= 29 && $item->umuryear <= 1){
                            if($item->objectjeniskelaminfk == 1){
                                $jumlahumur29hs1tl++;
                            } else if($item->objectjeniskelaminfk == 2){
                                $jumlahumur29hs1tp++;
                            }
                        }
                        else if($item->umuryear >= 2 && $item->umuryear <= 4){
                            if($item->objectjeniskelaminfk == 1){
                                $jumlahumur2ts4tl++;
                            } else if($item->objectjeniskelaminfk == 2){
                                $jumlahumur2ts4tp++;
                            }
                        }
                        else if($item->umuryear >= 5 && $item->umuryear <= 14){
                            if($item->objectjeniskelaminfk == 1){
                                $jumlahumur15ts24tl++;
                            } else if($item->objectjeniskelaminfk == 2){
                                $jumlahumur15ts24tp++;
                            }
                        }
                        else if($item->umuryear >= 15 && $item->umuryear <= 24){
                            if($item->objectjeniskelaminfk == 1){
                                $jumlahumur15ts24tl++;
                            } else if($item->objectjeniskelaminfk == 2){
                                $jumlahumur15ts24tp++;
                            }
                        }
                        else if($item->umuryear >= 25 && $item->umuryear <= 44){
                            if($item->objectjeniskelaminfk == 1){
                                $jumlahumur25ts44tl++;
                            } else if($item->objectjeniskelaminfk == 2){
                                $jumlahumur25ts44tp++;
                            }
                        }
                        else if($item->umuryear >= 45 && $item->umuryear <= 64){
                            if($item->objectjeniskelaminfk == 1){
                                $jumlahumur45ts64tl++;
                            } else if($item->objectjeniskelaminfk == 2){
                                $jumlahumur45ts64tp++;
                            }
                        }
                        else if($item->umuryear > 64){
                            if($item->objectjeniskelaminfk == 1){
                                $jumlahumurlebih64l++;
                            } else if($item->objectjeniskelaminfk == 2){
                                $jumlahumurlebih64p++;
                            }
                        }
        
                        if($item->tglpulang != null && $item->objectjeniskelaminfk == 1){
                            $jumlahpasienkeluarhml++;
                        } else if($item->tglpulang != null && $item->objectjeniskelaminfk == 2){
                            $jumlahpasienkeluarhmp++;
                        }
        
                        if($item->tglpulang != null && $item->objectstatuskeluarfk == 5){
                            $jumlahpasienkeluarmati++;
                        }

                        $totalpasienkeluarhm = $jumlahpasienkeluarhmp + $jumlahpasienkeluarhml;
                        
                    }
                    
                }

                $currentid= $row->id;

                $data10[] = array(
                    'jumlahumur0hs6hl' => $jumlahumur0hs6hl,
                    'jumlahumur0hs6hp' =>  $jumlahumur0hs6hp, 
                    'jumlahumur7hs28hl' =>  $jumlahumur7hs28hl, 
                    'jumlahumur7hs28hp' =>  $jumlahumur7hs28hp, 
                    'jumlahumur29hs1tl' =>  $jumlahumur29hs1tl, 
                    'jumlahumur29hs1tp' =>  $jumlahumur29hs1tp, 
                    'jumlahumur2ts4tl' =>  $jumlahumur2ts4tl, 
                    'jumlahumur2ts4tp' =>  $jumlahumur2ts4tp,
                    'jumlahumur5ts14tl' =>  $jumlahumur5ts14tl, 
                    'jumlahumur5ts14tp' =>  $jumlahumur5ts14tp, 
                    'jumlahumur15ts24tl' =>  $jumlahumur15ts24tl, 
                    'jumlahumur15ts24tp' =>  $jumlahumur15ts24tp, 
                    'jumlahumur25ts44tl' =>  $jumlahumur25ts44tl, 
                    'jumlahumur25ts44tp' =>  $jumlahumur25ts44tp, 
                    'jumlahumur45ts64tl' =>  $jumlahumur45ts64tl, 
                    'jumlahumur45ts64tp' =>  $jumlahumur45ts64tp, 
                    'jumlahumurlebih64l' =>  $jumlahumurlebih64l, 
                    'jumlahumurlebih64p' =>  $jumlahumurlebih64p, 
                    'jumlahpasienkeluarhml' =>  $jumlahpasienkeluarhml, 
                    'jumlahpasienkeluarhmp' =>  $jumlahpasienkeluarhmp, 
                    'totalpasienkeluarhm' =>  $totalpasienkeluarhm, 
                    'jumlahpasienkeluarmati' =>  $jumlahpasienkeluarmati, 
                    'namakota' =>  $namakota, 
                    'namalengkap' =>  $namalengkap, 
                    'namapemerintahan' =>  $namapemerintahan, 
                    'kode' =>  $kode,
                    'nodtd' =>  $nodtd,
                    'nodaftarterperinci' =>  $nodaftarterperinci, 
                    'golongansebabpenyakit' =>  $golongansebabpenyakit,
                    
                );
            }
        }

        $result = array(
            'detail' => $data10,
        );
        
        return $this->setStatusCode(201)->respond($result, 'tes msg');
    }

    public function getLaporanRL4aRawatInapSebabLuar(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tglAwal = $request['tglAwal'];
        $data10 = [];

        $data = DB::select(DB::raw("select ddtd.id, pd.tglregistrasi,app.statuspenyakit,ddtd.nodtd,ddtd.nodaftarterperinci, lower(ddtd.golongansebabpenyakit) as golongansebabpenyakit, ddp.objectjenisdiagnosafk, jd.jenisdiagnosa, pd.tglpulang,
        ps.tgllahir as tglLahir,
        EXTRACT(YEAR from AGE(pd.tglregistrasi, ps.tgllahir)) as umuryear,
        DATE_PART('day', pd.tglregistrasi::timestamp - ps.tgllahir::timestamp) as umurday,
        ps.objectjeniskelaminfk,pd.objectstatuskeluarfk,sk.statuskeluar, sp.statuspulang
        from pasiendaftar_t as pd
        inner join antrianpasiendiperiksa_t as app on app.noregistrasifk = pd.norec 
		inner join pasien_m as ps on ps.id = pd.nocmfk
		inner join jeniskelamin_m as jk on ps.objectjeniskelaminfk = jk.id
		inner join ruangan_m ru on ru.id = app.objectruanganfk
		inner join departemen_m dpm on dpm.id = ru.objectdepartemenfk
		inner join diagnosapasien_t as dp on dp.noregistrasifk = app.norec
        inner join detaildiagnosapasien_t as ddp on ddp.objectdiagnosapasienfk = dp.norec
		inner join jenisdiagnosa_m jd on jd.id = ddp.objectjenisdiagnosafk
        inner join diagnosa_m as dm on ddp.objectdiagnosafk = dm.id
        inner join mappingrlmorbiditas_m as mpr on mpr.kddiagnosa = dm.kddiagnosa
        inner join diagnosadtd_m as ddtd on ddtd.nodtd = mpr.nodtd
		left join statuskeluar_m sk on sk.id = pd.objectstatuskeluarfk
        left join statuspulang_m sp on sp.id = pd.objectstatuspulangfk
        where pd.statusenabled = true 
        and pd.kdprofile = $kdProfile 
        and ru.objectdepartemenfk = 16
        --and (jd.id = 1 or jd.id = 7)
        and ddtd.id between 508 and 537
        and pd.tglregistrasi between '$tglAwal-01-01' and '$tglAwal-12-31'
        order by ddtd.id"));

        $id = DB::select(DB::raw("select ddtd.id, ddtd.nodtd, ddtd.nodaftarterperinci, ddtd.golongansebabpenyakit, pr.id idprofile, pr.namakota, pr.namapemerintahan, pr.namalengkap from diagnosadtd_m ddtd
        inner join profile_m pr on pr.id = ddtd.kdprofile
        where ddtd.id between 1 and 507 and pr.id = $kdProfile order by ddtd.id"));

        
        $jumlahumur0hs6hl = 0;
        $jumlahumur0hs6hp = 0;
        $jumlahumur7hs28hl = 0;
        $jumlahumur7hs28hp = 0;
        $jumlahumur29hs1tl = 0;
        $jumlahumur29hs1tp = 0;
        $jumlahumur2ts4tl = 0;
        $jumlahumur2ts4tp = 0;
        $jumlahumur5ts14tl = 0;
        $jumlahumur5ts14tp = 0;
        $jumlahumur15ts24tl = 0;
        $jumlahumur15ts24tp = 0;
        $jumlahumur25ts44tl = 0;
        $jumlahumur25ts44tp = 0;
        $jumlahumur45ts64tl = 0;
        $jumlahumur45ts64tp = 0;
        $jumlahumurlebih64l = 0;
        $jumlahumurlebih64p = 0;
        $jumlahpasienkeluarhml = 0;
        $jumlahpasienkeluarhmp = 0;
        $totalpasienkeluarhm = 0;
        $jumlahpasienkeluarmati = 0;

        $currentid = 99999;

        foreach($id as $row){
            $namakota = $row->namakota;
            $namalengkap = $row->namalengkap;
            $namapemerintahan = $row->namapemerintahan;
            $kode = $row->idprofile;
            $nodaftarterperinci = $row->nodaftarterperinci;
            $golongansebabpenyakit = $row->golongansebabpenyakit;
            $nodtd = $row->nodtd;

            $jumlahumur0hs6hl = 0;
                    $jumlahumur0hs6hp = 0;
                    $jumlahumur7hs28hl = 0;
                    $jumlahumur7hs28hp = 0;
                    $jumlahumur29hs1tl = 0;
                    $jumlahumur29hs1tp = 0;
                    $jumlahumur2ts4tl = 0;
                    $jumlahumur2ts4tp = 0;
                    $jumlahumur5ts14tl = 0;
                    $jumlahumur5ts14tp = 0;
                    $jumlahumur15ts24tl = 0;
                    $jumlahumur15ts24tp = 0;
                    $jumlahumur25ts44tl = 0;
                    $jumlahumur25ts44tp = 0;
                    $jumlahumur45ts64tl = 0;
                    $jumlahumur45ts64tp = 0;
                    $jumlahumurlebih64l = 0;
                    $jumlahumurlebih64p = 0;
                    $jumlahpasienkeluarhml = 0;
                    $jumlahpasienkeluarhmp = 0;
                    $jumlahpasienkeluarmati = 0;
                    $totalpasienkeluarhm = 0;

            if($row->id != $currentid){
                foreach ($data as $item) {
                    if($row->id == $item->id){
                        if($item->umurday <= 6){
                            if($item->objectjeniskelaminfk == 1){
                                $jumlahumur0hs6hl++;
                            } else if($item->objectjeniskelaminfk == 2){
                                $jumlahumur0hs6hp++;
                            }
                        }
                        else if($item->umurday >= 7 && $item->umurday <= 28){
                            if($item->objectjeniskelaminfk == 1){
                                $jumlahumur7hs28hl++;
                            } else if($item->objectjeniskelaminfk == 2){
                                $jumlahumur7hs28hp++;
                            }
                        }
                        else if($item->umurday >= 29 && $item->umuryear <= 1){
                            if($item->objectjeniskelaminfk == 1){
                                $jumlahumur29hs1tl++;
                            } else if($item->objectjeniskelaminfk == 2){
                                $jumlahumur29hs1tp++;
                            }
                        }
                        else if($item->umuryear >= 2 && $item->umuryear <= 4){
                            if($item->objectjeniskelaminfk == 1){
                                $jumlahumur2ts4tl++;
                            } else if($item->objectjeniskelaminfk == 2){
                                $jumlahumur2ts4tp++;
                            }
                        }
                        else if($item->umuryear >= 5 && $item->umuryear <= 14){
                            if($item->objectjeniskelaminfk == 1){
                                $jumlahumur15ts24tl++;
                            } else if($item->objectjeniskelaminfk == 2){
                                $jumlahumur15ts24tp++;
                            }
                        }
                        else if($item->umuryear >= 15 && $item->umuryear <= 24){
                            if($item->objectjeniskelaminfk == 1){
                                $jumlahumur15ts24tl++;
                            } else if($item->objectjeniskelaminfk == 2){
                                $jumlahumur15ts24tp++;
                            }
                        }
                        else if($item->umuryear >= 25 && $item->umuryear <= 44){
                            if($item->objectjeniskelaminfk == 1){
                                $jumlahumur25ts44tl++;
                            } else if($item->objectjeniskelaminfk == 2){
                                $jumlahumur25ts44tp++;
                            }
                        }
                        else if($item->umuryear >= 45 && $item->umuryear <= 64){
                            if($item->objectjeniskelaminfk == 1){
                                $jumlahumur45ts64tl++;
                            } else if($item->objectjeniskelaminfk == 2){
                                $jumlahumur45ts64tp++;
                            }
                        }
                        else if($item->umuryear > 64){
                            if($item->objectjeniskelaminfk == 1){
                                $jumlahumurlebih64l++;
                            } else if($item->objectjeniskelaminfk == 2){
                                $jumlahumurlebih64p++;
                            }
                        }
        
                        if($item->tglpulang != null && $item->objectjeniskelaminfk == 1){
                            $jumlahpasienkeluarhml++;
                        } else if($item->tglpulang != null && $item->objectjeniskelaminfk == 2){
                            $jumlahpasienkeluarhmp++;
                        }
        
                        if($item->tglpulang != null && $item->objectstatuskeluarfk == 5){
                            $jumlahpasienkeluarmati++;
                        }

                        $totalpasienkeluarhm = $jumlahpasienkeluarhmp + $jumlahpasienkeluarhml;
                        
                    }
                    
                }

                $currentid= $row->id;

                $data10[] = array(
                    'jumlahumur0hs6hl' => $jumlahumur0hs6hl,
                    'jumlahumur0hs6hp' =>  $jumlahumur0hs6hp, 
                    'jumlahumur7hs28hl' =>  $jumlahumur7hs28hl, 
                    'jumlahumur7hs28hp' =>  $jumlahumur7hs28hp, 
                    'jumlahumur29hs1tl' =>  $jumlahumur29hs1tl, 
                    'jumlahumur29hs1tp' =>  $jumlahumur29hs1tp, 
                    'jumlahumur2ts4tl' =>  $jumlahumur2ts4tl, 
                    'jumlahumur2ts4tp' =>  $jumlahumur2ts4tp,
                    'jumlahumur5ts14tl' =>  $jumlahumur5ts14tl, 
                    'jumlahumur5ts14tp' =>  $jumlahumur5ts14tp, 
                    'jumlahumur15ts24tl' =>  $jumlahumur15ts24tl, 
                    'jumlahumur15ts24tp' =>  $jumlahumur15ts24tp, 
                    'jumlahumur25ts44tl' =>  $jumlahumur25ts44tl, 
                    'jumlahumur25ts44tp' =>  $jumlahumur25ts44tp, 
                    'jumlahumur45ts64tl' =>  $jumlahumur45ts64tl, 
                    'jumlahumur45ts64tp' =>  $jumlahumur45ts64tp, 
                    'jumlahumurlebih64l' =>  $jumlahumurlebih64l, 
                    'jumlahumurlebih64p' =>  $jumlahumurlebih64p, 
                    'jumlahpasienkeluarhml' =>  $jumlahpasienkeluarhml, 
                    'jumlahpasienkeluarhmp' =>  $jumlahpasienkeluarhmp, 
                    'totalpasienkeluarhm' =>  $totalpasienkeluarhm, 
                    'jumlahpasienkeluarmati' =>  $jumlahpasienkeluarmati, 
                    'namakota' =>  $namakota, 
                    'namalengkap' =>  $namalengkap, 
                    'namapemerintahan' =>  $namapemerintahan, 
                    'kode' =>  $kode,
                    'nodtd' =>  $nodtd,
                    'nodaftarterperinci' =>  $nodaftarterperinci, 
                    'golongansebabpenyakit' =>  $golongansebabpenyakit,
                    
                );
            }
        }

        $result = array(
            'detail' => $data10,
        );
        
        return $this->setStatusCode(201)->respond($result, 'tes msg');
    }


    public function getLaporanRL4b(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tglAwal = $request['tglAwal'];
        $data10 = [];

        $data = DB::select(DB::raw("select ddtd.id, pd.tglregistrasi,app.statuspenyakit,ddtd.nodtd,ddtd.nodaftarterperinci, lower(ddtd.golongansebabpenyakit) as golongansebabpenyakit, ddp.objectjenisdiagnosafk, jd.jenisdiagnosa, pd.tglpulang,
        ps.tgllahir as tglLahir,
        EXTRACT(YEAR from AGE(pd.tglregistrasi, ps.tgllahir)) as umuryear,
        DATE_PART('day', pd.tglregistrasi::timestamp - ps.tgllahir::timestamp) as umurday,
        ps.objectjeniskelaminfk,pd.objectstatuskeluarfk,sk.statuskeluar, sp.statuspulang
        from pasiendaftar_t as pd
        inner join antrianpasiendiperiksa_t as app on app.noregistrasifk = pd.norec 
		inner join pasien_m as ps on ps.id = pd.nocmfk
		inner join jeniskelamin_m as jk on ps.objectjeniskelaminfk = jk.id
		inner join ruangan_m ru on ru.id = app.objectruanganfk
		inner join departemen_m dpm on dpm.id = ru.objectdepartemenfk
		inner join diagnosapasien_t as dp on dp.noregistrasifk = app.norec
        inner join detaildiagnosapasien_t as ddp on ddp.objectdiagnosapasienfk = dp.norec
		inner join jenisdiagnosa_m jd on jd.id = ddp.objectjenisdiagnosafk
        inner join diagnosa_m as dm on ddp.objectdiagnosafk = dm.id
        inner join mappingrlmorbiditas_m as mpr on mpr.kddiagnosa = dm.kddiagnosa
        inner join diagnosadtd_m as ddtd on ddtd.nodtd = mpr.nodtd
		left join statuskeluar_m sk on sk.id = pd.objectstatuskeluarfk
        left join statuspulang_m sp on sp.id = pd.objectstatuspulangfk
        where pd.statusenabled = true 
        and pd.kdprofile = $kdProfile 
        and ru.objectdepartemenfk <> 16
        --and (jd.id = 1 or jd.id = 7)
        and ddtd.id between 1 and 507
        and pd.tglregistrasi between '$tglAwal-01-01' and '$tglAwal-12-31'
        order by ddtd.id"));

        $id = DB::select(DB::raw("select ddtd.id, ddtd.nodtd, ddtd.nodaftarterperinci, ddtd.golongansebabpenyakit, pr.id idprofile, pr.namakota, pr.namapemerintahan, pr.namalengkap from diagnosadtd_m ddtd
        inner join profile_m pr on pr.id = ddtd.kdprofile
        where ddtd.id between 1 and 507 and pr.id = $kdProfile order by ddtd.id"));

        
        $jumlahumur0hs6hl = 0;
        $jumlahumur0hs6hp = 0;
        $jumlahumur7hs28hl = 0;
        $jumlahumur7hs28hp = 0;
        $jumlahumur29hs1tl = 0;
        $jumlahumur29hs1tp = 0;
        $jumlahumur2ts4tl = 0;
        $jumlahumur2ts4tp = 0;
        $jumlahumur5ts14tl = 0;
        $jumlahumur5ts14tp = 0;
        $jumlahumur15ts24tl = 0;
        $jumlahumur15ts24tp = 0;
        $jumlahumur25ts44tl = 0;
        $jumlahumur25ts44tp = 0;
        $jumlahumur45ts64tl = 0;
        $jumlahumur45ts64tp = 0;
        $jumlahumurlebih64l = 0;
        $jumlahumurlebih64p = 0;
        $jumlahpasienkeluarhml = 0;
        $jumlahpasienkeluarhmp = 0;
        $totalpasienkeluarhm = 0;
        $jumlahpasienkeluarmati = 0;

        $currentid = 99999;

        foreach($id as $row){
            $namakota = $row->namakota;
            $namalengkap = $row->namalengkap;
            $namapemerintahan = $row->namapemerintahan;
            $kode = $row->idprofile;
            $nodaftarterperinci = $row->nodaftarterperinci;
            $golongansebabpenyakit = $row->golongansebabpenyakit;
            $nodtd = $row->nodtd;

            $jumlahumur0hs6hl = 0;
                    $jumlahumur0hs6hp = 0;
                    $jumlahumur7hs28hl = 0;
                    $jumlahumur7hs28hp = 0;
                    $jumlahumur29hs1tl = 0;
                    $jumlahumur29hs1tp = 0;
                    $jumlahumur2ts4tl = 0;
                    $jumlahumur2ts4tp = 0;
                    $jumlahumur5ts14tl = 0;
                    $jumlahumur5ts14tp = 0;
                    $jumlahumur15ts24tl = 0;
                    $jumlahumur15ts24tp = 0;
                    $jumlahumur25ts44tl = 0;
                    $jumlahumur25ts44tp = 0;
                    $jumlahumur45ts64tl = 0;
                    $jumlahumur45ts64tp = 0;
                    $jumlahumurlebih64l = 0;
                    $jumlahumurlebih64p = 0;
                    $jumlahpasienkeluarhml = 0;
                    $jumlahpasienkeluarhmp = 0;
                    $jumlahpasienkeluarmati = 0;
                    $totalpasienkeluarhm = 0;

            if($row->id != $currentid){
                foreach ($data as $item) {
                    if($row->id == $item->id){
                        if($item->umurday <= 6){
                            if($item->objectjeniskelaminfk == 1){
                                $jumlahumur0hs6hl++;
                            } else if($item->objectjeniskelaminfk == 2){
                                $jumlahumur0hs6hp++;
                            }
                        }
                        else if($item->umurday >= 7 && $item->umurday <= 28){
                            if($item->objectjeniskelaminfk == 1){
                                $jumlahumur7hs28hl++;
                            } else if($item->objectjeniskelaminfk == 2){
                                $jumlahumur7hs28hp++;
                            }
                        }
                        else if($item->umurday >= 29 && $item->umuryear <= 1){
                            if($item->objectjeniskelaminfk == 1){
                                $jumlahumur29hs1tl++;
                            } else if($item->objectjeniskelaminfk == 2){
                                $jumlahumur29hs1tp++;
                            }
                        }
                        else if($item->umuryear >= 2 && $item->umuryear <= 4){
                            if($item->objectjeniskelaminfk == 1){
                                $jumlahumur2ts4tl++;
                            } else if($item->objectjeniskelaminfk == 2){
                                $jumlahumur2ts4tp++;
                            }
                        }
                        else if($item->umuryear >= 5 && $item->umuryear <= 14){
                            if($item->objectjeniskelaminfk == 1){
                                $jumlahumur15ts24tl++;
                            } else if($item->objectjeniskelaminfk == 2){
                                $jumlahumur15ts24tp++;
                            }
                        }
                        else if($item->umuryear >= 15 && $item->umuryear <= 24){
                            if($item->objectjeniskelaminfk == 1){
                                $jumlahumur15ts24tl++;
                            } else if($item->objectjeniskelaminfk == 2){
                                $jumlahumur15ts24tp++;
                            }
                        }
                        else if($item->umuryear >= 25 && $item->umuryear <= 44){
                            if($item->objectjeniskelaminfk == 1){
                                $jumlahumur25ts44tl++;
                            } else if($item->objectjeniskelaminfk == 2){
                                $jumlahumur25ts44tp++;
                            }
                        }
                        else if($item->umuryear >= 45 && $item->umuryear <= 64){
                            if($item->objectjeniskelaminfk == 1){
                                $jumlahumur45ts64tl++;
                            } else if($item->objectjeniskelaminfk == 2){
                                $jumlahumur45ts64tp++;
                            }
                        }
                        else if($item->umuryear > 64){
                            if($item->objectjeniskelaminfk == 1){
                                $jumlahumurlebih64l++;
                            } else if($item->objectjeniskelaminfk == 2){
                                $jumlahumurlebih64p++;
                            }
                        }
        
                        if($item->tglpulang != null && $item->objectjeniskelaminfk == 1){
                            $jumlahpasienkeluarhml++;
                        } else if($item->tglpulang != null && $item->objectjeniskelaminfk == 2){
                            $jumlahpasienkeluarhmp++;
                        }
        
                        if($item->tglpulang != null && $item->objectstatuskeluarfk == 5){
                            $jumlahpasienkeluarmati++;
                        }

                        $totalpasienkeluarhm = $jumlahpasienkeluarhmp + $jumlahpasienkeluarhml;
                        
                    }
                    
                }

                $currentid= $row->id;

                $data10[] = array(
                    'jumlahumur0hs6hl' => $jumlahumur0hs6hl,
                    'jumlahumur0hs6hp' =>  $jumlahumur0hs6hp, 
                    'jumlahumur7hs28hl' =>  $jumlahumur7hs28hl, 
                    'jumlahumur7hs28hp' =>  $jumlahumur7hs28hp, 
                    'jumlahumur29hs1tl' =>  $jumlahumur29hs1tl, 
                    'jumlahumur29hs1tp' =>  $jumlahumur29hs1tp, 
                    'jumlahumur2ts4tl' =>  $jumlahumur2ts4tl, 
                    'jumlahumur2ts4tp' =>  $jumlahumur2ts4tp,
                    'jumlahumur5ts14tl' =>  $jumlahumur5ts14tl, 
                    'jumlahumur5ts14tp' =>  $jumlahumur5ts14tp, 
                    'jumlahumur15ts24tl' =>  $jumlahumur15ts24tl, 
                    'jumlahumur15ts24tp' =>  $jumlahumur15ts24tp, 
                    'jumlahumur25ts44tl' =>  $jumlahumur25ts44tl, 
                    'jumlahumur25ts44tp' =>  $jumlahumur25ts44tp, 
                    'jumlahumur45ts64tl' =>  $jumlahumur45ts64tl, 
                    'jumlahumur45ts64tp' =>  $jumlahumur45ts64tp, 
                    'jumlahumurlebih64l' =>  $jumlahumurlebih64l, 
                    'jumlahumurlebih64p' =>  $jumlahumurlebih64p, 
                    'jumlahpasienkeluarhml' =>  $jumlahpasienkeluarhml, 
                    'jumlahpasienkeluarhmp' =>  $jumlahpasienkeluarhmp, 
                    'totalpasienkeluarhm' =>  $totalpasienkeluarhm, 
                    'jumlahpasienkeluarmati' =>  $jumlahpasienkeluarmati, 
                    'namakota' =>  $namakota, 
                    'namalengkap' =>  $namalengkap, 
                    'namapemerintahan' =>  $namapemerintahan, 
                    'kode' =>  $kode,
                    'nodtd' =>  $nodtd,
                    'nodaftarterperinci' =>  $nodaftarterperinci, 
                    'golongansebabpenyakit' =>  $golongansebabpenyakit,
                    
                );
            }
        }

        $result = array(
            'detail' => $data10,
        );
        
        return $this->setStatusCode(201)->respond($result, 'tes msg');
    }

    public function getLaporanRL4bSebabLuar(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tglAwal = $request['tglAwal'];
        $data10 = [];

        $data = DB::select(DB::raw("select ddtd.id, pd.tglregistrasi,app.statuspenyakit,ddtd.nodtd,ddtd.nodaftarterperinci, lower(ddtd.golongansebabpenyakit) as golongansebabpenyakit, ddp.objectjenisdiagnosafk, jd.jenisdiagnosa, pd.tglpulang,
        ps.tgllahir as tglLahir,
        EXTRACT(YEAR from AGE(pd.tglregistrasi, ps.tgllahir)) as umuryear,
        DATE_PART('day', pd.tglregistrasi::timestamp - ps.tgllahir::timestamp) as umurday,
        ps.objectjeniskelaminfk,pd.objectstatuskeluarfk,sk.statuskeluar, sp.statuspulang
        from pasiendaftar_t as pd
        inner join antrianpasiendiperiksa_t as app on app.noregistrasifk = pd.norec 
		inner join pasien_m as ps on ps.id = pd.nocmfk
		inner join jeniskelamin_m as jk on ps.objectjeniskelaminfk = jk.id
		inner join ruangan_m ru on ru.id = app.objectruanganfk
		inner join departemen_m dpm on dpm.id = ru.objectdepartemenfk
		inner join diagnosapasien_t as dp on dp.noregistrasifk = app.norec
        inner join detaildiagnosapasien_t as ddp on ddp.objectdiagnosapasienfk = dp.norec
		inner join jenisdiagnosa_m jd on jd.id = ddp.objectjenisdiagnosafk
        inner join diagnosa_m as dm on ddp.objectdiagnosafk = dm.id
        inner join mappingrlmorbiditas_m as mpr on mpr.kddiagnosa = dm.kddiagnosa
        inner join diagnosadtd_m as ddtd on ddtd.nodtd = mpr.nodtd
		left join statuskeluar_m sk on sk.id = pd.objectstatuskeluarfk
        left join statuspulang_m sp on sp.id = pd.objectstatuspulangfk
        where pd.statusenabled = true 
        and pd.kdprofile = $kdProfile 
        and ru.objectdepartemenfk <> 16
        --and (jd.id = 1 or jd.id = 7)
        and ddtd.id between 508 and 537
        and pd.tglregistrasi between '$tglAwal-01-01' and '$tglAwal-12-31'
        order by ddtd.id"));

        $id = DB::select(DB::raw("select ddtd.id, ddtd.nodtd, ddtd.nodaftarterperinci, ddtd.golongansebabpenyakit, pr.id idprofile, pr.namakota, pr.namapemerintahan, pr.namalengkap from diagnosadtd_m ddtd
        inner join profile_m pr on pr.id = ddtd.kdprofile
        where ddtd.id between 1 and 507 and pr.id = $kdProfile order by ddtd.id"));

        
        $jumlahumur0hs6hl = 0;
        $jumlahumur0hs6hp = 0;
        $jumlahumur7hs28hl = 0;
        $jumlahumur7hs28hp = 0;
        $jumlahumur29hs1tl = 0;
        $jumlahumur29hs1tp = 0;
        $jumlahumur2ts4tl = 0;
        $jumlahumur2ts4tp = 0;
        $jumlahumur5ts14tl = 0;
        $jumlahumur5ts14tp = 0;
        $jumlahumur15ts24tl = 0;
        $jumlahumur15ts24tp = 0;
        $jumlahumur25ts44tl = 0;
        $jumlahumur25ts44tp = 0;
        $jumlahumur45ts64tl = 0;
        $jumlahumur45ts64tp = 0;
        $jumlahumurlebih64l = 0;
        $jumlahumurlebih64p = 0;
        $jumlahpasienkeluarhml = 0;
        $jumlahpasienkeluarhmp = 0;
        $totalpasienkeluarhm = 0;
        $jumlahpasienkeluarmati = 0;

        $currentid = 99999;

        foreach($id as $row){
            $namakota = $row->namakota;
            $namalengkap = $row->namalengkap;
            $namapemerintahan = $row->namapemerintahan;
            $kode = $row->idprofile;
            $nodaftarterperinci = $row->nodaftarterperinci;
            $golongansebabpenyakit = $row->golongansebabpenyakit;
            $nodtd = $row->nodtd;

            $jumlahumur0hs6hl = 0;
                    $jumlahumur0hs6hp = 0;
                    $jumlahumur7hs28hl = 0;
                    $jumlahumur7hs28hp = 0;
                    $jumlahumur29hs1tl = 0;
                    $jumlahumur29hs1tp = 0;
                    $jumlahumur2ts4tl = 0;
                    $jumlahumur2ts4tp = 0;
                    $jumlahumur5ts14tl = 0;
                    $jumlahumur5ts14tp = 0;
                    $jumlahumur15ts24tl = 0;
                    $jumlahumur15ts24tp = 0;
                    $jumlahumur25ts44tl = 0;
                    $jumlahumur25ts44tp = 0;
                    $jumlahumur45ts64tl = 0;
                    $jumlahumur45ts64tp = 0;
                    $jumlahumurlebih64l = 0;
                    $jumlahumurlebih64p = 0;
                    $jumlahpasienkeluarhml = 0;
                    $jumlahpasienkeluarhmp = 0;
                    $jumlahpasienkeluarmati = 0;
                    $totalpasienkeluarhm = 0;

            if($row->id != $currentid){
                foreach ($data as $item) {
                    if($row->id == $item->id){
                        if($item->umurday <= 6){
                            if($item->objectjeniskelaminfk == 1){
                                $jumlahumur0hs6hl++;
                            } else if($item->objectjeniskelaminfk == 2){
                                $jumlahumur0hs6hp++;
                            }
                        }
                        else if($item->umurday >= 7 && $item->umurday <= 28){
                            if($item->objectjeniskelaminfk == 1){
                                $jumlahumur7hs28hl++;
                            } else if($item->objectjeniskelaminfk == 2){
                                $jumlahumur7hs28hp++;
                            }
                        }
                        else if($item->umurday >= 29 && $item->umuryear <= 1){
                            if($item->objectjeniskelaminfk == 1){
                                $jumlahumur29hs1tl++;
                            } else if($item->objectjeniskelaminfk == 2){
                                $jumlahumur29hs1tp++;
                            }
                        }
                        else if($item->umuryear >= 2 && $item->umuryear <= 4){
                            if($item->objectjeniskelaminfk == 1){
                                $jumlahumur2ts4tl++;
                            } else if($item->objectjeniskelaminfk == 2){
                                $jumlahumur2ts4tp++;
                            }
                        }
                        else if($item->umuryear >= 5 && $item->umuryear <= 14){
                            if($item->objectjeniskelaminfk == 1){
                                $jumlahumur15ts24tl++;
                            } else if($item->objectjeniskelaminfk == 2){
                                $jumlahumur15ts24tp++;
                            }
                        }
                        else if($item->umuryear >= 15 && $item->umuryear <= 24){
                            if($item->objectjeniskelaminfk == 1){
                                $jumlahumur15ts24tl++;
                            } else if($item->objectjeniskelaminfk == 2){
                                $jumlahumur15ts24tp++;
                            }
                        }
                        else if($item->umuryear >= 25 && $item->umuryear <= 44){
                            if($item->objectjeniskelaminfk == 1){
                                $jumlahumur25ts44tl++;
                            } else if($item->objectjeniskelaminfk == 2){
                                $jumlahumur25ts44tp++;
                            }
                        }
                        else if($item->umuryear >= 45 && $item->umuryear <= 64){
                            if($item->objectjeniskelaminfk == 1){
                                $jumlahumur45ts64tl++;
                            } else if($item->objectjeniskelaminfk == 2){
                                $jumlahumur45ts64tp++;
                            }
                        }
                        else if($item->umuryear > 64){
                            if($item->objectjeniskelaminfk == 1){
                                $jumlahumurlebih64l++;
                            } else if($item->objectjeniskelaminfk == 2){
                                $jumlahumurlebih64p++;
                            }
                        }
        
                        if($item->tglpulang != null && $item->objectjeniskelaminfk == 1){
                            $jumlahpasienkeluarhml++;
                        } else if($item->tglpulang != null && $item->objectjeniskelaminfk == 2){
                            $jumlahpasienkeluarhmp++;
                        }
        
                        if($item->tglpulang != null && $item->objectstatuskeluarfk == 5){
                            $jumlahpasienkeluarmati++;
                        }

                        $totalpasienkeluarhm = $jumlahpasienkeluarhmp + $jumlahpasienkeluarhml;
                        
                    }
                    
                }

                $currentid= $row->id;

                $data10[] = array(
                    'jumlahumur0hs6hl' => $jumlahumur0hs6hl,
                    'jumlahumur0hs6hp' =>  $jumlahumur0hs6hp, 
                    'jumlahumur7hs28hl' =>  $jumlahumur7hs28hl, 
                    'jumlahumur7hs28hp' =>  $jumlahumur7hs28hp, 
                    'jumlahumur29hs1tl' =>  $jumlahumur29hs1tl, 
                    'jumlahumur29hs1tp' =>  $jumlahumur29hs1tp, 
                    'jumlahumur2ts4tl' =>  $jumlahumur2ts4tl, 
                    'jumlahumur2ts4tp' =>  $jumlahumur2ts4tp,
                    'jumlahumur5ts14tl' =>  $jumlahumur5ts14tl, 
                    'jumlahumur5ts14tp' =>  $jumlahumur5ts14tp, 
                    'jumlahumur15ts24tl' =>  $jumlahumur15ts24tl, 
                    'jumlahumur15ts24tp' =>  $jumlahumur15ts24tp, 
                    'jumlahumur25ts44tl' =>  $jumlahumur25ts44tl, 
                    'jumlahumur25ts44tp' =>  $jumlahumur25ts44tp, 
                    'jumlahumur45ts64tl' =>  $jumlahumur45ts64tl, 
                    'jumlahumur45ts64tp' =>  $jumlahumur45ts64tp, 
                    'jumlahumurlebih64l' =>  $jumlahumurlebih64l, 
                    'jumlahumurlebih64p' =>  $jumlahumurlebih64p, 
                    'jumlahpasienkeluarhml' =>  $jumlahpasienkeluarhml, 
                    'jumlahpasienkeluarhmp' =>  $jumlahpasienkeluarhmp, 
                    'totalpasienkeluarhm' =>  $totalpasienkeluarhm, 
                    'jumlahpasienkeluarmati' =>  $jumlahpasienkeluarmati, 
                    'namakota' =>  $namakota, 
                    'namalengkap' =>  $namalengkap, 
                    'namapemerintahan' =>  $namapemerintahan, 
                    'kode' =>  $kode,
                    'nodtd' =>  $nodtd,
                    'nodaftarterperinci' =>  $nodaftarterperinci, 
                    'golongansebabpenyakit' =>  $golongansebabpenyakit,
                    
                );
            }
        }

        $result = array(
            'detail' => $data10,
        );
        
        return $this->setStatusCode(201)->respond($result, 'tes msg');
    }

    public function getDataLaporanRL51(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];


        $data = DB::select(DB::raw("select *, (case when x.statuspasienfix = 'LAMA' THEN 'Pengunjung Lama' else 'Pengunjung Baru' end) as statuspasienfixbanget from(
            select to_char(pd.tglregistrasi, 'Month') as month, to_char(pd.tglregistrasi, 'mm') as idmonth, to_char(pd.tglregistrasi, 'YYYY') as year,count(pd.tglregistrasi) as jumlahkunjungan,
                    (case when pd.statuspasien is null then 'LAMA' else pd.statuspasien end) as statuspasienfix,
                            pr.namalengkap, pr.namapemerintahan, pr.namakota, pr.id idprofile
                    from pasiendaftar_t pd
                    inner join profile_m pr on pr.id = pd.kdprofile
                    inner join pasien_m as pm on pm.id = pd.nocmfk
                    where pd.statusenabled = true and pd.kdprofile = $kdProfile
                    and pd.tglregistrasi between '$tglAwal' and '$tglAkhir'
                    group by to_char(pd.tglregistrasi, 'Month'), to_char(pd.tglregistrasi, 'mm'), to_char(pd.tglregistrasi, 'YYYY'), (case when pd.statuspasien is null then 'LAMA' else pd.statuspasien end), pr.namalengkap, pr.namapemerintahan, pr.namakota, pr.id
                    order by to_char(pd.tglregistrasi, 'YYYY'), to_char(pd.tglregistrasi, 'mm')) as x"));

        $result = array(
            'data' => $data,
            'message' => 'larasatizka',
        );
        return $this->respond($result);
    }
    public function getDataLaporanRL52(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $bulan = [];

        $data = DB::select(DB::raw("select pd.tglregistrasi::date, rtrim(to_char(pd.tglregistrasi, 'Month'), ' ') as month, ru.namaruangan, ru.id, count(apd.objectruanganfk) jumlahkunjungan, dp.namadepartemen, ru.objectdepartemenfk, pr.namalengkap, pr.namapemerintahan, pr.namakota, pr.id as idprofile
        from
        pasien_m ps 
        inner join pasiendaftar_t pd on ps.id=pd.nocmfk
        inner join antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
        inner join ruangan_m ru on ru.id = apd.objectruanganfk
        inner join departemen_m dp on dp.id = ru.objectdepartemenfk
        inner join profile_m pr on pr.id = pd.kdprofile
        where pd.statusenabled = true and pd.kdprofile = $kdProfile
        and ru.objectdepartemenfk <> 16
        and pd.tglregistrasi between '$tglAwal' and '$tglAkhir'
        group by pd.tglregistrasi::date, ru.namaruangan, ru.id, dp.namadepartemen, ru.objectdepartemenfk, pr.namalengkap, pr.namapemerintahan, pr.namakota, pr.id, rtrim(to_char(pd.tglregistrasi, 'Month'), ' ')
        order by pd.tglregistrasi::date"));

        $querybulan = DB::select(DB::raw("select rtrim(to_char(pd.tglregistrasi, 'Month'), ' ') as month, to_char(pd.tglregistrasi, 'mm') as idmonth
        from
                pasien_m ps 
                inner join pasiendaftar_t pd on ps.id=pd.nocmfk
                inner join antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                inner join ruangan_m ru on ru.id = apd.objectruanganfk
                where pd.statusenabled = true and pd.kdprofile = $kdProfile
                and ru.objectdepartemenfk <> 16
                and pd.tglregistrasi between '$tglAwal' and '$tglAkhir'
                        group by rtrim(to_char(pd.tglregistrasi, 'Month'), ' '), to_char(pd.tglregistrasi, 'mm')
                order by idmonth"));

        foreach($querybulan as $q){
            array_push($bulan, $q->month);
        }

        $main = array("Penyakit Dalam", "Bedah", "Kesehatan Anak (Neonatal)", "Kesehatan Anak Lainnya", "Obstetri & Ginekologi (Ibu Hamil)", "Obstetri & Ginekologi Lainnya", "Keluarga Berencana", "Bedah Saraf", "Saraf", "Jiwa", "NAPZA", "Psikologi", "THT", "Mata", "Kulit dan Kelamin", "Gigi & Mulut", "Geriatri", "Kardiologi", "Radiologi", "Bedah Orthopedi", "Paru-paru", "Kusta", "Umum", "Rawat Darurat", "Rehabilitasi Medik", "Akupuntur Medik", "Konsultasi Gizi", "Day Care", "Lain-Lain", "TOTAL");
        //$bulan = array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
        $currentnama = "Larasatizka";
        $currentmonth = "Ayuningtyas";

        $jumlah = 0;
        $total = 0;
        $data10 = [];
        $totalfix = 0;

        
        foreach($bulan as $month){
            if($month != $currentmonth){
                $total = 0;
                $totalfix = 0;
                foreach($main as $row){
                    if($row != $currentnama){
                        $jumlah = 0;
                        
                        foreach($data as $item){
                           $koders = $item->idprofile;
                           $namars = $item->namalengkap;
                           $namakota = $item->namakota;
                           $idprofile = $item->idprofile;
                            if($row == "Penyakit Dalam" && $item->id == 765 && $item->month == $month){
                                $jumlah += $item->jumlahkunjungan;
                                $total += $item->jumlahkunjungan;
                            } else if($row == "Bedah" && $item->id == 44 && $item->month == $month){
                                $jumlah += $item->jumlahkunjungan;
                                $total += $item->jumlahkunjungan;
                            } else if($row == "Kesehatan Anak (Neonatal)"  && $item->month == $month){
                                $jumlah += 0;
                                $total += $item->jumlahkunjungan;
                            } else if($row == "Kesehatan Anak Lainnya" && ($item->id == 753 || $item->id == 775) && $item->month == $month){
                                $jumlah += $item->jumlahkunjungan;
                                $total += $item->jumlahkunjungan;
                            } else if($row == "Obstetri & Ginekologi (Ibu Hamil)"  && $item->month == $month){
                                $jumlah += 0;
                                $total += $item->jumlahkunjungan;
                            } else if($row == "Obstetri & Ginekologi Lainnya"  && $item->month == $month){
                                $jumlah += 0;
                                $total += $item->jumlahkunjungan;
                            } else if($row == "Keluarga Berencana"  && $item->month == $month){
                                $jumlah += 0;
                                $total += $item->jumlahkunjungan;
                            } else if($row == "Bedah Saraf"  && $item->month == $month){
                                $jumlah += 0;
                                $total += $item->jumlahkunjungan;
                            } else if($row == "Saraf" && $item->id == 755 && $item->month == $month){
                                $jumlah += $item->jumlahkunjungan;
                                $total += $item->jumlahkunjungan;
                            } else if($row == "Jiwa" && ($item->id == 785 || $item->id == 752 || $item->id == 782) && $item->month == $month){
                                $jumlah += $item->jumlahkunjungan;
                                $total += $item->jumlahkunjungan;
                            } else if($row == "NAPZA" && ($item->id == 768 || $item->id == 789) && $item->month == $month){
                                $jumlah += $item->jumlahkunjungan;
                                $total += $item->jumlahkunjungan;
                            } else if($row == "Psikologi" && ($item->id == 807 || $item->id == 767 || $item->id == 791) && $item->month == $month){
                                $jumlah += $item->jumlahkunjungan;
                                $total += $item->jumlahkunjungan;
                            } else if($row == "THT"  && $item->month == $month){
                                $jumlah += 0;
                                $total += $item->jumlahkunjungan;
                            } else if($row == "Mata"  && $item->month == $month){
                                $jumlah += 0;
                                $total += $item->jumlahkunjungan;
                            } else if($row == "Kulit dan Kelamin" && $item->id == 754 && $item->month == $month){
                                $jumlah += $item->jumlahkunjungan;
                                $total +=$item->jumlahkunjungan;
                            } else if($row == "Gigi & Mulut" && $item->id == 759 && $item->month == $month){
                                $jumlah += $item->jumlahkunjungan;
                                $total +=$item->jumlahkunjungan;
                            } else if($row == "Geriatri"  && $item->month == $month){
                                $jumlah += 0;
                                $total +=$item->jumlahkunjungan;
                            } else if($row == "Kardiologi"  && $item->month == $month){
                                $jumlah += 0;
                                $total +=$item->jumlahkunjungan;
                            } else if($row == "Radiologi" && $item->id == 576 && $item->month == $month){
                                $jumlah += $item->jumlahkunjungan;
                                $total +=$item->jumlahkunjungan;
                            } else if($row == "Bedah Orthopedi"  && $item->month == $month){
                                $jumlah += 0;
                                $total +=$item->jumlahkunjungan;
                            } else if($row == "Paru-paru"  && $item->month == $month){
                                $jumlah += 0;
                                $total += $item->jumlahkunjungan;
                            } else if($row == "Kusta"  && $item->month == $month){
                                $jumlah += 0;
                                $total += $item->jumlahkunjungan;
                            } else if($row == "Umum" && ($item->id == 758 || $item->id == 771) && $item->month == $month){
                                $jumlah += $item->jumlahkunjungan;
                                $total += $item->jumlahkunjungan;
                            } else if($row == "Rawat Darurat" && ($item->id == 765 || $item->id == 766) && $item->month == $month){
                                $jumlah += $item->jumlahkunjungan;
                                $total += $item->jumlahkunjungan;
                            } else if($row == "Akupuntur Medik" && $item->id == 772 && $item->month == $month){
                                $jumlah += $item->jumlahkunjungan;
                                $total += $item->jumlahkunjungan;
                            } else if($row == "Konsultasi Gizi" && $item->id == 784 && $item->month == $month){
                                $jumlah += $item->jumlahkunjungan;
                                $total += $item->jumlahkunjungan;
                            } else if($row == "Day Care" && $item->id == 779 && $item->month == $month){
                                $jumlah += $item->jumlahkunjungan;
                                $total += $item->jumlahkunjungan;
                            } else if($row == "Lain-Lain" && $item->month == $month && $item->id != 779 && $item->id != 784 && $item->id != 772 && $item->id != 765 && $item->id != 766 && $item->id != 758 && $item->id != 576 && $item->id != 759 && $item->id != 754 && $item->id != 807 && $item->id != 767 && $item->id != 791 && $item->id != 768 && $item->id != 789 && $item->id != 785 && $item->id != 752 && $item->id != 755 && $item->id != 753 && $item->id != 775 && $item->id != 44 && $item->id != 782 && $item->id != 771){
                                $jumlah += $item->jumlahkunjungan;
                                $total += $item->jumlahkunjungan;
                            } 
                            
                            
                       }

                        $totalfix += $jumlah;

                        if($row == "TOTAL"){
                            $jumlah = $totalfix;
                        }

                        $data10[] = array(
                            // 'koders' => $koders,
                            // 'namars' =>  $namars, 
                            // 'namakota' =>  $namakota, 
                            'jumlah' =>  $jumlah,
                            'hasilbulan' =>  $month,
                            'hasilnama' =>  $row, 
                            'koders' =>  $koders,
                            'namars' =>  $namars,
                            'namakota' =>  $namakota,
                            'idprofile' =>  $idprofile, 
                        );

                       $currentnama = $row;
                    }
                }
                $currentmonth = $month;
            }
        }
        
        $result = array(
            'data' => $data10,
            'message' => 'larasatizka',
        );

        return $this->respond($result);
    }
    

    public function getDataLaporanRL53(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        // $kdDeptRanapAll = explode(',',$this->settingDataFixed('KdDepartemenRIAll',$kdProfile));
        // $kdDepartemenRanapAll = [];
        // foreach ($kdDeptRanapAll as $items){
        //     $kdDepartemenRanapAll []=  (int)$items;
        // }

        $data = DB::select(DB::raw("select x.month, x.idmonth, x.year,x.nodaftarterperinci, x.golongansebabpenyakit, 
        sum(x.jumlahhml) jumlahhml, sum(x.jumlahhmp) jumlahhmp, sum(x.jumlahml) jumlahml, sum(x.jumlahmp) jumlahmp, sum(x.totalall) totalall,
        x.namalengkap, x.namapemerintahan, x.namakota, x.idprofile 
        from(
                select to_char(pd.tglregistrasi, 'Month') as month, to_char(pd.tglregistrasi, 'mm') as idmonth, to_char(pd.tglregistrasi, 'YYYY') as year,dm.kddiagnosa as nodaftarterperinci, dm.namadiagnosa as golongansebabpenyakit,
                (case when jk.id = 1 and sk.id != 5  then count(dm.kddiagnosa) else 0 end) as jumlahhml,
                (case when jk.id = 2 and sk.id != 5  then count(dm.kddiagnosa) else 0 end) as jumlahhmp,
                (case when jk.id = 1 and sk.id = 5 then count(dm.kddiagnosa) else 0 end) as jumlahml,
                (case when jk.id = 2 and sk.id = 5 then count(dm.kddiagnosa) else 0 end) as jumlahmp,
                ((case when jk.id = 1 and sk.id != 5 then count(dm.kddiagnosa) else 0 end) + (case when jk.id = 2 and sk.id != 5 then count(dm.kddiagnosa) else 0 end) + (case when jk.id = 1 and sk.id = 5 then count(dm.kddiagnosa) else 0 end) + (case when jk.id = 2 and sk.id = 5 then count(dm.kddiagnosa) else 0 end)) as totalall,
                pr.namalengkap, pr.namapemerintahan, pr.namakota, pr.id idprofile
                from pasiendaftar_t as pd
        inner join antrianpasiendiperiksa_t as app on app.noregistrasifk = pd.norec 
        inner join pasien_m as ps on ps.id = pd.nocmfk
        inner join jeniskelamin_m as jk on ps.objectjeniskelaminfk = jk.id
        inner join ruangan_m ru on ru.id = app.objectruanganfk
        inner join departemen_m dpm on dpm.id = ru.objectdepartemenfk
        inner join profile_m pr on pr.id = pd.kdprofile
        inner join diagnosapasien_t as dp on dp.noregistrasifk = app.norec
        inner join detaildiagnosapasien_t as ddp on ddp.objectdiagnosapasienfk = dp.norec
		inner join diagnosa_m as dm on ddp.objectdiagnosafk = dm.id
		inner join jenisdiagnosa_m jd on jd.id = ddp.objectjenisdiagnosafk
		left join statuskeluar_m sk on sk.id = pd.objectstatuskeluarfk
        left join statuspulang_m sp on sp.id = pd.objectstatuspulangfk
        where pd.statusenabled = true 
        and pd.kdprofile = $kdProfile 
        and ru.objectdepartemenfk = 16
        --and (jd.id = 1 or jd.id = 7)
        and pd.tglregistrasi between '$tglAwal' and '$tglAkhir'
                group by to_char(pd.tglregistrasi, 'Month'), to_char(pd.tglregistrasi, 'mm'), to_char(pd.tglregistrasi, 'YYYY'), dm.kddiagnosa, dm.namadiagnosa, jk.id, sk.id, pr.namalengkap, pr.namapemerintahan, pr.namakota, pr.id
        ) as x
        group by x.month, x.idmonth, x.year,x.nodaftarterperinci, x.golongansebabpenyakit, x.namalengkap, x.namapemerintahan, x.namakota, x.idprofile
        order by totalall desc limit 10;"));
        

        $result = array(
            'data' => $data,
            'message' => '@larasatizka',
        );

        return $this->respond($result);
    }
    public function getDataLaporanRL54(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];


        $data = DB::select(DB::raw("select x.month, x.idmonth, x.year,x.nodaftarterperinci, x.golongansebabpenyakit, 
        sum(x.jumlahbarul) jumlahbarul, sum(x.jumlahbarup) jumlahbarup, sum(x.jumlahbaru) jumlahbaru, sum(x.jumlahkunjungan) jumlahkunjungan,
        x.namalengkap, x.namapemerintahan, x.namakota, x.idprofile, x.iskasusbaru
        from(
                select to_char(pd.tglregistrasi, 'Month') as month, to_char(pd.tglregistrasi, 'mm') as idmonth, to_char(pd.tglregistrasi, 'YYYY') as year,dm.kddiagnosa as nodaftarterperinci, dm.namadiagnosa as golongansebabpenyakit,
                (case when jk.id = 1 and dp.iskasusbaru = true  then count(dm.kddiagnosa) else 0 end) as jumlahbarul,
                (case when jk.id = 2 and dp.iskasusbaru = true  then count(dm.kddiagnosa) else 0 end) as jumlahbarup,
                ((case when jk.id = 1 and dp.iskasusbaru = true  then count(dm.kddiagnosa) else 0 end) + (case when jk.id = 2 and dp.iskasusbaru = true  then count(dm.kddiagnosa) else 0 end)) as jumlahbaru,
                count(dm.kddiagnosa) as jumlahkunjungan,
                pr.namalengkap, pr.namapemerintahan, pr.namakota, pr.id idprofile, dp.iskasusbaru
                from pasiendaftar_t as pd
                inner join antrianpasiendiperiksa_t as app on app.noregistrasifk = pd.norec 
                inner join pasien_m as ps on ps.id = pd.nocmfk
                inner join jeniskelamin_m as jk on ps.objectjeniskelaminfk = jk.id
                inner join ruangan_m ru on ru.id = app.objectruanganfk
                inner join departemen_m dpm on dpm.id = ru.objectdepartemenfk
                inner join profile_m pr on pr.id = pd.kdprofile
                inner join diagnosapasien_t as dp on dp.noregistrasifk = app.norec
                inner join detaildiagnosapasien_t as ddp on ddp.objectdiagnosapasienfk = dp.norec
                inner join diagnosa_m as dm on ddp.objectdiagnosafk = dm.id
                inner join jenisdiagnosa_m jd on jd.id = ddp.objectjenisdiagnosafk
        where pd.statusenabled = true 
        and pd.kdprofile = $kdProfile 
        and ru.objectdepartemenfk <> 16
        --and (jd.id = 1 or jd.id = 7)
        and pd.tglregistrasi between '$tglAwal' and '$tglAkhir'
        group by to_char(pd.tglregistrasi, 'Month'), to_char(pd.tglregistrasi, 'mm'), to_char(pd.tglregistrasi, 'YYYY'), dm.kddiagnosa, dm.namadiagnosa, jk.id, pr.namalengkap, pr.namapemerintahan, pr.namakota, pr.id, dp.iskasusbaru
        ) as x
        group by x.month, x.idmonth, x.year,x.nodaftarterperinci, x.golongansebabpenyakit, x.namalengkap, x.namapemerintahan, x.namakota, x.idprofile, x.iskasusbaru
        order by jumlahbaru desc, jumlahkunjungan desc limit 10;"));
        
        $result = array(
            'data' => $data,
            'message' => '@larasatizka',
        );

        return $this->respond($result);
    }
    public function getDataLaporanPasienMasuk(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $idDepRawatInap = (int) $this->settingDataFixed('idDepRawatInap', $kdProfile);
        $dataLogin = $request->all();
        $data = \DB::table('pasiendaftar_t as pd')
            ->JOIN ('antrianpasiendiperiksa_t as apd','apd.noregistrasifk','=','pd.norec')
            ->JOIN ('registrasipelayananpasien_t as rpp','rpp.noregistrasifk','=','pd.norec')
            ->JOIN ('diagnosapasien_t as dp','dp.noregistrasifk','=','apd.norec')
            ->leftJOIN ('detaildiagnosapasien_t as ddp','ddp.noregistrasifk','=','apd.norec')
            ->leftJOIN ('diagnosa_m as d','d.id','=','ddp.objectdiagnosafk')
            ->leftJOIN ('pasien_m as ps','ps.id','=','pd.nocmfk')
            ->leftJOIN ('jeniskelamin_m as jk','jk.id','=','ps.objectjeniskelaminfk')
            ->leftJOIN ('pegawai_m as pg','pg.id','=','pd.objectpegawaifk')
            ->leftJOIN ('kelompokpasien_m as kps','kps.id','=','pd.objectkelompokpasienlastfk')
            ->leftJOIN ('rekanan_m as rek','rek.id','=','pd.objectrekananfk')
            ->leftJOIN ('kamar_m as km','km.id','=','apd.objectkamarfk')
            ->leftJOIN ('kelas_m as kls','kls.id','=','apd.objectkelasfk')
            ->leftJOIN ('ruangan_m as ru','ru.id','=','pd.objectruanganlastfk')
            ->select('pd.noregistrasi','ps.nocm', 'ps.namapasien','d.kddiagnosa',
                'kps.kelompokpasien','rek.namarekanan',
                'jk.jeniskelamin', 'apd.tglkeluar', 'apd.nobed', 'apd.objectkamarfk','km.namakamar',
                'kls.namakelas','d.kddiagnosa','d.namadiagnosa','ru.namaruangan','pd.tglregistrasi as tglmasukinap',
                'pd.objectstatuskeluarfk',
                DB::raw('pg.namalengkap as dokter,
                case WHEn pd.tglpulang is not null then \'Dipulangkan\' else \'Masih Dirawat\' end as carakeluar,
                  case when ru.objectdepartemenfk =16 then \'Masuk\' else null end as mutasi'
                )
            )
            ->where('pd.kdprofile', $kdProfile)
            ->Where('ru.objectdepartemenfk','=',$idDepRawatInap);

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];//." 23:59:59";
            $data = $data->where('pd.tglregistrasi', '<=', $tgl);
        }
        if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
            $data = $data->where('ru.objectdepartemenfk', '=', $request['idDept']);
        }
        if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
            $data = $data->where('ru.id', '=', $request['idRuangan']);
        }
        if (isset($request['idKelas']) && $request['idKelas'] != "" && $request['idKelas'] != "undefined") {
            $data = $data->where('kls.id', '=', $request['idKelas']);
        }
        $data = $data->distinct();
        $data = $data->get();

        $data10 =[];
        $sama=false;

        foreach ($data as $item) {
            $sama=false;
            $i=0;
            foreach ($data10 as $hideung){
                if ($item->noregistrasi == $data10[$i]['noregistrasi']){
                    $sama=true;
                    $data10[$i]['kddiagnosa']=$data10[$i]['kddiagnosa']. ', '.($item->kddiagnosa);
                }
                $i=$i+1;
            }
            if ($sama==false){
                $data10[]=array(
                    'noregistrasi'=>$item->noregistrasi,
                    'namapasien'=>$item->namapasien,
                    'nocm'=>$item->nocm,
                    'namakamar'=>$item->namakamar,
                    'nobed'=>$item->nobed,
                    'namaruangan'=>$item->namaruangan,
                    'kelompokpasien'=>$item->kelompokpasien,
                    'namarekanan'=>$item->namarekanan,
                    'tglmasukinap'=>$item->tglmasukinap,
                    'dokter'=>$item->dokter,
                    'namakelas'=>$item->namakelas,
                    'carakeluar'=>$item->carakeluar,
                    'kddiagnosa'=>$item->kddiagnosa,
                    'mutasi'=>$item->mutasi,
                );
            }
        }

        $result = array(
            'data' => $data10,
            'message' => 'as@Ramdan',
        );

        return $this->respond($result);
    }
    public function getDataLaporanPasienKeluar(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $dataLogin = $request->all();
        $kdDeptRanapAll = explode(',',$this->settingDataFixed('KdDepartemenRIAll',$kdProfile));
        $kdDepartemenRanapAll = [];
        foreach ($kdDeptRanapAll as $items){
            $kdDepartemenRanapAll []=  (int)$items;
        }
        $data = \DB::table('pasiendaftar_t as pd')
            ->JOIN ('antrianpasiendiperiksa_t as apd','apd.noregistrasifk','=','pd.norec')
            ->Join ('registrasipelayananpasien_t as rpp','rpp.noregistrasifk','=','pd.norec')
            ->Join ('diagnosapasien_t as dp','dp.noregistrasifk','=','apd.norec')
            ->leftJOIN ('detaildiagnosapasien_t as ddp','ddp.noregistrasifk','=','apd.norec')
            ->leftJOIN ('diagnosa_m as d','d.id','=','ddp.objectdiagnosafk')
            ->leftJOIN ('pasien_m as ps','ps.id','=','pd.nocmfk')
            ->leftJOIN ('jeniskelamin_m as jk','jk.id','=','ps.objectjeniskelaminfk')
            ->leftJOIN ('pegawai_m as pg','pg.id','=','pd.objectpegawaifk')
            ->leftJOIN ('kelompokpasien_m as kps','kps.id','=','pd.objectkelompokpasienlastfk')
            ->leftJOIN ('rekanan_m as rek','rek.id','=','pd.objectrekananfk')
            ->leftJOIN ('kamar_m as km','km.id','=','apd.objectkamarfk')
            ->leftJOIN ('kelas_m as kls','kls.id','=','apd.objectkelasfk')
            ->leftJOIN ('ruangan_m as ru','ru.id','=','pd.objectruanganlastfk')
            ->select('pd.noregistrasi','ps.nocm', 'ps.namapasien','d.kddiagnosa',
                'kps.kelompokpasien','rek.namarekanan',
                'jk.jeniskelamin', 'apd.tglkeluar', 'apd.nobed', 'apd.objectkamarfk','km.namakamar',
                'kls.namakelas','d.kddiagnosa','d.namadiagnosa','ru.namaruangan','pd.tglregistrasi as tglmasukinap',
                'pd.objectstatuskeluarfk','pd.tglpulang',
                DB::raw('pg.namalengkap as dokter,
                case when pd.tglpulang is not null then \'Keluar\' end as mutasi,
                 case when pd.tglpulang is not null then \'Dipulangkan\' end as carakeluar'
                ))
            ->where('pd.kdprofile',$kdProfile)
            ->whereNotNull('pd.tglpulang')
            ->WhereIN('ru.objectdepartemenfk',$kdDepartemenRanapAll);


        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglpulang', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];//." 23:59:59";
            $data = $data->where('pd.tglpulang', '<=', $tgl);
        }
        if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
            $data = $data->where('ru.objectdepartemenfk', '=', $request['idDept']);
        }
        if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
            $data = $data->where('ru.id', '=', $request['idRuangan']);
        }
        if (isset($request['idKelas']) && $request['idKelas'] != "" && $request['idKelas'] != "undefined") {
            $data = $data->where('kls.id', '=', $request['idKelas']);
        }
        $data = $data->distinct();
        $data = $data->get();

        $data10 =[];
        $sama=false;

        foreach ($data as $item) {
            $sama=false;
            $i=0;
            foreach ($data10 as $hideung){
                if ($item->noregistrasi == $data10[$i]['noregistrasi']){
                    $sama=true;
                    $data10[$i]['kddiagnosa']=$data10[$i]['kddiagnosa']. ', '.($item->kddiagnosa);
                }
                $i=$i+1;
            }
            if ($sama==false){
                $data10[]=array(
                    'noregistrasi'=>$item->noregistrasi,
                    'namapasien'=>$item->namapasien,
                    'nocm'=>$item->nocm,
                    'namakamar'=>$item->namakamar,
                    'nobed'=>$item->nobed,
                    'namaruangan'=>$item->namaruangan,
                    'kelompokpasien'=>$item->kelompokpasien,
                    'namarekanan'=>$item->namarekanan,
                    'tglmasukinap'=>$item->tglmasukinap,
                    'tglpulang'=>$item->tglpulang,
                    'dokter'=>$item->dokter,
                    'namakelas'=>$item->namakelas,
                    'kddiagnosa'=>$item->kddiagnosa,
                    'mutasi'=>$item->mutasi,
                    'carakeluar'=>$item->carakeluar,
                );
            }
        }

        $result = array(
            'data' => $data10,
            'message' => 'as@Ramdan',
        );

        return $this->respond($result);
    }
    public function getLaporanPasienPindahan(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $idDepRawatInap = (int) $this->settingDataFixed('idDepRawatInap', $kdProfile);
        $dataLogin = $request->all();
        $data = \DB::table('pasiendaftar_t as pd')
            ->JOIN ('antrianpasiendiperiksa_t as apd','apd.noregistrasifk','=','pd.norec')
            ->JOIN ('registrasipelayananpasien_t as rpp','rpp.noregistrasifk','=','pd.norec')
            ->JOIN ('diagnosapasien_t as dp','dp.noregistrasifk','=','apd.norec')
            ->leftJOIN ('detaildiagnosapasien_t as ddp','ddp.noregistrasifk','=','apd.norec')
            ->JOIN ('diagnosa_m as d','d.id','=','ddp.objectdiagnosafk')
            ->leftJOIN ('pasien_m as ps','ps.id','=','pd.nocmfk')
            ->leftJOIN ('jeniskelamin_m as jk','jk.id','=','ps.objectjeniskelaminfk')
            ->leftJOIN ('pegawai_m as pg','pg.id','=','pd.objectpegawaifk')
            ->leftJOIN ('kelompokpasien_m as kps','kps.id','=','pd.objectkelompokpasienlastfk')
            ->leftJOIN ('rekanan_m as rek','rek.id','=','pd.objectrekananfk')
            ->JOIN ('kamar_m as km','km.id','=','rpp.objectkamarfk')
            ->JOIN ('kelas_m as kls','kls.id','=','rpp.objectkelasfk')
            ->leftJOIN ('tempattidur_m as tt','tt.id','=','rpp.objecttempattidurfk')
            ->jOIN ('ruangan_m as ru','ru.id','=','pd.objectruanganasalfk')
            ->JOIN ('ruangan_m as ruu','ruu.id','=','pd.objectruanganlastfk')
            ->select('pd.noregistrasi','pd.tglregistrasi', 'ps.nocm', 'ps.namapasien','kps.kelompokpasien',
                'rek.namarekanan', 'jk.jeniskelamin','kls.namakelas','km.namakamar',
                'd.kddiagnosa','d.namadiagnosa','ru.namaruangan as ruanganasal',
                'ruu.namaruangan as ruangansekarang','tt.nomorbed as nobed',
                'pd.objectstatuskeluarfk','rpp.tglmasuk as tglmasukinap',
                DB::raw('pg.namalengkap as dokter,
                   case when pd.tglpulang is not null then \'Dipulangkan\' else \'Masih Dirawat\' end as status,
                   case when ruu.id=pd.objectruanganlastfk  then \'Pindahan\' else null end as mutasi'
                ))
            ->where('pd.kdprofile',$kdProfile)
            ->Where('ru.objectdepartemenfk','=',$idDepRawatInap)
            ->whereRaw('ru.id <> ruu.id');

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];//." 23:59:59";
            $data = $data->where('pd.tglregistrasi', '<=', $tgl);
        }
        if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
            $data = $data->where('ruu.objectdepartemenfk', '=', $request['idDept']);
        }
        if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
            $data = $data->where('ruu.id', '=', $request['idRuangan']);
        }
        if (isset($request['idKelas']) && $request['idKelas'] != "" && $request['idKelas'] != "undefined") {
            $data = $data->where('kls.id', '=', $request['idKelas']);
        }

        $data = $data->distinct();
        $data = $data->get();
        $data10 =[];
        $sama=false;

        foreach ($data as $item) {
            $sama=false;
            $i=0;
            foreach ($data10 as $hideung){
                if ($item->noregistrasi == $data10[$i]['noregistrasi']){
                    $sama=true;
                    $data10[$i]['kddiagnosa']=$data10[$i]['kddiagnosa']. ', '.($item->kddiagnosa);
                }
                $i=$i+1;
            }
            if ($sama==false){
                $data10[]=array(
                    'noregistrasi'=>$item->noregistrasi,
                    'namapasien'=>$item->namapasien,
                    'nocm'=>$item->nocm,
                    'namakamar'=>$item->namakamar,
                    'nobed'=>$item->nobed,
                    'ruanganasal'=>$item->ruanganasal,
                    'ruangansekarang'=>$item->ruangansekarang,
                    'kelompokpasien'=>$item->kelompokpasien,
                    'namarekanan'=>$item->namarekanan,
                    'tglmasukinap'=>$item->tglmasukinap,
                    'dokter'=>$item->dokter,
                    'namakelas'=>$item->namakelas,
                    'status'=>$item->status,
                    'kddiagnosa'=>$item->kddiagnosa,
                    'mutasi'=>$item->mutasi,
                );
            }
        }

        $result = array(
            'data' => $data10,
            'message' => 'as@Ramdan',
        );

        return $this->respond($result);
    }

    public static function getGrafikBarberJohnson(Request $request){

        //$idProfile = (int) $this->getDataKdProfile($request);
        $tglAwal = $request['tglAwal'].' 00:00';
        $tglAkhir = $request['tglAkhir'].' 23:59';
        $tahun = date ('Y');
        $sehari = 1;//$interval->format('%d');
        $data10=[];

        $tanggalmin = DB::select(DB::raw("
            select min(d::date) as tglmin
            from generate_series('$tglAwal', '$tglAwal'::date + INTERVAL '1 MONTH - 1 day', '1 day'::interval) d
        "));

        $tanggalmax = DB::select(DB::raw("
            select min(d::date) as tglmax
            from generate_series('$tglAkhir', '$tglAkhir'::date + INTERVAL '1 MONTH - 1 day', '1 day'::interval) d
        "));
        
        $monthtahunmonth = (int) date('m', strtotime($tglAwal));
        $yeartahunmonth = (int) date('Y', strtotime($tglAwal));
        

        $tahunmonthq = DB::select(DB::raw("select to_char(daterange::date, 'YYYY-mm') as tahun
        from generate_series('$yeartahunmonth-$monthtahunmonth-01'::date, '$tglAkhir'::date, '1 month') as daterange"));
        
        $arrmin = [];
        foreach($tanggalmin as $rowmin)
        {
            $arrmin[] =  $rowmin->tglmin;
        }
        $arrmax = [];
        foreach($tanggalmax as $rowmax)
        {
            $arrmax[] =  $rowmax->tglmax;
        }
        
        
        $tanggalminawal = DB::select(DB::raw("select '$arrmin[0] 23:59:59'::timestamp - interval '1 day ' as tgl"));

        $arrminawal = [];
        foreach($tanggalminawal as $rowminawal)
        {
            $arrminawal[] =  $rowminawal->tgl;
        }

        $tanggalmaxawal = DB::select(DB::raw("select '$arrmax[0] 23:59:59'::timestamp - interval '1 day ' as tgl"));

        $arrmaxawal = [];
        foreach($tanggalmaxawal as $rowmaxawal)
        {
            $arrmaxawal[] =  $rowmaxawal->tgl;
        }



            $dataKemarin = DB::select(DB::raw("select (tgl::date + interval '1 day')::date as tgl, sum(jumlah) as jumlah from(
                (select tgl as tgl,jumlah from (select tgl, case when jumlah is null then 0 else sum(jumlah) end as jumlah from(
                    with cte as(
                    select d as tgl
                    from generate_series('$arrminawal[0]', '$arrmaxawal[0]'::timestamp + INTERVAL '0 day', '1 day'::interval) d
                    )
                    select * FROM
                    cte
                    left join(
                    select noregistrasi, norec, tgl as tglapd, jumlah, tglpulang, tglkeluar, ruanganasal, ruangantujuan from (select pd.noregistrasi, apd.norec, apd.tglmasuk as tgl, pd.tglpulang, apd.tglkeluar, count(apd.tglmasuk) as jumlah, ru1.namaruangan ruanganasal, ru.namaruangan ruangantujuan
                    FROM pasiendaftar_t as pd
                    INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                    INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk = 16
                    inner JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk <> 16
                    where pd.kdprofile = 30
                    and pd.statusenabled = true
                    group by apd.tglmasuk, apd.tglkeluar, pd.tglpulang, pd.noregistrasi, apd.norec, ru.namaruangan, ru1.namaruangan
                    ) as x
                                    
                    UNION ALL
                                    
                    select noregistrasi, norec, tgl as tglapd, jumlah, tglpulang, tglkeluar, ruanganasal, ruangantujuan from (select pd.noregistrasi, apd.norec, apd.tglmasuk as tgl, pd.tglpulang, apd.tglkeluar, count(apd.tglmasuk) as jumlah, ru1.namaruangan ruanganasal, ru.namaruangan ruangantujuan
                    FROM pasiendaftar_t as pd
                    INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                    INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk = 16
                    inner JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk = 16
                    where pd.kdprofile = 30
                    and pd.statusenabled = true
                    group by apd.tglmasuk, apd.tglkeluar, pd.tglpulang, pd.noregistrasi, apd.norec, ru.namaruangan, ru1.namaruangan
                    ) as x
                    ) as y on cte.tgl between y.tglapd and coalesce(y.tglkeluar,now())
                ) as e
                group by e.tgl, e.jumlah
                order by e.tgl) as i)
            ) as f group by tgl"));
            
            //var_dump($dataKemarin);            

            $data = DB::select(DB::raw("
            select tgl, sum(jumlah) as jumlah from(
                select tgl, jumlah from (select apd.tglmasuk::date as tgl, count(apd.tglmasuk) as jumlah
                    FROM pasiendaftar_t as pd
                    INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                    INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk = 16
                    inner JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk <> 16
                    where pd.kdprofile = 30 
                    and pd.statusenabled = true
                    and cast(apd.tglmasuk as date) between '$tglAwal' and '$tglAkhir'
                    group by apd.tglmasuk::date
                ) as x
            ) as f group by tgl"));
            
            $dataPindah = DB::select(DB::raw("
            select tgl, sum(jumlah) as jumlah from(
                select tgl, jumlah from (select apd.tglmasuk::date as tgl, count(apd.tglmasuk) as jumlah
                    FROM pasiendaftar_t as pd
                    INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                    INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk = 16
                    INNER JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk = 16
                    where pd.kdprofile = 30 
                    and pd.statusenabled = true
                    and cast(apd.tglmasuk as date) between '$tglAwal' and '$tglAkhir' 
                    group by apd.tglmasuk::date
                ) as x
            ) as z group by tgl"));
            
            $dataDipindahkan = DB::select(DB::raw("
            select tgl, sum(jumlah) as jumlah from(select tgl, jumlah from (
                select apd.tglkeluar::date as tgl, count(apd.tglkeluar) as jumlah
                    FROM pasiendaftar_t as pd
                    INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                    INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk = 16
                    INNER JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk = 16
                    where pd.kdprofile = 30 
                    and pd.statusenabled = true
                    and cast(apd.tglkeluar as date) between '$tglAwal' and '$tglAkhir' 
                    and apd.tglkeluar <> coalesce(pd.tglpulang,now())
                    and apd.tglkeluar > apd.tglmasuk
                    group by apd.tglkeluar::date
                ) as x
                
                union all
                
                select tgl, jumlah from (
                    select apd.tglkeluar::date as tgl, count(apd.tglkeluar) as jumlah
                    FROM pasiendaftar_t as pd
                    INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                    INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk = 16
                    INNER JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk <> 16
                    where pd.kdprofile = 30 
                    and pd.statusenabled = true
                    and cast(apd.tglkeluar as date) between '$tglAwal' and '$tglAkhir' 
                    and apd.tglkeluar <> coalesce(pd.tglpulang,now())
                    and apd.tglkeluar > apd.tglmasuk
                    group by apd.tglkeluar::date
                ) as x
            ) as y group by tgl"));
            
            $dataPulang = DB::select(DB::raw("
            select max(apd.tglkeluar), pd.tglpulang::date as tgl, count(pd.tglpulang) as jumlah
                FROM pasiendaftar_t as pd
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                inner JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
                where pd.kdprofile = 30 and pd.statusenabled = true
                and cast(pd.tglpulang as date) between '$tglAwal' and '$tglAkhir'
                and pd.tglpulang = apd.tglkeluar
                and ru.objectdepartemenfk = 16
                and (pd.objectstatuspulangfk not in (2,3) or pd.objectstatuspulangfk is null)
                and apd.tglmasuk <> apd.tglkeluar
            group by pd.tglpulang::date"));

            $dataPulangAPS = DB::select(DB::raw("
            select pd.tglpulang::date as tgl, count(pm.namapasien) jumlah
                FROM pasiendaftar_t as pd
                INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
                INNER JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
                where pd.kdprofile = 30 and pd.statusenabled = true
                and cast(pd.tglpulang as date) between '$tglAwal' and '$tglAkhir'
                and pd.objectstatuspulangfk = 2
                and ru.objectdepartemenfk = 16
                and pd.tglpulang is not null
            group by pd.tglpulang::date"));
                
            $dataPulangMelarikanDiri = DB::select(DB::raw("
            select pd.tglpulang::date as tgl, count(pm.namapasien) jumlah
                FROM pasiendaftar_t as pd
                INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
                INNER JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
                where pd.kdprofile = 30 and pd.statusenabled = true
                and cast(pd.tglpulang as date) between '$tglAwal' and '$tglAkhir'
                and pd.objectstatuspulangfk = 3
                and ru.objectdepartemenfk = 16
                and pd.tglpulang is not null
            group by pd.tglpulang::date"));

            $lamadirawat = DB::select(DB::raw("
            select sum(y.totallama) as jumlah from(
                select x.tanggalpulang, sum(x.lamadirawat) as totallama from(
                with cte as (
                    select pdt.norec, min(apdt.tglmasuk::date) tglmasuk from pasiendaftar_t as pdt
                    inner join antrianpasiendiperiksa_t as apdt on apdt.noregistrasifk = pdt.norec
                    inner join ruangan_m as rum on rum.id = apdt.objectruanganfk
                    where rum.objectdepartemenfk = 16
                    and pdt.statusenabled = TRUE
                    and pdt.kdprofile = 30
                    and pdt.tglpulang::date between '$tglAwal' and '$tglAkhir'
                    group by pdt.norec, apdt.objectruanganfk
                )
                
                select pd.tglpulang::date as tanggalpulang, cte.tglmasuk as tanggalmasuk,
                case when pd.tglpulang::date-cte.tglmasuk::date = 0 then 1 else  (pd.tglpulang::date-cte.tglmasuk) + 1 end as lamadirawat
                    FROM pasiendaftar_t as pd
                    INNER JOIN cte on cte.norec = pd.norec
                    WHERE pd.kdprofile = 30 and pd.tglpulang is not null and cast(pd.tglpulang as date) between '$arrmin[0]' and '$arrmax[0]'
                    group by pd.tglpulang::date, cte.tglmasuk 
                    order by pd.tglpulang::date
                ) as x group by x.tanggalpulang
            ) as y"));

            $jumlahdays = DB::select(DB::raw("SELECT '$tglAkhir'::date - '$tglAwal'::date + 1 as jumlahhari"));
            //var_dump($jumlahdays[0]->jumlahhari);
            $jumlah = $jumlahdays[0]->jumlahhari;

            $jumlahttkalihari = 0;
            $jumlahgrandtotaltt = 0;
            $hari = 0;
            $hariawal = (int) date('d', strtotime($tglAwal));

            foreach($tahunmonthq as $q){
                //var_dump($jumlah);
                if($jumlah >= 28){
                    if($hariawal > 1){
                        $hari = (cal_days_in_month(CAL_GREGORIAN, date('m', strtotime($q->tahun)), date('Y', strtotime($q->tahun))) - $hariawal +1);
                        $jumlah -=  $hari;
                        $hariawal = 1;
                        //var_dump($jumlah);
                    } else{
                        $hari = cal_days_in_month(CAL_GREGORIAN, date('m', strtotime($q->tahun)), date('Y', strtotime($q->tahun)));
                        $jumlah -= $hari;
                        $hari = cal_days_in_month(CAL_GREGORIAN, date('m', strtotime($q->tahun)), date('Y', strtotime($q->tahun)));
                        //($jumlah);
                    }
                } else{
                    $hari = $jumlah;
                    //var_dump($jumlah);
                }
                //var_dump($hariawal);
                //var_dump($q);
                //var_dump($hari);

                $jumlahtt = DB::select(DB::raw("select '$q->tahun-$hari' as tanggal, sum(rm.jumlah_tt) as totalperperiode 
                    from riwayatkamar_m rm
                    inner join ruangan_m ru on ru.id = rm.objectruanganfk
                    inner join(
                        select objectruanganfk,objectkamarfk,max(tanggalawal) as tanggal from riwayatkamar_m 
                        where 
                        '$q->tahun-$hari 23:59:59' BETWEEN tanggalawal and COALESCE(tanggalakhir,'$q->tahun-$hari 23:59:59')
                        group by objectruanganfk,objectkamarfk
                    ) as x	
                    on rm.objectruanganfk=x.objectruanganfk and rm.objectkamarfk=x.objectkamarfk and rm.tanggalawal = x.tanggal
                    where rm.kdprofile = 30 and rm.statusenabled = true"));

                    //var_dump($jumlahtt);
                    
                    $jumlahttkalihari += $hari*$jumlahtt[0]->totalperperiode;
                    $jumlahgrandtotaltt += $jumlahtt[0]->totalperperiode;

                    
                    // var_dump($q->tahun);
                    // var_dump($hari);
                    // var_dump($jumlahtt[0]->totalperperiode);
                    // var_dump($hari*$jumlahtt[0]->totalperperiode);
                    // var_dump($hari*$jumlahtt[0]->totalperperiode);
                    
            }
            
            $bor = 0;
            $alos = 0;
            $toi = 0;
            $bto = 0;
            $ndr = 0;
            $gdr = 0;
            $jumlahpasienpindah = 0;
            $jumlahpasienawal = 0;
            $jumlahpasienmasuk = 0;
            $jumlahpasiendipindahkan = 0;
            $jumlahpasienpulang = 0;
            $jumlahpindah = 0;
            $jumlahmasuk = 0;
            $jumlahhariperawatan = 0;
            $jumlahpulang = 0;
            $jumlahpasienpulangaps = 0;
            $jumlahpasienpulangmelarikandiri = 0;
            $jumlahtttotal = 0;
            $jumlahbortt = 0;
            $jumlahborhariperawatan = 0;
            $jumlahharidirawat = 0;
            $xbor = 0;
            $ybor = 0;
            $xbto = 0;
            $ybto = 0;
            $xtoi = 0;
            $yalos = 0;
            $periodegrafik = $jumlahdays[0]->jumlahhari;

            foreach($dataKemarin as $awal){
                $jumlahpasienawal += $awal->jumlah;
            }

            foreach($data as $masuk){
                $jumlahpasienmasuk += $masuk->jumlah;
            }

            foreach($dataPindah as $pindah){
                $jumlahpasienpindah += $pindah->jumlah;
            }

            foreach($dataDipindahkan as $dipindah){
                $jumlahpasiendipindahkan += $dipindah->jumlah;
            }

            foreach($dataPulang as $pulang){
                $jumlahpasienpulang += $pulang->jumlah;
            }

            foreach($dataPulangAPS as $pulangaps){
                $jumlahpasienpulangaps += $pulangaps->jumlah;
            }

            foreach($dataPulangMelarikanDiri as $pulanglari){
                $jumlahpasienpulangmelarikandiri += $pulanglari->jumlah;
            }

            foreach($lamadirawat as $lama){
                $jumlahharidirawat += $lama->jumlah;
            }

            $jumlahhariperawatantt = $jumlahpasienawal + $jumlahpasienmasuk + $jumlahpasienpindah;
            $jumlahpulang = $jumlahpasiendipindahkan + $jumlahpasienpulang + $jumlahpasienpulangaps + $jumlahpasienpulangmelarikandiri;
            
            if($jumlahpulang == 0){
                $bor = $jumlahhariperawatantt/$jumlahttkalihari*100;
                $alos = 0;
                $toi = 0;
                $bto = $jumlahpulang/$jumlahgrandtotaltt;
            } else{
                $bor = $jumlahhariperawatantt/$jumlahttkalihari*100;
                $alos = $jumlahharidirawat/$jumlahpulang;
                $toi = ($jumlahttkalihari - $jumlahhariperawatantt)/$jumlahpulang;
                $bto = $jumlahpulang/$jumlahgrandtotaltt;
            }

            // var_dump($periodegrafik);
            // var_dump($bto);

            $ybor = number_format($bor,2)/10;
            $xbor = 10-(number_format($bor,2)/10);
            if($bto>0){
                $xbto = $periodegrafik/number_format($bto,2);
                $ybto = $periodegrafik/number_format($bto,2);
            } else{
                $xbto = 0;
                $ybto = 0;
            }
            
            $xtoi = number_format($toi,2);
            $yalos = number_format($alos,2);

            $data10[] = array(
                'xbor' =>(float) number_format($xbor,2),
                'ybor' =>(float) number_format($ybor,2),
                'xbto' =>(float) number_format($xbto,2),
                'ybto' => (float)number_format($ybto,2),
                'xtoi' => (float)number_format($xtoi,2),
                'yalos' => (float) number_format($yalos,2),
            );
            

        return $data10;

    }
    
    public function getDataRL11DataDasarRumahSakit(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tglAwal = $request['tglAwal']; 

        $kolom1 = array("1. Nomor Kode RS", "2. Tanggal Registrasi", "3. Nama Rumah Sakit", "4. Jenis Rumah Sakit", "5. Kelas Rumah Sakit", "6. Nama Direktur RS", "7. Nama Penyelenggara RS", "Alamat / Lokasi RS", "a. Kab / Kota", "b. Kode Pos", "c. Telepon", "d. Fax", "e. E-mail", "f. No. Telp Bag Humas", "g. Website", "9. Luas Rumah Sakit", "a. Luas Tanah", "b. Luas Bangunan", "10. Surat Ijin / Penetapan", "a. Nomor", "b. Tanggal", "c. Oleh", "d. Sifat", "e. Masa berlaku s/d tahun", "11. Status Penyelenggara Swasta", "12. Akreditasi RS", "a. Pentahapan", "b. Status", "c. Tanggal Akreditasi", "13. Jumlah Pegawai", "Keterangan", "Tenaga Medis", "- Dokter Umum", "- Perawat", "- Analis Lab", "- Radiografer", "- Terapis", "- Psikolog", "- Dokter Spesialis Anak", "- Dokter Spesialis Jiwa", "- Dokter Spesialis Peny. Dalam", "- Dokter Spesialis Saraf", "- Dokter Spesialis Kulit dan Kelamnin", "Dokter Spesialis Radiologi", "Dokter Gigi", "Tenaga Non Kesehatan");
        $kolom2 = array(": 2022", " ", ": 3404022", ": 21-February-2013", ": RSJ. GRHASIA", ": RS JIWA / RSKO", ": A", ":", ": Pemda Tk I", ": Jln. Kaliurang KM 17, Pakembinangun, Pakem, Sleman, Prop. DIY. T", ": Sleman", ":", ": (0274) 895143, 895297", "(0274) 895142", "grhasia@jogjaprov.go.id", ":", ": grhasia.jogjaprov.go.id", ":", ": 0.00", ": 0.00", ":", ":", "21-February-2013", "GUBERNUR DIY", ":", ": 2025", ": -", ":", ":", ": Bintang 5 Paripurna", ": 20-May-2019", " ", "Jumlah", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ");
        $kolom4 = array(" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "13. Jumlah Tempat Tidur", "No.", "1", "2", "3", "4", "5", "6", "7", "8", " ");
        $kolom5 = array(" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "Nama Kelas", "Isoalasi", "Airbone", "Infeksi/TB", "Intensif", "VIP", "Kelas III", "Kelas II", "Kelas I", "Jumlah Total");

        $jumlahperkelas = DB::select(DB::raw("select sum(x.kelasvip) jumlahkelasvip, sum(x.kelassatu) jumlahkelassatu, sum(x.kelasdua) jumlahkelasdua, sum(x.kelastiga) jumlahkelastiga, sum(x.kelasisolasi) jumlahkelasisolasi, sum(x.kelasintensif) jumlahkelasintensif, sum(x.kelasairbone) jumlahkelasairbone, sum(x.kelasinfeksi) jumlahkelasinfeksi, sum(x.kelasvip) + sum(x.kelassatu) + sum(x.kelasdua) + sum(x.kelastiga) + sum(x.kelasisolasi) + sum(x.kelasairbone) + sum(x.kelasinfeksi) + sum(x.kelasintensif) totaltt from(
            select
						case when km.namakamar ilike '%isolasi%' and ks.id = 6 then sum(rm.jumlah_tt) else 0 end as kelasisolasi,
						case when km.namakamar ilike '%airbone%' and ks.id = 6 then sum(rm.jumlah_tt) else 0 end as kelasairbone,
						case when km.namakamar ilike '%infeksi/tb%' and ks.id = 6 then sum(rm.jumlah_tt) else 0 end as kelasinfeksi,
						case when km.namakamar ilike '%intensif%' and ks.id = 6 then sum(rm.jumlah_tt) else 0 end as kelasintensif,
            case when ks.id = 4 then sum(rm.jumlah_tt) else 0 end as kelasvip,
						case when ks.id = 1 then sum(rm.jumlah_tt) else 0 end as kelastiga,
						case when ks.id = 2 then sum(rm.jumlah_tt) else 0 end as kelasdua,
            case when ks.id = 3 then sum(rm.jumlah_tt) else 0 end as kelassatu
                from riwayatkamar_m rm
            inner join ruangan_m ru on ru.id = rm.objectruanganfk
            inner join kamar_m km on km.id = rm.objectkamarfk
            inner join kelas_m ks on ks.id = rm.objectkelasfk
            inner join(
                select objectruanganfk,objectkamarfk,max(tanggalawal) as tanggal 
                from riwayatkamar_m 
                where 
                '$tglAwal-01 23:59:59' BETWEEN tanggalawal and COALESCE(tanggalakhir,'$tglAwal-01 23:59:59')
                group by objectruanganfk,objectkamarfk
            ) as x	
            on rm.objectruanganfk=x.objectruanganfk 
            and rm.objectkamarfk=x.objectkamarfk 
            and rm.tanggalawal = x.tanggal
            and ks.id in (1, 2, 3, 4, 6)
            where rm.kdprofile = 30 
            and rm.statusenabled = true
            group by ks.id, km.namakamar) as x"));
        
        $kolom6 = array(" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "Jml TT", $jumlahperkelas[0]->jumlahkelasisolasi, $jumlahperkelas[0]->jumlahkelasairbone, $jumlahperkelas[0]->jumlahkelasinfeksi, $jumlahperkelas[0]->jumlahkelasintensif, $jumlahperkelas[0]->jumlahkelasvip, $jumlahperkelas[0]->jumlahkelastiga, $jumlahperkelas[0]->jumlahkelasdua, $jumlahperkelas[0]->jumlahkelassatu, $jumlahperkelas[0]->totaltt);
        //var_dump($jumlahperkelas);
        $data10[0] = array(
            'jumlahkolom1' =>"TAHUN",
            'jumlahkolom2' =>": 2022",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>" ",
            'jumlahkolom4' =>" ",
            'jumlahkolom5' =>" ",
        );

        $data10[1] = array(
            'jumlahkolom1' =>"RL 1.1 Data Dasar Rumah Sakit",
            'jumlahkolom2' =>" ",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>" ",
            'jumlahkolom4' =>" ",
            'jumlahkolom5' =>" ",
        );

        $data10[2] = array(
            'jumlahkolom1' =>"1. Nomor Kode RS",
            'jumlahkolom2' =>": 3404022",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>" ",
            'jumlahkolom4' =>" ",
            'jumlahkolom5' =>" ",
        );

        $data10[3] = array(
            'jumlahkolom1' =>"2. Tanggal Registrasi",
            'jumlahkolom2' =>": 21-February-2013",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>" ",
            'jumlahkolom4' =>" ",
            'jumlahkolom5' =>" ",
        );

        $data10[4] = array(
            'jumlahkolom1' =>"3. Nama Rumah Sakit",
            'jumlahkolom2' =>": RSJ. GRHASIA",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>" ",
            'jumlahkolom4' =>" ",
            'jumlahkolom5' =>" ",
        );

        $data10[5] = array(
            'jumlahkolom1' =>"4. Jenis Rumah Sakit",
            'jumlahkolom2' =>": RS Jiwa / RSKO",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>" ",
            'jumlahkolom4' =>" ",
            'jumlahkolom5' =>" ",
        );

        $data10[6] = array(
            'jumlahkolom1' =>"5. Kelas Rumah Sakit",
            'jumlahkolom2' =>": A",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>" ",
            'jumlahkolom4' =>" ",
            'jumlahkolom5' =>" ",
        );

        $data10[7] = array(
            'jumlahkolom1' =>"6. Nama Direktur RS",
            'jumlahkolom2' =>": ",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>" ",
            'jumlahkolom4' =>" ",
            'jumlahkolom5' =>" ",
        );

        $data10[8] = array(
            'jumlahkolom1' =>"7. Nama Penyelenggara RS",
            'jumlahkolom2' =>": Pemda Tk I",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>" ",
            'jumlahkolom4' =>" ",
            'jumlahkolom5' =>" ",
        );

        $data10[9] = array(
            'jumlahkolom1' =>"8. Alamat / Lokasi RS",
            'jumlahkolom2' =>": Jln. Kaliurang Km 17, Pakembinangun, Pakem, Sleman, Prop. DIY. T",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>" ",
            'jumlahkolom4' =>" ",
            'jumlahkolom5' =>" ",
        );

        $data10[10] = array(
            'jumlahkolom1' =>"a. Kab / Kota",
            'jumlahkolom2' =>": Sleman",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>" ",
            'jumlahkolom4' =>" ",
            'jumlahkolom5' =>" ",
        );

        $data10[11] = array(
            'jumlahkolom1' =>"b. Kode Pos",
            'jumlahkolom2' =>": ",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>" ",
            'jumlahkolom4' =>" ",
            'jumlahkolom5' =>" ",
        );

        $data10[12] = array(
            'jumlahkolom1' =>"c. Telepon",
            'jumlahkolom2' =>": (0274) 895143, 895297",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>" ",
            'jumlahkolom4' =>" ",
            'jumlahkolom5' =>" ",
        );

        $data10[13] = array(
            'jumlahkolom1' =>"d. Fax",
            'jumlahkolom2' =>": (0274) 895142",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>" ",
            'jumlahkolom4' =>" ",
            'jumlahkolom5' =>" ",
        );

        $data10[14] = array(
            'jumlahkolom1' =>"e. E-mail",
            'jumlahkolom2' =>": grhasia@jogjaprov.go.id",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>" ",
            'jumlahkolom4' =>" ",
            'jumlahkolom5' =>" ",
        );

        $data10[15] = array(
            'jumlahkolom1' =>"f. No. Telp Bag. Humas",
            'jumlahkolom2' =>": ",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>" ",
            'jumlahkolom4' =>" ",
            'jumlahkolom5' =>" ",
        );

        $data10[16] = array(
            'jumlahkolom1' =>"g. Website",
            'jumlahkolom2' =>":  grhasia.jogjaprov.go.id",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>" ",
            'jumlahkolom4' =>" ",
            'jumlahkolom5' =>" ",
        );

        $data10[17] = array(
            'jumlahkolom1' =>"9. Luas Rumah Sakit",
            'jumlahkolom2' =>":  ",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>" ",
            'jumlahkolom4' =>" ",
            'jumlahkolom5' =>" ",
        );

        $data10[18] = array(
            'jumlahkolom1' =>"a. Luas Tanah",
            'jumlahkolom2' =>": 0.00",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>" ",
            'jumlahkolom4' =>" ",
            'jumlahkolom5' =>" ",
        );

        $data10[19] = array(
            'jumlahkolom1' =>"b. Luas Bangunan",
            'jumlahkolom2' =>": 0.00",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>" ",
            'jumlahkolom4' =>" ",
            'jumlahkolom5' =>" ",
        );

        $data10[20] = array(
            'jumlahkolom1' =>"10. Surat Ijin / Penetapan",
            'jumlahkolom2' =>": ",
            'jumlahkolom6' =>" ",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>" ",
            'jumlahkolom4' =>" ",
            'jumlahkolom5' =>" ",
        );

        $data10[21] = array(
            'jumlahkolom1' =>"a. Nomor",
            'jumlahkolom2' =>": ",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>" ",
            'jumlahkolom4' =>" ",
            'jumlahkolom5' =>" ",
        );

        $data10[22] = array(
            'jumlahkolom1' =>"b. Tanggal",
            'jumlahkolom2' =>": 21-February-2013",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>" ",
            'jumlahkolom4' =>" ",
            'jumlahkolom5' =>" ",
        );

        $data10[23] = array(
            'jumlahkolom1' =>"c. Oleh",
            'jumlahkolom2' =>": GUBERNUR DIY",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>" ",
            'jumlahkolom4' =>" ",
            'jumlahkolom5' =>" ",
        );

        $data10[24] = array(
            'jumlahkolom1' =>"d. Sifat",
            'jumlahkolom2' =>": ",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>" ",
            'jumlahkolom4' =>" ",
            'jumlahkolom5' =>" ",
        );

        $data10[25] = array(
            'jumlahkolom1' =>"e. Masa berlaku s/d tahun",
            'jumlahkolom2' =>": 2025",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>" ",
            'jumlahkolom4' =>" ",
            'jumlahkolom5' =>" ",
        );

        $data10[26] = array(
            'jumlahkolom1' =>"11. Status Penyelenggara Swasta",
            'jumlahkolom2' =>": -",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>" ",
            'jumlahkolom4' =>" ",
            'jumlahkolom5' =>" ",
        );

        $data10[27] = array(
            'jumlahkolom1' =>"12. Akreditasi RS",
            'jumlahkolom2' =>": ",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>" ",
            'jumlahkolom4' =>" ",
            'jumlahkolom5' =>" ",
        );

        $data10[28] = array(
            'jumlahkolom1' =>"a. Pentahapan",
            'jumlahkolom2' =>": ",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>" ",
            'jumlahkolom4' =>" ",
            'jumlahkolom5' =>" ",
        );

        $data10[29] = array(
            'jumlahkolom1' =>"b. Status",
            'jumlahkolom2' =>": Bintang 5 Paripurna",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>" ",
            'jumlahkolom4' =>" ",
            'jumlahkolom5' =>" ",
        );

        $data10[30] = array(
            'jumlahkolom1' =>"c. Tanggal Akreditas",
            'jumlahkolom2' =>": 20-May-2019",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>" ",
            'jumlahkolom4' =>" ",
            'jumlahkolom5' =>" ",
        );

        $data10[31] = array(
            'jumlahkolom1' =>" ",
            'jumlahkolom2' =>" ",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>" ",
            'jumlahkolom4' =>" ",
            'jumlahkolom5' =>" ",
        );

        $data10[32] = array(
            'jumlahkolom1' =>"13. Jumlah Pegawai",
            'jumlahkolom2' =>" ",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>" ",
            'jumlahkolom4' =>"14. Jumlah Tempat Tidur",
            'jumlahkolom5' =>" ",
        );

        $data10[33] = array(
            'jumlahkolom1' =>"Keterangan",
            'jumlahkolom2' =>"Jumlah",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>"No",
            'jumlahkolom4' =>"Nama Kelas",
            'jumlahkolom5' =>"Jml TT",
        );

        $data10[34] = array(
            'jumlahkolom1' =>"Tenaga Medis",
            'jumlahkolom2' =>" ",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>"1",
            'jumlahkolom4' =>"Isolasi",
            'jumlahkolom5' =>$jumlahperkelas[0]->jumlahkelasisolasi,
        );

        $data10[35] = array(
            'jumlahkolom1' =>"- Dokter Umum",
            'jumlahkolom2' =>" ",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>"2",
            'jumlahkolom4' =>"Airbone",
            'jumlahkolom5' =>$jumlahperkelas[0]->jumlahkelasairbone,
        );

        $data10[36] = array(
            'jumlahkolom1' =>"- Perawat",
            'jumlahkolom2' =>" ",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>"3",
            'jumlahkolom4' =>"Infeksi/TB",
            'jumlahkolom5' =>$jumlahperkelas[0]->jumlahkelasinfeksi,
        );

        $data10[37] = array(
            'jumlahkolom1' =>"- Analis LAB",
            'jumlahkolom2' =>" ",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>"4",
            'jumlahkolom4' =>"Intensif",
            'jumlahkolom5' =>$jumlahperkelas[0]->jumlahkelasintensif,
        );

        $data10[38] = array(
            'jumlahkolom1' =>"- Radiografer",
            'jumlahkolom2' =>" ",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>"5",
            'jumlahkolom4' =>"VIP",
            'jumlahkolom5' =>$jumlahperkelas[0]->jumlahkelasvip,
        );

        $data10[39] = array(
            'jumlahkolom1' =>"- Terapis",
            'jumlahkolom2' =>" ",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>"6",
            'jumlahkolom4' =>"Kelas III",
            'jumlahkolom5' =>$jumlahperkelas[0]->jumlahkelastiga,
        );

        $data10[40] = array(
            'jumlahkolom1' =>"- Psikolog",
            'jumlahkolom2' =>" ",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>"7",
            'jumlahkolom4' =>"Kelas II",
            'jumlahkolom5' =>$jumlahperkelas[0]->jumlahkelasdua,
        );

        $data10[41] = array(
            'jumlahkolom1' =>"- Dokter Spesialis Anak",
            'jumlahkolom2' =>" ",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>"8",
            'jumlahkolom4' =>"Kelas I",
            'jumlahkolom5' =>$jumlahperkelas[0]->jumlahkelassatu,
        );

        $data10[42] = array(
            'jumlahkolom1' =>"- Dokter Spesialis Jiwa",
            'jumlahkolom2' =>" ",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>" ",
            'jumlahkolom4' =>"Jumlah total",
            'jumlahkolom5' =>$jumlahperkelas[0]->totaltt,
        );

        $data10[43] = array(
            'jumlahkolom1' =>"- Dokter Spesialis Peny. Dalam",
            'jumlahkolom2' =>" ",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>" ",
            'jumlahkolom4' =>" ",
            'jumlahkolom5' =>" ",
        );

        $data10[44] = array(
            'jumlahkolom1' =>"- Dokter Spesialis Saraf",
            'jumlahkolom2' =>" ",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>" ",
            'jumlahkolom4' =>" ",
            'jumlahkolom5' =>" ",
        );

        $data10[45] = array(
            'jumlahkolom1' =>"- Dokter Spesialis Kulit dan Kelamin",
            'jumlahkolom2' =>" ",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>" ",
            'jumlahkolom4' =>" ",
            'jumlahkolom5' =>" ",
        );

        $data10[46] = array(
            'jumlahkolom1' =>"- Dokter Spesialis Radiologi",
            'jumlahkolom2' =>" ",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>" ",
            'jumlahkolom4' =>" ",
            'jumlahkolom5' =>" ",
        );

        $data10[47] = array(
            'jumlahkolom1' =>"- Dokter Gigi",
            'jumlahkolom2' =>" ",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>" ",
            'jumlahkolom4' =>" ",
            'jumlahkolom5' =>" ",
        );

        $data10[48] = array(
            'jumlahkolom1' =>"Tenaga Non Kesehatan",
            'jumlahkolom2' =>" ",
            'jumlahkolom6' =>" ",
            'jumlahkolom3' =>" ",
            'jumlahkolom4' =>" ",
            'jumlahkolom5' =>" ",
        );



        $result = array(
            'data' => $data10,
            'message' => 'as@cepot',
        );
        return $this->respond($result);
    }
}
