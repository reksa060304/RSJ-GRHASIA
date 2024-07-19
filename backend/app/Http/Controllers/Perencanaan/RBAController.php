<?php

namespace App\Http\Controllers\Perencanaan;

use App\Http\Controllers\ApiController;
use App\Traits\Valet;
use App\Transaksi\KegiatanAnggaran;
use App\Transaksi\KeteranganBelanja;
use App\Transaksi\StrukPerencanaan;
use App\Transaksi\StrukPerencanaanDetail;
use Illuminate\Http\Request;
use DB;
class RBAController extends ApiController 
{
    use Valet;

    public function __construct(){
        parent::__construct($skip_authentication=false);
    }

    /**
     * Get data combo untuk input rencana belanja
     */
    public function getComboRencanaBelanja(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $settingAnggaran = DB::table('settinganggaran_t')
            ->where('statusenabled', true)
            ->where('kdprofile', $idProfile)
            ->get();

        // SubSub
        $subSubKegiatan = DB::select(DB::raw("
            SELECT ka.id, ka.id || '-' || ka.keterangan as keterangan
            FROM maploginusertosubsubkegiatan_s AS map
            LEFT JOIN loginuser_s AS lu ON lu.id = map.objectloginuserfk
            LEFT JOIN kegiatananggaran_m AS ka ON ka.id = map.objectsubsubkegiatanfk
            WHERE map.kdprofile = ".$idProfile."
            AND map.statusenabled = TRUE
            AND lu.id = ".$request['idLogin']."
        "));

        // Asal Produk
        $asalProduk = DB::table('asalproduk_m as ap')
            ->select('ap.id','ap.asalproduk')
            ->where('ap.statusenabled',true)
            ->where('ap.isanggaran',true)
            ->orderBy('ap.asalproduk')
            ->get();

        // Produk
        $kdjenisobat = explode (',',$this->settingDataFixed('kdJenisProdukObat',$idProfile));
        $arrkdjenisobat = [];
        foreach ($kdjenisobat as $it){
            $arrkdjenisobat []=  (int)$it;
        }
        $id = array_merge($arrkdjenisobat, [133]);
        // var_dump($id);
        $dataProdukAll = DB::table('produk_m as pr')
            ->JOIN('detailjenisproduk_m as djp','djp.id','=','pr.objectdetailjenisprodukfk')
            ->JOIN('jenisproduk_m as jp','jp.id','=','djp.objectjenisprodukfk')
            ->leftJOIN('satuanstandar_m as ss','ss.id','=','pr.objectsatuanstandarfk')
            ->leftJoin('stokprodukdetail_t as spd','spd.objectprodukfk','=','pr.id')
            ->leftJOIN('charkodeakunasset_m AS ak', 'ak.id', '=', 'pr.objectprodukassetfk')
            ->select('pr.id','pr.namaproduk', 'ak.kodeakun as kodebmn')
            ->where('pr.kdprofile', $idProfile)
            ->where('pr.statusenabled',true)
            ->whereIn('jp.id', $id)
            // ->whereIn('jp.id',$arrkdjenisobat)
            ->groupBy('pr.id','pr.namaproduk', 'ak.kodeakun')
            ->orderBy('pr.namaproduk')
            ->get();
        
        //Prioritas
        $prioritas = DB::table('filter_t')
            ->where('keterangan', 'level-rencana')
            ->get(); 

        // Satuan
        $satuan = DB::table('satuanstandar_m')
            ->where('statusenabled', true)
            ->where('kdprofile', $idProfile)
            ->get();

        // mataanggaran 
        $mataanggarancombo = DB::select(DB::raw("select cbs.id, cbs.kodemataanggaran, cbs.namamataanggaran, cbs.kodemataanggaran || ' - ' || cbs.namamataanggaran as text
            , split_part(cbs.kodemataanggaran, '.', 1) as subkodepertama
            , split_part(cbs.kodemataanggaran, '.', 2) as subkodekedua
            , case when split_part(cbs.kodemataanggaran, '.', 3) = '' then '0' else split_part(cbs.kodemataanggaran, '.', 3)::int4 end as subkodeketiga
            , case when split_part(cbs.kodemataanggaran, '.', 4) = '' then '0' else split_part(cbs.kodemataanggaran, '.', 4)::int4 end as subkodekeempat
            , case when split_part(cbs.kodemataanggaran, '.', 5) = '' then '0' else split_part(cbs.kodemataanggaran, '.', 5)::int4 end as subkodekelima
            from mataanggaran_m as cbs
            where cbs.kdprofile = $idProfile
            and cbs.statusenabled = true
            order by subkodepertama asc, subkodekedua asc, subkodeketiga asc, subkodekeempat asc, subkodekelima asc ;"));

        $result = [
            'subSubKegiatan' => $subSubKegiatan,
            'dataProdukAll' => $dataProdukAll,
            'asalProduk' => $asalProduk,
            'prioritas' => $prioritas,
            'satuan' => $satuan,
            'mataanggarancombo' => $mataanggarancombo,
            'settinganggaran' => $settingAnggaran
        ];

        return $this->respond($result);
    }

    /**
     * Get info stock produk yang dipilih berdasarkan ruangan
     */
    public function getInfoStokRencanaBelanja(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        // Query id ruangan yang hanya digudang
        $kdRuanganDepoRajal = $this->settingDataFixed('kdruanganperencanaan', $idProfile);

        // Query stok produk
        $sql = DB::select(DB::raw("
        SELECT
            ru.id,
            ru.namaruangan,
            CAST ( SUM ( spd.qtyproduk ) AS FLOAT ) AS qtyproduk
        FROM
            stokprodukdetail_t AS spd
            INNER JOIN ruangan_m AS ru ON ru.ID = spd.objectruanganfk
            INNER JOIN strukpelayanan_t AS sk ON sk.norec = spd.nostrukterimafk 
        WHERE
            spd.kdprofile = 30 
            AND spd.objectprodukfk =".$request['produkfk']."
            AND ru.statusenabled = TRUE
            AND spd.objectruanganfk IN(".$kdRuanganDepoRajal.")
        GROUP BY
            ru.namaruangan,
            ru.id
        "));

        return $this->respond($sql);
    }

    /**
     * Simpan data rencana belanja
     */
    public function simpanRencanaBelanja(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $strukPerencanaan = new StrukPerencanaan();
        
        $norec = $strukPerencanaan->generateNewId();

        $noStruk = $this->generateCode(new StrukPerencanaan, 'nostruk', 9, 'P' . $this->getDateTime()->format('ym'), $idProfile);
        
        DB::beginTransaction();
        try{

            $struk = DB::table('strukperencanaan_t')->insert([
                'norec' => $norec,
                'kdprofile' => $idProfile,
                'nostruk' => $noStruk, 
                'statusenabled' => true,
                'tgldokumen' => $request['tgldokumen'],
                'objectpegawaifk' => $request['idLogin'],
                'objectruanganasalfk' => $request['idRuangan'],
                'keteranganlainnya' => 'Rencana Usulan Pengadaan',
                'objectsubkegiatanfk' => $request['idSubSubKegiatan'],
                'tahunanggaran' => $request['tahunanggaran'],
                'objectketeranganfk' => $request['keterangan']
            ]);

            foreach($request['dataPerencanaan'] as $item){
                $strukPerencanaanDetail = new StrukPerencanaanDetail();

                DB::table('strukperencanaandetail_t')->insert([
                    'norec' => $strukPerencanaanDetail->generateNewId(),
                    'nostrukfk' => $norec,
                    'kdprofile' => $idProfile,
                    'statusenabled' => TRUE,
                    'objectprodukfk' => (isset($item['produk']['id'])) ? $item['produk']['id'] : null,
                    'namaproduk' => (isset($item['produk']['namaproduk'])) ? $item['produk']['namaproduk'] : null,
                    'namakegiatan' => (isset($item['namaKegiatan'])) ? $item['namaKegiatan'] : null,
                    'qtystok' => (isset($item['stokProduk'])) ? $item['stokProduk'] : null,
                    'qtyrencana' => $item['jumlahRencana'],
                    'hargasatuan' => $item['hargaSatuan'],
                    'totalharga' => $item['totalHarga'],
                    'objectsatuanfk' => $item['satuan']['id'],
                    'keteranganlainnya' => $item['listReverensi'],
                    'statusverif' => FALSE,
                    'tahunanggaran' => $request['tahunanggaran']
                ]);
            }
            $transStatus = true;
        }catch (\Exception $e) {
            $transStatus = false;
            $result = $e;
        }

        if ($transStatus) {
            $transMessage = 'Sukses';
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'inhuman',
            );
        } else {
            $transMessage = 'Error';
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $e->getMessage(),
                'as' => 'inhuman',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result);

    }

    /**
     * Get data rencana belanja
     */
    public function getRencanaBelanja(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];

        $rencana = DB::table('strukperencanaan_t as sp')
            ->select(DB::raw("sp.tglverifikasi, sp.statusenabled, sp.objectsubkegiatanfk, sp.norec, sp.tgldokumen, sp.nostruk, 
                pg.namalengkap, 
                ka.id || '-' || ka.keterangan AS keterangan, 
                ru.namaruangan"))
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'sp.objectpegawaifk')
            ->leftJoin('kegiatananggaran_m as ka', 'ka.id', '=', 'sp.objectsubkegiatanfk')
            ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'sp.objectruanganasalfk')
            ->where('sp.keteranganlainnya', 'Rencana Usulan Pengadaan')
            ->where('sp.statusenabled', true)
            ->where('sp.kdprofile', $idProfile)
            ->whereBetween('sp.tgldokumen', [$tglAwal, $tglAkhir])
            ->orderBy('sp.nostruk')
            ->get();

        $data = [];
        foreach($rencana as $key=>$item){
            $detail = DB::table('strukperencanaandetail_t as spd')
                ->select(DB::raw("spd.qtyverifikasi, spd.namakegiatan, spd.hargasatuan, 
                    spd.statusverif, spd.norec, spd.nostrukfk, spd.objectprodukfk, 
                    spd.qtyrencana, spd.qtystok, spd.keteranganlainnya, pr.namaproduk"))
                ->leftJoin('produk_m as pr', 'pr.id', '=', 'spd.objectprodukfk')
                ->where('spd.nostrukfk', $item->norec)
                ->where('spd.statusenabled', true)
                ->where('spd.kdprofile', $idProfile)
                ->get();
            
            $data[$key]['rencana'] = $item;
            $data[$key]['details'] = $detail;
        }

        return $this->respond($data);
    }

    /**
     * Delete data rencana belanja
     */
    public function deleteRencanaBelanja(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        DB::beginTransaction();
        try{

            DB::table('strukperencanaan_t')
                ->where('norec', $request['norec'])
                ->update([
                    'statusenabled' => false
                ]);
            DB::table('strukperencanaandetail_t')
                ->where('nostrukfk', $request['norec'])
                ->update([
                    'statusenabled' => false
                ]);

            $transStatus = true;
        }catch(\Exception $e){
            $transStatus = false;
            $result = $e;
        }

        if ($transStatus) {
            $transMessage = 'Sukses';
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'inhuman',
            );
        } else {
            $transMessage = 'Error';
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $e->getMessage(),
                'as' => 'inhuman',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result);
    }

    /**
     * Edit data rencana belanja
     */
    public function editRencanaBelanja(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        // Rencana
        $rencana = DB::table('strukperencanaan_t as sp')
            ->select(DB::raw("sp.statusenabled, sp.objectsubkegiatanfk, sp.norec, 
                sp.tgldokumen, sp.nostruk, sp.objectruanganasalfk, sp.tahunanggaran, 
                pg.namalengkap, ka.id || '-' || ka.keterangan AS keterangan, sp.objectprioritasfk, 
                ru.namaruangan, dp.namadepartemen AS departemen, ru.objectdepartemenfk, sp.objectketeranganfk"))
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'sp.objectpegawaifk')
            ->leftJoin('kegiatananggaran_m as ka', 'ka.id', '=', 'sp.objectsubkegiatanfk')
            ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'sp.objectruanganasalfk')
            ->leftJoin('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
            ->where('sp.keteranganlainnya', '=', 'Rencana Usulan Pengadaan')
            ->where('sp.statusenabled', '=', true)
            ->where('sp.kdprofile', '=', $idProfile)
            ->where('sp.kdprofile', '=', $idProfile)
            ->where('sp.norec', '=', $request['norec'])
            ->first();

        // Detail rencana 
        $detail = DB::table('strukperencanaandetail_t as spd')
            ->select(DB::raw("
                spd.*, pr.namaproduk"))
            ->leftJoin('produk_m as pr', 'pr.id', '=', 'spd.objectprodukfk')
            ->leftJoin('satuanstandar_m as sa', 'sa.id', '=', 'spd.objectsatuanfk')
            ->where('spd.nostrukfk', $rencana->norec)
            ->where('spd.statusenabled', true)
            ->where('spd.kdprofile', $idProfile)
            ->get();
        
        // Satuan
        $satuan = DB::table('satuanstandar_m as sa')
            ->where('statusenabled', true)
            ->where('kdprofile', $idProfile)
            ->get();

        foreach($detail as $dt){
            $dt->satuan = null;
            foreach($satuan as $sa){
                if($sa->id == $dt->objectsatuanfk){
                    $dt->satuan = $sa;
                }
            }
        }

        // Subsub
        $subsub = [
            'id' => $rencana->objectsubkegiatanfk,
            'keterangan' => $rencana->keterangan
        ];

        // Ruangan
        $ruangan = [
            'id' => $rencana->objectruanganasalfk,
            'namaruangan' => $rencana->namaruangan,
            'objectdepartemenfk' => $rencana->objectdepartemenfk,
            'departemen' => $rencana->departemen
        ];

        $rencana->details = $detail;
        $rencana->subsub = $subsub;
        $rencana->ruangan = $ruangan;

        // dd($rencana);
        return $this->respond($rencana);
    }

    /**
     * Update data rencana belanja
     */
    public function updateRencanaBelanja(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $noStruk = $this->generateCode(new StrukPerencanaan, 'nostruk', 9, 'P' . $this->getDateTime()->format('ym'), $idProfile);
        
        DB::beginTransaction();
        try{

            // Update Perencanaan
            $struk = DB::table('strukperencanaan_t')->where('norec', $request['norec'])->update([
                'kdprofile' => $idProfile,
                'statusenabled' => true,
                'tgldokumen' => $request['tgldokumen'],
                'objectpegawaifk' => $request['idLogin'],
                'objectruanganasalfk' => $request['idRuangan'],
                'keteranganlainnya' => 'Rencana Usulan Pengadaan',
                'objectsubkegiatanfk' => $request['idSubSubKegiatan'],
            ]);

            // Delete Detail Perencanaan Sebelumnya
            DB::table('strukperencanaandetail_t')->where('nostrukfk', $request['norec'])->delete();

            foreach($request['dataPerencanaan'] as $item){
                $strukPerencanaanDetail = new StrukPerencanaanDetail();
                DB::table('strukperencanaandetail_t')->insert([
                    'norec' => $strukPerencanaanDetail->generateNewId(),
                    'nostrukfk' => $request['norec'],
                    'kdprofile' => $idProfile,
                    'statusenabled' => TRUE,
                    'objectprodukfk' => (isset($item['produk']['id'])) ? $item['produk']['id'] : null,
                    'namaproduk' => (isset($item['produk']['namaproduk'])) ? $item['produk']['namaproduk'] : null,
                    'namakegiatan' => (isset($item['namaKegiatan'])) ? $item['namaKegiatan'] : null,
                    'qtystok' => (isset($item['stokProduk'])) ? $item['stokProduk'] : null,
                    'qtyrencana' => $item['jumlahRencana'],
                    'hargasatuan' => $item['hargaSatuan'],
                    'totalharga' => $item['totalHarga'],
                    'objectsatuanfk' => $item['satuan']['id'],
                    'keteranganlainnya' => $item['listReverensi'],
                    'statusverif' => FALSE,
                ]);
            }
            $transStatus = true;
        }catch (\Exception $e) {
            $transStatus = false;
            $result = $e;
        }

        if ($transStatus) {
            $transMessage = 'Sukses';
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'inhuman',
            );
        } else {
            $transMessage = 'Error';
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $e->getMessage(),
                'as' => 'inhuman',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result);

    }

    /**
     * Verifikasi data rencana belanja
     */
    public function verifikasiRencanaBelanja(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        DB::beginTransaction();
        try{

            // Update Perencanaan
            $struk = DB::table('strukperencanaan_t')->where('norec', $request['norec'])->update([
                'kdprofile' => $idProfile,
                'statusenabled' => true,
                'objectpegawaiveriffk' => $request['idLogin'],
                'tglverifikasi' => $request['tglVerifikasi'],
                'objectprioritasfk' => $request['idPrioritas']
            ]);

            foreach($request['dataPerencanaan'] as $item){
                $strukPerencanaanDetail = new StrukPerencanaanDetail();
                $keteranganBelanja = new KeteranganBelanja();

                /**
                 * Kode ini akan meupdate setiap detail struk pengajuan berdasarkan norec nya
                 * dan apabila tidak ada norec (yang berarti menambah data baru saat verifikasi) 
                 * maka akaninsert data. 
                 */
                if(isset($item['norec'])){
                    DB::table('strukperencanaandetail_t')->where('norec', $item['norec'])->update([
                        'kdprofile' => $idProfile,
                        'statusenabled' => true,
                        'objectprodukfk' => (isset($item['produk']['id'])) ? $item['produk']['id'] : null,
                        'namaproduk' => (isset($item['produk']['namaproduk'])) ? $item['produk']['namaproduk'] : null,
                        'namakegiatan' => (isset($item['namaKegiatan'])) ? $item['namaKegiatan'] : null,
                        'qtystok' => (isset($item['stokProduk'])) ? $item['stokProduk'] : null,
                        'qtyrencana' => $item['jumlahRencana'],
                        'qtyverifikasi' => $item['jumlahVerifikasi'],
                        'hargasatuan' => $item['hargaSatuan'],
                        'totalharga' =>  $item['jumlahVerifikasi'] * $item['hargaSatuan'],
                        'keteranganlainnya' => $item['listReverensi'],
                        'statusverif' => ($item['statusverif']['value']) ? $item['statusverif']['value'] : 0,
                        'objectkegiatanfk' => $request['idKegiatan'],
                        'objectmataanggaranfk' => $item['mataAnggaran']['id'],
                        'objectasalprodukfk' => $item['sumberdana']['id'],
                        'objectsatuanfk' => $item['satuan']['id'],
                        'objecttahapfk' => $request['idTahap'],
                        'istransfer' => false
                    ]);
                }
                else{
                    DB::table('strukperencanaandetail_t')->insert([
                        'norec' => $strukPerencanaanDetail->generateNewId(),
                        'kdprofile' => $idProfile,
                        'statusenabled' => true,
                        'nostrukfk' => $request['norec'],
                        'objectprodukfk' => (isset($item['produk']['id'])) ? $item['produk']['id'] : null,
                        'namaproduk' => (isset($item['produk']['namaproduk'])) ? $item['produk']['namaproduk'] : null,
                        'namakegiatan' => (isset($item['namaKegiatan'])) ? $item['namaKegiatan'] : null,
                        'qtystok' => (isset($item['stokProduk'])) ? $item['stokProduk'] : null,
                        'qtyperencanaan' => $item['jumlahRencana'],
                        'qtyverifikasi' => $item['jumlahVerifikasi'],
                        'hargasatuan' => $item['hargaSatuan'],
                        'totalharga' =>  $item['jumlahVerifikasi'] * $item['hargaSatuan'],
                        'keteranganlainnya' => $item['listReverensi'],
                        'statusverif' => ($item['statusverif']['value']) ? $item['statusverif']['value'] : 0,
                        'objectkegiatanfk' => $request['idKegiatan'],
                        'objectmataanggaranfk' => $item['mataAnggaran']['id'],
                        'objectasalprodukfk' => $item['sumberdana']['id'],
                        'objectsatuanfk' => $item['satuan']['id'],
                        'objecttahapfk' => $request['idTahap'],
                        'istransfer' => false
                    ]);
                }


                /**
                 * Simpan ke keterangan belanja
                 */
                // DB::table('keteranganbelanja_t')->insert([
                //     'norec' => $keteranganBelanja->generateNewId(),
                //     'kdprofile' => $idProfile,
                //     'statusenabled' => true,
                //     'objectkegiatanfk' => $request['idKegiatan'],
                //     'objectmataanggaranfk' => $request['idMataAnggaran'],
                //     'keteranganbelanja' => (isset($item['produk']['id'])) ? $item['produk']['namaproduk'] : $item['namaKegiatan'],
                //     'jml' => $item['jumlahVerifikasi'],
                //     'hargasatuan' => $item['hargaSatuan'],
                //     'subtotal' => ($item['jumlahVerifikasi'] * $item['hargaSatuan']),
                //     'objectasalprodukfk' => $request['idAsalProduk'],
                //     'objecttahapfk' => $request['idTahap'],
                // ]);
            }
            $transStatus = true;
        }catch (\Exception $e) {
            $transStatus = false;
            $result = $e;
        }

        if ($transStatus) {
            $transMessage = 'Sukses';
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'inhuman',
            );
        } else {
            $transMessage = 'Error';
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $e->getMessage(),
                'as' => 'inhuman',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result);
    }


    public function getComboRBA(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $kelompokAnggaran = DB::table('kelompokanggaran_m as ka')
            ->select(DB::raw('ka.id, ka.namakelompok as div'))
            ->where('statusenabled', true)
            ->orderBy('id', 'asc')
            ->get();
        
        $tahapAnggaran = DB::table('tahapanggaran_m as ta')
            ->select(DB::raw('ta.id, ta.tahap'))
            ->where('statusenabled', true)
            ->orderBy('id', 'asc')
            ->get();
        
        $kegiatanAnggaranAll = DB::table('kegiatananggaran_m')->where('statusenabled', true)->where('kdprofile', $idProfile)->get();

        return $this->respond([
            'kegiatanAnggaranAll' => $kegiatanAnggaranAll,
            'kelompokAnggaran' => $kelompokAnggaran,
            'tahapAnggaran' => $tahapAnggaran
        ]);
    }
    
    public function getRBA(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tahunanggaran = $request['tahun'];
        $idpeg = $request['idpegawai'];
        $dataKegiatan = [];

        $pegawai = '';
        if (isset($request['idpegawai']) && $request['idpegawai'] != "" && $request['idpegawai'] != "undefined") {
            $pegawai = 'and dp.objectpptkfk = '.$idpeg;
        }

        $dv = '';
        $thdv = '';
        if (isset($request['div']) && $request['div'] != "" && $request['div'] != "undefined" && $request['div'] == 4) {
            $dv = 'and dp.div = '.$request['div'];
            $thdv = ' and kb.objecttahapfk is not null';
        } else if (isset($request['div']) && $request['div'] != "" && $request['div'] != "undefined" && $request['div'] != 4) {
            $dv = 'and dp.div = '.$request['div'];
        }  

        $tn = '';
        if (isset($tahunanggaran) && $tahunanggaran!= "" && $tahunanggaran!= "undefined") {
            $tn = "and dp.tahun = '$tahunanggaran'";
        }

        $thp = '';
        if (isset($request['tahapaktif']) && $request['tahapaktif'] != "" && $request['tahapaktif'] != "undefined" && $request['tahapaktif'] != 100) {
            $thp = 'and kb.objecttahapfk = '.$request['tahapaktif'];
            $kegiatan = DB::select(DB::raw("
                select dp.objectjenisbelanjafk, jb.jenisbelanja, dp.objectpptkfk, dp.islockrba, ta.tahap, kb.objecttahapfk, dp.norec, dp0.kode kodesubkegiatan, dp0.keterangan keterangansubkegiatan,
                dp3.kode kodekegiatan, dp3.keterangan keterangankegiatan,
                dp2.kode kodeprogram, dp2.keterangan keteranganprogram,
                dp1.kode kodeurusan, dp1.keterangan keteranganurusan, 
                dp.indikatormasuk, dp.indikatorkeluaran, dp.indikatorhasil, dp.targetmasuk, dp.targetkeluaran, dp.targethasil, 
                coalesce(sum(kb.subtotal),0) as targetmasuk,dp.id, dp.tahun, dp.kode, dp.keterangan, dp.div, kp.namakelompok, pg.namalengkap, cast(split_part(dp.kode, '.', 1) as int4) as subkodeawal
                , cast(split_part(dp.kode, '.', 2) as int4) as subkodekedua
                , case when split_part(dp.kode, '.', 3) = '' then '0' else split_part(dp.kode, '.', 3)::int4 end as subkodeketiga
                , case when split_part(dp.kode, '.', 4) = '' then '0' else split_part(dp.kode, '.', 4)::int4 end as subkodekeempat
                , case when split_part(dp.kode, '.', 5) = '' then '0' else split_part(dp.kode, '.', 5)::int4 end as subkodekelima
                , case when split_part(dp.kode, '.', 6) = '' then '0' else split_part(dp.kode, '.', 6)::int4 end as subkodekeenam
                , case when split_part(dp.kode, '.', 7) = '' then '0' else split_part(dp.kode, '.', 7)::int4 end as subkodeakhir 
                from kegiatananggaran_m as dp 
                left join keteranganbelanja_t as kb on kb.objectkegiatanfk = dp.id
                and kb.kdprofile = 30 and kb.statusenabled = true 
                left join kegiatananggaran_m as dp3 on dp.kode ilike dp3.kode || '%' and dp3.div = 2
                and dp3.kdprofile = 30 and dp3.statusenabled = true 
                left join kegiatananggaran_m as dp2 on dp3.kode ilike dp2.kode || '%' and dp2.div = 1
                and dp2.kdprofile = 30 and dp2.statusenabled = true 
                left join kegiatananggaran_m as dp1 on dp2.kode ilike dp1.kode || '%' and dp1.div = 0
                and dp1.kdprofile = 30 and dp1.statusenabled = true 
                left join kegiatananggaran_m as dp0 on dp.kode ilike dp0.kode || '%' and dp0.div = 3
                and dp0.kdprofile = 30 and dp0.statusenabled = true 
                left join kelompokanggaran_m as kp on kp.id = dp.div 
                left join pegawai_m as pg on pg.id = dp.objectpptkfk 
                left join tahapanggaran_m ta on ta.id = kb.objecttahapfk
                left join jenisbelanja_m jb on jb.id = dp.objectjenisbelanjafk
                where dp.kdprofile = 30 and dp.statusenabled = true 
                and kb.kdprofile = 30 and kb.statusenabled = true 
                $thp
                $dv
                $thdv
                $tn
                group by dp.objectjenisbelanjafk, jb.jenisbelanja, dp.objectpptkfk, ta.tahap, kb.objecttahapfk, dp.norec, dp0.kode, dp0.keterangan, dp3.kode, dp3.keterangan, dp2.kode, dp2.keterangan, dp1.kode, dp1.keterangan, 
                dp.indikatormasuk, dp.indikatorkeluaran, dp.indikatorhasil, dp.targetmasuk, dp.targetkeluaran, dp.targethasil, dp.id, dp.kode, dp.div, dp.tahun, dp.keterangan, kp.namakelompok, pg.namalengkap, cast(split_part(dp.kode, '.', 1) as int4)
                , cast(split_part(dp.kode, '.', 2) as int4)
                , case when split_part(dp.kode, '.', 3) = '' then '0' else split_part(dp.kode, '.', 3)::int4 end
                , case when split_part(dp.kode, '.', 4) = '' then '0' else split_part(dp.kode, '.', 4)::int4 end
                , case when split_part(dp.kode, '.', 5) = '' then '0' else split_part(dp.kode, '.', 5)::int4 end
                , case when split_part(dp.kode, '.', 6) = '' then '0' else split_part(dp.kode, '.', 6)::int4 end
                , case when split_part(dp.kode, '.', 7) = '' then '0' else split_part(dp.kode, '.', 7)::int4 end order by subkodeawal asc, subkodekedua asc, subkodeketiga asc, subkodekeempat asc, subkodekelima asc, subkodekeenam asc, subkodeakhir asc"));
            
            $dataKegiatan = $kegiatan;
        
        } else if (isset($request['tahapaktif']) && $request['tahapaktif'] != "" && $request['tahapaktif'] != "undefined" && $request['tahapaktif'] == 100) {
            $kegiatan = DB::select(DB::raw("
                select dp.objectjenisbelanjafk, jb.jenisbelanja, dp.objectpptkfk, dp.islockrba, ta.tahap, kb.objecttahapfk, dp.norec, dp0.kode kodesubkegiatan, dp0.keterangan keterangansubkegiatan,
                dp3.kode kodekegiatan, dp3.keterangan keterangankegiatan,
                dp2.kode kodeprogram, dp2.keterangan keteranganprogram,
                dp1.kode kodeurusan, dp1.keterangan keteranganurusan, 
                dp.indikatormasuk, dp.indikatorkeluaran, dp.indikatorhasil, dp.targetmasuk, dp.targetkeluaran, dp.targethasil, 
                coalesce(sum(kb.subtotal),0) as targetmasuk,dp.id, dp.tahun, dp.kode, dp.keterangan, dp.div, kp.namakelompok, pg.namalengkap, cast(split_part(dp.kode, '.', 1) as int4) as subkodeawal
                , cast(split_part(dp.kode, '.', 2) as int4) as subkodekedua
                , case when split_part(dp.kode, '.', 3) = '' then '0' else split_part(dp.kode, '.', 3)::int4 end as subkodeketiga
                , case when split_part(dp.kode, '.', 4) = '' then '0' else split_part(dp.kode, '.', 4)::int4 end as subkodekeempat
                , case when split_part(dp.kode, '.', 5) = '' then '0' else split_part(dp.kode, '.', 5)::int4 end as subkodekelima
                , case when split_part(dp.kode, '.', 6) = '' then '0' else split_part(dp.kode, '.', 6)::int4 end as subkodekeenam
                , case when split_part(dp.kode, '.', 7) = '' then '0' else split_part(dp.kode, '.', 7)::int4 end as subkodeakhir 
                from kegiatananggaran_m as dp 
                left join keteranganbelanja_t as kb on kb.objectkegiatanfk = dp.id
                and kb.kdprofile = 30 and kb.statusenabled = true 
                $thdv
                left join kegiatananggaran_m as dp3 on dp.kode ilike dp3.kode || '%' and dp3.div = 2
                and dp3.kdprofile = 30 and dp3.statusenabled = true 
                left join kegiatananggaran_m as dp2 on dp3.kode ilike dp2.kode || '%' and dp2.div = 1
                and dp2.kdprofile = 30 and dp2.statusenabled = true 
                left join kegiatananggaran_m as dp1 on dp2.kode ilike dp1.kode || '%' and dp1.div = 0
                and dp1.kdprofile = 30 and dp1.statusenabled = true 
                left join kegiatananggaran_m as dp0 on dp.kode ilike dp0.kode || '%' and dp0.div = 3
                and dp0.kdprofile = 30 and dp0.statusenabled = true 
                left join kelompokanggaran_m as kp on kp.id = dp.div 
                left join pegawai_m as pg on pg.id = dp.objectpptkfk 
                left join tahapanggaran_m ta on ta.id = kb.objecttahapfk
                left join jenisbelanja_m jb on jb.id = dp.objectjenisbelanjafk
                where dp.kdprofile = 30 and dp.statusenabled = true 
                $pegawai
                $dv
                $tn
                group by dp.objectjenisbelanjafk, jb.jenisbelanja, dp.objectpptkfk, ta.tahap, kb.objecttahapfk, dp.norec, dp0.kode, dp0.keterangan, dp3.kode, dp3.keterangan, dp2.kode, dp2.keterangan, dp1.kode, dp1.keterangan, 
                dp.indikatormasuk, dp.indikatorkeluaran, dp.indikatorhasil, dp.targetmasuk, dp.targetkeluaran, dp.targethasil, dp.id, dp.kode, dp.div, dp.tahun, dp.keterangan, kp.namakelompok, pg.namalengkap, cast(split_part(dp.kode, '.', 1) as int4)
                , cast(split_part(dp.kode, '.', 2) as int4)
                , case when split_part(dp.kode, '.', 3) = '' then '0' else split_part(dp.kode, '.', 3)::int4 end
                , case when split_part(dp.kode, '.', 4) = '' then '0' else split_part(dp.kode, '.', 4)::int4 end
                , case when split_part(dp.kode, '.', 5) = '' then '0' else split_part(dp.kode, '.', 5)::int4 end
                , case when split_part(dp.kode, '.', 6) = '' then '0' else split_part(dp.kode, '.', 6)::int4 end
                , case when split_part(dp.kode, '.', 7) = '' then '0' else split_part(dp.kode, '.', 7)::int4 end order by subkodeawal asc, subkodekedua asc, subkodeketiga asc, subkodekeempat asc, subkodekelima asc, subkodekeenam asc, subkodeakhir asc"));
            
            $dataKegiatan = $kegiatan;
        } else{
            $kegiatan = DB::select(DB::raw("
                select dp.objectjenisbelanjafk, jb.jenisbelanja, dp.objectpptkfk, dp.islockrba, ta.tahap, kb.objecttahapfk, dp.norec, dp0.kode kodesubkegiatan, dp0.keterangan keterangansubkegiatan,
                dp3.kode kodekegiatan, dp3.keterangan keterangankegiatan,
                dp2.kode kodeprogram, dp2.keterangan keteranganprogram,
                dp1.kode kodeurusan, dp1.keterangan keteranganurusan, 
                dp.indikatormasuk, dp.indikatorkeluaran, dp.indikatorhasil, dp.targetmasuk, dp.targetkeluaran, dp.targethasil, 
                coalesce(sum(kb.subtotal),0) as targetmasuk,dp.id, dp.tahun, dp.kode, dp.keterangan, dp.div, kp.namakelompok, pg.namalengkap, cast(split_part(dp.kode, '.', 1) as int4) as subkodeawal
                , cast(split_part(dp.kode, '.', 2) as int4) as subkodekedua
                , case when split_part(dp.kode, '.', 3) = '' then '0' else split_part(dp.kode, '.', 3)::int4 end as subkodeketiga
                , case when split_part(dp.kode, '.', 4) = '' then '0' else split_part(dp.kode, '.', 4)::int4 end as subkodekeempat
                , case when split_part(dp.kode, '.', 5) = '' then '0' else split_part(dp.kode, '.', 5)::int4 end as subkodekelima
                , case when split_part(dp.kode, '.', 6) = '' then '0' else split_part(dp.kode, '.', 6)::int4 end as subkodekeenam
                , case when split_part(dp.kode, '.', 7) = '' then '0' else split_part(dp.kode, '.', 7)::int4 end as subkodeakhir 
                from kegiatananggaran_m as dp 
                left join keteranganbelanja_t as kb on kb.objectkegiatanfk = dp.id 
                and kb.kdprofile = 30 and kb.statusenabled = true 
                left join kegiatananggaran_m as dp3 on dp.kode ilike dp3.kode || '%' and dp3.div = 2
                and dp3.kdprofile = 30 and dp3.statusenabled = true 
                left join kegiatananggaran_m as dp2 on dp3.kode ilike dp2.kode || '%' and dp2.div = 1
                and dp2.kdprofile = 30 and dp2.statusenabled = true 
                left join kegiatananggaran_m as dp1 on dp2.kode ilike dp1.kode || '%' and dp1.div = 0
                and dp1.kdprofile = 30 and dp1.statusenabled = true 
                left join kegiatananggaran_m as dp0 on dp.kode ilike dp0.kode || '%' and dp0.div = 3
                and dp0.kdprofile = 30 and dp0.statusenabled = true 
                left join kelompokanggaran_m as kp on kp.id = dp.div 
                left join pegawai_m as pg on pg.id = dp.objectpptkfk 
                left join tahapanggaran_m ta on ta.id = kb.objecttahapfk
                left join jenisbelanja_m jb on jb.id = dp.objectjenisbelanjafk
                where dp.kdprofile = 30 and dp.statusenabled = true 
                $dv
                $thdv
                $tn
                group by dp.objectjenisbelanjafk, jb.jenisbelanja, dp.objectpptkfk, ta.tahap, kb.objecttahapfk, dp.norec, dp0.kode, dp0.keterangan, dp3.kode, dp3.keterangan, dp2.kode, dp2.keterangan, dp1.kode, dp1.keterangan, 
                dp.indikatormasuk, dp.indikatorkeluaran, dp.indikatorhasil, dp.targetmasuk, dp.targetkeluaran, dp.targethasil, dp.id, dp.kode, dp.div, dp.tahun, dp.keterangan, kp.namakelompok, pg.namalengkap, cast(split_part(dp.kode, '.', 1) as int4)
                , cast(split_part(dp.kode, '.', 2) as int4)
                , case when split_part(dp.kode, '.', 3) = '' then '0' else split_part(dp.kode, '.', 3)::int4 end
                , case when split_part(dp.kode, '.', 4) = '' then '0' else split_part(dp.kode, '.', 4)::int4 end
                , case when split_part(dp.kode, '.', 5) = '' then '0' else split_part(dp.kode, '.', 5)::int4 end
                , case when split_part(dp.kode, '.', 6) = '' then '0' else split_part(dp.kode, '.', 6)::int4 end
                , case when split_part(dp.kode, '.', 7) = '' then '0' else split_part(dp.kode, '.', 7)::int4 end order by subkodeawal asc, subkodekedua asc, subkodeketiga asc, subkodekeempat asc, subkodekelima asc, subkodekeenam asc, subkodeakhir asc"));
            
            $dataKegiatan = $kegiatan;
        }

        $jenisbelanja = DB::table('jenisbelanja_m')
            ->select('jenisbelanja','id')
            ->where('kdprofile', $idProfile)
            ->where('statusenabled', 't')
            ->get();

        return $this->respond([
            'kegiatan' => $dataKegiatan,
            'jenisbelanja' => $jenisbelanja
        ]);
    }

    public function transferDariVerifikasi(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $details = $request['details'];
        $awal = $request['tahapawal']['id'];
        $akhir = $request['tahapakhir']['id'];
        
        $errMsg = null;

        DB::beginTransaction();
        try{
            
            // loop sub sub kegiatan yang sudah dipilih
            foreach($details as $dt){
                $newID = KegiatanAnggaran::max('id');
                
                // cek jika kegiatan anggaran sudah ada berdasarkan kode div dan tahunakhir
                $cek = DB::table('kegiatananggaran_m')
                    ->where('kode', $dt['kodesubsubkegiatan'])
                    ->where('div', $dt['div'])
                    ->where('tahun', $request['tahunakhir'])
                    ->first();
                
                if(!$cek){
                    // Buat kegiatan mata anggaran baru berdasarkan tahun transfer
                    $KA = DB::table('kegiatananggaran_m')->insertGetId([
                        'id' => $newID + 1,
                        'norec' => $newID + 1,
                        'kdprofile' => $idProfile,
                        'statusenabled' => true,
                        'kode' => $dt['kodesubsubkegiatan'],
                        'keterangan' => $dt['keterangansubsubkegiatan'],
                        'tahun' => $request['tahunakhir'],
                        'indikatormasuk' => $dt['indikatormasuk'],
                        'indikatorkeluaran' => $dt['indikatorkeluaran'],
                        'indikatorhasil' => $dt['indikatorhasil'],
                        'targetmasuk' => $dt['targetmasuk'],
                        'targetkeluaran' => $dt['targetkeluaran'],
                        'targethasil' =>  $dt['targethasil'],
                        'div' => $dt['div'],
                        'objectjenisbelanjafk' => $dt['objectjenisbelanjafk'],
                        'objectpptkfk' => $dt['objectpptkfk'],
                        'tglbuat' => $request['tglbuat']
                    ]);
                }

                
                // mendapatkan data perencanaan yang sudah verifikasi dan belum transfer berdasarkan sub sub yang dipilih
                $perencanaan = DB::table('strukperencanaan_t as sp')
                    ->select(DB::raw('spd.*, sa.satuanstandar'))
                    ->leftJoin('strukperencanaandetail_t as spd', 'sp.norec', '=', 'spd.nostrukfk')
                    ->leftJoin('satuanstandar_m as sa', 'sa.id', '=', 'spd.objectsatuanfk')
                    ->where('sp.statusenabled', true)->where('spd.statusenabled', true)
                    ->where('sp.kdprofile', $idProfile)->where('spd.kdprofile', $idProfile)
                    ->where('spd.statusverif', true)->where('spd.istransfer', false)
                    ->where('spd.objectkegiatanfk', $dt['idsubsubkegiatan'])
                    ->get();
                
                if(count($perencanaan) > 0){

                    // menambahkan data perencanaan ke dalam data keterangan belanja
                    // dengan merelasikan dengan mata anggaran baru
                    // tetapi tahap masih sesuai saat verifikasi
                    foreach($perencanaan as $item){
                        $kbNorec = new KeteranganBelanja();
                        DB::table('keteranganbelanja_t')->insert([
                            'norec' => $kbNorec->generateNewId(),
                            'kdprofile' => $idProfile,
                            'statusenabled' => true,
                            'objectkegiatanfk' => ($cek) ? $cek->id : $KA,
                            'objectmataanggaranfk' => $item->objectmataanggaranfk,
                            'keteranganbelanja' => ($item->namaproduk !== null) ? $item->namaproduk : $item->namakegiatan,
                            'jml' => $item->qtyverifikasi,
                            'hargasatuan' => $item->hargasatuan,
                            'subtotal' => (int)$item->qtyverifikasi * (int)$item->hargasatuan,
                            'satuan' => $item->satuanstandar,
                            'objectasalprodukfk' => $item->objectasalprodukfk,
                            'password' => null,
                            'objecttahapfk' => $akhir,
                        ]);

                        // ubah perencanaan yang sudah dibuat data keterangan belanja
                        DB::table('strukperencanaandetail_t')
                            ->where('norec', $item->norec)
                            ->update([ 'istransfer' => true ]);
                    }
                    
                }
            }

            $transStatus = true;
            $transMessage = 'Save Transfer Anggaran ';
        } catch (Exception $e) {
            $transStatus = false;
            $errMsg = $e->getMessage();
        }
        
        $transMessage = 'Save Transfer Anggaran ';

        if ($transStatus == true) {
            $transMessage = $transMessage . 'Suksess';
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
                'message'=> $errMsg,
                'as' => '@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getSubSubRBA(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $subSubKegiatan = DB::table('kegiatananggaran_m as ka1')
            ->select(DB::raw("
                ka1.tahun tahunsubsubkegiatan, ka1.id idsubsubkegiatan, ka1.kode kodesubsubkegiatan, ka1.id || '-' || ka1.keterangan keterangansubsubkegiatan, 
                ka1.indikatormasuk, ka1.indikatorkeluaran, ka1.indikatorhasil, ka1.targetmasuk, ka1.targetkeluaran, ka1.targethasil, ka1.div, 
                ka1.objectjenisbelanjafk, ka1.objectpptkfk, ka1.id, ka1.keterangan"))
            ->join('kegiatananggaran_m as ka2', 'ka1.kode', 'like', DB::raw("ka2.kode || '%'"))
            ->leftJoin('strukperencanaandetail_t as spd', 'spd.objectkegiatanfk', '=' ,'ka1.id')
            ->where('ka1.kdprofile', $idProfile)->where('ka2.kdprofile', $idProfile)->where('spd.kdprofile', $idProfile)
            ->where('ka1.statusenabled', true)->where('ka2.statusenabled', true)->where('spd.statusenabled', true)
            ->where('ka1.div', 4)->where('ka2.div', 3)
            ->where('spd.istransfer', false)->where('spd.statusverif', true)  //mendapatkan sub sub jika strukperencanaan detail belum ada yang ditransfer
            ->when($request['tahap'], function($query) use ($request){
                return $query->where('spd.objecttahapfk', $request['tahap']);
            })
            ->when($request['tahunawal'], function($query) use ($request){
                return $query->where('ka1.tahun', (string)$request['tahunawal']);
            })
            ->when($request['subkegiatan'], function($query) use ($request){
                return $query->where('ka2.id', $request['subkegiatan']);
            })
            ->groupBy(DB::raw("
                ka1.id, ka1.kode, ka1.id || '-' || ka1.keterangan, ka1.tahun, ka1.indikatormasuk, ka1.indikatorkeluaran, ka1.indikatorhasil, ka1.targetmasuk, 
                ka1.targetkeluaran, ka1.targethasil, ka1.div, ka1.objectjenisbelanjafk, ka1.objectpptkfk, ka1.id, ka1.keterangan"))
            ->orderBy('ka1.kode')
            ->get();

        return $this->respond($subSubKegiatan);
    }

    // Abaikan, dalam tahap pengembangan
    // Mengecek jumlah nilai alokasi sama gak dengan yng ditransfer
    // ubah nilai objectkegianfk dan tahap
    public function coba()
    {
        $data = DB::select(DB::raw("
            SELECT
                kb.objectkegiatanfk, kb.objecttahapfk,
                ak.nilai AS nilai_alokasi 
            FROM
                alokasiketeranganbelanja_t AS ak
                LEFT JOIN keteranganbelanja_t AS kb ON kb.norec = ak.keteranganbelanjafk 
            WHERE
                kb.statusenabled = TRUE 
                AND ak.statusenabled = TRUE
                AND kb.objectkegiatanfk = 214
                AND kb.objecttahapfk = 7
            ORDER BY
                nilai_alokasi DESC
        "));

        $totalNilaiAlokasi = 0;

        foreach($data as $d){
            $totalNilaiAlokasi = $totalNilaiAlokasi + (int)$d->nilai_alokasi;
        }

        return $this->respond($totalNilaiAlokasi);
    }

    public function cobaCetak()
    {
        $data = DB::select(DB::raw("
            SELECT
                ma4.namamataanggaran, kb.jml, kb.satuan, kb.hargasatuan, kb.subtotal,
                ka.id AS id_kegiatananggaran, ka.kode AS kode_kegiatananggaran, ka.keterangan,
                ma4.id AS id_mataanggaran4, ma3.id AS id_mataanggaran3, ma2.id AS id_mataanggaran2, ma1.id AS id_mataanggaran1,
                ma1.namamataanggaran AS nama_mataanggaran1, ma2.namamataanggaran AS nama_mataanggaran2, ma3.namamataanggaran AS nama_mataanggaran3, ma4.namamataanggaran AS nama_namamataanggaran4,
                ma4.kodemataanggaran as kode_mataanggaran4_gabung,
                SPLIT_PART(ma4.kodemataanggaran, '.', 4) || '.' || SPLIT_PART(ma4.kodemataanggaran, '.', 5) as kode_mataanggaran4,
                SPLIT_PART(ma4.kodemataanggaran, '.', 3) AS kode_mataanggaran3,
                SPLIT_PART(ma4.kodemataanggaran, '.', 2) AS kode_mataanggaran2,
                SPLIT_PART(ma4.kodemataanggaran, '.', 1) AS kode_mataanggaran1,
                ta.tahap
            FROM keteranganbelanja_t AS kb
            LEFT JOIN mataanggaran_m AS ma4 ON ma4.id = kb.objectmataanggaranfk
            LEFT JOIN kegiatananggaran_m AS ka ON ka.id = kb.objectkegiatanfk
            LEFT JOIN asalproduk_m as ap ON ap.id = kb.objectasalprodukfk
            LEFT JOIN mataanggaran_m AS ma3 ON ma3.kodemataanggaran ILIKE 
                SPLIT_PART(ma4.kodemataanggaran, '.', 1) || '.' || SPLIT_PART(ma4.kodemataanggaran, '.', 2) || '.' || SPLIT_PART(ma4.kodemataanggaran, '.', 3)
            LEFT JOIN mataanggaran_m AS ma2 ON ma2.kodemataanggaran ILIKE
                SPLIT_PART(ma3.kodemataanggaran, '.', 1) || '.' || SPLIT_PART(ma3.kodemataanggaran, '.', 2)
            LEFT JOIN mataanggaran_m AS ma1 ON ma1.kodemataanggaran ILIKE
                SPLIT_PART(ma2.kodemataanggaran, '.', 1)
            LEFT JOIN tahapanggaran_m AS ta ON ta.id = kb.objecttahapfk
            WHERE kb.statusenabled = TRUE AND kb.kdprofile = 30
            AND kb.objecttahapfk = 4 AND kb.objectkegiatanfk = 220
            AND ma4.statusenabled = TRUE AND ma4.kdprofile = 30
            AND ma3.statusenabled = TRUE AND ma3.kdprofile = 30
            AND ma2.statusenabled = TRUE AND ma2.kdprofile = 30
            AND ma1.statusenabled = TRUE AND ma1.kdprofile = 30
            AND ka.statusenabled = TRUE AND ka.kdprofile = 30 AND ka.tahun = '2024'
            AND ap.statusenabled = TRUE AND ap.kdprofile = 30
            ORDER BY
                CAST(split_part(ma4.kodemataanggaran, '.', 5) AS INTEGER)
        "));

        return view('report.cobacetak', [
            'data' => $data
        ]);
    }
}