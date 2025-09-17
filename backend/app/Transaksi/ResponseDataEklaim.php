<?php
namespace App\Transaksi;

class ResponseDataEklaim extends Transaksi
{
    protected $table ="responsedataeklaim_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";

}