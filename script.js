// Dark mode toggle
document.getElementById('darkModeToggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});
// Load dark mode preference
window.addEventListener('load', function() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
});

// Import Mahasiswa CSV
function importMahasiswaCsv(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const rows = text.split('\n').map(row => row.split(','));
        const header = rows[0].map(h => h.trim().toLowerCase());
        const nimIdx = header.indexOf('nim');
        const namaIdx = header.indexOf('nama');
        const angkatanIdx = header.findIndex(h => h.includes('angkatan'));
        let count = 0;
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (row.length < 2) continue;
            mahasiswaData.push({
                id: mahasiswaData.length + 1,
                nim: row[nimIdx],
                nama: row[namaIdx],
                program_studi: 'Teknik Informatika',
                angkatan: row[angkatanIdx] || 2026,
                status: 'Aktif',
                email: '-',
                kontak: '-',
                ipk: row[header.indexOf('ipk')] || '-'
            });
            count++;
        }
        filteredData = [...mahasiswaData];
        displayMahasiswa();
        updateStatistics();
        document.getElementById('importStatus').textContent = `✓ ${count} data diimpor!`;
        setTimeout(()=>document.getElementById('importStatus').textContent='', 4000);
    };
    reader.readAsText(file);
}
/* ===== CONFIGURATION ===== */
// Auto-detect API URL based on current environment
const getApiUrl = () => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:3000/api';
    }
    // For production, use relative path or full domain
    return `${window.location.protocol}//${window.location.host}/api`;
};

const API_URL = getApiUrl();

/* ===== DOM Elements ===== */
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginCard = document.getElementById('loginCard');
const registerCard = document.getElementById('registerCard');
const loadingSpinner = document.getElementById('loadingSpinner');

/* ===== UTILITY FUNCTIONS ===== */

// Toggle password visibility
function togglePassword(elementId) {
    const input = document.getElementById(elementId);
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
}

// Show loading spinner
function showLoader() {
    loadingSpinner.classList.add('active');
}

// Hide loading spinner
function hideLoader() {
    loadingSpinner.classList.remove('active');
}

// Clear error messages
function clearErrors(formType) {
    const errorElements = document.querySelectorAll(`#${formType}Card .error-message`);
    const errorContainers = document.querySelectorAll(`#${formType}Card .error-container`);
    
    errorElements.forEach(el => {
        el.classList.remove('show');
        el.textContent = '';
    });
    
    errorContainers.forEach(el => {
        el.classList.remove('show');
        el.textContent = '';
    });
}

// Clear success messages
function clearSuccess(formType) {
    const successElement = document.getElementById(`${formType}Success`);
    if (successElement) {
        successElement.classList.remove('show');
        successElement.textContent = '';
    }
}

// Show error message
function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.classList.add('show');
    }
}

// Show field error
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorId = fieldId.replace('Input', 'Error').replace('Email', 'Email').replace('Password', 'Password');
    
    if (field) {
        field.style.borderColor = '#d33b27';
        showError(errorId, message);
    }
}

// Show success message
function showSuccess(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.classList.add('show');
    }
}

// Switch to register form
function switchToRegister() {
    loginCard.classList.add('hidden');
    registerCard.classList.remove('hidden');
    clearErrors('login');
    clearErrors('register');
    clearSuccess('login');
    clearSuccess('register');
}

// Switch to login form
function switchToLogin() {
    registerCard.classList.add('hidden');
    loginCard.classList.remove('hidden');
    clearErrors('login');
    clearErrors('register');
    clearSuccess('login');
    clearSuccess('register');
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate password strength
function checkPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    if (strength < 2) return 'weak';
    if (strength < 4) return 'medium';
    return 'strong';
}

// Display password strength indicator
function showPasswordStrength(elementId, password) {
    const strengthElement = document.getElementById(elementId);
    
    if (!strengthElement) return;
    
    if (password.length === 0) {
        strengthElement.classList.remove('show', 'weak', 'medium', 'strong');
        return;
    }
    
    const strength = checkPasswordStrength(password);
    strengthElement.classList.add('show');
    strengthElement.classList.remove('weak', 'medium', 'strong');
    strengthElement.classList.add(strength);
}

/* ===== FORM VALIDATION ===== */

// Validate login form
function validateLoginForm() {
    clearErrors('login');
    let isValid = true;
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!email) {
        showFieldError('loginEmail', 'Email tidak boleh kosong');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showFieldError('loginEmail', 'Format email tidak valid');
        isValid = false;
    }
    
    if (!password) {
        showFieldError('loginPassword', 'Sandi tidak boleh kosong');
        isValid = false;
    } else if (password.length < 6) {
        showFieldError('loginPassword', 'Sandi minimal 6 karakter');
        isValid = false;
    }
    
    return isValid;
}

// Validate register form
function validateRegisterForm() {
    clearErrors('register');
    let isValid = true;
    
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirm = document.getElementById('registerConfirm').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    if (!name) {
        showFieldError('registerName', 'Nama tidak boleh kosong');
        isValid = false;
    } else if (name.length < 3) {
        showFieldError('registerName', 'Nama minimal 3 karakter');
        isValid = false;
    }
    
    if (!email) {
        showFieldError('registerEmail', 'Email tidak boleh kosong');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showFieldError('registerEmail', 'Format email tidak valid');
        isValid = false;
    }
    
    if (!password) {
        showFieldError('registerPassword', 'Sandi tidak boleh kosong');
        isValid = false;
    } else if (password.length < 8) {
        showFieldError('registerPassword', 'Sandi minimal 8 karakter');
        isValid = false;
    }
    
    if (password !== confirm) {
        showFieldError('registerConfirm', 'Sandi tidak sesuai');
        isValid = false;
    }
    
    if (!agreeTerms) {
        showError('registerError', 'Anda harus menyetujui ketentuan layanan');
        isValid = false;
    }
    
    return isValid;
}

/* ===== FORM SUBMISSION ===== */

// Handle login
loginForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    if (!validateLoginForm()) {
        return;
    }
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    showLoader();
    clearSuccess('login');
    clearErrors('login');
    
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showSuccess('loginSuccess', '✓ Login berhasil! Memuat data...');
            
            // Store token and user data
            if (data.token) {
                localStorage.setItem('authToken', data.token);
            }
            
            if (data.user) {
                localStorage.setItem('userData', JSON.stringify(data.user));
            }
            
            // Show dashboard after short delay
            setTimeout(() => {
                hideLoader();
                showDashboard(data.user);
            }, 1500);
        } else {
            showError('loginError', data.message || 'Login gagal');
            loginForm.classList.add('shake');
            setTimeout(() => loginForm.classList.remove('shake'), 500);
        }
    } catch (error) {
        console.error('Error:', error);
        showError('loginError', 'Terjadi kesalahan koneksi. Pastikan server berjalan di http://localhost:3000');
    } finally {
        hideLoader();
    }
});

// Handle register
registerForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    if (!validateRegisterForm()) {
        return;
    }
    
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    
    showLoader();
    clearSuccess('register');
    clearErrors('register');
    
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showSuccess('registerSuccess', '✓ Pendaftaran berhasil! Silakan login.');
            
            // Clear form
            registerForm.reset();
            
            // Switch to login after 2 seconds
            setTimeout(() => {
                switchToLogin();
            }, 2000);
        } else {
            showError('registerError', data.message || 'Pendaftaran gagal');
            registerForm.classList.add('shake');
            setTimeout(() => registerForm.classList.remove('shake'), 500);
        }
    } catch (error) {
        console.error('Error:', error);
        showError('registerError', 'Terjadi kesalahan koneksi. Pastikan server berjalan di http://localhost:3000');
    } finally {
        hideLoader();
    }
});

/* ===== REAL-TIME VALIDATION ===== */

// Email validation on blur
document.getElementById('loginEmail').addEventListener('blur', function() {
    if (this.value && !isValidEmail(this.value)) {
        showFieldError('loginEmail', 'Format email tidak valid');
    } else {
        clearErrors('login');
    }
});

document.getElementById('registerEmail').addEventListener('blur', function() {
    if (this.value && !isValidEmail(this.value)) {
        showFieldError('registerEmail', 'Format email tidak valid');
    } else {
        clearErrors('register');
    }
});

// Password strength check
document.getElementById('registerPassword').addEventListener('input', function() {
    showPasswordStrength('passwordStrength', this.value);
});

// Password confirmation check
document.getElementById('registerConfirm').addEventListener('input', function() {
    const password = document.getElementById('registerPassword').value;
    if (this.value && password !== this.value) {
        this.style.borderColor = '#d33b27';
        showError('registerConfirmError', 'Sandi tidak sesuai');
    } else {
        this.style.borderColor = 'var(--gray-medium)';
        clearErrors('register');
    }
});

// Clear red border on input focus
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('focus', function() {
        this.style.borderColor = '';
    });
});

// Check email availability on blur (optional, requires backend support)
document.getElementById('registerEmail').addEventListener('blur', async function() {
    const email = this.value.trim();
    
    if (!email || !isValidEmail(email)) return;
    
    try {
        const response = await fetch(`${API_URL}/check-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if (!data.available) {
            showFieldError('registerEmail', 'Email sudah terdaftar');
        }
    } catch (error) {
        console.log('Could not check email availability');
    }
});

/* ===== INITIALIZATION ===== */

// Remember me functionality
const rememberMeCheckbox = document.getElementById('rememberMe');
const emailInput = document.getElementById('loginEmail');

rememberMeCheckbox.addEventListener('change', function() {
    if (this.checked) {
        localStorage.setItem('rememberedEmail', emailInput.value);
    } else {
        localStorage.removeItem('rememberedEmail');
    }
});

// Load remembered email on page load
window.addEventListener('load', function() {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        emailInput.value = rememberedEmail;
        rememberMeCheckbox.checked = true;
    }
});

// Prevent form submission on Enter in password field (for better UX on register)
document.querySelectorAll('input[type="password"]').forEach(input => {
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.parentElement.parentElement.nextElementSibling?.focus() || loginForm.querySelector('button[type="submit"]').click();
        }
    });
});

console.log('✓ Authentication system loaded successfully');
console.log('API URL:', API_URL);

/* ===== DASHBOARD MAHASISWA MODULE ===== */

// State management
let mahasiswaData = [];
let filteredData = [];
let currentPage = 1;
const itemsPerPage = 10;

// Get dashboard elements
const dashboardContainer = document.getElementById('dashboardContainer');
const loginCardElement = document.getElementById('loginCard');
const registerCardElement = document.getElementById('registerCard');

// Show dashboard after successful login
function showDashboard(userData) {
    loginCardElement.classList.add('hidden');
    registerCardElement.classList.add('hidden');
    dashboardContainer.classList.remove('hidden');
    
    // Set welcome message
    const welcomeMessage = document.getElementById('welcomeMessage');
    welcomeMessage.textContent = `Selamat datang, ${userData.name}! 👋`;
    
    // Load student data
    loadMahasiswaData();
}

// Fetch mahasiswa data from server
async function loadMahasiswaData() {
    showLoader();
    
    try {
        const response = await fetch(`${API_URL}/mahasiswa`);
        const data = await response.json();
        
        if (response.ok && data.success) {
            mahasiswaData = data.data || [];
            filteredData = [...mahasiswaData];
            currentPage = 1;
            displayMahasiswa();
            updateStatistics();
        } else {
            showError('dashboardError', data.message || 'Gagal memuat data mahasiswa');
        }
    } catch (error) {
        console.error('Error loading mahasiswa data:', error);
        // Generate sample data jika server error
        generateSampleData();
    } finally {
        hideLoader();
    }
}

// Generate sample data for testing
function generateSampleData() {
    mahasiswaData = [
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
    
    filteredData = [...mahasiswaData];
    displayMahasiswa();
    updateStatistics();
    
    console.log('✓ Sample data loaded (server connection failed)');
}

// Display mahasiswa in table
function displayMahasiswa() {
    const tableBody = document.getElementById('tableBody');
    const noDataMessage = document.getElementById('noDataMessage');
    const paginationContainer = document.getElementById('paginationContainer');
    
    tableBody.innerHTML = '';
    
    if (filteredData.length === 0) {
        noDataMessage.style.display = 'block';
        paginationContainer.style.display = 'none';
        return;
    }
    
    noDataMessage.style.display = 'none';
    
    // Calculate pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filteredData.slice(startIndex, endIndex);
    
    // Render rows
    pageData.forEach((mahasiswa, index) => {
        const row = document.createElement('tr');
        const rowNumber = startIndex + index + 1;
        
        // Determine status badge style
        const statusClass = {
            'Aktif': 'status-aktif',
            'Lulus': 'status-lulus',
            'Nonaktif': 'status-nonaktif'
        }[mahasiswa.status] || '';
        
        row.innerHTML = `
            <td>${rowNumber}</td>
            <td><strong>${mahasiswa.nim}</strong></td>
            <td>${mahasiswa.nama}</td>
            <td>${mahasiswa.program_studi}</td>
            <td>${mahasiswa.angkatan}</td>
            <td><span class="status-badge ${statusClass}">${mahasiswa.status}</span></td>
            <td>${mahasiswa.email}</td>
            <td>${mahasiswa.kontak}</td>
            <td>
                <button class="btn-action btn-view" onclick="viewDetail(${mahasiswa.id})" title="Lihat Detail">👁️</button>
                <button class="btn-action btn-edit" onclick="editMahasiswa(${mahasiswa.id})" title="Edit">✏️</button>
                <button class="btn-action btn-delete" onclick="deleteMahasiswa(${mahasiswa.id})" title="Hapus">🗑️</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Update pagination
    if (totalPages > 1) {
        paginationContainer.style.display = 'flex';
        document.getElementById('pageInfo').textContent = `Halaman ${currentPage} dari ${totalPages}`;
        document.getElementById('prevBtn').disabled = currentPage === 1;
        document.getElementById('nextBtn').disabled = currentPage === totalPages;
    } else {
        paginationContainer.style.display = 'none';
    }
}

// Filter mahasiswa by search and status
function filterMahasiswa() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const filterStatus = document.getElementById('filterStatus').value;
    
    filteredData = mahasiswaData.filter(mahasiswa => {
        const matchSearch = mahasiswa.nama.toLowerCase().includes(searchInput) || 
                            mahasiswa.nim.toLowerCase().includes(searchInput);
        const matchStatus = !filterStatus || mahasiswa.status === filterStatus;
        
        return matchSearch && matchStatus;
    });
    
    currentPage = 1;
    displayMahasiswa();
    updateStatistics();
}

// Update statistics
function updateStatistics() {
    const total = filteredData.length;
    const aktif = filteredData.filter(m => m.status === 'Aktif').length;
    const lulus = filteredData.filter(m => m.status === 'Lulus').length;
    
    document.getElementById('totalStats').textContent = total;
    document.getElementById('activeStats').textContent = aktif;
    document.getElementById('graduatedStats').textContent = lulus;
}

// Pagination functions
function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        displayMahasiswa();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function nextPage() {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayMahasiswa();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Action functions
function viewDetail(id) {
    const mahasiswa = mahasiswaData.find(m => m.id === id);
    if (mahasiswa) {
        alert(`📋 Detail Mahasiswa\n\nNIM: ${mahasiswa.nim}\nNama: ${mahasiswa.nama}\nProgram Studi: ${mahasiswa.program_studi}\nAngkatan: ${mahasiswa.angkatan}\nStatus: ${mahasiswa.status}\nEmail: ${mahasiswa.email}\nKontak: ${mahasiswa.kontak}\nIPK: ${mahasiswa.ipk || 'N/A'}`);
    }
}

function editMahasiswa(id) {
    const mahasiswa = mahasiswaData.find(m => m.id === id);
    if (mahasiswa) {
        alert(`✏️ Edit Mahasiswa: ${mahasiswa.nama}\n\n(Fitur edit sedang dalam pengembangan)`);
    }
}

function deleteMahasiswa(id) {
    if (confirm('Apakah Anda yakin ingin menghapus data mahasiswa ini?')) {
        mahasiswaData = mahasiswaData.filter(m => m.id !== id);
        filterMahasiswa();
        alert('✓ Data telah dihapus');
    }
}

// Logout function
function logout() {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        dashboardContainer.classList.add('hidden');
        loginCardElement.classList.remove('hidden');
        
        // Reset form
        document.getElementById('loginForm').reset();
        clearErrors('login');
        
        showSuccess('loginSuccess', '✓ Logout berhasil');
        
        setTimeout(() => {
            clearSuccess('login');
        }, 3000);
    }
}

// Check if user is already logged in on page load
window.addEventListener('load', function() {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
        try {
            const user = JSON.parse(userData);
            showDashboard(user);
        } catch (error) {
            console.error('Error parsing user data:', error);
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
        }
    }
});
