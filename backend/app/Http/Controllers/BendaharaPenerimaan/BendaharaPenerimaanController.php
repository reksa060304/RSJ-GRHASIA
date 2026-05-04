<?php
/**
 * Created by PhpStorm.
 * User: efan (ea@epic)
 * Date: 13/09/2019
 * Time: 09:12
 */

namespace App\Http\Controllers\BendaharaPenerimaan;


use App\Http\Controllers\ApiController;
use App\Master\Pegawai;
use App\Traits\Valet;
use App\Transaksi\BKUPenerimaanV2;
use App\Transaksi\StrukRealisasi;
use App\Transaksi\PengembalianPembayaran;
use App\Transaksi\StrukBuktiPenerimaan;
use App\Transaksi\StrukBuktiPenerimaanCaraBayar;
use App\Transaksi\StrukBuktiPengeluaran;
use App\Transaksi\StrukClosing;
use App\Transaksi\StrukClosingKasir;
use App\Transaksi\StrukHistori;
use App\Transaksi\SuratTandaSetoranDetailV2;
use App\Transaksi\TempBeritaAcaraKasBank;
use App\Transaksi\TempBukuKasUmum;
use App\Transaksi\TempLampiranBeritaAcaraKasBank;
use App\Transaksi\StrukOrder;
use App\Transaksi\SuratTandaSetoran;
use App\Transaksi\SuratTandaSetoranDetail;
use App\Transaksi\STStoSCK;
use App\Transaksi\STStoRekapKlaim;
use App\Transaksi\RekapKlaim;
use App\Transaksi\MonitoringKlaim;
use App\Transaksi\SaldoAwalBKUBP;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Excel;
use App\Exports\STSExport;

class BendaharaPenerimaanController extends ApiController {

    use Valet;
    public function __construct(){
        parent::__construct($skip_authentication = false);
    }

    public function getDataCombo(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin = $request->all();
        $caraSetor = \DB::table('carasetor_m as cs')
            ->select('cs.*')
            ->where('cs.kdprofile',$idProfile)
            ->where('cs.statusenabled', true)
            ->orderBy('cs.id');
        if (isset($request['kdcarasetor']) && $request['kdcarasetor'] != "" && $request['kdcarasetor'] != "undefined") {
            $caraSetor = $caraSetor->where('cs.kdcarasetor', '=', $request['kdcarasetor']);
        }
        if (isset($request['id']) && $request['id'] != "" && $request['id'] != "undefined") {
            $caraSetor = $caraSetor->where('cs.id', '=', $request['id']);
        }
        if (isset($request['carasetor']) && $request['carasetor'] != "" && $request['carasetor'] != "undefined") {
            $caraSetor = $caraSetor->where('cs.carasetor', 'ilike','%'. $request['carasetor'].'%');
        }
        $caraSetor=$caraSetor->get();

        $dataKasir= \DB::select(DB::raw("select pg.id,pg.namalengkap from loginuser_s lu
                INNER JOIN pegawai_m pg on lu.objectpegawaifk=pg.id
                where lu.kdprofile = $idProfile and objectkelompokuserfk=:id and pg.statusenabled=true"),
            array(
                'id' => 20,
            )
        );

        $kelompokTransaksi= \DB::table('mapbkutokelompoktransaksi_m as mp')
            ->join('bku_m as bku','bku.id','=','mp.idbku')
            ->join('kelompoktransaksi_m as kt','kt.id','=','mp.kelompoktransaksifk')
            ->select('mp.id','mp.kelompoktransaksifk','mp.idbku','bku.bku','kt.kelompoktransaksi')
            ->where('mp.kdprofile',$idProfile)
            ->where('mp.statusenabled',true);
        if (isset($request['keterangan']) && $request['keterangan'] != "" && $request['keterangan'] != "undefined") {
            $kelompokTransaksi = $kelompokTransaksi->where('bku.bku', '=', $request['keterangan']);
        }
        $kelompokTransaksi= $kelompokTransaksi ->get();

        // $mataAnggaran= \DB::table('mataanggaran_t as m')
        //     ->select('m.mataanggaran','m.norec')
        //     ->where('m.kdprofile',$idProfile)
        //     ->where('m.statusenabled',true)
        //     ->orderBy('m.mataanggaran')
        //     ->get();

        $caraBayar = \DB::table('carabayar_m')
            ->select('id','carabayar as caraBayar','carabayar as namaExternal')
            ->where('kdprofile', $idProfile)
            ->where('statusenabled',true)
            ->get();

        $listBank = \DB::table('bank_m')
            ->select('id','nama')
            ->where('kdprofile', $idProfile)
            ->where('statusenabled',true)
            ->get();

        $listBankAccount = \DB::table('bankaccount_m')
            ->select('id','reportdisplay as bankAccountNama')
            ->where('kdprofile', $idProfile)
            ->where('statusenabled',true)
            ->get();

        $asalProduk = \DB::table('asalproduk_m')
            ->select('id','asalproduk')
            ->where('statusenabled',true)
            ->where('kdprofile', $idProfile)
            ->get();

        $result = array(
            'carasetor' => $caraSetor,
            'datalogin' => $dataLogin,
            'datakasir' => $dataKasir,
            'kelompoktransaksi' => $kelompokTransaksi,
            // 'mataanggaran' => $mataAnggaran,
            'carabayar' => $caraBayar,
            'listbank' => $listBank,
            'listbankaccount' => $listBankAccount,
            'asalproduk'=>$asalProduk,
            'message' => 'inhuman',
        );
        return $this->respond($result);
    }

    public function getDaftarSBM(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $data = \DB::table('strukbuktipenerimaan_t as sbm')
            ->join('strukpelayanan_t as sp', 'sbm.nostrukfk', '=', 'sp.norec')
            ->leftjoin('pasiendaftar_t as pd', 'sp.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftjoin('loginuser_s as lu', 'lu.id', '=', 'sbm.objectpegawaipenerimafk')
            ->leftjoin('pegawai_m as p', 'p.id', '=', 'lu.objectpegawaifk')
            ->leftjoin('pasien_m as ps', 'ps.id', '=', 'sp.nocmfk')
            ->leftjoin('strukbuktipenerimaancarabayar_t as sbmcr', 'sbmcr.nosbmfk', '=', 'sbm.norec')
            ->leftjoin('carabayar_m as cb', 'cb.id', '=', 'sbmcr.objectcarabayarfk')
            ->leftjoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftjoin('kelompoktransaksi_m as kt', 'kt.id', '=', 'sbm.objectkelompoktransaksifk')
            ->leftjoin('strukclosing_t as sc', 'sc.norec', '=', 'sbm.noclosingfk')
            ->leftjoin('strukverifikasi_t as sv', 'sv.norec', '=', 'sbm.noverifikasifk')
            ->select('sbm.norec as noRec', 'kp.kelompokpasien', 'cb.carabayar as caraBayar','sbmcr.objectcarabayarfk as idCaraBayar','sbm.objectkelompoktransaksifk as idKelTransaksi',
                'kt.kelompoktransaksi as kelTransaksi','sbm.keteranganlainnya as keterangan','p.id as idPegawai','p.namalengkap as namaPenerima',
                'sc.noclosing as noClosing','sbm.nosbm as noSbm','sv.noverifikasi as noVerifikasi','sc.tglclosing as tglClosing',
                'sbm.tglsbm as tglSbm','sv.tglverifikasi as tglVerif','sbm.totaldibayar as totalPenerimaan','pd.noregistrasi','ps.namapasien',
                'sp.norec as norec_sp','ru.id as ruid','ru.namaruangan','sp.namapasien_klien','ps.nocm','sbm.noclosingfk')
            ->where('sbm.kdprofile', $idProfile)
            ->where('sbm.statusenabled',true);

        //->whereNull('pd.nostruklastfk');

        $filter = $request->all();
        if(isset($filter['dateStartTglSbm']) && $filter['dateStartTglSbm'] != "" && $filter['dateStartTglSbm'] != "undefined") {
            $tgl2 = $filter['dateStartTglSbm'] ;//. " 00:00:00";
            $data = $data->where('sbm.tglsbm', '>=', $tgl2);
        }

        if(isset($filter['dateEndTglSbm']) && $filter['dateEndTglSbm'] != "" && $filter['dateEndTglSbm'] != "undefined") {
            $tgl = $filter['dateEndTglSbm'] ;//. " 23:59:59";
            $data = $data->where('sbm.tglsbm', '<=', $tgl);
        }

        if(isset($filter['idPegawai']) && $filter['idPegawai'] != "" && $filter['idPegawai'] != "undefined") {
            $data = $data->where('p.id', '=', $filter['idPegawai']);
        }

        if(isset($filter['idCaraBayar']) && $filter['idCaraBayar'] != "" && $filter['idCaraBayar'] != "undefined") {
            $data = $data->where('cb.id', '=', $filter['idCaraBayar']);
        }

        if(isset($filter['idKelTransaksi']) && $filter['idKelTransaksi'] != "" && $filter['idKelTransaksi'] != "undefined") {
            $data = $data->where('kt.id', $filter['idKelTransaksi']);
        }
        if(isset($filter['ins']) && $filter['ins'] != "" && $filter['ins'] != "undefined") {
            $data = $data->where('ru.objectdepartemenfk', $filter['ins']);
        }
        if(isset($filter['nosbm']) && $filter['nosbm'] != "" && $filter['nosbm'] != "undefined") {
            $data = $data->where('sbm.nosbm','ilike','%'.$filter['nosbm'].'%');
        }
        if(isset($filter['nocm']) && $filter['nocm'] != "" && $filter['nocm'] != "undefined") {
            $data = $data->where('ps.nocm','ilike','%'.$filter['nocm'].'%');
        }
        if(isset($filter['noclosing']) && $filter['noclosing'] != "" && $filter['noclosing'] != "undefined") {
            $data = $data->where('sc.noclosing','ilike','%'.$filter['noclosing'].'%');
        }
        if(isset($filter['noregistrasi']) && $filter['noregistrasi'] != "" && $filter['noregistrasi'] != "undefined") {
            $data = $data->where('pd.noregistrasi','ilike','%'.$filter['noregistrasi'].'%');
        }
        if(isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $data = $data->where('ps.namapasien','ilike','%'.$filter['nama'].'%');
        }
        if(isset($filter['desk']) && $filter['desk'] != "" && $filter['desk'] != "undefined") {
            $data = $data->where('sp.namapasien_klien','ilike','%'.$filter['desk'].'%');
        }
        if(isset($filter['KetSetor']) && $filter['KetSetor'] != "" && $filter['KetSetor'] != "undefined") {
            if ($filter['KetSetor'] == 1){
                $data = $data->whereNull('sc.noclosing');
            }elseif ($filter['KetSetor'] == 2){
                $data = $data->whereNotNull('sc.noclosing');
            }
        }
        if(isset($request['KasirArr']) && $request['KasirArr']!="" && $request['KasirArr']!="undefined"){
            $arrRuang = explode(',',$request['KasirArr']) ;
            $kodeRuang = [];
            foreach ( $arrRuang as $item){
                $kodeRuang[] = (int) $item;
            }
            $data = $data->whereIn('p.id',$kodeRuang);
        }
//        $data = $data->whereNull('sbm.noclosingfk');
        $data = $data->get();

        $result=[];
        foreach ($data as $item) {
            $noclosingfk = $item->noclosingfk;
            $caraBayar = $item->caraBayar;
            $details= \DB::select(DB::raw("
                    select
                  --count(x.id) as idCaraBayar,x.caraBayar ,sum (x.jumlah) as jumlah from(
                    distinct sck.noclosingfk,cb.id,
                    cb.carabayar as caraBayar,sh.noclosing,sck.totaldibayar as jumlah,
                    sc.totaldibayar as total,
                    sh.objectpegawaiterimafk, pg.namalengkap as pegawaipenerima
                    from strukclosingkasir_t  as sck
                    left join strukclosing_t as sc on sc.norec=sck.noclosingfk
                    left join carabayar_m as cb on cb.id=sck.carabayarfk
                    left join strukhistori_t as sh on sh.noclosing=sc.noclosing
                    LEFT JOIN carasetor_m as cs on cs.id=sck.objectcarasetorfk
                    left join pegawai_m as pg on pg.id=sh.objectpegawaiterimafk
                    where sck.kdprofile = $idProfile and sck.noclosingfk ='$noclosingfk'
                   -- and sc.objectkelompoktransaksifk=60
                    and cb.carabayar ='$caraBayar'
                    GROUP BY cs.carasetor,sck.objectcarasetorfk,cb.id,
                    sck.totaldibayar, sc.totaldibayar,sck.noclosingfk, sh.noclosing,
                    sh.objectpegawaiterimafk, pg.namalengkap,sck.totaldibayar,cb.carabayar
                    --)as x GROUP BY x.caraBayar")
            );

            $result[] = array(
                'noRec' => $item->noRec,
                'caraBayar' => $item->caraBayar,
                'idCaraBayar' => $item->idCaraBayar,
                'idKelTransaksi' => $item->idKelTransaksi,
                'kelompokpasien' => $item->kelompokpasien,
                'kelTransaksi' => $item->kelTransaksi,
                'keterangan' => $item->keterangan,
                'idPegawai' => $item->idPegawai,
                'namaPenerima' => $item->namaPenerima,
                'noClosing' => $item->noClosing,
                'noSbm' => $item->noSbm,
                'tglSbm' =>$item->tglSbm,
                'noVerifikasi' => $item->noVerifikasi,
                'tglClosing' => $item->tglClosing,
                'norec_sp' => $item->norec_sp,
                'totalPenerimaan' => $item->totalPenerimaan,
                'namapasien' => $item->namapasien,
                'ruid' => $item->ruid,
                'namaruangan' => $item->namaruangan,
                'namapasien_klien' => $item->namapasien_klien,
//                'noclosingfk' => $item->noclosingfk,
                'nocm' => $item->nocm,
                'noregistrasi' => $item->noregistrasi,
                'details' => $details,
                
            );
        }

        $result = array(
            'data' => $result,
            'message' => 'inhuman',
        );
        return $this->respond($result);
    }

    public function simpanSetoranKasir(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $kdKelTrans = (int) $this->settingDataFixed('KdTransSetoranKasir',$idProfile);
        $transMsg = null;
        \DB::beginTransaction();
        try{
            $input  = $request->all();
            //var_dump($input['tglsetor']);
            $dataPegawaiUser = \DB::select(DB::raw("select pg.id,pg.namalengkap,lu.id as userId from loginuser_s as lu
                    INNER JOIN pegawai_m as pg on lu.objectpegawaifk=pg.id
                    where lu.kdprofile = $idProfile and pg.id=:idLoginUser limit 1"),
                array(
                    'idLoginUser' => $input['kdPegawai'],
                )
            );

            $UserId = 0;
            foreach ($dataPegawaiUser as $items){
                $UserId = $items->userid;
            }

            $dataruangan = \DB::table('maploginusertoruangan_s as mlu')
                ->leftjoin('ruangan_m as ru','ru.id','=','mlu.objectruanganfk')
                ->leftjoin('departemen_m as dp','dp.id','=','ru.objectdepartemenfk')
                ->select('ru.id','ru.namaruangan','ru.objectdepartemenfk')
                ->where('mlu.kdprofile', $idProfile)
                ->where('objectloginuserfk',$input['userData']['id'])
                ->get();
            if (count($dataruangan)> 0){
                $idRuangan=$dataruangan[0]->id;
            }
//            return $this->respond($UserId);
            $pegawai = Pegawai::find($input['kdPegawai']);
            $tglAwal=$input['tglAwal'];
            $tglAkhir=$input['tglAkhir'];

            $SC = new StrukClosing();
            $SC->norec  = $SC->generateNewId();
            $SC->kdprofile = $idProfile;
            $SC->statusenabled= true;
            $SC->noclosing = $this->generateCode(new StrukClosing, 'noclosing', 10, 'C-'.$this->getDateTime()->format('ym'),$idProfile);
            $SC->objectpegawaidiclosefk = $input['kdPegawai'];
            $SC->tglclosing = $input['tglsetor'];
            $SC->totaldibayar = $input['totalSetoran'];
            $SC->objectkelompoktransaksifk = $kdKelTrans;
            $SC->keteranganlainnya = "Setoran Kasir";
            $SC->tglawal = $tglAwal;
            $SC->tglakhir = $tglAkhir;
            $SC->save();
            $NorecSc = $SC->norec;

            $SH = new StrukHistori();
            $SH->norec  = $SH->generateNewId();
            $SH->nonhistori = $this->generateCode(new StrukHistori(), 'nonhistori', 14, 'SK-'.$this->getDateTime()->format('ym'),$idProfile);
            //$SH->objectbankaccountfk= $item['kdAccountBank'];
            $SH->kdprofile = $idProfile;
            $SH->statusenabled= true;
            $SH->totalsetortarikdeposit =$input['totalSetoran'];
            $SH->tglsetortarikdeposit =  $input['tglsetor'];//$this->getDateTime();
            $SH->objectpegawaitarikdepositfk = $input['kdPegawai'];
            $SH->objectpegawaiterimafk = $this->getCurrentUserID();
            $SH->objectkelompoktransaksifk = $kdKelTrans;
            $SH->noclosing = $NorecSc;//$SC->noclosing;
            // $SH->objectcarasetorfk = $item['idCaraSetor'];
            $SH->ketlainya ='Setoran Kasir';
            if(isset($idRuangan)){
                $SH->objectruanganterimafk = $idRuangan;
                $SH->objectruanganfk = $idRuangan;
            }

            $SH->nobukti = '-';
            $SH->kdperkiraan = '-';//$input['kdperkiraan'];
            $SH->namaperkiraan = 'Penerimaan Kasir ';//$input['keterangan'];
            $SH->kettransaksi = '-';// $input['keterangantransaksi'];
            $SH->save();

            /** @Save_StrukBuktiPenerimaan */
            $strukBuktiPenerimanan = new StrukBuktiPenerimaan();
            $strukBuktiPenerimanan->norec = $strukBuktiPenerimanan->generateNewId();
            $strukBuktiPenerimanan->kdprofile = $idProfile;
            $strukBuktiPenerimanan->keteranganlainnya = 'Setoran Kasir';//nama perkiraan
            $strukBuktiPenerimanan->statusenabled = 1;
            //      $strukBuktiPenerimanan->nostrukfk = $strukPelayanan->norec;
            //      $strukBuktiPenerimanan->objectkelompokpasienfk = $strukPelayanan->pasien_daftar->pasien->objectkelompokpasienfk;
            $strukBuktiPenerimanan->objectpegawaipenerimafk = $this->getCurrentLoginID();
            $strukBuktiPenerimanan->tglsbm =  $input['tglsetor'];//date('Y-m-d H:i:s');
            $strukBuktiPenerimanan->totaldibayar =  $input['totalSetoran'];//$input['totalSetoran'];
            $strukBuktiPenerimanan->objectkelompoktransaksifk = $kdKelTrans;
            $strukBuktiPenerimanan->nosbm = $this->generateCode(new StrukBuktiPenerimaan, 'nosbm', 14, 'RV-' . $this->getDateTime()->format('ym'),$idProfile);
            $strukBuktiPenerimanan->noclosingfk = $NorecSc;
            $strukBuktiPenerimanan->save();
            /** @End_Save_StrukBuktiPenerimaan */

            foreach ($input['detailSetoran'] as $item){
                $SCK = new StrukClosingKasir();
                $SCK->norec  = $SC->generateNewId();
                $SCK->noclosingfk = $NorecSc; //$SC->norec;
                $SCK->totaldibayar = $item['totalPenerimaan'];
                $SCK->totaldibayarcashin = 0;
                $SCK->totaldibayarcashout = 0;
                $SCK->totaldibayarclose = 0;
                $SCK->carabayarfk = $item['kdCaraBayar'];
                $SCK->qtystrukbuktiextclose = 0;
                $SCK->qtystrukbuktiintclose = 0;
                $SCK->objectcarasetorfk = $item['idCaraSetor'];
                $SCK->save();

                /** @Save_StrukBuktiPenerimaanCaraBayar */
                $SBPCB = new StrukBuktiPenerimaanCaraBayar();
                $SBPCB->norec = $SBPCB->generateNewId();
                $SBPCB->kdprofile = $idProfile;
                $SBPCB->statusenabled = 1;
                $SBPCB->nosbmfk = $strukBuktiPenerimanan->norec;
                $SBPCB->objectcarabayarfk = $item['kdCaraBayar'];
                if (isset($input['detailBank'])) {
                    $SBPCB->objectbankaccountfk = $input['detailBank']['id'];
                    $SBPCB->namabankprovider = $input['detailBank']['namaBank'];
                    $SBPCB->namapemilik = $input['detailBank']['namaKartu'];
                }
                $SBPCB->save();
                /** @End_Save_SStrukBuktiPenerimaanCaraBayar */
            }
            foreach ($input['detailSBM'] as $item2){
                $updateSBM = StrukBuktiPenerimaan::where('norec', $item2['norec_sbm'])//$input['kdPegawaiLu'])
                ->where('kdprofile',$idProfile)
                ->whereNull('noclosingfk')
                ->update([
                        'noclosingfk' => $NorecSc
                ]);
            }
//            $data2= StrukBuktiPenerimaan::where('objectpegawaipenerimafk', $UserId)//$input['kdPegawaiLu'])
//                ->whereNull('noclosingfk')
//                ->where('tglsbm','>=', $tglAwal)
//                ->where('tglsbm','<=', $tglAkhir)
//                ->update([
//                        'noclosingfk' => $NorecSc
//                ]);

        $transStatus = true;
        } catch(\Exception $e){
            $transStatus= false;
        }

        $transMsg = "";
        if ($transStatus == true) {
            $transMsg = 'Simpan Berhasil';
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMsg,
                "data" => $SC,
                "as" => 'as@epic',
            );
        } else {
            $transMsg = 'Simpan Gagal!!';
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMsg,
                "data" => $SC,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMsg);
    }

    public function batalSetoranKasir(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $transStatus = true;
        \DB::beginTransaction();
        $input  = $request->all();
        /** @Save_OLD */
//        $tglAwal=$input['tglAwal'];
//        $tglAkhir=$input['tglAkhir'];
//
//
//        $sbm= StrukBuktiPenerimaan::where('objectpegawaipenerimafk', $input['kdPegawaiLu'])
//            ->whereNotNull('noclosingfk')
//            ->where('tglsbm','>=', $tglAwal)
//            ->where('tglsbm','<=', $tglAkhir)
//            ->first();
//        $sc= StrukClosing::where('norec',$sbm->noclosingfk)->first();
//        $sh= StrukHistori::where('noclosing',$sc->noclosing)->first();
//        try{
//            $data3= StrukHistori::where('norec', $sh->norec)
//                ->update([
//                    'statusenabled' => 'f'
//                ]);
//        }
//        catch(\Exception $e){
//            $transStatus= false;
//            $transMsg = "Transaksi Gagal (update SBP)";
//        }
//        if($transStatus) {
//            try {
//                $data2 = StrukBuktiPenerimaan::where('objectpegawaipenerimafk', $input['kdPegawaiLu'])
//                    ->whereNotNull('noclosingfk')
//                    ->where('tglsbm', '>=', $tglAwal)
//                    ->where('tglsbm', '<=', $tglAkhir)
//                    ->update(
//                        [
//                            'noclosingfk' => null
//                        ]);
//            } catch (\Exception $e) {
//                $transStatus = false;
//                $transMsg = "Transaksi Gagal (update SBP)";
//            }
//        }
        /** @End_Save_OLD */
        try {
            foreach ($input['details'] as $item){
                $sc = StrukClosing::where('noclosing',$item['noclosing'])->where('kdprofile', $idProfile)->first();
                $sh = StrukHistori::where('noclosing', $sc->norec)
                    ->where('kdprofile', $idProfile)
                    ->update([
                        'statusenabled' => false
                    ]);
                $sbm = StrukBuktiPenerimaan::where('noclosingfk', $sc->norec)
                        ->where('kdprofile', $idProfile)
                        ->update(
                            [
                                'noclosingfk' => null
                            ]);

            }
        } catch (\Exception $e) {
                $transStatus = false;
        }
        if ($transStatus == true) {
            $transMsg = 'Batal Setor Sukses';
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMsg,
                "data" => $sh,
                "as" => 'as@epic',
            );
        } else {
            $transMsg = 'Gagal!!';
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMsg,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMsg);
    }

    public function daftarBKU(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $list =  explode ( ',',$this->settingDataFixed('KdTransaksiBendaharaPenerimaan',$idProfile));
        $kdTrans = [];
        $KdTransak = $this->settingDataFixed('KdTransaksiBendaharaPenerimaan',$idProfile);
        foreach ($list as $itemTrans){
            $kdTrans []=  (int)$itemTrans;
        }
        $dataPenerimaanBank= \DB::table('strukhistori_t as sh')
            ->join('strukclosing_t as sc', 'sc.norec', '=', 'sh.noclosing')
            ->leftjoin ('strukbuktipenerimaan_t as spp',function($join)
            {
                $join->on('spp.noclosingfk','=','sc.norec')
                    ->where('spp.keteranganlainnya', 'ilike', '%'.'Setoran'.'%');
//                $join->on('spp.keteranganlainnya','=','Setoran Kasir');
            })
//            ->leftjoin('strukbuktipenerimaan_t as spp', 'spp.noclosingfk', '=','sc.norec')
//                \DB::raw("sc.norec and spp.objectkelompoktransaksifk in (60,64,70,105,106,119,120)"))
            ->leftjoin('strukbuktipengeluaran_t as sbk', 'sbk.noclosingfk', '=', 'sc.norec')
            ->leftjoin('loginuser_s as lu', 'lu.id', '=', 'spp.objectpegawaipenerimafk')
            ->leftjoin('loginuser_s as lu2', 'lu2.id', '=', 'sbk.objectpegawaipembayarfk')
            ->leftjoin('pegawai_m as p', 'p.id', '=', 'lu.objectpegawaifk')
            ->leftjoin('pegawai_m as p2', 'p2.id', '=', 'lu2.objectpegawaifk')
            ->leftjoin('pegawai_m as psetor', 'psetor.id', '=', 'sh.objectpegawaitarikdepositfk')
            ->join('kelompoktransaksi_m as kt', 'kt.id', '=', 'sc.objectkelompoktransaksifk')
            ->join('mapbkutokelompoktransaksi_m as mbk','mbk.kelompoktransaksifk','=','kt.id')
            // ->leftjoin('strukbuktipenerimaancarabayar_t as spc', 'spc.nosbmfk', '=', 'spp.norec')
            // ->leftjoin('bankaccount_m as ba', 'ba.id', '=', 'spc.objectbankaccountfk')
            ->select('spp.norec', 'spp.tglsbm', 'spp.keteranganlainnya','spp.nosbm_intern',
                'spp.objectpegawaipenerimafk','p.namalengkap', 'kt.kelompoktransaksi','spp.nostrukfk',
                'sc.objectkelompoktransaksifk',
                'sc.norec as norec_sc',
                // 'spc.objectbankaccountfk','ba.bankaccountnama','spc.namabankprovider','spc.namapemilik',
                'sc.noclosing','sh.nonhistori','sbk.objectpegawaipembayarfk','p2.namalengkap as pegawaibayar',
                'sh.ketlainya','sh.norec as norec_sh','sh.kdperkiraan','sh.namaperkiraan','sh.kettransaksi','sh.nobukti','psetor.namalengkap as penyetor',
                DB::raw(" coalesce((spp.totaldibayar ), 0) debit ,
                     coalesce((sbk.totaldibayar ), 0) kredit ,
                    case when spp.nosbm is null then sbk.nosbk else spp.nosbm end as notransaksi,
                    cast(sh.tglsetortarikdeposit as date)as tglsetortarikdeposit"))
            ->groupBy('spp.norec','spp.tglsbm','spp.keteranganlainnya','spp.nosbm_intern','spp.objectpegawaipenerimafk','p.namalengkap',
                      'kt.kelompoktransaksi','spp.nostrukfk','sc.objectkelompoktransaksifk','sc.norec','sc.noclosing','sh.nonhistori',
                      'sbk.objectpegawaipembayarfk','p2.namalengkap','sh.ketlainya','sh.norec','sh.kdperkiraan',
                      'sh.namaperkiraan','sh.kettransaksi','sh.nobukti','psetor.namalengkap','spp.totaldibayar','sbk.totaldibayar',
                      'spp.nosbm','sbk.nosbk','sh.tglsetortarikdeposit','sc.tglclosing')
            ->orderBy('sc.tglclosing','asc')
            ->where('sh.kdprofile', $idProfile)
            ->where('sh.statusenabled',true);
//            ->whereIn('sh.objectkelompoktransaksifk',[60,64,70,105,106,119,120]);

        $filter = $request->all();
//        if($filter['noStruk']!="" && $filter['noStruk']!="undefined"){
//            $dataPenerimaanBank = $dataPenerimaanBank->where('spp.norec', $filter['noStruk']);
//        }
        if(isset( $filter['jenisTransaksi']) && $filter['jenisTransaksi']!="" && $filter['jenisTransaksi']!="undefined"){

            $dataPenerimaanBank = $dataPenerimaanBank->where('sh.objectkelompoktransaksifk', $filter['jenisTransaksi']);
        }
        if(isset( $filter['jenisTransaksiLike']) && $filter['jenisTransaksiLike']!="" && $filter['jenisTransaksiLike']!="undefined"){

            $dataPenerimaanBank = $dataPenerimaanBank->where('sh.objectkelompoktransaksifk', $filter['jenisTransaksiLike']);
        }
        if(isset( $filter['noRekening']) &&$filter['noRekening']!="" && $filter['noRekening']!="undefined"){
            $dataPenerimaanBank = $dataPenerimaanBank->where('spc.namabankprovider', $filter['noRekening']);
        }
        if(isset( $filter['tglAwal']) &&$filter['tglAwal']!=""){
            $dataPenerimaanBank = $dataPenerimaanBank->where('sh.tglsetortarikdeposit','>=', $filter['tglAwal']." 00:00:00");
        }
        if(isset( $filter['tglAkhir']) &&$filter['tglAkhir']!=""){
            $tgl= $filter['tglAkhir']." 23:59:59";
            $dataPenerimaanBank = $dataPenerimaanBank->where('sh.tglsetortarikdeposit','<=', $tgl);
        }
        if(isset( $filter['namaPerkiraan']) &&$filter['namaPerkiraan']!="" && $filter['namaPerkiraan']!="undefined"){
            $dataPenerimaanBank = $dataPenerimaanBank->where('sh.namaperkiraan', $filter['namaPerkiraan']);
        }
        if(isset( $filter['keterangan']) &&$filter['keterangan']!="" && $filter['keterangan']!="undefined"){
            $dataPenerimaanBank = $dataPenerimaanBank->where('psetor.namalengkap','ilike','%'. $filter['keterangan'].'%');
        }
        if(isset( $filter['nohitori']) &&$filter['nohitori']!="" && $filter['nohitori']!="undefined"){
            $dataPenerimaanBank = $dataPenerimaanBank->where('sh.nohitori', $filter['nohitori']);
        }
//        $dataPenerimaanBank = $dataPenerimaanBank->distinct();
        $dataPenerimaanBank = $dataPenerimaanBank->get();



        /** @Function_ Ambil Saldo Satu Bulan Sebelum */
        $explode =  explode("-", $filter['tglAwal']);
        $arr1 = $explode[0];
        $arr2 = $explode[1];
        if ($arr2 == 1){
            $arr2 = $explode[1];
        }else{
            $arr2 = $explode[1] - 1 ; //bulan kurangi 1
        }
        $arr3 = '01'; //ambil tgl 1
        $arr2 = str_pad($arr2, 2, '0', STR_PAD_LEFT);
//        $arrayExplode = array($arr1,$arr2,$arr3);
//        $tglMinSabulan = implode("-", $arrayExplode);
        $tglMinSabulan = $arr1 . '-' . $arr2 . '-' . $arr3;
        /** @End_Function */

        $tglAwal= $filter['tglAwal'];
        $dataSaldo= DB::select(DB::raw(" select sh.tglsetortarikdeposit,
                     coalesce((spp.totaldibayar ), 0) debit ,
                     coalesce((sbk.totaldibayar ), 0) kredit           
                     from strukhistori_t as sh
                     inner join strukclosing_t as sc on sc.norec = sh.noclosing 
                     left join strukbuktipenerimaan_t as spp on spp.noclosingfk = sc.norec
                     left join strukbuktipengeluaran_t as sbk on sbk.noclosingfk = sc.norec
                     inner join kelompoktransaksi_m as kt on kt.id = sc.objectkelompoktransaksifk
                     inner join mapbkutokelompoktransaksi_m as mbk on mbk.kelompoktransaksifk = kt.id
                     where sh.kdprofile = $idProfile and sh.tglsetortarikdeposit > '$tglMinSabulan' and sh.tglsetortarikdeposit < '$tglAwal'
                       and sh.statusenabled=true
                       and sh.objectkelompoktransaksifk in ($KdTransak)
                     order by sh.nonhistori asc"));
        $saldolama=0;
        $jmlSaldoLama=0;
        $saldo=0;
        if (count($dataSaldo) > 0) {
            foreach ($dataSaldo as $dataSaldoLama) {
                if ($dataSaldoLama->debit == 0) {
                    $saldolama = $saldolama + (float)$dataSaldoLama->debit - (float)$dataSaldoLama->kredit;
                } else {
                    $saldolama = $saldolama + (float)$dataSaldoLama->debit;
                }
                $jmlSaldoLama = $saldolama;
            }
            $saldo=$jmlSaldoLama;
        }

        $result = array();
        $jumlahD = 0;
        $jumlahK = 0;
        $saldoAkhir = 0;

        foreach ($dataPenerimaanBank as $dataPenerimaan){
            /** @Function_ Non TUNAI Ambil */
            $norec = $dataPenerimaan->norec_sc;
            $dataPenerimaan->nontunai = 0;
            $SBMC = DB::select(DB::raw("
                 select  spc.noclosingfk,spc.carabayarfk,cb.carabayar,
                 coalesce((spc.totaldibayar ), 0) totaldibayar
                 from strukclosingkasir_t as spc 
                 join carabayar_m as cb on cb.id = spc.carabayarfk
                 where spc.kdprofile = $idProfile and spc.noclosingfk ='$norec'
            "));

            if(count($SBMC) > 0){
                $tunai = 0;
                $nonTunai = 0;
                foreach ($SBMC as $itemSbmc){
                    if($itemSbmc->carabayarfk == "1") {//TUNAI
                        $tunai = $tunai + (float) $itemSbmc->totaldibayar;
                    }else{
                        $nonTunai =$nonTunai +  (float)$itemSbmc->totaldibayar ;
                    }
                }

                $dataPenerimaan->debit = $tunai;
                $dataPenerimaan->nontunai =$nonTunai;
            }
            /** @End_Function */
            if ($dataPenerimaan->debit == 0) {
                $saldo = $saldo + (float)$dataPenerimaan->debit - (float)$dataPenerimaan->kredit;
            } else {
                $saldo = $saldo + (float)$dataPenerimaan->debit;
            }
            $jumlahD = $jumlahD + (float)$dataPenerimaan->debit;
            $jumlahK = $jumlahK +  (float)$dataPenerimaan->kredit;
            $saldoAkhir = $saldo;
//            if ($dataPenerimaan->nostrukfk != null){
//                $status = 'Sudah Di Kompensasi';
//            }else{
//                $status = '-';
//            }
            $result[] = array(
                'norec_sh'  =>$dataPenerimaan->norec_sh,
                'noStruk'  =>$dataPenerimaan->norec,
                'tglStruk'  =>$dataPenerimaan->tglsetortarikdeposit,
                'keterangan'  =>$dataPenerimaan->ketlainya,
                'jenisTransaksi'  =>$dataPenerimaan->kelompoktransaksi,
                'idJenisTransaksi'  =>$dataPenerimaan->objectkelompoktransaksifk,
                'kredit'  =>(float) $dataPenerimaan->kredit,
                'debit'  => (float)$dataPenerimaan->debit,
                'saldo'  => $saldo,
                'nontunai'  => $dataPenerimaan->nontunai,
//                'idPegawai'  =>@$login_user->objectpegawaifk,
//                'namaPegawai' => @$login_user->pegawai->namalengkap,
//                'status' => $status,
//                'idPegawai'  =>@$dataPenerimaan->objectpegawaipenerimafk,
//                'namaPegawai' => @$dataPenerimaan->namalengkap,
//                'nostrukfk' => $dataPenerimaan->nostrukfk,
                // 'objectbankaccountfk' => $dataPenerimaan->objectbankaccountfk,
                // 'bankaccountnama' => $dataPenerimaan->bankaccountnama,
                // 'namabankprovider' => $dataPenerimaan->namabankprovider,
                // 'namapemilik' => $dataPenerimaan->namapemilik,
                'nohistori' => $dataPenerimaan->nonhistori,
//                'noclosing' => $dataPenerimaan->noclosing,
                'notransaksi' => $dataPenerimaan->notransaksi,
//                'kdmataanggaran' =>$dataPenerimaan->kdchildkeempat,
//                'mataanggaran' =>$dataPenerimaan->mataanggaran,
                'nobukti' =>$dataPenerimaan->nobukti,
                'kdperkiraan' =>$dataPenerimaan->kdperkiraan,
                'namaperkiraan' =>$dataPenerimaan->namaperkiraan,
                'kettransaksi' =>$dataPenerimaan->kettransaksi,
                'penyetor'=>$dataPenerimaan->penyetor

            );
        }
        $uhman = array(
            'data' =>  $result,
            'saldolama' =>  $jmlSaldoLama,
            'dataawal' => $dataSaldo,
            'jumlahD' => $jumlahD,
            'jumlahK' => $jumlahK,
            'saldoAkhir' => $saldoAkhir,
            'message' => "@Uhman"
        );
        return $this->respond($uhman);
    }

    public function simpanBKU(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        \DB::beginTransaction();
        $input = $request->all();
        $nohistori = '';
        $idRuangan=0;
        $transStatus=true;
        try {
            $dataruangan = \DB::table('maploginusertoruangan_s as mlu')
                ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'mlu.objectruanganfk')
                ->leftjoin('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
                ->select('ru.id', 'ru.namaruangan', 'ru.objectdepartemenfk')
                ->where('mlu.kdprofile', $idProfile)
                ->where('objectloginuserfk', $input['userData']['id'])
                ->get();
            if (count($dataruangan) == 0) {
                $idRuangan = 0;
            } else {
                $idRuangan = $dataruangan[0]->id;//471
            }

            $SC = new StrukClosing();
            $SC->norec = $SC->generateNewId();
            $SC->kdprofile = $idProfile;
            $SC->noclosing = $this->generateCode(new StrukClosing, 'noclosing', 10, 'C-' . $this->getDateTime()->format('ym'), $idProfile);
            $SC->objectpegawaidiclosefk = $this->getCurrentUserID();
            $SC->totaldibayar = $input['totalSetor'];
            $SC->objectkelompoktransaksifk = $input['jenisTransaksi'];

            if ($input['penerimaan'] == true) {
                $SC->keteranganlainnya = "PENERIMAAN BKU";
            } else {
                $SC->keteranganlainnya = "PENGELUARAN BKU";
            }
            $SC->tglawal = $this->getDateTime()->format('Y-m-d H:i:s');
            $SC->tglakhir = $this->getDateTime()->format('Y-m-d H:i:s');
            $SC->tglclosing = $this->getDateTime()->format('Y-m-d H:i:s');;//$input['tglbku'];
            $SC->save();
            $norec_sc = $SC->norec;
            $noclosing_SC = $SC->noclosing;

            $SH = new StrukHistori();
            $SH->norec = $SH->generateNewId();
            $nohistori = $this->generateCode(new StrukHistori(), 'nonhistori', 14, 'BKU-' . $this->getDateTime()->format('ym'), $idProfile);
            $SH->nonhistori = $nohistori;
            $SH->kdprofile = $idProfile;
            $SH->statusenabled = true;
            $SH->totalsetortarikdeposit = $input['totalSetor'];
            $SH->tglsetortarikdeposit = $input['tglbku'];// $this->getDateTime();
            $SH->objectpegawaitarikdepositfk = $this->getCurrentUserID();
            $SH->objectpegawaiterimafk = $this->getCurrentUserID();
            $SH->objectruanganterimafk = $idRuangan;
            $SH->objectruanganfk = $idRuangan;
            $SH->objectkelompoktransaksifk = $input['jenisTransaksi'];
            $SH->noclosing = $norec_sc;//$SC->noclosing;
            $SH->ketlainya = $input['keterangan'];
            $SH->nobukti = $input['nobukti'];
            $SH->kdperkiraan = $input['kdperkiraan'];
            $SH->namaperkiraan = $input['keterangan'];
            $SH->kettransaksi = $input['keterangantransaksi'];
            $SH->objectasalprodukhasilfk = $input['sumberdana'];
            $SH->save();

            if ($input['penerimaan'] == true) {
                $strukBuktiPenerimanan = new StrukBuktiPenerimaan();
                $strukBuktiPenerimanan->norec = $strukBuktiPenerimanan->generateNewId();
                $strukBuktiPenerimanan->kdprofile = $idProfile;
                $strukBuktiPenerimanan->keteranganlainnya = 'Setoran';//$input['keterangan'];
                $strukBuktiPenerimanan->statusenabled = 1;
                $strukBuktiPenerimanan->objectpegawaipenerimafk = $this->getCurrentLoginID();
                $strukBuktiPenerimanan->tglsbm = $input['tglbku'];//$this->getDateTime();
                $strukBuktiPenerimanan->totaldibayar = $input['totalSetor'];
                $strukBuktiPenerimanan->objectkelompoktransaksifk = $input['jenisTransaksi'];
                $strukBuktiPenerimanan->nosbm = $this->generateCode(new StrukBuktiPenerimaan, 'nosbm', 14, 'RV-' . $this->getDateTime()->format('ym'), $idProfile);
                $strukBuktiPenerimanan->noclosingfk = $norec_sc;//$SC->norec;
                $strukBuktiPenerimanan->asalprodukfk = $input['sumberdana'];
                $strukBuktiPenerimanan->save();

                $SBPCB = new StrukBuktiPenerimaanCaraBayar();
                $SBPCB->norec = $SBPCB->generateNewId();
                $SBPCB->kdprofile = $idProfile;
                $SBPCB->statusenabled = 1;
                $SBPCB->nosbmfk = $strukBuktiPenerimanan->norec;
                $SBPCB->objectcarabayarfk = $input['caraBayar'];
                if ($input['detailBank'] != 'KOSONG') {
                    $SBPCB->objectbankaccountfk = $input['detailBank']['id'];
                    $SBPCB->namabankprovider = $input['detailBank']['namaBank'];
                    $SBPCB->namapemilik = $input['detailBank']['namaKartu'];
                }
                $SBPCB->save();

            } else {

                $SBK = new StrukBuktiPengeluaran();
                $SBK->norec = $SBK->generateNewId();
                $SBK->kdprofile = $idProfile;
                $SBK->keteranganlainnya = $input['keterangan'];
                $SBK->statusenabled = 1;
                $SBK->objectpegawaipembayarfk = $this->getCurrentLoginID();
                $SBK->tglsbk = $input['tglbku'];// $this->getDateTime();
                $SBK->totaldibayar = $input['totalSetor'];
                $SBK->objectkelompoktransaksifk = $input['jenisTransaksi'];
                $SBK->nosbk = $this->generateCode(new StrukBuktiPengeluaran(), 'nosbk', 14, 'PV-' . $this->getDateTime()->format('ym'), $idProfile);
                $SBK->noclosingfk = $SC->norec;
                $SBK->asalprodukfk = $input['sumberdana'];
                $SBK->save();
            }

        $transStatus = true;
        } catch(\Exception $e){
            $transStatus = false;
            $this->transMessage = "Simpan Pembayaran Bank Gagal";
        }

        if($transStatus){
            $transMessage = "Simpan Sukses";
            $result = array(
                "status" => 201,
                "message"  => $transMessage,
                "nohistori" => $nohistori,
                "as" => 'uhman',
            );
            DB::commit();
        }else{
            $transMessage = "Simpan Gagal";
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
//                "nohistori" => $nohistori,
                "as" => 'uhman',
            );
            DB::rollBack();
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveTempBukuKasUmum(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        \DB::beginTransaction();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->join('pegawai_m as pg','pg.id','=','lu.objectpegawaifk')
            ->select('lu.objectpegawaifk','pg.namalengkap')
            ->where('lu.id',$request['userData']['id'])
            ->first();
        try {
            $idbukukasumum = $this->generateCode(new TempBukuKasUmum(),
                'idbukukasumum',14,'IB-'.$this->getDateTime()->format('ym'), $idProfile);
            foreach ($request['tempbku']['data'] as $item) {
                $newBKU = new TempBukuKasUmum();
                $newBKU->kdprofile = $idProfile;
                $newBKU->norec = $newBKU->generateNewId();;
                $newBKU->nostrukhistorifk = $item['norec_sh'];
                $newBKU->kelompoktransaksifk = $item['idJenisTransaksi'];
                $newBKU->pegawaifk = $dataPegawai->objectpegawaifk; //$item['idPegawai'];
                $newBKU->kdperkiraan = $item['kdperkiraan'];
                $newBKU->namaperkiraan = $item['namaperkiraan'];
                $newBKU->kettransaksi = $item['kettransaksi'];
                $newBKU->namapenerima = $dataPegawai->namalengkap;//$item['namaPegawai'];
//                $newBKU->namabankprovider = $item['namabankprovider'];
//                $newBKU->namapemilikrekening = $item['namapemilik'];
                $newBKU->nobukti = $item['nobukti'];
                $newBKU->nohistori = $item['nohistori'];
                $newBKU->nosbm = $item['notransaksi'];
//                $newBKU->objectbankaccountfk = $item['objectbankaccountfk'];
                $newBKU->debit = $item['debit'];
                $newBKU->kredit = $item['kredit'];
                $newBKU->saldo = $item['saldo'];
                $newBKU->tglpenerimaan = $item['tglStruk'];
                $newBKU->idbukukasumum = $idbukukasumum;
                $newBKU->saldoawal = $request['saldoawal'];
                $newBKU->saldoakhir = $request['saldoakhir'];
                $newBKU->save();
            }

            $transStatus = 'true';
            $transMessage = "Simpan Temp Buku Kas Umum";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Gagal Simpan Temp Buku Kas Umum";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "data" => $newBKU,
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "data" => $newBKU,
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveBeritaAcara(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        \DB::beginTransaction();
        try {
            $id = $this->generateCode(new TempBeritaAcaraKasBank(),
                'idtempberita',14,'KB-'.$this->getDateTime()->format('ym'),$idProfile);
            foreach ($request['tempdata'] as $item) {
                $newBKU = new TempBeritaAcaraKasBank();
                $newBKU->norec = $newBKU->generateNewId();
                $newBKU->kdprofile = $idProfile;
                $newBKU->jenis = $item['jenis'];
                $newBKU->penerimaan = $item['penerimaan'];
                $newBKU->pengeluaran = $item['pengeluaran'];
                $newBKU->jumlah = $item['jumlah'];
                $newBKU->saldoawal = $item['saldoawal'];
                $newBKU->saldoakhir = $item['saldoakhir'];
                $newBKU->idtempberita = $id;
                $newBKU->save();
            }
            $transStatus = 'true';
            $transMessage = "Simpan";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Gagal";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "data" => $newBKU,
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "data" => $newBKU,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result);
    }

    public function getTrialBalanceBendahara(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $kdListAKun = $this->settingDataFixed('KdAkunBendPenerimaan',$idProfile);
        $req=$request->all();
        $result = [];
        $aingMacan = \DB::select(DB::raw("select coa.id,coa.noaccount,coa.namaaccount,sum(pjd.hargasatuand) as debet,
                sum(pjd.hargasatuank) as kredit
                from chartofaccount_m as coa
                left JOIN postingjurnald_t as pjd on coa.id=pjd.objectaccountfk
                left JOIN postingjurnal_t as pj on pjd.norecrelated=pj.norec
                where coa.kdprofile = $idProfile and tglbuktitransaksi between :tglAwal and :tglAkhir and coa.statusenabled = true
                and pjd.objectaccountfk in ($kdListAKun) 
                group by coa.id,coa.noaccount,coa.namaaccount
                order by coa.noaccount;
            "),
            array(
                'tglAwal' => $request['tglAwal'] ,
                'tglAkhir' => $request['tglAkhir'] ,
            )
        );
//        return $this->respond($aingMacan);
        $mydate = $request['tglAwal'];
        $daystosum = '1';

        $datesum = date('d-m-Y', strtotime($mydate.' - '.$daystosum.' months'));
        $data = date('Ym', strtotime($datesum));
        $strData = (string)$data;

        $dataCoa = DB::select(DB::raw("
                select coa.id,coa.noaccount,coa.namaaccount,psa.ym,
                case when psa.hargasatuand is null then 0 else psa.hargasatuand end as debet,
                case when psa.hargasatuank is null then 0 else psa.hargasatuank end as kredit
                from chartofaccount_m as coa
                left JOIN (select * from postingsaldoawal_t where statusenabled=1 and ym = '$strData') as psa  on psa.objectaccountfk=coa.id
                where coa.kdprofile = $idProfile and coa.namaexternal='2018-03-01' and coa.statusenabled=true
                  and coa.id in ($kdListAKun) 
            ")
        );
//        return $this->respond($dataCoa);
        $sama=false;
        foreach ($dataCoa as $coa){
            $sama=false;
            if ($coa->ym == (string)$data) {
                $debetAwal = $coa->debet;
                $kreditAwal = $coa->kredit;
            }else{
                $debetAwal = 0;
                $kreditAwal = 0;
            }


            foreach ($aingMacan as $item) {
                $sama = false;
                if ($item->id == $coa->id) {
                    $debetMutasi = $item->debet;
                    $kreditMutasi = $item->kredit;
                    $result[] = array(
                        'idaccount' => $coa->id,
                        'noaccount' => $item->noaccount,
                        'namaaccount' => $item->namaaccount,
                        'debetAwal' => $debetAwal,
                        'kreditAwal' => $kreditAwal,
                        'debetMutasi' => $debetMutasi,
                        'kreditMutasi' => $kreditMutasi,
                    );
                    $sama = true;
                    break;
                }
            }

            if ($sama == false) {
                $result[] = array(
                    'idaccount' => $coa->id,
                    'noaccount' => $coa->noaccount,
                    'namaaccount' => $coa->namaaccount,
                    'debetAwal' => $debetAwal,
                    'kreditAwal' => $kreditAwal,
                    'debetMutasi' => 0,
                    'kreditMutasi' => 0,
                    'by' => 'as@epic'
                );
            }
        }

        return $this->respond($result);
    }

    public function saveTempLampiranBA(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        \DB::beginTransaction();
        try {
            $id = $this->generateCode(new TempLampiranBeritaAcaraKasBank(),
                'idtemplampiran',14,'KB-'.$this->getDateTime()->format('ym'), $idProfile);

            $item =$request['tempdata'] ;
            $newBKU = new TempLampiranBeritaAcaraKasBank();
            $newBKU->norec = $newBKU->generateNewId();
            $newBKU->kdprofile = $idProfile;
            $newBKU->idtemplampiran = $id;
            $newBKU->pecahan100k = $item['pecahan100k'];
            $newBKU->pecahan50k = $item['pecahan50k'];
            $newBKU->pecahan20k = $item['pecahan20k'];
            $newBKU->pecahan10k = $item['pecahan10k'];
            $newBKU->pecahan5k = $item['pecahan5k'];
            $newBKU->pecahan2k = $item['pecahan2k'];
            $newBKU->pecahan1k = $item['pecahan1k'];
            $newBKU->pecahan500 = $item['pecahan500'];
            $newBKU->pecahan200 = $item['pecahan200'];
            $newBKU->pecahan100 = $item['pecahan100'];
            $newBKU->bribank = $item['bribank'];
            $newBKU->depositobank = $item['depositobank'];
            $newBKU->terbilangbank = $item['terbilangbank'];
            $newBKU->save();

            $transStatus = 'true';
            $transMessage = "Simpan";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Gagal";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "data" => $newBKU,
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "data" => $newBKU,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result);
    }

    public function hapusBKU(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        \DB::beginTransaction();
        try{

            if($request['norec_struk_histori'] != '') {
                $sH = StrukHistori::where('norec', $request['norec_struk_histori'])->where('kdprofile',$idProfile)->first();

                $strukClosing = StrukClosing::where('noclosing',$sH->noclosing)->where('kdprofile',$idProfile)->first();
                $sbm = StrukBuktiPenerimaan::where('noclosingfk',$strukClosing['norec'])
                    ->where('kdprofile',$idProfile)
                    ->where('keteranganlainnya','<>','Setoran Kasir')
                    ->where('statusenabled',true)
                    ->update([ 'noclosingfk' => null ]);
                $disableSH = StrukHistori::where('norec', $request['norec_struk_histori'])
                    ->where('kdprofile',$idProfile)
                    ->update([
//                        'statusenabled' => false,
                          'statusenabled' => 0,
                    ]
                );

            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "update status enabled";
        }

        if ($transStatus == 'true') {
            $transMessage = "Hapus Berhasil";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'inhuman',
            );
        } else {
            $transMessage = "Hapus Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDataRekapitulasiPendapatanDaerah(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];

        $data = \DB::select(DB::raw("
            SELECT x.id,x.lingkuppelayanan, sum(x.tunai) as tunai,
            sum(x.bpjs) as bpjs, sum(x.kabbogor) as kabbogor,  sum(x.kotbogor) as kotbogor,  sum(x.kotdepok) as kotdepok  
            FROM (
            SELECT 1 AS id,'Pelayanan Instalasi Rawat Jalan' AS lingkuppelayanan,
            CASE WHEN pt.objectkelompokpasienlastfk = 1 THEN pp.hargajual ELSE 0 END AS tunai,
            CASE WHEN pt.objectkelompokpasienlastfk = 2 THEN pp.hargajual ELSE 0 END AS bpjs,
            CASE WHEN pt.objectrekananfk = 581159 THEN pp.hargajual ELSE 0 END AS kabbogor,
            CASE WHEN pt.objectrekananfk = 11817 THEN pp.hargajual ELSE 0 END AS kotbogor,
            CASE WHEN pt.objectrekananfk = 581160 THEN pp.hargajual ELSE 0 END AS kotdepok
            FROM antrianpasiendiperiksa_t AS apd
            INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
            LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
            inner join pasiendaftar_t pt on pt.norec = apd.noregistrasifk
            WHERE apd.kdprofile = $kdProfile AND apd.statusenabled = true and pp.strukresepfk IS NULL
            AND ru.objectdepartemenfk = 18 AND ru.id not in (12,701,692)
            AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
            AND pp.statusenabled = true
            
            UNION ALL
            
            SELECT 2 AS id,'Pelayanan Instalasi Gawat Darurat' AS lingkuppelayanan,
            CASE WHEN   pt.objectkelompokpasienlastfk = 1 THEN pp.hargajual ELSE 0 END AS tunai,
            CASE WHEN   pt.objectkelompokpasienlastfk = 2 THEN pp.hargajual ELSE 0 END AS bpjs,
            CASE WHEN   pt.objectrekananfk = 581159 THEN pp.hargajual ELSE 0 END AS kabbogor,
            CASE WHEN   pt.objectrekananfk = 11817 THEN pp.hargajual ELSE 0 END AS kotbogor,
            CASE WHEN   pt.objectrekananfk = 581160 THEN pp.hargajual ELSE 0 END AS kotdepok
            FROM antrianpasiendiperiksa_t AS apd
            INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
            LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
            inner join pasiendaftar_t pt on pt.norec = apd.noregistrasifk
            WHERE apd.kdprofile = $kdProfile AND apd.statusenabled = true and pp.strukresepfk IS NULL
            AND   ru.objectdepartemenfk = 24
            AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
            AND pp.statusenabled = true
            
            UNION ALL
            
            SELECT 3 AS id,'Pelayanan Instalasi Rawat Inap' AS lingkuppelayanan,
            CASE WHEN   pt.objectkelompokpasienlastfk = 1 THEN pp.hargajual ELSE 0 END AS tunai,
            CASE WHEN   pt.objectkelompokpasienlastfk = 2 THEN pp.hargajual ELSE 0 END AS bpjs,
            CASE WHEN   pt.objectrekananfk = 581159 THEN pp.hargajual ELSE 0 END AS kabbogor,
            CASE WHEN   pt.objectrekananfk = 11817 THEN pp.hargajual ELSE 0 END AS kotbogor,
            CASE WHEN   pt.objectrekananfk = 581160 THEN pp.hargajual ELSE 0 END AS kotdepok
            FROM antrianpasiendiperiksa_t AS apd
            INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
            LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
            inner join pasiendaftar_t pt on pt.norec = apd.noregistrasifk
            WHERE apd.kdprofile = $kdProfile AND apd.statusenabled = true and pp.strukresepfk IS NULL
            AND   ru.objectdepartemenfk = 16 and ru.id not in (731,732,721,720,740,739)
            AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
            AND pp.statusenabled = true
            
            UNION ALL
            
            SELECT 4 AS id,'Pelayanan Instalasi Intensif' AS lingkuppelayanan,
            CASE WHEN   pt.objectkelompokpasienlastfk = 1 THEN pp.hargajual ELSE 0 END AS tunai,
            CASE WHEN   pt.objectkelompokpasienlastfk = 2 THEN pp.hargajual ELSE 0 END AS bpjs,
            CASE WHEN   pt.objectrekananfk = 581159 THEN pp.hargajual ELSE 0 END AS kabbogor,
            CASE WHEN   pt.objectrekananfk = 11817 THEN pp.hargajual ELSE 0 END AS kotbogor,
            CASE WHEN   pt.objectrekananfk = 581160 THEN pp.hargajual ELSE 0 END AS kotdepok
            FROM antrianpasiendiperiksa_t AS apd
            INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
            LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
            inner join pasiendaftar_t pt on pt.norec = apd.noregistrasifk
            WHERE apd.kdprofile = $kdProfile AND apd.statusenabled = true and pp.strukresepfk IS NULL
            AND   ru.objectdepartemenfk = 16 and ru.id in (731,732,721,720,740,739)
            AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
            AND pp.statusenabled = true
            
            UNION ALL
            
            SELECT 5 AS id,'Pelayanan Instalasi Laboratorium' AS lingkuppelayanan,
            CASE WHEN   pt.objectkelompokpasienlastfk = 1 THEN pp.hargajual ELSE 0 END AS tunai,
            CASE WHEN   pt.objectkelompokpasienlastfk = 2 THEN pp.hargajual ELSE 0 END AS bpjs,
            CASE WHEN   pt.objectrekananfk = 581159 THEN pp.hargajual ELSE 0 END AS kabbogor,
            CASE WHEN   pt.objectrekananfk = 11817 THEN pp.hargajual ELSE 0 END AS kotbogor,
            CASE WHEN   pt.objectrekananfk = 581160 THEN pp.hargajual ELSE 0 END AS kotdepok
            FROM antrianpasiendiperiksa_t AS apd
            INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
            LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
            inner join pasiendaftar_t pt on pt.norec = apd.noregistrasifk
            WHERE apd.kdprofile = $kdProfile AND apd.statusenabled = true and pp.strukresepfk IS NULL
            AND   ru.objectdepartemenfk = 3 and ru.id not in (41)
            AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
            AND pp.statusenabled = true
            
            UNION ALL
            
            SELECT 6 AS id,'Pelayanan Instalasi Radiologi' AS lingkuppelayanan,
            CASE WHEN   pt.objectkelompokpasienlastfk = 1 THEN pp.hargajual ELSE 0 END AS tunai,
            CASE WHEN   pt.objectkelompokpasienlastfk = 2 THEN pp.hargajual ELSE 0 END AS bpjs,
            CASE WHEN   pt.objectrekananfk = 581159 THEN pp.hargajual ELSE 0 END AS kabbogor,
            CASE WHEN   pt.objectrekananfk = 11817 THEN pp.hargajual ELSE 0 END AS kotbogor,
            CASE WHEN   pt.objectrekananfk = 581160 THEN pp.hargajual ELSE 0 END AS kotdepok
            FROM antrianpasiendiperiksa_t AS apd
            INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
            LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
            inner join pasiendaftar_t pt on pt.norec = apd.noregistrasifk
            WHERE apd.kdprofile = $kdProfile AND apd.statusenabled = true and pp.strukresepfk IS NULL
            AND   ru.objectdepartemenfk = 27
            AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
            AND pp.statusenabled = true
            
            UNION ALL
            
            SELECT 7 AS id,'Pelayanan Instalasi Rehabilitas Medik' AS lingkuppelayanan,
            CASE WHEN   pt.objectkelompokpasienlastfk = 1 THEN pp.hargajual ELSE 0 END AS tunai,
            CASE WHEN   pt.objectkelompokpasienlastfk = 2 THEN pp.hargajual ELSE 0 END AS bpjs,
            CASE WHEN   pt.objectrekananfk = 581159 THEN pp.hargajual ELSE 0 END AS kabbogor,
            CASE WHEN   pt.objectrekananfk = 11817 THEN pp.hargajual ELSE 0 END AS kotbogor,
            CASE WHEN   pt.objectrekananfk = 581160 THEN pp.hargajual ELSE 0 END AS kotdepok
            FROM antrianpasiendiperiksa_t AS apd
            INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
            LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
            inner join pasiendaftar_t pt on pt.norec = apd.noregistrasifk
            WHERE apd.kdprofile = $kdProfile AND apd.statusenabled = true and pp.strukresepfk IS NULL
            AND   ru.objectdepartemenfk in (18,28) AND ru.id in (701,692,577)
            AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
            AND pp.statusenabled = true
            
            UNION ALL
            
            SELECT 8 AS id,'Pelayanan Instalasi Bedah Sentral' AS lingkuppelayanan,
            CASE WHEN   pt.objectkelompokpasienlastfk = 1 THEN pp.hargajual ELSE 0 END AS tunai,
            CASE WHEN   pt.objectkelompokpasienlastfk = 2 THEN pp.hargajual ELSE 0 END AS bpjs,
            CASE WHEN   pt.objectrekananfk = 581159 THEN pp.hargajual ELSE 0 END AS kabbogor,
            CASE WHEN   pt.objectrekananfk = 11817 THEN pp.hargajual ELSE 0 END AS kotbogor,
            CASE WHEN   pt.objectrekananfk = 581160 THEN pp.hargajual ELSE 0 END AS kotdepok
            FROM antrianpasiendiperiksa_t AS apd
            INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
            LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
            inner join pasiendaftar_t pt on pt.norec = apd.noregistrasifk
            WHERE apd.kdprofile = $kdProfile AND apd.statusenabled = true and pp.strukresepfk IS NULL
            AND   ru.objectdepartemenfk = 25
            AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
            AND pp.statusenabled = true
            
            UNION ALL
            
            SELECT 10 AS id,'Pelayanan Hemodialisa' AS lingkuppelayanan,
            CASE WHEN   pt.objectkelompokpasienlastfk = 1 THEN pp.hargajual ELSE 0 END AS tunai,
            CASE WHEN   pt.objectkelompokpasienlastfk = 2 THEN pp.hargajual ELSE 0 END AS bpjs,
            CASE WHEN   pt.objectrekananfk = 581159 THEN pp.hargajual ELSE 0 END AS kabbogor,
            CASE WHEN   pt.objectrekananfk = 11817 THEN pp.hargajual ELSE 0 END AS kotbogor,
            CASE WHEN   pt.objectrekananfk = 581160 THEN pp.hargajual ELSE 0 END AS kotdepok
            FROM antrianpasiendiperiksa_t AS apd
            INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
            LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
            inner join pasiendaftar_t pt on pt.norec = apd.noregistrasifk
            WHERE apd.kdprofile = $kdProfile AND apd.statusenabled = true and pp.strukresepfk IS NULL
            AND   ru.id = 12
            AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
            AND pp.statusenabled = true
            
            UNION ALL
            
            SELECT lp.id,lp.lingkuppelayanan,
            CASE WHEN   pt.objectkelompokpasienlastfk = 1 THEN pp.hargajual ELSE 0 END AS tunai,
            CASE WHEN   pt.objectkelompokpasienlastfk = 2 THEN pp.hargajual ELSE 0 END AS bpjs,
            CASE WHEN   pt.objectrekananfk = 581159 THEN pp.hargajual ELSE 0 END AS kabbogor,
            CASE WHEN   pt.objectrekananfk = 11817 THEN pp.hargajual ELSE 0 END AS kotbogor,
            CASE WHEN   pt.objectrekananfk = 581160 THEN pp.hargajual ELSE 0 END AS kotdepok
            FROM antrianpasiendiperiksa_t AS apd
            INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
            LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
            inner join pasiendaftar_t pt on pt.norec = apd.noregistrasifk
            LEFT JOIN maplaporankeuangantolingkuppelayanan_m AS mlk ON mlk.produkfk=pp.produkfk
            LEFT JOIN lingkuppelayanan_m AS lp ON lp.id = mlk.lingkuppelayananfk
            WHERE apd.kdprofile = $kdProfile AND apd.statusenabled = true and pp.strukresepfk IS NULL
            AND   lp.id = 11
            AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
            AND pp.statusenabled = true
            
            UNION ALL
            
            SELECT lp.id,lp.lingkuppelayanan,
            CASE WHEN   pt.objectkelompokpasienlastfk = 1 THEN pp.hargajual ELSE 0 END AS tunai,
            CASE WHEN   pt.objectkelompokpasienlastfk = 2 THEN pp.hargajual ELSE 0 END AS bpjs,
            CASE WHEN   pt.objectrekananfk = 581159 THEN pp.hargajual ELSE 0 END AS kabbogor,
            CASE WHEN   pt.objectrekananfk = 11817 THEN pp.hargajual ELSE 0 END AS kotbogor,
            CASE WHEN   pt.objectrekananfk = 581160 THEN pp.hargajual ELSE 0 END AS kotdepok
            FROM antrianpasiendiperiksa_t AS apd
            INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
            LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
            inner join pasiendaftar_t pt on pt.norec = apd.noregistrasifk
            LEFT JOIN maplaporankeuangantolingkuppelayanan_m AS mlk ON mlk.produkfk=pp.produkfk
            LEFT JOIN lingkuppelayanan_m AS lp ON lp.id = mlk.lingkuppelayananfk
            WHERE apd.kdprofile = $kdProfile AND apd.statusenabled = true and pp.strukresepfk IS NULL
            AND   lp.id = 12
            AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
            AND pp.statusenabled = true
            
            UNION ALL
            
            SELECT 13 AS id,'Pelayanan Bank Darah' AS lingkuppelayanan,
            CASE WHEN   pt.objectkelompokpasienlastfk = 1 THEN pp.hargajual ELSE 0 END AS tunai,
            CASE WHEN   pt.objectkelompokpasienlastfk = 2 THEN pp.hargajual ELSE 0 END AS bpjs,
            CASE WHEN   pt.objectrekananfk = 581159 THEN pp.hargajual ELSE 0 END AS kabbogor,
            CASE WHEN   pt.objectrekananfk = 11817 THEN pp.hargajual ELSE 0 END AS kotbogor,
            CASE WHEN   pt.objectrekananfk = 581160 THEN pp.hargajual ELSE 0 END AS kotdepok
            FROM antrianpasiendiperiksa_t AS apd
            INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
            LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
            inner join pasiendaftar_t pt on pt.norec = apd.noregistrasifk
            WHERE apd.kdprofile = $kdProfile AND apd.statusenabled = true and pp.strukresepfk IS NULL
            AND   ru.objectdepartemenfk = 3 and ru.id in (41)
            AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
            AND pp.statusenabled = true
            
            UNION ALL
            
            SELECT 14 AS id,'Pelayanan Farmasi' AS lingkuppelayanan,
            CASE WHEN   pt.objectkelompokpasienlastfk = 1 THEN pp.hargajual ELSE 0 END AS tunai,
            CASE WHEN   pt.objectkelompokpasienlastfk = 2 THEN pp.hargajual ELSE 0 END AS bpjs,
            CASE WHEN   pt.objectrekananfk = 581159 THEN pp.hargajual ELSE 0 END AS kabbogor,
            CASE WHEN   pt.objectrekananfk = 11817 THEN pp.hargajual ELSE 0 END AS kotbogor,
            CASE WHEN   pt.objectrekananfk = 581160 THEN pp.hargajual ELSE 0 END AS kotdepok
            FROM antrianpasiendiperiksa_t AS apd
            INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
            LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
            inner join pasiendaftar_t pt on pt.norec = apd.noregistrasifk
            WHERE apd.kdprofile = $kdProfile AND apd.statusenabled = true
            AND pp.strukresepfk IS NOT NULL
            AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
            
            UNION ALL
            
            SELECT id,lingkuppelayanan,0 AS tunai,0 AS bpjs,0 AS kabbogor,0 AS kotbogor,0 AS kotdepok FROM lingkuppelayanan_m WHERE statusenabled = true
            ) AS x
            WHERE x.lingkuppelayanan IS NOT NULL
            GROUP BY x.id,x.lingkuppelayanan
            ORDER BY x.id  
        "));

        return $this->respond($data);
    }

    public function getDataRekapitulasiPendapatanDaerahTahunan(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];

        $data = \DB::select(DB::raw("
                    SELECT x.id,x.lingkuppelayanan,SUM(x.januari) AS januari,SUM(x.febuari) AS febuari,
                    SUM(x.maret) AS maret,SUM(x.april) AS april,SUM(x.mei) AS mei,SUM(x.juni) AS juni,
                    SUM(x.juli) AS juli,SUM(x.agustus) AS agustus,SUM(x.september) AS september,
                    SUM(x.oktober) AS oktober,SUM(x.november) AS november,SUM(x.desember) AS desember,
                    SUM(x.januari)+SUM(x.febuari)+SUM(x.maret)+SUM(x.april)+SUM(x.mei)+SUM(x.juni)+
                    SUM(x.juli)+SUM(x.agustus)+SUM(x.september)+SUM(x.oktober)+SUM(x.november)+SUM(x.desember) AS total  
                    FROM(SELECT 1 AS id,'Pelayanan Instalasi Rawat Jalan' AS lingkuppelayanan,
                    CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 1 THEN
                    (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                    0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS januari,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 2 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS febuari,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 3 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS maret,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 4 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS april,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 5 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS mei,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 6 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS juni,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 7 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS juli,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 8 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS agustus,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 9 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS september,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 10 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS oktober,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 11 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS november,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 12 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS desember
                    FROM antrianpasiendiperiksa_t AS apd
                    INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
                    LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                    WHERE apd.kdprofile =$kdProfile AND apd.statusenabled = true and pp.strukresepfk IS NULL
                    AND ru.objectdepartemenfk = 18 AND ru.id not in (12,701,692)
                    AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
                    
                    UNION ALL
                    
                    SELECT 2 AS id,'Pelayanan Instalasi Gawat Darurat' AS lingkuppelayanan,
                    CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 1 THEN
                    (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                    0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS januari,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 2 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS febuari,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 3 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS maret,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 4 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS april,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 5 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS mei,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 6 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS juni,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 7 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS juli,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 8 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS agustus,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 9 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS september,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 10 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS oktober,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 11 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS november,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 12 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS desember
                    FROM antrianpasiendiperiksa_t AS apd
                    INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
                    LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                    WHERE apd.kdprofile =$kdProfile AND apd.statusenabled = true and pp.strukresepfk IS NULL
                    AND ru.objectdepartemenfk = 24
                    AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
                    
                    UNION ALL
                    
                    SELECT 3 AS id,'Pelayanan Instalasi Rawat Inap' AS lingkuppelayanan,
                    CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 1 THEN
                    (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                    0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS januari,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 2 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS febuari,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 3 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS maret,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 4 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS april,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 5 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS mei,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 6 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS juni,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 7 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS juli,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 8 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS agustus,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 9 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS september,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 10 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS oktober,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 11 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS november,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 12 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS desember
                    FROM antrianpasiendiperiksa_t AS apd
                    INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
                    LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                    WHERE apd.kdprofile =$kdProfile AND apd.statusenabled = true and pp.strukresepfk IS NULL
                    AND ru.objectdepartemenfk = 16 and ru.id not in (731,732,721,720,740,739) 
                    AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
                    
                    UNION ALL
                    
                    SELECT 4 AS id,'Pelayanan Instalasi Intensif' AS lingkuppelayanan,
                    CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 1 THEN
                    (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                    0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS januari,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 2 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS febuari,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 3 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS maret,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 4 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS april,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 5 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS mei,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 6 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS juni,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 7 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS juli,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 8 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS agustus,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 9 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS september,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 10 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS oktober,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 11 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS november,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 12 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS desember
                    FROM antrianpasiendiperiksa_t AS apd
                    INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
                    LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                    WHERE apd.kdprofile =$kdProfile AND apd.statusenabled = true and pp.strukresepfk IS NULL
                    AND ru.objectdepartemenfk = 16 and ru.id in (731,732,721,720,740,739) 
                    AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
                    
                    UNION ALL
                    
                    SELECT 5 AS id,'Pelayanan Instalasi Laboratorium' AS lingkuppelayanan,
                    CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 1 THEN
                    (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                    0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS januari,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 2 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS febuari,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 3 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS maret,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 4 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS april,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 5 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS mei,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 6 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS juni,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 7 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS juli,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 8 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS agustus,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 9 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS september,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 10 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS oktober,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 11 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS november,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 12 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS desember
                    FROM antrianpasiendiperiksa_t AS apd
                    INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
                    LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                    WHERE apd.kdprofile =$kdProfile AND apd.statusenabled = true and pp.strukresepfk IS NULL
                    AND ru.objectdepartemenfk = 3 and ru.id not in (41)
                    AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
                    
                    UNION ALL
                    
                    SELECT 6 AS id,'Pelayanan Instalasi Radiologi' AS lingkuppelayanan,
                    CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 1 THEN
                    (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                    0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS januari,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 2 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS febuari,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 3 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS maret,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 4 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS april,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 5 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS mei,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 6 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS juni,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 7 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS juli,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 8 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS agustus,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 9 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS september,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 10 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS oktober,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 11 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS november,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 12 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS desember
                    FROM antrianpasiendiperiksa_t AS apd
                    INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
                    LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                    WHERE apd.kdprofile =$kdProfile AND apd.statusenabled = true and pp.strukresepfk IS NULL 
                    AND ru.objectdepartemenfk = 27
                    AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
                    
                    
                    UNION ALL
                    
                    SELECT 7 AS id,'Pelayanan Instalasi Rehabilitas Medik' AS lingkuppelayanan,
                    CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 1 THEN
                    (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                    0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS januari,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 2 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS febuari,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 3 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS maret,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 4 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS april,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 5 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS mei,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 6 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS juni,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 7 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS juli,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 8 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS agustus,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 9 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS september,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 10 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS oktober,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 11 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS november,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 12 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS desember
                    FROM antrianpasiendiperiksa_t AS apd
                    INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
                    LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                    WHERE apd.kdprofile =$kdProfile AND apd.statusenabled = true and pp.strukresepfk IS NULL
                    AND ru.objectdepartemenfk in (18,28) AND ru.id in (701,692,577)
                    AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
                    
                    UNION ALL
                    
                    SELECT 8 AS id,'Pelayanan Instalasi Bedah Sentral' AS lingkuppelayanan,
                    CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 1 THEN
                    (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                    0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS januari,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 2 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS febuari,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 3 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS maret,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 4 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS april,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 5 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS mei,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 6 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS juni,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 7 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS juli,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 8 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS agustus,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 9 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS september,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 10 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS oktober,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 11 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS november,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 12 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS desember
                    FROM antrianpasiendiperiksa_t AS apd
                    INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
                    LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                    WHERE apd.kdprofile =$kdProfile AND apd.statusenabled = true and pp.strukresepfk IS NULL
                    AND ru.objectdepartemenfk = 25
                    AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
                    
                    UNION ALL
                    
                    SELECT 10 AS id,'Pelayanan Hemodialisa' AS lingkuppelayanan,
                    CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 1 THEN
                    (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                    0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS januari,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 2 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS febuari,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 3 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS maret,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 4 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS april,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 5 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS mei,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 6 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS juni,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 7 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS juli,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 8 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS agustus,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 9 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS september,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 10 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS oktober,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 11 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS november,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 12 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS desember
                    FROM antrianpasiendiperiksa_t AS apd
                    INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
                    LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                    WHERE apd.kdprofile =$kdProfile AND apd.statusenabled = true and pp.strukresepfk IS NULL 
                    AND ru.id = 12
                    AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
                    
                    UNION ALL
                    
                    SELECT lp.id,lp.lingkuppelayanan,
                    CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 1 THEN
                    (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                    0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS januari,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 2 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS febuari,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 3 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS maret,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 4 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS april,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 5 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS mei,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 6 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS juni,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 7 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS juli,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 8 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS agustus,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 9 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS september,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 10 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS oktober,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 11 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS november,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 12 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS desember
                    FROM antrianpasiendiperiksa_t AS apd
                    INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
                    LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                    LEFT JOIN maplaporankeuangantolingkuppelayanan_m AS mlk ON mlk.produkfk=pp.produkfk
                    LEFT JOIN lingkuppelayanan_m AS lp ON lp.id = mlk.lingkuppelayananfk
                    WHERE apd.kdprofile =$kdProfile AND apd.statusenabled = true and pp.strukresepfk IS NULL
                    AND lp.id = 11
                    AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
                    
                    UNION ALL
                    
                    SELECT lp.id,lp.lingkuppelayanan,
                    CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 1 THEN
                    (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                    0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS januari,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 2 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS febuari,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 3 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS maret,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 4 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS april,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 5 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS mei,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 6 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS juni,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 7 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS juli,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 8 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS agustus,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 9 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS september,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 10 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS oktober,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 11 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS november,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 12 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS desember
                    FROM antrianpasiendiperiksa_t AS apd
                    INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
                    LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                    LEFT JOIN maplaporankeuangantolingkuppelayanan_m AS mlk ON mlk.produkfk=pp.produkfk
                    LEFT JOIN lingkuppelayanan_m AS lp ON lp.id = mlk.lingkuppelayananfk
                    WHERE apd.kdprofile =$kdProfile AND apd.statusenabled = true and pp.strukresepfk IS NULL
                    AND lp.id = 12
                    AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
                    
                    UNION ALL
                    
                    SELECT 13 AS id,'Pelayanan Bank Darah' AS lingkuppelayanan,
                    CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 1 THEN
                    (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                    0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS januari,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 2 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS febuari,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 3 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS maret,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 4 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS april,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 5 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS mei,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 6 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS juni,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 7 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS juli,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 8 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS agustus,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 9 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS september,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 10 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS oktober,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 11 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS november,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 12 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS desember
                    FROM antrianpasiendiperiksa_t AS apd
                    INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
                    LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                    WHERE apd.kdprofile =$kdProfile AND apd.statusenabled = true and pp.strukresepfk IS NULL
                    AND ru.objectdepartemenfk = 3 and ru.id in (41)
                    AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
                    
                    UNION ALL
                    
                    SELECT 14 AS id,'Pelayanan Farmasi' AS lingkuppelayanan,
                    CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 1 THEN
                    (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                    0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS januari,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 2 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS febuari,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 3 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS maret,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 4 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS april,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 5 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS mei,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 6 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS juni,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 7 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS juli,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 8 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS agustus,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 9 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS september,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 10 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS oktober,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 11 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS november,
                     CASE WHEN EXTRACT(MONTH from pp.tglpelayanan) = 12 THEN
                     (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) ELSE 0 END AS desember
                    FROM antrianpasiendiperiksa_t AS apd
                    INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec 
                    LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                    WHERE apd.kdprofile =$kdProfile AND apd.statusenabled = true 
                    AND pp.strukresepfk IS NOT NULL
                    AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
                    
                    UNION ALL 
                    
                    SELECT 14 AS id,'Pelayanan Farmasi' AS lingkuppelayanan,
                     CASE WHEN EXTRACT(MONTH from spd.tglstruk) = 1 THEN
                     spd.totalharusdibayar ELSE 0 END AS januari,
                     CASE WHEN EXTRACT(MONTH from spd.tglstruk) = 2 THEN
                     spd.totalharusdibayar ELSE 0 END AS febuari,
                     CASE WHEN EXTRACT(MONTH from spd.tglstruk) = 3 THEN
                     spd.totalharusdibayar ELSE 0 END AS maret,
                     CASE WHEN EXTRACT(MONTH from spd.tglstruk) = 4 THEN
                     spd.totalharusdibayar ELSE 0 END AS april,
                     CASE WHEN EXTRACT(MONTH from spd.tglstruk) = 5 THEN
                     spd.totalharusdibayar ELSE 0 END AS mei,
                     CASE WHEN EXTRACT(MONTH from spd.tglstruk) = 6 THEN
                     spd.totalharusdibayar ELSE 0 END AS juni,
                     CASE WHEN EXTRACT(MONTH from spd.tglstruk) = 7 THEN
                     spd.totalharusdibayar ELSE 0 END AS juli,
                     CASE WHEN EXTRACT(MONTH from spd.tglstruk) = 8 THEN
                     spd.totalharusdibayar ELSE 0 END AS agustus,
                     CASE WHEN EXTRACT(MONTH from spd.tglstruk) = 9 THEN
                     spd.totalharusdibayar ELSE 0 END AS september,
                     CASE WHEN EXTRACT(MONTH from spd.tglstruk) = 10 THEN
                     spd.totalharusdibayar ELSE 0 END AS oktober,
                     CASE WHEN EXTRACT(MONTH from spd.tglstruk) = 11 THEN
                     spd.totalharusdibayar ELSE 0 END AS november,
                     CASE WHEN EXTRACT(MONTH from spd.tglstruk) = 12 THEN
                     spd.totalharusdibayar ELSE 0 END AS desember
                    FROM strukpelayanan_t AS spd
                    WHERE spd.kdprofile =$kdProfile AND spd.statusenabled = true 
                    AND SUBSTRING(spd.nostruk,1,2) = 'OB'
                    AND spd.tglstruk BETWEEN '$tglAwal' AND '$tglAkhir'
                                                                                
                    UNION ALL
                    
                    SELECT id,lingkuppelayanan,0 as januari,0 as febuari,0 as maret,0 as april,
                    0 as mei,0 as juni,0 as juli,0 as agustus,0 as september,0 as oktober,0 as november,0 as desember
                    FROM lingkuppelayanan_m WHERE statusenabled = true
                    ) AS x
                    WHERE x.lingkuppelayanan IS NOT NULL
                    GROUP BY x.id,x.lingkuppelayanan
                    ORDER BY x.id 
        "));

        return $this->respond($data);
    }

    public function getDataPendapatanBP(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $data = \DB::select(DB::raw("
                SELECT x.namaruangan,SUM(x.jumlah) AS jumlah,SUM(x.totalp) AS totalp,SUM(x.totalt) AS totalt
                FROM( SELECT ru.namaruangan,pp.jumlah,(((CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                             0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) AS totalp,
                             0 AS totalt
                FROM antrianpasiendiperiksa_t AS apd
                INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
                LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                WHERE apd.kdprofile = $kdProfile AND apd.statusenabled = TRUE
                AND pp.produkfk in (33625,28343,30111,30110,30168,30650,31206,31207,32361,32362,33630,30151,33740,403531)
                AND pp.strukresepfk IS NULL AND ru.objectdepartemenfk in (18,28,24)
                AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
                
                UNION ALL 
                
                SELECT ru.namaruangan,pp.jumlah,0 AS totalp,
                             (((CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                             0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) AS totalt
                FROM antrianpasiendiperiksa_t AS apd
                INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
                LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                WHERE apd.kdprofile = $kdProfile AND apd.statusenabled = TRUE
                AND pp.produkfk not in (33625,28343,30111,30110,30168,30650,31206,31207,32361,32362,33630,30151,33740,403531)
                AND pp.strukresepfk IS NULL AND ru.objectdepartemenfk in (18,28,24)
                AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
                
                UNION ALL
                
                SELECT ru.namaruangan,pp.jumlah,(((CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                             0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) AS totalp,
                             0 AS totalt
                FROM antrianpasiendiperiksa_t AS apd
                INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
                LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                WHERE apd.kdprofile = $kdProfile AND apd.statusenabled = TRUE
                AND pp.produkfk in (33625,28343,30111,30110,30168,30650,31206,31207,32361,32362,33630,30151,33740,403531)
                AND pp.strukresepfk IS NULL AND ru.objectdepartemenfk in (3)
                AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
                
                UNION ALL 
                
                SELECT ru.namaruangan,pp.jumlah,0 AS totalp,
                             (((CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                             0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) AS totalt
                FROM antrianpasiendiperiksa_t AS apd
                INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
                LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                WHERE apd.kdprofile = $kdProfile AND apd.statusenabled = TRUE
                AND pp.produkfk not in (33625,28343,30111,30110,30168,30650,31206,31207,32361,32362,33630,30151,33740,403531)
                AND pp.strukresepfk IS NULL AND ru.objectdepartemenfk in (3)
                AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
                
                UNION ALL
                
                SELECT ru.namaruangan,pp.jumlah,(((CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                             0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) AS totalp,
                             0 AS totalt
                FROM antrianpasiendiperiksa_t AS apd
                INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
                LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                WHERE apd.kdprofile = $kdProfile AND apd.statusenabled = TRUE
                AND pp.produkfk in (33625,28343,30111,30110,30168,30650,31206,31207,32361,32362,33630,30151,33740,403531)
                AND pp.strukresepfk IS NULL AND ru.objectdepartemenfk in (27)
                AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
                
                UNION ALL 
                
                SELECT ru.namaruangan,pp.jumlah,0 AS totalp,
                             (((CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                             0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) AS totalt
                FROM antrianpasiendiperiksa_t AS apd
                INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
                LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                WHERE apd.kdprofile = $kdProfile AND apd.statusenabled = TRUE
                AND pp.produkfk not in (33625,28343,30111,30110,30168,30650,31206,31207,32361,32362,33630,30151,33740,403531)
                AND pp.strukresepfk IS NULL AND ru.objectdepartemenfk in (27)
                AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
                
                UNION ALL
                
                SELECT ru.namaruangan,pp.jumlah,(((CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                             0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) AS totalp,
                             0 AS totalt
                FROM antrianpasiendiperiksa_t AS apd
                INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
                LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                WHERE apd.kdprofile = $kdProfile AND apd.statusenabled = TRUE
                AND pp.produkfk in (33625,28343,30111,30110,30168,30650,31206,31207,32361,32362,33630,30151,33740,403531)
                AND pp.strukresepfk IS NULL AND ru.objectdepartemenfk in (31)
                AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
                
                UNION ALL 
                
                SELECT ru.namaruangan,pp.jumlah,0 AS totalp,
                             (((CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                             0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) AS totalt
                FROM antrianpasiendiperiksa_t AS apd
                INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
                LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                WHERE apd.kdprofile = $kdProfile AND apd.statusenabled = TRUE
                AND pp.produkfk not in (33625,28343,30111,30110,30168,30650,31206,31207,32361,32362,33630,30151,33740,403531)
                AND pp.strukresepfk IS NULL AND ru.objectdepartemenfk in (31)
                AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
                
                UNION ALL
                
                SELECT ru.namaruangan,pp.jumlah,(((CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                             0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) AS totalp,
                             0 AS totalt
                FROM antrianpasiendiperiksa_t AS apd
                INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
                LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                WHERE apd.kdprofile = $kdProfile AND apd.statusenabled = TRUE
                AND pp.produkfk in (33625,28343,30111,30110,30168,30650,31206,31207,32361,32362,33630,30151,33740,403531)
                AND pp.strukresepfk IS NULL AND ru.objectdepartemenfk in (5)
                AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
                
                UNION ALL 
                
                SELECT ru.namaruangan,pp.jumlah,0 AS totalp,
                             (((CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                             0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) AS totalt
                FROM antrianpasiendiperiksa_t AS apd
                INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
                LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                WHERE apd.kdprofile = $kdProfile AND apd.statusenabled = TRUE
                AND pp.produkfk not in (33625,28343,30111,30110,30168,30650,31206,31207,32361,32362,33630,30151,33740,403531)
                AND pp.strukresepfk IS NULL AND ru.objectdepartemenfk in (5)
                AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
                
                UNION ALL
                
                SELECT namaruangan,0 AS jumlah,0 AS totalp,0 AS totalt 
                FROM ruangan_m WHERE statusenabled=true AND kdprofile=21 
                AND objectdepartemenfk IN (18,28,24,3,27,31,5)) AS x
                GROUP BY x.namaruangan
        "));

        $dataDetail = \DB::select(DB::raw("
                SELECT x.namaruangan,SUM(x.jaspelp) AS jaspelp,SUM(x.jassarp) AS jassarp,
                SUM(x.jaspelt) AS jaspelt,SUM(x.jassart) AS jassart
                FROM( 
                SELECT ru.namaruangan,
                CASE WHEN ppd.komponenhargafk = 94 THEN pp.jumlah*ppd.hargajual ELSE 0 END AS jaspelp,
                CASE WHEN ppd.komponenhargafk = 93 THEN pp.jumlah*ppd.hargajual ELSE 0 END AS jassarp,
                0 AS jaspelt,0 AS jassart
                FROM antrianpasiendiperiksa_t AS apd
                INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
                INNER JOIN pelayananpasiendetail_t AS ppd ON ppd.pelayananpasien = pp.norec
                LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                WHERE apd.kdprofile =$kdProfile AND apd.statusenabled = TRUE
                AND ppd.statusenabled = true
                AND pp.produkfk in (33625,28343,30111,30110,30168,30650,31206,31207,32361,32362,33630,30151,33740,403531)
                AND pp.strukresepfk IS NULL AND ru.objectdepartemenfk in (18,28,24)
                AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
                
                UNION ALL 
                
                SELECT ru.namaruangan,
                0 AS jaspelp,0 AS jassarp,
                CASE WHEN ppd.komponenhargafk = 94 THEN pp.jumlah*ppd.hargajual ELSE 0 END AS jaspelt,
                CASE WHEN ppd.komponenhargafk = 93 THEN pp.jumlah*ppd.hargajual ELSE 0 END AS jassart
                FROM antrianpasiendiperiksa_t AS apd
                INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
                INNER JOIN pelayananpasiendetail_t AS ppd ON ppd.pelayananpasien = pp.norec
                LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                WHERE apd.kdprofile =$kdProfile AND apd.statusenabled = TRUE
                AND ppd.statusenabled = true
                AND pp.produkfk not in (33625,28343,30111,30110,30168,30650,31206,31207,32361,32362,33630,30151,33740,403531)
                AND pp.strukresepfk IS NULL AND ru.objectdepartemenfk in (18,28,24)
                AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
                
                UNION ALL
                
                SELECT ru.namaruangan,
                CASE WHEN ppd.komponenhargafk = 94 THEN pp.jumlah*ppd.hargajual ELSE 0 END AS jaspelp,
                CASE WHEN ppd.komponenhargafk = 93 THEN pp.jumlah*ppd.hargajual ELSE 0 END AS jassarp,
                0 AS jaspelt,0 AS jassart
                FROM antrianpasiendiperiksa_t AS apd
                INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
                INNER JOIN pelayananpasiendetail_t AS ppd ON ppd.pelayananpasien = pp.norec
                LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                WHERE apd.kdprofile =$kdProfile AND apd.statusenabled = TRUE
                AND ppd.statusenabled = true
                AND pp.produkfk in (33625,28343,30111,30110,30168,30650,31206,31207,32361,32362,33630,30151,33740,403531)
                AND pp.strukresepfk IS NULL AND ru.objectdepartemenfk in (3)
                AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
                
                UNION ALL 
                
                SELECT ru.namaruangan,
                0 AS jaspelp,0 AS jassarp,
                CASE WHEN ppd.komponenhargafk = 94 THEN pp.jumlah*ppd.hargajual ELSE 0 END AS jaspelt,
                CASE WHEN ppd.komponenhargafk = 93 THEN pp.jumlah*ppd.hargajual ELSE 0 END AS jassart
                FROM antrianpasiendiperiksa_t AS apd
                INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
                INNER JOIN pelayananpasiendetail_t AS ppd ON ppd.pelayananpasien = pp.norec
                LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                WHERE apd.kdprofile =$kdProfile AND apd.statusenabled = TRUE
                AND ppd.statusenabled = true
                AND pp.produkfk not in (33625,28343,30111,30110,30168,30650,31206,31207,32361,32362,33630,30151,33740,403531)
                AND pp.strukresepfk IS NULL AND ru.objectdepartemenfk in (3)
                AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
                
                UNION ALL
                
                SELECT ru.namaruangan,
                CASE WHEN ppd.komponenhargafk = 94 THEN pp.jumlah*ppd.hargajual ELSE 0 END AS jaspelp,
                CASE WHEN ppd.komponenhargafk = 93 THEN pp.jumlah*ppd.hargajual ELSE 0 END AS jassarp,
                0 AS jaspelt,0 AS jassart
                FROM antrianpasiendiperiksa_t AS apd
                INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
                INNER JOIN pelayananpasiendetail_t AS ppd ON ppd.pelayananpasien = pp.norec
                LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                WHERE apd.kdprofile =$kdProfile AND apd.statusenabled = TRUE
                AND ppd.statusenabled = true
                AND pp.produkfk in (33625,28343,30111,30110,30168,30650,31206,31207,32361,32362,33630,30151,33740,403531)
                AND pp.strukresepfk IS NULL AND ru.objectdepartemenfk in (27)
                AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
                
                UNION ALL 
                
                SELECT ru.namaruangan,
                0 AS jaspelp,0 AS jassarp,
                CASE WHEN ppd.komponenhargafk = 94 THEN pp.jumlah*ppd.hargajual ELSE 0 END AS jaspelt,
                CASE WHEN ppd.komponenhargafk = 93 THEN pp.jumlah*ppd.hargajual ELSE 0 END AS jassart
                FROM antrianpasiendiperiksa_t AS apd
                INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
                INNER JOIN pelayananpasiendetail_t AS ppd ON ppd.pelayananpasien = pp.norec
                LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                WHERE apd.kdprofile =$kdProfile AND apd.statusenabled = TRUE
                AND ppd.statusenabled = true
                AND pp.produkfk not in (33625,28343,30111,30110,30168,30650,31206,31207,32361,32362,33630,30151,33740,403531)
                AND pp.strukresepfk IS NULL AND ru.objectdepartemenfk in (27)
                AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
                
                UNION ALL
                
                SELECT ru.namaruangan,
                CASE WHEN ppd.komponenhargafk = 94 THEN pp.jumlah*ppd.hargajual ELSE 0 END AS jaspelp,
                CASE WHEN ppd.komponenhargafk = 93 THEN pp.jumlah*ppd.hargajual ELSE 0 END AS jassarp,
                0 AS jaspelt,0 AS jassart
                FROM antrianpasiendiperiksa_t AS apd
                INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
                INNER JOIN pelayananpasiendetail_t AS ppd ON ppd.pelayananpasien = pp.norec
                LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                WHERE apd.kdprofile =$kdProfile AND apd.statusenabled = TRUE
                AND ppd.statusenabled = true
                AND pp.produkfk in (33625,28343,30111,30110,30168,30650,31206,31207,32361,32362,33630,30151,33740,403531)
                AND pp.strukresepfk IS NULL AND ru.objectdepartemenfk in (31)
                AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
                
                UNION ALL 
                
                SELECT ru.namaruangan,
                0 AS jaspelp,0 AS jassarp,
                CASE WHEN ppd.komponenhargafk = 94 THEN pp.jumlah*ppd.hargajual ELSE 0 END AS jaspelt,
                CASE WHEN ppd.komponenhargafk = 93 THEN pp.jumlah*ppd.hargajual ELSE 0 END AS jassart
                FROM antrianpasiendiperiksa_t AS apd
                INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
                INNER JOIN pelayananpasiendetail_t AS ppd ON ppd.pelayananpasien = pp.norec
                LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                WHERE apd.kdprofile =$kdProfile AND apd.statusenabled = TRUE
                AND ppd.statusenabled = true
                AND pp.produkfk not in (33625,28343,30111,30110,30168,30650,31206,31207,32361,32362,33630,30151,33740,403531)
                AND pp.strukresepfk IS NULL AND ru.objectdepartemenfk in (31)
                AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
                
                UNION ALL
                
                SELECT ru.namaruangan,
                CASE WHEN ppd.komponenhargafk = 94 THEN pp.jumlah*ppd.hargajual ELSE 0 END AS jaspelp,
                CASE WHEN ppd.komponenhargafk = 93 THEN pp.jumlah*ppd.hargajual ELSE 0 END AS jassarp,
                0 AS jaspelt,0 AS jassart
                FROM antrianpasiendiperiksa_t AS apd
                INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
                INNER JOIN pelayananpasiendetail_t AS ppd ON ppd.pelayananpasien = pp.norec
                LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                WHERE apd.kdprofile =$kdProfile AND apd.statusenabled = TRUE
                AND ppd.statusenabled = true
                AND pp.produkfk in (33625,28343,30111,30110,30168,30650,31206,31207,32361,32362,33630,30151,33740,403531)
                AND pp.strukresepfk IS NULL AND ru.objectdepartemenfk in (5)
                AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
                
                UNION ALL 
                
                SELECT ru.namaruangan,
                0 AS jaspelp,0 AS jassarp,
                CASE WHEN ppd.komponenhargafk = 94 THEN pp.jumlah*ppd.hargajual ELSE 0 END AS jaspelt,
                CASE WHEN ppd.komponenhargafk = 93 THEN pp.jumlah*ppd.hargajual ELSE 0 END AS jassart
                FROM antrianpasiendiperiksa_t AS apd
                INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
                INNER JOIN pelayananpasiendetail_t AS ppd ON ppd.pelayananpasien = pp.norec
                LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                WHERE apd.kdprofile =$kdProfile AND apd.statusenabled = TRUE
                AND ppd.statusenabled = true
                AND pp.produkfk not in (33625,28343,30111,30110,30168,30650,31206,31207,32361,32362,33630,30151,33740,403531)
                AND pp.strukresepfk IS NULL AND ru.objectdepartemenfk in (5)
                AND pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
                
                UNION ALL
                
                SELECT namaruangan,0 AS jaspelp,0 AS jassarp,0 AS jaspelt,0 AS jassart
                FROM ruangan_m WHERE statusenabled=true AND kdprofile=21 
                AND objectdepartemenfk IN (18,28,24,3,27,31,5) ) AS x
                GROUP BY x.namaruangan
        "));

        $i=0;
        foreach ($data as $items){
            foreach ($dataDetail as $dD) {
//                $data[$i]->jaspelp = 0;
//                $data[$i]->jassarp = 0;
//                $data[$i]->jaspelt = 0;
//                $data[$i]->jassart = 0;
                if ($data[$i]->namaruangan == $dD->namaruangan){
                    $data[$i]->jaspelp = $dD->jaspelp;
                    $data[$i]->jassarp = $dD->jassarp;
                    $data[$i]->jaspelt = $dD->jaspelt;
                    $data[$i]->jassart = $dD->jassart;
                }
            }
            $i = $i + 1;
        }

        $result = array(
            'data' => $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getSTS(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tglAwal= $request['tglAwal'];
        $tglAkhir= $request['tglAkhir'];
        $status = '';
        $noclosing = '';
        $nosts = '';
        $carabayar = '';

        if (isset($request['status']) && $request['status'] != "" && $request['status'] != "undefined" && $request['status']==1) {
            $status = ' and nosts is not null';
        } else{
            $status = ' and nosts is null';
        }

        if (isset($request['status']) && $request['status'] != "" && $request['status'] != "undefined" && $request['status']==2) {
            $status = ' and objectstsfk is null';
        }

        if(isset($request['idCaraBayar']) && $request['idCaraBayar'] != "" && $request['idCaraBayar'] != "undefined") {
            $carabayar = ' AND idcarabayar = ' . $request['idCaraBayar'];
        }

        if(isset($request['noclosing']) && $request['noclosing'] != "" && $request['noclosing'] != "undefined" && $request['noclosing'] != 1) {
            $noclosing = " and nopenerimaan ilike '%".$request['noclosing']."%'";
        }

        if(isset($request['nosts']) && $request['nosts'] != "" && $request['nosts'] != "undefined" && $request['noclosing'] != 1) {
            $nosts = " and nosts ilike '%".$request['nosts']."%'";
        }

        // $noclosingbatal = DB::select(DB::raw("select sc.noclosing from strukclosing_t sc
        // inner join strukhistori_t sh on sh.noclosing = sc.norec"));

        // $nobatal = [];

        // for ($i = 0, $c = count($noclosingbatal); $i < $c; ++$i) {
        //     $nobatal[$i] = (array) $noclosingbatal[$i]->noclosing;
        // }

        // $nobatal = array();
        // foreach($noclosingbatal as $no) {
        //     $nobatal[] = $no;
        // }

        // foreach($noclosingbatal as $key=>$no){
        //     array_push($nobatal[$key],$no->noclosing);
        // }

        // foreach ($comments as $key=>$comment){
        //     $creator=User::findOrFail($comment['creator_id'])->toArray();
        //     array_push($comments[$key],$creator);
        // }

        //$nobatalfix = json_encode($nobatal);

        // $nobatal = array_map(function ($noclosingbatal) {
        //     return (array)$noclosingbatal;
        // }, $nobatal);

        $detail = DB::select(DB::raw("select * from(
        select distinct on (sc.noclosing) ssc.statusenabled, cb.id idcarabayar, sc.noclosing as nopenerimaan, sc.tglclosing as tglpenerimaan, sck.totaldibayar as totalpenerimaan, sts.nosts, sts.keterangan, cb.carabayar, sc.objectpegawaidiclosefk as pegawai, sc.norec as scfk, sck.norec as sckfk, ssc.objectstsfk 
        from strukclosing_t sc
        inner join strukclosingkasir_t sck on sck.noclosingfk = sc.norec
        inner join strukbuktipenerimaan_t sbm on sbm.noclosingfk = sc.norec
        inner join strukhistori_t sh on sh.noclosing = sc.norec
        left join strukbuktipenerimaancarabayar_t sbmcr on sbmcr.nosbmfk = sbm.norec
        left join carabayar_m cb on cb.id = sbmcr.objectcarabayarfk
        left join ststosck_t ssc on ssc.objectsckfk = sck.norec 
        and ssc.statusenabled = true
        left join surattandasetoran_t sts on sts.norec = ssc.objectstsfk and sts.statusenabled = true
        where sc.tglclosing::date between '$tglAwal' and '$tglAkhir'
        and sh.statusenabled <> false
        and sc.kdprofile = $kdProfile
        and sc.statusenabled <> false       
        order by sc.noclosing, sc.tglclosing desc
        ) as x where nopenerimaan is not null
        $status
        $noclosing
        $nosts
        $carabayar"));
        

        $result = array(
            'detail' => $detail,
        );
        
        return $this->setStatusCode(201)->respond($result, 'tes msg');
    }

    public function getSTSManual(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tglAwal= $request['tglAwal'];
        $tglAkhir= $request['tglAkhir'];
        $nosts = '';

        if(isset($request['nosts']) && $request['nosts'] != "" && $request['nosts'] != "undefined" && $request['noclosing'] != 1) {
            $nosts = " and sts.nosts ilike '%".$request['nosts']."%'";
        }

        $detail = DB::select(DB::raw("select * 
        from surattandasetoran_t sts
        where sts.kdprofile = 30
        and sts.statusenabled = true
        and sts.ismanual = true
        and sts.tglpenerimaan::date between '$tglAwal' and '$tglAkhir'
        $nosts"));
        

        $result = array(
            'detail' => $detail,
        );
        
        return $this->setStatusCode(201)->respond($result, 'tes msg');
    }

    public function getSTSKlaim(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tglAwal= $request['tglAwal'];
        $tglAkhir= $request['tglAkhir'];
        $nosts = '';

        if(isset($request['nosts']) && $request['nosts'] != "" && $request['nosts'] != "undefined" && $request['noclosing'] != 1) {
            $nosts = " and sts.nosts ilike '%".$request['nosts']."%'";
        }

        $status = '';
        if (isset($request['status']) && $request['status'] != "" && $request['status'] != "undefined" && $request['status']==1) {
            $status = ' and sts.nosts is not null';
        } else {
            $status = ' and sts.norec is null and str.norec is null';
        }

        $kp = '';
        if(isset($request['kelompokpasien']) && $request['kelompokpasien']!=""){
            $kp = "and kp.kelompokpasien ilike '%".$request['kelompokpasien']."%'";
        }

        $ko = '';
        if(isset($request['klaimobat']) && $request['klaimobat']!="" && $request['klaimobat'] == true){
            $ko = "and rkb.isobat = true";
        }

        $detail = DB::select(DB::raw("select rkb.*, pd.noregistrasi, kp.kelompokpasien, kp.id idkelompokpasien, sts.nosts, sts.tglpenerimaan, sts.keterangan, coalesce(sts.totalsetoran,0) totalsetoran, ru.objectdepartemenfk
        from rekapklaimbpjs_t rkb
        left join pasiendaftar_t pd on pd.norec = rkb.norecpdfk
        left join kelompokpasien_m kp on kp.id = pd.objectkelompokpasienlastfk
        left join ruangan_m ru on ru.id = pd.objectruanganlastfk
        left join ststorekapklaim_t str on str.objectrekapklaimfk = rkb.norec
        and str.statusenabled = true
        and str.kdprofile = 30
        left join surattandasetoran_t sts on sts.norec = str.objectstsfk
        and sts.statusenabled = true
        and sts.kdprofile = 30
        where rkb.tglbayar::date between '$tglAwal' and '$tglAkhir'
        and rkb.statusenabled = true
        and rkb.kdprofile = 30
        $status
        $kp
        $ko
        $nosts"));
        

        $result = array(
            'detail' => $detail,
        );
        
        return $this->setStatusCode(201)->respond($result, 'tes msg');
    }

    public function saveKlaim(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $klaim = $request['klaim'];

        DB::beginTransaction();
        try{
            for($i=0; $i<count($klaim); $i++){

                $cek = RekapKlaim::where('nosep', '=', $klaim[$i]['nosep'])->first();

                if(empty($cek)){
                    $STSK = new RekapKlaim();
                    $STSK->norec  = $STSK->generateNewId();
                    $STSK->kdprofile = $idProfile;
                    $STSK->statusenabled = true;
                    $STSK->nosep = $klaim[$i]['nosep'];
                    $STSK->totalsetujui= $klaim[$i]['totalklaim'];
                    $STSK->totaltarifrs = $klaim[$i]['totalbilling'];
                    $STSK->norecpdfk = $klaim[$i]['norecpd'];
                    $STSK->tglsep = $klaim[$i]['tglsep'];
                    
                } else{
                    $STSK = RekapKlaim::where('nosep', '=', $klaim[$i]['nosep'])->first();
                }

                $STSK->tglbayar = $request['tglbayar'];
                $STSK->save();

            }
        
            $transStatus = 'true';
        } catch (\Exception $e) {
             $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $STSK,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'line'=> $e->getLine(),
                'message'=> $e->getMessage(),
                'result' => $STSK,
                'as' => '@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveSTS(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $produk = [];
        // $sts = '';
        $dataLogin = $request->all();
        $iduser = '';
        $setor = $request['setoran'];
        $dataPegawaiUser = DB::select(DB::raw("select pg.id,pg.namalengkap from loginuser_s as lu
                INNER JOIN pegawai_m as pg on lu.objectpegawaifk=pg.id
                where pg.kdprofile = $idProfile and lu.id=:idLoginUser"),
            array(
                'idLoginUser' => $dataLogin['userData']['id'],
            )
        );

        foreach($dataPegawaiUser as $dat){
            $iduser = $dat->id;
        }
        
        

        $noclosing = [];
        $totalpenerimaan = 0;
        for($i=0; $i<count($setor); $i++){
            $noclosing[$i] = $setor[$i]['nopenerimaan'];
            $totalpenerimaan += $setor[$i]['totalpenerimaan'];
        }

        $total_penerimaan =0;

        $totalpenerimaan = ceil($totalpenerimaan);

        if (substr($totalpenerimaan,-3)>499){
            $total_penerimaan=round($totalpenerimaan,-3);
        } else {
            $total_penerimaan=round($totalpenerimaan,-3)+500;
        }

        $nosts = $this->generateCode(new SuratTandaSetoran, 'nosts', 11, date('ymd',strtotime($setor[0]['tanggalSTS'])),$idProfile);

        $STS = new SuratTandaSetoran();
        $STS->norec  = $STS->generateNewId();
        $STS->kdprofile = $idProfile;
        $STS->statusenabled = true;
        $STS->nosts = $nosts;
        $STS->tglpenerimaan = $setor[0]['tanggalSTS'];
        $STS->totalsetoran = $totalpenerimaan;
        $STS->totalsetoranpembulatan = $total_penerimaan;
        $STS->terbilang = $setor[0]['terbilang'];
        $STS->objectpegawaifk = $iduser;
        $STS->ismanual = null;
        $STS->objectakunpendapatanfk = isset($request['idrekeningSTS']) ? $request['idrekeningSTS'] : NULL;
        $STS->save();

        // var_dump($noclosing);

        for($i=0; $i<count($setor); $i++){

            $STSK = new STStoSCK();
            $STSK->norec  = $STSK->generateNewId();
            $STSK->kdprofile = $idProfile;
            $STSK->statusenabled = true;
            $STSK->objectstsfk = $STS->norec;
            $STSK->objectscfk = $setor[$i]['scfk'];
            $STSK->objectsckfk = $setor[$i]['sckfk'];
            $STSK->save();
            
            if($STSK->save() && $STS->save()){
                $transMsg = 'Simpan STS Berhasil';
            }else{
                $transMsg = 'Simpan STS Gagal';
            }     
        }

        // konten STS Detail

        $data = DB::select(DB::raw("select distinct  '' as keteranganpakai, ru2.objectdepartemenfk objectdepartemenfk2, cb2.id idcarabayar2, kp.id idkelompokpasien, 0 objectkelompoktransaksifk, sbm.norec norecsbm, pp.norec, sc.tglclosing, ru.namaruangan, ru.id idruangan, pr.namaproduk, pr.id idproduk, pp.isobat,
            (((CASE WHEN pp.hargajual IS NULL THEN 0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
        0 ELSE pp.hargadiscount END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN 0 ELSE pp.jasa END ) AS totaldibayarclosing,
        ru.objectdepartemenfk, sbmcr.objectcarabayarfk, sbm.totaldibayar as totaldibayarsbm, sc.noclosing, sc.tglclosing,
        sck.totaldibayar as totaldibayar,sck.carabayarfk, cb.carabayar, djp.detailjenisproduk, jpr.id as jenisproduk
        
        FROM   pasien_m ps 
                        inner join pasiendaftar_t pd on ps.id=pd.nocmfk
                        inner join antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                        inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
                        inner JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk  
                        inner JOIN ruangan_m AS ru2 ON ru2.id = pd.objectruanganlastfk
                        left JOIN strukpelayanan_t AS sp ON sp.norec = pp.strukfk  
                        LEFT JOIN strukbuktipenerimaan_t AS sbm ON sbm.nostrukfk = sp.norec AND sbm.statusenabled = true  
                        LEFT JOIN strukbuktipenerimaancarabayar_t as sbmcr ON sbmcr.nosbmfk = sbm.norec
                        LEFT JOIN carabayar_m as cb ON cb.id = sbmcr.objectcarabayarfk
                        LEFT JOIN strukbuktipenerimaan_t AS sbm2 ON sbm2.nostrukfk = sp.norec AND sbm2.statusenabled = true and sbm2.norec <> sbm.norec 
                        LEFT JOIN strukbuktipenerimaancarabayar_t as sbmcr2 ON sbmcr2.nosbmfk = sbm2.norec
                        LEFT JOIN carabayar_m as cb2 ON cb2.id = sbmcr2.objectcarabayarfk and cb2.id <> cb.id
                        LEFT JOIN loginuser_s AS lu ON lu.id = sbm.objectpegawaipenerimafk  
                        LEFT JOIN pegawai_m AS pg ON pg.id = lu.objectpegawaifk  
                        LEFT JOIN pegawai_m AS pgdpjp ON pgdpjp.id = pd.objectpegawaifk
                        LEFT JOIN produk_m AS pr ON pr.id = pp.produkfk  
                        LEFT JOIN kelompokpasien_m AS kp ON kp.id = pd.objectkelompokpasienlastfk
                        inner join strukclosing_t as sc on sbm.noclosingfk = sc.norec
                        inner join strukclosingkasir_t as sck on sc.norec = sck.noclosingfk
                        left join detailjenisproduk_m djp on djp.id = pr.objectdetailjenisprodukfk
                        left join jenisproduk_m jpr on jpr.id = djp.objectjenisprodukfk
                        left join ststosck_t as ssc on ssc.objectsckfk = sck.norec
                        left join surattandasetoran_t as sts on sts.norec = ssc.objectstsfk
        where pd.statusenabled = true
        --and sts.statusenabled = true
        and pd.kdprofile = 30
        and sc.noclosing IN('".implode("','",$noclosing)."')
        
        union all
        
        select distinct spd.keteranganlainnya as keteranganpakai, 0 objectdepartemenfk2, cb2.id idcarabayar2, 0 idkelompokpasien, sp.objectkelompoktransaksifk, sbm.norec norecsbm, sp.norec, sc.tglclosing, ru.namaruangan, ru.id idruangan, pr.namaproduk, pr.id idproduk, pp.isobat,
        (spd.qtyproduk * spd.hargasatuan * spd.qtyoranglast)::float8 as totaldibayarclosing,
        ru.objectdepartemenfk, sbmcr.objectcarabayarfk, sbm.totaldibayar as totaldibayarsbm, sc.noclosing, sc.tglclosing,
        sck.totaldibayar as totaldibayar,sck.carabayarfk, cb.carabayar, djp.detailjenisproduk, jpr.id as jenisproduk
        from strukclosingkasir_t as sck
        inner join strukclosing_t as sc on sc.norec = sck.noclosingfk
        inner join strukbuktipenerimaan_t as sbm on sbm.noclosingfk = sc.norec
        inner join strukpelayanan_t as sp on sbm.nostrukfk = sp.norec
        inner join strukpelayanandetail_t as spd on sp.norec = spd.nostrukfk
		inner join strukbuktipenerimaancarabayar_t sbmcr on sbmcr.nosbmfk = sbm.norec
        inner join produk_m pr on pr.id=spd.objectprodukfk
        inner join carabayar_m as cb on cb.id = sck.carabayarfk
        LEFT JOIN strukbuktipenerimaan_t AS sbm2 ON sbm2.nostrukfk = sp.norec AND sbm2.statusenabled = true and sbm2.norec <> sbm.norec 
		LEFT JOIN strukbuktipenerimaancarabayar_t as sbmcr2 ON sbmcr2.nosbmfk = sbm2.norec
		LEFT JOIN carabayar_m as cb2 ON cb2.id = sbmcr2.objectcarabayarfk 
        left join detailjenisproduk_m djp on djp.id = pr.objectdetailjenisprodukfk
        left join jenisproduk_m jpr on jpr.id = djp.objectjenisprodukfk
        left join ruangan_m as ru on ru.id = spd.objectruanganasalfk
        left join pasiendaftar_t as pd on sp.noregistrasifk = pd.norec
        left join antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
        left join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
        left join ststosck_t as ssc on ssc.objectsckfk = sck.norec
        left join surattandasetoran_t as sts on sts.norec = ssc.objectstsfk
        where (sbm.keteranganlainnya = 'Pembayaran Tagihan Non Layanan' or sbm.keteranganlainnya = 'Pembayaran Diklat')
        --and sts.statusenabled = true
        and sc.noclosing IN('".implode("','",$noclosing)."')"));
       
        $jumlahpoliklinik = 0;
        $jumlahperiksajiwa = 0;
        $jumlahperiksanapza = 0;
        $jumlahperiksaumum = 0;
        $jumlahperiksagigi = 0;
        $jumlahperiksadalam = 0;
        $jumlahperiksaanak = 0;
        $jumlahperiksasyaraf = 0;
        $jumlahperiksaelektromedik = 0;
        $jumlahperiksaigd = 0;
        $jumlahperiksaigdjiwa = 0;
        $jumlahperiksaigdnonjiwa = 0;
        $jumlahdipam = 0;
        $jumlahtindakanpolirajal = 0;
        $jumlahtindakanigd = 0;
        $jumlahtindakangigi = 0;
        $jumlahobatobatrajal = 0;
        $jumlahobatrajal = 0;
        $jumlahkir = 0;
        $jumlahpsikologi = 0;
        $jumlahgizi = 0;
        $jumlahpenunjang = 0;
        $jumlahlaboratorium = 0;
        $jumlahelektromedik = 0;
        $jumlahfisioterapi = 0;
        $jumlahradiologi = 0;
        $jumlahdiklat = 0;
        $jumlahkelassatu = 0;
        $jumlahkelasdua = 0;
        $jumlahkelastiga = 0;
        $jumlahkelasvip = 0;
        $jumlahkelasuppi = 0;
        $jumlahperawatanpasienranap = 0;
        $jumlahobatobatranap = 0;
        $jumlahobatranap = 0;
        $jumlahtindakanpoliranap = 0;
        $jumlahvisite = 0;
        $jumlahrehabmental = 0;
        $jumlahperawatanjenazah =0;
        $jumlahugdranap = 0;
        $jumlahjiwaranap = 0;
        $jumlahnapzaranap = 0;
        $jumlahlainlain = 0;
        $jumlahlegalisir = 0;
        $jumlahsewagedungterapi = 0;
        $jumlahsewalapangan = 0;
        $jumlahsewagedungdiklat = 0;
        $jumlahsewagedunggrhasiainn = 0;
        $jumlahsewatanah = 0; //belum
        $jumlahsewakalandra = 0;
        $jumlahsewatempatfotocopy = 0;
        $jumlahsewamanekin = 0;
        $jumlahsewaambulan = 0;
        $jumlahsewabus = 0;
        $hasilketrampilan = 0;
        $parkir = 0;
        $lainlain = 0;
        $grandtotal = 0;
        $jumlahcostsharingbpjsrajal = 0;
        $jumlahcostsharingjamkesdarajal = 0;
        $jumlahcostsharingjamkesosrajal = 0;
        $jumlahcostsharingbpjsranap = 0;
        $jumlahcostsharingjamkesdaranap = 0;
        $jumlahcostsharingjamkesosranap = 0;
        $jumlahtransferrajal = 0;
        $jumlahtransferranap = 0;
        $jumlahtunairajal = 0;
        $jumlahtunairanap = 0;

        $voljumlahpoliklinik = 0;
        $voljumlahperiksajiwa = 0;
        $voljumlahperiksanapza = 0;
        $voljumlahperiksaumum = 0;
        $voljumlahperiksagigi = 0;
        $voljumlahperiksadalam = 0;
        $voljumlahperiksaanak = 0;
        $voljumlahperiksasyaraf = 0;
        $voljumlahperiksaelektromedik = 0;
        $voljumlahperiksaigd = 0;
        $voljumlahperiksaigdjiwa = 0;
        $voljumlahperiksaigdnonjiwa = 0;
        $voljumlahdipam = 0;
        $voljumlahtindakanpolirajal = 0;
        $voljumlahtindakanigd = 0;
        $voljumlahtindakangigi = 0;
        $voljumlahobatobatrajal = 0;
        $voljumlahobatrajal = 0;
        $voljumlahkir = 0;
        $voljumlahpsikologi = 0;
        $voljumlahgizi = 0;
        $voljumlahpenunjang = 0;
        $voljumlahlaboratorium = 0;
        $voljumlahelektromedik = 0;
        $voljumlahfisioterapi = 0;
        $voljumlahradiologi = 0;
        $voljumlahdiklat = 0;
        $voljumlahkelassatu = 0;
        $voljumlahkelasdua = 0;
        $voljumlahkelastiga = 0;
        $voljumlahkelasvip = 0;
        $voljumlahkelasuppi = 0;
        $voljumlahperawatanpasienranap = 0;
        $voljumlahobatobatranap = 0;
        $voljumlahobatranap = 0;
        $voljumlahtindakanpoliranap = 0;
        $voljumlahvisite = 0;
        $voljumlahrehabmental = 0;
        $voljumlahperawatanjenazah =0;
        $voljumlahugdranap = 0;
        $voljumlahjiwaranap = 0;
        $voljumlahnapzaranap = 0;
        $voljumlahlainlain = 0;
        $voljumlahlegalisir = 0;
        $voljumlahsewagedungterapi = 0;
        $voljumlahsewalapangan = 0;
        $voljumlahsewagedungdiklat = 0;
        $voljumlahsewagedunggrhasiainn = 0;
        $voljumlahsewatanah = 0;
        $voljumlahsewakalandra = 0;
        $voljumlahsewatempatfotocopy = 0;
        $voljumlahsewamanekin = 0;
        $voljumlahsewaambulan = 0;
        $voljumlahsewabus = 0;
        $volhasilketrampilan = 0;
        $volparkir = 0;
        $vollainlain = 0;
        $cekjumlah = '';
        $voljumlahcostsharingbpjsrajal = 0;
        $voljumlahcostsharingjamkesdarajal = 0;
        $voljumlahcostsharingjamkesosrajal = 0;
        $voljumlahcostsharingbpjsranap = 0;
        $voljumlahcostsharingjamkesdaranap = 0;
        $voljumlahcostsharingjamkesosranap = 0;
        $voljumlahtransferrajal = 0;
        $voljumlahtransferranap = 0;
        $voljumlahtunairajal = 0;
        $voljumlahtunairanap = 0;

        foreach($data as $konten){
            $cekjumlah = '';
            $cekharga = 0;

            // pasien ipwl ranap
            // masukk ke kelas III
            if($konten->idkelompokpasien == 4 && $konten->objectdepartemenfk2 == 16 && $konten->idkelompokpasien != 26 && $konten->totaldibayarclosing != $konten->totaldibayarsbm){
                $jumlahkelastiga += $konten->totaldibayarclosing;
                $voljumlahkelastiga++;
                $cekjumlah = $konten->namaproduk;
            }

            else if($konten->idkelompokpasien != 0 && $konten->idkelompokpasien != 1 && $konten->idkelompokpasien != 12 && $konten->idkelompokpasien != 18 && $konten->idkelompokpasien != 8 && $konten->objectdepartemenfk2 != 0 && $konten->objectdepartemenfk2 != 16 && $konten->totaldibayarclosing != $konten->totaldibayarsbm){
                $jumlahcostsharingbpjsrajal = $konten->totaldibayarsbm;
                $voljumlahcostsharingbpjsrajal++;
                $cekjumlah = $konten->namaproduk;
            }

            else if($konten->idkelompokpasien != 4 && $konten->idkelompokpasien != 0 && $konten->idkelompokpasien != 1 && $konten->idkelompokpasien != 12 && $konten->idkelompokpasien != 18 && $konten->idkelompokpasien != 8 && $konten->objectdepartemenfk2 != 0 && $konten->objectdepartemenfk2 == 16 && $konten->totaldibayarclosing != $konten->totaldibayarsbm){
                $jumlahcostsharingbpjsranap = $konten->totaldibayarsbm;
                $voljumlahcostsharingbpjsranap++;
                $cekjumlah = $konten->namaproduk;
            }

            else if($konten->idkelompokpasien != 0 && $konten->idkelompokpasien != 1 && $konten->idkelompokpasien != 12 && $konten->idkelompokpasien == 18 && $konten->objectdepartemenfk2 != 0 && $konten->objectdepartemenfk2 != 16 && $konten->totaldibayarclosing != $konten->totaldibayarsbm){
                $jumlahcostsharingjamkesosrajal = $konten->totaldibayarsbm;
                $voljumlahcostsharingjamkesosrajal++;
                $cekjumlah = $konten->namaproduk;
            }

            else if($konten->idkelompokpasien != 0 && $konten->idkelompokpasien != 1 && $konten->idkelompokpasien != 12 && $konten->idkelompokpasien == 18 && $konten->objectdepartemenfk2 != 0 && $konten->objectdepartemenfk2 == 16 && $konten->totaldibayarclosing != $konten->totaldibayarsbm){
                $jumlahcostsharingjamkesosranap = $konten->totaldibayarsbm;
                $voljumlahcostsharingjamkesosranap++;
                $cekjumlah = $konten->namaproduk;
            }

            else if($konten->idkelompokpasien != 0 && $konten->idkelompokpasien != 1 && $konten->idkelompokpasien != 12 && $konten->idkelompokpasien == 8 && $konten->objectdepartemenfk2 != 0 && $konten->objectdepartemenfk2 != 16 && $konten->totaldibayarclosing != $konten->totaldibayarsbm){
                $jumlahcostsharingjamkesdarajal = $konten->totaldibayarsbm;
                $voljumlahcostsharingjamkesdarajal++;
                $cekjumlah = $konten->namaproduk;
            }

            else if($konten->idkelompokpasien != 0 && $konten->idkelompokpasien != 1 && $konten->idkelompokpasien != 12 && $konten->idkelompokpasien == 8 && $konten->objectdepartemenfk2 != 0 && $konten->objectdepartemenfk2 == 16 && $konten->totaldibayarclosing != $konten->totaldibayarsbm){
                $jumlahcostsharingjamkesdaranap = $konten->totaldibayarsbm;
                $voljumlahcostsharingjamkesdaranap++;
                $cekjumlah = $konten->namaproduk;
            }

            else if(($konten->idkelompokpasien == 1 || $konten->idkelompokpasien == 12) && $konten->objectdepartemenfk != 16 && $konten->objectcarabayarfk == 1 && $konten->idcarabayar2 != null){
                $jumlahtunairajal = $konten->totaldibayarsbm;
                $voljumlahtunairajal++;
                $cekjumlah = $konten->namaproduk;
            }

            else if(($konten->idkelompokpasien == 1 || $konten->idkelompokpasien == 12) && $konten->objectdepartemenfk == 16 && $konten->objectcarabayarfk == 1 && $konten->idcarabayar2 != null){
                $jumlahtunairanap = $konten->totaldibayarsbm;
                $voljumlahtunairanap++;
                $cekjumlah = $konten->namaproduk;
            }

            else if(($konten->idkelompokpasien == 1 || $konten->idkelompokpasien == 12) && $konten->objectdepartemenfk != 16 && $konten->objectcarabayarfk == 3 && $konten->idcarabayar2 != null){
                $jumlahtransferrajal = $konten->totaldibayarsbm;
                $voljumlahtransferrajal++;
                $cekjumlah = $konten->namaproduk;
            }

            else if(($konten->idkelompokpasien == 1 || $konten->idkelompokpasien == 12) && $konten->objectdepartemenfk == 16 && $konten->objectcarabayarfk == 3 && $konten->idcarabayar2 != null){
                $jumlahtransferranap = $konten->totaldibayarsbm;
                $voljumlahtransferranap++;
                $cekjumlah = $konten->namaproduk;
            }

            else if($konten->objectkelompoktransaksifk == 143){
                $jumlahsewakalandra += $konten->totaldibayarclosing;
                $voljumlahsewakalandra++;
                $cekjumlah = $konten->namaproduk;
            }

            else if(($konten->idruangan == 752 || $konten->idruangan == 785 || $konten->idruangan == 890) && ($konten->idproduk == 5006382 || $konten->idproduk == 5006383)){
                $jumlahperiksajiwa += $konten->totaldibayarclosing;
                $voljumlahperiksajiwa++;
                $cekjumlah = $konten->namaproduk;
            }

            else if(($konten->idruangan == 768 && $konten->detailjenisproduk == 'KONSULTASI') || ($konten->idruangan == 789 && $konten->detailjenisproduk == 'KONSULTASI')){
                $jumlahperiksanapza += $konten->totaldibayarclosing;
                $voljumlahperiksanapza++;
                $cekjumlah = $konten->namaproduk;
            }

            else if($konten->idruangan == 758 && $konten->idproduk == 5006453){
                $jumlahperiksaumum += $konten->totaldibayarclosing;
                $voljumlahperiksaumum++;
                $cekjumlah = $konten->namaproduk;
            }

            else if($konten->idruangan == 759 && $konten->idproduk == 5006463){
                $jumlahperiksagigi += $konten->totaldibayarclosing;
                $voljumlahperiksagigi++;
                $cekjumlah = $konten->namaproduk;
            }

            else if($konten->idruangan == 756 && ($konten->idproduk == 5006289 || $konten->idproduk == 5006504)){
                $jumlahperiksadalam += $konten->totaldibayarclosing;
                $voljumlahperiksadalam++;
                $cekjumlah = $konten->namaproduk;
            }

            else if(($konten->idruangan == 753 && ($konten->idproduk == 5006289 || $konten->idproduk == 5006504)) || ($konten->idruangan == 775 && ($konten->idproduk == 5006289 || $konten->idproduk == 5006504)) || ($konten->idruangan == 785 && ($konten->idproduk == 5006289 || $konten->idproduk == 5006504))){
                $jumlahperiksaanak += $konten->totaldibayarclosing;
                $voljumlahperiksaanak++;
                $cekjumlah = $konten->namaproduk;
            }

            else if($konten->idruangan == 755 && ($konten->idproduk == 5006289 || $konten->idproduk == 5006504)){
                $jumlahperiksasyaraf += $konten->totaldibayarclosing;
                $voljumlahperiksasyaraf++;
                $cekjumlah = $konten->namaproduk;
            }

            else if(($konten->idruangan == 786 && ($konten->idproduk == 5006289 || $konten->idproduk == 5006504)) || ($konten->idruangan == 761 && ($konten->idproduk == 5006289 || $konten->idproduk == 5006504))|| ($konten->idruangan == 773 )){
                $jumlahperiksaelektromedik += $konten->totaldibayarclosing;
                $voljumlahperiksaelektromedik++;
                $cekjumlah = $konten->namaproduk;
            }

            else if($konten->idruangan == 765 && $konten->idproduk == 5007076){
                $jumlahperiksaigdjiwa += $konten->totaldibayarclosing;
                $voljumlahperiksaigdjiwa++;
                $cekjumlah = $konten->namaproduk;
            }

            else if($konten->idruangan == 29 && $konten->idproduk == 5007076){
                $jumlahperiksaigdnonjiwa += $konten->totaldibayarclosing;
                $voljumlahperiksaigdnonjiwa++;
                $cekjumlah = $konten->namaproduk;
            }

            else if($konten->detailjenisproduk == 'Pendaftaran'){
                $jumlahdipam += $konten->totaldibayarclosing;
                $voljumlahdipam++;
                $cekjumlah = $konten->namaproduk;
            }
            // yg 764 itu ruangan
            //jadi semua produk yg ada di ruangan 764, 770, 788 masuk ke kir
            else if(($konten->idruangan == 764 || $konten->idruangan == 770 || $konten->idruangan == 771 || $konten->idruangan == 788) && $konten->isobat != 't' && ($konten->detailjenisproduk == 'PENUNJANG' || $konten->detailjenisproduk == 'Administrasi' || $konten->detailjenisproduk == 'TENAGA AHLI')){
                $jumlahkir += $konten->totaldibayarclosing;
                $voljumlahkir++;
                $cekjumlah = $konten->namaproduk;
            }

            else if(($konten->idruangan == 767 || $konten->idruangan == 791 || $konten->idruangan == 807) && $konten->isobat != 't'){
                $jumlahpsikologi += $konten->totaldibayarclosing;
                $voljumlahpsikologi++;
                $cekjumlah = $konten->namaproduk;
            }

            else if(($konten->idruangan == 784 && $konten->isobat != 't') || $konten->idproduk == 5006180 || $konten->idproduk == 5006767 || $konten->idproduk == 5007130 || $konten->idproduk == 5006768){
                $jumlahgizi += $konten->totaldibayarclosing;
                $voljumlahgizi++;
                $cekjumlah = $konten->namaproduk;
            }
            
            else if($konten->idruangan == 575 && $konten->isobat != 't'){
                $jumlahlaboratorium += $konten->totaldibayarclosing;
                $voljumlahlaboratorium++;
                $cekjumlah = $konten->namaproduk;
            }

            else if(($konten->idruangan == 786) || ($konten->idruangan == 761) && $konten->isobat != 't'){
                $jumlahelektromedik += $konten->totaldibayarclosing;
                $voljumlahelektromedik++;
                $cekjumlah = $konten->namaproduk;
            }

            else if(($konten->idruangan == 762 &&  $konten->isobat != 't') || ($konten->idruangan == 774 &&  $konten->detailjenisproduk == 'KEPERAWATAN') || ($konten->idruangan == 777 &&  $konten->detailjenisproduk == 'KEPERAWATAN')){
                $jumlahfisioterapi += $konten->totaldibayarclosing;
                $voljumlahfisioterapi++;
                $cekjumlah = $konten->namaproduk;
            }

            else if(($konten->idruangan == 576 && $konten->isobat != 't')){
                $jumlahradiologi += $konten->totaldibayarclosing;
                $voljumlahradiologi++;
                $cekjumlah = $konten->namaproduk;
            }

            else if($konten->objectdepartemenfk == 16 && $konten->idproduk == 5008639){
                $jumlahkelassatu += $konten->totaldibayarclosing;
                $voljumlahkelassatu++;
                $cekjumlah = $konten->namaproduk;
            }

            else if($konten->objectdepartemenfk == 16 && $konten->idproduk == 5008640){
                $jumlahkelasdua += $konten->totaldibayarclosing;
                $voljumlahkelasdua++;
                $cekjumlah = $konten->namaproduk;
            }

            else if($konten->objectdepartemenfk == 16 && $konten->idproduk == 5008641){
                $jumlahkelastiga += $konten->totaldibayarclosing;
                $voljumlahkelastiga++;
                $cekjumlah = $konten->namaproduk;
            }

            else if($konten->objectdepartemenfk == 16 && $konten->idproduk == 5008638){
                $jumlahkelasvip += $konten->totaldibayarclosing;
                $voljumlahkelasvip++;
                $cekjumlah = $konten->namaproduk;
            }

            else if($konten->objectdepartemenfk == 16 &&  ($konten->idproduk == 5008643 || $konten->idproduk == 5008642)){
                $jumlahkelasuppi += $konten->totaldibayarclosing;
                $voljumlahkelasuppi++;
                $cekjumlah = $konten->namaproduk;
            }

            else if(($konten->objectdepartemenfk == 16 && $konten->idproduk == 5006029) || ($konten->objectdepartemenfk == 16 && $konten->idproduk == 5006028) || ($konten->objectdepartemenfk == 16 && $konten->idproduk == 5006027) || ($konten->objectdepartemenfk == 16 && $konten->idproduk == 5006574) || ($konten->objectdepartemenfk == 16 && $konten->idproduk == 5006030) || ($konten->objectdepartemenfk == 16 && $konten->idproduk == 5006033) || ($konten->objectdepartemenfk == 16 && $konten->idproduk == 5006191) || ($konten->objectdepartemenfk == 16 && $konten->idproduk == 5006192) || ($konten->objectdepartemenfk == 16 && $konten->idproduk == 5006573) || ($konten->objectdepartemenfk == 16 && $konten->idproduk == 5006572) || ($konten->objectdepartemenfk == 16 && $konten->idproduk == 5007108)  || ($konten->objectdepartemenfk == 16 && $konten->idproduk == 5006194) || ($konten->objectdepartemenfk == 16 && $konten->idproduk == 5006193)){
                $jumlahvisite += $konten->totaldibayarclosing;
                $voljumlahvisite++;
                $cekjumlah = $konten->namaproduk;
            }

            else if(($konten->objectdepartemenfk == 16 && $konten->isobat == 't') || ($konten->objectdepartemenfk == 16 && ($konten->idproduk == 5008651 || $konten->idproduk == 5008652 || $konten->idproduk == 5008650 || $konten->idproduk == 5008653 || $konten->idproduk == 5006759 || $konten->idproduk == 5006763 || $konten->idproduk == 5006758 || $konten->idproduk == 5006764 || $konten->idproduk == 5006761 || $konten->idproduk == 5006762 || $konten->idproduk == 5006760 || $konten->idproduk == 5006765 || $konten->idproduk == 5006757 || $konten->idproduk == 5006766 || $konten->idproduk == 4041191))){
                $jumlahobatranap += $konten->totaldibayarclosing;
                $voljumlahobatranap++;
                $cekjumlah = $konten->namaproduk;
            }

            else if($konten->objectdepartemenfk == 16 && $konten->isobat != 't'){
                $jumlahtindakanpoliranap += $konten->totaldibayarclosing;
                $voljumlahtindakanpoliranap++;
                $cekjumlah = $konten->namaproduk;
            }

            else if(($konten->idruangan == 779) || ($konten->idruangan == 780)){
                $jumlahrehabmental += $konten->totaldibayarclosing;
                $voljumlahrehabmental++;
                $cekjumlah = $konten->namaproduk;
            }

            else if($konten->idproduk == 5006041 || $konten->idproduk == 5006040 || $konten->idproduk == 5006041 
            || $konten->idproduk == 5006776 || $konten->idproduk == 5006775 || $konten->idproduk == 5008614 ){
                $jumlahperawatanjenazah += $konten->totaldibayarclosing;
                $voljumlahperawatanjenazah++;
                $cekjumlah = $konten->namaproduk;
            }
            else if($konten->idproduk == 5008622){
                $jumlahlegalisir += $konten->totaldibayarclosing;
                $voljumlahlegalisir++;
                $cekjumlah = $konten->namaproduk;
            }

            else if($konten->idproduk == 5008611){
                $jumlahsewagedungterapi += $konten->totaldibayarclosing;
                $voljumlahsewagedungterapi++;
                $cekjumlah = $konten->namaproduk;
            }

            else if($konten->idproduk == 1002122273 || $konten->idproduk == 1002122274){
                $jumlahsewagedunggrhasiainn += $konten->totaldibayarclosing;
                $voljumlahsewagedunggrhasiainn++;
                $cekjumlah = $konten->namaproduk;
            }

            else if($konten->idproduk == 5008612 || $konten->idproduk == 1002122275 || $konten->idproduk == 1002122276 || $konten->idproduk == 1002122277){
                $jumlahsewalapangan += $konten->totaldibayarclosing;
                $voljumlahsewalapangan++;
                $cekjumlah = $konten->namaproduk;
            }

            else if($konten->idproduk == 5008609 || $konten->idproduk == 5008620){
                $jumlahsewagedungdiklat += $konten->totaldibayarclosing;
                $voljumlahsewagedungdiklat++;
                $cekjumlah = $konten->namaproduk;
            }

            else if($konten->idproduk == 5008623 || $konten->idproduk == 5008624 || $konten->idproduk == 1004125343){
                $jumlahsewatempatfotocopy += $konten->totaldibayarclosing;
                $voljumlahsewatempatfotocopy++;
                $cekjumlah = $konten->namaproduk;
            }
            
            else if($konten->idproduk == 1002121435){
                // $jumlahsewatanah += $konten->totaldibayarclosing;
                // $voljumlahsewatanah++;
                // $cekjumlah = $konten->namaproduk;
                $lainlain += $konten->totaldibayarclosing;
                $vollainlain++;
                $cekjumlah = $konten->namaproduk;
            }
            else if($konten->idproduk == 5006036 || $konten->idproduk == 5006035 || $konten->idproduk == 5007117 || $konten->idproduk == 5005995 || $konten->idproduk == 5005996
            || $konten->idproduk == 5008618 ||$konten->idproduk == 5007119 ||$konten->idproduk == 5005994 ||$konten->idproduk == 5005994){
                $jumlahsewaambulan += $konten->totaldibayarclosing;
                $voljumlahsewaambulan++;
                $cekjumlah = $konten->namaproduk;
            }

            else if($konten->idproduk == 5008617){
                $jumlahsewabus += $konten->totaldibayarclosing;
                $voljumlahsewabus++;
                $cekjumlah = $konten->namaproduk;
            }

            else if($konten->idproduk == 1004125344 || $konten->idproduk == 5008631 || $konten->idproduk == 5008632 || $konten->idproduk == 5008633 || $konten->objectkelompoktransaksifk == 307){
                $parkir += $konten->totaldibayarclosing;
                $volparkir++;
                $cekjumlah = $konten->namaproduk;
            }

            else if($konten->objectkelompoktransaksifk == 306){
                $hasilketrampilan += $konten->totaldibayarclosing;
                $volhasilketrampilan++;
                $cekjumlah = $konten->namaproduk;
            }

            // else if($konten->jenisproduk == 27688 && $konten->idcarabayar2 == null){
            //     $jumlahdiklat += $konten->totaldibayarsbm;
            //     $voljumlahdiklat++;
            //     $cekjumlah = $konten->namaproduk;
            // }

            else if($konten->jenisproduk == 27688){
                $jumlahdiklat += $konten->totaldibayarsbm;
                $voljumlahdiklat++;
                $cekjumlah = $konten->namaproduk;
            }

            else if(($konten->idruangan == 765 && $konten->idproduk != 5007076 && $konten->isobat != 't') || ($konten->idruangan == 29 && $konten->idproduk != 5007076 && $konten->isobat != 't')){
                $jumlahtindakanigd += $konten->totaldibayarclosing;
                $voljumlahtindakanigd++;
                $cekjumlah = $konten->namaproduk;
            }

            else if($konten->idruangan == 759 && $konten->idproduk != 5006463 && $konten->isobat != 't'){
                $jumlahtindakangigi += $konten->totaldibayarclosing;
                $voljumlahtindakangigi++;
                $cekjumlah = $konten->namaproduk;
            }

            else if(($konten->objectdepartemenfk != 16 && $konten->isobat == 't') || ($konten->idruangan == 94 && $konten->detailjenisproduk == 'TENAGA AHLI') || ($konten->idruangan == 778)){
                $jumlahobatrajal += $konten->totaldibayarclosing;
                $voljumlahobatrajal++;
                $cekjumlah = $konten->namaproduk;
                $cekharga = $konten->totaldibayarclosing;
            }

            else if($konten->objectdepartemenfk != 16 && $konten->isobat != 't'){
                $jumlahtindakanpolirajal += $konten->totaldibayarclosing;
                $voljumlahtindakanpolirajal++;
                $cekjumlah = $konten->namaproduk;
            }

            $produk[] = array(
                'namaproduk' => $cekjumlah,
                'harga' => $cekharga,
                'nosts' => $STS->nosts
            );
            
        }

        
        
        $jumlahperiksaigd = $jumlahperiksaigdjiwa + $jumlahperiksaigdnonjiwa;
        $voljumlahperiksaigd = $voljumlahperiksaigdjiwa + $voljumlahperiksaigdnonjiwa;
        $jumlahpoliklinik = $jumlahperiksajiwa + $jumlahperiksaumum + $jumlahperiksanapza + $jumlahperiksagigi + $jumlahperiksadalam + $jumlahperiksaanak + $jumlahperiksasyaraf + $jumlahperiksaigd + $jumlahperiksaelektromedik + $jumlahcostsharingbpjsrajal + $jumlahcostsharingjamkesdarajal + $jumlahcostsharingjamkesosrajal + $jumlahtunairajal + $jumlahtransferrajal;
        $voljumlahpoliklinik = $voljumlahperiksajiwa + $voljumlahperiksaumum + $voljumlahperiksanapza + $voljumlahperiksagigi + $voljumlahperiksadalam + $voljumlahperiksaanak + $voljumlahperiksasyaraf + $voljumlahperiksaigd + $voljumlahperiksaelektromedik + $voljumlahcostsharingbpjsrajal + $voljumlahcostsharingjamkesdarajal + $voljumlahcostsharingjamkesosrajal + $voljumlahtunairajal + $voljumlahtransferrajal;
        $jumlahobatobatrajal = $jumlahobatrajal;
        $voljumlahobatobatrajal = $voljumlahobatrajal;
        $jumlahobatobatranap = $jumlahobatranap;
        $voljumlahobatobatranap = $voljumlahobatranap;
        $jumlahpenunjang = $jumlahlaboratorium + $jumlahelektromedik + $jumlahfisioterapi + $jumlahradiologi + $jumlahdiklat;
        $voljumlahpenunjang = $voljumlahlaboratorium + $voljumlahelektromedik + $voljumlahfisioterapi + $voljumlahradiologi + $voljumlahdiklat;
        $jumlahperawatanpasienranap = $jumlahkelassatu + $jumlahkelasdua + $jumlahkelastiga + $jumlahkelasvip + $jumlahkelasuppi + $jumlahcostsharingbpjsranap + $jumlahcostsharingjamkesdaranap + $jumlahcostsharingjamkesosranap + $jumlahtunairanap + $jumlahtransferranap;
        $voljumlahperawatanpasienranap = $voljumlahkelassatu + $voljumlahkelasdua + $voljumlahkelastiga + $voljumlahkelasvip + $voljumlahkelasuppi + $voljumlahcostsharingbpjsranap + $voljumlahcostsharingjamkesdaranap + $voljumlahcostsharingjamkesosranap + $voljumlahtunairanap + $voljumlahtransferranap;
        $jumlahlainlain = $jumlahlegalisir + $jumlahsewagedungterapi + $jumlahsewalapangan + $jumlahsewagedungdiklat + $jumlahsewagedunggrhasiainn + $jumlahsewatanah + $jumlahsewakalandra + $jumlahsewatempatfotocopy + $jumlahsewamanekin + $jumlahsewaambulan + $jumlahsewabus + $hasilketrampilan + $parkir + $lainlain;
        $voljumlahlainlain = $voljumlahlegalisir + $voljumlahsewagedungterapi + $voljumlahsewalapangan + $voljumlahsewagedungdiklat + $voljumlahsewagedunggrhasiainn + $voljumlahsewatanah + $voljumlahsewakalandra + $voljumlahsewatempatfotocopy + $voljumlahsewamanekin + $voljumlahsewaambulan + $voljumlahsewabus + $volhasilketrampilan + $volparkir + $vollainlain;

        
        
        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->kdrekening = '4.1.4.16.01';
        $STSD->uraian = 'PENDAPATAN USAHA BLUD';
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->kdrekening = '4.1.4.16.01';
        $STSD->uraian = 'JASA LAYANAN RUMAH SAKIT';
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->nomer = '01';
        $STSD->uraian = 'RAWAT JALAN';
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'KUNJUNGAN POLIKLINIK';
        $STSD->kolom2 = $jumlahpoliklinik;
        $STSD->vol = $voljumlahpoliklinik;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'PERIKSA DOKTER SPESIALIS JIWA';
        $STSD->kolom1 = $jumlahperiksajiwa;
        $STSD->vol = $voljumlahperiksajiwa;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)';
        $STSD->kolom1 = $jumlahperiksanapza;
        $STSD->vol = $voljumlahperiksanapza;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'PERIKSA DOKTER UMUM';
        $STSD->kolom1 = $jumlahperiksaumum;
        $STSD->vol = $voljumlahperiksaumum;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'PERIKSA DOKTER GIGI';
        $STSD->kolom1 = $jumlahperiksagigi;
        $STSD->vol = $voljumlahperiksagigi;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'PERIKSA DOKTER PENYAKIT DALAM';
        $STSD->kolom1 = $jumlahperiksadalam;
        $STSD->vol = $voljumlahperiksadalam;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'PERIKSA DOKTER ANAK';
        $STSD->kolom1 = $jumlahperiksaanak;
        $STSD->vol = $voljumlahperiksaanak;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'PERIKSA DOKTER SYARAF';
        $STSD->kolom1 = $jumlahperiksasyaraf;
        $STSD->vol = $voljumlahperiksasyaraf;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)';
        $STSD->kolom1 = $jumlahperiksaelektromedik;
        $STSD->vol = $voljumlahperiksaelektromedik;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'PERIKSA DOKTER IGD';
        $STSD->kolom1 = $jumlahperiksaigd;
        $STSD->vol = $voljumlahperiksaigd;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'subkonten';
        $STSD->uraian = 'PERIKSA DOKTER IGD JIWA';
        $STSD->kolom1 = $jumlahperiksaigdjiwa;
        $STSD->vol = $voljumlahperiksaigdjiwa;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'subkonten';
        $STSD->uraian = 'PERIKSA DOKTER IGD NON JIWA';
        $STSD->kolom1 = $jumlahperiksaigdnonjiwa;
        $STSD->vol = $voljumlahperiksaigdnonjiwa;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'subkonten';
        $STSD->uraian = 'COST SHARING BPJS';
        $STSD->kolom1 = $jumlahcostsharingbpjsrajal;
        $STSD->vol = $voljumlahcostsharingbpjsrajal;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'subkonten';
        $STSD->uraian = 'COST SHARING JAMKESDA BANTUL';
        $STSD->kolom1 = $jumlahcostsharingjamkesdarajal;
        $STSD->vol = $voljumlahcostsharingjamkesdarajal;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'subkonten';
        $STSD->uraian = 'COST SHARING JAMKESOS';
        $STSD->kolom1 = $jumlahcostsharingjamkesosrajal;
        $STSD->vol = $voljumlahcostsharingjamkesosrajal;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'subkonten';
        $STSD->uraian = 'PEMBAYARAN TUNAI PASIEN RAJAL';
        $STSD->kolom1 = $jumlahtunairajal;
        $STSD->vol = $voljumlahtunairajal;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'subkonten';
        $STSD->uraian = 'PEMBAYARAN TRANSFER PASIEN RAJAL';
        $STSD->kolom1 = $jumlahtransferrajal;
        $STSD->vol = $voljumlahtransferrajal;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'DIPAM/PENDAFTARAN';
        $STSD->kolom2 = $jumlahdipam;
        $STSD->vol = $voljumlahdipam;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'TINDAKAN MEDIK POLIKLINIK';
        $STSD->kolom2 = $jumlahtindakanpolirajal;
        $STSD->vol = $voljumlahtindakanpolirajal;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'TINDAKAN MEDIK IGD';
        $STSD->kolom2 = $jumlahtindakanigd;
        $STSD->vol = $voljumlahtindakanigd;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'TINDAKAN MEDIK PASIEN GIGI';
        $STSD->kolom2 = $jumlahtindakangigi;
        $STSD->vol = $voljumlahtindakangigi;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'OBAT-OBATAN';
        $STSD->kolom2 = $jumlahobatobatrajal;
        $STSD->vol = $voljumlahobatobatrajal;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'subkonten';
        $STSD->uraian = 'Obat Rajal Umum';
        $STSD->kolom1 = $jumlahobatrajal;
        $STSD->vol = $voljumlahobatrajal;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'SURAT KETERANGAN (KIR)';
        $STSD->kolom2 = $jumlahkir;
        $STSD->vol = $voljumlahkir;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'PSIKOLOGI';
        $STSD->kolom2 = $jumlahpsikologi;
        $STSD->vol = $voljumlahpsikologi;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'KONSULTASI GIZI';
        $STSD->kolom2 = $jumlahgizi;
        $STSD->vol = $voljumlahgizi;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->nomer = '02';
        $STSD->uraian = 'PENUNJANG';
        $STSD->kolom2 = $jumlahpenunjang;
        $STSD->vol = $voljumlahpenunjang;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'LABORATORIUM';
        $STSD->kolom1 = $jumlahlaboratorium;
        $STSD->vol = $voljumlahlaboratorium;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'ELEKTROMEDIK';
        $STSD->kolom1 = $jumlahelektromedik;
        $STSD->vol = $voljumlahelektromedik;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'FISIOTERAPY';
        $STSD->kolom1 = $jumlahfisioterapi;
        $STSD->vol = $voljumlahfisioterapi;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'RADIOLOGI';
        $STSD->kolom1 = $jumlahradiologi;
        $STSD->vol = $voljumlahradiologi;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'DIKLAT';
        $STSD->kolom1 = $jumlahdiklat;
        $STSD->vol = $voljumlahdiklat;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->nomer = '03';
        $STSD->uraian = 'RAWAT INAP';
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'PERAWATAN PASIEN';
        $STSD->kolom2 = $jumlahperawatanpasienranap;
        $STSD->vol = $voljumlahperawatanpasienranap;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'subkonten';
        $STSD->uraian = 'VIP';
        $STSD->kolom1 = $jumlahkelasvip;
        $STSD->vol = $voljumlahkelasvip;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'subkonten';
        $STSD->uraian = 'Kelas I';
        $STSD->kolom1 = $jumlahkelassatu;
        $STSD->vol = $voljumlahkelassatu;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'subkonten';
        $STSD->uraian = 'Kelas UPPI';
        $STSD->kolom1 = $jumlahkelasuppi;
        $STSD->vol = $voljumlahkelasuppi;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'subkonten';
        $STSD->uraian = 'Kelas II';
        $STSD->kolom1 = $jumlahkelasdua;
        $STSD->vol = $voljumlahkelasdua;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'subkonten';
        $STSD->uraian = 'Kelas III';
        $STSD->kolom1 = $jumlahkelastiga;
        $STSD->vol = $voljumlahkelastiga;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'subkonten';
        $STSD->uraian = 'Cost Sharing BPJS';
        $STSD->kolom1 = $jumlahcostsharingbpjsranap;
        $STSD->vol = $voljumlahcostsharingbpjsranap;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'subkonten';
        $STSD->uraian = 'Cost Sharing Jamkesda Bantul';
        $STSD->kolom1 = $jumlahcostsharingjamkesdaranap;
        $STSD->vol = $voljumlahcostsharingjamkesdaranap;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'subkonten';
        $STSD->uraian = 'Cost Sharing Jamkesos';
        $STSD->kolom1 = $jumlahcostsharingjamkesosranap;
        $STSD->vol = $voljumlahcostsharingjamkesosranap;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'subkonten';
        $STSD->uraian = 'Pembayaran Tunai Pasien Ranap';
        $STSD->kolom1 = $jumlahtunairanap;
        $STSD->vol = $voljumlahtunairanap;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'subkonten';
        $STSD->uraian = 'Pembayaran Transfer Pasien Ranap';
        $STSD->kolom1 = $jumlahtransferranap;
        $STSD->vol = $voljumlahtransferranap;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'OBAT-OBATAN RANAP';
        $STSD->kolom2 = $jumlahobatobatranap;
        $STSD->vol = $voljumlahobatobatranap;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'subkonten';
        $STSD->uraian = 'Obat Ranap Umum';
        $STSD->kolom1 = $jumlahobatranap;
        $STSD->vol = $voljumlahobatranap;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'TINDAKAN MEDIK RANAP';
        $STSD->kolom2 = $jumlahtindakanpoliranap;
        $STSD->vol = $voljumlahtindakanpoliranap;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'VISITE DOKTER';
        $STSD->kolom2 = $jumlahvisite;
        $STSD->vol = $voljumlahvisite;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'REHABILITASI MENTAL';
        $STSD->kolom2 = $jumlahrehabmental;
        $STSD->vol = $voljumlahrehabmental;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'PERAWATAN JENAZAH';
        $STSD->kolom2 = $jumlahperawatanjenazah;
        $STSD->vol = $voljumlahperawatanjenazah;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->nomer = '04';
        $STSD->uraian = 'LAIN-LAIN PENDAPATAN BLUD YANG SAH';
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->kolom2 = $jumlahlainlain;
        $STSD->vol = $voljumlahlainlain;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'LEGALISIR';
        $STSD->kolom1 = $jumlahlegalisir;
        $STSD->vol = $voljumlahlegalisir;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'SEWA GEDUNG TERAPI';
        $STSD->kolom1 = $jumlahsewagedungterapi;
        $STSD->vol = $voljumlahsewagedungterapi;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'SEWA LAPANGAN SEPAK BOLA';
        $STSD->kolom1 = $jumlahsewalapangan;
        $STSD->vol = $voljumlahsewalapangan;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'SEWA GEDUNG DIKLAT';
        $STSD->kolom1 = $jumlahsewagedungdiklat;
        $STSD->vol = $voljumlahsewagedungdiklat;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'SEWA GEDUNG GRHASIA INN';
        $STSD->kolom1 = $jumlahsewagedunggrhasiainn;
        $STSD->vol = $voljumlahsewagedunggrhasiainn;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'SEWA TANAH PERTANIAN';
        $STSD->kolom1 = $jumlahsewatanah;
        $STSD->vol = $voljumlahsewatanah;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'SEWA KALANDRA';
        $STSD->kolom1 = $jumlahsewakalandra;
        $STSD->vol = $voljumlahsewakalandra;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'SEWA TEMPAT FOTOCOPY';
        $STSD->kolom1 = $jumlahsewatempatfotocopy;
        $STSD->vol = $voljumlahsewatempatfotocopy;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'SEWA MANEKIN';
        $STSD->kolom1 = $jumlahsewamanekin;
        $STSD->vol = $voljumlahsewamanekin;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'SEWA AMBULAN/MOBIL JENAZAH';
        $STSD->kolom1 = $jumlahsewaambulan;
        $STSD->vol = $voljumlahsewaambulan;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'SEWA BUS';
        $STSD->kolom1 = $jumlahsewabus;
        $STSD->vol = $voljumlahsewabus;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'HASIL KETRAMPILAN PASIEN';
        $STSD->kolom1 = $hasilketrampilan;
        $STSD->vol = $volhasilketrampilan;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'PARKIR';
        $STSD->kolom1 = $parkir;
        $STSD->vol = $volparkir;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'LAIN-LAIN';
        $STSD->kolom1 = $lainlain;
        $STSD->vol = $vollainlain;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $grandtotal = $jumlahpoliklinik + $jumlahdipam + $jumlahtindakanpolirajal + $jumlahtindakanigd + $jumlahtindakangigi + $jumlahobatobatrajal + $jumlahkir + $jumlahpsikologi + $jumlahgizi + $jumlahpenunjang + $jumlahperawatanpasienranap + $jumlahobatobatranap + $jumlahtindakanpoliranap + $jumlahvisite + $jumlahrehabmental + $jumlahperawatanjenazah + $jumlahugdranap + $jumlahjiwaranap + $jumlahnapzaranap + $jumlahlainlain;

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'JUMLAH';
        $STSD->kolom2 = $grandtotal;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        if($STSD->save()){
            $transMsg = 'Simpan STS Berhasil';
        }

        $sts = DB::select(DB::raw("select 
        headersts.namapasien,headersts.carabayarfk, sts.tglpenerimaan, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.kolom1, stsd.kolom2, sts.nosts, sts.terbilang
        from 
        surattandasetoran_t as sts 
        inner join surattandasetorandetail_t stsd on stsd.objectstsfk = sts.nosts
        inner join lateral(
                    select 
                        COALESCE(ps.namapasien ,sp.namapasien_klien) namapasien,sck.carabayarfk 
                    from strukclosing_t sc
                    inner join strukclosingkasir_t sck on sc.norec = sck.noclosingfk
                    inner join ststosck_t as ssc on ssc.objectsckfk = sck.norec
                    inner join strukbuktipenerimaan_t as sbm on sbm.noclosingfk = sc.norec
                    inner join strukpelayanan_t as sp on sbm.nostrukfk = sp.norec				
                    left join pasien_m as ps on ps.id = sp.nocmfk
                    where  sts.norec = ssc.objectstsfk
                    limit 1 
        ) headersts on true
        where sts.nosts = '$nosts'
        order by stsd.nourut"));

        // var_dump($data[0]->namapasien);

        $result = array(
            'data' => $sts,
        );
        
        return $this->setStatusCode(201)->respond($produk, 'Simpan STS Berhasil');

        

        // return $this->setStatusCode($result['status'])->respond($result, $transMsg);
    }

    public function saveSTSV2(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $produk = [];
        $dataLogin = $request->all();
        $iduser = '';
        $setor = $request['setoran'];
        $tahun = date('Y');
        $dataPegawaiUser = DB::select(DB::raw("select pg.id,pg.namalengkap from loginuser_s as lu
                INNER JOIN pegawai_m as pg on lu.objectpegawaifk=pg.id
                where pg.kdprofile = $idProfile and lu.id=:idLoginUser"),
            array(
                'idLoginUser' => $dataLogin['userData']['id'],
            )
        );

        foreach($dataPegawaiUser as $dat){
            $iduser = $dat->id;
        }
        
        

        $noclosing = [];
        $totalpenerimaan = 0;
        for($i=0; $i<count($setor); $i++){
            $noclosing[$i] = $setor[$i]['nopenerimaan'];
            $totalpenerimaan += $setor[$i]['totalpenerimaan'];
        }

        $total_penerimaan =0;

        $totalpenerimaan = ceil($totalpenerimaan);

        if (substr($totalpenerimaan,-3)>499){
            $total_penerimaan=round($totalpenerimaan,-3);
        } else {
            $total_penerimaan=round($totalpenerimaan,-3)+500;
        }

        $nosts = $this->generateCode(new SuratTandaSetoran, 'nosts', 11, date('ymd',strtotime($setor[0]['tanggalSTS'])),$idProfile);

        $STS = new SuratTandaSetoran();
        $STS->norec  = $STS->generateNewId();
        $STS->kdprofile = $idProfile;
        $STS->statusenabled = true;
        $STS->nosts = $nosts;
        $STS->tglpenerimaan = $setor[0]['tanggalSTS'];
        $STS->totalsetoran = $totalpenerimaan;
        $STS->totalsetoranpembulatan = $total_penerimaan;
        $STS->terbilang = $setor[0]['terbilang'];
        $STS->objectpegawaifk = $iduser;
        $STS->ismanual = null;
        $STS->save();

        // var_dump($noclosing);

        for($i=0; $i<count($setor); $i++){

            $STSK = new STStoSCK();
            $STSK->norec  = $STSK->generateNewId();
            $STSK->kdprofile = $idProfile;
            $STSK->statusenabled = true;
            $STSK->objectstsfk = $STS->norec;
            $STSK->objectscfk = $setor[$i]['scfk'];
            $STSK->objectsckfk = $setor[$i]['sckfk'];
            $STSK->save();
            
            if($STSK->save() && $STS->save()){
                $transMsg = 'Simpan STS Berhasil';
            }else{
                $transMsg = 'Simpan STS Gagal';
            }     
        }

        // konten STS Detail

        $data = DB::select(DB::raw("select distinct ru2.objectdepartemenfk objectdepartemenfk2, cb2.id idcarabayar2, kp.id idkelompokpasien, 0 objectkelompoktransaksifk, sbm.norec norecsbm, pp.norec, sc.tglclosing, ru.namaruangan, ru.id idruangan, pr.namaproduk, pr.id idproduk, pp.isobat,
        (((CASE WHEN pp.hargajual IS NULL THEN 0 ELSE pp.hargajual::float8 END - CASE WHEN pp.hargadiscount IS NULL THEN
        0 ELSE pp.hargadiscount::float8 END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN 0 ELSE pp.jasa::float8 END ) AS totaldibayarclosing,
        ru.objectdepartemenfk, sbmcr.objectcarabayarfk, sbm.totaldibayar as totaldibayarsbm, sc.noclosing, sc.tglclosing,
        sck.totaldibayar as totaldibayar,sck.carabayarfk, cb.carabayar, djp.detailjenisproduk, jpr.id as jenisproduk
        
        FROM   pasien_m ps 
                        inner join pasiendaftar_t pd on ps.id=pd.nocmfk
                        inner join antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                        inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
                        inner JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk 
                        inner JOIN ruangan_m AS ru2 ON ru2.id = pd.objectruanganlastfk 
                        left JOIN strukpelayanan_t AS sp ON sp.norec = pp.strukfk  
                        LEFT JOIN strukbuktipenerimaan_t AS sbm ON sbm.nostrukfk = sp.norec AND sbm.statusenabled = true  
                        LEFT JOIN strukbuktipenerimaancarabayar_t as sbmcr ON sbmcr.nosbmfk = sbm.norec
                        LEFT JOIN carabayar_m as cb ON cb.id = sbmcr.objectcarabayarfk
                        LEFT JOIN strukbuktipenerimaan_t AS sbm2 ON sbm2.nostrukfk = sp.norec AND sbm2.statusenabled = true and sbm2.norec <> sbm.norec 
                        LEFT JOIN strukbuktipenerimaancarabayar_t as sbmcr2 ON sbmcr2.nosbmfk = sbm2.norec
                        LEFT JOIN carabayar_m as cb2 ON cb2.id = sbmcr2.objectcarabayarfk and cb2.id <> cb.id
                        LEFT JOIN loginuser_s AS lu ON lu.id = sbm.objectpegawaipenerimafk  
                        LEFT JOIN pegawai_m AS pg ON pg.id = lu.objectpegawaifk  
                        LEFT JOIN pegawai_m AS pgdpjp ON pgdpjp.id = pd.objectpegawaifk
                        LEFT JOIN produk_m AS pr ON pr.id = pp.produkfk  
                        LEFT JOIN kelompokpasien_m AS kp ON kp.id = pd.objectkelompokpasienlastfk
                        inner join strukclosing_t as sc on sbm.noclosingfk = sc.norec
                        inner join strukclosingkasir_t as sck on sc.norec = sck.noclosingfk
                        left join detailjenisproduk_m djp on djp.id = pr.objectdetailjenisprodukfk
                        left join jenisproduk_m jpr on jpr.id = djp.objectjenisprodukfk
                        left join ststosck_t as ssc on ssc.objectsckfk = sck.norec
                        left join surattandasetoran_t as sts on sts.norec = ssc.objectstsfk
        where pd.statusenabled = true
        --and sts.statusenabled = true
        and pd.kdprofile = 30
        and sc.noclosing IN('".implode("','",$noclosing)."')
        
        union all
        
        select distinct 0 objectdepartemenfk2, cb2.id idcarabayar2, 0 idkelompokpasien, sp.objectkelompoktransaksifk, sbm.norec norecsbm, sp.norec, sc.tglclosing, ru.namaruangan, ru.id idruangan, pr.namaproduk, pr.id idproduk, pp.isobat,
        (spd.qtyproduk * spd.hargasatuan * spd.qtyoranglast)::float8 as totaldibayarclosing,
        ru.objectdepartemenfk, sbmcr.objectcarabayarfk, sbm.totaldibayar as totaldibayarsbm, sc.noclosing, sc.tglclosing,
        sck.totaldibayar as totaldibayar,sck.carabayarfk, cb.carabayar, djp.detailjenisproduk, jpr.id as jenisproduk
        from strukclosingkasir_t as sck
        inner join strukclosing_t as sc on sc.norec = sck.noclosingfk
        inner join strukbuktipenerimaan_t as sbm on sbm.noclosingfk = sc.norec
        inner join strukpelayanan_t as sp on sbm.nostrukfk = sp.norec
        inner join strukpelayanandetail_t as spd on sp.norec = spd.nostrukfk
		inner join strukbuktipenerimaancarabayar_t sbmcr on sbmcr.nosbmfk = sbm.norec
        inner join produk_m pr on pr.id=spd.objectprodukfk
        inner join carabayar_m as cb on cb.id = sck.carabayarfk
        LEFT JOIN strukbuktipenerimaan_t AS sbm2 ON sbm2.nostrukfk = sp.norec AND sbm2.statusenabled = true and sbm2.norec <> sbm.norec 
		LEFT JOIN strukbuktipenerimaancarabayar_t as sbmcr2 ON sbmcr2.nosbmfk = sbm2.norec
		LEFT JOIN carabayar_m as cb2 ON cb2.id = sbmcr2.objectcarabayarfk 
        left join detailjenisproduk_m djp on djp.id = pr.objectdetailjenisprodukfk
        left join jenisproduk_m jpr on jpr.id = djp.objectjenisprodukfk
        left join ruangan_m as ru on ru.id = spd.objectruanganasalfk
        left join pasiendaftar_t as pd on sp.noregistrasifk = pd.norec
        left join antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
        left join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
        left join ststosck_t as ssc on ssc.objectsckfk = sck.norec
        left join surattandasetoran_t as sts on sts.norec = ssc.objectstsfk
        where (sbm.keteranganlainnya = 'Pembayaran Tagihan Non Layanan' or sbm.keteranganlainnya = 'Pembayaran Diklat')
        --and sts.statusenabled = true
        and sc.noclosing IN('".implode("','",$noclosing)."')"));

        $main = DB::select(DB::raw("select mptlr.norec, pro.id as idproduk, pro.namaproduk, up.id, up.uraianpendapatan,
        up.nourut, ru.id as idruangan, ru.namaruangan, dp.id iddepartemen, dp.namadepartemen
        from mapststoruangan_m as mptlr
        inner join uraianpendapatan_m as up on up.id = mptlr.objecturaianpendapatanfk
        left join produk_m as pro on pro.id = mptlr.produkfk
        left join ruangan_m as ru on ru.id = mptlr.ruanganfk
        left join departemen_m as dp on dp.id = mptlr.departemenfk
        where mptlr.kdprofile = 30
        and mptlr.statusenabled = true
        and up.kdprofile = 30
        and up.statusenabled = true
        and up.tahun = '$tahun'
        order by up.nourut asc, up.id asc"));

        $mainaja = DB::select(DB::raw("select up.id, up.uraianpendapatan, up.nourut
        from mapststoruangan_m as mptlr
        inner join uraianpendapatan_m as up on up.id = mptlr.objecturaianpendapatanfk
        where mptlr.kdprofile = 30
        and mptlr.statusenabled = true
        and up.kdprofile = 30
        and up.statusenabled = true
        and up.tahun = '$tahun'
		group by up.id, up.uraianpendapatan, up.nourut
        order by up.nourut asc, up.id asc"));

        $uraianaja = DB::select(DB::raw("select *
        from uraianpendapatan_m as up
        where up.kdprofile = 30
        and up.statusenabled = true
        and up.tahun = '$tahun'
        order by up.nourut asc, up.id asc"));

        $jumlahcostsharingbpjsrajal = 0;
        $jumlahcostsharingjamkesdarajal = 0;
        $jumlahcostsharingjamkesosrajal = 0;
        $jumlahcostsharingbpjsranap = 0;
        $jumlahcostsharingjamkesdaranap = 0;
        $jumlahcostsharingjamkesosranap = 0;
        $jumlahtransferrajal = 0;
        $jumlahtransferranap = 0;
        $jumlahtunairajal = 0;
        $jumlahtunairanap = 0;

        $voljumlahcostsharingbpjsrajal = 0;
        $voljumlahcostsharingjamkesdarajal = 0;
        $voljumlahcostsharingjamkesosrajal = 0;
        $voljumlahcostsharingbpjsranap = 0;
        $voljumlahcostsharingjamkesdaranap = 0;
        $voljumlahcostsharingjamkesosranap = 0;
        $voljumlahtransferrajal = 0;
        $voljumlahtransferranap = 0;
        $voljumlahtunairajal = 0;
        $voljumlahtunairanap = 0;


        //tetep gabisa pakai mapping
        foreach($data as $konten){
            $cekjumlah = '';
            $cekharga = 0;
            if($konten->idkelompokpasien != 0 && $konten->idkelompokpasien != 1 && $konten->idkelompokpasien != 12 && $konten->idkelompokpasien != 18 && $konten->idkelompokpasien != 8 && $konten->objectdepartemenfk2 != 0 && $konten->objectdepartemenfk2 != 16 && $konten->totaldibayarclosing != $konten->totaldibayarsbm){
                $jumlahcostsharingbpjsrajal = $konten->totaldibayarsbm;
                $voljumlahcostsharingbpjsrajal++;
                $cekjumlah = $konten->namaproduk;
            }

            else if($konten->idkelompokpasien != 0 && $konten->idkelompokpasien != 1 && $konten->idkelompokpasien != 12 && $konten->idkelompokpasien != 18 && $konten->idkelompokpasien != 8 && $konten->objectdepartemenfk2 != 0 && $konten->objectdepartemenfk2 == 16 && $konten->totaldibayarclosing != $konten->totaldibayarsbm){
                $jumlahcostsharingbpjsranap = $konten->totaldibayarsbm;
                $voljumlahcostsharingbpjsranap++;
                $cekjumlah = $konten->namaproduk;
            }

            else if($konten->idkelompokpasien != 0 && $konten->idkelompokpasien != 1 && $konten->idkelompokpasien != 12 && $konten->idkelompokpasien == 18 && $konten->objectdepartemenfk2 != 0 && $konten->objectdepartemenfk2 != 16 && $konten->totaldibayarclosing != $konten->totaldibayarsbm){
                $jumlahcostsharingjamkesosrajal = $konten->totaldibayarsbm;
                $voljumlahcostsharingjamkesosrajal++;
                $cekjumlah = $konten->namaproduk;
            }

            else if($konten->idkelompokpasien != 0 && $konten->idkelompokpasien != 1 && $konten->idkelompokpasien != 12 && $konten->idkelompokpasien == 18 && $konten->objectdepartemenfk2 != 0 && $konten->objectdepartemenfk2 == 16 && $konten->totaldibayarclosing != $konten->totaldibayarsbm){
                $jumlahcostsharingjamkesosranap = $konten->totaldibayarsbm;
                $voljumlahcostsharingjamkesosranap++;
                $cekjumlah = $konten->namaproduk;
            }

            else if($konten->idkelompokpasien != 0 && $konten->idkelompokpasien != 1 && $konten->idkelompokpasien != 12 && $konten->idkelompokpasien == 8 && $konten->objectdepartemenfk2 != 0 && $konten->objectdepartemenfk2 != 16 && $konten->totaldibayarclosing != $konten->totaldibayarsbm){
                $jumlahcostsharingjamkesdarajal = $konten->totaldibayarsbm;
                $voljumlahcostsharingjamkesdarajal++;
                $cekjumlah = $konten->namaproduk;
            }

            else if($konten->idkelompokpasien != 0 && $konten->idkelompokpasien != 1 && $konten->idkelompokpasien != 12 && $konten->idkelompokpasien == 8 && $konten->objectdepartemenfk2 != 0 && $konten->objectdepartemenfk2 == 16 && $konten->totaldibayarclosing != $konten->totaldibayarsbm){
                $jumlahcostsharingjamkesdaranap = $konten->totaldibayarsbm;
                $voljumlahcostsharingjamkesdaranap++;
                $cekjumlah = $konten->namaproduk;
            }

            else if(($konten->idkelompokpasien == 1 || $konten->idkelompokpasien == 12) && $konten->objectdepartemenfk != 16 && $konten->objectcarabayarfk == 1 && $konten->idcarabayar2 != null){
                $jumlahtunairajal = $konten->totaldibayarsbm;
                $voljumlahtunairajal++;
                $cekjumlah = $konten->namaproduk;
            }

            else if(($konten->idkelompokpasien == 1 || $konten->idkelompokpasien == 12) && $konten->objectdepartemenfk == 16 && $konten->objectcarabayarfk == 1 && $konten->idcarabayar2 != null){
                $jumlahtunairanap = $konten->totaldibayarsbm;
                $voljumlahtunairanap++;
                $cekjumlah = $konten->namaproduk;
            }

            else if(($konten->idkelompokpasien == 1 || $konten->idkelompokpasien == 12) && $konten->objectdepartemenfk != 16 && $konten->objectcarabayarfk == 3 && $konten->idcarabayar2 != null){
                $jumlahtransferrajal = $konten->totaldibayarsbm;
                $voljumlahtransferrajal++;
                $cekjumlah = $konten->namaproduk;
            }

            else if(($konten->idkelompokpasien == 1 || $konten->idkelompokpasien == 12) && $konten->objectdepartemenfk == 16 && $konten->objectcarabayarfk == 3 && $konten->idcarabayar2 != null){
                $jumlahtransferranap = $konten->totaldibayarsbm;
                $voljumlahtransferranap++;
                $cekjumlah = $konten->namaproduk;
            }
        }

        //bisa pakai mapping
       
        $jumlah = 0;
        $vol = 0;
        $uraian = '';

        foreach($data as $konten){
            $cekjumlah = '';

            foreach($main as $row){
                $jumlah = 0;
                $vol = 0;
                $uraian = '';
                
                if($row->idproduk == $konten->idproduk && $row->iddepartemen == $konten->objectdepartemenfk){
                    $jumlah += $konten->totaldibayarclosing;
                    $vol++;
                    $cekjumlah = $konten->namaproduk;
                    $uraian = $row->uraianpendapatan;
                }
                else if($row->idproduk == $konten->idproduk && $row->idruangan == $konten->idruangan){
                    $jumlah += $konten->totaldibayarclosing;
                    $vol++;
                    $cekjumlah = $konten->namaproduk;
                    $uraian = $row->uraianpendapatan;
                }
                else if($row->idproduk == $konten->idproduk && $row->idruangan == null){
                    $jumlah += $konten->totaldibayarclosing;
                    $vol++;
                    $cekjumlah = $konten->namaproduk;
                    $uraian = $row->uraianpendapatan;
                }

                $datas[] = array(
                    'uraian' => $uraian,
                    'vol' => $vol,
                    'jumlah' => $jumlah,
                );
                
            }

        }

        $uraianfix = '';
        $volfix = 0;
        $jumlahfix = 0;
        foreach($mainaja as $mj){
            $uraianfix = '';
            $volfix = 0;
            $jumlahfix = 0;

            foreach($datas as $dt){
                if($mj->uraianpendapatan == $dt['uraian']){
                    $uraianfix = $mj->uraianpendapatan;
                    $volfix += $dt['vol'];
                    $jumlahfix += $dt['jumlah'];
                }
            }

            $datasaja[] = array(
                'uraianfix' => $uraianfix,
                'volfix' => $volfix,
                'jumlahfix' => $jumlahfix,
            );
        }

        $jl = 0;
        $vl = 0;
        foreach($uraianaja as $ua){
            $jl = 0;
            $vl = 0;
            foreach($datasaja as $da){
                if($da['uraianfix'] == $ua->uraianpendapatan){
                    $jl = $da['jumlahfix'];
                    $vl = $da['volfix'];
                }
            } 

            $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

            $STSD = new SuratTandaSetoranDetail();
            $STSD->norec  = $STSD->generateNewId();
            $STSD->kdprofile = $idProfile;
            $STSD->nourut = $newId;
            $STSD->kdrekening = $ua->kdrekening;
            $STSD->nomer = $ua->nouraian;
            $STSD->jenisdata = 'konten';
            $STSD->uraian = $ua->uraianpendapatan;
            if($ua->uraianpendapatan == 'Cost Sharing BPJS Rajal'){
                $STSD->kolom2 = $jumlahcostsharingbpjsrajal;
                $STSD->vol = $voljumlahcostsharingbpjsrajal;
            } else if($ua->uraianpendapatan == 'Cost Sharing Jamkesda Bantul Rajal'){
                $STSD->kolom2 = $jumlahcostsharingjamkesdarajal;
                $STSD->vol = $voljumlahcostsharingjamkesdarajal;
            } else if($ua->uraianpendapatan == 'Cost Sharing Jamkesos Rajal'){
                $STSD->kolom2 = $jumlahcostsharingjamkesosrajal;
                $STSD->vol = $voljumlahcostsharingjamkesosrajal;
            } else if($ua->uraianpendapatan == 'Pembayaran Tunai Pasien Rajal'){
                $STSD->kolom2 = $jumlahtunairajal;
                $STSD->vol = $voljumlahtunairajal;
            } else if($ua->uraianpendapatan == 'Pembayaran Transfer Pasien Rajal'){
                $STSD->kolom2 = $jumlahtransferrajal;
                $STSD->vol = $voljumlahtransferrajal;
            } else if($ua->uraianpendapatan == 'Cost Sharing BPJS Ranap'){
                $STSD->kolom2 = $jumlahcostsharingbpjsranap;
                $STSD->vol = $voljumlahcostsharingbpjsranap;
            } else if($ua->uraianpendapatan == 'Cost Sharing Jamkesda Bantul Ranap'){
                $STSD->kolom2 = $jumlahcostsharingjamkesdaranap;
                $STSD->vol = $voljumlahcostsharingjamkesdaranap;
            } else if($ua->uraianpendapatan == 'Cost Sharing Jamkesos Ranap'){
                $STSD->kolom2 = $jumlahcostsharingjamkesosranap;
                $STSD->vol = $voljumlahcostsharingjamkesosranap;
            } else if($ua->uraianpendapatan == 'Pembayaran Tunai Pasien Ranap'){
                $STSD->kolom2 = $jumlahtunairanap;
                $STSD->vol = $voljumlahtunairanap;
            } else if($ua->uraianpendapatan == 'Pembayaran Transfer Pasien Ranap'){
                $STSD->kolom2 = $jumlahtransferranap;
                $STSD->vol = $voljumlahtransferranap;
            } else{
                $STSD->kolom2 = $jl;
                $STSD->vol = $vl;
            }
            $STSD->statusenabled = true;
            $STSD->objectstsfk = $nosts;
            $STSD->save();
        }        
        
        

        if($STSD->save()){
            $transMsg = 'Simpan STS Berhasil';
        }

        $result = array(
            'data' => $datasaja,
        );
        
        return $this->setStatusCode(201)->respond($datasaja, 'Simpan STS Berhasil');
    }

    public function saveSTSKlaim(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $transfer = 0;
        $admin = 0;

        if(isset($request['biayatransfer'])){
            $transfer = $request['biayatransfer'];
        }  
        if(isset($request['biayaadmin'])){
            $admin = $request['biayaadmin'];
        }

        DB::beginTransaction();
        try{

        $dataLogin = $request->all();
        $iduser = '';

        $dataPegawaiUser = DB::select(DB::raw("select pg.id,pg.namalengkap from loginuser_s as lu
            INNER JOIN pegawai_m as pg on lu.objectpegawaifk=pg.id
            where pg.kdprofile = $idProfile and lu.id=:idLoginUser"),
            array(
                'idLoginUser' => $dataLogin['userData']['id'],
            )
        );

        foreach($dataPegawaiUser as $dat){
            $iduser = $dat->id;
        }

        $nosts = $this->generateCode(new SuratTandaSetoran, 'nosts', 11, date('ymd',strtotime($request['tglsts'])),$idProfile);

        $STS = new SuratTandaSetoran();
        $STS->norec  = $STS->generateNewId();
        $STS->kdprofile = $idProfile;
        $STS->statusenabled = true;
        $STS->nosts = $nosts;
        $STS->tglpenerimaan = $request['tglsts'];
        $STS->totalsetoran = $request['totalsetor'] - $transfer - $admin;
        $STS->totalsetoranpembulatan = $request['totalsetor'] - $transfer - $admin;
        $STS->terbilang = $request['terbilang'];
        $STS->objectpegawaifk = $iduser;
        $STS->keterangan = $request['uraian'];
        $STS->ismanual = null;
        $STS->save();

        for($x = 0; $x < count($request['setoran']); $x++){
            $STSR = new STStoRekapKlaim();
            $STSR->norec  = $STSR->generateNewId();
            $STSR->kdprofile = $idProfile;
            $STSR->statusenabled = true;
            $STSR->objectstsfk = $STS->norec;
            $STSR->objectrekapklaimfk = $request['setoran'][$x]['norec'];
            $STSR->save();
        }

        $jumlahbpjsrajal = 0;
        $jumlahbpjsranap = 0;
        $jumlahjamkesdarajal = 0;
        $jumlahjamkesdaranap = 0;
        $jumlahjamkesosrajal = 0;
        $jumlahjamkesosranap = 0;
        $jumlahipwlrajal = 0;
        $jumlahipwlranap = 0;
        $jumlahbpjsobat = 0;
        $jumlahjamkesdaobat = 0;
        $jumlahjamkesosobat = 0;
        $jumlahipwlobat = 0;
        $jumlahcovid = 0;

        $voljumlahbpjsrajal = 0;
        $voljumlahbpjsranap = 0;
        $voljumlahjamkesdarajal = 0;
        $voljumlahjamkesdaranap = 0;
        $voljumlahjamkesosrajal = 0;
        $voljumlahjamkesosranap = 0;
        $voljumlahipwlrajal = 0;
        $voljumlahipwlranap = 0;
        $voljumlahbpjsobat = 0;
        $voljumlahjamkesdaobat = 0;
        $voljumlahjamkesosobat = 0;
        $voljumlahipwlobat = 0;
        $voljumlahcovid = 0;
        //in(1, 2, 21, 22, 24, 25)
        for($i = 0; $i < count($request['setoran']); $i++){
            if($request['setoran'][$i]['isobat'] != true && ($request['setoran'][$i]['idkelompokpasien'] == null)){
                $jumlahbpjsranap += (int)$request['setoran'][$i]['totalsetujui'];
                $voljumlahbpjsranap++;
            }
            if($request['setoran'][$i]['objectdepartemenfk'] != 16 && $request['setoran'][$i]['isobat'] != true && ($request['setoran'][$i]['idkelompokpasien'] == 1 || $request['setoran'][$i]['idkelompokpasien'] == 2 || $request['setoran'][$i]['idkelompokpasien'] == 21 || $request['setoran'][$i]['idkelompokpasien'] == 22 || $request['setoran'][$i]['idkelompokpasien'] == 24 || $request['setoran'][$i]['idkelompokpasien'] == 25)){
                $jumlahbpjsrajal += (int)$request['setoran'][$i]['totalsetujui'];
                $voljumlahbpjsrajal++;
            }
            if($request['setoran'][$i]['objectdepartemenfk'] == 16 && $request['setoran'][$i]['isobat'] != true && ($request['setoran'][$i]['idkelompokpasien'] == 1 || $request['setoran'][$i]['idkelompokpasien'] == 2 || $request['setoran'][$i]['idkelompokpasien'] == 21 || $request['setoran'][$i]['idkelompokpasien'] == 22 || $request['setoran'][$i]['idkelompokpasien'] == 24 || $request['setoran'][$i]['idkelompokpasien'] == 25)){
                $jumlahbpjsranap += (int)$request['setoran'][$i]['totalsetujui'];
                $voljumlahbpjsranap++;
            }
            
            if($request['setoran'][$i]['objectdepartemenfk'] != 16 && $request['setoran'][$i]['isobat'] != true && $request['setoran'][$i]['idkelompokpasien'] == 8){
                $jumlahjamkesdarajal += (int)$request['setoran'][$i]['totalsetujui'];
                $voljumlahjamkesdarajal++;
            }
            if($request['setoran'][$i]['objectdepartemenfk'] == 16 && $request['setoran'][$i]['isobat'] != true && $request['setoran'][$i]['idkelompokpasien'] == 8){
                $jumlahjamkesdaranap += (int)$request['setoran'][$i]['totalsetujui'];
                $voljumlahjamkesdaranap++;
            }
            if($request['setoran'][$i]['objectdepartemenfk'] != 16 && $request['setoran'][$i]['isobat'] != true && $request['setoran'][$i]['idkelompokpasien'] == 18){
                $jumlahjamkesosrajal += (int)$request['setoran'][$i]['totalsetujui'];
                $voljumlahjamkesosrajal++;
            }
            if($request['setoran'][$i]['objectdepartemenfk'] == 16 && $request['setoran'][$i]['isobat'] != true && $request['setoran'][$i]['idkelompokpasien'] == 18){
                $jumlahjamkesosranap += (int)$request['setoran'][$i]['totalsetujui'];
                $voljumlahjamkesosranap++;
            }
            if($request['setoran'][$i]['objectdepartemenfk'] != 16 && $request['setoran'][$i]['isobat'] != true && $request['setoran'][$i]['idkelompokpasien'] == 4){
                $jumlahipwlrajal += (int)$request['setoran'][$i]['totalsetujui'];
                $voljumlahipwlrajal++;
            }
            if($request['setoran'][$i]['objectdepartemenfk'] == 16 && $request['setoran'][$i]['isobat'] != true && $request['setoran'][$i]['idkelompokpasien'] == 4){
                $jumlahipwlranap += (int)$request['setoran'][$i]['totalsetujui'];
                $voljumlahipwlranap++;
            }
            if($request['setoran'][$i]['idkelompokpasien'] == 16){
                $jumlahcovid += (int)$request['setoran'][$i]['totalsetujui'];
                $voljumlahcovid++;
            }
            

            if($request['setoran'][$i]['isobat'] == true && ($request['setoran'][$i]['idkelompokpasien'] == 1 || $request['setoran'][$i]['idkelompokpasien'] == 2 || $request['setoran'][$i]['idkelompokpasien'] == 21 || $request['setoran'][$i]['idkelompokpasien'] == 22 || $request['setoran'][$i]['idkelompokpasien'] == 24 || $request['setoran'][$i]['idkelompokpasien'] == 25 || $request['setoran'][$i]['idkelompokpasien'] == null) && $request['setoran'][$i]['nosep'] != '-' && $request['setoran'][$i]['nosep'] != null){
                $jumlahbpjsobat += (int)$request['setoran'][$i]['totalsetujui'];
                $voljumlahbpjsobat++;
            }
            if($request['setoran'][$i]['isobat'] == true && $request['setoran'][$i]['idkelompokpasien'] == 8){
                $jumlahjamkesdaobat += (int)$request['setoran'][$i]['totalsetujui'];
                $voljumlahjamkesdaobat++;
            }
            if($request['setoran'][$i]['isobat'] == true && $request['setoran'][$i]['idkelompokpasien'] == 18){
                $jumlahjamkesosobat += (int)$request['setoran'][$i]['totalsetujui'];
                $voljumlahjamkesosobat++;
            }
            if($request['setoran'][$i]['isobat'] == true && $request['setoran'][$i]['idkelompokpasien'] == 4){
                $jumlahipwlobat += (int)$request['setoran'][$i]['totalsetujui'];
                $voljumlahipwlobat++;
            }
        }

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->kdrekening = '4.1.4.16.01';
        $STSD->uraian = 'PENDAPATAN USAHA BLUD';
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->kdrekening = '4.1.4.16.01';
        $STSD->uraian = 'JASA LAYANAN RUMAH SAKIT';
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->nomer = '01';
        $STSD->uraian = 'RAWAT JALAN';
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'RAWAT JALAN BPJS';
        $STSD->kolom2 = $jumlahbpjsrajal;
        $STSD->vol = $voljumlahbpjsrajal;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'RAWAT JALAN Jamkesda';
        $STSD->kolom2 = $jumlahjamkesdarajal;
        $STSD->vol = $voljumlahjamkesdarajal;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'RAWAT JALAN Jamkesos';
        $STSD->kolom2 = $jumlahjamkesosrajal;
        $STSD->vol = $voljumlahjamkesosrajal;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'RAWAT JALAN IPWL';
        $STSD->kolom2 = $jumlahipwlrajal;
        $STSD->vol = $voljumlahipwlrajal;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'OBAT-OBATAN BPJS';
        $STSD->kolom2 = $jumlahbpjsobat;
        $STSD->vol = $voljumlahbpjsobat;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'OBAT-OBATAN Jamkesda';
        $STSD->kolom2 = $jumlahjamkesdaobat;
        $STSD->vol = $voljumlahjamkesdaobat;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'OBAT-OBATAN Jamkesos';
        $STSD->kolom2 = $jumlahjamkesosobat;
        $STSD->vol = $voljumlahjamkesosobat;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'OBAT-OBATAN IPWL';
        $STSD->kolom2 = $jumlahipwlobat;
        $STSD->vol = $voljumlahipwlobat;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'KUNJUNGAN POLIKLINIK';
        $STSD->kolom2 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'PERIKSA DOKTER SPESIALIS JIWA';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'PERIKSA DOKTER UMUM';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'PERIKSA DOKTER GIGI';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'PERIKSA DOKTER PENYAKIT DALAM';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'PERIKSA DOKTER ANAK';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'PERIKSA DOKTER SYARAF';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'PERIKSA DOKTER IGD';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'subkonten';
        $STSD->uraian = 'PERIKSA DOKTER IGD JIWA';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'subkonten';
        $STSD->uraian = 'PERIKSA DOKTER IGD NON JIWA';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'DIPAM/PENDAFTARAN';
        $STSD->kolom2 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'TINDAKAN MEDIK POLIKLINIK';
        $STSD->kolom2 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'TINDAKAN MEDIK IGD';
        $STSD->kolom2 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'TINDAKAN MEDIK PASIEN GIGI';
        $STSD->kolom2 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD ->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'OBAT-OBATAN';
        $STSD->kolom2 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'subkonten';
        $STSD->uraian = 'Obat Rajal Umum';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'SURAT KETERANGAN (KIR)';
        $STSD->kolom2 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'PSIKOLOGI';
        $STSD->kolom2 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'KONSULTASI GIZI';
        $STSD->kolom2 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->nomer = '02';
        $STSD->uraian = 'PENUNJANG';
        $STSD->kolom2 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'LABORATORIUM';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'ELEKTROMEDIK';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'FISIOTERAPY';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'RADIOLOGI';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'DIKLAT';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->nomer = '03';
        $STSD->uraian = 'RAWAT INAP';
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'RAWAT INAP BPJS';
        $STSD->kolom2 = $jumlahbpjsranap;
        $STSD->vol = $voljumlahbpjsranap;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'RAWAT INAP Jamkesda';
        $STSD->kolom2 = $jumlahjamkesdaranap;
        $STSD->vol = $voljumlahjamkesdaranap;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'RAWAT INAP Jamkesos';
        $STSD->kolom2 = $jumlahjamkesosranap;
        $STSD->vol = $voljumlahjamkesosranap;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'RAWAT INAP IPWL';
        $STSD->kolom2 = $jumlahipwlranap;
        $STSD->vol = $voljumlahipwlranap;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'PERAWATAN PASIEN';
        $STSD->kolom2 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'subkonten';
        $STSD->uraian = 'VIP';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'subkonten';
        $STSD->uraian = 'Kelas I';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'subkonten';
        $STSD->uraian = 'Kelas UPPI';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'subkonten';
        $STSD->uraian = 'Kelas II';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'subkonten';
        $STSD->uraian = 'Kelas III';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'OBAT-OBATAN RANAP';
        $STSD->kolom2 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'subkonten';
        $STSD->uraian = 'Obat Ranap Umum';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'TINDAKAN MEDIK RANAP';
        $STSD->kolom2 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'VISITE DOKTER';
        $STSD->kolom2 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'REHABILITASI MENTAL';
        $STSD->kolom2 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'PERAWATAN JENAZAH';
        $STSD->kolom2 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'Klaim Covid';
        $STSD->kolom2 = $jumlahcovid;
        $STSD->vol = $voljumlahcovid;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->nomer = '04';
        $STSD->uraian = 'LAIN-LAIN PENDAPATAN BLUD YANG SAH';
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->kolom2 = 0;
        $STSD->vol = 0;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'LEGALISIR';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'SEWA GEDUNG TERAPI';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'SEWA LAPANGAN SEPAK BOLA';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'SEWA GEDUNG DIKLAT';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'SEWA GEDUNG GRHASIA INN';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'SEWA TANAH PERTANIAN';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'SEWA KALANDRA';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'SEWA TEMPAT FOTOCOPY';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'SEWA MANEKIN';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'SEWA AMBULAN/MOBIL JENAZAH';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'SEWA BUS';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'HASIL KETRAMPILAN PASIEN';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'PARKIR';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'LAIN-LAIN';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'JUMLAH KLAIM';
        $STSD->kolom2 = $jumlahbpjsrajal + $jumlahbpjsranap + $jumlahjamkesdarajal + $jumlahjamkesdaranap + $jumlahjamkesosrajal + $jumlahjamkesosranap + $jumlahipwlrajal + $jumlahipwlranap + $jumlahbpjsobat + $jumlahjamkesdaobat + $jumlahjamkesosobat + $jumlahipwlobat + $jumlahcovid;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        if(isset($request['biayatransfer'])){
            $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

            $STSD = new SuratTandaSetoranDetail();
            $STSD->norec  = $STSD->generateNewId();
            $STSD->kdprofile = $idProfile;
            $STSD->nourut = $newId;
            $STSD->jenisdata = 'konten';
            $STSD->uraian = 'BIAYA TRANSFER';
            $STSD->kolom2 = $request['biayatransfer'];
            $STSD->statusenabled = true;
            $STSD->objectstsfk = $nosts;
            $STSD->save();
        } 

        
        if(isset($request['biayaadmin'])){
            $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

            $STSD = new SuratTandaSetoranDetail();
            $STSD->norec  = $STSD->generateNewId();
            $STSD->kdprofile = $idProfile;
            $STSD->nourut = $newId;
            $STSD->jenisdata = 'konten';
            $STSD->uraian = 'BIAYA ADMINISTRASI BANK';
            $STSD->kolom2 = $request['biayaadmin'];
            $STSD->statusenabled = true;
            $STSD->objectstsfk = $nosts;
            $STSD->save();
        }

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'JUMLAH NETTO';
        $STSD->kolom2 = $jumlahbpjsrajal + $jumlahbpjsranap + $jumlahjamkesdarajal + $jumlahjamkesdaranap + $jumlahjamkesosrajal + $jumlahjamkesosranap + $jumlahipwlrajal + $jumlahipwlranap + $jumlahbpjsobat + $jumlahjamkesdaobat + $jumlahjamkesosobat + $jumlahipwlobat + $jumlahcovid - $transfer - $admin;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $transStatus = 'true';
        } catch (\Exception $e) {
             $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $STSD,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'line'=> $e->getLine(),
                'message'=> $e->getMessage(),
                'as' => '@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveSTSManual(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        DB::beginTransaction();
        try{

        $dataLogin = $request->all();
        $iduser = '';

        $dataPegawaiUser = DB::select(DB::raw("select pg.id,pg.namalengkap from loginuser_s as lu
            INNER JOIN pegawai_m as pg on lu.objectpegawaifk=pg.id
            where pg.kdprofile = $idProfile and lu.id=:idLoginUser"),
            array(
                'idLoginUser' => $dataLogin['userData']['id'],
            )
        );

        foreach($dataPegawaiUser as $dat){
            $iduser = $dat->id;
        }

        $nosts = $this->generateCode(new SuratTandaSetoran, 'nosts', 11, date('ymd',strtotime($request['tglsts'])),$idProfile);

        $STS = new SuratTandaSetoran();
        $STS->norec  = $STS->generateNewId();
        $STS->kdprofile = $idProfile;
        $STS->statusenabled = true;
        $STS->nosts = $nosts;
        $STS->tglpenerimaan = $request['tglsts'];
        $STS->totalsetoran = $request['jumlahlain'] + $request['jumlahranap'] + $request['jumlahpenunjang'];
        $STS->totalsetoranpembulatan = $request['jumlahlain'] + + $request['jumlahranap'] + $request['jumlahpenunjang'];
        $STS->terbilang = $request['terbilang'];
        $STS->objectpegawaifk = $iduser;
        $STS->keterangan = $request['uraian'];
        $STS->ismanual = true;
        $STS->save();




        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->kdrekening = '4.1.4.16.01';
        $STSD->uraian = 'PENDAPATAN USAHA BLUD';
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->kdrekening = '4.1.4.16.01';
        $STSD->uraian = 'JASA LAYANAN RUMAH SAKIT';
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->nomer = '01';
        $STSD->uraian = 'RAWAT JALAN';
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'KUNJUNGAN POLIKLINIK';
        $STSD->kolom2 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'PERIKSA DOKTER SPESIALIS JIWA';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'PERIKSA DOKTER UMUM';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'PERIKSA DOKTER GIGI';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'PERIKSA DOKTER PENYAKIT DALAM';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'PERIKSA DOKTER ANAK';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'PERIKSA DOKTER SYARAF';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'PERIKSA DOKTER IGD';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'subkonten';
        $STSD->uraian = 'PERIKSA DOKTER IGD JIWA';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'subkonten';
        $STSD->uraian = 'PERIKSA DOKTER IGD NON JIWA';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'DIPAM/PENDAFTARAN';
        $STSD->kolom2 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'TINDAKAN MEDIK POLIKLINIK';
        $STSD->kolom2 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'TINDAKAN MEDIK IGD';
        $STSD->kolom2 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'TINDAKAN MEDIK PASIEN GIGI';
        $STSD->kolom2 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'OBAT-OBATAN';
        $STSD->kolom2 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'subkonten';
        $STSD->uraian = 'Obat Rajal Umum';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'SURAT KETERANGAN (KIR)';
        $STSD->kolom2 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'PSIKOLOGI';
        $STSD->kolom2 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'KONSULTASI GIZI';
        $STSD->kolom2 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->nomer = '02';
        $STSD->uraian = 'PENUNJANG';
        $STSD->kolom2 = $request['jumlahpenunjang'];
        $STSD->vol = $request['voljumlahpenunjang'];
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'LABORATORIUM';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'ELEKTROMEDIK';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'FISIOTERAPY';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'RADIOLOGI';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'DIKLAT';
        $STSD->kolom1 = $request['diklat'];
        $STSD->vol = $request['voldiklat'];
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->nomer = '03';
        $STSD->uraian = 'RAWAT INAP';
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'PERAWATAN PASIEN';
        $STSD->kolom2 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'subkonten';
        $STSD->uraian = 'VIP';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'subkonten';
        $STSD->uraian = 'Kelas I';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'subkonten';
        $STSD->uraian = 'Kelas UPPI';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'subkonten';
        $STSD->uraian = 'Kelas II';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'subkonten';
        $STSD->uraian = 'Kelas III';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'OBAT-OBATAN RANAP';
        $STSD->kolom2 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'subkonten';
        $STSD->uraian = 'Obat Ranap Umum';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'TINDAKAN MEDIK RANAP';
        $STSD->kolom2 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'VISITE DOKTER';
        $STSD->kolom2 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'REHABILITASI MENTAL';
        $STSD->kolom2 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'PERAWATAN JENAZAH';
        $STSD->kolom2 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'Klaim Covid';
        $STSD->kolom2 = $request['klaimcovid'];
        $STSD->vol = $request['volklaimcovid'];
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->nomer = '04';
        $STSD->uraian = 'LAIN-LAIN PENDAPATAN BLUD YANG SAH';
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->kolom2 = $request['jumlahlain'];
        $STSD->vol = $request['voljumlahlain'];
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'LEGALISIR';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'SEWA GEDUNG TERAPI';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'SEWA LAPANGAN SEPAK BOLA';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'SEWA GEDUNG DIKLAT';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'SEWA GEDUNG GRHASIA INN';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'SEWA TANAH PERTANIAN';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'SEWA KALANDRA';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'SEWA TEMPAT FOTOCOPY';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'SEWA MANEKIN';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'SEWA AMBULAN/MOBIL JENAZAH';
        $STSD->kolom1 = $request['kendaraan'];
        $STSD->vol = $request['volkendaraan'];
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'SEWA BUS';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'HASIL KETRAMPILAN PASIEN';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'PARKIR';
        $STSD->kolom1 = 0;
        $STSD->vol = 0;
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'LAIN-LAIN';
        $STSD->kolom1 = $request['lainlain'];
        $STSD->vol = $request['vollainlain'];
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'Jasa Bank';
        $STSD->kolom1 = $request['jasabank'];
        $STSD->vol = $request['voljasabank'];
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $newId = SuratTandaSetoranDetail::max('nourut') +1 ;

        $STSD = new SuratTandaSetoranDetail();
        $STSD->norec  = $STSD->generateNewId();
        $STSD->kdprofile = $idProfile;
        $STSD->nourut = $newId;
        $STSD->jenisdata = 'konten';
        $STSD->uraian = 'JUMLAH';
        $STSD->kolom2 = $request['jumlahlain'] + $request['jumlahranap'] + $request['jumlahpenunjang'];
        $STSD->statusenabled = true;
        $STSD->objectstsfk = $nosts;
        $STSD->save();

        $transStatus = 'true';
        } catch (\Exception $e) {
             $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $STSD,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'line'=> $e->getLine(),
                'message'=> $e->getMessage(),
                'as' => '@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function detailSTS(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $nosts= $request['nostsdetail'];

        $detail = DB::select(DB::raw("select 
        string_agg(headersts.namapasien, ',') namapasien,headersts.carabayarfk, sts.tglpenerimaan, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.kolom1, stsd.kolom2, sts.nosts, sts.terbilang
        from 
        surattandasetoran_t as sts 
        inner join surattandasetorandetail_t stsd on stsd.objectstsfk = sts.nosts
        inner join lateral(
                    select 
                        COALESCE(ps.namapasien ,sp.namapasien_klien) namapasien,sck.carabayarfk 
                    from strukclosing_t sc
                    inner join strukclosingkasir_t sck on sc.norec = sck.noclosingfk
                    inner join ststosck_t as ssc on ssc.objectsckfk = sck.norec
                    inner join strukbuktipenerimaan_t as sbm on sbm.noclosingfk = sc.norec
                    inner join strukpelayanan_t as sp on sbm.nostrukfk = sp.norec				
                    left join pasien_m as ps on ps.id = sp.nocmfk
                    where  sts.norec = ssc.objectstsfk
        ) headersts on true
        where sts.nosts = '$nosts' and stsd.statusenabled = true
		group by stsd.nourut, headersts.carabayarfk, sts.tglpenerimaan, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.kolom1, stsd.kolom2, sts.nosts, sts.terbilang
        order by stsd.nourut"));
        

        $result = array(
            'detail' => $detail,
        );
        
        return $this->setStatusCode(201)->respond($result, 'tes msg');
    }

    public function detailSTSManual(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $nosts= $request['nostsdetail'];

        $detail = DB::select(DB::raw("select sts.tglpenerimaan, sts.nosts, sts.totalsetoran, sts.terbilang, sts.keterangan,
        stsd.*
        from surattandasetoran_t sts
        inner join surattandasetorandetail_t stsd on sts.nosts = stsd.objectstsfk
        where sts.kdprofile = 30
        and sts.statusenabled = true
        and stsd.kdprofile = 30
        and stsd.statusenabled = true
        and sts.ismanual = true
        and sts.nosts = '$nosts'
        order by nourut"));
        

        $result = array(
            'detail' => $detail,
        );
        
        return $this->setStatusCode(201)->respond($result, 'tes msg');
    }

    public function detailSTSKlaim(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $nosts= $request['nostsdetail'];

        $detail = DB::select(DB::raw("select sts.tglpenerimaan, sts.nosts, sts.totalsetoran, sts.terbilang, sts.keterangan,
        stsd.*
        from surattandasetoran_t sts
        inner join surattandasetorandetail_t stsd on sts.nosts = stsd.objectstsfk
        where sts.kdprofile = 30
        and sts.statusenabled = true
        and stsd.kdprofile = 30
        and stsd.statusenabled = true
        and sts.nosts = '$nosts'
        order by nourut"));
        

        $result = array(
            'detail' => $detail,
        );
        
        return $this->setStatusCode(201)->respond($result, 'tes msg');
    }

    public function getPenjagaanBatalSetor(Request $request) {

        $noclosing = $request['noclosing'];

        $detail = DB::select(DB::raw("select sts.*
        from surattandasetoran_t sts
        inner join ststosck_t as ssc on sts.norec = ssc.objectstsfk
        inner join strukclosingkasir_t as sck on ssc.objectsckfk = sck.norec
        inner join strukclosing_t as sc on sc.norec = sck.noclosingfk
        where sts.kdprofile = 30
        and sts.statusenabled = true 
        and sc.noclosing = '$noclosing'"));
        

        $result = array(
            'detail' => $detail,
        );
        
        return $this->setStatusCode(201)->respond($result, 'tes msg');
    }

    public function getSTSPopup(Request $request) {

        $noclosing = $request['noclosing'];

        $detail = DB::select(DB::raw("select distinct COALESCE(ps.namapasien ,sp.namapasien_klien) namapasien, COALESCE(ps.nocm ,'-') nocm, COALESCE(pd.noregistrasi ,'-') noreg, sc.noclosing as nopenerimaan, sc.tglclosing as tglpenerimaan, sbm.totaldibayar as totalpenerimaan, sts.nosts, cb.carabayar, sc.objectpegawaidiclosefk as pegawai, sc.norec as scfk, sck.norec as sckfk, sbm.nosbm  
            from strukclosing_t sc
            inner join strukclosingkasir_t sck on sck.noclosingfk = sc.norec
            inner join strukbuktipenerimaan_t sbm on sbm.noclosingfk = sc.norec
            inner join strukpelayanan_t sp on sp.norec = sbm.nostrukfk
            left join pasiendaftar_t pd on pd.norec = sp.noregistrasifk
            left join pasien_m as ps on ps.id = sp.nocmfk
            left join strukbuktipenerimaancarabayar_t sbmcr on sbmcr.nosbmfk = sbm.norec
            left join carabayar_m cb on cb.id = sbmcr.objectcarabayarfk
            left join ststosck_t ssc on ssc.objectsckfk = sck.norec 
            left join surattandasetoran_t sts on sts.norec = ssc.objectstsfk and sts.statusenabled = true
            where sc.noclosing = '$noclosing'
            and sc.kdprofile = 30
            and sc.statusenabled is null or sc.statusenabled=true
            order by sc.tglclosing desc"));
        

        $result = array(
            'detail' => $detail,
        );
        
        return $this->setStatusCode(201)->respond($result, 'tes msg');
    }


    public function getSTSBulanan(Request $request) {

        $tahun = $request['tahun'];

        $detail = DB::select(DB::raw("select x.date, x.kdrekening, x.nomer, x.uraian, sum(x.vol) as totalvol, sum(x.kolom1) as totalkolom1, sum(x.kolom2) as totalkolom2,
        (
            case 
            when sum(x.kolom1) is null and sum(x.kolom2) is null then sum(x.kolom1)
            when sum(x.kolom1) is null and sum(x.kolom2) is not null then sum(x.kolom2)
            when sum(x.kolom1) is not null and sum(x.kolom2) is null then sum(x.kolom1)
            else 0 
            end
        ) as totalfix
        from(	
				select to_char(sts.tglpenerimaan, 'MM') as date, stsd.nourut, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.kolom1, stsd.kolom2
                from surattandasetoran_t sts
                inner join surattandasetorandetail_t stsd on stsd.objectstsfk = sts.nosts
                left join ststosck_t as ssc on sts.norec = ssc.objectstsfk
                left join strukclosingkasir_t as sck on ssc.objectsckfk = sck.norec
                left join strukclosing_t as sc on sc.norec = sck.noclosingfk
                left join strukbuktipenerimaan_t AS sbm on sbm.noclosingfk = sc.norec
                left join strukbuktipenerimaancarabayar_t as sbmcr ON sbmcr.nosbmfk = sbm.norec
                left JOIN carabayar_m as cb ON cb.id = sbmcr.objectcarabayarfk
                where sts.statusenabled = true
                and stsd.statusenabled = true and stsd.kdprofile = 30
                and sc.noclosing not in (
                    select sc.noclosing from strukclosing_t sc
                    inner join strukhistori_t sh on sh.noclosing = sc.norec
                    where sh.statusenabled = false
                )
                and date_part('year', sts.tglpenerimaan::timestamp ) = '$tahun'
                group by to_char(sts.tglpenerimaan, 'MM'), stsd.nourut, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.kolom1, stsd.kolom2
        ) as x
        group by  x.date, x.kdrekening, x.nomer, x.uraian
        order by min(x.nourut);"));
        
        $mainuraian = array('Pendapatan Usaha BLUD', 'Pendapatan Jasa Layanan', 'RAWAT JALAN', 'Klinik Umum', 'Klinik Jiwa',
        'Klinik Jiwa Umum', 'Klinik Jiwa JKN', 'Klinik Jiwa Jamkesda Jks', 'TM. Poli Umum', 'TM. Poli JKN', 'TM. Poli Jamkesda Jamkesos',
        'Klinik Gigi', 'Poli Gigi', 'TM. Gigi', 'Klinik Syaraf', 'Klinik Penyakit Dalam', 'Klinik Anak', 'Klinik Kulit dan Kelamin',
        'Poli Kulit Kelamin', 'TM. Kulit', 'Pelayanan NAPZA', 'UGD', 'TM. UGD', 'Kunjungan UGD Umum', 'Kunjungan UGD JKN', 'Kunjungan UGD Jamkesdasos',
        'Obat-obatan Rajal', 'Pasien Umum', 'Pasien Jamkesdasos', 'Pasien JKN', 'Test Psikologi / Konsul Psikologi', 'Surat Keterangan Dokter (KIR)',
        'DIPAM / Addministrasi', 'PENUNJANG', 'Laboratorium', 'Laboratorium Umum', 'Laboratorium Jamkesdasos', 'Laboratorium JKN', 'Pemeriksaan Elektromedik',
        'Fisioterapi', 'Radiologi', 'Diklat', 'RAWAT INAP', 'Perawatan Pasien', 'VIP', 'UPPI', 'Kelas I', 'Kelas II', 'Kelas III', 'JKN', 'Kelas III Jamkesda Jamkesos',
        'Tindakan Khusus Jiwa', 'TM Pasien Umum', 'TM Pasien JKN', 'TM Pasien Jamkesda Jamkesos', 'Visite Dokter', 'Visite Dokter Pasien Umum', 'Visite Dokter Pasien JKN',
        'Visite Dokter Pasien Jamkesdasos', 'Rehab Mental dan Work Terapi', 'RM. Pasien Umum', 'RM. Pasien JKN', 'RM. Pasien Jamkesdasos', 'Konsultasi Spesialis Lain',
        'Obat-obatan Ranap', 'Obat Ranap Umum', 'Obat Ranap JKN', 'Obat Ranap Jamkesda Jamkesos', 'Lain-lain Pendapatan BLUD', 'Sewa Gedung Terapi', 'Sewa Kantin / Tempat Fotocopy',
        'Pemakaian Mobil / Kendaraan', 'Legalisir', 'Diklat', 'Parkir', 'Work Terapi', 'Sewa Lapangan Sepak Bola', 'Sewa Tanah Pertanian', 'Kontribusi Akreditasi', 'Sewa Manekin',
        'Denda BPJS', 'Pemulasaran Jenazah', 'Sewa Grhasia Inn', 'Jasa Bank', 'Lain-lain Pendapatan BLUD', 'Liquid Gas', 'Saldo slipa di rekening lain', 'Pengembalian Klaim BPJS Tenaga Kerja',
        'Jasa Giro', 'Ada Saldo Sutera BPD Sudah Diakui Sebagai Pendapatan'
        );

        $loopuraian = array('PENDAPATAN USAHA BLUD', 'JASA LAYANAN RUMAH SAKIT', 'RAWAT JALAN', 'PERIKSA DOKTER UMUM', 'PERIKSA DOKTER SPESIALIS JIWA',
        'Klinik Jiwa Umum', 'Klinik Jiwa JKN', 'Klinik Jiwa Jamkesda Jks', 'TM. Poli Umum', 'TM. Poli JKN', 'TM. Poli Jamkesda Jamkesos',
        'Klinik Gigi', 'PERIKSA DOKTER GIGI', 'TINDAKAN MEDIK PASIEN GIGI', 'PERIKSA DOKTER SYARAF', 'PERIKSA DOKTER PENYAKIT DALAM', 'PERIKSA DOKTER ANAK', 'Klinik Kulit dan Kelamin',
        'Poli Kulit Kelamin', 'TM. Kulit', 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)', 'UGD', 'TINDAKAN MEDIK IGD', 'Kunjungan UGD Umum', 'Kunjungan UGD JKN', 'Kunjungan UGD Jamkesdasos',
        'OBAT-OBATAN', 'Pasien Umum', 'Pasien Jamkesdasos', 'Pasien JKN', 'PSIKOLOGI', 'SURAT KETERANGAN (KIR)',
        'DIPAM/PENDAFTARAN', 'PENUNJANG', 'LABORATORIUM', 'Laboratorium Umum', 'Laboratorium Jamkesdasos', 'Laboratorium JKN', 'ELEKTROMEDIK',
        'FISIOTERAPY', 'RADIOLOGI', 'DIKLAT', 'RAWAT INAP', 'PERAWATAN PASIEN', 'VIP', 'Kelas UPPI', 'Kelas I', 'Kelas II', 'Kelas III', 'JKN', 'Kelas III Jamkesda Jamkesos',
        'TINDAKAN MEDIK RANAP', 'TM Pasien Umum', 'TM Pasien JKN', 'TM Pasien Jamkesda Jamkesos', 'VISITE DOKTER', 'Visite Dokter Pasien Umum', 'Visite Dokter Pasien JKN',
        'Visite Dokter Pasien Jamkesdasos', 'REHABILITASI MENTAL', 'RM. Pasien Umum', 'RM. Pasien JKN', 'RM. Pasien Jamkesdasos', 'Konsultasi Spesialis Lain',
        'OBAT-OBATAN RANAP', 'Obat Ranap Umum', 'Obat Ranap JKN', 'Obat Ranap Jamkesda Jamkesos', 'LAIN-LAIN PENDAPATAN BLUD YANG SAH', 'SEWA GEDUNG TERAPI', 'Sewa Kantin / Tempat Fotocopy',
        'Pemakaian Mobil / Kendaraan', 'LEGALISIR', 'SEWA GEDUNG DIKLAT', 'PARKIR', 'HASIL KETRAMPILAN PASIEN', 'SEWA LAPANGAN SEPAK BOLA', 'SEWA TANAH PERTANIAN', 'Kontribusi Akreditasi', 'SEWA MANEKIN',
        'Denda BPJS', 'PERAWATAN JENAZAH', 'SEWA GEDUNG GRHASIA INN', 'Jasa Bank', 'Lain-lain Pendapatan BLUD', 'Liquid Gas', 'Saldo slipa di rekening lain', 'Pengembalian Klaim BPJS Tenaga Kerja',
        'Jasa Giro', 'Ada Saldo Sutera BPD Sudah Diakui Sebagai Pendapatan'
        );
        
        $jumlahjanuari = 0;
        $jumlahfebruari = 0;
        $jumlahmaret = 0;
        $jumlahapril = 0;
        $jumlahmei = 0;
        $jumlahjuni = 0;
        $jumlahjuli = 0;
        $jumlahagustus = 0;
        $jumlahseptember = 0;
        $jumlahoktober = 0;
        $jumlahnovember = 0;
        $jumlahdesember = 0;
        $jumlahrealisasi = 0;
        $data = [];

        foreach($loopuraian as $main){
            $jumlahjanuari = 0;
            $jumlahfebruari = 0;
            $jumlahmaret = 0;
            $jumlahapril = 0;
            $jumlahmei = 0;
            $jumlahjuni = 0;
            $jumlahjuli = 0;
            $jumlahagustus = 0;
            $jumlahseptember = 0;
            $jumlahoktober = 0;
            $jumlahnovember = 0;
            $jumlahdesember = 0;
            $jumlahrealisasi = 0;
            $uraian = $main->uraianpendapatan;
            foreach($detail as $row){
                if($row->date == '01' && $main->uraianpendapatan == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI')){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI')){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)')){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' )){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $row->uraian == $main->uraianpendapatan){
                    $jumlahjanuari += $row->totalfix;
                }

                if($row->date == '02' && $main->uraianpendapatan == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI')){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI')){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)')){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' )){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $row->uraian == $main->uraianpendapatan){
                    $jumlahfebruari += $row->totalfix;
                }

                if($row->date == '03' && $main->uraianpendapatan == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI')){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI')){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)')){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' )){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $row->uraian == $main->uraianpendapatan){
                    $jumlahmaret += $row->totalfix;
                }

                if($row->date == '04' && $main->uraianpendapatan == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI')){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI')){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)')){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' )){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $row->uraian == $main->uraianpendapatan){
                    $jumlahapril += $row->totalfix;
                }

                if($row->date == '05' && $main->uraianpendapatan == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI')){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI')){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)')){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' )){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $row->uraian == $main->uraianpendapatan){
                    $jumlahmei += $row->totalfix;
                }

                if($row->date == '06' && $main->uraianpendapatan == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI')){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI')){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)')){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' )){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $row->uraian == $main->uraianpendapatan){
                    $jumlahjuni += $row->totalfix;
                }

                if($row->date == '07' && $main->uraianpendapatan == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI')){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI')){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)')){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' )){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $row->uraian == $main->uraianpendapatan){
                    $jumlahjuli += $row->totalfix;
                }

                if($row->date == '08' && $main->uraianpendapatan == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI')){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI')){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)')){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' )){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $row->uraian == $main->uraianpendapatan){
                    $jumlahagustus += $row->totalfix;
                }

                if($row->date == '09' && $main->uraianpendapatan == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI')){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI')){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)')){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' )){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $row->uraian == $main->uraianpendapatan){
                    $jumlahseptember += $row->totalfix;
                }

                if($row->date == '10' && $main->uraianpendapatan == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI')){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI')){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)')){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' )){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $row->uraian == $main->uraianpendapatan){
                    $jumlahoktober += $row->totalfix;
                }

                if($row->date == '11' && $main->uraianpendapatan == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI')){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI')){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)')){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' )){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $row->uraian == $main->uraianpendapatan){
                    $jumlahnovember += $row->totalfix;
                }

                if($row->date == '12' && $main->uraianpendapatan == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI')){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI')){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)')){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' )){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $row->uraian == $main->uraianpendapatan){
                    $jumlahdesember += $row->totalfix;
                }

                if($main->uraianpendapatan == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI')){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI')){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)')){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' )){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($row->uraian == $main->uraianpendapatan){
                    $jumlahrealisasi += $row->totalfix;
                }
            }

            $data[] =array(
                'mainuraian' =>   $uraian,
                'jumlahjanuari' =>   $jumlahjanuari,
                'jumlahfebruari' =>   $jumlahfebruari,
                'jumlahmaret' =>   $jumlahmaret,
                'jumlahapril' =>   $jumlahapril,
                'jumlahmei' =>   $jumlahmei,
                'jumlahjuni' =>   $jumlahjuni,
                'jumlahjuli' =>   $jumlahjuli,
                'jumlahagustus' =>   $jumlahagustus,
                'jumlahseptember' =>   $jumlahseptember,
                'jumlahoktober' =>   $jumlahoktober,
                'jumlahnovember' =>   $jumlahnovember,
                'jumlahdesember' =>   $jumlahdesember,
                'jumlahrealisasi' =>   $jumlahrealisasi,
            );
        }


        $result = array(
            'detail' => $data,
        );
        
        return $this->setStatusCode(201)->respond($result, 'tes msg');
    }

    public function getSTSBulananKlaim(Request $request) {
        ini_set('max_execution_time', 600);
        $tahun = $request['tahun'];

        $detail = DB::select(DB::raw("select x.nourut, x.date, x.kdrekening, x.nomer, x.uraian, sum(x.vol) as totalvol, sum(x.kolom1) as totalkolom1, sum(x.kolom2) as totalkolom2,
        (
            case 
            when sum(x.kolom1) is null and sum(x.kolom2) is null then sum(x.kolom1)
            when sum(x.kolom1) is null and sum(x.kolom2) is not null then sum(x.kolom2)
            when sum(x.kolom1) is not null and sum(x.kolom2) is null then sum(x.kolom1)
            else 0 
            end
        ) as totalfix
        from(	
				select to_char(sts.tglpenerimaan, 'MM') as date, stsd.nourut, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.kolom1, stsd.kolom2
                from surattandasetoran_t sts
                inner join surattandasetorandetail_t stsd on stsd.objectstsfk = sts.nosts
                left join ststosck_t as ssc on sts.norec = ssc.objectstsfk
                left join strukclosingkasir_t as sck on ssc.objectsckfk = sck.norec
                left join strukclosing_t as sc on sc.norec = sck.noclosingfk
                left join strukbuktipenerimaan_t AS sbm on sbm.noclosingfk = sc.norec
                left join strukbuktipenerimaancarabayar_t as sbmcr ON sbmcr.nosbmfk = sbm.norec
                left JOIN carabayar_m as cb ON cb.id = sbmcr.objectcarabayarfk
                where sts.statusenabled = true
                and stsd.statusenabled = true and stsd.kdprofile = 30
                and sc.noclosing not in (
                    select sc.noclosing from strukclosing_t sc
                    inner join strukhistori_t sh on sh.noclosing = sc.norec
                    where sh.statusenabled = false
                )
                and date_part('year', sts.tglpenerimaan::timestamp ) = '$tahun'
                group by to_char(sts.tglpenerimaan, 'MM'), stsd.nourut, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.kolom1, stsd.kolom2
        ) as x
        group by x.nourut, x.date, x.kdrekening, x.nomer, x.uraian

        union all

		select x.nourut, x.date, x.kdrekening, x.nomer, x.uraian, sum(x.vol) as totalvol, sum(x.kolom1) as totalkolom1, sum(x.kolom2) as totalkolom2,
        (
            case 
            when sum(x.kolom1) is null and sum(x.kolom2) is null then sum(x.kolom1)
            when sum(x.kolom1) is null and sum(x.kolom2) is not null then sum(x.kolom2)
            when sum(x.kolom1) is not null and sum(x.kolom2) is null then sum(x.kolom1)
            else 0 
            end
        ) as totalfix
        from(	
				select to_char(sts.tglpenerimaan, 'MM') as date, stsd.nourut, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.kolom1, stsd.kolom2
                from surattandasetoran_t sts
                inner join surattandasetorandetail_t stsd on stsd.objectstsfk = sts.nosts
                where sts.statusenabled = true
                and stsd.statusenabled = true and stsd.kdprofile = 30
				and sts.kdprofile = 30
				and sts.ismanual = true
                and date_part('year', sts.tglpenerimaan::timestamp ) = '$tahun'
                group by to_char(sts.tglpenerimaan, 'MM'), stsd.nourut, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.kolom1, stsd.kolom2
        ) as x
        group by x.nourut, x.date, x.kdrekening, x.nomer, x.uraian
        
        union all

        select x.nourut, x.date, x.kdrekening, x.nomer, x.uraian, sum(x.vol) as totalvol, sum(x.kolom1) as totalkolom1, sum(x.kolom2) as totalkolom2,
        (
            case 
            when sum(x.kolom1) is null and sum(x.kolom2) is null then sum(x.kolom1)
            when sum(x.kolom1) is null and sum(x.kolom2) is not null then sum(x.kolom2)
            when sum(x.kolom1) is not null and sum(x.kolom2) is null then sum(x.kolom1)
            else 0 
            end
        ) as totalfix
        from(	
				select to_char(sts.tglpenerimaan, 'MM') as date, stsd.nourut, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.kolom1, stsd.kolom2
                from surattandasetoran_t sts
                inner join surattandasetorandetail_t stsd on stsd.objectstsfk = sts.nosts
				inner join ststorekapklaim_t str on sts.norec = str.objectstsfk
				inner join rekapklaimbpjs_t rkb on str.objectrekapklaimfk = rkb.norec
                where sts.statusenabled = true
                and stsd.statusenabled = true 
                and stsd.kdprofile = 30
                and str.statusenabled = true 
                and str.kdprofile = 30
                and rkb.statusenabled = true 
                and rkb.kdprofile = 30
				and sts.kdprofile = 30
                and date_part('year', sts.tglpenerimaan::timestamp ) = '$tahun'
                group by to_char(sts.tglpenerimaan, 'MM'), stsd.nourut, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.kolom1, stsd.kolom2
        ) as x
        group by x.nourut, x.date, x.kdrekening, x.nomer, x.uraian
        order by date, nourut"));

        $target = DB::select(DB::raw("select up.kdrekening, rp.norec,rp.isperubahan, rp.jumlahpendapatan,rp.tahun, rp.tglinput, rp.keterangan, rp.objectasalprodukfk, rp.objecturaianpendapatanfk,up.uraianpendapatan,ap.namaexternal, rp.uraianpendapatan as uraian
        from rincianpendapatan_t as rp
        inner join asalproduk_m as ap on ap.id = rp.objectasalprodukfk
        inner join uraianpendapatan_m as up on up.id = rp.objecturaianpendapatanfk
        where rp.kdprofile = 30
        and rp.statusenabled = true
        and up.kdprofile = 30
        and up.statusenabled = true
        and rp.tahun = '$tahun'
        order by up.nourut"));
        
        $jumlahjanuari = 0;
        $jumlahfebruari = 0;
        $jumlahmaret = 0;
        $jumlahapril = 0;
        $jumlahmei = 0;
        $jumlahjuni = 0;
        $jumlahjuli = 0;
        $jumlahagustus = 0;
        $jumlahseptember = 0;
        $jumlahoktober = 0;
        $jumlahnovember = 0;
        $jumlahdesember = 0;
        $jumlahrealisasi = 0;
        $jumlahtarget = 0;
        $data = [];

        foreach($target as $main){
            $jumlahjanuari = 0;
            $jumlahfebruari = 0;
            $jumlahmaret = 0;
            $jumlahapril = 0;
            $jumlahmei = 0;
            $jumlahjuni = 0;
            $jumlahjuli = 0;
            $jumlahagustus = 0;
            $jumlahseptember = 0;
            $jumlahoktober = 0;
            $jumlahnovember = 0;
            $jumlahdesember = 0;
            $jumlahrealisasi = 0;
            $jumlahtarget = 0;
            $uraian = $main->uraianpendapatan;
            $kdrekening = $main->kdrekening;
            foreach($detail as $row){
                if($row->date == '01' && $main->uraianpendapatan == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT INAP Jamkesos')){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'Pendapatan Usaha BLUD' && ($row->uraian == 'JUMLAH' || $row->uraian == 'JUMLAH NETTO')){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'Lain-lain Pendapatan BLUD' && $row->uraian == 'LAIN-LAIN'){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $row->uraian == $main->uraianpendapatan){
                    $jumlahjanuari += $row->totalfix;
                } 

                if($row->date == '02' && $main->uraianpendapatan == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid')){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'Lain-lain Pendapatan BLUD' && $row->uraian == 'LAIN-LAIN'){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $row->uraian == $main->uraianpendapatan){
                    $jumlahfebruari += $row->totalfix;
                }

                if($row->date == '03' && $main->uraianpendapatan == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid')){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'Lain-lain Pendapatan BLUD' && $row->uraian == 'LAIN-LAIN'){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $row->uraian == $main->uraianpendapatan){
                    $jumlahmaret += $row->totalfix;
                }

                if($row->date == '04' && $main->uraianpendapatan == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid')){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'Lain-lain Pendapatan BLUD' && $row->uraian == 'LAIN-LAIN'){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $row->uraian == $main->uraianpendapatan){
                    $jumlahapril += $row->totalfix;
                }

                if($row->date == '05' && $main->uraianpendapatan == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid')){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'Lain-lain Pendapatan BLUD' && $row->uraian == 'LAIN-LAIN'){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $row->uraian == $main->uraianpendapatan){
                    $jumlahmei += $row->totalfix;
                }

                if($row->date == '06' && $main->uraianpendapatan == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid')){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'Lain-lain Pendapatan BLUD' && $row->uraian == 'LAIN-LAIN'){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $row->uraian == $main->uraianpendapatan){
                    $jumlahjuni += $row->totalfix;
                }

                if($row->date == '07' && $main->uraianpendapatan == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid')){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'Lain-lain Pendapatan BLUD' && $row->uraian == 'LAIN-LAIN'){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $row->uraian == $main->uraianpendapatan){
                    $jumlahjuli += $row->totalfix;
                }

                if($row->date == '08' && $main->uraianpendapatan == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid')){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'Lain-lain Pendapatan BLUD' && $row->uraian == 'LAIN-LAIN'){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $row->uraian == $main->uraianpendapatan){
                    $jumlahagustus += $row->totalfix;
                }

                if($row->date == '09' && $main->uraianpendapatan == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid')){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'Lain-lain Pendapatan BLUD' && $row->uraian == 'LAIN-LAIN'){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $row->uraian == $main->uraianpendapatan){
                    $jumlahseptember += $row->totalfix;
                }

                if($row->date == '10' && $main->uraianpendapatan == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid')){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'Lain-lain Pendapatan BLUD' && $row->uraian == 'LAIN-LAIN'){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $row->uraian == $main->uraianpendapatan){
                    $jumlahoktober += $row->totalfix;
                }

                if($row->date == '11' && $main->uraianpendapatan == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid')){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'Lain-lain Pendapatan BLUD' && $row->uraian == 'LAIN-LAIN'){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $row->uraian == $main->uraianpendapatan){
                    $jumlahnovember += $row->totalfix;
                }

                if($row->date == '12' && $main->uraianpendapatan == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid')){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'Lain-lain Pendapatan BLUD' && $row->uraian == 'LAIN-LAIN'){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $row->uraian == $main->uraianpendapatan){
                    $jumlahdesember += $row->totalfix;
                }

                if($main->uraianpendapatan == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda Jamkesos' || $row->uraian == 'Klaim Covid')){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda Jamkesos')){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)')){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' )){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'Lain-lain Pendapatan BLUD' && $row->uraian == 'LAIN-LAIN'){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($row->uraian == $main->uraianpendapatan){
                    $jumlahrealisasi += $row->totalfix;
                }
            }

            foreach($target as $tg){
                if($tg->uraianpendapatan == $main->uraianpendapatan){
                    $jumlahtarget += $tg->jumlahpendapatan;
                }
            }

            $data[] =array(
                'mainuraian' =>   $uraian,
                'kdrekening' =>   $kdrekening,
                'jumlahjanuari' =>   $jumlahjanuari,
                'jumlahfebruari' =>   $jumlahfebruari,
                'jumlahmaret' =>   $jumlahmaret,
                'jumlahapril' =>   $jumlahapril,
                'jumlahmei' =>   $jumlahmei,
                'jumlahjuni' =>   $jumlahjuni,
                'jumlahjuli' =>   $jumlahjuli,
                'jumlahagustus' =>   $jumlahagustus,
                'jumlahseptember' =>   $jumlahseptember,
                'jumlahoktober' =>   $jumlahoktober,
                'jumlahnovember' =>   $jumlahnovember,
                'jumlahdesember' =>   $jumlahdesember,
                'jumlahrealisasi' =>   $jumlahrealisasi,
                'jumlahtarget' =>   $jumlahtarget,
            );

            
        }

        


        $result = array(
            'detail' => $data,
        );
        
        return $this->setStatusCode(201)->respond($result, 'tes msg');
    }

    public function getDetailLaporanFungsional(Request $request) {
        ini_set('max_execution_time', 600);
        $tahun = $request['tahun'];

        $detail = DB::select(DB::raw("select x.nourut, x.date, x.kdrekening, x.nomer, x.uraian, sum(x.vol) as totalvol, sum(x.kolom1) as totalkolom1, sum(x.kolom2) as totalkolom2,
        (
            case 
            when sum(x.kolom1) is null and sum(x.kolom2) is null then sum(x.kolom1)
            when sum(x.kolom1) is null and sum(x.kolom2) is not null then sum(x.kolom2)
            when sum(x.kolom1) is not null and sum(x.kolom2) is null then sum(x.kolom1)
            else 0 
            end
        ) as totalfix
        from(	
				select to_char(sts.tglpenerimaan, 'MM') as date, stsd.nourut, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.kolom1, stsd.kolom2
                from surattandasetoran_t sts
                inner join surattandasetorandetail_t stsd on stsd.objectstsfk = sts.nosts
                left join ststosck_t as ssc on sts.norec = ssc.objectstsfk
                left join strukclosingkasir_t as sck on ssc.objectsckfk = sck.norec
                left join strukclosing_t as sc on sc.norec = sck.noclosingfk
                left join strukbuktipenerimaan_t AS sbm on sbm.noclosingfk = sc.norec
                left join strukbuktipenerimaancarabayar_t as sbmcr ON sbmcr.nosbmfk = sbm.norec
                left JOIN carabayar_m as cb ON cb.id = sbmcr.objectcarabayarfk
                where sts.statusenabled = true
                and stsd.statusenabled = true and stsd.kdprofile = 30
                and sc.noclosing not in (
                    select sc.noclosing from strukclosing_t sc
                    inner join strukhistori_t sh on sh.noclosing = sc.norec
                    where sh.statusenabled = false
                )
                and date_part('year', sts.tglpenerimaan::timestamp ) = '$tahun'
                group by to_char(sts.tglpenerimaan, 'MM'), stsd.nourut, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.kolom1, stsd.kolom2
        ) as x
        group by x.nourut, x.date, x.kdrekening, x.nomer, x.uraian

        union all

		select x.nourut, x.date, x.kdrekening, x.nomer, x.uraian, sum(x.vol) as totalvol, sum(x.kolom1) as totalkolom1, sum(x.kolom2) as totalkolom2,
        (
            case 
            when sum(x.kolom1) is null and sum(x.kolom2) is null then sum(x.kolom1)
            when sum(x.kolom1) is null and sum(x.kolom2) is not null then sum(x.kolom2)
            when sum(x.kolom1) is not null and sum(x.kolom2) is null then sum(x.kolom1)
            else 0 
            end
        ) as totalfix
        from(	
				select to_char(sts.tglpenerimaan, 'MM') as date, stsd.nourut, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.kolom1, stsd.kolom2
                from surattandasetoran_t sts
                inner join surattandasetorandetail_t stsd on stsd.objectstsfk = sts.nosts
                where sts.statusenabled = true
                and stsd.statusenabled = true and stsd.kdprofile = 30
				and sts.kdprofile = 30
				and sts.ismanual = true
                and date_part('year', sts.tglpenerimaan::timestamp ) = '$tahun'
                group by to_char(sts.tglpenerimaan, 'MM'), stsd.nourut, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.kolom1, stsd.kolom2
        ) as x
        group by x.nourut, x.date, x.kdrekening, x.nomer, x.uraian
        
        union all

        select x.nourut, x.date, x.kdrekening, x.nomer, x.uraian, sum(x.vol) as totalvol, sum(x.kolom1) as totalkolom1, sum(x.kolom2) as totalkolom2,
        (
            case 
            when sum(x.kolom1) is null and sum(x.kolom2) is null then sum(x.kolom1)
            when sum(x.kolom1) is null and sum(x.kolom2) is not null then sum(x.kolom2)
            when sum(x.kolom1) is not null and sum(x.kolom2) is null then sum(x.kolom1)
            else 0 
            end
        ) as totalfix
        from(	
				select to_char(sts.tglpenerimaan, 'MM') as date, stsd.nourut, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.kolom1, stsd.kolom2
                from surattandasetoran_t sts
                inner join surattandasetorandetail_t stsd on stsd.objectstsfk = sts.nosts
				inner join ststorekapklaim_t str on sts.norec = str.objectstsfk
				inner join rekapklaimbpjs_t rkb on str.objectrekapklaimfk = rkb.norec
                where sts.statusenabled = true
                and stsd.statusenabled = true 
                and stsd.kdprofile = 30
                and str.statusenabled = true 
                and str.kdprofile = 30
                and rkb.statusenabled = true 
                and rkb.kdprofile = 30
				and sts.kdprofile = 30
                and date_part('year', sts.tglpenerimaan::timestamp ) = '$tahun'
                group by to_char(sts.tglpenerimaan, 'MM'), stsd.nourut, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.kolom1, stsd.kolom2
        ) as x
        group by x.nourut, x.date, x.kdrekening, x.nomer, x.uraian
        order by date, nourut"));

        $target = DB::select(DB::raw("select up.kdrekening, rp.norec,rp.isperubahan, rp.jumlahpendapatan,rp.tahun, rp.tglinput, rp.keterangan, rp.objectasalprodukfk, rp.objecturaianpendapatanfk,up.uraianpendapatan,ap.namaexternal, rp.uraianpendapatan as uraian
        from rincianpendapatan_t as rp
        inner join asalproduk_m as ap on ap.id = rp.objectasalprodukfk
        inner join uraianpendapatan_m as up on up.id = rp.objecturaianpendapatanfk
        where rp.kdprofile = 30
        and rp.statusenabled = true
        and up.kdprofile = 30
        and up.statusenabled = true
        and rp.tahun = '$tahun'
        order by up.nourut"));
        
        $jumlahjanuari = 0;
        $jumlahfebruari = 0;
        $jumlahmaret = 0;
        $jumlahapril = 0;
        $jumlahmei = 0;
        $jumlahjuni = 0;
        $jumlahjuli = 0;
        $jumlahagustus = 0;
        $jumlahseptember = 0;
        $jumlahoktober = 0;
        $jumlahnovember = 0;
        $jumlahdesember = 0;
        $jumlahrealisasi = 0;
        $jumlahtarget = 0;
        $data = [];

        foreach($target as $main){
            $jumlahjanuari = 0;
            $jumlahfebruari = 0;
            $jumlahmaret = 0;
            $jumlahapril = 0;
            $jumlahmei = 0;
            $jumlahjuni = 0;
            $jumlahjuli = 0;
            $jumlahagustus = 0;
            $jumlahseptember = 0;
            $jumlahoktober = 0;
            $jumlahnovember = 0;
            $jumlahdesember = 0;
            $jumlahrealisasi = 0;
            $jumlahtarget = 0;
            $uraian = $main->uraianpendapatan;
            $kdrekening = $main->kdrekening;
            foreach($detail as $row){
                if($row->date == '01' && $main->uraianpendapatan == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT INAP Jamkesos')){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'Pendapatan Usaha BLUD' && ($row->uraian == 'JUMLAH' || $row->uraian == 'JUMLAH NETTO')){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main->uraianpendapatan == 'Lain-lain Pendapatan BLUD' && $row->uraian == 'LAIN-LAIN'){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $row->uraian == $main->uraianpendapatan){
                    $jumlahjanuari += $row->totalfix;
                } 

                if($row->date == '02' && $main->uraianpendapatan == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid')){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main->uraianpendapatan == 'Lain-lain Pendapatan BLUD' && $row->uraian == 'LAIN-LAIN'){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $row->uraian == $main->uraianpendapatan){
                    $jumlahfebruari += $row->totalfix;
                }

                if($row->date == '03' && $main->uraianpendapatan == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid')){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main->uraianpendapatan == 'Lain-lain Pendapatan BLUD' && $row->uraian == 'LAIN-LAIN'){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $row->uraian == $main->uraianpendapatan){
                    $jumlahmaret += $row->totalfix;
                }

                if($row->date == '04' && $main->uraianpendapatan == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid')){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main->uraianpendapatan == 'Lain-lain Pendapatan BLUD' && $row->uraian == 'LAIN-LAIN'){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $row->uraian == $main->uraianpendapatan){
                    $jumlahapril += $row->totalfix;
                }

                if($row->date == '05' && $main->uraianpendapatan == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid')){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main->uraianpendapatan == 'Lain-lain Pendapatan BLUD' && $row->uraian == 'LAIN-LAIN'){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $row->uraian == $main->uraianpendapatan){
                    $jumlahmei += $row->totalfix;
                }

                if($row->date == '06' && $main->uraianpendapatan == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid')){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main->uraianpendapatan == 'Lain-lain Pendapatan BLUD' && $row->uraian == 'LAIN-LAIN'){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $row->uraian == $main->uraianpendapatan){
                    $jumlahjuni += $row->totalfix;
                }

                if($row->date == '07' && $main->uraianpendapatan == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid')){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main->uraianpendapatan == 'Lain-lain Pendapatan BLUD' && $row->uraian == 'LAIN-LAIN'){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $row->uraian == $main->uraianpendapatan){
                    $jumlahjuli += $row->totalfix;
                }

                if($row->date == '08' && $main->uraianpendapatan == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid')){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main->uraianpendapatan == 'Lain-lain Pendapatan BLUD' && $row->uraian == 'LAIN-LAIN'){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $row->uraian == $main->uraianpendapatan){
                    $jumlahagustus += $row->totalfix;
                }

                if($row->date == '09' && $main->uraianpendapatan == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid')){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main->uraianpendapatan == 'Lain-lain Pendapatan BLUD' && $row->uraian == 'LAIN-LAIN'){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $row->uraian == $main->uraianpendapatan){
                    $jumlahseptember += $row->totalfix;
                }

                if($row->date == '10' && $main->uraianpendapatan == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid')){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main->uraianpendapatan == 'Lain-lain Pendapatan BLUD' && $row->uraian == 'LAIN-LAIN'){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $row->uraian == $main->uraianpendapatan){
                    $jumlahoktober += $row->totalfix;
                }

                if($row->date == '11' && $main->uraianpendapatan == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid')){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main->uraianpendapatan == 'Lain-lain Pendapatan BLUD' && $row->uraian == 'LAIN-LAIN'){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $row->uraian == $main->uraianpendapatan){
                    $jumlahnovember += $row->totalfix;
                }

                if($row->date == '12' && $main->uraianpendapatan == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid')){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main->uraianpendapatan == 'Lain-lain Pendapatan BLUD' && $row->uraian == 'LAIN-LAIN'){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $row->uraian == $main->uraianpendapatan){
                    $jumlahdesember += $row->totalfix;
                }

                if($main->uraianpendapatan == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda Jamkesos' || $row->uraian == 'Klaim Covid')){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda Jamkesos')){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)')){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' )){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main->uraianpendapatan == 'Lain-lain Pendapatan BLUD' && $row->uraian == 'LAIN-LAIN'){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($row->uraian == $main->uraianpendapatan){
                    $jumlahrealisasi += $row->totalfix;
                }
            }

            foreach($target as $tg){
                if($tg->uraianpendapatan == $main->uraianpendapatan){
                    $jumlahtarget += $tg->jumlahpendapatan;
                }
            }

            $data[] =array(
                'mainuraian' =>   $uraian,
                'kdrekening' =>   $kdrekening,
                'jumlahjanuari' =>   $jumlahjanuari,
                'jumlahfebruari' =>   $jumlahfebruari,
                'jumlahmaret' =>   $jumlahmaret,
                'jumlahapril' =>   $jumlahapril,
                'jumlahmei' =>   $jumlahmei,
                'jumlahjuni' =>   $jumlahjuni,
                'jumlahjuli' =>   $jumlahjuli,
                'jumlahagustus' =>   $jumlahagustus,
                'jumlahseptember' =>   $jumlahseptember,
                'jumlahoktober' =>   $jumlahoktober,
                'jumlahnovember' =>   $jumlahnovember,
                'jumlahdesember' =>   $jumlahdesember,
                'jumlahrealisasi' =>   $jumlahrealisasi,
                'jumlahtarget' =>   $jumlahtarget,
            );

            
        }

        


        $result = array(
            'detail' => $data,
        );
        
        return $this->setStatusCode(201)->respond($result, 'tes msg');
    }

    public function getSTSRingkas(Request $request) {
        ini_set('max_execution_time', 600);
        $tahun = $request['tahun'];

        $detail = DB::select(DB::raw("select x.nourut, x.date, x.kdrekening, x.nomer, x.uraian, sum(x.vol) as totalvol, sum(x.kolom1) as totalkolom1, sum(x.kolom2) as totalkolom2,
        (
            case 
            when sum(x.kolom1) is null and sum(x.kolom2) is null then sum(x.kolom1)
            when sum(x.kolom1) is null and sum(x.kolom2) is not null then sum(x.kolom2)
            when sum(x.kolom1) is not null and sum(x.kolom2) is null then sum(x.kolom1)
            else 0 
            end
        ) as totalfix
        from(	
				select to_char(sts.tglpenerimaan, 'MM') as date, stsd.nourut, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.kolom1, stsd.kolom2
                from surattandasetoran_t sts
                inner join surattandasetorandetail_t stsd on stsd.objectstsfk = sts.nosts
                left join ststosck_t as ssc on sts.norec = ssc.objectstsfk
                left join strukclosingkasir_t as sck on ssc.objectsckfk = sck.norec
                left join strukclosing_t as sc on sc.norec = sck.noclosingfk
                left join strukbuktipenerimaan_t AS sbm on sbm.noclosingfk = sc.norec
                left join strukbuktipenerimaancarabayar_t as sbmcr ON sbmcr.nosbmfk = sbm.norec
                left JOIN carabayar_m as cb ON cb.id = sbmcr.objectcarabayarfk
                where sts.statusenabled = true
                and stsd.statusenabled = true and stsd.kdprofile = 30
                and sc.noclosing not in (
                    select sc.noclosing from strukclosing_t sc
                    inner join strukhistori_t sh on sh.noclosing = sc.norec
                    where sh.statusenabled = false
                )
                and date_part('year', sts.tglpenerimaan::timestamp ) = '$tahun'
                group by to_char(sts.tglpenerimaan, 'MM'), stsd.nourut, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.kolom1, stsd.kolom2
        ) as x
        group by x.nourut, x.date, x.kdrekening, x.nomer, x.uraian

        union all

		select x.nourut, x.date, x.kdrekening, x.nomer, x.uraian, sum(x.vol) as totalvol, sum(x.kolom1) as totalkolom1, sum(x.kolom2) as totalkolom2,
        (
            case 
            when sum(x.kolom1) is null and sum(x.kolom2) is null then sum(x.kolom1)
            when sum(x.kolom1) is null and sum(x.kolom2) is not null then sum(x.kolom2)
            when sum(x.kolom1) is not null and sum(x.kolom2) is null then sum(x.kolom1)
            else 0 
            end
        ) as totalfix
        from(	
				select to_char(sts.tglpenerimaan, 'MM') as date, stsd.nourut, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.kolom1, stsd.kolom2
                from surattandasetoran_t sts
                inner join surattandasetorandetail_t stsd on stsd.objectstsfk = sts.nosts
                where sts.statusenabled = true
                and stsd.statusenabled = true and stsd.kdprofile = 30
				and sts.kdprofile = 30
				and sts.ismanual = true
                and date_part('year', sts.tglpenerimaan::timestamp ) = '$tahun'
                group by to_char(sts.tglpenerimaan, 'MM'), stsd.nourut, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.kolom1, stsd.kolom2
        ) as x
        group by x.nourut, x.date, x.kdrekening, x.nomer, x.uraian
        
        union all

        select x.nourut, x.date, x.kdrekening, x.nomer, x.uraian, sum(x.vol) as totalvol, sum(x.kolom1) as totalkolom1, sum(x.kolom2) as totalkolom2,
        (
            case 
            when sum(x.kolom1) is null and sum(x.kolom2) is null then sum(x.kolom1)
            when sum(x.kolom1) is null and sum(x.kolom2) is not null then sum(x.kolom2)
            when sum(x.kolom1) is not null and sum(x.kolom2) is null then sum(x.kolom1)
            else 0 
            end
        ) as totalfix
        from(	
				select to_char(sts.tglpenerimaan, 'MM') as date, stsd.nourut, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.kolom1, stsd.kolom2
                from surattandasetoran_t sts
                inner join surattandasetorandetail_t stsd on stsd.objectstsfk = sts.nosts
				inner join ststorekapklaim_t str on sts.norec = str.objectstsfk
				inner join rekapklaimbpjs_t rkb on str.objectrekapklaimfk = rkb.norec
                where sts.statusenabled = true
                and stsd.statusenabled = true 
                and stsd.kdprofile = 30
                and str.statusenabled = true 
                and str.kdprofile = 30
                and rkb.statusenabled = true 
                and rkb.kdprofile = 30
				and sts.kdprofile = 30
                and date_part('year', sts.tglpenerimaan::timestamp ) = '$tahun'
                group by to_char(sts.tglpenerimaan, 'MM'), stsd.nourut, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.kolom1, stsd.kolom2
        ) as x
        group by x.nourut, x.date, x.kdrekening, x.nomer, x.uraian
        order by date, nourut"));

        $mainuraian = array('Pendapatan Layanan', 'Pendapatan Non Layanan');
        
        $jumlahjanuari = 0;
        $jumlahfebruari = 0;
        $jumlahmaret = 0;
        $jumlahapril = 0;
        $jumlahmei = 0;
        $jumlahjuni = 0;
        $jumlahjuli = 0;
        $jumlahagustus = 0;
        $jumlahseptember = 0;
        $jumlahoktober = 0;
        $jumlahnovember = 0;
        $jumlahdesember = 0;
        $jumlahrealisasi = 0;
        $data = [];

        foreach($mainuraian as $main){
            $jumlahjanuari = 0;
            $jumlahfebruari = 0;
            $jumlahmaret = 0;
            $jumlahapril = 0;
            $jumlahmei = 0;
            $jumlahjuni = 0;
            $jumlahjuli = 0;
            $jumlahagustus = 0;
            $jumlahseptember = 0;
            $jumlahoktober = 0;
            $jumlahnovember = 0;
            $jumlahdesember = 0;
            $jumlahrealisasi = 0;
            $uraian = $main;

            foreach($detail as $row){
                if($row->date == '01' && $main == 'Pendapatan Layanan' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda Jamkesos' || $row->uraian == 'Klaim Covid')){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main == 'Pendapatan Non Layanan' && $row->uraian == 'LAIN-LAIN PENDAPATAN BLUD YANG SAH'){
                    $jumlahjanuari += $row->totalfix;
                } 

                if($row->date == '02' && $main == 'Pendapatan Layanan' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda Jamkesos' || $row->uraian == 'Klaim Covid')){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main == 'Pendapatan Non Layanan' && $row->uraian == 'LAIN-LAIN PENDAPATAN BLUD YANG SAH'){
                    $jumlahfebruari += $row->totalfix;
                } 

                if($row->date == '03' && $main == 'Pendapatan Layanan' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda Jamkesos' || $row->uraian == 'Klaim Covid')){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main == 'Pendapatan Non Layanan' && $row->uraian == 'LAIN-LAIN PENDAPATAN BLUD YANG SAH'){
                    $jumlahmaret += $row->totalfix;
                } 

                if($row->date == '04' && $main == 'Pendapatan Layanan' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda Jamkesos' || $row->uraian == 'Klaim Covid')){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main == 'Pendapatan Non Layanan' && $row->uraian == 'LAIN-LAIN PENDAPATAN BLUD YANG SAH'){
                    $jumlahapril += $row->totalfix;
                } 

                if($row->date == '05' && $main == 'Pendapatan Layanan' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda Jamkesos' || $row->uraian == 'Klaim Covid')){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main == 'Pendapatan Non Layanan' && $row->uraian == 'LAIN-LAIN PENDAPATAN BLUD YANG SAH'){
                    $jumlahmei += $row->totalfix;
                } 

                if($row->date == '06' && $main == 'Pendapatan Layanan' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda Jamkesos' || $row->uraian == 'Klaim Covid')){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main == 'Pendapatan Non Layanan' && $row->uraian == 'LAIN-LAIN PENDAPATAN BLUD YANG SAH'){
                    $jumlahjuni += $row->totalfix;
                } 

                if($row->date == '07' && $main == 'Pendapatan Layanan' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda Jamkesos' || $row->uraian == 'Klaim Covid')){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main == 'Pendapatan Non Layanan' && $row->uraian == 'LAIN-LAIN PENDAPATAN BLUD YANG SAH'){
                    $jumlahjuli += $row->totalfix;
                } 

                if($row->date == '08' && $main == 'Pendapatan Layanan' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda Jamkesos' || $row->uraian == 'Klaim Covid')){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main == 'Pendapatan Non Layanan' && $row->uraian == 'LAIN-LAIN PENDAPATAN BLUD YANG SAH'){
                    $jumlahagustus += $row->totalfix;
                } 

                if($row->date == '09' && $main == 'Pendapatan Layanan' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda Jamkesos' || $row->uraian == 'Klaim Covid')){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main == 'Pendapatan Non Layanan' && $row->uraian == 'LAIN-LAIN PENDAPATAN BLUD YANG SAH'){
                    $jumlahseptember += $row->totalfix;
                } 

                if($row->date == '10' && $main == 'Pendapatan Layanan' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda Jamkesos' || $row->uraian == 'Klaim Covid')){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main == 'Pendapatan Non Layanan' && $row->uraian == 'LAIN-LAIN PENDAPATAN BLUD YANG SAH'){
                    $jumlahoktober += $row->totalfix;
                } 

                if($row->date == '11' && $main == 'Pendapatan Layanan' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda Jamkesos' || $row->uraian == 'Klaim Covid')){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main == 'Pendapatan Non Layanan' && $row->uraian == 'LAIN-LAIN PENDAPATAN BLUD YANG SAH'){
                    $jumlahnovember += $row->totalfix;
                } 

                if($row->date == '12' && $main == 'Pendapatan Layanan' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda Jamkesos' || $row->uraian == 'Klaim Covid')){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main == 'Pendapatan Non Layanan' && $row->uraian == 'LAIN-LAIN PENDAPATAN BLUD YANG SAH'){
                    $jumlahdesember += $row->totalfix;
                } 

                if($main == 'Pendapatan Layanan' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda Jamkesos' || $row->uraian == 'Klaim Covid')){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main == 'Pendapatan Non Layanan' && $row->uraian == 'LAIN-LAIN PENDAPATAN BLUD YANG SAH'){
                    $jumlahrealisasi += $row->totalfix;
                } 
            }

            $data[] =array(
                'mainuraian' =>   $uraian,
                'jumlahjanuari' =>   $jumlahjanuari,
                'jumlahfebruari' =>   $jumlahfebruari,
                'jumlahmaret' =>   $jumlahmaret,
                'jumlahapril' =>   $jumlahapril,
                'jumlahmei' =>   $jumlahmei,
                'jumlahjuni' =>   $jumlahjuni,
                'jumlahjuli' =>   $jumlahjuli,
                'jumlahagustus' =>   $jumlahagustus,
                'jumlahseptember' =>   $jumlahseptember,
                'jumlahoktober' =>   $jumlahoktober,
                'jumlahnovember' =>   $jumlahnovember,
                'jumlahdesember' =>   $jumlahdesember,
                'jumlahrealisasi' =>   $jumlahrealisasi,
            );
        }

        $result = array(
            'detail' => $data,
        );
        
        return $this->setStatusCode(201)->respond($result, 'tes msg');
    }

    public function getSTSTriwulan(Request $request) {
        ini_set('max_execution_time', 600);
        $tahun = $request['tahun'];

        $detail = DB::select(DB::raw("select x.nourut, x.date, x.kdrekening, x.nomer, x.uraian, sum(x.vol) as totalvol, sum(x.kolom1) as totalkolom1, sum(x.kolom2) as totalkolom2,
        (
            case 
            when sum(x.kolom1) is null and sum(x.kolom2) is null then sum(x.kolom1)
            when sum(x.kolom1) is null and sum(x.kolom2) is not null then sum(x.kolom2)
            when sum(x.kolom1) is not null and sum(x.kolom2) is null then sum(x.kolom1)
            else 0 
            end
        ) as totalfix
        from(	
				select to_char(sts.tglpenerimaan, 'MM') as date, stsd.nourut, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.kolom1, stsd.kolom2
                from surattandasetoran_t sts
                inner join surattandasetorandetail_t stsd on stsd.objectstsfk = sts.nosts
                left join ststosck_t as ssc on sts.norec = ssc.objectstsfk
                left join strukclosingkasir_t as sck on ssc.objectsckfk = sck.norec
                left join strukclosing_t as sc on sc.norec = sck.noclosingfk
                left join strukbuktipenerimaan_t AS sbm on sbm.noclosingfk = sc.norec
                left join strukbuktipenerimaancarabayar_t as sbmcr ON sbmcr.nosbmfk = sbm.norec
                left JOIN carabayar_m as cb ON cb.id = sbmcr.objectcarabayarfk
                where sts.statusenabled = true
                and stsd.statusenabled = true and stsd.kdprofile = 30
                and sc.noclosing not in (
                    select sc.noclosing from strukclosing_t sc
                    inner join strukhistori_t sh on sh.noclosing = sc.norec
                    where sh.statusenabled = false
                )
                and date_part('year', sts.tglpenerimaan::timestamp ) = '$tahun'
                group by to_char(sts.tglpenerimaan, 'MM'), stsd.nourut, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.kolom1, stsd.kolom2
        ) as x
        group by x.nourut, x.date, x.kdrekening, x.nomer, x.uraian

        union all

		select x.nourut, x.date, x.kdrekening, x.nomer, x.uraian, sum(x.vol) as totalvol, sum(x.kolom1) as totalkolom1, sum(x.kolom2) as totalkolom2,
        (
            case 
            when sum(x.kolom1) is null and sum(x.kolom2) is null then sum(x.kolom1)
            when sum(x.kolom1) is null and sum(x.kolom2) is not null then sum(x.kolom2)
            when sum(x.kolom1) is not null and sum(x.kolom2) is null then sum(x.kolom1)
            else 0 
            end
        ) as totalfix
        from(	
				select to_char(sts.tglpenerimaan, 'MM') as date, stsd.nourut, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.kolom1, stsd.kolom2
                from surattandasetoran_t sts
                inner join surattandasetorandetail_t stsd on stsd.objectstsfk = sts.nosts
                where sts.statusenabled = true
                and stsd.statusenabled = true and stsd.kdprofile = 30
				and sts.kdprofile = 30
				and sts.ismanual = true
                and date_part('year', sts.tglpenerimaan::timestamp ) = '$tahun'
                group by to_char(sts.tglpenerimaan, 'MM'), stsd.nourut, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.kolom1, stsd.kolom2
        ) as x
        group by x.nourut, x.date, x.kdrekening, x.nomer, x.uraian
        
        union all

        select x.nourut, x.date, x.kdrekening, x.nomer, x.uraian, sum(x.vol) as totalvol, sum(x.kolom1) as totalkolom1, sum(x.kolom2) as totalkolom2,
        (
            case 
            when sum(x.kolom1) is null and sum(x.kolom2) is null then sum(x.kolom1)
            when sum(x.kolom1) is null and sum(x.kolom2) is not null then sum(x.kolom2)
            when sum(x.kolom1) is not null and sum(x.kolom2) is null then sum(x.kolom1)
            else 0 
            end
        ) as totalfix
        from(	
				select to_char(sts.tglpenerimaan, 'MM') as date, stsd.nourut, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.kolom1, stsd.kolom2
                from surattandasetoran_t sts
                inner join surattandasetorandetail_t stsd on stsd.objectstsfk = sts.nosts
				inner join ststorekapklaim_t str on sts.norec = str.objectstsfk
				inner join rekapklaimbpjs_t rkb on str.objectrekapklaimfk = rkb.norec
                where sts.statusenabled = true
                and stsd.statusenabled = true 
                and stsd.kdprofile = 30
                and str.statusenabled = true 
                and str.kdprofile = 30
                and rkb.statusenabled = true 
                and rkb.kdprofile = 30
				and sts.kdprofile = 30
                and date_part('year', sts.tglpenerimaan::timestamp ) = '$tahun'
                group by to_char(sts.tglpenerimaan, 'MM'), stsd.nourut, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.kolom1, stsd.kolom2
        ) as x
        group by x.nourut, x.date, x.kdrekening, x.nomer, x.uraian
        order by date, nourut"));

        $target = DB::select(DB::raw("select rp.norec,rp.isperubahan, rp.jumlahpendapatan,rp.tahun, rp.tglinput, rp.keterangan, rp.objectasalprodukfk, rp.objecturaianpendapatanfk,up.uraianpendapatan,ap.namaexternal, rp.uraianpendapatan as uraian
        from rincianpendapatan_t as rp
        inner join asalproduk_m as ap on ap.id = rp.objectasalprodukfk
        inner join uraianpendapatan_m as up on up.id = rp.objecturaianpendapatanfk
        where rp.kdprofile = 30
        and rp.statusenabled = true
        and up.kdprofile = 30
        and up.statusenabled = true
        and rp.tahun = '$tahun'
        order by up.nourut"));
        
        $jumlahtriwulan1 = 0;
        $jumlahtriwulan2 = 0;
        $jumlahtriwulan3 = 0;
        $jumlahtriwulan4 = 0;
        $jumlahtarget = 0;
        $data = [];

        foreach($target as $main){
            $jumlahtriwulan1 = 0;
            $jumlahtriwulan2 = 0;
            $jumlahtriwulan3 = 0;
            $jumlahtriwulan4 = 0;
            $jumlahtarget = 0;
            $uraian = $main->uraianpendapatan;
            foreach($detail as $row){
                if(($row->date == '01' || $row->date == '02' || $row->date == '03') && $main->uraianpendapatan == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahtriwulan1 += $row->totalfix;
                }
                else if(($row->date == '01' || $row->date == '02' || $row->date == '03') && $main->uraianpendapatan == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahtriwulan1 += $row->totalfix;
                }
                else if(($row->date == '01' || $row->date == '02' || $row->date == '03') && $main->uraianpendapatan == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid')){
                    $jumlahtriwulan1 += $row->totalfix;
                }
                else if(($row->date == '01' || $row->date == '02' || $row->date == '03') && $main->uraianpendapatan == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahtriwulan1 += $row->totalfix;
                }
                else if(($row->date == '01' || $row->date == '02' || $row->date == '03') && $main->uraianpendapatan == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahtriwulan1 += $row->totalfix;
                }
                else if(($row->date == '01' || $row->date == '02' || $row->date == '03') && $main->uraianpendapatan == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahtriwulan1 += $row->totalfix;
                }
                else if(($row->date == '01' || $row->date == '02' || $row->date == '03') && $main->uraianpendapatan == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahtriwulan1 += $row->totalfix;
                }
                else if(($row->date == '01' || $row->date == '02' || $row->date == '03') && $main->uraianpendapatan == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahtriwulan1 += $row->totalfix;
                }
                else if(($row->date == '01' || $row->date == '02' || $row->date == '03') && $main->uraianpendapatan == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahtriwulan1 += $row->totalfix;
                }
                else if(($row->date == '01' || $row->date == '02' || $row->date == '03') && $main->uraianpendapatan == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahtriwulan1 += $row->totalfix;
                }
                else if(($row->date == '01' || $row->date == '02' || $row->date == '03') && $main->uraianpendapatan == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahtriwulan1 += $row->totalfix;
                }
                else if(($row->date == '01' || $row->date == '02' || $row->date == '03') && $main->uraianpendapatan == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahtriwulan1 += $row->totalfix;
                }
                else if(($row->date == '01' || $row->date == '02' || $row->date == '03') && $main->uraianpendapatan == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahtriwulan1 += $row->totalfix;
                }
                else if(($row->date == '01' || $row->date == '02' || $row->date == '03') && $main->uraianpendapatan == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahtriwulan1 += $row->totalfix;
                }
                else if(($row->date == '01' || $row->date == '02' || $row->date == '03') && $main->uraianpendapatan == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahtriwulan1 += $row->totalfix;
                }
                else if(($row->date == '01' || $row->date == '02' || $row->date == '03') && $main->uraianpendapatan == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahtriwulan1 += $row->totalfix;
                }
                else if(($row->date == '01' || $row->date == '02' || $row->date == '03') && $main->uraianpendapatan == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahtriwulan1 += $row->totalfix;
                }
                else if(($row->date == '01' || $row->date == '02' || $row->date == '03') && $main->uraianpendapatan == 'Lain-lain Pendapatan BLUD' && $row->uraian == 'LAIN-LAIN'){
                    $jumlahtriwulan1 += $row->totalfix;
                }
                else if(($row->date == '01' || $row->date == '02' || $row->date == '03') && $row->uraian == $main->uraianpendapatan){
                    $jumlahtriwulan1 += $row->totalfix;
                } 

                if(($row->date == '04' || $row->date == '05' || $row->date == '06') && $main->uraianpendapatan == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahtriwulan2 += $row->totalfix;
                }
                else if(($row->date == '04' || $row->date == '05' || $row->date == '06') && $main->uraianpendapatan == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahtriwulan2 += $row->totalfix;
                }
                else if(($row->date == '04' || $row->date == '05' || $row->date == '06') && $main->uraianpendapatan == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid')){
                    $jumlahtriwulan2 += $row->totalfix;
                }
                else if(($row->date == '04' || $row->date == '05' || $row->date == '06') && $main->uraianpendapatan == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahtriwulan2 += $row->totalfix;
                }
                else if(($row->date == '04' || $row->date == '05' || $row->date == '06') && $main->uraianpendapatan == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahtriwulan2 += $row->totalfix;
                }
                else if(($row->date == '04' || $row->date == '05' || $row->date == '06') && $main->uraianpendapatan == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahtriwulan2 += $row->totalfix;
                }
                else if(($row->date == '04' || $row->date == '05' || $row->date == '06') && $main->uraianpendapatan == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahtriwulan2 += $row->totalfix;
                }
                else if(($row->date == '04' || $row->date == '05' || $row->date == '06') && $main->uraianpendapatan == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahtriwulan2 += $row->totalfix;
                }
                else if(($row->date == '04' || $row->date == '05' || $row->date == '06') && $main->uraianpendapatan == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahtriwulan2 += $row->totalfix;
                }
                else if(($row->date == '04' || $row->date == '05' || $row->date == '06') && $main->uraianpendapatan == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahtriwulan2 += $row->totalfix;
                }
                else if(($row->date == '04' || $row->date == '05' || $row->date == '06') && $main->uraianpendapatan == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahtriwulan2 += $row->totalfix;
                }
                else if(($row->date == '04' || $row->date == '05' || $row->date == '06') && $main->uraianpendapatan == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahtriwulan2 += $row->totalfix;
                }
                else if(($row->date == '04' || $row->date == '05' || $row->date == '06') && $main->uraianpendapatan == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahtriwulan2 += $row->totalfix;
                }
                else if(($row->date == '04' || $row->date == '05' || $row->date == '06') && $main->uraianpendapatan == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahtriwulan2 += $row->totalfix;
                }
                else if(($row->date == '04' || $row->date == '05' || $row->date == '06') && $main->uraianpendapatan == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahtriwulan2 += $row->totalfix;
                }
                else if(($row->date == '04' || $row->date == '05' || $row->date == '06') && $main->uraianpendapatan == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahtriwulan2 += $row->totalfix;
                }
                else if(($row->date == '04' || $row->date == '05' || $row->date == '06') && $main->uraianpendapatan == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahtriwulan2 += $row->totalfix;
                }
                else if(($row->date == '04' || $row->date == '05' || $row->date == '06') && $main->uraianpendapatan == 'Lain-lain Pendapatan BLUD' && $row->uraian == 'LAIN-LAIN'){
                    $jumlahtriwulan2 += $row->totalfix;
                }
                else if(($row->date == '04' || $row->date == '05' || $row->date == '06') && $row->uraian == $main->uraianpendapatan){
                    $jumlahtriwulan2 += $row->totalfix;
                }

                if(($row->date == '07' || $row->date == '08' || $row->date == '09') && $main->uraianpendapatan == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahtriwulan3 += $row->totalfix;
                }
                else if(($row->date == '07' || $row->date == '08' || $row->date == '09') && $main->uraianpendapatan == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahtriwulan3 += $row->totalfix;
                }
                else if(($row->date == '07' || $row->date == '08' || $row->date == '09') && $main->uraianpendapatan == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid')){
                    $jumlahtriwulan3 += $row->totalfix;
                }
                else if(($row->date == '07' || $row->date == '08' || $row->date == '09') && $main->uraianpendapatan == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahtriwulan3 += $row->totalfix;
                }
                else if(($row->date == '07' || $row->date == '08' || $row->date == '09') && $main->uraianpendapatan == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahtriwulan3 += $row->totalfix;
                }
                else if(($row->date == '07' || $row->date == '08' || $row->date == '09') && $main->uraianpendapatan == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahtriwulan3 += $row->totalfix;
                }
                else if(($row->date == '07' || $row->date == '08' || $row->date == '09') && $main->uraianpendapatan == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahtriwulan3 += $row->totalfix;
                }
                else if(($row->date == '07' || $row->date == '08' || $row->date == '09') && $main->uraianpendapatan == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahtriwulan3 += $row->totalfix;
                }
                else if(($row->date == '07' || $row->date == '08' || $row->date == '09') && $main->uraianpendapatan == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahtriwulan3 += $row->totalfix;
                }
                else if(($row->date == '07' || $row->date == '08' || $row->date == '09') && $main->uraianpendapatan == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahtriwulan3 += $row->totalfix;
                }
                else if(($row->date == '07' || $row->date == '08' || $row->date == '09') && $main->uraianpendapatan == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahtriwulan3 += $row->totalfix;
                }
                else if(($row->date == '07' || $row->date == '08' || $row->date == '09') && $main->uraianpendapatan == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahtriwulan3 += $row->totalfix;
                }
                else if(($row->date == '07' || $row->date == '08' || $row->date == '09') && $main->uraianpendapatan == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahtriwulan3 += $row->totalfix;
                }
                else if(($row->date == '07' || $row->date == '08' || $row->date == '09') && $main->uraianpendapatan == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahtriwulan3 += $row->totalfix;
                }
                else if(($row->date == '07' || $row->date == '08' || $row->date == '09') && $main->uraianpendapatan == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahtriwulan3 += $row->totalfix;
                }
                else if(($row->date == '07' || $row->date == '08' || $row->date == '09') && $main->uraianpendapatan == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahtriwulan3 += $row->totalfix;
                }
                else if(($row->date == '07' || $row->date == '08' || $row->date == '09') && $main->uraianpendapatan == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahtriwulan3 += $row->totalfix;
                }
                else if(($row->date == '07' || $row->date == '08' || $row->date == '09') && $main->uraianpendapatan == 'Lain-lain Pendapatan BLUD' && $row->uraian == 'LAIN-LAIN'){
                    $jumlahtriwulan3 += $row->totalfix;
                }
                else if(($row->date == '07' || $row->date == '08' || $row->date == '09') && $row->uraian == $main->uraianpendapatan){
                    $jumlahtriwulan3 += $row->totalfix;
                }

                if(($row->date == '10' || $row->date == '11' || $row->date == '12') && $main->uraianpendapatan == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahtriwulan4 += $row->totalfix;
                }
                else if(($row->date == '10' || $row->date == '11' || $row->date == '12') && $main->uraianpendapatan == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahtriwulan4 += $row->totalfix;
                }
                else if(($row->date == '10' || $row->date == '11' || $row->date == '12') && $main->uraianpendapatan == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid')){
                    $jumlahtriwulan4 += $row->totalfix;
                }
                else if(($row->date == '10' || $row->date == '11' || $row->date == '12') && $main->uraianpendapatan == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahtriwulan4 += $row->totalfix;
                }
                else if(($row->date == '10' || $row->date == '11' || $row->date == '12') && $main->uraianpendapatan == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahtriwulan4 += $row->totalfix;
                }
                else if(($row->date == '10' || $row->date == '11' || $row->date == '12') && $main->uraianpendapatan == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahtriwulan4 += $row->totalfix;
                }
                else if(($row->date == '10' || $row->date == '11' || $row->date == '12') && $main->uraianpendapatan == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahtriwulan4 += $row->totalfix;
                }
                else if(($row->date == '10' || $row->date == '11' || $row->date == '12') && $main->uraianpendapatan == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahtriwulan4 += $row->totalfix;
                }
                else if(($row->date == '10' || $row->date == '11' || $row->date == '12') && $main->uraianpendapatan == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' || $row->uraian == 'RAWAT INAP BPJS' || $row->uraian == 'RAWAT INAP IPWL' || $row->uraian == 'RAWAT INAP Jamkesda' || $row->uraian == 'RAWAT INAP Jamkesos' || $row->uraian == 'Klaim Covid' || $row->uraian == 'RAWAT JALAN BPJS' || $row->uraian == 'RAWAT JALAN IPWL' || $row->uraian == 'RAWAT JALAN Jamkesda' || $row->uraian == 'RAWAT JALAN Jamkesos' || $row->uraian == 'OBAT-OBATAN BPJS' || $row->uraian == 'OBAT-OBATAN Jamkesda' || $row->uraian == 'OBAT-OBATAN Jamkesos' || $row->uraian == 'OBAT-OBATAN IPWL')){
                    $jumlahtriwulan4 += $row->totalfix;
                }
                else if(($row->date == '10' || $row->date == '11' || $row->date == '12') && $main->uraianpendapatan == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahtriwulan4 += $row->totalfix;
                }
                else if(($row->date == '10' || $row->date == '11' || $row->date == '12') && $main->uraianpendapatan == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahtriwulan4 += $row->totalfix;
                }
                else if(($row->date == '10' || $row->date == '11' || $row->date == '12') && $main->uraianpendapatan == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahtriwulan4 += $row->totalfix;
                }
                else if(($row->date == '10' || $row->date == '11' || $row->date == '12') && $main->uraianpendapatan == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahtriwulan4 += $row->totalfix;
                }
                else if(($row->date == '10' || $row->date == '11' || $row->date == '12') && $main->uraianpendapatan == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahtriwulan4 += $row->totalfix;
                }
                else if(($row->date == '10' || $row->date == '11' || $row->date == '12') && $main->uraianpendapatan == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahtriwulan4 += $row->totalfix;
                }
                else if(($row->date == '10' || $row->date == '11' || $row->date == '12') && $main->uraianpendapatan == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahtriwulan4 += $row->totalfix;
                }
                else if(($row->date == '10' || $row->date == '11' || $row->date == '12') && $main->uraianpendapatan == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahtriwulan4 += $row->totalfix;
                }
                else if(($row->date == '10' || $row->date == '11' || $row->date == '12') && $main->uraianpendapatan == 'Lain-lain Pendapatan BLUD' && $row->uraian == 'LAIN-LAIN'){
                    $jumlahtriwulan4 += $row->totalfix;
                }
                else if(($row->date == '10' || $row->date == '11' || $row->date == '12') && $row->uraian == $main->uraianpendapatan){
                    $jumlahtriwulan4 += $row->totalfix;
                }
            }

            foreach($target as $tg){
                if($tg->uraianpendapatan == $main->uraianpendapatan){
                    $jumlahtarget += $tg->jumlahpendapatan;
                }
            }

            $data[] =array(
                'mainuraian' =>   $uraian,
                'jumlahtriwulan1' =>   $jumlahtriwulan1,
                'jumlahtriwulan2' =>   $jumlahtriwulan2,
                'jumlahtriwulan3' =>   $jumlahtriwulan3,
                'jumlahtriwulan4' =>   $jumlahtriwulan4,
                'jumlahtarget' =>   $jumlahtarget,
            );

            
        }

        


        $result = array(
            'detail' => $data,
        );
        
        return $this->setStatusCode(201)->respond($result, 'tes msg');
    }

    public function getRekapPendapatan(Request $request) {
        ini_set('max_execution_time', 600);
        $tahun = $request['tahun'];

        $data = DB::select(DB::raw("select c.bulan, d.*
        from(
            select to_char(DATE '2008-01-01' + (interval '1' month * generate_series(0,11)), 'Month') as bulan
        ) as c
        left join(
            select date, sum(jumlahjasagiro) jumlahjasagiro, sum(jumlahdiklat) jumlahdiklat, sum(jumlahbpjs) jumlahbpjs,
            sum(jumlahipwl) jumlahipwl, sum(jumlahjamkesos) jumlahjamkesos, sum(jumlahjamkesda) jumlahjamkesda,
            sum(jumlahrajal) jumlahrajal, sum(jumlahranap) jumlahranap, sum(jumlahlainlain) jumlahlainlain, sum(klaimcovid) klaimcovid
            from(
                select date,
                case when uraian = 'Jasa Giro' then sum(totalfix) else 0 end as jumlahjasagiro,
                case when uraian = 'DIKLAT' then sum(totalfix) else 0 end as jumlahdiklat,
                case when jenis = 'klaim' and uraian ilike '%BPJS%' then sum(totalfix) else 0 end as jumlahbpjs,
                case when jenis = 'klaim' and uraian ilike '%IPWL%' then sum(totalfix) else 0 end as jumlahipwl,
                case when jenis = 'klaim' and uraian ilike '%Jamkesos%' then sum(totalfix) else 0 end as jumlahjamkesos,
                case when jenis = 'klaim' and uraian ilike '%Jamkesda%' then sum(totalfix) else 0 end as jumlahjamkesda,
                case when nomer = '04' then sum(totalfix) else 0 end as jumlahlainlain,
                case when uraian = 'Klaim Covid' then sum(totalfix) else 0 end as klaimcovid,
                case when uraian in('KUNJUNGAN POLIKLINIK', 'DIPAM/PENDAFTARAN', 'TINDAKAN MEDIK POLIKLINIK',
                'TINDAKAN MEDIK IGD', 'TINDAKAN MEDIK PASIEN GIGI', 'OBAT-OBATAN', 'SURAT KETERANGAN (KIR)', 'PSIKOLOGI',
                'KONSULTASI GIZI', 'LABORATORIUM', 'ELEKTROMEDIK', 'FISIOTERAPY', 'RADIOLOGI', 'PERAWATAN PASIEN')
                then sum(totalfix) else 0 end as jumlahrajal,
                case when uraian in('VIP', 'Kelas I', 'Kelas UPPI', 'Kelas II', 'Kelas III', 'OBAT-OBATAN RANAP',
                'TINDAKAN MEDIK RANAP', 'VISITE DOKTER', 'REHABILITASI MENTAL', 'PERAWATAN JENAZAH')
                then sum(totalfix) else 0 end as jumlahranap
                from(
                                select 'sts' jenis, x.date, x.nomer, x.uraian, sum(x.vol) as totalvol, sum(x.kolom1) as totalkolom1, sum(x.kolom2) as totalkolom2,
                                (
                                        case 
                                        when sum(x.kolom1) is null and sum(x.kolom2) is null then sum(x.kolom1)
                                        when sum(x.kolom1) is null and sum(x.kolom2) is not null then sum(x.kolom2)
                                        when sum(x.kolom1) is not null and sum(x.kolom2) is null then sum(x.kolom1)
                                        else 0 
                                        end
                                ) as totalfix
                                from(	
                                select to_char(sts.tglpenerimaan, 'Month') as date, stsd.nomer, stsd.nourut, stsd.uraian, stsd.vol, stsd.kolom1, stsd.kolom2
                                                from surattandasetoran_t sts
                                                inner join surattandasetorandetail_t stsd on stsd.objectstsfk = sts.nosts
                                                left join ststosck_t as ssc on sts.norec = ssc.objectstsfk
                                                left join strukclosingkasir_t as sck on ssc.objectsckfk = sck.norec
                                                left join strukclosing_t as sc on sc.norec = sck.noclosingfk
                                                left join strukbuktipenerimaan_t AS sbm on sbm.noclosingfk = sc.norec
                                                left join strukbuktipenerimaancarabayar_t as sbmcr ON sbmcr.nosbmfk = sbm.norec
                                                left JOIN carabayar_m as cb ON cb.id = sbmcr.objectcarabayarfk
												left join strukhistori_t sh on sh.noclosing = sc.norec
                                                and sh.statusenabled = true
                                                where sts.statusenabled = true
                                                and stsd.statusenabled = true and stsd.kdprofile = 30
                                                and date_part('year', sts.tglpenerimaan::timestamp ) = '$tahun'
                                                group by to_char(sts.tglpenerimaan, 'Month'), stsd.nomer, stsd.nourut, stsd.uraian, stsd.vol, stsd.kolom1, stsd.kolom2
                                ) as x
                                where (x.nomer in('04') or x.uraian in('Jasa Giro', 'Klaim Covid', 'KUNJUNGAN POLIKLINIK', 'DIPAM/PENDAFTARAN', 'TINDAKAN MEDIK POLIKLINIK',
                                'TINDAKAN MEDIK IGD', 'TINDAKAN MEDIK PASIEN GIGI', 'OBAT-OBATAN', 'SURAT KETERANGAN (KIR)', 'PSIKOLOGI',
                                'KONSULTASI GIZI', 'VIP', 'Kelas I', 'Kelas UPPI', 'Kelas II', 'Kelas III', 'OBAT-OBATAN RANAP',
                                'TINDAKAN MEDIK RANAP', 'VISITE DOKTER', 'REHABILITASI MENTAL', 'PERAWATAN JENAZAH', 'DIKLAT',
                                'LABORATORIUM', 'ELEKTROMEDIK', 'FISIOTERAPY', 'RADIOLOGI', 'PERAWATAN PASIEN'))
                                group by x.date, x.nomer, x.uraian
                                
                                union all
        
                                select 'klaim' jenis, x.date, '0' nomer, x.uraian, sum(x.vol) as totalvol, sum(x.kolom1) as totalkolom1, sum(x.kolom2) as totalkolom2,
                                (
                                    case 
                                    when sum(x.kolom1) is null and sum(x.kolom2) is null then sum(x.kolom1)
                                    when sum(x.kolom1) is null and sum(x.kolom2) is not null then sum(x.kolom2)
                                    when sum(x.kolom1) is not null and sum(x.kolom2) is null then sum(x.kolom1)
                                    else 0 
                                    end
                                ) as totalfix
                                from(	
                                        select to_char(sts.tglpenerimaan, 'Month') as date, stsd.nourut, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.kolom1, stsd.kolom2
                                        from surattandasetoran_t sts
                                        inner join surattandasetorandetail_t stsd on stsd.objectstsfk = sts.nosts
                                        inner join ststorekapklaim_t str on sts.norec = str.objectstsfk
                                        inner join rekapklaimbpjs_t rkb on str.objectrekapklaimfk = rkb.norec
                                        where sts.statusenabled = true
                                        and stsd.statusenabled = true 
                                        and stsd.kdprofile = 30
                                        and str.statusenabled = true 
                                        and str.kdprofile = 30
                                        and rkb.statusenabled = true 
                                        and rkb.kdprofile = 30
                                        and sts.kdprofile = 30
                                        and date_part('year', sts.tglpenerimaan::timestamp ) = '2022'
                                        group by to_char(sts.tglpenerimaan, 'Month'), stsd.nourut, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.kolom1, stsd.kolom2
                                ) as x
                                group by x.date,x.uraian
                ) as y group by nomer, date, jenis, uraian
            ) as a group by date
        ) as d on c.bulan = d.date;"));

        $result = array(
            'detail' => $data,
        );
        
        return $this->setStatusCode(201)->respond($result, 'tes msg');
    }

    public function getPerincianObyekPenerimaan(Request $request) {
        ini_set('max_execution_time', 600);
        $tahun = $request['tahun'];
        $bulan = $request['bulan'];

        $data = DB::select(DB::raw("select '' nobku, x.nosts, x.nourut, x.date, x.kdrekening, x.nomer, x.uraian, sum(x.vol) as totalvol, sum(x.kolom1) as totalkolom1, sum(x.kolom2) as totalkolom2,
        (
            case 
            when sum(x.kolom1) is null and sum(x.kolom2) is null then sum(x.kolom1)
            when sum(x.kolom1) is null and sum(x.kolom2) is not null then sum(x.kolom2)
            when sum(x.kolom1) is not null and sum(x.kolom2) is null then sum(x.kolom1)
            else 0 
            end
        ) as totalfix
        from(	
				select sts.nosts, sts.tglpenerimaan::date as date, stsd.nourut, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.kolom1, stsd.kolom2
                from surattandasetoran_t sts
                inner join surattandasetorandetail_t stsd on stsd.objectstsfk = sts.nosts
                left join ststosck_t as ssc on sts.norec = ssc.objectstsfk
                left join strukclosingkasir_t as sck on ssc.objectsckfk = sck.norec
                left join strukclosing_t as sc on sc.norec = sck.noclosingfk
                left join strukbuktipenerimaan_t AS sbm on sbm.noclosingfk = sc.norec
                left join strukbuktipenerimaancarabayar_t as sbmcr ON sbmcr.nosbmfk = sbm.norec
                left JOIN carabayar_m as cb ON cb.id = sbmcr.objectcarabayarfk
                where sts.statusenabled = true
                and stsd.statusenabled = true and stsd.kdprofile = 30
				and stsd.uraian = 'JUMLAH'
                and sc.noclosing not in (
                    select sc.noclosing from strukclosing_t sc
                    inner join strukhistori_t sh on sh.noclosing = sc.norec
                    where sh.statusenabled = false
                )
                and date_part('month', sts.tglpenerimaan::timestamp ) = '$bulan'
                and date_part('year', sts.tglpenerimaan::timestamp ) = '$tahun'
                group by sts.nosts, sts.tglpenerimaan::date, stsd.nourut, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.kolom1, stsd.kolom2
        ) as x
        group by x.nosts, x.nourut, x.date, x.kdrekening, x.nomer, x.uraian

        union all

		select '' nobku, x.nosts, x.nourut, x.date, x.kdrekening, x.nomer, x.uraian, sum(x.vol) as totalvol, sum(x.kolom1) as totalkolom1, sum(x.kolom2) as totalkolom2,
        (
            case 
            when sum(x.kolom1) is null and sum(x.kolom2) is null then sum(x.kolom1)
            when sum(x.kolom1) is null and sum(x.kolom2) is not null then sum(x.kolom2)
            when sum(x.kolom1) is not null and sum(x.kolom2) is null then sum(x.kolom1)
            else 0 
            end
        ) as totalfix
        from(	
				select sts.nosts, sts.tglpenerimaan::date as date, stsd.nourut, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.kolom1, stsd.kolom2
                from surattandasetoran_t sts
                inner join surattandasetorandetail_t stsd on stsd.objectstsfk = sts.nosts
                where sts.statusenabled = true
                and stsd.statusenabled = true and stsd.kdprofile = 30
				and sts.kdprofile = 30
				and sts.ismanual = true
				and stsd.uraian = 'JUMLAH'
                and date_part('month', sts.tglpenerimaan::timestamp ) = '$bulan'
                and date_part('year', sts.tglpenerimaan::timestamp ) = '$tahun'
                group by sts.nosts, sts.tglpenerimaan::date, stsd.nourut, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.kolom1, stsd.kolom2
        ) as x
        group by x.nosts, x.nourut, x.date, x.kdrekening, x.nomer, x.uraian
        
        union all

        select '' nobku, x.nosts, x.nourut, x.date, x.kdrekening, x.nomer, x.uraian, sum(x.vol) as totalvol, sum(x.kolom1) as totalkolom1, sum(x.kolom2) as totalkolom2,
        (
            case 
            when sum(x.kolom1) is null and sum(x.kolom2) is null then sum(x.kolom1)
            when sum(x.kolom1) is null and sum(x.kolom2) is not null then sum(x.kolom2)
            when sum(x.kolom1) is not null and sum(x.kolom2) is null then sum(x.kolom1)
            else 0 
            end
        ) as totalfix
        from(	
				select sts.nosts, sts.tglpenerimaan::date as date, stsd.nourut, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.kolom1, stsd.kolom2
                from surattandasetoran_t sts
                inner join surattandasetorandetail_t stsd on stsd.objectstsfk = sts.nosts
				inner join ststorekapklaim_t str on sts.norec = str.objectstsfk
				inner join rekapklaimbpjs_t rkb on str.objectrekapklaimfk = rkb.norec
                where sts.statusenabled = true
                and stsd.statusenabled = true 
                and stsd.kdprofile = 30
                and str.statusenabled = true 
                and str.kdprofile = 30
                and rkb.statusenabled = true 
                and rkb.kdprofile = 30
				and sts.kdprofile = 30
				and stsd.uraian = 'JUMLAH'
                and date_part('month', sts.tglpenerimaan::timestamp ) = '$bulan'
                and date_part('year', sts.tglpenerimaan::timestamp ) = '$tahun'
                group by sts.nosts, sts.tglpenerimaan::date, stsd.nourut, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.kolom1, stsd.kolom2
        ) as x
        group by x.nosts, x.nourut, x.date, x.kdrekening, x.nomer, x.uraian
        order by date, nourut"));

        $target = DB::select(DB::raw("select rp.norec,rp.isperubahan, rp.jumlahpendapatan,rp.tahun, rp.tglinput, rp.keterangan, rp.objectasalprodukfk, rp.objecturaianpendapatanfk,up.uraianpendapatan,ap.namaexternal, rp.uraianpendapatan as uraian
        from rincianpendapatan_t as rp
        inner join asalproduk_m as ap on ap.id = rp.objectasalprodukfk
        inner join uraianpendapatan_m as up on up.id = rp.objecturaianpendapatanfk
        where rp.kdprofile = 30
        and rp.statusenabled = true
        and up.kdprofile = 30
        and up.statusenabled = true
        and rp.tahun = '$tahun'
        and up.uraianpendapatan = 'PENDAPATAN USAHA BLUD'
        order by up.nourut"));

        $result = array(
            'detail' => $data,
            'target' => $target,
        );
        
        return $this->setStatusCode(201)->respond($result, 'tes msg');
    }

    public function getPengelompokkanTarif(Request $request) {
        ini_set('max_execution_time', 600);
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];

        $data = DB::select(DB::raw("select namaproduk, tarif, sum(pendapatan) pendapatan
        from(
                        select sts.nosts, pp.norec, pr.namaproduk, pp.hargajual tarif,
                (((CASE WHEN pp.hargajual IS NULL THEN 0 ELSE pp.hargajual::float8 END - CASE WHEN pp.hargadiscount IS NULL THEN
                0 ELSE pp.hargadiscount::float8 END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN 0 ELSE pp.jasa::float8 END ) AS pendapatan
                FROM   pasien_m ps 
                                inner join pasiendaftar_t pd on ps.id=pd.nocmfk
                                inner join antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                                inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
                                inner JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk  
                                left JOIN strukpelayanan_t AS sp ON sp.norec = pp.strukfk  
                                LEFT JOIN strukbuktipenerimaan_t AS sbm ON sbm.nostrukfk = sp.norec AND sbm.statusenabled = true  
                                LEFT JOIN strukbuktipenerimaancarabayar_t as sbmcr ON sbmcr.nosbmfk = sbm.norec
                                LEFT JOIN carabayar_m as cb ON cb.id = sbmcr.objectcarabayarfk
                                LEFT JOIN produk_m AS pr ON pr.id = pp.produkfk  
                                inner join strukclosing_t as sc on sbm.noclosingfk = sc.norec
                                inner join strukclosingkasir_t as sck on sc.norec = sck.noclosingfk
                                left join ststosck_t as ssc on ssc.objectsckfk = sck.norec
                                left join surattandasetoran_t as sts on sts.norec = ssc.objectstsfk
                where pd.statusenabled = true
                        and sts.statusenabled = true
                and pd.kdprofile = 30
                and sts.tglpenerimaan between '$tglAwal' and '$tglAkhir'
                        and (pd.objectkelompokpasienlastfk = 1 or pd.objectkelompokpasienlastfk = 12)
                        group by sts.nosts, pp.norec, pr.namaproduk, pp.hargajual, pp.hargadiscount, pp.jumlah, pp.jasa
                
                union all
                
                select sts.nosts, spd.norec, pr.namaproduk, spd.hargasatuan tarif, 
                case when cb2.id is null then (spd.qtyproduk * spd.hargasatuan * spd.qtyoranglast)::float4
                        else sbm.totaldibayar end as pendapatan
                from strukclosingkasir_t as sck
                inner join strukclosing_t as sc on sc.norec = sck.noclosingfk
                inner join strukbuktipenerimaan_t as sbm on sbm.noclosingfk = sc.norec
                inner join strukpelayanan_t as sp on sbm.nostrukfk = sp.norec
                inner join strukpelayanandetail_t as spd on sp.norec = spd.nostrukfk
                        inner join strukbuktipenerimaancarabayar_t sbmcr on sbmcr.nosbmfk = sbm.norec
                inner join produk_m pr on pr.id=spd.objectprodukfk
                inner join carabayar_m as cb on cb.id = sck.carabayarfk
                left join ststosck_t as ssc on ssc.objectsckfk = sck.norec
                left join surattandasetoran_t as sts on sts.norec = ssc.objectstsfk
                        LEFT JOIN strukbuktipenerimaan_t AS sbm2 ON sbm2.nostrukfk = sp.norec AND sbm2.statusenabled = true and sbm2.norec <> sbm.norec 
                        LEFT JOIN strukbuktipenerimaancarabayar_t as sbmcr2 ON sbmcr2.nosbmfk = sbm2.norec
                        LEFT JOIN carabayar_m as cb2 ON cb2.id = sbmcr2.objectcarabayarfk 
                where (sbm.keteranganlainnya = 'Pembayaran Tagihan Non Layanan' or sbm.keteranganlainnya = 'Pembayaran Diklat')
                and sts.tglpenerimaan between '$tglAwal' and '$tglAkhir'
                        and sts.statusenabled = true
                        group by cb2.id, sbm.totaldibayar, sts.nosts, spd.norec, pr.namaproduk, spd.hargasatuan, spd.qtyproduk, spd.qtyoranglast
        ) as x 
        group by namaproduk, tarif;"));

        $result = array(
            'detail' => $data,
            'as' => 'as@vexana',
        );
        
        return $this->setStatusCode(201)->respond($result, 'tes msg');
    }
        

    public function getSTSPertanggal(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $bulanx = $request['bulan'];
        $tahunx = $request['tahun'];
        $bayar = '';
        $nosts = '';
        if (isset($request['bayar']) && $request['bayar'] != "" && $request['bayar'] != "undefined" && $request['bayar']==2) {
            $bayar = ' and sbmcr.objectcarabayarfk = 3';
        } else if (isset($request['bayar']) && $request['bayar'] != "" && $request['bayar'] != "undefined" && $request['bayar']==1) {
            $bayar = ' and sbmcr.objectcarabayarfk = 1';
        } else if (isset($request['bayar']) && $request['bayar'] != "" && $request['bayar'] != "undefined" && $request['bayar']==3) {
            $bayar = ' and sbmcr.objectcarabayarfk is null';
        } else if (isset($request['bayar']) && $request['bayar'] != "" && $request['bayar'] != "undefined" && $request['bayar']==4) {
            $bayar = ' and sbmcr.objectcarabayarfk in (1,3)';
        } 

        if(isset($request['nosts']) && $request['nosts'] != ''){
            $nosts = "and sts.nosts ilike '%". $request['nosts']. "%'";
        }
        $data = DB::select(DB::raw("select extract(day from tanggal) as tanggal, sum(jumlahjiwa) jumlahjiwa, sum(jumlahnapza) jumlahnapza, sum(jumlahperiksadokterumum) jumlahperiksadokterumum,
        sum(jumlahperiksadoktergigi) jumlahperiksadoktergigi, sum(jumlahperiksadokterpenydalam) jumlahperiksadokterpenydalam,
        sum(jumlahperiksadokteranak) jumlahperiksadokteranak, sum(jumlahperiksadoktersyaraf) jumlahperiksadoktersyaraf,
        sum(jumlahperiksadokterelektromedik) jumlahperiksadokterelektromedik, sum(jumlahperiksadokterigd) jumlahperiksadokterigd,
        sum(jumlahdipam) jumlahdipam, sum(jumlahtmpoli) jumlahtmpoli, sum(jumlahtmigd) jumlahtmigd, sum(jumlahtmgigi) jumlahtmgigi,
        sum(jumlahobatrajal) jumlahobatrajal, sum(jumlahkir) jumlahkir, sum(jumlahpsikolog) jumlahpsikolog, sum(jumlahlab) jumlahlab,
        sum(jumlahtmelektromedik) jumlahtmelektromedik, sum(jumlahfisio) jumlahfisio, sum(jumlahradio) jumlahradio, sum(jumlahdiklat) jumlahdiklat,
        sum(jumlahvip) jumlahvip, sum(jumlahkelas1) jumlahkelas1, sum(jumlahkelasuppi) jumlahkelasuppi, sum(jumlahkelas2) jumlahkelas2,
        sum(jumlahkelas3) jumlahkelas3, sum(jumlahobatranap) jumlahobatranap, sum(jumlahtmranap) jumlahtmranap, sum(jumlahvisite) jumlahvisite,
        sum(jumlahrehabmental) jumlahrehabmental, sum(jumlahjenazah) jumlahjenazah, sum(jumlahlegalisir) jumlahlegalisir, sum(jumlahgedungterapi) jumlahgedungterapi,
        sum(jumlahsewalapangan) jumlahsewalapangan, sum(jumlahgedungdiklat) jumlahgedungdiklat, sum(jumlahgrhasiainn) jumlahgrhasiainn,
        sum(jumlahpertanian) jumlahpertanian, sum(jumlahkalandra) jumlahkalandra, sum(jumlahsewatempatfc) jumlahsewatempatfc, sum(jumlahmanekin) jumlahmanekin,
        sum(jumlahsewaambulan) jumlahsewaambulan, sum(jumlahsewabus) jumlahsewabus, sum(jumlahketerampilan) jumlahketerampilan, sum(jumlahparkir) jumlahparkir,
        sum(jumlahlainlain) jumlahlainlain, sum(jumlahtotal) jumlahtotal,

        sum(jumlahklaimcovid) jumlahklaimcovid,
        sum(jumlahjasabank) jumlahjasabank,
        sum(jumlahrajalbpjs) jumlahrajalbpjs,
        sum(jumlahrajaljamkesda) jumlahrajaljamkesda,
        sum(jumlahrajaljamkesos) jumlahrajaljamkesos,
        sum(jumlahrajalipwl) jumlahrajalipwl,
        sum(jumlahobatbpjs) jumlahobatbpjs,
        sum(jumlahobatjamkesda) jumlahobatjamkesda,
        sum(jumlahobatjamkesos) jumlahobatjamkesos,
        sum(jumlahobatipwl) jumlahobatipwl,
        sum(jumlahranapbpjs) jumlahranapbpjs,
        sum(jumlahranapjamkesda) jumlahranapjamkesda,
        sum(jumlahranapjamkesos) jumlahranapjamkesos,
        sum(jumlahranapipwl) jumlahranapipwl,
        sum(jumlahcsbpjs) jumlahcsbpjs,
        sum(jumlahcsjamkesda) jumlahcsjamkesda,
        sum(jumlahcsjamkesos) jumlahcsjamkesos,
        sum(jumlahklaim) jumlahklaim,
        sum(jumlahadmin) jumlahadmin,
        sum(jumlahtransfer) jumlahtransfer,
        (sum(jumlahtotal) + sum(jumlahklaim)) - sum(jumlahadmin) - sum(jumlahtransfer) jumlahnetto
        from(
        select x.tanggal,
        case when x.uraian = 'PERIKSA DOKTER SPESIALIS JIWA' then sum(x.totalfix) else 0 end as jumlahjiwa,
        case when x.uraian = 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' then sum(x.totalfix) else 0 end as jumlahnapza,
        case when x.uraian = 'PERIKSA DOKTER UMUM' then sum(x.totalfix) else 0 end as jumlahperiksadokterumum,
        case when x.uraian = 'PERIKSA DOKTER GIGI' then sum(x.totalfix) else 0 end as jumlahperiksadoktergigi,
        case when x.uraian = 'PERIKSA DOKTER PENYAKIT DALAM' then sum(x.totalfix) else 0 end as jumlahperiksadokterpenydalam,
        case when x.uraian = 'PERIKSA DOKTER ANAK' then sum(x.totalfix) else 0 end as jumlahperiksadokteranak,
        case when x.uraian = 'PERIKSA DOKTER SYARAF' then sum(x.totalfix) else 0 end as jumlahperiksadoktersyaraf,
        case when x.uraian = 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' then sum(x.totalfix) else 0 end as jumlahperiksadokterelektromedik,
        case when x.uraian = 'PERIKSA DOKTER IGD' then sum(x.totalfix) else 0 end as jumlahperiksadokterigd,
        case when x.uraian = 'DIPAM/PENDAFTARAN' then sum(x.totalfix) else 0 end as jumlahdipam,
        case when x.uraian = 'TINDAKAN MEDIK POLIKLINIK' then sum(x.totalfix) else 0 end as jumlahtmpoli,
        case when x.uraian = 'TINDAKAN MEDIK IGD' then sum(x.totalfix) else 0 end as jumlahtmigd,
        case when x.uraian = 'TINDAKAN MEDIK PASIEN GIGI' then sum(x.totalfix) else 0 end as jumlahtmgigi,
        case when x.uraian = 'OBAT-OBATAN' then sum(x.totalfix) else 0 end as jumlahobatrajal,
        case when x.uraian = 'SURAT KETERANGAN (KIR)' then sum(x.totalfix) else 0 end as jumlahkir,
        case when x.uraian = 'PSIKOLOGI' then sum(x.totalfix) else 0 end as jumlahpsikolog,
        case when x.uraian = 'KONSULTASI GIZI' then sum(x.totalfix) else 0 end as jumlahgizi,
        case when x.uraian = 'LABORATORIUM' then sum(x.totalfix) else 0 end as jumlahlab,
        case when x.uraian = 'ELEKTROMEDIK' then sum(x.totalfix) else 0 end as jumlahtmelektromedik,
        case when x.uraian = 'FISIOTERAPY' then sum(x.totalfix) else 0 end as jumlahfisio,
        case when x.uraian = 'RADIOLOGI' then sum(x.totalfix) else 0 end as jumlahradio,
        case when x.uraian = 'DIKLAT' then sum(x.totalfix) else 0 end as jumlahdiklat,
        case when x.uraian = 'VIP' then sum(x.totalfix) else 0 end as jumlahvip,
        case when x.uraian = 'Kelas I' then sum(x.totalfix) else 0 end as jumlahkelas1,
        case when x.uraian = 'Kelas UPPI' then sum(x.totalfix) else 0 end as jumlahkelasuppi,
        case when x.uraian = 'Kelas II' then sum(x.totalfix) else 0 end as jumlahkelas2,
        case when x.uraian = 'Kelas III' then sum(x.totalfix) else 0 end as jumlahkelas3,
        case when x.uraian = 'OBAT-OBATAN RANAP' then sum(x.totalfix) else 0 end as jumlahobatranap,
        case when x.uraian = 'TINDAKAN MEDIK RANAP' then sum(x.totalfix) else 0 end as jumlahtmranap,
        case when x.uraian = 'VISITE DOKTER' then sum(x.totalfix) else 0 end as jumlahvisite,
        case when x.uraian = 'REHABILITASI MENTAL' then sum(x.totalfix) else 0 end as jumlahrehabmental,
        case when x.uraian = 'PERAWATAN JENAZAH' then sum(x.totalfix) else 0 end as jumlahjenazah,
        case when x.uraian = 'LEGALISIR' then sum(x.totalfix) else 0 end as jumlahlegalisir,
        case when x.uraian = 'SEWA GEDUNG TERAPI' then sum(x.totalfix) else 0 end as jumlahgedungterapi,
        case when x.uraian = 'SEWA LAPANGAN SEPAK BOLA' then sum(x.totalfix) else 0 end as jumlahsewalapangan,
        case when x.uraian = 'SEWA GEDUNG DIKLAT' then sum(x.totalfix) else 0 end as jumlahgedungdiklat,
        case when x.uraian = 'SEWA GEDUNG GRHASIA INN' then sum(x.totalfix) else 0 end as jumlahgrhasiainn,
        case when x.uraian = 'SEWA TANAH PERTANIAN' then sum(x.totalfix) else 0 end as jumlahpertanian,
        case when x.uraian = 'SEWA KALANDRA' then sum(x.totalfix) else 0 end as jumlahkalandra,
        case when x.uraian = 'SEWA TEMPAT FOTOCOPY' then sum(x.totalfix) else 0 end as jumlahsewatempatfc,
        case when x.uraian = 'SEWA MANEKIN' then sum(x.totalfix) else 0 end as jumlahmanekin,
        case when x.uraian = 'SEWA AMBULAN/MOBIL JENAZAH' then sum(x.totalfix) else 0 end as jumlahsewaambulan,
        case when x.uraian = 'SEWA BUS' then sum(x.totalfix) else 0 end as jumlahsewabus,
        case when x.uraian = 'HASIL KETRAMPILAN PASIEN' then sum(x.totalfix) else 0 end as jumlahketerampilan,
        case when x.uraian = 'PARKIR' then sum(x.totalfix) else 0 end as jumlahparkir,
        case when x.uraian = 'LAIN-LAIN' then sum(x.totalfix) else 0 end as jumlahlainlain,
        case when x.uraian = 'JUMLAH' then sum(x.totalfix) else 0 end as jumlahtotal,

        case when x.uraian = 'Klaim Covid' then sum(x.totalfix) else 0 end as jumlahklaimcovid,
        case when x.uraian = 'Jasa Bank' then sum(x.totalfix) else 0 end as jumlahjasabank,
        case when x.uraian = 'RAWAT JALAN BPJS' then sum(x.totalfix) else 0 end as jumlahrajalbpjs,
        case when x.uraian = 'RAWAT JALAN Jamkesda' then sum(x.totalfix) else 0 end as jumlahrajaljamkesda,
        case when x.uraian = 'RAWAT JALAN Jamkesos' then sum(x.totalfix) else 0 end as jumlahrajaljamkesos,
        case when x.uraian = 'RAWAT JALAN IPWL' then sum(x.totalfix) else 0 end as jumlahrajalipwl,
        case when x.uraian = 'OBAT-OBATAN BPJS' then sum(x.totalfix) else 0 end as jumlahobatbpjs,
        case when x.uraian = 'OBAT-OBATAN Jamkesda' then sum(x.totalfix) else 0 end as jumlahobatjamkesda,
        case when x.uraian = 'OBAT-OBATAN Jamkesos' then sum(x.totalfix) else 0 end as jumlahobatjamkesos,
        case when x.uraian = 'OBAT-OBATAN IPWL' then sum(x.totalfix) else 0 end as jumlahobatipwl,
        case when x.uraian = 'RAWAT INAP BPJS' then sum(x.totalfix) else 0 end as jumlahranapbpjs,
        case when x.uraian = 'RAWAT INAP Jamkesda' then sum(x.totalfix) else 0 end as jumlahranapjamkesda,
        case when x.uraian = 'RAWAT INAP Jamkesos' then sum(x.totalfix) else 0 end as jumlahranapjamkesos,
        case when x.uraian = 'RAWAT INAP IPWL' then sum(x.totalfix) else 0 end as jumlahranapipwl,
        case when x.uraian = 'COST SHARING BPJS' then sum(x.totalfix) else 0 end as jumlahcsbpjs,
        case when x.uraian = 'COST SHARING JAMKESDA BANTUL' then sum(x.totalfix) else 0 end as jumlahcsjamkesda,
        case when x.uraian = 'COST SHARING JAMKESOS' then sum(x.totalfix) else 0 end as jumlahcsjamkesos,
        case when x.uraian = 'JUMLAH KLAIM' then sum(x.totalfix) else 0 end as jumlahklaim,
        case when x.uraian = 'BIAYA ADMINISTRASI BANK' then sum(x.totalfix) else 0 end as jumlahadmin,
        case when x.uraian = 'BIAYA TRANSFER' then sum(x.totalfix) else 0 end as jumlahtransfer,
        case when x.uraian = 'JUMLAH NETTO' then sum(x.totalfix) else 0 end as jumlahnetto
        from(
            select i.tglpenerimaan::date as tanggal, i.kdrekening, i.nomer, i.uraian, sum(i.vol) as totalvol, sum(i.kolom1) as totalkolom1, sum(i.kolom2) as totalkolom2,
            (
            case
            when sum(i.kolom1) is null and sum(i.kolom2) is null then sum(i.kolom1)
            when sum(i.kolom1) is null and sum(i.kolom2) is not null then sum(i.kolom2)
            when sum(i.kolom1) is not null and sum(i.kolom2) is null then sum(i.kolom1)
            else 0
            end
            ) as totalfix
                from(
                    select sts.tglpenerimaan, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.norec,
                    stsd.kolom1, stsd.kolom2, stsd.nourut, sts.ismanual
                    from surattandasetoran_t sts
                    inner join surattandasetorandetail_t stsd on stsd.objectstsfk = sts.nosts
                    left join ststosck_t as ssc on sts.norec = ssc.objectstsfk
                    left join strukclosingkasir_t as sck on ssc.objectsckfk = sck.norec
                    left join strukclosing_t as sc on sc.norec = sck.noclosingfk
                    left join strukbuktipenerimaan_t AS sbm on sbm.noclosingfk = sc.norec
                    left join strukbuktipenerimaancarabayar_t as sbmcr ON sbmcr.nosbmfk = sbm.norec
                    left JOIN carabayar_m as cb ON cb.id = sbmcr.objectcarabayarfk
                    where sts.statusenabled = true
                    and sc.noclosing not in (
                            select sc.noclosing from strukclosing_t sc
                            inner join strukhistori_t sh on sh.noclosing = sc.norec
                            where sh.statusenabled = false
                            )
                    and extract(year from sts.tglpenerimaan::date ) = ".$tahunx."
                    and extract(month from sts.tglpenerimaan::date ) = ".$bulanx."
                    and sts.statusenabled = true and sts.kdprofile = 30
                    and stsd.statusenabled = true and stsd.kdprofile = 30
                    $bayar
                    $nosts
                    group by sts.tglpenerimaan, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.norec,
                    stsd.kolom1, stsd.kolom2, stsd.nourut, sts.ismanual

					union all

					select sts.tglpenerimaan, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.norec,
                    stsd.kolom1, stsd.kolom2, stsd.nourut, sts.ismanual
					from surattandasetoran_t sts
					inner join surattandasetorandetail_t stsd on stsd.objectstsfk = sts.nosts
					where sts.kdprofile = 30
					and sts.statusenabled = true
					and sts.ismanual = true
					and extract(year from sts.tglpenerimaan::date ) = ".$tahunx."
                    and extract(month from sts.tglpenerimaan::date ) = ".$bulanx."
                    $nosts

					union all
										
					select sts.tglpenerimaan, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.norec,
                    stsd.kolom1, stsd.kolom2, stsd.nourut, sts.ismanual
					from surattandasetoran_t sts
					inner join surattandasetorandetail_t stsd on stsd.objectstsfk = sts.nosts
					inner join ststorekapklaim_t str on sts.norec = str.objectstsfk
					inner join rekapklaimbpjs_t rkb on str.objectrekapklaimfk = rkb.norec
					where sts.kdprofile = 30
					and sts.statusenabled = true
					and str.kdprofile = 30
					and str.statusenabled = true
					and extract(year from sts.tglpenerimaan::date ) = ".$tahunx."
                    and extract(month from sts.tglpenerimaan::date ) = ".$bulanx."
                    $nosts
					group by sts.tglpenerimaan, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.norec,
                    stsd.kolom1, stsd.kolom2, stsd.nourut, sts.ismanual
                ) as i group by i.tglpenerimaan, i.kdrekening, i.nomer, i.uraian
            ) as x group by x.tanggal, x.uraian
        ) as y group by extract(day from tanggal) order by tanggal"));

        $result = array(
            'detail' => $data,
        );
        
        return $this->setStatusCode(201)->respond($result, 'tes msg');
    }

    public function getDetailSTSPertanggal(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $bulanx = $request['bulan'];
        $tahunx = $request['tahun'];
        $tglx = $request['tgl'];
        
        $data = DB::select(DB::raw("select nosts, sum(jumlahjiwa) jumlahjiwa, sum(jumlahnapza) jumlahnapza, sum(jumlahperiksadokterumum) jumlahperiksadokterumum,
        sum(jumlahperiksadoktergigi) jumlahperiksadoktergigi, sum(jumlahperiksadokterpenydalam) jumlahperiksadokterpenydalam,
        sum(jumlahperiksadokteranak) jumlahperiksadokteranak, sum(jumlahperiksadoktersyaraf) jumlahperiksadoktersyaraf,
        sum(jumlahperiksadokterelektromedik) jumlahperiksadokterelektromedik, sum(jumlahperiksadokterigd) jumlahperiksadokterigd,
        sum(jumlahdipam) jumlahdipam, sum(jumlahtmpoli) jumlahtmpoli, sum(jumlahtmigd) jumlahtmigd, sum(jumlahtmgigi) jumlahtmgigi,
        sum(jumlahobatrajal) jumlahobatrajal, sum(jumlahkir) jumlahkir, sum(jumlahpsikolog) jumlahpsikolog, sum(jumlahlab) jumlahlab,
        sum(jumlahtmelektromedik) jumlahtmelektromedik, sum(jumlahfisio) jumlahfisio, sum(jumlahradio) jumlahradio, sum(jumlahdiklat) jumlahdiklat,
        sum(jumlahvip) jumlahvip, sum(jumlahkelas1) jumlahkelas1, sum(jumlahkelasuppi) jumlahkelasuppi, sum(jumlahkelas2) jumlahkelas2,
        sum(jumlahkelas3) jumlahkelas3, sum(jumlahobatranap) jumlahobatranap, sum(jumlahtmranap) jumlahtmranap, sum(jumlahvisite) jumlahvisite,
        sum(jumlahrehabmental) jumlahrehabmental, sum(jumlahjenazah) jumlahjenazah, sum(jumlahlegalisir) jumlahlegalisir, sum(jumlahgedungterapi) jumlahgedungterapi,
        sum(jumlahsewalapangan) jumlahsewalapangan, sum(jumlahgedungdiklat) jumlahgedungdiklat, sum(jumlahgrhasiainn) jumlahgrhasiainn,
        sum(jumlahpertanian) jumlahpertanian, sum(jumlahkalandra) jumlahkalandra, sum(jumlahsewatempatfc) jumlahsewatempatfc, sum(jumlahmanekin) jumlahmanekin,
        sum(jumlahsewaambulan) jumlahsewaambulan, sum(jumlahsewabus) jumlahsewabus, sum(jumlahketerampilan) jumlahketerampilan, sum(jumlahparkir) jumlahparkir,
        sum(jumlahlainlain) jumlahlainlain, sum(jumlahtotal) jumlahtotal,

        sum(jumlahklaimcovid) jumlahklaimcovid,
        sum(jumlahjasabank) jumlahjasabank,
        sum(jumlahrajalbpjs) jumlahrajalbpjs,
        sum(jumlahrajaljamkesda) jumlahrajaljamkesda,
        sum(jumlahrajaljamkesos) jumlahrajaljamkesos,
        sum(jumlahrajalipwl) jumlahrajalipwl,
        sum(jumlahobatbpjs) jumlahobatbpjs,
        sum(jumlahobatjamkesda) jumlahobatjamkesda,
        sum(jumlahobatjamkesos) jumlahobatjamkesos,
        sum(jumlahobatipwl) jumlahobatipwl,
        sum(jumlahranapbpjs) jumlahranapbpjs,
        sum(jumlahranapjamkesda) jumlahranapjamkesda,
        sum(jumlahranapjamkesos) jumlahranapjamkesos,
        sum(jumlahranapipwl) jumlahranapipwl,
        sum(jumlahcsbpjs) jumlahcsbpjs,
        sum(jumlahcsjamkesda) jumlahcsjamkesda,
        sum(jumlahcsjamkesos) jumlahcsjamkesos,
        sum(jumlahklaim) jumlahklaim,
        sum(jumlahadmin) jumlahadmin,
        sum(jumlahtransfer) jumlahtransfer,
        sum(jumlahnetto) jumlahnetto,
        sum(jumlahgizi) jumlahgizi,
        sum(jumlahtunaipasienrajal) jumlahtunaipasienrajal
        from(
        select x.nosts,
        case when x.uraian = 'PERIKSA DOKTER SPESIALIS JIWA' then sum(x.totalfix) else 0 end as jumlahjiwa,
        case when x.uraian = 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' then sum(x.totalfix) else 0 end as jumlahnapza,
        case when x.uraian = 'PERIKSA DOKTER UMUM' then sum(x.totalfix) else 0 end as jumlahperiksadokterumum,
        case when x.uraian = 'PERIKSA DOKTER GIGI' then sum(x.totalfix) else 0 end as jumlahperiksadoktergigi,
        case when x.uraian = 'PERIKSA DOKTER PENYAKIT DALAM' then sum(x.totalfix) else 0 end as jumlahperiksadokterpenydalam,
        case when x.uraian = 'PERIKSA DOKTER ANAK' then sum(x.totalfix) else 0 end as jumlahperiksadokteranak,
        case when x.uraian = 'PERIKSA DOKTER SYARAF' then sum(x.totalfix) else 0 end as jumlahperiksadoktersyaraf,
        case when x.uraian = 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' then sum(x.totalfix) else 0 end as jumlahperiksadokterelektromedik,
        case when x.uraian = 'PERIKSA DOKTER IGD' then sum(x.totalfix) else 0 end as jumlahperiksadokterigd,
        case when x.uraian = 'DIPAM/PENDAFTARAN' then sum(x.totalfix) else 0 end as jumlahdipam,
        case when x.uraian = 'TINDAKAN MEDIK POLIKLINIK' then sum(x.totalfix) else 0 end as jumlahtmpoli,
        case when x.uraian = 'TINDAKAN MEDIK IGD' then sum(x.totalfix) else 0 end as jumlahtmigd,
        case when x.uraian = 'TINDAKAN MEDIK PASIEN GIGI' then sum(x.totalfix) else 0 end as jumlahtmgigi,
        case when x.uraian = 'OBAT-OBATAN' then sum(x.totalfix) else 0 end as jumlahobatrajal,
        case when x.uraian = 'SURAT KETERANGAN (KIR)' then sum(x.totalfix) else 0 end as jumlahkir,
        case when x.uraian = 'PSIKOLOGI' then sum(x.totalfix) else 0 end as jumlahpsikolog,
        case when x.uraian = 'KONSULTASI GIZI' then sum(x.totalfix) else 0 end as jumlahgizi,
        case when x.uraian = 'LABORATORIUM' then sum(x.totalfix) else 0 end as jumlahlab,
        case when x.uraian = 'ELEKTROMEDIK' then sum(x.totalfix) else 0 end as jumlahtmelektromedik,
        case when x.uraian = 'FISIOTERAPY' then sum(x.totalfix) else 0 end as jumlahfisio,
        case when x.uraian = 'RADIOLOGI' then sum(x.totalfix) else 0 end as jumlahradio,
        case when x.uraian = 'DIKLAT' then sum(x.totalfix) else 0 end as jumlahdiklat,
        case when x.uraian = 'VIP' then sum(x.totalfix) else 0 end as jumlahvip,
        case when x.uraian = 'Kelas I' then sum(x.totalfix) else 0 end as jumlahkelas1,
        case when x.uraian = 'Kelas UPPI' then sum(x.totalfix) else 0 end as jumlahkelasuppi,
        case when x.uraian = 'Kelas II' then sum(x.totalfix) else 0 end as jumlahkelas2,
        case when x.uraian = 'Kelas III' then sum(x.totalfix) else 0 end as jumlahkelas3,
        case when x.uraian = 'OBAT-OBATAN RANAP' then sum(x.totalfix) else 0 end as jumlahobatranap,
        case when x.uraian = 'TINDAKAN MEDIK RANAP' then sum(x.totalfix) else 0 end as jumlahtmranap,
        case when x.uraian = 'VISITE DOKTER' then sum(x.totalfix) else 0 end as jumlahvisite,
        case when x.uraian = 'REHABILITASI MENTAL' then sum(x.totalfix) else 0 end as jumlahrehabmental,
        case when x.uraian = 'PERAWATAN JENAZAH' then sum(x.totalfix) else 0 end as jumlahjenazah,
        case when x.uraian = 'LEGALISIR' then sum(x.totalfix) else 0 end as jumlahlegalisir,
        case when x.uraian = 'SEWA GEDUNG TERAPI' then sum(x.totalfix) else 0 end as jumlahgedungterapi,
        case when x.uraian = 'SEWA LAPANGAN SEPAK BOLA' then sum(x.totalfix) else 0 end as jumlahsewalapangan,
        case when x.uraian = 'SEWA GEDUNG DIKLAT' then sum(x.totalfix) else 0 end as jumlahgedungdiklat,
        case when x.uraian = 'SEWA GEDUNG GRHASIA INN' then sum(x.totalfix) else 0 end as jumlahgrhasiainn,
        case when x.uraian = 'SEWA TANAH PERTANIAN' then sum(x.totalfix) else 0 end as jumlahpertanian,
        case when x.uraian = 'SEWA KALANDRA' then sum(x.totalfix) else 0 end as jumlahkalandra,
        case when x.uraian = 'SEWA TEMPAT FOTOCOPY' then sum(x.totalfix) else 0 end as jumlahsewatempatfc,
        case when x.uraian = 'SEWA MANEKIN' then sum(x.totalfix) else 0 end as jumlahmanekin,
        case when x.uraian = 'SEWA AMBULAN/MOBIL JENAZAH' then sum(x.totalfix) else 0 end as jumlahsewaambulan,
        case when x.uraian = 'SEWA BUS' then sum(x.totalfix) else 0 end as jumlahsewabus,
        case when x.uraian = 'HASIL KETRAMPILAN PASIEN' then sum(x.totalfix) else 0 end as jumlahketerampilan,
        case when x.uraian = 'PARKIR' then sum(x.totalfix) else 0 end as jumlahparkir,
        case when x.uraian = 'LAIN-LAIN' then sum(x.totalfix) else 0 end as jumlahlainlain,
        case when x.uraian = 'JUMLAH' then sum(x.totalfix) else 0 end as jumlahtotal,

        case when x.uraian = 'Klaim Covid' then sum(x.totalfix) else 0 end as jumlahklaimcovid,
        case when x.uraian = 'Jasa Bank' then sum(x.totalfix) else 0 end as jumlahjasabank,
        case when x.uraian = 'RAWAT JALAN BPJS' then sum(x.totalfix) else 0 end as jumlahrajalbpjs,
        case when x.uraian = 'RAWAT JALAN Jamkesda' then sum(x.totalfix) else 0 end as jumlahrajaljamkesda,
        case when x.uraian = 'RAWAT JALAN Jamkesos' then sum(x.totalfix) else 0 end as jumlahrajaljamkesos,
        case when x.uraian = 'RAWAT JALAN IPWL' then sum(x.totalfix) else 0 end as jumlahrajalipwl,
        case when x.uraian = 'OBAT-OBATAN BPJS' then sum(x.totalfix) else 0 end as jumlahobatbpjs,
        case when x.uraian = 'OBAT-OBATAN Jamkesda' then sum(x.totalfix) else 0 end as jumlahobatjamkesda,
        case when x.uraian = 'OBAT-OBATAN Jamkesos' then sum(x.totalfix) else 0 end as jumlahobatjamkesos,
        case when x.uraian = 'OBAT-OBATAN IPWL' then sum(x.totalfix) else 0 end as jumlahobatipwl,
        case when x.uraian = 'RAWAT INAP BPJS' then sum(x.totalfix) else 0 end as jumlahranapbpjs,
        case when x.uraian = 'RAWAT INAP Jamkesda' then sum(x.totalfix) else 0 end as jumlahranapjamkesda,
        case when x.uraian = 'RAWAT INAP Jamkesos' then sum(x.totalfix) else 0 end as jumlahranapjamkesos,
        case when x.uraian = 'RAWAT INAP IPWL' then sum(x.totalfix) else 0 end as jumlahranapipwl,
        case when x.uraian in ('COST SHARING BPJS', 'Cost Sharing BPJS') then sum(x.totalfix) else 0 end as jumlahcsbpjs,
        case when x.uraian = 'COST SHARING JAMKESDA BANTUL' then sum(x.totalfix) else 0 end as jumlahcsjamkesda,
        case when x.uraian = 'COST SHARING JAMKESOS' then sum(x.totalfix) else 0 end as jumlahcsjamkesos,
        case when x.uraian = 'JUMLAH KLAIM' then sum(x.totalfix) else 0 end as jumlahklaim,
        case when x.uraian = 'BIAYA ADMINISTRASI BANK' then sum(x.totalfix) else 0 end as jumlahadmin,
        case when x.uraian = 'BIAYA TRANSFER' then sum(x.totalfix) else 0 end as jumlahtransfer,
        case when x.uraian = 'JUMLAH NETTO' then sum(x.totalfix) else 0 end as jumlahnetto,
        case when x.uraian = 'PEMBAYARAN TUNAI PASIEN RAJAL' then sum(x.totalfix) else 0 end as jumlahtunaipasienrajal

        from(
            select i.nosts, i.kdrekening, i.nomer, i.uraian, sum(i.vol) as totalvol, sum(i.kolom1) as totalkolom1, sum(i.kolom2) as totalkolom2,
            (
            case
            when sum(i.kolom1) is null and sum(i.kolom2) is null then sum(i.kolom1)
            when sum(i.kolom1) is null and sum(i.kolom2) is not null then sum(i.kolom2)
            when sum(i.kolom1) is not null and sum(i.kolom2) is null then sum(i.kolom1)
            else 0
            end
            ) as totalfix
                from(
                    select sts.tglpenerimaan, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.norec,
                    stsd.kolom1, stsd.kolom2, stsd.nourut, sts.ismanual, sts.nosts
                    from surattandasetoran_t sts
                    inner join surattandasetorandetail_t stsd on stsd.objectstsfk = sts.nosts
                    left join ststosck_t as ssc on sts.norec = ssc.objectstsfk
                    left join strukclosingkasir_t as sck on ssc.objectsckfk = sck.norec
                    left join strukclosing_t as sc on sc.norec = sck.noclosingfk
                    left join strukbuktipenerimaan_t AS sbm on sbm.noclosingfk = sc.norec
                    left join strukbuktipenerimaancarabayar_t as sbmcr ON sbmcr.nosbmfk = sbm.norec
                    left JOIN carabayar_m as cb ON cb.id = sbmcr.objectcarabayarfk
                    where sts.statusenabled = true
                    and sc.noclosing not in (
                            select sc.noclosing from strukclosing_t sc
                            inner join strukhistori_t sh on sh.noclosing = sc.norec
                            where sh.statusenabled = false
                            )
                    and extract(year from sts.tglpenerimaan::date ) = ".$tahunx."
                    and extract(month from sts.tglpenerimaan::date ) = ".$bulanx."
                    and extract(day from sts.tglpenerimaan::date ) = '$tglx'
                    and sts.statusenabled = true and sts.kdprofile = 30
                    and stsd.statusenabled = true and stsd.kdprofile = 30
                    group by sts.tglpenerimaan, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.norec,
                    stsd.kolom1, stsd.kolom2, stsd.nourut, sts.ismanual, sts.nosts

					union all

					select sts.tglpenerimaan, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.norec,
                    stsd.kolom1, stsd.kolom2, stsd.nourut, sts.ismanual, sts.nosts
					from surattandasetoran_t sts
					inner join surattandasetorandetail_t stsd on stsd.objectstsfk = sts.nosts
					where sts.kdprofile = 30
					and sts.statusenabled = true
					and sts.ismanual = true
					and extract(year from sts.tglpenerimaan::date ) = ".$tahunx."
                    and extract(month from sts.tglpenerimaan::date ) = ".$bulanx."
                    and extract(day from sts.tglpenerimaan::date ) = '$tglx'

					union all
										
					select sts.tglpenerimaan, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.norec,
                    stsd.kolom1, stsd.kolom2, stsd.nourut, sts.ismanual, sts.nosts
					from surattandasetoran_t sts
					inner join surattandasetorandetail_t stsd on stsd.objectstsfk = sts.nosts
					inner join ststorekapklaim_t str on sts.norec = str.objectstsfk
					inner join rekapklaimbpjs_t rkb on str.objectrekapklaimfk = rkb.norec
					where sts.kdprofile = 30
					and sts.statusenabled = true
					and str.kdprofile = 30
					and str.statusenabled = true
					and extract(year from sts.tglpenerimaan::date ) = ".$tahunx."
                    and extract(month from sts.tglpenerimaan::date ) = ".$bulanx."
                    and extract(day from sts.tglpenerimaan::date ) = '$tglx'
					group by sts.tglpenerimaan, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.norec,
                    stsd.kolom1, stsd.kolom2, stsd.nourut, sts.ismanual, sts.nosts
                ) as i group by i.nosts, i.kdrekening, i.nomer, i.uraian
            ) as x group by x.nosts, x.uraian
        ) as y group by nosts order by nosts"));

        $result = array(
            'detail' => $data,
        );
        
        return $this->setStatusCode(201)->respond($result, 'tes msg');
    }

     public function getSTSPertanggalV2(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $bulanx = $request['bulan'];
        $tahunx = $request['tahun'];
        $bayar = '';
        $nosts = '';
        if (isset($request['carabayar']) && $request['carabayar'] != "" && $request['carabayar'] != "undefined") {
            $idCaraBayar = (int) $request['carabayar'];
            $bayar = " and sts.norec in (
                select ssc.objectstsfk
                from ststosck_t ssc
                inner join strukclosingkasir_t sck on sck.norec = ssc.objectsckfk
                where sck.carabayarfk = $idCaraBayar
            )";
        }

        if(isset($request['nosts']) && $request['nosts'] != ''){
            $nosts = "and sts.nosts ilike '%". $request['nosts']. "%'";
        }

        //ambil daftar akun level 8
        $akunList = DB::select(DB::raw(
            "SELECT id, namarekening, koderekening, nourut
             FROM char_akun_pendapatan_m p
             WHERE statusenabled = true 
             AND NOT EXISTS (
                SELECT 1 FROM char_akun_pendapatan_m c 
                WHERE c.headfk = p.id AND c.statusenabled = true
             )
             ORDER BY 
                split_part(koderekening, '.', 1) ASC,
                case when split_part(koderekening, '.', 2) = '' then 0 else split_part(koderekening, '.', 2)::int end ASC,
                case when split_part(koderekening, '.', 3) = '' then 0 else split_part(koderekening, '.', 3)::int end ASC,
                case when split_part(koderekening, '.', 4) = '' then 0 else split_part(koderekening, '.', 4)::int end ASC,
                case when split_part(koderekening, '.', 5) = '' then 0 else split_part(koderekening, '.', 5)::int end ASC,
                case when split_part(koderekening, '.', 6) = '' then 0 else split_part(koderekening, '.', 6)::int end ASC,
                case when split_part(koderekening, '.', 7) = '' then 0 else split_part(koderekening, '.', 7)::int end ASC,
                case when split_part(koderekening, '.', 8) = '' then 0 else split_part(koderekening, '.', 8)::int end ASC"
        ));

        //buat case when dan sum dinamis
        $pivotCases = [];
        $outerSums  = [];
        $columnMeta = [];

        foreach ($akunList as $akun) {
            $colAlias    = 'col_' . $akun->id;
            //buat case when dan sum dinamis
            $pivotCases[] = "case when x.cap_id = {$akun->id} then sum(x.totalfix) else 0 end as {$colAlias}";
            $outerSums[]  = "sum({$colAlias}) {$colAlias}";

            $columnMeta[] = [
                'id'           => $akun->id,
                'namarekening' => $akun->namarekening . ' - ' . $akun->koderekening,
                'koderekening' => $akun->koderekening,
                'nourut'       => $akun->nourut,
                'alias'        => $colAlias,
            ];
        }

        $pivotSql = implode(",\n        ", $pivotCases);
        $outerSql = implode(",\n        ", $outerSums);

        //eksekusi query utama
        $data = DB::select(DB::raw("
        select extract(day from tanggal) as tanggal,
        {$outerSql}
        from(
        select x.tanggal,
        {$pivotSql}
        from(
            select
                sts.tanggal,
                stsd2.objectakunpendapatanfk as cap_id,
                sum(stsd2.totalsetoran) as totalfix
            from (
                select nosts, tglpenerimaan::date as tanggal
                from surattandasetoran_t sts
                where sts.statusenabled = true
                and sts.kdprofile = $idProfile
                and extract(year from sts.tglpenerimaan::date) = ".$tahunx."
                and extract(month from sts.tglpenerimaan::date) = ".$bulanx."
                $bayar
                $nosts
                group by nosts, tglpenerimaan::date
            ) as sts
            inner join surattandasetorandetailv2_t stsd2 on stsd2.objectstsfk = sts.nosts
            inner join char_akun_pendapatan_m cap on cap.id = stsd2.objectakunpendapatanfk
            where stsd2.kdprofile = $idProfile
            and stsd2.statusenabled = true
            group by sts.tanggal, stsd2.objectakunpendapatanfk
        ) as x group by x.tanggal, x.cap_id
        ) as y group by extract(day from tanggal) order by tanggal"));

        $result = array(
            'detail'  => $data,
            'columns' => $columnMeta,
        );
        
        return $this->setStatusCode(201)->respond($result, 'tes msg');
    }

     public function getDetailSTSPertanggalV2(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $bulanx = $request['bulan'];
        $tahunx = $request['tahun'];
        $tglx   = $request['tgl'];

        // Filter cara bayar
        $bayar = '';
        if (isset($request['carabayar']) && $request['carabayar'] != '' && $request['carabayar'] != 'undefined') {
            $idCaraBayar = (int) $request['carabayar'];
            $bayar = " and sts.norec in (
                select ssc.objectstsfk
                from ststosck_t ssc
                inner join strukclosingkasir_t sck on sck.norec = ssc.objectsckfk
                where sck.carabayarfk = $idCaraBayar
            )";
        }

        //ambil daftar akun pendapatan level 8 untuk pivot dinamis
        $akunList = DB::select(DB::raw("
            SELECT id, namarekening, koderekening, nourut
            FROM char_akun_pendapatan_m p
            WHERE statusenabled = true 
            AND NOT EXISTS (
                SELECT 1 FROM char_akun_pendapatan_m c 
                WHERE c.headfk = p.id AND c.statusenabled = true
            )
            ORDER BY 
                split_part(koderekening, '.', 1) ASC,
                case when split_part(koderekening, '.', 2) = '' then 0 else split_part(koderekening, '.', 2)::int end ASC,
                case when split_part(koderekening, '.', 3) = '' then 0 else split_part(koderekening, '.', 3)::int end ASC,
                case when split_part(koderekening, '.', 4) = '' then 0 else split_part(koderekening, '.', 4)::int end ASC,
                case when split_part(koderekening, '.', 5) = '' then 0 else split_part(koderekening, '.', 5)::int end ASC,
                case when split_part(koderekening, '.', 6) = '' then 0 else split_part(koderekening, '.', 6)::int end ASC,
                case when split_part(koderekening, '.', 7) = '' then 0 else split_part(koderekening, '.', 7)::int end ASC,
                case when split_part(koderekening, '.', 8) = '' then 0 else split_part(koderekening, '.', 8)::int end ASC
        "));

        if (empty($akunList)) {
            return $this->setStatusCode(201)->respond([
                'detail'  => [],
                'columns' => [],
            ], 'No akun data');
        }

        //buat sql pivot dinamis
        $pivotCases = [];
        $outerSums  = [];
        $columnMeta = [];

        foreach ($akunList as $akun) {
            $colAlias = 'col_' . $akun->id;
            $pivotCases[] = "case when x.cap_id = {$akun->id} then sum(x.totalfix) else 0 end as {$colAlias}";
            $outerSums[]  = "sum({$colAlias}) {$colAlias}";

            $columnMeta[] = [
                'id'           => $akun->id,
                'namarekening' => $akun->namarekening . ' - ' . $akun->koderekening,
                'koderekening' => $akun->koderekening,
                'nourut'       => $akun->nourut,
                'alias'        => $colAlias,
            ];
        }

        $pivotSql = implode(",\n        ", $pivotCases);
        $outerSql = implode(",\n        ", $outerSums);

        //eksekusi query utama
        $data = DB::select(DB::raw("
        select nosts, tglpenerimaan,
        {$outerSql}
        from(
        select x.nosts, x.tglpenerimaan,
        {$pivotSql}
        from(
            select
                sts.nosts,
                sts.tglpenerimaan,
                stsd2.objectakunpendapatanfk as cap_id,
                sum(stsd2.totalsetoran) as totalfix
            from (
                select nosts, tglpenerimaan::date as tglpenerimaan
                from surattandasetoran_t sts
                where sts.statusenabled = true
                and sts.kdprofile = $idProfile
                and extract(year from sts.tglpenerimaan::date) = ".$tahunx."
                and extract(month from sts.tglpenerimaan::date) = ".$bulanx."
                and extract(day from sts.tglpenerimaan::date) = ".$tglx."
                $bayar
                group by nosts, tglpenerimaan::date
            ) as sts
            inner join surattandasetorandetailv2_t stsd2 on stsd2.objectstsfk = sts.nosts
            inner join char_akun_pendapatan_m cap on cap.id = stsd2.objectakunpendapatanfk
            where stsd2.kdprofile = $idProfile
            and stsd2.statusenabled = true
            group by sts.nosts, sts.tglpenerimaan, stsd2.objectakunpendapatanfk
        ) as x group by x.nosts, x.tglpenerimaan, x.cap_id
        ) as y group by nosts, tglpenerimaan order by tglpenerimaan, nosts"));

        $result = array(
            'detail'  => $data,
            'columns' => $columnMeta,
        );

        return $this->setStatusCode(201)->respond($result, 'tes msg');
    }

    public function getKonfirmasiRekeningSTSold(Request $request)
    {

        $data = DB::select(DB::raw("

            SELECT 
                x.id as idrekening, x.namarekening, x.koderekening, x.idlevel7, x.idlevel6, x.idlevel5, x.idlevel4, x.idlevel3, x.idlevel2, x.idlevel1, SUM(x.totaldibayarclosing)::DECIMAL as totaldibayarclosing, x.namapasien
            FROM (	
                SELECT
                    cap.id,
                    cap.koderekening, 
                    cap.namarekening,
                    cap7.id as idlevel7,
                    cap6.id as idlevel6,
                    cap5.id as idlevel5,
                    cap4.id as idlevel4,
                    cap3.id as idlevel3,
                    cap2.id as idlevel2,
                    cap1.id as idlevel1,
                    COALESCE(
                        SUM(
                            (((COALESCE(pp.hargajual::DECIMAL, 0) - COALESCE(pp.hargadiscount::DECIMAL, 0)) * pp.jumlah::DECIMAL) + COALESCE(pp.jasa::DECIMAL, 0))
                        ), 0
                    ) AS totaldibayarclosing,
                    CASE WHEN cb.id = 3 THEN pm.namapasien ELSE NULL END AS namapasien
                FROM pasiendaftar_t pd
                JOIN pasien_m pm ON pm.id = pd.nocmfk
                JOIN antrianpasiendiperiksa_t apd ON apd.noregistrasifk = pd.norec AND apd.statusenabled = TRUE AND apd.kdprofile = 30
                JOIN pelayananpasien_t pp ON pp.noregistrasifk = apd.norec AND pp.statusenabled = TRUE AND pp.kdprofile = 30
                JOIN ruangan_m ru ON ru.id = apd.objectruanganfk AND ru.statusenabled = TRUE AND ru.kdprofile = 30
                JOIN produk_m pr ON pr.id = pp.produkfk
                JOIN detailjenisproduk_m djp ON djp.id = pr.objectdetailjenisprodukfk
                JOIN strukpelayanan_t sp ON sp.norec = pp.strukfk AND sp.statusenabled = TRUE AND sp.kdprofile = 30
                JOIN strukbuktipenerimaan_t sbm ON sbm.nostrukfk = sp.norec AND sbm.statusenabled = TRUE AND sbm.kdprofile = 30
                JOIN strukbuktipenerimaancarabayar_t sbmcr ON sbmcr.nosbmfk = sbm.norec AND sbmcr.statusenabled = TRUE AND sbmcr.kdprofile = 30
                JOIN carabayar_m cb ON cb.id = sbmcr.objectcarabayarfk AND cb.statusenabled = TRUE AND cb.kdprofile = 30
                JOIN strukclosing_t AS sc ON sc.norec = sbm.noclosingfk AND sc.statusenabled = TRUE AND sc.kdprofile = 30
                JOIN strukclosingkasir_t sck ON sck.noclosingfk = sc.norec
                JOIN mapbkuakun_t mba 
                    ON pd.objectkelompokpasienlastfk::VARCHAR = ANY(string_to_array(mba.objectkelompokpasienfk, ','))
                    AND apd.objectruanganfk::VARCHAR = ANY(string_to_array(mba.objectruanganfk , ','))
                    AND mba.statusenabled = TRUE
                LEFT JOIN char_akun_pendapatan_m cap ON cap.id = mba.objectakunpendapatanfk
                LEFT JOIN char_akun_pendapatan_m cap7 ON cap7.id = cap.headfk
                LEFT JOIN char_akun_pendapatan_m cap6 ON cap6.id = cap7.headfk
                LEFT JOIN char_akun_pendapatan_m cap5 ON cap5.id = cap6.headfk
                LEFT JOIN char_akun_pendapatan_m cap4 ON cap4.id = cap5.headfk
                LEFT JOIN char_akun_pendapatan_m cap3 ON cap3.id = cap4.headfk
                LEFT JOIN char_akun_pendapatan_m cap2 ON cap2.id = cap3.headfk
                LEFT JOIN char_akun_pendapatan_m cap1 ON cap1.id = cap2.headfk
                WHERE 
                    sc.noclosing = '".$request['noclosing']."'
                    AND (
                                (mba.isobat IS NOT TRUE AND pp.isobat IS NULL) 
                                OR 
                                (mba.isobat = TRUE AND pp.isobat = TRUE)
                        )
                    AND pp.kelasfk::VARCHAR = ANY(string_to_array(mba.objectkelasfk, ','))
                GROUP BY
                    cap.id,
                    cap.koderekening,
                    cap.namarekening,
                    pp.isobat,
                    cap7.id,
                    cap6.id,
                    cap5.id,
                    cap4.id,
                    cap3.id,
                    cap2.id,
                    cap1.id,
                    cb.id,
		            CASE WHEN cb.id = 3 THEN pm.namapasien ELSE NULL END

                -- untuk berdasarkan produk
                UNION
                SELECT
                    cap.id,
                    cap.koderekening, 
                    cap.namarekening,
                    cap7.id as idlevel7,
                    cap6.id as idlevel6,
                    cap5.id as idlevel5,
                    cap4.id as idlevel4,
                    cap3.id as idlevel3,
                    cap2.id as idlevel2,
                    cap1.id as idlevel1,
                    SUM(((COALESCE(pp.hargajual::DECIMAL, 0) - COALESCE(pp.hargadiscount::DECIMAL, 0)) * pp.jumlah::DECIMAL) + COALESCE(pp.jasa::DECIMAL, 0)) AS totaldibayarclosing,
                    CASE WHEN cb.id = 3 THEN pm.namapasien ELSE NULL END AS namapasien
                FROM pasiendaftar_t pd
                JOIN pasien_m pm ON pm.id = pd.nocmfk
                JOIN antrianpasiendiperiksa_t apd ON apd.noregistrasifk = pd.norec AND apd.statusenabled = TRUE AND apd.kdprofile = 30
                JOIN pelayananpasien_t pp ON pp.noregistrasifk = apd.norec AND pp.statusenabled = TRUE AND pp.kdprofile = 30
                JOIN ruangan_m ru ON ru.id = apd.objectruanganfk AND ru.statusenabled = TRUE AND ru.kdprofile = 30
                JOIN produk_m pr ON pr.id = pp.produkfk
                JOIN detailjenisproduk_m djp ON djp.id = pr.objectdetailjenisprodukfk --AND djp.statusenabled = TRUE AND djp.kdprofile = 30
                JOIN strukpelayanan_t sp ON sp.norec = pp.strukfk AND sp.statusenabled = TRUE AND sp.kdprofile = 30
                JOIN strukbuktipenerimaan_t sbm ON sbm.nostrukfk = sp.norec AND sbm.statusenabled = TRUE AND sbm.kdprofile = 30
                JOIN strukbuktipenerimaancarabayar_t sbmcr ON sbmcr.nosbmfk = sbm.norec AND sbmcr.statusenabled = TRUE AND sbmcr.kdprofile = 30
                JOIN carabayar_m cb ON cb.id = sbmcr.objectcarabayarfk AND cb.statusenabled = TRUE AND cb.kdprofile = 30
                JOIN strukclosing_t AS sc ON sc.norec = sbm.noclosingfk AND sc.statusenabled = TRUE AND sc.kdprofile = 30
                JOIN strukclosingkasir_t sck ON sck.noclosingfk = sc.norec
                LEFT JOIN mapbkuakun3_t mba3 
                    ON pp.produkfk::VARCHAR = ANY(string_to_array(mba3.objectprodukfk, ','))
                    AND pd.objectkelompokpasienlastfk IN (1,12) 
                    AND mba3.statusenabled = TRUE
                JOIN char_akun_pendapatan_m cap ON cap.id = mba3.objectakunpendapatanfk
                LEFT JOIN char_akun_pendapatan_m cap7 ON cap7.id = cap.headfk
                LEFT JOIN char_akun_pendapatan_m cap6 ON cap6.id = cap7.headfk
                LEFT JOIN char_akun_pendapatan_m cap5 ON cap5.id = cap6.headfk
                LEFT JOIN char_akun_pendapatan_m cap4 ON cap4.id = cap5.headfk
                LEFT JOIN char_akun_pendapatan_m cap3 ON cap3.id = cap4.headfk
                LEFT JOIN char_akun_pendapatan_m cap2 ON cap2.id = cap3.headfk
                LEFT JOIN char_akun_pendapatan_m cap1 ON cap1.id = cap2.headfk
                WHERE 
                    sc.noclosing = '".$request['noclosing']."'
                GROUP BY
                    cap.id,
                    cap.koderekening,
                    cap.namarekening,
                    pp.isobat,
                    cap7.id,
                    cap6.id,
                    cap5.id,
                    cap4.id,
                    cap3.id,
                    cap2.id,
                    cap1.id,
                    cb.id,
                    CASE WHEN cb.id = 3 THEN pm.namapasien ELSE NULL END
                
                -- untuk non layanan
                UNION
                SELECT DISTINCT
                    cap.id,
                    cap.koderekening,
                    cap.namarekening,
                    cap7.id as idlevel7,
                    cap6.id as idlevel6,
                    cap5.id as idlevel5,
                    cap4.id as idlevel4,
                    cap3.id as idlevel3,
                    cap2.id as idlevel2,
                    cap1.id as idlevel1,
                    SUM(spd.qtyproduk * spd.hargasatuan * spd.qtyoranglast) as totaldibayarclosing,
                    NULL AS namapasien
                FROM strukclosingkasir_t AS sck
                JOIN strukclosing_t AS sc ON sc.norec = sck.noclosingfk
                JOIN strukbuktipenerimaan_t AS sbm ON sbm.noclosingfk = sc.norec
                JOIN strukbuktipenerimaancarabayar_t sbmcr ON sbmcr.nosbmfk = sbm.norec
                JOIN strukpelayanan_t AS sp ON sbm.nostrukfk = sp.norec
                JOIN strukpelayanandetail_t AS spd ON sp.norec = spd.nostrukfk
                JOIN produk_m pr ON pr.id = spd.objectprodukfk
                JOIN carabayar_m AS cb ON cb.id = sck.carabayarfk
                JOIN detailjenisproduk_m djp ON djp.id = pr.objectdetailjenisprodukfk
                JOIN jenisproduk_m jpr ON jpr.id = djp.objectjenisprodukfk
                left join ruangan_m as ru on ru.id = spd.objectruanganasalfk
                left join pasiendaftar_t as pd on sp.noregistrasifk = pd.norec
                left join antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                left join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
                JOIN mapbkuakun2_t mba2 
                    ON spd.objectprodukfk::VARCHAR = ANY(string_to_array(mba2.objectprodukfk, ',')) 
                    AND mba2.statusenabled = TRUE
                JOIN char_akun_pendapatan_m cap ON cap.id = mba2.objectakunpendapatanfk
                LEFT JOIN char_akun_pendapatan_m cap7 ON cap7.id = cap.headfk
                LEFT JOIN char_akun_pendapatan_m cap6 ON cap6.id = cap7.headfk
                LEFT JOIN char_akun_pendapatan_m cap5 ON cap5.id = cap6.headfk
                LEFT JOIN char_akun_pendapatan_m cap4 ON cap4.id = cap5.headfk
                LEFT JOIN char_akun_pendapatan_m cap3 ON cap3.id = cap4.headfk
                LEFT JOIN char_akun_pendapatan_m cap2 ON cap2.id = cap3.headfk
                LEFT JOIN char_akun_pendapatan_m cap1 ON cap1.id = cap2.headfk
                WHERE 
                    sc.noclosing = '".$request['noclosing']."'
                GROUP BY
                    cap.id,
                    cap.koderekening,
                    cap.namarekening,
                    cap7.id,
                    cap6.id,
                    cap5.id,
                    cap4.id,
                    cap3.id,
                    cap2.id,
                    cap1.id
            ) as x
            GROUP BY
                x.id,
                x.koderekening,
                x.namarekening,
                x.idlevel7,
                x.idlevel6,
                x.idlevel5,
                x.idlevel4,
                x.idlevel3,
                x.idlevel2,
                x.idlevel1,
                x.namapasien
            ORDER BY
                split_part(x.koderekening, '.', 3)::DECIMAL,
                split_part(x.koderekening, '.', 4)::DECIMAL,
                split_part(x.koderekening, '.', 5)::DECIMAL,
                split_part(x.koderekening, '.', 6)::DECIMAL,
                split_part(x.koderekening, '.', 7)::DECIMAL,
                split_part(x.koderekening, '.', 8)::DECIMAL ASC
        
        "));

        // mencari id level7
        $arrIdLevel6 = [];
        $id_level6 = 0;
        foreach($data as $row){
            if($row->idlevel6 !== $id_level6){
                array_push($arrIdLevel6, $row->idlevel6);
                
                $id_level6 = $row->idlevel6;
            }
        }
        $rekeningLv6 = DB::select(DB::raw("
            SELECT 
                cap.*, cap.koderekening || '-' || cap.namarekening as text 
            FROM char_akun_pendapatan_m cap 
            WHERE 
                cap.statusenabled = TRUE
                AND cap.kdprofile = 30
                AND cap.id IN(".implode(',',$arrIdLevel6).")
        "));


        return $this->respond([
            'data' => $data,
            'rekening' => $rekeningLv6
        ]);
    }

    public function getKonfirmasiRekeningSTS(Request $request)
    {
        $kdProfile = 30;
        $noClosing = $request['noclosing'];

        $data = DB::select(DB::raw("
            WITH closing AS (
                SELECT norec FROM strukclosing_t 
                WHERE noclosing = :noClosing 
                AND statusenabled = TRUE 
                AND kdprofile = :kdProfile
            ),
            -- PRE-FILTER: Ambil semua closing ref
            sbm_filtered AS (
                SELECT DISTINCT sbm.norec, sbm.nostrukfk, sbm.noclosingfk
                FROM strukbuktipenerimaan_t sbm
                JOIN closing c ON sbm.noclosingfk = c.norec
                WHERE sbm.statusenabled = TRUE AND sbm.kdprofile = :kdProfile
            ),
            -- BASE: Semua pelayanan pasien dengan info dasar
            base_pelayanan_raw AS (
                SELECT 
                    pp.norec as pp_norec,
                    pp.produkfk,
                    pp.strukfk,
                    pp.isobat,
                    pp.kelasfk,
                    pp.hargajual,
                    pp.hargadiscount,
                    pp.jumlah,
                    pp.jasa,
                    (((COALESCE(pp.hargajual,0) - COALESCE(pp.hargadiscount,0)) * COALESCE(pp.jumlah,0)) + COALESCE(pp.jasa,0)) as subtotal_raw,
                    pd.objectkelompokpasienlastfk,
                    apd.objectruanganfk,
                    pm.namapasien,
                    cb.id as idcarabayar,
                    cb.carabayar,
                    ru.namaruangan,
                    sbmcr.norec as sbmcr_norec,
                    sbmcr.totaldibayar as sbmcr_totaldibayar
                FROM sbm_filtered sbm
                JOIN strukpelayanan_t sp ON sbm.nostrukfk = sp.norec AND sp.statusenabled = TRUE AND sp.kdprofile = :kdProfile
                JOIN strukbuktipenerimaancarabayar_t sbmcr ON sbmcr.nosbmfk = sbm.norec AND sbmcr.statusenabled = TRUE AND sbmcr.kdprofile = :kdProfile
                JOIN carabayar_m cb ON cb.id = sbmcr.objectcarabayarfk AND cb.statusenabled = TRUE AND cb.kdprofile = :kdProfile
                JOIN pelayananpasien_t pp ON pp.strukfk = sp.norec AND pp.statusenabled = TRUE AND pp.kdprofile = :kdProfile
                JOIN antrianpasiendiperiksa_t apd ON apd.norec = pp.noregistrasifk AND apd.statusenabled = TRUE AND apd.kdprofile = :kdProfile
                JOIN pasiendaftar_t pd ON pd.norec = apd.noregistrasifk AND pd.kdprofile = :kdProfile
                JOIN pasien_m pm ON pm.id = pd.nocmfk
                LEFT JOIN ruangan_m ru ON ru.id = apd.objectruanganfk
            ),
            base_pelayanan AS (
                SELECT 
                    pp_norec,
                    produkfk,
                    strukfk,
                    isobat,
                    kelasfk,
                    hargajual,
                    hargadiscount,
                    jumlah,
                    jasa,
                    CASE 
                        WHEN SUM(subtotal_raw) OVER (PARTITION BY sbmcr_norec) > 0 
                        THEN subtotal_raw * (COALESCE(sbmcr_totaldibayar,0) / SUM(subtotal_raw) OVER (PARTITION BY sbmcr_norec))
                        ELSE 0 
                    END as subtotal,
                    objectkelompokpasienlastfk,
                    objectruanganfk,
                    namapasien,
                    idcarabayar,
                    carabayar,
                    namaruangan
                FROM base_pelayanan_raw
            ),
            -- TIPE 2: PRODUK SPECIFIC (prioritas PERTAMA - lebih spesifik)
            tipe2_produk AS (
                SELECT DISTINCT ON (bp.pp_norec)
                    bp.pp_norec,
                    cap.id, cap.koderekening, cap.namarekening,
                    cap1.id idlevel1, cap2.id idlevel2, cap3.id idlevel3,
                    cap4.id idlevel4, cap5.id idlevel5, cap6.id idlevel6, cap7.id idlevel7,
                    bp.isobat isobat_group, bp.idcarabayar,
                    COALESCE(bp.subtotal,0)::DECIMAL totaldibayarclosing,
                    bp.namapasien,
                    bp.carabayar,
                    bp.namaruangan,
                    NULL::VARCHAR as namapelanggan
                FROM base_pelayanan bp
                JOIN mapbkuakun3_t mba3 ON 
                    POSITION(','||bp.produkfk||',' IN ','||mba3.objectprodukfk||',') > 0
                    AND mba3.statusenabled = TRUE
                JOIN mapbkuakun_t mba ON
                    POSITION(','||bp.objectkelompokpasienlastfk||',' IN ','||mba.objectkelompokpasienfk||',') > 0
                    AND POSITION(','||bp.objectruanganfk||',' IN ','||mba.objectruanganfk||',') > 0
                    AND mba.statusenabled = TRUE
                    AND bp.kelasfk IS NOT NULL
                    AND POSITION(','||bp.kelasfk||',' IN ','||mba.objectkelasfk||',') > 0
                    AND ((mba.isobat IS NOT TRUE AND bp.isobat IS NULL) OR (mba.isobat = TRUE AND bp.isobat = TRUE))
                    AND mba.objectakunpendapatanfk = mba3.objectakunpendapatanfk
                JOIN char_akun_pendapatan_m cap ON cap.id = mba3.objectakunpendapatanfk AND cap.statusenabled = TRUE
                LEFT JOIN char_akun_pendapatan_m cap7 ON cap7.id = cap.headfk
                LEFT JOIN char_akun_pendapatan_m cap6 ON cap6.id = cap7.headfk
                LEFT JOIN char_akun_pendapatan_m cap5 ON cap5.id = cap6.headfk
                LEFT JOIN char_akun_pendapatan_m cap4 ON cap4.id = cap5.headfk
                LEFT JOIN char_akun_pendapatan_m cap3 ON cap3.id = cap4.headfk
                LEFT JOIN char_akun_pendapatan_m cap2 ON cap2.id = cap3.headfk
                LEFT JOIN char_akun_pendapatan_m cap1 ON cap1.id = cap2.headfk
                ORDER BY bp.pp_norec, mba3.id
            ),
            -- TIPE 1: KELAS PASIEN (hanya untuk yg TIDAK ada di TIPE2)
            tipe1_kelas AS (
                SELECT DISTINCT ON (bp.pp_norec)
                    bp.pp_norec,
                    cap.id, cap.koderekening, cap.namarekening,
                    cap1.id idlevel1, cap2.id idlevel2, cap3.id idlevel3,
                    cap4.id idlevel4, cap5.id idlevel5, cap6.id idlevel6, cap7.id idlevel7,
                    bp.isobat isobat_group, bp.idcarabayar,
                    COALESCE(bp.subtotal,0)::DECIMAL totaldibayarclosing,
                    bp.namapasien,
                    bp.carabayar,
                    bp.namaruangan,
                    NULL::VARCHAR as namapelanggan
                FROM base_pelayanan bp
                JOIN mapbkuakun_t mba ON 
                    POSITION(','||bp.objectkelompokpasienlastfk||',' IN ','||mba.objectkelompokpasienfk||',') > 0
                    AND POSITION(','||bp.objectruanganfk||',' IN ','||mba.objectruanganfk||',') > 0
                    AND mba.statusenabled = TRUE
                JOIN char_akun_pendapatan_m cap ON cap.id = mba.objectakunpendapatanfk AND cap.statusenabled = TRUE
                LEFT JOIN char_akun_pendapatan_m cap7 ON cap7.id = cap.headfk
                LEFT JOIN char_akun_pendapatan_m cap6 ON cap6.id = cap7.headfk
                LEFT JOIN char_akun_pendapatan_m cap5 ON cap5.id = cap6.headfk
                LEFT JOIN char_akun_pendapatan_m cap4 ON cap4.id = cap5.headfk
                LEFT JOIN char_akun_pendapatan_m cap3 ON cap3.id = cap4.headfk
                LEFT JOIN char_akun_pendapatan_m cap2 ON cap2.id = cap3.headfk
                LEFT JOIN char_akun_pendapatan_m cap1 ON cap1.id = cap2.headfk
                WHERE 
                    ((mba.isobat IS NOT TRUE AND bp.isobat IS NULL) OR (mba.isobat = TRUE AND bp.isobat = TRUE))
                    AND bp.kelasfk IS NOT NULL
                    AND POSITION(','||bp.kelasfk||',' IN ','||mba.objectkelasfk||',') > 0
                    -- Exclude items already in tipe2
                    AND NOT EXISTS (
                        SELECT 1 FROM tipe2_produk t2 WHERE t2.pp_norec = bp.pp_norec
                    )
                ORDER BY bp.pp_norec, mba.id
            ),
            -- TIPE 3: NON-LAYANAN (dari strukpelayanandetail)
            tipe3_nonlayanan AS (
                SELECT DISTINCT ON (spd.norec)
                    spd.norec as pp_norec,
                    cap.id, cap.koderekening, cap.namarekening,
                    cap1.id idlevel1, cap2.id idlevel2, cap3.id idlevel3,
                    cap4.id idlevel4, cap5.id idlevel5, cap6.id idlevel6, cap7.id idlevel7,
                    NULL::BOOLEAN isobat_group, sbmcr.objectcarabayarfk idcarabayar,
                    (COALESCE(spd.qtyproduk,0) * COALESCE(spd.hargasatuan,0) * COALESCE(spd.qtyoranglast, 1))::DECIMAL totaldibayarclosing,
                    pm.namapasien,
                    cb.carabayar,
                    ru.namaruangan,
                    sp.namapasien_klien as namapelanggan
                FROM sbm_filtered sbm
                JOIN strukpelayanan_t sp ON sbm.nostrukfk = sp.norec AND sp.statusenabled = TRUE AND sp.kdprofile = :kdProfile
                JOIN strukpelayanandetail_t spd ON sp.norec = spd.nostrukfk
                JOIN strukbuktipenerimaancarabayar_t sbmcr ON sbmcr.nosbmfk = sbm.norec AND sbmcr.statusenabled = TRUE AND sbmcr.kdprofile = :kdProfile
                JOIN carabayar_m cb ON cb.id = sbmcr.objectcarabayarfk AND cb.statusenabled = TRUE AND cb.kdprofile = :kdProfile
                LEFT JOIN mapbkuakun2_t mba2 ON 
                    POSITION(','||spd.objectprodukfk||',' IN ','||mba2.objectprodukfk||',') > 0
                    AND mba2.statusenabled = TRUE
                LEFT JOIN pasiendaftar_t pd ON pd.norec = sp.noregistrasifk
                LEFT JOIN pasien_m pm ON pm.id = pd.nocmfk
                LEFT JOIN ruangan_m ru ON ru.id = spd.objectruanganasalfk
                LEFT JOIN char_akun_pendapatan_m cap ON cap.id = mba2.objectakunpendapatanfk AND cap.statusenabled = TRUE
                LEFT JOIN char_akun_pendapatan_m cap7 ON cap7.id = cap.headfk
                LEFT JOIN char_akun_pendapatan_m cap6 ON cap6.id = cap7.headfk
                LEFT JOIN char_akun_pendapatan_m cap5 ON cap5.id = cap6.headfk
                LEFT JOIN char_akun_pendapatan_m cap4 ON cap4.id = cap5.headfk
                LEFT JOIN char_akun_pendapatan_m cap3 ON cap3.id = cap4.headfk
                LEFT JOIN char_akun_pendapatan_m cap2 ON cap2.id = cap3.headfk
                LEFT JOIN char_akun_pendapatan_m cap1 ON cap1.id = cap2.headfk
                WHERE mba2.id IS NOT NULL
                -- Exclude items already in tipe1 or tipe2
                AND NOT EXISTS (
                    SELECT 1 FROM base_pelayanan bp 
                    WHERE bp.strukfk = sp.norec
                )
                ORDER BY spd.norec, mba2.id
            ),
            -- TIPE 4: FALLBACK - item yang tidak ter-mapping di tipe manapun
            tipe4_fallback AS (
                SELECT DISTINCT ON (bp.pp_norec)
                    bp.pp_norec,
                    def_rek.id, def_rek.koderekening, def_rek.namarekening,
                    def_rek.idlevel1, def_rek.idlevel2, def_rek.idlevel3,
                    def_rek.idlevel4, def_rek.idlevel5, def_rek.idlevel6, def_rek.idlevel7,
                    bp.isobat isobat_group, bp.idcarabayar,
                    bp.subtotal::DECIMAL totaldibayarclosing,
                    bp.namapasien,
                    bp.carabayar,
                    bp.namaruangan,
                    NULL::VARCHAR as namapelanggan
                FROM base_pelayanan bp
                -- Default rekening untuk fallback
                CROSS JOIN (
                    SELECT 
                        cap.id, 
                        cap.koderekening, 
                        cap.namarekening,
                        cap1.id as idlevel1, 
                        cap2.id as idlevel2, 
                        cap3.id as idlevel3,
                        cap4.id as idlevel4, 
                        cap5.id as idlevel5, 
                        cap6.id as idlevel6, 
                        cap7.id as idlevel7
                    FROM char_akun_pendapatan_m cap
                    LEFT JOIN char_akun_pendapatan_m cap7 ON cap7.id = cap.headfk
                    LEFT JOIN char_akun_pendapatan_m cap6 ON cap6.id = cap7.headfk
                    LEFT JOIN char_akun_pendapatan_m cap5 ON cap5.id = cap6.headfk
                    LEFT JOIN char_akun_pendapatan_m cap4 ON cap4.id = cap5.headfk
                    LEFT JOIN char_akun_pendapatan_m cap3 ON cap3.id = cap4.headfk
                    LEFT JOIN char_akun_pendapatan_m cap2 ON cap2.id = cap3.headfk
                    LEFT JOIN char_akun_pendapatan_m cap1 ON cap1.id = cap2.headfk
                    WHERE cap.koderekening = '4.1.02.01.01.0006.06.006' AND cap.statusenabled = TRUE
                    LIMIT 1
                ) def_rek
                WHERE NOT EXISTS (SELECT 1 FROM tipe1_kelas t1 WHERE t1.pp_norec = bp.pp_norec)
                AND NOT EXISTS (SELECT 1 FROM tipe2_produk t2 WHERE t2.pp_norec = bp.pp_norec)
                ORDER BY bp.pp_norec
            ),
            all_akun AS (
                SELECT id, koderekening, namarekening, idlevel1, idlevel2, idlevel3, idlevel4, idlevel5, idlevel6, idlevel7, isobat_group, idcarabayar, totaldibayarclosing, namapasien, carabayar, namaruangan, namapelanggan FROM tipe1_kelas
                UNION ALL
                SELECT id, koderekening, namarekening, idlevel1, idlevel2, idlevel3, idlevel4, idlevel5, idlevel6, idlevel7, isobat_group, idcarabayar, totaldibayarclosing, namapasien, carabayar, namaruangan, namapelanggan FROM tipe2_produk
                UNION ALL
                SELECT id, koderekening, namarekening, idlevel1, idlevel2, idlevel3, idlevel4, idlevel5, idlevel6, idlevel7, isobat_group, idcarabayar, totaldibayarclosing, namapasien, carabayar, namaruangan, namapelanggan FROM tipe3_nonlayanan
                UNION ALL
                SELECT id, koderekening, namarekening, idlevel1, idlevel2, idlevel3, idlevel4, idlevel5, idlevel6, idlevel7, isobat_group, idcarabayar, totaldibayarclosing, namapasien, carabayar, namaruangan, namapelanggan FROM tipe4_fallback
            )
            SELECT 
                id idrekening, koderekening, namarekening,
                idlevel1, idlevel2, idlevel3, idlevel4, idlevel5, idlevel6, idlevel7,
                SUM(totaldibayarclosing) totaldibayarclosing,
                -- Ambil Nama Pasien
                STRING_AGG(DISTINCT namapasien, ', ') as namapasien,
                STRING_AGG(DISTINCT carabayar, ', ') as carabayar,
                STRING_AGG(DISTINCT namaruangan, ', ') as namaruangan,
                STRING_AGG(DISTINCT namapelanggan, ', ') as namapelanggan
            FROM all_akun
            GROUP BY id, koderekening, namarekening, idlevel1, idlevel2, idlevel3, idlevel4, idlevel5, idlevel6, idlevel7
            ORDER BY 
                split_part(koderekening,'.',3)::DECIMAL,
                split_part(koderekening,'.',4)::DECIMAL,
                split_part(koderekening,'.',5)::DECIMAL
        "), [
            'noClosing' => $noClosing,
            'kdProfile' => $kdProfile
        ]);

        $arrIdLevel6 = array_values(array_unique(array_filter(array_column($data, 'idlevel6'))));
        $rekeningLv6 = [];
        if (!empty($arrIdLevel6)) {
            $rekeningLv6 = DB::select("
                SELECT cap.*, cap.koderekening || '-' || cap.namarekening AS text
                FROM char_akun_pendapatan_m cap 
                WHERE cap.statusenabled = TRUE AND cap.kdprofile = ? 
                AND cap.id IN (" . implode(',', $arrIdLevel6) . ")
            ", [$kdProfile]);
        }

        return $this->respond([
            'data' => $data,
            'rekening' => $rekeningLv6
        ]);
    }

    public function saveDetailSTSV2(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        \DB::beginTransaction();
        try {
            
            // save detail v2
            $dataDetailV2 = $request['detailstsv2'];
            foreach ($dataDetailV2 as $key => $row) {
                $STSD = new SuratTandaSetoranDetailV2();
                $STSD->norec = $STSD->generateNewId();
                $STSD->statusenabled = TRUE;
                $STSD->kdprofile = $idProfile;
                $STSD->objectakunpendapatanfk = $row['idrekening'];
                $STSD->objectstsfk = $request['nosts'];
                $STSD->totalsetoran = $row['totaldibayarclosing'];
                $STSD->nourut = $key + 1;
                $STSD->save();
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $STSD,
                'as' => '@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'line'=> $e->getLine(),
                'message'=> $e->getMessage(),
                'as' => '@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function simpanSTSV2(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $dataPegawaiUser = DB::select(DB::raw("select pg.id,pg.namalengkap from loginuser_s as lu
                INNER JOIN pegawai_m as pg on lu.objectpegawaifk=pg.id
                where pg.kdprofile = $idProfile and lu.id=:idLoginUser"),
            array(
                'idLoginUser' => $request['userData']['id'],
            )
        );

        DB::beginTransaction();
        try {
            
            $dataSTS = $request['setoran'];


            // buat no sts dulu karena jika ada rekening pelayanan dan nonlayanan dibku harus beda tapi di sts harus sama
            // maka buat dibuat beda sts namun nomo sts sama
            $nosts = $this->generateCode(new SuratTandaSetoran, 'nosts', 11, date('ymd',strtotime($dataSTS[0]['tanggalSTS'])),$idProfile);

            // memngkunkin dua sts jika rekening berbeda
            foreach($dataSTS as $row){

                // pembulatan
                $pembulatan = ceil($row['totalSetoran']);

                // nosts
                // $nosts = $this->generateCode(new SuratTandaSetoran, 'nosts', 11, date('ymd',strtotime($row['tanggalSTS'])),$idProfile);

                // simpan sts
                $sts = new SuratTandaSetoran();
                $sts->norec = $sts->generateNewId();
                $sts->kdprofile = $idProfile;
                $sts->statusenabled = true;
                $sts->nosts = $nosts;
                $sts->keterangan = $row['uraian'];
                $sts->tglpenerimaan = $row['tanggalSTS'];
                $sts->totalsetoran = $row['totalSetoran'];
                $sts->totalsetoranpembulatan = $pembulatan;
                $sts->terbilang = $row['terbilang'];
                $sts->objectpegawaifk = $dataPegawaiUser[0]->id;
                $sts->ismanual = NULL;
                $sts->objectakunpendapatanfk = $row['rekening']['id'];
                $sts->save();

                // simpan ke ststosck
                $ststosck = new STStoSCK();
                $ststosck->norec  = $ststosck->generateNewId();
                $ststosck->kdprofile = $idProfile;
                $ststosck->statusenabled = true;
                $ststosck->objectstsfk = $sts->norec;
                $ststosck->objectscfk = $row['scfk'];
                $ststosck->objectsckfk = $row['sckfk'];
                $ststosck->save();

                // simpan detail sts
                foreach($row['detailSTS'] as $key => $detail){

                    $stsd = new SuratTandaSetoranDetailV2();
                    $stsd->norec = $stsd->generateNewId();
                    $stsd->statusenabled = TRUE;
                    $stsd->kdprofile = $idProfile;
                    $stsd->objectakunpendapatanfk = $detail['idrekening'];
                    $stsd->objectstsfk = $sts->nosts;
                    $stsd->totalsetoran = $detail['totaldibayarclosing'];
                    $stsd->nourut = $key + 1;
                    $stsd->save();
                }

                // setelah sts langsung buat bku
                $BKU = new BKUPenerimaanV2();
                $norec = $BKU->generateNewId();
                $BKU->norec = $norec;
                $BKU->statusenabled = true;
                $BKU->kdprofile = $idProfile;

                $nobku = $this->generateCodeBKU(new BKUPenerimaanV2, 'nobku', $request['asalproduk'], 2, '', $idProfile);

                $BKU->nobku = $nobku;
                $BKU->tglbku = $sts->tglpenerimaan;
                $BKU->uraianbku = $sts->keterangan;
                $BKU->objectstsfk = $sts->norec;
                $BKU->objectakunpendapatanfk = $sts->objectakunpendapatanfk;
                $BKU->objectspmfk = null;
                $BKU->ispenerimaan = true;
                $BKU->totalpenerimaan = $sts->totalsetoran;
                $BKU->totalpengeluaran = 0;
                $BKU->objectasalprodukfk = 18;
                $BKU->save();

            }

            $transStatus = true;

        } catch (\Exception $e) {
            $transStatus= false;
        }

        $transMsg = "";
        if($transStatus == true) {
            $transMsg = 'Simpan Berhasil';
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMsg,
                "as" => 'as@epic',
            );
        }else {
            $transMsg = 'Simpan Gagal!!';
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMsg,
                "err" => $e->getMessage(),
                "line" => $e->getLine(),
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMsg);
    }

    public function editSTSV2(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        DB::beginTransaction();
        try {
                $norecSTS = $request['norec'];
            $nostsNew = trim($request['nosts']);
            $keteranganNew = $request['keterangan'];

            // Cek duplikasi nomor STS
            $duplicateCheck = DB::table('surattandasetoran_t')
                ->where('nosts', $nostsNew)
                ->where('kdprofile', $idProfile)
                ->where('statusenabled', true)
                ->where('norec', '!=', $norecSTS)
                ->count();

            if ($duplicateCheck > 0) {
                DB::rollBack();
                $result = array(
                    "status" => 400,
                    "message" => "Nomor STS '$nostsNew' sudah digunakan! Silakan gunakan nomor lain.",
                    "as" => 'as@epic',
                );
                return $this->setStatusCode($result['status'])->respond($result, $result['message']);
            }

            // Update
            DB::table('surattandasetoran_t')
                ->where('norec', $norecSTS)
                ->where('kdprofile', $idProfile)
                ->update([
                    'nosts' => $nostsNew,
                    'keterangan' => $keteranganNew
                ]);

            // Update BKU
            DB::table('bkupenerimaanv2_t')
                ->where('objectstsfk', $norecSTS)
                ->where('kdprofile', $idProfile)
                ->update([
                    'uraianbku' => $keteranganNew
                ]);

            $transStatus = true;

        } catch (\Exception $e) {
            $transStatus = false;
        }

        $transMsg = "";
        if($transStatus == true) {
            $transMsg = 'Edit STS Berhasil';
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMsg,
                "as" => 'as@epic',
            );
        } else {
            $transMsg = 'Edit STS Gagal!!';
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMsg,
                "err" => $e->getMessage(),
                "line" => $e->getLine(),
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMsg);
    }

    public function simpanSTSKlaimV2(Request $request)
    {

        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        
        DB::beginTransaction();
        try {
            
            // get data hasil mapping
            $setoran = $request['setoran'];
            $rekapKlaim = [];
            foreach($setoran as $item){
                array_push($rekapKlaim, $item['norec']);
            }

            $data = DB::select(DB::raw("
                SELECT 
                    x.id as idrekening, x.namarekening, x.koderekening, COALESCE(SUM(x.totalsetujui), 0) AS totalsetujui, x.idlevel7, x.idlevel6, x.idlevel5, x.idlevel4, x.idlevel3, x.idlevel2, x.idlevel1
                FROM (
                    SELECT
                        cap.id,
                        cap.koderekening, 
                        cap.namarekening,
                        cap7.id as idlevel7,
                        cap6.id as idlevel6,
                        cap5.id as idlevel5,
                        cap4.id as idlevel4,
                        cap3.id as idlevel3,
                        cap2.id as idlevel2,
                        cap1.id as idlevel1,
                        COALESCE(SUM(rkb.totalsetujui), 0) AS totalsetujui
                    FROM
                        rekapklaimbpjs_t rkb
                    LEFT JOIN pasiendaftar_t pd ON pd.norec = rkb.norecpdfk
                    LEFT JOIN kelompokpasien_m kp ON kp.id = pd.objectkelompokpasienlastfk
                    LEFT JOIN ruangan_m ru ON ru.id = pd.objectruanganlastfk
                    JOIN mapbkuakun_t mba 
                        ON pd.objectkelompokpasienlastfk::VARCHAR = ANY(string_to_array(mba.objectkelompokpasienfk, ','))
                        AND pd.objectruanganlastfk::VARCHAR = ANY(string_to_array(mba.objectruanganfk , ','))
                        AND mba.statusenabled = TRUE
                    LEFT JOIN char_akun_pendapatan_m cap ON cap.id = mba.objectakunpendapatanfk AND cap.statusenabled = TRUE 
                    LEFT JOIN char_akun_pendapatan_m cap7 ON cap7.id = cap.headfk AND cap7.statusenabled = TRUE 
                    LEFT JOIN char_akun_pendapatan_m cap6 ON cap6.id = cap7.headfk AND cap6.statusenabled = TRUE 
                    LEFT JOIN char_akun_pendapatan_m cap5 ON cap5.id = cap6.headfk AND cap5.statusenabled = TRUE 
                    LEFT JOIN char_akun_pendapatan_m cap4 ON cap4.id = cap5.headfk AND cap4.statusenabled = TRUE 
                    LEFT JOIN char_akun_pendapatan_m cap3 ON cap3.id = cap4.headfk AND cap3.statusenabled = TRUE 
                    LEFT JOIN char_akun_pendapatan_m cap2 ON cap2.id = cap3.headfk AND cap2.statusenabled = TRUE 
                    LEFT JOIN char_akun_pendapatan_m cap1 ON cap1.id = cap2.headfk AND cap1.statusenabled = TRUE 
                    WHERE
                        rkb.statusenabled = TRUE
                        AND rkb.kdprofile = 30
                        AND (
                            (mba.isobat IS NOT TRUE AND rkb.isobat IS NULL) 
                            OR 
                            (mba.isobat = TRUE AND rkb.isobat = TRUE)
                        )
                        AND rkb.norec IN('".implode("','",$rekapKlaim)."')
                    GROUP BY 
                        cap.id,
                        cap.koderekening,
                        cap.namarekening,
                        rkb.isobat,
                        cap7.id,
                        cap6.id,
                        cap5.id,
                        cap4.id,
                        cap3.id,
                        cap2.id,
                        cap1.id
                ) as x
                GROUP BY
                    x.id,
                    x.koderekening,
                    x.namarekening,
                    x.idlevel7,
                    x.idlevel6,
                    x.idlevel5,
                    x.idlevel4,
                    x.idlevel3,
                    x.idlevel2,
                    x.idlevel1
                ORDER BY
                    split_part(x.koderekening, '.', 3)::DECIMAL,
                    split_part(x.koderekening, '.', 4)::DECIMAL,
                    split_part(x.koderekening, '.', 5)::DECIMAL,
                    split_part(x.koderekening, '.', 6)::DECIMAL,
                    split_part(x.koderekening, '.', 7)::DECIMAL,
                    split_part(x.koderekening, '.', 8)::DECIMAL ASC
            "));

            // data pegawai
            $dataLogin = $request->all();
            $iduser = '';
            $dataPegawaiUser = DB::select(DB::raw("select pg.id,pg.namalengkap from loginuser_s as lu
                INNER JOIN pegawai_m as pg on lu.objectpegawaifk=pg.id
                where pg.kdprofile = $idProfile and lu.id=:idLoginUser"),
                array(
                    'idLoginUser' => $dataLogin['userData']['id'],
                )
            );
            foreach($dataPegawaiUser as $dat){
                $iduser = $dat->id;
            }

            // admin transfer
            $transfer = 0;
            $admin = 0;
            if(isset($request['biayatransfer'])){
                $transfer = $request['biayatransfer'];
            }  
            if(isset($request['biayaadmin'])){
                $admin = $request['biayaadmin'];
            }

            // simpan sts
            $nosts = $this->generateCode(new SuratTandaSetoran, 'nosts', 11, date('ymd',strtotime($request['tglsts'])),$idProfile);
            $STS = new SuratTandaSetoran();
            $STS->norec  = $STS->generateNewId();
            $STS->kdprofile = $idProfile;
            $STS->statusenabled = true;
            $STS->nosts = $nosts;
            $STS->tglpenerimaan = $request['tglsts'];
            $STS->totalsetoran = $request['totalsetor'] - $transfer - $admin;
            $STS->totalsetoranpembulatan = $request['totalsetor'] - $transfer - $admin;
            $STS->terbilang = $request['terbilang'];
            $STS->objectpegawaifk = $iduser;
            $STS->keterangan = $request['uraian'];
            $STS->ismanual = null;
            $STS->objectakunpendapatanfk = $data[0]->idlevel6;
            $STS->save();

            // simpan ststorekapklaim
            foreach($setoran as $item){
                $STSR = new STStoRekapKlaim();
                $STSR->norec  = $STSR->generateNewId();
                $STSR->kdprofile = $idProfile;
                $STSR->statusenabled = true;
                $STSR->objectstsfk = $STS->norec;
                $STSR->objectrekapklaimfk = $item['norec'];
                $STSR->save();
            }

            // satu detail nilainya dikurangi transfer admin
            $data[0]->totalsetujui = $data[0]->totalsetujui - $transfer - $admin;

            // simpan stsdetail berdasarkan mappingan
            foreach($data as $item){
                $newId = SuratTandaSetoranDetailV2::max('nourut') +1 ;

                $stsd = new SuratTandaSetoranDetailV2();
                $stsd->norec = $stsd->generateNewId();
                $stsd->statusenabled = TRUE;
                $stsd->kdprofile = $idProfile;
                $stsd->objectakunpendapatanfk = $item->idrekening;
                $stsd->objectstsfk = $STS->nosts;
                $stsd->totalsetoran = $item->totalsetujui;
                $stsd->nourut = $newId;
                $stsd->save();
            }

            // setelah sts langsung buat bku
            $BKU = new BKUPenerimaanV2();
            $norec = $BKU->generateNewId();
            $BKU->norec = $norec;
            $BKU->statusenabled = true;
            $BKU->kdprofile = $idProfile;

            $nobku = $this->generateCodeBKU(new BKUPenerimaanV2, 'nobku', $request['asalproduk'], 2, '', $idProfile);

            $BKU->nobku = $nobku;
            $BKU->tglbku = $STS->tglpenerimaan;
            $BKU->uraianbku = $STS->keterangan;
            $BKU->objectstsfk = $STS->norec;
            $BKU->objectakunpendapatanfk = $STS->objectakunpendapatanfk;
            $BKU->objectspmfk = null;
            $BKU->ispenerimaan = true;
            $BKU->totalpenerimaan = $STS->totalsetoran;
            $BKU->totalpengeluaran = 0;
            $BKU->objectasalprodukfk = 18;
            $BKU->save();

            $transStatus = true;

        } catch (\Exception $e) {

            $transStatus= false;
            
        }

        $transMsg = "";
        if($transStatus == true) {
            $transMsg = 'Simpan Berhasil';
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMsg,
                "as" => 'as@epic',
            );
        }else {
            $transMsg = 'Simpan Gagal!!';
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMsg,
                "err" => $e->getMessage(),
                "line" => $e->getLine(),
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMsg);

    }


    public function getDataComboV2(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        
        $asalProduk = \DB::table('asalproduk_m')
            ->select('id','asalproduk')
            ->where('statusenabled',true)
            ->where('kdprofile', $idProfile)
            ->where('isanggaran', true)
            ->get();

        $tahap = DB::table('tahapanggaran_m')
            ->where('statusenabled', true)
            ->where('kdprofile', $idProfile)
            ->get();

        $rekeningLv8 = DB::select(DB::raw("

            SELECT 
                cap.id,
                cap.koderekening,
                cap.namarekening,
                cap.namarekening || ' - ' || cap.koderekening AS text
            FROM char_akun_pendapatan_m cap
            WHERE 
                cap.statusenabled = TRUE 
                AND cap.kdprofile = ".$idProfile." 
                AND cap.level = 8
            ORDER BY
                split_part(cap.koderekening, '.', 3)::DECIMAL,
                split_part(cap.koderekening, '.', 4)::DECIMAL,
                split_part(cap.koderekening, '.', 5)::DECIMAL,
                split_part(cap.koderekening, '.', 6)::DECIMAL,
                split_part(cap.koderekening, '.', 7)::DECIMAL,
                split_part(cap.koderekening, '.', 8)::DECIMAL ASC
        
        "));

        $result = array(
            'asalproduk'=>$asalProduk,
            'tahap' => $tahap,
            'rekening_lv8' => $rekeningLv8,
            'message' => 'inhuman',
        );
        
        return $this->respond($result);
    }
    

    public function daftarBKUV2(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $tglAwal = $request->get('tglAwal');
        $tglAkhir = $request->get('tglAkhir');
        $nosts = $request->get('nosts');
        $uraian = $request->get('uraian');
        $keterangan = $request->get('keterangan');
        $noRekening = $request->get('noRekening');

        $query = DB::table('bkupenerimaanv2_t as bkup')
            ->select(
                'bkup.*',
                DB::raw('COALESCE(cap.koderekening, \'0\') as norekening'),
                DB::raw('COALESCE(sts.nosts, \'0\') as nosts')
            )
            ->leftJoin('surattandasetoran_t as sts', 'sts.norec', '=', 'bkup.objectstsfk')
            ->leftJoin('char_akun_pendapatan_m as cap', 'cap.id', '=', 'bkup.objectakunpendapatanfk')
            ->leftJoin('spm_t as spm', 'spm.norec', '=', 'bkup.objectspmfk')
            ->leftJoin('spp_t as spp', 'spp.norec', '=', 'spm.objectsppfk')
            ->leftJoin('asalproduk_m as ap', 'ap.id', '=', 'spm.objectasalprodukfk')
            ->where('bkup.statusenabled', '=', true)
            ->where('bkup.kdprofile', '=', $idProfile);

        if ($tglAwal && $tglAkhir && $tglAwal != 'null' && $tglAkhir != 'null') {
            $query->whereBetween('bkup.tglbku', [$tglAwal, $tglAkhir]);
        }
        if ($nosts && $nosts != '' && $nosts != 'null' && $nosts != 'undefined') {
            $query->where('sts.nosts', 'ilike', '%' . $nosts . '%');
        }
        if ($uraian && $uraian != '' && $uraian != 'null' && $uraian != 'undefined') {
            $query->where('bkup.uraianbku', 'ilike', '%' . $uraian . '%');
        }
        if ($keterangan && $keterangan != '' && $keterangan != 'null' && $keterangan != 'undefined') {
            $query->where('bkup.uraianbku', 'ilike', '%' . $keterangan . '%');
        }
        if ($noRekening && $noRekening != '' && $noRekening != 'null' && $noRekening != 'undefined') {
            $query->where('cap.koderekening', 'ilike', '%' . $noRekening . '%');
        }
        $data = $query->orderBy('bkup.tglbku', 'desc')->get();

        return $this->respond($data);
    }


    public function getJenisBuktiBKU(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $data = DB::select(DB::raw("
            SELECT
                jb.*
            FROM jenisbukti_m jb
            WHERE 
                jb.statusenabled = TRUE
                AND jb.kdprofile = ".$idProfile."
                AND jb.isbkupenerimaan = TRUE
        "));

        return $this->respond($data);
    }

    public function getSTSKeuangan(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        // sts harus pake simpan yang sudah mapping akun pendapatan
        $data = DB::select(DB::raw("
           
            
            SELECT
                *
            FROM
                (
                    -- untuk sts biasa
                    SELECT
                        DISTINCT sts.norec,
                        sts.nosts,
                        sts.tglpenerimaan,
                        sts.totalsetoran,
                        sts.totalsetoranpembulatan,
                        sts.terbilang,
                        sts.keterangan,
                        cap.id AS idakunpendapatan,
                        cap.koderekening,
                        cap.namarekening, 
                        cap.koderekening || ' - ' || cap.namarekening AS textrekening
                    FROM strukclosing_t sc
                    INNER JOIN strukclosingkasir_t sck ON sck.noclosingfk = sc.norec
                    INNER JOIN strukbuktipenerimaan_t sbm ON sbm.noclosingfk = sc.norec 
                    INNER JOIN strukhistori_t sh ON sh.noclosing = sc.norec
                    LEFT JOIN strukbuktipenerimaancarabayar_t sbmcr ON sbmcr.nosbmfk = sbm.norec
                    LEFT JOIN carabayar_m cb ON cb.id = sbmcr.objectcarabayarfk
                    INNER JOIN ststosck_t ssc ON ssc.objectsckfk = sck.norec AND ssc.statusenabled = TRUE
                    INNER JOIN surattandasetoran_t sts ON sts.norec = ssc.objectstsfk AND sts.statusenabled = TRUE
                    LEFT JOIN char_akun_pendapatan_m cap ON cap.id = sts.objectakunpendapatanfk AND cap.statusenabled = TRUE
                    WHERE
                        sc.statusenabled = TRUE
                        AND sc.kdprofile = 30
                        AND sbm.statusenabled = TRUE 
                        AND sbm.kdprofile = 30
                        AND sh.statusenabled = TRUE
                        AND sh.kdprofile = 30
                        AND sts.norec NOT IN (SELECT objectstsfk FROM bkupenerimaanv2_t WHERE statusenabled = TRUE AND objectstsfk IS NOT NULL)
                    
                    UNION
                    
                    SELECT
                        sts.norec,
                        sts.nosts,
                        sts.tglpenerimaan,
                        sts.totalsetoran,
                        sts.totalsetoranpembulatan,
                        sts.terbilang,
                        sts.keterangan,
                        cap.id AS idakunpendapatan,
                        cap.koderekening,
                        cap.namarekening,
                        cap.koderekening || ' - ' || cap.namarekening AS textrekening
                    FROM
                        rekapklaimbpjs_t rkb
                    LEFT JOIN pasiendaftar_t pd ON pd.norec = rkb.norecpdfk
                    LEFT JOIN kelompokpasien_m kp ON kp.id = pd.objectkelompokpasienlastfk
                    LEFT JOIN ruangan_m ru ON ru.id = pd.objectruanganlastfk
                    INNER JOIN ststorekapklaim_t str ON str.objectrekapklaimfk = rkb.norec AND str.statusenabled = TRUE AND str.kdprofile = 30
                    INNER JOIN surattandasetoran_t sts ON sts.norec = str.objectstsfk AND sts.statusenabled = TRUE AND sts.kdprofile = 30
                    INNER JOIN char_akun_pendapatan_m cap ON cap.id = sts.objectakunpendapatanfk AND cap.statusenabled = TRUE
                    WHERE
                        rkb.statusenabled = TRUE
                        AND rkb.kdprofile = 30
                        AND sts.norec NOT IN (SELECT objectstsfk FROM bkupenerimaanv2_t WHERE statusenabled = TRUE AND objectstsfk IS NOT NULL)
                    GROUP BY 
                            sts.norec,
                            sts.nosts,
                            sts.tglpenerimaan,
                            sts.totalsetoran,
                            sts.terbilang,
                            cap.id,
                            cap.koderekening,
                            cap.namarekening

                ) AS x
            ORDER BY
                x.tglpenerimaan

        "));

        return $this->respond($data);
    }

    public function getSPM(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $setting = \DB::table('settinganggaran_t as st')
            ->join('pegawai_m as pg','pg.id','=','st.objectkepalabludfk')
            ->join('tahapanggaran_m as ta','ta.id','=','st.objecttahapaktivfk')
            ->select('st.*','pg.namalengkap', 'ta.tahap', 'ta.id as idtahap', 'pg.id as idpegawai')
            ->where('st.kdprofile', $idProfile)
            ->where('st.statusenabled', true)
            ->orderBy('st.tahunanggaran')
            ->get();

        $data = DB::select(DB::raw("
            SELECT 
                spm.*, spp.nospp, spp.tglspp, ap.id idasalproduk, ap.asalproduk
            FROM spm_t spm
            LEFT JOIN spp_t spp on spp.norec = spm.objectsppfk
            LEFT JOIN asalproduk_m ap on ap.id = spm.objectasalprodukfk AND ap.statusenabled = true AND spp.statusenabled = true
            LEFT JOIN bkupenerimaanv2_t bkubp ON bkubp.objectspmfk = spm.norec AND bkubp.statusenabled = TRUE
            WHERE 
                spm.statusenabled = true
                AND spm.norec NOT IN (SELECT objectspmfk FROM bkupenerimaanv2_t WHERE statusenabled = TRUE AND objectspmfk IS NOT NULL)
                AND EXTRACT(YEAR FROM spm.tglspm) = '".$setting[0]->tahunanggaran."'
                AND bkubp.objectspmfk IS NULL
            ORDER BY
                spm.tglspm DESC
        "));

        return $this->respond($data);
    }

    public function getSPJLS(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $data = StrukRealisasi::where('statusenabled', TRUE)
            ->where('status', 'Sudah Diverifikasi')
            ->where('statusls', 'Sudah Bayar')
            // ->where('norealisasi', 'ilike', '%LS%')
            ->whereNull('objectbkupenerimaanfk')
            ->select('norec', 'norealisasi', 'tglrealisasi', 'jumlahdibayarverif', 'status', 'statusls', 'tglverif', 'keterangan', 'objectbkupenerimaanfk')
            ->get();

        return $this->respond($data);        
    }

    public function simpanBKUV2(Request $request)
    {

        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        DB::beginTransaction();
        try {
            
            // simpan bku
            $BKU = new BKUPenerimaanV2();
            $norec = $BKU->generateNewId();
            $BKU->norec = $norec;
            $BKU->statusenabled = true;
            $BKU->kdprofile = $idProfile;

            $nobku = $this->generateCodeBKU(new BKUPenerimaanV2, 'nobku', $request['asalproduk'], 2, '', $idProfile);

            $BKU->nobku = $nobku;
            $BKU->tglbku = $request['tglbku'];
            $BKU->uraianbku = $request['uraian'];
            $BKU->objectstsfk = isset($request['norecSTS']) ? $request['norecSTS'] : null;
            $BKU->objectakunpendapatanfk = isset($request['akunpendapatan']) ? $request['akunpendapatan'] : null;
            $BKU->objectspmfk = isset($request['norecSPM']) ? $request['norecSPM'] : null;
            $BKU->objectpengembalianpembayaranfk = isset($request['norecPengembalianPembayaran']) ? $request['norecPengembalianPembayaran'] : null;
            $BKU->ispenerimaan = $request['ispenerimaan'];
            $BKU->totalpenerimaan = isset($request['totalpenerimaan']) ? (float)$request['totalpenerimaan'] : 0;
            $BKU->totalpengeluaran = isset($request['totalpengeluaran']) ? (float)$request['totalpengeluaran'] : 0;
            $BKU->objectasalprodukfk = $request['asalproduk'];
            $BKU->save();

            // update pengembalian pembayaran
            if(isset($request['norecPengembalianPembayaran'])){
                PengembalianPembayaran::where('norec', $request['norecPengembalianPembayaran'])->update([
                    'objectbkufk' => $BKU->norec
                ]);
            }

            // update spj ls (strukrealisasi)
            if(isset($request['norecSPJLS'])){
                StrukRealisasi::where('norec', $request['norecSPJLS'])->update([
                    'objectbkupenerimaanfk' => $BKU->norec
                ]);
            }

            $transStatus = true;

        } catch (\Exception $e) {
            
            $transStatus= false;
            
        }

        $transMsg = "";
        if($transStatus == true) {
            $transMsg = 'Simpan Berhasil';
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMsg,
                "as" => 'as@epic',
            );
        }else {
            $transMsg = 'Simpan Gagal!!';
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMsg,
                "err" => $e->getMessage(),
                "line" => $e->getLine(),
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMsg);

    }

    public function hapusBKUV2(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        DB::beginTransaction();
        try {
            
            // hapus bku
            $data = DB::table('bkupenerimaanv2_t')->where('norec', $request['norec'])->update([
                'statusenabled' => false
            ]);

            // update tabel pengemblaian pembayaran
            $data = DB::table('pengembalianpembayaran_t')->where('objectbkufk', $request['norec'])->update([
                'objectbkufk' => null
            ]);

            // update strukrealisasi (spj ls)
            StrukRealisasi::where('objectbkupenerimaanfk', $request['norec'])
                ->where('kdprofile', $idProfile)
                ->update([
                    'objectbkupenerimaanfk' => null
            ]);

            $transStatus = true;

        } catch (\Exception $e) {
            
            $transStatus= false;
            
        }

        $transMsg = "";
        if($transStatus == true) {
            $transMsg = 'Simpan Berhasil';
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMsg,
                "as" => 'as@epic',
            );
        }else {
            $transMsg = 'Simpan Gagal!!';
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMsg,
                "err" => $e->getMessage(),
                "line" => $e->getLine(),
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMsg);
    }


    public function cekTargetPendapatan(Request $request)
    {

        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;


        $sumberdana = '';
        if(isset($request['sumberdana']) && $request['sumberdana'] !== '' && $request['sumberdana'] !== "undefined"){
            $sumberdana = "AND rp.objectasalprodukfk = ".$request['sumberdana'];
        }

        $tahap = '';
        if(isset($request['tahap']) && $request['tahap'] !== '' && $request['tahap'] !== "undefined"){
            $tahap = "AND rp.objecttahapfk = ". $request['tahap'];
        }

        $rekening = '';
        if(isset($request['rekening']) && $request['rekening'] !== '' && $request['rekening'] !== "undefined"){
            $rekening = "AND cap.id = ". $request['rekening'];
        }

        $norec = '';
        if(isset($request['norec']) && $request['norec'] !== '' && $request['norec'] !== "undefined"){
            $norec = "AND rp.norec != '".$request['norec']."'";
        }

        $tahun = '';
        if(isset($request['tahun']) && $request['tahun'] !== '' && $request['tahun'] !== "undefined"){
            $tahun = "AND rp.tahun = '". $request['tahun']."'";
        }

        $cek = DB::select(DB::raw("
            SELECT
                rp.*,
                cap.koderekening,
                cap.namarekening,
                ta.tahap 
            FROM rincianpendapatan_t rp
            JOIN char_akun_pendapatan_m AS cap ON cap.id = rp.objecturaianpendapatanfk AND cap.statusenabled = TRUE AND cap.kdprofile = ".$idProfile."
            JOIN tahapanggaran_m AS ta ON ta.id = rp.objecttahapfk AND ta.statusenabled = true AND ta.kdprofile = ".$idProfile."
            JOIN asalproduk_m AS ap ON ap.id = rp.objectasalprodukfk AND ap.statusenabled = true AND ap.kdprofile = ".$idProfile."
            WHERE 
                rp.statusenabled = true 
                AND rp.kdprofile = ".$idProfile."
                $sumberdana
                $tahap
                $rekening
                $tahun
                $norec
            ORDER BY
                cap.id asc
        "));

        return $this->respond($cek);
    }

    public function getSaldoAwalBKUBP(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $data = DB::select(DB::raw("
            SELECT
                sabp.*
            FROM saldoawal_bkubp_t sabp
            WHERE
                sabp.statusenabled = TRUE
                AND sabp.kdprofile = ".$idProfile."
        "));

        return $this->respond($data);
    }

    public function simpanSaldoAwalBKUBP(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        DB::beginTransaction();
        try {
            
            $saldoAwalBKUBP = new SaldoAwalBKUBP();
            $saldoAwalBKUBP->norec = $saldoAwalBKUBP->generateNewId();
            $saldoAwalBKUBP->statusenabled = true;
            $saldoAwalBKUBP->kdprofile = $idProfile;
            $saldoAwalBKUBP->tahun = $request['tahun'];
            $saldoAwalBKUBP->bulan = $request['bulan'];
            $saldoAwalBKUBP->saldoawal = $request['saldoawal'];
            $saldoAwalBKUBP->save();

            $transStatus= true;

        } catch (\Exception $e) {
            
            $transStatus= false;
            
        }

        $transMsg = "";
        if($transStatus == true) {
            $transMsg = 'Simpan Berhasil';
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMsg,
                "as" => 'as@epic',
            );
        }else {
            $transMsg = 'Simpan Gagal!!';
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMsg,
                "err" => $e->getMessage(),
                "line" => $e->getLine(),
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMsg);
    }

    public function hapusSaldoAwalBKUBP(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        DB::beginTransaction();
        try {
            
            // hapus bku
            $data = DB::table('saldoawal_bkubp_t')->where('norec', $request['norec'])->update([
                'statusenabled' => false
            ]);

            $transStatus = true;

        } catch (\Exception $e) {
            
            $transStatus= false;
            
        }

        $transMsg = "";
        if($transStatus == true) {
            $transMsg = 'Hapus Berhasil';
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMsg,
                "as" => 'as@epic',
            );
        }else {
            $transMsg = 'Hapus Gagal!!';
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMsg,
                "err" => $e->getMessage(),
                "line" => $e->getLine(),
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMsg);
    }


    public function getPengembalianPembayaran(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $data = DB::select(DB::raw("
            SELECT
                pp.*, sbm.nosbm
            FROM pengembalianpembayaran_t pp
            JOIN strukbuktipenerimaan_t sbm ON sbm.norec = pp.objectsbmfk AND sbm.statusenabled = TRUE AND sbm.kdprofile = ".$idProfile."
            WHERE
                pp.statusenabled = TRUE
                AND pp.kdprofile = ".$idProfile."
        "));

        return $this->respond($data);
    }

    public function cekSBMPengembalianPembayaran(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $data = DB::select(DB::raw("
            SELECT
                pp.*, sbm.nosbm
            FROM pengembalianpembayaran_t pp
            JOIN strukbuktipenerimaan_t sbm ON sbm.norec = pp.objectsbmfk AND sbm.statusenabled = TRUE AND sbm.kdprofile = ".$idProfile."
            WHERE
                pp.statusenabled = TRUE
                AND pp.kdprofile = ".$idProfile."
                AND sbm.norec = '".$request['norec']."'
        "));

        return $this->respond($data);
    }

    public function simpanPengembalianPembayaran(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        DB::beginTransaction();
        try {
            
            // simpan pengembalian pembayaran
            $PP = new PengembalianPembayaran();
            $PP->norec = $PP->generateNewId();
            $PP->kdprofile = $idProfile;
            $PP->statusenabled = true;
            $PP->objectsbmfk = $request['objectsmbfk'];
            $PP->tglpengembalian = $request['tglpengembalian'];
            $PP->jumlah = $request['jumlah'];
            $PP->keterangan = $request['keterangan'];
            $PP->save();

            $transStatus= true;

        } catch (\Exception $e) {
            
            $transStatus= false;
            
        }

        $transMsg = "";
        if($transStatus == true) {
            $transMsg = 'Simpan Berhasil';
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMsg,
                "as" => 'as@epic',
            );
        }else {
            $transMsg = 'Simpan Gagal!!';
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMsg,
                "err" => $e->getMessage(),
                "line" => $e->getLine(),
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMsg);
    }

    public function cekBKUPengembalianPembayaran(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $data = DB::select(DB::raw("
            SELECT
                pp.*, smb.nosmb
            FROM pengembalianpembayaran_t pp
            JOIN strukbuktipenerimaan_t sbm ON sbm.norec = pp.objectsbmfk AND sbm.statusenabled = TRUE AND sbm.kdprofile = ".$idProfile."
            WHERE
                pp.statusenabled = TRUE
                AND sabp.kdprofile = ".$idProfile."
                AND pp.norec = '".$request['norec']."'
                AND pp.objectbkufk IS NOT NULL
        "));

        return $this->respond($data);
    }

    public function hapusPengembalianPembayaran(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        DB::beginTransaction();
        try {
            
            // simpan pengembalian pembayaran
            $data = PengembalianPembayaran::where('norec', $request['norec'])->update('statusenabled', true);

            $transStatus= true;

        } catch (\Exception $e) {
            
            $transStatus= false;
            
        }

        $transMsg = "";
        if($transStatus == true) {
            $transMsg = 'Simpan Berhasil';
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMsg,
                "as" => 'as@epic',
            );
        }else {
            $transMsg = 'Simpan Gagal!!';
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMsg,
                "err" => $e->getMessage(),
                "line" => $e->getLine(),
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMsg);
    }

    public function getBKUPengembalianPembayaran(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $data = DB::select(DB::raw("
            SELECT
                pp.*, sbm.nosbm
            FROM pengembalianpembayaran_t pp
            JOIN strukbuktipenerimaan_t sbm ON sbm.norec = pp.objectsbmfk AND sbm.statusenabled = TRUE AND sbm.kdprofile = ".$idProfile."
            WHERE
                pp.statusenabled = TRUE
                AND pp.kdprofile = ".$idProfile."
                AND pp.objectbkufk IS NULL
        "));

        return $this->respond($data);
    }

    public function simpanSTSManualV2(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        DB::beginTransaction();
        try {
            
            $dataLogin = $request->all();
            $iduser = '';

            $dataPegawaiUser = DB::select(DB::raw("select pg.id,pg.namalengkap from loginuser_s as lu
                INNER JOIN pegawai_m as pg on lu.objectpegawaifk=pg.id
                where pg.kdprofile = $idProfile and lu.id=:idLoginUser"),
                array(
                    'idLoginUser' => $dataLogin['userData']['id'],
                )
            );

            foreach($dataPegawaiUser as $dat){
                $iduser = $dat->id;
            }

            $nosts = $this->generateCode(new SuratTandaSetoran, 'nosts', 11, date('ymd',strtotime($request['tglsts'])),$idProfile);

            // cari id lv6 dari kode rekening
            $akunLv6 = DB::select(DB::raw("
                SELECT 
                    cap6.*
                FROM char_akun_pendapatan_m cap
                JOIN char_akun_pendapatan_m cap7 ON cap7.id = cap.headfk AND cap7.statusenabled = TRUE 
                JOIN char_akun_pendapatan_m cap6 ON cap6.id = cap7.headfk AND cap6.statusenabled  = TRUE 
                WHERE 
                    cap.statusenabled = TRUE 
                    AND cap.kdprofile  = 30
                    AND cap.id = ".$request['rekeningsts']."
            "));

            $STS = new SuratTandaSetoran();
            $STS->norec  = $STS->generateNewId();
            $STS->kdprofile = $idProfile;
            $STS->statusenabled = true;
            $STS->nosts = $nosts;
            $STS->tglpenerimaan = $request['tglsts'];
            $STS->totalsetoran = $request['jumlah'];
            $STS->totalsetoranpembulatan = $request['jumlah'];
            $STS->terbilang = $request['terbilang'];
            $STS->objectpegawaifk = $iduser;
            $STS->keterangan = $request['uraian'];
            $STS->ismanual = true;
            $STS->objectakunpendapatanfk = $akunLv6[0]->id;
            $STS->save();

            // simpan detail
            $STSD = new SuratTandaSetoranDetailV2();
            $STSD->norec = $STSD->generateNewId();
            $STSD->statusenabled = TRUE;
            $STSD->kdprofile = $idProfile;
            $STSD->objectakunpendapatanfk = $request['rekeningsts'];
            $STSD->objectstsfk = $STS->nosts;
            $STSD->totalsetoran = $request['jumlah'];
            $STSD->nourut = 1;
            $STSD->save();
            
            // setelah sts langsung buat bku
            $BKU = new BKUPenerimaanV2();
            $norec = $BKU->generateNewId();
            $BKU->norec = $norec;
            $BKU->statusenabled = true;
            $BKU->kdprofile = $idProfile;

            $nobku = $this->generateCodeBKU(new BKUPenerimaanV2, 'nobku', $request['asalproduk'], 2, '', $idProfile);

            $BKU->nobku = $nobku;
            $BKU->tglbku = $STS->tglpenerimaan;
            $BKU->uraianbku = $STS->keterangan;
            $BKU->objectstsfk = $STS->norec;
            $BKU->objectakunpendapatanfk = $STS->objectakunpendapatanfk;
            $BKU->objectspmfk = null;
            $BKU->ispenerimaan = true;
            $BKU->totalpenerimaan = $STS->totalsetoran;
            $BKU->totalpengeluaran = 0;
            $BKU->objectasalprodukfk = 18;
            $BKU->save();

            $transStatus= true;

        } catch (\Exception $e) {
            
            $transStatus= false;
            
        }

        $transMsg = "";
        if($transStatus == true) {
            $transMsg = 'Simpan Berhasil';
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMsg,
                "as" => 'as@epic',
            );
        }else {
            $transMsg = 'Simpan Gagal!!';
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMsg,
                "err" => $e->getMessage(),
                "line" => $e->getLine(),
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMsg);
    }

    public function cekSTSManual(Request $request)
    {
        $nosts = $request['nosts'];
        $data = [];

        $detailv2 = DB::select(DB::raw("
            SELECT
                cap_stsd.id as idrekening,
                cap_stsd.koderekening,
                cap_stsd.namarekening,
                stsd2.totalsetoran as totaldibayarclosing,
                cap7.id as idlevel7,
                cap7.koderekening as koderekeninglevel7,
                cap7.namarekening as namarekeninglevel7,
                cap6.id as idlevel6,
                cap6.koderekening as koderekeninglevel6,
                cap6.namarekening as namarekeninglevel6,
                cap5.id as idlevel5,
                cap5.koderekening as koderekeninglevel5,
                cap5.namarekening as namarekeninglevel5,
                cap4.id as idlevel4,
                cap4.koderekening as koderekeninglevel4,
                cap4.namarekening as namarekeninglevel4,
                cap3.id as idlevel3,
                cap3.koderekening as koderekeninglevel3,
                cap3.namarekening as namarekeninglevel3,
                cap2.id as idlevel2,
                cap2.koderekening as koderekeninglevel2,
                cap2.namarekening as namarekeninglevel2,
                cap1.id as idlevel1,
                cap1.koderekening as koderekeninglevel1,
                cap1.namarekening as namarekeninglevel1
            FROM surattandasetoran_t sts
            JOIN surattandasetorandetailv2_t stsd2 ON stsd2.objectstsfk = sts.nosts AND stsd2.statusenabled = TRUE AND stsd2.kdprofile = 30
            JOIN char_akun_pendapatan_m cap_stsd ON cap_stsd.id = stsd2.objectakunpendapatanfk AND cap_stsd.statusenabled = TRUE AND cap_stsd.kdprofile = 30
            LEFT JOIN char_akun_pendapatan_m cap7 ON cap7.id = cap_stsd.headfk
            LEFT JOIN char_akun_pendapatan_m cap6 ON cap6.id = cap7.headfk
            LEFT JOIN char_akun_pendapatan_m cap5 ON cap5.id = cap6.headfk
            LEFT JOIN char_akun_pendapatan_m cap4 ON cap4.id = cap5.headfk
            LEFT JOIN char_akun_pendapatan_m cap3 ON cap3.id = cap4.headfk
            LEFT JOIN char_akun_pendapatan_m cap2 ON cap2.id = cap3.headfk
            LEFT JOIN char_akun_pendapatan_m cap1 ON cap1.id = cap2.headfk
            WHERE 
                sts.statusenabled = TRUE
                AND sts.kdprofile = 30
                AND sts.nosts = '".$nosts."'
            GROUP BY
                sts.nosts, stsd2.totalsetoran,
                cap_stsd.id,cap7.id,cap6.id,cap5.id,cap4.id,cap3.id,cap2.id,cap1.id
            ORDER BY
                split_part(cap1.koderekening, '.', 1)::INTEGER asc,
                split_part(cap2.koderekening, '.', 2)::INTEGER asc,
                split_part(cap3.koderekening, '.', 3)::INTEGER asc,
                split_part(cap4.koderekening, '.', 4)::INTEGER asc,
                split_part(cap5.koderekening, '.', 5)::INTEGER asc,
                split_part(cap6.koderekening, '.', 6)::INTEGER asc,
                cap_stsd.koderekening asc
        "));

        $sts = DB::select(DB::raw("
            SELECT
                sts.nosts,
                SUM(sts.totalsetoran) as totalsetoran,
                sts.tglpenerimaan
            FROM surattandasetoran_t sts 
            WHERE 
                sts.statusenabled = TRUE 
                AND sts.kdprofile = 30 
                AND sts.nosts = '".$request['nosts']."'  
            GROUP BY
                sts.nosts, sts.tglpenerimaan  
        "));

        $response = [
            'dataDetailSTS' => $detailv2,
            'sts' => $sts
        ];

        return $this->respond($response);
    }
}