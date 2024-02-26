<?php

namespace App\Transaksi;

class StrukPerencanaan extends Transaksi
{
    protected $table ="strukperencanaan_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}
