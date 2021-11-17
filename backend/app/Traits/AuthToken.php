<?php
namespace App\Traits;

use Illuminate\Http\Request;

use App\Http\Requests;
use Namshi\JOSE\JWS;
use App\User;
//use Namshi\JOSE\SimpleJWS;

Trait AuthToken{
    protected $userData=null;


    protected function setUserData($data){
        $this->userData=$data;
    }

    protected function getUserData(){
        return $this->userData;
    }

    protected function  checkToken($token, $usernameForBridging){
        try {
            /** @var JWS $jws */
            $jws = JWS::load($token);
        } catch (\InvalidArgumentException $e) {
            return false;
        }

        if (!$jws->verify('JASAMEDIKA', "HS512")) {
            return false;
        }


        $dataToken = (object)$jws->getPayload();
        $user = User::where('namauser',  $dataToken->sub)->first();

         if(!$user){
            //andro
            $profile = \DB::table('profile_m')->where('statusenabled',true)->first();
            $user = \DB::table('pasien_m')->where('nocm',  $dataToken->sub)
                ->where('kdprofile',$profile->id)->first();

            if(empty($user)){

                   $user = \DB::table('loginpasien_s')->where('email',  $dataToken->sub)
                            ->where('kdprofile',$profile->id)->first();
                    if(!$user){
                        return false;
                    }else{
                        $filterUser = array(
                            "namauser" =>$user->email,
                            'id'    => $user->id
                        );
                    }
            }else{
                 if(!$user){
                        return false;
                    }else{
                        $filterUser = array(
                            "namauser" =>$user->nocm,
                            'id'    => $user->id
                        );
                    }
            }  
       
           
//            return false;
        }else{
            $filterUser = array(
                "namauser" =>$user->namauser,
                'id'    => $user->id
            );
            if(!$user){
                return false;
            }
            if($usernameForBridging!=null){
                if ($usernameForBridging != 'NonBridging') {
                    if ($dataToken->sub != $usernameForBridging) {
                        return false;
                    }
                }
            }
            

            $filterUser = array(
                "namauser" =>$user->namauser,
                'id'    => $user->id
            );
        }
        
//        $filterUser->namauser = $user->namauser;
//        $filterUser->id = $user->id;

        $this->setUserData($filterUser);
        \Session::put('userData',$this->getUserData());
        \Session::save();
        return true;
    }
}
