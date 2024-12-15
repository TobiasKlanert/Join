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

function toggleClass(element, className) {
  element.classList.toggle(className);
}

async function loadSummary(elementId, elementType) {
  await loadTemplates(elementId, elementType);
  loadDataToSummary();
  displayGreeting();
}

async function loadBoard(elementId, elementType) {
  await loadTemplates(elementId, elementType);
  currentTasks = tasks;
  renderTasks();
}

function loadFromStorage() {
  let taskJSON = localStorage.getItem("task");
  let task = JSON.parse(taskJSON);

  tasks.push(task);
}

function saveToLocalStorage(key, array) {
  localStorage.setItem(key, JSON.stringify(array));
}

async function loadEditTask() {
  assignContacts();
}

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

function getInitials(name) {
  let initials =
    name.charAt(0).toUpperCase() +
    name.charAt(name.indexOf(" ") + 1).toUpperCase();
  return initials;
}

/* async function addContactDetails() {
  // Lade das Array von 'contacts' aus dem Local Storage (falls vorhanden)
  let contacts = JSON.parse(localStorage.getItem("contacts")) || [];

  // Wenn keine Kontakte im Local Storage vorhanden sind, zurückgeben
  if (contacts.length === 0) {
    console.log("Keine Kontakte im Local Storage gefunden.");
    return;
  }

  // Durchlaufe alle Kontakte und füge die Attribute hinzu
  contacts = contacts.map((contact) => {
    contact.color = applyRandomColor();
    contact.initials = getInitials(contact.name);
    contact.IsInContacts = true;
    return contact;
  });

  // Speichere das aktualisierte Array zurück im Local Storage
  saveToLocalStorage("contacts", contacts);
  console.log("Kontaktdaten aktualisiert");
} */

async function getTasks() {
  let tasksResponse = await getData("/tasks");
  let tasksKeysArray = Object.keys(tasksResponse);

  for (let taskIndex = 0; taskIndex < tasksKeysArray.length; taskIndex++) {
    let task = tasksResponse[taskIndex];

    tasks.push(task);
  }
}

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

function buttonUser() {
  const userMenu = document.getElementById("userMenu");

  if (userMenu.style.display === "none" || userMenu.style.display === "") {
    userMenu.style.display = "flex";
  } else {
    userMenu.style.display = "none";
  }
}

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


function checkLoginStatus() {
  const urlParams = new URLSearchParams(window.location.search);
  const fromLogin = urlParams.get("fromLogin") === "true";

  return fromLogin;
}

function removeElements() {
  const elements = ["menuButtons", "menuLinks", "headerButtons"];

  for (let i = 0; i < elements.length; i++) {
    const element = document.getElementById(elements[i]);
    if (element) {
      element.remove();
    }
  }
}


function loadInfoSites(link) {
  window.location.href = `${link}?fromLogin=true`;
}