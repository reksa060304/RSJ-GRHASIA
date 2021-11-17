<?php

/**
 * Created by IntelliJ IDEA.
 * User: Egie Ramdan
 * Date: 05/08/2021
 * Time: 16.33
 */


namespace App\Http\Controllers\Bridging;

use App\Http\Controllers\ApiController;
use App\Master\Ruangan;
use App\Traits\Valet;
use Carbon\Carbon;
use Illuminate\Http\Request;
use DB;
use Date;

use App\Traits\PelayananPasienTrait;

class BridgingBiosController  extends ApiController
{

    use Valet, PelayananPasienTrait;
   
    public function __construct()
    {
        parent::__construct($skip_authentication = false);
    }


    function is_decimal($val)
    {
        return is_numeric($val) && floor($val) != $val;
    }



    // BIOS
 
    public function getToken(Request $request)
    {

        $satker = $this->getSatker();
        $secretKey = $this->getPasswordConsumerBios();

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => "80",
            // CURLOPT_URL => $this->getUrlBios() . "token" . '?satker=' . $satker . '$key=' . $secretKey,
            CURLOPT_URL => "http://training-bios2.kemenkeu.go.id/api/token?satker=648261&key=ueyX84m1MZdSESlc3Ky3YRJ6eah3tjjA",
            //            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/SEP/".$request['nosep'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json; charset=utf-8",
            ),
            // CURLOPT_HTTPHEADER => array(
            //     "Cache-Control: no-cache",
            //     "Content-Type: Application/x-www-form-urlencoded",
            //     //                "Postman-Token: 07c605ad-c672-6e5b-562e-7cee1f9cd0ea",
            //     "X-cons-id: " .  (string)$data,
            //     "X-signature: " . (string)$encodedSignature,
            //     "X-timestamp: " . (string)$tStamp
            // ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);
    }
    // public function jumlahpasienrawatinap3(Request $request)
    // {
    //     $q = collect(DB::select("
    //     SELECT count(noregistrasi) as total, kelas_m.namakelas
    //     FROM     pasiendaftar_t INNER JOIN
    //                       antrianpasiendiperiksa_t ON pasiendaftar_t.norec = antrianpasiendiperiksa_t.noregistrasifk INNER JOIN
    //                       kelas_m ON antrianpasiendiperiksa_t.objectkelasfk = kelas_m.id INNER JOIN
    //                       ruangan_m ON antrianpasiendiperiksa_t.objectruanganfk = ruangan_m.id
    //     WHERE  (pasiendaftar_t.tglregistrasi < '2021-04-06 00:00:00') AND (pasiendaftar_t.tglpulang > '2021-04-06 00:00:00') AND (pasiendaftar_t.statusenabled = 1)
    //     and ruangan_m.objectdepartemenfk='16'
    //     group by namakelas"));
    //     foreach ($q as $item) {
    //         $results[] = array(
    //             'kelas' => '01',
    //             'jml_hari' => 1,
    //             'jml_pasien' => 2,
    //             'tgl_transaksi' => '2021-07-29'
    //         );
    //     }
    //     $dataJsonSend = json_encode($results);
    //     $headers = [
    //         "token: " . $request['token'],
    //         "Content-type: application/json",
    //     ];
    //     // return ($dataJsonSend);
    //     // die();
    //     // $headers =  $this->headerDinkesJKT();
    //     // https://training-bios2.kemenkeu.go.id/api/ws/kesehatan/prod
    //     $url = $this->getUrlBios() . 'ws/kesehatan/prod';
    //     // return ($url);
    //     // die();
    //     $response = $this->sendBridgingCurl($headers, $dataJsonSend, $url, 'POST');
    //     return $this->respond($response);
    // }
    public function jumlahpasienrawatinap(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $deptRanap = $this->settingDataFixed('kdDepartemenRanapFix',$kdProfile);
        $tglAwal = $request['tglawal'];
        $tglAkhir = $request['tglakhir'];
        $q = DB::select("
        SELECT count(noregistrasi) as total,kelas_m.kodebios
        FROM pasiendaftar_t 
        INNER JOIN antrianpasiendiperiksa_t ON pasiendaftar_t.norec = antrianpasiendiperiksa_t.noregistrasifk INNER JOIN kelas_m ON antrianpasiendiperiksa_t.objectkelasfk = kelas_m.id 
        INNER JOIN ruangan_m ON antrianpasiendiperiksa_t.objectruanganfk = ruangan_m.id
        WHERE  (pasiendaftar_t.tglregistrasi < '$tglAwal') AND (pasiendaftar_t.tglpulang > '$tglAkhir') AND (pasiendaftar_t.statusenabled = true)
        and pasiendaftar_t.kdprofile=$kdProfile
        and ruangan_m.objectdepartemenfk in ($deptRanap)
        group by kodebios");

        foreach ($q as $value) {
            // return ($value->kodebios);
            // die();
            $arr = array(
                "kelas" =>  $value->kodebios,
                "jml_hari" =>  1,
                "jml_pasien" =>  $value->total,
                "tgl_transaksi" =>  $request['tgltransaksi'],
            );
            $dataJsonSend = json_encode($arr);
            $headers = [
                "token: " . $request['token'],
                "Content-type: application/json",
            ];
            $url = $this->getUrlBios() . 'ws/kesehatan/prod';
            $response = $this->sendBridgingCurl($headers, $dataJsonSend, $url, 'POST');
            return $this->respond($response);
        }
    }
    public function jumlahpasienrawatinap2(Request $request)
    {
        $tglAwal = $request['tglawal'];
        $tglAkhir = $request['tglakhir'];
        $arr = array(
            "kelas" =>  $request['kelas'],
            "jml_hari" =>  1,
            "jml_pasien" =>  $request['jmlpasien'],
            "tgl_transaksi" =>  $request['tgltransaksi'],
        );
        $dataJsonSend = json_encode($arr);
        $headers = [
            "token: " . $request['token'],
            "Content-type: application/json",
        ];
        $url = $this->getUrlBios() . 'ws/kesehatan/prod';
        $response = $this->sendBridgingCurl($headers, $dataJsonSend, $url, 'POST');
        return $this->respond($response);
    }
    public function simpanpenerimaan(Request $request)
    {
        $arr = array(
            "kd_akun" =>  $request['kode'],
            "jumlah" =>  $request['jumlah'],
            "tgl_transaksi" =>  $request['tgltransaksi'],
        );
        $dataJsonSend = json_encode($arr);
        $headers = [
            "token: " . $request['token'],
            "Content-type: application/json",
        ];
        $url = $this->getUrlBios() . 'ws/penerimaan/prod';
        $response = $this->sendBridgingCurl($headers, $dataJsonSend, $url, 'POST');
        return $this->respond($response);
    }
    public function simpanpengeluaran(Request $request)
    {
        $arr = array(
            "kd_akun" =>  $request['kode'],
            "jumlah" =>  $request['jumlah'],
            "tgl_transaksi" =>  $request['tgltransaksi'],
        );
        $dataJsonSend = json_encode($arr);
        $headers = [
            "token: " . $request['token'],
            "Content-type: application/json",
        ];
        $url = $this->getUrlBios() . 'ws/pengeluaran/prod';
        $response = $this->sendBridgingCurl($headers, $dataJsonSend, $url, 'POST');
        return $this->respond($response);
    }
    public function simpansaldoawal(Request $request)
    {
        $arr = array(
            "kd_bank" =>  $request['kd_bank'],
            "kd_rek" =>  $request['kd_rekening'],
            "norek" =>  $request['norek'],
            "saldo" =>  $request['saldo'],
            "tgl_transaksi" =>  $request['tgltransaksi'],
        );
        $dataJsonSend = json_encode($arr);
        $headers = [
            "token: " . $request['token'],
            "Content-type: application/json",
        ];
        $url = $this->getUrlBios() . 'ws/saldo/prod';
        $response = $this->sendBridgingCurl($headers, $dataJsonSend, $url, 'POST');
        return $this->respond($response);
    }
    // public function jumlahpasienrawatinap(Request $request)
    // {
    //     // $data = $this->getIdConsumerBPJS();
    //     $curl = curl_init();
    //     $url = $this->getUrlBios() . 'ws/kesehatan/prod';
    //     $headers = [
    //         "token: " . $request['token'],
    //         "Content-type: application/json",
    //     ];
    //     curl_setopt_array($curl, array(
    //         CURLOPT_PORT => $this->getPortBrigdingBPJS(),
    //         // CURLOPT_URL => $this->getUrlBrigdingBPJS() . "SEP/insert",
    //         CURLOPT_URL => $url,
    //         //                CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/SEP/insert",
    //         CURLOPT_RETURNTRANSFER => true,
    //         CURLOPT_ENCODING => "",
    //         CURLOPT_MAXREDIRS => 10,
    //         CURLOPT_TIMEOUT => 30,
    //         CURLOPT_SSL_VERIFYHOST => 0,
    //         CURLOPT_SSL_VERIFYPEER => 0,
    //         CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    //         CURLOPT_CUSTOMREQUEST => "POST",
    //         CURLOPT_POSTFIELDS =>
    //         "{  \r\n\"Kelas\": \"" . '01' . "\",
    //             \r\n\"jml_hari\": \"" . '2' . "\",
    //             \r\n\"jml_pasien\": \"" . '2' . "\",
    //             \r\n\"tgltransaksi\": \"" . '2021-07-29' . "\",              
    //                   }",
    //         // CURLOPT_POSTFIELDS =>
    //         // "{\r\n\"request\": 
    //         //              {\r\n\"t_sep\": 
    //         //                 {
    //         //                 \r\n\"noKartu\": \"" . $request['nokartu'] . "\",
    //         //                 \r\n\"tglSep\": \"" . $request['tglsep'] . "\",
    //         //                 \r\n\"ppkPelayanan\": \"0904R004\",
    //         //                 \r\n\"jnsPelayanan\": \"" . $request['jenispelayanan'] . "\",
    //         //                 \r\n\"klsRawat\": \"" . $request['kelasrawat'] . "\",
    //         //                 \r\n\"noMR\": \"" . $request['nomr'] . "\",
    //         //                 \r\n\"rujukan\": {\r\n\"asalRujukan\": \"" . $request['asalrujukan'] . "\",
    //         //                                 \r\n\"tglRujukan\": \"" . $request['tglrujukan'] . "\",
    //         //                                 \r\n\"noRujukan\": \"" . $request['norujukan'] . "\",
    //         //                                 \r\n\"ppkRujukan\": \"" . $request['ppkrujukan'] . "\"\r\n},
    //         //                 \r\n\"catatan\": \"" . $request['catatan'] . "\",
    //         //                 \r\n\"diagAwal\": \"" . $request['diagnosaawal'] . "\",
    //         //                 \r\n\"poli\": {\r\n\"tujuan\": \"" . $request['politujuan'] . "\",
    //         //                              \r\n\"eksekutif\": \"" . $request['eksekutif'] . "\"\r\n},
    //         //                 \r\n\"cob\": 
    //         //                             {\r\n\"cob\": \"" . $request['cob'] . "\"\r\n},
    //         //                 \r\n\"jaminan\": {\r\n\"lakaLantas\": \"" . $request['lakalantas'] . "\",
    //         //                                     \r\n\"penjamin\": \"" . $request['penjamin'] . "\",
    //         //                                     \r\n\"lokasiLaka\": \"" . $request['lokasilaka'] . "\"\r\n},
    //         //                 \r\n\"noTelp\": \"" . $request['notelp'] . "\",
    //         //                 \r\n\"user\": \"Ramdanegie\"\r\n}\r\n}\r\n

    //         //           }",

    //         CURLOPT_HTTPHEADER => $headers,
    //     ));

    //     $response = curl_exec($curl);
    //     $err = curl_error($curl);

    //     curl_close($curl);

    //     if ($err) {
    //         $result = "cURL Error #:" . $err;
    //     } else {
    //         $result = (array) json_decode($response);
    //     }
    //     return $this->respond($result);
    // }

    public function getKesehatanrs(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $tglAwal = $request['tglawal'];
        $tglAkhir = $request['tglakhir'];
        $deptRanap = $this->settingDataFixed('kdDepartemenRanapFix',$kdProfile);
        $q = collect(DB::select("
        SELECT count(noregistrasi) as total, kelas_m.namakelas,kelas_m.kodebios
        FROM     pasiendaftar_t 
        INNER JOIN antrianpasiendiperiksa_t ON pasiendaftar_t.norec = antrianpasiendiperiksa_t.noregistrasifk INNER JOIN kelas_m ON antrianpasiendiperiksa_t.objectkelasfk = kelas_m.id 
        INNER JOIN ruangan_m ON antrianpasiendiperiksa_t.objectruanganfk = ruangan_m.id
        WHERE  (pasiendaftar_t.tglregistrasi < '$tglAwal') AND (pasiendaftar_t.tglpulang > '$tglAkhir') AND (pasiendaftar_t.statusenabled = true)
        and pasiendaftar_t.kdprofile =$kdProfile
        and ruangan_m.objectdepartemenfk in ($deptRanap)
        group by namakelas,kodebios"));
        foreach ($q as $value) {
            $result[] = array(
                'namakelas'  => $value->namakelas,
                'jml_pasien'  => $value->total,
                'jml_hari'  => 1,
                'tgl_transaksi'  => $tglAwal,
                'kode' => $value->kodebios
            );
        }


        return $this->respond($result, "Kesehatan Rumah Sakit");
    }
    public function getKesehatanrskirim(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $deptRanap = $this->settingDataFixed('kdDepartemenRanapFix',$kdProfile);
        $tglAwal = $request['tglawal'];
        $tglAkhir = $request['tglakhir'];
        $q = collect(DB::select("
        SELECT count(noregistrasi) as total, kelas_m.kodebios
        FROM pasiendaftar_t 
        INNER JOIN antrianpasiendiperiksa_t ON pasiendaftar_t.norec = antrianpasiendiperiksa_t.noregistrasifk INNER JOIN kelas_m ON antrianpasiendiperiksa_t.objectkelasfk = kelas_m.id 
        INNER JOIN  ruangan_m ON antrianpasiendiperiksa_t.objectruanganfk = ruangan_m.id
        WHERE  (pasiendaftar_t.tglregistrasi < '$tglAwal') AND (pasiendaftar_t.tglpulang > '$tglAkhir') AND (pasiendaftar_t.statusenabled = true)
        and pasiendaftar_t.kdprofile=$kdProfile
        and ruangan_m.objectdepartemenfk in ($deptRanap)
        group by kodebios"));
        foreach ($q as $value) {
            $result[] = array(
                // 'namakelas'  => $value->namakelas,
                'jml_pasien'  => $value->total,
                'jml_hari'  => 1,
                'tgl_transaksi'  => $tglAwal,
                'kode' => $value->kodebios
            );
        }


        return $this->respond($result, "Kesehatan Rumah Sakit");
    }
    public function getKesehatan(Request $request)
    {
        $url = $this->getUrlBios() . 'get/data/kesehatan';
        $url = $url . '?tgl_transaksi=' . $request['tgltransaksi'];
        // return ($url);
        // die();
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => "80",
            CURLOPT_URL => $url,
            //            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/Peserta/nokartu/".$request['nokartu']."/tglSEP/".$request['tglsep'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json; charset=utf-8",
                "token: " .  $request['token'],

            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);
    }
    public function getPenerimaan(Request $request)
    {
        $url = $this->getUrlBios() . 'get/data/penerimaan';
        $url = $url . '?tgl_transaksi=' . $request['tgltransaksi'];
        // return ($url);
        // die();
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => "80",
            CURLOPT_URL => $url,
            //            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/Peserta/nokartu/".$request['nokartu']."/tglSEP/".$request['tglsep'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json; charset=utf-8",
                "token: " .  $request['token'],

            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);
    }
    public function getPengeluaran(Request $request)
    {
        $url = $this->getUrlBios() . 'get/data/pengeluaran';
        $url = $url . '?tgl_transaksi=' . $request['tgltransaksi'];
        // return ($url);
        // die();
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => "80",
            CURLOPT_URL => $url,
            //            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/Peserta/nokartu/".$request['nokartu']."/tglSEP/".$request['tglsep'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json; charset=utf-8",
                "token: " .  $request['token'],

            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);
    }
    public function getSaldo(Request $request)
    {
        $url = $this->getUrlBios() . 'get/data/saldo';
        $url = $url . '?tgl_transaksi=' . $request['tgltransaksi'];
        // return ($url);
        // die();
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => "80",
            CURLOPT_URL => $url,
            //            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/Peserta/nokartu/".$request['nokartu']."/tglSEP/".$request['tglsep'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json; charset=utf-8",
                "token: " .  $request['token'],

            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);
    }
    public function getListAkun(Request $request)
    {
        $url = $this->getUrlBios() . 'ws/ref/akun';
        // return ($url);
        // die();
        // $url = $url . '?tgl_transaksi=' . $request['tgltransaksi'];
        // return ($url);
        // die();
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => "80",
            CURLOPT_URL => $url,
            //            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/Peserta/nokartu/".$request['nokartu']."/tglSEP/".$request['tglsep'],
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
                "token: " .  $request['token'],

            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);
    }
    public function getListBank(Request $request)
    {
        $url = $this->getUrlBios() . 'ws/ref/bank';
        // return ($url);
        // die();
        // $url = $url . '?tgl_transaksi=' . $request['tgltransaksi'];
        // return ($url);
        // die();
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => "80",
            CURLOPT_URL => $url,
            //            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/Peserta/nokartu/".$request['nokartu']."/tglSEP/".$request['tglsep'],
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
                "token: " .  $request['token'],

            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);
    }
    public function getListRekening(Request $request)
    {
        $url = $this->getUrlBios() . 'ws/ref/rekening';
        // return ($url);
        // die();
        // $url = $url . '?tgl_transaksi=' . $request['tgltransaksi'];
        // return ($url);
        // die();
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => "80",
            CURLOPT_URL => $url,
            //            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/Peserta/nokartu/".$request['nokartu']."/tglSEP/".$request['tglsep'],
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
                "token: " .  $request['token'],

            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);
    }
}
