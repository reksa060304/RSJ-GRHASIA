<?php

namespace App\Transaksi;

class SuratTandaSetoranDetailV2 extends Transaksi
{
    protected $table ="surattandasetorandetailv2_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}
