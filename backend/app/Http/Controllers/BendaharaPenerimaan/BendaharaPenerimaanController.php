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
use App\Transaksi\StrukBuktiPenerimaan;
use App\Transaksi\StrukBuktiPenerimaanCaraBayar;
use App\Transaksi\StrukBuktiPengeluaran;
use App\Transaksi\StrukClosing;
use App\Transaksi\StrukClosingKasir;
use App\Transaksi\StrukHistori;
use App\Transaksi\TempBeritaAcaraKasBank;
use App\Transaksi\TempBukuKasUmum;
use App\Transaksi\TempLampiranBeritaAcaraKasBank;
use App\Transaksi\StrukOrder;
use App\Transaksi\SuratTandaSetoran;
use App\Transaksi\SuratTandaSetoranDetail;
use App\Transaksi\STStoSCK;
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
            ->leftjoin('kelompoktransaksi_m as kt', 'kt.id', '=', 'sbm.objectkelompoktransaksifk')
            ->leftjoin('strukclosing_t as sc', 'sc.norec', '=', 'sbm.noclosingfk')
            ->leftjoin('strukverifikasi_t as sv', 'sv.norec', '=', 'sbm.noverifikasifk')
            ->select('sbm.norec as noRec','cb.carabayar as caraBayar','sbmcr.objectcarabayarfk as idCaraBayar','sbm.objectkelompoktransaksifk as idKelTransaksi',
                'kt.kelompoktransaksi as kelTransaksi','sbm.keteranganlainnya as keterangan','p.id as idPegawai','p.namalengkap as namaPenerima',
                'sc.noclosing as noClosing','sbm.nosbm as noSbm','sv.noverifikasi as noVerifikasi','sc.tglclosing as tglClosing',
                'sbm.tglsbm as tglSbm','sv.tglverifikasi as tglVerif','sbm.totaldibayar as totalPenerimaan','pd.noregistrasi','ps.namapasien',
                'sp.norec as norec_sp','ru.id as ruid','ru.namaruangan','sp.namapasien_klien','ps.nocm','sbm.noclosingfk')
            ->where('sbm.kdprofile', $idProfile);
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
                $sbm = StrukBuktiPenerimaan::where('norec', $item['norec_sbm'])
                        ->where('kdprofile', $idProfile)
                        ->whereNotNull('noclosingfk')
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
            $status = ' and sts.nosts is not null';
        } else{
            $status = ' and sts.nosts is null';
        }

        if (isset($request['status']) && $request['status'] != "" && $request['status'] != "undefined" && $request['status']==2) {
            $status = ' and sts.nosts is null';
        }

        if(isset($request['idCaraBayar']) && $request['idCaraBayar'] != "" && $request['idCaraBayar'] != "undefined") {
            $carabayar = ' AND cb.id = ' . $request['idCaraBayar'];
        }

        if(isset($request['noclosing']) && $request['noclosing'] != "" && $request['noclosing'] != "undefined" && $request['noclosing'] != 1) {
            $noclosing = " and sc.noclosing ilike '%".$request['noclosing']."%'";
        }

        if(isset($request['nosts']) && $request['nosts'] != "" && $request['nosts'] != "undefined" && $request['noclosing'] != 1) {
            $nosts = " and sts.nosts ilike '%".$request['nosts']."%'";
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

        $detail = DB::select(DB::raw("select distinct sc.noclosing as nopenerimaan, sc.tglclosing as tglpenerimaan, sck.totaldibayar as totalpenerimaan, sts.nosts, cb.carabayar, sc.objectpegawaidiclosefk as pegawai, sc.norec as scfk, sck.norec as sckfk 
        from strukclosing_t sc
        inner join strukclosingkasir_t sck on sck.noclosingfk = sc.norec
        inner join strukbuktipenerimaan_t sbm on sbm.noclosingfk = sc.norec
        left join strukbuktipenerimaancarabayar_t sbmcr on sbmcr.nosbmfk = sbm.norec
        left join carabayar_m cb on cb.id = sbmcr.objectcarabayarfk
        left join ststosck_t ssc on ssc.objectsckfk = sck.norec 
        left join surattandasetoran_t sts on sts.norec = ssc.objectstsfk and sts.statusenabled = true
        where sc.tglclosing::date between '$tglAwal' and '$tglAkhir'
                    and sc.noclosing not in (
                    select sc.noclosing from strukclosing_t sc
                    inner join strukhistori_t sh on sh.noclosing = sc.norec
                    where sh.statusenabled = false
                    )
                    $status
                    $noclosing
                    $nosts
                    $carabayar
        and sc.kdprofile = $kdProfile
        and sc.statusenabled is null or sc.statusenabled=true
                    
        order by sc.tglclosing desc"));
        

        $result = array(
            'detail' => $detail,
        );
        
        return $this->setStatusCode(201)->respond($result, 'tes msg');
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

        $data = DB::select(DB::raw("select sc.tglclosing, ru.namaruangan, ru.id idruangan, pr.namaproduk, pr.id idproduk, pp.isobat,
        (((CASE WHEN pp.hargajual IS NULL THEN 0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
        0 ELSE pp.hargadiscount END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN 0 ELSE pp.jasa END ) AS totaldibayarclosing,
        ru.objectdepartemenfk, sbmcr.objectcarabayarfk, sbm.totaldibayar as totaldibayarsbm, sc.noclosing, sc.tglclosing,
        sck.totaldibayar as totaldibayar,sck.carabayarfk, cb.carabayar, djp.detailjenisproduk, jpr.id as jenisproduk
        
        FROM   pasien_m ps 
                        inner join pasiendaftar_t pd on ps.id=pd.nocmfk
                        inner join antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                        inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
                        inner JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk  
                        left JOIN strukpelayanan_t AS sp ON sp.norec = pp.strukfk  
                        LEFT JOIN strukbuktipenerimaan_t AS sbm ON sbm.nostrukfk = sp.norec AND sbm.statusenabled = true  
                        LEFT JOIN strukbuktipenerimaancarabayar_t as sbmcr ON sbmcr.nosbmfk = sbm.norec
                        LEFT JOIN carabayar_m as cb ON cb.id = sbmcr.objectcarabayarfk
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
        and sts.statusenabled = true
        and pd.kdprofile = 30
        and sc.noclosing IN('".implode("','",$noclosing)."')
        
        union all
        
        select sc.tglclosing, ru.namaruangan, ru.id idruangan, pr.namaproduk, pr.id idproduk, pp.isobat,
        (spd.qtyproduk * spd.hargasatuan * spd.qtyoranglast)::float4 as totaldibayarclosing,
        ru.objectdepartemenfk, sbmcr.objectcarabayarfk, sbm.totaldibayar as totaldibayarsbm, sc.noclosing, sc.tglclosing,
        sck.totaldibayar as totaldibayarclosing,sck.carabayarfk, cb.carabayar, djp.detailjenisproduk, jpr.id as jenisproduk
        from strukclosingkasir_t as sck
        inner join strukclosing_t as sc on sc.norec = sck.noclosingfk
        inner join strukbuktipenerimaan_t as sbm on sbm.noclosingfk = sc.norec
        inner join strukpelayanan_t as sp on sbm.nostrukfk = sp.norec
        inner join strukpelayanandetail_t as spd on sp.norec = spd.nostrukfk
				inner join strukbuktipenerimaancarabayar_t sbmcr on sbmcr.nosbmfk = sbm.norec
        inner join produk_m pr on pr.id=spd.objectprodukfk
        inner join carabayar_m as cb on cb.id = sck.carabayarfk
        left join detailjenisproduk_m djp on djp.id = pr.objectdetailjenisprodukfk
        left join jenisproduk_m jpr on jpr.id = djp.objectjenisprodukfk
        left join ruangan_m as ru on ru.id = spd.objectruanganasalfk
        left join pasiendaftar_t as pd on sp.noregistrasifk = pd.norec
        left join antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
        left join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
        left join ststosck_t as ssc on ssc.objectsckfk = sck.norec
        left join surattandasetoran_t as sts on sts.norec = ssc.objectstsfk
        where sbm.keteranganlainnya = 'Pembayaran Tagihan Non Layanan'
        and sts.statusenabled = true
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
        $jumlahsewatanah = 0;
        $jumlahsewakalandra = 0;
        $jumlahsewatempatfotocopy = 0;
        $jumlahsewamanekin = 0;
        $jumlahsewaambulan = 0;
        $jumlahsewabus = 0;
        $hasilketrampilan = 0;
        $parkir = 0;
        $lainlain = 0;
        $grandtotal = 0;

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

        foreach($data as $konten){
            $cekjumlah = '';
            $cekharga = 0;
            if($konten->idruangan == 752 && $konten->idproduk == 5006382){
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

            else if($konten->idruangan == 759 && ($konten->idproduk == 5006289 || $konten->idproduk == 5006504)){
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

            else if(($konten->idruangan == 786 && ($konten->idproduk == 5006289 || $konten->idproduk == 5006504)) || ($konten->idruangan == 761 && ($konten->idproduk == 5006289 || $konten->idproduk == 5006504))){
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

            else if($konten->idproduk == 5006041 || $konten->idproduk == 5006039 || $konten->idproduk == 5006780 || $konten->idproduk == 5006776 || $konten->idproduk == 5007118 || $konten->idproduk == 5006775 || $konten->idproduk == 5008618 || $konten->idproduk == 5008619 || $konten->idproduk == 5008614 || $konten->idproduk == 5006040 || $konten->idproduk == 5007119 || $konten->idproduk == 5005994 || $konten->idproduk == 5006774){
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

            else if($konten->idproduk == 5008612){
                $jumlahsewalapangan += $konten->totaldibayarclosing;
                $voljumlahsewalapangan++;
                $cekjumlah = $konten->namaproduk;
            }

            else if($konten->idproduk == 5008609){
                $jumlahsewagedungdiklat += $konten->totaldibayarclosing;
                $voljumlahsewagedungdiklat++;
                $cekjumlah = $konten->namaproduk;
            }

            else if($konten->idproduk == 5008623 || $konten->idproduk == 5008624){
                $jumlahsewatempatfotocopy += $konten->totaldibayarclosing;
                $voljumlahsewatempatfotocopy++;
                $cekjumlah = $konten->namaproduk;
            }

            else if($konten->idproduk == 5006036 || $konten->idproduk == 5006035 || $konten->idproduk == 5007117 || $konten->idproduk == 5005995 || $konten->idproduk == 5005996){
                $jumlahsewaambulan += $konten->totaldibayarclosing;
                $voljumlahsewaambulan++;
                $cekjumlah = $konten->namaproduk;
            }

            else if($konten->idproduk == 5008617){
                $jumlahsewabus += $konten->totaldibayarclosing;
                $voljumlahsewabus++;
                $cekjumlah = $konten->namaproduk;
            }

            else if($konten->idproduk == 5008631 || $konten->idproduk == 5008632 || $konten->idproduk == 5008633){
                $parkir += $konten->totaldibayarclosing;
                $volparkir++;
                $cekjumlah = $konten->namaproduk;
            }

            else if($konten->jenisproduk == 27688){
                $jumlahdiklat += $konten->totaldibayarclosing;
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

            else if(($konten->objectdepartemenfk != 16 && $konten->isobat == 't') || ($konten->idruangan == 94 && $konten->detailjenisproduk == 'TENAGA AHLI')){
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
            );
            
        }

        
        
        $jumlahperiksaigd = $jumlahperiksaigdjiwa + $jumlahperiksaigdnonjiwa;
        $voljumlahperiksaigd = $voljumlahperiksaigdjiwa + $voljumlahperiksaigdnonjiwa;
        $jumlahpoliklinik = $jumlahperiksajiwa + $jumlahperiksaumum + $jumlahperiksanapza + $jumlahperiksagigi + $jumlahperiksadalam + $jumlahperiksaanak + $jumlahperiksasyaraf + $jumlahperiksaigd + $jumlahperiksaelektromedik;
        $voljumlahpoliklinik = $voljumlahperiksajiwa + $voljumlahperiksaumum + $voljumlahperiksanapza + $voljumlahperiksagigi + $voljumlahperiksadalam + $voljumlahperiksaanak + $voljumlahperiksasyaraf + $voljumlahperiksaigd;
        $jumlahobatobatrajal = $jumlahobatrajal;
        $voljumlahobatobatrajal = $voljumlahobatrajal;
        $jumlahobatobatranap = $jumlahobatranap;
        $voljumlahobatobatranap = $voljumlahobatranap;
        $jumlahpenunjang = $jumlahlaboratorium + $jumlahelektromedik + $jumlahfisioterapi + $jumlahradiologi + $jumlahdiklat;
        $voljumlahpenunjang = $voljumlahlaboratorium + $voljumlahelektromedik + $voljumlahfisioterapi + $voljumlahradiologi + $voljumlahdiklat;
        $jumlahperawatanpasienranap = $jumlahkelassatu + $jumlahkelasdua + $jumlahkelastiga + $jumlahkelasvip + $jumlahkelasuppi;
        $voljumlahperawatanpasienranap = $voljumlahkelassatu + $voljumlahkelasdua + $voljumlahkelastiga + $voljumlahkelasvip + $voljumlahkelasuppi;
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

    public function detailSTS(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $nosts= $request['nostsdetail'];

        $detail = DB::select(DB::raw("select 
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

        $detail = DB::select(DB::raw("select stsd.kdrekening, stsd.nomer, stsd.uraian, sum(stsd.vol) as totalvol, sum(stsd.kolom1) as totalkolom1, sum(stsd.kolom2) as totalkolom2,
        (
            case 
            when sum(stsd.kolom1) is null and sum(stsd.kolom2) is null then sum(stsd.kolom1)
            when sum(stsd.kolom1) is null and sum(stsd.kolom2) is not null then sum(stsd.kolom2)
            when sum(stsd.kolom1) is not null and sum(stsd.kolom2) is null then sum(stsd.kolom1)
            else 0 
            end
        ) as totalfix
        from surattandasetoran_t sts
        inner join surattandasetorandetail_t stsd on stsd.objectstsfk = sts.nosts
        where sts.statusenabled = true
        and date_part('year', sts.tglpenerimaan::timestamp ) = '$tahun'
        group by stsd.kdrekening, stsd.nomer, stsd.uraian
        order by min(stsd.nourut)"));
        
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
        'Giro BTN', 'Ada Saldo Sutera BPD Sudah Diakui Sebagai Pendapatan'
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
        'Giro BTN', 'Ada Saldo Sutera BPD Sudah Diakui Sebagai Pendapatan'
        );

        $detail = DB::select(DB::raw("select to_char(sts.tglpenerimaan, 'MM') as date, stsd.kdrekening, stsd.nomer, stsd.uraian, sum(stsd.vol) as totalvol, sum(stsd.kolom1) as totalkolom1, sum(stsd.kolom2) as totalkolom2,
        (
            case 
            when sum(stsd.kolom1) is null and sum(stsd.kolom2) is null then sum(stsd.kolom1)
            when sum(stsd.kolom1) is null and sum(stsd.kolom2) is not null then sum(stsd.kolom2)
            when sum(stsd.kolom1) is not null and sum(stsd.kolom2) is null then sum(stsd.kolom1)
            else 0 
            end
        ) as totalfix
        from surattandasetoran_t sts
        inner join surattandasetorandetail_t stsd on stsd.objectstsfk = sts.nosts
        where sts.statusenabled = true
        and date_part('year', sts.tglpenerimaan::timestamp ) = '$tahun'
        group by stsd.kdrekening, stsd.nomer, stsd.uraian, to_char(sts.tglpenerimaan, 'MM')
        order by min(stsd.nourut)"));
        
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
            $uraian = $main;
            foreach($detail as $row){
                if($row->date == '01' && $main == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI')){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI')){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)')){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' )){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $main == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahjanuari += $row->totalfix;
                }
                else if($row->date == '01' && $row->uraian == $main){
                    $jumlahjanuari += $row->totalfix;
                }

                if($row->date == '02' && $main == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI')){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI')){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)')){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' )){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $main == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahfebruari += $row->totalfix;
                }
                else if($row->date == '02' && $row->uraian == $main){
                    $jumlahfebruari += $row->totalfix;
                }

                if($row->date == '03' && $main == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI')){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI')){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)')){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' )){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $main == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahmaret += $row->totalfix;
                }
                else if($row->date == '03' && $row->uraian == $main){
                    $jumlahmaret += $row->totalfix;
                }

                if($row->date == '04' && $main == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI')){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI')){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)')){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' )){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $main == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahapril += $row->totalfix;
                }
                else if($row->date == '04' && $row->uraian == $main){
                    $jumlahapril += $row->totalfix;
                }

                if($row->date == '05' && $main == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI')){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI')){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)')){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' )){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $main == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahmei += $row->totalfix;
                }
                else if($row->date == '05' && $row->uraian == $main){
                    $jumlahmei += $row->totalfix;
                }

                if($row->date == '06' && $main == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI')){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI')){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)')){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' )){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $main == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahjuni += $row->totalfix;
                }
                else if($row->date == '06' && $row->uraian == $main){
                    $jumlahjuni += $row->totalfix;
                }

                if($row->date == '07' && $main == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI')){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI')){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)')){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' )){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $main == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahjuli += $row->totalfix;
                }
                else if($row->date == '07' && $row->uraian == $main){
                    $jumlahjuli += $row->totalfix;
                }

                if($row->date == '08' && $main == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI')){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI')){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)')){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' )){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $main == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahagustus += $row->totalfix;
                }
                else if($row->date == '08' && $row->uraian == $main){
                    $jumlahagustus += $row->totalfix;
                }

                if($row->date == '09' && $main == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI')){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI')){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)')){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' )){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $main == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahseptember += $row->totalfix;
                }
                else if($row->date == '09' && $row->uraian == $main){
                    $jumlahseptember += $row->totalfix;
                }

                if($row->date == '10' && $main == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI')){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI')){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)')){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' )){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $main == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahoktober += $row->totalfix;
                }
                else if($row->date == '10' && $row->uraian == $main){
                    $jumlahoktober += $row->totalfix;
                }

                if($row->date == '11' && $main == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI')){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI')){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)')){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' )){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $main == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahnovember += $row->totalfix;
                }
                else if($row->date == '11' && $row->uraian == $main){
                    $jumlahnovember += $row->totalfix;
                }

                if($row->date == '12' && $main == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI')){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI')){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)')){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' )){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $main == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahdesember += $row->totalfix;
                }
                else if($row->date == '12' && $row->uraian == $main){
                    $jumlahdesember += $row->totalfix;
                }

                if($main == 'Klinik Gigi' && ($row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI')){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main == 'Konsultasi Spesialis Lain' && $row->uraian == 'KONSULTASI GIZI'){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main == 'RAWAT INAP' && ($row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI')){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main == 'Sewa Kantin / Tempat Fotocopy' && $row->uraian == 'SEWA TEMPAT FOTOCOPY'){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main == 'Pemakaian Mobil / Kendaraan' && ($row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS')){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main == 'RAWAT JALAN' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI')){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main == 'JASA LAYANAN RUMAH SAKIT' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)')){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main == 'ELEKTROMEDIK' && ($row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'ELEKTROMEDIK')){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main == 'PENDAPATAN USAHA BLUD' && ($row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA' || $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA (NAPZA)' || $row->uraian == 'PERIKSA DOKTER UMUM' || $row->uraian == 'PERIKSA DOKTER GIGI' || $row->uraian == 'PERIKSA DOKTER PENYAKIT DALAM' || $row->uraian == 'PERIKSA DOKTER ANAK' || $row->uraian == 'PERIKSA DOKTER SYARAF' || $row->uraian == 'PERIKSA DOKTER IGD' || $row->uraian == 'DIPAM/PENDAFTARAN' || $row->uraian == 'TINDAKAN MEDIK POLIKLINIK' || $row->uraian == 'TINDAKAN MEDIK IGD' || $row->uraian == 'TINDAKAN MEDIK PASIEN GIGI' || $row->uraian == 'OBAT-OBATAN' || $row->uraian == 'SURAT KETERANGAN (KIR)' || $row->uraian == 'PSIKOLOGI' || $row->uraian == 'PERAWATAN PASIEN' || $row->uraian == 'OBAT-OBATAN RANAP' || $row->uraian == 'TINDAKAN MEDIK RANAP' || $row->uraian == 'VISITE DOKTER' || $row->uraian == 'REHABILITASI MENTAL' || $row->uraian == 'PERAWATAN JENAZAH' || $row->uraian == 'KONSULTASI GIZI' || $row->uraian == 'PENUNJANG' || $row->uraian == 'PERIKSA DOKTER FISIK DAN REHABILITASI (ELEKTROMEDIK)' || $row->uraian == 'SEWA TEMPAT FOTOCOPY' || $row->uraian == 'SEWA AMBULAN/MOBIL JENAZAH' || $row->uraian == 'SEWA BUS' || $row->uraian == 'LEGALISIR' || $row->uraian == 'SEWA GEDUNG TERAPI' || $row->uraian == 'SEWA LAPANGAN SEPAK BOLA' || $row->uraian == 'SEWA GEDUNG DIKLAT' || $row->uraian == 'SEWA GEDUNG GRHASIA INN' || $row->uraian == 'SEWA TANAH PERTANIAN' || $row->uraian == 'SEWA KALANDRA' || $row->uraian == 'SEWA MANEKIN' || $row->uraian == 'HASIL KETRAMPILAN PASIEN' || $row->uraian == 'PARKIR' || $row->uraian == 'LAIN-LAIN' )){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main == 'Klinik Jiwa Umum' && $row->uraian == 'PERIKSA DOKTER SPESIALIS JIWA'){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main == 'TM. Poli Umum' && $row->uraian == 'TINDAKAN MEDIK POLIKLINIK'){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main == 'Kunjungan UGD Umum' && $row->uraian == 'PERIKSA DOKTER IGD'){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main == 'Pasien Umum' && $row->uraian == 'Obat Rajal Umum'){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main == 'Laboratorium Umum' && $row->uraian == 'LABORATORIUM'){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main == 'TM Pasien Umum' && $row->uraian == 'TINDAKAN MEDIK RANAP'){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main == 'Visite Dokter Pasien Umum' && $row->uraian == 'VISITE DOKTER'){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($main == 'RM. Pasien Umum' && $row->uraian == 'REHABILITASI MENTAL'){
                    $jumlahrealisasi += $row->totalfix;
                }
                else if($row->uraian == $main){
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

    public function getSTSPertanggal(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        $bulanx = $request['bulan'];
        $tahunx = $request['tahun'];
        $bayar = '';

        if (isset($request['bayar']) && $request['bayar'] != "" && $request['bayar'] != "undefined" && $request['bayar']==2) {
            $bayar = ' and sbmcr.objectcarabayarfk = 3';
        } else if (isset($request['bayar']) && $request['bayar'] != "" && $request['bayar'] != "undefined" && $request['bayar']==1) {
            $bayar = ' and sbmcr.objectcarabayarfk = 1';
        } else if (isset($request['bayar']) && $request['bayar'] != "" && $request['bayar'] != "undefined" && $request['bayar']==3) {
            $bayar = ' and sbmcr.objectcarabayarfk is null';
        } else if (isset($request['bayar']) && $request['bayar'] != "" && $request['bayar'] != "undefined" && $request['bayar']==4) {
            $bayar = ' and sbmcr.objectcarabayarfk in (1,3)';
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
        sum(jumlahlainlain) jumlahlainlain, sum(jumlahtotal) jumlahtotal
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
        case when x.uraian = 'JUMLAH' then sum(x.totalfix) else 0 end as jumlahtotal
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
                    stsd.kolom1, stsd.kolom2
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
                    group by sts.tglpenerimaan, stsd.kdrekening, stsd.nomer, stsd.uraian, stsd.vol, stsd.norec,
                    stsd.kolom1, stsd.kolom2
                    order by min(stsd.nourut)
                ) as i group by i.tglpenerimaan, i.kdrekening, i.nomer, i.uraian
            ) as x group by x.tanggal, x.uraian
        ) as y group by extract(day from tanggal) order by tanggal"));

        $result = array(
            'detail' => $data,
        );
        
        return $this->setStatusCode(201)->respond($result, 'tes msg');
    }
}