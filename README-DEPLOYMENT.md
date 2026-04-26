# Sistem Login & Dashboard Mahasiswa

Aplikasi web untuk login user dan menampilkan dashboard data mahasiswa dengan fitur search, filter, dan CRUD operations.

## Fitur Utama

- ✅ User Registration & Login
- ✅ Dashboard Data Mahasiswa
- ✅ Search & Filter Mahasiswa
- ✅ View, Edit, Delete Data
- ✅ Statistics Dashboard
- ✅ Responsive Design
- ✅ Session Management

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js + Express.js
- **Database**: In-memory (dapat diganti dengan database real)

## Instalasi Lokal

### Prerequisites
- Node.js 18+ 
- npm atau yarn

### Setup

1. Clone atau download project ini
2. Install dependencies:
```bash
npm install
```

3. Jalankan server:
```bash
npm start
```

4. Buka browser dan akses:
```
http://localhost:3000
```

## Deployment

### Opsi 1: Railway (Rekomendasi - Gratis & Mudah)

1. Buat akun di [Railway.app](https://railway.app)
2. Connect GitHub repository Anda (atau upload files)
3. Railway otomatis detect Node.js project
4. Deploy hanya dengan 1 click!
5. Dapatkan public URL secara otomatis

**Keuntungan:**
- ✅ Gratis 500 jam/bulan
- ✅ Auto-deploy ketika push ke GitHub
- ✅ Custom domain support
- ✅ Environment variables support

### Opsi 2: Render (Gratis, Permanent)

1. Buat akun di [Render.com](https://render.com)
2. Create New Web Service
3. Connect GitHub repository
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Deploy!

### Opsi 3: Vercel (Hanya untuk Frontend)

Jika ingin deploy frontend ke Vercel dan backend terpisah.

### Opsi 4: DigitalOcean App Platform

Untuk solusi yang lebih scalable dan profesional.

## Environment Variables

Untuk production, Anda bisa set environment variables:

```bash
PORT=3000          # Port aplikasi (default: 3000)
NODE_ENV=production
```

## API Endpoints

### Authentication
- `POST /api/register` - Register user baru
- `POST /api/login` - Login user
- `POST /api/check-email` - Check email availability

### Mahasiswa
- `GET /api/mahasiswa` - Get semua data mahasiswa
- `GET /api/mahasiswa/:id` - Get detail mahasiswa
- `POST /api/mahasiswa` - Add mahasiswa baru
- `PUT /api/mahasiswa/:id` - Update data mahasiswa
- `DELETE /api/mahasiswa/:id` - Delete data mahasiswa

## Struktur File

```
Proyek Login Arel/
├── server.js           # Main server file
├── Login.html          # Frontend HTML
├── script.js           # Frontend JavaScript
├── style.css           # Frontend CSS
├── package.json        # Dependencies
└── README.md           # Documentation
```

## Testing Credentials

Username: `farel.tester@mail.com`
Password: `Password123!@#`

Atau register akun baru sendiri.

## Features Demo

### 1. Login & Register
- Validasi email dan password ketat
- Password strength indicator
- Remember me functionality
- Toggle password visibility

### 2. Dashboard
- Welcome message personal
- Statistics cards (Total, Aktif, Lulus)
- Data mahasiswa dalam table
- Search by name/NIM
- Filter by status

### 3. Actions
- 👁️ View detail mahasiswa
- ✏️ Edit data (in development)
- 🗑️ Delete data

## Troubleshooting

### Port sudah digunakan
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

### Module not found
```bash
npm install
```

### CORS Error
Pastikan server sudah berjalan dan API_URL benar di script.js

## Future Improvements

- [ ] Database integration (MySQL/MongoDB)
- [ ] JWT authentication
- [ ] Email verification
- [ ] Password reset
- [ ] User roles & permissions
- [ ] Data export (PDF/Excel)
- [ ] Advanced filtering & sorting
- [ ] Real-time notifications

## License

MIT

## Author

Created by Farel | 2025

## Support

Untuk pertanyaan atau issues, silakan buat issue di repository ini.

---

**Status**: ✅ Production Ready untuk Deployment Publik!
