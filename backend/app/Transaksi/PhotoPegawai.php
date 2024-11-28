<?php

namespace App\Transaksi;

class PhotoPegawai extends Transaksi
{
    protected $table = 'photopegawai_m';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}
