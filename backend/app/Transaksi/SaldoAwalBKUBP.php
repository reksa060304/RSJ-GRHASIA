<?php
/**
 * Created by PhpStorm.
 * User: agus.sustian@epic01
 * Date: 09/08/2017
 * Time: 20.45
 */
namespace App\Transaksi;
class SaldoAwalBKUBP extends Transaksi
{
    protected $table ="saldoawal_bkubp_t";
    protected $primaryKey = 'norec';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;

}