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

        $result = array(
            'pegawai' => $data,
            'divkegiatan'=> $divkegiatan,
            'divprog'=> $divProg,
            'divKg'=> $divKg,
            'divsubKg'=> $divsubkg,
            'divsubsubKg'=> $divsubsubkg,
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


        $result = array(
            'kegiatan' => $kegiatan,
            'message' => 'epic',
        );

        return $this->respond($result);
    }
}