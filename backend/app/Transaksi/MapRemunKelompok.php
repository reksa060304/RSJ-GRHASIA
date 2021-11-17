<?php
/**
 * Created by PhpStorm.
 * User: Egie Ramdan
 * Date: 10/10/2019
 * Time: 9:31 AM
 */
namespace App\Transaksi;
use App\Transaksi\Transaksi;

class MapRemunKelompok extends Transaksi
{
    protected $table = 'mapremunkelompok_t';
    protected $fillable = [];
    public $timestamps = false;
    protected $primaryKey = 'id';

}
