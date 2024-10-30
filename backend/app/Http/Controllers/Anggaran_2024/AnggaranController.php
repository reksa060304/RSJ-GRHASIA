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

        $kegiatan = DB::select(DB::raw("
            SELECT
                ka.kode,ka.keterangan,ta.tahun,pg.id as idpptk,pg.namalengkap,jb.jenisbelanja,tp.tahap,ta.targetmasuk as targetkinerja,dk.div as namadiv,dk.id as div,ta.norec,
                ta.indikatormasuk,ta.indikatorkeluaran,ta.indikatorhasil,ta.targetmasuk,ta.targetkeluaran,ta.targethasil
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

        $data = DB::select(DB::raw("
                select kt.password, kt.norec	,kt.kdprofile	,kt.statusenabled	,kt.objectkegiatanfk	,kt.objectmataanggaranfk	
                ,kt.keteranganbelanja	,kt.nourut	,kt.jml	,cast(kt.hargasatuan as float) as hargasatuan	 ,cast(kt.subtotal as float) as subtotal	,
                kt.satuan	,kt.objectasalprodukfk,ap.asalproduk ,ma.namamataanggaran,ma.kodemataanggaran
                from keteranganbelanja2024_t kt
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
                $TA = new KeteranganBelanja2024();
                $norecTA = $TA->generateNewId();
                $TA->norec = $norecTA;
                $TA->kdprofile = $idProfile;
                $TA->statusenabled = true;
            }else{
                $TA= KeteranganBelanja2024::where('norec',$request['norec'])
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
            INNER JOIN keteranganbelanja2024_t kt ON kt.objecttransaksifk = kat.norec
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
                FROM keteranganbelanja2024_t kb
                JOIN transaksianggaran2024_t tra ON tra.norec = kb.objecttransaksifk AND tra.statusenabled = TRUE AND tra.kdprofile = ".$idProfile."
                JOIN mataanggaran2024_m ma ON ma.id = kb.objectmataanggaranfk AND ma.statusenabled = TRUE AND ma.kdprofile = ".$idProfile."
                JOIN kegiatananggaran2024_m ka ON ka.id = kb.objectkegiatanfk AND ka.statusenabled = TRUE AND ka.kdprofile = ".$idProfile."
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
            "));


            $keteranganBelanja = DB::select(DB::raw("
                SELECT
                    ma.id as idmataanggaran,
                    ma.kodemataanggaran,
                    ma.namamataanggaran,
                    ma.kodemataanggaran || ' - ' || ma.namamataanggaran AS text,
                    SUM(kb.subtotal) AS totalanggaran
                FROM keteranganbelanja2024_t kb
                JOIN transaksianggaran2024_t tra ON tra.norec = kb.objecttransaksifk AND tra.statusenabled = TRUE AND tra.kdprofile = ".$idProfile."
                JOIN mataanggaran2024_m ma ON ma.id = kb.objectmataanggaranfk AND ma.statusenabled = TRUE AND ma.kdprofile = ".$idProfile."
                JOIN kegiatananggaran2024_m ka ON ka.id = kb.objectkegiatanfk AND ka.statusenabled = TRUE AND ka.kdprofile = ".$idProfile."
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
}