<?php
/**
 * Created by PhpStorm.
 * User: Analis
 * Date: 20/06/2017
 * Time: 10:32
 */
namespace App\Transaksi;

// use Illuminate\Database\Eloquent\Model;
//use DB;

class ABKPegawai extends Transaksi
{
    protected $table = 'abkpegawai_t';
    protected $fillable = [];
    public $timestamps = false;
    protected $primaryKey = "id";
}