let signUpBtn = document.getElementById("signUpBtn");
function handleSignUp() {
    let nameInput = document.getElementById("addContactName");
    let emailInput = document.getElementById("emailInput");
    let passwordInput = document.getElementById("passwordInput");
    let confirmPassword = document.getElementById("confirmPasswordInput");
    let generalError = document.getElementById("generalError");
    let successMessage = document.getElementById("successMessage");

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const emailBlackList = ["test@gmail.com", "example@gmail.com"];
    let isValid = true;

   if (
     nameInput.value.trim() === "" ||
     emailInput.value.trim() === "" ||
     passwordInput.value.trim() === "" ||
     confirmPassword.value.trim() === ""
   ) {
    generalError.textContent = "Please fill in all fields!";
    generalError.classList.add("show");
    return;
    }

    if (nameInput.value.trim() === "") {
    nameInput.classList.add("invalid");
    isValid = false;
    } else {
        nameInput.classList.remove("invalid");
        nameInput.classList.add("valid");
    }


    if (!emailPattern.test(emailInput.value.trim())) {
        generalError.textContent = "Invalid email format.";
        generalError.classList.add("show");
        emailInput.classList.add("invalid");
        isValid = false;
        } else if (emailBlackList.includes(emailInput.value.trim().toLowerCase())) {
            generalError.textContent = "This email is not allowed for sign-up.";
            generalError.classList.add("show");
            emailInput.classList.add("invalid");
            isValid = false;
            return
        } else {
            generalError.textContent = "";
            generalError.classList.remove("show");
            emailInput.classList.remove("invalid");
            emailInput.classList.add("valid");
        }


    if (passwordInput.value.length < 8) {
    generalError.textContent = "Password must be at least 8 characters";
    generalError.classList.add("show");
    passwordInput.classList.add("invalid");
    isValid = false;
    } else {
        generalError.textContent = "";
        generalError.classList.remove("show");
        passwordInput.classList.remove("invalid");
        passwordInput.classList.add("valid");
    }

    if (passwordInput.value !== confirmPassword.value) {
        generalError.textContent = "Passwords do not match.";
        generalError.classList.add("show");
        confirmPassword.classList.add("invalid");
        isValid = false;
    } else if (passwordInput.value.lengt >= 8) {
        generalError.textContent = "";
        generalError.classList.remove("show");
        confirmPassword.classList.remove("invalid");
        confirmPassword.classList.add("valid");
    }

    if (!isValid) return;

    localStorage.setItem("registeredEmail", emailInput.value.trim());
    localStorage.setItem("registeredPassword", passwordInput.value);
    localStorage.setItem("userFullName", nameInput.value.trim());

    successMessage.classList.add("show");

    setTimeout(function () {
        successMessage.classList.remove("show");
        window.location.href = "join.html";
    }, 2000);
};

let confirmPasswordInput = document.getElementById("confirmPasswordInput");
let toggleConfirmPassword = document.getElementById("toggleConfirmPassword");
let passwordInput = document.getElementById("passwordInput");
let togglePassword = document.getElementById("togglePassword");

toggleConfirmPassword.addEventListener("click", function() {
 if (confirmPasswordInput.type === "password") {
    confirmPasswordInput.type = "text";
    toggleConfirmPassword.src = "../assets/img/eye-slash.png";
 } else {
    confirmPasswordInput.type = "password";
    toggleConfirmPassword.src = "../assets/img/eye-icon.png";
 }
});


togglePassword.addEventListener("click", function() {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePassword.src = "../assets/img/eye-slash.png";
    } else {
        passwordInput.type = "password";
        togglePassword.src = "../assets/img/eye-icon.png";
    }
});