<?php
namespace App\Transaksi;

class RealisasiDetail extends Transaksi
{
    protected $table = "realisasidetail_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";

}