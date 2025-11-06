<?php
namespace App\Master;

//use Illuminate\Database\Eloquent\Model;



class DetailProfile extends MasterModel
{
    protected $table ="detailprofile_m";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "id";
}
