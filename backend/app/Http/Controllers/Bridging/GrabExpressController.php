<?php

namespace App\Http\Controllers\Bridging;

use App\Http\Controllers\ApiController;
use App\Traits\Valet;
use App\Transaksi\LoggingUser;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Web\LoginUser;
use App\Web\Token;

// use App\Web\Admin\ProfileHistoriAwards as ProfileHistoriAwards;
// use App\Web\Admin\Awards as Awards_M;
// use App\Web\Asal as Asal_M;
// use App\Transaksi\StrukHistori as StrukHistori_T;
use DB;
use Illuminate\Support\Facades\Hash;
use Namshi\JOSE\Base64\Base64UrlSafeEncoder;
use Namshi\JOSE\JWT;
use Namshi\JOSE\JWS;
use Namshi\JOSE\Base64\Encoder;
use Webpatser\Uuid\Uuid;

use Lcobucci\JWT\Signer\Hmac\Sha512;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Signer\Hmac\Sha384;
use Lcobucci\JWT\Builder;
use Lcobucci\JWT\ValidationData;
use Lcobucci\JWT\Parser;


class GrabExpressController extends ApiController
{
    use Valet;
    protected $baseUrl = 'https://partner-api.stg-myteksi.com';

    public function __construct()
    {
        parent::__construct($skip_authentication = false);
    }

    function getHeaderGrabAuth()
    {
        $header = [
            "Cache-Control: no-cache ",
            "Content-type: application/json",
        ];
        return $header;
    }

    function getGrabHead()
    {
        $res = $this->token();

        $header = [
            "Content-type: application/json",
            "Accept: application/json",
            'Authorization: Bearer ' . $res->access_token,
        ];
        return $header;
    }

    public function token()
    {
        $req = array(
            "client_id" => "83aa4ba9384a403f967d269b7f16716c",
            "client_secret" => "jj9WLCWAIFfTy_Lh",
            "grant_type" => "client_credentials",
            "scope" => "grab_express.partner_deliveries"
        );
        $dataJsonSend = json_encode($req);
        $url = $this->baseUrl . '/grabid/v1/oauth2/token';
        $response = $this->sendBridgingCurl($this->getHeaderGrabAuth(), $dataJsonSend, $url, 'POST');
        return $response;// $this->respond($response);
    }

    public function delivery(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $dataJsonSend = json_encode($request['req']);
        $url = $this->baseUrl . '/grab-express-sandbox/v1/deliveries';//'/grab-express/v1/deliveries';
        $response = $this->sendBridgingCurl($this->getGrabHead(), $dataJsonSend, $url, 'POST');
        return $this->respond($response);
    }
    public function tarifDelivery(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $dataJsonSend = json_encode($request['req']);
        $url = $this->baseUrl . '/grab-express-sandbox/v1/deliveries/quotes';
        $response = $this->sendBridgingCurl($this->getGrabHead(), $dataJsonSend, $url, 'POST');
        return $this->respond($response);
    }
    public function getInfoDelivery($deliveryID,Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $dataJsonSend = null;
        $url = $this->baseUrl . '/grab-express-sandbox/v1/deliveries/'.$deliveryID;
        $response = $this->sendBridgingCurl($this->getGrabHead(), $dataJsonSend, $url, 'GET');
        return $this->respond($response);
    }
    public function cancelDelivery($deliveryID,Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $dataJsonSend = null;
        $url = $this->baseUrl . '/grab-express-sandbox/v1/deliveries/'.$deliveryID;
        $response = $this->sendBridgingCurl($this->getGrabHead(), $dataJsonSend, $url, 'DELETE');

        return $this->respond($response);
    }

}