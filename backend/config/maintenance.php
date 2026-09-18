<?php

declare(strict_types=1);

return [
    /*
    |--------------------------------------------------------------------------
    | Database Maintenance Secret Password
    |--------------------------------------------------------------------------
    |
    | Used to authenticate authorized administrators when triggering destructive
    | database actions such as migrate:fresh and migrate:rollback via web UI.
    | Supports both DATABASE_REFRESH_MIGRATE_PASSWORD and DB_REFRESH_MIGRATE_PASSWORD.
    |
    */
    'db_password' => env('DATABASE_REFRESH_MIGRATE_PASSWORD', env('DB_REFRESH_MIGRATE_PASSWORD')),
];
