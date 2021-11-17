<?php
/**
 * Created by PhpStorm.
 * User: Egie Ramdan
 * Date: 12/09/2018
 * Time: 10.10
 */

namespace App\Transaksi;

class BpjsRencanaKontrol extends Transaksi
{
    protected $table ="bpjsrencanakontrol_t";
    protected $fillable = [];
    public $timestamps = false;
    protected $primaryKey = "norec";


}