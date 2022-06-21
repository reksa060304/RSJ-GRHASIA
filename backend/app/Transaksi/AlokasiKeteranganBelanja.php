<?php

namespace App\Transaksi;

class AlokasiKeteranganBelanja extends Transaksi
{
    protected $table ="alokasiketeranganbelanja_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";


}
