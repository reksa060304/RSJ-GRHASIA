<?php
/**
 * Created by PhpStorm.
 * User: Egie Ramdan
 * Date: 11/16/2019
 * Time: 3:05 PM
 */

namespace App\Http\Controllers\Anggaran_2024;

use App\Http\Controllers\ApiController;
use App\Master\KelompokAnggaranHead;
use App\Master\KelompokAnggaranKedua;
use App\Master\KelompokAnggaranKeempat;
use App\Master\KelompokAnggaranKetiga;
use App\Master\KelompokAnggaranPertama;
use App\Master\KelompokAnggaranKelima;
use App\Master\KelompokAnggaranKeenam;
use App\Master\Rekanan;
use App\Transaksi\AntrianPasienDiperiksa;
use App\Transaksi\MataAnggaran;
use App\Transaksi\PasienDaftar;
use App\Transaksi\PelayananPasien;
use App\Transaksi\PelayananPasienDetail;
use App\Transaksi\PelayananPasienPetugas;
use App\Transaksi\RiwayatRealisasi;
use App\Transaksi\StrukPelayananDetail;
use App\Transaksi\StrukRealisasi;
use App\Transaksi\StrukVerifikasi;
use App\Transaksi\StrukVerifikasiAnggaran;
use App\Transaksi\Panjar;
use App\Transaksi\Permen;
use App\Transaksi\Pengembalian;
use App\Transaksi\BKU;
use App\Transaksi\TransaksiAnggaran2024;
use Illuminate\Http\Request;
use DB;
use App\Transaksi\SeqNumber;

use App\Transaksi\StrukOrder;
use App\Transaksi\OrderPelayanan;
use App\Transaksi\OrderProduk;
use App\Master\Pegawai;
use App\Traits\Valet;
use App\Transaksi\AlokasiKeteranganBelanja;
use App\Master\KegiatanAnggaran2024;
use App\Transaksi\SettingAnggaran;
use App\Transaksi\KegiatanBelanja;
use App\Transaksi\KeteranganBelanja2024;
use App\Transaksi\KeteranganBelanja;
use App\Transaksi\RealisasiDetail;
use App\Transaksi\SPP;
use App\Transaksi\SPD;
use App\Transaksi\SPM;
use App\Transaksi\LPJ;
use App\Transaksi\PemungutanPajak;
use App\Transaksi\PenyetoranPajak;
use App\Transaksi\JasaGiro;
use App\Transaksi\SPJtoPanjar;
use App\Transaksi\STSKeuangan;
use App\Transaksi\Retur;
use App\Transaksi\Jurnal;
use App\Transaksi\Telemedicine;
use App\Transaksi\LockSPJ;
use App\Master\AsalProduk;
use App\Transaksi\UraianPendapatan;
use phpDocumentor\Reflection\Types\Null_;
use phpDocumentor\Reflection\Types\Parent_;
use Webpatser\Uuid\Uuid;
use App\Master\RunningNumber;
use App\Transaksi\StrukPelayanan;

use App\Transaksi\StrukPerencanaan;
use App\Transaksi\StrukPerencanaanDetail;

class AnggaranController extends ApiController {
    use Valet;
    public function __construct(){
        parent::__construct($skip_authentication=false);
    }

    public function getComboLogistik(Request $request) {
        
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $prefix = '';
        $data = \DB::table('loginuser_s as lu')
            ->JOIN('pegawai_m as pg','pg.id','=','lu.objectpegawaifk')
            ->select('pg.id','pg.namalengkap')
            ->where('lu.kdprofile',$idProfile)
            ->where('lu.id',$request['userData']['id'])
            ->get();
        $divkegiatan = \DB::table('divkegiatan2024_m as dk')
            ->select('dk.id','dk.div')
            ->where('dk.statusenabled',true)
            ->where('dk.kdprofile', $idProfile)
            ->get();
        $divProg = \DB::table('kegiatananggaran2024_m as ka')
            ->select('ka.*',
                DB::raw("CONCAT(ka.kode, ' ', ka.keterangan) AS kode_keterangan
                ")
                )
            ->where('ka.statusenabled',true)
            ->where('ka.div','0')
            ->where('ka.kdprofile', $idProfile)
            ->get();
        $divKg = \DB::table('kegiatananggaran2024_m as ka')
            ->select('ka.*',
                DB::raw("CONCAT(ka.kode, ' ', ka.keterangan) AS kode_keterangan
                ")
                )
            ->where('ka.statusenabled',true)
            ->where('ka.div','1')
            ->where('ka.kdprofile', $idProfile)
            ->get();
        
        $divsubkg = \DB::table('kegiatananggaran2024_m as ka')
            ->select('ka.*',
                DB::raw("CONCAT(ka.kode, ' ', ka.keterangan) AS kode_keterangan
                ")
                )
            ->where('ka.statusenabled',true)
            ->where('ka.div','2')
            ->where('ka.kdprofile', $idProfile)
            ->get();
        
        $divsubsubkg = \DB::table('kegiatananggaran2024_m as ka')
            ->select('ka.*',
                DB::raw("CONCAT(ka.kode, ' ', ka.keterangan) AS kode_keterangan
                ")
                )
            ->where('ka.statusenabled',true)
            ->where('ka.div','3')
            ->where('ka.kdprofile', $idProfile)
            ->get();
        
        $divsubsubsubkg = \DB::table('kegiatananggaran2024_m as ka')
            ->select('ka.*',
                DB::raw("CONCAT(ka.kode, ' ', ka.keterangan) AS kode_keterangan
                ")
                )
            ->where('ka.statusenabled',true)
            ->where('ka.div','4')
            ->where('ka.kdprofile', $idProfile)
            ->get();

        $tahap = \DB::table('tahapanggaran_m as th')
            ->select('th.tahap', 'th.id')
            ->where('th.kdprofile', $idProfile)
            ->where('th.statusenabled', true)
            ->orderBy('th.id')
            ->get();

        $jenisbelanja = \DB::table('jenisbelanja_m')
            ->select('jenisbelanja','id')
            ->where('kdprofile', $idProfile)
            ->where('statusenabled', 't')
            ->get();
        
        $setting = \DB::table('settinganggaran_t as st')
            ->join('pegawai_m as pg','pg.id','=','st.objectkepalabludfk')
            ->join('tahapanggaran_m as ta','ta.id','=','st.objecttahapaktivfk')
            ->select('st.*','pg.namalengkap', 'ta.tahap', 'ta.id as idtahap', 'pg.id as idpegawai')
            ->where('st.kdprofile', $idProfile)
            ->where('st.statusenabled', true)
            ->orderBy('st.tahunanggaran')
            ->get();

        $bendahara = \DB::table('pegawai_m as pg')
            ->select('pg.namalengkap as text', 'pg.id as value')
            ->where('pg.kdprofile', $idProfile)
            ->where('pg.statusenabled', true)
            ->where('pg.objectjabatanfungsionalfk', 1426)
            ->orderBy('pg.namalengkap')
            ->get();

        $asalproduk = \DB::table('asalproduk_m')
            ->select('asalproduk', 'id')
            ->where('kdprofile', $idProfile)
            ->where('statusenabled', true)
            ->where('isanggaran', true)
            ->get();

        $result = array(
            'pegawai' => $data,
            'divkegiatan'=> $divkegiatan,
            'divprog'=> $divProg,
            'divKg'=> $divKg,
            'divsubKg'=> $divsubkg,
            'divsubsubKg'=> $divsubsubkg,
            'divsubsubsubkg'=> $divsubsubsubkg,
            'tahap'=> $tahap,
            'jenisbelanja'=> $jenisbelanja,
            'setting' => $setting,
            'asalproduk' => $asalproduk,
            'bendahara' => $bendahara,
            'by' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getMataAnggaran(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin = $request->all();
        $setting = \DB::table('settinganggaran_t as st')
            ->join('pegawai_m as pg','pg.id','=','st.objectkepalabludfk')
            ->join('tahapanggaran_m as ta','ta.id','=','st.objecttahapaktivfk')
            ->select('st.*','pg.namalengkap', 'ta.tahap', 'ta.id as idtahap', 'pg.id as idpegawai')
            ->where('st.kdprofile', $idProfile)
            ->where('st.statusenabled', true)
            ->orderBy('st.tahunanggaran')
            ->get();
        return $this->respond($setting);
    }

    public function saveKegiatanAnggaran(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
       try{
            if ($request['id']==''){
                $newID = KegiatanAnggaran2024::max('id');
                $MA = new KegiatanAnggaran2024();
                $MA->id =  $newID + 1;
                $MA->kdprofile = $idProfile;
                $MA->statusenabled = true;
            }else{
                $MA= KegiatanAnggaran2024::where('id',$request['id'])
                    ->where('kdprofile', $idProfile)
                    ->first();
            }
            $MA->kode = $request['kode'];
            $MA->keterangan = $request['keterangan'];
            $MA->div = $request['div'];
            $MA->save();
            // $MA->kodeexternal = $request['kodeexternal'];
            // $MA->namaexternal = $request['namaexternal'];
            // $MA->reportdisplay = $request['reportdisplay'];
            // $MA->tahun = $request['tahun'];
            // // $MA->tahap = $request['tahap'];
            // $MA->indikatormasuk = $request['indikatormasuk'];
            // $MA->indikatorkeluaran = $request['indikatorkeluaran'];
            // $MA->indikatorhasil = $request['indikatorhasil'];
            // $MA->targetmasuk = $request['targetmasuk'];
            // $MA->targetkeluaran = $request['targetkeluaran'];
            // $MA->targethasil = $request['targethasil'];
            // $MA->objectjenisbelanjafk = $request['jenisbelanja'];
            // $MA->objectpptkfk = $request['pptk'];
            // $MA->headfk = (isset($request['headfk'])) ? $request['headfk'] : null;
            // if(isset($request['tahap'])){
            //     $KB = new KeteranganBelanja();
            //     $KB->norec = $KB->generateNewId();
            //     $KB->kdprofile = $idProfile;
            //     $KB->statusenabled = true;
            //     $KB->objectkegiatanfk = $MA->id;
            //     $KB->objecttahapfk = $request['tahap'];
            //     $KB->save();
            // }
            

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $MA,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'line'=> $e->getLine(),
                'message'=> $e->getMessage(),
                'result' => $MA,
                'as' => '@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getKegiatanAnggaran(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        // $dataLogin = $request->all();

        $div = '';
        if (isset($request['div']) && $request['div'] != "" && $request['div'] != "undefined") {
            $div =  "and div = '".$request['div']."'";
        }

        $kegiatan = DB::select(DB::raw("
            SELECT * 
            FROM kegiatananggaran2024_m 
            WHERE statusenabled = true 
            and kdprofile = $idProfile
            $div
            ORDER BY 
                (string_to_array(kode, '.'))[1]::INT,
                COALESCE((string_to_array(kode, '.'))[2]::INT, 0),
                COALESCE((string_to_array(kode, '.'))[3]::INT, 0),
                COALESCE((string_to_array(kode, '.'))[4]::INT, 0),
                COALESCE((string_to_array(kode, '.'))[5]::INT, 0),
                COALESCE((string_to_array(kode, '.'))[6]::INT, 0),
                COALESCE((string_to_array(kode, '.'))[7]::INT, 0),
                COALESCE((string_to_array(kode, '.'))[8]::INT, 0)
        "));

        // $kegiatan = DB::select(DB::raw("
        //     SELECT
        //         tag.norec,
        //         ka.kode,
        //         ka.keterangan,
        //         peg.id as idpegawai,
        //         peg.namalengkap,
        //         ta.id as idtahap,
        //         ta.tahap,
        //         tag.tahun,
        //         tag.targetmasuk as targetkinerja
        //     FROM trnsaksianggaran2024_t tag
        //     JOIN kegiatananggaran2024_m ka ON ka.id = tag.objectkegiatanfk AND ka.statusenabled = TRUE
        //     JOIN tahapanggaran_m ta ON ta.id = tag.objecttahapfk AND ta.statusenabled = TRUE
        //     LEFT JOIN pegawai_m peg ON peg.id = tag.objectpptkfk AND peg.statusenabled = TRUE 
        //     WHERE
        //         tag.statusenabled = TRUE
        //         tag.kdprofile = 30

        // "));


        $result = array(
            'kegiatan' => $kegiatan,
            'message' => 'epic',
        );

        return $this->respond($result);
    }

    public function saveRBAAnggaran(Request $request) {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
       try{
            if ($request['norec']==''){
                // $newID = TransaksiAnggaran2024::max('id');
                // $MA = new TransaksiAnggaran2024();
                $TA = new TransaksiAnggaran2024();
                $norecTA = $TA->generateNewId();
                $TA->norec = $norecTA;
                $TA->kdprofile = $idProfile;
                $TA->statusenabled = true;
            }else{
                $TA= TransaksiAnggaran2024::where('norec',$request['norec'])
                    ->where('kdprofile', $idProfile)
                    ->first();
            }
            $TA->tahun = $request['tahun'];
            $TA->objectjenisbelanjafk = $request['objectjenisbelanjafk'];
            $TA->objectpptkfk = $request['objectpptkfk'];
            $TA->objecttahapfk = $request['objecttahapfk'];
            $TA->objectkegiatanfk = $request['objectkegiatanfk'];
            $TA->save();
            

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                // 'result' => $MA,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'line'=> $e->getLine(),
                'message'=> $e->getMessage(),
                // 'result' => $MA,
                'as' => '@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getKegiatanAnggaranRBA(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        // $dataLogin = $request->all();

        $div = '';
        if (isset($request['div']) && $request['div'] != "" && $request['div'] != "undefined") {
            $div =  "and ka.div = '".$request['div']."'";
        }else{
            $div = "and ka.div = 4";
        }

        $tahap = '';
        if (isset($request['tahap']) && $request['tahap'] != "" && $request['tahap'] != "undefined") {
            $tahap =  "and ta.objecttahapfk = ".$request['tahap'];
        }
        
        $tahun = '';
        if (isset($request['tahun']) && $request['tahun'] != "" && $request['tahun'] != "undefined") {
            $tahun =  "and ta.tahun = '".$request['tahun']."'";
        }

        $pegawai = '';
        if (isset($request['pegawai']) && $request['pegawai'] != "" && $request['pegawai'] != "undefined") {
            $pegawai =  "and ta.objectpptkfk = ".$request['pegawai'];
        }

        $kegiatan = DB::select(DB::raw("
            SELECT
                ka.kode,ka.keterangan,ta.tahun,pg.id as idpptk,pg.namalengkap,jb.jenisbelanja,tp.tahap,ta.targetmasuk as targetkinerja,dk.div as namadiv,dk.id as div,ta.norec,
                ta.indikatormasuk,ta.indikatorkeluaran,ta.indikatorhasil,ta.targetmasuk,ta.targetkeluaran,ta.targethasil, ta.islock, ta.islockrba, ta.islockangkas
            FROM
                kegiatananggaran2024_m AS ka
                INNER JOIN transaksianggaran2024_t AS ta ON ta.objectkegiatanfk = ka.id AND ta.statusenabled = TRUE
                LEFT JOIN pegawai_m as pg on pg.id = ta.objectpptkfk
                LEFT JOIN jenisbelanja_m as jb on jb.id = ta.objectjenisbelanjafk
                INNER JOIN tahapanggaran_m as tp on tp.id = ta.objecttahapfk
                INNER JOIN divkegiatan2024_m as dk on dk.id = ka.div
            WHERE
                ka.statusenabled = TRUE 
                AND ka.kdprofile = $idProfile 
                -- AND ka.div = 4
                $div
                $tahap
                $tahun
                $pegawai
            ORDER BY
                ( string_to_array( ka.kode, '.' ) ) [ 1 ]:: INT,
                COALESCE ( ( string_to_array( ka.kode, '.' ) ) [ 2 ]:: INT, 0 ),
                COALESCE ( ( string_to_array( ka.kode, '.' ) ) [ 3 ]:: INT, 0 ),
                COALESCE ( ( string_to_array( ka.kode, '.' ) ) [ 4 ]:: INT, 0 ),
                COALESCE ( ( string_to_array( ka.kode, '.' ) ) [ 5 ]:: INT, 0 ),
                COALESCE ( ( string_to_array( ka.kode, '.' ) ) [ 6 ]:: INT, 0 ),
                COALESCE ( ( string_to_array( ka.kode, '.' ) ) [ 7 ]:: INT, 0 ),
                COALESCE ( ( string_to_array( ka.kode, '.' ) ) [ 8 ]:: INT, 0 )
        "));


        $result = array(
            'kegiatan' => $kegiatan,
            'message' => 'epic',
        );

        // dd($result);

        return $this->respond($result);
    }

    public function getDetailKegiatanAnggaranRBA(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        // $dataLogin = $request->all();

        $norec = '';
        if (isset($request['norec']) && $request['norec'] != "" && $request['norec'] != "undefined") {
            $norec =  "and ta.norec = '".$request['norec']."'";
        }

        $kegiatan = DB::select(DB::raw("
            SELECT
                ka0.kode as kode_urusan,
                ka0.keterangan as ket_urusan,
                ka1.kode as kode_program,
                ka1.keterangan as ket_program,
                ka2.kode as kode_kegiatan,
                ka2.keterangan as ket_kegiatan,
                ka3.kode kode_subkegiatan,
                ka3.keterangan as ket_subkegiatan,
                ka.kode as kode_subsubkegiatan,
                ka.keterangan as ket_subsubkegiatan,
                ta.objecttahapfk as idtahap
            FROM
                transaksianggaran2024_t ta
                INNER JOIN kegiatananggaran2024_m ka ON ka.ID = ta.objectkegiatanfk
                LEFT JOIN kegiatananggaran2024_m ka3 ON ka3.id = ka.headfk
                LEFT JOIN kegiatananggaran2024_m ka2 ON ka2.id = ka3.headfk 
                LEFT JOIN kegiatananggaran2024_m ka1 on ka1.id = ka2.headfk
                LEFT JOIN kegiatananggaran2024_m ka0 ON ka0.id = ka1.headfk
            WHERE
                ta.kdprofile = $idProfile
                and ta.statusenabled = true
                $norec
        "));

        $jenisbelanja = DB::select(DB::raw("
            SELECT
                *	
            FROM
                jenisbelanja_m
            WHERE
                kdprofile = $idProfile
                and statusenabled = true
        "));

        $tahap = DB::select(DB::raw("
            SELECT
                *	
            FROM
                tahapanggaran_m
            WHERE
                kdprofile = $idProfile
                and statusenabled = true
        "));


        $result = array(
            'kegiatan' => $kegiatan,
            'jenisbelanja' => $jenisbelanja,
            'tahap' => $tahap,
            'message' => 'epic',
        );

        return $this->respond($result);
    }

    public function getPPTK(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $norec = $request['norec'];
        $tahun = $request['tahun'];
        $data = DB::select(DB::raw("
                SELECT
                    ta.*,ka.*,
                    pg.namalengkap 
                FROM
                    kegiatananggaran2024_m ka
                    LEFT JOIN transaksianggaran2024_t ta on ta.objectkegiatanfk = ka.id
                    INNER JOIN pegawai_m pg ON pg.ID = ta.objectpptkfk 
                WHERE
                    ta.kdprofile = $idProfile 
                    AND ta.statusenabled = TRUE
                    and ta.norec = '$norec' and ta.tahun = '$tahun';
            ")
        );

        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }

    public function saveTransaksiAnggaran(Request $request){
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        try{

            if ($request['norec']==''){
                $TA = new TransaksiAnggaran2024();
                $norecTA = $TA->generateNewId();
                $TA->norec = $norecTA;
                $TA->kdprofile = $idProfile;
                $TA->statusenabled = true;
            }else{
                $TA= TransaksiAnggaran2024::where('norec',$request['norec'])
                    ->where('kdprofile', $idProfile)
                    ->first();
            }
            $TA->tahun = $request['tahun'];
            $TA->objecttahapfk = $request['idtahap'];
            $TA->objectjenisbelanjafk = $request['jenisbelanja'];
            $TA->objectpptkfk = $request['pptk'];
            // $TA->objectkegiatanfk = $request['div'];
            $TA->indikatormasuk = $request['indikatormasuk'];
            $TA->indikatorkeluaran = $request['indikatorkeluaran'];
            $TA->indikatorhasil = $request['indikatorhasil'];
            $TA->targetmasuk = $request['targetmasuk'];
            $TA->targetkeluaran = $request['targetkeluaran'];
            $TA->targethasil = $request['targethasil'];
            $TA->save();


            $transStatus = 'true';
        } catch (\Exception $e) {
             $transStatus = 'false';
        }
 
         if ($transStatus == 'true') {
             $transMessage = "Simpan";
             DB::commit();
             $result = array(
                 'status' => 201,
                 'message' => $transMessage,
                //  'result' => $MA,
                 'as' => '@epic',
             );
         } else {
             $transMessage = "Simpan Gagal";
             DB::rollBack();
             $result = array(
                 'status' => 400,
                 'line'=> $e->getLine(),
                 'message'=> $e->getMessage(),
                //  'result' => $MA,
                 'as' => '@epic',
             );
         }
         return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getTotalAnggaran(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $norec= $request['norec'];
        
        $mata = '';
        if(isset($request['idmataanggaran']) && $request['idmataanggaran'] != '' && $request['idmataanggaran'] != "undefined"){
            $mata = ' and ma.id = '.$request['idmataanggaran'];
        }

        $setting = DB::table('settinganggaran_t')
            ->where('statusenabled', true)
            ->where('kdprofile', $idProfile)
            ->first();

        $data = DB::select(DB::raw("
                select kt.password, kt.norec	,kt.kdprofile	,kt.statusenabled	,kt.objectkegiatanfk	,kt.objectmataanggaranfk	
                ,kt.keteranganbelanja	,kt.nourut	,kt.jml	,cast(kt.hargasatuan as float) as hargasatuan	 ,cast(kt.subtotal as float) as subtotal	,
                kt.satuan	,kt.objectasalprodukfk,ap.asalproduk ,ma.namamataanggaran,ma.kodemataanggaran, ka.kode as kodekegiatan
                from keteranganbelanja_t kt
                JOIN transaksianggaran2024_t ta ON ta.norec = kt.objecttransaksifk AND ta.statusenabled = true
                JOIN kegiatananggaran2024_m ka ON ka.id = ta.objectkegiatanfk AND ka.statusenabled = true
                INNER JOIN asalproduk_m ap on ap.id=kt.objectasalprodukfk
                INNER JOIN mataanggaran2024_m ma on ma.id=kt.objectmataanggaranfk
                where kt.objecttransaksifk= '$norec'
                $mata
                and kt.statusenabled = true
                and ma.kdprofile = $idProfile
                and ma.statusenabled = true
                order by kt.nourut
            ")
        );

        // total spj semua tahap berdasarkan rincian belanja
        // belum karena masih gunakan data lama
        foreach($data as $item){

            $item->jumlahspj = 0;

            $spj = DB::select(DB::raw("
                SELECT
                    ka.kode, ma.kodemataanggaran, ap.id AS idasalproduk, SUM(rd.subtotal) as totalspj
                FROM strukrealisasi_t sr
                JOIN realisasidetail_t rd ON rd.strukrealisasifk = sr.norec AND rd.statusenabled = TRUE AND rd.kdprofile = 30
                JOIN keteranganbelanja_t kb ON kb.norec = rd.keteranganbelanjafk AND kb.statusenabled = TRUE AND kb.kdprofile = 30
                JOIN transaksianggaran2024_t ta ON ta.norec = kb.objecttransaksifk AND ta.statusenabled = TRUE
                JOIN kegiatananggaran2024_m ka ON ka.id = ta.objectkegiatanfk AND ka.statusenabled = TRUE
                --JOIN kegiatananggaran_m ka ON ka.id = sr.objectkegiatanfk AND ka.statusenabled = TRUE
                JOIN mataanggaran_m ma ON ma.id = sr.objectmataanggaranfk AND ma.statusenabled = TRUE
                JOIN asalproduk_m ap ON ap.id = sr.objectasalprodukfk AND ap.statusenabled = TRUE
                WHERE
                    sr.statusenabled = TRUE
                    AND sr.kdprofile = 30
                    AND ta.tahun = '".$request['tahun']."'
                    AND ka.kode = '".$item->kodekegiatan."'
                    AND sr.objectmataanggaranfk = ".$item->objectmataanggaranfk."
                    AND sr.objectasalprodukfk = ".$item->objectasalprodukfk."
                    AND kb.keteranganbelanja ilike '%".$item->keteranganbelanja."%'
                GROUP BY
                    ka.kode,
                    ma.kodemataanggaran,
                    ap.id
            "));

            if(count($spj) > 0){
                foreach($spj as $itemspj){
                    $item->jumlahspj = $itemspj->totalspj;
                }
            }


        }

        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }

    public function saveKeteranganBelanja(Request $request){
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        try{

            if ($request['norec']==''){
                $TA = new KeteranganBelanja();
                $norecTA = $TA->generateNewId();
                $TA->norec = $norecTA;
                $TA->kdprofile = $idProfile;
                $TA->statusenabled = true;
            }else{
                $TA= KeteranganBelanja::where('norec',$request['norec'])
                    ->where('kdprofile', $idProfile)
                    ->first();
            }
            $TA->objectkegiatanfk = $request['objectkegiatanfk'];
            $TA->objectmataanggaranfk = $request['objectmataanggaranfk'];
            $TA->keteranganbelanja = $request['keteranganbelanja'];
            $TA->nourut = $request['nourut'];
            $TA->jml = $request['jml'];
            $TA->hargasatuan = $request['hargasatuan'];
            $TA->subtotal = $request['subtotal'];
            $TA->satuan = $request['satuan'];
            $TA->objectasalprodukfk = $request['objectasalprodukfk'];
            $TA->objecttahapfk = $request['idtahap'];
            $TA->password = $request['password'];
            $TA->objecttransaksifk = $request['objecttransaksifk'];
            $TA->save();


            $transStatus = 'true';
        } catch (\Exception $e) {
             $transStatus = 'false';
        }
 
         if ($transStatus == 'true') {
             $transMessage = "Simpan";
             DB::commit();
             $result = array(
                 'status' => 201,
                 'message' => $transMessage,
                //  'result' => $MA,
                 'as' => '@epic',
             );
         } else {
             $transMessage = "Simpan Gagal";
             DB::rollBack();
             $result = array(
                 'status' => 400,
                 'line'=> $e->getLine(),
                 'message'=> $e->getMessage(),
                //  'result' => $MA,
                 'as' => '@epic',
             );
         }
         return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getTotalAnggaranRcn(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $norec = $request['norec'];
        $data = DB::select(DB::raw("
        SELECT
            kat.norec,
            ka.keterangan,
            COALESCE ( CAST ( SUM ( kt.subtotal ) AS FLOAT ), 0 ) AS total 
        FROM
            kegiatananggaran2024_m ka
            LEFT JOIN transaksianggaran2024_t as kat on kat.objectkegiatanfk = ka.id
            INNER JOIN keteranganbelanja_t kt ON kt.objecttransaksifk = kat.norec
        WHERE
            ka.kdprofile = $idProfile 
            AND ka.statusenabled = TRUE 
            AND kt.kdprofile = $idProfile 
            AND kt.statusenabled = TRUE 
            AND kat.norec = '$norec' 
        GROUP BY
            kat.norec,
            ka.keterangan
        ")
        );

        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);
    }

    public function getTotalMataAnggaranByTransaksi(Request $request)
    {

        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $data = [];

        if($request['cek'] == 'true'){

            $mataAnggaran = DB::select(DB::raw("
                SELECT
                    ma.id as idmataanggaran,
                    ma.kodemataanggaran,
                    ma.namamataanggaran,
                    ma.kodemataanggaran || ' - ' || ma.namamataanggaran AS text,
                    SUM(kb.subtotal) AS total
                FROM keteranganbelanja_t kb
                JOIN transaksianggaran2024_t tra ON tra.norec = kb.objecttransaksifk AND tra.statusenabled = TRUE AND tra.kdprofile = ".$idProfile."
                JOIN mataanggaran2024_m ma ON ma.id = kb.objectmataanggaranfk AND ma.statusenabled = TRUE AND ma.kdprofile = ".$idProfile."
                JOIN kegiatananggaran2024_m ka ON ka.id = tra.objectkegiatanfk AND ka.statusenabled = TRUE AND ka.kdprofile = ".$idProfile."
                JOIN asalproduk_m ap ON ap.id = kb.objectasalprodukfk AND ap.statusenabled = TRUE AND ap.kdprofile = ".$idProfile."
                JOIN tahapanggaran_m ta ON ta.id = kb.objecttahapfk AND ta.statusenabled = TRUE AND ta.kdprofile = ".$idProfile."
                WHERE
                    kb.statusenabled = TRUE
                    AND kb.kdprofile = 30
                    AND kb.objecttransaksifk = '".$request['norec_transakianggaran']."'
                    AND kb.subtotal != 0
                GROUP BY
                    ma.id,
                    ma.namamataanggaran,
                    ma.kodemataanggaran
                ORDER BY
                    SPLIT_PART(ma.kodemataanggaran, '.', 1),
                    SPLIT_PART(ma.kodemataanggaran, '.', 2),
                    SPLIT_PART(ma.kodemataanggaran, '.', 3),
                    case 
                        when SPLIT_PART(ma.kodemataanggaran, '.', 5) = '' THEN cast(SPLIT_PART(ma.kodemataanggaran, '.', 4) as INTEGER)
                        else cast(SPLIT_PART(ma.kodemataanggaran, '.', 5) as INTEGER)
                    END asc
            "));

            $data = $mataAnggaran;

        }else{

            $mataAnggaran = DB::select(DB::raw("
                SELECT
                    ma.id as idmataanggaran,
                    ma.kodemataanggaran,
                    ma.namamataanggaran,
                    ma.kodemataanggaran || ' - ' || ma.namamataanggaran AS text
                FROM mataanggaran2024_m AS ma
                WHERE
                    ma.statusenabled = TRUE
                    AND ma.kdprofile = ".$idProfile."
                    AND ma.div = 4
                ORDER BY
                    SPLIT_PART(ma.kodemataanggaran, '.', 1),
                    SPLIT_PART(ma.kodemataanggaran, '.', 2),
                    SPLIT_PART(ma.kodemataanggaran, '.', 3),
                    case 
                        when SPLIT_PART(ma.kodemataanggaran, '.', 5) = '' THEN cast(SPLIT_PART(ma.kodemataanggaran, '.', 4) as INTEGER)
                        else cast(SPLIT_PART(ma.kodemataanggaran, '.', 5) as INTEGER)
                    END asc
            "));


            $keteranganBelanja = DB::select(DB::raw("
                SELECT
                    ma.id as idmataanggaran,
                    ma.kodemataanggaran,
                    ma.namamataanggaran,
                    ma.kodemataanggaran || ' - ' || ma.namamataanggaran AS text,
                    SUM(kb.subtotal) AS totalanggaran
                FROM keteranganbelanja_t kb
                JOIN transaksianggaran2024_t tra ON tra.norec = kb.objecttransaksifk AND tra.statusenabled = TRUE AND tra.kdprofile = ".$idProfile."
                JOIN mataanggaran2024_m ma ON ma.id = kb.objectmataanggaranfk AND ma.statusenabled = TRUE AND ma.kdprofile = ".$idProfile."
                JOIN kegiatananggaran2024_m ka ON ka.id = tra.objectkegiatanfk AND ka.statusenabled = TRUE AND ka.kdprofile = ".$idProfile."
                JOIN asalproduk_m ap ON ap.id = kb.objectasalprodukfk AND ap.statusenabled = TRUE AND ap.kdprofile = ".$idProfile."
                JOIN tahapanggaran_m ta ON ta.id = kb.objecttahapfk AND ta.statusenabled = TRUE AND ta.kdprofile = ".$idProfile."
                WHERE
                    kb.statusenabled = TRUE
                    AND kb.kdprofile = 30
                    AND kb.objecttransaksifk = '".$request['norec_transakianggaran']."'
                GROUP BY
                    ma.id,
                    ma.namamataanggaran,
                    ma.kodemataanggaran
                ORDER BY
                    SPLIT_PART(ma.kodemataanggaran, '.', 1),
                    SPLIT_PART(ma.kodemataanggaran, '.', 2),
                    SPLIT_PART(ma.kodemataanggaran, '.', 3),
                    case 
                        when SPLIT_PART(ma.kodemataanggaran, '.', 5) = '' THEN cast(SPLIT_PART(ma.kodemataanggaran, '.', 4) as INTEGER)
                        else cast(SPLIT_PART(ma.kodemataanggaran, '.', 5) as INTEGER)
                    END asc
            "));

            foreach($mataAnggaran AS $ma){
                
                $ma->total = 0;

                foreach($keteranganBelanja AS $kb){

                    if($kb->idmataanggaran == $ma->idmataanggaran){
                        $ma->total += (int)$kb->totalanggaran;
                    }

                }

            }

            $data = $mataAnggaran;

        }

        return $this->respond([
            'mataanggaran' => $data
        ]);

    }

    public function getSubSubKegiatanTransfer(Request $request)
    {

        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $subkegiatan = '';
        if (isset($request['subkegiatan']) && $request['subkegiatan'] != "" && $request['subkegiatan'] != "undefined") {
            $subkegiatan =  "and ka2.id = '".$request['subkegiatan']."'";
        }

        $tahap = '';
        if (isset($request['tahap']) && $request['tahap'] != "" && $request['tahap'] != "undefined") {
            $tahap =  "and ta.objecttahapfk = ".$request['tahap'];
        }

        $tahun = '';
        if (isset($request['tahunawal']) && $request['tahunawal'] != "" && $request['tahunawal'] != "undefined") {
            $tahun =  "and ta.tahun = '".$request['tahunawal']."'";
        }

        $data = DB::select(DB::raw("
        
            SELECT
                ka.id idsubsubkegiatan,
                ka.kode kodesubsubkegiatan,
                ka.keterangan keterangansubsubkegiatan,
                ta.tahun tahunsubsubkegiatan,
                ta.indikatormasuk,
                ta.indikatorkeluaran,
                ta.indikatorhasil,
                ta.targetmasuk,
                ta.targetkeluaran,
                ta.targethasil,
                ta.objectjenisbelanjafk,
                ta.objectpptkfk 
            FROM
                kegiatananggaran2024_m AS ka
                INNER JOIN kegiatananggaran2024_m AS ka2 ON ka2.id = ka.headfk AND ka2.statusenabled = TRUE
                INNER JOIN transaksianggaran2024_t ta ON ta.objectkegiatanfk = ka.id AND ta.statusenabled = TRUE
                INNER JOIN keteranganbelanja_t kb ON kb.objecttransaksifk = ta.norec AND kb.statusenabled = TRUE
                INNER JOIN mataanggaran_m ma ON ma.id = kb.objectmataanggaranfk AND ma.statusenabled = TRUE
            WHERE
                ka.kdprofile = 30
                AND ka.statusenabled = TRUE
                AND ka.div = 4 
                AND ka2.div = 3
                -- opsi
                $subkegiatan
                $tahap
                $tahun
            GROUP BY
                ka.id,
                ta.tahun,
                ta.indikatormasuk,
                ta.indikatorkeluaran,
                ta.indikatorhasil,
                ta.targetmasuk,
                ta.targetkeluaran,
                ta.targethasil,
                ta.objectjenisbelanjafk,
                ta.objectpptkfk
            ORDER BY
                CAST(SPLIT_PART(ka.kode, '.', 2) AS INTEGER) ASC,
                CAST(SPLIT_PART(ka.kode, '.', 3) AS INTEGER) ASC,
                CAST(SPLIT_PART(ka.kode, '.', 4) AS INTEGER) ASC,
                CAST(SPLIT_PART(ka.kode, '.', 5) AS INTEGER) ASC,
                CAST(SPLIT_PART(ka.kode, '.', 6) AS INTEGER) ASC,
                CAST(SPLIT_PART(ka.kode, '.', 7) AS INTEGER) ASC

        "));

        return $this->respond($data);

    }

    public function saveTransferSubSubKegiatan(Request $request)
    {

        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $details = $request['details'];
        $awal = $request['tahapawal']['id'];
        $akhir = $request['tahapakhir']['id'];
        
        try{

            foreach($details as $dt){
                
                // jika sudah ada transaksi dg kegiatan, tahap akhir, dan tahun akhir yang sama
                // maka jangan lakukan apa2 jika belum buat transaksi
                $cek = DB::select(DB::raw("
                    SELECT
                        ta.norec, ta.objectkegiatanfk, ta.objecttahapfk, 
                        ta.indikatormasuk, ta.indikatorkeluaran, ta.indikatorhasil,
                        ta.targetmasuk, ta.targetkeluaran, ta.targethasil
                    FROM transaksianggaran2024_t ta
                    JOIN kegiatananggaran2024_m ka ON ka.id = ta.objectkegiatanfk AND ka.statusenabled = TRUE AND ka.kdprofile = ".$idProfile."
                    JOIN tahapanggaran_m th ON th.id = ta.objecttahapfk AND th.statusenabled = TRUE AND th.kdprofile = ".$idProfile."
                    WHERE
                        ta.statusenabled = TRUE 
                        AND ta.kdprofile = ".$idProfile."
                        AND ta.objectkegiatanfk = ".$dt['idsubsubkegiatan']."
                        AND ta.objecttahapfk = ".$akhir."
                        AND ta.tahun = '".$request['tahunakhir']."'
                
                "));
                // $cek = DB::table('transaksianggaran2024_t ta')
                //     ->join('kegiatananggaran2024_m ka', 'ka.id', '=', 'ta.objectkegiatanfk')
                //     ->join('tahapanggaran_m th', 'th.id', '=', 'ta.objecttahapfk')
                //     ->

                if(count($cek) <= 0){

                    // ambil data transaksi tahap awal
                    $dtTransaksiAwal = DB::select(DB::raw("
                        SELECT
                            ta.*
                        FROM transaksianggaran2024_t ta
                        JOIN kegiatananggaran2024_m ka ON ka.id = ta.objectkegiatanfk AND ka.statusenabled = TRUE AND ka.kdprofile = ".$idProfile."
                        JOIN tahapanggaran_m th ON th.id = ta.objecttahapfk AND th.statusenabled = TRUE AND th.kdprofile = ".$idProfile."
                        WHERE
                            ta.statusenabled = TRUE
                            AND ta.kdprofile = ".$idProfile."
                            AND ta.tahun = '".$request['tahunawal']."'
                            AND ta.objecttahapfk = ".$awal."
                            AND ta.objectkegiatanfk = ".$dt['idsubsubkegiatan']."
                    "));

                    // buat data transaksi dengan tahap dan tahun akhir
                    $TA = new TransaksiAnggaran2024();
                    $norecTA = $TA->generateNewId();
                    $TA->norec = $norecTA;
                    $TA->kdprofile = $idProfile;
                    $TA->statusenabled = true;
                    $TA->tahun = $request['tahunakhir'];
                    $TA->indikatormasuk = $dtTransaksiAwal[0]->indikatormasuk;
                    $TA->indikatorkeluaran = $dtTransaksiAwal[0]->indikatorkeluaran;
                    $TA->indikatorhasil = $dtTransaksiAwal[0]->indikatorhasil;
                    $TA->targetmasuk = $dtTransaksiAwal[0]->targetmasuk;
                    $TA->targetkeluaran = $dtTransaksiAwal[0]->targetkeluaran;
                    $TA->targethasil = $dtTransaksiAwal[0]->targethasil;
                    $TA->objectjenisbelanjafk = $dtTransaksiAwal[0]->objectjenisbelanjafk;
                    $TA->objectpptkfk = $dtTransaksiAwal[0]->objectpptkfk;
                    $TA->norectransfer = $dtTransaksiAwal[0]->norec;
                    $TA->tgltransfer = $request['tgltransfer'];
                    $TA->objecttahapfk = $akhir;
                    $TA->objectkegiatanfk = $dtTransaksiAwal[0]->objectkegiatanfk;
                    $TA->save();

                    // ambil data keteranganbelanja tahap dan tahun awal
                    $keteranganbelanja = DB::select(DB::raw("
                        SELECT
                            kb.*
                        FROM keteranganbelanja_t kb
                        JOIN transaksianggaran2024_t ta ON ta.norec = kb.objecttransaksifk AND ta.statusenabled = TRUE AND ta.kdprofile = ".$idProfile."
                        JOIN kegiatananggaran2024_m ka ON ka.id = ta.objectkegiatanfk AND ka.statusenabled = TRUE AND ka.kdprofile = ".$idProfile."
                        JOIN mataanggaran_m ma ON ma.id = kb.objectmataanggaranfk AND ma.statusenabled = TRUE AND ma.kdprofile = ".$idProfile."
                        JOIN asalproduk_m ap ON ap.id = kb.objectasalprodukfk AND ap.statusenabled = TRUE AND ap.kdprofile = ".$idProfile."
                        WHERE
                            kb.statusenabled = TRUE
                            AND kb.kdprofile = ".$idProfile."
                            AND kb.objecttransaksifk = '".$dtTransaksiAwal[0]->norec."'
                    "));

                    //loop setiap keteranganbelanja 
                    foreach($keteranganbelanja as $kb){

                        $KB = new KeteranganBelanja();
                        $norecKS = $KB->generateNewId();
                        $KB->norec = $norecKS;
                        $KB->kdprofile = $idProfile;
                        $KB->statusenabled = true;
                        $KB->objectkegiatanfk = $dtTransaksiAwal[0]->objectkegiatanfk;
                        $KB->objectmataanggaranfk = $kb->objectmataanggaranfk;
                        $KB->keteranganbelanja = $kb->keteranganbelanja;
                        $KB->nourut = $kb->nourut;
                        $KB->jml = $kb->jml;
                        $KB->hargasatuan = $kb->hargasatuan;
                        $KB->subtotal = $kb->subtotal;
                        $KB->satuan = $kb->satuan;
                        $KB->objectasalprodukfk = $kb->objectasalprodukfk;
                        $KB->password = $kb->password;
                        $KB->objecttahapfk = $akhir;
                        $KB->tgltransfer = $request['tgltransfer'];
                        $KB->norectransfer = $kb->norec;
                        $KB->objecttransaksifk = $TA->norec;
                        $KB->save();

                    }

                }
                
            }

           $transStatus = 'true';
       } catch (\Exception $e) {
            $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'line'=> $e->getLine(),
                'message'=> $e->getMessage(),
                'as' => '@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }

    public function deleteTransaksiAnggaran(Request $request)
    {

        DB::beginTransaction();
        try{

            $kdProfile = $this->getDataKdProfile($request);
            $idProfile = (int) $kdProfile;

            foreach ($request['data'] as $req) {
                
                // false transaksianggaran
                $TA= TransaksiAnggaran2024::where('norec',$req['norec'])
                    ->where('kdprofile', $idProfile)
                    ->first();
                $TA->statusenabled = false;
                $TA->save();

                // false keteranganbelanja
                $data = DB::table('keteranganbelanja_t')->where('objecttransaksifk',$req['norec'])->update([
                    'statusenabled'=> false
                ]);
            }

           $transStatus = 'true';
       } catch (\Exception $e) {
            $transStatus = 'false';
       }

        if ($transStatus == 'true') {
            $transMessage = "Hapus Berhasil";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'line'=> $e->getLine(),
                'message'=> $e->getMessage(),
                'as' => '@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }

    public function deleteTransaksiAnggaranCentang(Request $request)
    {

        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        try{
            foreach ($request['data'] as $req) {
                
                $TA= TransaksiAnggaran2024::where('norec',$req['norec'])
                    ->where('kdprofile', $idProfile)
                    ->first();
                $TA->statusenabled = false;
                $TA->save();

                if($req['div'] == 4){

                    DB::table('keteranganbelanja_t')->where('objecttransaksifk',$req['norec'])->update([
                        'statusenabled'=> false
                    ]);
                }
            }

           $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Hapus Berhasil";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'line'=> $e->getLine(),
                'message'=> $e->getMessage(),
                'as' => '@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }

    public function getMataAnggaranPindahRincian(Request $request)
    {

        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $tahun = '';
        if (isset($request['tahun']) && $request['tahun'] != "" && $request['tahun'] != "undefined") {
            $tahun =  "and ta.tahun = '".$request['tahun']."'";
        }

        $tahap = '';
        if (isset($request['tahap']) && $request['tahap'] != "" && $request['tahap'] != "undefined") {
            $tahap =  "and ta.objecttahapfk = ".$request['tahap'];
        }

        $subsubkegiatan = '';
        if (isset($request['subsubkegiatan']) && $request['subsubkegiatan'] != "" && $request['subsubkegiatan'] != "undefined") {
            $subsubkegiatan =  "and ta.objectkegiatanfk = '".$request['subsubkegiatan']."'";
        }


        $data = DB::select(DB::raw("
        
            SELECT
                ma.*
            FROM
                kegiatananggaran2024_m AS ka
                INNER JOIN transaksianggaran2024_t ta ON ta.objectkegiatanfk = ka.id AND ta.statusenabled = TRUE AND ta.kdprofile = ".$idProfile."
                INNER JOIN keteranganbelanja_t kb ON kb.objecttransaksifk = ta.norec AND kb.statusenabled = TRUE AND kb.kdprofile = ".$idProfile."
                INNER JOIN mataanggaran_m ma ON ma.id = kb.objectmataanggaranfk AND ma.statusenabled = TRUE AND ma.kdprofile = ".$idProfile."
            WHERE
                ka.kdprofile = ".$idProfile."
                AND ka.statusenabled = TRUE
                -- opsi
                $tahun
                $tahap
                $subsubkegiatan
            GROUP BY
                ma.id
            ORDER BY
                SPLIT_PART(ma.kodemataanggaran, '.', 1),
                SPLIT_PART(ma.kodemataanggaran, '.', 2),
                SPLIT_PART(ma.kodemataanggaran, '.', 3),
                case 
                    when SPLIT_PART(ma.kodemataanggaran, '.', 5) = '' THEN cast(SPLIT_PART(ma.kodemataanggaran, '.', 4) as INTEGER)
                    else cast(SPLIT_PART(ma.kodemataanggaran, '.', 5) as INTEGER)
                END asc

        "));

        return $this->respond($data);

    }

    public function getKeteranganBelanjaPindahRincian(Request $request)
    {

        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $tahun = '';
        if (isset($request['tahun']) && $request['tahun'] != "" && $request['tahun'] != "undefined") {
            $tahun =  "and ta.tahun = '".$request['tahun']."'";
        }

        $tahap = '';
        if (isset($request['tahap']) && $request['tahap'] != "" && $request['tahap'] != "undefined") {
            $tahap =  "and ta.objecttahapfk = ".$request['tahap'];
        }

        $subsubkegiatan = '';
        if (isset($request['subsubkegiatan']) && $request['subsubkegiatan'] != "" && $request['subsubkegiatan'] != "undefined") {
            $subsubkegiatan =  "and ta.objectkegiatanfk = ".$request['subsubkegiatan'];
        }

        $mataanggaran = '';
        if (isset($request['mataanggaran']) && $request['mataanggaran'] != "" && $request['mataanggaran'] != "undefined") {
            $mataanggaran =  "and kb.objectmataanggaranfk = ".$request['mataanggaran'];
        }


        $data = DB::select(DB::raw("
        
            SELECT
                kb.norec, kb.keteranganbelanja
            FROM
                kegiatananggaran2024_m AS ka
                INNER JOIN transaksianggaran2024_t ta ON ta.objectkegiatanfk = ka.id AND ta.statusenabled = TRUE AND ta.kdprofile = ".$idProfile."
                INNER JOIN keteranganbelanja_t kb ON kb.objecttransaksifk = ta.norec AND kb.statusenabled = TRUE AND kb.kdprofile = ".$idProfile."
                INNER JOIN mataanggaran_m ma ON ma.id = kb.objectmataanggaranfk AND ma.statusenabled = TRUE AND ma.kdprofile = ".$idProfile."
            WHERE
                ka.kdprofile = ".$idProfile."
                AND ka.statusenabled = TRUE
                -- opsi
                $tahun
                $tahap
                $subsubkegiatan
                $mataanggaran
            ORDER BY
                SPLIT_PART(ma.kodemataanggaran, '.', 1),
                SPLIT_PART(ma.kodemataanggaran, '.', 2),
                SPLIT_PART(ma.kodemataanggaran, '.', 3),
                case 
                    when SPLIT_PART(ma.kodemataanggaran, '.', 5) = '' THEN cast(SPLIT_PART(ma.kodemataanggaran, '.', 4) as INTEGER)
                    else cast(SPLIT_PART(ma.kodemataanggaran, '.', 5) as INTEGER)
                END asc

        "));

        return $this->respond($data);
    }

    public function getSPJ(Request $request)
    {

        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];

        $setting = \DB::table('settinganggaran_t as st')
            ->join('pegawai_m as pg','pg.id','=','st.objectkepalabludfk')
            ->join('tahapanggaran_m as ta','ta.id','=','st.objecttahapaktivfk')
            ->select('st.*','pg.namalengkap', 'ta.tahap', 'ta.id as idtahap', 'pg.id as idpegawai')
            ->where('st.kdprofile', $idProfile)
            ->where('st.statusenabled', true)
            ->orderBy('st.tahunanggaran')
            ->get();


        $pegawai = '';
        if(isset($request['idpegawai']) && $request['idpegawai'] != "undefined" && $request['idpegawai'] != ''){
            $pegawai = "and ta.objectpptkfk = ".$request['idpegawai'];
        }

        $status = '';
        if(isset($request['status']) && $request['status'] != "undefined" && $request['status'] != '' && $request['status'] == 0){
            $status = "";
        } else if(isset($request['status']) && $request['status'] != "undefined" && $request['status'] != '' && $request['status'] == 1){
            $status = "and (sr.status is null or sr.status = 'Belum Diverifikasi')";
        } else if(isset($request['status']) && $request['status'] != "undefined" && $request['status'] != '' && $request['status'] == 2){
            $status = "and sr.status = 'Revisi'";
        } else if(isset($request['status']) && $request['status'] != "undefined" && $request['status'] != '' && $request['status'] == 3){
            $status = "and sr.status = 'Sudah Diverifikasi'";
        }

        $data = DB::select(DB::raw("

            SELECT
                string_agg ( DISTINCT rd.uraian, ',' ) uraian,
                sr.*,
                cbs.carabayar,
                ta.tahun,
                pg1.namalengkap AS bendahara,
                pg2.namalengkap AS penerima,
                rkn.namarekanan AS pihakketiga,
                ka.kode || ' - ' || ka.keterangan AS kegiatan,
                ma.kodemataanggaran || ' - ' || ma.namamataanggaran AS mataanggaran,
                ma.kodemataanggaran,
                ma.namamataanggaran,
                ka.keterangan subsubkegiatan,
                ka.id idsubsubkegiatan,
                ka2.id idsubkegiatan,
                ka2.keterangan keterangansubkegiatan,
                ap.id idasalproduk,
                ap.asalproduk
            FROM
                strukrealisasi_t sr
                INNER JOIN realisasidetail_t rd ON rd.strukrealisasifk = sr.norec AND rd.statusenabled = TRUE AND rd.kdprofile = ".$idProfile."
                JOIN kegiatananggaran2024_m ka ON ka.id = sr.objectkegiatanfk AND ka.statusenabled = TRUE AND ka.kdprofile = ".$idProfile." 
                JOIN kegiatananggaran2024_m ka2 ON ka2.id = ka.headfk AND ka2.statusenabled = TRUE AND ka2.kdprofile = ".$idProfile."
                JOIN transaksianggaran2024_t ta ON ta.objectkegiatanfk = ka.id AND ta.statusenabled = TRUE AND ta.kdprofile = ".$idProfile."
                JOIN mataanggaran_m ma ON ma.id = sr.objectmataanggaranfk AND ma.statusenabled = TRUE AND ma.kdprofile = ".$idProfile."
                JOIN asalproduk_m ap ON ap.id = sr.objectasalprodukfk
                LEFT JOIN rekanan_m rkn ON rkn.id = sr.rekananfk
                LEFT JOIN pegawai_m AS pg1 ON pg1.id = sr.bendaharafk
                LEFT JOIN pegawai_m AS pg2 ON pg2.id = sr.penerimafk
                LEFT JOIN carabayarspj_m cbs ON cbs.id = sr.objectcarabayarfk
            WHERE 
                sr.statusenabled = TRUE
                AND sr.kdprofile = ".$idProfile."
                AND ta.tahun = '".$setting[0]->tahunanggaran."'
                AND sr.tglrealisasi between '$tglAwal' and '$tglAkhir'
                $pegawai
                $status
            GROUP BY
                sr.norec,
                cbs.carabayar,
                pg1.namalengkap,
                pg2.namalengkap,
                rkn.namarekanan,
                ta.tahun,
                ka.id,
                ka2.id,
                ka2.keterangan,
                ma.id,
                ap.id
            ORDER BY
                sr.norealisasi DESC
        
        "));

        $dataDetail = DB::select(DB::raw("
            select 
                rd.*,ka.keteranganbelanja,0 as nourut
            from strukrealisasi_t sr
            inner join realisasidetail_t rd on rd.strukrealisasifk = sr.norec
            INNER JOIN keteranganbelanja_t ka on ka.norec=rd.keteranganbelanjafk
            where  rd.statusenabled = true
                and rd.kdprofile = 30
                and ka.statusenabled = true
                and ka.kdprofile = 30
                and sr.tglrealisasi between  '$tglAwal' and '$tglAkhir'
        "));

        $result = [];
        foreach($data as $item){
            $dataDetail1 =[];
            
            foreach($dataDetail as $detail){
                if($item->norec == $detail->strukrealisasifk){
                    $dataDetail1[]=array(
                        'norec'=> $detail->norec,
                        'kdprofile'	=> $detail->kdprofile,
                        'statusenabled'	=> $detail->statusenabled,
                        'strukrealisasifk'	=> $detail->strukrealisasifk,
                        'uraian'	=> $detail->uraian,
                        'jml'	=> $detail->jml,
                        'satuan'	=> $detail->satuan,
                        'harga'	=> $detail->harga,
                        'subtotal'	=> $detail->subtotal,
                        'keteranganbelanjafk'	=> $detail->keteranganbelanjafk,
                        'keteranganbelanja'	=> $detail->keteranganbelanja,
                        'nourut'	=> $detail->nourut
                    );
                }

            }

            $result[] = array(
                'strukrealisasifk' => $item->norec,
                'data' => $dataDetail1,
            );

        }

        $response = [
            'data' => $data,
            'detail' => $result,
            'message' => '@epic',
        ];

        return $this->respond($response);
    }

    public function getSubSubKegiatan(Request $request)
    {

        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $setting = \DB::table('settinganggaran_t as st')
            ->join('pegawai_m as pg','pg.id','=','st.objectkepalabludfk')
            ->join('tahapanggaran_m as ta','ta.id','=','st.objecttahapaktivfk')
            ->select('st.*','pg.namalengkap', 'ta.tahap', 'ta.id as idtahap', 'pg.id as idpegawai')
            ->where('st.kdprofile', $idProfile)
            ->where('st.statusenabled', true)
            ->orderBy('st.tahunanggaran')
            ->get();


        $subkegiatan = '';
        if (isset($request['subkegiatan']) && $request['subkegiatan'] != "" && $request['subkegiatan'] != "undefined") {
            $subkegiatan =  "and ka.headfk = ".$request['subkegiatan'];
        }

        $ispj = false;
        $cariPegawai = null;
        if(isset($request['idpegawai']) && $request['idpegawai'] !== '' && $request['idpegawai'] !== "undefined"){
            $cariPegawai = DB::table('pegawai_m')
                ->where('statusenabled', true)
                ->where('id', $request['idpegawai'])
                ->first();
            
            if($cariPegawai){
                $ispj = $cariPegawai->ispj;
            }
        }

        $pptk = '';
        if($ispj == true && $cariPegawai){
            $pptk = "and ta.objectpptkfk = ".$cariPegawai->id;
        }

        $data = DB::select(DB::raw("

            SELECT
                ka.id,
                ka.kode || ' - ' || ka.keterangan as keterangan,
                ka.kode as kodekegiatan,
                ka.keterangan as namakegiatan
            FROM kegiatananggaran2024_m ka
            JOIN transaksianggaran2024_t ta ON ta.objectkegiatanfk = ka.id AND ta.statusenabled = TRUE AND ta.kdprofile = ".$idProfile."
            JOIN keteranganbelanja_t kb ON kb.objecttransaksifk = ta.norec AND kb.statusenabled = TRUE AND kb.kdprofile = ".$idProfile."
            JOIN mataanggaran_m ma ON ma.id = kb.objectmataanggaranfk AND ma.statusenabled = TRUE AND ma.kdprofile = ".$idProfile."
            WHERE
                ka.statusenabled = TRUE
                AND ka.kdprofile = ".$idProfile."
                AND ta.tahun = '".$setting[0]->tahunanggaran."'
                AND ta.objecttahapfk = ".$setting[0]->objecttahapaktivfk."
                $subkegiatan
                $pptk
            GROUP BY
                ka.id
            ORDER BY
                CAST(SPLIT_PART(ka.kode, '.', 2) AS INTEGER) ASC,
                CAST(SPLIT_PART(ka.kode, '.', 3) AS INTEGER) ASC,
                CAST(SPLIT_PART(ka.kode, '.', 4) AS INTEGER) ASC,
                CAST(SPLIT_PART(ka.kode, '.', 5) AS INTEGER) ASC,
                CAST(SPLIT_PART(ka.kode, '.', 6) AS INTEGER) ASC,
                CAST(SPLIT_PART(ka.kode, '.', 7) AS INTEGER) ASC
        "));

        return $this->respond($data);

    }

    public function getMataAnggaranBySubSubKegiatan(Request $request)
    {

        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $setting = \DB::table('settinganggaran_t as st')
            ->join('pegawai_m as pg','pg.id','=','st.objectkepalabludfk')
            ->join('tahapanggaran_m as ta','ta.id','=','st.objecttahapaktivfk')
            ->select('st.*','pg.namalengkap', 'ta.tahap', 'ta.id as idtahap', 'pg.id as idpegawai')
            ->where('st.kdprofile', $idProfile)
            ->where('st.statusenabled', true)
            ->orderBy('st.tahunanggaran')
            ->get();


        $subsubkegiatan = '';
        if (isset($request['subsubkegiatan']) && $request['subsubkegiatan'] != "" && $request['subsubkegiatan'] != "undefined") {
            $subsubkegiatan =  "and ta.objectkegiatanfk = ".$request['subsubkegiatan'];
        }

        $data = DB::select(DB::raw("

            SELECT
                ma.id,
                ma.kodemataanggaran,
                ma.namamataanggaran,
                ma.kodemataanggaran || ' - ' || ma.namamataanggaran as text
            FROM kegiatananggaran2024_m ka
            JOIN transaksianggaran2024_t ta ON ta.objectkegiatanfk = ka.id AND ta.statusenabled = TRUE AND ta.kdprofile = ".$idProfile."
            JOIN keteranganbelanja_t kb ON kb.objecttransaksifk = ta.norec AND kb.statusenabled = TRUE AND kb.kdprofile = ".$idProfile."
            JOIN mataanggaran_m ma ON ma.id = kb.objectmataanggaranfk AND ma.statusenabled = TRUE AND ma.kdprofile = ".$idProfile."
            WHERE
                ka.statusenabled = TRUE
                AND ka.kdprofile = ".$idProfile."
                AND ta.tahun = '".$setting[0]->tahunanggaran."'
                AND ta.objecttahapfk = ".$setting[0]->objecttahapaktivfk."
                $subsubkegiatan
            GROUP BY
                ma.id
            ORDER BY
                SPLIT_PART(ma.kodemataanggaran, '.', 1),
                SPLIT_PART(ma.kodemataanggaran, '.', 2),
                SPLIT_PART(ma.kodemataanggaran, '.', 3),
                case 
                    when SPLIT_PART(ma.kodemataanggaran, '.', 5) = '' THEN cast(SPLIT_PART(ma.kodemataanggaran, '.', 4) as INTEGER)
                    else cast(SPLIT_PART(ma.kodemataanggaran, '.', 5) as INTEGER)
                END asc
        "));

        return $this->respond($data);

    }

    public function getTotalSisaAnggaran(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $setting = \DB::table('settinganggaran_t as st')
            ->join('pegawai_m as pg','pg.id','=','st.objectkepalabludfk')
            ->join('tahapanggaran_m as ta','ta.id','=','st.objecttahapaktivfk')
            ->select('st.*','pg.namalengkap', 'ta.tahap', 'ta.id as idtahap', 'pg.id as idpegawai')
            ->where('st.kdprofile', $idProfile)
            ->where('st.statusenabled', true)
            ->orderBy('st.tahunanggaran')
            ->get();

        $subsubkegiatan = '';
        if (isset($request['subsubkegiatan']) && $request['subsubkegiatan'] != "" && $request['subsubkegiatan'] != "undefined") {
            $subsubkegiatan =  "and ta.objectkegiatanfk = ".$request['subsubkegiatan'];
        }

        $mataanggaran = '';
        if (isset($request['mataanggaran']) && $request['mataanggaran'] != "" && $request['mataanggaran'] != "undefined") {
            $mataanggaran =  "and kb.objectmataanggaranfk = ".$request['mataanggaran'];
        }

        $asalproduk = '';
        if (isset($request['asalproduk']) && $request['asalproduk'] != "" && $request['asalproduk'] != "undefined") {
            $asalproduk =  "and kb.objectasalprodukfk = ".$request['asalproduk'];
        }

        $data = DB::select(DB::raw("

            SELECT
                COALESCE(SUM(x.totalanggaran), 0) as totalanggaran,
                COALESCE(SUM(x.totalspj), 0) as totalspj,
                (COALESCE(SUM(x.jumlahpanjar), 0) - COALESCE(SUM(x.totalpengembalianpanjar), 0)) - COALESCE(SUM(x.totalspjpanjar), 0) as totalpanjar,
                COALESCE(SUM(x.totalanggaran), 0) - ( COALESCE(SUM(x.totalspj), 0) + ( (COALESCE(SUM(x.jumlahpanjar), 0) - COALESCE(SUM(x.totalpengembalianpanjar), 0)) - COALESCE(SUM(x.totalspjpanjar), 0) ) ) as sisa
            FROM (
                SELECT
                    COALESCE(SUM(kb.subtotal), 0) as totalanggaran,
                    0 as totalspj,
                    0 as totalspjpanjar,
                    0 as totalpengembalianpanjar,
                    0 as jumlahpanjar
                FROM keteranganbelanja_t kb 
                JOIN transaksianggaran2024_t ta ON ta.norec = kb.objecttransaksifk AND ta.statusenabled = TRUE AND ta.kdprofile = ".$idProfile."
                JOIN kegiatananggaran2024_m ka ON ka.id = ta.objectkegiatanfk AND ka.statusenabled = TRUE AND ka.kdprofile = ".$idProfile."
                JOIN mataanggaran_m ma ON ma.id = kb.objectmataanggaranfk AND ma.statusenabled = TRUE AND ma.kdprofile = ".$idProfile."
                JOIN tahapanggaran_m th ON th.id = kb.objecttahapfk AND th.statusenabled = TRUE AND th.kdprofile = ".$idProfile."
                JOIN asalproduk_m ap ON ap.id = kb.objectasalprodukfk AND ap.statusenabled = TRUE AND ap.kdprofile = ".$idProfile."
                WHERE
                    kb.statusenabled = TRUE
                    AND kb.kdprofile = ".$idProfile."
                    AND ta.tahun = '".$setting[0]->tahunanggaran."'
                    AND kb.objecttahapfk = ".$setting[0]->objecttahapaktivfk."
                    $subsubkegiatan
                    $mataanggaran
                    $asalproduk

                UNION 

                SELECT
                    0 as totalanggaran,
                    COALESCE(SUM(rd.subtotal), 0) as totalspj,
                    COALESCE(SUM(stp.jumlahspj), 0) as totalspjpanjar,
                    COALESCE(SUM(pengpj.jumlahpengembalian), 0) as totalpengembalianpanjar,
                    COALESCE(SUM(pj.jumlah), 0) as jumlahpanjar
                FROM keteranganbelanja_t kb 
                JOIN transaksianggaran2024_t ta ON ta.norec = kb.objecttransaksifk AND ta.statusenabled = TRUE AND ta.kdprofile = ".$idProfile."
                JOIN kegiatananggaran2024_m ka ON ka.id = ta.objectkegiatanfk AND ka.statusenabled = TRUE AND ka.kdprofile = ".$idProfile."
                JOIN mataanggaran_m ma ON ma.id = kb.objectmataanggaranfk AND ma.statusenabled = TRUE AND ma.kdprofile = ".$idProfile."
                JOIN tahapanggaran_m th ON th.id = kb.objecttahapfk AND th.statusenabled = TRUE AND th.kdprofile = ".$idProfile."
                JOIN asalproduk_m ap ON ap.id = kb.objectasalprodukfk AND ap.statusenabled = TRUE AND ap.kdprofile = ".$idProfile."
                LEFT JOIN realisasidetail_t rd ON rd.keteranganbelanjafk = kb.norec AND rd.statusenabled = TRUE AND rd.kdprofile = ".$idProfile."
                LEFT JOIN strukrealisasi_t sr ON sr.norec = rd.strukrealisasifk AND sr.statusenabled = TRUE AND rd.kdprofile = ".$idProfile."
                LEFT JOIN spjtopanjar_t stp ON stp.objectspjfk = sr.norec AND stp.statusenabled = TRUE AND stp.kdprofile = ".$idProfile."
                LEFT JOIN panjar_t pj ON pj.norec = stp.objectpanjarfk AND pj.statusenabled = TRUE AND pj.kdprofile = ".$idProfile."
                LEFT JOIN pengembalianpanjar_t pengpj ON pengpj.objectpanjarfk = pj.norec AND pengpj.statusenabled = TRUE AND pengpj.kdprofile = ".$idProfile."
                WHERE
                    kb.statusenabled = TRUE
                    AND kb.kdprofile = ".$idProfile."
                    AND ta.tahun = '".$setting[0]->tahunanggaran."'
                    $subsubkegiatan
                    $mataanggaran
                    $asalproduk
            ) as x

        "));

        return $this->respond($data);
    }

    public function getPanjar(Request $request)
    {

        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $subsubkegiatan = '';
        if (isset($request['subsubkegiatan']) && $request['subsubkegiatan'] != "" && $request['subsubkegiatan'] != "undefined") {
            $subsubkegiatan =  "and pj.objectsubsubkegiatanfk = ".$request['subsubkegiatan'];
        }

        $mataanggaran = '';
        if (isset($request['mataanggaran']) && $request['mataanggaran'] != "" && $request['mataanggaran'] != "undefined") {
            $mataanggaran =  "and pj.objectmataanggaranfk = ".$request['mataanggaran'];
        }

        $asalproduk = '';
        if (isset($request['asalproduk']) && $request['asalproduk'] != "" && $request['asalproduk'] != "undefined") {
            $asalproduk =  "and pj.objectasalprodukfk = ".$request['asalproduk'];
        }

        $setting = \DB::table('settinganggaran_t as st')
            ->join('pegawai_m as pg','pg.id','=','st.objectkepalabludfk')
            ->join('tahapanggaran_m as ta','ta.id','=','st.objecttahapaktivfk')
            ->select('st.*','pg.namalengkap', 'ta.tahap', 'ta.id as idtahap', 'pg.id as idpegawai')
            ->where('st.kdprofile', $idProfile)
            ->where('st.statusenabled', true)
            ->orderBy('st.tahunanggaran')
            ->get();

        $data = DB::select(DB::raw("
            SELECT 
                pj.norec norecpanjar, 
                ma.id idmataanggaran, ma.kodemataanggaran, ma.kodemataanggaran || ' - ' || ma.namamataanggaran AS rekening, 
                ka.id idsubsubkegiatan, 
                ka.keterangan subsubkegiatan, 
                pj.nopanjar, pj.uraian, pj.tglpanjar, pj.jumlah, pj.jenispanjar, pj.jumlahpengembalian, pj.sumberpanjar
            FROM panjar_t pj
            INNER JOIN mataanggaran_m ma on ma.id = pj.objectmataanggaranfk AND ma.statusenabled = TRUE AND ma.kdprofile = ".$idProfile."
            INNER JOIN kegiatananggaran2024_m ka on ka.id = pj.objectsubsubkegiatanfk AND ka.statusenabled = TRUE AND ka.kdprofile = ".$idProfile."
            INNER JOIN transaksianggaran2024_t ta ON ta.objectkegiatanfk = ka.id AND ta.statusenabled = TRUE AND ta.kdprofile = ".$idProfile."
            INNER JOIN asalproduk_m ap ON ap.id = pj.objectasalprodukfk AND ap.statusenabled = TRUE AND ap.kdprofile = ".$idProfile."
            where pj.kdprofile = 30
                and pj.statusenabled = true
                and ta.tahun = '".$setting[0]->tahunanggaran."'
                $subsubkegiatan
                $mataanggaran
                $asalproduk
            ORDER BY cast(split_part(nopanjar, '/', 1)  as integer) desc
        "));


        return $this->respond($data);
    }

    public function getSisaRincianAnggaran(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $setting = \DB::table('settinganggaran_t as st')
            ->join('pegawai_m as pg','pg.id','=','st.objectkepalabludfk')
            ->join('tahapanggaran_m as ta','ta.id','=','st.objecttahapaktivfk')
            ->select('st.*','pg.namalengkap', 'ta.tahap', 'ta.id as idtahap', 'pg.id as idpegawai')
            ->where('st.kdprofile', $idProfile)
            ->where('st.statusenabled', true)
            ->orderBy('st.tahunanggaran')
            ->get();

        $keterangan = DB::select(DB::raw("
            SELECT
                kb.*, 
                ta.objectkegiatanfk, ka.keterangan,
                kb.objectmataanggaranfk, ma.namamataanggaran
            FROM keteranganbelanja_t kb 
            JOIN transaksianggaran2024_t ta ON ta.norec = kb.objecttransaksifk AND ta.statusenabled = TRUE AND ta.kdprofile = ".$idProfile."
            JOIN kegiatananggaran2024_m ka ON ka.id = ta.objectkegiatanfk AND ka.statusenabled = TRUE AND ka.kdprofile = ".$idProfile."
            JOIN mataanggaran_m ma ON ma.id = kb.objectmataanggaranfk AND ma.statusenabled = TRUE AND ma.kdprofile = ".$idProfile."
            JOIN tahapanggaran_m th ON th.id = kb.objecttahapfk AND th.statusenabled = TRUE AND th.kdprofile = ".$idProfile."
            JOIN asalproduk_m ap ON ap.id = kb.objectasalprodukfk AND ap.statusenabled = TRUE AND ap.kdprofile = ".$idProfile."
            WHERE
                kb.statusenabled = TRUE
                AND kb.kdprofile = ".$idProfile."
                AND kb.norec = '".$request['norec']."'
        "));

        $spj = DB::select(DB::raw("
            SELECT
                COALESCE(SUM(rd.subtotal), 0) as totalspj    
            FROM keteranganbelanja_t kb 
            JOIN transaksianggaran2024_t ta ON ta.norec = kb.objecttransaksifk AND ta.statusenabled = TRUE AND ta.kdprofile = ".$idProfile."
            JOIN kegiatananggaran2024_m ka ON ka.id = ta.objectkegiatanfk AND ka.statusenabled = TRUE AND ka.kdprofile = ".$idProfile."
            JOIN mataanggaran_m ma ON ma.id = kb.objectmataanggaranfk AND ma.statusenabled = TRUE AND ma.kdprofile = ".$idProfile."
            JOIN tahapanggaran_m th ON th.id = kb.objecttahapfk AND th.statusenabled = TRUE AND th.kdprofile = ".$idProfile."
            JOIN asalproduk_m ap ON ap.id = kb.objectasalprodukfk AND ap.statusenabled = TRUE AND ap.kdprofile = ".$idProfile."
            LEFT JOIN realisasidetail_t rd ON rd.keteranganbelanjafk = kb.norec AND rd.statusenabled = TRUE AND rd.kdprofile = ".$idProfile."
            LEFT JOIN strukrealisasi_t sr ON sr.norec = rd.strukrealisasifk AND sr.statusenabled = TRUE AND rd.kdprofile = ".$idProfile."
            WHERE
                kb.statusenabled = TRUE
                AND kb.kdprofile = ".$idProfile."
                AND ta.tahun = '".$setting[0]->tahunanggaran."'
                AND ta.objectkegiatanfk = ".$keterangan[0]->objectkegiatanfk."
                AND kb.objectmataanggaranfk = ".$keterangan[0]->objectmataanggaranfk."
                AND kb.keteranganbelanja ilike '%".$keterangan[0]->keteranganbelanja."%'
        "));

        $result = array(
            // 'data' => $data,
            // 'sisa' => $sisa,
            'keterangan' => $keterangan[0],
            'sisa' => $spj[0]->totalspj,
            'message' => '@epic',
        );

        return $this->respond($result);

    }

    public function getRincianAnggaran(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $setting = \DB::table('settinganggaran_t as st')
            ->join('pegawai_m as pg','pg.id','=','st.objectkepalabludfk')
            ->join('tahapanggaran_m as ta','ta.id','=','st.objecttahapaktivfk')
            ->select('st.*','pg.namalengkap', 'ta.tahap', 'ta.id as idtahap', 'pg.id as idpegawai')
            ->where('st.kdprofile', $idProfile)
            ->where('st.statusenabled', true)
            ->orderBy('st.tahunanggaran')
            ->get();

        $subsubkegiatan = '';
        if (isset($request['subsubkegiatan']) && $request['subsubkegiatan'] != "" && $request['subsubkegiatan'] != "undefined") {
            $subsubkegiatan =  "and ta.objectkegiatanfk = ".$request['subsubkegiatan'];
        }

        $mataanggaran = '';
        if (isset($request['mataanggaran']) && $request['mataanggaran'] != "" && $request['mataanggaran'] != "undefined") {
            $mataanggaran =  "and kb.objectmataanggaranfk = ".$request['mataanggaran'];
        }

        $asalproduk = '';
        if (isset($request['asalproduk']) && $request['asalproduk'] != "" && $request['asalproduk'] != "undefined") {
            $asalproduk =  "and kb.objectasalprodukfk = ".$request['asalproduk'];
        }
        
        $data = DB::select(DB::raw("
            SELECT
                kb.*
            FROM keteranganbelanja_t kb 
            JOIN transaksianggaran2024_t ta ON ta.norec = kb.objecttransaksifk AND ta.statusenabled = TRUE AND ta.kdprofile = ".$idProfile."
            JOIN kegiatananggaran2024_m ka ON ka.id = ta.objectkegiatanfk AND ka.statusenabled = TRUE AND ka.kdprofile = ".$idProfile."
            JOIN mataanggaran_m ma ON ma.id = kb.objectmataanggaranfk AND ma.statusenabled = TRUE AND ma.kdprofile = ".$idProfile."
            JOIN tahapanggaran_m th ON th.id = kb.objecttahapfk AND th.statusenabled = TRUE AND th.kdprofile = ".$idProfile."
            JOIN asalproduk_m ap ON ap.id = kb.objectasalprodukfk AND ap.statusenabled = TRUE AND ap.kdprofile = ".$idProfile."
            WHERE
                kb.statusenabled = TRUE
                AND kb.kdprofile = ".$idProfile."
                AND ta.tahun = '".$setting[0]->tahunanggaran."'
                AND ta.objecttahapfk = ".$setting[0]->objecttahapaktivfk."
                $subsubkegiatan
                $mataanggaran
                $asalproduk
        "));
        
        return $this->respond($data);
    }

    public function simpanSPJ(Request $request)
    {

        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $dataRealisasiDetail = [];
        $thn = date("Y", strtotime($request['tglrealisasi']) );
        $jumlahall = $request['totalbelanja'];
        $jumlahsimpan = 0;
        $ceksisapanjar = 'gak ada';

       try{
            $KM= MataAnggaran::where('kodemataanggaran',$request['objectmataanggaranfk'])
                ->where('statusenabled',true)
                ->first();

            $setting = \DB::table('settinganggaran_t as st')
                ->join('pegawai_m as pg','pg.id','=','st.objectkepalabludfk')
                ->join('tahapanggaran_m as ta','ta.id','=','st.objecttahapaktivfk')
                ->select('st.*','pg.namalengkap', 'ta.tahap', 'ta.id as idtahap', 'pg.id as idpegawai')
                ->where('st.kdprofile', $idProfile)
                ->where('st.statusenabled', true)
                ->orderBy('st.tahunanggaran')
                ->get();

            if ($request['norec']==''){

                $MA = new StrukRealisasi();
                $norecKS = $MA->generateNewId();
                $MA->norec = $norecKS;
                $MA->kdprofile = $idProfile;
                $MA->statusenabled = true;

                // $nos = $this->generateCodeBySeqTable(new StrukRealisasi, 'norealisasi', 6, ' ',$kdProfile);
                $runningNumber = RunningNumber::where('id',13540)->first();

                // cek dulu apakah data spj di tahun setting anggaran yang aktif
                $cekSPJ = DB::select(DB::raw("
                    SELECT
                        sr.*
                    FROM strukrealisasi_t sr 
                    JOIN realisasidetail_t rd ON rd.strukrealisasifk = sr.norec AND rd.statusenabled = true AND rd.kdprofile = ".$idProfile."
                    JOIN keteranganbelanja_t kb ON kb.norec = rd.keteranganbelanjafk AND kb.statusenabled = TRUE AND kb.kdprofile = ".$idProfile."
                    JOIN transaksianggaran2024_t ta ON ta.norec = kb.objecttransaksifk AND ta.statusenabled = TRUE AND ta.kdprofile = ".$idProfile."
                    JOIN kegiatananggaran2024_m ka ON ka.id = ta.objectkegiatanfk AND ka.statusenabled = TRUE AND ka.kdprofile = ".$idProfile."
                    JOIN mataanggaran_m ma ON ma.id = sr.objectmataanggaranfk AND ma.statusenabled = TRUE AND ma.kdprofile = ".$idProfile."
                    JOIN asalproduk_m ap ON ap.id = sr.objectasalprodukfk AND ap.statusenabled = TRUE AND ap.kdprofile = ".$idProfile."
                    WHERE
                        sr.statusenabled = TRUE
                        AND sr.kdprofile = ".$idProfile."
                        AND ta.tahun = '".$setting[0]->tahunanggaran."'
                    GROUP BY
                        sr.norec
                "));

                $nos = 0;
                if(count($cekSPJ) <= 0){

                    $nomor = 1;
                    $nos = str_pad((int)$nomor, 5, "0", STR_PAD_LEFT);

                    RunningNumber::where('id', 13540)
                        ->update(
                            [
                                'nomer_terbaru' => $nos
                            ]
                        );
                }else{
                    // $nomor = $runningNumber->nomer_terbaru +1;
                    // $nos = str_pad((int)$nomor, 5, "0", STR_PAD_LEFT);
                    $nomor = count($cekSPJ) + 1;
                    $nos = str_pad((int)$nomor, 5, "0", STR_PAD_LEFT);

                    RunningNumber::where('id', 13540)
                        ->update(
                            [
                                'nomer_terbaru' => $nos
                            ]
                        );
                }

                $noRealiasi = $nos.'/BPK/UP/1.02.2.22.0.00.01.0004/B02/'.$thn;
                $MA->norealisasi = $noRealiasi;
            }else{
                $MA= StrukRealisasi::where('norec',$request['norec'])
                    ->where('kdprofile', $idProfile)
                    ->first();
                    
                $jumlahall = (float)$request['totalbelanja'] - (float)$MA->totalbelanja;
            }

            if(isset($request['norealisasi'])){
                $MA->norealisasi = $request['norealisasi'];
            }
            $MA->tglrealisasi = $request['tglrealisasi'];
            $MA->status = null;//$request['status'];
            $MA->totalbelanja = $request['totalbelanja'];
            $MA->rekananfk = $request['rekananfk'];
            $MA->deskripsi = $request['deskripsi'];
            $MA->objectkegiatanfk = $request['objectkegiatanfk'];
            $MA->objectmataanggaranfk = $KM->id;
            $MA->objectcarabayarfk = $request['objectcarabayarfk'];
            $MA->objectasalprodukfk = $request['objectasalprodukfk'];
            $MA->bendaharafk = $request['bendaharafk'];
            $MA->penerimafk = $request['penerimafk'];
            $MA->pph = (float)$request['pph'];
            $MA->ppn = (float)$request['ppn'];
            $MA->objectpanjarfk = isset($request['norecpanjar'][0]) ? $request['norecpanjar'][0]['norecpanjar'] : null;
            $MA->save();

            $norecStrukRealisasiJangInsertTableDetailNa = $MA->norec;

            $dataRealisasiDetail = $request['realisasidetail'];
            foreach($dataRealisasiDetail as $item){
                if(empty($item['norec'])){
                    $DT = new RealisasiDetail();
                    $norecDT = $DT->generateNewId();
                    $DT->norec = $norecDT;
                    $DT->kdprofile = $idProfile;
                    $DT->statusenabled = true;
                    $DT->strukrealisasifk = $norecStrukRealisasiJangInsertTableDetailNa;
                    $DT->uraian = $item['uraian'];
                    $DT->jml = $item['jml'];
                    $DT->satuan = $item['satuan'];
                    $DT->harga = $item['harga'];
                    $DT->subtotal = $item['subtotal'];
                    $DT->keteranganbelanjafk = $item['keteranganbelanjafk'];
                    $DT->save();
                } else if(!empty($item['norec'])){
                    $DT = RealisasiDetail::where('norec',$item['norec'])
                    ->where('kdprofile', $idProfile)
                    ->first();;
                    $DT->uraian = $item['uraian'];
                    $DT->jml = $item['jml'];
                    $DT->satuan = $item['satuan'];
                    $DT->harga = $item['harga'];
                    $DT->subtotal = $item['subtotal'];
                    $DT->save();
                } 
                
            }

            if($request['norecpanjar'] != null){
                if($jumlahall >= 0){
                    for($i = 0; $i < count($request['norecpanjar']); $i++){

                        $npanjar = $request['norecpanjar'][$i]['norecpanjar'];
                        //cari total semua spj yang sudah dipakai di panjar itu
                        $sisaperpanjar = DB::select(DB::raw("select coalesce(jumlahpanjar,0) jumlahpanjar, coalesce(sum(jumlahspj),0) jumlahspj
                        from spjtopanjar_t 
                        where kdprofile = 30
                        and statusenabled = true
                        and objectspjfk != ''
                        and objectpanjarfk = '$npanjar'
                        group by jumlahpanjar"));
    
                        //jumlah panjar keseluruhan
                        $jumlah = DB::select(DB::raw("
                        select coalesce(pj.jumlah,0) jumlah 
                        from panjar_t pj
                        where pj.kdprofile = 30
                        and pj.statusenabled = true
                        and pj.norec = '$npanjar'
                        "));
    
                        //jumlah pengembalian
                        $pengembalian = DB::select(DB::raw("select coalesce(sum(jumlahpengembalian),0) jumlahpengembalian 
                        from(
                            select pp.jumlahpengembalian, pp.norec
                            from panjar_t pj
                            inner join pengembalianpanjar_t pp on pp.objectpanjarfk = pj.norec
                            where pj.kdprofile = 30
                            and pj.statusenabled = true
                            and pp.kdprofile = 30
                            and pp.statusenabled = true
                            and pj.norec = '$npanjar'
                            group by pp.jumlahpengembalian, pp.norec
                        ) as x
                        "));
    
                        $jumlahspj = 0;
                        if(isset($sisaperpanjar) && count($sisaperpanjar) != 0){
                            $jumlahspj = $sisaperpanjar[0]->jumlahspj;
                        }
    
                        $jumlahpanjar = 0;
                        if(isset($jumlah)){
                            $jumlahpanjar = $jumlah[0]->jumlah;
                        }
    
                        $jumlahkembali = 0;
                        if(isset($pengembalian) && count($pengembalian) != 0){
                            $jumlahkembali = $pengembalian[0]->jumlahpengembalian;
                        }
    
                        $jsisa = (float)$jumlahpanjar - (float)$jumlahspj - (float)$jumlahkembali;
                        
                        if($jsisa > 0){
                            if($jumlahall >= $jsisa){
                                $jumlahsimpan = $jsisa;
                                $jumlahall -= $jsisa;
                            } else{
                                $jumlahsimpan = $jumlahall;
                            }
        
                            $norecpanjar = $request['norecpanjar'][$i]['norecpanjar'];
        
                            $sisaperpanjar = DB::select(DB::raw("select jumlahpanjar, sum(jumlahspj) jumlahspj
                                from spjtopanjar_t 
                            where kdprofile = 30
                            and statusenabled = true
                            and objectpanjarfk = '$norecpanjar'
                            group by jumlahpanjar"));
        
                            $cek = SPJtoPanjar::where('objectpanjarfk', '=', $request['norecpanjar'][$i]['norecpanjar'])
                            ->where('objectspjfk', '=', $MA->norec)->where('statusenabled', '=', true)->first();
            
                            if(empty($cek)){
                                $SP = new SPJtoPanjar();
                                $norecKS = $SP->generateNewId();
                                $SP->norec = $norecKS;
                                $SP->kdprofile = $idProfile;
                                $SP->statusenabled = true;
                                $SP->objectpanjarfk = $request['norecpanjar'][$i]['norecpanjar'];
                                $SP->jumlahpanjar = $request['norecpanjar'][$i]['jumlah'];
                                $SP->nourut = $request['norecpanjar'][$i]['nourut'];
                                $SP->jumlahspj = $jumlahsimpan;
                                $SP->objectspjfk = $MA->norec;
            
                            } else{
                                $SP = SPJtoPanjar::where('objectpanjarfk', '=', $request['norecpanjar'][$i]['norecpanjar'])
                                ->where('objectspjfk', '=', $MA->norec)->where('statusenabled', '=', true)->first();
                                $SP->objectpanjarfk = $request['norecpanjar'][$i]['norecpanjar'];
                                $SP->jumlahpanjar = $request['norecpanjar'][$i]['jumlah'];
                                $SP->nourut = $request['norecpanjar'][$i]['nourut'];
                                $SP->jumlahspj += $jumlahsimpan;
                                $SP->objectspjfk = $MA->norec;
                                
                            }
                            $SP->save();
                        }
                    }
                } else{
                    $jumlahall = $jumlahall * (-1);
                    for($i = count($request['norecpanjar'])-1; $i >= 0; $i--){
                        $SP = SPJtoPanjar::where('objectpanjarfk', '=', $request['norecpanjar'][$i]['norecpanjar'])
                            ->where('objectspjfk', '=', $MA->norec)->where('statusenabled', '=', true)->first();
                        if($jumlahall >= $SP->jumlahspj){
                            $SP->jumlahspj -= $SP->jumlahspj;
                            $jumlahall -= $SP->jumlahspj;
                        } else{
                            $SP->jumlahspj -= $jumlahall;
                            $jumlahall -= $jumlahall;
                        }

                        $SP->save();
                    }
                }
                
            }
            $transStatus = 'true';
            
       } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Gagal";
       }

        if ($transStatus == 'true') {
            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $MA,
                'as' => '@epic',
            );
        } else {
            $transMessage = $transMessage;
            DB::rollBack();
            $result = array(
                'status' => 400,
                'messages'=> $transMessage,
                'line'=> $e->getLine(),
                'message'=> $e->getMessage(),
                'as' => '@epic',
            );
            
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }

    public function getLockEntrySPJSubSubKegiatan(Request $request)
    {

        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $setting = \DB::table('settinganggaran_t as st')
            ->join('pegawai_m as pg','pg.id','=','st.objectkepalabludfk')
            ->join('tahapanggaran_m as ta','ta.id','=','st.objecttahapaktivfk')
            ->select('st.*','pg.namalengkap', 'ta.tahap', 'ta.id as idtahap', 'pg.id as idpegawai')
            ->where('st.kdprofile', $idProfile)
            ->where('st.statusenabled', true)
            ->orderBy('st.tahunanggaran')
            ->get();

        
        $data = DB::select(DB::raw("

            SELECT
                ka.id as idsubsubkegiatan,
                ka.kode as kodesubsubkegiatan,
                ka.keterangan as namakegiatan,
                ta.tahun as tahunanggaran,
                ta.islock,
                ta.islockrba,
                ta.islockangkas
            FROM transaksianggaran2024_t ta
            JOIN kegiatananggaran2024_m ka ON ka.id = ta.objectkegiatanfk AND ka.statusenabled = TRUE AND ka.kdprofile = ".$idProfile."
            JOIN tahapanggaran_m th ON th.id = ta.objecttahapfk AND th.statusenabled = TRUE AND th.kdprofile = ".$idProfile."
            JOIN keteranganbelanja_t kb ON kb.objecttransaksifk = ta.norec AND kb.statusenabled = TRUE AND kb.kdprofile = ".$idProfile."
            JOIN mataanggaran_m ma ON ma.id = kb.objectmataanggaranfk AND ma.statusenabled = TRUE AND ma.kdprofile = ".$idProfile."
            WHERE
                ta.statusenabled = TRUE
                AND ta.kdprofile = ".$idProfile."
                AND ta.tahun = '".$setting[0]->tahunanggaran."'
                AND ta.objecttahapfk = ".$setting[0]->objecttahapaktivfk."
                AND ta.objectkegiatanfk = ".$request['subsubkegiatan']."
            GROUP BY
                ka.id,
                ta.tahun,
                ta.islock,
                ta.islockrba,
                ta.islockangkas
        
        "));

        return $this->respond($data);
    }

    public function getLockEntrySPJMataAnggaran(Request $request)
    {

        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $setting = \DB::table('settinganggaran_t as st')
            ->join('pegawai_m as pg','pg.id','=','st.objectkepalabludfk')
            ->join('tahapanggaran_m as ta','ta.id','=','st.objecttahapaktivfk')
            ->select('st.*','pg.namalengkap', 'ta.tahap', 'ta.id as idtahap', 'pg.id as idpegawai')
            ->where('st.kdprofile', $idProfile)
            ->where('st.statusenabled', true)
            ->orderBy('st.tahunanggaran')
            ->get();

        
        $data = DB::select(DB::raw("
            SELECT
                ma.id as idmataanggaran,
                ma.kodemataanggaran,
                ma.namamataanggaran,
                ta.tahun as tahunanggaran,
                ta.islock,
                ta.islockrba,
                ta.islockangkas
            FROM transaksianggaran2024_t ta
            JOIN kegiatananggaran2024_m ka ON ka.id = ta.objectkegiatanfk AND ka.statusenabled = TRUE AND ka.kdprofile = ".$idProfile."
            JOIN tahapanggaran_m th ON th.id = ta.objecttahapfk AND th.statusenabled = TRUE AND th.kdprofile = ".$idProfile."
            JOIN keteranganbelanja_t kb ON kb.objecttransaksifk = ta.norec AND kb.statusenabled = TRUE AND kb.kdprofile = ".$idProfile."
            JOIN mataanggaran_m ma ON ma.id = kb.objectmataanggaranfk AND ma.statusenabled = TRUE AND ma.kdprofile = ".$idProfile."
            WHERE
                ta.statusenabled = TRUE
                AND ta.kdprofile = ".$idProfile."
                AND ta.tahun = '".$setting[0]->tahunanggaran."'
                AND ta.objecttahapfk = ".$setting[0]->objecttahapaktivfk."
                AND ta.objectkegiatanfk = ".$request['subsubkegiatan']."
                AND kb.objectmataanggaranfk = ".$request['mataanggaran']."
            GROUP BY
                ma.id,
                ta.tahun,
                ta.islock,
                ta.islockrba,
                ta.islockangkas
        "));

        return $this->respond($data);
    }

    public function getGridPanjar(Request $request)
    {

        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        
        $setting = \DB::table('settinganggaran_t as st')
            ->join('pegawai_m as pg','pg.id','=','st.objectkepalabludfk')
            ->join('tahapanggaran_m as ta','ta.id','=','st.objecttahapaktivfk')
            ->select('st.*','pg.namalengkap', 'ta.tahap', 'ta.id as idtahap', 'pg.id as idpegawai')
            ->where('st.kdprofile', $idProfile)
            ->where('st.statusenabled', true)
            ->orderBy('st.tahunanggaran')
            ->get();

        $subsubkegiatan = '';
        if (isset($request['subsubkegiatan']) && $request['subsubkegiatan'] != "" && $request['subsubkegiatan'] != "undefined") {
            $subsubkegiatan = "and pj.objectsubsubkegiatanfk = ".$request['subsubkegiatan'];
        }

        $mataanggaran = '';
        if (isset($request['mataanggaran']) && $request['mataanggaran'] != "" && $request['mataanggaran'] != "undefined") {
            $mataanggaran = "and pj.objectmataanggaranfk = ".$request['mataanggaran'];
        }

        $asalproduk = '';
        if (isset($request['asalproduk']) && $request['asalproduk'] != "" && $request['asalproduk'] != "undefined") {
            $asalproduk = "and pj.objectasalprodukfk = ".$request['asalproduk'];
        }

        $tglawal = '';
        if (isset($request['tglawal']) && $request['tglawal'] != "" && $request['tglawal'] != "undefined") {
            $tglawal = "and pj.tglpanjar >= '".$request['tglawal']."'";
        }

        $tglakhir = '';
        if (isset($request['tglakhir']) && $request['tglakhir'] != "" && $request['tglakhir'] != "undefined") {
            $tglakhir = "and pj.tglpanjar <= '".$request['tglakhir']."'";
        }

        $tahun = '';
        if (isset($request['tahun']) && $request['tahun'] != "" && $request['tahun'] != "undefined") {
            $tahun = "and ta.tahun = '".$request['tahun']."'";
        }else{
            $tahun = "and ta.tahun = '".$setting[0]->tahunanggaran."'";
        }

        $data = DB::select(DB::raw("
            SELECT 
                pj.norec norecpanjar, 
                pj.nopanjar, pj.uraian, pj.tglpanjar, pj.jumlah, pj.jenispanjar, pj.sumberpanjar, pj.objectmataanggaranfk,
                ma.id idmataanggaran, ma.kodemataanggaran, ma.namamataanggaran, ma.kodemataanggaran || ' - ' || ma.namamataanggaran AS rekening, 
                ka.id idsubsubkegiatan, 
                ka.keterangan subsubkegiatan,
                ka.kode || ' - ' || ka.keterangan as kegiatan,
                ka2.id idsubkegiatan,
                ka2.kode kodesubkegiatan, 
                ka2.keterangan keterangansubkegiatan,
                ap.id as idasalproduk,
                ap.asalproduk,
                COALESCE(SUM(stp.jumlahspj), 0) as jumlahspj,
                COALESCE(SUM(pengpj.jumlahpengembalian), 0) as jumlahpengembalian,
                COALESCE(SUM(stp.jumlahspj), 0) + COALESCE(SUM(pengpj.jumlahpengembalian), 0) as totalpemakaian,
                COALESCE(pj.jumlah, 0) - ( COALESCE(SUM(stp.jumlahspj), 0) + COALESCE(SUM(pengpj.jumlahpengembalian), 0) ) as selisih
            FROM panjar_t pj
            INNER JOIN mataanggaran_m ma on ma.id = pj.objectmataanggaranfk AND ma.statusenabled = TRUE AND ma.kdprofile = ".$idProfile."
            INNER JOIN kegiatananggaran2024_m ka on ka.id = pj.objectsubsubkegiatanfk AND ka.statusenabled = TRUE AND ka.kdprofile = ".$idProfile."
            LEFT JOIN kegiatananggaran2024_m ka2 on ka2.id = pj.objectsubkegiatanfk AND ka.statusenabled = TRUE AND ka.kdprofile = ".$idProfile."
            INNER JOIN asalproduk_m ap ON ap.id = pj.objectasalprodukfk AND ap.statusenabled = TRUE AND ap.kdprofile = ".$idProfile."
            LEFT JOIN spjtopanjar_t stp ON stp.objectpanjarfk = pj.norec AND stp.statusenabled = TRUE AND stp.kdprofile = ".$idProfile."
            LEFT JOIN pengembalianpanjar_t pengpj ON pengpj.objectpanjarfk = pj.norec AND pengpj.statusenabled = TRUE AND pengpj.kdprofile = ".$idProfile."
            where pj.kdprofile = 30
                and pj.statusenabled = true
                AND ka.id IN (SELECT DISTINCT ta.objectkegiatanfk FROM transaksianggaran2024_t ta WHERE ta.statusenabled = TRUE AND ta.objectkegiatanfk = ka.id $tahun)
                $subsubkegiatan
                $mataanggaran
                $asalproduk
                $tglawal
                $tglakhir
            GROUP BY
                pj.norec,
                ma.id,
                ka.id,
                ap.id,
                ka2.id
            ORDER BY cast(split_part(nopanjar, '/', 1)  as integer) desc
        "));


        return $this->respond($data);
        
    }

    public function simpanPanjar(Request $request)
    {

        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        
        $tgl = date("n", strtotime($request['tglPanjar']) );
        $thn = date("Y", strtotime($request['tglPanjar']) );
        
        try{

            $setting = \DB::table('settinganggaran_t as st')
                ->join('pegawai_m as pg','pg.id','=','st.objectkepalabludfk')
                ->join('tahapanggaran_m as ta','ta.id','=','st.objecttahapaktivfk')
                ->select('st.*','pg.namalengkap', 'ta.tahap', 'ta.id as idtahap', 'pg.id as idpegawai')
                ->where('st.kdprofile', $idProfile)
                ->where('st.statusenabled', true)
                ->orderBy('st.tahunanggaran')
                ->get();

            if($request['norec'] == ''){

                $MA = new Panjar();
                $norecKS = $MA->generateNewId();
                $MA->norec = $norecKS;
                $MA->kdprofile = $idProfile;
                $MA->statusenabled = true;
                // $nos = $this->generateCodeBySeqTable(new Panjar, 'nopanjar', 6, ' ',$kdProfile);

                $runningNumber = RunningNumber::where('id',13541)->first();
                
                // cek dulu apakah data panjar di tahun setting anggaran yang aktif
                $cekPanjar = DB::select(DB::raw("
                    SELECT
                        pj.*
                    FROM panjar_t pj 
                    JOIN kegiatananggaran2024_m ka ON ka.id = pj.objectsubsubkegiatanfk AND ka.statusenabled = TRUE AND ka.kdprofile = ".$idProfile."
                    JOIN transaksianggaran2024_t ta ON ta.objectkegiatanfk = ka.id AND ta.statusenabled = TRUE AND ta.kdprofile = ".$idProfile."
                    JOIN mataanggaran_m ma ON ma.id = pj.objectmataanggaranfk AND ma.statusenabled = TRUE AND ma.kdprofile = ".$idProfile."
                    JOIN asalproduk_m ap ON ap.id = pj.objectasalprodukfk AND ap.statusenabled = TRUE AND ap.kdprofile = ".$idProfile."
                    WHERE
                        pj.statusenabled = TRUE
                        AND pj.kdprofile = ".$idProfile."
                        AND ta.tahun = '".$setting[0]->tahunanggaran."'
                    GROUP BY
                        pj.norec
                "));

                $nos = 0;
                if(count($cekPanjar) <= 0){

                    $nomor = 1;
                    $nos = str_pad((int)$nomor, 5, "0", STR_PAD_LEFT);

                    RunningNumber::where('id', 13541)
                        ->update(
                            [
                                'nomer_terbaru' => $nos
                            ]
                        );
                }else{
                    // $nomor = $runningNumber->nomer_terbaru +1;
                    // $nos = str_pad((int)$nomor, 5, "0", STR_PAD_LEFT);
                    $nomor = count($cekPanjar) + 1;
                    $nos = str_pad((int)$nomor, 5, "0", STR_PAD_LEFT);

                    RunningNumber::where('id', 13541)
                        ->update(
                            [
                                'nomer_terbaru' => $nos
                            ]
                        );
                }
                

                $noPanjar = $nos.'/PANJAR/1.02.2.22.0.00.01.0004/'.$tgl.'/'.$thn;
                $MA->nopanjar = $noPanjar;
                
                $MA->objectsubkegiatanfk = $request['subkegiatan'];
                $MA->objectsubsubkegiatanfk = $request['subsusbkegiatan'];
                $MA->objectmataanggaranfk = $request['mataanggaran'];
                
            } else{
                $MA = Panjar::where('norec', '=', $request['norec'])->first();
                // $MA->nopanjar = $request['nopanjar'];
            }

            $MA->tglpanjar = $request['tglPanjar'];
            $MA->uraian = $request['uraianPanjar'];
            $MA->jumlah = $request['jumlahpanjar'];
            $MA->sumberpanjar = $request['sumberPanjar'];
            $MA->idbill = $request['idbill'];
            $MA->ntpn = $request['ntpn'];
            $MA->idbillpph = $request['idbillpph'];
            $MA->ntpnpph = $request['ntpnpph'];
            $MA->objectjenispphfk = $request['objectjenispphfk'];
            $MA->pph = $request['pph'];
            $MA->ppn = $request['ppn'];
            $MA->idbillpph2 = $request['idbillpph2'];
            $MA->ntpnpph2 = $request['ntpnpph2'];
            $MA->objectjenispphfk2 = $request['objectjenispphfk2'];
            $MA->pph2 = $request['pph2'];
            $MA->objectasalprodukfk = $request['asalproduk'];
            $MA->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $MA,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'line'=> $e->getLine(),
                'message'=> $e->getMessage(),
                'result' => $MA,
                'as' => '@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }

    public function getPengembalianPanjar(Request $request)
    {

        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        
        $norec = $request['norec'];

        $data = DB::select(DB::raw("
            SELECT 
                pj.nopengembalian, ma.id idmataanggaran, ma.kodemataanggaran, subkeg.id idsubkegiatan, subkeg.keterangan subkegiatan, subsubkeg.id idsubsubkegiatan, subsubkeg.keterangan subsubkegiatan, pj.norec, pj.tglpengembalian, pj.jumlahpengembalian, pj.keterangan
            FROM pengembalianpanjar_t pj
            INNER JOIN mataanggaran_m ma on ma.id = pj.objectmataanggaranfk
            INNER JOIN kegiatananggaran2024_m subkeg on subkeg.id = pj.objectsubkegiatanfk
            INNER JOIN kegiatananggaran2024_m subsubkeg on subsubkeg.id = pj.objectsubsubkegiatanfk
            WHERE 
                pj.kdprofile = ".$idProfile."
                AND pj.statusenabled = TRUE
                AND pj.objectpanjarfk = '$norec'"
        ));

        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);

    }
    
    public function getDaftarPanjarDipilih(Request $request)
    {

        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $norec = $request['norecspj'];

        $data = DB::select(DB::raw("
            select 
                stp.nourut, pj.norec norecpanjar, ma.id idmataanggaran, ma.kodemataanggaran, subkeg.id idsubkegiatan, subkeg.keterangan subkegiatan, subsubkeg.id idsubsubkegiatan, subsubkeg.keterangan subsubkegiatan, pj.nopanjar, pj.uraian, pj.tglpanjar, pj.jumlah, pj.jenispanjar, pj.jumlahpengembalian, pj.sumberpanjar
            from panjar_t pj
            inner join spjtopanjar_t stp on stp.objectpanjarfk = pj.norec
            inner join mataanggaran_m ma on ma.id = pj.objectmataanggaranfk
            inner join kegiatananggaran2024_m subkeg on subkeg.id = pj.objectsubkegiatanfk
            inner join kegiatananggaran2024_m subsubkeg on subsubkeg.id = pj.objectsubsubkegiatanfk
            where 
                pj.kdprofile = ".$idProfile."
                and pj.statusenabled = true
                and ma.kdprofile = ".$idProfile."
                and ma.statusenabled = true
                and stp.kdprofile = ".$idProfile."
                and stp.statusenabled = true
                and subkeg.kdprofile = ".$idProfile."
                and subkeg.statusenabled = true
                and subsubkeg.kdprofile = ".$idProfile."
                and subsubkeg.statusenabled = true
                and stp.objectspjfk = '$norec'
            order by 
                stp.nourut
        "));

        $result = array(
            'data' => $data,
            'message' => '@epic',
        );

        return $this->respond($result);

    }

    public function getDataAngkas(Request $request)
    {

        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $setting = \DB::table('settinganggaran_t as st')
            ->join('pegawai_m as pg','pg.id','=','st.objectkepalabludfk')
            ->join('tahapanggaran_m as ta','ta.id','=','st.objecttahapaktivfk')
            ->select('st.*','pg.namalengkap', 'ta.tahap', 'ta.id as idtahap', 'pg.id as idpegawai')
            ->where('st.kdprofile', $idProfile)
            ->where('st.statusenabled', true)
            ->orderBy('st.tahunanggaran')
            ->get();

        $subkegiatan = '';
        if (isset($request['subkegiatan']) && $request['subkegiatan'] != "" && $request['subkegiatan'] != "undefined") {
            $subkegiatan = "and ka2.id = ".$request['subkegiatan'];
        }

        $subsubkegiatan = '';
        if (isset($request['subsubkegiatan']) && $request['subsubkegiatan'] != "" && $request['subsubkegiatan'] != "undefined") {
            $subsubkegiatan = "and ka.id = ".$request['subsubkegiatan'];
        }

        $tahap = '';
        if (isset($request['tahap']) && $request['tahap'] != "" && $request['tahap'] != "undefined") {
            $tahap = "and th.id = ".$request['tahap'];
        }

        $tahun = '';
        if (isset($request['tahun']) && $request['tahun'] != "" && $request['tahun'] != "undefined") {
            $tahun = "and ta.tahun = '".$request['tahun']."'";
        }else{
            $tahun = "and ta.tahun = '".$setting[0]->tahunanggaran."'";
        }

        $pegawai = '';
        if(isset($request['idpegawai']) && $request['idpegawai']!= '' && $request['idpegawai'] != "undefined"){
            $pegawai = "and ta.objectpptkfk = $request[idpegawai]";
        }

        $subtotalperrekening = DB::select(DB::raw("

            SELECT
                ma.id as idmataanggaran,
                ma.kodemataanggaran,
                ma.namamataanggaran,
                ma.kodemataanggaran || ' - ' || ma.namamataanggaran mataanggaran,
                COALESCE(SUM(kb.subtotal), 0) as subtotal
            FROM keteranganbelanja_t kb
            JOIN transaksianggaran2024_t ta ON ta.norec = kb.objecttransaksifk AND ta.statusenabled = TRUE AND ta.kdprofile = ".$idProfile."
            JOIN kegiatananggaran2024_m ka ON ka.id = ta.objectkegiatanfk AND ka.statusenabled = TRUE AND ka.kdprofile = ".$idProfile."
            JOIN kegiatananggaran2024_m ka2 ON ka2.id = ka.headfk AND ka2.statusenabled = TRUE AND ka2.kdprofile = ".$idProfile."
            JOIN tahapanggaran_m th ON th.id = ta.objecttahapfk AND th.statusenabled = TRUE AND th.kdprofile = ".$idProfile."
            JOIN mataanggaran_m ma ON ma.id = kb.objectmataanggaranfk AND ma.statusenabled = TRUE AND ma.kdprofile = ".$idProfile."
            WHERE
                kb.statusenabled = TRUE
                AND kb.kdprofile = ".$idProfile."
                $tahun
                $subsubkegiatan
                $subkegiatan
                $tahap
                $pegawai
            GROUP BY
                ma.id,
                ka.id
            ORDER BY
                SPLIT_PART(ma.kodemataanggaran, '.', 1),
                SPLIT_PART(ma.kodemataanggaran, '.', 2),
                SPLIT_PART(ma.kodemataanggaran, '.', 3),
                case 
                    when SPLIT_PART(ma.kodemataanggaran, '.', 5) = '' THEN cast(SPLIT_PART(ma.kodemataanggaran, '.', 4) as INTEGER)
                    else cast(SPLIT_PART(ma.kodemataanggaran, '.', 5) as INTEGER)
                END asc
        "));

        $dataAngkas = DB::select(DB::raw("

            SELECT
                ma.id as idmataanggaran,
                ma.kodemataanggaran,
                ma.namamataanggaran,
                ma.kodemataanggaran || ' - ' || ma.namamataanggaran mataanggaran,
                ka.id as idsubsubkegiatan,
                ka.kode as kodesubsubkegiatan,
                ka.keterangan,
                ka.kode || ' - ' || ka.keterangan as kegiatan,
                SUM(
                    CASE WHEN ap.bulanint = 1 THEN ap.nilai::FLOAT ELSE 0 END
                ) as jan,
                SUM(
                    CASE WHEN ap.bulanint = 2 THEN ap.nilai::FLOAT ELSE 0 END
                ) as feb,
                SUM(
                    CASE WHEN ap.bulanint = 3 THEN ap.nilai::FLOAT ELSE 0 END
                ) as mar,
                SUM(
                    CASE WHEN ap.bulanint = 4 THEN ap.nilai::FLOAT ELSE 0 END
                ) as apr,
                SUM(
                    CASE WHEN ap.bulanint = 5 THEN ap.nilai::FLOAT ELSE 0 END
                ) as mei,
                SUM(
                    CASE WHEN ap.bulanint = 6 THEN ap.nilai::FLOAT ELSE 0 END
                ) as jun,
                SUM(
                    CASE WHEN ap.bulanint = 7 THEN ap.nilai::FLOAT ELSE 0 END
                ) as jul,
                SUM(
                    CASE WHEN ap.bulanint = 8 THEN ap.nilai::FLOAT ELSE 0 END
                ) as agt,
                SUM(
                    CASE WHEN ap.bulanint = 9 THEN ap.nilai::FLOAT ELSE 0 END
                ) as sep,
                SUM(
                    CASE WHEN ap.bulanint = 10 THEN ap.nilai::FLOAT ELSE 0 END
                ) as okt,
                SUM(
                    CASE WHEN ap.bulanint = 11 THEN ap.nilai::FLOAT ELSE 0 END
                ) as nov,
                SUM(
                    CASE WHEN ap.bulanint = 12 THEN ap.nilai::FLOAT ELSE 0 END
                ) as des,
                COALESCE(SUM(ap.nilai::FLOAT), 0) as totalbulanan
            FROM keteranganbelanja_t kb
            JOIN transaksianggaran2024_t ta ON ta.norec = kb.objecttransaksifk AND ta.statusenabled = TRUE AND ta.kdprofile = ".$idProfile."
            JOIN kegiatananggaran2024_m ka ON ka.id = ta.objectkegiatanfk AND ka.statusenabled = TRUE AND ka.kdprofile = ".$idProfile."
            JOIN kegiatananggaran2024_m ka2 ON ka2.id = ka.headfk AND ka2.statusenabled = TRUE AND ka2.kdprofile = ".$idProfile."
            JOIN tahapanggaran_m th ON th.id = ta.objecttahapfk AND th.statusenabled = TRUE AND th.kdprofile = ".$idProfile."
            JOIN mataanggaran_m ma ON ma.id = kb.objectmataanggaranfk AND ma.statusenabled = TRUE AND ma.kdprofile = ".$idProfile."
            LEFT JOIN alokasiketeranganbelanja_t ap ON ap.keteranganbelanjafk = kb.norec AND ap.statusenabled = TRUE AND ap.kdprofile = ".$idProfile."
            WHERE
                kb.statusenabled = TRUE
                AND kb.kdprofile = ".$idProfile."
                $tahun
                $subsubkegiatan
                $subkegiatan
                $tahap
                $pegawai
            GROUP BY
                ma.id,
                ka.id
            ORDER BY
                SPLIT_PART(ma.kodemataanggaran, '.', 1),
                SPLIT_PART(ma.kodemataanggaran, '.', 2),
                SPLIT_PART(ma.kodemataanggaran, '.', 3),
                case 
                    when SPLIT_PART(ma.kodemataanggaran, '.', 5) = '' THEN cast(SPLIT_PART(ma.kodemataanggaran, '.', 4) as INTEGER)
                    else cast(SPLIT_PART(ma.kodemataanggaran, '.', 5) as INTEGER)
                END asc
        "));

        foreach($dataAngkas as $dtangkas){
            $dtangkas->subtotal = 0;
            foreach($subtotalperrekening as $item){
                if($item->idmataanggaran == $dtangkas->idmataanggaran){
                    $dtangkas->subtotal = $item->subtotal;
                }
            }
        }

        $detailAngkas = DB::select(DB::raw("
            SELECT
                ma.id as idmataanggaran,
                ma.kodemataanggaran,
                ma.namamataanggaran,
                ma.kodemataanggaran || ' - ' || ma.namamataanggaran mataanggaran,
                ka.id as idsubsubkegiatan,
                ka.kode as kodesubsubkegiatan,
                ka.keterangan,
                ka.kode || ' - ' || ka.keterangan as kegiatan,
                kb.norec,
                kb.kdprofile,
                kb.statusenabled,
                kb.keteranganbelanja,
                kb.nourut,
                kb.hargasatuan,
                kb.jml,
                kb.satuan,
                kb.objectasalprodukfk,
                kb.subtotal,
                ta.islockangkas,
                SUM(ap.nilai::FLOAT) as subtotalRP,
                SUM(
                    CASE WHEN ap.bulanint = 1 THEN ap.nilai::FLOAT ELSE 0 END
                ) as jan,
                SUM(
                    CASE WHEN ap.bulanint = 2 THEN ap.nilai::FLOAT ELSE 0 END
                ) as feb,
                SUM(
                    CASE WHEN ap.bulanint = 3 THEN ap.nilai::FLOAT ELSE 0 END
                ) as mar,
                SUM(
                    CASE WHEN ap.bulanint = 4 THEN ap.nilai::FLOAT ELSE 0 END
                ) as apr,
                SUM(
                    CASE WHEN ap.bulanint = 5 THEN ap.nilai::FLOAT ELSE 0 END
                ) as mei,
                SUM(
                    CASE WHEN ap.bulanint = 6 THEN ap.nilai::FLOAT ELSE 0 END
                ) as jun,
                SUM(
                    CASE WHEN ap.bulanint = 7 THEN ap.nilai::FLOAT ELSE 0 END
                ) as jul,
                SUM(
                    CASE WHEN ap.bulanint = 8 THEN ap.nilai::FLOAT ELSE 0 END
                ) as agt,
                SUM(
                    CASE WHEN ap.bulanint = 9 THEN ap.nilai::FLOAT ELSE 0 END
                ) as sep,
                SUM(
                    CASE WHEN ap.bulanint = 10 THEN ap.nilai::FLOAT ELSE 0 END
                ) as okt,
                SUM(
                    CASE WHEN ap.bulanint = 11 THEN ap.nilai::FLOAT ELSE 0 END
                ) as nov,
                SUM(
                    CASE WHEN ap.bulanint = 12 THEN ap.nilai::FLOAT ELSE 0 END
                ) as des
            FROM keteranganbelanja_t kb
            JOIN transaksianggaran2024_t ta ON ta.norec = kb.objecttransaksifk AND ta.statusenabled = TRUE AND ta.kdprofile = ".$idProfile."
            JOIN kegiatananggaran2024_m ka ON ka.id = ta.objectkegiatanfk AND ka.statusenabled = TRUE AND ka.kdprofile = ".$idProfile."
            JOIN kegiatananggaran2024_m ka2 ON ka2.id = ka.headfk AND ka2.statusenabled = TRUE AND ka2.kdprofile = ".$idProfile."
            JOIN tahapanggaran_m th ON th.id = ta.objecttahapfk AND th.statusenabled = TRUE AND th.kdprofile = ".$idProfile."
            JOIN mataanggaran_m ma ON ma.id = kb.objectmataanggaranfk AND ma.statusenabled = TRUE AND ma.kdprofile = ".$idProfile."
            LEFT JOIN alokasiketeranganbelanja_t ap ON ap.keteranganbelanjafk = kb.norec AND ap.statusenabled = TRUE AND ap.kdprofile = ".$idProfile."
            WHERE
                kb.statusenabled = TRUE
                AND kb.kdprofile = ".$idProfile."
                $tahun
                $subsubkegiatan
                $subkegiatan
                $tahap
                $pegawai
            GROUP BY
                kb.norec,
                ka.id,
                ma.id,
                ta.islockangkas
            ORDER BY
                kb.nourut asc,
                SPLIT_PART(ma.kodemataanggaran, '.', 1),
                SPLIT_PART(ma.kodemataanggaran, '.', 2),
                SPLIT_PART(ma.kodemataanggaran, '.', 3),
                case 
                    when SPLIT_PART(ma.kodemataanggaran, '.', 5) = '' THEN cast(SPLIT_PART(ma.kodemataanggaran, '.', 4) as INTEGER)
                    else cast(SPLIT_PART(ma.kodemataanggaran, '.', 5) as INTEGER)
                END asc


        "));

        $result = array(
            'alokasimataanggaran' => $dataAngkas,
            'detailalokasimataanggaran' => $detailAngkas,
            'message' => '@epic',
        );

        return $this->respond($result);

    }
}