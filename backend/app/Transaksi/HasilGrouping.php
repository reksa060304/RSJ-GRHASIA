<?php

namespace App\Transaksi;

class HasilGrouping extends Transaksi
{
    protected $table ="hasilgrouping_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";

}