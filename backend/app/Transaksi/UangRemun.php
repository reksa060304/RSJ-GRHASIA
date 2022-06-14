<?php

namespace App\Transaksi;

class UangRemun extends Transaksi
{
    protected $table ="uangremun_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "id";
}
