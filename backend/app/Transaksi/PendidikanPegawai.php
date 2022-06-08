<?php
namespace App\Transaksi;

class PendidikanPegawai extends Transaksi
{
    protected $table = "pendidikanpegawai_m";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "id";

    
}