async function initContacts(elementId, elementType) {
  loadTemplates(elementId, elementType);
  renderContactsAlphabetList();
  showContactList();
}

function showContactList() {
  let alphabetContainer = document.getElementsByClassName("alphabet-list");

  for (let i = 0; i < contacts.length; i++) {
    let contact = contacts[i];
    if (!contact || !contact.IsInContacts) {
      continue;
    }
    assignToLetter(alphabetContainer, i);
  }
}

function assignToLetter(letters, indexOfContacts) {
  for (let j = 0; j < letters.length; j++) {
    let element = letters[j];

    if (checkfirstAndLastChar(indexOfContacts, element)) {
      element.style.display = "block";
      element.innerHTML += renderContact(indexOfContacts);
      contacts[indexOfContacts].IsInContacts = true;
      applyBackgroundColor(indexOfContacts);
    }
  }
}

function applyBackgroundColor(index) {
  document.getElementById("initials-" + (index + 1)).style.backgroundColor =
    contacts[index].color;
}

function checkfirstAndLastChar(index, element) {
  let firstLetter = contacts[index].name.charAt(0).toUpperCase();
  let lastCharacter = element.id.slice(-1).toUpperCase();
  if (firstLetter == lastCharacter) {
    return true;
  }
}

function displayContactInfo(contactId) {
  let contactInfo = document.getElementById("contacts-info");
  contactInfo.classList.add("is-checked");
  contactInfo.classList.toggle("translate-x-0");
  let userInfo = document.getElementById("userInfo");
  userInfo.innerHTML = "";
  userInfo.innerHTML = renderUserInfo(contactId);
  userInfo.classList.add("transform-animation");
  setTimeout(() => {
    userInfo.classList.remove("transform-animation");
  }, 100);
  console.log("Contact showed: ", contactId);
}

function openEditContactDialog(contactId) {
  toggleDisplayNone("dialogEditContact");
  loadContactsToInput(contactId);
}

async function editContact(contactId) {
  document.getElementById("overlay-placeholder").innerHTML = "";
  document.getElementById("overlay-placeholder").innerHTML =
    getEditContactRef(contactId);

  toggleDisplayNone("overlay-placeholder");
  toggleDialog("dialogEditContact");
  bodyHideScrollbar();

  loadContactsToInput(contactId);
  let submitFunc = document.querySelector(".contact-dialog-form");

  submitFunc.setAttribute(
    "onsubmit",
    `saveEditedContacts(event, ${contactId})`
  );
}

function loadContactsToInput(contactId) {
  let contact = contacts[contactId];

  document.getElementById("inputEditName").value = contact.name;
  document.getElementById("inputEditMail").value = contact.email;
  document.getElementById("inputEditPhone").value = contact.phone;
  document.getElementById(
    "contact-dialog-user-image"
  ).innerHTML = `<div style="background-color:${contact.color};" class="user-info-inits">${contact.initials}</div>`;
}

function saveEditedContacts(event, contactId) {
  event.preventDefault();

  let contact = contacts[contactId];

  contact.name = document.getElementById("inputEditName").value;
  contact.email = document.getElementById("inputEditMail").value;
  contact.phone = document.getElementById("inputEditPhone").value;

  let initials =
    contact.name.charAt(0).toUpperCase() +
    contact.name.charAt(contact.name.indexOf(" ") + 1).toUpperCase();
  contact.initials = initials;
  displayContactInfo(contactId);
  closeDialog("dialogEditContact", "overlay-placeholder");

  saveToLocalStorage("contacts", contacts);

  renderContactsAlphabetList();
  showContactList();
}

function hideContact(contactId) {
  let contact = document.getElementById("contact-" + contactId);
  let parent = contact.parentNode;
  console.log("Parent: ", parent);

  contact.remove();
  console.log("deleted Contact: ", contactId);

  if (parent.innerText.length == 1) {
    parent.style.display = "none";
  }
  document.getElementById("userInfo").innerHTML = "";
}

function deleteContact(contactId) {
  document.getElementById("userInfo").innerHTML = "";
  contacts[contactId]["IsInContacts"] = false;
  saveToLocalStorage("contacts", contacts);
  renderContactsAlphabetList();
  showContactList();
}

function deleteContactOnDialog(contactId) {
  closeDialog("dialogEditContact", "overlay-placeholder");
  deleteContact(contactId);
}

function createContact() {
  let newContactName = document.getElementById("addContactName").value;
  let newContactMail = document.getElementById("addContactMail").value;
  let newContactPhone = document.getElementById("addContactPhone").value;

  let newContact = {};

  newContact.name = newContactName;
  newContact.email = newContactMail;
  newContact.phone = newContactPhone;
  newContact.IsInContacts = true;
  newContact.color = applyRandomColor();
  newContact.initials = getInitials(newContact.name);

  contacts.push(newContact);
  saveToLocalStorage("contacts", contacts);

  let letters = document.getElementsByClassName("alphabet-list");
  assignToLetter(letters, contacts.length - 1);
  closeDialog("addContact", "overlay-placeholder");
}

function openContactsMenu(event) {
  let contactsMenu = document.querySelector(".user-info-edit-delete");
  contactsMenu.style.transform = "translateX(0%)";
  let container = document.querySelector(".container");
  container.addEventListener("click", () => {
    closeContactsMenu();
  });
  event.stopPropagation();
}

function closeContactsMenu() {
  let contactsMenu = document.querySelector(".user-info-edit-delete");
  contactsMenu.style.transform = "translateX(100%)";
}
