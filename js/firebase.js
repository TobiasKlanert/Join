import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import {
  getDatabase,
  ref,
  get,
  set,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import { fetchSignInMethodsForEmail } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import {
  setPersistence,
  browserLocalPersistence,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

/**
 * Main function to initialize Firebase and its services.
 * Calls helper functions to handle specific tasks.
 * @returns {Promise<Object>} - The initialized Firebase app, auth, and database objects.
 * @throws Will throw an error if initialization fails.
 */
export async function initializeFirebase() {
  const firebaseConfig = getFirebaseConfig();

  try {
    const app = initializeFirebaseApp(firebaseConfig);
    const auth = initializeFirebaseAuth(app);
    const database = initializeFirebaseDatabase(app);

    await configureAuthPersistence(auth);

    return { app, auth, database };
  } catch (error) {
    handleFirebaseInitializationError(error);
  }
}

/**
 * Provides the Firebase configuration object.
 * @returns {Object} - The Firebase configuration object.
 */
function getFirebaseConfig() {
  return {
    apiKey: "AIzaSyBe8DZkoA7TTJc9p59L3G4pAiNvWuArOfw",
    authDomain: "join-ce104.firebaseapp.com",
    databaseURL:
      "https://join-ce104-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "join-ce104",
    storageBucket: "join-ce104.firebasestorage.app",
    messagingSenderId: "191830087515",
    appId: "1:191830087515:web:38c4e1dd5e96a1ea5c6c7e",
  };
}

/**
 * Initializes the Firebase app with the provided configuration.
 * @param {Object} firebaseConfig - The Firebase configuration object.
 * @returns {Object} - The initialized Firebase app instance.
 */
function initializeFirebaseApp(firebaseConfig) {
  return initializeApp(firebaseConfig);
}

/**
 * Initializes Firebase Authentication for the given app.
 * @param {Object} app - The Firebase app instance.
 * @returns {Object} - The initialized Firebase Auth instance.
 */
function initializeFirebaseAuth(app) {
  return getAuth(app);
}

/**
 * Initializes Firebase Database for the given app.
 * @param {Object} app - The Firebase app instance.
 * @returns {Object} - The initialized Firebase Database instance.
 */
function initializeFirebaseDatabase(app) {
  return getDatabase(app);
}

/**
 * Configures Firebase Authentication persistence.
 * @param {Object} auth - The Firebase Auth instance.
 * @returns {Promise<void>} - Resolves when persistence is set.
 */
async function configureAuthPersistence(auth) {
  await setPersistence(auth, browserLocalPersistence);
}

/**
 * Handles errors that occur during Firebase initialization.
 * Logs the error and rethrows it.
 * @param {Error} error - The error object.
 * @throws The provided error object.
 */
function handleFirebaseInitializationError(error) {
  console.error("Fehler bei der Initialisierung von Firebase:", error);
  throw error;
}

/**
 * Main function to handle user login or guest login.
 * Delegates to helper functions for better readability and maintainability.
 * @param {boolean} [isGuest=false] - Determines if login is for a guest user.
 */
export async function login(isGuest = false) {
  try {
    const { auth, database } = await initializeFirebase();
    const errorMessageElement = clearErrorMessage();
    if (isGuest) {
      await handleGuestLogin(database, errorMessageElement);
      return;
    }
    const { email, password } = getEmailAndPasswordInputs();
    validateEmailAndPassword(email, password, errorMessageElement);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    await handleUserLogin(database, user.uid, errorMessageElement);
  } catch (error) {
    handleLoginError(error);
  }
}

/**
 * Clears the general error message element.
 * @returns {HTMLElement} - The cleared error message element.
 */
function clearErrorMessage() {
  const errorMessageElement = document.getElementById("generalError");
  errorMessageElement.textContent = "";
  errorMessageElement.style.visibility = "hidden";
  return errorMessageElement;
}

/**
 * Handles login for a guest user.
 * @param {Object} database - The Firebase database instance.
 * @param {HTMLElement} errorMessageElement - The error message element.
 */
async function handleGuestLogin(database, errorMessageElement) {
  const userData = await fetchUserData(database, "guestUser");

  if (userData) {
    processUserData(userData, true);
    window.location.href = "./html/summary.html";
  } else {
    displayErrorMessage(
      errorMessageElement,
      "No guest data available. Please contact support."
    );
  }
}

/**
 * Retrieves and trims email and password input values.
 * @returns {Object} - Contains email and password values.
 */
function getEmailAndPasswordInputs() {
  const email = document.getElementById("emailInput").value.trim();
  const password = document.getElementById("passwordInput").value.trim();
  return { email, password };
}

/**
 * Validates email and password inputs.
 * @param {string} email - The email input value.
 * @param {string} password - The password input value.
 * @param {HTMLElement} errorMessageElement - The error message element.
 * @throws Will display an error and return if validation fails.
 */
function validateEmailAndPassword(email, password, errorMessageElement) {
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
 * Handles login for a regular user.
 * @param {Object} database - The Firebase database instance.
 * @param {string} userId - The user's unique ID.
 * @param {HTMLElement} errorMessageElement - The error message element.
 */
async function handleUserLogin(database, userId, errorMessageElement) {
  const userData = await fetchUserData(database, userId);

  if (userData) {
    processUserData(userData, false);
    window.location.href = "./html/summary.html";
  } else {
    displayErrorMessage(
      errorMessageElement,
      "User data not found. Please contact support."
    );
  }
}

/**
 * Processes user data and saves it locally.
 * @param {Object} userData - The user's data.
 * @param {boolean} isGuest - Whether the user is a guest.
 */
function processUserData(userData, isGuest) {
  addArray(userData);
  saveDataToLocalStorage(userData);
  localStorage.setItem("isGuest", isGuest.toString());
}

/**
 * Handles errors that occur during the login process.
 * Displays the appropriate error message based on the error code.
 * @param {Error} error - The error object.
 */
function handleLoginError(error) {
  const errorMessageElement = document.getElementById("generalError");
  errorMessageElement.style.visibility = "visible";

  switch (error.code) {
    case "auth/user-not-found":
      displayErrorMessage(errorMessageElement, "No user found with this email.");
      document.getElementById("emailInput").classList.add("invalid");
      break;
    case "auth/wrong-password":
      displayErrorMessage(errorMessageElement, "Incorrect password. Please try again.");
      document.getElementById("passwordInput").classList.add("invalid");
      break;
    case "auth/invalid-email":
      displayErrorMessage(errorMessageElement, "Invalid email format.");
      document.getElementById("emailInput").classList.add("invalid");
      break;
    default:
      displayErrorMessage(errorMessageElement, "Login failed. Please try again.");
      document.getElementById("emailInput").classList.add("invalid");
      document.getElementById("passwordInput").classList.add("invalid");
  }
}

/**
 * Handles the logout process for regular and guest users.
 */
export async function logout() {
  try {
    const { auth, database } = await initializeFirebase();
    const user = auth.currentUser;
    const isGuest = localStorage.getItem("isGuest") === "true";

    if (user && !isGuest) {
      await handleRegularUserLogout(auth, database);
    } else if (isGuest) {
      handleGuestLogout();
    }
  } catch (error) {
    console.error("Error during logout:", error);
  }
}

/**
 * Handles the logout process for a regular user.
 * Saves user data to the database and clears local/session storage.
 * @param {Object} auth - The Firebase Auth instance.
 * @param {Object} database - The Firebase Database instance.
 */
async function handleRegularUserLogout(auth, database) {
  loadDataFromLocalStorage();

  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  const userId = auth.currentUser.uid;
  const userRef = ref(database, `users/${userId}`);

  const userData = {
    name: name,
    email: email,
    tasks: tasks,
    contacts: contacts,
  };

  await set(userRef, userData);
  clearStorageAfterLogout();
  await signOut(auth);
  window.location.href = "../index.html";
}

/**
 * Clears local and session storage after logout.
 * Retains remembered email if it exists.
 */
function clearStorageAfterLogout() {
  const rememberedEmail = localStorage.getItem("rememberedEmail");
  localStorage.clear();
  if (rememberedEmail) {
    localStorage.setItem("rememberedEmail", rememberedEmail);
  }
  sessionStorage.clear();
}

/**
 * Handles the logout process for a guest user.
 * Clears local storage and redirects to the index page.
 */
function handleGuestLogout() {
  localStorage.clear();
  window.location.href = "../index.html";
}

/**
 * Handles user registration and validation for the sign-up process.
 */
export async function handleSignUp() {
  try {
    const { name, email, password, confirmPassword, privacyPolicyCheckbox } = getSignUpFormValues();
    removeInvalidClass()
    validateSignUpForm(password, confirmPassword, privacyPolicyCheckbox);

    const { auth, database } = await initializeFirebase();
    await validateEmailFormat(email);
    await checkEmailInUse(auth, email);

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await saveNewUserToDatabase(database, userCredential.user, name, email);

    displaySuccessAndRedirect();
  } catch (error) {
    handleSignUpError(error);
  }
}

/**
 * Retrieves values from the sign-up form fields.
 * @returns {Object} Form field values.
 */
function getSignUpFormValues() {
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
 * Validates the sign-up form input fields.
 * @param {string} name - User name.
 * @param {string} email - User email.
 * @param {string} password - User password.
 * @param {string} confirmPassword - Confirmation of password.
 * @param {Object} privacyPolicyCheckbox - Privacy policy checkbox element.
 * @throws Will throw an error if validation fails.
 */
function validateSignUpForm(
  password,
  confirmPassword,
  privacyPolicyCheckbox
) {
  validatePasswordMatch(password, confirmPassword);
  validatePasswordLength(password);
  validatePrivacyPolicy(privacyPolicyCheckbox);
}

/**
 * Validates that the password and confirm password match.
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
    throw new Error("Validation failed: The password must be at least 6 characters long.");
  }
}

/**
 * Validates that the privacy policy checkbox is checked.
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
 * Validates the email format.
 * @param {string} email - User email.
 * @throws Will throw an error if the email format is invalid.
 */
function validateEmailFormat(email) {
  const errorMessage = document.getElementById("generalError");
  if (!/\S+@\S+\.\S+/.test(email)) {
    displayErrorMessage(errorMessage, "Please enter a valid email address.");
    emailInput.classList.add("invalid");
    throw new Error("Validation failed: Please enter a valid email address.");
  }
}

/**
 * Checks whether the provided email is already in use.
 * @param {Object} auth - Firebase Auth instance.
 * @param {string} email - User email.
 * @throws Will throw an error if the email is already in use.
 */
async function checkEmailInUse(auth, email) {
  const errorMessage = document.getElementById("generalError");
  try {
    const methods = await fetchSignInMethodsForEmail(auth, email);
    if (methods.length > 0) {displayErrorMessage(errorMessage, "This email address is already in use. Please log in.");
      throw new Error("Validation failed: This email address is already in use. Please log in.");
    }
  } catch (apiError) {
    console.error("Error during email lookup:", apiError);
    displayErrorMessage(errorMessage, "There was a problem verifying your email. Please try again later.");
    throw apiError;
  }
}

/**
 * Saves a new user's data to the database.
 * @param {Object} database - Firebase Database instance.
 * @param {Object} user - Firebase User instance.
 * @param {string} name - User name.
 * @param {string} email - User email.
 */
async function saveNewUserToDatabase(database, user, name, email) {
  const currentDate = new Date();
  const futureDate = new Date(currentDate);
  futureDate.setDate(currentDate.getDate() + 7);
  const formattedDueDate = futureDate.toISOString().split("T")[0];

  const userRef = ref(database, `users/${user.uid}`);
  const userData = {
    name,
    email,
    contacts: createUserContacts(name, email),
    tasks: createUserTasks(formattedDueDate),
  };
  await set(userRef, userData);
}

/**
 * Creates the contacts array for a new user.
 * @param {string} name - User name.
 * @param {string} email - User email.
 * @returns {Array} Array of contacts.
 */
function createUserContacts(name, email) {
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
 * @param {string} formattedDueDate - Default due date for tasks.
 * @returns {Array} Array of tasks.
 */
function createUserTasks(formattedDueDate) {
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
 * Displays a success message and redirects the user after sign-up.
 */
function displaySuccessAndRedirect() {
  const successMessage = document.getElementById("successMessage");
  successMessage.classList.add("show");
  setTimeout(() => {
    successMessage.classList.remove("show");
    window.location.href = "../index.html";
  }, 2000);
}

/**
 * Handles errors during the sign-up process.
 * @param {Object} error - Error object.
 */
function handleSignUpError(error) {
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
 * Fetches user data from the database for a given user ID.
 * 
 * @param {Object} database - The database instance used to fetch data.
 * @param {string} userId - The unique identifier of the user whose data needs to be fetched.
 * @returns {Promise<Object|null>} - A promise that resolves to the user data if found, or `null` if no user data exists.
 * @throws {Error} - If an error occurs during the fetch process.
 */
export async function fetchUserData(database, userId) {
  try {
    const userRef = ref(database, `users/${userId}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error when retrieving user data: ", error);
  }
}

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
 * @param {HTMLElement} errorMessageElement - The error message element.
 * @param {string} message - The message to display.
 */
function displayErrorMessage(errorMessageElement, message) {
  errorMessageElement.textContent = message;
  errorMessageElement.style.visibility = "visible";
}

/**
 * Adds the "invalid" class to a list of input elements.
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
 * Removes the 'invalid' class from input elements.
 */
function removeInvalidClass() {
  const invalidElements = document.querySelectorAll(".invalid");
  invalidElements.forEach((element) => {
    element.classList.remove("invalid");
  });
}
