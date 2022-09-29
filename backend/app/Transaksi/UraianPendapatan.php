<?php

namespace App\Transaksi;

use App\BaseModel;

class UraianPendapatan extends Transaksi
{
    protected $table = "uraianpendapatan_m";
    protected $primaryKey = 'id';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
}