<?php

namespace App\Transaksi;

use App\BaseModel;

class Retur extends Transaksi
{
    protected $table = "returakuntansi_t";
    protected $primaryKey = 'norec';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
}