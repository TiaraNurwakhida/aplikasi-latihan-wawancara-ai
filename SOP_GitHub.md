# SOP GitHub untuk Proyek Aplikasi Latihan Wawancara Kerja Berbasis AI

Dokumen ini menjelaskan langkah-langkah standar bagi seluruh anggota tim dalam menggunakan GitHub repository proyek ini.

---

## 1. Clone Repository
Sebelum mulai bekerja, clone repository ke laptop/komputer masing-masing:

```bash
git clone https://github.com/NAMA_USER/NAMA_REPOSITORY.git
```

Ganti NAMA_USER dan NAMA_REPOSITORY sesuai link repository kalian.

## 2. Masuk ke Folder Repository
Masuk ke folder project lokal:

```bash
cd NAMA_REPOSITORY
```

## 3. Membuat Perubahan
Lakukan perubahan pada file atau folder sesuai tugas masing-masing.

## 4. Menyimpan Perubahan (Commit)
Setelah selesai melakukan perubahan:

```bash
git add . 
git commit -m "Tulis pesan commit yang jelas di sini"
```

## Format Pesan Commit:

1. Feat: digunakan untuk menambahkan fitur baru.
2. Fix: digunakan untuk memperbaiki bug atau kesalahan.
3. Docs: digunakan untuk melakukan perubahan atau penambahan pada dokumentasi.
4. Style: digunakan untuk perubahan tampilan atau format kode (seperti spasi, indentasi) tanpa mengubah logika program.
5. Refactor: digunakan untuk memperbaiki atau merapikan struktur kode tanpa mengubah perilaku aplikasi.
6. Test: digunakan untuk menambahkan atau memperbaiki tes (unit test, integration test, dsb).
7. Chore: digunakan untuk tugas-tugas kecil atau rutin yang tidak berdampak langsung pada fitur utama (seperti update dependencies, build scripts).
8. Perf: digunakan untuk melakukan optimasi performa aplikasi.
9. Ci: digunakan untuk perubahan pada konfigurasi CI/CD (seperti GitHub Actions, GitLab CI).
10. Build: digunakan untuk perubahan terkait sistem build atau pengelolaan dependensi besar.
11. Revert: digunakan untuk membatalkan commit sebelumnya karena alasan tertentu (misalnya rollback fitur).

 ## Contoh commit:
 
 ```bash
 git commit -m "feat: tambah fitur sesi wawancara berbasis AI"
```

## 5. Push Perubahan ke GitHub
Setelah commit selesai, dorong perubahan ke GitHub:

```bash
git push origin main
```

## 6. Membuat Branch Baru (Opsional)
Untuk mengerjakan fitur baru tanpa mengganggu branch utama:

```bash
git checkout -b nama-fitur-baru
```
Push branch baru:

```bash
git push origin nama-fitur-baru
```
Kemudian buat Pull Request melalui GitHub.

## 7. Pull Update Terbaru Sebelum Mulai Kerja
Sebelum mulai kerja setiap hari, pastikan menarik update terbaru:

```bash
git pull origin main
```

## 8. Catatan Penting

1. Jangan mengedit file orang lain tanpa izin.
2. Lakukan commit kecil dan rutin.
3. Update repository lokal sebelum bekerja.
4. Pastikan pesan commit deskriptif dan jelas.

## 9. Contact
Jika ada kendala teknis GitHub, hubungi DevOps: Tiara Nurwakhida
