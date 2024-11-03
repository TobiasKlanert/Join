function loadContactsToInput(contactId) {
  const inputEditName = document.getElementById("inputEditName");
  const inputEditMail = document.getElementById("inputEditMail");
  const inputEditPhone = document.getElementById("inputEditPhone");

  inputEditName.value = contacts[contactId].name;
  inputEditMail.value = contacts[contactId].email;
  inputEditPhone.value = contacts[contactId].phone;
}

function saveEditedContacts(contactId) {
    console.log(contacts[contactId]);
    contacts[contactId].name = document.getElementById("inputEditName").value;
    contacts[contactId].email = document.getElementById("inputEditMail").value;
    contacts[contactId].phone = document.getElementById("inputEditPhone").value;
    console.log(contacts[contactId]);
}

