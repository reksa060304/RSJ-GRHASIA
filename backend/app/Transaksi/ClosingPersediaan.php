<?php
/**
 * Created by PhpStorm.
 * User: as@epic
 * Date: 10/8/2021
 * Time: 3:14 PM
 */

namespace App\Transaksi;

class ClosingPersediaan extends Transaksi
{
    protected $table ="closingpersediaan_t";
    protected $primaryKey = 'norec';
    protected $fillable = [];
    public $timestamps = false;


}