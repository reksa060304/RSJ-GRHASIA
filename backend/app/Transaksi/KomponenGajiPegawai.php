<?php

namespace App\Transaksi;


class KomponenGajiPegawai extends Transaksi
{
    protected $table = 'komponengajipegawai_t';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";

}