let prevElement = null;
let prevClassName;

function stopEventBubbling(event) {
  event.stopPropagation();
}

function toggleDisplayNone(divId) {
  document.getElementById(divId).classList.toggle("d-none");
}

async function loadTemplates(elementId, elementType) {
  await loadTemplate("menu-content", "../assets/templates/menu-template.html");
  await loadTemplate(
    "header-content",
    "../assets/templates/header-template.html"
  );
  addMenuHighlighter(elementId, elementType);
  checkLoginStatus();
}

function getLoggedInUserInitials() {
  
}

async function loadTemplate(elementId, templatePath) {
  await fetch(templatePath)
    .then((response) => response.text())
    .then((html) => (document.getElementById(elementId).innerHTML = html))
    .catch((error) => console.error("Fehler beim Laden des Templates:", error));
}

function addMenuHighlighter(elementId, elementType) {
  const element = document.getElementById(elementId);
  for (index = 0; index < contacts.length; index++) {
    let contact = document.getElementById(`contact-${index}`);
    if (
      contact &&
      contact.classList.contains("highlight-contact-links-as-active")
    ) {
      contact.classList.remove("highlight-contact-links-as-active");
      contact.classList.add("contact-hover");
    }
  }
  if (element) {
    element.classList.add(`highlight-${elementType}-links-as-active`);
    element.classList.remove(`${elementType}-hover`);
    if (elementType == "menu") {
      changeImage(element, `../assets/img/${elementId}-icon-highlight.svg`);
    }
  } else {
    return null;
  }
}

function renderTasks() {
  document.getElementById("toDo").innerHTML = "";
  document.getElementById("inProgress").innerHTML = "";
  document.getElementById("awaitFeedback").innerHTML = "";
  document.getElementById("done").innerHTML = "";

  for (let taskIndex = 0; taskIndex < currentTasks.length; taskIndex++) {
    document.getElementById(getTaskStatus(taskIndex)).innerHTML +=
      getTaskContentRef(taskIndex);
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
  proofIfEmpty();
}

function toggleDialog(element) {
  setTimeout(() => {
    document.getElementById(element).classList.toggle("hidden");
  }, 1);
}

function closeDialog(dialog, overlay) {
  toggleDialog(dialog);
  bodyHideScrollbar();
  setTimeout(() => {
    toggleDisplayNone(overlay);
  }, 125);
}

function openTaskDetailDialog(taskId) {
  renderTaskDetailDialog(taskId);
  toggleDisplayNone("overlay-placeholder");
  toggleDialog("boardTaskDialog");
  bodyHideScrollbar();
}

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

function renderAddTaskDialog(status) {
  currentStatus = status;
  document.getElementById("overlay-placeholder").innerHTML = "";

  document.getElementById("overlay-placeholder").innerHTML = getAddTaskRef();
  assignContacts();
  initializePrioButton("medium");
  toggleDisplayNone("overlay-placeholder");
  toggleDialog("boardAddTaskDialog");
  bodyHideScrollbar();
}

function proofIfEmpty() {
  let statusList = ["toDo", "inProgress", "awaitFeedback", "done"];

  for (let statusIndex = 0; statusIndex < statusList.length; statusIndex++) {
    let statusContainer = document.getElementById(statusList[statusIndex]);
    if (statusContainer.innerHTML === "") {
      statusContainer.innerHTML = getNoTaskContentRef(statusList[statusIndex]);
    }
  }
}

function getAssignedUser(taskId, contentType) {
  for (let index = 0; index < currentTasks[taskId].assignedTo.length; index++) {
    let contact = contacts[currentTasks[taskId].assignedTo[index]];

    if (!contact || !contact.IsInContacts) {
      continue;
    }

    switch (contentType) {
      case "card":
        document.getElementById(`boardTaskContacts-${taskId}`).innerHTML += `
          <div style="background-color:${
            contact.color
          };" class="board-task-profile-batch" style="z-index: ${taskId + 1}">
            ${contact.initials}
          </div>
        `;
        break;
      case "dialog":
        document.getElementById(`dialogAssignedUser`).innerHTML += `
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
        break;
    }
  }
}

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
        <span>${subtasks[subIndex].title}</span>
      </div>
    `;
  }
}

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

function calculateProgress(taskId) {
  return (getTasksDone(taskId) / currentTasks[taskId].subtasks.length) * 100;
}

function getProgressBarColor(taskId) {
  if (calculateProgress(taskId) < 100) {
    return `#4589ff`;
  } else {
    return `#7AE229`;
  }
}

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

function changeImage(link, imageUrl) {
  link.querySelector("img").src = imageUrl;
}

async function renderEditTask(taskId) {
  document.getElementById("overlay-placeholder").innerHTML = "";
  document.getElementById("overlay-placeholder").innerHTML =
    getEditTaskDialog(taskId);
  loadTaskToInput(taskId);
  initializePrioButton(tasks[taskId].prio)
  assignContacts();
  sortContactsByName("initials-container", "assign-initials", "initials");
  loadSubtasks(taskId);
}

/* async function addContact() {
  await loadTemplate(
    "overlay-placeholder",
    "../assets/templates/add-contact.html"
  );
} */

function renderAddContact() {
  if (window.innerWidth < 1000) {
    
  }
  document.getElementById("overlay-placeholder").innerHTML = '';
  document.getElementById("overlay-placeholder").innerHTML = getAddContactRef();

  toggleDisplayNone("overlay-placeholder");
  toggleDialog("addContact");
  bodyHideScrollbar();
}

function renderContactsAlphabetList() {
  document.getElementById("alphabet-list-container").innerHTML = '';
  document.getElementById("alphabet-list-container").innerHTML = getContactsAlphabetList();
}

/* function closeAddContact() {
  document.getElementById("overlay-placeholder").innerHTML = "";
} */

function getShortenedDescription(description, maxLength) {
  if (description.length > maxLength) {
    return description.substring(0, maxLength) + "...";
  }
  return description;
}

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


function changeColors(className, id, prio) {
  let element = document.getElementById(id);
  console.log(element);
  
  if (isPrevButtonInverted(prevElement, element)) {
    invertColors(prevClassName, prevElement);
  }
  invertColors(className, element);
  prevElement = element;
  prevClassName = className;
  priority = prio;
}

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

function updateButtonColorsBasedOnTask(taskId) {
  const task = tasks[taskId];

  if (!task || !task.prio) {
    return;
  }

  // Map priority on buttons
  const prioToButton = {
    urgent: document.getElementById('high'),
    medium: document.getElementById('medium'),
    low: document.getElementById('low'),
  };

  // Set current button based on priority
  const selectedButton = prioToButton[task.prio];

  prevElement = null;
  prevClassName = null;
  console.log(prioToButton);
  
  console.log(selectedButton);
  changeColors(`.${task.prio}-color`, selectedButton, task.prio);
}
  

function sortContactsByName(element, selector, key) {
  // Selektiere den Container, der alle Templates enthält
  const container = document.getElementById(element);

  // Sammle alle direkten Kinder des Containers (die Templates)
  const templates = Array.from(container.children);

  switch (key) {
    case "fullName":
      templates.sort((a, b) => {
        const nameA = a
          .querySelector(selector)
          .textContent.trim()
          .toLowerCase();
        const nameB = b
          .querySelector(selector)
          .textContent.trim()
          .toLowerCase();

        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });
    case "initials":
      templates.sort((a, b) => {
        const initialsA = a.textContent.trim();
        const initialsB = b.textContent.trim();

        if (initialsA < initialsB) return -1;
        if (initialsA > initialsB) return 1;
        return 0;
      });
  }

  // Sortiere die Templates basierend auf dem Text im .contacts-name-Div

  // Sortierte Templates neu anordnen
  templates.forEach((template) => container.appendChild(template));
}

function bodyHideScrollbar() {
  document.body.classList.toggle("no-scroll");
}