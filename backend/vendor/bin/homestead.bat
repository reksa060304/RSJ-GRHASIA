@ECHO OFF
setlocal DISABLEDELAYEDEXPANSION
SET BIN_TARGET=%~dp0/../laravel/homestead/homestead
php "%BIN_TARGET%" %*
