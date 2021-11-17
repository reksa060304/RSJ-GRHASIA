<?php

namespace App\Http\Controllers\Bridging;
use App\Http\Controllers\ApiController;
use App\Master\Agama;
use App\Master\Pegawai;
use App\Traits\CrudMaster;
use App\Traits\Valet;
use App\Transaksi\LoggingUser;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Web\LoginUser;
use App\Web\Token;
// use App\Web\Admin\ProfileHistoriAwards as ProfileHistoriAwards;
// use App\Web\Admin\Awards as Awards_M;
// use App\Web\Asal as Asal_M;
// use App\Transaksi\StrukHistori as StrukHistori_T;
use DB;
use Illuminate\Support\Facades\Hash;
use Namshi\JOSE\Base64\Base64UrlSafeEncoder;
use Namshi\JOSE\JWT;
use Namshi\JOSE\JWS;
use Namshi\JOSE\Base64\Encoder;
use Webpatser\Uuid\Uuid;

use Lcobucci\JWT\Signer\Hmac\Sha512;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Signer\Hmac\Sha384;
use Lcobucci\JWT\Builder;
use Lcobucci\JWT\ValidationData;
use Lcobucci\JWT\Parser;


class DokterKeluargaController extends ApiController
{
    use Valet;

    public function __construct() {
        parent::__construct($skip_authentication=false);
    }
    public function getDetailPasien(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $data = \DB::table('pasien_m as ps')
            ->leftjoin('jeniskelamin_m as jk','jk.id','=','ps.objectjeniskelaminfk')
            ->leftjoin('agama_m as ag','ag.id','=','ps.objectagamafk')
            ->leftjoin('golongandarah_m as gd','gd.id','=','ps.objectgolongandarahfk')
            ->leftjoin('pekerjaan_m as pk','pk.id','=','ps.objectpekerjaanfk')
            ->leftjoin('pendidikan_m as pdd','pdd.id','=','ps.objectpendidikanfk')
            ->leftjoin('statusperkawinan_m as spkw','spkw.id','=','ps.objectstatusperkawinanfk')
            ->leftjoin('alamat_m as al','al.nocmfk','=','ps.id')
            ->leftjoin('suku_m as sk','sk.id','=','ps.objectsukufk')
            ->select(DB::raw("ps.id,ps.nocm,
    ps.noidentitas as nik,	ps.namapasien,	ps.tgllahir,	ps.nohp AS telepon,	sk.suku as etnis,
	ps.bahasa,	jk.jeniskelamin,	ag.agama,	gd.golongandarah,	al.alamatlengkap,	al.alamatemail as email,
	ps.namaayah as wali,	'Orang Tua' as hubunganwali,	null as alamatwali,
	null as teleponwali,	null as faksesbpjs,	null as alamatfaskes,	null as teleponfaskes,	pk.pekerjaan,
	pdd.pendidikan,	spkw.statusperkawinan,ps.nobpjs"))
            ->where('ps.statusenabled',true)
            ->where('ps.kdprofile',$kdProfile);
        $stt = false;
        if(isset($request['nik']) && $request['nik']!="" && $request['nik']!="undefined"){
            $data = $data->where('ps.noidentitas','=', $request['nik']);
            $stt = true;
        }
        if(isset($request['nobpjs']) && $request['nobpjs']!="" && $request['nobpjs']!="undefined"){
            $data = $data->where('ps.nobpjs','=', $request['nobpjs']);
            $stt = true;
        }
        if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('ps.nocm','ilike', '%'.$request['nocm'].'%');
             $stt = true;
        }
        if(isset($request['namapasien']) && $request['namapasien']!="" && $request['namapasien']!="undefined"){
            $data = $data->where('ps.namapasien','ilike', '%'.$request['namapasien'].'%');
            $stt = true;
        }
        if(isset($request['nokk']) && $request['nokk']!="" && $request['nokk']!="undefined"){
//            $data = $data->where('ps.nokk','=', $request['nokk']);
        }
        // $data = $data->take(50);
        $data = $data->first();
        if(!empty($data ) && $stt==true){
            $result = array(
                "response" =>  $data,
                "metadata" => array(
                    "code" => "200",
                    "message" => "Ok"
                )
            );
        }else{
            $result = array(
                "response" =>  null,
                "metadata" => array(
                    "code" => "400",
                    "message" => "Data tidak ditemukan"
                )
            );
        }


        return $this->setStatusCode($result['metadata']['code'])->respond($result);
        // return $this->respond($data);
    }
    public function getPerawatan(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $data = \DB::table('pasien_m as ps')
            ->join('pasiendaftar_t as pd', 'pd.nocmfk', '=', 'ps.id')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('batalregistrasi_t as br', 'br.pasiendaftarfk', '=', 'pd.norec')
            ->select(DB::raw("ps.noidentitas as nik,pd.tglregistrasi,ps.id as idpasien,ps.nocm,pd.noregistrasi,
                            ps.namapasien,ru.namaruangan,
			               pg.namalengkap as namadokter,pd.tglpulang,
			               CASE when ru.objectdepartemenfk in (16,25,26) then 1 else 0 end as statusinap,'' AS kddiagnosa,pd.norec"))
            ->whereNull('br.pasiendaftarfk')
             ->where('ps.kdprofile',$kdProfile);
        if(isset($request['nik']) && $request['nik']!="" && $request['nik']!="undefined"){
            $data = $data->where('ps.noidentitas','=', $request['nik']);
        }
        if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('ps.nocm','ilike', '%'.$request['nocm'].'%');
        }
        if(isset($request['id_pasien']) && $request['id_pasien']!="" && $request['id_pasien']!="undefined"){
            $data = $data->where('ps.id','=', $request['id_pasien']);
        }
        if(isset($request['nobpjs']) && $request['nobpjs']!="" && $request['nobpjs']!="undefined"){
            $data = $data->where('ps.nobpjs','=', $request['nobpjs']);
        }
        if(isset($request['namapasien']) && $request['namapasien']!="" && $request['namapasien']!="undefined"){
            $data = $data->where('ps.namapasien','iilike', '%'.$request['namapasien'].'%');
        }
        if(isset($request['nokk']) && $request['nokk']!="" && $request['nokk']!="undefined"){
//            $data = $data->where('ps.nokk','=', $request['nokk']);
        }
        if(isset($request['limit']) && $request['limit']!="" && $request['limit']!="undefined"){
            $data = $data->limit( $request['limit']);
        }
        if(isset($request['page']) && $request['page']!="" && $request['page']!="undefined"){
            $data = $data->offset($request['page']);
        }
        $data = $data->where('ps.statusenabled', true);
        $data = $data->orderBy('pd.tglregistrasi', 'desc');
        $data = $data->get();
        $norecaPd = '';
        $diagnosa = '';
//        return $this->respond($data);
        foreach ($data as $ob){
            $norecaPd = $norecaPd.",'".$ob->norec . "'";
//                        $ob->kddiagnosa = [];
        }
        $norecaPd = substr($norecaPd, 1, strlen($norecaPd)-1);
//                    $diagnosa = [];
        if($norecaPd!= ''){
            $diagnosa = DB::select(DB::raw("
                           select dg.kddiagnosa || ': ' || dg.namadiagnosa AS diagnosa,ddp.noregistrasifk as norec_apd,apd.noregistrasifk AS norec_pd
                           from antrianpasiendiperiksa_t AS apd 
                           inner join detaildiagnosapasien_t as ddp ON ddp.noregistrasifk = apd.norec
                           left join diagnosapasien_t as dp on dp.norec=ddp.objectdiagnosapasienfk
                           left join diagnosa_m as dg on ddp.objectdiagnosafk=dg.id
                           where ddp.objectjenisdiagnosafk = 1 and apd.noregistrasifk in ($norecaPd) "));
            $i = 0;
            foreach ($data as $h){
                foreach ($diagnosa as $d){
                    if($data[$i]->norec == $d->norec_pd){
//                        return $this->respond($d);
                        if ($d->diagnosa != null){
//                            return $this->respond($data[$i]->diagnosa);
                            $data[$i]->kddiagnosa = $data[$i]->kddiagnosa . ', ' . $d->diagnosa;
                        }
                    }
                }
                $i++;
            }
        }
        $d=0;
        $result=[];
        foreach ($data as $hideung){
            if ($hideung->kddiagnosa != ""){
                $data[$d]->kddiagnosa = substr($data[$d]->kddiagnosa,1);
                $result [] = $data[$d];
            }
            $d = $d + 1;
        }

        if(count($data) > 0){
            $result = array(
                "response" =>  $data,
                "metadata" => array(
                    "code" => "200",
                    "message" => "Ok"
                )
            );
        }else{
            $result = array(
                "response" =>  null,
                "metadata" => array(
                    "code" => "400",
                    "message" => "Data tidak ditemukan"
                )
            );
        }


        return $this->setStatusCode($result['metadata']['code'])->respond($result);
        // return $this->respond($data);
    }
    public function getObservasiKesehatan(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $data = \DB::table('pasien_m as ps')
            ->join('pasiendaftar_t as pd', 'pd.nocmfk', '=', 'ps.id')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join ('detaildiagnosapasien_t as ddp','ddp.noregistrasifk','=','apd.norec')
            ->leftjoin ('diagnosapasien_t as dp','dp.norec','=','ddp.objectdiagnosapasienfk')
            ->leftjoin ('diagnosa_m as dg','ddp.objectdiagnosafk','=','dg.id')
            ->select(DB::raw("ddp.tglinputdiagnosa as tanggal, dg.kddiagnosa || ': ' || dg.namadiagnosa AS observasi,
                        ddp.keterangan,'' as status,
                        ps.nocm,ps.namapasien,pd.tglregistrasi,
                        pd.noregistrasi,ps.noidentitas as nik
                     "))
            ->where('pd.statusenabled',true)
            ->where('ps.statusenabled', true)
            ->where('ddp.objectjenisdiagnosafk',1)
            ->where('ps.kdprofile',$kdProfile);
        if(isset($request['nik']) && $request['nik']!="" && $request['nik']!="undefined"){
            $data = $data->where('ps.noidentitas','=', $request['nik']);
        }
        if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('ps.nocm','ilike', '%'.$request['nocm'].'%');
        }
        if(isset($request['id_pasien']) && $request['id_pasien']!="" && $request['id_pasien']!="undefined"){
            $data = $data->where('ps.id','=', $request['id_pasien']);
        }
        if(isset($request['nobpjs']) && $request['nobpjs']!="" && $request['nobpjs']!="undefined"){
            $data = $data->where('ps.nobpjs','=', $request['nobpjs']);
        }
        if(isset($request['namapasien']) && $request['namapasien']!="" && $request['namapasien']!="undefined"){
            $data = $data->where('ps.namapasien','iilike', '%'.$request['namapasien'].'%');
        }
        if(isset($request['nokk']) && $request['nokk']!="" && $request['nokk']!="undefined"){
//            $data = $data->where('ps.nokk','=', $request['nokk']);
        }
        if(isset($request['limit']) && $request['limit']!="" && $request['limit']!="undefined"){
            $data = $data->limit( $request['limit']);
        }
        if(isset($request['page']) && $request['page']!="" && $request['page']!="undefined"){
            $data = $data->offset($request['page']);
        }

        $data = $data->orderBy('pd.tglregistrasi', 'desc');
        $data = $data->get();


        if(count($data) > 0){
            $result = array(
                "response" =>  $data,
                "metadata" => array(
                    "code" => "200",
                    "message" => "Ok"
                )
            );
        }else{
            $result = array(
                "response" =>  null,
                "metadata" => array(
                    "code" => "400",
                    "message" => "Data tidak ditemukan"
                )
            );
        }


        return $this->setStatusCode($result['metadata']['code'])->respond($result);
        // return $this->respond($data);
    }
    public function getProsedur(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $data = \DB::table('pasien_m as ps')
            ->join('pasiendaftar_t as pd', 'pd.nocmfk', '=', 'ps.id')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join ('diagnosatindakanpasien_t as dp','dp.objectpasienfk','=','apd.norec')
            ->leftjoin ('detaildiagnosatindakanpasien_t as ddp','ddp.objectdiagnosatindakanpasienfk','=','dp.norec')
            ->leftjoin ('diagnosatindakan_m as dg','ddp.objectdiagnosatindakanfk','=','dg.id')
            ->leftjoin ('pegawai_m as pg','pg.id','=','ddp.objectpegawaifk')
            ->select(DB::raw("ddp.tglinputdiagnosa AS tanggal,
                        dg.kddiagnosatindakan  || ' : ' || dg.namadiagnosatindakan AS prosedur,	ddp.keterangantindakan as keterangan,
                    pg.namalengkap as penyedia,ps.nocm,	ps.namapasien,	pd.tglregistrasi,	pd.noregistrasi,
                        ps.noidentitas AS nik
                     "))
            ->where('pd.statusenabled',true)
            ->where('ps.statusenabled', true)
            ->where('ps.kdprofile',$kdProfile);
//            ->where('ddp.objectjenisdiagnosafk',1);
        if(isset($request['nik']) && $request['nik']!="" && $request['nik']!="undefined"){
            $data = $data->where('ps.noidentitas','=', $request['nik']);
        }
       if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('ps.nocm','ilike', '%'.$request['nocm'].'%');
        }
        if(isset($request['id_pasien']) && $request['id_pasien']!="" && $request['id_pasien']!="undefined"){
            $data = $data->where('ps.id','=', $request['id_pasien']);
        }
        if(isset($request['nobpjs']) && $request['nobpjs']!="" && $request['nobpjs']!="undefined"){
            $data = $data->where('ps.nobpjs','=', $request['nobpjs']);
        }
        if(isset($request['namapasien']) && $request['namapasien']!="" && $request['namapasien']!="undefined"){
            $data = $data->where('ps.namapasien','iilike', '%'.$request['namapasien'].'%');
        }
        if(isset($request['nokk']) && $request['nokk']!="" && $request['nokk']!="undefined"){
//            $data = $data->where('ps.nokk','=', $request['nokk']);
        }
        if(isset($request['limit']) && $request['limit']!="" && $request['limit']!="undefined"){
            $data = $data->limit( $request['limit']);
        }
        if(isset($request['page']) && $request['page']!="" && $request['page']!="undefined"){
            $data = $data->offset($request['page']);
        }

        $data = $data->orderBy('pd.tglregistrasi', 'desc');
        $data = $data->get();


        if(count($data) > 0){
            $result = array(
                "response" =>  $data,
                "metadata" => array(
                    "code" => "200",
                    "message" => "Ok"
                )
            );
        }else{
            $result = array(
                "response" =>  null,
                "metadata" => array(
                    "code" => "400",
                    "message" => "Data tidak ditemukan"
                )
            );
        }


        return $this->setStatusCode($result['metadata']['code'])->respond($result);
        // return $this->respond($data);
    }

    public function getKesehatanUmum(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $data = \DB::table('emrpasiend_t as emrdp')
            ->join('emrpasien_t as emrp', 'emrp.noemr', '=', 'emrdp.emrpasienfk')
            ->leftjoin('emrd_t as emrd', 'emrd.id', '=', 'emrdp.emrdfk')
            ->leftjoin('pasien_m as ps', 'ps.nocm', '=', 'emrp.nocm')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'emrdp.pegawaifk')
            ->select(DB::raw("emrp.noregistrasifk as noregistrasi,emrp.tglregistrasi, emrp.noemr,
            emrp.tglemr as tglemr,emrd.caption as namaemr,emrdp.value as nilai,emrp.namaruangan,
                emrdp.emrdfk"))
            ->where('emrdp.statusenabled', true)
            ->whereIn('emrdp.emrdfk',[4241,4242,4243,4244,4245,4246])
            ->orderBy('emrp.tglemr')
            ->where('emrp.kdprofile',$kdProfile );

        if(isset($request['nik']) && $request['nik']!="" && $request['nik']!="undefined"){
            $data = $data->where('ps.noidentitas','=', $request['nik']);
        }
        if(isset($request['id_pasien']) && $request['id_pasien']!="" && $request['id_pasien']!="undefined"){
            $data = $data->where('ps.id','=', $request['id_pasien']);
        }
       if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('ps.nocm','ilike', '%'.$request['nocm'].'%');
        }
        if(isset($request['nobpjs']) && $request['nobpjs']!="" && $request['nobpjs']!="undefined"){
            $data = $data->where('ps.nobpjs','=', $request['nobpjs']);
        }
        if(isset($request['namapasien']) && $request['namapasien']!="" && $request['namapasien']!="undefined"){
            $data = $data->where('ps.namapasien','ilike', '%'.$request['namapasien'].'%');
        }
        if(isset($request['nokk']) && $request['nokk']!="" && $request['nokk']!="undefined"){
//            $data = $data->where('ps.nokk','=', $request['nokk']);
        }
        if(isset($request['limit']) && $request['limit']!="" && $request['limit']!="undefined"){
            $data = $data->limit( $request['limit']);
        }
        if(isset($request['page']) && $request['page']!="" && $request['page']!="undefined"){
            $data = $data->offset($request['page']);
        }

        // $data = $data->orderBy('tr.tgltransaksi','desc');
        $data = $data->get();
        if(count($data) > 0){
            $result = array(
                "response" =>  $data,
                "metadata" => array(
                    "code" => "200",
                    "message" => "Ok"
                )
            );
        }else{
            $result = array(
                "response" =>  null,
                "metadata" => array(
                    "code" => "400",
                    "message" => "Data tidak ditemukan"
                )
            );
        }


        return $this->setStatusCode($result['metadata']['code'])->respond($result);
        // return $this->respond($data);
    }
    public function getAlergi2(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $data = \DB::table('emrpasiend_t as emrdp')
            ->join('emrpasien_t as emrp', 'emrp.noemr', '=', 'emrdp.emrpasienfk')
            ->leftjoin('emrd_t as emrd', 'emrd.id', '=', 'emrdp.emrdfk')
            ->leftjoin('pasien_m as ps', 'ps.nocm', '=', 'emrp.nocm')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'emrdp.pegawaifk')
            ->select(DB::raw("emrp.noregistrasifk as noregistrasi,emrp.tglregistrasi, emrp.noemr,
            emrp.tglemr as tglemr,emrd.caption as namaemr,emrdp.value as nilai,emrp.namaruangan,
                emrdp.emrdfk"))
            ->where('emrdp.statusenabled', true)
            ->whereIn('emrdp.emrdfk',[4263,4262,4261])
            ->orderBy('emrp.tglemr')
            ->where('emrp.kdprofile',$kdProfile );

        if(isset($request['nik']) && $request['nik']!="" && $request['nik']!="undefined"){
            $data = $data->where('ps.noidentitas','=', $request['nik']);
        }
        if(isset($request['id_pasien']) && $request['id_pasien']!="" && $request['id_pasien']!="undefined"){
            $data = $data->where('ps.id','=', $request['id_pasien']);
        }
        if(isset($request['nobpjs']) && $request['nobpjs']!="" && $request['nobpjs']!="undefined"){
            $data = $data->where('ps.nobpjs','=', $request['nobpjs']);
        }
        if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('ps.nocm','ilike', '%'.$request['nocm'].'%');
        }
        if(isset($request['namapasien']) && $request['namapasien']!="" && $request['namapasien']!="undefined"){
            $data = $data->where('ps.namapasien','ilike', '%'.$request['namapasien'].'%');
        }
        if(isset($request['nokk']) && $request['nokk']!="" && $request['nokk']!="undefined"){
//            $data = $data->where('ps.nokk','=', $request['nokk']);
        }
        if(isset($request['limit']) && $request['limit']!="" && $request['limit']!="undefined"){
            $data = $data->limit( $request['limit']);
        }
        if(isset($request['page']) && $request['page']!="" && $request['page']!="undefined"){
            $data = $data->offset($request['page']);
        }

        // $data = $data->orderBy('tr.tgltransaksi','desc');
        $data = $data->get();
        if(count($data) > 0){
            $result = array(
                "response" =>  $data,
                "metadata" => array(
                    "code" => "200",
                    "message" => "Ok"
                )
            );
        }else{
            $result = array(
                "response" =>  null,
                "metadata" => array(
                    "code" => "400",
                    "message" => "Data tidak ditemukan"
                )
            );
        }


        return $this->setStatusCode($result['metadata']['code'])->respond($result);
        // return $this->respond($data);
    }
    public function getAlergi(Request $request) {

        $data=[];
        if(count($data) > 0){
            $result = array(
                "response" =>  $data,
                "metadata" => array(
                    "code" => "200",
                    "message" => "Ok"
                )
            );
        }else{
            $result = array(
                "response" =>  null,
                "metadata" => array(
                    "code" => "400",
                    "message" => "Data tidak ditemukan"
                )
            );
        }


        return $this->setStatusCode($result['metadata']['code'])->respond($result);

    }
    public function getPengobatan(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $data = \DB::table('pelayananpasien_t as pp')
            ->JOIN('antrianpasiendiperiksa_t as apd','apd.norec','=','pp.noregistrasifk')
            ->JOIN('pasiendaftar_t as pd','pd.norec','=','apd.noregistrasifk')
            ->JOIN('pasien_m as ps','ps.id','=','pd.nocmfk')
            ->JOIN('produk_m as pr','pr.id','=','pp.produkfk')
            ->JOIN('ruangan_m as ru','ru.id','=','apd.objectruanganfk')
            ->leftJoin('satuanstandar_m as ss','ss.id','=','pp.satuanviewfk')
            ->leftJOIN('strukresep_t as sr','sr.norec','=','pp.strukresepfk')
            ->leftJOIN('pegawai_m as dok','dok.id','=','sr.penulisresepfk')
            ->JOIN('jeniskemasan_m as jkm','jkm.id','=','pp.jeniskemasanfk')
            ->JOIN('detailjenisproduk_m as djp','djp.id','=','pr.objectdetailjenisprodukfk')
            ->JOIN('jenisproduk_m as jp','jp.id','=','djp.objectjenisprodukfk')
            ->leftJOIN('ruangan_m as ru2','ru2.id','=','sr.ruanganfk')
            ->select(DB::raw("pd.noregistrasi,pd.tglregistrasi,sr.tglresep,sr.noresep,
                pr.namaproduk,pp.jumlah,pp.dosis,  pp.aturanpakai,ru.namaruangan,ss.satuanstandar as satuan,jkm.jeniskemasan,
                dok.namalengkap as pemberiresep,jp.jenisproduk,djp.detailjenisproduk,ru2.namaruangan as ruangandepo
          
            "))
            ->where('pd.statusenabled',true)
            ->whereNotNull('pp.strukresepfk')
            ->where('pp.kdprofile',$kdProfile );
        if(isset($request['nik']) && $request['nik']!="" && $request['nik']!="undefined"){
            $data = $data->where('ps.noidentitas','=', $request['nik']);
        }
        if(isset($request['id_pasien']) && $request['id_pasien']!="" && $request['id_pasien']!="undefined"){
            $data = $data->where('ps.id','=', $request['id_pasien']);
        }
        if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('ps.nocm','ilike', '%'.$request['nocm'].'%');
        }
        if(isset($request['nobpjs']) && $request['nobpjs']!="" && $request['nobpjs']!="undefined"){
            $data = $data->where('ps.nobpjs','=', $request['nobpjs']);
        }
        if(isset($request['namapasien']) && $request['namapasien']!="" && $request['namapasien']!="undefined"){
            $data = $data->where('ps.namapasien','ilike', '%'.$request['namapasien'].'%');
        }
        if(isset($request['nokk']) && $request['nokk']!="" && $request['nokk']!="undefined"){
//            $data = $data->where('ps.nokk','=', $request['nokk']);
        }
        if(isset($request['limit']) && $request['limit']!="" && $request['limit']!="undefined"){
            $data = $data->limit( $request['limit']);
        }
        if(isset($request['page']) && $request['page']!="" && $request['page']!="undefined"){
            $data = $data->offset($request['page']);
        }

        // $data = $data->orderBy('tr.tgltransaksi','desc');
        $data = $data->get();
//        $data = collect($data);
        if(count($data) > 0){
            $result = array(
                "response" => $data,//  $data->groupBy('noresep'),
                "metadata" => array(
                    "code" => "200",
                    "message" => "Ok"
                )
            );
        }else{
            $result = array(
                "response" =>  null,
                "metadata" => array(
                    "code" => "400",
                    "message" => "Data tidak ditemukan"
                )
            );
        }


        return $this->setStatusCode($result['metadata']['code'])->respond($result);

    }
    public function getPertemuanMendatang(Request $request) {
         $kdProfile = $this->getDataKdProfile($request);
        $data = \DB::table('antrianpasienregistrasi_t as apr')
            ->leftJoin('pasien_m as pm','pm.id','=','apr.nocmfk')
            ->leftJoin('ruangan_m as ru','ru.id','=','apr.objectruanganfk')
            ->leftJoin('pegawai_m as pg','pg.id','=','apr.objectpegawaifk')
            ->leftJoin('kelompokpasien_m as kps','kps.id','=','apr.objectkelompokpasienfk')
            ->select(
                DB::raw("
                apr.noreservasi,apr.tanggalreservasi as tanggal,
                ru.namaruangan,pg.namalengkap as dokter,
                apr.notelepon,pm.nohp,
                (case when pm.namapasien is null then apr.namapasien else pm.namapasien end) as namapasien,pm.nocm,
                apr.keterangan as informasi,'Reservasi' as jenis")

            )
            ->where('apr.noreservasi','<>','-')
            ->where('apr.statusenabled',true)
            ->whereNotNull('apr.noreservasi')
            ->where('apr.kdprofile',$kdProfile);
        if(isset($request['nik']) && $request['nik']!="" && $request['nik']!="undefined"){
            $data = $data->where('pm.noidentitas','=', $request['nik']);
        }
       if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('pm.nocm','ilike', '%'.$request['nocm'].'%');
        }
        if(isset($request['namapasien']) && $request['namapasien']!="" && $request['namapasien']!="undefined"){
            $nama = $request['namapasien'];
            $data = $data->whereRaw("(pm.namapasien ilike'%$nama%' or apr.namapasien ilike'%$nama%') " );
        }
        if(isset($request['id_pasien']) && $request['id_pasien']!="" && $request['id_pasien']!="undefined"){
            $data = $data->where('pm.id','=', $request['id_pasien']);
        }
        if(isset($request['nobpjs']) && $request['nobpjs']!="" && $request['nobpjs']!="undefined"){
            $data = $data->where('pm.nobpjs','=', $request['nobpjs']);
        }
        if(isset($request['namapasien']) && $request['namapasien']!="" && $request['namapasien']!="undefined"){
            $data = $data->where('pm.namapasien','iilike', '%'.$request['namapasien'].'%');
        }
        if(isset($request['nokk']) && $request['nokk']!="" && $request['nokk']!="undefined"){
//            $data = $data->where('ps.nokk','=', $request['nokk']);
        }
        if(isset($request['limit']) && $request['limit']!="" && $request['limit']!="undefined"){
            $data = $data->limit( $request['limit']);
        }
        if(isset($request['page']) && $request['page']!="" && $request['page']!="undefined"){
            $data = $data->offset($request['page']);
        }

        $data = $data->orderBy('apr.tanggalreservasi', 'desc');
        $data = $data->get();


        if(count($data) > 0){
            $result = array(
                "response" =>  $data,
                "metadata" => array(
                    "code" => "200",
                    "message" => "Ok"
                )
            );
        }else{
            $result = array(
                "response" =>  null,
                "metadata" => array(
                    "code" => "400",
                    "message" => "Data tidak ditemukan"
                )
            );
        }


        return $this->setStatusCode($result['metadata']['code'])->respond($result);

    }
    public function getRadiologi(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $data = \DB::table('pelayananpasien_t as pp')
            ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
            ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->JOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftJOIN('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->JOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->JOIN('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('hasilradiologi_t as hr','hr.pelayananpasienfk','=','pp.norec')
            ->leftJOIN('strukorder_t as so', 'so.norec', '=', 'pp.strukorderfk')
            ->leftJOIN('ris_order as ris', 'ris.order_no', '=',
                       DB::raw('so.noorder AND ris.order_code=cast(pp.produkfk as text)'))
            ->select(
                DB::raw("
               to_char(pp.tglpelayanan,'dd-MM-yyyy') as tgllayanan,
                to_char(pp.tglpelayanan,'HH:mm') as jamlayanan,pp.tglpelayanan as tanggal, pr.namaproduk,pp.jumlah,pp.hargasatuan,ps.nohp as notelpon,
                ru.namaruangan,ps.nocm,ps.namapasien,ps.noidentitas as nik,pd.noregistrasi, pd.tglregistrasi,pp.norec as norec_pp,
                hr.keterangan as ekspertise,ris.order_cnt as nourutrad")
            )
            ->where('ru.objectdepartemenfk', $this->settingDataFixed('KdDepartemenInstalasiRadiologi',$kdProfile))
            ->whereNull('pp.strukresepfk')
            ->where('pp.kdprofile', $kdProfile )
            ->orderBy('pp.tglpelayanan','desc');

        if(isset($request['nik']) && $request['nik']!="" && $request['nik']!="undefined"){
            $data = $data->where('ps.noidentitas','=', $request['nik']);
        }
       if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('ps.nocm','ilike', '%'.$request['nocm'].'%');
        }
   

        if(isset($request['id_pasien']) && $request['id_pasien']!="" && $request['id_pasien']!="undefined"){
            $data = $data->where('ps.id','=', $request['id_pasien']);
        }
        if(isset($request['nobpjs']) && $request['nobpjs']!="" && $request['nobpjs']!="undefined"){
            $data = $data->where('ps.nobpjs','=', $request['nobpjs']);
        }
        if(isset($request['namapasien']) && $request['namapasien']!="" && $request['namapasien']!="undefined"){
            $data = $data->where('ps.namapasien','ilike', '%'.$request['namapasien'].'%');
        }
        if(isset($request['nokk']) && $request['nokk']!="" && $request['nokk']!="undefined"){
//            $data = $data->where('ps.nokk','=', $request['nokk']);
        }
        if(isset($request['limit']) && $request['limit']!="" && $request['limit']!="undefined"){
            $data = $data->limit( $request['limit']);
        }
        if(isset($request['page']) && $request['page']!="" && $request['page']!="undefined"){
            $data = $data->offset($request['page']);
        }
        $data = $data->get();
        if(count($data) > 0){
                $pelayananpetugas = \DB::table('pasiendaftar_t as pd')
                    ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                    ->join('pelayananpasienpetugas_t as ptu', 'ptu.nomasukfk', '=', 'apd.norec')
                    ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'ptu.objectpegawaifk')
                    ->select('ptu.pelayananpasien', 'pg.namalengkap', 'pg.id')
//                    ->where('pd.kdprofile',$idProfile)
                    ->where('ptu.objectjenispetugaspefk', 4)
                    ->where('pd.kdprofile', $kdProfile )
                    ->where('pd.noregistrasi', $data[0]->noregistrasi)
                    ->get();

                foreach ($data as $item) {
                    $NamaDokter = '-';
                    $idPeg = 0;
                    foreach ($pelayananpetugas as $hahaha) {
                        if ($hahaha->pelayananpasien == $item->norec_pp) {
                            $NamaDokter = $hahaha->namalengkap;
                            $idPeg = $hahaha->id;
                        }
                    }
                    $item->id_hasil = ($item->nourutrad == null) ? '-' : $item->nocm. '-'.$item->nourutrad;
                    $item->penyedia = $NamaDokter;

                    $curl = curl_init();
                    curl_setopt_array($curl, array(
                        CURLOPT_URL => 'https://transmedic.co.id:2301/dcm4chee-arc/aets/TRANSMEDIC/rs/studies?limit=1&includefield=all&offset=0&PatientID='.$item->id_hasil,//$data->result_id,
                        CURLOPT_RETURNTRANSFER => true,
                        CURLOPT_ENCODING => "",
                        CURLOPT_MAXREDIRS => 10,
                        CURLOPT_TIMEOUT => 30,
                        CURLOPT_SSL_VERIFYHOST => 0,
                        CURLOPT_SSL_VERIFYPEER => 0,
                        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                        CURLOPT_CUSTOMREQUEST => "GET",
                        CURLOPT_HTTPHEADER => array(
                            "Content-Type: application/json;",
                        ),
                    ));

                    $response = curl_exec($curl);
                    $err = curl_error($curl);

                    curl_close($curl);
                    $hs = json_decode($response);
                    $baseUrl= '';
                    $item->ket_hasil = 'Belum Ada';
                    $urlPACS ='';
                    $item->url_hasil ='';
                    if($hs!=null){
                        if(isset($hs[0])){
                           $item->ket_hasil = 'Ada';
                           $urlPACS= $hs[0]->{'0020000D'}->Value[0];
                           $baseUrl ='http://bdg2.jasamedika.com:2303/viewer/'.$idPeg.'/'.$item->norec_pp.'/'. $item->nocm.'/'. $urlPACS;
                           $item->url_hasil =$baseUrl; 
                        }
                    }
                   
                }
            $result = array(
                "response" =>  $data,
                "metadata" => array(
                    "code" => "200",
                    "message" => "Ok"
                )
            );
        }else{
            $result = array(
                "response" =>  null,
                "metadata" => array(
                    "code" => "400",
                    "message" => "Data tidak ditemukan"
                )
            );
        }
        return $this->setStatusCode($result['metadata']['code'])->respond($result);

    }
    public function getHasilLab(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $p_NIK ='';
        $p_nocm ='';
        $p_id ='';
        $p_nobpjs ='';
        $p_namaPasien ='';
        $page = '';
        $limit = '';
        if(isset($request['nik']) && $request['nik']!="" && $request['nik']!="undefined"){
            $p_NIK =" and ps.noidentitas='".$request['nik']."'";
        }
        if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $p_nocm =  " and ps.nocm ilike '%".$request['nocm']."%'";
        }
        if(isset($request['id_pasien']) && $request['id_pasien']!="" && $request['id_pasien']!="undefined"){
            $p_id =' and ps.id='. $request['id_pasien'];
        }
        if(isset($request['nobpjs']) && $request['nobpjs']!="" && $request['nobpjs']!="undefined"){
            $p_nobpjs = " and ps.nobpjs='".$request['nobpjs']."'";
        }
        if(isset($request['namapasien']) && $request['namapasien']!="" && $request['namapasien']!="undefined"){
            $p_namaPasien = " and ps.namapasien ilike '%".$request['namapasien']."%'";
        }
        if(isset($request['limit']) && $request['limit']!="" && $request['limit']!="undefined"){
            $limit = (int)$request['limit'];
        }
        if(isset($request['page']) && $request['page']!="" && $request['page']!="undefined"){
            $page = (int)$request['page'];
        }
        $pasien = collect(DB::select( "select ps.* from pasien_m as ps where ps.statusenabled=true
        and ps.kdprofile=$kdProfile  $p_NIK
                 $p_nocm 
                 $p_id "))->first();

        $jk = 0;
        if(!empty($pasien)){
            $jk = $pasien->objectjeniskelaminfk;
        }else{
            $result = array(
                "response" =>  null,
                "metadata" => array(
                    "code" => "400",
                    "message" => "Data tidak ditemukan"
                )
            );
           return $this->setStatusCode($result['metadata']['code'])->respond($result);

        }
        // $data = [];
        $noc = $pasien->nocm;
        $data= collect( DB::connection('sqlsrv')
               ->select("select NOLAB_RS as no_lab,REG_DATE as tgl_lab,KEL_PEMERIKSAAN as kelompokpemeriksaan,TARIF_NAME as pemeriksaan,
                PARAMETER_NAME as detailpemeriksaan,HASIL as hasil,NILAI_RUJUKAN as nilainormal,SATUAN as satuan,FLAG_HL as flag,
                NORM as nocm,URUT_BOUND as nourut,MODIFIED_DATE as tgl_update ,METODE_PERIKSA as metodeperiksa,Catatan as catatan,
                Rekomendasi as rekomendasi

                 from HasilLIS
           where 
           NORM= '$noc'
           "));
        // $data = DB::select(DB::raw("SELECT pp.tglpelayanan as tanggal ,djp.detailjenisproduk as jenispemeriksaan,prd.namaproduk as namapemeriksaan ,
        //         maps.detailpemeriksaan,maps.memohasil as memohasilperiksa,
        //         maps.nourutdetail,hh.hasil as hasilpemeriksaan,ss.satuanstandar as satuan,nn.nilaitext as batasnormal,nn.tipedata,
        //         nn.nilaimin,nn.nilaimax,
        //         maps.nourutjenispemeriksaan,
        //         hh.flag,pd.noregistrasi,pd.tglregistrasi,pd.tglpulang
        //         FROM pelayananpasien_t  as pp
        //         inner join produk_m as prd on prd.id = pp.produkfk
        //         inner join detailjenisproduk_m as djp on djp.id = prd.objectdetailjenisprodukfk
        //         inner join maphasillab_m  as maps on maps.produkfk = prd.id
        //         inner join maphasillabdetail_m  as maps2 on maps2.maphasilfk = maps.id 
        //         and maps2.jeniskelaminfk ='$jk'
        //         inner join nilainormal_m  as nn on nn.id = maps2.nilainormalfk
        //         inner join antrianpasiendiperiksa_t as apd on apd.norec = pp.noregistrasifk
        //         inner join pasiendaftar_t as pd on pd.norec = apd.noregistrasifk
        //         inner join pasien_m as ps on ps.id = pd.nocmfk
        //         left join satuanstandar_m  as ss on ss.id = maps.satuanstandarfk
        //          join hasillaboratorium_t  as hh on hh.norecpelayanan  = pp.norec 
        //         and pp.noregistrasifk=hh.noregistrasifk
        //         and maps.detailpemeriksaan =hh.detailpemeriksaan 
        //         where pd.statusenabled=1  
        //          $p_NIK
        //          $p_nocm 
        //          $p_id 
        //          $p_nobpjs 
        //          $p_namaPasien 
        //         group by pp.tglpelayanan ,pp.noregistrasifk ,djp.detailjenisproduk,pp.produkfk,prd.namaproduk ,maps.detailpemeriksaan,maps.memohasil,
        //         maps.nourutdetail,maps.satuanstandarfk,ss.satuanstandar,nn.nilaitext,nn.tipedata,nn.nilaimin,nn.nilaimax,hh.hasil,
        //         maps.id ,hh.norec ,maps.nourutjenispemeriksaan,maps.nourutdetail,pp.norec ,
        //         hh.flag,nn.id ,maps2.jeniskelaminfk,pd.noregistrasi,pd.tglregistrasi,pd.tglpulang
        //         order by  maps.nourutjenispemeriksaan,maps.nourutdetail asc"));
        if( $page != '' && $limit != '' ){
            $data  = collect($data)->forPage($page, $limit);
        }
        if(count($data) > 0){
            foreach ($data as $key => $value) {
               $value->nik= $pasien->noidentitas ;
               $value->namapasien= $pasien->namapasien ;
            }
            $result = array(
                "response" =>  $data,
                "metadata" => array(
                    "code" => "200",
                    "message" => "Ok"
                )
            );
        }else{
            $result = array(
                "response" =>  null,
                "metadata" => array(
                    "code" => "400",
                    "message" => "Data tidak ditemukan"
                )
            );
        }
        return $this->setStatusCode($result['metadata']['code'])->respond($result);

    }
    public function getECG(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $data = \DB::table('eecg_t as emr')
            ->leftJoin('pasien_m as ps','ps.nocm','=','emr.customerid')
            ->select('emr.norec','emr.kunci','emr.nilai','emr.urut','emr.customerid','emr.datesend','ps.nocm','ps.namapasien','ps.noidentitas as nik')
            ->orderBy('emr.urut');
       if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('emr.customerid','like', '%'.$request['nocm'].'%');
        
        }
        if(isset($request['nik']) && $request['nik']!="" && $request['nik']!="undefined"){
            $data = $data->where('ps.noidentitas','=', $request['nik']);
        }
//        if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
//            $data = $data->where('ps.nocm','=', $request['nocm']);
//        }

        if(isset($request['id_pasien']) && $request['id_pasien']!="" && $request['id_pasien']!="undefined"){
            $data = $data->where('ps.id','=', $request['id_pasien']);
        }
        if(isset($request['nobpjs']) && $request['nobpjs']!="" && $request['nobpjs']!="undefined"){
            $data = $data->where('ps.nobpjs','=', $request['nobpjs']);
        }
        if(isset($request['namapasien']) && $request['namapasien']!="" && $request['namapasien']!="undefined"){
            $data = $data->where('ps.namapasien','like', '%'.$request['namapasien'].'%');
        }
        if (isset($request['date_send']) && $request['date_send'] != '') {
            $data = $data->where('emr.norec', 'like', $request['date_send'] . '%');
        }
        if (isset($request['vis']) && $request['vis'] != '') {
            if ($request['vis'] == 'true') {
                $data = $data->where('emr.statusenabled', $request['vis']);
            } else {
                $data = $data->whereNull('emr.statusenabled');
            }
        }
        $data =$data->get();
        if(count($data) > 0){
            $result = array(
                "response" =>  $data,
                "metadata" => array(
                    "code" => "200",
                    "message" => "Ok"
                )
            );
        }else{
            $result = array(
                "response" =>  null,
                "metadata" => array(
                    "code" => "400",
                    "message" => "Data tidak ditemukan"
                )
            );
        }
        return $this->setStatusCode($result['metadata']['code'])->respond($result);
    }
    public function getRencanaRekomen(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $data = \DB::table('rencana_t as rm')
            ->select('rm.rencana', 'rm.tanggalinput as tglinput',
                'pg.namalengkap as petugas',  'ru.namaruangan', 'pd.noregistrasi', 'pd.tglregistrasi', 'ps.nocm',
                'ps.namapasien','ps.noidentitas as nik')
            ->leftJoin('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'rm.noregistrasifk')
            ->leftJoin('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->leftJoin('pasien_m as ps', 'pd.nocmfk', '=', 'ps.id')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'rm.objectpetugas')
            ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'rm.objectruanganfk')
            ->where('rm.statusenabled', true)
            ->where('rm.kdprofile', $kdProfile);

        if (isset($request['noregistrasifk']) && $request['noregistrasifk'] != '') {
            $data = $data->where('rm.noregistrasifk', $request['noregistrasifk']);
        }
        if(isset($request['nik']) && $request['nik']!="" && $request['nik']!="undefined"){
            $data = $data->where('ps.noidentitas','=', $request['nik']);
        }
        if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('ps.nocm','like', '%'.$request['nocm'].'%');
        
        }

        if(isset($request['id_pasien']) && $request['id_pasien']!="" && $request['id_pasien']!="undefined"){
            $data = $data->where('ps.id','=', $request['id_pasien']);
        }
        if(isset($request['nobpjs']) && $request['nobpjs']!="" && $request['nobpjs']!="undefined"){
            $data = $data->where('ps.nobpjs','=', $request['nobpjs']);
        }
        if(isset($request['namapasien']) && $request['namapasien']!="" && $request['namapasien']!="undefined"){
            $data = $data->where('ps.namapasien','like', '%'.$request['namapasien'].'%');
        }
        if(isset($request['limit']) && $request['limit']!="" && $request['limit']!="undefined"){
            $data = $data->limit( $request['limit']);
        }
        if(isset($request['page']) && $request['page']!="" && $request['page']!="undefined"){
            $data = $data->offset($request['page']);
        }
        $data =$data->get();
        if(count($data) > 0){
            $result = array(
                "response" =>  $data,
                "metadata" => array(
                    "code" => "200",
                    "message" => "Ok"
                )
            );
        }else{
            $result = array(
                "response" =>  null,
                "metadata" => array(
                    "code" => "400",
                    "message" => "Data tidak ditemukan"
                )
            );
        }
        return $this->setStatusCode($result['metadata']['code'])->respond($result);
    }
    public function getDaftarPasienDK(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $data = \DB::table('pasien_m as ps')
            ->leftjoin('jeniskelamin_m as jk','jk.id','=','ps.objectjeniskelaminfk')
            ->leftjoin('agama_m as ag','ag.id','=','ps.objectagamafk')
            ->leftjoin('golongandarah_m as gd','gd.id','=','ps.objectgolongandarahfk')
            ->leftjoin('pekerjaan_m as pk','pk.id','=','ps.objectpekerjaanfk')
            ->leftjoin('pendidikan_m as pdd','pdd.id','=','ps.objectpendidikanfk')
            ->leftjoin('statusperkawinan_m as spkw','spkw.id','=','ps.objectstatusperkawinanfk')
            ->join('alamat_m as al','al.nocmfk','=','ps.id')
            ->leftjoin('suku_m as sk','sk.id','=','ps.objectsukufk')
            ->select(DB::raw("ps.id,ps.nocm,
    ps.noidentitas as nik,	ps.namapasien,	ps.tgllahir,	ps.nohp AS telepon,	sk.suku as etnis,
	ps.bahasa,	jk.jeniskelamin,	ag.agama,	gd.golongandarah,	al.alamatlengkap,	al.alamatemail as email,
	ps.namaayah as wali,	'Orang Tua' as hubunganwali,	null as alamatwali,
	null as teleponwali,	null as faksesbpjs,	null as alamatfaskes,	null as teleponfaskes,	pk.pekerjaan,
	pdd.pendidikan,	spkw.statusperkawinan,ps.nobpjs"))
            ->where('ps.statusenabled',true)
            ->where('ps.namapasien','!=','-')
            ->where('ps.kdprofile',$kdProfile);
        $stt = false;
        if(isset($request['nik']) && $request['nik']!="" && $request['nik']!="undefined"){
            $data = $data->where('ps.noidentitas','=', $request['nik']);
            $stt = true;
        }
        if(isset($request['nobpjs']) && $request['nobpjs']!="" && $request['nobpjs']!="undefined"){
            $data = $data->where('ps.nobpjs','=', $request['nobpjs']);
            $stt = true;
        }
        if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('ps.nocm','like', '%'.$request['nocm'].'%');
            $stt = true;
        }
        if(isset($request['namapasien']) && $request['namapasien']!="" && $request['namapasien']!="undefined"){
            $data = $data->where('ps.namapasien','like', '%'.$request['namapasien'].'%');
            $stt = true;
        }
        if(isset($request['nokk']) && $request['nokk']!="" && $request['nokk']!="undefined"){
//            $data = $data->where('ps.nokk','=', $request['nokk']);
        }
         if(isset($request['limit']) && $request['limit']!="" && $request['limit']!="undefined"){
            $data = $data->limit( $request['limit']);
        }
        if(isset($request['page']) && $request['page']!="" && $request['page']!="undefined"){
            $data = $data->offset($request['page']);
        }
        $data = $data->orderBy('ps.namapasien');
        $data = $data->get();
        if(count($data)> 0){
            $result = array(
                "response" =>  $data,
                "metadata" => array(
                    "code" => "200",
                    "message" => "Ok",
                    "count" => count($data)
                )
            );
        }else{
            $result = array(
                "response" =>  null,
                "metadata" => array(
                    "code" => "400",
                    "message" => "Data tidak ditemukan"
                )
            );
        }


        return $this->setStatusCode($result['metadata']['code'])->respond($result);
    }
    public function getReffKontrol(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin = $request->all();
        $deptJalan = explode(',', $this->settingDataFixed('kdDepartemenRawatJalanFix',$idProfile));
        $deptKonsul = explode(',', $this->settingDataFixed('KdDeptKonsul',$idProfile));
        $kdDepartemenRawatJalan = [];
        foreach ($deptJalan as $item) {
            $kdDepartemenRawatJalan [] = (int)$item;
        }
        $kdDepartemenKonsul = [];
        foreach ($deptKonsul as $items) {
            $kdDepartemenKonsul [] = (int)$items;
        }

        $dokter = \DB::table('pegawai_m as rm')
            ->select('rm.id', 'rm.namalengkap')
            ->where('rm.kdprofile', $idProfile)
            ->where('rm.statusenabled', true)
            ->where('rm.objectjenispegawaifk', 1)
            ->orderBy('rm.namalengkap')
            ->get();


        $dataRuanganJalan = \DB::table('ruangan_m as ru')
            ->select('ru.id', 'ru.namaruangan', 'ru.objectdepartemenfk')
            ->where('ru.kdprofile', $idProfile)
            ->where('ru.statusenabled', true)
            ->wherein('ru.objectdepartemenfk', $kdDepartemenRawatJalan)
            ->orderBy('ru.namaruangan')
            ->get();
  
      
        $result = array(
          
            'dokter' => $dokter,
            'ruangan' => $dataRuanganJalan,
           
            'message' => 'inhuman',
        );

        return $this->respond($result);
    }
     public function getSOAP(Request $request) {

        $kdProfile = $this->getDataKdProfile($request);

        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'pd.nocmfk', '=', 'ps.id')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->select(DB::raw("ps.noidentitas as nik,pd.tglregistrasi,ps.id as idpasien,ps.nocm,pd.noregistrasi,
                            ps.namapasien,ru.namaruangan,
                            pd.tglpulang,
                           CASE when ru.objectdepartemenfk in (16,25,26) then 1 else 0 end as statusinap,pd.norec"))
             ->where('pd.statusenabled',true)
             ->where('pd.kdprofile',$kdProfile);
        if(isset($request['noregistrasi']) && $request['noregistrasi']!="" && $request['noregistrasi']!="undefined"){
            $data = $data->where('pd.noregistrasi','=', $request['noregistrasi']);
        }
        if(isset($request['nik']) && $request['nik']!="" && $request['nik']!="undefined"){
            $data = $data->where('ps.noidentitas','=', $request['nik']);
        }
        if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('ps.nocm','ilike', '%'.$request['nocm'].'%');
        }
        if(isset($request['id_pasien']) && $request['id_pasien']!="" && $request['id_pasien']!="undefined"){
            $data = $data->where('ps.id','=', $request['id_pasien']);
        }
        if(isset($request['nobpjs']) && $request['nobpjs']!="" && $request['nobpjs']!="undefined"){
            $data = $data->where('ps.nobpjs','=', $request['nobpjs']);
        }
        if(isset($request['namapasien']) && $request['namapasien']!="" && $request['namapasien']!="undefined"){
            $data = $data->where('ps.namapasien','iilike', '%'.$request['namapasien'].'%');
        }
        if(isset($request['nokk']) && $request['nokk']!="" && $request['nokk']!="undefined"){
//            $data = $data->where('ps.nokk','=', $request['nokk']);
        }
        if(isset($request['limit']) && $request['limit']!="" && $request['limit']!="undefined"){
            $data = $data->limit( $request['limit']);
        }
        if(isset($request['page']) && $request['page']!="" && $request['page']!="undefined"){
            $data = $data->offset($request['page']);
        }
        $data = $data->where('ps.statusenabled', true);
        $data = $data->orderBy('pd.tglregistrasi', 'desc');
        $data = $data->get();
      
        $soap = \DB::table('emrpasiend_t as emrdp')
            ->join('emrpasien_t as emrp', 'emrp.noemr', '=', 'emrdp.emrpasienfk')
            ->leftjoin('pasien_m as ps', 'ps.nocm', '=', 'emrp.nocm')
            ->select(DB::raw("emrp.noregistrasifk as noregistrasi,emrp.tglregistrasi, emrp.noemr,
            emrp.tglemr as tglemr,emrdp.value as nilai,emrp.namaruangan,
                emrdp.emrdfk"))

            ->where('emrdp.statusenabled', true)
            ->whereIn('emrdp.emrdfk',[
                22034961,22034963,22034964])
            ->orderBy('emrp.tglemr')
            ->where('emrp.kdprofile',$kdProfile );
        if(isset($request['noregistrasi']) && $request['noregistrasi']!="" && $request['noregistrasi']!="undefined"){
            $soap = $soap->where('emrp.noregistrasifk','=',$request['noregistrasi']);
        }
        if(isset($request['nik']) && $request['nik']!="" && $request['nik']!="undefined"){
            $soap = $soap->where('ps.noidentitas','=', $request['nik']);
        }
        if(isset($request['id_pasien']) && $request['id_pasien']!="" && $request['id_pasien']!="undefined"){
            $soap = $soap->where('ps.id','=', $request['id_pasien']);
        }
       if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $soap = $soap->where('ps.nocm','ilike', '%'.$request['nocm'].'%');
        }
        if(isset($request['nobpjs']) && $request['nobpjs']!="" && $request['nobpjs']!="undefined"){
            $soap = $soap->where('ps.nobpjs','=', $request['nobpjs']);
        }
        if(isset($request['namapasien']) && $request['namapasien']!="" && $request['namapasien']!="undefined"){
            $soap = $soap->where('ps.namapasien','ilike', '%'.$request['namapasien'].'%');
        }

        if(isset($request['limit']) && $request['limit']!="" && $request['limit']!="undefined"){
            $soap = $soap->limit( $request['limit']);
        }
        if(isset($request['page']) && $request['page']!="" && $request['page']!="undefined"){
            $soap = $soap->offset($request['page']);
        }
        $soap =$soap->groupBy("emrp.noregistrasifk","emrp.tglregistrasi", "emrp.noemr",
            "emrp.tglemr","emrdp.value","emrp.namaruangan",
                "emrdp.emrdfk");
        $soap = $soap->get();
            $i=0;
         foreach ($data as $d) {
           $data[$i]->detail_soap=[];
            foreach ($soap as $itemTgl) {
                if ($data[$i]->noregistrasi == trim($itemTgl->noregistrasi)) {
                    $namaemr ='';
                    if (in_array($itemTgl->emrdfk, [22034961]) ) {
                        $namaemr = "Tgl Input";
                    }
                    if (in_array($itemTgl->emrdfk, [22034963]) ) {
                        $namaemr = "SOAP";
                    }
                    if (in_array($itemTgl->emrdfk, [22034964]) ) {
                        $explode = explode('~',$itemTgl->nilai);
                        if(count($explode)>1){
                            $itemTgl->nilai = $explode[1];
                        }else{
                             $itemTgl->nilai = $explode[0];
                        }
                        $namaemr = "Dokter";
                    }
                    $data[$i]->detail_soap[] = array(
                        'noemr' => $itemTgl->noemr,
                        'nilai' => $itemTgl->nilai,
                        'namaemr' => $namaemr,
                    ) ;
                }
            }

           $i ++;
        }
        for ($k = count($data) - 1; $k >= 0; $k--) {
           if(count($data[$k]->detail_soap)==0){
                array_splice($data,$k,1);
           }
        }
        if(count($data) > 0){
            $result = array(
                "response" =>  $data,
                "metadata" => array(
                    "code" => "200",
                    "message" => "Ok"
                )
            );
        }else{
            $result = array(
                "response" =>  null,
                "metadata" => array(
                    "code" => "400",
                    "message" => "Data tidak ditemukan"
                )
            );
        }


        return $this->setStatusCode($result['metadata']['code'])->respond($result);
        // return $this->respond($data);
    }

    function transposeData($data)
    { 
        foreach ($data as $row => $columns) {
          foreach ($columns as $row2 => $column2) {
              $retData[$row2][$row]=$column2;
          }
        }
      return $retData;
    }

  function transpose($array_one) {
    $array_two = [];
    foreach ($array_one as $key => $item) {
        foreach ($item as $subkey => $subitem) {
            $array_two[$subkey][$key] = $subitem;
        }
    }
    return $array_two;
}
}