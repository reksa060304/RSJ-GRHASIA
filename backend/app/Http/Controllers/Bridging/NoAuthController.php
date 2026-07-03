<?php

namespace App\Http\Controllers\Bridging;

use App\Exceptions\BillingException;
use App\Helpers\String\DclHashing;
use App\Http\Controllers\ApiController;
use App\Master\LoginPasien;
use App\Traits\BniTrait;
use App\Transaksi\BNITransaction;
use App\Transaksi\BniEnc;
use App\Transaksi\VirtualAccount;
use Illuminate\Http\Request;
use App\Traits\PelayananPasienTrait;
use DB;
use App\Traits\Valet;
use Carbon\Carbon;
use Webpatser\Uuid\Uuid;
use App\Transaksi\StrukBuktiPenerimaan;
use App\Transaksi\StrukBuktiPenerimaanCaraBayar;
use App\Transaksi\StrukOrder;
use App\Transaksi\StrukPelayanan;
use App\User;

class NoAuthController extends ApiController
{
	 use Valet, PelayananPasienTrait, BniTrait;
	 public function __construct()
    {
        parent::__construct($skip_authentication = true);
    }
    function getKdProfile(){
    	$db = DB::table('profile_m')->where('statusenabled',true)->first();
    	return $db->id;
    }
   function getClientId()
    {
        return $this->settingDataFixed('client_id_BNI', $this->getKdProfile());
    }
    function getUrl()
    {
        $status =  $this->settingDataFixed('isBridgingProductionBNI', $this->getKdProfile());
        if (!empty($status) && $status == 'true') {
            return $this->settingDataFixed('urlProdBNI', $this->getKdProfile());
        } else {
            return $this->settingDataFixed('urlDevBNI', $this->getKdProfile());
        }
    }
    function getSecretKey()
    {
        return $this->settingDataFixed('secret_key_BNI', $this->getKdProfile());
    }
    function getPrefix()
    {
        return $this->settingDataFixed('prefixBNI_VA', $this->getKdProfile());
    }
	 public function callBackPayment(Request $request)
    {

        // $data_json =  $request->json()->all();

		$data= file_get_contents('php://input');
      	$data_json = json_decode($data, true);
        $client_id = $this->getClientId();
        $secret_key = $this->getSecretKey();
        if (!$data_json) {
            $data = array(
                "status" => "999",
                "message" => "Terjadi kesalahan."
            );
            return $this->respond($data);
        } else {
        
            if ($data_json['client_id'] == $client_id) {
                if (!isset($data_json['data'])) {
                    $data = array(
                        "status" => "999",
                    );
                    return $this->respond($data);
                }

                $data_asli = BniEnc::decrypt(
                    $data_json['data'],
                    $client_id,
                    $secret_key
                );
                      
                // unset($data_asli['userData']);

                if (!$data_asli) {
                    $data = array(
                        "status" => "999",
                        "message" => "waktu server tidak sesuai NTP atau secret key salah."
                    );
                    return $this->respond($data);
                } else {
                    // dd($data_asli);

                    DB::beginTransaction();
                    try {
                        // insert data asli ke db

                        $newVA =  VirtualAccount::where('trx_id', $data_asli['trx_id'])->first();

                        $newVA->kdprofile =  $this->getKdProfile();
                        $newVA->trx_amount =  $data_asli['trx_amount'];
                        $newVA->customer_name =  $data_asli['customer_name'];
                        $newVA->cumulative_payment_amount =  $data_asli['cumulative_payment_amount'];
                        $newVA->payment_ntb =  $data_asli['payment_ntb'];
                        $newVA->datetime_payment = $data_asli['datetime_payment'];
                        $newVA->datetime_payment_iso8601 = $data_asli['datetime_payment_iso8601'];
                        $newVA->status = 'callback';
                        $newVA->save();
                 
                        if ($newVA->norec_sp != null && $newVA->norec_pd != null) {
                        	       // dd( $newVA);
                            if( $newVA->norec_sbm ==null){
                                $strukPelayanan = StrukPelayanan::where('norec', $newVA->norec_sp)->first();
                                $sisa = 0;
                                if ($strukPelayanan->nosbmlastfk == null || $strukPelayanan->nosbmlastfk == '') {
                                    $sisa = $sisa + $this->getDepositPasien($strukPelayanan->pasien_daftar->noregistrasi);
                                }

                                $deposit = $sisa;

                                $sisa = $sisa + $data_asli['trx_amount'];

                                // foreach($request['pembayaran'] as $pembayaran){
                                $strukBuktiPenerimanan = new StrukBuktiPenerimaan();
                                $strukBuktiPenerimanan->norec = $strukBuktiPenerimanan->generateNewId();
                                $strukBuktiPenerimanan->kdprofile = $this->getKdProfile();
                                $strukBuktiPenerimanan->keteranganlainnya = "Pembayaran Tagihan Pasien Virtual Account";
                                $strukBuktiPenerimanan->statusenabled = 1;
                                $strukBuktiPenerimanan->nostrukfk = $strukPelayanan->norec;
                                $strukBuktiPenerimanan->objectkelompokpasienfk = $strukPelayanan->pasien_daftar->pasien->objectkelompokpasienfk;
                                $strukBuktiPenerimanan->objectkelompoktransaksifk = 1;
                                $strukBuktiPenerimanan->objectpegawaipenerimafk  = $this->getCurrentLoginID();
                                $strukBuktiPenerimanan->tglsbm  = $data_asli['datetime_payment']; //$this->getDateTime();
                                $strukBuktiPenerimanan->totaldibayar  = $data_asli['trx_amount'];
                                $strukBuktiPenerimanan->nosbm = $this->generateCode(new StrukBuktiPenerimaan, 'nosbm', 14, 'RV-' . $this->getDateTime()->format('ym'), $this->getKdProfile());
                                $strukBuktiPenerimanan->save();

                                $SBPCB = new StrukBuktiPenerimaanCaraBayar();
                                $SBPCB->norec = $SBPCB->generateNewId();
                                $SBPCB->kdprofile = $this->getKdProfile();
                                $SBPCB->statusenabled = 1;
                                $SBPCB->nosbmfk = $strukBuktiPenerimanan->norec;
                                $SBPCB->objectcarabayarfk = 9;
                                $SBPCB->totaldibayar = $data_asli['trx_amount'];
                                $SBPCB->save();

                                $strukPelayanan->nosbmlastfk = $strukBuktiPenerimanan->norec;
                                $strukPelayanan->save();
                                $pd = $strukPelayanan->pasien_daftar;
                                $pd->nosbmlastfk = $strukBuktiPenerimanan->norec;
                                $pd->save();
                                $newVA->norec_sbm = $strukBuktiPenerimanan->norec;
                                $newVA->save();
                             }
                        }
                        $stt = true;
                    } catch (\Exception $e) {
                        $stt = false;
                    }
                    if ($stt) {
                        DB::commit();
                        $data = array(
                            "status" => "000"
                        );
                    } else {
                        DB::rollBack();
                        $data = array(
                            "status" => "999",
                            "message" => $e->getMessage() . ' ' . $e->getLine(),
                        );
                    }
                    return $this->respond($data);
                }
            } else {
                $data = array(
                    "status" => "999",
                    "message" => "Client Id salah."
                );
                return $this->respond($data);
            }
        }
    }

    public function getJadwalDokter (Request $request){
        // $kdProfile = $this->getDataKdProfile($request);
        // $idProfile = (int) $kdProfile;
        $filter = $request->all();

        // $data = \DB::table('jadwaldokter_m as jd')
        //     ->join('ruangan_m AS ru','ru.id','=','jd.objectruanganfk')
        //     ->join('pegawai_m as pg','pg.id','=','jd.objectpegawaifk')
        //     // ->leftJoin('hari_m AS hr','hr.id','=','jd.objecthariawal')
        //     // ->leftJoin('hari_m AS hr1','hr1.id','=','jd.objecthariakhir')
        //     ->select(DB::raw("jd.id as idjadwalpegawai,jd.objectruanganfk,ru.namaruangan,
        //                       jd.objectpegawaifk,pg.namalengkap,pg.nosip,pg.nostr,pg.noidentitas as nik,
        //                       jd.jammulai,jd.jamakhir,jd.keterangan, jd.hari"))
        //     // ->where('jd.kdprofile', $idProfile)
        //      ->where('ru.statusenabled',true)
        //       ->where('pg.statusenabled', true)
        //     ->where('jd.statusenabled', true);

        $data = \DB::table('slottingonline_m as slot')
            ->join('ruangan_m as ru', 'ru.id', '=', 'slot.objectruanganfk' )
            ->join('pegawai_m as pg', 'pg.id', '=', 'slot.objectpegawaifk')
            ->select('ru.id as idruangan', 'slot.id', 'ru.namaruangan', 'ru.objectdepartemenfk', 'slot.jambuka', 'slot.jamtutup',
            'slot.quota','pg.namalengkap','slot.objectpegawaifk','slot.hari')

            ->where('ru.statusenabled', true)
            ->where('pg.statusenabled', true)
            ->where('slot.statusenabled', true)

            ->whereNotNull('pg.namalengkap')
            ->where('pg.namalengkap', '!=', '')
            ->where('pg.namalengkap', '!=', '-');


        if (isset($request['dokterId']) && $request['dokterId'] != "" && $request['dokterId'] != "undefined") {
            $data = $data->where('pg.id', '=', $request['dokterId']);
        }
        if (isset($request['ruanganId']) && $request['ruanganId'] != "" && $request['ruanganId'] != "undefined") {
            $data = $data->where('ru.id', '=', $request['ruanganId']);
        }
         if (isset($request['nik']) && $request['nik'] != "" && $request['nik'] != "undefined") {
            $data = $data->where('pg.noidentitas', '=', $request['nik']);
        }
    if (isset($request['nostr']) && $request['nostr'] != "" && $request['nostr'] != "undefined") {
            $data = $data->where('pg.nostr', '=', $request['nostr']);
        }

        $data = $data->orderBy('pg.namalengkap', 'asc');
        $data = $data->get();
        $result = array(
            'data'=>$data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public static function getKetersediaanTempatTidurPerkelas(Request $request)
    {
        $dataKelas =  DB::select(DB::raw("
                SELECT 
                    q2.namakelas,
                    COALESCE(q1.terpakai,0) as terpakai,
                    q2.jml,
                    (q2.jml -  COALESCE(q1.terpakai,0)) AS kosong
                FROM (
                    SELECT
                        kls.namakelas,
                        COUNT(DISTINCT pd.noregistrasi) AS terpakai
                    FROM pasiendaftar_t pd
                    INNER JOIN antrianpasiendiperiksa_t apd
                        ON pd.norec = apd.noregistrasifk
                        AND apd.tglkeluar IS NULL
                    INNER JOIN kelas_m kls
                        ON kls.id = pd.objectkelasfk
                    LEFT JOIN batalregistrasi_t br
                        ON br.pasiendaftarfk = pd.norec
                    WHERE
                        br.norec IS NULL
                        AND pd.tglpulang IS NULL
                        AND pd.kdprofile = 30
                        AND pd.statusenabled = TRUE
                        AND kls.namakelas IS NOT NULL
                    GROUP BY kls.namakelas 
                ) AS q1
                RIGHT JOIN (
                    SELECT 
                        x.namakelas,
                        SUM(x.isi) + SUM(x.kosong) AS jml
                    FROM (
                        SELECT
                            kmr.ID,
                            kmr.namakamar,
                            kl.ID AS id_kelas,
                            kl.namakelas,
                            ru.ID AS id_ruangan,
                            ru.namaruangan,
                            kmr.jumlakamarisi,
                            kmr.qtybed,
                        CASE
                            WHEN sb.ID = 1 THEN 1 ELSE 0 
                        END AS isi,
                        CASE
                            WHEN sb.ID = 2 THEN 1 ELSE 0 
                        END AS kosong
                        FROM
                            tempattidur_m AS tt
                            LEFT JOIN statusbed_m AS sb ON sb.ID = tt.objectstatusbedfk
                            LEFT JOIN kamar_m AS kmr ON kmr.ID = tt.objectkamarfk
                            LEFT JOIN ruangan_m AS ru ON ru.ID = kmr.objectruanganfk
                            LEFT JOIN kelas_m AS kl ON kl.ID = kmr.objectkelasfk 
                        WHERE
                            tt.kdprofile = 30 
                            AND tt.statusenabled = TRUE 
                            AND ru.statusenabled = TRUE 
                            AND kmr.statusenabled = TRUE
                            AND sb.statusenabled = TRUE
                    ) AS x
                    GROUP BY x.namakelas
                ) AS q2 ON q1.namakelas = q2.namakelas
                ORDER BY q1.namakelas;
            "));


        $dataPeruangan =  DB::select(DB::raw("
                    SELECT
                DENSE_RANK() OVER (ORDER BY x.namaruangan) AS nourut,
                'tidak' AS tab,
                x.namaruangan,
                CASE
                    WHEN SUM(x.kosong) IS NULL THEN x.isi
                    WHEN x.isi IS NULL THEN SUM(x.kosong + 0)
                    ELSE SUM(x.kosong) + x.isi
                END AS qty,
                CASE
                    WHEN SUM(x.kosong) IS NULL THEN 0
                    ELSE SUM(x.kosong)
                END AS kosong,
                CASE
                    WHEN x.isi IS NULL THEN 0
                    ELSE x.isi
                END AS isi
            FROM (
                SELECT
                    ru.id AS idruangan,
                    ru.namaruangan,
                    kl.id,
                    a.isi,
                    CASE
                        WHEN sb.id = 2 THEN COUNT(sb.id)
                    END AS kosong
                FROM tempattidur_m AS tt
                    LEFT JOIN kamar_m AS km ON km.id = tt.objectkamarfk
                    LEFT JOIN ruangan_m AS ru ON ru.id = km.objectruanganfk
                    LEFT JOIN statusbed_m AS sb ON sb.id = tt.objectstatusbedfk
                    LEFT JOIN kelas_m AS kl ON kl.id = km.objectkelasfk
                    LEFT JOIN (
                        SELECT
                            COUNT(DISTINCT pd.noregistrasi) AS isi,
                            ru.namaruangan,
                            ru.id
                        FROM pasiendaftar_t AS pd
                            INNER JOIN antrianpasiendiperiksa_t AS apd
                                ON pd.norec = apd.noregistrasifk
                                AND apd.tglkeluar IS NULL
                            INNER JOIN pasien_m AS p ON p.id = pd.nocmfk
                            INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
                            INNER JOIN kelas_m AS kls ON kls.id = pd.objectkelasfk
                            LEFT JOIN kamar_m AS kmr ON kmr.id = apd.objectkamarfk
                            LEFT JOIN tempattidur_m AS tt ON tt.id = apd.nobed
                        WHERE
                            pd.kdprofile = 30
                            AND pd.statusenabled = true
                            AND pd.tglpulang IS NULL
                        GROUP BY
                            ru.namaruangan,
                            ru.id
                    ) AS a ON a.id = ru.id
                WHERE
                    tt.kdprofile = 30
                    AND ru.objectdepartemenfk IN (16)
                    AND ru.statusenabled = true
                    AND km.statusenabled = true
                    AND tt.statusenabled = true
                GROUP BY
                    ru.id,
                    sb.id,
                    kl.id,
                    a.isi
            ) AS x
            GROUP BY
                x.namaruangan,
                x.isi

            UNION ALL

            SELECT
                DENSE_RANK() OVER (ORDER BY x.namaruangan) AS nourut,
                'iya' AS tab,
                ' ' || x.namakamar AS namaruangan,
                CASE
                    WHEN SUM(x.kosong) IS NULL THEN x.isi
                    WHEN x.isi IS NULL THEN SUM(x.kosong + 0)
                    ELSE SUM(x.kosong) + x.isi
                END AS qty,
                CASE
                    WHEN SUM(x.kosong) IS NULL THEN 0
                    ELSE SUM(x.kosong)
                END AS kosong,
                CASE
                    WHEN x.isi IS NULL THEN 0
                    ELSE x.isi
                END AS isi
            FROM (
                SELECT
                    km.id AS idruangan,
                    km.namakamar,
                    ru.namaruangan,
                    a.isi,
                    CASE
                        WHEN sb.id = 2 THEN COUNT(sb.id)
                    END AS kosong
                FROM tempattidur_m AS tt
                    LEFT JOIN kamar_m AS km ON km.id = tt.objectkamarfk
                    LEFT JOIN ruangan_m AS ru ON ru.id = km.objectruanganfk
                    LEFT JOIN statusbed_m AS sb ON sb.id = tt.objectstatusbedfk
                    LEFT JOIN kelas_m AS kl ON kl.id = km.objectkelasfk
                    LEFT JOIN (
                        SELECT
                            COUNT(DISTINCT pd.noregistrasi) AS isi,
                            kmr.namakamar,
                            kmr.id
                        FROM pasiendaftar_t AS pd
                            INNER JOIN antrianpasiendiperiksa_t AS apd
                                ON pd.norec = apd.noregistrasifk
                                AND apd.tglkeluar IS NULL
                            INNER JOIN pasien_m AS p ON p.id = pd.nocmfk
                            INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
                            INNER JOIN kelas_m AS kls ON kls.id = pd.objectkelasfk
                            LEFT JOIN kamar_m AS kmr ON kmr.id = apd.objectkamarfk
                            LEFT JOIN tempattidur_m AS tt ON tt.id = apd.nobed
                        WHERE
                            pd.kdprofile = 30
                            AND pd.statusenabled = true
                            AND pd.tglpulang IS NULL
                        GROUP BY
                            kmr.namakamar,
                            kmr.id
                    ) AS a ON a.id = km.id
                WHERE
                    tt.kdprofile = 30
                    AND ru.objectdepartemenfk IN (16)
                    AND ru.statusenabled = true
                    AND km.statusenabled = true
                    AND tt.statusenabled = true
                GROUP BY
                    km.id,
                    sb.id,
                    ru.namaruangan,
                    km.namakamar,
                    a.isi
                ORDER BY
                    km.namakamar
            ) AS x
            GROUP BY
                x.namakamar,
                x.namaruangan,
                x.isi
            ORDER BY
                nourut,
                tab DESC;

            "));


        $result = array(
            // "data" => $data,
            "dataKelas" => $dataKelas,
            "dataRuangan" => $dataPeruangan,
            "message" => "ea@epic"
        );
        return $result;
    }

    public function getTarifLayanan(Request $request)
    {
        // $kdProfile = $this->getDataKdProfile($request);
        // $idProfile = (int) $kdProfile;
        $filter = $request->all();

        $data = DB::table('harganettoprodukbykelas_m as ht')
        ->join('produk_m as pr', 'pr.id', '=', 'ht.objectprodukfk')
        ->join('kelas_m as kl', 'kl.id', '=', 'ht.objectkelasfk')
        // ->join('jenispelayanan_m as jp', 'jp.id', '=', 'ht.objectjenispelayananfk')
        
        ->leftJoin('mapruangantoproduk_m as mp', 'mp.objectprodukfk', '=', 'pr.id' )
        ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'mp.objectruanganfk')

        ->select('pr.namaproduk as tindakan', 'ht.hargasatuan as harga', 'kl.namakelas as kelas', 'ru.namaruangan' )
        ->where('ht.statusenabled',true)
        // ->where('ht.kdprofile', $kdProfile)
        ->where('ht.hargasatuan', '>', 0)

        ->where(function($q){
            $q->whereNull('ht.objectpenjaminfk')
              ->orWhere('ht.objectpenjaminfk', '<>', 2899);
        })

        ->where(function ($q) {
        $q->where('mp.statusenabled', true)
          ->orWhereNull('mp.statusenabled');
         });

        // ->where('ht.objectpenjaminfk', '<>', 2899);
        //->whereRaw("to_char(ht.tglberlakuawal, 'YYYY') >= '". $request['tahun'] ."'")
       // ->whereRaw("to_char(ht.tglberlakuakhir, 'YYYY') <= '". $request['tahun'] ."'");

        if(isset($request['namatindakan']) && $request['namatindakan'] != "" && $request['namatindakan'] != null) {
            $data = $data->where('pr.namaproduk', 'ilike', '%'. $request['namatindakan']  .'%');
        }

        if(isset($request['namakelas']) && $request['namakelas'] != "" && $request['namakelas'] != null) {
            $data = $data->where('kl.namakelas', 'ilike', '%'. $request['namakelas']  .'%');
        }

        $data = $data->get();
        $result = array(
            "data" => $data,
            "message" => "ea@epic"
        );
        return $this->respond($result);
    }

    public function getTarifObat(Request $request)
    {
        $kdProfile = 30;
         //$kdProfile = (int) $this->getDataKdProfile($request);

        // $jumlah = $request->jmlRows ?? 100;

        $namaproduk = '';
        $produkid = '';

        if (isset($request['produkfk']) && $request['produkfk'] != "" && $request['produkfk'] != "undefined") {
            $produkid = " AND pr.id = " . $request['produkfk'];
        }

        if (isset($request['namaproduk']) && $request['namaproduk'] != "" && $request['namaproduk'] != "undefined") {
            $namaproduk = " AND pr.namaproduk ILIKE '%" . $request['namaproduk'] . "%'";
        }

    $data = DB::select(DB::raw("
       SELECT
            pr.id AS kdproduk,
            pr.namaproduk,
            ss.satuanstandar,
            pr.kekuatan,
            pr.satuan,
            ROUND(harga.harganetto1 * 1.25) AS hargajual

        FROM produk_m pr

        INNER JOIN detailjenisproduk_m djp
            ON djp.id = pr.objectdetailjenisprodukfk

        INNER JOIN jenisproduk_m jp
            ON jp.id = djp.objectjenisprodukfk

        LEFT JOIN satuanstandar_m ss
            ON ss.id = pr.objectsatuanstandarfk

        LEFT JOIN LATERAL (
            SELECT
                spd.harganetto1
            FROM stokprodukdetail_t spd

            INNER JOIN ruangan_m ru
                ON ru.id = spd.objectruanganfk

            WHERE
                spd.objectprodukfk = pr.id
                AND spd.statusenabled = TRUE
                AND spd.kdprofile = $kdProfile
                AND ru.id IN (59,94)

            ORDER BY
                spd.tglpelayanan DESC,
                spd.norec DESC

            LIMIT 1
        ) harga ON TRUE

        WHERE
            pr.statusenabled = TRUE
            AND pr.kdprofile = $kdProfile
            AND jp.id IN (97,283,1549,112,286,99)
            AND harga.harganetto1 IS NOT NULL
            $namaproduk
            $produkid

        ORDER BY
            pr.namaproduk
    "));

    $result = array(
        'data' => $data,
        'message' => 'as@epic',
    );

    return $this->respond($result);
}

}