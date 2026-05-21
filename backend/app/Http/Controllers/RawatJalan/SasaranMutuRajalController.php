<?php

namespace App\Http\Controllers\RawatJalan;

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use App\Traits\Valet;
use DB;
use Carbon\Carbon;

class SasaranMutuRajalController extends ApiController
{
    use Valet;

    public function __construct()
    {
        parent::__construct();
    }

    public function getCombo(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        
        $deptJalan = explode(',', $this->settingDataFixed('kdDepartemenRawatJalanFix', $idProfile));
        $kdDepartemenRawatJalan = [];
        foreach ($deptJalan as $item) {
            $kdDepartemenRawatJalan[] = (int)$item;
        }
        
        $dataRuangan = \DB::table('ruangan_m as ru')
            ->select('ru.id', 'ru.namaruangan')
            ->where('ru.kdprofile', $idProfile)
            ->where('ru.statusenabled', true)
            ->whereIn('ru.objectdepartemenfk', $kdDepartemenRawatJalan)
            ->orderBy('ru.namaruangan')
            ->get();

        $result = array(
            'ruangan' => $dataRuangan,
            'message' => 'success',
        );
        return $this->respond($result);
    }

    public function getDataGrid(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $filter = $request->all();

        $deptJalan = explode(',', $this->settingDataFixed('kdDepartemenRawatJalanFix', $idProfile));
        $kdDepartemenRawatJalan = [];
        foreach ($deptJalan as $item) {
            $kdDepartemenRawatJalan[] = (int)$item;
        }

        $data = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->select(
                'pd.noregistrasi',
                'ps.namapasien',
                'pd.tglcheckin',
                'apd.tgldipanggildokter',
                'ru.namaruangan'
            )
            ->where('pd.kdprofile', $idProfile)
            ->where('pd.statusenabled', true)
            ->where('apd.statusenabled', true)
            ->whereNotNull('pd.tglcheckin')
            ->whereNotNull('apd.tgldipanggildokter')
            ->whereIn('ru.objectdepartemenfk', $kdDepartemenRawatJalan)
            ->orderBy('pd.tglcheckin');

        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $tgl = $filter['tglAkhir'] . " 23:59:59";
            $data = $data->where('pd.tglregistrasi', '<=', $tgl);
        }
        if (isset($filter['ruanganId']) && $filter['ruanganId'] != "" && $filter['ruanganId'] != "undefined") {
            $data = $data->where('apd.objectruanganfk', '=', $filter['ruanganId']);
        }

        $data = $data->get();
        $dataResult = [];

        foreach ($data as $item) {
            $tglCheckin = Carbon::parse($item->tglcheckin);
            $tglDipanggil = Carbon::parse($item->tgldipanggildokter);

            $diffInSeconds = $tglDipanggil->diffInSeconds($tglCheckin);
            if ($tglDipanggil->lt($tglCheckin)) {
                $diffInSeconds = 0;
            }

            $hours = floor($diffInSeconds / 3600);
            $minutes = floor(($diffInSeconds % 3600) / 60);
            $seconds = $diffInSeconds % 60;

            $waktulayanan = sprintf('%02d:%02d:%02d', $hours, $minutes, $seconds);
            $menit_tunggu = round($diffInSeconds / 60, 2);

            $dataResult[] = array(
                'noregistrasi' => $item->noregistrasi,
                'namapasien' => $item->namapasien,
                'namaruangan' => $item->namaruangan,
                'tglcheckin' => $item->tglcheckin,
                'tgldipanggildokter' => $item->tgldipanggildokter,
                'menit_tunggu' => $menit_tunggu,
                'waktulayanan' => $waktulayanan,
            );
        }

        $result = array(
            'data' => $dataResult,
            'message' => 'success',
        );
        return $this->respond($result);
    }
}
