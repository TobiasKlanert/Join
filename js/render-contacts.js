/**
 * Returns the HTML-template for a specific contact.
 *
 * @param {*} index - The unique identifier of the contact.
 * @returns - The HTML-template for a specific contact.
 */
function renderContact(index) {
  let contact = contacts[index];
  return `
          <div id="contact-${index}" class="contact contact-hover" onclick="displayContactInfo(${index}), addMenuHighlighter('contact-${index}', 'contact')">
              <div id="initials-${index + 1}" class="initials">
                  ${contact.initials}
              </div>
              <div class="contact-name-email">
                  <div class="contacts-name">${contact.name}</div>
                  <div class="contacts-email"><a href="#">${
                    contact.email
                  }</a></div>   
              </div>
          </div>
      `;
}

/**
 * Returns the HTML-template for the detailed view of a specific contact.
 *
 * @param {*} contactId - The unique identifier of the contact.
 * @returns - The HTML-template for the detailed view of a specific contact.
 */
function renderUserInfo(contactId) {
  let contact = contacts[contactId];
  return `
      <div class="user-info-name-container">
          <div style="background-color:${
            contact.color
          };" class="user-info-inits">${contact.initials}</div>
          <div class="user-info-name-edit">
              <div class="user-info-name">${contact.name}</div>
              <div class="user-info-edit-delete" >
              <div class="user-info-edit button-hover-light-blue-svg" onclick="editContact(${contactId})">
                  <div class="user-info-img">
                  <img style="color: red" src="../assets/img/edit.svg" alt="" />
                  </div>
                  <div>Edit</div>
              </div>
              <div onclick="deleteContact(${contactId})" class="user-info-delete button-hover-light-blue-svg ${getOwnUser(
                contact.name,
                "class"
              )}">
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

/**
 * Renders the "Add Contact" dialog.
 */
function renderAddContact() {
  if (window.innerWidth < 1000) {
  }
  document.getElementById("overlay-placeholder").innerHTML = "";
  document.getElementById("overlay-placeholder").innerHTML = getAddContactRef();

  toggleDisplayNone("overlay-placeholder");
  toggleDialog("addContact");
  bodyHideScrollbar();
}

/**
 * Renders the contact list sorted alphabetically.
 */
function renderContactsAlphabetList() {
  document.getElementById("alphabet-list-container").innerHTML = "";
  document.getElementById("alphabet-list-container").innerHTML =
    getContactsAlphabetList();
}

function validateAddContact() {
  const input = document.getElementById('addContactPhone');
  const phoneError = document.getElementById('phone-error');
  const phonePattern = /^[0-9]{3}-[0-9]{2}-[0-9]{3}$/;

    if (!phonePattern.test(input.value)) {
      phoneError.classList.add("show"); 
      phoneError.textContent = "Bitte geben Sie eine gültige Telefonnummer im Format 123-45-678 ein.";
    } else {
      phoneError.style.display = 'none'; 
    }
}

function validateEmail() {
  const input = document.getElementById('addContactMail');
  const emailError = document.getElementById('email-error');
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(input.value)) {
      emailError.classList.add("show"); 
      emailError.textContent = "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
    } else {
      emailError.style.display = 'none'; 
    }
}

function validateEditMail() {
  const input = document.getElementById('inputEditMail');
  const editemailError = document.getElementById('editMail-error');
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const saveEditButton = document.getElementById('saveEditButton');

    if (!emailPattern.test(input.value)) {
      editemailError.classList.add("show"); 
      editemailError.textContent = "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
      saveEditButton.disabled = true; 
    } else {
      editemailError.classList.remove("show");
      editemailError.textContent = ""; 
      saveEditButton.disabled = false; 
    }
}

function validateEditPhone() {
  const input = document.getElementById('inputEditPhone');
  const editphoneError = document.getElementById('editPhone-error');
  const phonePattern = /^[0-9]{3}-[0-9]{2}-[0-9]{3}$/;
  const saveEditButton = document.getElementById('saveEditButton');

    if (!phonePattern.test(input.value)) {
      editphoneError.classList.add("show"); 
      editphoneError.textContent = "Bitte geben Sie eine gültige Telefonnummer im Format 123-45-678 ein.";
      saveEditButton.disabled = true; 
    } else {
      editphoneError.style.display = 'none'; 
      saveEditButton.disabled = false; 
    }
}