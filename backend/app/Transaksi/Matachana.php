<?php
namespace App\Transaksi;

class Matachana extends Transaksi
{
    protected $table = "matachana_t";
    protected $fillable = ["norec","kdprofile","nostruk","loadke","namapetugas","ruanganpengirimfk","ruangantujuanfk","suhu","waktu","status","tglinput"];
    public $timestamps = false;
    public $incrementing = false;
}


