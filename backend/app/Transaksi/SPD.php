<?php

namespace App\Transaksi;

use App\BaseModel;

class SPD extends Transaksi
{
    protected $table = "spd_t";
    protected $primaryKey = 'norec';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
}