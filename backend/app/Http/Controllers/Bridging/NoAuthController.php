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
}