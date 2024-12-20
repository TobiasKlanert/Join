/**
 * Returns the HTML-template of the alphabet-list for the contacts.
 * 
 * @returns - The HTML-template of the alphabet-list for the contacts.
 */
function getContactsAlphabetList() {
  return `
              <div id="alphabet-list-a" class="alphabet-list d-non">
                <div class="letter">A</div>
                <div class="seperation-line-container">
                  <div class="seperation-line"></div>
                </div>
              </div>
              <div id="alphabet-list-b" class="alphabet-list d-non">
                <div class="letter">B</div>
                <div class="seperation-line-container">
                  <div class="seperation-line"></div>
                </div>
              </div>
              <div id="alphabet-list-c" class="alphabet-list d-non">
                <div class="letter">C</div>
                <div class="seperation-line-container">
                  <div class="seperation-line"></div>
                </div>
              </div>
              <div id="alphabet-list-d" class="alphabet-list d-non">
                <div class="letter">D</div>
                <div class="seperation-line-container">
                  <div class="seperation-line"></div>
                </div>
              </div>
              <div id="alphabet-list-e" class="alphabet-list d-non">
                <div class="letter">E</div>
                <div class="seperation-line-container">
                  <div class="seperation-line"></div>
                </div>
              </div>
              <div id="alphabet-list-f" class="alphabet-list d-non">
                <div class="letter">F</div>
                <div class="seperation-line-container">
                  <div class="seperation-line"></div>
                </div>
              </div>
              <div id="alphabet-list-g" class="alphabet-list d-non">
                <div class="letter">G</div>
                <div class="seperation-line-container">
                  <div class="seperation-line"></div>
                </div>
              </div>
              <div id="alphabet-list-h" class="alphabet-list d-non">
                <div class="letter">H</div>
                <div class="seperation-line-container">
                  <div class="seperation-line"></div>
                </div>
              </div>
              <div id="alphabet-list-i" class="alphabet-list d-non">
                <div class="letter">I</div>
                <div class="seperation-line-container">
                  <div class="seperation-line"></div>
                </div>
              </div>
              <div id="alphabet-list-j" class="alphabet-list d-non">
                <div class="letter">J</div>
                <div class="seperation-line-container">
                  <div class="seperation-line"></div>
                </div>
              </div>
              <div id="alphabet-list-k" class="alphabet-list d-non">
                <div class="letter">K</div>
                <div class="seperation-line-container">
                  <div class="seperation-line"></div>
                </div>
              </div>
              <div id="alphabet-list-l" class="alphabet-list d-non">
                <div class="letter">L</div>
                <div class="seperation-line-container">
                  <div class="seperation-line"></div>
                </div>
              </div>
              <div id="alphabet-list-m" class="alphabet-list d-non">
                <div class="letter">M</div>
                <div class="seperation-line-container">
                  <div class="seperation-line"></div>
                </div>
              </div>
              <div id="alphabet-list-n" class="alphabet-list d-non">
                <div class="letter">N</div>
                <div class="seperation-line-container">
                  <div class="seperation-line"></div>
                </div>
              </div>
              <div id="alphabet-list-o" class="alphabet-list d-non">
                <div class="letter">O</div>
                <div class="seperation-line-container">
                  <div class="seperation-line"></div>
                </div>
              </div>
              <div id="alphabet-list-p" class="alphabet-list d-non">
                <div class="letter">P</div>
                <div class="seperation-line-container">
                  <div class="seperation-line"></div>
                </div>
              </div>
              <div id="alphabet-list-q" class="alphabet-list d-non">
                <div class="letter">Q</div>
                <div class="seperation-line-container">
                  <div class="seperation-line"></div>
                </div>
              </div>
              <div id="alphabet-list-r" class="alphabet-list d-non">
                <div class="letter">R</div>
                <div class="seperation-line-container">
                  <div class="seperation-line"></div>
                </div>
              </div>
              <div id="alphabet-list-s" class="alphabet-list d-non">
                <div class="letter">S</div>
                <div class="seperation-line-container">
                  <div class="seperation-line"></div>
                </div>
              </div>
              <div id="alphabet-list-t" class="alphabet-list d-non">
                <div class="letter">T</div>
                <div class="seperation-line-container">
                  <div class="seperation-line"></div>
                </div>
              </div>
              <div id="alphabet-list-u" class="alphabet-list d-non">
                <div class="letter">U</div>
                <div class="seperation-line-container">
                  <div class="seperation-line"></div>
                </div>
              </div>
              <div id="alphabet-list-v" class="alphabet-list d-non">
                <div class="letter">V</div>
                <div class="seperation-line-container">
                  <div class="seperation-line"></div>
                </div>
              </div>
              <div id="alphabet-list-w" class="alphabet-list d-non">
                <div class="letter">W</div>
                <div class="seperation-line-container">
                  <div class="seperation-line"></div>
                </div>
              </div>
              <div id="alphabet-list-x" class="alphabet-list d-non">
                <div class="letter">X</div>
                <div class="seperation-line-container">
                  <div class="seperation-line"></div>
                </div>
              </div>
              <div id="alphabet-list-y" class="alphabet-list d-non">
                <div class="letter">Y</div>
                <div class="seperation-line-container">
                  <div class="seperation-line"></div>
                </div>
              </div>
              <div id="alphabet-list-z" class="alphabet-list d-non">
                <div class="letter">Z</div>
                <div class="seperation-line-container">
                  <div class="seperation-line"></div>
                </div>
              </div>
  `;
}

/**
 * Returns the HTML-template for the edit contact dialog.
 * 
 * @param {string} contactId - The id of the contact to be edited.
 * @returns The HTML-template for the edit contact dialog.
 */
function getEditContactRef(contactId) {
  return `
  <div class="overlay" onclick="closeDialog('dialogEditContact', 'overlay-placeholder')">
  <div onclick="stopEventBubbling(event)" id="dialogEditContact" class="contact-dialog dialog hidden">
  
          <button
            onclick="closeDialog('dialogEditContact', 'overlay-placeholder')"
            class="close-button"
          >
            <img src="../assets/img/close-button.svg" alt="" />
          </button>
        
    <div class="contact-dialog-side-header">
      <img
        class="contact-dialog-logo"
        src="../assets/img/join-logo.svg"
        alt="Join Logo"
      />
      <h1 class="contact-dialog-title">Edit contact</h1>
      <img
        class="contact-dialog-vector"
        src="../assets/img/edit-contact-vector.svg"
        alt=""
      />
    </div>

    <div class="contact-dialog-content">
      <div id="contact-dialog-user-image" class="contact-img"></div>
      <div class="contact-dialog-form-wrapper">
        
        <form
          onsubmit="saveEditedContacts(event, 0)"
          class="contact-dialog-form"
        >
          <div class="input-group">
            <input
              class="input-form"
              id="inputEditName"
              type="text"
              placeholder="Name"
            />
            <img
              class="input-icon"
              src="../assets/img/person-form-icon.svg"
              alt=""
            />
          </div>
          <div class="input-group">
            <input
              class="input-form"
              id="inputEditMail"
              type="email"
              placeholder="E-Mail"
              oninput="validateEditMail()"
            />
            <img
              class="input-icon"
              src="../assets/img/mail-form-icon.svg"
              alt=""
            />
          </div>
            <div id="editMail-error" class="error-add-contact"></div>

          <div class="input-group">
            <input
              class="input-form"
              id="inputEditPhone"
              type="tel"
              placeholder="Phone"
              pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
              oninput="this.value = this.value.replace(/[^0-9\-]/g, ''); validateEditPhone()"/>
            <img
              class="input-icon"
              src="../assets/img/phone-form-icon.svg"
              alt=""
            />
          </div>
            
          <div id="editPhone-error" class="error-add-contact"></div>

          <div class="contact-dialog-form-buttons">
            <button onclick="deleteContactOnDialog(${contactId})" id="delete-button-edit-contacts" type="button" class="btn delete ${getOwnUser(contacts[contactId].name, "class")}">Delete</button>
            <button type="submit" id="saveEditButton" class="btn save button-hover-light-blue-background">Save ✓</button>
          </div>
        </form>
      </div>
    </div>
</div>
</div>
  `;
}

/**
 * Returns the HTML-template for the add contact dialog.
 * 
 * @returns The HTML-template for the add contact dialog.
 */
function getAddContactRef() {
  return `
<div class="overlay" onclick="closeDialog('addContact', 'overlay-placeholder')">
  <div onclick="stopEventBubbling(event)" id="addContact" class="contact-dialog dialog hidden">
      <button class="close-button" onclick="closeDialog('addContact', 'overlay-placeholder')">
        <img src="../assets/img/close-button.svg" alt="" />
      </button>
      <div class="contact-side">
        <img
          class="contact-dialog-logo"
          src="../assets//img/join-logo.svg"
          alt="Join Logo"
        />
        <h1 class="contact-title">Add contact</h1>
        <p>Tasks are better with a team!</p>
        <img src="../assets//img/edit-contact-vector.svg" alt="" />
      </div>
      <div class="contact-content">
        <div class="contact-img-profil">
          <img src="../assets//img/profil.png" alt="" />
        </div>
        <form class="contact-form" onsubmit="createContact(); return false;">
          <div class="input-group">
            <input
              id="addContactName"
              class="input-form"
              type="text"
              placeholder="Name"
            />
            <img
              class="input-icon"
              src="../assets//img/person-form-icon.svg"
              alt=""
            />
          </div>
          <div class="input-group">
            <input
              id="addContactMail"
              class="input-form"
              type="email"
              placeholder="Email"
              oninput="validateEmail()"
            />
            <img
              class="input-icon"
              src="../assets//img/mail-form-icon.svg"
              alt=""
            />
          </div>
            <div id="email-error" class="error-add-contact"></div>

          <div class="input-group">
            <input
              id="addContactPhone"
              class="input-form"
              type="tel"
              placeholder="Phone"
              pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
              oninput="this.value = this.value.replace(/[^0-9\-]/g, ''); validateAddContact()" >
            <img
              class="input-icon"
              src="../assets//img/phone-form-icon.svg"
              alt=""
            />
          </div>
            <div id="phone-error" class="error-add-contact"></div>

          <div class="contact-form-buttons two-btn">
            <button
              type="button"
              class="btn-cancel"
              onclick="closeDialog('addContact', 'overlay-placeholder')"
            >
              Cancel X
            </button>
            <button type="submit" class="btn-create">
              Create contact ✓
            </button>
          </div>
        </form>
      </div>
  </div>
</div>
  `;
}