<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Filesystem Disk
    |--------------------------------------------------------------------------
    |
    | Here you may specify the default filesystem disk that should be used
    | by the framework. A "local" driver, as well as a variety of cloud
    | based drivers are available for your choosing. Just store away!
    |
    | Supported: "local", "ftp", "s3", "rackspace"
    |
    */

    'default' => 'local',

    /*
    |--------------------------------------------------------------------------
    | Default Cloud Filesystem Disk
    |--------------------------------------------------------------------------
    |
    | Many applications store files both locally and in the cloud. For this
    | reason, you may specify a default "cloud" driver here. This driver
    | will be bound as the Cloud disk implementation in the container.
    |
    */

    'cloud' => 's3',

    /*
    |--------------------------------------------------------------------------
    | Filesystem Disks
    |--------------------------------------------------------------------------
    |
    | Here you may configure as many filesystem "disks" as you wish, and you
    | may even configure multiple disks of the same driver. Defaults have
    | been setup for each driver as an example of the required options.
    |
    */

    'disks' => [

        'local' => [
            'driver' => 'local',
            'root' => storage_path('app'),
        ],

        'public' => [
            'driver' => 'local',
            'root' => storage_path('app/public'),
            'visibility' => 'public',
        ],

        'pacs' => [
            'driver' => 'local',
            'root' => storage_path('images/pacs'),
            'visibility' => 'public',
        ],

        'sftp' => [
          'driver'     => 'sftp',
          'host'       => env('SFTP_HOST', '10.122.250.14'),
          'port'       => env('SFTP_PORT', '22'),
          'username'   => env('SFTP_USERNAME', 'adminrsud'),
          'password'   => env('SFTP_PASSWORD', 'P@ssw0rdRSUD'),
          'privateKey' => env('SFTP_PRIVATE_KEY_PATH', ''),
          'root'       => env('SFTP_ROOT', '/opt/rsud_cibinong/backend/storage/images/pacs'),
          'timeout'    => env('SFTP_TIMEOUT', '30'),
        ],
        'sftp_bnidirect' => [
            'driver'     => 'sftp',
            'host'       => env('SFTP_HOST', '175.106.22.51'),
            'port'       => env('SFTP_PORT', '22'),
            'username'   => env('SFTP_USERNAME', 'GFX_TRASINDO'),
            'password'   => env('SFTP_PASSWORD', 'password'),
            'privateKey' => env('SFTP_PRIVATE_KEY_PATH', ''),
            'root'       => env('SFTP_ROOT', '/Payroll/Outgoing'),
            'timeout'    => env('SFTP_TIMEOUT', '30'),
          ],
        
        's3' => [
            'driver' => 's3',
            'key' => 'your-key',
            'secret' => 'your-secret',
            'region' => 'your-region',
            'bucket' => 'your-bucket',
        ],

    ],

];
