<?php

namespace App\Transaksi;

class StrukPerencanaanDetail extends Transaksi
{
    protected $table ="strukperencanaandetail_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}
