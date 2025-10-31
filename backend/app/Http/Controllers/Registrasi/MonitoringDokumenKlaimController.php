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

    public function lihatDokumenFarmasi(Request $request) {
        $path = public_path('dokumen_klaim_farmasi/'.$request['noregistrasi'].'/' . $request['filename']);

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
        $ruangan = DB::table('ruangan_m as ru')->where('ru.id',$dataRegistrasi->objectruanganlastfk)->first();
        $depid = 18;
        if($ruangan->objectdepartemenfk == 16){
            $depid = 16;
        }

        $dataDokumen = DB::table('dokklaim_t as mk')
        ->join("dokklaim_m as dk", "dk.id", "=", "mk.documentklaimfk")
        ->where('mk.statusenabled', true)
        ->where('dk.departemenfk', $depid)
        ->where('mk.noregistrasifk', $dataRegistrasi->norec)
        ->orderBy('dk.nourut')
        ->orderByRaw("
        CASE
        WHEN mk.filename LIKE 'Flowchart_%' AND LENGTH(SPLIT_PART(SPLIT_PART(mk.filename, '_', 2), '_', 1)) <= 10
        THEN CAST(SPLIT_PART(SPLIT_PART(mk.filename, '_', 2), '_', 1) AS BIGINT)
        ELSE 99999999
    END ASC, 
    mk.filename ASC
    ")
        ->get();

        $fileName = 'bundle_'.$request['noregistrasi'].'.pdf';
        $pathbundle = 'dokumen_klaim/'.$request['noregistrasi'] . "/" . $fileName;
        if (File::exists($pathbundle)){
            File::delete($pathbundle);
        }

        if(count($dataDokumen) > 0){
            $file = [];
            $processedFiles = [];
            // foreach($dataDokumen as $item) {
                
            //     // Script converte gs untuk coba di local window *Note: harus install wsl terlebih dahulu !
            //     // $path = explode("/", $item->filepath);
            //     // $basepath = $path[0] . "/" . $path[1];
            //     // $namafiletemp = str_replace("\\", "/", str_replace("C:\\","/mnt/c/", public_path($basepath . "/temp_". $item->filename)));
            //     // $namafile = str_replace("\\", "/", str_replace("C:\\","/mnt/c/", public_path($basepath . "/". $item->filename)));

            //     // exec('wsl cp "'.$namafile.'" "'.$namafiletemp.'"');
            //     // exec('wsl gs -dBATCH -dNOPAUSE -q -sDEVICE=pdfwrite -sOutputFile="'.$namafiletemp.'" "'.$namafile.'"'); 
            //     // exec('wsl mv "'.$namafiletemp.'" "'.$namafile.'"');

            //     // Script converte gs server
            //     // Matiin dlu
            //     if (in_array($item->filename, $processedFiles)) {
            //         continue; 
            //     }
        
            //     $processedFiles[] = $item->filename;
            //     $path = explode("/", $item->filepath);
            //     $basepath = $path[0] . "/" . $path[1];
            //     $namafiletemp = public_path($basepath . "/temp_". $item->filename);
            //     $namafile = public_path($basepath . "/". $item->filename);

            //     exec('cp "'.$namafile.'" "'.$namafiletemp.'"');
            //     // exec('gs -dBATCH -dNOPAUSE -q -sDEVICE=pdfwrite -sOutputFile="'.$namafiletemp.'" "'.$namafile.'"'); 
            //     // exec('gs -dBATCH -dNOPAUSE -dSAFER -sDEVICE=pdfwrite -dPDFSETTINGS=/prepress -dDetectDuplicateImages=true -dEmbedAllFonts=true -sOutputFile="'.$namafiletemp.'" "'.$namafile.'"'); 
            //     // exec('gs -dBATCH -dNOPAUSE -q -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/printer -sOutputFile="'.$namafiletemp.'" "'.$namafile.'"');
            //     // if (isset($item->filename) && stripos($item->filename, 'pengkajian') === false && stripos($item->filename, 'Surat Keterangan Dialisis') === false && !in_array($item->documentklaimfk,[72,78])) {
            //     // $command = 'gs -dBATCH -dNOPAUSE -q -sDEVICE=pdfwrite -dPDFSETTINGS=/prepress -sOutputFile="'.$namafiletemp.'" "'.$namafile.'"';
            //     // exec($command . ' 2>&1', $output, $return_var);
            //     // }

            //     $skipConvert = false;
            //     $perluConvert = false;

            //     if (isset($item->filename) &&(stripos($item->filename, 'pengkajian') !== false || stripos($item->filename, 'Surat Keterangan Dialisis') !== false || in_array($item->documentklaimfk, [72, 78]))) {
            //         $skipConvert = true;
            //     }
            
            //     if (!$skipConvert) {
            //         try {
            //             $testPdf = new Fpdi();
            //             $testPdf->setSourceFile($namafile);
            //         } catch (\Throwable $e) {
            //             $perluConvert = true;
            //         }
            //     }
            
            //     if ($perluConvert) {
            //         $command = 'gs -dBATCH -dNOPAUSE -q -sDEVICE=pdfwrite -dPDFSETTINGS=/prepress -sOutputFile="'.$namafiletemp.'" "'.$namafile.'"';
            //         exec($command . ' 2>&1', $output, $return_var);
            //         exec('mv "'.$namafiletemp.'" "'.$namafile.'"');
            //     }


                
            //     exec('mv "'.$namafiletemp.'" "'.$namafile.'"');

            //     // $command = new GhostscriptConverterCommand();
            //     // $filesystem = new Filesystem();

            //     // $converter = new GhostscriptConverter($command, $filesystem);
            //     // $converter->convert(public_path($item->filepath), '1.4');

            //     array_push($file, public_path($item->filepath));
            // }

            foreach($dataDokumen as $item) {
                if (in_array($item->filename, $processedFiles)) {
                    continue; 
                }
                $processedFiles[] = $item->filename;
        
                $path = explode("/", $item->filepath);
                $basepath = $path[0] . "/" . $path[1];
                $namafile = public_path($basepath . "/" . $item->filename);
                $namafiletemp = public_path($basepath . "/temp_" . $item->filename);
        
                $skipConvert = true;
                $perluConvert = false;
        
                if (
                    isset($item->filename) && stripos($item->filename, 'pengkajian') === false && stripos($item->filename, 'Surat Keterangan Dialisis') === false && !in_array($item->documentklaimfk,[72,78,85,86,76,77,80,81,73,79,31,9,59,70,71,83,84])) {
                    $skipConvert = false;
                }
        
                if ($skipConvert) {
                    try {
                        $testPdf = new Fpdi();
                        $testPdf->setSourceFile($namafile);
                    } catch (\Throwable $e) {
                        $perluConvert = true;
                    }
                }
        
                if ($perluConvert) {
                    exec('cp "' . $namafile . '" "' . $namafiletemp . '"');
                    $command = 'gs -dBATCH -dNOPAUSE -q -sDEVICE=pdfwrite -dPDFSETTINGS=/prepress -sOutputFile="' . $namafiletemp . '" "' . $namafile . '"';
                    exec($command . ' 2>&1', $output, $return_var);
        
                    if ($return_var === 0) {
                        exec('mv "' . $namafiletemp . '" "' . $namafile . '"');
                    } else {
                        \Log::error("GS Convert failed for {$item->filename}: " . implode("\n", $output));
                    }
                }
        
                array_push($file, $namafile);
            }
    
            $pdf = PDFMerger::init();
            foreach ($file as $data) {
                $pdf->addPDF($data, 'all');
            }
            $pdf->merge();
            $pdf->save(public_path($pathbundle));
    
            $file = File::get($pathbundle);
            $type = File::mimeType($pathbundle);

            if(isset($request['nosep'])){
                return Response::download(public_path($pathbundle), $request['nosep'] . '.pdf', [
                    'Content-Type' => $type
                ]);
            } else {
                $response = Response::make($file, 200);
                $response->header("Content-Type", $type);
                return $response;
            }
            

            
           

        } else {
            echo '
            <script language="javascript">
                window.alert("Tidak ada data.");
                window.close()
            </script>';
            die;
        }
    }

    public function bundleDokumenFarmasi(Request $request) {
        $dataRegistrasi = PasienDaftar::where('noregistrasi', $request['noregistrasi'])->first();        

        $dataDokumen = DB::table('dokklaimfarmasi_t as mk')
        ->join("dokklaimfarmasi_m as dk", "dk.id", "=", "mk.documentklaimfk")
        ->where('mk.statusenabled', true)
        ->where('mk.noregistrasifk', $dataRegistrasi->norec)
        ->orderBy('dk.nourut')
        ->orderByRaw("
        CASE
        WHEN mk.filename LIKE 'Flowchart_%' AND LENGTH(SPLIT_PART(SPLIT_PART(mk.filename, '_', 2), '_', 1)) <= 10
        THEN CAST(SPLIT_PART(SPLIT_PART(mk.filename, '_', 2), '_', 1) AS BIGINT)
        ELSE 99999999
    END ASC, 
    mk.filename ASC
    ")
        ->get();

        $fileName = 'bundle_'.$request['noregistrasi'].'.pdf';
        $pathbundle = 'dokumen_klaim_farmasi/'.$request['noregistrasi'] . "/" . $fileName;
        if (File::exists($pathbundle)){
            File::delete($pathbundle);
        }

        if(count($dataDokumen) > 0){
            $file = [];
            $processedFiles = [];

            foreach($dataDokumen as $item) {
                if (in_array($item->filename, $processedFiles)) {
                    continue; 
                }
                $processedFiles[] = $item->filename;
        
                $path = explode("/", $item->filepath);
                $basepath = $path[0] . "/" . $path[1];
                $namafile = public_path($basepath . "/" . $item->filename);
                $namafiletemp = public_path($basepath . "/temp_" . $item->filename);
        
                $skipConvert = true;
                $perluConvert = false;

                if (!in_array($item->documentklaimfk,[14])) {
                    $skipConvert = false;
                }
        
                if ($skipConvert) {
                    try {
                        $testPdf = new Fpdi();
                        $testPdf->setSourceFile($namafile);
                    } catch (\Throwable $e) {
                        $perluConvert = true;
                    }
                }
        
                if ($perluConvert) {
                    exec('cp "' . $namafile . '" "' . $namafiletemp . '"');
                    $command = 'gs -dBATCH -dNOPAUSE -q -sDEVICE=pdfwrite -dPDFSETTINGS=/prepress -sOutputFile="' . $namafiletemp . '" "' . $namafile . '"';
                    exec($command . ' 2>&1', $output, $return_var);
        
                    if ($return_var === 0) {
                        exec('mv "' . $namafiletemp . '" "' . $namafile . '"');
                    } else {
                        \Log::error("GS Convert failed for {$item->filename}: " . implode("\n", $output));
                    }
                }
        
                array_push($file, $namafile);
            }
    
            $mergedPdfPath = public_path($pathbundle);
            $pdfMerger = PDFMerger::init();
            foreach ($file as $data) {
                $pdfMerger->addPDF($data, 'all');
            }
            
            $pdfMerger->merge();
            $pdfMerger->save($mergedPdfPath);

            $pdf = new Fpdi();

            // Memuat file PDF gabungan yang sudah disimpan
            $pageCount = $pdf->setSourceFile($mergedPdfPath);
            
            for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {
                // Mengambil ukuran halaman
                $size = $pdf->getTemplateSize($pdf->importPage($pageNo));
                
                // Menambahkan halaman baru dengan ukuran yang sama dengan halaman asli
                $pdf->addPage($size['orientation'], [$size['width'], $size['height']]);
                
                // Menggunakan template halaman yang diimpor
                $template = $pdf->importPage($pageNo);
                $pdf->useTemplate($template, 0, 0, $size['width'], $size['height']);
            }
            
            $pdf->setTitle('Bundle_' . $request['noregistrasi']);
            
            $pdf->Output('F', $mergedPdfPath);
    
            $file = File::get($pathbundle);
            $type = File::mimeType($pathbundle);

            if(isset($request['nosep'])){
                return Response::download(public_path($pathbundle), $request['nosep'] . '.pdf', [
                    'Content-Type' => $type
                ]);
            } else {
                $response = Response::make($file, 200);
                $response->header("Content-Type", $type);
                return $response;
            }
            

            
           

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
