// auth.js - اسکریپت صفحات احراز هویت

document.addEventListener('DOMContentLoaded', function() {
    // نمایش/مخفی کردن رمز عبور
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault(); // جلوگیری از رفتار پیش‌فرض
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // ========== فرم ورود ==========
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const emailError = document.getElementById('emailError');
        const passwordError = document.getElementById('passwordError');
        const rememberCheck = document.getElementById('remember');

        if (auth.isLoggedIn()) {
            window.location.href = 'index.html';
        }

        function validateEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }
        function validatePassword(pwd) {
            return pwd.length >= 6;
        }

        emailInput.addEventListener('input', function() {
            if (!validateEmail(this.value)) {
                emailError.textContent = 'ایمیل معتبر وارد کنید';
                this.style.borderColor = '#e74c3c';
            } else {
                emailError.textContent = '';
                this.style.borderColor = '#ddd';
            }
        });
        passwordInput.addEventListener('input', function() {
            if (!validatePassword(this.value)) {
                passwordError.textContent = 'حداقل ۶ کاراکتر';
                this.style.borderColor = '#e74c3c';
            } else {
                passwordError.textContent = '';
                this.style.borderColor = '#ddd';
            }
        });

        const savedEmail = localStorage.getItem('remembered_email');
        const savedPass = localStorage.getItem('remembered_password');
        if (savedEmail && savedPass) {
            emailInput.value = savedEmail;
            passwordInput.value = savedPass;
            if (rememberCheck) rememberCheck.checked = true;
        }

        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = emailInput.value.trim();
            const pass = passwordInput.value;
            const remember = rememberCheck ? rememberCheck.checked : false;
            let valid = true;
            if (!validateEmail(email)) {
                emailError.textContent = 'ایمیل معتبر وارد کنید';
                emailInput.style.borderColor = '#e74c3c';
                valid = false;
            }
            if (!validatePassword(pass)) {
                passwordError.textContent = 'حداقل ۶ کاراکتر';
                passwordInput.style.borderColor = '#e74c3c';
                valid = false;
            }
            if (valid) {
                const btn = this.querySelector('button[type="submit"]');
                btn.disabled = true;
                btn.textContent = 'در حال ورود...';
                const result = auth.login(email, pass);
                setTimeout(() => {
                    if (result.success) {
                        if (remember) {
                            localStorage.setItem('remembered_email', email);
                            localStorage.setItem('remembered_password', pass);
                        } else {
                            localStorage.removeItem('remembered_email');
                            localStorage.removeItem('remembered_password');
                        }
                        alert('با موفقیت وارد شدید');
                        window.location.href = 'index.html';
                    } else {
                        alert(result.message);
                        btn.disabled = false;
                        btn.textContent = 'ورود به حساب';
                    }
                }, 1000);
            }
        });

        document.querySelectorAll('.btn-social').forEach(b => {
            b.addEventListener('click', () => alert('ورود با شبکه اجتماعی در این نسخه دمو فعال نیست'));
        });
    }

    // ========== فرم ثبت‌نام ==========
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const securityAnswerInput = document.getElementById('securityAnswer');
        const termsCheckbox = document.getElementById('terms');

        const firstNameError = document.getElementById('firstNameError');
        const lastNameError = document.getElementById('lastNameError');
        const emailError = document.getElementById('emailError');
        const passwordError = document.getElementById('passwordError');
        const confirmPasswordError = document.getElementById('confirmPasswordError');
        const securityAnswerError = document.getElementById('securityAnswerError');
        const termsError = document.getElementById('termsError');

        const strengthBar = document.getElementById('passwordStrength');
        const strengthText = document.getElementById('passwordStrengthText');

        function validateName(name) { return name.trim().length >= 2; }
        function validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
        function validatePassword(pwd) { return pwd.length >= 8; }
        function validateAnswer(ans) { return ans.trim().length > 0; }

        function checkPasswordStrength(pwd) {
            let strength = 0;
            if (pwd.length >= 8) strength++;
            if (pwd.length >= 12) strength++;
            if (/[a-z]/.test(pwd)) strength++;
            if (/[A-Z]/.test(pwd)) strength++;
            if (/\d/.test(pwd)) strength++;
            if (/[^A-Za-z0-9]/.test(pwd)) strength++;
            return strength;
        }

        function updatePasswordStrength(pwd) {
            const s = checkPasswordStrength(pwd);
            let percent = 0, label = '', color = '';
            if (pwd.length === 0) { percent = 0; label = ''; color = '#eee'; }
            else if (s <= 2) { percent = 33; label = 'ضعیف'; color = '#e74c3c'; }
            else if (s <= 4) { percent = 66; label = 'متوسط'; color = '#f39c12'; }
            else { percent = 100; label = 'قوی'; color = '#2ecc71'; }
            if (strengthBar) {
                strengthBar.style.width = percent + '%';
                strengthBar.style.backgroundColor = color;
                strengthText.textContent = label;
                strengthText.style.color = color;
            }
        }

        firstNameInput.addEventListener('input', function() {
            if (!validateName(this.value)) {
                firstNameError.textContent = 'حداقل ۲ کاراکتر';
                this.style.borderColor = '#e74c3c';
            } else {
                firstNameError.textContent = '';
                this.style.borderColor = '#ddd';
            }
        });
        lastNameInput.addEventListener('input', function() {
            if (!validateName(this.value)) {
                lastNameError.textContent = 'حداقل ۲ کاراکتر';
                this.style.borderColor = '#e74c3c';
            } else {
                lastNameError.textContent = '';
                this.style.borderColor = '#ddd';
            }
        });
        emailInput.addEventListener('input', function() {
            const email = this.value.trim();
            if (!validateEmail(email)) {
                emailError.textContent = 'ایمیل معتبر وارد کنید';
                this.style.borderColor = '#e74c3c';
            } else {
                const users = auth.getUsers();
                if (users.some(u => u.email === email)) {
                    emailError.textContent = 'این ایمیل قبلاً ثبت شده';
                    this.style.borderColor = '#e74c3c';
                } else {
                    emailError.textContent = '';
                    this.style.borderColor = '#ddd';
                }
            }
        });
        passwordInput.addEventListener('input', function() {
            updatePasswordStrength(this.value);
            if (!validatePassword(this.value)) {
                passwordError.textContent = 'حداقل ۸ کاراکتر';
                this.style.borderColor = '#e74c3c';
            } else {
                passwordError.textContent = '';
                this.style.borderColor = '#ddd';
            }
            if (confirmPasswordInput.value && this.value !== confirmPasswordInput.value) {
                confirmPasswordError.textContent = 'رمز عبور و تکرار یکسان نیستند';
                confirmPasswordInput.style.borderColor = '#e74c3c';
            } else {
                confirmPasswordError.textContent = '';
                confirmPasswordInput.style.borderColor = '#ddd';
            }
        });
        confirmPasswordInput.addEventListener('input', function() {
            if (passwordInput.value !== this.value) {
                confirmPasswordError.textContent = 'رمز عبور و تکرار یکسان نیستند';
                this.style.borderColor = '#e74c3c';
            } else {
                confirmPasswordError.textContent = '';
                this.style.borderColor = '#ddd';
            }
        });
        securityAnswerInput.addEventListener('input', function() {
            if (!validateAnswer(this.value)) {
                securityAnswerError.textContent = 'پاسخ را وارد کنید';
                this.style.borderColor = '#e74c3c';
            } else {
                securityAnswerError.textContent = '';
                this.style.borderColor = '#ddd';
            }
        });
        termsCheckbox.addEventListener('change', function() {
            termsError.textContent = this.checked ? '' : 'باید با قوانین موافقت کنید';
        });

        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const firstName = firstNameInput.value.trim();
            const lastName = lastNameInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            const securityAnswer = securityAnswerInput.value.trim();
            const terms = termsCheckbox.checked;

            let valid = true;
            if (!validateName(firstName)) { firstNameError.textContent = 'حداقل ۲ کاراکتر'; firstNameInput.style.borderColor = '#e74c3c'; valid = false; }
            if (!validateName(lastName)) { lastNameError.textContent = 'حداقل ۲ کاراکتر'; lastNameInput.style.borderColor = '#e74c3c'; valid = false; }
            if (!validateEmail(email)) { emailError.textContent = 'ایمیل معتبر وارد کنید'; emailInput.style.borderColor = '#e74c3c'; valid = false; }
            if (!validatePassword(password)) { passwordError.textContent = 'حداقل ۸ کاراکتر'; passwordInput.style.borderColor = '#e74c3c'; valid = false; }
            if (password !== confirmPassword) { confirmPasswordError.textContent = 'یکسان نیستند'; confirmPasswordInput.style.borderColor = '#e74c3c'; valid = false; }
            if (!validateAnswer(securityAnswer)) { securityAnswerError.textContent = 'پاسخ را وارد کنید'; securityAnswerInput.style.borderColor = '#e74c3c'; valid = false; }
            if (!terms) { termsError.textContent = 'باید با قوانین موافقت کنید'; valid = false; }

            if (valid) {
                const btn = this.querySelector('button[type="submit"]');
                btn.disabled = true;
                btn.textContent = 'در حال ثبت‌نام...';
                const result = auth.register({ firstName, lastName, email, password, securityAnswer });
                setTimeout(() => {
                    if (result.success) {
                        alert('ثبت‌نام با موفقیت انجام شد. اکنون وارد شوید.');
                        window.location.href = 'login.html';
                    } else {
                        alert(result.message);
                        btn.disabled = false;
                        btn.textContent = 'ایجاد حساب کاربری';
                    }
                }, 1000);
            }
        });

        document.querySelectorAll('.btn-social').forEach(b => {
            b.addEventListener('click', () => alert('ثبت‌نام با شبکه اجتماعی در این نسخه دمو فعال نیست'));
        });
    }
});