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
use App\Transaksi\BpjsRencanaKontrol;

class BridgingBPJSV2Controller extends ApiController
{

    use Valet, PelayananPasienTrait;

    public function __construct()
    {
        parent::__construct($skip_authentication = false);
    }

    public function getSignature(Request $request)
    {
        $data = $request['consid'];
        $secretKey = $request['secretkey'];
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        // urlencode…
        // $encodedSignature = urlencode($encodedSignature);

        //        echo "X-cons-id: " .$data ." ";
        //        echo "X-timestamp:" .$tStamp ." ";
        //        echo "X-signature: " .$encodedSignature;

        $result = array(
            "X-cons-id" => $data,
            "X-timestamp" => $tStamp,
            "X-signature" => $encodedSignature,
        );


        return $this->respond($result);
    }

    public function getNoPeserta(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = null;
        $methods = 'GET';
        $url = $this->getUrlBrigdingBPJS() . "Peserta/nokartu/" . $request['nokartu'] . "/tglSEP/" . $request['tglsep'];
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }


    public function getNIK(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = null;
        $methods = 'GET';
        $url = $this->getUrlBrigdingBPJS() . "Peserta/nik/" . $request['nik'] . "/tglSEP/" . $request['tglsep'];
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function insertSEP(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = "{\r\n\"request\": 
                         {\r\n\"t_sep\": 
                            {
                            \r\n\"noKartu\": \"" . $request['nokartu'] . "\",
                            \r\n\"tglSep\": \"" . $request['tglsep'] . "\",
                            \r\n\"ppkPelayanan\": \"0904R004\",
                            \r\n\"jnsPelayanan\": \"" . $request['jenispelayanan'] . "\",
                            \r\n\"klsRawat\": \"" . $request['kelasrawat'] . "\",
                            \r\n\"noMR\": \"" . $request['nomr'] . "\",
                            \r\n\"rujukan\": {\r\n\"asalRujukan\": \"" . $request['asalrujukan'] . "\",
                                            \r\n\"tglRujukan\": \"" . $request['tglrujukan'] . "\",
                                            \r\n\"noRujukan\": \"" . $request['norujukan'] . "\",
                                            \r\n\"ppkRujukan\": \"" . $request['ppkrujukan'] . "\"\r\n},
                            \r\n\"catatan\": \"" . $request['catatan'] . "\",
                            \r\n\"diagAwal\": \"" . $request['diagnosaawal'] . "\",
                            \r\n\"poli\": {\r\n\"tujuan\": \"" . $request['politujuan'] . "\",
                                         \r\n\"eksekutif\": \"" . $request['eksekutif'] . "\"\r\n},
                            \r\n\"cob\": 
                                        {\r\n\"cob\": \"" . $request['cob'] . "\"\r\n},
                            \r\n\"jaminan\": {\r\n\"lakaLantas\": \"" . $request['lakalantas'] . "\",
                                                \r\n\"penjamin\": \"" . $request['penjamin'] . "\",
                                                \r\n\"lokasiLaka\": \"" . $request['lokasilaka'] . "\"\r\n},
                            \r\n\"noTelp\": \"" . $request['notelp'] . "\",
                            \r\n\"user\": \"Ramdanegie\"\r\n}\r\n}\r\n
                            
                      }";
        $methods = 'POST';
        $url = $this->getUrlBrigdingBPJS() . "SEP/insert";
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function cekSep(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = null;
        $methods = 'GET';
        $url = $this->getUrlBrigdingBPJS() . "SEP/" . $request['nosep'];
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function deleteSEP(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = "{\r\n\"request\": 
                                       {\r\n\"t_sep\": 
                                         {
                                            \r\n\"noSep\": \"" . $request['nosep'] . "\",
                                            \r\n\"user\": \"Ramdanegie\"\r\n}\r\n}\r\n
                                    }";
        $methods = 'DELETE';
        $url = $this->getUrlBrigdingBPJS() . "SEP/Delete";
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function updateSEP(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend =  "{\r\n\"request\": 
                        {\r\n\"t_sep\": 
                            {\r\n\"noSep\": \"" . $request['nosep'] . "\",
                            \r\n\"klsRawat\": \"" . $request['kelasrawat'] . "\",
                            \r\n\"noMR\": \"" . $request['nomr'] . "\",
                            \r\n\"rujukan\": {\r\n\"asalRujukan\": \"" . $request['asalrujukan'] . "\",
                            \r\n\"tglRujukan\": \"" . $request['tglrujukan'] . "\",
                            \r\n\"noRujukan\": \"" . $request['norujukan'] . "\",
                            \r\n\"ppkRujukan\": \"" . $request['ppkrujukan'] . "\"\r\n},
                            \r\n\"catatan\": \"" . $request['catatan'] . "\",
                            \r\n\"diagAwal\": \"" . $request['kddiagnosaawal'] . "\",
                            \r\n\"poli\": {\r\n\"eksekutif\": \"" . $request['eksekutif'] . "\"\r\n},
                            \r\n\"cob\": {\r\n\"cob\": \"" . $request['cob'] . "\"\r\n},
                            \r\n\"jaminan\": {\r\n\"lakaLantas\": \"" . $request['lakalantas'] . "\", 
                            \r\n\"penjamin\": \"" . $request['penjamin'] . "\",
                            \r\n\"lokasiLaka\": \"" . $request['lokasilaka'] . "\"\r\n},
                            \r\n\"noTelp\": \"" . $request['notelp'] . "\",
                            \r\n\"user\": \"ramdanegie\"\r\n
                          }\r\n}
                      \r\n}";
        $methods = 'PUT';
        $url = $this->getUrlBrigdingBPJS() . "SEP/Update";
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function getPoli(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = null;
        $methods = 'GET';
        $url = $this->getUrlBrigdingBPJS() . "referensi/poli/" . $request['kodeNamaPoli'];
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function getNoRujukanRs(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = null;
        $methods = 'GET';
        $url =  $this->getUrlBrigdingBPJS() . "Rujukan/RS/" . $request['norujukan'];
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function getNoRujukanPcare(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = null;
        $methods = 'GET';
        $url = $this->getUrlBrigdingBPJS() . "Rujukan/" . $request['norujukan'];
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function updateTglPulang(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = json_encode($request['data']);
        $methods = 'PUT';
        $url = $this->getUrlBrigdingBPJS() . "Sep/updtglplg";
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function getDiagnosa(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = null;
        $methods = 'GET';
        $url = $this->getUrlBrigdingBPJS() . "referensi/diagnosa/" . $request['kdNamaDiagnosa'];
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function getFaskes(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = null;
        $methods = 'GET';
        $url = $this->getUrlBrigdingBPJS() . "referensi/faskes/" . $request['kdNamaFaskes'] . "/" . $request['jenisFakses'];
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function getProcedureDiagnosaTindakan(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = null;
        $methods = 'GET';
        $url =  $this->getUrlBrigdingBPJS() . "referensi/procedure/" . $request['kdNamaDiagnosa'];
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function getKelasRawat(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = null;
        $methods = 'GET';
        $url = $this->getUrlBrigdingBPJS() . "referensi/kelasrawat";
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function getDokter(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = null;
        $methods = 'GET';
        $url =  $this->getUrlBrigdingBPJS() . "referensi/dokter/" . $request['namaDokter'];
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function getSpesialistik(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = null;
        $methods = 'GET';
        $url =  $this->getUrlBrigdingBPJS() . "referensi/spesialistik";
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function getRuangRawat(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = null;
        $methods = 'GET';
        $url =  $this->getUrlBrigdingBPJS() . "referensi/ruangrawat";
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function getCaraKeluar(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = null;
        $methods = 'GET';
        $url = $this->getUrlBrigdingBPJS() . "referensi/carakeluar";
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function getPascaPulang(Request $request)
    {

        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = null;
        $methods = 'GET';
        $url = $this->getUrlBrigdingBPJS() . "referensi/pascapulang";
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function postPengajuan(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = "{\r\n\"request\": 
                         {\r\n\"t_sep\": 
                            {
                            \r\n\"noKartu\": \"" . $request['nokartu'] . "\",
                            \r\n\"tglSep\": \"" . $request['tglsep'] . "\",
                            \r\n\"jnsPelayanan\": \"" . $request['jenispelayanan'] . "\",
                            \r\n\"jnsPengajuan\": \"" . $request['jenispengajuan'] . "\",
                            \r\n\"keterangan\": \"" . $request['keterangan'] . "\",
                            \r\n\"user\": \"Ramdanegie\"\r\n}\r\n}\r\n
                            
                      }";
        $methods = 'POST';
        $url = $this->getUrlBrigdingBPJS() . "Sep/pengajuanSEP";
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function postApprovalPengajuanSep(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = "{\r\n\"request\": 
                         {\r\n\"t_sep\": 
                            {
                            \r\n\"noKartu\": \"" . $request['nokartu'] . "\",
                            \r\n\"tglSep\": \"" . $request['tglsep'] . "\",
                            \r\n\"jnsPelayanan\": \"" . $request['jenispelayanan'] . "\",
                            \r\n\"keterangan\": \"" . $request['keterangan'] . "\",
                            \r\n\"user\": \"Ramdanegie\"\r\n}\r\n}\r\n
                            
                      }";
        $methods = 'POST';
        $url = $this->getUrlBrigdingBPJS() . "Sep/aprovalSEP";
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function getIntegrasiSepInaCbg(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = null;
        $methods = 'GET';
        $url = $this->getUrlBrigdingBPJS() . "sep/cbg/" . $request['noSEP'];
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function getNoRujukanRsNoKartu(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = null;
        $methods = 'GET';
        $url = $this->getUrlBrigdingBPJS() . "Rujukan/RS/Peserta/" . $request['nokartu'];
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function getNoRujukanPcareNoKartu(Request $request)
    {

        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = null;
        $methods = 'GET';
        $url =  $this->getUrlBrigdingBPJS() . "Rujukan/Peserta/" . $request['nokartu'];
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function insertRujukan(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend =   "{\r\n\"request\":
                        {\r\n\"t_rujukan\":
                           {
                           \r\n\"noSep\": \"" . $request['nosep'] . "\",
                           \r\n\"tglRujukan\": \"" . $request['tglrujukan'] . "\",
                           \r\n\"ppkDirujuk\": \"" . $request['ppkdirujuk'] . "\",
                           \r\n\"jnsPelayanan\": \"" . $request['jenispelayanan'] . "\",
                           \r\n\"catatan\": \"" . $request['catatan'] . "\",
                            \r\n\"diagRujukan\": \"" . $request['diagnosarujukan'] . "\",
                           \r\n\"tipeRujukan\": \"" . $request['tiperujukan'] . "\",
                           \r\n\"poliRujukan\": \"" . $request['polirujukan'] . "\",
                           \r\n\"user\": \"Ramdanegie\"\r\n}\r\n}\r\n

                     }";
        $methods = 'POST';
        $url = $this->getUrlBrigdingBPJS() . "Rujukan/insert";
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function updateRujukan(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend =  "{\r\n\"request\": 
                         {\r\n\"t_rujukan\": 
                            {
                            \r\n\"noRujukan\": \"" . $request['norujukan'] . "\",
                            \r\n\"tipe\": \"" . $request['tipe'] . "\",
                            \r\n\"ppkDirujuk\": \"" . $request['ppkdirujuk'] . "\",
                            \r\n\"jnsPelayanan\": \"" . $request['jenispelayanan'] . "\",
                            \r\n\"catatan\": \"" . $request['catatan'] . "\",
                             \r\n\"diagRujukan\": \"" . $request['diagnosarujukan'] . "\",
                            \r\n\"tipeRujukan\": \"" . $request['tiperujukan'] . "\",
                            \r\n\"poliRujukan\": \"" . $request['polirujukan'] . "\",
                            \r\n\"user\": \"Ramdanegie\"\r\n}\r\n}\r\n
                            
                      }";
        $methods = 'PUT';
        $url = $this->getUrlBrigdingBPJS() . "Rujukan/update";
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function deleteRujukan(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = "{\r\n\"request\": 
                                       {\r\n\"t_rujukan\": 
                                         {
                                            \r\n\"noRujukan\": \"" . $request['norujukan'] . "\",
                                            \r\n\"user\": \"Ramdanegie\"\r\n}\r\n}\r\n
                                    }";
        $methods = 'DELETE';
        $url = $this->getUrlBrigdingBPJS() . "Rujukan/Delete";
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function insertLPK(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = json_encode($request['data']);
        $methods = 'POST';
        $url =  $this->getUrlBrigdingBPJS() . "LPK/insert";
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function updateLPK(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = json_encode($request['data']);
        $methods = 'PUT';
        $url =  $this->getUrlBrigdingBPJS() . "LPK/update";
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function deleteLPK(Request $request)
    {

        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend =  "{\r\n\"request\": 
                                       {\r\n\"t_lpk\": 
                                         {
                                            \r\n\"noSep\": \"" . $request['nosep'] . "\"\r\n}\r\n
                                            }\r\n
                                    }";
        $methods = 'DELETE';
        $url =  $this->getUrlBrigdingBPJS() . "LPK/Delete";
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function dataLPK(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = null;
        $methods = 'GET';
        $url =  $this->getUrlBrigdingBPJS() . "LPK/TglMasuk/" . $request['tglmasuk'] . "/JnsPelayanan/" . $request['jenispelayanan'];
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function getMonitoringKunjungan(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = null;
        $methods = 'GET';
        $url = $this->getUrlBrigdingBPJS() . "Monitoring/Kunjungan/Tanggal/" . $request['tglsep'] . "/JnsPelayanan/" . $request['jenispelayanan'];
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function getMonitoringKlaim(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = null;
        $methods = 'GET';
        //var_dump($this->getUrlBrigdingBPJS());
        $url = $this->getUrlBrigdingBPJS() . "Monitoring/Klaim/Tanggal/"
            . $request['tglsep'] . "/JnsPelayanan/" . $request['jenispelayanan'] . "/Status/" . $request['status'];
        //var_dump($url);
            $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function getMonitoringKlaimApotikOnline(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderApotikOnline();
        $dataJsonSend = null;
        $methods = 'GET';
        //var_dump($this->getUrlBrigdingApotikOnline());
        $url = $this->getUrlBrigdingApotikOnline() ."monitoring/klaim/"
            . $request['bulan'] . "/" . $request['tahun'] . "/" . $request['jenisobat']. "/" . $request['status'];
        //var_dump($url);
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function getDiagnosaTindakanSaeutik(Request $request)
    {
        $req = $request->all();
        $datRek = \DB::table('diagnosatindakan_m as dg')
            ->select('dg.id', 'dg.kddiagnosatindakan', 'dg.namadiagnosatindakan')
            ->where('dg.statusenabled', true)
            ->orderBy('dg.kddiagnosatindakan');

        if (
            isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined"
        ) {
            $datRek = $datRek
                ->where('dg.kddiagnosatindakan', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%');
            //                ->orWhere('dg.kddiagnosatindakan','ilike',$req['filter']['filters'][0]['value'].'%' )  ;
        }


        $datRek = $datRek->take(10);
        $datRek = $datRek->get();

        return $this->respond($datRek);
    }

    public function getDiagnosaSaeutik(Request $request)
    {
        $req = $request->all();
        $datRek = \DB::table('diagnosa_m as dg')
            ->select('dg.id', 'dg.kddiagnosa', 'dg.namadiagnosa')
            ->where('dg.statusenabled', true)
            ->orderBy('dg.kddiagnosa');
        if (
            isset($req['kdDiagnosa']) &&
            $req['kdDiagnosa'] != "" &&
            $req['kdDiagnosa'] != "undefined"
        ) {
            $datRek = $datRek->where('dg.kddiagnosa', 'ilike', '%' . $req['kdDiagnosa'] . '%');
        }
        if (
            isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined"
        ) {
            $datRek = $datRek
                ->where('dg.kddiagnosa', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%');
            //                ->orWhere('dg.kddiagnosatindakan','ilike',$req['filter']['filters'][0]['value'].'%' )  ;
        }


        $datRek = $datRek->take(10);
        $datRek = $datRek->get();

        return $this->respond($datRek);
    }

    public function getRuanganRI(Request $request)
    {
        $data = \DB::table('ruangan_m as ru')
            ->select('ru.id', 'ru.kdinternal', 'ru.namaruangan', 'ru.objectdepartemenfk')
            ->where('ru.statusenabled', true)
            ->wherein('ru.objectdepartemenfk', [26, 16, 35])
            ->orderBy('ru.namaruangan')
            ->get();
        $result = array(
            'data' => $data,
            'message' => 'niaramdanegie',
        );

        return $this->respond($result);
    }

    public function getRuanganRJ(Request $request)
    {
        $data = \DB::table('ruangan_m as ru')
            ->select('ru.id', 'ru.kdinternal', 'ru.namaruangan', 'ru.objectdepartemenfk')
            ->where('ru.statusenabled', true)
            ->wherein('ru.objectdepartemenfk', [24, 18, 28])
            ->orderBy('ru.namaruangan')
            ->get();
        $result = array(
            'data' => $data,
            'message' => 'niaramdanegie',
        );

        return $this->respond($result);
    }

    public function getSepByNoregistrasi(Request $request)
    {
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftJOIN('pemakaianasuransi_t as pas', 'pas.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('asuransipasien_m as aps', 'aps.id', '=', 'pas.objectasuransipasienfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->join('kelas_m as kls', 'kls.id', '=', 'aps.objectkelasdijaminfk')
            ->leftjoin('diagnosa_m as dg', 'dg.id', '=', 'pas.objectdiagnosafk')
            ->leftjoin('jenispelayanan_m as jp', 'jp.kodeinternal', '=', 'pd.jenispelayanan')
            ->select(
                'pd.noregistrasi',
                'ps.nocm',
                'pas.nokepesertaan',
                'pd.objectruanganlastfk',
                'ru.namaruangan',
                'ru.kdinternal',
                'aps.objectkelasdijaminfk',
                'kls.namakelas',
                'pas.tglrujukan',
                'pas.norujukan',
                'aps.kdprovider',
                'aps.nmprovider',
                'pas.catatan',
                'pas.diagnosisfk',
                'dg.kddiagnosa',
                'pd.jenispelayanan as objectjenispelayananfk',
                'jp.jenispelayanan',
                'pas.lakalantas',
                'ps.notelepon',
                'pas.nosep',
                DB::raw('case when ru.objectdepartemenfk in (26,16,35) then \'true\' 
               when ru.objectdepartemenfk in (24,18,28) then \'false\' end as israwatinap')
            )
            ->where('pd.objectruanganasalfk', null)
            ->where('pd.noregistrasi', $request['noRegistrasi'])
            ->get();
        $result = array(
            'data' => $data,
            'message' => 'ramdanegie',
        );

        return $this->respond($result);
    }


    public function getDiagnosaReferen(Request $request)
    {
        $data = \DB::table('diagnosa_m as ru')
            ->select('ru.id', 'ru.kddiagnosa', 'ru.namadiagnosa')
            ->where('ru.statusenabled', true)
            ->where('ru.namadiagnosa', 'ilike', '%' . $request['nama'] . '%')
            ->orderBy('ru.namadiagnosa')
            ->get();
        $result = array(
            'data' => $data,
            'message' => 'ramdanegie',
        );

        return $this->respond($result);
    }

    public function getFaskesSaeutik(Request $request)
    {
        $req = $request->all();
        $dataReq = $req['filter']['filters'][0]['value'];
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        if (!isset($req['jenisFaskes'])) {
            $req['jenisFaskes'] = 2;
        }
        $dataJsonSend = null;
        $methods = 'GET';
        $url = $this->getUrlBrigdingBPJS() . "referensi/faskes/" . $dataReq . "/" . $req['jenisFaskes'];
        // dd($url);
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        $res = [];
        if ($response->response != null) {
            $res = $response->response->faskes;
        }
        return $this->respond($res);
    }

    public function getDiagnosaPart(Request $request)
    {
        $req = $request->all();
        $dataReq = $req['filter']['filters'][0]['value'];
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = null;
        $methods = 'GET';
        $url = $this->getUrlBrigdingBPJS() . "referensi/diagnosa/" . $dataReq;
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        $res = [];
        if ($response->response != null) {
            $res = $response->response->diagnosa;
        }
        return $this->respond($res);
    }

    public function getProcedureDiagnosaTindakanPart(Request $request)
    {
        $req = $request->all();
        $dataReq = $req['filter']['filters'][0]['value'];
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = null;
        $methods = 'GET';
        $url = $this->getUrlBrigdingBPJS() . "referensi/procedure/" . $dataReq;
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());

        $res = [];
        if ($response->response != null) {
            $res = $response->response->procedure;
        }
        return $this->respond($res);
    }

    public function getDokterSaeutik(Request $request)
    {
        $req = $request->all();
        $dataReq = $req['filter']['filters'][0]['value'];
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = null;
        $methods = 'GET';
        $url = $this->getUrlBrigdingBPJS() . "referensi/dokter/" . $dataReq;
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        // dd($response);
        $res = [];
        if ($response->response != null) {
            $res = $response->response->list;
        }
        return $this->respond($res);
    }

    public function getPoliSaeutik(Request $request)
    {
        $req = $request->all();
        $dataReq = $req['filter']['filters'][0]['value'];
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = null;
        $methods = 'GET';
        $url = $this->getUrlBrigdingBPJS() . "referensi/poli/" . $dataReq;
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());

        $res = [];
        if ($response->response != null) {
            $res = $response->response->poli;
        }
        return $this->respond($res);
    }

    public function simpanBpjsKlaim(Request $request)
    {
        //        ini_set('max_execution_time', 100);
        DB::beginTransaction();
        try {
            $data2 = BPJSKlaimTxt::where('txtfilename', $request['filename'])->delete();
            foreach ($request['data'] as $item) {
                $data1 = new BPJSKlaimTxt();
                $data1->norec = $data1->generateNewId();
                $data1->kdprofile = 0;
                $data1->statusenabled = true;


                $data1->KODE_RS = $item['KODE_RS'];
                $data1->KELAS_RS = $item['KELAS_RS'];
                $data1->KELAS_RAWAT = $item['KELAS_RAWAT'];
                $data1->KODE_TARIF = $item['KODE_TARIF'];
                $data1->PTD = $item['PTD'];
                $data1->ADMISSION_DATE = $item['ADMISSION_DATE'];
                $data1->DISCHARGE_DATE = $item['DISCHARGE_DATE'];
                $data1->BIRTH_DATE = $item['BIRTH_DATE'];
                $data1->BIRTH_WEIGHT = $item['BIRTH_WEIGHT'];
                $data1->SEX = $item['SEX'];
                $data1->DISCHARGE_STATUS = $item['DISCHARGE_STATUS'];
                $data1->DIAGLIST = $item['DIAGLIST'];
                $data1->PROCLIST = $item['PROCLIST'];
                $data1->ADL1 = $item['ADL1'];
                $data1->ADL2 = $item['ADL2'];
                $data1->IN_SP = $item['IN_SP'];
                $data1->IN_SR = $item['IN_SR'];
                $data1->IN_SI = $item['IN_SI'];
                $data1->IN_SD = $item['IN_SD'];
                $data1->INACBG = $item['INACBG'];
                $data1->SUBACUTE = $item['SUBACUTE'];
                $data1->CHRONIC = $item['CHRONIC'];
                $data1->SP = $item['SP'];
                $data1->SR = $item['SR'];
                $data1->SI = $item['SI'];
                $data1->SD = $item['SD'];
                $data1->DESKRIPSI_INACBG = $item['DESKRIPSI_INACBG'];
                $data1->TARIF_INACBG = $item['TARIF_INACBG'];
                $data1->TARIF_SUBACUTE = $item['TARIF_SUBACUTE'];
                $data1->TARIF_CHRONIC = $item['TARIF_CHRONIC'];
                $data1->DESKRIPSI_SP = $item['DESKRIPSI_SP'];
                $data1->TARIF_SP = $item['TARIF_SP'];
                $data1->DESKRIPSI_SR = $item['DESKRIPSI_SR'];
                $data1->TARIF_SR = $item['TARIF_SR'];
                $data1->DESKRIPSI_SI = $item['DESKRIPSI_SI'];
                $data1->TARIF_SI = $item['TARIF_SI'];
                $data1->DESKRIPSI_SD = $item['DESKRIPSI_SD'];
                $data1->TARIF_SD = $item['TARIF_SD'];
                $data1->TOTAL_TARIF = $item['TOTAL_TARIF'];
                $data1->TARIF_RS = $item['TARIF_RS'];
                $data1->TARIF_POLI_EKS = $item['TARIF_POLI_EKS'];
                $data1->LOS = $item['LOS'];
                $data1->ICU_INDIKATOR = $item['ICU_INDIKATOR'];
                $data1->ICU_LOS = $item['ICU_LOS'];
                $data1->VENT_HOUR = $item['VENT_HOUR'];
                $data1->NAMA_PASIEN = $item['NAMA_PASIEN'];
                $data1->MRN = $item['MRN'];
                $data1->UMUR_TAHUN = $item['UMUR_TAHUN'];
                $data1->UMUR_HARI = $item['UMUR_HARI'];
                $data1->DPJP = $item['DPJP'];
                $data1->sep = $item['SEP'];
                $data1->NOKARTU = $item['NOKARTU'];
                $data1->PAYOR_ID = $item['PAYOR_ID'];
                $data1->CODER_ID = $item['CODER_ID'];
                $data1->VERSI_INACBG = $item['VERSI_INACBG'];
                $data1->VERSI_GROUPER = $item['VERSI_GROUPER'];
                $data1->C1 = $item['C1'];
                $data1->C2 = $item['C2'];
                $data1->C3 = $item['C3'];
                $data1->C4 = $item['C4'];
                $data1->txtfilename = $request['filename'];
                $data1->save();
            }
            //            $strFileName = $request['filename'];
            //            $dataClaim = DB::select(DB::raw("select pd.norec,pd.noregistrasi,pd.tglregistrasi,bpjs.\"TARIF_RS\" as tarif from bpjsklaimtxt_t as bpjs
            //                    INNER JOIN pemakaianasuransi_t as pa on pa.nosep=bpjs.sep
            //                    INNER JOIN pasiendaftar_t as pd on pd.norec=pa.noregistrasifk
            //                    where txtfilename='$strFileName';")
            //            );
            //            foreach ($dataClaim as $item){
            //                $dataSP = StrukPelayanan::where('noregistrasifk',$item->norec)
            //                    ->where('statusenabled',null)
            //                    ->update(array('totalselisihklaim' => $item->tarif));
            //            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        $transMessage = "Simpan BPJS Klaim";
        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage . ' Berhasil',
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage . ' Gagal',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getChecklistKlaim(Request $request)
    {
        //        $aingMacan = DB::select(DB::raw("select tgl,
        //                sum(case when objectdepartemenfk <> 16 then  BPJS else 0 end) as bpjs_rajal,
        //                sum(case when objectdepartemenfk <> 16 then  dokumen else 0 end) as berkas_rajal,
        //                sum(case when objectdepartemenfk=16 and objectkelasdijaminfk=3 then  dokumen else 0 end) as berkas_kls1,
        //                sum(case when objectdepartemenfk=16 and objectkelasdijaminfk=2 then  dokumen else 0 end) as berkas_kls2,
        //                sum(case when objectdepartemenfk=16 and objectkelasdijaminfk=1 then  dokumen else 0 end) as berkas_kls3,
        //                sum(case when objectdepartemenfk=16 and objectkelasdijaminfk=3 then  BPJS else 0 end) as bpjs_kls1,
        //                sum(case when objectdepartemenfk=16 and objectkelasdijaminfk=2 then  BPJS else 0 end) as bpjs_kls2,
        //                sum(case when objectdepartemenfk=16 and objectkelasdijaminfk=1 then  BPJS else 0 end) as bpjs_kls3
        //                 from
        //                (select to_char(pa.tglregistrasi, 'YYYY-MM-DD') as tgl, ru.objectdepartemenfk,pd.objectkelasfk,kls.namakelas,ap.objectkelasdijaminfk,
        //                case when bpjs.norec is null then 0 else 1 end as BPJS,case when pa.norec is null then 0 else 1 end as dokumen
        //                from pemakaianasuransi_t as pa
        //                INNER JOIN asuransipasien_m as ap on ap.id=pa.objectasuransipasienfk
        //                inner JOIN bpjsklaimtxt_t as bpjs  on pa.nosep=bpjs.sep
        //                INNER JOIN pasiendaftar_t as pd on pd.norec=pa.noregistrasifk
        //                INNER JOIN strukpelayanan_t as sp on sp.noregistrasifk=pd.norec and sp.statusenabled is null
        //                INNER JOIN strukpelayananpenjamin_t as spp on spp.nostrukfk=sp.norec and spp.noverifikasi is not null
        //                INNER JOIN ruangan_m as ru on ru.id=pd.objectruanganlastfk
        //                INNER JOIN kelas_m as kls on kls.id=ap.objectkelasdijaminfk
        //                where pd.tglpulang between :tglAwal and :tglAkhir
        //                and pd.objectkelompokpasienlastfk=2) as x group by tgl order by tgl;
        //            "),
        //            array(
        //                'tglAwal' => $request['tglAwal'] ,
        //                'tglAkhir' => $request['tglAkhir']
        //            )
        //        );
        $aingMacan = DB::select(
            DB::raw("select tgl,
                sum(case when objectdepartemenfk <> 16 then  BPJS else 0 end) as bpjs_rajal,
                sum(case when objectdepartemenfk <> 16 then  dokumen else 0 end) as berkas_rajal,
                sum(case when objectdepartemenfk=16 and objectkelasdijaminfk=3 then  dokumen else 0 end) as berkas_kls1,
                sum(case when objectdepartemenfk=16 and objectkelasdijaminfk=2 then  dokumen else 0 end) as berkas_kls2,
                sum(case when objectdepartemenfk=16 and objectkelasdijaminfk=1 then  dokumen else 0 end) as berkas_kls3,
                sum(case when objectdepartemenfk=16 and objectkelasdijaminfk=3 then  BPJS else 0 end) as bpjs_kls1,
                sum(case when objectdepartemenfk=16 and objectkelasdijaminfk=2 then  BPJS else 0 end) as bpjs_kls2,
                sum(case when objectdepartemenfk=16 and objectkelasdijaminfk=1 then  BPJS else 0 end) as bpjs_kls3
                 from
                (select to_char(pd.tglpulang, 'YYYY-MM-DD') as tgl, ru.objectdepartemenfk,pd.objectkelasfk,kls.namakelas,ap.objectkelasdijaminfk,
                case when bpjs.norec is null then 0 else 1 end as BPJS,case when pa.norec is null then 0 else 1 end as dokumen
                from pemakaianasuransi_t as pa
                INNER JOIN asuransipasien_m as ap on ap.id=pa.objectasuransipasienfk
                inner JOIN bpjsklaimtxt_t as bpjs  on pa.nosep=bpjs.sep
                INNER JOIN pasiendaftar_t as pd on pd.norec=pa.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=pd.objectruanganlastfk
                INNER JOIN kelas_m as kls on kls.id=ap.objectkelasdijaminfk
                where pd.tglpulang between :tglAwal and :tglAkhir
                and pd.objectkelompokpasienlastfk=2) as x group by tgl order by tgl;
            "),
            array(
                'tglAwal' => $request['tglAwal'],
                'tglAkhir' => $request['tglAkhir']
            )
        );
        $result = array(
            'dat' => $aingMacan,
            'by' => 'as@epic'
        );
        return $this->respond($result);
    }

    public function simpanGagalHitungBpjsKlaim(Request $request)
    {
        //        ini_set('max_execution_time', 100);
        DB::beginTransaction();
        try {
            $data2 = BPJSGagalKlaimTxt::where('txtfilename', $request['filename'])->delete();
            foreach ($request['data'] as $item) {
                $data1 = new BPJSGagalKlaimTxt();
                $data1->norec = $data1->generateNewId();
                $data1->kdprofile = 0;
                $data1->statusenabled = true;

                $data1->nosep = $item['NOSEP'];
                $data1->tglsep = $item['TGLSEP'];
                $data1->nokartu = $item['NOKARTU'];
                $data1->nmpeserta = $item['NMPESERTA'];
                $data1->rirj = $item['RIRJ'];
                $data1->kdinacbg = $item['KDINACBG'];
                $data1->bypengajuan = $item['BYPENGAJUAN'];
                $data1->keterangan = $item['KETERANGAN'];
                $data1->txtfilename = $request['filename'];
                $data1->save();
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        $transMessage = "Simpan BPJS Gagal Klaim";
        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage . ' Berhasil',
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage . ' Gagal',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDokterDPJP(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = null;
        $methods = 'GET';
        $url = $this->getUrlBrigdingBPJS() . "referensi/dokter/pelayanan/" . $request['jenisPelayanan'] . "/tglPelayanan/"
            . $request['tglPelayanan'] . "/Spesialis/" . $request['kodeSpesialis'];
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function getPropinsi(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = null;
        $methods = 'GET';
        $url = $this->getUrlBrigdingBPJS() . "referensi/propinsi";
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        $res = [];
        if ($response->response != null) {
            $res = $response->response->list;
        }

        return $this->respond($res);
    }

    public function getKabupaten(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = null;
        $methods = 'GET';
        $url = $this->getUrlBrigdingBPJS() . "referensi/kabupaten/propinsi/" . $request['kodePropinsi'];
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        $res = [];
        if ($response->response != null) {
            $res = $response->response->list;
        }
        return $this->respond($res);
    }

    public function getKecamatan(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = null;
        $methods = 'GET';
        $url = $this->getUrlBrigdingBPJS() . "referensi/kecamatan/kabupaten/" . $request['kodeKabupaten'];
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        $res = [];
        if ($response->response != null) {
            $res = $response->response->list;
        }
        return $this->respond($res);
    }

    public function getMonitoringHistori($noKartu)
    {
        $tglMulai = Carbon::now()->subMonth(1)->format('Y-m-d');
        //        return $this->respond($tglMulai);
        $tglAkhir = Carbon::now()->format('Y-m-d');

        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = null;
        $methods = 'GET';
        $url = $this->getUrlBrigdingBPJS() . "monitoring/HistoriPelayanan/NoKartu/" . $noKartu . "/tglAwal/" . $tglMulai . "/tglAkhir/" . $tglAkhir;
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());

        return $this->respond($response);
    }

    public function getMonitoringJasaRaharja(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = null;
        $methods = 'GET';
        $url =  $this->getUrlBrigdingBPJS() . "monitoring/JasaRaharja/tglMulai/"
            . $request['tglMulai'] . "/tglAkhir/" . $request['tglAkhir'];
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());

        return $this->respond($response);
    }

    public function getRujukanNoKartuMulti(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = null;
        $methods = 'GET';
        $url =  $this->getUrlBrigdingBPJS() . "Rujukan/List/Peserta/" . $request['nokartu'];
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function getRujukanNoKartuMultiRS(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = null;
        $methods = 'GET';
        $url =  $this->getUrlBrigdingBPJS() . "Rujukan/RS/List/Peserta/" . $request['nokartu'];
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function getRujukanByTglRujukan(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = null;
        $methods = 'GET';
        $url =   $this->getUrlBrigdingBPJS() . "Rujukan/List/TglRujukan/" . $request['tglRujukan'];
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function getRujukanByTglRujukanRS(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = null;
        $methods = 'GET';
        $url =  $this->getUrlBrigdingBPJS() . "Rujukan/RS/List/TglRujukan/" . $request['tglRujukan'];
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function getSuplesiJasaRaharja(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = null;
        $methods = 'GET';
        $url =   $this->getUrlBrigdingBPJS() . "sep/JasaRaharja/Suplesi/"
            . $request['noKartu'] . "/tglPelayanan/" . $request['tglPelayanan'];
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function insertSepV11(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = json_encode($request['data']);
        $methods = 'POST';
        $url =   $this->getUrlBrigdingBPJS() . "SEP/1.1/insert";
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function updateSepV11(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = json_encode($request['data']);
        $methods = 'PUT';
        $url =   $this->getUrlBrigdingBPJS() . "SEP/1.1/Update";

        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, '');
        return $this->respond($response);
    }

    public function getHasCode(Request $request)
    {

        $data = $this->getIdConsumerBPJS();
        $secretKey = $this->getPasswordConsumerBPJS();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha1', 'JASAMEDIKA', true);
        $sting = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbi5vcGVyYXRvciJ9.2yCoQiRKSoXJhCzSdbLxvLWPPx02jzPgkUpT2f0uDLeKKPIK00xLbLlUeTlS7eNq6cLOE7XM03sOWgmQ5TLvVA';
        // base64 encode…
        $encodedSignature = base64_decode($sting);
        // $encodedSignature = urlencode($encodedSignature);

        $result = array(
            "X-cons-id" => $data,
            "X-timestamp" => $tStamp,
            "X-signature" => $encodedSignature,
        );

        return $this->respond($encodedSignature);
    }

    public function deleteSiranap(Request $request)
    {
        # seting koneksi webservices #
        $xrsid = "kode_rumah_sakit";  # ID Rumah Sakit #
        $xpass = md5("password_rumah_sakit"); # Password #
        $kode_tipe_pasien = "0004"; #kode tipe pasien
        $kode_kelas_ruang = "0003"; # kode kelas ruang

        $strURLSiranap = "http://sirs.yankes.kemkes.go.id/sirsservice/sisrute/hapusdata/$xrsid/$kode_tipe_pasien/$kode_kelas_ruang";

        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $strURLSiranap);
        curl_setopt(
            $curl,
            CURLOPT_HTTPHEADER,
            array(
                "X-rs-id: $xrsid",
                "X-pass:$xpass",
                "Content-Type:application/xml; charset=ISO-8859-1",
                "User-Agent: Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.15) Gecko/20080623 Firefox/2.0.0.15"
            )
        );
        curl_setopt($curl, CURLOPT_NOBODY, false);
        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        $str = curl_exec($curl);
        curl_close($curl);
        //        echo $str;
        return $this->respond($str);
        //        $data = $this->getIdConsumerBPJS();
        //        $secretKey = $this->getPasswordConsumerBPJS();
        //        // Computes the timestamp
        //        date_default_timezone_set('UTC');
        //        $tStamp = strval(time()-strtotime('1970-01-01 00:00:00'));
        //        // Computes the signature by hashing the salt with the secret key as the key
        //        $signature = hash_hmac('sha256', $data."&".$tStamp, $secretKey, true);
        //
        //        // base64 encode…
        //        $encodedSignature = base64_encode($signature);
        //
        //        $curl = curl_init();
        //
        //        curl_setopt_array($curl, array(
        ////            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
        ////            CURLOPT_URL=> $this->getUrlBrigdingBPJS()."sep/RS/JasaRaharja/Suplesi/".$request['noKartu']."/tglPelayanan/".$request['tglPelayanan'],
        //            CURLOPT_URL => $this->getUrlBrigdingBPJS()."sep/RS/JasaRaharja/Suplesi/"
        //                .$request['noKartu']."/tglPelayanan/".$request['tglPelayanan'],
        //            CURLOPT_RETURNTRANSFER => true,
        //            CURLOPT_ENCODING => "",
        //            CURLOPT_SSL_VERIFYHOST => 0,
        //            CURLOPT_SSL_VERIFYPEER => 0,
        //            CURLOPT_MAXREDIRS => 10,
        //            CURLOPT_TIMEOUT => 30,
        //            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        //            CURLOPT_CUSTOMREQUEST => "GET",
        //            CURLOPT_HTTPHEADER => array(
        //                "Content-Type: application/json; charset=utf-8",
        //                "X-cons-id: ".  (string)$data,
        //                "X-signature: ". (string)$encodedSignature,
        //                "X-timestamp: ". (string)$tStamp
        //            ),
        //        ));
        //
        //        $response = curl_exec($curl);
        //        $err = curl_error($curl);
        //
        //        curl_close($curl);
        //
        //        if ($err) {
        //            $result= "cURL Error #:" . $err;
        //        } else {
        //            $result = (array) json_decode($response);
        //        }
        //
        //        return $this->respond($result);
    }

    public function getNoPesertaV1(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = null;
        $methods = 'GET';
        $url =  $this->getUrlBrigdingBPJS() . "Peserta/nokartu/" . $request['nokartu'] . "/tglSEP/" . $request['tglsep'];
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function simpanLokalRujukan(Request $request)
    {
        //        ini_set('max_execution_time', 100);
        $kdProfile = $this->getDataKdProfile($request);
        DB::beginTransaction();
        try {
            if ($request['tipe'] == 'delete') {
                $transMessage = "Sukses ";
                BPJSRujukan::where('norujukan', $request['norujukan'])->delete();
            } else {
                $transMessage = "Simpan Rujukan";
                if ($request['tipe'] == 'save') {
                    $data1 = new BPJSRujukan();
                    $data1->norec = $data1->generateNewId();
                    $data1->kdprofile = $kdProfile;
                    $data1->statusenabled = true;
                } else {
                    $data1 =  BPJSRujukan::where('norujukan', $request['norujukan'])->first();
                }
                $data1->nosep = $request['nosep'];
                $data1->diagnosarujukan = $request['diagnosarujukan'];
                $data1->jenispelayanan = $request['jenispelayanan'];
                $data1->polirujukan = $request['polirujukan'];
                $data1->ppkdirujuk = $request['ppkdirujuk'];
                $data1->kdppkdirujuk = $request['kdppkdirujuk'];
                $data1->tglrujukan = $request['tglrujukan'];
                $data1->tiperujukan = $request['tiperujukan'];
                if (isset($request['nama'])) {
                    $data1->nama = $request['nama'];
                }
                if (isset($request['nokartu'])) {
                    $data1->nokartu = $request['nokartu'];
                }
                if (isset($request['tglsep'])) {
                    $data1->tglsep = $request['tglsep'];
                }
                if (isset($request['sex'])) {
                    $data1->sex = $request['sex'];
                }
                if (isset($request['nocm'])) {
                    $data1->nocm = $request['nocm'];
                }
                if (isset($request['tglBerlakuKunjungan'])) {
                    $data1->tglberlaku = $request['tglBerlakuKunjungan'];
                }
                $data1->catatan = $request['catatan'];
                $data1->norujukan = $request['norujukan'];
                $data1->tglrencanakunjungan = $request['tglRencanaKunjungan'];
                $data1->save();
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }


        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage . ' Berhasil',
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage . ' Gagal',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getLokalRujukan(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $data = \DB::table('bpjsrujukan_t as br')
            ->leftJoin('pasien_m as ps', 'ps.nocm', '=', 'br.nocm')
            ->select('br.*', 'br.polirujukan as namaruangan', 'ps.tgllahir')
            ->where('br.statusenabled', true)
            ->where('br.kdprofile', $kdProfile);

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('br.tglrujukan', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];
            $data = $data->where('br.tglrujukan', '<=', $tgl);
        }
        if (isset($request['norujukan']) && $request['norujukan'] != "" && $request['norujukan'] != "undefined") {
            $data = $data->where('br.norujukan', 'ilike', '%' . $request['norujukan'] . '%');
        }
        if (isset($request['nocm']) && $request['nocm'] != "" && $request['nocm'] != "undefined") {
            $data = $data->where('br.nocm', 'ilike', '%' . $request['nocm'] . '%');
        }

        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'Inhuman'
        );
        return $this->respond($result);
    }

    public function generateNoSKDP(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $noSKDP = $this->generateCodeBySeqTable(new PemakaianAsuransi, 'nosuratskdp', 6, '', $kdProfile);
        if ($noSKDP == '') {
            $transMessage = "Gagal mengumpukan data, Coba lagi.!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "as" => 'as@epic',
            );
            return $this->setStatusCode($result['status'])->respond($result, $transMessage);
        }

        $data = $this->genRandStr();
        //        $noSKDP = $this->generateCode(new PemakaianAsuransi, 'nosuratskdp', 6, $this->getDateTime()->format('ym'));
        $result = array(
            'noskdp' => $noSKDP,
            'message' => 'Inhuman'
        );
        return $this->respond($result);
    }

    function genRandStr()
    {
        $a = $b = '';

        for ($i = 0; $i < 3; $i++) {
            $a .= chr(mt_rand(65, 90)); // see the ascii table why 65 to 90.
            $b .= mt_rand(0, 9);
        }

        return $a . $b;
    }

    public function getReferensiKamar(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJS('Aplicaresws');
        $dataJsonSend = null;
        $methods = 'GET';
        $url = $this->getLinkAplicare() . "aplicaresws/rest/ref/kelas";
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, 'Aplicaresws');
        return $this->respond($response);
    }

    public function updateKetersediaanTT($kodeppk, Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJS('Aplicaresws');
        $dataJsonSend = json_encode($request['json']);
        $methods = 'POST';
        $url = $this->getLinkAplicare() . "aplicaresws/rest/bed/update/" . $kodeppk;
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, 'Aplicaresws');
        return $this->respond($response);
    }

    public function postRuanganBaru($kodeppk, Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJS('Aplicaresws');
        $dataJsonSend = json_encode($request['json']);
        $methods = 'POST';
        $url = $this->getLinkAplicare() . "aplicaresws/rest/bed/create/" . $kodeppk;
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, 'Aplicaresws');
        return $this->respond($response);
    }


    public function getKetersedianKamarRS($kodeppk, $start, $limit)
    {
        //        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJS('Aplicaresws');
        $dataJsonSend = null;
        $methods = 'GET';
        $url = $this->getLinkAplicare() . "aplicaresws/rest/bed/read/" . $kodeppk . "/" . $start . "/" . $limit;
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, 'Aplicaresws');
        return $this->respond($response);
    }

    public function hapusRuangan($kodeppk, Request $request)
    {
        //        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJS('Aplicaresws');
        $dataJsonSend = json_encode($request['json']);
        $methods = 'POST';
        $url = $this->getLinkAplicare() . "aplicaresws/rest/bed/delete/" . $kodeppk;
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, 'Aplicaresws');
        return $this->respond($response);
    }

    public function getInformasiDukcapilFromNIK(Request $request)
    {

        $nik = $request['nik'];
        $user_id = $request['user_id'];
        $password = $request['password'];
        $ip_user = $request['ip_user'];

        $dataJsonSend = json_encode($request['data']);
        // return $dataJsonSend;
        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_PORT => $request['port'],
            CURLOPT_URL => $request['url'],
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
            $status['status'] = 400;
            $result = array(
                'error' => $err
            );
        } else {
            $status['status'] = 200;
            $result = (array)json_decode($response);
        }
        return $this->respond($result, $status);
    }

    public function getRuanganBPJSInternal(Request $request)
    {

        $data = \DB::table('ruangan_m')
            ->select('*')
            ->where('statusenabled', true)
            ->whereNotNull('kdinternal')
            ->orderBy('namaruangan');

        $data = $data->get();

        return $this->respond($data);
    }

    public function getNoSEPByNorecPd(Request $request)
    {
        $norec_pd = $request['norec_pd'];
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int)$kdProfile;
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pemakaianasuransi_t as pem', 'pem.noregistrasifk', '=', 'pd.norec')
            ->select('pd.noregistrasi', 'pem.nosep')
            ->where('pd.kdprofile', $idProfile)
            ->where('pd.norec', $norec_pd);
        $data = $data->first();
        return $this->respond($data);
    }

    public function getNoSEPByNorecPd2(Request $request)
    {
        $norec_pd = $request['norec_pd'];
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int)$kdProfile;
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pemakaianasuransi_t as pem', 'pem.noregistrasifk', '=', 'pd.norec')
            ->select('pd.noregistrasi', 'pem.nosep')
            ->where('pd.kdprofile', $idProfile)
            ->where('pd.norec', $norec_pd);
        $data = $data->first();
        return $this->respond($data);
    }

    public function getHistoryPelayananPeserta(Request $request)
    {
        //        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $tglMulai = Carbon::now()->startOfMonth()->format('Y-m-d');
        $tglAkhir = Carbon::now()->format('Y-m-d');
        $noKartu = $request['noKartu'];
        $dataJsonSend = null;
        $methods = 'GET';
        $url = $this->getUrlBrigdingBPJS() . "monitoring/HistoriPelayanan/NoKartu/" . $noKartu . "/tglAwal/" . $tglMulai . "/tglAkhir/" . $tglAkhir;
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function getComboBPJS(Request $request)
    {


        $upf = \DB::table('ruangan_m as st')
            ->select('st.id', 'st.namaruangan')
            ->where('st.statusenabled', true)
            ->whereIn('st.objectdepartemenfk', [18, 28, 24, 3, 27, 26, 34, 30, 45, 16, 35, 17])
            ->orderBy('st.namaruangan')
            ->get();

        $result = array(
            'upf' => $upf,
            'message' => 'er@epic',
        );

        return $this->respond($result);
    }

    public function generateSEPDummy(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $kdppk = $request['kodeppk'];
        $sep = $this->generateCodeBySeqTable(new PemakaianAsuransi, 'nosep', 19, $kdppk . '0420V', $kdProfile);
        if ($sep == '') {
            $transMessage = "Gagal mengumpukan data, Coba lagi.!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "as" => 'as@epic',
            );
            return $this->setStatusCode($result['status'])->respond($result, $transMessage);
        }


        return $this->respond($sep);
    }

    public function getKetersediaanTTNew(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $paramRuangan = '';
        if (isset($request['namaruangan']) && $request['namaruangan'] != 'undefined' && $request['namaruangan'] != '') {
            $paramRuangan = " and ru.namaruangan ilike '%" . $request['namaruangan'] . "%'";
        }
        $paramKelas = '';
        if (isset($request['kelas']) && $request['kelas'] != 'undefined' && $request['kelas'] != '') {
            $paramKelas = " and kl.namakelas ilike '%" . $request['kelas'] . "%'";
        }
        // $data = DB::select(DB::raw("SELECT
        //     x.kodekelas,
        //         x.koderuang,
        //         x.namaruang,
        //         COUNT (x.id) AS kapasitas,
        // -- SUM (tersediapriawanita) + SUM (tersediawanita)+   SUM (tersediapria)
        //         0 AS tersedia,
        //         SUM (tersediapria) AS tersediapria,
        //         SUM (tersediawanita) AS tersediawanita,
        //         SUM (tersediapriawanita) AS tersediapriawanita,

        //         x.namakelas
        //     FROM
        //         (
        //             SELECT
        //                 ru.id AS koderuang,

        //                 kmr.id,
        //                 kmr.namakamar,
        //                 kl.namaexternal AS kodekelas,
        //                 kl.namakelas,
        //                 ru.id AS id_ruangan,
        //                 ru.namaruangan AS namaruang,
        //               ru.jenis,
        //                 CASE
        //             WHEN ru.jenis = 'male' THEN
        //                 1
        //             ELSE
        //                 0
        //             END AS tersediapria,
        //             CASE
        //         WHEN ru.jenis = 'female' THEN
        //             1
        //         ELSE
        //             0
        //         END AS tersediawanita,
        //              CASE
        //         WHEN ru.jenis = 'mix' THEN
        //             1
        //         ELSE
        //             0
        //         END AS tersediapriawanita
        //         FROM
        //             tempattidur_m AS tt
        //         LEFT JOIN statusbed_m AS sb ON sb.id = tt.objectstatusbedfk
        //         LEFT JOIN kamar_m AS kmr ON kmr.id = tt.objectkamarfk
        //         LEFT JOIN ruangan_m AS ru ON ru.id = kmr.objectruanganfk
        //         LEFT JOIN kelas_m AS kl ON kl.id = kmr.objectkelasfk
        //         WHERE
        //             tt.statusenabled = true
        //               and kmr.statusenabled=true
        //       and  ru.objectdepartemenfk IN (16, 35)
        //       and ru.kdprofile=$kdProfile


        //         $paramRuangan
        //           $paramKelas
        //         ) AS x
        //     GROUP BY
        //         x.kodekelas,
        //         x.koderuang,
        //         x.namaruang,
        //         x.namakelas
        //     ORDER BY
        //         x.kodekelas"));
        // // return $this->respond(  $data );

        // // foreach ($data as $key => $values) {
        // // $dat = 0;
        // // if($values->tersediawanita == '0' && $values->tersediapria == '0' ){
        // //     $dat =(float) $values->kapasitas /2;
        // //     // return    $dat;
        // //     if($this->is_decimal($dat)){
        // //         $values->tersediawanita =$values->kapasitas ;
        // //     }else{
        // //         $values->tersediapria = $dat;
        // //         $values->tersediawanita = $dat;
        // //     }
        // // }

        // // if(( $values->tersediawanita != '0' && $values->tersediapria != '0'  )&&(
        // //     (float) $values->tersediawanita +(float) $values->tersediapria  != (float) $values->kapasitas) ){
        // //     $tot  = 0;
        // //     $tot2  = 0;
        // //     $totakhir =0;
        // //     $tot = (float) $values->tersediawanita +(float) $values->tersediapria  ;
        // //     $tot2 = (float) $values->kapasitas - $tot ;

        // //     $totakhir = $tot2 /2;

        // //     if($this->is_decimal($totakhir)){
        // //         $values->tersediapria =(float)$values->tersediapria +$tot2  ;
        // //     }else{
        // // $values->tersedia = (float)$values->tersediapria+ $totakhir ;
        // //         $values->tersediawanita = (float)$values->tersediawanita+$totakhir ;
        // //     }
        // // }
        // # code...
        // // }
        // // return $data;


        // $pasien = DB::select(DB::raw("SELECT
        //         pd.noregistrasi,
        //             pd.tglregistrasi,
        //             pd.tglpulang,
        //             kl.namaexternal AS kodekelas,
        //             ru.id AS koderuang,
        //            DATE_PART('day',  CASE
        //             WHEN pd.tglpulang IS NULL THEN
        //             now()
        //             ELSE
        //             pd.tglpulang
        //             END -pd.tglregistrasi )as hari,case when ps.objectjeniskelaminfk =1 then 'male' else 'female' end as jenis
        //         FROM
        //             pasiendaftar_t AS pd
        //         INNER JOIN ruangan_m AS ru ON ru.ID = pd.objectruanganlastfk
        //         INNER JOIN kelas_m AS kl ON kl.ID = pd.objectkelasfk
        //         INNER JOIN pasien_m AS ps ON ps.id= pd.nocmfk
        //         WHERE
        //             ru.objectdepartemenfk IN (16, 35)
        //         AND pd.tglpulang IS NULL
        //         and pd.statusenabled=true
        //          and pd.kdprofile=$kdProfile
        //          $paramRuangan
        //             $paramKelas
        //         ORDER BY
        //             pd.tglregistrasi ASC
        //         "));
        // $total_tt = 0;
        // foreach ($data as $key => $ruang) {
        //     $total_tt = (float)$ruang->kapasitas + $total_tt;
        //     foreach ($pasien as $key => $psn) {
        //         # code...
        //         // if( $ruang->tersediapria ==0){
        //         // $psn->tersedia      ='female';
        //         // }
        //         if ($psn->jenis == 'male' && $ruang->tersediapria != 0) {
        //             if ($ruang->koderuang == $psn->koderuang && $ruang->kodekelas == $psn->kodekelas
        //             ) {
        //                 $ruang->tersediapria = (float)$ruang->tersediapria - 1;

        //             }
        //         }
        //         if ($psn->jenis == 'male' && $ruang->tersediapria == 0) {
        //             if ($ruang->koderuang == $psn->koderuang && $ruang->kodekelas == $psn->kodekelas
        //             ) {
        //                 $ruang->tersediapriawanita = (float)$ruang->tersediapriawanita - 1;

        //             }
        //         }
        //         if ($psn->jenis == 'female' && $ruang->tersediawanita != 0) {
        //             if ($ruang->koderuang == $psn->koderuang && $ruang->kodekelas == $psn->kodekelas
        //             ) {
        //                 $ruang->tersediawanita = (float)$ruang->tersediawanita - 1;

        //             }
        //         }
        //         if ($psn->jenis == 'female' && $ruang->tersediawanita == 0) {
        //             if ($ruang->koderuang == $psn->koderuang && $ruang->kodekelas == $psn->kodekelas
        //             ) {
        //                 $ruang->tersediapriawanita = (float)$ruang->tersediapriawanita - 1;

        //             }
        //         }

        //     }
        //     # code...
        // }
        // // return $datas = array('da' => $data, 'psn' => $pasien );
        // // $terpakai = 0;
        // // $kosong = 0;
        // // foreach ( $data as $key => $value) {
        // //    if( (float)$value->kosongMale!=0){
        // //         $value->kosongMale =(float) $value->kosongMale -(float) $value->terpakaiMale;
        // //    }
        // //    if( (float)$value->tersediawanita!=0){
        // //         $value->kosongFemale =(float) $value->kosongFemale -(float) $value->terpakaiFemale;
        // //    }


        // //    // if(((float) $value->total_tt !=))
        // //    # code...
        // // }
        // $i = 0;
        // foreach ($data as $key) {
        //     $key->tersedia = ($key->tersediapriawanita + $key->tersediawanita + $key->tersediapria);
        //     if ($data[$i]->tersedia < 0) {
        //         $data[$i]->tersedia = 0;
        //     }
        //     if ($data[$i]->tersediapriawanita < 0) {
        //         $data[$i]->tersediapriawanita = 0;
        //     }
        //     if ($data[$i]->tersediawanita < 0) {
        //         $data[$i]->tersediawanita = 0;
        //     }
        //     if ($data[$i]->tersediapria < 0) {
        //         $data[$i]->tersediapria = 0;
        //     }
        //     $i++;
        // }
        $data = DB::select(DB::raw("

            select x.kodekelas,
            x.namakelas,x.koderuang,x.namaruang,sum(x.tersedia) as tersedia,sum(x.tersediapria) as tersediapria,
            sum(x.tersediawanita) as tersediawanita,sum(x.tersediapriawanita) as tersediapriawanita,
            sum(x.kapasitas) as kapasitas

            from (SELECT
                    CASE WHEN kmr.kodeexternal IS NOT NULL THEN kmr.kodeexternal ELSE kl.namaexternal END AS kodekelas,
                    ru.ID AS koderuang,
                    CASE WHEN   kmr.kodeexternal IS NOT NULL THEN  kmr.kodeexternal ELSE kl.namakelas END AS namakelas,
                    ru.namaruangan AS namaruang,
                    0 AS tersediapria,
                    0 AS tersediawanita,
                    0 AS tersediapriawanita,
                    COUNT ( tt.ID ) AS kapasitas,
                    SUM ( CASE WHEN sb.ID = 2 THEN 1 ELSE 0 END ) AS tersedia 
                        FROM tempattidur_m AS tt
                        INNER JOIN statusbed_m AS sb ON sb. ID = tt.objectstatusbedfk
                        INNER JOIN kamar_m AS kmr ON kmr. ID = tt.objectkamarfk
                        INNER JOIN kelas_m AS kl ON kl. ID = kmr.objectkelasfk
                        INNER JOIN ruangan_m AS ru ON ru. ID = kmr.objectruanganfk
                        WHERE tt.statusenabled = TRUE
                        AND kmr.statusenabled = TRUE
                        $paramRuangan
                        $paramKelas
                        GROUP BY 
                        kl.namakelas,ru.id,kl.namaexternal,
                        ru.namaruangan, kmr.kodeexternal

            ) as x group by  x.kodekelas,
            x.namakelas,x.koderuang,x.namaruang
            

           
            "));

        return $this->respond($data);
    }

    public function saveMonitoringKlaim(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        DB::table('monitoringklaim_t')
            ->where('jenispelayanan', $request['jenispelayanan'])
            ->where('statusklaimfk', $request['statusklaimfk'])
            ->whereRaw("to_char(tglpulang,'yyyy-MM') ='$request[bulan]'")
            ->delete();

        $dataInsert = [];
        $newData2 = $request['details'];
        foreach ($newData2 as $item) {
            $dataInsert[] = array(
                'norec' => substr(Uuid::generate(), 0, 32),
                'kdprofile' => $kdProfile,
                'statusenabled' => true,
                'nofpk' => $item['nofpk'],
                'tglpulang' => $item['tglpulang'],
                'jenispelayanan' => $request['jenispelayanan'],
                'nosep' => $item['nosep'],
                'tglsep' => $item['tglsep'],
                'status' => $item['status'],
                'totalpengajuan' => $item['totalpengajuan'],
                'totalsetujui' => $item['totalsetujui'],
                'totaltarifrs' => $item['totaltarifrs'],
                'statusklaimfk' => $request['statusklaimfk'],
                'totalgrouper' => $item['totalgrouper'],
            );


            if (count($dataInsert) > 100) {
                DB::table('monitoringklaim_t')->insert($dataInsert);
                $dataInsert = [];
            }
        }

        DB::table('monitoringklaim_t')->insert($dataInsert);

        $result = array(
            'data3' => $dataInsert,
            'message' => 'er@epic',
            'messages' => 'Sukses',
        );

        return $this->respond($result);
    }


    public function getMonitoringKlaimStts(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $data = DB::table('monitoringklaim_t')
            ->where('jenispelayanan', $request['jenispelayanan'])
            ->where('statusklaimfk', $request['statusklaimfk'])
            ->whereRaw("to_char(tglpulang,'yyyy-MM') ='$request[bulan]'")
            ->first();

        $result = array(
            'data' => $data,
            'as' => 'er@epic',
        );

        return $this->respond($result);
    }

    public function getRekapMonitoringKlaim(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $data = DB::select(DB::raw("
          
                select  '20' || substring(nofpk,7,2) || '-' || substring(nofpk,5,2) as blnthn,blnsep as Bulan_Tagihan,sum(jml_ri) as jml_ri,sum(jml_rj) as jml_rj,sum(tarifrs_ri) as tarifrs_ri,sum(tarifrs_rj) as tarifrs_rj,
                sum(tarifina_ri) as tarifina_ri,sum(tarifina_rj) as tarifina_rj,sum(jmlklaim_ri) as jmlklaim_ri,sum(jmlklaim_rj) as jmlklaim_rj,
                sum(klaim_ri) as klaim_ri,sum(klaim_rj) as klaim_rj,sum(jmlpending_ri) as jmlpending_ri,sum(jmlpending_rj) as jmlpending_rj,sum(pending_ri) as pending_ri,sum(pending_rj) as pending_rj
                from 
                (select case when nofpk = '-' then concat('1111', to_char(tglsep, 'MMYY')) else nofpk end as nofpk, to_char(tglsep, 'YYYY-MM') as blnsep,
                case when jenispelayanan='1' then count(nosep) else 0 end as jml_ri,
                case when jenispelayanan='2' then count(nosep) else 0 end as jml_rj,
                case when jenispelayanan='1' then sum(totaltarifrs) else 0 end as tarifrs_ri,
                case when jenispelayanan='2' then sum(totaltarifrs) else 0 end as tarifrs_rj,
                case when jenispelayanan='1' then sum(totalgrouper) else 0 end as tarifina_ri,
                case when jenispelayanan='2' then sum(totalgrouper) else 0 end as tarifina_rj,
                case when jenispelayanan='1' and status='Klaim' then count(nosep) else 0 end as jmlklaim_ri,
                case when jenispelayanan='2' and status='Klaim' then count(nosep) else 0 end as jmlklaim_rj,
                case when jenispelayanan='1' and status='Klaim' then sum(totalsetujui) else 0 end as klaim_ri,
                case when jenispelayanan='2' and status='Klaim' then sum(totalsetujui) else 0 end as klaim_rj,
                case when jenispelayanan='1' and status='Proses Pending' then count(nosep) else 0 end as jmlpending_ri,
                case when jenispelayanan='2' and status='Proses Pending' then count(nosep) else 0 end as jmlpending_rj,
                case when jenispelayanan='1' and status='Proses Pending' then sum(totalpengajuan) else 0 end as pending_ri,
                case when jenispelayanan='2' and status='Proses Pending' then sum(totalpengajuan) else 0 end as pending_rj
                from monitoringklaim_t 
                where tglsep BETWEEN '$request[tglawal]' and '$request[tglakhir]'
                group by case when nofpk = '-' then concat('1111', to_char(tglsep, 'MMYY')) else nofpk end,status,to_char(tglsep, 'YYYY-MM'),jenispelayanan
                order by to_char(tglsep, 'YYYY-MM')) as x
                group by  '20' || substring(nofpk,7,2) || '-' || substring(nofpk,5,2),blnsep
                order by '20' || substring(nofpk,7,2) || '-' || substring(nofpk,5,2),blnsep
               
          "));

        $result = array(
            'data' => $data,
            'as' => 'as@epic',
        );

        return $this->respond($result);
    }

    public function getDaftarMappingDokterBpjsToDokterRs(Request $request)
    {
        $kdProfile = (int)$this->getDataKdProfile($request);
        $data = \DB::table('pegawai_m as pg')
            ->selectRaw("
                    pg.id,pg.kddokterbpjs,pg.namalengkap
                ")
            ->where('pg.kdprofile', $kdProfile)
            ->where('pg.statusenabled', true)
            ->where('pg.objectjenispegawaifk', 1)
            ->wherenotNull('pg.kddokterbpjs');

        if (isset($request['idPegawai']) && $request['idPegawai'] != "" && $request['idPegawai'] != "undefined") {
            $data = $data->where('pg.id', '=', $request['idPegawai']);
        }

        if (isset($request['kodeDokterBpjs']) && $request['kodeDokterBpjs'] != "" && $request['kodeDokterBpjs'] != "undefined") {
            $data = $data->where('pg.kddokterbpjs', '=', $request['kodeDokterBpjs']);
        } else {
            if (isset($request['dokterbpjsArr']) && $request['dokterbpjsArr'] != "" && $request['dokterbpjsArr'] != "undefined") {
                $arrRuang = explode(',', $request['dokterbpjsArr']);
                $kodeRuang = [];
                foreach ($arrRuang as $item) {
                    $kodeRuang[] = (int)$item;
                }
                $data = $data->whereIn('pg.kddokterbpjs', $kodeRuang);
            }
        }
        $data = $data->orderBy('pg.namalengkap', 'asc');
        $data = $data->get();
        return $this->respond($data);
    }

    public function saveMappingDokterBpjsDokterRs(Request $request)
    {
        $kdProfile = (int)$this->getDataKdProfile($request);
        $tglAyeuna = date('Y-m-d H:i:s');
        $dataLogin = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id', $dataLogin['userData']['id'])
            ->where('lu.kdprofile', $kdProfile)
            ->first();
        DB::beginTransaction();
        try {
            $data = Pegawai::where('id', $request['idpegawai'])
                ->where('kdprofile', $kdProfile)
                ->update([
                    'kodeexternal' => $request['kodedokterbpjs'],
                    'kddokterbpjs' => $request['kodedokterbpjs']
                ]);

            //## Logging User
            $newId = LoggingUser::max('id');
            $newId = $newId + 1;
            $logUser = new LoggingUser();
            $logUser->id = $newId;
            $logUser->norec = $logUser->generateNewId();
            $logUser->kdprofile = $kdProfile;
            $logUser->statusenabled = true;
            $logUser->jenislog = 'Mapping Dokter Bpjs To Dokter Rs ' . $request['namalengkap'];
            $logUser->noreff = $request['idpegawai'];
            $logUser->referensi = 'id pegawai_m';
            $logUser->objectloginuserfk = $dataLogin['userData']['id'];
            $logUser->tanggal = $tglAyeuna;
            $logUser->keterangan = 'Mapping Dokter Bpjs To Dokter Rs ' . $request['namalengkap'];
            $logUser->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Gagal";
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "data" => $data,
                "as" => 'ea@epic',
            );
        } else {
            $transMessage = "Simpan Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "as" => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveHapusMappingDokterBpjsDokterRs(Request $request)
    {
        $kdProfile = (int)$this->getDataKdProfile($request);
        $tglAyeuna = date('Y-m-d H:i:s');
        $dataLogin = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id', $dataLogin['userData']['id'])
            ->where('lu.kdprofile', $kdProfile)
            ->first();
        DB::beginTransaction();
        try {
            $data = Pegawai::where('id', $request['id'])
                ->where('kdprofile', $kdProfile)
                ->update([
                    'kodeexternal' => null,
                    'kddokterbpjs' => null
                ]);

            //## Logging User
            $newId = LoggingUser::max('id');
            $newId = $newId + 1;
            $logUser = new LoggingUser();
            $logUser->id = $newId;
            $logUser->norec = $logUser->generateNewId();
            $logUser->kdprofile = $kdProfile;
            $logUser->statusenabled = true;
            $logUser->jenislog = 'Hapus Mapping Dokter Bpjs To Dokter Rs ' . $request['namalengkap'];
            $logUser->noreff = $request['id'];
            $logUser->referensi = 'id pegawai_m';
            $logUser->objectloginuserfk = $dataLogin['userData']['id'];
            $logUser->tanggal = $tglAyeuna;
            $logUser->keterangan = 'Hapus Mapping Dokter Bpjs To Dokter Rs ' . $request['namalengkap'];
            $logUser->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Hapus Gagal";
        }

        if ($transStatus == 'true') {
            $transMessage = "Hapus Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "data" => $data,
                "as" => 'ea@epic',
            );
        } else {
            $transMessage = "Hapus Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "as" => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }


    function getHeaderBPJS($type = null)
    {

        $data = $this->getIdConsumerBPJS();
        $secretKey = $this->getPasswordConsumerBPJS();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        if ($type == 'antreanV2') {
            $header = array(
                "Content-Type: Application/json",
                "x-cons-id: " . (string)$data,
                "x-signature: " . (string)$encodedSignature,
                "x-timestamp: " . (string)$tStamp,
                "user_key: " . $this->getUserKeyAntreanBPJSv2()
            );
        } else if ($type == 'Aplicaresws') {
            $header = array(
                "Content-Type: Application/json",
                "X-cons-id: " . (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            );
        } else if ($type == 'sign') {
            $header = array(
                // "Content-Type: Application/json",
                "X-cons-id" => (string)$data,
                "X-signature" =>  (string)$encodedSignature,
                "X-timestamp" => (string)$tStamp,
                "user_key" => $this->getUserKeyAntreanBPJSv2()
            );
        } else {
            $header = array(
                "Content-Type: Application/x-www-form-urlencoded",
                "X-cons-id: " . (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key: " . $this->userKeyBPJS()
            );
        }

        return $header;
    }

    public function insertRencanaKontrol(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = json_encode($request->input());
        $methods = 'POST';
        $url = $this->getUrlBrigdingBPJS() . "RencanaKontrol/insert";
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function updateRencanaKontrol(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = json_encode($request->input());
        $methods = 'PUT';
        $url = $this->getUrlBrigdingBPJS() . "RencanaKontrol/Update";
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function hapusRencanaKontrol(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = json_encode($request->input());
        $methods = 'DELETE';
        $url = $this->getUrlBrigdingBPJS() . "RencanaKontrol/Delete";
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function cariRencanaKontrol(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();

        $dataJsonSend = null;
        $methods = 'GET';
        $url = $this->getUrlBrigdingBPJS() . "RencanaKontrol/noSuratKontrol/" . $request['noSurat'];
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function listRencanaKontrol(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = null;
        $methods = 'GET';
        // dd($this->getHeaderBPJSV2());
        //Parameter 1: Tanggal awal format : yyyy-MM-dd
        //Parameter 2: Tanggal akhir format : yyyy-MM-dd
        //Parameter 3: Format filter --> 1: tanggal entri, 2: tanggal rencana kontrol

        $url = $this->getUrlBrigdingBPJS() . 'RencanaKontrol/ListRencanaKontrol/tglAwal/' . $request['tglAwal'] . '/tglAkhir/' . $request['tglAkhir'] . '/filter/' . $request['formatFilter'];
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function insertRencanaKontrolRI(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = json_encode($request->input());
        $methods = 'POST';
        $url = $this->getUrlBrigdingBPJS() . "RencanaKontrol/InsertSPRI";
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }

    public function updateRencanaKontrolRI(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJSV2();
        $dataJsonSend = json_encode($request->input());
        $methods = 'PUT';
        $url = $this->getUrlBrigdingBPJS() . "RencanaKontrol/UpdateSPRI";
        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods, $this->getPortBrigdingBPJS());
        return $this->respond($response);
    }


    protected function curlAPI($headers, $dataJsonSend = null, $url, $method, $tipe = null)
    {
        $curl = curl_init();
        if ($dataJsonSend == null) {
            curl_setopt_array($curl, array(
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 30,
                CURLOPT_SSL_VERIFYHOST => 0,
                CURLOPT_SSL_VERIFYPEER => 0,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => $method,
                CURLOPT_HTTPHEADER => isset($headers['headers']) ? $headers['headers'] :  $headers
            ));
        } else {
            curl_setopt_array($curl, array(
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 30,
                CURLOPT_SSL_VERIFYHOST => 0,
                CURLOPT_SSL_VERIFYPEER => 0,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => $method,
                CURLOPT_POSTFIELDS => $dataJsonSend,
                CURLOPT_HTTPHEADER => isset($headers['headers']) ? $headers['headers'] :  $headers
            ));
        }


        $response = curl_exec($curl);
        $err = curl_error($curl);


        curl_close($curl);

        if ($err) {
            $result = array(
                'metaData' => array(
                    'code' => 400,
                    'message' => 'Gagal menghubungkan ke BPJS (' . $url . ')'
                ),
            );
        } else {
            if ($this->isJson($response)) {
                $result = json_decode($response);
            } else {
                $result = $response;
            }
        }

        if($tipe !='Aplicaresws'){

            // $versiEncrypt = $this->settingDataFixed('versiEncryptBPJS', $this->getKdProfile());

            // if (!empty($versiEncrypt) && $versiEncrypt == 'true') {
                if (isset($result->response) && $result->response != null) {
                    if (isset($headers['cons'])) {
                        $consId = $headers['cons']['data'];
                        $signature = $headers['cons']['secretKey'];
                        $timestamp = $headers['cons']['tStamp'];
                    } else {
                        $consId = $this->getBPJSCons()['consId'];
                        $signature = $this->getBPJSCons()['signature'];
                        $timestamp = $this->getBPJSCons()['timestamp'];
                    }
                    $key = $consId . $signature . (string)$timestamp;
                    return  $this->stringDecrypt2($key, $result);
                } else {
                    return $result;
                }
            // } else {
            //     return $result;
            // }
          }else{
             return $result;
          }
    }


    protected function getKdProfile()
    {
        $session = \Session::get('userData');
        return User::where('id', $session['id'])->first()->kdprofile;
    }

    function stringDecrypt($key, $string)
    {


        $encrypt_method = 'AES-256-CBC';

        // hash
        $key_hash = hex2bin(hash('sha256', $key));

        // iv - encrypt method AES-256-CBC expects 16 bytes - else you will get a warning
        $iv = substr(hex2bin(hash('sha256', $key)), 0, 16);

        $output = openssl_decrypt(base64_decode($string), $encrypt_method, $key_hash, OPENSSL_RAW_DATA, $iv);

        return $output;
    }

    // function lzstring decompress https://github.com/nullpunkt/lz-string-php
    function decompress($string)
    {
        return LZCompressor\LZString::decompressFromEncodedURIComponent($string);
    }

    function getBPJSCons()
    {

        $data = $this->getIdConsumerBPJS();
        $secretKey = $this->getPasswordConsumerBPJS();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);
        $header['consId'] = (string)$data;
        $header['signature'] = (string)$secretKey;
        $header['timestamp'] = (string)$tStamp;

        return $header;
    }
    function stringDecrypt2($key, $string)
    {   

        $bahan = $string->response;

        if(isset($string->metaData)){
            $metadata = $string->metaData;
        }else{
            $metadata = $string->metadata;
        }
     
        $encrypt_method = 'AES-256-CBC';

        // hash
        $key_hash = hex2bin(hash('sha256', $key));

        // iv - encrypt method AES-256-CBC expects 16 bytes - else you will get a warning
        $iv = substr(hex2bin(hash('sha256', $key)), 0, 16);

        $output = openssl_decrypt(base64_decode($bahan), $encrypt_method, $key_hash, OPENSSL_RAW_DATA, $iv);

        $x = \LZCompressor\LZString::decompressFromEncodedURIComponent($output);
        $result = json_decode($x);
        if ($metadata->code != 200) {
            $result = null;
        }
        $data2 = array(
            'metaData' => $metadata,
            'response' => $result,
        );
        return $data2;
    }
    function stringDecrypt3($key, $string)
    {   
    
 
        $bahan = $string->response;

        if(isset($string->metaData)){
            $metadata = $string->metaData;
        }else{
            $metadata = $string->metadata;
        }
     
        $encrypt_method = 'AES-256-CBC';

        // hash
        $key_hash = hex2bin(hash('sha256', $key));

        // iv - encrypt method AES-256-CBC expects 16 bytes - else you will get a warning
        $iv = substr(hex2bin(hash('sha256', $key)), 0, 16);

        $output = openssl_decrypt(base64_decode($bahan), $encrypt_method, $key_hash, OPENSSL_RAW_DATA, $iv);

        $x = \LZCompressor\LZString::decompressFromEncodedURIComponent($output);
        $result = json_decode($x);
        if ($metadata->code != 200) {
            $result = null;
        }
        $data2 = array(
            'metaData' => $metadata,
            'response' => $result,
        );
        return $data2;
    }
    function stringDecryptAntrean($key, $string)
    {

        $bahan = $string->response;

        $metadata = $string->metadata;
        try{
            $status = true;
            $encrypt_method = 'AES-256-CBC';

            // hash
            $key_hash = hex2bin(hash('sha256', $key));

            // iv - encrypt method AES-256-CBC expects 16 bytes - else you will get a warning
            $iv = substr(hex2bin(hash('sha256', $key)), 0, 16);

            $output = openssl_decrypt(base64_decode($bahan), $encrypt_method, $key_hash, OPENSSL_RAW_DATA, $iv);

            $x = \LZCompressor\LZString::decompressFromEncodedURIComponent($output);
            $result = json_decode($x);
            if ($metadata->code != 200) {
                $result = null;
            }     
             $data2 = array(
                    'metaData' => $metadata,
                    'response' => $result,
                );   
        }catch(\Exception $e){
            $status = false;
            $data2 = array(
                'metaData' => $metadata,
                'response' => $bahan,
            );
        }
      
        
       
        return $data2;
    }

    public function getDashboardPerTanggal(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJS('antreanV2');

        $tanggal = $request['tanggal']; //'2021-09-03';
        $waktu = $request['waktu'];
        $methods = 'GET';
        $url = $this->getUrlAntreanBPJSv2() . "dashboard/waktutunggu/tanggal/" . $tanggal . "/waktu/" . $waktu;
        // return $this->respond($url);
        $response = $this->curlAPI($headers, null, $url, $methods);
        return $this->respond($response);
    }

    public function getDashboardPerBulan(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJS('antreanV2');

        $tahun = $request['tahun']; //'2021-09-03';
        $bulan = $request['bulan']; //'2021-09-03';
        $waktu = $request['waktu'];
        // return $tahun;
        $methods = 'GET';
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        $url = $this->getUrlAntreanBPJSv2() . "dashboard/waktutunggu/bulan/" . $bulan . "/tahun/" . $tahun . "/waktu/" . $waktu;
        // dd($url);
        // return $this->respond($url);
        $response = $this->curlAPI($headers, null, $url, $methods);
        return $this->respond($response);
    }

    public function getJadwalDokter(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJS('antreanV2');

        $kodepoli = $request['kodepoli'];
        $tanggal = $request['tanggal']; //'2021-09-03';
        $methods = 'GET';
        $url = $this->getUrlAntreanBPJSv2() . "jadwaldokter/kodepoli/" . $kodepoli . "/tanggal/" . $tanggal;
        // return $url;
        $response = $this->curlAPI($headers, null, $url, $methods);
        //var_dump($response);
        return $this->respond($response);
    }

    public function updateJadwalDokter(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJS('antreanV2');
        $data = json_encode($request['data']);
        // return $this->respond($data);
        $methods = 'POST';
        $url = $this->getUrlAntreanBPJSv2() . "jadwaldokter/updatejadwaldokter";

        // $ch = curl_init($url);
        // curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        // curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        // curl_setopt($ch, CURLOPT_POST, true);
        // curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        // // execute!
        // $response = curl_exec($ch);

        // // close the connection, release resources used
        // curl_close($ch);

        // do anything you want with your response
        // var_dump($response);

        $response = $this->curlAPI($headers, $data, $url, $methods);
        return $this->respond($response);
    }

    public function updateWaktu(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJS('antreanV2');
        $data = json_encode($request['data']);
        $methods = 'POST';
        $url = $this->getUrlAntreanBPJSv2() . "antrean/updatewaktu";
        $response = $this->curlAPI($headers, $data, $url, $methods);
        return $this->respond($response);
    }

    public function batalAntrean(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJS('antreanV2');
        $data = json_encode($request['data']);
        $datareq = $request['data'];
        // update db
        DB::beginTransaction();
        try {

            $dataantrian = DB::table('antrianpasienregistrasi_t')
                ->where('kdprofile', $kdProfile)
                ->where('statusenabled', true)
                ->where('noreservasi', $datareq['kodebooking'])
                ->first();

            if (empty($dataantrian)) {
                $transStatus = 'false';
            } else {
                $dataantrian = DB::table('antrianpasienregistrasi_t')
                    ->where('kdprofile', $kdProfile)
                    ->where('statusenabled', true)
                    ->where('noreservasi', $datareq['kodebooking'])
                    ->update([
                        'statusenabled' => false,
                        'isbatal' => true,
                        'keteranganbatal' => $datareq['keterangan'],
                    ]);
            }

            $transStatus = 'true';
        } catch (Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus != 'false') {
            DB::commit();
        } else {
            DB::rollBack();
            return;
        }
        // end update db
        $methods = 'POST';
        $url = $this->getUrlAntreanBPJSv2() . "antrean/batal";
        $response = $this->curlAPI($headers, $data, $url, $methods);
        return $this->respond($response);
    }

    public function waktuTaskId(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJS('antreanV2');
        $data = json_encode($request['data']);
        $methods = 'POST';
        $url = $this->getUrlAntreanBPJSv2() . "antrean/getlisttask";
        $response = $this->curlAPI($headers, $data, $url, $methods);
        return $this->respond($response);
    }

    public function tambahAntrean(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJS('antreanV2');
        $result = $this->saveAntrian( $request->input(), $kdProfile);
        // array_shift($result);
        $norec =null;
        if(isset($result['norec'])){
            $norec = $result['norec'];
            unset($result['norec']);
           
        }
        // dd($result);
        $data = json_encode($result);
    
        $methods = 'POST';
        $url = $this->getUrlAntreanBPJSv2() . "antrean/add";
        $response = $this->curlAPI($headers, $data, $url, $methods);
       
        if($response->metadata->code != 200){
            AntrianPasienRegistrasi::where('norec',$norec)->delete();
        }
        return $this->respond($response);
    }

    public function getAsalRujukanBPJS(Request $request)
    {
        $data = \DB::table('asalrujukanbpjs_m as ar')
            ->select('ar.id', 'ar.kdasalrujukan', 'ar.asalrujukan')
            ->where('ar.statusenabled', true)
            ->orderBy('ar.id')
            ->get();
        $result = array(
            'data' => $data,
            'message' => 'niaramdanegie',
        );

        return $this->respond($result);
    }

    public function getPasien(Request $request)
    {
        $data = \DB::table('pasien_m as ps')
            ->select('ps.*', 'jk.jeniskelamin')
            ->leftjoin('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->where('ps.statusenabled', true)
            ->where('ps.nocm', $request["rm"])
            ->first();
        $result = array(
            'data' => $data,
            'message' => 'niaramdanegie',
        );

        return $this->respond($result);
    }

    public function saveAntrian($request, $kdProfile)
    {
        $data = $request['data'];
        $eksek = false;
        // return $data['jenispasien'];
        DB::beginTransaction();
        try {
            $norm = "";
            $namaDokter = "";
            $idDokter = null;
            $antrian = app('App\Http\Controllers\ReservasiOnline\ReservasiOnlineController')->GetJamKosong($data['kodepoli'], $data['tanggalperiksa'], $kdProfile, $eksek);
            if($data["pasienbaru"] == 0){
                $pasien = \DB::table('pasien_m')
                ->whereRaw("nocm = '" . $data['norm'] . "'")
                ->where('statusenabled', true)
                ->where('kdprofile', $kdProfile)
                ->first();
            }else{
                $pasien = null;
            }
           
              
            $dokter = DB::table('pegawai_m')
                ->where('statusenabled', true)
                ->where('kdprofile', $kdProfile)
                ->where('kddokterbpjs', $data['kodedokter'])
                ->first();

            $ruang = Ruangan::where('kdinternal', $data['kodepoli'])
                ->where('statusenabled', true)
                ->where('iseksekutif', $eksek)
                ->where('kdprofile', $kdProfile)->first();

            if (empty($dokter)) {
                DB::rollBack();
                $transMessage = "Dokter Tidak Ditemukan";
                $transStatus = 'false';
            } else {
                $namaDokter = $dokter->namalengkap;
                $idDokter = $dokter->id;
            }
            $tipepembayaran = '2';

            $newptp = new AntrianPasienRegistrasi();
            $nontrian = AntrianPasienRegistrasi::max('noantrian') + 1;
            $newptp->norec = $newptp->generateNewId();;
            $newptp->kdprofile = $kdProfile;
            $newptp->statusenabled = true;
            $newptp->objectruanganfk = $ruang->id;
            $newptp->objectjeniskelaminfk = $pasien ? $pasien->objectjeniskelaminfk:0;
            $newptp->noreservasi = substr(Uuid::generate(), 0, 7);
            $newptp->tanggalreservasi = $data['tanggalperiksa'] . " " . $antrian['jamkosong'];
            $newptp->tgllahir = $pasien ? $pasien->tgllahir: null;
            $newptp->objectkelompokpasienfk = $tipepembayaran;
            $newptp->objectpendidikanfk = 0;
            $newptp->namapasien = $data['nama'];
            $newptp->noidentitas = $data['nik'];
            $newptp->tglinput = date('Y-m-d H:i:s');
            $newptp->nobpjs = $data['nomorkartu'];
            if (isset($data['nomorkartu'])) {
                $newptp->jenis = "B";
            }
            $newptp->norujukan = $data['nomorreferensi'];
            $newptp->notelepon = $data['nohp'];
            $newptp->objectpegawaifk = $idDokter;
            $newptp->tipepasien = "LAMA";
            $newptp->ismobilejkn = 1;
            $newptp->objectasalrujukanfk = $data['jeniskunjungan'];
            $newptp->type = "LAMA";

            $newptp->objectagamafk = $pasien ? $pasien->objectagamafk : null;
            if(!empty( $pasien)){
                    $alamat = Alamat::where('nocmfk', $pasien->id)->first();
                if (!empty($alamat)) {
                    $newptp->alamatlengkap = $alamat->alamatlengkap;
                    $newptp->objectdesakelurahanfk = $alamat->objectdesakelurahanfk;
                    $newptp->negara = $alamat->objectnegarafk;
                }
                $newptp->objectgolongandarahfk = $pasien->objectgolongandarahfk;
                $newptp->kebangsaan = $pasien->objectkebangsaanfk;
                $newptp->namaayah = $pasien->namaayah;
                $newptp->namaibu = $pasien->namaibu;
                $newptp->namasuamiistri = $pasien->namasuamiistri;

                $newptp->noaditional = $pasien->noaditional;
                $newptp->noidentitas = $pasien->noidentitas;
                $newptp->nocmfk = $pasien->id;
                $newptp->paspor = $pasien->paspor;
                $newptp->objectpekerjaanfk = $pasien->objectpekerjaanfk;
                $newptp->objectstatusperkawinanfk = $pasien->objectstatusperkawinanfk;
                $newptp->tempatlahir = $pasien->tempatlahir;
            }
            
            $newptp->noantrian = $antrian['antrian'];
          
            $newptp->objectpendidikanfk = $pasien != null && $pasien->objectpendidikanfk !=null ?$pasien->objectpendidikanfk  : 0;
      

            $newptp->save();
            $nomorAntrian = strlen((string)$newptp->noantrian);
            if ($nomorAntrian == 1) {
                $nomorAntrian = '0' . $newptp->noantrian;
            } else {
                $nomorAntrian = $newptp->noantrian;
            }

            $kodeDokter = $data['kodedokter'];
            $kdInternalRuangan = $data['kodepoli'];
            $tglAwal = date('Y-m-d', strtotime($data['tanggalperiksa'])) . ' 00:00:00';
            $tglAkhir = date('Y-m-d', strtotime($data['tanggalperiksa'])) . ' 23:59:59';
            $getLisAntrean = DB::select(DB::raw("
                SELECT x.namapoli,x.namadokter,
                SUM(x.belumdipanggil) - SUM(x.sudahdipanggil) AS sisaantrean,
                SUM(x.totalantrean) AS totalantrean,
                x.koutajkn AS koutajkn,
                x.koutajkn - SUM(x.totalantrean) AS sisakoutajkn,
                x.koutanonjkn AS koutanonjkn,
                x.koutanonjkn - SUM(x.totalantrean) AS sisakoutanonjkn
                FROM(SELECT apr.norec,ru.namaruangan AS namapoli,pg.namalengkap AS namadokter,
                COUNT(apr.norec) AS totalantrean,
                CASE WHEN CAST(apr.statuspanggil AS INTEGER) = 0 THEN 1 ELSE 0 END AS belumdipanggil,
                CASE WHEN CAST(apr.statuspanggil AS INTEGER) = 1 THEN 0 ELSE 0 END AS dipanggil,
                CASE WHEN CAST(apr.statuspanggil AS INTEGER) = 2 THEN 0 ELSE 0 END AS sudahdipanggil,
                sk.quota AS koutajkn,sk.quota AS koutanonjkn
                FROM slottingkiosk_m as sk 
                INNER JOIN antrianpasienregistrasi_t AS apr ON sk.objectruanganfk = apr.objectruanganfk AND apr.tanggalreservasi between '$tglAwal' and '$tglAkhir'
                and apr.kdprofile = $kdProfile
                INNER JOIN ruangan_m AS ru ON ru.id = apr.objectruanganfk
                LEFT JOIN pegawai_m AS pg ON pg.id = apr.objectpegawaifk AND pg.kddokterbpjs = '$kodeDokter'
                WHERE 
                 ru.kdinternal = '$kdInternalRuangan'
                
                GROUP BY apr.norec,ru.namaruangan,pg.namalengkap,apr.statuspanggil,
                sk.quota
                ) AS x
                GROUP BY x.namapoli,x.namadokter,x.koutajkn,x.koutanonjkn
                LIMIT 1
                    "));
            //                dd($getLisAntrean);

            $transStatus = 'true';
            $transMessage = "Ok";
        } catch (\Exception $e) {
            $transMessage = "Gagal Reservasi";
            $transStatus = 'false';
        }


        if ($transStatus == 'true') {
            DB::commit();
            $estimasidilayani = strtotime($newptp->tanggalreservasi) * 1000;
            $result = array(
                "norec" => $newptp->norec,
                "kodebooking" => $newptp->noreservasi,
                "jenispasien" => $data['jenispasien'],
                "nomorkartu" => $data['nomorkartu'],
                "nik" => $data['nik'],
                "nohp" => $data['nohp'],
                "kodepoli" => $data['kodepoli'],
                "namapoli" => $data['namapoli'],
                "pasienbaru" => $data['pasienbaru'],
                "norm" => $data['norm'],
                "tanggalperiksa" => $data['tanggalperiksa'],
                "kodedokter" => $data['kodedokter'],
                "namadokter" => $data['namadokter'],
                "jampraktek" => $data['jampraktek'],
                "jeniskunjungan" => $data['jeniskunjungan'],
                "nomorreferensi" => $data['nomorreferensi'],
                "nomorantrean" => $newptp->jenis . '-' . $nomorAntrian,
                "angkaantrean" => count($getLisAntrean) > 0 ? $getLisAntrean[0]->totalantrean : 1,
                "estimasidilayani" => $estimasidilayani,
                "sisakuotajkn" => $getLisAntrean[0]->sisakoutajkn,
                "kuotajkn" => $getLisAntrean[0]->koutajkn,
                "sisakuotanonjkn" => $getLisAntrean[0]->sisakoutanonjkn,
                "kuotanonjkn" => $getLisAntrean[0]->koutanonjkn,
                "keterangan" => $data['keterangan']
            );
           
        } else {
            DB::rollBack();
            $result = [$e->getMessage().' '.$e->getLine()];
         
        
        }
        return $result;
    }
    public function updateAplicaresBedAfter(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJS('Aplicaresws');
        $kodeppk =  $this->settingDataFixed('kodePPKRujukan', $kdProfile);
        // $dataJsonSend = json_encode($request['json']);
        $methods = 'POST';

        $data = collect(DB::select("

            select x.kodekelas,
            x.namakelas,x.koderuang,x.namaruang,sum(x.tersedia) as tersedia,sum(x.tersediapria) as tersediapria,
            sum(x.tersediawanita) as tersediawanita,sum(x.tersediapriawanita) as tersediapriawanita,
            sum(x.kapasitas) as kapasitas

                from (SELECT
                        CASE WHEN kmr.kodeexternal IS NOT NULL THEN kmr.kodeexternal ELSE kl.namaexternal END AS kodekelas,
                        ru.ID AS koderuang,
                        CASE WHEN   kmr.kodeexternal IS NOT NULL THEN  kmr.kodeexternal ELSE kl.namakelas END AS namakelas,
                        ru.namaruangan AS namaruang,
                        0 AS tersediapria,
                        0 AS tersediawanita,
                        0 AS tersediapriawanita,
                        COUNT ( tt.ID ) AS kapasitas,
                        SUM ( CASE WHEN sb.ID = 2 THEN 1 ELSE 0 END ) AS tersedia 
                        FROM tempattidur_m AS tt
                        INNER JOIN statusbed_m AS sb ON sb. ID = tt.objectstatusbedfk
                        INNER JOIN kamar_m AS kmr ON kmr. ID = tt.objectkamarfk
                        INNER JOIN kelas_m AS kl ON kl. ID = kmr.objectkelasfk
                        INNER JOIN ruangan_m AS ru ON ru. ID = kmr.objectruanganfk
                        WHERE tt.statusenabled = TRUE
                        AND kmr.statusenabled = TRUE
                        AND ru.id=$request[idruangan]
                            AND kl.id=$request[idkelas]
                        GROUP BY 
                        kl.namakelas,ru.id,kl.namaexternal,
                        ru.namaruangan, kmr.kodeexternal

            ) as x group by  x.kodekelas,
            x.namakelas,x.koderuang,x.namaruang
           
            "))->first();
        if (!empty($data)) {
            $json = array(
                "kodekelas" => $data->kodekelas,
                "koderuang" => $data->koderuang,
                "namaruang" => $data->namaruang,
                "kapasitas" => $data->kapasitas,
                "tersedia" => $data->tersedia,
                "tersediapria" => $data->tersediapria,
                "tersediawanita" => $data->tersediawanita,
                "tersediapriawanita" => $data->tersediapriawanita
            );

            $url = $this->getLinkAplicare() . "aplicaresws/rest/bed/update/" . $kodeppk;

            $response = $this->curlAPI($headers, json_encode($json), $url, $methods, 'Aplicaresws');
            if ($response->metadata->code == 0) {
                $url = $this->getLinkAplicare() . "aplicaresws/rest/bed/create/" . $kodeppk;
                $response = $this->curlAPI($headers, json_encode($json), $url, $methods, 'Aplicaresws');
            }
        } else {
            $response = [];
        }

        return $this->respond($response);
    }

    public function getReferensiPoli(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJS('antreanV2');

        $methods = 'GET';
        $url = $this->getUrlAntreanBPJSv2() . "ref/poli";
        // return $this->respond($url);
        $response = $this->curlAPI($headers, null, $url, $methods);
        return $this->respond($response);
    }

    public function getReferensiDokter(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers = $this->getHeaderBPJS('antreanV2');

        $methods = 'GET';
        $url = $this->getUrlAntreanBPJSv2() . "ref/dokter";
        // return $this->respond($url);
        $response = $this->curlAPI($headers, null, $url, $methods);
        return $this->respond($response);
    }

    function getHeaderBPJSV2($type = null)
    {
        $data = $this->getIdConsumerBPJS();

        $secretKey = $this->getPasswordConsumerBPJS();
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        $encodedSignature = base64_encode($signature);

        $header = array(
            "Content-Type: Application/x-www-form-urlencoded",
            "X-cons-id: " . (string)$data,
            "X-signature: " . (string)$encodedSignature,
            "X-timestamp: " . (string)$tStamp,
            "user_key: " . $this->userKeyBPJS()
            // 35f89b7e03c13f1ff62de0be77584945
        );
        $header['headers'] = $header;
        $header['cons'] = array(
            'data' => $data,
            'secretKey' => $secretKey,
            'signature' => $encodedSignature,
            'tStamp' => $tStamp,
            'user_key' =>  $this->userKeyBPJS(),
        );
        return $header;
    }
    function getHeaderApotikOnline($type = null)
    {
        $data = $this->getIdConsumerApotikOnline();

        $secretKey = $this->getPasswordConsumerApotikOnline();
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        $encodedSignature = base64_encode($signature);

        $header = array(
            "Content-Type: Application/x-www-form-urlencoded",
            "X-cons-id: " . (string)$data,
            "X-signature: " . (string)$encodedSignature,
            "X-timestamp: " . (string)$tStamp,
            "user_key: " . $this->userKeyApotikOnline()
            // 35f89b7e03c13f1ff62de0be77584945
        );
        $header['headers'] = $header;
        $header['cons'] = array(
            'data' => $data,
            'secretKey' => $secretKey,
            'signature' => $encodedSignature,
            'tStamp' => $tStamp,
            'user_key' =>  $this->userKeyApotikOnline(),
        );
        return $header;
    }
    public function bpjsTools(Request $request)
    {
        try {

            // $kdProfile = $this->getDataKdProfile($request);
            $headers = $this->getHeaderBPJSV2();

            $dataJsonSend = null;

            if ($request['data'] != null) {
                $dataJsonSend = json_encode($request['data']);
            }
           
            $methods = $request['method'];
            $baseURL = $this->getUrlBrigdingBPJS();
            if (isset($request['jenis']) && $request['jenis'] == 'antrean') {

                $baseURL =  $this->getUrlAntreanBPJSv2();
                $headers['headers'][0]  = 'Content-Type: application/json';
                $headers['headers'][1]  = 'x-cons-id:' .$headers['cons']['data'];
                $headers['headers'][2]  = 'x-timestamp:' . $headers['cons']['tStamp'];
                $headers['headers'][3]  = 'x-signature:' .$headers['cons']['signature'];
                $headers['headers'][4]  = 'user_key:' . $this->getUserKeyAntreanBPJSv2();

            }

            $url =   $baseURL . $request['url'];
  
            $response = $this->curlAPI2($headers['headers'], $dataJsonSend, $url, $methods, null);

            $cekData = array(
                'request' => array(
                    'url' => $url,
                    'headers' =>  $headers['headers'],
                    'payload' =>$dataJsonSend,
                    'secretKey' => $headers['cons']['secretKey'],
                ), 'response' => $response
                ,'method' => $methods
            );
            //return $cekData;
         
            if (isset($request['jenis']) && $request['jenis'] == 'antrean') {
                $consId = $headers['cons']['data'];
                $signature = $headers['cons']['secretKey'];
                $timestamp = $headers['cons']['tStamp'];
                $key = $consId . $signature . (string)$timestamp;
                if(isset($response->response)){
                    return $this->stringDecryptAntrean($key, $response); 
                }else{
                   
                    if(isset( $response->metadata)){
                        $data2 = array(
                            'metaData' => $response->metadata,
                            'response' => null,
                        );
                    }else{
                        $data2 = array(
                            'metaData' => array(
                                'code'=> 201,
                                'message' => 'BPJS : '.$response
                            ) ,
                            'response' => null,
                        );
                    }
                   
                    return $this->respond($data2);
                }
                
            }else if (isset($response->metaData)) {
                $consId = $headers['cons']['data'];
                $signature = $headers['cons']['secretKey'];
                $timestamp = $headers['cons']['tStamp'];
                $key = $consId . $signature . (string)$timestamp;

                return $this->stringDecrypt2($key, $response);
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
                    "message" => "Transaksi tidak dapat di proses, Gagal dicoba kembali (BPJS Kesehatan)!"
                ),
                "response" => null,
                "e"=> $e->getMessage(). ' '.$e->getLine()
            );
    
            return $this->respond($response);
        }
        // return $this->respond($response);
    }
    protected function curlAPI2($headers, $dataJsonSend = null, $url, $method, $tipe = null)
    {
        $curl = curl_init();
        if ($dataJsonSend == null) {
            curl_setopt_array($curl, array(
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 30,
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
                CURLOPT_TIMEOUT => 30,
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
            $result = array(
                'metaData' => array(
                    'code' => 400,
                    'message' => 'Gagal menghubungkan ke BPJS (' . $url . ')'
                ),
            );
        } else {
         
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
    public function simpanLokalSPRI(Request $request)
    {

        $kdProfile = $this->getDataKdProfile($request);
        DB::beginTransaction();
        try {
            if ($request['tipe'] == 'delete') {
                $transMessage = "Sukses ";
                BpjsRencanaKontrol::where('nosuratkontrol', $request['nosuratkontrol'])->delete();
            } else {
                $transMessage = "Sukses";
                if ($request['tipe'] == 'insert') {
                    $data1 = new BpjsRencanaKontrol();
                    $data1->norec = $data1->generateNewId();
                    $data1->kdprofile = $kdProfile;
                    $data1->statusenabled = true;
                } else {
                    $data1 =  BpjsRencanaKontrol::where('nosuratkontrol', $request['nosuratkontrol'])->first();
                }
                $data1->nosuratkontrol = $request['nosuratkontrol'];
                $data1->jnspelayanan = $request['jnspelayanan'];
                $data1->jnskontrol = $request['jnskontrol'];
                $data1->namajnskontrol = $request['namajnskontrol'];
                $data1->tglrencanakontrol = $request['tglrencanakontrol'];
                $data1->tglterbitkontrol = $request['tglterbitkontrol'];
                $data1->nosepasalkontrol = $request['nosepasalkontrol'];
                $data1->poliasal = $request['poliasal'];
                $data1->politujuan = $request['politujuan'];
                $data1->namapolitujuan = $request['namapolitujuan'];
                $data1->tglsep = $request['tglsep'];
                $data1->kodedokter = $request['kodedokter'];
                $data1->namadokter = $request['namadokter'];
                $data1->nokartu = $request['nokartu'];
                $data1->nama = $request['nama'];
                $data1->norec_pd = $request['norec_pd'];
                $data1->save();
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }


        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "e" => $e->getMessage() . ' ' . $e->getLine(),
                "message" => $transMessage . ' Gagal',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
}
