<?php

namespace App\Transaksi;


class DetailGajiPegawai extends Transaksi
{
    protected $table = 'detailgajipegawai_t';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";

}