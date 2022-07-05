<?php

namespace App\Transaksi;

use App\BaseModel;

class SPP extends Transaksi
{
    protected $table = "spp_t";
    protected $primaryKey = 'norec';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
}