# 🚀 Social Media API - UTS Pemrograman Backend

---

## 👥 Anggota Kelompok & Pembagian Tugas

### 1. Yumna (Autentikasi & Manajemen User)
**Endpoint Prefix:** `/api/auth` & `/api/users`
* **Register & Login**: Implementasi pendaftaran pengguna dan masuk sistem menggunakan JWT (JSON Web Token).
* **User Profile**: Menampilkan profil pengguna beserta thread yang telah dibuat.
* **Update Profile**: Fitur untuk memperbarui informasi profil seperti foto dan privasi akun.

### 2. Oscar (Manajemen Thread Utama)
**Endpoint Prefix:** `/api/threads`
* **Create Thread**: Membuat postingan utama (mendukung upload gambar menggunakan Multer).
* **Global Feed**: Menampilkan semua thread utama di halaman depan.
* **Get Thread by ID**: Mengambil detail satu thread spesifik.
* **Delete Thread**: Menghapus postingan utama milik sendiri.

### 3. Naufal Afif (Nested Replies & Advanced Logic)
**Endpoint Prefix:** `/api/threads` (Sub-routes & Logic)
* **Nested Reply System**: Fitur membalas thread dengan penyimpanan referensi `parentThreadId` dan update array `replies` pada dokumen induk.
* **Edit Content Logic**: Implementasi fitur edit postingan dengan batasan waktu maksimal 5 menit setelah pembuatan.
* **Reply Cleanup**: Logika penghapusan balasan yang secara otomatis membersihkan ID referensi pada thread induk menggunakan operator `$pull`.
* **User Replies Feed**: Menampilkan daftar semua balasan yang pernah dibuat oleh user tertentu.

### 4. Gading Sihol (Search & Relationship)
**Endpoint Prefix:** `/api/search`
* **Fitur Search**: Fitur untuk Mencari akun dengan memfilter database dan mengembalikan daftar profil yang cocok dengan string yang dimasukkan, baik berdasarkan username.
* **Fitur Search Threads**: Fitur untuk mencari kata kunci ternteu di dalam judul atau isi postingan (thread).
* **Fitur Social Graph**: Fitur untuk menampilkan siapa saja yang diikuti oleh user tertentu.
* **Fitur Social Graph2**: Fitur untuk menampilkan daftar pengikut.

### 5. Muhammad Farouq Dhiaulhaq (Activity System)
**Endpoint Prefix:** `/api/activity`
* **Fitur Interaksi**: Fitur untuk merekam interaksi pengguna terhadap sebuah thread.
* **Fitur Histori**: Fitur untuk mengambil daftar seluruh aktivitas yang dilakukan oleh user maupun aktivitas yang menargetkan user tersebut.
* **Fitur Statistik Thread**: Fitur publik untuk menampilkan riwayat interaksi spesifik pada sebuah thread tertentu.
* **Fitur Pembatalan Interaksi**: Fitur untuk menghapus rekaman aktivitas di dalam database berdasarkan ID aktivitasnya.

---

## 🛠️ Detail Endpoint API

### Autentikasi (Yumna)
| Method | Endpoint             | Deskripsi |
| :---   | :---                 | :--- |
| `POST` | `/api/auth/register` | Mendaftarkan pengguna baru |
| `POST` | `/api/auth/login`    | Autentikasi user & generate token |

### Manajemen User (Yumna)
| Method | Endpoint               | Deskripsi |
| :---   | :---                   | :--- |
| `GET`  | `/api/users/:username` | Melihat profil & thread user |
| `PUT`  | `/api/users/update`    | Update data profil (Auth required) |

### Thread Utama (Oscar)
| Method   | Endpoint           | Deskripsi |
| :---     | :---               | :--- |
| `GET`    | `/api/threads`     | Mengambil semua thread utama (Feed) |
| `POST`   | `/api/threads`     | Membuat thread baru (Support Image) |
| `DELETE` | `/api/threads/:id` | Menghapus thread utama |
| `GET`    | `/api/threads/:id` | Mengambil semua thread berdasarkan Id |

### Balasan & Fitur Tambahan (Naufal)
| Method   | Endpoint                            | Deskripsi |
| :---     | :---                                | :--- |
| `POST`   | `/api/threads/:id/reply`            | Membalas thread/postingan |
| `PATCH`  | `/api/threads/:id`                  | Edit konten (Limit 5 menit) |
| `DELETE` | `/api/threads/replies/:id`          | Hapus reply & cleanup referensi |
| `GET`    | `/api/threads/replies/user/:userId` | Daftar balasan milik user |

### Search * Relationship (Gading)
| Method   | Endpoint                            | Deskripsi |
| :---     | :---                                | :--- |
| `GET`    | `/api/search/users?q=`              | Mencari user berdasrkan username atau nama |
| `GET`    | `/api/search/threads?q=`            | Mencari thread berdasarkan kata kunci |
| `GET`    | `/api/users/:id/following`          | Melihat daftar user yang diikuti |
| `GET`    | `/api/users/:id/followers`          | Melihat daftar followers |

### Activity-like, repost & follow (Farouq)
| Method   | Endpoint                            | Deskripsi |
| :---     | :---                                | :--- |
| `POST`   | `/api/activity`                     | Membuat Activity   |
| `GET`    | `/api/activity`                     | Mencari User Activity   |
| `GET`    | `/api/activity/thread/:id`          | Melihat interaksi pada sebuah threads |
| `DELETE` | `/api/activity/:id`                 | Melakukan Unlike, Unrepost & Unfollow|


---

## 📁 Arsitektur Kode
Proyek ini menggunakan struktur folder berbasis komponen untuk memastikan kode terorganisir:
* `src/api/components/`: Berisi logika bisnis yang dipisah per entitas (Users, Threads).
* `src/core/`: Berisi konfigurasi inti (Database, Express App).
* `src/models/`: Definisi skema MongoDB Native.
* `src/middleware/`: Middleware untuk validasi JWT.

---

## ⚙️ Instalasi
1. Clone repository ini.
2. Jalankan `npm install`.
3. Buat file `.env` dan isi `MONGODB_URI` serta `JWT_SECRET` dari isi `.env.example`.
4. Jalankan aplikasi dengan `npm start`.