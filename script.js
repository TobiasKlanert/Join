const backendURL =
  "https://join-ce104-default-rtdb.europe-west1.firebasedatabase.app/";
let contacts = [];
let tasks = [];
let currentTasks = [];
let colors = [
  "red",
  "lightblue",
  "darkblue",
  "orange",
  "violet",
  "pink",
  "cyan",
  "lightcoral",
];
let randomColors = [...colors];

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