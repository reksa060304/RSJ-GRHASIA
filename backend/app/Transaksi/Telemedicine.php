<?php

namespace App\Transaksi;

use App\BaseModel;

class Telemedicine extends Transaksi
{
    protected $table = "pasientelemedicine_t";
    protected $primaryKey = 'norec';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
}