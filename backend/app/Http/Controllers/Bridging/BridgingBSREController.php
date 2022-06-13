<?php

/**
 * Created by Vscode.
 * User: Egie Ramdan
 * Date: 03/06/2022
 * Time: 10.20
 */


namespace App\Http\Controllers\Bridging;

use App\Http\Controllers\ApiController;
use App\Master\Ruangan;
use App\Traits\Valet;
use Carbon\Carbon;
use Illuminate\Http\Request;
use DB;
use Date;

use App\Traits\PelayananPasienTrait;
use Illuminate\Support\Facades\Storage;

class BridgingBSREController  extends ApiController
{

  use Valet, PelayananPasienTrait;

  public function __construct()
  {
    parent::__construct($skip_authentication = false);
  }
  protected $auth =  'Z3JoYXNpYTpYYkI2cG5aeGc2VktLLXM5bzI0Tg==';
  protected $url = 'http://103.255.15.130/';
  protected $username = 'grhasia';
  protected $password = 'XbB6pnZxg6VKK-s9o24N';
  protected $passphrase = '!Bsre1221* ';

  function headers()
  {
    return  array(
      'Authorization: Basic ' . $this->auth,
      'Content-Type: multipart/form-data'
    );
  }
  public function signDokumen(Request $r)
  {
    $headers = $this->headers();
    
    $dataJsonSend = $r->input();
    unset($dataJsonSend['userData']);
    $methods = 'POST';
    $isi = file_get_contents($r->file('file'));
    $file_name = $r['nik'].'.pdf';
    Storage::disk('local')->put($file_name, $isi);
    $path =storage_path('app/'.$file_name);// Storage::disk('local')->url($file_name);
  
    $dataJsonSend['file'] = file_get_contents($path);
   
    // dd($dataJsonSend);
    $url = $this->url . "api/sign/pdf";
    $response = $this->sendBridgingCurl($headers, $dataJsonSend, $url, $methods);
    return $this->respond($response);
  }

  public function downloadDokumen($id_dokumen )
  {
    $headers = $this->headers();
    $dataJsonSend = null;
    $methods = 'GET';
    $url = $this->url . "api/sign/download/" . $id_dokumen ;
    $response = $this->sendBridgingCurl($headers, $dataJsonSend, $url, $methods);
    return $this->respond($response);
  }
  public function verifyDokumen(Request $r)
  {
    $headers = $this->headers();
    $dataJsonSend =  array(
      'signed_file' => new \CURLFILE(
        '/Users/fxbayuanggara/Downloads/Form_Laporan_Penanganan_Insiden_Siber_1.pdf'
      )
    );
    $methods = 'POST';
    $url = $this->url . "api/sign/verify";
    $response = $this->sendBridgingCurl($headers, $dataJsonSend, $url, $methods);
    return $this->respond($response);
  }
  public function cekStatusUser($nik)
  {
    $headers = $this->headers();
    $dataJsonSend =  null;
    $methods = 'GET';
    $url = $this->url . "api/user/status/" . $nik;
    $response = $this->sendBridgingCurl($headers, $dataJsonSend, $url, $methods);
    return $this->respond($response);
  }
  public function registrasi(Request $r)
  {
    $headers = $this->headers();
    $dataJsonSend =   array(
      'nik' => '0803202100007062',
      'nip' => '197028102010101005',
      'nama' => 'Andre',
      'email' => 'andreyanto@bssn.go.id',
      'nomor_telepon' => '08971505629',
      'kota' => 'Jakarta',
      'provinsi' => 'DKI Jakarta',
      'jabatan' => 'Kepala Staff',
      'unit_kerja' => 'Direktorat Keamanan',
      'image_ttd' => new \CURLFILE('/Users/andreyantopratama/Data_Registrasi/Tanda_Tangan.png'),
      'ktp' => new \CURLFILE('/Users/andreyantopratama/Data_Registrasi/KTP.jpeg'),
      'surat_rekomendasi' => new \CURLFILE('/Users/andreyantopratama/Data_Registrasi/surat_rekomendasi.pdf')
    );
    $methods = 'POST';
    $url = $this->url . "api/user/registrasi";
    $response = $this->sendBridgingCurl($headers, $dataJsonSend, $url, $methods);
    return $this->respond($response);
  }
}
