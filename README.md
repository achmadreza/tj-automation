# Technical Test – Playwright Automation

**PT Transportasi Jakarta**

Automation test menggunakan **Playwright** dengan penerapan **Page Object Model (POM)**.
Kode dipisahkan ke dalam 4 bagian:

```
├── tests/       → skenario test
├── pages/       → class per halaman berisi aksi (method)
├── locators/    → selector elemen per halaman
└── data/        → data test (CSV / JSON)
```

## Test Case

| # | Modul | URL | Skenario |
|---|-------|-----|----------|
| 1 | Web Tables | https://demoqa.com/webtables | Bulk insert banyak user dari `data/users.csv`, lalu verifikasi semua user muncul di tabel |
| 2 | Droppable | https://demoqa.com/droppable | Drag and drop elemen ke area target, verifikasi teks berubah menjadi "Dropped!" |
| 3 | Resizable | https://demoqa.com/resizable | Resize elemen menjadi 400×200 px, verifikasi ukuran sesuai |
| 4 | Registration Form | https://demoqa.com/automation-practice-form | Isi & submit form Student Registration, verifikasi data di popup konfirmasi |

## Prerequisite

- Node.js ≥ 18
- npm

## Cara Menjalankan

```bash
# 1. Install dependency
npm install

# 2. Install browser Chromium untuk Playwright
npx playwright install chromium

# 3. Jalankan semua test (headless)
npm test

# 4. Jalankan dengan tampilan browser (headed) — untuk screen recording
npm run test:headed

# 5. Jalankan Test Runner UI (interaktif)
npm run test:ui
```

Jalankan test tertentu:

```bash
npx playwright test tests/bulkinsertUser.spec.ts
```

## Laporan & Video Recording

- **HTML Report**: setelah test selesai, buka `playwright-report/index.html` atau jalankan `npm run report`
- **Video recording**: setiap test merekam video otomatis (konfigurasi `video: 'on'` di `playwright.config.ts`). File video tersimpan di folder `test-results/<nama-test>/video.webm`
- **Screenshot & Trace**: tersimpan di `test-results/` jika test gagal

## Struktur File

```
tests/
  bulkinsertUser.spec.ts          → bulk insert user dari CSV
  droppable.spec.ts          → drag and drop
  resizable.spec.ts          → resize 400x200
  registrationForm.spec.ts   → submit form + verifikasi popup
pages/
  BulkInsertUserPage.ts
  DroppablePage.ts
  ResizablePage.ts
  RegistrationFormPage.ts
locators/
  insertUser.locators.ts
  droppable.locators.ts
  resizable.locators.ts
  registrationForm.locators.ts
data/
  users.csv                  → data user untuk bulk insert
  student.json               → data mahasiswa untuk registration form
```

## Catatan

- Data bulk insert diatur di `data/users.csv` (format: `firstName,lastName,email,age,salary,department`). Tambah/hapus baris untuk mengubah jumlah user.
- Data form pendaftaran diatur di `data/student.json`.
- Selector elemen berada di folder `locators/` — jika UI demoqa berubah, cukup update file di folder tersebut.
