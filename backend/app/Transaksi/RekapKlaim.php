<?php

namespace App\Transaksi;

class RekapKlaim extends Transaksi
{
    protected $table ="rekapklaimbpjs_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";

}
