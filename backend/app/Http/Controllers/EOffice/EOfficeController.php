<?php
/**
 * Created by PhpStorm.
 * User: nengepic
 * Date: 12/3/2020
 * Time: 1:26 AM
 */


namespace App\Http\Controllers\EOffice;
use App\Master\MapJenisSuratToSubJenisSurat;
use App\Traits\Valet;
use App\Transaksi\Disposisi;
use App\Transaksi\HeadSurat;
use App\Transaksi\RiwayatRealisasi;
use App\Transaksi\StrukKonfirmasi;
use App\Transaksi\StrukOrder;
use App\Transaksi\StrukSurat;
use App\Transaksi\StrukKirim;
use App\Master\LoginUser;
use App\Transaksi\StrukVerifikasi;
use Illuminate\Http\Request;
use App\Http\Requests;
use Illuminate\Support\Facades\DB;
use Response;
use App\Http\Controllers\ApiController;

class EOfficeController extends ApiController
{
    use Valet;

    public function __construct()
    {
        parent::__construct($skip_authentication = false);
    }
    public function getComboSurat(Request $request){
        // return $this->respond((int) $this->getDataKdProfile($request)) ;
        $req = $request->all();
        $dataLogin = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk','lu.objectkelompokuserfk')
            ->where('lu.id',$dataLogin['userData']['id'])
            ->where('lu.kdprofile',(int) $this->getDataKdProfile($request))
            ->first();
        $tipesurat  = \DB::table('tipepengirimsurat_m as st')
            ->select('st.id','st.name')
            ->where('st.statusenabled',true)
            ->orderBy('st.name')
            ->get();
        $sifatsurat  = \DB::table('sifatsurat_m as st')
            ->select('st.id','st.name')
            ->where('st.statusenabled',true)
            ->orderBy('st.name')
            ->get();
        $jenissurat  = \DB::table('jenissurat_m as st')
            ->select('st.id','st.name')
            ->where('st.statusenabled',true)
            ->orderBy('st.name')
            ->get();
        $subjenissurat  = \DB::table('subjenissurat_m as st')
            ->select('st.id','st.name')
            ->where('st.statusenabled',true)
            ->orderBy('st.name')
            ->get();
        $jenisarsip  = \DB::table('jenisarsip_m as st')
            ->select('st.id','st.name')
            ->where('st.statusenabled',true)
            ->orderBy('st.name')
            ->get();
        $statusBerkas  = \DB::table('statusberkas_m as st')
            ->select('st.id','st.name')
            ->where('st.statusenabled',true)
            ->orderBy('st.name')
            ->get();
        $Instalasi  = \DB::table('departemen_m as st')
            ->select('st.id','st.namadepartemen','st.kodeexternal')
            ->where('st.statusenabled',true)
            ->orderBy('st.namadepartemen')
            ->get();
        $StatusEditing = \DB::table('statusediting_m as st')
            ->select('st.id','st.statusediting')
            ->where('st.statusenabled',true)
            ->orderBy('st.statusediting')
            ->get();

        $jmlSuratThn = DB::select(DB::raw("select count(norec) as jml from struksurat_t where tglsurat between '2021-01-01 00:00' and '2021-12-31';"));
        $jmlSuratThn = (int)$jmlSuratThn[0]->jml + 1;
        $jmlSuratThn = $invID = str_pad($jmlSuratThn, 4, '0', STR_PAD_LEFT);
        $array_bln = array(1=>"I","II","III", "IV", "V","VI","VII","VIII","IX","X", "XI","XII");
        $bln = $array_bln[date('n')];    

//      $noSurat = $jmlSuratThn . "/RSJP/#KDSUBJENISSURAT#/#KDINSTALASI#/" . $bln . "/" . date("Y") ;
        $noSurat = "0000" . "/#KDSUBJENISSURAT#/#KDINSTALASI#/" . $bln . "/" . date("Y") ;

        $result = array(
            'datalogin'=> $dataLogin,
            'datapegawai' => $dataPegawai,
            'tipesurat' => $tipesurat,
            'sifatsurat' => $sifatsurat,
            'jenissurat' => $jenissurat,
            'subjenissurat' => $subjenissurat,
            'jenisarsip' => $jenisarsip,
            'statusberkas' => $statusBerkas,
            'nosurat' => $noSurat,
            'instalasi' => $Instalasi,
            'statusediting' => $StatusEditing,
            'by' => 'as@epic',
        );

        return $this->respond($result);
    }
    
    public function getLoginUser(Request $request){
        // return $this->respond((int) $this->getDataKdProfile($request)) ;
        $req = $request->all();
        $dataLogin = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk','lu.objectkelompokuserfk')
            ->where('lu.id',$dataLogin['userData']['id'])
            ->where('lu.kdprofile',(int) $this->getDataKdProfile($request))
            ->first();
            
        $jenissurat  = \DB::table('jenissurat_m as st')
            ->select('st.*')
            ->where('st.statusenabled',true)
            ->orderBy('st.name')
            ->get();

        $result = array(
            'datalogin'=> $dataLogin,
            'datapegawai' => $dataPegawai,
            'jenissurat' => $jenissurat,
            'by' => 'as@epic',
        );

        return $this->respond($result);
    }
    public function simpanSurat(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $dataLogin = $request->all();
        $hNorec = "";
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->join('pegawai_m as pg','pg.id','=','lu.objectpegawaifk')
            ->select('lu.objectpegawaifk','pg.namalengkap')
            ->where('lu.id',$dataLogin['userData']['id'])
            ->where('lu.kdprofile',(int)$kdProfile)
            ->first();
            $idPegawai = $dataPegawai->objectpegawaifk;
        \DB::beginTransaction();
         try {
            if ($request['norec'] == "-"){
                $dataH = new HeadSurat();
                $dataH->kdprofile = $kdProfile;
                $dataH->statusenabled = true;
                $dataH->norec = $dataH->generateNewId();

                $data = new StrukSurat();
                $data->kdprofile = $kdProfile;
                $data->statusenabled = true;
                $data->norec = $data->generateNewId();
                // if ($request['nosurat'] == 'undefined') {
                //     $nosurat = $this->generateCodeBySeqTable(new StrukSurat, 'nosurat', 15, 'RSUD/' . $this->getDateTime()->format('yyyy') . '/', $kdProfile);
                //     $data->nosurat = $nosurat;
                // }
            }else{
                if($request['statuseditrevisi'] == "edit"){
                    $data = StrukSurat::where('norec', $request['norec'])
                            ->first();
                    $dataH = HeadSurat::where('norec', $request['norec_head'])
                             ->first();
                    $data->nosurat=$request['nosurat'];
                }
                if($request['statuseditrevisi'] == "revisi"){
                    $dataH = HeadSurat::where('norec', $request['norec_head'])
                             ->first();
                    $dataUpdate = StrukSurat::where('nosurat', $request['nosurat'])
                        ->update([
                                'isaktif' => 0
                            ]);
                    // $data->nosurat=$request['nosurat'];
                    $data = new StrukSurat();
                    $data->kdprofile = $kdProfile;
                    $data->statusenabled=true;
                    $data->norec = $data->generateNewId();
                }else{
                    $data = StrukSurat::where('norec', $request['norec'])
                            ->first();
                    if(isset( $request['norec_head'])){
                        $dataH = HeadSurat::where('norec', $request['norec_head'])
                        ->first();
                    }else{
                        $dataH = HeadSurat::where('norec', $data->headsuratfk)
                        ->first();
                        
                    }    
                    
                }
            }
            if(isset($dataH)){
                if ($request['nosurat'] != 'undefined')  {
                    $dataH->nosurat = $request['nosurat'];
                }
                if ($request['tglsurat'] != 'undefined') {
                    $dataH->tglsurat = $request['tglsurat'];
                }
                if ($request['namasurat'] != 'undefined') {
                    $dataH->namasurat = $request['namasurat'];
                }
                $dataH->save();
                $hNorec = $dataH->norec;
            }

            $uploadedFileSip = $request->file('file');
            $nosurat = $request['nosurat'];
//            $pegawai = Pegawai::where('id',$request['idPegawai'])->first();
            if(!empty($uploadedFileSip)){
                $extensionSip = $uploadedFileSip->getClientOriginalExtension();

                $filenameSip = 'Docu-'.str_replace('/','-',$nosurat).'.'.$extensionSip;

                $data->filename = $filenameSip;
            }
//            return $this->respond($request);
            if ($request['nosurat'] != 'undefined') {
                $data->nosurat = $request['nosurat'];
            }
            if ($request['tglsurat'] != 'undefined') {
                $data->tglsurat=$request['tglsurat'];
            }
            $data->namasurat =$request['namasurat'];
            
            if (isset($request['objecttipesuratfk']) && $request['objecttipesuratfk'] != 'null') {
                $data->objecttipesuratfk = $request['objecttipesuratfk'];
            }
            if (isset($request['objectsifatsuratfk']) && $request['objectsifatsuratfk'] !=  'null') {
                $data->objectsifatsuratfk = $request['objectsifatsuratfk'];
            }
            if (isset($request['objectjenissuratfk'])&& $request['objectjenissuratfk'] !=  'null') {
                $data->objectjenissuratfk = $request['objectjenissuratfk'];
            }
            if (isset($request['objectjenisarsipfk']) && $request['objectjenisarsipfk']  !=  'null') {
                $data->objectjenisarsipfk = $request['objectjenisarsipfk'];
            }
            if (isset($request['jangkawaktu']) && $request['jangkawaktu']  !=  'null') {
                $data->jangkawaktu = $request['jangkawaktu'];
            }
            if (isset($request['asalsurat']) && $request['asalsurat'] !=  'null') {
                $data->asalsurat = $request['asalsurat'];
            }
            if (isset($request['penerimasurat']) &&$request['penerimasurat'] !=  'null') {
                $data->penerimasurat = $request['penerimasurat'];
            }
            if (isset($request['ruanganpenerima']) && $request['ruanganpenerima'] != 'null') {
                $data->ruanganpenerima = $request['ruanganpenerima'];
            }
            if (isset($request['ruanganpenerimafk']) && $request['ruanganpenerimafk'] != 'null') {
                $data->ruanganpenerimafk = $request['ruanganpenerimafk'];
            }
            if (isset($request['objectstatusberkasfk']) && $request['objectstatusberkasfk'] != 'null') {
                $data->objectstatusberkasfk = $request['objectstatusberkasfk'];
            }   
            if (isset( $request['perihal']) && $request['perihal'] != 'null'){
                $data->perihal = $request['perihal'];
            }
            if (isset($request['lampiranperihal']) && $request['lampiranperihal'] != 'null') {
                $data->lampiranperihal = $request['lampiranperihal'];
            }
            if (isset($request['revisike']) && $request['revisike'] != 'null') {
                $data->revisike = $request['revisike'];
            }
            // if ($request['tglrevisi'] != 'undefined') {
                $data->tglrevisi = date('Y-m-d H:i:s');
            // }
            if (isset($request['objectstatusfk']) && $request['objectstatusfk'] != 'null') {
                $data->objectstatusfk = $request['objectstatusfk'];
            }
            if (isset($request['objectdepartemenfk']) && $request['objectdepartemenfk'] != 'null') {
                $data->objectdepartemenfk = $request['objectdepartemenfk'];
            }
            if (isset($request['unitpembuat']) && $request['unitpembuat'] != 'null') {
                $data->unitpembuat = $request['unitpembuat'];
            }
            if (isset($request['keteranganrevisi']) && $request['keteranganrevisi'] != 'null') {
                $data->keteranganrevisi = $request['keteranganrevisi'];
            }
            if (isset($request['wyswyg']) && $request['wyswyg'] == 'null') {
                $data->wyswyg = $request['wyswyg'];
            }
            if (isset($request['unitkerjafk']) && $request['unitkerjafk'] != 'null') {
                $data->unitkerjafk = $request['unitkerjafk'];
            }
            if (isset($request['subjenissuratfk']) && $request['subjenissuratfk'] != 'null') {
                $data->subjenissuratfk = $request['subjenissuratfk'];
            }
            $data->objectkelompoktransaksifk = $request['objectkelompoktransaksifk'];
            $data->isaktif = 1;
            $data->objectpegawaifk = $idPegawai;
            $data->headsuratfk = $hNorec;
            $data->save();
            $norec =  $data->norec ;
            if(!empty($uploadedFileSip)) {
                $request->file('file')->move('EOffice/File/'.$norec,
                    $filenameSip);
            }

             $transStatus = 'true';
         } catch (\Exception $e) {
            $transStatus = 'false';
         }

        if ($transStatus == 'true') {
            $transMessage = "Sukses ";
            DB::commit();
            $result = array(
                "status" => 201,
                "head" => isset($dataH) ?$dataH:null,
                "data" => $data,
                "as" => 'as@epic'
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'as@epic',
                "e" => $e->getMessage().' '. $e->getLine()
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDaftarSurat(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $norec=$request['norec'];
        $nrc ='';
        if ($norec != '-'){
            $nrc = " and ss.norec='$norec'";
        }
        $kelompok=$request['kelompok'];
        $klp ='';
        if ($kelompok != '-'){
            $klp = " and ss.objectkelompoktransaksifk='$kelompok'";
        }
        $srtUnitKerja = "";
        if (isset($request['unitKerja']) && $request['unitKerja']!=''){
            $srtUnitKerja = " AND ss.unitkerjafk = " . $request['unitKerja'];
        }

        $srtTipe = "";
        if (isset($request['tipeSurat']) && $request['tipeSurat']!=''){
            $srtTipe = " AND ss.objecttipesuratfk = " . $request['tipeSurat'];
        }

        $srtJenisSurat = "";
        if (isset($request['jenisSurat']) && $request['jenisSurat']!=''&& $request['jenisSurat']!='undefined'){
            $srtJenisSurat = " AND ss.objectjenissuratfk = " . $request['jenisSurat'];
        }

        $srtjenisArsip = "";
        if (isset($request['jenisArsip']) && $request['jenisArsip']!=''){
            $srtjenisArsip = " AND ss.objectjenisarsipfk = " . $request['jenisArsip'];
        }

        $srtstatusBerkas = "";
        if (isset($request['statusBerkas']) && $request['statusBerkas']!=''){
            $srtstatusBerkas = " AND ss.objectstatusberkasfk = " . $request['statusBerkas'];
        }
        $data = DB::select(DB::raw("
            select hs.norec AS norec_head,ss.*,tp.name as tipesurat,sfs.name as sifatsurat,js.name as jenissurat,ja.name as jenisarsip,
                   sb.name as statusberkas,dp.namadepartemen,se.statusediting,pg.namalengkap,ss.wyswyg,ss.ruanganpenerimafk,
                   ru.namaruangan,sv.objectpegawaipjawabfk,pg1.namalengkap as petugasverif,ru1.namaruangan AS unitkerja,hs.verifikasifk as statverif,
                   hs.verifikasidirekturfk as statverifdir
            from headsurat_t AS hs
            INNER JOIN struksurat_t as ss ON ss.headsuratfk = hs.norec
            left JOIN tipepengirimsurat_m tp on tp.id=ss.objecttipesuratfk
            left JOIN sifatsurat_m sfs on sfs.id=ss.objectsifatsuratfk
            left JOIN jenissurat_m js on js.id=ss.objectjenissuratfk
            left JOIN jenisarsip_m ja on ja.id=ss.objectjenisarsipfk
            left JOIN statusberkas_m sb on sb.id=ss.objectstatusberkasfk
            left JOIN departemen_m dp on dp.id=ss.objectdepartemenfk
            left JOIN statusediting_m se on se.id=ss.objectstatusfk
            left JOIN pegawai_m pg on pg.id=ss.objectpegawaifk            
            left JOIN strukkirim_t sk on sk.nostruksuratfk = ss.norec
            left join ruangan_m as ru on ru.id = ss.ruanganpenerimafk
            left join strukverifikasi_t as sv on sv.norec = hs.verifikasifk
            left JOIN pegawai_m pg1 on pg1.id = sv.objectpegawaipjawabfk
            left JOIN ruangan_m as ru1 on ru1.id = ss.unitkerjafk     
            where ss.statusenabled = true 
            and ss.kdprofile = $kdProfile 
            and ss.isaktif = 't'
            -- and ss.tglsurat BETWEEN '$tglAwal' AND '$tglAkhir' 
            $nrc 
            $klp
            $srtUnitKerja
            $srtTipe
            $srtJenisSurat
            $srtjenisArsip
            $srtstatusBerkas
            Order by ss.tglsurat,ss.nosurat DESC
          ")
        );
        $result = array(
            'daftar' => $data,
            'by' => 'as@epic',
        );
        return $result;
    }
    public function getRiwayatSurat(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $nosurat=$request['nosurat'];
        $nrc ='';
        if ($nosurat != '-'){
            $nrc = " and ss.nosurat='$nosurat'";
        }
        $data = DB::select(DB::raw("select ss.*,tp.name as tipesurat,sfs.name as sifatsurat,js.name as jenissurat,ja.name as jenisarsip,
            sb.name as statusberkas,pg.namalengkap
             from struksurat_t as ss
             left JOIN tipepengirimsurat_m tp on tp.id=ss.objecttipesuratfk
            left JOIN sifatsurat_m sfs on sfs.id=ss.objectsifatsuratfk
            left JOIN jenissurat_m js on js.id=ss.objectjenissuratfk
            left JOIN jenisarsip_m ja on ja.id=ss.objectjenisarsipfk
            left JOIN statusberkas_m sb on sb.id=ss.objectstatusberkasfk
            left JOIN pegawai_m pg on pg.id=ss.objectpegawaifk
            where ss.kdprofile = $kdProfile $nrc order by ss.revisike")
        );
        $all = $request->all();
        $result = array(
            'daftar' => $data,
            'data' => $all,
            'by' => 'as@epic',
        );
        return $result;
    }
    public function getTemplateSurat(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $nosurat=$request['nosurat'];
        $nrc ='';
        if ($nosurat != '-'){
            $nrc = " and ss.nosurat='$nosurat'";
        }
        $data = DB::select(DB::raw("select ss.*,tp.name as tipesurat,sfs.name as sifatsurat,js.name as jenissurat,ja.name as jenisarsip,
            sb.name as statusberkas,pg.namalengkap
             from struksurat_t as ss
             left JOIN tipepengirimsurat_m tp on tp.id=ss.objecttipesuratfk
            left JOIN sifatsurat_m sfs on sfs.id=ss.objectsifatsuratfk
            left JOIN jenissurat_m js on js.id=ss.objectjenissuratfk
            left JOIN jenisarsip_m ja on ja.id=ss.objectjenisarsipfk
            left JOIN statusberkas_m sb on sb.id=ss.objectstatusberkasfk
            left JOIN pegawai_m pg on pg.id=ss.objectpegawaifk
            where ss.kdprofile = $kdProfile and ss.objectkelompoktransaksifk=155 order by ss.revisike")
        );
        $all = $request->all();
        $result = array(
            'daftar' => $data,
            'data' => $all,
            'by' => 'as@epic',
        );
        return $result;
    }
    public function simpanDisposisi(Request $request){
        \DB::beginTransaction();
        $kdProfile = (int) $this->getDataKdProfile($request);

       try {
        if ($request['norec'] == "-"){
            $data = new Disposisi();
            $data->kdprofile = $kdProfile;
            $data->statusenabled=true;
            $data->norec = $data->generateNewId();
        }else{
            $data = Disposisi::where('nosuratfk', $request['nosuratfk'])
                ->first();
        }
           $data->nosuratfk=$request['nosuratfk'];
           $data->headsuratfk=$request['norec_head'];
           $data->catatan=$request['catatan'];
           $data->hal=$request['hal'];
           $data->nosurat=$request['nosurat'];
           $data->objectpegawaiasalsuratfk=$request['objectpegawaiasalsuratfk'];
           $data->objectsifatsuratfk=$request['objectsifatsuratfk'];
           $data->tanggal=$request['tanggal'];
           $data->objectpegawaidisampaikanfk=$request['objectpegawaidisampaikanfk'];
           $data->objectditeruskankefk=$request['objectditeruskankefk'];
           $data->diteruskanke=$request['diteruskanke'];
           $data->instruksi=$request['instruksi'];
           $data->list=$request['list'];
           $data->batas=$request['batas'];
//           $data->instruksi =$request['instruksi'];
//           $data->catatan = $request['catatan'];
//           $data->objectditeruskankefk = $request['diteruskanke'];
//           $data->tanggal = $this->getDateTime();
           $data->save();
           $norec =  $data->norec ;

           if (isset($request['objectsifatsuratfk'])){
               $struk = StrukSurat::where('norec', $request['nosuratfk'])
                        ->where('kdprofile',$kdProfile)
                        ->update([
                            'objectsifatsuratfk' => $request['objectsifatsuratfk']
                        ]);
           }

           $transStatus = 'true';
       } catch (\Exception $e) {
        $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            \DB::commit();
            $result = array(
                "status" => 201,
                "norec" => $data,
                "as" => 'as@epic'
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'as@epic'
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    
    public function simpanDistribusi(Request $request){
        \DB::beginTransaction();
        $kdProfile = (int) $this->getDataKdProfile($request);
       try {
    
        $noKirim = $this->generateCodeBySeqTable(new StrukKirim, 'nokirim', 10, 'TRFD' . $this->getDateTime()->format('yyyy') . '/', $kdProfile);
        if (!isset($request['norec'] )){
            $data = new StrukKirim();
            $data->kdprofile = $kdProfile;
            $data->statusenabled=true;
            $data->norec = $data->generateNewId();

        }else{
            $data = StrukKirim::where('nosuratfk', $request['nosuratfk'])
                ->first();
        }

        $data->nostruksuratfk=$request['nosuratfk'];
        $data->objectruanganfk = $request['objectruanganfk'];
        $data->objectkelompoktransaksifk = 154;
        $data->nokirim = $noKirim;
        $data->tglkirim = $this->getDateTime();
        $data->qtydetailjenisproduk = 0;
        $data->qtyproduk = 0;
        $data->totalbeamaterai = 0;
        $data->totalbiayakirim = 0;
        $data->totalbiayatambahan = 0;
        $data->totaldiscount = 0;
        $data->totalhargasatuan = 0;
        $data->totalharusdibayar = 0;
        $data->totalpph = 0;
        $data->totalppn = 0;
        $data->save();
        $norec =  $data->norec ;
           $transStatus = 'true';
       } catch (\Exception $e) {
        $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Sukses ";
            \DB::commit();
            $result = array(
                "status" => 201,
                "norec" => $data,
                "as" => 'as@epic'
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "e" => $e->getMessage().' '.$e->getLine(),
                "as" => 'as@epic'
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function hapusDistribusi(Request $request){
        \DB::beginTransaction();
        $kdProfile = (int) $this->getDataKdProfile($request);
       try {
    

           $data = StrukKirim::where('norec', $request['norec'])
               ->delete();

           $transStatus = 'true';
       } catch (\Exception $e) {
        $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Sukses ";
            \DB::commit();
            $result = array(
                "status" => 201,
                "norec" => $data,
                "as" => 'as@epic'
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'as@epic'
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function hapusTemplate(Request $request){
        \DB::beginTransaction();
        $kdProfile = (int) $this->getDataKdProfile($request);
       try {
    

           $data = StrukSurat::where('norec', $request['norec'])
               ->delete();

           $transStatus = 'true';
       } catch (\Exception $e) {
        $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Sukses ";
            \DB::commit();
            $result = array(
                "status" => 201,
                "norec" => $data,
                "as" => 'as@epic'
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'as@epic'
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getRiwayatDisposisi(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $norec=$request['nosuratfk'];
        $data = DB::select(DB::raw("
        SELECT ds.nosuratfk,ds.norec,ds.tanggal,ds.instruksibalasan as instruksi,ds.catatan,pg.namalengkap AS diteruskanke,
			   ds.objectditeruskankefk,pg.namalengkap,sv.tglverifikasi,sv.noverifikasi,ds.statuseditingfk,
			   se.statusediting
        FROM disposisi_t ds
        LEFT JOIN pegawai_m pg on pg.id = ds.objectditeruskankefk
        LEFT JOIN strukverifikasi_t AS sv ON sv.norec = ds.noverifikasifk
        LEFT JOIN statusediting_m AS se ON se.id = ds.statuseditingfk
        where ds.kdprofile = $kdProfile 
        AND ds.statusenabled = true
        AND ds.noverifikasifk IS NOT NULL 
        AND ds.nosuratfk='$norec';")
        );
        $result = array(
            'daftar' => $data,
            'by' => 'as@epic',
        );
        return $result;
    }
    
    public function getRiwayatDistribusi(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $norec=$request['nosuratfk'];
        $data = DB::select(DB::raw("select ds.norec, ds.tglkirim, ds.nokirim,ru.namaruangan
        from strukkirim_t ds
        left join ruangan_m ru on ru.id=ds.objectruanganfk where ds.nostruksuratfk='$norec';")
        );
        $result = array(
            'daftar' => $data,
            'by' => 'as@epic',
        );
        return $result;
    }

    public function getDataDisposisiPetugas(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $data = DB::table('disposisi_t AS dp')
                ->join('pegawai_m AS pg','pg.id','=','dp.objectditeruskankefk')
                ->join('struksurat_t AS ss','ss.norec','=','dp.nosuratfk')
                ->leftjoin('strukverifikasi_t AS sv','sv.norec','=','dp.noverifikasifk')
                ->leftjoin('sifatsurat_m AS sfs','sfs.id','=','ss.objectsifatsuratfk')
                ->leftjoin('jenissurat_m AS js','js.id','=','ss.objectjenissuratfk')
                ->leftjoin('jenisarsip_m AS ja','ja.id','=','ss.objectjenisarsipfk')
                ->leftjoin('statusberkas_m AS sb','sb.id','=','ss.objectstatusberkasfk')
                ->leftjoin('statusediting_m AS se','se.id','=','ss.objectstatusfk')
                ->leftjoin('pegawai_m AS pg1','pg1.id','=','ss.objectpegawaifk')
                ->leftjoin('tipepengirimsurat_m AS tp','tp.id','=','ss.objecttipesuratfk')
                ->leftjoin('departemen_m AS dept','dept.id','=','ss.objectdepartemenfk')
                ->selectRaw("
                    ss.*,dp.norec AS norec_ds,dp.tanggal,dp.instruksi,dp.catatan,dp.diteruskanke,
                    dp.objectditeruskankefk,pg.namalengkap,dp.nosuratfk,sv.noverifikasi,sv.norec AS norec_sv,
                    tp.name as tipesurat,sfs.name as sifatsurat,js.name as jenissurat,ja.name as jenisarsip,
                    sb.name as statusberkas,dept.namadepartemen,se.statusediting,pg1.namalengkap,ss.wyswyg
                ")
                ->where('ss.kdprofile', $kdProfile)
                ->where('ss.statusenabled', true);
        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('dp.tanggal', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $data = $data->where('dp.tanggal', '<=', $request['tglAkhir']);
        }
        if (isset($request['petugasfk']) && $request['petugasfk'] != "" && $request['petugasfk'] != "undefined") {
            $data = $data->where('dp.objectditeruskankefk', '=', $request['petugasfk']);
        }
        $data = $data->get();
        $result = array(
            'daftar' => $data,
            'by' => 'as@epic',
        );
        return $result;
    }

    public function simpanVerifDisposisi(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tglAyeuna = date('Y-m-d H:i:s');
    
        \DB::beginTransaction();
       try {
            $noVerifikasi = $this->generateCodeBySeqTable(new StrukVerifikasi,
            'noverifikasi', 12, 'DR/' . $this->getDateTime()->format('ym') . '/', $kdProfile);
            if ($noVerifikasi == ''){
                $transMessage = "Gagal mengumpukan data, Coba lagi.!";
                \DB::rollBack();
                $result = array(
                    "status" => 400,
                    "message"  => $transMessage,
                    "as" => 'as@epic',
                );
                return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }
            $data = new StrukVerifikasi();
            $data->kdprofile = $kdProfile;
            $data->statusenabled = true;
            $data->norec = $data->generateNewId();
            $data->objectkelompoktransaksifk = 301;
            $data->keteranganlainnya = "VERIFIKASI DISPOSISI SURAT";
            $data->objectpegawaipjawabfk = $request['idpegawai'];
            $data->namaverifikasi = "VERIFIKASI DISPOSISI SURAT";
            $data->noverifikasi = $noVerifikasi;
            $data->tglverifikasi = $tglAyeuna;
            $data->tgleksekusi = $tglAyeuna;
            $data->save();
            $norecSv =  $data->norec;

            $disposisi = Disposisi::where('norec', $request['norec_ds'])
                         ->where('kdprofile', $kdProfile)
                         ->update([
                             "instruksibalasan" => $request['instruksi'],
                             "catatan" => $request['catatan'],
                             "noverifikasifk" => $norecSv,
                             "statuseditingfk" => $request['status'],
                         ]);
           $transStatus = 'true';
       } catch (\Exception $e) {
            $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Verifikasi Berhasil";
            \DB::commit();
            $result = array(
                "status" => 201,
                "norec" => $data,
                "as" => 'as@epic'
            );
        } else {
            $transMessage = "Verifikasi Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'as@epic'
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function batalVerifDisposisi(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        \DB::beginTransaction();
      try {
            $verif = StrukVerifikasi::where('norec', $request['norec'])
                     ->where('kdprofile',$kdProfile)
                     ->update([
                         'statusenabled' => false,
                     ]);
            $disposisi = Disposisi::where('noverifikasifk', $request['norec'])
                ->where('kdprofile', $kdProfile)
                ->update([
                    "instruksi" => null,
                    "catatan" => null,
                    "noverifikasifk" => null
                ]);

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Batal Verifikasi Berhasil";
            \DB::commit();
            $result = array(
                "status" => 201,
                "as" => 'as@epic'
            );
        } else {
            $transMessage = "Batal Verifikasi Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'as@epic'
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function deleteSuratMasuk(Request $request){

        try {
            $filename = $request['namafile'];
            $path = public_path('EOffice/File/'.$request['norec'].'/');

            if (!\File::exists($path)) {
//                abort(404);
                $transStatus = 'false';
                DB::rollBack();
            }else{
                $file = \File::deleteDirectory($path);
            }

            StrukSurat::where('norec', $request['norec'])->update([
                "statusenabled" => false,
            ]);

            $transMessage = "Hapus Berhasil";
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Hapus Gagal";
        }

        if ($transStatus != 'false') {
            \DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "by" => 'er@epic',
            );
        } else {
            DB::rollBack();
            $result = array(

                "status" => 400,
                "message" => $transMessage,
                "by" => 'er@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDataDistribusiDokumen(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $data = DB::table('strukkirim_t AS sk')
            ->join('struksurat_t AS ss','ss.norec','=','sk.nostruksuratfk')
            ->leftjoin('disposisi_t AS dp','dp.nosuratfk','=','ss.norec')
            ->leftjoin('pegawai_m AS pg','pg.id','=','dp.objectditeruskankefk')
            ->leftjoin('strukverifikasi_t AS sv','sv.norec','=','dp.noverifikasifk')
            ->leftjoin('sifatsurat_m AS sfs','sfs.id','=','ss.objectsifatsuratfk')
            ->leftjoin('jenissurat_m AS js','js.id','=','ss.objectjenissuratfk')
            ->leftjoin('jenisarsip_m AS ja','ja.id','=','ss.objectjenisarsipfk')
            ->leftjoin('statusberkas_m AS sb','sb.id','=','ss.objectstatusberkasfk')
            ->leftjoin('statusediting_m AS se','se.id','=','ss.objectstatusfk')
            ->leftjoin('pegawai_m AS pg1','pg1.id','=','ss.objectpegawaifk')
            ->leftjoin('tipepengirimsurat_m AS tp','tp.id','=','ss.objecttipesuratfk')
            ->leftjoin('departemen_m AS dept','dept.id','=','ss.objectdepartemenfk')
            ->leftjoin('ruangan_m AS ru','ru.id','=','sk.objectruanganfk')
            ->selectRaw("
                    ss.*,dp.norec AS norec_ds,dp.tanggal,dp.instruksi,dp.catatan,dp.diteruskanke,
                    dp.objectditeruskankefk,pg.namalengkap,dp.nosuratfk,sv.noverifikasi,sv.norec AS norec_sv,
                    tp.name as tipesurat,sfs.name as sifatsurat,js.name as jenissurat,ja.name as jenisarsip,
                    sb.name as statusberkas,dept.namadepartemen,se.statusediting,pg1.namalengkap,ss.wyswyg,
                    sk.nokirim,sk.tglkirim,sk.objectruanganfk,ru.namaruangan
                ")
            ->where('ss.kdprofile', $kdProfile)
            ->where('ss.statusenabled', true);
        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('sk.tglkirim', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $data = $data->where('sk.tglkirim', '<=', $request['tglAkhir']);
        }
//        if (isset($request['petugasfk']) && $request['petugasfk'] != "" && $request['petugasfk'] != "undefined") {
//            $data = $data->where('dp.objectditeruskankefk', '=', $request['petugasfk']);
//        }
        if (isset($request['idruangan']) && $request['idruangan'] != "" && $request['idruangan'] != "undefined") {
            $data = $data->where('sk.objectruanganfk', '=', $request['idruangan']);
        }
        $data = $data->get();
        $result = array(
            'daftar' => $data,
            'by' => 'as@epic',
        );
        return $result;
    }

    public function getComboMapping (Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);

        $JenisSurat = collect(DB::select("
            SELECT id,name AS jenissurat 
            FROM jenissurat_m
            WHERE statusenabled = TRUE 
            AND kdprofile = $kdProfile
        "));

        $SubJenisSurat = collect(DB::select("
            SELECT id,name AS subjenissurat 
            FROM subjenissurat_m
            WHERE statusenabled = TRUE 
            AND kdprofile = $kdProfile
        "));

        $result = array(
            'jenissurat' => $JenisSurat,
            'subjenissurat' => $SubJenisSurat,
            'as' => 'ea@epic'
        );
        return $this->respond($result);
    }
    public function getMappingJenisSuratToSubJenisSurat (Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $paket = DB::table('mapjenissurattosubjenissurat_m as maps')
            ->join('jenissurat_m as pak','pak.id','=','maps.jenissuratfk')
            ->join('subjenissurat_m as prd','prd.id','=','maps.subjenissuratfk')
            ->select('maps.*','pak.name as jenissurat','prd.name as subjenissurat')
            ->where('maps.statusenabled',true)
            ->where('maps.kdprofile',$kdProfile);

        if(isset($request['JenisSurat']) && $request['JenisSurat'] !='' ){
            $paket = $paket->where('maps.jenissuratfk',$request['JenisSurat']);
        }
        if(isset($request['subJenisSurat']) && $request['subJenisSurat'] !='' ){
            $paket = $paket->where('prd.name','ilike','%'.$request['subJenisSurat'].'%');
        }
        $paket = $paket->get();
        $result = array(
            'data' => $paket,
            'as' => 'ea@epic'
        );
        return $this->respond($result);
    }

    public function saveMapJenisProdukToSubJenisProduk(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        try {
            foreach ( $request['details'] as $item){
                $kode[] = (double) $item['id'];
            }
            $hapus = MapJenisSuratToSubJenisSurat::where('statusenabled',true)
                ->where('jenissuratfk',$request['jenisSuratId'])
                ->whereIn('subjenissuratfk',$kode)
                ->delete();
            foreach ( $request['details'] as $item){
                $map = new MapJenisSuratToSubJenisSurat();
                $map->id = MapJenisSuratToSubJenisSurat::max('id') + 1;
                $map->kdprofile = $kdProfile;//12;
                $map->statusenabled = true;
                $map->norec =  substr(\Webpatser\Uuid\Uuid::generate(), 0, 32);
                $map->jenissuratfk = $request['jenisSuratId'];
                $map->subjenissuratfk = $item['id'];
                $map->save();
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();

            $result = array(
                'status' => 201,
                'data' => $map,
                'as' => 'er@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'as' => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function DeleteMapJenisProdukToSubJenisProduk(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        try {
            foreach ($request['data'] as $item){
                MapJenisSuratToSubJenisSurat::where('id',$item['id'])->where('kdprofile',$kdProfile)->delete();
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();

            $result = array(
                'status' => 201,
                'as' => 'er@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'as' => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDetailDaftarSurat(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $norec=$request['norec'];
        $nrc ='';
        if ($norec != '-'){
            $nrc = " and ss.norec='$norec'";
        }
        $kelompok=$request['kelompok'];
        $klp ='';
        if ($kelompok != '-'){
            $klp = " and ss.objectkelompoktransaksifk='$kelompok'";
        }
        $data = DB::select(DB::raw("
            select ss.*,tp.name as tipesurat,sfs.name as sifatsurat,js.name as jenissurat,ja.name as jenisarsip,
                   sb.name as statusberkas,dp.namadepartemen,se.statusediting,pg.namalengkap,ss.wyswyg,ss.ruanganpenerimafk,
                   ru.namaruangan,sjs.name as subjenissurat
            from struksurat_t as ss
            left JOIN tipepengirimsurat_m tp on tp.id=ss.objecttipesuratfk
            left JOIN sifatsurat_m sfs on sfs.id=ss.objectsifatsuratfk
            left JOIN jenissurat_m js on js.id=ss.objectjenissuratfk
            left JOIN jenisarsip_m ja on ja.id=ss.objectjenisarsipfk
            left JOIN statusberkas_m sb on sb.id=ss.objectstatusberkasfk
            left JOIN subjenissurat_m sjs on sjs.id=ss.subjenissuratfk
            left JOIN departemen_m dp on dp.id=ss.objectdepartemenfk
            left JOIN statusediting_m se on se.id=ss.objectstatusfk
            left JOIN pegawai_m pg on pg.id=ss.objectpegawaifk            
            left JOIN strukkirim_t sk on sk.nostruksuratfk = ss.norec
            left join ruangan_m as ru on ru.id = ss.ruanganpenerimafk           
            where ss.statusenabled = true 
            and ss.kdprofile = $kdProfile 
            and ss.isaktif = 't'            
            $nrc 
            $klp
            ")
        );
        $result = array(
            'daftar' => $data,
            'by' => 'as@epic',
        );
        return $result;
    }

    public function getComboSubJenisSurat(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $strIdJenisSurat = "";
        if (isset($request['idJenisSurat']) || $request['idJenisSurat'] != ""){
            $strIdJenisSurat = " AND maps.jenissuratfk = " . $request['idJenisSurat'];
        }
        $SubJenisSurat = collect(DB::select("
            SELECT sub.id,sub.name AS subjenissurat,sub.kodeexternal as kode
            FROM mapjenissurattosubjenissurat_m AS maps
            INNER JOIN subjenissurat_m AS sub ON sub.id = maps.subjenissuratfk
            WHERE maps.statusenabled = true AND maps.kdprofile = $kdProfile
            $strIdJenisSurat;
        "));

        return $this->respond($SubJenisSurat);
    }

    public function getKelUserEoffice(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $strKelUser = $this->settingDataFixed('KelUserEoffice',$kdProfile);
        $strKelUserManagement = $this->settingDataFixed('KelUserManagement',$kdProfile);
        $result = array(
            "dokumenkontrol" => $strKelUser,
            "management" => $strKelUserManagement,
        );
        return $this->respond($result);
    }

    public function saveVerifikasiDK (Request $request) {
        $idProfile = (int)$this->getDataKdProfile($request);
        \DB::beginTransaction();
        try{
                //#struk Verifikasi
                $noVerifikasi = $this->generateCode(new StrukVerifikasi(),
                    'noverifikasi', 10, 'CDK-'.$this->getDateTime()->format('Y'), $idProfile);
                $dataSV = new StrukVerifikasi();
                $dataSV->norec = $dataSV->generateNewId();
                $dataSV->noverifikasi = $noVerifikasi;
                $dataSV->kdprofile = $idProfile;
                $dataSV->statusenabled = true;
                $dataSV->objectkelompoktransaksifk = 302;
                $dataSV->keteranganlainnya = 'Verifikasi Dokumen Kontrol';
                $dataSV->objectpegawaipjawabfk = $request['objectpegawaipjawabfk'];
                $dataSV->namaverifikasi = 'Verifikasi Dokumen Kontrol';
                $dataSV->tglverifikasi = $request['tglverifikasi'];
                $dataSV->save();
                $dataNorec = $dataSV->norec;

                $dataSO = HeadSurat::where('norec', $request['norec_head'])
                    ->update([
                            'verifikasifk' => $dataNorec,
                        ]
                    );

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Verifikasi";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "data" => $dataSV,
                "as" => 'ea@epic',
            );
        } else {
            $transMessage = "Simpan Verifikasi Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "nokirim" => $request['strukorder']['norec'],
                "data" => $dataSV,
                "as" => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveVerifikasiDirektur (Request $request) {
        $idProfile = (int)$this->getDataKdProfile($request);
        \DB::beginTransaction();
        try{
            //#struk Verifikasi
            $noVerifikasi = $this->generateCode(new StrukVerifikasi(),
                'noverifikasi', 10, 'VDK-'.$this->getDateTime()->format('Y'), $idProfile);
            $dataSV = new StrukVerifikasi();
            $dataSV->norec = $dataSV->generateNewId();
            $dataSV->noverifikasi = $noVerifikasi;
            $dataSV->kdprofile = $idProfile;
            $dataSV->statusenabled = true;
            $dataSV->objectkelompoktransaksifk = 303;
            $dataSV->keteranganlainnya = 'Verifikasi Direktur';
            $dataSV->objectpegawaipjawabfk = $request['objectpegawaipjawabfk'];
            $dataSV->namaverifikasi = 'Verifikasi Direktur';
            $dataSV->tglverifikasi = $request['tglverifikasi'];
            $dataSV->save();
            $dataNorec = $dataSV->norec;

            $dataSO = HeadSurat::where('norec', $request['norec_head'])
                ->update([
                        'verifikasidirekturfk' => $dataNorec,
                    ]
                );

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Verifikasi";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "data" => $dataSV,
                "as" => 'ea@epic',
            );
        } else {
            $transMessage = "Simpan Verifikasi Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "nokirim" => $request['strukorder']['norec'],
                "data" => $dataSV,
                "as" => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getNomorSurat (Request $request) {
        $idProfile = (int)$this->getDataKdProfile($request);
        $nosurat = explode('/',$request['nosurat']);
        $seqname = "";
        if ($nosurat[1] == "PER" && $nosurat[2] == "PAN"){
            $seqname = $nosurat[1].'/'.$nosurat[2];
        }else{
            $seqname = $nosurat[1];
        }

        $dat = [
            "deptid" => $request['deptid'],
            "jenissurat" => $request['jenissurat'],
            "subjenissurat" => $request['subjenissurat']
        ];
        $nomor = $this->generateCodeBySeqSuratTable(new StrukSurat, $seqname, trim($nosurat[0]), $dat,$idProfile);
        $strNo = "";

        if (count($nosurat) == 5){
            $strNo = $nomor."/".$nosurat[1]."/".$nosurat[2]."/".$nosurat[3]."/".$nosurat[4];
        }elseif(count($nosurat) == 6){
            $strNo = $nomor."/".$nosurat[1]."/".$nosurat[2]."/".$nosurat[3]."/".$nosurat[4]."/".$nosurat[5];
        }else{
            $strNo = $nomor."/".$nosurat[1]."/".$nosurat[2];
        }
        return $this->respond($strNo);
    }
}