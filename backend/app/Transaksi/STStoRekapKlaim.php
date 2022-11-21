<?php

namespace App\Transaksi;

class STStoRekapKlaim extends Transaksi
{
    protected $table ="ststorekapklaim_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";

}
