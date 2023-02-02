<?php
namespace App\Master;

//use Illuminate\Database\Eloquent\Model;



class MapSTSToRuangan extends MasterModel
{
    protected $table ="mapststoruangan_m";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}
