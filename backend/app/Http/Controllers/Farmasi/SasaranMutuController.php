<?php
/**
 * Created by PhpStorm.
 * User: nengepic
 * Date: 22/08/2019
 * Time: 14:50
 */
/**
 * Created by PhpStorm.
 * User: as@epic
 * Date: 29/08/2017
 * Time: 15.30
 */

namespace App\Http\Controllers\Farmasi;

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use App\Traits\Valet;
use DB;

//use App\Transaksi\StrukPelayanan;

class SasaranMutuController extends ApiController
{
    use Valet;

    public function __construct()
    {
        parent::__construct();
    }

    public function getDataCombo(Request $request){
        $dataLogin=$request->all();
        $dataRuangan = \DB::table('ruangan_m as ru')
            ->select('ru.id','ru.namaruangan')
            ->where('ru.objectdepartemenfk',14)
            ->where('ru.statusenabled',true)
            ->orderBy('ru.namaruangan')
            ->get();

        $dataDokter = \DB::table('pegawai_m as pg')
            ->select('pg.id','pg.namalengkap')
            ->where('pg.objectjenispegawaifk',1)
            ->where('pg.statusenabled',true)
            ->orderBy('pg.namalengkap')
            ->get();

        $result= array(
            'ruangan' => $dataRuangan,
            'dokter' => $dataDokter,
            'message' => 'as@epic',
        );
        return $this->respond($result);
    }

    public function getDataGrid(Request $request){
        $dataLogin=$request->all();
        $filter=$request->all();
        $data = \DB::table('strukresep_t as sr')
            ->leftJoin(DB::raw('antrianapotik_t aa'), function($x) {
                $x->on('aa.noresep','=','sr.noresep')
                ->on('aa.statusenabled','=',DB::raw('true'));
            })
            ->select('sr.noresep','sr.tglresep','sr.penulisresepfk','sr.ruanganfk','sr.tglambilresep as tglambilreseplama','sr.tglselesai as tglambilresep'
            ,DB::raw("case when sr.tglambilresep is not null then 'Telah diserahkan oleh ' || coalesce(sr.namapemberi,'') || ' kepada ' ||  coalesce(sr.namalengkapambilresep,'') else '' end  as keterangan")
            ,DB::raw(" 
            div(EXTRACT(EPOCH FROM sr.tglselesai - sr.tglresep)::int,3600)
            ||':'||
            to_char(sr.tglselesai - sr.tglresep,'MI:SS')
            as waktulayanan, case when aa.jenis = 'N' then 'Non Racikan' else 'Racikan' end jenisantrian"))
            ->where('sr.statusenabled',true)
            ->orderBy('sr.tglresep');
        if(isset($filter['tglAwal']) && $filter['tglAwal']!="" && $filter['tglAwal']!="undefined"){
            $data = $data->where('sr.tglresep','>=', $filter['tglAwal']);
        }
        if(isset($filter['tglAkhir']) && $filter['tglAkhir']!="" && $filter['tglAkhir']!="undefined"){
            $tgl= $filter['tglAkhir']." 23:59:59";
            $data = $data->where('sr.tglresep','<=', $tgl);
        }
        if(isset($request['penulisresepfk']) && $request['penulisresepfk']!="" && $request['penulisresepfk']!="undefined"){
            $data = $data->where('sr.penulisresepfk','=', $request['penulisresepfk']);
        }
        if(isset($request['ruanganfk']) && $request['ruanganfk']!="" && $request['ruanganfk']!="undefined"){
            $data = $data->where('sr.ruanganfk','=', $request['ruanganfk']);
        }
        $data = $data->get();

        $data2 = [];
        foreach ($data as $item){
            $data2[] = array(
                'noresep' => $item->noresep,
                'jenisantrian' => $item->jenisantrian,
                'tglresep' => $item->tglresep,
                'tglselesai' => $item->tglambilresep,
                'waktulayanan' => $item->waktulayanan,
                'keterangan' => $item->keterangan,
            );
        }
        $result= array(
            'data' => $data2,
            'message' => 'as@epic',
        );
        return $this->respond($result);
    }
}