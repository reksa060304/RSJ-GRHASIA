<?php

namespace App\Transaksi;

class KegiatanAnggaran extends Transaksi
{
    protected $table ="kegiatananggaran_m";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "id";


}
