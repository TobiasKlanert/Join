document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll("input");
  const signupButton = document.getElementById("signUpBtn");

  function checkInputs() {
    let allFilled = true;
    inputs.forEach((input) => {
      if (input.value.trim() === "") {
        allFilled = false;
      }
    });
    signupButton.disabled = !allFilled;
  }
  inputs.forEach((input) => {
    input.addEventListener("input", checkInputs);
  });
});

const signUpPasswordInput = document.getElementById('passwordInput');
const signUpConfirmPasswordInput = document.getElementById('confirmPasswordInput');
const signUpTogglePassword = document.getElementById('togglePassword'); 
const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');

signUpPasswordInput.addEventListener('input', () => togglePasswordIcons('input', 'passwordInput', 'togglePassword'));
signUpConfirmPasswordInput.addEventListener('input', () => togglePasswordIcons('input', 'confirmPasswordInput', 'toggleConfirmPassword'));

signUpTogglePassword.addEventListener('click', () => togglePasswordIcons('click', 'passwordInput', 'togglePassword'));
toggleConfirmPassword.addEventListener('click', () => togglePasswordIcons('click', 'confirmPasswordInput', 'toggleConfirmPassword'));