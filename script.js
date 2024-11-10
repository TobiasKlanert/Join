const contactsURL =
  "https://join-ce104-default-rtdb.europe-west1.firebasedatabase.app/contacts";
let contacts = [];
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
  getUser();
}

async function loadTemplates(elementId, elementType) {
  await loadTemplate("menu-content", "../assets/templates/menu-template.html");
  await loadTemplate(
    "header-content",
    "../assets/templates/header-template.html"
  );
  addMenuHighlighter(elementId, elementType);
}

async function getUser() {
  let contactsInfo = await getContacts();
  for (let index = 0; index < 15; index++) {
    let contact = contactsInfo["user" + (index + 1)];
    let randomColor = randomColors.splice(
      [Math.floor(Math.random() * randomColors.length)],
      1
    );
    contact.color = randomColor[0];

    if (randomColors.length == 0) {
      randomColors = [...colors];
    }

    let initials =
      contact.name.charAt(0).toUpperCase() +
      contact.name.charAt(contact.name.indexOf(" ") + 1).toUpperCase();
    contact.initials = initials;

    contact.IsInContacts = false;

    contacts.push(contact);
  }
  let idsOfAplha = document.getElementsByClassName("alphabet-list");

  for (let index = 0; index < contacts.length; index++) {
    let firstLetter = contacts[index].name.charAt(0).toUpperCase();
    for (let index = 0; index < idsOfAplha.length; index++) {
      const element = idsOfAplha[index];

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

function renderContact(index) {
  return `
        <div id="contact-${index}" class="contact contact-hover" onclick="displayContactInfo(${index}), addMenuHighlighter('contact-${index}', 'contact')">
            <div id="initials-${index + 1}" class="initials">
                ${contacts[index].initials}
            </div>
            <div class="contact-name-email">
                <div class="contacts-name">${contacts[index].name}</div>
                <div class="contacts-email"><a href="#">${
                  contacts[index].email
                }</a></div>   
            </div>
        </div>
    `;
}

function displayContactInfo(contactId) {
  let userInfo = document.getElementById("userInfo");

  userInfo.innerHTML = "";

  userInfo.innerHTML = renderUserInfo(contactId);
}

function renderUserInfo(contactId) {
  let contact = contacts[contactId];
  return `
    <div class="user-info-name-container">
        <div style="background-color:${contact.color};" class="user-info-inits">${contact.initials}</div>
        <div class="user-info-name-edit">
            <div class="user-info-name">${contact.name}</div>
            <div class="user-info-edit-delete">
            <div class="user-info-edit button-hover-light-blue-svg" onclick="editContact(${contactId})">
                <div class="user-info-img">
                <img style="color: red" src="../assets/img/edit.svg" alt="" />
                </div>
                <div>Edit</div>
            </div>
            <div class="user-info-delete button-hover-light-blue-svg">
                <div class="user-info-img">
                <img src="../assets/img/delete.svg" alt="" />
                </div>
                <div>Delete</div>
            </div>
            </div>
        </div>
        </div>
        <div class="contacts-info-text">Contact information</div>
        <div class="contacts-info-email-phone">
        <div>
            <div class="contacts-info-email-text">Email</div>
            <div class="contacts-info-email">
            <a href="mailto:${contact.email}">${contact.email}</a>
            </div>
        </div>
        <div>
            <div class="contacts-info-phone-text">Phone</div>
            <div class="contacts-info-phone">${contact.phone}</div>
        </div>
    </div>`;
}

async function getContacts() {
  try {
    let response = await fetch(contactsURL + ".json");
    let responseToJSON = await response.json();
    console.log(responseToJSON);
    return responseToJSON;
  } catch (error) {
    console.log("Error");
  }
}

async function editContact(contactId) {
  await loadTemplate(
    "overlay-placeholder",
    "../assets/templates/edit-contact.html"
  );
  loadContactsToInput(contactId);
}

async function addContact() {
  console.log("Add Contact");

  await loadTemplate(
    "overlay-placeholder",
    "../assets/templates/add-contact.html"
  );
}

function closeAddContact() {
  document.getElementById("overlay-placeholder").innerHTML = "";
}

