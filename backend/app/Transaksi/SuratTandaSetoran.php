<?php

namespace App\Transaksi;

class SuratTandaSetoran extends Transaksi
{
    protected $table ="surattandasetoran_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}
