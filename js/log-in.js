/* let blockedEmails = ["test@gmail.com"];

let emailInput = document.getElementById("emailInput");
let passwordInput = document.getElementById("passwordInput");
let loginButton = document.getElementById("loginButton");
let emailError = document.getElementById("emailError");
let passwordError = document.getElementById("passwordError");
let generalError = document.getElementById("generalError");
let guestLoginButton = document.getElementById("guestLoginButton");

const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/; */

/* function logIn() {
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

  if (!valid) return;

  const registeredEmail = localStorage.getItem("registeredEmail");
  const registeredPassword = localStorage.getItem("registeredPassword");

  if (email === registeredEmail && password === registeredPassword) {
    localStorage.getItem("userFullName");
    window.location.href = "summary.html";
  } else {
    generalError.textContent =
      "Check your email and password. Please try again.";
    generalError.classList.add("show");
    emailInput.classList.add("invalid");
    passwordInput.classList.add("invalid");
  }
} */

/* let checkInPassword = document.getElementById("checkInPassword"); */

/* function checkPasswordImage() {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        checkInPassword.src = "../assets/img/eye-slash.png";
    } else {
        passwordInput.type = "password";
        checkInPassword.src = "../assets/img/eye-icon.png";
    }
}; */

if (window.location.pathname.includes("index.html")) {
  function runLoading() {
    let logo = document.getElementById("joinLogo");
  }

  function stopLoading() {
    let logo = document.getElementById("joinLogo");
    let joinPage = document.getElementById("joinPage");
    let loginPage = document.getElementById("loginPage");

    setTimeout(() => {
      joinPage.style.display = "none";
      loginPage.style.display = "flex";
    }, 1000);
  }
  runLoading();
  stopLoading();
}

// Event Listeners für das Eingabefeld und das Bild
const passwordInput = document.getElementById("passwordInput");
const togglePassword = document.getElementById("checkInPassword");

// Überwache die Eingabe im Feld
passwordInput.addEventListener("input", () =>
  togglePasswordIcons("input", "passwordInput", "checkInPassword")
);

// Überwache Klicks auf das Bild
togglePassword.addEventListener("click", () =>
  togglePasswordIcons("click", "passwordInput", "checkInPassword")
);

function rememberMe() {
  const checkbox = document.querySelector("#remember-me"); // Zugriff auf die Checkbox
  const emailInput = document.querySelector("#emailInput"); // Zugriff auf das Email-Input-Feld

  if (checkbox.checked) {
    // Wenn "Remember Me" aktiviert ist
    const email = emailInput.value; // Hole die aktuelle E-Mail-Adresse aus dem Input-Feld
    if (email) {
      localStorage.setItem("rememberedEmail", email); // Speichere die E-Mail im localStorage
    }
  } else {
    // Wenn "Remember Me" deaktiviert ist
    localStorage.removeItem("rememberedEmail"); // Entferne die E-Mail aus dem localStorage
  }
}

// Funktion zum Vorbefüllen des Email-Feldes bei Seitenaufruf
function populateEmailField() {
  const emailInput = document.querySelector("#emailInput"); // Zugriff auf das Email-Input-Feld
  const rememberedEmail = localStorage.getItem("rememberedEmail"); // Hole die gespeicherte E-Mail
  const checkbox = document.querySelector("#remember-me");

  if (rememberedEmail) {
    emailInput.value = rememberedEmail; // Setze die E-Mail in das Input-Feld
    checkbox.checked = true;
  }
}
