<?php
/**
 * Created by IntelliJ IDEA.
 * User: Egie Ramdan
 * Date: 02/04/2019
 * Time: 10:14
 */
namespace App\Http\Controllers\ReservasiOnline;

use App\Http\Controllers\ApiController;
use App\Master\Alamat;
use App\Master\Pegawai;
use App\Master\JenisKelamin;
use App\Master\Pasien;
use App\Master\SlottingOnline;
use App\Master\SlottingLibur;
use App\Master\Ruangan;
use App\Web\Profile;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\Request;
use App\Traits\PelayananPasienTrait;
use App\Traits\Valet;
use DB;
use App\Transaksi\AntrianPasienRegistrasi;
use App\Transaksi\AntrianPasienDiperiksa;
use App\Transaksi\PasienDaftar;
use Webpatser\Uuid\Uuid;

class MyJKNV2Controller extends ApiController
{
    use Valet, PelayananPasienTrait;

    public function __construct(Request $request) {
        if($request->url === "auth") {
            parent::__construct($skip_authentication=true);
        } else {
            parent::__construct($skip_authentication=false);
        }
    }

    public function GetAntrean_fix(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $userData = $request->all();
        $request = $request->json()->all();
        date_default_timezone_set('Asia/Jakarta'); // set timezone

        if (empty($request['nomorkartu'])) {
            $result = array("metadata" => array("message" => "Nomor Kartu Belum Diisi", "code" => 201));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }

        if(empty($request['tanggalperiksa'])) {
            $result = array("metadata"=>array("message" => "Tanggal Periksa Belum Diisi", "code" => 201));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }

        if (!preg_match("/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/",$request['tanggalperiksa'])) {
            $result = array("metadata"=>array("message" => "Format Tanggal Tidak Sesuai, format yang benar adalah yyyy-mm-dd", "code" => 201));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }

        if($request['tanggalperiksa'] >= date('Y-m-d',strtotime('+90 days',strtotime(date('Y-m-d'))))){
            $result = array("metadata"=>array("message" => "Tanggal periksa maksimal 90 hari dari hari ini","code" => 201));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }

        if($request['tanggalperiksa'] == date('Y-m-d')){
            $result = array("metadata"=>array("message" => "Tanggal periksa minimal besok", "code" => 201));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }

        if($request['tanggalperiksa'] < date('Y-m-d')){
            $result = array("metadata" => array("message" => "Tanggal Periksa Tidak Berlaku", "code" => 201));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }

        if(date('w',strtotime( $request['tanggalperiksa'] )) == 0 ){
            $result = array(
                "metadata"=>array(
                    "message" => "Tidak ada jadwal Poli di hari Minggu",
                    "code" => 201
                )
            );
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }

        if (empty($request['nik'])) {
            $result = array("metadata" => array("message" => "NIK Belum Diisi", "code" => 201));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }

        if (!is_numeric($request['nik']) || strlen($request['nik']) < 16) {
            $result = array("metadata" => array("message" => "Format NIK Tidak Sesuai ", "code" => 201));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }

        if (empty($request['nohp'])) {
            $result = array("metadata" => array("message" => "No hp tidak boleh kosong", "code" => 201));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }

        if(empty($request['kodepoli']) ) {
            $result = array("metadata"=>array("message" => "Poli Tidak Ditemukan", "code" => 201));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }

        if(empty($request['jeniskunjungan']) ) {
            $result = array("metadata"=>array("message" => "Jenis Kunjungan tidak boleh kosong", "code" => 201));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }

        if(empty($request['nomorreferensi']) ) {
            $result = array("metadata"=>array("message" => "Nomor Referensi tidak boleh kosong", "code" => 201));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }

        $ruang = Ruangan::where('kdinternal', $request['kodepoli'])
        ->whereRaw(" ( iseksekutif=false or iseksekutif is null ) ")
        ->where('statusenabled', true)
        ->where('kdprofile', $kdProfile)
        ->first();
        // cekJadwalHFIS
        $objetoRequest = new \Illuminate\Http\Request();
        $objetoRequest ['url']= "jadwaldokter/kodepoli/".$ruang->noruangan."/tanggal/". $request['tanggalperiksa'];
        $objetoRequest ['jenis']= "antrean";
        $objetoRequest ['method']= "GET";
        $objetoRequest ['data']=null;
  

        $cek = app('App\Http\Controllers\Bridging\BridgingBPJSV2Controller')->bpjsTools($objetoRequest);
        if(is_array($cek)){
            $code = $cek['metaData']->code;
        }else{
            $cek = json_decode($cek->content(), true);
            $code = $cek['metaData']['code'];
        }
  
        if($code != '200'){
            $result = array("metadata"=>array("message" => "Pendaftaran ke Poli Ini Sedang Tutup", "code" => 201));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }else{
            $ada = false;
            if(count($cek['response']) > 0){
                foreach($cek['response'] as $item){
                    if($request['kodedokter'] == $item->kodedokter){
                        $ada = true;
                        break;
                    }
                }
            }
            if($ada == false){
                $dokter = DB::table('pegawai_m')
                ->where('statusenabled', true)
                ->where('kdprofile', $kdProfile)
                ->where('kddokterbpjs', $request['kodedokter'])
                ->first();

                $nama = !empty($dokter) ? $dokter->namalengkap:'-';
                $result = array("metadata"=>array("message" => "Jadwal Dokter ".$nama." Tersebut Belum Tersedia, Silahkan Reschedule Tanggal dan Jam Praktek Lainnya", "code" => 201));
                return $this->setStatusCode($result['metadata']['code'])->respond($result);
            }
        }
     

        $eksek = false;

        $jenisrequest = 0;
        DB::beginTransaction();
        try {
            $norm = "";
            $namaDokter = "";
            $idDokter = null;
            $pasienBaru = 0;
            $antrian = $this->GetJamKosong($request['kodepoli'], $request['tanggalperiksa'], $kdProfile,$eksek);
            if ($antrian['antrian'] == 0) {
                DB::rollBack();
                $result = array("metadata" => array("message" => "Jadwal Poli /kuota belum di set", "code" => 201));
                return $this->setStatusCode($result['metadata']['code'])->respond($result);
            }
            $pasien = DB::table('pasien_m')
            ->whereRaw("nobpjs = '" . $request['nomorkartu'] . "'")
            ->where('statusenabled', true)
            ->where('kdprofile', $kdProfile)
            ->first();
            $dokter = DB::table('pegawai_m')
            ->where('statusenabled', true)
            ->where('kdprofile', $kdProfile)
            ->where('kddokterbpjs', $request['kodedokter'])
            ->first();

            if (empty($ruang)) {
                $result = array("metadata" => array("code" => 201, "message" => "Poli Tidak Ditemukan"));
                return $this->setStatusCode($result['metadata']['code'])->respond($result);
            }
            if (empty($pasien)) {
                $pasienBaru = 0;
                $jenisrequest = 0;
                $norm = $request['norm'];
                    
                DB::rollBack();
                $result = array(
                    "metadata" => array(
                        "code" => 202,
                        "message" => "Data pasien ini tidak ditemukan, silahkan Melakukan Registrasi Pasien Baru")
                );
                return $this->setStatusCode($result['metadata']['code'])->respond($result);

            }else{
                $pasienBaru = 1;
                $norm = $pasien->nocm;
                $jenisrequest = 1;
            }

            if (empty($dokter)){
                DB::rollBack();
                $transMessage = "Dokter Tidak Ditemukan";
                $transStatus = 'false';
            }else{
                $namaDokter = $dokter->namalengkap;
                $idDokter = $dokter->id;
            }

            $tipepembayaran = '2';
            $tgl = $request['tanggalperiksa'];

            $dataReservasi = DB::table('antrianpasienregistrasi_t as apr')
            ->select('apr.noantrian', 'apr.noreservasi', 'ru.namaexternal', 'apr.tanggalreservasi')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apr.objectruanganfk')
            ->whereRaw("to_char(apr.tanggalreservasi,'yyyy-MM-dd')= '$tgl'")
            ->where('apr.objectruanganfk', '=', $ruang->id)
            ->where('apr.noreservasi', '!=', '-')
            ->where('apr.noidentitas', '=', $request['nik'])
            ->where('apr.nobpjs', '=', $request['nomorkartu'])
            ->whereNotNull('apr.noreservasi')
            ->whereRaw(" (apr.isbatal = false or apr.isbatal is null)")
            ->where('apr.statusenabled', true)
            ->first();

            if (isset($dataReservasi) && !empty($dataReservasi)) {
                DB::rollBack();
                $result = array("metadata" => array("code" => 201, "message" => "Nomor Antrean Hanya Dapat Diambil 1 Kali Pada Tanggal Yang Sama"));
                return $this->setStatusCode($result['metadata']['code'])->respond($result);
            }


            $newptp = new AntrianPasienRegistrasi();
            $nontrian = AntrianPasienRegistrasi::max('noantrian') + 1;
            $newptp->norec = $newptp->generateNewId();;
            $newptp->kdprofile = $kdProfile;
            $newptp->statusenabled = true;
            $newptp->objectruanganfk = $ruang->id;
            $newptp->objectjeniskelaminfk = !empty($pasien) ? $pasien->objectjeniskelaminfk : null;
            $newptp->noreservasi = substr(Uuid::generate(), 0, 7);
            $newptp->tanggalreservasi = $request['tanggalperiksa'] . " " . $antrian['jamkosong'];
            $newptp->tgllahir = !empty($pasien) ? $pasien->tgllahir : null;
            $newptp->objectkelompokpasienfk = $tipepembayaran;
            $newptp->objectpendidikanfk = 0;
            $newptp->namapasien = !empty($pasien) ? $pasien->namapasien : null;
            // $newptp->noidentitas = $request['nik'];
            $newptp->tglinput = date('Y-m-d H:i:s');
            $newptp->nobpjs = $request['nomorkartu'];
            if (isset($request['nomorkartu'])){
                $newptp->jenis = "M";
            }
            $newptp->norujukan = $request['nomorreferensi'];
            $newptp->notelepon = !empty($pasien) ? $pasien->nohp : null;
            $newptp->objectpegawaifk = $idDokter;
            $newptp->tipepasien = !empty($pasien) ? "LAMA" : "BARU";
            $newptp->ismobilejkn = 1;
            $newptp->objectasalrujukanfk = $request['jeniskunjungan'];
            $newptp->type = !empty($pasien) ? "LAMA" : "BARU";

            $newptp->objectagamafk = !empty($pasien) ? $pasien->objectagamafk : null;
            if(!empty($pasien)){
                $alamat = Alamat::where('nocmfk', $pasien->id)->first();
                if (!empty($alamat)) {
                    $newptp->alamatlengkap = $alamat->alamatlengkap;
                    $newptp->objectdesakelurahanfk = $alamat->objectdesakelurahanfk;
                    $newptp->negara = $alamat->objectnegarafk;
                }
            }
            $newptp->objectgolongandarahfk = !empty($pasien) ? $pasien->objectgolongandarahfk : null;
            $newptp->kebangsaan = !empty($pasien) ? $pasien->objectkebangsaanfk : null;
            $newptp->namaayah = !empty($pasien) ? $pasien->namaayah : null;
            $newptp->namaibu = !empty($pasien) ? $pasien->namaibu : null;
            $newptp->namasuamiistri = !empty($pasien) ? $pasien->namasuamiistri : null;

            $newptp->noaditional = !empty($pasien) ? $pasien->noaditional : null;
            $newptp->noantrian = $antrian['antrian'];
            $newptp->noidentitas =  $request['nik'];
            $newptp->nocmfk = !empty($pasien) ? $pasien->id : null;
            $newptp->paspor = !empty($pasien) ? $pasien->paspor : null;
            $newptp->objectpekerjaanfk = !empty($pasien) ? $pasien->objectpekerjaanfk : null;
            $newptp->objectpendidikanfk = !empty($pasien) && $pasien->objectpendidikanfk != null ? $pasien->objectpendidikanfk :  0;
            $newptp->objectstatusperkawinanfk = !empty($pasien) ? $pasien->objectstatusperkawinanfk : null;
            $newptp->tempatlahir = !empty($pasien) ? $pasien->tempatlahir : null;
            $newptp->statuspanggil  = 0;
            $newptp->save();
            $nomorAntrian = strlen((string)$newptp->noantrian);
            // dd($nomorAntrian);
            if ($nomorAntrian == 1){
                $nomorAntrian = '0'.$newptp->noantrian;
            }else{
                $nomorAntrian = $newptp->noantrian;
            }

            $kodeDokter = $request['kodedokter'];
            $kdInternalRuangan = $request['kodepoli'];
            $tglAwal = date('Y-m-d',strtotime($request['tanggalperiksa'])) .' 00:00:00';
            $tglAkhir = date('Y-m-d',strtotime($request['tanggalperiksa'])) .' 23:59:59';

            //region saveLANGUNGPOLI
            if(!empty($pasien)){
                $pasiendaftar = array(
                    'tglregistrasi' => $newptp->tanggalreservasi,
                    'tglregistrasidate' => date('Y-m-d',strtotime($newptp->tanggalreservasi)),
                    'nocmfk' =>  $pasien->id,
                    'objectruanganfk' =>  $ruang->id,
                    'objectdepartemenfk' =>  $ruang->objectdepartemenfk,
                    'objectkelasfk' =>  6,//nonkelas
                    'objectkelompokpasienlastfk' => 2,//bpjs
                    'objectrekananfk' =>  2552,
                    'tipelayanan' => 1,//reguler
                    'objectpegawaifk' => $idDokter,
                    'noregistrasi' =>  '',
                    'norec_pd' =>  '',
                    'israwatinap' =>  'false',
                    'statusschedule' => $newptp->noreservasi,
                    'objectrekananfk' => 2552,
                    'isjkn' => true
                );
                $antrianpasiendiperiksa = array(
                    'norec_apd' => '',
                    'tglregistrasi' => $newptp->tanggalreservasi,
                    'objectruanganfk' =>  $ruang->id,
                    'objectkelasfk' => 6,
                    'objectpegawaifk' => $idDokter,
                    'objectkamarfk' =>null,
                    'nobed' =>null,
                    'objectdepartemenfk' => $ruang->objectdepartemenfk,
                    'objectasalrujukanfk' => $request['jeniskunjungan'] == 1? 1:2,
                    'israwatgabung' => 0,
                    'objectkamarfk' => null,
                    'noantrian' => $antrian['antrian'],
                    'nojkn' =>  null,//$newptp->jenis . '-' . $nomorAntrian,
                );
            
                
                $objetoRequest = new \Illuminate\Http\Request();
                $objetoRequest ['pasiendaftar'] = $pasiendaftar;
                $objetoRequest ['antrianpasiendiperiksa'] = $antrianpasiendiperiksa;
                $objetoRequest ['userData'] = $userData['userData'];
                $cek = app('App\Http\Controllers\Registrasi\RegistrasiController')->saveRegistrasiPasien($objetoRequest);
                $cek = json_decode($cek->content(), true);
                $nomorAntrian = 0;
                $nomorAntrianANGKA = $nomorAntrian;
                $idRU =  $ruang->id;
                $jmlJKN = collect(DB::select("select count(norec) as jml 
                from pasiendaftar_t 
                where objectruanganlastfk='$idRU'
                and statusenabled=true 
                and tglregistrasi between '$tglAwal' and '$tglAkhir'
                and ismobilejkn=true"))->first();
                if(isset($cek["metadata"])){
                    if($cek["metadata"]["code"] == "200") {
                        $nomorAntrianANGKA = $cek["metadata"]["dataAPD"]["noantrian"];
                        $huruf = 'Z';
                        if ($ruang->prefixnoantrian != null) {
                            $huruf = $ruang->prefixnoantrian;
                        }
                        $nomorAntrian = $huruf . '-' . str_pad($cek["metadata"]["dataAPD"]["noantrian"], 4, "0", STR_PAD_LEFT);

                        $transMessage = "Ok";
                        $transStatus = 'true';
                    } else {
                        $transMessage = "Gagal Reservasi";
                        $transStatus = 'false';
                    }
                } else {
                    $transStatus = 'false';
                    $transMessage = $cek['message'];
                }
            }
            
        } catch (\Exception $e) {
            $transMessage = "Gagal Reservasi";
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            DB::commit();
            date_default_timezone_set('Asia/Jakarta'); // set timezone
            $estimasidilayani = strtotime($newptp->tanggalreservasi) * 1000;
            $result = array(
                "response" => array(
                    "nomorantrean" =>  $nomorAntrian,
                    "angkaantrean" => $nomorAntrianANGKA,
                    "kodebooking" => $newptp->noreservasi,
                    // "pasienbaru" => $jenisrequest,
                    "norm" => $norm,
                    "namapoli" => $ruang->namaruangan,
                    "namadokter" => $namaDokter,
                    "estimasidilayani" => $estimasidilayani,
                    "sisakuotajkn" => $antrian['kuota']  - (!empty($jmlJKN) ? $jmlJKN->jml : 0),
                    "kuotajkn" => $antrian['kuota'],
                    "sisakuotanonjkn" => $antrian['kuota']  - (!empty($jmlJKN) ? $jmlJKN->jml : 0),
                    "kuotanonjkn" => $antrian['kuota'],
                    "keterangan" => "Peserta harap 60 menit lebih awal guna pencatatan administrasi."
                ),
                "metadata" => array(
                    "message" => $transMessage,
                    "code" => 200
                )
            );
        }else{
            DB::rollBack();
            $result = array(
                "metadata" => array(
                    "message" => $transMessage,
                    "code" => 201
                )
            );

        }
        return $this->setStatusCode($result['metadata']['code'])->respond($result);
    }

    public function GetSisaAntrean_fix(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $request = $request->json()->all();

        if(empty($request['kodebooking']) ) {
            $result = array("metadata"=>array("message" => "Kode Booking Belum Diisi", "code" => 201));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }

        $data = DB::table('antrianpasienregistrasi_t as apr')
                ->leftJoin('pegawai_m as pg','pg.id','=','apr.objectpegawaifk')
                ->leftJoin('ruangan_m as ru','ru.id','=','apr.objectruanganfk')
                ->selectRaw("
                    apr.*,pg.namalengkap,ru.namaruangan
                ")
                ->where('apr.kdprofile', $kdProfile)
                ->where('apr.statusenabled', true)
                ->where('apr.noreservasi', $request['kodebooking'])
                ->first();
        if(empty($data)){
            $result = array(
                "metadata"=>
                    array(
                        'message' => "Antrean Tidak Ditemukan",
                        'code' => 201,
                    )
            );
            return $this->respond($result);
        }
        $kodeDokter = $data->objectpegawaifk;
        $kdInternalRuangan = $data->objectruanganfk;
        $tglAwal = date('Y-m-d',strtotime($data->tanggalreservasi)) .' 00:00:00';
        $tglAkhir = date('Y-m-d',strtotime($data->tanggalreservasi)) .' 23:59:59';

        $getStatusAntrian = DB::select(DB::raw("
        SELECT  x.namapoli,
        SUM(x.totalantrean) - SUM(x.sudahdipanggil) AS sisaantrean,                    
        SUM(x.totalantrean) AS totalantrean
        FROM (
            SELECT COUNT(apd.norec) AS totalantrean,
            apd.noantrian,
            ru.prefixnoantrian,
            ru.namaruangan AS namapoli,
            CASE WHEN CAST(apd.statusantrian AS INTEGER) = 0 THEN 1 ELSE 0 END AS belumdipanggil,
            CASE WHEN CAST(apd.statusantrian AS INTEGER) = 1 THEN 1 ELSE 0 END AS sudahdipanggil
            FROM antrianpasiendiperiksa_t AS apd
            INNER JOIN pasiendaftar_t pd ON pd.norec = apd.noregistrasifk
            INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
            LEFT JOIN pegawai_m AS pg ON pg.id = pd.objectpegawaifk
            WHERE pd.kdprofile = $kdProfile
            AND pd.tglregistrasi between '$tglAwal' AND '$tglAkhir'
            AND ru.id = '$kdInternalRuangan'
            AND pd.statusenabled = true
            GROUP BY apd.noantrian,
            ru.prefixnoantrian,
            ru.namaruangan,
            apd.statusantrian
        ) AS x
        GROUP BY x.namapoli    
        LIMIT 1"));
      
        $pegawai = Pegawai::where('id', $kodeDokter)->first();
        $pangil = collect(DB::select("
            SELECT apd.noantrian, ru.prefixnoantrian
            FROM antrianpasiendiperiksa_t AS apd
            INNER JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk AND apd.objectruanganfk = pd.objectruanganlastfk
            INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
            WHERE pd.tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir'
            AND ru.id = '$kdInternalRuangan' 
            AND pd.statusenabled = true 
            and apd.statusantrian = '1'
            order by apd.noantrian desc 
        "))->first();
        $nomorNA = collect(DB::select("
            SELECT apd.noantrian, ru.prefixnoantrian
            FROM antrianpasiendiperiksa_t AS apd
            INNER JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk AND apd.objectruanganfk = pd.objectruanganlastfk
            INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
            WHERE pd.statusschedule = '$request[kodebooking]'
            AND pd.statusenabled = true  
        "))->first();


        $nomorPanggil = 0;
        if ($nomorNA->noantrian == 1) {
            $sisa = 0;
        } else {
            $sisa = $nomorNA->noantrian - (!empty($pangil->noantrian) ? $pangil->noantrian : 0);
        }
        if ($sisa < 0) {
            $sisa = 0;
        }
        if (!empty($pangil)) {
            $nomorPanggil =  ($pangil->prefixnoantrian != null ? $pangil->prefixnoantrian : 'Z') . '-' . str_pad($pangil->noantrian, 4, "0", STR_PAD_LEFT);
        }

        $nomorPanggilNA = 0;
        if (!empty($nomorNA)) {
            $nomorPanggilNA =  ($nomorNA->prefixnoantrian != null ? $nomorNA->prefixnoantrian : 'Z') . '-' . str_pad($nomorNA->noantrian, 4, "0", STR_PAD_LEFT);
        }

        $result = [];
        foreach ($getStatusAntrian AS $item){
            $estimasidilayani = 0;
            if ((int)$sisa == 0) {
                $estimasidilayani = 0;
            } else  if ((int)$sisa == 1) {
                $estimasidilayani = 1800 * 1; //dalam detik (30 menit)
            } else {
                $estimasidilayani = 1800 * ((int)$sisa - 1);
            }
            $result = array(
                "nomorantrean" => $nomorPanggilNA,
                "namapoli" => $item->namapoli,
                "namadokter" =>  !empty($pegawai) ? $pegawai->namalengkap : '-',
                "sisaantrean" => $sisa, // $item->sisaantrean,
                "antreanpanggil" => $nomorPanggil,
                "waktutunggu" => $estimasidilayani,
                "keterangan" => ""
            );
        }
        try {
            if(count($result) > 0){
                $result = array(
                    "response" => $result,
                    "metadata"=>
                        array(
                            'message' => "Ok",
                            'code' => 200,
                        )
                );
            }else{
                $result = array(
                    "metadata"=>
                        array(
                            'message' => "Belum ada data yang bisa ditampilkan",
                            'code' => 201,
                        )
                );
            }
        } catch (Exception $e) {
            $result = array(
                "metadata"=>
                    array(
                        'message' => "Gagal menampilkan data",
                        'code' => 201,
                    )
            );
        }
        return $this->respond($result);
    }

    public function GetStatusAntrian_fix(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $Datareq = $request->json()->all();

        $kodeDokter = $Datareq['kodedokter'];
        $kdInternalRuangan =  $Datareq['kodepoli'];
        $tglAwal = date('Y-m-d',strtotime($Datareq['tanggalperiksa'])) .' 00:00:00';
        $tglAkhir = date('Y-m-d',strtotime($Datareq['tanggalperiksa'])) .' 23:59:59';

        if($Datareq['tanggalperiksa'] != date('Y-m-d',strtotime( $Datareq['tanggalperiksa']))){
            $result = array("metadata" => array("message" => "Format Tanggal Tidak Sesuai, format yang benar adalah yyyy-mm-dd", "code" => 201));
            return $this->respond($result);
        }

        if($tglAwal < date('Y-m-d') .' 00:00:00'){
            $result = array("metadata" => array("message" => "Tanggal Periksa Tidak Berlaku", "code" => 201));
            return $this->respond($result);
        }

        try {

            $ruang = Ruangan::where('kdinternal', $kdInternalRuangan)
                    ->whereRaw(" ( iseksekutif=false or iseksekutif is null ) ")
                    ->where('statusenabled', true)
                    ->where('kdprofile', $kdProfile)->first();

            if (empty($ruang)) {
                $result = array("metadata" => array("message" => "Poli Tidak Ditemukan", "code" => 201));
                return $this->respond($result);
            }

            $ruangan = DB::table('ruangan_m as ru')
            ->join('slottingonline_m as slot', 'slot.objectruanganfk', '=', 'ru.id')
            ->select(
                'ru.id',
                'ru.namaruangan',
                'ru.objectdepartemenfk',
                'slot.jambuka',
                'slot.jamtutup',
                'slot.quota',
                DB::raw("(EXTRACT(EPOCH FROM slot.jamtutup) - EXTRACT(EPOCH FROM slot.jambuka))/3600 as totaljam")
            )
            ->where('ru.statusenabled', true)
            ->where('ru.id',  $ruang->id)
            ->where('ru.kdprofile', $kdProfile)
            ->where('slot.statusenabled', true)
            ->first();
            $kuota  = 0;
            if (!empty($ruangan)) {
                $kuota = $ruangan->quota;
            }
            
            $getStatusAntrian = DB::select(DB::raw("
            SELECT  x.namapoli,
            SUM(x.totalantrean) - SUM(x.sudahdipanggil) AS sisaantrean,                    
            SUM(x.totalantrean) AS totalantrean
            FROM (
                SELECT COUNT(apd.norec) AS totalantrean,
                apd.noantrian,
                ru.prefixnoantrian,
                ru.namaruangan AS namapoli,
                CASE WHEN CAST(apd.statusantrian AS INTEGER) = 0 THEN 1 ELSE 0 END AS belumdipanggil,
                CASE WHEN CAST(apd.statusantrian AS INTEGER) = 1 THEN 1 ELSE 0 END AS sudahdipanggil
                FROM antrianpasiendiperiksa_t AS apd
                INNER JOIN pasiendaftar_t pd ON pd.norec = apd.noregistrasifk
                INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
                LEFT JOIN pegawai_m AS pg ON pg.id = pd.objectpegawaifk
                WHERE pd.kdprofile = $kdProfile
                AND pd.tglregistrasi between '$tglAwal' AND '$tglAkhir'
                AND ru.kdinternal = '$kdInternalRuangan'
                AND pd.statusenabled = true
                GROUP BY apd.noantrian,
                ru.prefixnoantrian,
                ru.namaruangan,
                apd.statusantrian
            ) AS x
            GROUP BY x.namapoli    
            LIMIT 1"));

            $pegawai = Pegawai::where('kddokterbpjs', $kodeDokter)->first();
            $pangil = collect(DB::select("
                SELECT apd.noantrian, ru.prefixnoantrian
                FROM antrianpasiendiperiksa_t AS apd
                INNER JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk AND apd.objectruanganfk = pd.objectruanganlastfk
                INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
                WHERE pd.tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir'
                AND ru.kdinternal = '$kdInternalRuangan' 
                AND pd.statusenabled = true 
                and apd.statusantrian = '1'
                order by apd.noantrian desc 
            "))->first();

            $nomorPanggil = 0;
            if (!empty($pangil)) {
                $nomorPanggil =  ($pangil->prefixnoantrian != null ? $pangil->prefixnoantrian : 'Z') . '-' . str_pad($pangil->noantrian, 4, "0", STR_PAD_LEFT);
            }
            $result = array(
                "namapoli" => count($getStatusAntrian) > 0 ? $getStatusAntrian[0]->namapoli : '-',
                "namadokter" => !empty($pegawai) ? $pegawai->namalengkap : '-',
                "totalantrean" =>  count($getStatusAntrian) > 0 ? $getStatusAntrian[0]->totalantrean : 0,
                "sisaantrean" => count($getStatusAntrian) > 0 ? $getStatusAntrian[0]->sisaantrean : 0,
                "antreanpanggil" => $nomorPanggil,
                "sisakuotajkn" => $kuota - (count($getStatusAntrian) > 0 ? $getStatusAntrian[0]->totalantrean : 0),
                "kuotajkn" => $kuota,
                "sisakuotanonjkn" => $kuota - (count($getStatusAntrian) > 0 ? $getStatusAntrian[0]->totalantrean : 0),
                "kuotanonjkn" => $kuota,
                "keterangan" => ""
            );

            if(count($getStatusAntrian) > 0){
                $result = array(
                    "response" => $result,
                    "metadata"=>
                        array(
                            'message' => "Ok",
                            'code' => 200,
                        )
                );
            }else{
                $result = array(
                    "metadata"=>
                        array(
                            'message' => "Belum ada data yang bisa ditampilkan",
                            'code' => 201,
                        )
                );
            }
        } catch (\Exception $e) {
            $result = array(
                "metadata"=>
                    array(
                        'message' => "Gagal menampilkan data",
                        'code' => '201',
                    )
            );
        }
        return $this->respond($result);
    }

    public function saveCheckInAntrean_fix(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $userData = $request->all();
        $request = $request->json()->all();
        $t =  $request['waktu'];
        $tglRegis = date('Y-m-d H:i:s', $t / 1000);
        $tglRegBulan = date('Y-m-d', $t / 1000);;
        if (empty($request['kodebooking'])) {
            $result = array("metadata" => array("message" => "Kode Booking Belum Diisi", "code" => 201));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }

        if (empty($request['waktu'])) {
            $result = array("metadata" => array("message" => "Waktu Belum Diisi", "code" => 201));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }

        $data = DB::table('antrianpasienregistrasi_t as apr')
        ->leftJoin('pasiendaftar_t as pd','pd.statusschedule','=','apr.noreservasi')
        ->leftJoin('pegawai_m as pg','pg.id','=','apr.objectpegawaifk')
        ->leftJoin('ruangan_m as ru','ru.id','=','apr.objectruanganfk')
        ->selectRaw("
                apr.*,pg.namalengkap,ru.namaruangan,ru.objectdepartemenfk,pd.ischeckin
            ")
        ->where('apr.kdprofile', $kdProfile)
        ->where('apr.statusenabled', true)
        ->where('apr.noreservasi', $request['kodebooking'])
        ->first();
        if (empty($data)) {
            $result = array(
                "metadata" => array(
                    "message" => 'Kode Booking ini tidak ada',
                    "code" => 201
                )
            );

            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        } else {
            if($data->ischeckin){
                $result = array("metadata" => array("message" => "Anda sudah melakukan checkin", "code" => 201));
                return $this->setStatusCode($result['metadata']['code'])->respond($result);
            }

            if(date('Y-m-d') != date("Y-m-d", strtotime($data->tanggalreservasi))){
                $result = array("metadata" => array("message" => "Bukan waktunya untuk melakukan checkin", "code" => 201));
                return $this->setStatusCode($result['metadata']['code'])->respond($result);
            }
        }
        DB::beginTransaction();
        try {

            AntrianPasienRegistrasi::where('norec',$data->norec)->update([
                'isconfirm' => true
            ]); 
            PasienDaftar::where('statusschedule',$data->noreservasi)->update([
                'ischeckin' => true,
            ]);
            date_default_timezone_set("Asia/Makassar");
            $json = array(
                "kodebooking" => $data->noreservasi,
                "taskid" => 3, //pasien lama langsung task 3 //(akhir waktu layan admisi/mulai waktu tunggu poli)
                "waktu" => strtotime(date('Y-m-d H:i:s')) * 1000,
            );
            $objetoRequest = new \Illuminate\Http\Request();
            $objetoRequest['url'] = "antrean/updatewaktu";
            $objetoRequest['jenis'] = "antrean";
            $objetoRequest['method'] = "POST";
            $objetoRequest['data'] = $json;
            $objetoRequest['userData'] = $userData['userData'];
            $post = app('App\Http\Controllers\Bridging\BridgingBPJSV2Controller')->bpjsTools($objetoRequest);

            $datapd = PasienDaftar::where('statusschedule',$data->noreservasi)->first();
            $objetoRequest2 = new \Illuminate\Http\Request();
            $objetoRequest2['noregistrasifk'] = $datapd->norec;
            $objetoRequest2['taskid'] = 3;
            $objetoRequest2['waktu'] = strtotime(date('Y-m-d H:i:s')) * 1000;
            $objetoRequest2['statuskirim'] = false;
            $objetoRequest2['userData'] = $userData['userData'];
            $post2 = app('App\Http\Controllers\RawatJalan\RawatJalanController')->saveMonitoringTaksId($objetoRequest2);

            $dataapd = AntrianPasienDiperiksa::where('noregistrasifk', $datapd->norec)
            ->where('objectruanganfk', $datapd->objectruanganlastfk)
            ->first();
            $objetoRequest3 = new \Illuminate\Http\Request();
            $objetoRequest3['norec'] = $datapd->norec;
            $objetoRequest3['norec_apd'] = $dataapd->norec;
            $objetoRequest3['userData'] = $userData['userData'];
            $post3 = app('App\Http\Controllers\Registrasi\RegistrasiController')->saveAdministrasi($objetoRequest3);

            $transStatus = 'true';
            $transMessage = "Ok";
        } catch (Exception $e) {
            $transMessage = "Gagal Check In";
            $transStatus = 'false';
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "metadata" => array(
                    "message" => $transMessage,
                    "code" => 200)
            );
        }else{
            DB::rollBack();
            $result = array(
                "metadata" => array(
                    "message" => $transMessage,
                    "code" => 201)
            );

        }
        return $this->setStatusCode($result['metadata']['code'])->respond($result);
    }

    public function saveBatalAntrean_fix(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $request = $request->json()->all();

        if (empty($request['kodebooking'])) {
            $result = array("metadata" => array("message" => "Antrean Tidak Ditemukan", "code" => 201));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }

        if (empty($request['keterangan'])) {
            $result = array("metadata" => array("message" => "Keterangan Belum Diisi", "code" => 201));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }
        DB::beginTransaction();
        try {

            $data = DB::table('pasiendaftar_t')
                    ->where('kdprofile', $kdProfile)
                    // ->where('statusenabled', true)
                    ->where('statusschedule', $request['kodebooking'])
                    ->first();
            if (empty($data)){
                DB::rollBack();
                $result = array(
                    "metadata" => array(
                        "message" => "Antrean Tidak Ditemukan",
                        "code" => 201
                    )
                );
                return $this->setStatusCode($result['metadata']['code'])->respond($result);
            }else{
                if($data->statusenabled == false){
                    $result = array(
                        "metadata" => array(
                            "message" => "Antrean Tidak Ditemukan atau Sudah Dibatalkan",
                            "code" => 201
                        )
                    );
                    return $this->setStatusCode($result['metadata']['code'])->respond($result);
                }
                if($data->ischeckin == true){
                    DB::rollBack();
                    $result = array(
                        "metadata" => array(
                            "message" => "Pasien Sudah Dilayani, Antrean Tidak Dapat Dibatalkan",
                            "code" => 201
                        )
                    );
                    return $this->setStatusCode($result['metadata']['code'])->respond($result);
                }
                $dataperjanjian = DB::table('antrianpasienregistrasi_t')
                ->where('kdprofile', $kdProfile)
                ->where('statusenabled', true)
                ->where('noreservasi', $request['kodebooking'])
                ->update([
                    'statusenabled' => false,
                    'isbatal' => false,
                    'keteranganbatal' => $request['kodebooking'],
                ]);
                $pendaftaran = DB::table('pasiendaftar_t')
                ->where('kdprofile', $kdProfile)
                ->where('statusenabled', true)
                ->where('statusschedule', $request['kodebooking'])
                ->update([
                    'statusenabled' => false,
                ]);
                $antrianpasien = DB::table('antrianpasiendiperiksa_t')
                ->where('kdprofile', $kdProfile)
                ->where('statusenabled', true)
                ->where('noregistrasifk', $data->norec)
                ->update([
                    'statusenabled' => false,
                ]);
                
            }

            $transStatus = 'true';
            $transMessage = "Ok";
        } catch (Exception $e) {
            $transMessage = "Gagal Batal Antrean";
            $transStatus = 'false';
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "metadata" => array(
                    "message" => $transMessage,
                    "code" => 200)
            );
        }else{
            DB::rollBack();
            $result = array(
                "metadata" => array(
                    "message" => $transMessage,
                    "code" => 201)
            );

        }
        return $this->setStatusCode($result['metadata']['code'])->respond($result);
    }

    public function savePasienBaru_fix(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $request = $request->json()->all();

        if (empty($request['nomorkartu'])) {
            $result = array("metadata" => array("message" => "Nomor Kartu Belum Diisi", "code" => 201));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }
    
        if (!is_numeric($request['nomorkartu']) || strlen($request['nomorkartu']) < 13) {
            $result = array("metadata" => array("message" => "Format Nomor Kartu Tidak Sesuai", "code" => 201));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }
        

        if (empty($request['nik'])) {
            $result = array("metadata" => array("message" => "NIK Belum Diisi", "code" => 201));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }

        if (!is_numeric($request['nik']) || strlen($request['nik']) < 16) {
            $result = array("metadata" => array("message" => "Format NIK Tidak Sesuai ", "code" => 201));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }
        if (empty($request['nomorkk'])) {
            $result = array("metadata" => array("message" => "Nomor KK Belum Diisi", "code" => 201));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }

        if (empty($request['nama'])) {
            $result = array("metadata" => array("message" => "Nama Belum Diisi", "code" => 201));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }

        if (empty($request['jeniskelamin'])) {
            $result = array("metadata" => array("message" => "Jenis Kelamin Belum Dipilih", "code" => 201));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }

        if (empty($request['tanggallahir'])) {
            $result = array("metadata" => array("message" => "Tanggal Lahir Belum Diisi", "code" => 201));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }
        if($request['tanggallahir'] != date('Y-m-d',strtotime($request['tanggallahir'])) || date('Y-m-d',strtotime($request['tanggallahir'])) > date('Y-m-d')){
            $result = array("metadata" => array("message" => "Format Tanggal Lahir tidak Sesuai", "code" => 201));
            return $this->respond($result);
        }

        if (empty($request['nohp'])) {
            $result = array("metadata" => array("message" => "No hp tidak boleh kosong", "code" => 201));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }

        if (empty($request['alamat'])) {
            $result = array("metadata" => array("message" => "Alamat Belum Diisi", "code" => 201));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }
        if (empty($request['kodeprop'])) {
            $result = array("metadata" => array("message" => "Kode Propinsi Belum Diisi", "code" => 201));
            return 
            $this->setStatusCode($result['metadata']['code'])->respond($result);
        }
        if (empty($request['namaprop'])) {
            $result = array("metadata" => array("message" => "Nama Propinsi Belum Diisi", "code" => 201));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }
        if (empty($request['kodedati2'])) {
            $result = array("metadata" => array("message" => "Kode Dati 2 Belum Diisi", "code" => 201));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }
        if (empty($request['namadati2'])) {
            $result = array("metadata" => array("message" => "Dati 2 Belum Diisi", "code" => 201));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }
        if (empty($request['kodekec'])) {
            $result = array("metadata" => array("message" => "Kode Kecamatan Belum Diisi", "code" => 201));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }
        if (empty($request['namakec'])) {
            $result = array("metadata" => array("message" => " Kecamatan Belum Diisi", "code" => 201));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }
        if (empty($request['kodekel'])) {
            $result = array("metadata" => array("message" => "Kode Kelurahan Belum Diisi", "code" => 201));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }
        if (empty($request['namakel'])) {
            $result = array("metadata" => array("message" => "Kelurahan Belum Diisi ", "code" => 201));
           
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }
        if (empty($request['rt'])) {
            $result = array("metadata" => array("message" => "RT Belum Diisi", "code" => 201));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }
        if (empty($request['rw'])) {
            $result = array("metadata" => array("message" => "RW Belum Diisi", "code" => 201));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }
        $propinsi = DB::table('propinsi_m')
             ->select('id','namapropinsi')
             ->where('kodebpjs',$request['kodeprop'])
             ->first();
        $jk = JenisKelamin::where('reportdisplay', strtoupper($request['jeniskelamin']))
              ->select('id','jeniskelamin','reportdisplay')
              ->first();
        $pasien = array(
            'namaPasien'=> $request['nama'],
            'noIdentitas'=> $request['nik'],
            'namaSuamiIstri'=> 'null',
            'noAsuransiLain'=> null,
            'noBpjs' => $request['nomorkartu'],
            'noHp' => $request['nohp'],
            'tempatLahir' => null,
            'namaKeluarga' => null,
            'tglLahir' => date('Y-m-d H:i:s',strtotime($request['tanggallahir'])),
            'image' => 'null',
            'nomorkk' => $request['nomorkk'],
        );
        $cek = Pasien::where('noidentitas',$request['nik'])->where('statusenabled',true)->first();
        if(!empty($cek)){
            $result = array("metadata" => array("message" => "Data Peserta sudah pernah dientrikan", "code" => 201));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }
         
        DB::beginTransaction();
        try {
            if (!empty($request)){

                $objetoRequest = new \Illuminate\Http\Request();
                $objetoRequest ['isbayi'] = false;
                $objetoRequest ['istriageigd'] = false;
                $objetoRequest ['isPenunjang'] = false;
                $objetoRequest ['idpasien'] = '';
                $objetoRequest ['pasien'] = $pasien;
                $objetoRequest ['agama'] = ['id' => null];
                $objetoRequest ['jenisKelamin'] = $jk->id;
                $objetoRequest ['pekerjaan'] = [ 'id' => null];
                $objetoRequest ['pendidikan'] = [ 'id' => null];
                $objetoRequest ['statusPerkawinan'] = null;
                $objetoRequest ['golonganDarah'] = null;
                $objetoRequest ['suku'] = null;
                $objetoRequest ['namaIbu'] = null;
                $objetoRequest ['noTelepon'] = $request['nohp'];
                $objetoRequest ['noAditional'] = null;
                $objetoRequest ['kebangsaan'] = null;
                $objetoRequest ['negara'] = ['id' => 0];
                $objetoRequest ['namaAyah'] = null;
                $objetoRequest ['alamatLengkap'] = $request['alamat'];
                $objetoRequest ['desaKelurahan'] = null;
                $objetoRequest ['namaDesaKelurahan'] = $request['namakel'];
                $objetoRequest ['kecamatan'] = null;
                $objetoRequest ['namaKecamatan'] = $request['namakec'];
                $objetoRequest ['kotaKabupaten'] = null;
                $objetoRequest ['namaKotaKabupaten'] = $request['namadati2'];
                $objetoRequest ['propinsi'] =  $propinsi->id;
                $objetoRequest ['namapropinsi'] = $request['namaprop'];
                $objetoRequest ['kodePos'] = null;
                $objetoRequest ['penanggungjawab'] = null;
                $objetoRequest ['hubungankeluargapj'] = null;
                $objetoRequest ['pekerjaanpenangggungjawab'] = null;
                $objetoRequest ['ktppenanggungjawab'] = null;
                $objetoRequest ['alamatrmh'] = null;
                $objetoRequest ['alamatktr'] = null;
                $objetoRequest ['teleponpenanggungjawab'] = null;
                $objetoRequest ['bahasa'] = null;
                $objetoRequest ['jeniskelaminpenanggungjawab'] = null;
                $objetoRequest ['umurpenanggungjawab'] = null;
                $objetoRequest ['dokterpengirim'] = null;
                $objetoRequest ['alamatdokter'] = null;
                $objetoRequest ['rtrw'] = $request['rt'] . '/' . $request['rw'];
                $objetoRequest ['isjkn'] = true;
                $objetoRequest ['userData'] = $request['userData'];
                $cek = app('App\Http\Controllers\Registrasi\RegistrasiController')->savePasienFix($objetoRequest);
                $simpan = json_decode($cek->content(), true);
            }

            $transStatus = 'true';
            $transMessage = "Ok";
        } catch (Exception $e) {
            $transMessage = "Gagal Check In";
            $transStatus = 'false';
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "response" => array(
                    "norm" => $simpan['response']['norm']
                ),
                "metadata" => array(
                    "message" => 'Harap datang ke adminsi untuk melengkapi data rekam medis',
                    "code" => 200)
            );
        }else{
            DB::rollBack();
            $result = array(
                "metadata" => array(
                    "message" => $transMessage,
                    "code" => 201)
            );

        }
        return $this->setStatusCode($result['metadata']['code'])->respond($result);
    }

    public function getKodeBokingOperasi_fix(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $request = $request->json()->all();
        if (empty($request['nopeserta'])) {
            $result = array("metadata" => array("message" => "Nomor Kartu Belum Diisi", "code" => 201));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }
    
        if (!is_numeric($request['nopeserta']) || strlen($request['nopeserta']) < 13) {
            $result = array("metadata" => array("message" => "Format Nomor Kartu Tidak Sesuai", "code" => 201));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }
        $depbedah = $this->settingDataFixed('KdInstalasiBedahSentral', $kdProfile);
        try {
            $data = DB::select(DB::raw("SELECT
                    so.noorder as kodebooking,
                    so.tglpelayananawal  as tanggaloperasi,
                    pr.namaproduk as jenistindakan,
                    ru.kdinternal as kodepoli,
                        ru.namaexternal AS namapoli,
                    pas.nocm,
                    pd.noregistrasi,pas.nobpjs
                      
                    FROM
                        strukorder_t AS so
                    join orderpelayanan_t as op on op.noorderfk=so.norec
                    join produk_m as pr on pr.id=op.objectprodukfk
                    LEFT JOIN pasiendaftar_t AS pd ON pd.norec = so.noregistrasifk
                    INNER JOIN pasien_m AS pas ON pas.id = pd.nocmfk
                    LEFT JOIN ruangan_m AS ru ON ru.id = so.objectruanganfk
                    LEFT JOIN ruangan_m AS ru2 ON ru2.id = so.objectruangantujuanfk
                    
                    WHERE
                        so.kdprofile = $kdProfile
                    --AND pas.nocm ILIKE '%11233764%'
                        and pas.nobpjs='$request[nopeserta]'
                    AND ru2.objectdepartemenfk = $depbedah
                    AND so.statusenabled = true
                    and so.statusorder is null
                    and ru.kdinternal is not null
                    and pd.objectkelompokpasienlastfk=2
                    ORDER BY
                        so.tglorder desc"));
            $list = [];
            foreach ($data as $k){
                $list [] = array(
                    'kodebooking' => $k->kodebooking,
                    'tanggaloperasi' => date('Y-m-d',strtotime($k->tanggaloperasi)),
                    'jenistindakan' => $k->jenistindakan,
                    'kodepoli' => $k->kodepoli,
                    'namapoli' => $k->namapoli,
                    'terlaksana' => 0,
                );
            }

            if(count($list) > 0){
                $result = array(
                    "response" =>
                        array(
                            "list" => $list,
                        ),
                    "metadata"=>
                        array(
                            'code' => 200,
                            'message' => "OK"
                        )
                );
            }else{
                $result = array(
                    "metadata"=>
                        array(
                            'code' => 201,
                            'message' => "Belum ada data yang bisa ditampilkan"
                        )
                );
            }


        } catch (Exception $e) {
            $result = array(
                "response" =>
                    null,
                "metadata"=>
                    array(
                        'code' => 201,
                        'message' => "Gagal menampilkan data"
                    )
            );
        }
        return $this->respond($result);
    }

    public function getJadwalOperasi_fix(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $request = $request->json()->all();
        if((!isset($request['tanggalawal']) &&  empty($request['tanggalawal']) )
            && (!isset($request['tanggalakhir']) &&  empty($request['tanggalakhir']))) {
            $result = array("metadata"=>array("message" => "Tanggal Awal dan Akhir tidak boleh kosong", "code" => 201));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }
        if($request['tanggalawal'] >  $request['tanggalakhir']) {
            $result = array("metadata"=>array("message" => "Tanggal Akhir Tidak Boleh Kecil dari Tanggal Awal ","code" => 201));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }
        $depbedah = $this->settingDataFixed('KdInstalasiBedahSentral', $kdProfile);
        try {
            $data = DB::select(DB::raw("SELECT
                    so.noorder as kodebooking,
                    so.tglpelayananawal  as tanggaloperasi,
                    pr.namaproduk as jenistindakan,
                    ru.kdinternal as kodepoli,
                        ru.namaexternal AS namapoli,
                    pas.nocm,
                    pd.noregistrasi,pas.nobpjs,
                    so.statusorder,pd.objectkelompokpasienlastfk
                      
                    FROM
                        strukorder_t AS so
                    join orderpelayanan_t as op on op.noorderfk=so.norec
                    join produk_m as pr on pr.id=op.objectprodukfk
                    LEFT JOIN pasiendaftar_t AS pd ON pd.norec = so.noregistrasifk
                    INNER JOIN pasien_m AS pas ON pas.id = pd.nocmfk
                    LEFT JOIN ruangan_m AS ru ON ru.id = so.objectruanganfk
                    LEFT JOIN ruangan_m AS ru2 ON ru2.id = so.objectruangantujuanfk
                    
                    WHERE
                        so.kdprofile = $kdProfile
                    --AND pas.nocm ILIKE '%11233764%'
                    AND ru2.objectdepartemenfk = $depbedah
                    AND so.statusenabled = true
                    --and so.statusorder is null
                    and ru.kdinternal is not null
                    and so.tglpelayananawal between '$request[tanggalawal] 00:00:00' and '$request[tanggalakhir] 23:59:59'
                    ORDER BY
                        so.tglorder desc"));
            $list = [];
            foreach ($data as $k){
                $stt = $k->statusorder;
                if( $k->statusorder == null){
                    $stt = 0;
                }
                //1 sudah dilaksanakan , 0 belum ,2 batal

                $list [] = array(
                    'kodebooking' => $k->kodebooking,
                    'tanggaloperasi' => date('Y-m-d',strtotime($k->tanggaloperasi)),
                    'jenistindakan' => $k->jenistindakan,
                    'kodepoli' => $k->kodepoli,
                    'namapoli' => $k->namapoli,
                    'terlaksana' => $stt ,
                    'nopeserta' => $k->objectkelompokpasienlastfk != 2 ? '': $k->nobpjs,
                    'lastupdate' => round(microtime(true) * 1000)
                );
            }

            if(count($list) > 0){
                $result = array(
                    "response" =>
                        array(
                            "list" => $list,
                        ),
                    "metadata"=>
                        array(
                            'message' => "OK",
                            'code' => 200,
                        )
                );
            }else{
                $result = array(
                    "metadata"=>
                        array(
                            'message' => "Belum ada data yang bisa ditampilkan",
                            'code' => 201,
                        )
                );
            }


        } catch (Exception $e) {
            $result = array(
                "metadata"=>
                    array(
                        'message' => "Gagal menampilkan data",
                        'code' => 201,
                    )
            );
        }
        return $this->respond($result);
    }

    public function GetJamKosong($kode,$tgl,$kdProfile,$eksek){
        $ruang = Ruangan::where('kdinternal',$kode)
            ->whereRaw(" ( iseksekutif=false or iseksekutif is null ) ")
            ->where('statusenabled',true)
            ->where('kdprofile',$kdProfile)->first();
       
       if(empty($ruang)){
           $result = array("response"=>null,"metadata"=>array("code" => "400","message" => "Kodepoli tidak sesuai"));
           return $this->setStatusCode($result['metadata']['code'])->respond($result);
       }
        $dataReservasi = DB::table('antrianpasienregistrasi_t as apr')
        ->select('apr.norec','apr.tanggalreservasi')
        ->whereRaw(" to_char(apr.tanggalreservasi,'yyyy-MM-dd') = '$tgl'")
        ->where('apr.objectruanganfk', $ruang->id)
        ->where('apr.noreservasi','!=','-')
        ->whereNotNull('apr.noreservasi')
        ->where('apr.statusenabled',true)
        ->where('apr.kdprofile',$kdProfile)
        ->whereRaw(" (apr.isbatal != false or apr.isbatal is null)")
        ->orderBy('apr.tanggalreservasi')
        ->get();

        $ruangan = DB::table('ruangan_m as ru')
        ->join('slottingonline_m as slot', 'slot.objectruanganfk', '=', 'ru.id')
        ->select('ru.id', 'ru.namaruangan', 'ru.objectdepartemenfk', 'slot.jambuka', 'slot.jamtutup',
            'slot.quota',
            DB::raw("(EXTRACT(EPOCH FROM slot.jamtutup) - EXTRACT(EPOCH FROM slot.jambuka))/3600 as totaljam"))
        ->where('ru.statusenabled', true)
        ->where('ru.id',  $ruang->id)
        ->where('ru.kdprofile',$kdProfile)
        ->where('slot.statusenabled', true)
        ->first();
        
        if(empty($ruangan)){
            $result = array("response"=>null,"metadata"=>array("code" => "400","message" => "Jadwal penuh"));
            return array("antrian" => 0, "jamkosong" => "00:00");
        }

        $begin = new Carbon($ruangan->jambuka);
        $jamBuka = $begin->format('H:i');
        $end = new Carbon($ruangan->jamtutup);
        $jamTutup = $end->format('H:i');
        $quota =(float)$ruangan->quota;
        $waktuPerorang = round(((float)$ruangan->totaljam / (float)$ruangan->quota) * 60, 1);

        $i = 0;
        $slotterisi = 0;
        $jamakhir = '00:00';
        $reservasi = [];
        foreach ($dataReservasi as $items){
            $jamUse =  new Carbon($items->tanggalreservasi);
            $slotterisi += 1;
            $reservasi [] = array(
                'jamreservasi' => $jamUse->format('H:i')
            );
            $jamakhir = $jamUse->format('H:i');
        }

        $intervals = [];
        $intervalsAwal  = [];
        $begin = new \DateTime($jamBuka);
        $end = new \DateTime($jamTutup);
        $interval = \DateInterval::createFromDateString(floor($waktuPerorang).' minutes');
    
        $period = new \DatePeriod($begin, $interval, $end);
        foreach ($period as $dt) {
            $intervals[] = array(
                'jam'=>  $dt->format("H:i")
            );
            $intervalsAwal[] = array(
                'jam'=>  $dt->format("H:i")
            );
        }
        if(count($intervals) == 0){
            return array("antrian"=> 0,"jamkosong"=>"00:00");
        }
      
        if (count($reservasi) > 0) {
            for ( $j = count($reservasi) - 1; $j >= 0; $j--) {
                for ( $k =count($intervals)- 1; $k >= 0; $k--) {
                    if ($intervals[$k]['jam'] == $reservasi[$j]['jamreservasi']) {
                        array_splice($intervals,$k,1);
                    }
                }
            }
        }
      
        if(count($intervals) > 0){

            $antrian = 1;
            for ($x = 0; $x <= count($intervalsAwal); $x++) {
                if($intervals[0]['jam']== $intervalsAwal[$x]['jam']){
                    $antrian = $x +1;
                    // dd($antrian);
                    break;
                }
            }

            return array("antrian"=> $antrian+1,"jamkosong"=>$intervals[0]['jam'], "kuota" => $quota);
        }else{
            return array("antrian"=> 0,"jamkosong"=>"00:00");
        }

    }

    public function jalurMasuk(Request $request)
    {
        $url = $request['url'];
        switch ($url) {
            case 'auth':
                return app('App\Http\Controllers\Auth\LoginController')->getTokens($request);
                break;
            case 'ambilantrean':
                return $this->GetAntrean_fix($request);
                break;
            case 'statusantrean':
                return $this->GetStatusAntrian_fix($request);
                break;
            case 'sisaantrean':
                return $this->GetSisaAntrean_fix($request);
                break;
            case 'batalantrean':
                return $this->saveBatalAntrean_fix($request);
                break;
            case 'checkinantrean':
                return $this->saveCheckInAntrean_fix($request);
                break;
            case 'pasienbaru':
                return $this->savePasienBaru_fix($request);
                break;
            case 'jadwaloperasipasien':
                return $this->getKodeBokingOperasi_fix($request);
                break;
            case 'jadwaloperasirs':
                return $this->getJadwalOperasi_fix($request);
                break;
        }
    }
}
