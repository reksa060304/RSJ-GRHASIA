<?php
/*
 * @Author: Agung Martono
 * @Date: 2020-11-24 14:54:37
 * @LastEditTime: 2020-11-24 15:12:24
 * @FilePath: \backend\app\Transaksi\DetailJenisPagu_T.php
 */
/**
 * Created by PhpStorm.
 * User: as@epic
 * Date: 21/03/2019
 * Time: 15.39
 */


namespace App\Transaksi;

class DetailJenisPagu_T extends Transaksi
{
    protected $table = 'detailjenispagu_t';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "id";

}