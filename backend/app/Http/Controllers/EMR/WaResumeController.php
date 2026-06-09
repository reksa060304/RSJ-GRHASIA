<?php

namespace App\Http\Controllers\EMR;

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use DB;
use PDF;
use App\Web\Profile;
use App\Traits\Valet;

class WaResumeController extends ApiController
{
    use Valet;
    /**
     * Ambil daftar pasien yang memiliki data resume medis.
     * Filter: periode, namapasien, nocm, noregistrasi, kelompokpasien
     */
    public function getDaftarPasienResume(Request $request)
    {
        try {
            try { $kdProfile = (int) $this->getDataKdProfile($request) ?: 30; } catch (\Exception $ex) { $kdProfile = 30; }

            $query = DB::table('resumemedis_t as rm')
                ->select(
                    'rm.norec',
                    'rm.tglresume',
                    'rm.keteranganlainnya',
                    'ps.nocm',
                    'ps.namapasien',
                    'ps.nohp',
                    'ps.notelepon',
                    'pd.noregistrasi',
                    'pd.tglregistrasi',
                    'kp.kelompokpasien',
                    'ru.namaruangan',
                    'pg.namalengkap as namadokter',
                    DB::raw('CASE WHEN eb.id IS NOT NULL THEN 1 ELSE 0 END as is_tte')
                )
                ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'rm.noregistrasifk')
                ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                ->join('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
                ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
                ->leftJoin('emr_bsre_t as eb', function($join) {
                    $join->on('eb.nocm', '=', 'ps.nocm')
                         ->on('eb.nomoremr', '=', 'rm.koderesume')
                         ->on('eb.noregistrasi', '=', 'pd.noregistrasi')
                         ->where('eb.status', '=', true)
                         ->where('eb.statusenabled', '=', true);
                })
                ->where('rm.kdprofile', $kdProfile)
                ->where('rm.statusenabled', true);

            // Filter periode
            if (!empty($request['periodeAwal'])) {
                $query->where('rm.tglresume', '>=', $request['periodeAwal']);
            }
            if (!empty($request['periodeAkhir'])) {
                $query->where('rm.tglresume', '<=', $request['periodeAkhir']);
            }

            // Filter nama pasien
            if (!empty($request['namaPasien'])) {
                $query->where('ps.namapasien', 'ilike', '%' . $request['namaPasien'] . '%');
            }

            // Filter no CM / no RM
            if (!empty($request['noCm'])) {
                $query->where('ps.nocm', 'ilike', '%' . $request['noCm'] . '%');
            }

            // Filter no registrasi
            if (!empty($request['noRegistrasi'])) {
                $query->where('pd.noregistrasi', 'ilike', '%' . $request['noRegistrasi'] . '%');
            }

            // Filter jenis/kelompok pasien
            if (!empty($request['kelompokPasien'])) {
                $query->where('kp.id', (int) $request['kelompokPasien']);
            }

            $data = $query->orderBy('rm.tglresume', 'desc')->get();

            return response()->json([
                'status'  => 200,
                'message' => 'OK',
                'data'    => $data,
            ]);
        } catch (\Exception $e) {
            \Log::error('getDaftarPasienResume error: ' . $e->getMessage());
            return response()->json([
                'status'  => 500,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Kirim dokumen PDF resume medis ke nomor WA pasien.
     * Input: norec (resumemedis_t), kdprofile, noHP (opsional override)
     */
    public function sendWaResume(Request $request)
    {
        try {
            try { $kdProfile = (int) $this->getDataKdProfile($request) ?: 30; } catch (\Exception $ex) { $kdProfile = 30; }
            $norec     = $request['norec'];

            // ── 1. Ambil data resume medis lengkap ──────────────────────────────
            $data = DB::table('resumemedis_t as rm')
                ->select(
                    'rm.norec', 'rm.tglresume', 'rm.keteranganlainnya',
                    'rm.ringkasanriwayatpenyakit', 'rm.pemeriksaanfisik', 'rm.pemeriksaanpenunjang',
                    'rm.hasilkonsultasi', 'rm.terapi', 'rm.diagnosisawal', 'rm.diagnosissekunder',
                    'rm.tindakanprosedur', 'rm.tglmasuk', 'rm.tglpulang',
                    'rm.wisma', 'rm.kelas', 'rm.hasilfisik', 'rm.hasilpsikiatri',
                    'rm.hasilpenunjang', 'rm.terapipulang',
                    'rm.axis2', 'rm.axis3', 'rm.axis4', 'rm.axis5',
                    'rm.kontrolklinik', 'rm.kondisiwaktukeluare',
                    'rm.kddiagnosisawal', 'rm.diagnosismasuk', 'rm.kddiagnosismasuk',
                    'rm.diagnosistambahan', 'rm.kddiagnosistambahan',
                    'rm.kddiagnosistambahan2', 'rm.kddiagnosistambahan3', 'rm.kddiagnosistambahan4',
                    'rm.alasandirawat', 'rm.alergi', 'rm.diet', 'rm.instruksianjuran',
                    'rm.hasillab', 'rm.kondisiwaktukeluar', 'rm.pengobatandilanjutkan',
                    'rm.koderesume', 'rm.pegawaifk',
                    'dg1.kddiagnosa as kddiagnosa1', 'dg1.namadiagnosa as namadiagnosa1',
                    'dg2.kddiagnosa as kddiagnosa2', 'dg2.namadiagnosa as namadiagnosa2',
                    'dg3.kddiagnosa as kddiagnosa3', 'dg3.namadiagnosa as namadiagnosa3',
                    'dg4.kddiagnosa as kddiagnosa4', 'dg4.namadiagnosa as namadiagnosa4',
                    'dg5.kddiagnosa as kddiagnosa5', 'dg5.namadiagnosa as namadiagnosa5',
                    'dg6.kddiagnosa as kddiagnosa6', 'dg6.namadiagnosa as namadiagnosa6',
                    'rm.tglkontrolpoli', 'rm.rumahsakittujuan', 'rm.noregistrasifk',
                    'pd.noregistrasi', 'pd.tglregistrasi',
                    'ps.nocm', 'ps.namapasien', 'ps.nohp', 'ps.notelepon', 'ps.tgllahir',
                    'kp.kelompokpasien',
                    'ru.namaruangan',
                    'jk.jeniskelamin',
                    'pg.namalengkap as namadokter'
                )
                ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'rm.noregistrasifk')
                ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                ->join('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
                ->join('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
                ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
                ->leftJoin('diagnosa_m as dg1', 'dg1.id', '=', 'rm.kddiagnosismasuk')
                ->leftJoin('diagnosa_m as dg2', 'dg2.id', '=', 'rm.kddiagnosisawal')
                ->leftJoin('diagnosa_m as dg3', 'dg3.id', '=', 'rm.kddiagnosistambahan')
                ->leftJoin('diagnosa_m as dg4', 'dg4.id', '=', 'rm.kddiagnosistambahan2')
                ->leftJoin('diagnosa_m as dg5', 'dg5.id', '=', 'rm.kddiagnosistambahan3')
                ->leftJoin('diagnosa_m as dg6', 'dg6.id', '=', 'rm.kddiagnosistambahan4')
                ->where('rm.kdprofile', $kdProfile)
                ->where('rm.statusenabled', true)
                ->where('rm.norec', $norec)
                ->first();

            if (!$data) {
                return response()->json([
                    'status'  => 404,
                    'message' => 'Data resume medis tidak ditemukan.',
                ], 404);
            }

            // ── 2. Tentukan nomor HP tujuan ──────────────────────────────────────
            // Prioritas: dari request (petugas override) → nohp → notelepon
            $noHP = null;
            if (!empty($request['noHP'])) {
                $noHP = trim($request['noHP']);
            } elseif (!empty($data->nohp)) {
                $noHP = trim($data->nohp);
            } elseif (!empty($data->notelepon)) {
                $noHP = trim($data->notelepon);
            }

            if (empty($noHP)) {
                return response()->json([
                    'status'  => 422,
                    'message' => 'Nomor HP pasien tidak tersedia. Silakan masukkan nomor HP secara manual.',
                ], 422);
            }

            // Normalisasi nomor HP → format internasional 62xxx
            $noHP = preg_replace('/[^0-9+]/', '', $noHP);
            if (substr($noHP, 0, 1) === '0') {
                $noHP = '62' . substr($noHP, 1);
            }
            if (substr($noHP, 0, 1) === '+') {
                $noHP = substr($noHP, 1);
            }

            // ── 3. Buat URL publik view resume medis (Dengan Token Expiring 7 Hari) ──
            $expires = time() + (7 * 24 * 60 * 60); // 7 hari kedaluwarsa
            $payload = base64_encode($data->norec . '|' . $expires . '|' . $kdProfile);
            $secretKey = env('APP_KEY', 'some-random-fallback-key-123!');
            $signature = hash_hmac('sha256', $payload, $secretKey);
            $token = $payload . '.' . $signature;

            $publicBaseUrl = "https://simrs-grhasia.jogjaprov.go.id/service/medifirst2000/";
            $viewUrl = $publicBaseUrl . "report/cetak-resume-medis-v3-publik?token=" . urlencode($token);

            // ── 4. Ambil konfigurasi WaBlas dari settingdatafixed_m ──────────────
            $getWaSetting = function ($namafield) use ($kdProfile) {
                $row = DB::table('settingdatafixed_m')
                    ->where('namafield', $namafield)
                    ->where('kdprofile', $kdProfile)
                    ->where('statusenabled', true)
                    ->first();
                if (!$row) {
                    $row = DB::table('settingdatafixed_m')
                        ->where('namafield', $namafield)
                        ->where('statusenabled', true)
                        ->first();
                }
                return $row ? $row->nilaifield : '';
            };

            $waUrl       = $getWaSetting('urlWhatsap');
            $waToken     = $getWaSetting('tokenWhatsap');
            $waSecretKey = $getWaSetting('secretKeyWhatsap');

            if (empty($waUrl) || empty($waToken) || empty($waSecretKey)) {
                return response()->json([
                    'status'  => 500,
                    'message' => 'Konfigurasi WaBlas (urlWhatsap / tokenWhatsap / secretKeyWhatsap) belum diisi di Setting Data Fixed.',
                ], 500);
            }

            // ── 5. Siapkan Teks Pesan WA ──────────────────────────────────────────
            $message = "Halo, *" . $data->namapasien . "*\n\n"
                . "Berikut kami kirimkan tautan untuk melihat *Resume Medis* Anda.\n\n"
                . "No. Rekam Medis : *" . $data->nocm . "*\n"
                . "No. Registrasi  : *" . $data->noregistrasi . "*\n"
                . "Tanggal Resume  : *" . $data->tglresume . "*\n\n"
                . "Silakan lihat dan unduh dokumen Resume Medis Anda melalui tautan berikut:\n"
                . $viewUrl . "\n\n"
                . "*Catatan:* Link di atas hanya berlaku selama *7 hari* demi keamanan data Anda.\n\n"
                . "Terima kasih telah mempercayakan kesehatan Anda kepada kami.";

            // ── 6. Kirim Pesan Teks via WaBlas ──────────────────────────────
            $payloadMsg = [
                'data' => [
                    [
                        'phone'   => $noHP,
                        'message' => $message,
                    ]
                ]
            ];

            $curlMsg = curl_init();
            curl_setopt($curlMsg, CURLOPT_HTTPHEADER, [
                'Authorization: ' . $waToken . '.' . $waSecretKey,
                'Content-Type: application/json',
            ]);
            curl_setopt($curlMsg, CURLOPT_CUSTOMREQUEST, 'POST');
            curl_setopt($curlMsg, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($curlMsg, CURLOPT_POSTFIELDS, json_encode($payloadMsg));
            curl_setopt($curlMsg, CURLOPT_URL, $waUrl);
            curl_setopt($curlMsg, CURLOPT_SSL_VERIFYHOST, 0);
            curl_setopt($curlMsg, CURLOPT_SSL_VERIFYPEER, 0);

            $resultMsg  = curl_exec($curlMsg);
            $errMsgCurl = curl_error($curlMsg);
            curl_close($curlMsg);

            if ($errMsgCurl) {
                \Log::error("WA Resume Curl error: " . $errMsgCurl);
                return response()->json([
                    'status'  => 500,
                    'message' => 'Gagal menghubungi server WhatsApp: ' . $errMsgCurl,
                ], 500);
            }

            $decodedMsg = json_decode($resultMsg, true);
            if (isset($decodedMsg['status']) && $decodedMsg['status'] === false) {
                $errMsg = $decodedMsg['message'] ?? 'Alasan tidak diketahui';
                return response()->json([
                    'status'  => 500,
                    'message' => 'Gagal mengirim pesan WhatsApp: ' . $errMsg,
                ], 500);
            }

            \Log::info("WA Resume (Teks Link) berhasil dikirim ke $noHP untuk norec=$norec");

            return response()->json([
                'status'  => 200,
                'message' => 'Pesan WhatsApp berisi link Resume Medis berhasil dikirim ke ' . $noHP,
                'noHP'    => $noHP,
                'fileUrl' => $viewUrl,
                'mode'    => 'text_link',
            ]);
        } catch (\Exception $e) {
            \Log::error('sendWaResume error: ' . $e->getMessage());
            return response()->json([
                'status'  => 500,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
