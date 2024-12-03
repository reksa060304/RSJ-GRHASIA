<?php

namespace App\Transaksi;

use App\BaseModel;

class BKUPenerimaanV2 extends Transaksi
{
    protected $table = "bkupenerimaanv2_t";
    protected $primaryKey = 'norec';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
}