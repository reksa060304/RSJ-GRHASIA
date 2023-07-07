<?php
/**
 * Created by PhpStorm.
 * User: Egie Ramdan
 * Date: 11/22/2019
 * Time: 10:42 AM
 */
namespace App\Http\Controllers\Sanitasi;

use App\Http\Controllers\ApiController;
use App\Traits\Valet;
use App\Transaksi\PelayananLimbah;
use Illuminate\Http\Request;
use App\Transaksi\StrukPlanning;
use DB;
use App\Transaksi\StrukPlanningDetail;
use Webpatser\Uuid\Uuid;


class SanitasiController extends ApiController
{
    use Valet;

    public function __construct()
    {
        parent::__construct($skip_authentication = false);
    }
    public function getComboSanitasi(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $deptRanap = explode (',',$this->settingDataFixed('KdDepartemenSanitasi',$kdProfile));
        $kdDepartemenRawatInap = [];
        foreach ($deptRanap as $itemRanap){
            $kdDepartemenRawatInap []=  (int)$itemRanap;
        }

        $ruangSanitasi = \DB::table('ruangan_m as ru')
            ->select('ru.id','ru.namaruangan','ru.objectdepartemenfk')
            ->whereIn('ru.objectdepartemenfk', [47])
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();

        $ruangRI = \DB::table('ruangan_m as ru')
            ->select('ru.id','ru.namaruangan','ru.objectdepartemenfk')
            ->whereIn('ru.id', $kdDepartemenRawatInap)
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();

        $dataKelas = \DB::table('kelas_m as kl')
            ->select('kl.id', 'kl.namakelas')
            ->where('kl.statusenabled', true)
            ->orderBy('kl.namakelas')
            ->get();

        $dataKelasKamar = \DB::table('kelas_m as kl')
            ->select('kl.id', 'kl.namakelas')
            ->where('kl.statusenabled', true)
            ->orderBy('kl.namakelas')
            ->get();

        $datadept = \DB::table('departemen_m as dp')
            ->select('dp.id', 'dp.namadepartemen')
            ->where('dp.statusenabled', true)
            ->orderBy('dp.namadepartemen')
            ->get();

        $result = array(
            'rawatinap' => $ruangRI,
            'kelas' => $dataKelas,
            'kelaskamar' => $dataKelasKamar,
            'departemen' => $datadept,
            'rawatsanitasi' => $ruangSanitasi,
            'message' => 'cepot',
        );

        return $this->respond($result);
    }
    
    public function getTempatTidur(Request $request){
        $arrru = $request['arrru'];
        $kdProfile = (int) $this->getDataKdProfile($request);
        $data= \DB::table('ruangansanitasi_m as ru')
            ->leftjoin('strukplanning_t as spl', 'ru.id', '=', 'spl.objectruanganfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'spl.objectpegawaipjawabfk')
            ->leftjoin('pegawai_m as pg2', 'pg2.id', '=', 'spl.objectpegawaipjawabevaluasifk')
            ->select('ru.id as idruangan','ru.namaruangan',
                'spl.tglplanning','spl.objectpegawaipjawabfk','spl.startdate','spl.duedate','spl.deskripsiplanning',
                'spl.objectpegawaipjawabevaluasifk','spl.keteranganverifikasi','spl.norec'
                ,'pg.namalengkap','pg2.namalengkap as pegawaipj'
            )
            ->where('ru.kdprofile', $kdProfile)
            ->whereIn('ru.objectdepartemenfk',array($arrru))
            ->where('ru.statusenabled',true);
//            ->where('spl.objectkelompoktransaksifk',121);

        if(isset($request['desc']) && $request['desc']!="" && $request['desc']!="undefined"){
            $data = $data->where('ru.namaruangan','ilike','%'. $request['desc'] .'%');
        };
        if (isset($request['manage']) && $request['manage'] != "" && $request['manage'] != "undefined") {
//            $data = $data->where('spl.tglplanning','>', date('Y-m-d 00:00:00'));
        }else{
            $data = $data->whereBetween('spl.tglplanning', [ $request['tglAwal'],$request['tglAkhir'] ]);
        }
        $data = $data->get();


        return $this->respond($data);
    }
    public function SaveDataSignDate(Request $request) {
        DB::beginTransaction();
        $dataLogin = $request->all();
        $kdProfile = (int) $this->getDataKdProfile($request);
        try {
            if ($request['norec'] == ''){
                $newCOA = new StrukPlanning();
                $norecHead = $newCOA->generateNewId();
                $newCOA->kdprofile = $kdProfile;
                $newCOA->norec = $norecHead;
                $newCOA->statusenabled = 1;
            }else{
                $newCOA =  StrukPlanning::where('norec',$request['norec'])->where('kdprofile', $kdProfile)->first();
            }
//            $newCOA->signdate = $request['signdate'];
            $newCOA->objectruanganfk = $request['objectruanganfk'];
            $newCOA->deskripsiplanning = $request['deskripsiplanning'];
            //$newCOA->objectkelompoktransaksifk = 121;
            $newCOA->save();

            $norecHead2 = $newCOA->norec;

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "";


        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil" ;
            DB::commit();
            $result = array(
                "status" => 201,
//                "data" => $newPJT,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage ." Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
//                "data" => $newPJT,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }
    public function SaveDataAlokasiStaff(Request $request) {
        DB::beginTransaction();
        $dataLogin = $request->all();
        $kdProfile = (int) $this->getDataKdProfile($request);
        try {
            if ($request['norec'] == ''){
                $newCOA = new StrukPlanning();
                $norecHead = $newCOA->generateNewId();
                $newCOA->kdprofile = $kdProfile;
                $newCOA->norec = $norecHead;
                $newCOA->statusenabled = 1;
            }else{

                $newCOA =  StrukPlanning::where('norec',$request['norec'])->where('kdprofile', $kdProfile)->first();
            }
            $newCOA->objectpegawaipjawabfk = $request['objectpegawaipjawabfk'];
            $newCOA->save();

            $norecHead2 = $newCOA->norec;

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "";


        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil" ;
            DB::commit();
            $result = array(
                "status" => 201,
//                "data" => $newPJT,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage ." Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
//                "data" => $newPJT,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }
    public function SaveDataWorkList(Request $request) {
        DB::beginTransaction();
        $dataLogin = $request->all();
        $kdProfile = (int) $this->getDataKdProfile($request);
        try {
            if ($request['norec'] == ''){
                $newCOA = new StrukPlanning();
                $norecHead = $newCOA->generateNewId();
                $newCOA->kdprofile = $kdProfile;
                $newCOA->norec = $norecHead;
                $newCOA->statusenabled = 1;
            }else{

                $newCOA =  StrukPlanning::where('norec',$request['norec'])->where('kdprofile', $kdProfile)->first();
            }
            $newCOA->deskripsiplanning = $request['deskripsiplanning'];
            $newCOA->save();

            $norecHead2 = $newCOA->norec;

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "";


        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil" ;
            DB::commit();
            $result = array(
                "status" => 201,
//                "data" => $newPJT,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage ." Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
//                "data" => $newPJT,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }
    public function SaveDataInspeksi(Request $request) {
        DB::beginTransaction();
        $dataLogin = $request->all();
        $kdProfile = (int) $this->getDataKdProfile($request);
        try {
            if ($request['norec'] == ''){
                $newCOA = new StrukPlanning();
                $norecHead = $newCOA->generateNewId();
                $newCOA->kdprofile = $kdProfile;
                $newCOA->norec = $norecHead;
                $newCOA->statusenabled = 1;
            }else{

                $newCOA =  StrukPlanning::where('norec',$request['norec'])->where('kdprofile', $kdProfile)->first();
            }
            $newCOA->keteranganverifikasi = $request['keteranganverifikasi'];
            $newCOA->objectpegawaipjawabevaluasifk = $request['objectpegawaipjawabevaluasifk'];
            $newCOA->save();

            $norecHead2 = $newCOA->norec;

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "";


        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil" ;
            DB::commit();
            $result = array(
                "status" => 201,
//                "data" => $newPJT,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage ." Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
//                "data" => $newPJT,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }
    public function SaveDataStartDate(Request $request) {
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        $dataLogin = $request->all();

        try {
            if ($request['norec'] == ''){
                $newCOA = new StrukPlanning();
                $norecHead = $newCOA->generateNewId();
                $newCOA->kdprofile = $kdProfile;
                $newCOA->norec = $norecHead;
                $newCOA->statusenabled = 1;
            }else{

                $newCOA =  StrukPlanning::where('norec',$request['norec'])->where('kdprofile', $kdProfile)->first();
            }
            $newCOA->startdate = date('Y-m-d H:i:s');
            $newCOA->save();

            $norecHead2 = $newCOA->norec;

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "";


        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil" ;
            DB::commit();
            $result = array(
                "status" => 201,
//                "data" => $newPJT,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage ." Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
//                "data" => $newPJT,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }
    public function SaveDataDueDate(Request $request) {
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        $dataLogin = $request->all();

        try {
            if ($request['norec'] == ''){
                $newCOA = new StrukPlanning();
                $norecHead = $newCOA->generateNewId();
                $newCOA->kdprofile = $kdProfile;
                $newCOA->norec = $norecHead;
                $newCOA->statusenabled = 1;
            }else{

                $newCOA =  StrukPlanning::where('norec',$request['norec'])->where('kdprofile', $kdProfile)->first();
            }
            $newCOA->duedate = date('Y-m-d H:i:s');
            $newCOA->save();

            $norecHead2 = $newCOA->norec;

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "";


        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil" ;
            DB::commit();
            $result = array(
                "status" => 201,
//                "data" => $newPJT,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage ." Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
//                "data" => $newPJT,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }

    public function getDataPegawaiGeneral(Request $request) {
        $req=$request->all();
        $kdProfile = (int) $this->getDataKdProfile($request);
        $dataProduk=[];
        $dataProduk  = \DB::table('pegawai_m as st')
            ->select('st.id','st.namalengkap')
            ->where('kdprofile', $kdProfile)
            ->where('st.statusenabled',true)
            ->orderBy('st.namalengkap');
        if(isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value']!="" &&
            $req['filter']['filters'][0]['value']!="undefined"){
            $dataProduk = $dataProduk->where('st.namalengkap','ilike','%'. $req['filter']['filters'][0]['value'].'%' );
        };
        $dataProduk = $dataProduk->take(10);
        $dataProduk = $dataProduk->get();

        foreach ($dataProduk as $item){
            $dataPenulis2[]=array(
                'id' => $item->id,
                'namalengkap' => $item->namalengkap,
            );
        }

        return $this->respond($dataPenulis2);
    }

    public function getDataCombo(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $KdJenisPekerjaanSanitasi = explode(',', $this->settingDataFixed('KdJenisPekerjaanSanitasi', $kdProfile));
        $KdListJenisPekerjaanSanitasi = [];
        foreach ($KdJenisPekerjaanSanitasi as $data){
            $KdListJenisPekerjaanSanitasi [] = (int) $data;
        }
        $req=$request->all();
        $dataProduk  = \DB::table('jenispekerjaan_m')
            ->select('id as value','namaexternal as text','namaexternal')
            ->where('kdprofile', $kdProfile)
            ->where('statusenabled',true)
            ->whereIn('id', $KdListJenisPekerjaanSanitasi)
            ->orderBy('id');
        if(isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value']!="" &&
            $req['filter']['filters'][0]['value']!="undefined"){
            $dataProduk = $dataProduk->where('namaexternal','ilike','%'. $req['filter']['filters'][0]['value'].'%' );
        };
        $dataProduk = $dataProduk->take(10);
        $dataProduk = $dataProduk->get();

        return $this->respond($dataProduk);
//        $dataLogin = $request->all();
//        $dataJenisPek = \DB::table('jenispekerjaan_m as jp')
//            ->select('jp.id', 'jp.namaexternal')
//            ->whereIn('jp.id', [4,5,6,7])
//            ->where('st.statusenabled',true)
//            ->orderBy('jp.id')
//            ->get();
//
//        $result = array(
//            'namaexternal' => $dataJenisPek,
//            'message' => 'as@khris',
//        );
//
//        return $this->respond($result);
    }

    public function saveTambahKegiatan(Request $request) {
        DB::beginTransaction();
        $dataReq = $request->all();
        $kdProfile = (int) $this->getDataKdProfile($request);
        try {

            if ($dataReq['norec'] == '') {
                $dataSave = new StrukPlanning();
                $dataSave->norec = $dataSave->generateNewId();
                $dataSave->kdprofile = $kdProfile;
                $dataSave->statusenabled = true;
                # code...
            }else{

                $dataSave= StrukPlanning::where('norec',$dataReq['norec'])->where('kdprofile', $kdProfile)->first();

            }
            $dataSave->tglplanning = $dataReq['tglplanning'];
            $dataSave->objectruanganasalfk = $dataReq['objectruanganasalfk'];
            $dataSave->objectjenispekerjaanfk = $dataReq['objectjenispekerjaanfk'];
            $dataSave->objectruanganfk = $dataReq['objectruanganfk'];
            $dataSave->objectpegawaipjawabfk = $dataReq['objectpegawaipjawabfk'];
            $dataSave->deskripsiplanning = $dataReq['deskripsiplanning'];


            $dataSave->save();


            $transStatus = 1;
        } catch (\Exception $e) {
            $transStatus = false;
        }

        if ($transStatus) {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => $dataSave,
                "as" => 'khris@epic',
            );
        }else{
            $transMessage =" Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'khris@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDataSanitasi(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $dataLogin = $request->all();
        $data = DB::select(DB::raw("
        SELECT stp.norec, rg.namaruangan, stp.tglplanning, pg.nama, stp.startdate, stp.duedate, stp.deskripsiplanning, sttp.namaexternal,stp.signdate, jpk.namaexternal as napek, stp.worklist, 
        stp.keteranganverifikasi, pg2.nama as namaevaluasi
            FROM strukplanning_t as stp
            INNER JOIN ruangan_m as rg on rg.id = stp.objectruanganfk
            LEFT JOIN pegawai_m as pg on pg.id = stp.objectpegawaipjawabfk
            LEFT JOIN pegawai_m as pg2 on pg2.id = stp.objectpegawaipjawabevaluasifk
            LEFT JOIN statuspekerjaan_m as sttp on sttp.id = stp.objectstatuspekerjaanfk
            LEFT JOIN jenispekerjaan_m as jpk on jpk.id = stp.objectjenispekerjaanfk
            where stp.kdprofile = $kdProfile
            ORDER BY stp.tglplanning DESC"));

        return $this->respond($data);
    }

    public function SaveSignDate(Request $request) {
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        $dataLogin = $request->all();
//        return $this->respond($request['signdate']);
        try {
//            if ($request['norec'] == ''){
                $newCOA =  StrukPlanning::where('norec',$request['norec'])
                    ->where('kdprofile', $kdProfile)
                    ->update([
                            'signdate' => $request['signdate']
                        ]

                    );
//            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "";


        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil" ;
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => $newCOA,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage ." Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
//                "data" => $newCOA,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }

    public function SaveAlokasistaff(Request $request) {
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        $dataLogin = $request->all();
//        return $this->respond($request['signdate']);
        try {
//            if ($request['norec'] == ''){
            $newCOA =  StrukPlanning::where('norec',$request['norec'])
                ->where('kdprofile', $kdProfile)
                ->update([
                        'objectpegawaipjawabfk' => $request['objectpegawaipjawabfk']
                    ]

                );
//            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "";


        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil" ;
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => $newCOA,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage ." Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
//                "data" => $newCOA,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }
    public function SaveWorklist(Request $request) {
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        $dataLogin = $request->all();
//        return $this->respond($request['signdate']);
        try {
//            if ($request['norec'] == ''){
            $newCOA =  StrukPlanning::where('norec',$request['norec'])
                ->where('kdprofile', $kdProfile)
                ->update([
                        'worklist' => $request['worklist']
                    ]

                );
//            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "";


        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil" ;
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => $newCOA,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage ." Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
//                "data" => $newCOA,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }

    public function SaveStartDate(Request $request) {
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        $dataLogin = $request->all();
//        return $this->respond($request['signdate']);
        try {
//            if ($request['norec'] == ''){
            $newCOA =  StrukPlanning::where('norec',$request['norec'])
                ->where('kdprofile', $kdProfile)
                ->update([
                        'startdate' => $request['startdate']
                    ]

                );
//            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "";


        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil" ;
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => $newCOA,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage ." Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
//                "data" => $newCOA,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }
      public function getJenisLayananSanitasi(Request $request){
         $kdProfile = (int) $this->getDataKdProfile($request);
        $dataLogin = $request->all();
        $data = DB::select(DB::raw("
        SELECT *
            FROM jenispekerjaan_m
            WHERE jenispekerjaan='Sanitasi' AND namaexternal='Layanan Sanitasi' 
            and kdprofile='$kdProfile'"));

        return $this->respond($data);

    }
      public function SavePermohonanSanitasi(Request $request) {
         $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        $dataLogin = $request->all();

        try {
            if ($request['norec'] == ''){
                $newCOA = new StrukPlanning();
                $norecHead = $newCOA->generateNewId();
                $newCOA->kdprofile = $kdProfile;
                $newCOA->norec = $norecHead;
                $newCOA->statusenabled = 1;
            }else{

                $newCOA =  StrukPlanning::where('norec',$request['norec'])->first();
            }
            $newCOA->tglplanning = $request['tglplanning'];
            $newCOA->objectruanganfk = $request['ruangandesc'];
            $newCOA->objectkelompoktransaksifk = 305;
            $newCOA->rincianexecuteplanning_askep = $request['rincian'];
            $newCOA->narasumberfk = $request['pelapor'];
            $newCOA->objectjenispekerjaanfk = $request['jenisKerusakan'];
            $newCOA->pelapor = $request['namalengkap'];
            $newCOA->save();


            $tele= false;
                $cobainnn= '';
                $isAktif = \DB::table('settingdatafixed_m')
                ->where('namafield', 'TelegramPerbaikanRT')->where('statusenabled', true)->get();
                
                if (count($isAktif) > 0) {
                    $cobainnn = "Aktif";
                
                    $norecHead2 = $newCOA->norec;
                    $ruanganHead2 = $newCOA->objectruanganfk;
                    $ruangtujuanHead2 = $newCOA->objectruangantujuanfk;
                    $rincianHead2 = $newCOA->rincianexecuteplanning_askep;

                    $pelapor = StrukPlanning::where('norec',$norecHead2)->first();
                    $ruangan = \DB::table('ruangan_m')->where('id',$ruanganHead2)->first();
                    $ruanganTujuan = \DB::table('ruangan_m')->where('id',$ruangtujuanHead2)->first();
                    // $jenislayann =  DB::table('jenispekerjaan_m')->where('id',$request['jenisKerusakan'])->first();
                    $secret_token = "5564727540:AAFx0KWtUooqNFh_J_fwToEMP8MRIF_FW2g";
                    $telegram_id = '-1001687511947';//'-498979335';
                    $url = "https://api.telegram.org/bot" . $secret_token . "/sendMessage?parse_mode=html&chat_id=" . $telegram_id;
                    $url = $url . "&text=" . urlencode("✅ Laporan Baru: <b>Permohonan Perbaikan Rumah Tangga </b> \n\n Ruangan / area: <b>".$ruangan->namaruangan.
                            "</b>  \n Pelapor: <b>".$pelapor->pelapor."</b>  \n Laporan Kerusakan: <b>".$rincianHead2.
                            "</b>");
                    // return $url;
                    $ch = curl_init();
                    $optArray = array(
                        CURLOPT_URL => $url,
                        CURLOPT_RETURNTRANSFER => true
                    );
                    curl_setopt_array($ch, $optArray);
                    $result = curl_exec($ch);
                    curl_close($ch);
                }
            

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "";


        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil" ;
            DB::commit();
            $result = array(
                "status" => 201,
               "data" => $cobainnn,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage ." Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "e" => $e->getLine(),
                "message" => $e->getMessage(),
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }
    public function getDaftarPermohonanSanitasi(Request $request){
        $dataLogin = $request->all();
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tgl="";
        $jenisKerusakan="";
        $idRuangan="";

        if ((isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") && (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined"))
        {
            $tgl = " AND stp.tglplanning BETWEEN '".$request['tglAwal']."' AND '".$request['tglAkhir']."' ";
        }

        if (isset($request['jenisKerusakan']) && $request['jenisKerusakan'] != "" && $request['jenisKerusakan'] != "undefined")
        {
            $jenisKerusakan = " AND stp.objectjenispekerjaanfk = '".$request['jenisKerusakan']."' ";
        }

        // if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined")
        // {
        //     $idRuangan = " AND stp.objectruanganfk = '".$request['idRuangan']."' ";
        // }

        $data = DB::select(DB::raw("
        SELECT stp.objectruanganperbaikanfk, stp.objectbarangperbaikanfk, stp.tglverif, rp.rekananperbaikan, stp.objectrekananperbaikanfk,  stp.objectdetailjenispekerjaanfk, stp.objectruanganfk,stp.catatan, stp.ispihakketiga, stp.norec, rg.namaruangan, stp.tglplanning,stp.objectpegawaipjawabfk,pg.namalengkap, stp.startdate, stp.duedate, stp.rincianexecuteplanning_askep, stp.pelapor, 
                    stp.deskripsiplanning, stp.keteranganverifikasi, sttp.namaexternal,stp.signdate, stp.worklist, stp.keteranganverifikasi, 
                    pg2.nama as namainspektor, pg3.nama as namapelapor,stp.objectstatuspekerjaanfk,sttp.reportdisplay as statuspekerjaan,stp.objectjenispekerjaanfk AS idjeniskerusakan,
                    jpk.reportdisplay as jeniskerusakan,stp.objectjenisalatfk,jpk2.reportdisplay as jenisalat,r.namaruangan as namaruangantujuan, ukp.name
            FROM strukplanning_t as stp
            INNER JOIN ruangan_m as rg on rg.id = stp.objectruanganfk
            inner join pegawai_m as pg1 on pg1.id = stp.narasumberfk 
            LEFT JOIN pegawai_m as pg on pg.id = stp.objectpegawaipjawabfk
            LEFT JOIN pegawai_m as pg2 on pg2.id = stp.objectpegawaipjawabevaluasifk
            LEFT JOIN pegawai_m as pg3 on pg3.id = stp.narasumberfk
            LEFT JOIN unitkerjapegawai_m as ukp on pg1.objectunitkerjafk = ukp.id 
            LEFT JOIN statuspekerjaan_m as sttp on sttp.id = stp.objectstatuspekerjaanfk
			LEFT JOIN jenispekerjaan_m as jpk on jpk.id = stp.objectjenispekerjaanfk
            LEFT JOIN jenispekerjaan_m as jpk2 on jpk2.id = stp.objectjenisalatfk
            LEFT JOIN ruangan_m as r on r.id = stp.objectruangantujuanfk
            left join rekananperbaikan_m rp on rp.id = stp.objectrekananperbaikanfk
			WHERE stp.kdprofile = $kdProfile and stp.objectkelompoktransaksifk = 305 
			AND stp.statusenabled=true 
			$tgl
			$jenisKerusakan
			$idRuangan
            ORDER BY stp.tglplanning DESC"));
        // foreach ($data as $d) {
            
        // }
        foreach ($data as $item) {
            $detailss = \DB::select(DB::raw("SELECT id, detailjenispekerjaan from detailjenispekerjaan_m djp where djp.kdprofile =  $kdProfile and djp.objectjenispekerjaanfk = :detailjenispekerjaan"),
                array(
                    'detailjenispekerjaan' => $item->objectjenisalatfk,
                )
            );
            $details = \DB::select(DB::raw("select spd.pegawaifk as id,pr.namalengkap
                    from strukplanningdetail_t as spd 
                    left JOIN pegawai_m as pr on pr.id = spd.pegawaifk                    
                    where spd.kdprofile = $kdProfile and noplanningfk = :norec"),
                array(
                    'norec' => $item->norec,
                )
            );
            $detailjenisperbaikan = \DB::select(DB::raw("SELECT id, detailjenispekerjaan from detailjenispekerjaan_m djp where djp.kdprofile =  $kdProfile and djp.id = :detailjenispekerjaan"),
                array(
                    'detailjenispekerjaan' => $item->objectdetailjenispekerjaanfk,
                )
            );
            $ruanganperbaikan = [];
            if($item->objectruanganperbaikanfk != null){
                $ruanganperbaikan = \DB::select(DB::raw("SELECT id, namaruangan from ruangan_m djp where djp.kdprofile =  $kdProfile and djp.id = :detailjenispekerjaan"),
                array(
                    'detailjenispekerjaan' => $item->objectruanganfk,
                )
            );
            }
            $barangperbaikan = [];
            if($item->objectbarangperbaikanfk != null){
                $barangperbaikan = \DB::select(DB::raw("SELECT id, barangperbaikan from barangperbaikan_m djp where djp.kdprofile =  $kdProfile and djp.id = :detailjenispekerjaan"),
                array(
                    'detailjenispekerjaan' => $item->objectbarangperbaikanfk,
                )
            );
            }
            $merkperbaikan = [];
            $merkperbaikan = DB::select(DB::raw("select mp.*, djp.detailjenispekerjaan, jp.reportdisplay, mpp.merk as merkpekerjaan from merkperbaikan_t mp
            inner join detailjenispekerjaan_m djp on djp.id = mp.objectdetailjenispekerjaanfk
            inner join jenispekerjaan_m jp on jp.id = mp.objectjenispekerjaanfk
            inner join merkperbaikan_m mpp on mpp.id = mp.objectmerkperbaikanfk
            where mp.norec_sp ilike '$item->norec'"));
            $result[] = array(
                'norec' => $item->norec,
                'namaruangan' => $item->namaruangan,
                'tglplanning' => $item->tglplanning,
                'objectpegawaipjawabfk' => $item->objectpegawaipjawabfk,
                'namalengkap' => $item->namalengkap,
                'startdate' => $item->startdate,
                'duedate' => $item->duedate,
                'rincianexecuteplanning_askep' => $item->rincianexecuteplanning_askep,
                'pelapor' => $item->pelapor,
                'deskripsiplanning' => $item->deskripsiplanning,
                'keteranganverifikasi' => $item->keteranganverifikasi,
                'signdate' => $item->signdate,
                'worklist' => $item->worklist,
                'namainspektor' => $item->namainspektor,
                'namapelapor' => $item->namapelapor,
                'objectstatuspekerjaanfk' => $item->objectstatuspekerjaanfk,
                'statuspekerjaan' => $item->statuspekerjaan,
                'idjeniskerusakan' => $item->idjeniskerusakan,
                'jeniskerusakan' => $item->jeniskerusakan,
                'jenisalat' => $item->jenisalat,
                'objectjenisalatfk' => $item->objectjenisalatfk,
                'details' => $details,
                'namaruangantujuan' => $item->namaruangantujuan,
                'name' => $item->name,
                'ispihakketiga' => $item->ispihakketiga,
                'catatan' => $item->catatan,
                'objectruanganfk' => $item->objectruanganfk,
                'detailjenisperbaikan' => $detailjenisperbaikan,
                'ruanganperbaikan' => $ruanganperbaikan,
                'barangperbaikan' => $barangperbaikan,
                'detailss' => $detailss,
                'objectrekananperbaikanfk' => $item->objectrekananperbaikanfk,
                'rekananperbaikan' => $item->rekananperbaikan,
                'tglverif' => $item->tglverif,
                'merkperbaikan' => $merkperbaikan,

            );
        }
        
        if (count($data) == 0) {
            $result = [];
        }
        $result = array(
            'data' => $result,
            // 'datalogin' => $dataLogin,
            // 'KdKelTransIPSRS'=> $KdKelTransIPSRS,
            'message' => 'as@epic',
        );

        return $this->respond($result);

    }

    public function HapusPermohonanSanitasi(Request $request){
         $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        try {
            StrukPlanning::where('norec', $request['norec'])->update(
                ['statusenabled' => false]
            );
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
                'as' => 'dy@epic',
            );
        } else {
            $transMessage = " Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message' => $transMessage,
                'as' => 'dy@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }


    public function SaveDataJenisLayananSanitasi(Request $request) {
         $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        $dataLogin = $request->all();

        try {
            if ($request['norec'] == ''){
                $newCOA = new StrukPlanning();
                $norecHead = $newCOA->generateNewId();
                $newCOA->kdprofile = $kdProfile;
                $newCOA->norec = $norecHead;
                $newCOA->statusenabled = 1;
            }else{

                $newCOA =  StrukPlanning::where('norec',$request['norec'])->first();
            }
            $newCOA->objectjenispekerjaanfk = $request['jenisKerusakan'];
            $newCOA->save();

            $norecHead2 = $newCOA->norec;

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "";


        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil" ;
            DB::commit();
            $result = array(
                "status" => 201,
//                "data" => $newPJT,
                "dy" => 'dy@epic',
            );
        } else {
            $transMessage = $transMessage ." Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
//                "data" => $newPJT,
                "dy" => 'dy@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }

    public function getStatusPekerjaanSanitasi(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $dataLogin = $request->all();
        $data = DB::select(DB::raw("
        SELECT *
            FROM statuspekerjaan_m
            WHERE kodeexternal = 'Sanitasi'
            and kdprofile ='$kdProfile'"));

        return $this->respond($data);
    }

    public function SaveDataPengelolaanLimbah(Request $request) {
        DB::beginTransaction();
        $kdProfile = (int) $this->getDataKdProfile($request);
        try {
            if ($request['norec'] == ''){
                $newCOA = new PelayananLimbah();
                $norecHead = $newCOA->generateNewId();
                $newCOA->kdprofile = $kdProfile;
                $newCOA->norec = $norecHead;
                $newCOA->statusenabled = true;
                $newCOA->jenispelayanan = $request['jenispelayanan'];
            }else{
                $newCOA =  PelayananLimbah::where('norec',$request['norec'])->where('kdprofile', $kdProfile)->first();
            }
            $newCOA->pegawaifk = $request['pegawaifk'];
            $newCOA->tanggal = $request['tanggal'];
            $newCOA->rekananfk = $request['rekananfk'];
            $newCOA->ruanganfk = $request['ruanganfk'];
            $newCOA->jmlpadat = $request['jmlpadat'];
            $newCOA->jmltajam = $request['jmltajam'];
            $newCOA->flowmeterinlet = $request['flowmeterinlet'];
            $newCOA->flowmeteroutlet = $request['flowmeteroutlet'];
            $newCOA->debetharianinlet = $request['debetharianinlet'];
            $newCOA->debetharianoutlet = $request['debetharianoutlet'];
            $newCOA->phbakumutu = $request['phbakumutu'];
            $newCOA->temperaturbakumutu = $request['temperaturbakumutu'];
            $newCOA->jmlflowmeter = $request['jmlflowmeter'];
            $newCOA->jmlperhari = $request['jmlperhari'];

            $newCOA->save();
            $norecHead2 = $newCOA->norec;

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil" ;
            DB::commit();
            $result = array(
                "status" => 201,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Simpan Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDataPengangkutanLimbah(Request $request){
        $kdProfile = (int)$this->getDataKdProfile($request);
        $data = \DB::table('pelayananlimbah_t AS pl')
            ->leftJoin('pegawai_m AS pg','pg.id','=','pl.pegawaifk')
            ->leftJoin('rekanan_m AS rk','rk.id','=','pl.rekananfk')
            ->select(DB::raw(
                "pl.norec,pl.tanggal,pl.rekananfk,rk.namarekanan,pl.jmlpadat,pl.jmltajam,pl.jenispelayanan"
            ))
            ->where('pl.jenispelayanan', 'Pengangkutan Limbah')
            ->where('pl.kdprofile', $kdProfile)
            ->where('pl.statusenabled', true);
        if(isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pl.tanggal', '>=', $request['tglAwal']);
        }
        if(isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $data = $data->where('pl.tanggal', '<=', $request['tglAkhir']);
        }
        if(isset($request['Rekananid']) && $request['Rekananid'] != "" && $request['Rekananid'] != "undefined") {
            $data = $data->where('pl.rekananfk','=',$request['Rekananid']);
        }
        $data = $data->orderBy('pl.tanggal', 'asc');
        $data = $data->get();

        $result = array(
            'data' => $data,
            'message' => 'cepot',
        );
        return $this->respond($result);
    }

    public function getDataPencatatanAirLimbah(Request $request){
        $kdProfile = (int)$this->getDataKdProfile($request);
        $data = \DB::table('pelayananlimbah_t AS pl')
            ->leftJoin('pegawai_m AS pg','pg.id','=','pl.pegawaifk')
//            ->leftJoin('rekanan_m AS rk','rk.id','=','pl.rekananfk')
            ->select(DB::raw(
                "pl.norec,pl.tanggal,pl.flowmeterinlet,pl.flowmeteroutlet,pl.debetharianinlet,pl.debetharianoutlet,
                       pl.temperaturbakumutu,pl.phbakumutu,pl.jenispelayanan"
            ))
            ->where('pl.jenispelayanan', 'Pencatatan Pengelolaan Air Limbah')
            ->where('pl.kdprofile', $kdProfile)
            ->where('pl.statusenabled', true);
        if(isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pl.tanggal', '>=', $request['tglAwal']);
        }
        if(isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $data = $data->where('pl.tanggal', '<=', $request['tglAkhir']);
        }
//        if(isset($request['Rekananid']) && $request['Rekananid'] != "" && $request['Rekananid'] != "undefined") {
//            $data = $data->where('pl.rekananfk','=',$request['Rekananid']);
//        }
        $data = $data->orderBy('pl.tanggal', 'asc');
        $data = $data->get();

        $result = array(
            'data' => $data,
            'message' => 'cepot',
        );
        return $this->respond($result);
    }

    public function getDataPencatatanAirBersih(Request $request){
        $kdProfile = (int)$this->getDataKdProfile($request);
        $data = \DB::table('pelayananlimbah_t AS pl')
            ->leftJoin('pegawai_m AS pg','pg.id','=','pl.pegawaifk')
            ->leftJoin('ruangan_m AS ru','ru.id','=','pl.ruanganfk')
            ->select(DB::raw(
                "pl.norec,pl.tanggal,pl.ruanganfk,ru.namaruangan,pl.jmlflowmeter,pl.jmlperhari,pl.jenispelayanan"
            ))
            ->where('pl.jenispelayanan', 'Pencatatan Debit Air Bersih')
            ->where('pl.kdprofile', $kdProfile)
            ->where('pl.statusenabled', true);

        if(isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pl.tanggal', '>=', $request['tglAwal']);
        }
        if(isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $data = $data->where('pl.tanggal', '<=', $request['tglAkhir']);
        }
        if(isset($request['Ruanganid']) && $request['Ruanganid'] != "" && $request['Ruanganid'] != "undefined") {
            $data = $data->where('pl.ruanganfk','=',$request['Ruanganid']);
        }
        $data = $data->orderBy('pl.tanggal', 'asc');
        $data = $data->get();

        $result = array(
            'data' => $data,
            'message' => 'cepot',
        );
        return $this->respond($result);
    }

    public function HapusPelayananLimbah(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        try {
            PelayananLimbah::where('norec', $request['norec'])->update(
                ['statusenabled' => false]
            );
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
                'as' => 'dy@epic',
            );
        } else {
            $transMessage = " Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message' => $transMessage,
                'as' => 'dy@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    function getJenisAlat(Request $request) {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $dataLogin = $request->all();
        $data = DB::select(DB::raw("
        SELECT *
            FROM jenispekerjaan_m
			WHERE kdprofile = $kdProfile and statusenabled = true and jenispekerjaan = 'Rumah Tangga' AND namaexternal='Jenis Alat'"));
        foreach ($data as $d) {
            $d->details = \DB::select(DB::raw("SELECT * from detailjenispekerjaan_m djp where djp.kdprofile =  $kdProfile and djp.objectjenispekerjaanfk = :detailjenispekerjaan"),
                array(
                    'detailjenispekerjaan' => $d->id,
                )
            );
            foreach ($d->details as $i) {
                $i->details = \DB::select(DB::raw("SELECT * from merkperbaikan_m djp where djp.kdprofile =  $kdProfile and djp.objectdetailjenispekerjaanfk = :detailjenispekerjaan"),
                array(
                    'detailjenispekerjaan' => $i->id,
                )
            );
            }
        }
        return $this->respond($data);
    }

    public function SavePengerjaanPermohonanRT(Request $request)
    {
        DB::beginTransaction();
        $dataLogin = $request->all();
        $kdProfile = (int) $this->getDataKdProfile($request);
        try {

            if ($request['norec'] == ''){
                return $this->respond("ASUP");
                $newCOA = new StrukPlanning();
                $norecHead = $newCOA->generateNewId();
                $newCOA->kdprofile = $kdProfile;
                $newCOA->norec = $norecHead;
                $newCOA->statusenabled = true;
            }else{
                $newCOA = StrukPlanning::where('norec',$request['norec'])->where('kdprofile', $kdProfile)->first();
                $Spd = StrukPlanningDetail::where('noplanningfk', $request['norec'])->delete();
            }
                $newCOA->startdate = $request['strukplanning']['tglmulai'];
                $newCOA->duedate = $request['strukplanning']['tglselesai'];
                $newCOA->objectstatuspekerjaanfk = $request['strukplanning']['status'];
                $newCOA->deskripsiplanning = $request['strukplanning']['worklist'];
                $newCOA->keteranganverifikasi = $request['strukplanning']['identifikasikerusakan'];
                $newCOA->objectpegawaipjawabevaluasifk = $request['strukplanning']['penanngungjawab'];
                $newCOA->objectpegawaipjawabfk = $request['strukplanning']['penanngungjawab'];
                $newCOA->objectjenispekerjaanfk = $request['strukplanning']['jeniskerusakan'];
                // $newCOA->objectjenisalatfk = $request['strukplanning']['jenisalat'];
                $newCOA->ispihakketiga = $request['strukplanning']['ispihakketiga'];
                $newCOA->catatan = $request['strukplanning']['catatan'];
                // $newCOA->objectdetailjenispekerjaanfk = $request['strukplanning']['detailjenispekerjaan'];
                $newCOA->objectrekananperbaikanfk = $request['strukplanning']['rekananperbaikan'];
                // $newCOA->objectruanganperbaikanfk = $request['strukplanning']['objectruanganperbaikanfk'];
                // $newCOA->objectbarangperbaikanfk = $request['strukplanning']['objectbarangperbaikanfk'];
                $newCOA->save();
                $norecHead2 = $newCOA->norec;

            foreach ($request['datapegawai'] as $items){
                $Spd = new StrukPlanningDetail();
                $norecDetail = $Spd->generateNewId();
                $Spd->kdprofile = $kdProfile;
                $Spd->norec = $norecDetail;
                $Spd->statusenabled = true;
                $Spd->pegawaifk = $items['id'];
                $Spd->noplanningfk = $norecHead2;
                $Spd->save();
            }
            foreach ($request['details'] as $p) {
                if($p['norec'] == null){
                    DB::table('merkperbaikan_t')->insert([
                        'norec'=>substr(Uuid::generate(), 0, 32),
                        'kdprofile'=> 30,
                        'statusenabled'=> true,
                        'biaya'=>$p['biaya'],
                        'jumlah'=>$p['jumlah'],
                        'norec_sp'=>$request['norec'],
                        'objectjenispekerjaanfk'=> $p['klasifikasi']['id'],
                        'objectdetailjenispekerjaanfk'=> $p['objekperbaikan']['id'],
                        'objectmerkperbaikanfk'=> $p['merk']['id'],
                        'keterangan'=> $p['keterangan']
                    ]);
                }else{
                    DB::table('merkperbaikan_t')->where('norec',$p['norec'])->update([
                        'biaya'=>$p['biaya'],
                        'jumlah'=>$p['jumlah'],
                        'norec_sp'=>$request['norec'],
                        'objectjenispekerjaanfk'=> $p['klasifikasi']['id'],
                        'objectdetailjenispekerjaanfk'=> $p['objekperbaikan']['id'],
                        'objectmerkperbaikanfk'=> $p['merk']['id'],
                        'keterangan'=> $p['keterangan']
                    ]);
                }
            }


            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Simpan";
        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil" ;
            DB::commit();
            $result = array(
                "status" => 201,
               "data" => $newCOA,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage ." Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
//                "data" => $newPJT,
                    "e"=> $e->getLine().$e->getMessage(),
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    function laporanRT(Request $request) {
        $data= \DB::select(DB::raw("
            SELECT sp.startdate::date, ru.namaruangan, jp.reportdisplay, djp.detailjenispekerjaan, mpp.merk, mp.jumlah, sp.rincianexecuteplanning_askep, mp.biaya, mp.keterangan FROM merkperbaikan_t mp
            inner join strukplanning_t sp on sp.norec = mp.norec_sp
            inner join detailjenispekerjaan_m djp on djp.id = mp.objectdetailjenispekerjaanfk
            inner join jenispekerjaan_m jp on jp.id = mp.objectjenispekerjaanfk
            inner join ruangan_m ru on ru.id = sp.objectruanganfk
            inner join merkperbaikan_m mpp on mpp.id = mp.objectmerkperbaikanfk
            where sp.startdate::date between '$request[tglawal]'::date and '$request[tglakhir]'::date
        "));

        $result = array(
            'data'=>$data,
            'as'=> 'Fizi'
        );
        return $this->respond($result);
    }
}