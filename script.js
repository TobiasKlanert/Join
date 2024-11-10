const backendURL ="https://join-ce104-default-rtdb.europe-west1.firebasedatabase.app/";
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

async function init(elementId, elementType) {
  loadTemplates(elementId, elementType);
  await getUser();
  showContactList()
}

async function loadBoard(elementId, elementType) {
  loadTemplates(elementId, elementType);
  await getUser();
  await getTasks();
  currentTasks = tasks;
  renderTasks();
  proofIfEmpty("toDo");
}

async function getData(object) {
  try {
    let response = await fetch(backendURL + object + ".json");
    let responseToJSON = await response.json();
    return responseToJSON;
  } catch (error) {
    console.log("Error");
  }
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

async function getUser() {
  let contactsResponse = await getData('/contacts');
  let contactsKeysArray = Object.keys(contactsResponse);

  for (let index = 0; index < contactsKeysArray.length; index++) {
    let contact = contactsResponse[index];
    
    contact.color = applyRandomColor();
    contact.initials = getInitials(contact.name);
    contact.IsInContacts = false;

    contacts.push(contact);
  }
}

function showContactList() {
  let idsOfAplha = document.getElementsByClassName("alphabet-list");

  for (let index = 0; index < contacts.length; index++) {
    let firstLetter = contacts[index].name.charAt(0).toUpperCase();
    for (let index = 0; index < idsOfAplha.length; index++) {

      let lastCharacter = idsOfAplha[index];
      lastCharacter = lastCharacter.id.slice(-1).toUpperCase();

      if (lastCharacter == firstLetter) {
        idsOfAplha[index].style.display = "block";
        idsOfAplha[index].innerHTML += renderContact(index);
        contacts[index].IsInContacts = true;
        document.getElementById(
          "initials-" + (index + 1)
        ).style.backgroundColor = contacts[index].color;
      }
    }
  }
}

async function getTasks() {
  let tasksResponse = await getData('/tasks');
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