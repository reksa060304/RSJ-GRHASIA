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
        $now = date('Y-m-d');
        $data = DB::select(DB::raw("select jenis, count(noantrian) as last from antrianpasienregistrasi_t  
             where  statuspanggil ='0'  
             and tanggalreservasi between '$now 00:00' and '$now 23:59'
             group by jenis order by jenis"));
        $data2 = DB::select(DB::raw("select jenis, max(noantrian) as last from antrianpasienregistrasi_t  
             where  statuspanggil !='0'  
             and tanggalreservasi between '$now 00:00' and '$now 23:59'
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

}