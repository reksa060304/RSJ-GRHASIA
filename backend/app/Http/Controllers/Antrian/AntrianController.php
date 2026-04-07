<?php

/**
 * Created by PhpStorm.
 * User: Egie Ramdan
 * Date: 09/08/2021
 * Time: 4:26 PM
 */

namespace App\Http\Controllers\Antrian;

use App\Http\Controllers\ApiController;
use Carbon\Carbon;
//use Faker\Provider\DateTime;
use Carbon\CarbonPeriod;
use Illuminate\Http\Request;
use App\Traits\PelayananPasienTrait;
use App\Traits\Valet;
use DB;
use App\Transaksi\AntrianPasienRegistrasi;
use App\Web\Profile;
use Webpatser\Uuid\Uuid;

class AntrianController extends ApiController
{
    use Valet, PelayananPasienTrait;

    public function __construct()
    {
        parent::__construct($skip_authentication = false);
    }

    public function getListAntrian(Request $r)
    {
        
        $kdProfile = $this->getDataKdProfile($r);
        $now = date('Y-m-d');
        $data = DB::select(DB::raw("select jenis, count(noantrian) as last from antrianpasienregistrasi_t  
             where  statuspanggil ='0'  
             and tanggalreservasi between '$now 00:00' and '$now 23:59'
             and kdprofile = $kdProfile
             group by jenis order by jenis"));
        $data2 = DB::select(DB::raw("select jenis, max(noantrian) as last from antrianpasienregistrasi_t  
             where  statuspanggil !='0'  
             and tanggalreservasi between '$now 00:00' and '$now 23:59'
             and kdprofile = $kdProfile
             group by jenis order by jenis"));
        // dd($data2);
        $respond = [
            array('jenis' => 'A', 'sekarang' => 0, 'sisa' => 0),
            array('jenis' => 'B', 'sekarang' => 0, 'sisa' => 0),
            array('jenis' => 'C', 'sekarang' => 0, 'sisa' => 0),
            array('jenis' => 'D', 'sekarang' => 0, 'sisa' => 0),
            array('jenis' => 'E', 'sekarang' => 0, 'sisa' => 0),
            array('jenis' => 'F', 'sekarang' => 0, 'sisa' => 0),
            array('jenis' => 'G', 'sekarang' => 0, 'sisa' => 0)
        ];
        $i = 0;
        $j = 0;
        $last = [];
        foreach ($respond as $res) {
            foreach ($data2 as $d) {
                if ($d->jenis == $res['jenis']) {
                    $respond[$i]['sekarang'] = $d->last;
                    $last[] = array(
                        'nomer' => $d->last,
                        'jenis' =>  $res['jenis']
                    );
                }
            }
            foreach ($data as $d2) {
                if ($d2->jenis == $res['jenis']) {
                    $respond[$i]['sisa'] = $d2->last;
                }
            }
            $i++;
        }
        $res['last'] = $last;
        $res['data'] = $respond;
        return $this->respond($res);
    }

    public function updatePanggil(Request $r)
    {
        $now = date('Y-m-d');
        $data = collect(DB::select("select norec, noantrian from antrianpasienregistrasi_t where  
            statuspanggil ='0' and 
            jenis ='$r[jenis]' and 
            tanggalreservasi between '$now 00:00' and '$now 23:59' 
            order by tanggalreservasi"))->first();
        $res['msg'] = 'Antrian Habis';
        if (!empty($data)) {
            $update = AntrianPasienRegistrasi::where('statuspanggil', '1')
                ->where('tempatlahir', $r['loket'])
                ->update([
                    'statuspanggil' => '2'
                ]);
            $update2 = AntrianPasienRegistrasi::where('norec', $data->norec)
                ->update([
                    'statuspanggil' => '1',
                    'tempatlahir' => $r['loket'],
                    'tglinput' => date('Y-m-d H:i:s')
                ]);
            $res['msg'] = 'Antrian Ada';
        }

        return $this->respond($res);
    }

    public function getViewer(Request $r)
    {
        $awal = date('Y-m-d 00:00');
        $akhir = date('Y-m-d 23:59');
        $data = AntrianPasienRegistrasi::where('statuspanggil', '1')
            ->whereBetween('tanggalreservasi', [$awal, $akhir])
            ->orderBy('tanggalreservasi', 'desc')
            ->orderBy('tglinput', 'desc')
            ->get();
        return $this->respond($data);
    }
    public function getSettingViewer(Request $r)
    {
        $idProfile = Profile::where('statusenabled', true)->first()->id;

        // $deptJalan = explode(',', $this->settingDataFixed('listRuanganViewer', $idProfile));
        // $kdDepartemenRawatJalan = [];
        // foreach ($deptJalan as $item) {
        //     $kdDepartemenRawatJalan[] = array(
        //             'id' => $item,
        //             'namaruangan' => $item,
        //             'nocounter' =>null
        //         ); 
        // }

        $ruangan = DB::table('ruangan_m')
            ->select('id', 'namaruangan','nocounter')
            ->where('statusenabled', true)
            ->wherein('objectdepartemenfk', [18, 64, 65])
            ->orderBy('id')
            ->get();
        $farmasi = DB::table('ruangan_m')
            ->select('id', 'namaruangan','nocounter')
            ->where('statusenabled', true)
            ->wherein('objectdepartemenfk', [14])            
            ->orderBy('namaruangan')
            ->get();
        // $res['ruangan'] = $ruangan;
        $res['farmasi'] = $farmasi;
        $res['ruangan'] = $ruangan;

        return $this->respond($res);
    }
    public function getFotoDokterViewer(Request $request)
    {
        $idProfile = Profile::where('statusenabled', true)->first()->id;

        $dataPhoto = \DB::table('photopegawai_m')
        ->selectRaw('CONCAT(pathfile, CAST(filename AS VARCHAR)) as namafile')
        ->where('pegawaifk', $request['idPegawai'])
        ->first();

        if($dataPhoto != null){
        $photoAja = public_path($dataPhoto->namafile);
        $dataPhotoPegawai = 'data:image/png;base64,'.base64_encode(file_get_contents($photoAja));
        }

        $result = array(
            'photo' => $dataPhoto == null ? '' : $dataPhotoPegawai,
            "createby : " => 'ea@epic',
        );
        return $this->respond($result);

    }
    public function getDipanggil(Request $r){
        $arruangn = [];
        foreach (explode(',', $r['ruangan']) as $z){
            $arruangn[] =$z;
        }
        $apd = DB::table('antrianpasiendiperiksa_t as apd')
        ->join('pasiendaftar_t as pd','pd.norec','=','apd.noregistrasifk')
        ->join('pasien_m as ps','ps.id','=','pd.nocmfk')
        ->select('ps.nocm','ps.namapasien','apd.noantrian','apd.objectruanganfk')
        // ->whereBetween('apd.tglregistrasi',[date('Y-m-d 00:00'),date('Y-m-d 23:59')])
        ->where('apd.statusenabled', true)
        ->whereIn('apd.objectruanganfk',$arruangn)
        ->where('apd.statusantrian',1)
        ->whereNotNull('apd.tgldipanggilsuster')
        ->orderByRaw("apd.noantrian asc,apd.tgldipanggilsuster asc")
        ->first();
        return $this->respond($apd);
    }
    public function getListAntrianFarm(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $kdJenisTrasnsaksiResep = (int) $this->settingDataFixed('kdKelompokTransaksiOrderResep', $kdProfile);
        $tglAwal =date('Y-m-d 00:00');
        $tglAkhir =date('Y-m-d 23:59');
           // $data = \DB::select(DB::raw("
        //     SELECT noantri,keterangan,jenis,tglresep,noresep,st.status
        //     FROM  antrianapotiktr AS aa
        //     WHERE aa.koders = 1 AND aa.tglresep  >= '$tglAwal'AND aa.tglresep <=  '$tglAkhir'
        //     AND aa.aktif = 't'
        //     order by noantri asc
        // "));
        $data = \DB::select(DB::raw("
        SELECT sr.noresep,aa.noantri AS aanoantri,aa.jenis AS aajenis,aa.keterangan,sr.tglresep,ru2.namaruangan,ru.namaruangan as ruanganasal,
        CASE when aa.status ='0'  then 'Verifikasi'
        when aa.status ='6'  then 'Verifikasi'
        when aa.status ='1'  then 'Produksi'
        when aa.status ='2'  then 'Packaging'
        when aa.status ='3'  then 'Selesai'
        when aa.status ='4'  then 'Penyerahan Obat'
        when sr.tglambilresep !=null  then 'Sudah Di Ambil'
        else ''  end as statusorder,pd.noregistrasi,ps.nocm,ps.namapasien,
        EXTRACT (YEAR FROM AGE(pd.tglregistrasi,ps.tgllahir )) || ' Thn ' as umur,
        CASE WHEN ps.objectjeniskelaminfk = 1 THEN 'L' ELSE 'P' END as jk
        FROM strukresep_t AS sr
        INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.norec = sr.pasienfk
        INNER JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk
        INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
        INNER JOIN ruangan_m AS ru2 ON ru2.id = sr.ruanganfk
        LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
        INNER JOIN antrianapotik_t AS aa ON aa.noresep = sr.noresep
        WHERE sr.kdprofile = $kdProfile AND sr.tglresep between '$tglAwal' and '$tglAkhir'
        AND sr.statusenabled= 't' 
        AND (sr.ispanggil IS NULL OR sr.ispanggil = false)
         and sr.tglambilresep is null
         and aa.status in ('1','2','3')
        order by sr.tglresep asc
        "));
        return $data;
    }
    public function getListAntrianFarmTerlewat(Request $request){
        $kdProfile = $this->getDataKdProfile($request);
        $kdJenisTrasnsaksiResep = (int) $this->settingDataFixed('kdKelompokTransaksiOrderResep', $kdProfile);
        $tglAwal =date('Y-m-d 00:00');
        $tglAkhir =date('Y-m-d 23:59');
           // $data = \DB::select(DB::raw("
        //     SELECT noantri,keterangan,jenis,tglresep,noresep,st.status
        //     FROM  antrianapotiktr AS aa
        //     WHERE aa.koders = 1 AND aa.tglresep  >= '$tglAwal'AND aa.tglresep <=  '$tglAkhir'
        //     AND aa.aktif = 't'
        //     order by noantri asc
        // "));
        $data = \DB::select(DB::raw("
        SELECT sr.noresep,aa.noantri AS aanoantri,aa.jenis AS aajenis,aa.keterangan,sr.tglresep,ru2.namaruangan,ru.namaruangan as ruanganasal,
        CASE when aa.status ='0'  then 'Verifikasi'
        when aa.status ='6'  then 'Verifikasi'
        when aa.status ='1'  then 'Produksi'
        when aa.status ='2'  then 'Packaging'
        when aa.status ='3'  then 'Selesai'
        when aa.status ='4'  then 'Penyerahan Obat'
        when sr.tglambilresep !=null  then 'Sudah Di Ambil'
        else ''  end as statusorder,pd.noregistrasi,ps.nocm,ps.namapasien,
        EXTRACT (YEAR FROM AGE(pd.tglregistrasi,ps.tgllahir )) || ' Thn ' as umur,
        CASE WHEN ps.objectjeniskelaminfk = 1 THEN 'L' ELSE 'P' END as jk
        FROM strukresep_t AS sr
        INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.norec = sr.pasienfk
        INNER JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk
        INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
        INNER JOIN ruangan_m AS ru2 ON ru2.id = sr.ruanganfk
        LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
        INNER JOIN antrianapotik_t AS aa ON aa.noresep = sr.noresep
        WHERE sr.kdprofile = $kdProfile AND sr.tglresep between '$tglAwal' and '$tglAkhir'
        AND sr.statusenabled= 't' 
        AND sr.ispanggil = true
         and sr.tglambilresep is null
         and aa.status in ('1','2','3')
        order by sr.tglresep asc
        "));
        return $data;
    }
    public function getViewerFar(Request $r)
    {
        $awal = date('Y-m-d 00:00');
        $akhir = date('Y-m-d 23:59');
        // $awal = date('2022-06-01 00:00');
        // $akhir = date('2022-08-03 23:59');
        $data = DB::table('antrianapotik_t')->where('status', '5')
            ->whereBetween('tglresep', [$awal, $akhir])
            ->orderBy('tglresep', 'desc')
            ->get();

       $farmasi = DB::table('ruangan_m')
            ->select('id', 'namaruangan','nocounter')
            ->where('statusenabled', true)
            ->wherein('objectdepartemenfk', [14])
            ->orderBy('namaruangan')
            ->get();
        $res['farmasi'] = $farmasi;
        $res['data'] = $data;   
        return $this->respond($res);
    }

    public function getStatusPelayanan(Request $r)
    {
        $awal = date('Y-m-d 00:00');
        $akhir = date('Y-m-d 23:59');

        $query = DB::table('antrianpasiendiperiksa_t as apd')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->select(
                'ps.nocm',
                'ps.namapasien',
                'apd.tgldipanggildokter',
                'apd.tgldipanggilsuster',
                'ru.id',
                DB::raw('SUM(CASE WHEN apd.tgldipanggildokter IS NOT NULL OR apd.tgldipanggilsuster IS NOT NULL THEN 1 ELSE 0 END) OVER () AS sudahdilayani'),
                DB::raw('SUM(CASE WHEN apd.tgldipanggildokter IS NULL AND apd.tgldipanggilsuster IS NULL THEN 1 ELSE 0 END) OVER () AS belumdilayani')
            )
            ->whereBetween('pd.tglregistrasi', [$awal, $akhir])
            ->where('pd.statusenabled', true)
            ->where('ps.statusenabled', true)
            ->whereIn('ru.objectdepartemenfk', [18, 24, 28, 26, 30, 34]);

        // Tambahkan kondisi untuk memeriksa apakah ada parameter ruangid
        if ($r->has('ruangid')) {
            // Ambil inputan ruangid dari request sebagai string dan pisahkan dengan explode
            $ruangidArray = explode(',', $r->input('ruangid'));

            // Gunakan whereNotIn untuk mengecualikan ruangid yang diterima
            $query->whereIn('ru.id', $ruangidArray);
        }

        $data = $query->get();

        return $this->respond($data);
    }



}
