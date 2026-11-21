# Panduan Update Data Portofolio & CV

Folder `/portfolio-data` ini sengaja diletakkan di direktori paling atas (root) agar mudah ditemukan saat membuka repositori di GitHub.

## Cara Mengubah atau Menambah Project Portofolio
1. Buka file [`data.ts`](./data.ts) langsung di GitHub (klik ikon pensil / **Edit this file**).
2. Untuk menambah atau mengubah daftar aplikasi portofolio, edit bagian `projects: [ ... ]`:
   ```ts
   {
     id: "nama-project-baru",
     index: "04",
     title: "Nama Aplikasi",
     url: "https://link-aplikasi.vercel.app/",
     displayUrl: "link-aplikasi.vercel.app",
     category: "Kategori Singkat",
     impactMetric: "Metrik Efisiensi",
     description: "Deskripsi singkat fungsi dan dampak aplikasi.",
     highlights: [
       "Fitur Utama 1",
       "Fitur Utama 2"
     ]
   }
   ```
3. Untuk memperbarui pengalaman kerja, pendidikan, atau kontak, ubah bagian `experiences`, `education`, atau kontak di bagian atas file `data.ts`.
4. Klik **Commit changes** di GitHub. Vercel akan otomatis memperbarui website dalam waktu kurang dari 1 menit.
