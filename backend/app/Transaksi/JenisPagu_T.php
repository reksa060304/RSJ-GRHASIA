<?php
/**
 * Created by PhpStorm.
 * User: as@epic
 * Date: 21/03/2019
 * Time: 15.39
 */


namespace App\Transaksi;

class JenisPagu_T extends Transaksi
{
    protected $table = 'jenispagu_t';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "id";

}