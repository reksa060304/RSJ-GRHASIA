<?php

namespace App\Transaksi;

class SettingAnggaran extends Transaksi
{
    protected $table ="settinganggaran_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";


}
