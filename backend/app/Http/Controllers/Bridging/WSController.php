<?php

/**
 * Created by PhpStorm.
 * User: egie ramdan
 * Date: 12/11/2021
 * Time: 13.59
 */

namespace App\Http\Controllers\Bridging;

use App\Http\Controllers\ApiController;
use App\Http\Controllers\RestController;
use App\Web\Profile;
use Illuminate\Http\Request;
use App\Traits\PelayananPasienTrait;
use DB;
use App\Traits\Valet;
use App\Transaksi\PasienDaftar;
use App\Transaksi\StrukBuktiPenerimaan;
use App\Transaksi\StrukBuktiPenerimaanCaraBayar;
use App\Transaksi\StrukPelayanan;
use App\Transaksi\VirtualAccount;
use Carbon\Carbon;
use Webpatser\Uuid\Uuid;

class WSController extends RestController
{

    protected $idUser = 13;
    use Valet, PelayananPasienTrait;

    public function __construct()
    {
        parent::__construct($skip_authentication = false);
    }
    public function kdProfile()
    {
        $profile = Profile::where('statusenabled', true)->first();
        $kdProfile = $profile->id;
        return $kdProfile;
    }
    public function inquiryInvVA(Request $request)
    {
        try {
            $kdProfile = $this->kdProfile();
            $data = DB::table('virtualaccount_t')->where('bank', 'OCBC')
                ->where('client_id', $request['company_code'])
                ->where('virtual_account', $request['customer_number'])
                ->where('kdprofile', $kdProfile)
                ->first();
            if (!empty($data)) {
                $res = array(
                    'company_code' => $data->client_id,
                    'customer_number' => $data->virtual_account,
                    'request_id' => $request['request_id'],
                    'status_message' => "SUCCESS",
                    'customer_name' => $data->customer_name,
                    'currency_code' => "IDR",
                    'bill_amount' => (float)$data->trx_amount,
                    'fee_amount' => 0,
                    'bill_number' => $data->trx_id,
                    'bill_description_1' => $data->description,
                    'bill_description_2' => "",
                    'bill_period' => $data->datetime_expired,
                    'phone_number' => $data->customer_phone,
                    'email' => $data->customer_email,
                );
                $code = 200;
            } else {
                $code = 500;
                $res = array(
                    "error_code" => 20107,
                    "error_message" => 'Bill not in yet ',
                );
            }
        } catch (\Exception $e) {
            $code = 500;
            $res = array(
                "error_code" => 20104,
                "error_message" => 'Internal Error  ',
            );
        }
        return response()->json($res, $code);
    }
    public function notifPaymentVA(Request $request)
    {
        \DB::beginTransaction();
        try {
            $kdProfile = $this->kdProfile();
            $data = DB::table('virtualaccount_t')->where('bank', 'OCBC')
                ->where('client_id', $request['company_code'])
                ->where('virtual_account', $request['customer_number'])
                ->where('kdprofile', $kdProfile)
                ->first();
            if (!empty($data)) {
                $newVA =  VirtualAccount::where('trx_id', $data->trx_id)->first();

                if ($newVA->norec_sbm != null) {
                    $code = 500;
                    $res = array(
                        "error_code" => 20105,
                        "error_message" => 'Bill already paid',
                    );
                    return response()->json($res, $code);
                }
                $newVA->kdprofile =  $this->kdProfile();
                $newVA->trx_amount = (float) $request['payment_amount'];
                $newVA->cumulative_payment_amount =  $request['payment_amount'];
                $newVA->payment_ntb =  $request['payment_amount'];
                $newVA->datetime_payment = date('Y-m-d H:i:s');
                $newVA->datetime_payment_iso8601 =  date('Y-m-d H:i:s');
                $newVA->status = 'callback';
                $newVA->save();
                if ($newVA->norec_sp != null && $newVA->norec_pd != null) {
                    if ($newVA->norec_sbm == null) {
                        $strukPelayanan = StrukPelayanan::where('norec', $newVA->norec_sp)->first();
                        $sisa = 0;
                        if ($strukPelayanan->nosbmlastfk == null || $strukPelayanan->nosbmlastfk == '') {
                            $sisa = $sisa + $this->getDepositPasien($strukPelayanan->pasien_daftar->noregistrasi);
                        }

                        $deposit = $sisa;

                        $sisa = $sisa +  $request['payment_amount'];
                        // foreach($request['pembayaran'] as $pembayaran){
                        $strukBuktiPenerimanan = new StrukBuktiPenerimaan();
                        $strukBuktiPenerimanan->norec = $strukBuktiPenerimanan->generateNewId();
                        $strukBuktiPenerimanan->kdprofile = $this->kdProfile();
                        $strukBuktiPenerimanan->keteranganlainnya = "Pembayaran Tagihan Pasien Virtual Account";
                        $strukBuktiPenerimanan->statusenabled = 1;
                        $strukBuktiPenerimanan->nostrukfk = $strukPelayanan->norec;
                        $strukBuktiPenerimanan->objectkelompokpasienfk = $strukPelayanan->pasien_daftar->pasien->objectkelompokpasienfk;
                        $strukBuktiPenerimanan->objectkelompoktransaksifk = 1;
                        $strukBuktiPenerimanan->objectpegawaipenerimafk  = $this->getCurrentLoginID();
                        $strukBuktiPenerimanan->tglsbm  = date('Y-m-d H:i:s');
                        $strukBuktiPenerimanan->totaldibayar  = (float) $request['payment_amount'];
                        $strukBuktiPenerimanan->nosbm = $this->generateCode(new StrukBuktiPenerimaan, 'nosbm', 14, 'RV-' . $this->getDateTime()->format('ym'), $this->kdProfile());
                        $strukBuktiPenerimanan->save();

                        $SBPCB = new StrukBuktiPenerimaanCaraBayar();
                        $SBPCB->norec = $SBPCB->generateNewId();
                        $SBPCB->kdprofile = $this->kdProfile();
                        $SBPCB->statusenabled = 1;
                        $SBPCB->nosbmfk = $strukBuktiPenerimanan->norec;
                        $SBPCB->objectcarabayarfk = 9;
                        $SBPCB->totaldibayar = (float) $request['payment_amount'];
                        $SBPCB->namabankprovider = 'Bank OCBC NISP';
                        $SBPCB->keteranganlainnya = 'Pembayaran Bank OCBC NISP';
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

                $code = 200;
                $res = array(
                    "company_code" => $newVA->client_id,
                    "customer_number" => $newVA->virtual_account,
                    "request_id" => $request['request_id'],
                    'status_message' => "Payment Success",
                    "customer_name" => $newVA->customer_name,
                    "currency_code" => 'IDR',
                    "bill_amount" => $newVA->trx_amount,
                    'fee_amount' => 0,
                    'bill_number' => $data->trx_id,
                    'bill_description_1' => $data->description,
                    'bill_description_2' => "",
                    'bill_period' => $data->datetime_expired,
                    'phone_number' => $data->customer_phone,
                    'email' => $data->customer_email,
                );
            } else {
                $code = 500;
                $res = array(
                    "error_code" => 20101,
                    "error_message" => 'Virtual account number not found',
                );
            }
            DB::commit();
        } catch (\Exception $e) {
            $code = 500;
            DB::rollBack();
            $res = array(
                "error_code" => 20104,
                // "e" => $e->getMessage() . ' ' . $e->getLine(),
                "error_message" => 'Internal Error  ',
            );
        }
        return response()->json($res, $code);
    }
    protected function unflagPaymenVA(Request $request)
    {
        $kdProfile = $this->kdProfile();
        \DB::beginTransaction();
        try {


            $data = DB::table('virtualaccount_t')->where('bank', 'OCBC')
                ->where('client_id', $request['company_code'])
                ->where('virtual_account', $request['customer_number'])
                ->where('kdprofile', $kdProfile)
                ->first();
            if (empty($data)) {
                $code = 500;
                $res = array(
                    "error_code" => 20101,
                    "error_message" => 'Virtual account number not found',
                );
                return response()->json($res, $code);
            }

            if ($data->norec_sbm == null) {
                $code = 500;
                $res = array(
                    "error_code" => 20107,
                    "error_message" => 'Bill not paid',
                );
                return response()->json($res, $code);
            }
            $sbm = StrukBuktiPenerimaan::where('norec', $data->norec_sbm)->first();

            $strukPelayanan = StrukPelayanan::where('norec', $data->norec_sp)
                ->where('kdprofile', $kdProfile)
                ->update(
                    [
                        'nosbmlastfk'    => null,
                    ]
                );

            $strukBuktiPenerimanan = StrukBuktiPenerimaan::where('norec', $data->norec_sbm)
                ->where('kdprofile', $kdProfile)
                ->update(
                    [
                        'statusenabled' => false,
                        'nostrukfk'    => null,
                    ]
                );
            $pasienDaftar = PasienDaftar::where('nostruklastfk', $data->norec_sp)
                ->where('kdprofile', $kdProfile)
                ->update(
                    [
                        'nosbmlastfk'    => null,
                    ]
                );
            $newVA =  VirtualAccount::where('trx_id', $data->trx_id)->first();
            $newVA->cumulative_payment_amount = null;
            $newVA->payment_ntb = null;
            $newVA->datetime_payment = null;
            $newVA->datetime_payment_iso8601 =  null;
            $newVA->status = null;
            $newVA->norec_sbm = null;
            $newVA->save();
            
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }


        if ($transStatus == 'true') {
            DB::commit();
            $code = 200;
            $res = array(
                "company_code" => $data->client_id,
                "customer_number" => $data->virtual_account,
                "request_id" => $request['request_id'],
                "original_request_id" => $request['original_request_id'],
                "status_message" => 'Unflag Success',
            );
        } else {
            DB::rollBack();
            $code = 500;
            $res = array(
                "error_code" => 20104,
                // "e" => $e->getMessage() . ' ' . $e->getLine(),
                "error_message" => 'Internal Error  ',
            );
        }
        return response()->json($res, $code);
    }
}
