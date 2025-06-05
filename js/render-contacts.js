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
  initializeContactFormValidation(
    "addContactName",
    "addContactMail",
    "addContactPhone",
    "saveAddButton",
    "errorAddContact"
  );
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

/**
 * Retrieves form elements by their respective IDs.
 *
 * @param {string} name - The ID of the name input element.
 * @param {string} mail - The ID of the email input element.
 * @param {string} phone - The ID of the phone input element.
 * @param {string} save - The ID of the save button element.
 * @param {string} error - The ID of the error container element.
 * @returns {Object} An object containing the form elements: inputName, inputMail, inputPhone, saveButton, and errorContainer.
 */
function getFormElements(name, mail, phone, save, error) {
  const inputName = document.getElementById(name);
  const inputMail = document.getElementById(mail);
  const inputPhone = document.getElementById(phone);
  const saveButton = document.getElementById(save);
  const errorContainer = document.getElementById(error);
  return { inputName, inputMail, inputPhone, saveButton, errorContainer };
}

/**
 * Clears the content of the error container.
 *
 * @param {HTMLElement} errorContainer - The DOM element containing error messages to be cleared.
 */
function clearErrorContainer(errorContainer) {
  errorContainer.innerHTML = "";
}

/**
 * Validates a form field against a regular expression pattern.
 *
 * @param {string} value - The value to be validated.
 * @param {RegExp} pattern - The regular expression pattern for validation.
 * @param {HTMLElement} element - The DOM element representing the input field.
 * @param {string} errorMessage - The error message to display if validation fails.
 * @param {HTMLElement} errorContainer - The DOM element to display the error message in.
 * @returns {boolean} `true` if the value matches the pattern, `false` otherwise.
 */
function validateField(value, pattern, element, errorMessage, errorContainer) {
  if (!pattern.test(value.trim())) {
    element.parentElement.classList.add("invalid");
    errorContainer.innerHTML += `<p>${errorMessage}</p>`;
    return false;
  } else {
    element.parentElement.classList.remove("invalid");
    return true;
  }
}

/**
 * Validates the name field.
 *
 * @param {HTMLElement} inputName - The name input element.
 * @param {HTMLElement} errorContainer - The DOM element to display error messages.
 * @param {boolean} showErrors - Whether to show error messages.
 * @returns {boolean} `true` if the name is valid, `false` otherwise.
 */
function validateName(inputName, errorContainer, showErrors) {
  if (!inputName.value.trim()) {
    if (showErrors) {
      inputName.parentElement.classList.add("invalid");
      errorContainer.innerHTML += "<p>Please enter a name.</p>";
    }
    return false;
  }
  inputName.parentElement.classList.remove("invalid");
  return true;
}

/**
 * Validates the email field.
 *
 * @param {HTMLElement} inputMail - The email input element.
 * @param {HTMLElement} errorContainer - The DOM element to display error messages.
 * @returns {boolean} `true` if the email is valid, `false` otherwise.
 */
function validateEmail(inputMail, errorContainer) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
  return validateField(
    inputMail.value,
    emailPattern,
    inputMail,
    "Please enter a valid e-mail address.",
    errorContainer
  );
}

/**
 * Validates the phone number field.
 *
 * @param {HTMLElement} inputPhone - The phone number input element.
 * @param {HTMLElement} errorContainer - The DOM element to display error messages.
 * @returns {boolean} `true` if the phone number is valid, `false` otherwise.
 */
function validatePhone(inputPhone, errorContainer) {
  const phonePattern = /^\+?[0-9 ]+$/;
  return validateField(
    inputPhone.value,
    phonePattern,
    inputPhone,
    "Please enter a valid phone number.",
    errorContainer
  );
}

/**
 * Handles the results of the validation, showing error messages and controlling the save button state.
 *
 * @param {boolean} isValid - Whether the form is valid.
 * @param {HTMLElement} errorContainer - The DOM element to display error messages.
 * @param {number} invalidFieldsCount - The number of invalid fields.
 * @param {HTMLElement} saveButton - The save button element.
 * @param {boolean} showErrors - Whether to show error messages.
 */
function handleValidationResults(
  isValid,
  errorContainer,
  invalidFieldsCount,
  saveButton,
  showErrors
) {
  if (invalidFieldsCount > 1 && showErrors) {
    errorContainer.innerHTML = "<p>Please fill in all fields correctly.</p>";
  }
  toggleErrorContainerVisibility(invalidFieldsCount, errorContainer);
  toggleSaveButton(isValid, saveButton);
}

/**
 * Toggles the visibility of the error container based on the number of invalid fields.
 *
 * @param {number} invalidFieldsCount - The number of invalid fields.
 * @param {HTMLElement} errorContainer - The DOM element containing the error messages.
 */
function toggleErrorContainerVisibility(invalidFieldsCount, errorContainer) {
  if (invalidFieldsCount > 0) {
    errorContainer.classList.add("show");
  } else {
    errorContainer.classList.remove("show");
  }
}

/**
 * Toggles the disabled state and styling of the save button based on form validity.
 *
 * @param {boolean} isValid - Whether the form is valid.
 * @param {HTMLElement} saveButton - The save button element.
 */
function toggleSaveButton(isValid, saveButton) {
  saveButton.disabled = !isValid;
  if (!saveButton.disabled) {
    saveButton.classList.add("button-hover-light-blue-background");
  } else {
    saveButton.classList.remove("button-hover-light-blue-background");
  }
}

/**
 * Initializes the save button based on whether all fields are filled.
 *
 * @param {HTMLElement} inputName - The name input element.
 * @param {HTMLElement} inputMail - The email input element.
 * @param {HTMLElement} inputPhone - The phone input element.
 * @param {HTMLElement} saveButton - The save button element.
 */
function initializeSaveButton(inputName, inputMail, inputPhone, saveButton) {
  const enableSaveButton = () => {
    const allFieldsFilled =
      inputName.value.trim() &&
      inputMail.value.trim() &&
      inputPhone.value.trim();
    saveButton.disabled = !allFieldsFilled;
    if (allFieldsFilled) {
      saveButton.classList.add("button-hover-light-blue-background");
    } else {
      saveButton.classList.remove("button-hover-light-blue-background");
    }
  };

  inputName.addEventListener("input", enableSaveButton);
  inputMail.addEventListener("input", enableSaveButton);
  inputPhone.addEventListener("input", enableSaveButton);
}

/**
 * Initializes the contact form validation by setting up event listeners and handling validation.
 *
 * @param {string} name - The ID of the name input element.
 * @param {string} mail - The ID of the email input element.
 * @param {string} phone - The ID of the phone input element.
 * @param {string} save - The ID of the save button element.
 * @param {string} error - The ID of the error container element.
 */
function initializeContactFormValidation(name, mail, phone, save, error) {
  const { inputName, inputMail, inputPhone, saveButton, errorContainer } =
    getFormElements(name, mail, phone, save, error);

  saveButton.classList.remove("button-hover-light-blue-background");

  const validateFields = (showErrors) => {
    let isValid = true;
    let invalidFieldsCount = 0;

    clearErrorContainer(errorContainer);

    if (!validateName(inputName, errorContainer, showErrors)) {
      invalidFieldsCount++;
      isValid = false;
    }

    if (!validateEmail(inputMail, errorContainer, showErrors)) {
      invalidFieldsCount++;
      isValid = false;
    }

    if (!validatePhone(inputPhone, errorContainer, showErrors)) {
      invalidFieldsCount++;
      isValid = false;
    }

    handleValidationResults(
      isValid,
      errorContainer,
      invalidFieldsCount,
      saveButton,
      showErrors
    );
  };

  if (save === "saveAddButton") {
    saveButton.addEventListener("click", () => validateFields(true));
    initializeSaveButton(inputName, inputMail, inputPhone, saveButton);
  } else if (save === "saveEditButton") {
    inputName.addEventListener("input", () => validateFields(true));
    inputMail.addEventListener("input", () => validateFields(true));
    inputPhone.addEventListener("input", () => validateFields(true));

    validateFields(true);
  }
}