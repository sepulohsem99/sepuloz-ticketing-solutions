# Sepuloz Ticketing

**Portal tiket sokongan IT — tiga peranan, satu rantaian akauntabiliti.**

Live: https://sepulozticketingsolutions.pages.dev

---

## Masalah yang diselesaikan

Setiap pasukan IT dalaman di Malaysia berjalan atas kumpulan WhatsApp dan spreadsheet. Bila ia membesar melebihi lima orang, tiket mula hilang, PM jadi penghala manusia, dan tiada siapa boleh jawab "apa yang tersekat sekarang?"

Alat sedia ada memaksa pertukaran yang buruk:

| Pilihan | Realiti |
|---|---|
| **osTicket / GLPI** | Percuma dan berfungsi, tetapi UI agen sudah lapuk. PM malas buka, jadi tiket kembali ke WhatsApp. |
| **Jira SM / Freshservice** | Berkuasa, tetapi 20+ skrin konfigurasi sebelum tiket pertama, dan harga per-agen yang menghukum pasukan kecil. |
| **Semua** | Model "agen" dan "pemohon", tetapi tidak pernah "orang yang bertanggungjawab atas penghantaran". PM masih eksport CSV ke Excel untuk lapor ke atas. |
| **Semua** | Anggap "Resolved" sebagai penamat. Tiada siapa semak sama ada pembaikan itu benar. |

Sepuloz membalikkan andaian itu.

---

## Tiga peranan

### Penguatkuasa
- Cipta tiket (isu wajib, lampiran & langkah reproduksi pilihan)
- Lihat senarai tiket sendiri dengan status
- Muat naik lampiran pada tiket sendiri
- Selepas IT Support tanda **Fixed**: uji semula, kemudian pilih
  - **Isu selesai** → status `resolved`
  - **Masih berlaku** → status `re-open`
- **Tiket `closed` tidak boleh dibuka semula.** Kena cipta tiket baharu.

### Project Manager
- Cipta dan kemas kini tiket, muat naik lampiran
- **Agih tiket kepada IT Support** — dan di sinilah **severity** ditetapkan
- Cipta projek; setiap projek ada board dan prefix tiket sendiri
- Lihat semua tiket merentas projek

### IT Support
- Lihat tiket, baca lampiran
- **Tanda Fixed** (dengan ringkasan pembaikan)
- **Sambung kerja** pada tiket `re-open` — kembali kepada IT Support yang sama
- **Gabung tiket** yang isunya sama ke satu tiket induk
- **Tutup tiket** selepas Penguatkuasa sahkan `resolved`

---

## Severity

Ditetapkan **oleh PM semasa agih**, bukan oleh pelapor.

| Severity | Maksud |
|---|---|
| **Critical** | Sistem tidak boleh diguna langsung. |
| **Urgent** | Fungsi utama terjejas, ada jalan kerja sementara. |
| **Normal** | Kerosakan biasa, ada jalan kerja. |
| **KIV** | Diterima tetapi ditangguh — *keep in view*, bukan urgent. |

---

## Aliran status

```
open ──(PM agih + severity)──► assigned
                                 │
                        (IT tanda Fixed)
                                 ▼
                              fixed
                             ╱     ╲
              (masih berlaku)       (isu selesai)
                    ▼                    ▼
                 reopen              resolved
                    │                    │
        (IT sambung kerja)      (IT tutup)
                    ▼                    ▼
                assigned              closed
```

Setiap peralihan terikat pada peranan. Penguatkuasa tidak boleh tutup tiket; IT Support tidak boleh sahkan pembaikan sendiri.

---

## Projek & prefix

Setiap projek ada board berasingan dan prefix tiket sendiri. Workflow status sama untuk semua.

| Projek | Prefix | Skop |
|---|---|---|
| eMAS Portal | `EMAS` | Portal penguatkuasaan bersepadu |
| ITCS | `ITCS` | Clamp, tow dan kompaun |
| IES | `IES` | Aplikasi penguatkuasaan lapangan |
| IPS | `IPS` | Sistem rondaan bersepadu |

PM boleh cipta projek baharu — prefix 3–6 huruf, mesti unik.

---

## Ciri UI

- **Tema gelap & cerah** — token CSS, disimpan dalam `localStorage`
- **Board kanban** 6 kolum ikut status
- **Jadual data** dengan:
  - header sticky (bekas skrol sendiri)
  - sorting increment/decrement pada setiap kolum
  - pagination
  - pemilih saiz halaman **10 / 20 / 30 / 40 / 50**
- **Laci tiket** — butiran, lampiran, garis masa, tindakan mengikut peranan
- **Responsif** — jadual jadi kad bertindan di bawah 860px, tiada overflow mendatar

---

## Struktur fail

```
index.html
assets/
  css/app.css     token, komponen, responsif
  js/data.js      pengguna, projek, status, 29 tiket dummy
  js/app.js       render, aliran status, modal, laci
docs/
  RESEARCH.md     kajian pasaran & justifikasi reka bentuk
  shots.py        skrip tangkapan skrin
```

Tiada backend. Semua state dalam memori — muat semula halaman menetapkan semula data demo.

---

## Nota reka bentuk

Rujukan visual: warm paper canvas, display uppercase berat, garis rambut (hairline), satu aksen gold, **tiada shadow**. Warna diambil dari token yang diukur, bukan diagak.

Kontras teks disahkan ≥ 4.5:1 pada kedua-dua tema (diukur melalui DOM, bukan mata).

---

Prototaip disediakan oleh: Saifullah Muhamad
