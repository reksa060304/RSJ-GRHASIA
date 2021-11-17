<?php
/**
 * Created by PhpStorm.
 * User: nengepic
 * Date: 12/3/2020
 * Time: 1:37 AM
 */


namespace App\Transaksi;

class HeadSurat extends Transaksi
{
    protected $table = "headsurat_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}