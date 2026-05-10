document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initScrollHeader();
    checkAuthGating();
    renderFeed();
});

function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}

function initScrollHeader() {
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

// Authentication & Gating
function register(name, email, password) {
    let accounts = JSON.parse(localStorage.getItem('diz_accounts')) || [];
    if (accounts.some(acc => acc.email === email)) {
        alert("An account already exists with this email address.");
        return false;
    }
    const newUser = { name, email, password, tier: 'NONE' };
    accounts.push(newUser);
    localStorage.setItem('diz_accounts', JSON.stringify(accounts));
    
    // Auto login
    localStorage.setItem('diz_user', JSON.stringify(newUser));
    window.location.href = 'pricing.html';
    return true;
}

function login(email, password, redirectUrl = 'dashboard.html') {
    if (email === 'dizadmin') {
        if (password === 'dizadmin') {
            const adminUser = { email: email, tier: 'ADMIN', name: 'Diz Master' };
            localStorage.setItem('diz_user', JSON.stringify(adminUser));
            window.location.href = 'admin-dash.html';
            return true;
        } else {
            alert('Invalid admin credentials.');
            return false;
        }
    }

    let accounts = JSON.parse(localStorage.getItem('diz_accounts')) || [];
    const foundUser = accounts.find(acc => acc.email === email && acc.password === password);
    
    if (foundUser) {
        localStorage.setItem('diz_user', JSON.stringify(foundUser));
        window.location.href = redirectUrl;
        return true;
    } else {
        alert('Invalid email or password. Please try again or create an account.');
        return false;
    }
}

function logout() {
    localStorage.removeItem('diz_user');
    window.location.href = 'index.html';
}

function checkAuthGating() {
    const lockOverlay = document.getElementById('lock-overlay');
    const mainDash = document.getElementById('dash-main-content');
    const userBadge = document.getElementById('user-tier-badge');
    
    if (lockOverlay && mainDash) {
        const user = JSON.parse(localStorage.getItem('diz_user'));
        
        if (!user || user.tier === 'NONE') {
            // Locked
            lockOverlay.classList.remove('hidden');
            mainDash.classList.add('dashboard-locked');
            if (userBadge) userBadge.textContent = 'GUEST';
        } else {
            // Unlocked
            lockOverlay.classList.add('hidden');
            mainDash.classList.remove('dashboard-locked');
            if (userBadge) userBadge.textContent = user.tier + ' MEMBER';
        }
    }
}

function upgradeUser(newTier) {
    const user = JSON.parse(localStorage.getItem('diz_user'));
    if (user) {
        user.tier = newTier.toUpperCase();
        localStorage.setItem('diz_user', JSON.stringify(user));
        
        // Update in DB
        let accounts = JSON.parse(localStorage.getItem('diz_accounts')) || [];
        const accIndex = accounts.findIndex(acc => acc.email === user.email);
        if (accIndex > -1) {
            accounts[accIndex].tier = user.tier;
            localStorage.setItem('diz_accounts', JSON.stringify(accounts));
        }
    }
}

// Mock Data Render
function renderFeed() {
    const feedContainer = document.getElementById('tips-feed');
    if (!feedContainer) return;

    const tips = [
        {
            sport: 'Football',
            time: 'Today, 19:45',
            title: 'Champions League: Real Madrid vs Man City',
            content: 'Incredible value on Over 2.5 goals here. Both teams have leaky defenses in transition but lethal attacks. Max play.',
            decimal: '1.85',
            fraction: '17/20',
            stake: '5'
        },
        {
            sport: 'Racing',
            time: 'Today, 14:30',
            title: 'Cheltenham: Gold Cup - Galopin Des Champs',
            content: 'The ground suits perfectly. Field looks weaker than last year. Sticking to the favorite for a solid return.',
            decimal: '2.50',
            fraction: '6/4',
            stake: '2'
        }
    ];

    feedContainer.innerHTML = '';
    tips.forEach(tip => {
        feedContainer.innerHTML += `
            <div class="tip-card">
                <div class="tip-header">
                    <span>${tip.sport} • ${tip.time}</span>
                    <span class="gold-text">ELITE</span>
                </div>
                <h3 class="tip-title">${tip.title}</h3>
                <p>${tip.content}</p>
                <div class="tip-odds">
                    <div>
                        <div style="font-size:0.8rem; opacity:0.8">Decimal</div>
                        <div class="odds-val">${tip.decimal}</div>
                    </div>
                    <div>
                        <div style="font-size:0.8rem; opacity:0.8">Fractional</div>
                        <div class="odds-val">${tip.fraction}</div>
                    </div>
                    <div>
                        <div style="font-size:0.8rem; opacity:0.8">Stake</div>
                        <div class="odds-val">${tip.stake}u</div>
                    </div>
                </div>
            </div>
        `;
    });
}
