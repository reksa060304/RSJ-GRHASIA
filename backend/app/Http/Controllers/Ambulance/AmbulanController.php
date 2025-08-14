<?php

/**
 * Created by PhpStorm.
 * PiutangController
 * User: Efan Andrian (ea@epic)
 * Date: 22/10/2019
 * Time: 14:25 PM
 */

namespace App\Http\Controllers\Ambulance;

use App\Http\Controllers\ApiController;
use App\Traits\Valet;
use App\Transaksi\AntrianPasienDiperiksa;
use App\Transaksi\OrderPelayanan;
use App\Transaksi\PanssecHistory;
use App\Transaksi\PasienDaftar;
use App\Transaksi\PelayananPasien;
use App\Transaksi\PelayananPasienDetail;
use App\Transaksi\PelayananPasienPetugas;
use App\Transaksi\PetugasPelayananAmbulan;
use App\Transaksi\StrukOrder;
use App\Transaksi\StrukPelayanan;
use App\Transaksi\StrukPelayananDetail;
use DB;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AmbulanController extends ApiController
{
    use Valet;
    public function __construct()
    {
        parent::__construct($skip_authentication = false);
    }

    public function getDataApdAmbulance(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $Ruangan = explode(',', $this->settingDataFixed('KdRuanganAmbulance', $idProfile));
        $listRuangan = [];
        foreach ($Ruangan as $itemRuangan) {
            $listRuangan[] = (int) $itemRuangan;
        }
        $data = \DB::table('antrianpasiendiperiksa_t as apd')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->join('kelas_m as kls', 'kls.id', '=', 'apd.objectkelasfk')
            ->select(
                'apd.norec as norec_apd',
                'ps.nocm',
                'ps.id as nocmfk',
                'ps.namapasien',
                'pd.noregistrasi',
                'apd.objectruanganfk as id',
                'ru.objectdepartemenfk',
                'ru.namaruangan',
                'apd.tglregistrasi',
                'kls.namakelas',
                'apd.objectruanganasalfk'
            )
            ->whereIn('apd.objectruanganfk', $listRuangan)
            ->where('pd.noregistrasi', $request['noregistrasi'])
            ->where('apd.kdprofile', $idProfile)
            ->orderBy('pd.objectruanganlastfk')
            ->get();

        $result = array(
            'data' => $data,
            'message' => 'er@epic',
        );
        return $this->respond($result);
    }

    public function getKelompokUser(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $detailLogin = $request->all();
        $data = \DB::table('kelompokuser_s as ku')
            ->join('loginuser_s as lu', 'lu.objectkelompokuserfk', '=', 'ku.id')
            ->select('ku.id', 'ku.kelompokuser', 'lu.namauser')
            ->where('ku.kdprofile', $idProfile)
            ->where('lu.id', $request['luId'])
            ->first();
        $result = array(
            "data" => $data,
            "as" => 'as@rmdn',
        );
        return $this->respond($result);
    }

    public function GetDataForComboAmbulan(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $deptPelayanan = explode(',', $this->settingDataFixed('kdDepartemenPelayanan', $idProfile));
        $deptRanapGawat = explode(',', $this->settingDataFixed('KdRanapIgd', $idProfile));
        $deptAmbulan = (int) $this->settingDataFixed('KdInstalasiAmbulan', $idProfile);
        $KelUserKasir = $this->settingDataFixed('KdKelompokUser', $idProfile);
        // return $deptAmbulan;
        $deptZenajah = (int) $this->settingDataFixed('KdInstalasiJenazah', $idProfile);
        $kdJeniPegawaiDokter = (int) $this->settingDataFixed('KdJenisPegawaiDokter', $idProfile);
        $kdDepartemenRawatPelayanan = [];
        $kdDeptRanapGawat = [];
        $kdPelayananAmbulan = (int) $this->settingDataFixed('KdKelompokTransaksiAmbulance', $idProfile);
        foreach ($deptPelayanan as $itemPelayanan) {
            $kdDepartemenRawatPelayanan[] =  (int)$itemPelayanan;
        }
        foreach ($deptRanapGawat as $items) {
            $kdDeptRanapGawat[] = (int)$items;
        }
        $ruangan = \DB::table('ruangan_m as r')
            ->select('r.id', 'r.namaruangan', 'r.objectdepartemenfk')
            ->where('statusenabled', 'true')
            ->where('r.kdprofile', $idProfile)
            ->wherein('r.objectdepartemenfk', $kdDeptRanapGawat)
            ->get();

        $RuanganAmbulan = \DB::table('ruangan_m as r')
            ->select('r.id', 'r.namaruangan', 'r.objectdepartemenfk')
            ->where('statusenabled', 'true')
            ->where('r.kdprofile', $idProfile)
            ->where('r.objectdepartemenfk', $deptAmbulan)
            ->get();

        $dataAmbulan = \DB::table('departemen_m as dp')
            ->select('dp.id', 'dp.namadepartemen as departemen')
            ->where('dp.kdprofile', $idProfile)
            ->where('dp.id', $deptAmbulan)
            ->where('dp.statusenabled', true)
            ->get();

        $dataInstalasi = \DB::table('departemen_m as dp')
            ->select('dp.id', 'dp.namadepartemen as departemen')
            ->where('dp.kdprofile', $idProfile)
            ->where('dp.statusenabled', true)
            ->get();

        $dokter = \DB::table('pegawai_m as p')
            ->select('p.id', 'p.namalengkap as namadokter')
            ->where('p.kdprofile', $idProfile)
            ->where('p.objectjenispegawaifk', $kdJeniPegawaiDokter)
            ->where('statusenabled', 'true')
            ->get();

        $hubunganKeluarga = \DB::table('hubungankeluarga_m as h')
            ->select('h.id', 'h.hubungankeluarga')
            ->where('h.kdprofile', $idProfile)
            ->where('h.statusenabled', 'true')
            ->get();

        $dataKelompok = \DB::table('kelompokpasien_m as kp')
            ->select('kp.id', 'kp.kelompokpasien')
            ->where('kp.kdprofile', $idProfile)
            ->where('kp.statusenabled', true)
            ->get();

        $dataJenisPetugas = \DB::table('jenispetugaspelaksana_m as kp')
            ->select('kp.id', 'kp.jenispetugaspe')
            ->where('kp.kdprofile', $idProfile)
            ->where('kp.statusenabled', true)
            ->get();

        $dataRuanganPelayanan = \DB::table('ruangan_m as r')
            ->select('r.id', 'r.namaruangan')
            ->where('r.kdprofile', $idProfile)
            ->where('statusenabled', 'true')
            ->whereIn('objectdepartemenfk', $kdDepartemenRawatPelayanan)
            ->get();

        $dataKelompokTransaksiAmbulan = \DB::table('kelompoktransaksi_m as r')
            ->select('r.id', 'r.kelompoktransaksi')
            ->where('r.kdprofile', $idProfile)
            ->where('statusenabled', 'true')
            ->where('r.id', $kdPelayananAmbulan)
            ->get();

        $listJenisKegiatan = \DB::table('jeniskegiatanambulan_m as jka')
            ->select('jka.namajeniskegiatan')
            ->where('jka.kdprofile', $idProfile)
            ->where('statusenabled', 'true')
            ->get();

        $result = array(
            'ruangan' => $ruangan,
            'ruanganambulan' => $RuanganAmbulan,
            'dokter' => $dokter,
            'hubunganKeluarga' => $hubunganKeluarga,
            'departemen' => $dataAmbulan,
            'kelompokpasien' => $dataKelompok,
            'jenispetugaspe' => $dataJenisPetugas,
            'ruanganpelayanan' => $dataRuanganPelayanan,
            'kelompoktransaksi' => $dataKelompokTransaksiAmbulan,
            'jeniskegiatanambulan' => $listJenisKegiatan,
            'keluserkasir' => $KelUserKasir
        );

        return $this->respond($result);
    }

    public function getDaftarOrderAmbulan(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin = $request->all();
        $result = [];
        $data = \DB::table('strukorder_t as so')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'so.noregistrasifk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftJoin('jeniskelamin_m as klm', 'klm.id', '=', 'ps.objectjeniskelaminfk')
            ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'so.objectruanganfk')
            ->leftJoin('ruangan_m as ru2', 'ru2.id', '=', 'so.objectruangantujuanfk')
            ->leftJoin('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
            ->leftJoin('departemen_m as dp2', 'dp2.id', '=', 'ru2.objectdepartemenfk')
            ->leftJoin('kelompokpasien_m as kps', 'kps.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftJoin('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'so.objectpegawaiorderfk')
            ->leftJoin('pegawai_m as pg2', 'pg2.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('pelayananpasien_t as pp', 'pp.strukorderfk', '=', 'so.norec')
            ->leftJoin('jenispelayanan_m as jp', 'jp.kodeinternal', '=', 'pd.jenispelayanan')
            ->select(
                'so.norec as norec_so',
                'pd.norec as norec_pd',
                'so.noorder',
                'pd.noregistrasi',
                'pd.tglregistrasi',
                'pd.tglpulang',
                'ps.nocm',
                'ps.namapasien',
                'klm.jeniskelamin',
                'ps.tgllahir',
                'pd.objectrekananfk',
                'kps.kelompokpasien',
                'dp.namadepartemen',
                'pd.objectkelasfk',
                'kls.namakelas',
                'so.objectruangantujuanfk',
                'so.objectruanganfk',
                'pd.objectkelompokpasienlastfk',
                'ru.objectdepartemenfk',
                'ru2.objectdepartemenfk as iddeptujuan',
                'so.objectpegawaiorderfk',
                'pg.namalengkap as pegawaiorder',
                'so.tglorder',
                'pd.jenispelayanan as idjenisPelayanan',
                'jp.jenispelayanan',
                'ru.namaruangan',
                'ru2.namaruangan as ruangantujuan',
                'so.tglpelayananakhir',
                'pg2.namalengkap as dpjp',
                'so.tglrencana',
                (DB::raw("case when pp.strukorderfk is null then 'MASUK' else
                                    'Sudah Verifikasi' end as status"))
            )
            ->where('so.kdprofile', $idProfile)
            ->where('ru2.objectdepartemenfk', $this->settingDataFixed('KdInstalasiAmbulan', $idProfile))->where('so.statusenabled', true);

        if (isset($request['isNotVerif']) && $request['isNotVerif'] != "" && $request['isNotVerif'] != "undefined") {
            if ($request['isNotVerif'] == true) {
                $data = $data->whereNull('pp.strukorderfk');
            }
        }
        //        if($dataruangan[0]->objectdepartemenfk != 27 && $dataruangan[0]->objectdepartemenfk != 3 && $dataruangan[0]->objectdepartemenfk != 25){
        //            $tgltgltgl= date('Y-m-d H:i:s');
        //            $data = $data->where('so.tglpelayananakhir','>=', $tgltgltgl);
        //        }

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('so.tglorder', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];
            $data = $data->where('so.tglorder', '<=', $tgl);
        }
        if (isset($request['tglAwalOperasi']) && $request['tglAwalOperasi'] != "" && $request['tglAwalOperasi'] != "undefined") {
            $data = $data->where('so.tglpelayananakhir', '>=', $request['tglAwalOperasi']);
        }
        if (isset($request['tglAkhirOperasi']) && $request['tglAkhirOperasi'] != "" && $request['tglAkhirOperasi'] != "undefined") {
            $tgl = $request['tglAkhirOperasi'];
            $data = $data->where('so.tglpelayananakhir', '<=', $tgl);
        }
        if (isset($request['tglAwalRen']) && $request['tglAwalRen'] != "" && $request['tglAwalRen'] != "undefined") {
            $data = $data->where('so.tglrencana', '>=', $request['tglAwalRen']);
        }
        if (isset($request['tglAkhirRen']) && $request['tglAkhirRen'] != "" && $request['tglAkhirRen'] != "undefined") {
            $tgl = $request['tglAkhirRen'];
            $data = $data->where('so.tglrencana', '<=', $tgl);
        }
        if (isset($request['idRuanganOrder']) && $request['idRuanganOrder'] != "" && $request['idRuanganOrder'] != "undefined") {
            $data = $data->where('so.objectruanganfk', '=', $request['idRuanganOrder']);
        }

        if (isset($request['pegId']) && $request['pegId'] != "" && $request['pegId'] != "undefined") {
            $data = $data->where('so.objectpegawaiorderfk', '=', $request['pegId']);
        }
        if (isset($request['idRuanganTujuan']) && $request['idRuanganTujuan'] != "" && $request['idRuanganTujuan'] != "undefined") {
            $data = $data->where('so.objectruangantujuanfk', '=', $request['idRuanganTujuan']);
        }
        if (isset($request['kelId']) && $request['kelId'] != "" && $request['kelId'] != "undefined") {
            $data = $data->where('pd.objectkelompokpasienlastfk', '=', $request['kelId']);
        }
        if (isset($request['noregistrasi']) && $request['noregistrasi'] != "" && $request['noregistrasi'] != "undefined") {
            $data = $data->where('pd.noregistrasi', 'ilike', '%' . $request['noregistrasi'] . '%');
        }
        if (isset($request['nocm']) && $request['nocm'] != "" && $request['nocm'] != "undefined") {
            $data = $data->where('ps.nocm', 'ilike', '%' . $request['nocm'] . '%');
        }
        if (isset($request['namapasien']) && $request['namapasien'] != "" && $request['namapasien'] != "undefined") {
            $data = $data->where('ps.namapasien', 'ilike', '%' . $request['namapasien'] . '%');
        }
        if (isset($request['noOrders']) && $request['noOrders'] != "" && $request['noOrders'] != "undefined") {
            $data = $data->where('so.noorder', 'ilike', '%' . $request['noOrders'] . '%');
        }
        if (isset($request['jmlRow']) && $request['jmlRow'] != "" && $request['jmlRow'] != "undefined") {
            $data = $data->take($request['jmlRow']);
        }
        $data = $data->orderBy('so.noorder', 'desc');
        //        $data = $data->take(100);
        $data = $data->distinct();
        $data = $data->get();

        $dataResult = array(
            'message' =>  'inhuman',
            'data' =>  $data,
        );
        return $this->respond($dataResult);
    }


    public function saveOrderAmbulan(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $detLogin = $request->all();
        if ($request['pegawaiorderfk'] == "") {
            $dokter2 = null;
        } else {
            $dokter2 = $request['pegawaiorderfk'];
        }
        DB::beginTransaction();
        try {
            if ($request['departemenfk'] == 3) {
                $noOrder = $this->generateCode(new StrukOrder, 'noorder', 11, 'L' . $this->getDateTime()->format('ym'), $idProfile);
            }
            if ($request['departemenfk'] == 27) {
                $noOrder = $this->generateCode(new StrukOrder, 'noorder', 11, 'R' . $this->getDateTime()->format('ym'), $idProfile);
            }
            if ($request['departemenfk'] == 25) {
                $noOrder = $this->generateCode(new StrukOrder, 'noorder', 11, 'OK' . $this->getDateTime()->format('ym'), $idProfile);
            }
            if ($request['departemenfk'] == 5) {
                $noOrder = $this->generateCode(new StrukOrder, 'noorder', 11, 'PJ' . $this->getDateTime()->format('ym'), $idProfile);
            }
            if ($request['departemenfk'] == 31) {
                $noOrder = $this->generateCode(new StrukOrder, 'noorder', 11, 'ABM' . $this->getDateTime()->format('ym'), $idProfile);
            }

            $dataPD = PasienDaftar::where('norec', $request['norec_pd'])->first();
            if ($request['norec_so'] == "") {
                $dataSO = new StrukOrder;
                $dataSO->norec = $dataSO->generateNewId();
                $dataSO->kdprofile = $idProfile;
                $dataSO->statusenabled = true;
                $dataSO->nocmfk = $dataPD->nocmfk; //$dataPD;
                //            $dataSO->cito = '0';
                //            $dataSO->objectdiagnosafk = true;
                $dataSO->isdelivered = 1;
                $dataSO->noorder = $noOrder;
                $dataSO->noorderintern = $noOrder;
                $dataSO->noregistrasifk = $dataPD->norec; //$dataAPD['noregistrasifk'];
                $dataSO->objectpegawaiorderfk = $dokter2; //$request['pegawaiorderfk'];
                $dataSO->qtyjenisproduk = 1;
                $dataSO->qtyproduk = $request['qtyproduk'];
                $dataSO->objectruanganfk = $request['objectruanganfk'];
                $dataSO->objectruangantujuanfk = $request['objectruangantujuanfk'];
                if ($request['departemenfk'] == 3) {
                    $dataSO->keteranganorder = 'Order Laboratorium';
                    $dataSO->objectkelompoktransaksifk = 93;
                }
                if ($request['departemenfk'] == 27) {
                    $dataSO->keteranganorder = 'Order Radiologi';
                    $dataSO->objectkelompoktransaksifk = 94;
                }
                if ($request['departemenfk'] == 25) {
                    $dataSO->keteranganorder = 'Pesan Jadwal Operasi';
                    $dataSO->objectkelompoktransaksifk = 22;
                    $dataSO->tglpelayananakhir = $request['tgloperasi'];
                    $dataSO->tglpelayananawal = $request['tgloperasi'];
                }
                if ($request['departemenfk'] == 5) {
                    $dataSO->keteranganorder = 'Pelayanan Pemulasaraan Jenazah';
                    $dataSO->objectkelompoktransaksifk = 99;
                }
                if ($request['departemenfk'] == 31) {
                    $dataSO->keteranganorder = 'Pesan Ambulan';
                    $dataSO->objectkelompoktransaksifk = 9;
                    $dataSO->tglrencana = $request['tglrencana'];
                }
                if (isset($request['keterangan'])) {
                    $dataSO->keteranganlainnya = $request['keterangan'];
                }
                $dataSO->tglorder = date('Y-m-d H:i:s');
                $dataSO->totalbeamaterai = 0;
                $dataSO->totalbiayakirim = 0;
                $dataSO->totalbiayatambahan = 0;
                $dataSO->totaldiscount = 0;
                $dataSO->totalhargasatuan = 0;
                $dataSO->totalharusdibayar = 0;
                $dataSO->totalpph = 0;
                $dataSO->totalppn = 0;
                $dataSO->save();

                $dataSOnorec = $dataSO->norec;


                foreach ($request['details'] as $item) {
                    if ($request['status'] == 'bridinglangsung') {
                        $updatePP = PelayananPasien::where('norec', $item['norec_pp'])
                            ->where('kdprofile', $idProfile)
                            ->update(
                                [
                                    'strukorderfk' => $dataSOnorec
                                ]
                            );
                    }

                    $dataOP = new OrderPelayanan;
                    $dataOP->norec = $dataOP->generateNewId();
                    $dataOP->kdprofile = $idProfile;
                    $dataOP->statusenabled = true;
                    if (isset($item['iscito'])) {
                        $dataOP->iscito = (float)$item['iscito'];
                    } else {
                        $dataOP->iscito = 0;
                    }

                    $dataOP->noorderfk = $dataSOnorec;
                    $dataOP->objectprodukfk = $item['produkfk'];
                    $dataOP->qtyproduk = $item['qtyproduk'];
                    $dataOP->objectkelasfk = $item['objectkelasfk'];
                    $dataOP->qtyprodukretur = 0;
                    $dataOP->objectruanganfk = $request['objectruanganfk'];
                    $dataOP->objectruangantujuanfk = $request['objectruangantujuanfk'];
                    $dataOP->strukorderfk = $dataSOnorec;
                    if (isset($item['pemeriksaanluar'])) {
                        if ($item['pemeriksaanluar'] == 1) {
                            $dataOP->keteranganlainnya = 'isPemeriksaanKeluar';
                        }
                    }

                    if (isset($item['tglrencana'])) {
                        $dataOP->tglpelayanan = $item['tglrencana'];
                    } else {
                        $dataOP->tglpelayanan = date('Y-m-d H:i:s');
                    }

                    $dataOP->strukorderfk = $dataSOnorec;
                    if (isset($item['dokterid']) && $item['dokterid'] != "") {
                        $dataOP->objectnamapenyerahbarangfk = $item['dokterid'];
                    }
                    $dataOP->save();
                }
            } else {

                foreach ($request['details'] as $item) {
                    $dataOP = new OrderPelayanan;
                    $dataOP->norec = $dataOP->generateNewId();
                    $dataOP->kdprofile = $idProfile;
                    $dataOP->statusenabled = true;
                    if (isset($item['iscito'])) {
                        $dataOP->iscito = (float)$item['iscito'];
                    } else {
                        $dataOP->iscito = 0;
                    }

                    $dataOP->noorderfk = $request['norec_so'];
                    $dataOP->objectprodukfk = $item['produkfk'];
                    $dataOP->qtyproduk = $item['qtyproduk'];
                    $dataOP->objectkelasfk = $item['objectkelasfk'];
                    $dataOP->qtyprodukretur = 0;
                    $dataOP->objectruanganfk = $request['objectruanganfk'];
                    $dataOP->objectruangantujuanfk = $request['objectruangantujuanfk'];
                    $dataOP->strukorderfk = $request['norec_so'];

                    if (isset($item['tglrencana'])) {
                        $dataOP->tglpelayanan = $item['tglrencana'];
                    } else {
                        $dataOP->tglpelayanan = date('Y-m-d H:i:s');
                    }

                    if (isset($item['dokterid']) && $item['dokterid'] != "") {
                        $dataOP->objectnamapenyerahbarangfk = $item['dokterid'];
                    }
                    $dataOP->save();
                }
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan OrderPelayanan";
        }

        if ($transStatus == 'true') {
            if ($request['norec_so'] == "") {
                $transMessage = "Simpan Order Pelayanan";
                DB::commit();
                $result = array(
                    "status" => 201,
                    "message" => $transMessage,
                    "strukorder" => $dataSO,
                    "as" => 'inhuman',
                );
            } else {
                $transMessage = "Simpan Order Pelayanan";
                DB::commit();
                $result = array(
                    "status" => 201,
                    "message" => $transMessage,
                    "as" => 'inhuman',
                );
            }
        } else {
            $transMessage = "Simpan Order Pelayanan gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function hapusOrderPelayananAmbulan(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        DB::beginTransaction();
        try {
            StrukOrder::where('norec', $request['norec_order'])->where('kdprofile', $idProfile)->update(['statusenabled' => false]);

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Data Terhapus";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                //                    "strukorder" => $dataSO,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Hapus Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getRiwayatOrderPelayananAmbulan(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $results = [];
        $ruanganLab = explode(',', $this->settingDataFixed('KdRuanganAmbulance', $idProfile));
        $kdRuangLab = [];
        foreach ($ruanganLab as $item) {
            $kdRuangLab[] = (int)$item;
        }
        $data = \DB::table('strukorder_t as so')
            ->LEFTJOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'so.noregistrasifk')
            ->JOIN('pasien_m as pas', 'pas.id', '=', 'pd.nocmfk')
            ->LEFTJOIN('ruangan_m as ru', 'ru.id', '=', 'so.objectruanganfk')
            ->LEFTJOIN('ruangan_m as ru2', 'ru2.id', '=', 'so.objectruangantujuanfk')
            ->LEFTJOIN('pegawai_m as p', 'p.id', '=', 'so.objectpegawaiorderfk')
            ->select(
                'so.norec',
                'pd.norec as norecpd',
                'pd.noregistrasi',
                'so.tglorder',
                'so.noorder',
                'ru.namaruangan as ruanganasal',
                'ru2.namaruangan as ruangantujuan',
                'p.namalengkap',
                'so.noorder',
                'pd.noregistrasi',
                'so.keteranganlainnya'
            )
            ->where('pd.kdprofile', $idProfile);
        if (isset($request['noregistrasi']) && $request['noregistrasi'] != "" && $request['noregistrasi'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $request['noregistrasi']);
        }
        if (isset($request['NoCM']) && $request['NoCM'] != "" && $request['NoCM'] != "undefined") {
            $data = $data->where('pas.nocm', 'ilike', '%' . $request['NoCM'] . '%');
        }
        $data = $data->whereIn('so.objectruangantujuanfk', $kdRuangLab);
        $data = $data->where('so.statusenabled', true);
        $data = $data->orderBy('so.tglorder');
        $data = $data->get();

        //$results =array();
        foreach ($data as $item) {
            $noorder = $item->noorder;
            $hasil = DB::select(DB::raw("select * from order_lab where no_lab='$noorder'"));
            if (count($hasil) > 0) {
                $item->statusorder = 'SELESAI DIPERIKSA';
            } else {
                $item->statusorder = 'PENDING';
            }
            $details = DB::select(
                DB::raw("
                            select so.tglorder,so.noorder,
                            pr.id,pr.namaproduk,op.qtyproduk
                            from strukorder_t as so
                            left join orderpelayanan_t as op on op.noorderfk = so.norec
                            left join pasiendaftar_t as pd on pd.norec=so.noregistrasifk
                            left join produk_m as pr on pr.id=op.objectprodukfk
                            left join ruangan_m as ru on ru.id=so.objectruanganfk
                            left join ruangan_m as ru2 on ru2.id=so.objectruangantujuanfk
                            left join pegawai_m as p on p.id=so.objectpegawaiorderfk
                            where so.kdprofile = $idProfile and so.noorder=:noorder"),
                array(
                    'noorder' => $item->noorder,
                )
            );
            $results[] = array(
                'noregistrasi' => $item->noregistrasi,
                'tglorder' => $item->tglorder,
                'noorder' => $item->noorder,
                'norec' => $item->norec,
                'norecpd' => $item->norecpd,
                //                'norecapd' => $item->norecapd,
                'namaruanganasal' => $item->ruanganasal,
                'namaruangantujuan' => $item->ruangantujuan,
                'dokter' => $item->namalengkap,
                'statusorder' => $item->statusorder,
                'keteranganlainnya' => $item->keteranganlainnya,
                'details' => $details,
            );
        }

        $result = array(
            'daftar' => $results,
            'message' => 'ea@epic',
        );

        return $this->respond($result);
    }

    public function getOrderPelayananAmbulan(Request $request)
    {
        $idkelas = $request['objectkelasfk'];
        $idPenjamin = $request['objectpenjaminfk'];
        $norec_so = $request['norec_so'];
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        if (isset($request['objectpenjaminfk']) && $request['objectpenjaminfk'] != 'null') {
            $dataOrderPelayanan = DB::select(
                DB::raw("select DISTINCT op.norec as norec_op,pr.id as prid,pr.namaproduk,
                op.tglpelayanan,op.qtyproduk ,ru.namaruangan as ruangantujuan,ru.objectdepartemenfk,op.strukorderfk,so.objectruangantujuanfk,
                hnp.hargasatuan ,kls.namakelas,dpm.namadepartemen,
                pps.norec as norec_pp
                from orderpelayanan_t op
                left join strukorder_t as so on so.norec=op.strukorderfk
                INNER JOIN produk_m as pr on pr.id=op.objectprodukfk
                left JOIN harganettoprodukbykelas_m as hnp on pr.id=hnp.objectprodukfk
                    and '$idkelas' = hnp.objectkelasfk
                    and '$idPenjamin' = hnp.objectpenjaminfk
                left join kelas_m as kls on kls.id = '$idkelas'                
                left join ruangan_m as ru on ru.id =so.objectruangantujuanfk
                left join departemen_m as dpm on dpm.id=ru.objectdepartemenfk
                left JOIN pelayananpasien_t as pps on pps.strukorderfk=so.norec
                      and op.objectprodukfk =pps.produkfk
                where op.kdprofile = $idProfile and op.strukorderfk=:norec_so
                and kls.id=:objectkelasfk
                ORDER by op.tglpelayanan"),
                array(
                    'norec_so' => $norec_so,
                    'objectkelasfk' => $idkelas,
                )
            );
        } else {
            $dataOrderPelayanan = DB::select(
                DB::raw("select DISTINCT op.norec as norec_op,pr.id as prid,pr.namaproduk,
                op.tglpelayanan,op.qtyproduk ,ru.namaruangan as ruangantujuan,ru.objectdepartemenfk,op.strukorderfk,so.objectruangantujuanfk,
                hnp.hargasatuan ,kls.namakelas,dpm.namadepartemen,
                pps.norec as norec_pp
                from orderpelayanan_t op
                left join strukorder_t as so on so.norec=op.strukorderfk
                INNER JOIN produk_m as pr on pr.id=op.objectprodukfk
                left JOIN harganettoprodukbykelas_m as hnp on pr.id=hnp.objectprodukfk
                    and '$idkelas' = hnp.objectkelasfk
                    and hnp.objectpenjaminfk is null
                left join kelas_m as kls on kls.id = '$idkelas'                
                left join ruangan_m as ru on ru.id =so.objectruangantujuanfk
                left join departemen_m as dpm on dpm.id=ru.objectdepartemenfk
                left JOIN pelayananpasien_t as pps on pps.strukorderfk=so.norec
                      and op.objectprodukfk =pps.produkfk
                where op.kdprofile = $idProfile and op.strukorderfk=:norec_so
                and kls.id=:objectkelasfk
                ORDER by op.tglpelayanan"),
                array(
                    'norec_so' => $norec_so,
                    'objectkelasfk' => $idkelas,
                )
            );
        }

        // $dataOrderPelayanan = DB::select(DB::raw("select DISTINCT op.norec as norec_op,pr.id as prid,pr.namaproduk,
        //         op.tglpelayanan,op.qtyproduk ,ru.namaruangan as ruangantujuan,ru.objectdepartemenfk,op.strukorderfk,so.objectruangantujuanfk,
        //         hnp.hargasatuan ,kls.namakelas,dpm.namadepartemen,
        //         pps.norec as norec_pp
        //         from orderpelayanan_t op
        //         left join strukorder_t as so on so.norec=op.strukorderfk
        //         INNER JOIN produk_m as pr on pr.id=op.objectprodukfk
        //         left JOIN harganettoprodukbykelas_m as hnp on pr.id=hnp.objectprodukfk
        //             and '$idkelas' = hnp.objectkelasfk
        //             and '$idPenjamin' = hnp.objectpenjaminfk
        //         left join kelas_m as kls on kls.id = '$idkelas'                
        //         left join ruangan_m as ru on ru.id =so.objectruangantujuanfk
        //         left join departemen_m as dpm on dpm.id=ru.objectdepartemenfk
        //         left JOIN pelayananpasien_t as pps on pps.strukorderfk=so.norec
        //               and op.objectprodukfk =pps.produkfk
        //         where op.kdprofile = $idProfile and op.strukorderfk=:norec_so
        //         and kls.id=:objectkelasfk
        //         ORDER by op.tglpelayanan"),
        //     array(
        //         'norec_so' => $norec_so,
        //         'objectkelasfk' =>$idkelas ,
        //     )
        // );

        $result = [];
        foreach ($dataOrderPelayanan as $item) {
            $dataz =  DB::select(DB::raw("select DISTINCT hnp.objectkomponenhargafk,kh.komponenharga,hnp.hargasatuan,
                hnp.objectprodukfk
                from harganettoprodukbykelasd_m as hnp   
                inner join produk_m as prd on prd.id=hnp.objectprodukfk
                inner join komponenharga_m as kh on kh.id=hnp.objectkomponenhargafk
                inner join kelas_m as kls on kls.id = hnp.objectkelasfk
                where hnp.kdprofile = $idProfile and hnp.objectkelasfk='$idkelas'
                and prd.id='$item->prid'"));

            $result[] = array(
                'norec_op' => $item->norec_op,
                'norec_pp' => $item->norec_pp,
                'prid' => $item->prid,
                'namaproduk' => $item->namaproduk,
                'qtyproduk' => $item->qtyproduk,
                'tglpelayanan' => $item->tglpelayanan,
                'idruangan' => $item->objectruangantujuanfk,
                'ruangantujuan' => $item->ruangantujuan,
                'hargasatuan' => $item->hargasatuan,
                'namakelas' => $item->namakelas,
                'objectdepartemenfk' => $item->objectdepartemenfk,
                'namadepartemen' => $item->namadepartemen,
                'details' => $dataz,
            );
        }

        $result = array(
            'message' =>  'inhuman',
            'data' =>  $result,

        );
        return $this->respond($result);
    }

    // tanda1
    public function savePelayananPasienAmbulan(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $savedPetugas = [];
        DB::beginTransaction();

        try {
            // Query jenis petugas
            $jenisPetugasPe = DB::table('mapjenispetugasptojenispegawai_m as mpp')
                ->join('jenispegawai_m as jp', 'jp.id', '=', 'mpp.objectjenispegawaifk')
                ->join('pegawai_m as pg', 'pg.objectjenispegawaifk', '=', 'jp.id')
                ->join('jenispetugaspelaksana_m as jpp', 'jpp.id', '=', 'mpp.objectjenispetugaspefk')
                ->select(
                    'mpp.objectjenispegawaifk',
                    'jp.jenispegawai',
                    'mpp.objectjenispetugaspefk',
                    'jpp.jenispetugaspe',
                    'pg.namalengkap',
                    'pg.id'
                )
                ->where('mpp.kdprofile', $kdProfile)
                ->where('pg.id', $request['objectpegawaiorderfk'])
                ->first();

            if ($request['norec_pp'] == '') {
                $pd = PasienDaftar::where('norec', $request['norec_pd'])->first();
                $dataAPD = new AntrianPasienDiperiksa();
                $dataAPD->norec = $dataAPD->generateNewId();
                $dataAPD->kdprofile = $kdProfile;
                $dataAPD->objectasalrujukanfk = 1;
                $dataAPD->statusenabled = true;
                $dataAPD->objectkelasfk = $request['objectkelasfk'];
                $dataAPD->noantrian = 1;
                $dataAPD->noregistrasifk = $request['norec_pd'];
                $dataAPD->objectpegawaifk = $request['objectpegawaiorderfk'];
                $dataAPD->objectruanganfk = $request['objectruangantujuanfk'];
                $dataAPD->statusantrian = 0;
                $dataAPD->statuspasien = 1;
                $dataAPD->objectstrukorderfk = $request['norec_so'];
                $dataAPD->tglregistrasi = $pd->tglregistrasi;
                $dataAPD->tglmasuk = date('Y-m-d H:i:s');
                $dataAPD->tglkeluar = date('Y-m-d H:i:s');
                $dataAPD->save();

                $dataAPDnorec = $dataAPD->norec;
                $dataAPDtglPel = $dataAPD->tglregistrasi;
            } else {
                $dataAPD = PelayananPasien::where('norec', $request['norec_pp'])->where('kdprofile', $kdProfile)->first();
                $dataAPDnorec = $dataAPD->noregistrasifk;
                $dataAPDtglPel = $dataAPD->tglregistrasi;

                PelayananPasien::where('strukorderfk', $request['norec_so'])->where('kdprofile', $kdProfile)->delete();
                PelayananPasienDetail::where('pelayananpasien', $dataAPD->norec)->where('kdprofile', $kdProfile)->delete();
                PelayananPasienPetugas::where('pelayananpasien', $dataAPD->norec)->where('kdprofile', $kdProfile)->delete();
            }

            foreach ($request['bridging'] as $item) {
                $PelPasien = new PelayananPasien();
                $PelPasien->norec = $PelPasien->generateNewId();
                $PelPasien->kdprofile = $kdProfile;
                $PelPasien->statusenabled = true;
                $PelPasien->noregistrasifk =  $dataAPDnorec;
                $PelPasien->tglregistrasi = $dataAPDtglPel;
                $PelPasien->hargadiscount = 0;
                $PelPasien->hargajual =  $item['hargasatuan'];
                $PelPasien->hargasatuan =  $item['hargasatuan'];
                $PelPasien->jumlah =  $item['qtyproduk'];
                $PelPasien->kelasfk =  $request['objectkelasfk'];
                $PelPasien->kdkelompoktransaksi =  1;
                $PelPasien->piutangpenjamin =  0;
                $PelPasien->piutangrumahsakit = 0;
                $PelPasien->produkfk =  $item['produkid'];
                $PelPasien->stock =  1;
                $PelPasien->strukorderfk =  $request['norec_so'];
                $PelPasien->tglpelayanan = $item['tglpelayanan'] ?? date('Y-m-d H:i:s');
                $PelPasien->harganetto =  $item['hargasatuan'];
                $PelPasien->nopolisinorec = $item['nopolisi'];
                $PelPasien->jeniskegiatanambulanfk = $item['jeniskegiatan'];
                $PelPasien->save();

                foreach ($item['komponenharga'] as $itemKomponen) {
                    $PelPasienDetail = new PelayananPasienDetail();
                    $PelPasienDetail->norec = $PelPasienDetail->generateNewId();
                    $PelPasienDetail->kdprofile = $kdProfile;
                    $PelPasienDetail->statusenabled = true;
                    $PelPasienDetail->noregistrasifk = $dataAPDnorec;
                    $PelPasienDetail->aturanpakai = '-';
                    $PelPasienDetail->hargadiscount = 0;
                    $PelPasienDetail->hargajual = $itemKomponen['hargasatuan'];
                    $PelPasienDetail->hargasatuan = $itemKomponen['hargasatuan'];
                    $PelPasienDetail->jumlah = 1;
                    $PelPasienDetail->komponenhargafk = $itemKomponen['objectkomponenhargafk'];
                    $PelPasienDetail->pelayananpasien = $PelPasien->norec;
                    $PelPasienDetail->piutangpenjamin = 0;
                    $PelPasienDetail->piutangrumahsakit = 0;
                    $PelPasienDetail->produkfk = $item['produkid'];
                    $PelPasienDetail->stock = 1;
                    $PelPasienDetail->strukorderfk = $request['norec_so'];
                    $PelPasienDetail->tglpelayanan = $dataAPDtglPel;
                    $PelPasienDetail->harganetto = $itemKomponen['hargasatuan'];
                    $PelPasienDetail->save();
                }

                if (isset($request['petugaspelayananambulan']) && is_array($request['petugaspelayananambulan'])) {
                    foreach ($request['petugaspelayananambulan'] as $pegawaiId) {
                        $PetugasPelAmbulan = new PetugasPelayananAmbulan();
                        $PetugasPelAmbulan->norec = $PetugasPelAmbulan->generateNewId();
                        $PetugasPelAmbulan->kdprofile = $kdProfile;
                        $PetugasPelAmbulan->statusenabled = true;
                        $PetugasPelAmbulan->objectpegawaifk = $pegawaiId;
                        $PetugasPelAmbulan->nostrukdetailfk = $PelPasien->norec;
                        $PetugasPelAmbulan->tglpelayanan = $PelPasien->tglregistrasi;
                        $PetugasPelAmbulan->save();
                        $savedPetugas[] = $PetugasPelAmbulan;
                    }
                }
            }

            PasienDaftar::where('norec', $request['norec_pd'])
                ->where('kdprofile', $kdProfile)
                ->update(['objectruanganlastfk' => $request['objectruangantujuanfk']]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'data' => $savedPetugas,
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function savePelayananPasienAmbulanOld(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $listPetugasPelAmbulan = [];
        DB::beginTransaction();
        // try {
            $jenisPetugasPe = \DB::table('mapjenispetugasptojenispegawai_m as mpp')
                ->join('jenispegawai_m as jp', 'jp.id', '=', 'mpp.objectjenispegawaifk')
                ->join('pegawai_m as pg', 'pg.objectjenispegawaifk', '=', 'jp.id')
                ->join('jenispetugaspelaksana_m as jpp', 'jpp.id', '=', 'mpp.objectjenispetugaspefk')
                ->select(
                    'mpp.objectjenispegawaifk',
                    'jp.jenispegawai',
                    'mpp.objectjenispetugaspefk',
                    'jpp.jenispetugaspe',
                    'pg.namalengkap',
                    'pg.id'
                )
                ->where('mpp.kdprofile', $kdProfile)
                ->where('pg.id', $request['objectpegawaiorderfk'])
                ->first();

            if ($request['norec_pp'] == '') {
                $pd = PasienDaftar::where('norec', $request['norec_pd'])->first();
                $dataAPD = new AntrianPasienDiperiksa();
                $dataAPD->norec = $dataAPD->generateNewId();
                $dataAPD->kdprofile = $kdProfile;
                $dataAPD->objectasalrujukanfk = 1;
                $dataAPD->statusenabled = true;
                $dataAPD->objectkelasfk = $request['objectkelasfk'];
                $dataAPD->noantrian = 1;
                $dataAPD->noregistrasifk = $request['norec_pd'];
                $dataAPD->objectpegawaifk = $request['objectpegawaiorderfk'];
                $dataAPD->objectruanganfk = $request['objectruangantujuanfk'];
                $dataAPD->statusantrian = 0;
                $dataAPD->statuspasien = 1;
                $dataAPD->objectstrukorderfk = $request['norec_so'];
                $dataAPD->tglregistrasi = $pd->tglregistrasi; // date('Y-m-d H:i:s');
                $dataAPD->tglmasuk = date('Y-m-d H:i:s');
                $dataAPD->tglkeluar = date('Y-m-d H:i:s');
                $dataAPD->save();

                $dataAPDnorec = $dataAPD->norec;
                $dataAPDtglPel = $dataAPD->tglregistrasi;
            } else {
                $dataAPD =  PelayananPasien::where('norec', $request['norec_pp'])->where('kdprofile', $kdProfile)->first();
                $dataAPDnorec = $dataAPD->noregistrasifk;
                $dataAPDtglPel = $dataAPD->tglregistrasi;

                $HapusPP = PelayananPasien::where('strukorderfk', $request['norec_so'])->where('kdprofile', $kdProfile)->get();
                foreach ($HapusPP as $pp) {
                    $HapusPPD = PelayananPasienDetail::where('pelayananpasien', $pp['norec'])->where('kdprofile', $kdProfile)->delete();
                    $HapusPPP = PelayananPasienPetugas::where('pelayananpasien', $pp['norec'])->where('kdprofile', $kdProfile)->delete();
                }
                $Edit = PelayananPasien::where('strukorderfk', $request['norec_so'])->where('kdprofile', $kdProfile)->delete();
            }


            foreach ($request['bridging'] as $item) {
                $PelPasien = new PelayananPasien();
                $PelPasien->norec = $PelPasien->generateNewId();
                $PelPasien->kdprofile = $kdProfile;
                $PelPasien->statusenabled = true;
                $PelPasien->noregistrasifk =  $dataAPDnorec;
                $PelPasien->tglregistrasi = $dataAPDtglPel;
                $PelPasien->hargadiscount = 0;
                $PelPasien->hargajual =  $item['hargasatuan'];
                $PelPasien->hargasatuan =  $item['hargasatuan'];
                $PelPasien->jumlah =  $item['qtyproduk'];
                $PelPasien->kelasfk =  $request['objectkelasfk'];
                $PelPasien->kdkelompoktransaksi =  1;
                $PelPasien->piutangpenjamin =  0;
                $PelPasien->piutangrumahsakit = 0;
                $PelPasien->produkfk =  $item['produkid'];
                $PelPasien->stock =  1;
                $PelPasien->strukorderfk =  $request['norec_so'];

                if (isset($item['tglpelayanan'])) {
                    $PelPasien->tglpelayanan = $item['tglpelayanan'];
                } else {
                    $PelPasien->tglpelayanan = date('Y-m-d H:i:s');
                }

                $PelPasien->harganetto =  $item['hargasatuan'];

                $PelPasien->save();
                $PPnorec = $PelPasien->norec;
                $PPtglpelayanan = $PelPasien->tglregistrasi;


                // $PelPasienPetugas = new PelayananPasienPetugas();
                // $PelPasienPetugas->norec = $PelPasienPetugas->generateNewId();
                // $PelPasienPetugas->kdprofile = $kdProfile;
                // $PelPasienPetugas->statusenabled = true;
                // $PelPasienPetugas->nomasukfk = $dataAPDnorec;
                // $PelPasienPetugas->objectpegawaifk = $request['iddokterverif']; //$request['objectpegawaiorderfk'],
                // $PelPasienPetugas->objectjenispetugaspefk = $request['idpetugaspe']; //4;//$jenisPetugasPe->idpetugaspe;
                // $PelPasienPetugas->pelayananpasien = $PPnorec;
                // $PelPasienPetugas->save();
                // $PPPnorec = $PelPasienPetugas->norec;

                if (isset($req['petugaspelayananambulan']) && count($req['petugaspelayananambulan']) > 0) {
                    foreach ($req['petugaspelayananambulan'] as $itemPPA) {
                        if (isset($itemPPA['listpegawai']) && count($itemPPA['listpegawai']) > 0) {
                            foreach ($itemPPA['listpegawai'] as $detailItemPPAz) {
                                $PetugasPelAmbulan = new PetugasPelayananAmbulan();
                                $PetugasPelAmbulan->norec = $PetugasPelAmbulan->generateNewId();
                                $PetugasPelAmbulan->kdprofile = $kdProfile;
                                $PetugasPelAmbulan->statusenabled = true;
                                $PetugasPelAmbulan->objectpegawaifk = $detailItemPPAz['id'] ?? null;
                                $PetugasPelAmbulan->nostrukdetailfk = $PPnorec;
                                $PetugasPelAmbulan->tglpelayanan = $PPtglpelayanan;
                                $PetugasPelAmbulan->save();
                                $listPetugasPelAmbulan[] = $PetugasPelAmbulan;
                            }
                        }
                    }
                }
                $result['dataPetugasPelayananAmbulan'] = $listPetugasPelAmbulan;

                foreach ($item['komponenharga'] as $itemKomponen) {
                    $PelPasienDetail = new PelayananPasienDetail();
                    $PelPasienDetail->norec = $PelPasienDetail->generateNewId();
                    $PelPasienDetail->kdprofile = $kdProfile;
                    $PelPasienDetail->statusenabled = true;
                    $PelPasienDetail->noregistrasifk = $dataAPDnorec;
                    $PelPasienDetail->aturanpakai = '-';
                    $PelPasienDetail->hargadiscount = 0;
                    $PelPasienDetail->hargajual = $itemKomponen['hargasatuan'];
                    $PelPasienDetail->hargasatuan = $itemKomponen['hargasatuan'];
                    $PelPasienDetail->jumlah = 1;
                    $PelPasienDetail->keteranganlain = '-';
                    $PelPasienDetail->keteranganpakai2 = '-';
                    $PelPasienDetail->komponenhargafk = $itemKomponen['objectkomponenhargafk'];
                    $PelPasienDetail->pelayananpasien = $PPnorec;
                    $PelPasienDetail->piutangpenjamin = 0;
                    $PelPasienDetail->piutangrumahsakit = 0;
                    $PelPasienDetail->produkfk =  $item['produkid'];
                    $PelPasienDetail->nopolisinorec =  $item['nopolisi'];
                    $PelPasienDetail->jeniskegiatanambulanfk =  $item['jeniskegiatan'];
                    $PelPasienDetail->stock = 1;
                    $PelPasienDetail->strukorderfk =  $request['norec_so'];
                    $PelPasienDetail->tglpelayanan = $dataAPDtglPel;
                    $PelPasienDetail->harganetto = $itemKomponen['hargasatuan'];
                    // $PelPasienDetail->nopolisiaset =  $request['nopolisiaset'];
                    // $PelPasienDetail->jeniskegiatanambulan =  $request['jeniskegiatanambulan'];
                    $PelPasienDetail->save();
                    $PPDnorec = $PelPasienDetail->norec;
                    $transStatus = 'true';
                }
            }

            $dataPD = PasienDaftar::where('norec', $request['norec_pd'])
                ->where('kdprofile', $kdProfile)
                ->update(
                    ['objectruanganlastfk' => $request['objectruangantujuanfk']]
                );

            $transStatus = 'true';
        // } catch (\Exception $e) {
        //     $transStatus = 'false';
        //     $transMessage = "simpan PelPasien";
        // }

        if ($transStatus == 'true') {
            $transMessage = "Simpan PelayananPasien Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'dataPP' => $PelPasien,
                'dataPetugasPelayananAmbulan' => $listPetugasPelAmbulan,
                'dataPPD' => $PelPasienDetail,
                'as' => 'ramdanegie',
            );
        } else {
            $transMessage = "Simpan PelayananPasien Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'dataPP' => $PelPasien,
                'dataPetugasPelayananAmbulan' => $listPetugasPelAmbulan,
                //                'dataPPP' => $PelPasienPetugas,
                //                'dataPPD' => $PelPasienDetail,
                'as' => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
        //        return $this->respond();
    }

    public function getRincianPelayananAmbulan(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $dataLogin = $request->all();
        $result = [];
        $dataruangan = \DB::table('maploginusertoruangan_s as mlu')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'mlu.objectruanganfk')
            ->leftjoin('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
            ->select('ru.id', 'ru.namaruangan', 'ru.objectdepartemenfk')
            ->where('mlu.kdprofile', $kdProfile)
            ->where('objectloginuserfk', $dataLogin['userData']['id'])
            ->get();

        $pelayanan = \DB::table('pelayananpasien_t as pp')
            ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
            ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->JOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftJOIN('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->JOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->JOIN('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->JOIN('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
            ->leftJOIN('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
            ->leftJOIN('strukorder_t as so', 'so.norec', '=', 'pp.strukorderfk')
            //                ->leftJOIN('ris_order as ris', 'ris.order_no', '=',
            //                    DB::raw('so.noorder AND ris.order_code=pp.produkfk'))
            ->select(
                'ps.nocm',
                'ps.namapasien',
                'jk.jeniskelamin',
                'pp.tglpelayanan',
                'pp.produkfk',
                'pr.namaproduk',
                'pp.jumlah',
                'pp.hargasatuan',
                'pp.hargadiscount',
                'sp.nostruk',
                'pd.noregistrasi',
                'ru.namaruangan',
                'dp.namadepartemen',
                'ps.id as psid',
                'apd.norec as norec_apd',
                'sp.norec as norec_sp',
                'pp.norec as norec_pp',
                'ru.objectdepartemenfk',
                'so.noorder',
                'apd.objectruanganfk',
                'pp.iscito',
                'pp.jasa'
            )
            //                    DB::raw('case when ris.order_key is not null then \'Sudah Dikirim\' else \'-\'end as statusbridging'))
            ->where('pp.kdprofile', $kdProfile)
            ->where('ru.objectdepartemenfk', $this->settingDataFixed('KdInstalasiAmbulan', $kdProfile))
            ->orderBy('pp.tglpelayanan');

        if (isset($request['departemenfk']) && $request['departemenfk'] != "" && $request['departemenfk'] != "undefined") {
            $pelayanan = $pelayanan->where('ru.objectdepartemenfk', '=', $request['departemenfk']);
        }
        if (isset($request['nocm']) && $request['nocm'] != "" && $request['nocm'] != "undefined") {
            $pelayanan = $pelayanan->where('ps.nocm', '=', $request['nocm']);
        }
        if (isset($request['noregistrasifk']) && $request['noregistrasifk'] != "" && $request['noregistrasifk'] != "undefined") {
            $pelayanan = $pelayanan->where('pp.noregistrasifk', '=', $request['noregistrasifk']);
        }
        if (isset($request['noregistrasi']) && $request['noregistrasi'] != "" && $request['noregistrasi'] != "undefined") {
            $pelayanan = $pelayanan->where('pd.noregistrasi', '=', $request['noregistrasi']);
        }
        $pelayanan = $pelayanan->get();
        if (count($pelayanan) > 0) {
            $pelayananpetugas = \DB::table('pasiendaftar_t as pd')
                ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                ->join('pelayananpasienpetugas_t as ptu', 'ptu.nomasukfk', '=', 'apd.norec')
                ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'ptu.objectpegawaifk')
                ->select('ptu.pelayananpasien', 'pg.namalengkap', 'pg.id')
                //                    ->where('ptu.objectjenispetugaspefk', 4)
                ->where('pd.kdprofile', $kdProfile)
                ->where('pd.noregistrasi', $pelayanan[0]->noregistrasi)
                ->get();

            $result = [];
            foreach ($pelayanan as $item) {
                if (isset($request['noregistrasifk'])) {
                    $diskon = $item->hargadiscount;
                } else {
                    $diskon = 0;
                }
                $NamaDokter = '-';
                $DokterId = '';
                foreach ($pelayananpetugas as $hahaha) {
                    if ($hahaha->pelayananpasien == $item->norec_pp) {
                        $NamaDokter = $hahaha->namalengkap;
                        $DokterId = $hahaha->id;
                    }
                }
                $total = (((float)$item->hargasatuan - (float)$diskon) * (float)$item->jumlah) + (float)$item->jasa;

                $result[] = array(
                    'nocm' => $item->nocm,
                    'namapasien' => $item->namapasien,
                    'jeniskelamin' => $item->jeniskelamin,
                    'tglpelayanan' => $item->tglpelayanan,
                    'produkfk' => $item->produkfk,
                    'namaproduk' => $item->namaproduk,
                    'jumlah' => (float)$item->jumlah,
                    'hargasatuan' => (float)$item->hargasatuan,
                    'hargadiscount' => (float)$diskon,
                    'total' => (float)$total,
                    'nostruk' => $item->nostruk,
                    'noregistrasi' => $item->noregistrasi,
                    'ruangan' => $item->namaruangan,
                    'objectruanganfk' => $item->objectruanganfk,
                    'departemen' => $item->namadepartemen,
                    'objectdepartemenfk' => $item->objectdepartemenfk,
                    'norec_apd' => $item->norec_apd,
                    'norec_sp' => $item->norec_sp,
                    'norec_pp' => $item->norec_pp,
                    'dokter' => $NamaDokter,
                    'dokterid' => $DokterId,
                    'noorder' => $item->noorder,
                    'iscito' => $item->iscito,
                    'jasa' => (float)$item->jasa,
                );
            }
        }
        $dataTea = array(
            'data' => $result,
            'detaillogin' => $dataLogin,
            'message' => 'Inhuman'
        );
        return $this->respond($dataTea);
    }

    public function getPelayananAmbulan(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->join('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->leftjoin('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->join('pasien_m as p', 'p.id', '=', 'pd.nocmfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->join('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
            ->join('jeniskelamin_m as jk', 'jk.id', '=', 'p.objectjeniskelaminfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
            //            ->leftJoin('pegawai_m as pg','pg.id','=','pd.objectpegawaifk')
            ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftJoin('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            ->leftJoin('batalregistrasi_t as br', 'pd.norec', '=', 'br.pasiendaftarfk')
            ->select(
                'pd.norec as norec_pd',
                'apd.norec as norec_apd',
                'pd.tglregistrasi',
                'p.nocm',
                'pd.noregistrasi',
                'ru.namaruangan',
                'p.namapasien',
                'kp.kelompokpasien',
                'kls.namakelas',
                'jk.jeniskelamin',
                'pg.namalengkap as namapelaksana',
                'pd.norec as norec_pd',
                'pd.tglpulang',
                'pd.statuspasien',
                'p.tgllahir',
                'pd.objectruanganlastfk',
                'apd.tglmasuk',
                'pr.id as prid',
                'pr.namaproduk'
            )
            ->where('pd.kdprofile', $kdProfile)
            ->whereNull('p.tglmeninggal')
            ->whereNull('br.norec');

        $filter = $request->all();
        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            //            $data = $data->where('pd.tglregistrasi', '>=', $filter['tglAwal']);
            //            $data = $data->where('so.tglorder', '>=', $filter['tglAwal']);
            $data = $data->where('apd.tglmasuk', '>=', $filter['tglAwal']);
        }

        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $tgl = $filter['tglAkhir']; //. " 23:59:59";
            //            $data = $data->where('pd.tglregistrasi', '<=', $tgl);
            //            $data = $data->where('so.tglorder', '<=', $tgl);
            $data = $data->where('apd.tglmasuk', '<=', $tgl);
        }

        if (isset($filter['instalasiId']) && $filter['instalasiId'] != "" && $filter['instalasiId'] != "undefined") {
            $data = $data->where('dept.id', '=', $filter['instalasiId']);
        }

        if (isset($filter['idRuangan']) && $filter['idRuangan'] != "" && $filter['idRuangan'] != "undefined") {
            $data = $data->where('apd.objectruanganfk', '=', $filter['idRuangan']);
        }

        if (isset($filter['namaPasien']) && $filter['namaPasien'] != "" && $filter['namaPasien'] != "undefined") {
            $data = $data->where('p.namapasien', 'ilike', '%' . $filter['namaPasien'] . '%');
        }

        if (isset($filter['noRegis']) && $filter['noRegis'] != "" && $filter['noRegis'] != "undefined") {
            $data = $data->where('pd.noregistrasi', 'ilike', '%' . $filter['noRegis'] . '%');
        }
        if (isset($filter['noCm']) && $filter['noCm'] != "" && $filter['noCm'] != "undefined") {
            $data = $data->where('p.nocm', 'ilike', '%' . $filter['noCm'] . '%');
        }
        if (isset($filter['jmlRow']) && $filter['jmlRow'] != "" && $filter['jmlRow'] != "undefined") {
            $data = $data->take($filter['jmlRow']);
        }

        $data = $data->groupBy(
            'pd.norec',
            'apd.norec',
            'pd.tglregistrasi',
            'p.nocm',
            'pd.noregistrasi',
            'ru.namaruangan',
            'p.namapasien',
            'kp.kelompokpasien',
            'kls.namakelas',
            'jk.jeniskelamin',
            'pg.namalengkap',
            'pd.norec',
            'pd.tglpulang',
            'pd.statuspasien',
            'p.tgllahir',
            'pd.objectruanganlastfk',
            'apd.tglmasuk',
            'pr.id',
            'pr.namaproduk'
        );

        // $data = $data->orderBy('pd.tglregistrasi','desc');
        // $data = $data->take(50);
        $data = $data->get();

        $result = array(
            'data' => $data,
            'message' => 'ridwan',
        );
        return $this->respond($result);
    }

    public function getJadwalAmbulan(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $data = \DB::table('pasiendaftar_t as pd')
            ->leftjoin('strukorder_t as so', 'so.noregistrasifk', '=', 'pd.norec')
            ->join('pasien_m as p', 'p.id', '=', 'pd.nocmfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->join('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
            ->join('jeniskelamin_m as jk', 'jk.id', '=', 'p.objectjeniskelaminfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftJoin('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            ->leftJoin('batalregistrasi_t as br', 'pd.norec', '=', 'br.pasiendaftarfk')
            ->join('antrianpasiendiperiksa_t as apd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->select(
                'pd.norec as norec_pd',
                'apd.norec as norec_apd',
                'pd.tglregistrasi',
                'p.nocm',
                'pd.noregistrasi',
                'ru.namaruangan',
                'p.namapasien',
                'kp.kelompokpasien',
                'kls.namakelas',
                'jk.jeniskelamin',
                'pg.namalengkap as namadokter',
                'pd.norec as norec_pd',
                'pd.tglpulang',
                'pd.statuspasien',
                'p.tgllahir',
                'pd.objectruanganlastfk',
                'apd.tglmasuk',
                'pp.tglpelayanan'
            )
            ->where('pd.kdprofile', $kdProfile)
            ->whereNull('p.tglmeninggal')
            ->whereNull('br.norec')
            ->where('apd.objectruanganfk', 72);

        $filter = $request->all();

        if (isset($filter['tglAwalRen']) && $filter['tglAwalRen'] != "" && $filter['tglAwalRen'] != "undefined") {
            $data = $data->where('pp.tglpelayanan', '>=', $filter['tglAwalRen']);
        }

        if (isset($filter['tglAkhirRen']) && $filter['tglAkhirRen'] != "" && $filter['tglAkhirRen'] != "undefined") {
            $tgl = $filter['tglAkhirRen']; //. " 23:59:59";
            $data = $data->where('pp.tglpelayanan', '<=', $tgl);
        }

        if (isset($filter['instalasiId']) && $filter['instalasiId'] != "" && $filter['instalasiId'] != "undefined") {
            $data = $data->where('dept.id', '=', $filter['instalasiId']);
        }

        if (isset($filter['idRuangan']) && $filter['idRuangan'] != "" && $filter['idRuangan'] != "undefined") {
            $data = $data->where('apd.objectruanganfk', '=', $filter['idRuangan']);
        }

        if (isset($filter['namaPasien']) && $filter['namaPasien'] != "" && $filter['namaPasien'] != "undefined") {
            $data = $data->where('p.namapasien', 'ilike', '%' . $filter['namaPasien'] . '%');
        }

        if (isset($filter['noRegis']) && $filter['noRegis'] != "" && $filter['noRegis'] != "undefined") {
            $data = $data->where('pd.noregistrasi', 'ilike', '%' . $filter['noRegis'] . '%');
        }
        if (isset($filter['noCm']) && $filter['noCm'] != "" && $filter['noCm'] != "undefined") {
            $data = $data->where('p.nocm', 'ilike', '%' . $filter['noCm'] . '%');
        }
        if (isset($filter['jmlRow']) && $filter['jmlRow'] != "" && $filter['jmlRow'] != "undefined") {
            $data = $data->take($filter['jmlRow']);
        }

        $data = $data->groupBy(
            'pd.norec',
            'apd.norec',
            'pd.tglregistrasi',
            'p.nocm',
            'pd.noregistrasi',
            'ru.namaruangan',
            'p.namapasien',
            'kp.kelompokpasien',
            'kls.namakelas',
            'jk.jeniskelamin',
            'pg.namalengkap',
            'pd.norec',
            'pd.tglpulang',
            'pd.statuspasien',
            'p.tgllahir',
            'pd.objectruanganlastfk',
            'apd.tglmasuk',
            'pp.tglpelayanan'
        );

        // $data = $data->orderBy('pd.tglregistrasi','desc');
        // $data = $data->take(50);
        $data = $data->get();

        $result = array(
            'data' => $data,
            'message' => 'ridwan',
        );
        return $this->respond($result);
    }

    public function getPasienAmbulan(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $ruanganLab = explode(',', $this->settingDataFixed('KdRuanganAmbulance', $kdProfile));
        $kdRuangLab = [];
        foreach ($ruanganLab as $item) {
            $kdRuangLab[] = (int)$item;
        }
        $data = \DB::table('pasiendaftar_t as pd')
            ->leftjoin('strukorder_t as so', 'so.noregistrasifk', '=', 'pd.norec')
            ->join('pasien_m as p', 'p.id', '=', 'pd.nocmfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->join('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
            ->join('jeniskelamin_m as jk', 'jk.id', '=', 'p.objectjeniskelaminfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftJoin('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            ->leftJoin('batalregistrasi_t as br', 'pd.norec', '=', 'br.pasiendaftarfk')
            ->join('antrianpasiendiperiksa_t as apd', function ($join) use ($kdRuangLab) {
                $join->on('apd.noregistrasifk', '=', 'pd.norec')
                    ->whereIn('apd.objectruanganfk', $kdRuangLab);
            })
            //            ->join('antrianpasiendiperiksa_t as apd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->leftjoin('rekanan_m as rek', 'rek.id', '=', 'pd.objectrekananfk')
            ->leftJoin('alamat_m as alm', 'alm.nocmfk', '=', 'p.id')
            ->select(
                'pd.norec as norec_pd',
                'apd.norec as norec_apd',
                'pd.tglregistrasi',
                'p.nocm',
                'pd.noregistrasi',
                'ru.namaruangan',
                'p.namapasien',
                'kp.kelompokpasien',
                'kls.namakelas',
                'jk.jeniskelamin',
                'pg.namalengkap as namadokter',
                'pd.norec as norec_pd',
                'pd.tglpulang',
                'pd.statuspasien',
                'p.tgllahir',
                'pd.objectruanganlastfk',
                'apd.tglmasuk',
                'pp.tglpelayanan',
                'rek.namarekanan',
                'alm.alamatlengkap'
            )
            ->where('pd.kdprofile', $kdProfile)
            //            ->whereNull('p.tglmeninggal')
            ->whereNull('br.norec');

        $filter = $request->all();
        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            //            $data = $data->where('pd.tglregistrasi', '>=', $filter['tglAwal']);
            //            $data = $data->where('so.tglorder', '>=', $filter['tglAwal']);
            //            $data = $data->where('apd.tglmasuk', '>=', $filter['tglAwal']);
            $data = $data->where('pp.tglpelayanan', '>=', $filter['tglAwal']);
        }

        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $tgl = $filter['tglAkhir']; //. " 23:59:59";
            //            $data = $data->where('pd.tglregistrasi', '<=', $tgl);
            //            $data = $data->where('so.tglorder', '<=', $tgl);
            //            $data = $data->where('apd.tglmasuk', '<=', $tgl);
            $data = $data->where('pp.tglpelayanan', '<=', $tgl);
        }

        if (isset($filter['instalasiId']) && $filter['instalasiId'] != "" && $filter['instalasiId'] != "undefined") {
            $data = $data->where('dept.id', '=', $filter['instalasiId']);
        }

        if (isset($filter['idRuangan']) && $filter['idRuangan'] != "" && $filter['idRuangan'] != "undefined") {
            $data = $data->where('apd.objectruanganfk', '=', $filter['idRuangan']);
        }

        if (isset($filter['namaPasien']) && $filter['namaPasien'] != "" && $filter['namaPasien'] != "undefined") {
            $data = $data->where('p.namapasien', 'ilike', '%' . $filter['namaPasien'] . '%');
        }

        if (isset($filter['noRegis']) && $filter['noRegis'] != "" && $filter['noRegis'] != "undefined") {
            $data = $data->where('pd.noregistrasi', 'ilike', '%' . $filter['noRegis'] . '%');
        }
        if (isset($filter['noCm']) && $filter['noCm'] != "" && $filter['noCm'] != "undefined") {
            $data = $data->where('p.nocm', 'ilike', '%' . $filter['noCm'] . '%');
        }
        if (isset($filter['jmlRow']) && $filter['jmlRow'] != "" && $filter['jmlRow'] != "undefined") {
            $data = $data->take($filter['jmlRow']);
        }

        $data = $data->groupBy(
            'pd.norec',
            'apd.norec',
            'pd.tglregistrasi',
            'p.nocm',
            'pd.noregistrasi',
            'ru.namaruangan',
            'p.namapasien',
            'kp.kelompokpasien',
            'kls.namakelas',
            'jk.jeniskelamin',
            'pg.namalengkap',
            'pd.norec',
            'pd.tglpulang',
            'pd.statuspasien',
            'p.tgllahir',
            'pd.objectruanganlastfk',
            'apd.tglmasuk',
            'pp.tglpelayanan',
            'rek.namarekanan',
            'alm.alamatlengkap'
        );

        // $data = $data->orderBy('pd.tglregistrasi','desc');
        // $data = $data->take(50);
        $data = $data->get();

        $result = array(
            'data' => $data,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }

    public function getDataComboOperator(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->join('pegawai_m as pg', 'pg.id', '=', 'lu.objectpegawaifk')
            ->select('lu.objectpegawaifk', 'pg.namalengkap')
            ->where('pg.kdprofile', $idProfile)
            ->where('lu.id', $dataLogin['userData']['id'])
            ->first();

        $dataInstalasi = \DB::table('departemen_m as dp')
            //            ->whereIn('dp.id', array(3, 14, 16, 17, 18, 19, 24, 25, 26, 27, 28, 35))
            ->where('dp.kdprofile', $idProfile)
            ->where('dp.statusenabled', true)
            ->orderBy('dp.namadepartemen')
            ->get();

        $dataRuangan = \DB::table('ruangan_m as ru')
            ->where('ru.kdprofile', $idProfile)
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();

        $dept = \DB::table('departemen_m as dept')
            ->where('dept.kdprofile', $idProfile)
            ->where('dept.id', '18')
            ->where('dept.statusenabled', true)
            ->orderBy('dept.namadepartemen')
            ->get();

        $deptRajalInap = \DB::table('departemen_m as dept')
            ->where('dept.kdprofile', $idProfile)
            ->whereIn('dept.id', [18, 16])
            ->where('dept.statusenabled', true)
            ->orderBy('dept.namadepartemen')
            ->get();

        $ruanganRi = \DB::table('ruangan_m as ru')
            ->where('ru.kdprofile', $idProfile)
            ->wherein('ru.objectdepartemenfk', ['18', '28'])
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();

        $dataDokter = \DB::table('pegawai_m as ru')
            ->where('ru.kdprofile', $idProfile)
            ->where('ru.statusenabled', true)
            ->where('ru.objectjenispegawaifk', 1)
            ->orderBy('ru.namalengkap')
            ->get();
        foreach ($dataInstalasi as $item) {
            $detail = [];
            foreach ($dataRuangan as $item2) {
                if ($item->id == $item2->objectdepartemenfk) {
                    $detail[] = array(
                        'id' => $item2->id,
                        'ruangan' => $item2->namaruangan,
                    );
                }
            }

            $dataDepartemen[] = array(
                'id' => $item->id,
                'departemen' => $item->namadepartemen,
                'ruangan' => $detail,
            );
        }
        $dataKelompok = \DB::table('kelompokpasien_m as kp')
            ->select('kp.id', 'kp.kelompokpasien')
            ->where('kp.statusenabled', true)
            ->orderBy('kp.kelompokpasien')
            ->get();

        $dataKelas = \DB::table('kelas_m as kl')
            ->select('kl.id', 'kl.reportdisplay')
            ->where('kl.statusenabled', true)
            ->orderBy('kl.reportdisplay')
            ->get();

        $pembatalan = \DB::table('pembatal_m as p')
            ->select('p.id', 'p.name')
            ->where('p.statusenabled', true)
            ->orderBy('p.name')
            ->get();

        $jenisDiagnosa = \DB::table('jenisdiagnosa_m as jd')
            ->select('jd.id', 'jd.jenisdiagnosa')
            //            ->where('jd.id',5)
            ->where('jd.statusenabled', true)
            ->orderBy('jd.jenisdiagnosa')
            ->get();

        //        $kdeDiagnosa = \DB::table('diagnosa_m as dm')
        //            ->select('dm.id', 'dm.kddiagnosa')
        //            ->where('dm.statusenabled', true)
        //            ->orderBy('dm.id')
        //            ->get();
        //
        //        $Diagnosa = \DB::table('diagnosa_m as dm')
        //            ->select('dm.id', 'dm.namadiagnosa')
        //            ->where('dm.statusenabled', true)
        //            ->orderBy('dm.id')
        //            ->get();

        $KelompokKerjaHead = \DB::table('kelompokkerjahead_m as dm')
            ->select('dm.id', 'dm.kelompokkerjahead')
            ->where('dm.statusenabled', true)
            ->orderBy('dm.id')
            ->get();

        $KelompokKerja = \DB::table('kelompokkerja_m as dm')
            ->select('dm.id', 'dm.kelompokkerja')
            ->where('dm.statusenabled', true)
            ->orderBy('dm.id')
            ->get();

        $dataJenisKelamin = \DB::table('jeniskelamin_m as jk')
            ->where('jk.statusenabled', true)
            ->orderBy('jk.jeniskelamin')
            ->get();

        $result = array(
            'departemen' => $dataDepartemen,
            'kelompokpasien' => $dataKelompok,
            'dokter' => $dataDokter,
            'datalogin' => $dataLogin,
            'kelas' => $dataKelas,
            'dept' => $dept,
            'ruanganRi' => $ruanganRi,
            'deptrirj' => $deptRajalInap,
            'ruanganall' => $dataRuangan,
            'pembatalan' => $pembatalan,
            'jenisdiagnosa' => $jenisDiagnosa,
            //            'diagnosa' => $Diagnosa,
            //            'kddiagnosa' => $kdeDiagnosa,
            'kelompokkerjahead' => $KelompokKerjaHead,
            'kelompokkerja' => $KelompokKerja,
            'pegawaiLogin' => $dataPegawai->namalengkap,
            'jeniskelamin' => $dataJenisKelamin,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }

    public function getDataDiagnosa(Request $request)
    {
        $req = $request->all();
        $icdIX = \DB::table('diagnosa_m as dg')
            ->select('dg.id', 'dg.kddiagnosa', 'dg.namadiagnosa', 'dg.kddiagnosa as kdDiagnosa', 'dg.namadiagnosa as namaDiagnosa')
            ->where('dg.statusenabled', true)
            ->orderBy('dg.kddiagnosa');

        if (
            isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined"
        ) {
            $icdIX = $icdIX
                ->where('dg.namadiagnosa', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%')
                ->orWhere('dg.kddiagnosa', 'ilike', $req['filter']['filters'][0]['value'] . '%');
        }

        $icdIX = $icdIX->take(10);
        $icdIX = $icdIX->get();

        return $this->respond($icdIX);
    }

    public function saveAntrianPasien(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        DB::beginTransaction();
        $transStatus = 'true';
        try {
            $countNoAntrian = AntrianPasienDiperiksa::where('objectruanganfk', $request['objectruanganasalfk'])
                ->where('kdprofile', $idProfile)
                ->where('tglregistrasi', '>=', $request['tglregistrasidate'] . ' 00:00')
                ->where('tglregistrasi', '<=', $request['tglregistrasidate'] . ' 23:59')
                ->count('norec');
            //            return $this->respond($countNoAntrian);
            $pd = PasienDaftar::where('norec', $request['norec_pd'])->first();
            $noAntrian = $countNoAntrian + 1;
            $dataAPD = new AntrianPasienDiperiksa;
            $dataAPD->norec = $dataAPD->generateNewId();
            $dataAPD->kdprofile = $idProfile;
            $dataAPD->statusenabled = true;
            $dataAPD->objectasalrujukanfk = $request['asalrujukanfk'];
            $dataAPD->objectkelasfk = 6;
            $dataAPD->noantrian = $noAntrian;
            $dataAPD->noregistrasifk = $request['norec_pd'];
            $dataAPD->objectpegawaifk = $request['dokterfk'];
            $dataAPD->objectruanganfk = $request['objectruangantujuanfk'];
            $dataAPD->statusantrian = 0;
            $dataAPD->statuspasien = 1;
            $dataAPD->statuskunjungan = 'LAMA';
            $dataAPD->statuspenyakit = 'BARU';
            $dataAPD->objectruanganasalfk = $request['objectruanganasalfk'];;
            $dataAPD->tglregistrasi = $pd->tglregistrasi; //date('Y-m-d H:i:s');
            $dataAPD->tglkeluar = date('Y-m-d H:i:s');
            $dataAPD->tglmasuk = date('Y-m-d H:i:s');
            $dataAPD->save();

            $dataAPDnorec = $dataAPD->norec;
            $transStatus = 'true';
            $transMessage = "simpan AntrianPasienDiperiksa";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan AntrianPasienDiperiksa";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => $dataAPD,
                "message" => $transMessage,
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "data" => $dataAPD,
                "message" => $transMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDataComboLabRab(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataDokter = \DB::table('pegawai_m as dp')
            ->select('dp.id', 'dp.namalengkap')
            ->whereIn('dp.objectjenispegawaifk', array(1))
            ->where('dp.statusenabled', true)
            ->where('dp.kdprofile', $idProfile)
            ->orderBy('dp.namalengkap')
            ->get();

        $golonganDarah = \DB::table('golongandarah_m')
            ->select('id', 'golongandarah')
            ->where('statusenabled', true)
            ->where('kdprofile', $idProfile)
            ->orderBy('golongandarah')
            ->get();

        $result = array(
            'dokter' => $dataDokter,
            'golongandarah' =>   $golonganDarah,
            'message' => 'inhuman',
        );
        return $this->respond($result);
    }

    public function deletePelayananPasien(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        DB::beginTransaction();
        try {
            foreach ($request['dataDel'] as $item) {
                $HapusPP = PelayananPasien::where('norec', $item['norec_pp'])->get();
                foreach ($HapusPP as $pp) {
                    $HapusPPD = PelayananPasienDetail::where('pelayananpasien', $pp['norec'])->where('kdprofile', $idProfile)->delete();
                    $HapusPPP = PelayananPasienPetugas::where('pelayananpasien', $pp['norec'])->where('kdprofile', $idProfile)->delete();
                }
                $Edit = PelayananPasien::where('norec', $item['norec_pp'])->where('kdprofile', $idProfile)->delete();
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = " PP PPD PPP";
        }
        if ($transStatus == 'true') {
            $transMessage = "Delete Pelayanan Pasien";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                //                "nokirim" => $dataSO,//$noResep,,//$noResep,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Delete Pelayanan Pasien Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                //                "nokirim" => $dataSO,//$noResep,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDaftarRegistrasiPasienAmbulan(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $ruanganLab = explode(',', $this->settingDataFixed('KdRuanganAmbulance', $kdProfile));
        $kdRuangLab = [];
        foreach ($ruanganLab as $item) {
            $kdRuangLab[] = (int)$item;
        }
        $filter = $request->all();
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftJoin('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            ->leftjoin('batalregistrasi_t as br', 'br.pasiendaftarfk', '=', 'pd.norec')
            ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
            ->leftJoin('alamat_m as alm', 'alm.nocmfk', '=', 'ps.id')
            ->leftjoin('rekanan_m as rek', 'rek.id', '=', 'pd.objectrekananfk')
            ->leftjoin('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
            ->leftjoin('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->leftJoin('jenispelayanan_m as jp', 'jp.kodeinternal', '=', 'pd.jenispelayanan')
            ->select(
                'pd.norec as norec_pd',
                'pd.statusenabled',
                'pd.tglregistrasi',
                'ps.nocm',
                'pd.nocmfk',
                'pd.noregistrasi',
                'ru.namaruangan',
                'ps.namapasien',
                'kp.kelompokpasien',
                'rek.namarekanan',
                'pg.namalengkap as namadokter',
                'pd.tglpulang',
                'pd.statuspasien',
                'pa.norec as norec_pa',
                'pa.objectasuransipasienfk',
                'pd.objectpegawaifk as pgid',
                'pd.objectruanganlastfk',
                'pa.nosep as nosep',
                'br.norec as norec_br',
                'pd.nostruklastfk',
                'pd.objectkelasfk',
                'kls.namakelas',
                'ps.tgllahir',
                'ps.objectjeniskelaminfk',
                'jk.jeniskelamin',
                'alm.alamatlengkap',
                'pd.jenispelayanan as idjenispelayanan',
                'jp.jenispelayanan',
                'ps.tglmeninggal'
            )
            ->where('pd.kdprofile', $kdProfile)
            ->where('pd.statusenabled', true)
            ->whereNull('br.norec');
        //            ->whereIn('ru.id', $kdRuangLab);
        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '<=', $filter['tglAkhir']);
        }
        if (isset($filter['deptId']) && $filter['deptId'] != "" && $filter['deptId'] != "undefined") {
            $data = $data->where('dept.id', '=', $filter['deptId']);
        }
        if (isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined") {
            $data = $data->where('ru.id', '=', $filter['ruangId']);
        }
        if (isset($filter['kelId']) && $filter['kelId'] != "" && $filter['kelId'] != "undefined") {
            $data = $data->where('kp.id', '=', $filter['kelId']);
        }
        if (isset($filter['dokId']) && $filter['dokId'] != "" && $filter['dokId'] != "undefined") {
            $data = $data->where('pg.id', '=', $filter['dokId']);
        }
        if (isset($filter['sttts']) && $filter['sttts'] != "" && $filter['sttts'] != "undefined") {
            $data = $data->where('pd.statuspasien', '=', $filter['sttts']);
        }
        if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $filter['noreg']);
        }
        if (isset($filter['norm']) && $filter['norm'] != "" && $filter['norm'] != "undefined") {
            $data = $data->where('ps.nocm', 'ilike', '%' . $filter['norm'] . '%');
        }
        if (isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $data = $data->where('ps.namapasien', 'ilike', '%' . $filter['nama'] . '%');
        }
        if (isset($filter['jmlRows']) && $filter['jmlRows'] != "" && $filter['jmlRows'] != "undefined") {
            $data = $data->take($filter['jmlRows']);
        }
        $data = $data->orderBy('pd.noregistrasi');
        $data = $data->groupBy(
            'pd.norec',
            'pd.statusenabled',
            'pd.tglregistrasi',
            'ps.nocm',
            'pd.nocmfk',
            'pd.noregistrasi',
            'ru.namaruangan',
            'ps.namapasien',
            'kp.kelompokpasien',
            'rek.namarekanan',
            'pg.namalengkap',
            'pd.tglpulang',
            'pd.statuspasien',
            'pa.nosep',
            'br.norec',
            'pa.norec',
            'pa.objectasuransipasienfk',
            'pd.objectpegawaifk',
            'pd.objectruanganlastfk',
            'pd.nostruklastfk',
            'ps.tgllahir',
            'pd.objectkelasfk',
            'kls.namakelas',
            'ps.objectjeniskelaminfk',
            'jk.jeniskelamin',
            'alm.alamatlengkap',
            'pd.jenispelayanan',
            'jp.jenispelayanan',
            'ps.tglmeninggal'
        );
        //        $data = $data->take($filter['jmlRows']);
        $data = $data->get();
        return $this->respond($data);
    }

    public function getDataProduk(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $kdDetailJenisProduk = (int) $this->settingDataFixed('KdDetailJenisProdukAmbulance', $kdProfile);
        $dataLogin = $request->all();
        $data = \DB::table('produk_m as pr')
            ->JOIN('harganettoprodukbykelas_m as het', 'het.objectprodukfk', '=', 'pr.id')
            ->select('pr.id', 'pr.namaproduk', 'het.harganetto1 as harga')
            ->where('pr.kdprofile', $kdProfile)
            ->where('het.kdprofile', $kdProfile)
            ->where('pr.statusenabled', true)
            ->where('pr.objectdetailjenisprodukfk', $kdDetailJenisProduk)
            ->where('het.objectkelasfk', 6)
            ->where('het.objectjenispelayananfk', 1)
            ->where('het.statusenabled', true);
        //            ->take($request['take']);

        if (isset($request['prid']) && $request['prid'] != "" && $request['prid'] != "undefined") {
            $data = $data->where('ru.id', $request['prid']);
        }
        if (isset($request['namaproduk']) && $request['namaproduk'] != "" && $request['namaproduk'] != "undefined") {
            $data = $data->where('pr.namaproduk', 'ilike', '%' . $request['namaproduk'] . '%');
        }
        $data = $data->get();



        $result = array(
            'data' => $data,
            'datalogin' => $dataLogin,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }

    public function SaveInputTagihan(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        \DB::beginTransaction();
        $transMessage = '';
        $req = $request->all();
        //        return $this->respond($req);
        try {

            if ($req['norec'] == '') {
                $SP = new StrukPelayanan();
                $norecSP = $SP->generateNewId();
                $noStruk = $this->generateCode(new StrukPelayanan, 'nostruk', 10, 'NLA' . $this->getDateTime()->format('ym'), $kdProfile);
                $SP->norec = $norecSP;
                $SP->kdprofile = $kdProfile;
                $SP->statusenabled = true;
                $SP->nostruk = $noStruk;
            } else {
                $SP = StrukPelayanan::where('norec', $req['norec'])->where('kprofile', $kdProfile)->first();
                $DelSPD = StrukPelayananDetail::where('nostrukfk', $req['norec'])->where('kdprofile', $kdProfile)->delete();
            }
            $SP->objectkelompoktransaksifk = $req['kelompoktransaksifk'];
            $SP->keteranganlainnya = $req['keteranganlainnya'];
            $SP->namapasien_klien = $req['namaPasien_klien'];
            $SP->nostruk_intern = $req['nocm'];
            if (isset($req['notelp_klien'])) {
                $SP->noteleponfaks = $req['notelp_klien'];
            }
            if (isset($req['alamat'])) {
                $SP->namatempattujuan =  $req['alamat']; //alamat
            }
            if (isset($req['tglLahir'])) {
                $SP->tglfaktur =  $req['tglLahir']; //tgllahir
            }
            $SP->tglstruk = $req['tglstruk'];
            $SP->totalharusdibayar = $req['totalharusdibayar'];
            $SP->save();

            $hargaTambahanP = 0;
            $hargaTambahanD = 0;

            foreach ($req['details'] as $item) {
                if ($req['perawat'] == true || $req['perawat'] == 'true') {
                    $hargaTambahanP = (float) $item['harga'] * 25 / 100;
                }
                if ($req['dokter'] == true || $req['dokter'] == 'true') {
                    $hargaTambahanD = (float) $item['harga'] * 25 / 100;
                }
                $SPD = new StrukPelayananDetail();
                $norecKS = $SPD->generateNewId();
                $SPD->norec = $norecKS;
                $SPD->kdprofile = $kdProfile;
                $SPD->statusenabled = true;
                $SPD->nostrukfk = $SP->norec;
                $SPD->objectprodukfk = $item['id'];
                $SPD->hargadiscount = 0;
                $SPD->hargadiscountgive = 0;
                $SPD->hargadiscountsave = 0;
                $SPD->harganetto = $item['harga'];
                $SPD->hargapph = 0;
                $SPD->hargappn = 0;
                $SPD->hargasatuan = $item['harga'];
                $SPD->hargasatuandijamin = 0;
                $SPD->hargasatuanppenjamin = 0;
                $SPD->hargasatuanpprofile = 0;
                $SPD->hargatambahan = $hargaTambahanP + $hargaTambahanD;
                $SPD->isonsiteservice = 0;
                $SPD->kdpenjaminpasien = 0;
                $SPD->persendiscount = 0;
                $SPD->qtyproduk = $item['jumlah'];
                $SPD->qtyoranglast = $item['qtyoranglast'];
                $SPD->qtyprodukoutext = 0;
                $SPD->qtyprodukoutint = 0;
                $SPD->qtyprodukretur = 0;
                $SPD->satuan = 0;
                $SPD->tglpelayanan = $req['tglstruk'];
                $SPD->is_terbayar = 0;
                $SPD->linetotal = 0;
                $SPD->keteranganlainnya = $item['keterangan'];
                $SPD->isjasaperawat = $req['perawat'];
                $SPD->isjasadokter = $req['dokter'];
                $SPD->save();
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Tagihan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "data" => $SP,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Simpan Tagihan Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "data" => $SP,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function daftarTagihanNonLayanan(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $filter = $request->all();
        $list = explode(',', $this->settingDataFixed('kdTransaksiNonLayanan', $kdProfile));
        $KdList = [];
        foreach ($list as $item) {
            $KdList[] =  (int)$item;
        }
        $datakelompokuser = \DB::table('loginuser_s as lu')
            ->select('lu.objectkelompokuserfk')
            ->where('lu.kdprofile', $kdProfile)
            ->where('lu.id', '=', $filter['userData']['id'])
            ->get();

            if ($datakelompokuser[0]->objectkelompokuserfk == 58) {
                $dataNonLayanan = \DB::table('strukpelayanan_t as sp')
                    ->join('kelompoktransaksi_m as kt', 'sp.objectkelompoktransaksifk', '=', 'kt.id')
                    ->select(
                        'sp.norec',
                        'sp.tglstruk',
                        'sp.namapasien_klien',
                        'kt.reportdisplay as jenistagihan',
                        'sp.isverifikasi',
                        'keteranganlainnya',
                        'sp.nosbklastfk',
                        'sp.nosbmlastfk',
                        'kt.id as jenisTagihanId',
                        \DB::raw("CAST(sp.totalharusdibayar AS FLOAT) AS totalharusdibayar ")
                    )
                    ->where('sp.kdprofile', $kdProfile)
                    ->whereNotNull('sp.totalharusdibayar')
                    ->whereIn('sp.objectkelompoktransaksifk', $KdList)
                    ->where(function($query) {
                        $query->where(function($q) {
                            $q->where('sp.istelemedicine', true)
                              ->where('sp.isapprove', true);
                        })->orWhereNull('sp.istelemedicine');
                    })
                    ->whereIn('sp.objectkelompoktransaksifk', $KdList)
                    ->where('kt.id', '=', 13);
            } else {
                $dataNonLayanan = \DB::table('strukpelayanan_t as sp')
                    ->join('kelompoktransaksi_m as kt', 'sp.objectkelompoktransaksifk', '=', 'kt.id')
                    ->select(
                        'sp.norec',
                        'sp.tglstruk',
                        'sp.namapasien_klien',
                        'kt.reportdisplay as jenistagihan',
                        'keteranganlainnya',
                        'sp.nosbklastfk',
                        'sp.nosbmlastfk',
                        'kt.id as jenisTagihanId',
                        \DB::raw("CAST(sp.totalharusdibayar AS FLOAT) AS totalharusdibayar")
                    )
                    ->where('sp.kdprofile', $kdProfile)
                    ->whereNotNull('sp.totalharusdibayar')
                    ->whereIn('sp.objectkelompoktransaksifk', $KdList)
                    ->where(function($query) {
                        $query->where(function($q) {
                            $q->where('sp.istelemedicine', true)
                              ->where('sp.isapprove', true);
                        })->orWhereNull('sp.istelemedicine');
                    })
                    ->where('sp.objectkelompoktransaksifk', '=', 9);
            }

        // if ($datakelompokuser[0]->objectkelompokuserfk == 58) {
        //     $dataNonLayanan = \DB::table('strukpelayanan_t as sp')
        //         ->join('kelompoktransaksi_m as kt', 'sp.objectkelompoktransaksifk', '=', 'kt.id')
        //         ->select(
        //             'sp.norec',
        //             'sp.tglstruk',
        //             'sp.namapasien_klien',
        //             'kt.reportdisplay as jenistagihan',
        //             'sp.isverifikasi',
        //             'keteranganlainnya',
        //             'sp.nosbklastfk',
        //             'sp.nosbmlastfk',
        //             'kt.id as jenisTagihanId',
        //             \DB::raw("CAST(sp.totalharusdibayar AS FLOAT) AS totalharusdibayar ")
        //         )
        //         ->where('sp.kdprofile', $kdProfile)
        //         ->whereNotNull('sp.totalharusdibayar')
        //         ->whereIn('sp.objectkelompoktransaksifk', $KdList)
        //         ->where('kt.id', '=', 13);
        // } else {
        //     $dataNonLayanan = \DB::table('strukpelayanan_t as sp')
        //         ->join('kelompoktransaksi_m as kt', 'sp.objectkelompoktransaksifk', '=', 'kt.id')
        //         ->select(
        //             'sp.norec',
        //             'sp.tglstruk',
        //             'sp.namapasien_klien',
        //             'kt.reportdisplay as jenistagihan',
        //             'keteranganlainnya',
        //             'sp.nosbklastfk',
        //             'sp.nosbmlastfk',
        //             'kt.id as jenisTagihanId',
        //             \DB::raw("CAST(sp.totalharusdibayar AS FLOAT) AS totalharusdibayar")
        //         )
        //         //            ->whereNull('sp.noregistrasifk')
        //         ->where('sp.kdprofile', $kdProfile)
        //         ->whereNotNull('sp.totalharusdibayar')
        //         ->where('sp.objectkelompoktransaksifk', '=', 9);
        //         // ->whereIn('sp.objectkelompoktransaksifk', $KdList);
        //     //            ->where('spp.kdrekananpenjamin', 0);->whereIn('id', [1, 2, 3])
        // }

        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "") {
            $dataNonLayanan = $dataNonLayanan->where('sp.tglstruk', '>=', $filter['tglAwal']);
        }

        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "") {
            $tgl = $filter['tglAkhir']; //." 23:59:59";
            $dataNonLayanan = $dataNonLayanan->where('sp.tglstruk', '<=', $tgl);
        }
        //
        if (isset($filter['jenisTagihanId']) && $filter['jenisTagihanId'] != "") {
            $dataNonLayanan = $dataNonLayanan->where('kt.id', '=', $filter['jenisTagihanId']);
        }

        if (isset($filter['namaPelanggan']) && $filter['namaPelanggan'] != "") {
            $dataNonLayanan = $dataNonLayanan->where('sp.namapasien_klien', 'ilike', '%' . $filter['namaPelanggan'] . '%');
        }
        //
        if (isset($filter['status']) && $filter['status'] != "") {
            if ($filter['status'] == 'Lunas') {
                $dataNonLayanan = $dataNonLayanan->whereNotNull('sp.nosbmlastfk');
            } else {
                $dataNonLayanan = $dataNonLayanan->whereNull('sp.nosbmlastfk');
            }
        }
        if (isset($filter['statusK']) && $filter['statusK'] != "") {
            if ($filter['statusK'] == 'Lunas') {
                $dataNonLayanan = $dataNonLayanan->whereNotNull('sp.nosbklastfk');
            } else {
                $dataNonLayanan = $dataNonLayanan->whereNull('sp.nosbklastfk');
            }
        }

        //        $dataPiutang=$dataPiutang->groupBy('kp.kelompokpasien', 'spp.norec','sp.tglstruk', 'pd.noregistrasi', 'pd.tglregistrasi','p.nocm','p.namapasien','spp.totalppenjamin','spp.totalharusdibayar',
        //            'spp.totalsudahdibayar', 'r.namarekanan', 'spp.totalbiaya', 'spp.noverifikasi');
        $dataNonLayanan = $dataNonLayanan->where('sp.statusenabled', '=', true);
        $dataNonLayanan = $dataNonLayanan->whereNull('sp.isverifikasi');
        $dataNonLayanan = $dataNonLayanan->get();
        $result = array();
        foreach ($dataNonLayanan as $item) {
            $statusBayar = "Belum Bayar";
            if ($item->nosbmlastfk != null || $item->nosbklastfk != null) {
                $statusBayar = "Lunas";
            }
            $result[] = array(
                'noRec' => $item->norec,
                'tglTransaksi' => $item->tglstruk,
                'namaPelanggan' => $item->namapasien_klien,
                'jenisTagihan' => $item->jenistagihan,
                'totalDibayar' => $item->totalharusdibayar,
                'keterangan' => $item->keteranganlainnya,
                'jenisTagihanId' => $item->jenisTagihanId,
                'statusBayar' => $statusBayar

            );
        }

        return $this->respond($result, 'Data Tagihan Penunjang');
    }

    public function detailTagihanNonLayanan(Request $request)
    {
        $kdProfile = (int)$this->getDataKdProfile($request);
        $kdPelayananAmbulan = (int)$this->settingDataFixed('KdKelompokTransaksiAmbulance', $kdProfile);
        $noRec = $request['noRec'];
        $data = \DB::table('strukpelayanan_t as sp')
            ->join('kelompoktransaksi_m as kt', 'sp.objectkelompoktransaksifk', '=', 'kt.id')
            ->select(
                'sp.norec',
                'sp.tglstruk',
                'sp.namapasien_klien',
                'kt.reportdisplay as jenistagihan',
                'sp.totalharusdibayar',
                'keteranganlainnya',
                'sp.nosbklastfk',
                'sp.nosbmlastfk',
                'kt.id as jenisTagihanId',
                'sp.noteleponfaks as notelepon',
                'sp.namatempattujuan as alamatlengkap',
                'sp.tglfaktur as tgllahir',
                'sp.keteranganlainnya',
                DB::raw("CASE WHEN sp.nosbmlastfk IS NOT NULL OR sp.nosbklastfk IS NOT NULL THEN 'Lunas' ELSE 'Belum Bayar' END AS statusbayar")
            )
            ->where('sp.kdprofile', $kdProfile)
            ->whereNotNull('sp.totalharusdibayar')
            ->where('sp.objectkelompoktransaksifk', $kdPelayananAmbulan)
            ->where('sp.norec', $noRec)
            ->first();

        $details = DB::select(
            DB::raw("select pr.namaproduk,spd.keteranganlainnya,spd.qtyproduk as jumlah,spd.hargasatuan as harga,
                     CASE WHEN isjasaperawat = true THEN spd.hargasatuan * 25/100 ELSE 0 END AS jasaperawat,
                     CASE WHEN isjasadokter = true THEN spd.hargasatuan * 25/100 ELSE 0 END AS jasadokter,
                     (spd.qtyproduk * spd.hargasatuan) + CASE WHEN isjasaperawat = true THEN spd.hargasatuan * 25/100 ELSE 0 END 
                     + CASE WHEN isjasadokter = true THEN spd.hargasatuan * 25/100 ELSE 0 END AS totalK,spd.isjasaperawat,spd.isjasadokter,
                     1 as qtyoranglast
                     from strukpelayanandetail_t as spd 
                     left JOIN produk_m as pr on pr.id=spd.objectprodukfk
                     where spd.kdprofile = $kdProfile and nostrukfk=:norec"),
            array(
                'norec' => $noRec,
            )
        );

        $result = array(
            'data' => $data,
            'detail' => $details,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function SaveInputTagihanVerif(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        \DB::beginTransaction();
        $transMessage = '';
        $req = $request->all();
        //        return $this->respond($req);
        try {

            if ($req['norec'] == '') {
                $SP = new StrukPelayanan();
                $norecSP = $SP->generateNewId();
                $noStruk = $this->generateCode(new StrukPelayanan, 'nostruk', 10, 'NLA' . $this->getDateTime()->format('ym'), $kdProfile);
                $SP->norec = $norecSP;
                $SP->kdprofile = $kdProfile;
                $SP->statusenabled = true;
                $SP->nostruk = $noStruk;
            } else {
                $SP = StrukPelayanan::where('norec', $req['norec'])->where('kprofile', $kdProfile)->first();
                $DelSPD = StrukPelayananDetail::where('nostrukfk', $req['norec'])->where('kdprofile', $kdProfile)->delete();
            }
            $SP->objectkelompoktransaksifk = $req['kelompoktransaksifk'];
            $SP->keteranganlainnya = $req['keteranganlainnya'];
            $SP->namapasien_klien = $req['namaPasien_klien'];
            $SP->nostruk_intern = $req['nocm'];
            if (isset($req['notelp_klien'])) {
                $SP->noteleponfaks = $req['notelp_klien'];
            }
            if (isset($req['alamat'])) {
                $SP->namatempattujuan =  $req['alamat']; //alamat
            }
            if (isset($req['tglLahir'])) {
                $SP->tglfaktur =  $req['tglLahir']; //tgllahir
            }
            $SP->tglstruk = $req['tglstruk'];
            $SP->totalharusdibayar = $req['totalharusdibayar'];
            $SP->save();

            $hargaTambahanP = 0;
            $hargaTambahanD = 0;

            foreach ($req['details'] as $item) {
                if ($req['perawat'] == true || $req['perawat'] == 'true') {
                    $hargaTambahanP = (float) $item['harga'] * 25 / 100;
                }
                if ($req['dokter'] == true || $req['dokter'] == 'true') {
                    $hargaTambahanD = (float) $item['harga'] * 25 / 100;
                }
                $SPD = new StrukPelayananDetail();
                $norecKS = $SPD->generateNewId();
                $SPD->norec = $norecKS;
                $SPD->kdprofile = $kdProfile;
                $SPD->statusenabled = true;
                $SPD->nostrukfk = $SP->norec;
                $SPD->objectprodukfk = $item['id'];
                $SPD->hargadiscount = 0;
                $SPD->hargadiscountgive = 0;
                $SPD->hargadiscountsave = 0;
                $SPD->harganetto = $item['harga'];
                $SPD->hargapph = 0;
                $SPD->hargappn = 0;
                $SPD->hargasatuan = $item['harga'];
                $SPD->hargasatuandijamin = 0;
                $SPD->hargasatuanppenjamin = 0;
                $SPD->hargasatuanpprofile = 0;
                $SPD->hargatambahan = $hargaTambahanP + $hargaTambahanD;
                $SPD->isonsiteservice = 0;
                $SPD->kdpenjaminpasien = 0;
                $SPD->persendiscount = 0;
                $SPD->qtyproduk = $item['jumlah'];
                $SPD->qtyoranglast = $item['qtyoranglast'];
                $SPD->qtyprodukoutext = 0;
                $SPD->qtyprodukoutint = 0;
                $SPD->qtyprodukretur = 0;
                $SPD->satuan = 0;
                $SPD->tglpelayanan = $req['tglstruk'];
                $SPD->is_terbayar = 0;
                $SPD->linetotal = 0;
                $SPD->keteranganlainnya = $item['keterangan'];
                $SPD->isjasaperawat = $req['perawat'];
                $SPD->isjasadokter = $req['dokter'];
                $SPD->save();
                if (isset($item['petugaspelaksana']) && $item['petugaspelaksana'] != null) {
                    foreach ($item['petugaspelaksana'] as $itemP) {
                        foreach ($itemP['listpegawai'] as $pegawai) {
                            $pkd = new PetugasKendaraanDinas();
                            $norecPKD = $pkd->generateNewId();
                            $pkd->norec = $norecPKD;
                            $pkd->kdprofile = $kdProfile;
                            $pkd->statusenabled = true;
                            $pkd->objectpetugasfk = $pegawai['id'];
                            $pkd->objectjenispetugaspelaksanafk = $itemP['objectjenispetugaspefk'];
                            $pkd->objectstrukpelayanandetailfk = $spd->norec;
                            $pkd->save();
                        }
                    }
                }
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Tagihan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "data" => $SP,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Simpan Tagihan Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "data" => $SP,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function lapKegiatanAmbulan(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $filter = $request->all();

        // Query untuk mendapatkan data
        $data = \DB::table('strukpelayanan_t as sp')
            ->leftJoin('strukbuktipenerimaan_t as sbm', 'sbm.norec', '=', 'sp.nosbmlastfk')
            ->leftJoin('strukpelayanandetail_t as spd', 'spd.nostrukfk', '=', 'sp.norec')
            ->leftJoin('petugaspelayananambulan_t as ppa', 'ppa.nostrukdetailfk', '=', 'spd.norec')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'ppa.objectpegawaifk')
            ->leftJoin('jenispegawai_m as jp', 'jp.id', '=', 'pg.objectjenispegawaifk')
            ->leftJoin('jeniskegiatanambulan_m as jka', function ($join) {
                $join->on('jka.id', '=', \DB::raw('CAST(spd.jeniskegiatanambulanfk AS BIGINT)'));
            })
            ->leftJoin('alamatnonlayanan_m as anl', 'anl.strukpelayanandetail', '=', 'spd.norec')
            ->distinct()
            ->select(
                'sp.nostruk',
                'sp.tglstruk', // Hanya tanggal
                'pg.namalengkap AS namapersonel',
                'spd.hargasatuan',
                'sp.namapasien_klien',
                'spd.nopolisifk',
                'jka.namajeniskegiatan',
                'anl.alamatlengkap as lokasitujuan'
            )
            ->where('sp.statusenabled', true)
            ->where('sp.kdprofile', (int)$kdProfile)
            ->where('jp.id', 48)
            ->whereNotNull('sp.nosbmlastfk');

        // Filter berdasarkan tanggal awal
        if (!empty($filter['tglAwal']) && strtotime($filter['tglAwal'])) {
            $data = $data->where('sp.tglstruk', '>=', $filter['tglAwal']);
        }

        // Filter berdasarkan tanggal akhir
        if (!empty($filter['tglAkhir']) && strtotime($filter['tglAkhir'])) {
            $data = $data->where('sp.tglstruk', '<=', $filter['tglAkhir']);
        }

        // Filter berdasarkan nama pasien/klien
        if (!empty($filter['nama'])) {
            $data = $data->where('sp.namapasien_klien', 'ilike', '%' . $filter['nama'] . '%');
        }

        // Urutkan berdasarkan tanggal struk
        $data = $data->orderBy('sp.tglstruk')->get();

        // Mengembalikan response
        return $this->respond($data);
    }

    public function getJenisKegiatanAmbulan(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $jeniskegiatan = \DB::table('jeniskegiatanambulan_m')
        ->select('id', 'namajeniskegiatan as nama')
        ->where('kdprofile', $idProfile)
        ->where('statusenabled', true)
        ->whereIn('id', [1, 5, 6]) //menjemput pasien
        ->whereNotNull('namajeniskegiatan')
        ->get();

        if(!empty($jeniskegiatan)){
            $result = array(
                'code' => 200,
                'data' => $jeniskegiatan,
                'message' => "Data kegiatan berhasil ditemukan",
                'success' => true
            );
        } else {
            $result = array(
                'code' => 404,
                'data' => null,
                'message' => 'Data kegiatan tidak ditemukan',
                'success' => false
            );
        }
        

        return $this->setStatusCode($result['code'])->respond($result);
    }

    public function getTarifAmbulan(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $data = \DB::table('produk_m as pr')
            ->JOIN('harganettoprodukbykelas_m as het', 'het.objectprodukfk', '=', 'pr.id')
            ->select('pr.id', 'pr.namaproduk', 'het.harganetto1 as harga')
            ->where('pr.kdprofile', $kdProfile)
            ->where('pr.statusenabled', true)
            ->where('het.objectkelasfk', 6)
            ->where('het.objectjenispelayananfk', 1)
            ->where('het.statusenabled', true)
            ->where('het.kodeexternal', '2024') //membedakan tarif baru
            ->whereIn('het.objectprodukfk', [5008618,5008619])
            ->orderBy('pr.id')
            ->get();

        if(!empty($data)){
            $result = array(
                'code' => 200,
                'data' => $data,
                'disclaimer' => "* Rp." . number_format($data[0]->harga, 0, ',', '.') . " <10 KM, jika >10 KM Rp." . number_format($data[0]->harga, 0, ',', '.') . " + " . number_format($data[1]->harga, 0, ',', '.') . "/KM",
                'message' => 'Tarif berhasil ditemukan',
                'success' => true
            );
        } else {
            $result = array(
                'code' => 404,
                'data' => null,
                'message' => 'Tarif tidak ditemukan',
                'success' => false
            );
        }

        return $this->setStatusCode($result['code'])->respond($result);
    }

   public function getRiwayatPelayananAmbulance(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $no_rm = $request['nocm']; 
        $query = "
            SELECT 
                STRING_AGG(pr.namaproduk, ', ') AS activity_type_name,
                SUM(spd.qtyproduk) AS total_qty,
                STRING_AGG(CONCAT(pr.namaproduk, ' (', spd.qtyproduk, ' x ', spd.hargasatuan, ')'), ', ') AS detail_items,
                SUM(spd.hargasatuan * spd.qtyproduk) AS total_rate,
                sp.tglstruk AS order_date,
                STRING_AGG(DISTINCT pm.namalengkap, ', ') AS driver_name,
                ra.nopolisi AS ambulance_plat,
                sp.nostruk AS order_number,
                CASE 
                    WHEN sp.isapprove IS NULL THEN 'Menunggu'
                    WHEN sp.isapprove = FALSE THEN 'Ditolak'
                    WHEN sp.isapprove = TRUE THEN 'Diterima'
                END AS status
            FROM strukpelayanan_t AS sp
            LEFT JOIN strukpelayanandetail_t AS spd ON spd.nostrukfk = sp.norec
            LEFT JOIN produk_m AS pr ON pr.id = spd.objectprodukfk
            LEFT JOIN petugaspelayananambulan_t AS ppa ON ppa.nostrukdetailfk = spd.norec
            LEFT JOIN pegawai_m AS pm ON pm.id = ppa.objectpegawaifk
            INNER JOIN pasien_m AS ps ON ps.nocm = sp.nocmklien
            LEFT JOIN registrasiaset_t AS ra ON ra.norec = spd.nopolisifk
            WHERE sp.nocmklien = '$no_rm' 
                AND sp.kdprofile = $kdProfile 
                AND sp.statusenabled = TRUE 
                AND sp.isapprove IS NOT NULL";
        
        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $query .= " AND sp.tglstruk >= '{$request['tglAwal']}'";
        }
        
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $query .= " AND sp.tglstruk <= '{$request['tglAkhir']}'";
        }
        
        $query .= "
            GROUP BY 
                sp.nostruk, 
                sp.tglstruk, 
                sp.isapprove, 
                ra.nopolisi
            ORDER BY sp.tglstruk DESC";
        
        $data = DB::select(DB::raw($query));

        if(!empty($data)){
            $result = array(
                'code' => 200,
                'data' => $data,
                'message' => 'Data history berhasil ditemukan',
                'success' => true
            );
        } else {
            $result = array(
                'code' => 404,
                'data' => null,
                'message' => 'Data history tidak ditemukan',
                'success' => false
            );
        }

        return $this->setStatusCode($result['code'])->respond($result);
    }

    public function SaveInputTagihanFromTelemedicine(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $transMessage = '';
        $req = $request->all();

        $pasien = \DB::table('pasien_m')
            ->where('kdprofile', $kdProfile)
            ->where('nocm', $req['nocm_klien'])
            ->first();
        
        if(empty($pasien)){
            $transMessage = "Pasien tidak terdaftar";
            $result = array(
                "status" => 404,
                "message"  => $transMessage,
                "as" => 'as@epic',
            );
            return $this->setStatusCode($result['status'])->respond($result, $transMessage);
        }

        \DB::beginTransaction();
        try {
            // if ($req['norec'] == '') {
                $SP = new StrukPelayanan();
                $norecSP = $SP->generateNewId();
                $noStruk = $this->generateCode(new StrukPelayanan, 'nostruk', 10, 'NLA' . $this->getDateTime()->format('ym'), $kdProfile);
                $SP->norec = $norecSP;
                $SP->kdprofile = $kdProfile;
                $SP->statusenabled = true;
                $SP->nostruk = $noStruk;
            // } else {
            //     $SP = StrukPelayanan::where('norec', $req['norec'])->where('kprofile', $kdProfile)->first();
            //     $DelSPD = StrukPelayananDetail::where('nostrukfk', $req['norec'])->where('kdprofile', $kdProfile)->delete();
            // }
            $SP->objectkelompoktransaksifk = 9; //pelayanan ambulance
            if (isset($req['keterangan'])) {
                $SP->keteranganlainnya = $req['keterangan'];
            }else {
                $SP->keteranganlainnya = "-";
            }
            $SP->nocmfk = $pasien->id;
            $SP->namapasien_klien = $req['namapasien_klien'];
            $SP->nocmklien = $req['nocm_klien'];
            $SP->nostruk_intern = $req['nocm_klien'];
            if (isset($req['notelp_klien'])) {
                $SP->noteleponfaks = $req['notelp_klien'];
            }
            if (isset($req['alamat'])) {
                $SP->namatempattujuan =  $req['alamat']; //alamat
            }
            if (isset($req['tglLahir'])) {
                $SP->tglfaktur =  $req['tglLahir']; //tgllahir
            }
            $SP->tglstruk = $req['tglstruk'];
            $SP->totalharusdibayar = $req['totalharusdibayar'];
            $SP->istelemedicine = true;
            //auto appprove emergency
            if ($req['jeniskegiatan'] == 6) {
                $SP->isapprove = true;       
            } else {
                $SP->isapprove = null; 
            }
            $SP->save();

            // $detail = $req['details']; 
            foreach ($req['details'] as $item) {
                $SPD = new StrukPelayananDetail();
                $norecKS = $SPD->generateNewId();
                $SPD->norec = $norecKS;
                $SPD->kdprofile = $kdProfile;
                $SPD->statusenabled = true;
                $SPD->nostrukfk = $SP->norec;
                $SPD->objectprodukfk = $item['id'];
                $SPD->hargadiscount = 0;
                $SPD->hargadiscountgive = 0;
                $SPD->hargadiscountsave = 0;
                $SPD->harganetto = $item['harga'];
                $SPD->hargapph = 0;
                $SPD->hargappn = 0;
                $SPD->hargasatuan = $item['harga'];
                $SPD->hargasatuandijamin = 0;
                $SPD->hargasatuanppenjamin = 0;
                $SPD->hargasatuanpprofile = 0;
                $SPD->hargatambahan = 0;
                $SPD->isonsiteservice = 0;
                $SPD->kdpenjaminpasien = 0;
                $SPD->persendiscount = 0;
                $SPD->qtyproduk = $item['jumlah'];
                $SPD->qtyprodukoutext = 0;
                $SPD->qtyprodukoutint = 0;
                $SPD->qtyprodukretur = 0;
                $SPD->satuan = 0;
                $SPD->tglpelayanan = $req['tglstruk'];
                $SPD->is_terbayar = 0;
                $SPD->linetotal = 0;
                $SPD->jeniskegiatanambulanfk = $req['jeniskegiatan'];
                $SPD->jarak = $item['jarak'];
                $SPD->address = $item['address'];
                $SPD->map_lat = $item['map_lat'];
                $SPD->map_lng = $item['map_lng'];
                $SPD->nama_pasien = $item['nama_pasien'] ?? '';
                $SPD->nik = $item['nik'] ?? '';
                $SPD->save();              

                $secret_token = \DB::table('settingdatafixed_m')
                    ->where('kdprofile', $kdProfile)
                    ->where('statusenabled', true)
                    ->where('namafield', 'secret_token_telemedicine')
                    ->value('nilaifield'); 

                $id_chat = \DB::table('settingdatafixed_m')
                    ->where('kdprofile', $kdProfile)
                    ->where('statusenabled', true)
                    ->where('namafield', 'id_telemedicine')
                    ->value('nilaifield'); 

                $jenisKegiatanNama = \DB::table('jeniskegiatanambulan_m')
                    ->where('id', $req['jeniskegiatan'])
                    ->value('namajeniskegiatan');

                if ($secret_token && $id_chat) {
                    $url = "https://api.telegram.org/bot" . $secret_token . "/sendMessage?parse_mode=html&chat_id=" . $id_chat;
                    $url .= "&text=" . urlencode("<b>Order Baru dari Telemedicine:</b>" . "\n" .
                        "No. Order: " . $SP->nostruk . "\n" .
                        "Nama Pasien: " . $SP->namapasien_klien . "\n" .
                        // "Total Skor Panss-ec: " . $PANS->totalskor . "\n" .
                        "No. RM: " . $SP->nocmklien . "\n" .
                        "Jarak: " . $item['jarak'] . " KM\n" .
                        "Alamat Tujuan: " . $item['address'] . "\n" .
                        "Jenis Kegiatan: " . ($jenisKegiatanNama ?? 'N/A') . "\n" .
                        "Total Biaya: Rp. " . number_format($SP->totalharusdibayar, 0, ',', '.'));

                    $ch = curl_init();
                    curl_setopt_array($ch, [
                        CURLOPT_URL => $url,
                        CURLOPT_RETURNTRANSFER => true
                    ]);
                    $response = curl_exec($ch);
                    curl_close($ch);

                    // Ambil message_id dan pin message
                    $res = json_decode($response, true);
                    if (isset($res['result']['message_id'])) {
                        $messageId = $res['result']['message_id'];
                        $pinUrl = "https://api.telegram.org/bot" . $secret_token . "/pinChatMessage";
                        $pinUrl .= "?chat_id=" . $id_chat . "&message_id=" . $messageId;

                        $chPin = curl_init();
                        curl_setopt_array($chPin, [
                            CURLOPT_URL => $pinUrl,
                            CURLOPT_RETURNTRANSFER => true
                        ]);
                        curl_exec($chPin);
                        curl_close($chPin);
                    }
                }
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Order berhasil dibuat";
            DB::commit();
            
            // Set status order emergency langsung terverifikasi
            $statusOrder = ($req['jeniskegiatan'] == 6) ? 'verifikasi' : 'Menunggu';

            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "data" => [
                    "order_number" => $SP->nostruk,
                    "price" => $SP->totalharusdibayar,
                    "status_order" => $statusOrder,
                ],
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Order Gagal.";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result);
    }

    public function getDaftarOrderAmbulanDariTelemedicine(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $data = \DB::table('strukpelayanan_t as sp')
            ->join('pasien_m as pm', 'pm.id', '=', 'sp.nocmfk')
            ->join('strukpelayanandetail_t as spd', 'spd.nostrukfk', '=', 'sp.norec')
            ->select(
                'sp.norec',
                'sp.totalharusdibayar',
                'sp.tglstruk',
                'sp.nostruk',
                'sp.namapasien_klien',
                'spd.nama_pasien',
                'sp.noteleponfaks',
                'pm.nocm',
                'pm.namapasien',
                DB::raw("
                    CASE 
                        WHEN sp.isapprove IS NULL THEN 'MENUNGGU' 
                        WHEN sp.isapprove = true THEN 'DITERIMA' 
                        ELSE 'DITOLAK' 
                    END AS status
                "),
                DB::raw("
                    CASE
                        WHEN spd.jeniskegiatanambulanfk::integer = 1 THEN 'MENJEMPUT PASIEN'
                        WHEN spd.jeniskegiatanambulanfk::integer = 5 THEN 'MENJEMPUT PASIEN PSIKIATRI'
                        ELSE 'MENJEMPUT PASIEN EMERGENCY'
                    END AS jenis_kegiatan
                ")
            )
            ->where('sp.kdprofile', $idProfile)
            ->where('sp.statusenabled', true)
            ->where('sp.objectkelompoktransaksifk', 9) //pelayanan ambulance
            ->where('sp.istelemedicine', true);

        if (isset($request['isNotVerif']) && $request['isNotVerif'] != "" && $request['isNotVerif'] != "undefined") {
            if ($request['isNotVerif'] == true) {
                $data = $data->whereNull('sp.isapprove');
            }
        } else {
            if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
                $data = $data->where('sp.tglstruk', '>=', $request['tglAwal']);
            }
            if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
                $tgl = $request['tglAkhir'];
                $data = $data->where('sp.tglstruk', '<=', $tgl);
            }
        }
        
        if (isset($request['nocm']) && $request['nocm'] != "" && $request['nocm'] != "undefined") {
            $data = $data->where('pm.nocm', 'ilike', '%' . $request['nocm'] . '%');
        }
        if (isset($request['namapasien']) && $request['namapasien'] != "" && $request['namapasien'] != "undefined") {
            $data = $data->where('pm.namapasien', 'ilike', '%' . $request['namapasien'] . '%');
        }
        if (isset($request['noOrders']) && $request['noOrders'] != "" && $request['noOrders'] != "undefined") {
            $data = $data->where('sp.nostruk', 'ilike', '%' . $request['noOrders'] . '%');
        }
        if (isset($request['jmlRow']) && $request['jmlRow'] != "" && $request['jmlRow'] != "undefined") {
            $data = $data->take($request['jmlRow']);
        }
        $data = $data->orderBy('sp.tglstruk', 'desc');
        $data = $data->get();

        $dataResult = array(
            'message' =>  'inhuman',
            'data' =>  $data,
        );
        return $this->respond($dataResult);
    }
   public function getDaftarDetailOrderAmbulanDariTelemedicine(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $data = \DB::table('strukpelayanandetail_t as spd')
            ->join('produk_m as prd', 'prd.id', '=', 'spd.objectprodukfk')
            ->leftJoin('panssec_history as psh', 'psh.strukpelayananfk', '=', 'spd.nostrukfk')
            ->select(
                'spd.norec as norec_pp',
                'spd.qtyproduk',
                'spd.hargasatuan',
                'spd.jarak',
                'spd.address',
                'psh.s',
                'psh.o',
                'psh.a',
                'psh.p',
                'psh.totalskor',
                'prd.namaproduk',
                DB::raw("spd.qtyproduk * spd.hargasatuan AS hargatotal"),
                'spd.jeniskegiatanambulanfk'
            )
            ->where('spd.kdprofile', $idProfile)
            ->where('spd.statusenabled', true)
            ->where('spd.nostrukfk', $request['norec'])
            ->get();

        $collectdata = [];
        foreach ($data as $item) {
            $keterangan = $this->getPansSecKeterangan($item->totalskor, 'numbered');
            $item->keterangan = $keterangan;
            $collectdata[] = $item;
        }

        $dataResult = [
            'message' => 'success',
            'data' => $collectdata,
        ];

        return $this->respond($dataResult);
    }

    // Method helper untuk mendapatkan keterangan 
    public function getPansSecKeterangan($totalSkor, $format = 'numbered')
    {
        if (empty($totalSkor) || !is_numeric($totalSkor)) {
            return '';
        }

        try {
            $kriteria = \DB::table('panssec_kriteria_m')
                ->select('id', 'nilaimin', 'nilaimax')
                ->where('statusenabled', true)
                ->where('nilaimin', '<=', $totalSkor)
                ->where('nilaimax', '>=', $totalSkor)
                ->first();

            if (!$kriteria) {
                return '';
            }
            $protokol = \DB::table('panssec_kriteria_d')
                ->select('text', 'nourut')
                ->where('panssec_kriteriafk', $kriteria->id)
                ->where('statusenabled', true)
                ->orderBy('nourut', 'asc')
                ->get();

            if (empty($protokol)) {
                return '';
            }

            $protokolTexts = array_map(function ($item) {
                return $item->text;
            }, $protokol);

            switch ($format) {
                case 'numbered':
                    $numbered = array_map(function ($text, $index) {
                        return ($index + 1) . '. ' . $text;
                    }, $protokolTexts, array_keys($protokolTexts));
                    return implode('<br>', $numbered);

                case 'simple':
                default:
                    return implode(' | ', $protokolTexts);
            }
        } catch (\Exception $e) {   
            return 'Gagal Mendapatkan Keterangan: ' . $e->getMessage();
        }
    }

    // Method alternatif untuk customize format keterangan
    public function formatKeteranganPanssec($protokolArray, $scoreRange = '')
    {
        if (empty($protokolArray)) {
            return '';
        }

        $header = $scoreRange ? "Skor PANSS-EC: {$scoreRange}\n" : '';
        $protokolFormatted = array_map(function ($text, $index) {
            return ($index + 1) . '. ' . trim($text);
        }, $protokolArray, array_keys($protokolArray));

        return $header . implode("\n", $protokolFormatted);
    }

    public function getComboTelemedicine(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile =(int) $kdProfile;
        $pegawai = \DB::table('pegawai_m as pg')
            ->select('id', 'namalengkap', 'uuid_telemedicine')
            ->where('pg.statusenabled', true)
            ->where('pg.kdprofile', $idProfile)
            ->whereNotNull('uuid_telemedicine')
            ->orderBy('pg.namalengkap')
            ->get();

        $nopol = \DB::table('registrasiaset_t')
        ->select('norec', 'nopolisi', 'uuid_telemedicine')
        ->where('kdprofile', $kdProfile)
        ->where('statusenabled', true)
        ->whereNotNull('nopolisi')
        ->whereNotNull('uuid_telemedicine')
        ->where('keteranganlainnya', 'ilike', '%ambulan%')
        ->get();

        $dokter = \DB::table('pegawai_m as pg')
        ->select('id', 'namalengkap')
        ->where('pg.statusenabled', true)
        ->where('pg.kdprofile', $idProfile)
        ->where('pg.objectjenispegawaifk', 1)
        ->orderBy('pg.namalengkap')
        ->get();

        $perawat = \DB::table('pegawai_m as pg')
        ->select('id', 'namalengkap')
        ->where('pg.statusenabled', true)
        ->where('pg.kdprofile', $idProfile)
        ->where('pg.objectjenispegawaifk', 2)
        ->orderBy('pg.namalengkap')
        ->get();

        $jeniskegiatan = \DB::table('jeniskegiatanambulan_m')
        ->select('id', 'namajeniskegiatan')
        ->where('kdprofile', $kdProfile)
        ->where('statusenabled', true)
        ->whereNotNull('namajeniskegiatan')
        ->get();

        $result = array(
            'jeniskegiatan' => $jeniskegiatan,
            'dokter' => $dokter,
            'perawat' => $perawat,
            'pegawai' => $pegawai,
            'nopol' => $nopol,
            'message' => 'ramdanegie',
        );

        return $this->respond($result);
    }

    public function savePelayananPasienAmbulanDariTelemedicine(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $transMessage = '';
        $req = $request->all();
        $verifikasi = strtolower($req['verifikasi']);
        $ket_verif_simrs = null;
        $ket_verif_telemedicine = "menunggu";

        if($verifikasi == "diterima"){
            $ket_verif_simrs = true;
            $ket_verif_telemedicine = 'verifikasi';
        } else if($verifikasi == "ditolak") {
            $ket_verif_simrs = false;
            $ket_verif_telemedicine = 'rejected';
        } else {
            $ket_verif_simrs = null;
            $ket_verif_telemedicine = "menunggu";
        }

        $pasien = \DB::table('pasien_m')
            ->where('kdprofile', $kdProfile)
            ->where('nocm', $req['nocm'])
            ->first();
        
        if(empty($pasien)){
            $transMessage = "Pasien tidak terdaftar";
            $result = array(
                "status" => 404,
                "message" => $transMessage,
                "as" => 'as@epic',
            );
            return $this->setStatusCode($result['status'])->respond($result, $transMessage);
        }

        \DB::beginTransaction();
        try {
            $SP = StrukPelayanan::where('norec', $req['norec_sp'])->where('kdprofile', $kdProfile)->first();
            $SP->isapprove = $ket_verif_simrs;
            $SP->keterangan = $req['messages'] ?? '-';
            $SP->save();

            $SPD = StrukPelayananDetail::where('nostrukfk', $req['norec_sp'])->where('kdprofile', $kdProfile)->get();
            $petugasData = $req['petugaspelayananambulan'] ?? [];

            if($verifikasi == "diterima"){
                foreach ($SPD as $data) {
                    $update_SPD = StrukPelayananDetail::where('norec', $data['norec'])->where('kdprofile', $kdProfile)->first();
                    $update_SPD->nopolisifk = $req['kendaraan'];
                    $update_SPD->jeniskegiatanambulanfk = $req['kegiatan_id'];
                    $update_SPD->save();
                }

                foreach ($req['bridging_data'] as $item) {
                    $PetugasPelAmbulan = new PetugasPelayananAmbulan();
                    $PetugasPelAmbulan->norec = $PetugasPelAmbulan->generateNewId();
                    $PetugasPelAmbulan->kdprofile = $kdProfile;
                    $PetugasPelAmbulan->statusenabled = true;
                    $PetugasPelAmbulan->objectpegawaifk = $req['driver_id'];

                    if (isset($petugasData[0]['objectpegawaifk'])) {
                        $PetugasPelAmbulan->objectpegawaifk1 = $petugasData[0]['objectpegawaifk'];
                    }
                    if (isset($petugasData[1]['objectpegawaifk'])) {
                        $PetugasPelAmbulan->objectpegawaifk2 = $petugasData[1]['objectpegawaifk'];
                    }
                    if (isset($petugasData[2]['objectpegawaifk'])) {
                        $PetugasPelAmbulan->objectpegawaifk3 = $petugasData[2]['objectpegawaifk'];
                    }

                    $PetugasPelAmbulan->nostrukdetailfk = $item['norec_pp'];
                    $PetugasPelAmbulan->tglpelayanan = Carbon::now()->format('Y-m-d H:i:s');
                    $PetugasPelAmbulan->save();
                }
            } else if($verifikasi == "ditolak") {
                foreach ($SPD as $data) {
                    StrukPelayananDetail::where('norec', $data['norec'])
                    ->where('kdprofile', $kdProfile)
                    ->update(['statusenabled' => false]);
                }
            }

            // Ambil settingan telemd
            $baseUrlTelemedicine = $this->settingDataFixed('UrlBridgingTelemedicine', $kdProfile);
            $username = $this->settingDataFixed('UsernameBridgingTelemedicine', $kdProfile);
            $password = $this->settingDataFixed('PwBridgingTelemedicine', $kdProfile);
            $token = "";

            // Get token dari telemedicine
            $header_auth = array(
                "Content-Type: application/json",
                "Accept: application/json",
            );
            $urlTelemedicineAuth = $baseUrlTelemedicine . "auth/token";
            $methodAuth = 'POST';
            $dataJsonSendAuth = array(
                "email" => $username,
                "password" => $password
            );
            $data_kirim_auth = json_encode($dataJsonSendAuth);
            $send_auth_telemedicine = $this->sendBridgingCurl($header_auth, $data_kirim_auth, $urlTelemedicineAuth, $methodAuth);

            if($send_auth_telemedicine->code == 200){
                $token = $send_auth_telemedicine->data->token;
            }

            if($token != ""){
                $headers = array(
                    "Authorization: Bearer " . $token,
                    "Content-Type: application/json",
                    "Accept: application/json",
                );
    
                $methods = 'PUT';
                $urlTelemedicine = $baseUrlTelemedicine . "verification-ambulance-orders";
                
                $uuid_officer = $req['driver_uuid_telemedicine'] ?? '';
                if (empty($uuid_officer) && isset($petugasData[0]['uuid_telemedicine'])) {
                    $uuid_officer = $petugasData[0]['uuid_telemedicine'];
                }

                $dataJsonSend = array(
                    "order_number" => $req['nomor_order'],
                    "uuid_officer" => $req['driver_uuid_telemedicine'],
                    "uuid_ambulance" => $req['kendaraan_uuid_telemedicine'],
                    "status_order" => $ket_verif_telemedicine,
                    "messages" => $req['messages'] ?? '-',
                );

                $data_kirim = json_encode($dataJsonSend);
                $send_data_telemedicine = $this->sendBridgingCurl($headers, $data_kirim, $urlTelemedicine, $methods);      
                if ($send_data_telemedicine->code != 200){
                    $transMessage = "Verifikasi Gagal.";
                    \DB::rollBack();
                    $result = array(
                        "status" => 400,
                        "message" => $transMessage,
                        "error" => $send_data_telemedicine->messages ?? 'Response error dari telemedicine',
                        "as" => 'ea@epic',
                    );
                    return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                }
            } else {
                $transMessage = "Verifikasi Gagal - Token tidak valid.";
                \DB::rollBack();
                $result = array(
                    "status" => 400,
                    "message" => $transMessage,
                    "error" => $send_auth_telemedicine->messages ?? 'Gagal mendapatkan token',
                    "as" => 'ea@epic',
                );
                return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Verifikasi Berhasil.";
            \DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Verifikasi Gagal.";
            \DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "error" => isset($e) ? $e->getMessage().' Line: '.$e->getLine() : 'Unknown error',
                "as" => 'as@epic',
            );
        }
        
        \Log::info('Final response:', $result);
        return $this->setStatusCode($result['status'])->respond($result);
    }  
    public function simpanNomorSurat(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        
        DB::beginTransaction();
        try {
            $req = $request->all();
            
            if (!isset($req['nomorsurat']) || empty($req['nomorsurat'])) {
                return $this->respond([
                    'status' => false,
                    'message' => 'Nomor surat tidak boleh kosong!'
                ]);
            }

            $dataSO = StrukPelayananDetail::where('nostrukfk', $req['norec'])
                ->where('kdprofile', $idProfile)
                ->get();

            if ($dataSO->isEmpty()) {
                DB::rollBack();
                return $this->respond([
                    'status' => false,
                    'message' => 'Data order tidak ditemukan!'
                ]);
            }
            
            foreach ($dataSO as $detail) {
                $detail->nomorsurat = $req['nomorsurat'];
                $detail->dasar_surat = $req['dasarsurat'] ?? null;
                $detail->save();
            }

            DB::commit();
            
            return $this->respond([
                'status' => true,
                'message' => 'Nomor surat berhasil disimpan untuk semua data terkait',
                'data' => $dataSO
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->respond([
                'status' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ]);
        }
    }

    public function lapKegiatanAmbulanTelemedicine(Request $request)
    {
    $kdProfile = $this->getDataKdProfile($request);
    $filter = $request->all();

    // Query untuk mendapatkan data
    $data = \DB::table('strukpelayanan_t as sp')
        ->leftJoin('strukpelayanandetail_t as spd', 'spd.nostrukfk', '=', 'sp.norec')
        ->leftJoin('petugaspelayananambulan_t as ppa', 'ppa.nostrukdetailfk', '=', 'spd.norec')
        ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'ppa.objectpegawaifk')
        ->leftJoin('jenispegawai_m as jp', 'jp.id', '=', 'pg.objectjenispegawaifk')
        ->leftJoin('jeniskegiatanambulan_m as jka', function ($join) {
            $join->on('jka.id', '=', \DB::raw('CAST(spd.jeniskegiatanambulanfk AS BIGINT)'));
        })
        ->leftJoin('alamatnonlayanan_m as anl', 'anl.strukpelayanandetail', '=', 'spd.norec')
        ->leftJoin('registrasiaset_t as ra', 'ra.norec', '=', 'spd.nopolisifk')
        ->select(
            'sp.nostruk',
            'sp.tglstruk',
            'pg.namalengkap AS namapersonel',
            \DB::raw('SUM(spd.hargasatuan) as total_harga'),
            'sp.namapasien_klien',
            'ra.nopolisi',
            'ra.keteranganlainnya',
            'jka.namajeniskegiatan',
            'spd.jarak',
            'anl.alamatlengkap as lokasitujuan',
            'sp.istelemedicine',
        )
        ->where('sp.statusenabled', true)
        // ->where('sp.istelemedicine', true)
        ->where('sp.kdprofile', (int)$kdProfile)
        ->where('jp.id', 48)
        ->groupBy(
            'sp.nostruk',
            'sp.tglstruk',
            'pg.namalengkap',
            'sp.namapasien_klien',
            'ra.nopolisi',
            'ra.keteranganlainnya',
            'jka.namajeniskegiatan',
            'spd.jarak',
            'anl.alamatlengkap',
            'sp.istelemedicine',
        );

    // Filter berdasarkan tanggal awal
    if (!empty($filter['tglAwal']) && strtotime($filter['tglAwal'])) {
        $data = $data->where('sp.tglstruk', '>=', $filter['tglAwal']);
    }

    // Filter berdasarkan tanggal akhir
    if (!empty($filter['tglAkhir']) && strtotime($filter['tglAkhir'])) {
        $data = $data->where('sp.tglstruk', '<=', $filter['tglAkhir']);
    }

    // Filter berdasarkan nama pasien/klien
    if (!empty($filter['nama'])) {
        $data = $data->where('sp.namapasien_klien', 'ilike', '%' . $filter['nama'] . '%');
    }

    // Filter berdasarkan jenis kegiatan
    if (!empty($filter['jenisKegiatan'])) {
        $data = $data->where('spd.jeniskegiatanambulanfk', '=', $filter['jenisKegiatan']);
    }
    
    // Filter berdasarkan jenis mobil (no polisi)
    if (!empty($filter['jenisMobil'])) {
        $data = $data->where('ra.norec', '=', $filter['jenisMobil']);
    }

    // Urutkan berdasarkan tanggal struk
    $data = $data->orderBy('sp.tglstruk')->get();

    // Mengembalikan response
    return $this->respond($data);
}

public function getJenisKegiatan(Request $request)
{
    $kdProfile = $this->getDataKdProfile($request);
    $idProfile = (int) $kdProfile;
    $jeniskegiatan = \DB::table('jeniskegiatanambulan_m')
    ->select('id', 'namajeniskegiatan as nama')
    ->where('kdprofile', $idProfile)
    ->where('statusenabled', true)
    ->whereNotNull('namajeniskegiatan')
    ->get();

    if(!empty($jeniskegiatan)){
        $result = array(
            'code' => 200,
            'data' => $jeniskegiatan,
            'message' => "Data kegiatan berhasil ditemukan",
            'success' => true
        );
    } else {
        $result = array(
            'code' => 404,
            'data' => null,
            'message' => 'Data kegiatan tidak ditemukan',
            'success' => false
        );
    }
    
    return $this->setStatusCode($result['code'])->respond($result);
}

public function getJenisMobil(Request $request){
    $kdProfile = $this->getDataKdProfile($request);
    $idProfile = (int) $kdProfile;
    
    $data = \DB::table('registrasiaset_t as ra')
        ->select('ra.norec as id', 'ra.nopolisi as jenismobil', 'ra.keteranganlainnya as namamobil')
        ->where('ra.kdprofile', $idProfile)
        ->where('ra.statusenabled', true)
        ->whereNotNull('ra.nopolisi')
        ->where('ra.keteranganlainnya', 'ilike', '%ambulan%')
        ->where('ra.nopolisi', '<>', '')
        ->orderBy('ra.nopolisi')
        ->get();
        
    $result = array(
        'data' => $data,
        'message' => 'er@epic',
    );
    
    return $this->respond($result);
}
public function getPanssSec(Request $request)
{
    
    try {
        $idProfil = (int) $this->getDataKdProfile($request);
        
        $data = \DB::table('panssec_m as m')
            ->leftJoin('panssec_d as d', 'm.id', '=', 'd.panssecfk')
            ->select(
                'm.id',
                'm.kode',
                'm.nama',
                'm.deskripsi',
                'm.dasar_penilaian',
                'd.id as skor_id',
                'd.skor',
                'd.label',
                'd.keterangan'
            )
            ->where('m.kdprofile', $idProfil)
            ->where('m.statusenabled', true)
            ->where(function($query) {
                $query->where('d.statusenabled', true)
                      ->orWhereNull('d.statusenabled'); 
            })
            // ->orderBy('m.nama')
            ->orderBy('m.id')
            ->orderBy('d.skor')
            ->get();

        if (empty($data)) {
            return response()->json([
                'code' => 404,
                'message' => 'Data PANSS tidak ditemukan',
                'success' => false
            ]);
        }

        $result = [];
        foreach ($data as $row) {
            $komponenId = $row->id;
            
    
            if (!isset($result[$komponenId])) {
                $result[$komponenId] = [
                    'id' => $row->id,
                    'kode' => $row->kode,    
                    'nama' => $row->nama,
                    'deskripsi' => $row->deskripsi,
                    'dasar_penilaian' => $row->dasar_penilaian,
                    'skor' => []
                ];
            }
    
            if ($row->skor_id) {
                $result[$komponenId]['skor'][] = [
                    'id' => $row->skor_id,
                    'skor' => $row->skor,
                    'label' => $row->label,
                    'keterangan' => $row->keterangan
                ];
            }
        }

        return response()->json([
            'code' => 200,
            'message' => 'Data PANSS berhasil dimuat',
            'data' => array_values($result),
            'success' => true
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'code' => 500,
            'message' => 'Kesalahan: ' . $e->getMessage(),
            'success' => false
        ]);
    }
}

public function getSlotting(Request $request)
{
    try {
        $idProfil = (int) $this->getDataKdProfile($request);
        $tanggal = $request->input('tanggal', date('Y-m-d')); 
        
        $data = \DB::table('slottingambulance_m as sa')
            ->leftJoin('jeniskegiatanambulan_m as jka', 'sa.objectkegiatanfk', '=', 'jka.id')
            ->select(
                'sa.id',
                'sa.quota',
                'sa.objectkegiatanfk',
                'jka.namajeniskegiatan as namakegiatan'
            )
            ->where('sa.kdprofile', $idProfil)
            ->where('sa.statusenabled', true)
            ->orderBy('sa.id')
            ->get();

        $sisaquotaData = \DB::table('strukpelayanan_t as sp')
            ->select(
                'sp.istelemedicine',
                \DB::raw('COUNT(sp.istelemedicine) as jumlah')
            )
            ->where('sp.kdprofile', $idProfil)
            ->where('sp.statusenabled', true)
            ->where(function($query) {
                $query->where('sp.isapprove', true)
                    ->orWhereNull('sp.isapprove');
            })
            ->whereDate('sp.tglstruk', '=', $tanggal) 
            ->whereNotNull('sp.istelemedicine')
            ->groupBy('sp.istelemedicine')
            ->get();

       
        $sisaquota = [];
        foreach ($sisaquotaData as $item) {
            $sisaquota[$item->istelemedicine] = $item->jumlah;
        }

        
        $result = [];
        foreach ($data as $item) {
            $terpakai = isset($sisaquota[$item->objectkegiatanfk]) ? $sisaquota[$item->objectkegiatanfk] : 0;
            $sisaQuota = $item->quota - $terpakai;
            
            $result[] = [
                'id' => $item->id,
                'quota' => $item->quota,
                'objectkegiatanfk' => $item->objectkegiatanfk,
                'namakegiatan' => $item->namakegiatan,
                'terpakai' => $terpakai,
                'sisa_quota' => max(0, $sisaQuota),
                'is_available' => $sisaQuota > 0, // Status tersedia atau tidak
                'tanggal' => $tanggal
            ];
        }

        return response()->json([
            'code' => 200,
            'message' => 'Data berhasil diambil',
            'success' => true,
            'data' => $result
        ]);

    } catch (\Exception $e) {
        \Log::error('Error in getSlotting: ' . $e->getMessage());
        
        return response()->json([
            'code' => 500,
            'message' => 'Terjadi kesalahan dalam mengambil data',
            'success' => false
        ]);
    }
}

public function getscorePansSec(Request $request) 
    {
        try {
            $kdprofile = $this->getDataKdProfile($request);
            $score = $request->input('score');
            
            // Validasi input score
            if (!$score || !is_numeric($score)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Score harus berupa angka dan tidak boleh kosong'
                ], 400);
            }
            
            $score = (int) $score;
            
            $kriteria = \DB::table('panssec_kriteria_m as pkm')
                ->select(
                    'pkm.id',
                    'pkm.nilaimin',
                    'pkm.nilaimax',
                    'pkm.statusenabled'
                )
                ->where('pkm.statusenabled', 't')
                ->where('pkm.nilaimin', '<=', $score)
                ->where('pkm.nilaimax', '>=', $score)
                ->first();
            
            if (!$kriteria) {
                return response()->json([
                    'code' => 404,
                    'success' => false,
                    'message' => 'Kriteria tidak ditemukan untuk score: ' . $score,
                    'score' => $score
                ], 404);
            }
            
            $protokol = \DB::table('panssec_kriteria_d as pkd')
                ->select(
                    'pkd.id',
                    'pkd.text',
                    'pkd.nourut'
                )
                ->where('pkd.panssec_kriteriafk', $kriteria->id)
                ->where('pkd.statusenabled', 't')
                ->orderBy('pkd.nourut', 'asc')
                ->get();
            
        
            $protokolArray = [];
            if ($protokol && count($protokol) > 0) {
                $protokolArray = collect($protokol)->map(function($item) {
                    return [
                        'id' => $item->id,
                        'text' => $item->text,
                        'order' => $item->nourut
                    ];
                })->toArray();
            }
            
        
            $result = [
                'kriteria' => [
                    'id' => $kriteria->id,
                    'score_min' => $kriteria->nilaimin,
                    'score_max' => $kriteria->nilaimax,
                    'score_range' => $kriteria->nilaimin . ' - ' . $kriteria->nilaimax
                ],
                'protokol' => $protokolArray
            ];
            
            return response()->json([
                'code' => 200,
                'success' => true,
                'data' => $result,
                'input_score' => $score,
                'message' => 'Data berhasil ditemukan'
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'code' => 500,
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }
    
    public function getHistoryPansSec(Request $request)
    {
        try {
            $query = DB::table('panssec_history as ph')
                ->join('strukpelayanan_t as sp', 'ph.strukpelayananfk', '=', 'sp.norec')
                ->leftjoin('strukpelayanandetail_t as spd', 'spd.nostrukfk', '=', 'sp.norec')
                ->leftJoin('panssec_d as pd1', function ($join) {
                    $join->on('ph.panssecd_1', '=', 'pd1.id')->where('pd1.panssecfk', '=', 1);
                })
                ->leftJoin('panssec_d as pd2', function ($join) {
                    $join->on('ph.panssecd_2', '=', 'pd2.id')->where('pd2.panssecfk', '=', 2);
                })
                ->leftJoin('panssec_d as pd3', function ($join) {
                    $join->on('ph.panssecd_3', '=', 'pd3.id')->where('pd3.panssecfk', '=', 3);
                })
                ->leftJoin('panssec_d as pd4', function ($join) {
                    $join->on('ph.panssecd_4', '=', 'pd4.id')->where('pd4.panssecfk', '=', 4);
                })
                ->leftJoin('panssec_d as pd5', function ($join) {
                    $join->on('ph.panssecd_5', '=', 'pd5.id')->where('pd5.panssecfk', '=', 5);
                })
                ->select([
                    'ph.norec', 'ph.statusenabled', 'ph.strukpelayananfk', 'ph.s', 'ph.o', 'ph.a', 'ph.p',
                    'ph.panssecd_1', 'pd1.id as pd1_id', 'pd1.skor as pd1_skor', 'pd1.label as pd1_label', 'pd1.keterangan as pd1_ket',
                    'ph.panssecd_2', 'pd2.id as pd2_id', 'pd2.skor as pd2_skor', 'pd2.label as pd2_label', 'pd2.keterangan as pd2_ket',
                    'ph.panssecd_3', 'pd3.id as pd3_id', 'pd3.skor as pd3_skor', 'pd3.label as pd3_label', 'pd3.keterangan as pd3_ket',
                    'ph.panssecd_4', 'pd4.id as pd4_id', 'pd4.skor as pd4_skor', 'pd4.label as pd4_label', 'pd4.keterangan as pd4_ket',
                    'ph.panssecd_5', 'pd5.id as pd5_id', 'pd5.skor as pd5_skor', 'pd5.label as pd5_label', 'pd5.keterangan as pd5_ket',
                    'ph.totalskor', 'sp.nocmklien', 'sp.tglstruk', 'spd.nama_pasien as namapasien', 
                     DB::raw("CASE 
                        WHEN sp.isapprove IS NULL THEN 'Menunggu'
                        WHEN sp.isapprove = FALSE THEN 'Ditolak'
                        WHEN sp.isapprove = TRUE THEN 'Diterima'
                    END AS status")
                ])
                ->where('ph.statusenabled', true)
                ->whereNotNull('sp.isapprove');

            if ($request->has('nocmklien') && !empty($request->nocmklien)) {
                $query->where(DB::raw('CAST(sp.nocmklien AS TEXT)'), 'like', '%' . $request->nocmklien . '%');
            }

            if ($request->has('tanggal_mulai') && !empty($request->tanggal_mulai)) {
                $query->whereDate('sp.tglstruk', '>=', $request->tanggal_mulai);
            }

            if ($request->has('tanggal_akhir') && !empty($request->tanggal_akhir)) {
                $query->whereDate('sp.tglstruk', '<=', $request->tanggal_akhir);
            }

            $records = $query->orderBy('sp.tglstruk', 'desc')->orderBy('ph.norec', 'desc')->get();
            
            if (count($records) === 0) {
                return response()->json([
                    'code' => 200,
                    'message' => 'Data history PansSec belum ada',
                    'data' => [],
                    'success' => true,
                    'total' => 0
                ]);
            }

            $mastersRaw = DB::table('panssec_m')->get();
            $masters = [];
            foreach ($mastersRaw as $m) {
                $masters[$m->id] = $m;
            }

            $result = [];

            foreach ($records as $row) {
                $panssec = [];

                for ($i = 1; $i <= 5; $i++) {
                    if (!isset($masters[$i])) {
                        continue; 
                    }

                    $master = $masters[$i];                  
                    $skorId = $row->{'pd' . $i . '_id'} ?? null;
                    $skorNilai = $row->{'pd' . $i . '_skor'} ?? null; 
                    $skorLabel = $row->{'pd' . $i . '_label'} ?? null;
                    $skorKeterangan = $row->{'pd' . $i . '_ket'} ?? null;

                    if (is_null($skorNilai) && is_null($skorId) && is_null($skorLabel) && is_null($skorKeterangan)) {
                        continue;
                    }

                    $panssec[] = [
                        'id' => $i,
                        'kode' => $master->kode,
                        'nama' => $master->nama,
                        'deskripsi' => $master->deskripsi,
                        'dasar_penilaian' => $master->dasar_penilaian,
                        'skor' => [
                            'id' => $skorId,
                            'skor' => $skorNilai,
                            'label' => $skorLabel,
                            'keterangan' => $skorKeterangan,
                        ]
                    ];
                }

                $result[] = [
                    'norec' => $row->norec,
                    'statusorder' => $row->status,
                    'statusenabled' => $row->statusenabled,
                    'strukpelayananfk' => $row->strukpelayananfk,
                    'nama_pasien' => $row->namapasien,
                    's' => $row->s,
                    'o' => $row->o,
                    'a' => $row->a,
                    'p' => $row->p,
                    'panssec' => $panssec,
                    'totalskor' => $row->totalskor,
                    'nocmklien' => $row->nocmklien,
                    'tglstruk' => $row->tglstruk
                ];
            }

            return response()->json([
                'code' => 200,
                'message' => 'Data history PansSec berhasil diambil',
                'data' => $result,
                'success' => true,
                'total' => count($result)
            ]);
        } catch (Exception $e) {
            return response()->json([
                'code' => 500,
                'message' => 'Terjadi kesalahan internal server',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error',
                'success' => false
            ], 500);
        }
    }

     public function SaveInputTagihanFromTelemedicinePsikiatri(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $transMessage = '';
        $req = $request->all();

        $pasien = \DB::table('pasien_m')
            ->where('kdprofile', $kdProfile)
            ->where('nocm', $req['nocm_klien'])
            ->first();
        
        if(empty($pasien)){
            $transMessage = "Pasien tidak terdaftar";
            $result = array(
                "status" => 404,
                "message"  => $transMessage,
                "as" => 'as@epic',
            );
            return $this->setStatusCode($result['status'])->respond($result, $transMessage);
        }

        \DB::beginTransaction();
        try {
            // if ($req['norec'] == '') {
                $SP = new StrukPelayanan();
                $norecSP = $SP->generateNewId();
                $noStruk = $this->generateCode(new StrukPelayanan, 'nostruk', 10, 'NLA' . $this->getDateTime()->format('ym'), $kdProfile);
                $SP->norec = $norecSP;
                $SP->kdprofile = $kdProfile;
                $SP->statusenabled = true;
                $SP->nostruk = $noStruk;
            // } else {
            //     $SP = StrukPelayanan::where('norec', $req['norec'])->where('kprofile', $kdProfile)->first();
            //     $DelSPD = StrukPelayananDetail::where('nostrukfk', $req['norec'])->where('kdprofile', $kdProfile)->delete();
            // }
            $SP->objectkelompoktransaksifk = 9; //pelayanan ambulance
            if (isset($req['keterangan'])) {
                $SP->keteranganlainnya = $req['keterangan'];
            }else {
                $SP->keteranganlainnya = "-";
            }
            $SP->nocmfk = $pasien->id;
            $SP->namapasien_klien = $req['namapasien_klien'];
            $SP->nocmklien = $req['nocm_klien'];
            $SP->nostruk_intern = $req['nocm_klien'];
            if (isset($req['notelp_klien'])) {
                $SP->noteleponfaks = $req['notelp_klien'];
            }
            if (isset($req['alamat'])) {
                $SP->namatempattujuan =  $req['alamat']; //alamat
            }
            if (isset($req['tglLahir'])) {
                $SP->tglfaktur =  $req['tglLahir']; //tgllahir
            }
            $SP->tglstruk = $req['tglstruk'];
            $SP->totalharusdibayar = $req['totalharusdibayar'];
            $SP->istelemedicine = true;
            $SP->tanggal_jemput = $req['tanggal_jemput'] ?? null;

            $SP->save();

            $detail = $req['details']; 
            // foreach ($req['details'] as $item) {
                $SPD = new StrukPelayananDetail();
                $norecKS = $SPD->generateNewId();
                $SPD->norec = $norecKS;
                $SPD->kdprofile = $kdProfile;
                $SPD->statusenabled = true;
                $SPD->nostrukfk = $SP->norec;
                $SPD->objectprodukfk = $detail['id'];
                $SPD->hargadiscount = 0;
                $SPD->hargadiscountgive = 0;
                $SPD->hargadiscountsave = 0;
                $SPD->harganetto = $detail['harga'];
                $SPD->hargapph = 0;
                $SPD->hargappn = 0;
                $SPD->hargasatuan = $detail['harga'];
                $SPD->hargasatuandijamin = 0;
                $SPD->hargasatuanppenjamin = 0;
                $SPD->hargasatuanpprofile = 0;
                $SPD->hargatambahan = 0;
                $SPD->isonsiteservice = 0;
                $SPD->kdpenjaminpasien = 0;
                $SPD->persendiscount = 0;
                $SPD->qtyproduk = $detail['jumlah'];
                $SPD->qtyprodukoutext = 0;
                $SPD->qtyprodukoutint = 0;
                $SPD->qtyprodukretur = 0;
                $SPD->satuan = 0;
                $SPD->tglpelayanan = $req['tglstruk'];
                $SPD->is_terbayar = 0;
                $SPD->linetotal = 0;
                $SPD->jeniskegiatanambulanfk = $req['jeniskegiatan'];
                $SPD->jarak = $detail['jarak'];
                $SPD->address = $detail['address'];
                $SPD->map_lat = $detail['map_lat'];
                $SPD->map_lng = $detail['map_lng'];
                $SPD->nama_pasien = $detail['nama_pasien'];
                $SPD->nik = $detail['nik'];
                $SPD->save();

                $PANS = new PanssecHistory();
                $PANS->norec = $PANS->generateNewId();
                $PANS->statusenabled = true;
                $PANS->strukpelayananfk = $SP->norec;
                $PANS->s = $detail['s'];
                $PANS->o = $detail['o'];
                $PANS->a = $detail['a'];
                $PANS->p = $detail['p'];
                if (isset($detail['panssec']) && is_array($detail['panssec'])) {
                
                $panssecFields = [
                    'panssecd_1' => null,
                    'panssecd_2' => null,
                    'panssecd_3' => null,
                    'panssecd_4' => null,
                    'panssecd_5' => null,
                    'panssecd_6' => null,
                    'panssecd_7' => null,
                ];

            
                foreach ($detail['panssec'] as $panssecItem) {
                    $fieldName = 'panssecd_' . $panssecItem['id'];
                    if (array_key_exists($fieldName, $panssecFields)) {
                        $panssecFields[$fieldName] = $panssecItem['skor_id'];
                    }
                }

                $PANS->panssecd_1 = $panssecFields['panssecd_1'];
                $PANS->panssecd_2 = $panssecFields['panssecd_2'];
                $PANS->panssecd_3 = $panssecFields['panssecd_3'];
                $PANS->panssecd_4 = $panssecFields['panssecd_4'];
                $PANS->panssecd_5 = $panssecFields['panssecd_5'];
                $PANS->panssecd_6 = $panssecFields['panssecd_6'];
                $PANS->panssecd_7 = $panssecFields['panssecd_7'];
                }

                $PANS->totalskor = $detail['totalskor'];
                $PANS->save();

                $secret_token = \DB::table('settingdatafixed_m')
                    ->where('kdprofile', $kdProfile)
                    ->where('statusenabled', true)
                    ->where('namafield', 'secret_token_telemedicine')
                    ->value('nilaifield'); 

                $id_chat = \DB::table('settingdatafixed_m')
                    ->where('kdprofile', $kdProfile)
                    ->where('statusenabled', true)
                    ->where('namafield', 'id_telemedicine')
                    ->value('nilaifield'); 

                $jenisKegiatanNama = \DB::table('jeniskegiatanambulan_m')
                    ->where('id', $req['jeniskegiatan'])
                    ->value('namajeniskegiatan');

                if ($secret_token && $id_chat) {
                    $url = "https://api.telegram.org/bot" . $secret_token . "/sendMessage?parse_mode=html&chat_id=" . $id_chat;
                    $url .= "&text=" . urlencode("<b>Order Baru dari Telemedicine Psikiatri:</b>" . "\n" .
                        "No. Order: " . $SP->nostruk . "\n" .
                        "Nama Pasien: " . $SP->namapasien_klien . "\n" .
                        "Total Skor Panss-ec: " . $PANS->totalskor . "\n" .
                        "No. RM: " . $SP->nocmklien . "\n" .
                        "Jarak: " . $detail['jarak'] . " KM\n" .
                        "Alamat Tujuan: " . $detail['address'] . "\n" .
                        "Jenis Kegiatan: " . ($jenisKegiatanNama ?? 'N/A') . "\n" .
                        "Total Biaya: Rp. " . number_format($SP->totalharusdibayar, 0, ',', '.'));

                    $ch = curl_init();
                    curl_setopt_array($ch, [
                        CURLOPT_URL => $url,
                        CURLOPT_RETURNTRANSFER => true
                    ]);
                    $response = curl_exec($ch);
                    curl_close($ch);

                    // Ambil message_id dan pin message
                    $res = json_decode($response, true);
                    if (isset($res['result']['message_id'])) {
                        $messageId = $res['result']['message_id'];
                        $pinUrl = "https://api.telegram.org/bot" . $secret_token . "/pinChatMessage";
                        $pinUrl .= "?chat_id=" . $id_chat . "&message_id=" . $messageId;

                        $chPin = curl_init();
                        curl_setopt_array($chPin, [
                            CURLOPT_URL => $pinUrl,
                            CURLOPT_RETURNTRANSFER => true
                        ]);
                        curl_exec($chPin);
                        curl_close($chPin);
                    }
                }
            // }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Order berhasil dibuat";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "data" => [
                    "order_number" => $SP->nostruk,
                    "price" => $SP->totalharusdibayar,
                    "status_order" => 'Menunggu',
                ],
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Order Gagal.";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result);
    }

// batas

}
