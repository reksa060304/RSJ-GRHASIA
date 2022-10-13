<?php

namespace App\Transaksi;

use Illuminate\Database\Eloquent\Model;

class RiwayatOrderGizi extends Model
{
    protected $table = 'riwayatordergizi_t';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}
