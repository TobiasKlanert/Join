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
