<?php
namespace App\Transaksi;

class GedungAset extends Transaksi
{
    protected $table = 'gedungaset_m';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "id";

    public function __construct(){
        //$this->setTransformerPath('App\Transformers\Web\VisiTransformer');
    }
}