<?php

namespace App\Transaksi;

class DiagnosaLaporan10 extends Transaksi
{
    protected $table = 'diagnosapasienlaporan_t';
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}
