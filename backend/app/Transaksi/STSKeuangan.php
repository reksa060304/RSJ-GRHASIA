<?php

namespace App\Transaksi;

use App\BaseModel;

class STSKeuangan extends Transaksi
{
    protected $table = "stskeuangan_t";
    protected $primaryKey = 'norec';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
}