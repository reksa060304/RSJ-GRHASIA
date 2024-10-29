<?php
/**
 * Created by PhpStorm.
 * User: Egie Ramdan
 * Date: 02/08/2018
 * Time: 14.15
 */

namespace App\Transaksi;

class PengembalianBelanja extends Transaksi
{
    protected $table ="pengembalianbelanja_t";
    protected $fillable = [];
    public $timestamps = false;
    protected $primaryKey = "norec";


}