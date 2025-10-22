<?php

namespace App\Transaksi;

class HasilGroupingIdrg extends Transaksi
{
    protected $table ="hasilgroupingidrg_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";

}