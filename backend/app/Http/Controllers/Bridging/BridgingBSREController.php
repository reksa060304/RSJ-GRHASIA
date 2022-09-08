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
use \Mpdf\Mpdf;
use App\Traits\PelayananPasienTrait;
use App\Web\Profile;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade as PDF;
use Response;
use App\Transaksi\EMR_BSRE;
use App\Master\Pegawai;
use App\Transaksi\EMRPasien;
use App\Transaksi\LoggingUser;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Webpatser\Uuid\Uuid;

class BridgingBSREController  extends ApiController
{

    use Valet, PelayananPasienTrait;

    public function __construct()
    {
        parent::__construct($skip_authentication = true);
    }
    protected $auth =  'Z3JoYXNpYTpYYkI2cG5aeGc2VktLLXM5bzI0Tg==';
    protected $url = 'http://103.255.15.130/';
    protected $username = 'grhasia';
    protected $password = 'XbB6pnZxg6VKK-s9o24N';
    protected $passphrase = '!Bsre1221*';

    function headers()
    {
        return  array(
            'Authorization: Basic ' . $this->auth,
            // 'Content-Type: multipart/form-data'
        );
    }
    public function signDokumen(Request $r)
    {
        $headers = $this->headers();

        $dataJsonSend = $r->input();
        unset($dataJsonSend['userData']);
        $methods = 'POST';
        $isi = file_get_contents($r->file('file'));
        $file_name = $r['nik'] . '.pdf';
        Storage::disk('local')->put($file_name, $isi);
        $path = storage_path('app/' . $file_name); // Storage::disk('local')->url($file_name);

        $dataJsonSend['file'] = file_get_contents($path);

        // dd($dataJsonSend);
        $url = $this->url . "api/sign/pdf";
        $response = $this->sendBridgingCurl($headers, $dataJsonSend, $url, $methods);
        return $this->respond($response);
    }

    public function downloadDokumen($id_dokumen)
    {
        $headers = $this->headers();
        $dataJsonSend = null;
        $methods = 'GET';
        $url = $this->url . "api/sign/download/" . $id_dokumen;
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
    public function BSRECPPTRanap(Request $request)
    {
        $norec = $request['emr'];
        $kdProfile = (int) $request['kdprofile'];
        $data = DB::select(DB::raw(
            "
                SELECT
                      epd.emrdfk,
                      ep.noemr,
                      ed.TYPE,
                      pa.namapasien,
                      pa.tgllahir,
                      pa.nohp,
                      pa.nocm,
                      ep.jeniskelamin,
                      ep.umur,
                      al.alamatlengkap,
                      ep.noregistrasifk as noregistrasi ,
                      epd.value,ep.namaruangan,pg.namalengkap as namadokter
                      --case when ed.TYPE = 'datetime' then TO_CHAR(TO_TIMESTAMP(epd.value, 'YYYY-MM-DD HH24:MI:SS'),'YYYY-MM-DD HH24:MI:SS') else epd.value end as value
                  FROM
                      emrpasien_t AS ep
                      INNER JOIN emrpasiend_t AS epd ON ep.noemr = epd.emrpasienfk
                      INNER JOIN emrd_t AS ed ON epd.emrdfk = ed.ID
                      INNER JOIN antrianpasiendiperiksa_t AS pd ON pd.norec = ep.norec_apd
                      left JOIN pegawai_m AS pg ON pg.id = pd.objectpegawaifk
                      left JOIN pasien_m as pa on ep.nocm =  pa.nocm
                      left JOIN alamat_m as al on pa.id = al.nocmfk
                  WHERE
                      ep.norec = '$norec'
                      AND ep.kdprofile = '$kdProfile' 
                      AND epd.statusenabled = TRUE 
                      and epd.emrfk = $request[emrfk]
                      ORDER BY
                      ed.nourut
                  "
        ));

        foreach ($data as $z) {
            if ($z->type == "datetime") {
                $z->value = date('Y-m-d H:i:s', strtotime($z->value));
            }
        }
        $pageWidth = 500;

        $headers = $this->headers();
        $res['profile'] = Profile::where('id', $request['kdprofile'])->first();
        $res['d'] = $data;
        ini_set("memory_limit", "256M");
        ini_set('max_execution_time', '300');
        ini_set("pcre.backtrack_limit", "5000000");
        $pdf = PDF::loadView(
            'report.cppt-ranap',
            array(
                'res' => $res,
                'pageWidth' => $pageWidth
            )
        );

        $pageWidth = 950;



        return $pdf->stream();
        return view('report.cppt-ranap', compact('res', 'pageWidth'));
        $file_name = 'resume_contoh.pdf';

        $path = storage_path('app/' . $file_name);

        $file = curl_file_create('C:\Users\Xoxo\Downloads\ResumeMedis.pdf', 'application/pdf', $data[0]->noemr . '.pdf');
        $dataJsonSend = array(
            'nik' => '0803202100007062',
            'passphrase' => $this->passphrase,
            'tampilan' => 'visible',
            'page' => '1',
            'image' => 'false',
            'linkQR' => "https://simrs-grhasia.jogjaprov.go.id/service/medifirst2000/report/cetak-dokter?reg=" . $data[0]->noregistrasi,
            'xAxis' => '750',
            'yAxis' => '70',
            'width' => '201.46',
            'height' => '133.13',
            'reason' => $data[0]->nocm . '-' . $data[0]->namapasien,
            'location' =>  $res['profile']->namaprofile,
            'file' => $file,
        );

        $methods = 'POST';
        $url = $this->url . "api/sign/pdf";
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => $methods,
            CURLOPT_POSTFIELDS => $dataJsonSend,
            CURLOPT_HTTPHEADER => $headers
        ));

        $response = curl_exec($curl);

        curl_close($curl);
        header('Content-type: application/pdf');
        return Response::make($response, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename=data.pdf'
        ]);
    }
    public function getCombo(Request $request)
    {
        $res['pegawai'] = DB::table('pegawai_m')
            ->where('statusenabled', true)
            ->where('namalengkap', '!=', '-')
            ->select('id', 'namalengkap', 'noidentitas')
            ->orderBy('namalengkap')
            ->get();

        return response()->json($res);
    }
    public function saveTTDE(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $dataReq = $request->all();
        DB::beginTransaction();

        try {

            if ($dataReq['norec'] == '-') {
                $file_TTD = $request->file('file');
                $img_TTD = $request->file('imageTTD');

                $extension = $file_TTD->getClientOriginalExtension();
                $filenamAsli = $file_TTD->getClientOriginalName();
                $folder = EMR_BSRE::max('id') + 1;
                $filename = 'TTD_BSRE/' . $folder . '/file' . '.' . $extension;
                $filename_res = 'TTD_BSRE/' . $folder . '/file_ttd' . '.' . $extension;
                Storage::disk('local')->put($filename, file_get_contents($file_TTD));
                $path_FILE = Storage::disk('local')->get($filename);

                if (!empty($fileTTD)) {
                    $extension_ttd = $fileTTD->getClientOriginalExtension();
                    $filename_ttd = 'TTD_BSRE/' . $folder . '/ttd' . '.' . $extension_ttd;
                    Storage::disk('local')->put($filename_ttd, file_get_contents($img_TTD));
                    $path_TTD = Storage::disk('local')->get($filename_ttd);

                    $curl_FILE_TTD = curl_file_create(storage_path('app/' . $filename_ttd), 'application/png', 'img_ttd.png');
                }
                //  dd(storage_path($filename));

                $prof =  DB::table('profile_m')->where('statusenabled', true)->first();
                $file = curl_file_create(storage_path('app/' . $filename), 'application/pdf', 'file.pdf');
                foreach (array_values($dataReq) as $z => $d) {
                    array_keys($dataReq)[$z] = trim($d);
                }

                $dataJsonSend = array(
                    'nik' => trim($dataReq['nik']),
                    'passphrase' => $this->passphrase,
                    'tampilan' => 'visible',
                    'page' => '1',
                    'image' => 'false',
                    'linkQR' => $dataReq['linkQR'] != '' &&  $dataReq['linkQR'] != 'null' ? $dataReq['linkQR'] : '',
                    // 'xAxis' => '159.96',
                    // 'yAxis' => '38.13',
                    // 'width' => '91.46',
                    // 'height' => '213.63',
                    'xAxis' => '625',
                    'yAxis' => '90',
                    'width' => '286.46',
                    'height' => '168.13',
                    'reason' => $dataReq['reason'],
                    'location' =>  $prof->namalengkap,
                    'file' => $file,
                    'imageTTD' => isset($filename_ttd) ? $curl_FILE_TTD : null,
                );


                if ($dataJsonSend['imageTTD'] == null) {
                    unset($dataJsonSend['imageTTD']);
                }
                $headers = $this->headers();
                $methods = 'POST';
                $url = $this->url . "api/sign/pdf";
                $curl = curl_init();

                curl_setopt_array($curl, array(
                    CURLOPT_URL => $url,
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_ENCODING => '',
                    CURLOPT_MAXREDIRS => 10,
                    CURLOPT_TIMEOUT => 0,
                    CURLOPT_FOLLOWLOCATION => true,
                    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                    CURLOPT_CUSTOMREQUEST => $methods,
                    CURLOPT_POSTFIELDS => $dataJsonSend,
                    CURLOPT_HTTPHEADER => $headers
                ));

                $response = curl_exec($curl);
                $httpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

                curl_close($curl);
                header('Content-type: application/pdf');

                if ($httpcode != 200) {

                    $transMessage = "API BSRE Gagal ";
                    DB::rollBack();
                    $result = array(
                        "status" => 400,
                        "message" => $transMessage . ' : ' . json_decode($response)->error,
                        "as" => 'er@epic',
                    );

                    return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                }
                $dat =  Response::make($response, 200, [
                    'Content-Type' => 'application/pdf',
                    'Content-Disposition' => 'inline; filename=data.pdf'
                ]);

                Storage::disk('local')->put($filename_res, $dat);
                $emrDkmn = new EMR_BSRE();
                $emrDkmn->id = $folder;
                $emrDkmn->kdprofile = $kdProfile;
                $emrDkmn->statusenabled = true;
                $emrDkmn->noregistrasi = $dataReq['noregistrasi'];
                $emrDkmn->nocm = $dataReq['nocm'];
                $emrDkmn->norec_pd = $dataReq['norec_pd'];
                $emrDkmn->tglemr = date('Y-m-d H:i:s');
                $emrDkmn->file = 'app/' . $filename_res;
                $emrDkmn->namafile = $filenamAsli;
                $emrDkmn->deskripsi = $dataReq['reason'] == null || $dataReq['reason'] == 'null' ? '' : $dataReq['reason'];
                $emrDkmn->nik_pegawai = $dataReq['nik'];
                $emrDkmn->namadokumen = $dataReq['namadokumen'];
                $emrDkmn->pegawaifk = $dataReq['pegawaifk'];
                $emrDkmn->nomoremr = $dataReq['nomoremr'];
                $emrDkmn->linkQR = $dataReq['linkQR'] != '' &&  $dataReq['linkQR'] != 'null' ? $dataReq['linkQR'] : '';
                $emrDkmn->passphrase = $dataJsonSend['passphrase'];
                $emrDkmn->tampilan = $dataJsonSend['tampilan'];
                $emrDkmn->page = $dataJsonSend['page'];
                $emrDkmn->xAxis = $dataJsonSend['xAxis'];
                $emrDkmn->yAxis = $dataJsonSend['yAxis'];
                $emrDkmn->width = $dataJsonSend['width'];
                $emrDkmn->height = $dataJsonSend['height'];
                $emrDkmn->location = $dataJsonSend['location'];

                $emrDkmn->save();
            } else {
                $emrDkmn = EMR_BSRE::where('id', $dataReq['norec'])->first();
                $emrDkmn->deskripsi = $dataReq['reason'];
                $emrDkmn->nik_pegawai = $dataReq['nik'];
                $emrDkmn->namadokumen = $dataReq['namadokumen'];
                $emrDkmn->pegawaifk = $dataReq['pegawaifk'];
                $emrDkmn->nomoremr = $dataReq['nomoremr'];
                $emrDkmn->save();
            }


            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = 'Simpan Berhasil';
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "dokumen" => $emrDkmn,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "e" => $e->getMessage() . ' ' . $e->getLine(),
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDataKdProfile($r)
    {
        return DB::table('profile_m')->where('statusenabled', true)->first()->id;
    }
    public function deleteTTDE(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        DB::beginTransaction();
        // $transMessage = '';
        try {

            $emrDkmn = EMR_BSRE::where('id', $request['id'])
                ->update([
                    'statusenabled' => false
                ]);



            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            // $transMessage = $e->getMessage();
        }

        if ($transStatus == 'true') {
            $transMessage = "Data Terhapus";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'er@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "e" => $e->getMessage() . ' ' . $e->getFile(),
                "as" => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getTTD(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        //todo : detail
        $paramNocm = '';
        $paramNoreg = '';
        $data = \DB::table('emr_bsre_t as emrdk')
            ->join('pegawai_m as pg', 'pg.id', '=', 'emrdk.pegawaifk')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'emrdk.norec_pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->select('emrdk.*', 'pg.namalengkap', 'ps.nocm', 'ps.namapasien')
            ->where('emrdk.statusenabled', true)
            ->where('emrdk.kdprofile', $idProfile);


        if (isset($request['nocm']) && $request['nocm'] != '') {
            $data = $data->where('emrdk.nocm', $request['nocm']);
        }
        if (isset($request['noregistrasi']) && $request['noregistrasi'] != '') {
            $data = $data->where('emrdk.noregistrasi', $request['noregistrasi']);
        }
        if (isset($request['dari']) && $request['dari'] != '') {
            $data = $data->where('emrdk.tglemr', '>=', $request['dari']);
        }
        if (isset($request['sampai']) && $request['sampai'] != '') {
            $data = $data->where('emrdk.tglemr', '<=', $request['sampai']);
        }
        if (isset($request['namapasien']) && $request['namapasien'] != '') {
            $data = $data->where('ps.namapasien', 'ilike', '%' . $request['namapasien'] . '%');
        }
        if (isset($request['dokter']) && $request['dokter'] != '') {
            $data = $data->where('emrdk.pegawaifk', $request['dokter']);
        }
        $data = $data->orderby('emrdk.tglemr','desc');
        $data = $data->get();

        $result = array(
            'data' => $data,
            'message' => 'er@epic',
        );
        return $this->respond($result);
    }

    public function verifyTTD(Request $request)
    {
        $data =  EMR_BSRE::where('id', $request['id'])->first();
        $file = curl_file_create(storage_path($data->file), 'application/pdf', $data->namafile);

        $dataJsonSend = array(
            'signed_file' => $file,
        );
        $headers = $this->headers();
        $methods = 'POST';
        $url = $this->url . "api/sign/verify";
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => $methods,
            CURLOPT_POSTFIELDS => $dataJsonSend,
            CURLOPT_HTTPHEADER => $headers
        ));

        $response = curl_exec($curl);
        $httpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

        curl_close($curl);
        // if($httpcode == 200){
        $response  = json_decode($response);
        // }

        return response()->json($response);
    }

    public function RegistrasiUser(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $dataReq = $request->all();
        DB::beginTransaction();
        try {

            $fileTTD = $request->file('fileTTD');
            $extension1 = $fileTTD->getClientOriginalExtension();
            $filename1 = 'Register/' . $request['id'] . '/ttd' . '.' . $extension1;
            Storage::disk('local')->put($filename1, file_get_contents($fileTTD));

            $fileKTP = $request->file('fileKTP');
            $extension2 = $fileKTP->getClientOriginalExtension();
            $filename2 = 'Register/' . $request['id'] . '/ktp' . '.' . $extension2;
            Storage::disk('local')->put($filename2, file_get_contents($fileKTP));

            $fileSR = $request->file('fileSR');
            $extension3 = $fileSR->getClientOriginalExtension();
            $filename3 = 'Register/' . $request['id'] . '/sr' . '.' . $extension3;
            Storage::disk('local')->put($filename3, file_get_contents($fileSR));


            $file1 = curl_file_create(storage_path('app/' . $filename1), 'image/png', 'ttd.' . $extension1);
            $file2 = curl_file_create(storage_path('app/' . $filename2), 'image/jpeg', 'ktp.' . $extension2);
            $file3 = curl_file_create(storage_path('app/' . $filename3), 'application/pdf', 'sr.' . $extension3);
            $dataJsonSend = array(
                'nik' => $request['nik'],
                'nip' => $request['nip'],
                'nama' => $request['namalengkap'],
                'email' => $request['email'],
                'nomor_telepon' => $request['notelp'],
                'kota' => $request['kota'],
                'provinsi' => $request['provinsi'],
                'jabatan' => $request['jabatan'],
                'unit_kerja' => $request['unitkerja'],
                'image_ttd' => $file1,
                'ktp' => $file2,
                'surat_rekomendasi' => $file3
            );

            $headers = $this->headers();
            $methods = 'POST';
            $url = '103.255.15.130/api/user/registrasi';
            $curl = curl_init();

            curl_setopt_array($curl, array(
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => $methods,
                CURLOPT_POSTFIELDS => $dataJsonSend,
                CURLOPT_HTTPHEADER => $headers
            ));

            $response = curl_exec($curl);
            $httpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

            curl_close($curl);

            Pegawai::where("id", $request['id'])->update(['responsebsre' => $response]);

            $transStatus = true;
        } catch (\Exception $e) {
            $transStatus = false;
        }

        if ($transStatus) {
            $transMessage = 'Simpan Berhasil';
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "e" => $e->getMessage() . ' ' . $e->getLine(),
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function pengajuanTTE(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);

        DB::beginTransaction();

        try {


            $prof =  DB::table('profile_m')->where('statusenabled', true)->first();

            $emr = EMRPasien::where('norec', $request['norec_emr'])->first();

            $emrM =  DB::table('emr_t')->where('id', $request['emrfk'])->first();

            $pegawai = Pegawai::where('id', $request['pegawaittd'])->first();
            $cek =  EMR_BSRE::where('nomoremr', $emr->noemr)
                ->where('emrfk', $request['emrfk'])->first();

            if (empty($cek)) {
                $idOK = EMR_BSRE::max('id') + 1;

                $filename_res = 'TTD_BSRE/' . $idOK . '/file' . '.pdf';
                $emrDkmn = new EMR_BSRE();
                $emrDkmn->id =  $idOK;
                $emrDkmn->kdprofile = $kdProfile;
                $emrDkmn->statusenabled = true;
            } else {
                $emrDkmn = $cek;
                $filename_res = 'TTD_BSRE/' . $cek->id . '/file' . '.pdf';
                $idOK =  $cek->id;
            }

            $emrDkmn->noregistrasi = $request['noregistrasi'];
            $emrDkmn->nocm = $request['nocm'];
            $emrDkmn->norec_pd = $request['norec_pd'];
            $emrDkmn->tglemr = date('Y-m-d H:i:s');
            $emrDkmn->file = 'app/' . $filename_res;
            $emrDkmn->namafile =  $emrM->caption;
            $emrDkmn->deskripsi = '';
            $emrDkmn->nik_pegawai = $pegawai->noidentitas;
            $emrDkmn->namadokumen = $emrM->caption;
            $emrDkmn->pegawaifk = $request['pegawaittd'];
            $emrDkmn->nomoremr = $emr->noemr;
            $emrDkmn->linkQR = 'https://simrs-grhasia.jogjaprov.go.id/service/medifirst2000/verify-doc/' . $idOK;
            $emrDkmn->passphrase = null;
            $emrDkmn->tampilan = 'visible';
            $emrDkmn->page = 1;
            $emrDkmn->xAxis = $emrM->bsre_xaxis ? $emrM->bsre_xaxis : 625;
            $emrDkmn->yAxis = $emrM->bsre_yaxis ? $emrM->bsre_yaxis : 70;
            $emrDkmn->width = $emrM->bsre_width ? $emrM->bsre_width : 251.46;
            $emrDkmn->height = $emrM->bsre_height ? $emrM->bsre_height : 133.13;
            $emrDkmn->location = $prof->namalengkap;
            $emrDkmn->emrfk =  $request['emrfk'];
            $emrDkmn->status = false;
            $emrDkmn->save();


            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = 'Sukses';
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "dokumen" => $emrDkmn,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Terjadi kesalahan";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "e" => $e->getMessage() . ' ' . $e->getLine(),
                "as" => 'inhuman',
            );
        }
        return  $result;
    }
    public function saveTTDEPengajuan(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $dataReq = $request->all();
        DB::beginTransaction();

        try {


            $emrbsre = EMR_BSRE::where('id', $dataReq['norec'])->first();
            $emr_t = DB::table('emr_t')->where('id', $emrbsre->emrfk)->first();
            $filess = explode('/file_ttd.pdf', $emrbsre->file);
            if(count($filess) == 1){
                $filena =   $emrbsre->file;
            }else{
                $filena = $filess[0] . '/file.pdf';
            }
            $prof =  DB::table('profile_m')->where('statusenabled', true)->first();
            $file = curl_file_create(storage_path($filena), 'application/pdf', 'file.pdf');
    
            // $imageTTD = curl_file_create(public_path('img/pemda_logo.png'), 'image/png', 'logopemda.png');

            // foreach (array_values($dataReq) as $z => $d) {
            //     array_keys($dataReq)[$z] = trim($d);
            // }
            $image = QrCode::format('png')
                ->merge('img/pemda.png', 0.32, true)
                ->size(400)->errorCorrection('H')
                ->generate($emrbsre->linkQR);
            // return response($image)->header('Content-type','image/png');
            $filename_qr = 'TTD_BSRE/' . $emrbsre->id . '/image_qr.png';
            Storage::disk('local')->put($filename_qr, $image);
            $imageTTD = curl_file_create(storage_path('app/' . $filename_qr), 'image/png', 'image_qr.png');
            //   dd($imageTTD);
            $dataJsonSend = array(
                'nik' => trim($dataReq['nik']),
                'passphrase' => $dataReq['passphrase'],
                'tampilan' => 'visible',
                'page' => '1',
                'image' => true,
                'linkQR' =>   stripos(\Request::url(), 'localhost') !== false ?  'localhost:3331/service/medifirst2000/verify-doc/' . $emrbsre->id : 'https://simrs-grhasia.jogjaprov.go.id/service/medifirst2000/verify-doc/' . $emrbsre->id,
                'xAxis' =>  $emr_t->bsre_xaxis ? $emr_t->bsre_xaxis  : 725,
                'yAxis' => $emr_t->bsre_yaxis ? $emr_t->bsre_yaxis  : 70,
                'width' => $emr_t->bsre_width ? $emr_t->bsre_width  : 251.46,
                'height' => $emr_t->bsre_height ? $emr_t->bsre_height  : 133.13,
                'reason' => isset($dataReq['reason']) ? $dataReq['reason'] : '',
                'location' =>  $prof->namalengkap,
                'file' => $file,
                'imageTTD' => $imageTTD
            );


            $headers = $this->headers();

            $methods = 'POST';
            $url = $this->url . "api/sign/pdf";
            $curl = curl_init();
            curl_setopt_array($curl, array(
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => $methods,
                CURLOPT_POSTFIELDS => $dataJsonSend,
                CURLOPT_HTTPHEADER => $headers
            ));

            $response = curl_exec($curl);
            $httpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

            curl_close($curl);
            if ($httpcode == 400) {
                $logUser = new LoggingUser();
                $logUser->id =  LoggingUser::max('id') + 1;
                $logUser->norec = $logUser->generateNewId();
                $logUser->kdprofile = $kdProfile;
                $logUser->statusenabled = true;
                $logUser->jenislog = 'BSRE';
                $logUser->noreff = $emrbsre->id;
                $logUser->referensi = 'emr_bsre_t';
                $logUser->keterangan = 'TTD BSRE Error pada No Registrasi '
                . $emrbsre->noregistrasi . ' - Pasien : ' .  $emrbsre->nocm. ' response :'.$response;
                $logUser->objectloginuserfk =  $request['iduser'];
                $logUser->tanggal = $this->getDateTime()->format('Y-m-d H:i:s');
                $logUser->save();
          
                $transMessage = isset(json_decode($response)->message)?json_decode($response)->message:json_decode($response)->error;
                DB::commit();
                $result = array(
                    "status" => 400,
                    "message" => $transMessage,
                    "s" => $logUser,
                    "as" => 'er@epic',
                );

                return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }

            header('Content-type: application/pdf');
            $dat =  Response::make($response, 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename=data.pdf'
            ]);

            $filename_res = 'TTD_BSRE/' . $emrbsre->id . '/file_ttd.pdf';
            Storage::disk('local')->put($filename_res, $dat);
            $logUser = new LoggingUser();
            $logUser->id =  LoggingUser::max('id') + 1;
            $logUser->norec = $logUser->generateNewId();
            $logUser->kdprofile = $kdProfile;
            $logUser->statusenabled = true;
            $logUser->jenislog = 'BSRE';
            $logUser->noreff = $emrbsre->id;
            $logUser->referensi = 'emr_bsre_t';
            $logUser->keterangan = 'TTD BSRE pada No Registrasi '
                . $emrbsre->noregistrasi . ' - Pasien : ' .  $emrbsre->nocm
                . ' Dokumen ' .  $emrbsre->namadokumen;
            $logUser->objectloginuserfk =  $request['iduser'];
            $logUser->tanggal = $this->getDateTime()->format('Y-m-d H:i:s');
            $logUser->save();



            $emrDkmn = $emrbsre;

            $emrDkmn->tglttd = date('Y-m-d H:i:s');
            $emrDkmn->file = 'app/' . $filename_res;
            $emrDkmn->deskripsi = isset($dataReq['reason']) ? $dataReq['reason'] : null;
            $emrDkmn->nik_pegawai = $dataReq['nik'];
            $emrDkmn->passphrase = $dataReq['passphrase'];
            $emrDkmn->status = true;
            $emrDkmn->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = 'Sukses';
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "dokumen" => $emrDkmn,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "e" => $e->getMessage() . ' ' . $e->getLine(),
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function verifyDocBSRE(Request $r, $id)
    {
        $data = DB::table('emr_bsre_t as em')
        ->join('pegawai_m as pg','pg.id','=','em.pegawaifk')
        ->select('em.*','pg.namalengkap','pg.nosip')
        ->where('em.id', $id)
        ->first();
        $profile = Profile::where('statusenabled', true)->first();
        $password = $this->settingDataFixed('passwordBSRELink',30);
  
        return view('report.verify-doc', compact('r', 'data','profile','password'));
    }
}
