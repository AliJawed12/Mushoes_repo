/* account.js - Provides functionality for login and registration */

const $id = id => document.getElementById(id);

// Initialize when page loads
window.addEventListener("load", function() {
  // Login form submission
  const loginFormElement = $id("loginFormElement");
  if (loginFormElement) {
    loginFormElement.addEventListener("submit", handleLogin);
  }

  // Registration form submission
  const registerFormElement = $id("registerFormElement");
  if (registerFormElement) {
    registerFormElement.addEventListener("submit", handleRegister);
  }
});

// Switch between login and register tabs
function switchTab(tab) {
  const loginTab = $id("loginTab");
  const registerTab = $id("registerTab");
  const loginForm = $id("loginForm");
  const registerForm = $id("registerForm");

  if (tab === 'login') {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
  } else if (tab === 'register') {
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
    registerForm.classList.add('active');
    loginForm.classList.remove('active');
  }

  // Clear any error messages
  clearErrorMessages();
}

// Handle login form submission
function handleLogin(e) {
  e.preventDefault();

  // Clear previous error messages
  clearErrorMessages();

  const username = $id("login_username").value.trim();
  const password = $id("login_password").value;

  // Validation
  if (!username) {
    showError("login", "Please enter your username or email.");
    return false;
  }

  if (!password) {
    showError("login", "Please enter your password.");
    return false;
  }

  // In a real application, you would send this to a server
  console.log("Login attempt:", { username, password: "***" });

  // Simulate successful login
  alert("Login successful! Welcome back, " + username + "!");
  
  // In a real app, you would redirect to a dashboard or home page
  // window.location.href = "dashboard.html";

  return true;
}

// Handle registration form submission
function handleRegister(e) {
  e.preventDefault();

  // Clear previous error messages
  clearErrorMessages();

  const username = $id("register_username").value.trim();
  const email = $id("register_email").value.trim();
  const password = $id("register_password").value;
  const confirmPassword = $id("register_confirm_password").value;

  // Validation
  if (!username) {
    showError("register", "Please enter a username.");
    return false;
  }

  if (username.length < 3) {
    showError("register", "Username must be at least 3 characters long.");
    return false;
  }

  if (!email) {
    showError("register", "Please enter an email address.");
    return false;
  }

  if (!validateEmail(email)) {
    showError("register", "Please enter a valid email address.");
    return false;
  }

  if (!password) {
    showError("register", "Please enter a password.");
    return false;
  }

  if (password.length < 6) {
    showError("register", "Password must be at least 6 characters long.");
    return false;
  }

  if (password !== confirmPassword) {
    showError("register", "Passwords do not match.");
    return false;
  }

  // In a real application, you would send this to a server
  console.log("Registration attempt:", { username, email, password: "***" });

  // Simulate successful registration - show confirmation
  showConfirmation(username);

  return true;
}

// Show confirmation page after successful registration
function showConfirmation(username) {
  const authContainer = $id("authContainer");
  const confirmationContainer = $id("confirmationContainer");
  const confirmedUsername = $id("confirmedUsername");

  // Hide auth forms
  authContainer.style.display = "none";

  // Show confirmation
  confirmationContainer.style.display = "block";
  confirmedUsername.textContent = username;
}

// Go back to login from confirmation
function backToLogin() {
  const authContainer = $id("authContainer");
  const confirmationContainer = $id("confirmationContainer");

  // Show auth forms
  authContainer.style.display = "block";

  // Hide confirmation
  confirmationContainer.style.display = "none";

  // Switch to login tab
  switchTab('login');

  // Reset registration form
  $id("registerFormElement").reset();
}

// Show error message
function showError(formType, message) {
  const formWrapper = formType === 'login' ? $id("loginForm") : $id("registerForm");
  
  // Check if error message already exists
  let errorDiv = formWrapper.querySelector('.error-message');
  
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    // Insert before the form
    const form = formWrapper.querySelector('form');
    formWrapper.insertBefore(errorDiv, form);
  }
  
  errorDiv.textContent = message;
}

// Clear all error messages
function clearErrorMessages() {
  const errorMessages = document.querySelectorAll('.error-message');
  errorMessages.forEach(msg => msg.remove());
}

// Validate email format
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
