// --- Authentication Simulation ---
const toggleModal = (id, show) => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('active', show);
};

const showGoogleAccountSelector = () => toggleModal('google-modal', true);
const openCreationModal = () => toggleModal('creation-modal', true);
const closeCreationModal = () => toggleModal('creation-modal', false);

const simulateGoogleLogin = (name, email) => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', name);
    window.location.assign('welcome.html');
};

const toggleMobileMenu = () => {
    const nav = document.getElementById('main-nav-links');
    if (nav) nav.classList.toggle('active');
};

const toggleDropdown = (e) => {
    e.preventDefault();
    const dropdown = e.target.closest('.dropdown');
    document.querySelectorAll('.dropdown').forEach(d => {
        if (d !== dropdown) d.classList.remove('active');
    });
    if (dropdown) dropdown.classList.toggle('active');
};

const handleSocialLogin = (provider) => provider === 'Google' ? showGoogleAccountSelector() : window.location.assign('welcome.html');

// --- Survey Logic ---
let surveyCount = 2;
const createNewSurvey = () => {
    const title = document.getElementById('new-survey-title').value;
    if (!title) return alert('Title required!');

    const container = document.getElementById('surveys-container');
    const card = document.createElement('div');
    card.className = 'survey-card';
    card.innerHTML = `
        <div class="survey-tag" style="background:#f1f5f9; color:#475569;">NEW</div>
        <div class="survey-title">${title}</div>
        <div class="survey-stats">📊 0 Responses</div>
    `;
    container.prepend(card);
    document.getElementById('total-surveys-count').innerText = ++surveyCount;
    document.getElementById('new-survey-title').value = '';
    closeCreationModal();
};

// --- Core Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const path = window.location.pathname.split('/').pop() || 'index.html';

    // UI Updates
    document.querySelectorAll('.auth-required').forEach(el => el.style.display = isLoggedIn ? 'block' : 'none');
    document.querySelectorAll('.guest-only').forEach(el => el.style.display = isLoggedIn ? 'none' : 'block');

    if (isLoggedIn && (path === 'login.html' || path === 'signup.html')) window.location.assign('dashboard.html');

    // Backgrounds
    const bg = document.getElementById('cinematic-bg');
    if (bg) {
        const img = new Image();
        img.src = (path === 'login.html' || path === 'signup.html')
            ? 'assets/images/auth.jpg'
            : 'assets/images/hero.jpg';
        img.className = 'bg-cinematic-img';
        img.onload = () => { img.classList.add('loaded'); bg.appendChild(img); };
    }

    // Scroll Reveal
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});

// Event Listeners
window.addEventListener('click', (e) => {
    if (e.target.id === 'google-modal') toggleModal('google-modal', false);
    if (e.target.id === 'creation-modal') toggleModal('creation-modal', false);
});

const handleLoginFormSubmit = (e, url) => {
    e.preventDefault();
    localStorage.setItem('isLoggedIn', 'true');
    window.location.assign(url);
};

const lForm = document.getElementById('login-form');
const dForm = document.getElementById('dashboard-login-form');
if (lForm) lForm.addEventListener('submit', e => handleLoginFormSubmit(e, 'dashboard.html'));
if (dForm) dForm.addEventListener('submit', e => handleLoginFormSubmit(e, 'welcome.html'));

const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    window.location.assign('index.html');
};