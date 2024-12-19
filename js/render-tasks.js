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
 * Opens the specific dialog to show task details.
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
 * @param {string} status - The initial status for the new task.
 */
function renderAddTaskDialog(status) {
  assignedWorker = [];
  if (window.innerWidth < 500) {
    navigateToAddTaskPage();
  } else {
    setupAddTaskDialog(status);
    initOverlayEventListener("boardAddTaskDialog");
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
 * Renders the subtasks of a specific task.
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
 * @param {number} taskId - The unique identifier of the task.
 * @returns {number} The progress percentage of the task (0 to 100).
 */
function calculateProgress(taskId) {
  return (getTasksDone(taskId) / currentTasks[taskId].subtasks.length) * 100;
}

/**
 * Determines the progress bar color based on the progress of a task.
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
