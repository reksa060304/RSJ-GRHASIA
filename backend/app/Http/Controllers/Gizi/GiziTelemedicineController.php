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
use App\Master\SlottingLibur;
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
        $data = Produk::select('id','namaproduk')
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

        $start = Carbon::today();
        $end = Carbon::today()->addDays(6); // total 7 hari (hari ini + 6)
        $kdProfile = (int) $this->getDataKdProfile($request);
        $data = SiklusCateringGizi::select('mm.id as menumakana_id','mm.menumakanan','pr.namaproduk','pr.id as produk_id','sikluscateringgizi_m.tanggal')
        ->leftjoin('produk_m as pr', 'pr.id', '=', 'sikluscateringgizi_m.produk_id')
        ->leftjoin('menumakanan_m as mm', 'mm.id', '=', 'sikluscateringgizi_m.menumakanan_id')
        ->where('sikluscateringgizi_m.kdprofile', $kdProfile)
        ->when($request['produk_id'], function ($query) use ($request) {
            return $query->where('pr.id', $request['produk_id']);
        })
        ->when($request['tanggal'], function ($query) use ($request) {
            return $query->where('sikluscateringgizi_m.tanggal', $request['tanggal']);
        })
        ->whereNotIn(
                DB::raw('DATE(sikluscateringgizi_m.tanggal)'),
                function ($q) {
                    $q->select('tgllibur')
                    ->from('slottinglibur_m')
                    ->where('statusenabled', true)
                    ->where('objectruanganfk', 784);
                }
            )
        ->whereBetween('sikluscateringgizi_m.tanggal',[$start, $end])
        ->whereRaw("EXTRACT(DOW FROM sikluscateringgizi_m.tanggal) != 0")
        ->where('sikluscateringgizi_m.statusenabled', true)
        ->orderBy('sikluscateringgizi_m.siklus', 'asc')
        ->orderBy('sikluscateringgizi_m.tanggal', 'asc')
        ->get();

        $result = array(
            "status" => 200,
            "data" => $data,
            "as" => 'inhuman',
        );
        return $this->setStatusCode($result['status'])->respond($result, 'menu makanan');
    }

    
}
