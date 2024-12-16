const passwordInput = document.getElementById("passwordInput");
const togglePassword = document.getElementById("checkInPassword");

passwordInput.addEventListener("input", () =>
  togglePasswordIcons("input", "passwordInput", "checkInPassword")
);

togglePassword.addEventListener("click", () =>
  togglePasswordIcons("click", "passwordInput", "checkInPassword")
);

if (window.location.pathname.includes("index.html")) {
  /**
   * Executes the initial loading logic for the page.
   * This function targets the logo element on the page with ID "joinLogo".
   */
  function runLoading() {
    let logo = document.getElementById("joinLogo");
  }

  /**
   * Stops the loading process and transitions from the "join" page to the login page.
   * This function hides the element with ID "joinPage" and displays the element with ID "loginPage" after a 1-second delay.
   */
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

/**
 * Saves the user's email to local storage if the "remember me" checkbox is checked.
 * Removes the email from local storage if the checkbox is unchecked.
 */
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

/**
 * Populates the email input field with the saved email from local storage if available.
 * Checks the "remember me" checkbox if an email is remembered.
 */
function populateEmailField() {
  const emailInput = document.querySelector("#emailInput");
  const rememberedEmail = localStorage.getItem("rememberedEmail");
  const checkbox = document.querySelector("#remember-me");

  if (rememberedEmail) {
    emailInput.value = rememberedEmail;
    checkbox.checked = true;
  }
}
