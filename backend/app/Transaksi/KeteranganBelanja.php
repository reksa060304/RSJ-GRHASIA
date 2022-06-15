<?php

namespace App\Transaksi;

class KeteranganBelanja extends Transaksi
{
    protected $table ="keteranganbelanja_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";


}
