/**
 * this function loads html templates(menu bar and header) renders container for each letter of the alphabet
 * and renders all contacts in a list
 *
 * @param {*} elementId this is 'contacts' in the menu bar which is to be highlighted
 * @param {*} elementType the class to highlight
 */
async function initContacts(elementId, elementType) {
  await loadTemplates(elementId, elementType);
  renderContactsAlphabetList();
  showContactList();
}

/**
 * this function iterates through contacts array,
 * matches first char of name to the letter of alphabet container
 * and renders contact infos in that container
 */
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

/**
 * this function iterates throught all letter containers
 * if letter matches beginning letter of a contact name, contact infos are rendered in corresponding letter container
 * and container becomes visible
 *
 * @param {*} letters this is the array in which all letter containers are
 * @param {*} indexOfContacts index of contact in contacts array
 */
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

/**
 * this function applies a random background color to rendered initial icons in the contacts list
 *
 * @param {*} index the index of the initials/contacts array
 */
function applyBackgroundColor(index) {
  document.getElementById("initials-" + (index + 1)).style.backgroundColor =
    contacts[index].color;
}

/**
 * this function checks if the beginning letter of a contact name matches a specific letter
 *
 * @param {*} index index of the contact in contacts array
 * @param {*} element a letter container
 * @returns boolean true if a match happens, else nothing
 */
function checkfirstAndLastChar(index, element) {
  let firstLetter = contacts[index].name.charAt(0).toUpperCase();
  let lastCharacter = element.id.slice(-1).toUpperCase();
  if (firstLetter == lastCharacter) {
    return true;
  }
}

/**
 * this function displays more contacts infos by rendering them in a seperate and bigger container
 *
 * @param {*} contactId index of the contact in contacts array
 */
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
}

/**
 * this function opesn a dialog window with contact infos which can be altered
 *
 * @param {*} contactId index of the contact in contacts array
 */
async function editContact(contactId) {
  document.getElementById("overlay-placeholder").innerHTML = "";
  document.getElementById("overlay-placeholder").innerHTML =
    getEditContactRef(contactId);

  toggleDisplayNone("overlay-placeholder");
  toggleDialog("dialogEditContact");
  bodyHideScrollbar();

  loadContactsToInput(contactId);
  initializeContactFormValidation(
    "inputEditName",
    "inputEditMail",
    "inputEditPhone",
    "saveEditButton",
    "errorEditContact"
  );
  let submitFunc = document.querySelector(".contact-dialog-form");

  submitFunc.setAttribute(
    "onsubmit",
    `saveEditedContacts(event, ${contactId})`
  );
}

/**
 * this function get contact infos and put their values in input elements
 *
 * @param {*} contactId
 */
function loadContactsToInput(contactId) {
  let contact = contacts[contactId];

  document.getElementById("inputEditName").value = contact.name;
  document.getElementById("inputEditMail").value = contact.email;
  document.getElementById("inputEditPhone").value = contact.phone;
  document.getElementById(
    "contact-dialog-user-image"
  ).innerHTML = `<div style="background-color:${contact.color};" class="user-info-inits">${contact.initials}</div>`;
}

/**
 * this function gets values from input elements and changes contact infos according to theses values
 * changes are stored localy and afterwards contact list and contact information are rendered anew
 *
 * @param {*} event submit event, default method must be prevented
 * @param {*} contactId index of the contact in contacts array
 */
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
  addMenuHighlighter(`contact-${contactId}`, "contact");
}

/**
 * this function deletes a contact from the contacts list
 *
 * @param {*} contactId index of the contact in contacts array
 */
function deleteContact(contactId) {
  document.getElementById("userInfo").innerHTML = "";
  contacts[contactId]["IsInContacts"] = false;
  saveToLocalStorage("contacts", contacts);
  renderContactsAlphabetList();
  showContactList();
}

/**
 * this function deletes a contact from the contacts list
 * and closes a dialog window
 *
 * @param {*} contactId index of the contact in contacts array
 */
function deleteContactOnDialog(contactId) {
  closeDialog("dialogEditContact", "overlay-placeholder");
  deleteContact(contactId);
}

/**
 * this function create a new contact, which is stored localy
 * contact is paired with the correct letter container  and is rendered
 */
function createContact() {
  let newContactName = document.getElementById("addContactName").value;
  let newContactMail = document.getElementById("addContactMail").value;
  let newContactPhone = document.getElementById("addContactPhone").value;

  let newContact = {};
  setNewContact(newContact, newContactName, newContactMail, newContactPhone);

  contacts.push(newContact);
  saveToLocalStorage("contacts", contacts);

  let letters = document.getElementsByClassName("alphabet-list");
  assignToLetter(letters, contacts.length - 1);
  closeDialog("addContact", "overlay-placeholder");
  displayContactInfo(contacts.length - 1);
  addMenuHighlighter(`contact-${contacts.length - 1}`, "contact");
  document.getElementById(`contact-${contacts.length - 1}`).scrollIntoView();
}

/**
 * this function sets attributes for a new contact
 *
 * @param {*} newContact this is the new contact as a empty onj
 * @param {*} name the name of the new contact
 * @param {*} mail the mail of the new contact
 * @param {*} phone the phone number of the new contact
 */
function setNewContact(newContact, name, mail, phone) {
  newContact.name = name;
  newContact.email = mail;
  newContact.phone = phone;
  newContact.IsInContacts = true;
  newContact.color = applyRandomColor();
  newContact.initials = getInitials(newContact.name);
}

/**
 * this function opens a menu with edit/delete options
 * the div with this onclick function is only visible on small screens
 *
 * @param {*} event onclick event
 */
function openContactsMenu(event) {
  let contactsMenu = document.querySelector(".user-info-edit-delete");
  contactsMenu.style.transform = "translateX(0%)";
  let container = document.querySelector(".container");
  container.addEventListener("click", () => {
    closeContactsMenu();
  });
  document.querySelector(".menu-contacts").style.backgroundColor =
    "rgba(41, 171, 226, 1)";
  event.stopPropagation();
}

/**
 * this function closes a menu with edit/delete options
 * the div with this onclick function is only visible on small screens
 */
function closeContactsMenu() {
  let contactsMenu = document.querySelector(".user-info-edit-delete");
  contactsMenu.style.transform = "translateX(100%)";
  document.querySelector(".menu-contacts").style.backgroundColor = "#2A3647";
}