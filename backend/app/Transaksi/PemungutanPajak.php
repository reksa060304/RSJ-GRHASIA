<?php

namespace App\Transaksi;

use App\BaseModel;

class PemungutanPajak extends Transaksi
{
    protected $table = "pemungutanpajak_t";
    protected $primaryKey = 'norec';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
}