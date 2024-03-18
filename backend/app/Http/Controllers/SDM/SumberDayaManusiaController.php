<?php
/**
 * Created by PhpStorm.
 * SumberDayaManusiaController
 * User: Efan Andrian (ea@epic)
 * Date: 12/11/2019
 * Time: 09:30 PM
 */

namespace App\Http\Controllers\SDM;
use App\Master\JamKerja;
use App\Master\Paket;
use App\Master\Agama;
use App\Master\DiklatJurusan;
use App\Master\DiklatKategory;
use App\Master\Eselon;
use App\Master\GolonganPegawai;
use App\Master\HubunganKeluarga;
use App\Master\Jabatan;
use App\Master\JenisJabatan;
use App\Master\JenisKelamin;
use App\Master\JenisPegawai;
use App\Master\JenisProvider;
use App\Master\JurusanPeminatan;
use App\Master\KategoryPegawai;
use App\Master\KelompokJabatan;
use App\Master\KelompokUser;
use App\Master\KeluargaPegawai;
use App\Master\Pegawai;
use App\Master\PegawaiJadwalKerja;
use App\Master\Pekerjaan;
use App\Master\Pendidikan;
use App\Master\Ruangan;
use App\Master\SdmKedudukan;
use App\Master\SdmShiftKerja;
use App\Master\SettingDataFixed;
use App\Master\ShiftKerja;
use App\Master\StatusPegawai;
use App\Master\StatuspPerkawinanPegawai;
use App\Master\SubUnitKerja;
use App\Master\SuratKeputusan;
use App\Master\Tanggungan;
use App\Master\UnitKerjaPegawai;
use App\Transaksi\KegiatanPendidikan;
use App\Transaksi\ListTanggalCuti;
use App\Transaksi\MasaBerlakuSipStr;
use App\Transaksi\NomorTelphonePegawai;
use App\Transaksi\PesertaDidik;
use App\Transaksi\PlanningPegawaiStatus;
use App\Transaksi\RiwayatJabatan;
use App\Transaksi\RiwayatPelatihan;
use App\Transaksi\RiwayatPendidikan;
use App\Transaksi\KomponenGaji;
use App\Transaksi\KomponenGajiPegawai;
use App\Transaksi\StrukClosing;
use App\Transaksi\StrukHistori;
use App\Transaksi\DetailGajiPegawai;
use App\Transaksi\SDM_AbsensiPegawai;
use App\Transaksi\TenagaPengajar;
use App\Transaksi\JadwalKerjaPegawai;
use App\Transaksi\StrukBuktiPengeluaran;
use App\Transaksi\StrukBuktiPengeluaranCaraBayar;
use App\Transaksi\PendidikanPegawai;
use App\Transaksi\ABKPegawai;
use Illuminate\Http\Request;
use DB;
use App\Transaksi\LoggingUser;
use Illuminate\Support\Facades\Storage;
use Response;
use App\Http\Controllers\ApiController;
use App\Traits\Valet;
use Carbon\Carbon;
use App\Master\MapPegawaiToUnit;
use Webpatser\Uuid\Uuid;

class SumberDayaManusiaController extends ApiController {

    use Valet;
    public function __construct() {
        parent::__construct($skip_authentication=false);
    }

    public function getComboPegawaiSdm (Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $dataLogin = $request->all();
        $tunjanganbaru = [];
        $validasi = [];
//        $dataPegawai = \DB::table('loginuser_s as lu')
//            ->select('lu.objectpegawaifk','lu.objectkelompokuserfk')
//            ->where('lu.id',$dataLogin['userData']['id'])
//            ->first();
        $agama = Agama::where('statusenabled', true)->where('kdprofile', $kdProfile)->get();
        $jeniskelamin = JenisKelamin::where('statusenabled',true)->where('kdprofile', $kdProfile)->get();
        $UnitKerja = UnitKerjaPegawai::where('statusenabled',true)->where('kdprofile', $kdProfile)->get();
        $SubUnitKerja = SubUnitKerja::where('statusenabled',true)->where('kdprofile', $kdProfile)->get();
        $Ruangan = Ruangan::where('statusenabled',true)->where('kdprofile', $kdProfile)->get();
        $StatusPegawai = StatusPegawai::where('statusenabled',true)->where('kdprofile', $kdProfile)->get();
        $KategoryPegawai = KategoryPegawai::where('statusenabled',true)->where('kdprofile', $kdProfile)->get();
        // $KategoryPegawaiInpasing = KategoryPegawai::where('statusenabled',true)->where('kdprofile', $kdProfile)->whereIn('id',[13,1,23])->get();
        $KategoryPegawaiInpasing = DB::select( DB::raw("select '' as kategorypegawai union select kategorypegawai from kategorypegawai_m where statusenabled = true and kdprofile='$kdProfile' and id in(1,23)") );
        $jabatan = Jabatan::where('statusenabled', true)->where('kdprofile', $kdProfile)->whereIn('objectjenisjabatanfk',[6,7,8])->get();
        $jabatanbaru = Jabatan::where('statusenabled', true)->where('objectjenisjabatanfk', $request['jabatan'])->where('kdprofile', $kdProfile)->get();
        $suratkeputusan = SuratKeputusan::where('statusenabled', true)->where('objectjeniskeputusanfk', 9)->where('kdprofile', $kdProfile)->select('*','nosk as nosk2')->get();

        if(isset($request['jabatan']) && $request['jabatan']!="" && $request['jabatan']!="undefined"){
            if($request['jabatan'] == 6){
                $tunjanganbaru = Jabatan::where('statusenabled', true)->where('kdprofile', $kdProfile)->where('objectjenisjabatanfk', 6)->get();
            } else if($request['jabatan'] == 7){
                $tunjanganbaru = GolonganPegawai::where('statusenabled', true)->where('kdprofile', $kdProfile)->orderBy('id','desc') ->get();
            } else if($request['jabatan'] == 8){
                $tunjanganbaru = Eselon::where('statusenabled', true)->where('kdprofile', $kdProfile)->get();
            }
        }

        if(isset($request['jabatan']) && $request['jabatan']!="" && $request['jabatan']!="undefined" && isset($request['idpegawai']) && $request['idpegawai']!="" && $request['idpegawai']!="undefined"){
            if($request['jabatan'] == 7){
                $validasi = Pegawai::where('id', $request['idpegawai'])->whereNotNull('objectgolonganfk')->first();
            } else if($request['jabatan'] == 8){
                $validasi = Pegawai::where('id', $request['idpegawai'])->whereNotNull('objecteselonfk')->first();
            }
        }
        


        $jenisJabatan = JenisJabatan::where('statusenabled', true)->where('kdprofile', $kdProfile)->get();
        $GolonganPegawai = GolonganPegawai::where('statusenabled', true)
                            ->select(DB::raw("ispppk, id, case when namaexternal is null then name else namaexternal || ',  ' || name end as golongan, level"))
                            ->where('kdprofile', $kdProfile)->orderBy('id', 'asc')->get();
        $KelompokJabatan = KelompokJabatan::where('statusenabled', true)->where('kdprofile', $kdProfile)->get();
        $Pendidikan = Pendidikan::where('statusenabled', true)->where('kdprofile', $kdProfile)->get();
        $Eselon = Eselon::where('statusenabled', true)->where('kdprofile', $kdProfile)->get();
        $ShiftKerja = SdmShiftKerja::where('statusenabled', true)->where('kdprofile', $kdProfile)->get();
        $StatusKawin = StatuspPerkawinanPegawai::where('statusenabled', true)->where('kdprofile', $kdProfile)->get();
        $HubunganKeluarga = HubunganKeluarga::where('statusenabled', true)->where('kdprofile', $kdProfile)->get();
        $Pekerjaan = Pekerjaan::where('statusenabled', true)->where('kdprofile', $kdProfile)->get();
        $Tanggungan = Tanggungan::where('statusenabled', true)->where('kdprofile', $kdProfile)->get();
        $Kedudukan = SdmKedudukan::where('statusenabled',true)->where('kdprofile', $kdProfile)->get();
        $KelompokUser = KelompokUser::where('statusenabled',true)->where('kdprofile', $kdProfile)->get();
        $JenisPegawai = JenisPegawai::where('statusenabled',true)->where('kdprofile', $kdProfile)->get();
        $JenisProvider = JenisProvider::where('statusenabled',true)->where('kdprofile', $kdProfile)->get();
        $KomponenGajiAdd = KomponenGaji::where('statusenabled',true)->where('kdprofile',$kdProfile)->where('kdkomponen','+')->get();
        $KomponenGajiDel = KomponenGaji::where('statusenabled',true)->where('kdprofile',$kdProfile)->where('kdkomponen','-')->get();
        
        $PangkatPegawai = \DB::table('pangkat_m as pk')
            ->where('pk.kdprofile', $kdProfile)
            ->where('pk.statusenabled', true)
            ->orderBy('pk.namapangkat')
            ->get();
        $Shift = \DB::table('shiftkerja_m as pk')
            ->where('pk.kdprofile', $kdProfile)
            ->where('pk.statusenabled', true)
            ->orderBy('pk.namashift')
            ->get();

        $SettingUsiaPensiun = SettingDataFixed::where('statusenabled', true)
            ->select('nilaifield')
            ->where('kdprofile', $kdProfile)
            ->where('keteranganfungsi', 'ilike','%'.'Setting Usia Pensiun'.'%')
            ->first();
        $SettingPasswordAwal = SettingDataFixed::where('statusenabled', true)
            ->select('nilaifield')
            ->where('kdprofile', $kdProfile)
            ->where('namafield', '=','passworddefault')
            ->first();
        $DataUnitkerja=[];
        foreach ($UnitKerja as $item) {
            $detail = [];
            foreach ($SubUnitKerja as $item2) {
                if ($item->id == $item2->objectunitkerjapegawaifk) {
                    $detail[] = array(
                        'id' => $item2->id,
                        'name' => $item2->name,
                    );
                }
            }

            $DataUnitkerja[] = array(
                'id' => $item->id,
                'name' => $item->name,
                'subunit' => $detail,
            );
        }
        $DataJabatan=[];
        // foreach ($jenisJabatan as $datas){
        //     $details=[];
        //     foreach ($jabatan as $data){
        //         if ($datas->id = $data->objectjenisjabatanfk){
        //             $details[]=array(
        //                 'id' => $data->id,
        //                 'namajabatan' => $data->namajabatan
        //             );
        //         }
        //     }
        //     $DataJabatan[] = array(
        //         'id' => $datas->id,
        //         'jenisjabatan' => $datas->jenisjabatan,
        //         'jabatan' => $details
        //     );
        // }
        $deptPelayanan = explode (',',$this->settingDataFixed('kdDepartemenPelayanan',$kdProfile));
        $kdDepartemenRawatPelayanan = [];
        foreach ($deptPelayanan as $itemPelayanan){
            $kdDepartemenRawatPelayanan []=  (int)$itemPelayanan;
        }
        $dataInstalasi = \DB::table('departemen_m as dp')
            ->whereIn('dp.id',$kdDepartemenRawatPelayanan)
            ->where('dp.statusenabled', true)
            ->where('dp.kdprofile', $kdProfile)
            ->orderBy('dp.namadepartemen')
            ->get();

        $dataRuangan = \DB::table('ruangan_m as ru')
            ->where('ru.statusenabled', true)
            ->where('ru.kdprofile', $kdProfile)
            ->orderBy('ru.namaruangan')
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
            ->where('kp.kdprofile', $kdProfile)
            ->where('kp.statusenabled', true)
            ->orderBy('kp.kelompokpasien')
            ->get();

        $dataJenispetugaspe = \DB::table('jenispetugaspelaksana_m as jpp')
            ->select('jpp.id', 'jpp.jenispetugaspe')
//            ->where('jpp.kdprofile', $kdProfile)
            ->where('jpp.statusenabled', true)
            ->orderBy('jpp.jenispetugaspe')
            ->get();
        $dataUnitPenginput = \DB::table('unitpenginput_m as up')
            ->select('up.id', 'up.unitpenginput')
            ->where('up.kdprofile', $kdProfile)
            ->where('up.statusenabled', true)
            ->orderBy('up.unitpenginput')
            ->get();
        $dataNamaPelatihan = \DB::table('namapelatihan_m as np')
            ->where('np.statusenabled', true)
            ->where('np.kdprofile', $kdProfile)
            ->orderBy('np.namapelatihan')
            ->get();
        $datajenispelatihan = \DB::table('jenispelatihan_m as jp')
            ->where('jp.statusenabled', true)
            ->where('jp.kdprofile', $kdProfile)
            ->orderBy('jp.jenispelatihan')
            ->get();
        $sumberdana = \DB::table('sumberdana_m as sd')
            ->where('sd.statusenabled', true)
            ->where('sd.kdprofile', $kdProfile)
            ->orderBy('sd.sumberdana')
            ->get();
        $jenishukuman = \DB::table('jenishukuman_m')
        ->where('statusenabled',true)
        ->where('kdprofile',$kdProfile)
        ->orderBy("id")->get();

        $pendidikanpegawai = PendidikanPegawai::where('statusenabled', true)->where('kdprofile', $kdProfile)->get();

        $result = array(
            'sumberdana' => $sumberdana,
            'datajenispelatihan'=> $datajenispelatihan,
            'dataNamaPelatihan'=> $dataNamaPelatihan,
            'dataunitpenginput'=> $dataUnitPenginput,
            'datalogin'=> $dataLogin,
            'unitkerjapegawai' => $UnitKerja,
            'subunitkerja' => $SubUnitKerja,
            'dataunitkerja' => $DataUnitkerja,
            'statuspegawai' => $StatusPegawai,
            'kategorypegawai' => $KategoryPegawai,
            'kategorypegawaiinpasing' => $KategoryPegawaiInpasing,
            'jeniskelamin' => $jeniskelamin,
            'ruangan' => $Ruangan,
            'agama' => $agama,
            'jabatan' => $jabatan,
            'golonganpegawai' => $GolonganPegawai,
            'kelompokjabatan' => $KelompokJabatan,
            'pendidikan' =>$Pendidikan,
            'eselon' => $Eselon,
            'shiftkerja' => $ShiftKerja,
            'statuskawin' => $StatusKawin,
            'usiapensiun' => $SettingUsiaPensiun,
            'hubungankeluarga' => $HubunganKeluarga,
            'pekerjaan' => $Pekerjaan,
            'tanggungan' => $Tanggungan,
            'datajabatan' => $jenisJabatan,
            'kedudukan' => $Kedudukan,
            'kelompokuser' => $KelompokUser,
            'passwordawal' => $SettingPasswordAwal,
            'jenispegawai' => $JenisPegawai,
            'pangkatpegawai' => $PangkatPegawai,
            'shiftpegawai' => $Shift,
            'jenisprovider' => $JenisProvider,
            'departemen' => $dataDepartemen,
            'kelompokpasien' => $dataKelompok,
            'jenispetugaspe' => $dataJenispetugaspe,
            'komponengajiadd' => $KomponenGajiAdd,
            'komponengajidel' => $KomponenGajiDel,
            'jenishukuman'=> $jenishukuman,
            'pendidikanpegawai'=> $pendidikanpegawai,
            'jabatanbaru'=> $jabatanbaru,
            'tunjanganbaru'=> $tunjanganbaru,
            'validasi'=> $validasi,
            'suratkeputusan'=> $suratkeputusan,
            'by' => 'ea@epic',
        );

        return $this->respond($result);
    }

    public function getComboPegawaiSdmInpassing (Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        // $KategoryPegawaiInpasing = KategoryPegawai::where('statusenabled',true)->where('kdprofile', $kdProfile)->whereIn('id',[13,1,23])->get();
        $KategoryPegawaiInpasing = DB::select( DB::raw("select '' as kategorypegawai union select kategorypegawai from kategorypegawai_m where statusenabled = true and kdprofile='$kdProfile' and id in(1,23)") );

        $result = array(
            'kategorypegawaiinpasing' => $KategoryPegawaiInpasing,
            'by' => 'ea@epic',
        );

        return $this->respond($result);
    }

    public function getDaftarPegawai (Request $request) {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $data = \DB::table('pegawai_m as pg')
            ->leftJoin('agama_m as ag','ag.id','=','pg.objectagamafk')
            ->leftJoin('detailkategorypegawai_m as dkp','dkp.id','=','pg.objectdetailkategorypegawaifk ')
            ->leftJoin('golongandarah_m as gd','gd.id','=', 'pg.objectgolongandarahfk')
            ->leftJoin('jabatan_m as jb','jb.id','=','pg.objectjabatanfungsionalfk')
            ->leftJoin('jenisjabatan_m as jj','jb.objectjenisjabatanfk','=','jj.id')
            ->leftJoin('jabatan_m as jb1','jb1.id', '=', 'pg.objectjabatanstrukturalfk')
            ->leftJoin('golonganpegawai_m as gp','gp.id','=', 'pg.objectgolonganpegawaifk')
            ->leftJoin('unitkerjapegawai_m as uk','uk.id','=','pg.objectunitkerjapegawaifk')
            ->leftJoin('statuspegawai_m as sp','sp.id','=','pg.objectstatuspegawaifk')
            ->leftJoin('kelompokjabatan_m as kj','kj.id','=','pg.objectkelompokjabatanfk')
            ->leftJoin('statusperkawinanpegawai_m as spp','spp.id','=','pg.objectstatusperkawinanpegawaifk')
            ->leftJoin('kategorypegawai_m as kp','kp.id','=','pg.kategorypegawai')
            ->leftJoin('eselon_m as ese','ese.id','=','pg.objecteselonfk')
            ->leftJoin('pendidikan_m as pend','pend.id', '=','pg.objectpendidikanterakhirfk')
            ->leftJoin('jeniskelamin_m as jk','jk.id','=','pg.objectjeniskelaminfk')
            ->leftJoin('sdm_golongan_m as gol','gol.id','=','pg.objectgolonganfk')
            ->leftJoin('nilaikelompokjabatan_m as nkj','nkj.id','=','pg.objectkelompokjabatanfk')
            ->leftJoin('sdm_kelompokshift_m as ks','ks.id','=','pg.objectshiftkerja')
            ->leftJoin('sdm_kedudukan_m as kdd','kdd.id','=','pg.kedudukanfk')
            ->leftJoin('jenispegawai_m as jp','jp.id','=','pg.objectjenispegawaifk')
            ->select(\DB::raw("jb.objectjenisjabatanfk, jj.jenisjabatan,pg.*,ag.agama,dkp.detailkategorypegawai,gd.golongandarah,jb.namajabatan as jbfungsional,
			                        jb1.namajabatan as jbstruktural,gp.golonganpegawai,uk.name as unitkerja,sp.statuspegawai,
			                        kj.namakelompokjabatan,spp.statusperkawinan,ese.eselon,kp.kategorypegawai as namakategorypegawai,pend.pendidikan,jk.jeniskelamin,
			                        gol.namaexternal||', '||gol.name as golongan,nkj.detailkelompokjabatan,nkj.grade,ks.kelompokshiftkerja,kdd.name as kedudukan,jp.jenispegawai"))
            ->where('pg.kdprofile', $kdProfile)
            ->where('pg.namalengkap', '<>','-')
            ->where('pg.namalengkap', '<>','Programmer Administrator')
            ->whereNull('pg.usereksternal')
            ->where('pg.statusenabled',true)
            // ->take(50)
            ->orderBy('pg.namalengkap');

        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $data = $data->where('pg.id','=',$request['idPegawai']);
        }
        $data = $data->get();
        return $this->respond($data);
    }

    public function getDaftarPegawaiInpassing (Request $request) {
        $kdProfile = (int) $this->getDataKdProfile($request);
        // $data = \DB::table('pegawai_m as pg')
        //     ->leftJoin('agama_m as ag','ag.id','=','pg.objectagamafk')
        //     ->leftJoin('detailkategorypegawai_m as dkp','dkp.id','=','pg.objectdetailkategorypegawaifk ')
        //     ->leftJoin('golongandarah_m as gd','gd.id','=', 'pg.objectgolongandarahfk')
        //     ->leftJoin('jabatan_m as jb','jb.id','=','pg.objectjabatanfungsionalfk')
        //     ->leftJoin('jenisjabatan_m as jj','jb.objectjenisjabatanfk','=','jj.id')
        //     ->leftJoin('jabatan_m as jb1','jb1.id', '=', 'pg.objectjabatanstrukturalfk')
        //     ->leftJoin('golonganpegawai_m as gp','gp.id','=', 'pg.objectgolonganpegawaifk')
        //     ->leftJoin('unitkerjapegawai_m as uk','uk.id','=','pg.objectunitkerjapegawaifk')
        //     ->leftJoin('statuspegawai_m as sp','sp.id','=','pg.objectstatuspegawaifk')
        //     ->leftJoin('kelompokjabatan_m as kj','kj.id','=','pg.objectkelompokjabatanfk')
        //     ->leftJoin('statusperkawinanpegawai_m as spp','spp.id','=','pg.objectstatusperkawinanpegawaifk')
        //     ->leftJoin('kategorypegawai_m as kp','kp.id','=','pg.kategorypegawai')
        //     ->leftJoin('eselon_m as ese','ese.id','=','pg.objecteselonfk')
        //     ->leftJoin('pendidikan_m as pend','pend.id', '=','pg.objectpendidikanterakhirfk')
        //     ->leftJoin('jeniskelamin_m as jk','jk.id','=','pg.objectjeniskelaminfk')
        //     ->leftJoin('sdm_golongan_m as gol','gol.id','=','pg.objectgolonganfk')
        //     ->leftJoin('nilaikelompokjabatan_m as nkj','nkj.id','=','pg.objectkelompokjabatanfk')
        //     ->leftJoin('sdm_kelompokshift_m as ks','ks.id','=','pg.objectshiftkerja')
        //     ->leftJoin('sdm_kedudukan_m as kdd','kdd.id','=','pg.kedudukanfk')
        //     ->leftJoin('jenispegawai_m as jp','jp.id','=','pg.objectjenispegawaifk')
        //     ->select(\DB::raw("jb.objectjenisjabatanfk, jj.jenisjabatan,pg.*,ag.agama,dkp.detailkategorypegawai,gd.golongandarah,jb.namajabatan as jbfungsional,
		// 	                        jb1.namajabatan as jbstruktural,gp.golonganpegawai,uk.name as unitkerja,sp.statuspegawai,
		// 	                        kj.namakelompokjabatan,spp.statusperkawinan,ese.eselon,kp.kategorypegawai as namakategorypegawai,pend.pendidikan,jk.jeniskelamin,
		// 	                        gol.namaexternal||', '||gol.name as golongan,nkj.detailkelompokjabatan,nkj.grade,ks.kelompokshiftkerja,kdd.name as kedudukan,jp.jenispegawai"))
        //     ->where('pg.kdprofile', $kdProfile)
        //     ->where('pg.namalengkap', '<>','-')
        //     ->where('pg.namalengkap', '<>','Programmer Administrator')
        //     ->whereNull('pg.usereksternal')
        //     ->where('pg.statusenabled',true)
        //     ->whereIN('kp.id',[1,23])
        //     // ->take(50)
        //     ->orderBy('pg.namalengkap');

        $data = DB::SELECT(DB::RAW("select rgi.* from riwayatgajiinpassing_t rgi
        left join pegawai_m p on rgi.idpeg = p.id
        left join kategorypegawai_m kp on kp.id = p.kategorypegawai
        where kp.id in (1,23) order by no
        "));

        // if(isset($request['kategoriPegawai']) && $request['kategoriPegawai']!="" && $request['kategoriPegawai']!="undefined"){
        //     // ('column', 'like', '%SearchString%')
        //     $data = $data->where('kp.kategorypegawai', 'ilike', '%'.$request['kategoriPegawai'].'%');
        // }

        // $data = $data->get();
        return $this->respond($data);
    }

    public function getDaftarABK (Request $request) {
        $kdProfile = (int) $this->getDataKdProfile($request);
        
        $data = DB::select(DB::raw("select a.kategorifk, b.subkategorifk, ppg.pendidikanpegawai, ppg.id, abt.kebutuhanl, abt.kekuranganl, abt.kebutuhanp, abt.kekuranganp
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
        and ppg.statusenabled = true
        order by ppg.nourut asc;"));
        
        return $this->respond($data);
    }

    public function updateDataIdFingerPrint(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        \DB::beginTransaction();
        $tglAyeuna = date('Y-m-d H:i:s');
        $dataLogin = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id',$dataLogin['userData']['id'])
            ->where('lu.kdprofile', $kdProfile)
            ->first();

        try {

            $Kel = Pegawai::where('id', $request['idpegawai'])
                ->where('kdprofile', $kdProfile)
                ->update([
                    'fingerprintid' => $request['idfinger'],
                ]);

            /*Logging User*/
            $newId = LoggingUser::max('id');
            $newId = $newId +1;
            $logUser = new LoggingUser();
            $logUser->id = $newId;
            $logUser->norec = $logUser->generateNewId();
            $logUser->kdprofile= $kdProfile;
            $logUser->statusenabled=true;
            $logUser->jenislog = 'Update Id Finger Print Pegawai';
            $logUser->noreff =$request['idpegawai'];
            $logUser->referensi='id pegawai';
            $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
            $logUser->tanggal = $tglAyeuna;
            $logUser->save();
            /*End Logging User*/

            $transStatus = true;
        } catch (\Exception $e) {
            $transStatus = false;
        }

        if ($transStatus) {
            $transMessage = 'Simpan Berhasil';
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'ea@epic',
            );
        } else {
            $transMessage = 'Simpan Gagal';
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDetailPegawai (Request $request) {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $statusenabled = true;
        if(isset($request['ispensiun'])){
            $statusenabled = false;
        }
        $data = \DB::table('pegawai_m as pg')
            ->leftJoin('agama_m as ag','ag.id','=','pg.objectagamafk')
            ->leftJoin('detailkategorypegawai_m as dkp','dkp.id','=','pg.objectdetailkategorypegawaifk ')
            ->leftJoin('golongandarah_m as gd','gd.id','=', 'pg.objectgolongandarahfk')
            ->leftJoin('jabatan_m as jb','jb.id','=','pg.objectjabatanfungsionalfk')
            ->leftJoin('jabatan_m as jbhehe','jbhehe.id','=','pg.objectjabataninternalfk')
            ->leftJoin('jabatan_m as jb1','jb1.id', '=', 'pg.objectjabatanstrukturalfk')
            ->leftJoin('golonganpegawai_m as gp','gp.id','=', 'pg.objectgolonganpegawaifk')
            ->leftJoin('unitkerjapegawai_m as uk','uk.id','=','pg.objectunitkerjapegawaifk')
            ->leftJoin('statuspegawai_m as sp','sp.id','=','pg.objectstatuspegawaifk')
            ->leftJoin('kelompokjabatan_m as kj','kj.id','=','pg.objectkelompokjabatanfk')
            ->leftJoin('statusperkawinanpegawai_m as spp','spp.id','=','pg.objectstatusperkawinanpegawaifk')
            ->leftJoin('eselon_m as ese','ese.id','=','pg.objecteselonfk')
            ->leftJoin('pendidikan_m as pend','pend.id', '=','pg.objectpendidikanterakhirfk')
            ->leftJoin('pendidikanpegawai_m as pendpg','pendpg.id', '=','pg.objectpendidikanpegawaifk')
            ->leftJoin('jeniskelamin_m as jk','jk.id','=','pg.objectjeniskelaminfk')
            ->leftJoin('sdm_golongan_m as gol','gol.id','=','pg.objectgolonganfk')
            ->leftJoin('nilaikelompokjabatan_m as nkj','nkj.id','=','pg.objectkelompokjabatanfk')
            ->leftJoin('sdm_kelompokshift_m as ks','ks.id','=','pg.objectshiftkerja')
            ->leftJoin('sdm_kedudukan_m as kdd','kdd.id','=','pg.kedudukanfk')
            ->leftJoin('kategorypegawai_m as kp','kp.id','=','pg.kategorypegawai')
            ->leftJoin('jenispegawai_m as jp','jp.id','=','pg.objectjenispegawaifk')
            ->leftJoin('sdm_golongan_m as golcpns','golcpns.id','=','pg.objectgolongancpnsfk')
            ->leftJoin('pendidikanpegawai_m as pddcpns','pddcpns.id','=','pg.objectpendidikancpnsfk')
            ->select(\DB::raw("pg.*,pddcpns.pendidikanpegawai as cpnspegawai,golcpns.level as levelcpns,golcpns.namaexternal || ', ' || golcpns.name as golongancpns,ag.agama,dkp.detailkategorypegawai,gd.golongandarah,jb.namajabatan as jbfungsional,
			                        jb1.namajabatan as jbstruktural,gp.golonganpegawai,uk.name as unitkerja,sp.statuspegawai,
			                        kj.namakelompokjabatan,spp.statusperkawinan,ese.eselon,pend.pendidikan,jk.jeniskelamin,
			                        gol.name as golongan,nkj.detailkelompokjabatan,nkj.grade,ks.kelompokshiftkerja,
			                        kp.kategorypegawai as namakategorypegawai,kdd.name as kedudukan,pg.objectjenispegawaifk,jp.jenispegawai, pendpg.pendidikanpegawai, pg.objectpendidikanpegawaifk, jbhehe.namajabatan"))
            ->where('pg.kdprofile', $kdProfile)
            ->where('pg.statusenabled',$statusenabled)
            ->orderBy('pg.namalengkap');

        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $data = $data->where('pg.id','=',$request['idPegawai']);
        }
        if(isset($request['ispensiun']) && $request['ispensiun']!="" && $request['ispensiun']!="undefined"){
            $data = $data->where('pg.ispensiun','=',$request['ispensiun']);
            // $data = $data->where('pg.statusenabled', $request['ispensiun']);
        }
        $data = $data->get();

        $dataKeluarga=\DB::table('keluargapegawai_m as kp')
            ->leftJoin('pegawai_m as pg','pg.id','=','kp.objectpegawaifk')
            ->leftJoin('jeniskelamin_m as jk','jk.id','=','kp.objectjeniskelaminfk')
            ->leftJoin('hubungankeluarga_m as hk','hk.id','=','kp.objectkdhubunganfk')
            ->leftJoin('statusperkawinanpegawai_m as spp','spp.id','=','kp.objectstatusperkawinanpegawaifk')
            ->leftJoin('pendidikan_m as pend','pend.id','=','kp.objectpendidikanterakhirfk')
            ->leftJoin('pekerjaan_m as pe','pe.id','=','kp.objectpekerjaanfk')
            ->select(DB::raw("kp.*,pg.namalengkap as namapegawai,jk.jeniskelamin,hk.reportdisplay as hubungankeluarga,
	                          spp.statusperkawinan,pend.pendidikan,pe.pekerjaan"))
            ->where('kp.kdprofile', $kdProfile)
            ->where('pg.statusenabled',true)
            ->orderBy('pg.namalengkap');

        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $dataKeluarga = $dataKeluarga->where('pg.id','=',$request['idPegawai']);
        }
        $dataKeluarga = $dataKeluarga->get();

        $dataPendidikan=\DB::table('riwayatpendidikan_t as rp')
            ->leftJoin('pegawai_m as pg','pg.id','=','rp.objectpegawaifk')
            ->leftJoin('pendidikan_m as pend','pend.id','=','rp.objectpendidikanfk')
            ->leftJoin('pendidikanpegawai_m as pendpg','pendpg.id','=','rp.objectpendidikanpegawaifk')
            ->select(DB::raw("rp.*,pend.pendidikan,pg.namalengkap, pendpg.pendidikanpegawai"))
            ->where('rp.kdprofile', $kdProfile)
            ->where('pg.statusenabled',true)
            ->orderBy('rp.tgllulus');

        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $dataPendidikan = $dataPendidikan->where('pg.id','=',$request['idPegawai']);
        }
        $dataPendidikan = $dataPendidikan->get();

        $dataPelatihan=\DB::table('riwayatpelatihan_t as rpl')
            ->leftJoin('pegawai_m as pg','pg.id','=','rpl.objectpegawaifk')
            ->join('unitpenginput_m as up','up.id','=','rpl.unitpenginputfk')
            ->join('jenispelatihan_m as jp','jp.id','=','rpl.jenispelatihanfk')
            ->join('sumberdana_m as sd','sd.id','=','rpl.sumberdanafk')
            ->leftjoin('namapelatihan_m as np','np.namapelatihan','=','rpl.namapelatihan')
            ->select(DB::raw("rpl.*,pg.namalengkap, up.unitpenginput, jp.jenispelatihan, sd.sumberdana, rpl.namapelatihan, np.id as id_np"))
            ->where('rpl.kdprofile', $kdProfile)
            ->where('pg.statusenabled',true)
            ->orderBy('rpl.tglmulai');

        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $dataPelatihan = $dataPelatihan->where('pg.id','=',$request['idPegawai']);
        }
        $dataPelatihan = $dataPelatihan->get();

        $dataJabatan=\DB::table('riwayatjabatan_t as rj')
            ->leftJoin('jenisjabatan_m as jb','jb.id','=','rj.objectjenisjabatanfk')
            ->leftJoin('jabatan_m as jab','jab.id','=','rj.objectjabatanttdfk')
            ->leftJoin('pegawai_m as pg','pg.id','=','rj.objectpegawaifk')
            ->leftJoin('pegawai_m as pg1','pg1.id','=','rj.objectpegawaittdfk')
            ->leftJoin('eselon_m as es','es.id','=','rj.eselon')
            
            ->select(DB::raw("rj.*,jb.jenisjabatan,jab.namajabatan as namajabatanttd,
			                  pg.namalengkap as namapegawai,pg1.namalengkap as pegawaittd,
			                  pg1.namalengkap || ' / ' || jab.namajabatan as pegawaipenanggungjawab, es.eselon as namaeselon"))
            ->where('pg.statusenabled',true)
            ->where('rj.kdprofile', $kdProfile)
            ->orderBy('rj.tglsk','desc');
        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $dataJabatan = $dataJabatan->where('pg.id','=',$request['idPegawai']);
        }
        $dataJabatan = $dataJabatan->get();

        $dataSip=\DB::table('masaberlakusipstr_t as mbs')
            ->leftJoin('jenismasaberlakustrsip_m as jmb','jmb.id','=','mbs.jenismasaberlakufk')
            ->leftJoin('pegawai_m as pg','pg.id','=','mbs.pegawaifk')
            ->leftJoin('unitkerjapegawai_m as uk','uk.id','=','mbs.unitkerjafk')
            ->leftJoin('unitkerjapegawai_m as uk2','uk2.id','=','mbs.subunitkerjafk')
            ->select(DB::raw("mbs.*,jmb.jenismasaberlaku, pg.namalengkap as namapegawai, uk.name as unitkerja,
			                  uk2.name as subunit"))
            ->where('mbs.kdprofile', $kdProfile)
            ->where('pg.statusenabled',true)
            ->where('mbs.jenismasaberlakufk',1)
            ->orderBy('mbs.tglberakhir');

        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $dataSip = $dataSip->where('pg.id','=',$request['idPegawai']);
        }
        $dataSip = $dataSip->get();

        $dataStr=\DB::table('masaberlakusipstr_t as mbs')
            ->leftJoin('jenismasaberlakustrsip_m as jmb','jmb.id','=','mbs.jenismasaberlakufk')
            ->leftJoin('pegawai_m as pg','pg.id','=','mbs.pegawaifk')
            ->leftJoin('unitkerjapegawai_m as uk','uk.id','=','mbs.unitkerjafk')
            ->leftJoin('unitkerjapegawai_m as uk2','uk2.id','=','mbs.subunitkerjafk')
            ->select(DB::raw("mbs.*,jmb.jenismasaberlaku, pg.namalengkap as namapegawai, uk.name as unitkerja,
			                  uk2.name as subunit"))
            ->where('pg.statusenabled',true)
            ->where('mbs.kdprofile', $kdProfile)
            ->where('mbs.jenismasaberlakufk',2)
            ->orderBy('mbs.tglberakhir');

        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $dataStr = $dataStr->where('pg.id','=',$request['idPegawai']);
        }
        $dataStr = $dataStr->get();

        $dataTelp=\DB::table('nomortelphone_t as nt')
            ->leftJoin('jenisprovider_m as jp','jp.id','=','nt.providerfk')
            ->leftJoin('pegawai_m as pg','pg.id','=','nt.pegawaifk')
            ->select(DB::raw("nt.*,jp.namaprovider"))
            ->where('nt.kdprofile', $kdProfile)
            ->where('nt.statusenabled',true);
//            ->orderBy('mbs.tglberakhir');

        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $dataTelp = $dataTelp->where('pg.id','=',$request['idPegawai']);
        }
        $dataTelp = $dataTelp->get();

        $dataLogin=\DB::table('riwayatjabatan_t as rj')
            ->leftJoin('jenisjabatan_m as jb','jb.id','=','rj.objectjenisjabatanfk')
            ->leftJoin('jabatan_m as jab','jab.id','=','rj.objectjabatanttdfk')
            ->leftJoin('pegawai_m as pg','pg.id','=','rj.objectpegawaifk')
            ->leftJoin('pegawai_m as pg1','pg1.id','=','rj.objectpegawaittdfk')
            ->select(DB::raw("rj.*,jb.jenisjabatan,jab.namajabatan as namajabatanttd,
			                  pg.namalengkap as namapegawai,pg1.namalengkap as pegawaittd,
			                  pg1.namalengkap || ' / ' || jab.namajabatan as pegawaipenanggungjawab"))
            ->where('rj.kdprofile', $kdProfile)
            ->where('pg.statusenabled',true)
            ->orderBy('rj.tglsk');

        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $dataLogin = $dataLogin->where('pg.id','=',$request['idPegawai']);
        }
        $dataLogin = $dataLogin->get();

        $dataGajiPlus = \DB::table('komponengajipegawai_t as kt')
            ->leftJoin('komponengaji_m as km','km.id','=','kt.objectkomponengajifk')
            ->leftJoin('pegawai_m as pg','pg.id','=','kt.objectpegawaifk')
            ->select('kt.*', 'km.kdkomponen','km.komponengaji','km.id as idkomponengaji')
            ->where('kt.kdprofile', $kdProfile)
            ->where('km.kdkomponen',"+")
            ->where('kt.statusenabled',true)
            ->orderBy('kt.tglaktif');

        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $dataGajiPlus = $dataGajiPlus->where('pg.id','=',$request['idPegawai']);
        }
        $dataGajiPlus = $dataGajiPlus->get();

        $dataGajiMinus = \DB::table('komponengajipegawai_t as kt')
            ->leftJoin('komponengaji_m as km','km.id','=','kt.objectkomponengajifk')
            ->leftJoin('pegawai_m as pg','pg.id','=','kt.objectpegawaifk')
            ->select('kt.*', 'km.kdkomponen','km.komponengaji','km.id as idkomponengaji')
            ->where('kt.kdprofile', $kdProfile)
            ->where('km.kdkomponen',"-")
            ->where('kt.statusenabled',true)
            ->orderBy('kt.tglaktif');

        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $dataGajiMinus = $dataGajiMinus->where('pg.id','=',$request['idPegawai']);
        }
        $dataGajiMinus = $dataGajiMinus->get();
        $dataHukumanDisiplin = \DB::table('sdm_hukumandisiplin_t as hd')
        ->join('jenishukuman_m as jh', 'jh.id','=','hd.objectjenishukumanfk')
        ->join('pegawai_m as pg', 'pg.id','=','hd.objectpegawaifk')
        ->select('hd.tgldari', 'hd.tglsampai', 'hd.tglsk','hd.nosk','hd.pejabatmenetapkan','jh.id','jh.jenishukuman','hd.norec','hd.objectjenishukumanfk')
        ->where('pg.id','=',$request['idPegawai'])
        ->get();

        $dataPangkatGolongan = \DB::select(DB::raw("SELECT gol.level, rg.pejabatpenandatangan, rg.masakerjagolongan,
            rg.nominal,rg.objectgolonganfk,rgb.tgltmt as tglawal, rg.norec,rg.tglsk::date, rg.tgltmt::date, gol.name, gol.namaexternal,gol.namaexternal || ', ' || gol.name as golongan, rg.nosk, rg.pejabatmenetapkan
            -- rg.nosk, rg.tglsk,gol.reportdisplay, rg.tgltmt,EXTRACT(year from age(rg.tgltmt,rgb.tgltmt)), age(rg.tgltmt,rgb.tgltmt), rgb.tgltmt as tglawal,rg.nominal 
            FROM riwayatgolongan_t rg 
            inner join sdm_golongan_m as gol on gol.id = rg.objectgolonganfk 
            inner join (
            select x.objectpegawaifk, x.tgltmt from(

            select row_number()over(PARTITION by rg.objectpegawaifk ORDER BY rg.tgltmt asc)as rn, rg.* from pegawai_m as pg inner join riwayatgolongan_t as rg on rg.objectpegawaifk = pg.id 
            )as x where x.rn=1
            )as rgb on rgb.objectpegawaifk= rg.objectpegawaifk where rg.objectpegawaifk = $request[idPegawai]
            ORDER BY rg.tgltmt desc
        "));

        
        $datacuti = \DB::table('riwayatcuti_t')->select("*")
        ->where("objectpegawaifk",$request['idPegawai'])
        ->get();

        $datacutiawal = \DB::table('planningpegawaistatus_t')->select("*")
        ->where("objectpegawaifk",$request['idPegawai'])
        ->get();

        $dataRiwayatGajiBerkala = \DB::table("riwayatgajiberkala_t as gb")
        // ->leftjoin("riwayatgolongan_t as rg","rg.objectpegawaifk","=","gb.id") 
        ->join("sdm_golongan_m as gol","gol.id","=","gb.objectgolonganfk")
        ->leftjoin("suratkeputusan_m as sk","sk.id","=","gb.objectsuratkeputusanfk")
        ->select(DB::raw("gol.level,sk.reportdisplay, gb.objectsuratkeputusanfk, sk.nosk as nosk2,gb.jenisskco,gb.tgltmtcetak, gb.tglskbaru,gb.masakerjagolongan,gb.jenissk, gb.nosurat, gb.noskcetak, gb.objectgolonganfk,gb.norec,gb.tglsk::date,gb.gajiawal, gb.gajiakhir, gb.tgltmt::date, gol.name, gol.namaexternal,gol.namaexternal || ', ' || gol.name as golongan, gb.nosk, gb.pejabatmenetapkan"))
        ->where("gb.objectpegawaifk",$request['idPegawai'])
        ->orderBy('gb.tgltmt','desc')
        ->get();
        $gajiBerkala = \DB::select(DB::raw("SELECT distinct gol.id, case when gol.ispppk = true then gol.name else gol.namaexternal || ',  ' ||  gol.name end as golongan, rg.nominal, gol.level FROM riwayatgolongan_t rg inner join sdm_golongan_m gol on gol.id = rg.objectgolonganfk
        where rg.objectpegawaifk = $request[idPegawai]
        "));
        $result = array(
            'datapegawai' => $data,
            'datakeluarga' => $dataKeluarga,
            'datapendidikan' => $dataPendidikan,
            'datapelatihan' => $dataPelatihan,
            'datajabatan' => $dataJabatan,
            'datasip'=> $dataSip,
            'datastr'=> $dataStr,
            'datatelp'=> $dataTelp,
            'datagajiplus'=> $dataGajiPlus,
            'datagajiminus'=> $dataGajiMinus,
            'datahukumandisiplin'=> $dataHukumanDisiplin,
            'datapangkatgolongan'=> $dataPangkatGolongan,
            'datacuti'=> $datacuti,
			'gajiBerkala'=> $gajiBerkala,
			'datacutiawal'=> $datacutiawal,
            'datagajiberkala'=> $dataRiwayatGajiBerkala,
            "createby : " => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function nominal(Request $request){
        $gajiawal = "";
        $cekgajiberkala = \DB::table('riwayatgajiberkala_t')
        ->where('objectpegawaifk', $request['pegawai'])
        ->where('objectgolonganfk', $request['golongan'])
        ->get();
        // var_dump($cekgajiberkala);
        if(empty($cekgajiberkala)){
            $gajiawal = \DB::table('riwayatgolongan_t')
            ->where('objectpegawaifk', $request['pegawai'])
            ->where('objectgolonganfk', $request['golongan'])
            ->select('nominal')
            ->get();
        } else{
            $gajiawal = \DB::table('pegawai_m')
            ->where('id', $request['pegawai'])
            ->select(DB::raw("gajiakhir as nominal"))
            ->get();
        }

        $gajigolongan = \DB::table("gajigolongan_m as gg")
        ->where("gg.golonganfk",$request['golongan'])
        ->where("gg.mkg",$request['mkg'])
        ->where("gg.objectsuratkeputusanfk",$request['sk'])
        ->get();
        
        $result = array(
            'gajigolongan'=> $gajigolongan,
            'cekgajiberkala'=> $cekgajiberkala,
            'gajiawal'=> $gajiawal,
            "createby : " => 'IziFizi',

        );
        return $this->respond($result);
    }
    //pangkat golongan sdm
    public function deleteDataPangkatGolongan(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        try {
            \DB::table('riwayatgolongan_t')->where('norec', $request['norec'])->where('kdprofile', $kdProfile)->delete();
            $transMessage = "Hapus Data Pangkat Golongan Sukses ";
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Hapus Data Pangkat Golongan Gagal";
        }

        if ($transStatus != 'false') {

            \DB::commit();
            $result = array(

                "status" => 201,
                "message" => $transMessage,
                "as" => 'fizi',
            );
        } else {
            DB::rollBack();
            $result = array(

                "status" => 400,
                "message" => $transMessage,
                "as" => 'fizi',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    //end pangkat golongan sdm


    //delete gaji berkala
     public function deleteDataGajiBerkala(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        try {
            $getgol = \DB::table("pegawai_m")->where("id", "=", $request['objectpegawaifk'])->get();
            foreach ($getgol as $gg) {
                if($request['objectgolonganfk'] == $gg->objectgolonganfk){
                    DB::table("pegawai_m")->where("id", $request['objectpegawaifk'])->update([
                    // 'objectgolonganfk'=> $request['objectgolonganfk'],
                    'gajiakhir'=> $request['gajiawal']
                    ]);
                }
            }
            $data = \DB::table('riwayatgajiberkala_t')->where('norec', $request['norec'])->where('kdprofile', $kdProfile)->delete();
            $transMessage = "Hapus Data Gaji Berkala Sukses ";
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Hapus Data Gaji Berkala Gagal";
        }

        if ($transStatus != 'false') {

            \DB::commit();
            $result = array(

                "status" => 201,
                "message" => $transMessage,
                "as" => 'fizi',
            );
        } else {
            DB::rollBack();
            $result = array(

                "status" => 400,
                "message" => $transMessage,
                "as" => 'fizi',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    //riwayat pelatihan
    public function deleteDataPelatihan(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        try {
            RiwayatPelatihan::where('norec', $request['norec'])->where('kdprofile', $kdProfile)->delete();
            $transMessage = "Sukses ";
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Hapus Data Pelatihan Gagal";
        }

        if ($transStatus != 'false') {

            \DB::commit();
            $result = array(

                "status" => 201,
                "message" => $transMessage,
                "as" => 'ridwan',
            );
        } else {
            DB::rollBack();
            $result = array(

                "status" => 400,
                "message" => $transMessage,
                "as" => 'ridwan',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveDataRekamDataPegawai (Request $request) {
        $kdProfile = (int) $this->getDataKdProfile($request);
        \DB::beginTransaction();
        $tglAyeuna = date('Y-m-d H:i:s');
//        $dataLogin = $request->all();
//        $dataPegawai = \DB::table('loginuser_s as lu')
//            ->select('lu.objectpegawaifk')
//            ->where('lu.id',$dataLogin['userData']['id'])
//            ->first();
        try{
            #region savePegawai
            $dataPegawai=$request['datapegawai'];
            $dataKeluargaPegawai=$request['datakeluarga'];
            $dataRiwayatPendidikan=$request['riwayatpendidikan'];
            $dataRiwayatPelatihan=$request['riwayatpelatihan'];
            $dataRIwayatJabatan=$request['riwayatjabatan'];
            $dataSip=$request['simpansip'];
            $dataStr=$request['simpanstr'];
            $dataTelp=$request['simpantelp'];
            $dataKomponenGajiAdd=$request['komponengajiadd'];
            $dataKomponenGajiDel=$request['komponengajidel'];
            $dataHukumanDisiplin= $request['hukumandisiplin'];
            $dataRiwayatPangkatGolongan = $request['pangkatgolongan'];
            $dataRiwayatcuti = $request['cuti'];
            $dataRiwayatGajiBerkala = $request['gajiberkala'];
            $nomor = sizeof($dataRiwayatPangkatGolongan) -1;
//            return $this->respond($dataKeluargaPegawai);


            if ($dataPegawai['id'] == '') {
                $idPegawai = Pegawai::max('id') + 1 ;
                $dataSavePegawai = new Pegawai();
                $dataSavePegawai->id = $idPegawai;
                $dataSavePegawai->kdprofile = $kdProfile;
                $dataSavePegawai->statusenabled=true;
                $dataSavePegawai->norec = $dataSavePegawai->generateNewId();
                $dataSavePegawai->qpegawai=0;
            }else{
                $dataSavePegawai = Pegawai::where('id', $dataPegawai['id'])->where('kdprofile', $kdProfile)->first();
            }
                        $dataSavePegawai->noidentitas = $dataPegawai['noidentitas'];
            $dataSavePegawai->nokarpeg = $dataPegawai['nokarpeg'];
            $dataSavePegawai->nobpjs = $dataPegawai['nobpjs'];
            $dataSavePegawai->taspen = $dataPegawai['taspen'];
            $dataSavePegawai->aktakelahiran = $dataPegawai['aktakelahiran'];
            $dataSavePegawai->email = $dataPegawai['email'];
            $dataSavePegawai->namalengkap = $dataPegawai['namalengkap'];
            $dataSavePegawai->nama = $dataPegawai['nama'];
            $dataSavePegawai->gelardepan = $dataPegawai['gelardepan'];
            $dataSavePegawai->gelarbelakang = $dataPegawai['gelarbelakang'];
            $dataSavePegawai->tempatlahir = $dataPegawai['tempatlahir'];
            $dataSavePegawai->bankrekeningnomor = $dataPegawai['nomorrekening'];
            $dataSavePegawai->bankrekeningatasnama = $dataPegawai['namarekening'];
            $dataSavePegawai->bankrekeningnama = $dataPegawai['namabank'];
            $dataSavePegawai->masakerjatambahan = $dataPegawai['masakerjatambahan'];
            $dataSavePegawai->noskmasakerjatambahan = $dataPegawai['noskmasakerjatambahan'];
            $dataSavePegawai->tglskmasakerjatambahan = $dataPegawai['tglskmasakerjatambahan'];
            // bank 2
            $dataSavePegawai->bankrekeningnomor2 = $dataPegawai['nomorrekening2'];
            $dataSavePegawai->bankrekeningatasnama2 = $dataPegawai['namarekening2'];
            $dataSavePegawai->bankrekeningnama2 = $dataPegawai['namabank2'];
            $dataSavePegawai->npwp = $dataPegawai['npwp'];
            if (isset($dataPegawai['kodepos'])){
                $dataSavePegawai->kodepos = $dataPegawai['kodepos'];
            }
            $dataSavePegawai->alamat = $dataPegawai['alamat'];
            $dataSavePegawai->idfinger = $dataPegawai['idfinger'];
            $dataSavePegawai->nippns = $dataPegawai['nippns'];
            $dataSavePegawai->pensiun =  $dataPegawai['pensiun'];
            $dataSavePegawai->tgllahir = $dataPegawai['tgllahir'];
            $dataSavePegawai->tglmasuk = $dataPegawai['tglmasuk'];
            $dataSavePegawai->objectagamafk = $dataPegawai['agama'];
            $dataSavePegawai->objectjeniskelaminfk= $dataPegawai['jeniskelamin'];
            $dataSavePegawai->kategorypegawai =  $dataPegawai['statuspegawai'];
            $dataSavePegawai->kedudukanfk=  $dataPegawai['kedudukan'];
            // $dataSavePegawai->objectgolonganfk=  $dataRiwayatPangkatGolongan[$nomor]['objectgolonganfk'];
            $dataSavePegawai->objectjabatanfungsionalfk= $dataPegawai['jabatan'];
            $dataSavePegawai->objectjabataninternalfk= $dataPegawai['jabatanhehe'];
            $dataSavePegawai->objectpendidikanterakhirfk=  $dataPegawai['pendidikan'];
            
            $dataSavePegawai->objectkelompokjabatanfk=  $dataPegawai['kelompokjabatan'];
            $dataSavePegawai->objectstatusperkawinanpegawaifk= $dataPegawai['statusperkawinan'];
            $dataSavePegawai->objecteselonfk=  $dataPegawai['eselon'];
            $dataSavePegawai->objectshiftkerja=  $dataPegawai['shiftkerja'];
            $dataSavePegawai->pensiun = $dataPegawai['pensiun'];
            $dataSavePegawai->nilaijabatan=  $dataPegawai['nilaijabatan'];
            $dataSavePegawai->grade = $dataPegawai['grade'];
            $dataSavePegawai->objectjenispegawaifk = $dataPegawai['jenispegawai'];
            $dataSavePegawai->objectunitkerjapegawaifk = $dataPegawai['unitkerjafk'];
            if (isset($dataPegawai['tglmeninggal']) && $dataPegawai['tglmeninggal'] != 'Invalid date'){
                $dataSavePegawai->tanggalmeninggal = $dataPegawai['tglmeninggal'];
            }
            if (isset($dataPegawai['tglpensiun']) && $dataPegawai['tglpensiun'] != 'Invalid date'){
                $dataSavePegawai->tglpensiun = $dataPegawai['tglpensiun'];
            }
            if (isset($dataPegawai['tglkeluar']) && $dataPegawai['tglkeluar'] != 'Invalid date'){
                $dataSavePegawai->tglkeluar = $dataPegawai['tglkeluar'];
            }
            $dataSavePegawai->save();

            $IdPegawais=$dataPegawai['id'];
            if ($IdPegawais == ""){
                $IdPegawais = $idPegawai;
            }

            // if ($dataKeluargaPegawai != ""){

            //     $dataSaveKeluarga = KeluargaPegawai::where('objectpegawaifk',$IdPegawais)
            //         ->where('kdprofile', $kdProfile)
            //         ->delete();

            //     foreach ($dataKeluargaPegawai as $item){

            //         $idKeluarga = KeluargaPegawai::max('id') + 1;
            //         $dataSaveKeluarga = new KeluargaPegawai();
            //         $dataSaveKeluarga->id = $idKeluarga;
            //         $dataSaveKeluarga->kdprofile = $kdProfile;
            //         $dataSaveKeluarga->statusenabled=true;
            //         $dataSaveKeluarga->norec = $dataSaveKeluarga->generateNewId();
            //         $dataSaveKeluarga->objectpegawaifk = $IdPegawais;

            //         $dataSaveKeluarga->alamat = $item['alamat'];
            //         $dataSaveKeluarga->objectjeniskelaminfk = $item['objectjeniskelaminfk'];
            //         $dataSaveKeluarga->keterangan = $item['keterangan'];
            //         $dataSaveKeluarga->namaayah = $item['namaayah'];
            //         $dataSaveKeluarga->namaibu = $item['namaibu'];
            //         $dataSaveKeluarga->namalengkap = $item['namalengkap'];
            //         $dataSaveKeluarga->nipistrisuami = $item['nipistrisuami'];
            //         $dataSaveKeluarga->nosuratkuliah = $item['nosuratkuliah'];
            //         $dataSaveKeluarga->objectkdhubunganfk = $item['objectkdhubunganfk'];
            //         $dataSaveKeluarga->objectpekerjaanfk = $item['objectpekerjaanfk'];
            //         $dataSaveKeluarga->objectstatusperkawinanpegawaifk = $item['objectstatusperkawinanpegawaifk'];
            //         $dataSaveKeluarga->statustanggungan = $item['statustanggungan'];
            //         $dataSaveKeluarga->tgllahir = $item['tgllahir'];
            //         if (isset($item['tglsuratkuliah']) && $item['tglsuratkuliah'] != 'Invalid date'){
            //             $dataSaveKeluarga->tglsuratkuliah = $item['tglsuratkuliah'];
            //         }
            //         $dataSaveKeluarga->statustanggunganfk = $item['statustanggunganfk'];
            //         $dataSaveKeluarga->objectpendidikanterakhirfk = $item['objectpendidikanterakhirfk'];
            //         $dataSaveKeluarga->save();
            //     }
            // }

            // if ($dataRiwayatPendidikan != ""){
            //     foreach ($dataRiwayatPendidikan as $items){
            //         if ($items['norec'] == ""){
            //             $dataSavePendidikan = new RiwayatPendidikan();
            //             $dataSavePendidikan->kdprofile = $kdProfile;
            //             $dataSavePendidikan->statusenabled=true;
            //             $dataSavePendidikan->norec = $dataSavePendidikan->generateNewId();
            //             $dataSavePendidikan->objectpegawaifk = $IdPegawais;
            //         }else{
            //             $dataSavePendidikan = RiwayatPendidikan::where('norec', $items['norec'])
            //                 ->where('kdprofile', $kdProfile)
            //                 ->where('objectpegawaifk',$IdPegawais)
            //                 ->first();
            //         }
            //         $dataSavePendidikan->namatempatpendidikan = $items['namatempatpendidikan'];
            //         $dataSavePendidikan->alamattempatpendidikan = $items['alamattempatpendidikan'];
            //         $dataSavePegawai->objectpendidikanpegawaifk =$items['objectpendidikanpegawaifk'];
            //         $dataSavePendidikan->objectpendidikanpegawaifk =$items['objectpendidikanpegawaifk'];
            //         $dataSavePendidikan->jurusan = $items['jurusan'];
            //         $dataSavePendidikan->tglmasuk = $items['tglmasuk'];
            //         $dataSavePendidikan->tgllulus = $items['tgllulus'];
            //         $dataSavePendidikan->nilaiipk = $items['nilaiipk'];
            //         $dataSavePendidikan->noijazah = $items['noijazah'];
            //         if (isset($items['tglijazah'])){
            //             $dataSavePendidikan->tglijazah = $items['tglijazah'];
            //         }
            //         $dataSavePendidikan->save();
            //         $dataSavePegawai->save();
            //     }
            // }

            // if ($dataRiwayatPelatihan != ""){
            //     foreach ($dataRiwayatPelatihan as $itempend){
            //         if ($itempend['norec'] == ""){
            //             $dataSavePelatihan = new RiwayatPelatihan();
            //             $dataSavePelatihan->kdprofile = $kdProfile;
            //             $dataSavePelatihan->statusenabled=true;
            //             $dataSavePelatihan->norec = $dataSavePelatihan->generateNewId();
            //             $dataSavePelatihan->objectpegawaifk = $IdPegawais;
            //         }else{
            //             $dataSavePelatihan = RiwayatPelatihan::where('norec', $itempend['norec'])
            //                 ->where('kdprofile', $kdProfile)
            //                 ->where('objectpegawaifk',$IdPegawais)
            //                 ->first();
            //         }
            //         $dataSavePelatihan->instansipenyelenggara = $itempend['instansipenyelenggara'];
            //         $dataSavePelatihan->namapelatihan = $itempend['namapelatihan'];
            //         $dataSavePelatihan->lokasipelatihan =$itempend['lokasipelatihan'];
            //         $dataSavePelatihan->tglmulai = $itempend['tglmulai'];
            //         $dataSavePelatihan->tglakhir = $itempend['tglakhir'];
            //         $dataSavePelatihan->durasi = $itempend['durasi'];
            //         $dataSavePelatihan->unitpenginputfk = $itempend['unitpenginputfk'];
            //         $dataSavePelatihan->jenispelatihanfk = $itempend['jenispelatihanfk'];
            //         $dataSavePelatihan->penyelenggara = $itempend['penyelenggara'];
            //         $dataSavePelatihan->biayadiklat = $itempend['biayadiklat'];
            //         $dataSavePelatihan->biayasppd = $itempend['biayasppd'];
            //         $dataSavePelatihan->sumberdanafk = $itempend['sumberdanafk'];

            //         if (isset($itempend['nosertifikat'])){
            //             $dataSavePelatihan->nosertifikat = $itempend['nosertifikat'];
            //         }
            //         if (isset($itempend['keterangan'])){
            //             $dataSavePelatihan->keterangan = $itempend['keterangan'];
            //         }
            //         $dataSavePelatihan->save();
            //     }
            // }

            // if ($dataRIwayatJabatan != ""){
            //     foreach ($dataRIwayatJabatan as $hideung){
            //         if ($hideung['norec'] == ""){
            //             $dataSaveJabatan = new RiwayatJabatan();
            //             $dataSaveJabatan->kdprofile = $kdProfile;
            //             $dataSaveJabatan->statusenabled=true;
            //             $dataSaveJabatan->norec = $dataSaveJabatan->generateNewId();
            //             $dataSaveJabatan->objectpegawaifk = $IdPegawais;
            //         }else{
            //             $dataSaveJabatan = RiwayatJabatan::where('norec', $hideung['norec'])
            //                 ->where('kdprofile', $kdProfile)
            //                 ->where('objectpegawaifk',$IdPegawais)
            //                 ->first();
            //         }
            //         $dataSaveJabatan->objectjenisjabatanfk = $hideung['objectjenisjabatanfk'];
            //         $dataSaveJabatan->objectjabatanfk = $hideung['objectjabatanfk'];
            //         $dataSaveJabatan->namajabatan =$hideung['namajabatan'];
            //         $dataSaveJabatan->nosk = $hideung['nosk'];
            //         $dataSaveJabatan->tglsk = $hideung['tglsk'];
            //         $dataSaveJabatan->ttdsk = $hideung['ttdsk'];
            //         $dataSaveJabatan->tunjangan = $hideung['tunjangan'];
            //         // $dataSaveJabatan->tunjangan = $hideung['tunjangan'];
            //         $dataSaveJabatan->ttdjabatansk = $hideung['ttdjabatansk'];
            //         // $dataSaveJabatan->objectjabatanttdfk = $hideung['objectjabatanttdfk'];
            //         $dataSaveJabatan->save();
            //     }
            // }

            if ($dataSip != ""){
                foreach ($dataSip as $hideungs){
                    if ($hideungs['norec'] == ""){
                        $dataSaveSip = new MasaBerlakuSipStr();
                        $dataSaveSip->kdprofile = $kdProfile;
                        $dataSaveSip->statusenabled=true;
                        $dataSaveSip->jenismasaberlakufk=1;
                        $dataSaveSip->norec = $dataSaveSip->generateNewId();
                        $dataSaveSip->pegawaifk = $IdPegawais;
                    }else{
                        $dataSaveSip = MasaBerlakuSipStr::where('norec', $hideungs['norec'])
                            ->where('kdprofile', $kdProfile)
                            ->where('pegawaifk',$IdPegawais)
                            ->first();
                    }
                    $dataSaveSip->unitkerjafk = $hideungs['unitkerjafk'];
                    $dataSaveSip->subunitkerjafk = $hideungs['subunitkerjafk'];
                    $dataSaveSip->nomor =$hideungs['nomor'];
                    $dataSaveSip->tglberakhir = $hideungs['tglberakhir'];
                    $dataSaveSip->save();
                }
            }

            if ($dataStr != ""){
                foreach ($dataStr as $hideungx){
                    if ($hideungx['norec'] == ""){
                        $dataSaveStr = new MasaBerlakuSipStr();
                        $dataSaveStr->kdprofile = $kdProfile;
                        $dataSaveStr->statusenabled=true;
                        $dataSaveStr->jenismasaberlakufk=2;
                        $dataSaveStr->norec = $dataSaveStr->generateNewId();
                        $dataSaveStr->pegawaifk = $IdPegawais;
                    }else{
                        $dataSaveStr = MasaBerlakuSipStr::where('norec', $hideungx['norec'])
                            ->where('kdprofile', $kdProfile)
                            ->where('pegawaifk',$IdPegawais)
                            ->first();
                    }
                    $dataSaveStr->unitkerjafk = $hideungx['unitkerjafk'];
                    $dataSaveStr->subunitkerjafk = $hideungx['subunitkerjafk'];
                    $dataSaveStr->nomor =$hideungx['nomor'];
                    $dataSaveStr->tglberakhir = $hideungx['tglberakhir'];
                    $dataSaveStr->save();
                }
            }

            if ($dataTelp != ""){
                foreach ($dataTelp as $hideungtelp){
                    if ($hideungtelp['norec'] == ""){
                        $dataSaveTelp = new NomorTelphonePegawai();
                        $dataSaveTelp->kdprofile = $kdProfile;
                        $dataSaveTelp->statusenabled=true;
                        $dataSaveTelp->norec = $dataSaveTelp->generateNewId();
                        $dataSaveTelp->pegawaifk = $IdPegawais;
                    }else{
                        $dataSaveTelp = NomorTelphonePegawai::where('norec', $hideungtelp['norec'])
                            ->where('kdprofile', $kdProfile)
                            ->where('pegawaifk',$IdPegawais)
                            ->first();
                    }
                    $dataSaveTelp->nomor = $hideungtelp['noTelp'];
                    $dataSaveTelp->providerfk = $hideungtelp['providerfk'];
                    $dataSaveTelp->save();
                }
            }

            // if ($dataKomponenGajiAdd != ""){
            //     foreach ($dataKomponenGajiAdd as $hideungadd){
            //         if ($hideungadd['norec'] == ""){
            //             $dataKomponenGajiAdd = new KomponenGajiPegawai();
            //             $dataKomponenGajiAdd->kdprofile = $kdProfile;
            //             $dataKomponenGajiAdd->statusenabled=true;
            //             $dataKomponenGajiAdd->norec = $dataKomponenGajiAdd->generateNewId();
            //             $dataKomponenGajiAdd->objectpegawaifk = $IdPegawais;
            //         }else{
            //             $dataKomponenGajiAdd = KomponenGajiPegawai::where('norec', $hideungadd['norec'])
            //                 ->where('kdprofile', $kdProfile)
            //                 ->where('objectpegawaifk',$IdPegawais)
            //                 ->first();
            //         }
            //         $dataKomponenGajiAdd->isaktif = $hideungadd['isaktif'];
            //         $dataKomponenGajiAdd->tglaktif = $hideungadd['tglaktif'];
            //         $dataKomponenGajiAdd->objectkomponengajifk = $hideungadd['idkomponengaji'];
            //         $dataKomponenGajiAdd->save();
            //     }
            // }

            // if ($dataKomponenGajiDel != ""){
            //     foreach ($dataKomponenGajiDel as $hideungdel){
            //         if ($hideungdel['norec'] == ""){
            //             $dataKomponenGajiDel = new KomponenGajiPegawai();
            //             $dataKomponenGajiDel->kdprofile = $kdProfile;
            //             $dataKomponenGajiDel->statusenabled=true;
            //             $dataKomponenGajiDel->norec = $dataKomponenGajiDel->generateNewId();
            //             $dataKomponenGajiDel->objectpegawaifk = $IdPegawais;
            //         }else{
            //             $dataKomponenGajiDel = KomponenGajiPegawai::where('norec', $hideungdel['norec'])
            //                 ->where('kdprofile', $kdProfile)
            //                 ->where('objectpegawaifk',$IdPegawais)
            //                 ->first();
            //         }
            //         $dataKomponenGajiDel->isaktif = $hideungdel['isaktif'];
            //         $dataKomponenGajiDel->tglaktif = $hideungdel['tglaktif'];
            //         $dataKomponenGajiDel->objectkomponengajifk = $hideungdel['idkomponengaji'];
            //         $dataKomponenGajiDel->save();
            //     }
            // }
            // if ($dataHukumanDisiplin != "") {
            //     foreach ($dataHukumanDisiplin as $hudis) {
            //         if ($hudis['norec'] == "") {
            //             $dahudis = \DB::table('sdm_hukumandisiplin_t')
            //             ->insert([
            //                 'norec' => substr(Uuid::generate(), 0, 32),
            //                 'kdprofile'=> $kdProfile,
            //                 'statusenabled'=> true,
            //                 'objectjenishukumanfk'=> $hudis['objectjenishukumanfk'],
            //                 'tgldari'=>$hudis['tgldari'],
            //                 'tglsampai'=>$hudis['tglsampai'],
            //                 'pejabatmenetapkan'=> $hudis['pejabatmenetapkan'],
            //                 'objectpegawaifk'=> $IdPegawais,
            //                 'tglsk'=> $hudis['tglsk'],
            //                 'nosk'=> $hudis['nosk'],
            //             ]);
            //         } else {
            //             $dahudis = \DB::table('sdm_hukumandisiplin_t')
            //             ->where('norec', $hudis['norec'])
            //             ->where('kdprofile', $kdProfile)
            //             ->where('objectpegawaifk', $IdPegawais)
            //             ->update([
            //                 'statusenabled'=> true,
            //                 'objectjenishukumanfk'=> $hudis['objectjenishukumanfk'],
            //                 'tgldari'=>$hudis['tgldari'],
            //                 'tglsampai'=>$hudis['tglsampai'],
            //                 'pejabatmenetapkan'=> $hudis['pejabatmenetapkan'],
            //                 'tglsk'=> $hudis['tglsk'],
            //                 'nosk'=> $hudis['nosk'],
            //             ]);
            //         }
                    
            //     }
            // }

            // if ($dataRiwayatcuti != "") {
            //     foreach ($dataRiwayatcuti as $ct) {
            //         if ($ct['norec'] == "") {
            //             \DB::table("riwayatcuti_t")
            //             ->insert([
            //                 'norec' => substr(Uuid::generate(), 0, 32),
            //                 'kdprofile'=> $kdProfile,
            //                 'statusenabled'=> true,
            //                 'objectpegawaifk'=> $IdPegawais,
            //                 'tgldari'=>$ct['tgldari'],
            //                 'tglsampai'=>$ct['tglsampai'],
            //                 'tglsk'=> $ct['tglsk'],
            //                 'nosk'=> $ct['nosk'],
            //                 'pejabatmenetapkan'=> $ct['pejabatmenetapkan'],
            //             ]);
                        
            //         } else {
            //             \DB::table("riwayatcuti_t")
            //             ->where('norec', $ct['norec'])
            //             ->where('kdprofile', $kdProfile)
            //             ->where('objectpegawaifk', $IdPegawais)
            //             ->update([
            //                 'kdprofile'=> $kdProfile,
            //                 'statusenabled'=> true,
            //                 'objectpegawaifk'=> $IdPegawais,
            //                 'tgldari'=>$ct['tgldari'],
            //                 'tglsampai'=>$ct['tglsampai'],
            //                 'tglsk'=> $ct['tglsk'],
            //                 'nosk'=> $ct['nosk'],
            //                 'pejabatmenetapkan'=> $ct['pejabatmenetapkan'],
            //             ]);
            //         }
                    
            //     }
            // }

            

            //## Logging User
//                if ($dataPegawai['id'] == ""){
//                    $newId = LoggingUser::max('id');
//                    $newId = $newId +1;
//                    $logUser = new LoggingUser();
//                    $logUser->id = $newId;
//                    $logUser->norec = $logUser->generateNewId();
//                    $logUser->kdprofile= 0;
//                    $logUser->statusenabled=true;
//                    $logUser->jenislog = 'Tambah Master Pegawai';
//                    $logUser->noreff =$dataSavePegawai->id;
//                    $logUser->referensi='norec Verifikasi Direktur Terkait';
//                    $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
//                    $logUser->tanggal = $tglAyeuna;
//                    $logUser->save();
//                }else{
//                    $newId = LoggingUser::max('id');
//                    $newId = $newId +1;
//                    $logUser = new LoggingUser();
//                    $logUser->id = $newId;
//                    $logUser->norec = $logUser->generateNewId();
//                    $logUser->kdprofile= 0;
//                    $logUser->statusenabled=true;
//                    $logUser->jenislog = 'Edit Master Pegawai';
//                    $logUser->noreff =$dataSavePegawai->id;
//                    $logUser->referensi='norec Verifikasi Direktur Terkait';
//                    $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
//                    $logUser->tanggal = $tglAyeuna;
//                    $logUser->save();
//                }

            #endregion

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Gagal";
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'ea@epic',
            );
        } else {
            $transMessage = "Simpan Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "error" => $e->getMessage().' '.$e->getLine(),
                'p'=>$dataSavePegawai,
                "as" => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDataDaftarUrutKepangkatan (Request $request) {
        $kdProfile = (int) $this->getDataKdProfile($request);

        $idpegawai = '';
        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $idpegawai = ' and pg.id = '.$request['idPegawai'];
        }

        $idgolongan = '';
        if(isset($request['idGolongan']) && $request['idGolongan']!="" && $request['idGolongan']!="undefined"){
            $idgolongan = ' and pg.objectgolonganfk = '.$request['idGolongan'];
        }

        $data = DB::select(DB::raw("select *, row_number() over(order by idgolongan asc, masakerjakeseluruhan desc, tgllahir asc) as nourut
        from(
            select pg.nippns, pg.id as pegawaiid,pg.namalengkap,sg.name as golongan, sg.id idgolongan, a.jumlahriwayatgolongan, b.jumlahmasakerjatambahan, c.jumlahcuti, coalesce(a.jumlahriwayatgolongan, 0) + coalesce(b.jumlahmasakerjatambahan, 0) - coalesce(c.jumlahcuti, 0) || ' hari' as masakerjakeseluruhan,pg.tgllahir, 
            (coalesce(a.jumlahriwayatgolongan, 0) + coalesce(b.jumlahmasakerjatambahan, 0) - coalesce(c.jumlahcuti, 0))::integer/365 || ' tahun ' || (coalesce(a.jumlahriwayatgolongan, 0) + coalesce(b.jumlahmasakerjatambahan, 0) - coalesce(c.jumlahcuti, 0))::integer % 365 / 30 || ' bulan ' || 
            (coalesce(a.jumlahriwayatgolongan, 0) + coalesce(b.jumlahmasakerjatambahan, 0) - coalesce(c.jumlahcuti, 0))::integer % 365 % 30 || ' hari' as day
            from pegawai_m as pg
            left join sdm_golongan_m as sg on sg.id = pg.objectgolonganfk
            inner join(
                select distinct on(pg.id,pg.namalengkap) pg.id pegawaiid,pg.namalengkap, rg.tgltmt, DATE_PART('day', now()::timestamp - rg.tgltmt::timestamp) as jumlahriwayatgolongan
                from pegawai_m as pg
                left join riwayatgolongan_t rg on rg.objectpegawaifk = pg.id
                where pg.statusenabled = true
                and pg.kdprofile= 30
                order by pg.namalengkap,pg.id,rg.tgltmt asc
            ) a on pg.id = a.pegawaiid
            inner join(
                select pg.id pegawaiid, pg.namalengkap, split_part(pg.masakerjatambahan, '-', 1)::integer, split_part(pg.masakerjatambahan, '-', 1)::integer*365 as jumlahmasakerjatambahan
                from pegawai_m pg
                order by jumlahmasakerjatambahan
            ) b on pg.id = b.pegawaiid
            inner join(
                select pegawaiid, namalengkap, sum(jumlahcuti) jumlahcuti
                from(
                    select pg.id pegawaiid,pg.namalengkap, rc.tgldari, rc.tglsampai, DATE_PART('day', rc.tglsampai::timestamp - rc.tgldari::timestamp) as jumlahcuti
                    from pegawai_m as pg
                    left join riwayatcuti_t rc on rc.objectpegawaifk = pg.id
                    where pg.statusenabled = true
                    and pg.kdprofile= 30
                    order by jumlahcuti
                ) as x
                group by pegawaiid, namalengkap
                order by jumlahcuti
            ) as c on pg.id = c.pegawaiid
            where pg.statusenabled = true
            and pg.kdprofile= 30
            $idpegawai
            $idgolongan
            order by sg.id asc, masakerjakeseluruhan desc, tgllahir asc
        ) as z;"));

        
        $result = array(
            'data'  => $data,
            'as' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getDataJadwalKerjaRuangan (Request $request) {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $data = \DB::table('pegawaijadwalkerja_m as pjk')
            ->leftJoin('pegawai_m as pg','pg.id','=','pjk.objectpegawaifk')
            ->leftJoin('ruangan_m as ru','ru.id','=','pjk.objectruanganfk')
            ->leftJoin('shiftkerja_m as sf','sf.id','=','pjk.objectshiftfk')
            ->leftJoin('kalender_s as kln','kln.id','=','pjk.objecttanggalfk')
            ->select(\DB::raw("pjk.*,pg.namalengkap,ru.namaruangan,sf.namashift,sf.jammasuk,sf.jampulang,kln.reportdisplay"))
            ->where('pg.statusenabled',true)
            ->where('pg.kdprofile',$kdProfile);

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pjk.tgljadwal', '>=', $request['tglAwal']);
        }

        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];//." 23:59:59";
            $data = $data->where('pjk.tgljadwal', '<=', $tgl);
        }

        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $data = $data->where('pjk.objectpegawaifk','=',$request['idPegawai']);
        }

        if(isset($request['idRuangan']) && $request['idRuangan']!="" && $request['idRuangan']!="undefined"){
            $data = $data->where('pjk.objectruanganfk','=',$request['idRuangan']);
        }

        $data = $data->orderBy('pg.namalengkap');
        $data = $data->get();
        $result = array(
            'data'  => $data,
            'as' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getDataSip (Request $request) {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $data = \DB::table('masaberlakusipstr_t as mbs')
            ->leftJoin('jenismasaberlakustrsip_m as jmb','jmb.id','=','mbs.jenismasaberlakufk')
            ->leftJoin('pegawai_m as pg','pg.id','=','mbs.pegawaifk')
            ->leftJoin('unitkerjapegawai_m as uk','uk.id','=','pg.objectunitkerjapegawaifk')
            ->leftJoin('unitkerjapegawai_m as uk2','uk2.id','=','mbs.subunitkerjafk')
            ->select(\DB::raw("mbs.*,jmb.jenismasaberlaku, pg.namalengkap as namapegawai,pg.nip_pns as nipPns, uk.name as unitkerja,
			                  uk2.name as subunit"))
            ->where('pg.statusenabled',true)
            ->where('mbs.kdprofile', $kdProfile)
//            ->where('mbs.jenismasaberlakufk',1)
            ->orderBy('mbs.berakhirstr','asc');

//        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
//            $data = $data->where('pjk.tgljadwal', '>=', $request['tglAwal']);
//        }
//
//        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
//            $tgl = $request['tglAkhir'];//." 23:59:59";
//            $data = $data->where('pjk.tgljadwal', '<=', $tgl);
//        }
//
//        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
//            $data = $data->where('pjk.objectpegawaifk','=',$request['idPegawai']);
//        }

        $data = $data->get();
        $result = array(
            'data'  => $data,
            'as' => 'ridwan',
        );
        return $this->respond($result);
    }

    public function getDataStr (Request $request) {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $data = \DB::table('masaberlakusipstr_t as mbs')
            ->leftJoin('jenismasaberlakustrsip_m as jmb','jmb.id','=','mbs.jenismasaberlakufk')
            ->leftJoin('pegawai_m as pg','pg.id','=','mbs.pegawaifk')
            ->leftJoin('unitkerjapegawai_m as uk','uk.id','=','mbs.unitkerjafk')
            ->leftJoin('unitkerjapegawai_m as uk2','uk2.id','=','mbs.subunitkerjafk')
            ->select(\DB::raw("mbs.*,jmb.jenismasaberlaku, pg.namalengkap as namapegawai,pg.nip_pns as nipPns, uk.name as unitkerja,
			                  uk2.name as subunit"))
            ->where('mbs.kdprofile', $kdProfile)
            ->where('pg.statusenabled',true)
            ->where('mbs.jenismasaberlakufk',2)
            ->orderBy('mbs.tglberakhir');

//        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
//            $data = $data->where('pjk.tgljadwal', '>=', $request['tglAwal']);
//        }
//
//        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
//            $tgl = $request['tglAkhir'];//." 23:59:59";
//            $data = $data->where('pjk.tgljadwal', '<=', $tgl);
//        }
//
//        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
//            $data = $data->where('pjk.objectpegawaifk','=',$request['idPegawai']);
//        }

        $data = $data->get();
        $result = array(
            'data'  => $data,
            'as' => 'ridwan',
        );
        return $this->respond($result);
    }

    public function simpanSipStr(Request $request){
         \DB::beginTransaction();
        $kdProfile = (int) $this->getDataKdProfile($request);
        try {
            if (empty($request['norec']) || $request['norec'] == ""){
                $dataSaveSipStr = new MasaBerlakuSipStr();
                $dataSaveSipStr->kdprofile = $kdProfile;
                $dataSaveSipStr->statusenabled=true;
                $dataSaveSipStr->norec = $dataSaveSipStr->generateNewId();

            }else{
                $dataSaveSipStr = MasaBerlakuSipStr::where('norec', $request['norec'])
                    ->where('kdprofile',$kdProfile)
                    ->where('pegawaifk',$request['idPegawai'])
                    ->first();
            }

//            if ($request['jenismasaberlakufk'] == 1){
//                $filename = 'SIP-'.$request['idPegawai'].'.'.$extension;
//            }elseif ($request['jenismasaberlakufk'] == 2) {
//                $filename = 'STR-'.$request['idPegawai'].'.'.$extension;
//            }
//
//            Storage::disk('local')->put('SDM/FileSipStr/'.$filename,file_get_contents($request->file('file')));
//            // $path = $uploadedFile->move('photos',$filename);
//
//            $dataSaveSipStr->pegawaifk=$request['idPegawai'];
//            $dataSaveSipStr->jenismasaberlakufk=$request['jenismasaberlakufk'];
//            $dataSaveSipStr->nomor =$request['nomorSurat'];
//            $dataSaveSipStr->tglberakhir = $request['tglBerakhir'];
//            $dataSaveSipStr->namafileupload = $filename;

            $uploadedFileSip = $request->file('filesip');
            $uploadedFileStr = $request->file('filestr');
            $pegawai = Pegawai::where('id',$request['idPegawai'])->first();
            if(!empty($uploadedFileSip)){
                $extensionSip = $uploadedFileSip->getClientOriginalExtension();
                $filenameSip = 'SIP-'.$pegawai->namalengkap.'.'.$extensionSip;
                
//                Storage::disk('local')->put('SDM/FileSipStr/'.$filenameSip,file_get_contents($request->file('filesip')));
                $dataSaveSipStr->namafilesip = $filenameSip;
            }
            if(!empty($uploadedFileStr)){
                $extensionStr = $uploadedFileStr->getClientOriginalExtension();
                $filenameStr = 'STR-' .$pegawai->namalengkap . '.' . $extensionStr;
//                Storage::disk('local')->put('SDM/FileSipStr/'.$filenameStr,file_get_contents($request->file('filestr')));
                $dataSaveSipStr->namafilestr =$filenameStr;
            }

            $dataSaveSipStr->pegawaifk=$request['idPegawai'];
            $dataSaveSipStr->nosip=$request['nomorsip'];
            $dataSaveSipStr->terbitsip =$request['terbitsip'];
            $dataSaveSipStr->berakhirsip = $request['berakhirsip'];
            $dataSaveSipStr->nostr = $request['nomorstr'];
            $dataSaveSipStr->terbitstr = $request['terbitstr'];
            $dataSaveSipStr->berakhirstr = $request['berakhirstr'];
            $dataSaveSipStr->save();
            // return $request['nomorsip'];
            $update= Pegawai::where('id',trim($request['idPegawai']))
                ->update([
                    'nosip' => $request['nomorsip'],
                    'nostr' => $request['nomorstr']
                ]);

            $norec =  $dataSaveSipStr->norec ;
            if(!empty($uploadedFileSip)) {
                $request->file('filesip')->move('SDM/FileSipStr/'.$norec,
                    $filenameSip);
            }
            if(!empty($uploadedFileStr)) {
                $request->file('filestr')->move('SDM/FileSipStr/'.$norec,
                    $filenameStr);
            }


            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus = 'true') {
            $transMessage = "Sukses ";
            \DB::commit();
            $result = array(
                "status" => 201,
                "norec" => $dataSaveSipStr,
                "as" => 'ridwan',
                "by" => 'er@epic',
            );
        } else {
            $transMessage = "Simpan Sip/Str Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'ridwan',
                "by" => 'er@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function createZipSipStr(Request $request){

        $zip_file = $request['name'].'.zip';
        $zip = new \ZipArchive();
        $zip->open($zip_file, \ZipArchive::CREATE | \ZipArchive::OVERWRITE);

        $path = public_path('SDM/FileSipStr'.'/'.$request['norec']);
        $files = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($path));

        foreach ($files as $name => $file)
        {
            // We're skipping all subfolders
            if (!$file->isDir()) {
                $filePath     = $file->getRealPath();

                // extracting filename with substr/strlen
                $relativePath =  substr($filePath, strlen($path) + 1);

                $zip->addFile($filePath, $relativePath);
            }
        }

        $zip->close();

        return response()->download($zip_file);
    }
    public function deleteDataSipStr(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        try {
            $filename = $request['namafile'];
            $path = public_path('SDM/FileSipStr/'.$request['norec'].'/');

            if (!\File::exists($path)) {
//                abort(404);
            }else{
                $file = \File::deleteDirectory($path);
            }


            Storage::disk('local')->delete('SDM/FileSipStr/'.$filename);
            $get = MasaBerlakuSipStr::where('norec', $request['norec'])->where('kdprofile', $kdProfile)->first();

              $update= Pegawai::where('id',$get->objectpegawaifk)
                ->update([
                    'nosip' => null,
                    'nostr' =>null
                ]);

             MasaBerlakuSipStr::where('norec', $request['norec'])->where('kdprofile', $kdProfile)->delete();
            $transMessage = "Sukses ";
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Hapus Data Sip/Str Gagal";
        }

        if ($transStatus != 'false') {

            \DB::commit();
            $result = array(

                "status" => 201,
                "message" => $transMessage,
                "as" => 'ridwan',
                "by" => 'er@epic',
            );
        } else {
            DB::rollBack();
            $result = array(

                "status" => 400,
                "message" => $transMessage,
                "as" => 'ridwan',
                "by" => 'er@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getPegawaiSudahPensiun (Request $request) {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $data = \DB::table('pegawai_m as pg')
            ->leftJoin('agama_m as ag','ag.id','=','pg.objectagamafk')
            ->leftJoin('golonganpegawai_m as gp','gp.id','=', 'pg.objectgolonganpegawaifk')
            ->leftJoin('unitkerjapegawai_m as uk','uk.id','=','pg.objectunitkerjafk')
            ->leftJoin('unitkerjapegawai_m as uk2','uk2.id','=','pg.objectsubunitkerjapegawaifk')
            ->leftJoin('sdm_golongan_m as gol','gol.id','=','pg.objectgolonganfk')
//            ->select(DB::raw("pg.id,pg.namalengkap, pg.nippns,pg.tgllahir, pg.pensiun, pg.tglpensiun,pg.objectgolonganfk,
//                    gp.golonganpegawai,uk.name as unitkerja, uk2.name as subunit"))
            ->select(\DB::raw("pg.*,gp.golonganpegawai,uk.name as unitkerja, uk2.name as subunit"))
            ->where('pg.kdprofile', $kdProfile)
            ->where('pg.statusenabled',false)
            ->where('pg.ispensiun',true)
            ->orderBy('pg.namalengkap');

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pg.tglpensiun', '>=', $request['tglAwal']);
        }

        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $data = $data->where('pg.tglpensiun', '<=', $request['tglAkhir']);
        }
//
        if(isset($request['namaPeg']) && $request['namaPeg']!="" && $request['namaPeg']!="undefined"){
            $data = $data->where('pg.namalengkap','ilike','%'.$request['namaPeg'].'%');
        }

        $data = $data->get();
        $result = array(
            'data'  => $data,
            'as' => 'ridwan',
        );
        return $this->respond($result);
    }

    public function getPegawaiPensiun (Request $request) {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $data = \DB::table('pegawai_m as pg')
            ->leftJoin('agama_m as ag','ag.id','=','pg.objectagamafk')
            ->leftJoin('golonganpegawai_m as gp','gp.id','=', 'pg.objectgolonganpegawaifk')
            ->leftJoin('unitkerjapegawai_m as uk','uk.id','=','pg.objectunitkerjafk')
            ->leftJoin('unitkerjapegawai_m as uk2','uk2.id','=','pg.objectsubunitkerjapegawaifk')
            ->leftJoin('sdm_golongan_m as gol','gol.id','=','pg.objectgolonganfk')
//            ->select(DB::raw("pg.id,pg.namalengkap, pg.nippns,pg.tgllahir, pg.pensiun, pg.tglpensiun,pg.objectgolonganfk,
//                    gp.golonganpegawai,uk.name as unitkerja, uk2.name as subunit"))
            ->select(\DB::raw("pg.*,gp.golonganpegawai,uk.name as unitkerja, uk2.name as subunit"))
            ->where('pg.kdprofile', $kdProfile)
            ->where('pg.statusenabled',true)
            ->where('pg.namalengkap','NOT ILIKE', '-')
            ->where('pg.usereksternal',null)
            ->orderBy('pg.tglpensiun','asc')
            ->orderBy('pg.namalengkap', 'asc')
            ;

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pg.tglpensiun', '>=', $request['tglAwal']);
        }

        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $data = $data->where('pg.tglpensiun', '<=', $request['tglAkhir']);
        }
//
        if(isset($request['namaPeg']) && $request['namaPeg']!="" && $request['namaPeg']!="undefined"){
            $data = $data->where('pg.namalengkap','ilike','%'.$request['namaPeg'].'%');
        }

        $data = $data->get();
        $result = array(
            'data'  => $data,
            'as' => 'ridwan',
        );
        return $this->respond($result);
    }

    public function updateDataPegawaiFormPensiun (Request $request) {
        $kdProfile = (int) $this->getDataKdProfile($request);
        \DB::beginTransaction();
        try{
            #region savePegawaiFormPensiun

//            $dataPegawai=$request['datapegawai'];
            $updatePegFormPensiun = Pegawai::where('id', $request['id'])->where('kdprofile', $kdProfile)->first();
            $updatePegFormPensiun->nippns = $request['nippns'];
            $updatePegFormPensiun->nip_pns = $request['nip_pns'];
            $updatePegFormPensiun->pensiun =  $request['pensiun'];
            $updatePegFormPensiun->objectunitkerjapegawaifk =  $request['objectunitkerjapegawaifk'];
            $updatePegFormPensiun->objectunitkerjafk =  $request['objectunitkerjafk'];
            $updatePegFormPensiun->objectsubunitkerjapegawaifk =  $request['objectsubunitkerjapegawaifk'];
            $updatePegFormPensiun->tgllahir = $request['tgllahir'];
            $updatePegFormPensiun->objectgolonganfk=  $request['objectgolonganfk'];
            $updatePegFormPensiun->objectgolonganpegawaifk=  $request['objectgolonganpegawaifk'];
            $updatePegFormPensiun->tglpensiun = $request['tglpensiun'];

            $updatePegFormPensiun->save();

            #endregion savePegawaiFormPensiun
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Gagal";
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "datapegawai" => $updatePegFormPensiun,
                "as" => 'ridwan',
            );
        } else {
            $transMessage = "Simpan Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "datapegawai" => $updatePegFormPensiun,
                "as" => 'ridwan',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getComboPensiun(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $dataLogin = $request->all();
        $UnitKerja = UnitKerjaPegawai::where('statusenabled',true)->where('kdprofile', $kdProfile)->get();
        $SubUnitKerja = SubUnitKerja::where('statusenabled',true)->where('kdprofile', $kdProfile)->get();
        $GolonganPegawai = GolonganPegawai::where('statusenabled', true)->where('kdprofile', $kdProfile)->get();

        $DataUnitkerja=[];
        foreach ($UnitKerja as $item) {
            $detail = [];
            foreach ($SubUnitKerja as $item2) {
                if ($item->id == $item2->objectunitkerjapegawaifk) {
                    $detail[] = array(
                        'id' => $item2->id,
                        'name' => $item2->name,
                    );
                }
            }

            $DataUnitkerja[] = array(
                'id' => $item->id,
                'name' => $item->name,
                'subunit' => $detail,
            );
        }
        $result = array(
            'datalogin'=> $dataLogin,
            'dataunitkerja' => $DataUnitkerja,
            'unitkerjapegawai' => $UnitKerja,
            'subunitkerja' => $SubUnitKerja,
            'golonganpegawai' => $GolonganPegawai,
            'by' => 'ridwan',
        );

        return $this->respond($result);
    }

    public function SavePensiunPegawai (Request $request) {
        $kdProfile = (int) $this->getDataKdProfile($request);
        \DB::beginTransaction();
        try{
            #region savePegawaiFormPensiun

//            $dataPegawai=$request['datapegawai'];
            $pensiunkanPegawai = Pegawai::where('id', $request['id'])->where('kdprofile', $kdProfile)->first();
            $pensiunkanPegawai->statusenabled = $request['statusenabled'];
            $pensiunkanPegawai->ispensiun = $request['ispensiun'];

            $pensiunkanPegawai->save();

            #endregion savePegawaiFormPensiun
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Gagal";
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "datapegawai" => $pensiunkanPegawai,
                "as" => 'ridwan',
            );
        } else {
            $transMessage = "Simpan Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "datapegawai" => $pensiunkanPegawai,
                "as" => 'ridwan',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveJadwalBulananPegawai(Request $request) {
        $kdProfile = (int) $this->getDataKdProfile($request);
        \DB::beginTransaction();
        try {
            foreach ($request['data'] as $item) {
                if ($request['id'] == '') {
                    $id = PegawaiJadwalKerja::max('id');
                    $dataJadwal = new PegawaiJadwalKerja();
                    $dataJadwal->id = $id + 1;
                    $dataJadwal->norec = $dataJadwal->generateNewId();
                    $dataJadwal->kdprofile = $kdProfile;
                    $dataJadwal->statusenabled = true;

                } else {
                    $dataJadwal = PegawaiJadwalKerja::where('id', $request['id'])->where('kdprofile', $kdProfile)->first();
                }

                $dataJadwal->objectpegawaifk = $item['idpegawai'];
//                $dataJadwal->objectruanganfk = $request['ruanganfk'];
                $dataJadwal->objectunitkerjapegawaifk = $request['ruanganfk'];
                $dataJadwal->objectshiftfk = $request['shiftkerja'];
                $dataJadwal->tgljadwal = $item['tglmulai'];
                $dataJadwal->jammulai = $request['jammulai'];
                $dataJadwal->jamselesai = $request['jamselesai'];
                $dataJadwal->keteranganalasan = $request['keterangan'];
//                $dataJadwal->objectstatushadirfk = 1;//hadir $request['objectstatushadirfk'];
                $dataJadwal->save();
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Jadwal Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "res" => $dataJadwal,
                "as" => 'ramdanegie@epic',
            );
        } else {
            $transMessage = "Simpan Jadwal Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'ramdanegie@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getJadwalBulananPegawai(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $data = \DB::table('pegawaijadwalkerja_m AS pjk')
            ->join('pegawai_m as pg','pg.id','=','pjk.objectpegawaifk')
            ->leftjoin('ruangan_m as ru','ru.id','=','pjk.objectruanganfk')
            ->join('unitkerjapegawai_m as uk','uk.id','=','pjk.objectunitkerjapegawaifk')
            ->select('pjk.*','pg.namalengkap','ru.namaruangan','uk.name as unitkerja')
            ->where('pjk.kdprofile', $kdProfile)
            ->where('pjk.statusenabled', true)
            ->orderByRaw('pg.namalengkap,pjk.tgljadwal desc');


        if(isset($request['bulan']) &&
            $request['bulan']!="" &&
            $request['bulan']!="undefined"){
            $tgl = $request['bulan']  ;
            $data = $data->whereRaw("STUFF(CONVERT(varchar(10), pjk.tgljadwal,104),1,3,'')  ='$tgl' " );
        };
        if(isset($request['namalengkap']) &&
            $request['namalengkap']!="" &&
            $request['namalengkap']!="undefined"){
            $data = $data->where('pg.namalengkap','ilike','%'. $request['namalengkap'] .'%' );
        };
        if(isset($request['idRuangan']) &&
            $request['idRuangan']!="" &&
            $request['idRuangan']!="undefined"){
            $data = $data->where('uk.id','=', $request['idRuangan'] );
        };
        if(isset($request['idPegawai']) &&
            $request['idPegawai']!="" &&
            $request['idPegawai']!="undefined"){
            $idPegawai =$request['idPegawai'];
            $data = $data->whereRaw("pg.id in ( $idPegawai )");
        };

        $data = $data->get();
        return $this->respond($data);
    }

    public function hapusJadwalBulananPegawai(Request $request) {
        $kdProfile = (int) $this->getDataKdProfile($request);
        \DB::beginTransaction();
        try {
            foreach ($request['data'] as $item) {

                $dataJadwal = PegawaiJadwalKerja::where('id', $item['id'])
                    ->where('kdprofile', $kdProfile)
                    ->update(
                    [ 'statusenabled' => false ]
                );

            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Hapus Jadwal Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "res" => $dataJadwal,
                "as" => 'ramdanegie@epic',
            );
        } else {
            $transMessage = "Hapus Jadwal Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'ramdanegie@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getComboPegawaiJadwal(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
//        $kdJenisPegawaiDokter = $this->settingDataFixed('kdJenisPegawaiDokter');
        $req = $request->all();
        $data = \DB::table('pegawai_m')
            ->select('id','namalengkap')
            ->where('statusenabled', true)
            ->where('kdprofile', $kdProfile)
//            ->where('objectjenispegawaifk',$kdJenisPegawaiDokter)
            ->orderBy('namalengkap');

        if(isset($req['namalengkap']) &&
            $req['namalengkap']!="" &&
            $req['namalengkap']!="undefined"){
            $data = $data->where('namalengkap','ilike','%'. $req['namalengkap'] .'%' );
        };
        if(isset($req['idpegawai']) &&
            $req['idpegawai']!="" &&
            $req['idpegawai']!="undefined"){
            $data = $data->where('id', $req['idpegawai'] );
        };
        if(isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value']!="" &&
            $req['filter']['filters'][0]['value']!="undefined"){
            $data = $data
                ->where('namalengkap','ilike','%'.$req['filter']['filters'][0]['value'].'%' );
        }

//        $data = $data->take(10);
        $data = $data->get();

        return $this->respond($data);
    }

    public function getMonitoringAbsensiPegawai (Request $request) {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $data = \DB::table('pegawai_m as pg')
            ->Join('sdm_absensipegawai_t as abn','abn.pegawaifk','=','pg.id')
            ->select(\DB::raw("abn.pegawaifk,pg.namalengkap,abn.jammasuk,abn.jamkeluar,'-' as namaruangan"))
            ->where('pg.kdprofile', $kdProfile)
            ->where('pg.statusenabled',true)
            ->where('abn.statusenabled',true);

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('abn.jammasuk', '>=', $request['tglAwal']);
        }

        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];//." 23:59:59";
            $data = $data->where('abn.jammasuk', '<=', $tgl);
        }

        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $data = $data->where('pg.id','=',$request['idPegawai']);
        }
        if(isset($request['norec']) && $request['norec']!="" && $request['norec']!="undefined"){
            $data = $data->where('abn.norec','=',$request['norec']);
        }

        $data = $data->orderBy('pg.namalengkap');
        $data = $data->get();
        $result = array(
            'data'  => $data,
            'as' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function deleteDataKeluarga(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        try {
            KeluargaPegawai::where('id',$request['id'])->where('kdprofile', $kdProfile)->delete();
            $transMessage = "Sukses ";
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Hapus Data Keluarga Gagal";
        }

        if ($transStatus != 'false') {

            \DB::commit();
            $result = array(

                "status" => 201,
                "message" => $transMessage,
                "as" => 'ridwan',
            );
        } else {
            DB::rollBack();
            $result = array(

                "status" => 400,
                "message" => $transMessage,
                "as" => 'ridwan',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function deleteDataHukumanDisiplin(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        try {
            \DB::table('sdm_hukumandisiplin_t')->where('norec',$request['norec'])->where('kdprofile', $kdProfile)->delete();
            $transMessage = "Sukses ";
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Hapus Data Hukuman Disiplin Gagal";
        }
        if ($transStatus != 'false') {
            \DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'ridwan',
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "as" => 'ridwan',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function deleteDataCuti(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        try {
            \DB::table('riwayatcuti_t')->where('norec',$request['norec'])->where('kdprofile', $kdProfile)->delete();
            $transMessage = "Hapus Data Cuti Diluar Tanggungan Sukses";
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Hapus Data Cuti Diluar Tanggungan Gagal";
        }
        if ($transStatus != 'false') {
            \DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'fizi',
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "as" => 'fizi',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function deleteTotalCuti(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        try {
            \DB::table('planningpegawaistatus_t')->where('norec',$request['norec'])->where('kdprofile', $kdProfile)->delete();
            $transMessage = "Hapus Data Total Cuti Sukses";
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Hapus Data Total Cuti Gagal";
        }
        if ($transStatus != 'false') {
            \DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'epic',
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "as" => 'epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDataKeluarga (Request $request) {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $dataKeluarga=\DB::table('keluargapegawai_m as kp')
            ->leftJoin('pegawai_m as pg','pg.id','=','kp.objectpegawaifk')
            ->leftJoin('jeniskelamin_m as jk','jk.id','=','kp.objectjeniskelaminfk')
            ->leftJoin('hubungankeluarga_m as hk','hk.id','=','kp.objectkdhubunganfk')
            ->leftJoin('statusperkawinanpegawai_m as spp','spp.id','=','kp.objectstatusperkawinanpegawaifk')
            ->leftJoin('pendidikan_m as pend','pend.id','=','kp.objectpendidikanterakhirfk')
            ->leftJoin('pekerjaan_m as pe','pe.id','=','kp.objectpekerjaanfk')
            ->select(\DB::raw("kp.*,pg.namalengkap as namapegawai,jk.jeniskelamin,hk.reportdisplay as hubungankeluarga,
	                          spp.statusperkawinan,pend.pendidikan,pe.pekerjaan"))
            ->where('kp.kdprofile', $kdProfile)
            ->where('pg.statusenabled',true)
            ->orderBy('pg.namalengkap');

        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $dataKeluarga = $dataKeluarga->where('pg.id','=',$request['idPegawai']);
        }
        $dataKeluarga = $dataKeluarga->get();

        $result = array(
            'data'  => $dataKeluarga,
            'as' => 'ridwan',
        );
        return $this->respond($result);
    }

    public function saveDataKeluarga (Request $request) {
        $kdProfile = (int) $this->getDataKdProfile($request);
        \DB::beginTransaction();
        try{
            #region savePegawaiFormKeluarga

            $dataKeluargaPegawai=$request['datakeluarga'];
            $IdPegawais=$request['idPegawai'];

            if ($dataKeluargaPegawai != ""){
                foreach ($dataKeluargaPegawai as $item){
                    if ($item['id'] == ""){
                        $idKeluarga = KeluargaPegawai::max('id') + 1;
                        $dataSaveKeluarga = new KeluargaPegawai();
                        $dataSaveKeluarga->id = $idKeluarga;
                        $dataSaveKeluarga->kdprofile = $kdProfile;
                        $dataSaveKeluarga->statusenabled=true;
                        $dataSaveKeluarga->norec = $dataSaveKeluarga->generateNewId();
                        $dataSaveKeluarga->objectpegawaifk = $IdPegawais;
                    }else{
                        $dataSaveKeluarga = KeluargaPegawai::where('id', $item['id'])
                            ->where('kdprofile', $kdProfile)
                            ->where('objectpegawaifk',$IdPegawais)
                            ->first();
                    }
                    $dataSaveKeluarga->alamat = $item['alamat'];
                    $dataSaveKeluarga->objectjeniskelaminfk = $item['objectjeniskelaminfk'];
                    $dataSaveKeluarga->keterangan = $item['keterangan'];
                    $dataSaveKeluarga->namaayah = $item['namaayah'];
                    $dataSaveKeluarga->namaibu = $item['namaibu'];
                    $dataSaveKeluarga->namalengkap = $item['namalengkap'];
                    $dataSaveKeluarga->nipistrisuami = $item['nipistrisuami'];
                    $dataSaveKeluarga->nosuratkuliah = $item['nosuratkuliah'];
                    $dataSaveKeluarga->objectkdhubunganfk = $item['objectkdhubunganfk'];
                    $dataSaveKeluarga->objectpekerjaanfk = $item['objectpekerjaanfk'];
                    $dataSaveKeluarga->objectstatusperkawinanpegawaifk = $item['objectstatusperkawinanpegawaifk'];
                    $dataSaveKeluarga->statustanggungan = $item['statustanggungan'];
                    $dataSaveKeluarga->tgllahir = $item['tgllahir'];
                    if (isset($item['tglsuratkuliah']) && $item['tglsuratkuliah'] != 'Invalid date'){
                        $dataSaveKeluarga->tglsuratkuliah = $item['tglsuratkuliah'];
                    }
                    $dataSaveKeluarga->statustanggunganfk = $item['statustanggunganfk'];
                    $dataSaveKeluarga->objectpendidikanterakhirfk = $item['objectpendidikanterakhirfk'];
                    $dataSaveKeluarga->save();
                }
            }

            #endregion savePegawaiFormPensiun
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Gagal";
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "datapegawai" => $dataSaveKeluarga,
                "as" => 'ridwan',
            );
        } else {
            $transMessage = "Simpan Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "datapegawai" => $dataSaveKeluarga,
                "as" => 'ridwan',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDaftarDiklatKategory(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $data = DiklatKategory::get();

        $result = array(
            'data' => $data,
            'by' => 'asepic',
        );
        return $result;
    }

    public function saveDiklatKategory(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        try{
            $newId = DiklatKategory::max('id') +1 ;
            if ($request['id'] == ''){
                $TP = new DiklatKategory();
                $TP->id = $newId;
                $TP->kdprofile = $kdProfile;
                $TP->norec = $TP->generateNewId();
            }else{
                $TP = DiklatKategory::where('id', $request['id'])->first();
            }
            $TP->statusenabled =  $request['statusenabled'];
            $TP->kodeexternal = $newId;
            $TP->reportdisplay = $request['diklatkategori'];
            $TP->diklatkategori = $request['diklatkategori'];
            $TP->kddiklatkategori = $newId;
            $TP->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Diklat Kategory";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $TP,
                'as' => 'asepic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'asepic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDaftarDiklatJurusan(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $data = DiklatJurusan::get();

        $result = array(
            'data' => $data,
            'by' => 'asepic',
        );
        return $result;
    }
    public function saveDiklatJurusan(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        try{
            $newId = DiklatJurusan::max('id') +1 ;
            if ($request['id'] == ''){
                $TP = new DiklatJurusan();
                $TP->id = $newId;
                $TP->kdprofile = $kdProfile;
                $TP->norec = $TP->generateNewId();
            }else{
                $TP = DiklatJurusan::where('id', $request['id'])->where('kdprofile', $kdProfile)->first();
            }
            $TP->statusenabled =  $request['statusenabled'];
            $TP->kodeexternal = $newId;
            $TP->reportdisplay = $request['diklatkategori'];
            $TP->diklatjurusan = $request['diklatkategori'];
            $TP->kddiklatjurusan = $newId;
            $TP->qtysksmin = 0;
            $TP->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }


        if ($transStatus == 'true') {
            $transMessage = "Simpan Diklat Jurusan";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $TP,
                'as' => 'asepic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'asepic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDataComboMapKategoriPendidikanToProgramPendidikan(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $data1 = DiklatJurusan::where('kdprofile',$kdProfile)->get();
        // $data2 = Pendidikan::get();
        $data2 = DB::select(DB::raw("select * from diklatkategori_m
                where kdprofile = $kdProfile and statusenabled=true"));
        $data3 = JurusanPeminatan::where('kdprofile',$kdProfile)->get();

        $result = array(
            'data1' => $data1,
            'data2' => $data2,
            'data3' => $data3,
            'by' => 'asepic',
        );
        return $result;
    }
    public function getDataComboPesertaDidik(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $dataJenisKelamin = DB::select(DB::raw("select * from jeniskelamin_m
                where kdprofile = $kdProfile and statusenabled=true")
        );
        $dataAgama = DB::select(DB::raw("select * from agama_m
                where kdprofile = $kdProfile and statusenabled=true")
        );
        $dataInstitusipPendidikan = DB::select(DB::raw("select * from sdm_institusipendidikan_m
                where kdprofile = $kdProfile and statusenabled=true")
        );
        $dataJurusan = DB::select(DB::raw("select * from sdm_jurusanpeminatan_m
                where kdprofile = $kdProfile and statusenabled=true")
        );
        $datafakultas = DB::select(DB::raw("select * from sdm_fakultas_m
                where kdprofile = $kdProfile and statusenabled=true")
        );

        $result = array(
            'dataJenisKelamin' => $dataJenisKelamin,
            'dataAgama' => $dataAgama,
            'dataInstitusipPendidikan' => $dataInstitusipPendidikan,
            'dataJurusan' => $dataJurusan,
            'datafakultas' => $datafakultas,
            'by' => 'asepic',
        );
        return $result;
    }
    public function getDaftarPesertaDidik(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $nama = '';
        if ($request['nama'] != ''){
            $nama = " and a.nama ilike '%" . $request['nama'] . "%'";
        }
        $insts ='';
        if ($request['institusipendidikanfk'] != ''){
            $insts = ' and a.institusipendidikanfk = ' . $request['institusipendidikanfk'];
        }

        $data = DB::select(DB::raw("select a.*,ag.agama,jk.jeniskelamin,sins.institusipendidikan,sjur.jurusanpeminatan,sfak.fakultas ,
            a.tempatlahir || ', ' || to_char(a.tanggallahir,'yyyy-MM-dd')  as ttl
            from sdm_pesertadidik_t as a
            INNER JOIN agama_m as ag on a.agamafk=ag.id
            INNER JOIN jeniskelamin_m as jk on jk.id=a.jeniskelaminfk
            left JOIN sdm_institusipendidikan_m as sins on sins.id=a.institusipendidikanfk
            left JOIN sdm_jurusanpeminatan_m as sjur on sjur.id=a.jurusanpeminatanfk
            left JOIN sdm_fakultas_m as sfak on sfak.id=a.fakultasfk
            where a.kdprofile = $kdProfile and  a.statusenabled=true $nama $insts")
        );
        $result = array(
            'data' => $data,
            'by' => 'asepic',
        );
        return $result;
    }
    public function savePesertaDidik(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $dataLogin = $request->all();
        $data = '';
        try{
            
            $TP = new PesertaDidik();
            $TP->kdprofile = $kdProfile;
            $TP->norec = $TP->generateNewId();
            $TP->statusenabled =  true;
            $TP->jeniskelaminfk = $request['jeniskelaminfk'];
            $TP->noregistrasifk = $request['noregistrasifk'];
            $TP->nama = $request['nama'];
            $TP->nim = $request['nim'];
            $TP->nomorhp = $request['nomorhp'];
            $TP->email = $request['email'];
            $TP->image = $request['image'];
            $TP->save();

            $uploadimage = $request->file('image');
            if($request['image']!='noimage'){
                $TPimg = PesertaDidik::where('norec', $TP->norec)->first();
                $extensionimage = $uploadimage->getClientOriginalExtension();
                $filenameImage = 'DIKLAT-'.$request['nama'] .'_'.$TP->norec.'.'.$extensionimage;
                $TPimg->image = $filenameImage;
                $TPimg->save();
            }
            //## Logging User
            $newId = LoggingUser::max('id');
            $newId = $newId +1;
            $logUser = new LoggingUser();
            $logUser->id = $newId;
            $logUser->norec = $logUser->generateNewId();
            $logUser->kdprofile= $kdProfile;
            $logUser->statusenabled=true;
            $logUser->jenislog = "Mahasiswa Eksternal";
            $logUser->keterangan = "Simpan Mahasiswa Eksternal". " Nama: ". $request['nama']. " NIM: ". $request['nim']. " Email: " . $request['email'];
            $logUser->noreff = $TP->norec;
            $logUser->referensi="Mahasiswa Eksternal";
            $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
            $logUser->tanggal = date('Y-m-d H:i:s');
            $logUser->save();

            if(!empty($uploadimage)) {
                $request->file('image')->move('img/DIKLAT/FileFoto/'.$request['email'],$filenameImage);
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $errMessage = $e->getMessage();
            $errLine = $e->getLine();
        }


        if ($transStatus == 'true') {
            $transMessage = "Simpan Peserta Didik" ;
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'asepic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'e'=> $errLine,
                "message"=> $errMessage,
                'as' => 'asepic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

        // $result = array(
        //         'status' => 400,
        //         // 'message'  => $TP,
        //         'as' => 'asepic',
        //     );
        // return $this->respond($result);
    }

    public function savePesertaDidikRuangan(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        try{
            

            if ($request['norec'] == ''){
                $PDR = \DB::table('sdm_pdruangan_t')->insert([
                    'kdprofile' => $kdProfile,
                    'norec' => substr(Uuid::generate(), 0, 32),
                    'noregistrasifk' => $request['noregistrasifk'],
                    'objectruanganlastfk' => $request['objectruanganlastfk'],
                    // 'objectruanganasalfk' => $request['objectruanganasalfk'],
                    'objectpegawaifk' => $request['objectpegawaifk'],
                    'statusenabled' => true,
                    'tglmasuk' => $request['tglmasuk'],
                    'tglkeluar' => $request['tglkeluar']
                ]);

                $PDRU = DB::table('sdm_pesertadidik_t')->where('norec', $request['norec_pdruangan'])->where('kdprofile', $kdProfile)->update([
                    'objectruanganlastfk' => $request['objectruanganlastfk'],
                    'objectpegawailastfk' => $request['objectpegawaifk'],
                ]);

            }
            // else{
            //     $TP = \DB::table('sdm_pdruangan_t')->where('norec', $request['norec'])->where('kdprofile', $kdProfile)->update([
            //         'kdprofile' => $kdProfile,
            //         'noregistrasifk' => $request['noregistrasifk'],
            //         'objectruanganlastfk' => $request['objectruanganlastfk'],
            //         'objectruanganasalfk' => $request['objectruanganasalfk'],
            //         'objectpegawaifk' => $request['objectpegawaifk'],
            //         'statusenabled' => true,
            //         'tglmasuk' => $request['tglmasuk'],
            //     ]);
            // }
            if ($request['norec'] != '' && isset($request['norec'])) {
                $TP = \DB::table('sdm_pdruangan_t')->where('norec', $request['norec'])->where('kdprofile', $kdProfile)->delete();
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        if ($transStatus == 'true') {
            $transMessage = "Simpan Ruangan Peserta Didik";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                // 'data' => $data,
                'as' => 'asepic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                // 'data'  => $data,
                'as' => 'asepic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

        // $result = array(
        //         'status' => 400,
        //         'message'  => $PDR,
        //         'as' => 'asepic',
        //     );
        // return $this->respond($result);
    }

    public function updatePesertaDidik(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $dataLogin = $request->all();
        DB::beginTransaction();
        
        $data = '';
        try{
            $TP = PesertaDidik::where('norec', $request['norec'])->where('kdprofile', $kdProfile)->first();
            $TP->statusenabled =  true;
            $TP->jeniskelaminfk = $request['jeniskelaminfk'];
            $TP->noregistrasifk = $request['noregistrasifk'];
            $TP->nama = $request['nama'];
            $TP->nim = $request['nim'];
            $TP->nomorhp = $request['nomorhp'];
            $TP->email = $request['email'];
            $TP->image = $request['image'];
            $uploadimage = $request->file('image');
            if($request['image']!='noimage'){
                $extensionimage = $uploadimage->getClientOriginalExtension();
                $filenameImage = 'DIKLAT-'.$request['nama'] .'-'.$request['norec'].'.'.$extensionimage;
                
                $TP->image = $filenameImage;
            }else{
                $TP->image = null;
                $filename = $request['image'];
                $path = public_path('img/DIKLAT/FileFoto/'.$request['email'].'/');

                if (!\File::exists($path)) {
                }else{
                    $file = \File::deleteDirectory($path);
                }
            }
            
            $TP->save();
            //## Logging User
            $newId = LoggingUser::max('id');
            $newId = $newId +1;
            $logUser = new LoggingUser();
            $logUser->id = $newId;
            $logUser->norec = $logUser->generateNewId();
            $logUser->kdprofile= $kdProfile;
            $logUser->statusenabled=true;
            $logUser->jenislog = "Mahasiswa Eksternal";
            $logUser->keterangan = "Ubah Data Mahasiswa Eksternal". " Nama: ". $request['nama']. " NIM: ". $request['nim']. " Email: " . $request['email'];
            $logUser->noreff = $request['norec'];
            $logUser->referensi="Mahasiswa Eksternal";
            $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
            $logUser->tanggal = date('Y-m-d H:i:s');
            $logUser->save();
            // $norec = ;
            if(!empty($uploadimage)) {
                // $request->file('image')->move('DIKLAT/FileFoto/',$filenameImage);
                $request->file('image')->move('img/DIKLAT/FileFoto/'.$request['email'],$filenameImage);
            }
            
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $errMessage = $e->getMessage();
            $errLine = $e->getLine();
        }


        if ($transStatus == 'true') {
            $transMessage = "Ubah Peserta Didik" ;
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $TP,
                'as' => 'asepic',
            );
        } else {
            $transMessage = "Ubah Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                 "e" => $e->getMessage() .' '.$e->getLine(),
                'as' => 'asepic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
        
        // $result = array(
        //         'status' => 200,
        //         // 'message'  => $transMessage,
        //         'as' => 'asepic',
        //     );
        
        // return $this->respond($result);

    }

    public function hapusPesertaDidik(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $dataLogin = $request->all();
        DB::beginTransaction();
            $a= "0";
        try{
            if ($request['image'] != null) {
                $filename = $request['image'];
                // $path = public_path('DIKLAT/FileFoto/'.$request['email'].'/');
                $path = public_path('img/DIKLAT/FileFoto/'.$request['email'].'/');

                if (!\File::exists($path)) {
//                abort(404);
                }else{
                    $file = \File::deleteDirectory($path);
                }
                // Storage::disk('local')->delete('DIKLAT/FileFoto/'.$request['email'].'/'.$filename);
                // $a="tidak nol";
            }
            $TP = PesertaDidik::where('norec', $request['norec'])->where('kdprofile', $kdProfile)->delete();
            //## Logging User
            $newId = LoggingUser::max('id');
            $newId = $newId +1;
            $logUser = new LoggingUser();
            $logUser->id = $newId;
            $logUser->norec = $logUser->generateNewId();
            $logUser->kdprofile= $kdProfile;
            $logUser->statusenabled=true;
            $logUser->jenislog = "Mahasiswa Eksternal";
            $logUser->keterangan = "Hapus Mahasiswa Eksternal". " Email: " . $request['email'];
            $logUser->noreff = $request['norec'];
            $logUser->referensi="Mahasiswa Eksternal";
            $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
            $logUser->tanggal = date('Y-m-d H:i:s');
            $logUser->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'a'=>$a,
                'result' => $TP,
                'as' => 'asepic',
            );
        } else {
            $transMessage = "Hapus Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'e'=>$e->getLine(),
                'message'=>$e->getMessage(),
                'as' => 'asepic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDataComboTenagaPengajar(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $data1 = DB::select(DB::raw("select id,namalengkap from pegawai_m
                where kdprofile = $kdProfile and statusenabled=true")
        );
        $data2= DB::select(DB::raw("select id,fakultas from sdm_fakultas_m
                where kdprofile = $kdProfile and statusenabled=true")
        );

        $result = array(
            'dataPegawai' => $data1,
            'dataProgramStudi' => $data2,
            'by' => 'asepic',
        );
        return $result;
    }
    public function getDaftarTenagaPengajar(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $data = DB::select(DB::raw("select a.*,sfak.fakultas,pg.namalengkap from tenagapengajar_m as a
            INNER JOIN sdm_fakultas_m as sfak on sfak.id=a.jurusanpeminatanfk
            INNER JOIN pegawai_m as pg on pg.id=a.pegawaifk
            where a.kdprofile = $kdProfile and a.statusenabled=true")
        );
        $result = array(
            'data' => $data,
            'by' => 'asepic',
        );
        return $result;
    }

    public function getDetailTenagaPengajar(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $idpegawai = $request['id'];
        $data = DB::select(DB::raw("select pg.id,pg.namalengkap,jk.jeniskelamin,ag.agama,pg.nohandphone,pg.tempatlahir + ', ' + format(pg.tgllahir ,'yyyy-MM-dd') as tempatlahir,
                jb.namajabatan,pg.tglmasuk,ru.namaruangan,pg.alamat
                 from  pegawai_m as pg 
                left JOIN jeniskelamin_m as jk on jk.id=pg.objectjeniskelaminfk
                left JOIN agama_m as ag on ag.id=pg.objectagamafk
                left JOIN jabatan_m as jb on jb.id=pg.objectjabatanfungsionalfk
                left JOIN ruangan_m as ru on ru.id=pg.objectruangankerjafk
            where pg.kdprofile = $kdProfile and pg.statusenabled=true and pg.id= $idpegawai")
        );
        $result = array(
            'data' => $data,
            'by' => 'asepic',
        );
        return $result;
    }
    public function saveTenagaPengajar(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        try{
            $newId = TenagaPengajar::max('id') +1 ;
            if ($request['norec'] == ''){
                $TP = new TenagaPengajar();
                $TP->id = $newId;
                $TP->kdprofile = $kdProfile;
                $TP->norec = $TP->generateNewId();
            }else{
                $TP = TenagaPengajar::where('id', $request['norec'])->where('kdprofile', $kdProfile)->first();
            }
            $TP->statusenabled =  true;
            $TP->jurusanpeminatanfk = $request['fakultasfk'];
            $TP->pegawaifk = $request['pegawaifk'];
            $TP->unit_kerja = $request['namaruangan'];
            $TP->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }


        if ($transStatus == 'true') {
            $transMessage = "Simpan Tenaga Pengajar";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $TP,
                'as' => 'asepic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'asepic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function hapusTenagaPengajar(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        try{
            $TP = TenagaPengajar::where('id', $request['id'])
                ->where('kdprofile', $kdProfile)
                ->update(
                [ 'statusenabled' => false]
            );
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }


        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $TP,
                'as' => 'asepic',
            );
        } else {
            $transMessage = "Hapus Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'asepic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDataComboMOUPKS(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $data1 = DB::select(DB::raw("select id,namalengkap from pegawai_m
                where kdprofile = $kdProfile and statusenabled=true")
        );
        $data2= DB::select(DB::raw("select id,fakultas from sdm_fakultas_m
                where kdprofile = $kdProfile and statusenabled=true")
        );

        $result = array(
            'dataPegawai' => $data1,
            'dataProgramStudi' => $data2,
            'by' => 'asepic',
        );
        return $result;
    }
    public function getDaftarKegiatanPendidikan(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $data = DB::select(DB::raw("select a.*,spes.nama,dkat.diklatkategori,sfak.fakultas,djur.diklatjurusan,pg.namalengkap from sdm_kegiatanpendidikan_t as a
            INNER JOIN sdm_pesertadidik_t as spes on spes.norec=a.pesertafk
            INNER JOIN diklatkategori_m as dkat on dkat.id=a.diklatkatregorifk
            INNER JOIN sdm_fakultas_m as sfak on sfak.id=a.fakultasfk
            INNER JOIN diklatjurusan_m as djur on djur.id=a.diklatjurusanfk
            left JOIN tenagapengajar_m as tpeng on tpeng.id=a.tenagapengajarfk
            left JOIN pegawai_m as pg on pg.id=tpeng.pegawaifk
            where a.kdprofile = $kdProfile")
        );
        $result = array(
            'data' => $data,
            'by' => 'asepic',
        );
        return $result;
    }

    public function getDataComboKegiatanPendidikan(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $dataInstitusipPendidikan = DB::select(DB::raw("select id,institusipendidikan from sdm_institusipendidikan_m
                where kdprofile = $kdProfile and statusenabled=true")
        );
        $dataDiklatKategori = DB::select(DB::raw("select id,diklatkategori from diklatkategori_m
                where kdprofile = $kdProfile and statusenabled=true")
        );
        $datafakultas = DB::select(DB::raw("select id,fakultas from sdm_fakultas_m
                where kdprofile = $kdProfile and statusenabled=true")
        );
        $datadiklatjurusan = DB::select(DB::raw("select id,diklatjurusan from diklatjurusan_m
                where kdprofile = $kdProfile and statusenabled=true")
        );
        $dataTenagaPengajar = DB::select(DB::raw("select pg.namalengkap,a.id from tenagapengajar_m as a
            INNER JOIN sdm_fakultas_m as sfak on sfak.id=a.jurusanpeminatanfk
            INNER JOIN pegawai_m as pg on pg.id=a.pegawaifk
            where a.kdprofile = $kdProfile and a.statusenabled=true")
        );

        $result = array(
            'dataInstitusipPendidikan' => $dataInstitusipPendidikan,
            'dataDiklatKategori' => $dataDiklatKategori,
            'datafakultas' => $datafakultas,
            'datadiklatjurusan' => $datadiklatjurusan,
            'dataTenagaPengajar' => $dataTenagaPengajar,
            'by' => 'asepic',
        );
        return $result;
    }

    public function saveKegiatanPendidikan(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        try{
//            $newId = KegiatanPendidikan::max('id') +1 ;
            if ($request['norec'] == ''){
                $TP = new KegiatanPendidikan();
//                $TP->id = $newId;
                $TP->kdprofile = $kdProfile;
                $TP->norec = $TP->generateNewId();
            }else{
                $TP = KegiatanPendidikan::where('id', $request['norec'])->where('kdprofile', $kdProfile)->first();
            }
            $TP->statusenabled =  true;
            $TP->nokegiatan = '0001';
            $TP->pesertafk = $request['pesertafk'];
            $TP->diklatkatregorifk = $request['diklatkatregorifk'];
            $TP->fakultasfk = $request['fakultasfk'];
            $TP->diklatjurusanfk = $request['diklatjurusanfk'];
            $TP->tenagapengajarfk = $request['tenagapengajarfk'];
            $TP->tglmulai = $request['tglmulai'];
            $TP->nilaipraktek = $request['nilaipraktek'];
            $TP->nilaiujian = $request['nilaiujian'];
            $TP->surveykepuasan = $request['surveykepuasan'];
            $TP->biayapendidikan = $request['biayapendidikan'];
            $TP->tglpembayaran = $request['tglpembayaran'];
            $TP->nokwitansi = $request['nokwitansi'];
            $TP->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }


        if ($transStatus == 'true') {
            $transMessage = "Simpan Kegiatan Pendidikan";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $TP,
                'as' => 'asepic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'asepic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getRekapPegawai(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $paramkategId = '';
        $paramjenisPegId = '';
        $paramstatusPegId = '';
        
        // if(isset($request['kategId']) && $request['kategId']!=''){
        //     $paramkategId = ' and pg.kategorypegawai ='.$request['kategId'];
        // }
        // if(isset($request['statusPegId']) && $request['statusPegId']!=''){
        //     $paramstatusPegId = ' and pg.objectstatuspegawaifk ='.$request['statusPegId'];
        // }
        // if(isset($request['jenisPegId']) && $request['jenisPegId']!=''){
        //     $paramjenisPegId = ' and pg.objectjenispegawaifk ='.$request['jenisPegId'];
        // }
        $kateg = "";
        if(isset($request['jenisKategId'])){
            $kateg=" and pg.kategorypegawai in($request[jenisKategId])";
        }
        $Peg = "";
        if(isset($request['jenisPegId'])){
            $Peg=" and pg.objectstatuspegawaifk in($request[jenisPegId])";
        }
        $status = "";
        if(isset($request['statusPegId'])){
            $status=" and pg.kategorypegawai in($request[statusPegId])";
        }

        $data = DB::select(DB::raw("
            select * from (
                select  'Jenis Kelamin' as kategory , x.tipe,count ( x.id) as total 
                from (
                select jp.jeniskelamin as tipe ,pg.namalengkap ,pg.id
                from pegawai_m  as pg
                left JOIN jeniskelamin_m as jp on jp.id =pg.objectjeniskelaminfk
                where pg.kdprofile = $kdProfile and pg.statusenabled=true and pg.usereksternal is null and pg.namalengkap <> '-' AND pg.ID != 320263
                $kateg $Peg $status
                )as x GROUP BY x.tipe

                union all

                select 'Jenis Kepegawaian' as kategory  ,x.tipe ,count ( x.id) as total from (
                select jp.jenispegawai as tipe ,pg.namalengkap ,pg.id
                from pegawai_m  as pg
                left JOIN jenispegawai_m as jp on jp.id =pg.objectjenispegawaifk
                where pg.kdprofile = $kdProfile and pg.statusenabled=true and pg.usereksternal is null and pg.namalengkap <> '-' AND pg.ID != 320263
                $kateg $Peg $status
                )as x GROUP BY x.tipe

                union all 

                select 'Agama' as kategory  ,x.tipe ,count ( x.id) as total from (
                select case when jp.id is null then '-' else jp.agama end as tipe ,pg.namalengkap ,pg.id
                from pegawai_m  as pg
                left JOIN agama_m as jp on jp.id =pg.objectagamafk
                where pg.statusenabled=true and pg.usereksternal is null and pg.namalengkap <> '-' AND pg.ID != 320263
                $kateg $Peg $status
                )as x GROUP BY x.tipe

                union all 

                select 'Pendidikan' as kategory  ,x.tipe ,count ( x.id) as total from (
                select case when jp.pendidikan is null then '-' else jp.pendidikan end as tipe ,pg.namalengkap ,pg.id
                from pegawai_m  as pg
                left JOIN pendidikan_m as jp on jp.id =pg.objectpendidikanterakhirfk
                where pg.kdprofile = $kdProfile and pg.statusenabled=true and pg.usereksternal is null and pg.namalengkap <> '-' AND pg.ID != 320263
                $kateg $Peg $status
                )as x GROUP BY x.tipe
                union all 

                select 'Golongan' as kategory  ,x.tipe ,count ( x.id) as total from (
                select case when gol.name is null then '-' else gol.name end as tipe ,pg.namalengkap ,pg.id
                from pegawai_m  as pg
                left JOIN sdm_golongan_m as gol on gol.id =pg.objectgolonganfk
                where pg.kdprofile = $kdProfile and pg.statusenabled=true and pg.usereksternal is null and pg.namalengkap <> '-' AND pg.ID != 320263
                $kateg $Peg $status
                order by gol.id asc
                )as x  GROUP BY x.tipe 

                union all 


                select 'Jenis Usia' as kategory  ,z.tipe ,count (z.tipe) as total from (
                select x.id,x.namalengkap, x.tgllahir,case when x.umur is null then '-' 
                when x.umur <= 20 then 'dibawah 20 Tahun' 
                when x.umur >  20 and x.umur <= 30 then '21 s/d 30 Tahun'
                when x.umur > 30 and x.umur <= 40 then '31 s/d 40 Tahun'
                when x.umur > 40 and x.umur <= 50 then '41 s/d 50 Tahun'
                when x.umur > 50 then 'diatas 51 Tahun'
                end as  tipe from (
                select pg.id,pg.namalengkap,pg.tgllahir ,
                --CONVERT(int,ROUND(DATEDIFF(hour,pg.tgllahir,GETDATE())/8766.0,0)) AS umur
                date_part('year',age(pg.tgllahir))  AS umur
                from pegawai_m  as pg
                where pg.kdprofile = $kdProfile and pg.statusenabled=true and pg.usereksternal is null and pg.namalengkap <> '-' AND pg.ID != 320263
                $kateg $Peg $status
                ) as x
                ) as z
                GROUP BY z.tipe
                 ) as xx order by xx.kategory,xx.total desc"));
        
        $result = array(
           
            'data' => $data,
            'message' => 'er@epic',
        );
        return $this->respond($result);
    }

    public function getDataInformasijabatanStruktural (Request $request) {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $data = \DB::table('pegawai_m as pg')
            ->leftJoin('jabatan_m as jb','jb.id','=','pg.objectjabatanstrukturalfk')
            ->select(\DB::raw("pg.id as pegawaiid,pg.namalengkap,pg.tempatlahir,pg.tgllahir,pg.nippns,pg.objectjabatanstrukturalfk,jb.namajabatan"))
            ->where('pg.statusenabled',true)
            ->where('pg.kdprofile',$kdProfile);

        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $data = $data->where('pg.id','=',$request['idPegawai']);
        }

        if(isset($request['JabatanStrukturalfk']) && $request['JabatanStrukturalfk']!="" && $request['JabatanStrukturalfk']!="undefined"){
            $data = $data->where('pg.objectjabatanstrukturalfk','=',$request['JabatanStrukturalfk']);
        }

        $data = $data->orderBy('pg.namalengkap');
        $data = $data->get();
        $result = array(
            'data'  => $data,
            'as' => 'ea@epic',
        );
        return $this->respond($result);
    }
     public function getPegawaiAll (Request $request) {
         $kdProfile = (int) $this->getDataKdProfile($request);
        $pegawai = \DB::table('pegawai_m as pg')
            ->leftJoin('jabatan_m as jb','jb.id','=','pg.objectjabatanfungsionalfk')
            ->leftJoin('subunitkerja_m as sub','sub.id','=','pg.objectsubunitkerjapegawaifk')
            ->leftJoin('kategorypegawai_m as kp','kp.id','=','pg.kategorypegawai')
            ->select('pg.*','jb.namajabatan','sub.name as subunitkerja','kp.maxsisacuti','kp.maxcutitahunini')
            ->where('pg.statusenabled',true)
            ->where('pg.namalengkap',"<>","-")
            ->whereNull('pg.usereksternal')
            ->where('pg.kdprofile', $kdProfile)
            ->orderBy('pg.namalengkap')
            ->get();
        $jeniscuti = \DB::table('sdm_jeniscuti_m as pg')
            ->select('pg.*')
            ->where('pg.kdprofile', $kdProfile)
            ->where('pg.statusenabled',true)
            ->orderBy('pg.name')
            ->get();

         $arrayName = array(
            'pegawai' => $pegawai,
            'jeniscuti' => $jeniscuti,
         );
        return $this->respond($arrayName);
    }
    public function savePermohonanCuti(Request $request){
        DB::beginTransaction();
        $kdProfile = (int) $this->getDataKdProfile($request);
        $noPlanning = $this->generateCodeBySeqTable(new PlanningPegawaiStatus, 'noplanning', 11, 'P'.date('ym'), $kdProfile);
        if ($noPlanning == ''){
            $transMessage = "Gagal mengumpukan data, Coba lagi.!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'as@epic',
            );
            return $this->setStatusCode($result['status'])->respond($result, $transMessage);
        }

        try{

            if ($request['norec'] == ''){
                $TP = new PlanningPegawaiStatus();
                $TP->kdprofile = $kdProfile;
                $TP->statusenabled =true;
                $TP->norec = $TP->generateNewId();
            }else{
                $TP = PlanningPegawaiStatus::where('norec', $request['norec'])->where('kdprofile', $kdProfile)->first();
                $noPlanning =  $TP->noplanning ;
                $detailss = ListTanggalCuti::where('objectplanningpegawaistatusfk',$TP->norec)->where('kdprofile', $kdProfile)->delete();
            }
            $TP->noplanning = $noPlanning;
            $TP->objectpegawaifk =   $request['objectpegawaifk'];
            $TP->objectstatuspegawaiplanfk = $request['statuspegawaiplan'];
            $TP->tglpengajuan = $request['tglpengajuan'];
            $TP->jumlahhari = $request['jumlah'];
            $TP->keterangan = $request['keteranganlain'];
            $TP->deskripsistatuspegawaiplan = $request['deskripsi'];

            $TP->save();
            $details22 = [];
            foreach ($request['listtanggal'] as $item ){
                $details = new ListTanggalCuti();
                $details->norec = $details->generateNewId();
                $details->kdprofile = $kdProfile;
                $details->statusenabled =true;
                $details->approvalstatus = null;
                $details->objectplanningpegawaistatusfk =$TP->norec;
                $details->tgl = $item['tgl'];
                $details->save();
                $details22 []= $details;
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }


        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $TP,
                'detail' => $details22,
                'as' => 'er@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getPermohonanCuti (Request $request) {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $data =\DB::table('planningpegawaistatus_t as pps')
            ->leftJoin('pegawai_m as pg','pg.id','=','pps.objectpegawaifk')
            ->leftJoin('sdm_jeniscuti_m as jc','jc.id','=','pps.objectstatuspegawaiplanfk')
            ->leftJoin('jabatan_m as jb','jb.id','=','pg.objectjabatanstrukturalfk')
            ->leftJoin('unitkerja_m as ukp','ukp.id','=','pg.objectunitkerjafk')
            ->select( 'pps.norec','pps.noplanning','pps.tglpengajuan','pps.objectpegawaifk','pps.objectstatuspegawaiplanfk',
                'pps.deskripsistatuspegawaiplan as desk','pps.keterangan','pg.namalengkap','jc.name as statuspermohonan',
                'jb.namajabatan','ukp.unitkerja','pps.approvalstatus')
            ->where('pps.kdprofile', $kdProfile)
            ->where('pps.statusenabled',true)
            ->orderBy('pps.tglpengajuan');

        if(isset($request['namaLengkap']) && $request['namaLengkap']!="" && $request['namaLengkap']!="undefined"){
            $data = $data->where('pg.namalengkap','ilike','%'.$request['namaLengkap'].'%');
        }
        if(isset($request['pgId']) && $request['pgId']!="" && $request['pgId']!="undefined"){
            $data = $data->where('pg.id','=',$request['pgId']);
        }
        if(isset($request['unitKerjaId']) && $request['unitKerjaId']!="" && $request['unitKerjaId']!="undefined"){
            $data = $data->where('ukp.id','=',$request['unitKerjaId']);
        }
        if(isset($request['subUnitId']) && $request['subUnitId']!="" && $request['subUnitId']!="undefined"){
            $data = $data->where('pg.objectsubunitkerjapegawaifk','=',$request['subUnitId']);
        }
        if(isset($request['kedudukanId']) && $request['kedudukanId']!="" && $request['kedudukanId']!="undefined"){
            $data = $data->where('pg.kedudukanfk','=',$request['kedudukanId']);
        }
        if(isset($request['statusPegawaiId']) && $request['statusPegawaiId']!="" && $request['statusPegawaiId']!="undefined"){
            $data = $data->where('pg.objectstatuspegawaifk','=',$request['statusPegawaiId']);
        }
        if(isset($request['qstatusApprove']) && $request['qstatusApprove']!="" && $request['qstatusApprove']!="undefined" ){
            if($request['qstatusApprove'] == 0){
                $data = $data->whereNull('pps.approvalstatus');
            }else{
                $data = $data->where('pps.approvalstatus','=',$request['qstatusApprove']);
            }
        }
        if(isset($request['qPermohonan']) && $request['qPermohonan']!="" && $request['qPermohonan']!="undefined"){
            $data = $data->where('jc.id','=',$request['qPermohonan']);
        }

        if(isset($request['tglMasuk']) && $request['tglMasuk']!="" && $request['tglMasuk']!="undefined"){
            $tgl = $request['tglMasuk'];
            $data = $data->whereRaw("format(pg.tglmasuk,'yyyy-MM') = '$tgl'");
        }
        if(isset($request['rows']) && $request['rows']!="" && $request['rows']!="undefined"){
            $data = $data->take($request['rows']);
        }
        $data = $data->get();
        $data2 =[];

        foreach ($data as $item){
            $norec= $item->norec;
            $details = DB::select(DB::raw("select *,to_char(tgl, 'Day') as day from listtanggalcuti_t where objectplanningpegawaistatusfk='$norec' and to_char(tgl, 'Day') <> 'Sunday   '"));
            $tglVerif = [];
            foreach ($details as $itmde){
                if( $itmde-> approvalstatus == 1 && $itmde->day != "Sunday   "){
                    $tglVerif [] = array(
                        'norec' => $itmde->norec,
                        'tgl' => $itmde->tgl,
                        'day' => $itmde->day,
                        'approvalstatus' => $itmde->approvalstatus,
                        'objectplanningpegawaistatusfk' => $itmde->objectplanningpegawaistatusfk
                    );
                }

            }

            $data2 [] =  array(
                'norec' => $item->norec,
                'noplanning' => $item->noplanning,
                'tglpengajuan' => $item->tglpengajuan,
                'objectpegawaifk' => $item->objectpegawaifk,
                'objectstatuspegawaiplanfk' => $item->objectstatuspegawaiplanfk,
                'desk' => $item->desk,
                'keterangan' => $item->keterangan,
                'namalengkap' => $item->namalengkap,
                'statuspermohonan' => $item->statuspermohonan,
                'namajabatan' => $item->namajabatan,
                'unitkerja' => $item->unitkerja,
                'approvalstatus' => $item->approvalstatus,
                'listtanggal' => $details,
                'listtanggalapprove' => $tglVerif,

            );
        }
        $result = array(
            'data'  => $data2,
            'as' => 'er@epic',
        );
        return $this->respond($result);
    }
    public function getTotalSisaCuti (Request $request) {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tahun = $request['tglpengajuan'];
        $idpegawai = $request['idPegawai'];
        $data = DB::select(DB::raw("SELECT pg.id,pg.namalengkap,kp.maxcutitahunini as sisacutitahunsekarang, coalesce(y.cutisisatahunkemarin, kp.maxsisacuti) sisacutitahunsebelumnya, 
            coalesce(y.cutisisatahunkemarin, kp.maxsisacuti) + kp.maxcutitahunini as sisacutikeseluruhan, COALESCE(z.cutisisatahunini,0) totalcutitahunini FROM pegawai_m pg 
            left join (SELECT id, namalengkap,maxsisacuti , maxcutitahunini,
				case when (maxsisacuti + maxcutitahunini)- jumlahcuti   >= maxsisacuti then maxsisacuti
                when (maxsisacuti + maxcutitahunini)- jumlahcuti < maxsisacuti then (maxsisacuti + maxcutitahunini)- jumlahcuti 
                end as cutisisatahunkemarin
				 FROM (
				SELECT pg.id, pg.namalengkap, sum(pps.jumlahhari)as jumlahcuti, kp.maxsisacuti, kp.maxcutitahunini FROM pegawai_m pg
				inner join planningpegawaistatus_t pps on pps.objectpegawaifk = pg.id 
				inner join kategorypegawai_m kp on kp.id = pg.kategorypegawai
				left join sdm_jeniscuti_m sjc on sjc.id = pps.objectstatuspegawaiplanfk
				where pps.kdprofile = $kdProfile
				and pps.statusenabled = true
				and (
                    (date_part('year', pps.tglpengajuan::timestamp) = date_part('year',('$tahun-01-01 00:00'::timestamp - interval '1 year')) )
				)
				GROUP BY pg.id, pg.namalengkap,kp.maxsisacuti,kp.maxcutitahunini)as x)as y on y.id = pg.id
inner join kategorypegawai_m kp on kp.id = pg.kategorypegawai
left join(SELECT id, namalengkap,maxsisacuti , maxcutitahunini, jumlahcuti as cutisisatahunini
				 FROM (
				SELECT pg.id, pg.namalengkap, sum(pps.jumlahhari)as jumlahcuti, kp.maxsisacuti, kp.maxcutitahunini FROM pegawai_m pg
				inner join planningpegawaistatus_t pps on pps.objectpegawaifk = pg.id 
				inner join kategorypegawai_m kp on kp.id = pg.kategorypegawai
				left join sdm_jeniscuti_m sjc on sjc.id = pps.objectstatuspegawaiplanfk
				where pps.kdprofile = $kdProfile
				and pps.statusenabled = true
				and (
                    (date_part('year', pps.tglpengajuan::timestamp) = date_part('year',('$tahun-01-01 00:00'::timestamp )) )
				)
				GROUP BY pg.id, pg.namalengkap,kp.maxsisacuti,kp.maxcutitahunini)as x)	as z on z.id = pg.id
		
				where pg.id = $idpegawai
				
        "));
        $totalcutitahunini = DB::select(DB::raw("SELECT pg.namalengkap, sum(pps.jumlahhari)as totalcutitahunini FROM pegawai_m pg 
        inner join planningpegawaistatus_t pps on pps.objectpegawaifk = pg.id where pg.id = $idpegawai and date_part('year', pps.tglpengajuan::timestamp)= $tahun
        GROUP BY pg.namalengkap
        
        "));
        if(count($totalcutitahunini) > 0){
            $totalcutitahunini = $totalcutitahunini[0]->totalcutitahunini;
        }else{
            $totalcutitahunini = 0;
        }
        $sisacutitahunsebelumnya = DB::select(DB::raw("SELECT pg.namalengkap, sum(pps.jumlahhari)as jumlahcuti,
        CASE 
            WHEN (kp.maxcutitahunini+kp.maxsisacuti)- sum(pps.jumlahhari)> kp.maxsisacuti THEN
                kp.maxsisacuti
            ELSE
            (kp.maxcutitahunini+kp.maxsisacuti)- sum(pps.jumlahhari)
        END as sisacutitahunsebelumnya

        FROM pegawai_m pg 
        inner join planningpegawaistatus_t pps on pps.objectpegawaifk = pg.id 
        inner join kategorypegawai_m kp on kp.id = pg.kategorypegawai
        where pg.id = $idpegawai and date_part('year', pps.tglpengajuan::timestamp)= $tahun-1
        GROUP BY pg.namalengkap, kp.maxsisacuti, kp.maxcutitahunini
        "));
        if(count($sisacutitahunsebelumnya) > 0){
            $sisacutitahunsebelumnya = $sisacutitahunsebelumnya[0]->sisacutitahunsebelumnya;
        }else{
            $sisacutitahunsebelumnya = 0;
        }
        $sisacutitahunsekarang = DB::select(DB::raw("SELECT pg.namalengkap, kp.maxcutitahunini as sisacutitahunsekarang

        FROM pegawai_m pg 
        inner join planningpegawaistatus_t pps on pps.objectpegawaifk = pg.id 
        inner join kategorypegawai_m kp on kp.id = pg.kategorypegawai
        where pg.id = $idpegawai and date_part('year', pps.tglpengajuan::timestamp)= $tahun-1
        GROUP BY pg.namalengkap, kp.maxsisacuti, kp.maxcutitahunini
        "));
        if(count($sisacutitahunsekarang) > 0){
            $sisacutitahunsekarang = $sisacutitahunsekarang[0]->sisacutitahunsekarang;
        }else{
            $sisacutitahunsekarang = 0;
        }
        $sisacutikeseluruhan = $sisacutitahunsekarang + $sisacutitahunsebelumnya;
        $data = array(
            'totalcutitahunini'=>$totalcutitahunini,
            'sisacutitahunsebelumnya'=>$sisacutitahunsebelumnya,
            'sisacutitahunsekarang'=>$sisacutitahunsekarang,
            'sisacutikeseluruhan'=>$sisacutikeseluruhan,

        );
        $result = array(
            'data'  => $data,
            'as' => 'fizi@epic',
        );
        return $this->respond($result);
        // $data1 = DB::select(DB::raw("select pg.id idpegawai, pg.namalengkap, coalesce(a.sisacutitahunsebelumnya, 6) sisacutitahunsebelumnya, coalesce(b.sisacutitahunsekarang, 12) sisacutitahunsekarang, coalesce(a.sisacutitahunsebelumnya, 6) + coalesce(b.sisacutitahunsekarang, 12) as sisacutikeseluruhan
        // from pegawai_m pg
        // left join (
        //     select idpegawai, tahun, namalengkap, jumlahcutipertahun, sum(jumlahtotalcutipertahun) jumlahcutitahunsebelumnya, 
        //     case 
        //         when jumlahcutipertahun - sum(jumlahtotalcutipertahun) >= 6 then 6 
        //         when jumlahcutipertahun - sum(jumlahtotalcutipertahun) < 6 then jumlahcutipertahun - sum(jumlahtotalcutipertahun) 
        //     end as sisacutitahunsebelumnya
        //     from(
        //         select pg.id idpegawai, date_part('year',('$tahun-01-01 00:00'::timestamp - interval '1 year')) tahun, pg.namalengkap, pps.tglpengajuan, kp.maxsisacuti jumlahcutipertahun, pps.jumlahhari jumlahtotalcutipertahun, sjc.name, sjc.id
        //         from pegawai_m pg
        //         inner join planningpegawaistatus_t pps on pps.objectpegawaifk = pg.id and pps.approvalstatus = 1
        //         inner join kategorypegawai_m kp on kp.id = pg.kategorypegawai
        //         left join sdm_jeniscuti_m sjc on sjc.id = pps.objectstatuspegawaiplanfk
        //         where pps.kdprofile = 30
        //         and pps.statusenabled = true
        //         and (
        //             (date_part('year', pps.tglpengajuan::timestamp) = date_part('year',('$tahun-01-01 00:00'::timestamp - interval '1 year')) and sjc.id is null)
        //         db)
        //         and pg.id not in(
        //             select pg.id
        //             from pegawai_m pg
        //             inner join planningpegawaistatus_t pps on pps.objectpegawaifk = pg.id and pps.approvalstatus = 1
        //             inner join kategorypegawai_m kp on kp.id = pg.kategorypegawai
        //             left join sdm_jeniscuti_m sjc on sjc.id = pps.objectstatuspegawaiplanfk
        //             where pps.kdprofile = 30
        //             and pps.statusenabled = true
        //             and (
        //                     (date_part('year', pps.tglpengajuan::timestamp) = date_part('year',('$tahun-01-01 00:00'::timestamp - interval '1 year')) and sjc.id = 8)
        //             )
        //         )
        //     ) as x
        //     group by idpegawai, tahun, namalengkap, jumlahcutipertahun

		// 	union all

		// 	select idpegawai, tahun, namalengkap, jumlahcutipertahun, 
		// 	sum(jumlahtotalcutipertahun) as jumlahcutitahunsekarang, 
        //     0 sisacutitahunsekarang
        //     from(
		// 	    select pg.id idpegawai, date_part('year',('$tahun-01-01 00:00'::timestamp - interval '1 year')) tahun, pg.namalengkap, pps.tglpengajuan, kp.maxsisacuti jumlahcutipertahun, pps.jumlahhari jumlahtotalcutipertahun, sjc.name, sjc.id
        //         from pegawai_m pg
        //         inner join planningpegawaistatus_t pps on pps.objectpegawaifk = pg.id and pps.approvalstatus = 1
        //         inner join kategorypegawai_m kp on kp.id = pg.kategorypegawai
        //         left join sdm_jeniscuti_m sjc on sjc.id = pps.objectstatuspegawaiplanfk
        //         where pps.kdprofile = 30
        //         and pps.statusenabled = true
        //         and (
        //             (date_part('year', pps.tglpengajuan::timestamp) = date_part('year',('$tahun-01-01 00:00'::timestamp - interval '1 year')) and sjc.id = 8)
        //         )
		// 	) as x
        //     group by idpegawai, tahun, namalengkap, jumlahcutipertahun, id
        // )as a on pg.id = a.idpegawai
        // left join (
        //     select idpegawai, tahun, namalengkap, jumlahcutipertahun, 
        //     sum(jumlahtotalcutipertahun) as jumlahcutitahunsekarang, 
        //     jumlahcutipertahun - sum(jumlahtotalcutipertahun) sisacutitahunsekarang
        //     from(
        //         select pg.id idpegawai, date_part('year','$tahun-01-01 00:00'::timestamp) tahun, pg.namalengkap, pps.tglpengajuan, kp.maxsisacuti jumlahcutipertahun, pps.jumlahhari jumlahtotalcutipertahun, sjc.name, sjc.id
        //         from pegawai_m pg
        //         inner join planningpegawaistatus_t pps on pps.objectpegawaifk = pg.id and pps.approvalstatus = 1
        //         inner join kategorypegawai_m kp on kp.id = pg.kategorypegawai
        //         left join sdm_jeniscuti_m sjc on sjc.id = pps.objectstatuspegawaiplanfk
        //         where pps.kdprofile = 30
        //         and pps.statusenabled = true
        //         and (
        //             (date_part('year', pps.tglpengajuan::timestamp) = date_part('year','$tahun-01-01 00:00'::timestamp) and sjc.id is null)
        //             or 
        //             (date_part('year', pps.tglpengajuan::timestamp) = date_part('year','$tahun-01-01 00:00'::timestamp ) and sjc.id = 1)
        //         )
        //         and pg.id not in(
        //             select pg.id
        //             from pegawai_m pg
        //             inner join planningpegawaistatus_t pps on pps.objectpegawaifk = pg.id and pps.approvalstatus = 1
        //             inner join kategorypegawai_m kp on kp.id = pg.kategorypegawai
        //             left join sdm_jeniscuti_m sjc on sjc.id = pps.objectstatuspegawaiplanfk
        //             where pps.kdprofile = 30
        //             and pps.statusenabled = true
        //             and (
        //                     (date_part('year', pps.tglpengajuan::timestamp) = date_part('year','$tahun-01-01 00:00'::timestamp ) and sjc.id = 8)
        //             )
        //         )
        //     ) as x
        //     group by idpegawai, tahun, namalengkap, jumlahcutipertahun

        //     union all

        //     select idpegawai, tahun, namalengkap, jumlahcutipertahun, 
        //     sum(jumlahtotalcutipertahun) as jumlahcutitahunsekarang, 
        //     0 sisacutitahunsekarang
        //     from(
		// 		select pg.id idpegawai, date_part('year','$tahun-01-01 00:00'::timestamp) tahun, pg.namalengkap, pps.tglpengajuan, kp.maxsisacuti jumlahcutipertahun, pps.jumlahhari jumlahtotalcutipertahun, sjc.name, sjc.id
        //         from pegawai_m pg
        //         inner join planningpegawaistatus_t pps on pps.objectpegawaifk = pg.id and pps.approvalstatus = 1
        //         inner join kategorypegawai_m kp on kp.id = pg.kategorypegawai
        //         inner join sisacuti_t sc on sc.tahun = date_part('year', '$tahun-01-01 00:00'::timestamp)
        //         left join sdm_jeniscuti_m sjc on sjc.id = pps.objectstatuspegawaiplanfk
        //         where pps.kdprofile = 30
        //         and pps.statusenabled = true
        //         and (
        //             (date_part('year', pps.tglpengajuan::timestamp) = date_part('year','$tahun-01-01 00:00'::timestamp ) and sjc.id = 8)
        //         )
		// 	) as x
        //     group by idpegawai, tahun, namalengkap, jumlahcutipertahun
        // ) as b on pg.id = b.idpegawai
        // where pg.id = $idpegawai"));
        // $details = [];
        // $data =  \DB::select(DB::raw("SELECT pg.id, pg.namalengkap, kp.maxsisacuti, kp.maxcutitahunini, pps.norec as norec_pps FROM pegawai_m pg
        // left join planningpegawaistatus_t pps on pps.objectpegawaifk = pg.id
        // inner join kategorypegawai_m kp on kp.id = pg.kategorypegawai
        // where pg.id = $idpegawai and pg.kdprofile = 30 and pg.statusenabled=true"));
        // $listdatacuti = DB::select(DB::raw("listtanggalcuti_t ltc where ltc.objectplanningpegawaistatusfk ilike''"));
        // if(count($data->norec)>0){

        // }else{
        //     // $data = $data[0][];
        // }
        // $sisacutitahunsebelumnya = 0;
        // $sisacutitahunsekarang = 0;
        // $namalengkap = 0;
        // foreach ($data as $d) {
        //     $namalengkap = $d->namalengkap;
        //     // jumlah cuti tahun sebelumnya max 6
        //     if($d->norec_pps != null){
        //         $listdatacutitahunsebelumnya = DB::select(DB::raw("select * from listtanggalcuti_t ltc where ltc.objectplanningpegawaistatusfk ilike :norec and date_part('year', ltc.tgl::date) = ($tahun-1) and ltc.approvalstatus = true and date_part('year', ltc.tgl::date)=($tahun-1)"),
        //         // $cutisebelumnya = $d->max count($listdatacutitahunsebelumnya);
        //         array(
        //             'norec' => $d->norec_pps,
        //         ));
                
        //         if(count($listdatacutitahunsebelumnya)>6){
        //             $sisacutitahunsebelumnya = $d->maxsisacuti;
        //         }else{

        //         }
        //         $sisacutitahunsebelumnya = count($listdatacutitahunsebelumnya);
        //     }else{
        //         $sisacutitahunsebelumnya = $d->maxsisacuti;
        //         $sisacutitahunsekarang = $d->maxcutitahunini;
        //     }

            
        // }
        // $details[] = array(
        //     'id'=> $idpegawai,
        //     'namalengkap'=> $namalengkap,
        //     'sisacutitahunsebelumnya'=> $sisacutitahunsebelumnya,
        //     'sisacutitahunsekarang'=> $sisacutitahunsekarang,	
        //     'sisacutikeseluruhan'=>12,
        // );
        $result = array(
            'data'  => $data,
            'as' => 'er@epic',
        );
        return $this->respond($result);
    }
    public function getNominalTunjangan (Request $request) {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $jenisjabatan = $request['jenisjabatan'];
        $jabatan = $request['jabatan'];

        if($jenisjabatan == 6){
            $data = DB::select(DB::raw("select nominaltunjangan from jabatan_m where id = $jabatan"));
        } else if($jenisjabatan == 7){
            $data = DB::select(DB::raw("select nominaltunjangan from sdm_golongan_m where id = $jabatan"));
        } else if($jenisjabatan == 8){
            $data = DB::select(DB::raw("select nominaltunjangan from eselon_m where id = $jabatan"));
        }
        

        $result = array(
            'data'  => $data,
            'as' => 'er@epic',
        );
        return $this->respond($result);
    }
    public function getJumlahCuti (Request $request) {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];

        $data = DB::select(DB::raw("select count(namahari)  jumlahhari from(
            select hari, to_char(hari, 'Day') namahari from(
                SELECT d::date hari
                FROM generate_series(
                    '$tglAwal'::timestamp,
                    '$tglAkhir'::timestamp,
                    '1 day'
                ) AS gs(d)
            ) as x where hari not in(select tgllibur::date tgllibur
            from slottinglibur_m
            where kdprofile = 30
            and statusenabled = true)
            and to_char(hari, 'Day') != 'Sunday   '
        ) as y;"));

        $result = array(
            'data'  => $data,
            'as' => 'er@epic',
        );
        return $this->respond($result);
    }
    public function deletePermohonanCuti(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        try{
            PlanningPegawaiStatus::where('norec',$request['norec'])->where('kdprofile', $kdProfile)->update(
                ['statusenabled' =>  false]
            );


            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }


        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'er@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function verifCuti(Request $request){
        DB::beginTransaction();
        $kdProfile = (int) $this->getDataKdProfile($request);
        try{

            foreach ($request['data'] as $item ){
                $data = ListTanggalCuti::where('norec', $item['norec'])->where('kdprofile', $kdProfile)->first();
                $details = ListTanggalCuti::where('norec', $item['norec'])->where('kdprofile', $kdProfile)->update(
                    [ 'approvalstatus' => 1 ]
                );

                $head = PlanningPegawaiStatus::where('norec', $data->objectplanningpegawaistatusfk )
                    ->where('kdprofile', $kdProfile)
                    ->update(
                    [ 'approvalstatus' => 1 ]
                );
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }


        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
//                'result' => $TP,
                'as' => 'er@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function unverifCuti(Request $request){
        DB::beginTransaction();
        $kdProfile = (int) $this->getDataKdProfile($request);
        try{

            $data = PlanningPegawaiStatus::where('norec',$request['norec'])
                ->where('kdprofile', $kdProfile)
                ->update(
                [ 'approvalstatus' => null ]
            );
            $detail =  ListTanggalCuti::where('objectplanningpegawaistatusfk',$request['norec'] )
                ->where('kdprofile', $kdProfile)
                ->update(
                [ 'approvalstatus' => null ]
            );

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }


        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
//                'result' => $TP,
                'as' => 'er@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function savePermohonanCutiBersama(Request $request){
        DB::beginTransaction();
        $kdProfile = (int) $this->getDataKdProfile($request);
        try{

            $pegawai = Pegawai::where('statusenabled',true)->get();
            $tanggals = $request['listtanggal'];
            $arrayTgl = [];
            foreach ($tanggals as $tgl){
                $arrayTgl [] = $tgl['tgl'];
            }
            $delete =\DB::table('listtanggalcuti_t as list')
                ->select('pps.norec')
                ->Join('planningpegawaistatus_t as pps','pps.norec','=','list.objectplanningpegawaistatusfk')
                ->where('list.kdprofile', $kdProfile)
                ->where('pps.objectstatuspegawaiplanfk',7)
                ->whereIn('list.tgl',$arrayTgl)
                ->get();
            if(count($delete) > 0){
                $arrNorec=[];
                foreach ($delete as $del){
                    $arrNorec[] = $del->norec;
                }
                $update = PlanningPegawaiStatus::whereIn('norec',$arrNorec)->delete();

            }

//            return $this->respond($delete);

            foreach ($pegawai as $pegawais){
                $noPlanning = $this->generateCodeBySeqTable(new PlanningPegawaiStatus, 'noplanning', 11, 'P'.date('ym'), $kdProfile);
                if ($noPlanning == ''){
                    $transMessage = "Gagal mengumpukan data, Coba lagi.!";
                    DB::rollBack();
                    $result = array(
                        "status" => 400,
                        "message"  => $transMessage,
                        "as" => 'as@epic',
                    );
                    return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                }


                $TP = new PlanningPegawaiStatus();
                $TP->kdprofile = $kdProfile;
                $TP->statusenabled =true;
                $TP->norec = $TP->generateNewId();
                $TP->noplanning = $noPlanning;
                $TP->objectpegawaifk =  $pegawais->id;
                $TP->objectstatuspegawaiplanfk = 7;
                $TP->tglpengajuan = date('Y-m-d H:i:s');
//                $TP->jumlahhari = $request['jumlah'];
                $TP->keterangan = 'Cuti Bersama';
                $TP->approvalstatus = 1;
//                $TP->deskripsistatuspegawaiplan = $request['deskripsi'];

                $TP->save();

                foreach ($request['listtanggal'] as $item ){
                    $details = new ListTanggalCuti();
                    $details->norec = $details->generateNewId();
                    $details->kdprofile = $kdProfile;
                    $details->statusenabled =true;
                    $details->approvalstatus = 1;
                    $details->objectplanningpegawaistatusfk =$TP->norec;
                    $details->tgl = $item['tgl'];
                    $details->save();
                }
            }


            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }


        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $TP,
                'as' => 'er@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getAbsesnsiPegawai (Request $request) {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $data = \DB::table('pegawai_m as pg')
            ->Join('sdm_absensipegawai_t as abn','abn.pegawaifk','=','pg.id')
            ->select('pg.namalengkap','abn.*')
            ->where('pg.kdprofile', $kdProfile)
            ->where('pg.statusenabled',true)
            ->where('abn.statusenabled',true);

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('abn.jammasuk', '>=', $request['tglAwal']);
        }

        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];//." 23:59:59";
            $data = $data->where('abn.jammasuk', '<=', $tgl);
        }

        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $data = $data->where('pg.id','=',$request['idPegawai']);
        }
        if(isset($request['bulan']) && $request['bulan']!="" && $request['bulan']!="undefined"){
            $bln = $request['bulan'];
            $data = $data->whereRaw("to_char(abn.jammasuk,'yyyy-MM')= '$bln'");
        }

        $data = $data->orderBy('abn.jammasuk');
        $data = $data->get();



        $result = array(
            'data'  => $data,
            'as' => 'er@epic',
        );
        return $this->respond($result);
    }
    public function saveAbsensi(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        try{

            $pegawaifk = $request['pegawaifk']['id'];
            $tglAbsen = substr( $request['absen'][0]['tglabsen'],0,7);
//            return $this->respond($tglAbsen);
//            return $this->respond($pegawaifk);
            $delete = DB::delete("delete from sdm_absensipegawai_t where kdprofille = $kdProfile and pegawaifk='$pegawaifk' and  bulan='$tglAbsen' ");

            foreach ($request['absen'] as $item){
                $TP = new SDM_AbsensiPegawai();
                $TP->kdprofile = $kdProfile;
                $TP->statusenabled =true;
                $TP->norec = $TP->generateNewId();
                $TP->jamkeluar =$item['jampulang']!=null? $item['tglabsen']. ' '.$item['jampulang']: null;
                $TP->jammasuk = $item['jammasuk']!= null ? $item['tglabsen']. ' '. $item['jammasuk'] : null;
                $TP->pegawaifk = $request['pegawaifk']['id'];
                $TP->tglhistori = date('Y-m-d H:i:s');
                $TP->mesinmasuk =$item['mesinmasuk'];
                $TP->mesinpulang = $item['mesinpulang'];
                $TP->bulan = substr($item['tglabsen'],0,7);
                $TP->status = $item['status'];
                $TP->kwk = $item['kwk'];

                $TP->save();

            }


            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }


        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $TP,
                'as' => 'er@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getPegawaiByUnitKerja (Request $request) {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $data = \DB::table('mapunitkerjatopegawai_m as mpkp')
            ->Join('pegawai_m as pg','pg.id','=','mpkp.pegawaifk')
            ->Join('unitkerjapegawai_m as uk','uk.id','=','mpkp.unitkerjafk')
//            ->leftJoin('sdm_kelompokshift_m as ks','ks.id','=','pg.objectshiftkerja')
//            ->select(\DB::raw("pg.id,pg.namalengkap,pg.objectshiftkerja,pg.objectunitkerjapegawaifk,uk.name as unitkerja,
//			                         ks.kelompokshiftkerja"))
            ->select(\DB::raw("pg.id,pg.namalengkap,mpkp.unitkerjafk,uk.name AS unitkerja"))
            ->where('mpkp.kdprofile', $kdProfile)
            ->where('pg.statusenabled',true)
            ->orderBy('pg.namalengkap');

        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $data = $data->where('pg.id','=',$request['idPegawai']);
        }
        if(isset($request['unitkerjaid']) && $request['unitkerjaid']!="" && $request['unitkerjaid']!="undefined"){
            $data = $data->where('uk.id','=',$request['unitkerjaid']);
        }
        $data = $data->get();
        $result = [];
        $bulanTahun = $request['bulantahun'];
        foreach ($data as $key => $value) {
            $idPegawai= $value->id;
            $details = \DB::select(\DB::raw("select jd.*,jk.kode
                    from jadwalkerjapegawai_t as jd 
                    join jamkerja_m as jk on jk.id=jd.jadwalkerjafk
                    where jd.kdprofile = $kdProfile and to_char(tanggal,'yyyy-MM') = '$bulanTahun'
                    and pegawaifk='$idPegawai'
                    and jd.statusenabled=true
                    "));
            $result [] = array(
                'id' => $value->id,
                'namalengkap' => $value->namalengkap,
                'unitkerjafk' => $value->unitkerjafk,
                'unitkerja' => $value->unitkerja,
                'jadwalkerja' => $details,
              
            );
        }
        return $this->respond($result);
    }
    public function getJadwalAbasensiCbo (Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $UnitKerja = UnitKerjaPegawai::where('statusenabled',true)->where('kdprofile', $kdProfile)->get();
        $SubUnitKerja = SubUnitKerja::where('statusenabled',true)->where('kdprofile', $kdProfile)->get();
        $DataUnitkerja=[];
        foreach ($UnitKerja as $item) {
            $detail = [];
            foreach ($SubUnitKerja as $item2) {
                if ($item->id == $item2->objectunitkerjapegawaifk) {
                    $detail[] = array(
                        'id' => $item2->id,
                        'name' => $item2->name,
                    );
                }
            }

            $DataUnitkerja[] = array(
                'id' => $item->id,
                'name' => $item->name,
                'subunit' => $detail,
            );
        }


        $Shift = \DB::table('shiftkerja_m as pk')
            ->where('pk.kdprofile', $kdProfile)
            ->where('pk.statusenabled', true)
            ->orderBy('pk.namashift')
            ->get();

        $jenisSK = \DB::table('jeniskeputusan_m as pk')
            ->where('pk.kdprofile', $kdProfile)
            ->where('pk.statusenabled', true)
            ->orderBy('pk.jeniskeputusan')
            ->get();

        $UnitKerjaPegawai = \DB::table('unitkerjapegawai_m as pk')
            ->where('pk.kdprofile', $kdProfile)
            ->where('pk.statusenabled', true)
//            ->where('pk.kdprofile', 12)
            ->orderBy('pk.name')
            ->get();

        $ShiftKerja = SdmShiftKerja::where('statusenabled', true)->where('kdprofile', $kdProfile)->get();
        $JamKerja = JamKerja::where('statusenabled', true)->where('kdprofile', $kdProfile)->get();
        $result = array(
            'unitkerjapegawai' => $UnitKerjaPegawai,
            'subunitkerja' => $SubUnitKerja,
            'dataunitkerja' => $DataUnitkerja,
            'shiftkerja' => $ShiftKerja,
            'shiftpegawai' => $Shift,
            'jeniskeputusan' => $jenisSK,
            'jamkerja' => $JamKerja,
            'by' => 'er@epic',
        );

        return $this->respond($result);
    }
    public function getSuratKeputusan (Request $request) {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $data = \DB::table('suratkeputusan_m as sk')
            ->Join('jeniskeputusan_m as jk','jk.id','=','sk.objectjeniskeputusanfk')
            ->leftJoin('pegawai_m as pg','pg.id','=','sk.objectpegawaiobjekskfk')
            ->select('sk.id','sk.namask','sk.keteranganlainnya','sk.nosk','sk.nosk_intern','sk.tglttsk as tgl','jk.jeniskeputusan',
                'sk.objectjeniskeputusanfk','sk.objectpegawaiobjekskfk as pegawaifk','pg.namalengkap','sk.namaexternal as filename' )
            ->where('sk.kdprofile', $kdProfile)
            ->where('sk.statusenabled',true)
            ->where('sk.nosk_intern','SDM')
            ->orderBy('sk.namask');

        $data = $data->get();
        $result = array(
            'data'  => $data,
            'as' => 'er@epic',
        );
        return $this->respond($result);
    }

    public function getSisaCuti (Request $request) {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tahun = '';
        if(isset($request['tahun']) && $request['tahun'] !='' ){
            $tahun = ' and tahun = '.$request['tahun'];
        }

        $data = DB::select(DB::raw("select * from sisacuti_t where statusenabled = true and kdprofile = 30 $tahun"));

        $result = array(
            'data'  => $data,
            'as' => 'er@epic',
        );
        return $this->respond($result);
    }
    public function saveSuratKeputusan(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        \DB::beginTransaction();
        try {
            $newID = SuratKeputusan::max('id') + 1;
            if ($request['id'] == ""){
                $new = new SuratKeputusan();
                $new->id = $newID ;
                $new->kdprofile = $kdProfile;
                $new->statusenabled=true;
                $new->norec = $new->generateNewId();

            }else{
                $new = SuratKeputusan::where('id', $request['id'])
                    ->where('kdprofile', $kdProfile)
                    ->first();
                $newID = $new->id;
            }

            $upload = $request->file('file');
            if(!empty($upload)){
                $ext = $upload->getClientOriginalExtension();
                $filename = $request['nosk'] .'-' . $request['namask'].'.'.$ext;
                $new->namaexternal = $filename;
            }

            $new->objectjeniskeputusanfk=$request['jenissk'];
            $new->keteranganlainnya=$request['keterangan'];
            $new->namask =$request['namask'];
            $new->nosk = $request['nosk'];
            $new->nosk_intern = 'SDM';
            $new->objectpegawaiobjekskfk =$this->getCurrentUserID();
            $new->tglttsk = $request['tgl'];
            $new->save();
            $norec =  $new->id ;
            if(!empty($upload)) {
                $request->file('file')->move('SDM/SuratKeputusan/'.$newID,
                    $filename);
            }


            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus = 'true') {
            $transMessage = "Sukses ";
            \DB::commit();
            $result = array(
                "status" => 201,
                "norec" => $new,
                "by" => 'er@epic',
            );
        } else {
            $transMessage = "Simpan SK Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "by" => 'er@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function deleteSuratKeputusan(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        try {
            $filename = $request['namafile'];
            $path = public_path('SDM/SuratKeputusan/'.$request['id'].'/');

            if (!\File::exists($path)) {
//                abort(404);
            }else{
                $file = \File::deleteDirectory($path);
            }

            SuratKeputusan::where('id', $request['id'])->where('kdprofile', $kdProfile)->delete();
            $transMessage = "Sukses ";
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Hapus Gagal";
        }

        if ($transStatus != 'false') {

            \DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "by" => 'er@epic',
            );
        } else {
            DB::rollBack();
            $result = array(

                "status" => 400,
                "message" => $transMessage,
                "by" => 'er@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getShiftKerja (Request $request) {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $data = \DB::select(DB::raw("SELECT sh.id,sh.kodeexternal,sh.namashift,sh.jammasuk,sh.jampulang,
            sh.factorrate,ks.kelompokshiftkerja,sh.objectkelompokshiftfk,sh.waktuistirahat
             FROM shiftkerja_m as sh
            join sdm_kelompokshift_m as ks on sh.objectkelompokshiftfk=ks.id
            where sh.kdprofile = $kdProfile and sh.statusenabled=TRUE
            "));


        $result = array(
            'data'  => $data,
            'as' => 'er@epic',
        );
        return $this->respond($result);
    }
    public function saveShiftKerja(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        try{
            if($request['id'] == ''){
                $newId = ShiftKerja::max('id') + 1;
                $newMod = new ShiftKerja();
                $newMod->id = $newId;
                $newMod->norec = $newMod->generateNewId();
                $newMod->kdprofile = $kdProfile;
            }else{
                $newMod = ShiftKerja::where('id',$request['id'])->where('kdprofile', $kdProfile)->first();
            }
            if($request['statusenabled'] == 'true' ){
                $newMod->statusenabled = $request['statusenabled'];
                $newMod->kodeexternal = $request['kodeexternal'];
                $newMod->namashift = $request['namashift'];
                $newMod->jammasuk = $request['jammasuk'];
                $newMod->jampulang = $request['jampulang'];
                $newMod->factorrate = $request['factorrate'];
                $newMod->objectkelompokshiftfk = $request['kelompokshift']['id'];
                $newMod->waktuistirahat = $request['waktuistirahat'];
            }else{
                $newMod->statusenabled = $request['statusenabled'];
            }
            $newMod->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'as' => 'er@epic',
            );
        } else {
            $transMessage = "Data Gagal Disimpan";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'as' => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }

    public function saveSDPelatihan(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
            
        try{
            if($request['a'] == 'okee'){
                $delete = \DB::table('sumberdana_m')->where('id',$request['id'])->where('kdprofile', $kdProfile)->delete();
            }
            if($request['id'] == 'xyz'){
                $newId = \DB::table('sumberdana_m')->max('id') + 1;
                $newMod = \DB::table('sumberdana_m')->insert([
                    'kdprofile' => $kdProfile,
                    'statusenabled' => true,
                    'kodeexternal' => "GRH",
                    'namaexternal' => $request['sumberdana'],
                    'reportdisplay' => $request['sumberdana'],
                    'sumberdana' => $request['sumberdana'],
                    'id'=> $newId
                ]);
            }else{
                $newMod = \DB::table('sumberdana_m')->where('id',$request['id'])->where('kdprofile', $kdProfile)->update([
                    'namaexternal' => $request['sumberdana'],
                    'reportdisplay' => $request['sumberdana'],
                    'sumberdana' => $request['sumberdana'],
                ]);
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'as' => 'er@epic',
            );
        } else {
            $transMessage = "Data Gagal Disimpan";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'as' => 'er@epic',
            );
        }
        // return $this->respond($result);
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }
    public function saveUPPelatihan(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
            
        try{
            if($request['a'] == 'okee'){
                $delete = \DB::table('unitpenginput_m')->where('id', $request['idd'])->where('kdprofile', $kdProfile)->delete();
            }
            if($request['id'] == 'xyz'){
                $newId = \DB::table('unitpenginput_m')->max('id') + 1;
                $newMod = \DB::table('unitpenginput_m')->insert([
                    'kdprofile' => $kdProfile,
                    'statusenabled' => true,
                    'kodeexternal' => "GRH",
                    'namaexternal' => $request['unitpenginput'],
                    'reportdisplay' => $request['unitpenginput'],
                    'unitpenginput' => $request['unitpenginput'],
                    'id'=> $newId
                ]);
            }else{
                $newMod = \DB::table('unitpenginput_m')->where('id',$request['id'])->where('kdprofile', $kdProfile)->update([
                    'namaexternal' => $request['unitpenginput'],
                    'reportdisplay' => $request['unitpenginput'],
                    'unitpenginput' => $request['unitpenginput'],
                ]);
            }

          

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'as' => 'er@epic',
            );
        } else {
            $transMessage = "Data Gagal Disimpan";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'as' => 'er@epic',
            );
        }
        // return $this->respond($result);
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }
    
    public function saveJenisPelatihan(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
            
        try{
            if($request['a'] == 'okee'){
                $delete = \DB::table('jenispelatihan_m')->where('id',$request['id'])->where('kdprofile', $kdProfile)->delete();
            }
            if($request['id'] == 'xyz'){
                $newId = \DB::table('jenispelatihan_m')->max('id') + 1;
                $newMod = \DB::table('jenispelatihan_m')->insert([
                    'kdprofile' => $kdProfile,
                    'statusenabled' => true,
                    'kodeexternal' => "GRH",
                    'namaexternal' => $request['jenispelatihan'],
                    'reportdisplay' => $request['jenispelatihan'],
                    'jenispelatihan' => $request['jenispelatihan'],
                    'id'=> $newId
                ]);
            }else{
                $newMod = \DB::table('jenispelatihan_m')->where('id',$request['id'])->where('kdprofile', $kdProfile)->update([
                    'namaexternal' => $request['jenispelatihan'],
                    'reportdisplay' => $request['jenispelatihan'],
                    'jenispelatihan' => $request['jenispelatihan'],
                ]);
            }

          

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'as' => 'er@epic',
            );
        } else {
            $transMessage = "Data Gagal Disimpan";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'as' => 'er@epic',
            );
        }
        // return $this->respond($result);
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }
    public function saveNamaPelatihan(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
            
        try{
            if($request['id'] == ''){
                $newId = \DB::table('namapelatihan_m')->max('id') + 1;
                $newMod = \DB::table('namapelatihan_m')->insert([
                'kdprofile' => $kdProfile,
                'statusenabled' => true,
                'kodeexternal' => "GRH",
                'namaexternal' => $request['namapelatihan'],
                'reportdisplay' => $request['namapelatihan'],
                'namapelatihan' => $request['namapelatihan'],
                'qnamapelatihan' => $newId,
                'kdnamapelatihan' => $newId,
                'id'=> $newId
                ]);
            }else{
                $newMod = \DB::table('namapelatihan_m')->where('id',$request['id'])->where('kdprofile', $kdProfile)->update([
                'namaexternal' => $request['namapelatihan'],
                'reportdisplay' => $request['namapelatihan'],
                'namapelatihan' => $request['namapelatihan'],
                ]);
            }
            if($request['statusenabled'] == 'true'){
                $delete = \DB::table('namapelatihan_m')->where('id',$request['id'])->where('kdprofile', $kdProfile)->delete();
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'as' => 'er@epic',
            );
        } else {
            $transMessage = "Data Gagal Disimpan";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'as' => 'er@epic',
            );
        }
        // return $this->respond($result);
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }
    public function getNamaPelatihan (Request $request) {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $data = \DB::select(DB::raw("select * from namapelatihan_m
                where kdprofile = $kdProfile and statusenabled=TRUE
                "));   

        $jenispelatihan = \DB::select(DB::raw("select * from jenispelatihan_m
                where kdprofile = $kdProfile and statusenabled=TRUE
                "));

        $unitpenginput = \DB::select(DB::raw("select * from unitpenginput_m
                where kdprofile = $kdProfile and statusenabled=TRUE
                "));
        $sumberdana = \DB::select(DB::raw("select * from sumberdana_m
                where kdprofile = $kdProfile and statusenabled=TRUE
                "));
        $result = array(
            'data'  => $data,
            'jenispelatihan'=>$jenispelatihan,
            'unitpenginput'=>$unitpenginput,
            'sumberdana'=>$sumberdana,
            'as' => 'er@epic',
        );
        return $this->respond($result);
    }

    public function getComboPegawai (Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $paket = Pegawai::where('statusenabled',true)->where('kdprofile', $kdProfile)->get();
        //$produk = Produk::where('statusenabled',true)->get();
        $produk = DB::table('pegawai_m as pg')
//            ->join('produk_m as prd','prd.id','=','hnp.objectprodukfk')
            ->select('pg.id','pg.nama')
            ->where('pg.statusenabled',true)
//            ->where('prd.statusenabled',true)
            ->orderBy('pg.nama')
            ->where('pg.kdprofile', $kdProfile)
            ->whereNotIn('pg.id',[2,890,3,1])
            ->distinct()
            ->get();
        $result = array(
            'paket' => $paket,
            'produk' => $produk,
            'as' => 'inhuman'
        );
        return $this->respond($result);
    }

    public function getMappingPegawai (Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $paket = DB::table('mapunitkerjatopegawai_m as mukp')
            ->join('pegawai_m as pg','pg.id','=','mukp.pegawaifk')
            ->join('unitkerjapegawai_m as ukp','ukp.id','=','mukp.unitkerjafk')
            ->select('mukp.*','pg.nama','ukp.name')
            ->where('mukp.kdprofile', $kdProfile)
            ->where('mukp.statusenabled',true);

        if(isset($request['paketId']) && $request['paketId'] !='' ){
            $paket = $paket->where('mukp.unitkerjafk',$request['paketId']);
        }
        if(isset($request['namaProduk']) && $request['namaProduk'] !='' ){
            $paket = $paket->where('pg.nama','ilike','%'.$request['namaProduk'].'%');
        }
        $paket = $paket->get();
        $result = array(
            'data' => $paket,
            'as' => 'khris@epic'
        );
        return $this->respond($result);
    }

    public function saveMapPegawaiToUnit(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        try {
            foreach ( $request['details'] as $item){
                $kode[] = (double) $item['id'];

            }

            $hapus = MapPegawaiToUnit::where('statusenabled',true)
                ->where('kdprofile', $kdProfile)
                ->where('unitkerjafk',$request['paketId'])
                ->whereIn('pegawaifk',$kode)
                ->delete();
            foreach ( $request['details'] as $item){
                $map = new MapPegawaiToUnit();
                $map->id = MapPegawaiToUnit::max('id') + 1;
                $map->kdprofile = $kdProfile;
                $map->statusenabled = true;
                $map->norec =  substr(\Webpatser\Uuid\Uuid::generate(), 0, 32);
                $map->unitkerjafk = $request['paketId'];
                $map->pegawaifk = $item['id'];
                $map->save();
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();

            $result = array(
                'status' => 201,
                'data' => $map,
                'as' => 'khris@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'as' => 'khris@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function DeleteMapPegawaiToUnit(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        try {
            foreach ($request['data'] as $item){
                MapPegawaiToUnit::where('id',$item['id'])->where('kdprofile', $kdProfile)->delete();
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();

            $result = array(
                'status' => 201,
//                'data' => $map,
                'as' => 'er@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'as' => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
      public function saveJadwalKerjaPegawai(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        try{
            
            foreach ( $request['data'] as $item){
                $pegawaiId[] = (int) $item['pegawai']['id'];
                $jadwal[] = (int) $item['shift']['id'];
                $tanggal[] = $item['tanggal']['dateformat'];
            }
            // return $this->respond($pegawaiId);

            $hapus = JadwalKerjaPegawai::where('statusenabled',true)
                ->where('kdprofile', $kdProfile)
                ->where('unitkerjafk',$request['unitkerjafk'])
                ->whereIn('pegawaifk',$pegawaiId)
                ->whereIn('jadwalkerjafk',$jadwal)
                ->whereIn('tanggal',$tanggal)
                ->delete();

            foreach ($request['data'] as $key) {
                $new = new JadwalKerjaPegawai();
                $new->kdprofile = $kdProfile;
                $new->statusenabled = true;
                $new->norec =  $new->generateNewId();
                $new->pegawaifk = $key['pegawai']['id'];
                $new->jadwalkerjafk = $key['shift']['id'];
                $new->tanggal = $key['tanggal']['dateformat'];
                $new->unitkerjafk = $request['unitkerjafk'];
                $new->save();
            }


           $transStatus = 'true';
        } catch (\Exception $e) {
          $transStatus = 'false';
        }
        if ($transStatus = 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "norec" => $new,
                "by" => 'er@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "by" => 'er@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDataPelayananPetugas(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t AS apd','apd.noregistrasifk','=','pd.norec')
            ->join('pelayananpasien_t AS pp','pp.noregistrasifk','=','apd.norec')
            ->join('pelayananpasienpetugas_t AS ppp','ppp.pelayananpasien','=','pp.norec')
            ->leftJoin('jenispetugaspelaksana_m AS jpp','jpp.id','=','ppp.objectjenispetugaspefk')
            ->leftjoin('pasien_m AS pm','pm.id','=','pd.nocmfk')
            ->leftjoin('pegawai_m AS pg','pg.id','=','ppp.objectpegawaifk')
            ->leftjoin('produk_m AS pr','pr.id','=','pp.produkfk')
            ->leftJoin('detailjenisproduk_m AS djp','djp.id','=','pr.objectdetailjenisprodukfk')
            ->leftjoin('jenisproduk_m AS jp','jp.id','=','djp.objectjenisprodukfk')
            ->leftJoin('kelompokproduk_m AS kp','kp.id','=','jp.objectkelompokprodukfk')
            ->leftJoin('kelompokpasien_m AS kps','kps.id','=','pd.objectkelompokpasienlastfk')
            ->leftJoin('rekanan_m AS rk','rk.id','=','pd.objectrekananfk')
            ->leftJoin('ruangan_m AS ru','ru.id','=','apd.objectruanganfk')
            ->leftJoin('kelas_m AS kls','kls.id','=','apd.objectkelasfk')
            ->select(DB::raw("
                 pp.norec AS norec_pp,pd.tglregistrasi,pm.nocm,pm.namapasien,pd.noregistrasi,kps.kelompokpasien,rk.namarekanan,
                 ru.namaruangan,kls.namakelas,pp.tglpelayanan,jp.jenisproduk,pr.namaproduk,pp.jumlah,
                 pp.hargajual,pd.tglpulang,jpp.jenispetugaspe AS jenispelaksana,pg.namalengkap
            "))
            ->where('pd.kdprofile', $kdProfile)
            ->where('pd.statusenabled', true)
            ->whereNotNull('pd.tglpulang');

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pp.tglpelayanan', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $data = $data->where('pp.tglpelayanan', '<=', $request['tglAkhir']);
        }
        if(isset($request['jenisPetugasPe']) && $request['jenisPetugasPe'] != "" && $request['jenisPetugasPe'] != "undefined") {
            $data = $data->where('ppp.objectjenispetugaspefk', $request['jenisPetugasPe']);
        }
        if(isset($request['pgkArr']) && $request['pgkArr']!="" && $request['pgkArr']!="undefined"){
            $arrRuang = explode(',',$request['pgkArr']) ;
            $kodeRuang = [];
            foreach ( $arrRuang as $item){
                $kodeRuang[] = (int) $item;
            }
            $data = $data->whereIn('ppp.objectpegawaifk',$kodeRuang);
        }
        $data = $data->get();
        $norecPp = '';
        $details = [];
        foreach ($data as $ob){
//            return $this->respond($ob->norec_pp);
            $norecPp = $norecPp.",'".$ob->norec_pp . "'";
        }
        $norecPp = substr($norecPp, 1, strlen($norecPp)-1);

        if($norecPp!= ''){
            $PelayananPasienDetail = DB::select(DB::raw("
               SELECT ppd.pelayananpasien AS norec_pp,kh.komponenharga,ppd.jumlah,ppd.hargasatuan,ppd.hargadiscount,ppd.jasa
               FROM pelayananpasiendetail_t AS ppd
               INNER JOIN komponenharga_m AS kh ON kh.id = ppd.komponenhargafk
               WHERE ppd.kdprofile = $kdProfile and ppd.statusenabled = true AND ppd.pelayananpasien in ($norecPp) "));
            $i = 0;
            foreach ($data as $h){
                $data[$i]->details = [];
                foreach ($PelayananPasienDetail as $d){
                    if($data[$i]->norec_pp == $d->norec_pp){
                        $data[$i]->details[] = $d;
                    }
                }
                $i++;
            }
        }

//        foreach ($data as $item) {
//            $details = \DB::select(DB::raw("select kh.komponenharga,ppd.jumlah,ppd.hargasatuan,ppd.hargadiscount,ppd.jasa
//                        from pelayananpasiendetail_t AS ppd
//                        INNER JOIN komponenharga_m AS kh ON kh.id = ppd.komponenhargafk
//                        WHERE ppd.kdprofile = $kdProfile and ppd.statusenabled = true AND ppd.pelayananpasien =:norec"),
//                array(
//                    'norec' => $item->norec_pp,
//                )
//            );
//
//            $result[] = array(
//                'norec' => $item->norec_pp,
//                'tglregistrasi' => $item->tglregistrasi,
//                'nocm' => $item->nocm,
//                'namapasien' => $item->namapasien,
//                'noregistrasi' => $item->noregistrasi,
//                'kelompokpasien' => $item->kelompokpasien,
//                'namarekanan' => $item->namarekanan,
//                'namaruangan' => $item->namaruangan,
//                'namakelas' => $item->namakelas,
//                'tglpelayanan' => $item->tglpelayanan,
//                'jenisproduk' => $item->jenisproduk,
//                'namaproduk' => $item->namaproduk,
//                'jumlah' => $item->jumlah,
//                'hargajual' => $item->hargajual,
//                'jenispelaksana' => $item->jenispelaksana,
//                'namalengkap' => $item->namalengkap,
//                'tglpulang' => $item->tglpulang,
//                'details' => $details,
//            );
//        }

        if (count($data) == 0) {
            $result = [];
        }

        $result = array(
            'data' => $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function deleteDataPegawai(Request $request){
        $kdProfile = (int)$this->getDataKdProfile($request);
        DB::beginTransaction();
        $tglAyeuna = date('Y-m-d H:i:s');
        $dataLogin = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id',$dataLogin['userData']['id'])
            ->where('lu.kdprofile', $kdProfile)
            ->first();

        $pegawai = \DB::table('pegawai_m')
                ->where('id', $request['idPegawai'])
                ->where('statusenabled', true)
                ->where('kdprofile', $kdProfile)
                ->first();

        try{
            if($request['idPegawai']!='') {
                $dataPG = Pegawai::where('id', $request['idPegawai'])
                    ->where('kdprofile', (int)$kdProfile)
                    ->update([
                            'statusenabled' => false,
                        ]
                    );

                /*Logging User*/
                $newId = LoggingUser::max('id');
                $newId = $newId +1;
                $logUser = new LoggingUser();
                $logUser->id = $newId;
                $logUser->norec = $logUser->generateNewId();
                $logUser->kdprofile= $kdProfile;
                $logUser->statusenabled=true;
                $logUser->jenislog = 'Hapus Pegawai';
                $logUser->noreff =$request['idPegawai'];
                $logUser->referensi='id pegawai';
                $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
                $logUser->tanggal = $tglAyeuna;
                $logUser->keterangan = 'Hapus Pegawai dengan Nama : '. $pegawai->namalengkap;
                $logUser->save();
                /*End Logging User*/
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "update status enabled ";
        }

        if ($transStatus == 'true') {
            $transMessage = "Hapus Berhasil";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'ramdanegie',
            );
        } else {
            $transMessage = "Hapus Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transStatus,
                'as' => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getGajiPegawai(Request $request){
        $kdProfile = (int)$this->getDataKdProfile($request);
        DB::beginTransaction();
        $tglAyeuna = date('Y-m-d');
        $data = DB::table('pegawai_m as pm')
            ->join('jenispegawai_m as jm','jm.id','=','pm.objectjenispegawaifk')
            ->select('pm.namalengkap','pm.id','pm.tgllahir','jm.jenispegawai')
            ->selectRaw('0 as total')
            ->where('pm.kdprofile',$kdProfile)
            ->where('pm.statusenabled',true)
            ->where('pm.namalengkap','ilike','%'.$request['nama'].'%')
            ->orderby('pm.namalengkap')
            ->get();
        $i = 0;
        $j = 0;
        $details = DB::table('komponengajipegawai_t as kt')
                ->distinct()
                ->select('kt.*','km.kdkomponen','km.komponengaji','km.keterangan','dt.nilai')
                ->join('komponengaji_m as km','km.id','=','kt.objectkomponengajifk')
                ->leftjoin('detailgajipegawai_t as dt',function($join){
                    $join->on('dt.objectpegawaifk','=','kt.objectpegawaifk');
                    $join->on('dt.objectkomponengajifk','=','kt.objectkomponengajifk');
                })
                ->leftjoin('strukhistori_t as st','st.norec','=','dt.nostrukhistorifk');
                // ->where('st.norec',$request['norec']);
                // ->where('st.bulanfk',$request['bulan'])
                // ->where('st.tahun',$request['tahun']);
                if (isset($request['norec']) && $request['norec'] != "" && $request['norec'] != "undefined") {
                    $details = $details->where('st.norec', '=', $request['norec']);
                } 

                // if (isset($request['bulan']) && $request['bulan'] != "" && $request['bulan'] != "undefined") {
                //     $details = $details->where('st.bulanfk', '=', $request['bulan']);
                // }       
                $bln =$request['blntahun'];
              
                // if (isset($request['tahun']) && $request['tahun'] != "" && $request['tahun'] != "undefined") {
                //     $details = $details->where('st.tahun', '=', $request['tahun']);
                // }
                $details = $details->whereRaw("to_char(kt.tglaktif,'yyyy-MM')='$bln'");
                $details = $details->get();
        // $nilai = DB::table('detailgajipegawai_t as dt')
        //         ->select('dt.*','st.norec')
        //         ->leftjoin('strukhistori_t as st','st.norec','=','dt.nostrukhistorifk')
                
        //         ->get();
        // foreach($details as $h){
        //     $details[$j]->nilai = '';
        //     foreach($nilai as $n){
        //         if($details[$j]->objectpegawaifk == $n->objectpegawaifk && $details[$j]->objectkomponengajifk == $n->objectkomponengajifk){
        //             $details[$j]->nilai = $n->nilai;
        //         }else{
        //             $details[$j]->nilai = 0;
        //         }
        //     }
        //     $j++;
        // }
        // return $details;
        foreach ($data as $h){
            $data[$i]->detail = [];
            foreach ($details as $d){
                if($data[$i]->id == $d->objectpegawaifk){
                    $data[$i]->detail[] = $d;
                }
            }
            $i++;
        }

        $result = array(
            'data' => $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function saveGaji(Request $request){
        $kdProfile = (int)$this->getDataKdProfile($request);
        DB::beginTransaction();
        $tglAyeuna = date('Y-m-d H:i:s');
        $dataLogin = $request->all();
        // return $tglAyeuna;
        // return $dataLogin;
        try{
           
            $cek =StrukHistori::where('periodeawalgaji', $request['periodeawalgaji'])
            ->where('bulanfk',$request['idbulan'])
            ->where('tahun',$request['tahun'])
            ->where('periodeakhirgaji',$request['periodeakhirgaji'])
            ->first();

            $d = DetailGajiPegawai::where('nostrukhistorifk',$cek->norec)
            ->delete();

            StrukHistori::where('periodeawalgaji', $request['periodeawalgaji'])
            ->where('bulanfk',$request['idbulan'])
            ->where('tahun',$request['tahun'])
            ->where('periodeakhirgaji',$request['periodeakhirgaji'])
            ->delete();

            $histo = new StrukHistori();
            $histo->norec = $histo->generateNewId();
            $histo->nonhistori = $this->generateCode(new StrukHistori, 'nonhistori', 10, 'HG-' . $this->getDateTime()->format('ym'), $kdProfile);
            $histo->kdprofile = $kdProfile;
            $histo->statusenabled = true;
            $histo->objectkelompoktransaksifk = 300;
            $histo->totalgaji = $request['total'];
            $histo->tglhistori = $tglAyeuna;
            $histo->tahun = $request['tahun'];
            $histo->bulanfk = $request['idbulan'];
            $histo->periodeawalgaji = $request['periodeawalgaji'];
            $histo->periodeakhirgaji = $request['periodeakhirgaji'];
            $histo->save();
            
            foreach($request['data'] as $d){
                foreach($d['detail'] as $det){
                    $dgp = new DetailGajiPegawai();
                    $dgp->norec = $dgp->generateNewId();
                    $dgp->kdprofile = $kdProfile;
                    $dgp->statusenabled = true;
                    $dgp->objectkomponengajifk = $det['objectkomponengajifk'];
                    $dgp->nilai = $det['nilai'];
                    $dgp->objectpegawaifk = $d['id'];
                    if($det['kdkomponen'] == "+"){
                        $dgp->ispendapatan = true;
                        $dgp->ispotongan = false;
                    }else{
                        $dgp->ispendapatan = false;
                        $dgp->ispotongan = true;
                    }
                    $dgp->nostrukhistorifk = $histo->norec;
                    $dgp->save();
                }
            }

            // return $clos;
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'ramdanegie',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transStatus,
                'as' => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDaftarGaji(Request $request){
        $kdProfile = (int)$this->getDataKdProfile($request);
        DB::beginTransaction();
        $i = 0;
        // $data = \DB::table('strukhistori_t as sts')
        //         ->join('bulan_m as bm','bm.id','=','st.bulanfk')
        //         ->where('st.objectkelompoktransaksifk',300)
        //         ->where('st.statusenabled',true)
        //         ->select('st.tahun','st.periodeawalgaji','st.periodeakhirgaji','bm.namabulan','st.bulanfk','st.norec')
        //         ->selectRaw("'' as periode, to_char(st.periodeawalgaji,'dd-MM') as periodeawal,to_char(st.periodeakhirgaji,'dd-MM') as periodeakhir");
                $thn = '';
                if (isset($request['tahun']) && $request['tahun'] != "" && $request['tahun'] != "undefined") {
                    // $data = $data->where('st.tahun', '=', $request['tahun']);
                    $thn =  " and st.tahun ='".$request['tahun']."'";
                }
                 $sttaus = '';
                if (isset($request['status']) && $request['status'] != "" && $request['status'] != "undefined") {
                    // $data = $data->where('st.tahun', '=', $request['tahun']);
                    $sttaus = $request['status'];
                }
        // $data = $data->get();

        $data  = DB::select(DB::raw("SELECT
            st.tahun,
            st.periodeawalgaji,
            st.periodeakhirgaji,
            bm.namabulan,
            st.bulanfk,
            st.norec,
            '' AS periode,
            to_char( st.periodeawalgaji, 'dd-MM' ) AS periodeawal,
            to_char( st.periodeakhirgaji, 'dd-MM' ) AS periodeakhir ,
            sum(dgp.nilai) as total,
             sbk.tglsbk,sbk.totalsisahutang,sbk.totaldibayar,sbk.nosbk,
             st.nonhistori
        FROM
            strukhistori_t AS st
            INNER JOIN bulan_m AS bm ON bm.id = st.bulanfk 
            inner join detailgajipegawai_t as dgp on dgp.nostrukhistorifk=st.norec
            left join strukbuktipengeluaran_t as sbk on sbk.nostrukfk=st.norec 
        WHERE
            st.objectkelompoktransaksifk = 300 
            AND st.statusenabled = true
            $thn
            
            group by st.tahun,
            st.periodeawalgaji,
            st.periodeakhirgaji,
            bm.namabulan,
            st.bulanfk,
            st.norec,
            st.periodeawalgaji,
            st.periodeakhirgaji,
            sbk.tglsbk,sbk.totalsisahutang,sbk.totaldibayar,
            sbk.nosbk,st.nonhistori"));

        foreach($data as $d){   
            $data[$i]->periode = $d->periodeawal." s/d ".$d->periodeakhir;

            $i++;
        }

        $result = array(
            'data' => $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }
    public function getComboGaji(Request $request){
        $kdProfile = (int)$this->getDataKdProfile($request);
        $carabayar = DB::table('carabayar_m')
            ->where('statusenabled',true)
            ->select('id','carabayar as caraBayar')
            ->where('kdprofile',$kdProfile)
            ->get();
         $set =$this->settingDataFixed('kdKelompokTransaksiPembayaranGaji',$kdProfile);
          $kelTrans = DB::table('kelompoktransaksi_m')
            ->where('statusenabled',true)
            ->select('id','kelompoktransaksi as kelompokTransaksi')
            ->where('kdprofile',$kdProfile)
            ->get();
         $result = array(
            'kdkelompoktransaksigaji' => $set,
            'kelompoktransaksi' => $kelTrans,
            'carabayar' => $carabayar,
            'message' => 'er@epic',
        );
        return $this->respond($result);
    }

     public function simpanPembayaranGaji(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        \DB::beginTransaction();
        
        try{
            $dataLogin = $request->all();
            $dataPegawaiUser = DB::select(DB::raw("select pg.id as pgid,pg.namalengkap,lu.id as luid,lu.namauser from loginuser_s as lu
                    INNER JOIN pegawai_m as pg on lu.objectpegawaifk=pg.id
                    where lu.kdprofile = $idProfile and lu.id=:idLoginUser"),
                array(
                    'idLoginUser' => $request['userData']['id'],
                )
            );

            $datastruk = DB::select(DB::raw("select * from strukhistori_t where kdprofile = $idProfile and norec=:nostruk"),
                array(
                    'nostruk' => $request['sbk']['nostruk'],
                )
            );
            $totaldibayarbefore=0;
            $totalsudahdibayar=0;
            $sisautang=0;
            foreach ($datastruk as $items) {
                if ($items->nosbklastfk == null || $items->nosbklastfk == ''){
                    $totaldibayarbefore=0;
                    $totalsudahdibayar=0;
                    $sisautang=(float)$request['sbk']['sisautang'] ;//- (float)$request['sbk']['totalbayar'];
                }else{

                    $datasbk = DB::select(DB::raw("select * from strukbuktipengeluaran_t where kdprofile = $idProfile and norec=:nostruk"),
                        array(
                            'nostruk' => $items->nosbklastfk,
                        )
                    );
                    foreach ($datasbk as $Hits) {
                        $totaldibayarbefore=$Hits->totaldibayar;
                        $totalsudahdibayar=$Hits->totaldibayar;
                        $sisautang=(float)$request['sbk']['sisautang'] ;//(float)$Hits->totalsisahutang;//-(float)$request['sbk']['totalbayar'];
                    }
                }
                if($request['sbk']['nosbk'] == '') {
                    $dataSBK = new StrukBuktiPengeluaran();
                    $dataSBK->norec = $dataSBK->generateNewId();
                    $dataSBK->kdprofile = $idProfile;
                    $dataSBK->statusenabled = true;
                    $dataSBK->nosbk = $this->generateCode(new StrukBuktiPengeluaran(), 'nosbk', 14, 'SV-'.$this->getDateTime()->format('ym'),$idProfile);
                }else {
                    $dataSBK = StrukBuktiPengeluaran::where('norec', $request['sbk']['nosbk'])->where('kdprofile', $idProfile)->first();

                    $delSBKCB = StrukBuktiPengeluaranCaraBayar::where('nosbkfk', $request['sbk']['nosbk'])->where('kdprofile', $idProfile)
                        ->delete();
                }
                $ket ="Pembayaran Tagihan Supplier";
                if(isset($request['sbk']['ketbayar'])){
                    $ket =$request['sbk']['ketbayar'];
                }
                $dataSBK->keteranganlainnya = $ket;
                $dataSBK->objectkelompoktransaksifk =  $request['sbk']['kelompoktransaksi'];
//            $dataSBK->objectpegawaipenerimafk  = $this->getCurrentLoginID();
                $dataSBK->tglsbk  = $request['sbk']['tglsbk'];
                $dataSBK->nostrukfk = $request['sbk']['nostruk'];
                $dataSBK->objectpegawaipembayarfk = $request['userData']['id'];
                $dataSBK->namapegawaipenerima = $request['sbk']['pemilikrekanan'];
                $dataSBK->namapegawaipembayar = $request['sbk']['pemilik'];
                $dataSBK->totaldibayar  = $request['sbk']['totalbayar'];
                $dataSBK->keterangan = $request['sbk']['keterangan'];
                $dataSBK->totaldibayarbefore = $totaldibayarbefore;
                $dataSBK->totalsudahdibayar = $totalsudahdibayar;
                $dataSBK->totalsisahutang=$sisautang;
                $dataSBK->save();
                $dataSBKNorec = $dataSBK->norec;
                $dataNoSBK =$dataSBK->nosbk;

                if ($dataSBKNorec != ''){
                     $SBPCB = new StrukBuktiPengeluaranCaraBayar();
                    $SBPCB->norec = $SBPCB->generateNewId();
                    $SBPCB->kdprofile= $idProfile;
                    $SBPCB->statusenabled = true;
                    $SBPCB->nosbkfk = $dataSBKNorec;
                    $SBPCB->namapemilik = $request['sbk']['pemilikrekanan'];
                    $SBPCB->nokartuaccount = $request['sbk']['rekeningrekanan'];
                    $SBPCB->namabank = $request['sbk']['bankrekanan'];
                    $SBPCB->carabayarfk = $request['sbk']['carabayar'];
                    $SBPCB->nourutcb = 0;
                    $SBPCB->pegawaipembayarfk = $request['userData']['id'];
                    $SBPCB->totaldibayar = $request['sbk']['totalbayar'];
                    $SBPCB->totaldibayarcashin = $request['sbk']['totalbayar'];
                    $SBPCB->save();

                   
                   

                    StrukHistori::where('norec', $request['sbk']['nostruk'])
                        ->where('kdprofile', $idProfile)
                        ->update([
                                'nosbklastfk' => $dataSBKNorec]
                        );
                }
            }


            $transStatus = 'true';
        } catch (Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan Pembayaran Berhasil Gagal";
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Pembayaran Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "norecsbk" => $dataSBKNorec,
                "nosbk" => $dataNoSBK,
                "as" => 'Cepot',
            );
        } else {
            $transMessage = "Simpan Pembayaran Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "e" => $e->getMessage .' '.$e->getLine(),
                // "nosbk" => $dataNoSBK,
                "as" => 'Cepot',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
     public function getGajiPerPegawai(Request $request){
        $kdProfile = (int)$this->getDataKdProfile($request);
        DB::beginTransaction();
       

        $data  = DB::select(DB::raw("SELECT
        pg.id as idpegawai,pg.namalengkap,pg.nomorrekening,
        sum(dgp.nilai) as amount
        FROM
            strukhistori_t AS st
            INNER JOIN bulan_m AS bm ON bm.id = st.bulanfk 
            inner join detailgajipegawai_t as dgp on dgp.nostrukhistorifk=st.norec
            inner join pegawai_m as pg on pg.id=dgp.objectpegawaifk
            WHERE
            st.objectkelompoktransaksifk = 300 
            AND st.statusenabled = true
            and st.norec ='$request[norec]'
            and st.kdprofile=$kdProfile
            
            group by pg.id,pg.namalengkap

           "));

        $setting = $this->settingDataFixed('kodeRekeningBNIDirectGaji', $kdProfile);
        $setting2 = $this->settingDataFixed('kodeRekeningBRIGaji', $kdProfile);
        $result = array(
            'data' => $data,
            'norekbni' =>$setting,
            'norekbri' =>$setting2,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }
     public function simpanPembayaranGajiArray(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        \DB::beginTransaction();
        
        try{
            $dataLogin = $request->all();
            $dataPegawaiUser = DB::select(DB::raw("select pg.id as pgid,pg.namalengkap,lu.id as luid,lu.namauser from loginuser_s as lu
                    INNER JOIN pegawai_m as pg on lu.objectpegawaifk=pg.id
                    where lu.kdprofile = $idProfile and lu.id=:idLoginUser"),
                array(
                    'idLoginUser' => $request['userData']['id'],
                )
            );

            $datastruk = DB::select(DB::raw("select * from strukhistori_t where kdprofile = $idProfile and norec=:nostruk"),
                array(
                    'nostruk' => $request['sbk']['nostruk'],
                )
            );
            $totaldibayarbefore=0;
            $totalsudahdibayar=0;
            $sisautang=0;
            foreach ($datastruk as $items) {
                if ($items->nosbklastfk == null || $items->nosbklastfk == ''){
                    $totaldibayarbefore=0;
                    $totalsudahdibayar=0;
                    $sisautang=(float)$request['sbk']['sisautang'] ;//- (float)$request['sbk']['totalbayar'];
                }else{

                    $datasbk = DB::select(DB::raw("select * from strukbuktipengeluaran_t where kdprofile = $idProfile and norec=:nostruk"),
                        array(
                            'nostruk' => $items->nosbklastfk,
                        )
                    );
                    foreach ($datasbk as $Hits) {
                        $totaldibayarbefore=$Hits->totaldibayar;
                        $totalsudahdibayar=$Hits->totaldibayar;
                        $sisautang=(float)$request['sbk']['sisautang'] ;//(float)$Hits->totalsisahutang;//-(float)$request['sbk']['totalbayar'];
                    }
                }
                if($request['sbk']['nosbk'] == '') {
                    $dataSBK = new StrukBuktiPengeluaran();
                    $dataSBK->norec = $dataSBK->generateNewId();
                    $dataSBK->kdprofile = $idProfile;
                    $dataSBK->statusenabled = true;
                    $dataSBK->nosbk = $this->generateCode(new StrukBuktiPengeluaran(), 'nosbk', 14, 'SV-'.$this->getDateTime()->format('ym'),$idProfile);
                }else {
                    $dataSBK = StrukBuktiPengeluaran::where('norec', $request['sbk']['nosbk'])->where('kdprofile', $idProfile)->first();

                    $delSBKCB = StrukBuktiPengeluaranCaraBayar::where('nosbkfk', $request['sbk']['nosbk'])->where('kdprofile', $idProfile)
                        ->delete();
                }
                $ket ="Pembayaran Tagihan Supplier";
                if(isset($request['sbk']['ketbayar'])){
                    $ket =$request['sbk']['ketbayar'];
                }
                $dataSBK->keteranganlainnya = $ket;
                $dataSBK->objectkelompoktransaksifk =  $request['sbk']['kelompoktransaksi'];
//            $dataSBK->objectpegawaipenerimafk  = $this->getCurrentLoginID();
                $dataSBK->tglsbk  = $request['sbk']['tglsbk'];
                $dataSBK->nostrukfk = $request['sbk']['nostruk'];
                $dataSBK->objectpegawaipembayarfk = $request['userData']['id'];
                $dataSBK->namapegawaipenerima = $request['sbk']['pemilikrekanan'];
                $dataSBK->namapegawaipembayar = $request['sbk']['pemilik'];
                $dataSBK->totaldibayar  = $request['sbk']['totalbayar'];
                $dataSBK->keterangan = $request['sbk']['keterangan'];
                $dataSBK->totaldibayarbefore = $totaldibayarbefore;
                $dataSBK->totalsudahdibayar = $totalsudahdibayar;
                $dataSBK->totalsisahutang=$sisautang;
                $dataSBK->save();
                $dataSBKNorec = $dataSBK->norec;
                $dataNoSBK =$dataSBK->nosbk;

                if ($dataSBKNorec != ''){
                     foreach($request['detail']  as $det){
                        $SBPCB = new StrukBuktiPengeluaranCaraBayar();
                        $SBPCB->norec = $SBPCB->generateNewId();
                        $SBPCB->kdprofile= $idProfile;
                        $SBPCB->statusenabled = true;
                        $SBPCB->nosbkfk = $dataSBKNorec;
                        $SBPCB->namapemilik = $det['NoReferral'];
                        $SBPCB->nokartuaccount = $det['beneficiaryAccount'];
                        $SBPCB->namabank = 'BRI';
                        $SBPCB->carabayarfk = $request['sbk']['carabayar'];
                        $SBPCB->nourutcb = 0;
                        $SBPCB->pegawaipembayarfk =  $request['userData']['id'];
                        $SBPCB->totaldibayar =  $det['amount'];
                        $SBPCB->totaldibayarcashin = $det['amount'];
                        $SBPCB->pegawairekeningfk = $det['idpegawai'];
                        $SBPCB->save();
                    }

                    StrukHistori::where('norec', $request['sbk']['nostruk'])
                        ->where('kdprofile', $idProfile)
                        ->update([
                                'nosbklastfk' => $dataSBKNorec]
                        );
                }
            }


            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan Pembayaran Berhasil Gagal";
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Pembayaran Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "norecsbk" => $dataSBKNorec,
                "nosbk" => $dataNoSBK,
                "as" => 'Cepot',
            );
        } else {
            $transMessage = "Simpan Pembayaran Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "e" => $e->getMessage() .' '.$e->getLine(),
                // "nosbk" => $dataNoSBK,
                "as" => 'Cepot',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDataJampelatihan(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        \DB::beginTransaction();
        $tahun = $request['tahun'];
        $st = ' ';
        if ($request['status'] == '1' ) {
            $st = 'where ds.lebih20jam =' . $request['status'];
        }
        if($request['status'] == '0') {
            $st = 'where ds.lebih20jam =' . $request['status'];
        }
        // $all = [];
        $data0 = \DB::select(DB::raw("
            /*januari*/ SELECT
            pg.ID,
            pg.namalengkap,
            pg.nippns
            FROM
                riwayatpelatihan_t rp
                left JOIN pegawai_m pg ON pg.ID = rp.objectpegawaifk 
                where rp.kdprofile = $idProfile
                and rp.statusenabled= true
                and pg.statusenabled= true
                and pg.kdprofile = $idProfile
            and date_part('year', rp.tglmulai::date) = $tahun
            GROUP BY
                pg.namalengkap,
                pg.nippns,
                pg.ID;

        "));
        $data1 = \DB::select(DB::raw("
            /*januari*/ SELECT
            pg.ID,
            pg.namalengkap,
            pg.nippns,
           
            CASE 
	WHEN SUM ( cast(rp.durasi as integer) ) FILTER ( WHERE date_part( 'month', rp.tglmulai :: DATE ) = 1 ) is not  null THEN
		SUM ( cast(rp.durasi as integer) ) FILTER ( WHERE date_part( 'month', rp.tglmulai :: DATE ) = 1 )
		ELSE
		0
END as januari
            FROM
                riwayatpelatihan_t rp
                left JOIN pegawai_m pg ON pg.ID = rp.objectpegawaifk 
                where rp.kdprofile = $idProfile
                and rp.statusenabled= true
                and pg.statusenabled= true
                and pg.kdprofile = $idProfile
            and date_part('year', rp.tglmulai::date) = $tahun
            GROUP BY
                pg.namalengkap,
                pg.nippns,
                pg.ID;
        "));
        $data2 = \DB::select(DB::raw("
            /*januari*/ SELECT
            pg.ID,
            pg.namalengkap,
            pg.nippns,
            CASE 
        WHEN SUM ( cast(rp.durasi as integer) ) FILTER ( WHERE date_part( 'month', rp.tglmulai :: DATE ) = 2 ) is not  null THEN
            SUM ( cast(rp.durasi as integer) ) FILTER ( WHERE date_part( 'month', rp.tglmulai :: DATE ) = 2 )
            ELSE
            0
    END as februari
            FROM
                riwayatpelatihan_t rp
                left JOIN pegawai_m pg ON pg.ID = rp.objectpegawaifk 
                where rp.kdprofile = $idProfile
                and rp.statusenabled= true
                and pg.statusenabled= true
                and pg.kdprofile = $idProfile
            and date_part('year', rp.tglmulai::date) = $tahun
            GROUP BY
                pg.namalengkap,
                pg.nippns,
                pg.ID;
        "));

        $data3 = \DB::select(DB::raw("
            /*januari*/ SELECT
            pg.ID,
            pg.namalengkap,
            pg.nippns,
            CASE 
            WHEN SUM ( cast(rp.durasi as integer) ) FILTER ( WHERE date_part( 'month', rp.tglmulai :: DATE ) = 3 ) is not  null THEN
                SUM ( cast(rp.durasi as integer) ) FILTER ( WHERE date_part( 'month', rp.tglmulai :: DATE ) = 3 )
                ELSE
                0
            END as maret
            FROM
                riwayatpelatihan_t rp
                left JOIN pegawai_m pg ON pg.ID = rp.objectpegawaifk 
                where rp.kdprofile = $idProfile
                and rp.statusenabled= true
                and pg.statusenabled= true
                and pg.kdprofile = $idProfile
            and date_part('year', rp.tglmulai::date) = $tahun
            GROUP BY
                pg.namalengkap,
                pg.nippns,
                pg.ID;
        "));

        $data4 = \DB::select(DB::raw("
            /*januari*/ SELECT
            pg.ID,
            pg.namalengkap,
            pg.nippns,
            CASE 
            WHEN SUM ( cast(rp.durasi as integer) ) FILTER ( WHERE date_part( 'month', rp.tglmulai :: DATE ) = 4 ) is not  null THEN
                SUM ( cast(rp.durasi as integer) ) FILTER ( WHERE date_part( 'month', rp.tglmulai :: DATE ) = 4 )
                ELSE
                0
            END as april
            FROM
                riwayatpelatihan_t rp
                left JOIN pegawai_m pg ON pg.ID = rp.objectpegawaifk 
                where rp.kdprofile = $idProfile
                and rp.statusenabled= true
                and pg.statusenabled= true
                and pg.kdprofile = $idProfile
            and date_part('year', rp.tglmulai::date) = $tahun
            GROUP BY
                pg.namalengkap,
                pg.nippns,
                pg.ID;
        "));

        $data5 = \DB::select(DB::raw("
            /*januari*/ SELECT
            pg.ID,
            pg.namalengkap,
            pg.nippns,
            CASE 
            WHEN SUM ( cast(rp.durasi as integer) ) FILTER ( WHERE date_part( 'month', rp.tglmulai :: DATE ) = 5 ) is not  null THEN
                SUM ( cast(rp.durasi as integer) ) FILTER ( WHERE date_part( 'month', rp.tglmulai :: DATE ) = 5 )
                ELSE
                0
            END as mei
            FROM
                riwayatpelatihan_t rp
                left JOIN pegawai_m pg ON pg.ID = rp.objectpegawaifk 
                where rp.kdprofile = $idProfile
                and rp.statusenabled= true
                and pg.statusenabled= true
                and pg.kdprofile = $idProfile
            and date_part('year', rp.tglmulai::date) = $tahun
            GROUP BY
                pg.namalengkap,
                pg.nippns,
                pg.ID;
        "));

        $data6 = \DB::select(DB::raw("
            /*januari*/ SELECT
            pg.ID,
            pg.namalengkap,
            pg.nippns,
            CASE 
            WHEN SUM ( cast(rp.durasi as integer) ) FILTER ( WHERE date_part( 'month', rp.tglmulai :: DATE ) = 6 ) is not  null THEN
                SUM ( cast(rp.durasi as integer) ) FILTER ( WHERE date_part( 'month', rp.tglmulai :: DATE ) = 6 )
                ELSE
                0
            END as juni
            FROM
                riwayatpelatihan_t rp
                left JOIN pegawai_m pg ON pg.ID = rp.objectpegawaifk 
                where rp.kdprofile = $idProfile
                and rp.statusenabled= true
                and pg.statusenabled= true
                and pg.kdprofile = $idProfile
            and date_part('year', rp.tglmulai::date) = $tahun
            GROUP BY
                pg.namalengkap,
                pg.nippns,
                pg.ID;
        "));

        $data7 = \DB::select(DB::raw("
            /*januari*/ SELECT
            pg.ID,
            pg.namalengkap,
            pg.nippns,
            CASE 
            WHEN SUM ( cast(rp.durasi as integer) ) FILTER ( WHERE date_part( 'month', rp.tglmulai :: DATE ) = 7 ) is not  null THEN
                SUM ( cast(rp.durasi as integer) ) FILTER ( WHERE date_part( 'month', rp.tglmulai :: DATE ) = 7 )
                ELSE
                0
            END as juli
            FROM
                riwayatpelatihan_t rp
                inner JOIN pegawai_m pg ON pg.ID = rp.objectpegawaifk 
                where rp.kdprofile = $idProfile
                and rp.statusenabled= true
                and pg.statusenabled= true
                and pg.kdprofile = $idProfile
            and date_part('year', rp.tglmulai::date) = $tahun
            GROUP BY
                pg.namalengkap,
                pg.nippns,
                pg.ID;
        "));

        $data8 = \DB::select(DB::raw("
            /*januari*/ SELECT
            pg.ID,
            pg.namalengkap,
            pg.nippns,
            CASE 
            WHEN SUM ( cast(rp.durasi as integer) ) FILTER ( WHERE date_part( 'month', rp.tglmulai :: DATE ) = 8 ) is not  null THEN
                SUM ( cast(rp.durasi as integer) ) FILTER ( WHERE date_part( 'month', rp.tglmulai :: DATE ) = 8 )
                ELSE
                0
            END as agustus
            FROM
                riwayatpelatihan_t rp
                left JOIN pegawai_m pg ON pg.ID = rp.objectpegawaifk 
                where rp.kdprofile = $idProfile
                and rp.statusenabled= true
                and pg.statusenabled= true
                and pg.kdprofile = $idProfile
            and date_part('year', rp.tglmulai::date) = $tahun
            GROUP BY
                pg.namalengkap,
                pg.nippns,
                pg.ID;
        "));

        $data9 = \DB::select(DB::raw("
            /*januari*/ SELECT
            pg.ID,
            pg.namalengkap,
            pg.nippns,
            CASE 
            WHEN SUM ( cast(rp.durasi as integer) ) FILTER ( WHERE date_part( 'month', rp.tglmulai :: DATE ) = 9 ) is not  null THEN
                SUM ( cast(rp.durasi as integer) ) FILTER ( WHERE date_part( 'month', rp.tglmulai :: DATE ) = 9 )
                ELSE
                0
            END as september
            FROM
                riwayatpelatihan_t rp
                left JOIN pegawai_m pg ON pg.ID = rp.objectpegawaifk 
                where rp.kdprofile = $idProfile
                and rp.statusenabled= true
                and pg.statusenabled= true
                and pg.kdprofile = $idProfile
            and date_part('year', rp.tglmulai::date) = $tahun
            GROUP BY
                pg.namalengkap,
                pg.nippns,
                pg.ID;
        "));

        $data10 = \DB::select(DB::raw("
            /*januari*/ SELECT
            pg.ID,
            pg.namalengkap,
            pg.nippns,
            CASE 
            WHEN SUM ( cast(rp.durasi as integer) ) FILTER ( WHERE date_part( 'month', rp.tglmulai :: DATE ) = 10 ) is not  null THEN
                SUM ( cast(rp.durasi as integer) ) FILTER ( WHERE date_part( 'month', rp.tglmulai :: DATE ) = 10 )
                ELSE
                0
            END as oktober
            FROM
                riwayatpelatihan_t rp
                left JOIN pegawai_m pg ON pg.ID = rp.objectpegawaifk 
                where rp.kdprofile = $idProfile
                and rp.statusenabled= true
                and pg.statusenabled= true
                and pg.kdprofile = $idProfile
            and date_part('year', rp.tglmulai::date) = $tahun
            GROUP BY
                pg.namalengkap,
                pg.nippns,
                pg.ID;
        "));

        $data11 = \DB::select(DB::raw("
            /*januari*/ SELECT
            pg.ID,
            pg.namalengkap,
            pg.nippns,
            CASE 
            WHEN SUM ( cast(rp.durasi as integer) ) FILTER ( WHERE date_part( 'month', rp.tglmulai :: DATE ) = 11 ) is not  null THEN
                SUM ( cast(rp.durasi as integer) ) FILTER ( WHERE date_part( 'month', rp.tglmulai :: DATE ) = 11 )
                ELSE
                0
            END as november
            FROM
                riwayatpelatihan_t rp
                left JOIN pegawai_m pg ON pg.ID = rp.objectpegawaifk 
                where rp.kdprofile = $idProfile
                and rp.statusenabled= true
                and pg.statusenabled= true
                and pg.kdprofile = $idProfile
            and date_part('year', rp.tglmulai::date) = $tahun
            GROUP BY
                pg.namalengkap,
                pg.nippns,
                pg.ID;
        "));

        $data12 = \DB::select(DB::raw("
            /*januari*/ SELECT
            pg.ID,
            pg.namalengkap,
            pg.nippns,
            CASE 
            WHEN SUM ( cast(rp.durasi as integer) ) FILTER ( WHERE date_part( 'month', rp.tglmulai :: DATE ) = 12 ) is not  null THEN
                SUM ( cast(rp.durasi as integer) ) FILTER ( WHERE date_part( 'month', rp.tglmulai :: DATE ) = 12 )
                ELSE
                0
            END as desember
            FROM
                riwayatpelatihan_t rp
                left JOIN pegawai_m pg ON pg.ID = rp.objectpegawaifk 
                where rp.kdprofile = $idProfile
                and rp.statusenabled= true
                and pg.statusenabled= true
                and pg.kdprofile = $idProfile
            and date_part('year', rp.tglmulai::date) = $tahun
            GROUP BY
                pg.namalengkap,
                pg.nippns,
                pg.ID;
        "));



        //bulan
        $januari = 0;
        $februari = 0;
        $maret = 0;
        $april = 0;
        $mei = 0;
        $juni = 0;
        $juli = 0;
        $agustus = 0;
        $september = 0;
        $oktober = 0;
        $november = 0;
        $desember = 0;

        //akumulasi
        $akujanuari = 0;
        $akufebruari=0;
        $akumaret=0;
        $akuapril=0;
        $akumei=0;
        $akujuni=0;
        $akujuli=0;
        $akuagustus=0;
        $akuseptember=0;
        $akuoktober=0;
        $akunovember=0;
        $akudesember=0;
        //detail buat ngegabungin
        $detail = [];

        foreach ($data0 as $d0) {
           //bulan
        $januari = 0;
        $februari = 0;
        $maret = 0;
        $april = 0;
        $mei = 0;
        $juni = 0;
        $juli = 0;
        $agustus = 0;
        $september = 0;
        $oktober = 0;
        $november = 0;
        $desember = 0;

        //akumulasi
        $akujanuari = 0;
        $akufebruari=0;
        $akumaret=0;
        $akuapril=0;
        $akumei=0;
        $akujuni=0;
        $akujuli=0;
        $akuagustus=0;
        $akuseptember=0;
        $akuoktober=0;
        $akunovember=0;
        $akudesember=0;

            foreach ($data1 as $d1) {
                if ($d0->id == $d1->id) {
                    $januari = $d1->januari;
                    break;
                } else {
                    $januari = 0;
                }
            }

            foreach ($data2 as $d2) {
                if ($d0->id == $d2->id) {
                    $februari = $d2->februari;
                    break;
                } else {
                    $februari = 0;
                }
            }

            foreach ($data3 as $d3) {
                if ($d0->id == $d3->id) {
                    $maret = $d3->maret;
                    break;
                } else {
                    $maret = 0;
                }
            }

            foreach ($data4 as $d4) {
                if ($d0->id == $d4->id) {
                    $april = $d4->april;
                    break;
                } else {
                    $april = 0;
                }
            }

            foreach ($data5 as $d5) {
                if ($d0->id == $d5->id) {
                    $mei = $d5->mei;
                    break;
                } else {
                    $mei = 0;
                }
            }

            foreach ($data6 as $d6) {
                if ($d0->id == $d6->id) {
                    $juni = $d6->juni;
                    break;
                } else {
                    $juni = 0;
                }
            }

            foreach ($data7 as $d7) {
                if ($d0->id == $d7->id) {
                    $juli = $d7->juli;
                    break;
                } else {
                    $juli = 0;
                }
            }

            foreach ($data8 as $d8) {
                if ($d0->id == $d8->id) {
                    $agustus = $d8->agustus;
                    break;
                } else {
                    $agustus = 0;
                }
            }

            foreach ($data9 as $d9) {
                if ($d0->id == $d9->id) {
                    $september = $d9->september;
                    break;
                } else {
                    $september = 0;
                }
            }

            foreach ($data10 as $d10) {
                if ($d0->id == $d10->id) {
                    $oktober = $d10->oktober;
                    break;
                } else {
                    $oktober = 0;
                }
            }

            foreach ($data11 as $d11) {
                if ($d0->id == $d11->id) {
                    $november = $d11->november;
                    break;
                } else {
                    $november = 0;
                }
            }

            foreach ($data12 as $d12) {
                if ($d0->id == $d12->id) {
                    $desember = $d12->desember;
                    break;
                } else {
                    $desember = 0;
                }
            }

            
            $akujanuari += $januari;
            $akufebruari += $januari + $februari;
            $akumaret += $januari + $februari+ $maret;
            $akuapril += $januari + $februari+ $maret+ $april;
            $akumei += $januari + $februari+ $maret+ $april+ $mei;
            $akujuni += $januari + $februari+ $maret+ $april+ $mei+ $juni;
            $akujuli += $januari + $februari+ $maret+ $april+ $mei+ $juni+ $juli;
            $akuagustus += $januari + $februari+ $maret+ $april+ $mei+ $juni+ $juli+ $agustus;
            $akuseptember += $januari + $februari+ $maret+ $april+ $mei+ $juni+ $juli+ $agustus+ $september;
            $akuoktober += $januari + $februari+ $maret+ $april+ $mei+ $juni+ $juli+ $agustus+ $september+ $oktober;
            $akunovember += $januari + $februari+ $maret+ $april+ $mei+ $juni+ $juli+ $agustus+ $september+ $oktober+ $november;
            $akudesember += $januari + $februari+ $maret+ $april+ $mei+ $juni+ $juli+ $agustus+ $september+ $oktober+ $november+ $desember;

            $detail[]= array(
                'namalengkap'=> $d0->namalengkap,
                'nippns'=> $d0->nippns,
                'januari'=> $januari,
                'akujanuari'=>$akujanuari,
                'februari'=> $februari,
                'akufebruari'=>$akufebruari,
                'maret'=> $maret,
                'akumaret'=>$akumaret,
                'april'=> $april,
                'akuapril'=>$akuapril,
                'mei'=> $mei,
                'akumei'=>$akumei,
                'juni'=> $juni,
                'akujuni'=>$akujuni,
                'juli'=> $juli,
                'akujuli'=>$akujuli,
                'agustus'=> $agustus,
                'akuagustus'=>$akuagustus,
                'september'=> $september,
                'akuseptember'=>$akuseptember,
                'oktober'=> $oktober,
                'akuoktober'=>$akuoktober,
                'november'=> $november,
                'akunovember'=>$akunovember,
                'desember'=> $desember,
                'akudesember'=>$akudesember,
            );
        }
        $pegawai = DB::select(DB::raw("SELECT * FROM pegawai_m 
        where namalengkap <> '-' and statusenabled = true 
        and kdprofile = 30 and namalengkap <> '%programmer%' and usereksternal is null"));
        $result = array(
            'data'=> $detail,
            'count'=> $pegawai,
            // 'sum'=> $sum,
            'as'=> 'Fizi',
        );
        return $this->respond($result);
    }
    public function getDataLaporanDiklat(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $data1 = \DB::select(DB::raw("
            with eksternal as(
            SELECT rp.namapelatihan, pg.namalengkap, pg.nippns,ukp.name, jp.jenispelatihan, rp.penyelenggara,  
            rp.tglmulai::date  || ' s/d ' || rp.tglakhir :: DATE as waktu, 
            rp.lokasipelatihan, rp.durasi, rp.biayadiklat, rp.biayasppd, ' ' as waktusosialisasi FROM pegawai_m pg
            INNER JOIN riwayatpelatihan_t rp on pg.id = rp.objectpegawaifk
            left join unitkerjapegawai_m ukp on ukp.id = pg.objectunitkerjapegawaifk
            left join jenispelatihan_m jp on jp.id = rp.jenispelatihanfk
            WHERE rp.penyelenggara ilike'eksternal'
            and pg.kdprofile = $idProfile
            and pg.statusenabled = TRUE
            and date_part('month', rp.tglmulai :: date) between '$request->bulanawal' and '$request->bulanakhir'
            and date_part('year', rp.tglmulai :: date) = $request->tahun
            )
            SELECT sum(eks.biayasppd+eks.biayadiklat)jumlahbiaya, eks.namapelatihan, eks.namalengkap, eks.nippns, eks.name  unitkerja, eks.jenispelatihan, eks.penyelenggara, eks.waktu, eks.lokasipelatihan, sum(eks.durasi::INTEGER)jumlahjam, sum(eks.biayadiklat)biayadiklat, sum(eks.biayasppd)biayasppd, eks.waktusosialisasi FROM eksternal eks 
            GROUP BY eks.namapelatihan,eks.namalengkap, eks.nippns, eks.name, eks.jenispelatihan, eks.penyelenggara, eks.waktu, eks.lokasipelatihan, eks.waktusosialisasi
            ORDER BY eks.nippns asc, eks.namalengkap asc
        "));
        $data2 = \DB::select(DB::raw("
            with eksternal as(
            SELECT pg.namalengkap, pg.nippns,ukp.name, jp.jenispelatihan, rp.penyelenggara,  
            rp.tglmulai::date  || ' s/d ' || rp.tglakhir :: DATE as waktu, 
            rp.lokasipelatihan, rp.durasi, rp.biayadiklat, rp.biayasppd, ' ' as waktusosialisasi FROM pegawai_m pg
            INNER JOIN riwayatpelatihan_t rp on pg.id = rp.objectpegawaifk
            left join unitkerjapegawai_m ukp on ukp.id = pg.objectunitkerjapegawaifk
            left join jenispelatihan_m jp on jp.id = rp.jenispelatihanfk
            WHERE rp.penyelenggara ilike'internal'
            and pg.kdprofile = $idProfile
            and pg.statusenabled = TRUE
            and date_part('month', rp.tglmulai :: date) between '$request->bulanawal' and '$request->bulanakhir'
            and date_part('year', rp.tglmulai :: date) = $request->tahun
            )
            SELECT eks.namalengkap, eks.nippns, eks.name  unitkerja, eks.jenispelatihan,eks.waktu, sum(eks.durasi::INTEGER)jumlahjam FROM eksternal eks 
            GROUP BY eks.namalengkap, eks.nippns, eks.name, eks.jenispelatihan, eks.penyelenggara, eks.waktu, eks.lokasipelatihan, eks.waktusosialisasi
            ORDER BY eks.nippns asc, eks.namalengkap asc
        "));
        $data3 = \DB::select(DB::raw("
        /*gabungan*/
	
        SELECT pg.namalengkap, pg.nippns, jb.namajabatan, jp.jenispelatihan, rp.lokasipelatihan, date_part('day', rp.tglmulai::date)||' - '||date_part('day', rp.tglakhir::date) as tgl,CASE 
        WHEN date_part('month', rp.tglmulai::date)= date_part('month', rp.tglakhir::date) THEN
       	to_char(rp.tglmulai::date,'Month')
	    ELSE
		to_char(rp.tglmulai::date,'Month')||' - '|| to_char(rp.tglakhir::date,'Month')
        END as bulan, '' as jampelaksanaan, '' as jmltotal, rp.durasi as totaljam FROM riwayatpelatihan_t rp left JOIN pegawai_m pg on pg.id = rp.objectpegawaifk left join jabatan_m jb on jb.id = pg.objectjabatanfungsionalfk left join jenispelatihan_m jp on jp.id = rp.jenispelatihanfk
        WHERE pg.kdprofile = $idProfile
        and pg.statusenabled = TRUE
        and date_part('month', rp.tglmulai :: date) between '$request->bulanawal' and '$request->bulanakhir'
        and date_part('year', rp.tglmulai :: date) = $request->tahun
        ORDER BY pg.namalengkap asc 
        "));
        $result = array(
            'eksternal'=> $data1,
            'internal'=> $data2,
            'gabungan'=> $data3,
            'as'=> 'Fizi',
        );
        return $this->respond($result);
    }
    public function gajiPegawaiV2(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin=$request->all();
        $arr_fix = $dataLogin['data'];
        $kode = [];
        foreach ( $dataLogin['data'] as $item){
            $kode[] = $item['nIP'];
        }
//        return $arr_fix;

        $data = \DB::table('pegawai_m as pg')
            ->leftjoin('gajipegawaiv2_t as gpv','pg.nippns','=','gpv.nip')
            // ->leftJoin('detailjenisproduk_m as djp','djp.id','=','pr.objectdetailjenisprodukfk')
            ->select('pg.nippns', 'pg.namalengkap','pg.id')
            ->where('pg.kdprofile', 30)
            // ->where('gpv.kdprofile', $idProfile)
            // ->groupBy('pg.id','pg.namalenk',
            //     'ss.satuanstandar')
            // ->orderBy('pg.namalengkap');
        ->whereIn('pg.nippns',$kode);
        // if(isset($request['ruanganfk']) && $request['ruanganfk']!="" && $request['ruanganfk']!="undefined"){
        //     $data = $data->where('spd.objectruanganfk','=', $request['ruanganfk']);
        // }
        $data = $data->get();

        // $data3 = \DB::table('pegawai_m as pg')
        //     ->Join('gajipegawaiv2_t as gpv','pr.id','=','gpv.objectpegawaifk')
        //     ->leftJoin('detailjenisproduk_m as djp','djp.id','=','pr.objectdetailjenisprodukfk')
        //     ->select(DB::raw('pg.nippns, pg.namalengkap'))
        //     ->where('pg.kdprofile', $idProfile)
        //     ->where('gpv.kdprofile', $idProfile)
        //     // ->groupBy('pg.id','pg.namalenk',
        //     //     'ss.satuanstandar')
        //     ->orderBy('pg.namalengkap');
        // $data3 = $data3->whereIn('pg.id',$kode);
        // $data3 = $data3->get();

        $sama = false;
        $sami = false;
        $gaBisaSave = true;
        $data2= [];
        foreach ($arr_fix as $ketanItem){
            $sama = false;
            foreach ($data as $item){
                if ($ketanItem['nIP'] == $item->nippns){
                    $sama = true;
                    $data2[] = array(
                        'nippns' => $item->nippns,
                        'namalengkap' => $item->namalengkap,
                        'gajipokok' => isset($ketanItem['gaji Pokok']) ? $ketanItem['gaji Pokok'] : null,
                        'id'=> $item->id,
                        'tunjanganumum'=> isset($ketanItem['tunjangan Umum']) ? $ketanItem['tunjangan Umum'] : null,
                        'tunjanganjabatan'=> isset($ketanItem['tunjangan Jabatan, Fungsional Tertentu']) ? $ketanItem['tunjangan Jabatan, Fungsional Tertentu'] : null,
                        'tunjanganberas'=> isset($ketanItem['tunjangan Beras']) ? $ketanItem['tunjangan Beras'] : null,
                        'tunjanganbruto'=> isset($ketanItem['jumlah Bruto']) ? $ketanItem['jumlah Bruto'] : null,
                        'potonganiwp8'=> isset($ketanItem['potongan IWP 8%']) ? $ketanItem['potongan IWP 8%'] : null,
                        'jumlahpotongan'=> isset($ketanItem['jumlah Potongan']) ? $ketanItem['jumlah Potongan'] : null,
                        'jumlahyangdibayarkan'=>  isset($ketanItem['jumlah yang dibayarkan']) ? $ketanItem['jumlah yang dibayarkan'] : null,
                    );
                }
            }
//            $data2=[];
            // if ($sama == false){
            //     foreach ($data3 as $berasMerah){
            //         $sami = false;
            //         if ($ketanItem['kd'] == $berasMerah->prid){
            //             $sami = true;
            //             $data2[] = array(
            //                 'kodeProduk' => $ketanItem['kd'],
            //                 'namaProduk' => strtoupper($berasMerah->namaproduk),
            //                 'qtyProduk' => 0,
            //                 'satuanStandar' => $item->satuanstandar,
            //                 'stokReal' => $ketanItem['qty'],
            //                 'selisih' => (double)$ketanItem['qty'] ,
            //             );
            //             break;
            //         }
            //     }
            //     if ($sami == false){
            //         $gaBisaSave = false;
            //         $data4 = \DB::table('produk_m as pr')
            //             ->leftJoin('detailjenisproduk_m as djp','djp.id','=','pr.objectdetailjenisprodukfk')
            //             ->leftJoin('jenisproduk_m as jp','jp.id','=','djp.objectjenisprodukfk')
            //             ->leftJoin('satuanstandar_m as ss','ss.id','=','pr.objectsatuanstandarfk')
            //             ->select(DB::raw('pr.id as prid,pr.namaproduk,ss.satuanstandar'))
            //             ->where('pr.kdprofile', $idProfile)
            //             ->where('spd.kdprofile', $idProfile)
            //             ->orderBy('pr.namaproduk');
            //         $data4 = $data4->where('pr.id',$ketanItem['kd']);
            //         $data4 = $data4->get();
            //         if (count($data4)==0){
            //             $data2[] = array(
            //                 'kodeProduk' => 'xxx'.$ketanItem['kd'].'xxx',
            //                 'namaProduk' => 'xxx !Kode Produk Tidak ada! xxx',
            //                 'qtyProduk' => 0,
            //                 'satuanStandar' => 'xxxxxx',
            //                 'stokReal' => $ketanItem['qty'],
            //                 'selisih' => (double)$ketanItem['qty'] ,
            //             );
            //         }else{
            //             foreach ($data4 as $berasItem){
            //                 $data2[] = array(
            //                     'kodeProduk' => 'xxx'.$ketanItem['kd'].'xxx',
            //                     'namaProduk' => 'xxx'.strtoupper($berasItem->namaproduk).'xxx!belum ada penerimaan!',
            //                     'qtyProduk' => 0,
            //                     'satuanStandar' => $berasItem->satuanstandar,
            //                     'stokReal' => $ketanItem['qty'],
            //                     'selisih' => (double)$ketanItem['qty'] ,
            //                 );
            //             }
            //         }

            //     }
            // }
        }


        $result= array(
            'detail' => $data2,
            // 'data_stok_kosong' => $data3,
            'datalogin' => $dataLogin,
            'arr_req' => $arr_fix,
            'save_cmd' => $gaBisaSave,
            'message' => 'as@epic',
        );
        return $this->respond($result);
    }
    function getGajiPegawaiV2(Request $request) {
        $data = DB::select(DB::raw("SELECT * FROM pegawai_m pg
        left join gajipegawaiv2_t gp on gp.objectpegawaifk = pg.id
        where pg.statusenabled = true and pg.kdprofile = 30 and pg.usereksternal is null and pg.namalengkap not in('-','Programmer Administrator')
        "));
        $result = array(
            'detail'=> $data,
        );
        return $this->respond($result);
    }
    public function saveGajiPegawaiV2(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        ini_set('max_execution_time', 300); //6 minutes
        $dataReq = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id',$dataReq['userData']['id'])
            ->first();
        $datas=array();
        \DB::beginTransaction();
        try{
            foreach ($request['data'] as $item) {
                $store = \DB::table('gajipegawaiv2_t')->insert([
                    'norec'=>substr(Uuid::generate(), 0, 32),
                    'objectpegawaifk' => $item['objectpegawaifk'],
                    'tglinput'=> $item['tgl'],
                    'kdprofile' => $idProfile,
                    'statusenabled'=> true,
                    'nip'=> isset($item['nippns'])? $item['nippns'] : null,
                    'gajipokok' => isset($item['gajipokok'])? $item['gajipokok'] : null,
                    'tunjanganumum' => isset($item['tunjanganumum'])? $item['tunjanganumum'] : null,
                    'tunjanganjabatan' => isset($item['tunjanganjabatan'])? $item['tunjanganjabatan'] : null,
                    'tunjanganberas' => isset($item['tunjanganberas'])? $item['tunjanganberas'] : null,
                    'tunjanganbruto' => isset($item['tunjanganbruto'])? $item['tunjanganbruto'] : null,
                    'potonganiwp8' => isset($item['potonganiwp8'])? $item['potonganiwp8'] : null,
                    'jumlahpotongan' => isset($item['jumlahpotongan'])? $item['jumlahpotongan'] : null,
                    'jumlahyangdibayarkan' => isset($item['jumlahyangdibayarkan'])? $item['jumlahyangdibayarkan'] : null,
                ]);
                
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Input Gaji Pegawai";

        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "by" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "e" => $e->getLine(). '/ ' . $e->getMessage(),
                "by" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
public function daftarKenaikanGajiBerkala(Request $request){
         $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $periodeAwal = '';
        if(isset($request['periodeAwal']) && isset($request['periodeAkhir'])){
            $periodeAwal = "and x.tgltmt between '$request[periodeAwal]' and '$request[periodeAkhir]'";
        }
        $data = \DB::select(DB::raw("
            SELECT * FROM (select pg.tmtskcpns,gol.level, rgb.norec as norec_kgb, pg.id as id_pegawai, 
            ROW_NUMBER()over(PARTITION by pg.id order by tgltmt desc)as nomor, rgb.objectgolonganfk, 
            pg.nippns, pg.namalengkap, rgb.tgltmt, gol.namaexternal as pangkat,
            gol.name as golongan, rgb.gajiakhir, split_part(rgb.masakerjagolongan, ' ', '1')::integer +2  as 
            mkg from pegawai_m pg 
            inner join riwayatgajiberkala_t rgb on rgb.objectpegawaifk = pg.id
            inner join sdm_golongan_m gol on gol.id = rgb.objectgolonganfk)as x where x.nomor = 1 and x.mkg is not null $periodeAwal order by x.tgltmt asc
        "));
        // var_dump($data);
        $data2 = '';
        $data3 = '';
        $namalengkap = '';
        $nippns = '';
        $tgltmt = '';
        $pangkat = '';
        $golongan = '';
        $gajiakhir = '';
        $gajibaru = '';
        $mkg = '';
        $objectgolonganfk = '';
        $idpegawai = "";
        $masakerjagolongan= "";
        $detail = [];
        
        foreach ($data as $dt) {
            $namalengkap = '';
            $nippns = '';
            $tgltmt = '';
            $pangkat = '';
            $golongan = '';
            $gajiakhir = '';
            $gajibaru = '';
            $mkg = '';
            $idpegawai = "";
            $objectgolonganfk = '';
            $masakerjagolongan= "";

            $gajigolongan = \DB::table("gajigolongan_m as gg")
            ->where("gg.golonganfk",$dt->objectgolonganfk)
            ->where("gg.mkg",$dt->mkg)
            ->select('gg.gajipokok')
            ->get();
            // var_dump($gajigolongan);

            
            $namalengkap = $dt->namalengkap;
            $nippns = $dt->nippns;
            $tgltmt = $dt->tgltmt;
            $pangkat = $dt->pangkat;
            $golongan = $dt->golongan;
            $gajiakhir = $dt->gajiakhir;
            $objectgolonganfk = $dt->objectgolonganfk;
            // $masakerjagolongan = $dt->masakerjagolongan;
            $tmtskcpns = $dt->tmtskcpns;
            $level = $dt->level;
            // $levelcpns = $dt->levelcpns;
            $norec_kgb = $dt->norec_kgb;
           
            // $data3 = $dt->mkg;
            $mkg = $dt->mkg;
            $idpegawai = $dt->id_pegawai;
            foreach ($gajigolongan as $gg) {
                $gajibaru = $gg->gajipokok;
            }

            $detail[]= array(
            'id_pegawai'=> $idpegawai,
            'namalengkap' => $namalengkap,
            'nippns' => $nippns,
            'tgltmt' => $tgltmt,
            'pangkat' => $pangkat,
            'golongan' => $golongan,
            'gajiakhir' => $gajiakhir,
            'gajibaru' => $gajibaru,
            'tmtskcpns' => $tmtskcpns,
            'objectgolonganfk'=> $objectgolonganfk,
            // 'masakerjagolongan'=> $masakerjagolongan,
            'level'=> $level,
            // 'levelcpns'=> $levelcpns,
            'norec_kgb'=> $norec_kgb,
            // 'data'=> $data,
            'mkg'=> $mkg,
        );
        }
        

        $result = array(
            "data" => $data,
            "detail"=> $detail,
            // 'idgol'=> $data2,
            // 'mkgplus'=>$data3,
            // 'mkg'=>$data4,
            "by" => 'as@epic',
        );
        return $this->respond($result);

    }
	public function simpanDataABK(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        //ini_set('max_execution_time', 300); //6 minutes
        $dataReq = $request->all();

        foreach($request['stokProduk'] as $item) {
            $dataSPDK =ABKPegawai::where('objectpendidikanpegawaifk', $item['id'])
            ->where('kdprofile',$idProfile)
            ->first();

            $dataSPDK->kebutuhanl = $item['kebutuhanl'];
            $dataSPDK->kekuranganl = $item['kekuranganl'];
            $dataSPDK->kebutuhanp = $item['kebutuhanp'];
            $dataSPDK->kekuranganp = $item['kekuranganp'];
            $dataSPDK->save();
        }

        $data = DB::select(DB::raw("select a.kategorifk, b.subkategorifk, ppg.pendidikanpegawai, ppg.id, abt.kebutuhanl, abt.kekuranganl, abt.kebutuhanp, abt.kekuranganp
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
        and ppg.statusenabled = true
        order by ppg.nourut asc;"));
        
        return $this->respond($data);
    }


    public function simpanSisaCuti(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;

        \DB::beginTransaction();
        try {
            $skh = \DB::table('sisacuti_t')->insert([
                "norec"=> substr(Uuid::generate(), 0, 32),
                "kdprofile"=>$idProfile,
                "statusenabled"=> true,
                "tahun"=> (int)$request['tahun'],
                "sisa"=> (int)$request['sisacuti'],
            ]);

            $transStatus = true;
        } catch (\Throwable $th) {
             $transStatus = false;
        }
        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil" ;
            DB::commit();
            $result = array(
                'status' => 201,
                // 'message' => $TP,
                'as' => 'asepic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $th->getMessage() ,
                 "e" => $th->getLine(),
                'as' => 'asepic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function LaporanPenggunaTotal(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $data = \DB::select(DB::raw("SELECT 
        x.pelayanan, 
        sum(x.mhs)filter(where x.bulan = 1)as januari,
        sum(x.mhs)filter(where x.bulan = 2)as februari,
        sum(x.mhs)filter(where x.bulan = 3)as maret,
        sum(x.mhs)filter(where x.bulan = 4)as april,
        sum(x.mhs)filter(where x.bulan = 5)as mei,
        sum(x.mhs)filter(where x.bulan = 6)as juni,
        sum(x.mhs)filter(where x.bulan = 7)as juli,
        sum(x.mhs)filter(where x.bulan = 8)as agustus,
        sum(x.mhs)filter(where x.bulan = 9)as september,
        sum(x.mhs)filter(where x.bulan = 10)as oktober,
        sum(x.mhs)filter(where x.bulan = 11)as november,
        sum(x.mhs)filter(where x.bulan = 12)as desember,
        sum(x.mhs)as total
        FROM (
            SELECT djp.detailjenisproduk as pelayanan,date_part('month', pe.tanggalmulai::date)as bulan, pe.jumlahpeserta as mhs
            from sdm_penelitianeksternal_t pe 
            left join detailjenisproduk_m djp on djp.id = pe.objectdetailjenisprodukfk
            where date_part('year', pe.tanggalmulai) = $request[tahun] and pe.kdprofile = $idProfile and pe.statusenabled = true 
            ORDER BY djp.detailjenisproduk
        )as x
        GROUP BY x.pelayanan
        "));

        return $this->respond($data);
    }
    public function DaftarKegiatanPembimbing(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $pegawai = "";
        if (isset($request['pegawai']) && $request['pegawai'] != "") {
            $pegawai = "and pdr.objectpegawaifk =". $request['pegawai'];
        }
        $dokter = "";
        if (isset($request['dokter']) && $request['dokter'] != "") {
            $dokter = " and pdr.objectpegawaifk =". $request['dokter'];
        }
        $data = \DB::select(DB::raw("
        SELECT x.id as id_pegawai, x.norec as kegiatanfk, x.detailjenisproduk as kegiatan, x.diklatkategori, x.namalengkap, string_agg(x.nama, ', ')as peserta, x.periode, x.namaruangan,x.id_ruangan, x.institusipendidikan, x.tglmasukbimbingan, x.tglkeluarbimbingan FROM (SELECT 
        djp.detailjenisproduk, pde.norec, pg.namalengkap, pdd.nama, dk.diklatkategori, pde.tanggalmulai::date || ' s.d ' || pde.tanggalselesai::date as periode, 
        pde.institusipendidikan,pg.id, ru.namaruangan,pdr.tglmasuk::date as tglmasukbimbingan, pdr.tglkeluar::date as tglkeluarbimbingan, ru.id as id_ruangan
        FROM
            sdm_pdruangan_t pdr
            INNER JOIN sdm_pesertadidik_t pdd on pdd.norec = pdr.noregistrasifk
            INNER JOIN sdm_penelitianeksternal_t pde on pde.norec = pdd.noregistrasifk
            INNER JOIN detailjenisproduk_m djp on djp.id = pde.objectdetailjenisprodukfk
            INNER JOIN pegawai_m pg on pg.id = pdr.objectpegawaifk
            inner join ruangan_m ru on ru.id = pdr.objectruanganlastfk
            inner join diklatkategori_m dk on dk.id = pde.objectdiklatkategorifk where pdr.tglmasuk::date between '$request[tglawal]' and '$request[tglakhir]' 
            $pegawai
            $dokter
            )as x
            GROUP BY x.norec, x.id,x.detailjenisproduk, x.namalengkap, x.diklatkategori, x.periode,x.namaruangan, x.institusipendidikan,x.id_ruangan, x.tglmasukbimbingan, x.tglkeluarbimbingan
        "));

        return $this->respond($data);
    }
    public function saveKegiatanPembimbing(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        \DB::beginTransaction();
        try {
            $skh = \DB::table('sdm_hasilkegiatan_t')->insert([
                "norec"=> substr(Uuid::generate(), 0, 32),
                "kdprofile"=>$idProfile,
                "statusenabled"=> true,
                "objectpegawaifk"=> $request['objectpegawaifk'],
                "objectruanganfk"=> $request['objectruanganfk'],
                "tglmasukbimbingan"=> $request['tglmasukbimbingan'],
                "tglkeluarbimbingan"=> $request['tglkeluarbimbingan'],
                "kegiatanfk"=> $request['kegiatanfk'],
                "hasilkegiatan"=> $request['hasilkegiatan'],
                "mahasiswa"=> $request['mahasiswa'],
                "tglhasilkegiatan"=> $request['tglhasilkegiatan'],
            ]);
             $transStatus = true;
        } catch (\Throwable $th) {
             $transStatus = false;
        }
        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil" ;
            DB::commit();
            $result = array(
                'status' => 201,
                // 'message' => $TP,
                'as' => 'asepic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $e->getMessage() ,
                 "e" => $e->getLine(),
                'as' => 'asepic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function DetailHasilKegiatan(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $data = \DB::select(DB::raw(
            "SELECT
            hk.tglhasilkegiatan,
            ru.namaruangan,
            hk.hasilkegiatan 
        FROM
            sdm_hasilkegiatan_t hk
            INNER JOIN ruangan_m ru ON ru.ID = hk.objectruanganfk
        WHERE
            hk.kdprofile = $idProfile
            AND hk.statusenabled = TRUE 
            AND hk.objectruanganfk = $request[ruangan]
            and hk.tglmasukbimbingan = '$request[tglmasukbimbingan]'
            and hk.tglkeluarbimbingan = '$request[tglkeluarbimbingan]'
            and hk.kegiatanfk ilike '$request[noregistrasifk]'
            -- and hk.objectpegawaifk = $request[pegawaifk]
            "));

        return $this->respond($data);
    }
    public function getDaftarMahasiswaAktif(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $jenisKegiatanTemp = "";
        $institusiTemp = "";
        $mahasiswaTemp = "";
        if(isset($request['jeniskegiatan'])){
            $jenisKegiatanTemp = "and spe.objectdiklatkategorifk =". $request['jeniskegiatan'];
        }
        if(isset($request['institusipendidikan'])){
            $institusiTemp = " and spe.institusipendidikan ilike '%$request[institusipendidikan]%'" ;
        }
        if(isset($request['mahasiswa'])){
            $mahasiswaTemp = " and spd.nama ilike '%$request[mahasiswa]%'" ;
        }

        $data = \DB::select(DB::raw(
            "SELECT
                spe.institusipendidikan,
                spd.nama,
                spd.nim,
                jk.jeniskelamin,
                pg.namalengkap,
                ru.namaruangan,
                spe.tanggalmulai::date,
                spe.tanggalselesai::date
            FROM
                sdm_pesertadidik_t spd
                inner join sdm_penelitianeksternal_t spe on spe.norec = spd.noregistrasifk
                inner join jeniskelamin_m jk on jk.id =spd.jeniskelaminfk
                left join pegawai_m pg on pg.id = spd.objectpegawailastfk
                left join ruangan_m ru on ru.id = spd.objectruanganlastfk
            WHERE
            spd.kdprofile = 30 and spd.statusenabled = true
            $jenisKegiatanTemp
            $institusiTemp
            $mahasiswaTemp
            -- and spe.tanggalmulai::date >= '$request[tanggalmulai]'::date 
            -- or spe.tanggalselesai <= '$request[tanggalselesai]'::date
            and spe.tanggalselesai > CURRENT_DATE
            order by spe.tanggalmulai asc, spe.institusipendidikan asc
            "
        ));
        return $this->respond($data,'Fizi');
    }

    public function getGajiTunjangan(Request $request)
    {
        $data = \DB::select(DB::raw("SELECT x.namalengkap,x.nippns, x.namajabatan, x.tglsk,x.tunjangan 
        FROM (SELECT 
            row_number()over(partition by pg.id ORDER BY rj.tglsk desc)as baris ,pg.namalengkap, pg.nippns, rj.tglsk, rj.tunjangan, rj.namajabatan 
            FROM riwayatjabatan_t rj 
            inner join pegawai_m pg on pg.id = rj.objectpegawaifk )as x 
            where x.baris = 1"));
        
        return $this->respond($data);
    }
    public function saveRiwayatPendidikan(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        \DB::beginTransaction();
        $jns ="";
        try {
            $dataSavePegawai = Pegawai::where('id', $request['objectpegawaifk'])->where('kdprofile', $kdProfile)->first();
            if(isset($request['datahapus'])){
                $datahapus = RiwayatPendidikan::where('norec', $request['norec'])
                    ->where('kdprofile', $kdProfile)
                    ->where('objectpegawaifk',$request['objectpegawaifk'])
                    ->delete();
            $jns ="Hapus ";

            }
            else if ($request['norec'] == ""){

                $dataSavePegawai->objectpendidikanpegawaifk =$request['objectpendidikanpegawaifk'];
                $dataSavePegawai->save();

                $dataSavePendidikan = new RiwayatPendidikan();
                $dataSavePendidikan->kdprofile = $kdProfile;
                $dataSavePendidikan->statusenabled=true;
                $dataSavePendidikan->norec = $dataSavePendidikan->generateNewId();
                $dataSavePendidikan->objectpegawaifk = $request['objectpegawaifk'];
                $jns ="Simpan ";
                $dataSavePendidikan->namatempatpendidikan = $request['namatempatpendidikan'];
                $dataSavePendidikan->alamattempatpendidikan = $request['alamattempatpendidikan'];
                $dataSavePendidikan->objectpendidikanpegawaifk =$request['objectpendidikanpegawaifk'];
                $dataSavePendidikan->jurusan = $request['jurusan'];
                $dataSavePendidikan->tglmasuk = $request['tglmasuk'];
                $dataSavePendidikan->tgllulus = $request['tgllulus'];
                $dataSavePendidikan->nilaiipk = $request['nilaiipk'];
                $dataSavePendidikan->noijazah = $request['noijazah'];
                if (isset($request['tglijazah'])){
                    $dataSavePendidikan->tglijazah = $request['tglijazah'];
                }
                $dataSavePendidikan->save();
            }else{
                $jns ="Ubah ";
                $dataSavePendidikan = RiwayatPendidikan::where('norec', $request['norec'])
                    ->where('kdprofile', $kdProfile)
                    ->where('objectpegawaifk',$request['objectpegawaifk'])
                    ->first();
                $dataSavePegawai->objectpendidikanpegawaifk =$request['objectpendidikanpegawaifk'];
                $dataSavePegawai->save();

                $dataSavePendidikan->namatempatpendidikan = $request['namatempatpendidikan'];
                $dataSavePendidikan->alamattempatpendidikan = $request['alamattempatpendidikan'];
                $dataSavePendidikan->objectpendidikanpegawaifk =$request['objectpendidikanpegawaifk'];
                $dataSavePendidikan->jurusan = $request['jurusan'];
                $dataSavePendidikan->tglmasuk = $request['tglmasuk'];
                $dataSavePendidikan->tgllulus = $request['tgllulus'];
                $dataSavePendidikan->nilaiipk = $request['nilaiipk'];
                $dataSavePendidikan->noijazah = $request['noijazah'];
                if (isset($request['tglijazah'])){
                    $dataSavePendidikan->tglijazah = $request['tglijazah'];
                }
                $dataSavePendidikan->save();
                }
            
            
            $transStatus = true;
            
        } catch (\Throwable $th) {
            $transStatus = false;
        }
        if ($transStatus == 'true') {
            $transMessage = $jns . "Berhasil" ;
            DB::commit();
            $result = array(
                'status' => 201,
                // 'message' => $TP,
                'as' => 'asepic',
            );
        } else {
            $transMessage = $jns . "Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $th->getMessage() ,
                "e" => $th->getLine(),
                'as' => 'asepic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveRiwayatPelatihan(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        \DB::beginTransaction();
        $jns ="";
        try {
            if ($request['norec'] == ""){
                $jns ="Simpan ";
                $dataSavePelatihan = new RiwayatPelatihan();
                $dataSavePelatihan->kdprofile = $kdProfile;
                $dataSavePelatihan->statusenabled=true;
                $dataSavePelatihan->norec = $dataSavePelatihan->generateNewId();
                $dataSavePelatihan->objectpegawaifk = $request['objectpegawaifk'];
                $dataSavePelatihan->instansipenyelenggara = $request['instansipenyelenggara'];
                $dataSavePelatihan->namapelatihan = $request['namapelatihan'];
                $dataSavePelatihan->lokasipelatihan =$request['lokasipelatihan'];
                $dataSavePelatihan->tglmulai = $request['tglmulai'];
                $dataSavePelatihan->tglakhir = $request['tglakhir'];
                $dataSavePelatihan->durasi = $request['durasi'];
                $dataSavePelatihan->unitpenginputfk = $request['unitpenginputfk'];
                $dataSavePelatihan->jenispelatihanfk = $request['jenispelatihanfk'];
                $dataSavePelatihan->penyelenggara = $request['penyelenggara'];
                $dataSavePelatihan->biayadiklat = $request['biayadiklat'];
                $dataSavePelatihan->biayasppd = $request['biayasppd'];
                $dataSavePelatihan->sumberdanafk = $request['sumberdanafk'];

                if (isset($request['nosertifikat'])){
                    $dataSavePelatihan->nosertifikat = $request['nosertifikat'];
                }
                if (isset($request['keterangan'])){
                    $dataSavePelatihan->keterangan = $request['keterangan'];
                }
                $dataSavePelatihan->save();
            }else{
                $jns ="Ubah ";

                $dataSavePelatihan = RiwayatPelatihan::where('norec', $request['norec'])
                    ->where('kdprofile', $kdProfile)
                    ->where('objectpegawaifk',$request['objectpegawaifk'])
                    ->first();
                $dataSavePelatihan->instansipenyelenggara = $request['instansipenyelenggara'];
                $dataSavePelatihan->namapelatihan = $request['namapelatihan'];
                $dataSavePelatihan->lokasipelatihan =$request['lokasipelatihan'];
                $dataSavePelatihan->tglmulai = $request['tglmulai'];
                $dataSavePelatihan->tglakhir = $request['tglakhir'];
                $dataSavePelatihan->durasi = $request['durasi'];
                $dataSavePelatihan->unitpenginputfk = $request['unitpenginputfk'];
                $dataSavePelatihan->jenispelatihanfk = $request['jenispelatihanfk'];
                $dataSavePelatihan->penyelenggara = $request['penyelenggara'];
                $dataSavePelatihan->biayadiklat = $request['biayadiklat'];
                $dataSavePelatihan->biayasppd = $request['biayasppd'];
                $dataSavePelatihan->sumberdanafk = $request['sumberdanafk'];

                if (isset($request['nosertifikat'])){
                    $dataSavePelatihan->nosertifikat = $request['nosertifikat'];
                }
                if (isset($request['keterangan'])){
                    $dataSavePelatihan->keterangan = $request['keterangan'];
                }
                $dataSavePelatihan->save();
            }
            
            $transStatus = true;
            
        } catch (\Throwable $th) {
            $transStatus = false;
        }
        if ($transStatus == 'true') {
            $transMessage = $jns . "Berhasil" ;
            DB::commit();
            $result = array(
                'status' => 201,
                // 'message' => $TP,
                'as' => 'asepic',
            );
        } else {
            $transMessage = $jns . "Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $th->getMessage() ,
                "e" => $th->getLine(),
                'as' => 'asepic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveRiwayatJabatan(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        \DB::beginTransaction();
        $jns ="";
        try {
            if(isset($request['datahapus'])){
                $datahapus = RiwayatJabatan::where('norec', $request['norec'])
                    ->where('kdprofile', $kdProfile)
                    ->where('objectpegawaifk',$request['objectpegawaifk'])
                    ->delete();
                $jns ="Hapus ";

            }else if ($request['norec'] == ""){
                $jns ="Simpan ";
                    $dataSaveJabatan = new RiwayatJabatan();
                    $dataSaveJabatan->kdprofile = $kdProfile;
                    $dataSaveJabatan->statusenabled=true;
                    $dataSaveJabatan->norec = $dataSaveJabatan->generateNewId();
                    $dataSaveJabatan->objectpegawaifk = $request['objectpegawaifk'];
                    $dataSaveJabatan->objectjenisjabatanfk = $request['objectjenisjabatanfk'];
                    $dataSaveJabatan->objectjabatanfk = $request['objectjabatanfk'];
                    $dataSaveJabatan->namajabatan =$request['namajabatan'];
                    $dataSaveJabatan->nosk = $request['nosk'];
                    $dataSaveJabatan->tglsk = $request['tglsk'];
                    $dataSaveJabatan->ttdsk = $request['ttdsk'];
                    $dataSaveJabatan->tunjangan = $request['tunjangan'];
                    // $dataSaveJabatan->tunjangan = $request['tunjangan'];
                    $dataSaveJabatan->ttdjabatansk = $request['ttdjabatansk'];
                    $dataSaveJabatan->instansi = $request['instansi'];
                    $dataSaveJabatan->tmtjabatan = $request['tmtjabatan'];
                    $dataSaveJabatan->eselon = $request['eselon'];

                    // $dataSaveJabatan->objectjabatanttdfk = $request['objectjabatanttdfk'];
                    $dataSaveJabatan->save();

                    $pegawai = Pegawai::where('id', $request['objectpegawaifk'])->first();
                    $pegawai->objectjabatanfungsionalfk = $request['objectjabatanfk'];
                    $pegawai->tunjanganakhir = $request['tunjangan'];
                    $pegawai->save();

            }else{
                $jns ="Ubah ";
                $dataSaveJabatan = RiwayatJabatan::where('norec', $request['norec'])
                    ->where('kdprofile', $kdProfile)
                    ->where('objectpegawaifk',$request['objectpegawaifk'])
                    ->first();
                $dataSaveJabatan->objectjenisjabatanfk = $request['objectjenisjabatanfk'];
                $dataSaveJabatan->objectjabatanfk = $request['objectjabatanfk'];
                $dataSaveJabatan->namajabatan =$request['namajabatan'];
                $dataSaveJabatan->nosk = $request['nosk'];
                $dataSaveJabatan->tglsk = $request['tglsk'];
                $dataSaveJabatan->ttdsk = $request['ttdsk'];
                $dataSaveJabatan->tunjangan = $request['tunjangan'];
                // $dataSaveJabatan->tunjangan = $request['tunjangan'];
                $dataSaveJabatan->ttdjabatansk = $request['ttdjabatansk'];
                // $dataSaveJabatan->objectjabatanttdfk = $request['objectjabatanttdfk'];
                $dataSaveJabatan->save();

                $pegawai = Pegawai::where('id', $request['objectpegawaifk'])->first();
                $pegawai->objectjabatanfungsionalfk = $request['objectjabatanfk'];
                $pegawai->tunjanganakhir = $request['tunjangan'];
                $dataSaveJabatan->eselon = $request['eselon'];
                $pegawai->save();

                }
                    
                
            
            
            $transStatus = true;
            
        } catch (\Throwable $th) {
            $transStatus = false;
        }
        if ($transStatus == 'true') {
            $transMessage = $jns . "Berhasil" ;
            DB::commit();
            $result = array(
                'status' => 201,
                // 'message' => $TP,
                'as' => 'asepic',
            );
        } else {
            $transMessage = $jns . "Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $th->getMessage() ,
                "e" => $th->getLine(),
                'as' => 'asepic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    
    public function saveRiwayatPangkatGolongan(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        \DB::beginTransaction();
        $jns ="";
        try {
            if ($request['norec'] == ""){
                $jns ="Simpan ";
                
                \DB::table("riwayatgolongan_t")->insert([
                'norec' => substr(Uuid::generate(), 0, 32),
                'kdprofile'=> $kdProfile,
                'statusenabled'=> true,
                'objectpegawaifk'=> $request['objectpegawaifk'],
                'objectgolonganfk'=> $request['objectgolonganfk'],
                'tglsk'=>$request['tglsk'],
                'tgltmt'=>$request['tgltmt'],
                'pejabatmenetapkan'=> $request['pejabatmenetapkan'] ,
                'nosk'=> $request['nosk'],
                'nominal'=> $request['nominal'],
                'masakerjagolongan'=> $request['masakerjagolongan'],
                'pejabatpenandatangan'=> $request['pejabatpenandatangan'],
                ]);

                DB::table("pegawai_m")->where("id", "=", $request['objectpegawaifk'])->update([
                // 'objectgolonganfk'=> $request['objectgolonganfk'],
                'gajiakhir'=> $request['nominal']
                ]);
            }else{
                $jns ="Ubah ";
                \DB::table("riwayatgolongan_t")
                ->where('norec', $request['norec'])
                ->where('kdprofile', $kdProfile)
                ->where('objectpegawaifk', $request['objectpegawaifk'])
                ->update([
                    // 'statusenabled'=> true,
                    'objectgolonganfk'=> $request['objectgolonganfk'],
                    'tglsk'=>$request['tglsk'],
                    'tgltmt'=>$request['tgltmt'],
                    'pejabatmenetapkan'=> $request['pejabatmenetapkan'] ,
                    'nosk'=> $request['nosk'],
                    'nominal'=> $request['nominal'],
                    'masakerjagolongan'=> $request['masakerjagolongan'],
                    'pejabatpenandatangan'=> $request['pejabatpenandatangan'],
                ]);
                
                DB::table("pegawai_m")->where("id", "=", $request['objectpegawaifk'])->update([
                    'objectgolonganfk'=> $request['objectgolonganfk'],
                    // 'gajiakhir'=> $request['nominal']
                ]);
                
            }
            
            $transStatus = true;
            
        } catch (\Throwable $th) {
            $transStatus = false;
        }
        if ($transStatus == 'true') {
            $transMessage = $jns . "Berhasil" ;
            DB::commit();
            $result = array(
                'status' => 201,
                // 'message' => $TP,
                'as' => 'asepic',
            );
        } else {
            $transMessage = $jns . "Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $th->getMessage() ,
                "e" => $th->getLine(),
                'as' => 'asepic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function updateGolonganTerakhir(Request $request)
    {
        
        $kdProfile = (int) $this->getDataKdProfile($request);
        \DB::beginTransaction();
        $jns ="";
        try {
            $jns = "Update Golongan Terakhir ";
                DB::table("pegawai_m")->where("id", "=", $request['objectpegawaifk'])->update([
                'objectgolonganfk'=> $request['objectgolonganfk'],
                'gajiakhir'=> $request['nominal']
                ]);
            
            $transStatus = true;
            
        } catch (\Throwable $th) {
            $transStatus = false;
        }
        if ($transStatus == 'true') {
            $transMessage = $jns . "Berhasil" ;
            DB::commit();
            $result = array(
                'status' => 201,
                // 'message' => $TP,
                'as' => 'asepic',
            );
        } else {
            $transMessage = $jns . "Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $th->getMessage() ,
                "e" => $th->getLine(),
                'as' => 'asepic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveRiwayatGajiBerkala(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        \DB::beginTransaction();
        $jns ="";
        try {
            if ($request['norec'] == "") {
                $jns = "Simpan ";
                \DB::table("riwayatgajiberkala_t")->insert([
                'norec' => substr(Uuid::generate(), 0, 32),
                'kdprofile'=> $kdProfile,
                'statusenabled'=> true,
                'objectpegawaifk'=> $request['objectpegawaifk'],
                'gajiawal'=> $request['gajiawal'],
                'gajiakhir'=> $request['gajiakhir'],
                'tglsk'=>$request['tglsk'],
                'tgltmt'=>$request['tgltmt'],
                'pejabatmenetapkan'=> $request['pejabatmenetapkan'] ,
                'nosk'=> $request['nosk'],
                'objectgolonganfk'=>$request['objectgolonganfk'],
                'nosurat'=>$request['nosurat'],
                'noskcetak'=>$request['noskcetak'],
                'tgltmtcetak'=>$request['tgltmtcetak'],
                'jenissk'=>$request['jenissk'],
                'jenisskco'=>$request['jenisskco'],
                'tglskbaru'=>$request['tglskbaru'],
                'masakerjagolongan'=>$request['masakerjagolongan'],
                'objectsuratkeputusanfk'=>$request['objectsuratkeputusanfk'],
                ]);
                $getgol = \DB::table("pegawai_m")->where("id", "=", $request['objectpegawaifk'])->get();
                foreach ($getgol as $gg) {
                    if($request['objectgolonganfk'] == $gg->objectgolonganfk){
                        DB::table("pegawai_m")->where("id", $request['objectpegawaifk'])->update([
                        // 'objectgolonganfk'=> $request['objectgolonganfk'],
                        'gajiakhir'=> $request['gajiakhir']
                        ]);
                    }
                }
            }else{
                $jns = "Ubah ";
                \DB::table("riwayatgajiberkala_t")
                ->where('norec', $request['norec'])
                ->where('kdprofile', $kdProfile)
                ->where('objectpegawaifk', $request['objectpegawaifk'])
                ->update([
                    // 'statusenabled'=> true,
                    'gajiawal'=> $request['gajiawal'],
                    'gajiakhir'=> $request['gajiakhir'],
                    'tglsk'=>$request['tglsk'],
                    'tgltmt'=>$request['tgltmt'],
                    'pejabatmenetapkan'=> $request['pejabatmenetapkan'] ,
                    'nosk'=> $request['nosk'],
                    'nosurat'=>$request['nosurat'],
                    'noskcetak'=>$request['noskcetak'],
                    'tgltmtcetak'=>$request['tgltmtcetak'],
                    'jenissk'=>$request['jenissk'],
                    'jenisskco'=>$request['jenisskco'],
                    'tglskbaru'=>$request['tglskbaru'],
                    'masakerjagolongan'=>$request['masakerjagolongan'],
                    'objectsuratkeputusanfk'=>$request['objectsuratkeputusanfk'],
                ]);

                DB::table("pegawai_m")->where("id", "=", $request['objectpegawaifk'])->update([
                    'objectgolonganfk'=> $request['objectgolonganfk'],
                    'gajiakhir'=> $request['nominal']
                ]);
            }

            
            $transStatus = true;
            
        } catch (\Throwable $th) {
            $transStatus = false;
        }
        if ($transStatus == 'true') {
            $transMessage = $jns . "Berhasil" ;
            DB::commit();
            $result = array(
                'status' => 201,
                // 'message' => $TP,
                'as' => 'asepic',
            );
        } else {
            $transMessage = $jns . "Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $th->getMessage() ,
                "e" => $th->getLine(),
                'as' => 'asepic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveRiwayatHukumanDisiplin(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        \DB::beginTransaction();
        $jns ="";
        try {
            if ($request['norec'] == "") {
                $jns = "Simpan ";
                $dahudis = \DB::table('sdm_hukumandisiplin_t')
                ->insert([
                    'norec' => substr(Uuid::generate(), 0, 32),
                    'kdprofile'=> $kdProfile,
                    'statusenabled'=> true,
                    'objectjenishukumanfk'=> $request['objectjenishukumanfk'],
                    'tgldari'=>$request['tgldari'],
                    'tglsampai'=>$request['tglsampai'],
                    'pejabatmenetapkan'=> $request['pejabatmenetapkan'],
                    'objectpegawaifk'=> $request['objectpegawaifk'],
                    'tglsk'=> $request['tglsk'],
                    'nosk'=> $request['nosk'],
                ]);
            } else {
                $jns = "Ubah ";
                $dahudis = \DB::table('sdm_hukumandisiplin_t')
                ->where('norec', $request['norec'])
                ->where('kdprofile', $kdProfile)
                ->where('objectpegawaifk', $request['objectpegawaifk'])
                ->update([
                    'statusenabled'=> true,
                    'objectjenishukumanfk'=> $request['objectjenishukumanfk'],
                    'tgldari'=>$request['tgldari'],
                    'tglsampai'=>$request['tglsampai'],
                    'pejabatmenetapkan'=> $request['pejabatmenetapkan'],
                    'tglsk'=> $request['tglsk'],
                    'nosk'=> $request['nosk'],
                ]);
            }
            
            $transStatus = true;
            
        } catch (\Throwable $th) {
            $transStatus = false;
        }
        if ($transStatus == 'true') {
            $transMessage = $jns . "Berhasil" ;
            DB::commit();
            $result = array(
                'status' => 201,
                // 'message' => $TP,
                'as' => 'asepic',
            );
        } else {
            $transMessage = $jns . "Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $th->getMessage() ,
                "e" => $th->getLine(),
                'as' => 'asepic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveRiwayatCuti(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        \DB::beginTransaction();
        $jns ="";
        try {
            if ($request['norec'] == "") {
                $jns = "Simpan ";
                \DB::table("riwayatcuti_t")
                ->insert([
                    'norec' => substr(Uuid::generate(), 0, 32),
                    'kdprofile'=> $kdProfile,
                    'statusenabled'=> true,
                    'objectpegawaifk'=> $request['objectpegawaifk'],
                    'tgldari'=>$request['tgldari'],
                    'tglsampai'=>$request['tglsampai'],
                    'tglsk'=> $request['tglsk'],
                    'nosk'=> $request['nosk'],
                    'pejabatmenetapkan'=> $request['pejabatmenetapkan'],
                ]);
                
            } else {
                $jns = "Ubah ";
                \DB::table("riwayatcuti_t")
                ->where('norec', $request['norec'])
                ->where('kdprofile', $kdProfile)
                ->where('objectpegawaifk', $request['objectpegawaifk'])
                ->update([
                    'kdprofile'=> $kdProfile,
                    'statusenabled'=> true,
                    'objectpegawaifk'=> $request['objectpegawaifk'],
                    'tgldari'=>$request['tgldari'],
                    'tglsampai'=>$request['tglsampai'],
                    'tglsk'=> $request['tglsk'],
                    'nosk'=> $request['nosk'],
                    'pejabatmenetapkan'=> $request['pejabatmenetapkan'],
                ]);
            }
            
            $transStatus = true;
            
        } catch (\Throwable $th) {
            $transStatus = false;
        }
        if ($transStatus == 'true') {
            $transMessage = $jns . "Berhasil" ;
            DB::commit();
            $result = array(
                'status' => 201,
                // 'message' => $TP,
                'as' => 'asepic',
            );
        } else {
            $transMessage = $jns . "Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $th->getMessage() ,
                "e" => $th->getLine(),
                'as' => 'asepic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveTotalCuti(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tahun = (int)$request['tglpengajuan'];
        \DB::beginTransaction();
        $jns ="";
        try {
            if ($request['norec'] == "") {
                $jns = "Simpan ";
                \DB::table("planningpegawaistatus_t")
                ->insert([
                    'norec' => substr(Uuid::generate(), 0, 32),
                    'kdprofile'=> $kdProfile,
                    'statusenabled'=> true,
                    'noplanning'=> $this->generateCodeBySeqTable(new PlanningPegawaiStatus, 'noplanning', 11, 'P'.date('ym'), $kdProfile),
                    'objectpegawaifk'=>$request['objectpegawaifk'],
                    'jumlahhari'=>$request['jumlahhari'],
                    'tglpengajuan'=> $tahun.'-01-01 00:00:00',
                ]);
                
            } else {
                $jns = "Ubah ";
                \DB::table("planningpegawaistatus_t")
                ->where('norec', $request['norec'])
                ->where('kdprofile', $kdProfile)
                ->where('objectpegawaifk', $request['objectpegawaifk'])
                ->update([
                    'kdprofile'=> $kdProfile,
                    'statusenabled'=> true,
                    'objectpegawaifk'=>$request['objectpegawaifk'],
                    'jumlahhari'=>$request['jumlahhari'],
                    'tglpengajuan'=> $tahun.'-01-01 00:00:00',
                ]);
            }
            
            $transStatus = true;
            
        } catch (\Throwable $th) {
            $transStatus = false;
        }
        if ($transStatus == 'true') {
            $transMessage = $jns . "Berhasil" ;
            DB::commit();
            $result = array(
                'status' => 201,
                // 'message' => $TP,
                'as' => 'asepic',
            );
        } else {
            $transMessage = $jns . "Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $th->getMessage() ,
                "e" => $th->getLine(),
                'as' => 'asepic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveRiwayatDataKeluarga(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        \DB::beginTransaction();
        $jns ="";
        try {
           
                if($request['id'] == ""){
                    $idKeluarga = KeluargaPegawai::max('id') + 1;
                    $dataSaveKeluarga = new KeluargaPegawai();
                    $dataSaveKeluarga->id = $idKeluarga;
                    $dataSaveKeluarga->kdprofile = $kdProfile;
                    $dataSaveKeluarga->statusenabled=true;
                    $dataSaveKeluarga->norec = $dataSaveKeluarga->generateNewId();
                    $dataSaveKeluarga->objectpegawaifk = $request['objectpegawaifk'];
                    $jns = "Simpan ";
                }else{
                    $dataSaveKeluarga = KeluargaPegawai::where('id', $request['id'])->where('objectpegawaifk', $request['objectpegawaifk'])->first();
                    $jns = "Ubah ";
                }
                    $dataSaveKeluarga->alamat = $request['alamat'];
                    $dataSaveKeluarga->objectjeniskelaminfk = $request['objectjeniskelaminfk'];
                    $dataSaveKeluarga->keterangan = $request['keterangan'];
                    $dataSaveKeluarga->namaayah = $request['namaayah'];
                    $dataSaveKeluarga->namaibu = $request['namaibu'];
                    $dataSaveKeluarga->namalengkap = $request['namalengkap'];
                    $dataSaveKeluarga->nipistrisuami = $request['nipistrisuami'];
                    $dataSaveKeluarga->nosuratkuliah = $request['nosuratkuliah'];
                    $dataSaveKeluarga->objectkdhubunganfk = $request['objectkdhubunganfk'];
                    $dataSaveKeluarga->objectpekerjaanfk = $request['objectpekerjaanfk'];
                    $dataSaveKeluarga->objectstatusperkawinanpegawaifk = $request['objectstatusperkawinanpegawaifk'];
                    $dataSaveKeluarga->statustanggungan = $request['statustanggungan'];
                    $dataSaveKeluarga->tgllahir = $request['tgllahir'];
                    if(isset($request['tunjangan']) && $request['tunjangan'] != ""){
                        $dataSaveKeluarga->tunjangan = $request['tunjangan'];
                    }
                    if (isset($request['tglsuratkuliah']) && $request['tglsuratkuliah'] != 'Invalid date'){
                        $dataSaveKeluarga->tglsuratkuliah = $request['tglsuratkuliah'];
                    }
                    $dataSaveKeluarga->statustanggunganfk = $request['statustanggunganfk'];
                    $dataSaveKeluarga->objectpendidikanterakhirfk = $request['objectpendidikanterakhirfk'];
                    $dataSaveKeluarga->kariskarsu = $request['kariskarsu'];
                    $dataSaveKeluarga->issuamiistri = $request['issuamiistri'];
                    $dataSaveKeluarga->isanak = $request['isanak'];
                    $dataSaveKeluarga->isorangtua = $request['isorangtua'];
                    $dataSaveKeluarga->tglnikah = $request['tglnikah'];
                    $dataSaveKeluarga->save();
            
            $transStatus = true;
            
        } catch (\Throwable $th) {
            $transStatus = false;
        }
        if ($transStatus == 'true') {
            $transMessage = $jns . "Berhasil" ;
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $dataSaveKeluarga,
                'as' => 'asepic',
            );
        } else {
            $transMessage = $jns . "Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $th->getMessage() ,
                "e" => $th->getLine(),
                'as' => 'asepic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getMasterPendidikanPegawai(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $pendidikan = PendidikanPegawai::where('statusenabled', true)->where('kdprofile', $kdProfile)->get();
        $result = array(
            'data'=> $pendidikan,
            'as'=> 'FiziLuckNut',
        );
        return $this->respond($result);
    }
    public function saveMasterPendidikanPegawai(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        \DB::beginTransaction();
        $idMaxPendidikanPegawai = PendidikanPegawai::max('id');
        $nourutMaxPendidikanPegawai = PendidikanPegawai::max('nourut');
        $crud="";
        try {
           
            // $dataPendidikanPegawai = new PendidikanPegawai();
            //     $dataPendidikanPegawai->id = $idMaxPendidikanPegawai + 1;
            //     $dataPendidikanPegawai->kdprofile = $kdProfile;
            //     $dataPendidikanPegawai->statusenabled = true;
            //     $dataPendidikanPegawai->kodeexternal= $idMaxPendidikanPegawai + 1;
            //     $dataPendidikanPegawai->namaexternal= $request['pendidikanpegawai'];
            //     $dataPendidikanPegawai->reportdisplay= $request['pendidikanpegawai'];
            //     $dataPendidikanPegawai->pendidikanpegawai= $request['pendidikanpegawai'];
            //     $dataPendidikanPegawai->nourut= $nourutMaxPendidikanPegawai + 1;
            //     $dataPendidikanPegawai->save();
            if(isset($request['hapus'])){
                $dataPendidikanPegawai = PendidikanPegawai::where('id', $request['idDelete'])->where('kdprofile', $kdProfile)->where('statusenabled', true)->first();
                $dataPendidikanPegawai->delete();
                $crud = "Hapus";
            }else if ($request['id'] == "") {
                \DB::table('pendidikanpegawai_m')->insert([
                'id'=>$idMaxPendidikanPegawai+1,
                'kdprofile'=>30,
                'statusenabled'=>true,
                'kodeexternal'=> $idMaxPendidikanPegawai+1,
                'namaexternal'=> $request['pendidikanpegawai'],
                'reportdisplay'=> $request['pendidikanpegawai'],
                'pendidikanpegawai'=> $request['pendidikanpegawai'],
                'nourut'=> $nourutMaxPendidikanPegawai+1,
                ]);
            $crud = "Simpan";
                
            }
            else if($request['id'] != ""){
                \DB::table('pendidikanpegawai_m')->where('id', $request['id'])
                ->where('statusenabled', true)
                ->where('kdprofile', $kdProfile)
                ->update([
                'namaexternal'=> $request['pendidikanpegawai'],
                'reportdisplay'=> $request['pendidikanpegawai'],
                'pendidikanpegawai'=> $request['pendidikanpegawai'],
                ]);
            $crud = "Ubah";

            }
            $transStatus = true;
            
        } catch (\Throwable $th) {
            $transStatus = false;
        }
        if ($transStatus == 'true') {
            $transMessage = $crud . " Berhasil" ;
            DB::commit();
            $result = array(
                'status' => 201,
                // 'message' => $TP,
                'as' => 'asepic',
            );
        } else {
            $transMessage = $crud . " Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $th->getMessage() ,
                "e" => $th->getLine(),
                'as' => 'asepic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function LaporanPenggunaTotalTW(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $satu = '';
        $dua = '';
        $tiga = '';
        if($request['triwulan'] == 1){
            $satu = 1;
            $dua = 2;
            $tiga = 3;
        } else if($request['triwulan'] == 2){
            $satu = 4;
            $dua = 5;
            $tiga = 6;
        } else if($request['triwulan'] == 3){
            $satu = 7;
            $dua = 8;
            $tiga =9;
        } else if($request['triwulan'] == 4){
            $satu = 10;
            $dua = 11;
            $tiga =12;
        }
        $data = \DB::select(DB::raw("SELECT 
        x.pelayanan, 
        sum(x.mhs)filter(where x.bulan = $satu) as satu,
        sum(x.mhs)filter(where x.bulan = $dua) as dua,
        sum(x.mhs)filter(where x.bulan = $tiga) as tiga,
        sum(x.mhs)filter(where x.bulan in ($satu,$dua,$tiga)) as total
        FROM (
            SELECT djp.detailjenisproduk as pelayanan,date_part('month', pe.tanggalmulai::date)as bulan, pe.jumlahpeserta as mhs
            from sdm_penelitianeksternal_t pe 
            left join detailjenisproduk_m djp on djp.id = pe.objectdetailjenisprodukfk
            where date_part('year', pe.tanggalmulai) = $request[tahun] and pe.kdprofile = $idProfile and pe.statusenabled = true 
            ORDER BY djp.detailjenisproduk
        )as x
        GROUP BY x.pelayanan
        "));

        return $this->respond($data);
    }
    public function LaporanPenggunaPKKTotalTW(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $satu = '';
        $dua = '';
        $tiga = '';
        if($request['triwulan'] == 1){
            $satu = 1;
            $dua = 2;
            $tiga = 3;
        } else if($request['triwulan'] == 2){
            $satu = 4;
            $dua = 5;
            $tiga = 6;
        } else if($request['triwulan'] == 3){
            $satu = 7;
            $dua = 8;
            $tiga =9;
        } else if($request['triwulan'] == 4){
            $satu = 10;
            $dua = 11;
            $tiga =12;
        }
        $data = \DB::select(DB::raw("SELECT y.jeniskegiatan, y.diklatkategori, 
        sum(y.satu)::integer as satu, 
        sum(y.dua)::integer as dua,
        sum(y.tiga)::integer as tiga,
        
        sum(y.total)::integer as total
        FROM (
        SELECT
        x.diklatkategori,
        x.id_jenis,
        x.id_produk,
        case 
        when x.id_produk in (40400003) then 'Co-Ass'
        when x.id_produk in (40400001) then 'DI-DIII'
        when x.id_produk in (40400002) then 'DIV-S1'
        when x.id_produk in (40400004) then 'Ners'
        when x.id_produk in (40400005) then 'S2'
        when x.id_produk in (40400000) then 'SMU/Sederajat'
        end as jeniskegiatan,
        sum(x.mhs)filter(where x.bulan = $satu)as satu,
        sum(x.mhs)filter(where x.bulan = $dua)as dua,
        sum(x.mhs)filter(where x.bulan = $tiga)as tiga,
        sum(x.mhs) filter(where x.bulan in($satu, $dua, $tiga)) as total
        FROM (
        SELECT dk.diklatkategori, pr.namaproduk,pr.id as id_produk, dk.id as id_jenis,date_part('month', pe.tanggalmulai::date)as bulan, pe.objectprodukfk,pe.jumlahpeserta as mhs
        from sdm_penelitianeksternal_t pe
        left join detailjenisproduk_m djp on djp.id = pe.objectdetailjenisprodukfk
        inner join produk_m pr on pr.id = pe.objectprodukfk
        inner join diklatkategori_m dk on dk.id = pe.objectdiklatkategorifk

        where date_part('year', pe.tanggalmulai) = 2022 and pe.kdprofile = 30 and pe.statusenabled = true and pe.objectdetailjenisprodukfk = 1947
        ORDER BY pe.tanggalmulai asc
        )as x
        GROUP BY x.diklatkategori, x.id_jenis,x.id_produk)as y
        GROUP BY y.jeniskegiatan, y.diklatkategori
        "));

        return $this->respond($data);
    }
    public function saveDataCPNS(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        \DB::beginTransaction();
        $reqcpns = $request['data'];
        try {
            $cpns = Pegawai::where('id',$reqcpns['id'])->first();
            $cpns->instansicpns = $reqcpns['instansicpns'];
            $cpns->jabatancpns = $reqcpns['jabatancpns'];
            $cpns->masakerjacpns = $reqcpns['masakerjacpns'];
            $cpns->noijazahcpns = $reqcpns['noijazahcpns'];
            $cpns->noskcpns = $reqcpns['noskcpns'];
            $cpns->objectgolongancpnsfk = $reqcpns['objectgolongancpnsfk'];
            $cpns->pejabatpenandatangancpns = $reqcpns['pejabatpenandatangancpns'];
            $cpns->pejabatyangmenetapkancpns = $reqcpns['pejabatyangmenetapkancpns'];
            $cpns->objectpendidikancpnsfk = $reqcpns['pendidikancpns'];
            $cpns->prodicpns = $reqcpns['prodicpns'];
            $cpns->tglijazahcpns = $reqcpns['tglijazahcpns'];
            $cpns->tglskcpns = $reqcpns['tglskcpns'];
            $cpns->tmtskcpns = $reqcpns['tmtskcpns'];
            $cpns->unitkerjacpns = $reqcpns['unitkerjacpns'];
            $cpns->save();
            $transStatus = true;
            
        } catch (\Throwable $th) {
            $transStatus = false;
        }
        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil" ;
            DB::commit();
            $result = array(
                'status' => 201,
                // 'message' => $TP,
                'as' => 'asepic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $th->getMessage() ,
                "e" => $th->getLine(),
                'as' => 'asepic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getThnBln(Request $request)
    {
        $data = \DB::select(DB::raw("select extract(year from age('$request[tgltmt]'::date, '$request[tglcpns]'::date))as thn,
        extract(month from age('$request[tgltmt]'::date, '$request[tglcpns]'::date))as bln"));
        return $this->respond($data);
    }
    public function getDataJabatan(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tunjanganbaru = Jabatan::where('statusenabled', true)->where('kdprofile', $kdProfile)->where('objectjenisjabatanfk', $request['jabatan'])->get();
        return $this->respond($tunjanganbaru);
    }
    public function getGajiPokokLama(Request $request)
    {
        if($request['gaji']== 'KP'){
            $data = \DB::select(DB::raw("
            SELECT * FROM (select ROW_NUMBER()over(partition by rgb.kdprofile ORDER BY rgb.tgltmt desc)as nomor,
             * from riwayatgolongan_t rgb where rgb.kdprofile=30 and rgb.statusenabled = true and rgb.objectpegawaifk = $request[idpegawai])as x where x.nomor = 1"));
        }else{
            $data = \DB::select(DB::raw("
            SELECT * FROM (select ROW_NUMBER()over(partition by rgb.kdprofile ORDER BY rgb.tgltmt desc)as nomor, 
            * from riwayatgajiberkala_t rgb where rgb.kdprofile= 30 and rgb.statusenabled = true and rgb.objectpegawaifk = $request[idpegawai])as x where x.nomor = 1
            "));
        }
        $result = array(
            'data'=> $data
        );
        return $this->respond($result);
    }

    public function HomeDashboard(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        
        $jumlahpns = \DB::select("SELECT count(pg.id)as jumlahpns FROM pegawai_m pg 
        where pg.kdprofile = $kdProfile and pg.statusenabled = true and pg.usereksternal is null and pg.namalengkap <>'-' and pg.id != 320263 and pg.kategorypegawai = 1 and pg.ispensiun is null");
        $jumlahpnslaki = \DB::select("SELECT count(pg.id)as jumlahpns FROM pegawai_m pg 
        where pg.kdprofile = $kdProfile and pg.statusenabled = true and pg.usereksternal is null and pg.namalengkap <>'-' and pg.id != 320263 
        and pg.kategorypegawai = 1 and pg.ispensiun is null and pg.objectjeniskelaminfk = 1");
        $jumlahpnsperempuan = \DB::select("SELECT count(pg.id)as jumlahpns FROM pegawai_m pg 
        where pg.kdprofile = $kdProfile and pg.statusenabled = true and pg.usereksternal is null and pg.namalengkap <>'-' and pg.id != 320263 
        and pg.kategorypegawai = 1 and pg.ispensiun is null and pg.objectjeniskelaminfk = 2");
        
        
        $jumlahp3k = \DB::select("SELECT count(pg.id)as jumlahp3k FROM pegawai_m pg 
        where pg.kdprofile = $kdProfile and pg.statusenabled = true and pg.usereksternal is null and pg.namalengkap <>'-' and pg.id != 320263 
        and pg.kategorypegawai = 23 and pg.ispensiun is null");
        $jumlahp3klaki = \DB::select("SELECT count(pg.id)as jumlahp3k FROM pegawai_m pg 
        where pg.kdprofile = $kdProfile and pg.statusenabled = true and pg.usereksternal is null and pg.namalengkap <>'-' and pg.id != 320263 
        and pg.kategorypegawai = 23 and pg.ispensiun is null and pg.objectjeniskelaminfk = 1");
        $jumlahp3kperempuan = \DB::select("SELECT count(pg.id)as jumlahp3k FROM pegawai_m pg 
        where pg.kdprofile = $kdProfile and pg.statusenabled = true and pg.usereksternal is null and pg.namalengkap <>'-' and pg.id != 320263 
        and pg.kategorypegawai = 23 and pg.ispensiun is null and pg.objectjeniskelaminfk = 2");
        
        $jumlahnaban = \DB::select("SELECT count(pg.id)as jumlahnaban FROM pegawai_m pg 
        where pg.kdprofile = $kdProfile and pg.statusenabled = true and pg.usereksternal is null and pg.namalengkap <>'-' and pg.id != 320263 
        and pg.kategorypegawai = 22 and pg.ispensiun is null");
        $jumlahnabanlaki = \DB::select("SELECT count(pg.id)as jumlahnaban FROM pegawai_m pg 
        where pg.kdprofile = $kdProfile and pg.statusenabled = true and pg.usereksternal is null and pg.namalengkap <>'-' and pg.id != 320263 
        and pg.kategorypegawai = 22 and pg.ispensiun is null and pg.objectjeniskelaminfk = 1");
        $jumlahnabanperempuan = \DB::select("SELECT count(pg.id)as jumlahnaban FROM pegawai_m pg 
        where pg.kdprofile = $kdProfile and pg.statusenabled = true and pg.usereksternal is null and pg.namalengkap <>'-' and pg.id != 320263 
        and pg.kategorypegawai = 22 and pg.ispensiun is null and pg.objectjeniskelaminfk = 2");
        
        $jumlahblud = \DB::select("SELECT count(pg.id)as jumlahblud FROM pegawai_m pg 
        where pg.kdprofile = $kdProfile and pg.statusenabled = true and pg.usereksternal is null and pg.namalengkap <>'-' and pg.id != 320263 
        and pg.kategorypegawai = 20 and pg.ispensiun is null");
        $jumlahbludlaki = \DB::select("SELECT count(pg.id)as jumlahblud FROM pegawai_m pg 
        where pg.kdprofile = $kdProfile and pg.statusenabled = true and pg.usereksternal is null and pg.namalengkap <>'-' and pg.id != 320263 
        and pg.kategorypegawai = 20 and pg.ispensiun is null and pg.objectjeniskelaminfk = 1");
        $jumlahbludperempuan = \DB::select("SELECT count(pg.id)as jumlahblud FROM pegawai_m pg 
        where pg.kdprofile = $kdProfile and pg.statusenabled = true and pg.usereksternal is null and pg.namalengkap <>'-' and pg.id != 320263 
        and pg.kategorypegawai = 20 and pg.ispensiun is null and pg.objectjeniskelaminfk = 2");
        
        $jumlahos = \DB::select("SELECT count(pg.id)as jumlahos FROM pegawai_m pg 
        where pg.kdprofile = $kdProfile and pg.statusenabled = true and pg.usereksternal is null and pg.namalengkap <>'-' and pg.id != 320263 
        and pg.kategorypegawai = 11 and pg.ispensiun is null");
        $jumlahoslaki = \DB::select("SELECT count(pg.id)as jumlahos FROM pegawai_m pg 
        where pg.kdprofile = $kdProfile and pg.statusenabled = true and pg.usereksternal is null and pg.namalengkap <>'-' and pg.id != 320263 
        and pg.kategorypegawai = 11 and pg.ispensiun is null and pg.objectjeniskelaminfk = 1");
        $jumlahosperempuan = \DB::select("SELECT count(pg.id)as jumlahos FROM pegawai_m pg 
        where pg.kdprofile = $kdProfile and pg.statusenabled = true and pg.usereksternal is null and pg.namalengkap <>'-' and pg.id != 320263 
        and pg.kategorypegawai = 11 and pg.ispensiun is null and pg.objectjeniskelaminfk = 2");
        
        $penjagaankgb = \DB::select(DB::raw("SELECT count(y.hari) FROM (SELECT (x.y*12 )+ x.m as hari, x.y, x.m,x.tgltmt FROM (select rg.tgltmt, extract(year from age(CURRENT_DATE,rg.tgltmt ))as y, extract(month from age(CURRENT_DATE,rg.tgltmt ))as m  from riwayatgajiberkala_t rg )as x 
        where (x.y*12 )+ x.m between 21 and 23)as y"));

        $penjagaankgbd = \DB::select(DB::raw("SELECT * FROM (select pg.namalengkap, pg.nippns, pg.tgllahir::date,sdmg.namaexternal||', '||sdmg.name as golongan, rg.gajiakhir, rg.tgltmt,(rg.tgltmt + interval '2 year')::date as tmtberikutnya, extract(year from age(CURRENT_DATE,rg.tgltmt ))as y, extract(month from age(CURRENT_DATE,rg.tgltmt ))as m  from riwayatgajiberkala_t rg 
        inner join pegawai_m pg on  pg.id = rg.objectpegawaifk inner join sdm_golongan_m sdmg on sdmg.id = rg.objectgolonganfk
        )as x where (x.y*12 )+ x.m between 21 and 23 ORDER BY x.tmtberikutnya desc"));

        $penjagaanstrd = \DB::select(DB::raw("SELECT * FROM (select DISTINCT row_number()over (partition by pg.id order by mbs.berakhirstr::date desc) nomor,pg.namalengkap, pg.nippns, gol.namaexternal ||', '||gol.name as golongan, pg.tgllahir::date, mbs.berakhirstr::date,extract(year from age(mbs.berakhirstr::date,CURRENT_DATE))as y, extract(month from age(mbs.berakhirstr::date,CURRENT_DATE))as m  from pegawai_m pg 
inner join masaberlakusipstr_t mbs on mbs.pegawaifk = pg.id
left join sdm_golongan_m gol on gol.id = pg.objectgolonganfk
where pg.kdprofile = 30 and pg.statusenabled = true and pg.usereksternal is null )as x where x.nomor = 1 and (x.y*12)+x.m < 6 order by x.berakhirstr asc"));
        
        $penjagaanpensiun = \DB::select(DB::raw("SELECT * FROM (SELECT
            gol.namaexternal || ', ' || gol.NAME AS golongan,
            pg.namalengkap,
            pg.nippns,
            EXTRACT ( YEAR FROM age( CURRENT_DATE, pg.tgllahir :: DATE ) ) AS y,
            EXTRACT ( MONTH FROM age(CURRENT_DATE, pg.tgllahir :: DATE ) ) AS M,
            pg.tgllahir,
            pg.pensiun,
            pg.tglpensiun
        FROM
            pegawai_m pg
            LEFT JOIN sdm_golongan_m gol ON gol.ID = pg.objectgolonganfk 
        WHERE
            pg.kdprofile = 30 
            AND pg.statusenabled = TRUE 
            AND pg.usereksternal IS NULL 
            AND pg.namalengkap <> '-' 
            AND pg.ID != 320263)as x where   x.y - 1= x.pensiun - 1 and x.pensiun >= x.y"));



        $dataPNS = \DB::select(DB::raw("SELECT pg.nippns, pg.namalengkap,jk.jeniskelamin, gol.namaexternal ||', '|| gol.name as golongan, jb.namajabatan FROM pegawai_m pg 
        left join jeniskelamin_m jk on jk.id = pg.objectjeniskelaminfk
        left join sdm_golongan_m gol on gol.id = pg.objectgolonganfk
        left join jabatan_m jb on jb.id = pg.objectjabataninternalfk
        where pg.kdprofile = $kdProfile and pg.statusenabled = true and pg.usereksternal is null and pg.namalengkap <>'-' and pg.id != 320263 and pg.kategorypegawai = 1 and pg.ispensiun is null"));
        $dataP3K = \DB::select(DB::raw("SELECT pg.nippns, pg.namalengkap,jk.jeniskelamin, gol.namaexternal ||', '|| gol.name as golongan, jb.namajabatan FROM pegawai_m pg 
        left join jeniskelamin_m jk on jk.id = pg.objectjeniskelaminfk
        left join sdm_golongan_m gol on gol.id = pg.objectgolonganfk
        left join jabatan_m jb on jb.id = pg.objectjabataninternalfk
        where pg.kdprofile = $kdProfile and pg.statusenabled = true and pg.usereksternal is null and pg.namalengkap <>'-' and pg.id != 320263 and pg.kategorypegawai = 23 and pg.ispensiun is null"));
        
        $dataNABAN = \DB::select(DB::raw("SELECT pg.nippns, pg.namalengkap,jk.jeniskelamin, gol.namaexternal ||', '|| gol.name as golongan, jb.namajabatan FROM pegawai_m pg 
        left join jeniskelamin_m jk on jk.id = pg.objectjeniskelaminfk
        left join sdm_golongan_m gol on gol.id = pg.objectgolonganfk
        left join jabatan_m jb on jb.id = pg.objectjabataninternalfk
        where pg.kdprofile = $kdProfile and pg.statusenabled = true and pg.usereksternal is null and pg.namalengkap <>'-' and pg.id != 320263 and pg.kategorypegawai = 22 and pg.ispensiun is null"));

        $dataBLUD = \DB::select(DB::raw("SELECT pg.nippns, pg.namalengkap,jk.jeniskelamin, gol.namaexternal ||', '|| gol.name as golongan, jb.namajabatan FROM pegawai_m pg 
        left join jeniskelamin_m jk on jk.id = pg.objectjeniskelaminfk
        left join sdm_golongan_m gol on gol.id = pg.objectgolonganfk
        left join jabatan_m jb on jb.id = pg.objectjabataninternalfk
        where pg.kdprofile = $kdProfile and pg.statusenabled = true and pg.usereksternal is null and pg.namalengkap <>'-' and pg.id != 320263 and pg.kategorypegawai = 20 and pg.ispensiun is null"));

        $dataOS = \DB::select(DB::raw("SELECT pg.nippns, pg.namalengkap,jk.jeniskelamin, gol.namaexternal ||', '|| gol.name as golongan, jb.namajabatan FROM pegawai_m pg 
        left join jeniskelamin_m jk on jk.id = pg.objectjeniskelaminfk
        left join sdm_golongan_m gol on gol.id = pg.objectgolonganfk
        left join jabatan_m jb on jb.id = pg.objectjabataninternalfk
        where pg.kdprofile = $kdProfile and pg.statusenabled = true and pg.usereksternal is null and pg.namalengkap <>'-' and pg.id != 320263 and pg.kategorypegawai = 11 and pg.ispensiun is null"));


        $result = array(
            'jumlahpns'=> $jumlahpns,
            'jumlahpnslaki'=> $jumlahpnslaki,
            'jumlahpnsperempuan'=> $jumlahpnsperempuan,

            'jumlahp3k'=> $jumlahp3k,
            'jumlahp3klaki'=> $jumlahp3klaki,
            'jumlahp3kperempuan'=> $jumlahp3kperempuan,

            'jumlahnaban'=> $jumlahnaban,
            'jumlahnabanlaki'=> $jumlahnabanlaki,
            'jumlahnabanperempuan'=> $jumlahnabanperempuan,

            'jumlahblud'=> $jumlahblud,
            'jumlahbludlaki'=> $jumlahbludlaki,
            'jumlahbludperempuan'=> $jumlahbludperempuan,

            'jumlahos'=> $jumlahos,
            'jumlahoslaki'=> $jumlahoslaki,
            'jumlahosperempuan'=> $jumlahosperempuan,
            'penjagaankgb'=> $penjagaankgb,
            'penjagaankgbd'=> $penjagaankgbd,
            'penjagaanstrd'=> $penjagaanstrd,
            'penjagaanpensiun'=> $penjagaanpensiun,
            'dataPNS'=> $dataPNS,
            'dataP3K'=> $dataP3K,
            'dataNABAN'=> $dataNABAN,
            'dataBLUD'=> $dataBLUD,
            'dataOS'=> $dataOS,
            'as'=> 'Fizi'
        );

        return $this->respond($result);
    }
    public function getLaporanNominatif(Request $request)
    {
        $kateg = "";
        if(isset($request['jenisKategId'])){
            $kateg=" and kp.id in($request[jenisKategId])";
        }
        $Peg = "";
        if(isset($request['jenisPegId'])){
            $Peg=" and jep.id in($request[jenisPegId])";
        }
        $status = "";
        if(isset($request['statusPegId'])){
            $status=" and sp.id in($request[statusPegId])";
        }

        $data = \DB::select(DB::raw("SELECT cuti.cutibulan, pg.tglskcpns::date, pg.id, pg.nippns, pg.namalengkap, pg.tempatlahir ||', '|| pg.tgllahir::date as ttl, jk.jeniskelamin,es.eselon, gol.golongan,gol.tgltmt::date, jab.namajabatan, jab.tmtjabatan::date, '' as masakerjagolongan, sp.statuspegawai as kedudukan, kp.kategorypegawai, str.nostr,str.terbitstr::date || ' s.d. ' ||  str.berakhirstr::date as masaberlakustr, str.nosip, str.terbitsip::date as tanggalsip, rip.pendidikanpegawai  FROM pegawai_m pg 
        left join jeniskelamin_m jk on jk.id = pg.objectjeniskelaminfk
        left join eselon_m es on es.id = pg.objecteselonfk
        left join (SELECT * FROM (SELECT ROW_NUMBER()OVER(PARTITION by rg.objectpegawaifk ORDER BY rg.tgltmt desc)as nomor, rg.objectpegawaifk, gol.namaexternal ||', '||gol.reportdisplay as golongan, rg.tgltmt FROM riwayatgolongan_t rg inner join sdm_golongan_m gol on gol.id = rg.objectgolonganfk where rg.kdprofile = 30 and rg.statusenabled = true) as x where x.nomor =1)as gol on gol.objectpegawaifk = pg.id
        left join(SELECT * FROM (SELECT ROW_NUMBER()OVER(partition by rj.objectpegawaifk ORDER BY rj.tmtjabatan desc)as nomor, rj.objectpegawaifk, jb.namajabatan, rj.tmtjabatan FROM riwayatjabatan_t rj
        left join jabatan_m jb on jb.id = rj.objectjabatanfk where rj.kdprofile = 30 and rj.statusenabled = true)as x where x.nomor =1 )as jab on jab.objectpegawaifk = pg.id
        left join statuspegawai_m sp on sp.id = pg.objectstatuspegawaifk
        left join kategorypegawai_m kp on kp.id = pg.kategorypegawai
        left join(SELECT * FROM (SELECT ROW_NUMBER()OVER(PARTITION BY rp.objectpegawaifk ORDER BY rp.tgllulus desc)as nomor, rp.objectpegawaifk,pp.pendidikanpegawai,rp.tgllulus FROM riwayatpendidikan_t rp
        left join pendidikanpegawai_m pp on pp.id = rp.objectpendidikanpegawaifk where rp.kdprofile = 30 and rp.statusenabled = true) as x where x.nomor=1)as rip on rip.objectpegawaifk = pg.id
        left join jenispegawai_m jep on jep.id = pg.objectjenispegawaifk
        left join (SELECT  ROW_NUMBER()OVER(partition by str.pegawaifk ORDER BY str.berakhirstr desc)as nomor,  str.pegawaifk, str.nostr, str.terbitstr, str.berakhirstr, str.nosip, str.terbitsip, str.berakhirsip FROM masaberlakusipstr_t str where str.kdprofile = 30 and str.statusenabled = true)as str on str.pegawaifk = pg.id
        left join (SELECT x.objectpegawaifk, (sum(x.y)* 12)+ sum(x.m)as cutibulan  FROM (SELECT rc.objectpegawaifk, EXTRACT(year from age(rc.tglsampai::date, rc.tgldari::date))as y,EXTRACT(month from age(rc.tglsampai::date, rc.tgldari::date))as m FROM riwayatcuti_t rc )as x GROUP BY x.objectpegawaifk) as cuti on cuti.objectpegawaifk = pg.id
        where pg.kdprofile = 30 and pg.statusenabled = true and pg.usereksternal is null and pg.namalengkap <> '-' AND pg.ID != 320263 $kateg $Peg $status"));

        // $cuti = \DB::select(DB::raw("SELECT rc.objectpegawaifk, ROW_NUMBER()OVER(partition by rc.objectpegawaifk ORDER BY rc.tgldari desc)as nomor, rc.tgldari, rc.tglsampai, EXTRACT(year from age(rc.tglsampai::date, rc.tgldari::date))as y,EXTRACT(month from age(rc.tglsampai::date, rc.tgldari::date))as m FROM riwayatcuti_t rc"));
        
        $result = array(
            'data'=> $data,
            // 'cuti'=> $cuti,
            'as'=> 'Fizi'
        );
        return $this->respond($result);
    }
    public function MasterKenaikanGajiBerkala(Request $request)
    {
        $sk = '';
        $golongan = '';

        if(isset($request['sk'])){
            $sk = 'and sk.id ='. $request['sk'];
        }
        if(isset($request['golonganpegawai'])){
            $golongan = 'and gol.id in('. $request['golonganpegawai'] .')';
        }
        $data =  \DB::select(DB::raw("select sk.keteranganlainnya, case when gol.namaexternal is null then gol.name else gol.namaexternal ||', ' ||gol.name end as golongan,gg.mkg, 
        gg.gajipokok from gajigolongan_m gg 
        inner join sdm_golongan_m gol on gol.id = golonganfk 
        INNER JOIN suratkeputusan_m sk on sk.id = gg.objectsuratkeputusanfk
        where gg.kdprofile = 30 and gg.statusenabled = true $sk $golongan"));
        $result = array(
            'data'=> $data,
            'as'=> 'Fizi'
        );
        return $this->respond($result);
    }
    public function saveMasterGajiPokok(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        \DB::beginTransaction();
        $data = $request['data'];
        $idMax = \DB::table("gajigolongan_m")->max('id');
        try {
            if($data['id']== ""){
                \DB::table("gajigolongan_m")->insert([
                    'id'=> $idMax+1,
                    'kdprofile'=> $kdProfile,
                    'statusenabled'=> true,
                    'kodeexternal'=> $data['mkg'],
                    'namaexternal'=> $data['mkg'],
                    'golonganfk'=> $data['golonganfk'],
                    'mkg'=> $data['mkg'],
                    'objectsuratkeputusanfk'=> $data['objectsuratkeputusanfk'],
                    'gajipokok'=> $data['gajipokok'],
                ]);
            }
            $transStatus = true;
            
        } catch (\Throwable $th) {
            $transStatus = false;
        }
        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil" ;
            DB::commit();
            $result = array(
                'status' => 201,
                // 'message' => $TP,
                'as' => 'asepic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $th->getMessage() ,
                "e" => $th->getLine(),
                'as' => 'asepic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function KatTipe(Request $request)
    {
        $id = '';
        $data_id = '';
        if($request['kat'] == 'Agama'){
            $id = \DB::select(DB::raw("select id from agama_m where agama ilike '$request[tipe]'"));
            $data_id = 'and pg.objectagamafk = '.$id[0]->id;
        }
        if($request['kat'] == 'Jenis Kepegawaian'){
            $id = \DB::select(DB::raw("select id from jenispegawai_m where jenispegawai ilike '$request[tipe]'"));
            $data_id = 'and pg.objectjenispegawaifk = '.$id[0]->id;
        }
        if($request['kat'] == 'Jenis Kelamin'){
            $id = \DB::select(DB::raw("select id from jeniskelamin_m where jeniskelamin ilike '$request[tipe]'"));
            $data_id = 'and pg.objectjeniskelaminfk = '.$id[0]->id;
        }
        if($request['kat'] == 'Pendidikan'){
            $id = \DB::select(DB::raw("select id from pendidikan_m where pendidikan ilike '$request[tipe]'"));
            $data_id = 'and pg.objectpendidikanterakhirfk = '.$id[0]->id;
        }
        if($request['kat'] == 'Golongan'){
            $id = \DB::select(DB::raw("select id from sdm_golongan_m where name ilike '$request[tipe]'"));
            $data_id = 'and pg.objectgolonganfk = '.$id[0]->id;
        }
        if($request['kat'] == 'Jenis Usia'){
            if($request['tipe'] == '-'){
                $data_id = "and pg.tgllahir is null";
            }
            if($request['tipe'] == '31 s/d 40 Tahun'){
                $data_id = "and date_part('year',age(pg.tgllahir)) >= 31 and date_part('year',age(pg.tgllahir)) <=40 ";
            }
            if($request['tipe'] == '41 s/d 50 Tahun'){
                $data_id = "and date_part('year',age(pg.tgllahir)) >= 41 and date_part('year',age(pg.tgllahir)) <=50 ";
            }
            if($request['tipe'] == '21 s/d 30 Tahun'){
                $data_id = "and date_part('year',age(pg.tgllahir)) >= 21 and date_part('year',age(pg.tgllahir)) <=30 ";
            }
            if($request['tipe'] == 'diatas 51 Tahun'){
                $data_id = "and date_part('year',age(pg.tgllahir)) >= 51 ";
            }
            
        }
        $data =  \DB::select(DB::raw("SELECT pg.nippns, pg.namalengkap,gol.namaexternal||', '||gol.name as golongan, jab.namajabatan  
        FROM pegawai_m pg 
        left join sdm_golongan_m gol on gol.id = pg.objectgolonganfk 
        left join jabatan_m jab on jab.id = pg.objectjabataninternalfk 
        where pg.kdprofile = 30 and pg.statusenabled = true and pg.usereksternal is null and pg.namalengkap <> '-' AND pg.ID != 320263
        $data_id
        "));
        
        $result = array(
            'data'=> $data,
            // 'id'=> $id,
            'as'=> 'Fizi'
        );
        return $this->respond($result);
    }
    public function savePesertaDidikRuanganGroup(Request $request){
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        $data = explode(",", $request['data']);
        try{

            foreach ($data as $d) {
                $PDR = \DB::table('sdm_pdruangan_t')->insert([
                    'kdprofile' => $kdProfile,
                    'norec' => substr(Uuid::generate(), 0, 32),
                    'noregistrasifk' => $d,
                    'objectruanganlastfk' => $request['objectruanganlastfk'],
                    // 'objectruanganasalfk' => $request['objectruanganasalfk'],
                    'objectpegawaifk' => $request['objectpegawaifk'],
                    'statusenabled' => true,
                    'tglmasuk' => $request['tglmasuk'],
                    'tglkeluar' => $request['tglkeluar']
                ]);

                $PDRU = DB::table('sdm_pesertadidik_t')->where('norec', $d)->where('kdprofile', $kdProfile)->update([
                    'objectruanganlastfk' => $request['objectruanganlastfk'],
                    'objectpegawailastfk' => $request['objectpegawaifk'],
                ]);
            }
            

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        if ($transStatus == 'true') {
            $transMessage = "Simpan Ruangan Peserta Didik";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'data' => $data,
                'as' => 'asepic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                // 'data'  => $data,
                'as' => 'asepic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

        // $result = array(
        //         'status' => 400,
        //         'message'  => $PDR,
        //         'as' => 'asepic',
        //     );
        // return $this->respond($result);
    }
    public function getPeEks(Request $request)
    {
        $data = \DB::select(DB::raw("SELECT pd.nama, ru.namaruangan, pg.namalengkap, pdr.tglmasuk, pdr.tglkeluar FROM sdm_pesertadidik_t pd 
            inner join sdm_pdruangan_t pdr on pdr.noregistrasifk = pd.norec
            inner join pegawai_m pg on pg.id = pdr.objectpegawaifk
            inner join ruangan_m ru on ru.id = pdr.objectruanganlastfk
            where pd.noregistrasifk ilike '$request[norec]'

        "));

        $result = array(
            'data'=> $data,
            'as'=>'Fizi'
        );
        return $this->respond($result);
    }
    public function aspekPenilaian(Request $request)
    {
        $spd = DB::select(DB::raw("
        select norec as norec_hasil,aspekpenilaian as penilaian,penilaian as aspekpenilaian,nilai from hasilpenilaiandiklat_t where norec_peserta ilike '$request[norec_spd]'
        "));
        if(count($spd)>0){
            $data = $spd;
        }else{
            $data =\DB::select(DB::raw("
            SELECT null as norec_hasil, case when x.nourut = 1 then x.huruf_besar||'. '|| x.penilaian else null end as penilaian, x.huruf_kecil ||'. '||x.aspekpenilaian as aspekpenilaian, x.nilai
            FROM (SELECT CHR(CAST(DENSE_RANK() over (ORDER BY pd.id asc ) AS INTEGER) + 64)AS huruf_besar,CHR(CAST(row_number() over (partition by pd.id ORDER BY pd.id asc ) AS INTEGER) + 96)AS huruf_kecil,row_number()over(PARTITION by pd.penilaian ORDER BY pd.id asc , apd.id asc)nourut, pd.penilaian, apd.aspekpenilaian, null as nilai FROM aspekpenilaiandiklat_m apd 
            inner join penilaiandiklat_m pd on pd.id = apd.objectpenilaiandiklatfk
            where apd.objectdiklatkategorifk = $request[objectdiklatkategorifk] and apd.objectdetailjenisprodukfk = $request[objectdetailjenisprodukfk] ORDER BY pd.id asc, apd.id asc)as x "));
        
        }
        
        $result = array(
            'data'=> $data,
            'as'=>'FIzi'
        );
        return $this->respond($result);
    }
    public function saveAspekPenilaian(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        try {
            $data = $request['data'];
            foreach ($data as $d) {
                if($d['norec_hasil']== null){
                    DB::table('hasilpenilaiandiklat_t')->insert(
                        [
                        'norec'=>substr(Uuid::generate(), 0, 32),
                        'kdprofile'=> $kdProfile,
                        'statusenabled'=> true,
                        'no'=> $d['no'],
                        'aspekpenilaian'=> $d['penilaian'],
                        'penilaian'=> $d['aspekpenilaian'],
                        'nilai'=> $d['nilai'],
                        'namaexternal'=>$d['aspekpenilaian'],
                        'norec_peserta'=> $request['norec_pd']
                        ]
                    );
                }else{
                    DB::table('hasilpenilaiandiklat_t')->where('norec', $d['norec_hasil'])->update(
                        [
                        'no'=> $d['no'],
                        'aspekpenilaian'=> $d['penilaian'],
                        'penilaian'=> $d['aspekpenilaian'],
                        'nilai'=> $d['nilai'],
                        'namaexternal'=>$d['aspekpenilaian'],
                        'norec_peserta'=> $request['norec_pd']
                        ]
                    );
                }
            }
            $transStatus = true;
        } catch (\Throwable $th) {
            //throw $th;
            $transStatus= false;
        }
        if ($transStatus == 'true') {
            $transMessage = "Simpan Aspek Mahasiswa";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                // 'data' => $data,
                'as' => 'asepic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                // 'data'  => $data,
                'as' => 'asepic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    
    public function getDaftarAkunMahasiswa(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $nama = '';
        if (isset($request['nama']) && $request['nama'] != "" && $request['nama'] != "undefined") {
            $nama = $request['nama'];
        }
        $data = DB::SELECT(DB::RAW("SELECT distinct spd.nama, spd.nim, replace(spd.nim,'/','') nim_user, spd.nomorhp, 
        spe.institusipendidikan, lu.namauser, lu.passcode, pgw.namalengkap, 
		objectmodulaplikasifk mapakses, pgw.id, ma.modulaplikasi 
		FROM sdm_pesertadidik_t spd 
		left join sdm_penelitianeksternal_t spe on spe.norec = spd.noregistrasifk
		left join loginuser_s lu on spd.nim = lu.namaexternal
		left join pegawai_m pgw on lu.objectpegawaifk = pgw.id		
		left join maploginusertomodulaplikasi_s mlu on lu.id = mlu.objectloginuserfk
		left join modulaplikasi_s ma on ma.id = mlu.objectmodulaplikasifk
        where spe.kdprofile = 30 and spe.statusenabled = true and spd.kdprofile = 30 and spd.statusenabled = true
        and (lu.statusenabled = true OR lu.statusenabled is null)  and spd.nama ilike '%" . $nama . "%' order by namauser asc"));


        return $this->respond($data);
    }

}