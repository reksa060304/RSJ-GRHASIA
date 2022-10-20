<?php

namespace App\Transaksi;

use App\BaseModel;

class Jurnal extends Transaksi
{
    protected $table = "jurnalpenyesuaianpenutupan_t";
    protected $primaryKey = 'norec';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
}