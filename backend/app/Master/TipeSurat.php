<?php

namespace App\Master;

// use Illuminate\Database\Eloquent\Model;

class TipeSurat extends MasterModel
{
    protected $table ="tipepengirimsurat_m";
    protected $fillable = [];
    public $timestamps = false;
    protected $primaryKey = "norec";
}
