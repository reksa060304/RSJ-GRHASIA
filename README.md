# Rumah Sakit Jiwa Grhasia

WebApps Sistem Informasi Manajemen Rumah Sakit 

# Instalasi 

1. Clone repository `rsj_grhasia`.
```sh
git clone https://github.com/agussustian2017/rsj_grhasia.git
```
2. Pindah ke *directory* `rsj_grhasia`.
```sh
cd rsj_grhasia/backend
```
3. Jalankan `composer`.
```sh
composer install
```
4. Copy file `.env.example` menjadi `.env`.
5. Set konfigurasi aplikasi di `.env`.
6. Jalankan migrasi database.
```sh

php artisan migrate
```
7. Install node js
```sh
https://nodejs.org/en/
```
8. Pindah ke *directory* `frontend`.
```sh
cd frontend
```
9. Download dependency, kemudian extract
```sh
https://drive.google.com/file/d/1dSwZmIxpBIa6uJQFe6q0c11FCiS3kKlL/view?usp=sharing
```
10. Set konfigurasi API di `frontend/app/javascripts/Setting.js`.
