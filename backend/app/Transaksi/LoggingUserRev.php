<?php
namespace App\Transaksi;

class LoggingUserRev extends Transaksi
{
    protected $table ="logginguserrev_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";


    public function pelayanan_pasien(){
        return $this->belongsTo('App\Master\LoginUser',  'id','objectloginuserfk');
    }
}