<?php
/**
 * Created by PhpStorm.
 * User: as@epic
 * Date: 12/2/2019
 * Time: 9:52 PM
 */

namespace App\Http\Controllers\IPSRS;

use App\Http\Controllers\ApiController;
use App\Traits\Valet;
use App\Transaksi\StrukPlanningDetail;
use Illuminate\Http\Request;
use App\Transaksi\StrukPlanning;
use DB;

class IPSRSController extends ApiController
{
    use Valet;

    public function __construct()
    {
        parent::__construct($skip_authentication = false);
    }
    public function getDaftarIPSRS(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $KdKelTransIPSRS = (int) $this->settingDataFixed('KdKelTransIPSRS', $kdProfile);
        $dataLogin = $request->all();
        $tgl="";
        $jenisalat="";
        $idRuangan="";
        $ruangantj="";
        $pelapor="";
        $jeniskerusakan="";
        $jenisperbaikan = "";
        $statuspengerjaan = "";
        if ((isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") && (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined"))
        {
            $tgl = "AND stp.tglplanning BETWEEN '".$request['tglAwal']."' AND '".$request['tglAkhir']."' ";
        }

        if (isset($request['jenisalat']) && $request['jenisalat'] != "" && $request['jenisalat'] != "undefined")
        {
            $jenisalat = "AND stp.objectjenisalatfk = '".$request['jenisalat']."' ";
        }

        if (isset($request['jeniskerusakan']) && $request['jeniskerusakan'] != "" && $request['jeniskerusakan'] != "undefined")
        {
            $jeniskerusakan = "AND stp.objectjenispekerjaanfk = '".$request['jeniskerusakan']."' ";
        }

        if (isset($request['ruangan']) && $request['ruangan'] != "" && $request['ruangan'] != "undefined")
        {
                $idRuangan = "AND stp.objectruanganfk = '".$request['ruangan']."'";
        }

        if (isset($request['ruangantujuan']) && $request['ruangantujuan'] != "" && $request['ruangantujuan'] != "undefined")
        {
                $ruangantj = "AND stp.objectruangantujuanfk = '".$request['ruangantujuan']."'";
        }

        if (isset($request['pelapor']) && $request['pelapor'] != "" && $request['pelapor'] != "undefined")
        {
                $ruangantj = "AND stp.pelapor = '".$request['pelapor']."'";
        }
        if (isset($request['jenisperbaikan']) )
        {
                $jenisperbaikan = "AND stp.objectruangantujuanfk = '".$request['jenisperbaikan']."'";
        }
        if (isset($request['statuspengerjaan']) )
        {
                $statuspengerjaan = "AND stp.objectstatuspekerjaanfk = '".$request['statuspengerjaan']."'";
        }
        $data = DB::select(DB::raw("
            SELECT stp.objectdetailjenispekerjaanfk, stp.objectruanganfk,stp.catatan, stp.ispihakketiga, stp.norec, rg.namaruangan, stp.tglplanning,stp.objectpegawaipjawabfk,pg.namalengkap, stp.startdate, stp.duedate, stp.rincianexecuteplanning_askep, stp.pelapor, 
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
			WHERE stp.kdprofile = $kdProfile 
			AND stp.objectkelompoktransaksifk = $KdKelTransIPSRS
			AND stp.statusenabled = true 
			$tgl
			$jenisalat
            $idRuangan
            $ruangantj
            $pelapor
            $jeniskerusakan
            $jenisperbaikan
            $statuspengerjaan
            ORDER BY stp.tglplanning DESC"));

        foreach ($data as $item) {
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
            );
        }
        if (count($data) == 0) {
            $result = [];
        }
        $result = array(
            'data' => $result,
            'datalogin' => $dataLogin,
            'KdKelTransIPSRS'=> $KdKelTransIPSRS,
            'message' => 'as@epic',
        );

        return $this->respond($result);
//        return $this->respond($data);
    }

    public function SavePermohonan(Request $request) {
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        $dataLogin = $request->all();
        $KdKelTransIPSRS = (int) $this->settingDataFixed('KdKelTransIPSRS', $kdProfile);
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
            $newCOA->objectkelompoktransaksifk = $KdKelTransIPSRS;
            $newCOA->rincianexecuteplanning_askep = $request['rincian'];
            $newCOA->pelapor = $request['pelapor'];
            $newCOA->narasumberfk = $request['idpelapor'];
            $newCOA->objectruangantujuanfk = $request['ruangantujuan'];
            $newCOA->save();


                $tele= false;
                $cobainnn= '';
                $isAktif = \DB::table('settingdatafixed_m')
                ->where('namafield', 'TelegramPerbaikanIPSRS')->where('statusenabled', true)->get();
                
                if (count($isAktif) > 0) {
                    $cobainnn = "Aktif";
                    $norecHead2 = $newCOA->norec;
                    $ruanganHead2 = $newCOA->objectruanganfk;
                    $ruangtujuanHead2 = $newCOA->objectruangantujuanfk;
                    $rincianHead2 = $newCOA->rincianexecuteplanning_askep;

                    //bot Father
                    $pelapor = StrukPlanning::where('norec',$norecHead2)->first();
                    $ruangan = \DB::table('ruangan_m')->where('id',$ruanganHead2)->first();
                    $ruanganTujuan = \DB::table('ruangan_m')->where('id',$ruangtujuanHead2)->first();
                    // $jenislayann =  DB::table('jenispekerjaan_m')->where('id',$request['jenisKerusakan'])->first();
                    $secret_token = "5446769474:AAFjx5jWWWTTvDKLskXL8xZ4Ry7NrhNhnvQ";
                    $telegram_id = '-730865432';//'-498979335';
                    $url = "https://api.telegram.org/bot" . $secret_token . "/sendMessage?parse_mode=html&chat_id=" . $telegram_id;
                    $url = $url . "&text=" . urlencode("✅ Laporan Baru: <b>Permohonan Perbaikan IPSRS </b> \n\n Ruangan / area: <b>".$ruangan->namaruangan.
                            "</b>  \n Pelapor: <b>".$pelapor->pelapor."</b>  \n Laporan Kerusakan: <b>".$rincianHead2.
                            "</b> \n Jenis Perbaikan: <b>".$ruanganTujuan->namaruangan."</b>");
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
//                "data" => $newPJT,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }

    public function SaveDataAlokasiStaff(Request $request) {
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

    public function SaveDataIdentifikasi(Request $request) {
        DB::beginTransaction();
        $dataLogin = $request->all();
        $kdProfile = (int) $this->getDataKdProfile($request);
        try {
            if ($request['norec'] == ''){
                $newCOA = new StrukPlanning();
                $norecHead = $newCOA->generateNewId();
                $newCOA->kdprofile = $kdProfile;
                $newCOA->norec = $norecHead;
                $newCOA->statusenabled = true;
            }else{

                $newCOA =  StrukPlanning::where('norec',$request['norec'])->where('kdprofile', $kdProfile)->first();
            }
            $newCOA->keteranganverifikasi = $request['identifikasi'];
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

    public function SaveDataJenisKerusakan(Request $request) {
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

    public function getJenisPekerjaan(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $dataLogin = $request->all();
        $data = DB::select(DB::raw("
        SELECT * FROM jenispekerjaan_m WHERE kdprofile = $kdProfile and statusenabled = true and jenispekerjaan='IPSRS' AND namaexternal='Status Jenis'"));
        return $this->respond($data);
    }
    public function getJenisPekerjaanSIMRS(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $dataLogin = $request->all();
        $data = DB::select(DB::raw("
        SELECT * FROM jenispekerjaan_m WHERE kdprofile = $kdProfile and statusenabled = true and jenispekerjaan='SIMRS' AND namaexternal='Kegiatan SIMRS'"));
        return $this->respond($data);
    }
    public function getStatusPekerjaan(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $dataLogin = $request->all();
        $data = DB::select(DB::raw("
        SELECT * FROM statuspekerjaan_m WHERE kdprofile = $kdProfile and statusenabled = true and kodeexternal = 'IPSRS' "));

        return $this->respond($data);
    }

    public function SaveDataStatus(Request $request) {
        DB::beginTransaction();
        $dataLogin = $request->all();
        $kdProfile = (int) $this->getDataKdProfile($request);
        try {
            if ($request['norec'] == ''){
                $newCOA = new StrukPlanning();
                $norecHead = $newCOA->generateNewId();
                $newCOA->kdprofile = $kdProfile;
                $newCOA->norec = $norecHead;
                $newCOA->statusenabled = true;
            }else{

                $newCOA =  StrukPlanning::where('norec',$request['norec'])->where('kdprofile', $kdProfile)->first();
            }
            $newCOA->objectstatuspekerjaanfk = $request['objectstatuspekerjaanfk'];
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

    public function sendNotifWhatsapp(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        //https://www.twilio.com/console/sms/whatsapp/sandbox
        //composer require twilio/sdk
        $sid    = "ACc6ac08ce1cc9096e0fd57a0c38801118";
        $token  = "cada716b5a36721fd86832662bbd06fe";
        $twilio = new Client($sid, $token);
        $array =[
            "whatsapp:+628988891429",
//            "whatsapp:+6282211333013",
//            "whatsapp:+6285702501576",
//            "whatsapp:+6283838339887",
//            "whatsapp:+6281649111417",
        ];
        $i = 0;
        foreach ($array as $arr){
            $message = $twilio->messages
                ->create($array[$i], // to
                    array(
                        "from" => "whatsapp:+14155238886",
                        "body" => "Testing Ipsrs!!! "
                    )
                );
            $i = $i+1;
        }
        $result = array(
            'respond' => 'success',
            'as' => 'er@epic'
        );
        return $this->respond($result);

    }

    public function getJenisAlat(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $dataLogin = $request->all();
        $data = DB::select(DB::raw("
        SELECT *
            FROM jenispekerjaan_m
			WHERE kdprofile = $kdProfile and statusenabled = true and jenispekerjaan = 'IPSRS' AND namaexternal='Jenis Alat'"));
        foreach ($data as $d) {
            $details = \DB::select(DB::raw("SELECT id, detailjenispekerjaan from detailjenispekerjaan_m djp where djp.kdprofile =  $kdProfile and djp.objectjenispekerjaanfk = :detailjenispekerjaan"),
                array(
                    'detailjenispekerjaan' => $d->id,
                )
            );
            $d->details = $details;
        }
        return $this->respond($data);

    }

    public function SaveDataJenisAlat(Request $request) {
        DB::beginTransaction();
        $dataLogin = $request->all();
        $kdProfile = (int) $this->getDataKdProfile($request);
        try {
            if ($request['norec'] == ''){
                $newCOA = new StrukPlanning();
                $norecHead = $newCOA->generateNewId();
                $newCOA->kdprofile = $kdProfile;
                $newCOA->norec = $norecHead;
                $newCOA->statusenabled = true;
            }else{
                $newCOA =  StrukPlanning::where('norec',$request['norec'])->where('kdprofile', $kdProfile)->first();
            }
            $newCOA->objectjenisalatfk = $request['jenisAlat'];
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

    public function HapusPermohonanIPSRS(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        try {
            StrukPlanning::where('norec', $request['norec'])
                ->where('kdprofile', $kdProfile)
                ->update(['statusenabled' => false]);
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

    public function SavePengerjaanPermohonan(Request $request) {
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
                $newCOA =  StrukPlanning::where('norec',$request['norec'])->where('kdprofile', $kdProfile)->first();
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
                $newCOA->objectjenisalatfk = $request['strukplanning']['jenisalat'];
                $newCOA->ispihakketiga = $request['strukplanning']['ispihakketiga'];
                $newCOA->catatan = $request['strukplanning']['catatan'];
                $newCOA->objectdetailjenispekerjaanfk = $request['strukplanning']['detailjenispekerjaan'];
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

    public function SaveHapusPengerjaanPermohonan(Request $request){
        DB::beginTransaction();
        $dataLogin = $request->all();
        $kdProfile = (int)$this->getDataKdProfile($request);
        try {



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
                "as" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage ." Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getComboRuanganIPSRS(Request $request){
        $dataLogin = $request->all();
        $kdProfile = (int)$this->getDataKdProfile($request);
        $data = DB::table('ruangan_m as rm')
                ->select('rm.id','rm.namaruangan')
                ->where('rm.kdprofile',$kdProfile)
                ->whereIn('rm.id',[850,851,852,602])
                ->get();
        
        $result[] = array(
            'ruanganipsrs' => $data,
        );

        return $this->respond($result);
    }
    public function SavePermohonanPindahKe(Request $request)
    {
        DB::beginTransaction();
        $dataLogin = $request->all();
        $kdProfile = (int) $this->getDataKdProfile($request);
        try {
            $newCOA =  StrukPlanning::where('norec',$request['norec'])->where('kdprofile', $kdProfile)->first();
            $newCOA->objectkelompoktransaksifk = $request['pindah'];
            if (isset($request['ruangtujuan']) && $request['ruangtujuan']!= "") {
            $newCOA->objectruangantujuanfk = $request['ruangtujuan'];
            }
            $newCOA->save();

            if ($newCOA->objectkelompoktransaksifk == 151) {
                //pdti
                $tele= false;
                $cobainnn= '';
                $isAktif = \DB::table('settingdatafixed_m')
                ->where('namafield', 'TelegramPerbaikanIPSRS')->where('statusenabled', true)->get();
                
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
                $secret_token = "5528647994:AAHqBykIdioFfxa-0oVdGQDpYs9jWDOKZWQ";
                $telegram_id = '-1001762536697';//'-498979335';
                $url = "https://api.telegram.org/bot" . $secret_token . "/sendMessage?parse_mode=html&chat_id=" . $telegram_id;
                $url = $url . "&text=" . urlencode("✅ Laporan Baru: <b>Permohonan Perbaikan PDTI </b> \n\n Ruangan / area: <b>".$ruangan->namaruangan.
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
                
            } else if($newCOA->objectkelompoktransaksifk == 122){
                //ipsrs
                $tele= false;
                $cobainnn= '';
                $isAktif = \DB::table('settingdatafixed_m')
                ->where('namafield', 'TelegramPerbaikanIPSRS')->where('statusenabled', true)->get();
                
                if (count($isAktif) > 0) {
                    $cobainnn = "Aktif";
                    $norecHead2 = $newCOA->norec;
                $ruanganHead2 = $newCOA->objectruanganfk;
                $ruangtujuanHead2 = $newCOA->objectruangantujuanfk;
                $rincianHead2 = $newCOA->rincianexecuteplanning_askep;

                //bot Father
                $pelapor = StrukPlanning::where('norec',$norecHead2)->first();
                $ruangan = \DB::table('ruangan_m')->where('id',$ruanganHead2)->first();
                $ruanganTujuan = \DB::table('ruangan_m')->where('id',$ruangtujuanHead2)->first();
                // $jenislayann =  DB::table('jenispekerjaan_m')->where('id',$request['jenisKerusakan'])->first();
                $secret_token = "5446769474:AAFjx5jWWWTTvDKLskXL8xZ4Ry7NrhNhnvQ";
                $telegram_id = '-730865432';//'-498979335';
                $url = "https://api.telegram.org/bot" . $secret_token . "/sendMessage?parse_mode=html&chat_id=" . $telegram_id;
                $url = $url . "&text=" . urlencode("✅ Laporan Baru: <b>Permohonan Perbaikan IPSRS </b> \n\n Ruangan / area: <b>".$ruangan->namaruangan.
                        "</b>  \n Pelapor: <b>".$pelapor->pelapor."</b>  \n Laporan Kerusakan: <b>".$rincianHead2.
                        "</b> \n Ruangan Tujuan: <b>".$ruanganTujuan->namaruangan."</b>");
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
                
            } else if($newCOA->objectkelompoktransaksifk== 305){
                $tele= false;
                $cobainnn= '';
                $isAktif = \DB::table('settingdatafixed_m')
                ->where('namafield', 'TelegramPerbaikanIPSRS')->where('statusenabled', true)->get();
                
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
                "as" => 'dy@epic',
            );
        } else {
            $transMessage = $transMessage ." Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'dy@epic',
                'e' => $e->getLine(),
                'message'=> $e->getMessage(),
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDaftarRT(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        // $KdKelTransIPSRS = (int) $this->settingDataFixed('KdKelTransIPSRS', $kdProfile);
        $dataLogin = $request->all();
        $tgl="";
        $jenisalat="";
        $idRuangan="";
        $ruangantj="";
        $pelapor="";
        $jeniskerusakan="";

        if ((isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") && (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined"))
        {
            $tgl = "AND stp.tglplanning BETWEEN '".$request['tglAwal']."' AND '".$request['tglAkhir']."' ";
        }

        if (isset($request['jenisalat']) && $request['jenisalat'] != "" && $request['jenisalat'] != "undefined")
        {
            $jenisalat = "AND stp.objectjenisalatfk = '".$request['jenisalat']."' ";
        }

        if (isset($request['jeniskerusakan']) && $request['jeniskerusakan'] != "" && $request['jeniskerusakan'] != "undefined")
        {
            $jeniskerusakan = "AND stp.objectjenispekerjaanfk = '".$request['jeniskerusakan']."' ";
        }

        if (isset($request['ruangan']) && $request['ruangan'] != "" && $request['ruangan'] != "undefined")
        {
                $idRuangan = "AND stp.objectruanganfk = '".$request['ruangan']."'";
        }

        if (isset($request['ruangantujuan']) && $request['ruangantujuan'] != "" && $request['ruangantujuan'] != "undefined")
        {
                $ruangantj = "AND stp.objectruangantujuanfk = '".$request['ruangantujuan']."'";
        }

        if (isset($request['pelapor']) && $request['pelapor'] != "" && $request['pelapor'] != "undefined")
        {
                $ruangantj = "AND stp.pelapor = '".$request['pelapor']."'";
        }

        $data = DB::select(DB::raw("
            SELECT  stp.norec, rg.namaruangan, stp.tglplanning,stp.objectpegawaipjawabfk,pg.namalengkap, stp.startdate, stp.duedate, stp.rincianexecuteplanning_askep, stp.pelapor, 
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
			WHERE stp.kdprofile = $kdProfile 
			AND stp.objectkelompoktransaksifk = 305
			AND stp.statusenabled = true 
			$tgl
			$jenisalat
            $idRuangan
            $ruangantj
            $pelapor
            $jeniskerusakan
            ORDER BY stp.tglplanning DESC"));

        foreach ($data as $item) {
            $details = \DB::select(DB::raw("select spd.pegawaifk as id,pr.namalengkap
                    from strukplanningdetail_t as spd 
                    left JOIN pegawai_m as pr on pr.id = spd.pegawaifk                    
                    where spd.kdprofile = $kdProfile and noplanningfk = :norec"),
                array(
                    'norec' => $item->norec,
                )
            );
           
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
                'name' => $item->name
            );
        }
        if (count($data) == 0) {
            $result = [];
        }
        $result = array(
            'data' => $result,
            'datalogin' => $dataLogin,
            // 'KdKelTransIPSRS'=> $KdKelTransIPSRS,
            'message' => 'as@epic',
        );

        return $this->respond($result);
//        return $this->respond($data);
    }
    public function getComboPegawai(Request $request)
    {
        $data=\DB::select(DB::raw("SELECT DISTINCT pg.id, pg.namalengkap from pegawai_m pg 
        inner join loginuser_s lu on lu.objectpegawaifk = pg.id
        where lu.objectkelompokuserfk in(36,38,47) and pg.kdprofile = 30 and pg.statusenabled=true and lu.kdprofile = 30 and lu.statusenabled=true 
        and pg.id not in(2,320263)"));
        $objekperbaikan = \DB::table('detailjenispekerjaan_m')->where('statusenabled', true)->where('kdprofile', 30)->get();
        $result = array(
            'data'=> $data,
            'objekperbaikan'=> $objekperbaikan,
            'as'=> 'Feezy'
        );
        return $this->respond($result);
    }
    public function SavePengerjaanPermohonanSIMRS(Request $request)
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
                $newCOA->objectjenisalatfk = $request['strukplanning']['jenisalat'];
                $newCOA->ispihakketiga = $request['strukplanning']['ispihakketiga'];
                $newCOA->catatan = $request['strukplanning']['catatan'];
                $newCOA->objectdetailjenispekerjaanfk = $request['strukplanning']['detailjenispekerjaan'];
                $newCOA->objectrekananperbaikanfk = $request['strukplanning']['rekananperbaikan'];
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

    public function responseTime(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        $dataLogin = $request->all();

        try {
            $newCOA =  StrukPlanning::where('norec',$request['norec'])->first();
            $newCOA->tglverif = $request['tglverif'];
            $newCOA->save();


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
                "as" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage ." Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getLaporanPerbaikanIT(Request $request)
    {
        $objekperbaikan = '';
        if(isset($request['objekperbaikan'])){
            $objekperbaikan = ' and stp.objectdetailjenispekerjaanfk = '. $request['objekperbaikan'];
        }

        $data = \DB::select(DB::raw("SELECT stp.norec, ru.namaruangan,pg.namalengkap, stp.rincianexecuteplanning_askep, stp.tglplanning, stp.tglverif, stp.startdate, stp.duedate, jp.reportdisplay as jeniskerusakan, jp2.reportdisplay  as jenisalat, sp.statuspekerjaan FROM strukplanning_t stp 
        left join ruangan_m ru on ru.id = stp.objectruanganfk
        left join pegawai_m pg on pg.id = stp.narasumberfk
        left join jenispekerjaan_m jp on jp.id = stp.objectjenispekerjaanfk
        left join jenispekerjaan_m jp2 on jp2.id = stp.objectjenisalatfk
        left join statuspekerjaan_m sp on sp.id =stp.objectstatuspekerjaanfk
        where stp.objectkelompoktransaksifk = 151 and stp.kdprofile = 30 and stp.statusenabled = true and stp.startdate between '$request[tglAwal]' and '$request[tglAkhir]'
        $objekperbaikan
        order by stp.startdate asc
        "));
        foreach ($data as $d) {
            $details= \DB::select(DB::raw("select stpd.*, pg.namalengkap from strukplanningdetail_t stpd inner join pegawai_m pg on pg.id = stpd.pegawaifk where stpd.noplanningfk ilike '$d->norec'"));
            $d->detailspegawai = $details;
        }
        return $this->respond($data);
    }
    public function getDashboardPerbaikanPDTI(Request $request)
    {

        // $cardnull = \DB::select(DB::raw("
        // SELECT sp.id,
        // 'Belum Direspon' as statuspekerjaan, count(stp.objectstatuspekerjaanfk) FROM strukplanning_t stp left join statuspekerjaan_m sp on sp.id = stp.objectstatuspekerjaanfk
        // where stp.objectkelompoktransaksifk = 151 and  stp.kdprofile= 30 and stp.statusenabled = true and stp.tglverif is null and stp.startdate between '$request[tglawal]' and '$request[tglakhir]'
        // GROUP BY stp.objectstatuspekerjaanfk, sp.id
        // "));
        // if(count($cardnull) < 1){
        //     $cardnull[0]['id'] = null;
        //     $cardnull[0]['statuspekerjaan'] = 'Belum Direspon';
        //     $cardnull[0]['count'] = 0;
        // }

        $card3 = \DB::select(DB::raw("
        SELECT sp.id,
        sp.statuspekerjaan, count(stp.objectstatuspekerjaanfk) FROM strukplanning_t stp left join statuspekerjaan_m sp on sp.id = stp.objectstatuspekerjaanfk
        where stp.objectkelompoktransaksifk = 151 and  stp.kdprofile= 30 and stp.statusenabled = true and sp.id = 3 and stp.startdate between '$request[tglawal]' and '$request[tglakhir]'
        GROUP BY stp.objectstatuspekerjaanfk, sp.id
        "));
        if(count($card3) < 1){
            $card3[0]['id'] = 3;
            $card3[0]['statuspekerjaan'] = 'Belum Dikerjakan';
            $card3[0]['count'] = 0;
        }
                
        $card15 = \DB::select(DB::raw("
        SELECT sp.id,
        sp.statuspekerjaan, count(stp.objectstatuspekerjaanfk) FROM strukplanning_t stp left join statuspekerjaan_m sp on sp.id = stp.objectstatuspekerjaanfk
        where stp.objectkelompoktransaksifk = 151 and  stp.kdprofile= 30 and stp.statusenabled = true and sp.id = 15 and stp.startdate between '$request[tglawal]' and '$request[tglakhir]'
        GROUP BY stp.objectstatuspekerjaanfk, sp.id
        "));
        if(count($card15) < 1){
            $card15[0]['id'] = 15;
            $card15[0]['statuspekerjaan'] = 'Progress';
            $card15[0]['count'] = 0;
        }
        
        $card1 = \DB::select(DB::raw("
        SELECT sp.id,
        sp.statuspekerjaan, count(stp.objectstatuspekerjaanfk) FROM strukplanning_t stp left join statuspekerjaan_m sp on sp.id = stp.objectstatuspekerjaanfk
        where stp.objectkelompoktransaksifk = 151 and  stp.kdprofile= 30 and stp.statusenabled = true and sp.id = 1 and stp.startdate between '$request[tglawal]' and '$request[tglakhir]'
        GROUP BY stp.objectstatuspekerjaanfk, sp.id
        "));
        if(count($card1) < 1){
            $card1[0]['id'] = 1;
            $card1[0]['statuspekerjaan'] = 'Selesai';
            $card1[0]['count'] = 0;
        }
        $card = array(
            // 0=> $cardnull,
            0=> $card3,
            1=> $card15,
            2=> $card1,
        );
        $pie = \DB::select(DB::raw("SELECT count(stp.objectjenisalatfk)as value, jp.reportdisplay as category FROM strukplanning_t stp
        inner join jenispekerjaan_m jp on jp.id = stp.objectjenisalatfk
        where stp.objectkelompoktransaksifk = 151 and stp.kdprofile= 30 and stp.statusenabled = true and stp.startdate between '$request[tglawal]' and '$request[tglakhir]'
        GROUP BY jp.reportdisplay
            "));
        $result = array(
            'card'=> $card,
            'pie'=> $pie,
        );
        return $this->respond($result);
    }
}