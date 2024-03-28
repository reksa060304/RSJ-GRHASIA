<?php

namespace App\Http\Controllers\EMR;

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use App\Traits\Valet;
use Illuminate\Support\Facades\DB;

class BundleHaisController extends ApiController
{
    use Valet;

    public function __construct()
    {
        parent::__construct($skip_authentication = false);
    }

    public function getComboVerifHais(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        
        $data = DB::table('haisbundle_m')
            ->where('statusenabled', true)
            ->where('kdprofile', $kdProfile)
            ->where('jenisbundle', 'TINDAKAN')
            ->orWhere('jenisbundle', 'INFEKSIRUMAHSAKIT')
            ->get();

        return $this->respond($data);
    }

    public function getBundleHais(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        
        $masterTindakandanInfeksi = DB::table('haisbundle_m')
            ->where('statusenabled', true)
            ->where('kdprofile', $kdProfile)
            ->where('jenisbundle', 'TINDAKAN')
            ->orWhere('jenisbundle', 'INFEKSIRUMAHSAKIT')
            ->get();
        
        $data = DB::table('bundlehai_t as bd')
            ->select(DB::raw("bd.norec,bd.notransaksi,bd.tglpemeriksaan,bd.petugasfk,
                    pg.namalengkap, apd.objectruanganfk,ru.namaruangan, bd.isverifikasi,
                    bd.jenisbundle,bd.suhu,bd.diagnosa,bd.tirahbaring,
                    pm.id as idpasien, pm.namapasien"))
            ->when($request['norec_pd'], function($query) use ($request){
                return $query->where('bd.norec_pd', $request['norec_pd']);
            })
            ->when($request['objectruanganfk'], function($query) use ($request){
                return $query->where('ru.id', $request['objectruanganfk']);
            })
            ->when($request['bulan'], function($query) use ($request){
                return $query->whereRaw('to_char(bd.tglpemeriksaan, \'MM-YYYY\') = ?', [$request['bulan']]);
            })
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'bd.norec_pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'bd.norec_apd')
            ->join('pasien_m as pm', 'pm.id', '=', 'pd.nocmfk')
            ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'bd.petugasfk')
            ->where('bd.statusenabled', true)
            ->where('bd.kdprofile', $kdProfile)
            ->orderBy('bd.tglpemeriksaan', 'desc')
            ->get();
        
        $detail = DB::table('bundlehaidetail_t as bdt')
            ->where('bdt.statusenabled', true)
            ->where('bdt.kdprofile', $kdProfile)
            ->get();
        
        $verifikator = $this->settingDataFixed('VerifikatorHais', $kdProfile);
        
        foreach($data as $da){
            foreach($masterTindakandanInfeksi as $ma){
                $func = 'w'. $ma->id;
                $da->$func = false;
                foreach($detail as $dt){
                    if($da->norec == $dt->bundlehaifk && $dt->bundlefk == $ma->id){
                        $da->$func = true;
                    }
                }
            }
        }

        return $this->respond([
            'dataHais' => $data,
            'verifikator' => $verifikator
        ]);
    }

    public function verifBundleHais(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);

        DB::beginTransaction();
        try{
            DB::table('bundlehai_t')->where('norec', $request['norec'])->update([
                'isverifikasi' => TRUE
            ]);
            $transStatus = true;
        }catch(Exception $e){
            $transStatus = false;
        }

        if ($transStatus) {
            $transMessage = "Verifikasi Data Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            $transMessage = "Verifikasi Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
}