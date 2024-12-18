/**
 * Saves the given data to the local storage. The data object contains tasks, contacts, name, and email properties.
 *
 * @param {Object} data - The data to be saved in the local storage.
 */
export function saveDataToLocalStorage(data) {
  if (data.tasks) {
    localStorage.setItem("tasks", JSON.stringify(data.tasks));
  }
  if (data.contacts) {
    localStorage.setItem("contacts", JSON.stringify(data.contacts));
  }
  if (data.name) {
    localStorage.setItem("name", data.name);
  }
  if (data.name) {
    localStorage.setItem("email", data.email);
  }
}

/**
 * Loads tasks and contacts data from the local storage and ensures they are arrays.
 * If no data is found, initializes empty arrays for both.
 *
 * @throws {Error} - If an error occurs during loading from localStorage, initializes tasks and contacts as empty arrays.
 */
export function loadDataFromLocalStorage() {
  try {
    const tasksData = localStorage.getItem("tasks");
    const contactsData = localStorage.getItem("contacts");

    tasks = tasksData ? JSON.parse(tasksData) : [];
    contacts = contactsData ? JSON.parse(contactsData) : [];

    if (!Array.isArray(tasks)) {
      tasks = [];
    }

    if (!Array.isArray(contacts)) {
      contacts = [];
    }
  } catch (error) {
    console.error("Error loading data from the localStorage: ", error);
    tasks = [];
    contacts = [];
  }
}

/**
 * Ensures that the user data object contains an array for the "tasks" property.
 * For each task in the "tasks" array, ensures it contains "assignedTo" and "subtasks" properties as arrays.
 *
 * @param {Object} userData - The user data object to modify.
 * @param {Array} userData.tasks - The list of tasks in the user data.
 */
export function addArray(userData) {
  if (!userData.hasOwnProperty("tasks")) {
    userData["tasks"] = [];
  }
  for (let index = 0; index < userData.tasks.length; index++) {
    const task = userData.tasks[index];
    if (!task.hasOwnProperty("assignedTo")) {
      task["assignedTo"] = [];
    }
    if (!task.hasOwnProperty("subtasks")) {
      task["subtasks"] = [];
    }
  }
}

/**
 * Displays an error message in the specified element.
 * 
 * @param {HTMLElement} errorMessageElement - The error message element.
 * @param {string} message - The message to display.
 */
export function displayErrorMessage(errorMessageElement, message) {
  errorMessageElement.textContent = message;
  errorMessageElement.style.visibility = "visible";
}

/**
 * Removes the 'invalid' class from input elements.
 */
export function removeInvalidClass() {
  const invalidElements = document.querySelectorAll(".invalid");
  invalidElements.forEach((element) => {
    element.classList.remove("invalid");
  });
}

/**
 * Displays a success message and redirects the user after sign-up.
 */
export function displaySuccessAndRedirect() {
  const successMessage = document.getElementById("successMessage");
  successMessage.classList.add("show");
  setTimeout(() => {
    successMessage.classList.remove("show");
    window.location.href = "../index.html";
  }, 2000);
}

/**
 * Validates email and password inputs.
 * 
 * @param {string} email - The email input value.
 * @param {string} password - The password input value.
 * @param {HTMLElement} errorMessageElement - The error message element.
 * @throws Will display an error and return if validation fails.
 */
export function validateEmailAndPassword(email, password, errorMessageElement) {
  removeInvalidClass();
  if (!email || !password) {
    displayErrorMessage(
      errorMessageElement,
      "Please fill in both email and password."
    );
    if (!email) document.getElementById("emailInput").classList.add("invalid");
    if (!password)
      document.getElementById("passwordInput").classList.add("invalid");
    throw new Error("Validation failed");
  }
}

/**
 * Handles errors during the sign-up process.
 * 
 * @param {Object} error - Error object.
 */
export function handleSignUpError(error) {
  const errorMessage = document.getElementById("generalError");
  if (error.code === "auth/email-already-in-use") {
    displayErrorMessage(
      errorMessage,
      "This email address is already in use. Please log in."
    );
  } else {
    displayErrorMessage(
      errorMessage,
      error.message || "An error occurred during registration."
    );
  }
  errorMessage.style.visibility = "visible";
}

/**
 * Validates the sign-up form input fields.
 * 
 * @param {string} name - User name.
 * @param {string} email - User email.
 * @param {string} password - User password.
 * @param {string} confirmPassword - Confirmation of password.
 * @param {Object} privacyPolicyCheckbox - Privacy policy checkbox element.
 * @throws Will throw an error if validation fails.
 */
export function validateSignUpForm(
  password,
  confirmPassword,
  privacyPolicyCheckbox
) {
  validatePasswordMatch(password, confirmPassword);
  validatePasswordLength(password);
  validatePrivacyPolicy(privacyPolicyCheckbox);
}

/**
 * Validates the email format.
 * 
 * @param {string} email - User email.
 * @throws Will throw an error if the email format is invalid.
 */
export function validateEmailFormat(email) {
  const errorMessage = document.getElementById("generalError");
  if (!/\S+@\S+\.\S+/.test(email)) {
    displayErrorMessage(errorMessage, "Please enter a valid email address.");
    emailInput.classList.add("invalid");
    throw new Error("Validation failed: Please enter a valid email address.");
  }
}

/**
 * Retrieves values from the sign-up form fields.
 * 
 * @returns {Object} Form field values.
 */
export function getSignUpFormValues() {
    return {
      name: document.getElementById("addContactName").value.trim(),
      email: document.getElementById("emailInput").value.trim(),
      password: document.getElementById("passwordInput").value.trim(),
      confirmPassword: document
        .getElementById("confirmPasswordInput")
        .value.trim(),
      privacyPolicyCheckbox: document.getElementById("rememberMe"),
    };
  }

/**
 * Creates the contacts array for a new user.
 * 
 * @param {string} name - User name.
 * @param {string} email - User email.
 * @returns {Array} Array of contacts.
 */
export function createUserContacts(name, email) {
  return [
    {
      name,
      email,
      phone: "",
      IsInContacts: true,
      isOwnUser: true,
      color: applyRandomColor(),
      initials: getInitials(name),
    },
  ];
}

/**
 * Creates the tasks array for a new user.
 * 
 * @param {string} formattedDueDate - Default due date for tasks.
 * @returns {Array} Array of tasks.
 */
export function createUserTasks(formattedDueDate) {
  return [
    {
      assignedTo: {},
      category: "technical task",
      title: "Example Task",
      dueDate: formattedDueDate,
      prio: "low",
      status: "toDo",
      description: "This is an example task.",
      subtasks: {},
    },
  ];
}

/**
 * Handles errors that occur during the login process.
 * Displays the appropriate error message based on the error code.
 * 
 * @param {Error} error - The error object.
 */
export function handleLoginError(error) {
    switch (error.code) {
      case "auth/user-not-found":
        handleErrorMessage("No user found with this email.", "emailInput");
        break;
      case "auth/wrong-password":
        handleErrorMessage("Incorrect password. Please try again.", "passwordInput");
        break;
      case "auth/invalid-email":
        handleErrorMessage("Invalid email format.", "emailInput");
        break;
      default:
        handleErrorMessage("Login failed. Please try again.", "emailInput", "passwordInput")
    }
  }

/**
 * Adds the "invalid" class to a list of input elements.
 * 
 * @param {HTMLElement[]} inputs - List of input elements to mark as invalid.
 */
function addInvalidClass(inputs) {
  inputs.forEach((input) => {
    if (input && input.classList) {
      input.classList.add("invalid");
    }
  });
}

/**
 * Validates that the password and confirm password match.
 * 
 * @param {string} password - User password.
 * @param {string} confirmPassword - Confirmation of password.
 * @throws Will throw an error if passwords do not match.
 */
function validatePasswordMatch(password, confirmPassword) {
  if (password !== confirmPassword) {
    const errorMessage = document.getElementById("generalError");
    displayErrorMessage(errorMessage, "Passwords do not match.");
    addInvalidClass([passwordInput, confirmPasswordInput]);
    throw new Error("Validation failed: Passwords do not match.");
  }
}

/**
 * Validates that the password meets the minimum length requirement.
 * 
 * @param {string} password - User password.
 * @throws Will throw an error if the password is too short.
 */
function validatePasswordLength(password) {
  if (password.length < 6) {
    const errorMessage = document.getElementById("generalError");
    displayErrorMessage(
      errorMessage,
      "The password must be at least 6 characters long."
    );
    addInvalidClass([passwordInput, confirmPasswordInput]);
    throw new Error(
      "Validation failed: The password must be at least 6 characters long."
    );
  }
}

/**
 * Validates that the privacy policy checkbox is checked.
 * 
 * @param {Object} privacyPolicyCheckbox - Privacy policy checkbox element.
 * @throws Will throw an error if the checkbox is not checked.
 */
function validatePrivacyPolicy(privacyPolicyCheckbox) {
  if (!privacyPolicyCheckbox.checked) {
    const errorMessage = document.getElementById("generalError");
    displayErrorMessage(errorMessage, "You must accept the Privacy Policy.");
    throw new Error("Validation failed: You must accept the Privacy Policy.");
  }
}

/**
 * Sets the visibility of the general error message to visible, displays the provided error message, 
 * and adds the `invalid` class to the specified elements. If a second element is provided, it will also have the 
 * `invalid` class applied.
 *
 * @param {string} message - The error message to be displayed.
 * @param {string} element - The ID of the primary HTML element to be marked as invalid.
 * @param {string} [secondElement] - The optional ID of a second HTML element to be marked as invalid.
 */
function handleErrorMessage(message, element, secondElement) {
  const errorMessageElement = document.getElementById("generalError");
  errorMessageElement.style.visibility = "visible";
  
  displayErrorMessage(errorMessageElement, message);

  const el = document.getElementById(element);
  if (el) {
    el.classList.add("invalid");
  }
  if (secondElement) {
    const secondEl = document.getElementById(secondElement);
    if (secondEl) {
      secondEl.classList.add("invalid");
    }
  }
}