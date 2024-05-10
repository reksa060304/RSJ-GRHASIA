<?php
namespace App\Transaksi;

class RuanganAset extends Transaksi
{
    protected $table = 'ruanganasset_m';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "id";

    public function __construct(){
        //$this->setTransformerPath('App\Transformers\Web\VisiTransformer');
    }
}