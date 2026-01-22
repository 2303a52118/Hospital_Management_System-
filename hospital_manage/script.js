// ============================================
// 0. UTILITY FUNCTIONS (Toast Notifications)
// ============================================

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    
    // Fallback to alert if no toast container exists in HTML
    if (!container) {
        alert(message);
        return;
    }

    const toast = document.createElement('div');
    const icon = type === 'success' ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-exclamation-circle"></i>';
    
    toast.className = `toast ${type}`;
    toast.innerHTML = `${icon} <span>${message}</span>`;
    
    container.appendChild(toast);
    
    // Trigger Animation
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (container.contains(toast)) container.removeChild(toast);
        }, 600);
    }, 3000);
}

// ============================================
// 1. THEME & UI LOGIC (Dark Mode, Sidebar, etc.)
// ============================================

// --- Dark Mode Logic ---
const themeToggle = document.getElementById('theme-toggle');
const themeToggleDash = document.getElementById('theme-toggle-dash');
const body = document.body;

// Check Local Storage
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    body.setAttribute('data-theme', currentTheme);
    updateIcons(currentTheme);
}

// Toggle Function
function toggleTheme() {
    const isDark = body.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateIcons(newTheme);
}

function updateIcons(theme) {
    const iconClass = theme === 'dark' ? 'fa-sun' : 'fa-moon';
    if(themeToggle) themeToggle.querySelector('i').className = `fas ${iconClass}`;
    if(themeToggleDash) themeToggleDash.querySelector('i').className = `fas ${iconClass}`;
}

if(themeToggle) themeToggle.addEventListener('click', toggleTheme);
if(themeToggleDash) themeToggleDash.addEventListener('click', toggleTheme);

// --- Dashboard Sidebar Toggle ---
const toggleSidebarBtn = document.querySelector('.toggle-sidebar');
const sidebar = document.querySelector('.sidebar');

if(toggleSidebarBtn && sidebar) {
    toggleSidebarBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        // Desktop margin adjustment
        if(window.innerWidth > 768) {
            const mainContent = document.querySelector('.main-content');
            if(sidebar.style.left === '-250px') {
                sidebar.style.left = '0';
                mainContent.style.marginLeft = '280px';
            } else {
                sidebar.style.left = '-250px';
                mainContent.style.marginLeft = '0';
            }
        }
    });
}

// --- Landing Page Mobile Menu & Sticky Header ---
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const header = document.querySelector('#header');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        hamburger.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (navLinks.classList.contains('open')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = '#ffffff';
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = 'none'; // Or default styling
        }
    });
}


// --- Landing Page Logic (Counters) ---
const counters = document.querySelectorAll('.counter');
if(counters.length > 0) {
    // Only animate if element is in view (Simple Intersection Observer)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                const counter = entry.target;
                counter.innerText = '0';
                const updateCounter = () => {
                    const target = +counter.getAttribute('data-target');
                    const c = +counter.innerText;
                    const increment = target / 100;

                    if(c < target) {
                        counter.innerText = `${Math.ceil(c + increment)}`;
                        setTimeout(updateCounter, 20);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCounter();
                observer.unobserve(counter); // Run once
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

// ============================================
// 2. AUTHENTICATION LOGIC (Real Backend Connection)
// ============================================

const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // UI Feedback
        const btn = loginForm.querySelector('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
        btn.disabled = true;
        btn.style.opacity = '0.7';

        try {
            const res = await fetch('http://localhost:5002/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                showToast('Login Successful!', 'success');
                
                // Save Token & User Info
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // Redirect based on Role
                setTimeout(() => {
                    const role = data.user.role;
                    if (role === 'admin') window.location.href = 'admin-dashboard.html';
                    else if (role === 'doctor') window.location.href = 'doctor-dashboard.html';
                    else if (role === 'patient') window.location.href = 'patient-dashboard.html';
                    else window.location.href = 'index.html';
                }, 1000);

            } else {
                showToast(data.message || 'Login failed. Check credentials.', 'error');
            }

        } catch (error) {
            console.error('Login Error:', error);
            showToast('Cannot connect to server.', 'error');
        } finally {
            if (!loginForm.querySelector('.toast.success')) {
                btn.innerHTML = originalText;
                btn.disabled = false;
                btn.style.opacity = '1';
            }
        }
    });
}

// --- Logout Function ---
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showToast('Logged out successfully', 'success');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
}

// ============================================
// 3. REGISTRATION LOGIC
// ============================================

const registerForm = document.getElementById('registerForm');

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const role = document.getElementById('reg-role').value;

        const btn = registerForm.querySelector('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
        btn.disabled = true;

        try {
            const res = await fetch('http://localhost:5002/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role })
            });

            const data = await res.json();

            if (res.ok) {
                showToast('Registration Successful! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            } else {
                showToast(data.message || 'Registration failed.', 'error');
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('Error connecting to server.', 'error');
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    });
}

// ============================================
// 4. ADD DOCTOR LOGIC
// ============================================

const addDoctorForm = document.getElementById('addDoctorForm');

if (addDoctorForm) {
    addDoctorForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            showToast("You are not logged in!", 'error');
            setTimeout(() => window.location.href = 'login.html', 1500);
            return;
        }

        // Collect Data
        const doctorData = {
            name: document.getElementById('doc-name').value,
            specialization: document.getElementById('doc-spec').value,
            email: document.getElementById('doc-email').value,
            password: document.getElementById('doc-password') ? document.getElementById('doc-password').value : '123456', // Default or form input
            phone: document.getElementById('doc-phone').value,
            experience: document.getElementById('doc-exp').value
        };

        const btn = addDoctorForm.querySelector('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

        try {
            const res = await fetch('http://localhost:5002/api/doctors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(doctorData)
            });

            const data = await res.json();

            if (res.ok) {
                showToast('Doctor Added Successfully!', 'success');
                addDoctorForm.reset();
                setTimeout(() => window.location.href = 'admin-dashboard.html', 1500);
            } else {
                showToast('Error: ' + (data.message || 'Could not save doctor'), 'error');
            }

        } catch (error) {
            console.error(error);
            showToast('Server connection failed.', 'error');
        } finally {
            btn.innerHTML = originalText;
        }
    });
}

// ============================================
// 5. BOOK APPOINTMENT LOGIC
// ============================================

const bookAppForm = document.getElementById('bookAppointmentForm');
const doctorSelect = document.getElementById('doctorSelect');

// Helper: Populate Doctor Dropdown
async function populateDoctors() {
    if (!doctorSelect) return;

    try {
        const res = await fetch('http://localhost:5002/api/doctors');
        const data = await res.json();

        if (data.success && data.data) {
            doctorSelect.innerHTML = '<option value="" disabled selected>Select a Doctor</option>';
            data.data.forEach(doc => {
                const option = document.createElement('option');
                option.value = doc._id;
                option.text = `Dr. ${doc.name} (${doc.specialization})`;
                doctorSelect.appendChild(option);
            });
        }
    } catch (err) {
        console.error("Failed to load doctors", err);
    }
}

// Call on load if the dropdown exists
if (doctorSelect) {
    populateDoctors();
}

if (bookAppForm) {
    bookAppForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));

        if (!token) {
            showToast('Please login first', 'error');
            setTimeout(() => window.location.href = 'login.html', 1500);
            return;
        }

        const appointmentData = {
            patient: user.id || user._id, 
            doctor: doctorSelect.value,
            appointmentDate: document.getElementById('app-date').value,
            reason: document.getElementById('app-reason') ? document.getElementById('app-reason').value : 'Checkup'
        };

        const btn = bookAppForm.querySelector('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';

        try {
            const res = await fetch('http://localhost:5002/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(appointmentData)
            });

            const data = await res.json();

            if (res.ok) {
                showToast('Appointment Booked Successfully!', 'success');
                bookAppForm.reset();
                // Optional: Redirect or refresh list
            } else {
                showToast(data.message || 'Booking failed', 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('Server error', 'error');
        } finally {
            btn.innerHTML = originalText;
        }
    });
}