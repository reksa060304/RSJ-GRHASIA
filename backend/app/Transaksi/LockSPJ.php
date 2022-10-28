<?php

namespace App\Transaksi;

class LockSPJ extends Transaksi
{
    protected $table ="lockentryspj_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";


}
