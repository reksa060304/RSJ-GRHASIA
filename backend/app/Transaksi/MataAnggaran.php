<?php

namespace App\Transaksi;

class MataAnggaran extends Transaksi
{
    protected $table ="mataanggaran_m";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "id";
}
