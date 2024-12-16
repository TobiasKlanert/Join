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

const passwordInput = document.getElementById("passwordInput");
const togglePassword = document.getElementById("checkInPassword");

passwordInput.addEventListener("input", () =>
  togglePasswordIcons("input", "passwordInput", "checkInPassword")
);

togglePassword.addEventListener("click", () =>
  togglePasswordIcons("click", "passwordInput", "checkInPassword")
);

function rememberMe() {
  const checkbox = document.querySelector("#remember-me");
  const emailInput = document.querySelector("#emailInput");

  if (checkbox.checked) {
    const email = emailInput.value;
    if (email) {
      localStorage.setItem("rememberedEmail", email);
    }
  } else {
    localStorage.removeItem("rememberedEmail");
  }
}

function populateEmailField() {
  const emailInput = document.querySelector("#emailInput");
  const rememberedEmail = localStorage.getItem("rememberedEmail");
  const checkbox = document.querySelector("#remember-me");

  if (rememberedEmail) {
    emailInput.value = rememberedEmail;
    checkbox.checked = true;
  }
}
