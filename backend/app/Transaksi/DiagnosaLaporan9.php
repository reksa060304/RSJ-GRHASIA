<?php

namespace App\Transaksi;

class DiagnosaLaporan9 extends Transaksi
{
    protected $table = 'diagnosapasientindakanlaporan_t';
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}
