<?php

namespace App\Transaksi;

use Illuminate\Database\Eloquent\Model;

class Ekuitas extends Transaksi
{
    protected $table = 'ekuitas_t';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}
