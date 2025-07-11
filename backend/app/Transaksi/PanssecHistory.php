<?php
namespace App\Transaksi;

class PanssecHistory extends Transaksi
{
    protected $table ="panssec_history";
    protected $fillable = [];
    public $timestamps = false;
    protected $primaryKey = 'norec';

}