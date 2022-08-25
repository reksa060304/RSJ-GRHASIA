<?php

namespace App\Transaksi;

use App\BaseModel;

class PenyetoranPajak extends Transaksi
{
    protected $table = "penyetoranpajak_t";
    protected $primaryKey = 'norec';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
}