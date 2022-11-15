<?php
/**
 * Created by PhpStorm.
 * User: as@epic
 * Date: 9/20/2017
 * Time: 4:55 PM
 */

namespace App\Transaksi;

class SPJtoPanjar extends Transaksi
{
    protected $table = "spjtopanjar_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}