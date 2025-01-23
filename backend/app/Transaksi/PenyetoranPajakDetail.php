<?php

namespace App\Transaksi;

use App\BaseModel;

class PenyetoranPajakDetail extends Transaksi
{
    protected $table = "penyetoranpajakdetail_t";
    protected $primaryKey = 'norec';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
}