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
			->orderBy('kelompokpasien')
			->get();
		$result = array(
			'ruanganrajal' => $dataRuanganJalan,
			'jeniskelamin' => $jk,
			'dokter' => $dkoter,
			'kelompokpasien' => $kelompokPasien,
			'message' => 'ramdan@epic',
		);

		return $this->respond($result);
	}
	public function getPasienByNoCmTglLahir($nocm,$tgllahir) {
		$data = \DB::table('pasien_m as ps')
			->leftJOIN ('alamat_m as alm','alm.nocmfk','=','ps.id')
			->leftjoin ('pendidikan_m as pdd','ps.objectpendidikanfk','=','pdd.id')
			->leftjoin ('pekerjaan_m as pk','ps.objectpekerjaanfk','=','pk.id')
			->leftjoin ('jeniskelamin_m as jk','jk.id','=','ps.objectjeniskelaminfk')
			->select('ps.nocm','ps.id as nocmfk','ps.namapasien','ps.objectjeniskelaminfk','jk.jeniskelamin',
				'alm.alamatlengkap','pdd.pendidikan','pk.pekerjaan','ps.noidentitas','ps.notelepon','ps.tempatlahir',
                'ps.nobpjs',
				DB::raw(" to_char ( ps.tgllahir,'yyyy-MM-dd') as tgllahir"))
            ->where('ps.statusenabled',true);
			// ->where('ps.nocm', $nocm);
        // if(isset($tgllahir) &&$tgllahir != "" && $tgllahir != "undefined" && $tgllahir != "null") {
        //     $data = $data ->whereRaw("CONVERT(varchar, ps.tgllahir, 105)  ='$tgllahir' " );
        // }
        if(isset($nocm) &&$nocm != "" && $nocm != "undefined" && $nocm != "null") {
            $data = $data->where('ps.nocm','=',$nocm)
             ->Orwhere('ps.noidentitas','=',$nocm);
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
        DB::beginTransaction();
        try {
	        $tgl =$request['tglReservasiFix'];
	        $dataReservasi = \DB::table('antrianpasienregistrasi_t as apr')
		        ->select('apr.norec','apr.tanggalreservasi')
		        ->whereRaw("apr.tanggalreservasi = '$tgl'")
		        ->where('apr.objectruanganfk', $request['poliKlinik']['id'])
		        ->where('apr.noreservasi','!=','-')
		        ->whereNotNull('apr.noreservasi')
		        ->where('apr.statusenabled',true)
                ->where('apr.kdprofile', (int) $kdProfile )
		        ->get();
			if(count($dataReservasi) > 0){
				$result = array(
					"status" => 400,
					"message" => 'Tidak bisa Reservasi, Coba di jadwal yang lain',
				);
				return $this->setStatusCode($result['status'])->respond($result, 'Mohon maaf dijam tersebut sudah ada yang reservasi, Coba di jadwal yang lain');
			}
            if($request['isBaru'] == false){
                $pasien  = Pasien::where('nocm',$request['noCm'])->first();
            }

            $newptp = new AntrianPasienRegistrasi();
            $nontrian=AntrianPasienRegistrasi::max('noantrian')+ 1;
            $newptp->norec = $newptp->generateNewId();;
            $newptp->kdprofile = (int) $kdProfile ;
            $newptp->statusenabled = true;
            $newptp->objectruanganfk =$request['poliKlinik']['id'];
            $newptp->objectjeniskelaminfk =$request['jenisKelamin']['id'];
            $newptp->noreservasi =substr(Uuid::generate(), 0, 7);
            $newptp->tanggalreservasi = $request['tglReservasiFix'];
            $newptp->tgllahir= $request['tglLahir'];
            $newptp->objectkelompokpasienfk= $request['tipePembayaran']['id'];
            $newptp->objectpendidikanfk = 0;
            $newptp->namapasien=  $request['namaPasien'];
            $newptp->noidentitas=  $request['nik'];
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
        
            if($request['isBaru'] == true){
                $newptp->tipepasien = "BARU";
                $newptp->type = "BARU";
            }else{
                $newptp->tipepasien = "LAMA";
                $newptp->type = "LAMA";
            }
//            $newptp->objectasalrujukanfk = 0;
//            $newptp->objectstrukreturfk= 0;
//            $newptp->objecttitlefk= 0;
//            $newptp->isconfirm= 0;
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
            $newptp->save();
            $newptp->namaruangan =Ruangan::where('id',$newptp->objectruanganfk )
                                ->where('kdprofile',(int) $kdProfile )
                                ->first()->namaruangan;
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
            ->select('apr.norec','pm.nocm','apr.noreservasi','apr.tanggalreservasi','apr.objectruanganfk',
                'apr.objectpegawaifk','ru.namaruangan','apr.isconfirm','pg.namalengkap as dokter','pm.id as nocmfk',
               'pm.namapasien','apr.namapasien','alm.alamatlengkap','pk.pekerjaan','pm.noasuransilain','pm.noidentitas',
                'apr.nobpjs','pm.nohp','pdd.pendidikan','apr.type','kps.kelompokpasien','apr.objectkelompokpasienfk','ru.objectdepartemenfk',
                'ru.prefixnoantrian', 'apr.norujukan',
                DB::raw('(case when pm.namapasien is null then apr.namapasien else pm.namapasien end) as namapasien, 
                (case when apr.isconfirm=true then \'Confirm\' else \'Reservasi\' end) as status,case when pm.tempatlahir is null then apr.tempatlahir else pm.tempatlahir end as tempatlahir,
                case when jk.jeniskelamin is null then jks.jeniskelamin else jk.jeniskelamin end as jeniskelamin,
                case when apr.tgllahir is null then pm.tgllahir else apr.tgllahir end as tgllahir,
                case when apr.tipepasien = \'LAMA\' then pm.nohp else  apr.notelepon end as notelepon' )
            )
            // ->whereNull('apr.isconfirm')
            ->where('apr.noreservasi','!=','-')
            ->whereNotNull('apr.noreservasi')
             ->where('apr.kdprofile',  $kdProfile )
            ->where('apr.statusenabled',true);


        if(isset($request['nocmNama']) && $request['nocmNama'] != "" && $request['nocmNama'] != "undefined" && $request['nocmNama'] != "null") {
            $data =
                 $data->where('pm.nocm', $request['nocmNama'])
//                     ->Orwhere('pm.noidentitas', $request['nocmNama'])
                 -> Orwhere('apr.namapasien', 'ilike','%'.$request['nocmNama'].'%');

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
        $data = $data->orderBy('apr.tanggalreservasi','desc');
        if(isset($request['jmlRows']) && $request['jmlRows'] != "" && $request['jmlRows'] != "undefined" && $request['jmlRows'] != "null" && $request['jmlRows'] != 0) {
            $data=$data->take($request['jmlRows']);
        }

        if(isset($request['jmlOffset']) && $request['jmlOffset'] != "" && $request['jmlOffset'] != "undefined" && $request['jmlOffset'] != "null") {
            $data=$data->offset($request['jmlOffset']);
        }
        $data = $data->get();

        $result = array(
            'data' => $data,
            'as' => 'ramdan@epic',
        );
        return $this->respond($result);
    }
    public function deleteReservasi(Request $request)
    {
        DB::beginTransaction();
        try {
            AntrianPasienRegistrasi::where('norec',$request['norec'])->update([
               'statusenabled'=>false,
            ]);
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
		$ruangan = \DB::table('ruangan_m as ru')
			->join('slottingonline_m as slot', 'slot.objectruanganfk', '=', 'ru.id')
			->select('ru.id as idruangan','slot.id', 'ru.namaruangan', 'ru.objectdepartemenfk', 'slot.jambuka', 'slot.jamtutup',
				'slot.quota',
				DB::raw("extract(hour from slot.jamtutup) -extract(hour from slot.jambuka)as totaljam"))
            // DB::raw("datepart(hour,slot.jamtutup) -datepart(hour, slot.jambuka)as totaljam"))
			->where('ru.statusenabled', true)
            ->where('slot.kdprofile', $kdProfile)
			->where('slot.statusenabled', true);
//			->where('ru.id', $kode)
		if(isset($request['namaRuangan']) && $request['namaRuangan']!='undefined' && $request['namaRuangan']!=''){
			$ruangan =$ruangan->where('ru.namaruangan','ilike','%'.$request['namaRuangan'].'%');
		}
		if(isset($request['quota']) && $request['quota']!='undefined' && $request['quota']!=''){
			$ruangan =$ruangan->where('slot.quota','=',$request['quota']);
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
			$newptp->jambuka = $request['jambuka'];
			$newptp->jamtutup =  $request['jamtutup'];
			$newptp->quota =  $request['quota'];
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
                    ->whereRaw("format(apr.tanggalreservasi,'yyyy-MM-dd' )= '$tgl'")
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
                    ->whereRaw("format(apr.tanggalreservasi,'yyyy-MM-dd') = '$tgl'")
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

//       $request =  array(
//           "nomorkartu" => "0000172381691",
//           "nik" => "3372051109800010",
//           "notelp" => "085642649135",
//           "tanggalperiksa" => "2020-10-09",
//           "kodepoli" => "JIW",
//           "nomorreferensi" => "0001R0040116A000001",
//           "jenisreferensi" => "1",
//           "jenisrequest" => "2",
//           "polieksekutif" => "0"
//       );

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
      
        if(count($intervals) > 0){

            $antrian = 1;
            for ($x = 0; $x <= count($intervalsAwal); $x++) {
                if($intervals[0]['jam']== $intervalsAwal[$x]['jam']){
                    $antrian = $x +1;
                    // dd($antrian);
                    break;
                }
            }

            return array("antrian"=> $antrian+1,"jamkosong"=>$intervals[0]['jam']);
        }else{
            return array("antrian"=> 0,"jamkosong"=>"00:00");
        }

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
                INNER JOIN slottingkiosk_m AS sk ON sk.objectruanganfk = apr.objectruanganfk 
                INNER JOIN ruangan_m AS ru ON ru.id = apr.objectruanganfk
                LEFT JOIN pegawai_m AS pg ON pg.id = apr.objectpegawaifk
                WHERE apr.kdprofile = $kdProfile
                AND apr.tanggalreservasi between '$tglAwal' and '$tglAkhir'
                AND ru.kdinternal = '$kdInternalRuangan'            
                AND pg.kddokterbpjs = $kodeDokter
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
//                        INNER JOIN slottingkiosk_m AS sk ON sk.objectruanganfk = apr.objectruanganfk
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
                if ($pasienBaru == 0){
                    $estimasidilayani = strtotime($newptp->tanggalreservasi) * 1000;
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
                    $estimasidilayani = strtotime($newptp->tanggalreservasi) * 1000;
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
                            INNER JOIN slottingkiosk_m AS sk ON sk.objectruanganfk = apr.objectruanganfk 
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
        $micro = sprintf("%06d",($t - floor($t)) * 1000000);
        $d = new \DateTime( date('Y-m-d H:i:s.'.$micro, $t) );
        $tglRegis = $d->format('Y-m-d H:i:s');
        $tglRegBulan = $d->format('Y-m-d');
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
        $jk = JenisKelamin::where('reportdisplay', $request['jeniskelamin'])
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
}
