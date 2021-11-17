<?php
/**
 * Created by PhpStorm.
 * User: as@epic
 * Date: 05/12/2018
 * Time: 16.15
 */


namespace App\Transaksi;

class SeqNumberSurat extends Transaksi
{
    protected $table ="seqnumbersurat_t";
    protected $primaryKey = 'norec';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
}
