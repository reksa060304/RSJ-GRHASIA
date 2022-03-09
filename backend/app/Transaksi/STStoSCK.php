<?php

namespace App\Transaksi;

class STStoSCK extends Transaksi
{
    protected $table ="ststosck_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";

}
