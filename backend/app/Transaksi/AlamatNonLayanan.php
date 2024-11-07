<?php
namespace App\Transaksi;

class AlamatNonLayanan extends Transaksi
{
    protected $table ="alamatnonlayanan_m";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";

}