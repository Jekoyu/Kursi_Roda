# Struktur Folder Project

## Root
- **`env.sample`**: File template untuk konfigurasi environment yang bisa digunakan untuk mengatur variabel lingkungan pada aplikasi.
- **`app.js`**: File utama aplikasi yang berfungsi sebagai entry point untuk menjalankan aplikasi.

## Folder
- **`/bin`**: Berisi file atau script yang digunakan untuk menjalankan aplikasi, seperti perintah-perintah command-line.
- **`/config`**: Berisi konfigurasi untuk berbagai aspek aplikasi, seperti pengaturan database, server, atau pengaturan lainnya. Biasanya dari **.ENV** akan diarahkan ke sini dulu
- **`/database`**: Menyimpan semua file terkait konfigurasi driver/ORM dengan database.
- **`/dev-notes`**: Tempat untuk menyimpan catatan dan dokumentasi yang digunakan selama pengembangan proyek.
- **`/exception`**: Berisi file yang menangani berbagai *error handling* dalam aplikasi.
- **`/middleware`**: Menyimpan middleware yang digunakan untuk memproses request dan response dalam aplikasi, seperti autentikasi dan validasi.
- **`/route`**: Berisi file yang mengatur routing atau penanganan URL dan permintaan dari pengguna. Merupakan penghubung antara User dengan `/controller`.
- **`/src`**: Merupakan folder utama yang berisi kode sumber aplikasi, dengan struktur folder sebagai berikut:
  - **`/constant`**: Berisi nilai-nilai konstan yang digunakan di seluruh aplikasi.
  - **`/controller`**: Menyimpan file controller untuk mengubungkan `/route` dengan logika utama aplikasi.
  - **`/model`**: Menyimpan file yang mendefinisikan struktur data dan hubungan antar tabel dalam database.
  - **`/repository`**: Berisi file untuk pengelolaan akses data (*query*) dari database.
  - **`/service`**: Menyimpan logika aplikasi dan bisnis yang berfungsi untuk memproses data dan menyiapkan hasil untuk dikirim ke `controller`.
  - **`/template-email`**: Berisi template untuk pengiriman email, seperti HTML atau teks untuk email yang akan dikirimkan.
  - **`/validation`**: Berisi file yang digunakan untuk memvalidasi input dari User sebelum diproses lebih lanjut.
  
- **`/utility`**: Menyimpan file utilitas atau fungsi-fungsi bantu yang digunakan di berbagai tempat dalam aplikasi.

