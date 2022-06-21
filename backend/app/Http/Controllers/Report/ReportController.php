<?php


namespace App\Http\Controllers\Report;


use App\Http\Controllers\ApiController;
use App\Master\Ruangan;
use App\Traits\Valet;
use App\Transaksi\HasilLaboratorium;
use App\Web\Profile;
use Illuminate\Http\Request;
use DB;

use Barryvdh\DomPDF\Facade as PDF;
use JasperPHP\JasperPHP;
use PHPJasper\PHPJasper;


class ReportController extends ApiController{

    use Valet;

    public function __construct(){
        parent::__construct($skip_authentication = true);
    }

    public function getDataHasilLabCetak(Request $request){
//        $kdProfile = (int) $this->getDataKdProfile($request);
        $umur = $request['umur'];
        $Tgl = self::getDateIndo( date('Y-m-d H:i:s'));
        $idKelapaLab = (int) $this->settingDataFixed('PenanggungJawabLabRSKI', 17);
//         $data =  DB::table('pelayananpasien_t as pp')
//                 ->join('produk_m as prd','prd.id','=','pp.produkfk')
//                 ->join('detailjenisproduk_m as djp','djp.id','=','prd.objectdetailjenisprodukfk')
//                 ->leftJOIN('produkdetaillaboratorium_m as pdl','pdl.produkfk','=','prd.id')
//                 ->leftjoin('produkdetaillaboratoriumnilainormal_m as pdlm', function ($join)use ($request)  {
//                      $join->on('pdlm.objectprodukdetaillabfk','=','pdl.id')
//                         ->where('pdlm.objectjeniskelaminfk','=',$request['objectjeniskelaminfk'] );
//                 })
//                 ->leftJoin('hasillaboratorium_t as hh', function ($join) {
//                     $join->on('pp.noregistrasifk', '=', 'hh.noregistrasifk')
//                         ->on('pp.norec','=','hh.pelayananpasienfk')
//                         ->on('hh.produkdetaillabfk','=','pdl.id');
//                 })
//                 ->leftJOIN('satuanstandar_m as ss','ss.id','=','pdl.objectsatuanstandarfk')
//                 ->select(DB::raw("pp.noregistrasifk as norec_apd,djp.detailjenisproduk,pp.produkfk,prd.namaproduk ,
//                     pdl.detailpemeriksaan,
//                     hh.hasil,pdlm.rangemin as nilaimin,pdlm.rangemax as nilaimax,pdlm.refrange as nilaitext,
//                     ss.satuanstandar as satuan,pdl.id as iddetailproduk,
//                     hh.metode,pp.norec as norec_pp,
//                     hh.norec as norec_hasil"))
// //                ->where('pp.kdprofile', $kdProfile)
//                 ->where('pp.noregistrasifk', $request['norec_apd'])
//                 ->orderBy('prd.namaproduk', 'asc')
//                 ->get();

//                  $data = $data->groupBy('detailjenisproduk');
        $data =collect(DB::select("SELECT pp.noregistrasifk as norec_apd,djp.detailjenisproduk,pp.produkfk,prd.namaproduk ,
                    pdl.detailpemeriksaan,
                    hh.hasil,pdlm.rangemin as nilaimin,pdlm.rangemax as nilaimax,pdlm.refrange as nilaitext,
                    ss.satuanstandar as satuan,pdl.id as iddetailproduk,
                    hh.metode,pp.norec as norec_pp,
                    hh.norec as norec_hasil
                    FROM pelayananpasien_t as pp
                    inner join produk_m as prd on prd.id = pp.produkfk
                    inner join detailjenisproduk_m as djp on djp.id = prd.objectdetailjenisprodukfk
                    left JOIN produkdetaillaboratorium_m pdl on pdl.produkfk = prd.id 
                    left join produkdetaillaboratoriumnilainormal_m as pdlm on pdlm.objectprodukdetaillabfk = pdl.id
                    and pdlm.objectjeniskelaminfk=$request[objectjeniskelaminfk] 
                    left join hasillaboratorium_t as hh on hh.produkfk = prd.id
                    and pp.noregistrasifk=hh.noregistrasifk
                    and pp.norec=hh.pelayananpasienfk
                    and hh.produkdetaillabfk =pdl.id

                    left join satuanstandar_m as ss on ss.id = pdl.objectsatuanstandarfk
                    where pp.noregistrasifk='$request[norec_apd]'
                    and pp.kdprofile=17 
                    order by prd.namaproduk asc"));
        // $data =$data->groupBy('namaproduk');
        // dd($data);
        $diagnosa = \DB::table('pasiendaftar_t AS pd')
            ->join('antrianpasiendiperiksa_t AS apd','apd.noregistrasifk','=','pd.norec')
            ->join('detaildiagnosapasien_t as ddg','ddg.noregistrasifk','=','apd.norec')
            ->join('diagnosa_m AS dm','dm.id','=','ddg.objectdiagnosafk')
            ->select(DB::raw("CASE WHEN apd.norec IS NULL THEN ' , ' ELSE dm.kddiagnosa || ', ' || dm.namadiagnosa END AS diagnosa"))
//            ->where('pd.kdprofile', $kdProfile)
            ->where('ddg.objectjenisdiagnosafk', 1)
            ->where('apd.norec',  $request['norec_apd'])
            ->first();
        $namaDiagnosa='';
        if ($diagnosa != null){
            $namaDiagnosa = $diagnosa->diagnosa;
        }
        $getNorePd = \DB::table('pasiendaftar_t AS pd')
            ->join('antrianpasiendiperiksa_t AS apd','apd.noregistrasifk','=','pd.norec')
            ->leftJoin('strukorder_t AS so','so.noregistrasifk','=','pd.norec')
            ->join('pasien_m AS pm','pm.id','=','pd.nocmfk')
            ->join('jeniskelamin_m AS jk','jk.id','=','pm.objectjeniskelaminfk')
            ->join('ruangan_m AS ru','ru.id','=','pd.objectruanganlastfk')
            ->join('departemen_m AS dept','dept.id','=','ru.objectdepartemenfk')
            ->leftJoin('pegawai_m AS pg','pg.id','=','so.objectpegawaiorderfk')
            ->join('kelas_m AS kls','kls.id','=','pd.objectkelasfk')
            ->select(DB::raw(  "'B/287/VIII/' || to_char(now(),'YYYY') AS nomor,pm.nocm,pm.namapasien,pm.tempatlahir,
                                                to_char(pm.tgllahir,'DD-MM-YYYY') AS tgllahir,jk.jeniskelamin,kls.namakelas,
			                                    dept.namadepartemen,ru.namaruangan,so.tglorder,pg.namalengkap,apd.tglmasuk,
			                                    CASE WHEN pm.notelepon IS NULL THEN '' ELSE pm.notelepon END AS notelepon"))
            ->where('apd.norec', $request['norec_apd'])
//                    ->where('apd.kdprofile', $kdProfile)
            ->first();
        $KepalaLab = \DB::table('pegawai_m AS pg')
            ->leftJoin('pangkat_m AS pt','pt.id','=','pg.objectpangkatfk')
            ->leftJoin('jabatan_m AS jb','jb.id','=','pg.objectjabataninternalfk')
            ->select(DB::raw("pg.namalengkap,pg.nippns,CASE WHEN pg.objectpangkatfk IS NULL THEN '' ELSE pt.namapangkat END AS pangkat,
			                                 CASE WHEN pg.nippns IS NULL THEN '' ELSE pg.nippns END AS nippns,CASE WHEN pg.objectjabataninternalfk IS NULL THEN '' ELSE jb.namajabatan END AS jabatan"))
//                     ->where('pg.kdprofile', $kdProfile)
            ->where('pg.id',$idKelapaLab)
            ->first();
        if(count($data) == 0){
            return 'Data tidak ada';
            die;
        }
        $head = array(
            "nomor" => $getNorePd->nomor,
            "nocm" => $getNorePd->nocm,
            "namapasien" => $getNorePd->namapasien,
            "tgllahir" => $getNorePd->tgllahir,
            "jeniskelamin" => $getNorePd->jeniskelamin,
            "namakelas" => $getNorePd->namakelas,
            "namadepartemen" => $getNorePd->namadepartemen,
            "namaruangan" => $getNorePd->namaruangan,
            "tglorder" => $getNorePd->tglorder,
            "namalengkap" => $getNorePd->namalengkap,
            "tglmasuk" => $getNorePd->tglmasuk,
            "notelepon" => $getNorePd->notelepon,
            "diagnosa" => $namaDiagnosa,
            "tgl" => $Tgl,
            "namakepala" => $KepalaLab->namalengkap,
            "pangkat" => $KepalaLab->pangkat . " NRP " . $KepalaLab->nippns
        );
        if(count($data) == 0){
            return 'Data tidak ada';
            die;
        }
        $dataReport = array(
            'head' => $head,
            'data' => $data,
        );
//        return $this->respond($dataReport);
        return view('design.cetak-hasil-laboratorium',compact('dataReport'));
    }

    public function getDataSuratKeteranganPulangCetak(Request $request){
        $user = $request['strIdPegawai'];
        $kdProfile = (int) $request['kdProfile'];
        $Tgl = self::getDateIndo( date('Y-m-d H:i:s'));
        $idKepalaRs = (int) $this->settingDataFixed('KdKepalaRumahSakit', $kdProfile);
        $bulanromawi =  $this->KonDecRomawi($this->getDateTime()->format('m'));
        $DataProfile = DB::table('profile_m')
            ->where('id', $kdProfile)
            ->first();
        $dataSurat = [];
        if ($DataProfile->id == 17){
            $dataSurat = DB::table('suratketerangan_t as sk')
                ->join('pasiendaftar_t as pd','pd.norec','=', 'sk.pasiendaftarfk')
                ->join('pasien_m as pm','pm.id','=','pd.nocmfk')
                ->leftJoin('alamat_m as alm','alm.nocmfk','=','pm.id')
                ->join('pegawai_m as pg','pg.id','=','sk.dokterfk')
                ->join('jeniskelamin_m as jk','jk.id','=','pm.objectjeniskelaminfk')
                ->leftJoin('pekerjaan_m as pk','pk.id','=','pm.objectpekerjaanfk')
                ->leftJoin('pangkat_m AS pt','pt.id','=','pg.objectpangkatfk')
                ->leftJoin('jabatan_m AS jb','jb.id','=','pg.objectjabataninternalfk')
                ->select(DB::raw("'/VIII/' || to_char(now(),'YYYY') AS nomor,sk.nosurat,sk.norec,pm.nocm,pd.noregistrasi,pm.namapasien,pm.tempatlahir,  
                                            to_char(pm.tgllahir, 'DD-MM-YYYY') AS tgllahir,jk.jeniskelamin,alm.alamatlengkap,  
                                            sk.keterangan,pg.namalengkap,'NIP. ' || CASE WHEN pg.nippns IS NULL THEN '' ELSE pg.nippns END AS nip,  
                                            CASE WHEN pk.pekerjaan IS NULL THEN '' ELSE pk.pekerjaan END AS pekerjaan,  
                                            pd.tglregistrasi,CASE WHEN pg.objectpangkatfk IS NULL THEN '' ELSE pt.namapangkat END AS pangkat,  
                                            CASE WHEN pg.nippns IS NULL THEN '' ELSE pg.nippns END AS nippns,  
                                            CASE WHEN pg.objectjabataninternalfk IS NULL THEN '' ELSE jb.namajabatan END AS jabatan,  
                                            CASE WHEN pd.tglpulang IS NOT NULL THEN pd.tglpulang ELSE NOW() END AS tglpulang"))
                ->where('sk.kdprofile', $kdProfile)
                ->where('sk.norec', $request['norec'])
//                ->where('sk.statusenabled', true)
                ->get();
        }elseif ($DataProfile->id == 18){
            $dataSurat = DB::table('pasiendaftar_t as pd')
                ->leftJoin('suratketerangan_t as sk',function($join){
                    $join->on('sk.pasiendaftarfk','=', 'pd.norec');
                    $join->where('sk.statusenabled','=',true);
                    $join->where('sk.jenissuratfk','=',12);

                })
                ->leftJoin('pasien_m as pm','pm.id','=','pd.nocmfk')
                ->leftJoin('alamat_m as alm','alm.nocmfk','=','pm.id')
                ->leftJoin('pegawai_m as pg','pg.id','=','sk.dokterfk')
                ->leftJoin('jeniskelamin_m as jk','jk.id','=','pm.objectjeniskelaminfk')
                ->leftJoin('pekerjaan_m as pk','pk.id','=','pm.objectpekerjaanfk')
                ->leftJoin('pangkat_m AS pt','pt.id','=','pg.objectpangkatfk')
                ->leftJoin('jabatan_m AS jb','jb.id','=','pg.objectjabataninternalfk')
                ->leftJoin('desakelurahan_m as dk','dk.id','=','alm.objectdesakelurahanfk')
                ->leftJoin('kecamatan_m AS kc','kc.id', '=','alm.objectkecamatanfk')
                ->leftJoin('kotakabupaten_m AS kb','kb.id','=', 'alm.objectkotakabupatenfk')
                ->leftJoin('propinsi_m as prop','prop.id','=','alm.objectpropinsifk')
                ->leftjoin('ruangan_m AS ru','ru.id','=','pd.objectruanganlastfk')
                ->leftjoin('departemen_m AS dep','dep.id','=','ru.objectdepartemenfk')
                ->LEFTjoin('strukorder_t as so',function($joins){
                    $joins->on('so.noregistrasifk','=','pd.norec');
                    $joins->where('so.statusenabled','=',true);
                    $joins->where('so.objectkelompoktransaksifk','=',153);
                })
                ->select(DB::raw("'SKSI/'||case when sk.nosurat is null then '' else SUBSTRING(sk.nosurat,5,10) end || '/$bulanromawi/' || to_char(now(),'YYYY') || '/RSDCWA' AS nomor,sk.nosurat,sk.norec,pm.nocm,pd.noregistrasi,pm.namapasien,pm.tempatlahir,  
                                            to_char(pm.tgllahir, 'DD-MM-YYYY') AS tgllahir,jk.jeniskelamin,alm.alamatlengkap,  
                                            sk.keterangan,pg.namalengkap,'NIP. ' || CASE WHEN pg.nippns IS NULL THEN '' ELSE pg.nippns END AS nip,  
                                            CASE WHEN pk.pekerjaan IS NULL THEN '' ELSE pk.pekerjaan END AS pekerjaan,  
                                            pd.tglregistrasi,CASE WHEN pg.objectpangkatfk IS NULL THEN '' ELSE pt.namapangkat END AS pangkat,  
                                            CASE WHEN pg.nippns IS NULL THEN '' ELSE pg.nippns END AS nippns,  
                                            CASE WHEN pg.objectjabataninternalfk IS NULL THEN '' ELSE jb.namajabatan END AS jabatan,  
                                            CASE WHEN pd.tglpulang IS NOT NULL THEN pd.tglpulang 
                                            WHEN so.tglrencana IS NOT NULL THEN so.tglrencana ELSE NOW() END AS tglpulang,
                                            dk.namadesakelurahan,kc.namakecamatan,kb.namakotakabupaten,prop.namapropinsi,alm.kodepos,
                                            CASE WHEN pd.tglpulang IS NOT NULL THEN EXTRACT(day from age(to_date(to_char(pd.tglpulang,'YYYY-MM-DD'),'YYYY-MM-DD'), to_date(to_char(pd.tglregistrasi,'YYYY-MM-DD'),'YYYY-MM-DD'))) || ' Hari'
                                            WHEN so.tglrencana IS NOT NULL THEN EXTRACT(day from age(to_date(to_char(so.tglrencana,'YYYY-MM-DD'),'YYYY-MM-DD'), to_date(to_char(pd.tglregistrasi,'YYYY-MM-DD'),'YYYY-MM-DD'))) || ' Hari'
                                            ELSE EXTRACT(day from age(current_date, to_date(to_char(pd.tglregistrasi,'YYYY-MM-DD'),'YYYY-MM-DD'))) || ' Hari' END AS lamarawat,dep.namadepartemen || ', '|| ru.namaruangan as rawat

                "))
                ->where('pd.kdprofile', $kdProfile)
                ->where('pd.norec', $request['norec'])
                ->get();
        }

        if(count($dataSurat) == 0){
            return 'Data tidak ada';
            die;
        }
        $KepalaRs = \DB::table('pegawai_m AS pg')
            ->leftJoin('pangkat_m AS pt','pt.id','=','pg.objectpangkatfk')
            ->leftJoin('jabatan_m AS jb','jb.id','=','pg.objectjabataninternalfk')
            ->select(DB::raw("pg.namalengkap,pg.nippns,CASE WHEN pg.objectpangkatfk IS NULL THEN '' ELSE pt.namapangkat END AS pangkat,
			                         CASE WHEN pg.nippns IS NULL THEN '' ELSE pg.nippns END AS nippns,CASE WHEN pg.objectjabataninternalfk IS NULL THEN '' ELSE jb.namajabatan END AS jabatan"))
            ->where('pg.kdprofile', $kdProfile)
            ->where('pg.id',$idKepalaRs)
            ->first();



        $tglRegis= '';//self::getDateIndo($dataSurat['tglregistrasi']);
        $tglPulang='';
        $nrp ='';
        foreach ($dataSurat as $item){
            $tglRegis = self::getDateIndo($item->tglregistrasi) ;
            $tglPulang = self::getDateIndo($item->tglpulang);
            $nrp = $item->pangkat . ' NRP ' . $item->nippns;
        }

        $dataReport = array(
            'data' => $dataSurat,
            'kepalaRs' => $KepalaRs,
            'tanggal' => $Tgl,
            'tanggalrawat' => $tglRegis . ' s.d ' . $tglPulang,
            'nrp'=> $nrp,
            'namaprofile' => $DataProfile->namalengkap,
            'namaexternal' => $DataProfile->namaexternal,
            'namakota' => $DataProfile->namakota,
            'profileId' => $DataProfile->id,
        );

        if ($DataProfile->id == 17){
            //   return $this->respond($dataReport->namalengkap);
            return view('design.cetak-surat-keterangan-pulang',compact('dataReport'));
        }elseif ($DataProfile->id == 18){
//               return $this->respond($dataReport);
            return view('design.cetak-surat-keterangan-pulang-wsa',compact('dataReport'));
        }
    }

    public function getDataRekapLabel(Request $request){
        $user = $request['strIdPegawai'];
        $kdProfile = (int) $request['kdProfile'];
        $Tgl = self::getDateIndo( date('Y-m-d H:i:s'));
        $noreSR = $request['norec'];
        $DataProfile = DB::table('profile_m')
            ->where('id', $kdProfile)
            ->first();//DB::select(DB::raw("select * from profile_m where id = '$kdProfile' limit 1"));
        $data = DB::select(DB::raw("
            						SELECT distinct ps.nocm, ps.namapasien,to_char(ps.tgllahir, 'DD/MM/YYYY') as tgllahir,CASE WHEN aa.noantri IS NULL THEN sr.noresep ELSE aa.jenis || '-' || aa.noantri END AS noresep,to_char(sr.tglresep, 'DD-MM-YYYY') as tglresep,pr.namaproduk || ' (' || CAST(pp.jumlah AS VARCHAR) || ')' AS namaproduk,pp.aturanpakai,pp.rke,  
                                    CASE WHEN alm.alamatlengkap is null then '-' else alm.alamatlengkap end as alamat,ps.notelepon,ss.satuanstandar,pp.jumlah,  
                                    CASE WHEN pp.issiang = 't' THEN 'Siang' ELSE '-' END AS siang, CASE WHEN pp.ispagi = 't' THEN 'Pagi' ELSE '-' END AS pagi,  
                                    CASE WHEN pp.ismalam = 't' THEN 'Malam' ELSE '-' END as malam, CASE WHEN pp.issore = 't' THEN 'Sore' ELSE '-' END as sore,  
                                    CASE WHEN pp.keteranganpakai  = '' OR pp.keteranganpakai IS NULL THEN '-' else pp.keteranganpakai END AS keteranganpakai,
                                    ru.namaruangan,dep.namadepartemen 
                                    from pelayananpasien_t as pp inner join strukresep_t as sr on sr.norec= pp.strukresepfk  
                                    LEFT join produk_m as pr on pr.id = pp.produkfk  
                                    LEFT join antrianpasiendiperiksa_t as apd on apd.norec = pp.noregistrasifk  
                                    LEFT join pasiendaftar_t as pd on pd.norec=apd.noregistrasifk  
                                    LEFT join pasien_m as ps on ps.id = pd.nocmfk  
                                    left join alamat_m as alm on alm.nocmfk = ps.id  
                                    LEFT JOIN satuanstandar_m as ss on ss.id = pp.satuanviewfk  
                                    LEFT JOIN antrianapotik_t as aa on aa.noresep = sr.noresep  
                                    LEFT JOIN ruangan_m as ru on ru.id = apd.objectruanganfk 
                                    LEFT JOIN departemen_m as dep on dep.id = ru.objectdepartemenfk 
                                    where pp.kdprofile = $kdProfile and pp.jeniskemasanfk = 2 and sr.norec ='$noreSR'        
            
                                    union all 
        
                                    select distinct ps.nocm,ps.namapasien,to_char(ps.tgllahir, 'DD/MM/YYYY') as tgllahir,CASE WHEN aa.noantri IS NULL THEN sr.noresep ELSE aa.jenis || '-' || aa.noantri END AS noresep,to_char(sr.tglresep, 'DD-MM-YYYY') as tglresep,  
                                    ' Racikan' || ' (' || CAST(((CAST(pp.qtydetailresep as INTEGER)/CAST(pp.dosis as INTEGER))*CAST(pro.kekuatan as INTEGER)) AS VARCHAR) || ')' AS namaproduk,pp.aturanpakai,pp.rke,  
                                    case when alm.alamatlengkap is null then '-' else alm.alamatlengkap end as alamat,ps.notelepon,CASE when jr.jenisracikan IS NULL THEN '' ELSE jr.jenisracikan END AS satuanstandar,  
                                    ((CAST(pp.qtydetailresep as INTEGER)/CAST(pp.dosis as INTEGER))*CAST(pro.kekuatan as INTEGER)) as jumlah,  
                                    CASE WHEN pp.issiang = 't' THEN 'Siang' ELSE '-' END AS siang, CASE WHEN pp.ispagi = 't' THEN 'Pagi' ELSE '-' END AS pagi,  
                                    CASE WHEN pp.ismalam = 't' THEN 'Malam' ELSE '-' END as malam, CASE WHEN pp.issore = 't' THEN 'Sore' ELSE '-' END as sore,  
                                    CASE WHEN pp.keteranganpakai  = '' OR pp.keteranganpakai IS NULL THEN '-' else pp.keteranganpakai END AS keteranganpakai,
                                    ru.namaruangan,dep.namadepartemen 
                                    from strukresep_t as sr   
                                    LEFT join pelayananpasien_t as pp on sr.norec= pp.strukresepfk  
                                    LEFT join antrianpasiendiperiksa_t as apd on apd.norec = sr.pasienfk  
                                    LEFT join pasiendaftar_t as pd on pd.norec=apd.noregistrasifk  
                                    LEFT join pasien_m as ps on ps.id = pd.nocmfk  
                                    left join alamat_m as alm on alm.nocmfk = ps.id  
                                    LEFT JOIN produk_m as pro on pro.id = pp.produkfk  
                                    LEFT JOIN satuanstandar_m as ss on ss.id = pp.satuanviewfk  
                                    LEFT JOIN jenisracikan_m as jr on jr.id = pp.jenisobatfk  
                                    LEFT JOIN antrianapotik_t as aa on aa.noresep = sr.noresep
                                    LEFT JOIN ruangan_m as ru on ru.id = apd.objectruanganfk
                                    LEFT JOIN departemen_m as dep on dep.id = ru.objectdepartemenfk 
                                    where pp.kdprofile = $kdProfile and pp.jeniskemasanfk = 1 and sr.norec ='$noreSR' "));
        if(count($data) == 0){
            return 'Data tidak ada';
            die;
        }
        $tglRegis= '';
        $tglPulang='';
        $nrp ='';

//        $tglRegis = '';
//        foreach ($data as $item){
//            $tglRegis = self::getDateIndo($item->tglregistrasi);
//        }

        $dataReport = array(
            'data' => $data,
            'namaprofile' => $DataProfile->namalengkap,
            'namaexternal' => $DataProfile->namaexternal,
            'namakota' => $DataProfile->namakota,
            'alamatlengkap' => $DataProfile->alamatlengkap,
            'profileId' => $DataProfile->id,
        );

//          return $this->respond($dataReport);
        return view('design.cetak-label-rekap',compact('dataReport'));
    }

    public function getDataBuktiPendaftaraan(Request $request){
        $user = $request['strIdPegawai'];
        $kdProfile = (int) $request['kdProfile'];
        $Tgl = self::getDateIndo( date('Y-m-d H:i:s'));
        $noregistrasi = $request['noRegistrasi'];
        $DataProfile = DB::table('profile_m')
            ->where('id', $kdProfile)
            ->first();
        $data = DB::select(DB::raw("SELECT pd.noregistrasi,ps.nocm,ps.tgllahir,ps.namapasien,pd.tglregistrasi,jk.reportdisplay AS jk,
                                                 ap.alamatlengkap,ap.mobilephone2,ru.namaruangan AS ruanganPeriksa,pp.namalengkap AS namadokter,
                                                 kp.kelompokpasien,apdp.noantrian,pd.statuspasien,apr.noreservasi,apr.tanggalreservasi,
                                                 kmr.namakamar,tt.nomorbed,ru.namaruangan || ' No Kamar : ' || kmr.namakamar || ' No Bed : ' || tt.nomorbed AS kamar,
                                                 dept.namadepartemen
                                    FROM pasiendaftar_t pd
                                    INNER JOIN registrasipelayananpasien_t AS rpp ON rpp.noregistrasifk = pd.norec
                                    INNER JOIN pasien_m ps ON pd.nocmfk = ps.id
                                    LEFT JOIN alamat_m ap ON ap.nocmfk = ps.id
                                    INNER JOIN jeniskelamin_m jk ON ps.objectjeniskelaminfk = jk.id
                                    INNER JOIN ruangan_m ru ON pd.objectruanganlastfk = ru.id
                                    LEFT JOIN departemen_m AS dept ON dept.id = ru.objectdepartemenfk
                                    LEFT JOIN pegawai_m pp ON pd.objectpegawaifk = pp.id
                                    INNER JOIN kelompokpasien_m kp ON pd.objectkelompokpasienlastfk = kp.id
                                    INNER JOIN antrianpasiendiperiksa_t apdp ON apdp.noregistrasifk = pd.norec
                                    LEFT JOIN antrianpasienregistrasi_t as apr on apr.noreservasi=pd.statusschedule
                                    LEFT JOIN kamar_m AS kmr ON kmr.id = apdp.objectkamarfk
                                    LEFT JOIN tempattidur_m AS tt ON tt.id = apdp.nobed
                                    WHERE pd.kdprofile = $kdProfile and pd.noregistrasi = '$noregistrasi'"));

        if(count($data) == 0){
            return 'Data tidak ada';
            die;
        }

        $tglRegis = '';
        foreach ($data as $item){
            $tglRegis = self::getDateIndo($item->tglregistrasi);
        }

        $dataReport = array(
            'data' => $data,
            'namaprofile' => $DataProfile->namalengkap,
            'namaexternal' => $DataProfile->namaexternal,
            'namakota' => $DataProfile->namakota,
            'alamatlengkap' => $DataProfile->alamatlengkap,
            'profileId' => $DataProfile->id,
            'tglregis' => $tglRegis,
        );
//        return $this->respond($dataReport);
        return view('design.cetak-bukti-pendaftaraan',compact('dataReport'));
    }

    public function getDataSuratPersetujuanUmumCetak(Request $request){
        $user = $request['strIdPegawai'];
        $kdProfile = (int) $request['kdProfile'];
        $Tgl = self::getDateIndo( date('Y-m-d H:i:s'));
        $idKepalaRs = (int) $this->settingDataFixed('KdKepalaRumahSakit', $kdProfile);
        $DataProfile = DB::table('profile_m')
            ->where('id', $kdProfile)
            ->first();
        $dataSurat = DB::table('suratketerangan_t as sk')
            ->join('pasiendaftar_t as pd','pd.norec','=', 'sk.pasiendaftarfk')
            ->join('pasien_m as pm','pm.id','=','pd.nocmfk')
            ->leftJoin('alamat_m as alm','alm.nocmfk','=','pm.id')
            ->join('pegawai_m as pg','pg.id','=','sk.dokterfk')
            ->join('jeniskelamin_m as jk','jk.id','=','pm.objectjeniskelaminfk')
            ->leftJoin('pekerjaan_m as pk','pk.id','=','pm.objectpekerjaanfk')
            ->leftJoin('pangkat_m AS pt','pt.id','=','pg.objectpangkatfk')
            ->leftJoin('jabatan_m AS jb','jb.id','=','pg.objectjabataninternalfk')
            ->join('antrianpasiendiperiksa_t as apd',function($join){
                $join->on('apd.noregistrasifk','=','pd.norec');
                $join->on('apd.objectruanganfk','=','pd.objectruanganlastfk');
            })
            ->join('ruangan_m AS ru','ru.id','=','pd.objectruanganlastfk')
            ->join('departemen_m AS dep','dep.id','=','ru.objectdepartemenfk')
            ->leftJoin('kamar_m AS kmr','kmr.id','=','apd.objectkamarfk')
            ->leftJoin('tempattidur_m AS tt','tt.id','=','apd.nobed')
            ->leftJoin('desakelurahan_m as dk','dk.id','=','alm.objectdesakelurahanfk')
            ->leftJoin('kecamatan_m AS kc','kc.id', '=','alm.objectkecamatanfk')
            ->leftJoin('kotakabupaten_m AS kb','kb.id','=', 'alm.objectkotakabupatenfk')
            ->leftJoin('propinsi_m as prop','prop.id','=','alm.objectpropinsifk')
            ->select(DB::raw("'/VIII/' || to_char(now(),'YYYY') AS nomor,sk.nosurat,sk.norec,pm.nocm,pd.noregistrasi,pm.namapasien,pm.tempatlahir,  
                                    to_char(pm.tgllahir, 'DD-MM-YYYY') AS tgllahir,jk.jeniskelamin,alm.alamatlengkap,  
                                    sk.keterangan,pg.namalengkap,'NIP. ' || CASE WHEN pg.nippns IS NULL THEN '' ELSE pg.nippns END AS nip,  
                                    CASE WHEN pk.pekerjaan IS NULL THEN '' ELSE pk.pekerjaan END AS pekerjaan,  
                                    pd.tglregistrasi,CASE WHEN pg.objectpangkatfk IS NULL THEN '' ELSE pt.namapangkat END AS pangkat,  
                                    CASE WHEN pg.nippns IS NULL THEN '' ELSE pg.nippns END AS nippns,  
                                    CASE WHEN pg.objectjabataninternalfk IS NULL THEN '' ELSE jb.namajabatan END AS jabatan,  
                                    CASE WHEN pd.tglpulang IS NOT NULL THEN pd.tglpulang ELSE NOW() END AS tglpulang,
			                        ru.namaruangan	|| ' / ' || kmr.namakamar || ' ( ' || tt.nomorbed || ' )' as kamar,
			                        CASE WHEN pm.penanggungjawab IS NOT NULL THEN pm.penanggungjawab ELSE pm.namapasien END AS penanggungjawab,
			                        CASE WHEN pm.notelepon IS NULL AND pm.nohp IS NULL THEN '' 
			                        WHEN pm.notelepon IS NOT NULL AND pm.nohp IS NOT NULL THEN pm.notelepon || ' / ' || pm.nohp
			                        WHEN pm.notelepon IS NOT NULL AND pm.nohp IS NULL THEN pm.notelepon
			                        WHEN pm.nohp IS NOT NULL AND pm.notelepon IS NULL THEN pm.nohp END AS notelepon,
			                        dk.namadesakelurahan,kc.namakecamatan,kb.namakotakabupaten,prop.namapropinsi,alm.kodepos,dep.namadepartemen"))
            ->where('sk.kdprofile', $kdProfile)
            ->where('sk.norec', $request['norec'])
            ->get();
        if(count($dataSurat) == 0){
            return 'Data tidak ada';
            die;
        }
        $KepalaRs = \DB::table('pegawai_m AS pg')
            ->leftJoin('pangkat_m AS pt','pt.id','=','pg.objectpangkatfk')
            ->leftJoin('jabatan_m AS jb','jb.id','=','pg.objectjabataninternalfk')
            ->select(DB::raw("pg.namalengkap,pg.nippns,CASE WHEN pg.objectpangkatfk IS NULL THEN '' ELSE pt.namapangkat END AS pangkat,
			                         CASE WHEN pg.nippns IS NULL THEN '' ELSE pg.nippns END AS nippns,CASE WHEN pg.objectjabataninternalfk IS NULL THEN '' ELSE jb.namajabatan END AS jabatan"))
            ->where('pg.kdprofile', $kdProfile)
            ->where('pg.id',$idKepalaRs)
            ->first();

        $tglRegis= '';
        $tglPulang='';
        $nrp ='';
        foreach ($dataSurat as $item){
            $tglRegis = self::getDateIndo($item->tglregistrasi) ;
            $tglPulang = self::getDateIndo($item->tglpulang);
            $nrp = $item->pangkat . ' NRP ' . $item->nippns;
        }

        $dataReport = array(
            'data' => $dataSurat,
            'kepalaRs' => $KepalaRs,
            'tanggal' => $Tgl,
            'tanggalrawat' => $tglRegis . ' s.d ' . $tglPulang,
            'nrp'=> $nrp,
            'namaprofile' => $DataProfile->namalengkap,
            'namaexternal' => $DataProfile->namaexternal,
            'namakota' => $DataProfile->namakota,
            'profileId' => $DataProfile->id,
        );

//        return $this->respond($dataSurat);
        return view('design.cetak-surat-persetujuan-umum',compact('dataReport'));
    }
    public function cetakHasilLIS(Request $r) {
        $kdProfile = (int)$r['kdprofile'];
        $raw = collect(DB::select("SELECT
                so.tglorder,
                ps.nocm,
                so.noorder AS noorder,
                ps.namapasien,
                ps.tgllahir,
                jk.jeniskelamin,
            pg2.namalengkap as dokter,
            pg3.namalengkap as dokterverif,
                CASE
            WHEN alm.alamatlengkap IS NULL THEN
                '-'
            ELSE
                alm.alamatlengkap
            END AS alamatlengkap,
             ru.namaruangan,
             pd.noregistrasi,
             pg.namalengkap as djp,
             date_part('year', age(ps.tgllahir)) usia,
             kp.kelompokpasien AS cara_bayar,
             ru2.namaruangan AS ruangantujuan,
             pd.norec as norec_pd,kps.kelompokpasien
            FROM
                strukorder_t AS so
            INNER JOIN pasien_m AS ps ON ps. ID = so.nocmfk
            INNER JOIN pasiendaftar_t AS pd ON pd.norec = so.noregistrasifk
            INNER JOIN kelompokpasien_m AS kp ON kp. ID = pd.objectkelompokpasienlastfk
            INNER JOIN ruangan_m AS ru ON ru. ID = pd.objectruanganlastfk
            INNER JOIN ruangan_m AS ru2 ON ru2. ID = so.objectruangantujuanfk
            LEFT JOIN jeniskelamin_m AS jk ON jk. ID = ps.objectjeniskelaminfk
            LEFT JOIN kelompokpasien_m AS kps ON kps. ID = pd.objectkelompokpasienlastfk
            LEFT JOIN alamat_m AS alm ON alm.nocmfk = ps. ID
            LEFT JOIN pegawai_m AS pg ON pg. ID = so.objectpegawaiorderfk
            LEFT JOIN pegawai_m AS pg2 ON pg2. ID = pd.objectpegawaifk
            LEFT JOIN order_lab AS ol ON ol. no_lab = so.noorder
            LEFT JOIN pegawai_m AS pg3 ON pg3. ID =  ol.kode_dok_kirim::integer
            WHERE
                so.noorder = '$r[noorder]'
            AND so.kdprofile = $kdProfile
            AND so.statusenabled = TRUE;"))->first();
    $order_lab = collect(DB::select("SELECT
              *
            FROM
                order_lab AS so
             WHERE
                so.no_lab = '$r[noorder]'"))->first();
        if(!empty($raw)){
            $raw->umur = $this->getAge($raw->tgllahir ,date('Y-m-d'));
            $pdnorec = $raw->norec_pd;
            $diag =  DB::select(DB::raw("select DISTINCT dg.kddiagnosa , dg.namadiagnosa,pd.noregistrasi
                from pasiendaftar_t as pd 
                join antrianpasiendiperiksa_t as apd on apd.noregistrasifk =pd.norec
                join detaildiagnosapasien_t  as ddp on ddp.noregistrasifk=apd.norec
                join diagnosa_m  as dg on dg.id=ddp.objectdiagnosafk
                where pd.kdprofile=$kdProfile
                and pd.statusenabled =true
                and pd.norec ='$pdnorec'"));
            $raw->diagnosa = '';
            $arr ='';
            if(count($diag) > 0){
                foreach ($diag as $d){
                    $arr = $d->kddiagnosa .'-' .$d->namadiagnosa .  ' ,' .$arr;
                }
                $raw->diagnosa = $arr;
            }
        }

//        dd($raw);
//         $ip =$this->settingDataFixed('urlHasilLIS',$kdProfile);
//         $curl = curl_init();
//         curl_setopt_array($curl, array(
//             CURLOPT_URL => $ip.'lab_result/api/examination_result/result/'.$r['noorder'],//$data->result_id,
//             CURLOPT_RETURNTRANSFER => true,
//             CURLOPT_ENCODING => "",
//             CURLOPT_MAXREDIRS => 10,
//             CURLOPT_TIMEOUT => 30,
//             CURLOPT_SSL_VERIFYHOST => 0,
//             CURLOPT_SSL_VERIFYPEER => 0,
//             CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
//             CURLOPT_CUSTOMREQUEST => "GET",
// //            CURLOPT_POSTFIELDS => $post,
//             CURLOPT_HTTPHEADER => array(
//                 "Content-Type: application/json;",
//             ),
//         ));

//         $response = curl_exec($curl);
//         $err = curl_error($curl);

//         curl_close($curl);

//         if ($err) {

           $pageWidth = 950;
           $footer =true;
           $result= collect( DB::connection('sqlsrv')
               ->select("select 
                REG_DATE as reg_date ,
                NOLAB_RS AS visit_trans_id,  PARAMETER_ID AS examination_id,
                PARAMETER_NAME AS examination_name, HASIL AS result_value,  SATUAN AS unit,
                NILAI_RUJUKAN AS normal_value,  METODE_PERIKSA AS metode,   KEL_PEMERIKSAAN AS treatment_name,
                URUT_BOUND AS urut, NORM AS rm_number,  MODIFIED_DATE AS visit_date,    KODE_TARIF AS tarif_id,
                TARIF_NAME AS tarif_name,   FLAG_HL AS flag  
                from HasilLIS
                where NOLAB_RS= '$r[noorder]'"));
           if(count($result) == 0){
            echo 'Data Tidak Ada';
            return;
           }
           $footer =true;
           $data = array(
             'res' => $result,
             'jenis' => 'bridging'
           );
           // dd($data);
           return view('report.lab.hasil-lis',
            compact('data','raw', 'pageWidth','r','footer','order_lab'));
            // $result = "cURL Error #:" . $err;
//         } else {
//             $result = json_decode($response);
//         }
        
//         $data['jenis'] = 'bridging';
// //        dd($result);
//         if($result->status ==200){
//             $data['res'] = $result->data;
//         }else{
//             echo 'Data Tidak Ada';
//             return;
//         }

//         if($result == null){

//            $result= collect( DB::connection('sqlsrv')
//                ->select("select * from HasilLIS
//            where NOLAB_RS= '$r[noorder]'"));
// //           dd($result);

//             $data['jenis'] = 'non';
//             $data['res'] = $result;
//         }
//        dd($data);
        // return view('report.lab.hasil-lis',
        //     compact('data','raw', 'pageWidth','r','footer','order_lab'));

    }
    public function cetakEkspertise(Request $r) {
        $kdProfile = (int)$r['kdprofile'];
        //$dataSO =  HasilRadiologi::where('norec',$r[norec])->first();
        $tglCetak = DB::table('hasilradiologi_t')
                            ->where('norec','=',$r['norec'])
                            ->get();
        //   dd($tglCetak[0]->tglcetak);
        if (count($tglCetak)>0){
            if(is_null($tglCetak[0]->tglcetak)){
                $updateTglCetak = DB::table('hasilradiologi_t')
                            ->where('norec','=',$r['norec'])
                            ->update(['tglcetak'=>date("Y-m-d H:i:s")]);
            }

        }
        //var_dump($tglCetak);
        //var_dump($updateTglCetak);   
        $raw = collect(DB::select("
            SELECT
                so.nofoto,ps.nocm, ps.namapasien,ps.tgllahir,kp.kelompokpasien,
            ru.namaruangan, so.tanggal,jk.jeniskelamin,  
            CASE WHEN alm.alamatlengkap IS NULL THEN
                '-' ELSE 
                alm.alamatlengkap
            END AS alamatlengkap,
            pg.namalengkap as perujuk,pg2.namalengkap as dokterrad,
            pr.namaproduk,so.keterangan,pd.noregistrasi,pg2.nippns,
            pg2.id as pgid
            FROM
                hasilradiologi_t AS so
            INNER JOIN pasiendaftar_t AS pd ON pd.norec = so.noregistrasifk
            INNER JOIN pasien_m AS ps ON ps. ID = pd.nocmfk
            INNER JOIN kelompokpasien_m AS kp ON kp. ID = pd.objectkelompokpasienlastfk
            INNER JOIN ruangan_m AS ru ON ru. ID = pd.objectruanganlastfk
            INNER JOIN pelayananpasien_t AS pp ON pp.norec = so.pelayananpasienfk
            INNER JOIN produk_m AS pr ON pr.id = pp.produkfk
            LEFT JOIN jeniskelamin_m AS jk ON jk. ID = ps.objectjeniskelaminfk
            LEFT JOIN kelompokpasien_m AS kps ON kps. ID = pd.objectkelompokpasienlastfk
            LEFT JOIN alamat_m AS alm ON alm.nocmfk = ps. ID
            left join desakelurahan_m as ds on ds.id=alm.objectdesakelurahanfk
            left join kotakabupaten_m as kk on kk.id=alm.objectkotakabupatenfk
            left join kecamatan_m as kc on kc.id=alm.objectkecamatanfk
            left join propinsi_m as pro on pro.id=alm.objectpropinsifk
            LEFT JOIN pegawai_m AS pg ON pg. ID = pd.objectpegawaifk
            LEFT JOIN pegawai_m AS pg2 ON pg2. ID = so.pegawaifk
            WHERE
                so.norec = '$r[norec]'
            AND so.kdprofile = $kdProfile
            AND so.statusenabled = TRUE
        "))->first();
//        dd($raw);
        if(!empty($raw)){
            $raw->umur = $this->getAge($raw->tgllahir ,date('Y-m-d'));
        }else{
            echo 'Data Tidak ada ';
            return;
        }
//        dd($raw);
        $pageWidth = 950;

        return view('report.rad.expertise',
            compact('raw', 'pageWidth','r'));

    }
    public function getKegiatanRanap(Request $r){
        $kdProfile = (int)$r['kdprofile'];
        $deptRanap = explode (',',$this->settingDataFixed('kdDepartemenRanapFix',  $kdProfile ));
        $kdDepartemenRawatInap = [];
        foreach ($deptRanap as $itemRanap){
            $kdDepartemenRawatInap []=  (int)$itemRanap;
        }
        $ruangan = Ruangan::where('kdprofile',$kdProfile)
            ->where('statusenabled',true)
            ->whereIn('objectdepartemenfk',$kdDepartemenRawatInap)
            ->select('id','namaruangan')
            ->get();

//        dd($ruangan);
//        $borlos = $this->getBorlostoi($r);
//        dd($borlos);
        $pasienPulang = $this->getPasienPulang($r);
//        dd($borlos);
        $pageWidth = 950;

        return view('report.rekammedis.kegiatan-ranap',
                compact('ruangan',
                    'pageWidth','r'));


    }
    function  getPasienPulang($request){
        $dat = DB::select(DB::raw("
            select case when x.skid =1 and x.spid in (1,2,6) then 'Biasa'
            when x.spid=12 then 'Paksa'
            when x.spid=3 then 'Kabur'
            when x.spid in (4,5,10,11) then 'Rujuk'
            when x.spid in (7) then 'Pindah'
            when x.kpid in (5) then '< 24 jam'
            when x.kpid in (6) then '> 24 jam'
            end as uraian,x.namaruangan
            from (
            select pd.noregistrasi, pd.tglregistrasi,pd.tglpulang, ru.namaruangan,
            ru.id,pd.objectstatuskeluarfk as skid,sk.statuskeluar,
            pd.objectstatuspulangfk as spid,
            sp.statuspulang,apd.israwatgabung,
            pd.objectkondisipasienfk as kpid,kp.kondisipasien,
            row_number() over (partition by pd.noregistrasi order by apd.tglmasuk asc) as rownum 
            from pasiendaftar_t as pd 
            join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
            and apd.objectruanganfk=pd.objectruanganlastfk
            left join ruangan_m as ru on ru.id = pd.objectruanganlastfk 
            left join statuskeluar_m as sk on sk.id = pd.objectstatuskeluarfk
            left join statuspulang_m as sp on sp.id = pd.objectstatuspulangfk
            left join kondisipasien_m as kp on kp.id = pd.objectkondisipasienfk
            where pd.kdprofile = 21 
            and ru.objectdepartemenfk =16
            and pd.statusenabled = true 
            and to_char(pd.tglpulang,'yyyy-MM') ='2020-10'
            )
            as x where x.rownum=1
            "));
    }
        public function getBorlostoi( $request)
        {
            $kdProfile = (int)$request['kdprofile'];
            $bulan = $request['bulan'];
            $dateStart = Carbon::now();
            $dayInMonth = array();
            $type = CAL_GREGORIAN;
            $month = Carbon::parse($bulan)->format('m'); // Month ID, 1 through to 12.

            $year = Carbon::parse($bulan)->format('Y'); //date('Y'); // Year in 4 digit 2009 format.
            $day_count = cal_days_in_month($type, $month, $year); // Get the amount of days\

            for ($i = 1; $i <= $day_count; $i++) {
                $date = $year.'/'.$month.'/'.$i; //format date
                $get_name = date('l', strtotime($date)); //get week day
                $day_name = substr($get_name, 0, 3); // Trim day name to 3 chars

                //if not a weekend add day to array
//            if($day_name != 'Sun' && $day_name != 'Sat'){
                $strLength= strlen($i);
                if($strLength  == 1){
                    $i = '0'.$i;
                }
//            return $this->respond($countDay);
                $dayInMonth[] = Carbon::parse($bulan)->format('Y').'-'.$month.'-'.$i;// date ('Y-'.$month.'-'.$i);
//            }
            }

            $kamar =  DB::select(DB::raw("select count(x.idkelas) as tt,x.namakelas ,x.idkelas,
            0 as ld,0 as hp,0 as jmlpasienkeluar,0 as bor,0 as los ,0 as toi, 0 as bto, 0 as ndr,0 as gdr
          from (
            SELECT
                ru.id AS idruangan,  ru.namaruangan,
                km.id AS idkamar,
                km.namakamar,
                kl.id AS idkelas,
                kl.namakelas
            FROM
                tempattidur_m AS tt
            LEFT JOIN kamar_m AS km ON km.id = tt.objectkamarfk
            LEFT JOIN ruangan_m AS ru ON ru.id = km.objectruanganfk
            LEFT JOIN kelas_m AS kl ON kl.id = km.objectkelasfk
            WHERE 	ru.objectdepartemenfk IN (16, 35)
            AND ru.statusenabled = 1
            AND km.statusenabled = 1
            AND tt.statusenabled = 1
            ) as x
            group by x.namakelas,x.idkelas"));

            $firstDay = $bulan.'-01';
            $lastDay = $bulan.'-'. $day_count;
//        return $this->respond($firstDay);
            $pasien = DB::select(DB::raw(" SELECT
                pd.noregistrasi,
                pd.tglregistrasi,
                pd.tglpulang,
                 pd.objectkelasfk,
                    DATEDIFF(DAY, pd.tglregistrasi, pd.tglpulang) as hari 
                FROM
                    pasiendaftar_t AS pd
                INNER JOIN ruangan_m AS ru ON ru.ID = pd.objectruanganlastfk
                WHERE
                    ru.objectdepartemenfk = 16
               -- AND pd.tglpulang BETWEEN '$firstDay' and '$lastDay'
                order by pd.tglpulang asc
                "));
            $LD = DB::select(DB::raw(" SELECT
                pd.noregistrasi,
                pd.tglregistrasi,
                pd.tglpulang,
                 pd.objectkelasfk,
                    DATEDIFF(DAY, pd.tglregistrasi, pd.tglpulang) as hari 
                FROM
                    pasiendaftar_t AS pd
                INNER JOIN ruangan_m AS ru ON ru.ID = pd.objectruanganlastfk
                WHERE
                    ru.objectdepartemenfk = 16
              AND pd.tglregistrasi BETWEEN '$firstDay' and '$lastDay'
                order by pd.tglpulang asc
                "));

            $dataMeninggal = DB::select(DB::raw("select count(x.noregistrasi) as jumlahmeninggal, x.bulanregis,  
                count(case when x.objectkondisipasienfk = '6' then 1 end ) AS jumlahlebih48 FROM
                (
                select noregistrasi,Format(tglregistrasi , 'mm')  as bulanregis ,statuskeluar,kondisipasien,objectkondisipasienfk
                from pasiendaftar_t 
                join statuskeluar_m on statuskeluar_m.id =pasiendaftar_t.objectstatuskeluarfk
                left join kondisipasien_m on kondisipasien_m.id =pasiendaftar_t.objectkondisipasienfk
                where objectstatuskeluarfk =5
                and  tglregistrasi BETWEEN '$firstDay' and '$lastDay'
                ) as x
                GROUP BY x.bulanregis;"));
//        $dayInMonth = [ '2019-12-30'];
            $jmlHP = 0 ;
            $i = 0;
            $data = [];
            foreach ($dayInMonth as $day){
                foreach ($pasien as $item){
                    foreach ($kamar as $kamarss){
                        if($item->tglpulang != null){
                            if(Carbon::parse($item->tglregistrasi)->format('Y-m-d') <= date($dayInMonth[$i])
                                && date($dayInMonth[$i]) <= Carbon::parse($item->tglpulang)->format('Y-m-d')
                                && (int)  $kamarss->idkelas == (int) $item->objectkelasfk ){
                                $kamarss->hp =(int)  $kamarss->hp + 1;
                            }
                        }else{
                            if(Carbon::parse($item->tglregistrasi)->format('Y-m-d') <= date($dayInMonth[$i])
                                && (int)  $kamarss->idkelas == (int) $item->objectkelasfk ){
                                $kamarss->hp =(int)  $kamarss->hp + 1;
                            }
                        }

                    }
                }
                $i = $i+1;
            }
            foreach ($kamar as $kamarss) {
                foreach ($LD as $item) {
                    if( (int) $item->objectkelasfk == (int) $kamarss->idkelas){
                        $kamarss->ld = (int)$kamarss->ld  + (int)$item->hari;
                        $kamarss->jmlpasienkeluar = (int) $kamarss->jmlpasienkeluar  +1;
                    }
                }
            }
            foreach ($kamar as $item) {
                /** @var  $bor = (Jumlah hari perawatn RS dibagi ( jumlah TT x Jumlah hari dalam satu periode ) ) x 100 % */
                $item->bor = ((int)$item->hp / ((float)$item->tt * (float)$day_count)) * 100;//$numday['jumlahhari']));

                /** @var  $alos = (Jumlah Lama Dirawat dibagi Jumlah pasien Keluar (Hidup dan Mati) */
                if ((int)$item->jmlpasienkeluar > 0){
                    $item->los = (int)$item->ld / (int)$item->jmlpasienkeluar;
                }

                /** @var  $toi = (Jumlah TT X Periode) - Hari Perawatn DIBAGI Jumlah pasien Keluar (Hidup dan Mati)*/
                if ( (int)$item->jmlpasienkeluar > 0){
                    $item->toi =  (( (float)$item->tt  *  (float)$day_count) - (int)$item->hp)  /(int)$item->jmlpasienkeluar ;
                }

                /** @var  $bto = Jumlah pasien Keluar (Hidup dan Mati) DIBAGI Jumlah tempat tidur */
                $item->bto = (int)$item->jmlpasienkeluar / (float)$item->tt;

                if(count($dataMeninggal)> 0 ) {
                    foreach ($dataMeninggal as $itemDead) {
                        /** @var  $gdr = (Jumlah Mati dibagi Jumlah pasien Keluar (Hidup dan Mati) */
                        $item->gdr = (int)$itemDead->jumlahmeninggal * 1000 / (int)$item->jmlpasienkeluar;

                        /** @var  $NDR = (Jumlah Mati > 48 Jam dibagi Jumlah pasien Keluar (Hidup dan Mati) */
                        $item->ndr = (int)$itemDead->jumlahlebih48 * 1000 / (int)$item->jmlpasienkeluar;
                    }
                }
            }
            foreach ($kamar as $key => $row) {
                $count[$key] = $row->namakelas;
            }
            array_multisort($count, SORT_ASC, $kamar);
            $result = array(
                'data' => $kamar,
                'by' => 'er@epic'
            );

            return $this->respond($result);
        }

    public static  function getPasienAwal($ruid,$bulan,$kdprofile){
        $data = collect(DB::select("select pd.noregistrasi, pd.tglregistrasi,pd.tglpulang, ru.namaruangan,
            ru.id
            from pasiendaftar_t as pd 
            left join ruangan_m as ru on ru.id = pd.objectruanganlastfk 
            where pd.kdprofile = $kdprofile 
            and pd.statusenabled = true 
            and ru.id = $ruid
            and pd.tglpulang is null and to_char(pd.tglregistrasi,'yyyy-MM') <'$bulan'"))
        ->count();
//        dd($data);
        return $data;
    }
    public function cetakHispatologi(Request $r) {
        $kdProfile = (int)$r['kdprofile'];
        $raw = collect(DB::select("
            SELECT
                pd.noregistrasi, pm.nocm, pm.namapasien, hpl.dokterluar, dokterpengirim.namalengkap as namadokterpengirim,
                jk.jeniskelamin || '/ ' || EXTRACT ( YEAR
                    FROM AGE(  pd.tglregistrasi,pm.tgllahir )
                ) || ' Thn ' || EXTRACT (MONTH  FROM AGE(  pd.tglregistrasi, pm.tgllahir )
                ) || ' Bln ' || EXTRACT ( DAY  FROM  AGE( pd.tglregistrasi, pm.tgllahir )  ) || ' Hr' || '(' || to_char(pm.tgllahir, 'DD-MM-YYYY') || ')' AS umur,
                to_char(  so.tglorder, 'DD-MM-YYYY HH24:MI:SS') AS tglorder,
                to_char( hpl.tanggal, 'DD-MM-YYYY HH24:MI:SS'  ) AS tgljawab,
                to_char( pp.tglpelayanan,'DD-MM-YYYY HH24:MI:SS' ) AS tglterima,
                to_char(  sbm.tglsbm,'DD-MM-YYYY HH24:MI:SS' ) AS tglbayar, pg.namalengkap,
             CASE WHEN hpl.diagnosaklinik IS NULL THEN  ''  ELSE  diagnosaklinik  END AS diagnosaklinik,
             CASE WHEN hpl.keteranganklinik IS NULL THEN ''   ELSE hpl.keteranganklinik  END AS keteranganklinik,
             CASE WHEN hpl.makroskopik IS NULL THEN   '' ELSE  hpl.makroskopik END AS makroskopik, 
             CASE WHEN hpl.mikroskopik IS NULL THEN ''   ELSE  hpl.mikroskopik END AS mikroskopik, 
             CASE WHEN hpl.kesimpulan IS NULL THEN '' ELSE hpl.kesimpulan END AS kesimpulan,
             CASE WHEN hpl.anjuran IS NULL THEN  '' ELSE  hpl.anjuran END AS anjuran,
             CASE WHEN hpl.topografi IS NULL THEN   '' ELSE hpl.topografi  END AS topografi, 
             CASE WHEN hpl.morfologi IS NULL THEN  '' ELSE hpl.morfologi END AS morfologi,
             CASE WHEN hpl.diagnosapb IS NULL THEN  '' ELSE  hpl.diagnosapb  END AS diagnosapb,
             CASE WHEN hpl.keteranganpb IS NULL THEN ''  ELSE hpl.keteranganpb END AS keteranganpb,
             CASE WHEN pg1.namalengkap IS NULL THEN '' ELSE  pg1.namalengkap   END AS namapenanggungjawab,
             CASE WHEN pg1.nippns IS NULL THEN ''ELSE  pg1.nippns END AS nippns,hpl.nomorpa,
             ru.namaruangan as asal,pg1.nosip,
              CASE
                    WHEN alm.alamatlengkap IS NULL THEN
                        '-'
                    ELSE
                        (
                            alm.alamatlengkap || ' ' || (
                                CASE
                                WHEN ds.namadesakelurahan IS NOT NULL THEN
                                   'Kel. ' ||  ds.namadesakelurahan
                                ELSE
                                    ''
                                END
                            ) || ' ' || (
                                CASE
                                WHEN kc.namakecamatan IS NOT NULL THEN
                                   'Kec. ' || kc.namakecamatan
                                ELSE
                                    ''
                                END
                            ) || ' ' || (
                                CASE
                                WHEN kk.namakotakabupaten IS NOT NULL THEN
                                  kk.namakotakabupaten
                                ELSE
                                    ''
                                END
                            ) || ' ' || (
                                CASE
                                WHEN prop.namapropinsi IS NOT NULL THEN
                                 'Prov. ' ||   prop.namapropinsi
                                ELSE
                                    ''
                                END
                            )
                        )
                    END AS alamatlengkap,
                    kps.kelompokpasien,pd.norec as norec_pd,pd.objectruanganlastfk
            FROM
                hasilpemeriksaanlab_t AS hpl
            INNER JOIN pasiendaftar_t AS pd ON pd.norec = hpl.noregistrasifk
            INNER JOIN pelayananpasien_t AS pp ON pp.norec = hpl.pelayananpasienfk
            LEFT JOIN strukorder_t AS so ON so.norec = pp.strukorderfk
            LEFT JOIN strukpelayanan_t AS sp ON sp.norec = pp.strukfk
            LEFT JOIN strukbuktipenerimaan_t AS sbm ON sbm.nostrukfk = pp.norec
            INNER JOIN produk_m AS pro ON pro. ID = pp.produkfk
            INNER JOIN pasien_m AS pm ON pm. ID = pd.nocmfk
            LEFT JOIN jeniskelamin_m AS jk ON jk. ID = pm.objectjeniskelaminfk
            LEFT JOIN pegawai_m AS pg ON pg. ID = so.objectpegawaiorderfk
            LEFT JOIN pegawai_m AS pg1 ON pg1. ID = hpl.pegawaifk
            LEFT JOIN pegawai_m AS dokterpengirim ON dokterpengirim. ID = hpl.dokterpengirimfk
             LEFT JOIN ruangan_m AS ru ON ru. ID = pd.objectruanganlastfk
            left join alamat_m as alm on alm.nocmfk=pm.id
            left join desakelurahan_m as ds on ds.id=alm.objectdesakelurahanfk
            left join kotakabupaten_m as kk on kk.id=alm.objectkotakabupatenfk
            left join kecamatan_m as kc on kc.id=alm.objectkecamatanfk
            left join propinsi_m as prop on prop.id=alm.objectpropinsifk
              left join kelompokpasien_m as kps on kps.id=pd.objectkelompokpasienlastfk
            WHERE
                pp.norec = '$r[norec]'
                and hpl.statusenabled=true
        "))->first();
//        dd($raw);
        if(!empty($raw)){
            $norec_pd = $raw->norec_pd;
            $objectruanganlastfk = $raw->objectruanganlastfk;
            $asalRujukan = collect(DB::select("select
                    asalrujukan from antrianpasiendiperiksa_t as apd 
                join asalrujukan_m as asl on asl.id=apd.objectasalrujukanfk
                where apd.noregistrasifk='$norec_pd'
                and apd.objectruanganfk=$objectruanganlastfk
                and apd.kdprofile=$kdProfile
                "))->first();
            $raw->asalrujukan ='';
            if(!empty( $asalRujukan )){
              $raw->asalrujukan=  $asalRujukan->asalrujukan;
            }

//            $raw->umur = $this->getAge($raw->tgllahir ,date('Y-m-d'));
        }else{
            echo 'Data Tidak ada ';
            return;
        }
//        dd($raw);
        $pageWidth = 950;

        return view('report.lab.hispatologi',
            compact('raw', 'pageWidth','r'));

    }


    function getDataLaporanPenerimaanSemuaKasirPDF(Request $request) {
        $kdProfile = $request['kdProfile'];
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];

        $idKasir = '';
        $idRuangan = '';
        if (isset($request['idKasir']) && $request['idKasir'] != "" && $request['idKasir'] != "undefined") {
            $idKasir = 'AND p.id ='.$request['idKasir'];
        }
        if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
            $idRuangan = 'AND p.id ='.$request['idRuangan'];
        }

        $data = \DB::select(DB::raw("
                    SELECT
                        p.namalengkap AS namapenerima,
                        sum(cast(sbm.totaldibayar AS float)) AS totalpenerimaan,
                        '' AS keterangan
                    FROM strukbuktipenerimaan_t AS sbm
                    INNER JOIN strukpelayanan_t AS sp ON sbm.nostrukfk = sp.norec
                    LEFT JOIN pasiendaftar_t AS pd ON sp.noregistrasifk = pd.norec
                    LEFT JOIN ruangan_m as ru ON ru.id=pd.objectruanganlastfk
                    LEFT JOIN loginuser_s AS lu ON lu.id = sbm.objectpegawaipenerimafk
                    LEFT JOIN pegawai_m AS p ON p.id = lu.objectpegawaifk
                    WHERE
                        sbm.kdprofile = $kdProfile
                        AND sbm.tglsbm >= '$tglAwal' 
                        AND sbm.tglsbm <= '$tglAkhir' 
                        $idKasir
                        $idRuangan
                    GROUP BY p.namalengkap"
                ));

            $totalsaldo = 0;
            foreach ($data as $d) {
                $totalsaldo += $d->totalpenerimaan;
            }
            $terbilang = $this->terbilang($totalsaldo);

            $pdf = PDF::loadView('report.pdf.LaporanPenerimaanSemuaKasir', array(
                        'data' => $data,
                        'terbilang' => $terbilang,
                        'tglAwal' => $tglAwal,
                        'tglAkhir' => $tglAkhir)
                    );

            return $pdf->download('LaporanPenerimaanSemuaKasir.pdf');
            // return view('report.pdf.LaporanPenerimaanSemuaKasir', compact('data','terbilang','tglAwal','tglAkhir'));
    }

    public function cetakResepDokter(Request $r) {
        $kdProfile = (int)$r['kodeprofile'];
        $noorder = $r['noorder'];
        $norec = $r['norec'];
        $nocm = $r['nocm'];
        $qtybagi = 1;
        if ($r['qtybagi'] == "1/2"){
            $qtybagi = 0.5;
        }else{
            $qtybagi = (int)$r['qtybagi'];
        }
        $profile = \DB::select(DB::raw("
                select * from profile_m where id = $kdProfile limit 1
            "));
        $raw = collect(DB::select("
            select pm2.nocm ,to_char(pm2.tgllahir,'dd-mm-yyyy') as tgllahir,age(pm2.tgllahir) as umur ,jm.jeniskelamin ,pm2.namapasien ,pm3.namalengkap, rm.namaruangan, 
            to_char(st.tglorder,'dd-mm-yyyy MM:ss') as tglorder,pm3.nosip, kp.kelompokpasien from strukorder_t st
            inner join pasien_m pm2 on pm2.id = st.nocmfk
            inner join jeniskelamin_m jm on jm.id = pm2.objectjeniskelaminfk
            inner join pegawai_m pm3 on pm3.id = st.objectpegawaiorderfk
            inner join ruangan_m rm on rm.id = st.objectruanganfk 
            inner join pasiendaftar_t AS pd ON pd.norec = st.noregistrasifk
            left join kelompokpasien_m AS kp ON kp.id = pd.objectkelompokpasienlastfk
            where st.noorder = '$noorder'
        "))->first();
        $detel = [];
        $details = \DB::select(DB::raw("select ot.rke,pm.namaproduk,ot.dosis,pm.kekuatan ,ot.jumlah*$qtybagi as jumlah, ot.aturanpakai from strukorder_t st
            inner join orderpelayanan_t ot on ot.strukorderfk = st.norec 
            inner join produk_m pm on pm.id = ot.objectprodukfk 
            where st.noorder = '$noorder'"));
//        dd($raw);
        if(!empty($raw)){
            // $raw->umur = $this->getAge($raw->tgllahir ,date('Y-m-d'));
        }else if (empty($raw)){
            $raw = collect(DB::select("
                select pm2.nocm ,to_char(pm2.tgllahir,'dd-mm-yyyy') as tgllahir,age(pm2.tgllahir) as umur ,jm.jeniskelamin ,pm2.namapasien ,pm3.namalengkap, rm.namaruangan, to_char(s.tglresep ,'dd-mm-yyyy MM:ss') as tglorder,pm3.nosip, kp.kelompokpasien
                from strukresep_t s
                inner join antrianpasiendiperiksa_t at2 on at2.norec = s.pasienfk 
                inner join pasiendaftar_t pt on pt.norec = at2.noregistrasifk 
                inner join pasien_m pm2 on pm2.id = pt.nocmfk 
                inner join jeniskelamin_m jm on jm.id = pm2.objectjeniskelaminfk
                inner join pegawai_m pm3 on pm3.id = s.penulisresepfk 
                inner join ruangan_m rm on rm.id = s.ruanganfk 
                left join kelompokpasien_m AS kp ON kp.id = pt.objectkelompokpasienlastfk
                where s.norec = '$norec'
            "))->first();
            $details = \DB::select(DB::raw("
                select pt.rke,pt.dosis, pt.jumlah , pt.aturanpakai , pm.namaproduk, pm.kekuatan from pelayananpasien_t pt 
                inner join produk_m pm on pm.id = pt.produkfk 
                where strukresepfk = '$norec'
            "));
        }else{
            echo 'Data Tidak ada ';
            return;
        }
//        dd($raw);
        $pageWidth = 550;

        // return $r['norec'];

        return view('report.apotik.resepdokter',
            compact('raw', 'pageWidth','r','details','profile'));
    }

    public function cetakAntrianKiosk(Request $request) {
        $kdProfile = (int)$request['kdprofile'];
        $norec = $request['norec'];
        $TglAwal =  date('Y-m-d '). '00:00';
        $TglAkhir = date('Y-m-d '). '23:59';
        $tglAyeuna = date('Y-m-d H:i:s');
        $profile = collect(DB::select
            ("
                select * from profile_m where id = $kdProfile limit 1
            "))->first();

        $antrian = DB::table('antrianpasienregistrasi_t AS apr')
                    ->leftJoin('ruangan_m AS ru','ru.id','=','apr.objectruanganfk')
                    ->select(DB::raw("apr.*,CASE WHEN ru.namaruangan IS NULL 
                                        THEN '' ELSE ru.namaruangan END AS namaruangan"))
                    ->where('apr.norec','=',$norec)
                    ->first();

        $str = $antrian->jenis;
        $jmlAntrian = DB::table('antrianpasienregistrasi_t')
            ->select(DB::raw("count(noantrian) as jmlantri"))
            ->where('statuspanggil','=',0)
            ->whereBetween('tanggalreservasi',[$TglAwal, $TglAkhir])
            ->where('jenis','=',$str)
            ->first();

        $noAntrian = $antrian->noantrian;
        $strJenis = $antrian->jenis;
        $jenis = "";
        if ($strJenis == "A"){
            $jenis = "UMUM";
        }elseif ($strJenis == "B"){
            $jenis = "BPJS";
        }
        if (strlen($antrian->noantrian) == 1){
            $noAntrian = "00" . $antrian->noantrian;
        }else{
            $noAntrian = "0" . $antrian->noantrian;
        }
        $pageWidth = 250;
        $dataReport = array(
            'namaprofile' => $profile->namalengkap,
            'alamat' => $profile->alamatlengkap,
            'jenis' => $jenis,
            'noantrian' => $strJenis . "-" . $noAntrian,
            'jmlantrian' => $jmlAntrian->jmlantri,
            'pageWidth'  => 365,
            'tanggal'  => $tglAyeuna,
        );

//        $pdf = PDF::loadView('report.pendaftaran.antrian', array(
//                'dataReport' => $dataReport,
//        ));
//        return $pdf->stream();

        return view('report.pendaftaran.antrian',
            compact('dataReport', 'pageWidth','profile'));
//        return view('','$result');
    }

    public function cetakBuktiPendaftaran(Request $request) {
        $kdProfile = (int)$request['kdprofile'];
        $profile = collect(DB::select
        ("
                select * from profile_m where id = $kdProfile limit 1
            "))->first();

        $registrasi = DB::table('pasiendaftar_t AS pd')
            ->Join('antrianpasiendiperiksa_t as apdp','apdp.noregistrasifk','=','pd.norec')
            ->Join('pasien_m as ps','pd.nocmfk','=','ps.id')
            ->leftJoin('alamat_m as ap','ap.nocmfk','=','ps.id')
            ->leftJoin('jeniskelamin_m as jk','ps.objectjeniskelaminfk','=','jk.id')
            ->leftJoin('ruangan_m as ru','pd.objectruanganlastfk','=','ru.id')
            ->leftJoin('pegawai_m as pp','pd.objectpegawaifk','=','pp.id')
            ->leftJoin('kelompokpasien_m as kp','pd.objectkelompokpasienlastfk','=','kp.id')
            ->leftJoin('antrianpasienregistrasi_t as apr','apr.noreservasi','=','pd.statusschedule')
            ->select(DB::raw("pd.noregistrasi,ps.nocm,ps.tgllahir,ps.namapasien,to_char(pd.tglregistrasi, 'DD-MM-YYYY HH:mm') AS tglregistrasi,jk.reportdisplay AS jk, 
                     ap.alamatlengkap,ap.mobilephone2,ru.namaruangan AS ruanganperiksa,pp.namalengkap AS namadokter, 
                     kp.kelompokpasien,apdp.noantrian,pd.statuspasien,apr.noreservasi,CASE WHEN apr.tanggalreservasi IS NULL THEN '' 
                     ELSE to_char(apr.tanggalreservasi, 'DD-MM-YYYY HH:mm') END AS tanggalreservasi"))
            ->where('pd.noregistrasi', $request['noregistrasi'])
            ->first();

        $statusonline = "";
        $status = "";
        if ($registrasi->tanggalreservasi != ''){
            $statusonline = "PASIEN ONLINE";
            $status = "Kartu ini adalah bukti anda mendaftar hari ini";
        }else{
            $statusonline = "Kartu ini adalah bukti anda mendaftar hari ini";
        }
        $pageWidth = 365;
        $dataReport = array(
            'namaprofile' => $profile->namalengkap,
            'alamat' => $profile->alamatlengkap,
            'tglregistrasi' => $registrasi->tglregistrasi,
            'noregistrasi' => $registrasi->noregistrasi,
            'norm' => $registrasi->nocm,
            'tgllahir' => $registrasi->tgllahir,
            'namapasien' => $registrasi->namapasien,
            'jeniskelamin' => $registrasi->jk,
            'alamatlengkap' => $registrasi->alamatlengkap,
            'mobilephone2' => $registrasi->mobilephone2,
            'ruangan' => $registrasi->ruanganperiksa,
            'namadokter' => $registrasi->namadokter,
            'kelompokpasien' => $registrasi->kelompokpasien,
            'noantrian' => $registrasi->noantrian,
            'statuspasien' => $registrasi->statuspasien,
            'noreservasi' => $registrasi->noreservasi,
            'tanggalreservasi' => $registrasi->tanggalreservasi,
            'statusonline' => $statusonline,
            'status' => $status,
        );

        return view('report.pendaftaran.buktipendaftaran',
            compact('dataReport', 'pageWidth','profile'));
//        return view('','$result');
    }

    public function cetakSEP(Request $request)
    {
        $kdProfile = (int)$request['kdprofile'];
        $Noregistrasi = $request['noregistrasi'];
        $tglAyeuna = date('Y-m-d H:i:s');

        $profile = collect(DB::select
        ("
                select * from profile_m where id = $kdProfile limit 1
            "))->first();

        $registrasi = collect(DB::select("
             SELECT pa.nosep,to_char(pa.tanggalsep, 'DD-MM-YYYY HH:mm') AS tanggalsep,pa.nokepesertaan,pi.nocm,pd.noregistrasi,
                    pa.norujukan,ap.namapeserta,to_char(pi.tgllahir, 'DD-MM-YYYY') AS tgllahir,jk.jeniskelamin, 
                    rp.namaruangan,rp.kodeexternal as namapoli,pa.ppkrujukan,  
                    (CASE WHEN rp.objectdepartemenfk=16 then 'Rawat Inap' else 'Rawat Jalan' END) as jenisrawat, 
                    dg.kddiagnosa, (case when dg.namadiagnosa is null then '-' else dg.namadiagnosa end) as namadiagnosa ,  
                    ap.jenispeserta,ap.kdprovider,ap.nmprovider,kls.namakelas,pa.catatan
             FROM pemakaianasuransi_t pa  
             LEFT JOIN asuransipasien_m ap on pa.objectasuransipasienfk= ap.id  
             LEFT JOIN pasiendaftar_t pd on pd.norec=pa.noregistrasifk  
             LEFT JOIN pasien_m pi on pi.id=pd.nocmfk  
             LEFT JOIN jeniskelamin_m jk on jk.id=pi.objectjeniskelaminfk  
             LEFT JOIN ruangan_m rp on rp.id=pd.objectruanganlastfk  
             LEFT JOIN diagnosa_m dg on pa.diagnosisfk=dg.id 
             LEFT JOIN kelas_m kls on kls.id=ap.objectkelasdijaminfk  
             where pd.noregistrasi ='$Noregistrasi' 
        "))->first();

        $pageWidth = 719;
        $dataReport = array(
            'namaprofile' => $profile->namalengkap,
            'alamat' => $profile->alamatlengkap,
            'nosep' => $registrasi->nosep,
            'tanggalsep' => $registrasi->tanggalsep,
            'nokepesertaan' => $registrasi->nokepesertaan,
            'norm' => $registrasi->nocm,
            'noregistrasi' => $registrasi->noregistrasi,
            'jenispeserta' => $registrasi->jenispeserta,
            'namapeserta' => $registrasi->namapeserta,
            'cob' => "",
            'tgllahir' => $registrasi->tgllahir,
            'jeniskelamin' => $registrasi->jeniskelamin,
            'norujukan' => $registrasi->norujukan,
            'namaruangan' => $registrasi->namaruangan,
            'namapoli' => $registrasi->namapoli,
            'ppkrujukan' => $registrasi->ppkrujukan,
            'jenisrawat' => $registrasi->jenisrawat,
            'kddiagnosa' => $registrasi->kddiagnosa,
            'namadiagnosa' => $registrasi->namadiagnosa,
            'kdprovider' => $registrasi->kdprovider,
            'nmprovider' => $registrasi->nmprovider,
            'namakelas' => $registrasi->namakelas,
            'catatan' => $registrasi->catatan,
            'tanggal' => $tglAyeuna,
        );
        return view('report.pendaftaran.sep',
            compact('dataReport', 'pageWidth','profile'));
//        return view('','$result');
    }

    public function cetakCPPT(Request $request)
    {
        $kdProfile = (int)$request['kdprofile'];
        $norec_apd = $request['norec_apd'];
        $norec_emr = $request['norec_emr'];
        $nocm = $request['nocm'];
        $pageWidth = 793;
        $profile = collect(DB::select
        ("
                select * from profile_m where id = $kdProfile limit 1
            "))->first();

        $pasien = collect(DB::select("
            select ps.nocm, ps.namapasien, to_char(ps.tgllahir,'dd-MM-yyyy') as tgllahir,
			       CASE WHEN ps.objectjeniskelaminfk=1 then 'L' else 'P' END as jk,
                   to_char(pd.tglregistrasi,'dd-MM-yyyy hh24:mi:ss') as tglregistrasi,rm.namaruangan,
                   al.alamatlengkap,al.kecamatan,al.kotakabupaten
            from antrianpasiendiperiksa_t apd
            inner join pasiendaftar_t pd on pd.norec = apd.noregistrasifk
            inner join pasien_m ps on ps.id = pd.nocmfk
            inner join alamat_m as al on al.nocmfk=ps.id
            inner join ruangan_m as rm on rm.id = apd.objectruanganfk
            where apd.norec = '$norec_apd'
            and ps.statusenabled = true and ps.nocm = '$nocm'
        "))->first();

        $data = collect(DB::select("
            SELECT emrp.nocm, to_char(emrp.tglemr,'dd-MM-yyyy hh24:mi:ss') as tglemr, jp.jenispegawai,
                   emrdp.emrpasienfk ,emrdp.value ,emrdp.emrdfk,emrd.caption,emrd.type, emrd.nourut,
                   emrd.reportdisplay,  emrd.kodeexternal AS kodeex,pg.namalengkap, emrd.satuan,
                   emr.caption as namaform 
            From emrpasiend_t As emrdp
            INNER JOIN emrpasien_t AS emrp ON emrp.noemr = emrdp.emrpasienfk
            INNER JOIN emrd_t AS emrd ON emrd.id = emrdp.emrdfk
            INNER JOIN emr_t AS emr ON emr.id = emrdp.emrfk
            INNER JOIN pegawai_m AS pg ON pg.id = emrp.pegawaifk
            INNER JOIN jenispegawai_m jp ON jp.id = pg.objectjenispegawaifk
            Where emrdp.statusenabled = true
            AND emrp.nocm = '$nocm' and emrp.norec = '$norec_emr'
            AND emr.id in (94) Order by emrdp.emrdfk ASC
        "));

        $diti=array();
        $fieldsatu = "";
        $fielddua = "";
        foreach ($data as $item){
            $dokter=$item->namalengkap;
            $tglemr=$item->tglemr;
            $txt = "";
            $txt2 = "";
            if ($item->value != null || $item->value != ''){
                if ($item->emrdfk == 4248){
                    $txt =  $item->value;
                    $fieldsatu = $fieldsatu . " " .$txt;
//                    break;
                }
                if ($item->emrdfk == 4249){
                    $txt =  $item->value;
                    $fieldsatu = $fieldsatu . " " .$txt;
//                    break;
                }
                if ($item->emrdfk == 4250){
                    $txt =  $item->value;
                    $fieldsatu = $fieldsatu . " " .$txt;
//                    break;
                }
                if ($item->emrdfk == 4251){
                    $txt =  $item->value;
                    $fieldsatu = $fieldsatu . " " .$txt;
//                    break;
                }
                if ($item->emrdfk == 5236){
                    $txt2 =  $item->value;
                    $fielddua = $fielddua . " " . $txt2;
//                    break;
                }
            }
        }


        $dataReport = array(
            'namaprofile' => $profile->namalengkap,
            'alamat' => $profile->alamatlengkap,
            'judul' => 'CATATAN KLINIK',
            'nocm' => $pasien->nocm,
            'namapasien' => $pasien->namapasien,
            'tgllahir' => $pasien->tgllahir,
            'jk' => $pasien->jk,
            'tglregistrasi' => $pasien->tglregistrasi,
            'namaruangan' => $pasien->namaruangan,
            'alamatlengkap' => $pasien->alamatlengkap,
            'tglemr' => $data[0]->tglemr,
            'dokter' => $data[0]->namalengkap,
             'fieldsatu' => $fieldsatu,
             'fielddua' => $fielddua,
        );
        return view('report.EMR.cppt',
            compact('dataReport', 'pageWidth','diti','profile'));
    }
    public function cetakResume(Request $r)
    {
        $res['profile'] = Profile::where('id',$r['kdprofile'])->first();
        $data = \DB::table('resumemedis_t as rm')
            ->select('pd.tglregistrasi','pd.tglpulang','rm.norec', 'rm.tglresume', 'ru.namaruangan', 'pg.namalengkap as namadokter',
                'rm.ringkasanriwayatpenyakit', 'rm.pemeriksaanfisik', 'rm.pemeriksaanpenunjang',
                'rm.hasilkonsultasi', 'rm.terapi', 'rm.diagnosisawal', 'rm.diagnosissekunder', 'rm.tindakanprosedur',
                // 'rm.diagnosismasuk', 'rm.diagnosistambahan', 'rm.alasandirawat',
                'rm.kddiagnosisawal', 'rm.diagnosismasuk', 'rm.kddiagnosismasuk', 'rm.diagnosistambahan', 'rm.kddiagnosistambahan', 'rm.kddiagnosistambahan2', 'rm.kddiagnosistambahan3', 'rm.kddiagnosistambahan4', 'rm.alasandirawat',
                'dg1.kddiagnosa as kddiagnosa1', 'dg1.namadiagnosa as namadiagnosa1',
                'dg2.kddiagnosa as kddiagnosa2', 'dg2.namadiagnosa as namadiagnosa2',
                'dg3.kddiagnosa as kddiagnosa3', 'dg3.namadiagnosa as namadiagnosa3',
                'dg4.kddiagnosa as kddiagnosa4', 'dg4.namadiagnosa as namadiagnosa4',
                'dg5.kddiagnosa as kddiagnosa5', 'dg5.namadiagnosa as namadiagnosa5',
                'dg6.kddiagnosa as kddiagnosa6', 'dg6.namadiagnosa as namadiagnosa6',
                'rm.tglkontrolpoli', 'rm.rumahsakittujuan',
                'rm.alergi', 'rm.diet', 'rm.instruksianjuran', 'rm.hasillab',
                'rm.kondisiwaktukeluar', 'rm.pengobatandilanjutkan', 'rm.koderesume',
                'rm.pegawaifk',
                'pd.noregistrasi', 'pd.tglregistrasi', 'ps.nocm', 'rm.noregistrasifk',
                'ps.namapasien','kp.kelompokpasien','ru.namaruangan','jk.jeniskelamin','ps.tgllahir')
            ->Join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'rm.noregistrasifk')
            ->Join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->Join('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->Join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->Join('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('diagnosa_m as dg1', 'dg1.id', '=', 'rm.kddiagnosismasuk')
            ->leftJoin('diagnosa_m as dg2', 'dg2.id', '=', 'rm.kddiagnosisawal')
            ->leftJoin('diagnosa_m as dg3', 'dg3.id', '=', 'rm.kddiagnosistambahan')
            ->leftJoin('diagnosa_m as dg4', 'dg4.id', '=', 'rm.kddiagnosistambahan2')
            ->leftJoin('diagnosa_m as dg5', 'dg5.id', '=', 'rm.kddiagnosistambahan3')
            ->leftJoin('diagnosa_m as dg6', 'dg6.id', '=', 'rm.kddiagnosistambahan4')
            ->where('rm.kdprofile', $r['kdprofile'])
            ->where('rm.statusenabled', true)
            ->where('rm.norec',  $r['norec'])
            ->where('rm.keteranganlainnya', 'RawatInap');
//            ->whereIn('ru.objectdepartemenfk',$iddept);

        $data = $data->first();
        $item = $data;
//        $result = [];
//        foreach ($data as $item) {
            $details = DB::select(DB::raw("
                   select * from resumemedisdetail_t
                   where resumefk=:norec"),
                array(
                    'norec' => $item->norec,
                )
            );
            $diagnosistambahanarray = array($item->kddiagnosa3, $item->kddiagnosa4, $item->kddiagnosa5, $item->kddiagnosa6);
            $diagnosistambahan = [];
            $no = 0;
            foreach ($diagnosistambahanarray as $tambahan){
                if($tambahan != "") {
                    $diagnosistambahan[$no] = $tambahan;
                    $no++;
                }
            }
            $result= array(
                'norec' => $item->norec,
                'tglregistrasi' => $item->tglregistrasi,
                'tglpulang' => $item->tglpulang,
                'kelompokpasien' => $item->kelompokpasien,
                'tglresume' => $item->tglresume,
                'namaruangan' => $item->namaruangan,
                'namadokter' => $item->namadokter,
                'ringkasanriwayatpenyakit' => $item->ringkasanriwayatpenyakit,
                'pemeriksaanfisik' => $item->pemeriksaanfisik,
                'pemeriksaanpenunjang' => $item->pemeriksaanpenunjang,
                'hasilkonsultasi' => $item->hasilkonsultasi,
                'terapi' => $item->terapi,
                'diagnosismasuk' => $item->diagnosismasuk,
                'kddiagnosismasuk' => array($item->kddiagnosismasuk  != null ? $item->kddiagnosismasuk : '-', $item->kddiagnosa1, $item->namadiagnosa1!= null ? $item->namadiagnosa1 : '-'),
                'diagnosisawal' => $item->diagnosisawal,
                'kddiagnosisawal' => array($item->kddiagnosisawal, $item->kddiagnosa2,  $item->namadiagnosa2),
                'diagnosistambahan' => $item->diagnosistambahan,
                'kddiagnosistambahan' => array($item->kddiagnosistambahan, $item->kddiagnosa3,  $item->namadiagnosa3),
                'kddiagnosistambahan2' => array($item->kddiagnosistambahan2, $item->kddiagnosa4,  $item->namadiagnosa4),
                'kddiagnosistambahan3' => array($item->kddiagnosistambahan3, $item->kddiagnosa5,  $item->namadiagnosa5),
                'kddiagnosistambahan4' => array($item->kddiagnosistambahan4, $item->kddiagnosa6,  $item->namadiagnosa6),
                'kddiagnosistambahanall' => implode(", ", $diagnosistambahan),
                'diagnosissekunder' => $item->diagnosissekunder,
                'tglkontrolpoli' => $item->tglkontrolpoli,
                'rumahsakittujuan' => $item->rumahsakittujuan,
                'tindakanprosedur' => $item->tindakanprosedur,
                'alasandirawat' => $item->alasandirawat,
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
                'namapasien' => $item->namapasien,
                'noregistrasifk' => $item->noregistrasifk,
                'jeniskelamin'=> $item->jeniskelamin,
                'tgllahir'=> $item->tgllahir,
                'details' => $details,
            );
//        }
//        dd($result);
        $res['terapi'][] = array('tera' => 'asas');
        $res['d'] =$result;
        $username ='asa';
        return view('report.resume-medis',compact('res','username'));

//        $jasper = new JasperPHP();
//
//        // Compile a JRXML to Jasper
//        $jasper->compile( public_path('jasper/report/rincianbilling.jrxml'))->execute();
//        $param =[];
//        foreach (array_values($request['paramKey']) as $k => $t){
//                $param[$t] = array_values($request['paramValue'])[$k] ;
//        }
//        // Process a Jasper file to PDF and RTF (you can use directly the .jrxml)
//        $jasper->process(
//            public_path('jasper/report/rincianbilling.jasper'),
//            public_path('jasper/output/2'),
//            array("pdf", "rtf"),
//            $param
//        )->execute();
//
//        // List the parameters from a Jasper file.
//        $array = $jasper->list_parameters(
//            public_path('jasper/report/rincianbilling.jasper')
////            $param,
////            array('noregistrasi','121212121')
//        )->execute();
//
//        return view('report.resume-medis');
//        $kdProfile = (int)$request['kdprofile'];
////        $input2 = public_path('jasper/report/rincianbilling.jrxml');
////        $jasper = new PHPJasper;
////        $jasper->compile($input2)->execute();
//
//        $input = public_path('jasper/report/rincianbilling.jasper');
//        $output =  public_path('jasper/output');
//        $jdbc_dir = public_path('jasper/jdbc');
//        $param =[];
//        foreach (array_values($request['paramKey']) as $k => $t){
//                $param[$t] = array_values($request['paramValue'])[$k] ;
//        }
////        dd($param);
//        $options = [
//            'format' => ['pdf'],
//            'locale' => 'en',
//            'params' => $param,
//            'db_connection' => [
//                'driver' => 'postgres', //mysql, ....
//                'username' => 'postgres',
//                'password' => 'Tr4nsm3dic',
//                'host' => 'transmedic.co.id',
//                'database' => 'transmedic_standar',
//                'port' => '5432'
////                'driver' => 'postgres',
////                'host' => 'transmedic.co.id',
////                'port' => '5432',
////                'database' => 'transmedic_standar',
////                'username' => 'postgres',
////                'password' => 'Tr4nsm3dic',
////                'jdbc_driver' => 'org.postgresql.Driver',
////                'jdbc_url' => 'jdbc:postgresql://transmedic.co.id:5432/transmedic_standar',
////                'jdbc_dir' => $jdbc_dir
//            ]
//        ];
//
//        $jasper = new PHPJasper();
//
//        $jasper->process(
//            $input,
//            $output,
//            $options
//        )->execute();


//        return view('report.resume-medis');
//        return view('','$result');
    }
    public function cetakDokter(Request $r) {
        $kdProfile = (int)$r['kdprofile'];
        $raw = collect(DB::select("
            SELECT pg.nip, pg.nosip,pg.namalengkap, jk.jeniskelamin, pg.tgllahir, ps.namapasien, ps.nocm, to_char( rm.tglresume, 'dd-MM-yyyy') AS tglresume
            FROM pasiendaftar_t AS pd
            LEFT  JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk=pd.norec
            LEFT JOIN resumemedis_t AS rm ON rm.noregistrasifk=apd.norec
            LEFT JOIN pegawai_m AS pg ON pg.id=pd.objectpegawaifk 
            LEFT  JOIN jeniskelamin_m AS jk ON jk.id=pg.objectjeniskelaminfk 
            LEFT  JOIN pasien_m AS ps ON ps.id=pd.nocmfk

            WHERE
                pd.noregistrasi = '$r[reg]'
        "))->first();
        if(!empty($raw)){
            $raw->umur = $this->getAge($raw->tgllahir ,date('Y-m-d'));
        }else{
            echo 'Data Tidak ada ';
            return;
        }

        $pageWidth = 950;
        $now =  $this->getDateTime();

        return view('report.pdf.infodokter',
            compact('raw', 'pageWidth','r','now'));

    }

    public function cetakPasien(Request $r) {
        $kdProfile = (int)$r['kdprofile'];
        $raw = collect(DB::select("
       select ps.nocm, ps.namapasien, ps.tgllahir, kp.kelompokpasien, ru.namaruangan, jk.jeniskelamin, pd.noregistrasi, pd.namalengkapambilpasien, 
       to_char( rm.tglresume, 'dd-MM-yyyy') as tglresume, CASE WHEN alm.alamatlengkap IS NULL 
       THEN '-' ELSE (alm.alamatlengkap || ' ' || ds.namadesakelurahan || ' '|| kc.namakecamatan || ' '|| kk.namakotakabupaten 
      || ' ' || pro.namapropinsi) END AS alamatlengkap, pd.noregistrasi, pemakaianasuransi_t.nokepesertaan, 
       pemakaianasuransi_t.nosep, ps.noidentitas
        FROM  

       pasiendaftar_t AS pd 
       INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk=pd.norec 
       left JOIN resumemedis_t AS rm ON rm.noregistrasifk=apd.norec 
       left JOIN  pasien_m AS ps ON ps.id = pd.nocmfk 
      left JOIN  kelompokpasien_m AS kp ON kp.id = pd.objectkelompokpasienlastfk 
       left JOIN  ruangan_m AS ru ON ru.id = pd.objectruanganlastfk 
      left JOIN   pemakaianasuransi_t ON pd.norec = pemakaianasuransi_t.noregistrasifk 
      left JOIN  kelompokpasien_m AS kps ON kps.id = pd.objectkelompokpasienlastfk
       left JOIN  alamat_m AS alm ON alm.nocmfk = ps.id 
      left JOIN   desakelurahan_m AS ds ON ds.id = alm.objectdesakelurahanfk 
      left JOIN   kotakabupaten_m AS kk ON kk.id = alm.objectkotakabupatenfk
      left JOIN   kecamatan_m AS kc ON kc.id = alm.objectkecamatanfk
      left JOIN  propinsi_m AS pro ON pro.id = alm.objectpropinsifk
       left  JOIN   jeniskelamin_m AS jk  on jk.id=ps.objectjeniskelaminfk
           WHERE
               pd.noregistrasi = '$r[reg]'
       "))->first();
        if(!empty($raw)){
            $raw->umur = $this->getAge($raw->tgllahir ,date('Y-m-d'));
        }else{
            echo 'Data Tidak ada ';
            return;
        }




        $pageWidth = 950;
        $now =  $this->getDateTime();

        return view('report.pdf.infopasien',
            compact('raw', 'pageWidth','r','now'));

    }

    public static function getProfile(){
        $res['namaprofile'] = 'Rumah Sakit Jiwa Grhasia';
        $res['alamat'] ='Jl. Kaliurang KM.17, Duwetsari, Pakembinangun, Kec. Pakem, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55582';
        return $res;
    }

    public function cetakCPPTRanap(Request $request){
        $norec = $request['emr'];
        $kdProfile = (int) $request['kdprofile'];
        $data = DB::select(DB::raw("
                   SELECT
                        epd.emrdfk,
                        ep.noemr,
                        ed.TYPE,
                        pa.namapasien,
                        pa.tgllahir,
                        pa.nohp,
                        pa.nocm,
                        ep.jeniskelamin,
                        ep.umur,
                        al.alamatlengkap,
                        ep.noregistrasifk as noregistrasi ,
                        epd.value,ep.namaruangan,pg.namalengkap as namadokter
                        --case when ed.TYPE = 'datetime' then TO_CHAR(TO_TIMESTAMP(epd.value, 'YYYY-MM-DD HH24:MI:SS'),'YYYY-MM-DD HH24:MI:SS') else epd.value end as value
                    FROM
                        emrpasien_t AS ep
                        INNER JOIN emrpasiend_t AS epd ON ep.noemr = epd.emrpasienfk
                        INNER JOIN emrd_t AS ed ON epd.emrdfk = ed.ID
                         INNER JOIN antrianpasiendiperiksa_t AS pd ON pd.norec = ep.norec_apd
                        left JOIN pegawai_m AS pg ON pg.id = pd.objectpegawaifk
                        left JOIN pasien_m as pa on ep.nocm =  pa.nocm
                        left JOIN alamat_m as al on pa.id = al.nocmfk
                    WHERE
                        ep.norec = '$norec'
                         AND ep.kdprofile = '$kdProfile' 
                        AND epd.statusenabled = TRUE 
                        and epd.emrfk = $request[emrfk]
                        ORDER BY
                        ed.nourut
                     "
        ));
        foreach ($data as $z){
            if ($z->type=="datetime"){
                $z->value=date('Y-m-d H:i:s',strtotime($z->value));
            }
//            $z->value = nl2br( $z->value);
        }
        $pageWidth = 500;
        $res['profile'] = Profile::where('id',$request['kdprofile'])->first();
        $res['d'] = $data;
//        dd( $res['d'] );

        return view('report.cppt-ranap',compact('res','pageWidth'));
    }

    public function cetakCatatanKlinik(Request $request){
        $norec = $request['emr'];
        $kdProfile = (int) $request['kdprofile'];
        $data = DB::select(DB::raw("
                   SELECT
                        epd.emrdfk,
                        ep.noemr,
                        ed.TYPE,
                        pa.namapasien,
                        pa.tgllahir,
                        pa.nohp,
                        pa.nocm,
                        ep.jeniskelamin,
                        ep.umur,
                        al.alamatlengkap,
                        ep.noregistrasifk as noregistrasi ,
                        epd.value,ep.namaruangan,pg.namalengkap as namadokter,
                        to_char(ep.tglemr,'dd-MM-yyyy hh24:mi:ss') as tglemr
                        --case when ed.TYPE = 'datetime' then TO_CHAR(TO_TIMESTAMP(epd.value, 'YYYY-MM-DD HH24:MI:SS'),'YYYY-MM-DD HH24:MI:SS') else epd.value end as value
                    FROM
                        emrpasien_t AS ep
                        INNER JOIN emrpasiend_t AS epd ON ep.noemr = epd.emrpasienfk
                        INNER JOIN emrd_t AS ed ON epd.emrdfk = ed.ID
                         INNER JOIN antrianpasiendiperiksa_t AS pd ON pd.norec = ep.norec_apd
                        left JOIN pegawai_m AS pg ON pg.id = pd.objectpegawaifk
                        left JOIN pasien_m as pa on ep.nocm =  pa.nocm
                        left JOIN alamat_m as al on pa.id = al.nocmfk
                    WHERE
                        ep.norec = '$norec'
                         AND ep.kdprofile = '$kdProfile' 
                        AND epd.statusenabled = TRUE 
                        and epd.emrfk = $request[emrfk]
                        ORDER BY
                        ed.nourut
                     "
        ));

//        dd($data);

        foreach ($data as $z){
            if ($z->type=="datetime"){
                $z->value=date('Y-m-d H:i:s',strtotime($z->value));
            }
//            $z->value = nl2br( $z->value);
        }
        $pageWidth = 500;
        $res['profile'] = Profile::where('id',$request['kdprofile'])->first();
        $res['d'] = $data;
//        dd( $res['d'] );

        return view('report.catatanklinik',compact('res','pageWidth'));
    }
    public function cetakResume2(Request $r)
    {
        $res['profile'] = Profile::where('id',$r['kdprofile'])->first();
        $data = \DB::table('resumemedis_t as rm')
            ->select('pd.tglregistrasi','pd.tglpulang','rm.norec', 'rm.tglresume', 'ru.namaruangan', 'pg.namalengkap as namadokter',
                'rm.ringkasanriwayatpenyakit', 'rm.pemeriksaanfisik', 'rm.pemeriksaanpenunjang',
                'rm.hasilkonsultasi', 'rm.terapi', 'rm.diagnosisawal', 'rm.diagnosissekunder', 'rm.tindakanprosedur',
                // 'rm.diagnosismasuk', 'rm.diagnosistambahan', 'rm.alasandirawat',
                'rm.kddiagnosisawal', 'rm.diagnosismasuk', 'rm.kddiagnosismasuk', 'rm.diagnosistambahan', 'rm.kddiagnosistambahan', 'rm.kddiagnosistambahan2', 'rm.kddiagnosistambahan3', 'rm.kddiagnosistambahan4', 'rm.alasandirawat',
                'dg1.kddiagnosa as kddiagnosa1', 'dg1.namadiagnosa as namadiagnosa1',
                'dg2.kddiagnosa as kddiagnosa2', 'dg2.namadiagnosa as namadiagnosa2',
                'dg3.kddiagnosa as kddiagnosa3', 'dg3.namadiagnosa as namadiagnosa3',
                'dg4.kddiagnosa as kddiagnosa4', 'dg4.namadiagnosa as namadiagnosa4',
                'dg5.kddiagnosa as kddiagnosa5', 'dg5.namadiagnosa as namadiagnosa5',
                'dg6.kddiagnosa as kddiagnosa6', 'dg6.namadiagnosa as namadiagnosa6',
                'rm.tglkontrolpoli', 'rm.rumahsakittujuan',
                'rm.alergi', 'rm.diet', 'rm.instruksianjuran', 'rm.hasillab',
                'rm.kondisiwaktukeluar', 'rm.pengobatandilanjutkan', 'rm.koderesume',
                'rm.pegawaifk',
                'pd.noregistrasi', 'pd.tglregistrasi', 'ps.nocm', 'rm.noregistrasifk',
                'ps.namapasien','kp.kelompokpasien','ru.namaruangan','jk.jeniskelamin','ps.tgllahir')
            ->Join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'rm.noregistrasifk')
            ->Join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->Join('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->Join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->Join('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('diagnosa_m as dg1', 'dg1.id', '=', 'rm.kddiagnosismasuk')
            ->leftJoin('diagnosa_m as dg2', 'dg2.id', '=', 'rm.kddiagnosisawal')
            ->leftJoin('diagnosa_m as dg3', 'dg3.id', '=', 'rm.kddiagnosistambahan')
            ->leftJoin('diagnosa_m as dg4', 'dg4.id', '=', 'rm.kddiagnosistambahan2')
            ->leftJoin('diagnosa_m as dg5', 'dg5.id', '=', 'rm.kddiagnosistambahan3')
            ->leftJoin('diagnosa_m as dg6', 'dg6.id', '=', 'rm.kddiagnosistambahan4')
            ->where('rm.kdprofile', $r['kdprofile'])
            ->where('rm.statusenabled', true)
            ->where('rm.norec',  $r['norec'])
            ->where('rm.keteranganlainnya', 'RawatInap');
//            ->whereIn('ru.objectdepartemenfk',$iddept);

        $data = $data->first();
        $item = $data;
//        $result = [];
//        foreach ($data as $item) {
            $details = DB::select(DB::raw("
                   select * from resumemedisdetail_t
                   where resumefk=:norec"),
                array(
                    'norec' => $item->norec,
                )
            );
            $diagnosistambahanarray = array($item->kddiagnosa3, $item->kddiagnosa4, $item->kddiagnosa5, $item->kddiagnosa6);
            $diagnosistambahan = [];
            $no = 0;
            foreach ($diagnosistambahanarray as $tambahan){
                if($tambahan != "") {
                    $diagnosistambahan[$no] = $tambahan;
                    $no++;
                }
            }
            $result= array(
                'norec' => $item->norec,
                'tglregistrasi' => $item->tglregistrasi,
                'tglpulang' => $item->tglpulang,
                'kelompokpasien' => $item->kelompokpasien,
                'tglresume' => $item->tglresume,
                'namaruangan' => $item->namaruangan,
                'namadokter' => $item->namadokter,
                'ringkasanriwayatpenyakit' => $item->ringkasanriwayatpenyakit,
                'pemeriksaanfisik' => $item->pemeriksaanfisik,
                'pemeriksaanpenunjang' => $item->pemeriksaanpenunjang,
                'hasilkonsultasi' => $item->hasilkonsultasi,
                'terapi' => $item->terapi,
                'diagnosismasuk' => $item->diagnosismasuk,
                'kddiagnosismasuk' => array($item->kddiagnosismasuk  != null ? $item->kddiagnosismasuk : '-', $item->kddiagnosa1, $item->namadiagnosa1!= null ? $item->namadiagnosa1 : '-'),
                'diagnosisawal' => $item->diagnosisawal,
                'kddiagnosisawal' => array($item->kddiagnosisawal, $item->kddiagnosa2,  $item->namadiagnosa2),
                'diagnosistambahan' => $item->diagnosistambahan,
                'kddiagnosistambahan' => array($item->kddiagnosistambahan, $item->kddiagnosa3,  $item->namadiagnosa3),
                'kddiagnosistambahan2' => array($item->kddiagnosistambahan2, $item->kddiagnosa4,  $item->namadiagnosa4),
                'kddiagnosistambahan3' => array($item->kddiagnosistambahan3, $item->kddiagnosa5,  $item->namadiagnosa5),
                'kddiagnosistambahan4' => array($item->kddiagnosistambahan4, $item->kddiagnosa6,  $item->namadiagnosa6),
                'kddiagnosistambahanall' => implode(", ", $diagnosistambahan),
                'diagnosissekunder' => $item->diagnosissekunder,
                'tglkontrolpoli' => $item->tglkontrolpoli,
                'rumahsakittujuan' => $item->rumahsakittujuan,
                'tindakanprosedur' => $item->tindakanprosedur,
                'alasandirawat' => $item->alasandirawat,
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
                'namapasien' => $item->namapasien,
                'noregistrasifk' => $item->noregistrasifk,
                'jeniskelamin'=> $item->jeniskelamin,
                'tgllahir'=> $item->tgllahir,
                'details' => $details,
            );
//        }
//        dd($result);
        $res['terapi'][] = array('tera' => 'asas');
        $res['d'] =$result;
        $username ='asa';
        return response()
            ->view('report.resume-medis2',[
                'res' => $res,
                'data' => [],
                'periode' => '',
                'tglcetak' => '',
                'footerreport' => '',
                'ttdnama'=> '',
                'ttdnip' => '',
                'pageorientation' => 'portrait',
                'fontsize'=> '11px'
            ])
            ->header('Content-Type','application/pdf');
        // return view('report.resume-medis',compact('res','username'));
        }

        public function getPegawaiByQR(Request $r){
            $kdProfile = $r['kdprofile'];
            $data = DB::table('pegawai_m as pg')
                ->leftjoin('jabatan_m as jb','jb.id','=','pg.objectjabatanfungsionalfk')
                ->select('pg.id','pg.namalengkap','pg.nosip','pg.noidentitas','jb.namajabatan')
                ->where('pg.statusenabled',true)
                ->where('pg.id',$r['id'])
                ->where('pg.kdprofile',$r['kdprofile'])
                ->first();
            return view('report.qr-pegawai',compact('data'));
        }
        public function cekCaptcha(Request $r)
    {
         $captchaResponse = $r->input('captchaResponse');
         $secret = '6LeyqNAZAAAAAKO8uCFObSxNO1YWo2vzpP44ydfS';
         $response = json_decode(file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=".
            $secret."&response=".$captchaResponse.
            "&remoteip=".$_SERVER['REMOTE_ADDR']), true);
         return $response;
    
    }
    public function nametagDiklat(Request $request)
    {
        $kdProfile = 30;       
        $norec = $request['norec'];
        $pageWidth = 950;
        $data = \DB::table('sdm_pesertadidik_t as sdmp')->where('sdmp.noregistrasifk',$norec)
        ->where('sdmp.kdprofile',$kdProfile)
        ->join('sdm_penelitianeksternal_t as sdm','sdm.norec','=','sdmp.noregistrasifk')
        ->join('detailjenisproduk_m as djp','djp.id','=','sdm.objectdetailjenisprodukfk')
        // ->join('jeniskelamin_m as jk','jk.id','=','sdm.jeniskelaminfk')
        // ->join('sdm')
        ->select('sdmp.email','sdmp.norec','sdmp.nama','sdmp.image','djp.detailjenisproduk','sdm.institusipendidikan',DB::raw('sdm.tanggalmulai::date,sdm.tanggalselesai::date'))
        ->get();
        // $pdf = PDF::loadview('report.diklat-nametag', compact('data','pageWidth'));
        //        return $pdf->stream();

        return view('report.diklat-nametag',compact('data','pageWidth'));
        // return $this->respond($data);
    }
    public function cetakSertifikat(Request $request)
    {
        $kdProfile = 30;       
        $norec = $request['norec'];
        $pageWidth = 950;
        $data = \DB::table('sdm_pesertadidik_t as sdmp')->where('sdmp.norec',$norec)
        ->where('sdmp.kdprofile',$request['kdprofile'])
        ->join('sdm_penelitianeksternal_t as sdm','sdm.norec','=','sdmp.noregistrasifk')
        ->join('detailjenisproduk_m as djp','djp.id','=','sdm.objectdetailjenisprodukfk')
        ->leftjoin('pegawai_m as pg','pg.id','=','sdm.pengesah')
        ->leftjoin('sdm_golongan_m as gp', 'gp.id', '=', 'pg.objectgolonganfk')
        ->leftjoin('jabatan_m as ja', 'ja.id', '=', 'pg.objectjabatanfungsionalfk')
        // ->join('jeniskelamin_m as jk','jk.id','=','sdm.jeniskelaminfk')
        // ->join('sdm')
        ->select('sdm.institusipendidikan','sdmp.nim','sdmp.nama','gp.namaexternal','gp.name','sdmp.norec','sdmp.nama','ja.namajabatan','sdmp.image','djp.detailjenisproduk','sdm.institusipendidikan','pg.namalengkap','pg.nippns','sdm.nosertifikat',DB::raw('sdm.tanggalmulai::date,sdm.tanggalselesai::date'))
        ->get();
        // $pdf = PDF::loadview('report.diklat-nametag', compact('data','pageWidth'));
        //        return $pdf->stream();

        return view('report.cetak-sertifikat',compact('data','pageWidth'));
        // return $this->respond($data);
    }
    
    public function CetakSKDokter(Request $request)
    {   
        // $norec = $request['emr'];
        $noemr = $request['noemr'];
        $kdProfile = (int) $request['kdprofile'];
        $emrfk = $request['emfk'];
        $data = \DB::select(DB::raw(
            "SELECT string_agg(x.tgl, '' )tgl, string_agg(x.nocm, ' ' )nocm, string_agg(x.nomor, ' ' )nomor, 
            string_agg(x.nama, ' ')nama, string_agg(x.tgllahir, ' ')tgllahir, string_agg(x.pekerjaan, ' ' )pekerjaan, 
            string_agg(x.alamat, ' ' )alamat, string_agg(x.jeniskelamin, ' ' )jeniskelamin, string_agg(x.tb, ' ')tb,string_agg(x.td, ' ')td,
            string_agg(x.bb, ' ')bb, string_agg(x.nadi, ' ')nadi, string_agg(x.keperluan, ' ')keperluan, string_agg(x.dokter, ' ')dokter, 
            string_agg(x.kondisi, ' ')kondisi 
            FROM (SELECT
            CASE WHEN ed.ID = 3003991 THEN epd.VALUE END AS tgl,
            CASE WHEN ed.ID = 3003990 THEN epd.VALUE END AS nocm,
            CASE WHEN ed.ID = 3003992 THEN epd.VALUE END AS nomor,
            CASE WHEN ed.ID = 3003982 THEN epd.VALUE END AS nama,
            CASE WHEN ed.ID = 3003983 THEN epd.VALUE END AS tgllahir,
            CASE WHEN ed.ID = 3003984 THEN epd.VALUE END AS jeniskelamin,
            CASE WHEN ed.ID = 3003985 THEN epd.VALUE END AS pekerjaan,
            CASE WHEN ed.ID = 3003986 THEN epd.VALUE END AS alamat,
            CASE WHEN ed.ID = 3003993 THEN epd.VALUE END AS tb,
            CASE WHEN ed.ID = 3003994 THEN epd.VALUE END AS td,
            CASE WHEN ed.ID = 3003995 THEN epd.VALUE END AS bb,
            CASE WHEN ed.ID = 3003996 THEN epd.VALUE END AS nadi,
            CASE WHEN ed.ID = 3003997 THEN epd.VALUE END AS keperluan,
            CASE WHEN ed.ID = 3003998 THEN epd.VALUE END AS dokter,
            CASE WHEN ed.ID = 3003999 THEN epd.VALUE END AS kondisi
            FROM emrpasien_t ep
                    INNER JOIN emrpasiend_t epd ON ep.noemr = epd.emrpasienfk
                    INNER JOIN emrd_t ed ON ed.ID = epd.emrdfk 
                WHERE ep.kdprofile = $kdProfile AND ep.statusenabled = TRUE 
                    AND ep.noemr ILIKE'$noemr' 
                    AND ed.statusenabled = TRUE 
		AND ep.emrfk = $emrfk 
		AND ed.emrfk = $emrfk
        ORDER BY
        ed.ID ASC)as x"
        ));
        foreach ($data as $z){
            if (isset($z->tgllahir) ||isset($z->tgl)){
                $z->tgllahir=$this->tanggal_indonesia(date('Y-m-d',strtotime($z->tgllahir)));
                $z->tgl=$this->tanggal_indonesia(date('Y-m-d',strtotime($z->tgl)));
            }
            
        }
        $pageWidth = 950;
        return view('report.EMR.suratketerangandokter',compact('data','pageWidth'));
    }
    function tanggal_indonesia($tanggal){
        $bulan = array (
        1 =>   'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember'
        );
        
        $pecahkan = explode('-', $tanggal);
        
        // variabel pecahkan 0 = tanggal
        // variabel pecahkan 1 = bulan
        // variabel pecahkan 2 = tahun
         
        return $pecahkan[2] . ' ' . $bulan[ (int)$pecahkan[1] ] . ' ' . $pecahkan[0];
    }

    public function CetakSKNapza(Request $request)
    {   
        // $norec = $request['emr'];
        $noemr = $request['noemr'];
        $kdProfile = (int) $request['kdprofile'];
        $emrfk = $request['emfk'];
        $data = \DB::select(DB::raw(
            "SELECT string_agg(x.namalengkap, ' ')a,string_agg(x.tgl, '' )tgl, string_agg(x.nocm, ' ' )nocm, string_agg(x.nomor, ' ' )nomor, 
                string_agg(x.nama, ' ')nama, string_agg(x.tgllahir, ' ')tgllahir, string_agg(x.pekerjaan, ' ' )pekerjaan, 
                string_agg(x.alamat, ' ' )alamat, string_agg(x.jeniskelamin, ' ' )jeniskelamin, string_agg(x.ada, ' ')ada,string_agg(x.tidakada, ' ')tidakada,
                string_agg(x.keperluan, ' ')keperluan, string_agg(x.dokter, ' ')dokter FROM (SELECT
                pg.namalengkap,
                CASE WHEN ed.ID = 3003971 THEN epd.VALUE END AS tgl,
                CASE WHEN ed.ID = 3003970 THEN epd.VALUE END AS nocm,
                CASE WHEN ed.ID = 3003972 THEN epd.VALUE END AS nomor,
                CASE WHEN ed.ID = 3003973 THEN epd.VALUE END AS ada,
                CASE WHEN ed.ID = 3003974 THEN epd.VALUE END AS tidakada,
                CASE WHEN ed.ID = 3003977 THEN epd.VALUE END AS nama,
                CASE WHEN ed.ID = 3003978 THEN epd.VALUE END AS tgllahir,
                CASE WHEN ed.ID = 3003979 THEN epd.VALUE END AS jeniskelamin,
                CASE WHEN ed.ID = 3003980 THEN epd.VALUE END AS pekerjaan,
                CASE WHEN ed.ID = 3003981 THEN epd.VALUE END AS alamat,
                CASE WHEN ed.ID = 3003975 THEN epd.VALUE END AS keperluan,
                CASE WHEN ed.ID = 3003976 THEN epd.VALUE END AS dokter
                FROM emrpasien_t ep
                        INNER JOIN emrpasiend_t epd ON ep.noemr = epd.emrpasienfk
                        INNER JOIN emrd_t ed ON ed.ID = epd.emrdfk 
                        INNER JOIN pegawai_m pg on pg.id = epd.pegawaifk
                    WHERE ep.kdprofile = $kdProfile AND ep.statusenabled = TRUE 
                        AND ep.noemr ILIKE'$noemr' 
                        AND ed.statusenabled = TRUE 
                        AND ep.emrfk = $emrfk 
                        AND ed.emrfk = $emrfk
                ORDER BY
	ed.ID ASC)as x"
        ));
        foreach ($data as $z){
            if (isset($z->tgllahir) ||isset($z->tgl)){
                $z->tgllahir=$this->tanggal_indonesia(date('Y-m-d',strtotime($z->tgllahir)));
                $z->tgl=$this->tanggal_indonesia(date('Y-m-d',strtotime($z->tgl)));
            }
            
        }
        $pageWidth = 950;
        return view('report.EMR.suratketerangannapza',compact('data','pageWidth'));
    }

    public function CetakSKJiwa(Request $request)
    {
        $noemr = $request['noemr'];
        $kdProfile = (int) $request['kdprofile'];
        $emrfk = $request['emfk'];
        $data = \DB::select(DB::raw(
            "SELECT string_agg(x.tgl, '' )tgl, string_agg(x.nocm, ' ' )nocm, string_agg(x.nomor, ' ' )nomor, 
                string_agg(x.nama, ' ')nama, string_agg(x.tgllahir, ' ')tgllahir, string_agg(x.pekerjaan, ' ' )pekerjaan, 
                string_agg(x.alamat, ' ' )alamat, string_agg(x.jeniskelamin, ' ' )jeniskelamin, string_agg(x.ada, ' ')ada,string_agg(x.tidakada, ' ')tidakada,
                string_agg(x.keperluan, ' ')keperluan, string_agg(x.dokter, ' ')dokter FROM (SELECT
                pg.namalengkap,
                CASE WHEN ed.ID = 3003951 THEN epd.VALUE END AS tgl,
                CASE WHEN ed.ID = 3003950 THEN epd.VALUE END AS nocm,
                CASE WHEN ed.ID = 3003952 THEN epd.VALUE END AS nomor,
                CASE WHEN ed.ID = 3003953 THEN epd.VALUE END AS ada,
                CASE WHEN ed.ID = 3003953 THEN epd.VALUE END AS tidakada,
                CASE WHEN ed.ID = 3003957 THEN epd.VALUE END AS nama,
                CASE WHEN ed.ID = 3003958 THEN epd.VALUE END AS tgllahir,
                CASE WHEN ed.ID = 3003959 THEN epd.VALUE END AS jeniskelamin,
                CASE WHEN ed.ID = 3003960 THEN epd.VALUE END AS pekerjaan,
                CASE WHEN ed.ID = 3003961 THEN epd.VALUE END AS alamat,
                CASE WHEN ed.ID = 3003955 THEN epd.VALUE END AS keperluan,
                CASE WHEN ed.ID = 3003956 THEN epd.VALUE END AS dokter
                FROM emrpasien_t ep
                        INNER JOIN emrpasiend_t epd ON ep.noemr = epd.emrpasienfk
                        INNER JOIN emrd_t ed ON ed.ID = epd.emrdfk 
                        INNER JOIN pegawai_m pg on pg.id = epd.pegawaifk
                    WHERE ep.kdprofile = $kdProfile AND ep.statusenabled = TRUE 
                        AND ep.noemr ILIKE'$noemr' 
                        AND ed.statusenabled = TRUE 
                        AND ep.emrfk = $emrfk 
                        AND ed.emrfk = $emrfk
                ORDER BY
	    ed.ID ASC)as x"
        ));
        foreach ($data as $z){
            if (isset($z->tgllahir) ||isset($z->tgl)){
                $z->tgllahir=$this->tanggal_indonesia(date('Y-m-d',strtotime($z->tgllahir)));
                $z->tgl=$this->tanggal_indonesia(date('Y-m-d',strtotime($z->tgl)));
            }
            
        }
        $pageWidth = 950;
        return view('report.EMR.suratketerangankesehatanjiwa',compact('data','pageWidth'));
    }
}