let blockedEmails = ["test@gmail.com"];

let emailInput = document.getElementById("emailInput");
let passwordInput = document.getElementById("passwordInput");
let loginButton = document.getElementById("loginButton");
let emailError = document.getElementById("emailError");
let passwordError = document.getElementById("passwordError");
let generalError = document.getElementById("generalError");
let guestButton = document.getElementById("guestButton");


const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

loginButton.addEventListener("click",function() {

let email = emailInput.value.trim();
let password = passwordInput.value.trim();

let valid = true;

if (blockedEmails.includes(email)) {
    emailError.textContent = "Invalid email address.";
    emailError.classList.add("show");
    emailInput.classList.add("invalid");
    valid = false;
} else {
    if (!emailPattern.test(email)) {
   emailError.classList.add("show");
   emailInput.classList.add("invalid");
    valid = false;
} else {
    emailError.classList.remove("show");
    emailInput.classList.remove("invalid");
    emailInput.classList.add("valid");
    }
}


if (password === "") {
    passwordError.classList.add("show");
    passwordInput.classList.add("invalid");
    valid = false;
} else {
    passwordError.classList.remove("show");
    passwordInput.classList.remove("invalid");
    passwordInput.classList.add("valid");
}

if (valid) {
    window.location.href = "summary.html";
} else {
    generalError.textContent = "Check your email and password. Please try again.";
    generalError.classList.add("show");
    emailInput.classList.add("invalid");
    passwordInput.classList.add("invalid");
    }
});

