<?php

namespace App\Transaksi;

class CatatanPasienDaftar extends Transaksi
{
    protected $table = "catatanpasiendaftar_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}