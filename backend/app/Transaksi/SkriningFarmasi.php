<?php

namespace App\Transaksi;

use App\BaseModel;

class SkriningFarmasi extends Transaksi
{
    protected $table = "skriningfarmasi_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = 'norec';
}