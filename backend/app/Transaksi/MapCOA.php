<?php

namespace App\Transaksi;

class MapCOA extends Transaksi
{
    protected $table ="mapcoatorekening_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";


}
