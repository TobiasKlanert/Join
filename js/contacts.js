function displayContactInfo(contactId) {
  let userInfo = document.getElementById("userInfo");

  userInfo.innerHTML = "";

  userInfo.innerHTML = renderUserInfo(contactId);
}

function openEditContactDialog(contactId) {
  toggleDisplayNone("dialogEditContact");
  loadContactsToInput(contactId);
}

function loadContactsToInput(contactId) {
  let contact = contacts[contactId];

  document.getElementById("inputEditName").value = contact.name;
  document.getElementById("inputEditMail").value = contact.email;
  document.getElementById("inputEditPhone").value = contact.phone;
  document.getElementById(
    "contact-dialog-user-image"
  ).innerHTML = `<div style="background-color:${contact.color};" class="user-info-inits">${contact.initials}</div>`;
  document.getElementById('delete-button-edit-contacts').onclick = () => {
    deleteContact(contactId);
    toggleDisplayNone('dialogEditContact');
  }  
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

  toggleDisplayNone("dialogEditContact");
}

function deleteContact(contactId) {
  contacts[contactId]["IsInContacts"] = false;
  let contact = document.getElementById('contact-' + contactId);
  let parent = contact.parentNode;
  contact.remove();
  if (parent.innerText.length == 1) {
    parent.style.display = "none";
  }
  document.getElementById('userInfo').innerHTML = "";
}

function createContact() {
  let newContactName = document.getElementById('addContactName').value;
  let newContactMail = document.getElementById('addContactMail').value;
  let newContactPhone = document.getElementById('addContactPhone').value;
 
  let newContact = {};
  
  newContact.name = newContactName;
  newContact.email = newContactMail;
  newContact.phone = newContactPhone;

  contacts.push(newContact);
  toggleDisplayNone('addContact');
  console.log(contacts);
  
}