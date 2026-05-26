<?php
namespace App\Transaksi;

class SiklusGiziDiet extends Transaksi
{
    protected $table = "siklusgizidiet_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}