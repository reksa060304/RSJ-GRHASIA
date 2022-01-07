<?php

namespace App\Http\Middleware;
use App\Datatrans\LoginUser;

use Illuminate\Support\Facades\URL;
use Closure;
use App\Traits\AuthToken;
class LoginValidator
{
    use AuthToken;
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next,$role=null)
    {
        if(empty(session('id'))){
            return redirect()->route("logout");
        }
        if($this->checkToken(session('tokenLogin'))){
            return $next($request);
        }else {
            return redirect()->route("logout");
        }

//        return $next($request);
    }
}
