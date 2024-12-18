import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  fetchSignInMethodsForEmail,
  setPersistence,
  browserLocalPersistence,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import {
  getDatabase,
  ref,
  get,
  set,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import { 
  saveDataToLocalStorage,
  loadDataFromLocalStorage,
  addArray,
  displayErrorMessage,
  removeInvalidClass,
  displaySuccessAndRedirect,
  handleSignUpError,
  validateSignUpForm,
  validateEmailFormat,
  validateEmailAndPassword,
  createUserContacts,
  createUserTasks,
  getSignUpFormValues,
  handleLoginError,
 } from "./firebase-helper.js";

/**
 * Main function to initialize Firebase and its services.
 * Calls helper functions to handle specific tasks.
 * 
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
 * 
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
 * 
 * @param {Object} firebaseConfig - The Firebase configuration object.
 * @returns {Object} - The initialized Firebase app instance.
 */
function initializeFirebaseApp(firebaseConfig) {
  return initializeApp(firebaseConfig);
}

/**
 * Initializes Firebase Authentication for the given app.
 * 
 * @param {Object} app - The Firebase app instance.
 * @returns {Object} - The initialized Firebase Auth instance.
 */
function initializeFirebaseAuth(app) {
  return getAuth(app);
}

/**
 * Initializes Firebase Database for the given app.
 * 
 * @param {Object} app - The Firebase app instance.
 * @returns {Object} - The initialized Firebase Database instance.
 */
function initializeFirebaseDatabase(app) {
  return getDatabase(app);
}

/**
 * Configures Firebase Authentication persistence.
 * 
 * @param {Object} auth - The Firebase Auth instance.
 * @returns {Promise<void>} - Resolves when persistence is set.
 */
async function configureAuthPersistence(auth) {
  await setPersistence(auth, browserLocalPersistence);
}

/**
 * Handles errors that occur during Firebase initialization.
 * Logs the error and rethrows it.
 * 
 * @param {Error} error - The error object.
 * @throws The provided error object.
 */
function handleFirebaseInitializationError(error) {
  console.error("Fehler bei der Initialisierung von Firebase:", error);
  throw error;
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
 * Main function to handle user login or guest login.
 * Delegates to helper functions for better readability and maintainability.
 * 
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
 * 
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
 * 
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
 * 
 * @returns {Object} - Contains email and password values.
 */
function getEmailAndPasswordInputs() {
  const email = document.getElementById("emailInput").value.trim();
  const password = document.getElementById("passwordInput").value.trim();
  return { email, password };
}

/**
 * Handles login for a regular user.
 * 
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
 * 
 * @param {Object} userData - The user's data.
 * @param {boolean} isGuest - Whether the user is a guest.
 */
function processUserData(userData, isGuest) {
  addArray(userData);
  saveDataToLocalStorage(userData);
  localStorage.setItem("isGuest", isGuest.toString());
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
 * 
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
 * Checks whether the provided email is already in use.
 * 
 * @param {Object} auth - Firebase Auth instance.
 * @param {string} email - User email.
 * @throws Will throw an error if the email is already in use.
 */
async function checkEmailInUse(auth, email) {
  const errorMessage = document.getElementById("generalError");
  try {
    const methods = await fetchSignInMethodsForEmail(auth, email);
    if (methods.length > 0) {
      displayErrorMessage(errorMessage, "This email address is already in use. Please log in.");
      throw new Error("Validation failed: This email address is already in use. Please log in.");
    }
  } catch (apiError) {
    console.error("Error during email lookup:", apiError);
    displayErrorMessage(errorMessage, "There was a problem verifying your email. Please try again later."
    );
    throw apiError;
  }
}

/**
 * Saves a new user's data to the database.
 * 
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