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

    public function cetakResepDokterRev(Request $r) {
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
            select pm2.nocm ,to_char(pm2.tgllahir,'dd-mm-yyyy') as tgllahir,age(pm2.tgllahir) as umur ,jm.jeniskelamin ,pm2.namapasien ,pm3.namalengkap, rm.namaruangan ruanganasal, ra.namaruangan ruangantujuan, pm2.alergi, 
            to_char(st.tglorder,'dd-mm-yyyy MM:ss') as tglorder,pm3.nosip, kp.kelompokpasien 
            from strukorder_t st
            inner join pasien_m pm2 on pm2.id = st.nocmfk
            inner join jeniskelamin_m jm on jm.id = pm2.objectjeniskelaminfk
            inner join pegawai_m pm3 on pm3.id = st.objectpegawaiorderfk
            inner join ruangan_m rm on rm.id = st.objectruanganfk 
            inner join ruangan_m ra on ra.id = st.objectruangantujuanfk 
            inner join pasiendaftar_t AS pd ON pd.norec = st.noregistrasifk
            left join kelompokpasien_m AS kp ON kp.id = pd.objectkelompokpasienlastfk
            where st.noorder = '$noorder'
        "))->first();
        $detel = [];
        $details = \DB::select(DB::raw("
                select  pt.jeniskemasanfk,  jr.jenisracikan, pt.rke,pt.dosis, pt.jumlah , pt.aturanpakai , pm.namaproduk, pm.kekuatan, pt.keteranganpakai from pelayananpasien_t pt 
                inner join produk_m pm on pm.id = pt.produkfk
                inner join jenisracikan_m jr on jr.id = pt.jenisobatfk 
                where strukresepfk = '$norec'
                and pt.isobat = true
                order by pt.rke asc, pt.keteranganpakai asc
            "));
//        dd($raw);
        if(!empty($raw)){
            // $raw->umur = $this->getAge($raw->tgllahir ,date('Y-m-d'));
        }else if (empty($raw)){
            $raw = collect(DB::select("
                select pm2.nocm ,to_char(pm2.tgllahir,'dd-mm-yyyy') as tgllahir,age(pm2.tgllahir) as umur ,jm.jeniskelamin ,pm2.namapasien ,pm3.namalengkap, rm.namaruangan ruangantujuan, to_char(s.tglresep ,'dd-mm-yyyy MM:ss') as tglorder,pm3.nosip, kp.kelompokpasien, ra.namaruangan ruanganasal, pm2.alergi
                from strukresep_t s
                inner join antrianpasiendiperiksa_t at2 on at2.norec = s.pasienfk 
                inner join pasiendaftar_t pt on pt.norec = at2.noregistrasifk 
                inner join pasien_m pm2 on pm2.id = pt.nocmfk 
                inner join jeniskelamin_m jm on jm.id = pm2.objectjeniskelaminfk
                inner join pegawai_m pm3 on pm3.id = s.penulisresepfk 
                inner join ruangan_m rm on rm.id = s.ruanganfk 
                left join ruangan_m ra on ra.id = at2.objectruanganasalfk 
                left join kelompokpasien_m AS kp ON kp.id = pt.objectkelompokpasienlastfk
                where s.norec = '$norec'

            "))->first();
            $details = \DB::select(DB::raw("
                select pt.jeniskemasanfk, jr.jenisracikan, pt.rke,pt.dosis, pt.jumlah , pt.aturanpakai , pm.namaproduk, pm.kekuatan, pt.keteranganpakai from pelayananpasien_t pt 
                inner join produk_m pm on pm.id = pt.produkfk 
                inner join jenisracikan_m jr on jr.id = pt.jenisobatfk
                where strukresepfk = '$norec'
                and pt.isobat = true
                order by pt.rke asc,pt.keteranganpakai asc
            "));
        }else{
            echo 'Data Tidak ada ';
            return;
        }

        $skrining = collect(DB::select("
            select s.noresep, st.rpenulis, st.rtanggalresep, st.rklinis, st.rmr, st.rpasien,
            st.rtanggallahir,
            st.rberatbedan,
            st.rdokter,
            st.rruang,
            st.rstatusjamin,
            st.robat,
            st.rkekuatan,
            st.rjumlahobat, st.ketskrining, st.ridentitasdokter,st.rcarabayar,st.rruanganresep, st.rnamaobat, st.rstabilitas, st.raturan, st.ralergi, st.rinteraksi, st.rvariasi, st.rbeban, st.rdatawaktu 
            from strukresep_t s
            left join skriningfarmasi_t st on st.norec_apd = s.norec
            where s.norec = '$norec'
        "))->first();
//        dd($raw);
        $pageWidth = 550;
        //var_dump($skrining);

        // return $r['norec'];
        $cetakkin = $r['cetakkin'];
        return view('report.apotik.resepdokterrev',
            compact('raw', 'pageWidth','r','details','profile', 'skrining','cetakkin'));
    }

    public function cetakAntrianKiosk(Request $request) {
        $kdProfile = (int)$request['kdprofile'];
        $norec = $request['norec'];
        $TglAwal =  date('Y-m-d '). '00:00';
        $TglAkhir = date('Y-m-d '). '23:59';
        $tglAyeuna = date('Y-m-d H:i:s');
        $profile = collect(DB::select
            ("
                select * from profile_m where statusenabled=true limit 1
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
                select * from profile_m where statusenabled=true limit 1
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
                select * from profile_m where statusenabled=true limit 1
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
        // return view('report.cppt-ranap-dom',compact('res','pageWidth', 'data'));
        // dd($res);
        $item =[];   
        $item2= [];      
        foreach( $res['d'] as $items){
                if($items->type  ==  "textbox" ||$items->type  ==  "textarea"  ){
                    $item[$items->emrdfk] =  $items->value;
                }
                if($items->type  ==  "datetime"){
                    $item[$items->emrdfk] = date('Y-m-d H:i:s',strtotime( $items->value));
                }
                if($items->type  ==  "time"){
                    $item[$items->emrdfk] = date('H:i',strtotime( $items->value));
                }
                if($items->type  ==  "date"){
                    $item[$items->emrdfk] = date('Y-m-d',strtotime( $items->value));
                }
                if($items->type  ==  "checkboxtextbox"){
                    $item[$items->emrdfk] =  $items->value;
                    $item2[$items->emrdfk] =  true;
                }
                if($items->type == "checkbox") {
                    $chekedd = false;
                    if ($items->value == '1') {
                        $chekedd = true;
                    }
                    $item[$items->emrdfk] = $chekedd;
                }
                if($items->type == "combobox") {
                    $arr = explode('~',$items->value );
                    $item[$items->emrdfk] = $arr[1];
                }
        }

         $peg = null;    
        if(isset($request['isttd']) && $request['isttd'] == true){
            $peg = DB::table('pegawai_m')->where('id',$request['pegawaittd'])->first();
        }

        $pdf = PDF::loadView(
            'report.cppt-ranap-dom',
            array(
                'res' => $res,
                'pageWidth' => $pageWidth,
                'data' => $data,
                'item'=> $item,
                'peg'=> $peg
            )
        );
        if(isset($request['isttd']) && $request['isttd'] == true){
            $objetoRequest = new \Illuminate\Http\Request();
            $objetoRequest ['emrfk'] = $request['emrfk'];
            $objetoRequest ['norec_emr'] = $request['emr'];
            $objetoRequest ['pegawaittd'] = $request['pegawaittd'];
            $objetoRequest ['nocm'] = $request['nocm'];
            $objetoRequest ['noregistrasi'] = $request['noregistrasi'];
            $objetoRequest ['norec_pd'] = $request['norec_pd'];
            $bsre = app('App\Http\Controllers\Bridging\BridgingBSREController')->pengajuanTTE($objetoRequest,true);
            if($bsre['status'] == 201){
                $content = $pdf->download()->getOriginalContent();
                \Storage::disk('local')->put( 'TTD_BSRE/' . $bsre['dokumen']->id . '/file' . '.pdf' , $content);
            }
          
            return $bsre;
        }

        return $pdf->stream();
        return view('report.cppt-ranap',compact('res','pageWidth', 'data'));
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
         $secret = '6LeHLNghAAAAAPdEsEtL5jh5CRd8Lh2ln9XuFvcF';
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
        ->select('sdmp.email','sdmp.norec','sdmp.nama','sdmp.image','djp.detailjenisproduk','sdm.institusipendidikan',DB::raw('sdm.tanggalmulai::date,sdm.tanggalselesai::date'))
        // ->orderBy('sdmp.nama', 'asc')
        ->paginate(10);
        
        // $users->withPath('custom/url');

        return view('report.diklat-nametag',compact('data','pageWidth','norec'));
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
        foreach ($data as $d) {
            $d->tanggalmulai = $this->tanggal_indonesia(date('Y-m-d',strtotime($d->tanggalmulai)));
            $d->tanggalselesai = $this->tanggal_indonesia(date('Y-m-d',strtotime($d->tanggalselesai)));
            $d->tanggal_sekarang = $this->tanggal_indonesia(date('Y-m-d',strtotime(\Carbon\Carbon::now())));
        }
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


    public function CetakLapOrderKirim(Request $request)
    {   
        // $norec = $request['emr'];
        //$kdProfile = (int) $this->getDataKdProfile($request);
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $noorder = $request['noorder'];
        $searchnoorder = '';

        if(isset($request['noorder']) && $request['noorder'] != '' && $request['noorder'] != null){
            $searchnoorder = "and so.noorder = '".$noorder."'";
        }

        $data = \DB::select(DB::raw("select ruanganorder, ruangankirim, tglorder, tglkirim, nokirim, namaproduk, satuanstandar, jumlahorder, sum(jumlahkirim) jumlahkirim
        from(
        select so.tglorder, skm.tglkirim, skm.nokirim, pr.namaproduk, ss.satuanstandar, 
				ruorder.namaruangan ruanganorder, rukirim.namaruangan ruangankirim,
        case when so.norec is null then 0 else op.qtyproduk end as jumlahorder,
        krp.qtyproduk jumlahkirim
        from strukkirim_t skm
        inner join kirimproduk_t krp on krp.nokirimfk = skm.norec
        inner join produk_m pr on pr.id = krp.objectprodukfk
        inner join satuanstandar_m ss on ss.id =pr.objectsatuanstandarfk
        left join strukorder_t so on so.norec = skm.noorderfk
        left join orderpelayanan_t op on so.norec = op.strukorderfk and op.objectprodukfk = krp.objectprodukfk
		inner join ruangan_m ruorder on ruorder.id = so.objectruanganfk
		inner join ruangan_m rukirim on rukirim.id = so.objectruangantujuanfk
        where skm.statusenabled = true and skm.kdprofile = 30
        and krp.statusenabled = true and krp.kdprofile = 30
        and skm.tglkirim::date between '$tglAwal' and '$tglAkhir' 
        and so.statusenabled = true and so.kdprofile = 30
        and so.tglorder::date between '$tglAwal' and '$tglAkhir' and so.noorder ilike 'OTRF%'
        and op.statusenabled = true and op.kdprofile = 30
        $searchnoorder
        group by ruorder.namaruangan, rukirim.namaruangan, so.tglorder, skm.tglkirim, skm.nokirim, pr.namaproduk, ss.satuanstandar, so.norec, op.qtyproduk, krp.qtyproduk
        order by skm.nokirim
        ) as x group by ruanganorder, ruangankirim, tglorder, tglkirim, nokirim, namaproduk, satuanstandar, jumlahorder
        "));
        
        $pageWidth = 950;
        return view('report.apotik.laporderkirimbarang',compact('data','pageWidth', 'tglAwal', 'tglAkhir', 'noorder'));
    }

    public function getCetakSPJSatuLampiran(Request $request){
        $norec = $request['norec'];
        $terbilang = $request['terbilang'];

        $tampilsumberdana = true;
        if($request['sumberdana'] == 15){
            $tampilsumberdana = false;
        }

        $kegiatan = DB::select(DB::raw("
            select km.keterangan ktsubsub, km.kode kodesubsub, km.tahun, km.div divsubsub, pg.namalengkap, pg.nip_pns, kg.keterangan ktsub, kg.kode kodesub, kg.div divsub
            from strukrealisasi_t sr
            inner join realisasidetail_t rd on rd.strukrealisasifk =sr.norec
            inner join keteranganbelanja_t kb on kb.norec = rd.keteranganbelanjafk
            inner join kegiatananggaran_m km on km.id = kb.objectkegiatanfk
            inner join mataanggaran_m ma on ma.id = sr.objectmataanggaranfk
            left join kegiatananggaran_m kg on km.kode ilike '%' || kg.kode || '%' and kg.div = 3
            left join pegawai_m pg on pg.id = km.objectpptkfk
            where sr.norec = '$norec'
            group by km.keterangan, km.kode, km.tahun, km.div, kg.keterangan, kg.kode, kg.div, pg.namalengkap, pg.nip_pns;
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

        $mataanggaran = DB::select(DB::raw("select ma.namamataanggaran, ma.kodemataanggaran,
        map3.kode || '.' || map2.kode || '.' || map1.kode || '.' || map.kode as kodepermendagri
        from strukrealisasi_t sr
        inner join realisasidetail_t rd on rd.strukrealisasifk =sr.norec
        inner join keteranganbelanja_t kb on kb.norec = rd.keteranganbelanjafk
        inner join kegiatananggaran_m km on km.id = kb.objectkegiatanfk
        left join kegiatananggaran_m kg on km.kode ilike '%' || kg.kode || '%' and kg.div = 3
        inner join mataanggaran_m ma on ma.id = sr.objectmataanggaranfk
        left join mataanggaranpermen_m map on map.id = ma.mataanggaranpermenfk
        left join mataanggaranpermen_m map1 on map1.id = map.mataanggaranpermenfk and map1.div = 4
        left join mataanggaranpermen_m map2 on map2.id = map1.mataanggaranpermenfk and map2.div = 3
        left join mataanggaranpermen_m map3 on map3.id = map2.mataanggaranpermenfk and map3.div = 2
        where sr.norec = '$norec'
        group by ma.namamataanggaran, ma.kodemataanggaran, map3.kode || '.' || map2.kode || '.' || map1.kode || '.' || map.kode;"));

        $spj = DB::select(DB::raw("select 
        sr.norealisasi, sr.pph, sr.ppn, sr.pph+sr.ppn as totalpp, pgb.namalengkap as namabendahara, pgb.nip_pns as nipbendahara, pgp.namalengkap as namapenerima
        from strukrealisasi_t sr
        inner join realisasidetail_t rd on rd.strukrealisasifk =sr.norec
        inner join keteranganbelanja_t kb on kb.norec = rd.keteranganbelanjafk
        inner join kegiatananggaran_m km on km.id = kb.objectkegiatanfk
        left join pegawai_m pgb on pgb.id = sr.bendaharafk 
        left join pegawai_m pgp on pgp.id = sr.penerimafk 
        left join kegiatananggaran_m kg on km.kode ilike '%' || kg.kode || '%' and kg.div = 3
        inner join mataanggaran_m ma on ma.id = sr.objectmataanggaranfk
        where sr.norec = '$norec'
        group by sr.norealisasi, sr.pph, sr.ppn, pgb.namalengkap, pgp.namalengkap, pgb.nip_pns"));

        $detail = DB::select(DB::raw("select row_number() over(order by rd.norec) as nomor, rd.norec, rd.uraian, rd.jml, rd.satuan, rd.harga, rd.subtotal
        from strukrealisasi_t sr
        inner join realisasidetail_t rd on rd.strukrealisasifk =sr.norec
        inner join keteranganbelanja_t kb on kb.norec = rd.keteranganbelanjafk
        inner join kegiatananggaran_m km on km.id = kb.objectkegiatanfk
        left join kegiatananggaran_m kg on km.kode ilike '%' || kg.kode || '%' and kg.div = 3
        inner join mataanggaran_m ma on ma.id = sr.objectmataanggaranfk
        where sr.norec = '$norec'
        group by rd.uraian, rd.jml, rd.satuan, rd.harga, rd.subtotal, rd.norec;"));

        $jumlah = DB::select(DB::raw("select sum(subtotal) totalfix, round(sum(subtotal)) totalpembulatan
        from(
        select rd.subtotal, rd.norec
                from strukrealisasi_t sr
        inner join realisasidetail_t rd on rd.strukrealisasifk =sr.norec
        inner join keteranganbelanja_t kb on kb.norec = rd.keteranganbelanjafk
        inner join kegiatananggaran_m km on km.id = kb.objectkegiatanfk
        left join pegawai_m pgb on pgb.id = sr.bendaharafk 
        left join pegawai_m pgp on pgp.id = sr.penerimafk 
        left join kegiatananggaran_m kg on km.kode ilike '%' || kg.kode || '%' and kg.div = 3
        inner join mataanggaran_m ma on ma.id = sr.objectmataanggaranfk
        where sr.norec = '$norec'
        group by rd.subtotal, rd.norec
        ) as x;"));



        $result = array(
            'data' => $detail,
            'message' => '@epic',
        );

        $pageWidth = 950;
        return view('report.spj.cetakspjsatulampiran',compact('kegiatan','pageWidth', 'keterangan', 'mataanggaran', 'spj', 'detail', 'jumlah', 'terbilang', 'tampilsumberdana'));
    }

    public function getCetakPengantarSPM(Request $request){
        $norec = $request['norec'];
        $terbilang = $request['terbilang'];
        

        $detail = DB::select(DB::raw("
            select * from spm_t where statusenabled = true and kdprofile = 30 and norec = '$norec'
            ")
        );

        $tgl = $this->tanggal_indonesia(date('Y-m-d',strtotime($detail[0]->tglspm)));

        $result = array(
            'data' => $detail,
            'message' => '@epic',
        );

        $pageWidth = 950;
        return view('report.spj.cetaksuratpengantarspm',compact('pageWidth', 'detail', 'terbilang', 'tgl'));
    }

    public function getCetakPengantarSPP(Request $request){
        $norec = $request['norec'];
        $terbilang = $request['terbilang'];
        

        $detail = DB::select(DB::raw("
            select * from spp_t where statusenabled = true and kdprofile = 30 and norec = '$norec'
            ")
        );

        $tgl = $this->tanggal_indonesia(date('Y-m-d',strtotime($detail[0]->tglspp)));

        $result = array(
            'data' => $detail,
            'message' => '@epic',
        );

        $pageWidth = 950;
        return view('report.spj.cetaksuratpengantarspp',compact('pageWidth', 'detail', 'terbilang', 'tgl'));
    }

    public function getCetakRingkasanSPP(Request $request){
        $norec = $request['norec'];
        $terbilang = $request['terbilang'];
        

        $detail = DB::select(DB::raw("
            select * from spp_t where statusenabled = true and kdprofile = 30 and norec = '$norec'
            ")
        );

        $tgl = $this->tanggal_indonesia(date('Y-m-d',strtotime($detail[0]->tglspp)));

        $result = array(
            'data' => $detail,
            'message' => '@epic',
        );

        $pageWidth = 950;
        return view('report.spj.cetakringkasanspp',compact('pageWidth', 'detail', 'terbilang', 'tgl'));
    }

    public function getCetakRincianSPP(Request $request){
        $norec = $request['norec'];
        $terbilang = $request['terbilang'];
        

        $detail = DB::select(DB::raw("
            select * from spp_t where statusenabled = true and kdprofile = 30 and norec = '$norec'
            ")
        );

        $permen = DB::select(DB::raw("select row_number() over(order by id) as nomor, *
            from mataanggaranpermen_m where statusenabled = true and kdprofile = 30 and div = 2
        "));

        $tgl = $this->tanggal_indonesia(date('Y-m-d',strtotime($detail[0]->tglspp)));

        $result = array(
            'data' => $detail,
            'message' => '@epic',
        );

        $pageWidth = 950;
        return view('report.spj.cetakrincianspp',compact('pageWidth', 'detail', 'terbilang', 'tgl', 'permen'));
    }

    public function getCetakSTSPdf(Request $request){
        $nosts = $request['nosts'];

        $detail = DB::select(DB::raw("select 
        string_agg(headersts.namapasien, ',') namapasien, sts.totalsetoran, headersts.carabayarfk, to_char(sts.tglpenerimaan, 'DD-MM-YYYY') tglpenerimaan, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.kolom1, stsd.kolom2, sts.nosts, sts.terbilang
        from 
        surattandasetoran_t as sts 
        inner join surattandasetorandetail_t stsd on stsd.objectstsfk = sts.nosts
        inner join lateral(
                    select 
                        COALESCE(ps.namapasien ,sp.namapasien_klien) namapasien,sck.carabayarfk 
                    from strukclosing_t sc
                    inner join strukclosingkasir_t sck on sc.norec = sck.noclosingfk
                    inner join ststosck_t as ssc on ssc.objectsckfk = sck.norec
                    inner join strukbuktipenerimaan_t as sbm on sbm.noclosingfk = sc.norec
                    inner join strukpelayanan_t as sp on sbm.nostrukfk = sp.norec				
                    left join pasien_m as ps on ps.id = sp.nocmfk
                    where  sts.norec = ssc.objectstsfk
        ) headersts on true
        where sts.nosts = '$nosts'
		group by stsd.nourut, sts.totalsetoran, headersts.carabayarfk, to_char(sts.tglpenerimaan, 'DD-MM-YYYY'), stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.kolom1, stsd.kolom2, sts.nosts, sts.terbilang
        order by stsd.nourut"));
        
        $result = array(
            'data' => $detail,
            'message' => '@epic',
        );

        $pageWidth = 900;
        return view('report.spj.cetakstspdf',compact('pageWidth', 'detail'));
    }

    public function getCetakSTSManualPdf(Request $request){
        $nosts = $request['nosts'];

        $detail = DB::select(DB::raw("select to_char(sts.tglpenerimaan, 'DD-MM-YYYY') tglpenerimaan, sts.nosts, sts.totalsetoran, sts.terbilang, sts.keterangan,
        stsd.*
        from surattandasetoran_t sts
        inner join surattandasetorandetail_t stsd on sts.nosts = stsd.objectstsfk
        where sts.kdprofile = 30
        and sts.statusenabled = true
        and stsd.kdprofile = 30
        and stsd.statusenabled = true
        and sts.ismanual = true
        and sts.nosts = '$nosts'
        order by nourut"));
        
        $result = array(
            'data' => $detail,
            'message' => '@epic',
        );

        $pageWidth = 900;
        return view('report.spj.cetakstsmanualpdf',compact('pageWidth', 'detail'));
    }

    public function getCetakSTSKeuangan(Request $request){
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];

        $periodeawal = $this->tanggal_indonesia(date('Y-m-d',strtotime($tglAwal)));
        $periodeakhir = $this->tanggal_indonesia(date('Y-m-d',strtotime($tglAkhir)));

        $detail = DB::select(DB::raw("
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
        and sr.tglsts between '$tglAwal' and '$tglAkhir'
        and ka.kdprofile = 30 and ka.statusenabled=true
        and dp0.kdprofile = 30 and dp0.statusenabled=true
            ")
        );

        $result = array(
            'data' => $detail,
            'message' => '@epic',
        );

        $pageWidth = 850;
        return view('report.spj.cetakstskeuangan',compact('pageWidth', 'detail', 'periodeawal', 'periodeakhir'));
    }

    public function getCetakPertanggungjawabanSPM(Request $request){
        $norec = $request['norec'];
        $terbilang = $request['terbilang'];
        

        $detail = DB::select(DB::raw("
            select * from spm_t where statusenabled = true and kdprofile = 30 and norec = '$norec'
            ")
        );

        $tgl = $this->tanggal_indonesia(date('Y-m-d',strtotime($detail[0]->tglspm)));

        $result = array(
            'data' => $detail,
            'message' => '@epic',
        );

        $pageWidth = 950;
        return view('report.spj.cetaksuratpertanggungjawabanspm',compact('pageWidth', 'detail', 'terbilang', 'tgl'));
    }

    public function getCetakRincianSPM(Request $request){
        $norec = $request['norec'];
        $terbilang = $request['terbilang'];
        

        $detail = DB::select(DB::raw("
            select * from spm_t where statusenabled = true and kdprofile = 30 and norec = '$norec'
            ")
        );

        $spd = DB::select(DB::raw("
            select spd.* 
                from spm_t spm
            inner join spp_t spp on spp.norec = spm.objectsppfk
            left join spd_t spd on spd.norec = spp.objectspdfk and spd.statusenabled = true 
            where spm.statusenabled = true 
            and spm.kdprofile = 30
            and spp.statusenabled = true 
            and spp.kdprofile = 30 
            and spm.norec = '$norec'
        "));

        $tglspd = '';
        $tglspd = $this->tanggal_indonesia(date('Y-m-d',strtotime($spd[0]->tglspd)));
        $tgl = $this->tanggal_indonesia(date('Y-m-d',strtotime($detail[0]->tglspm)));

        $result = array(
            'data' => $detail,
            'message' => '@epic',
        );

        $pageWidth = 950;
        return view('report.spj.cetaksuratrincianspm',compact('pageWidth', 'detail', 'terbilang', 'tgl', 'tglspd'));
    }

    public function getCetakSPJ(Request $request){
        $norec = $request['norec'];
        $terbilang = $request['terbilang'];

        $tampilsumberdana = true;
        if($request['sumberdana'] == 15){
            $tampilsumberdana = false;
        }

        $kegiatan = DB::select(DB::raw("
            select km.keterangan ktsubsub, km.kode kodesubsub, km.tahun, km.div divsubsub, kg.keterangan ktsub, kg.kode kodesub, kg.div divsub, pg.namalengkap, pg.nip_pns
            from strukrealisasi_t sr
            inner join realisasidetail_t rd on rd.strukrealisasifk =sr.norec
            inner join keteranganbelanja_t kb on kb.norec = rd.keteranganbelanjafk
            inner join kegiatananggaran_m km on km.id = kb.objectkegiatanfk
            inner join mataanggaran_m ma on ma.id = sr.objectmataanggaranfk
            left join kegiatananggaran_m kg on km.kode ilike kg.kode || '%' and kg.div = 3
            left join pegawai_m pg on pg.id = km.objectpptkfk
            where sr.norec = '$norec'
            group by km.keterangan, km.kode, km.tahun, km.div, kg.keterangan, kg.kode, kg.div, pg.namalengkap, pg.nip_pns;
            ")
        );

        $keterangan = DB::select(DB::raw("select kb.keteranganbelanja
        from strukrealisasi_t sr
        inner join realisasidetail_t rd on rd.strukrealisasifk =sr.norec
        inner join keteranganbelanja_t kb on kb.norec = rd.keteranganbelanjafk
        inner join kegiatananggaran_m km on km.id = kb.objectkegiatanfk
        left join kegiatananggaran_m kg on km.kode ilike kg.kode || '%' and kg.div = 3
        inner join mataanggaran_m ma on ma.id = sr.objectmataanggaranfk
        where sr.norec = '$norec'
        group by kb.keteranganbelanja;"));

        $mataanggaran = DB::select(DB::raw("select ma.namamataanggaran, ma.kodemataanggaran
        from strukrealisasi_t sr
        inner join realisasidetail_t rd on rd.strukrealisasifk =sr.norec
        inner join keteranganbelanja_t kb on kb.norec = rd.keteranganbelanjafk
        inner join kegiatananggaran_m km on km.id = kb.objectkegiatanfk
        left join kegiatananggaran_m kg on km.kode ilike kg.kode || '%' and kg.div = 3
        inner join mataanggaran_m ma on ma.id = sr.objectmataanggaranfk
        where sr.norec = '$norec'
        group by ma.namamataanggaran, ma.kodemataanggaran;"));

        $spj = DB::select(DB::raw("select 
        sr.norealisasi, sr.pph, sr.ppn, sr.pph+sr.ppn as totalpp, pgb.namalengkap as namabendahara, pgb.nip_pns as nipbendahara, pgp.namalengkap as namapenerima
        from strukrealisasi_t sr
        inner join realisasidetail_t rd on rd.strukrealisasifk =sr.norec
        inner join keteranganbelanja_t kb on kb.norec = rd.keteranganbelanjafk
        inner join kegiatananggaran_m km on km.id = kb.objectkegiatanfk
        left join pegawai_m pgb on pgb.id = sr.bendaharafk 
        left join pegawai_m pgp on pgp.id = sr.penerimafk 
        left join kegiatananggaran_m kg on km.kode ilike kg.kode || '%' and kg.div = 3
        inner join mataanggaran_m ma on ma.id = sr.objectmataanggaranfk
        where sr.norec = '$norec'
        group by sr.norealisasi, sr.pph, sr.ppn, pgb.namalengkap, pgp.namalengkap, pgb.nip_pns"));

        $detail = DB::select(DB::raw("select row_number() over(order by rd.norec) as nomor, rd.norec, rd.uraian, rd.jml, rd.satuan, rd.harga, rd.subtotal
        from strukrealisasi_t sr
        inner join realisasidetail_t rd on rd.strukrealisasifk =sr.norec
        inner join keteranganbelanja_t kb on kb.norec = rd.keteranganbelanjafk
        inner join kegiatananggaran_m km on km.id = kb.objectkegiatanfk
        left join kegiatananggaran_m kg on km.kode ilike kg.kode || '%' and kg.div = 3
        inner join mataanggaran_m ma on ma.id = sr.objectmataanggaranfk
        where sr.norec = '$norec'
        group by rd.uraian, rd.jml, rd.satuan, rd.harga, rd.subtotal, rd.norec;"));

        $jumlah = DB::select(DB::raw("select sum(subtotal) totalfix, round(sum(subtotal)) totalpembulatan
        from(
        select rd.subtotal, rd.norec
                from strukrealisasi_t sr
        inner join realisasidetail_t rd on rd.strukrealisasifk =sr.norec
        inner join keteranganbelanja_t kb on kb.norec = rd.keteranganbelanjafk
        inner join kegiatananggaran_m km on km.id = kb.objectkegiatanfk
        left join pegawai_m pgb on pgb.id = sr.bendaharafk 
        left join pegawai_m pgp on pgp.id = sr.penerimafk 
        left join kegiatananggaran_m kg on km.kode ilike kg.kode || '%' and kg.div = 3
        inner join mataanggaran_m ma on ma.id = sr.objectmataanggaranfk
        where sr.norec = '$norec'
        group by rd.subtotal, rd.norec
        ) as x;"));



        $result = array(
            'data' => $detail,
            'message' => '@epic',
        );

        $pageWidth = 950;
        return view('report.spj.cetakspj',compact('kegiatan','pageWidth', 'keterangan', 'mataanggaran', 'spj', 'detail', 'jumlah', 'terbilang', 'tampilsumberdana'));
    }

    public function CetakPerJenisAnggaran(Request $request){
        $tahun = $request['tahun'];
        $tahap =  $request['tahap'];
        $tanggalcetak = $this->tanggal_indonesia(date('Y-m-d',strtotime($request['tglcetak'])));

        $qtahap  = '';
        if (isset($request['tahap']) && $request['tahap'] != "" && $request['tahap'] != "undefined") {
            $qtahap =  ' and kb.objecttahapfk =  ' . $request['tahap'];
        }

        $tahap = DB::select(DB::raw("select * from tahapanggaran_m where id = $tahap"));

        $data = DB::select(DB::raw("select * from(
            select kegiatan, kode, div, sum(jumlahbarangjasa) jumlahbarangjasa, sum(jumlahmodal) jumlahmodal, sum(jumlahpegawai) jumlahpegawai,
            sum(jumlahbarangjasa) + sum(jumlahmodal) + sum(jumlahpegawai) as total
            from(
                select kegiatan, subkegiatan, kode, div,
                case when jenisanggaran = 'Belanja Barang dan Jasa' then subtotal else 0 end as jumlahbarangjasa,
                case when jenisanggaran = 'Belanja Modal' then subtotal else 0 end as jumlahmodal, 
                case when jenisanggaran = 'Belanja Pegawai' then subtotal else 0 end as jumlahpegawai
                from( 
                    select kmss.keterangan kegiatan, kmss.kode, kmss.div, kms.keterangan subkegiatan, ja.jenisanggaran, sum(kb.subtotal) subtotal
                    from kegiatananggaran_m km
                    inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
                    left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
                    inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
                    inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
                    inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%' and mat.objectjenisanggaranfk is not null
                    inner join jenisanggaran_m ja on ja.id = mat.objectjenisanggaranfk
                    where km.kdprofile = 30 and km.statusenabled = true
                    and kb.kdprofile = 30 and kb.statusenabled = true
                    and km.tahun = '$tahun'
                    $qtahap
                    group by kms.keterangan, kmss.keterangan, kmss.kode, ja.jenisanggaran, kmss.div
                ) as x group by kegiatan, subkegiatan, jenisanggaran, subtotal, kode, div
            ) as y group by kegiatan, kode, div
        
        
            union all
        
        
            select subkegiatan kegiatan, kode, div, sum(jumlahbarangjasa) jumlahbarangjasa, sum(jumlahmodal) jumlahmodal, sum(jumlahpegawai) jumlahpegawai,
            sum(jumlahbarangjasa) + sum(jumlahmodal) + sum(jumlahpegawai) as total
            from(
                select kegiatan, subkegiatan, kode, div,
                case when jenisanggaran = 'Belanja Barang dan Jasa' then subtotal else 0 end as jumlahbarangjasa,
                case when jenisanggaran = 'Belanja Modal' then subtotal else 0 end as jumlahmodal, 
                case when jenisanggaran = 'Belanja Pegawai' then subtotal else 0 end as jumlahpegawai
                from( 
                    select kmss.keterangan kegiatan, kms.keterangan subkegiatan, kms.kode, kms.div, ja.jenisanggaran, sum(kb.subtotal) subtotal
                    from kegiatananggaran_m km
                    inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
                    left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
                    inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
                    inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
                    inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%' and mat.objectjenisanggaranfk is not null
                    inner join jenisanggaran_m ja on ja.id = mat.objectjenisanggaranfk
                    where km.kdprofile = 30 and km.statusenabled = true
                    and kb.kdprofile = 30 and kb.statusenabled = true
                    and km.tahun = '$tahun'
                    $qtahap
                    group by kms.keterangan, kmss.keterangan, kms.kode, ja.jenisanggaran, kms.div
                ) as x group by kegiatan, subkegiatan, jenisanggaran, subtotal, kode, div
            ) as y group by subkegiatan, kode, div
        ) as a order by kode;"));

        $jumlah = DB::select(DB::raw("select sum(jumlahbarangjasa) jumlahbarangjasa, sum(jumlahmodal) jumlahmodal, sum(jumlahpegawai) jumlahpegawai,
        sum(jumlahbarangjasa) + sum(jumlahmodal) + sum(jumlahpegawai) as total
        from(
            select kegiatan, kode, div, sum(jumlahbarangjasa) jumlahbarangjasa, sum(jumlahmodal) jumlahmodal, sum(jumlahpegawai) jumlahpegawai,
            sum(jumlahbarangjasa) + sum(jumlahmodal) + sum(jumlahpegawai) as total
            from(
                select kegiatan, subkegiatan, kode, div,
                case when jenisanggaran = 'Belanja Barang dan Jasa' then subtotal else 0 end as jumlahbarangjasa,
                case when jenisanggaran = 'Belanja Modal' then subtotal else 0 end as jumlahmodal, 
                case when jenisanggaran = 'Belanja Pegawai' then subtotal else 0 end as jumlahpegawai
                from( 
                    select kmss.keterangan kegiatan, kmss.kode, kmss.div, kms.keterangan subkegiatan, ja.jenisanggaran, sum(kb.subtotal) subtotal
                    from kegiatananggaran_m km
                    inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
                    left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
                    inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
                    inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
                    inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%' and mat.objectjenisanggaranfk is not null
                    inner join jenisanggaran_m ja on ja.id = mat.objectjenisanggaranfk
                    where km.kdprofile = 30 and km.statusenabled = true
                    and kb.kdprofile = 30 and kb.statusenabled = true
                    and km.tahun = '$tahun'
                    $qtahap
                    group by kms.keterangan, kmss.keterangan, kmss.kode, ja.jenisanggaran, kmss.div
                ) as x group by kegiatan, subkegiatan, jenisanggaran, subtotal, kode, div
            ) as y group by kegiatan, kode, div
        ) as z"));
        

        $pageWidth = 1200;
        //return $this->respond($result);
        return view('report.spj.cetakjenisanggaran',compact('data', 'pageWidth', 'jumlah', 'tahap', 'tanggalcetak'));
    }

    public function CetakKeuanganPerRekening(Request $request){
        $tahun = $request['tahun'];

        $qtahun  = '';
        $qtahunka  = '';
        if (isset($request['tahun']) && $request['tahun'] != "" && $request['tahun'] != "undefined") {
            $qtahun =  " and extract(year from sr.tglrealisasi) =  '" . $request['tahun']."'";
            $qtahunka =  " and ka.tahun =  '" . $request['tahun']."'";
        }

        $qasalproduk  = '';
        if (isset($request['asalproduk']) && $request['asalproduk'] != "" && $request['asalproduk'] != "undefined") {
            $qasalproduk =  " and kb.objectasalprodukfk =  " . $request['asalproduk'];
        }

        $data = DB::select(DB::raw("select ma.kodemataanggaran, ma.namamataanggaran, sum(kb.subtotal) jumlahanggaran,
        x.totalbelanja jumlahspj, y.jumlah jumlahpanjar,
        x.totalbelanja + y.jumlah as subtotal, round(cast(((x.totalbelanja + y.jumlah)/sum(kb.subtotal))*100 as numeric), 2) as persentase,  
        sum(kb.subtotal) - (x.totalbelanja + y.jumlah) sisaanggaran
        from mataanggaran_m ma
        inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
        INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
				inner join (
					select ma.kodemataanggaran, ma.namamataanggaran, sum(sr.totalbelanja) totalbelanja
					from mataanggaran_m ma
					inner join strukrealisasi_t sr on ma.id=sr.objectmataanggaranfk
					where sr.kdprofile = 30 and sr.statusenabled = true
					and sr.status = 'Sudah Diverifikasi'
                    $qtahun
					group by ma.kodemataanggaran, ma.namamataanggaran
				) as x on x.kodemataanggaran = ma.kodemataanggaran
				inner join (
					select kodemataanggaran, namamataanggaran, sum(jumlah) jumlah
					from(
						select ma.kodemataanggaran, ma.namamataanggaran, pj.jumlah panjar, coalesce(sum(sr.totalbelanja),0) totalbelanja,  coalesce(pj.jumlah - coalesce(sum(sr.totalbelanja),0), 0) as jumlah
						from mataanggaran_m ma
						left join panjar_t pj on ma.id=pj.objectmataanggaranfk and pj.kdprofile = 30 and pj.statusenabled = true
						left join strukrealisasi_t sr on sr.objectpanjarfk = pj.norec and sr.kdprofile = 30 and sr.statusenabled = true
						and sr.status = 'Sudah Diverifikasi'
                        $qtahun
						group by ma.kodemataanggaran, ma.namamataanggaran, pj.jumlah
					) as s group by kodemataanggaran, namamataanggaran
				) as y on y.kodemataanggaran = ma.kodemataanggaran
        where ma.kdprofile = 30 and ma.statusenabled = true
        and kb.kdprofile = 30 and kb.statusenabled = true
        and ka.kdprofile = 30 and ka.statusenabled = true
        $qasalproduk
        $qtahunka
        group by ma.kodemataanggaran, ma.namamataanggaran, x.totalbelanja, y.jumlah
        "));

        $pageWidth = 950;
        //return $this->respond($result);
        return view('report.keuangan.perrekening',compact('data', 'pageWidth', 'tahun'));
    }

    public function CetakRK(Request $request){
        $tahunjudul = $request['tahun'];
        $tanggalcetak = $this->tanggal_indonesia(date('Y-m-d',strtotime($request['tglcetak'])));

        $bulan = $request['bulan'];

        $periode = '';
        if($bulan == '01'){
            $periode = 'JANUARI';
        }
        else if($bulan == '02'){
            $periode = 'FEBRUARI';
        }
        else if($bulan == '03'){
            $periode = 'MARET';
        }
        else if($bulan == '04'){
            $periode = 'APRIL';
        }
        else if($bulan == '05'){
            $periode = 'MEI';
        }
        else if($bulan == '06'){
            $periode = 'JUNI';
        }
        else if($bulan == '07'){
            $periode = 'JULI';
        }
        else if($bulan == '08'){
            $periode = 'AGUSTUS';
        }
        else if($bulan == '09'){
            $periode = 'SEPTEMBER';
        }
        else if($bulan == '10'){
            $periode = 'OKTOBER';
        }
        else if($bulan == '11'){
            $periode = 'NOVEMBER';
        }
        else if($bulan == '12'){
            $periode = 'DESEMBER';
        }

        $lalu = DB::select(DB::raw("SELECT extract('month' from(date '$tahunjudul-$bulan-01' - interval '1 month')) as bulan;"));

        $bulanlalu = $lalu[0]->bulan;

        $subsubkegiatan = '';
        $subsubkegiatankm = '';
        if(isset($request['idsubsubkegiatan']) && $request['idsubsubkegiatan'] != '' && $request['idsubsubkegiatan'] != null){
            $subsubkegiatan = "and ka.id = ".$request['idsubsubkegiatan'];
            $subsubkegiatankm = "and km.id = ".$request['idsubsubkegiatan'];
        }

        $mataanggaran = '';
        if(isset($request['idmataanggaran']) && $request['idmataanggaran'] != '' && $request['idmataanggaran'] != null){
            $mataanggaran = "and ma.id = ".$request['idmataanggaran'];
        }

        $data = DB::select(DB::raw("
        select div, kode, keterangan, sum(jumlahanggaran) jumlahanggaran, sum(jumlahbulanlalu) jumlahbulanlalu, sum(jumlahbulanini) jumlahbulanini
        from(
            select kode div, kode, keterangan, jumlahanggaran, sum(jumlahbulanlalu) jumlahbulanlalu, sum(jumlahbulanini) jumlahbulanini
            from(
                select ka.kode, ka.keterangan, sum(kb.subtotal) jumlahanggaran,
                case when x.bulan = '$bulanlalu' then x.totalbelanja else 0 end as jumlahbulanlalu,
                case when x.bulan = '$bulan' then x.totalbelanja else 0 end as jumlahbulanini
                from mataanggaran_m ma
                inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                inner join (
                    select km.kode, extract(month from sr.tglrealisasi) bulan, ma.kodemataanggaran, ma.namamataanggaran, sum(sr.totalbelanja) totalbelanja
                    from mataanggaran_m ma
                    inner join strukrealisasi_t sr on ma.id=sr.objectmataanggaranfk
                    INNER JOIN kegiatananggaran_m km on km.id=sr.objectkegiatanfk
                    where sr.kdprofile = 30 and sr.statusenabled = true
                    and sr.status = 'Sudah Diverifikasi'
                    and extract(year from sr.tglrealisasi) = '$tahunjudul'
                    and extract(month from sr.tglrealisasi) in('$bulanlalu', '$bulan')
                    $subsubkegiatankm
                    $mataanggaran
                    group by km.kode, ma.kodemataanggaran, ma.namamataanggaran, extract(month from sr.tglrealisasi)
                ) as x on x.kodemataanggaran = ma.kodemataanggaran and x.kode = ka.kode
                where ma.kdprofile = 30 and ma.statusenabled = true
                and kb.kdprofile = 30 and kb.statusenabled = true
                and ka.kdprofile = 30 and ka.statusenabled = true
                --and kb.objectasalprodukfk = 15
                and ka.tahun = '$tahunjudul'
                $subsubkegiatan
                $mataanggaran
                group by ka.kode, ka.keterangan, x.totalbelanja, x.bulan
            ) as b
            group by div, kode, keterangan, jumlahanggaran
        ) as j
        group by div, kode, keterangan

        union all

        select div, kode, keterangan, sum(jumlahanggaran) jumlahanggaran, sum(jumlahbulanlalu) jumlahbulanlalu, sum(jumlahbulanini) jumlahbulanini
        from(
            select kode div, kode, keterangan, jumlahanggaran, sum(jumlahbulanlalu) jumlahbulanlalu, sum(jumlahbulanini) jumlahbulanini
            from(
                select dp0.kode, dp0.keterangan, sum(kb.subtotal) jumlahanggaran,
                case when x.bulan = '$bulanlalu' then x.totalbelanja else 0 end as jumlahbulanlalu,
                case when x.bulan = '$bulan' then x.totalbelanja else 0 end as jumlahbulanini
                from mataanggaran_m ma
                inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                inner join kegiatananggaran_m as dp0 on ka.kode ilike dp0.kode || '%' and dp0.div = 3
                inner join (
                    select km.kode, extract(month from sr.tglrealisasi) bulan, ma.kodemataanggaran, ma.namamataanggaran, sum(sr.totalbelanja) totalbelanja
                    from mataanggaran_m ma
                    inner join strukrealisasi_t sr on ma.id=sr.objectmataanggaranfk
                    INNER JOIN kegiatananggaran_m km on km.id=sr.objectkegiatanfk
                    where sr.kdprofile = 30 and sr.statusenabled = true
                    and sr.status = 'Sudah Diverifikasi'
                    and extract(year from sr.tglrealisasi) = '$tahunjudul'
                    and extract(month from sr.tglrealisasi) in('$bulanlalu', '$bulan')
                    $subsubkegiatankm
                    $mataanggaran
                    group by km.kode, ma.kodemataanggaran, ma.namamataanggaran, extract(month from sr.tglrealisasi)
                ) as x on x.kodemataanggaran = ma.kodemataanggaran and x.kode = ka.kode
                where ma.kdprofile = 30 and ma.statusenabled = true
                and kb.kdprofile = 30 and kb.statusenabled = true
                and ka.kdprofile = 30 and ka.statusenabled = true
                and dp0.kdprofile = 30 and dp0.statusenabled = true
                --and kb.objectasalprodukfk = 15
                and ka.tahun = '$tahunjudul'
                $subsubkegiatan
                $mataanggaran
                group by dp0.kode, dp0.keterangan, x.totalbelanja, x.bulan
            ) as b
            group by div, kode, keterangan, jumlahanggaran
        ) as i
        group by div, kode, keterangan

        union all

        select div, kode, keterangan, sum(jumlahanggaran) jumlahanggaran, sum(jumlahbulanlalu) jumlahbulanlalu, sum(jumlahbulanini) jumlahbulanini
        from(
            select kode div, kode, keterangan, jumlahanggaran, sum(jumlahbulanlalu) jumlahbulanlalu, sum(jumlahbulanini) jumlahbulanini
            from(
                select ka.kode || '.' ||  ma1.kodemataanggaran kode,
                ma1.namamataanggaran keterangan, sum(kb.subtotal) jumlahanggaran,
                case when x.bulan = '$bulanlalu' then x.totalbelanja else 0 end as jumlahbulanlalu,
                case when x.bulan = '$bulan' then x.totalbelanja else 0 end as jumlahbulanini
                from mataanggaran_m ma
                inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                inner join kegiatananggaran_m as dp0 on ka.kode ilike dp0.kode || '%' and dp0.div = 3
                inner JOIN mataanggaran_m ma4 on ma4.id=kb.objectmataanggaranfk
                inner JOIN mataanggaran_m ma1 on ma4.kodemataanggaran ilike '%' || ma1.kodemataanggaran || '%'
                and ma1.kodemataanggaran in('I', 'II', 'III')
                inner join mataanggaran_m ma2 on ma4.kodemataanggaran ilike ma2.kodemataanggaran || '%'
                and 
                case 
                    when ma2.kodemataanggaran ilike 'I.%' then char_length(ma2.kodemataanggaran) = 3
                    when ma2.kodemataanggaran ilike 'II.%' then char_length(ma2.kodemataanggaran) = 4
                    when ma2.kodemataanggaran ilike 'III.%' then char_length(ma2.kodemataanggaran) = 5
                end
                inner join mataanggaran_m ma3 on ma4.kodemataanggaran ilike ma3.kodemataanggaran || '%'
                and 
                case 
                    when ma3.kodemataanggaran ilike 'I.%' then char_length(ma3.kodemataanggaran) = 5
                    when ma3.kodemataanggaran ilike 'II.%' then char_length(ma3.kodemataanggaran) = 4
                    when ma3.kodemataanggaran ilike 'III.%' then char_length(ma3.kodemataanggaran) = 5
                end
                inner join (
                    select km.kode, extract(month from sr.tglrealisasi) bulan, ma.kodemataanggaran, ma.namamataanggaran, sum(sr.totalbelanja) totalbelanja
                    from mataanggaran_m ma
                    inner join strukrealisasi_t sr on ma.id=sr.objectmataanggaranfk
                    INNER JOIN kegiatananggaran_m km on km.id=sr.objectkegiatanfk
                    where sr.kdprofile = 30 and sr.statusenabled = true
                    and sr.status = 'Sudah Diverifikasi'
                    and extract(year from sr.tglrealisasi) = '$tahunjudul'
                    and extract(month from sr.tglrealisasi) in('$bulanlalu', '$bulan')
                    $subsubkegiatankm
                    $mataanggaran
                    group by km.kode, ma.kodemataanggaran, ma.namamataanggaran, extract(month from sr.tglrealisasi)
                ) as x on x.kodemataanggaran = ma.kodemataanggaran and x.kode = ka.kode
                where ma.kdprofile = 30 and ma.statusenabled = true
                and ma1.kdprofile = 30 and ma1.statusenabled = true
                and kb.kdprofile = 30 and kb.statusenabled = true
                and ka.kdprofile = 30 and ka.statusenabled = true
                and dp0.kdprofile = 30 and dp0.statusenabled = true
                --and kb.objectasalprodukfk = 15
                and ka.tahun = '$tahunjudul'
                $subsubkegiatan
                $mataanggaran
                group by ka.kode || '.' ||  ma1.kodemataanggaran, 
                ma1.namamataanggaran, x.totalbelanja, x.bulan
            ) as b
            group by div, kode, keterangan, jumlahanggaran
        ) as f
        group by div, kode, keterangan

        union all

        select div, kode, keterangan, sum(jumlahanggaran) jumlahanggaran, sum(jumlahbulanlalu) jumlahbulanlalu, sum(jumlahbulanini) jumlahbulanini
        from(
            select div, kode, keterangan, jumlahanggaran, sum(jumlahbulanlalu) jumlahbulanlalu, sum(jumlahbulanini) jumlahbulanini
            from(
                select ka.kode || '.' ||  ma2.kodemataanggaran div, ka.kode || '.' ||  right(ma2.kodemataanggaran, 1) kode,
                ma2.namamataanggaran keterangan, sum(kb.subtotal) jumlahanggaran,
                case when x.bulan = '$bulanlalu' then x.totalbelanja else 0 end as jumlahbulanlalu,
                case when x.bulan = '$bulan' then x.totalbelanja else 0 end as jumlahbulanini
                from mataanggaran_m ma
                inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                inner join kegiatananggaran_m as dp0 on ka.kode ilike dp0.kode || '%' and dp0.div = 3
                inner JOIN mataanggaran_m ma4 on ma4.id=kb.objectmataanggaranfk
                inner JOIN mataanggaran_m ma1 on ma4.kodemataanggaran ilike '%' || ma1.kodemataanggaran || '%'
                and ma1.kodemataanggaran in('I', 'II', 'III')
                inner join mataanggaran_m ma2 on ma4.kodemataanggaran ilike ma2.kodemataanggaran || '%'
                and 
                case 
                    when ma2.kodemataanggaran ilike 'I.%' then char_length(ma2.kodemataanggaran) = 3
                    when ma2.kodemataanggaran ilike 'II.%' then char_length(ma2.kodemataanggaran) = 4
                    when ma2.kodemataanggaran ilike 'III.%' then char_length(ma2.kodemataanggaran) = 5
                end
                inner join mataanggaran_m ma3 on ma4.kodemataanggaran ilike ma3.kodemataanggaran || '%'
                and 
                case 
                    when ma3.kodemataanggaran ilike 'I.%' then char_length(ma3.kodemataanggaran) = 5
                    when ma3.kodemataanggaran ilike 'II.%' then char_length(ma3.kodemataanggaran) = 4
                    when ma3.kodemataanggaran ilike 'III.%' then char_length(ma3.kodemataanggaran) = 5
                end
                inner join (
                    select km.kode, extract(month from sr.tglrealisasi) bulan, ma.kodemataanggaran, ma.namamataanggaran, sum(sr.totalbelanja) totalbelanja
                    from mataanggaran_m ma
                    inner join strukrealisasi_t sr on ma.id=sr.objectmataanggaranfk
                    INNER JOIN kegiatananggaran_m km on km.id=sr.objectkegiatanfk
                    where sr.kdprofile = 30 and sr.statusenabled = true
                    and sr.status = 'Sudah Diverifikasi'
                    and extract(year from sr.tglrealisasi) = '$tahunjudul'
                    and extract(month from sr.tglrealisasi) in('$bulanlalu', '$bulan')
                    $subsubkegiatankm
                    $mataanggaran
                    group by km.kode, ma.kodemataanggaran, ma.namamataanggaran, extract(month from sr.tglrealisasi)
                ) as x on x.kodemataanggaran = ma.kodemataanggaran and x.kode = ka.kode
                where ma.kdprofile = 30 and ma.statusenabled = true
                and ma1.kdprofile = 30 and ma1.statusenabled = true
                and kb.kdprofile = 30 and kb.statusenabled = true
                and ka.kdprofile = 30 and ka.statusenabled = true
                and dp0.kdprofile = 30 and dp0.statusenabled = true
                --and kb.objectasalprodukfk = 15
                and ka.tahun = '$tahunjudul'
                $subsubkegiatan
                $mataanggaran
                group by ka.kode || '.' ||  ma2.kodemataanggaran, ka.kode || '.' ||  right(ma2.kodemataanggaran, 1), 
                ma2.namamataanggaran, x.totalbelanja, x.bulan
            ) as b
            group by div, kode, keterangan, jumlahanggaran
        ) as e
        group by div, kode, keterangan

        union all

        select div, kode, keterangan, sum(jumlahanggaran) jumlahanggaran, sum(jumlahbulanlalu) jumlahbulanlalu, sum(jumlahbulanini) jumlahbulanini
        from(
            select div, kode, keterangan, jumlahanggaran, sum(jumlahbulanlalu) jumlahbulanlalu, sum(jumlahbulanini) jumlahbulanini
            from(
                select ka.kode || '.' ||  ma3.kodemataanggaran div, ka.kode || '.' ||  right(ma3.kodemataanggaran, 1) kode,
                ma3.namamataanggaran keterangan, sum(kb.subtotal) jumlahanggaran,
                case when x.bulan = '$bulanlalu' then x.totalbelanja else 0 end as jumlahbulanlalu,
                case when x.bulan = '$bulan' then x.totalbelanja else 0 end as jumlahbulanini
                from mataanggaran_m ma
                inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                inner join kegiatananggaran_m as dp0 on ka.kode ilike dp0.kode || '%' and dp0.div = 3
                inner JOIN mataanggaran_m ma4 on ma4.id=kb.objectmataanggaranfk
                inner JOIN mataanggaran_m ma1 on ma4.kodemataanggaran ilike '%' || ma1.kodemataanggaran || '%'
                and ma1.kodemataanggaran in('I', 'II', 'III')
                inner join mataanggaran_m ma2 on ma4.kodemataanggaran ilike ma2.kodemataanggaran || '%'
                and 
                case 
                    when ma2.kodemataanggaran ilike 'I.%' then char_length(ma2.kodemataanggaran) = 3
                    when ma2.kodemataanggaran ilike 'II.%' then char_length(ma2.kodemataanggaran) = 4
                    when ma2.kodemataanggaran ilike 'III.%' then char_length(ma2.kodemataanggaran) = 5
                end
                inner join mataanggaran_m ma3 on ma4.kodemataanggaran ilike ma3.kodemataanggaran || '%'
                and 
                case 
                    when ma3.kodemataanggaran ilike 'I.%' then char_length(ma3.kodemataanggaran) = 5
                    when ma3.kodemataanggaran ilike 'II.%' then char_length(ma3.kodemataanggaran) = 4
                    when ma3.kodemataanggaran ilike 'III.%' then char_length(ma3.kodemataanggaran) = 5
                end
                inner join (
                    select km.kode, extract(month from sr.tglrealisasi) bulan, ma.kodemataanggaran, ma.namamataanggaran, sum(sr.totalbelanja) totalbelanja
                    from mataanggaran_m ma
                    inner join strukrealisasi_t sr on ma.id=sr.objectmataanggaranfk
                    INNER JOIN kegiatananggaran_m km on km.id=sr.objectkegiatanfk
                    where sr.kdprofile = 30 and sr.statusenabled = true
                    and sr.status = 'Sudah Diverifikasi'
                    and extract(year from sr.tglrealisasi) = '$tahunjudul'
                    and extract(month from sr.tglrealisasi) in('$bulanlalu', '$bulan')
                    $subsubkegiatankm
                    $mataanggaran
                    group by km.kode, ma.kodemataanggaran, ma.namamataanggaran, extract(month from sr.tglrealisasi)
                ) as x on x.kodemataanggaran = ma.kodemataanggaran and x.kode = ka.kode
                where ma.kdprofile = 30 and ma.statusenabled = true
                and ma1.kdprofile = 30 and ma1.statusenabled = true
                and kb.kdprofile = 30 and kb.statusenabled = true
                and ka.kdprofile = 30 and ka.statusenabled = true
                and dp0.kdprofile = 30 and dp0.statusenabled = true
                --and kb.objectasalprodukfk = 15
                and ka.tahun = '$tahunjudul'
                $subsubkegiatan
                $mataanggaran
                group by ka.kode || '.' ||  ma3.kodemataanggaran, ka.kode || '.' ||  right(ma3.kodemataanggaran, 1), 
                ma3.namamataanggaran, x.totalbelanja, x.bulan
            ) as b
            group by div, kode, keterangan, jumlahanggaran
        ) as g
        group by div, kode, keterangan

        union all

        select div, kode, keterangan, sum(jumlahanggaran) jumlahanggaran, sum(jumlahbulanlalu) jumlahbulanlalu, sum(jumlahbulanini) jumlahbulanini
        from(
            select div, kode, keterangan, jumlahanggaran, sum(jumlahbulanlalu) jumlahbulanlalu, sum(jumlahbulanini) jumlahbulanini
            from(
                select ka.kode || '.' ||  ma4.kodemataanggaran div,
                case
                    when ma4.kodemataanggaran ilike 'I.%' or ma4.kodemataanggaran ilike 'III.%' and length(ma4.kodemataanggaran) = 9 then ka.kode || '.' || right(ma4.kodemataanggaran, 3)
                    when ma4.kodemataanggaran ilike 'I.%' or ma4.kodemataanggaran ilike 'III.%' and length(ma4.kodemataanggaran) = 10 then ka.kode || '.' || right(ma4.kodemataanggaran,4)
                    when ma4.kodemataanggaran ilike 'II.%' and length(ma4.kodemataanggaran) = 8 then ka.kode || '.' || right(ma4.kodemataanggaran, 3)
                    when ma4.kodemataanggaran ilike 'II.%' and length(ma4.kodemataanggaran) = 9 then ka.kode || '.' || right(ma4.kodemataanggaran, 4)
                end as kode,
                ma4.namamataanggaran keterangan, sum(kb.subtotal) jumlahanggaran,
                case when x.bulan = '$bulanlalu' then x.totalbelanja else 0 end as jumlahbulanlalu,
                case when x.bulan = '$bulan' then x.totalbelanja else 0 end as jumlahbulanini
                from mataanggaran_m ma
                inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                inner join kegiatananggaran_m as dp0 on ka.kode ilike dp0.kode || '%' and dp0.div = 3
                inner JOIN mataanggaran_m ma4 on ma4.id=kb.objectmataanggaranfk
                inner JOIN mataanggaran_m ma1 on ma4.kodemataanggaran ilike '%' || ma1.kodemataanggaran || '%'
                and ma1.kodemataanggaran in('I', 'II', 'III')
                inner join mataanggaran_m ma2 on ma4.kodemataanggaran ilike ma2.kodemataanggaran || '%'
                and 
                case 
                    when ma2.kodemataanggaran ilike 'I.%' then char_length(ma2.kodemataanggaran) = 3
                    when ma2.kodemataanggaran ilike 'II.%' then char_length(ma2.kodemataanggaran) = 4
                    when ma2.kodemataanggaran ilike 'III.%' then char_length(ma2.kodemataanggaran) = 5
                end
                inner join mataanggaran_m ma3 on ma4.kodemataanggaran ilike ma3.kodemataanggaran || '%'
                and 
                case 
                    when ma3.kodemataanggaran ilike 'I.%' then char_length(ma3.kodemataanggaran) = 5
                    when ma3.kodemataanggaran ilike 'II.%' then char_length(ma3.kodemataanggaran) = 4
                    when ma3.kodemataanggaran ilike 'III.%' then char_length(ma3.kodemataanggaran) = 5
                end
                inner join (
                    select km.kode, extract(month from sr.tglrealisasi) bulan, ma.kodemataanggaran, ma.namamataanggaran, sum(sr.totalbelanja) totalbelanja
                    from mataanggaran_m ma
                    inner join strukrealisasi_t sr on ma.id=sr.objectmataanggaranfk
                    INNER JOIN kegiatananggaran_m km on km.id=sr.objectkegiatanfk
                    where sr.kdprofile = 30 and sr.statusenabled = true
                    and sr.status = 'Sudah Diverifikasi'
                    and extract(year from sr.tglrealisasi) = '$tahunjudul'
                    and extract(month from sr.tglrealisasi) in('$bulanlalu', '$bulan')
                    $subsubkegiatankm
                    $mataanggaran
                    group by km.kode, ma.kodemataanggaran, ma.namamataanggaran, extract(month from sr.tglrealisasi)
                ) as x on x.kodemataanggaran = ma.kodemataanggaran and x.kode = ka.kode
                where ma.kdprofile = 30 and ma.statusenabled = true
                and ma1.kdprofile = 30 and ma1.statusenabled = true
                and kb.kdprofile = 30 and kb.statusenabled = true
                and ka.kdprofile = 30 and ka.statusenabled = true
                and dp0.kdprofile = 30 and dp0.statusenabled = true
                --and kb.objectasalprodukfk = 15
                and ka.tahun = '$tahunjudul'
                $subsubkegiatan
                $mataanggaran
                group by ka.kode || '.' ||  ma4.kodemataanggaran, ka.kode, ka.kode || '.' || right(ma4.kodemataanggaran, 3), 
                ma4.kodemataanggaran, ma4.namamataanggaran, x.totalbelanja, x.bulan
            ) as b
            group by div, kode, keterangan, jumlahanggaran
        ) as h
        group by div, kode, keterangan

        order by div"));

        $pageWidth = 950;
        //return $this->respond($result);
        return view('report.keuangan.cetakrk',compact('data', 'pageWidth', 'tahunjudul', 'tanggalcetak', 'periode'));
    }

    public function CetakSPJMonev(Request $request){
        $tahun = $request['tahun'];

        $qtahun  = '';
        $qtahunka  = '';
        if (isset($request['tahun']) && $request['tahun'] != "" && $request['tahun'] != "undefined") {
            $qtahun =  " and extract(year from sr.tglrealisasi) =  '" . $request['tahun']."'";
            $qtahunka =  " and ka.tahun =  '" . $request['tahun']."'";
        }

        $qsubsubkegiatan  = '';
        $qsubsubkegiatansr  = '';
        if (isset($request['subsubkegiatan']) && $request['subsubkegiatan'] != "" && $request['subsubkegiatan'] != "undefined") {
            $qsubsubkegiatan =  " and ka.id =  '" . $request['subsubkegiatan']."'";
            $qsubsubkegiatansr =  " and sr.objectkegiatanfk =  '" . $request['subsubkegiatan']."'";
        }

        $subk = $request['subkegiatan'];
        $subsubk = $request['subsubkegiatan'];

        $subsubkegiatan = DB::select(DB::raw("select * from kegiatananggaran_m where id = ".$subsubk));

        $subkegiatan = DB::select(DB::raw("select * from kegiatananggaran_m where id = ".$subk));

        $data = DB::select(DB::raw("select map3.kode || '.' || map2.kode || '.' || map1.kode || '.' || map.kode kodemataanggaran, 
        map.mataanggaranpermen namamataanggaran, sum(kb.subtotal) jumlahanggaran,
                x.totalbelanja jumlahspj, y.jumlah jumlahpanjar,
                x.totalbelanja + y.jumlah as subtotal, round(cast(((x.totalbelanja + y.jumlah)/sum(kb.subtotal))*100 as numeric), 2) as persentase,  
                sum(kb.subtotal) - (coalesce(x.totalbelanja,0) + coalesce(y.jumlah,0)) sisaanggaran
                from mataanggaran_m ma
                inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                        left join (
                            select ma.kodemataanggaran, ma.namamataanggaran, sum(sr.totalbelanja) totalbelanja
                            from mataanggaran_m ma
                            inner join strukrealisasi_t sr on ma.id=sr.objectmataanggaranfk
                            where sr.kdprofile = 30 and sr.statusenabled = true
                            $qtahun
                            $qsubsubkegiatansr
                            group by ma.kodemataanggaran, ma.namamataanggaran
                        ) as x on x.kodemataanggaran = ma.kodemataanggaran
                        left join (
                            select kodemataanggaran, namamataanggaran, sum(jumlah) jumlah
                            from(
                                select ma.kodemataanggaran, ma.namamataanggaran, pj.jumlah panjar, coalesce(sum(sr.totalbelanja),0) totalbelanja,  coalesce(pj.jumlah - coalesce(sum(sr.totalbelanja),0), 0) as jumlah
                                from mataanggaran_m ma
                                left join panjar_t pj on ma.id=pj.objectmataanggaranfk and pj.kdprofile = 30 and pj.statusenabled = true
                                left join strukrealisasi_t sr on sr.objectpanjarfk = pj.norec and sr.kdprofile = 30 and sr.statusenabled = true
                                $qtahun
                                $qsubsubkegiatansr
                                group by ma.kodemataanggaran, ma.namamataanggaran, pj.jumlah
                            ) as s group by kodemataanggaran, namamataanggaran
                        ) as y on y.kodemataanggaran = ma.kodemataanggaran
                        inner join mataanggaranpermen_m map on map.id = ma.mataanggaranpermenfk
                        inner join mataanggaranpermen_m map1 on map1.id = map.mataanggaranpermenfk and map1.div = 4
                        inner join mataanggaranpermen_m map2 on map2.id = map1.mataanggaranpermenfk and map2.div = 3
                        inner join mataanggaranpermen_m map3 on map3.id = map2.mataanggaranpermenfk and map3.div = 2
                        where ma.kdprofile = 30 and ma.statusenabled = true
                        and kb.kdprofile = 30 and kb.statusenabled = true
                        and map.kdprofile = 30 and map.statusenabled = true
                        and ka.kdprofile = 30 and ka.statusenabled = true
                        $qsubsubkegiatan
                        $qtahunka
                group by map3.kode || '.' || map2.kode || '.' || map1.kode || '.' || map.kode, map.mataanggaranpermen, x.totalbelanja, y.jumlah        
        "));

        $pageWidth = 1200;
        //return $this->respond($result);
        return view('report.spj.cetakspjmonev',compact('data', 'pageWidth', 'tahun', 'subkegiatan', 'subsubkegiatan'));
    }

    public function CetakKonsolidasiPermen(Request $request){
        $tahun = $request['tahun'];

        $qtahunka  = '';
        if (isset($request['tahun']) && $request['tahun'] != "" && $request['tahun'] != "undefined") {
            $qtahunka =  " and ka.tahun =  '" . $request['tahun']."'";
        }

        $qsubkegiatan  = '';
        if (isset($request['subkegiatan']) && $request['subkegiatan'] != "" && $request['subkegiatan'] != "undefined") {
            $qsubkegiatan =  " and dp0.id =  '" . $request['subkegiatan']."'";
        }

        $qtahap  = '';
        if (isset($request['tahap']) && $request['tahap'] != "" && $request['tahap'] != "undefined") {
            $qtahap =  " and kb.objecttahapfk =  '" . $request['tahap']."'";
        }

        $subk = $request['subkegiatan'];
        $thp = $request['tahap'];

        $tahap = DB::select(DB::raw("select * from tahapanggaran_m where id = ".$thp));

        $subkegiatan = DB::select(DB::raw("select * from kegiatananggaran_m where id = ".$subk));

        $data = DB::select(DB::raw("select kodemataanggaran, namamataanggaran, sum(jumlahanggaran) jumlahanggaran, sum(jumlahjan) jumlahjan, sum(jumlahfeb) jumlahfeb,
        sum(jumlahmar) jumlahmar, sum(jumlahapr) jumlahapr, sum(jumlahmei) jumlahmei, sum(jumlahjun) jumlahjun,
        sum(jumlahjul) jumlahjul, sum(jumlahagt) jumlahagt, sum(jumlahsep) jumlahsep, sum(jumlahokt) jumlahokt,
        sum(jumlahnov) jumlahnov, sum(jumlahdes) jumlahdes
        from(
            select kodemataanggaran, namamataanggaran, jumlahanggaran, sum(jumlahjan) jumlahjan, sum(jumlahfeb) jumlahfeb,
            sum(jumlahmar) jumlahmar, sum(jumlahapr) jumlahapr, sum(jumlahmei) jumlahmei, sum(jumlahjun) jumlahjun,
            sum(jumlahjul) jumlahjul, sum(jumlahagt) jumlahagt, sum(jumlahsep) jumlahsep, sum(jumlahokt) jumlahokt,
            sum(jumlahnov) jumlahnov, sum(jumlahdes) jumlahdes
            from(
                select map3.kode || '.' || map2.kode || '.' || map1.kode || '.' || map.kode kodemataanggaran,
                map.mataanggaranpermen namamataanggaran, sum(kb.subtotal) jumlahanggaran,
                case when akb.bulanint = 1 then sum(akb.nilai::float8) else 0 end as jumlahjan,
                case when akb.bulanint = 2 then sum(akb.nilai::float8) else 0 end as jumlahfeb,
                case when akb.bulanint = 3 then sum(akb.nilai::float8) else 0 end as jumlahmar,
                case when akb.bulanint = 4 then sum(akb.nilai::float8) else 0 end as jumlahapr,
                case when akb.bulanint = 5 then sum(akb.nilai::float8) else 0 end as jumlahmei,
                case when akb.bulanint = 6 then sum(akb.nilai::float8) else 0 end as jumlahjun,
                case when akb.bulanint = 7 then sum(akb.nilai::float8) else 0 end as jumlahjul,
                case when akb.bulanint = 8 then sum(akb.nilai::float8) else 0 end as jumlahagt,
                case when akb.bulanint = 9 then sum(akb.nilai::float8) else 0 end as jumlahsep,
                case when akb.bulanint = 10 then sum(akb.nilai::float8) else 0 end as jumlahokt,
                case when akb.bulanint = 11 then sum(akb.nilai::float8) else 0 end as jumlahnov,
                case when akb.bulanint = 12 then sum(akb.nilai::float8) else 0 end as jumlahdes
                from mataanggaran_m ma
                inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                inner join kegiatananggaran_m as dp0 on ka.kode ilike dp0.kode || '%' and dp0.div = 3
                inner join mataanggaranpermen_m map on map.id = ma.mataanggaranpermenfk
                inner join mataanggaranpermen_m map1 on map1.id = map.mataanggaranpermenfk and map1.div = 4
                inner join mataanggaranpermen_m map2 on map2.id = map1.mataanggaranpermenfk and map2.div = 3
                inner join mataanggaranpermen_m map3 on map3.id = map2.mataanggaranpermenfk and map3.div = 2
                left join alokasiketeranganbelanja_t akb on akb.keteranganbelanjafk = kb.norec
                and akb.kdprofile = 30 and akb.statusenabled = true
                where ma.kdprofile = 30 and ma.statusenabled = true
                and kb.kdprofile = 30 and kb.statusenabled = true
                and ka.kdprofile = 30 and ka.statusenabled = true
                and map.kdprofile = 30 and map.statusenabled = true
                and dp0.kdprofile = 30 and dp0.statusenabled = true 
                $qtahunka
                $qsubkegiatan
                $qtahap
                group by map3.kode || '.' || map2.kode || '.' || map1.kode || '.' || map.kode, map.mataanggaranpermen,
                akb.bulanint
            ) as x group by kodemataanggaran, namamataanggaran, jumlahanggaran        
        ) as y group by kodemataanggaran, namamataanggaran
        "));

        $pageWidth = 1200;
        //return $this->respond($result);
        return view('report.spj.cetakkonsolidasipermen',compact('data', 'pageWidth', 'tahun', 'subkegiatan', 'tahap'));
    }

    public function CetakAngkasJadwal(Request $request){
        $tahun = $request['tahun'];

        $qtahun  = '';
        if (isset($request['tahun']) && $request['tahun'] != "" && $request['tahun'] != "undefined") {
            $qtahun =  " and ka.tahun =  '" . $request['tahun']."'";
        }

        $qsubsubkegiatan  = '';
        if (isset($request['subsubkegiatan']) && $request['subsubkegiatan'] != "" && $request['subsubkegiatan'] != "undefined") {
            $qsubsubkegiatan =  " and ka.id =  '" . $request['subsubkegiatan']."'";
        }

        $qtahap  = '';
        if (isset($request['tahap']) && $request['tahap'] != "" && $request['tahap'] != "undefined") {
            $qtahap =  " and kb.objecttahapfk =  '" . $request['tahap']."'";
        }

        $subk = $request['subkegiatan'];
        $subsubk = $request['subsubkegiatan'];
        $thp = $request['tahap'];

        $tahap = DB::select(DB::raw("select * from tahapanggaran_m where id = ".$thp));

        $subkegiatan = DB::select(DB::raw("select * from kegiatananggaran_m where id = ".$subk));

        $subsubkegiatan = DB::select(DB::raw("select * from kegiatananggaran_m where id = ".$subsubk));

        $data = DB::select(DB::raw("select DENSE_RANK ( ) OVER ( order by kodemataanggaran ) AS nourut, kodefix, kodemataanggaran, namamataanggaran, sum(jumlahjan) jumlahjan, sum(jumlahfeb) jumlahfeb,
        sum(jumlahmar) jumlahmar, sum(jumlahapr) jumlahapr, sum(jumlahmei) jumlahmei, sum(jumlahjun) jumlahjun,
        sum(jumlahjul) jumlahjul, sum(jumlahagt) jumlahagt, sum(jumlahsep) jumlahsep, sum(jumlahokt) jumlahokt,
        sum(jumlahnov) jumlahnov, sum(jumlahdes) jumlahdes,
        sum(jumlahjan) + sum(jumlahfeb) + sum(jumlahmar) + sum(jumlahapr) + sum(jumlahmei) + sum(jumlahjun) +
        sum(jumlahjul) + sum(jumlahagt) + sum(jumlahsep) + sum(jumlahokt) + sum(jumlahnov) + sum(jumlahdes) subtotal,
          '' asalproduk
        from(
            select 
            case 
                when CHAR_LENGTH(right(ma.kodemataanggaran, 4)) - CHAR_LENGTH( REPLACE ( right(ma.kodemataanggaran, 4), '.', '1234') ) = -6 then right(ma.kodemataanggaran, 3)
                when CHAR_LENGTH(right(ma.kodemataanggaran, 4)) - CHAR_LENGTH( REPLACE ( right(ma.kodemataanggaran, 4), '.', '1234') ) = -3 then right(ma.kodemataanggaran, 4)
            end as kodefix,
            ma.kodemataanggaran, ma.namamataanggaran,
            case when akb.bulanint = 1 then sum(akb.nilai::float8) else 0 end as jumlahjan,
            case when akb.bulanint = 2 then sum(akb.nilai::float8) else 0 end as jumlahfeb,
            case when akb.bulanint = 3 then sum(akb.nilai::float8) else 0 end as jumlahmar,
            case when akb.bulanint = 4 then sum(akb.nilai::float8) else 0 end as jumlahapr,
            case when akb.bulanint = 5 then sum(akb.nilai::float8) else 0 end as jumlahmei,
            case when akb.bulanint = 6 then sum(akb.nilai::float8) else 0 end as jumlahjun,
            case when akb.bulanint = 7 then sum(akb.nilai::float8) else 0 end as jumlahjul,
            case when akb.bulanint = 8 then sum(akb.nilai::float8) else 0 end as jumlahagt,
            case when akb.bulanint = 9 then sum(akb.nilai::float8) else 0 end as jumlahsep,
            case when akb.bulanint = 10 then sum(akb.nilai::float8) else 0 end as jumlahokt,
            case when akb.bulanint = 11 then sum(akb.nilai::float8) else 0 end as jumlahnov,
            case when akb.bulanint = 12 then sum(akb.nilai::float8) else 0 end as jumlahdes
            from mataanggaran_m ma
            inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
            INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
            inner join kegiatananggaran_m as dp0 on ka.kode ilike dp0.kode || '%' and dp0.div = 3
            left join alokasiketeranganbelanja_t akb on akb.keteranganbelanjafk = kb.norec
            and akb.kdprofile = 30 and akb.statusenabled = true
            where ma.kdprofile = 30 and ma.statusenabled = true
            and kb.kdprofile = 30 and kb.statusenabled = true
            and ka.kdprofile = 30 and ka.statusenabled = true
            and dp0.kdprofile = 30 and dp0.statusenabled = true
            $qtahun
            $qsubsubkegiatan
            $qtahap
            group by 
            ma.kodemataanggaran, ma.namamataanggaran, akb.bulanint
        ) as x group by kodefix, kodemataanggaran, namamataanggaran
        
        union all
        
        select DENSE_RANK ( ) OVER ( order by kodemataanggaran ) AS nourut, '' kodefix, kodemataanggaran,  keteranganbelanja namamataanggaran, sum(jumlahjan) jumlahjan, sum(jumlahfeb) jumlahfeb,
        sum(jumlahmar) jumlahmar, sum(jumlahapr) jumlahapr, sum(jumlahmei) jumlahmei, sum(jumlahjun) jumlahjun,
        sum(jumlahjul) jumlahjul, sum(jumlahagt) jumlahagt, sum(jumlahsep) jumlahsep, sum(jumlahokt) jumlahokt,
        sum(jumlahnov) jumlahnov, sum(jumlahdes) jumlahdes,
        sum(jumlahjan) + sum(jumlahfeb) + sum(jumlahmar) + sum(jumlahapr) + sum(jumlahmei) + sum(jumlahjun) +
        sum(jumlahjul) + sum(jumlahagt) + sum(jumlahsep) + sum(jumlahokt) + sum(jumlahnov) + sum(jumlahdes) subtotal,
        asalproduk
        from(
            select
            ma.kodemataanggaran, ma.namamataanggaran, kb.norec, kb.keteranganbelanja,
            case when akb.bulanint = 1 then sum(akb.nilai::float8) else 0 end as jumlahjan,
            case when akb.bulanint = 2 then sum(akb.nilai::float8) else 0 end as jumlahfeb,
            case when akb.bulanint = 3 then sum(akb.nilai::float8) else 0 end as jumlahmar,
            case when akb.bulanint = 4 then sum(akb.nilai::float8) else 0 end as jumlahapr,
            case when akb.bulanint = 5 then sum(akb.nilai::float8) else 0 end as jumlahmei,
            case when akb.bulanint = 6 then sum(akb.nilai::float8) else 0 end as jumlahjun,
            case when akb.bulanint = 7 then sum(akb.nilai::float8) else 0 end as jumlahjul,
            case when akb.bulanint = 8 then sum(akb.nilai::float8) else 0 end as jumlahagt,
            case when akb.bulanint = 9 then sum(akb.nilai::float8) else 0 end as jumlahsep,
            case when akb.bulanint = 10 then sum(akb.nilai::float8) else 0 end as jumlahokt,
            case when akb.bulanint = 11 then sum(akb.nilai::float8) else 0 end as jumlahnov,
            case when akb.bulanint = 12 then sum(akb.nilai::float8) else 0 end as jumlahdes,
            ap.asalproduk
            from mataanggaran_m ma
            inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
            INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
            inner join kegiatananggaran_m as dp0 on ka.kode ilike dp0.kode || '%' and dp0.div = 3
            inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
            left join alokasiketeranganbelanja_t akb on akb.keteranganbelanjafk = kb.norec
            and akb.kdprofile = 30 and akb.statusenabled = true
            where ma.kdprofile = 30 and ma.statusenabled = true
            and kb.kdprofile = 30 and kb.statusenabled = true
            and ka.kdprofile = 30 and ka.statusenabled = true
            and dp0.kdprofile = 30 and dp0.statusenabled = true
            $qtahun
            $qsubsubkegiatan
            $qtahap
            group by 
            ma.kodemataanggaran, ma.namamataanggaran, kb.norec, kb.keteranganbelanja, akb.bulanint, ap.asalproduk
        ) as x group by kodemataanggaran, namamataanggaran, norec, keteranganbelanja, asalproduk
        order by nourut, kodefix desc;        
        "));

        $pageWidth = 1200;
        //return $this->respond($result);
        return view('report.spj.cetakangkasjadwal',compact('data', 'pageWidth', 'tahun', 'tahap', 'subkegiatan', 'subsubkegiatan'));
    }

    public function CetakKas(Request $request){
        $tahun = $request['tahun'];

        $qtahap  = '';
        if (isset($request['tahap']) && $request['tahap'] != "" && $request['tahap'] != "undefined") {
            $qtahap =  " and kb.objecttahapfk =  '" . $request['tahap']."'";
        }

        $tahap = DB::select(DB::raw("select * from tahapanggaran_m where id = ". $request['tahap']));

        $data = DB::select(DB::raw("select 'tidak' bold, 'iya' tkode, nourut, kode, keterangan, sum(jumlahanggaran) jumlahanggaran, sum(jumlahjan) jumlahjan, sum(jumlahfeb) jumlahfeb,
        sum(jumlahmar) jumlahmar, sum(jumlahapr) jumlahapr, sum(jumlahmei) jumlahmei, sum(jumlahjun) jumlahjun,
        sum(jumlahjul) jumlahjul, sum(jumlahagt) jumlahagt, sum(jumlahsep) jumlahsep, sum(jumlahokt) jumlahokt,
        sum(jumlahnov) jumlahnov, sum(jumlahdes) jumlahdes,
        sum(jumlahjan) + sum(jumlahfeb) + sum(jumlahmar) + sum(jumlahapr) + sum(jumlahmei) + sum(jumlahjun) +
        sum(jumlahjul) + sum(jumlahagt) + sum(jumlahsep) + sum(jumlahokt) + sum(jumlahnov) + sum(jumlahdes) subtotal
        from(
            select DENSE_RANK ( ) OVER ( order by kode ) AS nourut, kode, keterangan, jumlahanggaran, idap, norec, sum(jumlahjan) jumlahjan, sum(jumlahfeb) jumlahfeb,
            sum(jumlahmar) jumlahmar, sum(jumlahapr) jumlahapr, sum(jumlahmei) jumlahmei, sum(jumlahjun) jumlahjun,
            sum(jumlahjul) jumlahjul, sum(jumlahagt) jumlahagt, sum(jumlahsep) jumlahsep, sum(jumlahokt) jumlahokt,
            sum(jumlahnov) jumlahnov, sum(jumlahdes) jumlahdes,
            sum(jumlahjan) + sum(jumlahfeb) + sum(jumlahmar) + sum(jumlahapr) + sum(jumlahmei) + sum(jumlahjun) +
            sum(jumlahjul) + sum(jumlahagt) + sum(jumlahsep) + sum(jumlahokt) + sum(jumlahnov) + sum(jumlahdes) subtotal
            from(
                select
                ka.kode, ka.keterangan, kb.subtotal jumlahanggaran, ap.id idap, kb.norec,
                case when akb.bulanint = 1 then sum(akb.nilai::float8) else 0 end as jumlahjan,
                case when akb.bulanint = 2 then sum(akb.nilai::float8) else 0 end as jumlahfeb,
                case when akb.bulanint = 3 then sum(akb.nilai::float8) else 0 end as jumlahmar,
                case when akb.bulanint = 4 then sum(akb.nilai::float8) else 0 end as jumlahapr,
                case when akb.bulanint = 5 then sum(akb.nilai::float8) else 0 end as jumlahmei,
                case when akb.bulanint = 6 then sum(akb.nilai::float8) else 0 end as jumlahjun,
                case when akb.bulanint = 7 then sum(akb.nilai::float8) else 0 end as jumlahjul,
                case when akb.bulanint = 8 then sum(akb.nilai::float8) else 0 end as jumlahagt,
                case when akb.bulanint = 9 then sum(akb.nilai::float8) else 0 end as jumlahsep,
                case when akb.bulanint = 10 then sum(akb.nilai::float8) else 0 end as jumlahokt,
                case when akb.bulanint = 11 then sum(akb.nilai::float8) else 0 end as jumlahnov,
                case when akb.bulanint = 12 then sum(akb.nilai::float8) else 0 end as jumlahdes
                from mataanggaran_m ma
                inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                inner join kegiatananggaran_m as dp0 on ka.kode ilike dp0.kode || '%' and dp0.div = 3
                inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
                left join alokasiketeranganbelanja_t akb on akb.keteranganbelanjafk = kb.norec
                and akb.kdprofile = 30 and akb.statusenabled = true
                where ma.kdprofile = 30 and ma.statusenabled = true
                and kb.kdprofile = 30 and kb.statusenabled = true
                and ka.kdprofile = 30 and ka.statusenabled = true
                and dp0.kdprofile = 30 and dp0.statusenabled = true
                and ka.tahun = '$tahun'
                $qtahap
                group by
                ka.kode, ka.keterangan, akb.bulanint, kb.subtotal, ap.id, kb.norec
            ) as x group by kode, keterangan, jumlahanggaran, idap, norec
        ) as y group by kode, keterangan, nourut

        union ALL

        select 'iya' bold, 'iya' tkode, nourut, kode, keterangan, sum(jumlahanggaran) jumlahanggaran, sum(jumlahjan) jumlahjan, sum(jumlahfeb) jumlahfeb,
        sum(jumlahmar) jumlahmar, sum(jumlahapr) jumlahapr, sum(jumlahmei) jumlahmei, sum(jumlahjun) jumlahjun,
        sum(jumlahjul) jumlahjul, sum(jumlahagt) jumlahagt, sum(jumlahsep) jumlahsep, sum(jumlahokt) jumlahokt,
        sum(jumlahnov) jumlahnov, sum(jumlahdes) jumlahdes,
        sum(jumlahjan) + sum(jumlahfeb) + sum(jumlahmar) + sum(jumlahapr) + sum(jumlahmei) + sum(jumlahjun) +
        sum(jumlahjul) + sum(jumlahagt) + sum(jumlahsep) + sum(jumlahokt) + sum(jumlahnov) + sum(jumlahdes) subtotal
        from(
            select DENSE_RANK ( ) OVER ( order by kode ) AS nourut, kode, keterangan, jumlahanggaran, idap, norec, sum(jumlahjan) jumlahjan, sum(jumlahfeb) jumlahfeb,
            sum(jumlahmar) jumlahmar, sum(jumlahapr) jumlahapr, sum(jumlahmei) jumlahmei, sum(jumlahjun) jumlahjun,
            sum(jumlahjul) jumlahjul, sum(jumlahagt) jumlahagt, sum(jumlahsep) jumlahsep, sum(jumlahokt) jumlahokt,
            sum(jumlahnov) jumlahnov, sum(jumlahdes) jumlahdes,
            sum(jumlahjan) + sum(jumlahfeb) + sum(jumlahmar) + sum(jumlahapr) + sum(jumlahmei) + sum(jumlahjun) +
            sum(jumlahjul) + sum(jumlahagt) + sum(jumlahsep) + sum(jumlahokt) + sum(jumlahnov) + sum(jumlahdes) subtotal
            from(
                select
                dp0.kode, dp0.keterangan, kb.subtotal jumlahanggaran, ap.id idap, kb.norec,
                case when akb.bulanint = 1 then sum(akb.nilai::float8) else 0 end as jumlahjan,
                case when akb.bulanint = 2 then sum(akb.nilai::float8) else 0 end as jumlahfeb,
                case when akb.bulanint = 3 then sum(akb.nilai::float8) else 0 end as jumlahmar,
                case when akb.bulanint = 4 then sum(akb.nilai::float8) else 0 end as jumlahapr,
                case when akb.bulanint = 5 then sum(akb.nilai::float8) else 0 end as jumlahmei,
                case when akb.bulanint = 6 then sum(akb.nilai::float8) else 0 end as jumlahjun,
                case when akb.bulanint = 7 then sum(akb.nilai::float8) else 0 end as jumlahjul,
                case when akb.bulanint = 8 then sum(akb.nilai::float8) else 0 end as jumlahagt,
                case when akb.bulanint = 9 then sum(akb.nilai::float8) else 0 end as jumlahsep,
                case when akb.bulanint = 10 then sum(akb.nilai::float8) else 0 end as jumlahokt,
                case when akb.bulanint = 11 then sum(akb.nilai::float8) else 0 end as jumlahnov,
                case when akb.bulanint = 12 then sum(akb.nilai::float8) else 0 end as jumlahdes
                from mataanggaran_m ma
                inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                inner join kegiatananggaran_m as dp0 on ka.kode ilike dp0.kode || '%' and dp0.div = 3
                inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
                left join alokasiketeranganbelanja_t akb on akb.keteranganbelanjafk = kb.norec
                and akb.kdprofile = 30 and akb.statusenabled = true
                where ma.kdprofile = 30 and ma.statusenabled = true
                and kb.kdprofile = 30 and kb.statusenabled = true
                and ka.kdprofile = 30 and ka.statusenabled = true
                and dp0.kdprofile = 30 and dp0.statusenabled = true
                and ka.tahun = '$tahun'
                $qtahap
                group by
                dp0.kode, dp0.keterangan, akb.bulanint, kb.subtotal, ap.id, kb.norec
            ) as x group by kode, keterangan, jumlahanggaran, idap, norec
        ) as y group by kode, keterangan, nourut

        union ALL

        select 'iya' bold, 'iya' tkode, nourut, kode, keterangan, sum(jumlahanggaran) jumlahanggaran, sum(jumlahjan) jumlahjan, sum(jumlahfeb) jumlahfeb,
        sum(jumlahmar) jumlahmar, sum(jumlahapr) jumlahapr, sum(jumlahmei) jumlahmei, sum(jumlahjun) jumlahjun,
        sum(jumlahjul) jumlahjul, sum(jumlahagt) jumlahagt, sum(jumlahsep) jumlahsep, sum(jumlahokt) jumlahokt,
        sum(jumlahnov) jumlahnov, sum(jumlahdes) jumlahdes,
        sum(jumlahjan) + sum(jumlahfeb) + sum(jumlahmar) + sum(jumlahapr) + sum(jumlahmei) + sum(jumlahjun) +
        sum(jumlahjul) + sum(jumlahagt) + sum(jumlahsep) + sum(jumlahokt) + sum(jumlahnov) + sum(jumlahdes) subtotal
        from(
            select DENSE_RANK ( ) OVER ( order by kode ) AS nourut, kode, keterangan, jumlahanggaran, idap, norec, sum(jumlahjan) jumlahjan, sum(jumlahfeb) jumlahfeb,
            sum(jumlahmar) jumlahmar, sum(jumlahapr) jumlahapr, sum(jumlahmei) jumlahmei, sum(jumlahjun) jumlahjun,
            sum(jumlahjul) jumlahjul, sum(jumlahagt) jumlahagt, sum(jumlahsep) jumlahsep, sum(jumlahokt) jumlahokt,
            sum(jumlahnov) jumlahnov, sum(jumlahdes) jumlahdes,
            sum(jumlahjan) + sum(jumlahfeb) + sum(jumlahmar) + sum(jumlahapr) + sum(jumlahmei) + sum(jumlahjun) +
            sum(jumlahjul) + sum(jumlahagt) + sum(jumlahsep) + sum(jumlahokt) + sum(jumlahnov) + sum(jumlahdes) subtotal
            from(
                select
                dp2.kode, dp2.keterangan, kb.subtotal jumlahanggaran, ap.id idap, kb.norec,
                case when akb.bulanint = 1 then sum(akb.nilai::float8) else 0 end as jumlahjan,
                case when akb.bulanint = 2 then sum(akb.nilai::float8) else 0 end as jumlahfeb,
                case when akb.bulanint = 3 then sum(akb.nilai::float8) else 0 end as jumlahmar,
                case when akb.bulanint = 4 then sum(akb.nilai::float8) else 0 end as jumlahapr,
                case when akb.bulanint = 5 then sum(akb.nilai::float8) else 0 end as jumlahmei,
                case when akb.bulanint = 6 then sum(akb.nilai::float8) else 0 end as jumlahjun,
                case when akb.bulanint = 7 then sum(akb.nilai::float8) else 0 end as jumlahjul,
                case when akb.bulanint = 8 then sum(akb.nilai::float8) else 0 end as jumlahagt,
                case when akb.bulanint = 9 then sum(akb.nilai::float8) else 0 end as jumlahsep,
                case when akb.bulanint = 10 then sum(akb.nilai::float8) else 0 end as jumlahokt,
                case when akb.bulanint = 11 then sum(akb.nilai::float8) else 0 end as jumlahnov,
                case when akb.bulanint = 12 then sum(akb.nilai::float8) else 0 end as jumlahdes
                from mataanggaran_m ma
                inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                inner join kegiatananggaran_m as dp2 on ka.kode ilike dp2.kode || '%' and dp2.div = 2
                inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
                left join alokasiketeranganbelanja_t akb on akb.keteranganbelanjafk = kb.norec
                and akb.kdprofile = 30 and akb.statusenabled = true
                where ma.kdprofile = 30 and ma.statusenabled = true
                and kb.kdprofile = 30 and kb.statusenabled = true
                and ka.kdprofile = 30 and ka.statusenabled = true
                and dp2.kdprofile = 30 and dp2.statusenabled = true
                and ka.tahun = '$tahun'
                $qtahap
                group by
                dp2.kode, dp2.keterangan, akb.bulanint, kb.subtotal, ap.id, kb.norec
            ) as x group by kode, keterangan, jumlahanggaran, idap, norec
        ) as y group by kode, keterangan, nourut

        union ALL

        select 'iya' bold, 'iya' tkode, nourut, kode, keterangan, sum(jumlahanggaran) jumlahanggaran, sum(jumlahjan) jumlahjan, sum(jumlahfeb) jumlahfeb,
        sum(jumlahmar) jumlahmar, sum(jumlahapr) jumlahapr, sum(jumlahmei) jumlahmei, sum(jumlahjun) jumlahjun,
        sum(jumlahjul) jumlahjul, sum(jumlahagt) jumlahagt, sum(jumlahsep) jumlahsep, sum(jumlahokt) jumlahokt,
        sum(jumlahnov) jumlahnov, sum(jumlahdes) jumlahdes,
        sum(jumlahjan) + sum(jumlahfeb) + sum(jumlahmar) + sum(jumlahapr) + sum(jumlahmei) + sum(jumlahjun) +
        sum(jumlahjul) + sum(jumlahagt) + sum(jumlahsep) + sum(jumlahokt) + sum(jumlahnov) + sum(jumlahdes) subtotal
        from(
            select DENSE_RANK ( ) OVER ( order by kode ) AS nourut, kode, keterangan, jumlahanggaran, idap, norec, sum(jumlahjan) jumlahjan, sum(jumlahfeb) jumlahfeb,
            sum(jumlahmar) jumlahmar, sum(jumlahapr) jumlahapr, sum(jumlahmei) jumlahmei, sum(jumlahjun) jumlahjun,
            sum(jumlahjul) jumlahjul, sum(jumlahagt) jumlahagt, sum(jumlahsep) jumlahsep, sum(jumlahokt) jumlahokt,
            sum(jumlahnov) jumlahnov, sum(jumlahdes) jumlahdes,
            sum(jumlahjan) + sum(jumlahfeb) + sum(jumlahmar) + sum(jumlahapr) + sum(jumlahmei) + sum(jumlahjun) +
            sum(jumlahjul) + sum(jumlahagt) + sum(jumlahsep) + sum(jumlahokt) + sum(jumlahnov) + sum(jumlahdes) subtotal
            from(
                select
                dp1.kode, dp1.keterangan, kb.subtotal jumlahanggaran, ap.id idap, kb.norec,
                case when akb.bulanint = 1 then sum(akb.nilai::float8) else 0 end as jumlahjan,
                case when akb.bulanint = 2 then sum(akb.nilai::float8) else 0 end as jumlahfeb,
                case when akb.bulanint = 3 then sum(akb.nilai::float8) else 0 end as jumlahmar,
                case when akb.bulanint = 4 then sum(akb.nilai::float8) else 0 end as jumlahapr,
                case when akb.bulanint = 5 then sum(akb.nilai::float8) else 0 end as jumlahmei,
                case when akb.bulanint = 6 then sum(akb.nilai::float8) else 0 end as jumlahjun,
                case when akb.bulanint = 7 then sum(akb.nilai::float8) else 0 end as jumlahjul,
                case when akb.bulanint = 8 then sum(akb.nilai::float8) else 0 end as jumlahagt,
                case when akb.bulanint = 9 then sum(akb.nilai::float8) else 0 end as jumlahsep,
                case when akb.bulanint = 10 then sum(akb.nilai::float8) else 0 end as jumlahokt,
                case when akb.bulanint = 11 then sum(akb.nilai::float8) else 0 end as jumlahnov,
                case when akb.bulanint = 12 then sum(akb.nilai::float8) else 0 end as jumlahdes
                from mataanggaran_m ma
                inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                inner join kegiatananggaran_m as dp1 on ka.kode ilike dp1.kode || '%' and dp1.div = 1
                inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
                left join alokasiketeranganbelanja_t akb on akb.keteranganbelanjafk = kb.norec
                and akb.kdprofile = 30 and akb.statusenabled = true
                where ma.kdprofile = 30 and ma.statusenabled = true
                and kb.kdprofile = 30 and kb.statusenabled = true
                and ka.kdprofile = 30 and ka.statusenabled = true
                and dp1.kdprofile = 30 and dp1.statusenabled = true
                and ka.tahun = '$tahun'
                $qtahap
                group by
                dp1.kode, dp1.keterangan, akb.bulanint, kb.subtotal, ap.id, kb.norec
            ) as x group by kode, keterangan, jumlahanggaran, idap, norec
        ) as y group by kode, keterangan, nourut

        union ALL

        select 'tidak' bold, 'tidak' tkode, nourut, kode, keterangan, sum(jumlahanggaran) jumlahanggaran, sum(jumlahjan) jumlahjan, sum(jumlahfeb) jumlahfeb,
        sum(jumlahmar) jumlahmar, sum(jumlahapr) jumlahapr, sum(jumlahmei) jumlahmei, sum(jumlahjun) jumlahjun,
        sum(jumlahjul) jumlahjul, sum(jumlahagt) jumlahagt, sum(jumlahsep) jumlahsep, sum(jumlahokt) jumlahokt,
        sum(jumlahnov) jumlahnov, sum(jumlahdes) jumlahdes,
        sum(jumlahjan) + sum(jumlahfeb) + sum(jumlahmar) + sum(jumlahapr) + sum(jumlahmei) + sum(jumlahjun) +
        sum(jumlahjul) + sum(jumlahagt) + sum(jumlahsep) + sum(jumlahokt) + sum(jumlahnov) + sum(jumlahdes) subtotal
        from(
        select DENSE_RANK ( ) OVER ( order by kode ) AS nourut, kode, keterangan, jumlahanggaran, idap, norec, sum(jumlahjan) jumlahjan, sum(jumlahfeb) jumlahfeb,
        sum(jumlahmar) jumlahmar, sum(jumlahapr) jumlahapr, sum(jumlahmei) jumlahmei, sum(jumlahjun) jumlahjun,
        sum(jumlahjul) jumlahjul, sum(jumlahagt) jumlahagt, sum(jumlahsep) jumlahsep, sum(jumlahokt) jumlahokt,
        sum(jumlahnov) jumlahnov, sum(jumlahdes) jumlahdes,
        sum(jumlahjan) + sum(jumlahfeb) + sum(jumlahmar) + sum(jumlahapr) + sum(jumlahmei) + sum(jumlahjun) +
        sum(jumlahjul) + sum(jumlahagt) + sum(jumlahsep) + sum(jumlahokt) + sum(jumlahnov) + sum(jumlahdes) subtotal
        from(
        select
        ap.id, ap.asalproduk keterangan, kb.subtotal jumlahanggaran, ka.kode, ap.id idap, kb.norec,
        case when akb.bulanint = 1 then sum(akb.nilai::float8) else 0 end as jumlahjan,
        case when akb.bulanint = 2 then sum(akb.nilai::float8) else 0 end as jumlahfeb,
        case when akb.bulanint = 3 then sum(akb.nilai::float8) else 0 end as jumlahmar,
        case when akb.bulanint = 4 then sum(akb.nilai::float8) else 0 end as jumlahapr,
        case when akb.bulanint = 5 then sum(akb.nilai::float8) else 0 end as jumlahmei,
        case when akb.bulanint = 6 then sum(akb.nilai::float8) else 0 end as jumlahjun,
        case when akb.bulanint = 7 then sum(akb.nilai::float8) else 0 end as jumlahjul,
        case when akb.bulanint = 8 then sum(akb.nilai::float8) else 0 end as jumlahagt,
        case when akb.bulanint = 9 then sum(akb.nilai::float8) else 0 end as jumlahsep,
        case when akb.bulanint = 10 then sum(akb.nilai::float8) else 0 end as jumlahokt,
        case when akb.bulanint = 11 then sum(akb.nilai::float8) else 0 end as jumlahnov,
        case when akb.bulanint = 12 then sum(akb.nilai::float8) else 0 end as jumlahdes
        from mataanggaran_m ma
        inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
        INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
        inner join kegiatananggaran_m as dp0 on ka.kode ilike dp0.kode || '%' and dp0.div = 3
        inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
        left join alokasiketeranganbelanja_t akb on akb.keteranganbelanjafk = kb.norec
        and akb.kdprofile = 30 and akb.statusenabled = true
        where ma.kdprofile = 30 and ma.statusenabled = true
        and kb.kdprofile = 30 and kb.statusenabled = true
        and ka.kdprofile = 30 and ka.statusenabled = true
        and dp0.kdprofile = 30 and dp0.statusenabled = true
        and ka.tahun = '$tahun'
        $qtahap
        group by
        ap.id, ap.asalproduk, akb.bulanint, kb.subtotal, ka.kode, ap.id, kb.norec
        ) as x group by kode, keterangan, jumlahanggaran, idap, norec
        ) as y group by kode, keterangan, nourut

        order by nourut, kode;        
        "));

        $pageWidth = 1200;
        //return $this->respond($result);
        return view('report.spj.cetakkas',compact('data', 'pageWidth', 'tahun', 'tahap'));
    }

    public function CetakSPJMonevRBA(Request $request){
        $tahun = $request['tahun'];

        $qtahun  = '';
        $qtahunka  = '';
        if (isset($request['tahun']) && $request['tahun'] != "" && $request['tahun'] != "undefined") {
            $qtahun =  " and extract(year from sr.tglrealisasi) =  '" . $request['tahun']."'";
            $qtahunka =  " and ka.tahun =  '" . $request['tahun']."'";
        }

        $qsubsubkegiatan  = '';
        $qsubsubkegiatansr  = '';
        if (isset($request['subsubkegiatan']) && $request['subsubkegiatan'] != "" && $request['subsubkegiatan'] != "undefined") {
            $qsubsubkegiatan =  " and ka.id =  '" . $request['subsubkegiatan']."'";
            $qsubsubkegiatansr =  " and sr.objectkegiatanfk =  '" . $request['subsubkegiatan']."'";
        }

        $subk = $request['subkegiatan'];
        $subsubk = $request['subsubkegiatan'];

        $subsubkegiatan = DB::select(DB::raw("select * from kegiatananggaran_m where id = ".$subsubk));

        $subkegiatan = DB::select(DB::raw("select * from kegiatananggaran_m where id = ".$subk));

        $data = DB::select(DB::raw("select ma.kodemataanggaran, ma.namamataanggaran, sum(kb.subtotal) jumlahanggaran,
                x.totalbelanja jumlahspj, y.jumlah jumlahpanjar,
                x.totalbelanja + y.jumlah as subtotal, round(cast(((x.totalbelanja + y.jumlah)/sum(kb.subtotal))*100 as numeric), 2) as persentase,  
                sum(kb.subtotal) - (coalesce(x.totalbelanja,0) + coalesce(y.jumlah,0)) sisaanggaran
                from mataanggaran_m ma
                inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                        left join (
                            select ma.kodemataanggaran, ma.namamataanggaran, sum(sr.totalbelanja) totalbelanja
                            from mataanggaran_m ma
                            inner join strukrealisasi_t sr on ma.id=sr.objectmataanggaranfk
                            where sr.kdprofile = 30 and sr.statusenabled = true
                            $qtahun
                            $qsubsubkegiatansr
                            group by ma.kodemataanggaran, ma.namamataanggaran
                        ) as x on x.kodemataanggaran = ma.kodemataanggaran
                        left join (
                            select kodemataanggaran, namamataanggaran, sum(jumlah) jumlah
                            from(
                                select ma.kodemataanggaran, ma.namamataanggaran, pj.jumlah panjar, coalesce(sum(sr.totalbelanja),0) totalbelanja,  coalesce(pj.jumlah - coalesce(sum(sr.totalbelanja),0), 0) as jumlah
                                from mataanggaran_m ma
                                left join panjar_t pj on ma.id=pj.objectmataanggaranfk and pj.kdprofile = 30 and pj.statusenabled = true
                                left join strukrealisasi_t sr on sr.objectpanjarfk = pj.norec and sr.kdprofile = 30 and sr.statusenabled = true
                                $qtahun
                                $qsubsubkegiatansr
                                group by ma.kodemataanggaran, ma.namamataanggaran, pj.jumlah
                            ) as s group by kodemataanggaran, namamataanggaran
                        ) as y on y.kodemataanggaran = ma.kodemataanggaran
                        left join mataanggaranpermen_m map on map.id = ma.mataanggaranpermenfk
                        and map.kdprofile = 30 and map.statusenabled = true
                        left join mataanggaranpermen_m map1 on map1.id = map.mataanggaranpermenfk and map1.div = 4
                        left join mataanggaranpermen_m map2 on map2.id = map1.mataanggaranpermenfk and map2.div = 3
                        left join mataanggaranpermen_m map3 on map3.id = map2.mataanggaranpermenfk and map3.div = 2
                        where ma.kdprofile = 30 and ma.statusenabled = true
                        and kb.kdprofile = 30 and kb.statusenabled = true
                        and ka.kdprofile = 30 and ka.statusenabled = true
                        $qsubsubkegiatan
                        $qtahunka
                group by ma.kodemataanggaran, ma.namamataanggaran, x.totalbelanja, y.jumlah        
        "));

        $pageWidth = 950;
        //return $this->respond($result);
        return view('report.spj.cetakspjmonev',compact('data', 'pageWidth', 'tahun', 'subkegiatan', 'subsubkegiatan'));
    }

    public function CetakKeuanganPerRekeningPermen(Request $request){
        $tahun = $request['tahun'];

        $qtahun  = '';
        $qtahunka  = '';
        if (isset($request['tahun']) && $request['tahun'] != "" && $request['tahun'] != "undefined") {
            $qtahun =  " and extract(year from sr.tglrealisasi) =  '" . $request['tahun']."'";
            $qtahunka =  " and ka.tahun =  '" . $request['tahun']."'";
        }

        $qasalproduk  = '';
        if (isset($request['asalproduk']) && $request['asalproduk'] != "" && $request['asalproduk'] != "undefined") {
            $qasalproduk =  " and kb.objectasalprodukfk =  " . $request['asalproduk'];
        }

        $data = DB::select(DB::raw("select map5.mataanggaranpermen as namamataanggaran, map2.kode || '.' ||  map3.kode || '.' ||  map4.kode || '.' || map5.kode as kodemataanggaran, sum(kb.subtotal) jumlahanggaran,
        x.totalbelanja jumlahspj, y.jumlah jumlahpanjar,
        x.totalbelanja + y.jumlah as subtotal, round(cast(((x.totalbelanja + y.jumlah)/sum(kb.subtotal))*100 as numeric), 2) as persentase,  
        sum(kb.subtotal) - (x.totalbelanja + y.jumlah) sisaanggaran
        from mataanggaran_m ma
        inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
        inner join mataanggaranpermen_m map5 on map5.id = ma.mataanggaranpermenfk and map5.div = 5
        inner join mataanggaranpermen_m map4 on map5.mataanggaranpermenfk = map4.id and map4.div = 4
        inner join mataanggaranpermen_m map3 on map4.mataanggaranpermenfk = map3.id and map3.div = 3
        inner join mataanggaranpermen_m map2 on map3.mataanggaranpermenfk = map2.id and map2.div = 2
        INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
				inner join (
					select ma.kodemataanggaran, ma.namamataanggaran, sum(sr.totalbelanja) totalbelanja
					from mataanggaran_m ma
					inner join strukrealisasi_t sr on ma.id=sr.objectmataanggaranfk
					where sr.kdprofile = 30 and sr.statusenabled = true
					and sr.status = 'Sudah Diverifikasi'
                    $qtahun
					group by ma.kodemataanggaran, ma.namamataanggaran
				) as x on x.kodemataanggaran = ma.kodemataanggaran
				inner join (
					select kodemataanggaran, namamataanggaran, sum(jumlah) jumlah
					from(
						select ma.kodemataanggaran, ma.namamataanggaran, pj.jumlah panjar, coalesce(sum(sr.totalbelanja),0) totalbelanja,  coalesce(pj.jumlah - coalesce(sum(sr.totalbelanja),0), 0) as jumlah
						from mataanggaran_m ma
						left join panjar_t pj on ma.id=pj.objectmataanggaranfk and pj.kdprofile = 30 and pj.statusenabled = true
						left join strukrealisasi_t sr on sr.objectpanjarfk = pj.norec and sr.kdprofile = 30 and sr.statusenabled = true
						and sr.status = 'Sudah Diverifikasi'
                        $qtahun
						group by ma.kodemataanggaran, ma.namamataanggaran, pj.jumlah
					) as s group by kodemataanggaran, namamataanggaran
				) as y on y.kodemataanggaran = ma.kodemataanggaran
        where ma.kdprofile = 30 and ma.statusenabled = true
        and kb.kdprofile = 30 and kb.statusenabled = true
        and ka.kdprofile = 30 and ka.statusenabled = true
        $qasalproduk
        $qtahunka
        group by map5.mataanggaranpermen, map2.kode || '.' ||  map3.kode || '.' ||  map4.kode || '.' || map5.kode, x.totalbelanja, y.jumlah;
        "));

        $pageWidth = 950;
        //return $this->respond($result);
        return view('report.keuangan.perrekening',compact('data', 'pageWidth', 'tahun'));
    }

    public function CetakAngkasPenyerapan(Request $request){
        $tahun = $request['tahunangkas'];
        $bawal = date('F', mktime(0, 0, 0, $request['bulanawal'], 10));
        $bakhir = date('F', mktime(0, 0, 0, $request['bulanakhir'], 10));

        $qtahun  = '';
        if (isset($request['tahunangkas']) && $request['tahunangkas'] != "" && $request['tahunangkas'] != "undefined") {
            $qtahun =  " and extract(year from sr.tglrealisasi) =  '" . $request['tahunangkas']."'";
        }

        $qasalproduk  = '';
        if (isset($request['asalprodukangkas']) && $request['asalprodukangkas'] != "" && $request['asalprodukangkas'] != "undefined") {
            $qasalproduk =  " and kb.objectasalprodukfk =  " . $request['asalprodukangkas'];
        }

        $bulanawal  = '';
        if (isset($request['bulanawal']) && $request['bulanawal'] != "" && $request['bulanawal'] != "undefined") {
            $bulanawal =  " and extract(month from sr.tglrealisasi) >= '" . $request['bulanawal']."'";
        }

        $bulanakhir  = '';
        if (isset($request['bulanakhir']) && $request['bulanakhir'] != "" && $request['bulanakhir'] != "undefined") {
            $bulanakhir =  " and extract(month from sr.tglrealisasi) <= '" . $request['bulanakhir']."'";
        }

        $data = DB::select(DB::raw("select 'iya' as bold, nourut, kode, keterangan, sum(jumlahanggaran) jumlahanggaran, sum(jumlahspj) jumlahspj,
        round(cast(sum(jumlahspj)/sum(jumlahanggaran)*100 as numeric), 2) as persentase
        from(
            select RANK ( ) OVER ( order by ka.kode ) AS nourut, ka.kode, 
            ka.keterangan, sum(kb.subtotal) jumlahanggaran, x.totalbelanja jumlahspj,
            round(cast(x.totalbelanja/sum(kb.subtotal)*100 as numeric), 2) as persentase
            from mataanggaran_m ma
            inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
            INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
            inner join (
                select ma.kodemataanggaran, ma.namamataanggaran, sum(sr.totalbelanja) totalbelanja
                from mataanggaran_m ma
                inner join strukrealisasi_t sr on ma.id=sr.objectmataanggaranfk
                where sr.kdprofile = 30 and sr.statusenabled = true
                and sr.status = 'Sudah Diverifikasi'
                $qtahun
                $bulanawal
                $bulanakhir
                group by ma.kodemataanggaran, ma.namamataanggaran
            ) as x on x.kodemataanggaran = ma.kodemataanggaran
            where ma.kdprofile = 30 and ma.statusenabled = true
            and kb.kdprofile = 30 and kb.statusenabled = true
            and ka.kdprofile = 30 and ka.statusenabled = true
            $qasalproduk
            group by ka.kode, ka.keterangan, x.totalbelanja
        ) as y group by nourut, kode, keterangan
        
        union all
        
        select 'tidak' as bold, RANK ( ) OVER ( order by ka.kode ) AS nourut, ma.kodemataanggaran kode, 
        ma.namamataanggaran keterangan, sum(kb.subtotal) jumlahanggaran, x.totalbelanja jumlahspj,
        round(cast(x.totalbelanja/sum(kb.subtotal)*100 as numeric), 2) as persentase
        from mataanggaran_m ma
        inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
        INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
        inner join (
            select ma.kodemataanggaran, ma.namamataanggaran, sum(sr.totalbelanja) totalbelanja
            from mataanggaran_m ma
            inner join strukrealisasi_t sr on ma.id=sr.objectmataanggaranfk
            where sr.kdprofile = 30 and sr.statusenabled = true
            and sr.status = 'Sudah Diverifikasi'
            $qtahun
            $bulanawal
            $bulanakhir
            group by ma.kodemataanggaran, ma.namamataanggaran
        ) as x on x.kodemataanggaran = ma.kodemataanggaran
        where ma.kdprofile = 30 and ma.statusenabled = true
        and kb.kdprofile = 30 and kb.statusenabled = true
        and ka.kdprofile = 30 and ka.statusenabled = true
        $qasalproduk
        group by ka.kode, ma.kodemataanggaran, ma.namamataanggaran, x.totalbelanja
        order by nourut;"));

        $pageWidth = 950;
        //return $this->respond($result);
        return view('report.keuangan.angkaspenyerapan',compact('data', 'pageWidth', 'tahun', 'bawal', 'bakhir'));
    }

    public function CetakPertanggungjawaban(Request $request){
        $tahun = $request['tahun'];
        $bulan = $request['bulan'];

        $periode = '';
        if($bulan == '01'){
            $periode = 'JANUARI';
        }
        else if($bulan == '02'){
            $periode = 'FEBRUARI';
        }
        else if($bulan == '03'){
            $periode = 'MARET';
        }
        else if($bulan == '04'){
            $periode = 'APRIL';
        }
        else if($bulan == '05'){
            $periode = 'MEI';
        }
        else if($bulan == '06'){
            $periode = 'JUNI';
        }
        else if($bulan == '07'){
            $periode = 'JULI';
        }
        else if($bulan == '08'){
            $periode = 'AGUSTUS';
        }
        else if($bulan == '09'){
            $periode = 'SEPTEMBER';
        }
        else if($bulan == '10'){
            $periode = 'OKTOBER';
        }
        else if($bulan == '11'){
            $periode = 'NOVEMBER';
        }
        else if($bulan == '12'){
            $periode = 'DESEMBER';
        }
        // $bawal = date('F', mktime(0, 0, 0, $request['bulanawal'], 10));
        // $bakhir = date('F', mktime(0, 0, 0, $request['bulanakhir'], 10));

        // $qtahun  = '';
        // if (isset($request['tahunangkas']) && $request['tahunangkas'] != "" && $request['tahunangkas'] != "undefined") {
        //     $qtahun =  " and extract(year from sr.tglrealisasi) =  '" . $request['tahunangkas']."'";
        // }

        // $qasalproduk  = '';
        // if (isset($request['asalprodukangkas']) && $request['asalprodukangkas'] != "" && $request['asalprodukangkas'] != "undefined") {
        //     $qasalproduk =  " and kb.objectasalprodukfk =  " . $request['asalprodukangkas'];
        // }

        // $bulanawal  = '';
        // if (isset($request['bulanawal']) && $request['bulanawal'] != "" && $request['bulanawal'] != "undefined") {
        //     $bulanawal =  " and extract(month from sr.tglrealisasi) >= '" . $request['bulanawal']."'";
        // }

        // $bulanakhir  = '';
        // if (isset($request['bulanakhir']) && $request['bulanakhir'] != "" && $request['bulanakhir'] != "undefined") {
        //     $bulanakhir =  " and extract(month from sr.tglrealisasi) <= '" . $request['bulanakhir']."'";
        // }

        $data = DB::select(DB::raw("select bold, nourut, kode, keterangan, coalesce(sum(jumlahanggaran), 0) jumlahanggaran,
        coalesce(sum(jumlahspjsdbulanlalu),0) jumlahspjsdbulanlalu,
        coalesce(sum(jumlahspjbulanini),0) jumlahspjbulanini, coalesce(sum(totalsemuabulan),0) totalsemuabulan,
        round(cast(coalesce(sum(totalsemuabulan),0)/coalesce(sum(jumlahanggaran), 0)*100 as numeric), 2) as persentase, 
        coalesce(sum(jumlahanggaran), 0)-coalesce(sum(totalsemuabulan),0) as sisaanggaran
        from(
                select 'iya' as bold, nourut, kode, keterangan, jumlahanggaran,
                case when tglrealisasi < '$bulan' then sum(totalbelanja) end as jumlahspjsdbulanlalu,
                case when tglrealisasi = '$bulan' then sum(totalbelanja) end as jumlahspjbulanini,
                sum(totalbelanja) as totalsemuabulan
                from(
                    select TO_CHAR(x.tglrealisasi, 'MM') tglrealisasi, RANK ( ) OVER ( order by ka.kode ) AS nourut, ka.kode, 
                    ka.keterangan, sum(kb.subtotal) jumlahanggaran, x.totalbelanja
                    from mataanggaran_m ma
                    inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
                    INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                    inner join (
                        select ma.kodemataanggaran, ma.namamataanggaran, sr.totalbelanja, sr.tglrealisasi
                        from mataanggaran_m ma
                        inner join strukrealisasi_t sr on ma.id=sr.objectmataanggaranfk
                        where sr.kdprofile = 30 and sr.statusenabled = true
                        and sr.status = 'Sudah Diverifikasi'
                        and extract(year from sr.tglrealisasi) = '$tahun'
                                        and TO_CHAR(sr.tglrealisasi, 'YYYY-MM') in(
                                            SELECT TO_CHAR(months, 'YYYY-MM') AS dateMonth
                                            FROM generate_series(
                                                    '$tahun-01-01' :: DATE,
                                                    '$tahun-$bulan-28' :: DATE ,
                                                    '1 month'
                                            ) AS months
                                        )
                    ) as x on x.kodemataanggaran = ma.kodemataanggaran
                    where ma.kdprofile = 30 and ma.statusenabled = true
                    and kb.kdprofile = 30 and kb.statusenabled = true
                    and ka.kdprofile = 30 and ka.statusenabled = true
                    group by TO_CHAR(x.tglrealisasi, 'MM'), ka.kode, ka.keterangan, x.totalbelanja
                ) as y group by bold, nourut, kode, keterangan, jumlahanggaran, tglrealisasi order by nourut
        ) as a group by bold, nourut, kode, keterangan 
        
        union all
        
        select bold, nourut, kode, keterangan, jumlahanggaran,
        coalesce(sum(jumlahspjsdbulanlalu),0) jumlahspjsdbulanlalu,
        coalesce(sum(jumlahspjbulanini),0) jumlahspjbulanini, coalesce(sum(totalsemuabulan),0) totalsemuabulan,
        round(cast(coalesce(sum(totalsemuabulan),0)/jumlahanggaran*100 as numeric), 2) as persentase, 
        jumlahanggaran-coalesce(sum(totalsemuabulan),0) as sisaanggaran
        from(
            select bold, nourut, kode, keterangan, jumlahanggaran,
            case when tglrealisasi < '$bulan' then sum(totalbelanja) end as jumlahspjsdbulanlalu,
                            case when tglrealisasi = '$bulan' then sum(totalbelanja) end as jumlahspjbulanini,
                            sum(totalbelanja) as totalsemuabulan
            from(
                            select TO_CHAR(x.tglrealisasi, 'MM') tglrealisasi, 'tidak' as bold, RANK ( ) OVER ( order by ka.kode ) AS nourut, ma.kodemataanggaran kode, 
                            ma.namamataanggaran keterangan, sum(kb.subtotal) jumlahanggaran, x.totalbelanja
                            
                            --round(cast(x.totalbelanja/sum(kb.subtotal)*100 as numeric), 2) as persentase
                            from mataanggaran_m ma
                            inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
                            INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                            inner join (
                                    select ma.kodemataanggaran, ma.namamataanggaran, sr.totalbelanja, sr.tglrealisasi
                                    from mataanggaran_m ma
                                    inner join strukrealisasi_t sr on ma.id=sr.objectmataanggaranfk
                                    where sr.kdprofile = 30 and sr.statusenabled = true
                                    and sr.status = 'Sudah Diverifikasi'
                                    and extract(year from sr.tglrealisasi) = '$tahun'
                                    and TO_CHAR(sr.tglrealisasi, 'YYYY-MM') in(
                                        SELECT TO_CHAR(months, 'YYYY-MM') AS dateMonth
                                        FROM generate_series(
                                                '$tahun-01-01' :: DATE,
                                                '$tahun-$bulan-28' :: DATE ,
                                                '1 month'
                                        ) AS months
                                    )
                            ) as x on x.kodemataanggaran = ma.kodemataanggaran
                            where ma.kdprofile = 30 and ma.statusenabled = true
                            and kb.kdprofile = 30 and kb.statusenabled = true
                            and ka.kdprofile = 30 and ka.statusenabled = true
                            group by TO_CHAR(x.tglrealisasi, 'MM'), ka.kode, ma.kodemataanggaran, ma.namamataanggaran, x.totalbelanja
                            order by nourut
            ) as y group by bold, nourut, kode, keterangan, jumlahanggaran, tglrealisasi order by nourut
        ) as a group by bold, nourut, kode, keterangan, jumlahanggaran
        order by nourut;"));

        $pageWidth = 950;
        //return $this->respond($result);
        return view('report.keuangan.pertanggungjawaban',compact('data', 'pageWidth', 'tahun', 'periode'));
    }

    public function CetakPertanggungjawabanBaru(Request $request){
        $tahun = $request['tahun'];
        $bulan = $request['bulan'];
        //$tanggalcetak = $this->tanggal_indonesia(date('Y-m-d',strtotime($request['tglcetak'])));

        $periode = '';
        if($bulan == '01'){
            $periode = 'JANUARI';
        }
        else if($bulan == '02'){
            $periode = 'FEBRUARI';
        }
        else if($bulan == '03'){
            $periode = 'MARET';
        }
        else if($bulan == '04'){
            $periode = 'APRIL';
        }
        else if($bulan == '05'){
            $periode = 'MEI';
        }
        else if($bulan == '06'){
            $periode = 'JUNI';
        }
        else if($bulan == '07'){
            $periode = 'JULI';
        }
        else if($bulan == '08'){
            $periode = 'AGUSTUS';
        }
        else if($bulan == '09'){
            $periode = 'SEPTEMBER';
        }
        else if($bulan == '10'){
            $periode = 'OKTOBER';
        }
        else if($bulan == '11'){
            $periode = 'NOVEMBER';
        }
        else if($bulan == '12'){
            $periode = 'DESEMBER';
        }

        $data = DB::select(DB::raw("select bold, nourut, kode, keterangan, coalesce(sum(jumlahanggaran), 0) jumlahanggaran,
        coalesce(sum(jumlahspjsdbulanlalugaji),0) jumlahspjsdbulanlalugaji,
        coalesce(sum(jumlahspjbulaninigaji),0) jumlahspjbulaninigaji, 
        coalesce(sum(totalsemuabulangaji),0) totalsemuabulangaji,
        coalesce(sum(jumlahspjsdbulanlalubarangjasa),0) jumlahspjsdbulanlalubarangjasa,
        coalesce(sum(jumlahspjbulaninibarangjasa),0) jumlahspjbulaninibarangjasa, 
        coalesce(sum(totalsemuabulanbarangjasa),0) totalsemuabulanbarangjasa
        from(
            select 'iya' as bold, nourut, kode, keterangan, jumlahanggaran,
            case when tglrealisasi < '$bulan' and idjenisanggaran = 3 then sum(totalbelanja) end as jumlahspjsdbulanlalugaji,
            case when tglrealisasi = '$bulan' and idjenisanggaran = 3 then sum(totalbelanja) end as jumlahspjbulaninigaji,
            case when tglrealisasi <= '$bulan' and idjenisanggaran = 3 then sum(totalbelanja) end as totalsemuabulangaji,
            case when tglrealisasi < '$bulan' and idjenisanggaran = 4 then sum(totalbelanja) end as jumlahspjsdbulanlalubarangjasa,
            case when tglrealisasi = '$bulan' and idjenisanggaran = 4 then sum(totalbelanja) end as jumlahspjbulaninibarangjasa,
            case when tglrealisasi <= '$bulan' and idjenisanggaran = 4 then sum(totalbelanja) end as totalsemuabulanbarangjasa
            from(
                select ja.id idjenisanggaran, TO_CHAR(x.tglrealisasi, 'MM') tglrealisasi, RANK ( ) OVER ( order by ka.kode ) AS nourut, ka.kode,
                ka.keterangan, sum(kb.subtotal) jumlahanggaran, x.totalbelanja
                from mataanggaran_m ma
                inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                inner join mataanggaran_m ma3 on ma.kodemataanggaran ilike ma3.kodemataanggaran || '.%'
                and 
              case 
                    when ma3.kodemataanggaran ilike 'I.%' then char_length(ma3.kodemataanggaran) = 5
                    when ma3.kodemataanggaran ilike 'I.%' then char_length(ma3.kodemataanggaran) = 6
                    when ma3.kodemataanggaran ilike 'III.%' then char_length(ma3.kodemataanggaran) = 7
                end 
                inner join jenisanggaran_m ja on ja.id = ma3.objectjenisanggaranfk
                inner join mataanggaranpermen_m map on map.id = ma.mataanggaranpermenfk
                inner join mataanggaranpermen_m map1 on map1.id = map.mataanggaranpermenfk and map1.div = 4
                inner join mataanggaranpermen_m map2 on map2.id = map1.mataanggaranpermenfk and map2.div = 3
                inner join mataanggaranpermen_m map3 on map3.id = map2.mataanggaranpermenfk and map3.div = 2
                inner join (
                    select ma.kodemataanggaran, ma.namamataanggaran, sr.totalbelanja, sr.tglrealisasi
                    from mataanggaran_m ma
                    inner join strukrealisasi_t sr on ma.id=sr.objectmataanggaranfk
                    where sr.kdprofile = 30 and sr.statusenabled = true
                    and sr.status = 'Sudah Diverifikasi'
                    and extract(year from sr.tglrealisasi) = '$tahun'
                    and TO_CHAR(sr.tglrealisasi, 'YYYY-MM') in(
                        SELECT TO_CHAR(months, 'YYYY-MM') AS dateMonth
                        FROM generate_series(
                        '2022-01-01' :: DATE,
                        '2022-11-28' :: DATE ,
                        '1 month'
                    ) AS months
                    )
                ) as x on x.kodemataanggaran = ma.kodemataanggaran
                where ma.kdprofile = 30 and ma.statusenabled = true
                and kb.kdprofile = 30 and kb.statusenabled = true
                and ka.kdprofile = 30 and ka.statusenabled = true
                group by ja.id, TO_CHAR(x.tglrealisasi, 'MM'), ka.kode, ka.keterangan, x.totalbelanja
            ) as y group by idjenisanggaran, bold, nourut, kode, keterangan, jumlahanggaran, tglrealisasi order by nourut
        ) as a group by bold, nourut, kode, keterangan
        
        union all
        
        select bold, nourut, kode, keterangan, jumlahanggaran,
        coalesce(sum(jumlahspjsdbulanlalugaji),0) jumlahspjsdbulanlalugaji,
        coalesce(sum(jumlahspjbulaninigaji),0) jumlahspjbulaninigaji, 
        coalesce(sum(totalsemuabulangaji),0) totalsemuabulangaji,
        coalesce(sum(jumlahspjsdbulanlalubarangjasa),0) jumlahspjsdbulanlalubarangjasa,
        coalesce(sum(jumlahspjbulaninibarangjasa),0) jumlahspjbulaninibarangjasa, 
        coalesce(sum(totalsemuabulanbarangjasa),0) totalsemuabulanbarangjasa
        from(
            select bold, nourut, kode, keterangan, jumlahanggaran,
            case when tglrealisasi < '$bulan' and idjenisanggaran = 3 then sum(totalbelanja) end as jumlahspjsdbulanlalugaji,
            case when tglrealisasi = '$bulan' and idjenisanggaran = 3 then sum(totalbelanja) end as jumlahspjbulaninigaji,
            case when tglrealisasi <= '$bulan' and idjenisanggaran = 3 then sum(totalbelanja) end as totalsemuabulangaji,
            case when tglrealisasi < '$bulan' and idjenisanggaran = 4 then sum(totalbelanja) end as jumlahspjsdbulanlalubarangjasa,
            case when tglrealisasi = '$bulan' and idjenisanggaran = 4 then sum(totalbelanja) end as jumlahspjbulaninibarangjasa,
            case when tglrealisasi <= '$bulan' and idjenisanggaran = 4 then sum(totalbelanja) end as totalsemuabulanbarangjasa
            from(
                select ja.id idjenisanggaran, TO_CHAR(x.tglrealisasi, 'MM') tglrealisasi, 'tidak' as bold, RANK ( ) OVER ( order by ka.kode ) AS nourut, map3.kode || '.' || map2.kode || '.' || map1.kode || '.' || map.kode kode,
                map.mataanggaranpermen keterangan, sum(kb.subtotal) jumlahanggaran, x.totalbelanja
                from mataanggaran_m ma
                inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                inner join mataanggaran_m ma3 on ma.kodemataanggaran ilike ma3.kodemataanggaran || '.%'
                and 
              case 
                    when ma3.kodemataanggaran ilike 'I.%' then char_length(ma3.kodemataanggaran) = 5
                    when ma3.kodemataanggaran ilike 'I.%' then char_length(ma3.kodemataanggaran) = 6
                    when ma3.kodemataanggaran ilike 'III.%' then char_length(ma3.kodemataanggaran) = 7
                end 
                inner join jenisanggaran_m ja on ja.id = ma3.objectjenisanggaranfk
                inner join mataanggaranpermen_m map on map.id = ma.mataanggaranpermenfk
                inner join mataanggaranpermen_m map1 on map1.id = map.mataanggaranpermenfk and map1.div = 4
                inner join mataanggaranpermen_m map2 on map2.id = map1.mataanggaranpermenfk and map2.div = 3
                inner join mataanggaranpermen_m map3 on map3.id = map2.mataanggaranpermenfk and map3.div = 2
                inner join (
                    select ma.kodemataanggaran, ma.namamataanggaran, sr.totalbelanja, sr.tglrealisasi
                    from mataanggaran_m ma
                    inner join strukrealisasi_t sr on ma.id=sr.objectmataanggaranfk
                    where sr.kdprofile = 30 and sr.statusenabled = true
                    and sr.status = 'Sudah Diverifikasi'
                    and extract(year from sr.tglrealisasi) = '$tahun'
                    and TO_CHAR(sr.tglrealisasi, 'YYYY-MM') in(
                        SELECT TO_CHAR(months, 'YYYY-MM') AS dateMonth
                        FROM generate_series(
                        '2022-01-01' :: DATE,
                        '2022-11-28' :: DATE ,
                        '1 month'
                        ) AS months
                    )
                ) as x on x.kodemataanggaran = ma.kodemataanggaran
                where ma.kdprofile = 30 and ma.statusenabled = true
                and kb.kdprofile = 30 and kb.statusenabled = true
                and ka.kdprofile = 30 and ka.statusenabled = true
                group by ja.id, TO_CHAR(x.tglrealisasi, 'MM'), ka.kode, map3.kode || '.' || map2.kode || '.' || map1.kode || '.' || map.kode, map.mataanggaranpermen, x.totalbelanja
                order by nourut
            ) as y group by idjenisanggaran, bold, nourut, kode, keterangan, jumlahanggaran, tglrealisasi order by nourut
        ) as a group by bold, nourut, kode, keterangan, jumlahanggaran
        
        union all
        
        select bold, nourut, kode, keterangan, jumlahanggaran,
        coalesce(sum(jumlahspjsdbulanlalugaji),0) jumlahspjsdbulanlalugaji,
        coalesce(sum(jumlahspjbulaninigaji),0) jumlahspjbulaninigaji, 
        coalesce(sum(totalsemuabulangaji),0) totalsemuabulangaji,
        coalesce(sum(jumlahspjsdbulanlalubarangjasa),0) jumlahspjsdbulanlalubarangjasa,
        coalesce(sum(jumlahspjbulaninibarangjasa),0) jumlahspjbulaninibarangjasa, 
        coalesce(sum(totalsemuabulanbarangjasa),0) totalsemuabulanbarangjasa
        from(
            select bold, nourut, kode, keterangan, jumlahanggaran,
            case when tglrealisasi < '$bulan' and idjenisanggaran = 3 then sum(totalbelanja) end as jumlahspjsdbulanlalugaji,
            case when tglrealisasi = '$bulan' and idjenisanggaran = 3 then sum(totalbelanja) end as jumlahspjbulaninigaji,
            case when tglrealisasi <= '$bulan' and idjenisanggaran = 3 then sum(totalbelanja) end as totalsemuabulangaji,
            case when tglrealisasi < '$bulan' and idjenisanggaran = 4 then sum(totalbelanja) end as jumlahspjsdbulanlalubarangjasa,
            case when tglrealisasi = '$bulan' and idjenisanggaran = 4 then sum(totalbelanja) end as jumlahspjbulaninibarangjasa,
            case when tglrealisasi <= '$bulan' and idjenisanggaran = 4 then sum(totalbelanja) end as totalsemuabulanbarangjasa
            from(
                select ja.id idjenisanggaran, TO_CHAR(x.tglrealisasi, 'MM') tglrealisasi, 'tidak' as bold, RANK ( ) OVER ( order by ka.kode ) AS nourut, map3.kode || '.' || map2.kode || '.' || map1.kode kode,
                map1.mataanggaranpermen keterangan, sum(kb.subtotal) jumlahanggaran, x.totalbelanja
                from mataanggaran_m ma
                inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                inner join mataanggaran_m ma3 on ma.kodemataanggaran ilike ma3.kodemataanggaran || '.%'
                and 
              case 
                    when ma3.kodemataanggaran ilike 'I.%' then char_length(ma3.kodemataanggaran) = 5
                    when ma3.kodemataanggaran ilike 'I.%' then char_length(ma3.kodemataanggaran) = 6
                    when ma3.kodemataanggaran ilike 'III.%' then char_length(ma3.kodemataanggaran) = 7
                end 
                inner join jenisanggaran_m ja on ja.id = ma3.objectjenisanggaranfk
                inner join mataanggaranpermen_m map on map.id = ma.mataanggaranpermenfk
                inner join mataanggaranpermen_m map1 on map1.id = map.mataanggaranpermenfk and map1.div = 4
                inner join mataanggaranpermen_m map2 on map2.id = map1.mataanggaranpermenfk and map2.div = 3
                inner join mataanggaranpermen_m map3 on map3.id = map2.mataanggaranpermenfk and map3.div = 2
                inner join (
                    select ma.kodemataanggaran, ma.namamataanggaran, sr.totalbelanja, sr.tglrealisasi
                    from mataanggaran_m ma
                    inner join strukrealisasi_t sr on ma.id=sr.objectmataanggaranfk
                    where sr.kdprofile = 30 and sr.statusenabled = true
                    and sr.status = 'Sudah Diverifikasi'
                    and extract(year from sr.tglrealisasi) = '$tahun'
                    and TO_CHAR(sr.tglrealisasi, 'YYYY-MM') in(
                        SELECT TO_CHAR(months, 'YYYY-MM') AS dateMonth
                        FROM generate_series(
                        '2022-01-01' :: DATE,
                        '2022-11-28' :: DATE ,
                        '1 month'
                        ) AS months
                    )
                ) as x on x.kodemataanggaran = ma.kodemataanggaran
                where ma.kdprofile = 30 and ma.statusenabled = true
                and kb.kdprofile = 30 and kb.statusenabled = true
                and ka.kdprofile = 30 and ka.statusenabled = true
                group by ja.id, TO_CHAR(x.tglrealisasi, 'MM'), ka.kode, map3.kode || '.' || map2.kode || '.' || map1.kode, map1.mataanggaranpermen, x.totalbelanja
                order by nourut
            ) as y group by idjenisanggaran, bold, nourut, kode, keterangan, jumlahanggaran, tglrealisasi order by nourut
        ) as a group by bold, nourut, kode, keterangan, jumlahanggaran
        
        union all
        
        select bold, nourut, kode, keterangan, jumlahanggaran,
        coalesce(sum(jumlahspjsdbulanlalugaji),0) jumlahspjsdbulanlalugaji,
        coalesce(sum(jumlahspjbulaninigaji),0) jumlahspjbulaninigaji, 
        coalesce(sum(totalsemuabulangaji),0) totalsemuabulangaji,
        coalesce(sum(jumlahspjsdbulanlalubarangjasa),0) jumlahspjsdbulanlalubarangjasa,
        coalesce(sum(jumlahspjbulaninibarangjasa),0) jumlahspjbulaninibarangjasa, 
        coalesce(sum(totalsemuabulanbarangjasa),0) totalsemuabulanbarangjasa
        from(
            select bold, nourut, kode, keterangan, jumlahanggaran,
            case when tglrealisasi < '$bulan' and idjenisanggaran = 3 then sum(totalbelanja) end as jumlahspjsdbulanlalugaji,
            case when tglrealisasi = '$bulan' and idjenisanggaran = 3 then sum(totalbelanja) end as jumlahspjbulaninigaji,
            case when tglrealisasi <= '$bulan' and idjenisanggaran = 3 then sum(totalbelanja) end as totalsemuabulangaji,
            case when tglrealisasi < '$bulan' and idjenisanggaran = 4 then sum(totalbelanja) end as jumlahspjsdbulanlalubarangjasa,
            case when tglrealisasi = '$bulan' and idjenisanggaran = 4 then sum(totalbelanja) end as jumlahspjbulaninibarangjasa,
            case when tglrealisasi <= '$bulan' and idjenisanggaran = 4 then sum(totalbelanja) end as totalsemuabulanbarangjasa
            from(
                select ja.id idjenisanggaran, TO_CHAR(x.tglrealisasi, 'MM') tglrealisasi, 'tidak' as bold, RANK ( ) OVER ( order by ka.kode ) AS nourut, map3.kode || '.' || map2.kode kode,
                map2.mataanggaranpermen keterangan, sum(kb.subtotal) jumlahanggaran, x.totalbelanja
                from mataanggaran_m ma
                inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                inner join mataanggaran_m ma3 on ma.kodemataanggaran ilike ma3.kodemataanggaran || '.%'
                and 
              case 
                    when ma3.kodemataanggaran ilike 'I.%' then char_length(ma3.kodemataanggaran) = 5
                    when ma3.kodemataanggaran ilike 'I.%' then char_length(ma3.kodemataanggaran) = 6
                    when ma3.kodemataanggaran ilike 'III.%' then char_length(ma3.kodemataanggaran) = 7
                end 
                inner join jenisanggaran_m ja on ja.id = ma3.objectjenisanggaranfk
                inner join mataanggaranpermen_m map on map.id = ma.mataanggaranpermenfk
                inner join mataanggaranpermen_m map1 on map1.id = map.mataanggaranpermenfk and map1.div = 4
                inner join mataanggaranpermen_m map2 on map2.id = map1.mataanggaranpermenfk and map2.div = 3
                inner join mataanggaranpermen_m map3 on map3.id = map2.mataanggaranpermenfk and map3.div = 2
                inner join (
                    select ma.kodemataanggaran, ma.namamataanggaran, sr.totalbelanja, sr.tglrealisasi
                    from mataanggaran_m ma
                    inner join strukrealisasi_t sr on ma.id=sr.objectmataanggaranfk
                    where sr.kdprofile = 30 and sr.statusenabled = true
                    and sr.status = 'Sudah Diverifikasi'
                    and extract(year from sr.tglrealisasi) = '$tahun'
                    and TO_CHAR(sr.tglrealisasi, 'YYYY-MM') in(
                        SELECT TO_CHAR(months, 'YYYY-MM') AS dateMonth
                        FROM generate_series(
                        '2022-01-01' :: DATE,
                        '2022-11-28' :: DATE ,
                        '1 month'
                        ) AS months
                    )
                ) as x on x.kodemataanggaran = ma.kodemataanggaran
                where ma.kdprofile = 30 and ma.statusenabled = true
                and kb.kdprofile = 30 and kb.statusenabled = true
                and ka.kdprofile = 30 and ka.statusenabled = true
                group by ja.id, TO_CHAR(x.tglrealisasi, 'MM'), ka.kode, map3.kode || '.' || map2.kode, map2.mataanggaranpermen, x.totalbelanja
                order by nourut
            ) as y group by idjenisanggaran, bold, nourut, kode, keterangan, jumlahanggaran, tglrealisasi order by nourut
        ) as a group by bold, nourut, kode, keterangan, jumlahanggaran
        
        union all
        
        select bold, nourut, kode, keterangan, jumlahanggaran,
        coalesce(sum(jumlahspjsdbulanlalugaji),0) jumlahspjsdbulanlalugaji,
        coalesce(sum(jumlahspjbulaninigaji),0) jumlahspjbulaninigaji, 
        coalesce(sum(totalsemuabulangaji),0) totalsemuabulangaji,
        coalesce(sum(jumlahspjsdbulanlalubarangjasa),0) jumlahspjsdbulanlalubarangjasa,
        coalesce(sum(jumlahspjbulaninibarangjasa),0) jumlahspjbulaninibarangjasa, 
        coalesce(sum(totalsemuabulanbarangjasa),0) totalsemuabulanbarangjasa
        from(
            select bold, nourut, kode, keterangan, jumlahanggaran,
            case when tglrealisasi < '$bulan' and idjenisanggaran = 3 then sum(totalbelanja) end as jumlahspjsdbulanlalugaji,
            case when tglrealisasi = '$bulan' and idjenisanggaran = 3 then sum(totalbelanja) end as jumlahspjbulaninigaji,
            case when tglrealisasi <= '$bulan' and idjenisanggaran = 3 then sum(totalbelanja) end as totalsemuabulangaji,
            case when tglrealisasi < '$bulan' and idjenisanggaran = 4 then sum(totalbelanja) end as jumlahspjsdbulanlalubarangjasa,
            case when tglrealisasi = '$bulan' and idjenisanggaran = 4 then sum(totalbelanja) end as jumlahspjbulaninibarangjasa,
            case when tglrealisasi <= '$bulan' and idjenisanggaran = 4 then sum(totalbelanja) end as totalsemuabulanbarangjasa
            from(
                select ja.id idjenisanggaran, TO_CHAR(x.tglrealisasi, 'MM') tglrealisasi, 'tidak' as bold, RANK ( ) OVER ( order by ka.kode ) AS nourut, map3.kode,
                map3.mataanggaranpermen keterangan, sum(kb.subtotal) jumlahanggaran, x.totalbelanja
                from mataanggaran_m ma
                inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                inner join mataanggaran_m ma3 on ma.kodemataanggaran ilike ma3.kodemataanggaran || '.%'
                and 
              case 
                    when ma3.kodemataanggaran ilike 'I.%' then char_length(ma3.kodemataanggaran) = 5
                    when ma3.kodemataanggaran ilike 'I.%' then char_length(ma3.kodemataanggaran) = 6
                    when ma3.kodemataanggaran ilike 'III.%' then char_length(ma3.kodemataanggaran) = 7
                end 
                inner join jenisanggaran_m ja on ja.id = ma3.objectjenisanggaranfk
                inner join mataanggaranpermen_m map on map.id = ma.mataanggaranpermenfk
                inner join mataanggaranpermen_m map1 on map1.id = map.mataanggaranpermenfk and map1.div = 4
                inner join mataanggaranpermen_m map2 on map2.id = map1.mataanggaranpermenfk and map2.div = 3
                inner join mataanggaranpermen_m map3 on map3.id = map2.mataanggaranpermenfk and map3.div = 2
                inner join (
                    select ma.kodemataanggaran, ma.namamataanggaran, sr.totalbelanja, sr.tglrealisasi
                    from mataanggaran_m ma
                    inner join strukrealisasi_t sr on ma.id=sr.objectmataanggaranfk
                    where sr.kdprofile = 30 and sr.statusenabled = true
                    and sr.status = 'Sudah Diverifikasi'
                    and extract(year from sr.tglrealisasi) = '$tahun'
                    and TO_CHAR(sr.tglrealisasi, 'YYYY-MM') in(
                        SELECT TO_CHAR(months, 'YYYY-MM') AS dateMonth
                        FROM generate_series(
                        '2022-01-01' :: DATE,
                        '2022-11-28' :: DATE ,
                        '1 month'
                        ) AS months
                    )
                ) as x on x.kodemataanggaran = ma.kodemataanggaran
                where ma.kdprofile = 30 and ma.statusenabled = true
                and kb.kdprofile = 30 and kb.statusenabled = true
                and ka.kdprofile = 30 and ka.statusenabled = true
                group by ja.id, TO_CHAR(x.tglrealisasi, 'MM'), ka.kode, map3.kode, map3.mataanggaranpermen, x.totalbelanja
                order by nourut
            ) as y group by idjenisanggaran, bold, nourut, kode, keterangan, jumlahanggaran, tglrealisasi order by nourut
        ) as a group by bold, nourut, kode, keterangan, jumlahanggaran
        
        union all
        
        select bold, nourut, kode, keterangan, coalesce(sum(jumlahanggaran), 0) jumlahanggaran,
        coalesce(sum(jumlahspjsdbulanlalugaji),0) jumlahspjsdbulanlalugaji,
        coalesce(sum(jumlahspjbulaninigaji),0) jumlahspjbulaninigaji, 
        coalesce(sum(totalsemuabulangaji),0) totalsemuabulangaji,
        coalesce(sum(jumlahspjsdbulanlalubarangjasa),0) jumlahspjsdbulanlalubarangjasa,
        coalesce(sum(jumlahspjbulaninibarangjasa),0) jumlahspjbulaninibarangjasa, 
        coalesce(sum(totalsemuabulanbarangjasa),0) totalsemuabulanbarangjasa
        from(
            select 'iya' as bold, nourut, kode, keterangan, jumlahanggaran,
            case when tglrealisasi < '$bulan' and idjenisanggaran = 3 then sum(totalbelanja) end as jumlahspjsdbulanlalugaji,
            case when tglrealisasi = '$bulan' and idjenisanggaran = 3 then sum(totalbelanja) end as jumlahspjbulaninigaji,
            case when tglrealisasi <= '$bulan' and idjenisanggaran = 3 then sum(totalbelanja) end as totalsemuabulangaji,
            case when tglrealisasi < '$bulan' and idjenisanggaran = 4 then sum(totalbelanja) end as jumlahspjsdbulanlalubarangjasa,
            case when tglrealisasi = '$bulan' and idjenisanggaran = 4 then sum(totalbelanja) end as jumlahspjbulaninibarangjasa,
            case when tglrealisasi <= '$bulan' and idjenisanggaran = 4 then sum(totalbelanja) end as totalsemuabulanbarangjasa
            from(
                select ja.id idjenisanggaran, TO_CHAR(x.tglrealisasi, 'MM') tglrealisasi, RANK ( ) OVER ( order by dp0.kode ) AS nourut, dp0.kode,
                dp0.keterangan, sum(kb.subtotal) jumlahanggaran, x.totalbelanja
                from mataanggaran_m ma
                inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                inner join kegiatananggaran_m as dp0 on ka.kode ilike dp0.kode || '%' and dp0.div = 3
                inner join mataanggaran_m ma3 on ma.kodemataanggaran ilike ma3.kodemataanggaran || '.%'
                and 
              case 
                    when ma3.kodemataanggaran ilike 'I.%' then char_length(ma3.kodemataanggaran) = 5
                    when ma3.kodemataanggaran ilike 'I.%' then char_length(ma3.kodemataanggaran) = 6
                    when ma3.kodemataanggaran ilike 'III.%' then char_length(ma3.kodemataanggaran) = 7
                end 
                inner join jenisanggaran_m ja on ja.id = ma3.objectjenisanggaranfk
                inner join mataanggaranpermen_m map on map.id = ma.mataanggaranpermenfk
                inner join mataanggaranpermen_m map1 on map1.id = map.mataanggaranpermenfk and map1.div = 4
                inner join mataanggaranpermen_m map2 on map2.id = map1.mataanggaranpermenfk and map2.div = 3
                inner join mataanggaranpermen_m map3 on map3.id = map2.mataanggaranpermenfk and map3.div = 2
                inner join (
                    select ma.kodemataanggaran, ma.namamataanggaran, sr.totalbelanja, sr.tglrealisasi
                    from mataanggaran_m ma
                    inner join strukrealisasi_t sr on ma.id=sr.objectmataanggaranfk
                    where sr.kdprofile = 30 and sr.statusenabled = true
                    and sr.status = 'Sudah Diverifikasi'
                    and extract(year from sr.tglrealisasi) = '$tahun'
                    and TO_CHAR(sr.tglrealisasi, 'YYYY-MM') in(
                        SELECT TO_CHAR(months, 'YYYY-MM') AS dateMonth
                        FROM generate_series(
                        '2022-01-01' :: DATE,
                        '2022-11-28' :: DATE ,
                        '1 month'
                    ) AS months
                    )
                ) as x on x.kodemataanggaran = ma.kodemataanggaran
                where ma.kdprofile = 30 and ma.statusenabled = true
                and kb.kdprofile = 30 and kb.statusenabled = true
                and ka.kdprofile = 30 and ka.statusenabled = true
                group by ja.id, TO_CHAR(x.tglrealisasi, 'MM'), dp0.kode, dp0.keterangan, x.totalbelanja
            ) as y group by idjenisanggaran, bold, nourut, kode, keterangan, jumlahanggaran, tglrealisasi order by nourut
        ) as a group by bold, nourut, kode, keterangan
        
        union all
        
        select bold, nourut, kode, keterangan, coalesce(sum(jumlahanggaran), 0) jumlahanggaran,
        coalesce(sum(jumlahspjsdbulanlalugaji),0) jumlahspjsdbulanlalugaji,
        coalesce(sum(jumlahspjbulaninigaji),0) jumlahspjbulaninigaji, 
        coalesce(sum(totalsemuabulangaji),0) totalsemuabulangaji,
        coalesce(sum(jumlahspjsdbulanlalubarangjasa),0) jumlahspjsdbulanlalubarangjasa,
        coalesce(sum(jumlahspjbulaninibarangjasa),0) jumlahspjbulaninibarangjasa, 
        coalesce(sum(totalsemuabulanbarangjasa),0) totalsemuabulanbarangjasa
        from(
            select 'iya' as bold, nourut, kode, keterangan, jumlahanggaran,
            case when tglrealisasi < '$bulan' and idjenisanggaran = 3 then sum(totalbelanja) end as jumlahspjsdbulanlalugaji,
            case when tglrealisasi = '$bulan' and idjenisanggaran = 3 then sum(totalbelanja) end as jumlahspjbulaninigaji,
            case when tglrealisasi <= '$bulan' and idjenisanggaran = 3 then sum(totalbelanja) end as totalsemuabulangaji,
            case when tglrealisasi < '$bulan' and idjenisanggaran = 4 then sum(totalbelanja) end as jumlahspjsdbulanlalubarangjasa,
            case when tglrealisasi = '$bulan' and idjenisanggaran = 4 then sum(totalbelanja) end as jumlahspjbulaninibarangjasa,
            case when tglrealisasi <= '$bulan' and idjenisanggaran = 4 then sum(totalbelanja) end as totalsemuabulanbarangjasa
            from(
                select ja.id idjenisanggaran, TO_CHAR(x.tglrealisasi, 'MM') tglrealisasi, RANK ( ) OVER ( order by dp0.kode ) AS nourut, dp0.kode,
                dp0.keterangan, sum(kb.subtotal) jumlahanggaran, x.totalbelanja
                from mataanggaran_m ma
                inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                inner join kegiatananggaran_m as dp0 on ka.kode ilike dp0.kode || '%' and dp0.div = 2
                inner join mataanggaran_m ma3 on ma.kodemataanggaran ilike ma3.kodemataanggaran || '.%'
                and 
              case 
                    when ma3.kodemataanggaran ilike 'I.%' then char_length(ma3.kodemataanggaran) = 5
                    when ma3.kodemataanggaran ilike 'I.%' then char_length(ma3.kodemataanggaran) = 6
                    when ma3.kodemataanggaran ilike 'III.%' then char_length(ma3.kodemataanggaran) = 7
                end 
                inner join jenisanggaran_m ja on ja.id = ma3.objectjenisanggaranfk
                inner join mataanggaranpermen_m map on map.id = ma.mataanggaranpermenfk
                inner join mataanggaranpermen_m map1 on map1.id = map.mataanggaranpermenfk and map1.div = 4
                inner join mataanggaranpermen_m map2 on map2.id = map1.mataanggaranpermenfk and map2.div = 3
                inner join mataanggaranpermen_m map3 on map3.id = map2.mataanggaranpermenfk and map3.div = 2
                inner join (
                    select ma.kodemataanggaran, ma.namamataanggaran, sr.totalbelanja, sr.tglrealisasi
                    from mataanggaran_m ma
                    inner join strukrealisasi_t sr on ma.id=sr.objectmataanggaranfk
                    where sr.kdprofile = 30 and sr.statusenabled = true
                    and sr.status = 'Sudah Diverifikasi'
                    and extract(year from sr.tglrealisasi) = '$tahun'
                    and TO_CHAR(sr.tglrealisasi, 'YYYY-MM') in(
                        SELECT TO_CHAR(months, 'YYYY-MM') AS dateMonth
                        FROM generate_series(
                        '2022-01-01' :: DATE,
                        '2022-11-28' :: DATE ,
                        '1 month'
                    ) AS months
                    )
                ) as x on x.kodemataanggaran = ma.kodemataanggaran
                where ma.kdprofile = 30 and ma.statusenabled = true
                and kb.kdprofile = 30 and kb.statusenabled = true
                and ka.kdprofile = 30 and ka.statusenabled = true
                group by ja.id, TO_CHAR(x.tglrealisasi, 'MM'), dp0.kode, dp0.keterangan, x.totalbelanja
            ) as y group by idjenisanggaran, bold, nourut, kode, keterangan, jumlahanggaran, tglrealisasi order by nourut
        ) as a group by bold, nourut, kode, keterangan
        order by nourut, bold, kode;"));

        $total = DB::select(DB::raw("select coalesce(sum(jumlahanggaran), 0) jumlahanggaran,
        coalesce(sum(jumlahspjsdbulanlalugaji),0) jumlahspjsdbulanlalugaji,
        coalesce(sum(jumlahspjbulaninigaji),0) jumlahspjbulaninigaji, 
        coalesce(sum(totalsemuabulangaji),0) totalsemuabulangaji,
        coalesce(sum(jumlahspjsdbulanlalubarangjasa),0) jumlahspjsdbulanlalubarangjasa,
        coalesce(sum(jumlahspjbulaninibarangjasa),0) jumlahspjbulaninibarangjasa, 
        coalesce(sum(totalsemuabulanbarangjasa),0) totalsemuabulanbarangjasa
        from(
            select 'iya' as bold, nourut, kode, keterangan, jumlahanggaran,
            case when tglrealisasi < '$bulan' and idjenisanggaran = 3 then sum(totalbelanja) end as jumlahspjsdbulanlalugaji,
            case when tglrealisasi = '$bulan' and idjenisanggaran = 3 then sum(totalbelanja) end as jumlahspjbulaninigaji,
            case when tglrealisasi <= '$bulan' and idjenisanggaran = 3 then sum(totalbelanja) end as totalsemuabulangaji,
            case when tglrealisasi < '$bulan' and idjenisanggaran = 4 then sum(totalbelanja) end as jumlahspjsdbulanlalubarangjasa,
            case when tglrealisasi = '$bulan' and idjenisanggaran = 4 then sum(totalbelanja) end as jumlahspjbulaninibarangjasa,
            case when tglrealisasi <= '$bulan' and idjenisanggaran = 4 then sum(totalbelanja) end as totalsemuabulanbarangjasa
            from(
                select ja.id idjenisanggaran, TO_CHAR(x.tglrealisasi, 'MM') tglrealisasi, RANK ( ) OVER ( order by dp0.kode ) AS nourut, dp0.kode,
                dp0.keterangan, sum(kb.subtotal) jumlahanggaran, x.totalbelanja
                from mataanggaran_m ma
                inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                inner join kegiatananggaran_m as dp0 on ka.kode ilike dp0.kode || '%' and dp0.div = 2
                inner join mataanggaran_m ma3 on ma.kodemataanggaran ilike ma3.kodemataanggaran || '.%'
                and 
              case 
                    when ma3.kodemataanggaran ilike 'I.%' then char_length(ma3.kodemataanggaran) = 5
                    when ma3.kodemataanggaran ilike 'I.%' then char_length(ma3.kodemataanggaran) = 6
                    when ma3.kodemataanggaran ilike 'III.%' then char_length(ma3.kodemataanggaran) = 7
                end 
                inner join jenisanggaran_m ja on ja.id = ma3.objectjenisanggaranfk
                inner join mataanggaranpermen_m map on map.id = ma.mataanggaranpermenfk
                inner join mataanggaranpermen_m map1 on map1.id = map.mataanggaranpermenfk and map1.div = 4
                inner join mataanggaranpermen_m map2 on map2.id = map1.mataanggaranpermenfk and map2.div = 3
                inner join mataanggaranpermen_m map3 on map3.id = map2.mataanggaranpermenfk and map3.div = 2
                inner join (
                    select ma.kodemataanggaran, ma.namamataanggaran, sr.totalbelanja, sr.tglrealisasi
                    from mataanggaran_m ma
                    inner join strukrealisasi_t sr on ma.id=sr.objectmataanggaranfk
                    where sr.kdprofile = 30 and sr.statusenabled = true
                    and sr.status = 'Sudah Diverifikasi'
                    and extract(year from sr.tglrealisasi) = '$tahun'
                    and TO_CHAR(sr.tglrealisasi, 'YYYY-MM') in(
                        SELECT TO_CHAR(months, 'YYYY-MM') AS dateMonth
                        FROM generate_series(
                        '2022-01-01' :: DATE,
                        '2022-11-28' :: DATE ,
                        '1 month'
                    ) AS months
                    )
                ) as x on x.kodemataanggaran = ma.kodemataanggaran
                where ma.kdprofile = 30 and ma.statusenabled = true
                and kb.kdprofile = 30 and kb.statusenabled = true
                and ka.kdprofile = 30 and ka.statusenabled = true
                group by ja.id, TO_CHAR(x.tglrealisasi, 'MM'), dp0.kode, dp0.keterangan, x.totalbelanja
            ) as y group by idjenisanggaran, bold, nourut, kode, keterangan, jumlahanggaran, tglrealisasi order by nourut
        ) as a"));

        $penerimaan = DB::select(DB::raw("select 'false' padding, text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
        from(
            select 'Transfer Bendahara Penerima' as text, 'LLLLL' kode, 6 div, 0 subtotal, 
            case when extract(month from tglspp) < '$bulan' then sum(nilaispp) else 0 end as totalbulanlalu,
            case when extract(month from tglspp) = '$bulan' then sum(nilaispp) else 0 end as totalbulanini
                from spp_t
            where kdprofile = 30 and statusenabled = true
            and extract(month from tglspp) <= '$bulan'
            and extract(year from tglspp) = '$tahun'
            group by extract(month from tglspp)
        
            union all
        
            select 'Transfer Bendahara Penerima' as text, 'LLLLL' kode, 6 div, 0 subtotal, 
            case when extract(month from tglspm) < '$bulan' then sum(nilaispm) else 0 end as totalbulanlalu,
            case when extract(month from tglspm) = '$bulan' then sum(nilaispm) else 0 end as totalbulanini
                from spm_t
            where kdprofile = 30 and statusenabled = true
            and extract(month from tglspm) <= '$bulan'
            and extract(year from tglspm) = '$tahun'
            group by extract(month from tglspm)
        ) as x
        group by text, kode, div, subtotal
        
        union all
        
        select 'false' padding, text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
        from(
            select 'Jasa Giro' as text, 'MMMMM' kode, 7 div, 0 subtotal, 
            case when extract(month from tglpemasukan) < '$bulan' then sum(jumlahpemasukan) else 0 end as totalbulanlalu,
            case when extract(month from tglpemasukan) = '$bulan' then sum(jumlahpemasukan) else 0 end as totalbulanini
                from jasagiro_t
            where kdprofile = 30 and statusenabled = true
            and extract(month from tglpemasukan) <= '$bulan'
            and extract(year from tglpemasukan) = '$tahun'
            group by uraianjasagiro, nojasagiro, extract(month from tglpemasukan)
        ) as x
        group by text, kode, div, subtotal

		union all

		select 'false' padding, text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
		from(
			select 'STS' as text, 'MMMMM' kode, 18 div, 0 subtotal, 
			case when extract(month from tglsts) < '$bulan' then sum(nilaists::float8) else 0 end as totalbulanlalu,
			case when extract(month from tglsts) = '$bulan' then sum(nilaists::float8) else 0 end as totalbulanini
				from stskeuangan_t
			where kdprofile = 30 and statusenabled = true
			and extract(month from tglsts) <= '$bulan'
            and extract(year from tglsts) = '$tahun'
			group by uraiansts, extract(month from tglsts)
		) as x
		group by text, kode, div, subtotal
        
        union all
        
        select 'false' padding, text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
        from(
            select 'Potongan Pajak' as text, 'OOOOO' kode, 8 div, 0 subtotal, 
            case when extract(month from tglpph) < '$bulan' then sum(ppn+pph) else 0 end as totalbulanlalu,
            case when extract(month from tglpph) = '$bulan' then sum(ppn+pph) else 0 end as totalbulanini
                from penyetoranpajak_t pp
            where kdprofile = 30 and statusenabled = true
            and extract(month from tglpph) <= '$bulan'
            and extract(year from tglpph) = '$tahun'
            group by uraianpajak, extract(month from tglpph)
        ) as x
        group by text, kode, div, subtotal
        
        union all
        
        select 'true' padding, text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
        from(
            select 'PPN' as text, 'OOOOO' kode, 9 div, 0 subtotal, 
            case when extract(month from tglpph) < '$bulan' then sum(ppn) else 0 end as totalbulanlalu,
            case when extract(month from tglpph) = '$bulan' then sum(ppn) else 0 end as totalbulanini
                from penyetoranpajak_t pp
            where kdprofile = 30 and statusenabled = true
            and extract(month from tglpph) <= '$bulan'
            and extract(year from tglpph) = '$tahun'
            group by extract(month from tglpph)
        ) as x
        group by text, kode, div, subtotal
        
        union all
        
        select 'true' padding, jp.jenispajak as text, 'OOOOO' kode, 9 div, 0 subtotal, 
        case when extract(month from tglpph) < '$bulan' then sum(pmp.pph) else 0 end as totalbulanlalu,
        case when extract(month from tglpph) = '$bulan' then sum(pmp.pph) else 0 end as totalbulanini
            from pemungutanpajak_t pmp
        inner join jenispajak_m jp on jp.id = pmp.objectjenispphfk
        where pmp.kdprofile = 30 and pmp.statusenabled = true
        and extract(month from pmp.tglpph) <= '$bulan'
        and extract(year from pmp.tglpph) = '$tahun'
        group by jp.jenispajak, extract(month from pmp.tglpph)"));

        $pengeluaran = DB::select(DB::raw("select 'false' padding, text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
        from(
            select 'SPJ' as text, 'RRRRR' kode, 10 div, 0 subtotal, 
            case when extract(month from tglrealisasi) < '$bulan' then sum(totalbelanja) else 0 end as totalbulanlalu,
            case when extract(month from tglrealisasi) = '$bulan' then sum(totalbelanja) else 0 end as totalbulanini
                from strukrealisasi_t
            where kdprofile = 30 and statusenabled = true
            and extract(month from tglrealisasi) <= '$bulan'
            and extract(year from tglrealisasi) = '$tahun'
            and status = 'Sudah Diverifikasi'
            group by extract(month from tglrealisasi)
        ) as x
        group by text, kode, div, subtotal
        
        union all
        
        select 'false' padding, text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
        from(
            select 'Jasa Giro' as text, 'SSSSS' kode, 11 div, 0 subtotal, 
            case when extract(month from tglpemasukan) < '$bulan' then sum(jumlahpemasukan) else 0 end as totalbulanlalu,
            case when extract(month from tglpemasukan) = '$bulan' then sum(jumlahpemasukan) else 0 end as totalbulanini
                from jasagiro_t
            where kdprofile = 30 and statusenabled = true
            and extract(month from tglpemasukan) <= '$bulan'
            and extract(year from tglpemasukan) = '$tahun'
            group by uraianjasagiro, nojasagiro, extract(month from tglpemasukan)
        ) as x
        group by text, kode, div, subtotal

		union all

		select 'false' padding, text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
		from(
			select 'STS' as text, 'TTTTT' kode, 12 div, 0 subtotal, 
			case when extract(month from tglsts) < '$bulan' then sum(nilaists::float8) else 0 end as totalbulanlalu,
			case when extract(month from tglsts) = '$bulan' then sum(nilaists::float8) else 0 end as totalbulanini
				from stskeuangan_t
			where kdprofile = 30 and statusenabled = true
			and extract(month from tglsts) <= '$bulan'
            and extract(year from tglsts) = '$tahun'
			group by uraiansts, extract(month from tglsts)
		) as x
		group by text, kode, div, subtotal
        
        union all
        
        select 'false' padding, text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
        from(
            select 'Penyetoran Pajak' as text, 'UUUUU' kode, 13 div, 0 subtotal, 
            case when extract(month from tglpph) < '$bulan' then sum(ppn+pph) else 0 end as totalbulanlalu,
            case when extract(month from tglpph) = '$bulan' then sum(ppn+pph) else 0 end as totalbulanini
                from penyetoranpajak_t pp
            where kdprofile = 30 and statusenabled = true
            and extract(month from tglpph) <= '$bulan'
            and extract(year from tglpph) = '$tahun'
            group by uraianpajak, extract(month from tglpph)
        ) as x
        group by text, kode, div, subtotal
        
        union all
        
        select 'true' padding, text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
        from(
            select 'PPN' as text, 'VVVVV' kode, 14 div, 0 subtotal, 
            case when extract(month from tglpph) < '$bulan' then sum(ppn) else 0 end as totalbulanlalu,
            case when extract(month from tglpph) = '$bulan' then sum(ppn) else 0 end as totalbulanini
                from penyetoranpajak_t pp
            where kdprofile = 30 and statusenabled = true
            and extract(month from tglpph) <= '$bulan'
            and extract(year from tglpph) = '$tahun'
            group by extract(month from tglpph)
        ) as x
        group by text, kode, div, subtotal
        
        union all
        
        select 'true' padding, jp.jenispajak as text, 'WWWWW' kode, 15 div, 0 subtotal, 
        case when extract(month from tglpph) < '$bulan' then sum(pmp.pph) else 0 end as totalbulanlalu,
        case when extract(month from tglpph) = '$bulan' then sum(pmp.pph) else 0 end as totalbulanini
            from pemungutanpajak_t pmp
        inner join jenispajak_m jp on jp.id = pmp.objectjenispphfk
        where pmp.kdprofile = 30 and pmp.statusenabled = true
        and extract(month from pmp.tglpph) <= '$bulan'
        and extract(year from pmp.tglpph) = '$tahun'
        group by jp.jenispajak, extract(month from pmp.tglpph)"));

        $iuran = DB::select(DB::raw("select text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
        from(
            select rd.uraian as text, 'RRRRR' kode, 10 div, 0 subtotal, 
            case when extract(month from sr.tglrealisasi) < '$bulan' then sum(rd.subtotal) else 0 end as totalbulanlalu,
            case when extract(month from sr.tglrealisasi) = '$bulan' then sum(rd.subtotal) else 0 end as totalbulanini
                from strukrealisasi_t sr
			inner join realisasidetail_t rd on rd.strukrealisasifk =sr.norec
            inner JOIN kegiatananggaran_m ka on ka.id=sr.objectkegiatanfk
            inner join kegiatananggaran_m as dp0 on ka.kode ilike dp0.kode || '%' and dp0.div = 3
            where sr.kdprofile = 30 and sr.statusenabled = true
			and rd.kdprofile = 30 and rd.statusenabled = true
            and ka.kdprofile = 30 and ka.statusenabled = true
            and dp0.kdprofile = 30 and dp0.statusenabled = true
            and extract(month from sr.tglrealisasi) <= '$bulan'
            and extract(year from sr.tglrealisasi) = '$tahun'
            and sr.status = 'Sudah Diverifikasi'
            and dp0.keterangan = 'Penyediaan Gaji dan Tunjangan ASN'
            group by rd.uraian, extract(month from sr.tglrealisasi)
        ) as x
        group by text, kode, div, subtotal"));

        $pageWidth = 950;
        
        return view('report.keuangan.pertanggungjawabanbaru',compact('data', 'pageWidth', 'total', 'penerimaan', 'pengeluaran', 'iuran', 'tahun', 'periode'));
    }

    public function CetakLO(Request $request){
        $tahun = $request['tahun'];

        $lalu = DB::select(DB::raw("SELECT extract('year' from(date '$tahun-12-28' - interval '1 year')) as tahun;"));

        $tahunlalu = $lalu[0]->tahun;

        $data = DB::select(DB::raw("select id, noaccount, namaaccount, sum(subtotalbulanlalu) subtotalbulanlalu, sum(subtotalbulanini) subtotalbulanini,
        case 
            when sum(subtotalbulanini) - sum(subtotalbulanlalu) >= 0 then sum(subtotalbulanini) - sum(subtotalbulanlalu)
            when sum(subtotalbulanini) - sum(subtotalbulanlalu) < 0 then (sum(subtotalbulanini) - sum(subtotalbulanlalu))*(-1)
        end as selisih,
        case 
            when sum(subtotalbulanini) != 0 and sum(subtotalbulanlalu) != 0 and sum(subtotalbulanini) - sum(subtotalbulanlalu) >= 0 then ((sum(subtotalbulanini) - sum(subtotalbulanlalu))/sum(subtotalbulanlalu))*100
            when sum(subtotalbulanini) != 0 and sum(subtotalbulanlalu) != 0 and sum(subtotalbulanini) - sum(subtotalbulanlalu) < 0 then (((sum(subtotalbulanini) - sum(subtotalbulanlalu))*(-1))/sum(subtotalbulanlalu))*100
            when sum(subtotalbulanini) != 0 or sum(subtotalbulanlalu) != 0 then 0
        end as persentase
        from(
            select id, noaccount, namaaccount, 
            case when tahun = '$tahunlalu' then sum(subtotal) else 0 end as subtotalbulanlalu,
            case when tahun = '$tahun' then sum(subtotal) else 0 end as subtotalbulanini
            from(
                select coa1.id, coa1.noaccount, coa1.namaaccount,
                ma.kodemataanggaran, ma.namamataanggaran,
                sum(kb.subtotal) subtotal, ka.tahun
                    from chartofaccount_m coa
                inner join mapcoatorekening_t mcr on coa.id = mcr.objectcoafk
                inner join mataanggaran_m ma on ma.id = mcr.objectmataanggaranfk
                inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                INNER JOIN chartofaccount_m coa5 on coa5.id=coa.objectaccountheadfk
                INNER JOIN chartofaccount_m coa4 on coa4.id=coa5.objectaccountheadfk
                INNER JOIN chartofaccount_m coa3 on coa3.id=coa4.objectaccountheadfk
                INNER JOIN chartofaccount_m coa2 on coa2.id=coa3.objectaccountheadfk
                INNER JOIN chartofaccount_m coa1 on coa1.id=coa2.objectaccountheadfk
                where coa.statusenabled = true
                and coa.kdprofile = 30
                and coa1.statusenabled = true
                and coa1.kdprofile = 30
                and coa2.statusenabled = true
                and coa2.kdprofile = 30
                and coa3.statusenabled = true
                and coa3.kdprofile = 30
                and coa4.statusenabled = true
                and coa4.kdprofile = 30
                and coa5.statusenabled = true
                and coa5.kdprofile = 30
                and mcr.statusenabled = true
                and mcr.kdprofile = 30
                and ma.statusenabled = true
                and ma.kdprofile = 30
                and kb.statusenabled = true
                and kb.kdprofile = 30
                and ka.statusenabled = true
                and ka.kdprofile = 30
                and ka.tahun in ('$tahunlalu','$tahun')
                and coa.objectjenisaccountfk = 1
                group by coa1.id, coa1.noaccount, coa1.namaaccount,
                ma.kodemataanggaran, ma.namamataanggaran, ka.tahun
        
                union all
        
                select coa2.id, coa1.noaccount || '.' || coa2.noaccount as noaccount, coa2.namaaccount,
                ma.kodemataanggaran, ma.namamataanggaran,
                sum(kb.subtotal) subtotal, ka.tahun
                    from chartofaccount_m coa
                inner join mapcoatorekening_t mcr on coa.id = mcr.objectcoafk
                inner join mataanggaran_m ma on ma.id = mcr.objectmataanggaranfk
                inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                INNER JOIN chartofaccount_m coa5 on coa5.id=coa.objectaccountheadfk
                INNER JOIN chartofaccount_m coa4 on coa4.id=coa5.objectaccountheadfk
                INNER JOIN chartofaccount_m coa3 on coa3.id=coa4.objectaccountheadfk
                INNER JOIN chartofaccount_m coa2 on coa2.id=coa3.objectaccountheadfk
                INNER JOIN chartofaccount_m coa1 on coa1.id=coa2.objectaccountheadfk
                where coa.statusenabled = true
                and coa.kdprofile = 30
                and coa1.statusenabled = true
                and coa1.kdprofile = 30
                and coa2.statusenabled = true
                and coa2.kdprofile = 30
                and coa3.statusenabled = true
                and coa3.kdprofile = 30
                and coa4.statusenabled = true
                and coa4.kdprofile = 30
                and coa5.statusenabled = true
                and coa5.kdprofile = 30
                and mcr.statusenabled = true
                and mcr.kdprofile = 30
                and ma.statusenabled = true
                and ma.kdprofile = 30
                and kb.statusenabled = true
                and kb.kdprofile = 30
                and ka.statusenabled = true
                and ka.kdprofile = 30
                and ka.tahun in ('$tahunlalu','$tahun')
                and coa.objectjenisaccountfk = 1
                group by coa2.id, coa1.noaccount || '.' || coa2.noaccount, coa2.namaaccount,
                ma.kodemataanggaran, ma.namamataanggaran, ka.tahun
        
                union all
        
                select coa3.id, coa1.noaccount || '.' || coa2.noaccount || '.' || coa3.noaccount as noaccount, coa3.namaaccount,
                ma.kodemataanggaran, ma.namamataanggaran,
                sum(kb.subtotal) subtotal, ka.tahun
                    from chartofaccount_m coa
                inner join mapcoatorekening_t mcr on coa.id = mcr.objectcoafk
                inner join mataanggaran_m ma on ma.id = mcr.objectmataanggaranfk
                inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                INNER JOIN chartofaccount_m coa5 on coa5.id=coa.objectaccountheadfk
                INNER JOIN chartofaccount_m coa4 on coa4.id=coa5.objectaccountheadfk
                INNER JOIN chartofaccount_m coa3 on coa3.id=coa4.objectaccountheadfk
                INNER JOIN chartofaccount_m coa2 on coa2.id=coa3.objectaccountheadfk
                INNER JOIN chartofaccount_m coa1 on coa1.id=coa2.objectaccountheadfk
                where coa.statusenabled = true
                and coa.kdprofile = 30
                and coa1.statusenabled = true
                and coa1.kdprofile = 30
                and coa2.statusenabled = true
                and coa2.kdprofile = 30
                and coa3.statusenabled = true
                and coa3.kdprofile = 30
                and coa4.statusenabled = true
                and coa4.kdprofile = 30
                and coa5.statusenabled = true
                and coa5.kdprofile = 30
                and mcr.statusenabled = true
                and mcr.kdprofile = 30
                and ma.statusenabled = true
                and ma.kdprofile = 30
                and kb.statusenabled = true
                and kb.kdprofile = 30
                and ka.statusenabled = true
                and ka.kdprofile = 30
                and ka.tahun in ('$tahunlalu','$tahun')
                and coa.objectjenisaccountfk = 1
                group by coa3.id, coa1.noaccount || '.' || coa2.noaccount || '.' || coa3.noaccount, coa3.namaaccount,
                ma.kodemataanggaran, ma.namamataanggaran, ka.tahun
        
                union all
        
                select coa4.id, coa1.noaccount || '.' || coa2.noaccount || '.' || coa3.noaccount || '.' || coa4.noaccount as noaccount, coa4.namaaccount,
                ma.kodemataanggaran, ma.namamataanggaran,
                sum(kb.subtotal) subtotal, ka.tahun
                    from chartofaccount_m coa
                inner join mapcoatorekening_t mcr on coa.id = mcr.objectcoafk
                inner join mataanggaran_m ma on ma.id = mcr.objectmataanggaranfk
                inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                INNER JOIN chartofaccount_m coa5 on coa5.id=coa.objectaccountheadfk
                INNER JOIN chartofaccount_m coa4 on coa4.id=coa5.objectaccountheadfk
                INNER JOIN chartofaccount_m coa3 on coa3.id=coa4.objectaccountheadfk
                INNER JOIN chartofaccount_m coa2 on coa2.id=coa3.objectaccountheadfk
                INNER JOIN chartofaccount_m coa1 on coa1.id=coa2.objectaccountheadfk
                where coa.statusenabled = true
                and coa.kdprofile = 30
                and coa1.statusenabled = true
                and coa1.kdprofile = 30
                and coa2.statusenabled = true
                and coa2.kdprofile = 30
                and coa3.statusenabled = true
                and coa3.kdprofile = 30
                and coa4.statusenabled = true
                and coa4.kdprofile = 30
                and coa5.statusenabled = true
                and coa5.kdprofile = 30
                and mcr.statusenabled = true
                and mcr.kdprofile = 30
                and ma.statusenabled = true
                and ma.kdprofile = 30
                and kb.statusenabled = true
                and kb.kdprofile = 30
                and ka.statusenabled = true
                and ka.kdprofile = 30
                and ka.tahun in ('$tahunlalu','$tahun')
                and coa.objectjenisaccountfk = 1
                group by coa4.id, coa1.noaccount || '.' || coa2.noaccount || '.' || coa3.noaccount || '.' || coa4.noaccount, coa4.namaaccount,
                ma.kodemataanggaran, ma.namamataanggaran, ka.tahun
        
                union all
        
                select coa5.id, coa1.noaccount || '.' || coa2.noaccount || '.' || coa3.noaccount || '.' || coa4.noaccount || '.' || coa5.noaccount as noaccount, coa5.namaaccount,
                ma.kodemataanggaran, ma.namamataanggaran,
                sum(kb.subtotal) subtotal, ka.tahun
                    from chartofaccount_m coa
                inner join mapcoatorekening_t mcr on coa.id = mcr.objectcoafk
                inner join mataanggaran_m ma on ma.id = mcr.objectmataanggaranfk
                inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                INNER JOIN chartofaccount_m coa5 on coa5.id=coa.objectaccountheadfk
                INNER JOIN chartofaccount_m coa4 on coa4.id=coa5.objectaccountheadfk
                INNER JOIN chartofaccount_m coa3 on coa3.id=coa4.objectaccountheadfk
                INNER JOIN chartofaccount_m coa2 on coa2.id=coa3.objectaccountheadfk
                INNER JOIN chartofaccount_m coa1 on coa1.id=coa2.objectaccountheadfk
                where coa.statusenabled = true
                and coa.kdprofile = 30
                and coa1.statusenabled = true
                and coa1.kdprofile = 30
                and coa2.statusenabled = true
                and coa2.kdprofile = 30
                and coa3.statusenabled = true
                and coa3.kdprofile = 30
                and coa4.statusenabled = true
                and coa4.kdprofile = 30
                and coa5.statusenabled = true
                and coa5.kdprofile = 30
                and mcr.statusenabled = true
                and mcr.kdprofile = 30
                and ma.statusenabled = true
                and ma.kdprofile = 30
                and kb.statusenabled = true
                and kb.kdprofile = 30
                and ka.statusenabled = true
                and ka.kdprofile = 30
                and ka.tahun in ('$tahunlalu','$tahun')
                and coa.objectjenisaccountfk = 1
                group by coa5.id, coa1.noaccount || '.' || coa2.noaccount || '.' || coa3.noaccount || '.' || coa4.noaccount || '.' || coa5.noaccount, coa5.namaaccount,
                ma.kodemataanggaran, ma.namamataanggaran, ka.tahun
        
                union all
        
                select coa.id, coa1.noaccount || '.' || coa2.noaccount || '.' || coa3.noaccount || '.' || coa4.noaccount || '.' || coa5.noaccount || '.' || coa.noaccount as noaccount, coa.namaaccount,
                ma.kodemataanggaran, ma.namamataanggaran,
                sum(kb.subtotal) subtotal, ka.tahun
                    from chartofaccount_m coa
                inner join mapcoatorekening_t mcr on coa.id = mcr.objectcoafk
                inner join mataanggaran_m ma on ma.id = mcr.objectmataanggaranfk
                inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                INNER JOIN chartofaccount_m coa5 on coa5.id=coa.objectaccountheadfk
                INNER JOIN chartofaccount_m coa4 on coa4.id=coa5.objectaccountheadfk
                INNER JOIN chartofaccount_m coa3 on coa3.id=coa4.objectaccountheadfk
                INNER JOIN chartofaccount_m coa2 on coa2.id=coa3.objectaccountheadfk
                INNER JOIN chartofaccount_m coa1 on coa1.id=coa2.objectaccountheadfk
                where coa.statusenabled = true
                and coa.kdprofile = 30
                and coa1.statusenabled = true
                and coa1.kdprofile = 30
                and coa2.statusenabled = true
                and coa2.kdprofile = 30
                and coa3.statusenabled = true
                and coa3.kdprofile = 30
                and coa4.statusenabled = true
                and coa4.kdprofile = 30
                and coa5.statusenabled = true
                and coa5.kdprofile = 30
                and mcr.statusenabled = true
                and mcr.kdprofile = 30
                and ma.statusenabled = true
                and ma.kdprofile = 30
                and kb.statusenabled = true
                and kb.kdprofile = 30
                and ka.statusenabled = true
                and ka.kdprofile = 30
                and ka.tahun in ('$tahunlalu','$tahun')
                and coa.objectjenisaccountfk = 1
                group by coa.id, coa1.noaccount || '.' || coa2.noaccount || '.' || coa3.noaccount || '.' || coa4.noaccount || '.' || coa5.noaccount || '.' || coa.noaccount, coa.namaaccount,
                ma.kodemataanggaran, ma.namamataanggaran, ka.tahun
            ) as x 
            group by id, noaccount, namaaccount, tahun
        ) as y
        group by id, noaccount, namaaccount
        order by noaccount;"));

        $pageWidth = 950;
        
        return view('report.akuntansi.lorinci',compact('data', 'pageWidth', 'tahun', 'tahunlalu'));
    }

    public function CetakLRA(Request $request){
        $tahun = $request['tahun'];

        $lalu = DB::select(DB::raw("SELECT extract('year' from(date '$tahun-12-28' - interval '1 year')) as tahun;"));

        $tahunlalu = $lalu[0]->tahun;

        $data = DB::select(DB::raw("select id, noaccount, namaaccount, sum(subtotalbulanini) subtotalbulanini,
        sum(totalbelanjabulanini) totalbelanjabulanini, sum(totalbelanjabulanlalu) totalbelanjabulanlalu,
        case
        when sum(totalbelanjabulanini) != 0 and sum(totalbelanjabulanlalu) != 0 then (sum(totalbelanjabulanini)/sum(totalbelanjabulanlalu))*100
        when sum(totalbelanjabulanini) != 0 or sum(totalbelanjabulanlalu) != 0 then 0
        end as persentase
        from(
            select id, noaccount, namaaccount,
            case when tahun = '$tahunlalu' then sum(subtotal) else 0 end as subtotalbulanlalu,
            case when tahun = '$tahun' then sum(subtotal) else 0 end as subtotalbulanini,
            case when tahun = '$tahunlalu' then sum(totalbelanja) else 0 end as totalbelanjabulanlalu,
            case when tahun = '$tahun' then sum(totalbelanja) else 0 end as totalbelanjabulanini
            from(
                select coa1.id, coa1.noaccount, coa1.namaaccount,
                ma.kodemataanggaran, ma.namamataanggaran,
                kb.subtotal, ka.tahun, sum(sr.totalbelanja) totalbelanja, ka.keterangan
                from chartofaccount_m coa
                inner join mapcoatorekening_t mcr on coa.id = mcr.objectcoafk
                inner join mataanggaran_m ma on ma.id = mcr.objectmataanggaranfk
                inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                INNER JOIN strukrealisasi_t sr on sr.objectkegiatanfk=ka.id
                INNER JOIN chartofaccount_m coa5 on coa5.id=coa.objectaccountheadfk
                INNER JOIN chartofaccount_m coa4 on coa4.id=coa5.objectaccountheadfk
                INNER JOIN chartofaccount_m coa3 on coa3.id=coa4.objectaccountheadfk
                INNER JOIN chartofaccount_m coa2 on coa2.id=coa3.objectaccountheadfk
                INNER JOIN chartofaccount_m coa1 on coa1.id=coa2.objectaccountheadfk
                where coa.statusenabled = true
                and coa.kdprofile = 30
                and coa1.statusenabled = true
                and coa1.kdprofile = 30
                and coa2.statusenabled = true
                and coa2.kdprofile = 30
                and coa3.statusenabled = true
                and coa3.kdprofile = 30
                and coa4.statusenabled = true
                and coa4.kdprofile = 30
                and coa5.statusenabled = true
                and coa5.kdprofile = 30
                and mcr.statusenabled = true
                and mcr.kdprofile = 30
                and ma.statusenabled = true
                and ma.kdprofile = 30
                and kb.statusenabled = true
                and kb.kdprofile = 30
                and ka.statusenabled = true
                and ka.kdprofile = 30
                and sr.statusenabled = true
                and sr.kdprofile = 30
                and ka.tahun in ('$tahunlalu','$tahun')
                group by coa1.id, coa1.noaccount, coa1.namaaccount,kb.subtotal,
                ma.kodemataanggaran, ma.namamataanggaran, ka.tahun, ka.keterangan
        
                union all
        
                select coa2.id, coa1.noaccount || '.' || coa2.noaccount as noaccount, coa2.namaaccount,
                ma.kodemataanggaran, ma.namamataanggaran,
                kb.subtotal, ka.tahun, sum(sr.totalbelanja) totalbelanja, ka.keterangan
                from chartofaccount_m coa
                inner join mapcoatorekening_t mcr on coa.id = mcr.objectcoafk
                inner join mataanggaran_m ma on ma.id = mcr.objectmataanggaranfk
                inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                INNER JOIN strukrealisasi_t sr on sr.objectkegiatanfk=ka.id
                INNER JOIN chartofaccount_m coa5 on coa5.id=coa.objectaccountheadfk
                INNER JOIN chartofaccount_m coa4 on coa4.id=coa5.objectaccountheadfk
                INNER JOIN chartofaccount_m coa3 on coa3.id=coa4.objectaccountheadfk
                INNER JOIN chartofaccount_m coa2 on coa2.id=coa3.objectaccountheadfk
                INNER JOIN chartofaccount_m coa1 on coa1.id=coa2.objectaccountheadfk
                where coa.statusenabled = true
                and coa.kdprofile = 30
                and coa1.statusenabled = true
                and coa1.kdprofile = 30
                and coa2.statusenabled = true
                and coa2.kdprofile = 30
                and coa3.statusenabled = true
                and coa3.kdprofile = 30
                and coa4.statusenabled = true
                and coa4.kdprofile = 30
                and coa5.statusenabled = true
                and coa5.kdprofile = 30
                and mcr.statusenabled = true
                and mcr.kdprofile = 30
                and ma.statusenabled = true
                and ma.kdprofile = 30
                and kb.statusenabled = true
                and kb.kdprofile = 30
                and ka.statusenabled = true
                and ka.kdprofile = 30
                and sr.statusenabled = true
                and sr.kdprofile = 30
                and ka.tahun in ('$tahunlalu','$tahun')
                group by coa2.id, coa1.noaccount || '.' || coa2.noaccount, coa2.namaaccount,kb.subtotal,
                ma.kodemataanggaran, ma.namamataanggaran, ka.tahun, ka.keterangan
        
                union all
        
                select coa3.id, coa1.noaccount || '.' || coa2.noaccount || '.' || coa3.noaccount as noaccount, coa3.namaaccount,
                ma.kodemataanggaran, ma.namamataanggaran,
                kb.subtotal, ka.tahun, sum(sr.totalbelanja) totalbelanja, ka.keterangan
                from chartofaccount_m coa
                inner join mapcoatorekening_t mcr on coa.id = mcr.objectcoafk
                inner join mataanggaran_m ma on ma.id = mcr.objectmataanggaranfk
                inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                INNER JOIN strukrealisasi_t sr on sr.objectkegiatanfk=ka.id
                INNER JOIN chartofaccount_m coa5 on coa5.id=coa.objectaccountheadfk
                INNER JOIN chartofaccount_m coa4 on coa4.id=coa5.objectaccountheadfk
                INNER JOIN chartofaccount_m coa3 on coa3.id=coa4.objectaccountheadfk
                INNER JOIN chartofaccount_m coa2 on coa2.id=coa3.objectaccountheadfk
                INNER JOIN chartofaccount_m coa1 on coa1.id=coa2.objectaccountheadfk
                where coa.statusenabled = true
                and coa.kdprofile = 30
                and coa1.statusenabled = true
                and coa1.kdprofile = 30
                and coa2.statusenabled = true
                and coa2.kdprofile = 30
                and coa3.statusenabled = true
                and coa3.kdprofile = 30
                and coa4.statusenabled = true
                and coa4.kdprofile = 30
                and coa5.statusenabled = true
                and coa5.kdprofile = 30
                and mcr.statusenabled = true
                and mcr.kdprofile = 30
                and ma.statusenabled = true
                and ma.kdprofile = 30
                and kb.statusenabled = true
                and kb.kdprofile = 30
                and ka.statusenabled = true
                and ka.kdprofile = 30
                and sr.statusenabled = true
                and sr.kdprofile = 30
                and ka.tahun in ('$tahunlalu','$tahun')
                group by coa3.id, coa1.noaccount || '.' || coa2.noaccount || '.' || coa3.noaccount, coa3.namaaccount,kb.subtotal,
                ma.kodemataanggaran, ma.namamataanggaran, ka.tahun, ka.keterangan
        
                union all
        
                select coa4.id, coa1.noaccount || '.' || coa2.noaccount || '.' || coa3.noaccount || '.' || coa4.noaccount as noaccount, coa4.namaaccount,
                ma.kodemataanggaran, ma.namamataanggaran,
                kb.subtotal, ka.tahun, sum(sr.totalbelanja) totalbelanja, ka.keterangan
                from chartofaccount_m coa
                inner join mapcoatorekening_t mcr on coa.id = mcr.objectcoafk
                inner join mataanggaran_m ma on ma.id = mcr.objectmataanggaranfk
                inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                INNER JOIN strukrealisasi_t sr on sr.objectkegiatanfk=ka.id
                INNER JOIN chartofaccount_m coa5 on coa5.id=coa.objectaccountheadfk
                INNER JOIN chartofaccount_m coa4 on coa4.id=coa5.objectaccountheadfk
                INNER JOIN chartofaccount_m coa3 on coa3.id=coa4.objectaccountheadfk
                INNER JOIN chartofaccount_m coa2 on coa2.id=coa3.objectaccountheadfk
                INNER JOIN chartofaccount_m coa1 on coa1.id=coa2.objectaccountheadfk
                where coa.statusenabled = true
                and coa.kdprofile = 30
                and coa1.statusenabled = true
                and coa1.kdprofile = 30
                and coa2.statusenabled = true
                and coa2.kdprofile = 30
                and coa3.statusenabled = true
                and coa3.kdprofile = 30
                and coa4.statusenabled = true
                and coa4.kdprofile = 30
                and coa5.statusenabled = true
                and coa5.kdprofile = 30
                and mcr.statusenabled = true
                and mcr.kdprofile = 30
                and ma.statusenabled = true
                and ma.kdprofile = 30
                and kb.statusenabled = true
                and kb.kdprofile = 30
                and ka.statusenabled = true
                and ka.kdprofile = 30
                and sr.statusenabled = true
                and sr.kdprofile = 30
                and ka.tahun in ('$tahunlalu','$tahun')
                group by coa4.id, coa1.noaccount || '.' || coa2.noaccount || '.' || coa3.noaccount || '.' || coa4.noaccount, coa4.namaaccount,kb.subtotal,
                ma.kodemataanggaran, ma.namamataanggaran, ka.tahun, ka.keterangan
            
                union all
        
                select coa5.id, coa1.noaccount || '.' || coa2.noaccount || '.' || coa3.noaccount || '.' || coa4.noaccount || '.' || coa5.noaccount as noaccount, coa5.namaaccount,
                ma.kodemataanggaran, ma.namamataanggaran,
                kb.subtotal, ka.tahun, sum(sr.totalbelanja) totalbelanja, ka.keterangan
                from chartofaccount_m coa
                inner join mapcoatorekening_t mcr on coa.id = mcr.objectcoafk
                inner join mataanggaran_m ma on ma.id = mcr.objectmataanggaranfk
                inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                INNER JOIN strukrealisasi_t sr on sr.objectkegiatanfk=ka.id
                INNER JOIN chartofaccount_m coa5 on coa5.id=coa.objectaccountheadfk
                INNER JOIN chartofaccount_m coa4 on coa4.id=coa5.objectaccountheadfk
                INNER JOIN chartofaccount_m coa3 on coa3.id=coa4.objectaccountheadfk
                INNER JOIN chartofaccount_m coa2 on coa2.id=coa3.objectaccountheadfk
                INNER JOIN chartofaccount_m coa1 on coa1.id=coa2.objectaccountheadfk
                where coa.statusenabled = true
                and coa.kdprofile = 30
                and coa1.statusenabled = true
                and coa1.kdprofile = 30
                and coa2.statusenabled = true
                and coa2.kdprofile = 30
                and coa3.statusenabled = true
                and coa3.kdprofile = 30
                and coa4.statusenabled = true
                and coa4.kdprofile = 30
                and coa5.statusenabled = true
                and coa5.kdprofile = 30
                and mcr.statusenabled = true
                and mcr.kdprofile = 30
                and ma.statusenabled = true
                and ma.kdprofile = 30
                and kb.statusenabled = true
                and kb.kdprofile = 30
                and ka.statusenabled = true
                and ka.kdprofile = 30
                and sr.statusenabled = true
                and sr.kdprofile = 30
                and ka.tahun in ('$tahunlalu','$tahun')
                group by coa5.id, coa1.noaccount || '.' || coa2.noaccount || '.' || coa3.noaccount || '.' || coa4.noaccount || '.' || coa5.noaccount, coa5.namaaccount,kb.subtotal,
                ma.kodemataanggaran, ma.namamataanggaran, ka.tahun, ka.keterangan
        
                union all
        
                select coa.id, coa1.noaccount || '.' || coa2.noaccount || '.' || coa3.noaccount || '.' || coa4.noaccount || '.' || coa5.noaccount || '.' || coa.noaccount as noaccount, coa.namaaccount,
                ma.kodemataanggaran, ma.namamataanggaran,
                kb.subtotal, ka.tahun, sum(sr.totalbelanja) totalbelanja, ka.keterangan
                from chartofaccount_m coa
                inner join mapcoatorekening_t mcr on coa.id = mcr.objectcoafk
                inner join mataanggaran_m ma on ma.id = mcr.objectmataanggaranfk
                inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                INNER JOIN strukrealisasi_t sr on sr.objectkegiatanfk=ka.id
                INNER JOIN chartofaccount_m coa5 on coa5.id=coa.objectaccountheadfk
                INNER JOIN chartofaccount_m coa4 on coa4.id=coa5.objectaccountheadfk
                INNER JOIN chartofaccount_m coa3 on coa3.id=coa4.objectaccountheadfk
                INNER JOIN chartofaccount_m coa2 on coa2.id=coa3.objectaccountheadfk
                INNER JOIN chartofaccount_m coa1 on coa1.id=coa2.objectaccountheadfk
                where coa.statusenabled = true
                and coa.kdprofile = 30
                and coa1.statusenabled = true
                and coa1.kdprofile = 30
                and coa2.statusenabled = true
                and coa2.kdprofile = 30
                and coa3.statusenabled = true
                and coa3.kdprofile = 30
                and coa4.statusenabled = true
                and coa4.kdprofile = 30
                and coa5.statusenabled = true
                and coa5.kdprofile = 30
                and mcr.statusenabled = true
                and mcr.kdprofile = 30
                and ma.statusenabled = true
                and ma.kdprofile = 30
                and kb.statusenabled = true
                and kb.kdprofile = 30
                and ka.statusenabled = true
                and ka.kdprofile = 30
                and sr.statusenabled = true
                and sr.kdprofile = 30
                and ka.tahun in ('$tahunlalu','$tahun')
                group by coa.id, coa1.noaccount || '.' || coa2.noaccount || '.' || coa3.noaccount || '.' || coa4.noaccount || '.' || coa5.noaccount || '.' || coa.noaccount, coa.namaaccount,kb.subtotal,
                ma.kodemataanggaran, ma.namamataanggaran, ka.tahun, ka.keterangan
        
                union all
        
                select coa1.id, coa1.noaccount || '.' || coa2.noaccount || '.' || coa3.noaccount || '.' || coa4.noaccount || '.' || coa5.noaccount || '.' || coa.noaccount || '.0001' as noaccount, 'JUMLAH' || coa1.namaaccount,
                ma.kodemataanggaran, ma.namamataanggaran,
                kb.subtotal, ka.tahun, sum(sr.totalbelanja) totalbelanja, ka.keterangan
                from chartofaccount_m coa
                inner join mapcoatorekening_t mcr on coa.id = mcr.objectcoafk
                inner join mataanggaran_m ma on ma.id = mcr.objectmataanggaranfk
                inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                INNER JOIN strukrealisasi_t sr on sr.objectkegiatanfk=ka.id
                INNER JOIN chartofaccount_m coa5 on coa5.id=coa.objectaccountheadfk
                INNER JOIN chartofaccount_m coa4 on coa4.id=coa5.objectaccountheadfk
                INNER JOIN chartofaccount_m coa3 on coa3.id=coa4.objectaccountheadfk
                INNER JOIN chartofaccount_m coa2 on coa2.id=coa3.objectaccountheadfk
                INNER JOIN chartofaccount_m coa1 on coa1.id=coa2.objectaccountheadfk
                where coa.statusenabled = true
                and coa.kdprofile = 30
                and coa1.statusenabled = true
                and coa1.kdprofile = 30
                and coa2.statusenabled = true
                and coa2.kdprofile = 30
                and coa3.statusenabled = true
                and coa3.kdprofile = 30
                and coa4.statusenabled = true
                and coa4.kdprofile = 30
                and coa5.statusenabled = true
                and coa5.kdprofile = 30
                and mcr.statusenabled = true
                and mcr.kdprofile = 30
                and ma.statusenabled = true
                and ma.kdprofile = 30
                and kb.statusenabled = true
                and kb.kdprofile = 30
                and ka.statusenabled = true
                and ka.kdprofile = 30
                and sr.statusenabled = true
                and sr.kdprofile = 30
                and ka.tahun in ('$tahunlalu','$tahun')
                group by coa1.id, coa1.noaccount || '.' || coa2.noaccount || '.' || coa3.noaccount || '.' || coa4.noaccount || '.' || coa5.noaccount || '.' || coa.noaccount || '.0001', 'JUMLAH' || coa1.namaaccount,kb.subtotal,
                ma.kodemataanggaran, ma.namamataanggaran, ka.tahun, ka.keterangan
        
            ) as x
            group by id, noaccount, namaaccount, tahun
        ) as y
        group by id, noaccount, namaaccount
        order by noaccount"));

        $pageWidth = 950;
        
        return view('report.akuntansi.lrarinci',compact('data', 'pageWidth', 'tahun', 'tahunlalu'));
    }

    public function CetakNeraca(Request $request){
        $tahun = $request['tahun'];

        $lalu = DB::select(DB::raw("SELECT extract('year' from(date '$tahun-12-28' - interval '1 year')) as tahun;"));

        $tahunlalu = $lalu[0]->tahun;

        $data = DB::select(DB::raw("select id, noaccount, namaaccount, sum(subtotalbulanlalu) subtotalbulanlalu, sum(subtotalbulanini) subtotalbulanini,
        case 
            when sum(subtotalbulanini) - sum(subtotalbulanlalu) >= 0 then sum(subtotalbulanini) - sum(subtotalbulanlalu)
            when sum(subtotalbulanini) - sum(subtotalbulanlalu) < 0 then (sum(subtotalbulanini) - sum(subtotalbulanlalu))*(-1)
        end as selisih,
        case 
            when sum(subtotalbulanini) != 0 and sum(subtotalbulanlalu) != 0 and sum(subtotalbulanini) - sum(subtotalbulanlalu) >= 0 then ((sum(subtotalbulanini) - sum(subtotalbulanlalu))/sum(subtotalbulanlalu))*100
            when sum(subtotalbulanini) != 0 and sum(subtotalbulanlalu) != 0 and sum(subtotalbulanini) - sum(subtotalbulanlalu) < 0 then (((sum(subtotalbulanini) - sum(subtotalbulanlalu))*(-1))/sum(subtotalbulanlalu))*100
            when sum(subtotalbulanini) != 0 or sum(subtotalbulanlalu) != 0 then 0
        end as persentase
        from(
            select id, noaccount, namaaccount, 
            case when tahun = '$tahunlalu' then sum(subtotal) else 0 end as subtotalbulanlalu,
            case when tahun = '$tahun' then sum(subtotal) else 0 end as subtotalbulanini
            from(
                select coa1.id, coa1.noaccount, coa1.namaaccount,
                ma.kodemataanggaran, ma.namamataanggaran,
                sum(kb.subtotal) subtotal, ka.tahun
                    from chartofaccount_m coa
                inner join mapcoatorekening_t mcr on coa.id = mcr.objectcoafk
                inner join mataanggaran_m ma on ma.id = mcr.objectmataanggaranfk
                inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                INNER JOIN chartofaccount_m coa5 on coa5.id=coa.objectaccountheadfk
                INNER JOIN chartofaccount_m coa4 on coa4.id=coa5.objectaccountheadfk
                INNER JOIN chartofaccount_m coa3 on coa3.id=coa4.objectaccountheadfk
                INNER JOIN chartofaccount_m coa2 on coa2.id=coa3.objectaccountheadfk
                INNER JOIN chartofaccount_m coa1 on coa1.id=coa2.objectaccountheadfk
                where coa.statusenabled = true
                and coa.kdprofile = 30
                and coa1.statusenabled = true
                and coa1.kdprofile = 30
                and coa2.statusenabled = true
                and coa2.kdprofile = 30
                and coa3.statusenabled = true
                and coa3.kdprofile = 30
                and coa4.statusenabled = true
                and coa4.kdprofile = 30
                and coa5.statusenabled = true
                and coa5.kdprofile = 30
                and mcr.statusenabled = true
                and mcr.kdprofile = 30
                and ma.statusenabled = true
                and ma.kdprofile = 30
                and kb.statusenabled = true
                and kb.kdprofile = 30
                and ka.statusenabled = true
                and ka.kdprofile = 30
                and ka.tahun in ('$tahunlalu','$tahun')
                and coa.objectjenisaccountfk = 2
                group by coa1.id, coa1.noaccount, coa1.namaaccount,
                ma.kodemataanggaran, ma.namamataanggaran, ka.tahun
        
                union all
        
                select coa2.id, coa1.noaccount || '.' || coa2.noaccount as noaccount, coa2.namaaccount,
                ma.kodemataanggaran, ma.namamataanggaran,
                sum(kb.subtotal) subtotal, ka.tahun
                    from chartofaccount_m coa
                inner join mapcoatorekening_t mcr on coa.id = mcr.objectcoafk
                inner join mataanggaran_m ma on ma.id = mcr.objectmataanggaranfk
                inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                INNER JOIN chartofaccount_m coa5 on coa5.id=coa.objectaccountheadfk
                INNER JOIN chartofaccount_m coa4 on coa4.id=coa5.objectaccountheadfk
                INNER JOIN chartofaccount_m coa3 on coa3.id=coa4.objectaccountheadfk
                INNER JOIN chartofaccount_m coa2 on coa2.id=coa3.objectaccountheadfk
                INNER JOIN chartofaccount_m coa1 on coa1.id=coa2.objectaccountheadfk
                where coa.statusenabled = true
                and coa.kdprofile = 30
                and coa1.statusenabled = true
                and coa1.kdprofile = 30
                and coa2.statusenabled = true
                and coa2.kdprofile = 30
                and coa3.statusenabled = true
                and coa3.kdprofile = 30
                and coa4.statusenabled = true
                and coa4.kdprofile = 30
                and coa5.statusenabled = true
                and coa5.kdprofile = 30
                and mcr.statusenabled = true
                and mcr.kdprofile = 30
                and ma.statusenabled = true
                and ma.kdprofile = 30
                and kb.statusenabled = true
                and kb.kdprofile = 30
                and ka.statusenabled = true
                and ka.kdprofile = 30
                and ka.tahun in ('$tahunlalu','$tahun')
                and coa.objectjenisaccountfk = 2
                group by coa2.id, coa1.noaccount || '.' || coa2.noaccount, coa2.namaaccount,
                ma.kodemataanggaran, ma.namamataanggaran, ka.tahun
        
                union all
        
                select coa3.id, coa1.noaccount || '.' || coa2.noaccount || '.' || coa3.noaccount as noaccount, coa3.namaaccount,
                ma.kodemataanggaran, ma.namamataanggaran,
                sum(kb.subtotal) subtotal, ka.tahun
                    from chartofaccount_m coa
                inner join mapcoatorekening_t mcr on coa.id = mcr.objectcoafk
                inner join mataanggaran_m ma on ma.id = mcr.objectmataanggaranfk
                inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                INNER JOIN chartofaccount_m coa5 on coa5.id=coa.objectaccountheadfk
                INNER JOIN chartofaccount_m coa4 on coa4.id=coa5.objectaccountheadfk
                INNER JOIN chartofaccount_m coa3 on coa3.id=coa4.objectaccountheadfk
                INNER JOIN chartofaccount_m coa2 on coa2.id=coa3.objectaccountheadfk
                INNER JOIN chartofaccount_m coa1 on coa1.id=coa2.objectaccountheadfk
                where coa.statusenabled = true
                and coa.kdprofile = 30
                and coa1.statusenabled = true
                and coa1.kdprofile = 30
                and coa2.statusenabled = true
                and coa2.kdprofile = 30
                and coa3.statusenabled = true
                and coa3.kdprofile = 30
                and coa4.statusenabled = true
                and coa4.kdprofile = 30
                and coa5.statusenabled = true
                and coa5.kdprofile = 30
                and mcr.statusenabled = true
                and mcr.kdprofile = 30
                and ma.statusenabled = true
                and ma.kdprofile = 30
                and kb.statusenabled = true
                and kb.kdprofile = 30
                and ka.statusenabled = true
                and ka.kdprofile = 30
                and ka.tahun in ('$tahunlalu','$tahun')
                and coa.objectjenisaccountfk = 2
                group by coa3.id, coa1.noaccount || '.' || coa2.noaccount || '.' || coa3.noaccount, coa3.namaaccount,
                ma.kodemataanggaran, ma.namamataanggaran, ka.tahun
        
                union all
        
                select coa4.id, coa1.noaccount || '.' || coa2.noaccount || '.' || coa3.noaccount || '.' || coa4.noaccount as noaccount, coa4.namaaccount,
                ma.kodemataanggaran, ma.namamataanggaran,
                sum(kb.subtotal) subtotal, ka.tahun
                    from chartofaccount_m coa
                inner join mapcoatorekening_t mcr on coa.id = mcr.objectcoafk
                inner join mataanggaran_m ma on ma.id = mcr.objectmataanggaranfk
                inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                INNER JOIN chartofaccount_m coa5 on coa5.id=coa.objectaccountheadfk
                INNER JOIN chartofaccount_m coa4 on coa4.id=coa5.objectaccountheadfk
                INNER JOIN chartofaccount_m coa3 on coa3.id=coa4.objectaccountheadfk
                INNER JOIN chartofaccount_m coa2 on coa2.id=coa3.objectaccountheadfk
                INNER JOIN chartofaccount_m coa1 on coa1.id=coa2.objectaccountheadfk
                where coa.statusenabled = true
                and coa.kdprofile = 30
                and coa1.statusenabled = true
                and coa1.kdprofile = 30
                and coa2.statusenabled = true
                and coa2.kdprofile = 30
                and coa3.statusenabled = true
                and coa3.kdprofile = 30
                and coa4.statusenabled = true
                and coa4.kdprofile = 30
                and coa5.statusenabled = true
                and coa5.kdprofile = 30
                and mcr.statusenabled = true
                and mcr.kdprofile = 30
                and ma.statusenabled = true
                and ma.kdprofile = 30
                and kb.statusenabled = true
                and kb.kdprofile = 30
                and ka.statusenabled = true
                and ka.kdprofile = 30
                and ka.tahun in ('$tahunlalu','$tahun')
                and coa.objectjenisaccountfk = 2
                group by coa4.id, coa1.noaccount || '.' || coa2.noaccount || '.' || coa3.noaccount || '.' || coa4.noaccount, coa4.namaaccount,
                ma.kodemataanggaran, ma.namamataanggaran, ka.tahun
        
                union all
        
                select coa5.id, coa1.noaccount || '.' || coa2.noaccount || '.' || coa3.noaccount || '.' || coa4.noaccount || '.' || coa5.noaccount as noaccount, coa5.namaaccount,
                ma.kodemataanggaran, ma.namamataanggaran,
                sum(kb.subtotal) subtotal, ka.tahun
                    from chartofaccount_m coa
                inner join mapcoatorekening_t mcr on coa.id = mcr.objectcoafk
                inner join mataanggaran_m ma on ma.id = mcr.objectmataanggaranfk
                inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                INNER JOIN chartofaccount_m coa5 on coa5.id=coa.objectaccountheadfk
                INNER JOIN chartofaccount_m coa4 on coa4.id=coa5.objectaccountheadfk
                INNER JOIN chartofaccount_m coa3 on coa3.id=coa4.objectaccountheadfk
                INNER JOIN chartofaccount_m coa2 on coa2.id=coa3.objectaccountheadfk
                INNER JOIN chartofaccount_m coa1 on coa1.id=coa2.objectaccountheadfk
                where coa.statusenabled = true
                and coa.kdprofile = 30
                and coa1.statusenabled = true
                and coa1.kdprofile = 30
                and coa2.statusenabled = true
                and coa2.kdprofile = 30
                and coa3.statusenabled = true
                and coa3.kdprofile = 30
                and coa4.statusenabled = true
                and coa4.kdprofile = 30
                and coa5.statusenabled = true
                and coa5.kdprofile = 30
                and mcr.statusenabled = true
                and mcr.kdprofile = 30
                and ma.statusenabled = true
                and ma.kdprofile = 30
                and kb.statusenabled = true
                and kb.kdprofile = 30
                and ka.statusenabled = true
                and ka.kdprofile = 30
                and ka.tahun in ('$tahunlalu','$tahun')
                and coa.objectjenisaccountfk = 2
                group by coa5.id, coa1.noaccount || '.' || coa2.noaccount || '.' || coa3.noaccount || '.' || coa4.noaccount || '.' || coa5.noaccount, coa5.namaaccount,
                ma.kodemataanggaran, ma.namamataanggaran, ka.tahun
        
                union all
        
                select coa.id, coa1.noaccount || '.' || coa2.noaccount || '.' || coa3.noaccount || '.' || coa4.noaccount || '.' || coa5.noaccount || '.' || coa.noaccount as noaccount, coa.namaaccount,
                ma.kodemataanggaran, ma.namamataanggaran,
                sum(kb.subtotal) subtotal, ka.tahun
                    from chartofaccount_m coa
                inner join mapcoatorekening_t mcr on coa.id = mcr.objectcoafk
                inner join mataanggaran_m ma on ma.id = mcr.objectmataanggaranfk
                inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                INNER JOIN chartofaccount_m coa5 on coa5.id=coa.objectaccountheadfk
                INNER JOIN chartofaccount_m coa4 on coa4.id=coa5.objectaccountheadfk
                INNER JOIN chartofaccount_m coa3 on coa3.id=coa4.objectaccountheadfk
                INNER JOIN chartofaccount_m coa2 on coa2.id=coa3.objectaccountheadfk
                INNER JOIN chartofaccount_m coa1 on coa1.id=coa2.objectaccountheadfk
                where coa.statusenabled = true
                and coa.kdprofile = 30
                and coa1.statusenabled = true
                and coa1.kdprofile = 30
                and coa2.statusenabled = true
                and coa2.kdprofile = 30
                and coa3.statusenabled = true
                and coa3.kdprofile = 30
                and coa4.statusenabled = true
                and coa4.kdprofile = 30
                and coa5.statusenabled = true
                and coa5.kdprofile = 30
                and mcr.statusenabled = true
                and mcr.kdprofile = 30
                and ma.statusenabled = true
                and ma.kdprofile = 30
                and kb.statusenabled = true
                and kb.kdprofile = 30
                and ka.statusenabled = true
                and ka.kdprofile = 30
                and ka.tahun in ('$tahunlalu','$tahun')
                and coa.objectjenisaccountfk = 2
                group by coa.id, coa1.noaccount || '.' || coa2.noaccount || '.' || coa3.noaccount || '.' || coa4.noaccount || '.' || coa5.noaccount || '.' || coa.noaccount, coa.namaaccount,
                ma.kodemataanggaran, ma.namamataanggaran, ka.tahun

                union all

                select coa1.id, '1.1.01.01.01.0001.001' as noaccount, 'JUMLAH ASET' namaaccount,
                ma.kodemataanggaran, ma.namamataanggaran,
                sum(kb.subtotal) subtotal, ka.tahun
                from chartofaccount_m coa
                inner join mapcoatorekening_t mcr on coa.id = mcr.objectcoafk
                inner join mataanggaran_m ma on ma.id = mcr.objectmataanggaranfk
                inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                INNER JOIN chartofaccount_m coa5 on coa5.id=coa.objectaccountheadfk
                INNER JOIN chartofaccount_m coa4 on coa4.id=coa5.objectaccountheadfk
                INNER JOIN chartofaccount_m coa3 on coa3.id=coa4.objectaccountheadfk
                INNER JOIN chartofaccount_m coa2 on coa2.id=coa3.objectaccountheadfk
                INNER JOIN chartofaccount_m coa1 on coa1.id=coa2.objectaccountheadfk
                where coa.statusenabled = true
                and coa.kdprofile = 30
                and coa1.statusenabled = true
                and coa1.kdprofile = 30
                and coa2.statusenabled = true
                and coa2.kdprofile = 30
                and coa3.statusenabled = true
                and coa3.kdprofile = 30
                and coa4.statusenabled = true
                and coa4.kdprofile = 30
                and coa5.statusenabled = true
                and coa5.kdprofile = 30
                and mcr.statusenabled = true
                and mcr.kdprofile = 30
                and ma.statusenabled = true
                and ma.kdprofile = 30
                and kb.statusenabled = true
                and kb.kdprofile = 30
                and ka.statusenabled = true
                and ka.kdprofile = 30
                and ka.tahun in ('$tahunlalu','$tahun')
                and coa.objectjenisaccountfk = 2
                and coa1.namaaccount = 'ASET'
                group by coa1.id, ma.kodemataanggaran, ma.namamataanggaran, ka.tahun

                union all

                select coa1.id, '2.1.01.01.01.0001.001' as noaccount, 'JUMLAH KEWAJIBAN' namaaccount,
                ma.kodemataanggaran, ma.namamataanggaran,
                sum(kb.subtotal) subtotal, ka.tahun
                from chartofaccount_m coa
                inner join mapcoatorekening_t mcr on coa.id = mcr.objectcoafk
                inner join mataanggaran_m ma on ma.id = mcr.objectmataanggaranfk
                inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                INNER JOIN chartofaccount_m coa5 on coa5.id=coa.objectaccountheadfk
                INNER JOIN chartofaccount_m coa4 on coa4.id=coa5.objectaccountheadfk
                INNER JOIN chartofaccount_m coa3 on coa3.id=coa4.objectaccountheadfk
                INNER JOIN chartofaccount_m coa2 on coa2.id=coa3.objectaccountheadfk
                INNER JOIN chartofaccount_m coa1 on coa1.id=coa2.objectaccountheadfk
                where coa.statusenabled = true
                and coa.kdprofile = 30
                and coa1.statusenabled = true
                and coa1.kdprofile = 30
                and coa2.statusenabled = true
                and coa2.kdprofile = 30
                and coa3.statusenabled = true
                and coa3.kdprofile = 30
                and coa4.statusenabled = true
                and coa4.kdprofile = 30
                and coa5.statusenabled = true
                and coa5.kdprofile = 30
                and mcr.statusenabled = true
                and mcr.kdprofile = 30
                and ma.statusenabled = true
                and ma.kdprofile = 30
                and kb.statusenabled = true
                and kb.kdprofile = 30
                and ka.statusenabled = true
                and ka.kdprofile = 30
                and ka.tahun in ('$tahunlalu','$tahun')
                and coa.objectjenisaccountfk = 2
                and coa1.namaaccount = 'KEWAJIBAN'
                group by coa1.id, ma.kodemataanggaran, ma.namamataanggaran, ka.tahun

                union all

                select coa1.id, '3.1.01.01.01.0001.001' as noaccount, 'JUMLAH EKUITAS DANA' namaaccount,
                ma.kodemataanggaran, ma.namamataanggaran,
                sum(kb.subtotal) subtotal, ka.tahun
                from chartofaccount_m coa
                inner join mapcoatorekening_t mcr on coa.id = mcr.objectcoafk
                inner join mataanggaran_m ma on ma.id = mcr.objectmataanggaranfk
                inner join keteranganbelanja_t kb on ma.id=kb.objectmataanggaranfk
                INNER JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
                INNER JOIN chartofaccount_m coa5 on coa5.id=coa.objectaccountheadfk
                INNER JOIN chartofaccount_m coa4 on coa4.id=coa5.objectaccountheadfk
                INNER JOIN chartofaccount_m coa3 on coa3.id=coa4.objectaccountheadfk
                INNER JOIN chartofaccount_m coa2 on coa2.id=coa3.objectaccountheadfk
                INNER JOIN chartofaccount_m coa1 on coa1.id=coa2.objectaccountheadfk
                where coa.statusenabled = true
                and coa.kdprofile = 30
                and coa1.statusenabled = true
                and coa1.kdprofile = 30
                and coa2.statusenabled = true
                and coa2.kdprofile = 30
                and coa3.statusenabled = true
                and coa3.kdprofile = 30
                and coa4.statusenabled = true
                and coa4.kdprofile = 30
                and coa5.statusenabled = true
                and coa5.kdprofile = 30
                and mcr.statusenabled = true
                and mcr.kdprofile = 30
                and ma.statusenabled = true
                and ma.kdprofile = 30
                and kb.statusenabled = true
                and kb.kdprofile = 30
                and ka.statusenabled = true
                and ka.kdprofile = 30
                and ka.tahun in ('$tahunlalu','$tahun')
                and coa.objectjenisaccountfk = 2
                and coa1.namaaccount = 'EKUITAS'
                group by coa1.id, ma.kodemataanggaran, ma.namamataanggaran, ka.tahun

            ) as x 
            group by id, noaccount, namaaccount, tahun
        ) as y
        group by id, noaccount, namaaccount
        order by noaccount;"));

        $pageWidth = 950;
        
        return view('report.akuntansi.neracarinci',compact('data', 'pageWidth', 'tahun', 'tahunlalu'));
    }

    public function CetakBKU(Request $request){
        $tahunjudul = $request['tahunbku'];
        $tanggalcetak = $this->tanggal_indonesia(date('Y-m-d',strtotime($request['tglcetak'])));
        // $bawal = date('F', mktime(0, 0, 0, $request['bulanawal'], 10));
        // $bakhir = date('F', mktime(0, 0, 0, $request['bulanakhir'], 10));

        $bulan = $request['bulanbku'];


        if($bulan == '01'){
            $periode = 'JANUARI';
        }
        else if($bulan == '02'){
            $periode = 'FEBRUARI';
        }
        else if($bulan == '03'){
            $periode = 'MARET';
        }
        else if($bulan == '04'){
            $periode = 'APRIL';
        }
        else if($bulan == '05'){
            $periode = 'MEI';
        }
        else if($bulan == '06'){
            $periode = 'JUNI';
        }
        else if($bulan == '07'){
            $periode = 'JULI';
        }
        else if($bulan == '08'){
            $periode = 'AGUSTUS';
        }
        else if($bulan == '09'){
            $periode = 'SEPTEMBER';
        }
        else if($bulan == '10'){
            $periode = 'OKTOBER';
        }
        else if($bulan == '11'){
            $periode = 'NOVEMBER';
        }
        else if($bulan == '12'){
            $periode = 'DESEMBER';
        }

        $qtahun  = '';
        if (isset($request['tahunbku']) && $request['tahunbku'] != "" && $request['tahunbku'] != "undefined") {
            $qtahun =  " and extract(year from tglbku) =  '" . $request['tahunbku']."'";
        }

        $qbulan  = '';
        if (isset($request['bulanbku']) && $request['bulanbku'] != "" && $request['bulanbku'] != "undefined") {
            $qbulan =  " and extract(month from tglbku) =  '" . $request['bulanbku']."'";
        }

        $data = DB::select(DB::raw("
            select * from(
                select 0 nourut, '' nobku, '' tgl, 'Saldo Awal Bulan' uraianbku, (saldo-penerimaan+pengeluaran) penerimaan, 0 pengeluaran, 0 saldoawal
                from bukukasumum_t
                where kdprofile = 30
                and statusenabled = true
                $qbulan
                $qtahun
                order by tglbku asc limit 1
            ) as x
        
            union all
        
            select ROW_NUMBER ( ) OVER ( ORDER BY bku.tglbku ) nourut, bku.nobku, to_char(bku.tglbku::date, 'DD-MM-YYYY') tgl, bku.uraianbku, bku.penerimaan, bku.pengeluaran, 0 saldoawal
            from bukukasumum_t bku
            where bku.kdprofile = 30
            and bku.statusenabled = true
            $qbulan
            $qtahun"));

        $saldoakhir = 0;

        foreach($data as $row){
            $saldoakhir = $saldoakhir + $row->penerimaan - $row->pengeluaran; 
            $row->saldoawal = $saldoakhir;
        }

        $pageWidth = 950;
        //return $this->respond($result);
        return view('report.keuangan.cetakbku',compact('data', 'pageWidth', 'tahunjudul', 'tanggalcetak', 'periode'));
    }

    public function CetakSP3BP(Request $request){

        $tahun = $request['tahun'];
        $tanggalcetak = $this->tanggal_indonesia(date('Y-m-d',strtotime($request['tglcetak'])));

        $bulan = $request['bulan'];

        $tglakhir = DB::select(DB::raw("SELECT (date_trunc('month', '$tahun-$bulan-01'::date) + interval '1 month' - interval '1 day')::date
        AS end_of_month;"));

        $date = $tglakhir[0]->end_of_month;

        $tanggal = $this->tanggal_indonesia(date('Y-m-d',strtotime($date)));

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

        $penerimaan = DB::select(DB::raw("select sum(jumlahpenerimaan) jumlahpenerimaan
        from(
            select sum(stsd.kolom2) jumlahpenerimaan from
            surattandasetoran_t sts
            inner join surattandasetorandetail_t stsd on stsd.objectstsfk = sts.nosts
            inner join ststosck_t as ssc on sts.norec = ssc.objectstsfk
            inner join strukclosingkasir_t as sck on ssc.objectsckfk = sck.norec
            inner join strukclosing_t as sc on sc.norec = sck.noclosingfk
            inner join strukhistori_t sh on sh.noclosing = sc.norec
            where sts.statusenabled = true
            and sts.kdprofile = 30
            and stsd.statusenabled = true
            and stsd.kdprofile = 30
            and (sc.statusenabled = true or sc.statusenabled is null)
            and sc.kdprofile = 30
            and ssc.statusenabled = true
            and ssc.kdprofile = 30
            and sh.statusenabled = true
            and stsd.uraian = 'JUMLAH'
            and extract(month from sts.tglpenerimaan) = '$bulan'
            and extract(year from sts.tglpenerimaan) = '$tahun'
        
            union all
        
            select sum(totalsetujui) jumlahpenerimaan
            from rekapklaimbpjs_t
            where statusenabled = true
            and kdprofile = 30
            and extract(month from tglbayar) = '$bulan'
            and extract(year from tglbayar) = '$tahun'
        ) as x"));

        $belanja = DB::select(DB::raw("select map3.kode || '.' || map2.kode || '.' || map1.kode || '.' || map.kode as kodepermendagri,
        sum(sr.totalbelanja) jumlahbelanja
        from strukrealisasi_t sr
        inner JOIN kegiatananggaran_m ka on ka.id=sr.objectkegiatanfk
        inner join kegiatananggaran_m as dp0 on ka.kode ilike dp0.kode || '%' and dp0.div = 3
        inner JOIN mataanggaran_m ma on ma.id=sr.objectmataanggaranfk
        inner join mataanggaranpermen_m map on map.id = ma.mataanggaranpermenfk
        inner join mataanggaranpermen_m map1 on map1.id = map.mataanggaranpermenfk and map1.div = 4
        inner join mataanggaranpermen_m map2 on map2.id = map1.mataanggaranpermenfk and map2.div = 3
        inner join mataanggaranpermen_m map3 on map3.id = map2.mataanggaranpermenfk and map3.div = 2
        where sr.statusenabled =true
        and sr.kdprofile = 30
        and ka.statusenabled =true
        and ka.kdprofile = 30
        and dp0.statusenabled =true
        and dp0.kdprofile = 30
        and ma.statusenabled =true
        and ma.kdprofile = 30
        and map.statusenabled =true
        and map.kdprofile = 30
        and extract(month from sr.tglrealisasi) = '$bulan'
        and extract(year from sr.tglrealisasi) = '$tahun'
        group by map3.kode || '.' || map2.kode || '.' || map1.kode || '.' || map.kode"));

        $totalbelanja = 0;
        foreach($belanja as $bl){
            $totalbelanja += $bl->jumlahbelanja;
        }

        $penerimaanawal = DB::select(DB::raw("select coalesce(sum(jumlahpenerimaan),0) jumlahpenerimaan
        from(
            select coalesce(sum(stsd.kolom2),0) jumlahpenerimaan from
            surattandasetoran_t sts
            inner join surattandasetorandetail_t stsd on stsd.objectstsfk = sts.nosts
            inner join ststosck_t as ssc on sts.norec = ssc.objectstsfk
            inner join strukclosingkasir_t as sck on ssc.objectsckfk = sck.norec
            inner join strukclosing_t as sc on sc.norec = sck.noclosingfk
            inner join strukhistori_t sh on sh.noclosing = sc.norec
            where sts.statusenabled = true
            and sts.kdprofile = 30
            and stsd.statusenabled = true
            and stsd.kdprofile = 30
            and (sc.statusenabled = true or sc.statusenabled is null)
            and sc.kdprofile = 30
            and ssc.statusenabled = true
            and ssc.kdprofile = 30
            and sh.statusenabled = true
            and stsd.uraian = 'JUMLAH'
            and extract(month from sts.tglpenerimaan) < '$bulan'
            and extract(year from sts.tglpenerimaan) = '$tahun'
        
            union all
        
            select coalesce(sum(totalsetujui),0) jumlahpenerimaan
            from rekapklaimbpjs_t
            where statusenabled = true
            and kdprofile = 30
            and extract(month from tglbayar) < '$bulan'
            and extract(year from tglbayar) = '$tahun'
        ) as x"));

        $belanjaawal = DB::select(DB::raw("select coalesce(sum(sr.totalbelanja), 0) jumlahbelanja
        from strukrealisasi_t sr
        inner JOIN kegiatananggaran_m ka on ka.id=sr.objectkegiatanfk
        inner join kegiatananggaran_m as dp0 on ka.kode ilike dp0.kode || '%' and dp0.div = 3
        inner JOIN mataanggaran_m ma on ma.id=sr.objectmataanggaranfk
        inner join mataanggaranpermen_m map on map.id = ma.mataanggaranpermenfk
        inner join mataanggaranpermen_m map1 on map1.id = map.mataanggaranpermenfk and map1.div = 4
        inner join mataanggaranpermen_m map2 on map2.id = map1.mataanggaranpermenfk and map2.div = 3
        inner join mataanggaranpermen_m map3 on map3.id = map2.mataanggaranpermenfk and map3.div = 2
        where sr.statusenabled =true
        and sr.kdprofile = 30
        and ka.statusenabled =true
        and ka.kdprofile = 30
        and dp0.statusenabled =true
        and dp0.kdprofile = 30
        and ma.statusenabled =true
        and ma.kdprofile = 30
        and map.statusenabled =true
        and map.kdprofile = 30
        and extract(month from sr.tglrealisasi) < '$bulan'
        and extract(year from sr.tglrealisasi) = '$tahun'"));

        $saldoawal = 0;
        if($bulan != '01'){
            $saldoawal = $penerimaanawal[0]->jumlahpenerimaan - $belanjaawal[0]->jumlahbelanja;
        }

        $pageWidth = 800;
        //return $this->respond($result);
        return view('report.keuangan.cetaksp3bp',compact('pageWidth', 'penerimaan', 'belanja', 'totalbelanja', 'saldoawal', 'tanggalcetak', 'periode', 'tahun', 'tanggal'));
    }

    public function CetakRO(Request $request){
        $tahunjudul = $request['tahun'];
        $tanggalcetak = $this->tanggal_indonesia(date('Y-m-d',strtotime($request['tglcetak'])));

        $bulan = $request['bulan'];

        $subsubkegiatan = '';
        if(isset($request['idsubsubkegiatan']) && $request['idsubsubkegiatan'] != '' && $request['idsubsubkegiatan'] != null){
            $subsubkegiatan = "and ka.id = ".$request['idsubsubkegiatan'];
        }

        $mataanggaran = '';
        if(isset($request['idmataanggaran']) && $request['idmataanggaran'] != '' && $request['idmataanggaran'] != null){
            $mataanggaran = "and ma.id = ".$request['idmataanggaran'];
        }

        $data = DB::select(DB::raw("
        select * from(
            select 0 nourut, '' nobku, '' tgl, 'ANGGARAN' uraianbku, (saldo-penerimaan+pengeluaran) penerimaan, 0 pengeluaran, 0 saldoawal,
            '' subsubkegiatan, '' subkegiatan, '' kodemataanggaran, '' namamataanggaran
            from bukukasumum_t
            where kdprofile = 30
            and statusenabled = true
            and extract(month from tglbku) = '$bulan'
            and extract(year from tglbku) = '$tahunjudul'
            order by tglbku asc limit 1
            ) as x
            
            union all
            
            select ROW_NUMBER ( ) OVER ( ORDER BY bku.tglbku ) nourut, bku.nobku, to_char(bku.tglbku::date, 'DD-MM-YYYY') tgl, bku.uraianbku, bku.penerimaan, bku.pengeluaran, 0 saldoawal,
            ka.keterangan subsubkegiatan, dp0.keterangan subkegiatan, ma.kodemataanggaran, ma.namamataanggaran
            from strukrealisasi_t sr
            inner JOIN kegiatananggaran_m ka on ka.id=sr.objectkegiatanfk
            inner join kegiatananggaran_m as dp0 on ka.kode ilike dp0.kode || '%' and dp0.div = 3
            inner JOIN mataanggaran_m ma on ma.id=sr.objectmataanggaranfk
            inner join bukukasumum_t bku on bku.norec = sr.objectbkufk
            where bku.kdprofile = 30
            and bku.statusenabled = true
            and ka.kdprofile = 30 and ka.statusenabled=true
            and dp0.kdprofile = 30 and dp0.statusenabled=true
            and ma.kdprofile = 30 and ma.statusenabled=true
            and sr.kdprofile = 30 and sr.statusenabled=true
            and extract(month from bku.tglbku) = '$bulan'
            and extract(year from bku.tglbku) = '$tahunjudul'
            $subsubkegiatan
            $mataanggaran"));
        
        $anggaran = DB::select(DB::raw("select coalesce(sum(kb.subtotal),0) jumlahanggaran
        from keteranganbelanja_t kb
        inner JOIN kegiatananggaran_m ka on ka.id=kb.objectkegiatanfk
        inner JOIN mataanggaran_m ma on ma.id=kb.objectmataanggaranfk
        where ka.kdprofile = 30 and ka.statusenabled=true
        and kb.kdprofile = 30 and kb.statusenabled=true
        and ma.kdprofile = 30 and ma.statusenabled=true
        $subsubkegiatan
        $mataanggaran"));

        $totalanggaran = 0;
        if(count($anggaran) != 0){
            $totalanggaran = $anggaran[0]->jumlahanggaran;
        }

        $saldoakhir = 0;

        foreach($data as $row){
            if($row->uraianbku == 'ANGGARAN'){
                $saldoakhir = $saldoakhir + $row->penerimaan - $row->pengeluaran;  
            } else{
                $saldoakhir = $saldoakhir - $row->pengeluaran;   
            }
            $row->saldoawal = $saldoakhir;
        }

        $pageWidth = 950;
        //return $this->respond($result);
        return view('report.keuangan.cetakro',compact('data', 'pageWidth', 'tahunjudul', 'tanggalcetak', 'totalanggaran'));
    }

    public function CetakBKUReal(Request $request){
        $tahunjudul = $request['tahunbku'];
        $tanggalcetak = $this->tanggal_indonesia(date('Y-m-d',strtotime($request['tglcetak'])));
        // $bawal = date('F', mktime(0, 0, 0, $request['bulanawal'], 10));
        // $bakhir = date('F', mktime(0, 0, 0, $request['bulanakhir'], 10));

        $bulan = $request['bulanbku'];


        if($bulan == '01'){
            $periode = 'JANUARI';
        }
        else if($bulan == '02'){
            $periode = 'FEBRUARI';
        }
        else if($bulan == '03'){
            $periode = 'MARET';
        }
        else if($bulan == '04'){
            $periode = 'APRIL';
        }
        else if($bulan == '05'){
            $periode = 'MEI';
        }
        else if($bulan == '06'){
            $periode = 'JUNI';
        }
        else if($bulan == '07'){
            $periode = 'JULI';
        }
        else if($bulan == '08'){
            $periode = 'AGUSTUS';
        }
        else if($bulan == '09'){
            $periode = 'SEPTEMBER';
        }
        else if($bulan == '10'){
            $periode = 'OKTOBER';
        }
        else if($bulan == '11'){
            $periode = 'NOVEMBER';
        }
        else if($bulan == '12'){
            $periode = 'DESEMBER';
        }

        $qtahun  = '';
        if (isset($request['tahunbku']) && $request['tahunbku'] != "" && $request['tahunbku'] != "undefined") {
            $qtahun =  " and extract(year from tglbku) =  '" . $request['tahunbku']."'";
        }

        $qbulan  = '';
        if (isset($request['bulanbku']) && $request['bulanbku'] != "" && $request['bulanbku'] != "undefined") {
            $qbulan =  " and extract(month from tglbku) =  '" . $request['bulanbku']."'";
        }

        $data = DB::select(DB::raw("select * from(
            select 0 nourut, '' objectmataanggaranfk, '' nobku, '' tgl, 'Saldo Awal Bulan' uraianbku, (saldo-penerimaan+pengeluaran) penerimaan, 0 pengeluaran, 0 saldoawal, '' nodokumen
            from bukukasumum_t
            where kdprofile = 30
            and statusenabled = true
            $qbulan
            $qtahun
            order by tglbku asc limit 1
            ) as x
            
            union all
            
            
            select nourut, objectmataanggaranfk, nobku, tgl, uraianbku, penerimaan, pengeluaran, saldoawal,
            case 
                when norealisasi is not null then norealisasi
                when nopanjar is not null then nopanjar
                when nospm is not null then nospm
                when nopemungutan is not null then nopemungutan
                when nopenyetoran is not null then nopenyetoran
                when nojasagiro is not null then nojasagiro
                when nosts is not null then nosts
            end as nodokumen
            from(
                select ROW_NUMBER ( ) OVER ( ORDER BY bku.tglbku ) nourut, bku.objectmataanggaranfk, bku.nobku, 
                to_char(bku.tglbku::date, 'DD-MM-YYYY') tgl, bku.uraianbku, bku.penerimaan, 
                bku.pengeluaran, 0 saldoawal, sr.norealisasi, pj.nopanjar, spm.nospm,
                pp.nopajak nopemungutan, ppj.nopajak nopenyetoran, jg.nojasagiro, sk.nosts 
                from bukukasumum_t bku
                left join strukrealisasi_t sr on sr.objectbkufk = bku.norec
                and sr.kdprofile = 30
                and sr.statusenabled = true
                left join panjar_t pj on pj.objectbkufk = bku.norec
                and pj.kdprofile = 30
                and pj.statusenabled = true
                left join spm_t spm on spm.objectbkufk = bku.norec
                and spm.kdprofile = 30
                and spm.statusenabled = true
                left join penyetoranpajak_t ppj on ppj.objectbkufk = bku.norec
                and ppj.kdprofile = 30
                and ppj.statusenabled = true
                left join pemungutanpajak_t pp on pp.objectbkufk = bku.norec
                and pp.kdprofile = 30
                and pp.statusenabled = true
                left join jasagiro_t jg on jg.objectbkufk = bku.norec
                and jg.kdprofile = 30
                and jg.statusenabled = true
                left join stskeuangan_t sk on sk.objectbkufk = bku.norec
                and sk.kdprofile = 30
                and sk.statusenabled = true
                where bku.kdprofile = 30
                and bku.statusenabled = true 
                $qbulan
                $qtahun
            ) as x"));

        $saldoakhir = 0;

        foreach($data as $row){
            $saldoakhir = $saldoakhir + $row->penerimaan - $row->pengeluaran; 
            $row->saldoawal = $saldoakhir;
        }

        $pageWidth = 950;
        //return $this->respond($result);
        return view('report.keuangan.cetakbkureal',compact('data', 'pageWidth', 'tahunjudul', 'tanggalcetak', 'periode'));
    }

    public function CetakBukuPajak(Request $request){
        $tahunjudul = $request['tahun'];
        $tanggalcetak = $this->tanggal_indonesia(date('Y-m-d',strtotime($request['tglcetak'])));
        $bulan = $request['bulan'];
        $sumberdana = $request['sumberdana'];

        $blalu = DB::select(DB::raw("SELECT extract('month' from(date '$tahunjudul-$bulan-01' - interval '1 month')) as bulan;"));

        $bulanlalu = $blalu[0]->bulan;

        $qtahun  = '';
        if (isset($request['tahun']) && $request['tahun'] != "" && $request['tahun'] != "undefined") {
            $qtahun =  " and extract(year from sr.tglrealisasi) =  '" . $request['tahun']."'";
        }

        $qbulan  = '';
        if (isset($request['bulan']) && $request['bulan'] != "" && $request['bulan'] != "undefined") {
            $qbulan =  " and extract(month from sr.tglrealisasi) =  '" . $request['bulan']."'";
        }

        $qasalproduk  = '';
        if (isset($request['sumberdana']) && $request['sumberdana'] != "" && $request['sumberdana'] != "undefined") {
            $qasalproduk =  " and ap.id =  " . $request['sumberdana'];
        }

        $data = DB::select(DB::raw("select ROW_NUMBER ( ) OVER ( ORDER BY norec ) nourut, norec, tglrealisasi, totalbelanja, namarekanan, npwp, alamatlengkap, billpph, billppn,
        idbillpph, idbillppn, ntpnpph, ntpnppn, ppn, pph21, pph22, pph23, pph26, pph4, pph
        from(
            select distinct sr.norec, sr.tglrealisasi::varchar, sr.totalbelanja, rk.namarekanan, rk.npwp, rk.alamatlengkap,
            'ID BILLING ' || jp.namaexternal billpph, 'ID BILLING PPN' billppn, pp.idbillpph, pp.idbillppn,
            pp.ntpnpph, pp.ntpnppn,
            pp.ppn ppn, 
            case when jp.id = 15 then pp.pph else null end as pph21,
            case when jp.id = 16 then pp.pph else null end as pph22,
            case when jp.id = 17 then pp.pph else null end as pph23,
            case when jp.id = 18 then pp.pph else null end as pph26,
            case when jp.id = 19 then pp.pph else null end as pph4,
            case when jp.id = 20 then pp.pph else null end as pph
                from strukrealisasi_t sr 
            inner join pemungutanpajak_t pp on pp.objectspjfk = sr.norec 
            inner join jenispajak_m jp on jp.id = pp.objectjenispphfk 
            inner join rekanan_m rk on rk.id = sr.rekananfk 
            inner join kegiatananggaran_m as dp on dp.id = sr.objectkegiatanfk
            inner join keteranganbelanja_t as kb on kb.objectkegiatanfk = dp.id
            inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
            inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
            where sr.statusenabled = true
            and sr.kdprofile = 30
            and pp.statusenabled = true 
            and pp.kdprofile = 30
            and jp.statusenabled = true 
            and jp.kdprofile = 30
            and sr.status = 'Sudah Diverifikasi'
            $qbulan
            $qtahun
            $qasalproduk
        
            union all
        
            select distinct sr.norec, sr.tglrealisasi::varchar, sr.totalbelanja, rk.namarekanan, rk.npwp, rk.alamatlengkap,
            'ID BILLING ' || jp.namaexternal billpph, 'ID BILLING PPN' billppn, pj.idbillpph, pj.idbill idbillppn,
            pj.ntpnpph, pj.ntpn ntpnppn,
            pj.ppn ppn, 
            case when jp.id = 15 then pj.pph else null end as pph21,
            case when jp.id = 16 then pj.pph else null end as pph22,
            case when jp.id = 17 then pj.pph else null end as pph23,
            case when jp.id = 18 then pj.pph else null end as pph26,
            case when jp.id = 19 then pj.pph else null end as pph4,
            case when jp.id = 20 then pj.pph else null end as pph
                from strukrealisasi_t sr 
            inner join panjar_t pj on pj.norec = sr.objectpanjarfk 
            inner join jenispajak_m jp on jp.id = pj.objectjenispphfk 
            inner join rekanan_m rk on rk.id = sr.rekananfk 
            inner join kegiatananggaran_m as dp on dp.id = sr.objectkegiatanfk
            inner join keteranganbelanja_t as kb on kb.objectkegiatanfk = dp.id
            inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
            inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
            where sr.statusenabled = true
            and sr.kdprofile = 30
            and pj.statusenabled = true 
            and pj.kdprofile = 30
            and jp.statusenabled = true 
            and jp.kdprofile = 30
            and sr.status = 'Sudah Diverifikasi'
            $qbulan
            $qtahun
            $qasalproduk
        ) as x"));

        $lalu = DB::select(DB::raw("select coalesce(sum(ppn), 0) ppn, coalesce(sum(pph21), 0) pph21, coalesce(sum(pph22), 0) pph22, 
        coalesce(sum(pph23), 0) pph23, coalesce(sum(pph26), 0) pph26, coalesce(sum(pph4), 0) pph4, 
        coalesce(sum(pph), 0) pph
        from(
            select distinct sr.norec, sr.tglrealisasi::varchar, sr.totalbelanja, rk.namarekanan, rk.npwp, rk.alamatlengkap,
            'ID BILLING ' || jp.namaexternal billpph, 'ID BILLING PPN' billppn, pp.idbillpph, pp.idbillppn,
            pp.ntpnpph, pp.ntpnppn,
            pp.ppn ppn, 
            case when jp.id = 15 then pp.pph else null end as pph21,
            case when jp.id = 16 then pp.pph else null end as pph22,
            case when jp.id = 17 then pp.pph else null end as pph23,
            case when jp.id = 18 then pp.pph else null end as pph26,
            case when jp.id = 19 then pp.pph else null end as pph4,
            case when jp.id = 20 then pp.pph else null end as pph
                from strukrealisasi_t sr 
            inner join pemungutanpajak_t pp on pp.objectspjfk = sr.norec 
            inner join jenispajak_m jp on jp.id = pp.objectjenispphfk 
            inner join rekanan_m rk on rk.id = sr.rekananfk 
            inner join kegiatananggaran_m as dp on dp.id = sr.objectkegiatanfk
            inner join keteranganbelanja_t as kb on kb.objectkegiatanfk = dp.id
            inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
            inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
            where sr.statusenabled = true
            and sr.kdprofile = 30
            and pp.statusenabled = true 
            and pp.kdprofile = 30
            and jp.statusenabled = true 
            and jp.kdprofile = 30
            and sr.status = 'Sudah Diverifikasi'
            and extract('month' from sr.tglrealisasi) = '$bulanlalu'
            $qtahun
            $qasalproduk
        
            union all
        
            select distinct sr.norec, sr.tglrealisasi::varchar, sr.totalbelanja, rk.namarekanan, rk.npwp, rk.alamatlengkap,
            'ID BILLING ' || jp.namaexternal billpph, 'ID BILLING PPN' billppn, pj.idbillpph, pj.idbill idbillppn,
            pj.ntpnpph, pj.ntpn ntpnppn,
            pj.ppn ppn, 
            case when jp.id = 15 then pj.pph else null end as pph21,
            case when jp.id = 16 then pj.pph else null end as pph22,
            case when jp.id = 17 then pj.pph else null end as pph23,
            case when jp.id = 18 then pj.pph else null end as pph26,
            case when jp.id = 19 then pj.pph else null end as pph4,
            case when jp.id = 20 then pj.pph else null end as pph
                from strukrealisasi_t sr 
            inner join panjar_t pj on pj.norec = sr.objectpanjarfk 
            inner join jenispajak_m jp on jp.id = pj.objectjenispphfk 
            inner join rekanan_m rk on rk.id = sr.rekananfk 
            inner join kegiatananggaran_m as dp on dp.id = sr.objectkegiatanfk
            inner join keteranganbelanja_t as kb on kb.objectkegiatanfk = dp.id
            inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
            inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
            where sr.statusenabled = true
            and sr.kdprofile = 30
            and pj.statusenabled = true 
            and pj.kdprofile = 30
            and jp.statusenabled = true 
            and jp.kdprofile = 30
            and sr.status = 'Sudah Diverifikasi'
            and extract('month' from sr.tglrealisasi) = '$bulanlalu'
            $qtahun
            $qasalproduk
        ) as x"));

        $pageWidth = 950;
        //return $this->respond($result);
        return view('report.keuangan.cetakbukupajak',compact('data', 'pageWidth', 'lalu', 'sumberdana', 'tanggalcetak', 'bulan', 'tahunjudul'));
    }

    public function getRegisterPenutupanKas(Request $request){
        $tahunjudul = $request['tahun'];
        $tanggalcetak = $this->tanggal_indonesia(date('Y-m-d',strtotime($request['tglcetak'])));
        // $bawal = date('F', mktime(0, 0, 0, $request['bulanawal'], 10));
        // $bakhir = date('F', mktime(0, 0, 0, $request['bulanakhir'], 10));

        $bulan = $request['bulan'];


        if($bulan == '01'){
            $periode = 'JANUARI';
        }
        else if($bulan == '02'){
            $periode = 'FEBRUARI';
        }
        else if($bulan == '03'){
            $periode = 'MARET';
        }
        else if($bulan == '04'){
            $periode = 'APRIL';
        }
        else if($bulan == '05'){
            $periode = 'MEI';
        }
        else if($bulan == '06'){
            $periode = 'JUNI';
        }
        else if($bulan == '07'){
            $periode = 'JULI';
        }
        else if($bulan == '08'){
            $periode = 'AGUSTUS';
        }
        else if($bulan == '09'){
            $periode = 'SEPTEMBER';
        }
        else if($bulan == '10'){
            $periode = 'OKTOBER';
        }
        else if($bulan == '11'){
            $periode = 'NOVEMBER';
        }
        else if($bulan == '12'){
            $periode = 'DESEMBER';
        }

        $qtahun  = '';
        if (isset($request['tahun']) && $request['tahun'] != "" && $request['tahun'] != "undefined") {
            $qtahun =  " and extract(year from tglbku) =  '" . $request['tahun']."'";
        }

        $qbulan  = '';
        if (isset($request['bulan']) && $request['bulan'] != "" && $request['bulan'] != "undefined") {
            $qbulan =  " and extract(month from tglbku) =  '" . $request['bulan']."'";
        }

        $qsumberdana  = '';
        if (isset($request['sumberdana']) && $request['sumberdana'] != "" && $request['sumberdana'] != "undefined") {
            $qsumberdana =  " and ap.id = " . $request['sumberdana'];
        }

        $data = DB::select(DB::raw("select sum(bku.penerimaan) penerimaan, sum(bku.pengeluaran) pengeluaran
        from bukukasumum_t bku
        left join asalproduk_m ap on ap.id = bku.objectasalprodukfk
        where bku.kdprofile = 30
        and bku.statusenabled = true 
        $qsumberdana
        $qbulan
        $qtahun"));

        $akhirbulanini = DB::select(DB::raw("SELECT (date_trunc('month', '$tahunjudul-$bulan-01'::date) + interval '1 month' - interval '1 day')::date
        AS end_of_month"));

        $indakhirbulanini = $this->tanggal_indonesia(date('Y-m-d',strtotime($akhirbulanini[0]->end_of_month)));

        $akhirbulanlalu = DB::select(DB::raw("SELECT (date_trunc('month', '$tahunjudul-$bulan-01'::date) - interval '1 day')::date
        AS end_of_month_past;"));

        $indakhirbulanlalu = $this->tanggal_indonesia(date('Y-m-d',strtotime($akhirbulanlalu[0]->end_of_month_past)));
        
        $pageWidth = 950;
        //return $this->respond($result);
        return view('report.keuangan.penutupankas',compact('data', 'pageWidth', 'tahunjudul', 'tanggalcetak', 'periode', 'indakhirbulanlalu', 'indakhirbulanini'));
    }

    public function CetakBukuPanjar(Request $request){
        $tahunjudul = $request['tahunpanjar'];
        $tanggalcetak = $this->tanggal_indonesia(date('Y-m-d',strtotime($request['tglcetakpanjar'])));
        // $bawal = date('F', mktime(0, 0, 0, $request['bulanawal'], 10));
        // $bakhir = date('F', mktime(0, 0, 0, $request['bulanakhir'], 10));

        $bulan = $request['bulanpanjar'];


        if($bulan == '01'){
            $periode = 'JANUARI';
        }
        else if($bulan == '02'){
            $periode = 'FEBRUARI';
        }
        else if($bulan == '03'){
            $periode = 'MARET';
        }
        else if($bulan == '04'){
            $periode = 'APRIL';
        }
        else if($bulan == '05'){
            $periode = 'MEI';
        }
        else if($bulan == '06'){
            $periode = 'JUNI';
        }
        else if($bulan == '07'){
            $periode = 'JULI';
        }
        else if($bulan == '08'){
            $periode = 'AGUSTUS';
        }
        else if($bulan == '09'){
            $periode = 'SEPTEMBER';
        }
        else if($bulan == '10'){
            $periode = 'OKTOBER';
        }
        else if($bulan == '11'){
            $periode = 'NOVEMBER';
        }
        else if($bulan == '12'){
            $periode = 'DESEMBER';
        }

        $qtahun  = '';
        if (isset($request['tahunpanjar']) && $request['tahunpanjar'] != "" && $request['tahunpanjar'] != "undefined") {
            $qtahun =  " and extract(year from tglbku) between '01' and '" . $request['tahunpanjar']."'";
        }

        $qbulan  = '';
        if (isset($request['bulanpanjar']) && $request['bulanpanjar'] != "" && $request['bulanpanjar'] != "undefined") {
            $qbulan =  " and extract(month from tglbku) between '01' and  '" . $request['bulanpanjar']."'";
        }

        $data = DB::select(DB::raw("select * from(
            select 0 nourut, '' nobku, '' tgl, 'Saldo Awal Bulan' uraianbku, (saldo-penerimaan+pengeluaran) penerimaan, 0 pengeluaran, 0 saldo
            from bukukasumum_t
            where kdprofile = 30
            and statusenabled = true
            $qbulan
            $qtahun
            and objectjenisbuktifk = 3
            order by tglbku asc limit 1
        ) as x
    
        union all
    
        select ROW_NUMBER ( ) OVER ( ORDER BY bku.tglbku ) nourut, bku.nobku, to_char(bku.tglbku::date, 'DD-MM-YYYY') tgl, bku.uraianbku, bku.penerimaan, bku.pengeluaran, 0 saldo
        from bukukasumum_t bku
        where bku.kdprofile = 30
        and bku.statusenabled = true
        $qbulan
        $qtahun
        and bku.objectjenisbuktifk = 3"));

        $saldoakhir = 0;

        foreach($data as $row){
            $saldoakhir = $saldoakhir + $row->penerimaan - $row->pengeluaran; 
            $row->saldo = $saldoakhir;
        }

        //var_dump($data);

        // $result = array(
        //     'daftar' => $data,
        //     'message' => 'as@epic',
        // );

        // return $this->respond($result);

        $pageWidth = 950;
        //return $this->respond($result);
        return view('report.keuangan.cetakbukupanjar',compact('data', 'pageWidth', 'tahunjudul', 'tanggalcetak', 'periode'));
    }

    public function CetakFungsional(Request $request){
        // $tahunjudul = $request['tahunpanjar'];
        $tanggalcetak = $this->tanggal_indonesia(date('Y-m-d',strtotime($request['tglcetak'])));
        $tanggaljudul = $this->tanggal_indonesia(date('Y-m-d',strtotime($request['tglbku'])));
        $bllalu = date('Y-m',strtotime($request['tglbku']));
        $tahun = date('Y',strtotime($request['tglbku']));
        $bulan = date('m',strtotime($request['tglbku']));
        $tglbku = $request['tglbku'];
        // $bulan = $request['bulanpanjar'];
        $blalu = DB::select(DB::raw("SELECT extract('month' from(date '$bllalu-01' - interval '1 month')) as bulan;"));

        $bulanlalu = $blalu[0]->bulan;

        $qasalproduk  = '';
        if (isset($request['asalproduk']) && $request['asalproduk'] != "" && $request['asalproduk'] != "undefined") {
            $qasalproduk =  " and ap.id = " . $request['asalproduk'];
        }

        // $qbulan  = '';
        // if (isset($request['bulanpanjar']) && $request['bulanpanjar'] != "" && $request['bulanpanjar'] != "undefined") {
        //     $qbulan =  " and extract(month from tglbku) between '01' and  '" . $request['bulanpanjar']."'";
        // }
        
        if($request['jenisrekening'] == 1){
            $data = DB::select(DB::raw("select text, kode, div, sum(subtotal) subtotal, sum(totalbulanlalu) totalbulanlalu, 
        sum(totalbulanini) totalbulanini
        from(
                    select text, kode, div, sum(subtotal) subtotal,
                    case when bulan = '$bulanlalu' then sum(totalbelanja) else 0 end as totalbulanlalu,
                    case when bulan = '$bulan' then sum(totalbelanja) else 0 end as totalbulanini
                    from(
                        select kmsss.keterangan as text, kmsss.kode, kmsss.div, sum(kb.subtotal) subtotal, sr.totalbelanja, sr.norec,
                            extract(month from sr.tglrealisasi) bulan
                            from kegiatananggaran_m km
                        inner join kegiatananggaran_m kms on km.kode ilike  kms.kode || '%' and kms.div = 3
                        inner join kegiatananggaran_m kmss on km.kode ilike  kmss.kode || '%' and kmss.div = 2
                        inner join kegiatananggaran_m kmsss on km.kode ilike  kmsss.kode || '%' and kmsss.div = 1
                        inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
                        inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
                        left join strukrealisasi_t sr on km.id = sr.objectkegiatanfk
                        and sr.kdprofile = 30 and sr.statusenabled = true
                        and sr.status = 'Sudah Diverifikasi'
                        and extract(month from sr.tglrealisasi) in('$bulanlalu', '$bulan')
                        where km.kdprofile = 30 and km.statusenabled = true
                        and kms.kdprofile = 30 and kms.statusenabled = true
                        and kmss.kdprofile = 30 and kmss.statusenabled = true
                        and kmsss.kdprofile = 30 and kmsss.statusenabled = true
                        and ap.kdprofile = 30 and ap.statusenabled = true
                        and kb.kdprofile = 30 and kb.statusenabled = true
                        and km.tahun = '$tahun'
                                        $qasalproduk
                        group by kmsss.keterangan, kmsss.kode, kmsss.div, sr.totalbelanja, sr.norec, extract(month from sr.tglrealisasi)
                    ) as a group by text, kode, div, bulan
                
                    union all
                    
                    select text, kode, div, sum(subtotal) subtotal,
                    case when bulan = '$bulanlalu' then sum(totalbelanja) else 0 end as totalbulanlalu,
                    case when bulan = '$bulan' then sum(totalbelanja) else 0 end as totalbulanini
                    from(
                        select kmss.keterangan as text, kmss.kode, kmss.div, sum(kb.subtotal) subtotal, sr.totalbelanja, sr.norec,
                            extract(month from sr.tglrealisasi) bulan
                            from kegiatananggaran_m km
                        inner join kegiatananggaran_m kms on km.kode ilike  kms.kode || '%' and kms.div = 3
                        inner join kegiatananggaran_m kmss on km.kode ilike  kmss.kode || '%' and kmss.div = 2
                        inner join kegiatananggaran_m kmsss on km.kode ilike  kmsss.kode || '%' and kmsss.div = 1
                        inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
                        inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
                        left join strukrealisasi_t sr on km.id = sr.objectkegiatanfk
                        and sr.kdprofile = 30 and sr.statusenabled = true
                        and sr.status = 'Sudah Diverifikasi'
                        and extract(month from sr.tglrealisasi) in('$bulanlalu', '$bulan')
                        where km.kdprofile = 30 and km.statusenabled = true
                        and kms.kdprofile = 30 and kms.statusenabled = true
                        and kmss.kdprofile = 30 and kmss.statusenabled = true
                        and kmsss.kdprofile = 30 and kmsss.statusenabled = true
                        and ap.kdprofile = 30 and ap.statusenabled = true
                        and kb.kdprofile = 30 and kb.statusenabled = true
                        and km.tahun = '$tahun'
                                        $qasalproduk
                        group by kmss.keterangan, kmss.kode, kmss.div, sr.totalbelanja, sr.norec, extract(month from sr.tglrealisasi)
                    ) as b group by text, kode, div, bulan
                
                    union all
                    
                    select text, kode, div, sum(subtotal) subtotal,
                    case when bulan = '$bulanlalu' then sum(totalbelanja) else 0 end as totalbulanlalu,
                    case when bulan = '$bulan' then sum(totalbelanja) else 0 end as totalbulanini
                    from(
                        select kms.keterangan as text, kms.kode, kms.div, sum(kb.subtotal) subtotal, sr.totalbelanja, sr.norec,
                            extract(month from sr.tglrealisasi) bulan
                            from kegiatananggaran_m km
                        inner join kegiatananggaran_m kms on km.kode ilike  kms.kode || '%' and kms.div = 3
                        inner join kegiatananggaran_m kmss on km.kode ilike  kmss.kode || '%' and kmss.div = 2
                        inner join kegiatananggaran_m kmsss on km.kode ilike  kmsss.kode || '%' and kmsss.div = 1
                        inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
                        inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
                        left join strukrealisasi_t sr on km.id = sr.objectkegiatanfk
                        and sr.kdprofile = 30 and sr.statusenabled = true
                        and sr.status = 'Sudah Diverifikasi'
                        and extract(month from sr.tglrealisasi) in('$bulanlalu', '$bulan')
                        where km.kdprofile = 30 and km.statusenabled = true
                        and kms.kdprofile = 30 and kms.statusenabled = true
                        and kmss.kdprofile = 30 and kmss.statusenabled = true
                        and kmsss.kdprofile = 30 and kmsss.statusenabled = true
                        and ap.kdprofile = 30 and ap.statusenabled = true
                        and kb.kdprofile = 30 and kb.statusenabled = true
                        and km.tahun = '$tahun'
                                        $qasalproduk
                        group by kms.keterangan, kms.kode, kms.div, sr.totalbelanja, sr.norec, extract(month from sr.tglrealisasi)
                    ) as c group by text, kode, div, bulan
                
                    union all
                    
                    select text, kode, div, sum(subtotal) subtotal,
                    case when bulan = '$bulanlalu' then sum(totalbelanja) else 0 end as totalbulanlalu,
                    case when bulan = '$bulan' then sum(totalbelanja) else 0 end as totalbulanini
                    from(
                        select km.keterangan as text, km.kode, km.div, sum(kb.subtotal) subtotal, sr.totalbelanja, sr.norec,
                        extract(month from sr.tglrealisasi) bulan
                            from kegiatananggaran_m km
                        inner join kegiatananggaran_m kms on km.kode ilike  kms.kode || '%' and kms.div = 3
                        inner join kegiatananggaran_m kmss on km.kode ilike  kmss.kode || '%' and kmss.div = 2
                        inner join kegiatananggaran_m kmsss on km.kode ilike  kmsss.kode || '%' and kmsss.div = 1
                        inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
                        inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
                        left join strukrealisasi_t sr on km.id = sr.objectkegiatanfk
                        and sr.kdprofile = 30 and sr.statusenabled = true
                        and sr.status = 'Sudah Diverifikasi'
                        and extract(month from sr.tglrealisasi) in('$bulanlalu', '$bulan')
                        where km.kdprofile = 30 and km.statusenabled = true
                        and kms.kdprofile = 30 and kms.statusenabled = true
                        and kmss.kdprofile = 30 and kmss.statusenabled = true
                        and kmsss.kdprofile = 30 and kmsss.statusenabled = true
                        and ap.kdprofile = 30 and ap.statusenabled = true
                        and kb.kdprofile = 30 and kb.statusenabled = true
                        and km.tahun = '$tahun'
                                        $qasalproduk
                        group by km.keterangan, km.kode, km.div, sr.totalbelanja, sr.norec, extract(month from sr.tglrealisasi)
                    ) as d group by text, kode, div, bulan
                ) as x
                group by text, kode, div
                
                union all
                
                select text, kode, div, sum(subtotal) subtotal, sum(totalbulanlalu) totalbulanlalu, 
                sum(totalbulanini) totalbulanini
                from(
                            select text, kode, 5 div, sum(subtotal) subtotal, 
                            case when bulan = '$bulanlalu' then sum(totalbelanja) else 0 end as totalbulanlalu,
                            case when bulan = '$bulan' then sum(totalbelanja) else 0 end as totalbulanini
                            from(
                                select mat.kodemataanggaran kode, mat.namamataanggaran as text, sum(kb.subtotal) subtotal,
                                sr.totalbelanja, sr.norec, extract(month from sr.tglrealisasi) bulan
                                from kegiatananggaran_m km
                                inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
                                inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
                                inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '.%'
                                and mat.kodemataanggaran in('I', 'II', 'III')
                                                        inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
                                left join strukrealisasi_t sr on km.id = sr.objectkegiatanfk
                                and sr.kdprofile = 30 and sr.statusenabled = true
                                and sr.status = 'Sudah Diverifikasi'
                                and extract(month from sr.tglrealisasi) in('$bulanlalu', '$bulan')
                                where km.kdprofile = 30 and km.statusenabled = true
                                and km.tahun = '$tahun'
                                                        $qasalproduk
                                and ma.kdprofile = 30 and ma.statusenabled = true
                                and mat.kdprofile = 30 and mat.statusenabled = true
                                and kb.kdprofile = 30 and kb.statusenabled = true
                                group by mat.kodemataanggaran, mat.namamataanggaran, sr.totalbelanja, sr.norec, extract(month from sr.tglrealisasi)
                            ) as a
                            group by kode, text, bulan
                
                            union all
                            
                            select text, kode, 5 div, sum(subtotal) subtotal, 
                            case when bulan = '$bulanlalu' then sum(totalbelanja) else 0 end as totalbulanlalu,
                            case when bulan = '$bulan' then sum(totalbelanja) else 0 end as totalbulanini
                            from(
                                select mat.kodemataanggaran kode, mat.namamataanggaran as text, sum(kb.subtotal) subtotal,
                                sr.totalbelanja, sr.norec, extract(month from sr.tglrealisasi) bulan
                                from kegiatananggaran_m km
                                inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
                                inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
                                inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
                                and 
                                case 
                                    when mat.kodemataanggaran ilike 'I.%' then char_length(mat.kodemataanggaran) = 3
                                end
                                                        inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
                                left join strukrealisasi_t sr on km.id = sr.objectkegiatanfk
                                and sr.kdprofile = 30 and sr.statusenabled = true
                                and sr.status = 'Sudah Diverifikasi'
                                and extract(month from sr.tglrealisasi) in('$bulanlalu', '$bulan')
                                where km.kdprofile = 30 and km.statusenabled = true
                                and km.tahun = '$tahun'
                                and ma.kdprofile = 30 and ma.statusenabled = true
                                and mat.kdprofile = 30 and mat.statusenabled = true
                                and kb.kdprofile = 30 and kb.statusenabled = true
                                                        $qasalproduk
                                group by mat.kodemataanggaran, mat.namamataanggaran, sr.totalbelanja, sr.norec, extract(month from sr.tglrealisasi)
                            ) as b 
                            group by kode, text, bulan
                
                            union all
                            
                            select text, kode, 5 div, sum(subtotal) subtotal, 
                            case when bulan = '$bulanlalu' then sum(totalbelanja) else 0 end as totalbulanlalu,
                            case when bulan = '$bulan' then sum(totalbelanja) else 0 end as totalbulanini
                            from(
                                select mat.kodemataanggaran kode, mat.namamataanggaran as text, sum(kb.subtotal) subtotal,
                                sr.totalbelanja, sr.norec, extract(month from sr.tglrealisasi) bulan
                                from kegiatananggaran_m km
                                inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
                                inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
                                inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
                                and 
                                case 
                                    when mat.kodemataanggaran ilike 'I.%' then char_length(mat.kodemataanggaran) = 5
                                    when mat.kodemataanggaran ilike 'II.%' then char_length(mat.kodemataanggaran) = 4
                                    when mat.kodemataanggaran ilike 'III.%' then char_length(mat.kodemataanggaran) = 5
                                end
                                                        inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
                                left join strukrealisasi_t sr on km.id = sr.objectkegiatanfk
                                and sr.kdprofile = 30 and sr.statusenabled = true
                                and sr.status = 'Sudah Diverifikasi'
                                and extract(month from sr.tglrealisasi) in('$bulanlalu', '$bulan')
                                where km.kdprofile = 30 and km.statusenabled = true
                                and km.tahun = '$tahun'
                                and ma.kdprofile = 30 and ma.statusenabled = true
                                and mat.kdprofile = 30 and mat.statusenabled = true
                                and kb.kdprofile = 30 and kb.statusenabled = true
                                                        $qasalproduk
                                group by mat.kodemataanggaran, mat.namamataanggaran, sr.totalbelanja, sr.norec, extract(month from sr.tglrealisasi)
                            ) as c 
                            group by kode, text, bulan
                
                            union all
                            
                            select text, kode, 5 div, sum(subtotal) subtotal, 
                            case when bulan = '$bulanlalu' then sum(totalbelanja) else 0 end as totalbulanlalu,
                            case when bulan = '$bulan' then sum(totalbelanja) else 0 end as totalbulanini
                            from(
                                select ma.kodemataanggaran kode, ma.namamataanggaran as text, sum(kb.subtotal) subtotal, 
                                sr.totalbelanja, sr.norec, extract(month from sr.tglrealisasi) bulan
                                from kegiatananggaran_m km
                                inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
                                inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
                                                        inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
                                left join strukrealisasi_t sr on km.id = sr.objectkegiatanfk
                                and sr.kdprofile = 30 and sr.statusenabled = true
                                and sr.status = 'Sudah Diverifikasi'
                                and extract(month from sr.tglrealisasi) in('$bulanlalu', '$bulan')
                                where km.kdprofile = 30 and km.statusenabled = true
                                and km.tahun = '$tahun'
                                and ma.kdprofile = 30 and ma.statusenabled = true
                                and kb.kdprofile = 30 and kb.statusenabled = true
                                                        $qasalproduk
                                group by ma.kodemataanggaran, ma.namamataanggaran, sr.totalbelanja, sr.norec, extract(month from sr.tglrealisasi)
                            ) as d 
                            group by kode, text, bulan
                ) as x
                group by text, kode, div
                
                union all
                
                select 'PENERIMAAN:' as text, 'KKKKK' kode, 6 div, 0 subtotal, 0 totalbulanlalu, 0 totalbulanini
                
                union all 
                
                select text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
                from(
                    select 'Transfer Bendahara Penerima' as text, 'LLLLL' kode, 6 div, 0 subtotal, 
                    case when extract(month from spp.tglspp) = '$bulanlalu' then sum(spp.nilaispp) else 0 end as totalbulanlalu,
                    case when extract(month from spp.tglspp) = '$bulan' then sum(spp.nilaispp) else 0 end as totalbulanini
                        from spp_t spp
                                inner join asalproduk_m ap on ap.id = spp.objectasalprodukfk
                    where spp.kdprofile = 30 and spp.statusenabled = true
                                and ap.kdprofile = 30 and ap.statusenabled = true
                    and extract(month from spp.tglspp) in('$bulanlalu', '$bulan')
                                $qasalproduk
                    group by extract(month from spp.tglspp)
                
                    union all
                
                    select 'Transfer Bendahara Penerima' as text, 'LLLLL' kode, 6 div, 0 subtotal, 
                    case when extract(month from bku.tglbku) = '$bulanlalu' then sum(spm.nilaispm) else 0 end as totalbulanlalu,
                    case when extract(month from bku.tglbku) = '$bulan' then sum(spm.nilaispm) else 0 end as totalbulanini
                        from spm_t spm
                                inner join asalproduk_m ap on ap.id = spm.objectasalprodukfk
                                inner join bukukasumum_t bku on bku.norec = spm.objectbkufk
                    where spm.kdprofile = 30 and spm.statusenabled = true
                                and bku.kdprofile = 30 and bku.statusenabled = true
                    and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                                $qasalproduk
                    group by extract(month from bku.tglbku)
                ) as x
                group by text, kode, div, subtotal
                
                union all
                
                select text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
                from(
                    select 'Jasa Giro' as text, 'MMMMM' kode, 7 div, 0 subtotal, 
                    case when extract(month from bku.tglbku) = '$bulanlalu' then sum(jg.jumlahpemasukan) else 0 end as totalbulanlalu,
                    case when extract(month from bku.tglbku) = '$bulan' then sum(jg.jumlahpemasukan) else 0 end as totalbulanini
                        from jasagiro_t jg
                                inner join bukukasumum_t bku on bku.norec = jg.objectbkufk
                    where jg.kdprofile = 30 and jg.statusenabled = true
                    and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                                and bku.kdprofile = 30 and bku.statusenabled = true
                    group by jg.uraianjasagiro, jg.nojasagiro, extract(month from bku.tglbku)
                ) as x
                group by text, kode, div, subtotal
        
                        union all
        
                        select text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
                        from(
                            select 'STS' as text, 'MMMMM' kode, 18 div, 0 subtotal, 
                            case when extract(month from bku.tglbku) = '$bulanlalu' then sum(sts.nilaists::float8) else 0 end as totalbulanlalu,
                            case when extract(month from bku.tglbku) = '$bulan' then sum(sts.nilaists::float8) else 0 end as totalbulanini
                                from stskeuangan_t sts
                            inner join asalproduk_m ap on ap.id = sts.objectsumberdanafk
                            inner join bukukasumum_t bku on bku.norec = sts.objectbkufk
                            where sts.kdprofile = 30 and sts.statusenabled = true
                            and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                            and bku.kdprofile = 30 and bku.statusenabled = true
                            $qasalproduk
                            group by sts.uraiansts, extract(month from bku.tglbku)
                        ) as x
                        group by text, kode, div, subtotal
                
                union all
                
                select text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
                from(
                    select 'Potongan Pajak' as text, 'OOOOO' kode, 8 div, 0 subtotal, 
                    case when extract(month from bku.tglbku) = '$bulanlalu' then sum(pp.ppn+pp.pph) else 0 end as totalbulanlalu,
                    case when extract(month from bku.tglbku) = '$bulan' then sum(pp.ppn+pp.pph) else 0 end as totalbulanini
                        from penyetoranpajak_t pp
                                inner join bukukasumum_t bku on bku.norec = pp.objectbkufk
                    where pp.kdprofile = 30 and pp.statusenabled = true
                    and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                                and bku.kdprofile = 30 and bku.statusenabled = true
                    group by pp.uraianpajak, extract(month from bku.tglbku)
                ) as x
                group by text, kode, div, subtotal
                
                union all
                
                select text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
                from(
                    select 'PPN' as text, 'OOOOO' kode, 9 div, 0 subtotal, 
                    case when extract(month from bku.tglbku) = '$bulanlalu' then sum(pp.ppn) else 0 end as totalbulanlalu,
                    case when extract(month from bku.tglbku) = '$bulan' then sum(pp.ppn) else 0 end as totalbulanini
                        from penyetoranpajak_t pp
                                inner join bukukasumum_t bku on bku.norec = pp.objectbkufk
                    where pp.kdprofile = 30 and pp.statusenabled = true
                    and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                                and bku.kdprofile = 30 and bku.statusenabled = true
                    group by extract(month from bku.tglbku)
                ) as x
                group by text, kode, div, subtotal
                
                union all
                
                select jp.jenispajak as text, 'OOOOO' kode, 9 div, 0 subtotal, 
                case when extract(month from bku.tglbku) = '$bulanlalu' then sum(pmp.pph) else 0 end as totalbulanlalu,
                case when extract(month from bku.tglbku) = '$bulan' then sum(pmp.pph) else 0 end as totalbulanini
                    from pemungutanpajak_t pmp
                inner join jenispajak_m jp on jp.id = pmp.objectjenispphfk
                        inner join bukukasumum_t bku on bku.norec = pmp.objectbkufk
                where pmp.kdprofile = 30 and pmp.statusenabled = true
                and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                        and bku.kdprofile = 30 and bku.statusenabled = true
                group by jp.jenispajak, extract(month from bku.tglbku)
                
                union all
                
                select 'JUMLAH PENERIMAAN:' as text, 'PPPPP' kode, 9 div, 0 subtotal,
                sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
                from(
                    select text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
                                from(
                                        select 'Transfer Bendahara Penerima' as text, 'LLLLL' kode, 6 div, 0 subtotal, 
                                        case when extract(month from spp.tglspp) = '$bulanlalu' then sum(spp.nilaispp) else 0 end as totalbulanlalu,
                                        case when extract(month from spp.tglspp) = '$bulan' then sum(spp.nilaispp) else 0 end as totalbulanini
                                                from spp_t spp
                                        inner join asalproduk_m ap on ap.id = spp.objectasalprodukfk
                                        where spp.kdprofile = 30 and spp.statusenabled = true
                                        and ap.kdprofile = 30 and ap.statusenabled = true
                                        and extract(month from spp.tglspp) in('$bulanlalu', '$bulan')
                                        $qasalproduk
                                        group by extract(month from spp.tglspp)
                                
                                        union all
                                
                                        select 'Transfer Bendahara Penerima' as text, 'LLLLL' kode, 6 div, 0 subtotal, 
                                        case when extract(month from bku.tglbku) = '$bulanlalu' then sum(spm.nilaispm) else 0 end as totalbulanlalu,
                                        case when extract(month from bku.tglbku) = '$bulan' then sum(spm.nilaispm) else 0 end as totalbulanini
                                                from spm_t spm
                                        inner join asalproduk_m ap on ap.id = spm.objectasalprodukfk
                                        inner join bukukasumum_t bku on bku.norec = spm.objectbkufk
                                        where spm.kdprofile = 30 and spm.statusenabled = true
                                        and bku.kdprofile = 30 and bku.statusenabled = true
                                        and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                                        $qasalproduk
                                        group by extract(month from bku.tglbku)
                                ) as x
                                group by text, kode, div, subtotal
                                
                                union all
                                
                                select text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
                                from(
                                        select 'Jasa Giro' as text, 'MMMMM' kode, 7 div, 0 subtotal, 
                                        case when extract(month from bku.tglbku) = '$bulanlalu' then sum(jg.jumlahpemasukan) else 0 end as totalbulanlalu,
                                        case when extract(month from bku.tglbku) = '$bulan' then sum(jg.jumlahpemasukan) else 0 end as totalbulanini
                                                from jasagiro_t jg
                                        inner join bukukasumum_t bku on bku.norec = jg.objectbkufk
                                        where jg.kdprofile = 30 and jg.statusenabled = true
                                        and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                                        and bku.kdprofile = 30 and bku.statusenabled = true
                                        group by jg.uraianjasagiro, jg.nojasagiro, extract(month from bku.tglbku)
                                ) as x
                                group by text, kode, div, subtotal
        
                                union all
        
                                select text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
                                from(
                                    select 'STS' as text, 'MMMMM' kode, 18 div, 0 subtotal, 
                                    case when extract(month from bku.tglbku) = '$bulanlalu' then sum(sts.nilaists::float8) else 0 end as totalbulanlalu,
                                    case when extract(month from bku.tglbku) = '$bulan' then sum(sts.nilaists::float8) else 0 end as totalbulanini
                                        from stskeuangan_t sts
                                    inner join asalproduk_m ap on ap.id = sts.objectsumberdanafk
                                    inner join bukukasumum_t bku on bku.norec = sts.objectbkufk
                                    where sts.kdprofile = 30 and sts.statusenabled = true
                                    and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                                    and bku.kdprofile = 30 and bku.statusenabled = true
                                    $qasalproduk
                                    group by sts.uraiansts, extract(month from bku.tglbku)
                                ) as x
                                group by text, kode, div, subtotal
                                
                                union all
                                
                                select text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
                                from(
                                        select 'Potongan Pajak' as text, 'OOOOO' kode, 8 div, 0 subtotal, 
                                        case when extract(month from bku.tglbku) = '$bulanlalu' then sum(pp.ppn+pp.pph) else 0 end as totalbulanlalu,
                                        case when extract(month from bku.tglbku) = '$bulan' then sum(pp.ppn+pp.pph) else 0 end as totalbulanini
                                                from penyetoranpajak_t pp
                                        inner join bukukasumum_t bku on bku.norec = pp.objectbkufk
                                        where pp.kdprofile = 30 and pp.statusenabled = true
                                        and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                                        and bku.kdprofile = 30 and bku.statusenabled = true
                                        group by pp.uraianpajak, extract(month from bku.tglbku)
                                ) as x
                                group by text, kode, div, subtotal
                                
                                union all
                                
                                select text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
                                from(
                                        select 'PPN' as text, 'OOOOO' kode, 9 div, 0 subtotal, 
                                        case when extract(month from bku.tglbku) = '$bulanlalu' then sum(pp.ppn) else 0 end as totalbulanlalu,
                                        case when extract(month from bku.tglbku) = '$bulan' then sum(pp.ppn) else 0 end as totalbulanini
                                                from penyetoranpajak_t pp
                                        inner join bukukasumum_t bku on bku.norec = pp.objectbkufk
                                        where pp.kdprofile = 30 and pp.statusenabled = true
                                        and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                                        and bku.kdprofile = 30 and bku.statusenabled = true
                                        group by extract(month from bku.tglbku)
                                ) as x
                                group by text, kode, div, subtotal
                                
                                union all
                                
                                select jp.jenispajak as text, 'OOOOO' kode, 9 div, 0 subtotal, 
                                case when extract(month from bku.tglbku) = '$bulanlalu' then sum(pmp.pph) else 0 end as totalbulanlalu,
                                case when extract(month from bku.tglbku) = '$bulan' then sum(pmp.pph) else 0 end as totalbulanini
                                        from pemungutanpajak_t pmp
                                inner join jenispajak_m jp on jp.id = pmp.objectjenispphfk
                                inner join bukukasumum_t bku on bku.norec = pmp.objectbkufk
                                where pmp.kdprofile = 30 and pmp.statusenabled = true
                                and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                                and bku.kdprofile = 30 and bku.statusenabled = true
                                group by jp.jenispajak, extract(month from bku.tglbku)
                ) as y
                
                union all 
                
                select 'PENGELUARAN:' as text, 'QQQQQ' kode, 9 div, 0 subtotal, 0 totalbulanlalu, 0 totalbulanini
                
                union all 
                        
                        select text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
                from(
                            select text, kode, div, subtotal,
                            case when tglrealisasi = '$bulanlalu' then sum(totalbelanja) else 0 end as totalbulanlalu,
                            case when tglrealisasi = '$bulan' then sum(totalbelanja) else 0 end as totalbulanini
                            from(
                                    select 'SPJ' as text, 'RRRRR' kode, 10 div, 0 subtotal, extract(month from bku.tglbku) tglrealisasi, sr.totalbelanja, sr.norec
                                            from kegiatananggaran_m km
                                    inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
                                    inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
                                    inner join strukrealisasi_t sr on km.id = sr.objectkegiatanfk
                                    inner join bukukasumum_t bku on bku.norec = sr.objectbkufk
                                    where sr.kdprofile = 30 and sr.statusenabled = true
                                    and km.kdprofile = 30 and km.statusenabled = true
                                    and kb.kdprofile = 30 and kb.statusenabled = true
                                    and bku.kdprofile = 30 and bku.statusenabled = true
                                    and sr.status = 'Sudah Diverifikasi'
                                    and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                                    $qasalproduk
                                    group by extract(month from bku.tglbku), sr.totalbelanja, sr.norec
                            ) as x
                            group by tglrealisasi, text, kode, div, subtotal
                        ) as x
                group by text, kode, div, subtotal
                
                union all
                
                select text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
                from(
                    select 'Jasa Giro' as text, 'SSSSS' kode, 11 div, 0 subtotal, 
                    case when extract(month from bku.tglbku) = '$bulanlalu' then sum(jg.jumlahpemasukan) else 0 end as totalbulanlalu,
                    case when extract(month from bku.tglbku) = '$bulan' then sum(jg.jumlahpemasukan) else 0 end as totalbulanini
                        from jasagiro_t jg
                                inner join bukukasumum_t bku on bku.norec = jg.objectbkufk
                    where jg.kdprofile = 30 and jg.statusenabled = true
                    and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                                and bku.kdprofile = 30 and bku.statusenabled = true
                    group by jg.uraianjasagiro, jg.nojasagiro, extract(month from bku.tglbku)
                ) as x
                group by text, kode, div, subtotal
        
                        union all
        
                        select text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
                        from(
                            select 'STS' as text, 'TTTTT' kode, 12 div, 0 subtotal, 
                            case when extract(month from bku.tglbku) = '$bulanlalu' then sum(sts.nilaists::float8) else 0 end as totalbulanlalu,
                            case when extract(month from bku.tglbku) = '$bulan' then sum(sts.nilaists::float8) else 0 end as totalbulanini
                                from stskeuangan_t sts
                            inner join asalproduk_m ap on ap.id = sts.objectsumberdanafk
                            inner join bukukasumum_t bku on bku.norec = sts.objectbkufk
                            where sts.kdprofile = 30 and sts.statusenabled = true
                            and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                            and bku.kdprofile = 30 and bku.statusenabled = true
                            $qasalproduk
                            group by sts.uraiansts, extract(month from bku.tglbku)
                        ) as x
                        group by text, kode, div, subtotal
                
                union all
                
                select text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
                from(
                    select 'Penyetoran Pajak' as text, 'UUUUU' kode, 13 div, 0 subtotal, 
                    case when extract(month from bku.tglbku) = '$bulanlalu' then sum(pp.ppn+pp.pph) else 0 end as totalbulanlalu,
                    case when extract(month from bku.tglbku) = '$bulan' then sum(pp.ppn+pp.pph) else 0 end as totalbulanini
                        from penyetoranpajak_t pp
                                inner join bukukasumum_t bku on bku.norec = pp.objectbkufk
                    where pp.kdprofile = 30 and pp.statusenabled = true
                    and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                                and bku.kdprofile = 30 and bku.statusenabled = true
                    group by pp.uraianpajak, extract(month from bku.tglbku)
                ) as x
                group by text, kode, div, subtotal
                
                union all
                
                select text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
                from(
                    select 'PPN' as text, 'VVVVV' kode, 14 div, 0 subtotal, 
                    case when extract(month from bku.tglbku) = '$bulanlalu' then sum(pp.ppn) else 0 end as totalbulanlalu,
                    case when extract(month from bku.tglbku) = '$bulan' then sum(pp.ppn) else 0 end as totalbulanini
                        from penyetoranpajak_t pp
                                inner join bukukasumum_t bku on bku.norec = pp.objectbkufk
                    where pp.kdprofile = 30 and pp.statusenabled = true
                    and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                                and bku.kdprofile = 30 and bku.statusenabled = true
                    group by extract(month from bku.tglbku)
                ) as x
                group by text, kode, div, subtotal
                
                union all
                
                select jp.jenispajak as text, 'WWWWW' kode, 15 div, 0 subtotal, 
                case when extract(month from bku.tglbku) = '$bulanlalu' then sum(pmp.pph) else 0 end as totalbulanlalu,
                case when extract(month from bku.tglbku) = '$bulan' then sum(pmp.pph) else 0 end as totalbulanini
                    from pemungutanpajak_t pmp
                inner join jenispajak_m jp on jp.id = pmp.objectjenispphfk
                        inner join bukukasumum_t bku on bku.norec = pmp.objectbkufk
                where pmp.kdprofile = 30 and pmp.statusenabled = true
                and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                        and bku.kdprofile = 30 and bku.statusenabled = true
                group by jp.jenispajak, extract(month from bku.tglbku)
                
                union all
                
                select 'JUMLAH PENGELUARAN:' as text, 'XXXXX' kode, 16 div, 0 subtotal,
                sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
                from(
                    select text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
                                from(
                                    select text, kode, div, subtotal,
                                    case when tglrealisasi = '$bulanlalu' then sum(totalbelanja) else 0 end as totalbulanlalu,
                                    case when tglrealisasi = '$bulan' then sum(totalbelanja) else 0 end as totalbulanini
                                    from(
                                            select 'SPJ' as text, 'RRRRR' kode, 10 div, 0 subtotal, extract(month from bku.tglbku) tglrealisasi, sr.totalbelanja, sr.norec
                                                    from kegiatananggaran_m km
                                            inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
                                            inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
                                            inner join strukrealisasi_t sr on km.id = sr.objectkegiatanfk
                                            inner join bukukasumum_t bku on bku.norec = sr.objectbkufk
                                            where sr.kdprofile = 30 and sr.statusenabled = true
                                            and km.kdprofile = 30 and km.statusenabled = true
                                            and kb.kdprofile = 30 and kb.statusenabled = true
                                            and bku.kdprofile = 30 and bku.statusenabled = true
                                            and sr.status = 'Sudah Diverifikasi'
                                            and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                                            $qasalproduk
                                            group by extract(month from bku.tglbku), sr.totalbelanja, sr.norec
                                    ) as x
                                    group by tglrealisasi, text, kode, div, subtotal
                                ) as x
                                group by text, kode, div, subtotal
                                
                                union all
                                
                                select text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
                                from(
                                        select 'Jasa Giro' as text, 'SSSSS' kode, 11 div, 0 subtotal, 
                                        case when extract(month from bku.tglbku) = '$bulanlalu' then sum(jg.jumlahpemasukan) else 0 end as totalbulanlalu,
                                        case when extract(month from bku.tglbku) = '$bulan' then sum(jg.jumlahpemasukan) else 0 end as totalbulanini
                                                from jasagiro_t jg
                                        inner join bukukasumum_t bku on bku.norec = jg.objectbkufk
                                        where jg.kdprofile = 30 and jg.statusenabled = true
                                        and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                                        and bku.kdprofile = 30 and bku.statusenabled = true
                                        group by jg.uraianjasagiro, jg.nojasagiro, extract(month from bku.tglbku)
                                ) as x
                                group by text, kode, div, subtotal
        
                                union all
        
                                select text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
                                from(
                                    select 'STS' as text, 'TTTTT' kode, 12 div, 0 subtotal, 
                                    case when extract(month from bku.tglbku) = '$bulanlalu' then sum(sts.nilaists::float8) else 0 end as totalbulanlalu,
                                    case when extract(month from bku.tglbku) = '$bulan' then sum(sts.nilaists::float8) else 0 end as totalbulanini
                                        from stskeuangan_t sts
                                    inner join asalproduk_m ap on ap.id = sts.objectsumberdanafk
                                    inner join bukukasumum_t bku on bku.norec = sts.objectbkufk
                                    where sts.kdprofile = 30 and sts.statusenabled = true
                                    and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                                    and bku.kdprofile = 30 and bku.statusenabled = true
                                    $qasalproduk
                                    group by sts.uraiansts, extract(month from bku.tglbku)
                                ) as x
                                group by text, kode, div, subtotal
                                
                                union all
                                
                                select text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
                                from(
                                        select 'Penyetoran Pajak' as text, 'UUUUU' kode, 13 div, 0 subtotal, 
                                        case when extract(month from bku.tglbku) = '$bulanlalu' then sum(pp.ppn+pp.pph) else 0 end as totalbulanlalu,
                                        case when extract(month from bku.tglbku) = '$bulan' then sum(pp.ppn+pp.pph) else 0 end as totalbulanini
                                                from penyetoranpajak_t pp
                                        inner join bukukasumum_t bku on bku.norec = pp.objectbkufk
                                        where pp.kdprofile = 30 and pp.statusenabled = true
                                        and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                                        and bku.kdprofile = 30 and bku.statusenabled = true
                                        group by pp.uraianpajak, extract(month from bku.tglbku)
                                ) as x
                                group by text, kode, div, subtotal
                                
                                union all
                                
                                select text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
                                from(
                                        select 'PPN' as text, 'VVVVV' kode, 14 div, 0 subtotal, 
                                        case when extract(month from bku.tglbku) = '$bulanlalu' then sum(pp.ppn) else 0 end as totalbulanlalu,
                                        case when extract(month from bku.tglbku) = '$bulan' then sum(pp.ppn) else 0 end as totalbulanini
                                                from penyetoranpajak_t pp
                                        inner join bukukasumum_t bku on bku.norec = pp.objectbkufk
                                        where pp.kdprofile = 30 and pp.statusenabled = true
                                        and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                                        and bku.kdprofile = 30 and bku.statusenabled = true
                                        group by extract(month from bku.tglbku)
                                ) as x
                                group by text, kode, div, subtotal
                                
                                union all
                                
                                select jp.jenispajak as text, 'WWWWW' kode, 15 div, 0 subtotal, 
                                case when extract(month from bku.tglbku) = '$bulanlalu' then sum(pmp.pph) else 0 end as totalbulanlalu,
                                case when extract(month from bku.tglbku) = '$bulan' then sum(pmp.pph) else 0 end as totalbulanini
                                        from pemungutanpajak_t pmp
                                inner join jenispajak_m jp on jp.id = pmp.objectjenispphfk
                                inner join bukukasumum_t bku on bku.norec = pmp.objectbkufk
                                where pmp.kdprofile = 30 and pmp.statusenabled = true
                                and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                                and bku.kdprofile = 30 and bku.statusenabled = true
                                group by jp.jenispajak, extract(month from bku.tglbku)
                ) as y
                
                order by kode, div"));
        } else{
            $data = DB::select(DB::raw("select text, kode, div, sum(subtotal) subtotal, sum(totalbulanlalu) totalbulanlalu, 
        sum(totalbulanini) totalbulanini
        from(
                    select text, kode, div, sum(subtotal) subtotal,
                    case when bulan = '$bulanlalu' then sum(totalbelanja) else 0 end as totalbulanlalu,
                    case when bulan = '$bulan' then sum(totalbelanja) else 0 end as totalbulanini
                    from(
                        select kmsss.keterangan as text, kmsss.kode, kmsss.div, sum(kb.subtotal) subtotal, sr.totalbelanja, sr.norec,
                            extract(month from sr.tglrealisasi) bulan
                            from kegiatananggaran_m km
                        inner join kegiatananggaran_m kms on km.kode ilike  kms.kode || '%' and kms.div = 3
                        inner join kegiatananggaran_m kmss on km.kode ilike  kmss.kode || '%' and kmss.div = 2
                        inner join kegiatananggaran_m kmsss on km.kode ilike  kmsss.kode || '%' and kmsss.div = 1
                        inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
                        inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
                        left join strukrealisasi_t sr on km.id = sr.objectkegiatanfk
                        and sr.kdprofile = 30 and sr.statusenabled = true
                        and sr.status = 'Sudah Diverifikasi'
                        and extract(month from sr.tglrealisasi) in('$bulanlalu', '$bulan')
                        where km.kdprofile = 30 and km.statusenabled = true
                        and kms.kdprofile = 30 and kms.statusenabled = true
                        and kmss.kdprofile = 30 and kmss.statusenabled = true
                        and kmsss.kdprofile = 30 and kmsss.statusenabled = true
                        and ap.kdprofile = 30 and ap.statusenabled = true
                        and kb.kdprofile = 30 and kb.statusenabled = true
                        and km.tahun = '$tahun'
                                        $qasalproduk
                        group by kmsss.keterangan, kmsss.kode, kmsss.div, sr.totalbelanja, sr.norec, extract(month from sr.tglrealisasi)
                    ) as a group by text, kode, div, bulan
                
                    union all
                    
                    select text, kode, div, sum(subtotal) subtotal,
                    case when bulan = '$bulanlalu' then sum(totalbelanja) else 0 end as totalbulanlalu,
                    case when bulan = '$bulan' then sum(totalbelanja) else 0 end as totalbulanini
                    from(
                        select kmss.keterangan as text, kmss.kode, kmss.div, sum(kb.subtotal) subtotal, sr.totalbelanja, sr.norec,
                            extract(month from sr.tglrealisasi) bulan
                            from kegiatananggaran_m km
                        inner join kegiatananggaran_m kms on km.kode ilike  kms.kode || '%' and kms.div = 3
                        inner join kegiatananggaran_m kmss on km.kode ilike  kmss.kode || '%' and kmss.div = 2
                        inner join kegiatananggaran_m kmsss on km.kode ilike  kmsss.kode || '%' and kmsss.div = 1
                        inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
                        inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
                        left join strukrealisasi_t sr on km.id = sr.objectkegiatanfk
                        and sr.kdprofile = 30 and sr.statusenabled = true
                        and sr.status = 'Sudah Diverifikasi'
                        and extract(month from sr.tglrealisasi) in('$bulanlalu', '$bulan')
                        where km.kdprofile = 30 and km.statusenabled = true
                        and kms.kdprofile = 30 and kms.statusenabled = true
                        and kmss.kdprofile = 30 and kmss.statusenabled = true
                        and kmsss.kdprofile = 30 and kmsss.statusenabled = true
                        and ap.kdprofile = 30 and ap.statusenabled = true
                        and kb.kdprofile = 30 and kb.statusenabled = true
                        and km.tahun = '$tahun'
                                        $qasalproduk
                        group by kmss.keterangan, kmss.kode, kmss.div, sr.totalbelanja, sr.norec, extract(month from sr.tglrealisasi)
                    ) as b group by text, kode, div, bulan
                
                    union all
                    
                    select text, kode, div, sum(subtotal) subtotal,
                    case when bulan = '$bulanlalu' then sum(totalbelanja) else 0 end as totalbulanlalu,
                    case when bulan = '$bulan' then sum(totalbelanja) else 0 end as totalbulanini
                    from(
                        select kms.keterangan as text, kms.kode, kms.div, sum(kb.subtotal) subtotal, sr.totalbelanja, sr.norec,
                            extract(month from sr.tglrealisasi) bulan
                            from kegiatananggaran_m km
                        inner join kegiatananggaran_m kms on km.kode ilike  kms.kode || '%' and kms.div = 3
                        inner join kegiatananggaran_m kmss on km.kode ilike  kmss.kode || '%' and kmss.div = 2
                        inner join kegiatananggaran_m kmsss on km.kode ilike  kmsss.kode || '%' and kmsss.div = 1
                        inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
                        inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
                        left join strukrealisasi_t sr on km.id = sr.objectkegiatanfk
                        and sr.kdprofile = 30 and sr.statusenabled = true
                        and sr.status = 'Sudah Diverifikasi'
                        and extract(month from sr.tglrealisasi) in('$bulanlalu', '$bulan')
                        where km.kdprofile = 30 and km.statusenabled = true
                        and kms.kdprofile = 30 and kms.statusenabled = true
                        and kmss.kdprofile = 30 and kmss.statusenabled = true
                        and kmsss.kdprofile = 30 and kmsss.statusenabled = true
                        and ap.kdprofile = 30 and ap.statusenabled = true
                        and kb.kdprofile = 30 and kb.statusenabled = true
                        and km.tahun = '$tahun'
                                        $qasalproduk
                        group by kms.keterangan, kms.kode, kms.div, sr.totalbelanja, sr.norec, extract(month from sr.tglrealisasi)
                    ) as c group by text, kode, div, bulan
                
                    union all
                    
                    select text, kode, div, sum(subtotal) subtotal,
                    case when bulan = '$bulanlalu' then sum(totalbelanja) else 0 end as totalbulanlalu,
                    case when bulan = '$bulan' then sum(totalbelanja) else 0 end as totalbulanini
                    from(
                        select km.keterangan as text, km.kode, km.div, sum(kb.subtotal) subtotal, sr.totalbelanja, sr.norec,
                        extract(month from sr.tglrealisasi) bulan
                            from kegiatananggaran_m km
                        inner join kegiatananggaran_m kms on km.kode ilike  kms.kode || '%' and kms.div = 3
                        inner join kegiatananggaran_m kmss on km.kode ilike  kmss.kode || '%' and kmss.div = 2
                        inner join kegiatananggaran_m kmsss on km.kode ilike  kmsss.kode || '%' and kmsss.div = 1
                        inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
                        inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
                        left join strukrealisasi_t sr on km.id = sr.objectkegiatanfk
                        and sr.kdprofile = 30 and sr.statusenabled = true
                        and sr.status = 'Sudah Diverifikasi'
                        and extract(month from sr.tglrealisasi) in('$bulanlalu', '$bulan')
                        where km.kdprofile = 30 and km.statusenabled = true
                        and kms.kdprofile = 30 and kms.statusenabled = true
                        and kmss.kdprofile = 30 and kmss.statusenabled = true
                        and kmsss.kdprofile = 30 and kmsss.statusenabled = true
                        and ap.kdprofile = 30 and ap.statusenabled = true
                        and kb.kdprofile = 30 and kb.statusenabled = true
                        and km.tahun = '$tahun'
                                        $qasalproduk
                        group by km.keterangan, km.kode, km.div, sr.totalbelanja, sr.norec, extract(month from sr.tglrealisasi)
                    ) as d group by text, kode, div, bulan
                ) as x
                group by text, kode, div
                
                union all
                
                select text, kode, div, sum(subtotal) subtotal, sum(totalbulanlalu) totalbulanlalu, 
                sum(totalbulanini) totalbulanini
                from(
                            select text, kode, 5 div, sum(subtotal) subtotal, 
                            case when bulan = '$bulanlalu' then sum(totalbelanja) else 0 end as totalbulanlalu,
                            case when bulan = '$bulan' then sum(totalbelanja) else 0 end as totalbulanini
                            from(
                                select map3.kode, map3.mataanggaranpermen as text, sum(kb.subtotal) subtotal,
                                sr.totalbelanja, sr.norec, extract(month from sr.tglrealisasi) bulan
                                from kegiatananggaran_m km
                                inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
                                inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
                                inner join mataanggaranpermen_m map on map.id = ma.mataanggaranpermenfk
                                inner join mataanggaranpermen_m map1 on map1.id = map.mataanggaranpermenfk and map1.div = 4
                                inner join mataanggaranpermen_m map2 on map2.id = map1.mataanggaranpermenfk and map2.div = 3
                                inner join mataanggaranpermen_m map3 on map3.id = map2.mataanggaranpermenfk and map3.div = 2
                                inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
                                left join strukrealisasi_t sr on km.id = sr.objectkegiatanfk
                                and sr.kdprofile = 30 and sr.statusenabled = true
                                and sr.status = 'Sudah Diverifikasi'
                                and extract(month from sr.tglrealisasi) in('$bulanlalu', '$bulan')
                                where km.kdprofile = 30 and km.statusenabled = true
                                and km.tahun = '$tahun'
                                $qasalproduk
                                and ma.kdprofile = 30 and ma.statusenabled = true
                                and map.kdprofile = 30 and map.statusenabled = true
                                and map1.kdprofile = 30 and map1.statusenabled = true
                                and map2.kdprofile = 30 and map2.statusenabled = true
                                and map3.kdprofile = 30 and map3.statusenabled = true
                                and kb.kdprofile = 30 and kb.statusenabled = true
                                group by map3.kode, map3.mataanggaranpermen, sr.totalbelanja, sr.norec, extract(month from sr.tglrealisasi)
                            ) as a
                            group by kode, text, bulan
                
                            union all
                            
                            select text, kode, 5 div, sum(subtotal) subtotal, 
                            case when bulan = '$bulanlalu' then sum(totalbelanja) else 0 end as totalbulanlalu,
                            case when bulan = '$bulan' then sum(totalbelanja) else 0 end as totalbulanini
                            from(
                                select map2.kode, map2.mataanggaranpermen as text, sum(kb.subtotal) subtotal,
                                sr.totalbelanja, sr.norec, extract(month from sr.tglrealisasi) bulan
                                from kegiatananggaran_m km
                                inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
                                inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
                                inner join mataanggaranpermen_m map on map.id = ma.mataanggaranpermenfk
                                inner join mataanggaranpermen_m map1 on map1.id = map.mataanggaranpermenfk and map1.div = 4
                                inner join mataanggaranpermen_m map2 on map2.id = map1.mataanggaranpermenfk and map2.div = 3
                                inner join mataanggaranpermen_m map3 on map3.id = map2.mataanggaranpermenfk and map3.div = 2
                                inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
                                left join strukrealisasi_t sr on km.id = sr.objectkegiatanfk
                                and sr.kdprofile = 30 and sr.statusenabled = true
                                and sr.status = 'Sudah Diverifikasi'
                                and extract(month from sr.tglrealisasi) in('$bulanlalu', '$bulan')
                                where km.kdprofile = 30 and km.statusenabled = true
                                and km.tahun = '$tahun'
                                and ma.kdprofile = 30 and ma.statusenabled = true
                                and map.kdprofile = 30 and map.statusenabled = true
                                and map1.kdprofile = 30 and map1.statusenabled = true
                                and map2.kdprofile = 30 and map2.statusenabled = true
                                and map3.kdprofile = 30 and map3.statusenabled = true
                                and kb.kdprofile = 30 and kb.statusenabled = true
                                $qasalproduk
                                group by map2.kode, map2.mataanggaranpermen, sr.totalbelanja, sr.norec, extract(month from sr.tglrealisasi)
                            ) as b 
                            group by kode, text, bulan
                
                            union all
                            
                            select text, kode, 5 div, sum(subtotal) subtotal, 
                            case when bulan = '$bulanlalu' then sum(totalbelanja) else 0 end as totalbulanlalu,
                            case when bulan = '$bulan' then sum(totalbelanja) else 0 end as totalbulanini
                            from(
                                select map1.kode, map1.mataanggaranpermen as text, sum(kb.subtotal) subtotal,
                                sr.totalbelanja, sr.norec, extract(month from sr.tglrealisasi) bulan
                                from kegiatananggaran_m km
                                inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
                                inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
                                inner join mataanggaranpermen_m map on map.id = ma.mataanggaranpermenfk
                                inner join mataanggaranpermen_m map1 on map1.id = map.mataanggaranpermenfk and map1.div = 4
                                inner join mataanggaranpermen_m map2 on map2.id = map1.mataanggaranpermenfk and map2.div = 3
                                inner join mataanggaranpermen_m map3 on map3.id = map2.mataanggaranpermenfk and map3.div = 2
                                inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
                                left join strukrealisasi_t sr on km.id = sr.objectkegiatanfk
                                and sr.kdprofile = 30 and sr.statusenabled = true
                                and sr.status = 'Sudah Diverifikasi'
                                and extract(month from sr.tglrealisasi) in('$bulanlalu', '$bulan')
                                where km.kdprofile = 30 and km.statusenabled = true
                                and km.tahun = '$tahun'
                                and ma.kdprofile = 30 and ma.statusenabled = true
                                and map.kdprofile = 30 and map.statusenabled = true
                                and map1.kdprofile = 30 and map1.statusenabled = true
                                and map2.kdprofile = 30 and map2.statusenabled = true
                                and map3.kdprofile = 30 and map3.statusenabled = true
                                and kb.kdprofile = 30 and kb.statusenabled = true
                                $qasalproduk
                                group by map1.kode, map1.mataanggaranpermen, sr.totalbelanja, sr.norec, extract(month from sr.tglrealisasi)
                            ) as c 
                            group by kode, text, bulan
                
                            union all
                            
                            select text, kode, 5 div, sum(subtotal) subtotal, 
                            case when bulan = '$bulanlalu' then sum(totalbelanja) else 0 end as totalbulanlalu,
                            case when bulan = '$bulan' then sum(totalbelanja) else 0 end as totalbulanini
                            from(
                                select map.kode, map.mataanggaranpermen as text, sum(kb.subtotal) subtotal, 
                                sr.totalbelanja, sr.norec, extract(month from sr.tglrealisasi) bulan
                                from kegiatananggaran_m km
                                inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
                                inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
                                inner join mataanggaranpermen_m map on map.id = ma.mataanggaranpermenfk
                                inner join mataanggaranpermen_m map1 on map1.id = map.mataanggaranpermenfk and map1.div = 4
                                inner join mataanggaranpermen_m map2 on map2.id = map1.mataanggaranpermenfk and map2.div = 3
                                inner join mataanggaranpermen_m map3 on map3.id = map2.mataanggaranpermenfk and map3.div = 2
                                inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
                                left join strukrealisasi_t sr on km.id = sr.objectkegiatanfk
                                and sr.kdprofile = 30 and sr.statusenabled = true
                                and sr.status = 'Sudah Diverifikasi'
                                and extract(month from sr.tglrealisasi) in('$bulanlalu', '$bulan')
                                where km.kdprofile = 30 and km.statusenabled = true
                                and km.tahun = '$tahun'
                                and ma.kdprofile = 30 and ma.statusenabled = true
                                and map.kdprofile = 30 and map.statusenabled = true
                                and map1.kdprofile = 30 and map1.statusenabled = true
                                and map2.kdprofile = 30 and map2.statusenabled = true
                                and map3.kdprofile = 30 and map3.statusenabled = true
                                and kb.kdprofile = 30 and kb.statusenabled = true
                                $qasalproduk
                                group by map.kode, map.mataanggaranpermen, sr.totalbelanja, sr.norec, extract(month from sr.tglrealisasi)
                            ) as d 
                            group by kode, text, bulan
                ) as x
                group by text, kode, div
                
                union all
                
                select 'PENERIMAAN:' as text, 'KKKKK' kode, 6 div, 0 subtotal, 0 totalbulanlalu, 0 totalbulanini
                
                union all 
                
                select text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
                from(
                    select 'Transfer Bendahara Penerima' as text, 'LLLLL' kode, 6 div, 0 subtotal, 
                    case when extract(month from spp.tglspp) = '$bulanlalu' then sum(spp.nilaispp) else 0 end as totalbulanlalu,
                    case when extract(month from spp.tglspp) = '$bulan' then sum(spp.nilaispp) else 0 end as totalbulanini
                        from spp_t spp
                                inner join asalproduk_m ap on ap.id = spp.objectasalprodukfk
                    where spp.kdprofile = 30 and spp.statusenabled = true
                                and ap.kdprofile = 30 and ap.statusenabled = true
                    and extract(month from spp.tglspp) in('$bulanlalu', '$bulan')
                                $qasalproduk
                    group by extract(month from spp.tglspp)
                
                    union all
                
                    select 'Transfer Bendahara Penerima' as text, 'LLLLL' kode, 6 div, 0 subtotal, 
                    case when extract(month from bku.tglbku) = '$bulanlalu' then sum(spm.nilaispm) else 0 end as totalbulanlalu,
                    case when extract(month from bku.tglbku) = '$bulan' then sum(spm.nilaispm) else 0 end as totalbulanini
                        from spm_t spm
                                inner join asalproduk_m ap on ap.id = spm.objectasalprodukfk
                                inner join bukukasumum_t bku on bku.norec = spm.objectbkufk
                    where spm.kdprofile = 30 and spm.statusenabled = true
                                and bku.kdprofile = 30 and bku.statusenabled = true
                    and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                                $qasalproduk
                    group by extract(month from bku.tglbku)
                ) as x
                group by text, kode, div, subtotal
                
                union all
                
                select text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
                from(
                    select 'Jasa Giro' as text, 'MMMMM' kode, 7 div, 0 subtotal, 
                    case when extract(month from bku.tglbku) = '$bulanlalu' then sum(jg.jumlahpemasukan) else 0 end as totalbulanlalu,
                    case when extract(month from bku.tglbku) = '$bulan' then sum(jg.jumlahpemasukan) else 0 end as totalbulanini
                        from jasagiro_t jg
                                inner join bukukasumum_t bku on bku.norec = jg.objectbkufk
                    where jg.kdprofile = 30 and jg.statusenabled = true
                    and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                                and bku.kdprofile = 30 and bku.statusenabled = true
                    group by jg.uraianjasagiro, jg.nojasagiro, extract(month from bku.tglbku)
                ) as x
                group by text, kode, div, subtotal
        
                        union all
        
                        select text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
                        from(
                            select 'STS' as text, 'MMMMM' kode, 18 div, 0 subtotal, 
                            case when extract(month from bku.tglbku) = '$bulanlalu' then sum(sts.nilaists::float8) else 0 end as totalbulanlalu,
                            case when extract(month from bku.tglbku) = '$bulan' then sum(sts.nilaists::float8) else 0 end as totalbulanini
                                from stskeuangan_t sts
                            inner join asalproduk_m ap on ap.id = sts.objectsumberdanafk
                            inner join bukukasumum_t bku on bku.norec = sts.objectbkufk
                            where sts.kdprofile = 30 and sts.statusenabled = true
                            and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                            and bku.kdprofile = 30 and bku.statusenabled = true
                            $qasalproduk
                            group by sts.uraiansts, extract(month from bku.tglbku)
                        ) as x
                        group by text, kode, div, subtotal
                
                union all
                
                select text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
                from(
                    select 'Potongan Pajak' as text, 'OOOOO' kode, 8 div, 0 subtotal, 
                    case when extract(month from bku.tglbku) = '$bulanlalu' then sum(pp.ppn+pp.pph) else 0 end as totalbulanlalu,
                    case when extract(month from bku.tglbku) = '$bulan' then sum(pp.ppn+pp.pph) else 0 end as totalbulanini
                        from penyetoranpajak_t pp
                                inner join bukukasumum_t bku on bku.norec = pp.objectbkufk
                    where pp.kdprofile = 30 and pp.statusenabled = true
                    and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                                and bku.kdprofile = 30 and bku.statusenabled = true
                    group by pp.uraianpajak, extract(month from bku.tglbku)
                ) as x
                group by text, kode, div, subtotal
                
                union all
                
                select text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
                from(
                    select 'PPN' as text, 'OOOOO' kode, 9 div, 0 subtotal, 
                    case when extract(month from bku.tglbku) = '$bulanlalu' then sum(pp.ppn) else 0 end as totalbulanlalu,
                    case when extract(month from bku.tglbku) = '$bulan' then sum(pp.ppn) else 0 end as totalbulanini
                        from penyetoranpajak_t pp
                                inner join bukukasumum_t bku on bku.norec = pp.objectbkufk
                    where pp.kdprofile = 30 and pp.statusenabled = true
                    and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                                and bku.kdprofile = 30 and bku.statusenabled = true
                    group by extract(month from bku.tglbku)
                ) as x
                group by text, kode, div, subtotal
                
                union all
                
                select jp.jenispajak as text, 'OOOOO' kode, 9 div, 0 subtotal, 
                case when extract(month from bku.tglbku) = '$bulanlalu' then sum(pmp.pph) else 0 end as totalbulanlalu,
                case when extract(month from bku.tglbku) = '$bulan' then sum(pmp.pph) else 0 end as totalbulanini
                    from pemungutanpajak_t pmp
                inner join jenispajak_m jp on jp.id = pmp.objectjenispphfk
                        inner join bukukasumum_t bku on bku.norec = pmp.objectbkufk
                where pmp.kdprofile = 30 and pmp.statusenabled = true
                and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                        and bku.kdprofile = 30 and bku.statusenabled = true
                group by jp.jenispajak, extract(month from bku.tglbku)
                
                union all
                
                select 'JUMLAH PENERIMAAN:' as text, 'PPPPP' kode, 9 div, 0 subtotal,
                sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
                from(
                    select text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
                                from(
                                        select 'Transfer Bendahara Penerima' as text, 'LLLLL' kode, 6 div, 0 subtotal, 
                                        case when extract(month from spp.tglspp) = '$bulanlalu' then sum(spp.nilaispp) else 0 end as totalbulanlalu,
                                        case when extract(month from spp.tglspp) = '$bulan' then sum(spp.nilaispp) else 0 end as totalbulanini
                                                from spp_t spp
                                        inner join asalproduk_m ap on ap.id = spp.objectasalprodukfk
                                        where spp.kdprofile = 30 and spp.statusenabled = true
                                        and ap.kdprofile = 30 and ap.statusenabled = true
                                        and extract(month from spp.tglspp) in('$bulanlalu', '$bulan')
                                        $qasalproduk
                                        group by extract(month from spp.tglspp)
                                
                                        union all
                                
                                        select 'Transfer Bendahara Penerima' as text, 'LLLLL' kode, 6 div, 0 subtotal, 
                                        case when extract(month from bku.tglbku) = '$bulanlalu' then sum(spm.nilaispm) else 0 end as totalbulanlalu,
                                        case when extract(month from bku.tglbku) = '$bulan' then sum(spm.nilaispm) else 0 end as totalbulanini
                                                from spm_t spm
                                        inner join asalproduk_m ap on ap.id = spm.objectasalprodukfk
                                        inner join bukukasumum_t bku on bku.norec = spm.objectbkufk
                                        where spm.kdprofile = 30 and spm.statusenabled = true
                                        and bku.kdprofile = 30 and bku.statusenabled = true
                                        and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                                        $qasalproduk
                                        group by extract(month from bku.tglbku)
                                ) as x
                                group by text, kode, div, subtotal
                                
                                union all
                                
                                select text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
                                from(
                                        select 'Jasa Giro' as text, 'MMMMM' kode, 7 div, 0 subtotal, 
                                        case when extract(month from bku.tglbku) = '$bulanlalu' then sum(jg.jumlahpemasukan) else 0 end as totalbulanlalu,
                                        case when extract(month from bku.tglbku) = '$bulan' then sum(jg.jumlahpemasukan) else 0 end as totalbulanini
                                                from jasagiro_t jg
                                        inner join bukukasumum_t bku on bku.norec = jg.objectbkufk
                                        where jg.kdprofile = 30 and jg.statusenabled = true
                                        and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                                        and bku.kdprofile = 30 and bku.statusenabled = true
                                        group by jg.uraianjasagiro, jg.nojasagiro, extract(month from bku.tglbku)
                                ) as x
                                group by text, kode, div, subtotal
        
                                union all
        
                                select text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
                                from(
                                    select 'STS' as text, 'MMMMM' kode, 18 div, 0 subtotal, 
                                    case when extract(month from bku.tglbku) = '$bulanlalu' then sum(sts.nilaists::float8) else 0 end as totalbulanlalu,
                                    case when extract(month from bku.tglbku) = '$bulan' then sum(sts.nilaists::float8) else 0 end as totalbulanini
                                        from stskeuangan_t sts
                                    inner join asalproduk_m ap on ap.id = sts.objectsumberdanafk
                                    inner join bukukasumum_t bku on bku.norec = sts.objectbkufk
                                    where sts.kdprofile = 30 and sts.statusenabled = true
                                    and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                                    and bku.kdprofile = 30 and bku.statusenabled = true
                                    $qasalproduk
                                    group by sts.uraiansts, extract(month from bku.tglbku)
                                ) as x
                                group by text, kode, div, subtotal
                                
                                union all
                                
                                select text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
                                from(
                                        select 'Potongan Pajak' as text, 'OOOOO' kode, 8 div, 0 subtotal, 
                                        case when extract(month from bku.tglbku) = '$bulanlalu' then sum(pp.ppn+pp.pph) else 0 end as totalbulanlalu,
                                        case when extract(month from bku.tglbku) = '$bulan' then sum(pp.ppn+pp.pph) else 0 end as totalbulanini
                                                from penyetoranpajak_t pp
                                        inner join bukukasumum_t bku on bku.norec = pp.objectbkufk
                                        where pp.kdprofile = 30 and pp.statusenabled = true
                                        and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                                        and bku.kdprofile = 30 and bku.statusenabled = true
                                        group by pp.uraianpajak, extract(month from bku.tglbku)
                                ) as x
                                group by text, kode, div, subtotal
                                
                                union all
                                
                                select text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
                                from(
                                        select 'PPN' as text, 'OOOOO' kode, 9 div, 0 subtotal, 
                                        case when extract(month from bku.tglbku) = '$bulanlalu' then sum(pp.ppn) else 0 end as totalbulanlalu,
                                        case when extract(month from bku.tglbku) = '$bulan' then sum(pp.ppn) else 0 end as totalbulanini
                                                from penyetoranpajak_t pp
                                        inner join bukukasumum_t bku on bku.norec = pp.objectbkufk
                                        where pp.kdprofile = 30 and pp.statusenabled = true
                                        and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                                        and bku.kdprofile = 30 and bku.statusenabled = true
                                        group by extract(month from bku.tglbku)
                                ) as x
                                group by text, kode, div, subtotal
                                
                                union all
                                
                                select jp.jenispajak as text, 'OOOOO' kode, 9 div, 0 subtotal, 
                                case when extract(month from bku.tglbku) = '$bulanlalu' then sum(pmp.pph) else 0 end as totalbulanlalu,
                                case when extract(month from bku.tglbku) = '$bulan' then sum(pmp.pph) else 0 end as totalbulanini
                                        from pemungutanpajak_t pmp
                                inner join jenispajak_m jp on jp.id = pmp.objectjenispphfk
                                inner join bukukasumum_t bku on bku.norec = pmp.objectbkufk
                                where pmp.kdprofile = 30 and pmp.statusenabled = true
                                and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                                and bku.kdprofile = 30 and bku.statusenabled = true
                                group by jp.jenispajak, extract(month from bku.tglbku)
                ) as y
                
                union all 
                
                select 'PENGELUARAN:' as text, 'QQQQQ' kode, 9 div, 0 subtotal, 0 totalbulanlalu, 0 totalbulanini
                
                union all 
                        
                        select text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
                from(
                            select text, kode, div, subtotal,
                            case when tglrealisasi = '$bulanlalu' then sum(totalbelanja) else 0 end as totalbulanlalu,
                            case when tglrealisasi = '$bulan' then sum(totalbelanja) else 0 end as totalbulanini
                            from(
                                    select 'SPJ' as text, 'RRRRR' kode, 10 div, 0 subtotal, extract(month from bku.tglbku) tglrealisasi, sr.totalbelanja, sr.norec
                                            from kegiatananggaran_m km
                                    inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
                                    inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
                                    inner join strukrealisasi_t sr on km.id = sr.objectkegiatanfk
                                    inner join bukukasumum_t bku on bku.norec = sr.objectbkufk
                                    where sr.kdprofile = 30 and sr.statusenabled = true
                                    and km.kdprofile = 30 and km.statusenabled = true
                                    and kb.kdprofile = 30 and kb.statusenabled = true
                                    and bku.kdprofile = 30 and bku.statusenabled = true
                                    and sr.status = 'Sudah Diverifikasi'
                                    and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                                    $qasalproduk
                                    group by extract(month from bku.tglbku), sr.totalbelanja, sr.norec
                            ) as x
                            group by tglrealisasi, text, kode, div, subtotal
                        ) as x
                group by text, kode, div, subtotal
                
                union all
                
                select text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
                from(
                    select 'Jasa Giro' as text, 'SSSSS' kode, 11 div, 0 subtotal, 
                    case when extract(month from bku.tglbku) = '$bulanlalu' then sum(jg.jumlahpemasukan) else 0 end as totalbulanlalu,
                    case when extract(month from bku.tglbku) = '$bulan' then sum(jg.jumlahpemasukan) else 0 end as totalbulanini
                        from jasagiro_t jg
                                inner join bukukasumum_t bku on bku.norec = jg.objectbkufk
                    where jg.kdprofile = 30 and jg.statusenabled = true
                    and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                                and bku.kdprofile = 30 and bku.statusenabled = true
                    group by jg.uraianjasagiro, jg.nojasagiro, extract(month from bku.tglbku)
                ) as x
                group by text, kode, div, subtotal
        
                        union all
        
                        select text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
                        from(
                            select 'STS' as text, 'TTTTT' kode, 12 div, 0 subtotal, 
                            case when extract(month from bku.tglbku) = '$bulanlalu' then sum(sts.nilaists::float8) else 0 end as totalbulanlalu,
                            case when extract(month from bku.tglbku) = '$bulan' then sum(sts.nilaists::float8) else 0 end as totalbulanini
                                from stskeuangan_t sts
                            inner join asalproduk_m ap on ap.id = sts.objectsumberdanafk
                            inner join bukukasumum_t bku on bku.norec = sts.objectbkufk
                            where sts.kdprofile = 30 and sts.statusenabled = true
                            and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                            and bku.kdprofile = 30 and bku.statusenabled = true
                            $qasalproduk
                            group by sts.uraiansts, extract(month from bku.tglbku)
                        ) as x
                        group by text, kode, div, subtotal
                
                union all
                
                select text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
                from(
                    select 'Penyetoran Pajak' as text, 'UUUUU' kode, 13 div, 0 subtotal, 
                    case when extract(month from bku.tglbku) = '$bulanlalu' then sum(pp.ppn+pp.pph) else 0 end as totalbulanlalu,
                    case when extract(month from bku.tglbku) = '$bulan' then sum(pp.ppn+pp.pph) else 0 end as totalbulanini
                        from penyetoranpajak_t pp
                                inner join bukukasumum_t bku on bku.norec = pp.objectbkufk
                    where pp.kdprofile = 30 and pp.statusenabled = true
                    and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                                and bku.kdprofile = 30 and bku.statusenabled = true
                    group by pp.uraianpajak, extract(month from bku.tglbku)
                ) as x
                group by text, kode, div, subtotal
                
                union all
                
                select text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
                from(
                    select 'PPN' as text, 'VVVVV' kode, 14 div, 0 subtotal, 
                    case when extract(month from bku.tglbku) = '$bulanlalu' then sum(pp.ppn) else 0 end as totalbulanlalu,
                    case when extract(month from bku.tglbku) = '$bulan' then sum(pp.ppn) else 0 end as totalbulanini
                        from penyetoranpajak_t pp
                                inner join bukukasumum_t bku on bku.norec = pp.objectbkufk
                    where pp.kdprofile = 30 and pp.statusenabled = true
                    and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                                and bku.kdprofile = 30 and bku.statusenabled = true
                    group by extract(month from bku.tglbku)
                ) as x
                group by text, kode, div, subtotal
                
                union all
                
                select jp.jenispajak as text, 'WWWWW' kode, 15 div, 0 subtotal, 
                case when extract(month from bku.tglbku) = '$bulanlalu' then sum(pmp.pph) else 0 end as totalbulanlalu,
                case when extract(month from bku.tglbku) = '$bulan' then sum(pmp.pph) else 0 end as totalbulanini
                    from pemungutanpajak_t pmp
                inner join jenispajak_m jp on jp.id = pmp.objectjenispphfk
                        inner join bukukasumum_t bku on bku.norec = pmp.objectbkufk
                where pmp.kdprofile = 30 and pmp.statusenabled = true
                and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                        and bku.kdprofile = 30 and bku.statusenabled = true
                group by jp.jenispajak, extract(month from bku.tglbku)
                
                union all
                
                select 'JUMLAH PENGELUARAN:' as text, 'XXXXX' kode, 16 div, 0 subtotal,
                sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
                from(
                    select text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
                                from(
                                    select text, kode, div, subtotal,
                                    case when tglrealisasi = '$bulanlalu' then sum(totalbelanja) else 0 end as totalbulanlalu,
                                    case when tglrealisasi = '$bulan' then sum(totalbelanja) else 0 end as totalbulanini
                                    from(
                                            select 'SPJ' as text, 'RRRRR' kode, 10 div, 0 subtotal, extract(month from bku.tglbku) tglrealisasi, sr.totalbelanja, sr.norec
                                                    from kegiatananggaran_m km
                                            inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
                                            inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
                                            inner join strukrealisasi_t sr on km.id = sr.objectkegiatanfk
                                            inner join bukukasumum_t bku on bku.norec = sr.objectbkufk
                                            where sr.kdprofile = 30 and sr.statusenabled = true
                                            and km.kdprofile = 30 and km.statusenabled = true
                                            and kb.kdprofile = 30 and kb.statusenabled = true
                                            and bku.kdprofile = 30 and bku.statusenabled = true
                                            and sr.status = 'Sudah Diverifikasi'
                                            and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                                            $qasalproduk
                                            group by extract(month from bku.tglbku), sr.totalbelanja, sr.norec
                                    ) as x
                                    group by tglrealisasi, text, kode, div, subtotal
                                ) as x
                                group by text, kode, div, subtotal
                                
                                union all
                                
                                select text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
                                from(
                                        select 'Jasa Giro' as text, 'SSSSS' kode, 11 div, 0 subtotal, 
                                        case when extract(month from bku.tglbku) = '$bulanlalu' then sum(jg.jumlahpemasukan) else 0 end as totalbulanlalu,
                                        case when extract(month from bku.tglbku) = '$bulan' then sum(jg.jumlahpemasukan) else 0 end as totalbulanini
                                                from jasagiro_t jg
                                        inner join bukukasumum_t bku on bku.norec = jg.objectbkufk
                                        where jg.kdprofile = 30 and jg.statusenabled = true
                                        and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                                        and bku.kdprofile = 30 and bku.statusenabled = true
                                        group by jg.uraianjasagiro, jg.nojasagiro, extract(month from bku.tglbku)
                                ) as x
                                group by text, kode, div, subtotal
        
                                union all
        
                                select text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
                                from(
                                    select 'STS' as text, 'TTTTT' kode, 12 div, 0 subtotal, 
                                    case when extract(month from bku.tglbku) = '$bulanlalu' then sum(sts.nilaists::float8) else 0 end as totalbulanlalu,
                                    case when extract(month from bku.tglbku) = '$bulan' then sum(sts.nilaists::float8) else 0 end as totalbulanini
                                        from stskeuangan_t sts
                                    inner join asalproduk_m ap on ap.id = sts.objectsumberdanafk
                                    inner join bukukasumum_t bku on bku.norec = sts.objectbkufk
                                    where sts.kdprofile = 30 and sts.statusenabled = true
                                    and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                                    and bku.kdprofile = 30 and bku.statusenabled = true
                                    $qasalproduk
                                    group by sts.uraiansts, extract(month from bku.tglbku)
                                ) as x
                                group by text, kode, div, subtotal
                                
                                union all
                                
                                select text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
                                from(
                                        select 'Penyetoran Pajak' as text, 'UUUUU' kode, 13 div, 0 subtotal, 
                                        case when extract(month from bku.tglbku) = '$bulanlalu' then sum(pp.ppn+pp.pph) else 0 end as totalbulanlalu,
                                        case when extract(month from bku.tglbku) = '$bulan' then sum(pp.ppn+pp.pph) else 0 end as totalbulanini
                                                from penyetoranpajak_t pp
                                        inner join bukukasumum_t bku on bku.norec = pp.objectbkufk
                                        where pp.kdprofile = 30 and pp.statusenabled = true
                                        and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                                        and bku.kdprofile = 30 and bku.statusenabled = true
                                        group by pp.uraianpajak, extract(month from bku.tglbku)
                                ) as x
                                group by text, kode, div, subtotal
                                
                                union all
                                
                                select text, kode, div, subtotal, sum(totalbulanlalu) totalbulanlalu, sum(totalbulanini) totalbulanini
                                from(
                                        select 'PPN' as text, 'VVVVV' kode, 14 div, 0 subtotal, 
                                        case when extract(month from bku.tglbku) = '$bulanlalu' then sum(pp.ppn) else 0 end as totalbulanlalu,
                                        case when extract(month from bku.tglbku) = '$bulan' then sum(pp.ppn) else 0 end as totalbulanini
                                                from penyetoranpajak_t pp
                                        inner join bukukasumum_t bku on bku.norec = pp.objectbkufk
                                        where pp.kdprofile = 30 and pp.statusenabled = true
                                        and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                                        and bku.kdprofile = 30 and bku.statusenabled = true
                                        group by extract(month from bku.tglbku)
                                ) as x
                                group by text, kode, div, subtotal
                                
                                union all
                                
                                select jp.jenispajak as text, 'WWWWW' kode, 15 div, 0 subtotal, 
                                case when extract(month from bku.tglbku) = '$bulanlalu' then sum(pmp.pph) else 0 end as totalbulanlalu,
                                case when extract(month from bku.tglbku) = '$bulan' then sum(pmp.pph) else 0 end as totalbulanini
                                        from pemungutanpajak_t pmp
                                inner join jenispajak_m jp on jp.id = pmp.objectjenispphfk
                                inner join bukukasumum_t bku on bku.norec = pmp.objectbkufk
                                where pmp.kdprofile = 30 and pmp.statusenabled = true
                                and bku.tglbku::date between '$tahun-$bulanlalu-01' and '$tglbku'
                                and bku.kdprofile = 30 and bku.statusenabled = true
                                group by jp.jenispajak, extract(month from bku.tglbku)
                ) as y
                
                order by kode, div"));
        }
        

        //var_dump($data);

        $pageWidth = 950;
        
        return view('report.keuangan.cetakfungsional',compact('data', 'pageWidth', 'tanggalcetak', 'tahun', 'tanggaljudul'));
    }

    public function CetakPerJenisAnggaranSebelumSesudah(Request $request){
        $tahun = $request['tahun'];
        $tanggalcetak = $this->tanggal_indonesia(date('Y-m-d',strtotime($request['tglcetak'])));

        $qtahap  = '';
        if (isset($request['tahap']) && $request['tahap'] != "" && $request['tahap'] != "undefined") {
            $qtahap =  ' and kb.objecttahapfk =  ' . $request['tahap'];
        }

        $qterhadap  = '';
        if (isset($request['terhadap']) && $request['terhadap'] != "" && $request['terhadap'] != "undefined") {
            $qterhadap =  ' and kb.objecttahapfk =  ' . $request['terhadap'];
        }

        $tahap = DB::select(DB::raw("select id, tahap from tahapanggaran_m where id = ".$request['tahap']));

        $sebelum = DB::select(DB::raw("select j.*, k.jumlahbarangjasa kjumlahbarangjasa, k.jumlahpegawai kjumlahpegawai, k.jumlahmodal kjumlahmodal, k.total ktotal, k.tahap tahapsesudah  from(
        select * from(
            select kegiatan, tahap, kode, div, sum(jumlahbarangjasa) jumlahbarangjasa, sum(jumlahmodal) jumlahmodal, sum(jumlahpegawai) jumlahpegawai,
            sum(jumlahbarangjasa) + sum(jumlahmodal) + sum(jumlahpegawai) as total
            from(
                select kegiatan, subkegiatan, tahap, kode, div,
                case when jenisanggaran = 'Belanja Barang dan Jasa' then subtotal else 0 end as jumlahbarangjasa,
                case when jenisanggaran = 'Belanja Modal' then subtotal else 0 end as jumlahmodal, 
                case when jenisanggaran = 'Belanja Pegawai' then subtotal else 0 end as jumlahpegawai
                from( 
                    select kmss.keterangan kegiatan, kms.keterangan subkegiatan, kmss.kode, kmss.div, km.keterangan subsubkegiatan, ta.tahap, ta.id, ja.jenisanggaran, sum(kb.subtotal) subtotal
                    from kegiatananggaran_m km
                    inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
                    left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
                    inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
                    inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
                    inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%' and mat.objectjenisanggaranfk is not null
                    inner join jenisanggaran_m ja on ja.id = mat.objectjenisanggaranfk
                    left join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
                    where km.kdprofile = 30 and km.statusenabled = true
                    $qterhadap
                    and km.tahun = '$request[tahun]'
                    and kb.kdprofile = 30 and kb.statusenabled = true
                    and km.keterangan in(
                        select km.keterangan
                        from kegiatananggaran_m km
                        inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
                        left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
                        inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
                        inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
                        inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%' and mat.objectjenisanggaranfk is not null
                        inner join jenisanggaran_m ja on ja.id = mat.objectjenisanggaranfk
                        left join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
                        where km.kdprofile = 30 and km.statusenabled = true
                        $qtahap
                        and km.tahun = '$request[tahun]'
                        and kb.kdprofile = 30 and kb.statusenabled = true
                        group by kms.keterangan, kmss.keterangan, kmss.kode, ja.jenisanggaran, kmss.div, km.keterangan, ta.tahap, ta.id
                    )
                    group by kms.keterangan, kmss.keterangan, kmss.kode, ja.jenisanggaran, kmss.div, km.keterangan, ta.tahap, ta.id
                ) as x group by kegiatan, subkegiatan,  tahap, jenisanggaran, subtotal, kode, div
            ) as y group by kegiatan, tahap, kode, div
        
            union all
        
            select subkegiatan kegiatan, tahap, kode, div, sum(jumlahbarangjasa) jumlahbarangjasa, sum(jumlahmodal) jumlahmodal, sum(jumlahpegawai) jumlahpegawai,
            sum(jumlahbarangjasa) + sum(jumlahmodal) + sum(jumlahpegawai) as total
            from(
                select kegiatan, subkegiatan, tahap, kode, div,
                case when jenisanggaran = 'Belanja Barang dan Jasa' then subtotal else 0 end as jumlahbarangjasa,
                case when jenisanggaran = 'Belanja Modal' then subtotal else 0 end as jumlahmodal, 
                case when jenisanggaran = 'Belanja Pegawai' then subtotal else 0 end as jumlahpegawai
                from( 
                    select kmss.keterangan kegiatan, kms.keterangan subkegiatan, kms.kode, kms.div, km.keterangan subsubkegiatan, ta.tahap, ta.id, ja.jenisanggaran, sum(kb.subtotal) subtotal
                    from kegiatananggaran_m km
                    inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
                    left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
                    inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
                    inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
                    inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%' and mat.objectjenisanggaranfk is not null
                    inner join jenisanggaran_m ja on ja.id = mat.objectjenisanggaranfk
                    left join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
                    where km.kdprofile = 30 and km.statusenabled = true
                    $qterhadap
                    and km.tahun = '$request[tahun]'
                    and kb.kdprofile = 30 and kb.statusenabled = true
                    and km.keterangan in(
                        select km.keterangan
                        from kegiatananggaran_m km
                        inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
                        left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
                        inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
                        inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
                        inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%' and mat.objectjenisanggaranfk is not null
                        inner join jenisanggaran_m ja on ja.id = mat.objectjenisanggaranfk
                        left join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
                        where km.kdprofile = 30 and km.statusenabled = true
                        $qtahap
                        and km.tahun = '$request[tahun]'
                        and kb.kdprofile = 30 and kb.statusenabled = true
                        group by kms.keterangan, kmss.keterangan, kms.kode, ja.jenisanggaran, kms.div, km.keterangan, ta.tahap, ta.id
                    )
                    group by kms.keterangan, kmss.keterangan, kms.kode, ja.jenisanggaran, kms.div, km.keterangan, ta.tahap, ta.id
                ) as x group by kegiatan, subkegiatan, tahap, jenisanggaran, subtotal, kode, div
            ) as y group by subkegiatan, tahap, kode, div
        ) as a order by kode) as j
        inner join(select * from(
            select kegiatan, tahap, kode, div, sum(jumlahbarangjasa) jumlahbarangjasa, sum(jumlahmodal) jumlahmodal, sum(jumlahpegawai) jumlahpegawai,
            sum(jumlahbarangjasa) + sum(jumlahmodal) + sum(jumlahpegawai) as total
            from(
                select kegiatan, subkegiatan, tahap, kode, div,
                case when jenisanggaran = 'Belanja Barang dan Jasa' then subtotal else 0 end as jumlahbarangjasa,
                case when jenisanggaran = 'Belanja Modal' then subtotal else 0 end as jumlahmodal, 
                case when jenisanggaran = 'Belanja Pegawai' then subtotal else 0 end as jumlahpegawai
                from( 
                    select kmss.keterangan kegiatan, kms.keterangan subkegiatan, kmss.kode, kmss.div, km.keterangan subsubkegiatan, ta.tahap, ta.id, ja.jenisanggaran, sum(kb.subtotal) subtotal
                    from kegiatananggaran_m km
                    inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
                    left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
                    inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
                    inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
                    inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%' and mat.objectjenisanggaranfk is not null
                    inner join jenisanggaran_m ja on ja.id = mat.objectjenisanggaranfk
                    left join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
                    where km.kdprofile = 30 and km.statusenabled = true
                    $qtahap
                    and km.tahun = '$request[tahun]'
                    and kb.kdprofile = 30 and kb.statusenabled = true
                    and km.keterangan in(
                        select km.keterangan
                        from kegiatananggaran_m km
                        inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
                        left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
                        inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
                        inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
                        inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%' and mat.objectjenisanggaranfk is not null
                        inner join jenisanggaran_m ja on ja.id = mat.objectjenisanggaranfk
                        left join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
                        where km.kdprofile = 30 and km.statusenabled = true
                        $qterhadap
                        and km.tahun = '$request[tahun]'
                        and kb.kdprofile = 30 and kb.statusenabled = true
                        group by kms.keterangan, kmss.keterangan, kmss.kode, ja.jenisanggaran, kmss.div, km.keterangan, ta.tahap, ta.id
                    )
                    group by kms.keterangan, kmss.keterangan, kmss.kode, ja.jenisanggaran, kmss.div, km.keterangan, ta.tahap, ta.id
                ) as x group by kegiatan, subkegiatan, tahap, jenisanggaran, subtotal, kode, div
            ) as y group by kegiatan, tahap, kode, div
        
            union all
        
            select subkegiatan kegiatan, tahap, kode, div, sum(jumlahbarangjasa) jumlahbarangjasa, sum(jumlahmodal) jumlahmodal, sum(jumlahpegawai) jumlahpegawai,
            sum(jumlahbarangjasa) + sum(jumlahmodal) + sum(jumlahpegawai) as total
            from(
                select kegiatan, subkegiatan, tahap, kode, div,
                case when jenisanggaran = 'Belanja Barang dan Jasa' then subtotal else 0 end as jumlahbarangjasa,
                case when jenisanggaran = 'Belanja Modal' then subtotal else 0 end as jumlahmodal, 
                case when jenisanggaran = 'Belanja Pegawai' then subtotal else 0 end as jumlahpegawai
                from(
                    select kmss.keterangan kegiatan, kms.keterangan subkegiatan, kms.kode, kms.div, km.keterangan subsubkegiatan, ta.tahap, ta.id, ja.jenisanggaran, sum(kb.subtotal) subtotal
                    from kegiatananggaran_m km
                    inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
                    left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
                    inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
                    inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
                    inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%' and mat.objectjenisanggaranfk is not null
                    inner join jenisanggaran_m ja on ja.id = mat.objectjenisanggaranfk
                    left join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
                    where km.kdprofile = 30 and km.statusenabled = true
                    $qtahap
                    and km.tahun = '$request[tahun]'
                    and kb.kdprofile = 30 and kb.statusenabled = true
                    and km.keterangan in(
                        select km.keterangan
                        from kegiatananggaran_m km
                        inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
                        left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
                        inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
                        inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
                        inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%' and mat.objectjenisanggaranfk is not null
                        inner join jenisanggaran_m ja on ja.id = mat.objectjenisanggaranfk
                        left join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
                        where km.kdprofile = 30 and km.statusenabled = true
                        $qterhadap
                        and km.tahun = '$request[tahun]'
                        and kb.kdprofile = 30 and kb.statusenabled = true
                        group by kms.keterangan, kmss.keterangan, kms.kode, ja.jenisanggaran, kms.div, km.keterangan, ta.tahap, ta.id
                    )
                    group by kms.keterangan, kmss.keterangan, kms.kode, ja.jenisanggaran, kms.div, km.keterangan, ta.tahap, ta.id
                ) as x group by kegiatan, subkegiatan, tahap, jenisanggaran, subtotal, kode, div
            ) as y group by subkegiatan, tahap, kode, div
        ) as a order by kode) as k on j.kegiatan = k.kegiatan"));
        

        $pageWidth = 1300;
        //return $this->respond($result);
        return view('report.spj.cetakjenisanggaransebelumsesudah',compact('sebelum', 'pageWidth', 'tahap', 'tanggalcetak'));
    }

    

    public function CetakRekapMataAnggaran(Request $request){
        $tahun = $request['tahun'];
        $tahap = $request['tahap'];

        $itahap = DB::select(DB::raw("select id, tahap from tahapanggaran_m where id = $tahap"));
        $tanggalcetak = $this->tanggal_indonesia(date('Y-m-d',strtotime($request['tglcetak'])));

        $qtahap  = '';
        if (isset($request['tahap']) && $request['tahap'] != "" && $request['tahap'] != "undefined") {
            $qtahap =  ' and kb.objecttahapfk =  ' . $request['tahap'];
        }

        $qterhadap  = '';
        if (isset($request['terhadap']) && $request['terhadap'] != "" && $request['terhadap'] != "undefined") {
            $qterhadap =  ' and kb.objecttahapfk =  ' . $request['terhadap'];
        }

//         $datassssssss = DB::select(DB::raw("
//         SELECT o.*, p.subtotaljasalayanansetelah, p.tahapsetelah, p.subtotalsebelum
//         from
//         (
// 	select kodemataanggaran, namamataanggaran from mataanggaran_m WHERE
// 	case 
//     when kodemataanggaran ilike 'I%' then (char_length(kodemataanggaran) = 5 or char_length(kodemataanggaran) = 3)
//     when kodemataanggaran ilike 'II%' then (char_length(kodemataanggaran) = 4 or char_length(kodemataanggaran) = 2)
//     when kodemataanggaran ilike 'III%' then (char_length(kodemataanggaran) = 5 or char_length(kodemataanggaran) = 3)
// 	end
// ) as o
// left join
// (
// select j.kodemataanggaran, j.subtotal as subtotalsetelah, k.tahap tahapsetelah
// , k.subtotal subtotalsebelum from
// (
// 			select id, tahap,
// 			case 
// 				when kodemataanggaran = 'A' then 'I.A'
// 				when kodemataanggaran = 'B' then 'I.B'
// 				when kodemataanggaran = 'II' then 'II'
// 				when kodemataanggaran = 'III' then 'III'
// 			end as kodemataanggaran,
// 			case 
// 				when kodemataanggaran = 'A' then 'BIAYA PELAYANAN '
// 				when kodemataanggaran = 'B' then 'BIAYA UMUM DAN ADMINISTRASI'
// 				when kodemataanggaran = 'II' then 'BIAYA NON OPERASIONAL'
// 				when kodemataanggaran = 'III' then 'BIAYA PENGELUARAN INVESTASI'
// 			end as keterangan,
// 			case 
// 				when kodemataanggaran = 'A' then sum(subtotal)
// 				when kodemataanggaran = 'B' then sum(subtotal)
// 				when kodemataanggaran = 'II' then sum(subtotal)
// 				when kodemataanggaran = 'III' then sum(subtotal)
// 			end as subtotal
// 			from(
// 				select id, tahap,
// 				case 
// 					when kodemataanggaran ilike 'I.A.%' then 'A'
// 					when kodemataanggaran ilike 'I.B.%' then 'B'
// 					when kodemataanggaran ilike 'II.%' then 'II'
// 					when kodemataanggaran ilike 'III.%' then 'III'
// 				end as kodemataanggaran,
// 				case 
// 					when kodemataanggaran ilike 'I.A.%' then sum(subtotal)
// 					when kodemataanggaran ilike 'I.B.%' then sum(subtotal)
// 					when kodemataanggaran ilike 'II.%' then sum(subtotal)
// 					when kodemataanggaran ilike 'III.%' then sum(subtotal)
// 				end as subtotal
// 				from(
// 							select ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran, kb.keteranganbelanja, sum(kb.subtotal) subtotal
// 							from kegiatananggaran_m km
// 							inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
// 							left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
// 							inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
// 							inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
// 							inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
// 							and 
// 							case 
// 								when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) = 5
// 								when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) = 4
// 								when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) = 5
// 							end
// 							inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
// 							where km.kdprofile = 30 and km.statusenabled = true
// 							$qterhadap
// 							and km.tahun = '$tahun'
// 							group by ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran, kb.keteranganbelanja
// 				) as x group by id, tahap, kodemataanggaran
// 			) as y group by id, tahap, kodemataanggaran

// 			union all

// 			select ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran keterangan, sum(kb.subtotal) subtotal
// 			from kegiatananggaran_m km
// 			inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
// 			left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
// 			inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
// 			inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
// 			inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
// 			and 
// 			case 
// 				when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) = 5
// 				when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) = 4
// 				when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) = 5
// 			end
// 			inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
// 			where km.kdprofile = 30 and km.statusenabled = true
// 			$qterhadap
// 			and km.tahun = '$tahun'
// 			group by ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran
			
// ) as j 
// inner join(
// 			select id, tahap,
// 			case 
// 				when kodemataanggaran = 'A' then 'I.A'
// 				when kodemataanggaran = 'B' then 'I.B'
// 				when kodemataanggaran = 'II' then 'II'
// 				when kodemataanggaran = 'III' then 'III'
// 			end as kodemataanggaran,
// 			case 
// 				when kodemataanggaran = 'A' then 'BIAYA PELAYANAN '
// 				when kodemataanggaran = 'B' then 'BIAYA UMUM DAN ADMINISTRASI'
// 				when kodemataanggaran = 'II' then 'BIAYA NON OPERASIONAL'
// 				when kodemataanggaran = 'III' then 'BIAYA PENGELUARAN INVESTASI'
// 			end as keterangan,
// 			case 
// 				when kodemataanggaran = 'A' then sum(subtotal)
// 				when kodemataanggaran = 'B' then sum(subtotal)
// 				when kodemataanggaran = 'II' then sum(subtotal)
// 				when kodemataanggaran = 'III' then sum(subtotal)
// 			end as subtotal
// 			from(
// 				select id, tahap,
// 				case 
// 					when kodemataanggaran ilike 'I.A.%' then 'A'
// 					when kodemataanggaran ilike 'I.B.%' then 'B'
// 					when kodemataanggaran ilike 'II.%' then 'II'
// 					when kodemataanggaran ilike 'III.%' then 'III'
// 				end as kodemataanggaran,
// 				case 
// 					when kodemataanggaran ilike 'I.A.%' then sum(subtotal)
// 					when kodemataanggaran ilike 'I.B.%' then sum(subtotal)
// 					when kodemataanggaran ilike 'II.%' then sum(subtotal)
// 					when kodemataanggaran ilike 'III.%' then sum(subtotal)
// 				end as subtotal
// 				from(
// 							select ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran, kb.keteranganbelanja, sum(kb.subtotal) subtotal
// 							from kegiatananggaran_m km
// 							inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
// 							left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
// 							inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
// 							inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
// 							inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
// 							and 
// 							case 
// 								when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) = 5
// 								when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) = 4
// 								when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) = 5
// 							end
// 							inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
// 							where km.kdprofile = 30 and km.statusenabled = true
// 							$qtahap
// 							and km.tahun = '$tahun'
// 							group by ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran, kb.keteranganbelanja
// 				) as x group by id, tahap, kodemataanggaran
// 			) as y group by id, tahap, kodemataanggaran

// 			union ALL

// 			select ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran keterangan, sum(kb.subtotal) subtotal
// 			from kegiatananggaran_m km
// 			inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
// 			left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
// 			inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
// 			inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
// 			inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
// 			and 
// 			case 
// 				when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) = 5
// 				when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) = 4
// 				when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) = 5
// 			end
// 			inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
// 			where km.kdprofile = 30 and km.statusenabled = true
// 			$qtahap
// 			and km.tahun = '$tahun'
// 			group by ta.id, ta.tahap,  mat.kodemataanggaran, mat.namamataanggaran
// 			order by kodemataanggaran
// ) as k on j.kodemataanggaran = k.kodemataanggaran order by k.kodemataanggaran
// ) as p on o.kodemataanggaran = p.kodemataanggaran order by o.kodemataanggaran"));

        $sebelum = \DB::select(DB::raw("SELECT o.*, p.subtotaljasalayanansetelah, p.subtotalapbdsetelah, p.subtotalapbdsebelum, p.subtotaljasalayanansebelum
        from
        (
        select kodemataanggaran, namamataanggaran from mataanggaran_m WHERE
        case
        when kodemataanggaran ilike 'I%' then (char_length(kodemataanggaran) = 5 or char_length(kodemataanggaran) = 3)
        when kodemataanggaran ilike 'II%' then (char_length(kodemataanggaran) = 4 or char_length(kodemataanggaran) = 2)
        when kodemataanggaran ilike 'III%' then (char_length(kodemataanggaran) = 5 or char_length(kodemataanggaran) = 3)
        end
        ) as o
        left join
        (
        select j.kodemataanggaran, sum(j.subtotaljasalayanan) as subtotaljasalayanansetelah, sum(j.subtotalapbd )as subtotalapbdsetelah, sum(k.subtotalapbd) as subtotalapbdsebelum, sum(k.subtotaljasalayanan) as subtotaljasalayanansebelum
        from
        (
        select id, tahap,
        case
        when kodemataanggaran = 'A' then 'I.A'
        when kodemataanggaran = 'B' then 'I.B'
        when kodemataanggaran = 'II' then 'II'
        when kodemataanggaran = 'III' then 'III'
        end as kodemataanggaran,
        case
        when kodemataanggaran = 'A' then 'BIAYA PELAYANAN '
        when kodemataanggaran = 'B' then 'BIAYA UMUM DAN ADMINISTRASI'
        when kodemataanggaran = 'II' then 'BIAYA NON OPERASIONAL'
        when kodemataanggaran = 'III' then 'BIAYA PENGELUARAN INVESTASI'
        end as keterangan,

        case
        when kodemataanggaran = 'A' and y.id_asalproduk=18 then sum(subtotaljasalayanan)
        when kodemataanggaran = 'B' and y.id_asalproduk=18 then sum(subtotaljasalayanan)
        when kodemataanggaran = 'II' and y.id_asalproduk=18 then sum(subtotaljasalayanan)
        when kodemataanggaran = 'III' and y.id_asalproduk=18 then sum(subtotaljasalayanan)
        end as subtotaljasalayanan,
        case
        when kodemataanggaran = 'A' and y.id_asalproduk=15 then sum(subtotalapbd)
        when kodemataanggaran = 'B' and y.id_asalproduk=15 then sum(subtotalapbd)
        when kodemataanggaran = 'II' and y.id_asalproduk=15 then sum(subtotalapbd)
        when kodemataanggaran = 'III' and y.id_asalproduk=15 then sum(subtotalapbd)
        end as subtotalapbd
        from(
        select x.id, tahap,
        case
        when kodemataanggaran ilike 'I.A.%' then 'A'
        when kodemataanggaran ilike 'I.B.%' then 'B'
        when kodemataanggaran ilike 'II.%' then 'II'
        when kodemataanggaran ilike 'III.%' then 'III'
        end as kodemataanggaran,
        x.id_asalproduk,
        case
        when kodemataanggaran ilike 'I.A.%' and x.id_asalproduk = 15 then sum(subtotal)
        when kodemataanggaran ilike 'I.B.%' and x.id_asalproduk = 15 then sum (subtotal)
        when kodemataanggaran ilike 'II.%' and x.id_asalproduk = 15 then sum(subtotal)
        when kodemataanggaran ilike 'III.%' and x.id_asalproduk = 15 then sum(subtotal)
        end subtotalapbd,
        case
        when kodemataanggaran ilike 'I.A.%' and x.id_asalproduk = 18 then sum(subtotal)
        when kodemataanggaran ilike 'I.B.%' and x.id_asalproduk = 18 then sum (subtotal)
        when kodemataanggaran ilike 'II.%' and x.id_asalproduk = 18 then sum(subtotal)
        when kodemataanggaran ilike 'III.%' and x.id_asalproduk = 18 then sum(subtotal)
        end subtotaljasalayanan
        from(
        select DISTINCT ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran, kb.keteranganbelanja, kb.subtotal as subtotal,
            ap.id as id_asalproduk, ap.asalproduk
        from kegiatananggaran_m km
        inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
        left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
        inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
        inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
        inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
        and
        case
        when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) = 5
        when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) = 4
        when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) = 5
        end
        inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk
        inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
        where km.kdprofile = 30 and km.statusenabled = true
        and kms.kdprofile = 30 and kms.statusenabled = true
                                        and kmss.kdprofile = 30 and kmss.statusenabled = true
                                        and ma.kdprofile = 30 and ma.statusenabled = true
                                        and mat.kdprofile = 30 and mat.statusenabled = true
                                        and kb.kdprofile = 30 and kb.statusenabled = true
        $qterhadap
        and km.tahun = '$tahun'
        -- group by ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran, kb.keteranganbelanja, ap.id, ap.asalproduk, kb.subtotal
        ) as x group by x.id, x.tahap, x.kodemataanggaran, x.id_asalproduk
        ) as y group by id, tahap, kodemataanggaran, y.id_asalproduk

        union all

        select uni.id,uni.tahap, uni.kodemataanggaran, uni.keterangan, sum(uni.subtotaljasalayanan)as subtotaljasalayanan, sum(uni.subtotalapbd )as subtotalapbd from (
        select distinct ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran keterangan,kb.keteranganbelanja,
        case
        when ap.id = 18 then kb.subtotal
        end as subtotaljasalayanan,
        case
        when ap.id = 15 then kb.subtotal
        end as subtotalapbd
        from kegiatananggaran_m km
        inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
        left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
        inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
        inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
        inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
        and
        case
        when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) = 5
        when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) = 4
        when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) = 5
        end
        inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk
        inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk 
        where km.kdprofile = 30 and km.statusenabled = true
        and kb.kdprofile = 30 and kb.statusenabled = true
        and ma.kdprofile = 30 and ma.statusenabled = true
        and kms.kdprofile = 30 and kms.statusenabled = true
        and kmss.kdprofile = 30 and kmss.statusenabled = true
        and mat.kdprofile = 30 and mat.statusenabled = true
        $qterhadap
        and km.tahun = '$tahun'
        -- group by ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran, ap.id
        )as uni 
        group by uni.id, uni.tahap, uni.kodemataanggaran, uni.keterangan

        ) as j

        left join(
        select id, tahap,
        case
        when kodemataanggaran = 'A' then 'I.A'
        when kodemataanggaran = 'B' then 'I.B'
        when kodemataanggaran = 'II' then 'II'
        when kodemataanggaran = 'III' then 'III'
        end as kodemataanggaran,
        case
        when kodemataanggaran = 'A' then 'BIAYA PELAYANAN '
        when kodemataanggaran = 'B' then 'BIAYA UMUM DAN ADMINISTRASI'
        when kodemataanggaran = 'II' then 'BIAYA NON OPERASIONAL'
        when kodemataanggaran = 'III' then 'BIAYA PENGELUARAN INVESTASI'
        end as keterangan,

        case
        when kodemataanggaran = 'A' and y.id_asalproduk=18 then sum(subtotaljasalayanan)
        when kodemataanggaran = 'B' and y.id_asalproduk=18 then sum(subtotaljasalayanan)
        when kodemataanggaran = 'II' and y.id_asalproduk=18 then sum(subtotaljasalayanan)
        when kodemataanggaran = 'III' and y.id_asalproduk=18 then sum(subtotaljasalayanan)
        end as subtotaljasalayanan,
        case
        when kodemataanggaran = 'A' and y.id_asalproduk=15 then sum(subtotalapbd)
        when kodemataanggaran = 'B' and y.id_asalproduk=15 then sum(subtotalapbd)
        when kodemataanggaran = 'II' and y.id_asalproduk=15 then sum(subtotalapbd)
        when kodemataanggaran = 'III' and y.id_asalproduk=15 then sum(subtotalapbd)
        end as subtotalapbd
        from(
        select x.id, tahap,
        case
        when kodemataanggaran ilike 'I.A.%' then 'A'
        when kodemataanggaran ilike 'I.B.%' then 'B'
        when kodemataanggaran ilike 'II.%' then 'II'
        when kodemataanggaran ilike 'III.%' then 'III'
        end as kodemataanggaran,
        x.id_asalproduk,
        case
        when kodemataanggaran ilike 'I.A.%' and x.id_asalproduk = 15 then sum(subtotal)
        when kodemataanggaran ilike 'I.B.%' and x.id_asalproduk = 15 then sum (subtotal)
        when kodemataanggaran ilike 'II.%' and x.id_asalproduk = 15 then sum(subtotal)
        when kodemataanggaran ilike 'III.%' and x.id_asalproduk = 15 then sum(subtotal)
        end subtotalapbd,
        case
        when kodemataanggaran ilike 'I.A.%' and x.id_asalproduk = 18 then sum(subtotal)
        when kodemataanggaran ilike 'I.B.%' and x.id_asalproduk = 18 then sum (subtotal)
        when kodemataanggaran ilike 'II.%' and x.id_asalproduk = 18 then sum(subtotal)
        when kodemataanggaran ilike 'III.%' and x.id_asalproduk = 18 then sum(subtotal)
        end subtotaljasalayanan
        from(
        select DISTINCT ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran, kb.keteranganbelanja, kb.subtotal as subtotal,
            ap.id as id_asalproduk, ap.asalproduk
        from kegiatananggaran_m km
        inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
        left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
        inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
        inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
        inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
        and
        case
        when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) = 5
        when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) = 4
        when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) = 5
        end
        inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk
        inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
        where km.kdprofile = 30 and km.statusenabled = true
        and kb.kdprofile = 30 and kb.statusenabled = true
        and ma.kdprofile = 30 and ma.statusenabled = true
        and kms.kdprofile = 30 and kms.statusenabled = true
        and kmss.kdprofile = 30 and kmss.statusenabled = true
        and mat.kdprofile = 30 and mat.statusenabled = true
        $qtahap
        and km.tahun = '$tahun'
        -- group by ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran, kb.keteranganbelanja, ap.id, ap.asalproduk, kb.subtotal
        ) as x group by x.id, x.tahap, x.kodemataanggaran, x.id_asalproduk
        ) as y group by id, tahap, kodemataanggaran, y.id_asalproduk

        union all

        select uni.id,uni.tahap, uni.kodemataanggaran, uni.keterangan, sum(uni.subtotaljasalayanan)as subtotaljasalayanan, sum(uni.subtotalapbd )as subtotalapbd from (
        select distinct ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran keterangan,kb.keteranganbelanja,
        case
        when ap.id = 18 then kb.subtotal
        end as subtotaljasalayanan,
        case
        when ap.id = 15 then kb.subtotal
        end as subtotalapbd
        from kegiatananggaran_m km
        inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
        left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
        inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
        inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
        inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
        and
        case
        when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) = 5
        when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) = 4
        when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) = 5
        end
        inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk
        inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk 
        where km.kdprofile = 30 and km.statusenabled = true
        and kb.kdprofile = 30 and kb.statusenabled = true
        and ma.kdprofile = 30 and ma.statusenabled = true
        and kms.kdprofile = 30 and kms.statusenabled = true
        and kmss.kdprofile = 30 and kmss.statusenabled = true
        and mat.kdprofile = 30 and mat.statusenabled = true
        $qtahap
        and km.tahun = '$tahun'
        -- group by ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran, ap.id
        )as uni 
        group by uni.id, uni.tahap, uni.kodemataanggaran, uni.keterangan
        ) as k on j.kodemataanggaran = k.kodemataanggaran GROUP BY j.kodemataanggaran, k.kodemataanggaran
        order by k.kodemataanggaran
        ) as p on o.kodemataanggaran = p.kodemataanggaran
        GROUP BY p.kodemataanggaran, o.namamataanggaran, o.kodemataanggaran,p.kodemataanggaran, p.subtotalapbdsebelum, p.subtotalapbdsetelah, p.subtotaljasalayanansebelum, p.subtotaljasalayanansetelah
        order by o.kodemataanggaran
        "));

        $jumlah = \DB::select(DB::raw("
        select sum(i.subtotalapbd) as subtotalapbd, sum(i.subtotaljasalayanan) as subtotaljasalayanan, sum(i.subtotalapbdsetelah) subtotalapbdsetelah, sum(i.subtotaljasalayanansetelah) subtotaljasalayanansetelah from(
        SELECT k.kodemataanggaran, k.subtotaljasalayanan as subtotaljasalayanan, k.subtotalapbd as subtotalapbd, j.subtotalapbd as subtotalapbdsetelah, j.subtotaljasalayanan as subtotaljasalayanansetelah
        from(
        select id, tahap,
        case
        when kodemataanggaran = 'A' then 'I.A'
        when kodemataanggaran = 'B' then 'I.B'
        when kodemataanggaran = 'II' then 'II'
        when kodemataanggaran = 'III' then 'III'
        end as kodemataanggaran,
        case
        when kodemataanggaran = 'A' then 'BIAYA PELAYANAN '
        when kodemataanggaran = 'B' then 'BIAYA UMUM DAN ADMINISTRASI'
        when kodemataanggaran = 'II' then 'BIAYA NON OPERASIONAL'
        when kodemataanggaran = 'III' then 'BIAYA PENGELUARAN INVESTASI'
        end as keterangan,
        -- case
        -- when kodemataanggaran = 'A' then sum(subtotal)
        -- when kodemataanggaran = 'B' then sum(subtotal)
        -- when kodemataanggaran = 'II' then sum(subtotal)
        -- when kodemataanggaran = 'III' then sum(subtotal)
        -- end as subtotal
        case
        when kodemataanggaran = 'A' and y.id_asalproduk = 15 then sum(y.subtotalapbd)
        when kodemataanggaran = 'B' and y.id_asalproduk = 15 then sum(y.subtotalapbd)
        when kodemataanggaran = 'II' and y.id_asalproduk = 15 then sum(y.subtotalapbd)
        when kodemataanggaran = 'III' and y.id_asalproduk = 15 then sum(y.subtotalapbd)
        end as subtotalapbd,
        case
        when kodemataanggaran = 'A' and y.id_asalproduk = 18 then sum(y.subtotaljasalayanan)
        when kodemataanggaran = 'B' and y.id_asalproduk = 18 then sum(y.subtotaljasalayanan)
        when kodemataanggaran = 'II' and y.id_asalproduk = 18 then sum(y.subtotaljasalayanan)
        when kodemataanggaran = 'III' and y.id_asalproduk = 18 then sum(y.subtotaljasalayanan)
        end as subtotaljasalayanan
        from(
        select id, tahap, x.id_asalproduk,
        case
        when kodemataanggaran ilike 'I.A.%' then 'A'
        when kodemataanggaran ilike 'I.B.%' then 'B'
        when kodemataanggaran ilike 'II.%' then 'II'
        when kodemataanggaran ilike 'III.%' then 'III'
        end as kodemataanggaran,
        -- case
        -- when kodemataanggaran ilike 'I.A.%' then sum(subtotal)
        -- when kodemataanggaran ilike 'I.B.%' then sum(subtotal)
        -- when kodemataanggaran ilike 'II.%' then sum(subtotal)
        -- when kodemataanggaran ilike 'III.%' then sum(subtotal)
        -- end as subtotal
        case
        when kodemataanggaran ilike 'I.A.%' and x.id_asalproduk = 15 then sum(x.subtotalapbd)
        when kodemataanggaran ilike 'I.B.%' and x.id_asalproduk = 15 then sum(x.subtotalapbd)
        when kodemataanggaran ilike 'II.%' and x.id_asalproduk = 15 then sum(x.subtotalapbd)
        when kodemataanggaran ilike 'III.%' and x.id_asalproduk = 15 then sum(x.subtotalapbd)
        end as subtotalapbd,
        case
        when kodemataanggaran ilike 'I.A.%' and x.id_asalproduk = 18 then sum(x.subtotaljasalayanan)
        when kodemataanggaran ilike 'I.B.%' and x.id_asalproduk = 18 then sum(x.subtotaljasalayanan)
        when kodemataanggaran ilike 'II.%' and x.id_asalproduk = 18 then sum(x.subtotaljasalayanan)
        when kodemataanggaran ilike 'III.%' and x.id_asalproduk = 18 then sum(x.subtotaljasalayanan)
        end as subtotaljasalayanan
        from(
        select DISTINCT ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran, kb.keteranganbelanja, ap.id as id_asalproduk,
        case
        when ap.id =15 then kb.subtotal
        end as subtotalapbd,
        case
        when ap.id =18 then kb.subtotal
        end as subtotaljasalayanan
        from kegiatananggaran_m km
        inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
        left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
        inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
        inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
        inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
        and
        case
        when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) = 5
        when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) = 4
        when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) = 5
        end
        inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk and ap.id in(15,18)
        inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk
        where km.kdprofile = 30 and km.statusenabled = true
        and kb.kdprofile = 30 and kb.statusenabled = true
        and ma.kdprofile = 30 and ma.statusenabled = true
        and kms.kdprofile = 30 and kms.statusenabled = true
        and kmss.kdprofile = 30 and kmss.statusenabled = true
        and mat.kdprofile = 30 and mat.statusenabled = true
        $qterhadap
        and km.tahun = '$tahun'
        -- group by ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran, kb.keteranganbelanja, ap.id
        ) as x group by id, tahap, kodemataanggaran, x.id_asalproduk
        ) as y group by id, tahap, kodemataanggaran, y.id_asalproduk

        union all

        SELECT uni.id, uni.tahap, uni.kodemataanggaran, uni.keterangan,sum(uni.subtotalapbd)as subtotalapbd, sum(uni.subtotaljasalayanan)as subtotaljasalayanan FROM (select DISTINCT ta.id, ta.tahap, kb.keteranganbelanja,  mat.kodemataanggaran, mat.namamataanggaran keterangan,
        case
        when ap.id = 15 then kb.subtotal
        end as subtotalapbd,
        case
        when ap.id = 18 then kb.subtotal
        end as subtotaljasalayanan
        from kegiatananggaran_m km
        inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
        left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
        inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
        inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
        inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
        and
        case
        when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) = 5
        when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) = 4
        when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) = 5
        end
        inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk
        inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk and ap.id in (15,18)
        where km.kdprofile = 30 and km.statusenabled = true
        and kb.kdprofile = 30 and kb.statusenabled = true
        and ma.kdprofile = 30 and ma.statusenabled = true
        and kms.kdprofile = 30 and kms.statusenabled = true
        and kmss.kdprofile = 30 and kmss.statusenabled = true
        and mat.kdprofile = 30 and mat.statusenabled = true
        $qterhadap
        and km.tahun = '$tahun'
        -- group by ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran, ap.id
        )as uni GROUP BY uni.kodemataanggaran, uni.id, uni.keterangan, uni.kodemataanggaran,uni.tahap

        ) as j
        inner join(
        select id, tahap,
        case
        when kodemataanggaran = 'A' then 'I.A'
        when kodemataanggaran = 'B' then 'I.B'
        when kodemataanggaran = 'II' then 'II'
        when kodemataanggaran = 'III' then 'III'
        end as kodemataanggaran,
        case
        when kodemataanggaran = 'A' then 'BIAYA PELAYANAN '
        when kodemataanggaran = 'B' then 'BIAYA UMUM DAN ADMINISTRASI'
        when kodemataanggaran = 'II' then 'BIAYA NON OPERASIONAL'
        when kodemataanggaran = 'III' then 'BIAYA PENGELUARAN INVESTASI'
        end as keterangan,
        -- case
        -- when kodemataanggaran = 'A' then sum(subtotal)
        -- when kodemataanggaran = 'B' then sum(subtotal)
        -- when kodemataanggaran = 'II' then sum(subtotal)
        -- when kodemataanggaran = 'III' then sum(subtotal)
        -- end as subtotal
        case
        when kodemataanggaran = 'A' and y.id_asalproduk = 15 then sum(y.subtotalapbd)
        when kodemataanggaran = 'B' and y.id_asalproduk = 15 then sum(y.subtotalapbd)
        when kodemataanggaran = 'II' and y.id_asalproduk = 15 then sum(y.subtotalapbd)
        when kodemataanggaran = 'III' and y.id_asalproduk = 15 then sum(y.subtotalapbd)
        end as subtotalapbd,
        case
        when kodemataanggaran = 'A' and y.id_asalproduk = 18 then sum(y.subtotaljasalayanan)
        when kodemataanggaran = 'B' and y.id_asalproduk = 18 then sum(y.subtotaljasalayanan)
        when kodemataanggaran = 'II' and y.id_asalproduk = 18 then sum(y.subtotaljasalayanan)
        when kodemataanggaran = 'III' and y.id_asalproduk = 18 then sum(y.subtotaljasalayanan)
        end as subtotaljasalayanan
        from(
        select id, tahap, x.id_asalproduk,
        case
        when kodemataanggaran ilike 'I.A.%' then 'A'
        when kodemataanggaran ilike 'I.B.%' then 'B'
        when kodemataanggaran ilike 'II.%' then 'II'
        when kodemataanggaran ilike 'III.%' then 'III'
        end as kodemataanggaran,
        -- case
        -- when kodemataanggaran ilike 'I.A.%' then sum(subtotal)
        -- when kodemataanggaran ilike 'I.B.%' then sum(subtotal)
        -- when kodemataanggaran ilike 'II.%' then sum(subtotal)
        -- when kodemataanggaran ilike 'III.%' then sum(subtotal)
        -- end as subtotal
        case
        when kodemataanggaran ilike 'I.A.%' and x.id_asalproduk = 15 then sum(x.subtotalapbd)
        when kodemataanggaran ilike 'I.B.%' and x.id_asalproduk = 15 then sum(x.subtotalapbd)
        when kodemataanggaran ilike 'II.%' and x.id_asalproduk = 15 then sum(x.subtotalapbd)
        when kodemataanggaran ilike 'III.%' and x.id_asalproduk = 15 then sum(x.subtotalapbd)
        end as subtotalapbd,
        case
        when kodemataanggaran ilike 'I.A.%' and x.id_asalproduk = 18 then sum(x.subtotaljasalayanan)
        when kodemataanggaran ilike 'I.B.%' and x.id_asalproduk = 18 then sum(x.subtotaljasalayanan)
        when kodemataanggaran ilike 'II.%' and x.id_asalproduk = 18 then sum(x.subtotaljasalayanan)
        when kodemataanggaran ilike 'III.%' and x.id_asalproduk = 18 then sum(x.subtotaljasalayanan)
        end as subtotaljasalayanan
        from(
        select DISTINCT ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran, kb.keteranganbelanja, ap.id as id_asalproduk,
        case
        when ap.id =15 then kb.subtotal
        end as subtotalapbd,
        case
        when ap.id =18 then kb.subtotal
        end as subtotaljasalayanan
        from kegiatananggaran_m km
        inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
        left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
        inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
        inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
        inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
        and
        case
        when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) = 5
        when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) = 4
        when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) = 5
        end
        inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk and ap.id in(15,18)
        inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk
        where km.kdprofile = 30 and km.statusenabled = true
        and kb.kdprofile = 30 and kb.statusenabled = true
        and ma.kdprofile = 30 and ma.statusenabled = true
        and kms.kdprofile = 30 and kms.statusenabled = true
        and kmss.kdprofile = 30 and kmss.statusenabled = true
        and mat.kdprofile = 30 and mat.statusenabled = true
        $qtahap
        and km.tahun = '$tahun'
        -- group by ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran, kb.keteranganbelanja, ap.id
        ) as x group by id, tahap, kodemataanggaran, x.id_asalproduk
        ) as y group by id, tahap, kodemataanggaran, y.id_asalproduk

        union all

        SELECT uni.id, uni.tahap, uni.kodemataanggaran, uni.keterangan,sum(uni.subtotalapbd)as subtotalapbd, sum(uni.subtotaljasalayanan)as subtotaljasalayanan FROM (select DISTINCT ta.id, ta.tahap, kb.keteranganbelanja,  mat.kodemataanggaran, mat.namamataanggaran keterangan,
        case
        when ap.id = 15 then kb.subtotal
        end as subtotalapbd,
        case
        when ap.id = 18 then kb.subtotal
        end as subtotaljasalayanan
        from kegiatananggaran_m km
        inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
        left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
        inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
        inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
        inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
        and
        case
        when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) = 5
        when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) = 4
        when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) = 5
        end
        inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk
        inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk and ap.id in (15,18)
        where km.kdprofile = 30 and km.statusenabled = true
        and kb.kdprofile = 30 and kb.statusenabled = true
        and ma.kdprofile = 30 and ma.statusenabled = true
        and kms.kdprofile = 30 and kms.statusenabled = true
        and kmss.kdprofile = 30 and kmss.statusenabled = true
        and mat.kdprofile = 30 and mat.statusenabled = true
        $qtahap
        and km.tahun = '$tahun'
        -- group by ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran, ap.id
        )as uni GROUP BY uni.kodemataanggaran, uni.id, uni.keterangan, uni.kodemataanggaran,uni.tahap
        ) as k on j.kodemataanggaran = k.kodemataanggaran order by k.kodemataanggaran
        ) as i where kodemataanggaran ilike 'I.%' and char_length(kodemataanggaran) = 3;
        "));

        $jumlassshs = DB::select(DB::raw("select sum(subtotal) totalawalsebelum, sum(subtotalsetelah) totalawalsesudah from(
        SELECT k.*, j.subtotal as subtotalsetelah, j.tahap tahapsetelah
        from(
                    select id, tahap,
                    case 
                        when kodemataanggaran = 'A' then 'I.A'
                        when kodemataanggaran = 'B' then 'I.B'
                        when kodemataanggaran = 'II' then 'II'
                        when kodemataanggaran = 'III' then 'III'
                    end as kodemataanggaran,
                    case 
                        when kodemataanggaran = 'A' then 'BIAYA PELAYANAN '
                        when kodemataanggaran = 'B' then 'BIAYA UMUM DAN ADMINISTRASI'
                        when kodemataanggaran = 'II' then 'BIAYA NON OPERASIONAL'
                        when kodemataanggaran = 'III' then 'BIAYA PENGELUARAN INVESTASI'
                    end as keterangan,
                    case 
                        when kodemataanggaran = 'A' then sum(subtotal)
                        when kodemataanggaran = 'B' then sum(subtotal)
                        when kodemataanggaran = 'II' then sum(subtotal)
                        when kodemataanggaran = 'III' then sum(subtotal)
                    end as subtotal
                    from(
                        select id, tahap,
                        case 
                            when kodemataanggaran ilike 'I.A.%' then 'A'
                            when kodemataanggaran ilike 'I.B.%' then 'B'
                            when kodemataanggaran ilike 'II.%' then 'II'
                            when kodemataanggaran ilike 'III.%' then 'III'
                        end as kodemataanggaran,
                        case 
                            when kodemataanggaran ilike 'I.A.%' then sum(subtotal)
                            when kodemataanggaran ilike 'I.B.%' then sum(subtotal)
                            when kodemataanggaran ilike 'II.%' then sum(subtotal)
                            when kodemataanggaran ilike 'III.%' then sum(subtotal)
                        end as subtotal
                        from(
                                    select ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran, kb.keteranganbelanja, sum(kb.subtotal) subtotal
                                    from kegiatananggaran_m km
                                    inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
                                    left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
                                    inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
                                    inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
                                    inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
                                    and 
                                    case 
                                        when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) = 5
                                        when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) = 4
                                        when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) = 5
                                    end
                                    inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
                                    where km.kdprofile = 30 and km.statusenabled = true
                                    and kb.kdprofile = 30 and kb.statusenabled = true
                                    and ma.kdprofile = 30 and ma.statusenabled = true
                                    and kms.kdprofile = 30 and kms.statusenabled = true
                                    and kmss.kdprofile = 30 and kmss.statusenabled = true
                                    and mat.kdprofile = 30 and mat.statusenabled = true
                                    $qterhadap
                                    and km.tahun = '$tahun'
                                    group by ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran, kb.keteranganbelanja
                        ) as x group by id, tahap, kodemataanggaran
                    ) as y group by id, tahap, kodemataanggaran
        
                    union all
        
                    select ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran keterangan, sum(kb.subtotal) subtotal
                    from kegiatananggaran_m km
                    inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
                    left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
                    inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
                    inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
                    inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
                    and 
                    case 
                        when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) = 5
                        when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) = 4
                        when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) = 5
                    end
                    inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
                    where km.kdprofile = 30 and km.statusenabled = true
                    and kb.kdprofile = 30 and kb.statusenabled = true
                    and ma.kdprofile = 30 and ma.statusenabled = true
                    and kms.kdprofile = 30 and kms.statusenabled = true
                    and kmss.kdprofile = 30 and kmss.statusenabled = true
                    and mat.kdprofile = 30 and mat.statusenabled = true
                    $qterhadap
                    and km.tahun = '$tahun'
                    group by ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran
                    
        ) as j
        inner join(
                    select id,
                    case 
                        when kodemataanggaran = 'A' then 'I.A'
                        when kodemataanggaran = 'B' then 'I.B'
                        when kodemataanggaran = 'II' then 'II'
                        when kodemataanggaran = 'III' then 'III'
                    end as kodemataanggaran,
                    case 
                        when kodemataanggaran = 'A' then 'BIAYA PELAYANAN '
                        when kodemataanggaran = 'B' then 'BIAYA UMUM DAN ADMINISTRASI'
                        when kodemataanggaran = 'II' then 'BIAYA NON OPERASIONAL'
                        when kodemataanggaran = 'III' then 'BIAYA PENGELUARAN INVESTASI'
                    end as keterangan,
                    case 
                        when kodemataanggaran = 'A' then sum(subtotal)
                        when kodemataanggaran = 'B' then sum(subtotal)
                        when kodemataanggaran = 'II' then sum(subtotal)
                        when kodemataanggaran = 'III' then sum(subtotal)
                    end as subtotal
                    from(
                        select id,
                        case 
                            when kodemataanggaran ilike 'I.A.%' then 'A'
                            when kodemataanggaran ilike 'I.B.%' then 'B'
                            when kodemataanggaran ilike 'II.%' then 'II'
                            when kodemataanggaran ilike 'III.%' then 'III'
                        end as kodemataanggaran,
                        case 
                            when kodemataanggaran ilike 'I.A.%' then sum(subtotal)
                            when kodemataanggaran ilike 'I.B.%' then sum(subtotal)
                            when kodemataanggaran ilike 'II.%' then sum(subtotal)
                            when kodemataanggaran ilike 'III.%' then sum(subtotal)
                        end as subtotal
                        from(
                                    select ta.id, mat.kodemataanggaran, mat.namamataanggaran, kb.keteranganbelanja, sum(kb.subtotal) subtotal
                                    from kegiatananggaran_m km
                                    inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
                                    left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
                                    inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
                                    inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
                                    inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
                                    and 
                                    case 
                                        when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) = 5
                                        when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) = 4
                                        when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) = 5
                                    end
                                    inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
                                    where km.kdprofile = 30 and km.statusenabled = true
                                    and kb.kdprofile = 30 and kb.statusenabled = true
                                    and ma.kdprofile = 30 and ma.statusenabled = true
                                    and kms.kdprofile = 30 and kms.statusenabled = true
                                    and kmss.kdprofile = 30 and kmss.statusenabled = true
                                    and mat.kdprofile = 30 and mat.statusenabled = true
                                    $qtahap
                                    and km.tahun = '$tahun'
                                    group by ta.id, mat.kodemataanggaran, mat.namamataanggaran, kb.keteranganbelanja
                        ) as x group by id, kodemataanggaran
                    ) as y group by id, kodemataanggaran
        
                    union ALL
        
                    select ta.id, mat.kodemataanggaran, mat.namamataanggaran keterangan, sum(kb.subtotal) subtotal
                    from kegiatananggaran_m km
                    inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
                    left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
                    inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
                    inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
                    inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
                    and 
                    case 
                        when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) = 5
                        when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) = 4
                        when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) = 5
                    end
                    inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
                    where km.kdprofile = 30 and km.statusenabled = true
                    and kb.kdprofile = 30 and kb.statusenabled = true
                    and ma.kdprofile = 30 and ma.statusenabled = true
                    and kms.kdprofile = 30 and kms.statusenabled = true
                    and kmss.kdprofile = 30 and kmss.statusenabled = true
                    and mat.kdprofile = 30 and mat.statusenabled = true
                    $qtahap
                    and km.tahun = '$tahun'
                    group by ta.id, mat.kodemataanggaran, mat.namamataanggaran
                    order by kodemataanggaran
        ) as k on j.kodemataanggaran = k.kodemataanggaran order by k.kodemataanggaran
        ) as i where kodemataanggaran ilike 'I.%' and char_length(kodemataanggaran) = 3;"));



        // $result = array(
        //     'data' => $sebelum,
        //     'message' => '@epic',
        // );

        $pageWidth = 1200;
        return view('report.spj.cetakrekapmataanggaran',compact('sebelum','pageWidth', 'jumlah', 'itahap', 'tanggalcetak'));
    }

    public function CetakRekapMataAnggaranSebelum(Request $request){
        $tahun = $request['tahun'];
        $tahap = $request['tahap'];
        
        $tanggalcetak = $this->tanggal_indonesia(date('Y-m-d',strtotime($request['tglcetak'])));
        $qtahap  = '';
        if (isset($request['tahap']) && $request['tahap'] != "" && $request['tahap'] != "undefined") {
            $qtahap =  ' and kb.objecttahapfk =  ' . $request['tahap'];
        }

        $itahap = DB::select(DB::raw("select id, tahap from tahapanggaran_m where id = $tahap"));

        $sebelum = DB::select(DB::raw("
        SELECT o.*, p.subtotalapbd, p.subtotaljasalayanan, p.tahap
        from
        (
            select kodemataanggaran, namamataanggaran from mataanggaran_m WHERE
            case 
                when kodemataanggaran ilike 'I%' then (char_length(kodemataanggaran) = 5 or char_length(kodemataanggaran) = 3)
                when kodemataanggaran ilike 'II%' then (char_length(kodemataanggaran) = 4 or char_length(kodemataanggaran) = 2)
                when kodemataanggaran ilike 'III%' then (char_length(kodemataanggaran) = 5 or char_length(kodemataanggaran) = 3)
            end
        ) as o
        left join
        (
			select id, tahap,
			case 
				when kodemataanggaran = 'A' then 'I.A'
				when kodemataanggaran = 'B' then 'I.B'
				when kodemataanggaran = 'II' then 'II'
				when kodemataanggaran = 'III' then 'III'
			end as kodemataanggaran,
			case 
				when kodemataanggaran = 'A' then 'BIAYA PELAYANAN '
				when kodemataanggaran = 'B' then 'BIAYA UMUM DAN ADMINISTRASI'
				when kodemataanggaran = 'II' then 'BIAYA NON OPERASIONAL'
				when kodemataanggaran = 'III' then 'BIAYA PENGELUARAN INVESTASI'
			end as keterangan,
			case 
				when kodemataanggaran = 'A' then sum(subtotalapbd)
				when kodemataanggaran = 'B' then sum(subtotalapbd)
				when kodemataanggaran = 'II' then sum(subtotalapbd)
				when kodemataanggaran = 'III' then sum(subtotalapbd)
			end as subtotalapbd,
			case 
				when kodemataanggaran = 'A' then sum(subtotaljasalayanan)
				when kodemataanggaran = 'B' then sum(subtotaljasalayanan)
				when kodemataanggaran = 'II' then sum(subtotaljasalayanan)
				when kodemataanggaran = 'III' then sum(subtotaljasalayanan)
			end as subtotaljasalayanan
			from(
				select id, tahap,
				case 
					when kodemataanggaran ilike 'I.A.%' then 'A'
					when kodemataanggaran ilike 'I.B.%' then 'B'
					when kodemataanggaran ilike 'II.%' then 'II'
					when kodemataanggaran ilike 'III.%' then 'III'
				end as kodemataanggaran,
				case 
					when kodemataanggaran ilike 'I.A.%' then sum(subtotalapbd)
					when kodemataanggaran ilike 'I.B.%' then sum(subtotalapbd)
					when kodemataanggaran ilike 'II.%' then sum(subtotalapbd)
					when kodemataanggaran ilike 'III.%' then sum(subtotalapbd)
				end as subtotalapbd,
				case 
					when kodemataanggaran ilike 'I.A.%' then sum(subtotaljasalayanan)
					when kodemataanggaran ilike 'I.B.%' then sum(subtotaljasalayanan)
					when kodemataanggaran ilike 'II.%' then sum(subtotaljasalayanan)
					when kodemataanggaran ilike 'III.%' then sum(subtotaljasalayanan)
				end as subtotaljasalayanan
				from(
							select ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran, kb.keteranganbelanja, 
							case when ap.id = 15 then sum(kb.subtotal) end as subtotalapbd,
							case when ap.id = 18 then sum(kb.subtotal) end as subtotaljasalayanan
							from kegiatananggaran_m km
							inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
							left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
							inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
							inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
							inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
							inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
							and 
							case 
								when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) = 5
								when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) = 4
								when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) = 5
							end
							inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
							where km.kdprofile = 30 and km.statusenabled = true
                            and kms.kdprofile = 30 and kms.statusenabled = true
                            and kmss.kdprofile = 30 and kmss.statusenabled = true
                            and ma.kdprofile = 30 and ma.statusenabled = true
                            and mat.kdprofile = 30 and mat.statusenabled = true
                            and kb.kdprofile = 30 and kb.statusenabled = true
							$qtahap
							and km.tahun = '$tahun'
							group by ap.id, ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran, kb.keteranganbelanja
				) as x group by id, tahap, kodemataanggaran
			) as y group by id, tahap, kodemataanggaran

			union all
			
			select ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran keterangan, 
			case when ap.id = 15 then sum(kb.subtotal) end as subtotalapbd,
			case when ap.id = 18 then sum(kb.subtotal) end as subtotaljasalayanan
			from kegiatananggaran_m km
			inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
			left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
			inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
			inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
			inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
			inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
			and 
			case 
				when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) = 5
				when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) = 4
				when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) = 5
			end
			inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
			where km.kdprofile = 30 and km.statusenabled = true
			$qtahap
			and km.tahun = '$tahun'
            and kms.kdprofile = 30 and kms.statusenabled = true
            and kmss.kdprofile = 30 and kmss.statusenabled = true
            and ma.kdprofile = 30 and ma.statusenabled = true
            and mat.kdprofile = 30 and mat.statusenabled = true
            and kb.kdprofile = 30 and kb.statusenabled = true
			group by ap.id, ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran
        ) as p on o.kodemataanggaran = p.kodemataanggaran 
        group by o.kodemataanggaran, o.namamataanggaran, p.subtotalapbd, p.subtotaljasalayanan, p.tahap
        order by o.kodemataanggaran"));

        $jumlah = DB::select(DB::raw("select sum(subtotalapbd) totalapbd, sum(subtotaljasalayanan) totaljasalayanan from(
            select id, tahap,
            case 
                when kodemataanggaran = 'A' then 'I.A'
                when kodemataanggaran = 'B' then 'I.B'
                when kodemataanggaran = 'II' then 'II'
                when kodemataanggaran = 'III' then 'III'
            end as kodemataanggaran,
            case 
                when kodemataanggaran = 'A' then 'BIAYA PELAYANAN '
                when kodemataanggaran = 'B' then 'BIAYA UMUM DAN ADMINISTRASI'
                when kodemataanggaran = 'II' then 'BIAYA NON OPERASIONAL'
                when kodemataanggaran = 'III' then 'BIAYA PENGELUARAN INVESTASI'
            end as keterangan,
            case 
                                        when kodemataanggaran = 'A' then sum(subtotalapbd)
                                        when kodemataanggaran = 'B' then sum(subtotalapbd)
                                        when kodemataanggaran = 'II' then sum(subtotalapbd)
                                        when kodemataanggaran = 'III' then sum(subtotalapbd)
                                    end as subtotalapbd,
                                    case 
                                        when kodemataanggaran = 'A' then sum(subtotaljasalayanan)
                                        when kodemataanggaran = 'B' then sum(subtotaljasalayanan)
                                        when kodemataanggaran = 'II' then sum(subtotaljasalayanan)
                                        when kodemataanggaran = 'III' then sum(subtotaljasalayanan)
                                    end as subtotaljasalayanan
            from(
                select id, tahap,
                case 
                    when kodemataanggaran ilike 'I.A.%' then 'A'
                    when kodemataanggaran ilike 'I.B.%' then 'B'
                    when kodemataanggaran ilike 'II.%' then 'II'
                    when kodemataanggaran ilike 'III.%' then 'III'
                end as kodemataanggaran,
                case 
                                                when kodemataanggaran ilike 'I.A.%' then sum(subtotalapbd)
                                                when kodemataanggaran ilike 'I.B.%' then sum(subtotalapbd)
                                                when kodemataanggaran ilike 'II.%' then sum(subtotalapbd)
                                                when kodemataanggaran ilike 'III.%' then sum(subtotalapbd)
                                            end as subtotalapbd,
                                            case 
                                                when kodemataanggaran ilike 'I.A.%' then sum(subtotaljasalayanan)
                                                when kodemataanggaran ilike 'I.B.%' then sum(subtotaljasalayanan)
                                                when kodemataanggaran ilike 'II.%' then sum(subtotaljasalayanan)
                                                when kodemataanggaran ilike 'III.%' then sum(subtotaljasalayanan)
                                            end as subtotaljasalayanan
                            from(
                            select ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran, kb.keteranganbelanja,
                                case when ap.id = 15 then sum(kb.subtotal) end as subtotalapbd,
                                case when ap.id = 18 then sum(kb.subtotal) end as subtotaljasalayanan
                            from kegiatananggaran_m km
                            inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
                            left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
                            inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
                            inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
                            inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
                            inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
                            and 
                            case 
                                when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) = 5
                                when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) = 4
                                when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) = 5
                            end
                            inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
                            where km.kdprofile = 30 and km.statusenabled = true
                            and kms.kdprofile = 30 and kms.statusenabled = true
                            and kmss.kdprofile = 30 and kmss.statusenabled = true
                            and ma.kdprofile = 30 and ma.statusenabled = true
                            and mat.kdprofile = 30 and mat.statusenabled = true
                            and kb.kdprofile = 30 and kb.statusenabled = true
                            $qtahap
                            and km.tahun = '$tahun'
                            group by ap.id, ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran, kb.keteranganbelanja
                ) as x group by id, tahap, kodemataanggaran
            ) as y where y.kodemataanggaran not in('II', 'III') group by id, tahap, kodemataanggaran
        )  as i"));

        $result = array(
            'data' => $sebelum,
            'message' => '@epic',
        );

        $pageWidth = 1200;
        return view('report.spj.cetakrekapmataanggaransebelum',compact('sebelum','pageWidth', 'jumlah', 'itahap', 'tanggalcetak'));
    }

    public function CetakRekapTotalAnggaran(Request $request){
        $tahun = $request['tahun'];
        $tahap = $request['tahap'];
        $tanggalcetak = $this->tanggal_indonesia(date('Y-m-d',strtotime($request['tglcetak']))); 

        $qtahap  = '';
        if (isset($request['tahap']) && $request['tahap'] != "" && $request['tahap'] != "undefined") {
            $qtahap =  ' and kb.objecttahapfk =  ' . $request['tahap'];
        }

        $itahap = DB::select(DB::raw("select id, tahap from tahapanggaran_m where id = $tahap"));

        $sebelum = DB::select(DB::raw("
        SELECT o.*, p.subtotal, p.tahap
        from
        (
            select kodemataanggaran, namamataanggaran from mataanggaran_m WHERE
            case 
                when kodemataanggaran ilike 'I%' then (char_length(kodemataanggaran) = 5 or char_length(kodemataanggaran) = 3)
                when kodemataanggaran ilike 'II%' then (char_length(kodemataanggaran) = 4 or char_length(kodemataanggaran) = 2)
                when kodemataanggaran ilike 'III%' then (char_length(kodemataanggaran) = 5 or char_length(kodemataanggaran) = 3)
            end
        ) as o
        left join
        (
			select id, tahap,
			case 
				when kodemataanggaran = 'A' then 'I.A'
				when kodemataanggaran = 'B' then 'I.B'
				when kodemataanggaran = 'II' then 'II'
				when kodemataanggaran = 'III' then 'III'
			end as kodemataanggaran,
			case 
				when kodemataanggaran = 'A' then 'BIAYA PELAYANAN '
				when kodemataanggaran = 'B' then 'BIAYA UMUM DAN ADMINISTRASI'
				when kodemataanggaran = 'II' then 'BIAYA NON OPERASIONAL'
				when kodemataanggaran = 'III' then 'BIAYA PENGELUARAN INVESTASI'
			end as keterangan,
			case 
				when kodemataanggaran = 'A' then sum(subtotal)
				when kodemataanggaran = 'B' then sum(subtotal)
				when kodemataanggaran = 'II' then sum(subtotal)
				when kodemataanggaran = 'III' then sum(subtotal)
			end as subtotal
			from(
				select id, tahap,
				case 
					when kodemataanggaran ilike 'I.A.%' then 'A'
					when kodemataanggaran ilike 'I.B.%' then 'B'
					when kodemataanggaran ilike 'II.%' then 'II'
					when kodemataanggaran ilike 'III.%' then 'III'
				end as kodemataanggaran,
				case 
					when kodemataanggaran ilike 'I.A.%' then sum(subtotal)
					when kodemataanggaran ilike 'I.B.%' then sum(subtotal)
					when kodemataanggaran ilike 'II.%' then sum(subtotal)
					when kodemataanggaran ilike 'III.%' then sum(subtotal)
				end as subtotal
				from(
							select ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran, kb.keteranganbelanja, sum(kb.subtotal) subtotal
							from kegiatananggaran_m km
							inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
							left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
							inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
							inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
							inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
							and 
							case 
								when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) = 5
								when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) = 4
								when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) = 5
							end
							inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
							where km.kdprofile = 30 and km.statusenabled = true
                            and kms.kdprofile = 30 and kms.statusenabled = true
                            and kmss.kdprofile = 30 and kmss.statusenabled = true
                            and ma.kdprofile = 30 and ma.statusenabled = true
                            and mat.kdprofile = 30 and mat.statusenabled = true
                            and kb.kdprofile = 30 and kb.statusenabled = true
							$qtahap
							and km.tahun = '$tahun'
							group by ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran, kb.keteranganbelanja
				) as x group by id, tahap, kodemataanggaran
			) as y group by id, tahap, kodemataanggaran

			union all

			select ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran keterangan, sum(kb.subtotal) subtotal
			from kegiatananggaran_m km
			inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
			left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
			inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
			inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
			inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
			and 
			case 
				when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) = 5
				when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) = 4
				when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) = 5
			end
			inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
			where km.kdprofile = 30 and km.statusenabled = true
			$qtahap
			and km.tahun = '$tahun'
            and kms.kdprofile = 30 and kms.statusenabled = true
            and kmss.kdprofile = 30 and kmss.statusenabled = true
            and ma.kdprofile = 30 and ma.statusenabled = true
            and mat.kdprofile = 30 and mat.statusenabled = true
            and kb.kdprofile = 30 and kb.statusenabled = true
			group by ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran
        ) as p on o.kodemataanggaran = p.kodemataanggaran 
        group by o.kodemataanggaran, o.namamataanggaran, p.subtotal, p.tahap
        order by o.kodemataanggaran"));

        $jumlah = DB::select(DB::raw("select sum(subtotal) totalawalsebelum from(
                        select id, tahap,
                        case 
                            when kodemataanggaran = 'A' then 'I.A'
                            when kodemataanggaran = 'B' then 'I.B'
                            when kodemataanggaran = 'II' then 'II'
                            when kodemataanggaran = 'III' then 'III'
                        end as kodemataanggaran,
                        case 
                            when kodemataanggaran = 'A' then 'BIAYA PELAYANAN '
                            when kodemataanggaran = 'B' then 'BIAYA UMUM DAN ADMINISTRASI'
                            when kodemataanggaran = 'II' then 'BIAYA NON OPERASIONAL'
                            when kodemataanggaran = 'III' then 'BIAYA PENGELUARAN INVESTASI'
                        end as keterangan,
                        case 
                            when kodemataanggaran = 'A' then sum(subtotal)
                            when kodemataanggaran = 'B' then sum(subtotal)
                            when kodemataanggaran = 'II' then sum(subtotal)
                            when kodemataanggaran = 'III' then sum(subtotal)
                        end as subtotal
                        from(
                            select id, tahap,
                            case 
                                when kodemataanggaran ilike 'I.A.%' then 'A'
                                when kodemataanggaran ilike 'I.B.%' then 'B'
                                when kodemataanggaran ilike 'II.%' then 'II'
                                when kodemataanggaran ilike 'III.%' then 'III'
                            end as kodemataanggaran,
                            case 
                                when kodemataanggaran ilike 'I.A.%' then sum(subtotal)
                                when kodemataanggaran ilike 'I.B.%' then sum(subtotal)
                                when kodemataanggaran ilike 'II.%' then sum(subtotal)
                                when kodemataanggaran ilike 'III.%' then sum(subtotal)
                            end as subtotal
                            from(
                                        select ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran, kb.keteranganbelanja, sum(kb.subtotal) subtotal
                                        from kegiatananggaran_m km
                                        inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
                                        left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
                                        inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
                                        inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
                                        inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
                                        and 
                                        case 
                                            when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) = 5
                                            when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) = 4
                                            when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) = 5
                                        end
                                        inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
                                        where km.kdprofile = 30 and km.statusenabled = true
                                        and kms.kdprofile = 30 and kms.statusenabled = true
                                        and kmss.kdprofile = 30 and kmss.statusenabled = true
                                        and ma.kdprofile = 30 and ma.statusenabled = true
                                        and mat.kdprofile = 30 and mat.statusenabled = true
                                        and kb.kdprofile = 30 and kb.statusenabled = true
                                        $qtahap
                                        and km.tahun = '$tahun'
                                        group by ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran, kb.keteranganbelanja
                            ) as x group by id, tahap, kodemataanggaran
                        ) as y where y.kodemataanggaran not in('II', 'III') group by id, tahap, kodemataanggaran
            )  as i"));

        $result = array(
            'data' => $sebelum,
            'message' => '@epic',
        );

        $pageWidth = 1200;
        return view('report.spj.cetakrekaptotalanggaran',compact('sebelum','pageWidth', 'jumlah', 'itahap', 'tanggalcetak'));
    }

    public function CetakRekapTotalAnggaranSebelumSesudah(Request $request){
        $tahun = $request['tahun'];
        $tahap = $request['tahap'];
        $tanggalcetak = $this->tanggal_indonesia(date('Y-m-d',strtotime($request['tglcetak']))); 

        $qtahap  = '';
        if (isset($request['tahap']) && $request['tahap'] != "" && $request['tahap'] != "undefined") {
            $qtahap =  ' and kb.objecttahapfk =  ' . $request['tahap'];
        }

        $qterhadap  = '';
        if (isset($request['terhadap']) && $request['terhadap'] != "" && $request['terhadap'] != "undefined") {
            $qterhadap =  ' and kb.objecttahapfk =  ' . $request['terhadap'];
        }

        $itahap = DB::select(DB::raw("select id, tahap from tahapanggaran_m where id = $tahap"));

        $sebelum = DB::select(DB::raw("SELECT o.*, p.subtotal, p.subtotalsetelah, p.tahap
        from
        (
            select kodemataanggaran, namamataanggaran from mataanggaran_m WHERE
            case 
                when kodemataanggaran ilike 'I%' then (char_length(kodemataanggaran) = 5 or char_length(kodemataanggaran) = 3)
                when kodemataanggaran ilike 'II%' then (char_length(kodemataanggaran) = 4 or char_length(kodemataanggaran) = 2)
                when kodemataanggaran ilike 'III%' then (char_length(kodemataanggaran) = 5 or char_length(kodemataanggaran) = 3)
            end
        ) as o
        left join
        (
			select s.*, t.subtotal as subtotalsetelah
			from(
					select id, tahap,
					case 
						when kodemataanggaran = 'A' then 'I.A'
						when kodemataanggaran = 'B' then 'I.B'
						when kodemataanggaran = 'II' then 'II'
						when kodemataanggaran = 'III' then 'III'
					end as kodemataanggaran,
					case 
						when kodemataanggaran = 'A' then 'BIAYA PELAYANAN '
						when kodemataanggaran = 'B' then 'BIAYA UMUM DAN ADMINISTRASI'
						when kodemataanggaran = 'II' then 'BIAYA NON OPERASIONAL'
						when kodemataanggaran = 'III' then 'BIAYA PENGELUARAN INVESTASI'
					end as keterangan,
					case 
						when kodemataanggaran = 'A' then sum(subtotal)
						when kodemataanggaran = 'B' then sum(subtotal)
						when kodemataanggaran = 'II' then sum(subtotal)
						when kodemataanggaran = 'III' then sum(subtotal)
					end as subtotal
					from(
						select id, tahap,
						case 
							when kodemataanggaran ilike 'I.A.%' then 'A'
							when kodemataanggaran ilike 'I.B.%' then 'B'
							when kodemataanggaran ilike 'II.%' then 'II'
							when kodemataanggaran ilike 'III.%' then 'III'
						end as kodemataanggaran,
						case 
							when kodemataanggaran ilike 'I.A.%' then sum(subtotal)
							when kodemataanggaran ilike 'I.B.%' then sum(subtotal)
							when kodemataanggaran ilike 'II.%' then sum(subtotal)
							when kodemataanggaran ilike 'III.%' then sum(subtotal)
						end as subtotal
						from(
									select ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran, kb.keteranganbelanja, sum(kb.subtotal) subtotal
									from kegiatananggaran_m km
									inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
									left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
									inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
									inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
									inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
									and 
									case 
										when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) = 5
										when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) = 4
										when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) = 5
									end
									inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
									where km.kdprofile = 30 and km.statusenabled = true
																and kms.kdprofile = 30 and kms.statusenabled = true
																and kmss.kdprofile = 30 and kmss.statusenabled = true
																and ma.kdprofile = 30 and ma.statusenabled = true
																and mat.kdprofile = 30 and mat.statusenabled = true
																and kb.kdprofile = 30 and kb.statusenabled = true
                                                                $qtahap
									and km.tahun = '$tahun'
									and ma.id in(
											select ma.id
											from kegiatananggaran_m km
											inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
											left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
											inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
											inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
											inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
											and 
											case 
												when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) = 5
												when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) = 4
												when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) = 5
											end
											inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
											where km.kdprofile = 30 and km.statusenabled = true
																		and kms.kdprofile = 30 and kms.statusenabled = true
																		and kmss.kdprofile = 30 and kmss.statusenabled = true
																		and ma.kdprofile = 30 and ma.statusenabled = true
																		and mat.kdprofile = 30 and mat.statusenabled = true
																		and kb.kdprofile = 30 and kb.statusenabled = true
                                                                        $qterhadap
											and km.tahun = '$tahun'
											group by ma.id
									)
									group by ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran, kb.keteranganbelanja
						) as x group by id, tahap, kodemataanggaran
					) as y group by id, tahap, kodemataanggaran

					union all

					select ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran keterangan, sum(kb.subtotal) subtotal
					from kegiatananggaran_m km
					inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
					left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
					inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
					inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
					inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
					and 
					case 
						when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) = 5
						when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) = 4
						when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) = 5
					end
					inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
					where km.kdprofile = 30 and km.statusenabled = true
					$qtahap
					and km.tahun = '$tahun'
								and kms.kdprofile = 30 and kms.statusenabled = true
								and kmss.kdprofile = 30 and kmss.statusenabled = true
								and ma.kdprofile = 30 and ma.statusenabled = true
								and mat.kdprofile = 30 and mat.statusenabled = true
								and kb.kdprofile = 30 and kb.statusenabled = true
					and ma.id in (
							select ma.id
							from kegiatananggaran_m km
							inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
							left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
							inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
							inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
							inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
							and 
							case 
								when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) = 5
								when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) = 4
								when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) = 5
							end
							inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
							where km.kdprofile = 30 and km.statusenabled = true
							$qterhadap
							and km.tahun = '$tahun'
							and kms.kdprofile = 30 and kms.statusenabled = true
							and kmss.kdprofile = 30 and kmss.statusenabled = true
							and ma.kdprofile = 30 and ma.statusenabled = true
							and mat.kdprofile = 30 and mat.statusenabled = true
							and kb.kdprofile = 30 and kb.statusenabled = true
							group by ma.id
					)
					group by ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran
			) as s inner join(
					select id, tahap,
					case 
						when kodemataanggaran = 'A' then 'I.A'
						when kodemataanggaran = 'B' then 'I.B'
						when kodemataanggaran = 'II' then 'II'
						when kodemataanggaran = 'III' then 'III'
					end as kodemataanggaran,
					case 
						when kodemataanggaran = 'A' then 'BIAYA PELAYANAN '
						when kodemataanggaran = 'B' then 'BIAYA UMUM DAN ADMINISTRASI'
						when kodemataanggaran = 'II' then 'BIAYA NON OPERASIONAL'
						when kodemataanggaran = 'III' then 'BIAYA PENGELUARAN INVESTASI'
					end as keterangan,
					case 
						when kodemataanggaran = 'A' then sum(subtotal)
						when kodemataanggaran = 'B' then sum(subtotal)
						when kodemataanggaran = 'II' then sum(subtotal)
						when kodemataanggaran = 'III' then sum(subtotal)
					end as subtotal
					from(
						select id, tahap,
						case 
							when kodemataanggaran ilike 'I.A.%' then 'A'
							when kodemataanggaran ilike 'I.B.%' then 'B'
							when kodemataanggaran ilike 'II.%' then 'II'
							when kodemataanggaran ilike 'III.%' then 'III'
						end as kodemataanggaran,
						case 
							when kodemataanggaran ilike 'I.A.%' then sum(subtotal)
							when kodemataanggaran ilike 'I.B.%' then sum(subtotal)
							when kodemataanggaran ilike 'II.%' then sum(subtotal)
							when kodemataanggaran ilike 'III.%' then sum(subtotal)
						end as subtotal
						from(
									select ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran, kb.keteranganbelanja, sum(kb.subtotal) subtotal
									from kegiatananggaran_m km
									inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
									left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
									inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
									inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
									inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
									and 
									case 
										when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) = 5
										when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) = 4
										when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) = 5
									end
									inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
									where km.kdprofile = 30 and km.statusenabled = true
																and kms.kdprofile = 30 and kms.statusenabled = true
																and kmss.kdprofile = 30 and kmss.statusenabled = true
																and ma.kdprofile = 30 and ma.statusenabled = true
																and mat.kdprofile = 30 and mat.statusenabled = true
																and kb.kdprofile = 30 and kb.statusenabled = true
                                                                $qterhadap
									and km.tahun = '$tahun'
									and ma.id in(
											select ma.id
											from kegiatananggaran_m km
											inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
											left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
											inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
											inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
											inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
											and 
											case 
												when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) = 5
												when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) = 4
												when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) = 5
											end
											inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
											where km.kdprofile = 30 and km.statusenabled = true
																		and kms.kdprofile = 30 and kms.statusenabled = true
																		and kmss.kdprofile = 30 and kmss.statusenabled = true
																		and ma.kdprofile = 30 and ma.statusenabled = true
																		and mat.kdprofile = 30 and mat.statusenabled = true
																		and kb.kdprofile = 30 and kb.statusenabled = true
                                                                        $qtahap
											and km.tahun = '$tahun'
											group by ma.id
									)
									group by ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran, kb.keteranganbelanja
						) as x group by id, tahap, kodemataanggaran
					) as y group by id, tahap, kodemataanggaran

					union all

					select ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran keterangan, sum(kb.subtotal) subtotal
					from kegiatananggaran_m km
					inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
					left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
					inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
					inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
					inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
					and 
					case 
						when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) = 5
						when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) = 4
						when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) = 5
					end
					inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
					where km.kdprofile = 30 and km.statusenabled = true
					$qterhadap
					and km.tahun = '$tahun'
								and kms.kdprofile = 30 and kms.statusenabled = true
								and kmss.kdprofile = 30 and kmss.statusenabled = true
								and ma.kdprofile = 30 and ma.statusenabled = true
								and mat.kdprofile = 30 and mat.statusenabled = true
								and kb.kdprofile = 30 and kb.statusenabled = true
					and ma.id in (
							select ma.id
							from kegiatananggaran_m km
							inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
							left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
							inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
							inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
							inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
							and 
							case 
								when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) = 5
								when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) = 4
								when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) = 5
							end
							inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
							where km.kdprofile = 30 and km.statusenabled = true
                            $qtahap
							and km.tahun = '$tahun'
							and kms.kdprofile = 30 and kms.statusenabled = true
							and kmss.kdprofile = 30 and kmss.statusenabled = true
							and ma.kdprofile = 30 and ma.statusenabled = true
							and mat.kdprofile = 30 and mat.statusenabled = true
							and kb.kdprofile = 30 and kb.statusenabled = true
							group by ma.id
					)
					group by ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran
			) as t on s.kodemataanggaran = t.kodemataanggaran
        ) as p on o.kodemataanggaran = p.kodemataanggaran 
        group by o.kodemataanggaran, o.namamataanggaran, p.subtotal, p.subtotalsetelah, p.tahap
        order by o.kodemataanggaran"));

        $jumlah = DB::select(DB::raw("select sum(subtotal) totalawalsebelum, sum(subtotalsetelah) totalawalsetelah from(
            select s.*, t.subtotal subtotalsetelah 
            from(
            select id, tahap,
            case 
            when kodemataanggaran = 'A' then 'I.A'
            when kodemataanggaran = 'B' then 'I.B'
            when kodemataanggaran = 'II' then 'II'
            when kodemataanggaran = 'III' then 'III'
            end as kodemataanggaran,
            case 
            when kodemataanggaran = 'A' then 'BIAYA PELAYANAN '
            when kodemataanggaran = 'B' then 'BIAYA UMUM DAN ADMINISTRASI'
            when kodemataanggaran = 'II' then 'BIAYA NON OPERASIONAL'
            when kodemataanggaran = 'III' then 'BIAYA PENGELUARAN INVESTASI'
            end as keterangan,
            case 
            when kodemataanggaran = 'A' then sum(subtotal)
            when kodemataanggaran = 'B' then sum(subtotal)
            when kodemataanggaran = 'II' then sum(subtotal)
            when kodemataanggaran = 'III' then sum(subtotal)
            end as subtotal
            from(
            select id, tahap,
            case 
                when kodemataanggaran ilike 'I.A.%' then 'A'
                when kodemataanggaran ilike 'I.B.%' then 'B'
                when kodemataanggaran ilike 'II.%' then 'II'
                when kodemataanggaran ilike 'III.%' then 'III'
            end as kodemataanggaran,
            case 
                when kodemataanggaran ilike 'I.A.%' then sum(subtotal)
                when kodemataanggaran ilike 'I.B.%' then sum(subtotal)
                when kodemataanggaran ilike 'II.%' then sum(subtotal)
                when kodemataanggaran ilike 'III.%' then sum(subtotal)
            end as subtotal
            from(
            select ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran, kb.keteranganbelanja, sum(kb.subtotal) subtotal
            from kegiatananggaran_m km
            inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
            left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
            inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
            inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
            inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
            and 
            case 
                when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) = 5
                when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) = 4
                when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) = 5
            end
            inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
            where km.kdprofile = 30 and km.statusenabled = true
            and kms.kdprofile = 30 and kms.statusenabled = true
            and kmss.kdprofile = 30 and kmss.statusenabled = true
            and ma.kdprofile = 30 and ma.statusenabled = true
            and mat.kdprofile = 30 and mat.statusenabled = true
            and kb.kdprofile = 30 and kb.statusenabled = true
            $qtahap
                                                    and km.tahun = '$tahun'
                                                    and ma.id in(
                                                            select ma.id
                                                            from kegiatananggaran_m km
                                                            inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
                                                            left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
                                                            inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
                                                            inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
                                                            inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
                                                            and 
                                                            case 
                                                                    when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) = 5
                                                                    when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) = 4
                                                                    when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) = 5
                                                            end
                                                            inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
                                                            where km.kdprofile = 30 and km.statusenabled = true
                                                            and kms.kdprofile = 30 and kms.statusenabled = true
                                                            and kmss.kdprofile = 30 and kmss.statusenabled = true
                                                            and ma.kdprofile = 30 and ma.statusenabled = true
                                                            and mat.kdprofile = 30 and mat.statusenabled = true
                                                            and kb.kdprofile = 30 and kb.statusenabled = true
                                                            $qterhadap
                                                            and km.tahun = '$tahun'
                                                            group by ma.id
                                                    )
            group by ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran, kb.keteranganbelanja
            ) as x group by id, tahap, kodemataanggaran
            ) as y where y.kodemataanggaran not in('II', 'III') group by id, tahap, kodemataanggaran
                        ) as s inner join(
                                select id, tahap,
            case 
            when kodemataanggaran = 'A' then 'I.A'
            when kodemataanggaran = 'B' then 'I.B'
            when kodemataanggaran = 'II' then 'II'
            when kodemataanggaran = 'III' then 'III'
            end as kodemataanggaran,
            case 
            when kodemataanggaran = 'A' then 'BIAYA PELAYANAN '
            when kodemataanggaran = 'B' then 'BIAYA UMUM DAN ADMINISTRASI'
            when kodemataanggaran = 'II' then 'BIAYA NON OPERASIONAL'
            when kodemataanggaran = 'III' then 'BIAYA PENGELUARAN INVESTASI'
            end as keterangan,
            case 
            when kodemataanggaran = 'A' then sum(subtotal)
            when kodemataanggaran = 'B' then sum(subtotal)
            when kodemataanggaran = 'II' then sum(subtotal)
            when kodemataanggaran = 'III' then sum(subtotal)
            end as subtotal
            from(
            select id, tahap,
            case 
                when kodemataanggaran ilike 'I.A.%' then 'A'
                when kodemataanggaran ilike 'I.B.%' then 'B'
                when kodemataanggaran ilike 'II.%' then 'II'
                when kodemataanggaran ilike 'III.%' then 'III'
            end as kodemataanggaran,
            case 
                when kodemataanggaran ilike 'I.A.%' then sum(subtotal)
                when kodemataanggaran ilike 'I.B.%' then sum(subtotal)
                when kodemataanggaran ilike 'II.%' then sum(subtotal)
                when kodemataanggaran ilike 'III.%' then sum(subtotal)
            end as subtotal
            from(
            select ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran, kb.keteranganbelanja, sum(kb.subtotal) subtotal
            from kegiatananggaran_m km
            inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
            left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
            inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
            inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
            inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
            and 
            case 
                when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) = 5
                when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) = 4
                when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) = 5
            end
            inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
            where km.kdprofile = 30 and km.statusenabled = true
            and kms.kdprofile = 30 and kms.statusenabled = true
            and kmss.kdprofile = 30 and kmss.statusenabled = true
            and ma.kdprofile = 30 and ma.statusenabled = true
            and mat.kdprofile = 30 and mat.statusenabled = true
            and kb.kdprofile = 30 and kb.statusenabled = true
            $qterhadap
                                                    and km.tahun = '$tahun'
                                                    and ma.id in(
                                                            select ma.id
                                                            from kegiatananggaran_m km
                                                            inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
                                                            left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
                                                            inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
                                                            inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
                                                            inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
                                                            and 
                                                            case 
                                                                    when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) = 5
                                                                    when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) = 4
                                                                    when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) = 5
                                                            end
                                                            inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
                                                            where km.kdprofile = 30 and km.statusenabled = true
                                                            and kms.kdprofile = 30 and kms.statusenabled = true
                                                            and kmss.kdprofile = 30 and kmss.statusenabled = true
                                                            and ma.kdprofile = 30 and ma.statusenabled = true
                                                            and mat.kdprofile = 30 and mat.statusenabled = true
                                                            and kb.kdprofile = 30 and kb.statusenabled = true
                                                            $qtahap
                                                            and km.tahun = '$tahun'
                                                            group by ma.id
                                                    )
            group by ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran, kb.keteranganbelanja
        ) as x group by id, tahap, kodemataanggaran
        ) as y where y.kodemataanggaran not in('II', 'III') group by id, tahap, kodemataanggaran
                    ) as t on s.kodemataanggaran = t.kodemataanggaran
        )  as i"));

        $result = array(
            'data' => $sebelum,
            'message' => '@epic',
        );

        $pageWidth = 1200;
        return view('report.spj.cetakrekaptotalanggaransebelumsesudah',compact('sebelum','pageWidth', 'jumlah', 'itahap', 'tanggalcetak'));
    }

    public function CetakRBADetail(Request $request){
        $tahun = $request['tahun'];
        $tahap = $request['tahap'];

        $tanggalcetak = $this->tanggal_indonesia(date('Y-m-d',strtotime($request['tglcetak'])));

        $qtahap  = '';
        if (isset($request['tahap']) && $request['tahap'] != "" && $request['tahap'] != "undefined") {
            $qtahap =  ' and kb.objecttahapfk =  ' . $request['tahap'];
        }

        $itahap = DB::select(DB::raw("select id, tahap from tahapanggaran_m where id = $tahap"));

        $qsubsubkegiatan  = '';
        $subsubkegiatan  = '';
        if (isset($request['subsubkegiatan']) && $request['subsubkegiatan'] != "" && $request['subsubkegiatan'] != "undefined") {
            $qsubsubkegiatan =  ' and km.id =  ' . $request['subsubkegiatan'];
            $subsubkegiatan =  ' and dp.id =  ' . $request['subsubkegiatan'];
        }

        $data = DB::select(DB::raw("select dp.tahun, dp.kode kodesubsubkegiatan, dp.keterangan keterangansubsubkegiatan,
        dp0.kode kodesubkegiatan, dp0.keterangan keterangansubkegiatan,
        dp3.kode kodekegiatan, dp3.keterangan keterangankegiatan,
        dp2.kode kodeprogram, dp2.keterangan keteranganprogram,
        dp1.kode kodeurusan, dp1.keterangan keteranganurusan, 
        dp.indikatormasuk, dp.indikatorkeluaran, dp.indikatorhasil, dp.targetmasuk, dp.targetkeluaran, dp.targethasil
        from kegiatananggaran_m as dp 
        inner join keteranganbelanja_t as kb on kb.objectkegiatanfk = dp.id 
        and kb.kdprofile = 30 and kb.statusenabled = true 
        inner join kegiatananggaran_m as dp3 on dp.kode ilike dp3.kode || '%' and dp3.div = 2
        and dp3.kdprofile = 30 and dp3.statusenabled = true 
        inner join kegiatananggaran_m as dp2 on dp3.kode ilike dp2.kode || '%' and dp2.div = 1
        and dp2.kdprofile = 30 and dp2.statusenabled = true 
        inner join kegiatananggaran_m as dp1 on dp2.kode ilike dp1.kode || '%' and dp1.div = 0
        and dp1.kdprofile = 30 and dp1.statusenabled = true 
        inner join kegiatananggaran_m as dp0 on dp.kode ilike dp0.kode || '%' and dp0.div = 3
        and dp0.kdprofile = 30 and dp0.statusenabled = true 
        where dp.tahun = '$tahun'
        $subsubkegiatan
        group by dp.tahun, dp.kode, dp.keterangan,
        dp0.kode, dp0.keterangan,
        dp3.kode, dp3.keterangan,
        dp2.kode, dp2.keterangan,
        dp1.kode, dp1.keterangan, 
        dp.indikatormasuk, dp.indikatorkeluaran, dp.indikatorhasil, dp.targetmasuk, dp.targetkeluaran, dp.targethasil"));     

        $sebelum = DB::select(DB::raw("
        select 
        case 
            when kodemataanggaran = 'A' then 'I.A'
            when kodemataanggaran = 'B' then 'I.B'
        end as kodemataanggaran,
        case 
            when kodemataanggaran = 'A' then 'BIAYA PELAYANAN '
            when kodemataanggaran = 'B' then 'BIAYA UMUM DAN ADMINISTRASI'
        end as keterangan,
				id, tahap, jml, satuan, hargasatuan,
        case 
            when kodemataanggaran = 'A' then sum(subtotaljasalayanan)
            when kodemataanggaran = 'B' then sum(subtotaljasalayanan)
        end as subtotaljasalayanan,
				case 
            when kodemataanggaran = 'A' then sum(subtotalapbd)
            when kodemataanggaran = 'B' then sum(subtotalapbd)
        end as subtotalapbd
        from(
            select id, tahap, jml, satuan, hargasatuan,
            case 
                when kodemataanggaran ilike 'I.A.%' then 'A'
                when kodemataanggaran ilike 'I.B.%' then 'B'
            end as kodemataanggaran,
            case 
                when kodemataanggaran ilike 'I.A.%' then sum(subtotaljasalayanan)
                when kodemataanggaran ilike 'I.B.%' then sum(subtotaljasalayanan)
            end as subtotaljasalayanan,
						case 
                when kodemataanggaran ilike 'I.A.%' then sum(subtotalapbd)
                when kodemataanggaran ilike 'I.B.%' then sum(subtotalapbd)
            end as subtotalapbd
            from(
                        select ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran, kb.keteranganbelanja, 0 jml, '' satuan, 0 hargasatuan, 
						case when ap.id = 18 then sum(kb.subtotal) else 0 end as subtotaljasalayanan,
						case when ap.id = 15 then sum(kb.subtotal) else 0 end as subtotalapbd
                        from kegiatananggaran_m km
                        inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
                        left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
                        inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
                        inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
                        inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
                        inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
                        and 
                        case 
                            when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) = 5
                            when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) = 4
                            when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) = 5
                        end
                        inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
                        where km.kdprofile = 30 and km.statusenabled = true
                        and kms.kdprofile = 30 and kms.statusenabled = true
                        and kmss.kdprofile = 30 and kmss.statusenabled = true
                        and ma.kdprofile = 30 and ma.statusenabled = true
                        and mat.kdprofile = 30 and mat.statusenabled = true
                        and kb.kdprofile = 30 and kb.statusenabled = true
                        $qtahap
                        $qsubsubkegiatan
                        and km.tahun = '$tahun'
                        group by ap.id, ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran, kb.keteranganbelanja
            ) as x group by id, tahap, jml, satuan, hargasatuan, kodemataanggaran
        ) as y where kodemataanggaran is not null 
        group by id, tahap, jml, satuan, hargasatuan, kodemataanggaran

        union all

        select kodemataanggaran, keterangan, id, tahap, jml, satuan, hargasatuan, sum(subtotaljasalayanan) subtotaljasalayanan,
				sum(subtotalapbd) subtotalapbd
				from(
					select mat.kodemataanggaran, mat.namamataanggaran keterangan,ta.id, ta.tahap, 0 jml, '' satuan, 0 hargasatuan, 
					case when ap.id = 18 then sum(kb.subtotal) else 0 end as subtotaljasalayanan,
					case when ap.id = 15 then sum(kb.subtotal) else 0 end as subtotalapbd
					from kegiatananggaran_m km
					inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
					left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
					inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
					inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
					inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
					inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
					and 
					case 
							when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) in(5,6)
							when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) in(6,7)
							when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) in(7,8)
					end
					inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
					where km.kdprofile = 30 and km.statusenabled = true
					$qtahap
                    $qsubsubkegiatan
                    and km.tahun = '$tahun'
					and kms.kdprofile = 30 and kms.statusenabled = true
					and kmss.kdprofile = 30 and kmss.statusenabled = true
					and ma.kdprofile = 30 and ma.statusenabled = true
					and mat.kdprofile = 30 and mat.statusenabled = true
					and kb.kdprofile = 30 and kb.statusenabled = true
					group by ap.id, ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran
				) as x group by kodemataanggaran, keterangan, id, tahap, jml, satuan, hargasatuan

        union all
				
				select kodemataanggaran, keterangan, id, tahap, jml, satuan, hargasatuan, sum(subtotaljasalayanan) subtotaljasalayanan,
				sum(subtotalapbd) subtotalapbd
				from(
					select mat.kodemataanggaran, mat.namamataanggaran keterangan, ta.id, ta.tahap, 0 jml, '' satuan, 0 hargasatuan, 
					case when ap.id = 18 then sum(kb.subtotal) else 0 end as subtotaljasalayanan,
					case when ap.id = 15 then sum(kb.subtotal) else 0 end as subtotalapbd
					from kegiatananggaran_m km
					inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
					left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
					inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
					inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
					inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
					inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '.' || '%'
					and 
					case 
							when mat.kodemataanggaran = 'I' then char_length(mat.kodemataanggaran) = 1
							when mat.kodemataanggaran = 'II' then char_length(mat.kodemataanggaran) = 2
							when mat.kodemataanggaran = 'III' then char_length(mat.kodemataanggaran) = 3
					end
					inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
					where km.kdprofile = 30 and km.statusenabled = true
					$qtahap
                    $qsubsubkegiatan
                    and km.tahun = '$tahun'
					and kms.kdprofile = 30 and kms.statusenabled = true
					and kmss.kdprofile = 30 and kmss.statusenabled = true
					and ma.kdprofile = 30 and ma.statusenabled = true
					and mat.kdprofile = 30 and mat.statusenabled = true
					and kb.kdprofile = 30 and kb.statusenabled = true
					group by ap.id, ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran
				) as x group by kodemataanggaran, keterangan, id, tahap, jml, satuan, hargasatuan

        union all

        select ma.kodemataanggaran, ma.namamataanggaran keterangan, ta.id, ta.tahap, 0 jml, '' satuan, 0 hargasatuan, 
				case when ap.id = 18 then sum(kb.subtotal) else 0 end as subtotaljasalayanan,
				case when ap.id = 15 then sum(kb.subtotal) else 0 end as subtotalapbd
        from kegiatananggaran_m km
        inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
        left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
        inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
        inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
        inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
        inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
        and 
        case 
            when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) = 5
            when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) = 4
            when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) = 5
        end
        inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
        where km.kdprofile = 30 and km.statusenabled = true
        $qtahap
        $qsubsubkegiatan
        and km.tahun = '$tahun'
        and kms.kdprofile = 30 and kms.statusenabled = true
        and kmss.kdprofile = 30 and kmss.statusenabled = true
        and ma.kdprofile = 30 and ma.statusenabled = true
        and mat.kdprofile = 30 and mat.statusenabled = true
        and kb.kdprofile = 30 and kb.statusenabled = true
        group by ap.id, ta.id, ta.tahap, ma.kodemataanggaran, ma.namamataanggaran

				union ALL

				select ma.kodemataanggaran, kb.keteranganbelanja keterangan, ta.id, ta.tahap, kb.jml, kb.satuan, kb.hargasatuan,  
				case when ap.id = 18 then sum(kb.subtotal) else 0 end as subtotaljasalayanan,
				case when ap.id = 15 then sum(kb.subtotal) else 0 end as subtotalapbd
        from kegiatananggaran_m km
        inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
        left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
        inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
        inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
        inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
        inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
        and 
        case 
            when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) = 5
            when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) = 4
            when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) = 5
        end
        inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
        where km.kdprofile = 30 and km.statusenabled = true
        $qtahap
        $qsubsubkegiatan
        and km.tahun = '$tahun'
        and kms.kdprofile = 30 and kms.statusenabled = true
        and kmss.kdprofile = 30 and kmss.statusenabled = true
        and ma.kdprofile = 30 and ma.statusenabled = true
        and mat.kdprofile = 30 and mat.statusenabled = true
        and kb.kdprofile = 30 and kb.statusenabled = true
        group by ap.id, ta.id, ta.tahap, kb.jml, kb.satuan, kb.hargasatuan, kb.keteranganbelanja, ma.kodemataanggaran
        

		order by kodemataanggaran, jml, hargasatuan, satuan;
        "));

        $pageWidth = 1200;
        return view('report.spj.cetakrbadetail',compact('sebelum','pageWidth', 'data', 'itahap', 'tanggalcetak'));
    }

    public function CetakPendapatanPerubahan(Request $request){
        $tahun = $request['tahun'];
        $tanggalcetak = $this->tanggal_indonesia(date('Y-m-d',strtotime($request['tglcetak'])));    

        $qperubahan  = '';
        if (isset($request['perubahan']) && $request['perubahan'] != "" && $request['perubahan'] != "undefined" && $request['perubahan'] == 1) {
            $qperubahan =  ' and rp.isperubahan = true ';
        }
        if (isset($request['perubahan']) && $request['perubahan'] != "" && $request['perubahan'] != "undefined" && $request['perubahan'] == 2) {
            $qperubahan =  ' and rp.isperubahan = false ';
        }

        $data = DB::select(DB::raw("select 0 AS nourut, 'juga' bold, ap.namaexternal, 0 as jumlah, '' keterangan
        from asalproduk_m as ap 
        left join rincianpendapatan_t as rp on ap.id = rp.objectasalprodukfk
        and rp.kdprofile = 30
        and rp.statusenabled = true
        left join uraianpendapatan_m as up on up.id = rp.objecturaianpendapatanfk
        and up.kdprofile = 30
        and up.statusenabled = true
        where ap.kdprofile = 30
        and ap.statusenabled = true
        and rp.norec is null
    
        union all
    
        select RANK ( ) OVER ( order by ap.namaexternal ) AS nourut, 'iya' bold, ap.namaexternal, sum(rp.jumlahpendapatan) as jumlah, '' keterangan
        from rincianpendapatan_t as rp
        inner join asalproduk_m as ap on ap.id = rp.objectasalprodukfk
        inner join uraianpendapatan_m as up on up.id = rp.objecturaianpendapatanfk
        where rp.kdprofile = 30
        and rp.statusenabled = true
        and ap.kdprofile = 30
        and ap.statusenabled = true
        and up.kdprofile = 30
        and up.statusenabled = true
        and rp.tahun = '$tahun'
        $qperubahan
        group by ap.namaexternal
    
        union all
    
        select RANK ( ) OVER ( order by ap.namaexternal ) AS nourut, 'tidak' bold, rp.uraianpendapatan namaexternal, rp.jumlahpendapatan jumlah, rp.keterangan
        from rincianpendapatan_t as rp
        inner join asalproduk_m as ap on ap.id = rp.objectasalprodukfk
        inner join uraianpendapatan_m as up on up.id = rp.objecturaianpendapatanfk
        where rp.kdprofile = 30
        and rp.statusenabled = true
        and ap.kdprofile = 30
        and ap.statusenabled = true
        and up.kdprofile = 30
        and up.statusenabled = true
        and rp.tahun = '$tahun'
        $qperubahan
        order by nourut, bold"));     
    
        $pageWidth = 1200;
        return view('report.spj.cetakpendapatanperubahan',compact('pageWidth', 'data', 'tanggalcetak'));
    }

    public function CetakRBADetailSebelumSesudah(Request $request){
        $tahun = $request['tahun'];
        $tanggalcetak = $this->tanggal_indonesia(date('Y-m-d',strtotime($request['tglcetak'])));        

        $qtahap  = '';
        if (isset($request['tahap']) && $request['tahap'] != "" && $request['tahap'] != "undefined") {
            $qtahap =  ' and kb.objecttahapfk =  ' . $request['tahap'];
        }

        $qterhadap  = '';
        if (isset($request['terhadap']) && $request['terhadap'] != "" && $request['terhadap'] != "undefined") {
            $qterhadap =  ' and kb.objecttahapfk =  ' . $request['terhadap'];
        }

        $qsubsubkegiatan  = '';
        $subsubkegiatan  = '';
        if (isset($request['subsubkegiatan']) && $request['subsubkegiatan'] != "" && $request['subsubkegiatan'] != "undefined") {
            $qsubsubkegiatan =  ' and km.id =  ' . $request['subsubkegiatan'];
            $subsubkegiatan =  ' and dp.id =  ' . $request['subsubkegiatan'];
        }

        $qsama = '';
        if($request['terhadap'] == $request['tahap']){
            $qsama = 'and a.subtotaljasalayanan = b.subtotaljasalayanan
            and a.subtotalapbd = b.subtotalapbd
            and a.jml = b.jml
            and a.satuan = b.satuan
            and a.hargasatuan = b.hargasatuan';
        }
        

        $data = DB::select(DB::raw("select dp.tahun, dp.kode kodesubsubkegiatan, dp.keterangan keterangansubsubkegiatan,
        dp0.kode kodesubkegiatan, dp0.keterangan keterangansubkegiatan,
        dp3.kode kodekegiatan, dp3.keterangan keterangankegiatan,
        dp2.kode kodeprogram, dp2.keterangan keteranganprogram,
        dp1.kode kodeurusan, dp1.keterangan keteranganurusan, 
        dp.indikatormasuk, dp.indikatorkeluaran, dp.indikatorhasil, dp.targetmasuk, dp.targetkeluaran, dp.targethasil
        from kegiatananggaran_m as dp 
        inner join keteranganbelanja_t as kb on kb.objectkegiatanfk = dp.id 
        and kb.kdprofile = 30 and kb.statusenabled = true 
        inner join kegiatananggaran_m as dp3 on dp.kode ilike dp3.kode || '%' and dp3.div = 2
        and dp3.kdprofile = 30 and dp3.statusenabled = true 
        inner join kegiatananggaran_m as dp2 on dp3.kode ilike dp2.kode || '%' and dp2.div = 1
        and dp2.kdprofile = 30 and dp2.statusenabled = true 
        inner join kegiatananggaran_m as dp1 on dp2.kode ilike dp1.kode || '%' and dp1.div = 0
        and dp1.kdprofile = 30 and dp1.statusenabled = true 
        inner join kegiatananggaran_m as dp0 on dp.kode ilike dp0.kode || '%' and dp0.div = 3
        and dp0.kdprofile = 30 and dp0.statusenabled = true 
        where dp.tahun = '$tahun'
        $subsubkegiatan
        group by dp.tahun, dp.kode, dp.keterangan,
        dp0.kode, dp0.keterangan,
        dp3.kode, dp3.keterangan,
        dp2.kode, dp2.keterangan,
        dp1.kode, dp1.keterangan, 
        dp.indikatormasuk, dp.indikatorkeluaran, dp.indikatorhasil, dp.targetmasuk, dp.targetkeluaran, dp.targethasil"));     

        $sebelum = DB::select(DB::raw("
        select a.*, b.jml jmlsetelah, b.satuan satuansetelah, b.hargasatuan hargasatuansetelah,
        b.subtotaljasalayanan subtotaljasalayanansetelah, b.subtotalapbd subtotalapbdsetelah FROM
        (

		select 
        case 
            when kodemataanggaran = 'A' then 'I.A'
            when kodemataanggaran = 'B' then 'I.B'
        end as kodemataanggaran,
        case 
            when kodemataanggaran = 'A' then 'BIAYA PELAYANAN '
            when kodemataanggaran = 'B' then 'BIAYA UMUM DAN ADMINISTRASI'
        end as keterangan,
				id, tahap, jml, satuan, hargasatuan,
        case 
            when kodemataanggaran = 'A' then sum(subtotaljasalayanan)
            when kodemataanggaran = 'B' then sum(subtotaljasalayanan)
        end as subtotaljasalayanan,
				case 
            when kodemataanggaran = 'A' then sum(subtotalapbd)
            when kodemataanggaran = 'B' then sum(subtotalapbd)
        end as subtotalapbd
        from(
            select id, tahap, jml, satuan, hargasatuan,
            case 
                when kodemataanggaran ilike 'I.A.%' then 'A'
                when kodemataanggaran ilike 'I.B.%' then 'B'
            end as kodemataanggaran,
            case 
                when kodemataanggaran ilike 'I.A.%' then sum(subtotaljasalayanan)
                when kodemataanggaran ilike 'I.B.%' then sum(subtotaljasalayanan)
            end as subtotaljasalayanan,
						case 
                when kodemataanggaran ilike 'I.A.%' then sum(subtotalapbd)
                when kodemataanggaran ilike 'I.B.%' then sum(subtotalapbd)
            end as subtotalapbd
            from(
                        select ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran, kb.keteranganbelanja, 0 jml, '' satuan, 0 hargasatuan, 
												case when ap.id = 18 then sum(kb.subtotal) else 0 end as subtotaljasalayanan,
												case when ap.id = 15 then sum(kb.subtotal) else 0 end as subtotalapbd
                        from kegiatananggaran_m km
                        inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
                        left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
                        inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
                        inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
                        inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
                        inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
                        and 
                        case 
                            when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) = 5
                            when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) = 4
                            when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) = 5
                        end
                        inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
                        where km.kdprofile = 30 and km.statusenabled = true
                        and kms.kdprofile = 30 and kms.statusenabled = true
                        and kmss.kdprofile = 30 and kmss.statusenabled = true
                        and ma.kdprofile = 30 and ma.statusenabled = true
                        and mat.kdprofile = 30 and mat.statusenabled = true
                        and kb.kdprofile = 30 and kb.statusenabled = true
                        $qtahap
                        $qsubsubkegiatan
                        and km.tahun = '$tahun'
                        group by ap.id, ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran, kb.keteranganbelanja
            ) as x group by id, tahap, jml, satuan, hargasatuan, kodemataanggaran
        ) as y where kodemataanggaran is not null 
        group by id, tahap, jml, satuan, hargasatuan, kodemataanggaran

        union all
				
				select kodemataanggaran, keterangan, id, tahap, jml, satuan, hargasatuan, sum(subtotaljasalayanan) subtotaljasalayanan,
				sum(subtotalapbd) subtotalapbd
				from(
					select mat.kodemataanggaran, mat.namamataanggaran keterangan,ta.id, ta.tahap, 0 jml, '' satuan, 0 hargasatuan, 
					case when ap.id = 18 then sum(kb.subtotal) else 0 end as subtotaljasalayanan,
					case when ap.id = 15 then sum(kb.subtotal) else 0 end as subtotalapbd
					from kegiatananggaran_m km
					inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
					left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
					inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
					inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
					inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
					inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
					and 
					case 
							when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) in(5,6)
							when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) in(6,7)
							when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) in(7,8)
					end
					inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
					where km.kdprofile = 30 and km.statusenabled = true
					$qtahap
                    $qsubsubkegiatan
                    and km.tahun = '$tahun'
					and kms.kdprofile = 30 and kms.statusenabled = true
					and kmss.kdprofile = 30 and kmss.statusenabled = true
					and ma.kdprofile = 30 and ma.statusenabled = true
					and mat.kdprofile = 30 and mat.statusenabled = true
					and kb.kdprofile = 30 and kb.statusenabled = true
					group by ap.id, ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran
				) as x group by kodemataanggaran, keterangan, id, tahap, jml, satuan, hargasatuan

        union all
				
				select kodemataanggaran, keterangan, id, tahap, jml, satuan, hargasatuan, sum(subtotaljasalayanan) subtotaljasalayanan,
				sum(subtotalapbd) subtotalapbd
				from(
					select mat.kodemataanggaran, mat.namamataanggaran keterangan, ta.id, ta.tahap, 0 jml, '' satuan, 0 hargasatuan, 
					case when ap.id = 18 then sum(kb.subtotal) else 0 end as subtotaljasalayanan,
					case when ap.id = 15 then sum(kb.subtotal) else 0 end as subtotalapbd
					from kegiatananggaran_m km
					inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
					left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
					inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
					inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
					inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
					inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '.' || '%'
					and 
					case 
							when mat.kodemataanggaran = 'I' then char_length(mat.kodemataanggaran) = 1
							when mat.kodemataanggaran = 'II' then char_length(mat.kodemataanggaran) = 2
							when mat.kodemataanggaran = 'III' then char_length(mat.kodemataanggaran) = 3
					end
					inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
					where km.kdprofile = 30 and km.statusenabled = true
					$qtahap
                    $qsubsubkegiatan
                    and km.tahun = '$tahun'
					and kms.kdprofile = 30 and kms.statusenabled = true
					and kmss.kdprofile = 30 and kmss.statusenabled = true
					and ma.kdprofile = 30 and ma.statusenabled = true
					and mat.kdprofile = 30 and mat.statusenabled = true
					and kb.kdprofile = 30 and kb.statusenabled = true
					group by ap.id, ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran
				) as x group by kodemataanggaran, keterangan, id, tahap, jml, satuan, hargasatuan

        union all

        select ma.kodemataanggaran, ma.namamataanggaran keterangan, ta.id, ta.tahap, 0 jml, '' satuan, 0 hargasatuan, 
				case when ap.id = 18 then sum(kb.subtotal) else 0 end as subtotaljasalayanan,
				case when ap.id = 15 then sum(kb.subtotal) else 0 end as subtotalapbd
        from kegiatananggaran_m km
        inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
        left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
        inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
        inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
        inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
        inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
        and 
        case 
            when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) = 5
            when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) = 4
            when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) = 5
        end
        inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
        where km.kdprofile = 30 and km.statusenabled = true
        $qtahap
        $qsubsubkegiatan
        and km.tahun = '$tahun'
        and kms.kdprofile = 30 and kms.statusenabled = true
        and kmss.kdprofile = 30 and kmss.statusenabled = true
        and ma.kdprofile = 30 and ma.statusenabled = true
        and mat.kdprofile = 30 and mat.statusenabled = true
        and kb.kdprofile = 30 and kb.statusenabled = true
        group by ap.id, ta.id, ta.tahap, ma.kodemataanggaran, ma.namamataanggaran

				union ALL

				select ma.kodemataanggaran, kb.keteranganbelanja keterangan, ta.id, ta.tahap, kb.jml, kb.satuan, kb.hargasatuan,  
				case when ap.id = 18 then sum(kb.subtotal) else 0 end as subtotaljasalayanan,
				case when ap.id = 15 then sum(kb.subtotal) else 0 end as subtotalapbd
        from kegiatananggaran_m km
        inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
        left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
        inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
        inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
        inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
        inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
        and 
        case 
            when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) = 5
            when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) = 4
            when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) = 5
        end
        inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
        where km.kdprofile = 30 and km.statusenabled = true
        $qtahap
        $qsubsubkegiatan
        and km.tahun = '$tahun'
        and kms.kdprofile = 30 and kms.statusenabled = true
        and kmss.kdprofile = 30 and kmss.statusenabled = true
        and ma.kdprofile = 30 and ma.statusenabled = true
        and mat.kdprofile = 30 and mat.statusenabled = true
        and kb.kdprofile = 30 and kb.statusenabled = true
        group by ap.id, ta.id, ta.tahap, kb.jml, kb.satuan, kb.hargasatuan, kb.keteranganbelanja, ma.kodemataanggaran
        

				order by kodemataanggaran, jml, hargasatuan, satuan


) as a
inner join(



				select 
        case 
            when kodemataanggaran = 'A' then 'I.A'
            when kodemataanggaran = 'B' then 'I.B'
        end as kodemataanggaran,
        case 
            when kodemataanggaran = 'A' then 'BIAYA PELAYANAN '
            when kodemataanggaran = 'B' then 'BIAYA UMUM DAN ADMINISTRASI'
        end as keterangan,
				id, tahap, jml, satuan, hargasatuan,
        case 
            when kodemataanggaran = 'A' then sum(subtotaljasalayanan)
            when kodemataanggaran = 'B' then sum(subtotaljasalayanan)
        end as subtotaljasalayanan,
				case 
            when kodemataanggaran = 'A' then sum(subtotalapbd)
            when kodemataanggaran = 'B' then sum(subtotalapbd)
        end as subtotalapbd
        from(
            select id, tahap, jml, satuan, hargasatuan,
            case 
                when kodemataanggaran ilike 'I.A.%' then 'A'
                when kodemataanggaran ilike 'I.B.%' then 'B'
            end as kodemataanggaran,
            case 
                when kodemataanggaran ilike 'I.A.%' then sum(subtotaljasalayanan)
                when kodemataanggaran ilike 'I.B.%' then sum(subtotaljasalayanan)
            end as subtotaljasalayanan,
						case 
                when kodemataanggaran ilike 'I.A.%' then sum(subtotalapbd)
                when kodemataanggaran ilike 'I.B.%' then sum(subtotalapbd)
            end as subtotalapbd
            from(
                        select ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran, kb.keteranganbelanja, 0 jml, '' satuan, 0 hargasatuan, 
												case when ap.id = 18 then sum(kb.subtotal) else 0 end as subtotaljasalayanan,
												case when ap.id = 15 then sum(kb.subtotal) else 0 end as subtotalapbd
                        from kegiatananggaran_m km
                        inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
                        left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
                        inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
                        inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
                        inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
                        inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
                        and 
                        case 
                            when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) = 5
                            when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) = 4
                            when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) = 5
                        end
                        inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
                        where km.kdprofile = 30 and km.statusenabled = true
                        and kms.kdprofile = 30 and kms.statusenabled = true
                        and kmss.kdprofile = 30 and kmss.statusenabled = true
                        and ma.kdprofile = 30 and ma.statusenabled = true
                        and mat.kdprofile = 30 and mat.statusenabled = true
                        and kb.kdprofile = 30 and kb.statusenabled = true
                        $qterhadap
                        $qsubsubkegiatan
                        and km.tahun = '$tahun'
                        group by ap.id, ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran, kb.keteranganbelanja
            ) as x group by id, tahap, jml, satuan, hargasatuan, kodemataanggaran
        ) as y where kodemataanggaran is not null 
        group by id, tahap, jml, satuan, hargasatuan, kodemataanggaran

        union all
				
				select kodemataanggaran, keterangan, id, tahap, jml, satuan, hargasatuan, sum(subtotaljasalayanan) subtotaljasalayanan,
				sum(subtotalapbd) subtotalapbd
				from(
					select mat.kodemataanggaran, mat.namamataanggaran keterangan,ta.id, ta.tahap, 0 jml, '' satuan, 0 hargasatuan, 
					case when ap.id = 18 then sum(kb.subtotal) else 0 end as subtotaljasalayanan,
					case when ap.id = 15 then sum(kb.subtotal) else 0 end as subtotalapbd
					from kegiatananggaran_m km
					inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
					left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
					inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
					inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
					inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
					inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
					and 
					case 
							when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) in(5,6)
							when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) in(6,7)
							when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) in(7,8)
					end
					inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
					where km.kdprofile = 30 and km.statusenabled = true
					$qterhadap
                        $qsubsubkegiatan
                        and km.tahun = '$tahun'
					and kms.kdprofile = 30 and kms.statusenabled = true
					and kmss.kdprofile = 30 and kmss.statusenabled = true
					and ma.kdprofile = 30 and ma.statusenabled = true
					and mat.kdprofile = 30 and mat.statusenabled = true
					and kb.kdprofile = 30 and kb.statusenabled = true
					group by ap.id, ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran
				) as x group by kodemataanggaran, keterangan, id, tahap, jml, satuan, hargasatuan

        union all
				
				select kodemataanggaran, keterangan, id, tahap, jml, satuan, hargasatuan, sum(subtotaljasalayanan) subtotaljasalayanan,
				sum(subtotalapbd) subtotalapbd
				from(
					select mat.kodemataanggaran, mat.namamataanggaran keterangan, ta.id, ta.tahap, 0 jml, '' satuan, 0 hargasatuan, 
					case when ap.id = 18 then sum(kb.subtotal) else 0 end as subtotaljasalayanan,
					case when ap.id = 15 then sum(kb.subtotal) else 0 end as subtotalapbd
					from kegiatananggaran_m km
					inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
					left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
					inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
					inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
					inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
					inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '.' || '%'
					and 
					case 
							when mat.kodemataanggaran = 'I' then char_length(mat.kodemataanggaran) = 1
							when mat.kodemataanggaran = 'II' then char_length(mat.kodemataanggaran) = 2
							when mat.kodemataanggaran = 'III' then char_length(mat.kodemataanggaran) = 3
					end
					inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
					where km.kdprofile = 30 and km.statusenabled = true
					$qterhadap
                        $qsubsubkegiatan
                        and km.tahun = '$tahun'
					and kms.kdprofile = 30 and kms.statusenabled = true
					and kmss.kdprofile = 30 and kmss.statusenabled = true
					and ma.kdprofile = 30 and ma.statusenabled = true
					and mat.kdprofile = 30 and mat.statusenabled = true
					and kb.kdprofile = 30 and kb.statusenabled = true
					group by ap.id, ta.id, ta.tahap, mat.kodemataanggaran, mat.namamataanggaran
				) as x group by kodemataanggaran, keterangan, id, tahap, jml, satuan, hargasatuan

        union all

        select ma.kodemataanggaran, ma.namamataanggaran keterangan, ta.id, ta.tahap, 0 jml, '' satuan, 0 hargasatuan, 
				case when ap.id = 18 then sum(kb.subtotal) else 0 end as subtotaljasalayanan,
				case when ap.id = 15 then sum(kb.subtotal) else 0 end as subtotalapbd
        from kegiatananggaran_m km
        inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
        left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
        inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
        inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
        inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
        inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
        and 
        case 
            when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) = 5
            when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) = 4
            when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) = 5
        end
        inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
        where km.kdprofile = 30 and km.statusenabled = true
        $qterhadap
                        $qsubsubkegiatan
                        and km.tahun = '$tahun'
        and kms.kdprofile = 30 and kms.statusenabled = true
        and kmss.kdprofile = 30 and kmss.statusenabled = true
        and ma.kdprofile = 30 and ma.statusenabled = true
        and mat.kdprofile = 30 and mat.statusenabled = true
        and kb.kdprofile = 30 and kb.statusenabled = true
        group by ap.id, ta.id, ta.tahap, ma.kodemataanggaran, ma.namamataanggaran

				union ALL

				select ma.kodemataanggaran, kb.keteranganbelanja keterangan, ta.id, ta.tahap, kb.jml, kb.satuan, kb.hargasatuan,  
				case when ap.id = 18 then sum(kb.subtotal) else 0 end as subtotaljasalayanan,
				case when ap.id = 15 then sum(kb.subtotal) else 0 end as subtotalapbd
        from kegiatananggaran_m km
        inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
        left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
        inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
        inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
        inner join mataanggaran_m ma on ma.id = kb.objectmataanggaranfk
        inner join mataanggaran_m mat on ma.kodemataanggaran ilike mat.kodemataanggaran || '%'
        and 
        case 
            when mat.kodemataanggaran ilike 'I%' then char_length(mat.kodemataanggaran) = 5
            when mat.kodemataanggaran ilike 'II%' then char_length(mat.kodemataanggaran) = 4
            when mat.kodemataanggaran ilike 'III%' then char_length(mat.kodemataanggaran) = 5
        end
        inner join tahapanggaran_m ta on ta.id = kb.objecttahapfk 
        where km.kdprofile = 30 and km.statusenabled = true
        $qterhadap
                        $qsubsubkegiatan
                        and km.tahun = '$tahun'
        and kms.kdprofile = 30 and kms.statusenabled = true
        and kmss.kdprofile = 30 and kmss.statusenabled = true
        and ma.kdprofile = 30 and ma.statusenabled = true
        and mat.kdprofile = 30 and mat.statusenabled = true
        and kb.kdprofile = 30 and kb.statusenabled = true
        group by ap.id, ta.id, ta.tahap, kb.jml, kb.satuan, kb.hargasatuan, kb.keteranganbelanja, ma.kodemataanggaran
        

		order by kodemataanggaran, jml, hargasatuan, satuan

        ) as b on a.kodemataanggaran = b.kodemataanggaran
        $qsama
        "));

        $pageWidth = 1200;
        return view('report.spj.cetakrbadetailsebelumsesudah',compact('sebelum','pageWidth', 'data', 'tanggalcetak'));
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
                CASE WHEN ed.ID = 3003954 THEN epd.VALUE END AS tidakada,
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
    public function CetakHPPCFIT(Request $request)
    {
        $noemr = $request['noemr'];
        $kdProfile = (int) $request['kdprofile'];
        $emrfk = $request['emrfk'];
        $data = \DB::select(DB::raw(
            "SELECT epd.value, ed.type
                FROM emrpasien_t ep
                        INNER JOIN emrpasiend_t epd ON ep.noemr = epd.emrpasienfk
                        INNER JOIN emrd_t ed ON ed.ID = epd.emrdfk 
                    WHERE ep.kdprofile = $kdProfile AND ep.statusenabled = TRUE 
                        AND ep.noemr ILIKE '$noemr' 
                        AND ed.statusenabled = TRUE 
                        AND ep.emrfk = 3000427 
                        AND ed.emrfk = 3000427
                ORDER BY
	        ed.ID ASC
            "
        ));
        foreach ($data as $z){
            if ($z->type == 'datetime'){
                $z->value=$this->tanggal_indonesia(date('Y-m-d',strtotime($z->value)));
                // $z->tgl=$this->tanggal_indonesia(date('Y-m-d',strtotime($z->tgl)));
            }
            
        }
        // dd($data); 

        $pageWidth = 950;
        $res['d'] = $data;
        return view('report.EMR.hppcfit',compact('res','pageWidth'));
    }

    public function CetakHPPCTKI(Request $request)
    {
        $noemr = $request['noemr'];
        $kdProfile = (int) $request['kdprofile'];
        $emrfk = $request['emrfk'];
        $emrd = \DB::select(DB::raw("
            select * from emrd_t where emrfk = $emrfk and statusenabled = true and kdprofile = $kdProfile order by id
        "));

        $data = \DB::select(DB::raw(
            "SELECT 
            string_agg(x.norm, '' )norm, string_agg(x.nama, '')nama, string_agg(x.alamat, '')alamat,string_agg(x.tgllahir, '')tgllahir, string_agg(x.tglpemeriksaan, '')tglpemeriksaan, 
            string_agg(x.tujuanpemeriksaan, '')tujuanpemeriksaan,string_agg(x.nomor, '')nomor,
						string_agg(x.iu1, '')iu1,string_agg(x.iu2, '')iu2, string_agg(x.iu3, '')iu3,string_agg(x.iu4, '')iu4,
            string_agg(x.iu5, '')iu5,string_agg(x.iuket, '')iuket,string_agg(x.dt1, '')dt1,string_agg(x.dt2, '')dt2,string_agg(x.dt3, '')dt3,string_agg(x.dt4, '')dt4,
            string_agg(x.dt5, '')dt5,string_agg(x.dtket, '')dtket,string_agg(x.lb1, '')lb1,string_agg(x.lb2, '')lb2,string_agg(x.lb3, '')lb3,string_agg(x.lb4, '')lb4,
            string_agg(x.lb5, '')lb5,string_agg(x.lbket, '')lbket,string_agg(x.sk1, '')sk1,string_agg(x.sk2, '')sk2,string_agg(x.sk3, '')sk3,string_agg(x.sk4, '')sk4,
            string_agg(x.sk5, '')sk5,string_agg(x.skket, '')skket,string_agg(x.kd1, '')kd1,string_agg(x.kd2, '')kd2,string_agg(x.kd3, '')kd3,string_agg(x.kd4, '')kd4,
            string_agg(x.kd5, '')kd5,string_agg(x.kdket, '')kdket,string_agg(x.tk1, '')tk1,string_agg(x.tk2, '')tk2,string_agg(x.tk3, '')tk3,string_agg(x.tk4, '')tk4,
            string_agg(x.tk5, '')tk5,string_agg(x.tkket, '')tkket,string_agg(x.ke1, '')ke1,string_agg(x.ke2, '')ke2,string_agg(x.ke3, '')ke3,string_agg(x.ke4, '')ke4,
            string_agg(x.ke5, '')ke5,string_agg(x.keket, '')keket,string_agg(x.se1, '')se1,string_agg(x.se2, '')se2,string_agg(x.se3, '')se3,string_agg(x.se4, '')se4,
            string_agg(x.se5, '')se5,string_agg(x.seket, '')seket,string_agg(x.kdt1, '')kdt1,string_agg(x.kdt2, '')kdt2,string_agg(x.kdt3, '')kdt3,string_agg(x.kdt4, '')kdt4,
            string_agg(x.kdt5, '')kdt5,string_agg(x.kdtket, '')kdtket,string_agg(x.ker1, '')ker1,string_agg(x.ker2, '')ker2,string_agg(x.ker3, '')ker3,string_agg(x.ker4, '')ker4,
            string_agg(x.ker5, '')ker5,string_agg(x.kerket, '')kerket,string_agg(x.pd1, '')pd1,string_agg(x.pd2, '')pd2,string_agg(x.pd3, '')pd3,string_agg(x.pd4, '')pd4,
            string_agg(x.pd5, '')pd5,string_agg(x.pdket, '')pdket,string_agg(x.saran, '')saran,string_agg(x.tanggal, '')tanggal,string_agg(x.pemeriksa, '')pemeriksa,string_agg(x.nip, '')nip
            FROM (SELECT CASE WHEN ed.ID = 3004350 THEN epd.VALUE END AS norm, CASE WHEN ed.ID = 3004351 THEN epd.VALUE END AS nama,

                CASE WHEN ed.ID = 3004352 THEN epd.VALUE END AS tgllahir,
                CASE WHEN ed.ID = 3004353 THEN epd.VALUE END AS alamat,
                CASE WHEN ed.ID = 3004354 THEN epd.VALUE END AS tglpemeriksaan,
                CASE WHEN ed.ID = 3004355 THEN epd.VALUE END AS tujuanpemeriksaan,
                CASE WHEN ed.ID = 3004356 THEN epd.VALUE END AS nomor,
                CASE WHEN ed.ID = 3004357 THEN epd.VALUE END AS iu1,
                CASE WHEN ed.ID = 3004358 THEN epd.VALUE END AS iu2,
                CASE WHEN ed.ID = 3004359 THEN epd.VALUE END AS iu3,
                CASE WHEN ed.ID = 3004360 THEN epd.VALUE END AS iu4,
                CASE WHEN ed.ID = 3004361 THEN epd.VALUE END AS iu5,
                CASE WHEN ed.ID = 3004362 THEN epd.VALUE END AS iuket,
                CASE WHEN ed.ID = 3004363 THEN epd.VALUE END AS dt1,
                CASE WHEN ed.ID = 3004364 THEN epd.VALUE END AS dt2,
                CASE WHEN ed.ID = 3004365 THEN epd.VALUE END AS dt3,
                CASE WHEN ed.ID = 3004366 THEN epd.VALUE END AS dt4,
                CASE WHEN ed.ID = 3004367 THEN epd.VALUE END AS dt5,
                CASE WHEN ed.ID = 3004368 THEN epd.VALUE END AS dtket,
                CASE WHEN ed.ID = 3004369 THEN epd.VALUE END AS lb1,
                CASE WHEN ed.ID = 3004370 THEN epd.VALUE END AS lb2,
                CASE WHEN ed.ID = 3004371 THEN epd.VALUE END AS lb3,
                CASE WHEN ed.ID = 3004372 THEN epd.VALUE END AS lb4,
                CASE WHEN ed.ID = 3004373 THEN epd.VALUE END AS lb5,
                CASE WHEN ed.ID = 3004374 THEN epd.VALUE END AS lbket,
                CASE WHEN ed.ID = 3004375 THEN epd.VALUE END AS sk1,
                CASE WHEN ed.ID = 3004376 THEN epd.VALUE END AS sk2,
                CASE WHEN ed.ID = 3004377 THEN epd.VALUE END AS sk3,
                CASE WHEN ed.ID = 3004378 THEN epd.VALUE END AS sk4,
                CASE WHEN ed.ID = 3004379 THEN epd.VALUE END AS sk5,
                CASE WHEN ed.ID = 3004380 THEN epd.VALUE END AS skket,
                CASE WHEN ed.ID = 3004381 THEN epd.VALUE END AS kdt1,
                CASE WHEN ed.ID = 3004382 THEN epd.VALUE END AS kdt2,
                CASE WHEN ed.ID = 3004383 THEN epd.VALUE END AS kdt3,
                CASE WHEN ed.ID = 3004384 THEN epd.VALUE END AS kdt4,
                CASE WHEN ed.ID = 3004385 THEN epd.VALUE END AS kdt5,
                CASE WHEN ed.ID = 3004386 THEN epd.VALUE END AS kdtket,
                CASE WHEN ed.ID = 3004387 THEN epd.VALUE END AS tk1,
                CASE WHEN ed.ID = 3004388 THEN epd.VALUE END AS tk2,
                CASE WHEN ed.ID = 3004389 THEN epd.VALUE END AS tk3,
                CASE WHEN ed.ID = 3004390 THEN epd.VALUE END AS tk4,
                CASE WHEN ed.ID = 3004391 THEN epd.VALUE END AS tk5,
                CASE WHEN ed.ID = 3004392 THEN epd.VALUE END AS tkket,
                CASE WHEN ed.ID = 3004393 THEN epd.VALUE END AS ke1,
                CASE WHEN ed.ID = 3004394 THEN epd.VALUE END AS ke2,
                CASE WHEN ed.ID = 3004395 THEN epd.VALUE END AS ke3,
                CASE WHEN ed.ID = 3004396 THEN epd.VALUE END AS ke4,
                CASE WHEN ed.ID = 3004397 THEN epd.VALUE END AS ke5,
                CASE WHEN ed.ID = 3004398 THEN epd.VALUE END AS keket,
                CASE WHEN ed.ID = 3004399 THEN epd.VALUE END AS se1,
                CASE WHEN ed.ID = 3004400 THEN epd.VALUE END AS se2,
                CASE WHEN ed.ID = 3004401 THEN epd.VALUE END AS se3,
                CASE WHEN ed.ID = 3004402 THEN epd.VALUE END AS se4,
                CASE WHEN ed.ID = 3004403 THEN epd.VALUE END AS se5,
                CASE WHEN ed.ID = 3004404 THEN epd.VALUE END AS seket,
                CASE WHEN ed.ID = 3004405 THEN epd.VALUE END AS kd1,
                CASE WHEN ed.ID = 3004406 THEN epd.VALUE END AS kd2,
                CASE WHEN ed.ID = 3004407 THEN epd.VALUE END AS kd3,
                CASE WHEN ed.ID = 3004408 THEN epd.VALUE END AS kd4,
                CASE WHEN ed.ID = 3004409 THEN epd.VALUE END AS kd5,
                CASE WHEN ed.ID = 3004410 THEN epd.VALUE END AS kdket,
                CASE WHEN ed.ID = 3004411 THEN epd.VALUE END AS ker1,
                CASE WHEN ed.ID = 3004412 THEN epd.VALUE END AS ker2,
                CASE WHEN ed.ID = 3004413 THEN epd.VALUE END AS ker3,
                CASE WHEN ed.ID = 3004414 THEN epd.VALUE END AS ker4,
                CASE WHEN ed.ID = 3004415 THEN epd.VALUE END AS ker5,
                CASE WHEN ed.ID = 3004416 THEN epd.VALUE END AS kerket,
                CASE WHEN ed.ID = 3004417 THEN epd.VALUE END AS pd1,
                CASE WHEN ed.ID = 3004418 THEN epd.VALUE END AS pd2,
                CASE WHEN ed.ID = 3004419 THEN epd.VALUE END AS pd3,
                CASE WHEN ed.ID = 3004420 THEN epd.VALUE END AS pd4,
                CASE WHEN ed.ID = 3004421 THEN epd.VALUE END AS pd5,
                CASE WHEN ed.ID = 3004422 THEN epd.VALUE END AS pdket,
                CASE WHEN ed.ID = 3004423 THEN epd.VALUE END AS saran,
                CASE WHEN ed.ID = 3004424 THEN epd.VALUE END AS tanggal,
                CASE WHEN ed.ID = 3004425 THEN epd.VALUE END AS pemeriksa,
                CASE WHEN ed.ID = 3004426 THEN epd.VALUE END AS nip
								
                FROM emrpasien_t ep
                        INNER JOIN emrpasiend_t epd ON ep.noemr = epd.emrpasienfk
                        INNER JOIN emrd_t ed ON ed.ID = epd.emrdfk 
                        INNER JOIN pegawai_m pg on pg.id = epd.pegawaifk
                    WHERE ep.kdprofile = 30 AND ep.statusenabled = TRUE 
                        AND ep.noemr ILIKE '$noemr' 
                        AND ed.statusenabled = TRUE 
                        AND ep.emrfk = 3000429 
                        AND ed.emrfk = 3000429
                ORDER BY
	    ed.ID ASC)as x
            "
        ));
        $detail = [];
        foreach ($data as $z){
                if (isset($z->tglpemeriksaan)||isset($z->tanggal)){
                    $z->tglpemeriksaan=$this->tanggal_indonesia(date('Y-m-d',strtotime($z->tglpemeriksaan)));
                    $z->tanggal=$this->tanggal_indonesia(date('Y-m-d',strtotime($z->tanggal)));
                    $z->tgllahir=$this->tanggal_indonesia(date('Y-m-d',strtotime($z->tgllahir)));
                }
            
            }
            
        
        // dd($data);

        // var_dump($data);
        // dd($data); 
        
        $pageWidth = 950;
        $res['d'] = $data;

        return view('report.EMR.hppctki',compact('data','pageWidth'));
    }
    public function CetakHPPMinatBakat(Request $request)
    {
        $noemr = $request['noemr'];
        $kdProfile = (int) $request['kdprofile'];
        $emrfk = $request['emrfk'];
        $main = \DB::select(DB::raw("SELECT id, type from emrd_t where emrfk = 3000428 and statusenabled = true and kdprofile = $kdProfile order by id
        "));
        $data = \DB::select(DB::raw("SELECT ed.id,epd.value, ed.type
                FROM emrpasien_t ep
                        INNER JOIN emrpasiend_t epd ON ep.noemr = epd.emrpasienfk
                        INNER JOIN emrd_t ed ON ed.ID = epd.emrdfk 
                        INNER JOIN pegawai_m pg on pg.id = epd.pegawaifk
                    WHERE ep.kdprofile = $kdProfile AND ep.statusenabled = TRUE 
                        AND ep.noemr ILIKE '$noemr' 
                        AND ed.statusenabled = TRUE 
                        AND ep.emrfk = 3000428 
                        AND ed.emrfk = 3000428
                ORDER BY ed.ID ASC"));
        $detail = [];
        $id=0;
        $value="";
        foreach ($main as $m) {
        $id=0;
        $value="";
            foreach ($data as $d) {
                if ($m->id == $d->id) {
                    $id = $m->id;
                    if ($d->type == 'datetime') {
                        $value=$this->tanggal_indonesia(date('Y-m-d',strtotime($d->value)));
                    }else{
                        $value = $d->value;
                    }
                    break;
                }else {
                    $id = $m->id;
                    $value = "";
                }
                
            }

            $detail[]= array(
                "id"=> $id,
                "value"=>$value,
                "type"=> $m->type
            );
        }

    // dd($detail);
        $pageWidth = 950;
        // var_dump($detail);
        return view('report.EMR.hppminatbakat', compact('detail','pageWidth'));
    }
    public function CetakGeneralConsent(Request $request)
    {
        $noemr = $request['noemr'];
        $kdProfile = (int) $request['kdprofile'];
        $emrfk = $request['emrfk'];
        $main = \DB::select(DB::raw("SELECT id, type from emrd_t where emrfk = $emrfk and statusenabled = true and kdprofile = $kdProfile order by id
        "));
        $data = \DB::select(DB::raw("SELECT ed.id,epd.value, ed.type
                FROM emrpasien_t ep
                        INNER JOIN emrpasiend_t epd ON ep.noemr = epd.emrpasienfk
                        INNER JOIN emrd_t ed ON ed.ID = epd.emrdfk 
                        INNER JOIN pegawai_m pg on pg.id = epd.pegawaifk
                    WHERE ep.kdprofile = $kdProfile AND ep.statusenabled = TRUE 
                        AND ep.noemr ILIKE '$noemr' 
                        AND ed.statusenabled = TRUE 
                        AND ep.emrfk = $emrfk 
                        AND ed.emrfk = $emrfk
                ORDER BY ed.ID ASC"));
        $detail = [];
        $id=0;
        $value="";
        foreach ($main as $m) {
        $id=0;
        $value="";
            foreach ($data as $d) {
                if ($m->id == $d->id) {
                    $id = $m->id;
                    if ($d->type == 'datetime') {
                        $value=$this->tanggal_indonesia(date('Y-m-d',strtotime($d->value)));
                    }else{
                        $value =$d->value;
                    }
                    break;
                }else {
                    $id = $m->id;
                    $value = "";
                }
                
            }

            $detail[]= array(
                "id"=> $id,
                "value"=>$value,
                "type"=> $m->type
            );
        }

    // dd($detail);
        $pageWidth = 950;
        // var_dump($detail);
        return view('report.EMR.formulirgeneralconsent', compact('detail','pageWidth'));
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
    
public function suratBuktiPengembalian(Request $request)
    {
        $noemr = $request['noemr'];
        $kdProfile = (int) $request['kdprofile'];
        $emrfk = $request['emrfk'];
        $main = \DB::select(DB::raw("SELECT id, type from emrd_t where emrfk = $emrfk and statusenabled = true and kdprofile = $kdProfile order by id
        "));
        $data = \DB::select(DB::raw("SELECT ed.id,epd.value, ed.type
                FROM emrpasien_t ep
                        INNER JOIN emrpasiend_t epd ON ep.noemr = epd.emrpasienfk
                        INNER JOIN emrd_t ed ON ed.ID = epd.emrdfk 
                        INNER JOIN pegawai_m pg on pg.id = epd.pegawaifk
                    WHERE ep.kdprofile = $kdProfile AND ep.statusenabled = TRUE 
                        AND ep.noemr ILIKE '$noemr' 
                        AND ed.statusenabled = TRUE 
                        AND ep.emrfk = $emrfk 
                        AND ed.emrfk = $emrfk
                ORDER BY ed.ID ASC"));
        $detail = [];
        $id=0;
        $value="";
        foreach ($main as $m) {
        $id=0;
        $value="";
            foreach ($data as $d) {
                if ($m->id == $d->id) {
                    $id = $m->id;
                    if ($d->type == 'datetime') {
                        $value=$this->tanggal_indonesia(date('Y-m-d',strtotime($d->value)));
                    }else{
                        $value =$d->value;
                    }
                    break;
                }else {
                    $id = $m->id;
                    $value = "";
                }
                
            }

            $detail[]= array(
                "id"=> $id,
                "value"=>$value,
                "type"=> $m->type
            );
        }

    // dd($detail);
        $pageWidth = 950;
        // var_dump($detail);
        return view('report.EMR.suratbuktipengembalian', compact('detail','pageWidth'));
    }

    public function perjanjianMelarikanDiri(Request $request)
    {
        $noemr = $request['noemr'];
        $kdProfile = (int) $request['kdprofile'];
        $emrfk = $request['emrfk'];
        $main = \DB::select(DB::raw("SELECT id, type from emrd_t where emrfk = $emrfk and statusenabled = true and kdprofile = $kdProfile order by id
        "));
        $data = \DB::select(DB::raw("SELECT ed.id,epd.value, ed.type
                FROM emrpasien_t ep
                        INNER JOIN emrpasiend_t epd ON ep.noemr = epd.emrpasienfk
                        INNER JOIN emrd_t ed ON ed.ID = epd.emrdfk 
                        INNER JOIN pegawai_m pg on pg.id = epd.pegawaifk
                    WHERE ep.kdprofile = $kdProfile AND ep.statusenabled = TRUE 
                        AND ep.noemr ILIKE '$noemr' 
                        AND ed.statusenabled = TRUE 
                        AND ep.emrfk = $emrfk 
                        AND ed.emrfk = $emrfk
                ORDER BY ed.ID ASC"));
        $detail = [];
        $id=0;
        $value="";
        foreach ($main as $m) {
        $id=0;
        $value="";
            foreach ($data as $d) {
                if ($m->id == $d->id) {
                    $id = $m->id;
                    if ($d->type == 'datetime') {
                        $value=$this->tanggal_indonesia(date('Y-m-d',strtotime($d->value)));
                    }else{
                        $value =$d->value;
                    }
                    break;
                }else {
                    $id = $m->id;
                    $value = "";
                }
                
            }

            $detail[]= array(
                "id"=> $id,
                "value"=>$value,
                "type"=> $m->type
            );
        }

        // dd($detail);
        $pageWidth = 950;
        // var_dump($detail);
        return view('report.EMR.perjanjianpasienmelarikandiri', compact('detail','pageWidth'));
    }
    public function cetakHasilKegiatan(Request $request)
    {
        $norec = $request['norec'];
        $kdProfile = (int) $request['kdprofile'];
        
        $judul = \DB::table('sdm_hasilkegiatan_t as shk')
        ->join('sdm_penelitianeksternal_t as spe', 'spe.norec','=','shk.kegiatanfk')
        ->join('ruangan_m AS ru','ru.id','=','shk.objectruanganfk')
        ->leftJoin('pegawai_m AS pg','pg.id','=','shk.objectpegawaifk')
        ->where('shk.kegiatanfk',$norec)
        ->select('spe.tanggalmulai','spe.institusipendidikan','spe.tanggalselesai')->distinct()
        ->get(); 
        $data = \DB::table('sdm_hasilkegiatan_t as shk')
        ->join('sdm_penelitianeksternal_t as spe', 'spe.norec','=','shk.kegiatanfk')
        ->join('ruangan_m AS ru','ru.id','=','shk.objectruanganfk')
        ->leftJoin('pegawai_m AS pg','pg.id','=','shk.objectpegawaifk')
        ->where('shk.kegiatanfk',$norec)
        ->select('spe.tanggalmulai','spe.institusipendidikan', 'shk.mahasiswa', 'shk.tglhasilkegiatan', 'spe.tglregistrasi', 'spe.tanggalselesai','shk.hasilkegiatan', 'ru.namaruangan', 'pg.namalengkap')
        ->get();

        foreach ($data as $i) {
            if(isset($i->tanggalmulai)){
                $i->tanggalmulai = date('Y-m-d',strtotime($i->tanggalmulai));
            }
            if (isset($i->tanggalmulai)) {
                $i->tanggalselesai = date('Y-m-d',strtotime($i->tanggalselesai));
            }
            if(isset($i->mahasiswa)){
                $i->mahasiswa = explode(", ", $i->mahasiswa);
            }
        }
        // var_dump($data);
        $pageWidth = 950;
        // var_dump($detail);
        return view('report.hasilkegiatandiklat', compact('data','judul','pageWidth'));
    }

    public function ketentuanRawatInap(Request $request)
    {
        $noemr = $request['noemr'];
        $kdProfile = (int) $request['kdprofile'];
        $emrfk = $request['emrfk'];
        $main = \DB::select(DB::raw("SELECT id, type from emrd_t where emrfk = $emrfk and statusenabled = true and kdprofile = $kdProfile order by id
        "));
        $data = \DB::select(DB::raw("SELECT ed.id,epd.value, ed.type
                FROM emrpasien_t ep
                        INNER JOIN emrpasiend_t epd ON ep.noemr = epd.emrpasienfk
                        INNER JOIN emrd_t ed ON ed.ID = epd.emrdfk 
                        INNER JOIN pegawai_m pg on pg.id = epd.pegawaifk
                    WHERE ep.kdprofile = $kdProfile AND ep.statusenabled = TRUE 
                        AND ep.noemr ILIKE '$noemr' 
                        AND ed.statusenabled = TRUE 
                        AND ep.emrfk = $emrfk 
                        AND ed.emrfk = $emrfk
                ORDER BY ed.ID ASC"));
        $detail = [];
        $id=0;
        $value="";
        foreach ($main as $m) {
        $id=0;
        $value="";
            foreach ($data as $d) {
                if ($m->id == $d->id) {
                    $id = $m->id;
                    if ($d->type == 'datetime') {
                        $value=$this->tanggal_indonesia(date('Y-m-d',strtotime($d->value)));
                    }else{
                        $value =$d->value;
                    }
                    break;
                }else {
                    $id = $m->id;
                    $value = "";
                }
                
            }

            $detail[]= array(
                "id"=> $id,
                "value"=>$value,
                "type"=> $m->type
            );
        }

        // dd($detail);
        $pageWidth = 950;
        // var_dump($detail);
        return view('report.EMR.ketentuanrawatinap', compact('detail','pageWidth'));
    }
    public function persetujuanPembiayaan(Request $request)
    {
        $noemr = $request['noemr'];
        $kdProfile = (int) $request['kdprofile'];
        $emrfk = $request['emrfk'];
        $main = \DB::select(DB::raw("SELECT id, type from emrd_t where emrfk = $emrfk and statusenabled = true and kdprofile = $kdProfile order by id
        "));
        $data = \DB::select(DB::raw("SELECT ed.id,epd.value, ed.type
                FROM emrpasien_t ep
                        INNER JOIN emrpasiend_t epd ON ep.noemr = epd.emrpasienfk
                        INNER JOIN emrd_t ed ON ed.ID = epd.emrdfk 
                        INNER JOIN pegawai_m pg on pg.id = epd.pegawaifk
                    WHERE ep.kdprofile = $kdProfile AND ep.statusenabled = TRUE 
                        AND ep.noemr ILIKE '$noemr' 
                        AND ed.statusenabled = TRUE 
                        AND ep.emrfk = $emrfk 
                        AND ed.emrfk = $emrfk
                ORDER BY ed.ID ASC"));
        $detail = [];
        $id=0;
        $value="";
        foreach ($main as $m) {
        $id=0;
        $value="";
            foreach ($data as $d) {
                if ($m->id == $d->id) {
                    $id = $m->id;
                    if ($d->type == 'datetime') {
                        $value=$this->tanggal_indonesia(date('Y-m-d',strtotime($d->value)));
                    }else{
                        $value =$d->value;
                    }
                    break;
                }else {
                    $id = $m->id;
                    $value = "";
                }
                
            }

            $detail[]= array(
                "id"=> $id,
                "value"=>$value,
                "type"=> $m->type
            );
        }

        // dd($detail);
        $pageWidth = 950;
        // var_dump($detail);
        return view('report.EMR.persetujuanpembiayaan', compact('detail','pageWidth'));
    }
    public function CetakRekapSumberDanaAnggaranSebelum(Request $request)
    {
        $tahun = $request['tahun'];
        $tahap =  $request['tahap'];

        $tanggalcetak = $this->tanggal_indonesia(date('Y-m-d',strtotime($request['tglcetak'])));

        $qtahap  = '';
        if (isset($request['tahap']) && $request['tahap'] != "" && $request['tahap'] != "undefined") {
            $qtahap =  ' and kb.objecttahapfk =  ' . $request['tahap'];
        }

        $tahap = DB::select(DB::raw("select * from tahapanggaran_m where id = $tahap"));
        $data = \DB::select(DB::raw("SELECT a.kode, a.div, CASE 
            WHEN a.div = 2 THEN
                SUBSTR(a.kode,9,4 )
            ELSE
                SUBSTR(a.kode,14,2 )
        END as kode1,a.kegiatan,a.jasalayanan,a.apbd,a.total from(
                    select y.kegiatan, y.kode, y.div, sum(y.apbd) apbd, sum(y.jasalayanan) jasalayanan, 
                    sum(y.apbd) + sum(y.jasalayanan) as total
                    from(
                        select x.kegiatan, x.subkegiatan, x.kode, x.div,
                                        case when x.id_asalproduk = 15 then x.subtotal else 0 end as apbd,
                        case when x.id_asalproduk = 18 then subtotal else 0 end as jasalayanan
                        from( 
                            select kmss.keterangan kegiatan, ap.id as id_asalproduk,kmss.kode, kmss.div, kms.keterangan subkegiatan, sum(kb.subtotal) subtotal
                            from kegiatananggaran_m km
                            inner join kegiatananggaran_m kms on km.kode ilike  kms.kode || '%' and kms.div = 3
                            left join kegiatananggaran_m kmss on km.kode ilike  kmss.kode || '%' and kmss.div = 2
                            inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
                            inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
                            where km.kdprofile = 30 and km.statusenabled = true
                            and kms.kdprofile = 30 and kms.statusenabled = true
                            and kmss.kdprofile = 30 and kmss.statusenabled = true
                            and kb.kdprofile = 30 and kb.statusenabled = true
                            and km.tahun = '$tahun'
                            $qtahap
                            group by kms.keterangan, kmss.keterangan, kmss.kode,  kmss.div, ap.id
                        ) as x group by x.kegiatan, x.subkegiatan, x.subtotal, x.kode, x.div, x.id_asalproduk
                    ) as y group by kegiatan, kode, div
                                
                    union all
                                
                    select y.subkegiatan as kegiatan, y.kode, y.div, sum(y.apbd) apbd, sum(y.jasalayanan) jasalayanan, 
                    sum(y.apbd) + sum(y.jasalayanan) as total
                    from(
                        select x.kegiatan, x.subkegiatan, x.kode, x.div,
                        case when x.id_asalproduk = 15 then x.subtotal else 0 end as apbd,
                        case when x.id_asalproduk = 18 then subtotal else 0 end as jasalayanan
                        from( 
                            select kmss.keterangan kegiatan, kms.keterangan subkegiatan, kms.kode, kms.div, ap.id as id_asalproduk,sum(kb.subtotal) subtotal
                            from kegiatananggaran_m km
                            inner join kegiatananggaran_m kms on km.kode ilike kms.kode || '%' and kms.div = 3
                            left join kegiatananggaran_m kmss on km.kode ilike kmss.kode || '%' and kmss.div = 2
                            inner join keteranganbelanja_t kb on kb.objectkegiatanfk = km.id
                            inner join asalproduk_m ap on ap.id = kb.objectasalprodukfk
                            where km.kdprofile = 30 and km.statusenabled = true
                            and kms.kdprofile = 30 and kms.statusenabled = true
                            and kmss.kdprofile = 30 and kmss.statusenabled = true
                            and kb.kdprofile = 30 and kb.statusenabled = true
                            and km.tahun = '$tahun'
                            $qtahap
                            group by kms.keterangan, kmss.keterangan, kms.kode, kms.div, ap.id
                        ) as x group by x.kegiatan, x.subkegiatan, x.subtotal, x.kode, x.div, x.id_asalproduk
                    ) as y group by subkegiatan, kode, div
                ) as a order by kode"));
        $pageWidth = 1200;
        return view('report.spj.cetakrekapanggaransumberdana', compact('data', 'pageWidth','tahap', 'tanggalcetak'));
    }
    public function CetakRekapSumberDanaAnggaran(Request $request)
    {   
        $tahun = $request['tahun'];
        $tanggalcetak = $this->tanggal_indonesia(date('Y-m-d',strtotime($request['tglcetak'])));

        $qtahap  = '';
        if (isset($request['tahap']) && $request['tahap'] != "" && $request['tahap'] != "undefined") {
            $qtahap =  ' and kb.objecttahapfk =  ' . $request['tahap'];
        }

        $qterhadap  = '';
        if (isset($request['terhadap']) && $request['terhadap'] != "" && $request['terhadap'] != "undefined") {
            $qterhadap =  ' and kb.objecttahapfk =  ' . $request['terhadap'];
        }
        $sebelum = \DB::select(DB::raw("
        SELECT j.*, K.apbd AS kapbd, K.jasalayanan as kjasalayanan, K.total as ktotal, k.tahap tahapsesudah
        FROM
            (
            SELECT
                * 
            FROM
                (
                SELECT y.kegiatan, y.tahap, y.kode, y.div, SUM ( y.apbd ) AS apbd, SUM ( y.jasalayanan ) AS jasalayanan, SUM ( y.apbd ) + SUM ( y.jasalayanan ) AS total 
                FROM
                    (
                    SELECT x.kegiatan, x.subkegiatan, x.tahap, x.kode, x.div,
                    CASE
                        WHEN x.id_asalproduk = 15 THEN x.subtotal 
                        ELSE 0 
                        END AS apbd,
                    CASE
                            WHEN x.id_asalproduk = 18 THEN
                            subtotal ELSE 0 
                        END AS jasalayanan 
                    FROM
                        (
                        SELECT kmss.keterangan kegiatan, ap.ID AS id_asalproduk, kms.keterangan subkegiatan, kmss.kode, kmss.div, km.keterangan subsubkegiatan, ta.tahap, ta.ID, ap.asalproduk, SUM ( kb.subtotal ) subtotal 
                        FROM
                            kegiatananggaran_m km
                            INNER JOIN kegiatananggaran_m kms ON km.kode ILIKE kms.kode || '%' AND kms.div = 3
                            LEFT JOIN kegiatananggaran_m kmss ON km.kode ILIKE kmss.kode || '%' AND kmss.div = 2
                            INNER JOIN keteranganbelanja_t kb ON kb.objectkegiatanfk = km.ID 
                            INNER JOIN asalproduk_m ap ON ap.ID = kb.objectasalprodukfk
                            LEFT JOIN tahapanggaran_m ta ON ta.ID = kb.objecttahapfk 
                        WHERE
                            km.kdprofile = 30 
                            AND km.statusenabled = TRUE 
                            and kms.kdprofile = 30 and kms.statusenabled = true
                            and kmss.kdprofile = 30 and kmss.statusenabled = true
                            and kb.kdprofile = 30 and kb.statusenabled = true
                            $qterhadap
                            and km.tahun = '$request[tahun]'
                            AND km.keterangan IN (
                            SELECT
                                km.keterangan 
                            FROM
                                kegiatananggaran_m km
                                INNER JOIN kegiatananggaran_m kms ON km.kode ILIKE kms.kode || '%' AND kms.div = 3
                                LEFT JOIN kegiatananggaran_m kmss ON km.kode ILIKE kmss.kode || '%' AND kmss.div = 2
                                INNER JOIN keteranganbelanja_t kb ON kb.objectkegiatanfk = km.ID INNER JOIN asalproduk_m ap ON ap.ID = kb.objectasalprodukfk
                                LEFT JOIN tahapanggaran_m ta ON ta.ID = kb.objecttahapfk 
                            WHERE
                                km.kdprofile = 30 
                                AND km.statusenabled = TRUE 
                                and kms.kdprofile = 30 and kms.statusenabled = true
                                and kmss.kdprofile = 30 and kmss.statusenabled = true
                                and kb.kdprofile = 30 and kb.statusenabled = true
                                $qtahap
                                and km.tahun = '$request[tahun]'
                            GROUP BY kms.keterangan, kmss.keterangan, kmss.kode, ap.asalproduk, kmss.div, km.keterangan, ta.tahap, ta.ID 
                            ) 
                        GROUP BY kms.keterangan, kmss.keterangan, kmss.kode, ap.asalproduk, kmss.div, km.keterangan, ta.tahap, ta.ID, ap.ID 
                        ) AS x GROUP BY x.kegiatan, x.subkegiatan, x.tahap, x.asalproduk, x.subtotal, x.kode, x.div, x.id_asalproduk 
                    ) AS y GROUP BY y.kegiatan, y.tahap, y.kode, y.div UNION ALL
                SELECT y.subkegiatan, y.tahap, y.kode, y.div, SUM ( y.apbd ) AS apbd, SUM ( y.jasalayanan ) AS jasalayanan, SUM ( y.apbd ) + SUM ( y.jasalayanan ) AS total 
                FROM
                    (
                    SELECT x.kegiatan, x.subkegiatan, x.tahap, x.kode, x.div,
                    CASE
                            WHEN x.id_asalproduk = 15 THEN
                            x.subtotal ELSE 0 
                        END AS apbd,
                    CASE
                            WHEN x.id_asalproduk = 18 THEN
                            subtotal ELSE 0 
                        END AS jasalayanan 
                    FROM
                        (
                        SELECT ap.ID AS id_asalproduk, kmss.keterangan kegiatan, kms.keterangan subkegiatan, kms.kode, kms.div, km.keterangan subsubkegiatan, ta.tahap, ta.ID, SUM ( kb.subtotal ) subtotal 
                        FROM
                            kegiatananggaran_m km
                            INNER JOIN kegiatananggaran_m kms ON km.kode ILIKE kms.kode || '%' 
                            AND kms.div = 3
                            LEFT JOIN kegiatananggaran_m kmss ON km.kode ILIKE kmss.kode || '%' 
                            AND kmss.div = 2
                            INNER JOIN keteranganbelanja_t kb ON kb.objectkegiatanfk = km.
                            ID INNER JOIN asalproduk_m ap ON ap.ID = kb.objectasalprodukfk
                            LEFT JOIN tahapanggaran_m ta ON ta.ID = kb.objecttahapfk 
                        WHERE
                            km.kdprofile = 30 
                            AND km.statusenabled = TRUE 
                            and kms.kdprofile = 30 and kms.statusenabled = true
                            and kmss.kdprofile = 30 and kmss.statusenabled = true
                            and kb.kdprofile = 30 and kb.statusenabled = true
                            $qterhadap
                                and km.tahun = '$request[tahun]'
                            AND km.keterangan IN (
                            SELECT
                                km.keterangan 
                            FROM
                                kegiatananggaran_m km
                                INNER JOIN kegiatananggaran_m kms ON km.kode ILIKE kms.kode || '%' 
                                AND kms.div = 3
                                LEFT JOIN kegiatananggaran_m kmss ON km.kode ILIKE kmss.kode || '%' 
                                AND kmss.div = 2
                                INNER JOIN keteranganbelanja_t kb ON kb.objectkegiatanfk = km.
                                ID INNER JOIN asalproduk_m ap ON ap.ID = kb.objectasalprodukfk
                                LEFT JOIN tahapanggaran_m ta ON ta.ID = kb.objecttahapfk 
                            WHERE
                                km.kdprofile = 30 
                                AND km.statusenabled = TRUE 
                                and kms.kdprofile = 30 and kms.statusenabled = true
                                and kmss.kdprofile = 30 and kmss.statusenabled = true
                                and kb.kdprofile = 30 and kb.statusenabled = true
                                $qtahap
                                and km.tahun = '$request[tahun]' 
                            GROUP BY kms.keterangan, kmss.keterangan, kms.kode, ap.asalproduk, kms.div, km.keterangan, ta.tahap, ta.ID, ap.ID 
                            ) 
                        GROUP BY kms.keterangan, kmss.keterangan, kms.kode, ap.asalproduk, kms.div, km.keterangan, ta.tahap, ta.ID, ap.ID 
                        ) AS x 
                    GROUP BY x.kegiatan, x.subkegiatan, x.tahap, x.id_asalproduk, x.subtotal, x.kode, x.div 
                    ) AS y 
                GROUP BY y.subkegiatan, y.tahap, y.kode, y.div 
                ) AS A 
            ORDER BY
                A.kode 
            ) AS j
            INNER JOIN (
            SELECT
                * 
            FROM
                (
                SELECT y.kegiatan AS kegiatan, y.tahap, y.kode, y.div, SUM ( y.apbd ) AS apbd, SUM ( y.jasalayanan ) AS jasalayanan, SUM ( y.apbd ) + SUM ( y.jasalayanan ) AS total 
                FROM
                    (
                    SELECT x.kegiatan, x.tahap, x.kode, x.div,
                    CASE
                            WHEN x.id_asalproduk = 15 THEN
                            x.subtotal ELSE 0 
                        END AS apbd,
                    CASE
                            WHEN x.id_asalproduk = 18 THEN
                            subtotal ELSE 0 
                        END AS jasalayanan 
                    FROM
                        (
                        SELECT kmss.keterangan kegiatan, kmss.kode, kmss.div, km.keterangan subsubkegiatan, ta.tahap, ta.ID, ap.ID AS id_asalproduk, ap.asalproduk, SUM ( kb.subtotal ) subtotal 
                        FROM
                            kegiatananggaran_m km
                            INNER JOIN kegiatananggaran_m kms ON km.kode ILIKE kms.kode || '%' 
                            AND kms.div = 3
                            LEFT JOIN kegiatananggaran_m kmss ON km.kode ILIKE kmss.kode || '%' 
                            AND kmss.div = 2
                            INNER JOIN keteranganbelanja_t kb ON kb.objectkegiatanfk = km.
                            ID INNER JOIN asalproduk_m ap ON ap.ID = kb.objectasalprodukfk
                            LEFT JOIN tahapanggaran_m ta ON ta.ID = kb.objecttahapfk 
                        WHERE
                            km.kdprofile = 30 
                            AND km.statusenabled = TRUE 
                            and kms.kdprofile = 30 and kms.statusenabled = true
                            and kmss.kdprofile = 30 and kmss.statusenabled = true
                            and kb.kdprofile = 30 and kb.statusenabled = true
                            $qtahap
                                and km.tahun = '$request[tahun]' 
                            AND km.keterangan IN (
                            SELECT
                                km.keterangan 
                            FROM
                                kegiatananggaran_m km
                                INNER JOIN kegiatananggaran_m kms ON km.kode ILIKE kms.kode || '%' 
                                AND kms.div = 3
                                LEFT JOIN kegiatananggaran_m kmss ON km.kode ILIKE kmss.kode || '%' 
                                AND kmss.div = 2
                                INNER JOIN keteranganbelanja_t kb ON kb.objectkegiatanfk = km.
                                ID INNER JOIN asalproduk_m ap ON ap.ID = kb.objectasalprodukfk
                                LEFT JOIN tahapanggaran_m ta ON ta.ID = kb.objecttahapfk 
                            WHERE
                                km.kdprofile = 30 
                                AND km.statusenabled = TRUE 
                                and kms.kdprofile = 30 and kms.statusenabled = true
                            and kmss.kdprofile = 30 and kmss.statusenabled = true
                            and kb.kdprofile = 30 and kb.statusenabled = true
                                $qterhadap
                                and km.tahun = '$request[tahun]'
                            GROUP BY kmss.keterangan, kmss.kode, ap.asalproduk, kmss.div, km.keterangan, ta.tahap, ta.ID 
                            ) 
                        GROUP BY kmss.keterangan, kmss.kode, ap.asalproduk, ap.ID, kmss.div, km.keterangan, ta.tahap, ta.ID 
                        ) AS x 
                    GROUP BY x.kegiatan, x.tahap, x.asalproduk, x.subtotal, x.kode, x.div, x.id_asalproduk 
                    ) AS y GROUP BY y.kegiatan, y.tahap, y.kode, y.div UNION ALL
                SELECT y.subkegiatan AS kegiatan, y.tahap, y.kode, y.div, SUM ( y.apbd ) AS apbd, SUM ( y.jasalayanan ) AS jasalayanan, SUM ( y.apbd ) + SUM ( y.jasalayanan ) AS total 
                FROM
                    (
                    SELECT x.subkegiatan, x.tahap, x.kode, x.div,
                    CASE
                            WHEN x.id_asalproduk = 15 THEN x.subtotal ELSE 0 
                        END AS apbd,
                    CASE
                            WHEN x.id_asalproduk = 18 THEN subtotal ELSE 0 
                        END AS jasalayanan 
                    FROM
                        (
                        SELECT kms.keterangan subkegiatan, kms.kode, kms.div, km.keterangan subsubkegiatan, ta.tahap, ta.ID, ap.ID AS id_asalproduk, ap.asalproduk, SUM ( kb.subtotal ) subtotal 
                        FROM
                            kegiatananggaran_m km
                            INNER JOIN kegiatananggaran_m kms ON km.kode ILIKE kms.kode || '%' 
                            AND kms.div = 3
                            LEFT JOIN kegiatananggaran_m kmss ON km.kode ILIKE kmss.kode || '%' 
                            AND kmss.div = 2
                            INNER JOIN keteranganbelanja_t kb ON kb.objectkegiatanfk = km.
                            ID INNER JOIN asalproduk_m ap ON ap.ID = kb.objectasalprodukfk
                            LEFT JOIN tahapanggaran_m ta ON ta.ID = kb.objecttahapfk 
                        WHERE
                            km.kdprofile = 30 
                            AND km.statusenabled = TRUE 
                            and kms.kdprofile = 30 and kms.statusenabled = true
                            and kmss.kdprofile = 30 and kmss.statusenabled = true
                            and kb.kdprofile = 30 and kb.statusenabled = true
                            $qtahap
                                and km.tahun = '$request[tahun]'
                            AND km.keterangan IN (
                            SELECT
                                km.keterangan 
                            FROM
                                kegiatananggaran_m km
                                INNER JOIN kegiatananggaran_m kms ON km.kode ILIKE kms.kode || '%' AND kms.div = 3
                                LEFT JOIN kegiatananggaran_m kmss ON km.kode ILIKE kmss.kode || '%' AND kmss.div = 2
                                INNER JOIN keteranganbelanja_t kb ON kb.objectkegiatanfk = km.
                                ID INNER JOIN asalproduk_m ap ON ap.ID = kb.objectasalprodukfk
                                LEFT JOIN tahapanggaran_m ta ON ta.ID = kb.objecttahapfk 
                            WHERE km.kdprofile = 30  AND km.statusenabled = TRUE  
                            and kms.kdprofile = 30 and kms.statusenabled = true
                            and kmss.kdprofile = 30 and kmss.statusenabled = true
                            and kb.kdprofile = 30 and kb.statusenabled = true
                            $qterhadap 
                            and km.tahun = '$request[tahun]'
                            GROUP BY kms.keterangan, kmss.kode, ap.asalproduk, kmss.div, km.keterangan, ta.tahap, ta.ID 
                            ) GROUP BY kms.keterangan, kms.kode, ap.asalproduk, ap.ID, kms.div, km.keterangan, ta.tahap, ta.ID 
                        ) AS x GROUP BY x.subkegiatan, x.tahap, x.asalproduk, x.subtotal, x.kode, x.div, x.id_asalproduk 
                    ) AS y GROUP BY y.subkegiatan, y.tahap, y.kode, y.div 
                ) AS A ORDER BY A.kode ) AS K ON j.kegiatan = K.kegiatan
        "));
        $pageWidth = 1300;
        //return $this->respond($result);
        return view('report.spj.cetakrekapanggaransumberdanasebelumsesudah',compact('sebelum', 'pageWidth', 'tanggalcetak'));
    }   

    public function cetakKGB(Request $request)
    {
        $kdProfile = (int) $request['kdprofile'];
        if (isset($request['rgb'])) {
            $data = \DB::select(DB::raw("SELECT
            fix.* 
            FROM
            (
            SELECT ROW_NUMBER
                ( ) OVER ( PARTITION BY rg.objectpegawaifk ORDER BY rg.tgltmt DESC ) AS rn2,
                rg.objectpegawaifk,
                pg.namalengkap,
                pg.nippns,
            -- 		rg.tgltmt,
            -- 		rg.objectgolonganfk,
                gol.namaexternal as pangkat,
                gol.NAME as golongan,
                rg.gajiawal,
                rg.gajiakhir,
                rg.masakerjagolongan,
                rg.noskcetak, rg.nosurat,rg.tglsk,
                rg.tgltmt as tglakhir,
								rg.norec,
                extract(year from age(rg.tgltmt, rgb.tgltmt))as thn,
                extract(month from age(rg.tgltmt, rgb.tgltmt))as bln
            FROM
                riwayatgajiberkala_t rg
                INNER JOIN sdm_golongan_m AS gol ON gol.id = rg.objectgolonganfk
                INNER JOIN pegawai_m pg ON pg.ID = rg.objectpegawaifk
                INNER JOIN (
                SELECT
                    x.objectpegawaifk,
                    x.tgltmt 
                FROM
                    (
                    SELECT
                        row_number ( ) OVER ( PARTITION BY rg.objectpegawaifk ORDER BY rg.tgltmt ASC ) AS rn,
                        rg.* 
                    FROM
                        pegawai_m AS pg
                        INNER JOIN riwayatgolongan_t AS rg ON rg.objectpegawaifk = pg.id 
                    ) AS x 
                WHERE
                    x.rn = 1 
                ) AS rgb ON rgb.objectpegawaifk = rg.objectpegawaifk 
            ORDER BY
                rg.tgltmt ASC 
            ) AS fix 
            WHERE
            fix.rn2 = 1 
            AND fix.norec ='b66c84a0-0e5a-11ed-a1ba-4f36dd9f'
            "));
        }else{
            $data = \DB::select(DB::raw("SELECT
            fix.* 
            FROM
            (
            SELECT ROW_NUMBER
                ( ) OVER ( PARTITION BY rg.objectpegawaifk ORDER BY rg.tgltmt DESC ) AS rn2,
                rg.objectpegawaifk,
                pg.namalengkap,
                pg.nippns,
            -- 		rg.tgltmt,
            -- 		rg.objectgolonganfk,
                gol.namaexternal as pangkat,
                gol.NAME as golongan,
                rg.gajiawal,
                rg.gajiakhir,
                rg.masakerjagolongan,
                rg.noskcetak, 
                rg.nosurat,
                rg.tglsk,
                rg.tgltmt as tglakhir,
                extract(year from age(rg.tgltmt, rgb.tgltmt))as thn,
                extract(month from age(rg.tgltmt, rgb.tgltmt))as bln
            FROM
                riwayatgajiberkala_t rg
                INNER JOIN sdm_golongan_m AS gol ON gol.id = rg.objectgolonganfk
                INNER JOIN pegawai_m pg ON pg.ID = rg.objectpegawaifk
                INNER JOIN (
                SELECT
                    x.objectpegawaifk,
                    x.tgltmt 
                FROM
                    (
                    SELECT
                        row_number ( ) OVER ( PARTITION BY rg.objectpegawaifk ORDER BY rg.tgltmt ASC ) AS rn,
                        rg.* 
                    FROM
                        pegawai_m AS pg
                        INNER JOIN riwayatgolongan_t AS rg ON rg.objectpegawaifk = pg.id 
                    ) AS x 
                WHERE
                    x.rn = 1 
                ) AS rgb ON rgb.objectpegawaifk = rg.objectpegawaifk 
            ORDER BY
                rg.tgltmt ASC 
            ) AS fix 
            WHERE
            fix.rn2 = 1 
            AND fix.objectpegawaifk = $request[id_pegawai]"));
        }
        
        $detail = [];
        $id=0;
        $value="";
        foreach ($data as $dt) {
            if(isset($dt->gajiawal) && isset($dt->gajiakhir) ){
                $dt->gajiawal = $this->rupiah($dt->gajiawal);
                $dt->gajiakhir = $this->rupiah($dt->gajiakhir);
            }
            if(isset($dt->tglsk) && isset($dt->tglakhir)){
                $dt->tglsk=$this->tanggal_indonesia(date('Y-m-d',strtotime($dt->tglsk)));
                $dt->tglakhir=$this->tanggal_indonesia(date('Y-m-d',strtotime($dt->tglakhir)));
                $dt->tglttd=$this->tanggal_indonesia(date('Y-m-d'));
            }
        }
    dd($data);
        $pageWidth = 950;
        return view('report.kgb'
        , compact('data','pageWidth'));
    }

    function rupiah($angka){
	$hasil_rupiah = "Rp " . number_format($angka,2,',','.');
	return $hasil_rupiah;
    }
    public function invoiceDiklat(Request $request)
    {
        $detail = \DB::select(
            DB::raw("SELECT sdpe.institusipendidikan, djp.detailjenisproduk,sdpe.jumlahpeserta, sdpe.tanggalmulai, sdpe.tanggalselesai, pr.namaproduk, sdpe.qty, sdpe.satuan, sdpe.biayapenelitian FROM sdm_penelitianeksternal_t sdpe 
            inner join detailjenisproduk_m djp on djp.id = sdpe.objectdetailjenisprodukfk
            inner join produk_m pr on pr.id = sdpe.objectprodukfk
            where sdpe.norec ilike '$request[norec]' and sdpe.statusenabled = true and sdpe.kdprofile = 30
        "));
        $mahasiswa = \DB::select(
            DB::raw("SELECT ru.namaruangan, pg.namalengkap,spd.* FROM sdm_pesertadidik_t spd 
            left join pegawai_m pg on pg.id = spd.objectpegawailastfk
            left join ruangan_m ru on ru.id = spd.objectruanganlastfk
            where spd.noregistrasifk ilike '$request[norec]'")
        );
        $result = array(
            "detail"=> $detail,
            "mahasiswa"=> $mahasiswa,
            "as"=> "Fizi"
        );
        // dd($result);
        return view('report.invoice-diklat', compact('detail', 'mahasiswa'));
    }
    public function cetakKwitansiDiklat(Request $request)
    {
        $data = \DB::select(
            DB::raw("SELECT sbm.totaldibayar, sbm.nosbm, sdpe.institusipendidikan, sdpe.tanggalmulai, sdpe.tanggalselesai, sdpe.tglregistrasi, pr.namaproduk, sdpe.jumlahpeserta, sdpe.hargasatuan,sdpe.biayapenelitian as total FROM strukpelayanan_t sp 
            inner join sdm_penelitianeksternal_t sdpe on sdpe.noregistrasifk = sp.norec
            inner join produk_m pr on pr.id = sdpe.objectprodukfk
            inner join strukbuktipenerimaan_t sbm on sbm.nostrukfk = sp.norec
            where sbm.nosbm ilike '$request[nosbm]'
            ")
        );
        $pegawai = $request['strIdPegawai'];
        // dd($data);
        return view("report.kwitansi-diklat", compact("data",'pegawai'));
    }
    public function pemeriksaanLab(Request $request)
    {
        $data= \DB::select(DB::raw(
            "SELECT kp.kelompokpasien, sum(ppd.hargajual::integer) FROM pelayananpasien_t pp 
            inner join antrianpasiendiperiksa_t apd on apd.norec = pp.noregistrasifk
            inner join pelayananpasiendetail_t ppd on pp.norec = ppd.pelayananpasien
            inner join pasiendaftar_t pd on pd.norec = apd.noregistrasifk
            inner join kelompokpasien_m kp on kp.id = pd.objectkelompokpasienlastfk
            inner join ruangan_m ru on ru.id = apd.objectruanganfk
            where pd.kdprofile = 30 and pd.statusenabled = true and apd.kdprofile = 30 and apd.statusenabled = true and pp.kdprofile = 30 and pp.statusenabled = true and 
            apd.tglmasuk between '$request[tglAwal]' and '$request[tglAkhir]' and ru.objectdepartemenfk = 3 and pd.tglpulang is not null and pp.strukfk is not null and ppd.komponenhargafk = 93
            GROUP BY kp.id
            union all 
            SELECT 'TOTAL', sum(ppd.hargajual::integer) FROM pelayananpasien_t pp 
            inner join pelayananpasiendetail_t ppd on pp.norec = ppd.pelayananpasien
            inner join antrianpasiendiperiksa_t apd on apd.norec = pp.noregistrasifk
            inner join pasiendaftar_t pd on pd.norec = apd.noregistrasifk
            inner join kelompokpasien_m kp on kp.id = pd.objectkelompokpasienlastfk
            inner join ruangan_m ru on ru.id = apd.objectruanganfk
            where pd.kdprofile = 30 and pd.statusenabled = true and apd.kdprofile = 30 and apd.statusenabled = true and pp.kdprofile = 30 and pp.statusenabled = true and 
            apd.tglmasuk between '$request[tglAwal]' and '$request[tglAkhir]' and ru.objectdepartemenfk = 3 and pd.tglpulang is not null and pp.strukfk is not null and ppd.komponenhargafk = 93"
        ));
        $res['profile'] = Profile::where('id',$request['kdprofile'])->first();
        // dd($res);
        $tglawal = $this->tanggal_indonesia(date('Y-m-d',strtotime($request['tglAwal'])));
        $tglakhir = $this->tanggal_indonesia(date('Y-m-d',strtotime($request['tglAkhir'])));
        return view("report.lab.rekap-pemeriksaan", compact("data", 'res','tglawal','tglakhir'));
    }
    
    public function cetakUDD(Request $request)
    {
        //variable
        $tgl = '';
        $waktu= '';
        $tempWaktu = '';

        //setting waktu
        if(isset($request['waktusiang'])){
            $waktu = 'SIANG';
            $tempWaktu = 'and pp.issiang = true';
        }
        if(isset($request['waktupagi'])){
            $waktu = 'PAGI';
            $tempWaktu = 'and pp.ispagi = true';
        }
        if(isset($request['waktumalam'])){
            $waktu = 'MALAM';
            $tempWaktu = 'and pp.ismalam = true';
        }
        //setting tgl
        if(isset($request['tglmalam'])){
            $tgl = explode(",",$request['tglmalam']);
        }
        if(isset($request['tglpagi'])){
            $tgl = explode(",",$request['tglpagi']);
        }
        if(isset($request['tglsiang'])){
            $tgl = explode(",",$request['tglsiang']);
        }
        
        //nocm
        $nocm = explode(",",$request['nocm']);
        $noresep = explode(",",$request['noorder']);
        $norec_apd= explode(",",$request['norec_apd']);
        $dataAll = [];
        $tglmain = '';
        $date = '';
        $detail = [];
        $result = [];
        $namapasien= '';        
        $tgllahir= '';
        $i=0;
        foreach ($nocm as $cm) {
            $pasien = \DB::select(DB::raw("SELECT ps.namapasien, ps.tgllahir::date 
            FROM pasien_m ps where ps.statusenabled=true and ps.kdprofile = $request[kodeprofile] and ps.nocm = '$cm'"));
            foreach ($pasien as $ps) {
                $namapasien = $ps->namapasien;
                $tgllahir = $ps->tgllahir;
            }
            $detail = [];
            $date = DB::select(DB::raw("SELECT generate_series('$tgl[$i]'::date, '$tgl[$i]'::date+6, '1 day'::interval)::date as tglcetak"));
            $eresep = '';
            $norec='';
            // var_dump($date);
            foreach ($date as $d) {
                $tglpelayanan = $d->tglcetak;
                $data = \DB::select(DB::raw("SELECT 
                case 
                when pp.satuanviewfk = 335 then 'tab' 
                when pp.satuanviewfk = 345 then 'kaps' 
                end as satuan, pr.namaproduk,split_part(pp.aturanpakai, 'x', 2) as aturan FROM pelayananpasien_t pp
                inner join strukresep_t sr on sr.norec = pp.strukresepfk
                inner join produk_m pr on pr.id = pp.produkfk
                where pp.isobat = true and pp.noregistrasifk ilike '$norec_apd[$i]' and sr.noresep ilike '$noresep[$i]' $tempWaktu "));
                $detailobat = $data; 
                $detail[]= array(
                'namapasien'=> $namapasien,
                'tgllahir'=> $tgllahir,
                'tglpelayanan'=> $tglpelayanan,
                'detailobat'=> $detailobat,
                'waktu'=> $waktu
                );
            }
            $result[]= $detail;
            $i++;

        }
        // dd($result);
        return view("report.apotik.cetak-udd", compact('result'));
        
    }
    public function cetakCakem(Request $request)
    {
        
        $data = \DB::select(DB::raw("
        SELECT ec.tanggal, ec.jam, ec.pelaksanaan,ec.evaluasi, pg.namalengkap FROM emrcakem_t ec 
        inner join pegawai_m pg on pg.id = ec.objectpegawaifk
        where emrpasienfk ilike '$request[noemr]'
        ORDER BY ec.tanggal asc, ec.jam asc
        "));
        $dataevaluasi = \DB::select(DB::raw("
        SELECT ec.tanggal, ec.emrpasienfk,ec.evaluasi, pg.namalengkap FROM emrcakem_t ec 
        inner join pegawai_m pg on pg.id = ec.objectpegawaifk
        where emrpasienfk ilike '$request[noemr]'
        GROUP BY ec.tanggal, ec.emrpasienfk,ec.evaluasi, pg.namalengkap
        "));
        $result = [];
        $detail = [];
        $evaluasi = '';
        $pelaksanaan = [];
        $jam = [];
        $tanggal = '';
        $namalengkap = '';
        foreach ($dataevaluasi as $ev) {
            $evaluasi = '';
            $tanggal = '';
            $namalengkap = '';
            $pelaksanaan = [];
            $jam = [];
            foreach ($data as $d) {
                if($ev->evaluasi == $d->evaluasi){
                    $tanggal = $ev->tanggal;
                    $evaluasi = $ev->evaluasi;
                    $namalengkap = $ev->namalengkap;
                    $pelaksanaan[]= $d->pelaksanaan;
                    $jam[]= $d->jam;
                }
            }
            $detail[]= array(
                'tanggal'=> $tanggal,
                'evaluasi'=> $evaluasi,
                'pelaksanaan'=>$pelaksanaan,
                'namalengkap'=>$namalengkap,
                'jam'=>$jam,
            );
        }
        $result = array(
            'data'=> $detail
        );
        // dd($data,$detail);
        return view("report.keperawatan.catatan-perkembangan", compact('result'));
    }
    public function cetakTilik(Request $request)
    {
        //variable
        $tglpagi = '';
        $tglsiang = '';
        $tglmalam = '';
        $waktu= '';
        $tempWaktu = '';

        //setting tgl
        if(isset($request['tglmalam'])){
            $tglmalam = explode(",",$request['tglmalam']);
        }
        if(isset($request['tglpagi'])){
            $tglpagi = explode(",",$request['tglpagi']);
        }
        if(isset($request['tglsiang'])){
            $tglsiang = explode(",",$request['tglsiang']);
        }
        
        //nocm
        $nocm = explode(",",$request['nocm']);
        $noresep = explode(",",$request['noorder']);
        $norec_apd= explode(",",$request['norec_apd']);
        $dataAll = [];
        $tglmain = '';
        $date = '';
        $detail = [];
        $result = [];
        $namapasien= '';        
        $tgllahir= '';
        $nocms= '';
        $i=0;
        $obat = [];
        foreach ($nocm as $cm) {
            
            $detail = [];
            $date = DB::select(DB::raw("SELECT generate_series('$tglmalam[$i]'::date, '$tglmalam[$i]'::date+6, '1 day'::interval)::date as tglcetakmalam,
            generate_series('$tglpagi[$i]'::date, '$tglpagi[$i]'::date+6, '1 day'::interval)::date as tglcetakpagi,
            generate_series('$tglsiang[$i]'::date, '$tglsiang[$i]'::date+6, '1 day'::interval)::date as tglcetaksiang
            "));
            $eresep = '';
            $norec='';
                $detailmalam = [];
                $detailpagi = [];
                $detailsiang = [];
                $detailobat = [];
                foreach ($date as $dd) {
                    $datamalam = \DB::select(DB::raw("SELECT 
                    case 
                    when pp.satuanviewfk = 335 then 'tab' 
                    when pp.satuanviewfk = 345 then 'kaps' 
                    end as satuan, pr.namaproduk,split_part(pp.aturanpakai, 'x', 2) as aturan, 
                    case when pp.satuanviewfk in(335,345) then 'Oral' 
                    when pp.satuanviewfk in(337) then 'Injeksi' end as
                    rute, pp.ismalam, pp.ispagi, pp.issiang FROM pelayananpasien_t pp
                    inner join strukresep_t sr on sr.norec = pp.strukresepfk
                    inner join produk_m pr on pr.id = pp.produkfk
                    left join routefarmasi rf on rf.id = pp.routefk
                    where pp.isobat = true and pp.noregistrasifk ilike '$norec_apd[$i]' and sr.noresep ilike '$noresep[$i]' and pp.ismalam = true"));
                    $datapagi = \DB::select(DB::raw("SELECT 
                    case 
                    when pp.satuanviewfk = 335 then 'tab' 
                    when pp.satuanviewfk = 345 then 'kaps' 
                    end as satuan, pr.namaproduk,split_part(pp.aturanpakai, 'x', 2) as aturan, 
                    case when pp.satuanviewfk in(335,345) then 'Oral' 
                    when pp.satuanviewfk in(337) then 'Injeksi' end as
                    rute, pp.ismalam, pp.ispagi, pp.issiang FROM pelayananpasien_t pp
                    inner join strukresep_t sr on sr.norec = pp.strukresepfk
                    inner join produk_m pr on pr.id = pp.produkfk
                    left join routefarmasi rf on rf.id = pp.routefk
                    where pp.isobat = true and pp.noregistrasifk ilike '$norec_apd[$i]' and sr.noresep ilike '$noresep[$i]' and pp.ispagi = true"));
                    $datasiang = \DB::select(DB::raw("SELECT 
                    case 
                    when pp.satuanviewfk = 335 then 'tab' 
                    when pp.satuanviewfk = 345 then 'kaps' 
                    end as satuan, pr.namaproduk,split_part(pp.aturanpakai, 'x', 2) as aturan, 
                    case when pp.satuanviewfk in(335,345) then 'Oral' 
                    when pp.satuanviewfk in(337) then 'Injeksi' end as
                    rute, pp.ismalam, pp.ispagi, pp.issiang FROM pelayananpasien_t pp
                    inner join strukresep_t sr on sr.norec = pp.strukresepfk
                    inner join produk_m pr on pr.id = pp.produkfk
                    left join routefarmasi rf on rf.id = pp.routefk
                    where pp.isobat = true and pp.noregistrasifk ilike '$norec_apd[$i]' and sr.noresep ilike '$noresep[$i]' and pp.issiang = true"));
                    //detailmalam
                    $obatmalam = '';
                    $satuanmalam = '';
                    $aturanmalam='';
                    $rutemalam='';
                    //detailpagi
                    $obatpagi = '';
                    $satuanpagi = '';
                    $aturanpagi='';
                    $rutepagi='';
                    //detailsiang
                    $obatsiang = '';
                    $satuansiang = '';
                    $aturansiang='';
                    $rutesiang='';
                    $detailobatmalam = [];                
                    $detailobatpagi = [];                
                    $detailobatsiang = [];    
                    foreach ($datamalam as $dm) {
                            $obatmalam = $dm->namaproduk;
                            $aturanmalam = $dm->aturan;
                            $satuanmalam = $dm->satuan;
                            $rutemalam = $dm->rute;
                       
                        $detailobatmalam[] = array(
                        'v'=> '',
                        'obatmalam'=> $obatmalam,
                        'aturanmalam'=> $aturanmalam,
                        'satuanmalam'=> $satuanmalam,
                        'rutemalam'=> $rutemalam,
                        
                        );
                    }
                    foreach ($datapagi as $dp) {
                            $obatpagi = $dp->namaproduk;
                            $aturanpagi = $dp->aturan;
                            $satuanpagi = $dp->satuan;
                            $rutepagi = $dp->rute;
                      
                        $detailobatpagi[] = array(
                        'v'=> '',
                        'obatpagi'=> $obatpagi,
                        'aturanpagi'=> $aturanpagi,
                        'satuanpagi'=> $satuanpagi,
                        'rutepagi'=> $rutepagi,
                       
                        );
                    }
                    foreach ($datasiang as $ds) {
                            $obatsiang = $ds->namaproduk;
                            $aturansiang = $ds->aturan;
                            $satuansiang = $ds->satuan;
                            $rutesiang = $ds->rute;
                       
                        $detailobatsiang[] = array(
                        'v'=> '',
                        'obatsiang'=> $obatsiang,
                        'aturansiang'=> $aturansiang,
                        'satuansiang'=> $satuansiang,
                        'rutesiang'=> $rutesiang,
                       
                        );
                    }
                    $detailobat[] = array(
                        'obatmalam'=> $detailobatmalam,
                        'obatpagi'=> $detailobatpagi,
                        'obatsiang'=> $detailobatsiang,
                        'tglpagi'=> $dd->tglcetakpagi,
                        'tglsiang'=> $dd->tglcetaksiang,
                        'tglmalam'=> $dd->tglcetakmalam,
                        'waktumalam'=> 'MALAM',
                        'waktusiang'=> 'SIANG',
                        'waktupagi'=> 'PAGI',
                    );
                    $detailobatmalam = null;                
                    $detailobatpagi = null;                
                    $detailobatsiang = null;                
                }
                $detail = $detailobat;
                $obat=null;
            $pasien = \DB::select(DB::raw("SELECT ps.namapasien, ps.tgllahir::date, ps.nocm 
            FROM pasien_m ps where ps.statusenabled=true and ps.kdprofile = $request[kodeprofile] and ps.nocm = '$cm'"));
            foreach ($pasien as $ps) {
                $namapasien = $ps->namapasien;
                $tgllahir = $ps->tgllahir;
                $nocms = $ps->nocm;
            }
            $result[]= array(
                'namapasien'=>$namapasien,
                'tgllahir'=>$tgllahir,
                'nocm'=>$nocms,
                'details'=> $detail,
            );
            $i++;
        }
        $pageWidth = 1300;
        return view("report.apotik.cetak-tilik", compact('result','pageWidth'));
    }
    public function persetujuanUmum(Request $request)
    {
        $data = \DB::select(DB::raw("SELECT ps.saksipersetujuan, ps.pjpersetujuan, ps.kerahasiaan1,ps.kerahasiaan2,ps.kerahasiaan3,ps.kerahasiaan4,
        ps.privasi1,ps.privasi2,ps.privasi3,ps.privasi4,ps.ismengizinkan, pg.id, pg.namalengkap  
        from pasiendaftar_t pd 
        inner join pasien_m ps on ps.id = pd.nocmfk
        left join pegawai_m pg on pg.id = pd.objectpetugasinformasifk
        where pd.norec ilike '$request[norec_pd]' and pd.kdprofile = $request[kdprofile] and pd.statusenabled = true
        "));
        foreach($data as $d){
            $d->saksi = $request['saksi'];
            $d->penanggungjawab = $request['penanggungjawab'];
            $d->tglnow = $this->tanggal_indonesia(date('Y-m-d'));
            $d->waktu = date('H:i');
        }
        $pageWidth = 1300;
        return view("report.EMR.persetujuan-umum", compact('data','pageWidth'));
    }
}