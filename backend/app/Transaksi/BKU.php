<?php

namespace App\Transaksi;

use App\BaseModel;

class BKU extends Transaksi
{
    protected $table = "bukukasumum_t";
    protected $primaryKey = 'norec';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
}