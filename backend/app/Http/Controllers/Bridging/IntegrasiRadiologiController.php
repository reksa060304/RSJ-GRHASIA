<?php

/**
 * Created by PhpStorm.
 * User: GIW
 * Date: 7/31/2019
 * Time: 4:33 PM
 */

namespace App\Http\Controllers\Bridging;

use App\Http\Controllers\ApiController;
use App\Master\Pegawai;
use App\Traits\CrudMaster;
use App\Traits\Valet;
use Illuminate\Http\Request;
use DB;
use Exception;
use Webpatser\Uuid\Uuid;


class IntegrasiRadiologiController extends ApiController
{
    use CrudMaster;
    use Valet;
    protected $kdProfile = 30;

    public function __construct()
    {
        parent::__construct($skip_authentication = true);
    }
    protected function curlAPI($dataJsonSend = null, $url, $method)
    {
        $curl = curl_init();

        $headers = [
            "Content-Type: application/json",
            "Authorization: zZcSZK0ffquk8UduH9epxz36SqwaaYbztAXzVRKnGi3j61nL",  // Tambahkan header Authorization
            "hospitalCode: 65422c28979c607cf1f42a2a"  // Tambahkan header hospitalCode
        ];

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
                CURLOPT_HTTPHEADER => $headers,
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
                CURLOPT_HTTPHEADER => $headers,
            ));
        }

        $response = curl_exec($curl);
        // return $url;
        $httpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        $err = curl_error($curl);

        curl_close($curl);
        if ($err) {
            $result = "Terjadi Kesalahan #:" . $err;
        } else {
            $result = json_decode($response);
        }
        return $result;
    }

    function endPoint()
    {
        return $this->settingDataFixed('BaseUrlRadiologi', $this->kdProfile);
    }

    public function RadsTools(Request $request, $lokal = null)
    {
        try {
            $dataJsonSend = null;
            if ($request['data'] != null) {
                $dataJsonSend = json_encode($request['data']);
            }
            // dd($dataJsonSend);
            $methods = $request['method'];
            $url = $this->endPoint() . $request['url'];
            $response = $this->curlAPI($dataJsonSend, $url, $methods);
        } catch (Exception $e) {
            $response = array(
                "issue" => $e->getMessage() . ' ' . $e->getLine(),
            );
            $response = json_decode(json_encode($response)); //Turn it into an object
        }

        if ($lokal) {
            return $response;
        }

        return response()->json($response);
    }

    public function RadsToolsCancelOrders(Request $request)
    {
        $kdProfile = $this->kdProfile;

        $url = 'order/cancel';
        $data = $request->json()->all(); // Ubah di sini

        // dd($data);

        $objetoRequest = new \Illuminate\Http\Request();
        $objetoRequest['url'] = $url;
        $objetoRequest['method'] = 'POST';
        $objetoRequest['data'] = $data;

        // dd($objetoRequest);
        $response =  $this->RadsTools($objetoRequest, true);
        // dd($response);
        return response()->json($response);
        // return $response;
    }

    // func bridging PACS THENA
    public function RadsToolsSendOrders(Request $request)
    {
        // Ambil Base URL dari tabel settingdatafixed_m
        $url = 'order/add'; // Endpoint dari API
        $data = $request->json()->all(); // Ambil data dari request JSON

        // Siapkan Request baru
        $objetoRequest = new \Illuminate\Http\Request();
        $objetoRequest['url'] = $url;
        $objetoRequest['method'] = 'POST';
        $objetoRequest['data'] = $data;

        // Kirim request ke API menggunakan fungsi RadsTools
        $response = $this->RadsTools($objetoRequest, true);

        // Return response dari API
        return response()->json($response);
    }
    public function RadsToolsGetStatus(Request $request)
    {
        // URL endpoint dengan parameter accessionNumber

        $accessionNumber = $request->input('accesNumber');

        // Buat URL lengkap dengan BASE URL
        $baseUrl = 'order/status';
        $url = $baseUrl . '?acc=' . $accessionNumber;

        // $urlUtama = 'order/status';
        // $url = $urlUtama . '?acc=' .$request['accesNumber'];


        // Siapkan request baru untuk dikirim ke API
        $objetoRequest = new \Illuminate\Http\Request();
        $objetoRequest['url'] = $url;
        $objetoRequest['method'] = 'GET';

        // Kirim request ke API menggunakan fungsi RadsTools
        $response = $this->RadsTools($objetoRequest, true);

        // Return response dari API dalam bentuk JSON
        return response()->json($response);
    }

    public function RadsToolsGetOrder(Request $request)
    {
        // URL endpoint dengan parameter accessionNumber

        $url = 'order/url/' . $request['accesNumber'];

        // Siapkan request baru untuk dikirim ke API
        $objetoRequest = new \Illuminate\Http\Request();
        $objetoRequest['url'] = $url;
        $objetoRequest['method'] = 'GET';

        // Kirim request ke API menggunakan fungsi RadsTools
        $response = $this->RadsTools($objetoRequest, true);

        // Return response dari API dalam bentuk JSON
        // return($url);
        return response()->json($response);
    }
    public function RadsToolsGetReport(Request $request)
    {

        $baseUrl = 'report/opinions';
        $url = $baseUrl . '?accessionNumber=' . $request['accesNumber'];

        // Siapkan request baru untuk dikirim ke API
        $objetoRequest = new \Illuminate\Http\Request();
        $objetoRequest['url'] = $url;
        $objetoRequest['method'] = 'GET';

        // Kirim request ke API menggunakan fungsi RadsTools
        $response = $this->RadsTools($objetoRequest, true);

        // Return response dari API dalam bentuk JSON
        // return($url);
        return response()->json($response);
    }

}
