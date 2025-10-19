<?php

return [
    'allowed_ips' => explode(',', env('BPJS_ALLOWED_IPS', '127.0.0.1,::1')),
];
