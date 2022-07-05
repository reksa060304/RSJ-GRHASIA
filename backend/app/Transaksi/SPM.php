<?php

namespace App\Transaksi;

use App\BaseModel;

class SPM extends Transaksi
{
    protected $table = "spm_t";
    protected $primaryKey = 'norec';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
}