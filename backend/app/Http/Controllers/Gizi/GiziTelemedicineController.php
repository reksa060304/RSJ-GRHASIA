<?php

namespace App\Http\Controllers\Gizi;
use App\Http\Controllers\ApiController;
use App\Master\SiklusGizi;
use Carbon\Carbon;
use Illuminate\Http\Request;
use DB;
use App\Traits\Valet;
use Webpatser\Uuid\Uuid;
use App\Master\Pegawai;
use App\Master\Pasien;
use App\Master\Ruangan;
use App\Transaksi\StokProdukDetail;
use App\Transaksi\KartuStok;
use App\Transaksi\StrukKirim;
use App\Transaksi\KirimProduk;
use App\Transaksi\StrukClosing;
use App\Transaksi\StokProdukDetailOpname;
use App\Transaksi\StrukOrder;
use App\Transaksi\OrderPelayanan;
use App\Master\JenisDiet;
use App\Master\JenisWaktu;
use App\Master\KategoryDiet;
use App\Master\MapProdukToMenuMakanan;
use App\Master\MenuMakanan;
use App\Master\Produk;
use App\Master\SiklusCateringGizi;
use App\Transaksi\PasienDaftar;
use App\Transaksi\AntrianPasienDiperiksa;
use App\Transaksi\RiwayatOrderGizi;
class GiziTelemedicineController extends ApiController
{
    use Valet;
    public function __construct()
    {
        parent::__construct($skip_authentication=false);
    }


    public function getDataProdukDiet(Request $request)
    {

        $kdProfile = (int) $this->getDataKdProfile($request);
        $kdProdukDiet = $this->settingDataFixed('kdKategoryProdukDiet', $kdProfile);
        $data = Produk::select('id','namaproduk as produk_diet')
        ->where('kdprofile', $kdProfile)
        ->where('objectkategoryprodukfk', $kdProdukDiet)
        ->where('statusenabled', true)
        ->get();

        $result = array(
            "status" => 200,
            "data" => $data,
            "as" => 'inhuman',
        );
        return $this->setStatusCode($result['status'])->respond($result, 'menu makanan');
    }

    public function getDataMenuMakanan(Request $request)
    {

        $kdProfile = (int) $this->getDataKdProfile($request);
        $data = MenuMakanan::select('id','menumakanan','keterangan')
        ->where('kdprofile', $kdProfile)
        ->where('statusenabled', true)
        ->get();

        $result = array(
            "status" => 200,
            "data" => $data,
            "as" => 'inhuman',
        );
        return $this->setStatusCode($result['status'])->respond($result, 'menu makanan');
    }

    
}
