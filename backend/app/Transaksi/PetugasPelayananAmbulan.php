<?php
namespace App\Transaksi;

class PetugasPelayananAmbulan extends Transaksi
{
    protected $table ="petugaspelayananambulan_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";


    public function pegawai(){
        return $this->belongsTo('App\Master\Pegawai', 'objectpegawaifk');
    }
}