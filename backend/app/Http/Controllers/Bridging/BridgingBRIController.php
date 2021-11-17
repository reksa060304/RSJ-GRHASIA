<?php

/**
 * Created by PhpStorm.
 * User: egie ramdan
 * Date: 18/08/2021
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

class BridgingBRIController extends ApiController
{

    use Valet, PelayananPasienTrait;

    public function __construct()
    {
        parent::__construct($skip_authentication = false);
    }
    protected $isProduction = false;
    protected function curlAPI($headers, $dataJsonSend = null, $url, $method)
    {
        $curl = curl_init();
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
    function getClientSecret($isCBM)
    {
        if ($isCBM) {
            if ($this->isProduction) {
                $res['client_id'] = '';
                $res['client_secret'] = '';
            } else {
                $res['client_id'] = 'x1wPAp4CUP8S0GANta2tcjdyKYbAJvU0';
                $res['client_secret'] = '4nii0MUSxbWpb4Gs';
            }
        } else {
            if ($this->isProduction) {
                $res['client_id'] = '';
                $res['client_secret'] = '';
            } else {
                $res['client_id'] = 'IgjmvA6dZVGN2ir0kAKyI8JIkT823Ues';
                $res['client_secret'] = 'jn3Rle1NSlQH2mm3';
            }
        }

        return $res;
    }
    function endPoint()
    {
        if ($this->isProduction) {
            $res = 'https://partner.api.bri.co.id';
        } else {
            $res = 'https://sandbox.partner.api.bri.co.id';
        }
        return $res;
    }
    function getToken($lokal = null, $isCBM = false)
    {
        // dd($lokal);
        $headers = ['Content-Type' => 'application/x-www-form-urlencoded'];
        $dataJsonSend =
            'client_id=' . $this->getClientSecret($isCBM)['client_id'] .
            '&client_secret=' . $this->getClientSecret($isCBM)['client_secret'];
        $methods = 'POST';
        $url = $this->endPoint() . "/oauth/client_credential/accesstoken?grant_type=client_credentials";
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods);

        if ($lokal == true) {
            return $response;
        }
        return $this->respond($response);
    }
    public function getTokenCBM()
    {
        $token = $this->getToken(true, true);
        return $this->respond($token);
    }
    // function getPath($url) {
    //      $pathRegex = '/.+?\:\/\/.+?(\/.+?)(?:#|\?|$)/';
    //      $result = preg_match($pathRegex,$url);
    //      return $result;
    //     //  return $result && count($result) > 1 ? $result[1] : ''; 
    // }

    // function getQueryString(url) {
    //     var arrSplit = url.split('?');
    //     return arrSplit.length > 1 ? url.substring(url.indexOf('?')+1) : ''; 
    // }
    function getHeaders($httpMethod, $requestPath, $requestBody, $tanpaContenType = false)
    {

        if ($httpMethod == 'GET' || !$httpMethod) {
            $requestBody = '';
        } else {
            $requestBody = $requestBody;
        }
        $token = $this->getToken(true, false)->access_token;

        date_default_timezone_set('UTC');
        $date = Carbon::now();
        $timestamp = $date->format('Y-m-d\TH:i:s.u');

        $timestamp = substr($timestamp, 0, 23) . 'Z';

        $payload = 'path=' . $requestPath . '&verb=' . $httpMethod . '&token=Bearer ' . $token .
            '&timestamp=' . $timestamp . '&body=' . $requestBody;

        $client_secret =  $this->getClientSecret(false)['client_secret'];

        $sig = hash_hmac('sha256', $payload, $client_secret, true);

        $signature = base64_encode($sig);

        $header = array(
            'BRI-Timestamp:' . (string) $timestamp,
            'BRI-Signature:' . (string) $signature,
            'Authorization:Bearer ' . (string) $token,
            'Content-Type: application/json'
        );
        if ($tanpaContenType) {
            array_splice($header, 3, 1);
        }
        return $header;
    }
    function getHeadersCBM($httpMethod, $requestPath, $requestBody, $tanpaContenType = false)
    {

        if ($httpMethod == 'GET' || !$httpMethod) {
            $requestBody = '';
        } else {
            $requestBody = $requestBody;
        }
        $token = $this->getToken(true, true)->access_token;

        date_default_timezone_set('UTC');
        $date = Carbon::now();
        $timestamp = $date->format('Y-m-d\TH:i:s.u');

        $timestamp = substr($timestamp, 0, 23) . 'Z';

        $payload = 'path=' . $requestPath . '&verb=' . $httpMethod . '&token=Bearer ' . $token .
            '&timestamp=' . $timestamp . '&body=' . $requestBody;

        $client_secret =  $this->getClientSecret(true)['client_secret'];

        $sig = hash_hmac('sha256', $payload, $client_secret, true);

        $signature = base64_encode($sig);
        $cbmKey = '3b0215e10be0f368dce8a570fbb527f7e7a1938a963f6a97e636a4d93c5ce221a2b10df88f695181eb9060947ab53340b1a4a8f188c7116f517060ba56050806';

        $header = array(
            'BRI-Timestamp:' . (string) $timestamp,
            'BRI-Signature:' . (string) $signature,
            'Authorization:Bearer ' . (string) $token,
            'CBM-CorporateKey:Bearer ' . (string) $cbmKey,
            'CBM-CorporateRequestId:' . substr(Uuid::generate(), 0, 32),
            'Content-Type: application/json'
        );
        if ($tanpaContenType) {
            array_splice($header, 5, 1);
        }

        return $header;
    }

    public function getBRIVA(Request $request)
    {

        $kdProfile = $this->getDataKdProfile($request);

        $dataJsonSend = null;
        $methods = 'GET';
        $path = "/v1/briva/" . $request['institutionCode'] . "/" . $request['brivaNo'] . "/" . $request['custCode'];
        $url = $this->endPoint() . $path;

        $headers = $this->getHeaders($methods, $path, $dataJsonSend, true);
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods);
        return $this->respond($response);
    }
    public function inquirySingleInvoice($nomorinvoice, Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $dataJsonSend = null;
        $methods = 'GET';
        $path = "/v1/apicbm/invoices/" . $nomorinvoice;
        $url = $this->endPoint() . $path;
        $headers = $this->getHeadersCBM($methods, $path, $dataJsonSend,true);
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods);
        return $this->respond($response);
    }
    public function createInvoice(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $req = $request->input();
        unset($req['userData']);
        $dataJsonSend = json_encode($req);

        $methods = 'POST';
        $path = "/v1/apicbm/invoices/insert";
        $url = $this->endPoint() . $path;
        $headers = $this->getHeadersCBM($methods, $path, $dataJsonSend);
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods);
        return $this->respond($response);
    }
    public function inquiryFacilities(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $dataJsonSend =  null;

        $methods = 'GET';
        $path = "/v1/apicbm/facilities/" . $request['anchorCode'];
        $url = $this->endPoint() . $path;
        $headers = $this->getHeadersCBM($methods, $path, $dataJsonSend,true);
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods);
        return $this->respond($response);
    }
    public function inquiryListPartner(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $dataJsonSend = null;

        $methods = 'GET';
        $path = "/v1/apicbm/partners/" . $request['anchorCode'];
        $url = $this->endPoint() . $path;
        $headers = $this->getHeadersCBM($methods, $path, $dataJsonSend,true);
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods);
        return $this->respond($response);
    }
    public function inquiryFacilityBalance(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $dataJsonSend =  null;

        $methods = 'GET';
        $path = "/v1/apicbm/facilities/" . $request['anchorCode'];
        $url = $this->endPoint() . $path 
        . '?facility_code=' . $request['facility_code'] 
        . '&facility_account=' . $request['facility_account']
        . '&partner_code=' . $request['partner_code'];
        $headers = $this->getHeadersCBM($methods, $path, $dataJsonSend,true);
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods);
        return $this->respond($response);
    }
    public function inquiryDetailPartner(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $dataJsonSend =  null;

        $methods = 'GET';
        $path = "/v1/apicbm/partners/" . $request['anchorCode'];
        $url = $this->endPoint() . $path . '?partner_code=' . $request['partner_code'];

        $headers = $this->getHeadersCBM($methods, $path, $dataJsonSend, true);

        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods);
        return $this->respond($response);
    }
    public function inquiryPartnerFacility(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $dataJsonSend = null;

        $methods = 'GET';
        $path = "/v1/apicbm/partners/" . $request['anchorCode'];
        $url = $this->endPoint() . $path . '?partner_code=' . $request['partner_code'] . '&facility_code=' . $request['facility_code'];
        $headers = $this->getHeadersCBM($methods, $path, $dataJsonSend, true);

        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods);
        return $this->respond($response);
    }
    public function cancelInvoice(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $req = $request->input();
        unset($req['userData']);
        $dataJsonSend = json_encode($req);
        $methods = 'POST';
        $path = "/v1/apicbm/invoices/cancel";
        $url = $this->endPoint() . $path;
        $headers = $this->getHeadersCBM($methods, $path, $dataJsonSend);
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods);
        return $this->respond($response);
    }
    public function paymentInvoice(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $req = $request->input();
        unset($req['userData']);
        $dataJsonSend = json_encode($req);
        $methods = 'POST';
        $path = "/v1/apicbm/invoices/payment";
        $url = $this->endPoint() . $path;
        $headers = $this->getHeadersCBM($methods, $path, $dataJsonSend);
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods);
        return $this->respond($response);
    }
    public function creteEndpoint(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $req = $request->input();
        unset($req['userData']);
        $dataJsonSend = json_encode($req);
        $methods = 'POST';
        $path = "/v1/briva";
        $url = $this->endPoint() . $path;

        $headers = $this->getHeaders($methods, $path, $dataJsonSend);
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods);
        return $this->respond($response);
    }
    public function getReportDateVA(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);

        $dataJsonSend = null;
        $methods = 'GET';
        $path = "/v1/briva/report/" . $request['institutionCode'] . "/" . $request['brivaNo'] . "/" . $request['tglAwal'] . "/" . $request['tglAkhir'];
        $url = $this->endPoint() . $path;

        $headers = $this->getHeaders($methods, $path, $dataJsonSend, true);
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods);
        return $this->respond($response);
    }
    public function getStatusBayarVA(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);

        $dataJsonSend = null;
        $methods = 'GET';
        $path = "/v1/briva/status/" . $request['institutionCode'] . "/" . $request['brivaNo'] . "/" . $request['custCode'];
        $url = $this->endPoint() . $path;

        $headers = $this->getHeaders($methods, $path, $dataJsonSend, true);
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods);
        return $this->respond($response);
    }
    public function updateStatusVA(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);

        $req = $request->input();
        unset($req['userData']);
        $dataJsonSend = json_encode($req);
        $methods = 'PUT';
        $path = "/v1/briva/status";
        $url = $this->endPoint() . $path;

        $headers = $this->getHeaders($methods, $path, $dataJsonSend, false);
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods);
        return $this->respond($response);
    }
    public function updateEndpoint(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);

        $req = $request->input();
        unset($req['userData']);
        $dataJsonSend = json_encode($req);
        $methods = 'PUT';
        $path = "/v1/briva";
        $url = $this->endPoint() . $path;

        $headers = $this->getHeaders($methods, $path, $dataJsonSend, false);
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods);
        return $this->respond($response);
    }
    public function deleteEndpoint(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);

        $dataJsonSend = "institutionCode=" . $request['institutionCode'] . "&brivaNo=" . $request['brivaNo'] .
            "&custCode=" . $request['custCode'];
        $methods = 'DELETE';

        $path = "/v1/briva";
        $url = $this->endPoint() . $path;

        $headers = $this->getHeaders($methods, $path, $dataJsonSend, true);
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods);
        return $this->respond($response);
    }
    public function getReportTimeVA(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);

        $dataJsonSend = null;
        $methods = 'GET';
        $dari = explode(' ',$request['tglAwal']);
        $tglAwal = $dari[0];
        $jamAwal = $dari[1];
   
        $sampai = explode(' ',$request['tglAkhir']);
        $tglAkhir = $sampai[0];
        $jamAkhir = $sampai[1];
   
        $path = "/v1/briva/report_time/" . $request['institutionCode']
            . "/" . $request['brivaNo']
            . "/" . $tglAwal
            . "/" . $jamAwal
            . "/" . $tglAkhir
            . "/" . $jamAkhir;
           
        $url = $this->endPoint() . $path;

        $headers = $this->getHeaders($methods, $path, $dataJsonSend, true);
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods);
        return $this->respond($response);
    }
    public function validasiAccountFund(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $req = $request->input();
        unset($req['userData']);
        $dataJsonSend = json_encode($req);
        $methods = 'POST';

        $path = "/v3.1/transfer/internal/accounts";
        $url = $this->endPoint() . $path;

        $headers = $this->getHeaders($methods, $path, $dataJsonSend, false);
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods);
        return $this->respond($response);
    }
    public function transferFund(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $req = $request->input();
        unset($req['userData']);
        $dataJsonSend = json_encode($req);
        $methods = 'POST';

        $path = "/v3.1/transfer/internal";
        $url = $this->endPoint() . $path;
 

        $headers = $this->getHeaders($methods, $path, $dataJsonSend, false);
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods);
        return $this->respond($response);
    }
    public function cekRekeningKoranFund(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $req = $request->input();
        unset($req['userData']);
        $dataJsonSend = json_encode($req);
        $methods = 'POST';

        $path = "/v3.1/transfer/internal/check-rekening";
        $url = $this->endPoint() . $path;

        $headers = $this->getHeaders($methods, $path, $dataJsonSend, false);
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods);
        return $this->respond($response);
    }
    public function saveFundInternal(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        DB::beginTransaction();
        try{
            $new = new FundTransfer();
            $new->norec = $new->generateNewId();
            $new->kdprofile = $kdProfile;
            $new->statusenabled = true;
            $new->noreferral = $request['noReferral'];
            $new->sourceaccount = $request['sourceAccount'];
            $new->beneficiaryaccount =$request['beneficiaryAccount'];
            $new->amount = $request['amount'];
            $new->feetype = $request['feeType'];
            $new->transactiondate = $request['date'];
            $new->remark = $request['remark'];
            $new->bank = $request['bank'];
            $new->transaksifk = $request['norec'];
            $new->table = $request['table'];
            $new->save();

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
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'as' => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveLokalVABRI(Request $request){

        $kdProfile = (int)$this->getDataKdProfile($request);
   
        DB::beginTransaction();
        try{
                $trx =  $this->generateCodeBySeqTable(new VirtualAccount(), 'trx_id', 10, date('ymd'), $this->kdProfile);
         
                $noVA = $request['va']['brivaNo'].$request['va']['custCode'];
                $kontenSMS=   "Hai ".$request['va']['nama'].", Harap melakukan pembayaran dengan No Virtual Account BRI (BRIVA) : "
                        .$noVA." !. Batas waktu pembayaran ".$request['va']['expiredDate'].".No Transaksi kamu ".$request['nostruk'].".";
                $kontenSMS=  str_replace(' ', '%20', $kontenSMS);
                $newVA = New VirtualAccount();
                $newVA->trx_id =  $trx;
                $newVA->type =  "BRIVA";
                $newVA->client_id = $request['va']['institutionCode'];
                $newVA->trx_amount = $request['va']['amount'];
                $newVA->billing_type =  null;
                $newVA->customer_name =  $request['va']['nama'];
                $newVA->customer_email = $request['email'];
                $newVA->customer_phone =  $request['nohp'];
                $newVA->datetime_created =  date('Y-m-d H:i:s');
                $newVA->datetime_expired = $request['va']['expiredDate'];
                $newVA->description = $request['va']['keterangan'] ;
                $newVA->virtual_account =  $noVA;
                $newVA->bank =  'BRI';
                $newVA->norec_pd =  $request['norecPD'];
                $newVA->norec_sp =$request['norecSP'];
                $newVA->objectpegawaifk =  $this->getCurrentUserID();
                $newVA->kdprofile =  $kdProfile;
                $newVA->statusenabled =  true;
                $newVA->save();
            

               $transStatus = 'true';
            } catch (\Exception $e) {
                $transStatus = 'false';
            }


            if ($transStatus == 'true') {
                $transMessage = "Success";
                DB::commit();
                $this->sendSMS($request['nohp'],$kontenSMS);
                $result = array(
                    'status' => 201,
                    'message' => $transMessage,
                    'data' => $newVA,
                    'as' => 'er@epic',
                );
            } else {
                $transMessage = " Send SMS Gagal";
                DB::rollBack();
                $result = array(
                    'status' => 400,
                    'message'  => $transMessage,
                    'as' => 'er@epic',
                );
            }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    function sendSMS($nomor,$contena) {
            $auth = md5('ECGGENGGAM'.'EC3G348'.$nomor);
            // $mobile = '082211333013';
            $username = 'ECGGENGGAM';
         
            $url ="http://send.smsmasking.co.id:8080/web2sms/api/sendSMS.aspx?username=".$username."&mobile=".$nomor."&message=".$contena."&auth=".$auth;

           $curl = curl_init();

           curl_setopt_array($curl, array(
              CURLOPT_URL => $url,
              CURLOPT_RETURNTRANSFER => true,
              CURLOPT_ENCODING => "",
              CURLOPT_MAXREDIRS => 10,
              CURLOPT_TIMEOUT => 0,
              // CURLOPT_SSL_VERIFYHOST => 0,
              // CURLOPT_SSL_VERIFYPEER => 0,
              CURLOPT_FOLLOWLOCATION => true,
              CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
              CURLOPT_CUSTOMREQUEST => "GET",
            ));

            $response = curl_exec($curl);
            $err = curl_error($curl);
            curl_close($curl);
            return $response;

    }
    function getHeadersMutasi($httpMethod, $requestPath, $requestBody, $tanpaContenType = false)
    {

        if ($httpMethod == 'GET' || !$httpMethod) {
            $requestBody = '';
        } else {
            $requestBody = $requestBody;
        }
        $token = $this->getToken(true, false)->access_token;

        date_default_timezone_set('UTC');
        $date = Carbon::now();
        $timestamp = $date->format('Y-m-d\TH:i:s.u');

        $timestamp = substr($timestamp, 0, 23) . 'Z';

        $payload = 'path=' . $requestPath . '&verb=' . $httpMethod . '&token=Bearer ' . $token .
            '&timestamp=' . $timestamp . '&body=' . $requestBody;

        $client_secret =  $this->getClientSecret(false)['client_secret'];

        $sig = hash_hmac('sha256', $payload, $client_secret, true);

        $signature = base64_encode($sig);
   
        $header = array(
            'BRI-Timestamp:' . (string) $timestamp,
            'BRI-Signature:' . (string) $signature,
            'Authorization:Bearer ' . (string) $token,
            'BRI-External-Id:' . substr(Uuid::generate(), 0, 32),
            'Content-Type: application/json'
        );
        if ($tanpaContenType) {
            array_splice($header, 5, 1);
        }

        return $header;
    }
    public function getRiwayatTransaksi(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $req = $request->input();
        unset($req['userData']);
        $dataJsonSend = json_encode($req);
        $methods = 'POST';

        $path = "/v2.0/statement";
        $url = $this->endPoint() . $path;

        $headers = $this->getHeadersMutasi($methods, $path, $dataJsonSend, false);
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods);
        return $this->respond($response);
    }
    public function saveRekonTagihanSupp(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        DB::beginTransaction();
        try{
            foreach($request['data'] as $d){
                StrukBuktiPengeluaran::where('norec',$d['norec'])
                ->update([
                    'statusrekon' =>true
                ]);
            }
            
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Update Rekonsiliasi";
            DB::commit();
            $result = array(
                'status' => 201,
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
