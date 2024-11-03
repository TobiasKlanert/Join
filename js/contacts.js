function openEditContactDialog(contactId) {
    toggleDisplayNone('dialogEditContact');
    loadContactsToInput(contactId);
}

function loadContactsToInput(contactId) {
  document.getElementById("inputEditName").value = contacts[contactId].name;
  document.getElementById("inputEditMail").value = contacts[contactId].email;
  document.getElementById("inputEditPhone").value = contacts[contactId].phone;
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
  
  /* Delete later */
  console.log(contact);
}
