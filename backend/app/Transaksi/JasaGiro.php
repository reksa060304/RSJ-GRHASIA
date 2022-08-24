<?php

namespace App\Transaksi;

use App\BaseModel;

class JasaGiro extends Transaksi
{
    protected $table = "jasagiro_t";
    protected $primaryKey = 'norec';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
}