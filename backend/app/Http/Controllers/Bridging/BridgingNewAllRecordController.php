<?php
/**
 * Created by PhpStorm.
 * User: egie ramdan
 * Date: 31/01/2018
 * Time: 10.05
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
use Illuminate\Http\Request;
use App\Traits\PelayananPasienTrait;
use App\User;
use DB;
use App\Traits\Valet;
use Carbon\Carbon;
use Webpatser\Uuid\Uuid;
use App\Master\Ruangan;
use App\Master\Alamat;
use App\Transaksi\AntrianPasienRegistrasi;

class BridgingNewAllRecordController extends ApiController
{

    use Valet, PelayananPasienTrait;

    public function __construct()
    {
        parent::__construct($skip_authentication = false);
    }

    public function listFaskes(Request $request, $limit, $page)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderNAR();
        $dataFormUrlencoded = null;
        $methods = 'GET';
        $url = $this->getUrlBrigdingNAR() . "api/v2/ref/faskes_list?itemsPerPage=" . $limit . "&page=" . $page;
        $response = $this->curlAPI($headers, $dataFormUrlencoded, $url, $methods);
        return $this->respond($response);
    }

    public function detailFaskes(Request $request, $idFaskes)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderNAR();
        $dataFormUrlencoded = null;
        $methods = 'GET';
        $url = $this->getUrlBrigdingNAR() . "api/v2/ref/faskes_get?faskes_id=" . $idFaskes;
        $response = $this->curlAPI($headers, $dataFormUrlencoded, $url, $methods);
        return $this->respond($response);
    }

    public function addFaskes(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderNAR();
        $dataFormUrlencoded = http_build_query($request['data']);
        $methods = 'POST';
        $url = $this->getUrlBrigdingNAR() . "api/v2/ref/faskes_add";
        $response = $this->curlAPI($headers, $dataFormUrlencoded, $url, $methods);
        return $this->respond($response);
    }

    public function updateFaskes(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderNAR();
        $dataFormUrlencoded = http_build_query($request['data']);;
        $methods = 'POST';
        $url = $this->getUrlBrigdingNAR() . "api/v2/ref/faskes_update";
        $response = $this->curlAPI($headers, $dataFormUrlencoded, $url, $methods);
        return $this->respond($response);
    }

    public function deleteFaskes(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderNAR();
        $dataFormUrlencoded = http_build_query($request['data']);
        $methods = 'POST';
        $url = $this->getUrlBrigdingNAR() . "api/v2/ref/faskes_del";
        $response = $this->curlAPI($headers, $dataFormUrlencoded, $url, $methods);
        return $this->respond($response);
    }

    public function listLab(Request $request, $limit, $page)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderNAR();
        $dataFormUrlencoded = null;
        $methods = 'GET';
        $url = $this->getUrlBrigdingNAR() . "api/v2/ref/lab_list?itemsPerPage=" . $limit . "&page=" . $page;
        $response = $this->curlAPI($headers, $dataFormUrlencoded, $url, $methods);
        return $this->respond($response);
    }

    public function detailLab(Request $request, $idLab)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderNAR();
        $dataFormUrlencoded = null;
        $methods = 'GET';
        $url = $this->getUrlBrigdingNAR() . "api/v2/ref/lab_get?lab_id=" . $idLab;
        $response = $this->curlAPI($headers, $dataFormUrlencoded, $url, $methods);
        return $this->respond($response);
    }

    public function addLab(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderNAR();
        $dataFormUrlencoded = http_build_query($request['data']);;
        $methods = 'POST';
        $url = $this->getUrlBrigdingNAR() . "api/v2/ref/lab_add";
        $response = $this->curlAPI($headers, $dataFormUrlencoded, $url, $methods);
        return $this->respond($response);
    }

    public function updateLab(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderNAR();
        $dataFormUrlencoded = http_build_query($request['data']);;
        $methods = 'POST';
        $url = $this->getUrlBrigdingNAR() . "api/v2/ref/lab_update";
        $response = $this->curlAPI($headers, $dataFormUrlencoded, $url, $methods);
        return $this->respond($response);
    }

    public function deleteLab(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderNAR();
        $dataFormUrlencoded = http_build_query($request['data']);;
        $methods = 'POST';
        $url = $this->getUrlBrigdingNAR() . "api/v2/ref/lab_del";
        $response = $this->curlAPI($headers, $dataFormUrlencoded, $url, $methods);
        return $this->respond($response);
    }

    public function getOrangbyNik(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderNAR();
        $dataFormUrlencoded = http_build_query($request['data']);;
        $methods = 'POST';
        $url = $this->getUrlBrigdingNAR() . "api/v2/orang/nik/get";
        $response = $this->curlAPI($headers, $dataFormUrlencoded, $url, $methods);
        return $this->respond($response);
    }

    public function getOrangbyPassport(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderNAR();
        $dataFormUrlencoded = http_build_query($request['data']);;
        $methods = 'POST';
        $url = $this->getUrlBrigdingNAR() . "api/v2/orang/passport/get";
        $response = $this->curlAPI($headers, $dataFormUrlencoded, $url, $methods);
        return $this->respond($response);
    }

    public function addOrangbyNik(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderNAR();
        $dataFormUrlencoded = http_build_query($request['data']);;
        $methods = 'POST';
        $url = $this->getUrlBrigdingNAR() . "api/v2/orang/nik/add";
        $response = $this->curlAPI($headers, $dataFormUrlencoded, $url, $methods);
        return $this->respond($response);
    }

    public function addOrangbyPassport(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderNAR();
        $dataFormUrlencoded = http_build_query($request['data']);;
        $methods = 'POST';
        $url = $this->getUrlBrigdingNAR() . "api/v2/orang/passport/add";
        $response = $this->curlAPI($headers, $dataFormUrlencoded, $url, $methods);
        return $this->respond($response);
    }

    public function updateOrangbyNik(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderNAR();
        $dataFormUrlencoded = http_build_query($request['data']);;
        $methods = 'POST';
        $url = $this->getUrlBrigdingNAR() . "api/v2/orang/nik/update";
        $response = $this->curlAPI($headers, $dataFormUrlencoded, $url, $methods);
        return $this->respond($response);
    }

    public function updateOrangbyPassport(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderNAR();
        $dataFormUrlencoded = http_build_query($request['data']);;
        $methods = 'POST';
        $url = $this->getUrlBrigdingNAR() . "api/v2/orang/passport/update";
        $response = $this->curlAPI($headers, $dataFormUrlencoded, $url, $methods);
        return $this->respond($response);
    }

    public function listTestLab(Request $request, $tglawal, $tglakhir, $limit, $page)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderNAR();
        $dataFormUrlencoded = null;
        $methods = 'GET';
        $url = $this->getUrlBrigdingNAR() . "api/v2/testcovid/list?tgl_pengambilan_after_or_equal=" . $tglawal . "&tgl_pengambilan_before=" . $tglakhir  . "&itemsPerPage=" . $limit . "&page=" . $page;
        $response = $this->curlAPI($headers, $dataFormUrlencoded, $url, $methods);
        return $this->respond($response);
    }

    public function detailTestLab(Request $request, $idtestCovid)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderNAR();
        $dataFormUrlencoded = null;
        $methods = 'GET';
        $url = $this->getUrlBrigdingNAR() . "api/v2/testcovid/get?testcovid_id=" . $idtestCovid;
        $response = $this->curlAPI($headers, $dataFormUrlencoded, $url, $methods);
        return $this->respond($response);
    }

    public function addTestLab(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderNAR();
        $dataFormUrlencoded = http_build_query($request['data']);;
        $methods = 'POST';
        $url = $this->getUrlBrigdingNAR() . "api/v2/testcovid/add";
        $response = $this->curlAPI($headers, $dataFormUrlencoded, $url, $methods);
        return $this->respond($response);
    }

    public function updateTestLab(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderNAR();
        $dataFormUrlencoded = http_build_query($request['data']);;
        $methods = 'POST';
        $url = $this->getUrlBrigdingNAR() . "api/v2/testcovid/update";
        $response = $this->curlAPI($headers, $dataFormUrlencoded, $url, $methods);
        return $this->respond($response);
    }

    public function deleteTestLab(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderNAR();
        $dataFormUrlencoded = http_build_query($request['data']);;
        $methods = 'POST';
        $url = $this->getUrlBrigdingNAR() . "api/v2/testcovid/del";
        $response = $this->curlAPI($headers, $dataFormUrlencoded, $url, $methods);
        return $this->respond($response);
    }

    public function listLokasi(Request $request, $limit, $page)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderNAR();
        $dataFormUrlencoded = null;
        $methods = 'GET';
        $url = $this->getUrlBrigdingNAR() . "api/v2/ref/lokasi_list?itemsPerPage=" . $limit . "&page=" . $page;
        $response = $this->curlAPI($headers, $dataFormUrlencoded, $url, $methods);
        return $this->respond($response);
    }

    public function listNegara(Request $request, $limit, $page)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderNAR();
        $dataFormUrlencoded = null;
        $methods = 'GET';
        $url = $this->getUrlBrigdingNAR() . "api/v2/ref/negara_list?itemsPerPage=" . $limit . "&page=" . $page;
        $response = $this->curlAPI($headers, $dataFormUrlencoded, $url, $methods);
        return $this->respond($response);
    }

    function getHeaderNAR()
    {
        $token = $this->tokenNAR();
        $header = array(
            "Api-Kemkes: " . (string)$token,
        );
     
        return $header;
    }

    protected function curlAPI($headers, $dataFormUrlencoded = null, $url, $method, $tipe = null)
    {
        $curl = curl_init();
        if ($dataFormUrlencoded == null) {
            curl_setopt_array($curl, array(
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 60,
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
                CURLOPT_TIMEOUT => 60,
                CURLOPT_SSL_VERIFYHOST => 0,
                CURLOPT_SSL_VERIFYPEER => 0,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => $method,
                CURLOPT_POSTFIELDS => $dataFormUrlencoded,
                CURLOPT_HTTPHEADER => $headers
            ));
        }

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);
        if ($err) {
            $result = "Terjadi Kesalahan #:" . $err;
        } else {
            if ($tipe != null) {
                $result = json_decode($response);
            } else {
                $result = json_decode($response);
            }
        }

        return $result;
    }

    protected function getKdProfile()
    {
        $session = \Session::get('userData');
        return User::where('id', $session['id'])->first()->kdprofile;
    }
}
