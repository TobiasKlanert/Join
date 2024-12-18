const backendURL =
  "https://join-ce104-default-rtdb.europe-west1.firebasedatabase.app/";
let contacts = [];
let tasks = [];
let currentTasks = [];
let colors = [
  "#FF7A00",
  "#FF5EB3",
  "#6E52FF",
  "#9327FF",
  "#00BEE8",
  "#1FD7C1",
  "#FF745E",
  "#FFA35E",
  "#FC71FF",
  "#FFC701",
  "#0038FF",
  "#C3FF2B",
  "#FFE62B",
  "#FF4646",
  "#FFBB2B"
];
let randomColors = [...colors];

/**
 * Prevents the event from propagating further (event bubbling).
 *
 * @param {Event} event - The event object to stop propagation for.
 */
function stopEventBubbling(event) {
  event.stopPropagation();
}

/**
 * Toggles a CSS class on the given element.
 *
 * @param {HTMLElement} element - The element to toggle the class on.
 * @param {string} className - The name of the class to toggle.
 */
function toggleClass(element, className) {
  element.classList.toggle(className);
}

/**
 * Loads the header and menu templates and updates the summary data.
 *
 * @param {string} elementId - The ID of the target element.
 * @param {string} elementType - The type of the target element.
 */
async function loadSummary(elementId, elementType) {
  await loadTemplates(elementId, elementType);
  loadDataToSummary();
  displayGreeting();
}

/**
 * Loads the header and menu templates and renders the current tasks.
 *
 * @param {string} elementId - The ID of the target element.
 * @param {string} elementType - The type of the target element.
 */
async function loadBoard(elementId, elementType) {
  await loadTemplates(elementId, elementType);
  currentTasks = tasks;
  renderTasks();
}

/**
 * Loads tasks from local storage and appends them to the tasks array.
 */
function loadFromStorage() {
  let taskJSON = localStorage.getItem("task");
  let task = JSON.parse(taskJSON);

  tasks.push(task);
}

/**
 * Saves an array to local storage under the specified key.
 *
 * @param {string} key - The key under which the array is saved.
 * @param {Array} array - The array to save.
 */
function saveToLocalStorage(key, array) {
  localStorage.setItem(key, JSON.stringify(array));
}

/**
 * Returns a random color from the randomColors array and ensures recycling.
 *
 * @returns {string} - A random color string.
 */
function applyRandomColor() {
  let randomColor = randomColors.splice(
    [Math.floor(Math.random() * randomColors.length)],
    1
  );
  if (randomColors.length == 0) {
    randomColors = [...colors];
  }
  return randomColor[0];
}

/**
 * Extracts initials from a given name.
 *
 * @param {string} name - The name to extract initials from.
 * @returns {string} - The initials of the name.
 */
function getInitials(name) {
  let initials =
    name.charAt(0).toUpperCase() +
    name.charAt(name.indexOf(" ") + 1).toUpperCase();
  return initials;
}

/**
 * Capitalizes the first letter of each word in a string.
 *
 * @param {string} word - The string to capitalize.
 * @returns {string} - The capitalized string.
 */
function firstLetterUpperCase(word) {
  if (word != undefined) {
    let parts = word.split(" ");
    let capitalizedParts = parts.map(
      (part) => part.charAt(0).toUpperCase() + part.slice(1)
    );
    return capitalizedParts.join(" ");
  } else {
    return "";
  }
}

/**
 * Toggles the visibility of the user menu.
 */

function buttonUser() {
  const userMenu = document.getElementById("userMenu");

  if (userMenu.style.display === "none" || userMenu.style.display === "") {
    userMenu.style.display = "flex";
  } else {
    userMenu.style.display = "none";
  }
}

/**
 * Sets the initials in the user circle based on the stored user name.
 */
function setUserCircleInitials() {
  let userName = localStorage.getItem("userFullName");
  let userInitial = document.getElementById("userInitial");

  if (userName && userName.trim() !== "") {
    let nameParts = userName.trim().split(" ");
    let firstName = nameParts[0]?.charAt(0).toLocaleUpperCase() || "";
    let lastName = nameParts[1]?.charAt(0).toLocaleUpperCase() || "";

    const initials = firstName + lastName;
    userInitial.textContent = initials;
  } else {
    userInitial.textContent = "G";
  }
}

/**
 * Checks if the user is redirected from the login page.
 *
 * @returns {boolean} - True if redirected from login, false otherwise.
 */
function checkLoginStatus() {
  const urlParams = new URLSearchParams(window.location.search);
  const fromLogin = urlParams.get("fromLogin") === "true";

  return fromLogin;
}

/**
 * Removes specific elements from the DOM by their IDs.
 */
function removeElements() {
  const elements = ["menuButtons", "menuLinks", "headerButtons"];

  for (let i = 0; i < elements.length; i++) {
    const element = document.getElementById(elements[i]);
    if (element) {
      element.remove();
    }
  }
}

/**
 * Redirects the user to an information site and appends a login flag to the URL.
 *
 * @param {string} link - The URL of the information site.
 */
function loadInfoSites(link) {
  window.location.href = `${link}?fromLogin=true`;
}

/**
 * Retrieves information about the current user based on their name and the requested output type.
 *
 * @param {string} name - The name of the user to check.
 * @param {string} element - The output type, either "class" or "string".
 *                           If "class", returns "disabled" for the current user.
 *                           If "string", returns "(You)" for the current user.
 * @returns {string} A string indicating whether the user is the current user:
 *                   - "disabled" if `element` is "class" and the user matches.
 *                   - "(You)" if `element` is "string" and the user matches.
 *                   - An empty string ("") if the user does not match.
 */
function getOwnUser(name, element) {
  const contacts = JSON.parse(localStorage.getItem("contacts")) || [];
  const ownUser = contacts.find((contact) => contact.isOwnUser);

  if (ownUser && ownUser.name === name) {
    if (element == "class") {
      return "disabled";
    } else if (element == "string") {
      return "(You)";
    }
  }
  return "";
}

/**
 * Toggles the visibility and icons for a password input field based on the event type.
 * 
 * @param {string} eventType - The type of event ('input' or 'click').
 * @param {string} inputType - The ID of the password input element.
 * @param {string} imgType - The ID of the image element for toggling icons.
 */
function togglePasswordIcons(eventType, inputType, imgType) {
  const passwordInput = document.getElementById(inputType);
  const togglePassword = document.getElementById(imgType);

  if (eventType === "input") {
    handleInputEvent(passwordInput, togglePassword);
  } else if (eventType === "click") {
    handleClickEvent(passwordInput, togglePassword);
  }
}

/**
 * Handles the "input" event for a password field to toggle the icon based on input value.
 * 
 * @param {HTMLElement} passwordInput - The password input element.
 * @param {HTMLElement} togglePassword - The image element for the toggle icon.
 */
function handleInputEvent(passwordInput, togglePassword) {
  if (passwordInput.value.trim() !== "") {
    togglePassword.src = "../assets/img/eye-slash.png";
  } else {
    togglePassword.src = "../assets/img/password-log-in.svg";
  }
}

/**
 * Handles the "click" event for a password field to toggle visibility and icon.
 * 
 * @param {HTMLElement} passwordInput - The password input element.
 * @param {HTMLElement} togglePassword - The image element for the toggle icon.
 */
function handleClickEvent(passwordInput, togglePassword) {
  if (togglePassword.src.includes("eye-slash.png")) {
    togglePassword.src = "../assets/img/eye-icon.png";
    passwordInput.type = "text";
  } else {
    togglePassword.src = "../assets/img/eye-slash.png";
    passwordInput.type = "password";
  }
}