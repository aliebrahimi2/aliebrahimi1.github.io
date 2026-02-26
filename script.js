// script.js

document.addEventListener('DOMContentLoaded', function() {
    // منوی موبایل
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        const icon = this.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.querySelector('i').classList.add('fa-bars');
            menuToggle.querySelector('i').classList.remove('fa-times');
        });
    });

    // فیلتر نمونه کارها
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filterValue = button.getAttribute('data-filter');
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // فرم تماس (ذخیره در localStorage)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = this.querySelector('input[type="text"]').value.trim();
            const email = this.querySelector('input[type="email"]').value.trim();
            const subject = this.querySelectorAll('input[type="text"]')[1].value.trim();
            const message = this.querySelector('textarea').value.trim();

            if (!name || !email || !subject || !message) {
                alert('لطفاً تمام فیلدها را پر کنید');
                return;
            }

            const messageData = {
                name,
                email,
                subject,
                message
            };

            auth.addMessage(messageData);
            alert('پیام شما با موفقیت ارسال شد!');
            this.reset();
        });
    }

    // اسکرول نرم
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // تغییر استایل نوار هنگام اسکرول
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });

    // انیمیشن اسکرول
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.skill-item, .portfolio-item, .stat-item, .contact-item');
        elements.forEach(el => {
            const elPos = el.getBoundingClientRect().top;
            const screenPos = window.innerHeight / 1.2;
            if (elPos < screenPos) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    };

    document.querySelectorAll('.skill-item, .portfolio-item, .stat-item, .contact-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    // به‌روزرسانی نوار ناوبری بر اساس وضعیت ورود
    updateNavbarAuthStatus();
});

function updateNavbarAuthStatus() {
    const navAuth = document.querySelector('.nav-auth');
    if (!navAuth) return;

    if (auth.isLoggedIn()) {
        const user = auth.getCurrentUser();
        let adminLink = '';
        if (user.role === 'admin') {
            adminLink = `<a href="admin.html" class="nav-login"><i class="fas fa-cog"></i> مدیریت</a>`;
        }
        navAuth.innerHTML = `
            <span class="user-greeting">سلام، ${user.firstName}!</span>
            <a href="account.html" class="nav-login"><i class="fas fa-user-circle"></i> حساب کاربری</a>
            ${adminLink}
            <a href="#" id="logoutBtn" class="nav-signup"><i class="fas fa-sign-out-alt"></i> خروج</a>
        `;
        document.getElementById('logoutBtn').addEventListener('click', function(e) {
            e.preventDefault();
            auth.logout();
            location.reload();
        });
    } else {
        navAuth.innerHTML = `
            <a href="login.html" class="nav-login"><i class="fas fa-sign-in-alt"></i> ورود</a>
            <a href="signup.html" class="nav-signup"><i class="fas fa-user-plus"></i> ثبت‌نام</a>
        `;
    }
}
function updateNavbarAuthStatus() {
    const navAuth = document.querySelector('.nav-auth');
    if (!navAuth) return;

    if (auth.isLoggedIn()) {
        const user = auth.getCurrentUser();
        let adminLink = '';
        if (auth.isAdmin()) { // هم ادمین عادی و هم سوپرادمین
            adminLink = `<a href="admin.html" class="nav-login"><i class="fas fa-cog"></i> مدیریت</a>`;
        }
        navAuth.innerHTML = `
            <span class="user-greeting">سلام، ${user.firstName}!</span>
            <a href="account.html" class="nav-login"><i class="fas fa-user-circle"></i> حساب کاربری</a>
            ${adminLink}
            <a href="#" id="logoutBtn" class="nav-signup"><i class="fas fa-sign-out-alt"></i> خروج</a>
        `;
        document.getElementById('logoutBtn').addEventListener('click', function(e) {
            e.preventDefault();
            auth.logout();
            location.reload();
        });
    } else {
        navAuth.innerHTML = `
            <a href="login.html" class="nav-login"><i class="fas fa-sign-in-alt"></i> ورود</a>
            <a href="signup.html" class="nav-signup"><i class="fas fa-user-plus"></i> ثبت‌نام</a>
        `;
    }
}