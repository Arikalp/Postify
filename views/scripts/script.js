function toggleForm(form) {
    if (form === 'create-account') {
        document.getElementById('login-form').classList.remove('active');
        document.getElementById('create-account-form').classList.add('active');
    } else {
        document.getElementById('create-account-form').classList.remove('active');
        document.getElementById('login-form').classList.add('active');
    }
}

function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}

function validatePassword(password) {
    const regex = /[!@#$%^&*(),.?":{}|<>]/;
    return password.length >= 8 && regex.test(password);
}

function validateLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    let valid = true;

    // Clear previous errors
    document.getElementById('login-email-error').textContent = '';
    document.getElementById('login-password-error').textContent = '';

    if (!validateEmail(email)) {
        document.getElementById('login-email-error').textContent = 'Please enter a valid email.';
        valid = false;
    }

    if (!validatePassword(password)) {
        document.getElementById('login-password-error').textContent = 'Password must be at least 8 characters long and contain a special character.';
        valid = false;
    }

    if (valid) {
        alert('Login successful!');
    }
}

function validateCreateAccount() {
    const email = document.getElementById('create-email').value;
    const password = document.getElementById('create-password').value;
    const passwordConfirm = document.getElementById('create-password-confirm').value;
    let valid = true;

    // Clear previous errors
    document.getElementById('create-email-error').textContent = '';
    document.getElementById('create-password-error').textContent = '';
    document.getElementById('create-password-confirm-error').textContent = '';

    if (!validateEmail(email)) {
        document.getElementById('create-email-error').textContent = 'Please enter a valid email.';
        valid = false;
    }

    if (!validatePassword(password)) {
        document.getElementById('create-password-error').textContent = 'Password must be at least 8 characters long and contain a special character.';
        valid = false;
    }

    if (password !== passwordConfirm) {
        document.getElementById('create-password-confirm-error').textContent = 'Passwords do not match.';
        valid = false;
    }

    if (valid) {
        alert('Account created successfully!');
    }
}