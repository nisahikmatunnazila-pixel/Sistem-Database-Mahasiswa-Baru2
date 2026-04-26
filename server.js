// ===== IMPORT LIBRARIES =====
const express = require('express');
const cors = require('cors');
const path = require('path');

// ===== INITIALIZATION =====
const app = express();
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.dirname(__filename)));

// ===== SIMULATED DATABASE =====
// Dalam dunia nyata, ini akan diganti dengan MySQL/PostgreSQL/MongoDB
const users = [
    {
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'hashed_password_123', // Simulasi hashed password
        createdAt: new Date()
    }
];

// Simulated mahasiswa database
const mahasiswa = [
    {
        id: 1,
        nim: '2021001',
        nama: 'Aidil Pratama',
        program_studi: 'Teknik Informatika',
        angkatan: 2021,
        status: 'Aktif',
        email: 'aidil@students.edu',
        kontak: '08123456789',
        ipk: 3.75
    },
    {
        id: 2,
        nim: '2021002',
        nama: 'Budi Santoso',
        program_studi: 'Sistem Informasi',
        angkatan: 2021,
        status: 'Aktif',
        email: 'budi@students.edu',
        kontak: '08234567890',
        ipk: 3.45
    },
    {
        id: 3,
        nim: '2021003',
        nama: 'Citra Dewi',
        program_studi: 'Teknik Informatika',
        angkatan: 2021,
        status: 'Aktif',
        email: 'citra@students.edu',
        kontak: '08345678901',
        ipk: 3.85
    },
    {
        id: 4,
        nim: '2020001',
        nama: 'Doni Setiawan',
        program_studi: 'Sistem Informasi',
        angkatan: 2020,
        status: 'Lulus',
        email: 'doni@students.edu',
        kontak: '08456789012',
        ipk: 3.65
    },
    {
        id: 5,
        nim: '2020002',
        nama: 'Eka Putri',
        program_studi: 'Teknik Informatika',
        angkatan: 2020,
        status: 'Lulus',
        email: 'eka@students.edu',
        kontak: '08567890123',
        ipk: 3.55
    },
    {
        id: 6,
        nim: '2022001',
        nama: 'Farel Ilyasa',
        program_studi: 'Teknik Informatika',
        angkatan: 2022,
        status: 'Aktif',
        email: 'farel@students.edu',
        kontak: '08678901234',
        ipk: 3.70
    },
    {
        id: 7,
        nim: '2022002',
        nama: 'Gina Wijaya',
        program_studi: 'Sistem Informasi',
        angkatan: 2022,
        status: 'Aktif',
        email: 'gina@students.edu',
        kontak: '08789012345',
        ipk: 3.50
    },
    {
        id: 8,
        nim: '2021004',
        nama: 'Hendra Kusuma',
        program_studi: 'Teknik Informatika',
        angkatan: 2021,
        status: 'Nonaktif',
        email: 'hendra@students.edu',
        kontak: '08890123456',
        ipk: 2.80
    }
];

let nextUserId = 2;

// ===== UTILITY FUNCTIONS =====

// Simple password hasher (UNTUK SIMULASI SAJA!)
// Di dunia nyata, gunakan bcrypt atau argon2
function hashPassword(password) {
    // Simulasi hashing dengan base64 + salt
    const salt = 'farel_secret_salt_2025';
    return Buffer.from(password + salt).toString('base64');
}

// Verify password
function verifyPassword(password, hash) {
    return hashPassword(password) === hash;
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Find user by email
function findUserByEmail(email) {
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
}

// ===== ROUTES =====

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server running', timestamp: new Date() });
});

// Register endpoint
app.post('/api/register', (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Semua field harus diisi'
            });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Format email tidak valid'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Sandi minimal 8 karakter'
            });
        }

        // Check if email already exists
        if (findUserByEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Email sudah terdaftar'
            });
        }

        // Create new user
        const newUser = {
            id: nextUserId++,
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashPassword(password),
            createdAt: new Date()
        };

        users.push(newUser);

        console.log(`✓ User baru terdaftar: ${newUser.email}`);
        console.log(`  Database sekarang memiliki ${users.length} user`);

        res.status(201).json({
            success: true,
            message: 'Pendaftaran berhasil! Silakan login.',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server'
        });
    }
});

// Login endpoint
app.post('/api/login', (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email dan sandi harus diisi'
            });
        }

        // Find user
        const user = findUserByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email atau sandi salah'
            });
        }

        // Verify password
        if (!verifyPassword(password, user.password)) {
            return res.status(401).json({
                success: false,
                message: 'Email atau sandi salah'
            });
        }

        // Simulasi token (dalam dunia nyata gunakan JWT)
        const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

        console.log(`✓ Login berhasil: ${user.email}`);

        res.json({
            success: true,
            message: 'Login berhasil',
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server'
        });
    }
});

// Check email availability
app.post('/api/check-email', (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email harus diisi'
            });
        }

        const userExists = findUserByEmail(email);

        res.json({
            available: !userExists,
            message: userExists ? 'Email sudah terdaftar' : 'Email tersedia'
        });

    } catch (error) {
        console.error('Error checking email:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server'
        });
    }
});

// Get all users (development only)
app.get('/api/users', (req, res) => {
    res.json({
        totalUsers: users.length,
        users: users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
        }))
    });
});

// Get all mahasiswa with filtering support
app.get('/api/mahasiswa', (req, res) => {
    try {
        const { status, nim, nama } = req.query;
        
        let filteredMahasiswa = [...mahasiswa];
        
        // Apply filters
        if (status) {
            filteredMahasiswa = filteredMahasiswa.filter(m => m.status === status);
        }
        
        if (nim) {
            filteredMahasiswa = filteredMahasiswa.filter(m => 
                m.nim.toLowerCase().includes(nim.toLowerCase())
            );
        }
        
        if (nama) {
            filteredMahasiswa = filteredMahasiswa.filter(m => 
                m.nama.toLowerCase().includes(nama.toLowerCase())
            );
        }
        
        res.json({
            success: true,
            data: filteredMahasiswa,
            total: filteredMahasiswa.length
        });
        
    } catch (error) {
        console.error('Error fetching mahasiswa:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server'
        });
    }
});

// Get single mahasiswa by ID
app.get('/api/mahasiswa/:id', (req, res) => {
    try {
        const { id } = req.params;
        const mhs = mahasiswa.find(m => m.id === parseInt(id));
        
        if (!mhs) {
            return res.status(404).json({
                success: false,
                message: 'Data mahasiswa tidak ditemukan'
            });
        }
        
        res.json({
            success: true,
            data: mhs
        });
        
    } catch (error) {
        console.error('Error fetching mahasiswa:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server'
        });
    }
});

// Add new mahasiswa
app.post('/api/mahasiswa', (req, res) => {
    try {
        const { nim, nama, program_studi, angkatan, status, email, kontak, ipk } = req.body;
        
        // Validation
        if (!nim || !nama) {
            return res.status(400).json({
                success: false,
                message: 'NIM dan nama harus diisi'
            });
        }
        
        // Check if NIM already exists
        if (mahasiswa.find(m => m.nim === nim)) {
            return res.status(400).json({
                success: false,
                message: 'NIM sudah terdaftar'
            });
        }
        
        const newMahasiswa = {
            id: mahasiswa.length > 0 ? Math.max(...mahasiswa.map(m => m.id)) + 1 : 1,
            nim: nim.trim(),
            nama: nama.trim(),
            program_studi: program_studi || 'Tidak ditentukan',
            angkatan: angkatan || new Date().getFullYear(),
            status: status || 'Aktif',
            email: email || '',
            kontak: kontak || '',
            ipk: ipk || 0
        };
        
        mahasiswa.push(newMahasiswa);
        
        res.status(201).json({
            success: true,
            message: 'Data mahasiswa berhasil ditambahkan',
            data: newMahasiswa
        });
        
    } catch (error) {
        console.error('Error adding mahasiswa:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server'
        });
    }
});

// Update mahasiswa
app.put('/api/mahasiswa/:id', (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const index = mahasiswa.findIndex(m => m.id === parseInt(id));
        
        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Data mahasiswa tidak ditemukan'
            });
        }
        
        mahasiswa[index] = { ...mahasiswa[index], ...updateData, id: parseInt(id) };
        
        res.json({
            success: true,
            message: 'Data mahasiswa berhasil diperbarui',
            data: mahasiswa[index]
        });
        
    } catch (error) {
        console.error('Error updating mahasiswa:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server'
        });
    }
});

// Delete mahasiswa
app.delete('/api/mahasiswa/:id', (req, res) => {
    try {
        const { id } = req.params;
        const index = mahasiswa.findIndex(m => m.id === parseInt(id));
        
        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Data mahasiswa tidak ditemukan'
            });
        }
        
        const deletedMahasiswa = mahasiswa.splice(index, 1);
        
        res.json({
            success: true,
            message: 'Data mahasiswa berhasil dihapus',
            data: deletedMahasiswa[0]
        });
        
    } catch (error) {
        console.error('Error deleting mahasiswa:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server'
        });
    }
});

// Serve HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Login.html'));
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint tidak ditemukan'
    });
});

// ===== ERROR HANDLER =====
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan server'
    });
});

// ===== START SERVER =====
app.listen(PORT, () => {
    console.log('\n╔════════════════════════════════════════════════════╗');
    console.log('║     🚀 AUTH SERVER BERJALAN DENGAN SUKSES 🚀      ║');
    console.log('╠════════════════════════════════════════════════════╣');
    console.log(`║  URL: http://localhost:${PORT}                    ║`);
    console.log('║  API: http://localhost:3000/api/                 ║');
    console.log('║  Health: http://localhost:3000/api/health        ║');
    console.log('║  Users: http://localhost:3000/api/users          ║');
    console.log('║  Mahasiswa: http://localhost:3000/api/mahasiswa  ║');
    console.log('╚════════════════════════════════════════════════════╝\n');
    console.log('📊 Features Available:');
    console.log('   ✓ User Login & Register');
    console.log('   ✓ Dashboard dengan Data Mahasiswa');
    console.log('   ✓ Filter & Search Mahasiswa');
    console.log('   ✓ CRUD Operations Mahasiswa\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n✓ Server dihentikan');
    process.exit(0);
});