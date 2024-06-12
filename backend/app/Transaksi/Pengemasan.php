<?php
namespace App\Transaksi;

class Pengemasan extends Transaksi
{
    protected $table = "pengemasan_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}