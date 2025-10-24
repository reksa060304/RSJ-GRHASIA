<?php
/**
 * Created by PhpStorm.
 * User: Egie Ramdan
 * Date: 22/10/2018
 * Time: 15:47
 */

namespace App\Transaksi;
use Illuminate\Database\Eloquent\Model;
use DB;

class RiwayatAlergiPasien extends Transaksi
{
    protected $table = "riwayatalergipasien_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";

    
}