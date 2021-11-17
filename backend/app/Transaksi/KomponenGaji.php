<?php

namespace App\Transaksi;


class KomponenGaji extends Transaksi
{
    protected $table = 'komponengaji_m';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";

}