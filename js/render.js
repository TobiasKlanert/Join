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
    getProgressBar(taskIndex);
  }
  proofIfEmpty();
}

function renderTaskDetailDialog(taskId) {
  document.getElementById("taskDetailDialogContainer").innerHTML = "";

  document.getElementById("taskDetailDialogContainer").innerHTML =
    getTaskDetailDialogRef(taskId);
  getAssignedUser(taskId, "dialog");
  getSubtasks(taskId);
  toggleDisplayNone("taskDetailDialogContainer");
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

    switch (contentType) {
      case "card":
        document.getElementById(`boardTaskContacts-${taskId}`).innerHTML += `
          <div style="background-color:${contact.color};" class="board-task-profile-batch" style="z-index: ${taskId + 1}">
            ${contact.initials}
          </div>
        `;
        break;
      case "dialog":
        document.getElementById(`dialogAssignedUser`).innerHTML += `
          <div class="board-task-dialog-assigned-to-user">
            <div style="background-color:${contact.color};" class="board-task-dialog-profile-batch" style="z-index: ${taskId + 1}">
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
  let subtasks = tasks[taskId].subtasks
  
  document.getElementById('dialogSubtasks').innerHTML = '';
  
  for (let subIndex = 0; subIndex < subtasks.length; subIndex++) {
    document.getElementById('dialogSubtasks').innerHTML += `
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
  getSubtasks(taskId);
  getProgressBar(taskId);
}

function getProgressBar(taskId) {
  document.getElementById(`progressBar-${taskId}`).innerHTML = `
  <div class="subtasks-progress" style="width: ${calculateProgress(taskId)}%;"></div>
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
  switch (currentTasks[taskId].category) {
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

async function editContact(contactId) {
  await loadTemplate(
    "overlay-placeholder",
    "../assets/templates/edit-contact.html"
  );
  loadContactsToInput(contactId);
}

async function addContact() {
  await loadTemplate(
    "overlay-placeholder",
    "../assets/templates/add-contact.html"
  );
}

function closeAddContact() {
  document.getElementById("overlay-placeholder").innerHTML = "";
}

/* Vor Abgabe löschen! Testen ob vielleicht doch noch benötigt!  */

/* function removeClassIfPresent(elementId, className) {
  const element = document.getElementById(elementId);
  if (element && element.classList.contains(className)) {
    element.classList.remove(className);
  }
} */

/* function removeHighlighter(contactId) {
  removeClassIfPresent("addTask", "highlight-menu-links-as-active");
  removeClassIfPresent("board", "highlight-menu-links-as-active");
  removeClassIfPresent("contacts", "highlight-menu-links-as-active");
  removeClassIfPresent("summary", "highlight-menu-links-as-active");
  removeClassIfPresent("legalNotice", "highlight-legals-links-as-active");
  removeClassIfPresent("privacyPolicy", "highlight-legals-links-as-active");
  removeClassIfPresent(`contact-${contactId}`, "highlight-contact-as-active")
} */
