/**
 * Renders the Add Task dialog or navigates to the Add Task page for smaller screens.
 * @param {string} status - The initial status for the new task.
 */
function renderAddTaskDialog(status) {
  assignedWorker = [];
  if (window.innerWidth < 500) {
    navigateToAddTaskPage();
  } else {
    setupAddTaskDialog(status);
    initOverlayEventListener("boardAddTaskDialog", "overlayAddTask");
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
 * Handles the process of displaying users based on content type.
 * @param {number} taskId - The ID of the task.
 * @param {string} contentType - The type of content ('card' or 'dialog').
 */
function getAssignedUser(taskId, contentType) {
  const assignedUsers = currentTasks[taskId].assignedTo;

  if (contentType === "dialog") {
    displayAllUsers(assignedUsers, taskId, contentType);
  } else if (contentType === "card") {
    displayMaxFiveUsers(assignedUsers, taskId, contentType);
  }
}

/**
 * Displays all users for a task when contentType is "dialog".
 * @param {Array} assignedUsers - The list of assigned user indices.
 * @param {number} taskId - The ID of the task.
 * @param {string} contentType - The type of content ('card' or 'dialog').
 */
function displayAllUsers(assignedUsers, taskId, contentType) {
  assignedUsers.forEach((assignedIndex) => {
    const contact = contacts[assignedIndex];
    if (contact && contact.IsInContacts) {
      updateAssignedUserUI(taskId, contact, contentType);
    }
  });
}

/**
 * Displays the first five users for a task when contentType is "card".
 * If there are more than five, shows the number of remaining users.
 * @param {Array} assignedUsers - The list of assigned user indices.
 * @param {number} taskId - The ID of the task.
 * @param {string} contentType - The type of content ('card' or 'dialog').
 */
function displayMaxFiveUsers(assignedUsers, taskId, contentType) {
  let displayedUsers = 0;

  assignedUsers.forEach((assignedIndex) => {
    const contact = contacts[assignedIndex];
    if (contact && contact.IsInContacts) {
      if (displayedUsers < 5) {
        updateAssignedUserUI(taskId, contact, contentType);
        displayedUsers++;
      }
    }
  });

  if (assignedUsers.length > 5) {
    showRemainingContacts(assignedUsers.length - 5, taskId, contentType);
  }
}

/**
 * Displays the number of remaining contacts when there are more than 5.
 * @param {number} remainingContacts - The number of remaining contacts.
 * @param {number} taskId - The ID of the task.
 * @param {string} contentType - The type of content ('card' or 'dialog').
 */
function showRemainingContacts(remainingContacts, taskId, contentType) {
  const remainingContact = {
    color: "#ccc", // Neutral color for the "remaining" contact
    initials: `(+${remainingContacts})`, // Text showing remaining contacts
  };
  
  updateAssignedUserUI(taskId, remainingContact, contentType);
}


/**
 * Updates the UI to display an assigned user for a task.
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
 * Renders the edit task dialog for a specified task.
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
  getAssignedContacts(taskId);
  sortContactsByName("initials-container", "assign-initials", "initials");
  loadSubtasks(taskId);
  initOverlayEventListener("dialogEditTask", "overlayEditTask");
}

/**
 * Determines the assigned contacts and activates the checkboxes in the dropdown list.
 * 
 * @param {number} taskId - The id of the task whose contacts are determined.
 */
function getAssignedContacts(taskId) {
  const assignedContacts = tasks[taskId].assignedTo;
  assignedContacts.forEach(contactId => {
    const contactElement = document.getElementById(`rendered-options-container-${contactId}`);
    if (contactElement) {
      contactElement.classList.add('bg-dark', 'col-white');
      contactElement.classList.remove('hover-enabler');
      const checkbox = contactElement.querySelector('input[type="checkbox"]');
      
      if (checkbox) {
        checkbox.classList.add('is-checked');
        checkbox.checked = true;
      }
    }
  });
}
