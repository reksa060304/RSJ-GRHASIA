<?php
namespace App\Transaksi;

class EMR_BSRE extends Transaksi
{
    protected $table = "emr_bsre_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "id";

}