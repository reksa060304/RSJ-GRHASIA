<?php

namespace App\Http\Controllers\Gizi;
use App\Http\Controllers\ApiController;

use Carbon\Carbon;
use Illuminate\Http\Request;
use DB;
use Illuminate\Support\Facades\Storage;
use App\Traits\Valet;
use App\Transaksi\OrderPelayanan;
use App\Transaksi\SiklusGiziDiet;
use App\Transaksi\StrukOrder;
use App\Transaksi\StrukPelayanan;
use App\Transaksi\StrukPelayananDetail;
use Webpatser\Uuid\Uuid;

class GiziDietTelemedicineController extends ApiController
{
    use Valet;
    public function __construct()
    {
        parent::__construct($skip_authentication=false);
    }

    public function simpanOrderDiet(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $req = $request->all();
        $strukOrder = isset($req['strukorder']) ? $req['strukorder'] : $req;
        $details = $this->getOrderDetails($req, $strukOrder);
        
        $pasien = \DB::table('pasien_m')
                    ->where('kdprofile', $kdProfile)
                    ->where('nocm', $strukOrder['nocm_klien'])
                    ->first();
        if (count($details) == 0) {
            $result = array(
                'status' => 400,
                'message' => 'Detail order diet belum diisi',
                'as' => 'inhuman',
            );
            return $this->setStatusCode($result['status'])->respond($result, $result['message']);
        }

        DB::beginTransaction();
        try {
            $norecSo = $this->getValue($strukOrder, array('norec_so', 'norec', 'norec_order'), '');
            
            if ($norecSo == '') {
                $noOrder = $this->generateCode(new StrukOrder, 'noorder', 11, 'OGT' . $this->getDateTime()->format('ym'), $kdProfile);
                $dataSO = new StrukOrder;
                $dataSO->norec = $dataSO->generateNewId();
                $dataSO->kdprofile = $kdProfile;
                $dataSO->statusenabled = true;
                $dataSO->isdelivered = 1;
                $dataSO->noorder = $noOrder;
                $dataSO->noorderintern = $noOrder;
            } else {
                $dataSO = StrukOrder::where('norec', $norecSo)
                    ->where('kdprofile', $kdProfile)
                    ->first();

                if (empty($dataSO)) {
                    throw new \Exception('Data struk order tidak ditemukan');
                }

                OrderPelayanan::where('strukorderfk', $norecSo)
                    ->where('kdprofile', $kdProfile)
                    ->delete();

                SiklusGiziDiet::where('strukorderfk', $norecSo)
                    ->where('kdprofile', $kdProfile)
                    ->delete();
            }

            // $qtyProduk = $this->getValue($strukOrder, array('qtyproduk'), count($details));
            $tglOrder = $this->getValue($strukOrder, array('tglorder'), $this->getDateTime()->format('Y-m-d H:i:s'));
            $tglMenu = $this->getValue($strukOrder, array('tglpelayananawal', 'tglmenu', 'tanggal'), $tglOrder);
            $tglMenuAkhir = $this->getValue($strukOrder, array('tglpelayananakhir'), $tglOrder);
            $ruanganGiziDefault = 784;
            $ruanganTujuan = $this->getValue($strukOrder, array('objectruangantujuanfk', 'ruangantujuanfk'), $ruanganGiziDefault != '' ? $ruanganGiziDefault : 784);
            $ruanganAsal = $this->getValue($strukOrder, array('objectruanganfk', 'ruangan_id'), 750);
            $kelasDefault = $this->getValue($strukOrder, array('objectkelasfk', 'kelas_id'), 6);
            
            $dataSO->qtyjenisproduk = count($details);
            $dataSO->qtyproduk = $this->sumQtyProduk($details);
            $dataSO->objectruangantujuanfk = $ruanganTujuan;
            $dataSO->objectruanganfk = $ruanganAsal;
            $dataSO->keteranganorder = "Order Gizi Telemedicine";
            $dataSO->objectkelompoktransaksifk = 8;
            $dataSO->tglorder = $tglOrder;
            $dataSO->tglpelayananawal = $tglMenu;
            $dataSO->tglpelayananakhir = $tglMenuAkhir;
            $dataSO->totalbeamaterai = 0;
            $dataSO->totalbiayakirim = 0;
            $dataSO->totalbiayatambahan = 0;
            $dataSO->totaldiscount = 0;
            $dataSO->totalhargasatuan = 0;
            $dataSO->totalharusdibayar = $this->sumTotalDetail($details);
            $dataSO->totalpph = 0;
            $dataSO->totalppn = 0;
            
            $dataSO->status = 'ORDER';
            $dataSO->nocmfk = $pasien->id ?? null;

            $dataSO->save();

            $dataOrderPelayanan = array();
            $dataSiklusGiziDietArr = array();
            foreach ($details as $index => $itemDetails) {
                $qty = $this->getValue($itemDetails, array('qtyproduk', 'qty'), 1);
                $hargaSatuan = $this->getValue($itemDetails, array('hargasatuan', 'harganetto1', 'harga'), 0);
                $tanggalPelayanan = $this->getValue($itemDetails, array('tglpelayanan', 'tanggal'), $tglMenu);
                $produkId = $this->getValue($itemDetails, array('objectprodukfk', 'produk_id', 'produkfk'), null);
                $menuMakananId = $this->getValue($itemDetails, array('objectketerangandietfk', 'menumakanan_id'), null);

                $dataOP = new OrderPelayanan;
                $dataOP->norec = $dataOP->generateNewId();
                $dataOP->kdprofile = $kdProfile;
                $dataOP->statusenabled = true;
                $dataOP->iscito = 0;
                $dataOP->objectprodukfk = $produkId;
                $dataOP->keteranganlainnya = $this->getValue($itemDetails, array('keteranganlainnya', 'keterangan', 'menumakanan'), 'Menu Diet Gizi Telemedicine');
                $dataOP->keteranganlainnya_quo = 'Order Gizi Telemedicine';
                $dataOP->nocmfk = $pasien->id ?? null;
                $dataOP->noorderfk = $dataSO->norec;
                $dataOP->qtyproduk = $qty;
                $dataOP->iscito = $this->getValue($itemDetails, array('iscito'), 0);
                $dataOP->qtyprodukinuse = $this->getValue($itemDetails, array('cc'), null);
                $dataOP->jumlah = $this->getValue($itemDetails, array('volume', 'jumlah'), $qty);
                $dataOP->hargasatuan = $hargaSatuan;
                $dataOP->hargadiscount = $this->getValue($itemDetails, array('hargadiscount'), 0);
                $dataOP->objectkelasfk = $this->getValue($itemDetails, array('objectkelasfk', 'kelas_id'), $kelasDefault);
                $dataOP->qtyprodukretur = 0;
                $dataOP->objectruanganfk = $this->getValue($itemDetails, array('objectruanganlastfk', 'objectruanganfk', 'ruangan_id'), $ruanganAsal);
                $dataOP->objectruangantujuanfk = $ruanganTujuan;
                $dataOP->strukorderfk = $dataSO->norec;
                $dataOP->tglpelayanan = $tanggalPelayanan;
                $dataOP->save();

                $dataSiklusGiziDiet = new SiklusGiziDiet;
                $dataSiklusGiziDiet->norec = $dataSiklusGiziDiet->generateNewId();
                $dataSiklusGiziDiet->kdprofile = $kdProfile;
                $dataSiklusGiziDiet->statusenabled = true;
                $dataSiklusGiziDiet->menumakanan_id = $menuMakananId;
                $dataSiklusGiziDiet->produk_id = $produkId;
                $dataSiklusGiziDiet->strukpelayananfk = null;
                $dataSiklusGiziDiet->tanggal = $tanggalPelayanan;
                $dataSiklusGiziDiet->strukorderfk = $dataSO->norec;
                $dataSiklusGiziDiet->status = 'ORDER';
                $dataSiklusGiziDiet->jumlah = $this->getValue($itemDetails, array('jumlah'), $qty);
                $dataSiklusGiziDiet->hargasatuan = $hargaSatuan;
                $dataSiklusGiziDiet->save();

                $dataOrderPelayanan[] = $dataOP;
                $dataSiklusGiziDietArr[] = $dataSiklusGiziDiet;


            }

            DB::commit();
            $transMessage = 'Simpan Order Diet Telemedicine';
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'strukorder' => $dataSO,
                'orderpelayanan' => $dataOrderPelayanan,
                'siklusgizidiet' => $dataSiklusGiziDietArr,
                'as' => 'inhuman',
            );
        } catch (\Exception $e) {
            DB::rollBack();
            $transMessage = 'Simpan Order Diet Telemedicine gagal';
            $result = array(
                'status' => 400,
                'message' => $transMessage,
                'error' => $e->getMessage(),
                'as' => 'inhuman',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getOrderDiet(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $data = DB::table('strukorder_t as so')
            ->join('pasien_m as ps', 'ps.id', '=', 'so.nocmfk')
            ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'so.objectruanganfk')
            ->leftJoin('ruangan_m as ru2', 'ru2.id', '=', 'so.objectruangantujuanfk')
            ->leftJoin('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->leftJoin('alamat_m as alm', 'alm.nocmfk', '=', 'ps.id')
            ->leftJoin('strukpelayanan_t as sp', 'sp.noorderfk', '=', 'so.norec')
            ->leftJoin('strukbuktipenerimaan_t as sbm', 'sbm.nostrukfk', '=', 'sp.norec')
            ->select(
                'so.norec as norec_so',
                'so.noorder',
                'so.tglorder',
                'so.tglpelayananawal as tglmenu',
                'ps.tgllahir',
                'ps.namapasien',
                'ps.nocm',
                'ps.id as nocmfk',
                'ru.namaruangan as ruanganasal',
                'ru2.namaruangan as ruangantujuan',
                'jk.jeniskelamin',
                'so.objectpegawaiorderfk',
                DB::raw('case when ps.nohp is not null then ps.nohp else ps.notelepon end as nohp'),
                'alm.alamatlengkap',
                DB::raw("case when sbm.norec is not null then 'SUDAH DIBAYAR' else so.status end as status"),
                'so.totalharusdibayar',
                'so.url_bukti_bayar as bukti_bayar'
            )
            ->where('so.kdprofile', $kdProfile)
            ->where('so.statusenabled', true)
            ->where('so.objectkelompoktransaksifk', 8)
            ->where('so.keteranganorder', 'Order Gizi Telemedicine');
        //req tglorder karena ini menu untuk order
        if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
            $data = $data->where('so.tglorder', '>=', $request['tglAwal']. ' 00:00:00');
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
            $data = $data->where('so.tglorder', '<=', $request['tglAkhir']. ' 23:59:59');
        }
        if (isset($request['jenisDietId']) && $request['jenisDietId'] != '' && $request['jenisDietId'] != 'undefined') {
            // Removed filter for op.objectjenisdietfk since op is not joined
        }
        if (isset($request['jenisWaktuId']) && $request['jenisWaktuId'] != '' && $request['jenisWaktuId'] != 'undefined') {
            // Removed filter for op.objectjeniswaktufk since op is not joined
        }
        if (isset($request['noorder']) && $request['noorder'] != '' && $request['noorder'] != 'undefined') {
            $data = $data->where('so.noorder', 'ilike', '%' . $request['noorder'] . '%');
        }
        if (isset($request['norm']) && $request['norm'] != '' && $request['norm'] != 'undefined') {
            $data = $data->where('ps.nocm', 'ilike', '%' . $request['norm'] . '%');
        }
        if (isset($request['nama']) && $request['nama'] != '' && $request['nama'] != 'undefined') {
            $data = $data->where('ps.namapasien', 'ilike', '%' . $request['nama'] . '%');
        }
        if (isset($request['nocm_klien']) && $request['nocm_klien'] != '' && $request['nocm_klien'] != 'undefined') {
            $data = $data->where('ps.nocm', '=', $request['nocm_klien']);
        }
        if (isset($request['status']) && $request['status'] != '' && $request['status'] != 'undefined') {
            $status = explode(',', $request['status']);
            $data = $data->whereIn('so.status', $status);
        }

        $data = $data->orderBy('so.noorder');
        $data = $data->get();

        // Get all norec_so for details query
        $norecSos = collect($data)->pluck('norec_so')->toArray();

        // Query all details in one go
        $allDetails = DB::table('siklusgizidiet_t as sgd')
            ->join('produk_m as pr', 'pr.id', '=', 'sgd.produk_id')
            ->join('menumakanan_m as mm', 'mm.id', '=', 'sgd.menumakanan_id')
            ->select(
                'sgd.*',
                'mm.menumakanan',
                'pr.namaproduk',
                DB::raw('(sgd.jumlah * sgd.hargasatuan) as total')
            )
            ->whereIn('sgd.strukorderfk', $norecSos)
            ->where('sgd.kdprofile', $kdProfile)
            ->where('sgd.statusenabled', true)
            ->get();

        // Group details by strukorderfk
        $groupedDetails = collect($allDetails)->groupBy('strukorderfk');

        foreach ($data as $item) {
            $item->umur = $this->getAge($item->tgllahir, $item->tglorder);
            $item->details = $groupedDetails->get($item->norec_so, collect());
        }

        // Filter berdasarkan produkId jika ada
        if (isset($request['produkId']) && $request['produkId'] != '' && $request['produkId'] != 'undefined') {
            $produkId = $request['produkId'];
            $data = collect($data)->filter(function($item) use ($produkId) {
                return $item->details->contains('produk_id', $produkId);
            });
        }
        // Filter berdasarkan produkId jika ada
        if (isset($request['menuId']) && $request['menuId'] != '' && $request['menuId'] != 'undefined') {
            $menuId = $request['menuId'];
            $data = collect($data)->filter(function($item) use ($menuId) {
                return $item->details->contains('menumakanan_id', $menuId);
            });            // Reset nomor urut setelah filter
            $data = $data->values();
            foreach ($data as $index => $item) {
                $item->no = $index + 1;
            }        
            
        }

        $data = collect($data);

        $result = array(
            'status' => 200,
            'message' => 'inhuman',
            'data' => $data->values()->toArray(),
        );

        return $this->setStatusCode($result['status'])->respond($result, $result['message']);
    }

    public function getOrderDietVerified(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);

        $data = DB::table('siklusgizidiet_t as sgd')
            ->join('produk_m as pr', 'pr.id', '=', 'sgd.produk_id')
            ->join('menumakanan_m as mm', 'mm.id', '=', 'sgd.menumakanan_id')
            ->join('strukorder_t as so', 'so.norec', '=', 'sgd.strukorderfk')
            ->join('strukpelayanan_t as sp', 'sp.norec', '=', 'sgd.strukpelayananfk')
            ->join('strukbuktipenerimaan_t as sbm', 'sp.norec', '=', 'sbm.nostrukfk')
            ->join('pasien_m as ps', 'ps.id', '=', 'so.nocmfk')
            ->select(
                'sgd.*',
                'mm.menumakanan',
                'pr.namaproduk',
                'so.noorder',
                'so.tglorder',
                'ps.namapasien',
                'ps.nocm',
                'ps.id as nocmfk',
                DB::raw('(sgd.jumlah * sgd.hargasatuan) as total'),
                DB::raw('case when ps.nohp is not null then ps.nohp else ps.notelepon end as nohp'),
                DB::raw("case when sgd.status = 'DISIAPKAN' then 'Sudah disiapkan' when sgd.status = 'SIAP' then 'Sudah siap diambil' when sbm.norec is not null then 'Sudah bayar' end as status"),
            )
            ->whereBetween('sgd.tanggal', [$request['tglAwal'] . ' 00:00:00', $request['tglAkhir'] . ' 23:59:59'])
            ->where('sgd.kdprofile', $kdProfile)
            ->whereNotNull('sgd.strukpelayananfk')
            ->where('sgd.statusenabled', true)
            ->get();
            $result = array(
                'status' => 200,
                'message' => 'inhuman',
                'data' => $data,
            );
            return $this->setStatusCode($result['status'])->respond($result, $result['message']);

    }

    private function getOrderDetails($requestData, $strukOrder)
    {
        $details = array();

        if (isset($strukOrder['details'])) {
            $details = $strukOrder['details'];
        } elseif (isset($requestData['details'])) {
            $details = $requestData['details'];
        } elseif (isset($requestData['orderpelayanan'])) {
            $details = $requestData['orderpelayanan'];
        }

        if (!is_array($details)) {
            return array();
        }

        if (count($details) > 0 && !isset($details[0])) {
            $details = array($details);
        }

        return $details;
    }

    private function getValue($data, $keys, $default = null)
    {
        foreach ($keys as $key) {
            if (isset($data[$key]) && $data[$key] !== '') {
                return $data[$key];
            }
        }

        return $default;
    }

    private function sumDetail($details, $field)
    {
        $total = 0;
        foreach ($details as $detail) {
            $total += (float) $this->getValue($detail, array($field), 0);
        }

        return $total;
    }

    private function sumTotalDetail($details)
    {
        $total = 0;
        foreach ($details as $detail) {
            $qty = (float) $this->getValue($detail, array('qtyproduk', 'qty'), 1);
            $harga = (float) $this->getValue($detail, array('hargasatuan', 'harganetto1', 'harga'), 0);
            $discount = (float) $this->getValue($detail, array('hargadiscount'), 0);
            $total += $qty * ($harga - $discount);
        }

        return $total;
    }

    private function sumQtyProduk($details)
    {
        $total = 0;
        foreach ($details as $detail) {
            $total += (float) $this->getValue($detail, array('qtyproduk', 'qty'), 1);
        }

        return $total;
    }

    public function verifikasiOrderDiet(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        \DB::beginTransaction();
        $idProfile = (int) $kdProfile;
        $transMessage = '';
        $req = $request->all();
        $e = null;
        $SP = null;
        $SPD = null;
        //        return $this->respond($req);
        try {
            if (isset($req['norec']) && $req['norec'] != '') {
                $SP = StrukPelayanan::where('norec', $req['norec'])
                    ->where('kdprofile', $kdProfile)
                    ->first();
                if (!empty($SP)) {
                    StrukPelayananDetail::where('nostrukfk', $req['norec'])
                        ->where('kdprofile', $kdProfile)
                        ->delete();
                }
            }

            if (empty($SP)) {
                $SP = new StrukPelayanan();
                $norecSP = $SP->generateNewId();
                $noStruk = $this->generateCode(new StrukPelayanan, 'nostruk', 10, 'NL' . $this->getDateTime()->format('ym'), $kdProfile);
                $SP->norec = $norecSP;
                $SP->kdprofile = $kdProfile;
                $SP->isapprove = true;
                $SP->statusenabled = true;
                $SP->nostruk = $noStruk;
                $SP->noorderfk = $req['norec_so'];
            }
            $SP->objectkelompoktransaksifk = $req['kelompoktransaksifk'];
        $SP->keteranganlainnya = $req['keteranganlainnya'];
        $SP->namapasien_klien = $req['namapasien_klien'];
        if (isset($req['notelp_klien'])) {
            $SP->noteleponfaks = $req['notelp_klien'];
        }
        if (isset($req['isverifikasi'])) {
            $SP->isverifikasi = $req['isverifikasi'];
        }
        $SP->tglstruk = $req['tglstruk'];
        $SP->totalharusdibayar = $req['totalharusdibayar'];
        
        if (isset($req['nocm_klien'])) {
            $SP->nocmklien = $req['nocm_klien'];
        }
        $SP->save();

        if (!empty($req['desaKelurahan'])) {
        $alamatData = \DB::table('desakelurahan_m as ds')
        ->join('kecamatan_m as kc', 'ds.objectkecamatanfk', '=', 'kc.id')
        ->join('kotakabupaten_m as kk', 'ds.objectkotakabupatenfk', '=', 'kk.id')
        ->join('propinsi_m as pp', 'ds.objectpropinsifk', '=', 'pp.id')
        ->select(DB::raw("ds.id,UPPER(ds.namadesakelurahan) as namadesakelurahan,ds.kodepos,
                        ds.objectkecamatanfk,ds.objectkotakabupatenfk,ds.objectpropinsifk,
                        kc.namakecamatan,kk.namakotakabupaten,pp.namapropinsi"))
        ->where('ds.statusenabled', true)
        ->where('ds.id', $req['desaKelurahan'])
        ->first();
        }

        // Set default values jika data tidak ditemukan
        $desaKelurahanText = $alamatData->namadesakelurahan ?? '';
        $kecamatanText = $alamatData->namakecamatan ?? '';
        $kotaKabupatenText = $alamatData->namakotakabupaten ?? '';
        $provinsiText = $alamatData->namapropinsi ?? '';

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
            $SPD->qtyoranglast = $item['qtyoranglast'];
            $SPD->qtyprodukoutext = 0;
            $SPD->qtyprodukoutint = 0;
            $SPD->qtyprodukretur = 0;
            $SPD->satuan = 0;
            $SPD->tglpelayanan = $req['tglstruk'];
            $SPD->is_terbayar = 0;
            $SPD->linetotal = 0;
            $SPD->keteranganlainnya = $item['keterangan'];         
            $SPD->nopolisifk = $req['nopolisi'] ?? null;
            $SPD->jeniskegiatanambulanfk = $req['jeniskegiatan'] ?? null;
            $SPD->jarak = $item['jarak'] ?? null;
            $SPD->address = trim(
            ($req['alamatLengkap'] ?? '') . ', ' .
                ($req['rtRw'] ?? '') . ', ' .
                $desaKelurahanText . ', ' .
                $kecamatanText . ', ' .
                $kotaKabupatenText . ', ' .
                $provinsiText,
                ', '
            );
    
            $SPD->save();

            $siklusGiziDiet = SiklusGiziDiet::where('norec', $item['norec_siklus'])->first();
            if ($siklusGiziDiet) {
                $siklusGiziDiet->strukpelayananfk = $SP->norec;
                $siklusGiziDiet->status = 'VERIFIKASI';
                $siklusGiziDiet->save();
            }
        }

        $PPnorec = $SPD->norec;
        $PPtglpelayanan = $SPD->tglpelayanan;

        if (!empty($SP) && isset($req['norec_so']) && $req['norec_so'] != '') {
            StrukOrder::where('norec', $req['norec_so'])->update([
                'status' => 'VERIFIKASI'
            ]);
        }
        
                   


        $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "data" => $SP,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Simpan Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "data" => $SP,
                'e' => $e->getLine(),
                'message' => $e->getMessage(),
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function batalVerifikasiOrderDiet(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $req = $request->all();
        try {
            if (!isset($req['norec_so']) || $req['norec_so'] == '') {
                throw new \Exception('norec_so tidak boleh kosong');
            }

            $diklusGizi = SiklusGiziDiet::where('strukorderfk', $req['norec_so'])
                ->where('kdprofile', $kdProfile)
                ->where('statusenabled', true)
                ->first();

            if (empty($diklusGizi)) {
                throw new \Exception('Tidak Bisa Batal Verifikasi Karena data siklus gizi tidak ditemukan');
            }

            // Cek penjagaan: jika bukti bayar sudah diupload, batal verifikasi tidak boleh lanjut
            if ($diklusGizi->tgl_bukti_bayar != null) {
                throw new \Exception('Tidak Bisa Batal Verifikasi Karena bukti bayar sudah diupload');
            }

            if ($diklusGizi->tgl_disiapkan != null) {
                throw new \Exception('Tidak Bisa Batal Verifikasi Karena sudah disiapkan');
            }

            if ($diklusGizi->tgl_siap_ambil != null) {
                throw new \Exception('Tidak Bisa Batal Verifikasi Karena makanan sudah siap diambil');
            }

            $so = StrukOrder::where('norec', $req['norec_so'])
                ->where('kdprofile', $kdProfile)
                ->first();

            if (empty($so)) {
                throw new \Exception('Order tidak ditemukan');
            }

            if ($so->status !== 'VERIFIKASI') {
                throw new \Exception('Order bukan berstatus VERIFIKASI');
            }

            $so->status = 'ORDER';
            $so->save();

            $result = [
                'status' => 200,
                'message' => 'Batal verifikasi berhasil',
                'data' => $so,
            ];

            return $this->setStatusCode(200)->respond($result, $result['message']);
        } catch (\Exception $e) {
            $result = [
                'status' => 400,
                'message' => $e->getMessage(),
            ];

            return $this->setStatusCode(400)->respond($result, $result['message']);
        }
    }

    public function updateStatusOrderDiet(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $req = $request->all();
        $status = isset($req['status']) ? $req['status'] : '';
        $allowedStatus = array('UPLOAD', 'DISIAPKAN', 'SIAP');

        try {
            if (!in_array($status, $allowedStatus)) {
                throw new \Exception('Status order tidak valid');
            }

            

            $siklusGiziDiet = SiklusGiziDiet::where('norec', $req['norec'])
                ->where('kdprofile', $kdProfile)
                ->first();

            if (empty($siklusGiziDiet)) {
                throw new \Exception('Order tidak ditemukan');
            }

            $siklusGiziDiet->status = $status;
            if ($status === 'UPLOAD') {
                $siklusGiziDiet->tgl_bukti_bayar = date('Y-m-d H:i:s');
            } elseif ($status === 'DISIAPKAN') {
                $siklusGiziDiet->tgl_disiapkan = date('Y-m-d H:i:s');
            } elseif ($status === 'SIAP') {
                $siklusGiziDiet->tgl_siap_ambil = date('Y-m-d H:i:s');
            }
            $siklusGiziDiet->save();

            $result = array(
                'status' => 200,
                'message' => 'Status order berhasil diubah',
                'data' => $siklusGiziDiet,
            );

            return $this->setStatusCode(200)->respond($result, $result['message']);
        } catch (\Exception $e) {
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message' => $e->getMessage(),
            );

            return $this->setStatusCode(400)->respond($result, $result['message']);
        }
    }

    public function uploadBuktiBayarDiet(Request $request)
    {
                $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();

        try {
            if (!$request->hasFile('file')) {
                throw new \Exception('File bukti bayar belum dipilih');
            }

            $norec = $request->get('norec');
            if ($norec == '' || $norec == null) {
                throw new \Exception('Order tidak ditemukan');
            }

            $siklusGiziDiet = SiklusGiziDiet::where('strukorderfk', $norec)
                ->where('kdprofile', $kdProfile)
                ->where('statusenabled', true)
                ->get();
            if (empty($siklusGiziDiet)) {
                throw new \Exception('Siklus Gizi Diet tidak ditemukan');
            }
            $so = StrukOrder::where('norec', $norec)->first();
            if (empty($so)) {
                throw new \Exception('Struk Order tidak ditemukan');
            }

            $file = $request->file('file');
            $extension = $file->getClientOriginalExtension();
            $fileName = $so->noorder . '_' . date('YmdHis', strtotime($so->tglorder)) . ($extension != '' ? '.' . $extension : '');
            $path = 'bukti-bayar-gizi';

            if (!Storage::disk('local')->exists($path)) {
                Storage::disk('local')->makeDirectory($path, 0775, true);
            }

            Storage::disk('local')->put($path . '/' . $fileName, file_get_contents($file->getRealPath()));
            $filePath = $path . '/' . $fileName;
            $so->url_bukti_bayar = $filePath;
            $so->save();
            // Handle one or many SiklusGiziDiet records
            if ($siklusGiziDiet instanceof \Illuminate\Support\Collection) {
                foreach ($siklusGiziDiet as $sgd) {
                    $sgd->status = 'UPLOAD';
                    $sgd->tgl_bukti_bayar = date('Y-m-d H:i:s');
                    $sgd->save();
                }
            } else {
                $siklusGiziDiet->status = 'UPLOAD';
                $siklusGiziDiet->tgl_bukti_bayar = date('Y-m-d H:i:s');
                $siklusGiziDiet->save();
            }
            DB::commit();

            $result = array(
                'status' => 200,
                'message' => 'Bukti bayar berhasil diupload',
                'data' => array(
                    'norec' => $norec,
                    'path' => $filePath,
                ),
            );

            return $this->setStatusCode(200)->respond($result, $result['message']);
        } catch (\Exception $e) {
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message' => $e->getMessage(),
            );

            return $this->setStatusCode(400)->respond($result, $result['message']);
        }
    }

    public function streamBuktiBayar(Request $request)
    {
        $file = $request->get('file');
        if (strpos($file, 'bukti-bayar-gizi/') !== 0) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        $path = storage_path('app/' . $file);
        if (!file_exists($path)) {
            return response()->json(['message' => 'File tidak ditemukan'], 404);
        }

        $content = file_get_contents($path);
        $type = mime_content_type($path);

        $response = response($content, 200);
        $response->header("Content-Type", $type);

        return $response;
    }

    public function batalOrderDiet(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $req = $request->all();
        try {
            if (!isset($req['norec']) || $req['norec'] == '') {
                throw new \Exception('norec tidak boleh kosong');
            }

            $so = StrukOrder::where('norec', $req['norec'])
                ->where('kdprofile', $kdProfile)
                ->first();

            if (empty($so)) {
                throw new \Exception('Order tidak ditemukan');
            }

            if ($so->status === 'VERIFIKASI') {
                throw new \Exception('Order sudah diverifikasi, tidak bisa dibatalkan');
            }

            // Hapus order pelayanan dan siklus gizi diet terkait
            OrderPelayanan::where('noorderfk', $so->norec)
                ->delete();
            SiklusGiziDiet::where('strukorderfk', $so->norec)
                ->delete();

            // Hapus order
            $so->statusenabled = false;
            $so->save();

            $result = [
                'status' => 200,
                'message' => 'Order berhasil dibatalkan',
            ];
            return $this->setStatusCode(200)->respond($result, $result['message']);
        } catch (\Exception $e) {
            $result = [
                'status' => 400,
                'message' => $e->getMessage(),
            ];
            return $this->setStatusCode(400)->respond($result, $result['message']);
        }
    }
}
