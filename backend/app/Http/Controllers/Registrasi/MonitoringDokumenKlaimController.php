<?php
namespace App\Http\Controllers\Registrasi;

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use Response;
use DB;
use App\Traits\Valet;
use File;
use App\Transaksi\PasienDaftar;
use iio\libmergepdf\Merger;

class MonitoringDokumenKlaimController extends ApiController
{
    use Valet;

    public function __construct() {
        parent::__construct($skip_authentication=true);
    }

    public function lihatDokumen(Request $request) {
        $path = public_path('dokumen_klaim/'.$request['noregistrasi'].'/' . $request['filename']);

        if (!File::exists($path)) {
            echo '
            <script language="javascript">
                window.alert("File tidak ada.");
                window.close()
            </script>';
            die;
        }

        $file = File::get($path);
        $type = File::mimeType($path);

        $response = Response::make($file, 200);
        $response->header("Content-Type", $type);

        return $response;
    }

    public function bundleDokumen(Request $request) {
        $dataRegistrasi = PasienDaftar::where('noregistrasi', $request['noregistrasi'])->first();

        $dataDokumen = DB::table('dokklaim_t as mk')
            ->join("dokklaim_m as dk", "dk.id", "=", "mk.documentklaimfk")
            ->where('mk.statusenabled', true)
            ->where('mk.noregistrasifk', $dataRegistrasi->norec)
            ->orderBy('dk.nourut')
            ->get();

        $fileName = 'bundle_'.$request['noregistrasi'].'.pdf';
        $pathbundle = 'dokumen_klaim/'.$request['noregistrasi'] . "/" . $fileName;

        if (File::exists($pathbundle)){
            File::delete($pathbundle);
        }

        if(count($dataDokumen) > 0){
            $file = [];
            foreach($dataDokumen as $item) {
                $filePath = public_path($item->filepath);
                if (File::exists($filePath)) {
                    array_push($file, $filePath);
                }
            }

            $merger = new Merger;
            foreach ($file as $data) {
                $merger->addFile($data);
            }

            $createdPdf = $merger->merge();
            File::put(public_path($pathbundle), $createdPdf);

            $file = File::get($pathbundle);
            $type = File::mimeType($pathbundle);

            $response = Response::make($file, 200);
            $response->header("Content-Type", $type);
            return $response;

        } else {
            echo '
            <script language="javascript">
                window.alert("Tidak ada data.");
                window.close()
            </script>';
            die;
        }
    }
}
