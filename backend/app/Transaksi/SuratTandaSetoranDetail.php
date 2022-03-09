<?php

namespace App\Transaksi;

class SuratTandaSetoranDetail extends Transaksi
{
    protected $table ="surattandasetorandetail_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}
