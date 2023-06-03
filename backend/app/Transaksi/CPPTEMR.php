<?php

namespace App\Transaksi;

class CPPTEMR extends Transaksi
{
    protected $table ="cpptemr_t";
    protected $primaryKey = 'norec';
    protected $fillable = [];
    public $timestamps = true;
    public $incrementing = false;
}
