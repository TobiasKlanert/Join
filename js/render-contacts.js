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


