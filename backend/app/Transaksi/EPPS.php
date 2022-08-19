<?php
/**
 * Created by PhpStorm.
 * User: as@epic
 * Date: 24/01/2019
 * Time: 13.54
 */


namespace App\Transaksi;

class EPPS extends Transaksi
{
    protected $table ="epps_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";


}