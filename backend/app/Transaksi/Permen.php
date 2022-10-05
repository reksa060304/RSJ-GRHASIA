<?php

namespace App\Transaksi;

use App\BaseModel;

class Permen extends Transaksi
{
    protected $table = "mataanggaranpermen_m";
    protected $primaryKey = 'id';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
}