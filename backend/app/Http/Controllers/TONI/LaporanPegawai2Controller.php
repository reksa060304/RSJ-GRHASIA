<?php
/**
 * Created by PhpStorm.
 * SumberDayaManusiaController
 * User: Efan Andrian (ea@epic)
 * Date: 12/11/2019
 * Time: 09:30 PM
 */

namespace App\Http\Controllers\TONI; //case sensitive lokasi controller
use App\Master\JamKerja;
use App\Master\Paket;
use App\Master\Agama;
use App\Master\DiklatJurusan;
use App\Master\DiklatKategory;
use App\Master\Eselon;
use App\Master\GolonganPegawai;
use App\Master\HubunganKeluarga;
use App\Master\Jabatan;
use App\Master\JenisJabatan;
use App\Master\JenisKelamin;
use App\Master\JenisPegawai;
use App\Master\JenisProvider;
use App\Master\JurusanPeminatan;
use App\Master\KategoryPegawai;
use App\Master\KelompokJabatan;
use App\Master\KelompokUser;
use App\Master\KeluargaPegawai;
use App\Master\Pegawai;
use App\Master\PegawaiJadwalKerja;
use App\Master\Pekerjaan;
use App\Master\Pendidikan;
use App\Master\Ruangan;
use App\Master\SdmKedudukan;
use App\Master\SdmShiftKerja;
use App\Master\SettingDataFixed;
use App\Master\ShiftKerja;
use App\Master\StatusPegawai;
use App\Master\StatuspPerkawinanPegawai;
use App\Master\SubUnitKerja;
use App\Master\SuratKeputusan;
use App\Master\Tanggungan;
use App\Master\UnitKerjaPegawai;
use App\Transaksi\KegiatanPendidikan;
use App\Transaksi\ListTanggalCuti;
use App\Transaksi\MasaBerlakuSipStr;
use App\Transaksi\NomorTelphonePegawai;
use App\Transaksi\PesertaDidik;
use App\Transaksi\PlanningPegawaiStatus;
use App\Transaksi\RiwayatJabatan;
use App\Transaksi\RiwayatPelatihan;
use App\Transaksi\RiwayatPendidikan;
use App\Transaksi\KomponenGaji;
use App\Transaksi\KomponenGajiPegawai;
use App\Transaksi\StrukClosing;
use App\Transaksi\StrukHistori;
use App\Transaksi\DetailGajiPegawai;
use App\Transaksi\SDM_AbsensiPegawai;
use App\Transaksi\TenagaPengajar;
use App\Transaksi\JadwalKerjaPegawai;
use App\Transaksi\StrukBuktiPengeluaran;
use App\Transaksi\StrukBuktiPengeluaranCaraBayar;
use App\Transaksi\PendidikanPegawai;
use App\Transaksi\ABKPegawai;
use Illuminate\Http\Request;
use DB;
use App\Transaksi\LoggingUser;
use Illuminate\Support\Facades\Storage;
use Response;
use App\Http\Controllers\ApiController;
use App\Traits\Valet;
use Carbon\Carbon;
use App\Master\MapPegawaiToUnit;
use Webpatser\Uuid\Uuid;

class LaporanPegawai2Controller extends ApiController {

    use Valet;
    public function __construct() {
        parent::__construct($skip_authentication=false);
    }

    public function GetPegawai (Request $request) {
        
        return $this->respond($result);
    }
    public function SimpanPegawai (Request $request) {
        
        return $this->respond($result);
    }
    
}