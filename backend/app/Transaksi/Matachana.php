<?php
namespace App\Transaksi;

class Matachana extends Transaksi
{
    protected $table = "matachana_t";
    protected $fillable = ["norec","kdprofile","nostruk","loadke","petugasfk","ruanganpengirimfk","ruangantujuanfk","suhu","waktu","status","tglinput"];
    public $timestamps = false;
    public $incrementing = false;
}


