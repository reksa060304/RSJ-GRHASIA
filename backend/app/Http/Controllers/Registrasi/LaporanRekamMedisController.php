<?php

/**
 * Created by PhpStorm.
 * User: Egie Ramdan
 * Date: 8/15/2019
 * Time: 3:47 PM
 */

namespace App\Http\Controllers\Registrasi;

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use DB;
use App\Traits\Valet;
use Webpatser\Uuid\Uuid;
use App\Master\CaraBayar;
use App\Master\JenisLaporan;
use App\Master\KelompokLaporan;
use App\Master\MapProdukToLaporanRl;
use App\Master\MapSTSToRuangan;
use App\Master\Ruangan;
use App\Master\Pegawai;
use Carbon\Carbon;

class LaporanRekamMedisController extends   ApiController
{
    use Valet;

    public function __construct()
    {
        parent::__construct($skip_authentication = false);
    }
    public function getMapLaporanRL(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $data = \DB::table('mapproduktolaporanrl_m as mptlr')
            ->join('jenislaporan_m as jl', 'jl.id', '=', 'mptlr.objectjenislaporanfk')
            ->join('kelompoklaporan_m as kl', 'kl.id', '=', 'mptlr.objectkontenlaporanfk')
            ->leftJoin('produk_m as pro', 'pro.id', '=', 'mptlr.produkfk')
            ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'mptlr.ruanganfk')
            ->select(
                'mptlr.norec',
                'pro.id as idproduk',
                'pro.namaproduk',
                'jl.id',
                'jl.jenislaporan',
                'kl.id as idkelompoklaporan',
                'kl.kelompoklaporan',
                'ru.id as idruangan',
                'ru.namaruangan'
            )
            ->where('mptlr.kdprofile', $idProfile)
            ->where('mptlr.statusenabled', true)
            ->orderBy('jl.id', 'asc')
            ->orderBy('kl.nourut', 'asc');

        if (isset($request['idKonten']) && $request['idKonten'] != "" && $request['idKonten'] != "undefined") {
            $data = $data->where('kl.id', '=', $request['idKonten']);
        }

        if (isset($request['idJenisLaporan']) && $request['idJenisLaporan'] != "" && $request['idJenisLaporan'] != "undefined") {
            $data = $data->where('jl.id', '=', $request['idJenisLaporan']);
        }

        if (isset($request['idLap']) && $request['idLap'] != "" && $request['idLap'] != "undefined") {
            $data = $data->where('jl.id', '=', $request['idLap']);
        }

        $data = $data->get();
        return $this->respond($data);
    }
    public function getMapLaporanSTS(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $data = \DB::table('mapststoruangan_m as mptlr')
            ->join('uraianpendapatan_m as up', 'up.id', '=', 'mptlr.objecturaianpendapatanfk')
            ->leftJoin('produk_m as pro', 'pro.id', '=', 'mptlr.produkfk')
            ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'mptlr.ruanganfk')
            ->leftJoin('departemen_m as dp', 'dp.id', '=', 'mptlr.departemenfk')
            ->select(
                'mptlr.norec',
                'pro.id as idproduk',
                'pro.namaproduk',
                'up.id',
                'up.uraianpendapatan',
                'ru.id as idruangan',
                'ru.namaruangan',
                'dp.id as iddepartemen',
                'dp.namadepartemen',
                'up.tahun'
            )
            ->where('mptlr.kdprofile', $idProfile)
            ->where('mptlr.statusenabled', true)
            ->orderBy('up.nourut', 'asc');

        if (isset($request['idUraian']) && $request['idUraian'] != "" && $request['idUraian'] != "undefined") {
            $data = $data->where('up.id', '=', $request['idUraian']);
        }

        if (isset($request['tahun']) && $request['tahun'] != "" && $request['tahun'] != "undefined") {
            $data = $data->where('up.tahun', '=', $request['tahun']);
        }

        $data = $data->get();
        return $this->respond($data);
    }
    public function getComboMappingRL(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin = $request->all();
        $kdJeniPegawaiDokter = (int) $this->settingDataFixed('KdJenisPegawaiDokter', $idProfile);
        $kdDeptRanapAll = explode(',', $this->settingDataFixed('KdDepartemenRIAll', $idProfile));
        $kdDepartemenRanapAll = [];
        foreach ($kdDeptRanapAll as $items) {
            $kdDepartemenRanapAll[] =  (int)$items;
        }
        $dataPenulis = Pegawai::where('statusenabled', true)
            ->where('objectjenispegawaifk', $kdJeniPegawaiDokter)
            ->where('kdprofile', $idProfile)
            ->get();

        foreach ($dataPenulis as $item) {
            $dataPenulis2[] = array(
                'id' => $item->id,
                'namalengkap' => $item->namalengkap,
            );
        }

        $dataRuangan = \DB::table('maploginusertoruangan_s as mlu')
            ->JOIN('ruangan_m as ru', 'ru.id', '=', 'mlu.objectruanganfk')
            ->select('ru.id', 'ru.namaruangan')
            ->where('mlu.kdprofile', $idProfile)
            ->where('mlu.objectloginuserfk', $dataLogin['userData']['id'])
            ->get();

        $dataRuanganall = \DB::table('ruangan_m as ru')
            ->select('ru.id', 'ru.namaruangan')
            ->where('ru.kdprofile', $idProfile)
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();

        $dataRuanganPelayanan = \DB::table('ruangan_m as ru')
            ->select('ru.id', 'ru.namaruangan')
            ->where('ru.kdprofile', $idProfile)
            ->where('ru.objectdepartemenfk', 16)
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();

        $dataRuanganRajal = \DB::table('ruangan_m as ru')
            ->select('ru.id', 'ru.namaruangan')
            ->where('ru.kdprofile', $idProfile)
            ->whereIn('ru.objectdepartemenfk', [18, 24])
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();


        $dataCaraBayar = \DB::table('carabayar_m as cb')
            ->select('cb.id', 'cb.carabayar')
            ->where('cb.kdprofile', $idProfile)
            ->where('cb.statusenabled', true)
            ->get();

        $dataJenisLaporan = \DB::table('jenislaporan_m as jl')
            ->select('jl.id', 'jl.jenislaporan')
            ->where('jl.kdprofile', $idProfile)
            ->where('jl.statusenabled', true)
            ->get();

        $dataKelompokLaporan = DB::select(DB::raw("select kl.id, kl.id || ' - ' || kl.kelompoklaporan kelompoklaporan
        from kelompoklaporan_m as kl
        where kl.kdprofile = 30
        and kl.statusenabled = true"));

        $dataPegawaiUser = DB::select(
            DB::raw("select pg.id,pg.namalengkap from loginuser_s as lu
                INNER JOIN pegawai_m as pg on lu.objectpegawaifk=pg.id
                where lu.kdprofile = $idProfile and lu.id=:idLoginUser"),
            array(
                'idLoginUser' => $dataLogin['userData']['id'],
            )
        );

        $result = array(
            'ruanganranap' =>   $dataRuanganPelayanan,
            //            'ruangan' => $dataRuangan,
            'ruanganrajal' => $dataRuanganRajal,
            'ruanganall' => $dataRuanganall,
            //            'produk' => $dataProduk,
            //            'caraBayar' => $dataCaraBayar,
            'jenisLaporan' => $dataJenisLaporan,
            'kelompokLaporan' => $dataKelompokLaporan,
            'detaillogin' => $dataPegawaiUser,
            'message' => 'as@cepot',
        );

        return $this->respond($result);
    }
    public function getComboMappingSTS(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin = $request->all();
        $tahun = date('Y');
        if (isset($request['tahun']) && $request['tahun'] != '') {
            $tahun = $request['tahun'];
        }
        $kdJeniPegawaiDokter = (int) $this->settingDataFixed('KdJenisPegawaiDokter', $idProfile);
        $kdDeptRanapAll = explode(',', $this->settingDataFixed('KdDepartemenRIAll', $idProfile));
        $kdDepartemenRanapAll = [];
        foreach ($kdDeptRanapAll as $items) {
            $kdDepartemenRanapAll[] =  (int)$items;
        }
        $dataPenulis = Pegawai::where('statusenabled', true)
            ->where('objectjenispegawaifk', $kdJeniPegawaiDokter)
            ->where('kdprofile', $idProfile)
            ->get();

        foreach ($dataPenulis as $item) {
            $dataPenulis2[] = array(
                'id' => $item->id,
                'namalengkap' => $item->namalengkap,
            );
        }

        $dataRuangan = \DB::table('maploginusertoruangan_s as mlu')
            ->JOIN('ruangan_m as ru', 'ru.id', '=', 'mlu.objectruanganfk')
            ->select('ru.id', 'ru.namaruangan')
            ->where('mlu.kdprofile', $idProfile)
            ->where('mlu.objectloginuserfk', $dataLogin['userData']['id'])
            ->get();

        $dataRuanganall = \DB::table('ruangan_m as ru')
            ->select('ru.id', 'ru.namaruangan')
            ->where('ru.kdprofile', $idProfile)
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();

        $dataRuanganPelayanan = \DB::table('ruangan_m as ru')
            ->select('ru.id', 'ru.namaruangan')
            ->where('ru.kdprofile', $idProfile)
            ->where('ru.objectdepartemenfk', 16)
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();

        $dataRuanganRajal = \DB::table('ruangan_m as ru')
            ->select('ru.id', 'ru.namaruangan')
            ->where('ru.kdprofile', $idProfile)
            ->whereIn('ru.objectdepartemenfk', [18, 24])
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();


        $dataCaraBayar = \DB::table('carabayar_m as cb')
            ->select('cb.id', 'cb.carabayar')
            ->where('cb.kdprofile', $idProfile)
            ->where('cb.statusenabled', true)
            ->get();

        $uraianPendapatan = DB::select(DB::raw("select *
        from uraianpendapatan_m
        where kdprofile = 30
        and statusenabled = true
        and tahun = '$tahun'"));

        $dataPegawaiUser = DB::select(
            DB::raw("select pg.id,pg.namalengkap from loginuser_s as lu
                INNER JOIN pegawai_m as pg on lu.objectpegawaifk=pg.id
                where lu.kdprofile = $idProfile and lu.id=:idLoginUser"),
            array(
                'idLoginUser' => $dataLogin['userData']['id'],
            )
        );

        $result = array(
            'ruanganranap' =>   $dataRuanganPelayanan,
            'ruanganrajal' => $dataRuanganRajal,
            'ruanganall' => $dataRuanganall,
            'uraianpendapatan' => $uraianPendapatan,
            'detaillogin' => $dataPegawaiUser,
            'message' => 'as@cepot',
        );

        return $this->respond($result);
    }
    public function deleteMapProdukToLaporanRL(Request $request)
    {
        $dataLogin = $request->all();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        DB::beginTransaction();
        if ($request['mapping']['norec'] != '') {
            try {
                $data1 = MapProdukToLaporanRl::where('norec', $request['mapping']['norec'])->where('kdprofile', $idProfile)->delete();
                $transStatus = 'true';
            } catch (\Exception $e) {
                $transStatus = false;
            }
        }
        if ($transStatus = 'true') {
            DB::commit();
            $transMessage = "Data Terhapus";
        } else {
            DB::rollBack();
            $transMessage = "Data Gagal Dihapus";
        }
        return $this->setStatusCode(201)->respond([], $transMessage);
    }
    public function deleteMapKontenToLaporanRL(Request $request)
    {
        $dataLogin = $request->all();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        DB::beginTransaction();
        if ($request['data']['norec'] != '') {
            try {
                $data1 = MapProdukToLaporanRl::where('norec', $request['data']['norec'])->where('statusenabled', true)->first();
                $data1->statusenabled = false;
                $data1->save();
                $transStatus = 'true';
            } catch (\Exception $e) {
                $transStatus = false;
            }
        }
        if ($transStatus = 'true') {
            DB::commit();
            $transMessage = "Data Terhapus";
        } else {
            DB::rollBack();
            $transMessage = "Data Gagal Dihapus";
        }
        return $this->setStatusCode(201)->respond([], $transMessage);
    }
    public function deleteMapSTSToRuangan(Request $request)
    {
        $dataLogin = $request->all();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        DB::beginTransaction();
        if ($request['data']['norec'] != '') {
            try {
                $data1 = MapSTSToRuangan::where('norec', $request['data']['norec'])->where('statusenabled', true)->first();
                $data1->statusenabled = false;
                $data1->save();
                $transStatus = 'true';
            } catch (\Exception $e) {
                $transStatus = false;
            }
        }
        if ($transStatus = 'true') {
            DB::commit();
            $transMessage = "Mapping Terhapus";
        } else {
            DB::rollBack();
            $transMessage = "Mapping Gagal Dihapus";
        }
        return $this->setStatusCode(201)->respond([], $transMessage);
    }
    public function getProdukMapLaporanRL(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $kdPelayanan = explode(',', $this->settingDataFixed('KdlistPelayanan', $idProfile));
        $kdListPelayanan = [];
        foreach ($kdPelayanan as $items) {
            $kdListPelayanan[] =  (int)$items;
        }
        $dataProduk = \DB::table('produk_m as pro')
            ->select('pro.id as idproduk', 'pro.namaproduk')
            ->where('pro.kdprofile', $idProfile)
            ->where('pro.statusenabled', true)
            ->orderBy('pro.namaproduk');
        if (
            isset($request['filter']['filters'][0]['value']) &&
            $request['filter']['filters'][0]['value'] != "" &&
            $request['filter']['filters'][0]['value'] != "undefined"
        ) {
            $dataProduk = $dataProduk->where('pro.namaproduk', 'ilike', '%' . $request['filter']['filters'][0]['value'] . '%');
        };

        $dataProduk = $dataProduk->take(20);
        $dataProduk = $dataProduk->get();
        //        $result = array(
        //            'data'=>$dataProduk,
        //            'message' => 'as@cepot',
        //        );

        return $this->respond($dataProduk);
    }

    public function SaveMappingRl(Request $request)
    {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $req = $request;
        try {
            //        return $this->respond($req);
            $cek = MapProdukToLaporanRl::where('objectjenislaporanfk', $request['objectjenislaporanfk'])
                ->where('objectkontenlaporanfk', $request['objectkelompokkontenfk'])
                ->whereNull('produkfk')
                ->whereNull('ruanganfk')
                ->where('statusenabled', true)
                ->first();

            if (!empty($cek)) {
                $cek->statusenabled = false;
                $cek->save();
            }

            if ($request['norec'] == '') {
                $newMap = new MapProdukToLaporanRl();
                $norecMap = $newMap->generateNewId();
                $newMap->norec = $norecMap;
                $newMap->kdprofile = $idProfile;
                $newMap->statusenabled = true;
            } else {
                $newMap = MapProdukToLaporanRl::where('norec', $request['norec'])->first();
            }
            $newMap->objectjenislaporanfk = $request['objectjenislaporanfk'];
            $newMap->objectkontenlaporanfk = $request['objectkelompokkontenfk'];
            $newMap->produkfk = $request['produkfk'];
            $newMap->ruanganfk = $request['ruanganfk'];

            $newMap->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        if ($transStatus == 'true') {
            $transMessage = "Simpan Mapping Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "map" => $newMap,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Simpan Mapping Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "map" => $newMap,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function SaveMappingRltoKonten(Request $request)
    {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $req = $request;
        try {
            //        return $this->respond($req);
            if ($request['norec'] == '') {
                $newMap = new MapProdukToLaporanRl();
                $norecMap = $newMap->generateNewId();
                $newMap->norec = $norecMap;
                $newMap->kdprofile = $idProfile;
                $newMap->statusenabled = true;
            } else {
                $newMap = MapProdukToLaporanRl::where('norec', $request['norec'])->first();
            }
            $newMap->objectjenislaporanfk = $request['objectjenislaporanfk'];
            $newMap->objectkontenlaporanfk = $request['objectkelompokkontenfk'];

            $newMap->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        if ($transStatus == 'true') {
            $transMessage = "Simpan Mapping Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "map" => $newMap,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Simpan Mapping Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "map" => $newMap,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function SaveMappingSTStoRuangan(Request $request)
    {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $req = $request;
        $ruangan = $request['ruanganfk'];
        try {

            if (isset($request['ruanganfk']) && $request['ruanganfk'] != null) {
                $produk = DB::select(DB::raw("select * from mapruangantoproduk_m where objectruanganfk = $ruangan 
                and statusenabled = true 
                and kdprofile = 30
                and objectprodukfk not in (5008635,5008645,5008637,5008647,5008649,12122241,5008636,5008644,10013621,4040398,4040406,10012775,10012776,10012777,10013016,10013043,10013620)"));

                foreach ($produk as $pr) {
                    $newMap = new MapSTSToRuangan();
                    $norecMap = $newMap->generateNewId();
                    $newMap->norec = $norecMap;
                    $newMap->kdprofile = $idProfile;
                    $newMap->statusenabled = true;
                    $newMap->objecturaianpendapatanfk = $request['objecturaianpendapatanfk'];
                    $newMap->produkfk = $pr->objectprodukfk;
                    $newMap->ruanganfk = $request['ruanganfk'];
                    $newMap->departemenfk = $request['departemenfk'];
                    $newMap->save();
                }
            } else if (isset($request['jenisprodukfk']) && $request['jenisprodukfk'] != null) {
                $produk = DB::select(DB::raw("select * from produk_m where statusenabled = true
                and kdprofile = 30
                and kekuatan is not null
                and kekuatan <> ''
                and objectdetailjenisprodukfk in (1556,1346,1365,1444,1450,522,1598,474,1597,2033,1474,1847,1356)"));

                foreach ($produk as $pr) {
                    $newMap = new MapSTSToRuangan();
                    $norecMap = $newMap->generateNewId();
                    $newMap->norec = $norecMap;
                    $newMap->kdprofile = $idProfile;
                    $newMap->statusenabled = true;
                    $newMap->objecturaianpendapatanfk = $request['objecturaianpendapatanfk'];
                    $newMap->produkfk = $pr->id;
                    $newMap->ruanganfk = $request['ruanganfk'];
                    $newMap->departemenfk = $request['departemenfk'];
                    $newMap->save();
                }
            } else {
                $newMap = new MapSTSToRuangan();
                $norecMap = $newMap->generateNewId();
                $newMap->norec = $norecMap;
                $newMap->kdprofile = $idProfile;
                $newMap->statusenabled = true;
                $newMap->objecturaianpendapatanfk = $request['objecturaianpendapatanfk'];
                $newMap->produkfk = $konten->objectprodukfk;
                $newMap->ruanganfk = $request['ruanganfk'];
                $newMap->departemenfk = $request['departemenfk'];
                $newMap->save();
            }



            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        if ($transStatus == 'true') {
            $transMessage = "Simpan Mapping Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "map" => $newMap,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Simpan Mapping Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "map" => $newMap,
                'line' => $e->getLine(),
                'message' => $e->getMessage(),
                "as" => 'as@vexana',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function SaveMappingSTStoRuanganCopy(Request $request)
    {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $req = $request;
        $tahundari = $request['tahundari'];
        $tahunke = $request['tahunke'];
        try {

            $data = DB::select(DB::raw("select up.id, up.uraianpendapatan, up2.id as id2, up2.uraianpendapatan as uraianpendapatan2,
            mm.*
                from mapststoruangan_m mm
            inner join uraianpendapatan_m up on up.id = mm.objecturaianpendapatanfk
            inner join uraianpendapatan_m up2 on up2.uraianpendapatan = up.uraianpendapatan
            where up.tahun = '$tahundari' 
            and up.kdprofile = $idProfile 
            and up.statusenabled = true
            and mm.kdprofile = $idProfile 
            and mm.statusenabled = true
            and up2.tahun = '$tahunke' 
            and up2.kdprofile = $idProfile 
            and up2.statusenabled = true"));

            foreach ($data as $dt) {
                $newMap = new MapSTSToRuangan();
                $norecMap = $newMap->generateNewId();
                $newMap->norec = $norecMap;
                $newMap->kdprofile = $idProfile;
                $newMap->statusenabled = true;
                $newMap->objecturaianpendapatanfk = $dt->id2;
                $newMap->produkfk = $dt->produkfk;
                $newMap->ruanganfk = $dt->ruanganfk;
                $newMap->departemenfk = $dt->departemenfk;
                $newMap->save();
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        if ($transStatus == 'true') {
            $transMessage = "Simpan Copy Mapping Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "map" => $newMap,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Simpan Copy Mapping Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "map" => $newMap,
                'line' => $e->getLine(),
                'message' => $e->getMessage(),
                "as" => 'as@vexana',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getMasterKonten(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $data10 = DB::select(DB::raw("select * from kelompoklaporan_m where kdprofile = 30 and statusenabled = true order by nourut, id desc"));

        $result = array(
            'data' => $data10,
            'message' => 'er@epic',

        );

        return $this->respond($result);
    }

    public function SaveMasterKonten(Request $request)
    {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        try {
            if ($request['id'] == '') {
                $newID = KelompokLaporan::max('id');

                $MA = \DB::table('kelompoklaporan_m')->insert([
                    'id' => $newID + 1,
                    'kdprofile' => $idProfile,
                    'statusenabled' => true,
                    'kodeexternal' => $newID + 1,
                    'namaexternal' => $request['kontenlaporan'],
                    'norec' => $newID + 1,
                    'reportdisplay' => $request['kontenlaporan'],
                    'kdkelompoklaporan' => $newID + 1,
                    'kelompoklaporan' => $request['kontenlaporan'],
                    'init' => $request['no'],
                    'nourut' => $request['nourut'],
                ]);
            } else {
                $MA = KelompokLaporan::where('id', '=', $request['id'])->first();
                $MA->kelompoklaporan = $request['kontenlaporan'];
                $MA->init = $request['no'];
                $MA->nourut = $request['nourut'];
                $MA->save();
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
                'result' => $MA,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'line' => $e->getLine(),
                'message' => $e->getMessage(),
                'as' => '@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function DeleteMasterKonten(Request $request)
    {
        DB::beginTransaction();
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        try {
            $MA = KelompokLaporan::where('id', '=', $request['id'])->first();
            $MA->statusenabled = false;
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
                'line' => $e->getLine(),
                'message' => $e->getMessage(),
                'as' => '@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDataRL31RawatInap(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];

        $data10 = [];

        $tanggalmin = DB::select(DB::raw("
            select min(d::date) as tglmin
            from generate_series('$tglAwal', '$tglAwal'::date + INTERVAL '1 MONTH - 1 day', '1 day'::interval) d
        "));

        $tanggalmax = DB::select(DB::raw("
            select min(d::date) as tglmax
            from generate_series('$tglAkhir', '$tglAkhir'::date + INTERVAL '1 MONTH - 1 day', '1 day'::interval) d
        "));

        $monthtahunmonth = (int) date('m', strtotime($tglAwal));
        $yeartahunmonth = (int) date('Y', strtotime($tglAwal));


        $tahunmonthq = DB::select(DB::raw("select to_char(daterange::date, 'YYYY-mm') as tahun
        from generate_series('$yeartahunmonth-$monthtahunmonth-01'::date, '$tglAkhir'::date, '1 month') as daterange"));

        $arrmin = [];
        foreach ($tanggalmin as $rowmin) {
            $arrmin[] =  $rowmin->tglmin;
        }
        $arrmax = [];
        foreach ($tanggalmax as $rowmax) {
            $arrmax[] =  $rowmax->tglmax;
        }


        $tanggalminawal = DB::select(DB::raw("select '$arrmin[0] 23:59:59'::timestamp - interval '1 day ' as tgl"));

        $arrminawal = [];
        foreach ($tanggalminawal as $rowminawal) {
            $arrminawal[] =  $rowminawal->tgl;
        }

        $tanggalmaxawal = DB::select(DB::raw("select '$arrmax[0] 23:59:59'::timestamp - interval '1 day ' as tgl"));

        $arrmaxawal = [];
        foreach ($tanggalmaxawal as $rowmaxawal) {
            $arrmaxawal[] =  $rowmaxawal->tgl;
        }



        $dataKemarin = DB::select(DB::raw("select extract(year from (tgl::date + interval '1 day')::date) as tgl, sum(jumlah) as jumlah from(
                (select tgl as tgl,jumlah from (select tgl, case when jumlah is null then 0 else sum(jumlah) end as jumlah from(
                    with cte as(
                    select d as tgl
                    from generate_series('$arrminawal[0]', '$arrmaxawal[0]'::timestamp + INTERVAL '0 day', '1 day'::interval) d
                    )
                    select * FROM
                    cte
                    left join(
                    select noregistrasi, norec, tgl as tglapd, jumlah, tglpulang, tglkeluar, ruanganasal, ruangantujuan from (select pd.noregistrasi, apd.norec, apd.tglmasuk as tgl, pd.tglpulang, apd.tglkeluar, count(apd.tglmasuk) as jumlah, ru1.namaruangan ruanganasal, ru.namaruangan ruangantujuan
                    FROM pasiendaftar_t as pd
                    INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                    INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk = 16
                    inner JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk <> 16
                    where pd.kdprofile = $idProfile
                    and pd.statusenabled = true
                    group by apd.tglmasuk, apd.tglkeluar, pd.tglpulang, pd.noregistrasi, apd.norec, ru.namaruangan, ru1.namaruangan
                    ) as x
                                    
                    UNION ALL
                                    
                    select noregistrasi, norec, tgl as tglapd, jumlah, tglpulang, tglkeluar, ruanganasal, ruangantujuan from (select pd.noregistrasi, apd.norec, apd.tglmasuk as tgl, pd.tglpulang, apd.tglkeluar, count(apd.tglmasuk) as jumlah, ru1.namaruangan ruanganasal, ru.namaruangan ruangantujuan
                    FROM pasiendaftar_t as pd
                    INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                    INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk = 16
                    inner JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk = 16
                    where pd.kdprofile = $idProfile
                    and pd.statusenabled = true
                    group by apd.tglmasuk, apd.tglkeluar, pd.tglpulang, pd.noregistrasi, apd.norec, ru.namaruangan, ru1.namaruangan
                    ) as x
                    ) as y on cte.tgl between y.tglapd and coalesce(y.tglkeluar,now())
                ) as e
                group by e.tgl, e.jumlah
                order by e.tgl) as i)
            ) as f group by extract(year from (tgl::date + interval '1 day')::date)"));

        //var_dump($dataKemarin);            

        $data = DB::select(DB::raw("
            select tgl, sum(jumlah) as jumlah from(
                select tgl, jumlah from (select extract(year from apd.tglmasuk) as tgl, count(apd.tglmasuk) as jumlah
                    FROM pasiendaftar_t as pd
                    INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                    INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk = 16
                    inner JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk <> 16
                    where pd.kdprofile = $idProfile 
                    and pd.statusenabled = true
                    and cast(apd.tglmasuk as date) between '$tglAwal' and '$tglAkhir'
                    group by extract(year from apd.tglmasuk)
                ) as x
            ) as f group by tgl"));

        $dataPindah = DB::select(DB::raw("
            select tgl, sum(jumlah) as jumlah from(
                select tgl, jumlah from (select extract(year from apd.tglmasuk) as tgl, count(apd.tglmasuk) as jumlah
                    FROM pasiendaftar_t as pd
                    INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                    INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk = 16
                    INNER JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk = 16
                    where pd.kdprofile = $idProfile 
                    and pd.statusenabled = true
                    and cast(apd.tglmasuk as date) between '$tglAwal' and '$tglAkhir' 
                    group by extract(year from apd.tglmasuk)
                ) as x
            ) as z group by tgl"));

        $dataDipindahkan = DB::select(DB::raw("
            select tgl, sum(jumlah) as jumlah from(select tgl, jumlah from (
                select extract(year from apd.tglkeluar) as tgl, count(apd.tglkeluar) as jumlah
                    FROM pasiendaftar_t as pd
                    INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                    INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk = 16
                    INNER JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk = 16
                    where pd.kdprofile = $idProfile 
                    and pd.statusenabled = true
                    and cast(apd.tglkeluar as date) between '$tglAwal' and '$tglAkhir' 
                    and apd.tglkeluar <> coalesce(pd.tglpulang,now())
                    and apd.tglkeluar > apd.tglmasuk
                    group by extract(year from apd.tglkeluar)
                ) as x
                
                union all
                
                select tgl, jumlah from (
                    select extract(year from apd.tglkeluar) as tgl, count(apd.tglkeluar) as jumlah
                    FROM pasiendaftar_t as pd
                    INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                    INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk = 16
                    INNER JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk <> 16
                    where pd.kdprofile = $idProfile 
                    and pd.statusenabled = true
                    and cast(apd.tglkeluar as date) between '$tglAwal' and '$tglAkhir' 
                    and apd.tglkeluar <> coalesce(pd.tglpulang,now())
                    and apd.tglkeluar > apd.tglmasuk
                    group by extract(year from apd.tglkeluar)
                ) as x
            ) as y group by tgl"));

        $dataMinggal = DB::select(DB::raw("
            select extract(year from pd.tglmeninggal) as tgl, count(pm.namapasien) jumlah
                FROM pasiendaftar_t as pd
                INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
                inner join kondisipasien_m kps on kps.id = pd.objectkondisipasienfk
                inner join ruangan_m ru on ru.id = pd.objectruanganlastfk
                where pd.kdprofile = $idProfile and pd.statusenabled = true
                and cast(pd.tglmeninggal as date) between '$tglAwal' and '$tglAkhir'
                and ru.objectdepartemenfk = 16
            group by extract(year from pd.tglmeninggal)"));

        $dataPulang = DB::select(DB::raw("
            select max(apd.tglkeluar), extract(year from pd.tglpulang) as tgl, count(pd.tglpulang) as jumlah
                FROM pasiendaftar_t as pd
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                inner JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
                where pd.kdprofile = $idProfile and pd.statusenabled = true
                and cast(pd.tglpulang as date) between '$tglAwal' and '$tglAkhir'
                and pd.tglpulang = apd.tglkeluar
                and ru.objectdepartemenfk = 16
                and (pd.objectstatuspulangfk not in (2,3) or pd.objectstatuspulangfk is null)
                and apd.tglmasuk <> apd.tglkeluar
            group by extract(year from pd.tglpulang)"));

        $dataPulangAPS = DB::select(DB::raw("
            select extract(year from pd.tglpulang) as tgl, count(pm.namapasien) jumlah
                FROM pasiendaftar_t as pd
                INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
                INNER JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
                where pd.kdprofile = $idProfile and pd.statusenabled = true
                and cast(pd.tglpulang as date) between '$tglAwal' and '$tglAkhir'
                and pd.objectstatuspulangfk = 2
                and ru.objectdepartemenfk = 16
                and pd.tglpulang is not null
            group by extract(year from pd.tglpulang)"));

        $dataPulangMelarikanDiri = DB::select(DB::raw("
            select extract(year from pd.tglpulang) as tgl, count(pm.namapasien) jumlah
                FROM pasiendaftar_t as pd
                INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
                INNER JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
                where pd.kdprofile = $idProfile and pd.statusenabled = true
                and cast(pd.tglpulang as date) between '$tglAwal' and '$tglAkhir'
                and pd.objectstatuspulangfk = 3
                and ru.objectdepartemenfk = 16
                and pd.tglpulang is not null
            group by extract(year from pd.tglpulang)"));

        $dataMeninggalLebihDari = DB::select(DB::raw("
            select extract(year from pd.tglmeninggal) as tgl, count(pm.namapasien) jumlah
                FROM pasiendaftar_t as pd
                INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
                inner join kondisipasien_m kps on kps.id = pd.objectkondisipasienfk
                inner join ruangan_m ru on ru.id = pd.objectruanganlastfk
                where pd.kdprofile = $idProfile and pd.statusenabled = true
                and cast(pd.tglmeninggal as date) between '$tglAwal' and '$tglAkhir'
                and pd.objectkondisipasienfk = 6
                and ru.objectdepartemenfk = 16
            group by extract(year from pd.tglmeninggal)"));

        $lamadirawat = DB::select(DB::raw("
            select extract(year from y.tgl) as tgl, sum(y.totallama) as jumlah from(
                select x.tgl, sum(x.lamadirawat) as totallama from(
                with cte as (
                    select pdt.norec, min(apdt.tglmasuk::date) tglmasuk from pasiendaftar_t as pdt
                    inner join antrianpasiendiperiksa_t as apdt on apdt.noregistrasifk = pdt.norec
                    inner join ruangan_m as rum on rum.id = apdt.objectruanganfk
                    where rum.objectdepartemenfk = 16
                    and pdt.statusenabled = TRUE
                    and pdt.kdprofile = 30
                    and pdt.tglpulang::date between '$tglAwal' and '$tglAkhir'
                    group by pdt.norec
                )
                
                select pd.tglpulang::date as tgl, cte.tglmasuk as tanggalmasuk,
                case when pd.tglpulang::date-cte.tglmasuk::date = 0 then 1 else  (pd.tglpulang::date-cte.tglmasuk) end as lamadirawat
                    FROM pasiendaftar_t as pd
                    INNER JOIN cte on cte.norec = pd.norec
                    WHERE pd.kdprofile = 30 and pd.tglpulang is not null and cast(pd.tglpulang as date) between '$arrmin[0]' and '$arrmax[0]'
                    group by pd.tglpulang::date, pd.noregistrasi, cte.tglmasuk
                    order by pd.tglpulang::date
                ) as x group by x.tgl
            ) as y group by extract(year from y.tgl);"));


        $ratarata = DB::select(DB::raw("with cte as(
                select extract(year from month) as year, sum(days) as jumlah from(
                    SELECT date_trunc('month',dt) AS month,
                    COUNT(*) as days
                    FROM generate_series( DATE '$tglAwal',DATE '$tglAkhir',interval '1 DAY' )
                    as dt group by date_trunc('month',dt) 
                    order by month
                ) as x group by extract(year from month)
            )
            SELECT extract(year from apd.tglmasuk) as tgl, count(apd.norec), cte.jumlah, round(count(apd.norec)/cte.jumlah) as total
            FROM
            antrianpasiendiperiksa_t apd
            inner join ruangan_m ru on ru.id = apd.objectruanganfk
            inner join cte on cte.year = extract(year from apd.tglmasuk)
            WHERE apd.tglmasuk BETWEEN '$tglAwal' and '$tglAkhir'
            and apd.kdprofile = 30
            and apd.statusenabled=true
            and ru.objectdepartemenfk = 16
            group by extract(year from apd.tglmasuk), cte.jumlah"));

        $jumlahdays = DB::select(DB::raw("SELECT '$tglAkhir'::date - '$tglAwal'::date + 1 as jumlahhari"));
        //var_dump($jumlahdays[0]->jumlahhari);
        $jumlah = $jumlahdays[0]->jumlahhari;

        $jumlahttkalihari = 0;
        $jumlahgrandtotaltt = 0;
        $hari = 0;
        $hariawal = (int) date('d', strtotime($tglAwal));
        $i = 0;
        $j = 0;
        $tracetahun = 1999;
        $datas = [];
        $datatt = [];
        $jumlahfix = 0;

        foreach ($tahunmonthq as $q) {
            //var_dump($jumlah);
            if ($jumlah >= 28) {
                if ($hariawal > 1) {
                    $hari = (cal_days_in_month(CAL_GREGORIAN, date('m', strtotime($q->tahun)), date('Y', strtotime($q->tahun))) - $hariawal + 1);
                    $jumlah -=  $hari;
                    $hariawal = 1;
                    //var_dump($jumlah);
                } else {
                    $hari = cal_days_in_month(CAL_GREGORIAN, date('m', strtotime($q->tahun)), date('Y', strtotime($q->tahun)));
                    $jumlah -= $hari;
                    $hari = cal_days_in_month(CAL_GREGORIAN, date('m', strtotime($q->tahun)), date('Y', strtotime($q->tahun)));
                    //var_dump($jumlah);
                }
            } else {
                $hari = $jumlah;
                //var_dump($jumlah);
            }
            //var_dump($hariawal);
            //var_dump($q);
            //var_dump($hari);

            $jumlahtt = DB::select(DB::raw("select '$q->tahun-$hari' as tanggal, sum(rm.jumlah_tt) as totalperperiode 
                    from riwayatkamar_m rm
                    inner join ruangan_m ru on ru.id = rm.objectruanganfk
                    inner join(
                        select objectruanganfk,objectkamarfk,max(tanggalawal) as tanggal from riwayatkamar_m 
                        where 
                        '$q->tahun-$hari 23:59:59' BETWEEN tanggalawal and COALESCE(tanggalakhir,'$q->tahun-$hari 23:59:59')
                        group by objectruanganfk,objectkamarfk
                    ) as x	
                    on rm.objectruanganfk=x.objectruanganfk and rm.objectkamarfk=x.objectkamarfk and rm.tanggalawal = x.tanggal
                    where rm.kdprofile = $idProfile and rm.statusenabled = true"));

            //var_dump($jumlahtt);
            if (date('Y', strtotime($q->tahun)) != $tracetahun) {
                $datas[$i]['tahun'] = date('Y', strtotime($q->tahun));
                $tracetahun = date('Y', strtotime($q->tahun));
                $i++;
            }

            if ($tracetahun == date('Y', strtotime($q->tahun))) {
                $datatt[$j]['jumlahttkalihari'] = $hari * $jumlahtt[0]->totalperperiode;
                $datatt[$j]['jumlahgrandtotaltt'] = $jumlahtt[0]->totalperperiode;
                $datatt[$j]['tahun'] = date('Y', strtotime($q->tahun));
                $j++;
            }

            $jumlahfix += $hari * $jumlahtt[0]->totalperperiode;

            //var_dump($jumlahfix);

            //var_dump($q->tahun);
            //var_dump($hari);
        }

        // var_dump($datatt);
        // var_dump($datas);
        // var_dump($data);

        $bor = 0;
        $alos = 0;
        $toi = 0;
        $bto = 0;
        $ndr = 0;
        $gdr = 0;
        $jumlahpasienpindah = 0;
        $jumlahpasienawal = 0;
        $jumlahpasienmasuk = 0;
        $jumlahpasiendipindahkan = 0;
        $jumlahpasienmeninggal = 0;
        $jumlahpasienpulang = 0;
        $jumlahpasienmeninggallebihdari = 0;
        $jumlahpindah = 0;
        $jumlahmasuk = 0;
        $jumlahhariperawatan = 0;
        $jumlahpulang = 0;
        $jumlahpasienpulangaps = 0;
        $jumlahpasienpulangmelarikandiri = 0;
        $jumlahtttotal = 0;
        $jumlahbortt = 0;
        $jumlahborhariperawatan = 0;
        $jumlahharidirawat = 0;
        $tt = 0;
        $ttperperiode = 0;
        $hasilrata = 0;

        foreach ($datas as $thn) {

            $tt = 0;
            $ttperperiode = 0;
            // $tt = $data10[$i]['jumlahgrandtotaltt'];
            // $ttperperiode = $data10[$i]['jumlahttkalihari'];

            foreach ($datatt as $dtt) {

                if ($thn['tahun'] == $dtt['tahun']) {
                    $tt += $dtt['jumlahgrandtotaltt'];
                    $ttperperiode += $dtt['jumlahttkalihari'];
                    // var_dump( $dtt['tahun']);
                    // var_dump( $ttperperiode);
                }
            }

            foreach ($dataKemarin as $awal) {
                if ($thn['tahun'] == $awal->tgl) {
                    $jumlahpasienawal = $awal->jumlah;
                }
            }

            foreach ($data as $masuk) {
                if ($thn['tahun'] == $masuk->tgl) {
                    $jumlahpasienmasuk = $masuk->jumlah;
                }
            }

            foreach ($dataPindah as $pindah) {
                if ($thn['tahun'] == $pindah->tgl) {
                    $jumlahpasienpindah = $pindah->jumlah;
                }
            }

            foreach ($dataDipindahkan as $dipindah) {
                if ($thn['tahun'] == $dipindah->tgl) {
                    $jumlahpasiendipindahkan = $dipindah->jumlah;
                }
            }

            foreach ($dataMinggal as $meninggal) {
                if ($thn['tahun'] == $meninggal->tgl) {
                    $jumlahpasienmeninggal = $meninggal->jumlah;
                }
            }

            foreach ($dataPulang as $pulang) {
                if ($thn['tahun'] == $pulang->tgl) {
                    $jumlahpasienpulang = $pulang->jumlah;
                }
            }

            foreach ($dataPulangAPS as $pulangaps) {
                if ($thn['tahun'] == $pulangaps->tgl) {
                    $jumlahpasienpulangaps = $pulangaps->jumlah;
                }
            }

            foreach ($dataPulangMelarikanDiri as $pulanglari) {
                if ($thn['tahun'] == $pulanglari->tgl) {
                    $jumlahpasienpulangmelarikandiri = $pulanglari->jumlah;
                }
            }

            foreach ($dataMeninggalLebihDari as $meninggallebih) {
                if ($thn['tahun'] == $meninggallebih->tgl) {
                    $jumlahpasienmeninggallebihdari = $meninggallebih->jumlah;
                }
            }

            foreach ($lamadirawat as $lama) {
                if ($thn['tahun'] == $lama->tgl) {
                    $jumlahharidirawat = $lama->jumlah;
                }
            }

            foreach ($ratarata as $rata) {
                if ($thn['tahun'] == $rata->tgl) {
                    $hasilrata = $rata->total;
                }
            }


            $jumlahhariperawatantt = $jumlahpasienawal + $jumlahpasienmasuk + $jumlahpasienpindah;
            $jumlahpulang = $jumlahpasiendipindahkan + $jumlahpasienpulang + $jumlahpasienpulangaps + $jumlahpasienpulangmelarikandiri;
            $jumlahpulangsementara = $jumlahpasienpulang + $jumlahpasienpulangaps + $jumlahpasienpulangmelarikandiri;

            // var_dump($jumlahharidirawat);
            // var_dump($jumlahpulang);
            // var_dump($tt);
            // var_dump($ttperperiode);



            if ($jumlahpulang == 0) {
                $bor = $jumlahhariperawatantt / $ttperperiode * 100;
                $alos = 0;
                $toi = 0;
                $bto = $jumlahpulangsementara / $tt;
                $ndr = 0;
                $gdr = 0;
            } else {
                $bor = $jumlahhariperawatantt / $ttperperiode * 100;
                $alos = $jumlahharidirawat / $jumlahpulangsementara;
                $toi = ($ttperperiode - $jumlahhariperawatantt) / $jumlahpulangsementara;
                $bto = $jumlahpulangsementara / $tt;
                $ndr = $jumlahpasienmeninggallebihdari / $jumlahpulangsementara * 1000;
                $gdr = $jumlahpasienmeninggal / $jumlahpulangsementara * 1000;
            }



            $data10[] = array(
                'bor' => (float) number_format($bor, 2),
                'alos' => (float) number_format($alos, 2),
                'bto' => (float) number_format($bto, 2),
                'toi' => (float)number_format($toi, 2),
                'gdr' => (float)number_format($gdr, 2),
                'ndr' => (float) number_format($ndr, 2),
                'tahun' => $thn['tahun'],
                'hasil' => (float) number_format($hasilrata, 2),
            );
        }

        $result = array(
            'data' => $data10,
            'message' => 'as@cepot',
        );
        return $this->respond($result);
    }

    public function getDataRL31RawatInapNewOld(Request $request)
    {
        $idProfile = (int) $this->getDataKdProfile($request);
        $idDepRaJal = (int) $this->settingDataFixed('KdDepartemenRawatJalan', $idProfile);
        $idDepRanap = (int) $this->settingDataFixed('idDepRawatInap', $idProfile);
        $idStatKelMeninggal = (int) $this->settingDataFixed('KdStatKeluarMeninggal', $idProfile);
        $idKondisiPasienMeninggal = (int) $this->settingDataFixed('KdKondisiPasienMeninggal', $idProfile);
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $tahun = new \DateTime($tglAkhir);
        $tahun = date('Y');
        $datetime1 = new \DateTime($tglAwal);
        $datetime2 = new \DateTime($tglAkhir);
        $interval = $datetime1->diff($datetime2);
        $sehari = 1; //$interval->format('%d');
        $data10 = [];
        $jumlahTT = collect(DB::select("SELECT
                    tt.id,
                    tt.objectstatusbedfk
            FROM
                    tempattidur_m AS tt
            INNER JOIN kamar_m AS kmr ON kmr.id = tt.objectkamarfk
            INNER JOIN ruangan_m AS ru ON ru.id = kmr.objectruanganfk
            WHERE
                    tt.kdprofile = $idProfile
            AND tt.statusenabled = true
            AND kmr.statusenabled = true
            AND tt.reportdisplay NOT ILIKE '%cadangan%'
            "))->count();
        if ($jumlahTT == 0) {
            $data10[] = array(
                'lamarawat' => 0,
                'hariperawatan' => 0,
                'pasienpulang' => 0,
                'meninggal' => 0,
                'matilebih48' =>  0,
                'tahun' => 0,
                'bulan' => date('d-M-Y'), //(float)$item->bulanregis ,
                'bor' => 0,
                'alos' => 0,
                'bto' => 0,
                'toi' =>  0,
                'gdr' => 0,
                'ndr' =>  0,
            );

            return $data10;
        }

        $hariPerawatan = DB::select(DB::raw(
            "
           SELECT   COUNT (x.noregistrasi) AS jumlahhariperawatan
            FROM
            (
                SELECT
                    pd.noregistrasi,
                    pd.tglpulang,
                    to_char ( pd.tglregistrasi,'mm') AS bulanregis
                FROM
                    pasiendaftar_t AS pd
                INNER JOIN ruangan_m AS ru ON ru.ID = pd.objectruanganlastfk
                WHERE
                    ru.objectdepartemenfk = $idDepRanap
                    and pd.kdprofile = $idProfile
            and (  (pd.tglregistrasi < '$tglAwal' AND pd.tglpulang >= '$tglAkhir' )
               or pd.tglpulang is null
            )

            and pd.statusenabled = true
            ) AS x"
        ));
        // dd($hariPerawatan);
        $lamaRawat = DB::select(DB::raw("
                        select sum(x.hari) as lamarawat, count(x.noregistrasi)as jumlahpasienpulang from (
                        SELECT
                            date_part('DAY', pd.tglpulang- pd.tglregistrasi) as hari ,pd.noregistrasi
                            FROM
                                    pasiendaftar_t AS pd
                        --  INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
                            INNER JOIN ruangan_m AS ru ON ru. ID = pd.objectruanganlastfk
                            WHERE pd.kdprofile = $idProfile and
                            pd.tglpulang BETWEEN '$tglAwal'
                                AND '$tglAkhir'
                            and pd.tglpulang is not null
                            and pd.statusenabled=true
                            and  ru.objectdepartemenfk = $idDepRanap
                            GROUP BY pd.noregistrasi,pd.tglpulang,pd.tglregistrasi
                        -- order by pd.noregistrasi
                    ) as x
                "));


        $dataMeninggal = DB::select(DB::raw("select count(x.noregistrasi) as jumlahmeninggal, x.bulanregis,
                count(case when x.objectkondisipasienfk = $idKondisiPasienMeninggal then 1 end ) AS jumlahlebih48 FROM
                (
                select noregistrasi,to_char(tglregistrasi , 'mm')  as bulanregis ,statuskeluar,kondisipasien,objectkondisipasienfk
                from pasiendaftar_t
                join statuskeluar_m on statuskeluar_m.id =pasiendaftar_t.objectstatuskeluarfk
                left join kondisipasien_m on kondisipasien_m.id =pasiendaftar_t.objectkondisipasienfk
                where pasiendaftar_t.kdprofile = $idProfile and objectstatuskeluarfk = $idStatKelMeninggal
                and  tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir'
                and pasiendaftar_t.statusenabled=true
                ) as x
                GROUP BY x.bulanregis;"));
        //        return $this->respond($dataMeninggal);
        $ratarata = DB::select(DB::raw("with cte as(
            select extract(year from month) as year, sum(days) as jumlah from(
                SELECT date_trunc('month',dt) AS month,
                COUNT(*) as days
                FROM generate_series( DATE '$tglAwal',DATE '$tglAkhir',interval '1 DAY' )
                as dt group by date_trunc('month',dt) 
                order by month
            ) as x group by extract(year from month)
        )
        SELECT extract(year from apd.tglmasuk) as tgl, count(apd.norec), cte.jumlah, round(count(apd.norec)/cte.jumlah) as total
        FROM
        antrianpasiendiperiksa_t apd
        inner join ruangan_m ru on ru.id = apd.objectruanganfk
        inner join cte on cte.year = extract(year from apd.tglmasuk)
        WHERE apd.tglmasuk BETWEEN '$tglAwal' and '$tglAkhir'
        and apd.kdprofile = $idProfile
        and apd.statusenabled=true
        and ru.objectdepartemenfk = 16
        group by extract(year from apd.tglmasuk), cte.jumlah"));
        $year = Carbon::now()->year;
        $num_of_days = [];
        if ($year == date('Y'))
            $total_month = date('m');
        else
            $total_month = 12;

        for ($m = 1; $m <= $total_month; $m++) {
            $num_of_days[] = array(
                'bulan' =>  $m,
                'jumlahhari' =>  cal_days_in_month(CAL_GREGORIAN, $m, $year),
            );
        }
        $bor = 0;
        $alos = 0;
        $toi = 0;
        $bto = 0;
        $ndr = 0;
        $gdr = 0;
        $hariPerawatanJml = 0;
        $jmlPasienPlg = 0;
        $jmlLamaRawat = 0;
        $jmlMeninggal = 0;
        $jmlMatilebih48 = 0;
        $hasilRata = 0;
        foreach ($hariPerawatan as $item) {
            foreach ($lamaRawat as $itemLamaRawat) {
                foreach ($dataMeninggal as $itemDead) {
                    if ($itemLamaRawat->jumlahpasienpulang == 0) {
                        $itemLamaRawat->jumlahpasienpulang  = 1;
                    }
                    if ($itemDead->jumlahmeninggal == 0) {
                        $itemDead->jumlahmeninggal = 1;
                    }
                    if ($itemDead->jumlahlebih48 == 0) {
                        $itemDead->jumlahlebih48 = 1;
                    }
                    //                         if ($item->bulanregis == $itemLamaRawat->bulanpulang &&
                    //                             $itemLamaRawat->bulanpulang == $itemDead->bulanregis ) {
                    /** @var  $gdr = (Jumlah Mati dibagi Jumlah pasien Keluar (Hidup dan Mati) */
                    $gdr = (int) $itemDead->jumlahmeninggal * 1000 / (int)$itemLamaRawat->jumlahpasienpulang;
                    /** @var  $NDR = (Jumlah Mati > 48 Jam dibagi Jumlah pasien Keluar (Hidup dan Mati) */
                    $ndr = (int) $itemDead->jumlahlebih48 * 1000 / (int)$itemLamaRawat->jumlahpasienpulang;

                    $jmlMeninggal = (int) $itemDead->jumlahmeninggal;
                    $jmlMatilebih48 = (int) $itemDead->jumlahlebih48;
                    //                         }
                }
                //                if ($item->bulanregis == $itemLamaRawat->bulanpulang ) {
                /** @var  $alos = (Jumlah Lama Dirawat dibagi Jumlah pasien Keluar (Hidup dan Mati) */
                //                return $this->respond($itemLamaRawat->jumlahpasienpulang );
                if ((int)$itemLamaRawat->jumlahpasienpulang > 0) {
                    $alos = (int)$itemLamaRawat->lamarawat / (int)$itemLamaRawat->jumlahpasienpulang;
                }

                /** @var  $bto = Jumlah pasien Keluar (Hidup dan Mati) DIBAGI Jumlah tempat tidur */
                $bto = (int)$itemLamaRawat->jumlahpasienpulang / $jumlahTT;

                //                }
                //                foreach ($num_of_days as $numday){
                //                    if ($numday['bulan'] == $item->bulanregis){
                /** @var  $bor = (Jumlah hari perawatn RS dibagi ( jumlah TT x Jumlah hari dalam satu periode ) ) x 100 % */
                $bor = ((int)$item->jumlahhariperawatan * 100 / ($jumlahTT *  (float)$sehari)); //$numday['jumlahhari']));
                /** @var  $toi = (Jumlah TT X Periode) - Hari Perawatn DIBAGI Jumlah pasien Keluar (Hidup dan Mati)*/
                //                        $toi = ( ( $jumlahTT * $numday['jumlahhari'] )- (int)$item->jumlahhariperawatan ) /(int)$itemLamaRawat->jumlahpasienpulang ;
                if ((int)$itemLamaRawat->jumlahpasienpulang > 0) {
                    $toi = (($jumlahTT * (float)$sehari) - (int)$item->jumlahhariperawatan) / (int)$itemLamaRawat->jumlahpasienpulang;
                }
                $hariPerawatanJml = (int)$item->jumlahhariperawatan;
                $jmlPasienPlg = (int)$itemLamaRawat->jumlahpasienpulang;
                //                    }
                //                }
                foreach ($ratarata as $rata) {
                    $hasilRata = $rata->total;
                }
            }

            $data10[] = array(
                'lamarawat' => (int)$itemLamaRawat->lamarawat,
                'hariperawatan' => $hariPerawatanJml,
                'pasienpulang' => $jmlPasienPlg,
                'meninggal' => $jmlMeninggal,
                'matilebih48' =>  $jmlMatilebih48,
                'tahun' => $tahun,
                'ratarataperhari' => $hasilRata,
                'bulan' => date('d-M-Y'), //(float)$item->bulanregis ,
                'bor' => (float) number_format($bor, 2),
                'alos' => (float) number_format($alos, 2),
                'bto' => (float) number_format($bto, 2),
                'toi' => (float)number_format($toi, 2),
                'gdr' => (float)number_format($gdr, 2),
                'ndr' => (float) number_format($ndr, 2),
                'hasil' => (float) number_format($hasilRata, 2),
            );
        }

        $result = array(
            'data' => $data10,
            'message' => 'as@cepot',
        );
        return $this->respond($result);
    }

    function getDataRL31RawatInapNew(Request $request)
    {
        $tglAwal = $request['tahun'] . '-' . $request['bulan'] . '-' . '01';
        $th = $request['bulan'];
        $bl = $request['tahun'];
        $tanggal = DB::select(DB::raw("
            select d::date as tgl
            from generate_series('$tglAwal', '$tglAwal'::date + INTERVAL '1 MONTH - 1 day', '1 day'::interval) d
        "));

        $tanggalmin = DB::select(DB::raw("
            select min(d::date) as tglmin
            from generate_series('$tglAwal', '$tglAwal'::date + INTERVAL '1 MONTH - 1 day', '1 day'::interval) d
        "));

        $tanggalmax = DB::select(DB::raw("
            select max(d::date) as tglmax
            from generate_series('$tglAwal', '$tglAwal'::date + INTERVAL '1 MONTH - 1 day', '1 day'::interval) d
        "));

        $arr = [];
        foreach ($tanggal as $row) {
            $arr[] =  $row->tgl;
        }
        $arrmin = [];
        foreach ($tanggalmin as $rowmin) {
            $arrmin[] =  $rowmin->tglmin;
        }
        $arrmax = [];
        foreach ($tanggalmax as $rowmax) {
            $arrmax[] =  $rowmax->tglmax;
        }


        $tanggalminawal = DB::select(DB::raw("select '$arrmin[0] 23:59:59'::timestamp - interval '1 day ' as tgl"));

        $arrminawal = [];
        foreach ($tanggalminawal as $rowminawal) {
            $arrminawal[] =  $rowminawal->tgl;
        }
        $jumlahtt = DB::select(DB::raw("select '$tglAwal' as tanggal, sum(rm.jumlah_tt) as totalperperiode 
                from riwayatkamar_m rm
                inner join ruangan_m ru on ru.id = rm.objectruanganfk
                inner join(
                    select objectruanganfk,objectkamarfk,max(tanggalawal) as tanggal from riwayatkamar_m
                    where 
                    '$arrmax[0] ' BETWEEN tanggalawal and COALESCE(tanggalakhir,'$arrmax[0] ')
                    group by objectruanganfk,objectkamarfk
                ) as x	
                on rm.objectruanganfk=x.objectruanganfk and rm.objectkamarfk=x.objectkamarfk and rm.tanggalawal = x.tanggal
                where rm.kdprofile = 30 and rm.statusenabled = true
                "));

        $date_series = DB::select(DB::raw("
        WITH date_series AS (
        SELECT generate_series('$arrmin[0]'::date, '$arrmin[0]'::date + INTERVAL '1 month - 1 day', '1 day')::date AS series_date
        )
        SELECT date_part('day', series_date::date)as date FROM date_series
        order by date_series asc
        ;
        "));

        $pasienawalRS = DB::select(DB::raw("
        select  jml, tglinput, date_part('day', tglinput::date)as tgl from pasienawalrs_temp where tglinput::date between '$arrmin[0]' and '$arrmax[0]' 
        GROUP BY jml ,tglinput
        order by tglinput asc
        "));

        $pasienmasuk = DB::select(DB::raw("
        select date_part('day', pd.tglregistrasi::date ) as tgl , count(pd.noregistrasi) as jml from pasiendaftar_t pd 
        inner join ruangan_m ru on ru.id = pd.objectruanganlastfk
        where pd.kdprofile = 30 and pd.statusenabled = true and date_part('month', pd.tglregistrasi::date ) = $th and date_part('year', pd.tglregistrasi::date ) = $bl  and ru.objectdepartemenfk = 16
        group by pd.tglregistrasi::date
        order by pd.tglregistrasi::date asc
        "));

        $pasienaps = DB::select(DB::raw("select count(pd.noregistrasi)as jml, date_part('day', pd.tglpulang::date)as tgl from pasiendaftar_t pd where pd.objectstatuspulangfk = 2 and pd.objectkondisipasienfk not in(6,5) and date_part('month', pd.tglpulang)= $th and date_part('year', pd.tglpulang)=$bl and pd.kdprofile = 30 and pd.statusenabled = true
        GROUP BY pd.tglpulang::date
        order by pd.tglpulang::date asc
        "));
        $pasienapd = DB::select(DB::raw("select count(pd.noregistrasi)as jml, date_part('day', pd.tglpulang::date)as tgl from pasiendaftar_t pd where pd.objectstatuspulangfk in (1,6) and pd.objectkondisipasienfk not in(6,5)and date_part('month', pd.tglpulang)= $th and date_part('year', pd.tglpulang)=$bl and pd.kdprofile = 30 and pd.statusenabled = true
        GROUP BY pd.tglpulang::date
        order by pd.tglpulang::date asc
        "));
        $pasienrujuk = DB::select(DB::raw("select count(pd.noregistrasi)as jml, date_part('day', pd.tglpulang::date)as tgl from pasiendaftar_t pd where pd.objectstatuspulangfk in (4,5,10,11) and pd.objectkondisipasienfk not in(6,5) and date_part('month', pd.tglpulang)= $th and date_part('year', pd.tglpulang)=$bl and pd.kdprofile = 30 and pd.statusenabled = true
        GROUP BY pd.tglpulang::date
        order by pd.tglpulang::date asc
        "));
        $pasienlari = DB::select(DB::raw("select count(pd.noregistrasi)as jml, date_part('day', pd.tglpulang::date)as tgl from pasiendaftar_t pd where pd.objectstatuspulangfk = 3 and pd.objectkondisipasienfk not in(6,5) and date_part('month', pd.tglpulang)= $th and date_part('year', pd.tglpulang)=$bl and pd.kdprofile = 30 and pd.statusenabled = true
        GROUP BY pd.tglpulang::date
        order by pd.tglpulang::date asc
        "));
        $pasiendropping = DB::select(DB::raw("select count(pd.noregistrasi)as jml, date_part('day', pd.tglpulang::date)as tgl from pasiendaftar_t pd where pd.objectstatuspulangfk = 12 and date_part('month', pd.tglpulang)= $th and date_part('year', pd.tglpulang)=$bl and pd.kdprofile = 30 and pd.statusenabled = true
        GROUP BY pd.tglpulang::date
        order by pd.tglpulang::date asc
        "));
        $pasienlbh48 = DB::select(DB::raw("
        select count(pd.noregistrasi)as jml, date_part('day', pd.tglpulang::date)as tgl from pasiendaftar_t pd where pd.objectkondisipasienfk= 6 and date_part('month', pd.tglpulang)= $th and date_part('year', pd.tglpulang)=$bl and pd.kdprofile = 30 and pd.statusenabled = true
        GROUP BY pd.tglpulang::date"));
        $pasienkrg48 = DB::select(DB::raw("
        select count(pd.noregistrasi)as jml, date_part('day', pd.tglpulang::date)as tgl from pasiendaftar_t pd where pd.objectkondisipasienfk= 5 and date_part('month', pd.tglpulang)= $th and date_part('year', pd.tglpulang)=$bl and pd.kdprofile = 30 and pd.statusenabled = true
        GROUP BY pd.tglpulang::date"));
        $pasienmkhs = DB::select(DB::raw("
        select date_part('day', pd.tglregistrasi::date ) as tgl , count(pd.noregistrasi) as jml from pasiendaftar_t pd 
        inner join ruangan_m ru on ru.id = pd.objectruanganlastfk
        where pd.kdprofile = 30 and pd.statusenabled = true and date_part('month', pd.tglregistrasi::date ) =$th and date_part('year', pd.tglregistrasi::date ) = $bl  and ru.objectdepartemenfk = 16 and pd.tglpulang::date = pd.tglregistrasi::date
        group by pd.tglregistrasi::date
        order by pd.tglregistrasi::date asc"));
        $los = DB::select(DB::raw("SELECT sum(x.jml)::integer as jml, x.tgl FROM (select date_part('day', pd.tglpulang::date ) as tgl , case when pd.tglpulang::date = pd.tglregistrasi::date then 1 else sum(pd.tglpulang::date - pd.tglregistrasi::date) end as jml from pasiendaftar_t pd 
        inner join ruangan_m ru on ru.id = pd.objectruanganlastfk
        where pd.kdprofile = 30 and pd.statusenabled = true and date_part('month', pd.tglpulang::date ) =$th and date_part('year', pd.tglpulang::date ) = $bl  and ru.objectdepartemenfk = 16 and pd.tglpulang is not null
        GROUP BY pd.tglregistrasi, pd.tglpulang
        )as x
        GROUP BY x.tgl
        order by x.tgl asc"));
        $data = [];
        $pasienAwal = 0;
        $pasienMasuk = 0;
        $pasienAPS = 0;
        $pasienAPD = 0;
        $pasienRujuk = 0;
        $pasienLari = 0;
        $pasienDropping = 0;
        $jumlahpasienpulang = 0;
        $pasienLBH48 = 0;
        $pasienKRG48 = 0;
        $jumlahsisapasien = 0;
        $pasienMKHS = 0;
        $hariPerawatan = 0;
        $LOS = 0;

        $tgl = 0;
        $detail = [];
        foreach ($date_series as $date) {
            $pasienAwal = 0;
            $pasienMasuk = 0;
            $pasienAPS = 0;
            $pasienAPD = 0;
            $pasienRujuk = 0;
            $pasienLari = 0;
            $pasienDropping = 0;
            $jumlahpasienpulang = 0;
            $pasienLBH48 = 0;
            $pasienKRG48 = 0;
            $jumlahpasienmeninggal = 0;
            $jumlahpasienkeluarrs = 0;
            $jumlahsisapasien = 0;
            $pasienMKHS = 0;
            $hariPerawatan = 0;
            $LOS = 0;
            $jumlah = 0;
            foreach ($pasienawalRS as $psa) {
                if ($date->date == $psa->tgl) {
                    $pasienAwal = $psa->jml;
                }
            }
            foreach ($pasienmasuk as $psm) {
                if ($date->date == $psm->tgl) {
                    $pasienMasuk = $psm->jml;
                }
            }
            foreach ($pasienaps as $psaps) {
                if ($date->date == $psaps->tgl) {
                    $pasienAPS = $psaps->jml;
                }
            }
            foreach ($pasienapd as $psapd) {
                if ($date->date == $psapd->tgl) {
                    $pasienAPD = $psapd->jml;
                }
            }
            foreach ($pasienrujuk as $psrujuk) {
                if ($date->date == $psrujuk->tgl) {
                    $pasienRujuk = $psrujuk->jml;
                }
            }
            foreach ($pasienlari as $pslari) {
                if ($date->date == $pslari->tgl) {
                    $pasienLari = $pslari->jml;
                }
            }
            foreach ($pasiendropping as $psdrop) {
                if ($date->date == $psdrop->tgl) {
                    $pasienDropping = $psdrop->jml;
                }
            }
            foreach ($pasienlbh48 as $pslbh48) {
                if ($date->date == $pslbh48->tgl) {
                    $pasienLBH48 = $pslbh48->jml;
                }
            }
            foreach ($pasienkrg48 as $pskrg48) {
                if ($date->date == $pskrg48->tgl) {
                    $pasienKRG48 = $pskrg48->jml;
                }
            }
            foreach ($pasienmkhs as $psmkhs) {
                if ($date->date == $psmkhs->tgl) {
                    $pasienMKHS = $psmkhs->jml;
                }
            }
            foreach ($los as $l) {
                if ($date->date == $l->tgl) {
                    $LOS = $l->jml;
                }
            }
            $jumlah = $pasienAwal + $pasienMasuk;
            $jumlahpasienpulang = $pasienAPS + $pasienAPD + $pasienRujuk + $pasienLari + $pasienDropping;
            $jumlahpasienmeninggal = $pasienKRG48 + $pasienLBH48;
            $jumlahpasienkeluarrs = $jumlahpasienpulang + $jumlahpasienmeninggal;
            $jumlahsisapasien = $jumlah - $jumlahpasienkeluarrs;
            $hariPerawatan = $jumlahsisapasien + $pasienMKHS;
            $detail[] = array(
                'tgl' => $date->date,
                'pasienawal' => $pasienAwal,
                'pasienmasuk' => $pasienMasuk,
                'jumlah' => $jumlah,
                'pasienaps' => $pasienAPS,
                'pasienapd' => $pasienAPD,
                'pasienrujuk' => $pasienRujuk,
                'pasienlari' => $pasienLari,
                'pasiendropping' => $pasienDropping,
                'jumlahpasienpulang' => $jumlahpasienpulang,
                'pasienlbh48' => $pasienLBH48,
                'pasienkrg48' => $pasienKRG48,
                'jumlahpasienmeninggal' => $jumlahpasienmeninggal,
                'jumlahpasienkeluarrs' => $jumlahpasienkeluarrs,
                'jumlahsisapasien' => $jumlahsisapasien,
                'pasienmkhs' => $pasienMKHS,
                'hariperawatan' => $hariPerawatan,
                'los' => $LOS,

            );
        }

        // $rumusakhir = [];
        $sumhariperawatan = 0;
        $sumlos = 0;
        $sumjumlahpasienkeluarrs = 0;
        $sumjumlahpasienmeninggal = 0;
        $sumpasienlbh48 = 0;
        foreach ($detail as $dt) {
            $sumhariperawatan += $dt['hariperawatan'];
            $sumlos += $dt['los'];
            $sumjumlahpasienkeluarrs += $dt['jumlahpasienkeluarrs'];
            $sumjumlahpasienmeninggal += $dt['jumlahpasienmeninggal'];
            $sumpasienlbh48 += $dt['pasienlbh48'];
        }

        $rumusakhir = [
            'sumhariperawatan' => $sumhariperawatan,
            'sumlos' => $sumlos,
            'sumjumlahpasienkeluarrs' => $sumjumlahpasienkeluarrs,
            'sumjumlahpasienmeninggal' => $sumjumlahpasienmeninggal,
            'sumpasienlbh48' => $sumpasienlbh48
        ];

        $ttlTempatTidur = $jumlahtt[0]->totalperperiode;
        $tanggal = $jumlahtt[0]->tanggal;
        $tahun = (int) date('Y', strtotime($tanggal));

        $dataLength = count($detail);

        $bortt = ($rumusakhir['sumhariperawatan'] / ($ttlTempatTidur * $dataLength) * 100);
        $borttFormatted = number_format($bortt, 2) . '%';
        // return $borttFormatted;
        $los = ($rumusakhir['sumlos'] / $rumusakhir['sumjumlahpasienkeluarrs']);
        $losFormatted = number_format($los, 2);
        // return $losFormatted;
        $toi = ((($ttlTempatTidur * $dataLength) - $rumusakhir['sumhariperawatan']) / $rumusakhir['sumjumlahpasienkeluarrs']);
        $toiFormatted = number_format($toi, 2);
        // return $toiFormatted;
        $bto = ($rumusakhir['sumjumlahpasienkeluarrs'] / $ttlTempatTidur);
        $btoFormatted = number_format($bto, 2);
        // return $btoFormatted;
        $ndr = ($rumusakhir['sumpasienlbh48'] / $rumusakhir['sumjumlahpasienkeluarrs']);
        $ndrFormatted = number_format($ndr, 2) . ' permill';
        // return $ndrFormatted;
        $gdr = ($rumusakhir['sumjumlahpasienmeninggal'] / $rumusakhir['sumjumlahpasienkeluarrs']);
        $gdrFormatted = number_format($gdr, 2) . ' permill';

        $data10[] = array(
            'kdrs' => '3404022',
            'kdprov' => '24',
            'kabkota' => 'Kab. Sleman',
            'tahun' => $tahun,
            'bor' => $borttFormatted,
            'alos' => $losFormatted,
            'toi' => $toiFormatted,
            'bto' => $btoFormatted,
            'ndr' => $ndrFormatted,
            'gdr' => $gdrFormatted,
        );

        $result = [
            'data' => $data10,
            'message' => '@epic',
        ];

        return $this->respond($result);
    }



    public function getDataRL31RawatInapPerBangsal(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $tglAwalc = Carbon::parse($tglAwal)->format('Y-m-d');
        $tglAkhirc = Carbon::parse($tglAkhir)->format('Y-m-d');

        $data10 = [];

        $tanggalmin = DB::select(DB::raw("
            select min(d::date) as tglmin
            from generate_series('$tglAwal', '$tglAwal'::date + INTERVAL '1 MONTH - 1 day', '1 day'::interval) d
        "));

        $tanggalmax = DB::select(DB::raw("
            select min(d::date) as tglmax
            from generate_series('$tglAkhir', '$tglAkhir'::date + INTERVAL '1 MONTH - 1 day', '1 day'::interval) d
        "));

        $monthtahunmonth = (int) date('m', strtotime($tglAwal));
        $yeartahunmonth = (int) date('Y', strtotime($tglAwal));


        $tahunmonthq = DB::select(DB::raw("select to_char(daterange::date, 'YYYY-mm') as tahun
        from generate_series('$yeartahunmonth-$monthtahunmonth-01'::date, '$tglAkhir'::date, '1 month') as daterange"));

        $arrmin = [];
        foreach ($tanggalmin as $rowmin) {
            $arrmin[] =  $rowmin->tglmin;
        }
        $arrmax = [];
        foreach ($tanggalmax as $rowmax) {
            $arrmax[] =  $rowmax->tglmax;
        }


        $tanggalminawal = DB::select(DB::raw("select '$arrmin[0] 23:59:59'::timestamp - interval '1 day ' as tgl"));

        $arrminawal = [];
        foreach ($tanggalminawal as $rowminawal) {
            $arrminawal[] =  $rowminawal->tgl;
        }

        $tanggalmaxawal = DB::select(DB::raw("select '$arrmax[0] 23:59:59'::timestamp - interval '1 day ' as tgl"));

        $arrmaxawal = [];
        foreach ($tanggalmaxawal as $rowmaxawal) {
            $arrmaxawal[] =  $rowmaxawal->tgl;
        }



        $dataKemarin = DB::select(DB::raw("select ruangantujuan namaruangan, extract(year from (tgl::date + interval '1 day')::date) as tgl, sum(jumlah) as jumlah from(
                (select ruangantujuan, tgl as tgl,jumlah from (select ruangantujuan, tgl, case when jumlah is null then 0 else sum(jumlah) end as jumlah from(
                    with cte as(
                    select d as tgl
                    from generate_series('$arrminawal[0]', '$arrmaxawal[0]'::timestamp + INTERVAL '0 day', '1 day'::interval) d
                    )
                    select * FROM
                    cte
                    left join(
                    select noregistrasi, norec, tgl as tglapd, jumlah, tglpulang, tglkeluar, ruanganasal, ruangantujuan from (select pd.noregistrasi, apd.norec, apd.tglmasuk as tgl, pd.tglpulang, apd.tglkeluar, count(apd.tglmasuk) as jumlah, ru1.namaruangan ruanganasal, ru.namaruangan ruangantujuan
                    FROM pasiendaftar_t as pd
                    INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                    INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk = 16
                    inner JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk <> 16
                    where pd.kdprofile = $idProfile
                    and pd.statusenabled = true
                    group by apd.tglmasuk, apd.tglkeluar, pd.tglpulang, pd.noregistrasi, apd.norec, ru.namaruangan, ru1.namaruangan
                    ) as x
                                    
                    UNION ALL
                                    
                    select noregistrasi, norec, tgl as tglapd, jumlah, tglpulang, tglkeluar, ruanganasal, ruangantujuan from (select pd.noregistrasi, apd.norec, apd.tglmasuk as tgl, pd.tglpulang, apd.tglkeluar, count(apd.tglmasuk) as jumlah, ru1.namaruangan ruanganasal, ru.namaruangan ruangantujuan
                    FROM pasiendaftar_t as pd
                    INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                    INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk = 16
                    inner JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk = 16
                    where pd.kdprofile = $idProfile
                    and pd.statusenabled = true
                    group by apd.tglmasuk, apd.tglkeluar, pd.tglpulang, pd.noregistrasi, apd.norec, ru.namaruangan, ru1.namaruangan
                    ) as x
                    ) as y on cte.tgl between y.tglapd and coalesce(y.tglkeluar,now())
                ) as e
                group by e.tgl, e.jumlah, e.ruangantujuan
                order by e.tgl) as i)
            ) as f group by extract(year from (tgl::date + interval '1 day')::date), ruangantujuan"));

        //var_dump($dataKemarin);            

        $data = DB::select(DB::raw("
            select namaruangan, tgl, sum(jumlah) as jumlah from(
                select namaruangan, tgl, jumlah from (select ru.namaruangan, extract(year from apd.tglmasuk) as tgl, count(apd.tglmasuk) as jumlah
                    FROM pasiendaftar_t as pd
                    INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                    INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk = 16
                    inner JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk <> 16
                    where pd.kdprofile = $idProfile 
                    and pd.statusenabled = true
                    and cast(apd.tglmasuk as date) between '$tglAwal' and '$tglAkhir'
                    group by ru.namaruangan, extract(year from apd.tglmasuk)
                ) as x
            ) as f group by namaruangan, tgl"));

        $dataPindah = DB::select(DB::raw("
            select namaruangan, tgl, sum(jumlah) as jumlah from(
                select namaruangan, tgl, jumlah from (select ru.namaruangan, extract(year from apd.tglmasuk) as tgl, count(apd.tglmasuk) as jumlah
                    FROM pasiendaftar_t as pd
                    INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                    INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk = 16
                    INNER JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk = 16
                    where pd.kdprofile = $idProfile 
                    and pd.statusenabled = true
                    and cast(apd.tglmasuk as date) between '$tglAwal' and '$tglAkhir' 
                    group by ru.namaruangan, extract(year from apd.tglmasuk)
                ) as x
            ) as z group by namaruangan, tgl"));

        $dataDipindahkan = DB::select(DB::raw("
            select namaruangan, tgl, sum(jumlah) as jumlah from(
                select namaruangan, tgl, jumlah from (
                    select ru.namaruangan, extract(year from apd.tglkeluar) as tgl, count(apd.tglkeluar) as jumlah
                    FROM pasiendaftar_t as pd
                    INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                    INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk = 16
                    INNER JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk = 16
                    where pd.kdprofile = $idProfile 
                    and pd.statusenabled = true
                    and cast(apd.tglkeluar as date) between '$tglAwal' and '$tglAkhir' 
                    and apd.tglkeluar <> coalesce(pd.tglpulang,now())
                    and apd.tglkeluar > apd.tglmasuk
                    group by ru.namaruangan, extract(year from apd.tglkeluar)
                ) as x
                
                union all
                
                select namaruangan, tgl, jumlah from (
                    select ru.namaruangan, extract(year from apd.tglkeluar) as tgl, count(apd.tglkeluar) as jumlah
                    FROM pasiendaftar_t as pd
                    INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                    INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk = 16
                    INNER JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk <> 16
                    where pd.kdprofile = $idProfile 
                    and pd.statusenabled = true
                    and cast(apd.tglkeluar as date) between '$tglAwal' and '$tglAkhir' 
                    and apd.tglkeluar <> coalesce(pd.tglpulang,now())
                    and apd.tglkeluar > apd.tglmasuk
                    group by ru.namaruangan, extract(year from apd.tglkeluar)
                ) as x
            ) as y group by tgl, namaruangan"));

        $dataMinggal = DB::select(DB::raw("
            select ru.namaruangan, extract(year from pd.tglmeninggal) as tgl, count(pm.namapasien) jumlah
                FROM pasiendaftar_t as pd
                INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
                inner join kondisipasien_m kps on kps.id = pd.objectkondisipasienfk
                inner join ruangan_m ru on ru.id = pd.objectruanganlastfk
                where pd.kdprofile = $idProfile and pd.statusenabled = true
                and cast(pd.tglmeninggal as date) between '$tglAwal' and '$tglAkhir'
                and ru.objectdepartemenfk = 16
            group by ru.namaruangan, extract(year from pd.tglmeninggal)"));

        $dataPulang = DB::select(DB::raw("
            select ru.namaruangan, max(apd.tglkeluar), extract(year from pd.tglpulang) as tgl, count(pd.tglpulang) as jumlah
                FROM pasiendaftar_t as pd
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                inner JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
                where pd.kdprofile = $idProfile and pd.statusenabled = true
                and cast(pd.tglpulang as date) between '$tglAwal' and '$tglAkhir'
                and pd.tglpulang = apd.tglkeluar
                and ru.objectdepartemenfk = 16
                and (pd.objectstatuspulangfk not in (2,3) or pd.objectstatuspulangfk is null)
                and apd.tglmasuk <> apd.tglkeluar
            group by ru.namaruangan, extract(year from pd.tglpulang)"));

        $dataPulangAPS = DB::select(DB::raw("
            select ru.namaruangan, extract(year from pd.tglpulang) as tgl, count(pm.namapasien) jumlah
                FROM pasiendaftar_t as pd
                INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
                INNER JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
                where pd.kdprofile = $idProfile and pd.statusenabled = true
                and cast(pd.tglpulang as date) between '$tglAwal' and '$tglAkhir'
                and pd.objectstatuspulangfk = 2
                and ru.objectdepartemenfk = 16
                and pd.tglpulang is not null
            group by ru.namaruangan, extract(year from pd.tglpulang)"));

        $dataPulangMelarikanDiri = DB::select(DB::raw("
            select ru.namaruangan, extract(year from pd.tglpulang) as tgl, count(pm.namapasien) jumlah
                FROM pasiendaftar_t as pd
                INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
                INNER JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
                where pd.kdprofile = $idProfile and pd.statusenabled = true
                and cast(pd.tglpulang as date) between '$tglAwal' and '$tglAkhir'
                and pd.objectstatuspulangfk = 3
                and ru.objectdepartemenfk = 16
                and pd.tglpulang is not null
            group by ru.namaruangan, extract(year from pd.tglpulang)"));

        $dataMeninggalLebihDari = DB::select(DB::raw("
            select ru.namaruangan, extract(year from pd.tglmeninggal) as tgl, count(pm.namapasien) jumlah
                FROM pasiendaftar_t as pd
                INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
                inner join kondisipasien_m kps on kps.id = pd.objectkondisipasienfk
                inner join ruangan_m ru on ru.id = pd.objectruanganlastfk
                where pd.kdprofile = $idProfile and pd.statusenabled = true
                and cast(pd.tglmeninggal as date) between '$tglAwal' and '$tglAkhir'
                and pd.objectkondisipasienfk = 6
                and ru.objectdepartemenfk = 16
            group by ru.namaruangan, extract(year from pd.tglmeninggal)"));

        $lamadirawat = DB::select(DB::raw("
            select y.namaruangan, extract(year from y.tgl) as tgl, sum(y.totallama) as jumlah from(
                select x.namaruangan, x.tgl, sum(x.lamadirawat) as totallama from(
                with cte as (
                    select rum.namaruangan, pdt.norec, min(apdt.tglmasuk::date) tglmasuk from pasiendaftar_t as pdt
                    inner join antrianpasiendiperiksa_t as apdt on apdt.noregistrasifk = pdt.norec
                    inner join ruangan_m as rum on rum.id = apdt.objectruanganfk
                    where rum.objectdepartemenfk = 16
                    and pdt.statusenabled = TRUE
                    and pdt.kdprofile = 30
                    and pdt.tglpulang::date between '$tglAwal' and '$tglAkhir'
                    group by rum.namaruangan, pdt.norec
                )
                
                select cte.namaruangan, pd.tglpulang::date as tgl, cte.tglmasuk as tanggalmasuk,
                case when pd.tglpulang::date-cte.tglmasuk::date = 0 then 1 else  (pd.tglpulang::date-cte.tglmasuk) end as lamadirawat
                    FROM pasiendaftar_t as pd
                    INNER JOIN cte on cte.norec = pd.norec
                    WHERE pd.kdprofile = 30 and pd.tglpulang is not null and cast(pd.tglpulang as date) between '$arrmin[0]' and '$arrmax[0]'
                    group by pd.tglpulang::date, pd.noregistrasi, cte.tglmasuk, cte.namaruangan
                    order by pd.tglpulang::date
                ) as x group by x.namaruangan, x.tgl
            ) as y group by extract(year from y.tgl), y.namaruangan;"));


        $ratarata = DB::select(DB::raw("with cte as(
                select extract(year from month) as year, sum(days) as jumlah from(
                    SELECT date_trunc('month',dt) AS month,
                    COUNT(*) as days
                    FROM generate_series( DATE '$tglAwal',DATE '$tglAkhir',interval '1 DAY' )
                    as dt group by date_trunc('month',dt) 
                    order by month
                ) as x group by extract(year from month)
            )
            SELECT ru.namaruangan, extract(year from apd.tglmasuk) as tgl, count(apd.norec), cte.jumlah, ceil(count(apd.norec)/cte.jumlah) as total
            FROM
            antrianpasiendiperiksa_t apd
            inner join ruangan_m ru on ru.id = apd.objectruanganfk
            inner join cte on cte.year = extract(year from apd.tglmasuk)
            WHERE apd.tglmasuk BETWEEN '$tglAwal' and '$tglAkhir'
            and apd.kdprofile = 30
            and apd.statusenabled=true
            and ru.objectdepartemenfk = 16
            group by ru.namaruangan, extract(year from apd.tglmasuk), cte.jumlah"));

        $ruanganmain = DB::select(DB::raw("select ru.namaruangan
            FROM antrianpasiendiperiksa_t as apd
            INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk = 16
            where apd.statusenabled = true and ru.statusenabled = true
            and apd.kdprofile = 30 and ru.kdprofile = 30
            group by ru.namaruangan"));

        $jumlahdays = DB::select(DB::raw("SELECT '$tglAkhir'::date - '$tglAwal'::date + 1 as jumlahhari"));
        //var_dump($jumlahdays[0]->jumlahhari);
        $jumlah = $jumlahdays[0]->jumlahhari;

        $jumlahttkalihari = 0;
        $jumlahgrandtotaltt = 0;
        $hari = 0;
        $hariawal = (int) date('d', strtotime($tglAwal));
        $i = 0;
        $j = 0;
        $tracetahun = 1999;
        $datas = [];
        $datatt = [];
        $jumlahfix = 0;
        $tracebangsal = 'VIP';

        $jumlahtt = DB::select(DB::raw("select '$tglAkhirc' as tanggal, ru.namaruangan, sum(rm.jumlah_tt) as totalperperiode 
                    from riwayatkamar_m rm
                    inner join ruangan_m ru on ru.id = rm.objectruanganfk
                    inner join(
                        select objectruanganfk,objectkamarfk,max(tanggalawal) as tanggal from riwayatkamar_m 
                        where 
                        '$tglAkhirc 23:59:59' BETWEEN tanggalawal and COALESCE(tanggalakhir,'$tglAkhirc 23:59:59')
                        group by objectruanganfk,objectkamarfk
                    ) as x	
                    on rm.objectruanganfk=x.objectruanganfk and rm.objectkamarfk=x.objectkamarfk and rm.tanggalawal = x.tanggal
                    where rm.kdprofile = $idProfile and rm.statusenabled = true
                    group by ru.namaruangan"));


        for ($x = 0; $x < count($jumlahtt); $x++) {
            $datatt[$x]['jumlahttkalihari'] = $jumlah * $jumlahtt[$x]->totalperperiode;
            $datatt[$x]['jumlahgrandtotaltt'] = $jumlahtt[$x]->totalperperiode;
            $datatt[$x]['namaruangan'] = $jumlahtt[$x]->namaruangan;
        }


        $jumlahfix += $hari * $jumlahtt[0]->totalperperiode;

        // var_dump($datas);
        // var_dump($data);

        $bor = 0;
        $alos = 0;
        $toi = 0;
        $bto = 0;
        $ndr = 0;
        $gdr = 0;
        $jumlahpasienpindah = 0;
        $jumlahpasienawal = 0;
        $jumlahpasienmasuk = 0;
        $jumlahpasiendipindahkan = 0;
        $jumlahpasienmeninggal = 0;
        $jumlahpasienpulang = 0;
        $jumlahpasienmeninggallebihdari = 0;
        $jumlahpindah = 0;
        $jumlahmasuk = 0;
        $jumlahhariperawatan = 0;
        $jumlahpulang = 0;
        $jumlahpasienpulangaps = 0;
        $jumlahpasienpulangmelarikandiri = 0;
        $jumlahtttotal = 0;
        $jumlahbortt = 0;
        $jumlahborhariperawatan = 0;
        $jumlahharidirawat = 0;
        $tt = 0;
        $ttperperiode = 0;
        $hasilrata = 0;

        foreach ($ruanganmain as $thn) {

            $tt = 0;
            $ttperperiode = 0;
            $jumlahpasienpindah = 0;
            $jumlahpasienawal = 0;
            $jumlahpasienmasuk = 0;
            $jumlahpasiendipindahkan = 0;
            $jumlahpasienmeninggal = 0;
            $jumlahpasienpulang = 0;
            $jumlahpasienmeninggallebihdari = 0;
            $jumlahpindah = 0;
            $jumlahmasuk = 0;
            $jumlahhariperawatan = 0;
            $jumlahhariperawatantt = 0;
            $jumlahpulang = 0;
            $jumlahpasienpulangaps = 0;
            $jumlahpasienpulangmelarikandiri = 0;
            $hasilrata = 0;
            // $tt = $data10[$i]['jumlahgrandtotaltt'];
            // $ttperperiode = $data10[$i]['jumlahttkalihari'];

            foreach ($datatt as $dtt) {

                if ($thn->namaruangan == $dtt['namaruangan']) {
                    $tt += $dtt['jumlahgrandtotaltt'];
                    $ttperperiode += $dtt['jumlahttkalihari'];
                    // var_dump( $dtt['tahun']);
                    // var_dump( $ttperperiode);
                }
            }

            foreach ($dataKemarin as $awal) {
                if ($thn->namaruangan == $awal->namaruangan) {
                    $jumlahpasienawal = $awal->jumlah;
                }
            }

            foreach ($data as $masuk) {
                if ($thn->namaruangan == $masuk->namaruangan) {
                    $jumlahpasienmasuk = $masuk->jumlah;
                }
            }

            foreach ($dataPindah as $pindah) {
                if ($thn->namaruangan == $pindah->namaruangan) {
                    $jumlahpasienpindah = $pindah->jumlah;
                }
            }

            foreach ($dataDipindahkan as $dipindah) {
                if ($thn->namaruangan == $dipindah->namaruangan) {
                    $jumlahpasiendipindahkan = $dipindah->jumlah;
                }
            }

            foreach ($dataMinggal as $meninggal) {
                if ($thn->namaruangan == $meninggal->namaruangan) {
                    $jumlahpasienmeninggal = $meninggal->jumlah;
                }
            }

            foreach ($dataPulang as $pulang) {
                if ($thn->namaruangan == $pulang->namaruangan) {
                    $jumlahpasienpulang = $pulang->jumlah;
                }
            }

            foreach ($dataPulangAPS as $pulangaps) {
                if ($thn->namaruangan == $pulangaps->namaruangan) {
                    $jumlahpasienpulangaps = $pulangaps->jumlah;
                }
            }

            foreach ($dataPulangMelarikanDiri as $pulanglari) {
                if ($thn->namaruangan == $pulanglari->namaruangan) {
                    $jumlahpasienpulangmelarikandiri = $pulanglari->jumlah;
                }
            }

            foreach ($dataMeninggalLebihDari as $meninggallebih) {
                if ($thn->namaruangan == $meninggallebih->namaruangan) {
                    $jumlahpasienmeninggallebihdari = $meninggallebih->jumlah;
                }
            }

            foreach ($lamadirawat as $lama) {
                if ($thn->namaruangan == $lama->namaruangan) {
                    $jumlahharidirawat = $lama->jumlah;
                }
            }

            foreach ($ratarata as $rata) {
                if ($thn->namaruangan == $rata->namaruangan) {
                    $hasilrata = $rata->total;
                }
            }


            $jumlahhariperawatantt = $jumlahpasienawal + $jumlahpasienmasuk + $jumlahpasienpindah;
            $jumlahpulang = $jumlahpasiendipindahkan + $jumlahpasienpulang + $jumlahpasienpulangaps + $jumlahpasienpulangmelarikandiri;
            $jumlahpulangsementara = $jumlahpasiendipindahkan + $jumlahpasienpulang + $jumlahpasienpulangaps + $jumlahpasienpulangmelarikandiri;
            //var_dump($jumlahhariperawatantt);
            // var_dump($jumlahharidirawat);
            //var_dump($jumlahpulang);
            // var_dump($tt);
            // var_dump($ttperperiode);



            if ($jumlahpulang == 0 && $ttperperiode != 0 && $tt != 0) {
                $bor = $jumlahhariperawatantt / $ttperperiode * 100;
                $alos = 0;
                $toi = 0;
                $bto = $jumlahpulang / $tt;
                $ndr = 0;
                $gdr = 0;
            } else if ($ttperperiode == 0 && $tt == 0 && $jumlahpulang != 0) {
                $bor = 0;
                $alos = $jumlahharidirawat / $jumlahpulangsementara;
                $toi = ($ttperperiode - $jumlahhariperawatantt) / $jumlahpulang;
                $bto = 0;
                $ndr = $jumlahpasienmeninggallebihdari / $jumlahpulang * 1000;
                $gdr = $jumlahpasienmeninggal / $jumlahpulang * 1000;
            } else if ($ttperperiode == 0 && $tt == 0 && $jumlahpulang == 0) {
                $bor = 0;
                $alos = 0;
                $toi = 0;
                $bto = 0;
                $ndr = 0;
                $gdr = 0;
            } else {
                $bor = $jumlahhariperawatantt / $ttperperiode * 100;
                $alos = $jumlahharidirawat / $jumlahpulangsementara;
                $toi = ($ttperperiode - $jumlahhariperawatantt) / $jumlahpulang;
                $bto = $jumlahpulang / $tt;
                $ndr = $jumlahpasienmeninggallebihdari / $jumlahpulang * 1000;
                $gdr = $jumlahpasienmeninggal / $jumlahpulang * 1000;
            }



            $data10[] = array(
                'bor' => (float) number_format($bor, 2),
                'alos' => (float) number_format($alos, 2),
                'bto' => (float) number_format($bto, 2),
                'toi' => (float)number_format($toi, 2),
                'gdr' => (float)number_format($gdr, 2),
                'ndr' => (float) number_format($ndr, 2),
                'tahun' => $thn->namaruangan,
                'hasil' => (float) number_format($hasilrata, 2),
            );
        }

        $result = array(
            'data' => $data10,
            'message' => 'as@cepot',
        );
        return $this->respond($result);
    }

    public function getDataRL31RawatInapPerPeriode(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tglAwal = $request['tahun'] . '-01-01 00:00';
        $tglAkhir = $request['tahun'] . '-12-31 23:59';

        $data10 = [];

        $tanggalmin = DB::select(DB::raw("
            select min(d::date) as tglmin
            from generate_series('$tglAwal', '$tglAwal'::date + INTERVAL '1 MONTH - 1 day', '1 day'::interval) d
        "));

        $tanggalmax = DB::select(DB::raw("
            select min(d::date) as tglmax
            from generate_series('$tglAkhir', '$tglAkhir'::date + INTERVAL '1 MONTH - 1 day', '1 day'::interval) d
        "));

        $monthtahunmonth = (int) date('m', strtotime($tglAwal));
        $yeartahunmonth = (int) date('Y', strtotime($tglAwal));


        $tahunmonthq = DB::select(DB::raw("select to_char(daterange::date, 'YYYY-mm') as tahun
        from generate_series('$yeartahunmonth-$monthtahunmonth-01'::date, '$tglAkhir'::date, '1 month') as daterange"));

        $arrmin = [];
        foreach ($tanggalmin as $rowmin) {
            $arrmin[] =  $rowmin->tglmin;
        }
        $arrmax = [];
        foreach ($tanggalmax as $rowmax) {
            $arrmax[] =  $rowmax->tglmax;
        }


        $tanggalminawal = DB::select(DB::raw("select '$arrmin[0] 23:59:59'::timestamp - interval '1 day ' as tgl"));

        $arrminawal = [];
        foreach ($tanggalminawal as $rowminawal) {
            $arrminawal[] =  $rowminawal->tgl;
        }

        $tanggalmaxawal = DB::select(DB::raw("select '$arrmax[0] 23:59:59'::timestamp - interval '1 day ' as tgl"));

        $arrmaxawal = [];
        foreach ($tanggalmaxawal as $rowmaxawal) {
            $arrmaxawal[] =  $rowmaxawal->tgl;
        }



        $dataKemarin = DB::select(DB::raw("select to_char((tgl::date + interval '1 day')::date, 'Month') as tgl, to_char((tgl::date + interval '1 day')::date, 'mm') as nourut, sum(jumlah) as jumlah from(
                (select tgl as tgl,jumlah from (select tgl, case when jumlah is null then 0 else sum(jumlah) end as jumlah from(
                    with cte as(
                    select d as tgl
                    from generate_series('$arrminawal[0]', '$arrmaxawal[0]'::timestamp + INTERVAL '0 day', '1 day'::interval) d
                    )
                    select * FROM
                    cte
                    left join(
                    select noregistrasi, norec, tgl as tglapd, jumlah, tglpulang, tglkeluar, ruanganasal, ruangantujuan from (select pd.noregistrasi, apd.norec, apd.tglmasuk as tgl, pd.tglpulang, apd.tglkeluar, count(apd.tglmasuk) as jumlah, ru1.namaruangan ruanganasal, ru.namaruangan ruangantujuan
                    FROM pasiendaftar_t as pd
                    INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                    INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk = 16
                    inner JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk <> 16
                    where pd.kdprofile = $idProfile
                    and pd.statusenabled = true
                    group by apd.tglmasuk, apd.tglkeluar, pd.tglpulang, pd.noregistrasi, apd.norec, ru.namaruangan, ru1.namaruangan
                    ) as x
                                    
                    UNION ALL
                                    
                    select noregistrasi, norec, tgl as tglapd, jumlah, tglpulang, tglkeluar, ruanganasal, ruangantujuan from (select pd.noregistrasi, apd.norec, apd.tglmasuk as tgl, pd.tglpulang, apd.tglkeluar, count(apd.tglmasuk) as jumlah, ru1.namaruangan ruanganasal, ru.namaruangan ruangantujuan
                    FROM pasiendaftar_t as pd
                    INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                    INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk = 16
                    inner JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk = 16
                    where pd.kdprofile = $idProfile
                    and pd.statusenabled = true
                    group by apd.tglmasuk, apd.tglkeluar, pd.tglpulang, pd.noregistrasi, apd.norec, ru.namaruangan, ru1.namaruangan
                    ) as x
                    ) as y on cte.tgl between y.tglapd and coalesce(y.tglkeluar,now())
                ) as e
                group by e.tgl, e.jumlah
                order by e.tgl) as i)
            ) as f group by to_char((tgl::date + interval '1 day')::date, 'Month'), to_char((tgl::date + interval '1 day')::date, 'mm')
			order by nourut"));

        //var_dump($dataKemarin);            

        $data = DB::select(DB::raw("
            select tgl, sum(jumlah) as jumlah, nourut from(
                select tgl, jumlah, nourut from (select to_char(apd.tglmasuk, 'Month') as tgl, to_char(apd.tglmasuk, 'mm') nourut, count(apd.tglmasuk) as jumlah
                    FROM pasiendaftar_t as pd
                    INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                    INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk = 16
                    inner JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk <> 16
                    where pd.kdprofile = $idProfile 
                    and pd.statusenabled = true
                    and cast(apd.tglmasuk as date) between '$tglAwal' and '$tglAkhir'
                    group by to_char(apd.tglmasuk, 'Month'), to_char(apd.tglmasuk, 'mm')
                ) as x
            ) as f group by tgl, nourut
            order by nourut"));

        $dataPindah = DB::select(DB::raw("
            select tgl, sum(jumlah) as jumlah, nourut from(
                select tgl, jumlah, nourut from (select to_char(apd.tglmasuk, 'Month') as tgl, to_char(apd.tglmasuk, 'mm') nourut, count(apd.tglmasuk) as jumlah
                    FROM pasiendaftar_t as pd
                    INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                    INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk = 16
                    INNER JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk = 16
                    where pd.kdprofile = $idProfile 
                    and pd.statusenabled = true
                    and cast(apd.tglmasuk as date) between '$tglAwal' and '$tglAkhir' 
                    group by to_char(apd.tglmasuk, 'Month'),  to_char(apd.tglmasuk, 'mm')
                ) as x
            ) as z group by tgl, nourut
            order by nourut"));

        $dataDipindahkan = DB::select(DB::raw("
            select tgl, sum(jumlah) as jumlah, nourut from(select tgl, jumlah, nourut from (
                select to_char(apd.tglkeluar, 'Month') as tgl, to_char(apd.tglkeluar, 'mm') nourut, count(apd.tglkeluar) as jumlah
                    FROM pasiendaftar_t as pd
                    INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                    INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk = 16
                    INNER JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk = 16
                    where pd.kdprofile = $idProfile 
                    and pd.statusenabled = true
                    and cast(apd.tglkeluar as date) between '$tglAwal' and '$tglAkhir' 
                    and apd.tglkeluar <> coalesce(pd.tglpulang,now())
                    and apd.tglkeluar > apd.tglmasuk
                    group by to_char(apd.tglkeluar, 'Month'), to_char(apd.tglkeluar, 'mm')
                ) as x
                
                union all
                
                select tgl, jumlah, nourut from (
                    select to_char(apd.tglkeluar, 'Month') as tgl, to_char(apd.tglkeluar, 'mm') nourut, count(apd.tglkeluar) as jumlah
                    FROM pasiendaftar_t as pd
                    INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                    INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk = 16
                    INNER JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk <> 16
                    where pd.kdprofile = $idProfile 
                    and pd.statusenabled = true
                    and cast(apd.tglkeluar as date) between '$tglAwal' and '$tglAkhir' 
                    and apd.tglkeluar <> coalesce(pd.tglpulang,now())
                    and apd.tglkeluar > apd.tglmasuk
                    group by to_char(apd.tglkeluar, 'Month'), to_char(apd.tglkeluar, 'mm')
                ) as x
            ) as y group by tgl, nourut
            order by nourut"));

        $dataMinggal = DB::select(DB::raw("
            select to_char(pd.tglmeninggal, 'Month') as tgl, to_char(pd.tglmeninggal, 'mm') nourut, count(pm.namapasien) jumlah
                FROM pasiendaftar_t as pd
                INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
                inner join kondisipasien_m kps on kps.id = pd.objectkondisipasienfk
                inner join ruangan_m ru on ru.id = pd.objectruanganlastfk
                where pd.kdprofile = $idProfile and pd.statusenabled = true
                and cast(pd.tglmeninggal as date) between '$tglAwal' and '$tglAkhir'
                and ru.objectdepartemenfk = 16
            group by to_char(pd.tglmeninggal, 'Month'), to_char(pd.tglmeninggal, 'mm')
            order by nourut"));

        $dataPulang = DB::select(DB::raw("
            select max(apd.tglkeluar), to_char(pd.tglpulang, 'Month') as tgl, to_char(pd.tglpulang, 'mm') nourut, count(pd.tglpulang) as jumlah
                FROM pasiendaftar_t as pd
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                inner JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
                where pd.kdprofile = $idProfile and pd.statusenabled = true
                and cast(pd.tglpulang as date) between '$tglAwal' and '$tglAkhir'
                and pd.tglpulang = apd.tglkeluar
                and ru.objectdepartemenfk = 16
                and (pd.objectstatuspulangfk not in (2,3) or pd.objectstatuspulangfk is null)
                and apd.tglmasuk <> apd.tglkeluar
            group by to_char(pd.tglpulang, 'Month'), to_char(pd.tglpulang, 'mm')
            order by nourut"));

        $dataPulangAPS = DB::select(DB::raw("
            select to_char(pd.tglpulang, 'Month') as tgl, to_char(pd.tglpulang, 'mm') nourut, count(pm.namapasien) jumlah
                FROM pasiendaftar_t as pd
                INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
                INNER JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
                where pd.kdprofile = $idProfile and pd.statusenabled = true
                and cast(pd.tglpulang as date) between '$tglAwal' and '$tglAkhir'
                and pd.objectstatuspulangfk = 2
                and ru.objectdepartemenfk = 16
                and pd.tglpulang is not null
            group by to_char(pd.tglpulang, 'Month'), to_char(pd.tglpulang, 'mm')
            order by nourut"));

        $dataPulangMelarikanDiri = DB::select(DB::raw("
            select to_char(pd.tglpulang, 'Month') as tgl, to_char(pd.tglpulang, 'mm') nourut, count(pm.namapasien) jumlah
                FROM pasiendaftar_t as pd
                INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
                INNER JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
                where pd.kdprofile = $idProfile and pd.statusenabled = true
                and cast(pd.tglpulang as date) between '$tglAwal' and '$tglAkhir'
                and pd.objectstatuspulangfk = 3
                and ru.objectdepartemenfk = 16
                and pd.tglpulang is not null
            group by to_char(pd.tglpulang, 'Month'), to_char(pd.tglpulang, 'mm')
            order by nourut"));

        $dataMeninggalLebihDari = DB::select(DB::raw("
            select to_char(pd.tglmeninggal, 'Month') as tgl, to_char(pd.tglmeninggal, 'mm') nourut, count(pm.namapasien) jumlah
                FROM pasiendaftar_t as pd
                INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
                inner join kondisipasien_m kps on kps.id = pd.objectkondisipasienfk
                inner join ruangan_m ru on ru.id = pd.objectruanganlastfk
                where pd.kdprofile = $idProfile and pd.statusenabled = true
                and cast(pd.tglmeninggal as date) between '$tglAwal' and '$tglAkhir'
                and pd.objectkondisipasienfk = 6
                and ru.objectdepartemenfk = 16
            group by to_char(pd.tglmeninggal, 'Month'), to_char(pd.tglmeninggal, 'mm')
            order by nourut"));

        $lamadirawat = DB::select(DB::raw("
            select to_char(y.tgl, 'Month') as tgl, to_char(y.tgl, 'mm') nourut, sum(y.totallama) as jumlah from(
                select x.tgl, sum(x.lamadirawat) as totallama from(
                with cte as (
                    select pdt.norec, min(apdt.tglmasuk::date) tglmasuk from pasiendaftar_t as pdt
                    inner join antrianpasiendiperiksa_t as apdt on apdt.noregistrasifk = pdt.norec
                    inner join ruangan_m as rum on rum.id = apdt.objectruanganfk
                    where rum.objectdepartemenfk = 16
                    and pdt.statusenabled = TRUE
                    and pdt.kdprofile = 30
                    and pdt.tglpulang::date between '$tglAwal' and '$tglAkhir'
                    group by pdt.norec
                )
                
                select pd.tglpulang::date as tgl, cte.tglmasuk as tanggalmasuk,
                case when pd.tglpulang::date-cte.tglmasuk::date = 0 then 1 else  (pd.tglpulang::date-cte.tglmasuk) end as lamadirawat
                    FROM pasiendaftar_t as pd
                    INNER JOIN cte on cte.norec = pd.norec
                    WHERE pd.kdprofile = 30 and pd.tglpulang is not null and cast(pd.tglpulang as date) between '$arrmin[0]' and '$arrmax[0]'
                    group by pd.tglpulang::date, pd.noregistrasi, cte.tglmasuk
                    order by pd.tglpulang::date
                ) as x group by x.tgl
            ) as y group by to_char(y.tgl, 'Month'), to_char(y.tgl, 'mm')
            order by nourut;"));


        $ratarata = DB::select(DB::raw("with cte as(
                select month, sum(days) as jumlah from(
                    SELECT to_char(dt, 'mm') AS month,
                    COUNT(*) as days
                    FROM generate_series( DATE '$tglAwal',DATE '$tglAkhir',interval '1 DAY' )
                    as dt group by to_char(dt, 'mm')
                    order by month
                ) as x group by month
            )
            SELECT to_char(apd.tglmasuk, 'Month') as tgl,to_char(apd.tglmasuk, 'mm') as nourut, count(apd.norec), cte.jumlah, round(count(apd.norec)/cte.jumlah) as total
                FROM
                antrianpasiendiperiksa_t apd
                inner join ruangan_m ru on ru.id = apd.objectruanganfk
                inner join cte on cte.month = to_char(apd.tglmasuk, 'mm')
                WHERE apd.tglmasuk BETWEEN '$tglAwal' and '$tglAkhir'
                and apd.kdprofile = 30
                and apd.statusenabled=true
                and ru.objectdepartemenfk = 16
            group by to_char(apd.tglmasuk, 'mm'), to_char(apd.tglmasuk, 'Month'), cte.jumlah"));

        $jumlahdays = DB::select(DB::raw("SELECT '$tglAkhir'::date - '$tglAwal'::date + 1 as jumlahhari"));
        //var_dump($jumlahdays[0]->jumlahhari);
        $jumlah = $jumlahdays[0]->jumlahhari;

        $jumlahttkalihari = 0;
        $jumlahgrandtotaltt = 0;
        $hari = 0;
        $hariawal = (int) date('d', strtotime($tglAwal));
        $i = 0;
        $j = 0;
        $tracetahun = 1999;
        $datas = [];
        $datatt = [];
        $jumlahfix = 0;

        foreach ($tahunmonthq as $q) {
            //var_dump($jumlah);
            if ($jumlah >= 28) {
                if ($hariawal > 1) {
                    $hari = (cal_days_in_month(CAL_GREGORIAN, date('m', strtotime($q->tahun)), date('Y', strtotime($q->tahun))) - $hariawal + 1);
                    $jumlah -=  $hari;
                    $hariawal = 1;
                    //var_dump($jumlah);
                } else {
                    $hari = cal_days_in_month(CAL_GREGORIAN, date('m', strtotime($q->tahun)), date('Y', strtotime($q->tahun)));
                    $jumlah -= $hari;
                    $hari = cal_days_in_month(CAL_GREGORIAN, date('m', strtotime($q->tahun)), date('Y', strtotime($q->tahun)));
                    //var_dump($jumlah);
                }
            } else {
                $hari = $jumlah;
                //var_dump($jumlah);
            }
            //var_dump($hariawal);
            //var_dump($q);
            //var_dump($hari);

            $jumlahtt = DB::select(DB::raw("select '$q->tahun-$hari' as tanggal, sum(rm.jumlah_tt) as totalperperiode 
                    from riwayatkamar_m rm
                    inner join ruangan_m ru on ru.id = rm.objectruanganfk
                    inner join(
                        select objectruanganfk,objectkamarfk,max(tanggalawal) as tanggal from riwayatkamar_m 
                        where 
                        '$q->tahun-$hari 23:59:59' BETWEEN tanggalawal and COALESCE(tanggalakhir,'$q->tahun-$hari 23:59:59')
                        group by objectruanganfk,objectkamarfk
                    ) as x	
                    on rm.objectruanganfk=x.objectruanganfk and rm.objectkamarfk=x.objectkamarfk and rm.tanggalawal = x.tanggal
                    where rm.kdprofile = $idProfile and rm.statusenabled = true"));

            //var_dump($jumlahtt);
            if (date('Y', strtotime($q->tahun)) != $tracetahun) {
                $datas[$i]['bulan'] = date('m', strtotime($q->tahun));
                $tracetahun = date('m', strtotime($q->tahun));
                $i++;
            }

            if ($tracetahun == date('m', strtotime($q->tahun))) {
                $datatt[$j]['jumlahttkalihari'] = $hari * $jumlahtt[0]->totalperperiode;
                $datatt[$j]['jumlahgrandtotaltt'] = $jumlahtt[0]->totalperperiode;
                $datatt[$j]['bulan'] = date('m', strtotime($q->tahun));
                $j++;
            }

            $jumlahfix += $hari * $jumlahtt[0]->totalperperiode;

            //var_dump($jumlahfix);

            //var_dump($q->tahun);
            //var_dump($hari);
        }
        // var_dump($data);
        //var_dump($dataMinggal);

        $bor = 0;
        $alos = 0;
        $toi = 0;
        $bto = 0;
        $ndr = 0;
        $gdr = 0;
        $jumlahpasienpindah = 0;
        $jumlahpasienawal = 0;
        $jumlahpasienmasuk = 0;
        $jumlahpasiendipindahkan = 0;
        $jumlahpasienmeninggal = 0;
        $jumlahpasienpulang = 0;
        $jumlahpasienmeninggallebihdari = 0;
        $jumlahpindah = 0;
        $jumlahmasuk = 0;
        $jumlahhariperawatan = 0;
        $jumlahpulang = 0;
        $jumlahpasienpulangaps = 0;
        $jumlahpasienpulangmelarikandiri = 0;
        $jumlahtttotal = 0;
        $jumlahbortt = 0;
        $jumlahborhariperawatan = 0;
        $jumlahharidirawat = 0;
        $tt = 0;
        $ttperperiode = 0;
        $hasilrata = 0;

        foreach ($datas as $thn) {

            $tt = 0;
            $ttperperiode = 0;
            $jumlahpasienpindah = 0;
            $jumlahpasienawal = 0;
            $jumlahpasienmasuk = 0;
            $jumlahpasiendipindahkan = 0;
            $jumlahpasienmeninggal = 0;
            $jumlahpasienpulang = 0;
            $jumlahpasienmeninggallebihdari = 0;
            $jumlahpindah = 0;
            $jumlahmasuk = 0;
            $jumlahhariperawatan = 0;
            $jumlahpulang = 0;
            $jumlahpasienpulangaps = 0;
            $jumlahpasienpulangmelarikandiri = 0;
            $hasilrata = 0;
            // $tt = $data10[$i]['jumlahgrandtotaltt'];
            // $ttperperiode = $data10[$i]['jumlahttkalihari'];

            foreach ($datatt as $dtt) {

                if ($thn['bulan'] == $dtt['bulan']) {
                    $tt += $dtt['jumlahgrandtotaltt'];
                    $ttperperiode += $dtt['jumlahttkalihari'];
                    // var_dump( $dtt['tahun']);
                    // var_dump( $ttperperiode);
                }
            }

            foreach ($dataKemarin as $awal) {
                if ($thn['bulan'] == $awal->nourut) {
                    $jumlahpasienawal = $awal->jumlah;
                }
            }

            foreach ($data as $masuk) {
                if ($thn['bulan'] == $masuk->nourut) {
                    $jumlahpasienmasuk = $masuk->jumlah;
                }
            }

            foreach ($dataPindah as $pindah) {
                if ($thn['bulan'] == $pindah->nourut) {
                    $jumlahpasienpindah = $pindah->jumlah;
                }
            }

            foreach ($dataDipindahkan as $dipindah) {
                if ($thn['bulan'] == $dipindah->nourut) {
                    $jumlahpasiendipindahkan = $dipindah->jumlah;
                }
            }

            foreach ($dataMinggal as $meninggal) {
                if ($thn['bulan'] == $meninggal->nourut) {
                    $jumlahpasienmeninggal = $meninggal->jumlah;
                }
            }

            foreach ($dataPulang as $pulang) {
                if ($thn['bulan'] == $pulang->nourut) {
                    $jumlahpasienpulang = $pulang->jumlah;
                }
            }

            foreach ($dataPulangAPS as $pulangaps) {
                if ($thn['bulan'] == $pulangaps->nourut) {
                    $jumlahpasienpulangaps = $pulangaps->jumlah;
                }
            }

            foreach ($dataPulangMelarikanDiri as $pulanglari) {
                if ($thn['bulan'] == $pulanglari->nourut) {
                    $jumlahpasienpulangmelarikandiri = $pulanglari->jumlah;
                }
            }

            foreach ($dataMeninggalLebihDari as $meninggallebih) {
                if ($thn['bulan'] == $meninggallebih->nourut) {
                    $jumlahpasienmeninggallebihdari = $meninggallebih->jumlah;
                }
            }

            foreach ($lamadirawat as $lama) {
                if ($thn['bulan'] == $lama->nourut) {
                    $jumlahharidirawat = $lama->jumlah;
                }
            }

            foreach ($ratarata as $rata) {
                if ($thn['bulan'] == $rata->nourut) {
                    $hasilrata = $rata->total;
                }
            }


            $jumlahhariperawatantt = $jumlahpasienawal + $jumlahpasienmasuk + $jumlahpasienpindah;
            $jumlahpulang = $jumlahpasiendipindahkan + $jumlahpasienpulang + $jumlahpasienpulangaps + $jumlahpasienpulangmelarikandiri;
            $jumlahpulangsementara = $jumlahpasienpulang + $jumlahpasienpulangaps + $jumlahpasienpulangmelarikandiri;

            // var_dump($jumlahharidirawat);
            // var_dump($jumlahpulang);
            // var_dump($tt);
            // var_dump($ttperperiode);



            if ($jumlahpulang == 0 && $ttperperiode != 0 && $tt != 0) {
                $bor = $jumlahhariperawatantt / $ttperperiode * 100;
                $alos = 0;
                $toi = 0;
                $bto = $jumlahpulang / $tt;
                $ndr = 0;
                $gdr = 0;
            } else if ($ttperperiode == 0 && $tt == 0 && $jumlahpulang != 0) {
                $bor = 0;
                $alos = $jumlahharidirawat / $jumlahpulang;
                $toi = ($ttperperiode - $jumlahhariperawatantt) / $jumlahpulangsementara;
                $bto = 0;
                $ndr = $jumlahpasienmeninggallebihdari / $jumlahpulang * 1000;
                $gdr = $jumlahpasienmeninggal / $jumlahpulang * 1000;
            } else if ($ttperperiode == 0 && $tt == 0 && $jumlahpulang == 0) {
                $bor = 0;
                $alos = 0;
                $toi = 0;
                $bto = 0;
                $ndr = 0;
                $gdr = 0;
            } else {
                $bor = $jumlahhariperawatantt / $ttperperiode * 100;
                $alos = $jumlahharidirawat / $jumlahpulangsementara;
                $toi = ($ttperperiode - $jumlahhariperawatantt) / $jumlahpulang;
                $bto = $jumlahpulang / $tt;
                $ndr = $jumlahpasienmeninggallebihdari / $jumlahpulang * 1000;
                $gdr = $jumlahpasienmeninggal / $jumlahpulang * 1000;
            }



            $data10[] = array(
                'bor' => (float) number_format($bor, 2),
                'alos' => (float) number_format($alos, 2),
                'bto' => (float) number_format($bto, 2),
                'toi' => (float)number_format($toi, 2),
                'gdr' => (float)number_format($gdr, 2),
                'ndr' => (float) number_format($ndr, 2),
                'tahun' => $thn['bulan'],
                'hasil' => (float) number_format($hasilrata, 2),
            );
        }

        $result = array(
            'data' => $data10,
            'message' => 'as@cepot',
        );
        return $this->respond($result);
    }
    public function getDataRL13TempatTidur(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tglAwal = $request['tglAwal'];

        $main = array("Penyakit Dalam", "Kesehatan Anak", "Obstetri", "Ginekologi", "Bedah", "Bedah Ortopedhi", "Bedah Saraf", "Luka Bakar", "Saraf", "Jiwa", "Psikologi", "Penatalaksanaan Penyalahgunaan NAPZA", "THT", "Mata", "Kulit dan Kelamin", "Kardiologi", "Paru-paru", "Geriatri", "Radioterapi", "Kedokteran Nuklir", "Kusta", "Rehabilitasi Medik", "Isolasi", "ICU", "ICCU", "NICU / PICU", "Umum", "Gigi & Mulut", "Pelayanan Rawat Darurat", "SUB TOTAL", "Perinatologi/Bayi", "TOTAL");

        $jumlahperkelas = DB::select(DB::raw("select namaruangan, sum(x.kelasvip) jumlahkelasvip, sum(x.kelassatu) jumlahkelassatu, sum(x.kelasdua) jumlahkelasdua, sum(x.kelastiga) jumlahkelastiga, sum(x.kelaskhusus) jumlahkelaskhusus, sum(x.kelasvip) + sum(x.kelassatu) + sum(x.kelasdua) + sum(x.kelastiga) + sum(x.kelaskhusus) totaltt from(
            select ru.namaruangan,
            case when ks.id = 4 then sum(rm.jumlah_tt) else 0 end as kelasvip,
            case when ks.id = 3 then sum(rm.jumlah_tt) else 0 end as kelassatu,
            case when ks.id = 2 then sum(rm.jumlah_tt) else 0 end as kelasdua,
            case when ks.id = 1 then sum(rm.jumlah_tt) else 0 end as kelastiga,
            case when ks.id = 6 then sum(rm.jumlah_tt) else 0 end as kelaskhusus
                from riwayatkamar_m rm
            inner join ruangan_m ru on ru.id = rm.objectruanganfk
            inner join kamar_m km on km.id = rm.objectkamarfk
            inner join kelas_m ks on ks.id = rm.objectkelasfk
            inner join(
                select objectruanganfk,objectkamarfk,max(tanggalawal) as tanggal 
                from riwayatkamar_m 
                where 
                '$tglAwal-01 23:59:59' BETWEEN tanggalawal and COALESCE(tanggalakhir,'$tglAwal-01 23:59:59')
                group by objectruanganfk,objectkamarfk
            ) as x	
            on rm.objectruanganfk=x.objectruanganfk 
            and rm.objectkamarfk=x.objectkamarfk 
            and rm.tanggalawal = x.tanggal
            and ks.id in (1, 2, 3, 4, 6)
            where rm.kdprofile = 30 
            and rm.statusenabled = true
            group by ks.id, ru.namaruangan) as x group by namaruangan;"));

        //var_dump($jumlahperkelas);

        $currentmain = "Larasatizka";

        $jumlahtt = 0;
        $kelasvvip = 0;
        $kelasvip = 0;
        $kelassatu = 0;
        $kelasdua = 0;
        $kelastiga = 0;
        $kelaskhusus = 0;

        foreach ($main as $row) {
            $jumlahtt = 0;
            $kelasvvip = 0;
            $kelasvip = 0;
            $kelassatu = 0;
            $kelasdua = 0;
            $kelastiga = 0;
            $kelaskhusus = 0;
            if ($row != $currentmain) {
                foreach ($jumlahperkelas as $jml) {

                    if ($row == "Umum" && $jml->namaruangan == 'WISMA KRESNA') {
                        $jumlahtt += $jml->totaltt;
                        $kelasvip += $jml->jumlahkelasvip;
                        $kelassatu += $jml->jumlahkelassatu;
                        $kelasdua += $jml->jumlahkelasdua;
                        $kelastiga += $jml->jumlahkelastiga;
                        $kelaskhusus += $jml->jumlahkelaskhusus;
                    }

                    if ($row == "Penatalaksanaan Penyalahgunaan NAPZA" && $jml->namaruangan == 'WISMA ABIMANYU') {
                        $jumlahtt += $jml->totaltt;
                        $kelasvip += $jml->jumlahkelasvip;
                        $kelassatu += $jml->jumlahkelassatu;
                        $kelasdua += $jml->jumlahkelasdua;
                        $kelastiga += $jml->jumlahkelastiga;
                        $kelaskhusus += $jml->jumlahkelaskhusus;
                    }

                    if ($row == "Jiwa" && $jml->namaruangan != 'WISMA ABIMANYU' && $jml->namaruangan != 'WISMA KRESNA') {
                        $jumlahtt += $jml->totaltt;
                        $kelasvip += $jml->jumlahkelasvip;
                        $kelassatu += $jml->jumlahkelassatu;
                        $kelasdua += $jml->jumlahkelasdua;
                        $kelastiga += $jml->jumlahkelastiga;
                        $kelaskhusus += $jml->jumlahkelaskhusus;
                    }
                }

                $data10[] = array(
                    'pelayanan' => $row,
                    'jumlahkelasvvip' => $kelasvvip,
                    'jumlahkelasvip' => $kelasvip,
                    'jumlahkelassatu' => $kelassatu,
                    'jumlahkelasdua' => $kelasdua,
                    'jumlahkelastiga' => $kelastiga,
                    'jumlahkelaskhusus' => $kelaskhusus,
                    'totaltt' => $jumlahtt,
                );
            }
            $currentmain = $row;
        }

        $result = array(
            'data' => $data10,
            'message' => 'as@cepot',
        );
        return $this->respond($result);
    }

    public function getDataRL2(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $data10 = DB::select(DB::raw("select 'TENAGA KESEHATAN' as pendidikanpegawai, 1 nourut, 0 keadaanl, 0 keadaanp, 0 kebutuhanl, 0 kebutuhanp,
        0 kekuranganl, 0 kekuranganp
        
        union all
        
        select 'TENAGA MEDIS' as pendidikanpegawai, 2 nourut, 0 keadaanl, 0 keadaanp, 0 kebutuhanl, 0 kebutuhanp,
        0 kekuranganl, 0 kekuranganp
        
        union all
        
        select pendidikanpegawai, nourut + 2, sum(keadaanl) keadaanl, sum(keadaanp) keadaanp, sum(kebutuhanl) kebutuhanl,
        sum(kebutuhanp) kebutuhanp, sum(kekuranganl) kekuranganl, sum(kekuranganp) kekuranganp  
        from (
            select x.pendidikanpegawai, x.nourut, 
            case when pg.namalengkap is not null and jk.id = 1 then count(pg.namalengkap) else 0 end as keadaanl,
            case when pg.namalengkap is not null and jk.id = 2 then count(pg.namalengkap) else 0 end as keadaanp,
            x.kebutuhanl, x.kebutuhanp, x.kekuranganl, x.kekuranganp  
            from
            (
                select a.kategorifk, b.subkategorifk, ppg.pendidikanpegawai, ppg.nourut, ppg.id, abt.kebutuhanl, abt.kekuranganl, abt.kebutuhanp, abt.kekuranganp
                from pendidikanpegawai_m ppg
                inner join abkpegawai_t abt on abt.objectpendidikanpegawaifk = ppg.id
                left join (
                    select distinct on(kategorifk) nourut, kategorifk
                    from pendidikanpegawai_m
                    where kdprofile = 30
                    and statusenabled = true
                    order by kategorifk asc, nourut asc
                ) as a on a.nourut = ppg.nourut
                left join (
                    select distinct on(subkategorifk) nourut, subkategorifk
                    from pendidikanpegawai_m
                    where kdprofile = 30
                    and statusenabled = true
                    order by subkategorifk asc, nourut asc
                ) as b on b.nourut = ppg.nourut
                where ppg.kdprofile = 30
                and ppg.id between 1 and 34
                and ppg.statusenabled = true
                order by ppg.nourut asc
            ) as x
            left JOIN pegawai_m as pg on pg.objectpendidikanpegawaifk = x.id 
            left join jeniskelamin_m jk on jk.id = pg.objectjeniskelaminfk
            group by x.pendidikanpegawai, x.kebutuhanl, x.kebutuhanp, x.kekuranganl, x.kekuranganp, pg.namalengkap, jk.id, x.nourut
            order by x.nourut
        ) as y group by pendidikanpegawai, nourut
        
        union all
        
        select 'Total (1.00-1.34)' as pendidikanpegawai, 37 nourut, 0 keadaanl, 0 keadaanp, 0 kebutuhanl, 0 kebutuhanp,
        0 kekuranganl, 0 kekuranganp
        
        union all
        
        select pendidikanpegawai, nourut + 3, sum(keadaanl) keadaanl, sum(keadaanp) keadaanp, sum(kebutuhanl) kebutuhanl,
        sum(kebutuhanp) kebutuhanp, sum(kekuranganl) kekuranganl, sum(kekuranganp) kekuranganp  
        from (
            select x.pendidikanpegawai, x.nourut, 
            case when pg.namalengkap is not null and jk.id = 1 then count(pg.namalengkap) else 0 end as keadaanl,
            case when pg.namalengkap is not null and jk.id = 2 then count(pg.namalengkap) else 0 end as keadaanp,
            x.kebutuhanl, x.kebutuhanp, x.kekuranganl, x.kekuranganp  
            from
            (
                select a.kategorifk, b.subkategorifk, ppg.pendidikanpegawai, ppg.nourut, ppg.id, abt.kebutuhanl, abt.kekuranganl, abt.kebutuhanp, abt.kekuranganp
                from pendidikanpegawai_m ppg
                inner join abkpegawai_t abt on abt.objectpendidikanpegawaifk = ppg.id
                left join (
                    select distinct on(kategorifk) nourut, kategorifk
                    from pendidikanpegawai_m
                    where kdprofile = 30
                    and statusenabled = true
                    order by kategorifk asc, nourut asc
                ) as a on a.nourut = ppg.nourut
                left join (
                    select distinct on(subkategorifk) nourut, subkategorifk
                    from pendidikanpegawai_m
                    where kdprofile = 30
                    and statusenabled = true
                    order by subkategorifk asc, nourut asc
                ) as b on b.nourut = ppg.nourut
                where ppg.kdprofile = 30
                and ppg.id between 35 and 37
                and ppg.statusenabled = true
                order by ppg.nourut asc
            ) as x
            left JOIN pegawai_m as pg on pg.objectpendidikanpegawaifk = x.id 
            left join jeniskelamin_m jk on jk.id = pg.objectjeniskelaminfk
            group by x.pendidikanpegawai, x.kebutuhanl, x.kebutuhanp, x.kekuranganl, x.kekuranganp, pg.namalengkap, jk.id, x.nourut
            order by x.nourut
        ) as y group by pendidikanpegawai, nourut
        
        union all
        
        select 'TENAGA KEPERAWATAN' as pendidikanpegawai, 41 nourut, 0 keadaanl, 0 keadaanp, 0 kebutuhanl, 0 kebutuhanp,
        0 kekuranganl, 0 kekuranganp
        
        union ALL
        
        select pendidikanpegawai, nourut + 4, sum(keadaanl) keadaanl, sum(keadaanp) keadaanp, sum(kebutuhanl) kebutuhanl,
        sum(kebutuhanp) kebutuhanp, sum(kekuranganl) kekuranganl, sum(kekuranganp) kekuranganp  
        from (
            select x.pendidikanpegawai, x.nourut, 
            case when pg.namalengkap is not null and jk.id = 1 then count(pg.namalengkap) else 0 end as keadaanl,
            case when pg.namalengkap is not null and jk.id = 2 then count(pg.namalengkap) else 0 end as keadaanp,
            x.kebutuhanl, x.kebutuhanp, x.kekuranganl, x.kekuranganp  
            from
            (
                select a.kategorifk, b.subkategorifk, ppg.pendidikanpegawai, ppg.nourut, ppg.id, abt.kebutuhanl, abt.kekuranganl, abt.kebutuhanp, abt.kekuranganp
                from pendidikanpegawai_m ppg
                inner join abkpegawai_t abt on abt.objectpendidikanpegawaifk = ppg.id
                left join (
                    select distinct on(kategorifk) nourut, kategorifk
                    from pendidikanpegawai_m
                    where kdprofile = 30
                    and statusenabled = true
                    order by kategorifk asc, nourut asc
                ) as a on a.nourut = ppg.nourut
                left join (
                    select distinct on(subkategorifk) nourut, subkategorifk
                    from pendidikanpegawai_m
                    where kdprofile = 30
                    and statusenabled = true
                    order by subkategorifk asc, nourut asc
                ) as b on b.nourut = ppg.nourut
                where ppg.kdprofile = 30
                and ppg.id between 38 and 49
                and ppg.statusenabled = true
                order by ppg.nourut asc
            ) as x
            left JOIN pegawai_m as pg on pg.objectpendidikanpegawaifk = x.id 
            left join jeniskelamin_m jk on jk.id = pg.objectjeniskelaminfk
            group by x.pendidikanpegawai, x.kebutuhanl, x.kebutuhanp, x.kekuranganl, x.kekuranganp, pg.namalengkap, jk.id, x.nourut
            order by x.nourut
        ) as y group by pendidikanpegawai, nourut
        
        union ALL
        
        select 'Total (2.00-2.88)' as pendidikanpegawai, 54 nourut, 0 keadaanl, 0 keadaanp, 0 kebutuhanl, 0 kebutuhanp,
        0 kekuranganl, 0 kekuranganp
        
        union all
        
        select 'KEFARMASIAN' as pendidikanpegawai, 55 nourut, 0 keadaanl, 0 keadaanp, 0 kebutuhanl, 0 kebutuhanp,
        0 kekuranganl, 0 kekuranganp
        
        union ALL
        
        select pendidikanpegawai, nourut + 6, sum(keadaanl) keadaanl, sum(keadaanp) keadaanp, sum(kebutuhanl) kebutuhanl,
        sum(kebutuhanp) kebutuhanp, sum(kekuranganl) kekuranganl, sum(kekuranganp) kekuranganp  
        from (
            select x.pendidikanpegawai, x.nourut, 
            case when pg.namalengkap is not null and jk.id = 1 then count(pg.namalengkap) else 0 end as keadaanl,
            case when pg.namalengkap is not null and jk.id = 2 then count(pg.namalengkap) else 0 end as keadaanp,
            x.kebutuhanl, x.kebutuhanp, x.kekuranganl, x.kekuranganp  
            from
            (
                select a.kategorifk, b.subkategorifk, ppg.pendidikanpegawai, ppg.nourut, ppg.id, abt.kebutuhanl, abt.kekuranganl, abt.kebutuhanp, abt.kekuranganp
                from pendidikanpegawai_m ppg
                inner join abkpegawai_t abt on abt.objectpendidikanpegawaifk = ppg.id
                left join (
                    select distinct on(kategorifk) nourut, kategorifk
                    from pendidikanpegawai_m
                    where kdprofile = 30
                    and statusenabled = true
                    order by kategorifk asc, nourut asc
                ) as a on a.nourut = ppg.nourut
                left join (
                    select distinct on(subkategorifk) nourut, subkategorifk
                    from pendidikanpegawai_m
                    where kdprofile = 30
                    and statusenabled = true
                    order by subkategorifk asc, nourut asc
                ) as b on b.nourut = ppg.nourut
                where ppg.kdprofile = 30
                and ppg.id between 50 and 59
                and ppg.statusenabled = true
                order by ppg.nourut asc
            ) as x
            left JOIN pegawai_m as pg on pg.objectpendidikanpegawaifk = x.id 
            left join jeniskelamin_m jk on jk.id = pg.objectjeniskelaminfk
            group by x.pendidikanpegawai, x.kebutuhanl, x.kebutuhanp, x.kekuranganl, x.kekuranganp, pg.namalengkap, jk.id, x.nourut
            order by x.nourut
        ) as y group by pendidikanpegawai, nourut
        
        union ALL
        
        select 'Total (3.00-3.88)' as pendidikanpegawai, 66 nourut, 0 keadaanl, 0 keadaanp, 0 kebutuhanl, 0 kebutuhanp,
        0 kekuranganl, 0 kekuranganp
        
        union all
        
        select 'KESEHATAN MASYARAKAT' as pendidikanpegawai, 67 nourut, 0 keadaanl, 0 keadaanp, 0 kebutuhanl, 0 kebutuhanp,
        0 kekuranganl, 0 kekuranganp
        
        
        union ALL
        
        select pendidikanpegawai, nourut + 8, sum(keadaanl) keadaanl, sum(keadaanp) keadaanp, sum(kebutuhanl) kebutuhanl,
        sum(kebutuhanp) kebutuhanp, sum(kekuranganl) kekuranganl, sum(kekuranganp) kekuranganp  
        from (
            select x.pendidikanpegawai, x.nourut, 
            case when pg.namalengkap is not null and jk.id = 1 then count(pg.namalengkap) else 0 end as keadaanl,
            case when pg.namalengkap is not null and jk.id = 2 then count(pg.namalengkap) else 0 end as keadaanp,
            x.kebutuhanl, x.kebutuhanp, x.kekuranganl, x.kekuranganp  
            from
            (
                select a.kategorifk, b.subkategorifk, ppg.pendidikanpegawai, ppg.nourut, ppg.id, abt.kebutuhanl, abt.kekuranganl, abt.kebutuhanp, abt.kekuranganp
                from pendidikanpegawai_m ppg
                inner join abkpegawai_t abt on abt.objectpendidikanpegawaifk = ppg.id
                left join (
                    select distinct on(kategorifk) nourut, kategorifk
                    from pendidikanpegawai_m
                    where kdprofile = 30
                    and statusenabled = true
                    order by kategorifk asc, nourut asc
                ) as a on a.nourut = ppg.nourut
                left join (
                    select distinct on(subkategorifk) nourut, subkategorifk
                    from pendidikanpegawai_m
                    where kdprofile = 30
                    and statusenabled = true
                    order by subkategorifk asc, nourut asc
                ) as b on b.nourut = ppg.nourut
                where ppg.kdprofile = 30
                and ppg.id between 60 and 72
                and ppg.statusenabled = true
                order by ppg.nourut asc
            ) as x
            left JOIN pegawai_m as pg on pg.objectpendidikanpegawaifk = x.id 
            left join jeniskelamin_m jk on jk.id = pg.objectjeniskelaminfk
            group by x.pendidikanpegawai, x.kebutuhanl, x.kebutuhanp, x.kekuranganl, x.kekuranganp, pg.namalengkap, jk.id, x.nourut
            order by x.nourut
        ) as y group by pendidikanpegawai, nourut
        
        union all
        
        select 'Total (4.00-4.88)' as pendidikanpegawai, 81 nourut, 0 keadaanl, 0 keadaanp, 0 kebutuhanl, 0 kebutuhanp,
        0 kekuranganl, 0 kekuranganp
        
        union ALL
        
        select 'GIZI' as pendidikanpegawai, 82 nourut, 0 keadaanl, 0 keadaanp, 0 kebutuhanl, 0 kebutuhanp,
        0 kekuranganl, 0 kekuranganp
        
        union all
        
        select pendidikanpegawai, nourut + 10, sum(keadaanl) keadaanl, sum(keadaanp) keadaanp, sum(kebutuhanl) kebutuhanl,
        sum(kebutuhanp) kebutuhanp, sum(kekuranganl) kekuranganl, sum(kekuranganp) kekuranganp  
        from (
            select x.pendidikanpegawai, x.nourut, 
            case when pg.namalengkap is not null and jk.id = 1 then count(pg.namalengkap) else 0 end as keadaanl,
            case when pg.namalengkap is not null and jk.id = 2 then count(pg.namalengkap) else 0 end as keadaanp,
            x.kebutuhanl, x.kebutuhanp, x.kekuranganl, x.kekuranganp  
            from
            (
                select a.kategorifk, b.subkategorifk, ppg.pendidikanpegawai, ppg.nourut, ppg.id, abt.kebutuhanl, abt.kekuranganl, abt.kebutuhanp, abt.kekuranganp
                from pendidikanpegawai_m ppg
                inner join abkpegawai_t abt on abt.objectpendidikanpegawaifk = ppg.id
                left join (
                    select distinct on(kategorifk) nourut, kategorifk
                    from pendidikanpegawai_m
                    where kdprofile = 30
                    and statusenabled = true
                    order by kategorifk asc, nourut asc
                ) as a on a.nourut = ppg.nourut
                left join (
                    select distinct on(subkategorifk) nourut, subkategorifk
                    from pendidikanpegawai_m
                    where kdprofile = 30
                    and statusenabled = true
                    order by subkategorifk asc, nourut asc
                ) as b on b.nourut = ppg.nourut
                where ppg.kdprofile = 30
                and ppg.id between 73 and 79
                and ppg.statusenabled = true
                order by ppg.nourut asc
            ) as x
            left JOIN pegawai_m as pg on pg.objectpendidikanpegawaifk = x.id 
            left join jeniskelamin_m jk on jk.id = pg.objectjeniskelaminfk
            group by x.pendidikanpegawai, x.kebutuhanl, x.kebutuhanp, x.kekuranganl, x.kekuranganp, pg.namalengkap, jk.id, x.nourut
            order by x.nourut
        ) as y group by pendidikanpegawai, nourut
        
        union all
        
        select 'Total (5.00-5.88)' as pendidikanpegawai, 90 nourut, 0 keadaanl, 0 keadaanp, 0 kebutuhanl, 0 kebutuhanp,
        0 kekuranganl, 0 kekuranganp
        
        union ALL
        
        select 'KETERAPIAN FISIK' as pendidikanpegawai, 91 nourut, 0 keadaanl, 0 keadaanp, 0 kebutuhanl, 0 kebutuhanp,
        0 kekuranganl, 0 kekuranganp
        
        union all
        
        select pendidikanpegawai, nourut + 12, sum(keadaanl) keadaanl, sum(keadaanp) keadaanp, sum(kebutuhanl) kebutuhanl,
        sum(kebutuhanp) kebutuhanp, sum(kekuranganl) kekuranganl, sum(kekuranganp) kekuranganp  
        from (
            select x.pendidikanpegawai, x.nourut, 
            case when pg.namalengkap is not null and jk.id = 1 then count(pg.namalengkap) else 0 end as keadaanl,
            case when pg.namalengkap is not null and jk.id = 2 then count(pg.namalengkap) else 0 end as keadaanp,
            x.kebutuhanl, x.kebutuhanp, x.kekuranganl, x.kekuranganp  
            from
            (
                select a.kategorifk, b.subkategorifk, ppg.pendidikanpegawai, ppg.nourut, ppg.id, abt.kebutuhanl, abt.kekuranganl, abt.kebutuhanp, abt.kekuranganp
                from pendidikanpegawai_m ppg
                inner join abkpegawai_t abt on abt.objectpendidikanpegawaifk = ppg.id
                left join (
                    select distinct on(kategorifk) nourut, kategorifk
                    from pendidikanpegawai_m
                    where kdprofile = 30
                    and statusenabled = true
                    order by kategorifk asc, nourut asc
                ) as a on a.nourut = ppg.nourut
                left join (
                    select distinct on(subkategorifk) nourut, subkategorifk
                    from pendidikanpegawai_m
                    where kdprofile = 30
                    and statusenabled = true
                    order by subkategorifk asc, nourut asc
                ) as b on b.nourut = ppg.nourut
                where ppg.kdprofile = 30
                and ppg.id between 80 and 86
                and ppg.statusenabled = true
                order by ppg.nourut asc
            ) as x
            left JOIN pegawai_m as pg on pg.objectpendidikanpegawaifk = x.id 
            left join jeniskelamin_m jk on jk.id = pg.objectjeniskelaminfk
            group by x.pendidikanpegawai, x.kebutuhanl, x.kebutuhanp, x.kekuranganl, x.kekuranganp, pg.namalengkap, jk.id, x.nourut
            order by x.nourut
        ) as y group by pendidikanpegawai, nourut
        
        union all
        
        select 'Total (6.00-6.88)' as pendidikanpegawai, 99 nourut, 0 keadaanl, 0 keadaanp, 0 kebutuhanl, 0 kebutuhanp,
        0 kekuranganl, 0 kekuranganp
        
        union ALL
        
        select 'KETEKNISAN MEDIS' as pendidikanpegawai, 100 nourut, 0 keadaanl, 0 keadaanp, 0 kebutuhanl, 0 kebutuhanp,
        0 kekuranganl, 0 kekuranganp
        
        union all
        
        select pendidikanpegawai, nourut + 14, sum(keadaanl) keadaanl, sum(keadaanp) keadaanp, sum(kebutuhanl) kebutuhanl,
        sum(kebutuhanp) kebutuhanp, sum(kekuranganl) kekuranganl, sum(kekuranganp) kekuranganp  
        from (
            select x.pendidikanpegawai, x.nourut, 
            case when pg.namalengkap is not null and jk.id = 1 then count(pg.namalengkap) else 0 end as keadaanl,
            case when pg.namalengkap is not null and jk.id = 2 then count(pg.namalengkap) else 0 end as keadaanp,
            x.kebutuhanl, x.kebutuhanp, x.kekuranganl, x.kekuranganp  
            from
            (
                select a.kategorifk, b.subkategorifk, ppg.pendidikanpegawai, ppg.nourut, ppg.id, abt.kebutuhanl, abt.kekuranganl, abt.kebutuhanp, abt.kekuranganp
                from pendidikanpegawai_m ppg
                inner join abkpegawai_t abt on abt.objectpendidikanpegawaifk = ppg.id
                left join (
                    select distinct on(kategorifk) nourut, kategorifk
                    from pendidikanpegawai_m
                    where kdprofile = 30
                    and statusenabled = true
                    order by kategorifk asc, nourut asc
                ) as a on a.nourut = ppg.nourut
                left join (
                    select distinct on(subkategorifk) nourut, subkategorifk
                    from pendidikanpegawai_m
                    where kdprofile = 30
                    and statusenabled = true
                    order by subkategorifk asc, nourut asc
                ) as b on b.nourut = ppg.nourut
                where ppg.kdprofile = 30
                and ppg.id between 87 and 109
                and ppg.statusenabled = true
                order by ppg.nourut asc
            ) as x
            left JOIN pegawai_m as pg on pg.objectpendidikanpegawaifk = x.id 
            left join jeniskelamin_m jk on jk.id = pg.objectjeniskelaminfk
            group by x.pendidikanpegawai, x.kebutuhanl, x.kebutuhanp, x.kekuranganl, x.kekuranganp, pg.namalengkap, jk.id, x.nourut
            order by x.nourut
        ) as y group by pendidikanpegawai, nourut
        
        union all
        
        select 'Total (7.00-7.88)' as pendidikanpegawai, 124 nourut, 0 keadaanl, 0 keadaanp, 0 kebutuhanl, 0 kebutuhanp,
        0 kekuranganl, 0 kekuranganp
        
        union ALL
        
        select 'TENAGA NON KESEHATAN' as pendidikanpegawai, 125 nourut, 0 keadaanl, 0 keadaanp, 0 kebutuhanl, 0 kebutuhanp,
        0 kekuranganl, 0 kekuranganp
        
        union all
        
        select 'DOKTORAL' as pendidikanpegawai, 126 nourut, 0 keadaanl, 0 keadaanp, 0 kebutuhanl, 0 kebutuhanp,
        0 kekuranganl, 0 kekuranganp
        
        union all
        
        select pendidikanpegawai, nourut + 17, sum(keadaanl) keadaanl, sum(keadaanp) keadaanp, sum(kebutuhanl) kebutuhanl,
        sum(kebutuhanp) kebutuhanp, sum(kekuranganl) kekuranganl, sum(kekuranganp) kekuranganp  
        from (
            select x.pendidikanpegawai, x.nourut, 
            case when pg.namalengkap is not null and jk.id = 1 then count(pg.namalengkap) else 0 end as keadaanl,
            case when pg.namalengkap is not null and jk.id = 2 then count(pg.namalengkap) else 0 end as keadaanp,
            x.kebutuhanl, x.kebutuhanp, x.kekuranganl, x.kekuranganp  
            from
            (
                select a.kategorifk, b.subkategorifk, ppg.pendidikanpegawai, ppg.nourut, ppg.id, abt.kebutuhanl, abt.kekuranganl, abt.kebutuhanp, abt.kekuranganp
                from pendidikanpegawai_m ppg
                inner join abkpegawai_t abt on abt.objectpendidikanpegawaifk = ppg.id
                left join (
                    select distinct on(kategorifk) nourut, kategorifk
                    from pendidikanpegawai_m
                    where kdprofile = 30
                    and statusenabled = true
                    order by kategorifk asc, nourut asc
                ) as a on a.nourut = ppg.nourut
                left join (
                    select distinct on(subkategorifk) nourut, subkategorifk
                    from pendidikanpegawai_m
                    where kdprofile = 30
                    and statusenabled = true
                    order by subkategorifk asc, nourut asc
                ) as b on b.nourut = ppg.nourut
                where ppg.kdprofile = 30
                and ppg.id between 110 and 120
                and ppg.statusenabled = true
                order by ppg.nourut asc
            ) as x
            left JOIN pegawai_m as pg on pg.objectpendidikanpegawaifk = x.id 
            left join jeniskelamin_m jk on jk.id = pg.objectjeniskelaminfk
            group by x.pendidikanpegawai, x.kebutuhanl, x.kebutuhanp, x.kekuranganl, x.kekuranganp, pg.namalengkap, jk.id, x.nourut
            order by x.nourut
        ) as y group by pendidikanpegawai, nourut
        
        
        union all
        
        select 'Total (8.00-8.88)' as pendidikanpegawai, 138 nourut, 0 keadaanl, 0 keadaanp, 0 kebutuhanl, 0 kebutuhanp,
        0 kekuranganl, 0 kekuranganp
        
        union ALL
        
        select 'PASCA SARJANA' as pendidikanpegawai, 139 nourut, 0 keadaanl, 0 keadaanp, 0 kebutuhanl, 0 kebutuhanp,
        0 kekuranganl, 0 kekuranganp
        
        union all
        
        select pendidikanpegawai, nourut + 17, sum(keadaanl) keadaanl, sum(keadaanp) keadaanp, sum(kebutuhanl) kebutuhanl,
        sum(kebutuhanp) kebutuhanp, sum(kekuranganl) kekuranganl, sum(kekuranganp) kekuranganp  
        from (
            select x.pendidikanpegawai, x.nourut, 
            case when pg.namalengkap is not null and jk.id = 1 then count(pg.namalengkap) else 0 end as keadaanl,
            case when pg.namalengkap is not null and jk.id = 2 then count(pg.namalengkap) else 0 end as keadaanp,
            x.kebutuhanl, x.kebutuhanp, x.kekuranganl, x.kekuranganp  
            from
            (
                select a.kategorifk, b.subkategorifk, ppg.pendidikanpegawai, ppg.nourut, ppg.id, abt.kebutuhanl, abt.kekuranganl, abt.kebutuhanp, abt.kekuranganp
                from pendidikanpegawai_m ppg
                inner join abkpegawai_t abt on abt.objectpendidikanpegawaifk = ppg.id
                left join (
                    select distinct on(kategorifk) nourut, kategorifk
                    from pendidikanpegawai_m
                    where kdprofile = 30
                    and statusenabled = true
                    order by kategorifk asc, nourut asc
                ) as a on a.nourut = ppg.nourut
                left join (
                    select distinct on(subkategorifk) nourut, subkategorifk
                    from pendidikanpegawai_m
                    where kdprofile = 30
                    and statusenabled = true
                    order by subkategorifk asc, nourut asc
                ) as b on b.nourut = ppg.nourut
                where ppg.kdprofile = 30
                and ppg.id between 121 and 132
                and ppg.statusenabled = true
                order by ppg.nourut asc
            ) as x
            left JOIN pegawai_m as pg on pg.objectpendidikanpegawaifk = x.id 
            left join jeniskelamin_m jk on jk.id = pg.objectjeniskelaminfk
            group by x.pendidikanpegawai, x.kebutuhanl, x.kebutuhanp, x.kekuranganl, x.kekuranganp, pg.namalengkap, jk.id, x.nourut
            order by x.nourut
        ) as y group by pendidikanpegawai, nourut
        
        union all
        
        select 'Total (9.00-9.88)' as pendidikanpegawai, 152 nourut, 0 keadaanl, 0 keadaanp, 0 kebutuhanl, 0 kebutuhanp,
        0 kekuranganl, 0 kekuranganp
        
        union ALL
        
        select 'SARJANA' as pendidikanpegawai, 153 nourut, 0 keadaanl, 0 keadaanp, 0 kebutuhanl, 0 kebutuhanp,
        0 kekuranganl, 0 kekuranganp
        
        union all
        
        select pendidikanpegawai, nourut + 21, sum(keadaanl) keadaanl, sum(keadaanp) keadaanp, sum(kebutuhanl) kebutuhanl,
        sum(kebutuhanp) kebutuhanp, sum(kekuranganl) kekuranganl, sum(kekuranganp) kekuranganp  
        from (
            select x.pendidikanpegawai, x.nourut, 
            case when pg.namalengkap is not null and jk.id = 1 then count(pg.namalengkap) else 0 end as keadaanl,
            case when pg.namalengkap is not null and jk.id = 2 then count(pg.namalengkap) else 0 end as keadaanp,
            x.kebutuhanl, x.kebutuhanp, x.kekuranganl, x.kekuranganp  
            from
            (
                select a.kategorifk, b.subkategorifk, ppg.pendidikanpegawai, ppg.nourut, ppg.id, abt.kebutuhanl, abt.kekuranganl, abt.kebutuhanp, abt.kekuranganp
                from pendidikanpegawai_m ppg
                inner join abkpegawai_t abt on abt.objectpendidikanpegawaifk = ppg.id
                left join (
                    select distinct on(kategorifk) nourut, kategorifk
                    from pendidikanpegawai_m
                    where kdprofile = 30
                    and statusenabled = true
                    order by kategorifk asc, nourut asc
                ) as a on a.nourut = ppg.nourut
                left join (
                    select distinct on(subkategorifk) nourut, subkategorifk
                    from pendidikanpegawai_m
                    where kdprofile = 30
                    and statusenabled = true
                    order by subkategorifk asc, nourut asc
                ) as b on b.nourut = ppg.nourut
                where ppg.kdprofile = 30
                and ppg.id between 133 and 143
                and ppg.statusenabled = true
                order by ppg.nourut asc
            ) as x
            left JOIN pegawai_m as pg on pg.objectpendidikanpegawaifk = x.id 
            left join jeniskelamin_m jk on jk.id = pg.objectjeniskelaminfk
            group by x.pendidikanpegawai, x.kebutuhanl, x.kebutuhanp, x.kekuranganl, x.kekuranganp, pg.namalengkap, jk.id, x.nourut
            order by x.nourut
        ) as y group by pendidikanpegawai, nourut
        
        union all
        
        select 'Total (10.00-10.88)' as pendidikanpegawai, 167 nourut, 0 keadaanl, 0 keadaanp, 0 kebutuhanl, 0 kebutuhanp,
        0 kekuranganl, 0 kekuranganp
        
        union ALL
        
        select 'SARJANA MUDA' as pendidikanpegawai, 168 nourut, 0 keadaanl, 0 keadaanp, 0 kebutuhanl, 0 kebutuhanp,
        0 kekuranganl, 0 kekuranganp
        
        union all
        
        select pendidikanpegawai, nourut + 25, sum(keadaanl) keadaanl, sum(keadaanp) keadaanp, sum(kebutuhanl) kebutuhanl,
        sum(kebutuhanp) kebutuhanp, sum(kekuranganl) kekuranganl, sum(kekuranganp) kekuranganp  
        from (
            select x.pendidikanpegawai, x.nourut, 
            case when pg.namalengkap is not null and jk.id = 1 then count(pg.namalengkap) else 0 end as keadaanl,
            case when pg.namalengkap is not null and jk.id = 2 then count(pg.namalengkap) else 0 end as keadaanp,
            x.kebutuhanl, x.kebutuhanp, x.kekuranganl, x.kekuranganp  
            from
            (
                select a.kategorifk, b.subkategorifk, ppg.pendidikanpegawai, ppg.nourut, ppg.id, abt.kebutuhanl, abt.kekuranganl, abt.kebutuhanp, abt.kekuranganp
                from pendidikanpegawai_m ppg
                inner join abkpegawai_t abt on abt.objectpendidikanpegawaifk = ppg.id
                left join (
                    select distinct on(kategorifk) nourut, kategorifk
                    from pendidikanpegawai_m
                    where kdprofile = 30
                    and statusenabled = true
                    order by kategorifk asc, nourut asc
                ) as a on a.nourut = ppg.nourut
                left join (
                    select distinct on(subkategorifk) nourut, subkategorifk
                    from pendidikanpegawai_m
                    where kdprofile = 30
                    and statusenabled = true
                    order by subkategorifk asc, nourut asc
                ) as b on b.nourut = ppg.nourut
                where ppg.kdprofile = 30
                and ppg.id between 144 and 154
                and ppg.statusenabled = true
                order by ppg.nourut asc
            ) as x
            left JOIN pegawai_m as pg on pg.objectpendidikanpegawaifk = x.id 
            left join jeniskelamin_m jk on jk.id = pg.objectjeniskelaminfk
            group by x.pendidikanpegawai, x.kebutuhanl, x.kebutuhanp, x.kekuranganl, x.kekuranganp, pg.namalengkap, jk.id, x.nourut
            order by x.nourut
        ) as y group by pendidikanpegawai, nourut 
        
        union all
        
        select 'Total (11.00-11.88)' as pendidikanpegawai, 182 nourut, 0 keadaanl, 0 keadaanp, 0 kebutuhanl, 0 kebutuhanp,
        0 kekuranganl, 0 kekuranganp
        
        union ALL
        
        select 'SMU SEDERAJAT DAN DIBAWAHNYA' as pendidikanpegawai, 183 nourut, 0 keadaanl, 0 keadaanp, 0 kebutuhanl, 0 kebutuhanp,
        0 kekuranganl, 0 kekuranganp
        
        union all
        
        select pendidikanpegawai, nourut + 29, sum(keadaanl) keadaanl, sum(keadaanp) keadaanp, sum(kebutuhanl) kebutuhanl,
        sum(kebutuhanp) kebutuhanp, sum(kekuranganl) kekuranganl, sum(kekuranganp) kekuranganp  
        from (
            select x.pendidikanpegawai, x.nourut, 
            case when pg.namalengkap is not null and jk.id = 1 then count(pg.namalengkap) else 0 end as keadaanl,
            case when pg.namalengkap is not null and jk.id = 2 then count(pg.namalengkap) else 0 end as keadaanp,
            x.kebutuhanl, x.kebutuhanp, x.kekuranganl, x.kekuranganp  
            from
            (
                select a.kategorifk, b.subkategorifk, ppg.pendidikanpegawai, ppg.nourut, ppg.id, abt.kebutuhanl, abt.kekuranganl, abt.kebutuhanp, abt.kekuranganp
                from pendidikanpegawai_m ppg
                inner join abkpegawai_t abt on abt.objectpendidikanpegawaifk = ppg.id
                left join (
                    select distinct on(kategorifk) nourut, kategorifk
                    from pendidikanpegawai_m
                    where kdprofile = 30
                    and statusenabled = true
                    order by kategorifk asc, nourut asc
                ) as a on a.nourut = ppg.nourut
                left join (
                    select distinct on(subkategorifk) nourut, subkategorifk
                    from pendidikanpegawai_m
                    where kdprofile = 30
                    and statusenabled = true
                    order by subkategorifk asc, nourut asc
                ) as b on b.nourut = ppg.nourut
                where ppg.kdprofile = 30
                and ppg.id between 155 and 162
                and ppg.statusenabled = true
                order by ppg.nourut asc
            ) as x
            left JOIN pegawai_m as pg on pg.objectpendidikanpegawaifk = x.id 
            left join jeniskelamin_m jk on jk.id = pg.objectjeniskelaminfk
            group by x.pendidikanpegawai, x.kebutuhanl, x.kebutuhanp, x.kekuranganl, x.kekuranganp, pg.namalengkap, jk.id, x.nourut
            order by x.nourut
        ) as y group by pendidikanpegawai, nourut
        
        union all
        
        select 'Total (12.00-12.88)' as pendidikanpegawai, 194 nourut, 0 keadaanl, 0 keadaanp, 0 kebutuhanl, 0 kebutuhanp,
        0 kekuranganl, 0 kekuranganp order by nourut;"));

        $result = array(
            'data' => $data10,
            'message' => 'as@cepot',
        );
        return $this->respond($result);
    }

    public function getDataRL31YangRawatInap(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tglAwal = $request['tglAwal'];

        $main = array("Penyakit Dalam", "Kesehatan Anak", "Obstetri", "Ginekologi", "Bedah", "Bedah Ortopedhi", "Bedah Saraf", "Luka Bakar", "Saraf", "Jiwa", "Psikologi", "Penatalaksanaan Penyalahgunaan NAPZA", "THT", "Mata", "Kulit dan Kelamin", "Kardiologi", "Paru-paru", "Geriatri", "Radioterapi", "Kedokteran Nuklir", "Kusta", "Rehabilitasi Medik", "Isolasi", "ICU", "ICCU", "NICU / PICU", "Umum", "Gigi & Mulut", "Pelayanan Rawat Darurat", "SUB TOTAL", "Perinatologi", "TOTAL");



        $pasienawalperhari = DB::select(DB::raw("select tgl, sum(jumlah) as total, id, jeniskasus from (
            select tgl, jumlah, id, jeniskasus from (select apd.tglmasuk::date as tgl, count(apd.tglmasuk) as jumlah, jks.id , jks.jeniskasus
            FROM pasiendaftar_t as pd
            INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
            INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk IN (16)
						inner join jeniskasus_m jks on jks.id = pd.objectjeniskasusfk
            LEFT JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk NOT IN (16)
            where pd.kdprofile = 30 
            and pd.statusenabled = true
            and cast(apd.tglmasuk as date) between '$tglAwal-01-01'::date - interval '1 day' and '$tglAwal-12-31'::date - interval '1 day'
            and apd.tglmasuk::date != pd.tglpulang::date 
            group by apd.tglmasuk::date, jks.id, jks.jeniskasus
            ) as x

            UNION ALL

            select tgl, jumlah, id, jeniskasus from (select apd.tglmasuk::date as tgl, count(apd.tglmasuk) as jumlah, jks.id, jks.jeniskasus
            FROM pasiendaftar_t as pd
            INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
            INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk IN (16)
						inner join jeniskasus_m jks on jks.id = pd.objectjeniskasusfk
            inner JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk IN (16)
            where pd.kdprofile = 30 
            and pd.statusenabled = true
            and cast(apd.tglmasuk as date) between '$tglAwal-01-01'::date - interval '1 day' and '$tglAwal-12-31'::date - interval '1 day'
            and apd.tglmasuk::date != pd.tglpulang::date 
            group by apd.tglmasuk::date, jks.id, jks.jeniskasus
            ) as x
            ) as y 
            group by tgl, id, jeniskasus;"));



        $pasienmasuk = DB::select(DB::raw("select tgl, jumlah total, id, jeniskasus from (select apd.tglmasuk::date as tgl, count(apd.tglmasuk) as jumlah, jks.id, jks.jeniskasus
        FROM pasiendaftar_t as pd
        INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
				inner join jeniskasus_m jks on jks.id = pd.objectjeniskasusfk
        INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk IN (16)
        LEFT JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and (ru1.objectdepartemenfk NOT IN (16) or apd.objectruanganasalfk is null)
        where pd.kdprofile = 30 
        and pd.statusenabled = true
        and cast(apd.tglmasuk as date) between '$tglAwal-01-01' and '$tglAwal-12-31' 
        group by apd.tglmasuk::date, jks.id, jks.jeniskasus
        ) as x;"));


        $pasienawal = DB::select(DB::raw("select tgl, sum(jumlah) as total, id, jeniskasus from (
            select tgl, jumlah, id, jeniskasus from (select apd.tglmasuk::date as tgl, count(apd.tglmasuk) as jumlah, jks.id, jks.jeniskasus
            FROM pasiendaftar_t as pd
            INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
						inner join jeniskasus_m jks on jks.id = pd.objectjeniskasusfk
            INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk IN (16)
            LEFT JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk NOT IN (16)
            where pd.kdprofile = 30 
            and pd.statusenabled = true and pd.tglpulang::date > '$tglAwal-01-01'::date - INTERVAL '1 DAY'
            group by apd.tglmasuk::date, jks.id, jks.jeniskasus
            ) as x

            UNION ALL

            select tgl, jumlah, id, jeniskasus from (select apd.tglmasuk::date as tgl, count(apd.tglmasuk) as jumlah, jks.id, jks.jeniskasus
            FROM pasiendaftar_t as pd
            INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
						inner join jeniskasus_m jks on jks.id = pd.objectjeniskasusfk
            INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk IN (16)
            inner JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk IN (16)
            where pd.kdprofile = 30 
            and pd.statusenabled = true
            and  pd.tglpulang::date > '$tglAwal-01-01'::date - INTERVAL '1 DAY'
            group by apd.tglmasuk::date, jks.id, jks.jeniskasus
            ) as x
            ) as y 
            group by tgl, id, jeniskasus;"));



        $pasienakhir = DB::select(DB::raw("select tgl, sum(jumlah) as total, id, jeniskasus from (
            select tgl, jumlah, id, jeniskasus from (select apd.tglmasuk::date as tgl, count(apd.tglmasuk) as jumlah, jks.id, jks.jeniskasus
            FROM pasiendaftar_t as pd
            INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
						inner join jeniskasus_m jks on jks.id = pd.objectjeniskasusfk
            INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk IN (16)
            LEFT JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk NOT IN (16)
            where pd.kdprofile = 30 
            and pd.statusenabled = true
            and cast(apd.tglmasuk as date) = '$tglAwal-12-31'::date
            group by apd.tglmasuk::date, jks.id, jks.jeniskasus
            ) as x

            UNION ALL

            select tgl, jumlah, id, jeniskasus from (select apd.tglmasuk::date as tgl, count(apd.tglmasuk) as jumlah, jks.id, jks.jeniskasus
            FROM pasiendaftar_t as pd
            INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
						inner join jeniskasus_m jks on jks.id = pd.objectjeniskasusfk
            INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk IN (16)
            inner JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk IN (16)
            where pd.kdprofile = 30 
            and pd.statusenabled = true
            and cast(apd.tglmasuk as date) = '$tglAwal-12-31'::date
            group by apd.tglmasuk::date, jks.id, jks.jeniskasus
            ) as x
            ) as y 
            group by tgl, id, jeniskasus;"));


        $lamahari = DB::select(DB::raw("select sum(y.totallama) as total, y.id, y.jeniskasus from(
            select x.tanggalpulang, sum(x.lamadirawat) as totallama, x.id, x.jeniskasus from(
            with cte as (
                select pdt.norec, min(apdt.tglmasuk::date) tglmasuk from pasiendaftar_t as pdt
                inner join antrianpasiendiperiksa_t as apdt on apdt.noregistrasifk = pdt.norec
                inner join ruangan_m as rum on rum.id = apdt.objectruanganfk
                where rum.objectdepartemenfk = 16
                and pdt.statusenabled = TRUE
                and pdt.kdprofile = 30
                and pdt.tglpulang::date between '$tglAwal-01-01' and '$tglAwal-12-31'
                group by pdt.norec, apdt.objectruanganfk
            ),
						cteruangan as (
                select pdt.norec, min(apdt.tglmasuk::date) tglmasuk, rum.namaruangan from pasiendaftar_t as pdt
                inner join antrianpasiendiperiksa_t as apdt on apdt.noregistrasifk = pdt.norec
                inner join ruangan_m as rum on rum.id = apdt.objectruanganfk
                where (rum.id = 765 or rum.id = 768)
                and pdt.kdprofile = 30
                and pdt.tglpulang::date between '$tglAwal-01-01' and '$tglAwal-12-31'
                group by pdt.norec, apdt.objectruanganfk, rum.namaruangan
            )
            
            select pd.tglpulang::date as tanggalpulang, cte.tglmasuk as tanggalmasuk, cteruangan.namaruangan as ruanganasal, jks.id, jks.jeniskasus, 
            case when pd.tglpulang::date-cte.tglmasuk::date = 0 then 1 else  pd.tglpulang::date-cte.tglmasuk end as lamadirawat
                        FROM pasiendaftar_t as pd
												inner join jeniskasus_m jks on jks.id = pd.objectjeniskasusfk
                        INNER JOIN cte on cte.norec = pd.norec
												inner join cteruangan on cteruangan.norec = pd.norec
                        WHERE pd.kdprofile = 30 and pd.tglpulang is not null and cast(pd.tglpulang as date) between '$tglAwal-01-01' and '$tglAwal-12-31'
                                    group by pd.tglpulang::date, cte.tglmasuk, cteruangan.namaruangan, jks.id, jks.jeniskasus 
                                    order by pd.tglpulang::date) as x group by x.tanggalpulang, x.id, x.jeniskasus) as y group by y.id, y.jeniskasus
            "));


        $hidup = DB::select(DB::raw("with cte as(
                select min(apd.tglmasuk), ru.namaruangan, pd.norec
                FROM pasiendaftar_t as pd
                inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk
                where pd.kdprofile = 30 and pd.statusenabled = true and ru.objectdepartemenfk <> 16
                group by ru.namaruangan, pd.norec
                )
                select pd.tglpulang::date as tgl, count(pd.noregistrasi) total, jks.id, jks.jeniskasus
                            FROM pasiendaftar_t as pd
                                        INNER JOIN ruangan_m as rum on rum.id = pd.objectruanganlastfk
																				inner join jeniskasus_m jks on jks.id = pd.objectjeniskasusfk
                                        inner join cte on pd.norec = cte.norec
                            where pd.kdprofile = 30 and pd.statusenabled = true
                                        and cast(pd.tglpulang as date) between '$tglAwal-01-01' and '$tglAwal-12-31'
                                        and rum.objectdepartemenfk = 16
                            and pd.tglpulang is not null
                                        group by pd.tglpulang::date, jks.id, jks.jeniskasus;"));

        $meninggal = DB::select(DB::raw("with cte as(
                select min(apd.tglmasuk), ru.namaruangan, pd.norec
                FROM pasiendaftar_t as pd
                inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk
                where pd.kdprofile = 30 and pd.statusenabled = true and ru.objectdepartemenfk <> 16
                group by ru.namaruangan, pd.norec
                )
                select pd.tglmeninggal::date as tgl, count(pd.noregistrasi) total, jks.id, jks.jeniskasus, kps.id idkondisi
                            FROM pasiendaftar_t as pd
                                        inner join kondisipasien_m kps on kps.id = pd.objectkondisipasienfk
                            inner join ruangan_m ru on ru.id = pd.objectruanganlastfk
														inner join jeniskasus_m jks on jks.id = pd.objectjeniskasusfk
                                        inner join cte on cte.norec = pd.norec
                            where pd.kdprofile = 30 and pd.statusenabled = true
                                        and cast(pd.tglmeninggal as date) between '$tglAwal-01-01' and '$tglAwal-12-31'
                            and ru.objectdepartemenfk = 16
                                        group by pd.tglmeninggal::date, cte.namaruangan, kps.id, jks.id, jks.jeniskasus;"));


        $kelas = DB::select(DB::raw("select tgl, sum(jumlah) as total, id, jeniskasus, objectkelasfk from (
                select tgl, jumlah, id, jeniskasus, objectkelasfk from (select apd.tglmasuk::date as tgl, count(apd.tglmasuk) as jumlah, jks.id, jks.jeniskasus, apd.objectkelasfk
                FROM pasiendaftar_t as pd
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
								inner join jeniskasus_m jks on jks.id = pd.objectjeniskasusfk
                INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk IN (16)
                LEFT JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk NOT IN (16)
                where pd.kdprofile = 30 
                and pd.statusenabled = true
                and cast(apd.tglmasuk as date) between '$tglAwal-01-01' and '$tglAwal-12-31'
                group by apd.tglmasuk::date, jks.id, jks.jeniskasus, apd.objectkelasfk
                ) as x
    
                UNION ALL
    
                select tgl, jumlah, id, jeniskasus, objectkelasfk from (select apd.tglmasuk::date as tgl, count(apd.tglmasuk) as jumlah, jks.id, jks.jeniskasus, apd.objectkelasfk
                FROM pasiendaftar_t as pd
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
								inner join jeniskasus_m jks on jks.id = pd.objectjeniskasusfk
                INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk IN (16)
                inner JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk IN (16)
                where pd.kdprofile = 30 
                and pd.statusenabled = true
                and cast(apd.tglmasuk as date) between '$tglAwal-01-01' and '$tglAwal-12-31'
                group by apd.tglmasuk::date, jks.id, jks.jeniskasus, apd.objectkelasfk
                ) as x group by tgl, id, jeniskasus, objectkelasfk, x.jumlah
                ) as y 
                group by tgl, id, jeniskasus, objectkelasfk"));

        $profile = DB::select(DB::raw("select namakota, namalengkap, namapemerintahan, id idprofile
        from profile_m where id = $kdProfile"));


        $main = array("Penyakit Dalam", "Kesehatan Anak", "Obstetri", "Ginekologi", "Bedah", "Bedah Ortopedhi", "Bedah Saraf", "Luka Bakar", "Saraf", "Jiwa", "Psikologi", "Penatalaksanaan Penyalahgunaan NAPZA", "THT", "Mata", "Kulit dan Kelamin", "Kardiologi", "Paru-paru", "Geriatri", "Radioterapi", "Kedokteran Nuklir", "Kusta", "Rehabilitasi Medik", "Isolasi", "ICU", "ICCU", "NICU / PICU", "Umum", "Gigi & Mulut", "Pelayanan Rawat Darurat", "Perinatologi", "SUB TOTAL", "Perinatologi", "TOTAL");
        $currentmain = "Larasatizka";

        $jumlahpasienawal = 0;
        $jumlahpasienmasuk = 0;
        $jumlahpasienhidup = 0;
        $jumlahpasienkurang = 0;
        $jumlahpasienlebih = 0;
        $jumlahlamadirawat = 0;
        $jumlahpasienakhir = 0;
        $jumlahhariperawatan = 0;
        $jumlahvvip = 0;
        $jumlahvip = 0;
        $jumlahsatu = 0;
        $jumlahdua = 0;
        $jumlahtiga = 0;
        $jumlahkhusus = 0;
        $jumlahpasienawalperhari = 0;

        foreach ($main as $row) {
            $jumlahpasienawal = 0;
            $jumlahpasienmasuk = 0;
            $jumlahpasienhidup = 0;
            $jumlahpasienkurang = 0;
            $jumlahpasienlebih = 0;
            $jumlahlamadirawat = 0;
            $jumlahpasienakhir = 0;
            $jumlahhariperawatan = 0;
            $jumlahpasienawalperhari = 0;
            $jumlahvvip = 0;
            $jumlahvip = 0;
            $jumlahsatu = 0;
            $jumlahdua = 0;
            $jumlahtiga = 0;
            $jumlahkhusus = 0;
            if ($row != $currentmain) {

                foreach ($profile as $pr) {
                    $koders = $pr->idprofile;
                    $namakota = $pr->namakota;
                    $namars = $pr->namalengkap;
                }
                foreach ($pasienawal as $pa) {
                    if ($row == "Penyakit Dalam" && $pa->id == 1) {
                        $jumlahpasienawal += $pa->total;
                    } else if ($row == "Kesehatan Anak" && $pa->id == 2) {
                        $jumlahpasienawal += $pa->total;
                    } else if ($row == "Geriatri" && $pa->id == 3) {
                        $jumlahpasienawal += $pa->total;
                    } else if ($row == "Saraf" && $pa->id == 4) {
                        $jumlahpasienawal += $pa->total;
                    } else if ($row == "Jiwa" && $pa->id == 5) {
                        $jumlahpasienawal += $pa->total;
                    } else if ($row == "Penatalaksanaan Penyalahgunaan NAPZA" && $pa->id == 6) {
                        $jumlahpasienawal += $pa->total;
                    }
                }
                foreach ($pasienmasuk as $pm) {
                    if ($row == "Penyakit Dalam" && $pm->id == 1) {
                        $jumlahpasienmasuk += $pm->total;
                    } else if ($row == "Kesehatan Anak" && $pm->id == 2) {
                        $jumlahpasienmasuk += $pm->total;
                    } else if ($row == "Geriatri" && $pm->id == 3) {
                        $jumlahpasienmasuk += $pm->total;
                    } else if ($row == "Saraf" && $pm->id == 4) {
                        $jumlahpasienmasuk += $pm->total;
                    } else if ($row == "Jiwa" && $pm->id == 5) {
                        $jumlahpasienmasuk += $pm->total;
                    } else if ($row == "Penatalaksanaan Penyalahgunaan NAPZA" && $pm->id == 6) {
                        $jumlahpasienmasuk += $pm->total;
                    }
                }
                foreach ($hidup as $hd) {
                    if ($row == "Penyakit Dalam" && $hd->id == 1) {
                        $jumlahpasienhidup += $hd->total;
                    } else if ($row == "Kesehatan Anak" && $hd->id == 2) {
                        $jumlahpasienhidup += $hd->total;
                    } else if ($row == "Geriatri" && $hd->id == 3) {
                        $jumlahpasienhidup += $hd->total;
                    } else if ($row == "Saraf" && $hd->id == 4) {
                        $jumlahpasienhidup += $hd->total;
                    } else if ($row == "Jiwa" && $hd->id == 5) {
                        $jumlahpasienhidup += $hd->total;
                    } else if ($row == "Penatalaksanaan Penyalahgunaan NAPZA" && $hd->id == 6) {
                        $jumlahpasienhidup += $hd->total;
                    }
                }
                foreach ($meninggal as $mg) {

                    if ($row == "Penyakit Dalam" && $mg->id == 1 && $mg->idkondisi == 5) {
                        $jumlahpasienkurang += $mg->total;
                    } else if ($row == "Kesehatan Anak" && $mg->id == 2 && $mg->idkondisi == 5) {
                        $jumlahpasienkurang += $mg->total;
                    } else if ($row == "Geriatri" && $mg->id == 3 && $mg->idkondisi == 5) {
                        $jumlahpasienkurang += $mg->total;
                    } else if ($row == "Saraf" && $mg->id == 4 && $mg->idkondisi == 5) {
                        $jumlahpasienkurang += $mg->total;
                    } else if ($row == "Jiwa" && $mg->id == 5 && $mg->idkondisi == 5) {
                        $jumlahpasienkurang += $mg->total;
                    } else if ($row == "Penatalaksanaan Penyalahgunaan NAPZA" && $mg->id == 6 && $mg->idkondisi == 5) {
                        $jumlahpasienkurang += $mg->total;
                    }



                    if ($row == "Penyakit Dalam" && $mg->id == 1 && $mg->idkondisi == 6) {
                        $jumlahpasienlebih += $mg->total;
                    } else if ($row == "Kesehatan Anak" && $mg->id == 2 && $mg->idkondisi == 6) {
                        $jumlahpasienlebih += $mg->total;
                    } else if ($row == "Geriatri" && $mg->id == 3 && $mg->idkondisi == 6) {
                        $jumlahpasienlebih += $mg->total;
                    } else if ($row == "Saraf" && $mg->id == 4 && $mg->idkondisi == 6) {
                        $jumlahpasienlebih += $mg->total;
                    } else if ($row == "Jiwa" && $mg->id == 5 && $mg->idkondisi == 6) {
                        $jumlahpasienlebih += $mg->total;
                    } else if ($row == "Penatalaksanaan Penyalahgunaan NAPZA" && $mg->id == 6 && $mg->idkondisi == 6) {
                        $jumlahpasienlebih += $mg->total;
                    }
                }
                foreach ($lamahari as $lh) {
                    if ($row == "Penyakit Dalam" && $lh->id == 1) {
                        $jumlahlamadirawat += $lh->total;
                    } else if ($row == "Kesehatan Anak" && $lh->id == 2) {
                        $jumlahlamadirawat += $lh->total;
                    } else if ($row == "Geriatri" && $lh->id == 3) {
                        $jumlahlamadirawat += $lh->total;
                    } else if ($row == "Saraf" && $lh->id == 4) {
                        $jumlahlamadirawat += $lh->total;
                    } else if ($row == "Jiwa" && $lh->id == 5) {
                        $jumlahlamadirawat += $lh->total;
                    } else if ($row == "Penatalaksanaan Penyalahgunaan NAPZA" && $lh->id == 6) {
                        $jumlahlamadirawat += $lh->total;
                    }
                }
                foreach ($pasienakhir as $pa) {
                    if ($row == "Penyakit Dalam" && $pa->id == 1) {
                        $jumlahpasienakhir += $pa->total;
                    } else if ($row == "Kesehatan Anak" && $pa->id == 2) {
                        $jumlahpasienakhir += $pa->total;
                    } else if ($row == "Geriatri" && $pa->id == 3) {
                        $jumlahpasienakhir += $pa->total;
                    } else if ($row == "Saraf" && $pa->id == 4) {
                        $jumlahpasienakhir += $pa->total;
                    } else if ($row == "Jiwa" && $pa->id == 5) {
                        $jumlahpasienakhir += $pa->total;
                    } else if ($row == "Penatalaksanaan Penyalahgunaan NAPZA" && $pa->id == 6) {
                        $jumlahpasienakhir += $pa->total;
                    }
                }
                foreach ($kelas as $kl) {

                    if ($row == "Penyakit Dalam" && $kl->id == 1 && $kl->objectkelasfk == 4) {
                        $jumlahvip += $kl->total;
                    } else if ($row == "Kesehatan Anak" && $kl->id == 2 && $kl->objectkelasfk == 4) {
                        $jumlahvip += $kl->total;
                    } else if ($row == "Geriatri" && $kl->id == 3 && $kl->objectkelasfk == 4) {
                        $jumlahvip += $kl->total;
                    } else if ($row == "Saraf" && $kl->id == 4 && $kl->objectkelasfk == 4) {
                        $jumlahvip += $kl->total;
                    } else if ($row == "Jiwa" && $kl->id == 5 && $kl->objectkelasfk == 4) {
                        $jumlahvip += $kl->total;
                    } else if ($row == "Penatalaksanaan Penyalahgunaan NAPZA" && $kl->id == 6 && $kl->objectkelasfk == 4) {
                        $jumlahvip += $kl->total;
                    }

                    if ($row == "Penyakit Dalam" && $kl->id == 1 && $kl->objectkelasfk == 3) {
                        $jumlahsatu += $kl->total;
                    } else if ($row == "Kesehatan Anak" && $kl->id == 2 && $kl->objectkelasfk == 3) {
                        $jumlahsatu += $kl->total;
                    } else if ($row == "Geriatri" && $kl->id == 3 && $kl->objectkelasfk == 3) {
                        $jumlahsatu += $kl->total;
                    } else if ($row == "Saraf" && $kl->id == 4 && $kl->objectkelasfk == 3) {
                        $jumlahsatu += $kl->total;
                    } else if ($row == "Jiwa" && $kl->id == 5 && $kl->objectkelasfk == 3) {
                        $jumlahsatu += $kl->total;
                    } else if ($row == "Penatalaksanaan Penyalahgunaan NAPZA" && $kl->id == 6 && $kl->objectkelasfk == 3) {
                        $jumlahsatu += $kl->total;
                    }

                    if ($row == "Penyakit Dalam" && $kl->id == 1 && $kl->objectkelasfk == 2) {
                        $jumlahdua += $kl->total;
                    } else if ($row == "Kesehatan Anak" && $kl->id == 2 && $kl->objectkelasfk == 2) {
                        $jumlahdua += $kl->total;
                    } else if ($row == "Geriatri" && $kl->id == 3 && $kl->objectkelasfk == 2) {
                        $jumlahdua += $kl->total;
                    } else if ($row == "Saraf" && $kl->id == 4 && $kl->objectkelasfk == 2) {
                        $jumlahdua += $kl->total;
                    } else if ($row == "Jiwa" && $kl->id == 5 && $kl->objectkelasfk == 2) {
                        $jumlahdua += $kl->total;
                    } else if ($row == "Penatalaksanaan Penyalahgunaan NAPZA" && $kl->id == 6 && $kl->objectkelasfk == 2) {
                        $jumlahdua += $kl->total;
                    }

                    if ($row == "Penyakit Dalam" && $kl->id == 1 && $kl->objectkelasfk == 1) {
                        $jumlahtiga += $kl->total;
                    } else if ($row == "Kesehatan Anak" && $kl->id == 2 && $kl->objectkelasfk == 1) {
                        $jumlahtiga += $kl->total;
                    } else if ($row == "Geriatri" && $kl->id == 3 && $kl->objectkelasfk == 1) {
                        $jumlahtiga += $kl->total;
                    } else if ($row == "Saraf" && $kl->id == 4 && $kl->objectkelasfk == 1) {
                        $jumlahtiga += $kl->total;
                    } else if ($row == "Jiwa" && $kl->id == 5 && $kl->objectkelasfk == 1) {
                        $jumlahtiga += $kl->total;
                    } else if ($row == "Penatalaksanaan Penyalahgunaan NAPZA" && $kl->id == 6 && $kl->objectkelasfk == 1) {
                        $jumlahtiga += $kl->total;
                    }

                    if ($row == "Penyakit Dalam" && $kl->id == 1 && $kl->objectkelasfk == 6) {
                        $jumlahkhusus += $kl->total;
                    } else if ($row == "Kesehatan Anak" && $kl->id == 2 && $kl->objectkelasfk == 6) {
                        $jumlahkhusus += $kl->total;
                    } else if ($row == "Geriatri" && $kl->id == 3 && $kl->objectkelasfk == 6) {
                        $jumlahkhusus += $kl->total;
                    } else if ($row == "Saraf" && $kl->id == 4 && $kl->objectkelasfk == 6) {
                        $jumlahkhusus += $kl->total;
                    } else if ($row == "Jiwa" && $kl->id == 5 && $kl->objectkelasfk == 6) {
                        $jumlahkhusus += $kl->total;
                    } else if ($row == "Penatalaksanaan Penyalahgunaan NAPZA" && $kl->id == 6 && $kl->objectkelasfk == 6) {
                        $jumlahkhusus += $kl->total;
                    }
                }
                foreach ($pasienawalperhari as $pap) {
                    if ($row == "Penyakit Dalam" && $pap->id == 1) {
                        $jumlahpasienawalperhari += $pap->total;
                    } else if ($row == "Kesehatan Anak" && $pap->id == 2) {
                        $jumlahpasienawalperhari += $pap->total;
                    } else if ($row == "Geriatri" && $pap->id == 3) {
                        $jumlahpasienawalperhari += $pap->total;
                    } else if ($row == "Saraf" && $pap->id == 4) {
                        $jumlahpasienawalperhari += $pap->total;
                    } else if ($row == "Jiwa" && $pap->id == 5) {
                        $jumlahpasienawalperhari += $pap->total;
                    } else if ($row == "Penatalaksanaan Penyalahgunaan NAPZA" && $pap->id == 6) {
                        $jumlahpasienawalperhari += $pap->total;
                    }
                }

                $jumlahhariperawatan = $jumlahpasienmasuk + $jumlahpasienawalperhari;

                $data10[] = array(
                    'pelayanan' => $row,
                    'koders' => $koders,
                    'namakota' => $namakota,
                    'namars' => $namars,
                    'jumlahpasienawal' => $jumlahpasienawal,
                    'jumlahpasienmasuk' => $jumlahpasienmasuk,
                    'jumlahpasienhidup' => $jumlahpasienhidup,
                    'jumlahpasienkurang' => $jumlahpasienkurang,
                    'jumlahpasienlebih' => $jumlahpasienlebih,
                    'jumlahlamadirawat' => $jumlahlamadirawat,
                    'jumlahpasienakhir' => $jumlahpasienakhir,
                    'jumlahhariperawatan' => $jumlahhariperawatan,
                    'jumlahvvip' => $jumlahvvip,
                    'jumlahvip' => $jumlahvip,
                    'jumlahsatu' => $jumlahsatu,
                    'jumlahdua' => $jumlahdua,
                    'jumlahtiga' => $jumlahtiga,
                    'jumlahkhusus' => $jumlahkhusus,
                );
            }
            $currentmain = $row;
        }

        $result = array(
            'data' => $data10,
            'message' => 'as@cepot',
        );
        return $this->respond($result);
    }
    public function getLaporanRL32RawatDarurat(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];

        $main = array("Bedah", "Non Bedah", "Kebidanan", "Psikiatrik", "Anak", "TOTAL");

        $data10 = DB::select(DB::raw("select ru.namaruangan, ru.id, DATE_PART('year', AGE(pd.tglregistrasi, ps.tgllahir)) AS years, min(apd.tglmasuk), pd.noregistrasi, apd.objectruanganfk, pd.objectruanganlastfk, pd.tglpulang, pd.objectstatuspulangfk,
        case when apd.objectasalrujukanfk in(1,2,3,4,8,9,11,12,13,14,15,16,17) then count(pd.noregistrasi) else 0 end as jumlahrujukan,
        case when apd.objectasalrujukanfk in(5,6,7,10) then count(pd.noregistrasi) else 0 end as jumlahnonrujukan,
        case when (pd.objectruanganlastfk <> apd.objectruanganfk and pd.objectstatuspulangfk is null) or (pd.objectruanganlastfk <> apd.objectruanganfk and pd.objectstatuspulangfk not in(10,11,5,4)) then count(pd.noregistrasi) else 0 end as jumlahdirawat,
        case when pd.objectstatuspulangfk in(10,11,5,4) then count(pd.noregistrasi) else 0 end as jumlahdirujuk,
        case when min(apd.tglmasuk) = pd.tglpulang and pd.objectruanganlastfk = apd.objectruanganfk and pd.objectstatuspulangfk is null then count(pd.noregistrasi) else 0 end as jumlahpulang,
        case when pd.objectstatuspulangfk = 9 and pd.objectruanganlastfk = apd.objectruanganfk then count(pd.noregistrasi) else 0 end as jumlahmeninggal,
        case when pd.objectkondisipasienfk = 7 and pd.objectruanganlastfk = apd.objectruanganfk then count(pd.noregistrasi) else 0 end as jumlahdoa
        FROM
        pasiendaftar_t pd
        INNER JOIN antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
        INNER JOIN pasien_m ps on ps.id=pd.nocmfk
        inner join ruangan_m ru on ru.id = apd.objectruanganfk
        where pd.kdprofile = 30 and pd.statusenabled = TRUE
        and pd.tglregistrasi between '$tglAwal' and '$tglAkhir'
        and apd.tglmasuk between '$tglAwal' and '$tglAkhir'
        and ru.id in (765, 29)
        group by ru.namaruangan, ru.id, pd.objectkondisipasienfk, DATE_PART('year', AGE(pd.tglregistrasi, ps.tgllahir)), pd.noregistrasi, apd.objectruanganfk, pd.objectruanganlastfk, pd.tglpulang, pd.objectstatuspulangfk, apd.objectasalrujukanfk, pd.objectstatuspulangfk, pd.objectruanganlastfk, apd.objectruanganfk;
        "));
        //var_dump($data10);

        $rujukan = 0;
        $nonrujukan = 0;
        $dirawat = 0;
        $dirujuk = 0;
        $pulang = 0;
        $meninggal = 0;
        $doa = 0;

        foreach ($main as $row) {
            $rujukan = 0;
            $nonrujukan = 0;
            $dirawat = 0;
            $dirujuk = 0;
            $pulang = 0;
            $meninggal = 0;
            $doa = 0;

            foreach ($data10 as $data) {
                if ($row == 'Psikiatrik' && $data->id == 765) {
                    $rujukan += $data->jumlahrujukan;
                    $nonrujukan += $data->jumlahnonrujukan;
                    $dirawat += $data->jumlahdirawat;
                    $dirujuk += $data->jumlahdirujuk;
                    $pulang += $data->jumlahpulang;
                    $meninggal += $data->jumlahmeninggal;
                    $doa += $data->jumlahdoa;
                }

                if ($row == 'Non Bedah' && $data->id == 29 && $data->years > 18) {
                    $rujukan += $data->jumlahrujukan;
                    $nonrujukan += $data->jumlahnonrujukan;
                    $dirawat += $data->jumlahdirawat;
                    $dirujuk += $data->jumlahdirujuk;
                    $pulang += $data->jumlahpulang;
                    $meninggal += $data->jumlahmeninggal;
                    $doa += $data->jumlahdoa;
                }

                if ($row == 'Anak' && $data->id == 29 && $data->years <= 18) {
                    $rujukan += $data->jumlahrujukan;
                    $nonrujukan += $data->jumlahnonrujukan;
                    $dirawat += $data->jumlahdirawat;
                    $dirujuk += $data->jumlahdirujuk;
                    $pulang += $data->jumlahpulang;
                    $meninggal += $data->jumlahmeninggal;
                    $doa += $data->jumlahdoa;
                }
            }


            $datas[] = array(
                'namaruangan' => $row,
                'jumlahrujukanfix' => $rujukan,
                'jumlahnonrujukanfix' => $nonrujukan,
                'jumlahdirawatfix' => $dirawat,
                'jumlahdirujukfix' => $dirujuk,
                'jumlahpulangfix' => $pulang,
                'jumlahmeninggalfix' => $meninggal,
                'jumlahdoafix' => $doa,
            );
        }

        $result = array(
            'data' => $datas,
            'message' => 'er@epic',

        );

        return $this->respond($result);
    }

    public function getRujukanPerbulan(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tahun = $request['tahun'];

        $data10 = DB::select(DB::raw("select namaruangan, sum(jumlahrujukanjanuari) jumlahrujukanjanuari, sum(jumlahnonrujukanjanuari) jumlahnonrujukanjanuari,
        sum(jumlahrujukanfebruari) jumlahrujukanfebruari, sum(jumlahnonrujukanfebruari) jumlahnonrujukanfebruari,
        sum(jumlahrujukanmaret) jumlahrujukanmaret, sum(jumlahnonrujukanmaret) jumlahnonrujukanmaret,
        sum(jumlahrujukanapril) jumlahrujukanapril, sum(jumlahnonrujukanapril) jumlahnonrujukanapril,
        sum(jumlahrujukanmei) jumlahrujukanmei, sum(jumlahnonrujukanmei) jumlahnonrujukanmei,
        sum(jumlahrujukanjuni) jumlahrujukanjuni, sum(jumlahnonrujukanjuni) jumlahnonrujukanjuni,
        sum(jumlahrujukanjuli) jumlahrujukanjuli, sum(jumlahnonrujukanjuli) jumlahnonrujukanjuli,
        sum(jumlahrujukanagustus) jumlahrujukanagustus, sum(jumlahnonrujukanagustus) jumlahnonrujukanagustus,
        sum(jumlahrujukanseptember) jumlahrujukanseptember, sum(jumlahnonrujukanseptember) jumlahnonrujukanseptember,
        sum(jumlahrujukanoktober) jumlahrujukanoktober, sum(jumlahnonrujukanoktober) jumlahnonrujukanoktober,
        sum(jumlahrujukannovember) jumlahrujukannovember, sum(jumlahnonrujukannovember) jumlahnonrujukannovember,
        sum(jumlahrujukandesember) jumlahrujukandesember, sum(jumlahnonrujukandesember) jumlahnonrujukandesember
        from(
            select namaruangan,
            case when bulan = 'January' then sum(jumlahrujukan) else 0 end as jumlahrujukanjanuari,
            case when bulan = 'January' then sum(jumlahnonrujukan) else 0 end as jumlahnonrujukanjanuari,
            case when bulan = 'February' then sum(jumlahrujukan) else 0 end as jumlahrujukanfebruari,
            case when bulan = 'February' then sum(jumlahnonrujukan) else 0 end as jumlahnonrujukanfebruari,
            case when bulan = 'March' then sum(jumlahrujukan) else 0 end as jumlahrujukanmaret,
            case when bulan = 'March' then sum(jumlahnonrujukan) else 0 end as jumlahnonrujukanmaret,
            case when bulan = 'April' then sum(jumlahrujukan) else 0 end as jumlahrujukanapril,
            case when bulan = 'April' then sum(jumlahnonrujukan) else 0 end as jumlahnonrujukanapril,
            case when bulan = 'May' then sum(jumlahrujukan) else 0 end as jumlahrujukanmei,
            case when bulan = 'May' then sum(jumlahnonrujukan) else 0 end as jumlahnonrujukanmei,
            case when bulan = 'June' then sum(jumlahrujukan) else 0 end as jumlahrujukanjuni,
            case when bulan = 'June' then sum(jumlahnonrujukan) else 0 end as jumlahnonrujukanjuni,
            case when bulan = 'July' then sum(jumlahrujukan) else 0 end as jumlahrujukanjuli,
            case when bulan = 'July' then sum(jumlahnonrujukan) else 0 end as jumlahnonrujukanjuli,
            case when bulan = 'August' then sum(jumlahrujukan) else 0 end as jumlahrujukanagustus,
            case when bulan = 'August' then sum(jumlahnonrujukan) else 0 end as jumlahnonrujukanagustus,
            case when bulan = 'September' then sum(jumlahrujukan) else 0 end as jumlahrujukanseptember,
            case when bulan = 'September' then sum(jumlahnonrujukan) else 0 end as jumlahnonrujukanseptember,
            case when bulan = 'October' then sum(jumlahrujukan) else 0 end as jumlahrujukanoktober,
            case when bulan = 'October' then sum(jumlahnonrujukan) else 0 end as jumlahnonrujukanoktober,
            case when bulan = 'November' then sum(jumlahrujukan) else 0 end as jumlahrujukannovember,
            case when bulan = 'November' then sum(jumlahnonrujukan) else 0 end as jumlahnonrujukannovember,
            case when bulan = 'December' then sum(jumlahrujukan) else 0 end as jumlahrujukandesember,
            case when bulan = 'December' then sum(jumlahnonrujukan) else 0 end as jumlahnonrujukandesember
            from(
            select rtrim(to_char(pd.tglregistrasi, 'Month'), ' ') as bulan, ru.namaruangan,
            case when apd.objectasalrujukanfk in(1,2,3,4,8,9,11,12,13,14,15,16,17,18) then count(pd.noregistrasi) else 0 end as jumlahrujukan,
          case when apd.objectasalrujukanfk in(5,6,7,10) then count(pd.noregistrasi) else 0 end as jumlahnonrujukan
                            FROM
                            pasiendaftar_t pd
                            INNER JOIN antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                            INNER JOIN pasien_m ps on ps.id=pd.nocmfk
                            inner join ruangan_m ru on ru.id = apd.objectruanganfk
                            where pd.kdprofile = 30 and pd.statusenabled = TRUE
                            and pd.tglregistrasi between '$tahun-01-01 00:00' and '$tahun-12-31 23:59'
                            and apd.tglmasuk between '$tahun-01-01 00:00' and '$tahun-12-31 23:59'
                            and ru.id in (765, 29)
                            group by rtrim(to_char(pd.tglregistrasi, 'Month'), ' '), ru.namaruangan, apd.objectasalrujukanfk
            ) as x group by namaruangan, bulan
        ) as y group by namaruangan
        "));

        $result = array(
            'data' => $data10,
            'message' => 'er@epic',

        );

        return $this->respond($result);
    }

    public function getKegiatanKesehatanGigidanMulut(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $KdJenisLapGigiMulut = (int) $this->settingDataFixed('KdJenisLapGigiMulut', $idProfile);
        $dataLogin = $request->all();
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];

        $main = DB::select(DB::raw("select mptlr.norec, pro.id as idproduk, pro.namaproduk, jl.id, jl.jenislaporan,
        kl.id as idkelompoklaporan, kl.kelompoklaporan, ru.id as idruangan, ru.namaruangan, kl.init
        from mapproduktolaporanrl_m as mptlr
        inner join jenislaporan_m as jl on jl.id = mptlr.objectjenislaporanfk
        inner join kelompoklaporan_m as kl on kl.id = mptlr.objectkontenlaporanfk
        left join produk_m as pro on pro.id = mptlr.produkfk
        left join ruangan_m as ru on ru.id = mptlr.ruanganfk
        where mptlr.kdprofile = 30
        and mptlr.statusenabled = true
        and kl.kdprofile = 30
        and kl.statusenabled = true
        and jl.kdprofile = 30
        and jl.statusenabled = true
        and jl.id = 7
        order by jl.id asc, kl.nourut asc"));

        $mainaja = DB::select(DB::raw("select jl.id, jl.jenislaporan, kl.id as idkelompoklaporan, kl.kelompoklaporan, kl.init
        from mapproduktolaporanrl_m as mptlr
        inner join jenislaporan_m as jl on jl.id = mptlr.objectjenislaporanfk
        inner join kelompoklaporan_m as kl on kl.id = mptlr.objectkontenlaporanfk
        where mptlr.kdprofile = 30
        and mptlr.statusenabled = true
        and kl.kdprofile = 30
        and kl.statusenabled = true
        and jl.kdprofile = 30
        and jl.statusenabled = true
        and jl.id = 7
		group by jl.id, jl.jenislaporan, kl.id, kl.kelompoklaporan, kl.init
        order by jl.id asc, kl.nourut asc"));

        $data10 = DB::select(DB::raw("
        SELECT pr.id idproduk, ru.namaruangan, ru.id idruangan, pr.namaproduk, sum(ppd.jumlah) as jumlah
                FROM
                pasiendaftar_t pd
                INNER JOIN antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                INNER JOIN pasien_m ps on ps.id=pd.nocmfk
                inner join ruangan_m ru on ru.id = apd.objectruanganfk
                inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
                inner join pelayananpasiendetail_t ppd on ppd.pelayananpasien = pp.norec
                inner  join produk_m pr on pr.id=pp.produkfk
                WHERE pp.tglpelayanan::date BETWEEN '$tglAwal' and '$tglAkhir'
                and apd.kdprofile = $idProfile
                and pd.kdprofile = $idProfile
                and apd.statusenabled = true
                and pd.statusenabled=true
                and pp.isobat is null
                and ru.id = 759
                and pr.id not in(5006463,5008635,5008644)
        group by ru.namaruangan, pr.namaproduk, pr.id, ru.id
        "));

        $jumlah = 0;
        foreach ($main as $row) {
            $jumlah = 0;

            foreach ($data10 as $data) {
                if ($row->idruangan == $data->idruangan || $row->idproduk == $data->idproduk) {
                    $jumlah += $data->jumlah;
                }
            }

            $datas[] = array(
                'namaruangan' => $row->kelompoklaporan,
                'no' => $row->init,
                'jumlahtotal' => $jumlah,
            );
        }

        $jumlahaja = 0;
        $jumlahtotal = 0;
        foreach ($mainaja as $mj) {
            $jumlahaja = 0;

            foreach ($datas as $dt) {
                if ($mj->kelompoklaporan == $dt['namaruangan'] && $mj->init == $dt['no']) {
                    $jumlahaja += $dt['jumlahtotal'];
                    $jumlahtotal += $dt['jumlahtotal'];
                }
            }

            if ($mj->init == 99 || $mj->kelompoklaporan == 'Total' || $mj->kelompoklaporan == 'TOTAL') {
                $datasaja[] = array(
                    'namaruangan' => $mj->kelompoklaporan,
                    'no' => $mj->init,
                    'jumlahtotal' => $jumlahtotal,
                );
            } else {
                $datasaja[] = array(
                    'namaruangan' => $mj->kelompoklaporan,
                    'no' => $mj->init,
                    'jumlahtotal' => $jumlahaja,
                );
            }
        }

        $result = array(
            'data' => $datasaja,
            'message' => 'as@vexana',
        );
        return $this->respond($result);
    }
    public function getLaporanRL34Kebidanan(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $KdJenisLapKebidanan = (int) $this->settingDataFixed('KdJenisLapKebidanan', $idProfile);
        $KdRuangKebidanan = explode(',', $this->settingDataFixed('KdRuangKebidanan', $idProfile));
        $dataLogin = $request->all();
        $kdListRuanganKebidanan = [];
        foreach ($KdRuangKebidanan as $item) {
            $kdListRuanganKebidanan[] = (int) $item;
        }
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('departemen_m as dpm', 'dpm.id', '=', 'ru.objectdepartemenfk')
            ->join('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->join('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->join('mapproduktolaporanrl_m as mprl', 'mprl.produkfk', '=', 'pp.produkfk')
            ->join('jenislaporan_m as jl', 'jl.id', '=', 'mprl.objectjenislaporanfk')
            ->join('kelompoklaporan_m as kl', 'kl.id', '=', 'mprl.objectkontenlaporanfk')
            ->join('detailjenisproduk_m as djp', 'djp.id', '=', 'pr.objectdetailjenisprodukfk')
            ->join('jenisproduk_m as jp', 'jp.id', '=', 'djp.objectjenisprodukfk')
            ->join('asalrujukan_m as ar', 'ar.id', '=', 'apd.objectasalrujukanfk')
            ->leftjoin('statuskeluar_m as stk', 'stk.id', '=', 'pd.objectstatuskeluarfk')
            ->leftJoin('kelompokproduk_m as kp', 'kp.id', '=', 'jp.objectkelompokprodukfk')
            ->select(
                'pp.tglpelayanan',
                'pp.produkfk',
                'pr.namaproduk',
                'apd.objectasalrujukanfk',
                'ar.asalrujukan',
                'pd.objectstatuskeluarfk',
                'apd.objectruanganfk',
                'kl.kelompoklaporan as jenispelayanan'
                //                DB::raw('(case when pr.id =402494 then \'Persalinan Normal\'
                //                        when pr.id in (15375,15386,15387,15388,15477) then \'Sectio Caesaria\'
                //                        else \'-\'
                //                         end) as jenispelayanan ')
            )
            ->where('pd.kdprofile', $idProfile)
            ->where('jl.id', $KdJenisLapKebidanan) //laporan RL 34
            ->whereIn('apd.objectruanganfk', $kdListRuanganKebidanan);


        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pp.tglpelayanan', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];
            $data = $data->where('pp.tglpelayanan', '<=', $tgl);
        }

        $data = $data->get();

        $data10 = [];
        $jml = 0;
        $rujukanRS = 0;
        $rujukanBidan = 0;
        $rujukanPuskes = 0;
        $rujukanFaskesLain = 0;
        $jmlMedisHidup = 0;
        $jmlMedisMati = 0;
        $jmlTotalMedis = 0;
        $jmlNonMedisHidup = 0;
        $jmlNonMedisMati = 0;
        $jmlTotalNonMedis = 0;
        $nonRujukanHidup = 0;
        $nonRujukanMati = 0;
        $totalNonRujukan = 0;
        $dirujuk = 0;
        $sama = false;


        foreach ($data as $item) {
            $sama = false;
            $i = 0;
            $o = 0;
            foreach ($data10 as $hideung) {
                if ($item->jenispelayanan == $data10[$i]['jenispelayanan']) {
                    $sama = true;
                    $jml = (float)$hideung['jumlah'] + 1;
                    $data10[$i]['jumlah'] = $jml;

                    //RS=2, puskes=1, faskeslan=3, non rujikan =5, klinik=3
                    //statuskeluar --->1 pulang , 2 pindah,3 rajal, 4 rujuk, 5 meningggal

                    if ($item->objectasalrujukanfk == 2) {
                        $data10[$i]['rujukanRS'] = (float)$hideung['rujukanRS'] + 1;
                    } else if ($item->objectasalrujukanfk == 1) {
                        $data10[$i]['rujukanPuskes'] = (float)$hideung['rujukanPuskes'] + 1;
                    } else if ($item->objectasalrujukanfk == 3 || $item->objectasalrujukanfk == 4) {
                        $data10[$i]['rujukanFaskesLain'] = (float)$hideung['rujukanFaskesLain'] + 1;
                    }
                    if (($item->objectasalrujukanfk == 2 || $item->objectasalrujukanfk == 1 || $item->objectasalrujukanfk == 3) && $item->objectstatuskeluarfk == 1) {
                        $data10[$i]['jmlMedisHidup'] = (float)$hideung['jmlMedisHidup'] + 1;
                    } else if (($item->objectasalrujukanfk == 2 || $item->objectasalrujukanfk == 1 || $item->objectasalrujukanfk == 3) && $item->objectstatuskeluarfk == 5) {
                        $data10[$i]['jmlMedisMati'] = (float)$hideung['jmlMedisMati'] + 1;
                    }
                    if (($item->objectasalrujukanfk == 5 || $item->objectasalrujukanfk == 4) && $item->objectstatuskeluarfk == 1) {
                        $data10[$i]['jmlNonMedisHidup'] = (float)$hideung['jmlNonMedisHidup'] + 1;
                    } else if (($item->objectasalrujukanfk == 5 || $item->objectasalrujukanfk == 4) && $item->objectstatuskeluarfk == 5) {
                        $data10[$i]['jmlNonMedisMati'] = (float)$hideung['jmlNonMedisMati'] + 1;
                    }
                    if ($item->objectstatuskeluarfk == 4) {
                        $data10[$i]['dirujuk'] = (float)$hideung['dirujuk'] + 1;
                    }

                    $data10[$i]['jmlTotalMedis'] = $data10[$i]['rujukanRS'] + $data10[$i]['rujukanPuskes'] + $data10[$i]['rujukanFaskesLain'] + $data10[$i]['jmlMedisHidup'] + $data10[$i]['jmlMedisMati'];
                    $data10[$i]['jmlTotalNonMedis'] = $data10[$i]['jmlNonMedisHidup'] + $data10[$i]['jmlNonMedisMati'];
                }
                $i = $i + 1;
            }

            if ($sama == false) {
                if ($item->objectasalrujukanfk == 2) {
                    $rujukanRS = 1;
                    $rujukanBidan = 0;
                    $rujukanPuskes = 0;
                    $rujukanFaskesLain = 0;
                    $jmlMedisHidup = 0;
                    $jmlMedisMati = 0;
                    $jmlTotalMedis = 0;
                    $jmlNonMedisHidup = 0;
                    $jmlNonMedisMati = 0;
                    $jmlTotalNonMedis = 0;
                    $nonRujukanHidup = 0;
                    $nonRujukanMati = 0;
                    $totalNonRujukan = 0;
                    $dirujuk = 0;
                } else if ($item->objectasalrujukanfk == 1) {
                    $rujukanRS = 0;
                    $rujukanBidan = 0;
                    $rujukanPuskes = 1;
                    $rujukanFaskesLain = 0;
                    $jmlMedisHidup = 0;
                    $jmlMedisMati = 0;
                    $jmlTotalMedis = 0;
                    $jmlNonMedisHidup = 0;
                    $jmlNonMedisMati = 0;
                    $jmlTotalNonMedis = 0;
                    $nonRujukanHidup = 0;
                    $nonRujukanMati = 0;
                    $totalNonRujukan = 0;
                    $dirujuk = 0;
                } else if ($item->objectasalrujukanfk == 3 || $item->objectasalrujukanfk == 4) {
                    $rujukanRS = 0;
                    $rujukanBidan = 0;
                    $rujukanPuskes = 0;
                    $rujukanFaskesLain = 1;
                    $jmlMedisHidup = 0;
                    $jmlMedisMati = 0;
                    $jmlTotalMedis = 0;
                    $jmlNonMedisHidup = 0;
                    $jmlNonMedisMati = 0;
                    $jmlTotalNonMedis = 0;
                    $nonRujukanHidup = 0;
                    $nonRujukanMati = 0;
                    $totalNonRujukan = 0;
                    $dirujuk = 0;
                }
                if (($item->objectasalrujukanfk == 2 || $item->objectasalrujukanfk == 1 || $item->objectasalrujukanfk == 3) && $item->objectstatuskeluarfk == 1) {
                    $rujukanRS = 0;
                    $rujukanBidan = 0;
                    $rujukanPuskes = 0;
                    $rujukanFaskesLain = 0;
                    $jmlMedisHidup = 1;
                    $jmlMedisMati = 0;
                    $jmlTotalMedis = 0;
                    $jmlNonMedisHidup = 0;
                    $jmlNonMedisMati = 0;
                    $jmlTotalNonMedis = 0;
                    $nonRujukanHidup = 0;
                    $nonRujukanMati = 0;
                    $totalNonRujukan = 0;
                    $dirujuk = 0;
                } else if (($item->objectasalrujukanfk == 2 || $item->objectasalrujukanfk == 1 || $item->objectasalrujukanfk == 3) && $item->objectstatuskeluarfk == 5) {
                    $rujukanRS = 0;
                    $rujukanBidan = 0;
                    $rujukanPuskes = 0;
                    $rujukanFaskesLain = 0;
                    $jmlMedisHidup = 0;
                    $jmlMedisMati = 1;
                    $jmlTotalMedis = 0;
                    $jmlNonMedisHidup = 0;
                    $jmlNonMedisMati = 0;
                    $jmlTotalNonMedis = 0;
                    $nonRujukanHidup = 0;
                    $nonRujukanMati = 0;
                    $totalNonRujukan = 0;
                    $dirujuk = 0;
                }
                if (($item->objectasalrujukanfk == 5 || $item->objectasalrujukanfk == 4) && $item->objectstatuskeluarfk == 1) {
                    $rujukanRS = 0;
                    $rujukanBidan = 0;
                    $rujukanPuskes = 0;
                    $rujukanFaskesLain = 0;
                    $jmlMedisHidup = 0;
                    $jmlMedisMati = 0;
                    $jmlTotalMedis = 0;
                    $jmlNonMedisHidup = 1;
                    $jmlNonMedisMati = 0;
                    $jmlTotalNonMedis = 0;
                    $nonRujukanHidup = 0;
                    $nonRujukanMati = 0;
                    $totalNonRujukan = 0;
                    $dirujuk = 0;
                } else if (($item->objectasalrujukanfk == 5 || $item->objectasalrujukanfk == 4) && $item->objectstatuskeluarfk == 5) {
                    $rujukanRS = 0;
                    $rujukanBidan = 0;
                    $rujukanPuskes = 0;
                    $rujukanFaskesLain = 0;
                    $jmlMedisHidup = 0;
                    $jmlMedisMati = 0;
                    $jmlTotalMedis = 0;
                    $jmlNonMedisHidup = 0;
                    $jmlNonMedisMati = 1;
                    $jmlTotalNonMedis = 0;
                    $nonRujukanHidup = 0;
                    $nonRujukanMati = 0;
                    $totalNonRujukan = 0;
                    $dirujuk = 0;
                }
                if ($item->objectstatuskeluarfk == 4) {
                    $rujukanRS = 0;
                    $rujukanBidan = 0;
                    $rujukanPuskes = 0;
                    $rujukanFaskesLain = 0;
                    $jmlMedisHidup = 0;
                    $jmlMedisMati = 0;
                    $jmlTotalMedis = 0;
                    $jmlNonMedisHidup = 0;
                    $jmlNonMedisMati = 0;
                    $jmlTotalNonMedis = 0;
                    $nonRujukanHidup = 0;
                    $nonRujukanMati = 0;
                    $totalNonRujukan = 0;
                    $dirujuk = 1;
                }

                $data10[] = array(
                    //                    'produkfk' => $item->produkfk,
                    'jenispelayanan' => $item->jenispelayanan,
                    'jumlah' => 1,

                    'rujukanRS' => $rujukanRS,
                    'rujukanFaskesLain' => $rujukanFaskesLain,
                    'rujukanPuskes' => $rujukanPuskes,
                    'rujukanBidan' => 0,
                    'jmlMedisHidup' => $jmlMedisHidup,
                    'jmlMedisMati' => $jmlMedisMati,
                    'jmlTotalMedis' => $jmlTotalMedis,
                    'jmlNonMedisHidup' => $jmlNonMedisHidup,
                    'jmlNonMedisMati' => $jmlNonMedisMati,
                    'jmlTotalNonMedis' => $jmlTotalNonMedis,
                    'nonRujukanHidup' => $nonRujukanHidup,
                    'nonRujukanMati' => $nonRujukanMati,
                    'totalNonRujukan' => $totalNonRujukan,
                    'dirujuk' => $dirujuk,
                    'jmlTotalMedis' => $jmlTotalMedis,
                    'jmlTotalNonMedis' => $jmlTotalNonMedis,
                );
            }

            foreach ($data10 as $key => $row) {
                $count[$key] = $row['jumlah'];
            }

            array_multisort($count, SORT_DESC, $data10);
        }
        $result = array(
            'data' => $data10,
            'message' => 'er@epic',

        );

        return $this->respond($result);
    }
    public function getLaporanRL35Perinatologi(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $KdJenisLapPerinatologi = (int)$this->settingDataFixed('KdJenisLapPerinatologi', $idProfile);
        $KdRuangKebidanan = explode(',', $this->settingDataFixed('KdRuangKebidanan', $idProfile));
        $kdListRuanganKebidanan = [];
        foreach ($KdRuangKebidanan as $item) {
            $kdListRuanganKebidanan[] = (int) $item;
        }
        $dataLogin = $request->all();
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('departemen_m as dpm', 'dpm.id', '=', 'ru.objectdepartemenfk')
            ->join('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->join('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->join('mapproduktolaporanrl_m as mprl', 'mprl.produkfk', '=', 'pp.produkfk')
            ->join('jenislaporan_m as jl', 'jl.id', '=', 'mprl.objectjenislaporanfk')
            ->join('kelompoklaporan_m as kl', 'kl.id', '=', 'mprl.objectkontenlaporanfk')
            ->join('detailjenisproduk_m as djp', 'djp.id', '=', 'pr.objectdetailjenisprodukfk')
            ->join('jenisproduk_m as jp', 'jp.id', '=', 'djp.objectjenisprodukfk')
            ->join('asalrujukan_m as ar', 'ar.id', '=', 'apd.objectasalrujukanfk')
            ->leftjoin('statuskeluar_m as stk', 'stk.id', '=', 'pd.objectstatuskeluarfk')
            ->leftJoin('kelompokproduk_m as kp', 'kp.id', '=', 'jp.objectkelompokprodukfk')
            ->select(
                'pp.tglpelayanan',
                'pp.produkfk',
                'pr.namaproduk',
                'apd.objectasalrujukanfk',
                'ar.asalrujukan',
                'pd.objectstatuskeluarfk',
                'apd.objectruanganfk',
                'kl.kelompoklaporan as jenispelayanan'
                //                DB::raw('(case when pr.id =402494 then \'Persalinan Normal\'
                //                        when pr.id in (15375,15386,15387,15388,15477) then \'Sectio Caesaria\'
                //                        else \'-\'
                //                         end) as jenispelayanan ')
            )
            //            ->where('dpm.id', 24)
            ->where('pd.kdprofile', $idProfile)
            ->where('jl.id', $KdJenisLapPerinatologi) //laporan RL 35
            ->whereIn('apd.objectruanganfk', $kdListRuanganKebidanan);


        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pp.tglpelayanan', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];
            $data = $data->where('pp.tglpelayanan', '<=', $tgl);
        }

        $data = $data->get();

        $data10 = [];
        $jml = 0;
        $rujukanRS = 0;
        $rujukanBidan = 0;
        $rujukanPuskes = 0;
        $rujukanFaskesLain = 0;
        $jmlMedisHidup = 0;
        $jmlMedisMati = 0;
        $jmlTotalMedis = 0;
        $jmlNonMedisHidup = 0;
        $jmlNonMedisMati = 0;
        $jmlTotalNonMedis = 0;
        $nonRujukanHidup = 0;
        $nonRujukanMati = 0;
        $totalNonRujukan = 0;
        $dirujuk = 0;
        $sama = false;


        foreach ($data as $item) {
            $sama = false;
            $i = 0;
            $o = 0;
            foreach ($data10 as $hideung) {
                if ($item->jenispelayanan == $data10[$i]['jenispelayanan']) {
                    $sama = true;
                    $jml = (float)$hideung['jumlah'] + 1;
                    $data10[$i]['jumlah'] = $jml;

                    //RS=2, puskes=1, faskeslan=3, non rujikan =5, klinik=3
                    //statuskeluar --->1 pulang , 2 pindah,3 rajal, 4 rujuk, 5 meningggal

                    if ($item->objectasalrujukanfk == 2) {
                        $data10[$i]['rujukanRS'] = (float)$hideung['rujukanRS'] + 1;
                    } else if ($item->objectasalrujukanfk == 1) {
                        $data10[$i]['rujukanPuskes'] = (float)$hideung['rujukanPuskes'] + 1;
                    } else if ($item->objectasalrujukanfk == 3 || $item->objectasalrujukanfk == 4) {
                        $data10[$i]['rujukanFaskesLain'] = (float)$hideung['rujukanFaskesLain'] + 1;
                    }
                    if (($item->objectasalrujukanfk == 2 || $item->objectasalrujukanfk == 1 || $item->objectasalrujukanfk == 3) && $item->objectstatuskeluarfk == 1) {
                        $data10[$i]['jmlMedisHidup'] = (float)$hideung['jmlMedisHidup'] + 1;
                    } else if (($item->objectasalrujukanfk == 2 || $item->objectasalrujukanfk == 1 || $item->objectasalrujukanfk == 3) && $item->objectstatuskeluarfk == 5) {
                        $data10[$i]['jmlMedisMati'] = (float)$hideung['jmlMedisMati'] + 1;
                    }
                    if (($item->objectasalrujukanfk == 5 || $item->objectasalrujukanfk == 4) && $item->objectstatuskeluarfk == 1) {
                        $data10[$i]['jmlNonMedisHidup'] = (float)$hideung['jmlNonMedisHidup'] + 1;
                    } else if (($item->objectasalrujukanfk == 5 || $item->objectasalrujukanfk == 4) && $item->objectstatuskeluarfk == 5) {
                        $data10[$i]['jmlNonMedisMati'] = (float)$hideung['jmlNonMedisMati'] + 1;
                    }
                    if ($item->objectstatuskeluarfk == 4) {
                        $data10[$i]['dirujuk'] = (float)$hideung['dirujuk'] + 1;
                    }

                    $data10[$i]['jmlTotalMedis'] = $data10[$i]['rujukanRS'] + $data10[$i]['rujukanPuskes'] + $data10[$i]['rujukanFaskesLain'] + $data10[$i]['jmlMedisHidup'] + $data10[$i]['jmlMedisMati'];
                    $data10[$i]['jmlTotalNonMedis'] = $data10[$i]['jmlNonMedisHidup'] + $data10[$i]['jmlNonMedisMati'];
                }
                $i = $i + 1;
            }

            if ($sama == false) {
                if ($item->objectasalrujukanfk == 2) {
                    $rujukanRS = 1;
                    $rujukanBidan = 0;
                    $rujukanPuskes = 0;
                    $rujukanFaskesLain = 0;
                    $jmlMedisHidup = 0;
                    $jmlMedisMati = 0;
                    $jmlTotalMedis = 0;
                    $jmlNonMedisHidup = 0;
                    $jmlNonMedisMati = 0;
                    $jmlTotalNonMedis = 0;
                    $nonRujukanHidup = 0;
                    $nonRujukanMati = 0;
                    $totalNonRujukan = 0;
                    $dirujuk = 0;
                } else if ($item->objectasalrujukanfk == 1) {
                    $rujukanRS = 0;
                    $rujukanBidan = 0;
                    $rujukanPuskes = 1;
                    $rujukanFaskesLain = 0;
                    $jmlMedisHidup = 0;
                    $jmlMedisMati = 0;
                    $jmlTotalMedis = 0;
                    $jmlNonMedisHidup = 0;
                    $jmlNonMedisMati = 0;
                    $jmlTotalNonMedis = 0;
                    $nonRujukanHidup = 0;
                    $nonRujukanMati = 0;
                    $totalNonRujukan = 0;
                    $dirujuk = 0;
                } else if ($item->objectasalrujukanfk == 3 || $item->objectasalrujukanfk == 4) {
                    $rujukanRS = 0;
                    $rujukanBidan = 0;
                    $rujukanPuskes = 0;
                    $rujukanFaskesLain = 1;
                    $jmlMedisHidup = 0;
                    $jmlMedisMati = 0;
                    $jmlTotalMedis = 0;
                    $jmlNonMedisHidup = 0;
                    $jmlNonMedisMati = 0;
                    $jmlTotalNonMedis = 0;
                    $nonRujukanHidup = 0;
                    $nonRujukanMati = 0;
                    $totalNonRujukan = 0;
                    $dirujuk = 0;
                }
                if (($item->objectasalrujukanfk == 2 || $item->objectasalrujukanfk == 1 || $item->objectasalrujukanfk == 3) && $item->objectstatuskeluarfk == 1) {
                    $rujukanRS = 0;
                    $rujukanBidan = 0;
                    $rujukanPuskes = 0;
                    $rujukanFaskesLain = 0;
                    $jmlMedisHidup = 1;
                    $jmlMedisMati = 0;
                    $jmlTotalMedis = 0;
                    $jmlNonMedisHidup = 0;
                    $jmlNonMedisMati = 0;
                    $jmlTotalNonMedis = 0;
                    $nonRujukanHidup = 0;
                    $nonRujukanMati = 0;
                    $totalNonRujukan = 0;
                    $dirujuk = 0;
                } else if (($item->objectasalrujukanfk == 2 || $item->objectasalrujukanfk == 1 || $item->objectasalrujukanfk == 3) && $item->objectstatuskeluarfk == 5) {
                    $rujukanRS = 0;
                    $rujukanBidan = 0;
                    $rujukanPuskes = 0;
                    $rujukanFaskesLain = 0;
                    $jmlMedisHidup = 0;
                    $jmlMedisMati = 1;
                    $jmlTotalMedis = 0;
                    $jmlNonMedisHidup = 0;
                    $jmlNonMedisMati = 0;
                    $jmlTotalNonMedis = 0;
                    $nonRujukanHidup = 0;
                    $nonRujukanMati = 0;
                    $totalNonRujukan = 0;
                    $dirujuk = 0;
                }
                if (($item->objectasalrujukanfk == 5 || $item->objectasalrujukanfk == 4) && $item->objectstatuskeluarfk == 1) {
                    $rujukanRS = 0;
                    $rujukanBidan = 0;
                    $rujukanPuskes = 0;
                    $rujukanFaskesLain = 0;
                    $jmlMedisHidup = 0;
                    $jmlMedisMati = 0;
                    $jmlTotalMedis = 0;
                    $jmlNonMedisHidup = 1;
                    $jmlNonMedisMati = 0;
                    $jmlTotalNonMedis = 0;
                    $nonRujukanHidup = 0;
                    $nonRujukanMati = 0;
                    $totalNonRujukan = 0;
                    $dirujuk = 0;
                } else if (($item->objectasalrujukanfk == 5 || $item->objectasalrujukanfk == 4) && $item->objectstatuskeluarfk == 5) {
                    $rujukanRS = 0;
                    $rujukanBidan = 0;
                    $rujukanPuskes = 0;
                    $rujukanFaskesLain = 0;
                    $jmlMedisHidup = 0;
                    $jmlMedisMati = 0;
                    $jmlTotalMedis = 0;
                    $jmlNonMedisHidup = 0;
                    $jmlNonMedisMati = 1;
                    $jmlTotalNonMedis = 0;
                    $nonRujukanHidup = 0;
                    $nonRujukanMati = 0;
                    $totalNonRujukan = 0;
                    $dirujuk = 0;
                }
                if ($item->objectstatuskeluarfk == 4) {
                    $rujukanRS = 0;
                    $rujukanBidan = 0;
                    $rujukanPuskes = 0;
                    $rujukanFaskesLain = 0;
                    $jmlMedisHidup = 0;
                    $jmlMedisMati = 0;
                    $jmlTotalMedis = 0;
                    $jmlNonMedisHidup = 0;
                    $jmlNonMedisMati = 0;
                    $jmlTotalNonMedis = 0;
                    $nonRujukanHidup = 0;
                    $nonRujukanMati = 0;
                    $totalNonRujukan = 0;
                    $dirujuk = 1;
                }

                $data10[] = array(
                    //                    'produkfk' => $item->produkfk,
                    'jenispelayanan' => $item->jenispelayanan,
                    'jumlah' => 1,

                    'rujukanRS' => $rujukanRS,
                    'rujukanFaskesLain' => $rujukanFaskesLain,
                    'rujukanPuskes' => $rujukanPuskes,
                    'rujukanBidan' => 0,
                    'jmlMedisHidup' => $jmlMedisHidup,
                    'jmlMedisMati' => $jmlMedisMati,
                    'jmlTotalMedis' => $jmlTotalMedis,
                    'jmlNonMedisHidup' => $jmlNonMedisHidup,
                    'jmlNonMedisMati' => $jmlNonMedisMati,
                    'jmlTotalNonMedis' => $jmlTotalNonMedis,
                    'nonRujukanHidup' => $nonRujukanHidup,
                    'nonRujukanMati' => $nonRujukanMati,
                    'totalNonRujukan' => $totalNonRujukan,
                    'dirujuk' => $dirujuk,

                );
            }

            foreach ($data10 as $key => $row) {
                $count[$key] = $row['jumlah'];
            }

            array_multisort($count, SORT_DESC, $data10);
        }
        $result = array(
            'data' => $data10,
            'message' => 'er@epic',

        );

        return $this->respond($result);
    }
    public function getLaporanRL36Pembedahan(Request $request)
    {
        $idProfile = (int) $this->getDataKdProfile($request);
        $KdJenisLapPembedahan = (int) $this->settingDataFixed('KdJenisLapPembedahan', $idProfile);
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];

        $main = array(
            'Bedah',
            'Obstetrik & Ginekologi',
            'Bedah Saraf',
            'THT',
            'Mata',
            'Kulit & Kelamin',
            'Gigi & Mulut',
            'Bedah Anak',
            'Kardiovaskuler',
            'Bedah Orthopedi',
            'Thorak',
            'Digestive',
            'Urologi',
            'Lain-Lain',
            'TOTAL'
        );

        $data10 = [];
        $data = DB::select(DB::raw("
            SELECT pr.id idproduk, ru.namaruangan, pr.namaproduk, ru.id idruangan, sum(ppd.jumlah) as jumlah
                FROM
                pasiendaftar_t pd
                INNER JOIN antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                INNER JOIN pasien_m ps on ps.id=pd.nocmfk
                inner join ruangan_m ru on ru.id = apd.objectruanganfk
                inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
                inner join pelayananpasiendetail_t ppd on ppd.pelayananpasien = pp.norec
                inner  join produk_m pr on pr.id=pp.produkfk
                WHERE pp.tglpelayanan::date BETWEEN '$tglAwal' and '$tglAkhir'
                and apd.kdprofile = $idProfile
                and pd.kdprofile = $idProfile
                and apd.statusenabled = true
                and pd.statusenabled=true
                and pp.isobat is null
                and ru.id = 759
                and pr.id not in(5006463,5008635,5008644)
            group by ru.namaruangan, pr.namaproduk, pr.id, ru.id
        "));

        $spesialisasi = "";
        $total = 0;
        $khusus = 0;
        $besar = 0;
        $sedang = 0;
        $kecil = 0;
        foreach ($main as $m) {
            $total = 0;
            $khusus = 0;
            $besar = 0;
            $sedang = 0;
            $kecil = 0;
            foreach ($data as $dt) {
                if ($m == 'Bedah') {
                    $total += 0;
                    $khusus += 0;
                    $besar += 0;
                    $sedang += 0;
                    $kecil += 0;
                } else if ($m == 'Obstetrik & Ginekologi') {
                    $total += 0;
                    $khusus += 0;
                    $besar += 0;
                    $sedang += 0;
                    $kecil += 0;
                } else if ($m == 'Bedah Saraf') {
                    $total += 0;
                    $khusus += 0;
                    $besar += 0;
                    $sedang += 0;
                    $kecil += 0;
                } else if ($m == 'THT') {
                    $total += 0;
                    $khusus += 0;
                    $besar += 0;
                    $sedang += 0;
                    $kecil += 0;
                } else if ($m == 'Mata') {
                    $total += 0;
                    $khusus += 0;
                    $besar += 0;
                    $sedang += 0;
                    $kecil += 0;
                } else if ($m == 'Kulit & Kelamin') {
                    $total += 0;
                    $khusus += 0;
                    $besar += 0;
                    $sedang += 0;
                    $kecil += 0;
                } else if ($m == 'Gigi & Mulut') {
                    $total += $dt->jumlah;
                    $khusus += 0;
                    $besar += 0;
                    $sedang += 0;
                    $kecil += $dt->jumlah;
                } else if ($m == 'Bedah Anak') {
                    $total += 0;
                    $khusus += 0;
                    $besar += 0;
                    $sedang += 0;
                    $kecil += 0;
                } else if ($m == 'Kardiovaskuler') {
                    $total += 0;
                    $khusus += 0;
                    $besar += 0;
                    $sedang += 0;
                    $kecil += 0;
                } else if ($m == 'Bedah Orthopedi') {
                    $total += 0;
                    $khusus += 0;
                    $besar += 0;
                    $sedang += 0;
                    $kecil += 0;
                } else if ($m == 'Thorak') {
                    $total += 0;
                    $khusus += 0;
                    $besar += 0;
                    $sedang += 0;
                    $kecil += 0;
                } else if ($m == 'Digestive') {
                    $total += 0;
                    $khusus += 0;
                    $besar += 0;
                    $sedang += 0;
                    $kecil += 0;
                } else if ($m == 'Urologi') {
                    $total += 0;
                    $khusus += 0;
                    $besar += 0;
                    $sedang += 0;
                    $kecil += 0;
                } else if ($m == 'Lain-Lain') {
                    $total += 0;
                    $khusus += 0;
                    $besar += 0;
                    $sedang += 0;
                    $kecil += 0;
                } else if ($m == 'TOTAL') {
                    $total += $dt->jumlah;
                    $khusus += 0;
                    $besar += 0;
                    $sedang += 0;
                    $kecil += $dt->jumlah;
                }
            }
            $data10[] = array(
                'spesialisasi' => $m,
                'total' => $total,
                'khusus' => $khusus,
                'besar' => $besar,
                'sedang' => $sedang,
                'kecil' => $kecil,
            );
        }



        $result = array(
            'data' => $data10,
            'message' => 'er@epic',

        );

        return $this->respond($result);
    }
    public function getLaporanRL37(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];

        $main = DB::select(DB::raw("select mptlr.norec, pro.id as idproduk, pro.namaproduk, jl.id, jl.jenislaporan,
        kl.id as idkelompoklaporan, kl.kelompoklaporan, ru.id as idruangan, ru.namaruangan, kl.init
        from mapproduktolaporanrl_m as mptlr
        inner join jenislaporan_m as jl on jl.id = mptlr.objectjenislaporanfk
        inner join kelompoklaporan_m as kl on kl.id = mptlr.objectkontenlaporanfk
        left join produk_m as pro on pro.id = mptlr.produkfk
        left join ruangan_m as ru on ru.id = mptlr.ruanganfk
        where mptlr.kdprofile = 30
        and mptlr.statusenabled = true
        and kl.kdprofile = 30
        and kl.statusenabled = true
        and jl.kdprofile = 30
        and jl.statusenabled = true
        and jl.id = 11
        order by jl.id asc, kl.nourut asc"));

        $mainaja = DB::select(DB::raw("select jl.id, jl.jenislaporan, kl.id as idkelompoklaporan, kl.kelompoklaporan, kl.init
        from mapproduktolaporanrl_m as mptlr
        inner join jenislaporan_m as jl on jl.id = mptlr.objectjenislaporanfk
        inner join kelompoklaporan_m as kl on kl.id = mptlr.objectkontenlaporanfk
        where mptlr.kdprofile = 30
        and mptlr.statusenabled = true
        and kl.kdprofile = 30
        and kl.statusenabled = true
        and jl.kdprofile = 30
        and jl.statusenabled = true
        and jl.id = 11
		group by jl.id, jl.jenislaporan, kl.id, kl.kelompoklaporan, kl.init
        order by jl.id asc, kl.nourut asc"));

        $data10 = DB::select(DB::raw("SELECT ru.id idruangan, ru.namaruangan, pr.namaproduk, pr.id idproduk, sum(ppd.jumlah) as jumlah
            FROM
            pasiendaftar_t pd
            INNER JOIN antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
            INNER JOIN pasien_m ps on ps.id=pd.nocmfk
            inner join ruangan_m ru on ru.id = apd.objectruanganfk
            inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
            inner join pelayananpasiendetail_t ppd on ppd.pelayananpasien = pp.norec
            inner  join produk_m pr on pr.id=pp.produkfk
            WHERE pp.tglpelayanan BETWEEN '$tglAwal' and '$tglAkhir'
            and apd.kdprofile = 30
            and pd.kdprofile = 30
            and apd.statusenabled = true
            and pd.statusenabled=true
            and pp.isobat is null
            and ru.id = 576
            and pr.id not in (5008635, 5008644)
        group by ru.id, ru.namaruangan, pr.namaproduk, pr.id"));

        $jumlah = 0;
        foreach ($main as $row) {
            $jumlah = 0;

            foreach ($data10 as $data) {
                if ($row->idruangan == $data->idruangan || $row->idproduk == $data->idproduk) {
                    $jumlah += $data->jumlah;
                }
            }

            $datas[] = array(
                'namaruangan' => $row->kelompoklaporan,
                'no' => $row->init,
                'jumlahtotal' => $jumlah,
            );
        }

        $jumlahaja = 0;
        $jumlahtotal = 0;
        foreach ($mainaja as $mj) {
            $jumlahaja = 0;

            foreach ($datas as $dt) {
                if ($mj->kelompoklaporan == $dt['namaruangan'] && $mj->init == $dt['no']) {
                    $jumlahaja += $dt['jumlahtotal'];
                    $jumlahtotal += $dt['jumlahtotal'];
                }
            }

            if ($mj->init == 99 || $mj->kelompoklaporan == 'Total' || $mj->kelompoklaporan == 'TOTAL') {
                $datasaja[] = array(
                    'namaruangan' => $mj->kelompoklaporan,
                    'no' => $mj->init,
                    'jumlahtotal' => $jumlahtotal,
                );
            } else {
                $datasaja[] = array(
                    'namaruangan' => $mj->kelompoklaporan,
                    'no' => $mj->init,
                    'jumlahtotal' => $jumlahaja,
                );
            }
        }

        $result = array(
            'data' => $datasaja,
            'message' => 'as@vexana',
        );

        return $this->respond($result);
    }


    public function getPemeriksaanLab(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];

        $main = DB::select(DB::raw("select mptlr.norec, pro.id as idproduk, pro.namaproduk, jl.id, jl.jenislaporan,
        kl.id as idkelompoklaporan, kl.kelompoklaporan, ru.id as idruangan, ru.namaruangan, kl.init
        from mapproduktolaporanrl_m as mptlr
        inner join jenislaporan_m as jl on jl.id = mptlr.objectjenislaporanfk
        inner join kelompoklaporan_m as kl on kl.id = mptlr.objectkontenlaporanfk
        left join produk_m as pro on pro.id = mptlr.produkfk
        left join ruangan_m as ru on ru.id = mptlr.ruanganfk
        where mptlr.kdprofile = 30
        and mptlr.statusenabled = true
        and kl.kdprofile = 30
        and kl.statusenabled = true
        and jl.kdprofile = 30
        and jl.statusenabled = true
        and jl.id = 12
        order by jl.id asc, kl.nourut asc"));

        $mainaja = DB::select(DB::raw("select jl.id, jl.jenislaporan, kl.id as idkelompoklaporan, kl.kelompoklaporan, kl.init
        from mapproduktolaporanrl_m as mptlr
        inner join jenislaporan_m as jl on jl.id = mptlr.objectjenislaporanfk
        inner join kelompoklaporan_m as kl on kl.id = mptlr.objectkontenlaporanfk
        where mptlr.kdprofile = 30
        and mptlr.statusenabled = true
        and kl.kdprofile = 30
        and kl.statusenabled = true
        and jl.kdprofile = 30
        and jl.statusenabled = true
        and jl.id = 12
		group by jl.id, jl.jenislaporan, kl.id, kl.kelompoklaporan, kl.init
        order by jl.id asc, kl.nourut asc"));

        $data10 = DB::select(DB::raw("SELECT ru.namaruangan, pr.namaproduk, pr.id idproduk, ru.id idruangan, sum(ppd.jumlah) as jumlah
            FROM
            pasiendaftar_t pd
            INNER JOIN antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
            INNER JOIN pasien_m ps on ps.id=pd.nocmfk
            inner join ruangan_m ru on ru.id = apd.objectruanganfk
            inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
            inner join pelayananpasiendetail_t ppd on ppd.pelayananpasien = pp.norec
            inner  join produk_m pr on pr.id=pp.produkfk
            WHERE pp.tglpelayanan BETWEEN '$tglAwal' and '$tglAkhir'
            and apd.kdprofile = 30
            and pd.kdprofile = 30
            and apd.statusenabled = true
            and pd.statusenabled=true
            and pp.isobat is null
            and ru.id = 575
            and pr.id not in (5008635, 5008644)
        group by ru.namaruangan, pr.namaproduk, pr.id, ru.id"));

        $jumlah = 0;
        foreach ($main as $row) {
            $jumlah = 0;

            foreach ($data10 as $data) {
                if ($row->idruangan == $data->idruangan || $row->idproduk == $data->idproduk) {
                    $jumlah += $data->jumlah;
                }
            }

            $datas[] = array(
                'namaruangan' => $row->kelompoklaporan,
                'no' => $row->init,
                'jumlahtotal' => $jumlah,
            );
        }

        $jumlahaja = 0;
        $jumlahtotal = 0;
        foreach ($mainaja as $mj) {
            $jumlahaja = 0;

            foreach ($datas as $dt) {
                if ($mj->kelompoklaporan == $dt['namaruangan'] && $mj->init == $dt['no']) {
                    $jumlahaja += $dt['jumlahtotal'];
                    $jumlahtotal += $dt['jumlahtotal'];
                }
            }

            if ($mj->init == 99 || $mj->kelompoklaporan == 'Total' || $mj->kelompoklaporan == 'TOTAL') {
                $datasaja[] = array(
                    'namaruangan' => $mj->kelompoklaporan,
                    'no' => $mj->init,
                    'jumlahtotal' => $jumlahtotal,
                );
            } else {
                $datasaja[] = array(
                    'namaruangan' => $mj->kelompoklaporan,
                    'no' => $mj->init,
                    'jumlahtotal' => $jumlahaja,
                );
            }
        }

        $result = array(
            'data' => $datasaja,
            'message' => 'as@vexana',
        );

        return $this->respond($result);
    }
    public function getPelayananRehab(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];

        $main = DB::select(DB::raw("select mptlr.norec, pro.id as idproduk, pro.namaproduk, jl.id, jl.jenislaporan,
        kl.id as idkelompoklaporan, kl.kelompoklaporan, ru.id as idruangan, ru.namaruangan, kl.init
        from mapproduktolaporanrl_m as mptlr
        inner join jenislaporan_m as jl on jl.id = mptlr.objectjenislaporanfk
        inner join kelompoklaporan_m as kl on kl.id = mptlr.objectkontenlaporanfk
        left join produk_m as pro on pro.id = mptlr.produkfk
        left join ruangan_m as ru on ru.id = mptlr.ruanganfk
        where mptlr.kdprofile = 30
        and mptlr.statusenabled = true
        and kl.kdprofile = 30
        and kl.statusenabled = true
        and jl.kdprofile = 30
        and jl.statusenabled = true
        and jl.id = 13
        order by jl.id asc, kl.nourut asc"));

        $mainaja = DB::select(DB::raw("select jl.id, jl.jenislaporan, kl.id as idkelompoklaporan, kl.kelompoklaporan, kl.init
        from mapproduktolaporanrl_m as mptlr
        inner join jenislaporan_m as jl on jl.id = mptlr.objectjenislaporanfk
        inner join kelompoklaporan_m as kl on kl.id = mptlr.objectkontenlaporanfk
        where mptlr.kdprofile = 30
        and mptlr.statusenabled = true
        and kl.kdprofile = 30
        and kl.statusenabled = true
        and jl.kdprofile = 30
        and jl.statusenabled = true
        and jl.id = 13
		group by jl.id, jl.jenislaporan, kl.id, kl.kelompoklaporan, kl.init
        order by jl.id asc, kl.nourut asc"));

        $data10 = DB::select(DB::raw("SELECT ru.namaruangan, pr.namaproduk, pr.id idproduk, ru.id idruangan, sum(ppd.jumlah) as jumlah
                FROM
                pasiendaftar_t pd
                INNER JOIN antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                INNER JOIN pasien_m ps on ps.id=pd.nocmfk
                inner join ruangan_m ru on ru.id = apd.objectruanganfk
                inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
                inner join pelayananpasiendetail_t ppd on ppd.pelayananpasien = pp.norec
                inner  join produk_m pr on pr.id=pp.produkfk
                WHERE pp.tglpelayanan BETWEEN '$tglAwal' and '$tglAkhir'
                and apd.kdprofile = 30
                and pd.kdprofile = 30
                and apd.statusenabled = true
                and pd.statusenabled=true
                and pp.isobat is null
                and ru.id = 786
                and pr.id not in (5008635, 5008644)
                group by ru.namaruangan, pr.namaproduk, pr.id, ru.id

        union all

                SELECT ru.namaruangan, pr.namaproduk, pr.id idproduk, ru.id idruangan, sum(ppd.jumlah) as jumlah
                FROM
                pasiendaftar_t pd
                INNER JOIN antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                INNER JOIN pasien_m ps on ps.id=pd.nocmfk
                inner join ruangan_m ru on ru.id = apd.objectruanganfk
                inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
                inner join pelayananpasiendetail_t ppd on ppd.pelayananpasien = pp.norec
                inner  join produk_m pr on pr.id=pp.produkfk
                WHERE pp.tglpelayanan BETWEEN '$tglAwal' and '$tglAkhir'
                and apd.kdprofile = 30
                and pd.kdprofile = 30
                and apd.statusenabled = true
                and pd.statusenabled=true
                and pp.isobat is null
                and ru.id = 762
                and pr.id not in (5008635, 5008644)
        group by ru.namaruangan, pr.namaproduk, pr.id, ru.id

        union ALL


            SELECT ru.namaruangan, pr.namaproduk, pr.id idproduk, ru.id idruangan, sum(ppd.jumlah) as jumlah
                FROM
                pasiendaftar_t pd
                INNER JOIN antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                INNER JOIN pasien_m ps on ps.id=pd.nocmfk
                inner join ruangan_m ru on ru.id = apd.objectruanganfk
                inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
                inner join pelayananpasiendetail_t ppd on ppd.pelayananpasien = pp.norec
                inner  join produk_m pr on pr.id=pp.produkfk
                WHERE pp.tglpelayanan BETWEEN '$tglAwal' and '$tglAkhir'
                and apd.kdprofile = 30
                and pd.kdprofile = 30
                and apd.statusenabled = true
                and pd.statusenabled=true
                and pp.isobat is null
                and ru.id = 774
                and pr.id not in (5008635, 5008644)
        group by ru.namaruangan, pr.namaproduk, pr.id, ru.id

        union ALL

        SELECT ru.namaruangan, pr.namaproduk, pr.id idproduk, ru.id idruangan, sum(ppd.jumlah) as jumlah
                FROM
                pasiendaftar_t pd
                INNER JOIN antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                INNER JOIN pasien_m ps on ps.id=pd.nocmfk
                inner join ruangan_m ru on ru.id = apd.objectruanganfk
                inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
                inner join pelayananpasiendetail_t ppd on ppd.pelayananpasien = pp.norec
                inner  join produk_m pr on pr.id=pp.produkfk
                WHERE pp.tglpelayanan BETWEEN '$tglAwal' and '$tglAkhir'
                and apd.kdprofile = 30
                and pd.kdprofile = 30
                and apd.statusenabled = true
                and pd.statusenabled=true
                and pp.isobat is null
                and ru.id = 777
                and pr.id not in (5008635, 5008644)
        group by ru.namaruangan, pr.namaproduk, pr.id, ru.id"));

        $jumlah = 0;
        foreach ($main as $row) {
            $jumlah = 0;

            foreach ($data10 as $data) {
                if ($row->idruangan == $data->idruangan || $row->idproduk == $data->idproduk) {
                    $jumlah += $data->jumlah;
                }
            }

            $datas[] = array(
                'namaruangan' => $row->kelompoklaporan,
                'no' => $row->init,
                'jumlahtotal' => $jumlah,
            );
        }

        $jumlahaja = 0;
        $jumlahtotal = 0;
        foreach ($mainaja as $mj) {
            $jumlahaja = 0;

            foreach ($datas as $dt) {
                if ($mj->kelompoklaporan == $dt['namaruangan'] && $mj->init == $dt['no'] && $mj->init == $dt['no']) {
                    $jumlahaja += $dt['jumlahtotal'];
                    $jumlahtotal += $dt['jumlahtotal'];
                }
            }

            if ($mj->init == 99 || $mj->kelompoklaporan == 'Total' || $mj->kelompoklaporan == 'TOTAL') {
                $datasaja[] = array(
                    'namaruangan' => $mj->kelompoklaporan,
                    'no' => $mj->init,
                    'jumlahtotal' => $jumlahtotal,
                );
            } else {
                $datasaja[] = array(
                    'namaruangan' => $mj->kelompoklaporan,
                    'no' => $mj->init,
                    'jumlahtotal' => $jumlahaja,
                );
            }
        }

        $result = array(
            'data' => $datasaja,
            'message' => 'as@vexana',
        );
        return $this->respond($result);
    }
    public function getLaporanRL310Khusus(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];

        $main = DB::select(DB::raw("select mptlr.norec, pro.id as idproduk, pro.namaproduk, jl.id, jl.jenislaporan,
        kl.id as idkelompoklaporan, kl.kelompoklaporan, ru.id as idruangan, ru.namaruangan, kl.init
        from mapproduktolaporanrl_m as mptlr
        inner join jenislaporan_m as jl on jl.id = mptlr.objectjenislaporanfk
        inner join kelompoklaporan_m as kl on kl.id = mptlr.objectkontenlaporanfk
        left join produk_m as pro on pro.id = mptlr.produkfk
        left join ruangan_m as ru on ru.id = mptlr.ruanganfk
        where mptlr.kdprofile = 30
        and mptlr.statusenabled = true
        and kl.kdprofile = 30
        and kl.statusenabled = true
        and jl.kdprofile = 30
        and jl.statusenabled = true
        and jl.id = 14
        order by jl.id asc, kl.nourut asc"));

        $mainaja = DB::select(DB::raw("select jl.id, jl.jenislaporan, kl.id as idkelompoklaporan, kl.kelompoklaporan, kl.init
        from mapproduktolaporanrl_m as mptlr
        inner join jenislaporan_m as jl on jl.id = mptlr.objectjenislaporanfk
        inner join kelompoklaporan_m as kl on kl.id = mptlr.objectkontenlaporanfk
        where mptlr.kdprofile = 30
        and mptlr.statusenabled = true
        and kl.kdprofile = 30
        and kl.statusenabled = true
        and jl.kdprofile = 30
        and jl.statusenabled = true
        and jl.id = 14
		group by jl.id, jl.jenislaporan, kl.id, kl.kelompoklaporan, kl.init
        order by jl.id asc, kl.nourut asc"));

        $data10 = DB::select(DB::raw("SELECT ru.id idruangan, ru.namaruangan, pr.namaproduk, pr.id idproduk, sum(ppd.jumlah) as jumlah
        FROM
        pasiendaftar_t pd
        INNER JOIN antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
        INNER JOIN pasien_m ps on ps.id=pd.nocmfk
        inner join ruangan_m ru on ru.id = apd.objectruanganfk
        inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
        inner join pelayananpasiendetail_t ppd on ppd.pelayananpasien = pp.norec
        inner  join produk_m pr on pr.id=pp.produkfk
        WHERE pp.tglpelayanan BETWEEN '$tglAwal' and '$tglAkhir'
        and apd.kdprofile = 30
        and pd.kdprofile = 30
        and apd.statusenabled = true
        and pd.statusenabled=true
        and pp.isobat is null
        and pr.id in(5006939, 5006940, 5005929, 5005926, 5006071, 5006350, 5006374)
        group by ru.id, ru.namaruangan, pr.id, pr.namaproduk;"));


        $jumlah = 0;
        foreach ($main as $row) {
            $jumlah = 0;

            foreach ($data10 as $data) {
                if ($row->idruangan == $data->idruangan || $row->idproduk == $data->idproduk) {
                    $jumlah += $data->jumlah;
                }
            }

            $datas[] = array(
                'namaruangan' => $row->kelompoklaporan,
                'no' => $row->init,
                'jumlahtotal' => $jumlah,
            );
        }

        $jumlah = 0;
        foreach ($main as $row) {
            $jumlah = 0;

            foreach ($data10 as $data) {
                if ($row->idruangan == $data->idruangan || $row->idproduk == $data->idproduk) {
                    $jumlah += $data->jumlah;
                }
            }

            $datas[] = array(
                'namaruangan' => $row->kelompoklaporan,
                'no' => $row->init,
                'jumlahtotal' => $jumlah,
            );
        }

        $jumlahaja = 0;
        $jumlahtotal = 0;
        foreach ($mainaja as $mj) {
            $jumlahaja = 0;

            foreach ($datas as $dt) {
                if ($mj->kelompoklaporan == $dt['namaruangan'] && $mj->init == $dt['no']) {
                    $jumlahaja += $dt['jumlahtotal'];
                    $jumlahtotal += $dt['jumlahtotal'];
                }
            }

            if ($mj->init == 99 || $mj->kelompoklaporan == 'Total' || $mj->kelompoklaporan == 'TOTAL') {
                $datasaja[] = array(
                    'namaruangan' => $mj->kelompoklaporan,
                    'no' => $mj->init,
                    'jumlahtotal' => $jumlahtotal,
                );
            } else {
                $datasaja[] = array(
                    'namaruangan' => $mj->kelompoklaporan,
                    'no' => $mj->init,
                    'jumlahtotal' => $jumlahaja,
                );
            }
        }

        $result = array(
            'data' => $datasaja,
            'message' => 'as@vexana',
        );
        return $this->respond($result);
    }
    public function getLaporanRL311KesehatanJiwa(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];

        $main = DB::select(DB::raw("select mptlr.norec, pro.id as idproduk, pro.namaproduk, jl.id, jl.jenislaporan,
        kl.id as idkelompoklaporan, kl.kelompoklaporan, ru.id as idruangan, ru.namaruangan, kl.init
        from mapproduktolaporanrl_m as mptlr
        inner join jenislaporan_m as jl on jl.id = mptlr.objectjenislaporanfk
        inner join kelompoklaporan_m as kl on kl.id = mptlr.objectkontenlaporanfk
        left join produk_m as pro on pro.id = mptlr.produkfk
        left join ruangan_m as ru on ru.id = mptlr.ruanganfk
        where mptlr.kdprofile = 30
        and mptlr.statusenabled = true
        and kl.kdprofile = 30
        and kl.statusenabled = true
        and jl.kdprofile = 30
        and jl.statusenabled = true
        and jl.id = 15
        order by jl.id asc, kl.nourut asc"));

        $mainaja = DB::select(DB::raw("select jl.id, jl.jenislaporan, kl.id as idkelompoklaporan, kl.kelompoklaporan, kl.init
        from mapproduktolaporanrl_m as mptlr
        inner join jenislaporan_m as jl on jl.id = mptlr.objectjenislaporanfk
        inner join kelompoklaporan_m as kl on kl.id = mptlr.objectkontenlaporanfk
        where mptlr.kdprofile = 30
        and mptlr.statusenabled = true
        and kl.kdprofile = 30
        and kl.statusenabled = true
        and jl.kdprofile = 30
        and jl.statusenabled = true
        and jl.id = 15
		group by jl.id, jl.jenislaporan, kl.id, kl.kelompoklaporan, kl.init
        order by jl.id asc, kl.nourut asc"));

        $data10 = DB::select(DB::raw("SELECT ru.namaruangan, pr.namaproduk, pr.id idproduk, ru.id idruangan, sum(ppd.jumlah) as jumlah
        FROM
        pasiendaftar_t pd
        INNER JOIN antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
        INNER JOIN pasien_m ps on ps.id=pd.nocmfk
        inner join ruangan_m ru on ru.id = apd.objectruanganfk
        inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
        inner join pelayananpasiendetail_t ppd on ppd.pelayananpasien = pp.norec
        inner  join produk_m pr on pr.id=pp.produkfk
        WHERE pp.tglpelayanan BETWEEN '$tglAwal' and '$tglAkhir'
        and apd.kdprofile = 30
        and pd.kdprofile = 30
        and apd.statusenabled = true
        and pd.statusenabled=true
        and pp.isobat is null
        and ru.id in(752, 782, 785, 779, 780, 572, 791, 767, 807)
        group by ru.namaruangan, pr.id, pr.namaproduk, ru.id;"));


        $jumlah = 0;
        foreach ($main as $row) {
            $jumlah = 0;

            foreach ($data10 as $data) {
                if ($row->idruangan == $data->idruangan || $row->idproduk == $data->idproduk) {
                    $jumlah += $data->jumlah;
                }
            }

            $datas[] = array(
                'namaruangan' => $row->kelompoklaporan,
                'no' => $row->init,
                'jumlahtotal' => $jumlah,
            );
        }

        $jumlahaja = 0;
        $jumlahtotal = 0;
        foreach ($mainaja as $mj) {
            $jumlahaja = 0;

            foreach ($datas as $dt) {
                if ($mj->kelompoklaporan == $dt['namaruangan'] && $mj->init == $dt['no']) {
                    $jumlahaja += $dt['jumlahtotal'];
                    $jumlahtotal += $dt['jumlahtotal'];
                }
            }

            if ($mj->init == 99 || $mj->kelompoklaporan == 'Total' || $mj->kelompoklaporan == 'TOTAL') {
                $datasaja[] = array(
                    'namaruangan' => $mj->kelompoklaporan,
                    'no' => $mj->init,
                    'jumlahtotal' => $jumlahtotal,
                );
            } else {
                $datasaja[] = array(
                    'namaruangan' => $mj->kelompoklaporan,
                    'no' => $mj->init,
                    'jumlahtotal' => $jumlahaja,
                );
            }
        }

        $result = array(
            'data' => $datasaja,
            'message' => 'as@vexana',
        );
        return $this->respond($result);
    }
    public function getLaporanRL312KeluargaBerencana(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $KdJenisLapKB = (int) $this->settingDataFixed('KdJenisLapKB', $kdProfile);
        //#WIth Mapp
        $data = \DB::table('pasiendaftar_t as pd')
            ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '= ', 'apd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('departemen_m as dpm', 'dpm.id', '=', 'ru.objectdepartemenfk')
            ->join('produk_m as prd', 'prd.id', '=', 'pp.produkfk')
            ->join('mapproduktolaporanrl_m as mprl', 'mprl.produkfk', '=', 'pp.produkfk')
            ->join('jenislaporan_m as jl', 'jl.id', '=', 'mprl.objectjenislaporanfk')
            ->join('kelompoklaporan_m as kl', 'kl.id', '=', 'mprl.objectkontenlaporanfk')
            ->select(
                //                'prd.namaproduk',
                'kl.kelompoklaporan as namaproduk',
                DB::raw('
                 COUNT(prd.namaproduk) as jmltindakan')
            )
            ->groupBy('kl.kelompoklaporan')
            ->where('pd.kdprofile', $KdJenisLapKB)
            ->where('jl.id', $KdJenisLapKB);


        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pp.tglpelayanan', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];
            $data = $data->where('pp.tglpelayanan', '<=', $tgl);
        }

        $data = $data->get();

        $result = array(
            'data' => $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }
    public function getPengadaanObat(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];

        $datas = DB::select(DB::raw("select sum(item1) item1, sum(item2) item2, sum(item3) item3, sum(tersedia1) tersedia1, sum(tersedia2) tersedia2, sum(tersedia3) tersedia3,
        sum(tersediafor1) tersediafor1, sum(tersediafor2) tersediafor2, sum(tersediafor3) tersediafor3 
        from(
            select
            case when isgeneric = true and isfornas is not null and isforrs is not null then count(namaproduk) else 0 end as item1,
            case when isgeneric = false and (isfornas = true or isforrs = true or (isfornas = true and isforrs = true)) then count(namaproduk) else 0 end as item2,
            case when isgeneric = false and (isfornas = false or isforrs = false or (isfornas = false and isforrs = false)) then count(namaproduk) else 0 end as item3,
        
            case when isgeneric = true and isfornas is not null and isforrs is not null then count(namaproduk) else 0 end as tersedia1,
            case when isgeneric = false and (isfornas = true or isforrs = true or (isfornas = true and isforrs = true)) then count(namaproduk) else 0 end as tersedia2,
            case when isgeneric = false and (isfornas = false or isforrs = false or (isfornas = false and isforrs = false)) then count(namaproduk) else 0 end as tersedia3,
            
            case when isgeneric = true and (isfornas = true or isforrs = true or (isfornas = true and isforrs = true)) then count(namaproduk) else 0 end as tersediafor1,
            case when isgeneric = false and (isfornas = true or isforrs = true or (isfornas = true and isforrs = true)) then count(namaproduk) else 0 end as tersediafor2,
            0 as tersediafor3
        
            from(
                    select pr.namaproduk, sum(spd.qtyproduk) as jumlahproduk, pr.isfornas, pr.isforrs, pr.isgeneric
                            FROM stokprodukdetail_t as spd
                            INNER JOIN produk_m as pr on pr.id = spd.objectprodukfk
                    where pr.statusenabled = true
                    and spd.statusenabled = true
                    and pr.kdprofile = 30
                    and spd.kdprofile = 30
                    group by pr.isfornas, pr.isforrs, pr.isgeneric, pr.namaproduk
            ) as x group by isgeneric, isforrs, isfornas
        ) as y;"));

        $data10[0] = array(
            'jumlahitem' => $datas[0]->item1,
            'jumlahtersedia' => $datas[0]->tersedia1,
            'jumlahtersediafor' => $datas[0]->tersediafor1,
        );

        $data10[1] = array(
            'jumlahitem' => $datas[0]->item2,
            'jumlahtersedia' => $datas[0]->tersedia2,
            'jumlahtersediafor' => $datas[0]->tersediafor2,
        );

        $data10[2] = array(
            'jumlahitem' => $datas[0]->item3,
            'jumlahtersedia' => $datas[0]->tersedia3,
            'jumlahtersediafor' => $datas[0]->tersediafor3,
        );

        $data10[3] = array(
            'jumlahitem' => 0,
            'jumlahtersedia' => 0,
            'jumlahtersediafor' => 0,
        );

        $result = array(
            'data' => $data10,
            'message' => 'as@lancelot',
        );
        return $this->respond($result);
    }

    public function getRL314Rujukan(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];

        $main = array(
            'Penyakit Dalam',
            'Bedah',
            'Kesehatan Anak',
            'Obsterik & Ginekologi',
            'Keluarga Berencana',
            'Saraf',
            'Jiwa',
            'THT',
            'Mata',
            'Kulit & Kelamin',
            'Gigi & Mulut',
            'Radiologi',
            'Paru-Paru',
            'Spesialis Lain',
            'TOTAL'
        );

        $data10 = DB::select(DB::raw("select namaruangan, id, sum(diterimadaripuskesmas) diterimadaripuskesmas, sum(diterimadarifaskeslain) diterimadarifaskeslain,
        sum(diterimadarirslain) diterimadarirslain, sum(dirujukbalikkepuskesmas) dirujukbalikkepuskesmas, sum(dirujukbalikkefaskeslain)
        dirujukbalikkefaskeslain, sum(dirujukbalikkersasal) dirujukbalikkersasal, sum(pasienrujukan) pasienrujukan, sum(datangsendiri)
        datangsendiri, sum(diterimakembali) diterimakembali 
        from(
            select ru.namaruangan, ru.id,
            case when aj.id = 1 then count(pd.noregistrasi) else 0 end as diterimadaripuskesmas,
            case when aj.id not in (1,2,5,6,7,10) then count(pd.noregistrasi) else 0 end as diterimadarifaskeslain,
            case when aj.id = 2 then count(pd.noregistrasi) else 0 end as diterimadarirslain,
            case when aj.id = 1 and sp.id = 10 then count(pd.noregistrasi) else 0 end as dirujukbalikkepuskesmas,
            case when aj.id not in (1,2,5,6,7,10) and sp.id in (11, 4) then count(pd.noregistrasi) else 0 end as dirujukbalikkefaskeslain,
            case when aj.id = 2 and sp.id = 5 then count(pd.noregistrasi) else 0 end as dirujukbalikkersasal,
        
            case when aj.id in(1,2,3,4,8,9,11,12,13,14,15,16,17) and sp.id in (4,5,10,11) then count(pd.noregistrasi) else 0 end as pasienrujukan,
            case when aj.id in(1,2,3,4,8,9,11,12,13,14,15,16,17) and sp.id = 5 then count(pd.noregistrasi) else 0 end as datangsendiri,
            case when aj.id in(1,2,3,4,8,9,11,12,13,14,15,16,17) and sp.id = 6 then count(pd.noregistrasi) else 0 end as diterimakembali
            FROM
                pasiendaftar_t pd
            INNER JOIN antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
            inner join asalrujukan_m aj on aj.id = apd.objectasalrujukanfk
            inner join statuspulang_m sp on sp.id = pd.objectstatuspulangfk
            inner join ruangan_m ru on ru.id = apd.objectruanganfk
            where apd.tglmasuk between '$tglAwal' and '$tglAkhir'
            group by ru.namaruangan, aj.id, sp.id, ru.id
        ) as x group by namaruangan, id"));

        $diterimadaripuskesmas = 0;
        $diterimadarifaskeslain = 0;
        $diterimadarirslain = 0;
        $dirujukbalikkepuskesmas = 0;
        $dirujukbalikkefaskeslain = 0;
        $dirujukbalikkersasal = 0;
        $pasienrujukan = 0;
        $datangsendiri = 0;
        $diterimakembali = 0;

        foreach ($main as $row) {
            $diterimadaripuskesmas = 0;
            $diterimadarifaskeslain = 0;
            $diterimadarirslain = 0;
            $dirujukbalikkepuskesmas = 0;
            $dirujukbalikkefaskeslain = 0;
            $dirujukbalikkersasal = 0;
            $pasienrujukan = 0;
            $datangsendiri = 0;
            $diterimakembali = 0;
            foreach ($data10 as $data) {
                if ($row == "Penyakit Dalam" && $data->id == 765) {
                    $diterimadaripuskesmas += $data->diterimadaripuskesmas;
                    $diterimadarifaskeslain += $data->diterimadarifaskeslain;
                    $diterimadarirslain += $data->diterimadarirslain;
                    $dirujukbalikkepuskesmas += $data->dirujukbalikkepuskesmas;
                    $dirujukbalikkefaskeslain += $data->dirujukbalikkefaskeslain;
                    $dirujukbalikkersasal += $data->dirujukbalikkersasal;
                    $pasienrujukan += $data->pasienrujukan;
                    $datangsendiri += $data->datangsendiri;
                    $diterimakembali += $data->diterimakembali;
                } else if ($row == "Bedah" && $data->id == 44) {
                    $diterimadaripuskesmas += $data->diterimadaripuskesmas;
                    $diterimadarifaskeslain += $data->diterimadarifaskeslain;
                    $diterimadarirslain += $data->diterimadarirslain;
                    $dirujukbalikkepuskesmas += $data->dirujukbalikkepuskesmas;
                    $dirujukbalikkefaskeslain += $data->dirujukbalikkefaskeslain;
                    $dirujukbalikkersasal += $data->dirujukbalikkersasal;
                    $pasienrujukan += $data->pasienrujukan;
                    $datangsendiri += $data->datangsendiri;
                    $diterimakembali += $data->diterimakembali;
                } else if ($row == "Kesehatan Anak" && ($data->id == 753 || $data->id == 775)) {
                    $diterimadaripuskesmas += $data->diterimadaripuskesmas;
                    $diterimadarifaskeslain += $data->diterimadarifaskeslain;
                    $diterimadarirslain += $data->diterimadarirslain;
                    $dirujukbalikkepuskesmas += $data->dirujukbalikkepuskesmas;
                    $dirujukbalikkefaskeslain += $data->dirujukbalikkefaskeslain;
                    $dirujukbalikkersasal += $data->dirujukbalikkersasal;
                    $pasienrujukan += $data->pasienrujukan;
                    $datangsendiri += $data->datangsendiri;
                    $diterimakembali += $data->diterimakembali;
                } else if ($row == "Saraf" && $data->id == 755) {
                    $diterimadaripuskesmas += $data->diterimadaripuskesmas;
                    $diterimadarifaskeslain += $data->diterimadarifaskeslain;
                    $diterimadarirslain += $data->diterimadarirslain;
                    $dirujukbalikkepuskesmas += $data->dirujukbalikkepuskesmas;
                    $dirujukbalikkefaskeslain += $data->dirujukbalikkefaskeslain;
                    $dirujukbalikkersasal += $data->dirujukbalikkersasal;
                    $pasienrujukan += $data->pasienrujukan;
                    $datangsendiri += $data->datangsendiri;
                    $diterimakembali += $data->diterimakembali;
                } else if ($row == "Jiwa" && ($data->id == 785 || $data->id == 752 || $data->id == 782)) {
                    $diterimadaripuskesmas += $data->diterimadaripuskesmas;
                    $diterimadarifaskeslain += $data->diterimadarifaskeslain;
                    $diterimadarirslain += $data->diterimadarirslain;
                    $dirujukbalikkepuskesmas += $data->dirujukbalikkepuskesmas;
                    $dirujukbalikkefaskeslain += $data->dirujukbalikkefaskeslain;
                    $dirujukbalikkersasal += $data->dirujukbalikkersasal;
                    $pasienrujukan += $data->pasienrujukan;
                    $datangsendiri += $data->datangsendiri;
                    $diterimakembali += $data->diterimakembali;
                } else if ($row == "Jiwa" && ($data->id == 785 || $data->id == 752 || $data->id == 782)) {
                    $diterimadaripuskesmas += $data->diterimadaripuskesmas;
                    $diterimadarifaskeslain += $data->diterimadarifaskeslain;
                    $diterimadarirslain += $data->diterimadarirslain;
                    $dirujukbalikkepuskesmas += $data->dirujukbalikkepuskesmas;
                    $dirujukbalikkefaskeslain += $data->dirujukbalikkefaskeslain;
                    $dirujukbalikkersasal += $data->dirujukbalikkersasal;
                    $pasienrujukan += $data->pasienrujukan;
                    $datangsendiri += $data->datangsendiri;
                    $diterimakembali += $data->diterimakembali;
                } else if ($row == "Kulit & Kelamin" && $data->id == 754) {
                    $diterimadaripuskesmas += $data->diterimadaripuskesmas;
                    $diterimadarifaskeslain += $data->diterimadarifaskeslain;
                    $diterimadarirslain += $data->diterimadarirslain;
                    $dirujukbalikkepuskesmas += $data->dirujukbalikkepuskesmas;
                    $dirujukbalikkefaskeslain += $data->dirujukbalikkefaskeslain;
                    $dirujukbalikkersasal += $data->dirujukbalikkersasal;
                    $pasienrujukan += $data->pasienrujukan;
                    $datangsendiri += $data->datangsendiri;
                    $diterimakembali += $data->diterimakembali;
                } else if ($row == "Gigi & Mulut" && $data->id == 759) {
                    $diterimadaripuskesmas += $data->diterimadaripuskesmas;
                    $diterimadarifaskeslain += $data->diterimadarifaskeslain;
                    $diterimadarirslain += $data->diterimadarirslain;
                    $dirujukbalikkepuskesmas += $data->dirujukbalikkepuskesmas;
                    $dirujukbalikkefaskeslain += $data->dirujukbalikkefaskeslain;
                    $dirujukbalikkersasal += $data->dirujukbalikkersasal;
                    $pasienrujukan += $data->pasienrujukan;
                    $datangsendiri += $data->datangsendiri;
                    $diterimakembali += $data->diterimakembali;
                } else if ($row == "Radiologi" && $data->id == 576) {
                    $diterimadaripuskesmas += $data->diterimadaripuskesmas;
                    $diterimadarifaskeslain += $data->diterimadarifaskeslain;
                    $diterimadarirslain += $data->diterimadarirslain;
                    $dirujukbalikkepuskesmas += $data->dirujukbalikkepuskesmas;
                    $dirujukbalikkefaskeslain += $data->dirujukbalikkefaskeslain;
                    $dirujukbalikkersasal += $data->dirujukbalikkersasal;
                    $pasienrujukan += $data->pasienrujukan;
                    $datangsendiri += $data->datangsendiri;
                    $diterimakembali += $data->diterimakembali;
                } else if (
                    $row == "Spesialis Lain" && $data->id != 765 && $data->id != 44 && $data->id != 753 && $data->id != 775 && $data->id != 755 && $data->id != 785 && $data->id != 752
                    && $data->id != 782 && $data->id != 754 && $data->id != 759 && $data->id != 576
                ) {
                    $diterimadaripuskesmas += $data->diterimadaripuskesmas;
                    $diterimadarifaskeslain += $data->diterimadarifaskeslain;
                    $diterimadarirslain += $data->diterimadarirslain;
                    $dirujukbalikkepuskesmas += $data->dirujukbalikkepuskesmas;
                    $dirujukbalikkefaskeslain += $data->dirujukbalikkefaskeslain;
                    $dirujukbalikkersasal += $data->dirujukbalikkersasal;
                    $pasienrujukan += $data->pasienrujukan;
                    $datangsendiri += $data->datangsendiri;
                    $diterimakembali += $data->diterimakembali;
                }
            }

            $datas[] = array(
                'namaruangan' =>  $row,
                'diterimadaripuskesmas' => $diterimadaripuskesmas,
                'diterimadarifaskeslain' => $diterimadarifaskeslain,
                'diterimadarirslain' => $diterimadarirslain,
                'dirujukbalikkepuskesmas' => $dirujukbalikkepuskesmas,
                'dirujukbalikkefaskeslain' => $dirujukbalikkefaskeslain,
                'dirujukbalikkersasal' => $dirujukbalikkersasal,
                'pasienrujukan' => $pasienrujukan,
                'datangsendiri' => $datangsendiri,
                'diterimakembali' => $diterimakembali,
            );
        }

        $result = array(
            'data' => $datas,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getRL315CaraBayar(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];

        $main = array(
            'Membayar Sendiri',
            'Asuransi:',
            'Asuransi Pemerintah',
            'Asuransi Swasta',
            'Keringanan (Cost Sharing)',
            'Gratis',
            'Kartu Sehat',
            'Keterangan Tidak Mampu',
            'Lain-Lain',
            'TOTAL'
        );

        $data10 = DB::select(DB::raw("select kelompokpasien, sum(pasienranapjpk) pasienranapjpk, sum(pasienranapjld) pasienranapjld, sum(pasienrajal) pasienrajal, sum(pasienrajallab) pasienrajallab,
        sum(pasienrajalrad) pasienrajalrad, sum(pasienrajallain) pasienrajallain 
        from(
            select kp.kelompokpasien, 
            case when ru.objectdepartemenfk = 16 and pd.tglpulang <> pd.tglregistrasi and pd.tglpulang is not null then count(pd.noregistrasi) end as pasienranapjpk,
            case when ru.objectdepartemenfk = 16 and pd.tglpulang is not null then sum(x.lamadirawat) end as pasienranapjld,
            case when ru.objectdepartemenfk <> 16 and pd.tglpulang = pd.tglregistrasi then count(pd.noregistrasi) end as pasienrajal,
            case when ru.objectdepartemenfk <> 16 and ru.id = 575 and pd.tglpulang = pd.tglregistrasi then count(pd.noregistrasi) end as pasienrajallab,
            case when ru.objectdepartemenfk <> 16 and ru.id = 576 and pd.tglpulang = pd.tglregistrasi then count(pd.noregistrasi) end as pasienrajalrad,
            case when ru.objectdepartemenfk <> 16 and ru.id not in (576, 575) and pd.tglpulang = pd.tglregistrasi then count(pd.noregistrasi) end as pasienrajallain
            from
                pasiendaftar_t pd
            inner join kelompokpasien_m kp on kp.id = pd.objectkelompokpasienlastfk
            inner join ruangan_m ru on ru.id = pd.objectruanganlastfk
            left join(
                with cte as (
                    select pdt.norec, min(apdt.tglmasuk::date) tglmasuk from pasiendaftar_t as pdt
                    inner join antrianpasiendiperiksa_t as apdt on apdt.noregistrasifk = pdt.norec
                    inner join ruangan_m as rum on rum.id = apdt.objectruanganfk
                    where rum.objectdepartemenfk = 16
                    and pdt.statusenabled = TRUE
                    and pdt.kdprofile = 30
                    and pdt.tglpulang::date between '$tglAwal' and '$tglAkhir'
                    group by pdt.norec, apdt.objectruanganfk
                )
                                            
                select pd.noregistrasi,
                case when pd.tglpulang::date-cte.tglmasuk::date = 0 then 1 else  (pd.tglpulang::date-cte.tglmasuk) + 1 end as lamadirawat
                FROM pasiendaftar_t as pd
                INNER JOIN cte on cte.norec = pd.norec
                WHERE pd.kdprofile = 30 and pd.tglpulang is not null and cast(pd.tglpulang as date) between '2022-05-01 00:00' and '2022-06-07 23:59'
                group by pd.tglpulang::date, cte.tglmasuk, pd.noregistrasi
                order by pd.tglpulang::date
            ) as x on x.noregistrasi = pd.noregistrasi
            where pd.tglregistrasi between '$tglAwal' and '$tglAkhir'
            group by kp.kelompokpasien, pd.tglpulang, pd.tglregistrasi, ru.objectdepartemenfk, ru.id
        ) as c group by kelompokpasien"));

        $pasienranapjpk = 0;
        $pasienranapjld = 0;
        $pasienrajal = 0;
        $pasienrajallab = 0;
        $pasienrajalrad = 0;
        $pasienrajallain = 0;
        foreach ($main as $row) {
            $pasienranapjpk = 0;
            $pasienranapjld = 0;
            $pasienrajal = 0;
            $pasienrajallab = 0;
            $pasienrajalrad = 0;
            $pasienrajallain = 0;
            foreach ($data10 as $data) {
                if ($row == 'Membayar Sendiri' && ($data->kelompokpasien == 'Umum/Pribadi' || $data->kelompokpasien == 'Karyawan')) {
                    $pasienranapjpk += $data->pasienranapjpk;
                    $pasienranapjld += $data->pasienranapjld;
                    $pasienrajal += $data->pasienrajal;
                    $pasienrajallab += $data->pasienrajallab;
                    $pasienrajalrad += $data->pasienrajalrad;
                    $pasienrajallain += $data->pasienrajallain;
                } else if ($row == 'Asuransi Pemerintah' && ($data->kelompokpasien == 'BPJS' || $data->kelompokpasien == 'Jamsostek'
                    || $data->kelompokpasien == 'Kemenkes' || $data->kelompokpasien == 'BPJS KELAS I' || $data->kelompokpasien == 'BPJS KELAS II'
                    || $data->kelompokpasien == 'BPJS KELAS III PBI' || $data->kelompokpasien == 'BPJS KELAS III NON PBI (Mandiri)' || $data->kelompokpasien == 'Proses BPJS'
                    || $data->kelompokpasien == 'Proses Jamkesda' || $data->kelompokpasien == 'Proses JKS' || $data->kelompokpasien == 'Jamkesos'
                    || $data->kelompokpasien == 'IPWL' || $data->kelompokpasien == 'Jamkesmas' || $data->kelompokpasien == 'Jamkesda')) {
                    $pasienranapjpk += $data->pasienranapjpk;
                    $pasienranapjld += $data->pasienranapjld;
                    $pasienrajal += $data->pasienrajal;
                    $pasienrajallab += $data->pasienrajallab;
                    $pasienrajalrad += $data->pasienrajalrad;
                    $pasienrajallain += $data->pasienrajallain;
                }
            }

            $datas[] = array(
                'carabayar' =>  $row,
                'pasienranapjpk' => $pasienranapjpk,
                'pasienranapjld' => $pasienranapjld,
                'pasienrajal' => $pasienrajal,
                'pasienrajallab' => $pasienrajallab,
                'pasienrajalrad' => $pasienrajalrad,
                'pasienrajallain' => $pasienrajallain,
            );
        }

        $result = array(
            'data' => $datas,
            'message' => 'er@epic',
        );
        return $this->respond($result);
    }
    public function getPelayananResep(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];

        $datas = DB::select(DB::raw("select sum(rajal1) rajal1, sum(rajal2) rajal2, sum(rajal3) rajal3, sum(igd1) igd1, sum(igd2) igd2, sum(igd3) igd3, sum(ranap1) ranap1, sum(ranap2) ranap2, sum(ranap3) ranap3 
        from(
            select 
            case when id <> 16 and isgeneric = true and isfornas is not null and isforrs is not null then count(namaproduk) else 0 end as rajal1,
            case when id <> 16 and isgeneric = false and (isfornas = true or isforrs = true or (isfornas = true and isforrs = true)) then count(namaproduk) else 0 end as rajal2,
            case when id <> 16 and isgeneric = false and (isfornas = false or isforrs = false or (isfornas = false and isforrs = false)) then count(namaproduk) else 0 end as rajal3,
            case when namaruangan ilike '%ugd%'  and isgeneric = true and isfornas is not null and isforrs is not null then count(namaproduk) else 0 end as igd1,
            case when namaruangan ilike '%ugd%' and isgeneric = false and (isfornas = true or isforrs = true or (isfornas = true and isforrs = true)) then count(namaproduk) else 0 end as igd2,
            case when namaruangan ilike '%ugd%' and isgeneric = false and (isfornas = false or isforrs = false or (isfornas = false and isforrs = false)) then count(namaproduk) else 0 end as igd3,
            case when id = 16 and isgeneric = true and isfornas is not null and isforrs is not null then count(namaproduk) else 0 end as ranap1,
            case when id = 16 and isgeneric = false and (isfornas = true or isforrs = true or (isfornas = true and isforrs = true)) then count(namaproduk) else 0 end as ranap2,
            case when id = 16 and isgeneric = false and (isfornas = false or isforrs = false or (isfornas = false and isforrs = false)) then count(namaproduk) else 0 end as ranap3
        
            from(
                    select pr.namaproduk, sr.noresep, sum(pp.jumlah) as jumlahproduk, ru.namaruangan, dp.id, pr.isfornas, pr.isforrs, pr.isgeneric
                            FROM strukresep_t as sr
                            INNER JOIN pelayananpasien_t AS pp ON pp.strukresepfk = sr.norec
                            INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.norec=sr.pasienfk
                            INNER JOIN pasiendaftar_t AS pd ON pd.norec=apd.noregistrasifk
                            INNER JOIN pasien_m AS ps ON ps.id=pd.nocmfk
                    inner  join produk_m pr on pr.id=pp.produkfk
                    LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                    LEFT JOIN departemen_m AS dp ON dp.id = ru.objectdepartemenfk
                    where sr.tglresep between '$tglAwal' and '$tglAkhir'
                    and pd.kdprofile = 30
                    and pd.statusenabled = true
                    and pp.isobat = true
                    group by pr.isfornas, pr.isforrs, pr.isgeneric, ru.namaruangan, dp.id, pr.namaproduk, sr.noresep
            ) as x group by id, namaruangan, isgeneric, isforrs, isfornas
        ) as y;"));

        $data10[0] = array(
            'jumlahrajal' => $datas[0]->rajal1,
            'jumlahigd' => $datas[0]->igd1,
            'jumlahranap' => $datas[0]->ranap1,
        );

        $data10[1] = array(
            'jumlahrajal' => $datas[0]->rajal2,
            'jumlahigd' => $datas[0]->igd2,
            'jumlahranap' => $datas[0]->ranap2,
        );

        $data10[2] = array(
            'jumlahrajal' => $datas[0]->rajal3,
            'jumlahigd' => $datas[0]->igd3,
            'jumlahranap' => $datas[0]->ranap3,
        );

        $data10[3] = array(
            'jumlahrajal' => 0,
            'jumlahigd' => 0,
            'jumlahranap' => 0,
        );

        $result = array(
            'data' => $data10,
            'message' => 'as@lancelot',
        );
        return $this->respond($result);
    }
    public function getLaporanRL4aRawatInap(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tglAwal = $request['tglAwal'];
        $data10 = [];

        $data = DB::select(DB::raw("select ddtd.id, pd.tglregistrasi,app.statuspenyakit,ddtd.nodtd,ddtd.nodaftarterperinci, lower(ddtd.golongansebabpenyakit) as golongansebabpenyakit, ddp.objectjenisdiagnosafk, jd.jenisdiagnosa, pd.tglpulang,
        ps.tgllahir as tglLahir,
        EXTRACT(YEAR from AGE(pd.tglregistrasi, ps.tgllahir)) as umuryear,
        DATE_PART('day', pd.tglregistrasi::timestamp - ps.tgllahir::timestamp) as umurday,
        ps.objectjeniskelaminfk,pd.objectstatuskeluarfk,sk.statuskeluar, sp.statuspulang
        from pasiendaftar_t as pd
        inner join antrianpasiendiperiksa_t as app on app.noregistrasifk = pd.norec 
		inner join pasien_m as ps on ps.id = pd.nocmfk
		inner join jeniskelamin_m as jk on ps.objectjeniskelaminfk = jk.id
		inner join ruangan_m ru on ru.id = app.objectruanganfk
		inner join departemen_m dpm on dpm.id = ru.objectdepartemenfk
		inner join diagnosapasien_t as dp on dp.noregistrasifk = app.norec
        inner join detaildiagnosapasien_t as ddp on ddp.objectdiagnosapasienfk = dp.norec
		inner join jenisdiagnosa_m jd on jd.id = ddp.objectjenisdiagnosafk
        inner join diagnosa_m as dm on ddp.objectdiagnosafk = dm.id
        inner join mappingrlmorbiditas_m as mpr on mpr.kddiagnosa = dm.kddiagnosa
        inner join diagnosadtd_m as ddtd on ddtd.nodtd = mpr.nodtd
		left join statuskeluar_m sk on sk.id = pd.objectstatuskeluarfk
        left join statuspulang_m sp on sp.id = pd.objectstatuspulangfk
        where pd.statusenabled = true 
        and pd.kdprofile = $kdProfile 
        and ru.objectdepartemenfk = 16
        --and (jd.id = 1 or jd.id = 7)
        and ddtd.id between 1 and 507
        and pd.tglpulang between '$tglAwal-01-01' and '$tglAwal-12-31'
        order by ddtd.id"));

        $id = DB::select(DB::raw("select ddtd.id, ddtd.nodtd, ddtd.nodaftarterperinci, ddtd.golongansebabpenyakit, pr.id idprofile, pr.namakota, pr.namapemerintahan, pr.namalengkap from diagnosadtd_m ddtd
        inner join profile_m pr on pr.id = ddtd.kdprofile
        where ddtd.id between 1 and 507 and pr.id = $kdProfile order by ddtd.id"));


        $jumlahumur0hs6hl = 0;
        $jumlahumur0hs6hp = 0;
        $jumlahumur7hs28hl = 0;
        $jumlahumur7hs28hp = 0;
        $jumlahumur29hs1tl = 0;
        $jumlahumur29hs1tp = 0;
        $jumlahumur2ts4tl = 0;
        $jumlahumur2ts4tp = 0;
        $jumlahumur5ts14tl = 0;
        $jumlahumur5ts14tp = 0;
        $jumlahumur15ts24tl = 0;
        $jumlahumur15ts24tp = 0;
        $jumlahumur25ts44tl = 0;
        $jumlahumur25ts44tp = 0;
        $jumlahumur45ts64tl = 0;
        $jumlahumur45ts64tp = 0;
        $jumlahumurlebih64l = 0;
        $jumlahumurlebih64p = 0;
        $jumlahpasienkeluarhml = 0;
        $jumlahpasienkeluarhmp = 0;
        $totalpasienkeluarhm = 0;
        $jumlahpasienkeluarmati = 0;

        $currentid = 99999;

        foreach ($id as $row) {
            $namakota = $row->namakota;
            $namalengkap = $row->namalengkap;
            $namapemerintahan = $row->namapemerintahan;
            $kode = $row->idprofile;
            $nodaftarterperinci = $row->nodaftarterperinci;
            $golongansebabpenyakit = $row->golongansebabpenyakit;
            $nodtd = $row->nodtd;

            $jumlahumur0hs6hl = 0;
            $jumlahumur0hs6hp = 0;
            $jumlahumur7hs28hl = 0;
            $jumlahumur7hs28hp = 0;
            $jumlahumur29hs1tl = 0;
            $jumlahumur29hs1tp = 0;
            $jumlahumur2ts4tl = 0;
            $jumlahumur2ts4tp = 0;
            $jumlahumur5ts14tl = 0;
            $jumlahumur5ts14tp = 0;
            $jumlahumur15ts24tl = 0;
            $jumlahumur15ts24tp = 0;
            $jumlahumur25ts44tl = 0;
            $jumlahumur25ts44tp = 0;
            $jumlahumur45ts64tl = 0;
            $jumlahumur45ts64tp = 0;
            $jumlahumurlebih64l = 0;
            $jumlahumurlebih64p = 0;
            $jumlahpasienkeluarhml = 0;
            $jumlahpasienkeluarhmp = 0;
            $jumlahpasienkeluarmati = 0;
            $totalpasienkeluarhm = 0;

            if ($row->id != $currentid) {
                foreach ($data as $item) {
                    if ($row->id == $item->id) {
                        if ($item->umurday <= 6) {
                            if ($item->objectjeniskelaminfk == 1) {
                                $jumlahumur0hs6hl++;
                            } else if ($item->objectjeniskelaminfk == 2) {
                                $jumlahumur0hs6hp++;
                            }
                        } else if ($item->umurday >= 7 && $item->umurday <= 28) {
                            if ($item->objectjeniskelaminfk == 1) {
                                $jumlahumur7hs28hl++;
                            } else if ($item->objectjeniskelaminfk == 2) {
                                $jumlahumur7hs28hp++;
                            }
                        } else if ($item->umurday >= 29 && $item->umuryear <= 1) {
                            if ($item->objectjeniskelaminfk == 1) {
                                $jumlahumur29hs1tl++;
                            } else if ($item->objectjeniskelaminfk == 2) {
                                $jumlahumur29hs1tp++;
                            }
                        } else if ($item->umuryear >= 2 && $item->umuryear <= 4) {
                            if ($item->objectjeniskelaminfk == 1) {
                                $jumlahumur2ts4tl++;
                            } else if ($item->objectjeniskelaminfk == 2) {
                                $jumlahumur2ts4tp++;
                            }
                        } else if ($item->umuryear >= 5 && $item->umuryear <= 14) {
                            if ($item->objectjeniskelaminfk == 1) {
                                $jumlahumur15ts24tl++;
                            } else if ($item->objectjeniskelaminfk == 2) {
                                $jumlahumur15ts24tp++;
                            }
                        } else if ($item->umuryear >= 15 && $item->umuryear <= 24) {
                            if ($item->objectjeniskelaminfk == 1) {
                                $jumlahumur15ts24tl++;
                            } else if ($item->objectjeniskelaminfk == 2) {
                                $jumlahumur15ts24tp++;
                            }
                        } else if ($item->umuryear >= 25 && $item->umuryear <= 44) {
                            if ($item->objectjeniskelaminfk == 1) {
                                $jumlahumur25ts44tl++;
                            } else if ($item->objectjeniskelaminfk == 2) {
                                $jumlahumur25ts44tp++;
                            }
                        } else if ($item->umuryear >= 45 && $item->umuryear <= 64) {
                            if ($item->objectjeniskelaminfk == 1) {
                                $jumlahumur45ts64tl++;
                            } else if ($item->objectjeniskelaminfk == 2) {
                                $jumlahumur45ts64tp++;
                            }
                        } else if ($item->umuryear > 64) {
                            if ($item->objectjeniskelaminfk == 1) {
                                $jumlahumurlebih64l++;
                            } else if ($item->objectjeniskelaminfk == 2) {
                                $jumlahumurlebih64p++;
                            }
                        }

                        if ($item->tglpulang != null && $item->objectjeniskelaminfk == 1) {
                            $jumlahpasienkeluarhml++;
                        } else if ($item->tglpulang != null && $item->objectjeniskelaminfk == 2) {
                            $jumlahpasienkeluarhmp++;
                        }

                        if ($item->tglpulang != null && $item->objectstatuskeluarfk == 5) {
                            $jumlahpasienkeluarmati++;
                        }

                        $totalpasienkeluarhm = $jumlahpasienkeluarhmp + $jumlahpasienkeluarhml;
                    }
                }

                $currentid = $row->id;

                $data10[] = array(
                    'jumlahumur0hs6hl' => $jumlahumur0hs6hl,
                    'jumlahumur0hs6hp' =>  $jumlahumur0hs6hp,
                    'jumlahumur7hs28hl' =>  $jumlahumur7hs28hl,
                    'jumlahumur7hs28hp' =>  $jumlahumur7hs28hp,
                    'jumlahumur29hs1tl' =>  $jumlahumur29hs1tl,
                    'jumlahumur29hs1tp' =>  $jumlahumur29hs1tp,
                    'jumlahumur2ts4tl' =>  $jumlahumur2ts4tl,
                    'jumlahumur2ts4tp' =>  $jumlahumur2ts4tp,
                    'jumlahumur5ts14tl' =>  $jumlahumur5ts14tl,
                    'jumlahumur5ts14tp' =>  $jumlahumur5ts14tp,
                    'jumlahumur15ts24tl' =>  $jumlahumur15ts24tl,
                    'jumlahumur15ts24tp' =>  $jumlahumur15ts24tp,
                    'jumlahumur25ts44tl' =>  $jumlahumur25ts44tl,
                    'jumlahumur25ts44tp' =>  $jumlahumur25ts44tp,
                    'jumlahumur45ts64tl' =>  $jumlahumur45ts64tl,
                    'jumlahumur45ts64tp' =>  $jumlahumur45ts64tp,
                    'jumlahumurlebih64l' =>  $jumlahumurlebih64l,
                    'jumlahumurlebih64p' =>  $jumlahumurlebih64p,
                    'jumlahpasienkeluarhml' =>  $jumlahpasienkeluarhml,
                    'jumlahpasienkeluarhmp' =>  $jumlahpasienkeluarhmp,
                    'totalpasienkeluarhm' =>  $totalpasienkeluarhm,
                    'jumlahpasienkeluarmati' =>  $jumlahpasienkeluarmati,
                    'namakota' =>  $namakota,
                    'namalengkap' =>  $namalengkap,
                    'namapemerintahan' =>  $namapemerintahan,
                    'kode' =>  $kode,
                    'nodtd' =>  $nodtd,
                    'nodaftarterperinci' =>  $nodaftarterperinci,
                    'golongansebabpenyakit' =>  $golongansebabpenyakit,

                );
            }
        }

        $result = array(
            'detail' => $data10,
        );

        return $this->setStatusCode(201)->respond($result, 'tes msg');
    }

    public function getLaporanRL4aRawatInapSebabLuar(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tglAwal = $request['tglAwal'];
        $data10 = [];

        $data = DB::select(DB::raw("select ddtd.id, pd.tglregistrasi,app.statuspenyakit,ddtd.nodtd,ddtd.nodaftarterperinci, lower(ddtd.golongansebabpenyakit) as golongansebabpenyakit, ddp.objectjenisdiagnosafk, jd.jenisdiagnosa, pd.tglpulang,
        ps.tgllahir as tglLahir,
        EXTRACT(YEAR from AGE(pd.tglregistrasi, ps.tgllahir)) as umuryear,
        DATE_PART('day', pd.tglregistrasi::timestamp - ps.tgllahir::timestamp) as umurday,
        ps.objectjeniskelaminfk,pd.objectstatuskeluarfk,sk.statuskeluar, sp.statuspulang
        from pasiendaftar_t as pd
        inner join antrianpasiendiperiksa_t as app on app.noregistrasifk = pd.norec 
		inner join pasien_m as ps on ps.id = pd.nocmfk
		inner join jeniskelamin_m as jk on ps.objectjeniskelaminfk = jk.id
		inner join ruangan_m ru on ru.id = app.objectruanganfk
		inner join departemen_m dpm on dpm.id = ru.objectdepartemenfk
		inner join diagnosapasien_t as dp on dp.noregistrasifk = app.norec
        inner join detaildiagnosapasien_t as ddp on ddp.objectdiagnosapasienfk = dp.norec
		inner join jenisdiagnosa_m jd on jd.id = ddp.objectjenisdiagnosafk
        inner join diagnosa_m as dm on ddp.objectdiagnosafk = dm.id
        inner join mappingrlmorbiditas_m as mpr on mpr.kddiagnosa = dm.kddiagnosa
        inner join diagnosadtd_m as ddtd on ddtd.nodtd = mpr.nodtd
		left join statuskeluar_m sk on sk.id = pd.objectstatuskeluarfk
        left join statuspulang_m sp on sp.id = pd.objectstatuspulangfk
        where pd.statusenabled = true 
        and pd.kdprofile = $kdProfile 
        and ru.objectdepartemenfk = 16
        --and (jd.id = 1 or jd.id = 7)
        and ddtd.id between 508 and 537
        and pd.tglregistrasi between '$tglAwal-01-01' and '$tglAwal-12-31'
        order by ddtd.id"));

        $id = DB::select(DB::raw("select ddtd.id, ddtd.nodtd, ddtd.nodaftarterperinci, ddtd.golongansebabpenyakit, pr.id idprofile, pr.namakota, pr.namapemerintahan, pr.namalengkap from diagnosadtd_m ddtd
        inner join profile_m pr on pr.id = ddtd.kdprofile
        where ddtd.id between 508 and 537 and pr.id = $kdProfile order by ddtd.id"));


        $jumlahumur0hs6hl = 0;
        $jumlahumur0hs6hp = 0;
        $jumlahumur7hs28hl = 0;
        $jumlahumur7hs28hp = 0;
        $jumlahumur29hs1tl = 0;
        $jumlahumur29hs1tp = 0;
        $jumlahumur2ts4tl = 0;
        $jumlahumur2ts4tp = 0;
        $jumlahumur5ts14tl = 0;
        $jumlahumur5ts14tp = 0;
        $jumlahumur15ts24tl = 0;
        $jumlahumur15ts24tp = 0;
        $jumlahumur25ts44tl = 0;
        $jumlahumur25ts44tp = 0;
        $jumlahumur45ts64tl = 0;
        $jumlahumur45ts64tp = 0;
        $jumlahumurlebih64l = 0;
        $jumlahumurlebih64p = 0;
        $jumlahpasienkeluarhml = 0;
        $jumlahpasienkeluarhmp = 0;
        $totalpasienkeluarhm = 0;
        $jumlahpasienkeluarmati = 0;

        $currentid = 99999;

        foreach ($id as $row) {
            $namakota = $row->namakota;
            $namalengkap = $row->namalengkap;
            $namapemerintahan = $row->namapemerintahan;
            $kode = $row->idprofile;
            $nodaftarterperinci = $row->nodaftarterperinci;
            $golongansebabpenyakit = $row->golongansebabpenyakit;
            $nodtd = $row->nodtd;

            $jumlahumur0hs6hl = 0;
            $jumlahumur0hs6hp = 0;
            $jumlahumur7hs28hl = 0;
            $jumlahumur7hs28hp = 0;
            $jumlahumur29hs1tl = 0;
            $jumlahumur29hs1tp = 0;
            $jumlahumur2ts4tl = 0;
            $jumlahumur2ts4tp = 0;
            $jumlahumur5ts14tl = 0;
            $jumlahumur5ts14tp = 0;
            $jumlahumur15ts24tl = 0;
            $jumlahumur15ts24tp = 0;
            $jumlahumur25ts44tl = 0;
            $jumlahumur25ts44tp = 0;
            $jumlahumur45ts64tl = 0;
            $jumlahumur45ts64tp = 0;
            $jumlahumurlebih64l = 0;
            $jumlahumurlebih64p = 0;
            $jumlahpasienkeluarhml = 0;
            $jumlahpasienkeluarhmp = 0;
            $jumlahpasienkeluarmati = 0;
            $totalpasienkeluarhm = 0;

            if ($row->id != $currentid) {
                foreach ($data as $item) {
                    if ($row->id == $item->id) {
                        if ($item->umurday <= 6) {
                            if ($item->objectjeniskelaminfk == 1) {
                                $jumlahumur0hs6hl++;
                            } else if ($item->objectjeniskelaminfk == 2) {
                                $jumlahumur0hs6hp++;
                            }
                        } else if ($item->umurday >= 7 && $item->umurday <= 28) {
                            if ($item->objectjeniskelaminfk == 1) {
                                $jumlahumur7hs28hl++;
                            } else if ($item->objectjeniskelaminfk == 2) {
                                $jumlahumur7hs28hp++;
                            }
                        } else if ($item->umurday >= 29 && $item->umuryear <= 1) {
                            if ($item->objectjeniskelaminfk == 1) {
                                $jumlahumur29hs1tl++;
                            } else if ($item->objectjeniskelaminfk == 2) {
                                $jumlahumur29hs1tp++;
                            }
                        } else if ($item->umuryear >= 2 && $item->umuryear <= 4) {
                            if ($item->objectjeniskelaminfk == 1) {
                                $jumlahumur2ts4tl++;
                            } else if ($item->objectjeniskelaminfk == 2) {
                                $jumlahumur2ts4tp++;
                            }
                        } else if ($item->umuryear >= 5 && $item->umuryear <= 14) {
                            if ($item->objectjeniskelaminfk == 1) {
                                $jumlahumur15ts24tl++;
                            } else if ($item->objectjeniskelaminfk == 2) {
                                $jumlahumur15ts24tp++;
                            }
                        } else if ($item->umuryear >= 15 && $item->umuryear <= 24) {
                            if ($item->objectjeniskelaminfk == 1) {
                                $jumlahumur15ts24tl++;
                            } else if ($item->objectjeniskelaminfk == 2) {
                                $jumlahumur15ts24tp++;
                            }
                        } else if ($item->umuryear >= 25 && $item->umuryear <= 44) {
                            if ($item->objectjeniskelaminfk == 1) {
                                $jumlahumur25ts44tl++;
                            } else if ($item->objectjeniskelaminfk == 2) {
                                $jumlahumur25ts44tp++;
                            }
                        } else if ($item->umuryear >= 45 && $item->umuryear <= 64) {
                            if ($item->objectjeniskelaminfk == 1) {
                                $jumlahumur45ts64tl++;
                            } else if ($item->objectjeniskelaminfk == 2) {
                                $jumlahumur45ts64tp++;
                            }
                        } else if ($item->umuryear > 64) {
                            if ($item->objectjeniskelaminfk == 1) {
                                $jumlahumurlebih64l++;
                            } else if ($item->objectjeniskelaminfk == 2) {
                                $jumlahumurlebih64p++;
                            }
                        }

                        if ($item->tglpulang != null && $item->objectjeniskelaminfk == 1) {
                            $jumlahpasienkeluarhml++;
                        } else if ($item->tglpulang != null && $item->objectjeniskelaminfk == 2) {
                            $jumlahpasienkeluarhmp++;
                        }

                        if ($item->tglpulang != null && $item->objectstatuskeluarfk == 5) {
                            $jumlahpasienkeluarmati++;
                        }

                        $totalpasienkeluarhm = $jumlahpasienkeluarhmp + $jumlahpasienkeluarhml;
                    }
                }

                $currentid = $row->id;

                $data10[] = array(
                    'jumlahumur0hs6hl' => $jumlahumur0hs6hl,
                    'jumlahumur0hs6hp' =>  $jumlahumur0hs6hp,
                    'jumlahumur7hs28hl' =>  $jumlahumur7hs28hl,
                    'jumlahumur7hs28hp' =>  $jumlahumur7hs28hp,
                    'jumlahumur29hs1tl' =>  $jumlahumur29hs1tl,
                    'jumlahumur29hs1tp' =>  $jumlahumur29hs1tp,
                    'jumlahumur2ts4tl' =>  $jumlahumur2ts4tl,
                    'jumlahumur2ts4tp' =>  $jumlahumur2ts4tp,
                    'jumlahumur5ts14tl' =>  $jumlahumur5ts14tl,
                    'jumlahumur5ts14tp' =>  $jumlahumur5ts14tp,
                    'jumlahumur15ts24tl' =>  $jumlahumur15ts24tl,
                    'jumlahumur15ts24tp' =>  $jumlahumur15ts24tp,
                    'jumlahumur25ts44tl' =>  $jumlahumur25ts44tl,
                    'jumlahumur25ts44tp' =>  $jumlahumur25ts44tp,
                    'jumlahumur45ts64tl' =>  $jumlahumur45ts64tl,
                    'jumlahumur45ts64tp' =>  $jumlahumur45ts64tp,
                    'jumlahumurlebih64l' =>  $jumlahumurlebih64l,
                    'jumlahumurlebih64p' =>  $jumlahumurlebih64p,
                    'jumlahpasienkeluarhml' =>  $jumlahpasienkeluarhml,
                    'jumlahpasienkeluarhmp' =>  $jumlahpasienkeluarhmp,
                    'totalpasienkeluarhm' =>  $totalpasienkeluarhm,
                    'jumlahpasienkeluarmati' =>  $jumlahpasienkeluarmati,
                    'namakota' =>  $namakota,
                    'namalengkap' =>  $namalengkap,
                    'namapemerintahan' =>  $namapemerintahan,
                    'kode' =>  $kode,
                    'nodtd' =>  $nodtd,
                    'nodaftarterperinci' =>  $nodaftarterperinci,
                    'golongansebabpenyakit' =>  $golongansebabpenyakit,

                );
            }
        }

        $result = array(
            'detail' => $data10,
        );

        return $this->setStatusCode(201)->respond($result, 'tes msg');
    }


    public function getLaporanRL4b(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tglAwal = $request['tglAwal'];
        $data10 = [];

        $data = DB::select(DB::raw("select ddtd.id, pd.tglregistrasi,app.statuspenyakit,ddtd.nodtd,ddtd.nodaftarterperinci, lower(ddtd.golongansebabpenyakit) as golongansebabpenyakit, ddp.objectjenisdiagnosafk, jd.jenisdiagnosa, pd.tglpulang,
        ps.tgllahir as tglLahir,
        EXTRACT(YEAR from AGE(pd.tglregistrasi, ps.tgllahir)) as umuryear,
        DATE_PART('day', pd.tglregistrasi::timestamp - ps.tgllahir::timestamp) as umurday,
        ps.objectjeniskelaminfk,pd.objectstatuskeluarfk,sk.statuskeluar, sp.statuspulang
        from pasiendaftar_t as pd
        inner join antrianpasiendiperiksa_t as app on app.noregistrasifk = pd.norec 
		inner join pasien_m as ps on ps.id = pd.nocmfk
		inner join jeniskelamin_m as jk on ps.objectjeniskelaminfk = jk.id
		inner join ruangan_m ru on ru.id = app.objectruanganfk
		inner join departemen_m dpm on dpm.id = ru.objectdepartemenfk
		inner join diagnosapasien_t as dp on dp.noregistrasifk = app.norec
        inner join detaildiagnosapasien_t as ddp on ddp.objectdiagnosapasienfk = dp.norec
		inner join jenisdiagnosa_m jd on jd.id = ddp.objectjenisdiagnosafk
        inner join diagnosa_m as dm on ddp.objectdiagnosafk = dm.id
        inner join mappingrlmorbiditas_m as mpr on mpr.kddiagnosa = dm.kddiagnosa
        inner join diagnosadtd_m as ddtd on ddtd.nodtd = mpr.nodtd
		left join statuskeluar_m sk on sk.id = pd.objectstatuskeluarfk
        left join statuspulang_m sp on sp.id = pd.objectstatuspulangfk
        where pd.statusenabled = true 
        and pd.kdprofile = $kdProfile 
        and ru.objectdepartemenfk <> 16
        --and (jd.id = 1 or jd.id = 7)
        and ddtd.id between 1 and 507
        and pd.tglregistrasi between '$tglAwal-01-01' and '$tglAwal-12-31'
        order by ddtd.id"));

        $id = DB::select(DB::raw("select ddtd.id, ddtd.nodtd, ddtd.nodaftarterperinci, ddtd.golongansebabpenyakit, pr.id idprofile, pr.namakota, pr.namapemerintahan, pr.namalengkap from diagnosadtd_m ddtd
        inner join profile_m pr on pr.id = ddtd.kdprofile
        where ddtd.id between 1 and 507 and pr.id = $kdProfile order by ddtd.id"));


        $jumlahumur0hs6hl = 0;
        $jumlahumur0hs6hp = 0;
        $jumlahumur7hs28hl = 0;
        $jumlahumur7hs28hp = 0;
        $jumlahumur29hs1tl = 0;
        $jumlahumur29hs1tp = 0;
        $jumlahumur2ts4tl = 0;
        $jumlahumur2ts4tp = 0;
        $jumlahumur5ts14tl = 0;
        $jumlahumur5ts14tp = 0;
        $jumlahumur15ts24tl = 0;
        $jumlahumur15ts24tp = 0;
        $jumlahumur25ts44tl = 0;
        $jumlahumur25ts44tp = 0;
        $jumlahumur45ts64tl = 0;
        $jumlahumur45ts64tp = 0;
        $jumlahumurlebih64l = 0;
        $jumlahumurlebih64p = 0;
        $jumlahpasienkeluarhml = 0;
        $jumlahpasienkeluarhmp = 0;
        $totalpasienkeluarhm = 0;
        $jumlahpasienkeluarmati = 0;

        $currentid = 99999;

        foreach ($id as $row) {
            $namakota = $row->namakota;
            $namalengkap = $row->namalengkap;
            $namapemerintahan = $row->namapemerintahan;
            $kode = $row->idprofile;
            $nodaftarterperinci = $row->nodaftarterperinci;
            $golongansebabpenyakit = $row->golongansebabpenyakit;
            $nodtd = $row->nodtd;

            $jumlahumur0hs6hl = 0;
            $jumlahumur0hs6hp = 0;
            $jumlahumur7hs28hl = 0;
            $jumlahumur7hs28hp = 0;
            $jumlahumur29hs1tl = 0;
            $jumlahumur29hs1tp = 0;
            $jumlahumur2ts4tl = 0;
            $jumlahumur2ts4tp = 0;
            $jumlahumur5ts14tl = 0;
            $jumlahumur5ts14tp = 0;
            $jumlahumur15ts24tl = 0;
            $jumlahumur15ts24tp = 0;
            $jumlahumur25ts44tl = 0;
            $jumlahumur25ts44tp = 0;
            $jumlahumur45ts64tl = 0;
            $jumlahumur45ts64tp = 0;
            $jumlahumurlebih64l = 0;
            $jumlahumurlebih64p = 0;
            $jumlahpasienkeluarhml = 0;
            $jumlahpasienkeluarhmp = 0;
            $jumlahpasienkeluarmati = 0;
            $totalpasienkeluarhm = 0;

            if ($row->id != $currentid) {
                foreach ($data as $item) {
                    if ($row->id == $item->id) {
                        if ($item->umurday <= 6) {
                            if ($item->objectjeniskelaminfk == 1) {
                                $jumlahumur0hs6hl++;
                            } else if ($item->objectjeniskelaminfk == 2) {
                                $jumlahumur0hs6hp++;
                            }
                        } else if ($item->umurday >= 7 && $item->umurday <= 28) {
                            if ($item->objectjeniskelaminfk == 1) {
                                $jumlahumur7hs28hl++;
                            } else if ($item->objectjeniskelaminfk == 2) {
                                $jumlahumur7hs28hp++;
                            }
                        } else if ($item->umurday >= 29 && $item->umuryear <= 1) {
                            if ($item->objectjeniskelaminfk == 1) {
                                $jumlahumur29hs1tl++;
                            } else if ($item->objectjeniskelaminfk == 2) {
                                $jumlahumur29hs1tp++;
                            }
                        } else if ($item->umuryear >= 2 && $item->umuryear <= 4) {
                            if ($item->objectjeniskelaminfk == 1) {
                                $jumlahumur2ts4tl++;
                            } else if ($item->objectjeniskelaminfk == 2) {
                                $jumlahumur2ts4tp++;
                            }
                        } else if ($item->umuryear >= 5 && $item->umuryear <= 14) {
                            if ($item->objectjeniskelaminfk == 1) {
                                $jumlahumur15ts24tl++;
                            } else if ($item->objectjeniskelaminfk == 2) {
                                $jumlahumur15ts24tp++;
                            }
                        } else if ($item->umuryear >= 15 && $item->umuryear <= 24) {
                            if ($item->objectjeniskelaminfk == 1) {
                                $jumlahumur15ts24tl++;
                            } else if ($item->objectjeniskelaminfk == 2) {
                                $jumlahumur15ts24tp++;
                            }
                        } else if ($item->umuryear >= 25 && $item->umuryear <= 44) {
                            if ($item->objectjeniskelaminfk == 1) {
                                $jumlahumur25ts44tl++;
                            } else if ($item->objectjeniskelaminfk == 2) {
                                $jumlahumur25ts44tp++;
                            }
                        } else if ($item->umuryear >= 45 && $item->umuryear <= 64) {
                            if ($item->objectjeniskelaminfk == 1) {
                                $jumlahumur45ts64tl++;
                            } else if ($item->objectjeniskelaminfk == 2) {
                                $jumlahumur45ts64tp++;
                            }
                        } else if ($item->umuryear > 64) {
                            if ($item->objectjeniskelaminfk == 1) {
                                $jumlahumurlebih64l++;
                            } else if ($item->objectjeniskelaminfk == 2) {
                                $jumlahumurlebih64p++;
                            }
                        }

                        if ($item->tglpulang != null && $item->objectjeniskelaminfk == 1) {
                            $jumlahpasienkeluarhml++;
                        } else if ($item->tglpulang != null && $item->objectjeniskelaminfk == 2) {
                            $jumlahpasienkeluarhmp++;
                        }

                        if ($item->tglpulang != null && $item->objectstatuskeluarfk == 5) {
                            $jumlahpasienkeluarmati++;
                        }

                        $totalpasienkeluarhm = $jumlahpasienkeluarhmp + $jumlahpasienkeluarhml;
                    }
                }

                $currentid = $row->id;

                $data10[] = array(
                    'jumlahumur0hs6hl' => $jumlahumur0hs6hl,
                    'jumlahumur0hs6hp' =>  $jumlahumur0hs6hp,
                    'jumlahumur7hs28hl' =>  $jumlahumur7hs28hl,
                    'jumlahumur7hs28hp' =>  $jumlahumur7hs28hp,
                    'jumlahumur29hs1tl' =>  $jumlahumur29hs1tl,
                    'jumlahumur29hs1tp' =>  $jumlahumur29hs1tp,
                    'jumlahumur2ts4tl' =>  $jumlahumur2ts4tl,
                    'jumlahumur2ts4tp' =>  $jumlahumur2ts4tp,
                    'jumlahumur5ts14tl' =>  $jumlahumur5ts14tl,
                    'jumlahumur5ts14tp' =>  $jumlahumur5ts14tp,
                    'jumlahumur15ts24tl' =>  $jumlahumur15ts24tl,
                    'jumlahumur15ts24tp' =>  $jumlahumur15ts24tp,
                    'jumlahumur25ts44tl' =>  $jumlahumur25ts44tl,
                    'jumlahumur25ts44tp' =>  $jumlahumur25ts44tp,
                    'jumlahumur45ts64tl' =>  $jumlahumur45ts64tl,
                    'jumlahumur45ts64tp' =>  $jumlahumur45ts64tp,
                    'jumlahumurlebih64l' =>  $jumlahumurlebih64l,
                    'jumlahumurlebih64p' =>  $jumlahumurlebih64p,
                    'jumlahpasienkeluarhml' =>  $jumlahpasienkeluarhml,
                    'jumlahpasienkeluarhmp' =>  $jumlahpasienkeluarhmp,
                    'totalpasienkeluarhm' =>  $totalpasienkeluarhm,
                    'jumlahpasienkeluarmati' =>  $jumlahpasienkeluarmati,
                    'namakota' =>  $namakota,
                    'namalengkap' =>  $namalengkap,
                    'namapemerintahan' =>  $namapemerintahan,
                    'kode' =>  $kode,
                    'nodtd' =>  $nodtd,
                    'nodaftarterperinci' =>  $nodaftarterperinci,
                    'golongansebabpenyakit' =>  $golongansebabpenyakit,

                );
            }
        }

        $result = array(
            'detail' => $data10,
        );

        return $this->setStatusCode(201)->respond($result, 'tes msg');
    }

    public function getLaporanRL4bSebabLuar(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tglAwal = $request['tglAwal'];
        $data10 = [];

        $data = DB::select(DB::raw("select ddtd.id, pd.tglregistrasi,app.statuspenyakit,ddtd.nodtd,ddtd.nodaftarterperinci, lower(ddtd.golongansebabpenyakit) as golongansebabpenyakit, ddp.objectjenisdiagnosafk, jd.jenisdiagnosa, pd.tglpulang,
        ps.tgllahir as tglLahir,
        EXTRACT(YEAR from AGE(pd.tglregistrasi, ps.tgllahir)) as umuryear,
        DATE_PART('day', pd.tglregistrasi::timestamp - ps.tgllahir::timestamp) as umurday,
        ps.objectjeniskelaminfk,pd.objectstatuskeluarfk,sk.statuskeluar, sp.statuspulang
        from pasiendaftar_t as pd
        inner join antrianpasiendiperiksa_t as app on app.noregistrasifk = pd.norec 
		inner join pasien_m as ps on ps.id = pd.nocmfk
		inner join jeniskelamin_m as jk on ps.objectjeniskelaminfk = jk.id
		inner join ruangan_m ru on ru.id = app.objectruanganfk
		inner join departemen_m dpm on dpm.id = ru.objectdepartemenfk
		inner join diagnosapasien_t as dp on dp.noregistrasifk = app.norec
        inner join detaildiagnosapasien_t as ddp on ddp.objectdiagnosapasienfk = dp.norec
		inner join jenisdiagnosa_m jd on jd.id = ddp.objectjenisdiagnosafk
        inner join diagnosa_m as dm on ddp.objectdiagnosafk = dm.id
        inner join mappingrlmorbiditas_m as mpr on mpr.kddiagnosa = dm.kddiagnosa
        inner join diagnosadtd_m as ddtd on ddtd.nodtd = mpr.nodtd
		left join statuskeluar_m sk on sk.id = pd.objectstatuskeluarfk
        left join statuspulang_m sp on sp.id = pd.objectstatuspulangfk
        where pd.statusenabled = true 
        and pd.kdprofile = $kdProfile 
        and ru.objectdepartemenfk <> 16
        --and (jd.id = 1 or jd.id = 7)
        and ddtd.id between 508 and 537
        and pd.tglregistrasi between '$tglAwal-01-01' and '$tglAwal-12-31'
        order by ddtd.id"));

        $id = DB::select(DB::raw("select ddtd.id, ddtd.nodtd, ddtd.nodaftarterperinci, ddtd.golongansebabpenyakit, pr.id idprofile, pr.namakota, pr.namapemerintahan, pr.namalengkap from diagnosadtd_m ddtd
        inner join profile_m pr on pr.id = ddtd.kdprofile
        where ddtd.id between 508 and 537 and pr.id = $kdProfile order by ddtd.id"));


        $jumlahumur0hs6hl = 0;
        $jumlahumur0hs6hp = 0;
        $jumlahumur7hs28hl = 0;
        $jumlahumur7hs28hp = 0;
        $jumlahumur29hs1tl = 0;
        $jumlahumur29hs1tp = 0;
        $jumlahumur2ts4tl = 0;
        $jumlahumur2ts4tp = 0;
        $jumlahumur5ts14tl = 0;
        $jumlahumur5ts14tp = 0;
        $jumlahumur15ts24tl = 0;
        $jumlahumur15ts24tp = 0;
        $jumlahumur25ts44tl = 0;
        $jumlahumur25ts44tp = 0;
        $jumlahumur45ts64tl = 0;
        $jumlahumur45ts64tp = 0;
        $jumlahumurlebih64l = 0;
        $jumlahumurlebih64p = 0;
        $jumlahpasienkeluarhml = 0;
        $jumlahpasienkeluarhmp = 0;
        $totalpasienkeluarhm = 0;
        $jumlahpasienkeluarmati = 0;

        $currentid = 99999;

        foreach ($id as $row) {
            $namakota = $row->namakota;
            $namalengkap = $row->namalengkap;
            $namapemerintahan = $row->namapemerintahan;
            $kode = $row->idprofile;
            $nodaftarterperinci = $row->nodaftarterperinci;
            $golongansebabpenyakit = $row->golongansebabpenyakit;
            $nodtd = $row->nodtd;

            $jumlahumur0hs6hl = 0;
            $jumlahumur0hs6hp = 0;
            $jumlahumur7hs28hl = 0;
            $jumlahumur7hs28hp = 0;
            $jumlahumur29hs1tl = 0;
            $jumlahumur29hs1tp = 0;
            $jumlahumur2ts4tl = 0;
            $jumlahumur2ts4tp = 0;
            $jumlahumur5ts14tl = 0;
            $jumlahumur5ts14tp = 0;
            $jumlahumur15ts24tl = 0;
            $jumlahumur15ts24tp = 0;
            $jumlahumur25ts44tl = 0;
            $jumlahumur25ts44tp = 0;
            $jumlahumur45ts64tl = 0;
            $jumlahumur45ts64tp = 0;
            $jumlahumurlebih64l = 0;
            $jumlahumurlebih64p = 0;
            $jumlahpasienkeluarhml = 0;
            $jumlahpasienkeluarhmp = 0;
            $jumlahpasienkeluarmati = 0;
            $totalpasienkeluarhm = 0;

            if ($row->id != $currentid) {
                foreach ($data as $item) {
                    if ($row->id == $item->id) {
                        if ($item->umurday <= 6) {
                            if ($item->objectjeniskelaminfk == 1) {
                                $jumlahumur0hs6hl++;
                            } else if ($item->objectjeniskelaminfk == 2) {
                                $jumlahumur0hs6hp++;
                            }
                        } else if ($item->umurday >= 7 && $item->umurday <= 28) {
                            if ($item->objectjeniskelaminfk == 1) {
                                $jumlahumur7hs28hl++;
                            } else if ($item->objectjeniskelaminfk == 2) {
                                $jumlahumur7hs28hp++;
                            }
                        } else if ($item->umurday >= 29 && $item->umuryear <= 1) {
                            if ($item->objectjeniskelaminfk == 1) {
                                $jumlahumur29hs1tl++;
                            } else if ($item->objectjeniskelaminfk == 2) {
                                $jumlahumur29hs1tp++;
                            }
                        } else if ($item->umuryear >= 2 && $item->umuryear <= 4) {
                            if ($item->objectjeniskelaminfk == 1) {
                                $jumlahumur2ts4tl++;
                            } else if ($item->objectjeniskelaminfk == 2) {
                                $jumlahumur2ts4tp++;
                            }
                        } else if ($item->umuryear >= 5 && $item->umuryear <= 14) {
                            if ($item->objectjeniskelaminfk == 1) {
                                $jumlahumur15ts24tl++;
                            } else if ($item->objectjeniskelaminfk == 2) {
                                $jumlahumur15ts24tp++;
                            }
                        } else if ($item->umuryear >= 15 && $item->umuryear <= 24) {
                            if ($item->objectjeniskelaminfk == 1) {
                                $jumlahumur15ts24tl++;
                            } else if ($item->objectjeniskelaminfk == 2) {
                                $jumlahumur15ts24tp++;
                            }
                        } else if ($item->umuryear >= 25 && $item->umuryear <= 44) {
                            if ($item->objectjeniskelaminfk == 1) {
                                $jumlahumur25ts44tl++;
                            } else if ($item->objectjeniskelaminfk == 2) {
                                $jumlahumur25ts44tp++;
                            }
                        } else if ($item->umuryear >= 45 && $item->umuryear <= 64) {
                            if ($item->objectjeniskelaminfk == 1) {
                                $jumlahumur45ts64tl++;
                            } else if ($item->objectjeniskelaminfk == 2) {
                                $jumlahumur45ts64tp++;
                            }
                        } else if ($item->umuryear > 64) {
                            if ($item->objectjeniskelaminfk == 1) {
                                $jumlahumurlebih64l++;
                            } else if ($item->objectjeniskelaminfk == 2) {
                                $jumlahumurlebih64p++;
                            }
                        }

                        if ($item->tglpulang != null && $item->objectjeniskelaminfk == 1) {
                            $jumlahpasienkeluarhml++;
                        } else if ($item->tglpulang != null && $item->objectjeniskelaminfk == 2) {
                            $jumlahpasienkeluarhmp++;
                        }

                        if ($item->tglpulang != null && $item->objectstatuskeluarfk == 5) {
                            $jumlahpasienkeluarmati++;
                        }

                        $totalpasienkeluarhm = $jumlahpasienkeluarhmp + $jumlahpasienkeluarhml;
                    }
                }

                $currentid = $row->id;

                $data10[] = array(
                    'jumlahumur0hs6hl' => $jumlahumur0hs6hl,
                    'jumlahumur0hs6hp' =>  $jumlahumur0hs6hp,
                    'jumlahumur7hs28hl' =>  $jumlahumur7hs28hl,
                    'jumlahumur7hs28hp' =>  $jumlahumur7hs28hp,
                    'jumlahumur29hs1tl' =>  $jumlahumur29hs1tl,
                    'jumlahumur29hs1tp' =>  $jumlahumur29hs1tp,
                    'jumlahumur2ts4tl' =>  $jumlahumur2ts4tl,
                    'jumlahumur2ts4tp' =>  $jumlahumur2ts4tp,
                    'jumlahumur5ts14tl' =>  $jumlahumur5ts14tl,
                    'jumlahumur5ts14tp' =>  $jumlahumur5ts14tp,
                    'jumlahumur15ts24tl' =>  $jumlahumur15ts24tl,
                    'jumlahumur15ts24tp' =>  $jumlahumur15ts24tp,
                    'jumlahumur25ts44tl' =>  $jumlahumur25ts44tl,
                    'jumlahumur25ts44tp' =>  $jumlahumur25ts44tp,
                    'jumlahumur45ts64tl' =>  $jumlahumur45ts64tl,
                    'jumlahumur45ts64tp' =>  $jumlahumur45ts64tp,
                    'jumlahumurlebih64l' =>  $jumlahumurlebih64l,
                    'jumlahumurlebih64p' =>  $jumlahumurlebih64p,
                    'jumlahpasienkeluarhml' =>  $jumlahpasienkeluarhml,
                    'jumlahpasienkeluarhmp' =>  $jumlahpasienkeluarhmp,
                    'totalpasienkeluarhm' =>  $totalpasienkeluarhm,
                    'jumlahpasienkeluarmati' =>  $jumlahpasienkeluarmati,
                    'namakota' =>  $namakota,
                    'namalengkap' =>  $namalengkap,
                    'namapemerintahan' =>  $namapemerintahan,
                    'kode' =>  $kode,
                    'nodtd' =>  $nodtd,
                    'nodaftarterperinci' =>  $nodaftarterperinci,
                    'golongansebabpenyakit' =>  $golongansebabpenyakit,

                );
            }
        }

        $result = array(
            'detail' => $data10,
        );

        return $this->setStatusCode(201)->respond($result, 'tes msg');
    }

    public function getDataLaporanRL51(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];


        $data = DB::select(DB::raw("select *, (case when x.statuspasienfix = 'LAMA' THEN 'Pengunjung Lama' else 'Pengunjung Baru' end) as statuspasienfixbanget from(
            select to_char(pd.tglregistrasi, 'Month') as month, to_char(pd.tglregistrasi, 'mm') as idmonth, to_char(pd.tglregistrasi, 'YYYY') as year,count(pd.tglregistrasi) as jumlahkunjungan,
                    (case when pd.statuspasien is null then 'LAMA' else pd.statuspasien end) as statuspasienfix,
                            pr.namalengkap, pr.namapemerintahan, pr.namakota, pr.id idprofile
                    from pasiendaftar_t pd
                    inner join profile_m pr on pr.id = pd.kdprofile
                    inner join pasien_m as pm on pm.id = pd.nocmfk
                    where pd.statusenabled = true and pd.kdprofile = $kdProfile
                    and pd.tglregistrasi between '$tglAwal' and '$tglAkhir'
                    group by to_char(pd.tglregistrasi, 'Month'), to_char(pd.tglregistrasi, 'mm'), to_char(pd.tglregistrasi, 'YYYY'), (case when pd.statuspasien is null then 'LAMA' else pd.statuspasien end), pr.namalengkap, pr.namapemerintahan, pr.namakota, pr.id
                    order by to_char(pd.tglregistrasi, 'YYYY'), to_char(pd.tglregistrasi, 'mm')) as x"));

        $result = array(
            'data' => $data,
            'message' => 'larasatizka',
        );
        return $this->respond($result);
    }
    public function getDataLaporanRL52(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $bulan = [];

        // $data = DB::select(DB::raw("select pd.tglregistrasi::date, rtrim(to_char(pd.tglregistrasi, 'Month'), ' ') as month, ru.namaruangan, ru.id, count(apd.objectruanganfk) jumlahkunjungan, dp.namadepartemen, ru.objectdepartemenfk, pr.namalengkap, pr.namapemerintahan, pr.namakota, pr.id as idprofile
        // from
        // pasien_m ps 
        // inner join pasiendaftar_t pd on ps.id=pd.nocmfk
        // inner join antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
        // inner join ruangan_m ru on ru.id = apd.objectruanganfk
        // inner join departemen_m dp on dp.id = ru.objectdepartemenfk
        // inner join profile_m pr on pr.id = pd.kdprofile
        // where pd.statusenabled = true and pd.kdprofile = $kdProfile
        // and ru.objectdepartemenfk <> 16
        // and pd.tglregistrasi between '$tglAwal' and '$tglAkhir'
        // group by pd.tglregistrasi::date, ru.namaruangan, ru.id, dp.namadepartemen, ru.objectdepartemenfk, pr.namalengkap, pr.namapemerintahan, pr.namakota, pr.id, rtrim(to_char(pd.tglregistrasi, 'Month'), ' ')
        // order by pd.tglregistrasi::date"));

        $data = DB::select(DB::raw(" SELECT
                x.tglregistrasi::date, rtrim(to_char(x.tglregistrasi, 'Month'), ' ') as month,
                x.namaruangan,
                x.ID,
                x.namadepartemen,
                x.objectdepartemenfk,
                x.namalengkap,
                x.namapemerintahan,
                x.namakota,
                x.idprofile,
                SUM ( x.jk ) AS jk,
                SUM ( x.pr ) AS pr ,
                SUM ( x.jk ) + SUM ( x.pr ) AS jumlahkunjungan
            FROM
                (
                SELECT
                    pd.tglregistrasi,
                    ru.namaruangan,
                    ru.ID,
                    dp.namadepartemen,
                    ru.objectdepartemenfk,
                    pr.namalengkap,
                    pr.namapemerintahan,
                    pr.namakota,
                    pr.ID AS idprofile,
                    ps.objectjeniskelaminfk,
                CASE
                        
                        WHEN ps.objectjeniskelaminfk = '1' THEN
                        1 ELSE 0 
                    END AS jk,
                CASE
                        
                        WHEN ps.objectjeniskelaminfk = '2' THEN
                        1 ELSE 0
                    END AS pr,
                    pd.noregistrasi 
                FROM
                    pasien_m ps
                    INNER JOIN pasiendaftar_t pd ON ps.ID = pd.nocmfk
                    INNER JOIN antrianpasiendiperiksa_t apd ON pd.norec = apd.noregistrasifk
                    INNER JOIN ruangan_m ru ON ru.ID = apd.objectruanganfk
                    INNER JOIN departemen_m dp ON dp.ID = ru.objectdepartemenfk
                    INNER JOIN profile_m pr ON pr.ID = pd.kdprofile 
                WHERE
                    pd.statusenabled = TRUE 
                    AND pd.kdprofile = $kdProfile
                    AND ru.objectdepartemenfk <> 16 
                    and pd.tglregistrasi between '$tglAwal' and '$tglAkhir'
                GROUP BY
                
                    pd.noregistrasi,
                    pd.tglregistrasi,
                    ru.namaruangan,
                    ru.ID,
                    dp.namadepartemen,
                    ru.objectdepartemenfk,
                    pr.namalengkap,
                    pr.namapemerintahan,
                    ps.objectjeniskelaminfk,
                    pr.namakota,
                    pr.ID --, rtrim(to_char(pd.tglregistrasi, 'Month'), ' ')
                    
                ORDER BY
                    pd.noregistrasi 
                ) x 
            GROUP BY
                x.tglregistrasi::date,
                x.namaruangan,
                x.ID,
                x.namadepartemen,
                x.objectdepartemenfk,
                x.namalengkap,
                x.namapemerintahan,
                x.namakota,
                x.idprofile,
                rtrim(to_char(x.tglregistrasi, 'Month'), ' ')
                order by x.tglregistrasi::date"));

        $querybulan = DB::select(DB::raw("select rtrim(to_char(pd.tglregistrasi, 'Month'), ' ') as month, to_char(pd.tglregistrasi, 'mm') as idmonth
        from
                pasien_m ps 
                inner join pasiendaftar_t pd on ps.id=pd.nocmfk
                inner join antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                inner join ruangan_m ru on ru.id = apd.objectruanganfk
                where pd.statusenabled = true and pd.kdprofile = $kdProfile
                and ru.objectdepartemenfk <> 16
                and pd.tglregistrasi between '$tglAwal' and '$tglAkhir'
                        group by rtrim(to_char(pd.tglregistrasi, 'Month'), ' '), to_char(pd.tglregistrasi, 'mm')
                order by idmonth"));

        foreach ($querybulan as $q) {
            array_push($bulan, $q->month);
        }

        $main = array("Penyakit Dalam", "Bedah", "Kesehatan Anak (Neonatal)", "Kesehatan Anak Lainnya", "Obstetri & Ginekologi (Ibu Hamil)", "Obstetri & Ginekologi Lainnya", "Keluarga Berencana", "Bedah Saraf", "Saraf", "Jiwa", "Jiwa Anak", "Jiwa Geriatri", "NAPZA", "Psikologi", "THT", "Mata", "Kulit dan Kelamin", "Gigi & Mulut", "Geriatri", "Kardiologi", "Radiologi", "Bedah Orthopedi", "Paru-paru", "Kusta", "Umum", "Rawat Darurat", "Rehabilitasi Medik", "Akupuntur Medik", "Konsultasi Gizi", "Day Care", "Lain-Lain", "TOTAL");
        //$bulan = array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
        $currentnama = "Larasatizka";
        $currentmonth = "Ayuningtyas";

        $jumlah = 0;
        $total = 0;
        $data10 = [];
        $totalfix = 0;


        foreach ($bulan as $month) {
            if ($month != $currentmonth) {
                $total = 0;
                $totallk = 0;
                $totalpr = 0;
                $totalfix = 0;
                foreach ($main as $row) {
                    if ($row != $currentnama) {
                        $jumlah = 0;
                        $jumlahlk = 0;
                        $jumlahpr = 0;

                        foreach ($data as $item) {
                            $koders = $item->idprofile;
                            $namars = $item->namalengkap;
                            $namakota = $item->namakota;
                            $idprofile = $item->idprofile;
                            if ($row == "Penyakit Dalam" && $item->id == 765 && $item->month == $month) {
                                $jumlahlk += $item->jk;
                                $totallk += $item->jk;
                                $jumlahpr += $item->pr;
                                $totalpr += $item->pr;
                                $jumlah += $item->jumlahkunjungan;
                                $total += $item->jumlahkunjungan;
                            } else if ($row == "Bedah" && $item->id == 44 && $item->month == $month) {
                                $jumlahlk += $item->jk;
                                $totallk += $item->jk;
                                $jumlahpr += $item->pr;
                                $totalpr += $item->pr;
                                $jumlah += $item->jumlahkunjungan;
                                $total += $item->jumlahkunjungan;
                            } else if ($row == "Kesehatan Anak (Neonatal)"  && $item->month == $month) {
                                $jumlahlk += 0;
                                $totallk += $item->jk;
                                $jumlahpr += 0;
                                $totalpr += $item->pr;
                                $jumlah += 0;
                                $total += $item->jumlahkunjungan;
                            } else if ($row == "Kesehatan Anak Lainnya" && ($item->id == 753 || $item->id == 775) && $item->month == $month) {
                                $jumlahlk += $item->jk;
                                $totallk += $item->jk;
                                $jumlahpr += $item->pr;
                                $totalpr += $item->pr;
                                $jumlah += $item->jumlahkunjungan;
                                $total += $item->jumlahkunjungan;
                            } else if ($row == "Obstetri & Ginekologi (Ibu Hamil)"  && $item->month == $month) {
                                $jumlahlk += 0;
                                $totallk += $item->jk;
                                $jumlahpr += 0;
                                $totalpr += $item->pr;
                                $jumlah += 0;
                                $total += $item->jumlahkunjungan;
                            } else if ($row == "Obstetri & Ginekologi Lainnya"  && $item->month == $month) {
                                $jumlahlk += 0;
                                $totallk += $item->jk;
                                $jumlahpr += 0;
                                $totalpr += $item->pr;
                                $jumlah += 0;
                                $total += $item->jumlahkunjungan;
                            } else if ($row == "Keluarga Berencana"  && $item->month == $month) {
                                $jumlahlk += 0;
                                $totallk += $item->jk;
                                $jumlahpr += 0;
                                $totalpr += $item->pr;
                                $jumlah += 0;
                                $total += $item->jumlahkunjungan;
                            } else if ($row == "Bedah Saraf"  && $item->month == $month) {
                                $jumlahlk += 0;
                                $totallk += $item->jk;
                                $jumlahpr += 0;
                                $totalpr += $item->pr;
                                $jumlah += 0;
                                $total += $item->jumlahkunjungan;
                            } else if ($row == "Saraf" && $item->id == 755 && $item->month == $month) {
                                $jumlahlk += $item->jk;
                                $totallk += $item->jk;
                                $jumlahpr += $item->pr;
                                $totalpr += $item->pr;
                                $jumlah += $item->jumlahkunjungan;
                                $total += $item->jumlahkunjungan;
                            } else if ($row == "Jiwa" && ($item->id == 752) && $item->month == $month) {
                                $jumlahlk += $item->jk;
                                $totallk += $item->jk;
                                $jumlahpr += $item->pr;
                                $totalpr += $item->pr;
                                $jumlah += $item->jumlahkunjungan;
                                $total += $item->jumlahkunjungan;
                            } else if ($row == "Jiwa Anak" && ($item->id == 785) && $item->month == $month) {
                                $jumlahlk += $item->jk;
                                $totallk += $item->jk;
                                $jumlahpr += $item->pr;
                                $totalpr += $item->pr;
                                $jumlah += $item->jumlahkunjungan;
                                $total += $item->jumlahkunjungan;
                            } else if ($row == "Jiwa Geriatri" && ($item->id == 890) && $item->month == $month) {
                                $jumlahlk += $item->jk;
                                $totallk += $item->jk;
                                $jumlahpr += $item->pr;
                                $totalpr += $item->pr;
                                $jumlah += $item->jumlahkunjungan;
                                $total += $item->jumlahkunjungan;
                            } else if ($row == "NAPZA" && ($item->id == 768 || $item->id == 789) && $item->month == $month) {
                                $jumlahlk += $item->jk;
                                $totallk += $item->jk;
                                $jumlahpr += $item->pr;
                                $totalpr += $item->pr;
                                $jumlah += $item->jumlahkunjungan;
                                $total += $item->jumlahkunjungan;
                            } else if ($row == "Psikologi" && ($item->id == 807 || $item->id == 767 || $item->id == 791) && $item->month == $month) {
                                $jumlahlk += $item->jk;
                                $totallk += $item->jk;
                                $jumlahpr += $item->pr;
                                $totalpr += $item->pr;
                                $jumlah += $item->jumlahkunjungan;
                                $total += $item->jumlahkunjungan;
                            } else if ($row == "THT"  && $item->month == $month) {
                                $jumlahlk += 0;
                                $totallk += $item->jk;
                                $jumlahpr += 0;
                                $totalpr += $item->pr;
                                $jumlah += 0;
                                $total += $item->jumlahkunjungan;
                            } else if ($row == "Mata"  && $item->month == $month) {
                                $jumlahlk += 0;
                                $totallk += $item->jk;
                                $jumlahpr += 0;
                                $totalpr += $item->pr;
                                $jumlah += 0;
                                $total += $item->jumlahkunjungan;
                            } else if ($row == "Kulit dan Kelamin" && $item->id == 754 && $item->month == $month) {
                                $jumlahlk += $item->jk;
                                $totallk += $item->jk;
                                $jumlahpr += $item->pr;
                                $totalpr += $item->pr;
                                $jumlah += $item->jumlahkunjungan;
                                $total += $item->jumlahkunjungan;
                            } else if ($row == "Gigi & Mulut" && $item->id == 759 && $item->month == $month) {
                                $jumlahlk += $item->jk;
                                $totallk += $item->jk;
                                $jumlahpr += $item->pr;
                                $totalpr += $item->pr;
                                $jumlah += $item->jumlahkunjungan;
                                $total += $item->jumlahkunjungan;
                            } else if ($row == "Geriatri"  && $item->month == $month) {
                                $jumlahlk += 0;
                                $totallk += $item->jk;
                                $jumlahpr += 0;
                                $totalpr += $item->pr;
                                $jumlah += 0;
                                $total += $item->jumlahkunjungan;
                            } else if ($row == "Kardiologi"  && $item->month == $month) {
                                $jumlahlk += 0;
                                $totallk += $item->jk;
                                $jumlahpr += 0;
                                $totalpr += $item->pr;
                                $jumlah += 0;
                                $total += $item->jumlahkunjungan;
                            } else if ($row == "Radiologi" && $item->id == 576 && $item->month == $month) {
                                $jumlahlk += $item->jk;
                                $totallk += $item->jk;
                                $jumlahpr += $item->pr;
                                $totalpr += $item->pr;
                                $jumlah += $item->jumlahkunjungan;
                                $total += $item->jumlahkunjungan;
                            } else if ($row == "Bedah Orthopedi"  && $item->month == $month) {
                                $jumlahlk += 0;
                                $totallk += $item->jk;
                                $jumlahpr += 0;
                                $totalpr += $item->pr;
                                $jumlah += 0;
                                $total += $item->jumlahkunjungan;
                            } else if ($row == "Paru-paru"  && $item->month == $month) {
                                $jumlahlk += 0;
                                $totallk += $item->jk;
                                $jumlahpr += 0;
                                $totalpr += $item->pr;
                                $jumlah += 0;
                                $total += $item->jumlahkunjungan;
                            } else if ($row == "Kusta"  && $item->month == $month) {
                                $jumlahlk += 0;
                                $totallk += $item->jk;
                                $jumlahpr += 0;
                                $totalpr += $item->pr;
                                $jumlah += 0;
                                $total += $item->jumlahkunjungan;
                            } else if ($row == "Umum" && ($item->id == 758 || $item->id == 771) && $item->month == $month) {
                                $jumlahlk += $item->jk;
                                $totallk += $item->jk;
                                $jumlahpr += $item->pr;
                                $totalpr += $item->pr;
                                $jumlah += $item->jumlahkunjungan;
                                $total += $item->jumlahkunjungan;
                            } else if ($row == "Rawat Darurat" && ($item->id == 765 || $item->id == 766) && $item->month == $month) {
                                $jumlahlk += $item->jk;
                                $totallk += $item->jk;
                                $jumlahpr += $item->pr;
                                $totalpr += $item->pr;
                                $jumlah += $item->jumlahkunjungan;
                                $total += $item->jumlahkunjungan;
                            } else if ($row == "Akupuntur Medik" && $item->id == 772 && $item->month == $month) {
                                $jumlahlk += $item->jk;
                                $totallk += $item->jk;
                                $jumlahpr += $item->pr;
                                $totalpr += $item->pr;
                                $jumlah += $item->jumlahkunjungan;
                                $total += $item->jumlahkunjungan;
                            } else if ($row == "Konsultasi Gizi" && $item->id == 784 && $item->month == $month) {
                                $jumlahlk += $item->jk;
                                $totallk += $item->jk;
                                $jumlahpr += $item->pr;
                                $totalpr += $item->pr;
                                $jumlah += $item->jumlahkunjungan;
                                $total += $item->jumlahkunjungan;
                            } else if ($row == "Day Care" && $item->id == 779 && $item->month == $month) {
                                $jumlahlk += $item->jk;
                                $totallk += $item->jk;
                                $jumlahpr += $item->pr;
                                $totalpr += $item->pr;
                                $jumlah += $item->jumlahkunjungan;
                                $total += $item->jumlahkunjungan;
                            } else if ($row == "Lain-Lain" && $item->month == $month && $item->id != 779 && $item->id != 784 && $item->id != 772 && $item->id != 765 && $item->id != 766 && $item->id != 758 && $item->id != 576 && $item->id != 759 && $item->id != 754 && $item->id != 807 && $item->id != 767 && $item->id != 791 && $item->id != 768 && $item->id != 789 && $item->id != 785 && $item->id != 752 && $item->id != 755 && $item->id != 753 && $item->id != 775 && $item->id != 44 && $item->id != 782 && $item->id != 771) {
                                $jumlahlk += $item->jk;
                                $totallk += $item->jk;
                                $jumlahpr += $item->pr;
                                $totalpr += $item->pr;
                                $jumlah += $item->jumlahkunjungan;
                                $total += $item->jumlahkunjungan;
                            }
                        }

                        $totalfix += $jumlah;

                        if ($row == "TOTAL") {
                            $jumlah = $totalfix;
                        }

                        $data10[] = array(
                            // 'koders' => $koders,
                            // 'namars' =>  $namars, 
                            // 'namakota' =>  $namakota, 
                            'jumlah' =>  $jumlah,
                            'hasilbulan' =>  $month,
                            'hasilnama' =>  $row,
                            'koders' =>  $koders,
                            'namars' =>  $namars,
                            'namakota' =>  $namakota,
                            'idprofile' =>  $idprofile,
                            'jumlahlk' =>  $jumlahlk,
                            'jumlahpr' =>  $jumlahpr,
                        );

                        $currentnama = $row;
                    }
                }
                $currentmonth = $month;
            }
        }

        $result = array(
            'data' => $data10,
            'message' => 'larasatizka',
        );

        return $this->respond($result);
    }


    public function getDataLaporanRL53(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        // $kdDeptRanapAll = explode(',',$this->settingDataFixed('KdDepartemenRIAll',$kdProfile));
        // $kdDepartemenRanapAll = [];
        // foreach ($kdDeptRanapAll as $items){
        //     $kdDepartemenRanapAll []=  (int)$items;
        // }

        $data = DB::select(DB::raw("select x.month, x.idmonth, x.year,x.nodaftarterperinci, x.golongansebabpenyakit, 
        sum(x.jumlahhml) jumlahhml, sum(x.jumlahhmp) jumlahhmp, sum(x.jumlahml) jumlahml, sum(x.jumlahmp) jumlahmp, sum(x.totalall) totalall,
        x.namalengkap, x.namapemerintahan, x.namakota, x.idprofile 
        from(
                select to_char(pd.tglregistrasi, 'Month') as month, to_char(pd.tglregistrasi, 'mm') as idmonth, to_char(pd.tglregistrasi, 'YYYY') as year,dm.kddiagnosa as nodaftarterperinci, dm.namadiagnosa as golongansebabpenyakit,
                (case when jk.id = 1 and sk.id != 5  then count(dm.kddiagnosa) else 0 end) as jumlahhml,
                (case when jk.id = 2 and sk.id != 5  then count(dm.kddiagnosa) else 0 end) as jumlahhmp,
                (case when jk.id = 1 and sk.id = 5 then count(dm.kddiagnosa) else 0 end) as jumlahml,
                (case when jk.id = 2 and sk.id = 5 then count(dm.kddiagnosa) else 0 end) as jumlahmp,
								count(dm.kddiagnosa) totalall,
                pr.namalengkap, pr.namapemerintahan, pr.namakota, pr.id idprofile
                from pasiendaftar_t as pd
                inner join antrianpasiendiperiksa_t as app on app.noregistrasifk = pd.norec 
                inner join pasien_m as ps on ps.id = pd.nocmfk
                inner join jeniskelamin_m as jk on ps.objectjeniskelaminfk = jk.id
                inner join ruangan_m ru on ru.id = app.objectruanganfk
                inner join departemen_m dpm on dpm.id = ru.objectdepartemenfk
                inner join profile_m pr on pr.id = pd.kdprofile
                inner join diagnosapasien_t as dp on dp.noregistrasifk = app.norec
                inner join detaildiagnosapasien_t as ddp on ddp.objectdiagnosapasienfk = dp.norec
                inner join diagnosa_m as dm on ddp.objectdiagnosafk = dm.id
                inner join jenisdiagnosa_m jd on jd.id = ddp.objectjenisdiagnosafk
								left join statuskeluar_m sk on sk.id = pd.objectstatuskeluarfk
								left join statuspulang_m sp on sp.id = pd.objectstatuspulangfk
        where pd.statusenabled = true 
        and pd.kdprofile = $kdProfile 
        and ru.objectdepartemenfk = 16
				and dm.kddiagnosa <> '-'
        --and (jd.id = 1 or jd.id = 7)
        and jd.id = 7
        and pd.tglregistrasi BETWEEN '$tglAwal' AND '$tglAkhir' 
        group by to_char(pd.tglregistrasi, 'Month'), to_char(pd.tglregistrasi, 'mm'), to_char(pd.tglregistrasi, 'YYYY'), dm.kddiagnosa, dm.namadiagnosa, jk.id, sk.id, pr.namalengkap, pr.namapemerintahan, pr.namakota, pr.id
        ) as x
        group by x.month, x.idmonth, x.year,x.nodaftarterperinci, x.golongansebabpenyakit, x.namalengkap, x.namapemerintahan, x.namakota, x.idprofile
        order by totalall desc limit 10"));


        $result = array(
            'data' => $data,
            'message' => '@larasatizka',
        );

        return $this->respond($result);
    }
    public function getDataLaporanRL54(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];


        $data = DB::select(DB::raw("select x.month, x.idmonth, x.year,x.nodaftarterperinci, x.golongansebabpenyakit, 
        sum(x.jumlahbarul) jumlahbarul, sum(x.jumlahbarup) jumlahbarup, sum(x.jumlahbaru) jumlahbaru, sum(x.jumlahkunjungan) jumlahkunjungan,
        x.namalengkap, x.namapemerintahan, x.namakota, x.idprofile
        from(
                select to_char(pd.tglregistrasi, 'Month') as month, to_char(pd.tglregistrasi, 'mm') as idmonth, to_char(pd.tglregistrasi, 'YYYY') as year,dm.kddiagnosa as nodaftarterperinci, dm.namadiagnosa as golongansebabpenyakit,
                (case when jk.id = 1 and dp.iskasusbaru = true  then count(dm.kddiagnosa) else 0 end) as jumlahbarul,
                (case when jk.id = 2 and dp.iskasusbaru = true  then count(dm.kddiagnosa) else 0 end) as jumlahbarup,
                ((case when jk.id = 1 and dp.iskasusbaru = true  then count(dm.kddiagnosa) else 0 end) + (case when jk.id = 2 and dp.iskasusbaru = true  then count(dm.kddiagnosa) else 0 end)) as jumlahbaru,
                count(dm.kddiagnosa) as jumlahkunjungan,
                pr.namalengkap, pr.namapemerintahan, pr.namakota, pr.id idprofile, dp.iskasusbaru
                from pasiendaftar_t as pd
                inner join antrianpasiendiperiksa_t as app on app.noregistrasifk = pd.norec 
                inner join pasien_m as ps on ps.id = pd.nocmfk
                inner join jeniskelamin_m as jk on ps.objectjeniskelaminfk = jk.id
                inner join ruangan_m ru on ru.id = app.objectruanganfk
                inner join departemen_m dpm on dpm.id = ru.objectdepartemenfk
                inner join profile_m pr on pr.id = pd.kdprofile
                inner join diagnosapasien_t as dp on dp.noregistrasifk = app.norec
                inner join detaildiagnosapasien_t as ddp on ddp.objectdiagnosapasienfk = dp.norec
                inner join diagnosa_m as dm on ddp.objectdiagnosafk = dm.id
                inner join jenisdiagnosa_m jd on jd.id = ddp.objectjenisdiagnosafk
        where pd.statusenabled = true 
        and pd.kdprofile = $kdProfile 
        and ru.objectdepartemenfk <> 16
        and pd.tglregistrasi between '$tglAwal' and '$tglAkhir'
				and dm.kddiagnosa <> '-' and jd.id = 7
        group by to_char(pd.tglregistrasi, 'Month'), to_char(pd.tglregistrasi, 'mm'), to_char(pd.tglregistrasi, 'YYYY'), dm.kddiagnosa, dm.namadiagnosa, jk.id, pr.namalengkap, pr.namapemerintahan, pr.namakota, pr.id, dp.iskasusbaru
        ) as x
        group by x.month, x.idmonth, x.year,x.nodaftarterperinci, x.golongansebabpenyakit, x.namalengkap, x.namapemerintahan, x.namakota, x.idprofile
        order by jumlahkunjungan desc limit 10"));

        $result = array(
            'data' => $data,
            'message' => '@larasatizka',
        );

        return $this->respond($result);
    }
    public function getDataLaporanPasienMasuk(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $idDepRawatInap = (int) $this->settingDataFixed('idDepRawatInap', $kdProfile);
        $dataLogin = $request->all();
        $data = \DB::table('pasiendaftar_t as pd')
            ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->JOIN('registrasipelayananpasien_t as rpp', 'rpp.noregistrasifk', '=', 'pd.norec')
            ->JOIN('diagnosapasien_t as dp', 'dp.noregistrasifk', '=', 'apd.norec')
            ->leftJOIN('detaildiagnosapasien_t as ddp', 'ddp.noregistrasifk', '=', 'apd.norec')
            ->leftJOIN('diagnosa_m as d', 'd.id', '=', 'ddp.objectdiagnosafk')
            ->leftJOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftJOIN('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->leftJOIN('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJOIN('kelompokpasien_m as kps', 'kps.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftJOIN('rekanan_m as rek', 'rek.id', '=', 'pd.objectrekananfk')
            ->leftJOIN('kamar_m as km', 'km.id', '=', 'apd.objectkamarfk')
            ->leftJOIN('kelas_m as kls', 'kls.id', '=', 'apd.objectkelasfk')
            ->leftJOIN('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->select(
                'pd.noregistrasi',
                'ps.nocm',
                'ps.namapasien',
                'd.kddiagnosa',
                'kps.kelompokpasien',
                'rek.namarekanan',
                'jk.jeniskelamin',
                'apd.tglkeluar',
                'apd.nobed',
                'apd.objectkamarfk',
                'km.namakamar',
                'kls.namakelas',
                'd.kddiagnosa',
                'd.namadiagnosa',
                'ru.namaruangan',
                'pd.tglregistrasi as tglmasukinap',
                'pd.objectstatuskeluarfk',
                DB::raw(
                    'pg.namalengkap as dokter,
                case WHEn pd.tglpulang is not null then \'Dipulangkan\' else \'Masih Dirawat\' end as carakeluar,
                  case when ru.objectdepartemenfk =16 then \'Masuk\' else null end as mutasi'
                )
            )
            ->where('pd.kdprofile', $kdProfile)
            ->Where('ru.objectdepartemenfk', '=', $idDepRawatInap);

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir']; //." 23:59:59";
            $data = $data->where('pd.tglregistrasi', '<=', $tgl);
        }
        if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
            $data = $data->where('ru.objectdepartemenfk', '=', $request['idDept']);
        }
        if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
            $data = $data->where('ru.id', '=', $request['idRuangan']);
        }
        if (isset($request['idKelas']) && $request['idKelas'] != "" && $request['idKelas'] != "undefined") {
            $data = $data->where('kls.id', '=', $request['idKelas']);
        }
        $data = $data->distinct();
        $data = $data->get();

        $data10 = [];
        $sama = false;

        foreach ($data as $item) {
            $sama = false;
            $i = 0;
            foreach ($data10 as $hideung) {
                if ($item->noregistrasi == $data10[$i]['noregistrasi']) {
                    $sama = true;
                    $data10[$i]['kddiagnosa'] = $data10[$i]['kddiagnosa'] . ', ' . ($item->kddiagnosa);
                }
                $i = $i + 1;
            }
            if ($sama == false) {
                $data10[] = array(
                    'noregistrasi' => $item->noregistrasi,
                    'namapasien' => $item->namapasien,
                    'nocm' => $item->nocm,
                    'namakamar' => $item->namakamar,
                    'nobed' => $item->nobed,
                    'namaruangan' => $item->namaruangan,
                    'kelompokpasien' => $item->kelompokpasien,
                    'namarekanan' => $item->namarekanan,
                    'tglmasukinap' => $item->tglmasukinap,
                    'dokter' => $item->dokter,
                    'namakelas' => $item->namakelas,
                    'carakeluar' => $item->carakeluar,
                    'kddiagnosa' => $item->kddiagnosa,
                    'mutasi' => $item->mutasi,
                );
            }
        }

        $result = array(
            'data' => $data10,
            'message' => 'as@Ramdan',
        );

        return $this->respond($result);
    }
    public function getDataLaporanPasienKeluar(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $dataLogin = $request->all();
        $kdDeptRanapAll = explode(',', $this->settingDataFixed('KdDepartemenRIAll', $kdProfile));
        $kdDepartemenRanapAll = [];
        foreach ($kdDeptRanapAll as $items) {
            $kdDepartemenRanapAll[] =  (int)$items;
        }
        $data = \DB::table('pasiendaftar_t as pd')
            ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->Join('registrasipelayananpasien_t as rpp', 'rpp.noregistrasifk', '=', 'pd.norec')
            ->Join('diagnosapasien_t as dp', 'dp.noregistrasifk', '=', 'apd.norec')
            ->leftJOIN('detaildiagnosapasien_t as ddp', 'ddp.noregistrasifk', '=', 'apd.norec')
            ->leftJOIN('diagnosa_m as d', 'd.id', '=', 'ddp.objectdiagnosafk')
            ->leftJOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftJOIN('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->leftJOIN('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJOIN('kelompokpasien_m as kps', 'kps.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftJOIN('rekanan_m as rek', 'rek.id', '=', 'pd.objectrekananfk')
            ->leftJOIN('kamar_m as km', 'km.id', '=', 'apd.objectkamarfk')
            ->leftJOIN('kelas_m as kls', 'kls.id', '=', 'apd.objectkelasfk')
            ->leftJOIN('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->select(
                'pd.noregistrasi',
                'ps.nocm',
                'ps.namapasien',
                'd.kddiagnosa',
                'kps.kelompokpasien',
                'rek.namarekanan',
                'jk.jeniskelamin',
                'apd.tglkeluar',
                'apd.nobed',
                'apd.objectkamarfk',
                'km.namakamar',
                'kls.namakelas',
                'd.kddiagnosa',
                'd.namadiagnosa',
                'ru.namaruangan',
                'pd.tglregistrasi as tglmasukinap',
                'pd.objectstatuskeluarfk',
                'pd.tglpulang',
                DB::raw(
                    'pg.namalengkap as dokter,
                case when pd.tglpulang is not null then \'Keluar\' end as mutasi,
                 case when pd.tglpulang is not null then \'Dipulangkan\' end as carakeluar'
                )
            )
            ->where('pd.kdprofile', $kdProfile)
            ->whereNotNull('pd.tglpulang')
            ->WhereIN('ru.objectdepartemenfk', $kdDepartemenRanapAll);


        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglpulang', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir']; //." 23:59:59";
            $data = $data->where('pd.tglpulang', '<=', $tgl);
        }
        if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
            $data = $data->where('ru.objectdepartemenfk', '=', $request['idDept']);
        }
        if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
            $data = $data->where('ru.id', '=', $request['idRuangan']);
        }
        if (isset($request['idKelas']) && $request['idKelas'] != "" && $request['idKelas'] != "undefined") {
            $data = $data->where('kls.id', '=', $request['idKelas']);
        }
        $data = $data->distinct();
        $data = $data->get();

        $data10 = [];
        $sama = false;

        foreach ($data as $item) {
            $sama = false;
            $i = 0;
            foreach ($data10 as $hideung) {
                if ($item->noregistrasi == $data10[$i]['noregistrasi']) {
                    $sama = true;
                    $data10[$i]['kddiagnosa'] = $data10[$i]['kddiagnosa'] . ', ' . ($item->kddiagnosa);
                }
                $i = $i + 1;
            }
            if ($sama == false) {
                $data10[] = array(
                    'noregistrasi' => $item->noregistrasi,
                    'namapasien' => $item->namapasien,
                    'nocm' => $item->nocm,
                    'namakamar' => $item->namakamar,
                    'nobed' => $item->nobed,
                    'namaruangan' => $item->namaruangan,
                    'kelompokpasien' => $item->kelompokpasien,
                    'namarekanan' => $item->namarekanan,
                    'tglmasukinap' => $item->tglmasukinap,
                    'tglpulang' => $item->tglpulang,
                    'dokter' => $item->dokter,
                    'namakelas' => $item->namakelas,
                    'kddiagnosa' => $item->kddiagnosa,
                    'mutasi' => $item->mutasi,
                    'carakeluar' => $item->carakeluar,
                );
            }
        }

        $result = array(
            'data' => $data10,
            'message' => 'as@Ramdan',
        );

        return $this->respond($result);
    }
    public function getLaporanPasienPindahan(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $idDepRawatInap = (int) $this->settingDataFixed('idDepRawatInap', $kdProfile);
        $dataLogin = $request->all();
        $data = \DB::table('pasiendaftar_t as pd')
            ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->JOIN('registrasipelayananpasien_t as rpp', 'rpp.noregistrasifk', '=', 'pd.norec')
            ->JOIN('diagnosapasien_t as dp', 'dp.noregistrasifk', '=', 'apd.norec')
            ->leftJOIN('detaildiagnosapasien_t as ddp', 'ddp.noregistrasifk', '=', 'apd.norec')
            ->JOIN('diagnosa_m as d', 'd.id', '=', 'ddp.objectdiagnosafk')
            ->leftJOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftJOIN('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->leftJOIN('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJOIN('kelompokpasien_m as kps', 'kps.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftJOIN('rekanan_m as rek', 'rek.id', '=', 'pd.objectrekananfk')
            ->JOIN('kamar_m as km', 'km.id', '=', 'rpp.objectkamarfk')
            ->JOIN('kelas_m as kls', 'kls.id', '=', 'rpp.objectkelasfk')
            ->leftJOIN('tempattidur_m as tt', 'tt.id', '=', 'rpp.objecttempattidurfk')
            ->jOIN('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganasalfk')
            ->JOIN('ruangan_m as ruu', 'ruu.id', '=', 'pd.objectruanganlastfk')
            ->select(
                'pd.noregistrasi',
                'pd.tglregistrasi',
                'ps.nocm',
                'ps.namapasien',
                'kps.kelompokpasien',
                'rek.namarekanan',
                'jk.jeniskelamin',
                'kls.namakelas',
                'km.namakamar',
                'd.kddiagnosa',
                'd.namadiagnosa',
                'ru.namaruangan as ruanganasal',
                'ruu.namaruangan as ruangansekarang',
                'tt.nomorbed as nobed',
                'pd.objectstatuskeluarfk',
                'rpp.tglmasuk as tglmasukinap',
                DB::raw(
                    'pg.namalengkap as dokter,
                   case when pd.tglpulang is not null then \'Dipulangkan\' else \'Masih Dirawat\' end as status,
                   case when ruu.id=pd.objectruanganlastfk  then \'Pindahan\' else null end as mutasi'
                )
            )
            ->where('pd.kdprofile', $kdProfile)
            ->Where('ru.objectdepartemenfk', '=', $idDepRawatInap)
            ->whereRaw('ru.id <> ruu.id');

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir']; //." 23:59:59";
            $data = $data->where('pd.tglregistrasi', '<=', $tgl);
        }
        if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
            $data = $data->where('ruu.objectdepartemenfk', '=', $request['idDept']);
        }
        if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
            $data = $data->where('ruu.id', '=', $request['idRuangan']);
        }
        if (isset($request['idKelas']) && $request['idKelas'] != "" && $request['idKelas'] != "undefined") {
            $data = $data->where('kls.id', '=', $request['idKelas']);
        }

        $data = $data->distinct();
        $data = $data->get();
        $data10 = [];
        $sama = false;

        foreach ($data as $item) {
            $sama = false;
            $i = 0;
            foreach ($data10 as $hideung) {
                if ($item->noregistrasi == $data10[$i]['noregistrasi']) {
                    $sama = true;
                    $data10[$i]['kddiagnosa'] = $data10[$i]['kddiagnosa'] . ', ' . ($item->kddiagnosa);
                }
                $i = $i + 1;
            }
            if ($sama == false) {
                $data10[] = array(
                    'noregistrasi' => $item->noregistrasi,
                    'namapasien' => $item->namapasien,
                    'nocm' => $item->nocm,
                    'namakamar' => $item->namakamar,
                    'nobed' => $item->nobed,
                    'ruanganasal' => $item->ruanganasal,
                    'ruangansekarang' => $item->ruangansekarang,
                    'kelompokpasien' => $item->kelompokpasien,
                    'namarekanan' => $item->namarekanan,
                    'tglmasukinap' => $item->tglmasukinap,
                    'dokter' => $item->dokter,
                    'namakelas' => $item->namakelas,
                    'status' => $item->status,
                    'kddiagnosa' => $item->kddiagnosa,
                    'mutasi' => $item->mutasi,
                );
            }
        }

        $result = array(
            'data' => $data10,
            'message' => 'as@Ramdan',
        );

        return $this->respond($result);
    }

    public static function getGrafikBarberJohnson(Request $request)
    {

        //$idProfile = (int) $this->getDataKdProfile($request);
        $tglAwal = $request['tglAwal'] . ' 00:00';
        $tglAkhir = $request['tglAkhir'] . ' 23:59';
        $tahun = date('Y');
        $sehari = 1; //$interval->format('%d');
        $data10 = [];

        $tanggalmin = DB::select(DB::raw("
            select min(d::date) as tglmin
            from generate_series('$tglAwal', '$tglAwal'::date + INTERVAL '1 MONTH - 1 day', '1 day'::interval) d
        "));

        $tanggalmax = DB::select(DB::raw("
            select min(d::date) as tglmax
            from generate_series('$tglAkhir', '$tglAkhir'::date + INTERVAL '1 MONTH - 1 day', '1 day'::interval) d
        "));

        $monthtahunmonth = (int) date('m', strtotime($tglAwal));
        $yeartahunmonth = (int) date('Y', strtotime($tglAwal));


        $tahunmonthq = DB::select(DB::raw("select to_char(daterange::date, 'YYYY-mm') as tahun
        from generate_series('$yeartahunmonth-$monthtahunmonth-01'::date, '$tglAkhir'::date, '1 month') as daterange"));

        $arrmin = [];
        foreach ($tanggalmin as $rowmin) {
            $arrmin[] =  $rowmin->tglmin;
        }
        $arrmax = [];
        foreach ($tanggalmax as $rowmax) {
            $arrmax[] =  $rowmax->tglmax;
        }


        $tanggalminawal = DB::select(DB::raw("select '$arrmin[0] 23:59:59'::timestamp - interval '1 day ' as tgl"));

        $arrminawal = [];
        foreach ($tanggalminawal as $rowminawal) {
            $arrminawal[] =  $rowminawal->tgl;
        }

        $tanggalmaxawal = DB::select(DB::raw("select '$arrmax[0] 23:59:59'::timestamp - interval '1 day ' as tgl"));

        $arrmaxawal = [];
        foreach ($tanggalmaxawal as $rowmaxawal) {
            $arrmaxawal[] =  $rowmaxawal->tgl;
        }



        $dataKemarin = DB::select(DB::raw("select (tgl::date + interval '1 day')::date as tgl, sum(jumlah) as jumlah from(
                (select tgl as tgl,jumlah from (select tgl, case when jumlah is null then 0 else sum(jumlah) end as jumlah from(
                    with cte as(
                    select d as tgl
                    from generate_series('$arrminawal[0]', '$arrmaxawal[0]'::timestamp + INTERVAL '0 day', '1 day'::interval) d
                    )
                    select * FROM
                    cte
                    left join(
                    select noregistrasi, norec, tgl as tglapd, jumlah, tglpulang, tglkeluar, ruanganasal, ruangantujuan from (select pd.noregistrasi, apd.norec, apd.tglmasuk as tgl, pd.tglpulang, apd.tglkeluar, count(apd.tglmasuk) as jumlah, ru1.namaruangan ruanganasal, ru.namaruangan ruangantujuan
                    FROM pasiendaftar_t as pd
                    INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                    INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk = 16
                    inner JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk <> 16
                    where pd.kdprofile = 30
                    and pd.statusenabled = true
                    group by apd.tglmasuk, apd.tglkeluar, pd.tglpulang, pd.noregistrasi, apd.norec, ru.namaruangan, ru1.namaruangan
                    ) as x
                                    
                    UNION ALL
                                    
                    select noregistrasi, norec, tgl as tglapd, jumlah, tglpulang, tglkeluar, ruanganasal, ruangantujuan from (select pd.noregistrasi, apd.norec, apd.tglmasuk as tgl, pd.tglpulang, apd.tglkeluar, count(apd.tglmasuk) as jumlah, ru1.namaruangan ruanganasal, ru.namaruangan ruangantujuan
                    FROM pasiendaftar_t as pd
                    INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                    INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk = 16
                    inner JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk = 16
                    where pd.kdprofile = 30
                    and pd.statusenabled = true
                    group by apd.tglmasuk, apd.tglkeluar, pd.tglpulang, pd.noregistrasi, apd.norec, ru.namaruangan, ru1.namaruangan
                    ) as x
                    ) as y on cte.tgl between y.tglapd and coalesce(y.tglkeluar,now())
                ) as e
                group by e.tgl, e.jumlah
                order by e.tgl) as i)
            ) as f group by tgl"));

        //var_dump($dataKemarin);            

        $data = DB::select(DB::raw("
            select tgl, sum(jumlah) as jumlah from(
                select tgl, jumlah from (select apd.tglmasuk::date as tgl, count(apd.tglmasuk) as jumlah
                    FROM pasiendaftar_t as pd
                    INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                    INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk = 16
                    inner JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk <> 16
                    where pd.kdprofile = 30 
                    and pd.statusenabled = true
                    and cast(apd.tglmasuk as date) between '$tglAwal' and '$tglAkhir'
                    group by apd.tglmasuk::date
                ) as x
            ) as f group by tgl"));

        $dataPindah = DB::select(DB::raw("
            select tgl, sum(jumlah) as jumlah from(
                select tgl, jumlah from (select apd.tglmasuk::date as tgl, count(apd.tglmasuk) as jumlah
                    FROM pasiendaftar_t as pd
                    INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                    INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk = 16
                    INNER JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk = 16
                    where pd.kdprofile = 30 
                    and pd.statusenabled = true
                    and cast(apd.tglmasuk as date) between '$tglAwal' and '$tglAkhir' 
                    group by apd.tglmasuk::date
                ) as x
            ) as z group by tgl"));

        $dataDipindahkan = DB::select(DB::raw("
            select tgl, sum(jumlah) as jumlah from(select tgl, jumlah from (
                select apd.tglkeluar::date as tgl, count(apd.tglkeluar) as jumlah
                    FROM pasiendaftar_t as pd
                    INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                    INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk = 16
                    INNER JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk = 16
                    where pd.kdprofile = 30 
                    and pd.statusenabled = true
                    and cast(apd.tglkeluar as date) between '$tglAwal' and '$tglAkhir' 
                    and apd.tglkeluar <> coalesce(pd.tglpulang,now())
                    and apd.tglkeluar > apd.tglmasuk
                    group by apd.tglkeluar::date
                ) as x
                
                union all
                
                select tgl, jumlah from (
                    select apd.tglkeluar::date as tgl, count(apd.tglkeluar) as jumlah
                    FROM pasiendaftar_t as pd
                    INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                    INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk and ru.objectdepartemenfk = 16
                    INNER JOIN ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk and ru1.objectdepartemenfk <> 16
                    where pd.kdprofile = 30 
                    and pd.statusenabled = true
                    and cast(apd.tglkeluar as date) between '$tglAwal' and '$tglAkhir' 
                    and apd.tglkeluar <> coalesce(pd.tglpulang,now())
                    and apd.tglkeluar > apd.tglmasuk
                    group by apd.tglkeluar::date
                ) as x
            ) as y group by tgl"));

        $dataPulang = DB::select(DB::raw("
            select max(apd.tglkeluar), pd.tglpulang::date as tgl, count(pd.tglpulang) as jumlah
                FROM pasiendaftar_t as pd
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                inner JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
                where pd.kdprofile = 30 and pd.statusenabled = true
                and cast(pd.tglpulang as date) between '$tglAwal' and '$tglAkhir'
                and pd.tglpulang = apd.tglkeluar
                and ru.objectdepartemenfk = 16
                and (pd.objectstatuspulangfk not in (2,3) or pd.objectstatuspulangfk is null)
                and apd.tglmasuk <> apd.tglkeluar
            group by pd.tglpulang::date"));

        $dataPulangAPS = DB::select(DB::raw("
            select pd.tglpulang::date as tgl, count(pm.namapasien) jumlah
                FROM pasiendaftar_t as pd
                INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
                INNER JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
                where pd.kdprofile = 30 and pd.statusenabled = true
                and cast(pd.tglpulang as date) between '$tglAwal' and '$tglAkhir'
                and pd.objectstatuspulangfk = 2
                and ru.objectdepartemenfk = 16
                and pd.tglpulang is not null
            group by pd.tglpulang::date"));

        $dataPulangMelarikanDiri = DB::select(DB::raw("
            select pd.tglpulang::date as tgl, count(pm.namapasien) jumlah
                FROM pasiendaftar_t as pd
                INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
                INNER JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
                where pd.kdprofile = 30 and pd.statusenabled = true
                and cast(pd.tglpulang as date) between '$tglAwal' and '$tglAkhir'
                and pd.objectstatuspulangfk = 3
                and ru.objectdepartemenfk = 16
                and pd.tglpulang is not null
            group by pd.tglpulang::date"));

        $lamadirawat = DB::select(DB::raw("
            select sum(y.totallama) as jumlah from(
                select x.tanggalpulang, sum(x.lamadirawat) as totallama from(
                with cte as (
                    select pdt.norec, min(apdt.tglmasuk::date) tglmasuk from pasiendaftar_t as pdt
                    inner join antrianpasiendiperiksa_t as apdt on apdt.noregistrasifk = pdt.norec
                    inner join ruangan_m as rum on rum.id = apdt.objectruanganfk
                    where rum.objectdepartemenfk = 16
                    and pdt.statusenabled = TRUE
                    and pdt.kdprofile = 30
                    and pdt.tglpulang::date between '$tglAwal' and '$tglAkhir'
                    group by pdt.norec
                )
                
                select pd.tglpulang::date as tanggalpulang, cte.tglmasuk as tanggalmasuk,
                case when pd.tglpulang::date-cte.tglmasuk::date = 0 then 1 else  (pd.tglpulang::date-cte.tglmasuk) end as lamadirawat
                    FROM pasiendaftar_t as pd
                    INNER JOIN cte on cte.norec = pd.norec
                    WHERE pd.kdprofile = 30 and pd.tglpulang is not null and cast(pd.tglpulang as date) between '$arrmin[0]' and '$arrmax[0]'
                    group by pd.tglpulang::date, pd.noregistrasi, cte.tglmasuk 
                    order by pd.tglpulang::date
                ) as x group by x.tanggalpulang
            ) as y"));

        $jumlahdays = DB::select(DB::raw("SELECT '$tglAkhir'::date - '$tglAwal'::date + 1 as jumlahhari"));
        //var_dump($jumlahdays[0]->jumlahhari);
        $jumlah = $jumlahdays[0]->jumlahhari;

        $jumlahttkalihari = 0;
        $jumlahgrandtotaltt = 0;
        $hari = 0;
        $hariawal = (int) date('d', strtotime($tglAwal));

        foreach ($tahunmonthq as $q) {
            //var_dump($jumlah);
            if ($jumlah >= 28) {
                if ($hariawal > 1) {
                    $hari = (cal_days_in_month(CAL_GREGORIAN, date('m', strtotime($q->tahun)), date('Y', strtotime($q->tahun))) - $hariawal + 1);
                    $jumlah -=  $hari;
                    $hariawal = 1;
                    //var_dump($jumlah);
                } else {
                    $hari = cal_days_in_month(CAL_GREGORIAN, date('m', strtotime($q->tahun)), date('Y', strtotime($q->tahun)));
                    $jumlah -= $hari;
                    $hari = cal_days_in_month(CAL_GREGORIAN, date('m', strtotime($q->tahun)), date('Y', strtotime($q->tahun)));
                    //($jumlah);
                }
            } else {
                $hari = $jumlah;
                //var_dump($jumlah);
            }
            //var_dump($hariawal);
            //var_dump($q);
            //var_dump($hari);

            $jumlahtt = DB::select(DB::raw("select '$q->tahun-$hari' as tanggal, sum(rm.jumlah_tt) as totalperperiode 
                    from riwayatkamar_m rm
                    inner join ruangan_m ru on ru.id = rm.objectruanganfk
                    inner join(
                        select objectruanganfk,objectkamarfk,max(tanggalawal) as tanggal from riwayatkamar_m 
                        where 
                        '$q->tahun-$hari 23:59:59' BETWEEN tanggalawal and COALESCE(tanggalakhir,'$q->tahun-$hari 23:59:59')
                        group by objectruanganfk,objectkamarfk
                    ) as x	
                    on rm.objectruanganfk=x.objectruanganfk and rm.objectkamarfk=x.objectkamarfk and rm.tanggalawal = x.tanggal
                    where rm.kdprofile = 30 and rm.statusenabled = true"));

            //var_dump($jumlahtt);

            $jumlahttkalihari += $hari * $jumlahtt[0]->totalperperiode;
            $jumlahgrandtotaltt += $jumlahtt[0]->totalperperiode;


            // var_dump($q->tahun);
            // var_dump($hari);
            // var_dump($jumlahtt[0]->totalperperiode);
            // var_dump($hari*$jumlahtt[0]->totalperperiode);
            // var_dump($hari*$jumlahtt[0]->totalperperiode);

        }

        $bor = 0;
        $alos = 0;
        $toi = 0;
        $bto = 0;
        $ndr = 0;
        $gdr = 0;
        $jumlahpasienpindah = 0;
        $jumlahpasienawal = 0;
        $jumlahpasienmasuk = 0;
        $jumlahpasiendipindahkan = 0;
        $jumlahpasienpulang = 0;
        $jumlahpindah = 0;
        $jumlahmasuk = 0;
        $jumlahhariperawatan = 0;
        $jumlahpulang = 0;
        $jumlahpasienpulangaps = 0;
        $jumlahpasienpulangmelarikandiri = 0;
        $jumlahtttotal = 0;
        $jumlahbortt = 0;
        $jumlahborhariperawatan = 0;
        $jumlahharidirawat = 0;
        $xbor = 0;
        $ybor = 0;
        $xbto = 0;
        $ybto = 0;
        $xtoi = 0;
        $yalos = 0;
        $periodegrafik = $jumlahdays[0]->jumlahhari;

        foreach ($dataKemarin as $awal) {
            $jumlahpasienawal += $awal->jumlah;
        }

        foreach ($data as $masuk) {
            $jumlahpasienmasuk += $masuk->jumlah;
        }

        foreach ($dataPindah as $pindah) {
            $jumlahpasienpindah += $pindah->jumlah;
        }

        foreach ($dataDipindahkan as $dipindah) {
            $jumlahpasiendipindahkan += $dipindah->jumlah;
        }

        foreach ($dataPulang as $pulang) {
            $jumlahpasienpulang += $pulang->jumlah;
        }

        foreach ($dataPulangAPS as $pulangaps) {
            $jumlahpasienpulangaps += $pulangaps->jumlah;
        }

        foreach ($dataPulangMelarikanDiri as $pulanglari) {
            $jumlahpasienpulangmelarikandiri += $pulanglari->jumlah;
        }

        foreach ($lamadirawat as $lama) {
            $jumlahharidirawat += $lama->jumlah;
        }

        $jumlahhariperawatantt = $jumlahpasienawal + $jumlahpasienmasuk + $jumlahpasienpindah;
        $jumlahpulang = $jumlahpasiendipindahkan + $jumlahpasienpulang + $jumlahpasienpulangaps + $jumlahpasienpulangmelarikandiri;

        if ($jumlahpulang == 0) {
            $bor = $jumlahhariperawatantt / $jumlahttkalihari * 100;
            $alos = 0;
            $toi = 0;
            $bto = $jumlahpulang / $jumlahgrandtotaltt;
        } else {
            $bor = $jumlahhariperawatantt / $jumlahttkalihari * 100;
            $alos = $jumlahharidirawat / $jumlahpulang;
            $toi = ($jumlahttkalihari - $jumlahhariperawatantt) / $jumlahpulang;
            $bto = $jumlahpulang / $jumlahgrandtotaltt;
        }

        // var_dump($periodegrafik);
        // var_dump($bto);

        $ybor = number_format($bor, 2) / 10;
        $xbor = 10 - (number_format($bor, 2) / 10);
        if ($bto > 0) {
            $xbto = $periodegrafik / number_format($bto, 2);
            $ybto = $periodegrafik / number_format($bto, 2);
        } else {
            $xbto = 0;
            $ybto = 0;
        }

        $xtoi = number_format($toi, 2);
        $yalos = number_format($alos, 2);

        $data10[] = array(
            'xbor' => (float) number_format($xbor, 2),
            'ybor' => (float) number_format($ybor, 2),
            'xbto' => (float) number_format($xbto, 2),
            'ybto' => (float)number_format($ybto, 2),
            'xtoi' => (float)number_format($xtoi, 2),
            'yalos' => (float) number_format($yalos, 2),
        );


        return $data10;
    }

    public function getDataRL11DataDasarRumahSakit(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tglAwal = $request['tglAwal'];

        $kolom1 = array("1. Nomor Kode RS", "2. Tanggal Registrasi", "3. Nama Rumah Sakit", "4. Jenis Rumah Sakit", "5. Kelas Rumah Sakit", "6. Nama Direktur RS", "7. Nama Penyelenggara RS", "Alamat / Lokasi RS", "a. Kab / Kota", "b. Kode Pos", "c. Telepon", "d. Fax", "e. E-mail", "f. No. Telp Bag Humas", "g. Website", "9. Luas Rumah Sakit", "a. Luas Tanah", "b. Luas Bangunan", "10. Surat Ijin / Penetapan", "a. Nomor", "b. Tanggal", "c. Oleh", "d. Sifat", "e. Masa berlaku s/d tahun", "11. Status Penyelenggara Swasta", "12. Akreditasi RS", "a. Pentahapan", "b. Status", "c. Tanggal Akreditasi", "13. Jumlah Pegawai", "Keterangan", "Tenaga Medis", "- Dokter Umum", "- Perawat", "- Analis Lab", "- Radiografer", "- Terapis", "- Psikolog", "- Dokter Spesialis Anak", "- Dokter Spesialis Jiwa", "- Dokter Spesialis Peny. Dalam", "- Dokter Spesialis Saraf", "- Dokter Spesialis Kulit dan Kelamnin", "Dokter Spesialis Radiologi", "Dokter Gigi", "Tenaga Non Kesehatan");
        $kolom2 = array(": 2022", " ", ": 3404022", ": 21-February-2013", ": RSJ. GRHASIA", ": RS JIWA / RSKO", ": A", ":", ": Pemda Tk I", ": Jln. Kaliurang KM 17, Pakembinangun, Pakem, Sleman, Prop. DIY. T", ": Sleman", ":", ": (0274) 895143, 895297", "(0274) 895142", "grhasia@jogjaprov.go.id", ":", ": grhasia.jogjaprov.go.id", ":", ": 0.00", ": 0.00", ":", ":", "21-February-2013", "GUBERNUR DIY", ":", ": 2025", ": -", ":", ":", ": Bintang 5 Paripurna", ": 20-May-2019", " ", "Jumlah", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ");
        $kolom4 = array(" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "13. Jumlah Tempat Tidur", "No.", "1", "2", "3", "4", "5", "6", "7", "8", " ");
        $kolom5 = array(" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "Nama Kelas", "Isoalasi", "Airbone", "Infeksi/TB", "Intensif", "VIP", "Kelas III", "Kelas II", "Kelas I", "Jumlah Total");

        $jumlahperkelas = DB::select(DB::raw("select sum(x.kelasvip) jumlahkelasvip, sum(x.kelassatu) jumlahkelassatu, sum(x.kelasdua) jumlahkelasdua, sum(x.kelastiga) jumlahkelastiga, sum(x.kelasisolasi) jumlahkelasisolasi, sum(x.kelasintensif) jumlahkelasintensif, sum(x.kelasairbone) jumlahkelasairbone, sum(x.kelasinfeksi) jumlahkelasinfeksi, sum(x.kelasvip) + sum(x.kelassatu) + sum(x.kelasdua) + sum(x.kelastiga) + sum(x.kelasisolasi) + sum(x.kelasairbone) + sum(x.kelasinfeksi) + sum(x.kelasintensif) totaltt from(
            select
						case when km.namakamar ilike '%isolasi%' and ks.id = 6 then sum(rm.jumlah_tt) else 0 end as kelasisolasi,
						case when km.namakamar ilike '%airbone%' and ks.id = 6 then sum(rm.jumlah_tt) else 0 end as kelasairbone,
						case when km.namakamar ilike '%infeksi/tb%' and ks.id = 6 then sum(rm.jumlah_tt) else 0 end as kelasinfeksi,
						case when km.namakamar ilike '%intensif%' and ks.id = 6 then sum(rm.jumlah_tt) else 0 end as kelasintensif,
            case when ks.id = 4 then sum(rm.jumlah_tt) else 0 end as kelasvip,
						case when ks.id = 1 then sum(rm.jumlah_tt) else 0 end as kelastiga,
						case when ks.id = 2 then sum(rm.jumlah_tt) else 0 end as kelasdua,
            case when ks.id = 3 then sum(rm.jumlah_tt) else 0 end as kelassatu
                from riwayatkamar_m rm
            inner join ruangan_m ru on ru.id = rm.objectruanganfk
            inner join kamar_m km on km.id = rm.objectkamarfk
            inner join kelas_m ks on ks.id = rm.objectkelasfk
            inner join(
                select objectruanganfk,objectkamarfk,max(tanggalawal) as tanggal 
                from riwayatkamar_m 
                where 
                '$tglAwal-01 23:59:59' BETWEEN tanggalawal and COALESCE(tanggalakhir,'$tglAwal-01 23:59:59')
                group by objectruanganfk,objectkamarfk
            ) as x	
            on rm.objectruanganfk=x.objectruanganfk 
            and rm.objectkamarfk=x.objectkamarfk 
            and rm.tanggalawal = x.tanggal
            and ks.id in (1, 2, 3, 4, 6)
            where rm.kdprofile = 30 
            and rm.statusenabled = true
            group by ks.id, km.namakamar) as x"));

        $kolom6 = array(" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "Jml TT", $jumlahperkelas[0]->jumlahkelasisolasi, $jumlahperkelas[0]->jumlahkelasairbone, $jumlahperkelas[0]->jumlahkelasinfeksi, $jumlahperkelas[0]->jumlahkelasintensif, $jumlahperkelas[0]->jumlahkelasvip, $jumlahperkelas[0]->jumlahkelastiga, $jumlahperkelas[0]->jumlahkelasdua, $jumlahperkelas[0]->jumlahkelassatu, $jumlahperkelas[0]->totaltt);
        //var_dump($jumlahperkelas);
        $data10[0] = array(
            'jumlahkolom1' => "TAHUN",
            'jumlahkolom2' => ": 2022",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => " ",
            'jumlahkolom4' => " ",
            'jumlahkolom5' => " ",
        );

        $data10[1] = array(
            'jumlahkolom1' => "RL 1.1 Data Dasar Rumah Sakit",
            'jumlahkolom2' => " ",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => " ",
            'jumlahkolom4' => " ",
            'jumlahkolom5' => " ",
        );

        $data10[2] = array(
            'jumlahkolom1' => "1. Nomor Kode RS",
            'jumlahkolom2' => ": 3404022",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => " ",
            'jumlahkolom4' => " ",
            'jumlahkolom5' => " ",
        );

        $data10[3] = array(
            'jumlahkolom1' => "2. Tanggal Registrasi",
            'jumlahkolom2' => ": 21-February-2013",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => " ",
            'jumlahkolom4' => " ",
            'jumlahkolom5' => " ",
        );

        $data10[4] = array(
            'jumlahkolom1' => "3. Nama Rumah Sakit",
            'jumlahkolom2' => ": RSJ. GRHASIA",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => " ",
            'jumlahkolom4' => " ",
            'jumlahkolom5' => " ",
        );

        $data10[5] = array(
            'jumlahkolom1' => "4. Jenis Rumah Sakit",
            'jumlahkolom2' => ": RS Jiwa / RSKO",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => " ",
            'jumlahkolom4' => " ",
            'jumlahkolom5' => " ",
        );

        $data10[6] = array(
            'jumlahkolom1' => "5. Kelas Rumah Sakit",
            'jumlahkolom2' => ": A",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => " ",
            'jumlahkolom4' => " ",
            'jumlahkolom5' => " ",
        );

        $data10[7] = array(
            'jumlahkolom1' => "6. Nama Direktur RS",
            'jumlahkolom2' => ": ",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => " ",
            'jumlahkolom4' => " ",
            'jumlahkolom5' => " ",
        );

        $data10[8] = array(
            'jumlahkolom1' => "7. Nama Penyelenggara RS",
            'jumlahkolom2' => ": Pemda Tk I",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => " ",
            'jumlahkolom4' => " ",
            'jumlahkolom5' => " ",
        );

        $data10[9] = array(
            'jumlahkolom1' => "8. Alamat / Lokasi RS",
            'jumlahkolom2' => ": Jln. Kaliurang Km 17, Pakembinangun, Pakem, Sleman, Prop. DIY. T",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => " ",
            'jumlahkolom4' => " ",
            'jumlahkolom5' => " ",
        );

        $data10[10] = array(
            'jumlahkolom1' => "a. Kab / Kota",
            'jumlahkolom2' => ": Sleman",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => " ",
            'jumlahkolom4' => " ",
            'jumlahkolom5' => " ",
        );

        $data10[11] = array(
            'jumlahkolom1' => "b. Kode Pos",
            'jumlahkolom2' => ": ",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => " ",
            'jumlahkolom4' => " ",
            'jumlahkolom5' => " ",
        );

        $data10[12] = array(
            'jumlahkolom1' => "c. Telepon",
            'jumlahkolom2' => ": (0274) 895143, 895297",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => " ",
            'jumlahkolom4' => " ",
            'jumlahkolom5' => " ",
        );

        $data10[13] = array(
            'jumlahkolom1' => "d. Fax",
            'jumlahkolom2' => ": (0274) 895142",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => " ",
            'jumlahkolom4' => " ",
            'jumlahkolom5' => " ",
        );

        $data10[14] = array(
            'jumlahkolom1' => "e. E-mail",
            'jumlahkolom2' => ": grhasia@jogjaprov.go.id",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => " ",
            'jumlahkolom4' => " ",
            'jumlahkolom5' => " ",
        );

        $data10[15] = array(
            'jumlahkolom1' => "f. No. Telp Bag. Humas",
            'jumlahkolom2' => ": ",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => " ",
            'jumlahkolom4' => " ",
            'jumlahkolom5' => " ",
        );

        $data10[16] = array(
            'jumlahkolom1' => "g. Website",
            'jumlahkolom2' => ":  grhasia.jogjaprov.go.id",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => " ",
            'jumlahkolom4' => " ",
            'jumlahkolom5' => " ",
        );

        $data10[17] = array(
            'jumlahkolom1' => "9. Luas Rumah Sakit",
            'jumlahkolom2' => ":  ",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => " ",
            'jumlahkolom4' => " ",
            'jumlahkolom5' => " ",
        );

        $data10[18] = array(
            'jumlahkolom1' => "a. Luas Tanah",
            'jumlahkolom2' => ": 0.00",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => " ",
            'jumlahkolom4' => " ",
            'jumlahkolom5' => " ",
        );

        $data10[19] = array(
            'jumlahkolom1' => "b. Luas Bangunan",
            'jumlahkolom2' => ": 0.00",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => " ",
            'jumlahkolom4' => " ",
            'jumlahkolom5' => " ",
        );

        $data10[20] = array(
            'jumlahkolom1' => "10. Surat Ijin / Penetapan",
            'jumlahkolom2' => ": ",
            'jumlahkolom6' => " ",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => " ",
            'jumlahkolom4' => " ",
            'jumlahkolom5' => " ",
        );

        $data10[21] = array(
            'jumlahkolom1' => "a. Nomor",
            'jumlahkolom2' => ": ",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => " ",
            'jumlahkolom4' => " ",
            'jumlahkolom5' => " ",
        );

        $data10[22] = array(
            'jumlahkolom1' => "b. Tanggal",
            'jumlahkolom2' => ": 21-February-2013",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => " ",
            'jumlahkolom4' => " ",
            'jumlahkolom5' => " ",
        );

        $data10[23] = array(
            'jumlahkolom1' => "c. Oleh",
            'jumlahkolom2' => ": GUBERNUR DIY",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => " ",
            'jumlahkolom4' => " ",
            'jumlahkolom5' => " ",
        );

        $data10[24] = array(
            'jumlahkolom1' => "d. Sifat",
            'jumlahkolom2' => ": ",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => " ",
            'jumlahkolom4' => " ",
            'jumlahkolom5' => " ",
        );

        $data10[25] = array(
            'jumlahkolom1' => "e. Masa berlaku s/d tahun",
            'jumlahkolom2' => ": 2025",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => " ",
            'jumlahkolom4' => " ",
            'jumlahkolom5' => " ",
        );

        $data10[26] = array(
            'jumlahkolom1' => "11. Status Penyelenggara Swasta",
            'jumlahkolom2' => ": -",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => " ",
            'jumlahkolom4' => " ",
            'jumlahkolom5' => " ",
        );

        $data10[27] = array(
            'jumlahkolom1' => "12. Akreditasi RS",
            'jumlahkolom2' => ": ",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => " ",
            'jumlahkolom4' => " ",
            'jumlahkolom5' => " ",
        );

        $data10[28] = array(
            'jumlahkolom1' => "a. Pentahapan",
            'jumlahkolom2' => ": ",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => " ",
            'jumlahkolom4' => " ",
            'jumlahkolom5' => " ",
        );

        $data10[29] = array(
            'jumlahkolom1' => "b. Status",
            'jumlahkolom2' => ": Bintang 5 Paripurna",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => " ",
            'jumlahkolom4' => " ",
            'jumlahkolom5' => " ",
        );

        $data10[30] = array(
            'jumlahkolom1' => "c. Tanggal Akreditas",
            'jumlahkolom2' => ": 20-May-2019",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => " ",
            'jumlahkolom4' => " ",
            'jumlahkolom5' => " ",
        );

        $data10[31] = array(
            'jumlahkolom1' => " ",
            'jumlahkolom2' => " ",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => " ",
            'jumlahkolom4' => " ",
            'jumlahkolom5' => " ",
        );

        $data10[32] = array(
            'jumlahkolom1' => "13. Jumlah Pegawai",
            'jumlahkolom2' => " ",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => " ",
            'jumlahkolom4' => "14. Jumlah Tempat Tidur",
            'jumlahkolom5' => " ",
        );

        $data10[33] = array(
            'jumlahkolom1' => "Keterangan",
            'jumlahkolom2' => "Jumlah",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => "No",
            'jumlahkolom4' => "Nama Kelas",
            'jumlahkolom5' => "Jml TT",
        );

        $data10[34] = array(
            'jumlahkolom1' => "Tenaga Medis",
            'jumlahkolom2' => " ",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => "1",
            'jumlahkolom4' => "Isolasi",
            'jumlahkolom5' => $jumlahperkelas[0]->jumlahkelasisolasi,
        );

        $data10[35] = array(
            'jumlahkolom1' => "- Dokter Umum",
            'jumlahkolom2' => " ",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => "2",
            'jumlahkolom4' => "Airbone",
            'jumlahkolom5' => $jumlahperkelas[0]->jumlahkelasairbone,
        );

        $data10[36] = array(
            'jumlahkolom1' => "- Perawat",
            'jumlahkolom2' => " ",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => "3",
            'jumlahkolom4' => "Infeksi/TB",
            'jumlahkolom5' => $jumlahperkelas[0]->jumlahkelasinfeksi,
        );

        $data10[37] = array(
            'jumlahkolom1' => "- Analis LAB",
            'jumlahkolom2' => " ",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => "4",
            'jumlahkolom4' => "Intensif",
            'jumlahkolom5' => $jumlahperkelas[0]->jumlahkelasintensif,
        );

        $data10[38] = array(
            'jumlahkolom1' => "- Radiografer",
            'jumlahkolom2' => " ",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => "5",
            'jumlahkolom4' => "VIP",
            'jumlahkolom5' => $jumlahperkelas[0]->jumlahkelasvip,
        );

        $data10[39] = array(
            'jumlahkolom1' => "- Terapis",
            'jumlahkolom2' => " ",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => "6",
            'jumlahkolom4' => "Kelas III",
            'jumlahkolom5' => $jumlahperkelas[0]->jumlahkelastiga,
        );

        $data10[40] = array(
            'jumlahkolom1' => "- Psikolog",
            'jumlahkolom2' => " ",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => "7",
            'jumlahkolom4' => "Kelas II",
            'jumlahkolom5' => $jumlahperkelas[0]->jumlahkelasdua,
        );

        $data10[41] = array(
            'jumlahkolom1' => "- Dokter Spesialis Anak",
            'jumlahkolom2' => " ",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => "8",
            'jumlahkolom4' => "Kelas I",
            'jumlahkolom5' => $jumlahperkelas[0]->jumlahkelassatu,
        );

        $data10[42] = array(
            'jumlahkolom1' => "- Dokter Spesialis Jiwa",
            'jumlahkolom2' => " ",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => " ",
            'jumlahkolom4' => "Jumlah total",
            'jumlahkolom5' => $jumlahperkelas[0]->totaltt,
        );

        $data10[43] = array(
            'jumlahkolom1' => "- Dokter Spesialis Peny. Dalam",
            'jumlahkolom2' => " ",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => " ",
            'jumlahkolom4' => " ",
            'jumlahkolom5' => " ",
        );

        $data10[44] = array(
            'jumlahkolom1' => "- Dokter Spesialis Saraf",
            'jumlahkolom2' => " ",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => " ",
            'jumlahkolom4' => " ",
            'jumlahkolom5' => " ",
        );

        $data10[45] = array(
            'jumlahkolom1' => "- Dokter Spesialis Kulit dan Kelamin",
            'jumlahkolom2' => " ",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => " ",
            'jumlahkolom4' => " ",
            'jumlahkolom5' => " ",
        );

        $data10[46] = array(
            'jumlahkolom1' => "- Dokter Spesialis Radiologi",
            'jumlahkolom2' => " ",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => " ",
            'jumlahkolom4' => " ",
            'jumlahkolom5' => " ",
        );

        $data10[47] = array(
            'jumlahkolom1' => "- Dokter Gigi",
            'jumlahkolom2' => " ",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => " ",
            'jumlahkolom4' => " ",
            'jumlahkolom5' => " ",
        );

        $data10[48] = array(
            'jumlahkolom1' => "Tenaga Non Kesehatan",
            'jumlahkolom2' => " ",
            'jumlahkolom6' => " ",
            'jumlahkolom3' => " ",
            'jumlahkolom4' => " ",
            'jumlahkolom5' => " ",
        );



        $result = array(
            'data' => $data10,
            'message' => 'as@cepot',
        );
        return $this->respond($result);
    }

    public function getDataRL31IndikatorPel(Request $request)
    {
        $idProfile = (int) $this->getDataKdProfile($request);
        $idDepRaJal = (int) $this->settingDataFixed('KdDepartemenRawatJalan', $idProfile);
        $idDepRanap = (int) $this->settingDataFixed('idDepRawatInap', $idProfile);
        $idStatKelMeninggal = (int) $this->settingDataFixed('KdStatKeluarMeninggal', $idProfile);
        $idKondisiPasienMeninggal = (int) $this->settingDataFixed('KdKondisiPasienMeninggal≥48', $idProfile);
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $tahun = new \DateTime($tglAkhir);
        $tahun = date('Y');
        $datetime1 = new \DateTime($tglAwal);
        $datetime2 = new \DateTime($tglAkhir);
        $interval = $datetime1->diff($datetime2);
        $sehari = 1; //$interval->format('%d');
        $data10 = [];

        // Menghitung jumlah tempat tidur per ruangan
        $jumlahTTPerRuangan = DB::select(DB::raw("
            SELECT 
                ru.id AS ruangan_id,
                ru.namaruangan AS namaruangan,
                COUNT(tt.id) AS jumlah_tempat_tidur
            FROM tempattidur_m AS tt
            INNER JOIN kamar_m AS kmr ON kmr.id = tt.objectkamarfk
            INNER JOIN ruangan_m AS ru ON ru.id = kmr.objectruanganfk
            WHERE tt.kdprofile = $idProfile
            AND tt.statusenabled = true
            AND kmr.statusenabled = true
            AND tt.reportdisplay NOT ILIKE '%cadangan%'
            and ru.statusenabled = true
            GROUP BY ru.id,ru.namaruangan
        "));

        // Jika tidak ada tempat tidur, kembalikan data kosong
        if (count($jumlahTTPerRuangan) == 0) {
            $data10[] = array(
                'lamarawat' => 0,
                'hariperawatan' => 0,
                'pasienpulang' => 0,
                'meninggal' => 0,
                'matilebih48' => 0,
                'tahun' => 0,
                'bulan' => date('d-M-Y'),
                'bor' => 0,
                'alos' => 0,
                'bto' => 0,
                'toi' => 0,
                'gdr' => 0,
                'ndr' => 0,
            );
            return $data10;
        }

        // Query untuk menghitung hari perawatan per ruangan
        $hariPerawatan = DB::select(DB::raw("
            SELECT 
                ru.id AS ruangan_id,
                 ru.namaruangan AS namaruangan,
                COUNT(pd.noregistrasi) AS jumlahhariperawatan
            FROM pasiendaftar_t AS pd
            INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
            WHERE ru.objectdepartemenfk in (16,35)
            AND pd.kdprofile = $idProfile
            AND pd.statusenabled = true
            and ru.statusenabled = true
            AND ( (pd.tglregistrasi < '$tglAwal' AND pd.tglpulang >= '$tglAkhir') OR pd.tglpulang IS NULL )
            GROUP BY ru.id,ru.namaruangan
        "));

        // Query untuk menghitung lama rawat dan pasien pulang per ruangan
        $lamaRawat = DB::select(DB::raw("
            SELECT 
                ru.id AS ruangan_id,
                ru.namaruangan AS namaruangan,
                SUM(DATE_PART('DAY', pd.tglpulang - pd.tglregistrasi)) AS lamarawat,
                COUNT(pd.noregistrasi) AS jumlahpasienpulang
            FROM pasiendaftar_t AS pd
            INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
            WHERE pd.kdprofile = $idProfile
            AND pd.tglpulang BETWEEN '$tglAwal' AND '$tglAkhir'
            AND pd.tglpulang IS NOT NULL
            AND pd.statusenabled = true
            AND ru.objectdepartemenfk in (16,35)
            and ru.statusenabled = true
            GROUP BY ru.id,ru.namaruangan 
        "));

        // Query untuk menghitung jumlah pasien meninggal dan lebih dari 48 jam per ruangan
        $dataMeninggal = DB::select(DB::raw("
            SELECT 
                ru.id AS ruangan_id,
                ru.namaruangan AS namaruangan,
                COUNT(x.noregistrasi) AS jumlahmeninggal,
                COUNT(CASE WHEN x.objectkondisipasienfk = $idKondisiPasienMeninggal THEN 1 END) AS jumlahlebih48
            FROM (
                SELECT 
                    pd.noregistrasi,
                    pd.objectruanganlastfk,
                    pd.objectkondisipasienfk
                FROM pasiendaftar_t AS pd
                INNER JOIN statuskeluar_m ON statuskeluar_m.id = pd.objectstatuskeluarfk
                LEFT JOIN kondisipasien_m ON kondisipasien_m.id = pd.objectkondisipasienfk
                WHERE pd.kdprofile = $idProfile
                AND pd.objectstatuskeluarfk = $idStatKelMeninggal
                AND pd.tglregistrasi BETWEEN '$tglAwal' AND '$tglAkhir'
                AND pd.statusenabled = true
            ) AS x
            INNER JOIN ruangan_m AS ru ON ru.id = x.objectruanganlastfk
            where ru.statusenabled = true
            GROUP BY ru.id,ru.namaruangan
        "));

        // Query untuk menghitung rata-rata per ruangan
        $ratarata = DB::select(DB::raw("
            WITH cte AS (
                SELECT 
                    EXTRACT(YEAR FROM month) AS year,
                    SUM(days) AS jumlah
                FROM (
                    SELECT 
                        DATE_TRUNC('month', dt) AS month,
                        COUNT(*) AS days
                    FROM GENERATE_SERIES(DATE '$tglAwal', DATE '$tglAkhir', INTERVAL '1 DAY') AS dt
                    GROUP BY DATE_TRUNC('month', dt)
                ) AS x
                GROUP BY EXTRACT(YEAR FROM month)
            )
            SELECT 
                ru.id AS ruangan_id,
                ru.namaruangan AS namaruangan,
                EXTRACT(YEAR FROM apd.tglmasuk) AS tgl,
                COUNT(apd.norec) AS jumlah,
                cte.jumlah,
                ROUND(COUNT(apd.norec) / cte.jumlah) AS total
            FROM antrianpasiendiperiksa_t AS apd
            INNER JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
            INNER JOIN cte ON cte.year = EXTRACT(YEAR FROM apd.tglmasuk)
            WHERE apd.tglmasuk BETWEEN '$tglAwal' AND '$tglAkhir'
            AND apd.kdprofile = $idProfile
            AND apd.statusenabled = true
            AND ru.objectdepartemenfk in (16,35)
            and ru.statusenabled = true
            GROUP BY ru.id,apd.tglmasuk,ru.namaruangan, cte.jumlah
        "));

        // Menghitung BOR, ALOS, dan TOI per ruangan
        foreach ($jumlahTTPerRuangan as $ruangan) {
            // Inisialisasi variabel dengan nilai default
            $bor = 0;
            $alos = 0;
            $toi = 0;
            $bto = 0;
            $gdr = 0;
            $ndr = 0;
            $jumlahTempatTidur = $ruangan->jumlah_tempat_tidur;

            // Inisialisasi data lainnya jika tidak ada
            $hariPerawatanJml = 0;
            $jumlahPasienPulang = 0;
            $lamaRawatJumlah = 0;
            $jumlahMeninggal = 0;
            $jumlahLebih48 = 0;

            foreach ($hariPerawatan as $hari) {
                if ($hari->ruangan_id == $ruangan->ruangan_id) {
                    $hariPerawatanJml = $hari->jumlahhariperawatan;
                }
            }

            foreach ($lamaRawat as $lama) {
                if ($lama->ruangan_id == $ruangan->ruangan_id) {
                    $jumlahPasienPulang = $lama->jumlahpasienpulang;
                    $lamaRawatJumlah = $lama->lamarawat;
                }
            }

            foreach ($dataMeninggal as $meninggal) {
                if ($meninggal->ruangan_id == $ruangan->ruangan_id) {
                    $jumlahMeninggal = $meninggal->jumlahmeninggal;
                    $jumlahLebih48 = $meninggal->jumlahlebih48;
                }
            }

            // Perhitungan jika ada pasien pulang
            if ($jumlahPasienPulang > 0) {
                $alos = $lamaRawatJumlah / $jumlahPasienPulang;
                $bto = $jumlahPasienPulang / $jumlahTempatTidur;
                $bor = ($hariPerawatanJml * 100) / ($jumlahTempatTidur * $sehari);
                $toi = (($jumlahTempatTidur * $sehari) - $hariPerawatanJml) / $jumlahPasienPulang;
                $gdr = ($jumlahMeninggal * 1000) / $jumlahPasienPulang;
                $ndr = ($jumlahLebih48 * 1000) / $jumlahPasienPulang;
            }

            $data10[] = array(
                'ruangan_id' => $ruangan->ruangan_id,
                'namaruangan' => $ruangan->namaruangan,
                'lamarawat' => $lamaRawatJumlah,
                'hariperawatan' => $hariPerawatanJml,
                'pasienpulang' => $jumlahPasienPulang,
                'meninggal' => $jumlahMeninggal,
                'matilebih48' => $jumlahLebih48,
                'bor' => number_format($bor, 2),
                'alos' => number_format($alos, 2),
                'bto' => number_format($bto, 2),
                'toi' => number_format($toi, 2),
                'gdr' => number_format($gdr, 2),
                'ndr' => number_format($ndr, 2),
            );
        }

        // Mengirimkan hasil
        $result = array(
            'data' => $data10,
            'message' => 'Success',
        );
        return $this->respond($result);
    }

    public function getDataRL32RawatInap(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $deptId = explode(',', $this->settingDataFixed('KdListDepartemen', $idProfile));
        $KdJenisLaporan = (int) $this->settingDataFixed('KdJenisLapRanap', $idProfile);
        $kdDepartemenRawatPelayanan = [];
        foreach ($deptId as $items) {
            $kdDepartemenRawatPelayanan[] =  (int)$items;
        }
        $data = DB::table('antrianpasiendiperiksa_t as app')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'app.noregistrasifk')
            ->join('asalrujukan_m as ar', 'ar.id', '=', 'app.objectasalrujukanfk')
            ->join('pasien_m as pm', 'pm.id', '=', 'pd.nocmfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'app.objectruanganfk')
            ->join('departemen_m as dpm', 'dpm.id', '=', 'ru.objectdepartemenfk')
            ->join('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'app.norec')
            // ->join('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->join('mapproduktolaporanrl_m as mprl', 'mprl.produkfk', '=', 'pp.produkfk')
            ->join('jenislaporan_m as jl', 'jl.id', '=', 'mprl.objectjenislaporanfk')
            ->join('kelompoklaporan_m as kl', 'kl.id', '=', 'mprl.objectkontenlaporanfk')
            ->join('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->join('kelas_m as kls', 'kls.id', '=', 'app.objectkelasfk')
            ->leftjoin('statuskeluar_m as sk', 'sk.id', '=', 'pd.objectstatuskeluarfk')
            ->join('jeniskelamin_m as jk', 'jk.id', '=', 'pm.objectjeniskelaminfk')
            ->select(
                'pd.tglregistrasi',
                'pm.nocm',
                'pd.noregistrasi',
                'pm.namapasien',
                'app.objectasalrujukanfk',
                'ar.asalrujukan',
                'ru.namaruangan',
                'dpm.namadepartemen',
                'pg.namalengkap',
                'pm.objectjeniskelaminfk',
                'ru.objectdepartemenfk',
                'pd.objectstatuskeluarfk as objectstatuskeluarfk',
                'pd.objectkelasfk as objectkelasfk',
                'kl.kelompoklaporan as jenis_spesialisasi',
                'jl.jenislaporan',
                // 'pr.id as produkfk',
                DB::raw(
                    "
                    CASE
                        WHEN pd.tglpulang IS NULL THEN
                        DATE_PART('day', now() - pd.tglregistrasi::timestamp)
                        ELSE
                        DATE_PART('day', pd.tglpulang::TIMESTAMP - pd.tglregistrasi::timestamp)
                        END AS lamadirawat,
                        to_char( pd.tglregistrasi,'MM') as bulanregistrasi,
                        to_char( pd.tglregistrasi,'DD') as hariregistrasi,
                        to_char( pd.tglregistrasi,'YYYY-MM-DD') as tglregistrasi"
                )

            )
            ->where('app.kdprofile', $idProfile)
            ->whereIn('dpm.id', $kdDepartemenRawatPelayanan)
            ->where('jl.id', $KdJenisLaporan);

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];
            $data = $data->where('pd.tglregistrasi', '<=', $tgl);
        }

        $data = $data->get();

        $data10 = [];
        $jml = 0;
        $sama = false;

        $pasienAwalBulan = 0;
        $pasienMasuk = 0;
        $pasienKeluarHidup = 0;
        $matilebih48jaml = 0;
        $matilebih48jamp = 0;
        $matikurang48jaml = 0;
        $matikurang48jamp = 0;
        $jumlahLamaDirawat = 0;
        $pasienAkhirBulan = 0;
        $jumlahHariDirawat = 0;
        $rincianVvip = 0;
        $rincianVip = 0;
        $rincianKel1 = 0;
        $rincianKel2 = 0;
        $rincianKel3 = 0;
        $rincianKelasKhusus = 0;
        $DiTerimaKembali = 0;


        foreach ($data as $item) {
            $sama = false;
            $i = 0;
            foreach ($data10 as $hideung) {
                if ($item->jenis_spesialisasi == $data10[$i]['jenis_spesialisasi']) {
                    $sama = true;
                    $jml = (float)$hideung['jumlah'] + 1;
                    $data10[$i]['jumlah'] = $jml;

                    if (date('d', strtotime($item->tglregistrasi)) == '01') {
                        $data10[$i]['pasienawalbulan'] = (float)$hideung['pasienawalbulan'] + 1;
                    } else if (date('d', strtotime($item->tglregistrasi)) == date('t', strtotime($item->tglregistrasi))) {
                        $data10[$i]['pasienakhirbulan'] = (float)$hideung['pasienakhirbulan'] + 1;
                    } else if ($item->objectdepartemenfk == 16 || $item->objectdepartemenfk == 25) {
                        $data10[$i]['pasienmasuk'] = (float)$hideung['pasienmasuk'] + 1;
                    } elseif ($item->objectstatuskeluarfk != 5) {
                        $data10[$i]['pasienkeluarhidup'] = (float)$hideung['pasienkeluarhidup'] + 1;
                    } elseif ($item->objectstatuskeluarfk == 5 && $item->lamadirawat < 48 && $item->objectjeniskelaminfk == 1) {
                        $data10[$i]['matikurang48jaml'] = (float)$hideung['matikurang48jaml'] + 1;
                    } elseif ($item->objectstatuskeluarfk == 5 && $item->lamadirawat < 48 && $item->objectjeniskelaminfk == 2) {
                        $data10[$i]['matikurang48jamp'] = (float)$hideung['matikurang48jamp'] + 1;
                    } elseif ($item->objectstatuskeluarfk == 5 && $item->lamadirawat > 48 && $item->objectjeniskelaminfk == 1) {
                        $data10[$i]['matilebih48jaml'] = (float)$hideung['matilebih48jaml'] + 1;
                    } elseif ($item->objectstatuskeluarfk == 5 && $item->lamadirawat > 48 && $item->objectjeniskelaminfk == 2) {
                        $data10[$i]['matilebih48jamp'] = (float)$hideung['matilebih48jamp'] + 1;
                    }

                    if ($item->objectkelasfk == 8) {
                        $data10[$i]['rincianvvip'] = (float)$hideung['rincianvvip'] + 1;
                    } elseif ($item->objectkelasfk == 4) {
                        $data10[$i]['rincianvip'] = (float)$hideung['rincianvip'] + 1;
                    } elseif ($item->objectkelasfk == 3) {
                        $data10[$i]['rinciankel1'] = (float)$hideung['rinciankel1'] + 1;
                    } elseif ($item->objectkelasfk == 2) {
                        $data10[$i]['rinciankel2'] = (float)$hideung['rinciankel2'] + 1;
                    } elseif ($item->objectkelasfk == 1) {
                        $data10[$i]['rinciankel3'] = (float)$hideung['rinciankel3'] + 1;
                    } elseif ($item->objectkelasfk == 6 && $item->objectkelasfk == 9) {
                        $data10[$i]['rinciankelaskhusus'] = (float)$hideung['rinciankelaskhusus'] + 1;
                    }
                }
                $i = $i + 1;
            }

            if ($sama == false) {
                if (date('d', strtotime($item->tglregistrasi)) == '01') {
                    $pasienAwalbulan = 1;
                    $pasienMasuk = 0;
                    $pasienKeluarHidup = 0;
                    $matilebih48jaml = 0;
                    $matilebih48jamp = 0;
                    $matikurang48jaml = 0;
                    $matikurang48jamp = 0;
                    $jumlahLamaDirawat = 0;
                    $pasienAkhirbulan = 0;
                    $jumlahHariDirawat = 0;
                    $rincianVvip = 0;
                    $rincianVip = 0;
                    $rincianKel1 = 0;
                    $rincianKel2 = 0;
                    $rincianKel3 = 0;
                    $rincianKelasKhusus = 0;
                    $DiTerimaKembali = 0;
                } else if (date('d', strtotime($item->tglregistrasi)) == date('t', strtotime($item->tglregistrasi))) {
                    $pasienAwalbulan = 0;
                    $pasienMasuk = 0;
                    $pasienKeluarHidup = 0;
                    $matilebih48jaml = 0;
                    $matilebih48jamp = 0;
                    $matikurang48jaml = 0;
                    $matikurang48jamp = 0;
                    $jumlahLamaDirawat = 0;
                    $pasienAkhirbulan = 1;
                    $jumlahHariDirawat = 0;
                    $rincianVvip = 0;
                    $rincianVip = 0;
                    $rincianKel1 = 0;
                    $rincianKel2 = 0;
                    $rincianKel3 = 0;
                    $rincianKelasKhusus = 0;
                    $DiTerimaKembali = 0;
                } else if ($item->objectdepartemenfk == 16 || $item->objectdepartemenfk == 25) {
                    $pasienAwalbulan = 0;
                    $pasienMasuk = 1;
                    $pasienKeluarHidup = 0;
                    $matilebih48jaml = 0;
                    $matilebih48jamp = 0;
                    $matikurang48jaml = 0;
                    $matikurang48jamp = 0;
                    $jumlahLamaDirawat = 0;
                    $pasienAkhirbulan = 0;
                    $jumlahHariDirawat = 0;
                    $rincianVvip = 0;
                    $rincianVip = 0;
                    $rincianKel1 = 0;
                    $rincianKel2 = 0;
                    $rincianKel3 = 0;
                    $rincianKelasKhusus = 0;
                    $DiTerimaKembali = 0;
                } elseif ($item->objectstatuskeluarfk != 5) {
                    $pasienAwalbulan = 0;
                    $pasienMasuk = 0;
                    $pasienKeluarHidup = 1;
                    $matilebih48jaml = 0;
                    $matilebih48jamp = 0;
                    $matikurang48jaml = 0;
                    $matikurang48jamp = 0;
                    $jumlahLamaDirawat = 0;
                    $pasienAkhirbulan = 0;
                    $jumlahHariDirawat = 0;
                    $rincianVvip = 0;
                    $rincianVip = 0;
                    $rincianKel1 = 0;
                    $rincianKel2 = 0;
                    $rincianKel3 = 0;
                    $rincianKelasKhusus = 0;
                    $DiTerimaKembali = 0;
                } elseif ($item->objectstatuskeluarfk == 5 && $item->lamadirawat < 48 && $item->objectjeniskelaminfk == 1) {
                    $pasienAwalbulan = 0;
                    $pasienMasuk = 0;
                    $pasienKeluarHidup = 0;
                    $matilebih48jaml = 0;
                    $matilebih48jamp = 0;
                    $matikurang48jaml = 1;
                    $matikurang48jamp = 0;
                    $jumlahLamaDirawat = 0;
                    $pasienAkhirbulan = 0;
                    $jumlahHariDirawat = 0;
                    $rincianVvip = 0;
                    $rincianVip = 0;
                    $rincianKel1 = 0;
                    $rincianKel2 = 0;
                    $rincianKel3 = 0;
                    $rincianKelasKhusus = 0;
                    $DiTerimaKembali = 0;
                } elseif ($item->objectstatuskeluarfk == 5 && $item->lamadirawat < 48 && $item->objectjeniskelaminfk == 2) {
                    $pasienAwalbulan = 0;
                    $pasienMasuk = 0;
                    $pasienKeluarHidup = 0;
                    $matilebih48jaml = 0;
                    $matilebih48jamp = 0;
                    $matikurang48jaml = 0;
                    $matikurang48jamp = 1;
                    $jumlahLamaDirawat = 0;
                    $pasienAkhirbulan = 0;
                    $jumlahHariDirawat = 0;
                    $rincianVvip = 0;
                    $rincianVip = 0;
                    $rincianKel1 = 0;
                    $rincianKel2 = 0;
                    $rincianKel3 = 0;
                    $rincianKelasKhusus = 0;
                    $DiTerimaKembali = 0;
                } elseif ($item->objectstatuskeluarfk == 5 && $item->lamadirawat > 48 && $item->objectjeniskelaminfk == 1) {
                    $pasienAwalbulan = 0;
                    $pasienMasuk = 0;
                    $pasienKeluarHidup = 0;
                    $matilebih48jaml = 1;
                    $matilebih48jamp = 0;
                    $matikurang48jaml = 0;
                    $matikurang48jamp = 0;
                    $jumlahLamaDirawat = 0;
                    $pasienAkhirbulan = 0;
                    $jumlahHariDirawat = 0;
                    $rincianVvip = 0;
                    $rincianVip = 0;
                    $rincianKel1 = 0;
                    $rincianKel2 = 0;
                    $rincianKel3 = 0;
                    $rincianKelasKhusus = 0;
                    $DiTerimaKembali = 0;
                } elseif ($item->objectstatuskeluarfk == 5 && $item->lamadirawat > 48 && $item->objectjeniskelaminfk == 2) {
                    $pasienAwalbulan = 0;
                    $pasienMasuk = 0;
                    $pasienKeluarHidup = 0;
                    $matilebih48jaml = 0;
                    $matilebih48jamp = 1;
                    $matikurang48jaml = 0;
                    $matikurang48jamp = 0;
                    $jumlahLamaDirawat = 0;
                    $pasienAkhirbulan = 0;
                    $jumlahHariDirawat = 0;
                    $rincianVvip = 0;
                    $rincianVip = 0;
                    $rincianKel1 = 0;
                    $rincianKel2 = 0;
                    $rincianKel3 = 0;
                    $rincianKelasKhusus = 0;
                    $DiTerimaKembali = 0;
                }
                if ($item->objectkelasfk == 8) {
                    $pasienAwalbulan = 0;
                    $pasienMasuk = 0;
                    $pasienKeluarHidup = 0;
                    $matilebih48jaml = 0;
                    $matilebih48jamp = 0;
                    $matikurang48jaml = 0;
                    $matikurang48jamp = 0;
                    $jumlahLamaDirawat = 0;
                    $pasienAkhirbulan = 0;
                    $jumlahHariDirawat = 0;
                    $rincianVvip = 1;
                    $rincianVip = 0;
                    $rincianKel1 = 0;
                    $rincianKel2 = 0;
                    $rincianKel3 = 0;
                    $rincianKelasKhusus = 0;
                    $DiTerimaKembali = 0;
                } elseif ($item->objectkelasfk == 5) {
                    $pasienAwalbulan = 0;
                    $pasienMasuk = 0;
                    $pasienKeluarHidup = 0;
                    $matilebih48jaml = 0;
                    $matilebih48jamp = 0;
                    $matikurang48jaml = 0;
                    $matikurang48jamp = 0;
                    $jumlahLamaDirawat = 0;
                    $pasienAkhirbulan = 0;
                    $jumlahHariDirawat = 0;
                    $rincianVvip = 0;
                    $rincianVip = 1;
                    $rincianKel1 = 0;
                    $rincianKel2 = 0;
                    $rincianKel3 = 0;
                    $rincianKelasKhusus = 0;
                    $DiTerimaKembali = 0;
                } elseif ($item->objectkelasfk == 3) {
                    $pasienAwalbulan = 0;
                    $pasienMasuk = 0;
                    $pasienKeluarHidup = 0;
                    $matilebih48jaml = 0;
                    $matilebih48jamp = 0;
                    $matikurang48jaml = 0;
                    $matikurang48jamp = 0;
                    $jumlahLamaDirawat = 0;
                    $pasienAkhirbulan = 0;
                    $jumlahHariDirawat = 0;
                    $rincianVvip = 0;
                    $rincianVip = 0;
                    $rincianKel1 = 1;
                    $rincianKel2 = 0;
                    $rincianKel3 = 0;
                    $rincianKelasKhusus = 0;
                    $DiTerimaKembali = 0;
                } elseif ($item->objectkelasfk == 2) {
                    $pasienAwalbulan = 0;
                    $pasienMasuk = 0;
                    $pasienKeluarHidup = 0;
                    $matilebih48jaml = 0;
                    $matilebih48jamp = 0;
                    $matikurang48jaml = 0;
                    $matikurang48jamp = 0;
                    $jumlahLamaDirawat = 0;
                    $pasienAkhirbulan = 0;
                    $jumlahHariDirawat = 0;
                    $rincianVvip = 0;
                    $rincianVip = 0;
                    $rincianKel1 = 0;
                    $rincianKel2 = 1;
                    $rincianKel3 = 0;
                    $rincianKelasKhusus = 0;
                    $DiTerimaKembali = 0;
                } elseif ($item->objectkelasfk == 1) {
                    $pasienAwalbulan = 0;
                    $pasienMasuk = 0;
                    $pasienKeluarHidup = 0;
                    $matilebih48jaml = 0;
                    $matilebih48jamp = 0;
                    $matikurang48jaml = 0;
                    $matikurang48jamp = 0;
                    $jumlahLamaDirawat = 0;
                    $pasienAkhirbulan = 0;
                    $jumlahHariDirawat = 0;
                    $rincianVvip = 0;
                    $rincianVip = 0;
                    $rincianKel1 = 0;
                    $rincianKel2 = 0;
                    $rincianKel3 = 1;
                    $rincianKelasKhusus = 0;
                    $DiTerimaKembali = 0;
                } elseif ($item->objectkelasfk == 6 && $item->objectkelasfk == 8) {
                    $pasienAwalbulan = 0;
                    $pasienMasuk = 0;
                    $pasienKeluarHidup = 0;
                    $matilebih48jaml = 0;
                    $matilebih48jamp = 0;
                    $matikurang48jaml = 0;
                    $matikurang48jamp = 0;
                    $jumlahLamaDirawat = 0;
                    $pasienAkhirbulan = 0;
                    $jumlahHariDirawat = 0;
                    $rincianVvip = 0;
                    $rincianVip = 0;
                    $rincianKel1 = 0;
                    $rincianKel2 = 0;
                    $rincianKel3 = 0;
                    $rincianKelasKhusus = 1;
                    $DiTerimaKembali = 0;
                }

                $data10[] = array(
                    'jenis_spesialisasi' => $item->jenis_spesialisasi,
                    'pasienmasuk' => $pasienMasuk,
                    'lamadirawat' => $item->lamadirawat,
                    'pasienawalbulan' => $pasienAwalBulan,
                    'pasienakhirbulan' => $pasienAkhirBulan,
                    'pasienkeluarhidup' => $pasienKeluarHidup,
                    'matilebih48jaml' => $matilebih48jaml,
                    'matilebih48jamp' => $matilebih48jamp,
                    'matikurang48jaml' => $matikurang48jaml,
                    'matikurang48jamp' => $matikurang48jamp,
                    'jumlahlamadirawat' => $jumlahLamaDirawat,
                    // 'pasienakhirtahun' => $pasienAkhirTahun,
                    'jumlahharidirawat' => $jumlahHariDirawat,
                    'rincianvvip' => $rincianVvip,
                    'rincianvip' => $rincianVip,
                    'rinciankel1' => $rincianKel1,
                    'rinciankel2' => $rincianKel2,
                    'rinciankel3' => $rincianKel3,
                    'rinciankelaskhusus' => $rincianKelasKhusus,
                    'jumlah' => 1,
                );
            }

            foreach ($data10 as $key => $row) {
                $count[$key] = $row['jumlah'];
            }

            array_multisort($count, SORT_DESC, $data10);
        }

        $result = array(
            'data' => $data10,
            'message' => 'as@cepot',
        );

        return $this->respond($result);
    }

    public function getRL310Rujukan(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $KdJenisLapRujukan = (int) $this->settingDataFixed('KdJenisLapRujukan', $kdProfile);
        $data = \DB::table('antrianpasiendiperiksa_t as app')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'app.noregistrasifk')
            ->join('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'app.norec')
            ->join('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->join('mapproduktolaporanrl_m as mprl', 'mprl.produkfk', '=', 'pp.produkfk')
            ->join('jenislaporan_m as jl', 'jl.id', '=', 'mprl.objectjenislaporanfk')
            ->join('kelompoklaporan_m as kl', 'kl.id', '=', 'mprl.objectkontenlaporanfk')
            ->join('asalrujukan_m as ar', 'ar.id', '=', 'app.objectasalrujukanfk')
            ->join('pasien_m as pm', 'pm.id', '=', 'pd.nocmfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->join('departemen_m as dpm', 'dpm.id', '=', 'ru.objectdepartemenfk')
            ->join('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->join('jeniskelamin_m as jk', 'jk.id', '=', 'pm.objectjeniskelaminfk')
            ->leftJoin('statuspulang_m as splng', 'splng.id', '=', 'pd.objectstatuspulangfk')
            ->leftJoin('statuskeluar_m as sklr', 'sklr.id', '=', 'pd.objectstatuskeluarfk')
            ->select(
                'pd.tglregistrasi',
                'pm.nocm',
                'pd.noregistrasi',
                'pm.namapasien',
                'ar.asalrujukan',
                'ru.namaruangan',
                'dpm.namadepartemen',
                'pg.namalengkap',
                'splng.statuspulang',
                'sklr.statuskeluar',
                'kl.kelompoklaporan as jenis_spesialisasi',
                'app.objectasalrujukanfk',
                'pd.objectstatuspulangfk'
            )
            ->where('app.kdprofile', $kdProfile)
            ->where('jl.id', $KdJenisLapRujukan);

        if (!empty($request['tglAwal'])) {
            $data = $data->where('pd.tglregistrasi', '>=', $request['tglAwal']);
        }
        if (!empty($request['tglAkhir'])) {
            $data = $data->where('pd.tglregistrasi', '<=', $request['tglAkhir']);
        }

        $data = $data->get();
        $dataSummary = [];

        foreach ($data as $item) {
            $jenis = $item->jenis_spesialisasi;
            if (!isset($dataSummary[$jenis])) {
                $dataSummary[$jenis] = [
                    'jenis_spesialisasi' => $jenis,
                    'jumlah' => 0,
                    'dtgsendiri' => 0,
                    'puskesmas' => 0,
                    'hospital' => 0,
                    'klinik' => 0,
                    'PasienRujukan' => 0,
                    'DTrmaKembali' => 0,
                    'DKembalikanKRs' => 0,
                    'DKembalikanKPuskes' => 0,
                    'DKembalikanKKlinik' => 0,
                    'Total_masuk' => 0,
                    'Total_dkmbalikn' => 0,
                    'Total_drujuk' => 0
                ];
            }

            $dataSummary[$jenis]['jumlah']++;
            switch ($item->objectasalrujukanfk) {
                case 5:
                    $dataSummary[$jenis]['dtgsendiri']++;
                    break;
                case 1:
                    $dataSummary[$jenis]['puskesmas']++;
                    break;
                case 2:
                    $dataSummary[$jenis]['hospital']++;
                    break;
                case 3:
                    $dataSummary[$jenis]['klinik']++;
                    break;
                case 4:
                    $dataSummary[$jenis]['PasienRujukan']++;
                    break;
                case 6:
                    $dataSummary[$jenis]['DTrmaKembali']++;
                    break;
            }

            switch ($item->objectstatuspulangfk) {
                case 5:
                    $dataSummary[$jenis]['DKembalikanKRs']++;
                    break;
                case 10:
                    $dataSummary[$jenis]['DKembalikanKPuskes']++;
                    break;
                case 11:
                    $dataSummary[$jenis]['DKembalikanKKlinik']++;
                    break;
            }

            if (in_array($item->objectasalrujukanfk, [1, 2, 3])) {
                $dataSummary[$jenis]['Total_masuk']++;
            }
            if (in_array($item->objectstatuspulangfk, [5, 10, 11])) {
                $dataSummary[$jenis]['Total_dkmbalikn']++;
            }
            if (in_array($item->objectasalrujukanfk, [5, 4])) {
                $dataSummary[$jenis]['Total_drujuk']++;
            }
        }

        $data = array_values($dataSummary);

        $result = array(
            'data' => $data,
            'message' => 'maman',
        );
        return $this->respond($result);
    }

    public function getLaporanRL39Rad(Request $request)
    {
        $idProfile = (int) $this->getDataKdProfile($request);
        $dataLogin = $request->all();
        $KdJenisLapRadiologi = (int) $this->settingDataFixed('KdJenisLapRadiologi', $idProfile);

        //////With Mapping****
        $data = \DB::table('antrianpasiendiperiksa_t as apd')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('departemen_m as dpm', 'dpm.id', '=', 'ru.objectdepartemenfk')
            ->join('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->join('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->join('mapproduktolaporanrl_m as mpptrl', 'mpptrl.produkfk', '=', 'pr.id')
            ->join('kelompoklaporan_m as kl', 'kl.id', '=', 'mpptrl.objectkontenlaporanfk')
            ->join('jenislaporan_m as jl', 'jl.id', '=', 'mpptrl.objectjenislaporanfk')
            ->select(
                'jl.jenislaporan',
                'kl.kelompoklaporan',
                (DB::raw('COUNT(mpptrl.objectkontenlaporanfk) as jumlah')
                )
            )
            ->where('apd.kdprofile', $idProfile)
            ->where('jl.id', $KdJenisLapRadiologi)
            ->groupBy('mpptrl.objectkontenlaporanfk', 'jl.jenislaporan', 'kl.kelompoklaporan');

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pp.tglpelayanan', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];
            $data = $data->where('pp.tglpelayanan', '<=', $tgl);
        }

        $data = $data->get();
        $result = array(
            //  'data' => $data10,
            'data' => $data,
            'message' => 'er@epic',

        );

        return $this->respond($result);
    }

    public function getPengadaanObatRl(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $KdJenisLapFarmasi = (int) $this->settingDataFixed('KdJenisLapFarmasi', $kdProfile);
        //        $dataLogin = $request->all();
        //
        //        $data = \DB::table('produk_m as prd')
        //            ->join('stokprodukdetail_t as spd','spd.objectprodukfk','=','prd.id')
        //            ->join('ruangan_m as ru','ru.id','=','spd.objectruanganfk')
        //            ->join('departemen_m as dpm','dpm.id','=','ru.objectdepartemenfk')
        //
        //            ->select('prd.namaproduk', 'spd.qtyproduk','spd.objectruanganfk','ru.namaruangan','ru.objectdepartemenfk',
        //                'prd.id as idproduk', 'prd.isgeneric', 'spd.tglpelayanan',
        //
        ////            case when prd.isgeneric = true then 'Obat Generik(Formularium + Non Formularium)'
        //                DB::raw('(case when prd.objectstatusprodukfk = 1 and prd.isgeneric =\'f\' THEN \'Obat Non Generik Non Formularium\'
        //                          when prd.objectstatusprodukfk = 2 and prd.isgeneric =\'f\' THEN \'Obat Non Generik Formularium\'
        //                          else \'Obat Generik(Formularium + Non Formularium)\' end) as detailobat'
        //                )
        //            )
        //
        //            ->where('prd.objectdetailjenisprodukfk', 474);
        //
        //        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
        //            $data = $data->where('spd.tglpelayanan', '>=', $request['tglAwal']);
        //        }
        //        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
        //            $tgl = $request['tglAkhir'];
        //            $data = $data->where('spd.tglpelayanan', '<=', $tgl);
        //        }
        //        $data = $data->get();
        //
        //        $data10 = [];
        //        $jml = 0;
        //        $sama = false;
        //
        //        $JmlGenerik = 0;
        //        $stokFormula = 0;
        //        $stokObat =0;
        //
        //        foreach ($data as $item) {
        //            $sama = false;
        //            $i = 0;
        //            foreach ($data10 as $hideung) {
        //                if ($item->detailobat == $data10[$i]['detailobat']) {
        //                    $sama = true;
        //                    $jml = (float)$hideung['jumlah'] + 1;
        //                    $data10[$i]['jumlah'] = $jml;
        //
        //                    if ($item->isgeneric == true)
        //                    {
        //                        $data10[$i]['JmlGeneric'] = (float)$hideung['JmlGeneric'] + 1;
        //                    }
        //                    $data10[$i]['Total'] = (float)$hideung['Total'] + 1;
        //                    $data10[$i]['Totalitem'] = (float)$hideung['Total'] + $data10[$i]['JmlGeneric'];
        //
        //                }
        //                $i = $i + 1;
        //            }
        //
        //            if ($sama == false) {
        //
        //                if ($item->isgeneric == true)
        //                {
        //                    $JmlGenerik = 1;
        //                    $stokFormula = 0;
        //                    $stokObat =0;
        //                }
        //
        //                $data10[] = array(
        //                    'detailobat' => $item->detailobat,
        //                    'Total' => 1,
        //                    'JmlGeneric' => $JmlGenerik,
        //                    'Totalitem' => 1 + $JmlGenerik,
        //                    'jumlah' => 1,
        //                );
        //            }
        //
        //            foreach ($data10 as $key => $row) {
        //                $count[$key] = $row['jumlah'];
        //            }
        //
        //            array_multisort($count, SORT_DESC, $data10);
        //        }
        //
        //        $result = array(
        //            'data' => $data10,
        //            'message' => 'as@cepot',
        //        );
        //        return $this->respond($result);


        //    #with Mapping
        $data = \DB::table('produk_m as prd')
            ->join('stokprodukdetail_t as spd', 'spd.objectprodukfk', '=', 'prd.id')
            ->join('mapproduktolaporanrl_m as mprl', 'mprl.produkfk', '=', 'spd.objectprodukfk')
            ->join('jenislaporan_m as jl', 'jl.id', '=', 'mprl.objectjenislaporanfk')
            ->join('kelompoklaporan_m as kl', 'kl.id', '=', 'mprl.objectkontenlaporanfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'spd.objectruanganfk')
            ->join('departemen_m as dpm', 'dpm.id', '=', 'ru.objectdepartemenfk')
            ->select(
                'prd.namaproduk',
                'kl.kelompoklaporan as detailobat',
                DB::raw('count(prd.id) as jumlahitem,sum(spd.qtyproduk) as jumlahtersedia')
            )
            ->groupBy('prd.namaproduk', 'prd.id', 'kl.kelompoklaporan')
            ->where('prd.kdprofile', $kdProfile)
            ->where('jl.id', $KdJenisLapFarmasi);

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('spd.tglpelayanan', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];
            $data = $data->where('spd.tglpelayanan', '<=', $tgl);
        }
        $data = $data->get();

        $data10 = [];
        foreach ($data as $item) {
            $sama = false;
            $i = 0;
            foreach ($data10 as $hideung) {
                if ($item->detailobat == $data10[$i]['detailobat']) {
                    $sama = true;
                    $jml = (float)$hideung['jumlah'] + 1;
                    $data10[$i]['jumlah'] = $jml;
                }
                $i = $i + 1;
            }

            if ($sama == false) {

                $data10[] = array(
                    'detailobat' => $item->detailobat,
                    'jumlahtersedia' => $item->jumlahtersedia,
                    // 'jumlahfortersedia'=>0,
                    //                    'Total' => 1,
                    //                    'JmlGeneric' => $JmlGenerik,
                    //                    'Totalitem' => 1 + $JmlGenerik,
                    'jumlah' => 1,
                );
            }

            foreach ($data10 as $key => $row) {
                $count[$key] = $row['jumlah'];
            }
            array_multisort($count, SORT_DESC, $data10);
        }
        $result = array(
            'data' => $data10,
            'message' => 'as@lancelot',
        );
        return $this->respond($result);
    }

    public function getPelayananResepRl(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $KdJenisLapFarmasi = (int) $this->settingDataFixed('KdJenisLapFarmasi', $kdProfile);
        //        $dataLogin = $request->all();
        //
        //        $data = \DB::table('pasiendaftar_t as pd')
        //            ->join('antrianpasiendiperiksa_t as apd','apd.noregistrasifk','=','pd.norec')
        //            ->leftJoin('pelayananpasien_t as pp','pp.noregistrasifk','=','apd.norec')
        //            ->join('ruangan_m as ru','ru.id','=','apd.objectruanganfk')
        //            ->join('departemen_m as dpm','dpm.id','=','ru.objectdepartemenfk')
        //            ->join('produk_m as prd','prd.id','=','pp.produkfk')
        //            ->select('prd.namaproduk','apd.objectruanganfk','ru.namaruangan','ru.objectdepartemenfk',
        //                'prd.id as idproduk', 'prd.objectdetailjenisprodukfk',
        //
        //                DB::raw('(case when ru.objectdepartemenfk in (16, 17, 35, 26) then \'Rawat Inap\'
        //                        when ru.objectdepartemenfk in (18, 27, 3, 28) then \'Rawat Jalan\'
        //                        when prd.id = 24 then \'IGD\'
        //                        else null end) as deptpelayanan,
        //                        (case when prd.objectstatusprodukfk = 1 and prd.isgeneric =\'f\' THEN \'Obat Non Generik Non Formularium\'
        //                        when prd.objectstatusprodukfk = 2 and prd.isgeneric =\'f\' THEN \'Obat Non Generik Formularium\'
        //                        else \'Obat Generik(Formularium + Non Formularium)\' end) as detailobat'
        //                )
        //            )
        //
        //            ->where('prd.objectdetailjenisprodukfk', 474);
        //
        ////        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
        ////            $data = $data->where('pd.tglregistrasi', '>=', $request['tglAwal']);
        ////        }
        ////        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
        ////            $tgl = $request['tglAkhir'];
        ////            $data = $data->where('pd.tglregistrasi', '<=', $tgl);
        ////        }
        //        $data = $data->get();
        //
        //        $data10 = [];
        //        $jml = 0;
        //        $sama = false;
        //
        //        $JmlRajal = 0;
        //        $JmlRI = 0;
        //        $JmlIGD = 0;
        //
        //        foreach ($data as $item) {
        //            $sama = false;
        //            $i = 0;
        //            foreach ($data10 as $hideung) {
        //                if ($item->detailobat == $data10[$i]['detailobat']) {
        //                    $sama = true;
        //                    $jml = (float)$hideung['jumlah'] + 1;
        //                    $data10[$i]['jumlah'] = $jml;
        //
        //                    if ($item->deptpelayanan == 'Rawat Inap')
        //                    {
        //                        $data10[$i]['JmlRawatInap'] = (float)$hideung['JmlRawatInap'] + 1;
        //                    }
        //                    elseif ($item->deptpelayanan == 'Rawat Jalan')
        //                    {
        //                        $data10[$i]['Jmlrj'] = (float)$hideung['Jmlrj'] + 1;
        //                    }
        //                    elseif ($item->deptpelayanan == 'IGD')
        //                    {
        //                        $data10[$i]['JmlIGD'] = (float)$hideung['JmlIGD'] + 1;
        //                    }
        //                }
        //                $i = $i + 1;
        //            }
        //
        //            if ($sama == false) {
        //
        //                if ($item->deptpelayanan == 'Rawat Inap')
        //                {
        //                    $JmlRajal = 0;
        //                    $JmlRI = 1;
        //                    $JmlIGD = 0;
        //                }
        //                elseif ($item->deptpelayanan == 'Rawat Jalan')
        //                {
        //                    $JmlRajal = 1;
        //                    $JmlRI = 0;
        //                    $JmlIGD = 0;
        //                }
        //                elseif ($item->deptpelayanan == 'IGD')
        //                {
        //                    $JmlRajal = 0;
        //                    $JmlRI = 0;
        //                    $JmlIGD = 1;
        //                }
        //                $data10[] = array(
        //                    'detailobat' => $item->detailobat,
        //                    'JmlRawatInap' => $JmlRI,
        //                    'Jmlrj' => $JmlRajal,
        //                    'JmlIGD' => $JmlIGD,
        //                    'jumlah' => 1,
        //                );
        //            }
        //
        //            foreach ($data10 as $key => $row) {
        //                $count[$key] = $row['jumlah'];
        //            }
        //
        //            array_multisort($count, SORT_DESC, $data10);
        //        }
        //
        //        $result = array(
        //            'data' => $data10,
        //            'message' => 'as@cepot',
        //        );
        //        return $this->respond($result);

        //#WITH MAPPING
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->leftJoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->join('mapproduktolaporanrl_m as mprl', 'mprl.produkfk', '=', 'pp.produkfk')
            ->join('jenislaporan_m as jl', 'jl.id', '=', 'mprl.objectjenislaporanfk')
            ->join('kelompoklaporan_m as kl', 'kl.id', '=', 'mprl.objectkontenlaporanfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('departemen_m as dpm', 'dpm.id', '=', 'ru.objectdepartemenfk')
            ->join('produk_m as prd', 'prd.id', '=', 'pp.produkfk')
            ->select(
                'prd.namaproduk',
                'apd.objectruanganfk',
                'ru.namaruangan',
                'kl.kelompoklaporan as detailobat',
                'pp.tglpelayanan',
                DB::raw(
                    '(case when ru.objectdepartemenfk in (16, 17, 35, 26) then \'Rawat Inap\'
                        when ru.objectdepartemenfk in (18, 27, 3, 28) then \'Rawat Jalan\'
                        when ru.objectdepartemenfk = 24 then \'IGD\'
                        else null end) as deptpelayanan'
                )
            )
            ->where('pd.kdprofile', $kdProfile)
            ->where('jl.id', $KdJenisLapFarmasi);

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pp.tglpelayanan', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];
            $data = $data->where('pp.tglpelayanan', '<=', $tgl);
        }
        $data = $data->get();

        $data10 = [];
        $jml = 0;
        $sama = false;

        $JmlRajal = 0;
        $JmlRI = 0;
        $JmlIGD = 0;

        foreach ($data as $item) {
            $sama = false;
            $i = 0;
            foreach ($data10 as $hideung) {
                if ($item->detailobat == $data10[$i]['detailobat']) {
                    $sama = true;
                    $jml = (float)$hideung['jumlah'] + 1;
                    $data10[$i]['jumlah'] = $jml;

                    if ($item->deptpelayanan == 'Rawat Inap') {
                        $data10[$i]['JmlRawatInap'] = (float)$hideung['JmlRawatInap'] + 1;
                    } elseif ($item->deptpelayanan == 'Rawat Jalan') {
                        $data10[$i]['Jmlrj'] = (float)$hideung['Jmlrj'] + 1;
                    } elseif ($item->deptpelayanan == 'IGD') {
                        $data10[$i]['JmlIGD'] = (float)$hideung['JmlIGD'] + 1;
                    }
                }
                $i = $i + 1;
            }

            if ($sama == false) {

                if ($item->deptpelayanan == 'Rawat Inap') {
                    $JmlRajal = 0;
                    $JmlRI = 1;
                    $JmlIGD = 0;
                } elseif ($item->deptpelayanan == 'Rawat Jalan') {
                    $JmlRajal = 1;
                    $JmlRI = 0;
                    $JmlIGD = 0;
                } elseif ($item->deptpelayanan == 'IGD') {
                    $JmlRajal = 0;
                    $JmlRI = 0;
                    $JmlIGD = 1;
                }
                $data10[] = array(
                    'detailobat' => $item->detailobat,
                    //                    'namaruangan' => $item->namaruangan,
                    //                    'namaproduk' => $item->namaproduk,
                    //                    'tglpelayanan' => $item->tglpelayanan,
                    'JmlRawatInap' => $JmlRI,
                    'Jmlrj' => $JmlRajal,
                    'JmlIGD' => $JmlIGD,
                    'jumlah' => 1,
                );
            }

            foreach ($data10 as $key => $row) {
                $count[$key] = $row['jumlah'];
            }

            array_multisort($count, SORT_DESC, $data10);
        }

        $result = array(
            'data' => $data10,
            'message' => 'as@lancelot',
        );
        return $this->respond($result);
    }

    public function getKegiatanKesehatanGigidanMulutRl(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $KdJenisLapGigiMulut = (int) $this->settingDataFixed('KdJenisLapGigiMulut', $idProfile);
        $dataLogin = $request->all();
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '= ', 'apd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->join('detailjenisproduk_m as djp', 'djp.id', '=', 'pr.objectdetailjenisprodukfk')
            ->join('jenisproduk_m as jp', 'jp.id', '=', 'djp.objectjenisprodukfk')
            ->join('kelompokproduk_m as kp', 'kp.id', '=', 'jp.objectkelompokprodukfk')
            ->join('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
            ->join('mapproduktolaporanrl_m as mpptrl', 'mpptrl.produkfk', '=', 'pr.id')
            ->join('kelompoklaporan_m as kl', 'kl.id', '=', 'mpptrl.objectkontenlaporanfk')
            ->join('jenislaporan_m as jl', 'jl.id', '=', 'mpptrl.objectjenislaporanfk')
            ->select(
                'jl.jenislaporan',
                'kl.kelompoklaporan',
                (DB::raw('COUNT(mpptrl.objectkontenlaporanfk) as jumlah'))
                //            ->select('pp.norec','pr.id','pr.namaproduk',
                //                (DB::raw('case
                //                          when pr.id in (401790,401791,478,479)
                //                                    then \'Pencabutan Gigi Tetap\'
                //                          when pr.id in (15366,401789,402686,402692,15247,15364,15245,401796,477,502,15467)
                //                                    then \'Pencabutan Gigi Sulung\'
                //                          when pr.id in (401854,10003505,401855,493,493119,401548,402852,574,612)
                //                                    then \'Pembersihan karang gigi\'
                //                          when pp.produkfk in (401864,401862,401865,401861,401863,401866,401867,401868,494,495,496,497,498,499,532)
                //                                    then \'Tumpatan Gigi\'
                //                          when pp.produkfk in (15728,401872,523,401829,401830,402991,19856,19859,19851,402046,10012701,536,731)
                //                                    then \'Orthodonti\'
                //                          when pp.produkfk in (546,724,723,403077,401817)
                //                                    then \'Jacket/Bridge\'
                //			              else \'-\'
                //			              end as jeniskegiatan'))
            )
            ->where('pd.kdprofile', $idProfile)
            ->where('jl.id', $KdJenisLapGigiMulut)
            ->groupBy('mpptrl.objectkontenlaporanfk', 'jl.jenislaporan', 'kl.kelompoklaporan');
        //            ->where('ru.id', 4)
        //            ->whereNotIn('djp.objectjenisprodukfk',[97])
        //            ->wherein('kp.id', [1, 2, 3, 4, 8, 9, 10, 11, 13, 14])
        //            ->whereNull('sp.statusenabled');

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pp.tglpelayanan', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];
            $data = $data->where('pp.tglpelayanan', '<=', $tgl);
        }

        $data = $data->get();
        //        $data10 = [];
        //        $jml = 0;
        //        $jmlCentralLine = 0;
        //        $jmlKateterUrine = 0;
        //
        //        foreach ($data as $item) {
        //            $sama = false;
        //            $i = 0;
        //            foreach ($data10 as $dat) {
        //                if ($item->jeniskegiatan == $data10[$i]['jeniskegiatan']) {
        //                    $sama = true;
        //                    $jml = (float)$dat['jumlah'] + 1;
        //                    $data10[$i]['jumlah'] = $jml;
        //
        //                    $data10[$i]['Total'] = (float)$dat['Total'] + 1;
        //                }
        //                $i = $i + 1;
        //            }
        //            if ($sama == false) {
        //
        //                $data10[] = array(
        //                    'jeniskegiatan'=>$item->jeniskegiatan,
        //                    'Total' => 1,
        //                    'jumlah' => 1,
        //                );
        //            }
        //
        //            foreach ($data10 as $key => $row) {
        //                $count[$key] = $row['jumlah'];
        //            }
        //            array_multisort($count, SORT_DESC, $data10);
        //        }

        $result = array(
            //            'data' => $data10,
            'data' => $data,
            'message' => 'kabayan',
        );

        return $this->respond($result);
    }

    public function getLaporanRL312Pembedahan(Request $request)
    {
        $idProfile = (int) $this->getDataKdProfile($request);
        $KdJenisLapPembedahan = (int) $this->settingDataFixed('KdJenisLapPembedahan', $idProfile);
        //        $dataLogin = $request->all();
        $data = \DB::table('antrianpasiendiperiksa_t as apd')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('departemen_m as dpm', 'dpm.id', '=', 'ru.objectdepartemenfk')
            ->join('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->join('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->join('mapproduktolaporanrl_m as mprl', 'mprl.produkfk', '=', 'pp.produkfk')
            ->join('jenislaporan_m as jl', 'jl.id', '=', 'mprl.objectjenislaporanfk')
            ->join('kelompoklaporan_m as kl', 'kl.id', '=', 'mprl.objectkontenlaporanfk')
            ->join('detailjenisproduk_m as djp', 'djp.id', '=', 'pr.objectdetailjenisprodukfk')
            ->join('jenisproduk_m as jp', 'jp.id', '=', 'djp.objectjenisprodukfk')
            ->leftJoin('kelompokproduk_m as kp', 'kp.id', '=', 'jp.objectkelompokprodukfk')
            ->select(
                'pp.tglpelayanan',
                'pp.produkfk',
                'pr.namaproduk',
                'pr.objectdetailjenisprodukfk',
                'djp.detailjenisproduk',
                'kl.kelompoklaporan as spesialisasi'
            )
            ->where('apd.kdprofile', $idProfile)
            ->where('jl.id', $KdJenisLapPembedahan);
        //                DB::raw('(case when ru.id = 44 then \'Bedah\'
        //                                when ru.id in (18,3,45,464) then \'Obstetrik & Ginekologi\'
        //                                when ru.id =198 then \'Bedah Saraf\'
        //                                when ru.id =6 then \'THT\'
        //                                when ru.id =5 then \'Mata\'
        //                                when ru.id =7 then \'Kulit & Kelamin\'
        //                                when ru.id =4 then \'Gigi & Mulut\'
        //                                when ru.id =1 then \'Bedah Anak\'
        //                                when  ru.id=98 then \'Kardiovaskuler\'
        //                                when ru.id =13 then \'Bedah Orthopedi\'
        //                                when  ru.id= 35 then \'Thorax\'
        //                                when  ru.id =240 then \'Urologi\'
        //                                else \'Lain-lain\' end ) as spesialisasi')
        //            )
        //PEMATOKAN :(((((
        //            ->whereIn('ru.id', [44, 18, 3, 45, 464, 198, 6, 5, 7, 4, 1, 98, 13, 35, 240])
        //            ->wherein('pr.objectdetailjenisprodukfk', [62, 138, 429, 431, 428, 78, 139, 430, 432, 426, 51,
        //                427, 425, 433, 51, 427, 425, 433, 48, 140, 437, 434, 9, 52,
        //                141, 435, 41, 56, 146, 438, 45, 39, 61, 70, 77, 54, 424, 421,
        //                418, 66, 7, 64, 73, 47, 136, 423, 420, 417, 33, 143, 409, 412,
        //                411, 60, 63, 6, 410, 414, 408, 415, 413, 142, 411]);
        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pp.tglpelayanan', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];
            $data = $data->where('pp.tglpelayanan', '<=', $tgl);
        }

        $data = $data->get();

        $data10 = [];
        $jml = 0;
        $khusus = 0;
        $besar = 0;
        $sedang = 0;
        $kecil = 0;
        $lainnya = 0;

        $sama = false;


        foreach ($data as $item) {
            $sama = false;
            $i = 0;
            $o = 0;
            foreach ($data10 as $hideung) {
                if ($item->spesialisasi == $data10[$i]['spesialisasi']) {
                    $sama = true;
                    $jml = (float)$hideung['jumlah'] + 1;
                    $data10[$i]['jumlah'] = $jml;
                    if (
                        $item->objectdetailjenisprodukfk == 62 || $item->objectdetailjenisprodukfk == 78 || $item->objectdetailjenisprodukfk == 51
                        || $item->objectdetailjenisprodukfk == 138 || $item->objectdetailjenisprodukfk == 139 || $item->objectdetailjenisprodukfk == 427
                        || $item->objectdetailjenisprodukfk == 429 || $item->objectdetailjenisprodukfk == 430 || $item->objectdetailjenisprodukfk == 425
                        || $item->objectdetailjenisprodukfk == 431 || $item->objectdetailjenisprodukfk == 432 || $item->objectdetailjenisprodukfk == 433
                        || $item->objectdetailjenisprodukfk == 428 || $item->objectdetailjenisprodukfk == 426
                    ) {
                        $data10[$i]['besar'] = (float)$hideung['besar'] + 1;
                    } else if (
                        $item->objectdetailjenisprodukfk == 9 || $item->objectdetailjenisprodukfk == 41 || $item->objectdetailjenisprodukfk == 45
                        || $item->objectdetailjenisprodukfk == 48 || $item->objectdetailjenisprodukfk == 52 || $item->objectdetailjenisprodukfk == 56
                        || $item->objectdetailjenisprodukfk == 140 || $item->objectdetailjenisprodukfk == 141 || $item->objectdetailjenisprodukfk == 146
                        || $item->objectdetailjenisprodukfk == 437 || $item->objectdetailjenisprodukfk == 435 || $item->objectdetailjenisprodukfk == 438
                        || $item->objectdetailjenisprodukfk == 434
                    ) {
                        $data10[$i]['khusus'] = (float)$hideung['khusus'] + 1;
                    } else if (
                        $item->objectdetailjenisprodukfk == 26 || $item->objectdetailjenisprodukfk == 30 || $item->objectdetailjenisprodukfk == 33
                        || $item->objectdetailjenisprodukfk == 36 || $item->objectdetailjenisprodukfk == 39 || $item->objectdetailjenisprodukfk == 7
                        || $item->objectdetailjenisprodukfk == 43 || $item->objectdetailjenisprodukfk == 61 || $item->objectdetailjenisprodukfk == 64
                        || $item->objectdetailjenisprodukfk == 68 || $item->objectdetailjenisprodukfk == 70 || $item->objectdetailjenisprodukfk == 73
                        || $item->objectdetailjenisprodukfk == 76 || $item->objectdetailjenisprodukfk == 77 || $item->objectdetailjenisprodukfk == 47
                        || $item->objectdetailjenisprodukfk == 50 || $item->objectdetailjenisprodukfk == 54 || $item->objectdetailjenisprodukfk == 136
                        || $item->objectdetailjenisprodukfk == 137 || $item->objectdetailjenisprodukfk == 424 || $item->objectdetailjenisprodukfk == 423
                        || $item->objectdetailjenisprodukfk == 422 || $item->objectdetailjenisprodukfk == 421 || $item->objectdetailjenisprodukfk == 420
                        || $item->objectdetailjenisprodukfk == 419 || $item->objectdetailjenisprodukfk == 418 || $item->objectdetailjenisprodukfk == 417
                        || $item->objectdetailjenisprodukfk == 416 || $item->objectdetailjenisprodukfk == 66
                    ) {
                        $data10[$i]['sedang'] = (float)$hideung['sedang'] + 1;
                    } else if (
                        $item->objectdetailjenisprodukfk == 60 || $item->objectdetailjenisprodukfk == 63 || $item->objectdetailjenisprodukfk == 142
                        || $item->objectdetailjenisprodukfk == 143 || $item->objectdetailjenisprodukfk == 6 || $item->objectdetailjenisprodukfk == 408
                        || $item->objectdetailjenisprodukfk == 409 || $item->objectdetailjenisprodukfk == 410 || $item->objectdetailjenisprodukfk == 415
                        || $item->objectdetailjenisprodukfk == 412 || $item->objectdetailjenisprodukfk == 414 || $item->objectdetailjenisprodukfk == 413
                        || $item->objectdetailjenisprodukfk == 411
                    ) {
                        $data10[$i]['kecil'] = (float)$hideung['kecil'] + 1;
                    }
                    //                    else  {
                    //                        $data10[$i]['lainnya'] = (float)$hideung['lainnya'] + 1;
                    //                    }

                }
                $i = $i + 1;
            }

            if ($sama == false) {
                if (
                    $item->objectdetailjenisprodukfk == 62 || $item->objectdetailjenisprodukfk == 78 || $item->objectdetailjenisprodukfk == 51
                    || $item->objectdetailjenisprodukfk == 138 || $item->objectdetailjenisprodukfk == 139 || $item->objectdetailjenisprodukfk == 427
                    || $item->objectdetailjenisprodukfk == 429 || $item->objectdetailjenisprodukfk == 430 || $item->objectdetailjenisprodukfk == 425
                    || $item->objectdetailjenisprodukfk == 431 || $item->objectdetailjenisprodukfk == 432 || $item->objectdetailjenisprodukfk == 433
                    || $item->objectdetailjenisprodukfk == 428 || $item->objectdetailjenisprodukfk == 426
                ) {
                    $khusus = 0;
                    $besar = 1;
                    $sedang = 0;
                    $kecil = 0;
                    $lainnya = 0;
                } else if (
                    $item->objectdetailjenisprodukfk == 9 || $item->objectdetailjenisprodukfk == 41 || $item->objectdetailjenisprodukfk == 45
                    || $item->objectdetailjenisprodukfk == 48 || $item->objectdetailjenisprodukfk == 52 || $item->objectdetailjenisprodukfk == 56
                    || $item->objectdetailjenisprodukfk == 140 || $item->objectdetailjenisprodukfk == 141 || $item->objectdetailjenisprodukfk == 146
                    || $item->objectdetailjenisprodukfk == 437 || $item->objectdetailjenisprodukfk == 435 || $item->objectdetailjenisprodukfk == 438
                    || $item->objectdetailjenisprodukfk == 434
                ) {
                    $khusus = 1;
                    $besar = 0;
                    $sedang = 0;
                    $kecil = 0;
                    $lainnya = 0;
                } else if (
                    $item->objectdetailjenisprodukfk == 26 || $item->objectdetailjenisprodukfk == 30 || $item->objectdetailjenisprodukfk == 33
                    || $item->objectdetailjenisprodukfk == 36 || $item->objectdetailjenisprodukfk == 39 || $item->objectdetailjenisprodukfk == 7
                    || $item->objectdetailjenisprodukfk == 43 || $item->objectdetailjenisprodukfk == 61 || $item->objectdetailjenisprodukfk == 64
                    || $item->objectdetailjenisprodukfk == 68 || $item->objectdetailjenisprodukfk == 70 || $item->objectdetailjenisprodukfk == 73
                    || $item->objectdetailjenisprodukfk == 76 || $item->objectdetailjenisprodukfk == 77 || $item->objectdetailjenisprodukfk == 47
                    || $item->objectdetailjenisprodukfk == 50 || $item->objectdetailjenisprodukfk == 54 || $item->objectdetailjenisprodukfk == 136
                    || $item->objectdetailjenisprodukfk == 137 || $item->objectdetailjenisprodukfk == 424 || $item->objectdetailjenisprodukfk == 423
                    || $item->objectdetailjenisprodukfk == 422 || $item->objectdetailjenisprodukfk == 421 || $item->objectdetailjenisprodukfk == 420
                    || $item->objectdetailjenisprodukfk == 419 || $item->objectdetailjenisprodukfk == 418 || $item->objectdetailjenisprodukfk == 417
                    || $item->objectdetailjenisprodukfk == 416 || $item->objectdetailjenisprodukfk == 66
                ) {
                    $khusus = 0;
                    $besar = 0;
                    $sedang = 1;
                    $kecil = 0;
                    $lainnya = 0;
                } else if (
                    $item->objectdetailjenisprodukfk == 60 || $item->objectdetailjenisprodukfk == 63 || $item->objectdetailjenisprodukfk == 142
                    || $item->objectdetailjenisprodukfk == 143 || $item->objectdetailjenisprodukfk == 6 || $item->objectdetailjenisprodukfk == 408
                    || $item->objectdetailjenisprodukfk == 409 || $item->objectdetailjenisprodukfk == 410 || $item->objectdetailjenisprodukfk == 415
                    || $item->objectdetailjenisprodukfk == 412 || $item->objectdetailjenisprodukfk == 414 || $item->objectdetailjenisprodukfk == 413
                    || $item->objectdetailjenisprodukfk == 411
                ) {
                    $khusus = 0;
                    $besar = 0;
                    $sedang = 0;
                    $kecil = 1;
                    $lainnya = 0;
                }
                //                else{
                //                    $lainnya=1;
                //                }


                $data10[] = array(
                    //                    'produkfk' => $item->produkfk,
                    'spesialisasi' => $item->spesialisasi,
                    'jumlah' => 1,
                    'khusus' => $khusus,
                    'besar' => $besar,
                    'sedang' => $sedang,
                    'kecil' => $kecil,
                    //                    'lainnya' => $lainnya,
                );
            }

            foreach ($data10 as $key => $row) {
                $count[$key] = $row['jumlah'];
            }

            array_multisort($count, SORT_DESC, $data10);
        }
        $result = array(
            'data' => $data10,
            'message' => 'er@epic',

        );

        return $this->respond($result);
    }


    public function getLaporanRL33IGDnew(Request $request)
    {
        $kdProfile = (int)$this->getDataKdProfile($request);
        $tglAwal = isset($request['tglAwal']) && $request['tglAwal'] !== "" && $request['tglAwal'] !== "undefined"
            ? $request['tglAwal']
            : null;

        $tglAkhir = isset($request['tglAkhir']) && $request['tglAkhir'] !== "" && $request['tglAkhir'] !== "undefined"
            ? $request['tglAkhir']
            : null;

        $mapping_icd = [
            'Bedah di Instalasi Gawat Darurat' => [],
            'Kecelakaan lalu lintas darat' => ["V0", "V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8"],
            'Kecelakaan lalu lintas perairan' => ["V90", "V91", "V92", "V93", "V94"],
            'Kecelakaan lalu lintas udara' => ["V95", "V96", "V97"],
            'Bedah lainnya (non kecelakaan)' => ["T", "S", "D", "C", "X"],
            'Non Bedah' => [],
            'Kekerasan terhadap Perempuan (≥18 tahun)' => ["X85", "Y0"],
            'Kekerasan terhadap Anak (<18 tahun)' => ["X85", "Y0"],
            'Kekerasan lainnya' => ["Y1", "Y2", "Y3"],
            'Non bedah lainnya' => [],
            'Kebidanan' => ["O"],
            'Psikiatrik' => ["F"],
            'Bayi' => ["P"],
            'Anak' => ["Z00", "Z01", "Z02"],
            'Geriatri' => ["R54"]
        ];

        $mapIdRujukan = [1, 2, 3]; //id rujuk

        $dataPasien = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            // ->leftJoin('detaildiagnosapasien_t as ddp_masuk', function ($join) {
            // $join->on('ddp_masuk.noregistrasifk', '=', 'apd.norec')
            //         ->where('ddp_masuk.objectjenisdiagnosafk', '=', 5);
            // })
            // ->leftJoin('diagnosa_m as dg_masuk', 'dg_masuk.id', '=', 'ddp_masuk.objectdiagnosafk')

            ->LEFTJOIN('pemakaianasuransi_t AS pa_masuk', 'pa_masuk.noregistrasifk', '=', 'pd.norec')
            ->LEFTJOIN('diagnosa_m AS dg_masuk', 'dg_masuk.id', '=', 'pa_masuk.objectdiagnosafk')
            ->leftJoin('detaildiagnosapasien_t as ddp_keluar', function ($join) {
                $join->on('ddp_keluar.noregistrasifk', '=', 'apd.norec')
                    ->where('ddp_keluar.objectjenisdiagnosafk', '=', 1);
            })
            ->leftJoin('diagnosa_m as dg_keluar', 'dg_keluar.id', '=', 'ddp_keluar.objectdiagnosafk')
            ->select(
                'pd.norec',
                'pd.tglregistrasi',
                'dg_masuk.kddiagnosa as kddiagnosa_masuk',
                'dg_keluar.kddiagnosa as kddiagnosa_keluar',
                'apd.objectasalrujukanfk',
                'ps.objectjeniskelaminfk', //1 laki 2 pr
                'apd.tglkeluar',
                'pd.tglmeninggal',
                'pd.objectstatuskeluarfk',
                'pd.objectstatuspulangfk',
                'pd.objectruanganlastfk',
                'pd.objectruanganasalfk',
                \DB::raw("EXTRACT(YEAR FROM AGE(apd.tglregistrasi, ps.tgllahir)) as umur")
            )
            ->whereBetween('pd.tglregistrasi', [$tglAwal, $tglAkhir])
            ->where('pd.kdprofile', $kdProfile)
            ->where('pd.statusenabled', true)
            ->where('ps.statusenabled', true)
            ->where('apd.statusenabled', true)
            ->where('ru.statusenabled', true)
            ->where('dept.statusenabled', true)
            ->where('dept.id', 24)
            ->where(function ($query) {
                $query->whereNotNull('dg_masuk.kddiagnosa')
                    ->orWhereNotNull('dg_keluar.kddiagnosa');
            })
            ->get();

        // return $dataPasien;



        $dataResult = [
            'Bedah di Instalasi Gawat Darurat' => [
                'no' => '1'
            ],
            'Kecelakaan lalu lintas darat' => [
                'no' => '1.1'

            ],
            'Kecelakaan lalu lintas perairan' => [
                'no' => '1.2'

            ],
            'Kecelakaan lalu lintas udara' => [
                'no' => '1.3'

            ],
            'Bedah lainnya (non kecelakaan)' => [
                'no' => '1.4'

            ],
            'Non Bedah' => [
                'no' => '2'
            ],
            'Kekerasan terhadap Perempuan (≥18 tahun)' => [
                'no' => '2.1'
            ],
            'Kekerasan terhadap Anak (<18 tahun)' => [
                'no' => '2.2'
            ],
            'Kekerasan lainnya' => [
                'no' => '2.3'
            ],
            'Non bedah lainnya' => [
                'no' => '2.4'
            ],
            'Kebidanan' => [
                'no' => '3'
            ],
            'Psikiatrik' => [
                'no' => '4'

            ],
            'Bayi' => [
                'no' => '5'
            ],
            'Anak' => [
                'no' => '6'
            ],
            'Geriatri' => [
                'no' => '7'
            ]
        ];


        foreach ($dataPasien as $dp) {
            $jenisPelayanan = 'Non bedah lainnya';
            foreach ($mapping_icd as $key => $icd) {
                foreach ($icd as $code) {
                    if (strpos($dp->kddiagnosa_masuk, $code) === 0 || strpos($dp->kddiagnosa_keluar, $code) === 0) {
                        $jenisPelayanan = $key;
                        break 2;
                    }
                }
            }

            if ($jenisPelayanan === 'Kekerasan terhadap Perempuan (≥18 tahun)') {
                if ($dp->umur < 18 || $dp->objectjeniskelaminfk != 2) {
                    $jenisPelayanan = 'Kekerasan terhadap Anak (<18 tahun)';
                }
            }

            if ($jenisPelayanan === 'Kekerasan terhadap Anak (<18 tahun)') {
                if ($dp->umur >= 18) {
                    $jenisPelayanan = 'Kekerasan lainnya';
                } elseif ($dp->objectjeniskelaminfk == 1) {
                    $jenisPelayanan = 'Non bedah lainnya';
                }
            }

            if (in_array($dp->objectasalrujukanfk, $mapIdRujukan)) {
                if (!isset($dataResult[$jenisPelayanan]['pasien_rujukan'])) {
                    $dataResult[$jenisPelayanan]['pasien_rujukan'] = 0;
                }
                $dataResult[$jenisPelayanan]['pasien_rujukan']++;
            } else {
                if (!isset($dataResult[$jenisPelayanan]['pasien_non_rujukan'])) {
                    $dataResult[$jenisPelayanan]['pasien_non_rujukan'] = 0;
                }
                $dataResult[$jenisPelayanan]['pasien_non_rujukan']++;
            }


            if ($dp->tglmeninggal == null && $dp->objectstatuskeluarfk != 5 && $dp->objectstatuspulangfk != 9) {
                // Dirawat
                if ($dp->objectruanganasalfk != $dp->objectruanganlastfk) {
                    if (!isset($dataResult[$jenisPelayanan]['pasien_dirawat'])) {
                        $dataResult[$jenisPelayanan]['pasien_dirawat'] = 0;
                    }
                    $dataResult[$jenisPelayanan]['pasien_dirawat']++;
                }

                // Dirujuk (gunakan `==` untuk perbandingan)
                else if ($dp->objectruanganasalfk == $dp->objectruanganlastfk && $dp->objectstatuskeluarfk == 4) {
                    if (!isset($dataResult[$jenisPelayanan]['pasien_dirujuk'])) {
                        $dataResult[$jenisPelayanan]['pasien_dirujuk'] = 0;
                    }
                    $dataResult[$jenisPelayanan]['pasien_dirujuk']++;
                }

                // Pulang (gunakan `==` untuk perbandingan)
                else if ($dp->objectruanganasalfk == $dp->objectruanganlastfk && $dp->objectstatuskeluarfk == 1) {
                    if (!isset($dataResult[$jenisPelayanan]['pasien_pulang'])) {
                        $dataResult[$jenisPelayanan]['pasien_pulang'] = 0;
                    }
                    $dataResult[$jenisPelayanan]['pasien_pulang']++;
                }
            } else {
                // Meninggal di igd
                if ($dp->objectruanganasalfk != $dp->objectruanganlastfk) {
                    if ($dp->objectjeniskelaminfk == 1) {
                        if (!isset($dataResult[$jenisPelayanan]['pasien_meninggal_laki'])) {
                            $dataResult[$jenisPelayanan]['pasien_meninggal_laki'] = 0;
                        }
                        $dataResult[$jenisPelayanan]['pasien_meninggal_laki']++;
                    } else {
                        if (!isset($dataResult[$jenisPelayanan]['pasien_meninggal_perempuan'])) {
                            $dataResult[$jenisPelayanan]['pasien_meninggal_perempuan'] = 0;
                        }
                        $dataResult[$jenisPelayanan]['pasien_meninggal_perempuan']++;
                    }
                }
            }

            if ($dp->objectstatuspulangfk == 17) { //Death on Arrival (doa)
                if ($dp->objectjeniskelaminfk == 1) {
                    if (!isset($dataResult[$jenisPelayanan]['pasien_doa_laki'])) {
                        $dataResult[$jenisPelayanan]['pasien_doa_laki'] = 0;
                    }
                    $dataResult[$jenisPelayanan]['pasien_doa_laki']++;
                } else {
                    if (!isset($dataResult[$jenisPelayanan]['pasien_doa_perempuan'])) {
                        $dataResult[$jenisPelayanan]['pasien_doa_perempuan'] = 0;
                    }
                    $dataResult[$jenisPelayanan]['pasien_doa_perempuan']++;
                }
            }
        }

        return response()->json([
            'data' => $dataResult
        ]);
    }

    public function getLaporanRL34RekapitulasiPengunjungnew(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as pm', 'pm.id', '=', 'pd.nocmfk')
            ->select('pd.noregistrasi', 'pm.nocm', 'pm.namapasien', 'pd.statuspasien')
            ->where('pd.kdprofile', $idProfile)
            ->where('pd.statusenabled', true);

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '<=', $request['tglAkhir']);
        }

        $data = $data->get();

        $data10 = [];
        $jumlah_pengunjung_baru = 0;
        $jumlah_pengunjung_lama = 0;
        $jumlah_total = 0;

        foreach ($data as $item) {
            if ($item->statuspasien == 'BARU') {
                $jumlah_pengunjung_baru += 1;
            } else {
                $jumlah_pengunjung_lama += 1;
            }
            $jumlah_total += 1;
        }

        $data10 = [
            [
                "no" => 1,
                "jenispengunjung" => "Pengunjung Baru",
                "jumlah" => $jumlah_pengunjung_baru
            ],
            [
                "no" => 2,
                "jenispengunjung" => "Pengunjung Lama",
                "jumlah" => $jumlah_pengunjung_lama
            ],
            [
                "no" => 99,
                "jenispengunjung" => "Total",
                "jumlah" => $jumlah_total
            ]
        ];
        $result = array(
            'data' => $data10,
            'message' => 'er@epic',

        );

        return $this->respond($result);
    }

    public function getDataLaporanRL35Kunjungan(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];

        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftjoin('alamat_m as am', 'am.nocmfk', '=', 'ps.id')
            ->leftjoin('batalregistrasi_t as br', 'br.pasiendaftarfk', '=', 'pd.norec')
            ->leftJoin('antrianpasiendiperiksa_t as apd', function ($join) {
                $join->on('apd.noregistrasifk', '=', 'pd.norec');
                $join->on('apd.objectruanganfk', '=', 'pd.objectruanganlastfk');
                $join->whereNull('apd.objectruanganasalfk');
            })
            ->leftJoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            // ->leftJoin('emrpasien_t as ept', 'ept.noregistrasifk', '=', 'pd.noregistrasi')
            // ->leftJoin('diagnosapasien_t as dp', 'dp.noregistrasifk', operator: '=', 'apd.norec')
            // ->leftJoin('detaildiagnosapasien_t as ddp', 'ddp.objectdiagnosapasienfk', '=', 'dp.norec')
            // ->leftJoin('diagnosa_m as dm', 'dm.id', '=', 'ddp.objectdiagnosaperawatfk')
            ->distinct()
            ->select(
                'pd.norec',
                'ps.namapasien',
                'ps.objectjeniskelaminfk',
                'pg.namalengkap',
                // 'dm.kddiagnosa',
                'am.kotakabupaten',
                DB::raw('EXTRACT(YEAR FROM AGE(CURRENT_DATE, ps.tgllahir)) as umur'),
                DB::raw("
                CASE 
                        WHEN ru.id IN (756) THEN 'Penyakit Dalam'
                        WHEN ru.id IN (753,775,573) THEN 'Kesehatan Anak (Lainnya)'
                        WHEN ru.id IN (752,785,890,782,987,2051,765) THEN 'Jiwa'
                        WHEN ru.id IN (768,776,789) THEN 'Napza'
                        WHEN ru.id IN (767,791,807) THEN 'Psikologi'
                        WHEN ru.id IN (754) THEN 'Kulit dan Kelamin'
                        WHEN ru.id IN (759) THEN 'Gigi & Mulut'
                        WHEN ru.id IN (890) THEN 'Geriatri'
                        WHEN ru.id IN (773) THEN 'Kardiologi'
                        WHEN ru.id IN (769) THEN 'Radiologi'
                        WHEN ru.id IN (758,750,783,788,770,771,764,790,927) THEN 'Umum'
                        WHEN ru.id IN (29,765) THEN 'Rawat Darurat'
                        WHEN ru.id IN (762,774,777,786) THEN 'Rehabilitasi Medik'
                        WHEN ru.id IN (784) THEN 'Konsultasi Gizi'
                        WHEN ru.id IN (930) THEN 'Day Care'
                        WHEN ru.id IN (770,771,764,788) THEN 'Medical Check Up'
                        WHEN ru.id IN (755) THEN 'Saraf (Lainnya)'
                        WHEN ru.id IN (931,787,548) THEN 'Lain - Lain'

                    ELSE ru.namaruangan 
                END AS ruang
            "),
            )
            ->whereNull('br.norec')
            ->where('pd.statusenabled', true)
            ->where('pd.kdprofile', (int) $kdProfile)
            ->whereIn('ru.objectdepartemenfk', [18, 27, 24])
            ->whereBetween('pd.tglregistrasi', [$tglAwal, $tglAkhir])
            ->get();

        $jumlahPasien = [];
        foreach ($data as $pasien) {
            if ($pasien->ruang) {
                $jumlahPasien[$pasien->ruang] = (object)[
                    'ruang' => $pasien->ruang,
                    'jumlah' => 0,
                    'jumlah_dlm_l' => 0,
                    'jumlah_dlm_p' => 0,
                    'jumlah_luar_l' => 0,
                    'jumlah_luar_p' => 0
                ];
            }
        }

        foreach ($data as $pasien) {
            if (isset($jumlahPasien[$pasien->ruang])) {
                if ($pasien->objectjeniskelaminfk == 1 || $pasien->objectjeniskelaminfk == 2) {
                    $jumlahPasien[$pasien->ruang]->jumlah += 1;
                }
                if ($pasien->objectjeniskelaminfk == 1 && $pasien->kotakabupaten == 'Kota Yogyakarta') {
                    $jumlahPasien[$pasien->ruang]->jumlah_dlm_l += 1;
                }
                if ($pasien->objectjeniskelaminfk == 2 && $pasien->kotakabupaten == 'Kota Yogyakarta') {
                    $jumlahPasien[$pasien->ruang]->jumlah_dlm_p += 1;
                }
                if ($pasien->objectjeniskelaminfk == 1 && $pasien->kotakabupaten != 'Kota Yogyakarta') {
                    $jumlahPasien[$pasien->ruang]->jumlah_luar_l += 1;
                }
                if ($pasien->objectjeniskelaminfk == 2 && $pasien->kotakabupaten != 'Kota Yogyakarta') {
                    $jumlahPasien[$pasien->ruang]->jumlah_luar_p += 1;
                }
            }
        }

        $data = array_values($jumlahPasien);

        $result = array(
            'data' => $data,
            'message' => 'maman',
        );

        return $this->respond($result);
    }

    public function getLaporanRL314Khusus(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $KdJenisLapPelKhusus = (int) $this->settingDataFixed('KdJenisLapPelKhusus', $kdProfile);
        //#WIth Mapp
        $data = \DB::table('pasiendaftar_t as pd')
            ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '= ', 'apd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('departemen_m as dpm', 'dpm.id', '=', 'ru.objectdepartemenfk')
            ->join('produk_m as prd', 'prd.id', '=', 'pp.produkfk')
            ->join('mapproduktolaporanrl_m as mprl', 'mprl.produkfk', '=', 'pp.produkfk')
            ->join('jenislaporan_m as jl', 'jl.id', '=', 'mprl.objectjenislaporanfk')
            ->join('kelompoklaporan_m as kl', 'kl.id', '=', 'mprl.objectkontenlaporanfk')
            ->select(
                //                'prd.namaproduk',
                'kl.kelompoklaporan as namaproduk',
                DB::raw('
             COUNT(prd.namaproduk) as JmlTindakan')
            )
            ->groupBy('kl.kelompoklaporan')
            //            ->where('ru.objectdepartemenfk', '=', '28')
            ->where('pd.kdprofile', $kdProfile)
            ->where('jl.id', $KdJenisLapPelKhusus);


        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pp.tglpelayanan', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];
            $data = $data->where('pp.tglpelayanan', '<=', $tgl);
        }

        $data = $data->get();

        $result = array(
            'data' => $data,
            'message' => 'as@cepot',
        );
        return $this->respond($result);
    }

    public function getLaporanRL43(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        //#WIth Mapp

        $data = DB::select(DB::raw("SELECT 
                    kddiagnosa, 
                    namadiagnosa,
                    SUM(hiduplaki) AS hiduplaki,
                    SUM(hidupperempuan) AS hidupperempuan,
                    COUNT(norec) AS jumlahhiduppl,
                    SUM(matilaki) as matilaki,
                    SUM(matiperempuan) as matiperempuan,
                    SUM(matiperempuan + matilaki) as matipl
                FROM (
                    SELECT 
                    d.kddiagnosa, 
                    d.namadiagnosa, 
                    pd.norec,
                    CASE WHEN ps.objectjeniskelaminfk = 1 THEN 1 ELSE 0 END AS hiduplaki,
                    CASE WHEN ps.objectjeniskelaminfk = 2 THEN 1 ELSE 0 END AS hidupperempuan,
                    CASE WHEN ps.objectjeniskelaminfk = 1 and pd.tglmeninggal is not null THEN 1 ELSE 0 END AS matilaki,
                    CASE WHEN ps.objectjeniskelaminfk = 2 and pd.tglmeninggal is not null THEN 1 ELSE 0 END AS matiperempuan
                    FROM pasiendaftar_t AS pd
                    INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                    INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
                    INNER JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                    INNER JOIN diagnosapasien_t AS dp ON dp.noregistrasifk = apd.norec
                    INNER JOIN detaildiagnosapasien_t AS ddp ON ddp.objectdiagnosapasienfk = dp.norec
                    INNER JOIN diagnosa_m AS d ON d.id = ddp.objectdiagnosafk
                    LEFT JOIN pegawai_m AS pg ON pg.id = pd.objectpegawaifk
                    WHERE 
                    pd.statusenabled = true
                    and pd.kdprofile = $kdProfile
                    AND ru.objectdepartemenfk = 16
                    and pd.tglregistrasi between '$tglAwal' and '$tglAkhir'
                ) AS x
                GROUP BY kddiagnosa, namadiagnosa
                ORDER BY matipl DESC
                -- LIMIT 10
                ;
                    "));

        $result = array(
            'detail' => $data,
            'message' => 'as@maman',
        );
        return $this->respond($result);
    }

    public function getLaporanRL51RawatJalanNew(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        //#WIth Mapp
        $data = DB::select(DB::raw("SELECT 
                        kddiagnosa, 
                        namadiagnosa,
                        SUM(hiduplaki) AS hiduplaki,
                        SUM(hidupperempuan) AS hidupperempuan,
                        SUM(norec) AS jumlahhiduppl,
                        SUM(matilaki) as matilaki,
                        SUM(matiperempuan) as matiperempuan,
                        SUM(matiperempuan + matilaki) as matipl,
                        jumlahkurang1jaml,
                        jumlahkurang1jamp,
                        jumlahkurang23jaml,
                        jumlahkurang23jamp,
                        jumlah17hl,
                        jumlah17hp,
                        jumlah828hl,
                        jumlah828hp,
                        jumlah293l,
                        jumlah293p,
                        jumlah36l,
                        jumlah36p,
                        jumlah611l,
                        jumlah611p,
                        jumlah14l,
                        jumlah14p,
                        jumlah59l,
                        jumlah59p,
                        jumlah1014l,
                        jumlah1014p,
                        jumlah1519l,
                        jumlah1519p,
                        jumlah2024l,
                        jumlah2024p,
                        jumlah2529l,
                        jumlah2529p,
                        jumlah3034l,
                        jumlah3034p,
                        jumlah3539l,
                        jumlah3539p,
                        jumlah4044l,
                        jumlah4044p,
                        jumlah4549l,
                        jumlah4549p,
                        jumlah5054l,
                        jumlah5054p,
                        jumlah5559l,
                        jumlah5559p,
                        jumlah6064l,
                        jumlah6064p,
                        jumlah6569l,
                        jumlah6569p,
                        jumlah7074l,
                        jumlah7074p,
                        jumlah7579l,
                        jumlah7579p,
                        jumlah8084l,
                        jumlah8084p,
                        jumlah85l,
                        jumlah85p
                        FROM (
                        SELECT 
                            d.kddiagnosa, 
                            d.namadiagnosa, 
                            COUNT(pd.norec) as norec,
                            SUM(CASE WHEN ps.objectjeniskelaminfk = 1 THEN 1 ELSE 0 END) AS hiduplaki,
                            SUM(CASE WHEN ps.objectjeniskelaminfk = 2 THEN 1 ELSE 0 END) AS hidupperempuan,
                            SUM(CASE WHEN ps.objectjeniskelaminfk = 1 and pd.objectstatuskeluarfk = 5 THEN 1 ELSE 0 END) AS matilaki,
                            SUM(CASE WHEN ps.objectjeniskelaminfk = 2 and pd.objectstatuskeluarfk = 5 THEN 1 ELSE 0 END) AS matiperempuan,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'HH')::int4 < 1 and ps.objectjeniskelaminfk = 1 then 1 else 0 end) as jumlahkurang1jaml,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'HH')::int4 < 1 and ps.objectjeniskelaminfk = 2 then 1 else 0 end) as jumlahkurang1jamp,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 < 1 and TO_CHAR(age(ps.tgllahir), 'MM')::int4 <= 0 and TO_CHAR(age(ps.tgllahir), 'DD')::int4 <= 1 and TO_CHAR(age(ps.tgllahir), 'HH')::int4 >= 1 and TO_CHAR(age(ps.tgllahir), 'HH')::int4 < 23 and ps.objectjeniskelaminfk = 1 then 1 else 0 end) as jumlahkurang23jaml,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 < 1 and TO_CHAR(age(ps.tgllahir), 'MM')::int4 <= 0 and TO_CHAR(age(ps.tgllahir), 'DD')::int4 <= 1 and TO_CHAR(age(ps.tgllahir), 'HH')::int4 >= 1 and TO_CHAR(age(ps.tgllahir), 'HH')::int4 < 23 and ps.objectjeniskelaminfk = 2 then 1 else 0 end) as jumlahkurang23jamp,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 < 1 and TO_CHAR(age(ps.tgllahir), 'MM')::int4 <= 1 and TO_CHAR(age(ps.tgllahir), 'DD')::int4 >= 1 and TO_CHAR(age(ps.tgllahir), 'DD')::int4 < 7 and ps.objectjeniskelaminfk = 1 then 1 else 0 end) as jumlah17hl,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 < 1 and TO_CHAR(age(ps.tgllahir), 'MM')::int4 <= 1 and TO_CHAR(age(ps.tgllahir), 'DD')::int4 >= 1 and TO_CHAR(age(ps.tgllahir), 'DD')::int4 < 7 and ps.objectjeniskelaminfk = 2 then 1 else 0 end) as jumlah17hp,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 < 1 and TO_CHAR(age(ps.tgllahir), 'MM')::int4 <= 1 and TO_CHAR(age(ps.tgllahir), 'DD')::int4 >= 8 and TO_CHAR(age(ps.tgllahir), 'DD')::int4 < 28 and ps.objectjeniskelaminfk = 1 then 1 else 0 end) as jumlah828hl,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 < 1 and TO_CHAR(age(ps.tgllahir), 'MM')::int4 <= 1 and TO_CHAR(age(ps.tgllahir), 'DD')::int4 >= 8 and TO_CHAR(age(ps.tgllahir), 'DD')::int4 < 28 and ps.objectjeniskelaminfk = 2 then 1 else 0 end) as jumlah828hp,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 < 1 and TO_CHAR(age(ps.tgllahir), 'MM')::int4 >= 0 and TO_CHAR(age(ps.tgllahir), 'DD')::int4 >= 29 and TO_CHAR(age(ps.tgllahir), 'MM')::int4 < 3 and ps.objectjeniskelaminfk = 1 then 1 else 0 end) as jumlah293l,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 < 1 and TO_CHAR(age(ps.tgllahir), 'MM')::int4 >= 0 and TO_CHAR(age(ps.tgllahir), 'DD')::int4 >= 29 and TO_CHAR(age(ps.tgllahir), 'MM')::int4 < 3 and ps.objectjeniskelaminfk = 2 then 1 else 0 end) as jumlah293p,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 < 1 and TO_CHAR(age(ps.tgllahir), 'MM')::int4 >= 3 and TO_CHAR(age(ps.tgllahir), 'MM')::int4 < 6 and ps.objectjeniskelaminfk = 1 then 1 else 0 end) as jumlah36l,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 < 1 and TO_CHAR(age(ps.tgllahir), 'MM')::int4 >= 3 and TO_CHAR(age(ps.tgllahir), 'MM')::int4 < 6 and ps.objectjeniskelaminfk = 2 then 1 else 0 end) as jumlah36p,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 < 1 and TO_CHAR(age(ps.tgllahir), 'MM')::int4 >= 6 and TO_CHAR(age(ps.tgllahir), 'MM')::int4 <= 11 and ps.objectjeniskelaminfk = 1 then 1 else 0 end) as jumlah611l,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 < 1 and TO_CHAR(age(ps.tgllahir), 'MM')::int4 >= 6 and TO_CHAR(age(ps.tgllahir), 'MM')::int4 <= 11 and ps.objectjeniskelaminfk = 2 then 1 else 0 end) as jumlah611p,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 >= 1 and TO_CHAR(age(ps.tgllahir), 'YY')::int4 <= 4 and ps.objectjeniskelaminfk = 1 then 1 else 0 end) as jumlah14l,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 >= 1 and TO_CHAR(age(ps.tgllahir), 'YY')::int4 <= 4 and ps.objectjeniskelaminfk = 2 then 1 else 0 end) as jumlah14p,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 >= 5 and TO_CHAR(age(ps.tgllahir), 'YY')::int4 <= 9 and ps.objectjeniskelaminfk = 1 then 1 else 0 end) as jumlah59l,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 >= 5 and TO_CHAR(age(ps.tgllahir), 'YY')::int4 <= 9 and ps.objectjeniskelaminfk = 2 then 1 else 0 end) as jumlah59p,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 >= 10 and TO_CHAR(age(ps.tgllahir), 'YY')::int4 <= 14 and ps.objectjeniskelaminfk = 1 then 1 else 0 end) as jumlah1014l,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 >= 10 and TO_CHAR(age(ps.tgllahir), 'YY')::int4 <= 14 and ps.objectjeniskelaminfk = 2 then 1 else 0 end) as jumlah1014p,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 >= 15 and TO_CHAR(age(ps.tgllahir), 'YY')::int4 <= 19 and ps.objectjeniskelaminfk = 1 then 1 else 0 end) as jumlah1519l,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 >= 15 and TO_CHAR(age(ps.tgllahir), 'YY')::int4 <= 19 and ps.objectjeniskelaminfk = 2 then 1 else 0 end) as jumlah1519p,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 >= 20 and TO_CHAR(age(ps.tgllahir), 'YY')::int4 <= 24 and ps.objectjeniskelaminfk = 1 then 1 else 0 end) as jumlah2024l,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 >= 20 and TO_CHAR(age(ps.tgllahir), 'YY')::int4 <= 24 and ps.objectjeniskelaminfk = 2 then 1 else 0 end) as jumlah2024p,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 >= 25 and TO_CHAR(age(ps.tgllahir), 'YY')::int4 <= 29 and ps.objectjeniskelaminfk = 1 then 1 else 0 end) as jumlah2529l,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 >= 25 and TO_CHAR(age(ps.tgllahir), 'YY')::int4 <= 29 and ps.objectjeniskelaminfk = 2 then 1 else 0 end) as jumlah2529p,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 >= 30 and TO_CHAR(age(ps.tgllahir), 'YY')::int4 <= 34 and ps.objectjeniskelaminfk = 1 then 1 else 0 end) as jumlah3034l,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 >= 30 and TO_CHAR(age(ps.tgllahir), 'YY')::int4 <= 34 and ps.objectjeniskelaminfk = 2 then 1 else 0 end) as jumlah3034p,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 >= 35 and TO_CHAR(age(ps.tgllahir), 'YY')::int4 <= 39 and ps.objectjeniskelaminfk = 1 then 1 else 0 end) as jumlah3539l,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 >= 35 and TO_CHAR(age(ps.tgllahir), 'YY')::int4 <= 39 and ps.objectjeniskelaminfk = 2 then 1 else 0 end) as jumlah3539p,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 >= 40 and TO_CHAR(age(ps.tgllahir), 'YY')::int4 <= 44 and ps.objectjeniskelaminfk = 1 then 1 else 0 end) as jumlah4044l,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 >= 40 and TO_CHAR(age(ps.tgllahir), 'YY')::int4 <= 44 and ps.objectjeniskelaminfk = 2 then 1 else 0 end) as jumlah4044p,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 >= 45 and TO_CHAR(age(ps.tgllahir), 'YY')::int4 <= 49 and ps.objectjeniskelaminfk = 1 then 1 else 0 end) as jumlah4549l,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 >= 45 and TO_CHAR(age(ps.tgllahir), 'YY')::int4 <= 49 and ps.objectjeniskelaminfk = 2 then 1 else 0 end) as jumlah4549p,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 >= 50 and TO_CHAR(age(ps.tgllahir), 'YY')::int4 <= 50 and ps.objectjeniskelaminfk = 1 then 1 else 0 end) as jumlah5054l,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 >= 50 and TO_CHAR(age(ps.tgllahir), 'YY')::int4 <= 54 and ps.objectjeniskelaminfk = 2 then 1 else 0 end) as jumlah5054p,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 >= 55 and TO_CHAR(age(ps.tgllahir), 'YY')::int4 <= 59 and ps.objectjeniskelaminfk = 1 then 1 else 0 end) as jumlah5559l,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 >= 55 and TO_CHAR(age(ps.tgllahir), 'YY')::int4 <= 59 and ps.objectjeniskelaminfk = 2 then 1 else 0 end) as jumlah5559p,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 >= 60 and TO_CHAR(age(ps.tgllahir), 'YY')::int4 <= 64 and ps.objectjeniskelaminfk = 1 then 1 else 0 end) as jumlah6064l,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 >= 60 and TO_CHAR(age(ps.tgllahir), 'YY')::int4 <= 64 and ps.objectjeniskelaminfk = 2 then 1 else 0 end) as jumlah6064p,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 >= 65 and TO_CHAR(age(ps.tgllahir), 'YY')::int4 <= 69 and ps.objectjeniskelaminfk = 1 then 1 else 0 end) as jumlah6569l,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 >= 65 and TO_CHAR(age(ps.tgllahir), 'YY')::int4 <= 69 and ps.objectjeniskelaminfk = 2 then 1 else 0 end) as jumlah6569p,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 >= 70 and TO_CHAR(age(ps.tgllahir), 'YY')::int4 <= 74 and ps.objectjeniskelaminfk = 1 then 1 else 0 end) as jumlah7074l,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 >= 70 and TO_CHAR(age(ps.tgllahir), 'YY')::int4 <= 74 and ps.objectjeniskelaminfk = 2 then 1 else 0 end) as jumlah7074p,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 >= 75 and TO_CHAR(age(ps.tgllahir), 'YY')::int4 <= 79 and ps.objectjeniskelaminfk = 1 then 1 else 0 end) as jumlah7579l,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 >= 75 and TO_CHAR(age(ps.tgllahir), 'YY')::int4 <= 79 and ps.objectjeniskelaminfk = 2 then 1 else 0 end) as jumlah7579p,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 >= 80 and TO_CHAR(age(ps.tgllahir), 'YY')::int4 <= 84 and ps.objectjeniskelaminfk = 1 then 1 else 0 end) as jumlah8084l,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 >= 80 and TO_CHAR(age(ps.tgllahir), 'YY')::int4 <= 84 and ps.objectjeniskelaminfk = 2 then 1 else 0 end) as jumlah8084p,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 >= 85 and ps.objectjeniskelaminfk = 1 then 1 else 0 end) as jumlah85l,
                            SUM(case when TO_CHAR(age(ps.tgllahir), 'YY')::int4 >= 85 and ps.objectjeniskelaminfk = 2 then 1 else 0 end) as jumlah85p
                            FROM pasiendaftar_t AS pd
                            INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                            INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
                            INNER JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                            INNER JOIN diagnosapasien_t AS dp ON dp.noregistrasifk = apd.norec
                            INNER JOIN detaildiagnosapasien_t AS ddp ON ddp.objectdiagnosapasienfk = dp.norec
                            INNER JOIN diagnosa_m AS d ON d.id = ddp.objectdiagnosafk
                            LEFT JOIN pegawai_m AS pg ON pg.id = pd.objectpegawaifk
                            WHERE 
                                    pd.statusenabled = true
                                    and pd.kdprofile = $kdProfile
                                    AND ru.objectdepartemenfk = 18
                                    and pd.tglregistrasi between '$tglAwal' and '$tglAkhir'
                            GROUP BY d.kddiagnosa, d.namadiagnosa
                            ) AS x
                            GROUP BY kddiagnosa, namadiagnosa,
                        jumlahkurang1jaml,
                        jumlahkurang1jamp,
                        jumlahkurang23jaml,
                        jumlahkurang23jamp,
                        jumlah17hl,
                        jumlah17hp,
                        jumlah828hl,
                        jumlah828hp,
                        jumlah293l,
                        jumlah293p,
                        jumlah36l,
                        jumlah36p,
                        jumlah611l,
                        jumlah611p,
                        jumlah14l,
                        jumlah14p,
                        jumlah59l,
                        jumlah59p,
                        jumlah1014l,
                        jumlah1014p,
                        jumlah1519l,
                        jumlah1519p,
                        jumlah2024l,
                        jumlah2024p,
                        jumlah2529l,
                        jumlah2529p,
                        jumlah2529l,
                        jumlah2529p,
                        jumlah2529l,
                        jumlah2529p,
                        jumlah3034l,
                        jumlah3034p,
                        jumlah3539l,
                        jumlah3539p,
                        jumlah4044l,
                        jumlah4044p,
                        jumlah4549l,
                        jumlah4549p,
                        jumlah5054l,
                        jumlah5054p,
                        jumlah5559l,
                        jumlah5559p,
                        jumlah6064l,
                        jumlah6064p,
                        jumlah6569l,
                        jumlah6569p,
                        jumlah7074l,
                        jumlah7074p,
                        jumlah7579l,
                        jumlah7579p,
                        jumlah8084l,
                        jumlah8084p,
                        jumlah85l,
                        jumlah85p
                        "));

        $result = array(
            'detail' => $data,
            'message' => 'as@maman',
        );
        return $this->respond($result);
    }
    public function getPelayananRehabV3(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $KdJenisLapRehab = (int) $this->settingDataFixed('KdJenisLapRehab', $kdProfile);
        $KdDepartemenInstalasiRehabilitasiMedik = (int) $this->settingDataFixed('KdDepartemenInstalasiRehabilitasiMedik', $kdProfile);
        //        $dataLogin = $request->all();
        //        $data = \DB::table('pasiendaftar_t as pd')
        //            ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
        //            ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '= ', 'apd.norec')
        //            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
        //            ->join('departemen_m as dpm', 'dpm.id', '=', 'ru.objectdepartemenfk')
        //            ->join('produk_m as prd', 'prd.id', '=', 'pp.produkfk')
        //            ->select('ru.objectdepartemenfk', 'dpm.namadepartemen', 'apd.objectruanganfk', 'ru.namaruangan',
        //                'pp.produkfk', 'prd.id as idproduk', 'prd.namaproduk',
        //                DB::raw('
        //               (case when prd.id = 401322 then \'Inh (Nebulizer)\'
        //                    when prd.id in (401258,401256,401307,401260,401262,401263,401255) then \'Lat. Gerak (Exercise)\'
        //                    when prd.id in (401262,401261) then \'US\'
        //                    when prd.id in (402940,402435) then \'Pijat Bayi\'
        //                    when prd.id = 401270 then \'Senam Hamil\'
        //                    when prd.id = 401274 then \'Terapi Musik\'
        //                    when prd.id in (401275,401329) then \'Deteksi dini Program Psikologi\'
        //                    when prd.id in (401301,401300) then \'Tindakan Sensori Integrasi (SI)\'
        //                    when prd.id in (863,879,401302) then \'Tindakan Okupasi Terapi (OT)\'
        //                    when prd.id in (401305,401304,864) then \'Tindakan Terapi Wicara (TW)\'
        //                    when prd.id = 925 then \'Seleksi\'
        //                    when prd.id = 402867 then \'Follow Up\' else null
        //                    end) as jenislayanan,COUNT(prd.namaproduk) as JmlTindakan')
        //            )
        //            ->groupBy('ru.objectdepartemenfk', 'dpm.namadepartemen', 'apd.objectruanganfk', 'ru.namaruangan', 'pp.produkfk',
        //                'prd.id', 'prd.namaproduk')
        //            ->where('ru.objectdepartemenfk', '=', '28')
        //            ->whereIn('prd.id', [401322, 401258, 401256, 401307, 401260, 401262, 401263, 401255, 401262,
        //                401261, 402940, 402435, 401270, 401274, 401270, 401275, 401329, 401301,
        //                401300, 863, 879, 401302, 401305, 401304, 864, 925, 402867]);
        //
        //        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
        //            $data = $data->where('pd.tglregistrasi', '>=', $request['tglAwal']);
        //        }
        //        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
        //            $tgl = $request['tglAkhir'];
        //            $data = $data->where('pd.tglregistrasi', '<=', $tgl);
        //        }
        //
        //        $data = $data->get();
        //
        //        $result = array(
        //            'data' => $data,
        //            'message' => 'as@cepot',
        //        );
        //        return $this->respond($result);

        //#WIth Mapp
        $data = \DB::table('pasiendaftar_t as pd')
            ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '= ', 'apd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('departemen_m as dpm', 'dpm.id', '=', 'ru.objectdepartemenfk')
            ->join('produk_m as prd', 'prd.id', '=', 'pp.produkfk')
            ->join('mapproduktolaporanrl_m as mprl', 'mprl.produkfk', '=', 'pp.produkfk')
            ->join('jenislaporan_m as jl', 'jl.id', '=', 'mprl.objectjenislaporanfk')
            ->join('kelompoklaporan_m as kl', 'kl.id', '=', 'mprl.objectkontenlaporanfk')
            ->select(
                //                'prd.namaproduk',
                'kl.kelompoklaporan as namaproduk',
                DB::raw('
             COUNT(prd.namaproduk) as JmlTindakan')
            )
            ->groupBy('kl.kelompoklaporan')
            ->where('ru.objectdepartemenfk', '=', $KdDepartemenInstalasiRehabilitasiMedik)
            ->where('jl.id', $KdJenisLapRehab);


        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pp.tglpelayanan', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];
            $data = $data->where('pp.tglpelayanan', '<=', $tgl);
        }

        $data = $data->get();

        $result = array(
            'data' => $data,
            'message' => 'as@cepot',
        );
        return $this->respond($result);
    }
    public function getLaporanRL36Kebidanan(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $KdJenisLapKebidanan = (int) $this->settingDataFixed('KdJenisLapKebidanan', $idProfile);
        $KdRuangKebidanan = explode(',', $this->settingDataFixed('KdRuangKebidanan', $idProfile));
        $dataLogin = $request->all();
        $kdListRuanganKebidanan = [];
        foreach ($KdRuangKebidanan as $item) {
            $kdListRuanganKebidanan[] = (int) $item;
        }
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('departemen_m as dpm', 'dpm.id', '=', 'ru.objectdepartemenfk')
            ->join('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->join('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->join('mapproduktolaporanrl_m as mprl', 'mprl.produkfk', '=', 'pp.produkfk')
            ->join('jenislaporan_m as jl', 'jl.id', '=', 'mprl.objectjenislaporanfk')
            ->join('kelompoklaporan_m as kl', 'kl.id', '=', 'mprl.objectkontenlaporanfk')
            ->join('detailjenisproduk_m as djp', 'djp.id', '=', 'pr.objectdetailjenisprodukfk')
            ->join('jenisproduk_m as jp', 'jp.id', '=', 'djp.objectjenisprodukfk')
            ->join('asalrujukan_m as ar', 'ar.id', '=', 'apd.objectasalrujukanfk')
            ->leftjoin('statuskeluar_m as stk', 'stk.id', '=', 'pd.objectstatuskeluarfk')
            ->leftJoin('kelompokproduk_m as kp', 'kp.id', '=', 'jp.objectkelompokprodukfk')
            ->select(
                'pp.tglpelayanan',
                'pp.produkfk',
                'pr.namaproduk',
                'apd.objectasalrujukanfk',
                'ar.asalrujukan',
                'pd.objectstatuskeluarfk',
                'apd.objectruanganfk',
                'kl.kelompoklaporan as jenispelayanan'
                //                DB::raw('(case when pr.id =402494 then \'Persalinan Normal\'
                //                        when pr.id in (15375,15386,15387,15388,15477) then \'Sectio Caesaria\'
                //                        else \'-\'
                //                         end) as jenispelayanan ')
            )
            ->where('pd.kdprofile', $idProfile)
            ->where('jl.id', $KdJenisLapKebidanan) //laporan RL 34
            ->whereIn('apd.objectruanganfk', $kdListRuanganKebidanan);


        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pp.tglpelayanan', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];
            $data = $data->where('pp.tglpelayanan', '<=', $tgl);
        }

        $data = $data->get();

        $data10 = [];
        $jml = 0;
        $rujukanRS = 0;
        $rujukanBidan = 0;
        $rujukanPuskes = 0;
        $rujukanFaskesLain = 0;
        $jmlMedisHidup = 0;
        $jmlMedisMati = 0;
        $jmlTotalMedis = 0;
        $jmlNonMedisHidup = 0;
        $jmlNonMedisMati = 0;
        $jmlTotalNonMedis = 0;
        $nonRujukanHidup = 0;
        $nonRujukanMati = 0;
        $totalNonRujukan = 0;
        $dirujuk = 0;
        $sama = false;


        foreach ($data as $item) {
            $sama = false;
            $i = 0;
            $o = 0;
            foreach ($data10 as $hideung) {
                if ($item->jenispelayanan == $data10[$i]['jenispelayanan']) {
                    $sama = true;
                    $jml = (float)$hideung['jumlah'] + 1;
                    $data10[$i]['jumlah'] = $jml;

                    //RS=2, puskes=1, faskeslan=3, non rujikan =5, klinik=3
                    //statuskeluar --->1 pulang , 2 pindah,3 rajal, 4 rujuk, 5 meningggal

                    if ($item->objectasalrujukanfk == 2) {
                        $data10[$i]['rujukanRS'] = (float)$hideung['rujukanRS'] + 1;
                    } else if ($item->objectasalrujukanfk == 1) {
                        $data10[$i]['rujukanPuskes'] = (float)$hideung['rujukanPuskes'] + 1;
                    } else if ($item->objectasalrujukanfk == 3 || $item->objectasalrujukanfk == 4) {
                        $data10[$i]['rujukanFaskesLain'] = (float)$hideung['rujukanFaskesLain'] + 1;
                    }
                    if (($item->objectasalrujukanfk == 2 || $item->objectasalrujukanfk == 1 || $item->objectasalrujukanfk == 3) && $item->objectstatuskeluarfk == 1) {
                        $data10[$i]['jmlMedisHidup'] = (float)$hideung['jmlMedisHidup'] + 1;
                    } else if (($item->objectasalrujukanfk == 2 || $item->objectasalrujukanfk == 1 || $item->objectasalrujukanfk == 3) && $item->objectstatuskeluarfk == 5) {
                        $data10[$i]['jmlMedisMati'] = (float)$hideung['jmlMedisMati'] + 1;
                    }
                    if (($item->objectasalrujukanfk == 5 || $item->objectasalrujukanfk == 4) && $item->objectstatuskeluarfk == 1) {
                        $data10[$i]['jmlNonMedisHidup'] = (float)$hideung['jmlNonMedisHidup'] + 1;
                    } else if (($item->objectasalrujukanfk == 5 || $item->objectasalrujukanfk == 4) && $item->objectstatuskeluarfk == 5) {
                        $data10[$i]['jmlNonMedisMati'] = (float)$hideung['jmlNonMedisMati'] + 1;
                    }
                    if ($item->objectstatuskeluarfk == 4) {
                        $data10[$i]['dirujuk'] = (float)$hideung['dirujuk'] + 1;
                    }

                    $data10[$i]['jmlTotalMedis'] = $data10[$i]['rujukanRS'] + $data10[$i]['rujukanPuskes'] + $data10[$i]['rujukanFaskesLain'] + $data10[$i]['jmlMedisHidup'] + $data10[$i]['jmlMedisMati'];
                    $data10[$i]['jmlTotalNonMedis'] = $data10[$i]['jmlNonMedisHidup'] + $data10[$i]['jmlNonMedisMati'];
                }
                $i = $i + 1;
            }

            if ($sama == false) {
                if ($item->objectasalrujukanfk == 2) {
                    $rujukanRS = 1;
                    $rujukanBidan = 0;
                    $rujukanPuskes = 0;
                    $rujukanFaskesLain = 0;
                    $jmlMedisHidup = 0;
                    $jmlMedisMati = 0;
                    $jmlTotalMedis = 0;
                    $jmlNonMedisHidup = 0;
                    $jmlNonMedisMati = 0;
                    $jmlTotalNonMedis = 0;
                    $nonRujukanHidup = 0;
                    $nonRujukanMati = 0;
                    $totalNonRujukan = 0;
                    $dirujuk = 0;
                } else if ($item->objectasalrujukanfk == 1) {
                    $rujukanRS = 0;
                    $rujukanBidan = 0;
                    $rujukanPuskes = 1;
                    $rujukanFaskesLain = 0;
                    $jmlMedisHidup = 0;
                    $jmlMedisMati = 0;
                    $jmlTotalMedis = 0;
                    $jmlNonMedisHidup = 0;
                    $jmlNonMedisMati = 0;
                    $jmlTotalNonMedis = 0;
                    $nonRujukanHidup = 0;
                    $nonRujukanMati = 0;
                    $totalNonRujukan = 0;
                    $dirujuk = 0;
                } else if ($item->objectasalrujukanfk == 3 || $item->objectasalrujukanfk == 4) {
                    $rujukanRS = 0;
                    $rujukanBidan = 0;
                    $rujukanPuskes = 0;
                    $rujukanFaskesLain = 1;
                    $jmlMedisHidup = 0;
                    $jmlMedisMati = 0;
                    $jmlTotalMedis = 0;
                    $jmlNonMedisHidup = 0;
                    $jmlNonMedisMati = 0;
                    $jmlTotalNonMedis = 0;
                    $nonRujukanHidup = 0;
                    $nonRujukanMati = 0;
                    $totalNonRujukan = 0;
                    $dirujuk = 0;
                }
                if (($item->objectasalrujukanfk == 2 || $item->objectasalrujukanfk == 1 || $item->objectasalrujukanfk == 3) && $item->objectstatuskeluarfk == 1) {
                    $rujukanRS = 0;
                    $rujukanBidan = 0;
                    $rujukanPuskes = 0;
                    $rujukanFaskesLain = 0;
                    $jmlMedisHidup = 1;
                    $jmlMedisMati = 0;
                    $jmlTotalMedis = 0;
                    $jmlNonMedisHidup = 0;
                    $jmlNonMedisMati = 0;
                    $jmlTotalNonMedis = 0;
                    $nonRujukanHidup = 0;
                    $nonRujukanMati = 0;
                    $totalNonRujukan = 0;
                    $dirujuk = 0;
                } else if (($item->objectasalrujukanfk == 2 || $item->objectasalrujukanfk == 1 || $item->objectasalrujukanfk == 3) && $item->objectstatuskeluarfk == 5) {
                    $rujukanRS = 0;
                    $rujukanBidan = 0;
                    $rujukanPuskes = 0;
                    $rujukanFaskesLain = 0;
                    $jmlMedisHidup = 0;
                    $jmlMedisMati = 1;
                    $jmlTotalMedis = 0;
                    $jmlNonMedisHidup = 0;
                    $jmlNonMedisMati = 0;
                    $jmlTotalNonMedis = 0;
                    $nonRujukanHidup = 0;
                    $nonRujukanMati = 0;
                    $totalNonRujukan = 0;
                    $dirujuk = 0;
                }
                if (($item->objectasalrujukanfk == 5 || $item->objectasalrujukanfk == 4) && $item->objectstatuskeluarfk == 1) {
                    $rujukanRS = 0;
                    $rujukanBidan = 0;
                    $rujukanPuskes = 0;
                    $rujukanFaskesLain = 0;
                    $jmlMedisHidup = 0;
                    $jmlMedisMati = 0;
                    $jmlTotalMedis = 0;
                    $jmlNonMedisHidup = 1;
                    $jmlNonMedisMati = 0;
                    $jmlTotalNonMedis = 0;
                    $nonRujukanHidup = 0;
                    $nonRujukanMati = 0;
                    $totalNonRujukan = 0;
                    $dirujuk = 0;
                } else if (($item->objectasalrujukanfk == 5 || $item->objectasalrujukanfk == 4) && $item->objectstatuskeluarfk == 5) {
                    $rujukanRS = 0;
                    $rujukanBidan = 0;
                    $rujukanPuskes = 0;
                    $rujukanFaskesLain = 0;
                    $jmlMedisHidup = 0;
                    $jmlMedisMati = 0;
                    $jmlTotalMedis = 0;
                    $jmlNonMedisHidup = 0;
                    $jmlNonMedisMati = 1;
                    $jmlTotalNonMedis = 0;
                    $nonRujukanHidup = 0;
                    $nonRujukanMati = 0;
                    $totalNonRujukan = 0;
                    $dirujuk = 0;
                }
                if ($item->objectstatuskeluarfk == 4) {
                    $rujukanRS = 0;
                    $rujukanBidan = 0;
                    $rujukanPuskes = 0;
                    $rujukanFaskesLain = 0;
                    $jmlMedisHidup = 0;
                    $jmlMedisMati = 0;
                    $jmlTotalMedis = 0;
                    $jmlNonMedisHidup = 0;
                    $jmlNonMedisMati = 0;
                    $jmlTotalNonMedis = 0;
                    $nonRujukanHidup = 0;
                    $nonRujukanMati = 0;
                    $totalNonRujukan = 0;
                    $dirujuk = 1;
                }

                $data10[] = array(
                    //                    'produkfk' => $item->produkfk,
                    'jenispelayanan' => $item->jenispelayanan,
                    'jumlah' => 1,

                    'rujukanRS' => $rujukanRS,
                    'rujukanFaskesLain' => $rujukanFaskesLain,
                    'rujukanPuskes' => $rujukanPuskes,
                    'rujukanBidan' => 0,
                    'jmlMedisHidup' => $jmlMedisHidup,
                    'jmlMedisMati' => $jmlMedisMati,
                    'jmlTotalMedis' => $jmlTotalMedis,
                    'jmlNonMedisHidup' => $jmlNonMedisHidup,
                    'jmlNonMedisMati' => $jmlNonMedisMati,
                    'jmlTotalNonMedis' => $jmlTotalNonMedis,
                    'nonRujukanHidup' => $nonRujukanHidup,
                    'nonRujukanMati' => $nonRujukanMati,
                    'totalNonRujukan' => $totalNonRujukan,
                    'dirujuk' => $dirujuk,
                    'jmlTotalMedis' => $jmlTotalMedis,
                    'jmlTotalNonMedis' => $jmlTotalNonMedis,
                );
            }

            foreach ($data10 as $key => $row) {
                $count[$key] = $row['jumlah'];
            }

            array_multisort($count, SORT_DESC, $data10);
        }
        $result = array(
            'data' => $data10,
            'message' => 'er@epic',

        );

        return $this->respond($result);
    }

    public function getLaporanRL37Neonatal(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $KdJenisLapPerinatologi = (int)$this->settingDataFixed('KdJenisLapPerinatologi', $idProfile);
        $KdRuangKebidanan = explode(',', $this->settingDataFixed('KdRuangKebidanan', $idProfile));
        $kdListRuanganKebidanan = [];
        foreach ($KdRuangKebidanan as $item) {
            $kdListRuanganKebidanan[] = (int) $item;
        }
        $dataLogin = $request->all();
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('departemen_m as dpm', 'dpm.id', '=', 'ru.objectdepartemenfk')
            ->join('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->join('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->join('mapproduktolaporanrl_m as mprl', 'mprl.produkfk', '=', 'pp.produkfk')
            ->join('jenislaporan_m as jl', 'jl.id', '=', 'mprl.objectjenislaporanfk')
            ->join('kelompoklaporan_m as kl', 'kl.id', '=', 'mprl.objectkontenlaporanfk')
            ->join('detailjenisproduk_m as djp', 'djp.id', '=', 'pr.objectdetailjenisprodukfk')
            ->join('jenisproduk_m as jp', 'jp.id', '=', 'djp.objectjenisprodukfk')
            ->join('asalrujukan_m as ar', 'ar.id', '=', 'apd.objectasalrujukanfk')
            ->leftjoin('statuskeluar_m as stk', 'stk.id', '=', 'pd.objectstatuskeluarfk')
            ->leftJoin('kelompokproduk_m as kp', 'kp.id', '=', 'jp.objectkelompokprodukfk')
            ->select(
                'pp.tglpelayanan',
                'pp.produkfk',
                'pr.namaproduk',
                'apd.objectasalrujukanfk',
                'ar.asalrujukan',
                'pd.objectstatuskeluarfk',
                'apd.objectruanganfk',
                'kl.kelompoklaporan as jenispelayanan'
                //                DB::raw('(case when pr.id =402494 then \'Persalinan Normal\'
                //                        when pr.id in (15375,15386,15387,15388,15477) then \'Sectio Caesaria\'
                //                        else \'-\'
                //                         end) as jenispelayanan ')
            )
            //            ->where('dpm.id', 24)
            ->where('pd.kdprofile', $idProfile)
            ->where('jl.id', $KdJenisLapPerinatologi) //laporan RL 35
            ->whereIn('apd.objectruanganfk', $kdListRuanganKebidanan);


        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pp.tglpelayanan', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];
            $data = $data->where('pp.tglpelayanan', '<=', $tgl);
        }

        $data = $data->get();

        $data10 = [];
        $jml = 0;
        $rujukanRS = 0;
        $rujukanBidan = 0;
        $rujukanPuskes = 0;
        $rujukanFaskesLain = 0;
        $jmlMedisHidup = 0;
        $jmlMedisMati = 0;
        $jmlTotalMedis = 0;
        $jmlNonMedisHidup = 0;
        $jmlNonMedisMati = 0;
        $jmlTotalNonMedis = 0;
        $nonRujukanHidup = 0;
        $nonRujukanMati = 0;
        $totalNonRujukan = 0;
        $dirujuk = 0;
        $sama = false;


        foreach ($data as $item) {
            $sama = false;
            $i = 0;
            $o = 0;
            foreach ($data10 as $hideung) {
                if ($item->jenispelayanan == $data10[$i]['jenispelayanan']) {
                    $sama = true;
                    $jml = (float)$hideung['jumlah'] + 1;
                    $data10[$i]['jumlah'] = $jml;

                    //RS=2, puskes=1, faskeslan=3, non rujikan =5, klinik=3
                    //statuskeluar --->1 pulang , 2 pindah,3 rajal, 4 rujuk, 5 meningggal

                    if ($item->objectasalrujukanfk == 2) {
                        $data10[$i]['rujukanRS'] = (float)$hideung['rujukanRS'] + 1;
                    } else if ($item->objectasalrujukanfk == 1) {
                        $data10[$i]['rujukanPuskes'] = (float)$hideung['rujukanPuskes'] + 1;
                    } else if ($item->objectasalrujukanfk == 3 || $item->objectasalrujukanfk == 4) {
                        $data10[$i]['rujukanFaskesLain'] = (float)$hideung['rujukanFaskesLain'] + 1;
                    }
                    if (($item->objectasalrujukanfk == 2 || $item->objectasalrujukanfk == 1 || $item->objectasalrujukanfk == 3) && $item->objectstatuskeluarfk == 1) {
                        $data10[$i]['jmlMedisHidup'] = (float)$hideung['jmlMedisHidup'] + 1;
                    } else if (($item->objectasalrujukanfk == 2 || $item->objectasalrujukanfk == 1 || $item->objectasalrujukanfk == 3) && $item->objectstatuskeluarfk == 5) {
                        $data10[$i]['jmlMedisMati'] = (float)$hideung['jmlMedisMati'] + 1;
                    }
                    if (($item->objectasalrujukanfk == 5 || $item->objectasalrujukanfk == 4) && $item->objectstatuskeluarfk == 1) {
                        $data10[$i]['jmlNonMedisHidup'] = (float)$hideung['jmlNonMedisHidup'] + 1;
                    } else if (($item->objectasalrujukanfk == 5 || $item->objectasalrujukanfk == 4) && $item->objectstatuskeluarfk == 5) {
                        $data10[$i]['jmlNonMedisMati'] = (float)$hideung['jmlNonMedisMati'] + 1;
                    }
                    if ($item->objectstatuskeluarfk == 4) {
                        $data10[$i]['dirujuk'] = (float)$hideung['dirujuk'] + 1;
                    }

                    $data10[$i]['jmlTotalMedis'] = $data10[$i]['rujukanRS'] + $data10[$i]['rujukanPuskes'] + $data10[$i]['rujukanFaskesLain'] + $data10[$i]['jmlMedisHidup'] + $data10[$i]['jmlMedisMati'];
                    $data10[$i]['jmlTotalNonMedis'] = $data10[$i]['jmlNonMedisHidup'] + $data10[$i]['jmlNonMedisMati'];
                }
                $i = $i + 1;
            }

            if ($sama == false) {
                if ($item->objectasalrujukanfk == 2) {
                    $rujukanRS = 1;
                    $rujukanBidan = 0;
                    $rujukanPuskes = 0;
                    $rujukanFaskesLain = 0;
                    $jmlMedisHidup = 0;
                    $jmlMedisMati = 0;
                    $jmlTotalMedis = 0;
                    $jmlNonMedisHidup = 0;
                    $jmlNonMedisMati = 0;
                    $jmlTotalNonMedis = 0;
                    $nonRujukanHidup = 0;
                    $nonRujukanMati = 0;
                    $totalNonRujukan = 0;
                    $dirujuk = 0;
                } else if ($item->objectasalrujukanfk == 1) {
                    $rujukanRS = 0;
                    $rujukanBidan = 0;
                    $rujukanPuskes = 1;
                    $rujukanFaskesLain = 0;
                    $jmlMedisHidup = 0;
                    $jmlMedisMati = 0;
                    $jmlTotalMedis = 0;
                    $jmlNonMedisHidup = 0;
                    $jmlNonMedisMati = 0;
                    $jmlTotalNonMedis = 0;
                    $nonRujukanHidup = 0;
                    $nonRujukanMati = 0;
                    $totalNonRujukan = 0;
                    $dirujuk = 0;
                } else if ($item->objectasalrujukanfk == 3 || $item->objectasalrujukanfk == 4) {
                    $rujukanRS = 0;
                    $rujukanBidan = 0;
                    $rujukanPuskes = 0;
                    $rujukanFaskesLain = 1;
                    $jmlMedisHidup = 0;
                    $jmlMedisMati = 0;
                    $jmlTotalMedis = 0;
                    $jmlNonMedisHidup = 0;
                    $jmlNonMedisMati = 0;
                    $jmlTotalNonMedis = 0;
                    $nonRujukanHidup = 0;
                    $nonRujukanMati = 0;
                    $totalNonRujukan = 0;
                    $dirujuk = 0;
                }
                if (($item->objectasalrujukanfk == 2 || $item->objectasalrujukanfk == 1 || $item->objectasalrujukanfk == 3) && $item->objectstatuskeluarfk == 1) {
                    $rujukanRS = 0;
                    $rujukanBidan = 0;
                    $rujukanPuskes = 0;
                    $rujukanFaskesLain = 0;
                    $jmlMedisHidup = 1;
                    $jmlMedisMati = 0;
                    $jmlTotalMedis = 0;
                    $jmlNonMedisHidup = 0;
                    $jmlNonMedisMati = 0;
                    $jmlTotalNonMedis = 0;
                    $nonRujukanHidup = 0;
                    $nonRujukanMati = 0;
                    $totalNonRujukan = 0;
                    $dirujuk = 0;
                } else if (($item->objectasalrujukanfk == 2 || $item->objectasalrujukanfk == 1 || $item->objectasalrujukanfk == 3) && $item->objectstatuskeluarfk == 5) {
                    $rujukanRS = 0;
                    $rujukanBidan = 0;
                    $rujukanPuskes = 0;
                    $rujukanFaskesLain = 0;
                    $jmlMedisHidup = 0;
                    $jmlMedisMati = 1;
                    $jmlTotalMedis = 0;
                    $jmlNonMedisHidup = 0;
                    $jmlNonMedisMati = 0;
                    $jmlTotalNonMedis = 0;
                    $nonRujukanHidup = 0;
                    $nonRujukanMati = 0;
                    $totalNonRujukan = 0;
                    $dirujuk = 0;
                }
                if (($item->objectasalrujukanfk == 5 || $item->objectasalrujukanfk == 4) && $item->objectstatuskeluarfk == 1) {
                    $rujukanRS = 0;
                    $rujukanBidan = 0;
                    $rujukanPuskes = 0;
                    $rujukanFaskesLain = 0;
                    $jmlMedisHidup = 0;
                    $jmlMedisMati = 0;
                    $jmlTotalMedis = 0;
                    $jmlNonMedisHidup = 1;
                    $jmlNonMedisMati = 0;
                    $jmlTotalNonMedis = 0;
                    $nonRujukanHidup = 0;
                    $nonRujukanMati = 0;
                    $totalNonRujukan = 0;
                    $dirujuk = 0;
                } else if (($item->objectasalrujukanfk == 5 || $item->objectasalrujukanfk == 4) && $item->objectstatuskeluarfk == 5) {
                    $rujukanRS = 0;
                    $rujukanBidan = 0;
                    $rujukanPuskes = 0;
                    $rujukanFaskesLain = 0;
                    $jmlMedisHidup = 0;
                    $jmlMedisMati = 0;
                    $jmlTotalMedis = 0;
                    $jmlNonMedisHidup = 0;
                    $jmlNonMedisMati = 1;
                    $jmlTotalNonMedis = 0;
                    $nonRujukanHidup = 0;
                    $nonRujukanMati = 0;
                    $totalNonRujukan = 0;
                    $dirujuk = 0;
                }
                if ($item->objectstatuskeluarfk == 4) {
                    $rujukanRS = 0;
                    $rujukanBidan = 0;
                    $rujukanPuskes = 0;
                    $rujukanFaskesLain = 0;
                    $jmlMedisHidup = 0;
                    $jmlMedisMati = 0;
                    $jmlTotalMedis = 0;
                    $jmlNonMedisHidup = 0;
                    $jmlNonMedisMati = 0;
                    $jmlTotalNonMedis = 0;
                    $nonRujukanHidup = 0;
                    $nonRujukanMati = 0;
                    $totalNonRujukan = 0;
                    $dirujuk = 1;
                }

                $data10[] = array(
                    //                    'produkfk' => $item->produkfk,
                    'jenispelayanan' => $item->jenispelayanan,
                    'jumlah' => 1,

                    'rujukanRS' => $rujukanRS,
                    'rujukanFaskesLain' => $rujukanFaskesLain,
                    'rujukanPuskes' => $rujukanPuskes,
                    'rujukanBidan' => 0,
                    'jmlMedisHidup' => $jmlMedisHidup,
                    'jmlMedisMati' => $jmlMedisMati,
                    'jmlTotalMedis' => $jmlTotalMedis,
                    'jmlNonMedisHidup' => $jmlNonMedisHidup,
                    'jmlNonMedisMati' => $jmlNonMedisMati,
                    'jmlTotalNonMedis' => $jmlTotalNonMedis,
                    'nonRujukanHidup' => $nonRujukanHidup,
                    'nonRujukanMati' => $nonRujukanMati,
                    'totalNonRujukan' => $totalNonRujukan,
                    'dirujuk' => $dirujuk,

                );
            }

            foreach ($data10 as $key => $row) {
                $count[$key] = $row['jumlah'];
            }

            array_multisort($count, SORT_DESC, $data10);
        }
        $result = array(
            'data' => $data10,
            'message' => 'er@epic',

        );

        return $this->respond($result);
    }

    public function getPemeriksaanLabNew(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $KdJenisLapLaboratorium = (int) $this->settingDataFixed('KdJenisLapLaboratorium', $kdProfile);
        $KdDepartemenInstalasiLaboratorium = (int) $this->settingDataFixed('KdDepartemenInstalasiLaboratorium', $kdProfile);
        $dataLogin = $request->all();
        $data = \DB::table('pasiendaftar_t as pd')
            ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('pasien_m as pm', 'pm.id', '=', 'pd.nocmfk')
            ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '= ', 'apd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('departemen_m as dpm', 'dpm.id', '=', 'ru.objectdepartemenfk')
            ->join('produk_m as prd', 'prd.id', '=', 'pp.produkfk')
            ->join('mapproduktolaporanrl_m as mprl', 'mprl.produkfk', '=', 'pp.produkfk')
            ->join('jenislaporan_m as jl', 'jl.id', '=', 'mprl.objectjenislaporanfk')
            ->join('kelompoklaporan_m as kl', 'kl.id', '=', 'mprl.objectkontenlaporanfk')
            ->select(
                //                'prd.namaproduk',
                'kl.kelompoklaporan as namaproduk',
                'pm.objectjeniskelaminfk',
                DB::raw('COUNT(DISTINCT pd.norec) as jmlpasien'),
                DB::raw('COUNT(prd.namaproduk) as jmlproduk')
            )
            ->groupBy('kl.kelompoklaporan', 'pm.objectjeniskelaminfk')
            ->where('ru.objectdepartemenfk', '=', $KdDepartemenInstalasiLaboratorium)
            ->where('pd.kdprofile', $kdProfile)
            ->where('jl.id', $KdJenisLapLaboratorium)
            ->whereBetween('pd.tglregistrasi', [$request['tglAwal'], $request['tglAkhir']])
            ->get();

        // return $this->respond($data);


        $jumlahPasien = [];
        foreach ($data as $pasien) {
            if (!isset($jumlahPasien[$pasien->namaproduk])) {
                $jumlahPasien[$pasien->namaproduk] = (object)[
                    'namaproduk' => $pasien->namaproduk,
                    'jmlpasien' => $pasien->jmlpasien,
                    'jmlproduk' => $pasien->jmlproduk,
                    'jmlproduk_lk' => 0,
                    'jmlproduk_pr' => 0,
                    'rata_lk' => 0,
                    'rata_pr' => 0
                ];
            }

            // Gender-specific counts and averages
            if ($pasien->objectjeniskelaminfk == 1) {
                $jumlahPasien[$pasien->namaproduk]->jmlproduk_lk += $pasien->jmlproduk;
                $jumlahPasien[$pasien->namaproduk]->rata_lk = number_format($pasien->jmlproduk / max(1, $pasien->jmlpasien), 2, '.', '');
            }

            if ($pasien->objectjeniskelaminfk == 2) {
                $jumlahPasien[$pasien->namaproduk]->jmlproduk_pr += $pasien->jmlproduk;
                $jumlahPasien[$pasien->namaproduk]->rata_pr = number_format($pasien->jmlproduk / max(1, $pasien->jmlpasien), 2, '.', '');
            }

            if ($pasien->objectjeniskelaminfk == 0) {
                $jumlahPasien[$pasien->namaproduk]->jmlproduk_lk += $pasien->jmlproduk;
                $jumlahPasien[$pasien->namaproduk]->rata_lk = number_format($pasien->jmlproduk / max(1, $pasien->jmlpasien), 2, '.', '');
            }
        }

        $data = array_values($jumlahPasien);

        $result = array(
            'data' => $data,
            'message' => 'as@cepot',
        );
        return $this->respond($result);
    }

    public function getKetersediaanTTRL(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $paramRuangan = '';
        if (isset($request['namaruangan']) && $request['namaruangan'] != 'undefined' && $request['namaruangan'] != '') {
            $paramRuangan = " and ru.namaruangan ilike '%" . $request['namaruangan'] . "%'";
        }
        $paramKelas = '';
        if (isset($request['kelas']) && $request['kelas'] != 'undefined' && $request['kelas'] != '') {
            $paramKelas = " and kl.namakelas ilike '%" . $request['kelas'] . "%'";
        }

        $data = DB::select(DB::raw("
            select x.kodekelas,
            x.namakelas,x.koderuang,x.namaruang,sum(x.tersedia) as tersedia,sum(x.tersediapria) as tersediapria,
            sum(x.tersediawanita) as tersediawanita,sum(x.tersediapriawanita) as tersediapriawanita,
            sum(x.kapasitas) as kapasitas

            from (SELECT
                    CASE WHEN kmr.kodeexternal IS NOT NULL THEN kmr.kodeexternal ELSE kl.namaexternal END AS kodekelas,
                    ru.ID AS koderuang,
                    CASE WHEN   kmr.kodeexternal IS NOT NULL THEN  kmr.kodeexternal ELSE kl.namakelas END AS namakelas,
                    ru.namaruangan AS namaruang,
                    0 AS tersediapria,
                    0 AS tersediawanita,
                    0 AS tersediapriawanita,
                    COUNT ( tt.ID ) AS kapasitas,
                    SUM ( CASE WHEN sb.ID = 2 THEN 1 ELSE 0 END ) AS tersedia 
                        FROM tempattidur_m AS tt
                        INNER JOIN statusbed_m AS sb ON sb. ID = tt.objectstatusbedfk
                        INNER JOIN kamar_m AS kmr ON kmr. ID = tt.objectkamarfk
                        INNER JOIN kelas_m AS kl ON kl. ID = kmr.objectkelasfk
                        INNER JOIN ruangan_m AS ru ON ru. ID = kmr.objectruanganfk
                        WHERE tt.statusenabled = TRUE
                        AND kmr.statusenabled = TRUE
                        $paramRuangan
                        $paramKelas
                        GROUP BY 
                        kl.namakelas,ru.id,kl.namaexternal,
                        ru.namaruangan, kmr.kodeexternal

            ) as x group by  x.kodekelas,
            x.namakelas,x.koderuang,x.namaruang
        "));

        // Tambahkan kolom terpakai untuk setiap data
        foreach ($data as $item) {
            $item->terpakai = (int)$item->kapasitas - (int)$item->tersedia;
        }

        return $this->respond($data);
    }
    public function getRL319CaraBayar(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $KdJenisLapCaraBayar = (int) $this->settingDataFixed('KdJenisLapCaraBayar', $kdProfile);
        $dataLogin = $request->all();
        $data = \DB::table('pasiendaftar_t as pd ')
            ->join('pasien_m as p', 'p.id', '=', 'pd.nocmfk')
            ->join('antrianpasiendiperiksa_t as apd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->leftJoin('strukbuktipenerimaan_t as sbm', 'sbm.norec', '=', 'pd.nosbmlastfk')
            ->leftJoin('strukbuktipenerimaancarabayar_t as sbmcb', 'sbmcb.nosbmfk', '=', 'sbm.norec')
            //            ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftJoin('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            ->leftJoin('jeniskelamin_m as jk', 'jk.id', '=', 'p.objectjeniskelaminfk')
            ->leftJoin('kelas_m as kel', 'kel.id', '=', 'pd.objectkelasfk')
            ->leftJoin('carabayar_m as cb', 'cb.id', '=', 'sbmcb.objectcarabayarfk')
            ->select(
                'pd.tglregistrasi',
                'p.nocm',
                'pd.noregistrasi',
                'ru.namaruangan',
                'p.namapasien',
                'kp.id',
                'kp.kelompokpasien as kdekelompokpasien',
                'pd.tglpulang as tglpulang',
                'pd.statuspasien',
                'jk.jeniskelamin',
                'p.tgllahir as tglLahir',
                'kel.namakelas',
                'pd.nosbmlastfk',
                'cb.carabayar',
                'ru.objectdepartemenfk as kddepartemen',
                DB::raw('EXTRACT(YEAR FROM current_date) - EXTRACT(YEAR FROM tgllahir) as umur,
                        (case when kp.id in (2,4,10,19,20) then \'Asuransi JKN (BPJS Kesehatan)\'
                         when kp.id = 8 then \'Asuransi Pemerintah Daerah (Jamkesda)\'
                         when kp.id in (3, 5, 22) then \'Asuransi Swasta\'
                         when kp.id = 6 then \'Perjanjian\'
                         when kp.id = 1 then \'Membayar Sendiri\'
                         else \'Lain-lain\' end) as golbayar,
                         (case when kp.id in (2,4,10,19,20) then \'2.1\'
                          when kp.id = 8 then \'2.2\'
                          when kp.id in (3, 5) then \'2.3\'
                          when kp.id = 6 then \'3\'
                          when kp.id = 1 then \'1\'
                          else \'-\' end) as idbayar')

            )

            //     DB::raw('YEAR(GETDATE()) - YEAR(tgllahir) as umur,
            //              (case when kp.id in (2,4,10) then \'Asuransi BPJS\'
            //               when kp.id = 8 then \'Jamkesda\'
            //               when kp.id in (3, 5) then \'Asuransi Swasta\'
            //               when kp.id = 6 then \'Perjanjian\'
            //               when kp.id = 1 then \'Membayar Sendiri\'
            //               else null end) as golbayar,
            //               (case when kp.id in (2,4,10) then \'2.1\'
            //               when kp.id = 8 then \'2.2\'
            //                when kp.id in (3, 5) then \'2.3\'
            //                when kp.id = 6 then \'3\'
            //                when kp.id = 1 then \'1\'
            //                else null end) as idbayar')

            // )
            ->groupBy(
                'pd.tglregistrasi',
                'p.nocm',
                'pd.noregistrasi',
                'ru.namaruangan',
                'p.namapasien',
                'kp.kelompokpasien',
                'pd.tglpulang',
                'pd.statuspasien',
                'jk.jeniskelamin',
                'p.tgllahir',
                'pd.nosbmlastfk',
                'cb.carabayar',
                'kel.namakelas',
                'kp.id',
                'ru.objectdepartemenfk'
            )
            ->where('pd.kdprofile', $kdProfile)
            ->where('kp.id', '<>', 6);

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];
            $data = $data->where('pd.tglregistrasi', '<=', $tgl);
        }
        $data = $data->get();

        $data10 = [];
        $jml = 0;
        $sama = false;
        $pasienKeluarRI = 0;
        $pasienDirawatRI = 0;
        $pasienRawatJalan = 0;
        $pasienLab = 0;
        $pasienRad = 0;
        $pasienLain = 0;

        foreach ($data as $item) {
            $sama = false;
            $i = 0;
            foreach ($data10 as $hideung) {
                if ($item->golbayar == $data10[$i]['golbayar']) {
                    $sama = true;
                    $jml = (float)$hideung['jumlah'] + 1;
                    $data10[$i]['jumlah'] = $jml;
                    //                  Pasien RI Masih Dirawat
                    if ($item->tglpulang == null && $item->kddepartemen == 16) {
                        $data10[$i]['pasienDirawatRI'] = (float)$hideung['pasienDirawatRI'] + 1;
                    } else if ($item->tglpulang != null && $item->kddepartemen == 16) {
                        $data10[$i]['pasienKeluarRI'] = (float)$hideung['pasienKeluarRI'] + 1;
                    }
                    //                    else if ( $item->kddepartemen == 18  ||$item->kddepartemen == 27||$item->kddepartemen ==3) {
                    //                        $data10[$i]['pasienRawatJalan'] = (float)$hideung['pasienRawatJalan'] + 1;
                    //                    }
                    else if ($item->kddepartemen == 27) {
                        $data10[$i]['pasienRad'] = (float)$hideung['pasienRad'] + 1;
                    } else if ($item->kddepartemen == 3) {
                        $data10[$i]['pasienLab'] = (float)$hideung['pasienLab'] + 1;
                    } else if ($item->kddepartemen != 3 && $item->kddepartemen != 27 && $item->kddepartemen != 16) {
                        $data10[$i]['pasienLain'] = (float)$hideung['pasienLain'] + 1;
                    }
                    $data10[$i]['pasienRawatJalan'] = $data10[$i]['pasienLain'] + $data10[$i]['pasienRad'] + $data10[$i]['pasienLab'];
                }
                $i = $i + 1;
            }

            if ($sama == false) {
                //              Pasien RI Masih Dirawat
                //                if ( $item->tglpulang == null && $item->kddepartemen == 16) {
                //                    $pasienKeluarRI = 0; $pasienDirawatRI = 1; $pasienRawatJalan=0; $pasienLab = 0;
                //                    $pasienRad = 0;$pasienLain = 0;
                //                } else if ($item->tglpulang != null && $item->kddepartemen == 16) {
                //                    $pasienKeluarRI = 1; $pasienDirawatRI = 0; $pasienRawatJalan=0; $pasienLab = 0;
                //                    $pasienRad = 0;$pasienLain = 0;
                //                }
                ////               else if ( $item->kddepartemen == 18 &&$item->kddepartemen == 27&&$item->kddepartemen ==3) {
                ////                    $pasienKeluarRI = 0; $pasienDirawatRI = 0; $pasienRawatJalan=1; $pasienLab = 0;
                ////                    $pasienRad = 0;$pasienLain = 0;
                ////                }
                //                else if ( $item->kddepartemen == 27) {
                //                    $pasienKeluarRI = 0; $pasienDirawatRI = 0; $pasienRawatJalan=0; $pasienLab = 1;
                //                    $pasienRad = 0;$pasienLain = 0;
                //                } else if ($item->kddepartemen == 3) {
                //                    $pasienKeluarRI = 0; $pasienDirawatRI = 0; $pasienRawatJalan=0; $pasienLab = 1;
                //                    $pasienRad = 0;$pasienLain = 0;
                //                } else if ($item->kddepartemen != 3 && $item->kddepartemen != 27 && $item->kddepartemen!=16) {
                //                    $pasienKeluarRI = 0; $pasienDirawatRI = 0; $pasienRawatJalan=0; $pasienLab = 0;
                //                    $pasienRad = 0;$pasienLain = 1;
                //                }

                $data10[] = array(
                    'golbayar' => $item->golbayar,
                    'idbayar' => $item->idbayar,
                    'pasienKeluarRI' => $pasienKeluarRI,
                    'pasienDirawatRI' => $pasienDirawatRI,
                    'pasienRawatJalan' => $pasienRawatJalan,
                    'pasienLab' => $pasienLab,
                    'pasienRad' => $pasienRad,
                    'pasienLain' => $pasienLain,
                    'jumlah' => 1,
                );
            }

            foreach ($data10 as $key => $row) {
                $count[$key] = $row['idbayar'];
            }

            array_multisort($count, SORT_ASC, $data10);
        }

        $result = array(
            'data' => $data10,
            'message' => 'er@epic',
        );
        return $this->respond($result);
    }

    public function getDataLaporanRL41new(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $data = collect(DB::select("
            SELECT
                dm.kddiagnosa,
                dm.namadiagnosa,
                SUM ( CASE WHEN ps.objectjeniskelaminfk = 1 THEN 1 ELSE 0 END ) AS laki,
                SUM ( CASE WHEN ps.objectjeniskelaminfk = 2 THEN 1 ELSE 0 END ) AS perempuan,
                COUNT ( * ) AS total,
                SUM ( CASE WHEN pd.tglmeninggal IS NOT NULL AND ps.objectjeniskelaminfk = 1 THEN 1 ELSE 0 END ) AS lakidie,
                SUM ( CASE WHEN pd.tglmeninggal IS NOT NULL AND ps.objectjeniskelaminfk = 2 THEN 1 ELSE 0 END ) AS perempuandie,
                SUM ( CASE WHEN pd.tglmeninggal IS NOT NULL THEN 1 ELSE 0 END ) AS totaldie,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) < INTERVAL '1 hour' AND ps.objectjeniskelaminfk = 1 THEN 1 ELSE 0 END) AS l1,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) < INTERVAL '1 hour' AND ps.objectjeniskelaminfk = 2 THEN 1 ELSE 0 END) AS p1,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '1 hour' AND INTERVAL '23 hours' AND ps.objectjeniskelaminfk = 1 THEN 1 ELSE 0 END) AS l2,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '1 hour' AND INTERVAL '23 hours' AND ps.objectjeniskelaminfk = 2 THEN 1 ELSE 0 END) AS p2,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '1 day' AND INTERVAL '7 days' AND ps.objectjeniskelaminfk = 1 THEN 1 ELSE 0 END) AS l3,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '1 day' AND INTERVAL '7 days' AND ps.objectjeniskelaminfk = 2 THEN 1 ELSE 0 END) AS p3,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '8 days' AND INTERVAL '28 days' AND ps.objectjeniskelaminfk = 1 THEN 1 ELSE 0 END) AS l4,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '8 days' AND INTERVAL '28 days' AND ps.objectjeniskelaminfk = 2 THEN 1 ELSE 0 END) AS p4,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '29 days' AND INTERVAL '3 months' AND ps.objectjeniskelaminfk = 1 THEN 1 ELSE 0 END) AS l5,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '29 days' AND INTERVAL '3 months' AND ps.objectjeniskelaminfk = 2 THEN 1 ELSE 0 END) AS p5,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '3 months' AND INTERVAL '6 months' AND ps.objectjeniskelaminfk = 1 THEN 1 ELSE 0 END) AS l6,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '3 months' AND INTERVAL '6 months' AND ps.objectjeniskelaminfk = 2 THEN 1 ELSE 0 END) AS p6,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '6 months' AND INTERVAL '11 months' AND ps.objectjeniskelaminfk = 1 THEN 1 ELSE 0 END) AS l7,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '6 months' AND INTERVAL '11 months' AND ps.objectjeniskelaminfk = 2 THEN 1 ELSE 0 END) AS p7,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '1 year' AND INTERVAL '4 years' AND ps.objectjeniskelaminfk = 1 THEN 1 ELSE 0 END) AS l8,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '1 year' AND INTERVAL '4 years' AND ps.objectjeniskelaminfk = 2 THEN 1 ELSE 0 END) AS p8,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '5 years' AND INTERVAL '9 years' AND ps.objectjeniskelaminfk = 1 THEN 1 ELSE 0 END) AS l9,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '5 years' AND INTERVAL '9 years' AND ps.objectjeniskelaminfk = 2 THEN 1 ELSE 0 END) AS p9,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '10 years' AND INTERVAL '14 years' AND ps.objectjeniskelaminfk = 1 THEN 1 ELSE 0 END) AS l10,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '10 years' AND INTERVAL '14 years' AND ps.objectjeniskelaminfk = 2 THEN 1 ELSE 0 END) AS p10,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '15 years' AND INTERVAL '19 years' AND ps.objectjeniskelaminfk = 1 THEN 1 ELSE 0 END) AS l11,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '10 years' AND INTERVAL '14 years' AND ps.objectjeniskelaminfk = 2 THEN 1 ELSE 0 END) AS p11,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '20 years' AND INTERVAL '24 years' AND ps.objectjeniskelaminfk = 1 THEN 1 ELSE 0 END) AS l12,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '20 years' AND INTERVAL '24 years' AND ps.objectjeniskelaminfk = 2 THEN 1 ELSE 0 END) AS p12,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '25 years' AND INTERVAL '29 years' AND ps.objectjeniskelaminfk = 1 THEN 1 ELSE 0 END) AS l13,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '25 years' AND INTERVAL '29 years' AND ps.objectjeniskelaminfk = 2 THEN 1 ELSE 0 END) AS p1,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '30 years' AND INTERVAL '34 years' AND ps.objectjeniskelaminfk = 1 THEN 1 ELSE 0 END) AS l23,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '30 years' AND INTERVAL '34 years' AND ps.objectjeniskelaminfk = 2 THEN 1 ELSE 0 END) AS p23,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '35 years' AND INTERVAL '39 years' AND ps.objectjeniskelaminfk = 1 THEN 1 ELSE 0 END) AS l14,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '35 years' AND INTERVAL '39 years' AND ps.objectjeniskelaminfk = 2 THEN 1 ELSE 0 END) AS p14,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '40 years' AND INTERVAL '44 years' AND ps.objectjeniskelaminfk = 1 THEN 1 ELSE 0 END) AS l15,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '40 years' AND INTERVAL '44 years' AND ps.objectjeniskelaminfk = 2 THEN 1 ELSE 0 END) AS p15,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '45 years' AND INTERVAL '49 years' AND ps.objectjeniskelaminfk = 1 THEN 1 ELSE 0 END) AS l16,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '45 years' AND INTERVAL '49 years' AND ps.objectjeniskelaminfk = 2 THEN 1 ELSE 0 END) AS p16,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '50 years' AND INTERVAL '54 years' AND ps.objectjeniskelaminfk = 1 THEN 1 ELSE 0 END) AS l17,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '50 years' AND INTERVAL '54 years' AND ps.objectjeniskelaminfk = 2 THEN 1 ELSE 0 END) AS p17,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '55 years' AND INTERVAL '59 years' AND ps.objectjeniskelaminfk = 1 THEN 1 ELSE 0 END) AS l18,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '55 years' AND INTERVAL '59 years' AND ps.objectjeniskelaminfk = 2 THEN 1 ELSE 0 END) AS p18,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '60 years' AND INTERVAL '64 years' AND ps.objectjeniskelaminfk = 1 THEN 1 ELSE 0 END) AS l19,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '60 years' AND INTERVAL '64 years' AND ps.objectjeniskelaminfk = 2 THEN 1 ELSE 0 END) AS p19,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '65 years' AND INTERVAL '69 years' AND ps.objectjeniskelaminfk = 1 THEN 1 ELSE 0 END) AS l20,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '65 years' AND INTERVAL '69 years' AND ps.objectjeniskelaminfk = 2 THEN 1 ELSE 0 END) AS p20,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '70 years' AND INTERVAL '74 years' AND ps.objectjeniskelaminfk = 1 THEN 1 ELSE 0 END) AS l21,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '70 years' AND INTERVAL '74 years' AND ps.objectjeniskelaminfk = 2 THEN 1 ELSE 0 END) AS p21,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '75 years' AND INTERVAL '79 years' AND ps.objectjeniskelaminfk = 1 THEN 1 ELSE 0 END) AS l25,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '75 years' AND INTERVAL '79 years' AND ps.objectjeniskelaminfk = 2 THEN 1 ELSE 0 END) AS p25,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '80 years' AND INTERVAL '84 years' AND ps.objectjeniskelaminfk = 1 THEN 1 ELSE 0 END) AS l22,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) BETWEEN INTERVAL '80 years' AND INTERVAL '84 years' AND ps.objectjeniskelaminfk = 2 THEN 1 ELSE 0 END) AS p22,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) > INTERVAL '85 years' AND ps.objectjeniskelaminfk = 1 THEN 1 ELSE 0 END) AS l24,
            SUM(CASE WHEN AGE(pd.tglregistrasi, ps.tgllahir) > INTERVAL '85 years' AND ps.objectjeniskelaminfk = 2 THEN 1 ELSE 0 END) AS p24,
            COUNT(*) AS totallp,
                SUM(CASE WHEN ps.objectjeniskelaminfk = 1 AND EXTRACT(YEAR FROM AGE(pd.tglregistrasi, ps.tgllahir)) BETWEEN 1 AND 23 THEN 1 ELSE 0 END) AS l2,
                SUM(CASE WHEN ps.objectjeniskelaminfk = 2 AND EXTRACT(YEAR FROM AGE(pd.tglregistrasi, ps.tgllahir)) BETWEEN 1 AND 23 THEN 1 ELSE 0 END) AS p2,

                SUM(CASE WHEN ps.objectjeniskelaminfk = 1 AND EXTRACT(YEAR FROM AGE(pd.tglregistrasi, ps.tgllahir)) BETWEEN 1 AND 7 THEN 1 ELSE 0 END) AS l3,
                SUM(CASE WHEN ps.objectjeniskelaminfk = 2 AND EXTRACT(YEAR FROM AGE(pd.tglregistrasi, ps.tgllahir)) BETWEEN 1 AND 7 THEN 1 ELSE 0 END) AS p3
            FROM
                antrianpasiendiperiksa_t AS app
                LEFT JOIN diagnosapasien_t AS dp ON dp.noregistrasifk = app.norec
                LEFT JOIN detaildiagnosapasien_t AS ddp ON ddp.objectdiagnosapasienfk = dp.norec
                INNER JOIN diagnosa_m AS dm ON ddp.objectdiagnosafk = dm.
                ID INNER JOIN pasiendaftar_t AS pd ON pd.norec = app.noregistrasifk
                INNER JOIN pasien_m AS ps ON ps.ID = pd.nocmfk
                LEFT JOIN jeniskelamin_m AS jk ON ps.objectjeniskelaminfk = jk.
                ID LEFT JOIN ruangan_m AS ru ON ru.ID = app.objectruanganfk
                LEFT JOIN departemen_m AS dpm ON dpm.ID = ru.objectdepartemenfk 
            WHERE
                app.kdprofile = 30
                AND pd.tglregistrasi BETWEEN '$tglAwal' AND '$tglAkhir'
                AND dpm.id = 16
            GROUP BY
                dm.kddiagnosa,
                dm.namadiagnosa 
            ORDER BY
                total DESC
        "));

        $result = array(
            'data' => $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getDataLaporanRL42new(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $data = collect(DB::select("
            SELECT
                dm.kddiagnosa,
                dm.namadiagnosa,
                SUM ( CASE WHEN ps.objectjeniskelaminfk = 1 THEN 1 ELSE 0 END ) AS laki,
                SUM ( CASE WHEN ps.objectjeniskelaminfk = 2 THEN 1 ELSE 0 END ) AS perempuan,
                COUNT ( * ) AS total,
                SUM ( CASE WHEN pd.tglmeninggal IS NOT NULL AND ps.objectjeniskelaminfk = 1 THEN 1 ELSE 0 END ) AS lakidie,
                SUM ( CASE WHEN pd.tglmeninggal IS NOT NULL AND ps.objectjeniskelaminfk = 2 THEN 1 ELSE 0 END ) AS perempuandie,
                SUM ( CASE WHEN pd.tglmeninggal IS NOT NULL THEN 1 ELSE 0 END ) AS totaldie 
            FROM
                antrianpasiendiperiksa_t AS app
                LEFT JOIN diagnosapasien_t AS dp ON dp.noregistrasifk = app.norec
                LEFT JOIN detaildiagnosapasien_t AS ddp ON ddp.objectdiagnosapasienfk = dp.norec
                INNER JOIN diagnosa_m AS dm ON ddp.objectdiagnosafk = dm.
                ID INNER JOIN pasiendaftar_t AS pd ON pd.norec = app.noregistrasifk
                INNER JOIN pasien_m AS ps ON ps.ID = pd.nocmfk
                LEFT JOIN jeniskelamin_m AS jk ON ps.objectjeniskelaminfk = jk.
                ID LEFT JOIN ruangan_m AS ru ON ru.ID = app.objectruanganfk
                LEFT JOIN departemen_m AS dpm ON dpm.ID = ru.objectdepartemenfk 
            WHERE
                app.kdprofile = 30 
                AND pd.tglregistrasi BETWEEN '$tglAwal' AND '$tglAkhir'
                AND dpm.id = 16
            GROUP BY
                dm.kddiagnosa,
                dm.namadiagnosa 
            ORDER BY
                total DESC
        "));

        $result = array(
            'data' => $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getDataLaporanRL52new(Request $request)
    {
        try {
            $kdProfile = (int) $this->getDataKdProfile($request);

            $datadiagnosa = \DB::table('antrianpasiendiperiksa_t as app')
                ->LEFTJOIN('diagnosapasien_t as dp', 'dp.noregistrasifk', '=', 'app.norec')
                ->LEFTJOIN('detaildiagnosapasien_t as ddp', 'ddp.objectdiagnosapasienfk', '=', 'dp.norec')
                ->JOIN('ruangan_m as rm', 'app.objectruanganfk', '=', 'rm.id')
                ->JOIN('diagnosa_m as dm', 'ddp.objectdiagnosafk', '=', 'dm.id')
                ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'app.noregistrasifk')
                ->JOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                ->LeftJOIN('jeniskelamin_m as jk', 'ps.objectjeniskelaminfk', '=', 'jk.id')
                ->select(
                    \DB::raw("LEFT(dm.kddiagnosa, 3) as kelompok_icd10"),
                    'dm.namadiagnosa',
                    'ps.objectjeniskelaminfk',
                    \DB::raw('COUNT(*) as jumlah_kasus_baru'),
                    \DB::raw('COUNT(DISTINCT (app.noregistrasifk || \'-\' || app.objectruanganfk)) as jumlah_kunjungan')
                )
                ->where('app.kdprofile', $kdProfile)
                // ->whereRaw("LEFT(dm.kddiagnosa, 1) NOT IN ('O80','O82', 'R', 'V', 'W', 'X', 'Y', 'Z')")
                ->where("dp.iskasusbaru", true);

            if (!empty($request['tglAwal'])) {
                $datadiagnosa = $datadiagnosa->where('pd.tglpulang', '>=', $request['tglAwal']);
            }

            if (!empty($request['tglAkhir'])) {
                $datadiagnosa = $datadiagnosa->where('pd.tglpulang', '<=', $request['tglAkhir']);
            }

            $datadiagnosa = $datadiagnosa->groupBy('kelompok_icd10', 'dm.namadiagnosa', 'ps.objectjeniskelaminfk')
                ->get();

            $data10 = [];

            foreach ($datadiagnosa as $item) {
                $kelompokICD = $item->kelompok_icd10;

                if (!isset($data10[$kelompokICD])) {
                    $data10[$kelompokICD] = [
                        'kelompok_icd10' => $kelompokICD,
                        'namadiagnosa' => $item->namadiagnosa,
                        'jumlahL' => 0,
                        'jumlahP' => 0,
                        'total_kasus_baru' => 0,
                        'jumlah_kunjunganL' => 0,
                        'jumlah_kunjunganP' => 0,
                        'total_kunjungan' => 0
                    ];
                }

                if ($item->objectjeniskelaminfk == 1) { // Laki-laki
                    $data10[$kelompokICD]['jumlahL'] += $item->jumlah_kasus_baru;
                    $data10[$kelompokICD]['jumlah_kunjunganL'] += $item->jumlah_kunjungan;
                } else if ($item->objectjeniskelaminfk == 2) { // Perempuan
                    $data10[$kelompokICD]['jumlahP'] += $item->jumlah_kasus_baru;
                    $data10[$kelompokICD]['jumlah_kunjunganP'] += $item->jumlah_kunjungan;
                }

                $data10[$kelompokICD]['total_kasus_baru'] = $data10[$kelompokICD]['jumlahL'] + $data10[$kelompokICD]['jumlahP'];
                $data10[$kelompokICD]['total_kunjungan'] = $data10[$kelompokICD]['jumlah_kunjunganL'] + $data10[$kelompokICD]['jumlah_kunjunganP'];
            }


            usort($data10, function ($a, $b) {
                return $b['total_kasus_baru'] <=> $a['total_kasus_baru'];
            });



            $result = [
                'data' => array_values($data10),
                'message' => 'Data laporan berhasil diambil',
            ];

            return $this->respond($result);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function getDataLaporanRL53new(Request $request)
    {
        try {
            $kdProfile = (int) $this->getDataKdProfile($request);

            $datadiagnosa = \DB::table('antrianpasiendiperiksa_t as app')
                ->LEFTJOIN('diagnosapasien_t as dp', 'dp.noregistrasifk', '=', 'app.norec')
                ->LEFTJOIN('detaildiagnosapasien_t as ddp', 'ddp.objectdiagnosapasienfk', '=', 'dp.norec')
                ->JOIN('ruangan_m as rm', 'app.objectruanganfk', '=', 'rm.id')
                ->JOIN('diagnosa_m as dm', 'ddp.objectdiagnosafk', '=', 'dm.id')
                ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'app.noregistrasifk')
                ->JOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                ->LeftJOIN('jeniskelamin_m as jk', 'ps.objectjeniskelaminfk', '=', 'jk.id')
                ->select(
                    \DB::raw("LEFT(dm.kddiagnosa, 3) as kelompok_icd10"),
                    'dm.namadiagnosa',
                    'ps.objectjeniskelaminfk',
                    \DB::raw('COUNT(*) as jumlah_kasus_baru'),
                    \DB::raw('COUNT(DISTINCT (app.noregistrasifk || \'-\' || app.objectruanganfk)) as jumlah_kunjungan')
                )
                ->where('app.kdprofile', $kdProfile)
                // ->whereRaw("LEFT(dm.kddiagnosa, 1) NOT IN ('O80','O82', 'R', 'V', 'W', 'X', 'Y', 'Z')")
                // ->whereRaw("LEFT(dm.kddiagnosa, 1) ")
                ->where("dp.iskasusbaru", true);

            if (!empty($request['tglAwal'])) {
                $datadiagnosa = $datadiagnosa->where('pd.tglpulang', '>=', $request['tglAwal']);
            }

            if (!empty($request['tglAkhir'])) {
                $datadiagnosa = $datadiagnosa->where('pd.tglpulang', '<=', $request['tglAkhir']);
            }

            $datadiagnosa = $datadiagnosa->groupBy('kelompok_icd10', 'dm.namadiagnosa', 'ps.objectjeniskelaminfk')
                ->get();

            $data10 = [];

            foreach ($datadiagnosa as $item) {
                $kelompokICD = $item->kelompok_icd10;

                if (!isset($data10[$kelompokICD])) {
                    $data10[$kelompokICD] = [
                        'kelompok_icd10' => $kelompokICD,
                        'namadiagnosa' => $item->namadiagnosa,
                        'jumlahL' => 0,
                        'jumlahP' => 0,
                        'total_kasus_baru' => 0,
                        'jumlah_kunjunganL' => 0,
                        'jumlah_kunjunganP' => 0,
                        'total_kunjungan' => 0
                    ];
                }

                if ($item->objectjeniskelaminfk == 1) { // Laki-laki
                    $data10[$kelompokICD]['jumlahL'] += $item->jumlah_kasus_baru;
                    $data10[$kelompokICD]['jumlah_kunjunganL'] += $item->jumlah_kunjungan;
                } else if ($item->objectjeniskelaminfk == 2) { // Perempuan
                    $data10[$kelompokICD]['jumlahP'] += $item->jumlah_kasus_baru;
                    $data10[$kelompokICD]['jumlah_kunjunganP'] += $item->jumlah_kunjungan;
                }

                $data10[$kelompokICD]['total_kasus_baru'] = $data10[$kelompokICD]['jumlahL'] + $data10[$kelompokICD]['jumlahP'];
                $data10[$kelompokICD]['total_kunjungan'] = $data10[$kelompokICD]['jumlah_kunjunganL'] + $data10[$kelompokICD]['jumlah_kunjunganP'];
            }


            usort($data10, function ($a, $b) {
                return $b['total_kunjungan'] <=> $a['total_kunjungan'];
            });



            $result = [
                'data' => array_values($data10),
                'message' => 'Data laporan berhasil diambil',
            ];

            return $this->respond($result);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }
}
