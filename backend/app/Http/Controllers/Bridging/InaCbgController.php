<?php
/**
 * Created by PhpStorm.
 * User: as@epic
 * Date: 19/02/2019
 * Time: 14.54
 */

namespace App\Http\Controllers\Bridging;

use App\Http\Controllers\ApiController;
use App\Master\DiagnosaKeperawatan;
use App\Master\KelompokTransaksi;
use App\Transaksi\InformasiTanggungan;
use App\Transaksi\PasienDaftar;
use App\Transaksi\AntrianPasienDiperiksa;
use App\Transaksi\KelengkapanDokumen;
use App\Transaksi\PelayananPasien;
use App\Transaksi\HasilGrouping;
use App\Transaksi\PemakaianAsuransi;
use App\Transaksi\StrukPelayanan;
use App\Transaksi\StrukPelayananPenjamin;
use App\Transaksi\ResponseDataEklaim;
use DB;
use Illuminate\Http\Request;
use App\Traits\Valet;
use App\Transaksi\HasilGroupingIdrg;
use App\Transaksi\HasilLaboratorium;
use App\Transaksi\HasilGroupingInacbg;
use Auth;
use phpDocumentor\Reflection\Types\Null_;
use Webpatser\Uuid\Uuid;


class InaCbgController   extends ApiController
{

    use Valet;

    public function __construct() {
    parent::__construct($skip_authentication=false);
}
//     public function saveBridgingINACBG(Request $request)
//     {
//         $data  = \DB::table('settingdatafixed_m')
//             ->select('namafield','nilaifield')
//             ->where('keteranganfungsi','inacbg')
//             ->get();
// //        return $data;
//         foreach ($data as $item){
//             if ($item->namafield == 'codernik'){
//                 $codernik = $item->nilaifield;
//             }
//             if ($item->namafield == 'key'){
//                 $key = $item->nilaifield;
//             }
//             if ($item->namafield == 'url'){
//                 $url = $item->nilaifield;
//             }
//         }

// //        $key = "1fa5106f46eedd6d536bb816f4dc23728e0ca1dee3db20904e634134b205b28d";//        $url = "localhost/E-Klaim/ws.php";

//         $dataReq = $request['data'];
//         $responseArr = [];
//         foreach ($dataReq as $dataLoop){
//             $json_request = json_encode($dataLoop);
//             $payload = $this->inacbg_encrypt($json_request,$key);
//             $header = array("Content-Type: application/x-www-form-urlencoded");

//             $ch = curl_init();
//             curl_setopt($ch, CURLOPT_URL, $url);
//             curl_setopt($ch, CURLOPT_HEADER, 0);
//             curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
//             curl_setopt($ch, CURLOPT_HTTPHEADER,$header);
//             curl_setopt($ch, CURLOPT_POST, 1);
//             curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
//             $response = curl_exec($ch);
//             $err = curl_error($ch);
//             if ($err) {
//                 return $this->setStatusCode(400)->respond($err, $err);
//             }
//             $first  = strpos($response, "\n")+1;
//             $last   = strrpos($response, "\n")-1;
//             $response  = substr($response,
//                 $first,
//                 strlen($response) - $first - $last);
//             $response = $this->inacbg_decrypt($response,$key);
//             $responseArr[] =array(
//                 'datarequest' => $dataLoop,
//                 'dataresponse' =>   $response
//             );
//         }
//         $result = array(
//             "status" => 201,
//             "dataresponse" => $responseArr,
//             "as" => 'as@epic',
//         );
// //        return $this->respond($responseArr);
//         return $this->setStatusCode($result['status'])->respond($result, "Bridging InaCBG");
//     }


    // public function saveBridgingINACBG(Request $request)
    // {
    //     $data = \DB::table('settingdatafixed_m')
    //         ->select('namafield', 'nilaifield')
    //         ->where('keteranganfungsi', 'inacbg')
    //         ->get();

    //     $codernik = $key = $url = null;
    //     foreach ($data as $item) {
    //         if ($item->namafield == 'codernik') $codernik = $item->nilaifield;
    //         if ($item->namafield == 'key') $key = $item->nilaifield;
    //         if ($item->namafield == 'url') $url = $item->nilaifield;
    //     }

    //     $dataReq = $request['data'];
    //     $responseArr = [];

    //     foreach ($dataReq as $dataLoop) {
    //         $json_request = json_encode($dataLoop);
    //         $payload = $this->inacbg_encrypt($json_request, $key);
    //         $header = ["Content-Type: application/x-www-form-urlencoded"];

    //         $ch = curl_init();
    //         curl_setopt_array($ch, [
    //             CURLOPT_URL => $url,
    //             CURLOPT_HEADER => 0,
    //             CURLOPT_RETURNTRANSFER => 1,
    //             CURLOPT_HTTPHEADER => $header,
    //             CURLOPT_POST => 1,
    //             CURLOPT_POSTFIELDS => $payload,
    //         ]);
    //         $response = curl_exec($ch);
    //         $err = curl_error($ch);
    //         curl_close($ch);

    //         if ($err) {
    //             return $this->setStatusCode(400)->respond($err, $err);
    //         }

    //         $first = strpos($response, "\n") + 1;
    //         $last = strrpos($response, "\n") - 1;
    //         $response = substr($response, $first, strlen($response) - $first - $last);
    //         $response = $this->inacbg_decrypt($response, $key);
    //         $response = json_decode(json_encode($response), true);

    //         $responseArr[] = [
    //             'datarequest' => $dataLoop,
    //             'dataresponse' => $response,
    //         ];

    //         $nomorSep = $dataLoop['data']['nomor_sep'] ?? null;
    //         $mdcDescRaw = $response['response_idrg']['mdc_description'] ?? '';
    //         $drgDescRaw = $response['response_idrg']['drg_description'] ?? '';
    //         $drgCode = $response['response_idrg']['drg_code'] ?? null;

    //         $noreg = \DB::table('pemakaianasuransi_t')
    //             ->where('nosep', $nomorSep)
    //             ->value('noregistrasifk');

    //         if (isset($dataLoop['metadata']['method']) && $dataLoop['metadata']['method'] == 'delete_claim') {
    //             if ($noreg) {
    //                 \DB::table('pasiendaftar_t')
    //                     ->where('norec', $noreg)
    //                     ->update(['responseeklaim' => null]); 
    //             }
    //         } else {
    //             if ($noreg) {
    //                 $textParts = [];
    //                 if (!empty($mdcDescRaw)) {
    //                     $textParts[] = "MDC - {$mdcDescRaw}";
    //                 }
    //                 if (!empty($drgCode) || !empty($drgDescRaw)) {
    //                     $drgText = trim("{$drgCode} {$drgDescRaw}");
    //                     $textParts[] = "DRG - {$drgText}";
    //                 }

    //                 $text = implode(' | ', $textParts);

    //                 if (!empty($text)) {
    //                     \DB::table('pasiendaftar_t')
    //                         ->where('norec', $noreg)
    //                         ->update(['responseeklaim' => $text]);
    //                 }
    //             }
    //         }
    //     }

    //     $result = [
    //         "status" => 201,
    //         "dataresponse" => $responseArr,
    //         "as" => 'as@epic',
    //     ];

    //     return $this->setStatusCode($result['status'])->respond($result, "Bridging InaCBG");
    // }
    public function saveBridgingINACBG(Request $request)
    {
        $data  = \DB::table('settingdatafixed_m')
            ->select('namafield','nilaifield')
            ->where('keteranganfungsi','inacbg')
            ->get();
//        return $data;
        foreach ($data as $item){
            if ($item->namafield == 'codernik'){
                $codernik = $item->nilaifield;
            }
            if ($item->namafield == 'key'){
                $key = $item->nilaifield;
            }
            if ($item->namafield == 'url'){
                $url = $item->nilaifield;
            }
        }

//        $key = "1fa5106f46eedd6d536bb816f4dc23728e0ca1dee3db20904e634134b205b28d";//        $url = "localhost/E-Klaim/ws.php";

        $dataReq = $request['data'];
        $responseArr = [];
        foreach ($dataReq as $dataLoop){
            $json_request = json_encode($dataLoop);
            $payload = $this->inacbg_encrypt($json_request,$key);
            $header = array("Content-Type: application/x-www-form-urlencoded");

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_HEADER, 0);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_HTTPHEADER,$header);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
            $response = curl_exec($ch);
            $err = curl_error($ch);
            if ($err) {
                return $this->setStatusCode(400)->respond($err, $err);
            }
            $first  = strpos($response, "\n")+1;
            $last   = strrpos($response, "\n")-1;
            $response  = substr($response,
                $first,
                strlen($response) - $first - $last);
            $response = $this->inacbg_decrypt($response,$key);
            $responseArr[] =array(
                'datarequest' => $dataLoop,
                'dataresponse' =>   $response
            );
        }
        $result = array(
            "status" => 201,
            "dataresponse" => $responseArr,
            "as" => 'as@epic',
        );
//        return $this->respond($responseArr);
        return $this->setStatusCode($result['status'])->respond($result, "Bridging InaCBG");
    }
    // Encryption Function
    function inacbg_encrypt($data, $key) {
        /// make binary representasion of $key
        $key = hex2bin($key);
        /// check key length, must be 256 bit or 32 bytes
        if (mb_strlen($key, "8bit") !== 32) {
          throw new Exception("Needs a 256-bit key!");
        }
        /// create initialization vector
        $iv_size = openssl_cipher_iv_length("aes-256-cbc");
        $iv = openssl_random_pseudo_bytes($iv_size);
        // dengan catatan dibawah
        /// encrypt
        $encrypted = openssl_encrypt($data,
            "aes-256-cbc",
            $key,
            OPENSSL_RAW_DATA,
            $iv );
        /// create signature, against padding oracle attacks
        $signature = mb_substr(hash_hmac("sha256",
            $encrypted,
            $key,
            true),0,10,"8bit");
        /// combine all, encode, and format
        $encoded = chunk_split(base64_encode($signature.$iv.$encrypted));
        return $encoded;
    }
    // Decryption Function
    function inacbg_decrypt($str, $strkey){
        /// make binary representation of $key
        $key = hex2bin($strkey);
        /// check key length, must be 256 bit or 32 bytes
        if (mb_strlen($key, "8bit") !== 32) {
            throw new Exception("Needs a 256-bit key!");
        }
        /// calculate iv size
        $iv_size = openssl_cipher_iv_length("aes-256-cbc");
        /// breakdown parts
        $decoded = base64_decode($str);
        $signature = mb_substr($decoded,0,10,"8bit");
        $iv = mb_substr($decoded,10,$iv_size,"8bit");
        $encrypted = mb_substr($decoded,$iv_size+10,NULL,"8bit");
        /// check signature, against padding oracle attack
        $calc_signature = mb_substr(hash_hmac("sha256",
            $encrypted,
            $key,
            true),0,10,"8bit");
        if($this->inacbg_compare($signature,$calc_signature)) {
//            return "SIGNATURE_NOT_MATCH"; /// signature doesn't match
        }
        $decrypted = openssl_decrypt($encrypted,
            "aes-256-cbc",
            $key,
            OPENSSL_RAW_DATA,
            $iv);
        $dtdtd = json_decode($decrypted);
        return $dtdtd;
    }
    /// Compare Function
    function inacbg_compare($a, $b) {
        /// compare individually to prevent timing attacks
        /// compare length
        if (strlen($a) !== strlen($b)) return false;
        /// compare individual
        $result = 0;
        for($i = 0; $i < strlen($a); $i ++) {
            $result |= ord($a[$i]) ^ ord($b[$i]);
        }
        return $result == 0;
    }
    public function getDaftarPasien(Request $request)
    {
        $data  = \DB::table('settingdatafixed_m')
            ->select('namafield','nilaifield')
            ->where('keteranganfungsi','inacbg')
            ->get();
        foreach ($data as $item){
            if ($item->namafield == 'codernik'){
                $codernik = $item->nilaifield;
            }
            if ($item->namafield == 'key'){
                $key = $item->nilaifield;
            }
            if ($item->namafield == 'url'){
                $url = $item->nilaifield;
            }
            if ($item->namafield == 'kodetarif'){
                $kodetarif = $item->nilaifield;
            }
        }

        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftJoin('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
//            ->join('antrianpasiendiperiksa_t as apd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->leftJoin('strukpelayanan_t as sp', 'sp.norec', '=', 'pd.nostruklastfk')
            ->leftJoin('strukbuktipenerimaan_t as sbm', 'sbm.norec', '=', 'pd.nosbmlastfk')
            ->leftjoin('loginuser_s as lu', 'lu.id', '=', 'sbm.objectpegawaipenerimafk')
            ->leftjoin('pegawai_m as pgs', 'pgs.id', '=', 'lu.objectpegawaifk')
            ->leftjoin('pemakaianasuransi_t as pas', 'pas.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('asuransipasien_m as asu', 'asu.id', '=', 'pas.objectasuransipasienfk')
            ->leftjoin('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
            ->leftjoin('kelas_m as kls2', 'kls2.id', '=', 'asu.objectkelasdijaminfk')
            ->leftjoin('batalregistrasi_t as br', 'br.pasiendaftarfk', '=', 'pd.norec')
            ->select('pd.norec', 'pd.tglregistrasi', 'ps.nocm', 'pd.noregistrasi', 'ru.namaruangan', 'ps.namapasien', 'kp.kelompokpasien',
                'pd.tglpulang', 'pd.statuspasien', 'sp.nostruk', 'sbm.nosbm', 'pg.id as pgid', 'pg.namalengkap as namadokter',
                'pgs.namalengkap as kasir','pd.objectruanganlastfk as ruanganid','pas.nosep','pas.norec as norec_pa','br.norec as norec_br',
                'pas.nokepesertaan','ps.tgllahir','ps.objectjeniskelaminfk','dept.id as deptid','kls.nourut as nokelasdaftar','kls2.nourut as nokelasdijamin',
                'kls2.namakelas','pd.objectstatuspulangfk')
            ->whereNull('br.norec')
            ->where('pas.nosep','<>','')
            ->whereNotNull('pas.nosep')
            ->whereNotNull('pd.tglpulang');

//            ->where('apd.objectruanganasalfk',null);

        $filter = $request->all();
        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $tgl = $filter['tglAkhir'];//." 23:59:59";
            $data = $data->where('pd.tglregistrasi', '<=', $tgl);
        }
        if (isset($filter['deptId']) && $filter['deptId'] != "" && $filter['deptId'] != "undefined") {
            $data = $data->where('dept.id', '=', $filter['deptId']);
        }
        if (isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined") {
            $data = $data->where('ru.id', '=', $filter['ruangId']);
        }
//        if (isset($filter['kelId']) && $filter['kelId'] != "" && $filter['kelId'] != "undefined") {
//            $data = $data->where('kp.id', '=', $filter['kelId']);
//        }
        $paramKel  ='';
        if(isset($request['kelId']) && $request['kelId']!="" && $request['kelId']!="undefined"){
            $arrKel = explode(',',$request['kelId']) ;
            $kodeKel = [];
            foreach ( $arrKel as $item){
                $kodeKel[] = (int) $item;
            }
            $paramKel = ' and kp.id in ('.$request['kelId'].')';
            $data = $data->whereIn('kp.id',$kodeKel);
        }
        if (isset($filter['dokId']) && $filter['dokId'] != "" && $filter['dokId'] != "undefined") {
            $data = $data->where('pg.id', '=', $filter['dokId']);
        }
        if (isset($filter['sttts']) && $filter['sttts'] != "" && $filter['sttts'] != "undefined") {
            $data = $data->where('pd.statuspasien', '=', $filter['sttts']);
        }
        if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', 'ilike', '%' . $filter['noreg'] . '%');
        }
        if (isset($filter['norm']) && $filter['norm'] != "" && $filter['norm'] != "undefined") {
            $data = $data->where('ps.nocm', 'ilike', '%' . $filter['norm'] . '%');
        }
        if (isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $data = $data->where('ps.namapasien', 'ilike', '%' . $filter['nama'] . '%');
        }
        if (isset($filter['nosep']) && $filter['nosep'] != "" && $filter['nosep'] != "undefined") {
            $data = $data->where('pas.nosep', '=', $filter['nosep']);
        }
       if (isset($filter['jmlRows']) && $filter['jmlRows'] != "" && $filter['jmlRows'] != "undefined") {
           $data = $data->take($filter['jmlRows']);
       }
        $data = $data->orderBy('pd.noregistrasi');

        $data = $data->get();

        $i = 0 ;
        $dtdt = '';
        $dataDiagnosa = \DB::table('detaildiagnosapasien_t as dp')
            ->join('diagnosa_m as dg', 'dg.id', '=', 'dp.objectdiagnosafk')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'dp.noregistrasifk')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->select('dg.kddiagnosa','apd.objectasalrujukanfk','pd.norec')
//            ->where('apd.noregistrasifk',$data[$i]->norec)
            ->where('pd.tglregistrasi', '>=', $filter['tglAwal'])
            ->where('pd.tglregistrasi', '<=', $filter['tglAkhir'])
            ->get();
        foreach ($data as $item){
            $dtdt = '';
            $asalRujukan = '';
//            $dataDiagnosa = \DB::table('detaildiagnosapasien_t as dp')
//                ->join('diagnosa_m as dg', 'dg.id', '=', 'dp.objectdiagnosafk')
//                ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'dp.noregistrasifk')
//                ->select('dg.kddiagnosa','apd.objectasalrujukanfk')
//                ->where('apd.noregistrasifk',$data[$i]->norec)
//                ->get();
            foreach ($dataDiagnosa as $item2){
                if ($item2->norec == $data[$i]->norec){
                    $dtdt = $dtdt . '#' .  $item2->kddiagnosa;
                    $asalRujukan = $item2->objectasalrujukanfk;
                }
            }
            $data[$i]->icd10 = substr($dtdt,1,strlen($dtdt)-1);
            $data[$i]->codernik = $codernik;
            $data[$i]->objectasalrujukanfk = $asalRujukan;
            $data[$i]->kodetarif = $kodetarif;
            $i= $i + 1 ;
        }

        $i = 0 ;
        $dtdt = '';
        $dataICD9 = \DB::table('diagnosatindakanpasien_t as dpa')
            ->join('detaildiagnosatindakanpasien_t as dp', 'dpa.norec', '=', 'dp.objectdiagnosatindakanpasienfk')
            ->join('diagnosatindakan_m as dg', 'dg.id', '=', 'dp.objectdiagnosatindakanfk')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'dpa.objectpasienfk')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->select('dg.kddiagnosatindakan','pd.norec')
//            ->where('apd.noregistrasifk',$data[$i]->norec)
            ->where('pd.tglregistrasi', '>=', $filter['tglAwal'])
            ->where('pd.tglregistrasi', '<=', $filter['tglAkhir'])
            ->get();
        foreach ($data as $item){
            $dtdt = '';
//            $dataICD9 = \DB::table('diagnosatindakanpasien_t as dpa')
//                ->join('detaildiagnosatindakanpasien_t as dp', 'dpa.norec', '=', 'dp.objectdiagnosatindakanpasienfk')
//                ->join('diagnosatindakan_m as dg', 'dg.id', '=', 'dp.objectdiagnosatindakanfk')
//                ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'dpa.objectpasienfk')
//                ->select('dg.kddiagnosatindakan')
//                ->where('apd.noregistrasifk',$data[$i]->norec)
//                ->get();
            foreach ($dataICD9 as $item2){
                if ($item2->norec == $data[$i]->norec) {
                    $dtdt = $dtdt . '#' . $item2->kddiagnosatindakan;
                }
            }
            $data[$i]->icd9 = substr($dtdt,1,strlen($dtdt)-1);
            $i= $i + 1 ;
        }

        $tglawalawal = $filter['tglAwal'];
        $tglakhirakhir = $filter['tglAkhir'];
        $dataTarif16 = DB::select(DB::raw("select pd.norec, sum(((pp.hargajual - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) * pp.jumlah)+ case when pp.jasa is null then 0 else pp.jasa end) as ttl,kpb.namaexternal
            from pasiendaftar_t as pd
            inner join pasien_m as ps on ps.id = pd.nocmfk
            INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
            INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
            INNER JOIN produk_m as pr on pr.id=pp.produkfk
            INNER JOIN kelompokprodukbpjs_m as kpb on kpb.id=pr.objectkelompokprodukbpjsfk
            left join kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
            left join batalregistrasi_t as br on br.pasiendaftarfk = pd.norec
            where br.norec is null  and 
            pd.tglregistrasi >= '$tglawalawal' and pd.tglregistrasi <= '$tglakhirakhir'  
            $paramKel
            group  by pd.norec,kpb.namaexternal order by pd.norec")
        );
        $i = 0 ;
        $prosedur_non_bedah ='';
        $prosedur_bedah ='';
        $konsultasi ='';
        $tenaga_ahli ='';
        $keperawatan ='';
        $penunjang ='';
        $radiologi ='';
        $laboratorium ='';
        $pelayanan_darah ='';
        $rehabilitasi ='';
        $kamar ='';
        $rawat_intensif ='';
        $obat ='';
        $obat_kronis ='';
        $obat_kemoterapi ='';
        $alkes ='';
        $bmhp ='';
        $sewa_alat ='';
        foreach ($data as $item){
            $norecpd= $data[$i]->norec;
            foreach ($dataTarif16 as $itm){
                if ($itm->norec == $norecpd){
//                    $data[$i]->tarif_rs->($dataTarif16[0]->namaexternal) => (float)$dataTarif16[0]->ttl,
                    if ($itm->namaexternal == 'prosedur_non_bedah'){
                        $prosedur_non_bedah = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'prosedur_bedah'){
                        $prosedur_bedah = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'konsultasi'){
                        $konsultasi = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'tenaga_ahli'){
                        $tenaga_ahli = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'keperawatan'){
                        $keperawatan = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'penunjang'){
                        $penunjang = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'radiologi'){
                        $radiologi = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'laboratorium'){
                        $laboratorium = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'pelayanan_darah'){
                        $pelayanan_darah = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'rehabilitasi'){
                        $rehabilitasi = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'kamar'){
                        $kamar = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'rawat_intensif'){
                        $rawat_intensif = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'obat'){
                        $obat = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'obat_kronis'){
                        $obat_kronis = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'obat_kemoterapi'){
                        $obat_kemoterapi = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'alkes'){
                        $alkes = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'bmhp'){
                        $bmhp = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'sewa_alat'){
                        $sewa_alat = (float)$itm->ttl;
                    }
                }
            }

            $datatatat = array(
                'prosedur_non_bedah' => (float)$prosedur_non_bedah,
                'prosedur_bedah' => (float)$prosedur_bedah,
                'konsultasi' => (float)$konsultasi,
                'tenaga_ahli' => (float)$tenaga_ahli,
                'keperawatan' => (float)$keperawatan,
                'penunjang' => (float)$penunjang,
                'radiologi' => (float)$radiologi,
                'laboratorium' => (float)$laboratorium,
                'pelayanan_darah' => (float)$pelayanan_darah,
                'rehabilitasi' => (float)$rehabilitasi,
                'kamar' => (float)$kamar,
                'rawat_intensif' => (float)$rawat_intensif,
                'obat' => (float)$obat,
                'obat_kronis' => (float)$obat_kronis,
                'obat_kemoterapi' => (float)$obat_kemoterapi,
                'alkes' => (float)$alkes,
                'bmhp' => (float)$bmhp,
                'sewa_alat' => (float)$sewa_alat,
            );
            $prosedur_non_bedah =0;
            $prosedur_bedah =0;
            $konsultasi =0;
            $tenaga_ahli =0;
            $keperawatan =0;
            $penunjang =0;
            $radiologi =0;
            $laboratorium =0;
            $pelayanan_darah =0;
            $rehabilitasi =0;
            $kamar =0;
            $rawat_intensif =0;
            $obat =0;
            $obat_kronis =0;
            $obat_kemoterapi =0;
            $alkes =0;
            $bmhp =0;
            $sewa_alat =0;
            $data[$i]->tarif_rs = $datatatat;

            $i= $i + 1 ;
//            $dataTarif16 = DB::select(DB::raw("select kpb.id,kpb.namaexternal,sum(x.total) as ttl
//                from kelompokprodukbpjs_m kpb
//                left JOIN
//                (select (pp.hargajual - pp.hargadiscount) * pp.jumlah as total ,pr.objectkelompokprodukbpjsfk
//                from produk_m as pr
//                INNER JOIN pelayananpasien_t as pp on pr.id=pp.produkfk
//                INNER JOIN antrianpasiendiperiksa_t as apd on pp.noregistrasifk=apd.norec
//                INNER JOIN pasiendaftar_t as pd on apd.noregistrasifk=pd.norec
//                where pd.norec='$norecpd' ) as x
//                on x.objectkelompokprodukbpjsfk=kpb.id
//                where kpb.id <> 0
//                group by kpb.id,kpb.namaexternal
//                order by kpb.id")
//            );



        }

//        return $this->respond(array(
//            'data1' => $dataTarif16,
//            'data2' =>$data,
//        ));
        return $this->respond($data);
    }
    public function getComboInaCbg(Request $request)
    {
        $dataLogin = $request->all();
        $dataInstalasi = \DB::table('departemen_m as dp')
            ->whereIn('dp.id', array(3, 14, 16, 17, 18, 19, 24, 25, 26, 27, 28, 35))
            ->where('dp.statusenabled', true)
            ->orderBy('dp.namadepartemen')
            ->get();

        $dataRuangan = \DB::table('ruangan_m as ru')
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();

        $darah = \DB::table('ruangan_m as ru')
            ->where('ru.kdruangan', '41')
            ->orderBy('ru.namaruangan')
            ->get();

        $dept = \DB::table('departemen_m as dept')
            ->where('dept.id', '18')
            ->orderBy('dept.namadepartemen')
            ->get();

        $departemen = \DB::table('departemen_m as dept')
            ->where('dept.statusenabled', true)
            ->orderBy('dept.namadepartemen')
            ->get();

        $deptRajalInap = \DB::table('departemen_m as dept')
            ->whereIn('dept.id', [18, 16])
            ->orderBy('dept.namadepartemen')
            ->get();

        $ruanganRi = \DB::table('ruangan_m as ru')
            ->whereIn('ru.objectdepartemenfk',[16,17,25,35])
//            ->wherein('ru.objectdepartemenfk', ['18', '28'])
            ->where('ru.statusenabled',true)
            ->orderBy('ru.namaruangan')
            ->get();

        $dataDokter = \DB::table('pegawai_m as ru')
            ->where('ru.statusenabled', true)
            ->where('ru.objectjenispegawaifk', 1)
            ->orderBy('ru.namalengkap')
            ->get();
        foreach ($dataInstalasi as $item) {
            $detail = [];
            foreach ($dataRuangan as $item2) {
                if ($item->id == $item2->objectdepartemenfk) {
                    $detail[] = array(
                        'id' => $item2->id,
                        'ruangan' => $item2->namaruangan,
                    );
                }
            }

            $dataDepartemen[] = array(
                'id' => $item->id,
                'departemen' => $item->namadepartemen,
                'ruangan' => $detail,
            );
        }
        $dataKelompok = \DB::table('kelompokpasien_m as kp')
            ->select('kp.id', 'kp.kelompokpasien')
            ->where('kp.statusenabled', true)
            ->orderBy('kp.kelompokpasien')
            ->get();

        $dataKelas = \DB::table('kelas_m as kl')
            ->select('kl.id', 'kl.reportdisplay','kl.namakelas')
            ->where('kl.statusenabled', true)
            ->orderBy('kl.namakelas')
            ->get();

        $pembatalan = \DB::table('pembatal_m as p')
            ->select('p.id', 'p.name')
            ->where('p.statusenabled', true)
            ->orderBy('p.name')
            ->get();

        $kdPelayananRanap = \DB::table('settingdatafixed_m as p')
            ->select('p.nilaifield')
            ->where('p.statusenabled', true)
            ->where('p.namafield','kddeptlayananRI')
            ->first();

        $kdPelayananOk = \DB::table('settingdatafixed_m as p')
            ->select('p.nilaifield')
            ->where('p.statusenabled', true)
            ->where('p.namafield','KdPelayananOk')
            ->first();

        $dataKelompokTanpaUmum = \DB::table('kelompokpasien_m as kp')
            ->select('kp.id', 'kp.kelompokpasien')
            ->where('kp.statusenabled', true)
            ->where('kp.id', '<>', 1)
            ->orderBy('kp.kelompokpasien')
            ->get();

        $result = array(
            'departemen' => $dataDepartemen,
            'kelompokpasien' => $dataKelompok,
            'dokter' => $dataDokter,
            'datalogin' => $dataLogin,
            'kelas' => $dataKelas,
            'darah' => $darah,
            'dept' => $dept,
            'ruanganRi' => $ruanganRi,
            'deptrirj' => $deptRajalInap,
            'ruanganall' => $dataRuangan,
            'pembatalan' => $pembatalan,
            'deptt' => $departemen,
//            'rekanan' => $dataRekanan,
            'kelompokpasiensatu' => $dataKelompokTanpaUmum,
            'kddeptlayananranap' => $kdPelayananRanap,
            'kddeptlayananok' => $kdPelayananOk,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }

    public function getDaftarPasienInformasiTanggungan(Request $request)
    {
          $kdProfile = $this->getDataKdProfile($request);

        $data  = \DB::table('settingdatafixed_m')
            ->select('namafield','nilaifield')
            ->where('keteranganfungsi','inacbg')
            ->get();
        foreach ($data as $item){
            if ($item->namafield == 'codernik'){
                $codernik = $item->nilaifield;
            }
            if ($item->namafield == 'key'){
                $key = $item->nilaifield;
            }
            if ($item->namafield == 'url'){
                $url = $item->nilaifield;
            }
            if ($item->namafield == 'kodetarif'){
                $kodetarif = $item->nilaifield;
            }
        }

        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->join('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->join('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            // ->leftJoin('strukpelayanan_t as sp', 'sp.norec', '=', 'pd.nostruklastfk')
            // ->leftJoin('strukbuktipenerimaan_t as sbm', 'sbm.norec', '=', 'pd.nosbmlastfk')
            // ->leftjoin('loginuser_s as lu', 'lu.id', '=', 'sbm.objectpegawaipenerimafk')
            // ->leftjoin('pegawai_m as pgs', 'pgs.id', '=', 'lu.objectpegawaifk')
            ->join('pemakaianasuransi_t as pas', 'pas.noregistrasifk', '=', 'pd.norec')
            ->join('asuransipasien_m as asu', 'asu.id', '=', 'pas.objectasuransipasienfk')
            ->join('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
            ->join('kelas_m as kls2', 'kls2.id', '=', 'asu.objectkelasdijaminfk')
            // ->leftjoin('batalregistrasi_t as br', 'br.pasiendaftarfk', '=', 'pd.norec')
            ->leftjoin('informasitanggungansementara_t as hg', 'hg.noregistrasifk', '=', 'pd.norec')
//            ->leftjoin('diagnosaberatbadanbayi_t as dbb', 'dbb.noregistrasifk', '=', 'pd.norec')
            // ->leftjoin('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
            ->select('pd.norec', 'pd.tglregistrasi', 'ps.nocm', 'pd.noregistrasi', 'ru.namaruangan', 'ps.namapasien', 'kp.kelompokpasien',
                'pd.tglpulang', 'pd.statuspasien',
                 // 'sp.nostruk', 'sbm.nosbm', 
                 'pg.id as pgid', 'pg.namalengkap as namadokter',
                // 'pgs.namalengkap as kasir',
                'pd.objectruanganlastfk as ruanganid','pas.nosep','pas.norec as norec_pa',
                // 'br.norec as norec_br',
                'pas.nokepesertaan','ps.tgllahir','ps.objectjeniskelaminfk','dept.id as deptid','kls.nourut as nokelasdaftar','kls2.nourut as nokelasdijamin',
                'kls.reportdisplay as namakelasdaftar','kls2.reportdisplay as namakelas','pd.objectstatuspulangfk','hg.totalpiutangpenjamin','hg.biayanaikkelas'
                // ,
//                'dbb.beratbadan',
                // 'rk.id as idrekanan'
            )
            // ->whereNull('br.norec')
            ->where('pd.statusenabled',true)
            ->where('pas.nosep','<>','')
            ->whereNotNull('pas.nosep')
            ->where('pd.kdprofile',$kdProfile);
            // ->whereNull('pd.tglpulang');

        $filter = $request->all();
        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $tgl = $filter['tglAkhir'];//." 23:59:59";
            $data = $data->where('pd.tglregistrasi', '<=', $tgl);
        }
        if (isset($filter['deptId']) && $filter['deptId'] != "" && $filter['deptId'] != "undefined") {
            $data = $data->where('dept.id', '=', $filter['deptId']);
        }
        if (isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined") {
            $data = $data->where('ru.id', '=', $filter['ruangId']);
        }
        if (isset($filter['kelId']) && $filter['kelId'] != "" && $filter['kelId'] != "undefined") {
            $arr = explode(',',$filter['kelId']);

            $kode = [];
            foreach ($arr as $itm){
                $kode[]= $itm;
            }

            $data = $data->whereIn('kp.id', $kode);
        }
        if (isset($filter['dokId']) && $filter['dokId'] != "" && $filter['dokId'] != "undefined") {
            $data = $data->where('pg.id', '=', $filter['dokId']);
        }
        if (isset($filter['sttts']) && $filter['sttts'] != "" && $filter['sttts'] != "undefined") {
            $data = $data->where('pd.statuspasien', '=', $filter['sttts']);
        }
        if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', 'ilike', '%' . $filter['noreg'] . '%');
        }
        if (isset($filter['norm']) && $filter['norm'] != "" && $filter['norm'] != "undefined") {
            $data = $data->where('ps.nocm', 'ilike', '%' . $filter['norm'] . '%');
        }
        if (isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $data = $data->where('ps.namapasien', 'ilike', '%' . $filter['nama'] . '%');
        }
        if (isset($filter['nosep']) && $filter['nosep'] != "" && $filter['nosep'] != "undefined") {
            $data = $data->where('pas.nosep', '=', $filter['nosep']);
        }
        if (isset($filter['kelasId']) && $filter['kelasId'] != "" && $filter['kelasId'] != "undefined") {
            $data = $data->where('kls.id', '=', $filter['kelasId']);
        }
        if (isset($filter['jmlRows']) && $filter['jmlRows'] != "" && $filter['jmlRows'] != "undefined") {
            $data = $data->take( $filter['jmlRows']);
        }

        // $data = $data->orderBy('pd.noregistrasi');

        $data = $data->get();
        $norecPd = '';
        $norecPdArr=[];
        foreach ($data as $ob){
            $norecPd = $norecPd.",'".$ob->norec . "'";
            $norecPdArr []= $ob->norec;
        }
        $norecPd = substr($norecPd, 1, strlen($norecPd)-1);
        // return($data);
        // die();
        $i = 0 ;
        $dtdt = '';
      
        $diagnosa = [];
        $dataDiagnosa = \DB::table('detaildiagnosapasien_t as dp')
            ->join('diagnosa_m as dg', 'dg.id', '=', 'dp.objectdiagnosafk')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'dp.noregistrasifk')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->select('dg.kddiagnosa','apd.objectasalrujukanfk','pd.norec')
            ->wherein('dp.objectjenisdiagnosafk',array(1,2))
            ->where('pd.tglregistrasi', '>=', $filter['tglAwal'])
            ->where('pd.tglregistrasi', '<=', $filter['tglAkhir'])
            ->where('pd.statusenabled',true)
            ->whereIn('pd.objectkelompokpasienlastfk',$kode)
            ->where('pd.kdprofile',$kdProfile);
        if (isset($filter['jmlRows']) && $filter['jmlRows'] != "" && $filter['jmlRows'] != "undefined") {
            $dataDiagnosa = $dataDiagnosa->whereIn('pd.norec',$norecPdArr);
        }
        $dataDiagnosa = $dataDiagnosa ->get();
        foreach ($data as $item){
            $dtdt = '';
            $asalRujukan = '';

            foreach ($dataDiagnosa as $item2){
                if ($item2->norec == $data[$i]->norec){
                    $dtdt = $dtdt . '#' .  $item2->kddiagnosa;
                    $asalRujukan = $item2->objectasalrujukanfk;
                }
            }
            $data[$i]->icd10 = substr($dtdt,1,strlen($dtdt)-1);
            $data[$i]->codernik = $codernik;
            $data[$i]->objectasalrujukanfk = $asalRujukan;
            $data[$i]->kodetarif = $kodetarif;
            $i= $i + 1 ;
        }


        $i = 0 ;
        $dtdt = '';
        $dataICD9 = \DB::table('diagnosatindakanpasien_t as dpa')
            ->join('detaildiagnosatindakanpasien_t as dp', 'dpa.norec', '=', 'dp.objectdiagnosatindakanpasienfk')
            ->join('diagnosatindakan_m as dg', 'dg.id', '=', 'dp.objectdiagnosatindakanfk')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'dpa.objectpasienfk')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->select('dg.kddiagnosatindakan','pd.norec')
            //            ->where('apd.noregistrasifk',$data[$i]->norec)
            ->where('pd.tglregistrasi', '>=', $filter['tglAwal'])
            ->where('pd.tglregistrasi', '<=', $filter['tglAkhir'])
             ->where('pd.statusenabled',true)
            ->where('pd.kdprofile',$kdProfile)
            ->whereIn('pd.objectkelompokpasienlastfk',$kode);
        if (isset($filter['jmlRows']) && $filter['jmlRows'] != "" && $filter['jmlRows'] != "undefined") {
            $dataICD9 = $dataICD9->whereIn( 'pd.norec',$norecPdArr);
        }
        $dataICD9 = $dataICD9->get();
        foreach ($data as $item){
            $dtdt = '';
            foreach ($dataICD9 as $item2){
                if ($item2->norec == $data[$i]->norec) {
                    $dtdt = $dtdt . '#' . $item2->kddiagnosatindakan;
                }
            }
            $data[$i]->icd9 = substr($dtdt,1,strlen($dtdt)-1);
            $i= $i + 1 ;
        }

        $tglawalawal = $filter['tglAwal'];
        $tglakhirakhir = $filter['tglAkhir'];
        $kelompokPasien=$filter['kelId'];
        $paramNorec='';
        if (isset($filter['jmlRows']) && $filter['jmlRows'] != "" && $filter['jmlRows'] != "undefined") {
            $paramNorec = " and pd.norec in($norecPd) ";
        }
        $dataTarif16 = DB::select(DB::raw("select pd.norec, 
            sum(((pp.hargajual - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) * pp.jumlah)+ case when pp.jasa is null then 0 else pp.jasa end) as ttl,kpb.namaexternal
            from pasiendaftar_t as pd
            --inner join pasien_m as ps on ps.id = pd.nocmfk
            INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
            INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
            INNER JOIN produk_m as pr on pr.id=pp.produkfk
            INNER JOIN kelompokprodukbpjs_m as kpb on kpb.id=pr.objectkelompokprodukbpjsfk
            --INNER join kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
            INNER JOIN pemakaianasuransi_t as pa on pa.noregistrasifk=pd.norec
            where 
          
             pd.statusenabled=true
             and 
            pd.kdprofile =$kdProfile
            and
            pd.tglregistrasi >= '$tglawalawal' and pd.tglregistrasi <= '$tglakhirakhir' and pd.objectkelompokpasienlastfk in ($kelompokPasien)
            $paramNorec
            group  by pd.norec,kpb.namaexternal order by pd.norec")
        );

       
        $i = 0 ;
        $prosedur_non_bedah ='';
        $prosedur_bedah ='';
        $konsultasi ='';
        $tenaga_ahli ='';
        $keperawatan ='';
        $penunjang ='';
        $radiologi ='';
        $laboratorium ='';
        $pelayanan_darah ='';
        $rehabilitasi ='';
        $kamar ='';
        $rawat_intensif ='';
        $obat ='';
        $obat_kronis ='';
        $obat_kemoterapi ='';
        $alkes ='';
        $bmhp ='';
        $sewa_alat ='';
        $dataTotalTagihan = DB::select(DB::raw("SELECT 
             pd.norec, 
            sum((((pp.hargasatuan - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) * pp.jumlah) + case when pp.jasa is not null then pp.jasa else 0 end ) 
            -(CASE WHEN (pp.produkfk = 402611) THEN pp.hargasatuan ELSE (0) END * pp.jumlah)) as total
            FROM
            pelayananpasien_t AS pp
            INNER JOIN antrianpasiendiperiksa_t AS apd ON pp.noregistrasifk= apd.norec
            INNER JOIN pasiendaftar_t AS pd ON apd.noregistrasifk = pd.norec
            WHERE 
            pd.statusenabled=true and pd.kdprofile =$kdProfile
            and pd.tglregistrasi >= '$tglawalawal' and pd.tglregistrasi <= '$tglakhirakhir' 
            and pd.objectkelompokpasienlastfk in ($kelompokPasien)
            $paramNorec
            group by  pd.norec"));
        // dd($dataTotalTagihan);
        // $total = 0;
        // if(count($data )> 0){
        //     $total = (float) $data[0]->total;
        // }
       
        foreach ($data as $item){
            $norecpd= $data[$i]->norec;
            $data[$i]->totaltagihan = 0;//$this->getTotalBiaya($data[$i]->noregistrasi);
            foreach ($dataTotalTagihan as $itmTagihan){
                if ($itmTagihan->norec == $norecpd){
                    $data[$i]->totaltagihan = (float) $itmTagihan->total;;
                }
            }
         
            foreach ($dataTarif16 as $itm){
                if ($itm->norec == $norecpd){
                    if ($itm->namaexternal == 'prosedur_non_bedah'){
                        $prosedur_non_bedah = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'prosedur_bedah'){
                        $prosedur_bedah = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'konsultasi'){
                        $konsultasi = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'tenaga_ahli'){
                        $tenaga_ahli = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'keperawatan'){
                        $keperawatan = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'penunjang'){
                        $penunjang = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'radiologi'){
                        $radiologi = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'laboratorium'){
                        $laboratorium = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'pelayanan_darah'){
                        $pelayanan_darah = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'rehabilitasi'){
                        $rehabilitasi = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'kamar'){
                        $kamar = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'rawat_intensif'){
                        $rawat_intensif = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'obat'){
                        $obat = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'obat_kronis'){
                        $obat_kronis = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'obat_kemoterapi'){
                        $obat_kemoterapi = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'alkes'){
                        $alkes = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'bmhp'){
                        $bmhp = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'sewa_alat'){
                        $sewa_alat = (float)$itm->ttl;
                    }
                }
            }

            $datatatat = array(
                'prosedur_non_bedah' => (float)$prosedur_non_bedah,
                'prosedur_bedah' => (float)$prosedur_bedah,
                'konsultasi' => (float)$konsultasi,
                'tenaga_ahli' => (float)$tenaga_ahli,
                'keperawatan' => (float)$keperawatan,
                'penunjang' => (float)$penunjang,
                'radiologi' => (float)$radiologi,
                'laboratorium' => (float)$laboratorium,
                'pelayanan_darah' => (float)$pelayanan_darah,
                'rehabilitasi' => (float)$rehabilitasi,
                'kamar' => (float)$kamar,
                'rawat_intensif' => (float)$rawat_intensif,
                'obat' => (float)$obat,
                'obat_kronis' => (float)$obat_kronis,
                'obat_kemoterapi' => (float)$obat_kemoterapi,
                'alkes' => (float)$alkes,
                'bmhp' => (float)$bmhp,
                'sewa_alat' => (float)$sewa_alat,
            );
            $prosedur_non_bedah =0;
            $prosedur_bedah =0;
            $konsultasi =0;
            $tenaga_ahli =0;
            $keperawatan =0;
            $penunjang =0;
            $radiologi =0;
            $laboratorium =0;
            $pelayanan_darah =0;
            $rehabilitasi =0;
            $kamar =0;
            $rawat_intensif =0;
            $obat =0;
            $obat_kronis =0;
            $obat_kemoterapi =0;
            $alkes =0;
            $bmhp =0;
            $sewa_alat =0;
            $data[$i]->tarif_rs = $datatatat;

            $i= $i + 1 ;
        }
         // for ($i = count($data) - 1; $i >= 0; $i--) {
         //       if($request['diagnosa'] == 'true' && $data[$i]->icd10 == false){
         //            array_splice($data,$i,1);
         //        }
           
         //  }
            return $this->respond($data);

    }
    protected  function getTotalBiaya ($noregis){
        $data = DB::select(DB::raw("SELECT 
            sum((((pp.hargasatuan - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) * pp.jumlah) + case when pp.jasa is not null then pp.jasa else 0 end ) 
            -(CASE WHEN (pp.produkfk = 402611) THEN pp.hargasatuan ELSE (0) END * pp.jumlah)) as total
            FROM
            pelayananpasien_t AS pp
            INNER JOIN antrianpasiendiperiksa_t AS apd ON pp.noregistrasifk= apd.norec
            INNER JOIN pasiendaftar_t AS pd ON apd.noregistrasifk = pd.norec
            WHERE pd.noregistrasi='$noregis'
            and pd.statusenabled=true"));
        $total = 0;
        if(count($data )> 0){
            $total = (float) $data[0]->total;
        }
        return $total;
    }
    protected  function getTotalBiayaRS ($norec_pd){
        $data = DB::select(DB::raw("SELECT 
            sum((((pp.hargasatuan - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) * pp.jumlah) + case when pp.jasa is not null then pp.jasa else 0 end ) 
            -(CASE WHEN (pp.produkfk = 402611) THEN pp.hargasatuan ELSE (0) END * pp.jumlah)) as total
            FROM
            pelayananpasien_t AS pp
            INNER JOIN antrianpasiendiperiksa_t AS apd ON pp.noregistrasifk= apd.norec
            INNER JOIN pasiendaftar_t AS pd ON apd.noregistrasifk = pd.norec
            WHERE pd.norec='$norec_pd'"));
        $total = 0;
        if(count($data )> 0){
            $total = (float) $data[0]->total;
        }
        return $total;
    }
    public function getStatusNaikKelas(Request $request)
    {
        $data =[];
        // // foreach ($request['data'] as $items){
        //     $table = collect(DB::select("select 
        //     ru.objectdepartemenfk
        //      from pasiendaftar_t as pd 
        //     join ruangan_m as ru on ru.id = pd.objectruanganlastfk
        //     where pd.norec ='$request[noreg]'"))->first();
    
        //     $noregistrasifk= $request['noreg'];
        //     $hakkelas= $request['namakelas'];

        //     if($hakkelas=='Non Kelas'){
        //         $b=0;
        //     }else if($hakkelas=='kelas_3'){
        //         $b=1;
        //     }else if($hakkelas=='kelas_2'){
        //         $b=2;
        //     }else if($hakkelas=='kelas_1'){
        //         $b=3;
        //     }else if($hakkelas=='vip') {
        //         $b = 4;
        //     }else if($hakkelas==''){
        //         $b=0;
        //     }

        // $datas = DB::select(DB::raw("
        //   select * from ( select tglmasuk,tglkeluar,reportdisplay,	
        //     CASE antrianpasiendiperiksa_t.objectkelasfk WHEN 6 THEN  0
        //     WHEN 1 THEN  1  WHEN 2 THEN 2 WHEN 3 THEN 3  WHEN 4 THEN  4
        //     WHEN 7 THEN  4
        //     ELSE 1 END AS derajatkelas 
        //     from 
        //         antrianpasiendiperiksa_t
        //     INNER JOIN kelas_m ON antrianpasiendiperiksa_t.objectkelasfk = kelas_m.id
        //     where noregistrasifk ='$noregistrasifk'  ) as x where  x.derajatkelas>$b order by x.derajatkelas asc 
        //     ")
        // );

        // $datass = DB::select(DB::raw("select tglmasuk,tglkeluar from antrianpasiendiperiksa_t where objectruanganfk in ('64','65','77','78','127') and 
        //         noregistrasifk='$noregistrasifk' order by tglmasuk asc"));

        // $statusrawatintensiv='0';
        // $lamarawatintensivaa=0;
        // foreach($datass as $item){

        //     $statusrawatintensiv='1';
        //     $tglmasuk =date_format(date_create($item->tglmasuk),'Y-m-d');
        //     $tglkeluar =date_format(date_create($item->tglkeluar),'Y-m-d');
        //     if($tglmasuk==$tglkeluar){
        //         $lamarawatintensiv = '1';
        //     }else{
        //         $tglmasuk = strtotime($tglmasuk);
        //         $tglkeluar = strtotime($tglkeluar);
        //         $diffs= $tglkeluar-$tglmasuk;
        //         $dayss = floor($diffs / (3600 * 24));;
        //         $lamarawatintensiv = $dayss;

        //     }
        //     $lamarawatintensivaa= $lamarawatintensivaa + $lamarawatintensiv;
        // }

        // $statusnaikkelas='0';
        // $kelastertinggi='';
        // $lamarawatnaikkelass=0;

        // foreach($datas as $item){

        //     $statusnaikkelas = '1';

        //     $kelastertinggi = $item->reportdisplay;
        //     $tglmasuk =date_format(date_create($item->tglmasuk),'Y-m-d');
        //     $tglkeluar =date_format(date_create($item->tglkeluar),'Y-m-d');
        //     if($tglmasuk==$tglkeluar){
        //         $lamarawatnaikkelas = '1';
        //     }else{
        //         $tglmasuk = strtotime($tglmasuk);
        //         $tglkeluar = strtotime($tglkeluar);
        //         $diff= $tglkeluar-$tglmasuk;
        //         $days = floor($diff / (3600 * 24));;
        //         $lamarawatnaikkelas = $days;

        //     }
        //     $lamarawatnaikkelass= $lamarawatnaikkelass + $lamarawatnaikkelas;
        // }

        //     $data= array(
        //         // 'nosep' => $items['nosep'],
        //         'norec_pd' => $request['noreg'] ,
        //         'deptid' =>$table->objectdepartemenfk,// $items['deptid'] ,
        //         'statusnaikkelas' => $statusnaikkelas,
        //         'kelastertinggi' => $kelastertinggi,
        //         'lamarawatnaikkelas' => $lamarawatnaikkelass,
        //         'statusrawatintensiv' =>$statusrawatintensiv,
        //         'lamarawatintensiv' =>$lamarawatintensivaa,
        //     );
        // // }
        // return $this->respond($data);

        $kdProfile = $this->getDataKdProfile($request);
        $data =[];
        $ruanganintensiv  = \DB::table('settingdatafixed_m')
            ->select('namafield','nilaifield')
            ->where('keteranganfungsi','RuanganIntensiv')
            ->where('kdprofile', $kdProfile)
            ->first();
        // $norecaPd = '';
        // foreach ($request['data'] as $items){
        //     $norecaPd = $norecaPd.",'".$items['noreg']  . "'";
        // }
        // $norecaPd = substr($norecaPd, 1, strlen($norecaPd)-1);
      

        foreach ($request['data'] as $items){

            $noregistrasifk= $items['noreg'] ;//$request['noreg'];
            $hakkelas= $items['namakelas'];///$request['namakelas'];

            if($hakkelas=='Non Kelas'){
                $b=0;
            }else if($hakkelas=='kelas_3'){
                $b=1;
            }else if($hakkelas=='kelas_2'){
                $b=2;
            }else if($hakkelas=='kelas_1'){
                $b=3;
            }else if($hakkelas=='vip') {
                $b = 4;
            }else if($hakkelas==''){
                $b=0;
            }

        $datas = DB::select(DB::raw("
          select * from ( select tglmasuk,tglkeluar,reportdisplay,	
            CASE antrianpasiendiperiksa_t.objectkelasfk WHEN 6 THEN  0
            WHEN 1 THEN  1  WHEN 2 THEN 2 WHEN 3 THEN 3  WHEN 4 THEN  4
            WHEN 7 THEN  4
            ELSE 1 END AS derajatkelas 
            from 
                antrianpasiendiperiksa_t
            INNER JOIN kelas_m ON antrianpasiendiperiksa_t.objectkelasfk = kelas_m.id
            where noregistrasifk ='$noregistrasifk'  ) as x 
            where  x.derajatkelas>$b order by x.derajatkelas asc 
            ")
        );

        $datass = DB::select(DB::raw("select tglmasuk,tglkeluar 
            from antrianpasiendiperiksa_t where objectruanganfk in (". $ruanganintensiv->nilaifield .") and 
            noregistrasifk='$noregistrasifk' order by tglmasuk asc"));

        $statusrawatintensiv='0';
        $lamarawatintensivaa=0;
        foreach($datass as $item){

            $statusrawatintensiv='1';
            $tglmasuk =date_format(date_create($item->tglmasuk),'Y-m-d');
            $tglkeluar =date_format(date_create($item->tglkeluar),'Y-m-d');
            if($tglmasuk==$tglkeluar){
                $lamarawatintensiv = '1';
            }else{
                $tglmasuk = strtotime($tglmasuk);
                $tglkeluar = strtotime($tglkeluar);
                $diffs= $tglkeluar-$tglmasuk;
                $dayss = floor($diffs / (3600 * 24));;
                $lamarawatintensiv = $dayss;

            }
            $lamarawatintensivaa= $lamarawatintensivaa + $lamarawatintensiv;
        }

        $statusnaikkelas='0';
        $kelastertinggi='';
        $lamarawatnaikkelass=0;

        foreach($datas as $item){

            $statusnaikkelas = '1';

            $kelastertinggi = $item->reportdisplay;
            $tglmasuk =date_format(date_create($item->tglmasuk),'Y-m-d');
            $tglkeluar =date_format(date_create($item->tglkeluar),'Y-m-d');
            if($tglmasuk==$tglkeluar){
                $lamarawatnaikkelas = '1';
            }else{
                $tglmasuk = strtotime($tglmasuk);
                $tglkeluar = strtotime($tglkeluar);
                $diff= $tglkeluar-$tglmasuk;
                $days = floor($diff / (3600 * 24));;
                $lamarawatnaikkelas = $days;

            }
            $lamarawatnaikkelass= $lamarawatnaikkelass + $lamarawatnaikkelas;
        }

            $data []= array(
                'nosep' => $items['nosep'],
                'norec_pd' => $items['noreg'] ,
                'deptid' => $items['deptid'] ,
                'statusnaikkelas' => $statusnaikkelas,
                'kelastertinggi' => $kelastertinggi,
                'lamarawatnaikkelas' => $lamarawatnaikkelass,
                'statusrawatintensiv' =>$statusrawatintensiv,
                'lamarawatintensiv' =>$lamarawatintensivaa,
            );
        }
        return $this->respond($data);

    }

    public function saveInformasiTanggungan(Request $request)
    {
        DB::beginTransaction();
        try {
            foreach ($request['proporsi'] as $item){
                $noregistrasifk = $item['noregistrasifk'];
                $totaldijamin = $item['totalDijamin'] != '' &&  $item['totalDijamin'] !=null ?(float)$item['totalDijamin'] : 0;
                $biayanaikkelas = $item['biayaNaikkelas'] != '' &&  $item['biayaNaikkelas'] !=null ?(float) $item['biayaNaikkelas'] : 0;

                $delete = DB::table('informasitanggungansementara_t')
                    ->where("noregistrasifk",$item['noregistrasifk'])
                    ->delete();

                $new = new InformasiTanggungan();
                $new->norec =  $new->generateNewId();
                $new->noregistrasifk = $noregistrasifk;
                $new->totalbiayars = $this->getTotalBiayaRS($noregistrasifk);
                $new->totalpiutangpenjamin = $totaldijamin;
                $new->biayanaikkelas = $biayanaikkelas;
                $new->save();
            }

            $transStatus = 'true';
            $transMessage = "Simpan Informasi Tanggungan";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Gagal  ";
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
                "message" => $transMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveProposiBridgingINACBG(Request $request)
    {
        DB::beginTransaction();
        // try {


            $noregistrasifk=$request['noregistrasifk'];
            $totaldijamin=$request['totalDijamin'];
            $biayanaikkelas=$request['biayaNaikkelas'];
            $b="";
            $c="";
            $d=[];
            $delete = DB::table('hasilgrouping_t')
                ->where("noregistrasifk",$request['noregistrasifk'])
                ->delete();



            $noregistrasifk_apd = AntrianPasienDiperiksa::where('noregistrasifk', $request['noregistrasifk'])->first();
            $noregistrasifk_apd=$noregistrasifk_apd['norec'];
            //     return($noregistrasifk_apd);
            //    die();
            $TotalBiayaRS = DB::select(DB::raw("select sum(pelayananpasien_t.hargasatuan) as totalbiayars
            FROM pasiendaftar_t INNER JOIN antrianpasiendiperiksa_t ON pasiendaftar_t.norec = antrianpasiendiperiksa_t.noregistrasifk INNER JOIN pelayananpasien_t ON antrianpasiendiperiksa_t.norec = pelayananpasien_t.noregistrasifk
            where pasiendaftar_t.norec = '$noregistrasifk'")
            );


            foreach ($TotalBiayaRS as $item){
                $TotalBiayaRS = $item->totalbiayars;

            }

            $totalpertindakan = PelayananPasien::select('pelayananpasien_t.norec',
                DB::raw('CASE WHEN hargasatuan <> 0 THEN hargasatuan * jumlah ELSE 0 END AS totalbiayapertindakan'),
                'pelayananpasien_t.noregistrasifk', 'pelayananpasien_t.piutangpenjamin')
            ->join("antrianpasiendiperiksa_t", "pelayananpasien_t.noregistrasifk", "=", "antrianpasiendiperiksa_t.norec")
            ->join("pasiendaftar_t", "antrianpasiendiperiksa_t.noregistrasifk", "=", "pasiendaftar_t.norec")
            ->where("pasiendaftar_t.norec", $noregistrasifk)
            ->get();

            foreach ($totalpertindakan->chunk(1000) as $chunk) {
                $cases = [];
                $ids = [];
                $params = [];

                foreach ($chunk as $item){
                    $proporsipertindakan = ((float)$totaldijamin/(float)$TotalBiayaRS)*(float)$item->totalbiayapertindakan;
                    $cases[] = "WHEN '{$item->norec}' then ". $proporsipertindakan;
                    // $params[] =  $proporsipertindakan;
                    $ids[] = "'".$item->norec."'";
                }
                $ids = implode(',', $ids);
                $cases = implode(' ', $cases);

                if (!empty($ids)) {
                    DB::update("UPDATE pelayananpasien_t SET piutangpenjamin = CASE norec {$cases} END WHERE norec in ({$ids})");
                }
            }
            
            $new = new HasilGrouping();
            $new->norec =  $new->generateNewId();
            $new->noregistrasifk = $noregistrasifk;
            $new->totalbiayars = $TotalBiayaRS;
            $new->totalpiutangpenjamin = $totaldijamin;
            $new->biayanaikkelas = $biayanaikkelas;
            // $new->response = json_encode($response);
            $new->tglgrouping = date('Y-m-d H:i');
            // if(isset($request['special_cmg'])) {
            //     $new->special_cmg = $request['special_cmg'];
            // }
            // return($newRujukan);
            // die();
            $new->save();

            $transStatus = 'true';
            $transMessage = "Simpan Proposi Berhasil...! ";
        // } catch (\Exception $e) {
        //     $transStatus = 'false';
        //     $transMessage = "Gagal Simpan Data ...! ";
        // }

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
                "e" => $e->getMessage(),
                "message" => $transMessage,
            );
        }

        // return 'sukses';
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDaftarPasienRev(Request $request)
    {
        $kdProfile = (int)$this->getDataKdProfile($request);
        $deptRanap = explode (',',$this->settingDataFixed('kdDepartemenRanapFix',$kdProfile));
        $number = 1000;
        // ini_set('max_execution_time',$number);
        $kdDepartemenRawatInap = [];
        foreach ($deptRanap as $itemRanap){
            $kdDepartemenRawatInap []=  (int)$itemRanap;
        }
        $data  = \DB::table('settingdatafixed_m')
            ->select('namafield','nilaifield')
            ->where('keteranganfungsi','inacbg')
            ->where('kdprofile', $kdProfile)
            ->get();
        foreach ($data as $item){
            if ($item->namafield == 'codernik'){
                $codernik = $item->nilaifield;
            }
            if ($item->namafield == 'key'){
                $key = $item->nilaifield;
            }
            if ($item->namafield == 'url'){
                $url = $item->nilaifield;
            }
            if ($item->namafield == 'kodetarif'){
                $kodetarif = $item->nilaifield;
            }
        }

        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->join('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftJoin('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            // ->join('antrianpasiendiperiksa_t as apd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->join(DB::raw('antrianpasiendiperiksa_t as apd'), function ($join) {
                $join->on('apd.noregistrasifk', '=', 'pd.norec')
                     ->on('apd.objectruanganfk', '=', 'pd.objectruanganlastfk')
                     ->on('apd.tglkeluar','=','pd.tglpulang');
            })
            ->leftjoin('asalrujukan_m as asl', 'asl.id', '=', 'apd.objectasalrujukanfk')
            ->leftjoin('pemakaianasuransi_t as pas', 'pas.noregistrasifk', '=', 'pd.norec')
            ->leftJoin('asuransipasien_m as asu', function ($join) {
                $join->on('asu.noasuransi', '=', 'ps.nobpjs')
                    ->on('asu.nocmfk','=','ps.id')
                     ->where('asu.statusenabled','=', true);
                })
            ->leftjoin('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
            ->leftjoin('kelas_m as kls3', 'kls3.id', '=', 'pd.objectkelasfk')
            ->leftjoin('kelas_m as kls2', 'kls2.id', '=', 'asu.objectkelasdijaminfk')
            ->leftjoin('hasilgrouping_t as hg', 'hg.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
            ->leftjoin('apgarscore_t as aps', 'aps.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('statuspulang_m as stp', 'stp.id', '=', 'pd.objectstatuspulangfk')
            ->leftJoin('tempattidur_m as tt','tt.id','=','apd.nobed')
            ->leftjoin('dokklaim_t as dok','dok.noregistrasifk','=','pd.norec')
            ->leftjoin('dokklaim_m as dkm','dkm.id','=','dok.documentklaimfk')
            ->distinct()
            ->select('pd.norec', 'pd.tglregistrasi', 'ps.nocm', 'pd.noregistrasi', 'ru.namaruangan', 'ps.namapasien', 'kp.kelompokpasien', 'pd.dializer_use',
                'pd.tglpulang', 'pd.statuspasien','apd.norec as norec_apd', 'stp.namaexternal as statuspulang', 'usiakehamilan','gravida','partus','abortus','tt.reportdisplay as nobed',
                'pd.pegawaikirim','pd.pegawaisimpan','pd.pegawaigrouper','pd.pegawaifinalklaim','pd.pegeditklaim', 'pd.tgledit','pd.tglklaim',
                'pg.id as pgid', 'pg.namalengkap as namadokter','kp.id as kpid', 'asl.caramasuk_inacbg','stp.kodeexternal', 'ru.objectdepartemenfk', 'hg.special_cmg', 'hg.response', 'dp.namadepartemen', 'pd.catatanklaim',
                'pd.objectruanganlastfk as ruanganid',DB::raw("case when pas.nosep is null then '-' else pas.nosep end as nosep"),'pas.norec as norec_pa', DB::raw("null as los, null as jam"),
                DB::raw(" EXTRACT ( YEAR FROM AGE( pd.tglregistrasi, ps.tgllahir ) )|| ' Tahun ' as umur"),
                'ps.nobpjs as nokepesertaan','ps.tgllahir','ps.objectjeniskelaminfk','dept.id as deptid',DB::RAW('CASE WHEN kls.nourut is null then kls3.nourut ELSE kls.nourut END as nokelasdaftar'), DB::raw("Case When kls2.nourut is null Then kls.nourut ELSE kls2.nourut END as nokelasdijamin"),
                DB::raw('CASE WHEN kls.reportdisplay is null then kls3.reportdisplay ELSE kls.reportdisplay END as namakelasdaftar'),'kls2.reportdisplay as namakelas','pd.objectstatuspulangfk','pd.icd10',
                'hg.biayanaikkelas','rk.id as idrekanan','hg.status as statusgrouping','pas.statuscovid','ps.noidentitas',
                'aps.1menit_appear as menit1_appear','aps.1menit_pulse as menit1_pulse','aps.1menit_grimace as menit1_grimace','aps.1menit_activity as menit1_activity','aps.1menit_resp as menit1_resp',
                'aps.5menit_appear as menit5_appear','aps.5menit_pulse as menit5_pulse','aps.5menit_grimace as menit5_grimace','aps.5menit_activity as menit5_activity','aps.5menit_resp as menit5_resp','pd.batalklaim',
                DB::raw(" 'verifikasi'  as status, pas.loscovid,pd.statusklaim"),
                DB::raw("case when hg.totalpiutangpenjamin is null then '-1' else hg.totalpiutangpenjamin end as totalpiutangpenjamin,statuskelengkapandok, COUNT (DISTINCT dkm.namaberkas ) || ' Dokumen' as hitungdok"))
            ->where('pd.statusenabled',true)
            ->where('pd.kdprofile',$kdProfile)
            // ->where('pas.nosep','<>','')
            // ->whereNotNull('pas.nosep')
            ->whereNotNull('pd.tglpulang');


//            ->where('apd.objectruanganasalfk',null);

        $filter = $request->all();
     
        if (isset($filter['ispulang']) && $filter['ispulang'] == true) {
            if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
                $data = $data->where('pd.tglpulang', '>=', $filter['tglAwal']);
            }
        } else {
            if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
                $data = $data->where('pd.tglregistrasi', '>=', $filter['tglAwal']);
            }
        }

        if (isset($filter['ispulang']) && $filter['ispulang'] == true) {
            if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
                $tgl = $filter['tglAkhir'];//." 23:59:59";
                $data = $data->where('pd.tglpulang', '<=', $tgl);
            }
        } else {
            
            if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
                $tgl = $filter['tglAkhir'];//." 23:59:59";
                $data = $data->where('pd.tglregistrasi', '<=', $tgl);
            }

        }
        if (isset($filter['deptId']) && $filter['deptId'] != "" && $filter['deptId'] != "undefined") {
            $data = $data->where('dept.id', '=', $filter['deptId']);
        }
        if (isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined") {
            $data = $data->where('ru.id', '=', $filter['ruangId']);
        }
        if (isset($filter['dokterid']) && $filter['dokterid'] != "" && $filter['dokterid'] != "undefined") {
            $data = $data->where('pg.id', '=', $filter['dokterid']);
        }
        // if (isset($filter['kelId']) && $filter['kelId'] != "" && $filter['kelId'] != "undefined") {
        //     if($filter['kelId'] == 2){
        //         $data = $data->where('pas.nosep','<>','');
        //         $data = $data->whereNotNull('pas.nosep');
        //     }
        //     $data = $data->where('kp.id', '=', $filter['kelId']);
        // }
        $paramKel  ='';
        if(isset($request['kelId']) && $request['kelId']!="" && $request['kelId']!="undefined"){
            $arrKel = explode(',',$request['kelId']) ;
            $kodeKel = [];
            foreach ( $arrKel as $item){
                $kodeKel[] = (int) $item;
            }
            $paramKel = ' and kp.id in ('.$request['kelId'].')';
            $data = $data->whereIn('kp.id',$kodeKel);
        }
        if (isset($filter['dokId']) && $filter['dokId'] != "" && $filter['dokId'] != "undefined") {
            $data = $data->where('pg.id', '=', $filter['dokId']);
        }
        if (isset($filter['sttts']) && $filter['sttts'] != "" && $filter['sttts'] != "undefined") {
            $data = $data->where('pd.statuspasien', '=', $filter['sttts']);
        }
        // $noreg = "";
        if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', 'ilike', '%' . $filter['noreg'] . '%');
            // $noreg = " AND pd.noregistrasi', 'like', '%' . $filter['noreg'] . '%";
        }
        if (isset($filter['norm']) && $filter['norm'] != "" && $filter['norm'] != " " && $filter['norm'] != "undefined") {
            $data = $data->where('ps.nocm', 'ilike', '%' . $filter['norm'] . '%');
        }
        if (isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != " " && $filter['nama'] != "undefined") {
            $data = $data->where('ps.namapasien', 'ilike', '%' . $filter['nama'] . '%');
        }
        $nosep = '';
        if (isset($filter['nosep']) && $filter['nosep'] != "" && $filter['nosep'] != " " && $filter['nosep'] != "undefined") {
            $data = $data->where('pas.nosep','ilike', '%' . $filter['nosep'].'%');
            $nosep = " AND pas.nosep ilike '%". $filter['nosep'] . "%'";
        }
        if (isset($filter['status']) && $filter['status'] != "" && $filter['status'] != "undefined") {
            $data = $data->where('pd.statusklaim', '=', $filter['status']);
        }
        if (isset($filter['pegklaim']) && $filter['pegklaim'] != "" && $filter['pegklaim'] != "undefined") {
            $data = $data->where('pd.pegawaifinalklaim', 'ilike', '%'. $filter['pegklaim'] . '%');
        }
//        if (isset($filter['jmlRows']) && $filter['jmlRows'] != "" && $filter['jmlRows'] != "undefined") {
//            $data = $data->take($filter['jmlRows']);
//        }
        $data = $data->orderBy('pd.tglregistrasi');
        $data = $data->groupBy('pd.norec','pd.tglregistrasi', 'ps.nocm', 'pd.noregistrasi', 'ru.namaruangan', 'ps.namapasien', 'kp.kelompokpasien', 'pd.dializer_use',
                                'pd.tglpulang', 'pd.statuspasien','apd.norec', 'stp.namaexternal', 'usiakehamilan','gravida','partus','abortus', 'tt.reportdisplay',
                                // 'emrdp.value',
                                'pg.id', 'pg.namalengkap','kp.id', 'asl.caramasuk_inacbg', 'pd.tglklaim','pd.tgledit', 
                                // 'pg2.namalengkap',
                                'pd.pegawaikirim','pd.pegawaisimpan','pd.pegawaigrouper','pd.pegawaifinalklaim','pd.pegeditklaim',
                                'stp.kodeexternal', 'ru.objectdepartemenfk', 'hg.special_cmg', 'hg.response', 'dp.namadepartemen',
                                'pd.objectruanganlastfk','pas.nosep','pas.norec',
                                'ps.nobpjs','ps.tgllahir','ps.objectjeniskelaminfk','dept.id',
                                'kls.nourut','kls2.nourut', 'hg.totalpiutangpenjamin','pd.icd10',
                                'kls.reportdisplay','kls2.reportdisplay','pd.objectstatuspulangfk',
                                'hg.biayanaikkelas','rk.id','hg.status','pas.statuscovid','ps.noidentitas','pd.batalklaim',
                                'aps.1menit_appear','aps.1menit_pulse','aps.1menit_grimace','aps.1menit_activity','aps.1menit_resp',
                                'aps.5menit_appear','aps.5menit_pulse','aps.5menit_grimace','aps.5menit_activity','aps.5menit_resp',
                                DB::RAW('CASE WHEN kls.nourut is null then kls3.nourut ELSE kls.nourut END , CASE WHEN kls.reportdisplay is null then kls3.reportdisplay ELSE kls.reportdisplay END'));
        $data = $data->get();

        $tglawalawal = $filter['tglAwal'];
        $tglakhirakhir = $filter['tglAkhir'];
        if (isset($filter['ispulang']) && $filter['ispulang'] == true) {
            // if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
                $periode = " and pd.tglpulang >= '$tglawalawal' and pd.tglpulang <= '$tglakhirakhir' ";

            // }
        } else {
            // if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
                $periode = " and pd.tglregistrasi >= '$tglawalawal' and pd.tglregistrasi <= '$tglakhirakhir' ";
            // }
        }

        $noreg = '';
        if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
           
            $noreg = " AND pd.noregistrasi ilike '%". $filter['noreg'] . "%'";
        }
        $VitalSign = DB::select(DB::raw("
            SELECT* FROM (
                SELECT epd.VALUE, epd.emrdfk, pd.noregistrasi,
                    ROW_NUMBER ( ) OVER ( PARTITION BY epd.emrdfk, pd.noregistrasi ORDER BY epd.tgl DESC ) AS nourut 
                    FROM emrpasiend_t AS epd
                        LEFT JOIN emrpasien_t AS ep ON ep.noemr = epd.emrpasienfk 
                        INNER JOIN pasiendaftar_t AS pd ON pd.noregistrasi = ltrim(rtrim(ep.noregistrasifk))
                        LEFT JOIN pemakaianasuransi_t as pas on pas.noregistrasifk = pd.norec
                    WHERE
                        epd.kdprofile = $kdProfile
                        AND epd.emrfk=147
                        $periode
                        $noreg
                        $nosep
                        AND ep.statusenabled = TRUE 
                    ORDER BY
                        epd.emrdfk DESC   
                    ) AS x 
                WHERE
                    x.nourut = 1 
                ORDER BY
            x.emrdfk
        "));

        // $noregistrasi = '';
        // $norecaPd = '';
        

//         $dataDiagnosa = \DB::table('detaildiagnosapasien_t as dp')
//             ->join('diagnosa_m as dg', 'dg.id', '=', 'dp.objectdiagnosafk')
//             ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'dp.noregistrasifk')
//             ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
//             ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
//             ->select('dg.kddiagnosa','apd.objectasalrujukanfk','pd.norec')
// //            ->where('apd.noregistrasifk',$data[$i]->norec)
//             ->wherein('dp.objectjenisdiagnosafk',array(7,8))
//             // ->where('pd.tglregistrasi', '>=', $filter['tglAwal'])
//             // ->where('pd.tglregistrasi', '<=', $filter['tglAkhir'])
//             ->where('pd.kdprofile',$kdProfile)
//             ->orderBy('dp.objectjenisdiagnosafk', 'asc');

//         if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
//             $dataDiagnosa = $dataDiagnosa->where('pd.noregistrasi', 'ilike', '%' . $filter['noreg'] . '%');
//         }
//         if (isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
//             $dataDiagnosa = $dataDiagnosa->where('ps.namapasien', 'ilike', '%' . $filter['nama'] . '%');
//         }
//         if (isset($filter['ispulang']) && $filter['ispulang'] == true) {
//             if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
//                 $dataDiagnosa = $dataDiagnosa->where('pd.tglpulang', '>=', $filter['tglAwal']);
                
//             }
//         } else {
//             if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
//                 $dataDiagnosa = $dataDiagnosa->where('pd.tglregistrasi', '>=', $filter['tglAwal']);
//             }
//         }

//         if (isset($filter['ispulang']) && $filter['ispulang'] == true) {
//             if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
//                 $tgl = $filter['tglAkhir'];//." 23:59:59";
//                 $dataDiagnosa = $dataDiagnosa->where('pd.tglpulang', '<=', $tgl);
//             }
//         } else {
            
//             if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
//                 $tgl = $filter['tglAkhir'];//." 23:59:59";
//                 $dataDiagnosa = $dataDiagnosa->where('pd.tglregistrasi', '<=', $tgl);
//             }

//         }
//         $dataDiagnosa=$dataDiagnosa->get();
//         // foreach ($data as $item){
           
//         // }

//         $i = 0 ;
//         $dtdt = '';
//         $dtdt1 = '';
        
//         $dataICD9 = \DB::table('diagnosatindakanpasien_t as dpa')
//             ->join('detaildiagnosatindakanpasien_t as dp', 'dpa.norec', '=', 'dp.objectdiagnosatindakanpasienfk')
//             ->join('diagnosatindakan_m as dg', 'dg.id', '=', 'dp.objectdiagnosatindakanfk')
//             ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'dpa.objectpasienfk')
//             ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
//             ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
//             ->select('dg.kddiagnosatindakan','pd.norec')
// //            ->where('apd.noregistrasifk',$data[$i]->norec)
//             // ->where('pd.tglregistrasi', '>=', $filter['tglAwal'])
//             // ->where('pd.tglregistrasi', '<=', $filter['tglAkhir'])
//             ->where('pd.kdprofile',$kdProfile);
//         if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
//             $dataICD9 = $dataICD9->where('pd.noregistrasi', 'ilike', '%' . $filter['noreg'] . '%');
//         }
//         if (isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
//             $dataICD9 = $dataICD9->where('ps.namapasien', 'ilike', '%' . $filter['nama'] . '%');
//         }

//         if (isset($filter['ispulang']) && $filter['ispulang'] == true) {
//             if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
//                 $dataICD9 = $dataICD9->where('pd.tglpulang', '>=', $filter['tglAwal']);
                
//             }
//         } else {
//             if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
//                 $dataICD9 = $dataICD9->where('pd.tglregistrasi', '>=', $filter['tglAwal']);
//             }
//         }

//         if (isset($filter['ispulang']) && $filter['ispulang'] == true) {
//             if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
//                 $tgl = $filter['tglAkhir'];//." 23:59:59";
//                 $dataICD9 = $dataICD9->where('pd.tglpulang', '<=', $tgl);
//             }
//         } else {
            
//             if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
//                 $tgl = $filter['tglAkhir'];//." 23:59:59";
//                 $dataICD9 = $dataICD9->where('pd.tglregistrasi', '<=', $tgl);
//             }

//         }

//         $dataICD9=$dataICD9->get();

        // $noregistrasi = substr($noregistrasi, 1, strlen($noregistrasi)-1);
        // $norecaPd = substr($norecaPd, 1, strlen($norecaPd)-1);

        // foreach ($data as $item){
        //     // $noregistrasi = $noregistrasi.",'".$item->noregistrasi . "'";
        //     // $norecaPd = $norecaPd.",'".$item->norec_apd . "'";
        //     $selisih = date_diff( date_create($item->tglregistrasi), date_create($item->tglpulang) );
        //     $selisih2 = strtotime($item->tglpulang) - strtotime($item->tglregistrasi);
        //     $jam   = floor($selisih2 / (60 * 60));

        //     $item->jam = $jam . ':'. $selisih->i;
        //     $item->los = $selisih->days + 1;

        //     // vitalsign 
        //     $item->response = json_decode($item->response);
        //     $item->sistole = 0;
        //     $item->diastole = 0;
        //     $item->birth_weight = 0;
        //     foreach ($VitalSign as $item2) {
        //         if($item->noregistrasi == $item2->noregistrasi) {
        //             if($item2->emrdfk == 4241) {
        //                 if(str_contains($item2->value, '/')) {
        //                     $tekanandarah = explode("/", $item2->value);
        //                     $item->sistole = is_nan((float)$tekanandarah[0]) ? 0 : (float)$tekanandarah[0];
        //                     $item->diastole = is_nan((float)$tekanandarah[1]) ? 0 : (float)$tekanandarah[1];
        //                 }
        //             }
        //             if($item2->emrdfk == 4243) {
        //                 $item->birth_weight = is_nan((float)$item2->value) ? 0 : (float)$item2->value;
        //             }
        //         }
        //     }
        // }

        // if($noregistrasi != '') { 
            $dataTotalBill = DB::select(DB::raw("
                select pd.noregistrasi, sum(((case when pp.hargajual is null then 0 else pp.hargajual  end - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) * pp.jumlah) + case when pp.jasa is null then 0 else pp.jasa end) as total
                from pasiendaftar_t as pd
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                LEFT JOIN pemakaianasuransi_t as pas on pas.noregistrasifk = pd.norec
                where pd.kdprofile = $kdProfile $periode and pp.produkfk <> 402611
                $noreg
                  $nosep
                group by pd.noregistrasi;
            "));

            $dataVerif = DB::select(DB::raw("SELECT pd.noregistrasi, pg.namalengkap as pegawaiverifikasi
                from strukpelayanan_t as sp 
                INNER JOIN pasiendaftar_t as pd on pd.norec = sp.noregistrasifk
                INNER JOIN pegawai_m as pg on pg.id = sp.objectpegawaipenerimafk 
                LEFT JOIN pemakaianasuransi_t as pas on pas.noregistrasifk = pd.norec
                WHERE sp.statusenabled = true
                and pd.kdprofile = $kdProfile
                and pd.statusenabled = true
                $periode
                $noreg
                $nosep
                order by pd.tglregistrasi, sp.tglstruk
            "));

            $statustagihan = collect(DB::select("SELECT
                pd.noregistrasi,
                pd.tglregistrasi,
                CASE
                    WHEN SUM(CASE WHEN pp.strukfk IS NULL THEN 1 ELSE 0 END) > 0 THEN 'Ada Tagihan yang Belum Diverifikasi'
                Else 
                    'Verifikasi'
                END AS keterangan
            FROM
                pasiendaftar_t AS pd
                INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
                INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
                INNER JOIN pasien_m as ps on ps.id = pd.nocmfk
                 LEFT JOIN pemakaianasuransi_t as pas on pas.noregistrasifk = pd.norec
                LEFT JOIN strukpelayanan_t AS sp ON sp.norec = pp.strukfk
            WHERE
                pd.kdprofile = $kdProfile
                $periode
                AND pp.produkfk <> 402611
                $noreg
                $nosep
            GROUP BY
                pd.noregistrasi,
                pd.tglregistrasi
                order by pd.tglregistrasi
            "));
        
            
            $deposit = DB::SELECT(DB::RAW("SELECT x.noregistrasi,x.tglregistrasi, sum(x.hargasatuan) as deposit from (select distinct
                pd.noregistrasi, pp.hargasatuan, pd.tglregistrasi, pp.norec
                from pasiendaftar_t as pd
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                INNER JOIN pasien_m as ps on ps.id = pd.nocmfk
                where pd.kdprofile = $kdProfile 
                $periode
                                AND pp.nilainormal = -1
                                AND pp.strukfk is null
                                AND produkfk = 402611
                                $noreg
                ) as x
                group by x.noregistrasi,
                        x.tglregistrasi
                                order by x.tglregistrasi
                "));

            
            $vitalSignMap = [];
            foreach ($VitalSign as $item) {
                $vitalSignMap[$item->noregistrasi][] = $item;
            }

            $totalBillMap = [];
            foreach ($dataTotalBill as $d) {
                $totalBillMap[$d->noregistrasi] = $d->total;
            }
            $totalDeposit = [];
            foreach ($deposit as $d) {
                $totalDeposit[$d->noregistrasi] = $d->deposit;
            }

            $pegVerif = [];
            foreach ($dataVerif as $d) {
                $pegVerif[$d->noregistrasi] = $d->pegawaiverifikasi;
            }

            $statusverif = [];
            foreach ($statustagihan as $d) {
                $statusverif[$d->noregistrasi] = $d->keterangan;
            }

            $kdDepartemenRawatInap = array_flip($kdDepartemenRawatInap);

            foreach ($data as $h) {
                
                $selisih = date_diff(date_create($h->tglregistrasi), date_create($h->tglpulang));
                $selisih2 = strtotime($h->tglpulang) - strtotime($h->tglregistrasi);
                $jam = floor($selisih2 / (60 * 60));
                
                $h->jam = $jam . ':' . $selisih->i;
                $h->los = $selisih->days + 1;

                $h->response = json_decode($h->response);
                $h->sistole = 0;
                $h->diastole = 0;
                $h->birth_weight = 0;

                if (isset($vitalSignMap[$h->noregistrasi])) {
                    foreach ($vitalSignMap[$h->noregistrasi] as $item2) {
                        if ($item2->emrdfk == 4241 && str_contains($item2->value, '/')) {
                            list($sistole, $diastole) = explode("/", $item2->value);
                            $h->sistole = is_nan((float)$sistole) ? 0 : (float)$sistole;
                            $h->diastole = is_nan((float)$diastole) ? 0 : (float)$diastole;
                        } elseif ($item2->emrdfk == 4243) {
                            $h->birth_weight = is_nan((float)$item2->value) ? 0 : (float)$item2->value;
                        }
                    }
                }

               
                $h->totalbiayars = isset($totalBillMap[$h->noregistrasi]) ? ceil($totalBillMap[$h->noregistrasi]) : 0;

                $h->jenis_rawat = isset($kdDepartemenRawatInap[$h->deptid]) ? 1 : 2;

                $h->codernik = $codernik;
                $h->kodetarif = $kodetarif;
                $h->deposit = isset($totalDeposit[$h->noregistrasi]) ? ceil($totalDeposit[$h->noregistrasi]) : 0;
                $h->pegverif = isset($pegVerif[$h->noregistrasi]) ? $pegVerif[$h->noregistrasi] : '-';
                $h->statusverif = isset($statusverif[$h->noregistrasi]) ? $statusverif[$h->noregistrasi] : '-';
            }

// The data array is now processed

       
        return $this->respond($data);
    }
    public function saveStatus(Request $request)
    {
        DB::beginTransaction();
        try {
            foreach ($request['data'] as $key => $value) {
               PasienDaftar::where('norec',$value['norec'])
               ->update([
                    'statusklaim' => $value['statusklaim']
               ]);
               $data = $value['statusklaim'];
            }

            $transStatus = 'true';
            $transMessage = "Sukses";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Status Gagal  ";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => $data,
                "message" => $transMessage,
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getListBerkas(Request $r){
        $data = DB::select(DB::raw("SELECT * FROM dokasuransi_m 
            where statusenabled=true 
            and kelompokpasienfk='$r[kpid]'"
        ));
        $cek = KelengkapanDokumen::where('noregistrasifk',$r['noregistrasifk'])->get();
        $res['data'] = $data;
        $res['upload'] = $cek;
        return $this->respond($res);
    }
     public function uploadBerkas(Request $request){
        // return $request;
         \DB::beginTransaction();
        $kdProfile = (int) $this->getDataKdProfile($request);
        try {
              

                $cek = KelengkapanDokumen::where('dokasuransifk',$request['dokasuransifk'])
                    ->where('noregistrasifk',$request['noregistrasifk'])
                    ->first();
                
                if(!empty( $cek)){
                       $path = public_path('berkas/berkas/'.$cek->norec.'/');

                        if (!\File::exists($path)) {
            //                abort(404);
                        }else{
                            $file = \File::deleteDirectory($path);
                        }
                    $cek = KelengkapanDokumen::where('dokasuransifk',$request['dokasuransifk'])
                    ->where('noregistrasifk',$request['noregistrasifk'])
                    ->delete();

                }    
                $new = new KelengkapanDokumen();
                $new->kdprofile = $kdProfile;
                $new->statusenabled=true;
                $new->norec = $new->generateNewId();

                $uploadedFile= $request->file('file');
                if(!empty($uploadedFile)){
                    $extensionSip = $uploadedFile->getClientOriginalExtension();
                    $filenameSip = $request['dokasuransifk'] .$request['noregistrasifk'] .'.'.$extensionSip;
                    $new->filename = $filenameSip;
                }
                $new->noregistrasifk=$request['noregistrasifk'];
                $new->dokasuransifk=$request['dokasuransifk'];
                $new->tgl =date('Y-m-d H:i:s');
              
                $new->save();
                $norec =  $new->norec ;

                if(!empty($uploadedFile)) {
                    $request->file('file')->move('berkas/inacbg/'.$norec,
                        $norec.'.'.$extensionSip);
                }

                  $c = collect(DB::select("SELECT * FROM dokasuransi_m 
                        where statusenabled=true 
                        and kelompokpasienfk=2"
                     ))->count();
                 $c2 = KelengkapanDokumen::where('noregistrasifk',$request['noregistrasifk'])
                    ->count();   
                    if($c ==$c2 ){
                        PasienDaftar::where('norec',$request['noregistrasifk'])->update(['statuskelengkapandok' => true]);
                    }else{
                         PasienDaftar::where('norec',$request['noregistrasifk'])->update(['statuskelengkapandok' => false]);
                    }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus = 'true') {
            $transMessage = "Sukses ";
            \DB::commit();
            $result = array(
                "status" => 201,
                "norec" => $new,
               
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
              
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

     public function getDataComboIna(Request $request)
    {
        $dataLogin = $request->all();
        $dataInstalasi = \DB::table('departemen_m as dp')
//            ->whereIn('dp.id', array(3, 14, 16, 17, 18, 19, 24, 25, 26, 27, 28, 35))
            ->where('dp.statusenabled', true)
            ->orderBy('dp.namadepartemen')
            ->get();

        $dataRuangan = \DB::table('ruangan_m as ru')
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();

        $dataDokter = \DB::table('pegawai_m as ru')
            ->where('ru.statusenabled', true)
            ->where('ru.objectjenispegawaifk', 1)
            ->orderBy('ru.namalengkap')
            ->get();
        foreach ($dataInstalasi as $item) {
            $detail = [];
            foreach ($dataRuangan as $item2) {
                if ($item->id == $item2->objectdepartemenfk) {
                    $detail[] = array(
                        'id' => $item2->id,
                        'ruangan' => $item2->namaruangan,
                    );
                }
            }

            $dataDepartemen[] = array(
                'id' => $item->id,
                'departemen' => $item->namadepartemen,
                'ruangan' => $detail,
            );
        }
        $dataKelompok = \DB::table('kelompokpasien_m as kp')
            ->select('kp.id', 'kp.kelompokpasien')
            ->where('kp.statusenabled', true)
            ->orderBy('kp.kelompokpasien')
            ->get();

    
        $result = array(
            'departemen' => $dataDepartemen,
            'kelompokpasien' => $dataKelompok,
            'dokter' => $dataDokter,

            'message' => 'as@epic',
        );

        return $this->respond($result);
    }
    public function getStatusUpload(Request $r){
     
        $cek = KelengkapanDokumen::where('noregistrasifk',$r['noregistrasifk'])->get();
   
        $res['upload'] = $cek;
        return $this->respond($res);
    }
    public function savePengajuanKlaim(Request $request){
        DB::beginTransaction();
        try {

            $dt=PemakaianAsuransi::where('norec', $request['norec_pa'])
                        // ->where('statusenabled')
                        ->update([
                                'nosep' => $request['claim_number'],
                                'statuscovid' => 1,
                                'loscovid' => $request['loscovid']]
                        );
            
            $transStatus = 'true';
            $transMessage = "Simpan Nomor Pengajuan Klaim Berhasil...! ";

        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Gagal Simpan Pengajuan Klaim ...! ";
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
                "message" => $transMessage,
            );
        }
             // return 'sukses';
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function simpanVerifikasiTagihanInacbg(Request $request, $noRegister)
    {   
        $kdProfile = (int) $this->getDataKdProfile($request);
        $noregistrasifk=$request['norec'];
        // return($request['jumlahBayar']);
        // die();
        $hg=HasilGrouping::where('noregistrasifk',$noregistrasifk)
                ->update([
                    'status' => "FINAL CLAIM"
                ]);
        $dataLogin = $request->all();
        // return($noRegister);
        // die();
//        return $dataLogin;
        $dataPegawaiUser = DB::select(DB::raw("select pg.id,pg.namalengkap from loginuser_s as lu
                INNER JOIN pegawai_m as pg on lu.objectpegawaifk=pg.id
                where lu.id=:idLoginUser"),
            array(
                'idLoginUser' => $dataLogin['userData']['id'],
            )
        );
        $transStatus = true;
        $transMsg = null;
        $totalBilling = 0;
        $totalDeposit = 0;
        DB::beginTransaction();

        $pasienDaftar = PasienDaftar::where('noregistrasi', $noRegister)->first();
        $pelayanan =  DB::select(DB::raw("
            select pp.* from pasiendaftar_t as pd
            inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
            INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
            where pd.noregistrasi='$noRegister' and pp.strukfk is null
              
         "));
        $pelayananDetail = $pasienDaftar->pelayanan_pasien_detail()->whereNull('strukfk')->get();

        if (count($pelayanan) == 0) {
            $transStatus = false;
            $transMsg = "Pelayanan yang dilakukan pasien tidak ada.";
        }
        
        if ($transStatus) {
            $noStruk = $this->generateCode(new StrukPelayanan, 'nostruk', 10, 'S', $kdProfile);
            $strukPelayanan = new StrukPelayanan();
            $strukPelayanan->norec = $strukPelayanan->generateNewId();
            $lastPelayanan = null;

            $sama = false;
            foreach ($pelayanan as $pel) {
                $sama = true;
                
                if ($sama == true){
                    $harga = ($pel->hargajual == null) ? 0 : $pel->hargajual;
                    $diskon = ($pel->hargadiscount == null) ? 0 : $pel->hargadiscount;
                    if ($pel->nilainormal == -1) {
                        $totalDeposit += ($harga * $pel->jumlah);
                    } else {
                        $totalBilling += (($harga - $diskon) * $pel->jumlah) + $pel->jasa;
                    }
                }
            }

           
            $totalBilling = (float)$request['jumlahBayar'];
            $strukPelayanan->kdprofile = $kdProfile;
            $strukPelayanan->nocmfk = $pasienDaftar->nocmfk;
            $strukPelayanan->noregistrasifk = $pasienDaftar->norec;
            $strukPelayanan->objectkelaslastfk = $pasienDaftar->objectkelasfk;
            $strukPelayanan->objectkelompoktransaksifk = 1;
            $strukPelayanan->objectpegawaipenerimafk = $dataPegawaiUser[0]->id;// $this->getCurrentLoginID();
            $strukPelayanan->nostruk = $noStruk;
            $strukPelayanan->totalharusdibayar = $totalBilling ;//- $totalDeposit;
            $strukPelayanan->tglstruk = $this->getDateTime();
            $strukPelayanan->objectruanganfk = $pasienDaftar->objectruanganlastfk;
          
            $strukPelayanan->save();
            
            if ($transStatus) {
                
                // $TotalBiayaPerTindakan = DB::select(DB::raw("select pelayananpasien_t.norec, CASE WHEN hargasatuan <> 0 THEN hargasatuan * jumlah ELSE 0 END AS TotalBiayaPerTindakan, pelayananpasien_t.noregistrasifk, pelayananpasien_t.piutangpenjamin
                // FROM pelayananpasien_t INNER JOIN antrianpasiendiperiksa_t ON pelayananpasien_t.noregistrasifk = antrianpasiendiperiksa_t.norec INNER JOIN pasiendaftar_t ON antrianpasiendiperiksa_t.noregistrasifk = pasiendaftar_t.norec
                // where pasiendaftar_t.noregistrasi = '$noRegister'")
                // );
                
                    // foreach ($TotalBiayaPerTindakan as $item){

                    //     PelayananPasien::where('norec', $item->norec)
                    //         ->update([
                    //                 'strukfk' => $strukPelayanan->norec]
                    //         );
                    // }

                $totalpertindakan = PelayananPasien::select('pelayananpasien_t.norec',
                DB::raw('CASE WHEN hargasatuan <> 0 THEN hargasatuan * jumlah ELSE 0 END AS TotalBiayaPerTindakan'),
                'pelayananpasien_t.noregistrasifk', 'pelayananpasien_t.piutangpenjamin')
                ->join("antrianpasiendiperiksa_t", "pelayananpasien_t.noregistrasifk", "=", "antrianpasiendiperiksa_t.norec")
                ->join("pasiendaftar_t", "antrianpasiendiperiksa_t.noregistrasifk", "=", "pasiendaftar_t.norec")
                ->where("pasiendaftar_t.noregistrasi", $noRegister)
                ->get();
    
                foreach ($totalpertindakan->chunk(1000) as $chunk) {
                    $cases = [];
                    $ids = [];
                    $params = [];
    
                    foreach ($chunk as $item){
                        $cases[] = "WHEN '{$item->norec}' then '". $strukPelayanan->norec ."'";
                        // $params[] =  $proporsipertindakan;
                        $ids[] = "'".$item->norec."'";
                    }
                    $ids = implode(',', $ids);
                    $cases = implode(' ', $cases);
    
                    if (!empty($ids)) {
                        DB::update("UPDATE pelayananpasien_t SET strukfk = CASE norec {$cases} END WHERE norec in ({$ids})");
                    }
                }
            }
        }

        if ($transStatus) {
            foreach ($pelayananDetail as $pelDel) {
                $pelDel->strukfk = $strukPelayanan->norec;
                try {
                    $pelDel->save();
                } catch (\Exception $e) {
                    $transStatus = false;
                    $transMsg = "Transaksi Gagal (insert SP)";
                    break;
                }
            }

        }
        
        $totalKlaim = (float)$request['totalKlaim'];
        if ($transStatus && $totalKlaim > 0) {
            $strukPelayanan->totalprekanan = $totalKlaim;
            if ($pasienDaftar->objectkelompokpasienlastfk == $this->getKelompokPasienPerjanjian()) {
                $rekananpenjamin_id = 0;
            } elseif ($pasienDaftar->objectkelompokpasienlastfk == 2 || $pasienDaftar->objectkelompokpasienlastfk == 4) {
                $rekananpenjamin_id = 2552;
            } else {
                $rekananpenjamin_id = 0; //masih bypass. yang kelompok pasien penjanjian diisini cuma kondisinhya jiga ada klim tapi gak penjaminnya..
            }
            $SPPenjamin = new StrukPelayananPenjamin();
            $SPPenjamin->norec = $SPPenjamin->generateNewId();
            $SPPenjamin->kdprofile = $kdProfile;
            $SPPenjamin->kdkelompokpasien = $pasienDaftar->objectkelompokpasienlastfk;
            $SPPenjamin->kdrekananpenjamin = $rekananpenjamin_id;
            $SPPenjamin->totalbiaya = $totalBilling + $totalKlaim + $totalDeposit;
            $SPPenjamin->totalsudahppenjamin = $totalKlaim; //? apa in ?
            $SPPenjamin->totalsisaharusdibayar = $totalKlaim;
            $SPPenjamin->totalppenjamin = $totalKlaim;
            $SPPenjamin->totalharusdibayar = $totalKlaim;
            $SPPenjamin->totalsudahdibayar = 0;
            $SPPenjamin->totalsudahdibebaskan = 0;
            $SPPenjamin->totalsisapiutang = $totalKlaim;
            $SPPenjamin->totaldibayarlebih = 0;
            $SPPenjamin->nostrukfk = $strukPelayanan->norec;

            $pasienDaftar->nostruklastfk = $strukPelayanan->norec;
            try {
                $SPPenjamin->save();
            } catch (\Exception $e) {
                $transStatus = false;
                $transMsg = "Transaksi Gagal (Insert SPP)";
            }

        }
        if ($transStatus) {
            $pasienDaftar->nostruklastfk = $strukPelayanan->norec;
            try {
                $pasienDaftar->save();
            } catch (\Exception $e) {
                $transStatus = false;
                $transMsg = "Transaksi Gagal (update Pdaf)";
            }
        }
        if ($transStatus) {
            try {
                $strukPelayanan->save();
            } catch (\Exception $e) {
                $transStatus = false;
                $transMsg = "Simpan Biaya Administrasi Gagal {SP}";
            }
        }

        if ($transStatus) {
            $this->setStatusCode(201);
            $transMsg = "Transaksi Berhasil";
            DB::commit();
        } else {
            $this->setStatusCode(400);
            DB::rollBack();
        }
        return $this->respond([], $transMsg);
    }

     public function saveResponseFromINACBG(Request $request) {
        $kdProfile = (int) $this->getDataKdProfile($request);

        DB::beginTransaction();
        try {
            $dataResponse = ResponseDataEklaim::where('pasiendaftarfk', $request['norec_pd'])->where('method', $request['method'])->where('nosep', $request['nosep'])->first();
            
            if(empty($dataResponse)){
                $dataResponse = new ResponseDataEklaim();
                $dataResponse->norec = $dataResponse->generateNewId();
                $dataResponse->kdprofile = $kdProfile;
                $dataResponse->statusenabled = true;
                $dataResponse->pasiendaftarfk = $request['norec_pd'];
                $dataResponse->method = $request['method'];
                $dataResponse->nosep = $request['nosep'];
            }
            
            $dataResponse->code = $request['code'];
            $dataResponse->response = $request['response'];
            $dataResponse->save();

            $transStatus = 'true';
            $transMessage = "Code ". $request['response'];
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Gagal Response E-Klaim";
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
                "message" => $transMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    // IDRG
      public function getDaftarPasienIDRG(Request $request)
    {
        $kdProfile = (int)$this->getDataKdProfile($request);
        $deptRanap = explode (',',$this->settingDataFixed('kdDepartemenRanapFix',$kdProfile));
        $number = 1000;
        ini_set('max_execution_time',$number);
        $kdDepartemenRawatInap = [];
        foreach ($deptRanap as $itemRanap){
            $kdDepartemenRawatInap []=  (int)$itemRanap;
        }
        $data  = \DB::table('settingdatafixed_m')
            ->select('namafield','nilaifield')
            ->where('keteranganfungsi','inacbg')
            ->where('kdprofile', $kdProfile)
            ->get();
        foreach ($data as $item){
            if ($item->namafield == 'codernik'){
                $codernik = $item->nilaifield;
            }
            if ($item->namafield == 'key'){
                $key = $item->nilaifield;
            }
            if ($item->namafield == 'url'){
                $url = $item->nilaifield;
            }
            if ($item->namafield == 'kodetarif'){
                $kodetarif = $item->nilaifield;
            }
        }

        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->join('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftJoin('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            // ->join('antrianpasiendiperiksa_t as apd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->join(DB::raw('antrianpasiendiperiksa_t as apd'), function ($join) {
                $join->on('apd.noregistrasifk', '=', 'pd.norec')
                     ->on('apd.objectruanganfk', '=', 'pd.objectruanganlastfk');
                    //  ->on(DB::raw('apd.tglmasuk'), '=', DB::raw('(SELECT tglmasuk FROM antrianpasiendiperiksa_t WHERE noregistrasifk = pd.norec and objectruanganfk = pd.objectruanganlastfk order by tglmasuk desc limit 1)'));
            })
            ->leftjoin('asalrujukan_m as asl', 'asl.id', '=', 'apd.objectasalrujukanfk')
            // ->leftJoin('strukpelayanan_t as sp', 'sp.norec', '=', 'pd.nostruklastfk')
            // ->leftJoin('strukbuktipenerimaan_t as sbm', 'sbm.norec', '=', 'pd.nosbmlastfk')
            // ->leftjoin('loginuser_s as lu', 'lu.id', '=', 'sbm.objectpegawaipenerimafk')
            // ->leftjoin('pegawai_m as pgs', 'pgs.id', '=', 'lu.objectpegawaifk')
            ->leftjoin('pemakaianasuransi_t as pas', 'pas.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('asuransipasien_m as asu', 'asu.noasuransi', '=', 'ps.nobpjs')
            ->leftjoin('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
            ->leftjoin('kelas_m as kls2', 'kls2.id', '=', 'asu.objectkelasdijaminfk')
            // ->leftjoin('batalregistrasi_t as br', 'br.pasiendaftarfk', '=', 'pd.norec')
            ->leftjoin('hasilgrouping_t as hg', 'hg.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('diagnosaberatbadanbayi_t as dbb', 'dbb.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
            ->leftjoin('apgarscore_t as aps', 'aps.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('statuspulang_m as stp', 'stp.id', '=', 'pd.objectstatuspulangfk')
            ->LEFTJoin ('strukverifikasi_t as sv', 'sv.norec', '=' ,'pd.closingpemeriksaanfk')
            ->LEFTJoin ('pegawai_m as pg2', 'pg2.id', '=' ,'sv.objectpegawaipjawabfk')
            // ->leftjoin('emrpasien_t as emrp',function($j){
            //     $j->on('emrp.noregistrasifk','=','pd.noregistrasi')
            //         ->where('emrp.jenisemr','=','asesmen');
            //     })
            // ->leftjoin('emrpasiend_t as emrdp',function($jn){
            //     $jn->on('emrdp.emrpasienfk','=','emrp.noemr')
            //         ->where('emrdp.emrfk','=',460006)
            //         ->where('emrdp.emrdfk','=',1001433);
            //     })
            ->leftjoin('dokklaim_t as dok','dok.noregistrasifk','=','pd.norec')
            ->distinct()
            ->select('pd.norec',  'ps.nocm', 'pd.responseeklaim', 'pd.noregistrasi', 'ru.namaruangan', 'ps.namapasien', 'kp.kelompokpasien', 'pg2.namalengkap as pebilling',
               'pd.statuspasien','apd.norec as norec_apd',  'usiakehamilan','gravida','partus','abortus',
                // 'emrdp.value as tglpulangresume','stp.namaexternal as statuspulang',
                // 'sp.nostruk', 'sbm.nosbm', 
                'pd.pegawaikirim','pd.pegawaisimpan','pd.pegawaigrouper','pd.pegawaifinalklaim','pd.pegeditklaim', 'pd.tgledit','pd.tglklaim',
                'pg.id as pgid', 'pg.namalengkap as namadokter','kp.id as kpid', 'asl.caramasuk_inacbg', 'ru.objectdepartemenfk', 'hg.special_cmg', 'hg.response', 'dp.namadepartemen',
                // 'pgs.namalengkap as kasir','stp.kodeexternal',
                'pd.objectruanganlastfk as ruanganid',DB::raw("case when pas.nosep is null then '-' else pas.nosep end as nosep"),'pas.norec as norec_pa', DB::raw("null as los, null as jam"),
                DB::raw(" EXTRACT ( YEAR FROM AGE( pd.tglregistrasi, ps.tgllahir ) )|| ' Tahun ' as umur"),
                // 'br.norec as norec_br',
                'ps.nobpjs as nokepesertaan','ps.tgllahir','ps.objectjeniskelaminfk','dept.id as deptid','kls.nourut as nokelasdaftar','kls2.nourut as nokelasdijamin',
                'kls.reportdisplay as namakelasdaftar','kls2.reportdisplay as namakelas',//'pd.objectstatuspulangfk',
                // 'ru.jenis as statuscovid',
                'hg.biayanaikkelas','dbb.beratbadan','rk.id as idrekanan','hg.status as statusgrouping','pas.statuscovid','ps.noidentitas',
                'aps.1menit_appear as menit1_appear','aps.1menit_pulse as menit1_pulse','aps.1menit_grimace as menit1_grimace','aps.1menit_activity as menit1_activity','aps.1menit_resp as menit1_resp',
                'aps.5menit_appear as menit5_appear','aps.5menit_pulse as menit5_pulse','aps.5menit_grimace as menit5_grimace','aps.5menit_activity as menit5_activity','aps.5menit_resp as menit5_resp',
                DB::raw(" 'verifikasi'  as status, pas.loscovid,pd.statusklaim"),
                DB::raw("case when hg.totalpiutangpenjamin is null then '0' else hg.totalpiutangpenjamin end as totalpiutangpenjamin,statuskelengkapandok, COUNT ( dok.* ) || ' Dokumen' as hitungdok"),
                DB::raw("to_char(pd.tglregistrasi,'YYYY-MM-DD HH24:MI') as tglregistrasi"),
                DB::raw("case when pd.objectstatuspulangfk  is null then 'Diketahui / diizinkan oleh dokter'else stp.namaexternal   end as statuspulang "),
                DB::raw("case when pd.objectstatuspulangfk  is null then '1'else pd.objectstatuspulangfk  end as objectstatuspulangfk "),
                DB::raw("case when pd.objectstatuspulangfk  is null then '1'else stp.kodeexternal   end as kodeexternal "),
                DB::raw("case when pd.statusklaim  is null then NULL when pd.statusklaim  ='new_claim' then NULL else hg.tglgrouping   end as tglgrouping "),
                DB::raw("case when pg.kdkelasdokterbpjs = 'BP'then case when pd.objectruanganlastfk = '765'then 'AP'else 'BP'end else 'AP'end as kodetarif "),
                DB::raw("to_char(pd.tglpulang,'YYYY-MM-DD HH24:MI') as tglpulang"))
            ->where('pd.statusenabled',true)
            ->where('pd.kdprofile',$kdProfile)
            // ->where('pas.nosep','<>','')
            // ->whereNotNull('pas.nosep')
            ->whereNotNull('pd.tglpulang');


//            ->where('apd.objectruanganasalfk',null);

        $filter = $request->all();
     
        if (isset($filter['ispulang']) && $filter['ispulang'] == true) {
            if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
                $data = $data->where('pd.tglpulang', '>=', $filter['tglAwal']);
            }
        } else {
            if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
                $data = $data->where('pd.tglregistrasi', '>=', $filter['tglAwal']);
            }
        }

        if (isset($filter['ispulang']) && $filter['ispulang'] == true) {
            if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
                $tgl = $filter['tglAkhir'];//." 23:59:59";
                $data = $data->where('pd.tglpulang', '<=', $tgl);
            }
        } else {
            
            if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
                $tgl = $filter['tglAkhir'];//." 23:59:59";
                $data = $data->where('pd.tglregistrasi', '<=', $tgl);
            }

        }
        if (isset($filter['deptId']) && $filter['deptId'] != "" && $filter['deptId'] != "undefined") {
            $data = $data->where('dept.id', '=', $filter['deptId']);
        }
        if (isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined") {
            $data = $data->where('ru.id', '=', $filter['ruangId']);
        }
        if (isset($filter['dokterid']) && $filter['dokterid'] != "" && $filter['dokterid'] != "undefined") {
            $data = $data->where('pg.id', '=', $filter['dokterid']);
        }
        // if (isset($filter['kelId']) && $filter['kelId'] != "" && $filter['kelId'] != "undefined") {
        //     if($filter['kelId'] == 2){
        //         $data = $data->where('pas.nosep','<>','');
        //         $data = $data->whereNotNull('pas.nosep');
        //     }
        //     $data = $data->where('kp.id', '=', $filter['kelId']);
        // }
        $paramKel  ='';
        if(isset($request['kelId']) && $request['kelId']!="" && $request['kelId']!="undefined"){
            $arrKel = explode(',',$request['kelId']) ;
            $kodeKel = [];
            foreach ( $arrKel as $item){
                $kodeKel[] = (int) $item;
            }
            $paramKel = ' and kp.id in ('.$request['kelId'].')';
            $data = $data->whereIn('kp.id',$kodeKel);
        }
        if (isset($filter['dokId']) && $filter['dokId'] != "" && $filter['dokId'] != "undefined") {
            $data = $data->where('pg.id', '=', $filter['dokId']);
        }
        if (isset($filter['sttts']) && $filter['sttts'] != "" && $filter['sttts'] != "undefined") {
            $data = $data->where('pd.statuspasien', '=', $filter['sttts']);
        }
        // $noreg = "";
        if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', 'ilike', '%' . $filter['noreg'] . '%');
            // $noreg = " AND pd.noregistrasi', 'like', '%' . $filter['noreg'] . '%";
        }
        if (isset($filter['norm']) && $filter['norm'] != "" && $filter['norm'] != "undefined") {
            $data = $data->where('ps.nocm', 'ilike', '%' . $filter['norm'] . '%');
        }
        if (isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $data = $data->where('ps.namapasien', 'ilike', '%' . $filter['nama'] . '%');
        }
        if (isset($filter['nosep']) && $filter['nosep'] != "" && $filter['nosep'] != "undefined") {
            $data = $data->where('pas.nosep','ilike', '%' . $filter['nosep'].'%');
        }
        if (isset($filter['status']) && $filter['status'] != "" && $filter['status'] != "undefined") {
            $data = $data->where('pd.statusklaim', '=', $filter['status']);
        }
        if (isset($filter['pegklaim']) && $filter['pegklaim'] != "" && $filter['pegklaim'] != "undefined") {
            $data = $data->where('pd.pegawaifinalklaim', 'ilike', '%'. $filter['pegklaim'] . '%');
        }
//        if (isset($filter['jmlRows']) && $filter['jmlRows'] != "" && $filter['jmlRows'] != "undefined") {
//            $data = $data->take($filter['jmlRows']);
//        }
        $data = $data->orderBy('pd.noregistrasi');
        $data = $data->groupBy('pd.norec','pd.tglregistrasi', 'ps.nocm', 'pd.noregistrasi', 'ru.namaruangan', 'ps.namapasien', 'kp.kelompokpasien',
                                'pd.tglpulang', 'pd.statuspasien','apd.norec', 'stp.namaexternal', 'usiakehamilan','gravida','partus','abortus',
                                // 'emrdp.value',
                                'pg.id', 'pg.namalengkap','kp.id', 'asl.caramasuk_inacbg', 'pd.tglklaim','pd.tgledit', 'pg2.namalengkap',
                                'pd.pegawaikirim','pd.pegawaisimpan','pd.pegawaigrouper','pd.pegawaifinalklaim','pd.pegeditklaim',
                                'stp.kodeexternal', 'ru.objectdepartemenfk', 'hg.tglgrouping', 'hg.special_cmg', 'hg.response', 'dp.namadepartemen',
                                'pd.objectruanganlastfk','pas.nosep','pas.norec',
                                'ps.nobpjs','ps.tgllahir','ps.objectjeniskelaminfk','dept.id',
                                'kls.nourut','kls2.nourut', 'hg.totalpiutangpenjamin',
                                'kls.reportdisplay','kls2.reportdisplay','pd.objectstatuspulangfk',
                                'hg.biayanaikkelas','dbb.beratbadan','rk.id','hg.status','pas.statuscovid','ps.noidentitas',
                                'aps.1menit_appear','aps.1menit_pulse','aps.1menit_grimace','aps.1menit_activity','aps.1menit_resp',
                                'aps.5menit_appear','aps.5menit_pulse','aps.5menit_grimace','aps.5menit_activity','aps.5menit_resp','ru.kodekelasbpjs');
        $data = $data->get();

        foreach ($data as $key => $d) {
            $selisih = date_diff( date_create($d->tglregistrasi), date_create($d->tglpulang) );
            $selisih2 = strtotime($d->tglpulang) - strtotime($d->tglregistrasi);
            $jam   = floor($selisih2 / (60 * 60));

            $d->jam = $jam . ':'. $selisih->i;
            $d->los = $selisih->days + 1;
        }

        $noregistrasi = '';
        $norecaPd = '';
        foreach ($data as $item){
            $noregistrasi = $noregistrasi.",'".$item->noregistrasi . "'";
            $norecaPd = $norecaPd.",'".$item->norec_apd . "'";
        }
        $noregistrasi = substr($noregistrasi, 1, strlen($noregistrasi)-1);
        $norecaPd = substr($norecaPd, 1, strlen($norecaPd)-1);

        if($noregistrasi != '') { 
            $dataTotalBill = DB::select(DB::raw("
                select pd.noregistrasi, sum(((case when pp.hargajual is null then 0 else pp.hargajual  end - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) * pp.jumlah) + case when pp.jasa is null then 0 else pp.jasa end) as total
                from pasiendaftar_t as pd
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                where pd.kdprofile = $kdProfile and pd.noregistrasi in ($noregistrasi) and pp.produkfk not in (402611)
                group by pd.noregistrasi;
            "));
            $i = 0;
            foreach ($data as $h){
                $data[$i]->totalbiayars = 0;
                foreach ($dataTotalBill as $d){
                    if($data[$i]->noregistrasi == $d->noregistrasi){
                       $data[$i]->totalbiayars = ceil($d->total);
                    }
                }
                $i++;
            }
        }

        $i = 0 ;
        $dtdt = '';
        $tglawalawal = $filter['tglAwal'];
        $tglakhirakhir = $filter['tglAkhir'];
        if (isset($filter['ispulang']) && $filter['ispulang'] == true) {
            // if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
                $periode = " and pd.tglpulang >= '$tglawalawal' and pd.tglpulang <= '$tglakhirakhir' ";
                
            // }
        } else {
            // if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
                $periode = " and pd.tglregistrasi >= '$tglawalawal' and pd.tglregistrasi <= '$tglakhirakhir' ";
            // }
        }

        $VitalSign = DB::select(DB::raw("
            SELECT* FROM (
                SELECT epd.VALUE, epd.emrdfk, pd.noregistrasi,
                    ROW_NUMBER ( ) OVER ( PARTITION BY epd.emrdfk, pd.noregistrasi ORDER BY epd.tgl DESC ) AS nourut 
                    FROM emrpasiend_t AS epd
                        LEFT JOIN emrpasien_t AS ep ON ep.noemr = epd.emrpasienfk 
                        INNER JOIN pasiendaftar_t AS pd ON pd.noregistrasi = ltrim(rtrim(ep.noregistrasifk))
                    WHERE
                        epd.kdprofile = $kdProfile
                        AND epd.emrfk=147
                        $periode
                        AND ep.statusenabled = TRUE 
                    ORDER BY
                        epd.emrdfk DESC   
                    ) AS x 
                WHERE
                    x.nourut = 1 
                ORDER BY
            x.emrdfk
        "));


         $ventilator = DB::select(DB::raw("
                SELECT x.noregistrasifk, '1' as use_ind,case when x.ventilator_hour<1 then 1 ELSE x.ventilator_hour end as ventilator_hour, x.stop_dttm,x.start_dttm FROM(SELECT ep.noregistrasifk,epd.emrpasienfk, EXTRACT(HOUR FROM (lps.stop_dttm::TIMESTAMP - epd.value::TIMESTAMP)) AS ventilator_hour, epd.value as start_dttm,lps.stop_dttm FROM emrpasiend_t as epd
                INNER JOIN (SELECT emrpasienfk,
                 value as stop_dttm FROM emrpasiend_t 
                WHERE emrfk = 291042 and emrdfk in (318182)) as lps ON lps.emrpasienfk = epd.emrpasienfk
                INNER JOIN emrpasien_t as ep on ep.noemr = epd.emrpasienfk
                WHERE epd.emrfk = 291042 and epd.emrdfk in (318179)) as x 
        "));

       

        foreach($data as $item) {
            $item->response = json_decode($item->response);
            $item->sistole = 0;
            $item->diastole = 0;
            $item->birth_weight = 0;
            foreach ($VitalSign as $item2) {
                if($item->noregistrasi == $item2->noregistrasi) {
                    if($item2->emrdfk == 4241) {
                        if(str_contains($item2->value, '/')) {
                            $tekanandarah = explode("/", $item2->value);
                            $item->sistole = is_nan((float)$tekanandarah[0]) ? 0 : (float)$tekanandarah[0];
                            $item->diastole = is_nan((float)$tekanandarah[1]) ? 0 : (float)$tekanandarah[1];
                        }
                    }
                    if($item2->emrdfk == 4243) {
                        $item->birth_weight = is_nan((float)$item2->value) ? 0 : (float)$item2->value;
                    }
                }
            }
        }

    $dataDiagnosa = \DB::table('detaildiagnosapasien_t as dp')
        ->join('diagnosaim_m as dg', 'dg.id', '=', 'dp.objectdiagnosafk')
        ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'dp.noregistrasifk')
        ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
        ->select('dg.kddiagnosa','apd.objectasalrujukanfk','pd.norec')
        ->whereIn('dp.objectjenisdiagnosafk', [1,2])
        ->where('pd.kdprofile', $kdProfile)
        // 1) Primary dulu, lalu Secondary
        ->orderByRaw("
            CASE dp.objectjenisdiagnosafk
                WHEN 1 THEN 0
                WHEN 2 THEN 1
                ELSE 2
            END
        ")
        // 2) Di dalam masing-masing jenis, urutkan sesuai waktu input
        ->orderBy('dp.tglinputdiagnosa','asc');   // ganti ke nama kolom waktu yang benar kalau berbeda


        if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
            $dataDiagnosa = $dataDiagnosa->where('pd.noregistrasi', 'ilike', '%' . $filter['noreg'] . '%');
        }
        if (isset($filter['ispulang']) && $filter['ispulang'] == true) {
            if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
                $dataDiagnosa = $dataDiagnosa->where('pd.tglpulang', '>=', $filter['tglAwal']);
                
            }
        } else {
            if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
                $dataDiagnosa = $dataDiagnosa->where('pd.tglregistrasi', '>=', $filter['tglAwal']);
            }
        }

        if (isset($filter['ispulang']) && $filter['ispulang'] == true) {
            if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
                $tgl = $filter['tglAkhir'];//." 23:59:59";
                $dataDiagnosa = $dataDiagnosa->where('pd.tglpulang', '<=', $tgl);
            }
        } else {
            
            if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
                $tgl = $filter['tglAkhir'];//." 23:59:59";
                $dataDiagnosa = $dataDiagnosa->where('pd.tglregistrasi', '<=', $tgl);
            }

        }

        $dataDiagnosa=$dataDiagnosa->get();
        foreach ($data as $item){
            $dtdt = '';
            $asalRujukan = '';
            $covid19_status_cd = '';
//            $dataDiagnosa = \DB::table('detaildiagnosapasien_t as dp')
//                ->join('diagnosa_m as dg', 'dg.id', '=', 'dp.objectdiagnosafk')
//                ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'dp.noregistrasifk')
//                ->select('dg.kddiagnosa','apd.objectasalrujukanfk')
//                ->where('apd.noregistrasifk',$data[$i]->norec)
//                ->get();
            foreach ($dataDiagnosa as $item2){
                if ($item2->norec == $data[$i]->norec){
                    $dtdt = $dtdt . '#' .  $item2->kddiagnosa;
                    $asalRujukan = $item2->objectasalrujukanfk;
                }
            }
            $data[$i]->icd10 = substr($dtdt,1,strlen($dtdt)-1);
            $data[$i]->codernik = $codernik;
            $data[$i]->objectasalrujukanfk = $asalRujukan;
            $data[$i]->kodetarif = $item->kodetarif ;//$kodetarif;
            $i= $i + 1 ;
        }

        $i = 0 ;
        $dtdt = '';
     
        // ambil data ICD9 dengan join + alias
        $dataICD9 = \DB::table('diagnosatindakanpasien_t as dpa')
            ->join('detaildiagnosatindakanpasien_t as dp', 'dpa.norec', '=', 'dp.objectdiagnosatindakanpasienfk')
            ->join('diagnosatindakanim_m as dg', 'dg.id', '=', 'dp.objectdiagnosatindakanfk') // ✅ pakai diagnosatindakan_m
            ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'dpa.objectpasienfk')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->select(
                'dg.kddiagnosatindakan',
                'pd.norec', // ✅ sesuaikan dengan data utama
                'dp.multiplicity'
            )
            ->where('pd.kdprofile', $kdProfile);

        // filter noreg
        if (!empty($filter['noreg']) && $filter['noreg'] != "undefined") {
            $dataICD9 = $dataICD9->where('pd.noregistrasi', 'ilike', '%' . $filter['noreg'] . '%');
        }

        // filter tgl awal
        if (!empty($filter['tglAwal']) && $filter['tglAwal'] != "undefined") {
            if (!empty($filter['ispulang']) && $filter['ispulang'] == true) {
                $dataICD9 = $dataICD9->where('pd.tglpulang', '>=', $filter['tglAwal']);
            } else {
                $dataICD9 = $dataICD9->where('pd.tglregistrasi', '>=', $filter['tglAwal']);
            }
        }

        // filter tgl akhir
        if (!empty($filter['tglAkhir']) && $filter['tglAkhir'] != "undefined") {
            $tgl = $filter['tglAkhir'];
            if (!empty($filter['ispulang']) && $filter['ispulang'] == true) {
                $dataICD9 = $dataICD9->where('pd.tglpulang', '<=', $tgl);
            } else {
                $dataICD9 = $dataICD9->where('pd.tglregistrasi', '<=', $tgl);
            }
        }

        // ✅ cukup sekali get()
        $dataICD9 = $dataICD9->get();

        // mapping ke $data
        foreach ($data as $i => $item) {
            $icd9List = [];
            foreach ($dataICD9 as $item2) {
                if ($item2->norec == $item->norec) { // ✅ pastikan match field yg benar
                    if (!empty($item2->multiplicity) && (int)$item2->multiplicity > 0) {
                        $icd9List[] = $item2->kddiagnosatindakan . '+' . (int)$item2->multiplicity;
                    } else {
                        $icd9List[] = $item2->kddiagnosatindakan;
                    }
                }
            }
            $data[$i]->icd9 = implode('#', $icd9List);
        }




        $tglawalawal = $filter['tglAwal'];
        $tglakhirakhir = $filter['tglAkhir'];
        $kelompokPasien=$filter['kelId'];
        $noregs ='' ;
        $norms ='' ;
        $namas ='' ;
        if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
            $noregs = " and pd.noregistrasi='$filter[noreg]'";
        }
        if (isset($filter['norm']) && $filter['norm'] != "" && $filter['norm'] != "undefined") {
            $norms = " and ps.nocm='$filter[norm]'";
        }
        if (isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $namas = " and ps.namapasien ilike '%".$filter['nama']."%'";
        }

        if (isset($filter['ispulang']) && $filter['ispulang'] == true) {
            // if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
                $periode = " and pd.tglpulang >= '$tglawalawal' and pd.tglpulang <= '$tglakhirakhir' ";
                
            // }
        } else {
            // if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
                $periode = " and pd.tglregistrasi >= '$tglawalawal' and pd.tglregistrasi <= '$tglakhirakhir' ";
            // }
        }

        $dataTarif16 = DB::select(DB::raw("select pd.norec, sum(((pp.hargajual - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) * pp.jumlah)+ case when pp.jasa is null then 0 else pp.jasa end) as ttl,kpb.namaexternal
            from pasiendaftar_t as pd
            inner join pasien_m as ps on ps.id = pd.nocmfk
            INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
            INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
            INNER JOIN produk_m as pr on pr.id=pp.produkfk
            INNER JOIN kelompokprodukbpjs_m as kpb on kpb.id=pr.objectkelompokprodukbpjsfk
            left join kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
            left join batalregistrasi_t as br on br.pasiendaftarfk = pd.norec
            where br.norec is null   
            and pd.kdprofile=$kdProfile
            and kp.id in ($kelompokPasien) and  pr.id <> 402611
            $periode
            $noregs
            $namas
            $norms
            group  by pd.norec,kpb.namaexternal order by pd.norec")
        );
        $i = 0 ;
        $prosedur_non_bedah ='';
        $prosedur_bedah ='';
        $konsultasi ='';
        $tenaga_ahli ='';
        $keperawatan ='';
        $penunjang ='';
        $radiologi ='';
        $laboratorium ='';
        $pelayanan_darah ='';
        $rehabilitasi ='';
        $kamar ='';
        $rawat_intensif ='';
        $obat ='';
        $obat_kronis ='';
        $obat_kemoterapi ='';
        $alkes ='';
        $bmhp ='';
        $sewa_alat ='';
        foreach ($data as $item){
            $norecpd= $data[$i]->norec;
            foreach ($dataTarif16 as $itm){
                if ($itm->norec == $norecpd){
//                    $data[$i]->tarif_rs->($dataTarif16[0]->namaexternal) => (float)$dataTarif16[0]->ttl,
                    if ($itm->namaexternal == 'prosedur_non_bedah'){
                        $prosedur_non_bedah = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'prosedur_bedah'){
                        $prosedur_bedah = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'konsultasi'){
                           $konsultasi = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'tenaga_ahli'){
                        $tenaga_ahli = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'keperawatan'){
                        $keperawatan = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'penunjang'){
                        $penunjang = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'radiologi'){
                        $radiologi = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'laboratorium'){
                        $laboratorium = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'pelayanan_darah'){
                        $pelayanan_darah = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'rehabilitasi'){
                        $rehabilitasi = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'kamar'){
                        $kamar = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'rawat_intensif'){
                        $rawat_intensif = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'obat'){
                        $obat = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'obat_kronis'){
                        $obat_kronis = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'obat_kemoterapi'){
                        $obat_kemoterapi = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'alkes'){
                        $alkes = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'bmhp'){
                        $bmhp = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'sewa_alat'){
                        $sewa_alat = (float)$itm->ttl;
                    }
                }
            }

            $datatatat = array(
                'prosedur_non_bedah' => (float)$prosedur_non_bedah,
                'prosedur_bedah' => (float)$prosedur_bedah,
                'konsultasi' => (float)$konsultasi,
                'tenaga_ahli' => (float)$tenaga_ahli,
                'keperawatan' => (float)$keperawatan,
                'penunjang' => (float)$penunjang,
                'radiologi' => (float)$radiologi,
                'laboratorium' => (float)$laboratorium,
                'pelayanan_darah' => (float)$pelayanan_darah,
                'rehabilitasi' => (float)$rehabilitasi,
                'kamar' => (float)$kamar,
                'rawat_intensif' => (float)$rawat_intensif,
                'obat' => (float)$obat,
                'obat_kronis' => (float)$obat_kronis,
                'obat_kemoterapi' => (float)$obat_kemoterapi,
                'alkes' => (float)$alkes,
                'bmhp' => (float)$bmhp,
                'sewa_alat' => (float)$sewa_alat,
            );
            $prosedur_non_bedah =0;
            $prosedur_bedah =0;
            $konsultasi =0;
            $tenaga_ahli =0;
            $keperawatan =0;
            $penunjang =0;
            $radiologi =0;
            $laboratorium =0;
            $pelayanan_darah =0;
            $rehabilitasi =0;
            $kamar =0;
            $rawat_intensif =0;
            $obat =0;
            $obat_kronis =0;
            $obat_kemoterapi =0;
            $alkes =0;
            $bmhp =0;
            $sewa_alat =0;
            $data[$i]->tarif_rs = $datatatat;

            $i= $i + 1 ;

        }

        return $this->respond($data);
    }

    public function getDaftarPasienVen(Request $request)
    {
        $kdProfile = (int)$this->getDataKdProfile($request);
        if (isset($request['nocm']) && $request['nocm'] != "" && $request['nocm'] != "undefined") {
            $nocm =  $request['nocm'];
        }

        //  $data = DB::select(DB::raw("
        //         SELECT x.noregistrasifk, '1' as use_ind,case when x.ventilator_hour<1 then 1 ELSE x.ventilator_hour end as ventilator_hour, x.stop_dttm,x.start_dttm FROM(SELECT ep.noregistrasifk,epd.emrpasienfk, EXTRACT(HOUR FROM (lps.stop_dttm::TIMESTAMP - epd.value::TIMESTAMP)) AS ventilator_hour, epd.value as start_dttm,lps.stop_dttm FROM emrpasiend_t as epd
        //         INNER JOIN (SELECT emrpasienfk,
        //          value as stop_dttm FROM emrpasiend_t 
        //         WHERE emrfk = 291042 and emrdfk in (318182)) as lps ON lps.emrpasienfk = epd.emrpasienfk
        //         INNER JOIN emrpasien_t as ep on ep.noemr = epd.emrpasienfk 
        //         WHERE epd.emrfk = 291042 and epd.emrdfk in (318179)) as x where x.noregistrasifk = '$nocm' 
        // "));

            $data = DB::select(DB::raw("SELECT
                            x.noregistrasifk,
                            '1' AS use_ind,
                                                            (DATE_PART('Day', x.dttm_stop::TIMESTAMP - x.dttm_start::TIMESTAMP) * 24
                            + (DATE_PART('Hour',x.dttm_stop::TIMESTAMP) - 
                            DATE_PART('Hour', x.dttm_start::TIMESTAMP)) )
                                AS ventilator_hour,
                            x.dttm_start,
                            x.dttm_stop
                        FROM
                            (
                            SELECT
                                ep.noregistrasifk,
                                epd.emrpasienfk,
                                epd.VALUE AS start_dttm,
                                lps.stop_dttm,
                                MIN(epd.VALUE) OVER (PARTITION BY ep.noregistrasifk) AS dttm_start,
                                MAX(lps.stop_dttm) OVER (PARTITION BY ep.noregistrasifk) AS dttm_stop
                            FROM
                                emrpasiend_t AS epd
                                INNER JOIN (
                                    SELECT emrpasienfk, VALUE AS stop_dttm
                                    FROM emrpasiend_t
                                    WHERE emrfk = 291042 AND emrdfk IN (318182)
                                ) AS lps ON lps.emrpasienfk = epd.emrpasienfk
                                INNER JOIN emrpasien_t AS ep ON ep.noemr = epd.emrpasienfk
                            WHERE
                                epd.emrfk = 291042
                                AND epd.emrdfk IN (318179)
                            ) AS x
                        WHERE
                            x.noregistrasifk = '$nocm'
                        GROUP BY
                            x.noregistrasifk, x.dttm_start, x.dttm_stop
                            "));


        $kdProfile = (int)$this->getDataKdProfile($request);
        $noregistrasi = $request['noregistrasi'];
        $dataTarif16 = DB::select(DB::raw("select pd.norec, sum(((pp.hargajual - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) * pp.jumlah)+ case when pp.jasa is null then 0 else pp.jasa end) as ttl,kpb.namaexternal
            from pasiendaftar_t as pd
            inner join pasien_m as ps on ps.id = pd.nocmfk
            INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
            INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
            INNER JOIN produk_m as pr on pr.id=pp.produkfk
            INNER JOIN kelompokprodukbpjs_m as kpb on kpb.id=pr.objectkelompokprodukbpjsfk
            left join kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
            left join batalregistrasi_t as br on br.pasiendaftarfk = pd.norec
            where br.norec is null   
            and pd.kdprofile=$kdProfile
            AND pr.id <> 402611
            and pd.noregistrasi = '$nocm'
            group  by pd.norec,kpb.namaexternal order by pd.norec")
        );
        // $i = 0 ;
        $prosedur_non_bedah =0;
        $prosedur_bedah =0;
        $konsultasi =0;
        $tenaga_ahli =0;
        $keperawatan =0;
        $penunjang =0;
        $radiologi =0;
        $laboratorium =0;
        $pelayanan_darah =0;
        $rehabilitasi =0;
        $kamar =0;
        $rawat_intensif =0;
        $obat =0;
        $obat_kronis =0;
        $obat_kemoterapi =0;
        $alkes =0;
        $bmhp =0;
        $sewa_alat =0;
        $totaltarifrs = 0;
            $datatatat = [];
            if (count($dataTarif16) > 0) {
                foreach ($dataTarif16 as $itm){
    //                    $data[$i]->tarif_rs->($dataTarif16[0]->namaexternal) => (float)$dataTarif16[0]->ttl,
                        if ($itm->namaexternal == 'prosedur_non_bedah'){
                            $prosedur_non_bedah = (float)$itm->ttl;
                        }
                        if ($itm->namaexternal == 'prosedur_bedah'){
                            $prosedur_bedah = (float)$itm->ttl;
                        }
                        if ($itm->namaexternal == 'konsultasi'){
                               $konsultasi = (float)$itm->ttl;
                        }
                        if ($itm->namaexternal == 'tenaga_ahli'){
                            $tenaga_ahli = (float)$itm->ttl;
                        }
                        if ($itm->namaexternal == 'keperawatan'){
                            $keperawatan = (float)$itm->ttl;
                        }
                        if ($itm->namaexternal == 'penunjang'){
                            $penunjang = (float)$itm->ttl;
                        }
                        if ($itm->namaexternal == 'radiologi'){
                            $radiologi = (float)$itm->ttl;
                        }
                        if ($itm->namaexternal == 'laboratorium'){
                            $laboratorium = (float)$itm->ttl;
                        }
                        if ($itm->namaexternal == 'pelayanan_darah'){
                            $pelayanan_darah = (float)$itm->ttl;
                        }
                        if ($itm->namaexternal == 'rehabilitasi'){
                            $rehabilitasi = (float)$itm->ttl;
                        }
                        if ($itm->namaexternal == 'kamar'){
                            $kamar = (float)$itm->ttl;
                        }
                        if ($itm->namaexternal == 'rawat_intensif'){
                            $rawat_intensif = (float)$itm->ttl;
                        }
                        if ($itm->namaexternal == 'obat'){
                            $obat = (float)$itm->ttl;
                        }
                        if ($itm->namaexternal == 'obat_kronis'){
                            $obat_kronis = (float)$itm->ttl;
                        }
                        if ($itm->namaexternal == 'obat_kemoterapi'){
                            $obat_kemoterapi = (float)$itm->ttl;
                        }
                        if ($itm->namaexternal == 'alkes'){
                            $alkes = (float)$itm->ttl;
                        }
                        if ($itm->namaexternal == 'bmhp'){
                            $bmhp = (float)$itm->ttl;
                        }
                        if ($itm->namaexternal == 'sewa_alat'){
                            $sewa_alat = (float)$itm->ttl;
                        }
    
                        $datatatat = array(
                            'prosedur_non_bedah' => (float)$prosedur_non_bedah,
                            'prosedur_bedah' => (float)$prosedur_bedah,
                            'konsultasi' => (float)$konsultasi,
                            'tenaga_ahli' => (float)$tenaga_ahli,
                            'keperawatan' => (float)$keperawatan,
                            'penunjang' => (float)$penunjang,
                            'radiologi' => (float)$radiologi,
                            'laboratorium' => (float)$laboratorium,
                            'pelayanan_darah' => (float)$pelayanan_darah,
                            'rehabilitasi' => (float)$rehabilitasi,
                            'kamar' => (float)$kamar,
                            'rawat_intensif' => (float)$rawat_intensif,
                            'obat' => (float)$obat,
                            'obat_kronis' => (float)$obat_kronis,
                            'obat_kemoterapi' => (float)$obat_kemoterapi,
                            'alkes' => (float)$alkes,
                            'bmhp' => (float)$bmhp,
                            'sewa_alat' => (float)$sewa_alat,
                        );
                        $totaltarifrs = (float)$prosedur_non_bedah + (float)$prosedur_bedah + (float)$konsultasi + (float)$tenaga_ahli + (float)$keperawatan + (float)$penunjang + (float)$radiologi + (float)$laboratorium + (float)$pelayanan_darah + (float)$rehabilitasi + (float)$kamar + (float)$rawat_intensif +  (float)$obat + (float)$obat_kronis + (float)$obat_kemoterapi + (float)$alkes + (float)$bmhp + (float)$sewa_alat;
    
                        $totaltarifrs = ceil($totaltarifrs);
                     
    
                }

            } else {
                $datatatat = array(
                    'prosedur_non_bedah' => (float)$prosedur_non_bedah,
                    'prosedur_bedah' => (float)$prosedur_bedah,
                    'konsultasi' => (float)$konsultasi,
                    'tenaga_ahli' => (float)$tenaga_ahli,
                    'keperawatan' => (float)$keperawatan,
                    'penunjang' => (float)$penunjang,
                    'radiologi' => (float)$radiologi,
                    'laboratorium' => (float)$laboratorium,
                    'pelayanan_darah' => (float)$pelayanan_darah,
                    'rehabilitasi' => (float)$rehabilitasi,
                    'kamar' => (float)$kamar,
                    'rawat_intensif' => (float)$rawat_intensif,
                    'obat' => (float)$obat,
                    'obat_kronis' => (float)$obat_kronis,
                    'obat_kemoterapi' => (float)$obat_kemoterapi,
                    'alkes' => (float)$alkes,
                    'bmhp' => (float)$bmhp,
                    'sewa_alat' => (float)$sewa_alat,
                );
            }

        $result = array(
            'data1' => $datatatat,
            'data2' =>$data,
            'data3' => $totaltarifrs
        );
     
        return $this->respond($result);
    }

    public function getDaftarPasienIntensif(Request $request)
    {
        $noregistrasifk = $request['noregistrasifk'];
        $data = DB::select(DB::raw("SELECT
                apd.tglkeluar,
                apd.tglmasuk 
            FROM
                antrianpasiendiperiksa_t AS apd 
            WHERE
                noregistrasifk = '$noregistrasifk' 
                AND objectruanganfk IN ( 824, 825, 893, 907 )"));

            $los = 0;
            if ($data != []) {
                foreach ($data as $key => $d) {
                    $selisih = date_diff( date_create($d->tglmasuk), date_create($d->tglkeluar) );
                    $los = $selisih->days + 1 + $los;
                }
            }

            $icu_los = $los;
            $result = array(
                'data' => $icu_los,
                'message' => 'Mantap'
            );

            return $this->respond($result);
    }

    public function getGroupingIdrg(Request $request){
        $data = DB::table('hasilgroupingidrg_t')
                ->where("noregistrasifk",$request['noregistrasifk'])
                ->first();

        return $this->respond($data);
    }

    public function saveGroupingIdrg(Request $request)
    {
        $kdProfile = (int)$this->getDataKdProfile($request);
        DB::beginTransaction();
        try {



            $delete = DB::table('hasilgroupingidrg_t')
                ->where("noregistrasifk",$request['noregistrasifk'])
                ->delete();
            
            $new = new HasilGroupingIdrg();
            $new->norec =  $new->generateNewId();
            $new->noregistrasifk = $request['noregistrasifk'];
            $new->kdprofile = $kdProfile;
            $new->tglgrouping = date('Y-m-d H:i:s');
            $new->drg_code = $request['drg_code'];
            $new->drg_description = $request['drg_description'];
            $new->logic_version = $request['logic_version'];
            $new->mdc_description = $request['mdc_description'];
            $new->mdc_number = $request['mdc_number'];
            $new->script_version = $request['script_version'];
            $new->save();

            $transStatus = 'true';
            $transMessage = "Simpan Grouping iDRG Berhasil! ";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Grouping iDRG Gagal! ";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "data_idrg" => $new,
                "message" => $transMessage,
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "e" => $e->getMessage(),
                "message" => $transMessage,
            );
        }

        // return 'sukses';
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function savePegawai(Request $request)
    {
        DB::beginTransaction();
        try {
            $data = PasienDaftar::where('norec',$request['norec'])->first();
           
            if ($request['param'] == 'kironline') {
                if ($data->pegawaifinalklaim != null) {
                    PasienDaftar::where('norec',$request['norec'])
                    ->update([
                        'tgledit' => date('Y-m-d H:i:s'),
                         'pegeditklaim' => $request['namapegawai']
                    ]);
                } else {
                    PasienDaftar::where('norec',$request['norec'])
                    ->update([
                         'pegawaikirimol' => $request['namapegawai']
                    ]);
                }
               
            }
            if ($request['param'] == 'kirim') {
               
                if ($data->pegawaifinalklaim != null) {
                    PasienDaftar::where('norec',$request['norec'])
                    ->update([
                        'tgledit' => date('Y-m-d H:i:s'),
                         'pegeditklaim' => $request['namapegawai']
                    ]);
                } else {
                    PasienDaftar::where('norec',$request['norec'])
                    ->update([
                         'pegawaikirim' => $request['namapegawai']
                    ]);
                }
             
            }
            if ($request['param'] == 'simpan') {
                if ($data->pegawaifinalklaim != null) {
                    PasienDaftar::where('norec',$request['norec'])
                    ->update([
                        'tgledit' => date('Y-m-d H:i:s'),
                         'pegeditklaim' => $request['namapegawai'],
                         'dializer_use' => isset($request['dializer_use']) ? $request['dializer_use'] : null
                    ]);
                } else {
                    PasienDaftar::where('norec',$request['norec'])
                    ->update([
                         'pegawaisimpan' => $request['namapegawai'],
                         'dializer_use' => isset($request['dializer_use']) ? $request['dializer_use'] : null
                    ]);
                }
               
            }
            if ($request['param'] == 'grouper') {
                if ($data->pegawaifinalklaim != null) {
                    PasienDaftar::where('norec',$request['norec'])
                    ->update([
                        'tgledit' => date('Y-m-d H:i:s'),
                         'pegeditklaim' => $request['namapegawai']
                    ]);
                } else {
                    PasienDaftar::where('norec',$request['norec'])
               ->update([
                    'pegawaigrouper' => $request['namapegawai']
               ]);
                }
                
            }
            if ($request['param'] == 'final') {
                if ($data->pegawaifinalklaim != null) {
                    PasienDaftar::where('norec',$request['norec'])
               ->update([
                    'tgledit' => date('Y-m-d H:i:s'),
                    'pegeditklaim' => $request['namapegawai']
               ]);
                } else {
                    PasienDaftar::where('norec',$request['norec'])
                    ->update([
                        'tglklaim' => date('Y-m-d H:i:s'),
                         'pegawaifinalklaim' => $request['namapegawai']
                    ]);
                }
               
            }
               
            

            $transStatus = 'true';
            $transMessage = "Sukses";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Pegawai Klaim Gagal  ";
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
                "message" => $transMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function deleteGroupingInacbg(Request $request){
        $kdProfile = (int)$this->getDataKdProfile($request);
        DB::beginTransaction();
        try {

            if (isset($request['norec_pd'])) {
                $delete = DB::table('hasilgrouping_t')
                ->where("noregistrasifk",$request['norec_pd'])
                ->delete();
            }
            

             $transStatus = 'true';
            $transMessage = "Delete Grouping Inacbg Berhasil! ";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Delete Grouping Inacbg! Gagal! ";
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
                "e" => $e->getMessage(),
                "message" => $transMessage,
            );
        }

        // return 'sukses';
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function deleteGroupingIdrg(Request $request){
        $kdProfile = (int)$this->getDataKdProfile($request);
        DB::beginTransaction();
        try {

            if (isset($request['norec_pd'])) {
                $delete = DB::table('hasilgroupingidrg_t')
                ->where("noregistrasifk",$request['norec_pd'])
                ->delete();
            }
            

             $transStatus = 'true';
            $transMessage = "Delete Grouping Inacbg Berhasil! ";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Delete Grouping Inacbg! Gagal! ";
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
                "e" => $e->getMessage(),
                "message" => $transMessage,
            );
        }

        // return 'sukses';
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getListBerkasMonitoring(Request $r){
        $data = DB::select(DB::raw("SELECT * FROM dokklaim_m
            where statusenabled=true 
            and departemenfk='$r[dpid]'
            order by nourut, namaberkas
            "
        ));
        $cek = DB::table("dokklaim_t")->where('noregistrasifk',$r['noregistrasifk'])->get();
        $res['data'] = $data;
        $res['upload'] = $cek;
        return $this->respond($res);
    }

    public function getParameterDok(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $noregistrasi = $request['noregistrasi'];
        $user = $request['user'];
        $pd = PasienDaftar::where('noregistrasi',$request['noregistrasi'])->first();
        $dataDokasuransi = DB::table("dokklaim_m")
        ->where("id", $request['id'])
        ->where("statusenabled", true)
        ->first();

        try {
            $jsonData = json_decode($dataDokasuransi->config);
            $sql = str_replace('$noregistrasi', "$noregistrasi", $jsonData->sql);
            $sql = str_replace('$user', "$user", $sql);
            $config = collect(DB::select($sql));
            
            $result = [];
            foreach($config as $item) {
                $parameter = "?q=q";
                foreach($item as $fieldName => $fieldValue){
                    $parameter .= "&$fieldName=$fieldValue";
                }
                array_push($result, array(
                    "id" => $dataDokasuransi->id,
                    "param" => $parameter,
                    "namafile" => $dataDokasuransi->namaberkas,
                    "url" => $dataDokasuransi->url,
                    "noregistrasi" => $noregistrasi,
                ));
            }
            if(in_array($pd->objectruanganlastfk,[838,870,873,862,850])){
                if($request['id'] == 69 ){
                
                    if(count($result) == 0){
                        $config = collect(DB::select("select distinct ps.nocm, ep.norec_apd, ep.norec as emr, epd.emrfk, pd.kdprofile, '$user' as nama from pasiendaftar_t pd inner join pasien_m ps on ps.id = pd.nocmfk inner join emrpasien_t ep on ltrim(rtrim(ep.noregistrasifk)) = pd.noregistrasi inner join emrpasiend_t epd on epd.emrpasienfk = ep.noemr where pd.noregistrasi = '$noregistrasi' and jenisemr = 'asesmen' and epd.emrfk = 291085"));
                    }
                    foreach($config as $item) {
                        $parameter = "?q=q";
                        foreach($item as $fieldName => $fieldValue){
                            $parameter .= "&$fieldName=$fieldValue";
                        }
                        array_push($result, array(
                            "id" => $dataDokasuransi->id,
                            "param" => $parameter,
                            "namafile" => $dataDokasuransi->namaberkas,
                            "url" => $dataDokasuransi->url,
                            "noregistrasi" => $noregistrasi,
                        ));
                    }
                }
            } else {
                if($request['id'] == 3 ){
                
                    if(count($result) == 0){
                        $config = collect(DB::select("select distinct ps.nocm, ep.norec_apd, ep.norec as emr, epd.emrfk, pd.kdprofile, '$user' as nama from pasiendaftar_t pd inner join pasien_m ps on ps.id = pd.nocmfk inner join emrpasien_t ep on ltrim(rtrim(ep.noregistrasifk)) = pd.noregistrasi inner join emrpasiend_t epd on epd.emrpasienfk = ep.noemr where pd.noregistrasi = '$noregistrasi' and jenisemr = 'asesmen' and epd.emrfk = 291085"));
                    }
                    foreach($config as $item) {
                        $parameter = "?q=q";
                        foreach($item as $fieldName => $fieldValue){
                            $parameter .= "&$fieldName=$fieldValue";
                        }
                        array_push($result, array(
                            "id" => $dataDokasuransi->id,
                            "param" => $parameter,
                            "namafile" => $dataDokasuransi->namaberkas,
                            "url" => $dataDokasuransi->url,
                            "noregistrasi" => $noregistrasi,
                        ));
                    }
                }
            }
            
            if (in_array($request['id'], [5,12,19])) {
                $kdDepartemen = $this->settingDataFixed('KdDepartemenInstalasiLaboratorium', $idProfile);
                $config = collect(DB::select("
                    SELECT DISTINCT
                        pp.norec,
                        apd.norec AS norec_apd,
                        ps.objectjeniskelaminfk,
                        pg.namalengkap,
                        ps.tgllahir
                    FROM pelayananpasien_t AS pp
                    INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.norec = pp.noregistrasifk
                    INNER JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk
                    INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                    INNER JOIN pegawai_m AS pg ON pg.id = apd.objectpegawaifk
                    INNER JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                    WHERE pp.kdprofile = 30
                    AND pp.statusenabled = TRUE
                    AND ru.objectdepartemenfk = $kdDepartemen
                    AND pd.noregistrasi = '$noregistrasi'
                "));
                if (empty($config)) {
                    return $result = array(
                        'data' => $result,
                    );
                }
                $arrayNorecPp = $config->pluck('norec')->toArray();
                $stringNorecPp = implode(',', $arrayNorecPp);
                $hasilLab = HasilLaboratorium::where('statusenabled', true)->whereIn('norecpelayanan', $arrayNorecPp)->whereNotNull('keterangan')->first();
                $keterangan = '';
                if (!empty($hasilLab)) {
                    $keterangan = $hasilLab->keterangan;
                }
                $umurDay = round(abs(strtotime($config[0]->tgllahir) - strtotime(date('Y-m-d H:i'))) / (60 * 60 * 24));
                $parameter = "?q=q&norec=" . 
                    $config[0]->norec_apd . "&objectjeniskelaminfk=" .
                    $config[0]->objectjeniskelaminfk . "&umur=" . 
                    $umurDay . "&strIdPegawai=" . 
                    $config[0]->namalengkap . "&strNorecPP=" . 
                    $stringNorecPp . "&view=true" . "&doketr=" . 
                    $config[0]->namalengkap . "&catatan=" . 
                    $keterangan;
                $result = [];
                $result[] = array(
                    "id" => $dataDokasuransi->id,
                    "param" => $parameter,
                    "namafile" => $dataDokasuransi->namaberkas,
                    "url" => $dataDokasuransi->url,
                    "noregistrasi" => $noregistrasi,
                );
            }

            $result = array(
                'data' => $result,
            );

        } catch (\Exception $e) {
            $result = array(
                'data' => [],
            );
        }

        return $this->respond($result);
    }

    public function getDaftarKlaim(Request $request) {
        $data = DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps','ps.id','=','pd.nocmfk')
            ->join('ruangan_m as ru','ru.id','=','pd.objectruanganlastfk')
            ->join('departemen_m as dep','dep.id','=','ru.objectdepartemenfk')
            ->join('jeniskelamin_m as jk','jk.id', '=','ps.objectjeniskelaminfk')
            ->join('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
            ->leftJoin('monitoringklaim_t as mk', 'mk.nosep', '=', 'pa.nosep')
            ->leftjoin('asuransipasien_m as asu', 'pa.objectasuransipasienfk', '=', 'asu.id')
            ->leftJoin('kelompokpasien_m as klp','klp.id','=','pd.objectkelompokpasienlastfk')
            ->leftjoin('hasilgrouping_t as hg', 'hg.noregistrasifk', '=', 'pd.norec')
            ->leftJoin('pegawai_m as pg','pg.id','=','pd.objectpegawaifk')
            // ->leftJoin('alamat_m as al','al.nocmfk','=','ps.id')
            ->join('kelas_m as kls','kls.id','=','pd.objectkelasfk')
            // ->join('resumemedis_t as rm','rm.noregistrasifk','=', 
            //     DB::raw("apd.norec 
            //         AND rm.statusenabled=true 
            //         AND rm.keteranganlainnya='RawatJalan' 
            //         AND rm.tglresume IS NOT NULL"
            //         )
            //     )
            ->select(
                'ru.namaruangan', 'ru.id as idruangan', 'ps.nobpjs',
                'ps.namapasien', 'ps.nocm', 'ps.objectjeniskelaminfk', 'ps.nohp', DB::raw("to_char(ps.tgllahir,'YYYY-MM-DD') as tgllahir"), 'ps.nobpjs',
                'pd.norec as norec_pd','pd.noregistrasi', 'pd.statusklaim', DB::raw("to_char(pd.tglregistrasi,'YYYY-MM-DD HH:mm') as tglregistrasi"), 
                'pa.nosep', 'pa.flagprocedure','pa.statuskunjungan','pa.poliasalkode','pa.tglcreate', 'ps.noidentitas',
                'asu.nmprovider',
                'jk.jeniskelamin',
                'klp.kelompokpasien',
                'kls.namakelas',
                'pg.namalengkap as dokter',
                // 'rm.norec as norec_resume',
                'mk.status as ketKlaim',
                'hg.totalpiutangpenjamin',
                'pd.statuskelengkapandok',
				'pd.tglmeninggal',
				DB::raw("to_char(pd.tglpulang,'YYYY-MM-DD HH:mm') as tglpulang"),
                'pd.objectstatuspulangfk',
                'dep.id as id_dep'
            )
            // ->whereIn('ru.objectdepartemenfk', [18,24,28,26,30,34])
            // ->where('ru1.objectdepartemenfk','!=', 16)
            ->whereIN('pd.statusklaim', ['send_claim_individual'])
            ->where('pd.statusenabled',true)
            // ->whereNull('apd.objectruanganasalfk')
            // ->whereIN('ps.nocm', ['000041'])
			// ->whereNotNull('hg.totalpiutangpenjamin')
			->groupBy(
                'ru.namaruangan', 'ru.id', 'ps.nobpjs',
                'ps.namapasien', 'ps.nocm', 'ps.objectjeniskelaminfk', 'ps.nohp', 'ps.tgllahir', 'ps.nobpjs',
                'pd.norec','pd.noregistrasi', 'pd.statusklaim', 'pd.tglregistrasi', 
                'pa.nosep', 'pa.flagprocedure','pa.statuskunjungan','pa.poliasalkode','pa.tglcreate', 'ps.noidentitas',
                'asu.nmprovider',
                'jk.jeniskelamin',
                'klp.kelompokpasien',
                'kls.namakelas',
                'pg.namalengkap',
                // 'rm.norec',
                'mk.status',
                'hg.totalpiutangpenjamin',
                'pd.statuskelengkapandok',
				'pd.tglmeninggal',
				'pd.tglpulang',
                'pd.objectstatuspulangfk',
                'dep.id'
            )->orderBy('pd.tglpulang');

        $dokklaim = \DB::table('dokklaim_t as dk')
            ->join('dokklaim_m as dkm','dkm.id','=','dk.documentklaimfk')
            ->join('pasiendaftar_t as pd','pd.norec','=','dk.noregistrasifk')
            ->join('pasien_m as ps','ps.id','=','pd.nocmfk')
            ->join('ruangan_m as ru','ru.id','=','pd.objectruanganlastfk')
            ->join('departemen_m as dep','dep.id','=','ru.objectdepartemenfk')
            ->Join('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
            ->select('dkm.namaberkas','pd.norec as norec_pd')
            ->groupBy('dkm.namaberkas','pd.norec')
            ->orderBY('pd.norec')
            ->orderBY('dkm.namaberkas')
            ->where('dk.statusenabled',true)
            ->whereIN('pd.statusklaim', ['send_claim_individual']);


        if (isset($request->ispulang) && $request->ispulang == true) {
            if (isset($request->tglAwal) && $request->tglAwal != "" && $request->tglAwal != "undefined") {
                $data = $data->where('pd.tglpulang', '>=', $request->tglAwal);
                $dokklaim = $dokklaim->where('pd.tglpulang', '>=', $request->tglAwal);
            }
            if (isset($request->tglAkhir) && $request->tglAkhir != "" && $request->tglAkhir != "undefined") {
                $data = $data->where('pd.tglpulang', '<=', $request->tglAkhir);
                $dokklaim = $dokklaim->where('pd.tglpulang', '<=', $request->tglAkhir);
            }
        } else {
            if (isset($request->tglAwal) && $request->tglAwal != "" && $request->tglAwal != "undefined") {
                $data = $data->where('pd.tglregistrasi', '>=', $request->tglAwal);
                $dokklaim = $dokklaim->where('pd.tglregistrasi', '>=', $request->tglAwal);
            }
            if (isset($request->tglAkhir) && $request->tglAkhir != "" && $request->tglAkhir != "undefined") {
                $data = $data->where('pd.tglregistrasi', '<=', $request->tglAkhir);
                $dokklaim = $dokklaim->where('pd.tglregistrasi', '<=', $request->tglAkhir);
            }
        }

          
        if (isset($request->noregistrasi) && $request->noregistrasi != "" && $request->noregistrasi != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $request->noregistrasi);
            $dokklaim = $dokklaim->where('pd.noregistrasi', '=', $request->noregistrasi);
        }
        if (isset($request->norm) && $request->norm != "" && $request->norm != "undefined") {
            $data = $data->where('ps.nocm', '=', $request->norm);
            $dokklaim = $dokklaim->where('ps.nocm', '=', $request->norm);
        }
        if (isset($request->namapasien) && $request->namapasien != "" && $request->namapasien != "undefined") {
            $data = $data->where('ps.namapasien', 'ilike', '%' . $request->namapasien . '%');
            $dokklaim = $dokklaim->where('ps.namapasien', 'ilike', '%' . $request->namapasien . '%');
        }
        if (isset($request->ruanganid) && $request->ruanganid != "" && $request->ruanganid != "undefined") {
            $data = $data->where('pd.objectruanganlastfk', '=', $request->ruanganid);
            $dokklaim = $dokklaim->where('pd.objectruanganlastfk', '=', $request->ruanganid);
        }
        if (isset($request->depid) && $request->depid != "" && $request->depid != "undefined") {
            $data = $data->where('dep.id', '=', $request->depid);
            $dokklaim = $dokklaim->where('dep.id', '=', $request->depid);
        }
        if (isset($request->nosep) && $request->nosep != "" && $request->nosep != "undefined") {
            $data = $data->where('pa.nosep','ilike', '%' . $request->nosep.'%');
            $dokklaim = $dokklaim->where('pa.nosep','ilike', '%' . $request->nosep.'%');
        }
        if (isset($request->jenispel) && $request->jenispel != "" && $request->jenispel != "undefined") {
            if($request->jenispel == 1){
                $data = $data->where('dep.id',16);
                $dokklaim = $dokklaim->where('dep.id',16);
            } else {
                $data = $data->where('dep.id','!=',16);
                $dokklaim = $dokklaim->where('dep.id','!=',16);
            }
        }

        if (isset($request['jenisdiagnosa']) && $request['jenisdiagnosa'] != '' && $request['jenisdiagnosa'] != 'undefined') {
            $data = $data
                ->join('antrianpasiendiperiksa_t as apd', function ($join) {
                    $join->on('apd.noregistrasifk', '=', 'pd.norec')
                        ->on('apd.objectruanganfk', '=', DB::raw('pd.objectruanganlastfk'));
                })
                ->join('diagnosapasien_t as dp', 'dp.noregistrasifk', '=', 'apd.norec')
                ->join('detaildiagnosapasien_t as ddp', function ($join) use ($request) {
                    $join->on('ddp.objectdiagnosapasienfk', '=', 'dp.norec')
                        ->where('ddp.objectjenisdiagnosafk', '=', $request['jenisdiagnosa'])
                        ->where('ddp.objectdiagnosafk', '=', $request['diagnosa']);
                });
        }
            
        $data = $data->get();

        $dokklaim = $dokklaim->get();

        $dokumenMap = [];
        foreach ($dokklaim as $d) {
            $norecPd = $d->norec_pd;
            $namaberkas = trim($d->namaberkas);
        
            if (!isset($dokumenMap[$norecPd])) {
                $dokumenMap[$norecPd] = $namaberkas;
            } else {
                if (strpos($dokumenMap[$norecPd], $namaberkas) === false) {
                    $dokumenMap[$norecPd] .= " \ $namaberkas";
                }
            }
        }

        $dataulasan = \DB::table("ulasanklaim_t")
			->where('statusenabled', true);
            // ->where('tglregistrasi', '>=', $request->tglAwal)
            // ->where('tglregistrasi', '<=', $request->tglAkhir)
            // ->get();

            if (isset($request->ispulang) && $request->ispulang == true) {
                if (isset($request->tglAwal) && $request->tglAwal != "" && $request->tglAwal != "undefined") {
                    $dataulasan = $dataulasan->where('tglpulang', '>=', $request->tglAwal);
                }
                if (isset($request->tglAkhir) && $request->tglAkhir != "" && $request->tglAkhir != "undefined") {
                    $dataulasan = $dataulasan->where('tglpulang', '<=', $request->tglAkhir);
                }
            } else {
                if (isset($request->tglAwal) && $request->tglAwal != "" && $request->tglAwal != "undefined") {
                    $dataulasan = $dataulasan->where('tglregistrasi', '>=', $request->tglAwal);
                }
                if (isset($request->tglAkhir) && $request->tglAkhir != "" && $request->tglAkhir != "undefined") {
                    $dataulasan = $dataulasan->where('tglregistrasi', '<=', $request->tglAkhir);
                }
            }
        $dataulasan = $dataulasan->get();
        $arrDataUlasan = [];
        if($dataulasan) {
            $arrDataUlasan = json_decode(json_encode($dataulasan), true);
        }

       

        $i=0;
        foreach($data as $item) {
            // $cekresume = DB::table('resumemedis_t')
            //     ->select('norec')
            //     ->where('noregistrasifk', $item->norec_apd)
            //     ->where('keteranganlainnya', 'RawatJalan')
            //     ->whereNotNull('tglresume')
            //     ->where('statusenabled', true);
                
            // $countresume        = $cekresume->count();
            // $data[$i]->isresume = !empty($item->norec_resume)?'Selesai':'-';
            // $data[$i]->norec_resume = '';
            // if($countresume>0) {
            //     $resresume = $cekresume->first();
            //     $data[$i]->norec_resume = $resresume->norec;
            // }
           
            $norec_pd = $item->norec_pd;
            $filterUlasan = array_filter($arrDataUlasan, function ($val) use ($norec_pd) {
                return ($val['noregistrasifk'] == $norec_pd);
            });
            $filterUlasan = array_merge($filterUlasan);
            $ulasanBelumdibaca = array_filter($arrDataUlasan, function ($val) use ($norec_pd) {
                return ($val['noregistrasifk'] == $norec_pd && $val['isread']==true && $val['isread']==false);
            });
            $data[$i]->ulasan = "Tot Ulasan ".count($filterUlasan);

            $data[$i]->totalpiutangpenjamin = !empty($item->totalpiutangpenjamin)?$item->totalpiutangpenjamin:"Belum Ada";

            $item->listdokumen = isset($dokumenMap[$item->norec_pd]) ? $dokumenMap[$item->norec_pd] : 'Tidak Ada';
            $tglLahir = new \DateTime($item->tgllahir);
            $today = new \DateTime($item->tglpulang);
            $y = $today->diff($tglLahir)->y;
            $m = $today->diff($tglLahir)->m;
            $d = $today->diff($tglLahir)->d;
            $umur = $y;

            $data[$i]->umur = $umur;

            $i++;
        }
        return $this->respond($data);
    }

    public function postDokumenKlaim(Request $request) 
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataReq = $request->all();

        // $request->validate([
        //      'fileBerkas'=>'required|mimes:pdf'
        // ]);

        $uploadBerkasPasien = $request->file('fileBerkas');
        $dataRegistrasi = PasienDaftar::where('norec', $dataReq['noregistrasifk'])->first();
        $path = 'dokumen_klaim/'.$dataRegistrasi->noregistrasi;

        DB::beginTransaction();
        try {
            // penamaan file 
            $extension = $uploadBerkasPasien->getClientOriginalExtension();
            $filename = $dataReq['namafile'].'_'.$dataRegistrasi->noregistrasi.'.'.$extension;

            $dataInsert = array(
                "norec" => substr(Uuid::generate(), 0, 32),
                "kdprofile" => $idProfile,
                "statusenabled" => true,
                "filename" => $filename,
                "filepath" => $path.'/'.$filename,
                "nocmfk" => $dataRegistrasi->nocmfk,
                "noregistrasifk" => $dataReq['noregistrasifk'],
                "documentklaimfk" => $dataReq['documentklaimfk'],
                "tglupload" => date('Y-m-d H:i:s'),
            );
            DB::table('dokklaim_t')->updateOrInsert(["filename" => $filename], $dataInsert);;
            $request->file('fileBerkas')->move($path, $filename);

            $transStatus = true;
        } catch (\Exception $e) {
            $transStatus = false;
        }

        if ($transStatus) {
            $transMessage = 'Simpan Berhasil';
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "dokumen" => $dataInsert,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    
    public function deleteDokumenKlaim(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        DB::beginTransaction();
        try {
            $dok_m = DB::table("dokklaim_m")->where('id',$request['documentklaimfk'])->first();
            $dok = DB::table("dokklaim_m")->where('namaberkas',$dok_m->namaberkas)->where('statusenabled',true)->get();
            $dok_id = [];
            foreach($dok AS $item){
                $dok_id[] = $item->id;
            }
            $dataRegistrasi = PasienDaftar::where('noregistrasi', $request['noregistrasi'])->first();
            $Dkmn = DB::table("dokklaim_t")
            ->where('noregistrasifk', $dataRegistrasi->norec)
            ->where('documentklaimfk',$request['documentklaimfk'])
            ->where('kdprofile',$idProfile)
            ->get();
            foreach($Dkmn as $d){
                // delete file
                $path = public_path($d->filepath);
                if (\File::exists($d->filepath)){
                    \File::delete($path);
                }
            }
            

            // detele data
            DB::table("dokklaim_t")
            ->where('noregistrasifk', $dataRegistrasi->norec)
            ->whereIn('documentklaimfk',$dok_id)
            ->where('kdprofile',$idProfile)
            ->delete();

            $transStatus = true;
        } catch (\Exception $e) {
            $transStatus = false;
        }

        if ($transStatus) {
            $transMessage = 'Hapus Berhasil';
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Hapus Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveGroupingInacbg(Request $request)
    {
        $kdProfile = (int)$this->getDataKdProfile($request);
        DB::beginTransaction();
        try {
            $delete = HasilGroupingInacbg::where('noregistrasifk', $request['noregistrasifk'])->delete();

            $new = new HasilGroupingInacbg();
            $new->norec =  $new->generateNewId();
            $new->noregistrasifk = $request['noregistrasifk'];
            $new->kdprofile = $kdProfile;
            $new->tglgrouping = date('Y-m-d H:i:s');
            $new->cbg_code = $request['cbg_code'];
            $new->cbg_description = $request['cbg_description'];
            $new->cbg_tarif = $request['cbg_tarif'];
            $new->subclass = $request['subclass'];
            $new->status = $request['status'];
            $new->additional_json = $request['additional_json'];
            $new->special_cmg_drug_code = $request['special_cmg_drug_code'];
            $new->special_cmg_drug_description = $request['special_cmg_drug_description'];
            $new->special_cmg_procedure_code = $request['special_cmg_procedure_code'];
            $new->special_cmg_procedure_description = $request['special_cmg_procedure_description'];
            $new->special_cmg_prosthesis_code = $request['special_cmg_prosthesis_code'];
            $new->special_cmg_prosthesis_description = $request['special_cmg_prosthesis_description'];
            $new->special_cmg_investigation_code = $request['special_cmg_investigation_code'];
            $new->special_cmg_investigation_description = $request['special_cmg_investigation_description'];
            $new->save();

            $transStatus = 'true';
            $transMessage = "Simpan Grouping Inacbg Berhasil! ";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Grouping Inacbg Gagal! ";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "data_inacbg" => $new,
                "message" => $transMessage,
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "e" => $e->getMessage(),
                "message" => $transMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getGroupingInacbg(Request $request){
        $data = DB::table('hasilgroupinginacbg_t')
                ->where("noregistrasifk",$request['noregistrasifk'])
                ->first();

        return $this->respond($data);
    }

    public function saveBaseTarif(Request $request)
    {
        DB::beginTransaction();
        try {
            PasienDaftar::where('norec', $request['norec'])->update([
                'inacbgtotalgrouper' => (float)$request['base_tarif']
            ]);

            $transStatus = true;
            $transMessage = "Simpan Base Tarif Berhasil!";
        } catch (\Exception $e) {
            $transStatus = false;
            $transMessage = "Simpan Base Tarif Gagal!";
        }

        if ($transStatus) {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "e" => $e->getMessage(),
                "message" => $transMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
}