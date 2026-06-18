<?php

namespace App\Master;

// use Illuminate\Database\Eloquent\Model;

class MapProdukToMenuMakanan extends MasterModel
{
    protected $table = 'map_produk_to_menumakanan_m';
    protected $fillable = [];
    public $timestamps = false;
    // public $incrementing = false;
    // protected $primaryKey = "norec";
    

    // public function __construct(){
        //$this->setTransformerPath('App\Transformers\Web\VisiTransformer');
    // }

    public function produk(){
        return $this->belongsTo(Produk::class, 'produk_id');
    }

    public function menuMakanan(){
        return $this->belongsTo(MenuMakanan::class, 'menumakanan_id');
    }
}
