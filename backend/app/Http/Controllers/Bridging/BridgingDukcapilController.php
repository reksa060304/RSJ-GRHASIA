<?php
/**
 * Created by PhpStorm.
 * User: Egie Ramdan
 * Date: 10/9/2019
 * Time: 3:10 PM
 */

namespace App\Http\Controllers\Bridging;

use App\Http\Controllers\ApiController;
use App\Transaksi\AntrianPasienDiperiksa;
use App\Transaksi\BPJSRujukan;
use App\Transaksi\PasienDaftar;
use App\Transaksi\PelayananPasienPetugas;
use App\Transaksi\BPJSKlaimTxt;
use App\Transaksi\BPJSGagalKlaimTxt;
use App\Transaksi\PemakaianAsuransi;
use App\Transaksi\StrukPelayanan;
use App\Transaksi\TempBilling;
use Illuminate\Http\Request;
use App\Traits\PelayananPasienTrait;
use DB;
use App\Traits\Valet;
use Carbon\Carbon;

class BridgingDukcapilController extends ApiController
{

    use Valet, PelayananPasienTrait;

    public function __construct()
    {
        parent::__construct($skip_authentication = false);
    }
    public function getDataMasalahKeperawatan(Request $request)
    {
        $data = '';
        $tglAkhir = $request['tglAkhir'];
        if($request['instalasi']=='1'){
            $data=\DB::select(DB::raw(
                "SELECT dkm.diagnosakeperawatan as masalahkeperawatan, count(dkt.norec) as jumlah from diagnosakep_t dkt
                INNER JOIN diagnosakep_m dkm on dkm.id = dkt.objectdiagnosakepfk
                where dkt.statusenabled=true and dkt.kdprofile=30 and dkt.tglinput BETWEEN '$request[tglAwal]' and '$tglAkhir'
                group by dkm.diagnosakeperawatan
                ORDER by count(dkt.norec) desc;"
            ));
        }else if($request['instalasi'] == '2'){
            $data = \DB::select(DB::raw(
                "SELECT ed.caption as masalahkeperawatan, count(emrpd.value) as jumlah FROM emrpasiend_t emrpd
                inner join emrd_t ed on ed.id = emrpd.emrdfk 
                where 
                emrpd.statusenabled = true and emrpd.kdprofile = 30 and
                emrpd.tgl between '$request[tglAwal]' and '$tglAkhir' and emrpd.emrdfk in(3015887,3015884,3015881,3015878,3015875,3015872,3015869,3015866,3015863,3015860,3015857,3015854,3015851,3015848,3015845,3015842,3015839,3015836,3015833,3015830,3015827,3015824,3015821,3015818,3015815,3015812,3015809,3015806,3015803,3015800,3015797,3015794,3015791,3015788,3015785,3015782,3015779,3015776,3015773,3015770,3015767,3015764,3015761,3015758,3015755,3015752,3015749,3015746,3015743,3015740,3015737,3015734,3015731,3015728,3015725,3015722,3015719,3015716)
                group by ed.caption
                ORDER BY count(emrpd.value) desc"
            ));
        } else if($request['instalasi']=='3'){
            $data=\DB::select(DB::raw(
                "SELECT dkm.diagnosakeperawatan as masalahkeperawatan, count(dkt.norec) as jumlah from diagnosakep_t dkt
                INNER JOIN diagnosakep_m dkm on dkm.id = dkt.objectdiagnosakepfk
                inner join antrianpasiendiperiksa_t apd on apd.norec = dkt.norec_apd
                inner join ruangan_m ru on ru.id = apd.objectruanganfk
                where dkt.statusenabled=true and dkt.kdprofile=30 and dkt.tglinput BETWEEN '$request[tglAwal]' and '$tglAkhir'
                and ru.objectdepartemenfk = 24
                group by dkm.diagnosakeperawatan
                ORDER by count(dkt.norec) desc;"
            ));
        }
        
        $result = array(
            "data"=> $data,
            'as'=> 'Fizy'
        );
        return $this->respond($result);
    }
    public function getIdentitasByNIK($nik) {
        $url = $this->settingDataFixed('urlApiDukcapil',$kdProfile);
        $user_id = $this->settingDataFixed('userDukcapil',$kdProfile);
        $password = $this->settingDataFixed('passwordDukcapil',$kdProfile);
        if($url ==  null  || $user_id ==  null || $password == null){
            $result = array(
              'message' => 'Setting Data Fixed Dukcapil Kosong'
            );
            return $this->respond($result);
        }

        $curl = curl_init();

        curl_setopt_array($curl, array(
//            CURLOPT_PORT => ,
            CURLOPT_URL=> $url."?user_id=".$user_id."&password=".$password."&NIK=".$nik,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json; charset=utf-8",
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            return $this->setStatusCode(400)->respond('', "Proses Bridging Ke Ducapil Error #:" . $err);
            $result= "Proses Bridging Ke Ducapil Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);
    }
    public function getNIKwilayahProv ($nik, Request $r) {
        $kdProfile = $this->getDataKdProfile($r);
        $url = $this->settingDataFixed('urlApiDukcapil',$kdProfile);
        $user_id = $this->settingDataFixed('userDukcapil',$kdProfile);
        $password = $this->settingDataFixed('passwordDukcapil',$kdProfile);

        if($url ==  null  || $user_id ==  null || $password == null){
            $result = array(
                'message' => 'Setting Data Fixed Dukcapil Kosong'
            );
            return $this->respond($result);
        }

        $now = date('dmY');
        $pass = md5($password.$now);

        $curl = curl_init();
        $url = $url.'?USER_ID='.$user_id.'&PASSWORD='.$pass.
            '&NIK='.$nik;

        curl_setopt_array($curl, array(
//            CURLOPT_PORT => ,
            CURLOPT_URL=>$url,// $url."?user_id=".$user_id."&password=".$password."&NIK=".$nik,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json; charset=utf-8",
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            return $this->setStatusCode(400)->respond('', "Proses Bridging Ke Ducapil Error #:" . $err);

        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);
    }
    public function getNikNasional($nik, Request $r) {
     
        $kdProfile = $this->getDataKdProfile($r);
        $data = array(
            "nik" =>$nik,
            "user_id" => $this->settingDataFixed('userIdNikNasional',$kdProfile), 
            "password"=> $this->settingDataFixed('passNikNasional',$kdProfile), 
            "ip_user"=>$this->settingDataFixed('ipServer',$kdProfile),     
          ); 
        $dataJsonSend = json_encode($data);
           // return $dataJsonSend;
        $curl = curl_init();
        curl_setopt_array($curl, array(
          // CURLOPT_PORT => $request['port'],
          CURLOPT_URL => $this->settingDataFixed('urlGetNikNasional',$kdProfile),
          CURLOPT_RETURNTRANSFER => true,
          CURLOPT_ENCODING => "",
          CURLOPT_MAXREDIRS => 10,
          CURLOPT_TIMEOUT => 30,
          CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
          CURLOPT_CUSTOMREQUEST => "POST",
          CURLOPT_POSTFIELDS => $dataJsonSend,
          CURLOPT_HTTPHEADER => array(
            "cache-control: no-cache",
            "content-type: application/json",
            // "postman-token: f5103086-f421-0f8f-5270-f7e11de81651"
          ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

       if ($err) {
            return $this->setStatusCode(400)->respond('', "Proses Bridging Ke Ducapil Error #:" . $err);

        } else {
            $result = (array) json_decode($response);
        }
         return $this->respond($result);

    }

    //dukcapil V2
    function getHeaderDukcapilV2($type = null)
    {
        // $data = $this->getIdConsumerBPJS();

        // $secretKey = $this->getPasswordConsumerBPJS();
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // $encodedSignature = base64_encode($signature);

        $header = array(
            "Content-Type: Application/json",
            "Accept: Application/json",
            // "X-cons-id: " . null,
            // "X-signature: " . null,
            // "X-timestamp: " . (string)$tStamp,
            // "user_key: " . $this->userKeyBPJS()
            // 35f89b7e03c13f1ff62de0be77584945
        );
        $header['headers'] = $header;
        $header['cons'] = array(
            'data' => null,
            'secretKey' => null,
            'signature' => null,
            'tStamp' => $tStamp,
            // 'user_key' =>  $this->userKeyBPJS(),
        );
        return $header;
    }
    protected function curlAPIDukcapil2($headers, $dataJsonSend= null, $url, $method, $tipe = null)
    {
        if ($dataJsonSend == null) {
        $curl = curl_init();
            curl_setopt_array($curl, array(
            CURLOPT_URL => 'http://172.16.160.43:8080/dukcapil/get_json/34/rsj_grhasia_34/koneksitas_verifby_elemen',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_HTTPHEADER => array(
                'Accept: application/json',
                'Content-Type: application/json',
                'Authorization: Basic OTQ4MjAyMjA4MDU0MzRfcnNqZ3JoYXNpYV9kaXk6cnNqZ3JoNHMxNF9kMXk=',
                'Cookie: JSESSIONID=FA5097E2249882DA9C719AA80EB1841F; BIGipServer=429920428.36895.0000'
            ),
            ));
        } else {
            // return $dataJsonSend;
            $curl = curl_init();
            curl_setopt_array($curl, array(
            CURLOPT_URL => 'http://172.16.160.43:8080/dukcapil/get_json/34/rsj_grhasia_34/koneksitas_verifby_elemen',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS =>$dataJsonSend,
            CURLOPT_HTTPHEADER => array(
                'Accept: application/json',
                'Content-Type: application/json',
                'Authorization: Basic OTQ4MjAyMjA4MDU0MzRfcnNqZ3JoYXNpYV9kaXk6cnNqZ3JoNHMxNF9kMXk=',
                'Cookie: JSESSIONID=FA5097E2249882DA9C719AA80EB1841F; BIGipServer=429920428.36895.0000'
            ),
            ));

        }

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = array(
                'metaData' => array(
                    'code' => 400,
                    'message' => 'Gagal menghubungkan ke Dukcapil (' . $url . ')'
                ),
            );
        } else {
                // $result = $response;
        
            if ($this->isJson($response)) {
                $result = json_decode($response);
            } else {
                $result = $response;
            }
        }

        return $result;
    }
    function isJson($string)
    {
        json_decode($string);
        return json_last_error() === JSON_ERROR_NONE;
    }
    public function getNIKDukcapilV2(Request $request)
    {
        try {

            // $kdProfile = $this->getDataKdProfile($request);
            $headers = $this->getHeaderDukcapilV2();

            $dataJsonSend = null;

            if ($request['data'] != null) {
                $dataJsonSend = json_encode($request['data'][0]);
            }
                // return $this->respond($dataJsonSend);
           
            $methods = $request['method'];

            $url = $request['url'];
  
            $response = $this->curlAPIDukcapil2($headers['headers'], $dataJsonSend, $url, $methods, null);

            $cekData = array(
                'request' => array(
                    'url' => $url,
                    'headers' =>  $headers['headers'],
                    'payload' =>$dataJsonSend,
                    // 'secretKey' => $headers['cons']['secretKey'],
                ), 'response' => $response
                ,'method' => $methods
            );
            // return $this->respond($response);
         
            if ($response != "") {
                $data2 = array(
                    'metaData' => array(
                        'code'=> 201,
                        'message' => $response
                    ) ,
                    'response' => null,
                );
            return $this->respond($data2);
            } else {
                $response2 = array(
                    "metaData" => array(
                        "code" => "404",
                        "message" => $response
                    ),
                    "response" => null
                );
                return $this->respond($response2);
            }
        } catch (\Exception $e) {
            $response = array(
                "metaData" => array(
                    "code" => "404",
                    "message" => "Transaksi tidak dapat di proses, Gagal dicoba kembali (Dukcapil)!"
                ),
                "response" => null,
                "e"=> $e->getMessage(). ' '.$e->getLine()
            );
    
            return $this->respond($response);
        }
        // return $this->respond($response);
    }
    public function getNIKDuplicate(Request $request)
    {
        $data = \DB::select(DB::raw("SELECT * from pasien_m where noidentitas = '$request[nik]'and kdprofile = 30 and statusenabled = true"));
        return $this->respond($data);
    }
    public function getSettingDataFixedDukcapil(Request $request)
    {
        $data = \DB::select(DB::raw("SELECT * from settingdatafixed_m where namafield ilike 'Bridging DUKCAPIL' and kdprofile = 30"));
        $result= array(
            'data'=>$data,
            'as'=>'Fizi'
        );
        return $this->respond($result);
    }
}