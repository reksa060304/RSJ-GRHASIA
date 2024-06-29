<?php
namespace App\Transaksi;

class LantaiAset extends Transaksi
{
    protected $table = 'lantai_m';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "id";

    public function __construct(){
        //$this->setTransformerPath('App\Transformers\Web\VisiTransformer');
    }
}