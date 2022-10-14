<?php

namespace App\Transaksi;

class MonitoringKlaim extends Transaksi
{
    protected $table ="monitoringklaim_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";

}
