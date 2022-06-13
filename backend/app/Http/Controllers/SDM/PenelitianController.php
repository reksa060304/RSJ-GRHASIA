<?php
/**
 * Created by PhpStorm.
 * User: nengepic
 * Date: 07/12/2018
 * Time: 11.02
 */

namespace App\Http\Controllers\SDM;


use App\Http\Controllers\ApiController;
use App\Master\PeriodePeminjaman;
use App\Master\DiklatKategory;
use App\Traits\SettingDataFixedTrait;
use App\Transaksi\LoggingUser;
use App\Transaksi\SdmPenelitianEksternal;
use App\Transaksi\KegiatanPenelitianPegawai;
use Illuminate\Http\Request;
use App\Traits\PelayananPasienTrait;
use DB;
use App\Traits\Valet;


class PenelitianController extends ApiController {

    use Valet, SettingDataFixedTrait;
    public function __construct() {
        parent::__construct($skip_authentication=false);
    }

    public function getDataComboPenelitian(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $dataLogin = $request->all();
        $dataPegawaiUser = DB::select(DB::raw("select pg.id,pg.namalengkap, lu.objectkelompokuserfk, nom.nomor, pg.* from loginuser_s as lu
                INNER JOIN pegawai_m as pg on lu.objectpegawaifk=pg.id
                INNER JOIN nomortelphone_t as nom on nom.pegawaifk = pg.id
                where lu.kdprofile = $kdProfile and lu.id=:idLoginUser and nom.nomor ilike '0%'"),
            array(
                'idLoginUser' => $dataLogin['userData']['id'],
            )
        );

        $dataRuangan = \DB::table('ruangan_m as ru')
            ->where('ru.statusenabled', true)
            ->where('ru.kdprofile', $kdProfile)
            ->orderBy('ru.namaruangan')
            ->get();
        
        $detailjp = '';
        if(isset($request['diklat'])){
            $djp = " and djp.id = ".$request['diklat'];
            $detailjp = \DB::select(\DB::raw("
            select djp.namaexternal from detailjenisproduk_m as djp
            where djp.kdprofile = $kdProfile
            and djp.statusenabled = true
            and djp.objectjenisprodukfk = 27688
            $djp
            order by djp.id asc
            "));
        }
        
        $detailjenisproduk = \DB::table('detailjenisproduk_m as djp')
            ->where('djp.kdprofile', $kdProfile)
            ->where('djp.objectjenisprodukfk', 27688)
            ->where('djp.statusenabled', true)
            ->orderBy('djp.id', 'asc')
            ->get();
        
        $layanan = \DB::table('produk_m as pr')
            ->where('pr.kdprofile', $kdProfile)
            ->where('pr.objectdetailjenisprodukfk', $request['diklat'])
            ->where('pr.statusenabled', true)
            ->orderBy('pr.id', 'asc')
            ->get();
        $jenisdiklat = \DB::table('diklatkategori_m as dk')
            ->where('dk.kdprofile', $kdProfile)
            ->where('dk.statusenabled', true)
            ->orderBy('dk.id', 'asc')
            ->get();
            $lynn ='';
        if(isset($request['lynn'])){
            $lynn = \DB::table('harganettoprodukbykelas_m as hnett')
            ->where('hnett.kdprofile', $kdProfile)
            ->where('hnett.objectprodukfk', $request['lynn'])
            ->where('hnett.statusenabled', true)
            ->orderBy('hnett.id', 'asc')
            ->get();
        }
        $jeniskelamin = \DB::table('jeniskelamin_m as jk')
            ->where('jk.kdprofile', $kdProfile)
            ->where('jk.statusenabled', true)
            ->orderBy('jk.id', 'asc')
            ->get();
        $pegawai = \DB::table('pegawai_m as jk')
            ->where('jk.kdprofile', $kdProfile)
            ->where('jk.statusenabled', true)
            ->orderBy('jk.id', 'asc')
            ->get();
            $noreg = $request['noregistrasi'];
            $me=[];
            $mahasiswaeksternal = \DB::select(DB::raw("SELECT
            sdpd.nama,
            jk.jeniskelamin,
            sdpd.jeniskelaminfk,
            sdpd.nim,
            ru.namaruangan,
            pe.namalengkap,
            sdpd.norec AS norec_eks,
            sdpd.nomorhp,
            sdpd.noregistrasifk AS norec_pe, sdpd.email ,sdpd.image
            FROM
            sdm_pesertadidik_t sdpd 
            INNER JOIN sdm_penelitianeksternal_t sdmp on sdmp.norec=sdpd.noregistrasifk
            left join jeniskelamin_m jk on jk.id = sdpd.jeniskelaminfk
            left JOIN pegawai_m pe on pe.id = sdpd.objectpegawailastfk
            left JOIN ruangan_m ru on ru.id = sdpd.objectruanganlastfk
            WHERE
            sdpd.kdprofile = $kdProfile and sdpd.statusenabled = true and 
            sdpd.noregistrasifk ILIKE'$noreg'
            "));
            $img = '';
            if(stripos(\Request::url(), 'localhost') !== FALSE){
                $img = \Request::root() ."/img/DIKLAT/FileFoto/";
            }else{
                $img = \Request::root() ."/service/img/DIKLAT/FileFoto/" ;
            }
            foreach ($mahasiswaeksternal as $mhs) {
                $me[]= array(
                'nama' => $mhs->nama,
                'jeniskelamin' => $mhs->jeniskelamin,
                'nim' => $mhs->nim,
                'namaruangan' => $mhs->namaruangan,
                'namalengkap' => $mhs->namalengkap,
                'norec_eks' => $mhs->norec_eks,
                'nomorhp' => $mhs->nomorhp,
                'norec_pe' => $mhs->norec_pe,
                'email' => $mhs->email,
                'image' => $img . $mhs->email . "/" . $mhs->image,
                'jeniskelaminfk' => $mhs->jeniskelaminfk,
            );
            }
            $norec = \DB::table('sdm_penelitianeksternal_t as sdpd')
            ->select('sdpd.norec','sdpd.jumlahpeserta')
            ->where('sdpd.kdprofile', $kdProfile)
            ->where('sdpd.statusenabled', true)
            ->where('sdpd.norec', $request['noregistrasi'])
            ->get();

            //untuk mengambil norec mahasiswa eksternal 
            $bwtnorec= $request['noregistrasi'];
            $norec_sp = \DB::select(DB::raw("select 
                sdmp.norec,dk.diklatkategori,djp.detailjenisproduk,sdmp.objectprodukfk,sdmp.jumlahpeserta,
                sdmp.institusipendidikan,sdmp.tanggalmulai::date,sdmp.tanggalselesai::date,sdmp.biayapenelitian,
                sdmp.notelp,sdmp.hargasatuan,sdmp.qty, sp.isverifikasi,sp.nosbmlastfk,sp.nosbklastfk,
                sp.norec as norec_sp,sdmp.noregistrasifk,sp.nostruk
                FROM
                sdm_penelitianeksternal_t sdmp
                left JOIN detailjenisproduk_m djp ON sdmp.objectdetailjenisprodukfk = djp.id
                left join diklatkategori_m dk on dk.id= sdmp.objectdiklatkategorifk
                left join produk_m pr on pr.id= sdmp.objectprodukfk
                left join strukpelayanan_t sp on sp.norec = sdmp.noregistrasifk
                where sdmp.kdprofile = $kdProfile and sdmp.norec ilike'$bwtnorec' and sdmp.noregistrasifk is not null
            "));
        $result = array(
            'sp' => $norec_sp,
            'norec' => $norec,
            'me' => $mahasiswaeksternal,
            'me2'=> $me,
            'pegawai' => $pegawai,
            'jeniskelamin' => $jeniskelamin,
            'lynn'=>$lynn,
            'jenisdiklat'=>$jenisdiklat,
            'detailjp'=>$detailjp,
            'layanan' => $layanan,
            'detailjenisproduk' => $detailjenisproduk,
            'datalogin' => $dataLogin,
            // 'departemen' => $datadept,
            'pegawaiuser' => $dataPegawaiUser,
            // 'datadept' => $dataDepartemen,
            'dataruangan' => $dataRuangan,
            // 'jurusanpeminatan' => $JurusanPeminatan,
            // 'fakultas' => $Fakultas,
            // 'institusi' => $Institusi,
            'message' => 'ea@epic',
        );

        return $this->respond($result);
    }

    public function saveKegiatanPenelitianExternal(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $dataLogin = $request->all();
        $tglAyeuna = date('Y-m-d H:i:s');
        $JenisLog ='';
        $idPP= '';
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id',$dataLogin['userData']['id'])
            ->first();
        DB::beginTransaction();
        try{
            if ($request['data']['norec_kpe'] == ''){
                $dataKPE = new SdmPenelitianEksternal();
                $dataKPE->kdprofile = $kdProfile;
                $dataKPE->statusenabled = true;
                $dataKPE->norec = $dataKPE->generateNewId();
                $JenisLog='Simpan Penelitian Kegiatan Eksternal';
            }else{
                $dataKPE =  SdmPenelitianEksternal::where('norec',$request['data']['norec_kpe'])->first();
                $JenisLog='Ubah Penelitian Kegiatan Eksternal';
            }
            $dataKPE->namauser = $request['data']['namauser'];
            $dataKPE->notelp = $request['data']['notelp'];
            $dataKPE->objectdiklatkategorifk = $request['data']['objectdiklatkategorifk'];
            $dataKPE->objectdetailjenisprodukfk = $request['data']['objectdetailjenisprodukfk'];
            $dataKPE->objectprodukfk = $request['data']['objectprodukfk'];
            $dataKPE->jumlahpeserta = $request['data']['jumlahpeserta'];
            $dataKPE->qty = $request['data']['qty'];
            $dataKPE->satuan = $request['data']['satuan'];
            $dataKPE->biayapenelitian = $request['data']['biayapenelitian'];
            $dataKPE->tglregistrasi = $request['data']['tglregistrasi'];
            $dataKPE->hargasatuan = $request['data']['hargasatuan'];
            $dataKPE->institusipendidikan = $request['data']['institusipendidikan']; //count tgl pasien perruanga
            $dataKPE->tanggalmulai = $request['data']['tanggalmulai'];
            $dataKPE->tanggalselesai = $request['data']['tanggalselesai'];
            $dataKPE->namapendamping = $request['data']['namapendamping'];
            $dataKPE->judulpeneltian = $request['data']['judulpenelitian'];
            $dataKPE->namapengawas = $request['data']['namapengawas'];
            $dataKPE->nosertifikat = $request['data']['nosertifikat'];

            if(isset($request['data']['pengesah'])){
                $dataKPE->pengesah = $request['data']['pengesah'];
            }
            
            $dataKPE->save();
            $idPP=$dataKPE->norec;

            //## Logging User
            $newId = LoggingUser::max('id');
            $newId = $newId +1;
            $logUser = new LoggingUser();
            $logUser->id = $newId;
            $logUser->norec = $logUser->generateNewId();
            $logUser->kdprofile= $kdProfile;
            $logUser->statusenabled=true;
            $logUser->jenislog = $JenisLog;
            $logUser->noreff =$idPP;
            $logUser->referensi='norec Penelitian Kegiatan Eksternal';
            $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
            $logUser->tanggal = $tglAyeuna;
            $logUser->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Kegiatan Penelitian Eksternal";
            $errMessage = $e->getMessage();
            $errLine = $e->getLine();
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                'status' => 201,
                'norec' => $idPP,
                'message' => $transMessage,
                'data'=> $dataKPE,
                'as' => 'ea@epic',
            );
        } else {
            $transMessage = "Gagal Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'norec' => $idPP,
                'message'  => $transStatus,
                'e'=> $errMessage,
                'line'=> $errLine,
                'as' => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

        // $result = array(
        //         'status' => 201,
        //         'norec' => $idPP,
        //         // 'message'  => $transStatus,
        //         'as' => 'ea@epic',
        //     );
        // return $this->respond($result);
    }

    public function verifKegiatanPenelitianExternal(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $dataLogin = $request->all();
        $tglAyeuna = date('Y-m-d H:i:s');
        $JenisLog ='';
        $idPP= '';
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id',$dataLogin['userData']['id'])
            ->first();
        DB::beginTransaction();
        $verif = $request['data']['verif'];
        try{
            
            if ($request['data']['verif'] === 'true') {
                $dataKPE = SdmPenelitianEksternal::where('norec',$request['data']['norec'])->first();
                $dataKPE->noregistrasifk = $request['data']['noregistrasifk'];
                $dataKPE->save();
            }
            //## Logging User
            $newId = LoggingUser::max('id');
            $newId = $newId +1;
            $logUser = new LoggingUser();
            $logUser->id = $newId;
            $logUser->norec = $logUser->generateNewId();
            $logUser->kdprofile= $kdProfile;
            $logUser->statusenabled=true;
            $logUser->jenislog = $JenisLog;
            $logUser->noreff =$idPP;
            $logUser->referensi='norec Penelitian Kegiatan Eksternal';
            $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
            $logUser->tanggal = $tglAyeuna;
            $logUser->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Verifikasi Kegiatan Penelitian Eksternal";
        }

        if ($transStatus == 'true') {
            $transMessage = "Verifikasi Berhasil";
            DB::commit();
            $result = array(
                'status' => 201,
                'norec' => $idPP,
                'message' => $transMessage,
                'data'=> $dataKPE,
                'as' => 'ea@epic',
            );
        } else {
            $transMessage = "Gagal Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'norec' => $idPP,
                'message'  => $transStatus,
                'as' => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

        // $result = array(
        //         'status' => 400,
        //         'norec' => $idPP,
        //         // 'message'  => $transStatus,
        //         'as' => 'ea@epic',
        //     );
        // return $this->respond($result);
    }

    public function verifTagihanKegiatanPenelitianExternal(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $dataLogin = $request->all();
        $tglAyeuna = date('Y-m-d H:i:s');
        DB::beginTransaction();
        $verif = '';
        try{
            $dataKPE = \DB::table('strukpelayanan_t')->where('norec',$request['norec'])
            ->update(['isverifikasi'=> $request['isverifikasi']]);
            // $verif = $dataKPE->isverifikasi;
            // //## Logging User
            // $newId = LoggingUser::max('id');
            // $newId = $newId +1;
            // $logUser = new LoggingUser();
            // $logUser->id = $newId;
            // $logUser->norec = $logUser->generateNewId();
            // $logUser->kdprofile= $kdProfile;
            // $logUser->statusenabled=true;
            // $logUser->jenislog = $JenisLog;
            // $logUser->noreff =$idPP;
            // $logUser->referensi='Verifikasi Tagihan Penelitian Kegiatan Eksternal';
            // $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
            // $logUser->tanggal = $tglAyeuna;
            // $logUser->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            
        }

        if ($transStatus == 'true') {
            $transMessage = "Verifikasi Tagihan Kegiatan Diklat Eksternal Berhasil";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'ea@epic',
            );
        } else {
            $transMessage = "Gagal Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transStatus,
                'as' => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result);

        // $result = array(
        //         'status' => 400,
        //         'norec' => $idPP,
        //         // 'message'  => $transStatus,
        //         'as' => 'ea@epic',
        //     );
        // return $this->respond($result);
    }

    public function getDaftarPenelitianKegiatanEksternal (Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tglAwal = $request['tglawal'];
        $tglAkhir = $request['tglakhir'];
    $NamaPeneliti = '';
        if (isset($request['NamaPeneliti']) && $request['NamaPeneliti'] != "" && $request['NamaPeneliti'] != "undefined") {
        $NamaPeneliti = " and sdmp.namapeneliti ILIKE ". "'%" . $request['NamaPeneliti'] . "%'";
        }

        $Fakultas = '';
        if (isset($request['Fakultas']) && $request['Fakultas'] != "" && $request['Fakultas'] != "undefined") {
        $Fakultas = " and sdmp.institusipendidikan ilike '%" . $request['Fakultas']. "%'";
        }
        $ex= $request['user'];
        $user = '';
        if (isset($request['user']) && $request['user'] != "" && $request['user'] != "undefined") {
        $user = "and sdmp.namauser ilike '$ex'";
        }
        $data = DB::select(DB::raw("SELECT
            sdmp.norec,dk.diklatkategori,djp.detailjenisproduk,sdmp.objectprodukfk,sdmp.jumlahpeserta,
            sdmp.institusipendidikan,sdmp.tanggalmulai::date,sdmp.tanggalselesai::date,sdmp.biayapenelitian,
            sdmp.notelp,sdmp.hargasatuan,sdmp.qty, sp.isverifikasi,sp.nosbmlastfk,sp.nosbklastfk,
            sp.norec as norec_sp,sdmp.noregistrasifk,sp.nostruk, count(sdmpd.norec), sdmp.judulpeneltian, sdmp.namapengawas, sdmp.namapendamping
            FROM
                sdm_penelitianeksternal_t sdmp
                left JOIN detailjenisproduk_m djp ON sdmp.objectdetailjenisprodukfk = djp.id
                left join diklatkategori_m dk on dk.id= sdmp.objectdiklatkategorifk
                left join produk_m pr on pr.id= sdmp.objectprodukfk
                left join strukpelayanan_t sp on sp.norec = sdmp.noregistrasifk
                left join sdm_pesertadidik_t sdmpd on sdmpd.noregistrasifk = sdmp.norec
                where sdmp.kdprofile = $kdProfile and sdmp.tglregistrasi::date between '$tglAwal'and '$tglAkhir' and sdmp.statusenabled = true
                $user $Fakultas
                group by sdmp.norec,dk.diklatkategori,djp.detailjenisproduk,sdmp.objectprodukfk,sdmp.jumlahpeserta,
            sdmp.institusipendidikan,sdmp.tanggalmulai::date,sdmp.tanggalselesai::date,sdmp.biayapenelitian,
            sdmp.notelp,sdmp.hargasatuan,sdmp.qty, sp.isverifikasi,sp.nosbmlastfk,sp.nosbklastfk,
            sp.norec,sdmp.noregistrasifk,sp.nostruk, sdmp.judulpeneltian, sdmp.namapengawas, sdmp.namapendamping
                ")
        );
        $IdPegawai = \DB::table('pegawai_m')->where('id', $request['modelid'])->get();
        $result = array(
        'datas'=>$data,
        'idpegawai'=>$IdPegawai,
        'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getDetailPenelitianKegiatanEksternal (Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $Norec=$request['Norec'];
        $data = DB::select(DB::raw("SELECT sdmp.hargasatuan, sdmp.tglregistrasi,
        sdmp.norec, sdmp.namauser, sdmp.institusipendidikan, sdmp.notelp, dk.id as idjenis, dk.diklatkategori,
        djp.id as idlayanan, djp.detailjenisproduk,
        pr.id as idlevelpendidikan, pr.namaproduk as levelpendidikan,
        sdmp.jumlahpeserta, sdmp.qty, sdmp.satuan, sdmp.biayapenelitian, sdmp.tanggalmulai, sdmp.tanggalselesai, sdmp.judulpeneltian,
        sdmp.namapendamping,sdmp.namapengawas, sdmp.nosertifikat, sdmp.pengesah, pg.namalengkap
        FROM sdm_penelitianeksternal_t sdmp
        INNER JOIN diklatkategori_m dk on dk.id= sdmp.objectdiklatkategorifk
        INNER JOIN detailjenisproduk_m djp on djp.id= sdmp.objectdetailjenisprodukfk
        INNER JOIN produk_m pr on pr.id= sdmp.objectprodukfk
        left join pegawai_m pg on pg.id = sdmp.pengesah
        where sdmp.kdprofile = $kdProfile and sdmp.norec ilike'$Norec'")
        );
        $idlvl = $data[0]->idlevelpendidikan;
        $lvl = $data[0]->levelpendidikan;
        $mahasiswaeksternal = \DB::table('sdm_pesertadidik_t as sdpd')
            ->select('sdpd.nama','jk.jeniskelamin','sdpd.nim','ru.namaruangan','pe.namalengkap')
            ->join('jeniskelamin_m as jk', 'jk.id', '=', 'sdpd.jeniskelaminfk')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'sdpd.objectruanganlastfk')
            ->leftjoin('pegawai_m as pe', 'pe.id', '=', 'sdpd.objectpegawailastfk')
            ->where('sdpd.kdprofile', $kdProfile)
            ->where('sdpd.statusenabled', true)
            // ->where('sdpd.norec', $request['norec_pd'])
            ->where('sdpd.noregistrasifk', $Norec)
            ->get();
        $result = array(
            'datas'=>$data,
            'lvl'=>$lvl,
            'idlvl'=>$idlvl,
            'me'=> $mahasiswaeksternal,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function saveBatalPenelitianEksternal(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        $tglAyeuna = date('Y-m-d H:i:s');
        $dataLogin = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id',$dataLogin['userData']['id'])
            ->where('lu.kdprofile', $kdProfile)
            ->first();
        try{

            $delete = \DB::table('sdm_penelitianeksternal_t')->where('norec',$request['norec'])->update(['statusenabled' => false]);
            // //## Logging User
            $newId = LoggingUser::max('id');
            $newId = $newId +1;
            $logUser = new LoggingUser();
            $logUser->id = $newId;
            $logUser->norec = $logUser->generateNewId();
            $logUser->kdprofile= $kdProfile;
            $logUser->statusenabled=true;
            $logUser->jenislog = 'Batal Penelitian Kegiatan Eksternal';
            $logUser->noreff =$request['norec'];
            $logUser->referensi='norec Penelitian Kegiatan Eksternal';
            $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
            $logUser->tanggal = $tglAyeuna;
            $logUser->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Batal Penelitian Kegiatan Eksternal";
        }

        if ($transStatus == 'true') {
            $transMessage = "Hapus Berhasil";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'ea@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transStatus,
                'as' => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
        //     $result = array(
        //         'status' => 201,
        //         'message'  => $delete,
        //         'as' => 'ea@epic',
        //     );
        // return $this->respond($result);
    }

    public function saveKegiatanPenelitianPegawai(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $dataLogin = $request->all();
        $tglAyeuna = date('Y-m-d H:i:s');
        $JenisLog ='';
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id',$dataLogin['userData']['id'])
            ->where('lu.kdprofile', $kdProfile)
            ->first();
        DB::beginTransaction();
        try{
            if ($request['data']['norec_kpe'] == ''){
                $dataKPE = new KegiatanPenelitianPegawai();
                $dataKPE->kdprofile = $kdProfile;
                $dataKPE->statusenabled = true;
                $dataKPE->norec = $dataKPE->generateNewId();
                $JenisLog='Simpan Penelitian Kegiatan Pegawai';
            }else{
                $dataKPE =  KegiatanPenelitianPegawai::where('norec',$request['data']['norec_kpe'])->where('kdprofile', $kdProfile)->first();
                $JenisLog='Ubah Penelitian Kegiatan Pegawai';
            }
            $dataKPE->pegawaifk = $request['data']['pegawaifk'];
            $dataKPE->unitkerja = $request['data']['unitkerja'];
            $dataKPE->lokasipenelitian = $request['data']['lokasipenelitian'];
            $dataKPE->judulpenelitian = $request['data']['judulpenelitian'];
            $dataKPE->tanggalmulai = $request['data']['tanggalmulai'];
            $dataKPE->tanggalselesai=$request['data']['tanggalselesai'];
            $dataKPE->biayapenelitian = $request['data']['biayapenelitian'];
            $dataKPE->jumlahbantuan = $request['data']['jumlahbantuan'];
            $dataKPE->bantuanditerima = $request['data']['bantuanditerima'];
            $dataKPE->tanggalpembayaran = $request['data']['tanggalpembayaran'];
            $dataKPE->nokwitansi = $request['data']['nokwitansi'];
            $dataKPE->kelengkapanadministrasi = $request['data']['kelengkapanadministrasi'];
            $dataKPE->tanggalpresentasi = $request['data']['tanggalpresentasi'];
            $dataKPE->tanggalproposal = $request['data']['tanggalproposal'];
            $dataKPE->tanggalpresentasi = $request['data']['tanggalpresentasi'];
            $dataKPE->laporanpenelitian = $request['data']['laporanpenelitian'];
            $dataKPE->tanggalkajian = $request['data']['tanggalkajian'];
            $dataKPE->publikasijurnal = $request['data']['publikasijurnal'];
            $dataKPE->tanggalpublikasi = $request['data']['tanggalpublikasi'];
            $dataKPE->tindaklanjut = $request['data']['tindaklanjut'];
            $dataKPE->save();
            $idPP=$dataKPE->norec;

            //## Logging User
            $newId = LoggingUser::max('id');
            $newId = $newId +1;
            $logUser = new LoggingUser();
            $logUser->id = $newId;
            $logUser->norec = $logUser->generateNewId();
            $logUser->kdprofile= $kdProfile;
            $logUser->statusenabled=true;
            $logUser->jenislog = $JenisLog;
            $logUser->noreff =$idPP;
            $logUser->referensi='norec Penelitian Kegiatan Pegawai';
            $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
            $logUser->tanggal = $tglAyeuna;
            $logUser->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Kegiatan Penelitian Pegawai";
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                'status' => 201,
                'norec' => $idPP,
                'message' => $transMessage,
                'as' => 'ea@epic',
            );
        } else {
            $transMessage = "Gagal Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'norec' => $idPP,
                'message'  => $transStatus,
                'as' => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveBatalPenelitianPegawai(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        $tglAyeuna = date('Y-m-d H:i:s');
        $dataLogin = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id',$dataLogin['userData']['id'])
            ->where('lu.kdprofile', $kdProfile)
            ->first();
        try{

            $Kel = KegiatanPenelitianPegawai::where('norec', $request['data']['norec'])
                ->where('kdprofile', $kdProfile)
                ->update([
//                    'statusenabled' => 'f',
                    'statusenabled' => 0,
                ]);

            //## Logging User
            $newId = LoggingUser::max('id');
            $newId = $newId +1;
            $logUser = new LoggingUser();
            $logUser->id = $newId;
            $logUser->norec = $logUser->generateNewId();
            $logUser->kdprofile= $kdProfile;
            $logUser->statusenabled=true;
            $logUser->jenislog = 'Batal Penelitian Kegiatan Pegawai';
            $logUser->noreff =$request['data']['norec'];
            $logUser->referensi='norec Penelitian Kegiatan Pegawai';
            $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
            $logUser->tanggal = $tglAyeuna;
            $logUser->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Batal Penelitian Kegiatan Eksternal";
        }

        if ($transStatus == 'true') {
            $transMessage = "Hapus Berhasil";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'ea@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transStatus,
                'as' => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDaftarPegawai (Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $IdPegawai = $request['IdPegawai'];
        $data = DB::select(DB::raw("select top 1pg.id as pegawaifk,pg.namalengkap,pg.nip_pns,mp.objectunitkerjapegawaifk,uk.unitkerja 
                from pegawai_m as pg
                INNER JOIN mappegawaijabatantounitkerja_m as mp on mp.objectpegawaifk = pg.id
                LEFT JOIN unitkerja_m as uk on uk.id = mp.objectunitkerjapegawaifk
                LEFT JOIN subunitkerja_m as suk on suk.id = mp.objectsubunitkerjapegawaifk
                LEFT JOIN jabatan_m as jb on jb.id = mp.objectjabatanfk
                where pg.kdprofile = $kdProfile and pg.id='$IdPegawai'")
        );
        $result = array(
            'data'=>$data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getDaftarPenelitianKegiatanPegawai (Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $NamaPeneliti = '';
        if (isset($request['NamaPeneliti']) && $request['NamaPeneliti'] != "" && $request['NamaPeneliti'] != "undefined") {
            $NamaPeneliti = " and pe.namapeneliti ILIKE ". "'%" . $request['NamaPeneliti'] . "%'";
        }

        $JudulPenelitian = '';
        if (isset($request['JudulPenelitian']) && $request['JudulPenelitian'] != "" && $request['JudulPenelitian'] != "undefined") {
            $JudulPenelitian = " and pe.judulpenelitian ILIKE ". "'%" . $request['JudulPenelitian'] . "%'";
        }

        $UnitKerja = '';
        if (isset($request['UnitKerja']) && $request['UnitKerja'] != "" && $request['UnitKerja'] != "undefined") {
            $UnitKerja = " and pe.unitkerja ILIKE ". "'%" . $request['UnitKerja'] . "%'";
        }

        $data = DB::select(DB::raw("select pe.*,pg.namalengkap,pg.nip_pns
                 from kegiatanpenelitianpegawai_t as pe 
                 INNER JOIN pegawai_m as pg on pg.id = pe.pegawaifk
                 where pe.kdprofile = $kdProfile and pe.tanggalmulai >= '$tglAwal' and pe.tanggalmulai <= '$tglAkhir' and pe.statusenabled = true
                 $NamaPeneliti
                 $JudulPenelitian
                 $UnitKerja")
        );
        $result = array(
            'datas'=>$data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getDetailPenelitianKegiatanPegawai (Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $Norec=$request['Norec'];
        $data = DB::select(DB::raw("select pe.*,pg.namalengkap,pg.nip_pns
                 from kegiatanpenelitianpegawai_t as pe 
                 INNER JOIN pegawai_m as pg on pg.id = pe.pegawaifk
                 where pe.kdprofile = $kdProfile and pe.norec='$Norec' limit 1")
        );
        $result = array(
            'datas'=>$data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }
}
