let prevElement = null;
let prevClassName;

/**
 * Prevents the event from propagating further (event bubbling).
 *
 * @param {Event} event - The event object to stop propagation for.
 */
function stopEventBubbling(event) {
  event.stopPropagation();
}

/**
 * Toggles the CSS class "d-none" on an specified element.
 * This class is used to hide an element by setting its display to "none".
 *
 * @param {string} divId - The ID of the div element whose visibility is to be toggled.
 */
function toggleDisplayNone(divId) {
  document.getElementById(divId).classList.toggle("d-none");
}

/**
 * Loads header and menu templates.
 * Removes menu buttons if no user is logged in.
 * Renders user initials into menu button, if a user is logged in.
 *
 * @param {string} elementId - The ID of the element to highlight.
 * @param {string} elementType - The type of element to highlight.
 * @returns {Promise<void>} - A promise that resolves when all templates are loaded.
 */
async function loadTemplates(elementId, elementType) {
  await loadTemplate("menu-content", "../assets/templates/menu-template.html");
  await loadTemplate(
    "header-content",
    "../assets/templates/header-template.html"
  );
  addMenuHighlighter(elementId, elementType);
  const loginStatus = checkLoginStatus();
  if (loginStatus) {
    removeElements();
  } else {
    getLoggedInUserInitials();
  }
}

/**
 * Calculates and sets the initials of the logged-in user in the menu button.
 * If the user is logged in as a guest, the letter "G" will be displayed.
 */
function getLoggedInUserInitials() {
  let initialsContainer = document.getElementById("userCircle");
  let initials = "";
  const isGuest = localStorage.getItem("isGuest") === "true";

  if (isGuest) {
    initials = "G";
  } else {
    initials = getInitials(localStorage.getItem("name"));
  }

  initialsContainer.innerHTML = "";
  initialsContainer.innerHTML = initials;
}

/**
 * Loads an HTML template from a specified URL and inserts it into the given element.
 *
 * @param {string} elementId - The ID of the element to insert the template into.
 * @param {string} templatePath - The path to the template to load.
 * @returns {Promise<void>} - A promise that resolves when the template has been successfully loaded.
 */
async function loadTemplate(elementId, templatePath) {
  await fetch(templatePath)
    .then((response) => response.text())
    .then((html) => (document.getElementById(elementId).innerHTML = html))
    .catch((error) => console.error("Fehler beim Laden des Templates:", error));
}

/**
 * Highlights the specified menu or contact element and updates its appearance.
 *
 * @param {string} elementId - The ID of the element to highlight.
 * @param {string} elementType - The type of the element (e.g., 'menu' or 'contact').
 */
function addMenuHighlighter(elementId, elementType) {
  const element = document.getElementById(elementId);
  resetContactHighlights();

  if (element) {
    updateElementHighlight(element, elementType, elementId);
  } else {
    return null;
  }
}

/**
 * Removes highlight from all contact elements and restores hover classes.
 */
function resetContactHighlights() {
  for (let index = 0; index < contacts.length; index++) {
    const contact = document.getElementById(`contact-${index}`);
    if (
      contact &&
      contact.classList.contains("highlight-contact-links-as-active")
    ) {
      contact.classList.remove("highlight-contact-links-as-active");
      contact.classList.add("contact-hover");
    }
  }
}

/**
 * Updates the highlight and hover state for the given element based on its type.
 *
 * @param {HTMLElement} element - The DOM element to update.
 * @param {string} elementType - The type of the element (e.g., 'menu' or 'contact').
 * @param {string} elementId - The ID of the element.
 */
function updateElementHighlight(element, elementType, elementId) {
  element.classList.add(`highlight-${elementType}-links-as-active`);
  element.classList.remove(`${elementType}-hover`);

  if (elementType === "menu") {
    updateElementImage(element, elementId);
  }
}

/**
 * Changes the image associated with a menu element to its highlighted version.
 *
 * @param {HTMLElement} element - The menu element whose image will be updated.
 * @param {string} elementId - The ID of the menu element.
 */
function updateElementImage(element, elementId) {
  const imagePath = `../assets/img/${elementId}-icon-highlight.svg`;
  changeImage(element, imagePath);
}

/**
 * Changes the image source for the specified element.
 *
 * @param {HTMLElement} element - The element whose image source needs to be updated.
 * @param {string} imagePath - The new image path to set.
 */
function changeImage(element, imagePath) {
  // Assuming the element contains an <img> tag as its child.
  const img = element.querySelector("img");
  if (img) {
    img.src = imagePath;
  }
}

/**
 * Renders all tasks by resetting columns and adding task content.
 */
function renderTasks() {
  clearTaskColumns();

  for (let taskIndex = 0; taskIndex < currentTasks.length; taskIndex++) {
    renderTask(taskIndex);
  }

  proofIfEmpty();
}

/**
 * Clears the content of all task columns.
 */
function clearTaskColumns() {
  document.getElementById("toDo").innerHTML = "";
  document.getElementById("inProgress").innerHTML = "";
  document.getElementById("awaitFeedback").innerHTML = "";
  document.getElementById("done").innerHTML = "";
}

/**
 * Renders a single task in its respective column and updates its components.
 * @param {number} taskIndex - The index of the task to render.
 */
function renderTask(taskIndex) {
  const columnId = getTaskStatus(taskIndex);
  const taskContent = getTaskContentRef(taskIndex);
  document.getElementById(columnId).innerHTML += taskContent;

  updateTaskComponents(taskIndex);
}

/**
 * Updates additional components for a specific task.
 * @param {number} taskIndex - The index of the task to update.
 */
function updateTaskComponents(taskIndex) {
  getAssignedUser(taskIndex, "card");
  sortContactsByName(
    `boardTaskContacts-${taskIndex}`,
    "board-task-profile-batch",
    "initials"
  );

  if (tasks[taskIndex].subtasks.length > 0) {
    getProgressBar(taskIndex);
  }
}

/**
 * Toggles visibility of a specific dialog.
 *
 * @param {string} element - Name of the dialog to be toggled.
 */
async function toggleDialog(element) {
  setTimeout(() => {
    document.getElementById(element).classList.toggle("hidden");
  }, 1);
}

/**
 * Closes a specific dialog
 *
 * @param {string} dialog - Name of the dialog to be closed.
 * @param {string} overlay - Name of the overlay to be closed.
 */
async function closeDialog(dialog, overlay) {
  toggleDialog(dialog);
  bodyHideScrollbar();
  setTimeout(() => {
    toggleDisplayNone(overlay);
  }, 125);
}

/**
 * Opens the specific dialog to show task details.
 *
 * @param {number} taskId - The id of the task to be opened.
 */
function openTaskDetailDialog(taskId) {
  renderTaskDetailDialog(taskId);
  toggleDisplayNone("overlay-placeholder");
  toggleDialog("boardTaskDialog");
  bodyHideScrollbar();
}

/**
 * Renders the specific dialog to show task details.
 *
 * @param {number} taskId - The id of the task which details are to be shown.
 */
function renderTaskDetailDialog(taskId) {
  document.getElementById("overlay-placeholder").innerHTML = "";

  document.getElementById("overlay-placeholder").innerHTML =
    getTaskDetailDialogRef(taskId);
  getAssignedUser(taskId, "dialog");
  sortContactsByName("dialogAssignedUser", ".fs19px", "fullName");
  if (tasks[taskId].assignedTo.length == 0) {
    document.getElementById("assignedToTitle").classList.add("d-none");
  }
  getSubtasks(taskId);
  if (tasks[taskId].subtasks.length == 0) {
    document.getElementById("subtasksTitle").classList.add("d-none");
  }
}

/**
 * Renders the Add Task dialog or navigates to the Add Task page for smaller screens.
 *
 * @param {string} status - The initial status for the new task.
 */
function renderAddTaskDialog(status) {
  if (window.innerWidth < 500) {
    navigateToAddTaskPage();
  } else {
    setupAddTaskDialog(status);
  }
}

/**
 * Navigates to the Add Task page for smaller screen sizes.
 */
function navigateToAddTaskPage() {
  window.location.href = "../html/add-task.html";
}

/**
 * Sets up and displays the Add Task dialog for larger screens.
 *
 * @param {string} status - The initial status for the new task.
 */
function setupAddTaskDialog(status) {
  currentStatus = status;
  clearOverlayPlaceholder();
  populateOverlayPlaceholder();
  hideReminder();
  assignContacts();
  initializePrioButton("medium");
  toggleDisplayNone("overlay-placeholder");
  toggleDialog("boardAddTaskDialog");
  bodyHideScrollbar();
  styleButtonContainer();
}

/**
 * Clears the content of the overlay placeholder.
 */
function clearOverlayPlaceholder() {
  document.getElementById("overlay-placeholder").innerHTML = "";
}

/**
 * Populates the overlay placeholder with the Add Task dialog content.
 */
function populateOverlayPlaceholder() {
  document.getElementById("overlay-placeholder").innerHTML = getAddTaskRef();
}

/**
 * Hides the reminder element in the Add Task dialog.
 */
function hideReminder() {
  document.querySelector(".reminder").style.display = "none";
}

/**
 * Styles the button container in the Add Task dialog.
 */
function styleButtonContainer() {
  const buttonContainer = document.querySelector(
    ".clear-create-button-container"
  );
  buttonContainer.style.width = "100%";
  buttonContainer.style.justifyContent = "center";
}

/**
 * Checks whether a specific list in the board is empty.
 * If so, the empty list is highlighted.
 */
function proofIfEmpty() {
  let statusList = ["toDo", "inProgress", "awaitFeedback", "done"];

  for (let statusIndex = 0; statusIndex < statusList.length; statusIndex++) {
    let statusContainer = document.getElementById(statusList[statusIndex]);
    if (statusContainer.innerHTML === "") {
      statusContainer.innerHTML = getNoTaskContentRef(statusList[statusIndex]);
    }
  }
}

/**
 * Assigns users to a task and updates the corresponding UI element.
 *
 * @param {number} taskId - The ID of the task.
 * @param {string} contentType - The type of content ('card' or 'dialog').
 */
function getAssignedUser(taskId, contentType) {
  currentTasks[taskId].assignedTo.forEach((assignedIndex) => {
    const contact = contacts[assignedIndex];

    if (contact && contact.IsInContacts) {
      updateAssignedUserUI(taskId, contact, contentType);
    }
  });
}

/**
 * Updates the UI to display an assigned user for a task.
 *
 * @param {number} taskId - The ID of the task.
 * @param {Object} contact - The contact object containing user details.
 * @param {string} contentType - The type of content ('card' or 'dialog').
 */
function updateAssignedUserUI(taskId, contact, contentType) {
  switch (contentType) {
    case "card":
      updateCardUI(taskId, contact);
      break;
    case "dialog":
      updateDialogUI(taskId, contact);
      break;
  }
}

/**
 * Updates the card UI to display an assigned user.
 *
 * @param {number} taskId - The ID of the task.
 * @param {Object} contact - The contact object containing user details.
 */
function updateCardUI(taskId, contact) {
  const cardContainer = document.getElementById(`boardTaskContacts-${taskId}`);
  cardContainer.innerHTML += `
    <div style="background-color:${
      contact.color
    };" class="board-task-profile-batch" style="z-index: ${taskId + 1}">
      ${contact.initials}
    </div>
  `;
}

/**
 * Updates the dialog UI to display an assigned user.
 *
 * @param {number} taskId - The ID of the task.
 * @param {Object} contact - The contact object containing user details.
 */
function updateDialogUI(taskId, contact) {
  const dialogContainer = document.getElementById("dialogAssignedUser");
  dialogContainer.innerHTML += `
    <div class="board-task-dialog-assigned-to-user">
      <div style="background-color:${
        contact.color
      };" class="board-task-dialog-profile-batch" style="z-index: ${
    taskId + 1
  }">
        ${contact.initials}
      </div>
      <span class="fs19px">${contact.name}</span>
    </div>
  `;
}

/**
 * Renders the subtasks of a specific task.
 *
 * @param {number} taskId - The id of the task which subtasks should be loaded.
 */
function getSubtasks(taskId) {
  let subtasks = tasks[taskId].subtasks;

  document.getElementById("dialogSubtasks").innerHTML = "";

  for (let subIndex = 0; subIndex < subtasks.length; subIndex++) {
    document.getElementById("dialogSubtasks").innerHTML += `
      <div onclick="changeSubtaskStatus(${taskId}, ${subIndex})" class="board-task-dialog-subtasks-list-element">
        <img
          src="../assets/img/check-button-${subtasks[subIndex].done}.svg"
          alt=""
        />
        <span class="subtasks-text">${subtasks[subIndex].title}</span>
      </div>
    `;
  }
}

/**
 * Switches the status of a subtask of a specific task ('done' or 'undone').
 * Saves the change in local storage and updates the progress bar.
 *
 * @param {number} taskId - The id of the task which subtasks are changed.
 * @param {number} subId - The id of the subtask which is changed.
 */
function changeSubtaskStatus(taskId, subId) {
  let subtask = tasks[taskId].subtasks[subId];

  switch (subtask.done) {
    case true:
      subtask.done = false;
      break;
    case false:
      subtask.done = true;
      break;
  }
  saveToLocalStorage("tasks", tasks);
  getSubtasks(taskId);
  getProgressBar(taskId);
}

/**
 * Renders the progress bar of a specific task.
 *
 * @param {number} taskId - The id of the task for which the progress bar is to be displayed.
 */
function getProgressBar(taskId) {
  document.getElementById(`progressBar-${taskId}`).innerHTML = `
    <div class="subtasks-progress-bar">
      <div class="subtasks-progress" style="width: ${calculateProgress(
        taskId
      )}%; background-color: ${getProgressBarColor(taskId)};"></div>
    </div>
    <span>${getTasksDone(taskId)}/${
    tasks[taskId].subtasks.length
  } Subtasks</span>
  `;
}

/**
 * Returns the description of an empty status list in board.
 *
 * @param {string} status - The name of the empty list.
 * @returns - The description of an empty list.
 */
function getStatusDescription(status) {
  switch (status) {
    case "toDo":
      return "to do";
    case "inProgress":
      return "in progress";
    case "awaitFeedback":
      return "await feedback";
    case "done":
      return "are done";
  }
}

/**
 * Returns the status of a specific task.
 *
 * @param {number} taskId - The ID of the task whose status is required.
 * @returns - The status of a specific task.
 */
function getTaskStatus(taskId) {
  switch (currentTasks[taskId].status) {
    case "toDo":
      return "toDo";
    case "inProgress":
      return "inProgress";
    case "awaitFeedback":
      return "awaitFeedback";
    case "done":
      return "done";
  }
}

/**
 * Determines the label of a task.
 *
 * @param {number} taskId - The id of the task which label is needed.
 * @returns - The CSS class for the label of a specific task.
 */
function getTaskLabel(taskId) {
  let category = currentTasks[taskId].category;
  category = category.toLowerCase();

  switch (category) {
    case "user story":
      return "label-user-story";
    case "technical task":
      return "label-technical-task";
  }
}

/**
 * Retrieves the number of completed subtasks for a given task.
 *
 * @param {number} taskId - The unique identifier of the task.
 * @returns {number} The number of subtasks marked as done.
 */
function getTasksDone(taskId) {
  let task = currentTasks[taskId];
  let tasksDone = 0;

  for (indexSubtask = 0; indexSubtask < task.subtasks.length; indexSubtask++) {
    if (task.subtasks[indexSubtask].done) {
      tasksDone += 1;
    }
  }
  return tasksDone;
}

/**
 * Calculates the progress of a task as a percentage.
 *
 * @param {number} taskId - The unique identifier of the task.
 * @returns {number} The progress percentage of the task (0 to 100).
 */
function calculateProgress(taskId) {
  return (getTasksDone(taskId) / currentTasks[taskId].subtasks.length) * 100;
}

/**
 * Determines the progress bar color based on the progress of a task.
 *
 * @param {number} taskId - The unique identifier of the task.
 * @returns {string} A hex color code representing the progress bar color.
 *                   `#4589ff` for incomplete tasks, `#7AE229` for completed tasks.
 */
function getProgressBarColor(taskId) {
  if (calculateProgress(taskId) < 100) {
    return `#4589ff`;
  } else {
    return `#7AE229`;
  }
}

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
            <div class="user-info-delete button-hover-light-blue-svg ${getOwnUser(
              contact.name,
              "class"
            )}">
                <div class="user-info-img">
                <img src="../assets/img/delete.svg" alt="" />
                </div>
                <div onclick="deleteContact(${contactId})">Delete</div>
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
 * Changes the source of an image within a specified link element.
 *
 * @param {HTMLElement} link - The link element containing the image.
 * @param {string} imageUrl - The new source URL for the image.
 */
function changeImage(link, imageUrl) {
  link.querySelector("img").src = imageUrl;
}

/**
 * Renders the edit task dialog for a specified task.
 *
 * @param {number} taskId - The unique identifier of the task to edit.
 * @returns {Promise<void>} A promise that resolves when the task dialog is rendered.
 */
async function renderEditTask(taskId) {
  document.getElementById("overlay-placeholder").innerHTML = "";
  document.getElementById("overlay-placeholder").innerHTML =
    getEditTaskDialog(taskId);
  loadTaskToInput(taskId);
  initializePrioButton(tasks[taskId].prio);
  assignContacts();
  sortContactsByName("initials-container", "assign-initials", "initials");
  loadSubtasks(taskId);
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

/**
 * Shortens a description to a specified maximum length, appending ellipses if truncated.
 *
 * @param {string} description - The original description text.
 * @param {number} maxLength - The maximum allowed length of the shortened description.
 * @returns {string} The shortened description, with "..." if truncated.
 */
function getShortenedDescription(description, maxLength) {
  if (description.length > maxLength) {
    return description.substring(0, maxLength) + "...";
  }
  return description;
}

/**
 * Initializes the "Medium" priority button by applying styles and setting its priority state.
 */
function initializeMediumButton() {
  const mediumButton = document.getElementById("medium");
  const mediumColorClass = ".medium-color";
  const mediumSvg = document.querySelector(mediumColorClass);

  mediumButton.classList.add("is-inverted", "color-white");
  mediumButton.style.backgroundColor = window
    .getComputedStyle(mediumSvg, null)
    .getPropertyValue("fill");

  document.querySelectorAll(mediumColorClass).forEach((e) => {
    e.classList.add("fill-color-white");
  });

  prevElement = mediumButton;
  prevClassName = mediumColorClass;
  priority = "medium";
}

/**
 * Initializes a priority button based on the specified priority type.
 *
 * @param {string} prio - The priority type (e.g., "low", "medium", "urgent").
 */
function initializePrioButton(prio) {
  const button = document.getElementById(prio);
  const colorClass = `.${prio}-color`;
  const svg = document.querySelector(colorClass);

  button.classList.add("is-inverted", "color-white");
  button.style.backgroundColor = window
    .getComputedStyle(svg, null)
    .getPropertyValue("fill");

  document.querySelectorAll(colorClass).forEach((e) => {
    e.classList.add("fill-color-white");
  });

  prevElement = button;
  prevClassName = colorClass;
  priority = prio;
}

/**
 * Updates the priority button colors and handles toggling of the selected state.
 *
 * @param {string} className - The CSS class of the element to update.
 * @param {string} id - The ID of the button to update.
 * @param {string} prio - The new priority type (e.g., "low", "medium", "urgent").
 */
function changeColors(className, id, prio) {
  let element = document.getElementById(id);

  if (isPrevButtonInverted(prevElement, element)) {
    invertColors(prevClassName, prevElement);
  }
  invertColors(className, element);
  prevElement = element;
  prevClassName = className;
  priority = prio;
}

/**
 * Checks if the previously selected button is inverted (i.e., in the toggled state).
 *
 * @param {HTMLElement|null} prevElement - The previously selected element.
 * @param {HTMLElement} element - The currently selected element.
 * @returns {boolean} True if the previous button is inverted; otherwise, false.
 */
function isPrevButtonInverted(prevElement, element) {
  if (
    prevElement != null &&
    prevElement != element &&
    prevElement.classList.contains("is-inverted")
  ) {
    return true;
  }
  return false;
}

/**
 * Toggles the color inversion for a specified element and updates its styles.
 *
 * @param {string} className - The CSS class for the SVG element to update.
 * @param {HTMLElement} element - The button element to update.
 */
function invertColors(className, element) {
  element.classList.toggle("is-inverted");

  let svg = document.querySelector(className);
  let fillColor = window.getComputedStyle(svg, null).getPropertyValue("fill");
  element.style.backgroundColor = fillColor;

  let svgPaths = document.querySelectorAll(className);
  svgPaths.forEach((e) => {
    e.classList.toggle("fill-color-white");
  });

  element.classList.toggle("color-white");
}

/**
 * Sorts the children of a container element by the specified key.
 *
 * @param {string} element - The ID of the container element.
 * @param {string} selector - The selector used to extract text content for sorting.
 * @param {string} key - The sorting key ('fullName' or 'initials').
 */
function sortContactsByName(element, selector, key) {
  const container = document.getElementById(element);
  const templates = Array.from(container.children);

  switch (key) {
    case "fullName":
      sortByFullName(templates, selector);
      break;
    case "initials":
      sortByInitials(templates);
      break;
  }
  appendSortedTemplates(container, templates);
}

/**
 * Determines if a contact element refers to the current user.
 *
 * @param {HTMLElement} contact - The contact element to check.
 * @param {string} selector - The selector used to extract the contact name.
 * @returns {boolean} True if the contact is the current user, false otherwise.
 */
function isYou(contact, selector) {
  const name = contact.querySelector(selector).textContent.trim().toLowerCase();
  return name.includes("(you)");
}

/**
 * Sorts an array of templates by full name.
 *
 * @param {HTMLElement[]} templates - The array of template elements to sort.
 * @param {string} selector - The selector used to extract text content for sorting.
 */
function sortByFullName(templates, selector) {
  templates.sort((a, b) => {
    const nameA = a.querySelector(selector).textContent.trim().toLowerCase();
    const nameB = b.querySelector(selector).textContent.trim().toLowerCase();

    if (isYou(a, selector)) return -1;
    if (isYou(b, selector)) return 1;

    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });
}

/**
 * Sorts an array of templates by initials.
 *
 * @param {HTMLElement[]} templates - The array of template elements to sort.
 */
function sortByInitials(templates) {
  templates.sort((a, b) => {
    const initialsA = a.textContent.trim();
    const initialsB = b.textContent.trim();

    if (initialsA < initialsB) return -1;
    if (initialsA > initialsB) return 1;
    return 0;
  });
}

/**
 * Appends the sorted templates back to the container element.
 *
 * @param {HTMLElement} container - The container element to update.
 * @param {HTMLElement[]} templates - The sorted array of template elements.
 */
function appendSortedTemplates(container, templates) {
  templates.forEach((template) => container.appendChild(template));
}

/**
 * Toggles the scrollbar of the HTML body.
 */
function bodyHideScrollbar() {
  document.body.classList.toggle("no-scroll");
}

/**
 * Toggles the visibility and icons for a password input field based on the event type.
 * 
 * @param {string} eventType - The type of event ('input' or 'click').
 * @param {string} inputType - The ID of the password input element.
 * @param {string} imgType - The ID of the image element for toggling icons.
 */
function togglePasswordIcons(eventType, inputType, imgType) {
  const passwordInput = document.getElementById(inputType);
  const togglePassword = document.getElementById(imgType);

  if (eventType === "input") {
    handleInputEvent(passwordInput, togglePassword);
  } else if (eventType === "click") {
    handleClickEvent(passwordInput, togglePassword);
  }
}

/**
 * Handles the "input" event for a password field to toggle the icon based on input value.
 * 
 * @param {HTMLElement} passwordInput - The password input element.
 * @param {HTMLElement} togglePassword - The image element for the toggle icon.
 */
function handleInputEvent(passwordInput, togglePassword) {
  if (passwordInput.value.trim() !== "") {
    togglePassword.src = "../assets/img/eye-slash.png";
  } else {
    togglePassword.src = "../assets/img/password-log-in.svg";
  }
}

/**
 * Handles the "click" event for a password field to toggle visibility and icon.
 * 
 * @param {HTMLElement} passwordInput - The password input element.
 * @param {HTMLElement} togglePassword - The image element for the toggle icon.
 */
function handleClickEvent(passwordInput, togglePassword) {
  if (togglePassword.src.includes("eye-slash.png")) {
    togglePassword.src = "../assets/img/eye-icon.png";
    passwordInput.type = "text";
  } else {
    togglePassword.src = "../assets/img/eye-slash.png";
    passwordInput.type = "password";
  }
}

/**
 * Retrieves information about the current user based on their name and the requested output type.
 *
 * @param {string} name - The name of the user to check.
 * @param {string} element - The output type, either "class" or "string".
 *                           If "class", returns "disabled" for the current user.
 *                           If "string", returns "(You)" for the current user.
 * @returns {string} A string indicating whether the user is the current user:
 *                   - "disabled" if `element` is "class" and the user matches.
 *                   - "(You)" if `element` is "string" and the user matches.
 *                   - An empty string ("") if the user does not match.
 */
function getOwnUser(name, element) {
  const contacts = JSON.parse(localStorage.getItem("contacts")) || [];
  const ownUser = contacts.find((contact) => contact.isOwnUser);

  if (ownUser && ownUser.name === name) {
    if (element == "class") {
      return "disabled";
    } else if (element == "string") {
      return "(You)";
    }
  }
  return "";
}
