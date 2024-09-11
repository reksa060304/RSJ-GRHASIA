<?php

namespace App\Transaksi;

class TransaksiAnggaran2024 extends Transaksi
{
    protected $table = "transaksianggaran2024_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";

}