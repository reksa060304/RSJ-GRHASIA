<?php

namespace App\Transaksi;

use Illuminate\Database\Eloquent\Model;

class ListNotif extends Model
{
    protected $table ="listnotif";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}
