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
use App\Master\JenisKelamin;
use App\Master\Pasien;
use App\Master\Pegawai;
use App\Master\SlottingOnline;
use App\Master\SlottingLibur;
use App\Master\Ruangan;
use App\Web\Profile;
use Carbon\Carbon;
//use Faker\Provider\DateTime;
use Carbon\CarbonPeriod;
use Illuminate\Http\Request;
use App\Traits\PelayananPasienTrait;
use App\Traits\Valet;
use DB;
use App\Transaksi\AntrianPasienRegistrasi;
use Webpatser\Uuid\Uuid;
use App\Transaksi\ListNotif;
use App\Transaksi\LoggingUser;


class ReservasiOnlineController extends ApiController
{
    use Valet, PelayananPasienTrait;

    public function __construct() {
        parent::__construct($skip_authentication=false);
    }

	public function getComboReservasi(Request $request)
	{
        $kdProfile = $this->getDataKdProfile($request);
        // return  $kdProfile;
		$deptJalan = explode (',',$this->settingDataFixed('kdDepartemenReservasiOnline',   $kdProfile ));
		$kdDepartemenRawatJalan = [];
		foreach ($deptJalan as $item){
			$kdDepartemenRawatJalan []=  (int)$item;
		}

		$dataRuanganJalan = \DB::table('ruangan_m as ru')
			->select('ru.id','ru.namaruangan','ru.objectdepartemenfk')
			->where('ru.statusenabled', true)
            ->where('ru.kdprofile', $kdProfile)
			->wherein('ru.objectdepartemenfk', $kdDepartemenRawatJalan)
			->orderBy('ru.namaruangan')
			->get();
            
        $slotting = \DB::table('slottingonline_m as slot')
            ->join('ruangan_m as ru', 'slot.objectruanganfk', '=', 'ru.id')
            ->join('pegawai_m as pg', 'slot.objectpegawaifk', '=', 'pg.id')
            ->select('ru.namaruangan', 'ru.id')
            ->where('pg.statusenabled', true)
            ->where('ru.statusenabled', true)
            ->where('slot.statusenabled', true)
            ->where('slot.quota','>',0)
            ->groupBy('ru.namaruangan', 'ru.id')
            ->get();
        $ruanganAvailable = []; 
        foreach ($dataRuanganJalan as $ru) {
            foreach ($slotting as $items){
                if ($ru->id == $items->id) {
                    $ruanganAvailable[] = $ru;
                }
            }
        }

		$jk = \DB::table('jeniskelamin_m')
			->select('id','jeniskelamin')
			->where('statusenabled', true)
			->orderBy('jeniskelamin')
			->get();
		$kdJenisPegawaiDokter = $this->settingDataFixed('kdJenisPegawaiDokter',   $kdProfile );

		$dkoter = \DB::table('pegawai_m')
			->select('*')
			->where('statusenabled', true)
              ->where('kdprofile', $kdProfile)
			->where('objectjenispegawaifk',$kdJenisPegawaiDokter)
			->orderBy('namalengkap')
			->get();

		$kelompokPasien = \DB::table('kelompokpasien_m')
			->select('id','kelompokpasien')
           ->where('kdprofile', $kdProfile)
			->where('statusenabled', true)
            ->whereIn('id', [1,2,26])
			->orderBy('kelompokpasien')
			->get();
        $now = date('Y-m-d');   
        $libur = \DB::table('slottinglibur_m')
            ->select(DB::raw("to_char(tgllibur,'yyyy/MM/dd') as tgllibur,id,statusenabled"))
            ->where('statusenabled', true)
            ->where('kdprofile', $kdProfile)
            ->whereRaw("to_char(tgllibur,'yyyy-MM-dd') >= '$now'")
            ->orderBy('tgllibur')
            ->get();

        $agama = \DB::table('agama_m')
			->select('id','agama')
            ->where('statusenabled', true)
            ->where('kdprofile', $kdProfile)
            ->get();

        $statusperkawinan = \DB::table('statusperkawinan_m')
        ->select('id','statusperkawinan')
        ->where('statusenabled', true)
        ->where('kdprofile', $kdProfile)
        ->get();

        $golongandarah = \DB::table('golongandarah_m')
        ->select('id','golongandarah')
        ->where('statusenabled', true)
        ->where('kdprofile', $kdProfile)
        ->get();
        
        $pendidikan = \DB::table('pendidikan_m')
        ->select('id','pendidikan')
        ->where('statusenabled', true)
        ->where('kdprofile', $kdProfile)
        ->get();

        $pekerjaan = \DB::table('pekerjaan_m')
        ->select('id','pekerjaan')
        ->where('statusenabled', true)
        ->where('kdprofile', $kdProfile)
        ->get();
        $hambatankomunikasi = \DB::table('hambatankomunikasi_m')
        ->select('id','hambatankomunikasi')
        ->where('statusenabled', true)
        ->where('kdprofile', $kdProfile)
        ->get();
        $result = array(
            'message' => 'success',
            'status' => 200,
            'ruanganrajal' => $ruanganAvailable,//$dataRuanganJalan,
            'jeniskelamin' => $jk,
            'dokter' => $dkoter,
            'agama' => $agama,
            'statusperkawinan' => $statusperkawinan,
            'golongandarah' => $golongandarah,
            'pendidikan' => $pendidikan,
            'pekerjaan' => $pekerjaan,
            'hambatankomunikasi' => $hambatankomunikasi,
            'kelompokpasien' => $kelompokPasien,
            'libur' => $libur,
            'maxJamReservasi' => $this->settingDataFixed('maxJamReservasi',$kdProfile),
            'isRentangReservasi'=>(float) $this->settingDataFixed('isRentangReservasi',$kdProfile),
        );
		return $this->respond($result);
	}
	public function getPasienByNoCmTglLahir($nocm,$tgllahir) {
		$data = \DB::table('pasien_m as ps')
			->leftJOIN ('alamat_m as alm','alm.nocmfk','=','ps.id')
			->leftjoin ('pendidikan_m as pdd','ps.objectpendidikanfk','=','pdd.id')
			->leftjoin ('pekerjaan_m as pk','ps.objectpekerjaanfk','=','pk.id')
			->leftjoin ('jeniskelamin_m as jk','jk.id','=','ps.objectjeniskelaminfk')
			->leftjoin ('agama_m as ag','ag.id','=','ps.objectagamafk')
			->leftjoin ('statusperkawinan_m as sp','sp.id','=','ps.objectstatusperkawinanfk')
			->leftjoin ('golongandarah_m as gd','gd.id','=','ps.objectgolongandarahfk')
			->leftjoin ('hambatankomunikasi_m as hk','hk.id','=','ps.hambatankomunikasifk')
			->select('ps.nocm','ps.id as nocmfk','ps.namapasien','ps.objectjeniskelaminfk','jk.jeniskelamin',
				'alm.alamatlengkap','pdd.pendidikan','pk.pekerjaan','ps.nohp as notelepon','ps.tempatlahir',
                'ps.nobpjs','ps.objectagamafk','ag.agama','ps.objectstatusperkawinanfk','sp.statusperkawinan','ps.objectgolongandarahfk','gd.golongandarah',
                'ps.objectpendidikanfk','ps.objectpekerjaanfk','ps.hambatankomunikasifk','hk.hambatankomunikasi','ps.nik1','ps.alamatrmh', 'ps.teleponpenanggungjawab', 'ps.penanggungjawab',
				DB::raw(" to_char ( ps.tgllahir,'yyyy-MM-dd') as tgllahir"))
            ->where('ps.statusenabled',true);
			// ->where('ps.nocm', $nocm);
        // if(isset($tgllahir) &&$tgllahir != "" && $tgllahir != "undefined" && $tgllahir != "null") {
        //     $data = $data ->whereRaw("CONVERT(varchar, ps.tgllahir, 105)  ='$tgllahir' " );
        // }
        if(isset($nocm) &&$nocm != "" && $nocm != "undefined" && $nocm != "null") {
            $data = $data->where(function($query) use ($nocm) {
                    $query->where('ps.nocm', '=', $nocm)
                    ->orWhere('ps.nohp', '=', $nocm);
                       // ->orWhere('ps.noidentitas', '=', $nocm); 
                });
        }

        if(isset($tgllahir) && $tgllahir != "" && $tgllahir != "undefined" && $tgllahir != "null") {
            if (is_numeric($tgllahir) && strlen($tgllahir) > 10) {
                // Jika berupa timestamp dalam milidetik, konversi ke detik
                $timestamp = $tgllahir / 1000;
                $tgllahir = date('Y-m-d', $timestamp);
            }
        $data = $data->whereDate('ps.tgllahir', '=', $tgllahir);
    }

		$data = $data->get();

		$result = array(
			'data'=> $data,
			'message' => 'ramdanegie',
		);
		return $this->respond($result);
	}

	public function saveReservasi(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $userData = $request->all();
        DB::beginTransaction();
        try {
            $tgl = $request['tglReservasiFix'];
            $jamAwal = $request['jamReservasi']['jamawal'];
            $jamAkhir = $request['jamReservasi']['jamakhir'];
            $kuota =  $request['jamReservasi']['quota'];
            $replace = str_replace('/','-',substr($request['tglReservasiFix'],0,10)) ;
            $tglDoang = date('Y-m-d',strtotime( $replace));
            $idPasien = null;
            if($request['isBaru'] == false){
                $pasien  = Pasien::where('nocm',$request['noCm'])
                ->where('statusenabled',true)
                ->first();
                 $idPasien = $pasien->id;
            }
            $msg2 = '';
            if($request['noCm']!=null){
              
               if($request['tipePembayaran']['id'] == 2){
                  $cek = \DB::table('antrianpasienregistrasi_t as apr')
                    ->select('apr.norec','apr.tanggalreservasi','tanggal','jamreservasi')
                    ->whereRaw("to_char(apr.tanggalreservasi,'yyyy-MM-dd')='$tglDoang' ")
                    ->where('apr.nocmfk',$idPasien)
                    ->where('apr.noreservasi','!=','-')
                    ->whereNotNull('apr.noreservasi')
                    ->where('apr.statusenabled',true)
                    ->where('apr.kdprofile', (int) $kdProfile )
                    ->first(); 
                     $msg2 = 'Hanya bisa Reservasi satu kali di hari yang sama'; 
                }else{
                   $cek = \DB::table('antrianpasienregistrasi_t as apr')
                    ->select('apr.norec','apr.tanggalreservasi','tanggal','jamreservasi')
                    ->whereRaw("to_char(apr.tanggalreservasi,'yyyy-MM-dd')='$tglDoang' ")
                    ->where('apr.nocmfk',$idPasien)
                    ->where('apr.objectruanganfk', $request['poliKlinik']['id'])
                    ->where('apr.noreservasi','!=','-')
                    ->whereNotNull('apr.noreservasi')
                    ->where('apr.statusenabled',true)
                    ->where('apr.kdprofile', (int) $kdProfile )
                    ->first(); 
                    $msg2 = 'Hanya bisa Reservasi satu kali di hari yang sama & Poli yg sama';   
                } 
                if(!empty($cek)){

                    $result = array(
                        "status" => 400,
                        "message" => $msg2 ,
                    );
                    return $this->setStatusCode($result['status'])->respond($result, $msg2);
                }
               
            }else{
                if($request['tipePembayaran']['id'] == 2){
                    $cek = \DB::table('antrianpasienregistrasi_t as apr')
                      ->select('apr.norec','apr.tanggalreservasi','tanggal','jamreservasi')
                      ->whereRaw("to_char(apr.tanggalreservasi,'yyyy-MM-dd')='$tglDoang' ")
                      ->where('apr.namapasien', $request['namaPasien'])
                      ->whereRaw("to_char(apr.tgllahir,'yyyy/MM/dd')='$request[tglLahir]' ")
                      ->where('apr.noreservasi','!=','-')
                      ->whereNotNull('apr.noreservasi')
                      ->where('apr.statusenabled',true)
                      ->where('apr.kdprofile', (int) $kdProfile )
                      ->first(); 
                       $msg2 = 'Hanya bisa Reservasi satu kali di hari yang sama'; 
                  }else{
                     $cek = \DB::table('antrianpasienregistrasi_t as apr')
                      ->select('apr.norec','apr.tanggalreservasi','tanggal','jamreservasi')
                      ->whereRaw("to_char(apr.tanggalreservasi,'yyyy-MM-dd')='$tglDoang' ")
                      ->where('apr.namapasien', $request['namaPasien'])
                      ->whereRaw("to_char(apr.tgllahir,'yyyy/MM/dd')='$request[tglLahir]' ")
                      ->where('apr.objectruanganfk', $request['poliKlinik']['id'])
                      ->where('apr.noreservasi','!=','-')
                      ->whereNotNull('apr.noreservasi')
                      ->where('apr.statusenabled',true)
                      ->where('apr.kdprofile', (int) $kdProfile )
                      ->first(); 
               
                      $msg2 = 'Hanya bisa Reservasi satu kali di hari yang sama & Poli yg sama';   
                  } 
                  if(!empty($cek)){
                      $result = array(
                          "status" => 400,
                          "message" => $msg2 ,
                      );
                      return $this->setStatusCode($result['status'])->respond($result, $msg2);
                  }
            }
            
            // dd($cek);
            
            $ruang = Ruangan::where('id', $request['poliKlinik']['id'])->first();

            $dataReservasi = \DB::table('antrianpasienregistrasi_t as apr')
                ->select('apr.norec','apr.tanggalreservasi','tanggal','jamreservasi')
                // ->whereRaw("apr.tanggalreservasi between  '$jamAwal' and '$jamAkhir'  ")
                ->where("apr.tanggalreservasi",'>=' , $jamAwal)
                ->where("apr.tanggalreservasi",'<'  ,$jamAkhir)
                ->where('apr.objectruanganfk', $request['poliKlinik']['id'])
                ->where('apr.objectpegawaifk', $request['dokter']['id'])
                ->where('apr.noreservasi','!=','-')
                ->whereNotNull('apr.noreservasi')
                ->where('apr.statusenabled',true)
                ->where('apr.kdprofile', (int) $kdProfile )
                ->get();
    // DD(COunt($dataReservasi));
            if($kuota > count($dataReservasi)){
            }else{
                $msg = 'Slotting Reservasi Sudah Penuh';
                $result = array(
                    "status" => 400,
                    "message" => $msg ,
                );
                return $this->setStatusCode($result['status'])->respond($result, $msg);
            }

            $antrian = $this->GetJamKosongRes($request['poliKlinik']['id'], $request['dokter']['id'],$tglDoang,  $request['jamReservasi'],$dataReservasi,$kdProfile);
            // dd($antrian);
          
            $jenis = 'A';
            if($request['tipePembayaran']['id'] == 2){
                $jenis = 'B';
            }
            $nontrian = AntrianPasienRegistrasi::where('jenis',$jenis)
            ->whereBetween('tanggalreservasi', [date('Y-m-d 00:00',strtotime($tgl)), date('Y-m-d 23:59',strtotime($tgl))])
            ->max('noantrian') + 1;
            $newptp = new AntrianPasienRegistrasi();
            // $nontrian=AntrianPasienRegistrasi::max('noantrian')+ 1;
            $newptp->norec = $newptp->generateNewId();;
            $newptp->kdprofile = (int) $kdProfile ;
            $newptp->statusenabled = true;
            $newptp->noantrian = $nontrian;
            $newptp->objectruanganfk =$request['poliKlinik']['id'];
            $newptp->objectjeniskelaminfk =$request['jenisKelamin']['id'];
            $newptp->objectagamafk =$request['agamaPasien']['id'];
            $newptp->objectstatusperkawinanfk =$request['statusPerkawinan']['id'];
            $newptp->objectgolongandarahfk =$request['golonganDarah']['id'];
            $newptp->objectpendidikanfk = $request['pendidikan']['id'];
            $newptp->objectpekerjaanfk = $request['pekerjaan']['id'];
            $newptp->objecthambatankomunikasifk = $request['hambatanKomunikasi']['id'];
            $newptp->tempatlahir = $request['tempatLahir'];
            $newptp->noreservasi =substr(Uuid::generate(), 0, 7);
            $newptp->tanggalreservasi = $tglDoang .' '.$antrian['jamkosong'];// $request['tglReservasiFix'];
            $newptp->tgllahir= $request['tglLahir'];
            $newptp->objectkelompokpasienfk= $request['tipePembayaran']['id'];
            // $newptp->objectpendidikanfk = 0;
            $newptp->namapasien=  $request['namaPasien'];
            $newptp->noidentitas=  $request['nik'];
            $newptp->nikpenanggungjawab=  $request['nikPenanggungJawab'];
            $newptp->namapenanggungjawab=  $request['namaPenanggungJawab'];
            $newptp->notelppenanggungjawab=  $request['noTelponPenanggungJawab'];
            $newptp->alamatpenanggungjawab=  $request['alamatLengkapPenanggungJawab'];
            $newptp->tglinput = date('Y-m-d H:i:s');
            if($request['tipePembayaran']['id'] == 2){
                $newptp->nobpjs= $request['noKartuPeserta'];
                $newptp->norujukan= $request['noRujukan'];
                
            }else{
                $newptp->noasuransilain= $request['noKartuPeserta'];
            }
            $newptp->notelepon= $request['noTelpon'];
            if(isset($request['dokter']['id'])){
                  $newptp->objectpegawaifk=  $request['dokter']['id'];
  
            }
        
            $statusPasien = '';
            if($request['isBaru'] == true){
                $newptp->tipepasien = "BARU";
                $newptp->type = "BARU";
                $newptp->isconfirm = false; // Set isconfirm to false for new patients
                $statusPasien = "BARU";
            }else{
                $newptp->tipepasien = "LAMA";
                $newptp->type = "LAMA";
                $newptp->isconfirm = true;
                $statusPasien = "LAMA";
            }
//            $newptp->objectasalrujukanfk = 0;
//            $newptp->objectstrukreturfk= 0;
//            $newptp->objecttitlefk= 0;
//            $newptp->jenis = $request['datas']['norecpap'];
//            $newptp->statuspanggil = 0;
            if(isset($pasien) && !empty($pasien)){
                $newptp->objectagamafk= $pasien->objectagamafk;
                $alamat = Alamat::where('nocmfk',$pasien->id)->first();
                if(!empty($alamat)){
                    $newptp->alamatlengkap= $alamat->alamatlengkap;
                    $newptp->objectdesakelurahanfk = $alamat->objectdesakelurahanfk;
                    $newptp->negara= $alamat->objectnegarafk;
                }   
                $newptp->objectgolongandarahfk=  $pasien->objectgolongandarahfk;
                $newptp->kebangsaan= $pasien->objectkebangsaanfk;
                $newptp->namaayah=$pasien->namaayah;
                $newptp->namaibu=$pasien->namaibu;
                $newptp->namasuamiistri= $pasien->namasuamiistri;
        
                $newptp->noaditional= $pasien->noaditional;
//                $newptp->noantrian= 0;
                $newptp->noidentitas= $pasien->noidentitas;
                $newptp->nocmfk=  $pasien->id;
                $newptp->paspor=  $pasien->paspor;
                $newptp->objectpekerjaanfk=  $pasien->objectpekerjaanfk;
                $newptp->objectpendidikanfk= $pasien->objectpendidikanfk != null? $pasien->objectpendidikanfk  : 0 ;
                $newptp->objectstatusperkawinanfk=  $pasien->objectstatusperkawinanfk;
                $newptp->tempatlahir= $pasien->tempatlahir;

            }
            $newptp->noantrian = $antrian['antrian'];
            $newptp->tanggal = $tglDoang;
            $newptp->jamreservasi = $request['jamReservasi']['jam'];
            $newptp->alamatlengkap= $request['alamatLengkap'];
            $newptp->save();

            $newId = LoggingUser::max('id');
            $newId = $newId + 1;
            $logUser = new LoggingUser();
            $logUser->id = $newId;
            $logUser->norec = $logUser->generateNewId();
            $logUser->kdprofile = (int) $kdProfile;
            $logUser->statusenabled = true;
            $logUser->jenislog = 'Simpan Reservasi';
            $logUser->noreff = $newptp->norec;
            $logUser->referensi = 'norec antrianpasienregistrasi_t';
            $logUser->keterangan = 'Simpan Reservasi Online No Reservasi: ' . $newptp->noreservasi . ' / Pasien: ' . $newptp->namapasien;
            $logUser->objectloginuserfk = isset($userData['userData']['id']) ? $userData['userData']['id'] : null;
            $logUser->tanggal = date('Y-m-d H:i:s');
            $logUser->save();
            $newptp->namaruangan =Ruangan::where('id',$newptp->objectruanganfk )
                                ->where('kdprofile',(int) $kdProfile )
                                ->first()->namaruangan;

                                
            if(isset($request['dokter']['id'])){
                $cek = Pegawai::where('id', $request['dokter']['id'] )
                ->where('kdprofile',(int) $kdProfile )
                ->first();
                $newptp->dokter =!empty($cek)?$cek->namalengkap:'-';
            }

            $statusDaftarLangsung = $this->settingDataFixed('isDaftarLangsungReservasi', $kdProfile);
            if (!empty($statusDaftarLangsung) && $statusDaftarLangsung == 'true' && $request['isBaru'] == false) {
                $pasiendaftar = array(
                    'tglregistrasi' => $tglDoang .' '.$antrian['jamkosong'],
                    'tglregistrasidate' => date('Y-m-d',strtotime($tglDoang)),
                    'nocmfk' =>  $pasien->id,
                    'objectruanganfk' =>  $ruang->id,
                    'objectdepartemenfk' =>  $ruang->objectdepartemenfk,
                    'objectkelasfk' =>  6,//nonkelas
                    'objectkelompokpasienlastfk' => $request['tipePembayaran']['id'],//bpjs
                    'objectrekananfk' =>  $request['tipePembayaran']['id'] == 2 ? 2552 : null,
                    'tipelayanan' => 1,//reguler
                    'objectpegawaifk' => isset($request['dokter']['id']) ? $request['dokter']['id'] : null,
                    'noregistrasi' =>  '',
                    'norec_pd' =>  '',
                    'israwatinap' =>  'false',
                    'statusschedule' => $newptp->noreservasi,
                    'objectrekananfk' => $request['tipePembayaran']['id'] == 2 ? 2552 : null,
                    'statuspasien' => $statusPasien,
                    'isjkn' => false
                );
                $antrianpasiendiperiksa = array(
                    'norec_apd' => '',
                    'tglregistrasi' => $newptp->tanggalreservasi,
                    'objectruanganfk' =>  $ruang->id,
                    'objectkelasfk' => 6,
                    'objectpegawaifk' => isset($request['dokter']['id']) ? $request['dokter']['id'] : null,
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
                $regis = app('App\Http\Controllers\Registrasi\RegistrasiController')->saveRegistrasiPasien($objetoRequest);
                $regis = json_decode($regis->content(), true);

                if (isset($regis['status']) && $regis['status'] != 201) {
                    throw new \Exception("Gagal Registrasi Pasien: " . $regis['message']);
                }
                if (isset($regis['metadata']['code']) && $regis['metadata']['code'] != 200) {
                    throw new \Exception("Gagal Registrasi Pasien (JKN): " . $regis['metadata']['message']);
                }
            }
            
            $transStatus = true;
         } catch (\Exception $e) {
            $transStatus = false;
         
        }
        $transMessage = "Simpan Reservasi";
        if ($transStatus ==true) {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "data"=>$newptp,
                "antrol" => $this->saveAntrolV2($newptp),
                'pasiendaftar' => isset($regis) ? $regis : null,
                "as" => 'ramdan@epic',
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                'e'=> $e->getLine(),
                'msg'=> $e->getMessage(),
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    function tanggal_indonesia($tanggal){
        $bulan = array (
        1 =>   'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember'
        );
        
        $pecahkan = explode('-', $tanggal);
        
        // variabel pecahkan 0 = tanggal
        // variabel pecahkan 1 = bulan
        // variabel pecahkan 2 = tahun
        return $pecahkan[2] . ' ' . $bulan[ (int)$pecahkan[1] ] . ' ' . $pecahkan[0];
    }
     public function getHistoryReservasi(Request $request)
    {        
        $kdProfile = $this->getDataKdProfile($request);

        $data = \DB::table('antrianpasienregistrasi_t as apr')
            ->leftJoin('pasien_m as pm','pm.id','=','apr.nocmfk')
            ->leftJoin('alamat_m as alm','alm.nocmfk','=','pm.id')
            ->leftJoin('jeniskelamin_m as jk','jk.id','=','pm.objectjeniskelaminfk')
            ->leftJoin('jeniskelamin_m as jks','jks.id','=','apr.objectjeniskelaminfk')
            ->leftJoin('pekerjaan_m as pk','pk.id','=','pm.objectpekerjaanfk')
            ->leftJoin('pendidikan_m as pdd','pdd.id','=','pm.objectpendidikanfk')
            ->leftJoin('ruangan_m as ru','ru.id','=','apr.objectruanganfk')
            ->leftJoin('pegawai_m as pg','pg.id','=','apr.objectpegawaifk')
            ->leftJoin('kelompokpasien_m as kps','kps.id','=','apr.objectkelompokpasienfk')
            ->leftJoin('pasiendaftar_t as pd', function($join) {
                $join->on('pd.statusschedule','=','apr.noreservasi')
                     ->where('pd.statusenabled', '=', true);
            })
            ->leftJoin('antrianpasiendiperiksa_t as apd', function($join) {
                $join->on('apd.noregistrasifk','=','pd.norec')
                     ->on('apd.objectruanganfk', '=', 'apr.objectruanganfk');
            })
            ->leftJoin('bpjsrencanakontrol_t as brk','brk.nosuratkontrol','=','apr.norujukan')
            ->leftJoin('asuransipasien_m as asu','asu.nocmfk','=','pm.id')
            ->select('apr.norec','apd.noantrian','pm.nocm','apr.noreservasi','apr.tanggalreservasi','apr.tanggal','apr.jamreservasi','apr.objectruanganfk', 'asu.objectkelasdijaminfk as hakkelasfk', 'asu.jenispeserta',
                'apr.objectpegawaifk','ru.namaruangan','apr.isconfirm','pg.namalengkap as dokter','pm.id as nocmfk', 'pg.kddokterbpjs',
               'pm.namapasien','apr.namapasien','alm.alamatlengkap','pk.pekerjaan','pm.noasuransilain','pm.noidentitas','brk.nosepasalkontrol',
                'apr.nobpjs','pm.nohp','pdd.pendidikan','apr.type','kps.kelompokpasien','apr.objectkelompokpasienfk','ru.objectdepartemenfk','brk.tglrujukan',
                'ru.prefixnoantrian','ru.kdinternal as noruangan', 'apr.norujukan','pd.norec as norec_pd','pd.tglregistrasi','pd.tglcheckin','apd.norec as norec_apd','pd.noregistrasi', 'apr.norujukan as noreferensi','brk.kdprovperujuk','brk.namaprovperujuk','brk.diagnosa','brk.nosuratkontrol','brk.norujukan','brk.asalrujukan','brk.kodedokter as kddokterskdp','brk.jnspelsepasal','brk.tglrencanakontrol','brk.namadokter as namadokterskdp','apr.objectasalrujukanfk',
                DB::raw('(case when pm.namapasien is null then apr.namapasien else pm.namapasien end) as namapasien, 
                (case when apr.isconfirm=true then \'Confirm\' else \'Reservasi\' end) as status,case when pm.tempatlahir is null then apr.tempatlahir else pm.tempatlahir end as tempatlahir,
                case when jk.jeniskelamin is null then jks.jeniskelamin else jk.jeniskelamin end as jeniskelamin,
                case when jk.jeniskelamin is null then jks.id else jk.id end as jk_id,
                case when apr.tgllahir is null then pm.tgllahir else apr.tgllahir end as tgllahir,
                case when apr.tipepasien = \'LAMA\' then pm.nohp else  apr.notelepon end as notelepon,
                case when apr.perjanjianfk is not null then  \'pasien-kontrol\' else  \'reservasi-online\' end as keterangan' )
            )
            // ->whereNull('apr.isconfirm')
            ->where('apr.noreservasi','!=','-')
            ->whereNotNull('apr.noreservasi')
            ->where('apr.kdprofile',  $kdProfile )
            ->where('pd.statusenabled',true)
            ->where('apr.statusenabled',true);


        if(isset($request['nocmNama']) && $request['nocmNama'] != "" && $request['nocmNama'] != "undefined" && $request['nocmNama'] != "null") {
            $data =

            $data->whereRaw("(pm.nocm  = '$request[nocmNama]' or apr.namapasien ilike '%$request[nocmNama]%')");
                //  $data->where('pm.nocm', $request['nocmNama'])
                //  -> Orwhere('apr.namapasien', 'ilike','%'.$request['nocmNama'].'%');

        }
        if(isset($request['tgllahir']) && $request['tgllahir'] != "" && $request['tgllahir'] != "undefined" && $request['tgllahir'] != "null" &&  $request['tgllahir'] !='Invaliddate') {
            $tgllahir= $request['tgllahir'];
            $data =
//                $data->whereRaw("CONVERT(varchar, pm.tgllahir, 105)  ='$tgllahir' " )
                $data->whereRaw("to_char( apr.tgllahir, 'dd-MM-yyyy')  ='$tgllahir' " );
        }

        if(isset($request['noReservasi']) && $request['noReservasi'] != "" && $request['noReservasi'] != "undefined" && $request['noReservasi'] != "null") {
            $data =
                 $data->where('apr.noreservasi', $request['noReservasi']);
            
        }
        if(isset($request['nik']) && $request['nik'] != "" && $request['nik'] != "undefined" && $request['nik'] != "null") {
            $data =
                 $data->where('apr.noidentitas', $request['nik']);
            
        }
        if(isset($request['id_ruangan']) && $request['id_ruangan'] != "" 
            && $request['id_ruangan'] != "undefined" && $request['id_ruangan'] != "null") {
            $data =  $data->where('apr.objectruanganfk', $request['id_ruangan']);
        }
        if(isset($request['id_dokter']) && $request['id_dokter'] != "" 
            && $request['id_dokter'] != "undefined" && $request['id_dokter'] != "null") {
            $data =  $data->where('apr.objectpegawaifk', $request['id_dokter']);
        }
        if(isset($request['dari']) && $request['dari'] != "" 
            && $request['dari'] != "undefined" && $request['dari'] != "null") {
            $data =  $data->where('apr.tanggalreservasi','>=', $request['dari'].' 00:00');
        }
        if(isset($request['sampai']) && $request['sampai'] != "" 
            && $request['sampai'] != "undefined" && $request['sampai'] != "null") {
            $data =  $data->where('apr.tanggalreservasi','<=', $request['sampai'].' 23:59');
        }

        if(isset($request['cekin']) && $request['cekin'] == "true"  ) {
            $data =  $data->whereNull('apr.isconfirm');
        }


        $data = $data->orderBy('apr.tanggalreservasi','desc');
        if(isset($request['jmlRows']) && $request['jmlRows'] != "" && $request['jmlRows'] != "undefined" && $request['jmlRows'] != "null" && $request['jmlRows'] != 0) {
            $data=$data->take($request['jmlRows']);
        }

        if(isset($request['jmlOffset']) && $request['jmlOffset'] != "" && $request['jmlOffset'] != "undefined" && $request['jmlOffset'] != "null") {
            $data=$data->offset($request['jmlOffset']);
        }
        // $data = $data->get();
        $data = collect($data->get())->unique('norec')->values()->all();

        $result = array(
            'data' => $data,
            'as' => '@epic',
        );
        return $this->respond($result);
    }
    public function deleteReservasi(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin = $request->all();
        $tglAyeuna = date('Y-m-d H:i:s');

        DB::beginTransaction();
        try {
            $cek = DB::table('antrianpasienregistrasi_t as apr')
                ->join('pasiendaftar_t as pd', 'pd.statusschedule', '=', 'apr.noreservasi')
                ->where('apr.norec', $request['norec'])
                ->where('pd.statusenabled', true)
                ->whereNotNull('pd.tglcheckin')
                ->first();
            if ($cek) {
                $result = array(
                    "status" => 400,
                    "message" => "Reservasi yang sudah check-in tidak bisa dibatalkan"
                );
                return $this->setStatusCode($result['status'])->respond($result, $result['message']);
            }

            $reservasi = AntrianPasienRegistrasi::where('norec', $request['norec'])->first();

            AntrianPasienRegistrasi::where('norec',$request['norec'])->update([
               'statusenabled'=>false,
            ]);

            // Nonaktifkan pasien daftar & antrian diperiksa yang terhubung dengan reservasi ini
            if ($reservasi && $reservasi->noreservasi) {
                // Ambil norec pasiendaftar yang terhubung (untuk nonaktifkan apd)
                $norecPdList = DB::table('pasiendaftar_t')
                    ->where('statusschedule', $reservasi->noreservasi)
                    ->where('statusenabled', true)
                    ->whereNull('tglcheckin')
                    ->pluck('norec');

                // Nonaktifkan antrianpasiendiperiksa_t yang terhubung
                if ($norecPdList->isNotEmpty()) {
                    DB::table('antrianpasiendiperiksa_t')
                        ->whereIn('noregistrasifk', $norecPdList)
                        ->where('statusenabled', true)
                        ->update(['statusenabled' => false]);
                }

                // Nonaktifkan pasiendaftar_t
                DB::table('pasiendaftar_t')
                    ->where('statusschedule', $reservasi->noreservasi)
                    ->where('statusenabled', true)
                    ->whereNull('tglcheckin')
                    ->update(['statusenabled' => false]);
            }

            if ($reservasi) {
                $newId = LoggingUser::max('id');
                $newId = $newId + 1;
                $logUser = new LoggingUser();
                $logUser->id = $newId;
                $logUser->norec = $logUser->generateNewId();
                $logUser->kdprofile = $idProfile;
                $logUser->statusenabled = true;
                $logUser->jenislog = 'Hapus Reservasi';
                $logUser->noreff = $request['norec'];
                $logUser->referensi = 'norec antrianpasienregistrasi_t';
                $logUser->keterangan = 'Hapus Reservasi Online No Reservasi: ' . $reservasi->noreservasi . ' / Pasien: ' . $reservasi->namapasien;
                $logUser->objectloginuserfk = isset($dataLogin['userData']['id']) ? $dataLogin['userData']['id'] : null;
                $logUser->tanggal = $tglAyeuna;
                $logUser->save();
            }
            
            $transStatus = 'true';

            $transMessage = "Hapus Reservasi Sukses";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Hapus Reservasi Gagal";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'ramdan@epic',
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
    public function saveAntrianTouchscreen(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $dataLogin = $request->all();
        DB::beginTransaction();
        $noRec='';
        $tglAyeuna = date('Y-m-d H:i:s');
        $tglAwal = date('Y-m-d 00:00:00');
        $tglAkhir = date('Y-m-d 23:59:59');
        $kdRuanganTPP = $this->settingDataFixed('idRuanganTPP1',   $kdProfile);
        try {
            $newptp = new AntrianPasienRegistrasi();
            $norec = $newptp->generateNewId();
            $nontrian= AntrianPasienRegistrasi::where('jenis',$request['jenis'])
                    ->whereBetween('tanggalreservasi',[$tglAwal,$tglAkhir])
                    ->where('kdprofile', $kdProfile)
                    ->max('noantrian')+1;
            $newptp->norec = $norec;
            $newptp->kdprofile = $kdProfile;
            $newptp->statusenabled = true;
            $newptp->objectruanganfk = $kdRuanganTPP;
            $newptp->objectjeniskelaminfk = 0;
            $newptp->noantrian = $nontrian;
            $newptp->noreservasi = "-";
            $newptp->objectpendidikanfk = 0;
            $newptp->tanggalreservasi = $tglAyeuna;
            $newptp->tipepasien = "BARU";
            $newptp->type = "BARU";
            $newptp->jenis = $request['jenis'];
            $newptp->statuspanggil = 0;
            $newptp->save();
            $noRec=$newptp->norec;


            $transMessage = "Simpan Antrian";
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Antrian Gagal";
        }

        if ($transStatus != 'false') {
         
            DB::commit();
            $result = array(
                "noRec" =>$noRec,
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            DB::rollBack();
            $result = array(
                "noRec" =>$noRec,
                "status" => 400,
                "message" => $transMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
  public function getRuanganByKodeInternal($kode)
    {
         $kdProfile = $this->getDataKdProfile($request);
        $data = \DB::table('ruangan_m')
            ->where('statusenabled',true)
            ->where('kdinternal', '=',$kode)
             ->where('kdprofile', '=',$kdProfile)
            ->first();

        $result = array(
            'data' => $data,
            'as' => 'ramdan@epic',
        );
        return $this->respond($result);
    }
    public function getDiagnosaByKode($kode)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $data = \DB::table('diagnosa_m')
            ->where('statusenabled',true)
            ->where('kddiagnosa', '=',$kode)
            ->where('kdprofile', '=',$kdProfile)
            ->first();

        $result = array(
            'data' => $data,
            'as' => 'ramdan@epic',
        );
        return $this->respond($result);
    }
	public function getSlottingByRuangan($kode,$tgl)
	{
		$dataReservasi = \DB::table('antrianpasienregistrasi_t as apr')
			->select('apr.norec','apr.tanggalreservasi')
			->whereRaw(" format(apr.tanggalreservasi,'yyyy-MM-dd') = '$tgl'")
			->where('apr.objectruanganfk', $kode)
			->where('apr.noreservasi','!=','-')
			->whereNotNull('apr.noreservasi')
			->where('apr.statusenabled',true)
			->get();

		$ruangan = \DB::table('ruangan_m as ru')
			->join('slottingonline_m as slot', 'slot.objectruanganfk', '=', 'ru.id')
			->select('ru.id', 'ru.namaruangan', 'ru.objectdepartemenfk', 'slot.jambuka', 'slot.jamtutup',
				'slot.quota',
				DB::raw("datepart(hour,slot.jamtutup) -datepart(hour, slot.jambuka)as totaljam"))
			->where('ru.statusenabled', true)
			->where('ru.id', $kode)
			->where('slot.statusenabled', true)
			->first();
		$begin = new Carbon($ruangan->jambuka);
//		return $this->respond($begin);
		$end = new Carbon($ruangan->jamtutup);
		$waktuPerorang = ((float)$ruangan->totaljam / (float)$ruangan->quota) * 60;
		$waktuPerorang = $waktuPerorang . ' min';
		$interval = \DateInterval::createFromDateString($waktuPerorang . ' min');
		$times = new \DatePeriod($begin, $interval, $end);
//		return $dataReservasi;
		$jamArr = [];
		foreach ($times as $time) {
			$jamArr []= array(
				'jam' => $time->format('H:i'),
//				'disable' => true,
			);
		}

		$i =0;
		$reservasi = [];
		foreach ($dataReservasi as $items){
			$jamUse =  new Carbon($items->tanggalreservasi);
			$reservasi [] = array(
				'jamreservasi' => $jamUse->format('H:i')
			);
		}
//		foreach ($jamArr as $itemJam) {
//				foreach ($dataReservasi as $items){
//					$jamUse = new \DateTime( $items->tanggalreservasi);
//					if ($jamUse->format('H:i') == $itemJam['jam']) {
//						array_splice( $jamArr,$i,count($jamArr));
//					}
//			}
//			$i = $i +1;
//
//		}
//			if(count($dataReservasi) > 0){
//				foreach ($dataReservasi as $items){
//					$jamUse = new \DateTime( $items->tanggalreservasi);
//					$jamUse2 = $time->format('H:i');
//					if ($jamUse->format('H:i') == $time->format('H:i')) {
//						$jam []= array(
//							'jam' => $time->format('H:i'),
//							'disable' => false,
//						);
////						break;
//					}
//
////					else{
////						$jam []= array(
////							'jam' => $time->format('H:i'),
////							'disable' => true,
////						);
////					}
//				}
//			}
//			else{
//				$jam [] =array(
//					'jamaktif' =>$time->format('H:i'),
//					'disable' => false,
//				);
//			}

//		}
		$slot  = array(
			'id' => $ruangan->id,
			'namaruangan' => $ruangan->namaruangan,
			'objectdepartemenfk' => $ruangan->objectdepartemenfk,
			'jambuka' => $ruangan->jambuka,
			'jamtutup' => $ruangan->jamtutup,
			'totaljam' => $ruangan->totaljam,
			'quota' => $ruangan->quota,
			'waktu' => $waktuPerorang,
			'listjam' => $jamArr
		);
		$result = array(
			'slot' => $slot,
			'reservasi' => $reservasi,
//			'$jamUse' => $jamUse->format('H:i'),
//			'$jamUse2' => $jamUse2,
			'as' => 'ramdan@epic',
		);
		return $this->respond($result);
	}
    public function getDaftarSlotting(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $ruangan = \DB::table('slottingonline_m as slot')
            ->join('ruangan_m as ru', 'slot.objectruanganfk', '=', 'ru.id')
            ->join('pegawai_m as pg', 'slot.objectpegawaifk', '=', 'pg.id')
            ->select('slot.tanggalcutiawal','slot.tanggalcutiakhir','ru.id as idruangan','slot.id', 'ru.namaruangan', 'ru.objectdepartemenfk', 'slot.jambuka', 'slot.jamtutup',
                'slot.quota','pg.namalengkap','slot.objectpegawaifk','slot.hari',
                DB::raw("extract(hour from slot.jamtutup) -extract(hour from slot.jambuka)as totaljam"))
            // DB::raw("datepart(hour,slot.jamtutup) -datepart(hour, slot.jambuka)as totaljam"))
            ->where('pg.statusenabled', true)
            ->where('ru.statusenabled', true)
            ->where('slot.kdprofile', $kdProfile)
            ->where('slot.statusenabled', true);
//          ->where('ru.id', $kode)
        if(isset($request['namaRuangan']) && $request['namaRuangan']!='undefined' && $request['namaRuangan']!=''){
            $ruangan =$ruangan->where('ru.namaruangan','ilike','%'.$request['namaRuangan'].'%');
        }
        if(isset($request['dokter']) && $request['dokter']!='undefined' && $request['dokter']!=''){
            $ruangan =$ruangan->where('pg.namalengkap','ilike','%'.$request['dokter'].'%');
        }
        if(isset($request['quota']) && $request['quota']!='undefined' && $request['quota']!=''){
            $ruangan =$ruangan->where('slot.quota','=',$request['quota']);
        }
        if(isset($request['id']) && $request['id']!='undefined' && $request['id']!=''){
            $ruangan =$ruangan->where('slot.id','=',$request['id']);
        }
        $ruangan=$ruangan->get();

        $result = array(
            'data' => $ruangan,
            'as' => 'ramdan@epic',
        );
        return $this->respond($result);
    }
	public function saveSlotting(Request $request){
     $kdProfile = $this->getDataKdProfile($request);
		DB::beginTransaction();
		try {
			if($request['id'] == ''){
				$newptp = new SlottingOnline();
				$newptp->id = SlottingOnline::max('id')+1;
				$newptp->statusenabled = true;
				$newptp->kdprofile = $kdProfile;
			}else{
				$newptp = SlottingOnline::where('id',$request['id'])->first();
			}

			$newptp->objectruanganfk = $request['objectruanganfk'];
            $newptp->objectpegawaifk = isset($request['objectpegawaifk'])?$request['objectpegawaifk']:null;
            $newptp->hari = isset($request['hari'])?$request['hari']:null;
			$newptp->jambuka = $request['jambuka'];
			$newptp->jamtutup =  $request['jamtutup'];
			$newptp->quota =  $request['quota'];
            $newptp->tanggalcutiawal = $request['tanggalcutiawal'];
            $newptp->tanggalcutiakhir = $request['tanggalcutiakhir'];
			$newptp->save();

			$transMessage = "Simpan Slotting";
			$transStatus = 'true';
		} catch (\Exception $e) {
			$transStatus = 'false';
			$transMessage = "Simpan Slotting Gagal";
		}

		if ($transStatus != 'false') {
			DB::commit();
			$result = array(
				"data" =>$newptp,
				"status" => 201,
				"message" => $transMessage,
			);
		} else {
			DB::rollBack();
			$result = array(
//				"noRec" =>$noRec,
				"status" => 400,
                'e'=> $e->getLine(),
                'msg'=> $e->getMessage(),
				"message" => $transMessage,
			);
		}

		return $this->setStatusCode($result['status'])->respond($result, $transMessage);
	}
	public function deleteSlotting(Request $request){

		try {
			SlottingOnline::where('id',$request['id'])->delete();
			$transMessage = "Sukses ";
			$transStatus = 'true';
		} catch (\Exception $e) {
			$transStatus = 'false';
			$transMessage = "Hapus slotting Gagal";
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
    public function getSlottingByRuanganNew($kode,$tgl,Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $dataReservasi = \DB::table('antrianpasienregistrasi_t as apr')
            ->select('apr.norec','apr.tanggalreservasi')
            ->whereRaw("to_char(apr.tanggalreservasi,'yyyy-MM-dd') = '$tgl'")
            ->where('apr.objectruanganfk', $kode)
            ->where('apr.noreservasi','!=','-')
            ->where('apr.kdprofile',$kdProfile)
            ->whereNotNull('apr.noreservasi')
            ->where('apr.statusenabled',true)
            ->get();

        $ruangan = \DB::table('ruangan_m as ru')
            ->join('slottingonline_m as slot', 'slot.objectruanganfk', '=', 'ru.id')
            ->select('ru.id', 'ru.namaruangan', 'ru.objectdepartemenfk', 'slot.jambuka', 'slot.jamtutup',
                'slot.quota',
                // DB::raw("DATEDIFF(second,  	[slot].[jambuka],	[slot].[jamtutup]) / 3600.0 AS totaljam "))
               DB::raw("(EXTRACT(EPOCH FROM slot.jamtutup) - EXTRACT(EPOCH FROM slot.jambuka))/3600 as totaljam"))
            ->where('ru.statusenabled', true)
            ->where('ru.id', $kode)
            ->where('slot.kdprofile',$kdProfile)
            ->where('slot.statusenabled', true)
            ->first();

	    $begin = new Carbon($ruangan->jambuka);
	    $jamBuka = $begin->format('H:i');
	    $end = new Carbon($ruangan->jamtutup);
	    $jamTutup = $end->format('H:i');
	    $quota =(float)$ruangan->quota;
        $waktuPerorang = ((float)$ruangan->totaljam / (float)$ruangan->quota) * 60;

        $i =0;
        $reservasi = [];
        foreach ($dataReservasi as $items){
            $jamUse =  new Carbon($items->tanggalreservasi);
            $reservasi [] = array(
                'jamreservasi' => $jamUse->format('H:i')
            );
        }

        $slot  = array(
            'id' => $ruangan->id,
            'namaruangan' => $ruangan->namaruangan,
            'objectdepartemenfk' => $ruangan->objectdepartemenfk,
            'jambuka' => $jamBuka,
            'jamtutup' => $jamTutup,
            'totaljam' => $ruangan->totaljam,
            'quota' => (float)$quota,
            'interval' => $waktuPerorang,
//            'listjam' => $jamArr
        );
        $result = array(
        	'tanggal'=> $tgl,
            'slot' => $slot,
            'reservasi' => $reservasi,
            'as' => 'ramdan@epic',
        );
        return $this->respond($result);
    }
	public function getDaftarSlottingAktif(Request $request)
	{
		$tglAwal = $request['tglAwal'].' 00:00';
		$tglAkhir = $request['tglAkhir']. ' 23:59';
		$ruangan = \DB::table('ruangan_m as ru')
			->join('slottingonline_m as slot', 'slot.objectruanganfk', '=', 'ru.id')
			->select('ru.id as idruangan','slot.id', 'ru.namaruangan', 'ru.objectdepartemenfk', 'slot.jambuka', 'slot.jamtutup',
				'slot.quota',
				DB::raw("datepart(hour,slot.jamtutup) -datepart(hour, slot.jambuka)as totaljam
				"))
			->where('ru.statusenabled', true)
			->where('slot.statusenabled', true)
			->get();
		$slot = [];
		if(count($ruangan)> 0){
			foreach ($ruangan as $item){
				$waktuPerorang = ((float)$item->totaljam / (float)$item->quota) * 60;
				$slot [] = array(
					'id' => $item->id,
					'idruangan' => $item->idruangan,
					'namaruangan' => $item->namaruangan,
					'jambuka' => $item->jambuka,
					'jamtutup' => $item->jamtutup,
					'quota' =>(float) $item->quota,
					'totaljam' => (float) $item->totaljam,
					'interval' => $waktuPerorang,
					);

			}
		}

		$dataReservasi = \DB::table('antrianpasienregistrasi_t as apr')
			->select('apr.norec','apr.tanggalreservasi')
			->whereRaw("format(apr.tanggalreservasi,'yyyy-MM-dd') = '$tglAwal'")
//			->where(" format(apr.tanggalreservasi,'yyyy-MM-dd') <= '$tglAkhir'")
//			->where('apr.objectruanganfk', $kode)
			->where('apr.noreservasi','!=','-')
			->whereNotNull('apr.noreservasi')
			->where('apr.statusenabled',true)
			->get();


		$result = array(
			'slotting' => $slot,
			'reservasi' => $dataReservasi,
			'as' => 'ramdan@epic',
		);
		return $this->respond($result);
	}
    public function getLiburSlotting(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
     
        $data = \DB::table('slottinglibur_m')
            ->select(DB::raw("to_char(tgllibur,'yyyy/MM/dd') as tgllibur,id,statusenabled"))
            ->where('statusenabled', true)
             ->where('kdprofile', $kdProfile)
            ->orderBy('tgllibur');
        if(isset($request['tgllibur']) && $request['tgllibur']!=''){
            $tgl = $request['tgllibur'];
            $data = $data->whereRaw("to_char(tgllibur,'yyyy-MM-dd') ='$tgl'");
        }    

        $data=$data->get();
   
        $result = array(
           
            'libur' => $data,
            'message' => 'ramdan@epic',
        );

        return $this->respond($result);
    }
      public function getRincianPelayanan($noRegister)
    {
//        $pasienDaftar = PasienDaftar::where('noregistrasi', $noRegister)->first();
        $kdProfile = $this->getDataKdProfile($request);
//        $pelayanan = $this->getPelayananPasienByNoRegistrasi($noRegister);
        $pelayanan = DB::select(DB::raw("select pd.objectruanganlastfk,pd.nostruklastfk,ps.id as psid,ps.nocm,
            ps.namapasien,pd.tglpulang,kps.kelompokpasien,kl.namakelas,
            pd.objectruanganlastfk,ru.objectdepartemenfk,
            pd.noregistrasi,pd.tglregistrasi,ru.namaruangan,
            pp.* 

            from pasiendaftar_t pd
            left JOIN antrianpasiendiperiksa_t apd on apd.noregistrasifk=pd.norec
            left JOIN pelayananpasien_t pp on pp.noregistrasifk=apd.norec
            left JOIN pasien_m ps on ps.id=pd.nocmfk
            left JOIN kelas_m kl on kl.id=pd.objectkelasfk
            left JOIN kelompokpasien_m kps on kps.id=pd.objectkelompokpasienlastfk
            left JOIN ruangan_m ru on ru.id=pd.objectruanganlastfk
            where pd.noregistrasi=:noregistrasi 
            and pd.kdprofile=$kdProfile
            --and pp.strukfk is null;
            "),
            array(
                'noregistrasi' => $noRegister,
            )
        );

        $pelayanantidakterklaim = DB::select(DB::raw("select pd.objectruanganlastfk,pd.nostruklastfk,ps.id as psid,ps.nocm,
            ps.namapasien,pd.tglpulang,kps.kelompokpasien,kl.namakelas,
            pd.objectruanganlastfk,ru.objectdepartemenfk,
            pd.noregistrasi,pp.* from pasiendaftar_t pd
            INNER JOIN antrianpasiendiperiksa_t apd on apd.noregistrasifk=pd.norec
            INNER JOIN pelayananpasientidakterklaim_t pp on pp.noregistrasifk=apd.norec
            INNER JOIN pasien_m ps on ps.id=pd.nocmfk
            INNER JOIN kelas_m kl on kl.id=pd.objectkelasfk
            INNER JOIN kelompokpasien_m kps on kps.id=pd.objectkelompokpasienlastfk
            INNER JOIN ruangan_m ru on ru.id=pd.objectruanganlastfk
            where pd.noregistrasi=:noregistrasi 
               and pd.kdprofile=$kdProfile
            --and pp.strukfk is null;
            "),
            array(
                'noregistrasi' => $noRegister,
            )
        );
//        $pelayanan=$pelayanan[0];
//        $billing = $this->getBillingFromPelayananPasien($pelayanan);
        $totalBilling = 0;
        $totalKlaim = 0;
        $totalDeposit = 0;
        $totaltakterklaim =0;

        foreach ($pelayanantidakterklaim as $values) {
//            if ($values->produkfk == $this->getProdukIdDeposit()) {
//                $totalDeposit = $totalDeposit + $values->hargajual;
//            } else {
                $totaltakterklaim = $totaltakterklaim + (($values->hargajual - $values->hargadiscount) * $values->jumlah) + $values->jasa;
//            }
        }

        foreach ($pelayanan as $value) {
            if ($value->produkfk == $this->getProdukIdDeposit()) {
                $totalDeposit = $totalDeposit + $value->hargajual;
            } else {
                $totalBilling = $totalBilling + (($value->hargajual - $value->hargadiscount) * $value->jumlah) + $value->jasa;
            }

        }

//        $billing = new \stdClass();
//        $billing->totalBilling = $totalBilling;
//        $billing->totalKlaim= $totalKlaim;
//        $billing->totalDeposit = $totalDeposit;

        $totalBilling = $totalBilling;
//        $isRawatInap  = $this->isPasienRawatInap2($pelayanan);
        $pelayanan = $pelayanan[0];
        $isRawatInap = false;
        if ($pelayanan->objectruanganlastfk != null) {
            if ((int)$pelayanan->objectdepartemenfk == 16) {
                $isRawatInap = true;
            }
        }


        $dataTotaldibayar = DB::select(DB::raw("select sum(((case when pp.hargajual is null then 0 else pp.hargajual  end - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) * pp.jumlah) + case when pp.jasa is null then 0 else pp.jasa end) as total
                from pasiendaftar_t as pd
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                where  pd.noregistrasi=:noregistrasi and sp.nosbmlastfk is not null and pp.produkfk not in (402611)
                   and pd.kdprofile=$kdProfile;
            "),
            array(
                'noregistrasi' => $noRegister ,
            )
        );
        $dibayar=0;
        $dibayar = $dataTotaldibayar[0]->total;

        $totalDeposit = $totalDeposit;
        $totalKlaim = 0;
        $result = array(
            'pasienID' => $pelayanan->psid,
            'noCm' => $pelayanan->nocm,
            'noRegistrasi' => $pelayanan->noregistrasi,
            'namaPasien' => $pelayanan->namapasien,
            'tglPulang' => $pelayanan->tglpulang,
            'jenisPasien' => $pelayanan->kelompokpasien,
            'kelasRawat' => $pelayanan->namakelas,
            'tglRegistrasi' => $pelayanan->tglregistrasi,
            'ruangan' => $pelayanan->namaruangan,
            'noAsuransi' => '-', //ambil dari asuransi pasien -m tapi datanya blum ada brooo..
            'kelasPenjamin' => '-', //ini blum ada datanya gimana mau munculin,, gila yaa ?
            'billing' => $totalBilling,
            'penjamin' => '',//$penjamin=$this->getPenjamin($pelayanan)->namarekanan,
            'deposit' => $totalDeposit, //ngambil dari mana
            'totalKlaim' => $totalKlaim, //ngambil dari mana? dihitunga gak
            'jumlahBayar' => $dibayar,//$totalBilling - $totalDeposit - $totalKlaim, //jumlah bayar ini perlu gak
            'jumlahBayarNew' =>  $totalBilling - $totalDeposit - $totalKlaim - $totaltakterklaim, //jumlah bayar dengan tindakan yang tidak d klaim
            'jumlahPiutang' => 0, //ini ngambil dari pembayaran gak ?
            'needDokument' => true, //ini ngambil ddokument dari mana ? pake datafixed
            'dokuments' => [], // sama ini juga ngambilnya dari mana ..
            'totaltakterklaim' => $totaltakterklaim,
            'isRawatInap' => $isRawatInap,
        );
        return $this->respond($result);
    }
    public function getSetting(Request $request){
        $data = \DB::table('settingdatafixed_m')
            ->select('nilaifield')
            ->where('statusenabled', true)
            ->where('namafield', $request['namaField'])
            ->first();
   
        return $this->respond($data->nilaifield);
    }   
    public  function cekReservasiDipoliYangSama(Request $request)
    {       
            $kdProfile = $this->getDataKdProfile($request);
            $tgl =$request['tglReservasi'];
           if($request['tipePasien']=='baru' ){
               $tglLahir =$request['tglLahir'];
               $dataReservasi = \DB::table('antrianpasienregistrasi_t as apr')
                    ->select('apr.norec','apr.tanggalreservasi')
                    ->whereRaw("to_char(apr.tanggalreservasi,'yyyy-MM-dd' )= '$tgl'")
//                    ->where('apr.objectruanganfk', $request['ruanganId'])
                    ->where('apr.noreservasi','!=','-')
                    ->where('apr.namapasien',$request['namaPasien'])
                    ->whereRaw("format(apr.tgllahir,'yyyy-MM-dd') = '$tglLahir'")
                    ->whereNotNull('apr.noreservasi')
                    ->where('apr.statusenabled',true)
                    ->where('apr.kdprofile',$kdProfile)
                    ->where('apr.objectkelompokpasienfk',2)
                    ->get();
           }else{
             $dataReservasi = \DB::table('antrianpasienregistrasi_t as apr')
                    ->join('pasien_m as ps','ps.id','=','apr.nocmfk')
                    ->select('apr.norec','apr.tanggalreservasi','ps.nocm')
                    ->whereRaw("to_char(apr.tanggalreservasi,'yyyy-MM-dd') = '$tgl'")
//                    ->where('apr.objectruanganfk', $request['ruanganId'])
                    ->where('apr.noreservasi','!=','-')
                    ->where('ps.nocm',$request['noCm'])
                    ->whereNotNull('apr.noreservasi')
                       ->where('apr.kdprofile',$kdProfile)
                    ->where('apr.statusenabled',true)
                    ->where('apr.objectkelompokpasienfk',2)
                    ->get();
           }

           $result = array(
                'data' =>  $dataReservasi,
                'msg' => 'er@epic'
             );
           return $this->respond($result);
           
    }
    public function getTagihanEbilling($noregistasi,Request $request)
    {
         $kdProfile = $this->getDataKdProfile($request);
        $pelayanan = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->leftjoin('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->join('kelas_m as kl', 'kl.id', '=', 'apd.objectkelasfk')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftjoin('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
            ->leftjoin('strukbuktipenerimaan_t as sbm', 'sp.nosbmlastfk', '=', 'sbm.norec')
            ->leftjoin('strukresep_t as sre', 'sre.norec', '=', 'pp.strukresepfk')
            ->select('pp.norec', 'pp.tglpelayanan', 'pp.rke', 'pr.id as prid', 'pr.namaproduk', 'pp.jumlah', 'kl.id as klid', 'kl.namakelas',
                'ru.id as ruid', 'ru.namaruangan', 'pp.produkfk', 'pp.hargajual', 'pp.hargadiscount', 'sp.nostruk', 'sp.tglstruk', 'apd.norec as norec_apd',
                'sbm.nosbm', 'sp.norec as norec_sp', 'pp.jasa', 'pd.nocmfk',
                'pd.nostruklastfk','pd.noregistrasi',
                'pd.tglregistrasi', 'pd.norec as norec_pd', 'pd.tglpulang',
                'pd.objectrekananfk as rekananid',
                'pp.jasa',  'sp.totalharusdibayar', 'sp.totalprekanan',
                'sp.totalbiayatambahan','pp.aturanpakai','pp.iscito','pd.statuspasien','pp.isparamedis','pp.strukresepfk'
            )
             ->where('pd.kdprofile', $kdProfile)
            ->where('pd.noregistrasi', $noregistasi);
//          ->orderBy('pp.tglpelayanan', 'pp.rke');

        $pelayanan = $pelayanan->get();

        if (count($pelayanan) > 0) {
            $details = null;
            foreach ($pelayanan as $value) {
                if($value->prid != $this->getProdukIdDeposit()){
                    $jasa = 0;
                    if (isset($value->jasa) && $value->jasa != "" && $value->jasa != null) {
                        $jasa =(float) $value->jasa;
                    }

                    $harga = (float)$value->hargajual;
                    $diskon = (float)$value->hargadiscount;
                    $detail = array(
                        'norec' => $value->norec,
                        'tglPelayanan' => $value->tglpelayanan,
                        'namaPelayanan' => $value->namaproduk,
                        'jumlah' => (float)$value->jumlah,
                        'kelasTindakan' => @$value->namakelas,
                        'ruanganTindakan' => @$value->namaruangan,
                        'harga' => $harga,
                        'diskon' => $diskon,
                        'total' => (($harga - $diskon) * $value->jumlah) + $jasa,
                        'strukfk' => $value->nostruk ,
                        'sbmfk' => $value->nosbm,
                        'pgid' => '',
                        'ruid' => $value->ruid,
                        'prid' => $value->prid,
                        'klid' => $value->klid,
                        'norec_apd' => $value->norec_apd,
                        'norec_pd' => $value->norec_pd,
                        'norec_sp' => $value->norec_sp,
                        'jasa' => $jasa,
                        'aturanpakai' => $value->aturanpakai,
                        'iscito' => $value->iscito,
                        'isparamedis' => $value->isparamedis,
                        'strukresepfk' => $value->strukresepfk
                    );

                    $details[] = $detail;
                }
                

            }
        }

        $arrHsil = array(
            'details' => $details,
            'deposit' =>  $this->getDepositPasien($noregistasi),
            'totalklaim' =>  $this->getTotalKlaim($noregistasi,$kdProfile),
            'bayar' =>  $this->getTotolBayar($noregistasi,$kdProfile),
        );
        return $this->respond($arrHsil);
    }

    public  function getTotalKlaim($noregistrasi,$kdProfile)
    {
       $pelayanan =collect(\DB::select("select sum(x.totalppenjamin) as totalklaim
         from (select spp.norec,spp.totalppenjamin
         from pasiendaftar_t as pd
            join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
            join pelayananpasien_t as pp on pp.noregistrasifk =apd.norec
            join strukpelayanan_t as sp on sp.norec= pp.strukfk
            join strukpelayananpenjamin_t as spp on spp.nostrukfk=sp.norec
            where pd.noregistrasi ='$noregistrasi'
        --and spp.statusenabled is null 
        and pd.kdprofile=$kdProfile
        GROUP BY spp.norec,spp.totalppenjamin

        ) as x"))->first();
        if(!empty($pelayanan) && $pelayanan->totalklaim!= null){
             return (float) $pelayanan->totalklaim;
         }else{
            return 0;
         }
       

    }
    public function getTotolBayar($noregistrasi,$kdProfile)
    {
      $pelayanan =collect(\DB::select("select sum(x.totaldibayar) as totaldibayar
         from (select sbm.norec,sbm.totaldibayar
         from pasiendaftar_t as pd
        join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
        join pelayananpasien_t as pp on pp.noregistrasifk =apd.norec
        join strukpelayanan_t as sp on sp.norec= pp.strukfk
        join strukbuktipenerimaan_t as sbm on sbm.nostrukfk = sp.norec
        where pd.noregistrasi ='$noregistrasi'
        and sbm.statusenabled =true
        and pd.kdprofile=$kdProfile
        GROUP BY sbm.norec,sbm.totaldibayar

        ) as x"))->first();
        if(!empty($pelayanan) && $pelayanan->totaldibayar!= null){
             return (float) $pelayanan->totaldibayar;
         }else{
            return 0;
         }
       
        
    }
    public function getNomorRekening(Request $request){
        $data = \DB::table('bankaccount_m')
            ->select('*')
            ->where('statusenabled', true)
            ->get();
    
        $result  = array('data' => $data,
                    'as'=> 'er@epic' );
        return $this->respond($result);
    }

    public function UpdateStatConfirm(Request $request)
    {
//        $data=$request['data'];
//        return $this->respond($data);
        try {
//            foreach ($data as $item) {
            $dataApr = AntrianPasienRegistrasi::where('noreservasi', $request['noreservasi'])
                ->update([
                    'isconfirm' => true,
//                        'objectstatusbarang'=> 2
                ]);
//            }

            $transStatus = 'true';
        }catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Update Status Gagal";
        }


        if ($transStatus == 'true') {
            $transMessage = "Update Status Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
//                    "as" => 'cepot',
            );
        } else {
            $transMessage = "Update Status Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
//                    "as" => 'Cepot',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function updateNoCmInAntrianRegistrasi(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        try {

            $dataApr = AntrianPasienRegistrasi::where('norec', $request['norec'])
                ->update([
                    'nocmfk' => $request['nocmfk'],
                ]);

            $transStatus = 'true';
        }catch (\Exception $e) {
            $transStatus = 'false';
        }


        if ($transStatus == 'true') {
            $transMessage = "Update Reconfirm";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            $transMessage = "Update Reconfirm Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function  getPasienByNoRegistrasi($noregistrasi,Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $data = \DB::table('pasiendaftar_t as pd')
            ->leftjoin ('pasien_m as ps','ps.id','=','pd.nocmfk')
            ->leftjoin ('ruangan_m as ru','ru.id','=','pd.objectruanganlastfk')
            ->leftjoin ('kelas_m as kls','kls.id','=','pd.objectkelasfk')
            ->leftjoin ('kelompokpasien_m as kps','kps.id','=','pd.objectkelompokpasienlastfk')
            ->leftjoin ('rekanan_m as rk','rk.id','=','pd.objectrekananfk')
            ->leftjoin ('jeniskelamin_m as jk','jk.id','=','ps.objectjeniskelaminfk')
            ->leftjoin ('alamat_m as alm','alm.id','=','pd.nocmfk')
            ->leftjoin ('agama_m as agm','agm.id','=','ps.objectagamafk')
            ->select('pd.norec as norec_pd','pd.noregistrasi','pd.tglregistrasi','ps.nocm','ps.namapasien',
                'ps.tgllahir','ps.namakeluarga','ru.namaruangan','kls.namakelas','kps.kelompokpasien','rk.namarekanan','alm.alamatlengkap',
                'jk.jeniskelamin','agm.agama','ps.nohp','pd.statuspasien','pd.tglpulang')
            ->where('pd.noregistrasi', $noregistrasi)
            ->where('pd.kdprofile',   $kdProfile)
            ->first();

        $result = array(
            'data'=> $data,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function getDaftarRiwayatRegistrasi( Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $deptRanap = explode (',',$this->settingDataFixed('kdDepartemenRanapFix',$kdProfile));
        $kdDepartemenRawatInap = [];
        foreach ($deptRanap as $itemRanap){
            $kdDepartemenRawatInap []=  (int)$itemRanap;
        }
        $data = \DB::table('pasien_m as ps')
            ->join('pasiendaftar_t as pd','pd.nocmfk','=','ps.id')
            ->join('ruangan_m as ru','ru.id','=','pd.objectruanganlastfk')
            ->leftjoin('pegawai_m as pg','pg.id','=','pd.objectpegawaifk')
            ->select(DB::raw("pd.norec,pd.tglregistrasi,ps.nocm,pd.noregistrasi,ps.namapasien,pd.objectruanganlastfk,ru.namaruangan,
			                  pd.objectpegawaifk,pg.namalengkap as namadokter,pd.tglpulang,ru.objectdepartemenfk,ps.tgllahir"))
            ->where('pd.statusenabled',  true)
            ->where('pd.kdprofile',   $kdProfile);

//        if(isset($request['tglLahir']) && $request['tglLahir']!="" && $request['tglLahir']!="undefined"){
//            $data = $data->where('ps.tgllahir','>=', $request['tglLahir'].' 00:00');
//        };
//        if(isset($request['tglLahir']) && $request['tglLahir']!="" && $request['tglLahir']!="undefined"){
//            $data = $data->where('ps.tgllahir','<=', $request['tglLahir'].' 23:59');
//        };
        if(isset($request['norm']) && $request['norm']!="" && $request['norm']!="undefined") {
            $data = $data->where('ps.nocm', 'ilike', '%'. $request['norm'] .'%');
        };
        if(isset($request['namaPasien']) && $request['namaPasien']!="" && $request['namaPasien']!="undefined") {
            $data = $data->where('ps.namapasien', 'ilike', '%'. $request['namaPasien'] .'%');
        };
        if(isset($request['noReg']) && $request['noReg']!="" && $request['noReg']!="undefined"){
            $data = $data->where('pd.noregistrasi','=', $request['noReg']);
        };
        if(isset($request['idRuangan']) && $request['idRuangan']!="" && $request['idRuangan']!="undefined"){
            $data = $data->where('pd.objectruanganlastfk','=', $request['idRuangan']);
        };

        $data = $data->where('ps.statusenabled',true);
        $data = $data->orderBy('pd.tglregistrasi','desc');
        $data = $data->limit(100);
        $data=$data->get();

        foreach($data as $d){
            $d->statusinap =0;
            foreach($kdDepartemenRawatInap as $ss){
                if($ss == $d->objectdepartemenfk){
                     $d->statusinap =1;
                }
            }
        }
        $result = array(
            'daftar' => $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }
    public function cekPasienByNik($nik) {
        $data =  Pasien::where('noidentitas',$nik)
            ->where('statusenabled',true)->get();

        $result = array(
            'data'=> $data,
            'message' => 'er@epic',
        );
        return $this->respond($result);
    }
    public function saveLibur(Request $request){
         $kdProfile = $this->getDataKdProfile($request);
        DB::beginTransaction();
        try {
            $tgl =[];
              foreach ($request['listtanggal'] as $key => $value) {
                $tgl [] = $value['tgl'];
              }
            $del = SlottingLibur::whereIn('tgllibur',$tgl)->delete();
            foreach ($request['listtanggal'] as $key => $value) {

                $newptp = new SlottingLibur();
                $newptp->id = SlottingLibur::max('id')+1;
                $newptp->statusenabled = true;
                $newptp->kdprofile = $kdProfile;
                $newptp->tgllibur = $value['tgl'];
                $newptp->save();
            }
            

            $transMessage = "Simpan Libur";
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Libur Gagal";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "data" =>$newptp,
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            DB::rollBack();
            $result = array(
//              "noRec" =>$noRec,
                "status" => 400,
                "message" => $transMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
      public function deleteLibur(Request $request){

        DB::beginTransaction();
        try {
            
            $newptp= SlottingLibur::where('id',$request['id'])->update(
                ['statusenabled' => false ]
            );            

            $transMessage = "Hapus Libur";
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Hapus Libur Gagal";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                // "data" =>$newptp,
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            DB::rollBack();
            $result = array(
//              "noRec" =>$noRec,
                "status" => 400,
                "message" => $transMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    
      public function getLibur( Request $request) {
        $data = \DB::table('slottinglibur_m as ps')
            ->select('ps.*')
            ->where('ps.statusenabled',true)
            ->where('ps.kdprofile',$kdProfile);

        if(isset($request['tgllibur']) && $request['tgllibur']!="" && $request['tgllibur']!="undefined") {
            $tgls= $request['tgllibur'];
            $data = $data->whereRaw("format(ps.tgllibur,'yyyy-MM-dd')= 'tgls'");
        };
        if(isset($request['namaPasien']) && $request['namaPasien']!="" && $request['namaPasien']!="undefined") {
            $data = $data->where('ps.namapasien', 'ilike', '%'. $request['namaPasien'] .'%');
        };
        if(isset($request['noReg']) && $request['noReg']!="" && $request['noReg']!="undefined"){
            $data = $data->where('pd.noregistrasi','=', $request['noReg']);
        };
        if(isset($request['idRuangan']) && $request['idRuangan']!="" && $request['idRuangan']!="undefined"){
            $data = $data->where('pd.objectruanganlastfk','=', $request['idRuangan']);
        };


        $data = $data->orderBy('ps.id');
        $data= $data->get();
        $result = array(
            'daftar' => $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function GetNoAntrianMobileJKN(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);

      // $request =  array(
      //     "nomorkartu" => "0000172381691",
      //     "nik" => "3372051109800010",
      //     "notelp" => "085642649135",
      //     "tanggalperiksa" => "2021-04-05",
      //     "kodepoli" => "JIW",
      //     "nomorreferensi" => "0001R0040116A000001",
      //     "jenisreferensi" => "1",
      //     "jenisrequest" => "2",
      //     "polieksekutif" => "0"
      // );

        $request = $request->json()->all();
//        print_r($request);
//        exit();

        if(empty($request['nomorkartu']) ) {
            $result = array("response"=>null,"metadata"=>array("code" => "400","message" => "Nomor Kartu BPJS tidak boleh kosong"));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }

        if(empty($request['tanggalperiksa'])) {
            $result = array("response"=>null,"metadata"=>array("code" => "400","message" => "Tanggal Periksa tidak boleh kosong"));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }

        if (!preg_match("/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/",$request['tanggalperiksa'])) {
            $result = array("response"=>null,"metadata"=>array("code" => "400","message" => "Format Tanggal Periksa salah"));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }

        if($request['tanggalperiksa'] >= date('Y-m-d',strtotime('+90 days',strtotime(date('Y-m-d'))))){
            $result = array("response"=>null,"metadata"=>array("code" => "400","message" => "Tanggal periksa maksimal 90 hari dari hari ini"));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }
        if($request['tanggalperiksa'] == date('Y-m-d')){
            $result = array("response"=>null,"metadata"=>array("code" => "400","message" => "Tanggal periksa minimal besok"));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }
        if($request['tanggalperiksa'] < date('Y-m-d')){
            $result = array("response"=>null,"metadata"=>array("code" => "400","message" => "Tanggal periksa minimal besok"));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }
//        return date('w',strtotime( $request['tanggalperiksa'] ) );
        if(date('w',strtotime( $request['tanggalperiksa'] )) == 0 ){
            $result = array("response"=>null,
                "metadata"=>array("code" => "400",
                    "message" => "Tidak ada jadwal Poli di hari Minggu")
            );
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }
//        return  date('w',strtotime( $request['tanggalperiksa'] ));
//
//        function isWeekend($date) {
//            $weekDay = date('w', strtotime($date));
//            return ($weekDay == 0
////                || $weekDay == 6
//            );
//        }
        if(empty($request['nik']) ) {
            $result = array("response"=>null,"metadata"=>array("code" => "400","message" => "NIK tidak boleh kosong"));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }
        if(empty($request['kodepoli']) ) {
            $result = array("response"=>null,"metadata"=>array("code" => "400","message" => "Kodepoli tidak boleh kosong"));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }else{
//            if($request['kodepoli'] != "JIW" ) {
//                $result = array("response"=>null,"metadata"=>array("code" => "400","message" => "Kodepoli tidak sesuai"));
//                return $this->setStatusCode($result['metadata']['code'])->respond($result);
//            }
        }

        if(empty($request['jenisreferensi']) ) {
            $result = array("response"=>null,"metadata"=>array("code" => "400","message" => "Jenis Referensi tidak boleh kosong"));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }else{
            if($request['jenisreferensi'] < "1" || $request['jenisreferensi'] > "2") {
                $result = array("response"=>null,"metadata"=>array("code" => "400","message" => "Jenis Referensi tidak sesuai"));
                return $this->setStatusCode($result['metadata']['code'])->respond($result);
            }
        }

        if(empty($request['jenisrequest']) ) {
            $result = array("response"=>null,"metadata"=>array("code" => "400","message" => "Jenis Request tidak boleh kosong"));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }else{
            if($request['jenisrequest'] < "1" || $request['jenisrequest'] > "2") {
                $result = array("response"=>null,"metadata"=>array("code" => "400","message" => "Jenis Request tidak sesuai"));
                return $this->setStatusCode($result['metadata']['code'])->respond($result);
            }
        }

        if(empty($request['polieksekutif']) && $request['polieksekutif'] != "0") {
            $result = array("response"=>null,"metadata"=>array("code" => "400","message" => "Poli Eksekutif tidak boleh kosong"));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }else{
            if($request['polieksekutif'] < "0" || $request['polieksekutif'] > "1") {
                $result = array("response"=>null,"metadata"=>array("code" => "400","message" => "Poli Eksekutif tidak sesuai"));
                return $this->setStatusCode($result['metadata']['code'])->respond($result);
            }
        }


//        return $antrian;
            $eksek = false;
            if($request['polieksekutif'] == 1){
                $eksek = true;
            }
            if($request['jenisrequest']  == '2') {//POLI
                DB::beginTransaction();
                try {

                $antrian = $this->GetJamKosong($request['kodepoli'], $request['tanggalperiksa'], $kdProfile,$eksek);
                $pasien = \DB::table('pasien_m')
                    ->whereRaw("nobpjs = '" . $request['nomorkartu'] . "'")
                    ->where('statusenabled', true)
                    ->where('kdprofile', $kdProfile)
                    ->first();


                $ruang = Ruangan::where('kdinternal', $request['kodepoli'])
                    ->where('statusenabled', true)
                    ->where('iseksekutif',$eksek)
                    ->where('kdprofile', $kdProfile)->first();
                if (empty($ruang)) {
                    $result = array("response" => null, "metadata" => array("code" => "400", "message" => "Kodepoli tidak sesuai"));
                    return $this->setStatusCode($result['metadata']['code'])->respond($result);
                }
                if (empty($pasien)) {
//                    return $this->respond($pasien);
                      $request['jenisrequest']  ='1';
                       DB::commit();
                      return  $this->postPendaftaranJKN($request,$kdProfile);
//                    $pro = Profile::where('id', $kdProfile)->first();
//                    $result = array(
//                        "response" => null,
//                        "metadata" => array("code" => "400", "message" => "Belum terdaftar sebagai pasien " . $pro->namaexternal)
//                    );
//                    return $this->setStatusCode($result['metadata']['code'])->respond($result);
                }

                    $tipepembayaran = '2';
                    $tgl = $request['tanggalperiksa'];

                    $dataReservasi = \DB::table('antrianpasienregistrasi_t as apr')
                        ->select('apr.noantrian', 'apr.noreservasi', 'ru.namaexternal', 'apr.tanggalreservasi')
                        ->join('ruangan_m as ru', 'ru.id', '=', 'apr.objectruanganfk')
//                        ->whereRaw("apr.tanggalreservasi BETWEEN '$tgl' AND '" . date('Y-m-d', strtotime('+1 day', strtotime($tgl))) . "'")
                        ->whereRaw("to_char(apr.tanggalreservasi,'yyyy-MM-dd')= '$tgl'")
                        ->where('apr.objectruanganfk', '=', $ruang->id)
                        ->where('apr.noreservasi', '!=', '-')
                        ->where('apr.noidentitas', '=', $request['nik'])
                        ->where('apr.nobpjs', '=', $request['nomorkartu'])
                        ->whereNotNull('apr.noreservasi')
                        ->where('apr.statusenabled', true)
                        ->first();
//                return $this->respond($dataReservasi);
                    if (isset($dataReservasi) && !empty($dataReservasi)) {
                        $result = array("response" => null, "metadata" => array("code" => "400", "message" => "Mohon maaf anda sudah mendaftar pada tanggal " . $tgl));
                        return $this->setStatusCode($result['metadata']['code'])->respond($result);
                    }

                    $newptp = new AntrianPasienRegistrasi();
                    $nontrian = AntrianPasienRegistrasi::max('noantrian') + 1;
                    $newptp->norec = $newptp->generateNewId();;
                    $newptp->kdprofile = $kdProfile;
                    $newptp->statusenabled = true;
                    $newptp->objectruanganfk = $ruang->id;
                    $newptp->objectjeniskelaminfk = $pasien->objectjeniskelaminfk;
                    $newptp->noreservasi = substr(Uuid::generate(), 0, 7);
                    $newptp->tanggalreservasi = $request['tanggalperiksa'] . " " . $antrian['jamkosong'];
                    $newptp->tgllahir = $pasien->tgllahir;
                    $newptp->objectkelompokpasienfk = $tipepembayaran;
                    $newptp->objectpendidikanfk = 0;
                    $newptp->namapasien = $pasien->namapasien;
                    $newptp->noidentitas = $request['nik'];
                    $newptp->tglinput = date('Y-m-d H:i:s');
                    $newptp->nobpjs = $request['nomorkartu'];
                    $newptp->norujukan = $request['nomorreferensi'];
                    $newptp->notelepon = $pasien->nohp;
                    $newptp->objectpegawaifk = null;
                    $newptp->tipepasien = "LAMA";
                    $newptp->ismobilejkn = 1;
                    $newptp->type = "LAMA";

                    $newptp->objectagamafk = $pasien->objectagamafk;
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
                    $newptp->noantrian = $antrian['antrian'];
                    $newptp->noidentitas = $pasien->noidentitas;
                    $newptp->nocmfk = $pasien->id;
                    $newptp->paspor = $pasien->paspor;
                    $newptp->objectpekerjaanfk = $pasien->objectpekerjaanfk;
                    $newptp->objectpendidikanfk = $pasien->objectpendidikanfk != null ? $pasien->objectpendidikanfk : 0;
                    $newptp->objectstatusperkawinanfk = $pasien->objectstatusperkawinanfk;
                    $newptp->tempatlahir = $pasien->tempatlahir;

                    $newptp->save();
                    $transStatus = 'true';

                    $transMessage = "Ok";
                } catch (Exception $e) {
                    $transMessage = "Gagal Reservasi";
                    $transStatus = 'false';
                }

                if ($transStatus != 'false') {
                    DB::commit();
//                        $dataHasil = \DB::table('antrianpasienregistrasi_t as apr')
//                            ->select('apr.noantrian', 'apr.noreservasi', 'ru.namaexternal', 'apr.tanggalreservasi')
//                            ->join('ruangan_m as ru', 'ru.id', '=', 'apr.objectruanganfk')
//                            ->whereRaw("apr.tanggalreservasi BETWEEN '$tgl' AND '" . date('Y-m-d', strtotime('+1 day', strtotime($tgl))) . "'")
//                            ->where('apr.objectruanganfk', '=', $ruang->id)
//                            ->where('apr.noreservasi', '!=', '-')
//                            ->where('apr.noidentitas', '=', $request['nik'])
//                            ->where('apr.nobpjs', '=', $request['nomorkartu'])
//                            ->whereNotNull('apr.noreservasi')
//                            ->where('apr.statusenabled', true)
//                            ->first();

                    $estimasidilayani = strtotime($newptp->tanggalreservasi) * 1000;
                    $result = array(
                        "response" => array(
                            "nomorantrean" => $newptp->noantrian,
                            "kodebooking" => $newptp->noreservasi,
                            "jenisantrean" => '2',
                            "estimasidilayani" => $estimasidilayani,
                            "namapoli" => $ruang->namaexternal,
                            "namadokter" => '',

                        ),
                        "metadata" => array(
                            "code" => "200",
                            "message" => $transMessage)
                    );
                }else{
                    DB::rollBack();
                    $result = array(
                        "response" => null,
                        "metadata" => array(
                            "code" => "200",
                            "message" => $transMessage)
                    );

                }
                return $this->setStatusCode($result['metadata']['code'])->respond($result);

            }else{
                /*
                 * jenis reqeust 1 //PENDAFTARAN
                 */
                return $this->postPendaftaranJKN($request,$kdProfile);

        }
    }
    public function  postPendaftaranJKN($request,$kdProfile){
        $eksek = false;
        if($request['polieksekutif'] == 1){
            $eksek = true;
        }
        DB::beginTransaction();
        try {
            $pasien = \DB::table('pasien_m')
                ->whereRaw("nobpjs = '" . $request['nomorkartu'] . "'")
                ->where('statusenabled', true)
                ->where('kdprofile', $kdProfile)
                ->first();
            $ruang = Ruangan::where('kdinternal', $request['kodepoli'])
                ->where('statusenabled', true)
                ->where('iseksekutif',$eksek)
                ->where('kdprofile', $kdProfile)->first();
            if (empty($ruang)) {
                $result = array("response" => null, "metadata" => array("code" => "400", "message" => "Kodepoli tidak sesuai"));
                return $this->setStatusCode($result['metadata']['code'])->respond($result);
            }

            $tgl = $request['tanggalperiksa'];

            $dataReservasi = \DB::table('antrianpasienregistrasi_t as apr')
                ->select('apr.noantrian', 'apr.noreservasi', 'ru.namaexternal', 'apr.tanggalreservasi')
                ->join('ruangan_m as ru', 'ru.id', '=', 'apr.objectruanganfk')
//                        ->whereRaw("apr.tanggalreservasi BETWEEN '$tgl' AND '" . date('Y-m-d', strtotime('+1 day', strtotime($tgl))) . "'")
                ->whereRaw("to_char(apr.tanggalreservasi,'yyyy-MM-dd')= '$tgl'")
                ->where('apr.objectruanganfk', '=', $ruang->id)
                ->where('apr.noreservasi', '=', '-')
                ->where('apr.noidentitas', '=', $request['nik'])
                ->where('apr.nobpjs', '=', $request['nomorkartu'])
                ->whereNotNull('apr.noreservasi')
                ->where('apr.statusenabled', true)
                ->first();
//                return $this->respond($dataReservasi);
            if (isset($dataReservasi) && !empty($dataReservasi)) {
                $nomor = str_pad($dataReservasi->noantrian, 3, '0', STR_PAD_LEFT);
                $result = array("response" => null, "metadata" => array("code" => "400",
                    "message" => "Mohon maaf anda sudah mendaftar pada tanggal " . $tgl ." No Antrean : B-".$nomor));
                return $this->setStatusCode($result['metadata']['code'])->respond($result);
            }
            $tglAyeuna = $request['tanggalperiksa'] . date(' H:i:s');

            $tglAwal = $request['tanggalperiksa'] .' 00:00:00';
            $tglAkhir =$request['tanggalperiksa'] .' 23:59:59';
            $kdRuanganTPP = $this->settingDataFixed('idRuanganTPP1',$kdProfile);

            $newptp = new AntrianPasienRegistrasi();
            $norec = $newptp->generateNewId();
            $nontrian = AntrianPasienRegistrasi::where('jenis', 'B')
                    ->whereBetween('tanggalreservasi', [$tglAwal, $tglAkhir])
                    ->max('noantrian') + 1;
            //                return $nontrian;
            $newptp->norec = $norec;
            $newptp->kdprofile = $kdProfile;
            $newptp->statusenabled = true;
            $newptp->objectruanganfk =  $ruang->id;//$kdRuanganTPP;
            $newptp->objectjeniskelaminfk = 0;
            $newptp->noantrian = $nontrian;
            $newptp->noreservasi = "-";
            $newptp->objectpendidikanfk = 0;

            $newptp->namapasien = !empty($pasien) ? $pasien->namapasien : null;
            $newptp->noidentitas = $request['nik'];
            $newptp->tglinput = date('Y-m-d H:i:s');
            $newptp->nobpjs = $request['nomorkartu'];
            $newptp->norujukan = $request['nomorreferensi'];
            $newptp->notelepon = !empty($pasien) ? $pasien->nohp : null;
            $newptp->nocmfk = !empty($pasien) ? $pasien->id : null;

            $newptp->tanggalreservasi = $tglAyeuna;
            $newptp->tipepasien = "BARU";
            $newptp->type = substr(Uuid::generate(), 0, 7);//"BARU";
            $newptp->jenis = 'B';//BPJS
            $newptp->statuspanggil = 0;
            $newptp->ismobilejkn = 1;
            $newptp->save();
//                    $nontrian= 2;
            /*
             * estimasi dilayani 5 menit sekali dari poli buka sesuai antrian
             */
            $es = date('Y-m-d H:i:s',strtotime('+'. (float) 5 * $nontrian  .' minutes',strtotime($request['tanggalperiksa'].' 08:00:00')));
            //                return $estimasidilayani;
            $estimasidilayani = strtotime($es) * 1000;
            $transStatus = 'true';
            $transMessage = "Ok";
        } catch (Exception $e) {
            $transMessage = "Gagal Reservasi";
            $transStatus = 'false';
        }
        if($transStatus == 'true') {
            DB::commit();
            $nomor = str_pad($newptp->noantrian, 3, '0', STR_PAD_LEFT);
//                    return $this->respond($nomor);
            $result = array(
                "response" => array(
                    "nomorantrean" => 'B-'.$nomor,
                    "kodebooking" => $newptp->type,
                    "jenisantrean" => '1', //Pendafaran
                    "estimasidilayani" => $estimasidilayani,
                    "namapoli" => $ruang->namaexternal,
                    "namadokter" => '',

                ),
                "metadata" => array(
                    "code" => "200",
                    "message" => $transMessage)
            );
        }else{
            $result = array(
                "response"=>null,
                "metadata"=>array("code" => "400","message" => "Gagal Reservasi")
            );
        }
        return $this->setStatusCode($result['metadata']['code'])->respond($result);
    }
    public function GetJamKosong($kode,$tgl,$kdProfile,$eksek){
        $ruang = Ruangan::where('kdinternal',$kode)
            ->where('statusenabled',true)
            ->whereRaw(" ( iseksekutif=false or iseksekutif is null ) ")
            ->where('kdprofile',$kdProfile)->first();
       if(empty($ruang)){
           $result = array("response"=>null,"metadata"=>array("code" => "400","message" => "Kodepoli tidak sesuai"));
           return $this->setStatusCode($result['metadata']['code'])->respond($result);
       }
        $dataReservasi = \DB::table('antrianpasienregistrasi_t as apr')
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

        $ruangan = \DB::table('ruangan_m as ru')
            ->join('slottingonline_m as slot', 'slot.objectruanganfk', '=', 'ru.id')
            ->select('ru.id', 'ru.namaruangan', 'ru.objectdepartemenfk', 'slot.jambuka', 'slot.jamtutup',
                'slot.quota',
                DB::raw("(EXTRACT(EPOCH FROM slot.jamtutup) - EXTRACT(EPOCH FROM slot.jambuka))/3600 as totaljam"))
            ->where('ru.statusenabled', true)
            ->where('ru.id',  $ruang->id)
            ->where('ru.kdprofile',$kdProfile)
            ->where('slot.statusenabled', true)
            ->first();
//        return $this->respond($ruangan);
        if(empty($ruangan)){
            $result = array("response"=>null,"metadata"=>array("code" => "400","message" => "Jadwal penuh"));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }

        $begin = new Carbon($ruangan->jambuka);
        $jamBuka = $begin->format('H:i');
        $end = new Carbon($ruangan->jamtutup);
        $jamTutup = $end->format('H:i');
        $quota =(float)$ruangan->quota;
        $waktuPerorang = ((float)$ruangan->totaljam / (float)$ruangan->quota) * 60;

        $i =0;
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
        /*
         * old
         */
//        $slotakhir = $quota-$slotterisi;
//        if($slotakhir > 0){
//            //$cenvertedTime = date('Y-m-d H:i:s',strtotime('+1 hour +30 minutes +45 seconds',strtotime($startTime)));
//            $jamkosongpre = date('H:i',strtotime('+'.floor($waktuPerorang)." minutes",strtotime($jamakhir)));
//            $jamkosongfix = new Carbon($jamkosongpre);
//            $jamkosongfix = $jamkosongfix->format("H:i");
//            return array("antrian"=>$slotterisi+1,"jamkosong"=>$jamkosongfix);
//        }else{
//            return array("antrian"=>0,"jamkosong"=>"00:00");
//        }
        /*
        * end old
        */


//        return   date('H:i',strtotime('+'.floor($waktuPerorang)." minutes",strtotime($jamTutup)));
        /*
         * slot
         */
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
//                        this.listJam.splice([i], 1);
                        array_splice($intervals,$k,1);
                    }
                }
            }
        }
        // OLD: slot-based - nomor antrian berdasarkan posisi slot jam di jadwal harian
        // if(count($intervals) > 0){
        //     $antrian = 1;
        //     for ($x = 0; $x <= count($intervalsAwal); $x++) {
        //         if($intervals[0]['jam']== $intervalsAwal[$x]['jam']){
        //             $antrian = $x +1;
        //             // dd($antrian);
        //             break;
        //         }
        //     }
        //     return array("antrian"=> $antrian+1,"jamkosong"=>$intervals[0]['jam']);
        // }else{
        //     return array("antrian"=> 0,"jamkosong"=>"00:00");
        // }

        // NEW: sequential - nomor antrian berdasarkan max(noantrian) + 1 per ruangan per tanggal
        $jamKosong = count($intervals) > 0 ? $intervals[0]['jam'] : "00:00";
        if ($jamKosong == "00:00") {
            return array("antrian" => 0, "jamkosong" => "00:00");
        }
        $maxAntrian = \DB::table('antrianpasienregistrasi_t')
            ->where('objectruanganfk', $ruang->id)
            ->whereRaw("to_char(tanggalreservasi,'yyyy-MM-dd') = '$tgl'")
            ->where('noreservasi', '!=', '-')
            ->whereNotNull('noreservasi')
            ->where('statusenabled', true)
            ->where('kdprofile', $kdProfile)
            ->max('noantrian');
        $antrianBaru = ($maxAntrian ?? 0) + 1;
        return array("antrian" => $antrianBaru, "jamkosong" => $jamKosong);

    }
    public function GetRekapMobileJKN(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
//        $request =  array(
//            "tanggalperiksa" => "2020-10-09",
//            "kodepoli" => "JIW",
//            "polieksekutif" => "0"
//        );

        $request = $request->json()->all();


        if(empty($request['tanggalperiksa']) ) {
            $result = array("response"=>null,"metadata"=>array("code" => "400","message" => "Tanggal Periksa tidak boleh kosong"));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }

        if (!preg_match("/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/",$request['tanggalperiksa'])) {
            $result = array("response"=>null,"metadata"=>array("code" => "400","message" => "Format Tanggal Periksa salah"));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }

        if($request['tanggalperiksa'] >= date('Y-m-d',strtotime('+90 days',strtotime(date('Y-m-d'))))){
            $result = array("response"=>null,"metadata"=>array("code" => "400","message" => "Tanggal periksa maksimal 90 hari dari hari ini"));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }

        if(empty($request['kodepoli']) ) {
            $result = array("response"=>null,"metadata"=>array("code" => "400","message" => "Kodepoli tidak boleh kosong"));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }else{
//            if($request['kodepoli'] != "JIW" ) {
//                $result = array("response"=>null,"metadata"=>array("code" => "400","message" => "Kodepoli tidak sesuai"));
//                return $this->setStatusCode($result['metadata']['code'])->respond($result);
//            }
        }

        if(empty($request['polieksekutif']) && $request['polieksekutif'] != "0") {
            $result = array("response"=>null,"metadata"=>array("code" => "400","message" => "Poli Eksekutif tidak boleh kosong"));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }else{
            if($request['polieksekutif'] < "0" || $request['polieksekutif'] > "1") {
                $result = array("response"=>null,"metadata"=>array("code" => "400","message" => "Poli Eksekutif tidak sesuai"));
                return $this->setStatusCode($result['metadata']['code'])->respond($result);
            }
        }
        $eksek = false;
        if($request['polieksekutif'] == 1){
            $eksek = true;
        }
        try {
            $ruang = Ruangan::where('kdinternal',$request['kodepoli'])
                ->where('statusenabled',true)
                ->where('iseksekutif', $eksek)
                ->where('kdprofile',$kdProfile)->first();
            if(empty($ruang)){
                $result = array("response"=>null,"metadata"=>array("code" => "400","message" => "Kodepoli tidak sesuai"));
                return $this->setStatusCode($result['metadata']['code'])->respond($result);
            }
//            $ruang = Ruangan::where('kdprofile',$kdProfile)
            $tgl = $request['tanggalperiksa'];

            $data = \DB::table('antrianpasienregistrasi_t as apr')
                ->leftJoin('ruangan_m as ru','ru.id','=','apr.objectruanganfk')
                ->select('ru.namaexternal','apr.norec','apr.noreservasi')
                ->where('apr.objectruanganfk','=',$ruang->id)
                ->whereRaw(" to_char(apr.tanggalreservasi,'yyyy-MM-dd') = '$tgl'")
//                ->where('apr.noreservasi','!=','-')
                ->where('apr.ismobilejkn','=','1')
                ->whereNotNull('apr.noreservasi')
                ->where('apr.statusenabled',true)
                ->where('apr.kdprofile',$kdProfile)
                ->get();
//            return $this->respond($data);
            if(count($data) > 0){
                $ruId =$ruang->id;
                $terlayani = collect(DB::select("SELECT
                        pd.norec,pd.noregistrasi,pd.statusschedule
                    FROM
                        pasiendaftar_t AS pd  
                    LEFT JOIN antrianpasienregistrasi_t AS apr ON apr.noreservasi = pd.statusschedule
                    AND apr.nocmfk = pd.nocmfk
                    where pd.kdprofile=$kdProfile
                    and pd.statusenabled=true
                    and apr.ismobilejkn=true
                    and pd.objectruanganlastfk =$ruId and to_char(pd.tglregistrasi,'yyyy-MM-dd')='$tgl' "))->count();
                $result = array(
                    "response" =>
                        array(
                            "namapoli" => $data[0]->namaexternal,
                            "totalantrean" => count($data),
                            "jumlahterlayani" => $terlayani,
                            "lastupdate" => $milliseconds = round(microtime(true) * 1000)
                        ),
                    "metadata"=>
                        array(
                            'message' => "OK",
                            'code' => '200',
                        )
                );
            }else{
                $result = array(
                    "response" =>
                        null,
                    "metadata"=>
                        array(
                            'message' => "Belum ada data yang bisa ditampilkan",
                            'code' => '400',
                        )
                );
            }


        } catch (Exception $e) {
            $result = array(
                "response" =>
                    null,
                "metadata"=>
                    array(
                        'message' => "Gagal menampilkan data",
                        'code' => '400',
                    )
            );
        }
        return $this->respond($result);
    }
    public function getKodeBokingOperasi(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $request = $request->json()->all();
        if(empty($request['nopeserta']) ) {
            $result = array("metadata" => array("message" => "Nomor Kartu Belum Diisi", "code" => 201));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }
        if(!is_numeric($request['nopeserta']) || strlen($request['nopeserta']) < 13) {
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

    public function getJadwalOperasi(Request $request)
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

    public function GetStatusAntrianMobileJKN(Request $request){
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
                    ->where('statusenabled', true)
                    ->where('kdprofile', $kdProfile)->first();

            if (empty($ruang)) {
                $result = array("metadata" => array("message" => "Poli Tidak Ditemukan", "code" => 201));
                return $this->respond($result);
            }
            
            $getStatusAntrian = DB::select(DB::raw("
                
                SELECT  x.namapoli,x.namadokter,
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
                FROM antrianpasienregistrasi_t AS apr
                INNER JOIN slottingonline_m AS sk ON sk.objectruanganfk = apr.objectruanganfk 
                INNER JOIN ruangan_m AS ru ON ru.id = apr.objectruanganfk
                LEFT JOIN pegawai_m AS pg ON pg.id = apr.objectpegawaifk
                WHERE apr.kdprofile = $kdProfile
                AND apr.tanggalreservasi between '$tglAwal' and '$tglAkhir'
                AND ru.kdinternal = '$kdInternalRuangan'            
                AND pg.kddokterbpjs = $kodeDokter
                and ( apr.isbatal != false or apr.isbatal is null)
                GROUP BY apr.norec,ru.namaruangan,pg.namalengkap,apr.statuspanggil,
                         sk.quota
                ) AS x
                GROUP BY x.namapoli,x.namadokter,x.koutajkn,x.koutanonjkn        
                LIMIT 1
            "));

            $getLisAntrean = DB::select(DB::raw("
                select 
                apr.jenis || '-' ||
                CASE WHEN length(CAST(apr.noantrian AS VARCHAR)) = 1 THEN
                '0'|| CAST(apr.noantrian AS VARCHAR) ELSE CAST(apr.noantrian AS VARCHAR) END AS noantrian 
                from antrianpasienregistrasi_t AS apr
                LEFT JOIN ruangan_m AS ru ON ru.id = apr.objectruanganfk
                LEFT JOIN pegawai_m AS pg ON pg.id = apr.objectpegawaifk
                where apr.kdprofile = $kdProfile
                AND apr.tanggalreservasi BETWEEN '$tglAwal' and '$tglAkhir'
                AND ru.kdinternal = '$kdInternalRuangan' 
                AND pg.kddokterbpjs = $kodeDokter
                AND statuspanggil = '0'
                and ( apr.isbatal != false or apr.isbatal is null)
                ORDER BY apr.tanggalreservasi DESC
                LIMIT 1
            "));

            $antrian = "";
            foreach ($getLisAntrean as $itt){
                $antrian = $itt->noantrian;
            }
            $result = [];
            foreach ($getStatusAntrian AS $item){
                $result = array(
                    "namapoli" => $item->namapoli,
                    "namadokter" => $item->namadokter,
                    "totalantrean" => $item->totalantrean,
                    "sisaantrean" => $item->sisaantrean,
                    "antreanpanggil" =>$antrian,
                    "sisakuotajkn"=> $item->sisakoutajkn,
                    "kuotajkn" => $item->koutajkn,
                    "sisakuotanonjkn" =>$item->sisakoutanonjkn,
                    "kuotanonjkn" => $item->koutanonjkn,
                    "keterangan" => ""
                );
            }

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


    public function GetAntrean(Request $request){

        $kdProfile = $this->getDataKdProfile($request);
        $request = $request->json()->all();

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
        }else{

        }

        if(empty($request['jeniskunjungan']) ) {
            $result = array("metadata"=>array("message" => "Jenis Kunjungan tidak boleh kosong", "code" => 201));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }else{

        }

        if(empty($request['nomorreferensi']) ) {
            $result = array("metadata"=>array("message" => "Nomor Referensi tidak boleh kosong", "code" => 201));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }else{
//            if($request['nomorreferensi'] < "1" || $request['nomorreferensi'] > "2") {
//                $result = array("response"=>null,"metadata"=>array("code" => "400","message" => "Nomor Referensi tidak sesuai"));
//                return $this->setStatusCode($result['metadata']['code'])->respond($result);
//            }
        }

        // cekJadwalHFIS
        $objetoRequest = new \Illuminate\Http\Request();
        $objetoRequest ['url']= "jadwaldokter/kodepoli/". $request['kodepoli']."/tanggal/". $request['tanggalperiksa'];
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
                    // dd($item);
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
                $result = array("metadata"=>array("message" => "Jadwal Dokter ".$dokter->namalengkap." Tersebut Belum Tersedia, Silahkan Reschedule Tanggal dan Jam Praktek Lainnya", "code" => 201));
                return $this->setStatusCode($result['metadata']['code'])->respond($result);
            }
        }
     

        $eksek = false;

        $jenisrequest = 0;
//        if($request['polieksekutif'] == 1){
//            $eksek = true;
//        }
//        if($request['jenisrequest']  == '2') {//POLI
        DB::beginTransaction();
            try {
                $norm = "";
                $namaDokter = "";
                $idDokter = null;
                $pasienBaru = 0;
                $antrian = $this->GetJamKosong($request['kodepoli'], $request['tanggalperiksa'], $kdProfile,$eksek);
                $pasien = \DB::table('pasien_m')
                    ->whereRaw("nobpjs = '" . $request['nomorkartu'] . "'")
                    ->where('statusenabled', true)
                    ->where('kdprofile', $kdProfile)
                    ->first();
                $dokter = DB::table('pegawai_m')
                          ->where('statusenabled', true)
                          ->where('kdprofile', $kdProfile)
                          ->where('kddokterbpjs', $request['kodedokter'])
                          ->first();

                $ruang = Ruangan::where('kdinternal', $request['kodepoli'])
                    ->where('statusenabled', true)
                    ->where('iseksekutif',$eksek)
                    ->where('kdprofile', $kdProfile)->first();

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

                    // return  $this->postPendaftaranJKN($request,$kdProfile);
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

                $dataReservasi = \DB::table('antrianpasienregistrasi_t as apr')
                    ->select('apr.noantrian', 'apr.noreservasi', 'ru.namaexternal', 'apr.tanggalreservasi')
                    ->join('ruangan_m as ru', 'ru.id', '=', 'apr.objectruanganfk')
                    ->whereRaw("to_char(apr.tanggalreservasi,'yyyy-MM-dd')= '$tgl'")
                    ->where('apr.objectruanganfk', '=', $ruang->id)
                    ->where('apr.noreservasi', '!=', '-')
                    ->where('apr.noidentitas', '=', $request['nik'])
                    ->where('apr.nobpjs', '=', $request['nomorkartu'])
                    ->whereNotNull('apr.noreservasi')
                    ->whereRaw(" (apr.isbatal != false or apr.isbatal is null)")
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
                    $newptp->jenis = "B";
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
//                $getLisAntrean = DB::select(DB::raw("
//                        SELECT  x.namapoli,x.namadokter,
//                                SUM(x.belumdipanggil) - SUM(x.sudahdipanggil) AS sisaantrean,
//                                SUM(x.totalantrean) AS totalantrean,
//                                x.koutajkn AS koutajkn,
//                                x.koutajkn - SUM(x.totalantrean) AS sisakoutajkn,
//                                x.koutanonjkn AS koutanonjkn,
//                                x.koutanonjkn - SUM(x.totalantrean) AS sisakoutanonjkn
//                        FROM(SELECT apr.norec,ru.namaruangan AS namapoli,pg.namalengkap AS namadokter,
//                                    COUNT(apr.norec) AS totalantrean,
//                                    CASE WHEN CAST(apr.statuspanggil AS INTEGER) = 0 THEN 1 ELSE 0 END AS belumdipanggil,
//                                    CASE WHEN CAST(apr.statuspanggil AS INTEGER) = 1 THEN 0 ELSE 0 END AS dipanggil,
//                                    CASE WHEN CAST(apr.statuspanggil AS INTEGER) = 2 THEN 0 ELSE 0 END AS sudahdipanggil,
//                                    sk.quota AS koutajkn,sk.quota AS koutanonjkn
//                        FROM antrianpasienregistrasi_t AS aprs
//                        INNER JOIN slottingonline_m AS sk ON sk.objectruanganfk = apr.objectruanganfk
//                        INNER JOIN ruangan_m AS ru ON ru.id = apr.objectruanganfk
//                        LEFT JOIN pegawai_m AS pg ON pg.id = apr.objectpegawaifk
//                        WHERE apr.kdprofile = $kdProfile
//                        AND apr.tanggalreservasi between '$tglAwal' and '$tglAkhir'
//                        AND ru.kdinternal = '$kdInternalRuangan'
//                        AND pg.kddokterbpjs = $kodeDokter
//                        GROUP BY apr.norec,ru.namaruangan,pg.namalengkap,apr.statuspanggil,
//                                 sk.quota
//                        ) AS x
//                        GROUP BY x.namapoli,x.namadokter,x.koutajkn,x.koutanonjkn
//                        LIMIT 1
//                    "));
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
                FROM slottingonline_m as sk 
                INNER JOIN antrianpasienregistrasi_t AS apr ON sk.objectruanganfk = apr.objectruanganfk AND apr.tanggalreservasi between '$tglAwal' and '$tglAkhir'
                and apr.kdprofile = $kdProfile
                 and ( apr.isbatal != false or apr.isbatal is null)
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
                date_default_timezone_set('Asia/Jakarta'); // set timezone
                if ($pasienBaru == 0){
                    $estimasidilayani = strtotime(date($newptp->tanggalreservasi)) * 1000;
                    $result = array(
                        "response" => array(
                            "nomorantrean" =>  $newptp->jenis . '-' . $nomorAntrian,
                            "angkaantrean" => count($getLisAntrean) > 0 ? $getLisAntrean[0]->totalantrean :1,
                            "kodebooking" => $newptp->noreservasi,
                            // "pasienbaru" => $jenisrequest,
                            "norm" => $norm,
                            "namapoli" => $ruang->namaruangan,
                            "namadokter" => $namaDokter,
                            "estimasidilayani" => $estimasidilayani,
                            "sisakuotajkn" => $getLisAntrean[0]->sisakoutajkn,
                            "kuotajkn" => $getLisAntrean[0]->koutajkn,
                            "sisakuotanonjkn" => $getLisAntrean[0]->sisakoutanonjkn,
                            "kuotanonjkn" => $getLisAntrean[0]->koutanonjkn,
                            "keterangan" => "Peserta harap 60 menit lebih awal guna pencatatan administrasi."
                        ),
                        "metadata" => array(
                            "message" => "Pasien Baru",
                            "code" => 202
                        )
                    );
                }else{
                    $estimasidilayani = strtotime(date($newptp->tanggalreservasi)) * 1000;
                    $result = array(
                        "response" => array(
                            "nomorantrean" =>  $newptp->jenis . '-' . $nomorAntrian,
                            "angkaantrean" => $getLisAntrean[0]->totalantrean,
                            "kodebooking" => $newptp->noreservasi,
                            // "pasienbaru" => $jenisrequest,
                            "norm" => $norm,
                            "namapoli" => $ruang->namaruangan,
                            "namadokter" => $namaDokter,
                            "estimasidilayani" => $estimasidilayani,
                            "sisakuotajkn" => $getLisAntrean[0]->sisakoutajkn,
                            "kuotajkn" => $getLisAntrean[0]->koutajkn,
                            "sisakuotanonjkn" => $getLisAntrean[0]->sisakoutanonjkn,
                            "kuotanonjkn" => $getLisAntrean[0]->koutanonjkn,
                            "keterangan" => "Peserta harap 60 menit lebih awal guna pencatatan administrasi."
                        ),
                        "metadata" => array(
                            "message" => $transMessage,
                            "code" => 200
                        )
                    );
                }
            }else{
                \DB::rollBack();
                $result = array(
                    "metadata" => array(
                        "message" => $transMessage,
                        "code" => 201
                    )
                );

            }
            return $this->setStatusCode($result['metadata']['code'])->respond($result);

    }

    public function GetSisaAntrean(Request $request){
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
                            SELECT  x.namapoli,x.namadokter,
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
                            FROM antrianpasienregistrasi_t AS apr
                            INNER JOIN slottingonline_m AS sk ON sk.objectruanganfk = apr.objectruanganfk 
                            INNER JOIN ruangan_m AS ru ON ru.id = apr.objectruanganfk
                            LEFT JOIN pegawai_m AS pg ON pg.id = apr.objectpegawaifk
                            WHERE apr.kdprofile = $kdProfile
                            AND apr.tanggalreservasi between '$tglAwal' and '$tglAkhir'
                            AND apr.objectruanganfk = '$kdInternalRuangan'            
                            AND apr.objectpegawaifk = $kodeDokter
                            GROUP BY apr.norec,ru.namaruangan,pg.namalengkap,apr.statuspanggil,
                                     sk.quota
                            ) AS x
                            GROUP BY x.namapoli,x.namadokter,x.koutajkn,x.koutanonjkn        
                            LIMIT 1
                        "));

        $getLisAntrean = DB::select(DB::raw("
                select 
                apr.jenis || '-' ||
                CASE WHEN length(CAST(apr.noantrian AS VARCHAR)) = 1 THEN
                '0'|| CAST(apr.noantrian AS VARCHAR) ELSE CAST(apr.noantrian AS VARCHAR) END AS noantrian 
                from antrianpasienregistrasi_t AS apr
                LEFT JOIN ruangan_m AS ru ON ru.id = apr.objectruanganfk
                LEFT JOIN pegawai_m AS pg ON pg.id = apr.objectpegawaifk
                where apr.kdprofile = 21 
                AND apr.tanggalreservasi BETWEEN '$tglAwal' and '$tglAkhir'
                AND ru.kdinternal = '$kdInternalRuangan' 
                AND pg.kddokterbpjs = $kodeDokter
                AND statuspanggil = '0'
                ORDER BY apr.tanggalreservasi DESC
                LIMIT 1
            "));
        $antrian = "";
        foreach ($getLisAntrean as $itt){
            $antrian = $itt->noantrian;
        }
        $nomorAntrian = strlen((string)$data->noantrian);
        if ($nomorAntrian == 1){
            $nomorAntrian = '0'.$data->noantrian;
        }else{
            $nomorAntrian = $data->noantrian;
        }
        $result = [];
        foreach ($getStatusAntrian AS $item){
            $estimasidilayani = 0;
            if ((int)$item->sisaantrean == 0){
                $estimasidilayani = 1800 * 1;
            }else{
                $estimasidilayani = 1800 * ((int)$item->sisaantrean - 1);
            }
            $result = array(
                "nomorantrean" => $data->jenis . '-' . $nomorAntrian,
                "namapoli" => $data->namaruangan,
                "namadokter" => $data->namalengkap,
                "sisaantrean" => $item->sisaantrean,
                "antreanpanggil" =>$antrian,
                "waktutunggu"=> $estimasidilayani,
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

    public function saveBatalAntrean (Request $request)
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

            $data = DB::table('antrianpasienregistrasi_t')
                    ->where('kdprofile', $kdProfile)
                    // ->where('statusenabled', true)
                    ->where('noreservasi', $request['kodebooking'])
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
                if($data->isconfirm == true){
                    DB::rollBack();
                    $result = array(
                        "metadata" => array(
                            "message" => "Pasien Sudah Dilayani, Antrean Tidak Dapat Dibatalkan",
                            "code" => 201
                        )
                    );
                    return $this->setStatusCode($result['metadata']['code'])->respond($result);
                }
                $data = DB::table('antrianpasienregistrasi_t')
                    ->where('kdprofile', $kdProfile)
                    ->where('statusenabled', true)
                    ->where('noreservasi', $request['kodebooking'])
                    ->update([
                        'statusenabled' => false,
                        'isbatal' => false,
                        'keteranganbatal' => $request['kodebooking'],
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

    public function saveCheckInAntrean (Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $request = $request->json()->all();
        $t =  $request['waktu'];
        // $micro = sprintf("%06d",($t - floor($t)) * 1000000);
        // $d = new \DateTime( date('Y-m-d H:i:s.'.$micro, $t) );
        // $tglRegis = $d->format('Y-m-d H:i:s');
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
            ->leftJoin('pegawai_m as pg','pg.id','=','apr.objectpegawaifk')
            ->leftJoin('ruangan_m as ru','ru.id','=','apr.objectruanganfk')
            ->selectRaw("
                    apr.*,pg.namalengkap,ru.namaruangan,ru.objectdepartemenfk
                ")
            ->where('apr.kdprofile', $kdProfile)
            ->where('apr.statusenabled', true)
            ->where('apr.noreservasi', $request['kodebooking'])
            ->first();

        if(empty($data)) {
            $result = array("metadata" => array("message" => "Maaf data Anda tidak ditemukan", "code" => 201));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }else {
            if($data->isconfirm){
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
            $pasiendaftar = array(
                    'tglregistrasi' => $tglRegis,
                    'tglregistrasidate' => $tglRegBulan,
                    'nocmfk' =>  $data->nocmfk,
                    'objectruanganfk' =>  $data->objectruanganfk,
                    'objectdepartemenfk' =>  $data->objectdepartemenfk,
                    'objectkelasfk' =>  6,//nonkelas
                    'objectkelompokpasienlastfk' =>  $data->objectkelompokpasienfk,//umum
                    'objectrekananfk' =>  null,
                    'tipelayanan' => 1,//reguler
                    'objectpegawaifk' =>  $data->objectpegawaifk,
                    'noregistrasi' =>  '',
                    'norec_pd' =>  '',
                    'israwatinap' =>  'false',
                    'statusschedule' => $data->noreservasi,
                    'objectrekananfk' => 2552,
                    'isjkn' => true
            );
            $antrianpasiendiperiksa = array(
                'norec_apd' => '',
                'tglregistrasi' => $tglRegis,
                'objectruanganfk' => $data->objectruanganfk,
                'objectkelasfk' => 6,
                'objectpegawaifk' =>$data->objectpegawaifk,
                'objectkamarfk' =>null,
                'nobed' =>null,
                'objectdepartemenfk' =>$data->objectdepartemenfk,
                'objectasalrujukanfk' => $data->objectasalrujukanfk,
                'israwatgabung' => 0,
                'objectkamarfk' => null,
            );

            if ($data->tipepasien == "BARU"){
                return redirect()->route("pasienBaru",[
                    "jenis" => "B"
                ]);
            }else{
                return redirect()->route("CheckInAntrean",[
                    'pasiendaftar' => $pasiendaftar,
                    'antrianpasiendiperiksa' => $antrianpasiendiperiksa
                ]);
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


    public function getPropinsiBpjs (){
        $data = $this->getIdConsumerBPJS();
        $secretKey = $this->getPasswordConsumerBPJS();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time()-strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data."&".$tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL=> $this->getUrlBrigdingBPJS()."referensi/propinsi",
//            CURLOPT_URL => "https://dvlp.bpjs-kesehatan.go.id/VClaim-rest/referensi/propinsi",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json; charset=utf-8",
                "X-cons-id: ".  (string)$data,
                "X-signature: ". (string)$encodedSignature,
                "X-timestamp: ". (string)$tStamp
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result= "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        $res = $result['response']->list;
        return $res;
    }

    public function getKabupatenBpjs ($kodePropinsi){
        $data = $this->getIdConsumerBPJS();
        $secretKey = $this->getPasswordConsumerBPJS();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time()-strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data."&".$tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL=> $this->getUrlBrigdingBPJS()."referensi/kabupaten/propinsi/".$kodePropinsi,
//            CURLOPT_URL => "https://dvlp.bpjs-kesehatan.go.id/VClaim-rest/referensi/kabupaten/propinsi/".$request['kodePropinsi'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json; charset=utf-8",
                "X-cons-id: ".  (string)$data,
                "X-signature: ". (string)$encodedSignature,
                "X-timestamp: ". (string)$tStamp
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result= "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        $res=$result['response']->list;
        return $res;
    }

    public function savePasienBaru (Request $request)
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

                return redirect()->route("savePasienBaruJkn",[
                    'isbayi' => false,
                    'istriageigd' => false,
                    'isPenunjang' => false,
                    'idpasien' => '',
                    'pasien' => $pasien,
                    'agama' =>['id' => null],
                    'jenisKelamin'=> $jk->id,
                    'pekerjaan' => [ 'id' => null],
                    'pendidikan' =>  [ 'id' => null],
                    'statusPerkawinan' => null,
                    'golonganDarah' => null,
                    'suku' => null,
                    'namaIbu' => null,
                    'noTelepon' => $request['nohp'],
                    'noAditional' => null,
                    'kebangsaan' => null,
                    'negara' => ['id' => 0],
                    'namaAyah' => null,
                    'alamatLengkap' => $request['alamat'],
                    'desaKelurahan' => null,
                    'namaDesaKelurahan' => $request['namakel'],
                    'kecamatan' => null,
                    'namaKecamatan' => $request['namakec'],
                    'kotaKabupaten' => null,
                    'namaKotaKabupaten' => $request['namadati2'],
                    'propinsi' => $propinsi->id,
                    'namapropinsi' => $request['namaprop'],
                    'kodePos' => null,
                    'penanggungjawab' => null,
                    'hubungankeluargapj' => null,
                    'pekerjaanpenangggungjawab' => null,
                    'ktppenanggungjawab' => null,
                    'alamatrmh' => null,
                    'alamatktr' => null,
                    'teleponpenanggungjawab' => null,
                    'bahasa' => null,
                    'jeniskelaminpenanggungjawab' => null,
                    'umurpenanggungjawab' => null,
                    'dokterpengirim' => null,
                    'alamatdokter' => null,
                    'rtrw' => $request['rt'] . '/' . $request['rw'],
                    'isjkn' => true,
                ]);
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
     public function getDaftarStatusVA(Request $request){
        $kdProfile = (int)$this->getDataKdProfile($request);
        $dataLogin=$request->all();
        $data = \DB::table('virtualaccount_t as vr')
            ->leftjoin('strukbuktipenerimaan_t as sbm', 'sbm.norec', '=', 'vr.norec_sbm')
            ->join('strukpelayanan_t as sp', 'vr.norec_sp', '=', 'sp.norec')
            ->leftjoin('pasiendaftar_t as pd', 'vr.norec_pd', '=', 'pd.norec')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            // ->leftjoin('loginuser_s as lu', 'lu.id', '=', 'vr.pegawaifk')
            ->leftjoin('pegawai_m as p', 'p.id', '=', 'vr.objectpegawaifk')
            ->leftjoin('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->select(
                   \DB::raw("vr.*,pd.noregistrasi,pd.tglregistrasi,ps.nocm,ps.namapasien,p.namalengkap as kasir,ru.namaruangan,sbm.nosbm,sp.nostruk")
            )
            ->where('vr.statusenabled',true)
            ->where('vr.kdprofile', $kdProfile)
            ->whereNotnull('vr.norec_pd');

        $filter = $request->all();
        if(isset($filter['dari']) && $filter['dari'] != "" && $filter['dari'] != "undefined") {
            $tgl2 = $filter['dari'] ;//. " 00:00:00";
            $data = $data->where('vr.datetime_created', '>=', $tgl2);
        }
        if(isset($filter['sampai']) && $filter['sampai'] != "" && $filter['sampai'] != "undefined") {
            $tgl = $filter['sampai'] ;//. " 23:59:59";
            $data = $data->where('vr.datetime_created', '<=', $tgl);
        }
        if(isset($filter['idPegawai']) && $filter['idPegawai'] != "" && $filter['idPegawai'] != "undefined") {
            $data = $data->where('p.id', '=', $filter['idPegawai']);
        }
        if(isset($filter['idCaraBayar']) && $filter['idCaraBayar'] != "" && $filter['idCaraBayar'] != "undefined") {
            $data = $data->where('cb.id', '=', $filter['idCaraBayar']);
        }
        if(isset($filter['idKelTransaksi']) && $filter['idKelTransaksi'] != "" && $filter['idKelTransaksi'] != "undefined") {
            $data = $data->where('kt.id', $filter['idKelTransaksi']);
        }
        if(isset($filter['ins']) && $filter['ins'] != "" && $filter['ins'] != "undefined") {
            $data = $data->where('ru.objectdepartemenfk', $filter['ins']);
        }
        if(isset($filter['nosbm']) && $filter['nosbm'] != "" && $filter['nosbm'] != "undefined") {
            $data = $data->where('sbm.nosbm','ilike','%'.$filter['nosbm'].'%');
        }
        if(isset($filter['nocm']) && $filter['nocm'] != "" && $filter['nocm'] != "undefined") {
            $data = $data->where('ps.nocm','ilike','%'.$filter['nocm'].'%');
        }
        if(isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $data = $data->where('ps.namapasien','ilike','%'.$filter['nama'].'%');
        }
         if(isset($filter['nostruk']) && $filter['nostruk'] != "" && $filter['nostruk'] != "undefined") {
            $data = $data->where('sp.nostruk','ilike','%'.$filter['nostruk'].'%');
        }
        if(isset($filter['status']) && $filter['status'] != "" && $filter['status'] != "undefined") {
            $data = $data->where('vr.va_status','ilike','%'.$filter['status'].'%');
        }
        if(isset($filter['statusB']) && $filter['statusB'] != "" && $filter['statusB'] != "undefined") {
            if($filter['statusB'] == 'Y'){
                 $data = $data->whereNotNull('vr.datetime_payment');
            }
            else if($filter['statusB'] == 'N'){
                 $data = $data->whereNull('vr.datetime_payment');
            }
            else if($filter['statusB'] == 'E'){
                 $data = $data->whereNull('vr.datetime_payment');
                 $tgl= date('Y-m-d H:i:s') ;
                 $data = $data->whereRaw("'$tgl' > vr.datetime_expired");
            }
        }
        if(isset($filter['email']) && $filter['email'] != "" && $filter['email'] != "undefined") {
            $data = $data->where('vr.customer_email','=',$filter['email']);
        }
      

        if(isset($request['KasirArr']) && $request['KasirArr']!="" && $request['KasirArr']!="undefined"){
            $arrRuang = explode(',',$request['KasirArr']) ;
            $kodeRuang = [];
            foreach ( $arrRuang as $item){
                $kodeRuang[] = (int) $item;
            }
            $data = $data->whereIn('p.id',$kodeRuang);
        }
         $data = $data->orderBy('vr.datetime_created','desc');
        $data = $data->get();
        foreach($data as $d){
            if($d->datetime_payment !=null){
                $d->status = 'Sudah dibayar';
            } 
            else if($d->datetime_payment ==null){
                if((date('Y-m-d H:i:s') > date( $d->datetime_expired) ) ){
                    $d->status = 'Kadaluarsa';
                }else{
                    $d->status = 'Belum Dibayar';
                }
                
            }
        }
        return $this->respond($data);
    }
    public function getSlottingByRuanganNew2(Request $r)
    {
        $kdProfile = $this->getDataKdProfile($r);
        $dataReservasi = \DB::table('antrianpasienregistrasi_t as apr')
            ->select('apr.norec','apr.tanggalreservasi')
            ->whereRaw("to_char(apr.tanggalreservasi,'yyyy-MM-dd') = '$r[tgl]'")
            ->where('apr.objectruanganfk', $r['ruanganfk'])
            ->where('apr.noreservasi','!=','-')
            ->where('apr.kdprofile',$kdProfile)
            ->whereNotNull('apr.noreservasi')
            ->where('apr.statusenabled',true)
            ->get();

        $ruangan = \DB::table('ruangan_m as ru')
            ->join('slottingonline_m as slot', 'slot.objectruanganfk', '=', 'ru.id')
            ->select('ru.id', 'ru.namaruangan', 'ru.objectdepartemenfk', 'slot.jambuka', 'slot.jamtutup',
                'slot.quota',
                // DB::raw("DATEDIFF(second,    [slot].[jambuka],   [slot].[jamtutup]) / 3600.0 AS totaljam "))
               DB::raw("(EXTRACT(EPOCH FROM slot.jamtutup) - EXTRACT(EPOCH FROM slot.jambuka))/3600 as totaljam"))
            ->where('ru.statusenabled', true)
            ->where('ru.id', $r['ruanganfk'])
            ->where('slot.kdprofile',$kdProfile)
            ->where('slot.statusenabled', true)
            ->first();
       if (empty($ruangan)) {
            $result = array(
                "slot" => [],
                "message" => "Jadwal Reservasi Penuh",
                'as' => 'er@epic',
            );
            return $result;
        }

        $begin = new Carbon($ruangan->jambuka);
        $jamBuka = $begin->format('H:i');
        $end = new Carbon($ruangan->jamtutup);
        $jamTutup = $end->format('H:i');
        $quota = (float)$ruangan->quota;
        $waktuPerorang = ((float)$ruangan->totaljam / (float)$ruangan->quota) * 60;
//dd($waktuPerorang);
        $i = 0;
        $slotterisi = 0;
        $jamakhir = '00:00';
        $reservasi = [];
        foreach ($dataReservasi as $items) {
            $jamUse = new Carbon($items->tanggalreservasi);
            $slotterisi += 1;
            $reservasi [] = array(
                'jamreservasi' => $jamUse->format('H:i')
            );
            $jamakhir = $jamUse->format('H:i');
        }

        $intervals = [];
        $intervalsAwal = [];
        $begin = new \DateTime($jamBuka);
        $end = new \DateTime($jamTutup);
        $interval = \DateInterval::createFromDateString(floor($waktuPerorang) . ' minutes');
        $period = new \DatePeriod($begin, $interval, $end);
        foreach ($period as $dt) {
            $intervals[] = array(
                'jam' => $dt->format("H:i")
            );
            $intervalsAwal[] = array(
                'jam' => $dt->format("H:i")
            );
        }

        if (count($intervals) == 0) {
            $result = array(
                "slot" => null,
                "code" => "400",
                "message" => "Jadwal Reservasi Penuh"
            );
            return $result;
        }
        if (count($reservasi) > 0) {
            for ($j = count($reservasi) - 1; $j >= 0; $j--) {
                for ($k = count($intervals) - 1; $k >= 0; $k--) {
                    if ($intervals[$k]['jam'] == $reservasi[$j]['jamreservasi']) {
                        array_splice($intervals, $k, 1);
                    }
                }
            }
        }

        if (count($intervals) > 0) {
            $result = array(
                "slot" => $intervals,
                "code" => "200",
                "message" => count($intervals) . " Slot/Jadwal Tersedia"
            );
        } else {
            $result = array(
                "slot" => null,
                "code" => "400",
                "message" => "Jadwal Reservasi Penuh"
            );
        }
        return $this->respond($result);
    }
    public function saveAntrolV2( $request){
        try{
            $ruangan = DB::table('ruangan_m')->where('id',$request['objectruanganfk'])->first()->kdinternal;
            if($ruangan== null || $ruangan== ''){
                $result = array("metadata"=>array("message" => "Kode Poli tidak valid", "code" => 201));
                return $result;
            }
            $objetoRequest = new \Illuminate\Http\Request();
            $objetoRequest ['url']= "jadwaldokter/kodepoli/". $ruangan."/tanggal/". date('Y-m-d',strtotime($request->tanggalreservasi));
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
                return $result;
            }else{
                $ada = false;
                if(count($cek['response']) > 0){
                    $dokter['jadwal'] = $cek['response'][0]->jadwal;
                    $dokter['namadokter'] = $cek['response'][0]->namadokter;
                    $dokter['kodedokter'] = $cek['response'][0]->kodedokter;
                    $ada = true;
                    // foreach($cek['response'] as $item){
                    //     if($request['kodedokter'] == $item->kodedokter){
                    //         $ada = true;
                    //         break;
                    //     }
                    // }
                }
                if($ada == false){
                    $result = array("metadata"=>array("message" => "Jadwal Dokter  Tersebut Belum Tersedia, Silahkan Reschedule Tanggal dan Jam Praktek Lainnya", "code" => 201));
                    return $result;
                }
            }
        
          
            $norm = '';
            if($request->tipepasien == 'LAMA' ){
                $norm = \DB::table('pasien_m')->where('id',$request->nocmfk)->first()->nocm;
            }
            $estimasidilayani = strtotime($request->tanggalreservasi) * 1000;
            $nomor = str_pad($request->noantrian, 3, '0', STR_PAD_LEFT);
            $json = array(
                "kodebooking" => $request->noreservasi,
                "jenispasien" => $request->objectkelompokpasienfk == '2' ? "JKN": "NON JKN",
                "nomorkartu" =>isset($request->nobpjs)? $request->nobpjs:'',
                "nik" => $request->noidentitas?$request->noidentitas:"",
                "nohp" => $request->notelepon?$request->notelepon:"",
                "kodepoli" => $ruangan,
                "namapoli" => $request->namaruangan,
                "pasienbaru" => $request->tipepasien == 'LAMA' ? 0:1,
                "norm" => $norm,
                "tanggalperiksa" => date('Y-m-d',strtotime($request->tanggalreservasi)),
                "kodedokter" => $dokter['kodedokter'],
                "namadokter" => $dokter['namadokter'],
                "jampraktek" => $dokter['jadwal'],
                "jeniskunjungan" => 1,
                "nomorreferensi" =>  $request->objectkelompokpasienfk == '2' ? ($request->norujukan?$request->norujukan:""):"",
                "nomorantrean" => $request->jenis . '-' . $nomor,
                "angkaantrean" => 0,
                "estimasidilayani" => $estimasidilayani,
                "sisakuotajkn" => 0,
                "kuotajkn" => 0,
                "sisakuotanonjkn" => 0,
                "kuotanonjkn" => 0,
                "keterangan" => 'Peserta harap 30 menit lebih awal guna pencatatan administrasi.'
            );
          
      
            $objetoRequest = new \Illuminate\Http\Request();
            $objetoRequest ['url']= "antrean/add";
            $objetoRequest ['jenis']= "antrean";
            $objetoRequest ['method']= "POST";
            $objetoRequest ['data']= $json;
  

            $post = app('App\Http\Controllers\Bridging\BridgingBPJSV2Controller')->bpjsTools($objetoRequest);
            if(is_array($post)){
                $code = $post['metaData']->code;
                $message = $post['metaData']->message;
            }else{
                $cek = json_decode($post->content(), true);
                $code = $cek['metaData']['code'];
                $message = $cek['metaData']['message'];
            }

            if($code != '200'){
                $result = array("metadata"=>array("message" => "Add antrol gagal : ".$message, "code" => 201));
                return $result;
            }else{
                $result = array("metadata"=>array("message" =>$message, "code" => 200));
                return $result;
            }
        
        } catch (\Exception $e) {
            $result = array("metadata"=>array("message" =>$e->getMessage().' ' .$e->getLine(), "code" => 201));
            return $result;
        }

    }
    function isJson($string)
    {
        json_decode($string);
        return json_last_error() === JSON_ERROR_NONE;
    }
    public function getComboReserv(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $deptJalan = explode (',',$this->settingDataFixed('kdDepartemenRawatJalanFix',   $kdProfile ));
        $kdDepartemenRawatJalan = [];
        foreach ($deptJalan as $item){
            $kdDepartemenRawatJalan []=  (int)$item;
        }

        $dataRuanganJalan = \DB::table('ruangan_m as ru')
            ->select('ru.id','ru.namaruangan')
            ->where('ru.statusenabled', true)
            ->where('ru.kdprofile', $kdProfile)
            ->wherein('ru.objectdepartemenfk', $kdDepartemenRawatJalan)
            ->orderBy('ru.namaruangan')
            ->get();
       
        $kdJenisPegawaiDokter = $this->settingDataFixed('kdJenisPegawaiDokter',   $kdProfile );

        $dkoter = \DB::table('pegawai_m')
            ->select('*')
            ->where('statusenabled', true)
              ->where('kdprofile', $kdProfile)
            // ->where('objectjenispegawaifk',$kdJenisPegawaiDokter)
            ->whereNull('usereksternal')
            ->orderBy('namalengkap')
            ->get();
        $dataHari = \DB::table('hari_m as hr')
              ->where('hr.kdprofile', $kdProfile)
              ->where('hr.statusenabled', true)
              ->orderBy('hr.id')
              ->get();
        $result = array(
            'ruanganrajal' => $dataRuanganJalan,
            'dokter' => $dkoter,
            'hari' => $dataHari,
            'message' => 'er@epic',
        );

        return $this->respond($result);
    }
    public function getSlottingByRuanganDokter(Request $request)
	{
      
        try{
            $kdProfile = $this->getDataKdProfile($request);
            $dataReservasi = \DB::table('antrianpasienregistrasi_t as apr')
                ->select('apr.norec','apr.tanggalreservasi','apr.objectpegawaifk')
                ->whereRaw(" to_char(apr.tanggalreservasi,'yyyy-MM-dd') = '$request[tgl]'")
                ->where('apr.objectruanganfk', $request['id_ruangan'])
                ->where('apr.objectpegawaifk', $request['id_dokter'])
                ->where('apr.noreservasi','!=','-')
                ->where('apr.kdprofile',$kdProfile)
                ->whereNotNull('apr.noreservasi')
                ->where('apr.statusenabled',true)
                ->get();
    
            $ruangan = \DB::table('slottingonline_m as slot')
                ->join('ruangan_m as ru', 'slot.objectruanganfk', '=', 'ru.id')
                ->join('pegawai_m as pg', 'slot.objectpegawaifk', '=', 'pg.id')
                ->select('ru.id as idruangan','slot.id', 'ru.namaruangan', 'ru.objectdepartemenfk', 'slot.jambuka', 'slot.jamtutup',
                    'slot.quota','pg.namalengkap','slot.objectpegawaifk','slot.hari',
                    DB::raw("extract(hour from slot.jamtutup) -extract(hour from slot.jambuka)as totaljam"))
                // DB::raw("datepart(hour,slot.jamtutup) -datepart(hour, slot.jambuka)as totaljam"))
                ->where('pg.statusenabled', true)
                ->where('ru.statusenabled', true)
                ->where('ru.id', $request['id_ruangan'])
                ->where('slot.objectpegawaifk', $request['id_dokter'])
                ->where('slot.statusenabled', true)
                ->get();
    
            if(count($ruangan) == 0){
                $result = array(
                    'message'=> 'Slot tidak ada/belum dijadwalkan',
                    'code'=> 201,
                );
                return $this->respond($result);
             }   

             $data10 =[];
             $hari = $this->hari_ini($request['tgl']);
             for ($i = count($ruangan) - 1; $i >= 0; $i--) {
                 $now = explode(', ',$ruangan[$i]->hari);
                 for ($i2 = count($now) - 1; $i2 >= 0; $i2--) {
                     if(strtoupper($now[$i2]) == strtoupper($hari)){
                           $jamawal =   date('H:i',strtotime($ruangan[$i]->jambuka)) ; 
                           $jamakhir =   date('H:i',strtotime($ruangan[$i]->jamtutup)) ; 
                           $data10 [] = array(
                               'id'=> $ruangan[$i]-> objectpegawaifk,
                               'namalengkap'=> $ruangan[$i]-> namalengkap,
                               'jadwal'=>  strtoupper($hari),
                               'jam'=> $jamawal . ' - '.$jamakhir,
                               'jamawal'=> $request['tgl'] . ' '.$jamawal,
                               'jamakhir'=> $request['tgl'] . ' '.$jamakhir,
                               'quota'=> $ruangan[$i]->quota,
                               'sisaquota'=> $ruangan[$i]->quota,
                           );
                     }
                 }
             }
     
             $reservasi = [];
         
             foreach ($dataReservasi as $items){
                 $jamUse =  new Carbon($items->tanggalreservasi);
                 $reservasi [] = array(
                     'jamreservasi' => $jamUse->format('Y-m-d H:i')
                 );
             }
    
             if (count($reservasi) > 0) {
                for ( $j = count($reservasi) - 1; $j >= 0; $j--) {
                    for ( $k =count($data10)- 1; $k >= 0; $k--) {
                        if ($reservasi[$j]['jamreservasi'] >= $data10[$k]['jamawal'] 
                                 && $reservasi[$j]['jamreservasi']  < $data10[$k]['jamakhir'] ) {
                            $data10[$k]['sisaquota'] =$data10[$k]['sisaquota']  -1;
                            // array_splice($intervals,$k,1);
                        }
                    }
                }
            }
   //          $d['a']= $data10;
   //            $d['b']= $reservasi;
   // dd($d);
            for ( $k =count($data10)- 1; $k >= 0; $k--) {
                if ($data10[$k]['sisaquota']  <=0 ){
                      array_splice($data10,$k,1);
                }
            }
        
            //  $slot  = array(
            //      'id_ruangan' => $data10->id,
            //      'namaruangan' => $data10->namaruangan,
            //      'id_dokter' => $data10->objectpegawaifk,
            //      'namalengkap' => $data10->namalengkap,
            //      'hari' => $hari,
            //      'tgl' =>  $request['tgl'],
            //      'jambuka' => $jamBuka,
            //      'jamtutup' => $jamTutup,
            //      'totaljam' => $data10->totaljam,
            //      'quota' => (float)$quota,
            //      'interval' => $waktuPerorang,
              
            //  );
            $result = array(
                'message'=>'success',
                'status'=> 200,
                'slot' => $ruangan,
                'listjam'=> $data10,
                'count_reservasi' => count($reservasi),
                'reservasi' => $reservasi,
            );
   
        } catch (\Exception $e) {
            $result = array(
                'message' => 'Error',
                'status'=> 201,
            );
        }
        
		return $this->respond($result);
	}
    public function getDokterByRuang(Request $request)
	{
        $kdProfile = $this->getDataKdProfile($request);
        if($this->settingDataFixed('cutiDenganSlotting',$kdProfile) == true){
            if(!isset($request['id_ruangan']) || $request['id_ruangan']==''){
            $result = array(
                'message' => 'id_ruangan harus di isi',
                'status'=> 201,
            );
            return $this->respond($result);
        }
        if(!isset($request['tgl']) || $request['tgl']==''){
            $result = array(
                'message' => 'tgl harus di isi',
                'status'=> 201,
            );
            return $this->respond($result);
        }
        $dokter = \DB::table('slottingonline_m as slot')
        ->join('ruangan_m as ru', 'slot.objectruanganfk', '=', 'ru.id')
        ->join('pegawai_m as pg', 'slot.objectpegawaifk', '=', 'pg.id')
        ->distinct()
        ->select('ru.namaruangan', 'slot.quota','pg.namalengkap as dokter','slot.objectpegawaifk','slot.hari','pg.id as idok')
        ->where('pg.statusenabled', true)
        ->where('ru.statusenabled', true)
        ->where('ru.id', $request['id_ruangan'])
        ->whereRaw("(not('$request[tgl]'::date BETWEEN slot.tanggalcutiawal::date AND slot.tanggalcutiakhir::date)
        or (slot.tanggalcutiawal is null and slot.tanggalcutiakhir is null))")
        ->where('slot.statusenabled', true)
        ->get();
        $hari = $this->hari_ini($request['tgl']);
        $data10 =[];

        for ($i = count($dokter) - 1; $i >= 0; $i--) {
            $now = explode(', ',$dokter[$i]->hari);
            for ($i2 = count($now) - 1; $i2 >= 0; $i2--) {
                if(strtoupper($now[$i2]) == strtoupper($hari)){
                      $data10 [] = array(
                          'id'=> $dokter[$i]-> idok,
                          'namalengkap'=> $dokter[$i]-> dokter,
                          'jadwal'=>  strtoupper($hari),
                      );
                }
            }
        }
        $data11 =[];
        foreach ($data10 as $item) {
            $sama = false;
            $i = 0;
            foreach ($data11 as $hideung) {
                if ($item['id'] == $data11[$i]['id']) {
                    $sama = true;
                }
                $i = $i + 1;
            }
            if ($sama == false) {
                $data11[] = $item;
            }
        }
        if(count($data11) == 0){
            $result = array(
                'message' => 'Jadwal Dokter tidak tersedia',
                'status'=> 201,
                'list' => $data11,
            );
            return $this->respond($result);
        }
        $result = array(
            'message' => 'success',
            'status'=> 200,
            'list' => $data11,
        );
        return $this->respond($result);
        }
        
    }
    public function GetJamKosongRes($kode,$dokter,$tgl,$jam,$dataReservasi,$kdProfile){

        $begin = new Carbon( $jam['jamawal']);
        $jamBuka = $begin->format('H:i');
        $end = new Carbon($jam['jamakhir']);
        $jamTutup = $end->format('H:i');
        $quota =(float)$jam['quota'];
     
        $timestamp1 = strtotime($jam['jamawal']);
        $timestamp2 = strtotime($jam['jamakhir']);
        $hour = abs($timestamp1 - $timestamp2)/(60*60) . " hour(s)";
   
        $waktuPerorang = ((float)$hour/$quota) * 60;
   
        $i =0;
        $slotterisi = 0;
        $reservasi = [];
        foreach ($dataReservasi as $items){
            $jamUse =  new Carbon($items->tanggalreservasi);
            $slotterisi += 1;
            $reservasi [] = array(
                'jamreservasi' => $jamUse->format('H:i')
            );
          
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
//                        this.listJam.splice([i], 1);
                        array_splice($intervals,$k,1);
                    }
                }
            }
        }
 
        // OLD: slot-based - nomor antrian berdasarkan posisi slot jam di jadwal harian
        // if(count($intervals) > 0){
        //     $antrian = 0;
        //     for ($x = 0; $x <= count($intervalsAwal); $x++) {
        //         if($intervals[0]['jam']== $intervalsAwal[$x]['jam']){
        //             $antrian = $x;
        //             break;
        //         }
        //     }
        //     return array("antrian"=> $antrian+1,"jamkosong"=>$intervals[0]['jam']);
        // }else{
        //     return array("antrian"=> 0,"jamkosong"=>"00:00");
        // }

        // NEW: sequential - nomor antrian berdasarkan max(noantrian) + 1 per ruangan per tanggal
        $jamKosong = count($intervals) > 0 ? $intervals[0]['jam'] : "00:00";
        if ($jamKosong == "00:00") {
            return array("antrian" => 0, "jamkosong" => "00:00");
        }
        $maxAntrian = \DB::table('antrianpasienregistrasi_t')
            ->where('objectruanganfk', $kode)
            ->whereRaw("to_char(tanggalreservasi,'yyyy-MM-dd') = '$tgl'")
            ->where('noreservasi', '!=', '-')
            ->whereNotNull('noreservasi')
            ->where('statusenabled', true)
            ->where('kdprofile', $kdProfile)
            ->max('noantrian');
        $antrianBaru = ($maxAntrian ?? 0) + 1;
        return array("antrian" => $antrianBaru, "jamkosong" => $jamKosong);

    }

    public function cekINReservasi(Request $request)
    {        
        $kdProfile = $this->getDataKdProfile($request);

        $data = \DB::table('antrianpasienregistrasi_t as apr')
            ->leftJoin('pasien_m as pm','pm.id','=','apr.nocmfk')
            ->leftJoin('alamat_m as alm','alm.nocmfk','=','pm.id')
            ->leftJoin('jeniskelamin_m as jk','jk.id','=','pm.objectjeniskelaminfk')
            ->leftJoin('jeniskelamin_m as jks','jks.id','=','apr.objectjeniskelaminfk')
            ->leftJoin('pekerjaan_m as pk','pk.id','=','pm.objectpekerjaanfk')
            ->leftJoin('pendidikan_m as pdd','pdd.id','=','pm.objectpendidikanfk')
            ->leftJoin('ruangan_m as ru','ru.id','=','apr.objectruanganfk')
            ->leftJoin('pegawai_m as pg','pg.id','=','apr.objectpegawaifk')
            ->leftJoin('kelompokpasien_m as kps','kps.id','=','apr.objectkelompokpasienfk')
            ->leftJoin('pasiendaftar_t as pd', 'pd.statusschedule', '=', 'apr.noreservasi')
            ->leftJoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->select('apr.norec','pm.nocm','apr.noreservasi','apr.tanggalreservasi','apr.objectruanganfk',
                'apr.objectpegawaifk','ru.namaruangan','apr.isconfirm','pg.namalengkap as dokter','pm.id as nocmfk',
               'pm.namapasien','apr.namapasien','alm.alamatlengkap','pk.pekerjaan','pm.noasuransilain','pm.noidentitas',
                'apr.nobpjs','pm.nohp','pdd.pendidikan','apr.type','kps.kelompokpasien','apr.objectkelompokpasienfk','ru.objectdepartemenfk',
                'ru.prefixnoantrian', 'apr.norujukan','apr.tanggal','apr.jamreservasi',
                DB::raw('(case when pm.namapasien is null then apr.namapasien else pm.namapasien end) as namapasien, 
                (case when apr.isconfirm=true then \'Confirm\' else \'Reservasi\' end) as status,case when pm.tempatlahir is null then apr.tempatlahir else pm.tempatlahir end as tempatlahir,
                case when jk.jeniskelamin is null then jks.jeniskelamin else jk.jeniskelamin end as jeniskelamin,
                case when apr.tgllahir is null then pm.tgllahir else apr.tgllahir end as tgllahir,
                apr.tanggal,apr.jamreservasi,pd.norec as norec_pd,apd.norec as norec_apd,
                case when apr.tipepasien = \'LAMA\' then pm.nohp else  apr.notelepon end as notelepon' )
            )
            // ->whereNull('apr.isconfirm')
            ->where('apr.noreservasi','!=','-')
            ->whereNotNull('apr.noreservasi')
            ->where('apr.kdprofile',  $kdProfile )
            // ->whereRaw("(apr.isconfirm = false or apr.isconfirm is null) " )
            ->whereRaw("(pd.ischeckin = false or pd.ischeckin is null) " )
            ->where('apr.statusenabled',true);


        if(isset($request['noReservasi']) && $request['noReservasi'] != "" && $request['noReservasi'] != "undefined" && $request['noReservasi'] != "null") {
            $data =
                 $data->where('apr.noreservasi', $request['noReservasi']);
            
        }
   
        $data = $data->first();
        if(empty($data)){
            $result = array(
                'data' => null,
                'message' => 'Anda Sudah Checkin',
                'as' => 'er@epic',
            );
            return $this->respond($result);
        }
        $tambah = (float)$this->settingDataFixed('batasCheckinKioskDalamMenit',$kdProfile);
        // dd($tambah);
        $now = date('Y-m-d');
        $jamCheck = date('H:i');
        $dd['tglcheckin'] = $now;
        $dd['tglreservasi'] = $data->tanggal;
        if($data->jamreservasi!=null){
        $jam = explode(' - ',$data->jamreservasi);
    
        if($data->tanggal != $now){
            $jamna = $data->jamreservasi;
            if(count($jam)> 0){
                $jamAwals = $jam[0];
                $jamAwals = date('H:i', strtotime('-'.$tambah.' minutes',strtotime($jamAwals)));
                $jamAkhirs = $jam[1];
                $jamna = $jamAwals.' - '.$jamAkhirs;
            }
         
            $result = array(
                'data' => null,
                'message' => 'Harap check-in sesuai jadwal reservasi, Tgl ' .$data->tanggal .' Jam '.$jamna,
                'as' => 'er@epic',
            );
            return $this->respond($result);
        }
     
        if(count($jam)> 0){
            
            // $jamAwal = $jam[0];
            // $jamAwal = date('H:i', strtotime('-'.$tambah.' minutes',strtotime($jamAwal)));

            $jamAkhir = $jam[1];
            // $dd['jamawal'] = $jamAwal;
            $dd['jamakhir'] = $jamAkhir;
            $dd['jamcheckin'] = $jamCheck;
            
            if( $jamCheck <= $jamAkhir){ 
            } else {
                $result = array(
                    'data' => null,
                    'message' => 'Harap check-in sebelum jam akhir pendaftaran pelayanan, '.$data->jamreservasi,
                    'dd'=> $dd,
                    'as' => 'er@epic',
                );
                return $this->respond($result);
            }
        }
    }else{}
        $result = array(
            'data' => $data,
            'message' => 'suskes',
            'as' => 'er@epic',
        );
        return $this->respond($result);
    }
    public function deleteSlotting2(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
           DB::beginTransaction();
           try {
                   $newptp = SlottingOnline::where('id',$request['id'])->delete();
               $transMessage = "Sukses";
               $transStatus = 'true';
           } catch (\Exception $e) {
               $transStatus = 'false';
               $transMessage = "Delete Slotting Gagal";
           }
   
           if ($transStatus != 'false') {
               DB::commit();
               $result = array(
                   "data" =>$newptp,
                   "status" => 201,
                   "message" => $transMessage,
               );
           } else {
               DB::rollBack();
               $result = array(
   //              "noRec" =>$noRec,
                   "status" => 400,
                   "message" => $transMessage,
               );
           }
   
           return $this->setStatusCode($result['status'])->respond($result, $transMessage);
       }
        public function getDaftarJadwalDokter(Request $request)
        {
            $kdProfile = $this->getDataKdProfile($request);
            $jddokter = \DB::table('slottingonline_m as son')
            ->join('ruangan_m as ru','ru.id','=','son.objectruanganfk')
            ->join('pegawai_m as pg', 'pg.id', '=', 'son.objectpegawaifk')
            ->where('son.statusenabled', true)
            ->where('son.kdprofile', $kdProfile)
            ->select('pg.namalengkap', 'ru.namaruangan', 'son.jambuka', 'son.jamtutup','son.hari', 'son.quota')
            ->get();
            
            $result = array(
                'jddokter'=> $jddokter,
                'as'=> 'Fizi@Epic'
            );
            return $this->respond($result);
        }
        public function getDaftarInfoTT(Request $request)
        {
            $kdProfile = $this->getDataKdProfile($request);
            $data= \DB::select(DB::raw("SELECT 
            DENSE_RANK ( ) OVER ( order by x.namaruangan ) AS nourut, 'tidak' as tab, x.namaruangan, 
            case 
            when sum(x.kosong)is null then x.isi
            when x.isi is null then sum(x.kosong+0)
            else sum(x.kosong)+ x.isi end as qty,
            case 
            when sum(x.kosong)is null then 0
            else sum(x.kosong)end as kosong, 
            case when  x.isi is null then 0
            else  x.isi end as isi FROM (
            SELECT
                ru.id AS idruangan,
                ru.namaruangan,
                                    kl.id,
                a.isi,
            CASE 
                WHEN sb.id = 2 THEN
                    count(sb.id)
            END as kosong

            FROM
                tempattidur_m AS tt
                LEFT JOIN kamar_m AS km ON km.id = tt.objectkamarfk
                LEFT JOIN ruangan_m AS ru ON ru.id = km.objectruanganfk
                LEFT JOIN statusbed_m AS sb ON sb.id = tt.objectstatusbedfk
                LEFT JOIN kelas_m AS kl ON kl.id = km.objectkelasfk 
                                    inner join(
                                            select count(pd.noregistrasi) isi, ru.namaruangan, ru.id
                                            FROM
                                                            pasiendaftar_t AS pd
                                                        INNER JOIN antrianpasiendiperiksa_t AS apd ON pd.norec = apd.noregistrasifk and apd.tglkeluar is null
                                                        INNER JOIN pasien_m AS p ON p.id = pd.nocmfk
                                                        INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
                                                        INNER JOIN kelas_m AS kls ON kls.id = pd.objectkelasfk
                                                        left JOIN kamar_m as kmr on kmr.id =apd.objectkamarfk
                                                        left JOIN tempattidur_m as tt on tt.id =apd.nobed
                                                        where pd.kdprofile = 30 and pd.statusenabled = true
                                                        and pd.tglpulang is null
                                                        and pd.kdprofile = 30	
                                                        and pd.statusenabled=true
                                            group by ru.namaruangan, ru.id
                                    ) as a on a.id = ru.id
            WHERE
                tt.kdprofile = 30 
                AND ru.objectdepartemenfk IN ( 16 ) 
                AND ru.statusenabled = true
                AND km.statusenabled = true 
                AND tt.statusenabled = TRUE
                GROUP BY ru.id,sb.id, kl.id, a.isi
                )as x
                group by x.namaruangan, x.isi

union all

SELECT 
            DENSE_RANK ( ) OVER ( order by x.namaruangan ) AS nourut, 'iya' as tab, '       ' || x.namakamar namaruangan, 
            case 
            when sum(x.kosong)is null then x.isi
            when x.isi is null then sum(x.kosong+0)
            else sum(x.kosong)+ x.isi end as qty,
            case 
            when sum(x.kosong)is null then 0
            else sum(x.kosong)end as kosong, 
            case when x.isi is null then 0
            else x.isi end as isi FROM (
            SELECT
                km.id AS idruangan,
                km.namakamar,
                                    ru.namaruangan,
                a.isi,
            CASE 
                WHEN sb.id = 2 THEN
                    count(sb.id)
            END as kosong

            FROM
                tempattidur_m AS tt
                LEFT JOIN kamar_m AS km ON km.id = tt.objectkamarfk
                LEFT JOIN ruangan_m AS ru ON ru.id = km.objectruanganfk
                LEFT JOIN statusbed_m AS sb ON sb.id = tt.objectstatusbedfk
                LEFT JOIN kelas_m AS kl ON kl.id = km.objectkelasfk 
                                    inner join(
                                            select count(pd.noregistrasi) isi, kmr.namakamar, kmr.id
                                            FROM
                                                            pasiendaftar_t AS pd
                                                        INNER JOIN antrianpasiendiperiksa_t AS apd ON pd.norec = apd.noregistrasifk and apd.tglkeluar is null
                                                        INNER JOIN pasien_m AS p ON p.id = pd.nocmfk
                                                        INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
                                                        INNER JOIN kelas_m AS kls ON kls.id = pd.objectkelasfk
                                                        left JOIN kamar_m as kmr on kmr.id =apd.objectkamarfk
                                                        left JOIN tempattidur_m as tt on tt.id =apd.nobed
                                                        where pd.kdprofile = 30 and pd.statusenabled = true
                                                        and pd.tglpulang is null
                                                        and pd.kdprofile = 30	
                                                        and pd.statusenabled=true
                                            group by kmr.namakamar, kmr.id
                                    ) as a on a.id = km.id
            WHERE
                tt.kdprofile = 30 
                AND ru.objectdepartemenfk IN ( 16 ) 
                AND ru.statusenabled = true
                AND km.statusenabled = true 
                AND tt.statusenabled = TRUE
                GROUP BY km.id,sb.id, ru.namaruangan, km.namakamar, a.isi
                                    order by km.namakamar
                )as x
                group by x.namakamar, x.namaruangan, x.isi
            order by nourut, tab desc;

            "));
                $result = array(
                'data'=> $data,
                'as'=> 'Fizi@Epic'
            );
            return $this->respond($result);
        }
        
        public function updateTglCheckin (Request $request)
        {
            DB::beginTransaction();
            try {
                $tglSekarang = \Carbon\Carbon::now()->format('Y-m-d H:i:s');

                // 1. Ambil data noreservasi dari tabel antrian berdasarkan norec yang dikirim
                $antrian = DB::table('antrianpasienregistrasi_t')
                    ->where('norec', $request['norec'])
                    ->first();

                if (!$antrian) {
                    throw new \Exception("Data antrian tidak ditemukan.");
                }

                // 2. Update tabel pasiendaftar_t menggunakan relasi statusschedule = noreservasi
                // Kita update tglcheckin di pasiendaftar_t
                $updatePasiendaftar = DB::table('pasiendaftar_t')
                    ->where('statusschedule', $antrian->noreservasi)
                    ->update([
                        'tglcheckin' => $tglSekarang
                    ]);

                // 3. (Opsional namun disarankan) Update juga di tabel antrian sebagai penanda kedatangan
                // DB::table('antrianpasienregistrasi_t')
                //     ->where('norec', $request['norec'])
                //     ->update([
                //         'tglcheckin' => $tglSekarang
                //     ]);

                DB::commit();
                
                return $this->setStatusCode(201)->respond([
                    "status" => 201,
                    "message" => "Cek In Berhasil",
                    "tglcheckin" => $tglSekarang,
                    "as" => 'ramdan@epic'
                ], "Cek In Berhasil");

            } catch (\Exception $e) {
                DB::rollBack();
                return $this->setStatusCode(400)->respond([
                    "status" => 400,
                    "message" => "Gagal Cek In: " . $e->getMessage()
                ], "Gagal Cek In");
            }
        }
}
