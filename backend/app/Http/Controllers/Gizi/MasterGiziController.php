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
use App\Master\SiklusCateringGizi;
use App\Transaksi\PasienDaftar;
use App\Transaksi\AntrianPasienDiperiksa;
use App\Transaksi\RiwayatOrderGizi;
class MasterGiziController extends ApiController
{
    use Valet;
    public function __construct()
    {
        parent::__construct($skip_authentication=false);
    }


    public function saveMenuMakanan(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        try{
            $menuMakanan = MenuMakanan::max('id');
            $menuMakanan= $menuMakanan +1;
            if ($request['id'] == "") {

                $menu = new MenuMakanan();
                $menu->norec = $menu->generateNewId();
                $menu->id = $menuMakanan;
                $menu->kdprofile = $kdProfile;
                $menu->statusenabled = true;
            }else{
                $menu = MenuMakanan::where('id',$request['id'])->where('kdprofile', $kdProfile)->first();

            }
            $menu->kodeexternal = $menuMakanan;
            $menu->namaexternal = $request['menumakanan'];
            $menu->reportdisplay = $request['menumakanan'];
            $menu->menumakanan = $request['menumakanan'];
            $menu->keterangan = $request['keterangan'];
            $menu->satuan_id =  $request['satuan_id'];
            $menu->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $errorMessage = $e->getMessage();
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Menu Makanan";
            DB::commit();
            $result = array(
                "status" => 201,
                "menu" => $menu,
                "as" => 'inhuman',
            );

        } else {
            $transMessage = "Simpan gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'inhuman',
                "message" => $errorMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDataMenuMakanan(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $data = MenuMakanan::select('menumakanan_m.id','menumakanan_m.menumakanan','menumakanan_m.keterangan','ss.satuanstandar as satuan_standar','menumakanan_m.satuan_id')
        ->leftjoin('satuanstandar_m as ss', 'ss.id', '=', 'menumakanan_m.satuan_id')
        ->where('menumakanan_m.kdprofile', $kdProfile)
        ->when($request['menumakanan'], function ($query) use ($request) {
            return $query->where('menumakanan_m.menumakanan', 'ilike', '%' . $request['menumakanan'] . '%');
        })
        ->where('menumakanan_m.statusenabled', true)
        ->get();
        $result = array(
            "status" => 200,
            "data" => $data,
            "as" => 'inhuman',
        );
        return $this->setStatusCode($result['status'])->respond($result, 'menu makanan');
    }

    public function deleteMenuMakanan(Request $request, $id)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        try{
            $menu = MenuMakanan::where('id',$id)->where('kdprofile', $kdProfile)->first();
            if($menu != null){
                $menu->statusenabled = false;
                $menu->save();
                $transStatus = 'true';
            }else{
                $transStatus = 'false';
            }

        } catch (\Exception $e) {
            $transStatus = 'false';
            $errorMessage = $e->getMessage();
        }

        if ($transStatus == 'true') {
            $transMessage = "Hapus Menu Makanan";
            DB::commit();
            $result = array(
                "status" => 201,
                "as" => 'inhuman',
            );

        } else {
            $transMessage = "Hapus gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'inhuman',
                "message" => $errorMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveMappingProdukMenu(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        try{
            $menuMakanan = MapProdukToMenuMakanan::max('id');
            $menuMakanan= $menuMakanan +1;
            if ($request['id'] == "") {

                $menu = new MapProdukToMenuMakanan();
                $menu->norec = $menu->generateNewId();
                $menu->id = $menuMakanan;
                $menu->kdprofile = $kdProfile;
                $menu->statusenabled = true;
            }else{
                $menu = MapProdukToMenuMakanan::where('id',$request['id'])->where('kdprofile', $kdProfile)->first();

            }
            $menu->menumakanan_id = $request['menumakanan_id'];
            $menu->produk_id = $request['produk_id'];
            $menu->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $errorMessage = $e->getMessage();
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Mapping Produk Menu";
            DB::commit();
            $result = array(
                "status" => 201,
                "as" => 'inhuman',
            );

        } else {
            $transMessage = "Simpan gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'inhuman',
                "message" => $errorMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDataMappingProdukMenu(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $data = MapProdukToMenuMakanan::select('map_produk_to_menumakanan_m.*', 'mm.menumakanan','pr.namaproduk')
        ->leftjoin('produk_m as pr', 'pr.id', '=', 'map_produk_to_menumakanan_m.produk_id')
        ->leftjoin('menumakanan_m as mm', 'mm.id', '=', 'map_produk_to_menumakanan_m.menumakanan_id')
        ->where('map_produk_to_menumakanan_m.kdprofile', $kdProfile)
        ->when($request['menumakanan'], function ($query) use ($request) {
            return $query->where('menumakanan_m.menumakanan', 'ilike', '%' . $request['menumakanan'] . '%');
        })
        ->when($request['produk_id'], function ($query) use ($request) {
            return $query->where('map_produk_to_menumakanan_m.produk_id', $request['produk_id']);
        })
        ->where('map_produk_to_menumakanan_m.statusenabled', true)
        ->get();
        $result = array(
            "status" => 200,
            "data" => $data,
            "as" => 'inhuman',
        );
        return $this->setStatusCode($result['status'])->respond($result, 'menu makanan');
    }

    public function deleteMappingProdukMenu(Request $request, $id)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        try{
            $mapping = MapProdukToMenuMakanan::where('id',$id)->where('kdprofile', $kdProfile)->first();
            if($mapping != null){
                $mapping->statusenabled = false;
                $mapping->save();
                $transStatus = 'true';
            }else{
                $transStatus = 'false';
            }

        } catch (\Exception $e) {
            $transStatus = 'false';
            $errorMessage = $e->getMessage();
        }

        if ($transStatus == 'true') {
            $transMessage = "Hapus Mapping Produk Menu";
            DB::commit();
            $result = array(
                "status" => 201,
                "as" => 'inhuman',
            );

        } else {
            $transMessage = "Hapus gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'inhuman',
                "message" => $errorMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveSiklusCatering(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        try{
            foreach ($request['data'] as $value) {
                $siklus = new SiklusCateringGizi();
                $maxSiklus = SiklusCateringGizi::max('id');
                $siklus->id =$maxSiklus + 1;
                $siklus->norec = $siklus->generateNewId();
                $siklus->kdprofile = $kdProfile;
                $siklus->statusenabled = true;
                $siklus->siklus = $value['siklus'];
                $siklus->menumakanan_id = $value['menumakanan_id'];
                $siklus->tanggal = $value['tanggal'];
                $siklus->produk_id = $value['produk_id'];
                $siklus->save();
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $errorMessage = $e->getMessage();
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Siklus Catering";
            DB::commit();
            $result = array(
                "status" => 201,
                "as" => 'inhuman',
            );

        } else {
            $transMessage = "Simpan gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'inhuman',
                "message" => $errorMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getSiklusCatering(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $data = SiklusCateringGizi::select('sikluscateringgizi_m.*', 'mm.menumakanan','pr.namaproduk')
        ->leftjoin('produk_m as pr', 'pr.id', '=', 'sikluscateringgizi_m.produk_id')
        ->leftjoin('menumakanan_m as mm', 'mm.id', '=', 'sikluscateringgizi_m.menumakanan_id')
        ->where('sikluscateringgizi_m.kdprofile', $kdProfile)
        ->when($request['siklus'], function ($query) use ($request) {
            return $query->where('sikluscateringgizi_m.siklus', $request['siklus']);
        })
        ->when($request['tanggal'], function ($query) use ($request) {
            return $query->where('sikluscateringgizi_m.tanggal', $request['tanggal']);
        })
        ->where('sikluscateringgizi_m.statusenabled', true)
        ->orderBy('sikluscateringgizi_m.siklus', 'asc')
        ->orderBy('sikluscateringgizi_m.tanggal', 'asc')
        ->get();
        $result = array(
            "status" => 200,
            "data" => $data,
            "as" => 'inhuman',
        );
        return $this->setStatusCode($result['status'])->respond($result, 'siklus catering');
    }

    public function deleteSiklusCatering(Request $request, $id)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        try{
            $siklus = SiklusCateringGizi::where('id',$id)->where('kdprofile', $kdProfile)->first();
            if($siklus != null){
                $siklus->statusenabled = false;
                $siklus->save();
                $transStatus = 'true';
            }else{
                $transStatus = 'false';
            }

        } catch (\Exception $e) {
            $transStatus = 'false';
            $errorMessage = $e->getMessage();
        }

        if ($transStatus == 'true') {
            $transMessage = "Hapus Siklus Catering";
            DB::commit();
            $result = array(
                "status" => 201,
                "as" => 'inhuman',
            );

        } else {
            $transMessage = "Hapus gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'inhuman',
                "message" => $errorMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    
}
