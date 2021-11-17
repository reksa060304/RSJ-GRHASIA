<?php

namespace App\Http\Middleware;

use App\Web\Profile;
use Closure;
use Response;
use App\Traits\Valet;
use App\Traits\AuthToken;
use App\Web\LoginUser;

class OCBCToken
{
    use AuthToken, Valet;
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {

        if (empty($request->header('Authorization'))) {

            $result = array(
                "error_code" => 20104,
                "error_message" => "Authorization required",
            );

            return response()->json($result, 500);
        }
        if (empty($request->header('X-OCBC-Timestamp'))) {

            $result = array(
                "error_code" => 20104,
                "error_message" => "X-OCBC-Timestamp required",
            );

            return response()->json($result, 500);
        }
        $explode =  explode(' ', $request->header('Authorization'));
        $timeStamp = $request->header('X-OCBC-Timestamp');

        $user = $explode[1];
        $login = LoginUser::where('access_token', $user)
            ->first();
        if (empty($login)) {
            $msg = "Credentials not match";
            $result = array(
                "error_code" => 20104,
                "error_message" => $msg,
            );
            return response()->json($result, 403);
        }
        if ($login->expired < date('Y-m-d H:i:s')) {
            $result = array(
                "error_code" => 20104,
                "error_message" => "Credentials Expired",
            );
            return response()->json($result, 500);
        }

        return $next($request);
    }
}
