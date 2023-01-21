<?php

namespace App\Transaksi;

// use Illuminate\Database\Eloquent\Model;

class MonitoringTaskId extends Transaksi
{
    protected $table = "monitoringtaskid_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}
