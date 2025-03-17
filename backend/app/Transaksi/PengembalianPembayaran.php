<?php

namespace App\Transaksi;

use App\BaseModel;

class PengembalianPembayaran extends Transaksi
{
    protected $table = "pengembalianpembayaran_t";
    protected $primaryKey = 'norec';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
}