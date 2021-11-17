<?php
/**
 * Created by PhpStorm.
 * User: nengepic
 * Date: 12/16/2020
 * Time: 10:03 AM
 */


namespace App\Transaksi;

class Disposisi extends Transaksi
{
    protected $table = "disposisi_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}