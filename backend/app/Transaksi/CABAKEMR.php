<?php

namespace App\Transaksi;


class CABAKEMR extends Transaksi
{
    protected $table ="cabakemr_t";
    protected $primaryKey = 'norec';
    protected $fillable = [];
    public $timestamps = false;
}
