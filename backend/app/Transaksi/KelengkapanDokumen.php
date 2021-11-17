<?php


namespace App\Transaksi;

class KelengkapanDokumen extends Transaksi
{
    protected $table = "kelengkapandok_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}