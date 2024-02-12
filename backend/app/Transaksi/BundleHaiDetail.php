<?php
/**
 * Created by PhpStorm.
 * User: Egie
 * Date: 11/22/2019
 * Time: 3:19 PM
 */
namespace App\Transaksi;

class BundleHaiDetail extends Transaksi
{
    protected $table = "bundlehaidetail_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}