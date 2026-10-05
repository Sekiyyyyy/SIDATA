@echo off
title SIDATA Siswa - SMKN 1 BERINGIN
echo ===================================================
echo     SIDATA SISWA - SMKN 1 BERINGIN
echo     Sistem Informasi Data Siswa & Buku Induk
echo ===================================================
echo.
echo Membuka browser ke http://localhost:8000 ...
start http://localhost:8000
echo.
echo Menjalankan Laravel Server pada port 8000...
php artisan serve --port=8000
pause
