<?php

/**
 * Created by PhpStorm.
 * User: egie ramdan
 * Date: 07/10/2021
 * Time: 08.59
 */

namespace App\Http\Controllers\Bridging;

use App\Http\Controllers\ApiController;
use App\Master\Pegawai;
use App\Transaksi\AntrianPasienDiperiksa;
use App\Transaksi\BPJSRujukan;
use App\Transaksi\LoggingUser;
use App\Transaksi\PasienDaftar;
use App\Transaksi\PelayananPasienPetugas;
use App\Transaksi\BPJSKlaimTxt;
use App\Transaksi\BPJSGagalKlaimTxt;
use App\Transaksi\PemakaianAsuransi;
use App\Transaksi\StrukPelayanan;
use App\Transaksi\TempBilling;
use App\Transaksi\FundTransfer;
use Illuminate\Http\Request;
use App\Traits\PelayananPasienTrait;
use App\User;
use App\Transaksi\StrukBuktiPengeluaran;
use DB;
use App\Traits\Valet;
use Carbon\Carbon;
use Webpatser\Uuid\Uuid;
use Lcobucci\JWT\Builder;

use App\Transaksi\VirtualAccount;
use Lcobucci\JWT\Signer\Hmac\Sha512;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Signer\Hmac\Sha384;

class BridgingOCBCNISPController extends ApiController
{
    use Valet, PelayananPasienTrait;

    public function __construct()
    {
        parent::__construct($skip_authentication = false);
    }
    protected $clientId ='90312';
    protected $isProduction = false;
    protected function curlAPI($headers, $dataJsonSend = null, $url, $method)
    {
        $curl = curl_init();
        // dd($headers);
        if ($dataJsonSend == null || $dataJsonSend == '') {
            curl_setopt_array($curl, array(
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_SSL_VERIFYHOST => 0,
                CURLOPT_SSL_VERIFYPEER => 0,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => $method,
                CURLOPT_HTTPHEADER => $headers
            ));
        } else {
            curl_setopt_array($curl, array(
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_SSL_VERIFYHOST => 0,
                CURLOPT_SSL_VERIFYPEER => 0,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => $method,
                CURLOPT_POSTFIELDS => $dataJsonSend,
                CURLOPT_HTTPHEADER => $headers
            ));
        }

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);
        if ($err) {
            $result = "Terjadi Kesalahan #:" . $err;
        } else {

            $result = json_decode($response);
        }
        return $result;
    }
    function compute_hash($secret, $payload)
    {
        $hexHash = hash_hmac('sha256', $payload, utf8_encode($secret));
        $base64Hash = base64_encode(hex2bin($hexHash));
        return $base64Hash;
    }
     
    function hash_is_valid($secret, $payload, $verify)
    {
        $computed_hash = compute_hash($secret, $payload);
        return hash_equals($verify,$computed_hash);
    }
    function listFund (){
       return ['/corporate/v2/transfers/overbooking','/corporate/v2/transfers/llg','/corporate/v2/transfers/rtgs',
        '/corporate/v2/transfers/online/inquiry','/corporate/v2/transfers/status','/corporate/v2/transfers/online/submit',
        '/corporate/v2/payments/inquiry','/corporate/v2/payments/submit'];
    }
    function listSTT (){
       return['/v1/casa/stmt/history'];
    }
    function listBalance (){
        return ['/v1/casa/balance/1'];
    }
    function getHeaders($httpMethod, $requestPath, $requestBody, $tanpaContenType = false)
    {

        if ($httpMethod == 'GET' || !$httpMethod) {
            $requestBody = '';
        } else {
            $requestBody = $requestBody;
        }
        $token = $this->retrieveToken(true);
        if (!isset($token)) {
            return $this->respond(['message' => 'Not Authorize', 'code' => '999']);
        }
        $token = $token->access_token;

        date_default_timezone_set('Asia/Jakarta');
        $date = strtotime(date('Y-m-d H:i:s'));
        $timestamp =  substr(date("Y-m-d\TH:i:s.u", $date), 0, 23) . date('P', $date);

        $Nonce =str_replace('-', '', substr(Uuid::generate(), 0, 36));
    
        if(in_array($requestPath,$this->listFund())){
             $APIKey = $this->settingDataFixed('apiKey_OCBC', $this->getKdProfile());
             $APISecret = $this->settingDataFixed('apiSecret_OCBC', $this->getKdProfile());
        }

        if(in_array($requestPath,$this->listSTT())){
             $APIKey = $this->settingDataFixed('apiKey_Inq_statement', $this->getKdProfile());
             $APISecret = $this->settingDataFixed('apiSecret_Inq_statement', $this->getKdProfile());
        }
        if(in_array($requestPath,$this->listBalance())){
             $APIKey = $this->settingDataFixed('apiKey_Inq_balance', $this->getKdProfile());
             $APISecret = $this->settingDataFixed('apiSecret_Inq_balance', $this->getKdProfile());
        }       
    
        $payload =str_replace(' ',"",$requestBody);
        $body =   strtolower(hash("sha256", $payload));
        $StringToSign = $Nonce . ":" . $APIKey . ":" . $httpMethod . ":" 
                       . $requestPath . ":" . $token . ":" . $body . ":" . $timestamp;
     
        $hmacValue = hash_hmac('sha256',  $StringToSign ,$APISecret, false);
        $signatureString =$APIKey . ':' . $hmacValue . ':' . $Nonce . ':' . $timestamp;
        $SignatureValue = base64_encode($APIKey . ':' . $hmacValue . ':' . $Nonce . ':' . $timestamp);
        // $dd = array(
        //     'timestamp'=> $timestamp,
        //     'realiveUrl'=> $requestPath,
        //     'nonce'=> $Nonce,
        //     'token'=> $token,
        //     'payload1'=> $payload,
        //     'payload2'=>$payload2,
        //     'sha256Payload1'=> $body,
        //     'sha256Payload2'=> $body2,
        //     'stringToSign'=> $StringToSign,
        //     'hmacValue'=>$hmacValue,
        //     'signatureString'=> $signatureString,
        //     'signatureValue'=>$SignatureValue,
        // );
        // dd($dd);
        $header = array(
            'Content-Type: application/json',
            'Accept: application/json',
            'Authorization: Bearer '.$token,
            'X-OCBC-Timestamp: '.$timestamp,
            'X-OCBC-APIKey: '.$APIKey,
            'X-OCBC-Signature: '.$SignatureValue
        );
    
        // if ($tanpaContenType) {
        //     array_splice($header, 3, 1);
        // }
        return $header;
    }
    function getHeadersSignature($httpMethod, $requestPath, $requestBody, $tanpaContenType = false)
    {

        if ($httpMethod == 'GET' || !$httpMethod) {
            $requestBody = '';
        } else {
            $requestBody = $requestBody;
        }
        $token = $this->retrieveToken(true)->access_token;
        if (!isset($token)) {
            return $this->respond(['message' => 'Not Authorize', 'code' => '999']);
        }

        date_default_timezone_set('Asia/Jakarta');

        $date = strtotime(date('Y-m-d H:i:s'));
        $timestamp =  substr(date("Y-m-d\TH:i:s.u", $date), 0, 23) . date('P', $date); //output: Y-m-d H:i:s UTC +00:00

        $APIKey = $this->getClientSecret(false)['apiKey'];
        $APISecret = $this->getClientSecret(false)['apiSecret'];

        $header = array(
            'Timestamp:' . $timestamp,
            'URI:' . '/corporate/v2/transfers/overbooking',
            'X-OCBC-APIKey:' . $APIKey,
            'AccessToken:' . $token,
            'Content-Type:application/json',
            'secret:' .  $APISecret,
            'HTTPMethod: GET',
        );
        // dd($header);

        // if ($tanpaContenType) {
        //     array_splice($header, 3, 1);
        // }
        // dd($header);
        return $header;
    }
    function endPoint($kdProfile)
    {
        $set = $this->settingDataFixed('isProductionOCBC', $kdProfile);
        if ($set == 'false') {
            $res = 'https://developer.ocbcnisp.com/sandbox';
        } else {
            $res = 'https://api.ocbcnisp.com/api';
        }
        return $res;
    }
    protected function getKdProfile()
    {
        $session = \Session::get('userData');
        return User::where('id', $session['id'])->first()->kdprofile;
    }
    function getClientSecret()
    {
        $set = $this->settingDataFixed('isProductionOCBC', $this->getKdProfile());
        // if ($set == 'true') {
            $res['client_id'] =  $this->settingDataFixed('client_id_OCBC', $this->getKdProfile());
            $res['client_secret'] =  $this->settingDataFixed('client_secret_OCBC', $this->getKdProfile());
        // } else {
        //     $res['client_id'] =    $this->settingDataFixed('client_id_dev_OCBC', $this->getKdProfile());
        //     $res['client_secret'] =  $this->settingDataFixed('client_secret_dev_OCBC', $this->getKdProfile());
        // }
 
        return $res;
    }
    function retrieveToken($lokal = null)
    {
        $kdProfile = $this->getKdProfile();
        // dd($this->getClientSecret());
        $base64 = base64_encode($this->getClientSecret()['client_id'] . ':' . $this->getClientSecret()['client_secret']);
        $headers = array(
            'Authorization:Basic ' . (string) $base64,
            'Content-Type:application/x-www-form-urlencoded',
        );

        $dataJsonSend =  "grant_type=client_credentials";
        $methods = 'POST';
        $url = $this->endPoint($kdProfile) . "/oauth/token";

        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods);

        if ($lokal == true) {
            return $response;
        }
        return $this->respond($response);
    }
    public function overbooking(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $req = $request->input();
        unset($req['userData']);
        $dataJsonSend = json_encode($req);
        $methods = 'POST';
        $path = "/corporate/v2/transfers/overbooking";
        $url = $this->endPoint($kdProfile) . $path;
        // dd($url);
        $headers = $this->getHeaders($methods, $path, $dataJsonSend);
        // return $headers;
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods);
        return $this->respond($response);
    }
    public function signature(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $req = $request->input();
        unset($req['userData']);
        $dataJsonSend = json_encode($req);
        $methods = 'POST';
        $path = "/signature";
        $url = $this->endPoint($kdProfile) . $path;
        // dd($url);
        $headers = $this->getHeadersSignature($methods, $path, $dataJsonSend);
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods);
        return $this->respond($response);
    }
    public function fundTransferLLG(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $req = $request->input();
        unset($req['userData']);
        $dataJsonSend = json_encode($req);
        $methods = 'POST';
        $path = "/corporate/v2/transfers/llg";
        $url = $this->endPoint($kdProfile) . $path;
        $headers = $this->getHeaders($methods, $path, $dataJsonSend);
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods);
        return $this->respond($response);
    }
    public function fundTransferRTGS(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $req = $request->input();
        unset($req['userData']);
        $dataJsonSend = json_encode($req);
        $methods = 'POST';
        $path = "/corporate/v2/transfers/rtgs";
        $url = $this->endPoint($kdProfile) . $path;
        $headers = $this->getHeaders($methods, $path, $dataJsonSend);
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods);
        return $this->respond($response);
    }
    public function paymentInquiry(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $req = $request->input();
        unset($req['userData']);
        $dataJsonSend = json_encode($req);
        $methods = 'POST';
        $path = "/corporate/v2/payments/inquiry";
        $url = $this->endPoint($kdProfile) . $path;
        $headers = $this->getHeaders($methods, $path, $dataJsonSend);
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods);
        return $this->respond($response);
    }
     public function paymentSubmit(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $req = $request->input();
        unset($req['userData']);
        $dataJsonSend = json_encode($req);
        $methods = 'POST';
        $path = "/corporate/v2/payments/inquiry";
        $url = $this->endPoint($kdProfile) . $path;
        $headers = $this->getHeaders($methods, $path, $dataJsonSend);
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods);
        return $this->respond($response);
    }
    public function oltInquiry(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $req = $request->input();
        unset($req['userData']);
        $dataJsonSend = json_encode($req);

        $methods = 'POST';
        $path = "/corporate/v2/transfers/online/inquiry";
        $url = $this->endPoint($kdProfile) . $path;
        $headers = $this->getHeaders($methods, $path, $dataJsonSend);
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods);
        return $this->respond($response);
    }
    public function oltSubmit(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $req = $request->input();
        unset($req['userData']);
        $dataJsonSend = json_encode($req);
        $methods = 'POST';
        $path = "/corporate/v2/transfers/online/submit";
        $url = $this->endPoint($kdProfile) . $path;
        $headers = $this->getHeaders($methods, $path, $dataJsonSend);
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods);
        return $this->respond($response);
    }
    public function status(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $req = $request->input();
        unset($req['userData']);
        $dataJsonSend = json_encode($req);
        $methods = 'POST';
        $path = "/corporate/v2/transfers/status";
        $url = $this->endPoint($kdProfile) . $path;
        $headers = $this->getHeaders($methods, $path, $dataJsonSend);
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods);
        return $this->respond($response);
    }
    public function balanceInquiry(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $req = $request->input();
        unset($req['userData']);
        $dataJsonSend = json_encode($req);
        $methods = 'POST';
        $path = "/v1/casa/balance/1";
        $url = $this->endPoint($kdProfile) . $path;
        $headers = $this->getHeaders($methods, $path, $dataJsonSend);
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods);
        return $this->respond($response);
    }
    public function accountStatement(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $req = $request->input();
        unset($req['userData']);
        $dataJsonSend = json_encode($req);
        $methods = 'POST';
        $path = "/v1/casa/stmt/history";
        $url = $this->endPoint($kdProfile) . $path;
        $headers = $this->getHeaders($methods, $path, $dataJsonSend);
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods);
        return $this->respond($response);
    }
    function oAuthToken($lokal = null)
    {
        $kdProfile = $this->getKdProfile();
        // dd($this->getClientSecret());
        $base64 = base64_encode($this->getClientSecret()['client_id'] . ':' . $this->getClientSecret()['client_secret']);
        $headers = array(
            'Authorization:Basic ' . (string) $base64,
            'Content-Type:application/x-www-form-urlencoded',
        );

        $dataJsonSend =  "grant_type=client_credentials";
        $methods = 'POST';
        $url = $this->endPoint($kdProfile) . "/oauth/token";

        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods);

        if ($lokal == true) {
            return $response;
        }
        return $this->respond($response);
    }
    public function inquiryInvVA(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $req = $request->input();
        unset($req['userData']);
        $dataJsonSend = json_encode($req);
        $methods = 'POST';
        $path = "/v1/virtual-account/inquiry";
        $url = $this->endPoint($kdProfile) . $path;
        $headers = $this->getHeaders($methods, $path, $dataJsonSend);
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods);
        return $this->respond($response);
    }
    public function notifPaymentVA(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $req = $request->input();
        unset($req['userData']);
        $dataJsonSend = json_encode($req);
        $methods = 'POST';
        $path = "/v1/virtual-account/payment";
        $url = $this->endPoint($kdProfile) . $path;
        $headers = $this->getHeaders($methods, $path, $dataJsonSend);
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods);
        return $this->respond($response);
    }
    public function unflagPaymenVA(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $req = $request->input();
        unset($req['userData']);
        $dataJsonSend = json_encode($req);
        $methods = 'POST';
        $path = "/v1/virtual-account/unflag";
        $url = $this->endPoint($kdProfile) . $path;
        $headers = $this->getHeaders($methods, $path, $dataJsonSend);
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods);
        return $this->respond($response);
    }
    public function createVA(Request $r){
        DB::beginTransaction();
        try{
            $struk= StrukPelayanan::where('norec',$r['norec_sp'])->first();
            $nova =  $this->clientId.'00'. substr($struk->nostruk,1);
          
            $newVA = new VirtualAccount();
            $newVA->trx_id =  $this->generateCodeBySeqTable(new VirtualAccount(), 'trx_id', 10, date('ymd'), $this->getKdProfile());
            $newVA->kdprofile =  $this->getKdProfile();
            $newVA->type =  $r['type'];
            $newVA->statusenabled =  true;
            $newVA->client_id =  $this->clientId;
            $newVA->trx_amount =  $r['trx_amount'];
            $newVA->billing_type =  $r['billing_type'];
            $newVA->customer_name =  $r['customer_name'];
            $newVA->customer_email =  $r['customer_email'];
            $newVA->customer_phone =  $r['customer_phone'];
            $newVA->datetime_expired =  $r['datetime_expired'];
            $newVA->datetime_created =  date('Y-m-d H:i:s');
            $newVA->description =  $r['description'];
            $newVA->virtual_account =  $nova;
            $newVA->norec_pd = $r['norec_pd'];
            $newVA->norec_sp = $r['norec_sp'] ;
            $newVA->bank =  'OCBC';
            $newVA->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'data' => $newVA,
                'as' => 'er@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'as' => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    
}
