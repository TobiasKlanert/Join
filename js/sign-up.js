/* let signUpBtn = document.getElementById("signUpBtn");
function handleSignUp() {
    let nameInput = document.getElementById("addContactName");
    let emailInput = document.getElementById("emailInput");
    let passwordInput = document.getElementById("passwordInput");
    let confirmPassword = document.getElementById("confirmPasswordInput");
    let generalError = document.getElementById("generalError");
    let successMessage = document.getElementById("successMessage");
    let privacyPolicyCheckbox = document.getElementById('rememberMe');

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

    if (!privacyPolicyCheckbox.checked) {
        generalError.textContent = "You must accept the Privacy Policy.";
        generalError.classList.add("show");
        return;
    }

    if (!isValid) return;

    localStorage.setItem("registeredEmail", emailInput.value.trim());
    localStorage.setItem("registeredPassword", passwordInput.value);
    localStorage.setItem("userFullName", nameInput.value.trim());

    successMessage.classList.add("show");

    setTimeout(function () {
        successMessage.classList.remove("show");
        window.location.href = "../index.html";
    }, 2000);
}; */

/* function toggleConfirmPasswordVisibility() {
  let confirmPasswordInput = document.getElementById("confirmPasswordInput");
  let toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

  if (confirmPasswordInput.type === "password") {
    confirmPasswordInput.type = "text";
    toggleConfirmPassword.src = "../assets/img/eye-slash.png";
  } else {
    confirmPasswordInput.type = "password";
    toggleConfirmPassword.src = "../assets/img/eye-icon.png";
  }
}

function togglePasswordVisibility() {
  let passwordInput = document.getElementById("passwordInput");
  let togglePassword = document.getElementById("togglePassword");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    togglePassword.src = "../assets/img/eye-slash.png";
  } else {
    passwordInput.type = "password";
    togglePassword.src = "../assets/img/eye-icon.png";
  }
} */

document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll("input");
  const signupButton = document.getElementById("signUpBtn");

  // Funktion zum Überprüfen, ob alle Felder gefüllt sind
  function checkInputs() {
    let allFilled = true;
    inputs.forEach((input) => {
      if (input.value.trim() === "") {
        allFilled = false;
      }
    });
    signupButton.disabled = !allFilled;
  }

  // Event Listener für Eingabefelder
  inputs.forEach((input) => {
    input.addEventListener("input", checkInputs);
  });
});

function togglePasswordIcons(eventType, inputType, imgType) {
    const passwordInput = document.getElementById(inputType);
    const togglePassword = document.getElementById(imgType);

    if (eventType === 'input') {
        // Wenn das Eingabefeld nicht leer ist, zeige das Auge-Slash-Icon
        if (passwordInput.value.trim() !== '') {
            togglePassword.src = '../assets/img/eye-slash.png';
        } else {
            // Wenn das Eingabefeld leer ist, setze das Standardbild zurück
            togglePassword.src = '../assets/img/password-log-in.svg';
        }
    } else if (eventType === 'click') {
        // Wechsel zwischen Auge-Icon und Auge-Slash-Icon beim Klick
        if (togglePassword.src.includes('eye-slash.png')) {
            togglePassword.src = '../assets/img/eye-icon.png';
            passwordInput.type = 'text'; // Passwort sichtbar machen
        } else {
            togglePassword.src = '../assets/img/eye-slash.png';
            passwordInput.type = 'password'; // Passwort verbergen
        }
    }
}

// Event Listeners für das Eingabefeld und das Bild
const signUpPasswordInput = document.getElementById('passwordInput');
const signUpConfirmPasswordInput = document.getElementById('confirmPasswordInput');
const togglePassword = document.getElementById('togglePassword'); 
const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');

// Überwache die Eingabe im Feld
signUpPasswordInput.addEventListener('input', () => togglePasswordIcons('input', 'passwordInput', 'togglePassword'));
signUpConfirmPasswordInput.addEventListener('input', () => togglePasswordIcons('input', 'confirmPasswordInput', 'toggleConfirmPassword'));

// Überwache Klicks auf das Bild
togglePassword.addEventListener('click', () => togglePasswordIcons('click', 'passwordInput', 'togglePassword'));
toggleConfirmPassword.addEventListener('click', () => togglePasswordIcons('click', 'confirmPasswordInput', 'toggleConfirmPassword'));