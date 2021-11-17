<?php
namespace App\Master;

class BankAccount extends MasterModel
{
    protected $table ="bankaccount_m";
    protected $fillable = [];
    
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "id";

//    public function __construct(){$this->setTransformerPath('App\Transformers\Master\KelompokPasienTransformer');}

}
