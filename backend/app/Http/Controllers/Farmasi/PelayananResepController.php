<?php

//“Great men are not born great, they grow great . . .”
//― Mario Puzo, The Godfather
/**
 * FarmasiController
 * Created by PhpStorm.
 * User: as@epic
 * Date: 08/08/2017
 * Time: 12:48
 */
/**
 * Created by PhpStorm.
 * User: nengepic
 * Date: 09/08/2019
 * Time: 10:27
 */

namespace App\Http\Controllers\Farmasi;

use App\Http\Controllers\ApiController;
use App\Master\DiklatKategory;
use App\Master\SatuanResep;
use App\Transaksi\LoggingUser;
use App\Transaksi\OrderPelayanan;
use App\Transaksi\PasienDaftar;
use App\Transaksi\PelayananPasienObatKronis;
use App\Transaksi\StrukOrderBatalVerif;
use App\Transaksi\StrukOrderBatalVerifDetail;
use Illuminate\Http\Request;
use App\Traits\Valet;
use DB;

use App\Transaksi\StrukOrder;
use App\Transaksi\StrukResep;
use App\Master\Pegawai;
use App\Master\LoginUser;
use App\Transaksi\PelayananPasien;
use App\Transaksi\PelayananPasienDetail;
use App\Transaksi\StokProdukDetail;
use App\Transaksi\KartuStok;
use App\Transaksi\PelayananPasienPetugas;
use App\Transaksi\StrukRetur;
use App\Transaksi\PelayananPasienRetur;
use App\Transaksi\AntrianApotik;



class PelayananResepController extends ApiController
{
    use Valet;

    public function __construct()
    {
        parent::__construct($skip_authentication = false);
    }
    public function getDataPengkajian(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin = $request->all();
        $results = DB::select(DB::raw("select pd.norec as norec_pd,pd.noregistrasi,kp.kelompokpasien,rk.namarekanan,pv.beratbadan,
            pg.id as pgid, pg.namalengkap as namadokterdpjp
            from pasiendaftar_t as pd
            left JOIN kelompokpasien_m as kp on kp.id=pd.objectkelompokpasienlastfk
            left JOIN rekanan_m as rk on rk.id=pd.objectrekananfk
            left JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
            left JOIN pegawai_m as pg on pg.id=apd.objectpegawaifk
            left JOIN paptandavital_t as pv on pv.objectpasienfk=apd.norec
            where apd.kdprofile = $idProfile and apd.norec=:norec_apd;"),
            array(
                'norec_apd' => $request['norec_apd'],
            )
        );



        $result = array(
            'detailPD' => $results,
//            'datalogin' => $dataPegawaiUser,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }
    public function getTransaksiPelayananApotik(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $detail=$request->all();
        $result=[];
        $data = \DB::table('pelayananpasien_t as pp')
            ->JOIN('antrianpasiendiperiksa_t as apd','apd.norec','=','pp.noregistrasifk')
            ->JOIN('pasiendaftar_t as pd','pd.norec','=','apd.noregistrasifk')
            ->JOIN('pasien_m as ps','ps.id','=','pd.nocmfk')
            ->JOIN('jeniskelamin_m as jk','jk.id','=','ps.objectjeniskelaminfk')
            ->JOIN('produk_m as pr','pr.id','=','pp.produkfk')
            ->JOIN('ruangan_m as ru','ru.id','=','apd.objectruanganfk') /* ruangan pasien*/ 
            ->JOIN('jeniskemasan_m as jkm','jkm.id','=','pp.jeniskemasanfk')
            ->leftJoin('jenisracikan_m as jra','jra.id','=','pp.jenisobatfk')
            ->leftJoin('satuanstandar_m as ss','ss.id','=','pp.satuanviewfk')
            ->leftJoin('satuanstandar_m as ss2','ss2.id','=','pr.objectsatuanstandarfk')
            ->JOIN('detailjenisproduk_m as djp','djp.id','=','pr.objectdetailjenisprodukfk')
            ->JOIN('jenisproduk_m as jp','jp.id','=','djp.objectjenisprodukfk')
            ->leftJOIN('strukpelayanan_t as sp','sp.norec','=','pp.strukfk')
            ->leftJOIN('konversisatuan_t as ks', function($join){
                $join->on('ks.objekprodukfk', '=', 'pr.id')
                    ->on('ks.satuanstandar_tujuan', '=', 'pp.satuanviewfk');
            })
            ->leftJOIN('strukresep_t as sr','sr.norec','=','pp.strukresepfk')
            ->leftJOIN('ruangan_m as ru2','ru2.id','=','sr.ruanganfk') /* ruangan depo*/ 
            ->leftJOIN('pegawai_m as dok','dok.id','=','sr.penulisresepfk')
            ->leftJOIN('rm_sediaan_m AS rs','rs.id','=','pr.objectsediaanfk')
            ->leftJoin('satuanresep_m as sn','sn.id','=','pp.satuanresepfk')
            ->select('ps.nocm','ps.namapasien','jk.jeniskelamin','pp.tglpelayanan','pp.produkfk','pr.namaproduk',
                'ss.satuanstandar','pp.jumlah','pp.hargasatuan','pp.hargadiscount','sp.nostruk','pd.noregistrasi',
                'ks.nilaikonversi','ss2.satuanstandar as satuanstandar2','sr.noresep','sr.norec as norec_resep','pp.rke',
                'jkm.jeniskemasan','jk.id as jkid','pp.jenisobatfk','jra.jenisracikan','pp.jasa','ru2.id as namaruanganasalid','ru2.id as ruangandepoid','ru2.namaruangan as ruangandepo',
                'pp.aturanpakai','ru.namaruangan','dok.id as dokterid','dok.namalengkap as dokter','pp.ispagi','pp.issiang','pp.ismalam','pp.issore','pp.iskronis','sr.isreseppulang as reseppulang',
                DB::raw("CASE WHEN pr.kekuatan IS NOT NULL AND rs.name IS NOT NULL THEN pr.kekuatan || ' ' || rs.name ELSE '' END AS kekuatan,
                               sn.satuanresep,pp.satuanresepfk,pp.tglkadaluarsa,pp.dosis,djp.detailjenisproduk,jp.jenisproduk,apd.norec norec_apd,pd.norec norec_pd,apd.objectkelasfk klid,pp.keteranganpakai"))
            ->where('pp.kdprofile', $idProfile)
            ->where('jp.id',97)
            ->where('sr.statusenabled', true)
            ->where('pd.statusenabled', true)
            ->orderBy('pp.tglpelayanan','pp.rke');
        if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('ps.nocm','=', $request['nocm']);
        }
        // if(isset($request['noregistrasifk']) && $request['noregistrasifk']!="" && $request['noregistrasifk']!="undefined"){
        //     $data = $data->where('pp.noregistrasifk','=', $request['noregistrasifk']);
        // }
        if(isset($request['noReg']) && $request['noReg']!="" && $request['noReg']!="undefined"){
            $data = $data->where('pd.noregistrasi','=', $request['noReg']);
        }
        if(isset($request['norec_resep']) && $request['norec_resep']!="" && $request['norec_resep']!="undefined"){
            $data = $data->where('sr.norec','=', $request['norec_resep']);
        }
        if(isset($request['tglAwal']) && $request['tglAwal']!="" && $request['tglAwal']!="undefined"){
            $data = $data->where('pp.tglpelayanan','>=', $request['tglAwal']);
        }
        if(isset($request['tglAkhir']) && $request['tglAkhir']!="" && $request['tglAkhir']!="undefined"){
            $tgl= $request['tglAkhir'];
            $data = $data->where('pp.tglpelayanan','<=', $tgl);
        }
        if(isset($request['dokter']) && $request['dokter']!="" && $request['dokter']!="undefined"){
            $data = $data->where('dok.id','=', $request['dokter']);
        }
        if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
            $data = $data->where('ru.id','=', $request['ruangan']);
        }
        if (isset($request['nik']) && $request['nik'] != '') {
            $data = $data->where('ps.noidentitas', $request['nik']);
        }
        $data = $data->get();

        $rke=0;
        foreach ($data as $item){
            if (isset($item->nilaikonversi)){
                $nKonversi = $item->nilaikonversi;
            }else{
                $nKonversi=1;
            }
            if (isset($item->satuanstandar)){
                $ss = $item->satuanstandar;
            }else{
                $ss = $item->satuanstandar2;
            }
            $JenisKemasan=$item->jeniskemasan;
            if(isset($item->jenisracikan)){
                $JenisKemasan=$item->jeniskemasan .'/'. $item->jenisracikan;
            }
//            $tarifjasa =0;
//            $qty20 =0;
//            if ($item->jkid == 2){
//                $tarifjasa = 800;
//            }
////            $rke = 0;
//            if ($item->rke != $rke) {
//                if ($item->jkid == 1) {
//                    $rke=$item->rke;
//                    $qty20 = number_format($item->jumlah / 20, 0);
//                    if ($item->jumlah % 20 == 0) {
//                        $qty20 = $qty20;
//                    } else {
//                        $qty20 = $qty20 + 1;
//                    }
//
//                    $tarifjasa = 800 * $qty20;
//                }
//            }
            $jasa=0;
            if(isset($item->jasa) && $item->jasa!="" && $item->jasa!="undefined"){
                $jasa=$item->jasa;
            }

            $result[]=array(
                'nocm' => $item->nocm,
                'namapasien' => $item->namapasien,
                'jeniskelamin' => $item->jeniskelamin,
                'tglpelayanan' => $item->tglpelayanan,
                'produkfk' => $item->produkfk,
                'namaproduk' => $item->namaproduk,
                'satuanstandar' => $ss,
                'jumlah' => (float)$item->jumlah / (float)$nKonversi,
                'hargasatuan' => $item->hargasatuan,
                'hargadiscount' => $item->hargadiscount,
                'nostruk' => $item->nostruk,
                'noregistrasi' => $item->noregistrasi,
                'noresep' => $item->noresep,// .'/'.$item->noregistrasi,
                'rke' => $item->rke,
                'jeniskemasan' => $JenisKemasan,
                'norec_resep' =>  $item->norec_resep,
                'norec_apd' =>  $item->norec_apd,
                'detail' => $detail,
                'jasa' =>$jasa,
                'ruangandepoid' => $item->ruangandepoid,
                'namaruangandepo' => $item->ruangandepo,
                'aturanpakai' => $item->aturanpakai,
                'dokter' => $item->dokter,
                'dokterid' => $item->dokterid,
                'pemberiresep' => $item->dokter,
                'namaruanganasalid' => $item->namaruanganasalid,
                'namaruangan' => $item->namaruangan,
                'kekuatan' => $item->kekuatan,
                'ispagi' => $item->ispagi,
                'issiang' => $item->issiang,
                'ismalam' => $item->ismalam,
                'issore' => $item->issore,
                'iskronis' => $item->iskronis,
                'satuanresepfk' => $item->satuanresepfk,
                'satuanresep' => $item->satuanresep,
                'tglkadaluarsa' => $item->tglkadaluarsa,
                'dosis' => $item->dosis,
                'detailjenisproduk' => $item->detailjenisproduk,
                'jenisproduk' => $item->jenisproduk,
                'reseppulang' =>$item->reseppulang,
                'norec_pd' => $item->norec_pd,
                'klid' => $item->klid,
                'keteranganpakai' => $item->keteranganpakai,
                
            );
        }
        return $this->respond($result);
    }

    public function getDetailRegApotik(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $data = \DB::table('pasiendaftar_t as pd')
            ->leftjoin('antrianpasiendiperiksa_t as apd','pd.norec','=','apd.noregistrasifk')
            ->JOIN('ruangan_m as ru','ru.id','=','apd.objectruanganfk')
            ->JOIN('departemen_m as dp','dp.id','=','ru.objectdepartemenfk')
            ->leftJOIN('pegawai_m as pg','pg.id','=','apd.objectpegawaifk')
//            ->JOIN ('pasien_m as ps','ps.id','=','pd.nocmfk')
//            ->leftJoin('jeniskelamin_m as jk','jk.id','=','ps.objectjeniskelaminfk')
//            ->JOIN('kelompokpasien_m as kp','kp.id','=','pd.objectkelompokpasienlastfk')
//            ->leftJoin('rekanan_m as rk','rk.id','=','pd.objectrekananfk')
            ->JOIN('kelas_m as kl','kl.id','=','apd.objectkelasfk')
//            ->select('ru.namaruangan','pd.noregistrasi','ps.nocm','ps.namapasien','jk.jeniskelamin',
//                'kp.id as kpid','kp.kelompokpasien','rk.namarekanan','kl.namakelas','kl.id as klid',
//                'pd.tglregistrasi','pd.tglpulang','ps.tgllahir','rpp.noregistrasifk as rpp','pd.nostruklastfk')

            ->select('ru.namaruangan','pd.noregistrasi',
                'pd.tglregistrasi','pg.namalengkap as namadokter','kl.namakelas','apd.tglmasuk','apd.tglkeluar','apd.norec','pg.id as pgid')
            ->where('pd.kdprofile',$idProfile)
            ->whereNotIn('dp.id',array(14,41,36))
            ->orderBy('apd.tglmasuk');
            /* 
            agar user ga milih farmasi, input obat kunjungan farmasi/apotik hanya untuk obat bebas, selain itu harus milih sesuai ruangan pelayanan/kunjungan pasien
            14=>farmasi
            41=>Logistik
            36=>umum
            */
        if(isset($request['noregistrasi']) && $request['noregistrasi']!="" && $request['noregistrasi']!="undefined"){
            $data = $data->where('pd.noregistrasi','ilike','%'. $request['noregistrasi'].'%');
        }
//        $data = $data->where('dp.id','=',16);
//        $data = $data->whereNull('pd.tglpulang');
//        $data = $data->where('pd.tglregistrasi','>','2019-05-25 00:00');
//        $data = $data->take(50);
        $data = $data->get();
        return $this->respond($data);
    }
    public function getDaftarPaketObatPasien(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin = $request->all();
        $dataRuangan = \DB::table('maploginusertoruangan_s as mlu')
            ->JOIN('ruangan_m as ru','ru.id','=','mlu.objectruanganfk')
            ->select('ru.id')
            ->where('mlu.objectloginuserfk',$dataLogin['userData']['id'])
            ->get();
        $strRuangan = [];
        foreach ($dataRuangan as $epic){
            $strRuangan[] = $epic->id;
        }
        $data = [];
        $data = \DB::table('strukkirim_t as sp')
            ->LEFTJOIN('pegawai_m as pg','pg.id','=','sp.objectpegawaipengirimfk')
            ->LEFTJOIN('ruangan_m as ru','ru.id','=','sp.objectruanganasalfk')
            ->LEFTJOIN('ruangan_m as ru2','ru2.id','=','sp.objectruangantujuanfk')
            ->LEFTJOIN('antrianpasiendiperiksa_t as apd','apd.norec','=','sp.noregistrasifk')
            ->LEFTJOIN('pasiendaftar_t as pd','pd.norec','=','apd.noregistrasifk')
            ->LEFTJOIN('pasien_m as ps','ps.id','=','pd.nocmfk')
            ->select('sp.norec','sp.tglkirim','sp.nokirim','sp.jenispermintaanfk','pg.namalengkap',
                'ru.namaruangan as ruanganasal','ru2.namaruangan as ruangantujuan','sp.keteranganlainnyakirim','ps.namapasien',
                'pd.noregistrasi','sp.noregistrasifk'
            )
            ->where('sp.kdprofile',$idProfile);

        if(isset($request['tglAwal']) && $request['tglAwal']!="" && $request['tglAwal']!="undefined"){
            $data = $data->where('sp.tglkirim','>=', $request['tglAwal']);
        }
        if(isset($request['tglAkhir']) && $request['tglAkhir']!="" && $request['tglAkhir']!="undefined"){
            $tgl= $request['tglAkhir'];
            $data = $data->where('sp.tglkirim','<=', $tgl);
        }
        if(isset($request['nokirim']) && $request['nokirim']!="" && $request['nokirim']!="undefined"){
            $data = $data->where('sp.nokirim','ilike','%'. $request['nokirim']);
        }
        if(isset($request['ruangantujuanfk']) && $request['ruangantujuanfk']!="" && $request['ruangantujuanfk']!="undefined"){
            $data = $data->where('ru2.id','=', $request['ruangantujuanfk']);
        }
        if(isset($request['noregistrasi']) && $request['noregistrasi']!="" && $request['noregistrasi']!="undefined"){
            $data = $data->where('pd.noregistrasi','=', $request['noregistrasi']);
        }
        $data = $data->where('sp.statusenabled',true);
        $data = $data->where('sp.objectkelompoktransaksifk',34);
//        $data = $data->wherein('sp.objectruanganasalfk',$strRuangan);
        $data = $data->wherenotnull('sp.noregistrasifk');
        $data = $data->where('sp.noregistrasifk','<>','0');
        $data = $data->orderBy('sp.nokirim');
        $data = $data->get();

        $results =array();
        foreach ($data as $item){
            $details = DB::select(DB::raw("
                     select  pr.namaproduk,
                    ss.satuanstandar,spd.qtyproduk
                     from kirimproduk_t as spd 
                    left JOIN produk_m as pr on pr.id=spd.objectprodukfk
                    left JOIN satuanstandar_m as ss on ss.id=spd.objectsatuanstandarfk
                    where spd.kdprofile = $idProfile nokirimfk=:norec and spd.qtyproduk <> 0"),
                array(
                    'norec' => $item->norec,
                )
            );
            $jeniskirim ='';
            if ($item->jenispermintaanfk == 1){
                $jeniskirim ='Amprahan';
            }
            if ($item->jenispermintaanfk == 2){
                $jeniskirim ='Transfer';
            }
            $results[] = array(
                'status' => 'Kirim Barang',
                'tglstruk' => $item->tglkirim,
                'nostruk' => $item->nokirim,
                'jeniskirim' => $jeniskirim,
                'norec' => $item->norec,
                'namaruanganasal' => $item->ruanganasal,
                'namaruangantujuan' => $item->ruangantujuan,
                'petugas' => $item->namalengkap,
                'keterangan' => $item->keteranganlainnyakirim,
                'namapasien' => $item->namapasien,
                'noregistrasi' => $item->noregistrasi,
                'norec_apd' => $item->noregistrasifk,
                'details' => $details,
            );
        }

        $result = array(
            'daftar' => $results,
            'datalogin' => $dataLogin,
            'message' => 'as@epic',
            'str' => $strRuangan,
        );

        return $this->respond($result);
    }

    public function DeletePelayananObat(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        //## StrukResep
        DB::beginTransaction();
        $r_SR=$request->all();
        try {
            $dataPasien = \DB::table('strukresep_t as sr')
                ->JOIN('antrianpasiendiperiksa_t as apd','apd.norec','=','sr.pasienfk')
                ->JOIN('pasiendaftar_t as pd','pd.norec','=','apd.noregistrasifk')
                ->JOIN('pasien_m as pm','pm.id','=','pd.nocmfk')
                ->select('pm.namapasien', 'sr.noresep','pm.nocm')
                ->where('sr.kdprofile',$idProfile)
                ->where('sr.norec',$r_SR['norec'])
                ->first();

            $dataKs = KartuStok::where('keterangan',  'Pelayanan Obat Alkes '.' '. $dataPasien->noresep .' '. $dataPasien->nocm .' '. $dataPasien->namapasien)
                ->where('kdprofile', $idProfile)
                ->update([
                    'flagfk' => null
                ]);

            $newSR = StrukResep::where('norec',$r_SR['norec'])->where('kdprofile', $idProfile)->first();
            if(isset($request['norec_order'])){
                $newSR->orderfk = null;
            }

            $newSR->statusenabled = false;
            $newSR->save();

            $norec_SR = $newSR->norec;
            $tgl_SR = $newSR->tglresep;
            $idRuangan_SR = $newSR->ruanganfk;

            //## PelayananPasien

            $newPP = PelayananPasien::where('strukresepfk', $norec_SR)->where('kdprofile', $idProfile)->get();
            $newPP2 =$newPP;
            foreach ($newPP as $r_PPL){
                $norec_PP = $r_PPL->norec;
                $newPPD = PelayananPasienDetail::where('pelayananpasien', $norec_PP)->where('kdprofile', $idProfile)->delete();
                $newP3 = PelayananPasienPetugas::where('pelayananpasien', $norec_PP)->where('kdprofile', $idProfile)->delete();

                $qtyJumlah = (float)$r_PPL['jumlah'] ;//* (float)$r_PPL['nilaikonversi'];

                //## StokProdukDetail
                $produk = $r_PPL['produkfk'];
                $dataSaldoAwal = collect(DB::select("select sum(qtyproduk) as qty from stokprodukdetail_t 
                    where kdprofile = $idProfile and objectruanganfk='$idRuangan_SR' and objectprodukfk=$r_PPL[produkfk]")
                )->first();

//                if ($r_PPL->produkfk != $produkJasa) {
                    $saldoAwal = (float)$dataSaldoAwal->qty + $qtyJumlah;
                    $GetNorec = StokProdukDetail::where('nostrukterimafk',$r_PPL['strukterimafk'])
                        ->where('kdprofile', $idProfile)
                        ->where('objectruanganfk',$idRuangan_SR)
                        ->where('objectprodukfk',$produk)
                        ->orderBy('tglpelayanan', 'desc')
                        ->first();

                    $jmlPengurang =(float)$qtyJumlah;
                    DB::table('stokprodukdetail_t')
                        ->where('kdprofile', $idProfile)
                        ->where('norec',$GetNorec->norec)
                        ->sharedLock()
                        ->increment('qtyproduk', (float)$jmlPengurang);

                    //## KartuStok
                    $newKS = new KartuStok();
                    $norecKS = $newKS->generateNewId();
                    $newKS->norec = $norecKS;
                    $newKS->kdprofile = $idProfile;
                    $newKS->statusenabled = true;
                    $newKS->jumlah = $qtyJumlah ;
                    $newKS->keterangan = 'Hapus Resep Pelayanan Obat Alkes ';
                    $newKS->produkfk = $r_PPL['produkfk'];
                    $newKS->ruanganfk = $idRuangan_SR;
                    $newKS->saldoawal = (float)$saldoAwal;// 0 (float)$qtyJumlah;
                    $newKS->status = 1;
                    $newKS->tglinput = date('Y-m-d H:i:s');
                    $newKS->tglkejadian = date('Y-m-d H:i:s');
                    $newKS->nostrukterimafk =  $r_PPL['strukterimafk'];
                    $newKS->norectransaksi = $norec_PP;
                    $newKS->tabletransaksi = 'pelayananpasien_t';
                    //          $newKS->flagfk = 8;
                    $newKS->save();
//                }
            }

            if(isset($request['norec_order'])){
                $sOrder = StrukOrder::where('norec',$request['norec_order'])
                    ->where('kdprofile', $idProfile)
                    ->update([
                        'statusorder'=>null,
                        'namapengambilorder'=>null,
                        'tglambilorder'=>null
                    ]);
                $antrianApotik = AntrianApotik::where('noresep',$newSR->noresep)->where('kdprofile', $idProfile)->delete();
            }

            $newPP = PelayananPasien::where('strukresepfk', $norec_SR)->where('kdprofile', $idProfile)->delete();
//            $ppKronis = PelayananPasienObatKronis::where('strukresepfk', $norec_SR)->where('kdprofile', $idProfile)->delete();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Hapus Pelayanan Resep Pasien";
            $errMsg = $e->getMessage();
            $errLine = $e->getLine();
        }

        if ($transStatus == 'true') {
            $transMessage = "Hapus Pelayanan Apotik Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "stokprodukdetail" => $GetNorec,//$noResep,,//$noResep,
                "kartustok" => $newKS,//$noResep,,//$noResep,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Hapus Pelayanan Apotik Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
//                "noresep" => $newSR,//$noResep,
//                "stokprodukdetail" => $dataSPD,//$noResep,,//$noResep,
//                "kartustok" => $newKS,//$noResep,,//$noResep,
//                "pelayananpasien" => $newPP2,
                "as" => 'as@epic',
                "errMsg" => $errMsg ,
                "errLine" => $errLine , 
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function DeletePelayananObatKronis(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        //## StrukResep
        DB::beginTransaction();
        $r_SR=$request->all();
        try {
            $dataPasien = \DB::table('strukresep_t as sr')
                ->JOIN('antrianpasiendiperiksa_t as apd','apd.norec','=','sr.pasienfk')
                ->JOIN('pasiendaftar_t as pd','pd.norec','=','apd.noregistrasifk')
                ->JOIN('pasien_m as pm','pm.id','=','pd.nocmfk')
                ->select('pm.namapasien', 'sr.noresep','pm.nocm')
                ->where('sr.kdprofile',$idProfile)
                ->where('sr.norec',$r_SR['norec'])
                ->first();

            $dataKs = KartuStok::where('keterangan',  'Pelayanan Obat Alkes '.' '. $dataPasien->noresep .' '. $dataPasien->nocm .' '. $dataPasien->namapasien)
                ->where('kdprofile', $idProfile)
                ->update([
                    'flagfk' => null
                ]);

            $newSR = StrukResep::where('norec',$r_SR['norec'])->where('kdprofile', $idProfile)->first();
            if(isset($request['norec_order'])){
                $newSR->orderfk = null;
            }

            $newSR->statusenabled = false;
            $newSR->save();

            $norec_SR = $newSR->norec;
            $tgl_SR = $newSR->tglresep;
            $idRuangan_SR = $newSR->ruanganfk;

            //## PelayananPasien

            $newPP = PelayananPasienObatKronis::where('strukresepfk', $norec_SR)->where('kdprofile', $idProfile)->get();
            $newPP2 =$newPP;
            foreach ($newPP as $r_PPL){
                $norec_PP = $r_PPL->norec;
//                $newPPD = PelayananPasienDetail::where('pelayananpasien', $norec_PP)->where('kdprofile', $idProfile)->delete();
//                $newP3 = PelayananPasienPetugas::where('pelayananpasien', $norec_PP)->where('kdprofile', $idProfile)->delete();

                $qtyJumlah = (float)$r_PPL['jumlah'] * (float)$r_PPL['nilaikonversi'];

                //## StokProdukDetail
                $produk = $r_PPL['produkfk'];
                $dataSaldoAwal = collect(DB::select("select sum(qtyproduk) as qty from stokprodukdetail_t 
                    where kdprofile = $idProfile and objectruanganfk='$idRuangan_SR' and objectprodukfk=$r_PPL[produkfk]")
                )->first();

                $saldoAwal = (float)$dataSaldoAwal->qty + $qtyJumlah;
                $GetNorec = StokProdukDetail::where('nostrukterimafk',$r_PPL['strukterimafk'])
                    ->where('kdprofile', $idProfile)
                    ->where('objectruanganfk',$idRuangan_SR)
                    ->where('objectprodukfk',$produk)
                    ->orderBy('tglpelayanan', 'desc')
                    ->first();

                $jmlPengurang =(float)$qtyJumlah;
                DB::table('stokprodukdetail_t')
                    ->where('kdprofile', $idProfile)
                    ->where('norec',$GetNorec->norec)
                    ->sharedLock()
                    ->increment('qtyproduk', (float)$jmlPengurang);

                //## KartuStok
                $newKS = new KartuStok();
                $norecKS = $newKS->generateNewId();
                $newKS->norec = $norecKS;
                $newKS->kdprofile = $idProfile;
                $newKS->statusenabled = true;
                $newKS->jumlah = $qtyJumlah ;
                $newKS->keterangan = 'Hapus Resep Pelayanan Obat Kronis ';
                $newKS->produkfk = $r_PPL['produkfk'];
                $newKS->ruanganfk = $idRuangan_SR;
                $newKS->saldoawal = (float)$saldoAwal;// 0 (float)$qtyJumlah;
                $newKS->status = 1;
                $newKS->tglinput = date('Y-m-d H:i:s');
                $newKS->tglkejadian = date('Y-m-d H:i:s');
                $newKS->nostrukterimafk =  $r_PPL['strukterimafk'];
                $newKS->norectransaksi = $norec_PP;
                $newKS->tabletransaksi = 'pelayananpasien_t';
//          $newKS->flagfk = 8;
                $newKS->save();
            }



//            $newPP = PelayananPasien::where('strukresepfk', $norec_SR)->where('kdprofile', $idProfile)->delete();
            $ppKronis = PelayananPasienObatKronis::where('strukresepfk', $norec_SR)->where('kdprofile', $idProfile)->delete();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transError = $e->getMessage();
        }

        if ($transStatus == 'true') {
            $transMessage = "Hapus Pelayanan Apotik Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "stokprodukdetail" => $GetNorec,//$noResep,,//$noResep,
                "kartustok" => $newKS,//$noResep,,//$noResep,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Hapus Pelayanan Apotik Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "e"  => $transError,
//                "noresep" => $newSR,//$noResep,
//                "stokprodukdetail" => $dataSPD,//$noResep,,//$noResep,
//                "kartustok" => $newKS,//$noResep,,//$noResep,
//                "pelayananpasien" => $newPP2,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDataCombo(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin = $request->all();
        $dataPenulis = Pegawai::where('statusenabled',true)
            ->where('objectjenispegawaifk',1)
            ->get();
        foreach ($dataPenulis as $item){
            $dataPenulis2[]=array(
                'id' => $item->id,
                'namalengkap' => $item->namalengkap,
            );
        }
        $dataSigna = \DB::table('stigma as st')
            ->select('st.id','st.name')
            ->orderBy('st.name')
            ->get();
        $dataRuangan =[];
        $dataRuangan = \DB::table('maploginusertoruangan_s as mlu')
            ->JOIN('ruangan_m as ru','ru.id','=','mlu.objectruanganfk')
            ->select('ru.id','ru.namaruangan')
            ->where('mlu.kdprofile', $idProfile)
            ->where('ru.statusenabled', true)
            ->where('mlu.objectloginuserfk',$request['userData']['id'])
            ->get();
        $dataRuanganFamasi=[];

        $dataRuanganFamasi = \DB::table('ruangan_m as ru')
            ->select('ru.id','ru.namaruangan')
            ->where('ru.kdprofile', $idProfile)
            ->where('ru.objectdepartemenfk',$this->settingDataFixed('kdDepartemenFarmasi',$idProfile))
            ->where('ru.statusenabled',true)
            ->orderBy('ru.namaruangan')
            ->get();

        $dataJenisKemasan = \DB::table('jeniskemasan_m as jk')
            ->select('jk.id','jk.jeniskemasan')
            ->where('jk.statusenabled',true)
            ->get();
        $dataJenisRacikan = \DB::table('jenisracikan_m as jk')
            ->select('jk.id','jk.jenisracikan')
            ->where('jk.statusenabled',true)
            ->get();

//        foreach ($dataRuangan as $lalala){
//            $ruFilter[]=array($lalala->id);
//        }
        $kdjenisobat = explode (',',$this->settingDataFixed('kdJenisProdukObat',$idProfile));
        $arrkdjenisobat = [];
        foreach ($kdjenisobat as $it){
            $arrkdjenisobat []=  (int)$it;
        }
     
        $dataProduk = \DB::table('produk_m as pr')
            ->JOIN('detailjenisproduk_m as djp','djp.id','=','pr.objectdetailjenisprodukfk')
            ->JOIN('jenisproduk_m as jp','jp.id','=','djp.objectjenisprodukfk')
            ->leftJOIN('satuanstandar_m as ss','ss.id','=','pr.objectsatuanstandarfk')
            ->JOIN('stokprodukdetail_t as spd','spd.objectprodukfk','=','pr.id')
            ->select('pr.id','pr.namaproduk','ss.id as ssid','ss.satuanstandar')
            ->where('pr.kdprofile', $idProfile)
            ->where('pr.statusenabled',true)
            // ->whereIn('jp.id',[97,283])
            ->whereIn('jp.id',$arrkdjenisobat)
            ->where('spd.qtyproduk','>',0)
            ->groupBy('pr.id','pr.namaproduk','ss.id','ss.satuanstandar')
            ->orderBy('pr.namaproduk')
            ->get();

        $dataProdukAll = \DB::table('produk_m as pr')
            ->JOIN('detailjenisproduk_m as djp','djp.id','=','pr.objectdetailjenisprodukfk')
            ->JOIN('jenisproduk_m as jp','jp.id','=','djp.objectjenisprodukfk')
            ->leftJOIN('satuanstandar_m as ss','ss.id','=','pr.objectsatuanstandarfk')
            ->JOIN('stokprodukdetail_t as spd','spd.objectprodukfk','=','pr.id')
            ->select('pr.id','pr.namaproduk','ss.id as ssid','ss.satuanstandar')
            ->where('pr.kdprofile', $idProfile)
            ->where('pr.statusenabled',true)
            // ->whereIn('jp.id',[97,283])
            ->whereIn('jp.id',$arrkdjenisobat)
            ->groupBy('pr.id','pr.namaproduk','ss.id','ss.satuanstandar')
            ->orderBy('pr.namaproduk')
            ->get();

        $dataProduk1 = \DB::table('produk_m as pr')
            ->JOIN('detailjenisproduk_m as djp','djp.id','=','pr.objectdetailjenisprodukfk')
            ->JOIN('jenisproduk_m as jp','jp.id','=','djp.objectjenisprodukfk')
            ->leftJOIN('satuanstandar_m as ss','ss.id','=','pr.objectsatuanstandarfk')
            ->JOIN('stokprodukdetail_t as spd','spd.objectprodukfk','=','pr.id')
            ->select('pr.id','pr.namaproduk','ss.id as ssid','ss.satuanstandar')
            ->where('pr.kdprofile', $idProfile)
            ->where('pr.statusenabled',true)
            ->whereIn('jp.id',[97,283])
//	         ->where('spd.qtyproduk','>',0)
            ->groupBy('pr.id','pr.namaproduk','ss.id','ss.satuanstandar')
            ->orderBy('pr.namaproduk')
            ->get();

        $dataAsalProduk = \DB::table('asalproduk_m as ap')
            ->JOIN('stokprodukdetail_t as spd','spd.objectasalprodukfk','=','ap.id')
            ->select('ap.id','ap.asalproduk')
            ->where('ap.statusenabled',true)
            ->orderBy('ap.id')
            ->groupBy('ap.id','ap.asalproduk')
            ->get();

        $dataRoute = \DB::table('routefarmasi as rt')
            ->select('rt.id','rt.name')
            ->where('rt.statusenabled',true)
            ->orderBy('rt.id')
            ->get();
        $dataKelas = \DB::table('kelas_m as rt')
            ->select('rt.id','rt.namakelas')
            ->where('rt.statusenabled',true)
            ->orderBy('rt.id')
            ->get();

        $dataKonversiProduk = \DB::table('konversisatuan_t as ks')
            ->JOIN('satuanstandar_m as ss','ss.id','=','ks.satuanstandar_asal')
            ->JOIN('satuanstandar_m as ss2','ss2.id','=','ks.satuanstandar_tujuan')
            ->select('ks.objekprodukfk','ks.satuanstandar_asal','ss.satuanstandar','ks.satuanstandar_tujuan','ss2.satuanstandar as satuanstandar2',
                'ks.nilaikonversi')
            ->where('ks.kdprofile', $idProfile)
            ->where('ks.statusenabled',true)
            ->get();

        $dataTarifAdminResep = \DB::table('settingdatafixed_m as rt')
            ->select('rt.namafield','rt.nilaifield')
            ->where('rt.statusenabled',true)
            ->where('rt.namafield','tarifadminresep')
            ->orderBy('rt.id')
            ->first();


        $dataProdukResult=[];
        foreach ($dataProduk as $item){
            $satuanKonversi=[];
            foreach ($dataKonversiProduk  as $item2){
                if ($item->id == $item2->objekprodukfk){
                    $satuanKonversi[] =array(
                        'ssid' =>   $item2->satuanstandar_tujuan,
                        'satuanstandar' =>   $item2->satuanstandar2,
                        'nilaikonversi' =>   $item2->nilaikonversi,
                    );
                }
            }

            $dataProdukResult[]=array(
                'id' =>   $item->id,
                'namaproduk' =>   $item->namaproduk,
                'ssid' =>   $item->ssid,
                'satuanstandar' =>   $item->satuanstandar,
                'konversisatuan' => $satuanKonversi,
            );
        }
        $dataProdukResult1=[];
        foreach ($dataProduk1 as $item){
            $satuanKonversi=[];
            foreach ($dataKonversiProduk  as $item2){
                if ($item->id == $item2->objekprodukfk){
                    $satuanKonversi[] =array(
                        'ssid' =>   $item2->satuanstandar_tujuan,
                        'satuanstandar' =>   $item2->satuanstandar2,
                        'nilaikonversi' =>   $item2->nilaikonversi,
                    );
                }
            }

            $dataProdukResult1[]=array(
                'id' =>   $item->id,
                'namaproduk' =>   $item->namaproduk,
                'ssid' =>   $item->ssid,
                'satuanstandar' =>   $item->satuanstandar,
                'konversisatuan' => $satuanKonversi,
            );
        }
        $dataProdukResultAll=[];
        foreach ($dataProdukAll as $item){
            $satuanKonversi=[];
            foreach ($dataKonversiProduk  as $item2){
                if ($item->id == $item2->objekprodukfk){
                    $satuanKonversi[] =array(
                        'ssid' =>   $item2->satuanstandar_tujuan,
                        'satuanstandar' =>   $item2->satuanstandar2,
                        'nilaikonversi' =>   $item2->nilaikonversi,
                    );
                }
            }

            $dataProdukResultAll[]=array(
                'id' =>   $item->id,
                'namaproduk' =>   $item->namaproduk,
                'ssid' =>   $item->ssid,
                'satuanstandar' =>   $item->satuanstandar,
                'konversisatuan' => $satuanKonversi,
            );
        }

        $dataPegawaiUser = DB::select(DB::raw("select pg.id,pg.namalengkap from loginuser_s as lu
                INNER JOIN pegawai_m as pg on lu.objectpegawaifk=pg.id
                where lu.kdprofile = $idProfile and lu.id=:idLoginUser"),
            array(
                'idLoginUser' => $dataLogin['userData']['id'],
            )
        );
        
        $dataDokter = \DB::table('pegawai_m as ru')
            ->where('ru.kdprofile', $idProfile)
            ->where('ru.statusenabled', true)
            ->where('ru.objectjenispegawaifk', 1)
            ->orderBy('ru.namalengkap')
            ->get();

        $dataPenyekrining = \DB::table('pegawai_m as pw')
            ->select('pw.id','pw.namalengkap')
            ->where('pw.kdprofile', $idProfile)
            ->where('pw.statusenabled', true)
            ->where('pw.objectjenispegawaifk', 14)
            ->orderBy('pw.namalengkap')
            ->get();

        $dataKelompok = \DB::table('kelompokpasien_m as kp')
            ->select('kp.id', 'kp.kelompokpasien')
            ->where('kp.statusenabled', true)
            ->orderBy('kp.kelompokpasien')
            ->get();

        $dataSatuanResep = \DB::table('satuanresep_m as kp')
            ->select('kp.id', 'kp.satuanresep')
            ->where('kp.statusenabled', true)
            ->orderBy('kp.satuanresep')
            ->get();
        $dataRuanganAll = \DB::table('ruangan_m as ru')
            ->where('ru.kdprofile', $idProfile)
            ->where('ru.statusenabled', true)
            ->whereIn('ru.objectdepartemenfk', [16,25,18])
            ->orderBy('ru.namaruangan')
            ->get();

        $result = array(
            'produk' => $dataProdukResult,
            'produk1' => $dataProdukResult1,
            'produkall' => $dataProdukResultAll,
            'penulisresep' =>   $dataPenulis2,
            'ruangan' => $dataRuangan,
            'ruanganfarmasi' => $dataRuanganFamasi,
            'jeniskemasan' => $dataJenisKemasan,
            'asalproduk' => $dataAsalProduk,
            'route' => $dataRoute,
            'kelas' => $dataKelas,
            'signa' => $dataSigna,
            'jenisracikan' => $dataJenisRacikan,
            'detaillogin' => $dataPegawaiUser,
            'tarifadminresep' =>$dataTarifAdminResep,
            'dokter'=>$dataDokter,
            'kelompokpasien'=>$dataKelompok,
            'satuanresep'=>$dataSatuanResep,
            'ruanganall'=>$dataRuanganAll,
            'penyekrining'=>$dataPenyekrining,
            'message' => 'as@epic',
//            'asdas' => $ruFilter,
        );

        return $this->respond($result);
    }
    public function getDetailResep(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataAsalProduk = \DB::table('asalproduk_m as ap')
            ->select('ap.id','ap.asalproduk')
            ->get();
        $dataSigna = \DB::table('stigma as st')
            ->select('st.id','st.name')
            ->get();
        $dataStruk = \DB::table('strukresep_t as sr')
            ->JOIN('pegawai_m as pg','pg.id','=','sr.penulisresepfk')
            ->JOIN('ruangan_m as ru','ru.id','=','sr.ruanganfk')
            ->select('sr.noresep','pg.id as pgid','pg.namalengkap','ru.id','ru.namaruangan','sr.tglresep')
            ->where('sr.kdprofile', $idProfile);
        if(isset($request['norecResep']) && $request['norecResep']!="" && $request['norecResep']!="undefined"){
            $dataStruk = $dataStruk->where('sr.norec','=', $request['norecResep']);
        }
        $dataStruk = $dataStruk->first();
        $ruanganResep = $dataStruk->id;

        $data = \DB::table('strukresep_t as sr')
            ->JOIN('pelayananpasien_t as pp','pp.strukresepfk','=','sr.norec')
            ->JOIN('antrianpasiendiperiksa_t as apd','apd.norec','=','pp.noregistrasifk')
            ->JOIN('ruangan_m as ru','ru.id','=','apd.objectruanganfk')
            ->JOIN('jeniskemasan_m as jk','jk.id','=','pp.jeniskemasanfk')
            ->LeftJOIN('routefarmasi as rt','rt.id','=','pp.routefk')
            ->JOIN('produk_m as pr','pr.id','=','pp.produkfk')
            ->JOIN('satuanstandar_m as ss','ss.id','=','pr.objectsatuanstandarfk')
            ->JOIN('satuanstandar_m as ss2','ss2.id','=','pp.satuanviewfk')
            ->LeftJOIN('satuanresep_m as sn','sn.id','=','pp.satuanresepfk')
            ->select('sr.noresep','pp.hargasatuan','pp.stock','pp.stock as jmlstok','apd.objectruanganfk','ru.namaruangan',
                'pp.rke','pp.jeniskemasanfk','jk.id as jkid','jk.jeniskemasan','pp.aturanpakai','pp.routefk','rt.name as namaroute',
                'pp.produkfk','pr.namaproduk','pp.nilaikonversi',
                'pr.objectsatuanstandarfk','ss.satuanstandar','pp.satuanviewfk','ss2.satuanstandar as ssview',
                'pp.jumlah','pp.hargadiscount','pp.dosis','pp.jenisobatfk','pp.jasa','pp.hargajual','pp.hargasatuan','pp.strukterimafk',
                'pp.qtydetailresep','pp.ispagi','pp.issiang','pp.ismalam','pp.issore','pr.kekuatan','pp.keteranganpakai','pp.iskronis',
                'pp.satuanresepfk','sn.satuanresep','pp.tglkadaluarsa')
            ->where('sr.kdprofile', $idProfile);

        if(isset($request['norecResep']) && $request['norecResep']!="" && $request['norecResep']!="undefined"){
            $data = $data->where('sr.norec','=', $request['norecResep']);
        }
        $data = $data->get();

        $pelayananPasien=[];
        $i = 0;
        $dataStok = DB::select(DB::raw("select sk.norec,spd.objectprodukfk, sk.tglstruk,spd.objectasalprodukfk,
                            spd.harganetto2 as hargajual,spd.harganetto2 as harganetto,spd.hargadiscount,
                    sum(spd.qtyproduk) as qtyproduk,spd.objectruanganfk
                    from stokprodukdetail_t as spd
                    inner JOIN strukpelayanan_t as sk on sk.norec=spd.nostrukterimafk
                    where spd.kdprofile = $idProfile and spd.objectruanganfk =:ruanganid
                    group by sk.norec,spd.objectprodukfk, sk.tglstruk,spd.objectasalprodukfk,
                            spd.harganetto2,spd.hargadiscount,
                    spd.objectruanganfk
                    order By sk.tglstruk"),
            array(
                'ruanganid' => $dataStruk->id
            )
        );
        $hargajual=0;
        $harganetto=0;
        $nostrukterimafk='';
        $asalprodukfk=0;
        $asalproduk='';
        $jmlstok=0;
        $hargasatuan=0;
        $hargadiscount=0;
        $total=0;
        $aturanpakaifk=0;
        foreach ($data as $item){
            $i = $i+1;

//            $tarifjasa =0;
//            $qty20 =0;
//            if ($item->jkid == 2){
//                $tarifjasa = 800;
//            }
//            if ($item->jkid == 1){
////                $qty20 = Math.floor(parseFloat($scope.item.jumlah)/20)
//                $qty20 = number_format($item->jumlah/20,0);
//                if ($item->jumlah % 20 == 0) {
//                    $qty20 = $qty20;
//                }else{
//                    $qty20 = $qty20 + 1;
//                }
//                $tarifjasa = 800 * $qty20;
//            }
            foreach ($dataStok as $item2){
                if ($item2->objectprodukfk == $item->produkfk){
//                    if ($item2->qtyproduk+($item->jumlah*$item->nilaikonversi) > $item->jumlah*$item->nilaikonversi){
                    if ($item2->norec == $item->strukterimafk){

                        $hargajual = $item->hargajual;
                        $harganetto = $item->hargasatuan;

                        $nostrukterimafk = $item2->norec;
                        $asalprodukfk = $item2->objectasalprodukfk;
                        $jmlstok = $item2->qtyproduk;
                        $hargasatuan = $harganetto;
                        $hargadiscount = $item->hargadiscount;
                        $total =(((float)$item->jumlah * ((float)$hargasatuan-(float)$hargadiscount))) ;
                        break;
                    }
                }
            }
            foreach ($dataAsalProduk as $item3){
                if ($asalprodukfk == $item3->id){
                    $asalproduk = $item3->asalproduk;
                }
            }
            foreach ($dataSigna as $item4){
                if ($item->aturanpakai == $item4->id){
                    $aturanpakaifk = $item4->id;
                }
            }
            $jmlxMakan = (((float)$item->jumlah/(float)$item->nilaikonversi)/(float)$item->dosis)*(float)$item->kekuatan;
            $pelayananPasien[] = array(
                'no' => $i,
                'noregistrasifk' => '',
                'tglregistrasi' => '',
                'generik' => null,
                'hargajual' => $hargajual,
                'jenisobatfk' => $item->jenisobatfk,
                'kelasfk' => '',
                'stock' => $jmlstok,
                'harganetto' => $harganetto,
                'nostrukterimafk' => $nostrukterimafk,
                'ruanganfk' => $ruanganResep,//$item->objectruanganfk,
                'rke' => $item->rke,
                'jeniskemasanfk' => $item->jeniskemasanfk,
                'jeniskemasan' => $item->jeniskemasan,
                'aturanpakaifk' => $aturanpakaifk,
                'aturanpakai' => $item->aturanpakai,
                'routefk' => $item->routefk,
                'route' => $item->namaroute,
                'asalprodukfk' => $asalprodukfk,
                'asalproduk' => $asalproduk,
                'produkfk' => $item->produkfk,
                'namaproduk' => $item->namaproduk,
                'nilaikonversi' => $item->nilaikonversi,
                'satuanstandarfk' => $item->satuanviewfk,//objectsatuanstandarfk,
                'satuanstandar' => $item->ssview,//satuanstandar,
                'satuanviewfk' => $item->satuanviewfk,
                'satuanview' => $item->ssview,
                'jmlstok' => $item->stock,
                'jumlah' => $item->jumlah/$item->nilaikonversi,
                'jumlahobat' =>  $item->qtydetailresep,
                'dosis' => $item->dosis,
                'hargasatuan' => $hargasatuan,
                'hargadiscount' => $hargadiscount,
                'total' => $total +$item->jasa,
                'jmldosis' => (String)$jmlxMakan . '/' . (String)$item->dosis . '/' . $item->kekuatan,
//                'jmldosis' => (String)($item->jumlah/$item->nilaikonversi)/$item->dosis . '/' . (String)$item->dosis,
                'jasa' => $item->jasa,
                'ispagi'  => $item->ispagi,
                'issiang' => $item->issiang,
                'ismalam' => $item->ismalam,
                'issore' => $item->issore,
                'keterangan' => $item->keteranganpakai,
                'iskronis' => $item->iskronis,
                'satuanresepfk' => $item->satuanresepfk,
                'satuanresep' => $item->satuanresep,
                'tglkadaluarsa' => $item->tglkadaluarsa,
            );
        }

        $result = array(
            'detailresep' => $dataStruk,
            'pelayananPasien' => $pelayananPasien,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }
    public function getDetailOrder(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataAsalProduk = \DB::table('asalproduk_m as ap')
            ->select('ap.id','ap.asalproduk')
            ->get();
        $dataSigna = \DB::table('stigma as st')
            ->select('st.id','st.name')
            ->get();
        $dataStruk = \DB::table('strukorder_t as so')
            ->JOIN('pegawai_m as pg','pg.id','=','so.objectpegawaiorderfk')
            ->JOIN('ruangan_m as ru','ru.id','=','so.objectruangantujuanfk')
            ->select('so.noorder','pg.id as pgid','pg.namalengkap','ru.id','ru.namaruangan','so.tglorder')
            ->where('so.kdprofile', $idProfile);

        if(isset($request['noorder']) && $request['noorder']!="" && $request['noorder']!="undefined"){
            $dataStruk = $dataStruk->where('so.noorder','=', $request['noorder']);
        }
        $dataStruk = $dataStruk->first();
        $data = \DB::table('strukorder_t as so')
            ->JOIN('orderpelayanan_t as op','op.strukorderfk','=','so.norec')
            ->JOIN('ruangan_m as ru','ru.id','=','so.objectruangantujuanfk')
            ->leftJOIN('jeniskemasan_m as jk','jk.id','=','op.jeniskemasanfk')
            ->leftJOIN('routefarmasi as rt','rt.id','=','op.routefk')
            ->JOIN('produk_m as pr','pr.id','=','op.objectprodukfk')
            ->leftJOIN('rm_sediaan_m as sdn','sdn.id','=','pr.objectsediaanfk')
            ->leftJOIN('satuanstandar_m as ss','ss.id','=','op.objectsatuanstandarfk')
            ->leftJOIN('satuanstandar_m as ss2','ss2.id','=','op.satuanviewfk')
            ->leftJOIN('satuanresep_m as sn','sn.id','=','op.satuanresepfk')
            ->select('so.noorder','op.hargasatuan','op.qtystokcurrent','so.objectruangantujuanfk','ru.namaruangan',
                'op.rke','op.jeniskemasanfk','jk.id as jkid','jk.jeniskemasan','op.aturanpakai','op.routefk','rt.name as namaroute',
                'op.objectprodukfk','pr.namaproduk','op.hasilkonversi',
                'op.objectsatuanstandarfk','ss.satuanstandar','op.satuanviewfk','ss2.satuanstandar as ssview',
                'op.qtyproduk','op.hargadiscount','op.hasilkonversi','op.qtystokcurrent','op.dosis','op.jenisobatfk',
                'op.hargasatuan','op.hargadiscount','pr.kekuatan','sdn.name as sediaan','op.ispagi','op.issiang','op.ismalam',
                'op.issore','op.keteranganpakai','op.satuanresepfk','sn.satuanresep','op.tglkadaluarsa','so.isreseppulang')
            ->where('so.kdprofile', $idProfile);

        if(isset($request['noorder']) && $request['noorder']!="" && $request['noorder']!="undefined"){
            $data = $data->where('so.noorder','=', $request['noorder']);
        }
        $data = $data->get();

        $orderPelayanan=[];
        $i = 0;
        // $noordertapistruk = null;
        // if(!empty($dataStruk)){
        //     $noordertapistruk = $dataStruk->id;
        // }
        $dataStok = DB::select(DB::raw("select sk.norec,spd.objectprodukfk, sk.tglstruk,spd.objectasalprodukfk,
                            spd.harganetto2 as hargajual,spd.harganetto2 as harganetto,spd.hargadiscount,
                    sum(spd.qtyproduk) as qtyproduk,spd.objectruanganfk
                    from stokprodukdetail_t as spd
                    inner JOIN strukpelayanan_t as sk on sk.norec=spd.nostrukterimafk
                    where spd.kdprofile = $idProfile and spd.objectruanganfk =:ruanganid
                    group by sk.norec,spd.objectprodukfk, sk.tglstruk,spd.objectasalprodukfk,
                            spd.harganetto2,spd.hargadiscount,
                    spd.objectruanganfk
                    order By sk.tglstruk"),
            array(
                'ruanganid' =>$dataStruk->id
            )
        );

        $hargajual=0;
        $harganetto=0;
        $nostrukterimafk='';
        $asalprodukfk=0;
        $asalproduk='';
        $jmlstok=0;
        $hargasatuan=0;
        $hargadiscount=0;
        $total=0;
        $aturanpakaifk=0;
        $rke='0';
        $dataTarifAdminResep = \DB::table('settingdatafixed_m as rt')
            ->select('rt.namafield','rt.nilaifield')
            ->where('rt.statusenabled',true)
            ->where('rt.namafield','tarifadminresep')
            ->orderBy('rt.id')
            ->get();
        foreach ($data as $item){
            $i = $i+1;
            $hargajual=0;
            $harganetto=0;
            $jmlstok=0;
            $hargasatuan=0;
            $hargadiscount=0;
            $total=0;



            $tarifadminjasa = $dataTarifAdminResep[0]->nilaifield;
            $tarifjasa =0;
            $qty20 =0;
            if ($item->jkid == 2){
                $tarifjasa = $tarifadminjasa;//800;
            }
            if ($item->jkid == 1){
                if ($rke != $item->rke) {
                    if ($item->qtyproduk > 20) {
                        $qty20 = number_format($item->qtyproduk / 20, 0);
                        if ($item->qtyproduk % 20 == 0) {
                            $qty20 = $qty20;
                        } else {
                            $qty20 = $qty20 + 1;
                        }

//                        $tarifjasa = 800 * $qty20;
                        $tarifjasa = $tarifadminjasa * $qty20;
                    }else{
//                        $tarifjasa = 800;
                        $tarifjasa = $tarifadminjasa ;
                    }
                    $rke = $item->rke;
                }
            }
            $hargajual =round($item->hargasatuan,0);
            $hargasatuan =round($item->hargasatuan,0);
            $harganetto =round( $item->hargadiscount,0);

            foreach ($dataStok as $item2){
                if ($item2->objectprodukfk == $item->objectprodukfk){
                    if ($item2->qtyproduk > $item->qtyproduk*$item->hasilkonversi){
//                        $hargajual =round($item2->hargajual+(($item2->hargajual*25)/100),0);
//                        $harganetto =round( $item2->harganetto+(($item2->harganetto*25)/100),0);//$item2->harganetto;



                        $nostrukterimafk = $item2->norec;
                        $asalprodukfk = $item2->objectasalprodukfk;
//                        $asalproduk = $item2->objectasalprodukfk;
                        $jmlstok = $item2->qtyproduk;
//                        $hargasatuan = $harganetto;//$item2->harganetto;
                        $hargadiscount = $item2->hargadiscount;
                        $total = (((float)ceil($item->qtyproduk) * ((float)$hargasatuan-(float)$hargadiscount))*$item->hasilkonversi) + $tarifjasa;
                        break;
                    }
                }
            }
            foreach ($dataAsalProduk as $item3){
                if ($asalprodukfk == $item3->id){
                    $asalproduk = $item3->asalproduk;
                }
            }
            foreach ($dataSigna as $item4){
                if ($item->aturanpakai == $item4->id){
                    $aturanpakaifk = $item4->id;
                }
            }
            if((float)$item->dosis == 0){
                $item->dosis = 1;
            }
            // return $this->respond($item->qtyproduk);
            $orderPelayanan[] = array(
                'no' => $i,
                'noregistrasifk' => '',
                'tglregistrasi' => '',
                'generik' => null,
                'hargajual' => $hargajual,
                'jenisobatfk' => $item->jenisobatfk,
                'kelasfk' => '',
                'stock' => $jmlstok,
                'harganetto' => $harganetto,
                'nostrukterimafk' => $nostrukterimafk,
                'ruanganfk' => $item->objectruangantujuanfk,
                'rke' => $item->rke,
                'jeniskemasanfk' => $item->jeniskemasanfk,
                'jeniskemasan' => $item->jeniskemasan,
                'aturanpakaifk' => $aturanpakaifk,
                'aturanpakai' => $item->aturanpakai,
                'routefk' => $item->routefk,
                'route' => $item->namaroute,
                'asalprodukfk' => $asalprodukfk,
                'asalproduk' => $asalproduk,
                'produkfk' => $item->objectprodukfk,
                'namaproduk' => $item->namaproduk,
                'nilaikonversi' => $item->hasilkonversi,
                'satuanstandarfk' => $item->satuanviewfk,//objectsatuanstandarfk,
                'satuanstandar' => $item->ssview,//satuanstandar,
                'satuanviewfk' => $item->satuanviewfk,
                'satuanview' => $item->ssview,
                'jmlstok' => $item->qtystokcurrent,
                'jumlah' => ceil($item->qtyproduk),
                'jumlahobat' => $item->qtyproduk,
                'dosis' => $item->dosis,
                'kekuatan' => $item->kekuatan,
                'hargasatuan' => $hargasatuan,
                'hargadiscount' => $hargadiscount,
                'total' => $total,
                'sediaan' => $item->sediaan,
                'jmldosis' => (String)$item->qtyproduk/$item->dosis . '/' . (String)$item->dosis,
//                'jmldosis' => (String)$item->qtyproduk,
                'jasa' => $tarifjasa,
                'ispagi' => $item->ispagi,
                'issiang' =>  $item->issiang,
                'ismalam' =>  $item->ismalam,
                'issore' =>  $item->issore,
                "keterangan"=>$item->keteranganpakai,
                'satuanresepfk' =>  $item->satuanresepfk,
                "satuanresep"=>$item->satuanresep,
                "tglkadaluarsa"=>$item->tglkadaluarsa,
                "isreseppulang" => $item->isreseppulang,
            );
        }

        $result =array(
            'strukorder' => $dataStruk,
            'orderpelayanan' => $orderPelayanan,
        );
        return $this->respond($result);
    }
    public function getInformasiStok(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $results = DB::select(DB::raw("select sk.norec,spd.objectprodukfk, sk.tglstruk,spd.objectasalprodukfk, 
                            spd.harganetto2,spd.hargadiscount,ru.namaruangan,
                   CAST(sum(spd.qtyproduk) AS FLOAT) as qtyproduk,spd.objectruanganfk as kdruangan
                    from stokprodukdetail_t as spd
                    inner JOIN ruangan_m as ru on ru.id=spd.objectruanganfk
                    inner JOIN strukpelayanan_t as sk on sk.norec=spd.nostrukterimafk
                    where spd.kdprofile = $idProfile and spd.objectprodukfk =:produkId 
                    and ru.statusenabled = true                    
                    -- and ru.statusenabled = true
                    --and spd.objectruanganfk =:ruanganid
                    group by sk.norec,spd.objectprodukfk, sk.tglstruk,spd.objectasalprodukfk, 
                            spd.harganetto2,spd.hargadiscount,ru.namaruangan,
                    spd.objectruanganfk
                    order By sk.tglstruk"),
            array(
                'produkId' => $request['produkfk'],
//                'ruanganid' => $request['ruanganfk'],
            )
        );
        $jmlstok =0;
        foreach ($results as $item){
            $jmlstok = $jmlstok + $item->qtyproduk;
        }
        $a=[];
        foreach ($results as $nenden) {
            $i=0;
            $sama=false;
            foreach ($a as $hideung){
                if ($nenden->kdruangan == $a[$i]['kdruangan']){
                    $sama=true;
                    $a[$i]['qtyproduk']=$a[$i]['qtyproduk']+ $nenden->qtyproduk;
                }
                $i=$i+1;
            }

            if ($sama == false){
                $a[]=array(
                    'qtyproduk'=> $nenden->qtyproduk,
                    'kdruangan'=> $nenden->kdruangan,
                    'namaruangan'=> $nenden->namaruangan,
                );
            }
        }

        $result= array(
            'jmlstok'=> $jmlstok,
            'infostok' => $a,
            'detail' => $results,
            'message' => 'inhuman@epic',
        );
        return $this->respond($result);
    }
    public function getProdukDetail(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        //        namafield	nilaifield	keteranganfungsi
//        MetodeAmbilHargaNetto	0	KOSONG .: pengambilan hn1 atau hn2

//        MetodeHargaNetto	2	AVG
//        MetodeHargaNetto	3	Harga Tertinggi
//        MetodeHargaNetto	1	Harga Netto #

//        MetodeStokHargaNetto	2	LIFO
//        MetodeStokHargaNetto	3	FEFO #
//        MetodeStokHargaNetto	4	LEFO
//        MetodeStokHargaNetto	1	FIFO
//        MetodeStokHargaNetto	5	Summary

//        SistemHargaNetto	7	Harga Terakhir #
//        SistemHargaNetto	6	LEFO
//        SistemHargaNetto	2	LIFO
//        SistemHargaNetto	3	Harga Tertinggi
//        SistemHargaNetto	4	AVG
//        SistemHargaNetto	5	FEFO
//        SistemHargaNetto	1	FIFO

        //bucat : # setting yg dipakai


//        select * from settingdatafixed_m where namafield  in ('SistemHargaNetto','MetodeHargaNetto','MetodeStokHargaNetto','MetodeAmbilHargaNetto') order by namafield;
//        select * from jenistransaksi_m where id=5;
//        select * from persenhargajualproduk_m where objectjenistransaksifk =5; .:25%
//        $kdRangeDiBawah1Jt = (int) $this->settingDataFixed('kdRangeDiBawah1Jt', $idProfile);
//        $kdRangeDiAtas1Jt = (int) $this->settingDataFixed('kdRangeDiAtas1Jt', $idProfile);
        $jenisTransaksi = \DB::table('jenistransaksi_m as jt')
            ->where('jt.id',5)
            ->where('jt.statusenabled',true)
            ->first();

        if ($this->getCountArray($jenisTransaksi) == 0){
            return $this->respond(array(
                'Error' => 'Setting jenistransaksi_m dulu',
                'message' => 'as@epic',
            ));
        }
        $strMetodeAmbilHargaNetto = $jenisTransaksi->metodeambilharganetto;
//        $strMetodeHargaNetto = $jenisTransaksi->metodeharganetto; //ketika penerimaan saja
        $strMetodeStokHargaNetto = $jenisTransaksi->metodestokharganetto;
        $strSistemHargaNetto = $jenisTransaksi->sistemharganetto;

        $defaultKP = 0;
        $defaultKP = 0;
        if(isset($request['kpid']) && $request['kpid']!="" && $request['kpid']!="undefined"){
            if ($request['kpid'] == 1 || $request['kpid'] == 2){
                $defaultKP = $request['kpid'];
            }else{
                $defaultKP = 1;
            }
        }
        $persenHargaJualProduk = \DB::table('persenhargajualproduk_m as phjp')
            ->JOIN('range_m as rg','rg.id','=','phjp.objectrangefk')
            ->select('rg.rangemin','rg.rangemax','phjp.persenuphargasatuan','phjp.objectrangefk','phjp.objectkelompokpasienfk')
            ->where('phjp.objectjenistransaksifk',5)
            ->where('phjp.statusenabled',true)
            ->where('phjp.objectkelompokpasienfk',$defaultKP)
            ->get();
        if (count($persenHargaJualProduk) == 0){
            return $this->respond(array(
                'Error' => 'Setting persenhargajualproduk_m dulu',
                'message' => 'as@epic',
            ));
        }

        $strHN ='';
        $strMSHT ='';
        $SistemHargaNetto='';
        $MetodeAmbilHargaNetto='';
        $MetodeStokHargaNetto='';

        // ### FIFO ### //
        if ($strSistemHargaNetto == 1){
            $SistemHargaNetto ='FIFO';

            if ($strMetodeAmbilHargaNetto == 1) {//HN1
                $strHN ='spd.harganetto1';
                $MetodeAmbilHargaNetto ='HN1';
            }
            if ($strMetodeAmbilHargaNetto == 2) {//HN2
                $strHN ='spd.harganetto2';
                $MetodeAmbilHargaNetto ='HN2';
            }

            if ($strMetodeStokHargaNetto == 1){//FIFO
                $strMSHT ='sk.tglstruk';
                $MetodeStokHargaNetto='FIFO';
            }
            if ($strMetodeStokHargaNetto == 2){//LIFO
                $strMSHT ='';
                $MetodeStokHargaNetto='LIFO';
            }
            if ($strMetodeStokHargaNetto == 3){//FEFO
                $strMSHT ='spd.tglkadaluarsa';
                $MetodeStokHargaNetto='FEFO';
            }
            if ($strMetodeStokHargaNetto == 4){//LEFO
                $strMSHT ='';
                $MetodeStokHargaNetto='LEFO';
            }
            if ($strMetodeStokHargaNetto == 5){//Summary
                $strMSHT ='';
                $MetodeStokHargaNetto='Summary';
            }
            $result = DB::select(DB::raw("select sk.norec,spd.objectprodukfk, $strMSHT as tgl,spd.objectasalprodukfk,$strHN as harganetto ,
                      spd.hargadiscount,sum(spd.qtyproduk) as qtyproduk,spd.objectruanganfk,ap.asalproduk,spd.nostrukterimafk,spd.tglkadaluarsa
                from stokprodukdetail_t as spd
                inner JOIN strukpelayanan_t as sk on sk.norec=spd.nostrukterimafk
                inner JOIN asalproduk_m as ap on ap.id=spd.objectasalprodukfk
                where spd.kdprofile = $idProfile and spd.objectprodukfk =:produkId and spd.objectruanganfk =:ruanganid
                group by sk.norec,spd.objectprodukfk, $strMSHT,spd.objectasalprodukfk, 
                        $strHN,spd.hargadiscount,
                spd.objectruanganfk,ap.asalproduk,spd.nostrukterimafk
                order By $strMSHT"),
                array(
                    'produkId' => $request['produkfk'],
                    'ruanganid' => $request['ruanganfk'],
                )
            );

            $persenUpHargaSatuan=0;
            foreach ($result as $item){
                foreach ($persenHargaJualProduk as $hitem){
                    if ((float)$hitem->rangemin < (float)$item->harganetto && (float)$hitem->rangemax > (float)$item->harganetto){
                        $persenUpHargaSatuan = (float)$hitem->persenuphargasatuan;
                    }
                }
                $results[] = array(
                    'norec' => $item->norec,
                    'objectprodukfk' => $item->objectprodukfk,
                    'tgl' => $item->tgl,
                    'objectasalprodukfk' => $item->objectasalprodukfk,
                    'asalproduk' => $item->asalproduk,
                    'harganetto' => $item->harganetto,
                    'hargadiscount' => $item->hargadiscount,
                    'hargajual' => (float)$item->harganetto + (((float)$item->harganetto * (float)$persenUpHargaSatuan)/100),
                    'persenhargajualproduk'=>$persenUpHargaSatuan,
                    'qtyproduk' => (float)$item->qtyproduk,
                    'objectruanganfk' => $item->objectruanganfk,
                    'nostrukterimafk' => $item->nostrukterimafk,
                    'tglkadaluarsa' => $item->tglkadaluarsa,
                    'persenup' => $persenUpHargaSatuan,
                );
            }
        }
        // ### END-FIFO ### //

        // ### Harga Tertinggi ### //
        if ($strSistemHargaNetto == 3){
            $SistemHargaNetto ='Harga Tertinggi';
            if ($strMetodeAmbilHargaNetto == 1) {//HN1
                $strHN ='spd.harganetto1';
                $MetodeAmbilHargaNetto ='HN1';
            }
            if ($strMetodeAmbilHargaNetto == 2) {//HN2
                $strHN ='spd.harganetto2';
                $MetodeAmbilHargaNetto ='HN2';
            }

            if ($strMetodeStokHargaNetto == 1){//FIFO
                $strMSHT ='sk.tglstruk';
                $MetodeStokHargaNetto='FIFO';
            }
            if ($strMetodeStokHargaNetto == 2){//LIFO
                $strMSHT ='';
                $MetodeStokHargaNetto='LIFO';
            }
            if ($strMetodeStokHargaNetto == 3){//FEFO
                $strMSHT ='spd.tglkadaluarsa';
                $MetodeStokHargaNetto='FEFO';
            }
            if ($strMetodeStokHargaNetto == 4){//LEFO
                $strMSHT ='';
                $MetodeStokHargaNetto='LEFO';
            }
            if ($strMetodeStokHargaNetto == 5){//Summary
                $strMSHT ='';
                $MetodeStokHargaNetto='Summary';
            }
            $maxHarga = DB::select(DB::raw("select $strHN as harga
                from stokprodukdetail_t as spd
                inner JOIN strukpelayanan_t as sk on sk.norec=spd.nostrukterimafk
                where spd.kdprofile = $idProfile and spd.objectprodukfk =:produkId and spd.objectruanganfk =:ruanganid"),
                array(
                    'produkId' => $request['produkfk'],
                    'ruanganid' => $request['ruanganfk'],
                )
            );
            $hargaTertinggi=0;
            foreach ($maxHarga as $item){
                if ($hargaTertinggi < (float)$item->harga){
                    $hargaTertinggi =(float)$item->harga;
                }
            }

            $result = DB::select(DB::raw("select sk.norec,spd.objectprodukfk, $strMSHT as tgl,spd.objectasalprodukfk,$hargaTertinggi as harganetto ,
                        $hargaTertinggi  as hargajual,spd.hargadiscount,sum(spd.qtyproduk) as qtyproduk,spd.objectruanganfk,ap.asalproduk,spd.nostrukterimafk,
                        spd.tglkadaluarsa
                from stokprodukdetail_t as spd
                inner JOIN strukpelayanan_t as sk on sk.norec=spd.nostrukterimafk
                inner JOIN asalproduk_m as ap on ap.id=spd.objectasalprodukfk
                where spd.kdprofile = $idProfile and spd.objectprodukfk =:produkId and spd.objectruanganfk =:ruanganid
                group by sk.norec,spd.objectprodukfk, $strMSHT,spd.objectasalprodukfk, 
                        spd.hargadiscount,
                spd.objectruanganfk,ap.asalproduk,spd.nostrukterimafk
                order By $strMSHT"),
                array(
                    'produkId' => $request['produkfk'],
                    'ruanganid' => $request['ruanganfk'],
                )
            );

            $persenUpHargaSatuan=0;
            foreach ($result as $item){
                foreach ($persenHargaJualProduk as $hitem){
                    if ((float)$hitem->rangemin < (float)$item->harganetto && (float)$hitem->rangemax > (float)$item->harganetto){
                        $persenUpHargaSatuan = (float)$hitem->persenuphargasatuan;
                    }
                }
                $results[] = array(
                    'norec' => $item->norec,
                    'objectprodukfk' => $item->objectprodukfk,
                    'tgl' => $item->tgl,
                    'objectasalprodukfk' => $item->objectasalprodukfk,
                    'asalproduk' => $item->asalproduk,
                    'harganetto' => $item->harganetto,
                    'hargadiscount' => $item->hargadiscount,
                    'hargajual' => (float)$item->harganetto + (((float)$item->harganetto * (float)$persenUpHargaSatuan)/100),
                    'persenhargajualproduk'=>$persenUpHargaSatuan,
                    'qtyproduk' => (float)$item->qtyproduk,
                    'objectruanganfk' => $item->objectruanganfk,
                    'nostrukterimafk' => $item->nostrukterimafk,
                    'tglkadaluarsa' => $item->tglkadaluarsa,
                    'persenup' => $persenUpHargaSatuan,
                );
            }
        }
        // ### END-Harga Tertinggi ### //

        // ### Harga Terakhir ### //
        if ($strSistemHargaNetto == 7){
            $SistemHargaNetto ='Harga Terakhir';
            if ($strMetodeAmbilHargaNetto == 1) {//HN1
                $strHN ='spd.harganetto1';
                $MetodeAmbilHargaNetto ='HN1';
            }
            if ($strMetodeAmbilHargaNetto == 2) {//HN2
                $strHN ='spd.harganetto2';
                $MetodeAmbilHargaNetto ='HN2';
            }

            if ($strMetodeStokHargaNetto == 1){//FIFO
                $strMSHT ='sk.tglstruk';
                $MetodeStokHargaNetto='FIFO';
            }
            if ($strMetodeStokHargaNetto == 2){//LIFO
                $strMSHT ='sk.tglstruk desc';
                $MetodeStokHargaNetto='LIFO';
            }
            if ($strMetodeStokHargaNetto == 3){//FEFO
                $strMSHT ='spd.tglkadaluarsa';
                $MetodeStokHargaNetto='FEFO';
            }
            if ($strMetodeStokHargaNetto == 4){//LEFO
                $strMSHT ='spd.tglkadaluarsa desc';
                $MetodeStokHargaNetto='LEFO';
            }
            if ($strMetodeStokHargaNetto == 5){//Summary
                $strMSHT ='';
                $MetodeStokHargaNetto='Summary';
            }
            $maxHarga = DB::select(DB::raw("select spd.tglpelayanan, $strHN as harga
                from stokprodukdetail_t as spd
                inner JOIN strukpelayanan_t as sk on sk.norec=spd.nostrukterimafk
                where spd.kdprofile = $idProfile and spd.objectprodukfk =:produkId "),
                array(
                    'produkId' => $request['produkfk'],
                )
            );
            $hargaTerakhir=0;
            $tgl = date('2000-01-01 00:00');
            foreach ($maxHarga as $item){
                if ($tgl < $item->tglpelayanan){
                    $tgl = $item->tglpelayanan;
                    $hargaTerakhir =(float)$item->harga;
                }
            }
            $result =[];
            $result = DB::select(DB::raw("select sk.norec,spd.objectprodukfk, $strMSHT as tgl,spd.objectasalprodukfk,$hargaTerakhir as harganetto ,
                        $hargaTerakhir  as hargajual,spd.hargadiscount,spd.nostrukterimafk,
                sum(spd.qtyproduk) as qtyproduk,spd.objectruanganfk,ap.asalproduk,spd.tglkadaluarsa
                from stokprodukdetail_t as spd
                inner JOIN strukpelayanan_t as sk on sk.norec=spd.nostrukterimafk
                inner JOIN asalproduk_m as ap on ap.id=spd.objectasalprodukfk
                where spd.kdprofile = $idProfile and spd.objectprodukfk =:produkId and spd.objectruanganfk =:ruanganid and spd.qtyproduk > 0
                group by sk.norec,spd.objectprodukfk, $strMSHT, spd.objectasalprodukfk, 
                        spd.hargadiscount,
                spd.objectruanganfk,ap.asalproduk,spd.nostrukterimafk
                order By $strMSHT"),
                array(
                    'produkId' => $request['produkfk'],
                    'ruanganid' => $request['ruanganfk'],
                )
            );
            $results=[];
            $persenUpHargaSatuan=0;
            foreach ($result as $item){
                foreach ($persenHargaJualProduk as $hitem){
                    if ((float)$hitem->rangemin < (float)$item->harganetto && (float)$hitem->rangemax > (float)$item->harganetto){
                        $persenUpHargaSatuan = (float)$hitem->persenuphargasatuan;
                    }
                }
                $results[] = array(
                    'norec' => $item->norec,
                    'objectprodukfk' => $item->objectprodukfk,
                    'tgl' => $item->tgl,
                    'objectasalprodukfk' => $item->objectasalprodukfk,
                    'asalproduk' => $item->asalproduk,
                    'harganetto' => (float)$item->harganetto,//$item->harganetto,
                    'hargadiscount' => $item->hargadiscount,
                    'hargajual' => (float)$item->harganetto + (((float)$item->harganetto * (float)$persenUpHargaSatuan)/100),
                    'persenhargajualproduk'=>$persenUpHargaSatuan,
                    'qtyproduk' => (float)$item->qtyproduk,
                    'objectruanganfk' => $item->objectruanganfk,
                    'nostrukterimafk' => $item->nostrukterimafk,
                    'tglkadaluarsa' => $item->tglkadaluarsa,
                    'persenup' => $persenUpHargaSatuan,
                );
            }
        }
        // ### END-Harga Terakhir ### //

        $jmlstok =0;
        foreach ($result as $item){
            $jmlstok = $jmlstok+$item->qtyproduk;
        }

        $cekConsis = DB::select(DB::raw("select * from his_obat_ms_t where hobatid=:produkfk;"),
            array(
                'produkfk' =>  $request['produkfk'],
            )
        );
        $cekKekuatanSupranatural = DB::select(DB::raw("

            select pr.kekuatan,sdn.name as sediaan from produk_m as pr 
            inner join rm_sediaan_m as sdn on sdn.id=pr.objectsediaanfk
            where pr.kdprofile = $idProfile and pr.id=:produkfk;
            
            "),
            array(
                'produkfk' =>  $request['produkfk'],
            )
        );
        $kekuatan =0;
        $sediaan=0;
        if (count($cekKekuatanSupranatural)>0){
            $kekuatan = (float)$cekKekuatanSupranatural[0]->kekuatan;
            $sediaan = $cekKekuatanSupranatural[0]->sediaan;
            if ($kekuatan == null){
                $kekuatan =0;
            }
        }


        $result= array(
            'detail' => $results,
            'jmlstok'=> $jmlstok,
            'kekuatan' =>$kekuatan,
            'sediaan' => $sediaan,
            'sistemharganetto' => $SistemHargaNetto,
            'metodeambilharganetto' => $MetodeAmbilHargaNetto,
            'metodestokharganetto' => $MetodeStokHargaNetto,
            'consis' => count($cekConsis),
            'message' => 'as@epic',
        );
        return $this->respond($result);
    }
    public function StokMerger(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        DB::beginTransaction();
        $r_all=$request->all();
        try {
            $data =StokProdukDetail::where('objectprodukfk',$r_all['produkfk'])
                ->where('kdprofile', $idProfile)
                ->where('objectruanganfk',$r_all['ruanganfk'])
                ->where('qtyproduk','>',0)
                ->orderby('tglkadaluarsa','desc')
                ->select('norec','qtyproduk')
                ->get();
            $qtyTotal = 0 ;
            foreach ($data as $item){
                $qtyTotal = $qtyTotal + $item->qtyproduk;
                $data2 = StokProdukDetail::where('norec',$item->norec)
                    ->first();
                $data2->qtyproduk = 0;
                $data2->save();
            }
            $data2 = StokProdukDetail::where('norec',$data[0]->norec)->where('kdprofile', $idProfile)->first();
            $data2->qtyproduk = $qtyTotal;
            $data2->save();

            $data3 = StokProdukDetail::where('objectprodukfk',$r_all['produkfk'])
                ->where('kdprofile', $idProfile)
                ->where('objectruanganfk',$r_all['ruanganfk'])
                ->where('qtyproduk','>',0)
                ->orderby('tglkadaluarsa','desc')
                ->select('norec','qtyproduk')
                ->get();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        $transMessage = "Stock Merger";

        if ($transStatus == 'true') {
            $transMessage = $transMessage .  " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage .  " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "data" => $data3,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getJenisObat(Request $request) {
        $dataLogin = $request->all();
        $data = \DB::table('jenisracikan_m as jr')
            ->select('jr.id','jr.jenisracikan');

        if(isset($request['jrid']) && $request['jrid']!="" && $request['jrid']!="undefined" &&  $request['jrid']!='null'){
            $data = $data->where('jr.id', $request['jrid']);
        }
        $data = $data->get();



        $result = array(
            'data' => $data,
            'datalogin' => $dataLogin,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }

    public function SimpanPelayananObat(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        //TODO : SAVE INPUT RESEP OBAT
        if (isset($request['strukresep']['isobatalkes']) && $request['strukresep']['isobatalkes'] == true){
            $noResep = $this->generateCodeBySeqTable(new StrukResep, 'noresep', 12, 'OA/' . $this->getDateTime()->format('ym') . '/', $idProfile);
        }else{
            $noResep = $this->generateCodeBySeqTable(new StrukResep, 'noresep', 12, 'O/' . $this->getDateTime()->format('ym') . '/', $idProfile);
        }
        if ($noResep == ''){
            $transMessage = "Gagal mengumpukan data, Coba lagi.!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'as@epic',
            );
            return $this->setStatusCode($result['status'])->respond($result, $transMessage);
        }
        //## StrukResep
        DB::beginTransaction();
//        ini_set('max_execution_time', 1000); //6 minutes
        
        try {

            $racikanORnonracikan = 'N';
            //region @SIMPAN PELAYANAN OBAT IEU
            $dataLogin = $request->all();
            $r_SR=$request['strukresep'];
            if ($r_SR['noorder'] !='' && $r_SR['noorder'] != 'EditResep'){
                $dataOrder = StrukOrder::where('noorder',$r_SR['noorder'])->where('kdprofile', $idProfile)->first();
                $dataOrder->statusorder = 5;
                $dataOrder->save();
            }
            $resepOld = StrukResep::where('noresep', $r_SR['noresep'])
                ->where('kdprofile', $idProfile)->first();
            $namaPasien = $r_SR['nocm'] . ' ' . $r_SR['namapasien'];
            if ($r_SR['noresep'] == '-') {
                $newSR = new StrukResep();
                $norecSR = $newSR->generateNewId();
                /** Obat ALKES */
                $newSR->norec = $norecSR;
            }else{
                $newSR = StrukResep::where('norec',$r_SR['norecResep'])->where('kdprofile', $idProfile)->first();
                $noResep = $newSR->noresep;
            }
            $newSR->kdprofile = $idProfile;
            $newSR->statusenabled = 1;
            $newSR->noresep = $noResep;
            $newSR->pasienfk = $r_SR['pasienfk'];
            $newSR->penulisresepfk = $r_SR['penulisresepfk'];
            $newSR->ruanganfk = $r_SR['ruanganfk'];
            $newSR->status = 0;//$r_SR['status'];;
            $newSR->tglresep =  $r_SR['tglresep'];//->format('Y-m-d H:i:s');

            $newSR->save();
            $norec_SR = $newSR->norec;
            $dokterPenulis =  $newSR->penulisresepfk;
            $isRetur = false;

            if ($r_SR['noorder'] !='' && $r_SR['noorder'] != 'EditResep'){
                $DataOrder = StrukOrder::where('noorder', $r_SR['noorder'])->where('kdprofile', $idProfile)->first();
                $norecOrder = $DataOrder->norec;

                $dataResep = StrukResep::where('norec',$norec_SR)
                    ->update(['orderfk' => $norecOrder]);
            }

            $isRetur = false;
            if ($r_SR['noresep'] != '-') {
                if ($r_SR['retur'] != '-') {
                    $isRetur = true;
                    $newSRetur = new StrukRetur();
                    $norecSRetur = $newSRetur->generateNewId();
                    $noRetur = $this->generateCode(new StrukRetur, 'noretur', 12, 'Ret/' . $this->getDateTime()->format('ym') . '/', $kdProfile);
                    $newSRetur->norec = $norecSRetur;
                    $newSRetur->kdprofile = $idProfile;
                    $newSRetur->statusenabled = true;
                    $newSRetur->objectkelompoktransaksifk = 50;
                    $newSRetur->keteranganalasan = $r_SR['alasan'];
                    $newSRetur->keteranganlainnya = 'RETUR OBAT ALKES';
                    $newSRetur->noretur = $noRetur;
                    $newSRetur->objectruanganfk = $r_SR['ruanganfk'];
                    $newSRetur->objectpegawaifk = $r_SR['pegawairetur'];
                    $newSRetur->tglretur = $this->getDateTime()->format('Y-m-d H:i:s');
                    $newSRetur->strukresepfk = $norec_SR;
                    $newSRetur->save();
                    $transStatus = 'false';

                    $norec_retur = $newSRetur->norec ;

                    $r_PP = $request['pelayananpasien'];
                    foreach ($r_PP as $r_PPLXXXX) {
                        if ((int)$r_PPLXXXX['jmlretur'] != 0) {
                            $newPPR = new PelayananPasienRetur();
                            $norecPPR = $newPPR->generateNewId();
                            $newPPR->norec = $norecPPR;
                            $newPPR->kdprofile = $idProfile;
                            $newPPR->statusenabled = true;
                            $newPPR->noregistrasifk = $r_PPLXXXX['noregistrasifk'];
                            $newPPR->tglregistrasi = $r_PPLXXXX['tglregistrasi'];
                            $newPPR->aturanpakai = $r_PPLXXXX['aturanpakai'];
                            $newPPR->generik = $r_PPLXXXX['generik'];
                            $newPPR->hargadiscount = $r_PPLXXXX['hargadiscount'];
                            $newPPR->hargajual = $r_PPLXXXX['hargajual'];
                            $newPPR->hargasatuan = $r_PPLXXXX['hargasatuan'];
                            $newPPR->jenisobatfk = $r_PPLXXXX['jenisobatfk'];
                            $newPPR->jumlah = $r_PPLXXXX['jmlretur'];
                            $newPPR->kelasfk = $r_PPLXXXX['kelasfk'];
                            $newPPR->kdkelompoktransaksi = 1;
                            $newPPR->produkfk = $r_PPLXXXX['produkfk'];
                            if (isset($r_PPL['routefk'])) {
                                $newPPR->routefk = $r_PPLXXXX['routefk'];
                            }
                            $newPPR->stock = $r_PPLXXXX['stock'];
                            $newPPR->tglpelayanan = $r_SR['tglresep'];//$r_SR['tglresep']->format('Y-m-d H:i:s');
                            $newPPR->harganetto = $r_PPLXXXX['harganetto'];
                            $newPPR->jeniskemasanfk = $r_PPLXXXX['jeniskemasanfk'];
                            $newPPR->rke = $r_PPLXXXX['rke'];
                            $newPPR->strukresepfk = $norec_SR;
                            $newPPR->satuanviewfk = $r_PPLXXXX['satuanviewfk'];
                            $newPPR->nilaikonversi = $r_PPLXXXX['nilaikonversi'];
                            $newPPR->strukterimafk = $r_PPLXXXX['nostrukterimafk'];
                            $newPPR->dosis = $r_PPLXXXX['dosis'];
                            if ((int)$r_PPLXXXX['jumlah'] == 0) {
                                $newPPR->jasa = $r_PPLXXXX['jasa'];
                            } else {
                                $newPPR->jasa = 0;
                            }
                            $newPPR->strukreturfk = $norec_retur;
                            $newPPR->save();

                            //## TAMBAH STOK DARI RETUR
                            $saldoAwal=0;
                            $TambahStok = (float)$r_PPLXXXX['jmlretur'] * (float)$r_PPLXXXX['nilaikonversi'];//$r_PPLXXXX['jmlretur'];
                            $dataSaldoAwal = collect(DB::select("
                                 select sum(qtyproduk) as qty from stokprodukdetail_t 
                                 where kdprofile = $idProfile and objectruanganfk=$r_SR[ruanganfk] 
                                 and objectprodukfk=$r_PPLXXXX[produkfk]                                 
                            "))->first();
                            $saldoAwal = (float)$dataSaldoAwal->qty + (float)$TambahStok;;

                            $newSPD = StokProdukDetail::where('nostrukterimafk',$r_PPLXXXX['nostrukterimafk'])
                                ->where('kdprofile', $idProfile)
                                ->where('objectruanganfk',$r_SR['ruanganfk'])
                                ->where('objectprodukfk',$r_PPLXXXX['produkfk'])
                                ->orderby('tglkadaluarsa','desc')
                                ->first();

                            DB::table('stokprodukdetail_t')
                                ->where('kdprofile', $idProfile)
                                ->where('norec',$newSPD->norec)
                                ->sharedLock()
                                ->increment('qtyproduk', (float)$TambahStok);

                            $newKS = new KartuStok();
                            $norecKS = $newKS->generateNewId();
                            $newKS->norec = $norecKS;
                            $newKS->kdprofile = $idProfile;
                            $newKS->statusenabled = true;
                            $newKS->jumlah = $TambahStok;//$r_PPL['jumlah'];
                            $newKS->keterangan = 'Retur Resep No. ' . $noResep;
                            $newKS->produkfk = $r_PPLXXXX['produkfk'];
                            $newKS->ruanganfk = $r_SR['ruanganfk'];
                            $newKS->saldoawal = (float)$saldoAwal ;//- (float)$qtyJumlah;
                            $newKS->status = 1;
                            $newKS->tglinput = date('Y-m-d H:i:s');//$r_SR['tglresep'];//$r_SR['tglresep']->format('Y-m-d H:i:s');
                            $newKS->tglkejadian = date('Y-m-d H:i:s');//$r_SR['tglresep'];// $r_SR['tglresep']->format('Y-m-d H:i:s');
                            $newKS->nostrukterimafk =  $r_PPLXXXX['nostrukterimafk'];//$newSPD->nostrukterimafk;
                            $newKS->flagfk = 3;
                            $newKS->save();

                        }
                    }

                }else{
                    KartuStok::where('keterangan',  'Pelayanan Obat Alkes '.' '. $noResep .' '. $namaPasien)
                        ->where('kdprofile', $idProfile)
                        ->update([
                            'flagfk' => null
                        ]);

                    $tglnow =  date('Y-m-d H:i:s');
                    $tglUbah = date('Y-m-d H:i:s',strtotime('15 seconds',strtotime($tglnow)));

                    //##PENAMBAHAN KEMBALI STOKPRODUKDETAIL
                    $dataKembaliStok = collect(DB::select("
                            select pp.strukterimafk,pp.jumlah,pp.nilaikonversi,sr.ruanganfk,pp.produkfk
                            from pelayananpasien_t as pp
                            INNER JOIN strukresep_t sr on sr.norec=pp.strukresepfk
                            where pp.kdprofile = $idProfile 
                            and pp.status is null 
                            and sr.kdprofile = $idProfile 
                            and sr.norec='$norec_SR'                            
                    "));//pp.status is not null untuk tarif service grhasia

                    if ($r_SR['ruanganfk'] == $resepOld->ruanganfk){
                        foreach ($dataKembaliStok as $item5) {
                            $saldoAwal = 0;
                            $TambahStok = (float)$item5->jumlah;
                            $dataSaldoAwal = collect(DB::select("
                                select sum(qtyproduk) as qty from stokprodukdetail_t 
                                where kdprofile = $idProfile and objectruanganfk=$resepOld->ruanganfk and objectprodukfk=$item5->produkfk"))
                                ->first();
                            $saldoAwal = (float)$dataSaldoAwal->qty + $TambahStok;
                            //b4yu4d4
                            $kdobatbayu=array($item5->produkfk,$item5->ruanganfk,$item5->strukterimafk);

                            $newSPD = StokProdukDetail::where('nostrukterimafk', $item5->strukterimafk)
                                ->where('kdprofile', $idProfile)
                                ->where('objectruanganfk', $item5->ruanganfk)
                                ->where('objectprodukfk', $item5->produkfk)
                                ->orderby('tglkadaluarsa', 'desc')
                                ->first();

                            $noTerimafk = $item5->strukterimafk;

                            DB::table('stokprodukdetail_t')
                                ->where('kdprofile', $idProfile)
                                ->where('norec',$newSPD->norec)
                                ->sharedLock()
                                ->increment('qtyproduk', (float)$TambahStok);

                            $newKS = new KartuStok();
                            $norecKS = $newKS->generateNewId();
                            $newKS->norec = $norecKS;
                            $newKS->kdprofile = $idProfile;
                            $newKS->statusenabled = true;
                            $newKS->jumlah = $TambahStok;//$r_PPL['jumlah'];
                            $newKS->keterangan = 'Ubah Resep No. ' . $noResep;
                            $newKS->produkfk = $item5->produkfk;
                            $newKS->ruanganfk = $r_SR['ruanganfk'];//$item->ruanganfk;
                            $newKS->saldoawal = (float)$saldoAwal ;//- (float)$qtyJumlah;
                            $newKS->status = 1;
                            $newKS->tglinput = $tglUbah; //date('Y-m-d H:i:s');//$r_SR['tglresep'];//$r_SR['tglresep']->format('Y-m-d H:i:s');
                            $newKS->tglkejadian = $tglUbah; //date('Y-m-d H:i:s');//$r_SR['tglresep'];// $r_SR['tglresep']->format('Y-m-d H:i:s');
                            $newKS->nostrukterimafk =  $newSPD->nostrukterimafk;
                            $newKS->norectransaksi = $newSPD->norec;
                            $newKS->tabletransaksi = 'stokprodukdetail_t';
                            $newKS->save();
                        }
                    }else{
                        foreach ($dataKembaliStok as $item5) {
                            $TambahStok = (float)$item5->jumlah;//*(float)$item5->nilaikonversi;
                            $saldoAwal = 0;
                            $dataSaldoAwal = collect(DB::select("select sum(qtyproduk) as qty from stokprodukdetail_t 
                                where kdprofile = $idProfile and objectruanganfk=$resepOld->ruanganfk and objectprodukfk=$item5->produkfk"))
                                ->first();
                            $saldoAwal = (float)$dataSaldoAwal->qty + $TambahStok;
                            $newSPD = StokProdukDetail::where('nostrukterimafk', $item5->strukterimafk)
                                ->where('kdprofile', $idProfile)
                                ->where('objectruanganfk', $resepOld->ruanganfk)
                                ->where('objectprodukfk', $item5->produkfk)
                                ->orderby('tglkadaluarsa', 'desc')
                                ->first();

                            DB::table('stokprodukdetail_t')
                                ->where('kdprofile', $idProfile)
                                ->where('norec',$newSPD->norec)
                                ->sharedLock()
                                ->increment('qtyproduk', (float)$TambahStok);

                            $newKS = new KartuStok();
                            $norecKS = $newKS->generateNewId();
                            $newKS->norec = $norecKS;
                            $newKS->kdprofile = $idProfile;
                            $newKS->statusenabled = true;
                            $newKS->jumlah = $TambahStok;//$r_PPL['jumlah'];
                            $newKS->keterangan = 'Ubah Resep No. ' . $noResep;
                            $newKS->produkfk = $item5->produkfk;
                            $newKS->ruanganfk = $resepOld->ruanganfk;
                            $newKS->saldoawal = (float)$saldoAwal;//- (float)$qtyJumlah;
                            $newKS->status = 1;
                            $newKS->tglinput = $tglUbah; //date('Y-m-d H:i:s');//$r_SR['tglresep'];//$r_SR['tglresep']->format('Y-m-d H:i:s');
                            $newKS->tglkejadian = $tglUbah; //date('Y-m-d H:i:s');//$r_SR['tglresep'];// $r_SR['tglresep']->format('Y-m-d H:i:s');
                            $newKS->nostrukterimafk = $newSPD->nostrukterimafk;
                            $newKS->norectransaksi = $newSPD->norec;
                            $newKS->tabletransaksi = 'stokprodukdetail_t';
                            $newKS->save();
                        }
                    }

                    //END##PENAMBAHAN KEMBALI STOKPRODUKDETAIL
                }
                //### LOGACC untuk penjurnalan blm ada                
                //$HapusPP = PelayananPasien::where('strukresepfk', $norec_SR)->where('kdprofile', $idProfile)->get();
                $HapusPP = PelayananPasien::where('strukresepfk', $norec_SR)->where('kdprofile', $idProfile)
                ->whereNull('status')
                ->get();
                foreach ($HapusPP as $pp){
                    $HapusPPD = PelayananPasienDetail::where('pelayananpasien', $pp['norec'])->where('kdprofile', $idProfile)->delete();
                    $HapusPPP = PelayananPasienPetugas::where('pelayananpasien', $pp['norec'])->where('kdprofile', $idProfile)->delete();
                }
                $HpsPP = PelayananPasien::where('strukresepfk', $norec_SR)->where('kdprofile', $idProfile)->whereNull('status')->delete();
            }

            //## PelayananPasien
            $r_PP = $request['pelayananpasien'];
            foreach ($r_PP as $r_PPL){
                $qtyJumlah = (float)$r_PPL['jumlah'] * (float)$r_PPL['nilaikonversi'];
                $newPP = new PelayananPasien();
                $norecPP = $newPP->generateNewId();
                $newPP->norec = $norecPP;
                $newPP->kdprofile = $idProfile;
                $newPP->statusenabled = true;
                $newPP->noregistrasifk = $r_PPL['noregistrasifk'];
                $newPP->tglregistrasi = $r_PPL['tglregistrasi'];
                $newPP->aturanpakai = $r_PPL['aturanpakai'];
                $newPP->generik = $r_PPL['generik'];
                $newPP->hargadiscount = $r_PPL['hargadiscount'];
                $newPP->hargajual = $r_PPL['hargajual'];
                $newPP->hargasatuan = $r_PPL['hargasatuan'];
                $newPP->jenisobatfk = $r_PPL['jenisobatfk'];
                $newPP->jumlah = $qtyJumlah;//$r_PPL['jumlah'];
                $newPP->kelasfk = $r_PPL['kelasfk'];
                $newPP->kdkelompoktransaksi = 1;
                $newPP->produkfk = $r_PPL['produkfk'];
                if (isset($r_PPL['routefk'])){
                    $newPP->routefk = $r_PPL['routefk'];
                }
                $newPP->stock = $r_PPL['stock'];
                $newPP->tglpelayanan = $r_SR['tglresep'];//$r_SR['tglresep']->format('Y-m-d H:i:s');
                $newPP->harganetto = $r_PPL['harganetto'];
                $newPP->jeniskemasanfk = $r_PPL['jeniskemasanfk'];
                $newPP->rke = $r_PPL['rke'];
                $newPP->strukresepfk = $norec_SR;
                $newPP->satuanviewfk = $r_PPL['satuanviewfk'];
                $newPP->nilaikonversi = $r_PPL['nilaikonversi'];
                $newPP->strukterimafk = $r_PPL['nostrukterimafk'];
                $newPP->dosis = $r_PPL['dosis'];
                $newPP->jasa = $r_PPL['jasa'];
                $newPP->qtydetailresep = $r_PPL['jumlahobat'];
                $newPP->isobat = 1;
                $newPP->ispagi = $r_PPL['ispagi'];
                $newPP->issiang = $r_PPL['issiang'];
                $newPP->ismalam = $r_PPL['ismalam'];
                $newPP->issore = $r_PPL['issore'];
                $newPP->keteranganpakai = $r_PPL['keterangan'];
                if (isset($r_PPL['iskronis'])){
                    $newPP->iskronis = $r_PPL['iskronis'];
                }
                if (isset($r_PPL['satuanresepfk'])){
                    $newPP->satuanresepfk = $r_PPL['satuanresepfk'];
                }
                if (isset($r_PPL['tglkadaluarsa']) && $r_PPL['tglkadaluarsa'] != 'Invalid date' && $r_PPL['tglkadaluarsa'] != ''){
                    $newPP->tglkadaluarsa = $r_PPL['tglkadaluarsa'];
                }
                $newPP->save();
                if ((int)$r_PPL['jeniskemasanfk'] == 1){
                    $racikanORnonracikan='R';
                }

                $dataPP[] = $newPP;
                $norec_PP = $newPP->norec;
                //### PelayananPasienDetail
                $dataKomponen=[];
                $dataKomponen[] = array(
                    'komponenfk' => '9',
                    'komponen' => 'Harga Netto',
                    'harga' => (float)$r_PPL['harganetto']
                );
                $dataKomponen[] = array(
                    'komponenfk' => '12',
                    'komponen' => 'Profit',
                    'harga' => (float)$r_PPL['hargasatuan'] - (float)$r_PPL['harganetto']
                );
                foreach ($dataKomponen as $itemKomponen) {
                    $newPPD = new PelayananPasienDetail();
                    $norecPPD = $newPPD->generateNewId();
                    $newPPD->norec = $norecPPD;
                    $newPPD->kdprofile = $idProfile;
                    $newPPD->statusenabled = true;
                    $newPPD->noregistrasifk = $r_PPL['noregistrasifk'];
                    $newPPD->tglregistrasi = $r_PPL['tglregistrasi'];
                    $newPPD->aturanpakai = $r_PPL['aturanpakai'];
                    $newPPD->generik = $r_PPL['generik'];
                    $newPPD->hargadiscount = 0;
                    $newPPD->hargajual = $itemKomponen['harga'];
                    $newPPD->hargasatuan = $itemKomponen['harga'];
                    $newPPD->jenisobatfk = $r_PPL['jenisobatfk'];
                    $newPPD->jumlah = $qtyJumlah;//$r_PPL['jumlah'];
                    $newPPD->komponenhargafk = $itemKomponen['komponenfk'];
                    $newPPD->pelayananpasien = $norec_PP;
                    $newPPD->produkfk = $r_PPL['produkfk'];
                    $newPPD->routefk = $r_PPL['routefk'];
                    $newPPD->stock = 0;
                    $newPPD->tglpelayanan =  $r_SR['tglresep'];//$r_SR['tglresep']->format('Y-m-d H:i:s');
                    $newPPD->harganetto = $itemKomponen['harga'];
                    $newPP->jasa = $r_PPL['jasa'];
                    $newPPD->save();
                }
                //## StokProdukDetail
                //$r_SPD=$request['stokprodukdetail'];
                $GetNorec = StokProdukDetail::where('nostrukterimafk',$r_PPL['nostrukterimafk'])
                    ->where('kdprofile', $idProfile)
                    ->where('objectruanganfk',$r_PPL['ruanganfk'])
                    ->where('objectasalprodukfk',$r_PPL['asalprodukfk'])
                    ->where('objectprodukfk',$r_PPL['produkfk'])
                    ->select('norec','qtyproduk')
                    ->get();
                //##

                $jmlPengurang =(float)$qtyJumlah;
                $kurangStok = (float)0;
                $dataSaldoAwal = collect(DB::select("select sum(qtyproduk) as qty from stokprodukdetail_t 
                            where kdprofile = $idProfile and objectruanganfk=$r_PPL[ruanganfk] and objectprodukfk=$r_PPL[produkfk]"))
                    ->first();
                $namaProduk = $r_PPL['namaproduk'];
                $saldoAwalIn = (float)$dataSaldoAwal->qty - $jmlPengurang;
                $sqty =0;
                foreach ($GetNorec as $item){
                    if ($item->qtyproduk > 0) {
                        $newSPD = StokProdukDetail::where('nostrukterimafk', $r_PPL['nostrukterimafk'])
                            ->where('kdprofile', $idProfile)
                            ->where('objectruanganfk', $r_PPL['ruanganfk'])
                            ->where('objectasalprodukfk', $r_PPL['asalprodukfk'])
                            ->where('objectprodukfk', $r_PPL['produkfk'])
                            ->where('norec', $item->norec)
                            ->first();

                        if ((float)$newSPD->qtyproduk <= (float)$jmlPengurang) {
                            $kurangStok = (float)$newSPD->qtyproduk;
                            $jmlPengurang = (float)$jmlPengurang - (float)$kurangStok;
                        } else {
                            $kurangStok = (float)$jmlPengurang;
                            $jmlPengurang = (float)$jmlPengurang - (float)$kurangStok;
                        }

                        $noTerimafk = $r_PPL['nostrukterimafk'];
                        if ($isRetur == true) {

                        } else {
                            DB::table('stokprodukdetail_t')
                                ->where('kdprofile', $idProfile)
                                ->where('norec', $item->norec)
                                ->sharedLock()
                                ->decrement('qtyproduk', (float)$kurangStok);
                        }
                    }
                }

                $dataKS[] =[];
                if ($isRetur == true){

                }else{
                    if((float)$dataSaldoAwal->qty == 0 || $jmlPengurang > (float)$dataSaldoAwal->qty){
                        $transMessage = "Simpan Resep Gagal, Stok Produk ". $namaProduk .", ada " . (float)$dataSaldoAwal->qty . " Data Stok Kurang Dari Qty Resep !";
                        DB::rollBack();
                        $result = array(
                            "status" => 400,
                            "message"  => $transMessage,
                            "as" => 'as@epic',
                        );
                        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                    }

                    //## KartuStok
                    $newKS = new KartuStok();
                    $norecKS = $newKS->generateNewId();
                    $newKS->norec = $norecKS;
                    $newKS->kdprofile = $idProfile;
                    $newKS->statusenabled = true;
                    $newKS->jumlah = $qtyJumlah;//$r_PPL['jumlah'];
                    $newKS->keterangan = 'Pelayanan Obat Alkes '.' '. $noResep .' '. $namaPasien;
                    $newKS->produkfk = $r_PPL['produkfk'];
                    $newKS->ruanganfk = $r_PPL['ruanganfk'];
                    $newKS->saldoawal = (float)$saldoAwalIn ;//- (float)$qtyJumlah;
                    $newKS->status = 0;
                    $newKS->tglinput = date('Y-m-d H:i:s');//$r_SR['tglresep'];//$r_SR['tglresep']->format('Y-m-d H:i:s');
                    $newKS->tglkejadian = date('Y-m-d H:i:s');//$r_SR['tglresep'];// $r_SR['tglresep']->format('Y-m-d H:i:s');
                    $newKS->nostrukterimafk =  $r_PPL['nostrukterimafk'];
                    $newKS->norectransaksi = $norec_PP;
                    $newKS->tabletransaksi = 'pelayananpasien_t';
                    $newKS->flagfk = 7;
                    $newKS->save();

                    $dataKS[] = $newKS;
                }

                //## Petugas
                $newP3 = new PelayananPasienPetugas();
                $norecKS = $newP3->generateNewId();
                $newP3->norec = $norecKS;
                $newP3->kdprofile = $idProfile;
                $newP3->statusenabled = true;
                $newP3->nomasukfk = $r_PPL['noregistrasifk'];
                $newP3->objectasalprodukfk = $r_PPL['asalprodukfk'];
                $newP3->objectjenispetugaspefk = 3;//Dokter Penanggung Jawab
                $newP3->objectprodukfk = $r_PPL['produkfk'];
                $newP3->objectruanganfk = $r_PPL['ruanganfk'];
                $newP3->pelayananpasien = $norec_PP;
                $newP3->tglpelayanan = $r_SR['tglresep'];//$r_SR['tglresep']->format('Y-m-d H:i:s');
                $newP3->objectpegawaifk = $dokterPenulis;
                $newP3->save();
            }

            $kdRuanganDepoRajal = $this->settingDataFixed('kdRuanganDepoRajal', $idProfile);
            if ($r_SR['noorder'] != 'EditResep') {
                if ($r_SR['noorder'] == '' || $r_SR['noorder'] != '') {
                    $historyOrder = StrukOrder::where('noorder', $r_SR['noorder'])->where('kdprofile', $idProfile)->first();                    
                    $noAntri = "";
                    if ($historyOrder != null ){
                        $noAntri = $historyOrder->noantri;
                    }
                    if ($noAntri != "" || $noAntri != null) {                        
                        $newAA = new AntrianApotik();
                        $norecAA = $newAA->generateNewId();
                        $newAA->norec = $norecAA;
                        $newAA->kdprofile = $idProfile;
                        $newAA->statusenabled = true;
                        $newAA->noantri = $historyOrder->noantri; //(int)$countAntrian + 1;//substr($noResep,-4);
                        $newAA->keterangan = $namaPasien;
                        $newAA->jenis = $racikanORnonracikan;
                        $newAA->tglresep = date('Y-m-d H:i:s');
                        $newAA->noresep = $noResep;
                        $newAA->save();
                    }elseif ($r_SR['noresep'] == '-'
                        && $r_SR['ruanganfk'] == (int)$kdRuanganDepoRajal) {                        
                        $countAntrian = AntrianApotik::where('jenis', $racikanORnonracikan)
                            ->where('kdprofile', $idProfile)
                            ->whereBetween('tglresep', [date('Y-m-d 00:00'), date('Y-m-d 23:59')])
                            ->max('noantri');

                        $noAntriApotik = (str_pad((int)$countAntrian + 1, 4, "0", STR_PAD_LEFT));
                        $newAA = new AntrianApotik();
                        $norecAA = $newAA->generateNewId();
                        $newAA->norec = $norecAA;
                        $newAA->kdprofile = $idProfile;
                        $newAA->statusenabled = true;
                        $newAA->noantri = $noAntriApotik; //(int)$countAntrian + 1;//substr($noResep,-4);
                        $newAA->keterangan = $namaPasien;
                        $newAA->jenis = $racikanORnonracikan;
                        $newAA->tglresep = date('Y-m-d H:i:s');
                        $newAA->noresep = $noResep;
                        $newAA->save();                        
                        if ($r_SR['noorder'] != 'EditResep' && $r_SR['noorder'] != '') {
                            $dataOrder = StrukOrder::where('noorder', $r_SR['noorder'])
                                ->where('kdprofile', $idProfile)
                                ->update([
                                    'noantri' => $noAntriApotik,
                                    'jenis' => $racikanORnonracikan,
                                    'keterangaantrian' => $namaPasien,
                                ]);
                        }
                    }
                }
            }

            //endregion
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $errMsg = $e->getMessage()." ".$e->getLine();
        }

//        $transMessage = "Kartu Stok Pasien";
//        $transStatus = 'false';
//
        if ($transStatus == 'true') {
            $transMessage = "Simpan Pelayanan Apotik Berhasil";
            DB::commit();
//            $cekSR = StrukResep::where('noresep',$newSR->noresep)->get();
//            if (count($cekSR) > 1){
//                if (isset($r_SR['isobatalkes']) && $r_SR['isobatalkes'] == true){
//                    $noResep = $this->generateCode(new StrukResep, 'noresep', 12, 'OA/' . $this->getDateTime()->format('ym') . '/');
//                }else{
//                    $noResep = $this->generateCode(new StrukResep, 'noresep', 12, 'O/' . $this->getDateTime()->format('ym') . '/');
//                }
//                $updateSR = StrukResep::where('norec',$norec_SR)->update([
//                        'noresep' => $noResep]
//                );
//            }
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "noresep" => $newSR,//$noResep,,//$noResep,
                "dataPP" => $dataPP,
                "dataKS" => $dataKS,
                "R_PPL" => $r_PPL,
//                "double" => count($cekSR),
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Simpan Pelayanan Apotik Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "noresep" => $newSR,//$noResep,
                "errmssg" => $errMsg,
                //"xxx" => $kdobatbayu,
                "as" => 'as@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDataWaktuMinum(Request $request) {
        // TES
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $detail=$request->all();
        $Norec=$request['Norec_sr'];
        $data = DB::select(DB::raw("SELECT ps.nocm,ps.namapasien,to_char(ps.tgllahir, 'DD-MM-YYYY') AS tgllahir,sr.noresep,to_char(sr.tglresep, 'DD-MM-YYYY') AS tglresep,
                             pr.namaproduk,pp.aturanpakai,pp.rke,CASE WHEN alm.alamatlengkap IS NULL THEN '-' ELSE alm.alamatlengkap END AS alamat,
                             ps.notelepon,ss.satuanstandar,pp.jumlah,CASE WHEN pp.ispagi = true THEN 'Pagi : 07:00 - 07:30' ELSE '-' END AS pagi,
                             CASE WHEN pp.issiang = true THEN 'Siang : 13:00 - 13:30' ELSE '-' END AS siang,
                             CASE WHEN pp.issore = true THEN 'Sore : 13:00 - 13:30' ELSE '-' END AS sore,
                             CASE WHEN pp.ismalam = true THEN 'Malam : 19:00 - 20:00' ELSE '-' END AS malam,
                             pp.keteranganpakai
                             FROM pelayananpasien_t AS pp
                             INNER JOIN strukresep_t AS sr ON sr.norec = pp.strukresepfk
                             INNER JOIN produk_m AS pr ON pr.id = pp.produkfk
                             INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.norec = pp.noregistrasifk
                             INNER JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk
                             INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                             LEFT JOIN alamat_m AS alm ON alm.nocmfk = ps.id
                             LEFT JOIN satuanstandar_m AS ss ON ss.id = pp.satuanviewfk
                             WHERE pp.kdprofile = $idProfile and pp.jeniskemasanfk = 2 AND sr.norec = '$Norec'            
                             UNION ALL                
                             SELECT DISTINCT ps.nocm,ps.namapasien,to_char(ps.tgllahir, 'DD-MM-YYYY') AS tgllahir,sr.noresep,to_char(sr.tglresep, 'DD-MM-YYYY') AS tglresep,
                             'rke-' || pp.rke || ' Racikan' AS namaproduk,pp.aturanpakai,pp.rke,CASE WHEN alm.alamatlengkap IS NULL THEN '-' ELSE alm.alamatlengkap END AS alamat,
                             ps.notelepon,CASE WHEN jr.jenisracikan IS NULL THEN '' ELSE jr.jenisracikan END AS satuanstandar,
                             ((pp.qtydetailresep / CAST(pp.dosis AS INTEGER)) * CAST(pro.kekuatan AS INTEGER)) AS jumlah,
                             CASE WHEN pp.ispagi = true THEN 'Pagi : 07:00 - 07:30' ELSE '-' END AS pagi,
                             CASE WHEN pp.issiang = true THEN 'Siang : 13:00 - 13:30' ELSE '-' END AS siang,
                             CASE WHEN pp.issore = true THEN 'Sore : 13:00 - 13:30' ELSE '-' END AS sore,
                             CASE WHEN pp.ismalam = true THEN 'Malam : 19:00 - 20:00' ELSE '-' END AS malam,
                             pp.keteranganpakai
                             FROM strukresep_t AS sr
                             INNER JOIN pelayananpasien_t AS pp ON sr.norec = pp.strukresepfk
                             INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.norec = sr.pasienfk
                             INNER JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk
                             INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                             LEFT JOIN alamat_m AS alm ON alm.nocmfk = ps.id
                             INNER JOIN produk_m AS pro ON pro.id = pp.produkfk
                             LEFT JOIN satuanstandar_m AS ss ON ss.id = pp.satuanviewfk
                             LEFT JOIN jenisracikan_m AS jr ON jr.id = pp.jenisobatfk
                             WHERE sr.kdprofile = $idProfile and  pp.jeniskemasanfk = 1 AND sr.norec = '$Norec'"));
        return $this->respond($data);
    }

    public function getTransaksiPelayananObatKronis(Request $request) {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $detail=$request->all();
        $result=[];
        $data = \DB::table('pelayananpasienobatkronis_t as pp')
            ->JOIN('antrianpasiendiperiksa_t as apd','apd.norec','=','pp.noregistrasifk')
            ->JOIN('pasiendaftar_t as pd','pd.norec','=','apd.noregistrasifk')
            ->JOIN('pasien_m as ps','ps.id','=','pd.nocmfk')
            ->leftJOIN('jeniskelamin_m as jk','jk.id','=','ps.objectjeniskelaminfk')
            ->leftJOIN('produk_m as pr','pr.id','=','pp.produkfk')
            ->leftJOIN('ruangan_m as ru','ru.id','=','apd.objectruanganfk')
            ->leftJOIN('jeniskemasan_m as jkm','jkm.id','=','pp.jeniskemasanfk')
            ->leftJoin('jenisracikan_m as jra','jra.id','=','pp.jenisobatfk')
            ->leftJoin('satuanstandar_m as ss','ss.id','=','pp.satuanviewfk')
            ->leftJoin('satuanstandar_m as ss2','ss2.id','=','pr.objectsatuanstandarfk')
            ->leftJOIN('detailjenisproduk_m as djp','djp.id','=','pr.objectdetailjenisprodukfk')
            ->leftJOIN('jenisproduk_m as jp','jp.id','=','djp.objectjenisprodukfk')
            ->leftJOIN('strukpelayanan_t as sp','sp.norec','=','pp.strukfk')
            ->leftJOIN('konversisatuan_t as ks', function($join){
                $join->on('ks.objekprodukfk', '=', 'pr.id')
                    ->on('ks.satuanstandar_tujuan', '=', 'pp.satuanviewfk');
            })
            ->JOIN('strukresep_t as sr','sr.norec','=','pp.strukresepfk')
            ->leftJOIN('ruangan_m as ru2','ru2.id','=','sr.ruanganfk')
            ->select('ps.nocm','ps.namapasien','jk.jeniskelamin','pp.tglpelayanan','pp.produkfk','pr.namaproduk',
                'ss.satuanstandar','pp.jumlah','pp.hargasatuan','pp.hargadiscount','sp.nostruk','pd.noregistrasi',
                'ks.nilaikonversi','ss2.satuanstandar as satuanstandar2','sr.noresep','sr.norec as norec_resep','pp.rke',
                'jkm.jeniskemasan','jk.id as jkid','pp.jenisobatfk','jra.jenisracikan','pp.jasa','ru2.id as ruangandepoid','ru2.namaruangan as ruangandepo',
                DB::raw("sr.noresep || '/23' as noresepok"))
            ->where('pd.kdprofile', $kdProfile)
            ->where('jp.id',97)
            ->orderBy('pp.tglpelayanan','pp.rke');
        if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('ps.nocm','=', $request['nocm']);
        }
        if(isset($request['noregistrasifk']) && $request['noregistrasifk']!="" && $request['noregistrasifk']!="undefined"){
            $data = $data->where('pp.noregistrasifk','=', $request['noregistrasifk']);
        }
        if(isset($request['noReg']) && $request['noReg']!="" && $request['noReg']!="undefined"){
            $data = $data->where('pd.noregistrasi','=', $request['noReg']);
        }
        if(isset($request['norec_resep']) && $request['norec_resep']!="" && $request['norec_resep']!="undefined"){
            $data = $data->where('pp.strukresepfk','=', $request['norec_resep']);
        }
        $data = $data->get();

        $rke=0;
        foreach ($data as $item){
            if (isset($item->nilaikonversi)){
                $nKonversi = $item->nilaikonversi;
            }else{
                $nKonversi=1;
            }
            if (isset($item->satuanstandar)){
                $ss = $item->satuanstandar;
            }else{
                $ss = $item->satuanstandar2;
            }
            $JenisKemasan=$item->jeniskemasan;
            if(isset($item->jenisracikan)){
                $JenisKemasan=$item->jeniskemasan .'/'. $item->jenisracikan;
            }
//            $tarifjasa =0;
//            $qty20 =0;
//            if ($item->jkid == 2){
//                $tarifjasa = 800;
//            }
////            $rke = 0;
//            if ($item->rke != $rke) {
//                if ($item->jkid == 1) {
//                    $rke=$item->rke;
//                    $qty20 = number_format($item->jumlah / 20, 0);
//                    if ($item->jumlah % 20 == 0) {
//                        $qty20 = $qty20;
//                    } else {
//                        $qty20 = $qty20 + 1;
//                    }
//
//                    $tarifjasa = 800 * $qty20;
//                }
//            }
            $jasa=0;
            if(isset($item->jasa) && $item->jasa!="" && $item->jasa!="undefined"){
                $jasa=$item->jasa;
            }

            $result[]=array(
                'nocm' => $item->nocm,
                'namapasien' => $item->namapasien,
                'jeniskelamin' => $item->jeniskelamin,
                'tglpelayanan' => $item->tglpelayanan,
                'produkfk' => $item->produkfk,
                'namaproduk' => $item->namaproduk,
                'satuanstandar' => $ss,
                'jumlah' => (float)$item->jumlah / (float)$nKonversi,
                'hargasatuan' => $item->hargasatuan,
                'hargadiscount' => $item->hargadiscount,
                'nostruk' => $item->nostruk,
                'noregistrasi' => $item->noregistrasi,
                'noresep' => $item->noresep,// .'/'.$item->noregistrasi,
                'rke' => $item->rke,
                'jeniskemasan' => $JenisKemasan,
                'norec_resep' =>  $item->norec_resep,
                'detail' => $detail,
                'jasa' =>$jasa,
                'depoid' => $item->ruangandepoid,
                'namaruangandepo' => $item->ruangandepo,
                'noresepok' => $item->noresepok
            );
        }
        return $this->respond($result);
    }

    public function SimpanPelayananObatKronis(Request $request) {
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        $r_SR=$request['strukresep'];
        try {
            $dataPPOK = PelayananPasienObatKronis::where('strukresepfk', $request['norecresep'])->first();
//            return $this->respond($dataPPOK);
            foreach ($request['pelayananpasienobatkronis'] as $item) {
                if ($dataPPOK == null){
                    $newPP = new PelayananPasienObatKronis();
                    $norecPPOK= $newPP->generateNewId();
                    $newPP->norec = $norecPPOK;
                    $newPP->kdprofile = $kdProfile;
                    $newPP->statusenabled = true;
                    $qtyJumlah = $item['jumlahcetak'];
                    $newPP->noregistrasifk = $item['noregistrasifk'];
                    $newPP->aturanpakai = $item['aturanpakai'];
                    if (isset($item['generik'])){
                        $newPP->generik = $item['generik'];
                    }
                    $newPP->hargadiscount = $item['hargadiscount'];
                    $newPP->hargajual = $item['hargajual'];
                    $newPP->hargasatuan = $item['hargasatuan'];
                    $newPP->jenisobatfk = $item['jenisobatfk'];
                    $newPP->jumlah = $qtyJumlah;
                    $newPP->kelasfk = $item['kelasfk'];
                    $newPP->kdkelompoktransaksi = 1;
                    $newPP->produkfk = $item['produkfk'];
                    if (isset($item['routefk'])){
                        $newPP->routefk = $item['routefk'];
                    }
                    $newPP->stock = $item['stock'];
                    $newPP->tglpelayanan = $r_SR['tglresep'];
                    $newPP->harganetto = $item['harganetto'];
                    $newPP->jeniskemasanfk = $item['jeniskemasanfk'];
                    $newPP->rke = $item['rke'];
                    $newPP->strukresepfk = $request['norecresep'];
                    $newPP->satuanviewfk = $item['satuanviewfk'];
                    $newPP->nilaikonversi = $item['nilaikonversi'];
                    $newPP->strukterimafk = $item['nostrukterimafk'];
                    $newPP->dosis = $item['dosis'];
                    $newPP->jasa = $item['jasa'];
                    $newPP->isobat = 1;
                    $newPP->save();
                }else{
                    $delPP = PelayananPasienObatKronis::where('strukresepfk', $request['norecresep'])->delete();
                    $newPP = new PelayananPasienObatKronis();
                    $norecPPOK= $newPP->generateNewId();
                    $newPP->norec = $norecPPOK;
                    $newPP->kdprofile = 0;
                    $newPP->statusenabled = true;
                    $qtyJumlah = $item['jumlahcetak'];
                    $newPP->noregistrasifk = $item['noregistrasifk'];
                    $newPP->aturanpakai = $item['aturanpakai'];
                    if (isset($item['generik'])){
                        $newPP->generik = $item['generik'];
                    }
                    $newPP->hargadiscount = $item['hargadiscount'];
                    $newPP->hargajual = $item['hargajual'];
                    $newPP->hargasatuan = $item['hargasatuan'];
                    $newPP->jenisobatfk = $item['jenisobatfk'];
                    $newPP->jumlah = $qtyJumlah;
                    $newPP->kelasfk = $item['kelasfk'];
                    $newPP->kdkelompoktransaksi = 1;
                    $newPP->produkfk = $item['produkfk'];
                    if (isset($item['routefk'])){
                        $newPP->routefk = $item['routefk'];
                    }
                    $newPP->stock = $item['stock'];
                    $newPP->tglpelayanan = $r_SR['tglresep'];
                    $newPP->harganetto = $item['harganetto'];
                    $newPP->jeniskemasanfk = $item['jeniskemasanfk'];
                    $newPP->rke = $item['rke'];
                    $newPP->strukresepfk = $request['norecresep'];
                    $newPP->satuanviewfk = $item['satuanviewfk'];
                    $newPP->nilaikonversi = $item['nilaikonversi'];
                    $newPP->strukterimafk = $item['nostrukterimafk'];
                    $newPP->dosis = $item['dosis'];
                    $newPP->jasa = $item['jasa'];
                    $newPP->isobat = 1;
                    $newPP->save();
                }

                $ruanganfk= $request['strukresep']['ruanganfk'];

                $GetNorec = StokProdukDetail::where('nostrukterimafk',$item['nostrukterimafk'])
                    ->where('kdprofile', $kdProfile)
                    ->where('objectruanganfk',$ruanganfk)
                    ->where('objectasalprodukfk',$item['asalprodukfk'])
                    ->where('objectprodukfk',$item['produkfk'])
                    ->select('norec','qtyproduk')
                    ->get();
                //##


                $jmlPengurang =(float)$qtyJumlah;
                $kurangStok = (float)0;
                $dataSaldoAwal = collect(DB::select("select sum(qtyproduk) as qty from stokprodukdetail_t 
                            where kdprofile = $kdProfile and objectruanganfk=$ruanganfk and objectprodukfk=$item[produkfk]"))
                    ->first();

                $saldoAwalIn = (float)$dataSaldoAwal->qty - $jmlPengurang;
                $sqty =0;
                foreach ($GetNorec as $items){
                    if ($items->qtyproduk > 0) {
                        $newSPD = StokProdukDetail::where('nostrukterimafk', $item['nostrukterimafk'])
                            ->where('kdprofile', $kdProfile)
                            ->where('objectruanganfk', $ruanganfk)
                            ->where('objectasalprodukfk', $item['asalprodukfk'])
                            ->where('objectprodukfk', $item['produkfk'])
                            ->where('norec', $items->norec)
                            ->first();

//                        return $this->respond($newSPD);

                        if ((float)$newSPD->qtyproduk <= (float)$jmlPengurang) {
                            $kurangStok = (float)$newSPD->qtyproduk;
                            $jmlPengurang = (float)$jmlPengurang - (float)$kurangStok;
                        } else {
                            $kurangStok = (float)$jmlPengurang;
                            $jmlPengurang = (float)$jmlPengurang - (float)$kurangStok;
                        }

                        $noTerimafk = $items['nostrukterimafk'];
                        DB::table('stokprodukdetail_t')
                            ->where('kdprofile', $kdProfile)
                            ->where('norec', $items->norec)
                            ->sharedLock()
                            ->decrement('qtyproduk', (float)$kurangStok);
                    }
                }
                $newKS = new KartuStok();
                $norecKS = $newKS->generateNewId();
                $newKS->norec = $norecKS;
                $newKS->kdprofile = $kdProfile;
                $newKS->statusenabled = true;
                $newKS->jumlah = $qtyJumlah;//$r_PPL['jumlah'];
                $newKS->keterangan = 'Pelayanan Obat Kronis '.' '. $request['strukresep']['noresep'] .' '. $request['strukresep']['namapasien'];
                $newKS->produkfk = $item['produkfk'];
                $newKS->ruanganfk = $item['ruanganfk'];
                $newKS->saldoawal = (float)$saldoAwalIn ;//- (float)$qtyJumlah;
                $newKS->status = 0;
                $newKS->tglinput = date('Y-m-d H:i:s');//$r_SR['tglresep'];//$r_SR['tglresep']->format('Y-m-d H:i:s');
                $newKS->tglkejadian = date('Y-m-d H:i:s');//$r_SR['tglresep'];// $r_SR['tglresep']->format('Y-m-d H:i:s');
                $newKS->nostrukterimafk =  $item['nostrukterimafk'];
                $newKS->norectransaksi = $norecPPOK;
                $newKS->tabletransaksi = 'pelayananpasienobatkronis_t';
                $newKS->flagfk = 7;
                $newKS->save();

                $dataKS[] = $newKS;
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Gagal";
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Pelayanan Obat Kronis Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "noresep" => $newPP,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Simpan Pelayanan Obat Kronis Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
//                "noresep" => $newPP,//$noResep,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getLaporanPenjualanObatNew(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tglAwal= $request['tglAwal'];
        $tglAkhir= $request['tglAkhir'];
        $namaproduk='';
        $dokid= '';
        $kpid='';
        $ruid='';
        $statusBayar='';

        if(isset($request['dokid']) && $request['dokid']!="" && $request['dokid']!="undefined"){
            $dokid = ' and pg.id='.$request['dokid'];
        }
        if(isset($request['kpid']) && $request['kpid']!="" && $request['kpid']!="undefined"){
            $kpid = ' and pd.objectkelompokpasienlastfk='.$request['kpid'];
        }
        if(isset($request['ruid']) && $request['ruid']!="" && $request['ruid']!="undefined"){
            $ruid = ' and ru.id='.$request['ruid'];
        }
        if(isset( $request['namaproduk'])&&  $request['namaproduk']!='undefined'){
            $namaproduk = "and pr.namaproduk  ILIKE '%". $request['namaproduk']."%'";
        }
        if(isset( $request['namaproduk'])&&  $request['namaproduk']!='undefined'){
            $namaproduk = "and pr.namaproduk  ILIKE '%". $request['namaproduk']."%'";
        }
        if(isset( $request['statusBayar'])&&  $request['statusBayar']=='1'){
            $statusBayar = "and sbmsdhbyr.tglsbm is not null";
        }
        if(isset( $request['statusBayar'])&&  $request['statusBayar']=='2'){
            $statusBayar = "and sbmsdhbyr.tglsbm is null";
        }


//        $data=DB::select(DB::raw("SELECT x.tglresep,x.noresep,x.noregistrasi,x.nocm,x.namapasien,x.jeniskelamin,x.kelompokpasien,x.namalengkap,
//                                               x.ruanganapotik,SUM(x.tunai) AS tunai,SUM(x.penjamin) AS penjamin
//              FROM(SELECT TO_CHAR(sr.tglresep, 'DD-MM-YYYY') AS tglresep,sr.noresep,pd.noregistrasi,ps.nocm,UPPER(ps.namapasien) AS namapasien,
//              UPPER(jk.reportdisplay) AS jeniskelamin,kp.kelompokpasien,
//              CASE WHEN pg.namalengkap IS NULL THEN '-' ELSE pg.namalengkap END AS namalengkap,ru.namaruangan AS ruanganapotik,
//              CASE WHEN kp.kelompokpasien = 'Umum/Pribadi' AND sp.totalharusdibayar IS NOT NULL THEN sp.totalharusdibayar ELSE 0 END AS tunai,
//			  CASE WHEN kp.kelompokpasien <> 'Umum/Pribadi' AND sp.totalprekanan IS NOT NULL THEN sp.totalprekanan ELSE 0 END AS penjamin
//              FROM strukresep_t as sr
//              INNER JOIN pelayananpasien_t AS pp ON pp.strukresepfk = sr.norec
//              INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.norec=sr.pasienfk
//              INNER JOIN pasiendaftar_t AS pd ON pd.norec=apd.noregistrasifk
//              INNER JOIN pasien_m AS ps ON ps.id=pd.nocmfk
//              LEFT JOIN jeniskelamin_m AS jk ON jk.id=ps.objectjeniskelaminfk
//              LEFT JOIN pegawai_m AS pg ON pg.id=sr.penulisresepfk
//              LEFT JOIN ruangan_m AS ru ON ru.id=sr.ruanganfk
//              LEFT JOIN kelompokpasien_m kp ON kp.id=pd.objectkelompokpasienlastfk
//              INNER JOIN strukpelayanan_t AS sp ON sp.norec = pp.strukfk
//              WHERE sr.kdprofile = $kdProfile and sr.tglresep BETWEEN '$tglAwal' and '$tglAkhir'
//              $dokid
//              $kpid
//              $ruid
//
//            UNION ALL
//
//              SELECT TO_CHAR(sp.tglstruk, 'DD-MM-YYYY') AS tglresep,sp.nostruk AS noresep,'-' AS noregistrasi,'-' AS nocm,
//              UPPER(sp.namapasien_klien) AS namapasien,'-' AS jeniskelamin,'Umum/Pribadi' as kelompokpasien,
//              CASE WHEN pg.namalengkap IS NULL THEN '-' ELSE pg.namalengkap END AS namalengkap,ru.namaruangan AS ruanganapotik,
//              sp.totalharusdibayar AS tunai, 0 AS penjamin
//              FROM strukpelayanan_t as sp
//              LEFT JOIN strukpelayanandetail_t as spd on spd.nostrukfk = sp.norec
//              LEFT JOIN pegawai_m as pg on pg.id=sp.objectpegawaipenanggungjawabfk
//              INNER JOIN strukbuktipenerimaan_t as sbm on sbm.norec = sp.nosbmlastfk
//              LEFT JOIN pegawai_m as pg2 on pg2.id = sbm.objectpegawaipenerimafk
//              LEFT JOIN loginuser_s as lu on lu.id = sbm.objectpegawaipenerimafk
//              LEFT JOIN pegawai_m as pg3 on pg3.id = lu.objectpegawaifk
//              LEFT JOIN ruangan_m as ru on ru.id=sp.objectruanganfk
//              WHERE sp.kdprofile = $kdProfile and sp.tglstruk BETWEEN '$tglAwal' and '$tglAkhir'
//                AND sp.nostruk_intern='-' AND substring(sp.nostruk,1,2)='OB'
//                $dokid
//              $ruid
//            UNION ALL
//
//              SELECT  TO_CHAR(sp.tglstruk, 'DD-MM-YYYY') AS tglresep,sp.nostruk AS noresep,'-' AS noregistrasi,ps.nocm,
//              UPPER(sp.namapasien_klien) AS namapasien,UPPER(jk.reportdisplay) AS jeniskelamin,
//              'Umum/Pribadi' as kelompokpasien,CASE WHEN pg.namalengkap IS NULL THEN '-' ELSE pg.namalengkap END AS namalengkap,
//              ru.namaruangan AS ruanganapotik,sp.totalharusdibayar AS tunai, 0 AS penjamin
//              FROM strukpelayanan_t as sp
//              INNER JOIN strukpelayanandetail_t as spd on spd.nostrukfk = sp.norec
//              INNER JOIN strukbuktipenerimaan_t as sbm on sbm.norec = sp.nosbmlastfk
//              LEFT JOIN pegawai_m as pg2 on pg2.id = sbm.objectpegawaipenerimafk
//              LEFT JOIN loginuser_s as lu on lu.objectpegawaifk = sbm.objectpegawaipenerimafk
//              LEFT JOIN pasien_m as ps on ps.nocm=sp.nostruk_intern
//              LEFT JOIN jeniskelamin_m as jk on jk.id=ps.objectjeniskelaminfk
//              LEFT JOIN pegawai_m as pg on pg.id=sp.objectpegawaipenanggungjawabfk
//              LEFT JOIN ruangan_m as ru on ru.id=sp.objectruanganfk
//              WHERE sp.kdprofile = $kdProfile and sp.tglstruk BETWEEN '$tglAwal' and '$tglAkhir'
//                AND sp.nostruk_intern not in ('-') AND substring(sp.nostruk,1,2)='OB'
//                $dokid
//              $ruid
//
//              ) AS x GROUP BY x.tglresep,x.noresep,x.noregistrasi,x.nocm,x.namapasien,
//              x.jeniskelamin,x.kelompokpasien,x.namalengkap,x.ruanganapotik"));

//SELECT TO_CHAR(sr.tglresep, 'DD-MM-YYYY') AS tglresep,
                //        CASE WHEN ru1.objectdepartemenfk = 16 AND kmr.namakamar IS NULL AND tt.nomorbed IS NULL THEN 
                //        ru1.namaruangan || '[]'
                //        WHEN ru1.objectdepartemenfk = 16 AND kmr.namakamar IS NOT NULL AND tt.nomorbed IS NOT NULL THEN
                //        ru1.namaruangan || '[' || CASE WHEN kmr.namakamar IS NULL THEN '' ELSE kmr.namakamar END || ' ' || 
                //        CASE WHEN tt.nomorbed IS NULL THEN null ELSE tt.nomorbed END || ']'
                //        ELSE dep1.namadepartemen END AS departemen,ru.namaruangan AS gudang,
                //        --pg1.namalengkap as user,
                //        pro.namaproduk,ss.satuanstandar,pp.jumlah,pp.hargajual,(pp.jumlah*pp.hargajual) AS subtotal,
                //        pp.hargadiscount,pd.noregistrasi,ps.nocm,ps.namapasien,pg.namalengkap as dokter,sr.noresep
                // FROM strukresep_t as sr
                // INNER JOIN pelayananpasien_t AS pp ON pp.strukresepfk = sr.norec
                // INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.norec=sr.pasienfk
                // INNER JOIN pasiendaftar_t AS pd ON pd.norec=apd.noregistrasifk
                // INNER JOIN pasien_m AS ps ON ps.id=pd.nocmfk
                // LEFT JOIN jeniskelamin_m AS jk ON jk.id=ps.objectjeniskelaminfk
                // LEFT JOIN pegawai_m AS pg ON pg.id=sr.penulisresepfk
                // LEFT JOIN ruangan_m AS ru ON ru.id=sr.ruanganfk
                // LEFT JOIN ruangan_m AS ru1 ON ru1.id = apd.objectruanganfk
                // LEFT JOIN departemen_m AS dep ON dep.id = ru1.objectdepartemenfk
                // LEFT JOIN departemen_m AS dep1 ON dep1.id = ru.objectdepartemenfk
                // LEFT JOIN kamar_m AS kmr ON kmr.id = apd.objectkamarfk
                // LEFT JOIN tempattidur_m AS tt ON tt.id = apd.nobed
                // LEFT JOIN kelompokpasien_m kp ON kp.id=pd.objectkelompokpasienlastfk
                // LEFT JOIN strukpelayanan_t AS sp ON sp.norec = pp.strukfk
                // --LEFT JOIN logginguser_t AS lg ON lg.noreff = sr.norec AND lg.jenislog = 'Input Resep Apotik'
                // --LEFT JOIN loginuser_s AS lu ON lu.id = lg.objectloginuserfk
                // --LEFT JOIN pegawai_m AS pg1 ON pg1.id = lu.objectpegawaifk
                // LEFT JOIN produk_m AS pro ON pro.id = pp.produkfk 
                // LEFT JOIN satuanstandar_m AS ss ON ss.id = pp.satuanviewfk
                // WHERE pd.statusenabled=true AND sr.statusenabled = true AND sr.kdprofile = $kdProfile and sr.tglresep BETWEEN '$tglAwal' and '$tglAkhir'
                // $dokid
                // $kpid
                // $ruid
                
                
                // UNION ALL
                
                // SELECT TO_CHAR(sp.tglstruk, 'DD-MM-YYYY') AS tglresep,dep.namadepartemen AS departemen,
                //        ru.namaruangan AS gudang,
                //        --pg1.namalengkap as user,
                //        pro.namaproduk,ss.satuanstandar,
                //        spd.qtyproduk as jumlah,spd.harganetto AS hargajual,(spd.qtyproduk*spd.harganetto) AS subtotal,
                //        spd.hargadiscount,'' as noregistrasi,sp.nostruk_intern as nocm,sp.namapasien_klien as namapasien,
                //        pg.namalengkap as dokter,sp.nostruk AS noresep
                // FROM strukpelayanan_t as sp
                // INNER JOIN strukpelayanandetail_t as spd on spd.nostrukfk = sp.norec
                // LEFT JOIN pegawai_m as pg on pg.id=sp.objectpegawaipenanggungjawabfk
                // LEFT JOIN strukbuktipenerimaan_t as sbm on sbm.norec = sp.nosbmlastfk
                // LEFT JOIN pegawai_m as pg2 on pg2.id = sbm.objectpegawaipenerimafk
                // LEFT JOIN loginuser_s as lu on lu.id = sbm.objectpegawaipenerimafk
                // LEFT JOIN pegawai_m as pg3 on pg3.id = lu.objectpegawaifk
                // LEFT JOIN ruangan_m as ru on ru.id = sp.objectruanganfk
                // LEFT JOIN departemen_m AS dep ON dep.id = ru.objectdepartemenfk
                // --LEFT JOIN logginguser_t AS lg ON lg.noreff = sp.norec AND lg.jenislog = 'Input Resep Obat Bebas'
                // --LEFT JOIN loginuser_s AS lu1 ON lu1.id = lg.objectloginuserfk
                // --LEFT JOIN pegawai_m AS pg1 ON pg1.id = lu.objectpegawaifk
                // LEFT JOIN produk_m AS pro ON pro.id = spd.objectprodukfk
                // LEFT JOIN satuanstandar_m AS ss ON ss.id = spd.objectsatuanstandarfk
                // WHERE sp.statusenabled = true AND sp.kdprofile = $kdProfile and sp.tglstruk BETWEEN '$tglAwal' and '$tglAkhir'
                // AND substring(sp.nostruk,1,2)='OB'
                // $dokid
                // $ruid

        $data = DB::select(DB::raw("
                SELECT
                    pr.namaproduk AS namaobat,
                    pp.tglpelayanan AS tanggal,
                    ps.nocm AS norm,
                    pp.jumlah AS qty,
                    pp.hargajual,
                    pp.harganetto,
                    pp.hargadiscount,
                    (pp.hargajual * pp.jumlah) as totalhargajual,
                    (pp.harganetto * pp.jumlah) as totalhargabeli,
                    (
                        case when (pp.hargajual != 0) then
                            coalesce(pp.hargadiscount,0)/pp.hargajual
                        else
                            0
                        end										
                    )*100 as persendiskon,
                    ((pp.hargajual - (coalesce(pp.hargadiscount,0))) * jumlah) as totalhargajualdiskon,
                    sbmsdhbyr.tglsbm
                FROM
                pelayananpasien_t AS pp
                INNER JOIN produk_m AS pr ON pr.id = pp.produkfk
                INNER JOIN strukresep_t AS sr ON sr.norec = pp.strukresepfk
                LEFT JOIN strukpelayanan_t AS sp ON sp.norec = pp.strukfk
                LEFT JOIN strukbuktipenerimaan_t as sbmsdhbyr on sbmsdhbyr.norec = sp.nosbmlastfk and sbmsdhbyr.statusenabled = true
                INNER JOIN ruangan_m AS rudp ON rudp.id = sr.ruanganfk
                INNER JOIN antrianpasiendiperiksa_t AS apd ON sr.pasienfk = apd.norec
                INNER JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk
                INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                INNER JOIN ruangan_m AS rupx ON rupx.id = apd.objectruanganfk
                INNER JOIN departemen_m AS dp ON dp.id = rupx.objectdepartemenfk
                LEFT JOIN LATERAL (
                    SELECT
                        apdtemp.norec,
                        apdtemp.tglmasuk,
                        apdtemp.noregistrasifk,
                        apdtemp.objectruanganfk,
                        rutemp.objectdepartemenfk,
                        rutemp.namaruangan
                    FROM
                        antrianpasiendiperiksa_t apdtemp
                    INNER JOIN ruangan_m rutemp ON rutemp. ID = apdtemp.objectruanganfk
                    WHERE
                        apdtemp.statusenabled = TRUE
                    AND apdtemp.noregistrasifk = pd.norec
                    AND rutemp.objectdepartemenfk IN (31, 25, 56,24,35,17,34,30,16,18,19,28,26,62)
                    AND apdtemp.tglmasuk <= pp.tglpelayanan
                    AND pp.tglpelayanan between '$tglAwal' and '$tglAkhir'
                    $namaproduk
                    $dokid
                    $kpid
                    $ruid
                    $statusBayar
                    ORDER BY
                        apd.tglmasuk DESC
                    LIMIT 1
                ) apdtemp ON apdtemp.noregistrasifk = pd.norec
                WHERE
                    pd.statusenabled = TRUE
                AND sr.statusenabled = TRUE
                AND pp.statusenabled = TRUE
                AND apd.statusenabled = TRUE   
                AND pp.isobat = true /* grhasia ada tarif service yg diinput via input tindakan dia punya noresep tapi bukan obat isobat nya isinya null...aing*/ 
                AND pp.tglpelayanan between '$tglAwal' and '$tglAkhir'  
                $namaproduk
                $dokid
                $kpid
                $ruid     
                $statusBayar         
        "));


        $result = array(
            'daftar' => $data,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }

    public function getLaporanPenjualanObatDetail(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tglAwal= $request['tglAwal'];
        $tglAkhir= $request['tglAkhir'];
        $dokid= '';
        $kpid='';
        $ruid='';
        $sudahbayar= '';
        $rajalRanap= '';
        $rajalRanapObatBebas= '';
        $namaItem = '';
        $namaPasienText = '';
        if(isset($request['namaItem']) && $request['namaItem']!="" && $request['namaItem']!="undefined"){
            $namaItem = ' and pro.id='.$request['namaItem'];
        }
        $namaItemText = '';
        if(isset($request['namaItemText']) && $request['namaItemText']!="" && $request['namaItemText']!="undefined"){
            $namaItemText = " and pro.namaproduk ilike '%".$request['namaItemText']."%' ";
        }

        $namaPasienText = '';
        $namaPasienTextSP = '';
        if(isset($request['namaPasienText']) && $request['namaPasienText']!="" && $request['namaPasienText']!="undefined"){
            $namaPasienText = " and ps.namapasien ilike '%".$request['namaPasienText']."%' ";
            $namaPasienTextSP = " and sp.namapasien_klien ilike '%".$request['namaPasienText']."%' ";
        }
        

        if(isset($request['dokid']) && $request['dokid']!="" && $request['dokid']!="undefined"){
            $dokid = ' and pg.id='.$request['dokid'];
        }
        if(isset($request['kpid']) && $request['kpid']!="" && $request['kpid']!="undefined"){
            $kpid = ' and pd.objectkelompokpasienlastfk='.$request['kpid'];
        }
        if(isset($request['ruid']) && $request['ruid']!="" && $request['ruid']!="undefined"){
            $ruid = ' and ru.id='.$request['ruid'];
        }
        if(isset( $request['rajalRanap'])&&  $request['rajalRanap']=='1'){//rajal
            $rajalRanap = "and ru1.objectdepartemenfk <> 16 ";
            $rajalRanapObatBebas = "and ru.objectdepartemenfk <> 16";//obat bebas pasti bakal ikut;asumsi ob dimunculin juga di laporan apotik rajal
        }
        if(isset( $request['rajalRanap'])&&  $request['rajalRanap']=='2'){//ranap
            $rajalRanap = "and ru1.objectdepartemenfk = 16 ";
            $rajalRanapObatBebas = "and ru.objectdepartemenfk = 16";//ini ga mungkin terjadi
        }
        


//        $data=DB::select(DB::raw("SELECT x.tglresep,x.noresep,x.noregistrasi,x.nocm,x.namapasien,x.jeniskelamin,x.kelompokpasien,x.namalengkap,
//                                               x.ruanganapotik,SUM(x.tunai) AS tunai,SUM(x.penjamin) AS penjamin
//              FROM(SELECT TO_CHAR(sr.tglresep, 'DD-MM-YYYY') AS tglresep,sr.noresep,pd.noregistrasi,ps.nocm,UPPER(ps.namapasien) AS namapasien,
//              UPPER(jk.reportdisplay) AS jeniskelamin,kp.kelompokpasien,
//              CASE WHEN pg.namalengkap IS NULL THEN '-' ELSE pg.namalengkap END AS namalengkap,ru.namaruangan AS ruanganapotik,
//              CASE WHEN kp.kelompokpasien = 'Umum/Pribadi' AND sp.totalharusdibayar IS NOT NULL THEN sp.totalharusdibayar ELSE 0 END AS tunai,
//			  CASE WHEN kp.kelompokpasien <> 'Umum/Pribadi' AND sp.totalprekanan IS NOT NULL THEN sp.totalprekanan ELSE 0 END AS penjamin
//              FROM strukresep_t as sr
//              INNER JOIN pelayananpasien_t AS pp ON pp.strukresepfk = sr.norec
//              INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.norec=sr.pasienfk
//              INNER JOIN pasiendaftar_t AS pd ON pd.norec=apd.noregistrasifk
//              INNER JOIN pasien_m AS ps ON ps.id=pd.nocmfk
//              LEFT JOIN jeniskelamin_m AS jk ON jk.id=ps.objectjeniskelaminfk
//              LEFT JOIN pegawai_m AS pg ON pg.id=sr.penulisresepfk
//              LEFT JOIN ruangan_m AS ru ON ru.id=sr.ruanganfk
//              LEFT JOIN kelompokpasien_m kp ON kp.id=pd.objectkelompokpasienlastfk
//              INNER JOIN strukpelayanan_t AS sp ON sp.norec = pp.strukfk
//              WHERE sr.kdprofile = $kdProfile and sr.tglresep BETWEEN '$tglAwal' and '$tglAkhir'
//              $dokid
//              $kpid
//              $ruid
//
//            UNION ALL
//
//              SELECT TO_CHAR(sp.tglstruk, 'DD-MM-YYYY') AS tglresep,sp.nostruk AS noresep,'-' AS noregistrasi,'-' AS nocm,
//              UPPER(sp.namapasien_klien) AS namapasien,'-' AS jeniskelamin,'Umum/Pribadi' as kelompokpasien,
//              CASE WHEN pg.namalengkap IS NULL THEN '-' ELSE pg.namalengkap END AS namalengkap,ru.namaruangan AS ruanganapotik,
//              sp.totalharusdibayar AS tunai, 0 AS penjamin
//              FROM strukpelayanan_t as sp
//              LEFT JOIN strukpelayanandetail_t as spd on spd.nostrukfk = sp.norec
//              LEFT JOIN pegawai_m as pg on pg.id=sp.objectpegawaipenanggungjawabfk
//              INNER JOIN strukbuktipenerimaan_t as sbm on sbm.norec = sp.nosbmlastfk
//              LEFT JOIN pegawai_m as pg2 on pg2.id = sbm.objectpegawaipenerimafk
//              LEFT JOIN loginuser_s as lu on lu.id = sbm.objectpegawaipenerimafk
//              LEFT JOIN pegawai_m as pg3 on pg3.id = lu.objectpegawaifk
//              LEFT JOIN ruangan_m as ru on ru.id=sp.objectruanganfk
//              WHERE sp.kdprofile = $kdProfile and sp.tglstruk BETWEEN '$tglAwal' and '$tglAkhir'
//                AND sp.nostruk_intern='-' AND substring(sp.nostruk,1,2)='OB'
//                $dokid
//              $ruid
//            UNION ALL
//
//              SELECT  TO_CHAR(sp.tglstruk, 'DD-MM-YYYY') AS tglresep,sp.nostruk AS noresep,'-' AS noregistrasi,ps.nocm,
//              UPPER(sp.namapasien_klien) AS namapasien,UPPER(jk.reportdisplay) AS jeniskelamin,
//              'Umum/Pribadi' as kelompokpasien,CASE WHEN pg.namalengkap IS NULL THEN '-' ELSE pg.namalengkap END AS namalengkap,
//              ru.namaruangan AS ruanganapotik,sp.totalharusdibayar AS tunai, 0 AS penjamin
//              FROM strukpelayanan_t as sp
//              INNER JOIN strukpelayanandetail_t as spd on spd.nostrukfk = sp.norec
//              INNER JOIN strukbuktipenerimaan_t as sbm on sbm.norec = sp.nosbmlastfk
//              LEFT JOIN pegawai_m as pg2 on pg2.id = sbm.objectpegawaipenerimafk
//              LEFT JOIN loginuser_s as lu on lu.objectpegawaifk = sbm.objectpegawaipenerimafk
//              LEFT JOIN pasien_m as ps on ps.nocm=sp.nostruk_intern
//              LEFT JOIN jeniskelamin_m as jk on jk.id=ps.objectjeniskelaminfk
//              LEFT JOIN pegawai_m as pg on pg.id=sp.objectpegawaipenanggungjawabfk
//              LEFT JOIN ruangan_m as ru on ru.id=sp.objectruanganfk
//              WHERE sp.kdprofile = $kdProfile and sp.tglstruk BETWEEN '$tglAwal' and '$tglAkhir'
//                AND sp.nostruk_intern not in ('-') AND substring(sp.nostruk,1,2)='OB'
//                $dokid
//              $ruid
//
//              ) AS x GROUP BY x.tglresep,x.noresep,x.noregistrasi,x.nocm,x.namapasien,
//              x.jeniskelamin,x.kelompokpasien,x.namalengkap,x.ruanganapotik"));
/*
CASE WHEN ru1.objectdepartemenfk = 16 AND kmr.namakamar IS NULL AND tt.nomorbed IS NULL THEN 
                       ru1.namaruangan || '[]'
                       WHEN ru1.objectdepartemenfk = 16 AND kmr.namakamar IS NOT NULL AND tt.nomorbed IS NOT NULL THEN
                       ru1.namaruangan || '[' || CASE WHEN kmr.namakamar IS NULL THEN '' ELSE kmr.namakamar END || ' ' || 
                       CASE WHEN tt.nomorbed IS NULL THEN null ELSE tt.nomorbed END || ']'
                       ELSE dep1.namadepartemen END AS departemen


*/
        $data = DB::select(DB::raw("SELECT
        *
    FROM
        (
            SELECT
                *, ROW_NUMBER () OVER (PARTITION BY noresep, namaproduk) NUMBER
            FROM
                (
                    SELECT
                        tglresep,
                        CASE
                    WHEN inputtindakan IS NOT NULL THEN
                        inputtindakan
                    WHEN inputtindakan IS NOT NULL
                    AND inputresep IS NOT NULL THEN
                        inputtindakan
                    WHEN inputresep IS NOT NULL
                    AND inputtindakan IS NULL THEN
                        inputresep
                    WHEN inputresep IS NULL
                    AND inputtindakan IS NULL THEN
                        ''
                    END AS penginput,
                    departemen,
                    namaruanganpasien,
                    gudang,
                    namaproduk,
                    rke,
                    satuanstandar,
                    jumlah,
                    hargajual,
                    subtotal,
                    hargadiscount,
                    noregistrasi,
                    nocm,
                    namapasien,
                    dokter,
                    noresep,
                    tglsbm
                FROM
                    (
            WITH lt AS (
                SELECT DISTINCT
                    lt.noreff,
                    lt.jenislog,
                    lt.objectloginuserfk
                FROM
                    logginguser_t lt
                WHERE
                    lt.jenislog = 'Input Tindakan'
            ),
            cte AS (
                SELECT
                    lt.noreff,
                    lt.jenislog,
                    pg. ID idpegawai,
                    pg.namalengkap namapegawaiinput
                FROM
                    lt
                INNER JOIN loginuser_s lu ON lu. ID = lt.objectloginuserfk
                LEFT JOIN pegawai_m pg ON pg. ID = lu.objectpegawaifk
                WHERE
                    lt.jenislog = 'Input Tindakan'
            ),
            ltr AS (
                SELECT DISTINCT
                    ls.noreff,
                    ls.jenislog,
                    ls.objectloginuserfk,
                    ls.tanggal
                FROM
                    logginguser_t ls
                WHERE
                    ls.jenislog = 'Input Resep Apotik'
            ),
            cter AS (
                SELECT
                    ltr.noreff,
                    ltr.jenislog,
                    ltr.tanggal,
                    pg. ID idpegawai,
                    pg.namalengkap namapegawaiinput
                FROM
                    ltr
                INNER JOIN loginuser_s lu ON lu. ID = ltr.objectloginuserfk
                LEFT JOIN pegawai_m pg ON pg. ID = lu.objectpegawaifk
                WHERE
                    ltr.jenislog = 'Input Resep Apotik'
            ) SELECT
                TO_CHAR(
                    pp.tglpelayanan,
                    'DD-MM-YYYY'
                ) AS tglresep,
                cte.namapegawaiinput inputtindakan,
                cter.namapegawaiinput inputresep,
                CASE
            WHEN ru1.objectdepartemenfk = 16
            AND kmr.namakamar IS NULL
            AND tt.nomorbed IS NULL THEN
                ru1.namaruangan || '[]'
            WHEN ru1.objectdepartemenfk = 16
            AND kmr.namakamar IS NOT NULL
            AND tt.nomorbed IS NOT NULL THEN
                ru1.namaruangan || '[' || CASE
            WHEN kmr.namakamar IS NULL THEN
                ''
            ELSE
                kmr.namakamar
            END || ' ' || CASE
            WHEN tt.nomorbed IS NULL THEN
                NULL
            ELSE
                tt.nomorbed
            END || ']'
            ELSE
                dep1.namadepartemen
            END AS departemen,
            ru1.namaruangan namaruanganpasien,
            ru.namaruangan AS gudang,
            --pg1.namalengkap as user,
            pro.namaproduk,
            pp.rke,
            ss.satuanstandar,
            pp.jumlah,
            pp.hargajual,
            (
                (
                    pp.hargajual - (
                        COALESCE (pp.hargadiscount, 0)
                    )
                ) * jumlah
            ) AS subtotal,
            pp.hargadiscount,
            pd.noregistrasi,
            ps.nocm,
            ps.namapasien,
            pg.namalengkap AS dokter,
            sr.noresep,
            sbmsdhbyr.tglsbm
        FROM
            pelayananpasien_t AS pp
        LEFT JOIN strukresep_t AS sr ON pp.strukresepfk = sr.norec
        AND sr.statusenabled = TRUE
        AND sr.kdprofile = 30
        LEFT JOIN antrianpasiendiperiksa_t AS apd ON apd.norec = sr.pasienfk
        LEFT JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk
        LEFT JOIN pasien_m AS ps ON ps. ID = pd.nocmfk
        LEFT JOIN jeniskelamin_m AS jk ON jk. ID = ps.objectjeniskelaminfk
        LEFT JOIN pegawai_m AS pg ON pg. ID = sr.penulisresepfk
        LEFT JOIN ruangan_m AS ru ON ru. ID = sr.ruanganfk
        LEFT JOIN ruangan_m AS ru1 ON ru1. ID = apd.objectruanganfk
        LEFT JOIN departemen_m AS dep ON dep. ID = ru1.objectdepartemenfk
        LEFT JOIN departemen_m AS dep1 ON dep1. ID = ru.objectdepartemenfk
        LEFT JOIN kamar_m AS kmr ON kmr. ID = apd.objectkamarfk
        LEFT JOIN tempattidur_m AS tt ON tt. ID = apd.nobed
        LEFT JOIN kelompokpasien_m kp ON kp. ID = pd.objectkelompokpasienlastfk
        LEFT JOIN strukpelayanan_t AS sp ON sp.norec = pp.strukfk
        LEFT JOIN strukbuktipenerimaan_t AS sbm ON sbm.norec = sp.nosbmlastfk
        LEFT JOIN strukbuktipenerimaan_t AS sbmsdhbyr ON sbmsdhbyr.norec = sp.nosbmlastfk
        AND sbmsdhbyr.statusenabled = TRUE
        LEFT JOIN produk_m AS pro ON pro. ID = pp.produkfk
        LEFT JOIN satuanstandar_m AS ss ON ss. ID = pp.satuanviewfk
        LEFT JOIN cte ON cte.noreff = pp.norec
        LEFT JOIN cter ON cter.noreff = sr.norec
        WHERE
            pp.tglpelayanan BETWEEN '$tglAwal'
        AND '$tglAkhir'
        
        and (pp.isobat = true or pro. ID in(5006763,5006764,5006760,5006761,5006762,5006766,5006765,5006758,5006757,5006759,4041191,5008650,5008651,5008652,5008653
)) 
                        $dokid
                        $ruid
                        $rajalRanap
                        $namaItem    
                        $namaItemText
                        $namaPasienText

                        UNION ALL
                        
                        SELECT TO_CHAR(sp.tglstruk, 'DD-MM-YYYY') AS tglresep, cte.namapegawaiinput inputtindakan, '' inputresep,
                        dep.namadepartemen AS departemen,ru.namaruangan namaruanganpasien,
                               ru.namaruangan AS gudang,
                               --pg1.namalengkap as user,
                               pro.namaproduk,
                               pp.rke,
                               ss.satuanstandar,
                               spd.qtyproduk as jumlah,
                               spd.harganetto AS hargajual,
                               (spd.qtyproduk*spd.harganetto) AS subtotal,
                               spd.hargadiscount,
                               '' as noregistrasi,
                               sp.nostruk_intern as nocm,
                               sp.namapasien_klien as namapasien,
                               pg.namalengkap as dokter,
                               sp.nostruk AS noresep,
                               sbmsdhbyr.tglsbm
                        FROM strukpelayanan_t as sp
                        INNER JOIN pelayananpasien_t AS pp ON pp.strukterimafk = sp.norec
                        INNER JOIN strukpelayanandetail_t as spd on spd.nostrukfk = sp.norec
                        LEFT JOIN strukbuktipenerimaan_t as sbmsdhbyr on sbmsdhbyr.norec = sp.nosbmlastfk and sbmsdhbyr.statusenabled = true
                        LEFT JOIN pegawai_m as pg on pg.id=sp.objectpegawaipenanggungjawabfk
                        LEFT JOIN strukbuktipenerimaan_t as sbm on sbm.norec = sp.nosbmlastfk
                        LEFT JOIN pegawai_m as pg2 on pg2.id = sbm.objectpegawaipenerimafk
                        LEFT JOIN loginuser_s as lu on lu.id = sbm.objectpegawaipenerimafk
                        LEFT JOIN pegawai_m as pg3 on pg3.id = lu.objectpegawaifk
                        LEFT JOIN ruangan_m as ru on ru.id = sp.objectruanganfk
                        LEFT JOIN departemen_m AS dep ON dep.id = ru.objectdepartemenfk
                        --LEFT JOIN logginguser_t AS lg ON lg.noreff = sp.norec AND lg.jenislog = 'Input Resep Obat Bebas'
                        --LEFT JOIN loginuser_s AS lu1 ON lu1.id = lg.objectloginuserfk
                        --LEFT JOIN pegawai_m AS pg1 ON pg1.id = lu.objectpegawaifk
                        LEFT JOIN produk_m AS pro ON pro.id = spd.objectprodukfk
                        LEFT JOIN satuanstandar_m AS ss ON ss.id = spd.objectsatuanstandarfk
                                        left join  cte on cte.noreff = pp.norec
                        WHERE sp.statusenabled = true AND sp.kdprofile = 30 and sp.tglstruk BETWEEN '$tglAwal' and '$tglAkhir'
                        AND substring(sp.nostruk,1,2)='OB'

                        $dokid
                        $ruid
                        $rajalRanapObatBebas    
                        $namaItem    
                        $namaItemText
                        $namaPasienTextSP
                 ) AS x
			) AS C
	    ) AS e
        WHERE
	    NUMBER = 1
        ORDER BY
	    noresep    
        "));


        $result = array(
            'daftar' => $data,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }


    public function getDaftarSatuanResep(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $data = SatuanResep::get();
        $result = array(
            'data' => $data,
            'by' => 'ea@epic',
        );
        return $result;
    }

    public function saveDataSatuanResep(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        try{
            $newId = SatuanResep::max('id') +1 ;
            if ($request['id'] == ''){
                $TP = new SatuanResep();
                $TP->id = $newId;
                $TP->kdprofile = $kdProfile;
                $TP->norec = $TP->generateNewId();
            }else{
                $TP = SatuanResep::where('id', $request['id'])->first();
            }
            $TP->statusenabled =  $request['statusenabled'];
            $TP->kodeexternal = $newId;
            $TP->reportdisplay = $request['satuanresep'];
            $TP->satuanresep = $request['satuanresep'];
            $TP->kdsatuanresep = $newId;
            $TP->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Satuan Resep Berhasil";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $TP,
                'as' => 'asepic',
            );
        } else {
            $transMessage = "Simpan Satuan Resep Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'asepic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDaftarRegistrasiPasien(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftJoin('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            ->leftJoin('rekanan_m as rkn', 'rkn.id', '=', 'pd.objectrekananfk')
            ->leftJoin('strukpelayanan_t as sp', 'sp.norec', '=', 'pd.nostruklastfk')
            ->leftJoin('strukbuktipenerimaan_t as sbm', 'sbm.norec', '=', 'pd.nosbmlastfk')
            ->leftjoin('loginuser_s as lu', 'lu.id', '=', 'sbm.objectpegawaipenerimafk')
            ->leftjoin('pegawai_m as pgs', 'pgs.id', '=', 'lu.objectpegawaifk')
            ->leftjoin('pemakaianasuransi_t as pas', 'pas.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->select(DB::raw("pd.norec, pd.tglregistrasi, ps.nocm, pd.noregistrasi, ru.namaruangan, ps.namapasien, kp.kelompokpasien,ps.tgllahir,
                    pd.tglpulang, pd.statuspasien, sp.nostruk, sbm.nosbm, pg.id as pgid, pg.namalengkap as namadokter,rkn.namarekanan as namapenjamin,
                    pgs.namalengkap as kasir,pd.objectruanganlastfk as ruanganid,pas.nosep,pas.norec as norec_pa,ps.tglmeninggal,ps.objectjeniskelaminfk,jk.jeniskelamin"))
            ->where('pd.statusenabled', true)
            ->where('pd.kdprofile',$kdProfile);

        $filter = $request->all();
        // if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
        //     $data = $data->where('pd.tglregistrasi', '>=', $filter['tglAwal']);
        // }
        // if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
        //     $tgl = $filter['tglAkhir'];//." 23:59:59";
        //     $data = $data->where('pd.tglregistrasi', '<=', $tgl);
        // }
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
            $data = $data->where('pd.noregistrasi', 'ilike', '%' . $filter['noreg'] . '%');
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

        $data = $data->get();

        return $this->respond($data);
    }

    public function getRuanganTerakhirPasien(Request $request){
        $kdProfile = (int)$this->getDataKdProfile($request);
        $NoRegistrasi = $request['Noregistrasi'];
        $data = DB::select(DB::raw("
            SELECT apd.norec AS norec_apd,pd.norec AS norec_pd ,pd.noregistrasi,
                   apd.objectkelasfk AS idkelas,kls.namakelas,
			       apd.objectpegawaifk,pg.namalengkap AS namadokter 
            FROM pasiendaftar_t AS pd
            INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec 
            AND apd.objectruanganfk = pd.objectruanganlastfk
            LEFT JOIN kelas_m AS kls ON kls.id = apd.objectkelasfk
            LEFT JOIN pegawai_m AS pg ON pg.id = apd.objectpegawaifk
            WHERE pd.kdprofile = $kdProfile  AND pd.statusenabled = TRUE AND pd.noregistrasi = '$NoRegistrasi'
        "));

        return $this->respond($data);
    }

    public function getNoStrukKasir(Request $request) {
        $kdProfile = (int)$this->getDataKdProfile($request);
        $norecresep="";
        if(isset($request['norecresep']) && $request['norecresep']!="" && $request['norecresep']!="undefined"){
            $norecresep =" AND sr.norec = '".$request['norecresep']."' ";
        }
        $data = DB::select(DB::raw("SELECT sp.nostruk
            FROM pelayananpasien_t AS pp
            INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.norec = pp.noregistrasifk
            INNER JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk
            LEFT JOIN strukresep_t AS sr ON sr.norec = pp.strukresepfk
            LEFT JOIN strukpelayanan_t AS sp ON sp.norec = pp.strukfk
            WHERE pp.kdprofile = $kdProfile
            $norecresep
            LIMIT 1"));
        return $this->respond($data);
    }

    public function saveBatalVerifikasiResep(Request $request) {
        $kdProfile = (int)$this->getDataKdProfile($request);
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id',$request['userData']['id'])
            ->where('lu.kdprofile',$kdProfile)
            ->first();
        \DB::beginTransaction();
        try {
            $newSOV = StrukOrder::where('norec',$request['norec_order'])->where('kdprofile',$kdProfile)->first();
            $newSOVD = OrderPelayanan::where('noorderfk',$request['norec_order'])->where('kdprofile',$kdProfile)->get();
            $dataPD = PasienDaftar::where('norec', $newSOV->noregistrasifk)->where('kdprofile',$kdProfile)->first();

            $newSO = new StrukOrderBatalVerif();
            $norecSO = $newSO->generateNewId();
            $newSO->norec = $norecSO;
            $newSO->kdprofile = $kdProfile;
            $newSO->statusenabled = true;
            $newSO->isreseppulang = $newSOV->isreseppulang;
            $newSO->nocmfk = $newSOV->nocmfk;
            $newSO->kddokter = $newSOV->kddokter;
            $newSO->objectjenisorderfk = $newSOV->objectjenisorderfk;
            $newSO->isdelivered = $newSOV->isdelivered;
            $newSO->objectkelompoktransaksifk = $newSOV->objectkelompoktransaksifk;
            $newSO->keteranganorder = 'Batal Verifikasi Order Farmasi';
            $newSO->noorder = $newSOV->noorder;
            $newSO->noregistrasifk = $newSOV->noregistrasifk;
            $newSO->qtyproduk = $newSOV->qtyproduk;
            $newSO->qtyjenisproduk = $newSOV->qtyjenisproduk;
            $newSO->objectruanganfk = $newSOV->objectruanganfk;
            $newSO->objectruangantujuanfk = $newSOV->objectruangantujuanfk;
            $newSO->statusorder = $newSOV->statusorder;
            $newSO->tglorder =$newSOV->tglorder;
            $newSO->totalbeamaterai = $newSOV->totalbeamaterai;
            $newSO->totalbiayakirim = $newSOV->totalbiayakirim;
            $newSO->totalbiayatambahan = $newSOV->totalbiayatambahan;
            $newSO->totaldiscount =  $newSOV->totaldiscount;
            $newSO->totalhargasatuan = $newSOV->totalhargasatuan;
            $newSO->totalharusdibayar = $newSOV->totalharusdibayar;
            $newSO->totalpph = $newSOV->totalpph;
            $newSO->totalppn = $newSOV->totalppn;
            $newSO->nourutruangan = $newSOV->nourutruangan;
            $newSO->norecorderfk = $newSOV->norec;
            $newSO->objectpegawaibatalfk = $dataPegawai->objectpegawaifk;
            $newSO->tglbatalverifikasi =  date('Y-m-d H:i:s');
            $newSO->save();
            $norecSO = $newSO->norec;

            foreach ($newSOVD as $r_PPL) {
                $newPP = new StrukOrderBatalVerifDetail();
                $norecPP = $newPP->generateNewId();
                $newPP->norec = $norecPP;
                $newPP->kdprofile = $kdProfile;
                $newPP->statusenabled = true;
                $newPP->aturanpakai = $r_PPL['aturanpakai'];
                $newPP->isreadystok = $r_PPL['isreadystok'];
                $newPP->kddokter = $r_PPL['kddokter'];
                $newPP->objectkelasfk = $r_PPL['objectkelasfk'];
                $newPP->nocmfk = $r_PPL['nocmfk'];
                $newPP->noorderfk = $r_PPL['noorderfk'];
                $newPP->noregistrasifk = $r_PPL['noregistrasifk'];
                $newPP->objectprodukfk = $r_PPL['objectprodukfk'];
                $newPP->qtyproduk = $r_PPL['qtyproduk'];
                $newPP->qtystokcurrent = $r_PPL['qtystokcurrent'];
                $newPP->racikanke = $r_PPL['racikanke'];
                $newPP->objectruanganfk = $r_PPL['objectruanganfk'];
                $newPP->objectruangantujuanfk = $r_PPL['objectruangantujuanfk'];
                $newPP->objectsatuanstandarfk = $r_PPL['objectsatuanstandarfk'];
                $newPP->strukorderfk = $r_PPL['strukorderfk'];
                $newPP->tglpelayanan = $r_PPL['tglpelayanan'];
                $newPP->jenisobatfk = $r_PPL['jenisobatfk'];
                $newPP->jumlah = $r_PPL['jumlah'];;
                $newPP->iscito =  $r_PPL['iscito'];;
                $newPP->hargasatuan = $r_PPL['hargasatuan'];
                $newPP->hargadiscount = $r_PPL['hargadiscount'];
                $newPP->qtyprodukretur =  $r_PPL['qtyprodukretur'];;
                $newPP->hasilkonversi = $r_PPL['hasilkonversi'];;
                $newPP->jeniskemasanfk = $r_PPL['jeniskemasanfk'];
                $newPP->dosis = $r_PPL['dosis'];
                $newPP->rke = $r_PPL['rke'];
                $newPP->satuanviewfk = $r_PPL['satuanviewfk'];
                $newPP->ispagi = $r_PPL['ispagi'];
                $newPP->issiang = $r_PPL['issiang'];
                $newPP->ismalam = $r_PPL['ismalam'];
                $newPP->issore = $r_PPL['issore'];
                $newPP->keteranganpakai = $r_PPL['keteranganpakai'];
                $newPP->norecdetailbatal = $r_PPL['norec'];
                $newPP->strukbatalfk = $norecSO;
                $newPP->save();
            }

            //## Logging User
            $newId = LoggingUser::max('id');
            $newId = $newId +1;
            $logUser = new LoggingUser();
            $logUser->id = $newId;
            $logUser->norec = $logUser->generateNewId();
            $logUser->kdprofile= $kdProfile;
            $logUser->statusenabled=true;
            $logUser->jenislog = "Batal Verifikasi Order Resep Elektronik";
            $logUser->keterangan = "Batal Verifikasi Order Resep Elektronik No. Order : ". $newSOV->noorder . " / Noregistrasi : ". $dataPD->noregistrasi;
            $logUser->noreff = $newSOV->norec;
            $logUser->referensi='Norec Struk Order';
            $logUser->objectloginuserfk =  $request['userData']['id'];
            $logUser->tanggal = date('Y-m-d H:i:s');
            $logUser->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Gagal";
        }

        if ($transStatus == 'true') {
            $transMessage = "Batal Verifikasi Simpan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'ea@epic',
            );
        } else {
            $transMessage = "Batal Verifikasi Simpan Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getLaporanKegiatanPelayananResep(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tglAwal = $request['tglAwal'];
        $kpid='';
        $rajalRanapAsal= '';
        $rajalRanap= '';

        
        if(isset( $request['rajalRanap'])&& $request['rajalRanap']!="" && $request['rajalRanap']!="undefined" &&  $request['rajalRanap']=='1'){//rajal
            $rajalRanap = "and ru.objectdepartemenfk <> 16";
            $rajalRanapAsal = "and ruapdsr.objectdepartemenfk <> 16";
        }

        if(isset( $request['rajalRanap'])&& $request['rajalRanap']!="" && $request['rajalRanap']!="undefined" && $request['rajalRanap']=='2'){//ranap
            $rajalRanap = "and ru.objectdepartemenfk = 16";//ini ga mungkin terjadi
            $rajalRanapAsal = "and ruapdsr.objectdepartemenfk = 16";//ini ga mungkin terjadi
        }

        if(isset($request['kpid']) && $request['kpid']!="" && $request['kpid']!="undefined"){
            $kpid = ' and pd.objectkelompokpasienlastfk='.$request['kpid'];
        }

        $month = DB::select(DB::raw("
            select EXTRACT(MONTH from d), to_char(d, 'Month') as month
            from generate_series('$tglAwal', '$tglAwal'::date + INTERVAL '1 YEAR - 1 day', '1 day'::interval) d
            group by to_char(d, 'Month'), EXTRACT(MONTH from d)
            order by EXTRACT(MONTH from d) 
        "));

        $tglmax = DB::select(DB::raw("
            select max(d::date) as tglmax
            from generate_series('$tglAwal', '$tglAwal'::date + INTERVAL '1 YEAR - 1 day', '1 day'::interval) d
        "));

        $tglmin = DB::select(DB::raw("
            select min(d::date) as tglmin
            from generate_series('$tglAwal', '$tglAwal'::date + INTERVAL '1 YEAR - 1 day', '1 day'::interval) d
        "));

        $arrmax = [];
        foreach($tglmax as $rowmax)
        {
            $arrmax[] =  $rowmax->tglmax;
        } 

        $arrmin = [];
        foreach($tglmin as $rowmin)
        {
            $arrmin[] =  $rowmin->tglmin;
        } 

        
        $jumlahrke = DB::select(DB::raw("select rtrim(y.bulan, ' ') as bulan, count(y.rke) as jumlahrke from (select 
        to_char(sr.tglresep, 'Month') as bulan, pr.namaproduk, pp.isobat,  sr.noresep, pp.rke
        from
            pasien_m ps 
        inner join pasiendaftar_t pd on ps.id=pd.nocmfk 
        inner join antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
        inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
        inner  join produk_m pr on pr.id=pp.produkfk
        inner join strukresep_t sr on pp.strukresepfk = sr.norec
        inner join ruangan_m ru on ru.id = apd.objectruanganfk
        WHERE
            pp.kdprofile=30 
            and sr.tglresep::date between '$arrmin[0]' and '$arrmax[0]'
            and isobat = true
            $kpid
            $rajalRanap
        group by to_char(sr.tglresep, 'Month'), pr.namaproduk, isobat,  sr.noresep,pp.rke) as y group by y.bulan"));

        
        $jumlahresep = DB::select(DB::raw("select rtrim(x.bulan, ' ') as bulan, count(x.resep) as jumlahresep from (select 
        to_char(sr.tglresep, 'Month') as bulan, sr.noresep as resep
        from
            pasien_m ps 
        inner join pasiendaftar_t pd on ps.id=pd.nocmfk 
        inner join antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
        inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
        inner  join produk_m pr on pr.id=pp.produkfk
        inner join strukresep_t sr on pp.strukresepfk = sr.norec
        inner join ruangan_m ru on ru.id = apd.objectruanganfk
        WHERE
            pp.kdprofile=30 
            and sr.tglresep::date between '$arrmin[0]' and '$arrmax[0]'
            and isobat = true
            $kpid
            $rajalRanap
        group by to_char(sr.tglresep, 'Month'), sr.noresep) as x group by x.bulan"));


        $pelayananmain = DB::select(DB::raw("select namaruangan, namaproduk from mapruangantoproduk_m mpr
        left join produk_m pr on pr.id  = mpr.objectprodukfk
        left join ruangan_m ru on ru.id = mpr.objectruanganfk
        where mpr.objectruanganfk = 94"));


        $pelayanan = DB::select(DB::raw("
        select rtrim(x.bulan, ' ') as bulan, x.namaproduk, x.jumlah from (select 
        to_char(pp.tglpelayanan, 'Month') as bulan, pr.namaproduk, sum(pp.jumlah) as jumlah 
        from
            pasien_m ps 
        inner join pasiendaftar_t pd on ps.id=pd.nocmfk 
        inner join antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
        inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
        inner join produk_m pr on pr.id=pp.produkfk
        inner join ruangan_m ru on ru.id = apd.objectruanganfk
		inner join ruangan_m ruasal on ruasal.id = apd.objectruanganasalfk
        left join strukresep_t sr on sr.norec = pp.strukresepfk
        left join antrianpasiendiperiksa_t apdsr on apdsr.norec=sr.pasienfk
        left join ruangan_m ruresep on ruresep.id = sr.ruanganfk
        left join ruangan_m ruapdsr on ruapdsr.id=apdsr.objectruanganfk
        left join ruangan_m ruapdsrasal on ruapdsrasal.id=apdsr.objectruanganasalfk
			where ru.objectdepartemenfk = 14
			and pp.isobat is null
			and pp.tglpelayanan::date between '$arrmin[0]' and '$arrmax[0]'
            $kpid
            $rajalRanapAsal
		group by to_char(pp.tglpelayanan, 'Month'), pr.namaproduk) x group by x.bulan, x.namaproduk, x.jumlah"));

        //var_dump($pelayanan);
        
        $jumlahtotalrkejanuary = 0;
        $jumlahtotalrkefebruary = 0;
        $jumlahtotalrkemarch = 0;
        $jumlahtotalrkeapril = 0;
        $jumlahtotalrkemay = 0;
        $jumlahtotalrkejune = 0;
        $jumlahtotalrkejuly = 0;
        $jumlahtotalrkeaugust = 0;
        $jumlahtotalrkeseptember = 0;
        $jumlahtotalrkeoctober = 0;
        $jumlahtotalrkenovember = 0;
        $jumlahtotalrkedecember = 0;

        $jumlahtotalresepjanuary = 0;
        $jumlahtotalresepfebruary = 0;
        $jumlahtotalresepmarch = 0;
        $jumlahtotalresepapril = 0;
        $jumlahtotalresepmay = 0;
        $jumlahtotalresepjune = 0;
        $jumlahtotalresepjuly = 0;
        $jumlahtotalresepaugust = 0;
        $jumlahtotalresepseptember = 0;
        $jumlahtotalresepoctober = 0;
        $jumlahtotalresepnovember = 0;
        $jumlahtotalresepdecember = 0;

        $jumlahtotalobatjadijanuary = 0;
        $jumlahtotalobatjadifebruary = 0;
        $jumlahtotalobatjadimarch = 0;
        $jumlahtotalobatjadiapril = 0;
        $jumlahtotalobatjadimay = 0;
        $jumlahtotalobatjadijune = 0;
        $jumlahtotalobatjadijuly = 0;
        $jumlahtotalobatjadiaugust = 0;
        $jumlahtotalobatjadiseptember = 0;
        $jumlahtotalobatjadioctober = 0;
        $jumlahtotalobatjadinovember = 0;
        $jumlahtotalobatjadidecember = 0;

        $jumlahtotalkapsulkurangjanuary = 0;
        $jumlahtotalkapsulkurangfebruary = 0;
        $jumlahtotalkapsulkurangmarch = 0;
        $jumlahtotalkapsulkurangapril = 0;
        $jumlahtotalkapsulkurangmay = 0;
        $jumlahtotalkapsulkurangjune = 0;
        $jumlahtotalkapsulkurangjuly = 0;
        $jumlahtotalkapsulkurangaugust = 0;
        $jumlahtotalkapsulkurangseptember = 0;
        $jumlahtotalkapsulkurangoctober = 0;
        $jumlahtotalkapsulkurangnovember = 0;
        $jumlahtotalkapsulkurangdecember = 0;

        $jumlahtotalkapsullebihjanuary = 0;
        $jumlahtotalkapsullebihfebruary = 0;
        $jumlahtotalkapsullebihmarch = 0;
        $jumlahtotalkapsullebihapril = 0;
        $jumlahtotalkapsullebihmay = 0;
        $jumlahtotalkapsullebihjune = 0;
        $jumlahtotalkapsullebihjuly = 0;
        $jumlahtotalkapsullebihaugust = 0;
        $jumlahtotalkapsullebihseptember = 0;
        $jumlahtotalkapsullebihoctober = 0;
        $jumlahtotalkapsullebihnovember = 0;
        $jumlahtotalkapsullebihdecember = 0;
        
        $jumlahtotalracikkurangjanuary = 0;
        $jumlahtotalracikkurangfebruary = 0;
        $jumlahtotalracikkurangmarch = 0;
        $jumlahtotalracikkurangapril = 0;
        $jumlahtotalracikkurangmay = 0;
        $jumlahtotalracikkurangjune = 0;
        $jumlahtotalracikkurangjuly = 0;
        $jumlahtotalracikkurangaugust = 0;
        $jumlahtotalracikkurangseptember = 0;
        $jumlahtotalracikkurangoctober = 0;
        $jumlahtotalracikkurangnovember = 0;
        $jumlahtotalracikkurangdecember = 0;

        $jumlahtotalraciklebihjanuary = 0;
        $jumlahtotalraciklebihfebruary = 0;
        $jumlahtotalraciklebihmarch = 0;
        $jumlahtotalraciklebihapril = 0;
        $jumlahtotalraciklebihmay = 0;
        $jumlahtotalraciklebihjune = 0;
        $jumlahtotalraciklebihjuly = 0;
        $jumlahtotalraciklebihaugust = 0;
        $jumlahtotalraciklebihseptember = 0;
        $jumlahtotalraciklebihoctober = 0;
        $jumlahtotalraciklebihnovember = 0;
        $jumlahtotalraciklebihdecember = 0;

        $jumlahtotalraciksalepjanuary = 0;
        $jumlahtotalraciksalepfebruary = 0;
        $jumlahtotalraciksalepmarch = 0;
        $jumlahtotalraciksalepapril = 0;
        $jumlahtotalraciksalepmay = 0;
        $jumlahtotalraciksalepjune = 0;
        $jumlahtotalraciksalepjuly = 0;
        $jumlahtotalraciksalepaugust = 0;
        $jumlahtotalraciksalepseptember = 0;
        $jumlahtotalraciksalepoctober = 0;
        $jumlahtotalraciksalepnovember = 0;
        $jumlahtotalraciksalepdecember = 0;

        $jumlahtotalraciksirupjanuary = 0;
        $jumlahtotalraciksirupfebruary = 0;
        $jumlahtotalraciksirupmarch = 0;
        $jumlahtotalraciksirupapril = 0;
        $jumlahtotalraciksirupmay = 0;
        $jumlahtotalraciksirupjune = 0;
        $jumlahtotalraciksirupjuly = 0;
        $jumlahtotalraciksirupaugust = 0;
        $jumlahtotalraciksirupseptember = 0;
        $jumlahtotalraciksirupoctober = 0;
        $jumlahtotalraciksirupnovember = 0;
        $jumlahtotalraciksirupdecember = 0;

        $jumlahtotalkonselingjanuary = 0;
        $jumlahtotalkonselingfebruary = 0;
        $jumlahtotalkonselingmarch = 0;
        $jumlahtotalkonselingapril = 0;
        $jumlahtotalkonselingmay = 0;
        $jumlahtotalkonselingjune = 0;
        $jumlahtotalkonselingjuly = 0;
        $jumlahtotalkonselingaugust = 0;
        $jumlahtotalkonselingseptember = 0;
        $jumlahtotalkonselingoctober = 0;
        $jumlahtotalkonselingnovember = 0;
        $jumlahtotalkonselingdecember = 0;

        $jumlahtotalpetunjukjanuary = 0;
        $jumlahtotalpetunjukfebruary = 0;
        $jumlahtotalpetunjukmarch = 0;
        $jumlahtotalpetunjukapril = 0;
        $jumlahtotalpetunjukmay = 0;
        $jumlahtotalpetunjukjune = 0;
        $jumlahtotalpetunjukjuly = 0;
        $jumlahtotalpetunjukaugust = 0;
        $jumlahtotalpetunjukseptember = 0;
        $jumlahtotalpetunjukoctober = 0;
        $jumlahtotalpetunjuknovember = 0;
        $jumlahtotalpetunjukdecember = 0;

        $jumlahtotalvisitejanuary = 0;
        $jumlahtotalvisitefebruary = 0;
        $jumlahtotalvisitemarch = 0;
        $jumlahtotalvisiteapril = 0;
        $jumlahtotalvisitemay = 0;
        $jumlahtotalvisitejune = 0;
        $jumlahtotalvisitejuly = 0;
        $jumlahtotalvisiteaugust = 0;
        $jumlahtotalvisiteseptember = 0;
        $jumlahtotalvisiteoctober = 0;
        $jumlahtotalvisitenovember = 0;
        $jumlahtotalvisitedecember = 0;

        $jumlahtotalpemantauanjanuary = 0;
        $jumlahtotalpemantauanfebruary = 0;
        $jumlahtotalpemantauanmarch = 0;
        $jumlahtotalpemantauanapril = 0;
        $jumlahtotalpemantauanmay = 0;
        $jumlahtotalpemantauanjune = 0;
        $jumlahtotalpemantauanjuly = 0;
        $jumlahtotalpemantauanaugust = 0;
        $jumlahtotalpemantauanseptember = 0;
        $jumlahtotalpemantauanoctober = 0;
        $jumlahtotalpemantauannovember = 0;
        $jumlahtotalpemantauandecember = 0;

        $jumlahtotalembalacejanuary = 0;
        $jumlahtotalembalacefebruary = 0;
        $jumlahtotalembalacemarch = 0;
        $jumlahtotalembalaceapril = 0;
        $jumlahtotalembalacemay = 0;
        $jumlahtotalembalacejune = 0;
        $jumlahtotalembalacejuly = 0;
        $jumlahtotalembalaceaugust = 0;
        $jumlahtotalembalaceseptember = 0;
        $jumlahtotalembalaceoctober = 0;
        $jumlahtotalembalacenovember = 0;
        $jumlahtotalembalacedecember = 0;

        $jumlahtotalinjeksijanuary = 0;
        $jumlahtotalinjeksifebruary = 0;
        $jumlahtotalinjeksimarch = 0;
        $jumlahtotalinjeksiapril = 0;
        $jumlahtotalinjeksimay = 0;
        $jumlahtotalinjeksijune = 0;
        $jumlahtotalinjeksijuly = 0;
        $jumlahtotalinjeksiaugust = 0;
        $jumlahtotalinjeksiseptember = 0;
        $jumlahtotalinjeksioctober = 0;
        $jumlahtotalinjeksinovember = 0;
        $jumlahtotalinjeksidecember = 0;

        $jumlahtotalinfusjanuary = 0;
        $jumlahtotalinfusfebruary = 0;
        $jumlahtotalinfusmarch = 0;
        $jumlahtotalinfusapril = 0;
        $jumlahtotalinfusmay = 0;
        $jumlahtotalinfusjune = 0;
        $jumlahtotalinfusjuly = 0;
        $jumlahtotalinfusaugust = 0;
        $jumlahtotalinfusseptember = 0;
        $jumlahtotalinfusoctober = 0;
        $jumlahtotalinfusnovember = 0;
        $jumlahtotalinfusdecember = 0;

        $jumlahtotalrekonjanuary = 0;
        $jumlahtotalrekonfebruary = 0;
        $jumlahtotalrekonmarch = 0;
        $jumlahtotalrekonapril = 0;
        $jumlahtotalrekonmay = 0;
        $jumlahtotalrekonjune = 0;
        $jumlahtotalrekonjuly = 0;
        $jumlahtotalrekonaugust = 0;
        $jumlahtotalrekonseptember = 0;
        $jumlahtotalrekonoctober = 0;
        $jumlahtotalrekonnovember = 0;
        $jumlahtotalrekondecember = 0;

        $totalrke = 0;
        $totalresep = 0;
        $totalobatjadi = 0;
        $totalkapsulkurang = 0;
        $totalkapsullebih = 0;
        $totalracikkurang = 0;
        $totalraciklebih = 0;
        $totalraciksalep = 0;
        $totalraciksirup = 0;
        $totalkonseling = 0;
        $totalpetunjuk = 0;
        $totalvisite = 0;
        $totalpemantauan = 0;
        $totalembalace = 0;
        $totalinjeksi = 0;
        $totalinfus = 0;
        $totalrekon = 0;
        $detail=[];
        
        foreach ($jumlahresep  as $resep){

                $jumlahtotalrkejanuary = 0;
                $jumlahtotalrkefebruary = 0;
                $jumlahtotalrkemarch = 0;
                $jumlahtotalrkeapril = 0;
                $jumlahtotalrkemay = 0;
                $jumlahtotalrkejune = 0;
                $jumlahtotalrkejuly = 0;
                $jumlahtotalrkeaugust = 0;
                $jumlahtotalrkeseptember = 0;
                $jumlahtotalrkeoctober = 0;
                $jumlahtotalrkenovember = 0;
                $jumlahtotalrkedecember = 0;

                $jumlahtotalresepjanuary = 0;
                $jumlahtotalresepfebruary = 0;
                $jumlahtotalresepmarch = 0;
                $jumlahtotalresepapril = 0;
                $jumlahtotalresepmay = 0;
                $jumlahtotalresepjune = 0;
                $jumlahtotalresepjuly = 0;
                $jumlahtotalresepaugust = 0;
                $jumlahtotalresepseptember = 0;
                $jumlahtotalresepoctober = 0;
                $jumlahtotalresepnovember = 0;
                $jumlahtotalresepdecember = 0;

                $jumlahtotalobatjadijanuary = 0;
                $jumlahtotalobatjadifebruary = 0;
                $jumlahtotalobatjadimarch = 0;
                $jumlahtotalobatjadiapril = 0;
                $jumlahtotalobatjadimay = 0;
                $jumlahtotalobatjadijune = 0;
                $jumlahtotalobatjadijuly = 0;
                $jumlahtotalobatjadiaugust = 0;
                $jumlahtotalobatjadiseptember = 0;
                $jumlahtotalobatjadioctober = 0;
                $jumlahtotalobatjadinovember = 0;
                $jumlahtotalobatjadidecember = 0;

                $jumlahtotalkapsulkurangjanuary = 0;
                $jumlahtotalkapsulkurangfebruary = 0;
                $jumlahtotalkapsulkurangmarch = 0;
                $jumlahtotalkapsulkurangapril = 0;
                $jumlahtotalkapsulkurangmay = 0;
                $jumlahtotalkapsulkurangjune = 0;
                $jumlahtotalkapsulkurangjuly = 0;
                $jumlahtotalkapsulkurangaugust = 0;
                $jumlahtotalkapsulkurangseptember = 0;
                $jumlahtotalkapsulkurangoctober = 0;
                $jumlahtotalkapsulkurangnovember = 0;
                $jumlahtotalkapsulkurangdecember = 0;

                $jumlahtotalkapsullebihjanuary = 0;
                $jumlahtotalkapsullebihfebruary = 0;
                $jumlahtotalkapsullebihmarch = 0;
                $jumlahtotalkapsullebihapril = 0;
                $jumlahtotalkapsullebihmay = 0;
                $jumlahtotalkapsullebihjune = 0;
                $jumlahtotalkapsullebihjuly = 0;
                $jumlahtotalkapsullebihaugust = 0;
                $jumlahtotalkapsullebihseptember = 0;
                $jumlahtotalkapsullebihoctober = 0;
                $jumlahtotalkapsullebihnovember = 0;
                $jumlahtotalkapsullebihdecember = 0;

                $jumlahtotalracikkurangjanuary = 0;
                $jumlahtotalracikkurangfebruary = 0;
                $jumlahtotalracikkurangmarch = 0;
                $jumlahtotalracikkurangapril = 0;
                $jumlahtotalracikkurangmay = 0;
                $jumlahtotalracikkurangjune = 0;
                $jumlahtotalracikkurangjuly = 0;
                $jumlahtotalracikkurangaugust = 0;
                $jumlahtotalracikkurangseptember = 0;
                $jumlahtotalracikkurangoctober = 0;
                $jumlahtotalracikkurangnovember = 0;
                $jumlahtotalracikkurangdecember = 0;

                $jumlahtotalraciklebihjanuary = 0;
                $jumlahtotalraciklebihfebruary = 0;
                $jumlahtotalraciklebihmarch = 0;
                $jumlahtotalraciklebihapril = 0;
                $jumlahtotalraciklebihmay = 0;
                $jumlahtotalraciklebihjune = 0;
                $jumlahtotalraciklebihjuly = 0;
                $jumlahtotalraciklebihaugust = 0;
                $jumlahtotalraciklebihseptember = 0;
                $jumlahtotalraciklebihoctober = 0;
                $jumlahtotalraciklebihnovember = 0;
                $jumlahtotalraciklebihdecember = 0;

                $jumlahtotalraciksalepjanuary = 0;
                $jumlahtotalraciksalepfebruary = 0;
                $jumlahtotalraciksalepmarch = 0;
                $jumlahtotalraciksalepapril = 0;
                $jumlahtotalraciksalepmay = 0;
                $jumlahtotalraciksalepjune = 0;
                $jumlahtotalraciksalepjuly = 0;
                $jumlahtotalraciksalepaugust = 0;
                $jumlahtotalraciksalepseptember = 0;
                $jumlahtotalraciksalepoctober = 0;
                $jumlahtotalraciksalepnovember = 0;
                $jumlahtotalraciksalepdecember = 0;

                $jumlahtotalraciksirupjanuary = 0;
                $jumlahtotalraciksirupfebruary = 0;
                $jumlahtotalraciksirupmarch = 0;
                $jumlahtotalraciksirupapril = 0;
                $jumlahtotalraciksirupmay = 0;
                $jumlahtotalraciksirupjune = 0;
                $jumlahtotalraciksirupjuly = 0;
                $jumlahtotalraciksirupaugust = 0;
                $jumlahtotalraciksirupseptember = 0;
                $jumlahtotalraciksirupoctober = 0;
                $jumlahtotalraciksirupnovember = 0;
                $jumlahtotalraciksirupdecember = 0;

                $jumlahtotalkonselingjanuary = 0;
                $jumlahtotalkonselingfebruary = 0;
                $jumlahtotalkonselingmarch = 0;
                $jumlahtotalkonselingapril = 0;
                $jumlahtotalkonselingmay = 0;
                $jumlahtotalkonselingjune = 0;
                $jumlahtotalkonselingjuly = 0;
                $jumlahtotalkonselingaugust = 0;
                $jumlahtotalkonselingseptember = 0;
                $jumlahtotalkonselingoctober = 0;
                $jumlahtotalkonselingnovember = 0;
                $jumlahtotalkonselingdecember = 0;

                $jumlahtotalpetunjukjanuary = 0;
                $jumlahtotalpetunjukfebruary = 0;
                $jumlahtotalpetunjukmarch = 0;
                $jumlahtotalpetunjukapril = 0;
                $jumlahtotalpetunjukmay = 0;
                $jumlahtotalpetunjukjune = 0;
                $jumlahtotalpetunjukjuly = 0;
                $jumlahtotalpetunjukaugust = 0;
                $jumlahtotalpetunjukseptember = 0;
                $jumlahtotalpetunjukoctober = 0;
                $jumlahtotalpetunjuknovember = 0;
                $jumlahtotalpetunjukdecember = 0;

                $jumlahtotalvisitejanuary = 0;
                $jumlahtotalvisitefebruary = 0;
                $jumlahtotalvisitemarch = 0;
                $jumlahtotalvisiteapril = 0;
                $jumlahtotalvisitemay = 0;
                $jumlahtotalvisitejune = 0;
                $jumlahtotalvisitejuly = 0;
                $jumlahtotalvisiteaugust = 0;
                $jumlahtotalvisiteseptember = 0;
                $jumlahtotalvisiteoctober = 0;
                $jumlahtotalvisitenovember = 0;
                $jumlahtotalvisitedecember = 0;

                $jumlahtotalpemantauanjanuary = 0;
                $jumlahtotalpemantauanfebruary = 0;
                $jumlahtotalpemantauanmarch = 0;
                $jumlahtotalpemantauanapril = 0;
                $jumlahtotalpemantauanmay = 0;
                $jumlahtotalpemantauanjune = 0;
                $jumlahtotalpemantauanjuly = 0;
                $jumlahtotalpemantauanaugust = 0;
                $jumlahtotalpemantauanseptember = 0;
                $jumlahtotalpemantauanoctober = 0;
                $jumlahtotalpemantauannovember = 0;
                $jumlahtotalpemantauandecember = 0;

                $jumlahtotalembalacejanuary = 0;
                $jumlahtotalembalacefebruary = 0;
                $jumlahtotalembalacemarch = 0;
                $jumlahtotalembalaceapril = 0;
                $jumlahtotalembalacemay = 0;
                $jumlahtotalembalacejune = 0;
                $jumlahtotalembalacejuly = 0;
                $jumlahtotalembalaceaugust = 0;
                $jumlahtotalembalaceseptember = 0;
                $jumlahtotalembalaceoctober = 0;
                $jumlahtotalembalacenovember = 0;
                $jumlahtotalembalacedecember = 0;

                $jumlahtotalinjeksijanuary = 0;
                $jumlahtotalinjeksifebruary = 0;
                $jumlahtotalinjeksimarch = 0;
                $jumlahtotalinjeksiapril = 0;
                $jumlahtotalinjeksimay = 0;
                $jumlahtotalinjeksijune = 0;
                $jumlahtotalinjeksijuly = 0;
                $jumlahtotalinjeksiaugust = 0;
                $jumlahtotalinjeksiseptember = 0;
                $jumlahtotalinjeksioctober = 0;
                $jumlahtotalinjeksinovember = 0;
                $jumlahtotalinjeksidecember = 0;

                $jumlahtotalinfusjanuary = 0;
                $jumlahtotalinfusfebruary = 0;
                $jumlahtotalinfusmarch = 0;
                $jumlahtotalinfusapril = 0;
                $jumlahtotalinfusmay = 0;
                $jumlahtotalinfusjune = 0;
                $jumlahtotalinfusjuly = 0;
                $jumlahtotalinfusaugust = 0;
                $jumlahtotalinfusseptember = 0;
                $jumlahtotalinfusoctober = 0;
                $jumlahtotalinfusnovember = 0;
                $jumlahtotalinfusdecember = 0;

                $jumlahtotalrekonjanuary = 0;
                $jumlahtotalrekonfebruary = 0;
                $jumlahtotalrekonmarch = 0;
                $jumlahtotalrekonapril = 0;
                $jumlahtotalrekonmay = 0;
                $jumlahtotalrekonjune = 0;
                $jumlahtotalrekonjuly = 0;
                $jumlahtotalrekonaugust = 0;
                $jumlahtotalrekonseptember = 0;
                $jumlahtotalrekonoctober = 0;
                $jumlahtotalrekonnovember = 0;
                $jumlahtotalrekondecember = 0;
                
            foreach ($jumlahrke  as $rke){
                if ($rke->bulan == 'January' && $resep->bulan == 'January'){
                    $jumlahtotalrkejanuary = $rke->jumlahrke;
                    $jumlahtotalresepjanuary = $resep->jumlahresep;
                    $totalrke+=$jumlahtotalrkejanuary;
                    $totalresep+=$jumlahtotalresepjanuary;
                }

                if ($rke->bulan == 'February' && $resep->bulan == 'February' ){
                    $jumlahtotalrkefebruary = $rke->jumlahrke;
                    $jumlahtotalresepfebruary = $resep->jumlahresep;
                    $totalrke+=$jumlahtotalrkefebruary;
                    $totalresep+=$jumlahtotalresepfebruary;
                }
                if ($rke->bulan == 'March' && $resep->bulan == 'March'){
                    $jumlahtotalrkemarch = $rke->jumlahrke;
                    $jumlahtotalresepmarch = $resep->jumlahresep;
                    $totalrke+=$jumlahtotalrkemarch;
                    $totalresep+=$jumlahtotalresepmarch;
                }
                if ($rke->bulan == 'April' && $resep->bulan == 'April'){
                    $jumlahtotalrkeapril = $rke->jumlahrke;
                    $jumlahtotalresepapril = $resep->jumlahresep;
                    $totalrke+=$jumlahtotalrkeapril;
                    $totalresep+=$jumlahtotalresepapril;
                }
                if ($rke->bulan == 'May' && $resep->bulan == 'May'){
                    $jumlahtotalrkemay = $rke->jumlahrke;
                    $jumlahtotalresepmay = $resep->jumlahresep;
                    $totalrke+=$jumlahtotalrkemay;
                    $totalresep+=$jumlahtotalresepmay;
                }
                if ($rke->bulan == 'June'&& $resep->bulan == 'June'){
                    $jumlahtotalrkejune = $rke->jumlahrke;
                    $jumlahtotalresepjune = $resep->jumlahresep;
                    $totalrke+=$jumlahtotalrkejune;
                    $totalresep+=$jumlahtotalresepjune;
                }
                if ($rke->bulan == 'July' && $resep->bulan == 'July'){
                    $jumlahtotalrkejuly = $rke->jumlahrke;
                    $jumlahtotalresepjuly = $resep->jumlahresep;
                    $totalrke+=$jumlahtotalrkejuly;
                    $totalresep+=$jumlahtotalresepjuly;
                }
                if ($rke->bulan == 'August' && $resep->bulan == 'August'){
                    $jumlahtotalrkeaugust = $rke->jumlahrke;
                    $jumlahtotalresepaugust = $resep->jumlahresep;
                    $totalrke+=$jumlahtotalrkeaugust;
                    $totalresep+=$jumlahtotalresepaugust;
                }
                if ($rke->bulan == 'September' && $resep->bulan == 'September'){
                    $jumlahtotalrkeseptember = $rke->jumlahrke;
                    $jumlahtotalresepseptember = $resep->jumlahresep;
                    $totalrke+=$jumlahtotalrkeseptember;
                    $totalresep+=$jumlahtotalresepseptember;

                }
                if ($rke->bulan == 'October' && $resep->bulan == 'October'){
                    $jumlahtotalrkeoctober = $rke->jumlahrke;
                    $jumlahtotalresepoctober = $resep->jumlahresep;
                    $totalrke+=$jumlahtotalrkeoctober;
                    $totalresep+=$jumlahtotalresepoctober;

                }
                if ($rke->bulan == 'November' && $resep->bulan == 'November'){
                    $jumlahtotalrkenovember = $rke->jumlahrke;
                    $jumlahtotalresepnovember = $resep->jumlahresep;
                    $totalrke+=$jumlahtotalrkenovember;
                    $totalresep+=$jumlahtotalresepnovember;
                }
                if ($rke->bulan == 'December' && $resep->bulan == 'December'){
                    $jumlahtotalrkedecember = $rke->jumlahrke;
                    $jumlahtotalresepdecember = $resep->jumlahresep;
                    $totalrke+=$jumlahtotalrkedecember;
                    $totalresep+=$jumlahtotalresepdecember;
                }
            }

            foreach($pelayanan as $layanan){
                if ($layanan->bulan == 'January' && $layanan->namaproduk == 'Pelayanan Resep Obat Jadi / Alkes'){
                    $jumlahtotalobatjadijanuary = $layanan->jumlah;
                    $totalobatjadi+=$jumlahtotalobatjadijanuary;
                }
                if ($layanan->bulan == 'February' && $layanan->namaproduk == 'Pelayanan Resep Obat Jadi / Alkes'){
                    $jumlahtotalobatjadifebruary = $layanan->jumlah;
                    $totalobatjadi+=$jumlahtotalobatjadifebruary;
                }
                if ($layanan->bulan == 'March' && $layanan->namaproduk == 'Pelayanan Resep Obat Jadi / Alkes'){
                    $jumlahtotalobatjadimarch = $layanan->jumlah;
                    $totalobatjadi+=$jumlahtotalobatjadimarch;
                }
                if ($layanan->bulan == 'April' && $layanan->namaproduk == 'Pelayanan Resep Obat Jadi / Alkes'){
                    $jumlahtotalobatjadiapril = $layanan->jumlah;
                    $totalobatjadi+=$jumlahtotalobatjadiapril;
                }
                if ($layanan->bulan == 'May' && $layanan->namaproduk == 'Pelayanan Resep Obat Jadi / Alkes'){
                    $jumlahtotalobatjadimay = $layanan->jumlah;
                    $totalobatjadi+=$jumlahtotalobatjadimay;
                }
                if ($layanan->bulan == 'June'&& $layanan->namaproduk == 'Pelayanan Resep Obat Jadi / Alkes'){
                    $jumlahtotalobatjadijune = $layanan->jumlah;
                    $totalobatjadi+=$jumlahtotalobatjadijune;
                }
                if ($layanan->bulan == 'July' && $layanan->namaproduk == 'Pelayanan Resep Obat Jadi / Alkes'){
                    $jumlahtotalobatjadijuly = $layanan->jumlah;
                    $totalobatjadi+=$jumlahtotalobatjadijuly;
                }
                if ($layanan->bulan == 'August' && $layanan->namaproduk == 'Pelayanan Resep Obat Jadi / Alkes'){
                    $jumlahtotalobatjadiaugust = $layanan->jumlah;
                    $totalobatjadi+=$jumlahtotalobatjadiaugust;
                }
                if ($layanan->bulan == 'September' && $layanan->namaproduk == 'Pelayanan Resep Obat Jadi / Alkes'){
                    $jumlahtotalobatjadiseptember = $layanan->jumlah;
                    $totalobatjadi+=$jumlahtotalobatjadiseptember;

                }
                if ($layanan->bulan == 'October' && $layanan->namaproduk == 'Pelayanan Resep Obat Jadi / Alkes'){
                    $jumlahtotalobatjadioctober = $layanan->jumlah;
                    $totalobatjadi+=$jumlahtotalobatjadioctober;

                }
                if ($layanan->bulan == 'November' && $layanan->namaproduk == 'Pelayanan Resep Obat Jadi / Alkes'){
                    $jumlahtotalobatjadinovember = $layanan->jumlah;
                    $totalobatjadi+=$jumlahtotalobatjadinovember;
                }
                if ($layanan->bulan == 'December' && $layanan->namaproduk == 'Pelayanan Resep Obat Jadi / Alkes'){
                    $jumlahtotalobatjadidecember = $layanan->jumlah;
                    $totalobatjadi+=$jumlahtotalobatjadidecember;
                }

                if ($layanan->bulan == 'January' && $layanan->namaproduk == 'Pelayanan Resep Obat di kapsul < 30 Kapsul'){
                    $jumlahtotalkapsulkurangjanuary = $layanan->jumlah;
                    $totalkapsulkurang+=$jumlahtotalkapsulkurangjanuary;
                }
                if ($layanan->bulan == 'February' && $layanan->namaproduk == 'Pelayanan Resep Obat di kapsul < 30 Kapsul'){
                    $jumlahtotalkapsulkurangfebruary = $layanan->jumlah;
                    $totalkapsulkurang+=$jumlahtotalkapsulkurangfebruary;
                }
                if ($layanan->bulan == 'March' && $layanan->namaproduk == 'Pelayanan Resep Obat di kapsul < 30 Kapsul'){
                    $jumlahtotalkapsulkurangmarch = $layanan->jumlah;
                    $totalkapsulkurang+=$jumlahtotalkapsulkurangmarch;
                }
                if ($layanan->bulan == 'April' && $layanan->namaproduk == 'Pelayanan Resep Obat di kapsul < 30 Kapsul'){
                    $jumlahtotalkapsulkurangapril = $layanan->jumlah;
                    $totalkapsulkurang+=$jumlahtotalkapsulkurangapril;
                }
                if ($layanan->bulan == 'May' && $layanan->namaproduk == 'Pelayanan Resep Obat di kapsul < 30 Kapsul'){
                    $jumlahtotalkapsulkurangmay = $layanan->jumlah;
                    $totalkapsulkurang+=$jumlahtotalkapsulkurangmay;
                }
                if ($layanan->bulan == 'June'&& $layanan->namaproduk == 'Pelayanan Resep Obat di kapsul < 30 Kapsul'){
                    $jumlahtotalkapsulkurangjune = $layanan->jumlah;
                    $totalkapsulkurang+=$jumlahtotalkapsulkurangjune;
                }
                if ($layanan->bulan == 'July' && $layanan->namaproduk == 'Pelayanan Resep Obat di kapsul < 30 Kapsul'){
                    $jumlahtotalkapsulkurangjuly = $layanan->jumlah;
                    $totalkapsulkurang+=$jumlahtotalkapsulkurangjuly;
                }
                if ($layanan->bulan == 'August' && $layanan->namaproduk == 'Pelayanan Resep Obat di kapsul < 30 Kapsul'){
                    $jumlahtotalkapsulkurangaugust = $layanan->jumlah;
                    $totalkapsulkurang+=$jumlahtotalkapsulkurangaugust;
                }
                if ($layanan->bulan == 'September' && $layanan->namaproduk == 'Pelayanan Resep Obat di kapsul < 30 Kapsul'){
                    $jumlahtotalkapsulkurangseptember = $layanan->jumlah;
                    $totalkapsulkurang+=$jumlahtotalkapsulkurangseptember;

                }
                if ($layanan->bulan == 'October' && $layanan->namaproduk == 'Pelayanan Resep Obat di kapsul < 30 Kapsul'){
                    $jumlahtotalkapsulkurangoctober = $layanan->jumlah;
                    $totalkapsulkurang+=$jumlahtotalkapsulkurangoctober;

                }
                if ($layanan->bulan == 'November' && $layanan->namaproduk == 'Pelayanan Resep Obat di kapsul < 30 Kapsul'){
                    $jumlahtotalkapsulkurangnovember = $layanan->jumlah;
                    $totalkapsulkurang+=$jumlahtotalkapsulkurangnovember;
                }
                if ($layanan->bulan == 'December' && $layanan->namaproduk == 'Pelayanan Resep Obat di kapsul < 30 Kapsul'){
                    $jumlahtotalkapsulkurangdecember = $layanan->jumlah;
                    $totalkapsulkurang+=$jumlahtotalkapsulkurangdecember;
                }

                if ($layanan->bulan == 'January' && $layanan->namaproduk == 'Pelayanan Resep Obat di kapsul > 30 Kapsul'){
                    $jumlahtotalkapsullebihjanuary = $layanan->jumlah;
                    $totalkapsullebih+=$jumlahtotalkapsullebihjanuary;
                }
                if ($layanan->bulan == 'February' && $layanan->namaproduk == 'Pelayanan Resep Obat di kapsul > 30 Kapsul'){
                    $jumlahtotalkapsullebihfebruary = $layanan->jumlah;
                    $totalkapsullebih+=$jumlahtotalkapsullebihfebruary;
                }
                if ($layanan->bulan == 'March' && $layanan->namaproduk == 'Pelayanan Resep Obat di kapsul > 30 Kapsul'){
                    $jumlahtotalkapsullebihmarch = $layanan->jumlah;
                    $totalkapsullebih+=$jumlahtotalkapsullebihmarch;
                }
                if ($layanan->bulan == 'April' && $layanan->namaproduk == 'Pelayanan Resep Obat di kapsul > 30 Kapsul'){
                    $jumlahtotalkapsullebihapril = $layanan->jumlah;
                    $totalkapsullebih+=$jumlahtotalkapsullebihapril;
                }
                if ($layanan->bulan == 'May' && $layanan->namaproduk == 'Pelayanan Resep Obat di kapsul > 30 Kapsul'){
                    $jumlahtotalkapsullebihmay = $layanan->jumlah;
                    $totalkapsullebih+=$jumlahtotalkapsullebihmay;
                }
                if ($layanan->bulan == 'June'&& $layanan->namaproduk == 'Pelayanan Resep Obat di kapsul > 30 Kapsul'){
                    $jumlahtotalkapsullebihjune = $layanan->jumlah;
                    $totalkapsullebih+=$jumlahtotalkapsullebihjune;
                }
                if ($layanan->bulan == 'July' && $layanan->namaproduk == 'Pelayanan Resep Obat di kapsul > 30 Kapsul'){
                    $jumlahtotalkapsullebihjuly = $layanan->jumlah;
                    $totalkapsullebih+=$jumlahtotalkapsullebihjuly;
                }
                if ($layanan->bulan == 'August' && $layanan->namaproduk == 'Pelayanan Resep Obat di kapsul > 30 Kapsul'){
                    $jumlahtotalkapsullebihaugust = $layanan->jumlah;
                    $totalkapsullebih+=$jumlahtotalkapsullebihaugust;
                }
                if ($layanan->bulan == 'September' && $layanan->namaproduk == 'Pelayanan Resep Obat di kapsul > 30 Kapsul'){
                    $jumlahtotalkapsullebihseptember = $layanan->jumlah;
                    $totalkapsullebih+=$jumlahtotalkapsullebihseptember;

                }
                if ($layanan->bulan == 'October' && $layanan->namaproduk == 'Pelayanan Resep Obat di kapsul > 30 Kapsul'){
                    $jumlahtotalkapsullebihoctober = $layanan->jumlah;
                    $totalkapsullebih+=$jumlahtotalkapsullebihoctober;

                }
                if ($layanan->bulan == 'November' && $layanan->namaproduk == 'Pelayanan Resep Obat di kapsul > 30 Kapsul'){
                    $jumlahtotalkapsullebihnovember = $layanan->jumlah;
                    $totalkapsullebih+=$jumlahtotalkapsullebihnovember;
                }
                if ($layanan->bulan == 'December' && $layanan->namaproduk == 'Pelayanan Resep Obat di kapsul > 30 Kapsul'){
                    $jumlahtotalkapsullebihdecember = $layanan->jumlah;
                    $totalkapsullebih+=$jumlahtotalkapsullebihdecember;
                }

                if ($layanan->bulan == 'January' && $layanan->namaproduk == 'Pelayanan Resep Obat Racik < 30 Bungkus'){
                    $jumlahtotalracikkurangjanuary = $layanan->jumlah;
                    $totalracikkurang+=$jumlahtotalracikkurangjanuary;
                }
                if ($layanan->bulan == 'February' && $layanan->namaproduk == 'Pelayanan Resep Obat Racik < 30 Bungkus'){
                    $jumlahtotalracikkurangfebruary = $layanan->jumlah;
                    $totalracikkurang+=$jumlahtotalracikkurangfebruary;
                }
                if ($layanan->bulan == 'March' && $layanan->namaproduk == 'Pelayanan Resep Obat Racik < 30 Bungkus'){
                    $jumlahtotalracikkurangmarch = $layanan->jumlah;
                    $totalracikkurang+=$jumlahtotalracikkurangmarch;
                }
                if ($layanan->bulan == 'April' && $layanan->namaproduk == 'Pelayanan Resep Obat Racik < 30 Bungkus'){
                    $jumlahtotalracikkurangapril = $layanan->jumlah;
                    $totalracikkurang+=$jumlahtotalracikkurangapril;
                }
                if ($layanan->bulan == 'May' && $layanan->namaproduk == 'Pelayanan Resep Obat Racik < 30 Bungkus'){
                    $jumlahtotalracikkurangmay = $layanan->jumlah;
                    $totalracikkurang+=$jumlahtotalracikkurangmay;
                }
                if ($layanan->bulan == 'June'&& $layanan->namaproduk == 'Pelayanan Resep Obat Racik < 30 Bungkus'){
                    $jumlahtotalracikkurangjune = $layanan->jumlah;
                    $totalracikkurang+=$jumlahtotalracikkurangjune;
                }
                if ($layanan->bulan == 'July' && $layanan->namaproduk == 'Pelayanan Resep Obat Racik < 30 Bungkus'){
                    $jumlahtotalracikkurangjuly = $layanan->jumlah;
                    $totalracikkurang+=$jumlahtotalracikkurangjuly;
                }
                if ($layanan->bulan == 'August' && $layanan->namaproduk == 'Pelayanan Resep Obat Racik < 30 Bungkus'){
                    $jumlahtotalracikkurangaugust = $layanan->jumlah;
                    $totalracikkurang+=$jumlahtotalracikkurangaugust;
                }
                if ($layanan->bulan == 'September' && $layanan->namaproduk == 'Pelayanan Resep Obat Racik < 30 Bungkus'){
                    $jumlahtotalracikkurangseptember = $layanan->jumlah;
                    $totalracikkurang+=$jumlahtotalracikkurangseptember;

                }
                if ($layanan->bulan == 'October' && $layanan->namaproduk == 'Pelayanan Resep Obat Racik < 30 Bungkus'){
                    $jumlahtotalracikkurangoctober = $layanan->jumlah;
                    $totalracikkurang+=$jumlahtotalracikkurangoctober;

                }
                if ($layanan->bulan == 'November' && $layanan->namaproduk == 'Pelayanan Resep Obat Racik < 30 Bungkus'){
                    $jumlahtotalracikkurangnovember = $layanan->jumlah;
                    $totalracikkurang+=$jumlahtotalracikkurangnovember;
                }
                if ($layanan->bulan == 'December' && $layanan->namaproduk == 'Pelayanan Resep Obat Racik < 30 Bungkus'){
                    $jumlahtotalracikkurangdecember = $layanan->jumlah;
                    $totalracikkurang+=$jumlahtotalracikkurangdecember;
                }

                if ($layanan->bulan == 'January' && $layanan->namaproduk == 'Pelayanan Resep Obat Racik > 30 Bungkus'){
                    $jumlahtotalraciklebihjanuary = $layanan->jumlah;
                    $totalraciklebih+=$jumlahtotalraciklebihjanuary;
                }
                if ($layanan->bulan == 'February' && $layanan->namaproduk == 'Pelayanan Resep Obat Racik > 30 Bungkus'){
                    $jumlahtotalraciklebihfebruary = $layanan->jumlah;
                    $totalraciklebih+=$jumlahtotalraciklebihfebruary;
                }
                if ($layanan->bulan == 'March' && $layanan->namaproduk == 'Pelayanan Resep Obat Racik > 30 Bungkus'){
                    $jumlahtotalraciklebihmarch = $layanan->jumlah;
                    $totalraciklebih+=$jumlahtotalraciklebihmarch;
                }
                if ($layanan->bulan == 'April' && $layanan->namaproduk == 'Pelayanan Resep Obat Racik > 30 Bungkus'){
                    $jumlahtotalraciklebihapril = $layanan->jumlah;
                    $totalraciklebih+=$jumlahtotalraciklebihapril;
                }
                if ($layanan->bulan == 'May' && $layanan->namaproduk == 'Pelayanan Resep Obat Racik > 30 Bungkus'){
                    $jumlahtotalraciklebihmay = $layanan->jumlah;
                    $totalraciklebih+=$jumlahtotalraciklebihmay;
                }
                if ($layanan->bulan == 'June'&& $layanan->namaproduk == 'Pelayanan Resep Obat Racik > 30 Bungkus'){
                    $jumlahtotalraciklebihjune = $layanan->jumlah;
                    $totalraciklebih+=$jumlahtotalraciklebihjune;
                }
                if ($layanan->bulan == 'July' && $layanan->namaproduk == 'Pelayanan Resep Obat Racik > 30 Bungkus'){
                    $jumlahtotalraciklebihjuly = $layanan->jumlah;
                    $totalraciklebih+=$jumlahtotalraciklebihjuly;
                }
                if ($layanan->bulan == 'August' && $layanan->namaproduk == 'Pelayanan Resep Obat Racik > 30 Bungkus'){
                    $jumlahtotalraciklebihaugust = $layanan->jumlah;
                    $totalraciklebih+=$jumlahtotalraciklebihaugust;
                }
                if ($layanan->bulan == 'September' && $layanan->namaproduk == 'Pelayanan Resep Obat Racik > 30 Bungkus'){
                    $jumlahtotalraciklebihseptember = $layanan->jumlah;
                    $totalraciklebih+=$jumlahtotalraciklebihseptember;

                }
                if ($layanan->bulan == 'October' && $layanan->namaproduk == 'Pelayanan Resep Obat Racik > 30 Bungkus'){
                    $jumlahtotalraciklebihoctober = $layanan->jumlah;
                    $totalraciklebih+=$jumlahtotalraciklebihoctober;

                }
                if ($layanan->bulan == 'November' && $layanan->namaproduk == 'Pelayanan Resep Obat Racik > 30 Bungkus'){
                    $jumlahtotalraciklebihnovember = $layanan->jumlah;
                    $totalraciklebih+=$jumlahtotalraciklebihnovember;
                }
                if ($layanan->bulan == 'December' && $layanan->namaproduk == 'Pelayanan Resep Obat Racik > 30 Bungkus'){
                    $jumlahtotalraciklebihdecember = $layanan->jumlah;
                    $totalraciklebih+=$jumlahtotalraciklebihdecember;
                }

                if ($layanan->bulan == 'January' && $layanan->namaproduk == 'Pelayanan Resep Racik Salep'){
                    $jumlahtotalraciksalepjanuary = $layanan->jumlah;
                    $totalraciksalep+=$jumlahtotalraciksalepjanuary;
                }
                if ($layanan->bulan == 'February' && $layanan->namaproduk == 'Pelayanan Resep Racik Salep'){
                    $jumlahtotalraciksalepfebruary = $layanan->jumlah;
                    $totalraciksalep+=$jumlahtotalraciksalepfebruary;
                }
                if ($layanan->bulan == 'March' && $layanan->namaproduk == 'Pelayanan Resep Racik Salep'){
                    $jumlahtotalraciksalepmarch = $layanan->jumlah;
                    $totalraciksalep+=$jumlahtotalraciksalepmarch;
                }
                if ($layanan->bulan == 'April' && $layanan->namaproduk == 'Pelayanan Resep Racik Salep'){
                    $jumlahtotalraciksalepapril = $layanan->jumlah;
                    $totalraciksalep+=$jumlahtotalraciksalepapril;
                }
                if ($layanan->bulan == 'May' && $layanan->namaproduk == 'Pelayanan Resep Racik Salep'){
                    $jumlahtotalraciksalepmay = $layanan->jumlah;
                    $totalraciksalep+=$jumlahtotalraciksalepmay;
                }
                if ($layanan->bulan == 'June'&& $layanan->namaproduk == 'Pelayanan Resep Racik Salep'){
                    $jumlahtotalraciksalepjune = $layanan->jumlah;
                    $totalraciksalep+=$jumlahtotalraciksalepjune;
                }
                if ($layanan->bulan == 'July' && $layanan->namaproduk == 'Pelayanan Resep Racik Salep'){
                    $jumlahtotalraciksalepjuly = $layanan->jumlah;
                    $totalraciksalep+=$jumlahtotalraciksalepjuly;
                }
                if ($layanan->bulan == 'August' && $layanan->namaproduk == 'Pelayanan Resep Racik Salep'){
                    $jumlahtotalraciksalepaugust = $layanan->jumlah;
                    $totalraciksalep+=$jumlahtotalraciksalepaugust;
                }
                if ($layanan->bulan == 'September' && $layanan->namaproduk == 'Pelayanan Resep Racik Salep'){
                    $jumlahtotalraciksalepseptember = $layanan->jumlah;
                    $totalraciksalep+=$jumlahtotalraciksalepseptember;

                }
                if ($layanan->bulan == 'October' && $layanan->namaproduk == 'Pelayanan Resep Racik Salep'){
                    $jumlahtotalraciksalepoctober = $layanan->jumlah;
                    $totalraciksalep+=$jumlahtotalraciksalepoctober;

                }
                if ($layanan->bulan == 'November' && $layanan->namaproduk == 'Pelayanan Resep Racik Salep'){
                    $jumlahtotalraciksalepnovember = $layanan->jumlah;
                    $totalraciksalep+=$jumlahtotalraciksalepnovember;
                }
                if ($layanan->bulan == 'December' && $layanan->namaproduk == 'Pelayanan Resep Racik Salep'){
                    $jumlahtotalraciksalepdecember = $layanan->jumlah;
                    $totalraciksalep+=$jumlahtotalraciksalepdecember;
                }

                if ($layanan->bulan == 'January' && $layanan->namaproduk == 'Pelayanan Resep Racik Sirup'){
                    $jumlahtotalraciksirupjanuary = $layanan->jumlah;
                    $totalraciksirup+=$jumlahtotalraciksirupjanuary;
                }
                if ($layanan->bulan == 'February' && $layanan->namaproduk == 'Pelayanan Resep Racik Sirup'){
                    $jumlahtotalraciksirupfebruary = $layanan->jumlah;
                    $totalraciksirup+=$jumlahtotalraciksirupfebruary;
                }
                if ($layanan->bulan == 'March' && $layanan->namaproduk == 'Pelayanan Resep Racik Sirup'){
                    $jumlahtotalraciksirupmarch = $layanan->jumlah;
                    $totalraciksirup+=$jumlahtotalraciksirupmarch;
                }
                if ($layanan->bulan == 'April' && $layanan->namaproduk == 'Pelayanan Resep Racik Sirup'){
                    $jumlahtotalraciksirupapril = $layanan->jumlah;
                    $totalraciksirup+=$jumlahtotalraciksirupapril;
                }
                if ($layanan->bulan == 'May' && $layanan->namaproduk == 'Pelayanan Resep Racik Sirup'){
                    $jumlahtotalraciksirupmay = $layanan->jumlah;
                    $totalraciksirup+=$jumlahtotalraciksirupmay;
                }
                if ($layanan->bulan == 'June'&& $layanan->namaproduk == 'Pelayanan Resep Racik Sirup'){
                    $jumlahtotalraciksirupjune = $layanan->jumlah;
                    $totalraciksirup+=$jumlahtotalraciksirupjune;
                }
                if ($layanan->bulan == 'July' && $layanan->namaproduk == 'Pelayanan Resep Racik Sirup'){
                    $jumlahtotalraciksirupjuly = $layanan->jumlah;
                    $totalraciksirup+=$jumlahtotalraciksirupjuly;
                }
                if ($layanan->bulan == 'August' && $layanan->namaproduk == 'Pelayanan Resep Racik Sirup'){
                    $jumlahtotalraciksirupaugust = $layanan->jumlah;
                    $totalraciksirup+=$jumlahtotalraciksirupaugust;
                }
                if ($layanan->bulan == 'September' && $layanan->namaproduk == 'Pelayanan Resep Racik Sirup'){
                    $jumlahtotalraciksirupseptember = $layanan->jumlah;
                    $totalraciksirup+=$jumlahtotalraciksirupseptember;

                }
                if ($layanan->bulan == 'October' && $layanan->namaproduk == 'Pelayanan Resep Racik Sirup'){
                    $jumlahtotalraciksirupoctober = $layanan->jumlah;
                    $totalraciksirup+=$jumlahtotalraciksirupoctober;

                }
                if ($layanan->bulan == 'November' && $layanan->namaproduk == 'Pelayanan Resep Racik Sirup'){
                    $jumlahtotalraciksirupnovember = $layanan->jumlah;
                    $totalraciksirup+=$jumlahtotalraciksirupnovember;
                }
                if ($layanan->bulan == 'December' && $layanan->namaproduk == 'Pelayanan Resep Racik Sirup'){
                    $jumlahtotalraciksirupdecember = $layanan->jumlah;
                    $totalraciksirup+=$jumlahtotalraciksirupdecember;
                }

                if ($layanan->bulan == 'January' && $layanan->namaproduk == 'Konseling / Konsultasi Obat'){
                    $jumlahtotalkonselingjanuary = $layanan->jumlah;
                    $totalkonseling+=$jumlahtotalkonselingjanuary;
                }
                if ($layanan->bulan == 'February' && $layanan->namaproduk == 'Konseling / Konsultasi Obat'){
                    $jumlahtotalkonselingfebruary = $layanan->jumlah;
                    $totalkonseling+=$jumlahtotalkonselingfebruary;
                }
                if ($layanan->bulan == 'March' && $layanan->namaproduk == 'Konseling / Konsultasi Obat'){
                    $jumlahtotalkonselingmarch = $layanan->jumlah;
                    $totalkonseling+=$jumlahtotalkonselingmarch;
                }
                if ($layanan->bulan == 'April' && $layanan->namaproduk == 'Konseling / Konsultasi Obat'){
                    $jumlahtotalkonselingapril = $layanan->jumlah;
                    $totalkonseling+=$jumlahtotalkonselingapril;
                }
                if ($layanan->bulan == 'May' && $layanan->namaproduk == 'Konseling / Konsultasi Obat'){
                    $jumlahtotalkonselingmay = $layanan->jumlah;
                    $totalkonseling+=$jumlahtotalkonselingmay;
                }
                if ($layanan->bulan == 'June'&& $layanan->namaproduk == 'Konseling / Konsultasi Obat'){
                    $jumlahtotalkonselingjune = $layanan->jumlah;
                    $totalkonseling+=$jumlahtotalkonselingjune;
                }
                if ($layanan->bulan == 'July' && $layanan->namaproduk == 'Konseling / Konsultasi Obat'){
                    $jumlahtotalkonselingjuly = $layanan->jumlah;
                    $totalkonseling+=$jumlahtotalkonselingjuly;
                }
                if ($layanan->bulan == 'August' && $layanan->namaproduk == 'Konseling / Konsultasi Obat'){
                    $jumlahtotalkonselingaugust = $layanan->jumlah;
                    $totalkonseling+=$jumlahtotalkonselingaugust;
                }
                if ($layanan->bulan == 'September' && $layanan->namaproduk == 'Konseling / Konsultasi Obat'){
                    $jumlahtotalkonselingseptember = $layanan->jumlah;
                    $totalkonseling+=$jumlahtotalkonselingseptember;

                }
                if ($layanan->bulan == 'October' && $layanan->namaproduk == 'Konseling / Konsultasi Obat'){
                    $jumlahtotalkonselingoctober = $layanan->jumlah;
                    $totalkonseling+=$jumlahtotalkonselingoctober;

                }
                if ($layanan->bulan == 'November' && $layanan->namaproduk == 'Konseling / Konsultasi Obat'){
                    $jumlahtotalkonselingnovember = $layanan->jumlah;
                    $totalkonseling+=$jumlahtotalkonselingnovember;
                }
                if ($layanan->bulan == 'December' && $layanan->namaproduk == 'Konseling / Konsultasi Obat'){
                    $jumlahtotalkonselingdecember = $layanan->jumlah;
                    $totalkonseling+=$jumlahtotalkonselingdecember;
                }

                if ($layanan->bulan == 'January' && $layanan->namaproduk == 'Petunjuk Informasi Obat'){
                    $jumlahtotalpetunjukjanuary = $layanan->jumlah;
                    $totalpetunjuk+=$jumlahtotalpetunjukjanuary;
                }
                if ($layanan->bulan == 'February' && $layanan->namaproduk == 'Petunjuk Informasi Obat'){
                    $jumlahtotalpetunjukfebruary = $layanan->jumlah;
                    $totalpetunjuk+=$jumlahtotalpetunjukfebruary;
                }
                if ($layanan->bulan == 'March' && $layanan->namaproduk == 'Petunjuk Informasi Obat'){
                    $jumlahtotalpetunjukmarch = $layanan->jumlah;
                    $totalpetunjuk+=$jumlahtotalpetunjukmarch;
                }
                if ($layanan->bulan == 'April' && $layanan->namaproduk == 'Petunjuk Informasi Obat'){
                    $jumlahtotalpetunjukapril = $layanan->jumlah;
                    $totalpetunjuk+=$jumlahtotalpetunjukapril;
                }
                if ($layanan->bulan == 'May' && $layanan->namaproduk == 'Petunjuk Informasi Obat'){
                    $jumlahtotalpetunjukmay = $layanan->jumlah;
                    $totalpetunjuk+=$jumlahtotalpetunjukmay;
                }
                if ($layanan->bulan == 'June'&& $layanan->namaproduk == 'Petunjuk Informasi Obat'){
                    $jumlahtotalpetunjukjune = $layanan->jumlah;
                    $totalpetunjuk+=$jumlahtotalpetunjukjune;
                }
                if ($layanan->bulan == 'July' && $layanan->namaproduk == 'Petunjuk Informasi Obat'){
                    $jumlahtotalpetunjukjuly = $layanan->jumlah;
                    $totalpetunjuk+=$jumlahtotalpetunjukjuly;
                }
                if ($layanan->bulan == 'August' && $layanan->namaproduk == 'Petunjuk Informasi Obat'){
                    $jumlahtotalpetunjukaugust = $layanan->jumlah;
                    $totalpetunjuk+=$jumlahtotalpetunjukaugust;
                }
                if ($layanan->bulan == 'September' && $layanan->namaproduk == 'Petunjuk Informasi Obat'){
                    $jumlahtotalpetunjukseptember = $layanan->jumlah;
                    $totalpetunjuk+=$jumlahtotalpetunjukseptember;

                }
                if ($layanan->bulan == 'October' && $layanan->namaproduk == 'Petunjuk Informasi Obat'){
                    $jumlahtotalpetunjukoctober = $layanan->jumlah;
                    $totalpetunjuk+=$jumlahtotalpetunjukoctober;

                }
                if ($layanan->bulan == 'November' && $layanan->namaproduk == 'Petunjuk Informasi Obat'){
                    $jumlahtotalpetunjuknovember = $layanan->jumlah;
                    $totalpetunjuk+=$jumlahtotalpetunjuknovember;
                }
                if ($layanan->bulan == 'December' && $layanan->namaproduk == 'Petunjuk Informasi Obat'){
                    $jumlahtotalpetunjukdecember = $layanan->jumlah;
                    $totalpetunjuk+=$jumlahtotalpetunjukdecember;
                }

                if ($layanan->bulan == 'January' && $layanan->namaproduk == 'Visite Apoteker'){
                    $jumlahtotalvisitejanuary = $layanan->jumlah;
                    $totalvisite+=$jumlahtotalvisitejanuary;
                }
                if ($layanan->bulan == 'February' && $layanan->namaproduk == 'Visite Apoteker'){
                    $jumlahtotavisitefebruary = $layanan->jumlah;
                    $totalvisite+=$jumlahtotalvisitefebruary;
                }
                if ($layanan->bulan == 'March' && $layanan->namaproduk == 'Visite Apoteker'){
                    $jumlahtotalvisitemarch = $layanan->jumlah;
                    $totalvisite+=$jumlahtotalvisitemarch;
                }
                if ($layanan->bulan == 'April' && $layanan->namaproduk == 'Visite Apoteker'){
                    $jumlahtotalvisiteapril = $layanan->jumlah;
                    $totalvisite+=$jumlahtotalvisiteapril;
                }
                if ($layanan->bulan == 'May' && $layanan->namaproduk == 'Visite Apoteker'){
                    $jumlahtotalvisitemay = $layanan->jumlah;
                    $totalvisite+=$jumlahtotalvisitemay;
                }
                if ($layanan->bulan == 'June'&& $layanan->namaproduk == 'Visite Apoteker'){
                    $jumlahtotalvisitejune = $layanan->jumlah;
                    $totalvisite+=$jumlahtotalvisitejune;
                }
                if ($layanan->bulan == 'July' && $layanan->namaproduk == 'Visite Apoteker'){
                    $jumlahtotalvisitejuly = $layanan->jumlah;
                    $totalvisite+=$jumlahtotalvisitejuly;
                }
                if ($layanan->bulan == 'August' && $layanan->namaproduk == 'Visite Apoteker'){
                    $jumlahtotalvisiteaugust = $layanan->jumlah;
                    $totalvisite+=$jumlahtotalvisiteaugust;
                }
                if ($layanan->bulan == 'September' && $layanan->namaproduk == 'Visite Apoteker'){
                    $jumlahtotalvisiteseptember = $layanan->jumlah;
                    $totalvisite+=$jumlahtotalvisiteseptember;

                }
                if ($layanan->bulan == 'October' && $layanan->namaproduk == 'Visite Apoteker'){
                    $jumlahtotalvisiteoctober = $layanan->jumlah;
                    $totalvisite+=$jumlahtotalvisiteoctober;

                }
                if ($layanan->bulan == 'November' && $layanan->namaproduk == 'Visite Apoteker'){
                    $jumlahtotalvisitenovember = $layanan->jumlah;
                    $totalvisite+=$jumlahtotalvisitenovember;
                }
                if ($layanan->bulan == 'December' && $layanan->namaproduk == 'Visite Apoteker'){
                    $jumlahtotalvisitedecember = $layanan->jumlah;
                    $totalvisite+=$jumlahtotalvisitedecember;
                }

                if ($layanan->bulan == 'January' && $layanan->namaproduk == 'Pemantauan Terapi Obat'){
                    $jumlahtotalpemantauanjanuary = $layanan->jumlah;
                    $totalpemantauan+=$jumlahtotalpemantauanjanuary;
                }
                if ($layanan->bulan == 'February' && $layanan->namaproduk == 'Pemantauan Terapi Obat'){
                    $jumlahtotalpemantauanfebruary = $layanan->jumlah;
                    $totalpemantauan+=$jumlahtotalpemantauanfebruary;
                }
                if ($layanan->bulan == 'March' && $layanan->namaproduk == 'Pemantauan Terapi Obat'){
                    $jumlahtotalpemantauanmarch = $layanan->jumlah;
                    $totalpemantauan+=$jumlahtotalpemantauanmarch;
                }
                if ($layanan->bulan == 'April' && $layanan->namaproduk == 'Pemantauan Terapi Obat'){
                    $jumlahtotalpemantauanapril = $layanan->jumlah;
                    $totalpemantauan+=$jumlahtotalpemantauanapril;
                }
                if ($layanan->bulan == 'May' && $layanan->namaproduk == 'Pemantauan Terapi Obat'){
                    $jumlahtotalpemantauanmay = $layanan->jumlah;
                    $totalpemantauan+=$jumlahtotalpemantauanmay;
                }
                if ($layanan->bulan == 'June'&& $layanan->namaproduk == 'Pemantauan Terapi Obat'){
                    $jumlahtotalpemantauanjune = $layanan->jumlah;
                    $totalpemantauan+=$jumlahtotalpemantauanjune;
                }
                if ($layanan->bulan == 'July' && $layanan->namaproduk == 'Pemantauan Terapi Obat'){
                    $jumlahtotalpemantauanjuly = $layanan->jumlah;
                    $totalpemantauan+=$jumlahtotalpemantauanjuly;
                }
                if ($layanan->bulan == 'August' && $layanan->namaproduk == 'Pemantauan Terapi Obat'){
                    $jumlahtotalpemantauanaugust = $layanan->jumlah;
                    $totalpemantauan+=$jumlahtotalpemantauanaugust;
                }
                if ($layanan->bulan == 'September' && $layanan->namaproduk == 'Pemantauan Terapi Obat'){
                    $jumlahtotalpemantauanseptember = $layanan->jumlah;
                    $totalpemantauan+=$jumlahtotalpemantauanseptember;

                }
                if ($layanan->bulan == 'October' && $layanan->namaproduk == 'Pemantauan Terapi Obat'){
                    $jumlahtotalpemantauanoctober = $layanan->jumlah;
                    $totalpemantauan+=$jumlahtotalpemantauanoctober;

                }
                if ($layanan->bulan == 'November' && $layanan->namaproduk == 'Pemantauan Terapi Obat'){
                    $jumlahtotalpemantauannovember = $layanan->jumlah;
                    $totalpemantauan+=$jumlahtotalpemantauannovember;
                }
                if ($layanan->bulan == 'December' && $layanan->namaproduk == 'Pemantauan Terapi Obat'){
                    $jumlahtotalpemantauandecember = $layanan->jumlah;
                    $totalpemantauan+=$jumlahtotalpemantauandecember;
                }

                if ($layanan->bulan == 'January' && $layanan->namaproduk == 'Embalace'){
                    $jumlahtotalembalacejanuary = $layanan->jumlah;
                    $totalembalace+=$jumlahtotalembalacejanuary;
                }
                if ($layanan->bulan == 'February' && $layanan->namaproduk == 'Embalace'){
                    $jumlahtotalembalacefebruary = $layanan->jumlah;
                    $totalembalace+=$jumlahtotalembalacefebruary;
                }
                if ($layanan->bulan == 'March' && $layanan->namaproduk == 'Embalace'){
                    $jumlahtotalembalacemarch = $layanan->jumlah;
                    $totalembalace+=$jumlahtotalembalacemarch;
                }
                if ($layanan->bulan == 'April' && $layanan->namaproduk == 'Embalace'){
                    $jumlahtotalembalaceapril = $layanan->jumlah;
                    $totalembalace+=$jumlahtotalembalaceapril;
                }
                if ($layanan->bulan == 'May' && $layanan->namaproduk == 'Embalace'){
                    $jumlahtotalembalacemay = $layanan->jumlah;
                    $totalembalace+=$jumlahtotalembalacemay;
                }
                if ($layanan->bulan == 'June'&& $layanan->namaproduk == 'Embalace'){
                    $jumlahtotalembalacejune = $layanan->jumlah;
                    $totalembalace+=$jumlahtotalembalacejune;
                }
                if ($layanan->bulan == 'July' && $layanan->namaproduk == 'Embalace'){
                    $jumlahtotalembalacejuly = $layanan->jumlah;
                    $totalembalace+=$jumlahtotalembalacejuly;
                }
                if ($layanan->bulan == 'August' && $layanan->namaproduk == 'Embalace'){
                    $jumlahtotalembalaceaugust = $layanan->jumlah;
                    $totalembalace+=$jumlahtotalembalaceaugust;
                }
                if ($layanan->bulan == 'September' && $layanan->namaproduk == 'Embalace'){
                    $jumlahtotalembalaceseptember = $layanan->jumlah;
                    $totalembalace+=$jumlahtotalembalaceseptember;

                }
                if ($layanan->bulan == 'October' && $layanan->namaproduk == 'Embalace'){
                    $jumlahtotalembalaceoctober = $layanan->jumlah;
                    $totalembalace+=$jumlahtotalembalaceoctober;

                }
                if ($layanan->bulan == 'November' && $layanan->namaproduk == 'Embalace'){
                    $jumlahtotalembalacenovember = $layanan->jumlah;
                    $totalembalace+=$jumlahtotalembalacenovember;
                }
                if ($layanan->bulan == 'December' && $layanan->namaproduk == 'Embalace'){
                    $jumlahtotalembalacedecember = $layanan->jumlah;
                    $totalembalace+=$jumlahtotalembalacedecember;
                }

                if ($layanan->bulan == 'January' && $layanan->namaproduk == 'Pelayanan Steril (Injeksi)'){
                    $jumlahtotalinjeksijanuary = $layanan->jumlah;
                    $totalinjeksi+=$jumlahtotalinjeksijanuary;
                }
                if ($layanan->bulan == 'February' && $layanan->namaproduk == 'Pelayanan Steril (Injeksi)'){
                    $jumlahtotalinjeksifebruary = $layanan->jumlah;
                    $totalinjeksi+=$jumlahtotalinjeksifebruary;
                }
                if ($layanan->bulan == 'March' && $layanan->namaproduk == 'Pelayanan Steril (Injeksi)'){
                    $jumlahtotalinjeksimarch = $layanan->jumlah;
                    $totalinjeksi+=$jumlahtotalinjeksimarch;
                }
                if ($layanan->bulan == 'April' && $layanan->namaproduk == 'Pelayanan Steril (Injeksi)'){
                    $jumlahtotalinjeksiapril = $layanan->jumlah;
                    $totalinjeksi+=$jumlahtotalinjeksiapril;
                }
                if ($layanan->bulan == 'May' && $layanan->namaproduk == 'Pelayanan Steril (Injeksi)'){
                    $jumlahtotalinjeksimay = $layanan->jumlah;
                    $totalinjeksi+=$jumlahtotalinjeksimay;
                }
                if ($layanan->bulan == 'June'&& $layanan->namaproduk == 'Pelayanan Steril (Injeksi)'){
                    $jumlahtotalinjeksijune = $layanan->jumlah;
                    $totalinjeksi+=$jumlahtotalinjeksijune;
                }
                if ($layanan->bulan == 'July' && $layanan->namaproduk == 'Pelayanan Steril (Injeksi)'){
                    $jumlahtotalinjeksijuly = $layanan->jumlah;
                    $totalinjeksi+=$jumlahtotalinjeksijuly;
                }
                if ($layanan->bulan == 'August' && $layanan->namaproduk == 'Pelayanan Steril (Injeksi)'){
                    $jumlahtotalinjeksiaugust = $layanan->jumlah;
                    $totalinjeksi+=$jumlahtotalinjeksiaugust;
                }
                if ($layanan->bulan == 'September' && $layanan->namaproduk == 'Pelayanan Steril (Injeksi)'){
                    $jumlahtotalinjeksiseptember = $layanan->jumlah;
                    $totainjeksi+=$jumlahtotalinjeksiseptember;

                }
                if ($layanan->bulan == 'October' && $layanan->namaproduk == 'Pelayanan Steril (Injeksi)'){
                    $jumlahtotalinjeksioctober = $layanan->jumlah;
                    $totalinjeksi+=$jumlahtotalinjeksioctober;

                }
                if ($layanan->bulan == 'November' && $layanan->namaproduk == 'Pelayanan Steril (Injeksi)'){
                    $jumlahtotalinjeksinovember = $layanan->jumlah;
                    $totalinjeksi+=$jumlahtotalinjeksinovember;
                }
                if ($layanan->bulan == 'December' && $layanan->namaproduk == 'Pelayanan Steril (Injeksi)'){
                    $jumlahtotalinjeksidecember = $layanan->jumlah;
                    $totalinjeksi+=$jumlahtotalinjeksidecember;
                }

                if ($layanan->bulan == 'January' && $layanan->namaproduk == 'Pelayanan Steril (Infus)'){
                    $jumlahtotalinfusjanuary = $layanan->jumlah;
                    $totalinfus+=$jumlahtotalinfusjanuary;
                }
                if ($layanan->bulan == 'February' && $layanan->namaproduk == 'Pelayanan Steril (Infus)'){
                    $jumlahtotalinfusfebruary = $layanan->jumlah;
                    $totalinfus+=$jumlahtotalinfusfebruary;
                }
                if ($layanan->bulan == 'March' && $layanan->namaproduk == 'Pelayanan Steril (Infus)'){
                    $jumlahtotalinfusmarch = $layanan->jumlah;
                    $totalinfus+=$jumlahtotalinfusmarch;
                }
                if ($layanan->bulan == 'April' && $layanan->namaproduk == 'Pelayanan Steril (Infus)'){
                    $jumlahtotalinfusapril = $layanan->jumlah;
                    $totalinfus+=$jumlahtotalinfusapril;
                }
                if ($layanan->bulan == 'May' && $layanan->namaproduk == 'Pelayanan Steril (Infus)'){
                    $jumlahtotalinfusmay = $layanan->jumlah;
                    $totalinfus+=$jumlahtotalinfusmay;
                }
                if ($layanan->bulan == 'June'&& $layanan->namaproduk == 'Pelayanan Steril (Infus)'){
                    $jumlahtotalinfusjune = $layanan->jumlah;
                    $totalinfus+=$jumlahtotalinfusjune;
                }
                if ($layanan->bulan == 'July' && $layanan->namaproduk == 'Pelayanan Steril (Infus)'){
                    $jumlahtotalinfusjuly = $layanan->jumlah;
                    $totalinfus+=$jumlahtotalinfusjuly;
                }
                if ($layanan->bulan == 'August' && $layanan->namaproduk == 'Pelayanan Steril (Infus)'){
                    $jumlahtotalinfusaugust = $layanan->jumlah;
                    $totalinfus+=$jumlahtotalinfusaugust;
                }
                if ($layanan->bulan == 'September' && $layanan->namaproduk == 'Pelayanan Steril (Infus)'){
                    $jumlahtotalinfusseptember = $layanan->jumlah;
                    $totalinfus+=$jumlahtotalinfusseptember;

                }
                if ($layanan->bulan == 'October' && $layanan->namaproduk == 'Pelayanan Steril (Infus)'){
                    $jumlahtotalinfusoctober = $layanan->jumlah;
                    $totalinfus+=$jumlahtotalinfusoctober;

                }
                if ($layanan->bulan == 'November' && $layanan->namaproduk == 'Pelayanan Steril (Infus)'){
                    $jumlahtotalinfusnovember = $layanan->jumlah;
                    $totalinfus+=$jumlahtotalinfusnovember;
                }
                if ($layanan->bulan == 'December' && $layanan->namaproduk == 'Pelayanan Steril (Infus)'){
                    $jumlahtotalinfusdecember = $layanan->jumlah;
                    $totalinfus+=$jumlahtotalinfusdecember;
                }

                if ($layanan->bulan == 'January' && $layanan->namaproduk == 'Pelayanan Rekonstitusi Injeksi'){
                    $jumlahtotalrekonjanuary = $layanan->jumlah;
                    $totalrekon+=$jumlahtotalrekonjanuary;
                }
                if ($layanan->bulan == 'February' && $layanan->namaproduk == 'Pelayanan Rekonstitusi Injeksi'){
                    $jumlahtotalrekonfebruary = $layanan->jumlah;
                    $totalrekon+=$jumlahtotalrekonfebruary;
                }
                if ($layanan->bulan == 'March' && $layanan->namaproduk == 'Pelayanan Rekonstitusi Injeksi'){
                    $jumlahtotalrekonmarch = $layanan->jumlah;
                    $totalrekon+=$jumlahtotalrekonmarch;
                }
                if ($layanan->bulan == 'April' && $layanan->namaproduk == 'Pelayanan Rekonstitusi Injeksi'){
                    $jumlahtotalrekonapril = $layanan->jumlah;
                    $totalrekon+=$jumlahtotalrekonapril;
                }
                if ($layanan->bulan == 'May' && $layanan->namaproduk == 'Pelayanan Rekonstitusi Injeksi'){
                    $jumlahtotalrekonmay = $layanan->jumlah;
                    $totalrekon+=$jumlahtotalrekonmay;
                }
                if ($layanan->bulan == 'June'&& $layanan->namaproduk == 'Pelayanan Rekonstitusi Injeksi'){
                    $jumlahtotalrekonjune = $layanan->jumlah;
                    $totalrekon+=$jumlahtotalrekonjune;
                }
                if ($layanan->bulan == 'July' && $layanan->namaproduk == 'Pelayanan Rekonstitusi Injeksi'){
                    $jumlahtotalrekonjuly = $layanan->jumlah;
                    $totalrekon+=$jumlahtotalrekonjuly;
                }
                if ($layanan->bulan == 'August' && $layanan->namaproduk == 'Pelayanan Rekonstitusi Injeksi'){
                    $jumlahtotalrekonaugust = $layanan->jumlah;
                    $totalrekon+=$jumlahtotalrekonaugust;
                }
                if ($layanan->bulan == 'September' && $layanan->namaproduk == 'Pelayanan Rekonstitusi Injeksi'){
                    $jumlahtotalrekonseptember = $layanan->jumlah;
                    $totarekon+=$jumlahtotalrekonseptember;
                }
                if ($layanan->bulan == 'October' && $layanan->namaproduk == 'Pelayanan Rekonstitusi Injeksi'){
                    $jumlahtotalrekonoctober = $layanan->jumlah;
                    $totalrekon+=$jumlahtotalrekonoctober;

                }
                if ($layanan->bulan == 'November' && $layanan->namaproduk == 'Pelayanan Rekonstitusi Injeksi'){
                    $jumlahtotalrekonnovember = $layanan->jumlah;
                    $totalrekon+=$jumlahtotalrekonnovember;
                }
                if ($layanan->bulan == 'December' && $layanan->namaproduk == 'Pelayanan Rekonstitusi Injeksi'){
                    $jumlahtotalrekondecember = $layanan->jumlah;
                    $totalrekon+=$jumlahtotalrekondecember;
                }
            }
            

            $detail[]=array(
                'jumlahtotalrkejanuary' =>   $jumlahtotalrkejanuary,
                'jumlahtotalrkefebruary' =>   $jumlahtotalrkefebruary,
                'jumlahtotalresepjanuary' =>   $jumlahtotalresepjanuary,
                'jumlahtotalresepfebruary' =>   $jumlahtotalresepfebruary,
                'jumlahtotalrkemarch' =>   $jumlahtotalrkemarch,
                'jumlahtotalrkeapril' =>   $jumlahtotalrkeapril,
                'jumlahtotalrkemay' =>   $jumlahtotalrkemay,
                'jumlahtotalrkejune' =>   $jumlahtotalrkejune,
                'jumlahtotalrkejuly' =>   $jumlahtotalrkejuly,
                'jumlahtotalrkeaugust' =>   $jumlahtotalrkeaugust,
                'jumlahtotalrkeseptember' =>   $jumlahtotalrkeseptember,
                'jumlahtotalrkeoctober' =>   $jumlahtotalrkeoctober,
                'jumlahtotalrkenovember' =>   $jumlahtotalrkenovember,
                'jumlahtotalrkedecember' =>   $jumlahtotalrkedecember,
                'jumlahtotalresepmarch' =>   $jumlahtotalresepmarch,
                'jumlahtotalresepapril' =>   $jumlahtotalresepapril,
                'jumlahtotalresepmay' =>   $jumlahtotalresepmay,
                'jumlahtotalresepjune' =>   $jumlahtotalresepjune,
                'jumlahtotalresepjuly' =>   $jumlahtotalresepjuly,
                'jumlahtotalresepaugust' =>   $jumlahtotalresepaugust,
                'jumlahtotalresepseptember' =>   $jumlahtotalresepseptember,
                'jumlahtotalresepoctober' =>   $jumlahtotalresepoctober,
                'jumlahtotalresepnovember' =>   $jumlahtotalresepnovember,
                'jumlahtotalresepdecember' =>   $jumlahtotalresepdecember,
                'jumlahtotalobatjadijanuary' =>   $jumlahtotalobatjadijanuary,
                'jumlahtotalobatjadifebruary' =>   $jumlahtotalobatjadifebruary,
                'jumlahtotalobatjadimarch' =>   $jumlahtotalobatjadimarch,
                'jumlahtotalobatjadiapril' =>   $jumlahtotalobatjadiapril,
                'jumlahtotalobatjadimay' =>   $jumlahtotalobatjadimay,
                'jumlahtotalobatjadijune' =>   $jumlahtotalobatjadijune,
                'jumlahtotalobatjadijuly' =>   $jumlahtotalobatjadijuly,
                'jumlahtotalobatjadiaugust' =>   $jumlahtotalobatjadiaugust,
                'jumlahtotalobatjadiseptember' =>   $jumlahtotalobatjadiseptember,
                'jumlahtotalobatjadioctober' =>   $jumlahtotalobatjadioctober,
                'jumlahtotalobatjadinovember' =>   $jumlahtotalobatjadinovember,
                'jumlahtotalobatjadidecember' =>   $jumlahtotalobatjadidecember,
                'jumlahtotalkapsulkurangjanuary' =>   $jumlahtotalkapsulkurangjanuary,
                'jumlahtotalkapsulkurangfebruary' =>   $jumlahtotalkapsulkurangfebruary,
                'jumlahtotalkapsulkurangmarch' =>   $jumlahtotalkapsulkurangmarch,
                'jumlahtotalkapsulkurangapril' =>   $jumlahtotalkapsulkurangapril,
                'jumlahtotalkapsulkurangmay' =>   $jumlahtotalkapsulkurangmay,
                'jumlahtotalkapsulkurangjune' =>   $jumlahtotalkapsulkurangjune,
                'jumlahtotalkapsulkurangjuly' =>   $jumlahtotalkapsulkurangjuly,
                'jumlahtotalkapsulkurangaugust' =>   $jumlahtotalkapsulkurangaugust,
                'jumlahtotalkapsulkurangseptember' =>   $jumlahtotalkapsulkurangseptember,
                'jumlahtotalkapsulkurangoctober' =>   $jumlahtotalkapsulkurangoctober,
                'jumlahtotalkapsulkurangnovember' =>   $jumlahtotalkapsulkurangnovember,
                'jumlahtotalkapsulkurangdecember' =>   $jumlahtotalkapsulkurangdecember,
                'jumlahtotalkapsullebihjanuary' =>   $jumlahtotalkapsullebihjanuary,
                'jumlahtotalkapsullebihfebruary' =>   $jumlahtotalkapsullebihfebruary,
                'jumlahtotalkapsullebihmarch' =>   $jumlahtotalkapsullebihmarch,
                'jumlahtotalkapsullebihapril' =>   $jumlahtotalkapsullebihapril,
                'jumlahtotalkapsullebihmay' =>   $jumlahtotalkapsullebihmay,
                'jumlahtotalkapsullebihjune' =>   $jumlahtotalkapsullebihjune,
                'jumlahtotalkapsullebihjuly' =>   $jumlahtotalkapsullebihjuly,
                'jumlahtotalkapsullebihaugust' =>   $jumlahtotalkapsullebihaugust,
                'jumlahtotalkapsullebihseptember' =>   $jumlahtotalkapsullebihseptember,
                'jumlahtotalkapsullebihoctober' =>   $jumlahtotalkapsullebihoctober,
                'jumlahtotalkapsullebihnovember' =>   $jumlahtotalkapsullebihnovember,
                'jumlahtotalkapsullebihdecember' =>   $jumlahtotalkapsullebihdecember,
                'jumlahtotalracikkurangjanuary' =>   $jumlahtotalracikkurangjanuary,
                'jumlahtotalracikkurangfebruary' =>   $jumlahtotalracikkurangfebruary,
                'jumlahtotalracikkurangmarch' =>   $jumlahtotalracikkurangmarch,
                'jumlahtotalracikkurangapril' =>   $jumlahtotalracikkurangapril,
                'jumlahtotalracikkurangmay' =>   $jumlahtotalracikkurangmay,
                'jumlahtotalracikkurangjune' =>   $jumlahtotalracikkurangjune,
                'jumlahtotalracikkurangjuly' =>   $jumlahtotalracikkurangjuly,
                'jumlahtotalracikkurangaugust' =>   $jumlahtotalracikkurangaugust,
                'jumlahtotalracikkurangseptember' =>   $jumlahtotalracikkurangseptember,
                'jumlahtotalracikkurangoctober' =>   $jumlahtotalracikkurangoctober,
                'jumlahtotalracikkurangnovember' =>   $jumlahtotalracikkurangnovember,
                'jumlahtotalracikkurangdecember' =>   $jumlahtotalracikkurangdecember,
                'jumlahtotalraciklebihjanuary' =>   $jumlahtotalraciklebihjanuary,
                'jumlahtotalraciklebihfebruary' =>   $jumlahtotalraciklebihfebruary,
                'jumlahtotalraciklebihmarch' =>   $jumlahtotalraciklebihmarch,
                'jumlahtotalraciklebihapril' =>   $jumlahtotalraciklebihapril,
                'jumlahtotalraciklebihmay' =>   $jumlahtotalraciklebihmay,
                'jumlahtotalraciklebihjune' =>   $jumlahtotalraciklebihjune,
                'jumlahtotalraciklebihjuly' =>   $jumlahtotalraciklebihjuly,
                'jumlahtotalraciklebihaugust' =>   $jumlahtotalraciklebihaugust,
                'jumlahtotalraciklebihseptember' =>   $jumlahtotalraciklebihseptember,
                'jumlahtotalraciklebihoctober' =>   $jumlahtotalraciklebihoctober,
                'jumlahtotalraciklebihnovember' =>   $jumlahtotalraciklebihnovember,
                'jumlahtotalraciklebihdecember' =>   $jumlahtotalraciklebihdecember,
                'jumlahtotalraciksalepjanuary' =>   $jumlahtotalraciksalepjanuary,
                'jumlahtotalraciksalepfebruary' =>   $jumlahtotalraciksalepfebruary,
                'jumlahtotalraciksalepmarch' =>   $jumlahtotalraciksalepmarch,
                'jumlahtotalraciksalepapril' =>   $jumlahtotalraciksalepapril,
                'jumlahtotalraciksalepmay' =>   $jumlahtotalraciksalepmay,
                'jumlahtotalraciksalepjune' =>   $jumlahtotalraciksalepjune,
                'jumlahtotalraciksalepjuly' =>   $jumlahtotalraciksalepjuly,
                'jumlahtotalraciksalepaugust' =>   $jumlahtotalraciksalepaugust,
                'jumlahtotalraciksalepseptember' =>   $jumlahtotalraciksalepseptember,
                'jumlahtotalraciksalepoctober' =>   $jumlahtotalraciksalepoctober,
                'jumlahtotalraciksalepnovember' =>   $jumlahtotalraciksalepnovember,
                'jumlahtotalraciksalepdecember' =>   $jumlahtotalraciksalepdecember,
                'jumlahtotalraciksirupjanuary' =>   $jumlahtotalraciksirupjanuary,
                'jumlahtotalraciksirupfebruary' =>   $jumlahtotalraciksirupfebruary,
                'jumlahtotalraciksirupmarch' =>   $jumlahtotalraciksirupmarch,
                'jumlahtotalraciksirupapril' =>   $jumlahtotalraciksirupapril,
                'jumlahtotalraciksirupmay' =>   $jumlahtotalraciksirupmay,
                'jumlahtotalraciksirupjune' =>   $jumlahtotalraciksirupjune,
                'jumlahtotalraciksirupjuly' =>   $jumlahtotalraciksirupjuly,
                'jumlahtotalraciksirupaugust' =>   $jumlahtotalraciksirupaugust,
                'jumlahtotalraciksirupseptember' =>   $jumlahtotalraciksirupseptember,
                'jumlahtotalraciksirupoctober' =>   $jumlahtotalraciksirupoctober,
                'jumlahtotalraciksirupnovember' =>   $jumlahtotalraciksirupnovember,
                'jumlahtotalraciksirupdecember' =>   $jumlahtotalraciksirupdecember,
                'jumlahtotalkonselingjanuary' =>   $jumlahtotalkonselingjanuary,
                'jumlahtotalkonselingfebruary' =>   $jumlahtotalkonselingfebruary,
                'jumlahtotalkonselingmarch' =>   $jumlahtotalkonselingmarch,
                'jumlahtotalkonselingapril' =>   $jumlahtotalkonselingapril,
                'jumlahtotalkonselingmay' =>   $jumlahtotalkonselingmay,
                'jumlahtotalkonselingjune' =>   $jumlahtotalkonselingjune,
                'jumlahtotalkonselingjuly' =>   $jumlahtotalkonselingjuly,
                'jumlahtotalkonselingaugust' =>   $jumlahtotalkonselingaugust,
                'jumlahtotalkonselingseptember' =>   $jumlahtotalkonselingseptember,
                'jumlahtotalkonselingoctober' =>   $jumlahtotalkonselingoctober,
                'jumlahtotalkonselingnovember' =>   $jumlahtotalkonselingnovember,
                'jumlahtotalkonselingdecember' =>   $jumlahtotalkonselingdecember,
                'jumlahtotalpetunjukjanuary' =>   $jumlahtotalpetunjukjanuary,
                'jumlahtotalpetunjukfebruary' =>   $jumlahtotalpetunjukfebruary,
                'jumlahtotalpetunjukmarch' =>   $jumlahtotalpetunjukmarch,
                'jumlahtotalpetunjukapril' =>   $jumlahtotalpetunjukapril,
                'jumlahtotalpetunjukmay' =>   $jumlahtotalpetunjukmay,
                'jumlahtotalpetunjukjune' =>   $jumlahtotalpetunjukjune,
                'jumlahtotalpetunjukjuly' =>   $jumlahtotalpetunjukjuly,
                'jumlahtotalpetunjukaugust' =>   $jumlahtotalpetunjukaugust,
                'jumlahtotalpetunjukseptember' =>   $jumlahtotalpetunjukseptember,
                'jumlahtotalpetunjukoctober' =>   $jumlahtotalpetunjukoctober,
                'jumlahtotalpetunjuknovember' =>   $jumlahtotalpetunjuknovember,
                'jumlahtotalpetunjukdecember' =>   $jumlahtotalpetunjukdecember,
                'jumlahtotalvisitejanuary' =>   $jumlahtotalvisitejanuary,
                'jumlahtotalvisitefebruary' =>   $jumlahtotalvisitefebruary,
                'jumlahtotalvisitemarch' =>   $jumlahtotalvisitemarch,
                'jumlahtotalvisiteapril' =>   $jumlahtotalvisiteapril,
                'jumlahtotalvisitemay' =>   $jumlahtotalvisitemay,
                'jumlahtotalvisitejune' =>   $jumlahtotalvisitejune,
                'jumlahtotalvisitejuly' =>   $jumlahtotalvisitejuly,
                'jumlahtotalvisiteaugust' =>   $jumlahtotalvisiteaugust,
                'jumlahtotalvisiteseptember' =>   $jumlahtotalvisiteseptember,
                'jumlahtotalvisiteoctober' =>   $jumlahtotalvisiteoctober,
                'jumlahtotalvisitenovember' =>   $jumlahtotalvisitenovember,
                'jumlahtotalvisitedecember' =>   $jumlahtotalvisitedecember,
                'jumlahtotalpemantauanjanuary' =>   $jumlahtotalpemantauanjanuary,
                'jumlahtotalpemantauanfebruary' =>   $jumlahtotalpemantauanfebruary,
                'jumlahtotalpemantauanmarch' =>   $jumlahtotalpemantauanmarch,
                'jumlahtotalpemantauanapril' =>   $jumlahtotalpemantauanapril,
                'jumlahtotalpemantauanmay' =>   $jumlahtotalpemantauanmay,
                'jumlahtotalpemantauanjune' =>   $jumlahtotalpemantauanjune,
                'jumlahtotalpemantauanjuly' =>   $jumlahtotalpemantauanjuly,
                'jumlahtotalpemantauanaugust' =>   $jumlahtotalpemantauanaugust,
                'jumlahtotalpemantauanseptember' =>   $jumlahtotalpemantauanseptember,
                'jumlahtotalpemantauanoctober' =>   $jumlahtotalpemantauanoctober,
                'jumlahtotalpemantauannovember' =>   $jumlahtotalpemantauannovember,
                'jumlahtotalpemantauandecember' =>   $jumlahtotalpemantauandecember,
                'jumlahtotalembalacejanuary' =>   $jumlahtotalembalacejanuary,
                'jumlahtotalembalacefebruary' =>   $jumlahtotalembalacefebruary,
                'jumlahtotalembalacemarch' =>   $jumlahtotalembalacemarch,
                'jumlahtotalembalaceapril' =>   $jumlahtotalembalaceapril,
                'jumlahtotalembalacemay' =>   $jumlahtotalembalacemay,
                'jumlahtotalembalacejune' =>   $jumlahtotalembalacejune,
                'jumlahtotalembalacejuly' =>   $jumlahtotalembalacejuly,
                'jumlahtotalembalaceaugust' =>   $jumlahtotalembalaceaugust,
                'jumlahtotalembalaceseptember' =>   $jumlahtotalembalaceseptember,
                'jumlahtotalembalaceoctober' =>   $jumlahtotalembalaceoctober,
                'jumlahtotalembalacenovember' =>   $jumlahtotalembalacenovember,
                'jumlahtotalembalacedecember' =>   $jumlahtotalembalacedecember,
                'jumlahtotalinjeksijanuary' =>   $jumlahtotalinjeksijanuary,
                'jumlahtotalinjeksifebruary' =>   $jumlahtotalinjeksifebruary,
                'jumlahtotalinjeksimarch' =>   $jumlahtotalinjeksimarch,
                'jumlahtotalinjeksiapril' =>   $jumlahtotalinjeksiapril,
                'jumlahtotalinjeksimay' =>   $jumlahtotalinjeksimay,
                'jumlahtotalinjeksijune' =>   $jumlahtotalinjeksijune,
                'jumlahtotalinjeksijuly' =>   $jumlahtotalinjeksijuly,
                'jumlahtotalinjeksiaugust' =>   $jumlahtotalinjeksiaugust,
                'jumlahtotalinjeksiseptember' =>   $jumlahtotalinjeksiseptember,
                'jumlahtotalinjeksioctober' =>   $jumlahtotalinjeksioctober,
                'jumlahtotalinjeksinovember' =>   $jumlahtotalinjeksinovember,
                'jumlahtotalinjeksidecember' =>   $jumlahtotalinjeksidecember,
                'jumlahtotalinfusjanuary' =>   $jumlahtotalinfusjanuary,
                'jumlahtotalinfusfebruary' =>   $jumlahtotalinfusfebruary,
                'jumlahtotalinfusmarch' =>   $jumlahtotalinfusmarch,
                'jumlahtotalinfusapril' =>   $jumlahtotalinfusapril,
                'jumlahtotalinfusmay' =>   $jumlahtotalinfusmay,
                'jumlahtotalinfusjune' =>   $jumlahtotalinfusjune,
                'jumlahtotalinfusjuly' =>   $jumlahtotalinfusjuly,
                'jumlahtotalinfusaugust' =>   $jumlahtotalinfusaugust,
                'jumlahtotalinfusseptember' =>   $jumlahtotalinfusseptember,
                'jumlahtotalinfusoctober' =>   $jumlahtotalinfusoctober,
                'jumlahtotalinfusnovember' =>   $jumlahtotalinfusnovember,
                'jumlahtotalinfusdecember' =>   $jumlahtotalinfusdecember,
                'jumlahtotalrekonjanuary' =>   $jumlahtotalrekonjanuary,
                'jumlahtotalrekonfebruary' =>   $jumlahtotalrekonfebruary,
                'jumlahtotalrekonmarch' =>   $jumlahtotalrekonmarch,
                'jumlahtotalrekonapril' =>   $jumlahtotalrekonapril,
                'jumlahtotalrekonmay' =>   $jumlahtotalrekonmay,
                'jumlahtotalrekonjune' =>   $jumlahtotalrekonjune,
                'jumlahtotalrekonjuly' =>   $jumlahtotalrekonjuly,
                'jumlahtotalrekonaugust' =>   $jumlahtotalrekonaugust,
                'jumlahtotalrekonseptember' =>   $jumlahtotalrekonseptember,
                'jumlahtotalrekonoctober' =>   $jumlahtotalrekonoctober,
                'jumlahtotalrekonnovember' =>   $jumlahtotalrekonnovember,
                'jumlahtotalrekondecember' =>   $jumlahtotalrekondecember,
                'totalkapsullebih' =>   $totalkapsullebih,
                'totalkapsulkurang' =>   $totalkapsulkurang,
                'totalracikkurang' =>   $totalracikkurang,
                'totalraciklebih' =>   $totalraciklebih,
                'totalraciksalep' =>   $totalraciksalep,
                'totalraciksirup' =>   $totalraciksirup,
                'totalkonseling' =>   $totalkonseling,
                'totalpetunjuk' =>   $totalpetunjuk,
                'totalobatjadi' =>   $totalobatjadi,
                'totalvisite' =>   $totalvisite,
                'totalpemantauan' =>   $totalpemantauan,
                'totalembalace' =>   $totalembalace,
                'totalinjeksi' =>   $totalinjeksi,
                'totalinfus' =>   $totalinfus,
                'totalrekon' =>   $totalrekon,
                'totalrke' =>   $totalrke,
                'totalresep' =>   $totalresep,
            );
        }

        $result = array(
            'detail' => $detail,
        );
        
        return $this->setStatusCode(201)->respond($result, 'tes msg');
    }

    public function getLaporanObatAntibiotik(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tglAwal= $request['tglAwal'];
        $tglAkhir= $request['tglAkhir'];
        $namaItem = '';

        if (isset($request['namaItem']) && $request['namaItem'] != "" && $request['namaItem'] != "undefined") {
            $request['namaItem'] =  str_replace("'", "",   $request['namaItem']);
            $namaItem = "  AND replace(pr.namaproduk,'''','') ILIKE '%".$request['namaItem']."%'";
        }

        $produkmain = DB::select(DB::raw("select pr.namaproduk as namaproduk
        FROM strukresep_t as sr
        INNER JOIN pelayananpasien_t AS pp ON pp.strukresepfk = sr.norec
        INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.norec=sr.pasienfk
        INNER JOIN pasiendaftar_t AS pd ON pd.norec=apd.noregistrasifk
        INNER JOIN pasien_m AS ps ON ps.id=pd.nocmfk
		inner  join produk_m pr on pr.id=pp.produkfk
		inner join detailjenisproduk_m djp on djp.id = pr.objectdetailjenisprodukfk
		LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
		LEFT JOIN departemen_m AS dp ON dp.id = ru.objectdepartemenfk
		where djp.id = 1444 
		or pr.isantibiotik = true
		and sr.tglresep between '$tglAwal' and '$tglAkhir'
        and pp.kdprofile = $kdProfile
        $namaItem
		group by pr.namaproduk;"));

        $dataranap =  DB::select(DB::raw("select pr.namaproduk as namaproduk, sum(pp.jumlah) as jumlahproduk, count(ps.namapasien) as jumlahpasien
        FROM strukresep_t as sr
        INNER JOIN pelayananpasien_t AS pp ON pp.strukresepfk = sr.norec
        INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.norec=sr.pasienfk
        INNER JOIN pasiendaftar_t AS pd ON pd.norec=apd.noregistrasifk
        INNER JOIN pasien_m AS ps ON ps.id=pd.nocmfk
		inner  join produk_m pr on pr.id=pp.produkfk
		inner join detailjenisproduk_m djp on djp.id = pr.objectdetailjenisprodukfk
		LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
		LEFT JOIN departemen_m AS dp ON dp.id = ru.objectdepartemenfk
		where ru.objectdepartemenfk = 16
		and djp.id = 1444 
		or pr.isantibiotik = true
		and sr.tglresep between '$tglAwal' and '$tglAkhir'
        and pp.kdprofile = $kdProfile
        $namaItem
		group by pr.namaproduk;"));

        $datarajal = DB::select(DB::raw("select pr.namaproduk as namaproduk, sum(pp.jumlah) as jumlahproduk, count(ps.namapasien) as jumlahpasien
        FROM strukresep_t as sr
        INNER JOIN pelayananpasien_t AS pp ON pp.strukresepfk = sr.norec
        INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.norec=sr.pasienfk
        INNER JOIN pasiendaftar_t AS pd ON pd.norec=apd.noregistrasifk
        INNER JOIN pasien_m AS ps ON ps.id=pd.nocmfk
		inner  join produk_m pr on pr.id=pp.produkfk
		inner join detailjenisproduk_m djp on djp.id = pr.objectdetailjenisprodukfk
		LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
		LEFT JOIN departemen_m AS dp ON dp.id = ru.objectdepartemenfk
		where ru.objectdepartemenfk <> 16
		and djp.id = 1444 
		or pr.isantibiotik = true
		and sr.tglresep between '$tglAwal' and '$tglAkhir'
		and pp.kdprofile = $kdProfile
        $namaItem
		group by pr.namaproduk;"));

        $jumlahobatranap = 0;
        $jumlahpasienranap = 0;
        $jumlahobatrajal = 0;
        $jumlahpasienrajal = 0;
        $detail = [];

        foreach($produkmain as $produk){
            $jumlahobatranap = 0;
            $jumlahpasienranap = 0;
            $jumlahobatrajal = 0;
            $jumlahpasienrajal = 0;
            $namaobat = $produk->namaproduk;
            foreach($datarajal as $rajal){
                if($produk->namaproduk == $rajal->namaproduk){
                    $jumlahobatrajal = $rajal->jumlahproduk;
                    $jumlahpasienrajal= $rajal->jumlahpasien;
                }
            }
            foreach($dataranap as $ranap){
                if($produk->namaproduk == $ranap->namaproduk){
                    $jumlahobatranap = $ranap->jumlahproduk;
                    $jumlahpasienranap= $ranap->jumlahpasien;
                }
            }

            $detail[] =array(
                'namaobat' => $namaobat,
                'jumlahobatrajal' => $jumlahobatrajal,
                'jumlahpasienrajal' => $jumlahpasienrajal,
                'jumlahobatranap' => $jumlahobatranap,
                'jumlahpasienranap' => $jumlahpasienranap,
            );
        }

        $result = array(
            'detail' => $detail,
        );
        
        return $this->setStatusCode(201)->respond($result, 'tes msg');
    }

    public function getLaporanJasaPelayanan(Request $request) {
        ini_set('max_execution_time', 6000);
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tglAwal= $request['tglAwal'];
        $tglAkhir= $request['tglAkhir'];
        $dokid= '';

        if(isset($request['dokid']) && $request['dokid']!="" && $request['dokid']!="undefined"){
            $dokid = ' and pg.id='.$request['dokid'];
        }

        $ruid='';
        if(isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
            $ruid = ' AND ru.id = ' . $request['idRuangan'];
        }
        $deptid='';
        if(isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
            $deptid = ' AND ru.objectdepartemenfk = ' . $request['idDept'];
        }
        $paramProduk = '';
        if(isset($request['ProdukArr']) && $request['ProdukArr'] != "" && $request['ProdukArr'] != "undefined") {
            $paramProduk = ' AND pr.id = ' . $request['ProdukArr'];
        }
    
        $datasarana = DB::select(DB::raw("with lt as (
            select distinct  lt.noreff,lt.jenislog,lt.objectloginuserfk
            from logginguser_t lt
            where lt.jenislog = 'Input Tindakan'
            ), cte as (
            select lt.noreff,lt.jenislog,pg.id idpegawai, pg.namalengkap namapegawaiinput 
            from lt
            inner join loginuser_s lu on lu.id=lt.objectloginuserfk
            left join pegawai_m pg on pg.id=lu.objectpegawaifk
            where lt.jenislog = 'Input Tindakan'
            )
            select 
                    pp.tglpelayanan::date, pr.namaproduk, cte.jenislog, cte.namapegawaiinput, ru.namaruangan as ruangan, pg.namalengkap as nama, kh.komponenharga, ppd.hargajual, sum(pp.jumlah) as totaljumlah,
                    (((CASE WHEN ppd.hargajual IS NULL THEN	0 ELSE ppd.hargajual END - CASE WHEN ppd.hargadiscount IS NULL THEN
                    0 ELSE ppd.hargadiscount END) * sum(pp.jumlah)) + CASE WHEN ppd.jasa IS NULL THEN	0 ELSE	ppd.jasa	END	) AS total
                        
                    from
                        pasien_m ps 
                    inner join pasiendaftar_t pd on ps.id=pd.nocmfk
                    inner join antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                    inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
                    left join pegawai_m pg on pg.id = pd.objectpegawaifk
                    inner join pelayananpasiendetail_t ppd on ppd.pelayananpasien = pp.norec
                    inner join komponenharga_m kh on kh.id = ppd.komponenhargafk 
                    left  join produk_m pr on pr.id=pp.produkfk
                    inner join ruangan_m ru on ru.id = apd.objectruanganfk
                    inner join departemen_m dp on dp.id = ru.objectdepartemenfk
                    left join  cte on cte.noreff = pp.norec
                    where pp.isobat is null
                    and ppd.komponenhargafk = 93
                    and pp.tglpelayanan between '$tglAwal' and '$tglAkhir'
                    and pp.kdprofile = $kdProfile
                    $dokid
                    $ruid
                    $deptid
                    $paramProduk
                    --group by pr.namaproduk, ppd.hargajual, pp.tglpelayanan::date, kh.komponenharga, ppd.hargadiscount, ppd.jasa, ru.namaruangan, pg.namalengkap, cte.jenislog, cte.namapegawaiinput
                    group by pp.tglpelayanan::date, pr.namaproduk, cte.jenislog, cte.namapegawaiinput, ru.namaruangan, pg.namalengkap , kh.komponenharga, ppd.hargajual,ppd.hargadiscount,ppd.jasa
                    "));

        $datapelayanan = DB::select(DB::raw("with lt as (
            select distinct lt.noreff,lt.jenislog,lt.objectloginuserfk
            from logginguser_t lt
            where lt.jenislog = 'Input Tindakan'
            ), cte as (
            select lt.noreff,lt.jenislog,pg.id idpegawai, pg.namalengkap namapegawaiinput 
            from lt
            inner join loginuser_s lu on lu.id=lt.objectloginuserfk
            left join pegawai_m pg on pg.id=lu.objectpegawaifk
            where lt.jenislog = 'Input Tindakan'
            )
            select 
                    pp.tglpelayanan::date, pr.namaproduk, cte.namapegawaiinput, cte.jenislog, ru.namaruangan as ruangan, pg.namalengkap as nama, kh.komponenharga, ppd.hargajual, sum(pp.jumlah) as totaljumlah,
                    (((CASE WHEN ppd.hargajual IS NULL THEN	0 ELSE ppd.hargajual END - CASE WHEN ppd.hargadiscount IS NULL THEN
                    0 ELSE ppd.hargadiscount END) * sum(pp.jumlah)) + CASE WHEN ppd.jasa IS NULL THEN	0 ELSE	ppd.jasa	END	) AS total
                        
                    from
                        pasien_m ps 
                    inner join pasiendaftar_t pd on ps.id=pd.nocmfk
                    inner join antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                    inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
                    left join pegawai_m pg on pg.id = pd.objectpegawaifk
                    inner join pelayananpasiendetail_t ppd on ppd.pelayananpasien = pp.norec
                    inner join komponenharga_m kh on kh.id = ppd.komponenhargafk 
                    left  join produk_m pr on pr.id=pp.produkfk
                    inner join ruangan_m ru on ru.id = apd.objectruanganfk
                    inner join departemen_m dp on dp.id = ru.objectdepartemenfk
                    left join  cte on cte.noreff = pp.norec
                    where pp.isobat is null
                    and ppd.komponenhargafk = 94
                    and pp.tglpelayanan between '$tglAwal' and '$tglAkhir'
                    and pp.kdprofile = $kdProfile
                    $dokid
                    $ruid
                    $deptid
                    $paramProduk
                    --group by pr.namaproduk, ppd.hargajual, pp.tglpelayanan::date, kh.komponenharga, ppd.hargadiscount, ppd.jasa, ru.namaruangan, pg.namalengkap, cte.namapegawaiinput, cte.jenislog
                    group by pp.tglpelayanan::date, pr.namaproduk, cte.jenislog, cte.namapegawaiinput, ru.namaruangan, pg.namalengkap , kh.komponenharga, ppd.hargajual,ppd.hargadiscount,ppd.jasa
                    
                    
                    "));

        $jumlahhargapelayanan = 0;
        $hargapelayanan = 0;
        $jumlahpertanggal = 0;
        $jumlahpertanggal = 0;
        $detail = [];

        $currentTgl = date("Y-m-d", strtotime('2001-01-01'));
            
        foreach($datasarana as $sarana){
            $tglpelayanan = $sarana->tglpelayanan;
            $namaproduk = $sarana->namaproduk;
            $jumlah = $sarana->totaljumlah;
            $jumlahhargasarana = $sarana->total;
            $hargasarana = $sarana->hargajual;
            $instalasi = $sarana->ruangan;
            $namalengkap = $sarana->nama;
            $pegawaiinput = $sarana->namapegawaiinput;
            $jenislog = $sarana->jenislog;
            $jumlahhargapelayanan = 0;
            $hargapelayanan = 0;

            foreach($datapelayanan as $pelayanan){
                if($sarana->tglpelayanan == $pelayanan->tglpelayanan && $sarana->namaproduk == $pelayanan->namaproduk && $sarana->totaljumlah == $pelayanan->totaljumlah && $sarana->ruangan == $pelayanan->ruangan){
                    $jumlahhargapelayanan = $pelayanan->total;
                    $hargapelayanan = $pelayanan->hargajual;
                }
            }

            $detail[] =array(
                'tglpelayanan' => $tglpelayanan,
                'namaproduk' => $namaproduk,
                'jumlah' => $jumlah,
                'jumlahhargasarana' => $jumlahhargasarana,
                'jumlahhargapelayanan' => $jumlahhargapelayanan,
                'hargasarana' => $hargasarana,
                'hargapelayanan' => $hargapelayanan,
                'instalasi' => $instalasi,
                'pegawaiinput' => $pegawaiinput,
                'jenislog' => $jenislog,
                'namalengkap' => $namalengkap,
            );
        }
        
        $result = array(
            'detail' => $detail,
        );
        
        return $this->setStatusCode(201)->respond($result, 'tes msg');
    }

    public function getPenjagaanClosingKasir(Request $request)
    {
        
        $noregistrasi = $request['noregistrasi'];

        $dataz = DB::select(DB::raw("select tglclosing 
        from pasiendaftar_t 
        where noregistrasi = '$noregistrasi'"));

        
        $data['detail']  =$dataz;
        return $this->respond($data);
    }

    public function getPenjagaanVerifKasir(Request $request)
    {
        
        $noregistrasi = $request['noregistrasi'];

        $dataz = DB::select(DB::raw("select sp.nostruk
        FROM   pasien_m ps 
                                inner join pasiendaftar_t pd on ps.id=pd.nocmfk
                                inner join antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                                inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
                                inner JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk  
                                left JOIN strukpelayanan_t AS sp ON sp.norec = pp.strukfk  
        where pd.noregistrasi = '$noregistrasi'
        order by sp.nostruk limit 1"));

        
        $data['detail']  =$dataz;
        return $this->respond($data);
    }

    public function getPenjagaanVerifPiutang(Request $request)
    {
        
        $noregistrasi = $request['noregistrasi'];

        $dataz = DB::select(DB::raw("select sp.totalharusdibayar
        FROM   pasien_m ps 
                                inner join pasiendaftar_t pd on ps.id=pd.nocmfk
                                inner join antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                                inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
                                inner JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk  
                                left JOIN strukpelayanan_t AS sp ON sp.norec = pp.strukfk  
        where pd.noregistrasi = '$noregistrasi'
        order by sp.totalharusdibayar limit 1"));

        
        $data['detail']  =$dataz;
        return $this->respond($data);
    }

    public function getLaporanFaktorPelayanan(Request $request)
    {
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $kdProfile = $this->getDataKdProfile($request);

        $paramProduk = '';
        if(isset($request['ProdukArr']) && $request['ProdukArr'] != "" && $request['ProdukArr'] != "undefined") {
            $paramProduk = ' AND pr.id = ' . $request['ProdukArr'];
        }

        $dataz = DB::select(DB::raw("select
        pp.tglpelayanan, pr.namaproduk, pp.jumlah,ppd.hargajual-COALESCE(ppd.hargadiscount,0)+COALESCE(ppd.jasa,0) hargabeli,(ppd.hargajual-COALESCE(ppd.hargadiscount,0)+COALESCE(ppd.jasa,0))*0.25 faktorpelayanan,
        ((ppd.hargajual-COALESCE(ppd.hargadiscount,0)+COALESCE(ppd.jasa,0))*0.25)*pp.jumlah
        totalfaktorpelayanan
        from
        pasien_m ps
        inner join pasiendaftar_t pd on ps.id=pd.nocmfk
        inner join antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
        inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
        left join pegawai_m pg on pg.id = pd.objectpegawaifk
        inner join pelayananpasiendetail_t ppd on ppd.pelayananpasien = pp.norec
        inner join komponenharga_m kh on kh.id = ppd.komponenhargafk
        left join produk_m pr on pr.id=pp.produkfk
        inner join ruangan_m ru on ru.id = apd.objectruanganfk
        inner join departemen_m dp on dp.id = ru.objectdepartemenfk
        where pp.isobat is true
        and ppd.komponenhargafk = 9
        and pp.tglpelayanan between '$tglAwal' and '$tglAkhir'
        $paramProduk
        and pp.kdprofile = $kdProfile"));
        
        $data['detail']  =$dataz;
        return $this->respond($data);
    }

    public function getLaporanJasaPelayananIT(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);

        $dataz = DB::select(DB::raw("select 
        pr.namaproduk, 
        case 
            when pr.namaproduk = 'Biaya Pendaftaran Pasien Rawat Jalan Baru' then 2000
            when pr.namaproduk = 'Biaya Pendaftaran Pasien Rawat Jalan Lama' then 1200
            when pr.namaproduk = 'Biaya Pendaftaran Pasien IGD Baru' then 2000
            when pr.namaproduk = 'Biaya Pendaftaran Pasien IGD Lama' then 1200
            when pr.namaproduk = 'Biaya Pendaftaran Pasien Rawat Inap' then 8000
            when pr.namaproduk ilike 'konsultasi online%' then 10000
        end as harga, count(pd.noregistrasi) as jumlahpasien,
        case 
            when pr.namaproduk = 'Biaya Pendaftaran Pasien Rawat Jalan Baru' then 2000*count(pd.noregistrasi)
            when pr.namaproduk = 'Biaya Pendaftaran Pasien Rawat Jalan Lama' then 1200*count(pd.noregistrasi)
            when pr.namaproduk = 'Biaya Pendaftaran Pasien IGD Baru' then 2000*count(pd.noregistrasi)
            when pr.namaproduk = 'Biaya Pendaftaran Pasien IGD Lama' then 1200*count(pd.noregistrasi)
            when pr.namaproduk = 'Biaya Pendaftaran Pasien Rawat Inap' then 8000*count(pd.noregistrasi)
            when pr.namaproduk ilike 'konsultasi online%' then 10000*count(pd.noregistrasi)
        end as total
        from
            pasien_m ps 
        inner join pasiendaftar_t pd on ps.id=pd.nocmfk
        inner join antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
        inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
        left  join produk_m pr on pr.id=pp.produkfk
        where pd.kdprofile = $kdProfile
        and pd.statusenabled = true
        and pr.id in (5008637, 5008635, 5008644, 5008636, 5008645, 5007133, 5007131, 5007129, 5007130, 5007132, 5007127)
        group by pr.namaproduk"));
        
        $data['detail']  =$dataz;
        return $this->respond($data);
    }

    public function getLaporanJasaPelayananDokter(Request $request)
    {
        ini_set('max_execution_time', 10000);
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $kdProfile = $this->getDataKdProfile($request);

        $paramProduk = '';
        if(isset($request['ProdukArr']) && $request['ProdukArr'] != "" && $request['ProdukArr'] != "undefined") {
            $paramProduk = ' AND pr.id = ' . $request['ProdukArr'];
        }

        $dataz = DB::select(DB::raw("select a.*, b.komponenharga as komponenhargapelayanan, b.hargajual as hargajualpelayanan, b.totaljumlah as totaljumlahpelayanan, b.total as totalpelayanan, (a.total + b.total) as totalsaranadanpelayanan  from(
            with lt as (
                        select distinct  lt.noreff,lt.jenislog,lt.objectloginuserfk
                        from logginguser_t lt
                        where lt.jenislog = 'Input Tindakan'
                        ), cte as (
                        select lt.noreff,lt.jenislog,pg.id idpegawai, pg.namalengkap namapegawaiinput, pg.objectjenispegawaifk as dokter 
                        from lt
                        inner join loginuser_s lu on lu.id=lt.objectloginuserfk
                        left join pegawai_m pg on pg.id=lu.objectpegawaifk
                        where lt.jenislog = 'Input Tindakan'
                        )
                        select 
                                pp.tglpelayanan, pr.namaproduk, cte.jenislog, cte.namapegawaiinput, jp.jenispegawai, ru.namaruangan as ruangan, pg.namalengkap as nama, kh.komponenharga, ppd.hargajual, sum(pp.jumlah) as totaljumlah,
                                (((CASE WHEN ppd.hargajual IS NULL THEN	0 ELSE ppd.hargajual END - CASE WHEN ppd.hargadiscount IS NULL THEN
                                0 ELSE ppd.hargadiscount END) * sum(pp.jumlah)) + CASE WHEN ppd.jasa IS NULL THEN	0 ELSE	ppd.jasa	END	) AS total, row_number() over(order by pp.tglpelayanan) as urutansarana
                                    
                                from
                                    pasien_m ps 
                                inner join pasiendaftar_t pd on ps.id=pd.nocmfk
                                inner join antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                                inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
                                left join pegawai_m pg on pg.id = pd.objectpegawaifk
                                inner join pelayananpasiendetail_t ppd on ppd.pelayananpasien = pp.norec
                                inner join komponenharga_m kh on kh.id = ppd.komponenhargafk 
                                left  join produk_m pr on pr.id=pp.produkfk
                                inner join ruangan_m ru on ru.id = apd.objectruanganfk
                                inner join departemen_m dp on dp.id = ru.objectdepartemenfk
                                                    left join  cte on cte.noreff = pp.norec
                                                    inner join jenispegawai_m jp on jp.id = cte.dokter
                                where pp.isobat is null
                                and ppd.komponenhargafk = 93
                                and pp.tglpelayanan between '$tglAwal' and '$tglAkhir'
                                and pp.kdprofile = $kdProfile
                                and jp.jenispegawai = 'DOKTER'
                                $paramProduk
                                group by pp.tglpelayanan, pr.namaproduk, cte.jenislog, cte.namapegawaiinput, ru.namaruangan, pg.namalengkap , kh.komponenharga, ppd.hargajual,ppd.hargadiscount,ppd.jasa, jp.jenispegawai
            ) a
            inner join 
            (
                with lt as (
                        select distinct  lt.noreff,lt.jenislog,lt.objectloginuserfk
                        from logginguser_t lt
                        where lt.jenislog = 'Input Tindakan'
                        ), cte as (
                        select lt.noreff,lt.jenislog,pg.id idpegawai, pg.namalengkap namapegawaiinput, pg.objectjenispegawaifk as dokter 
                        from lt
                        inner join loginuser_s lu on lu.id=lt.objectloginuserfk
                        left join pegawai_m pg on pg.id=lu.objectpegawaifk
                        where lt.jenislog = 'Input Tindakan'
                        )
                        select 
                                pp.tglpelayanan, pr.namaproduk, cte.jenislog, cte.namapegawaiinput, jp.jenispegawai, ru.namaruangan as ruangan, pg.namalengkap as nama, kh.komponenharga, ppd.hargajual, sum(pp.jumlah) as totaljumlah,
                                (((CASE WHEN ppd.hargajual IS NULL THEN	0 ELSE ppd.hargajual END - CASE WHEN ppd.hargadiscount IS NULL THEN
                                0 ELSE ppd.hargadiscount END) * sum(pp.jumlah)) + CASE WHEN ppd.jasa IS NULL THEN	0 ELSE	ppd.jasa	END	) AS total, row_number() over(order by pp.tglpelayanan) as urutanpelayanan
                                    
                                from
                                    pasien_m ps 
                                inner join pasiendaftar_t pd on ps.id=pd.nocmfk
                                inner join antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                                inner join pelayananpasien_t pp on apd.norec=pp.noregistrasifk
                                left join pegawai_m pg on pg.id = pd.objectpegawaifk
                                inner join pelayananpasiendetail_t ppd on ppd.pelayananpasien = pp.norec
                                inner join komponenharga_m kh on kh.id = ppd.komponenhargafk 
                                left  join produk_m pr on pr.id=pp.produkfk
                                inner join ruangan_m ru on ru.id = apd.objectruanganfk
                                inner join departemen_m dp on dp.id = ru.objectdepartemenfk
                                                    left join  cte on cte.noreff = pp.norec
                                                    inner join jenispegawai_m jp on jp.id = cte.dokter
                                where pp.isobat is null
                                and ppd.komponenhargafk = 94
                                and pp.tglpelayanan between '$tglAwal' and '$tglAkhir'
                                and pp.kdprofile = $kdProfile
                                and jp.jenispegawai = 'DOKTER'
                                $paramProduk
                                group by pp.tglpelayanan, pr.namaproduk, cte.jenislog, cte.namapegawaiinput, ru.namaruangan, pg.namalengkap , kh.komponenharga, ppd.hargajual,ppd.hargadiscount,ppd.jasa, jp.jenispegawai
            ) b
            on a.urutansarana = b.urutanpelayanan;"));
        
        $data['detail']  =$dataz;
        return $this->respond($data);
    }
    
    public function getInformasiTransfer(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $data = \DB::select(DB::Raw("SELECT
            kb.tglpelayanan,
            ru.namaruangan,
            pr.namaproduk,
            kb.qtyorder,
            kb.qtyproduk
        FROM
            kirimproduk_t kb
            INNER JOIN ruangan_m ru ON ru.ID = kb.objectruanganfk 
            inner join produk_m pr on pr.id = kb.objectprodukfk
            where kb.objectruanganpengirimfk = $request[ruangan] and kb.objectprodukfk = $request[produk] and kb.kdprofile = $kdProfile and kb.statusenabled = true
        "));
        $result = array(
            'data'=> $data,
            'as'=> 'fizi'
        );
        return $this->respond($result);
    }
}
