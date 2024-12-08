let currentDraggedElement;

function filterTasks() {
  const searchInputField = document.getElementById("searchInputField");
  const searchInput = searchInputField.value;

  currentTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchInput.toLowerCase()) ||
      task.description.toLowerCase().includes(searchInput.toLowerCase())
  );

  if (currentTasks.length === 0) {
    searchInputField.setCustomValidity("No results found.");
    searchInputField.reportValidity();
  } else {
    searchInputField.setCustomValidity("");
  }

  renderTasks();
}

async function addTask(status) {
  currentStatus = status;
  let overlay = document.getElementById("overlay-placeholder");
  overlay.classList.toggle("d-none");
  overlay.innerHTML = "";
  let addTaskOverlay = document.createElement("div");
  addTaskOverlay.classList.add(`overlay-content`);
  addTaskOverlay.id = "overlay-content";
  console.log(addTaskOverlay);

  overlay.appendChild(addTaskOverlay);
  await loadTemplate(
    "overlay-content",
    "../assets/templates/add-task-template.html"
  );
  document.querySelector(".add-task-form-container").style.backgroundColor =
    "white";
  document.querySelector(".add-task-form-container").style.marginLeft = "0px";
  document.querySelector(".add-task-header").style.marginTop = "40px";
  assignContacts();
  document.getElementById("close-button-add-task").classList.toggle("d-none");
  initializePrioButton("medium");
}

function closeWindow() {
  document.getElementById("overlay-placeholder").classList.toggle("d-none");
  prevElement = null;
}

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("searchInputField")
    .addEventListener("input", function (event) {
      filterTasks();
    });
});

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("searchInputField")
    .addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        filterTasks();
      }
    });
});

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("searchInputField")
    .addEventListener("input", function (event) {
      const searchQuery = event.target.value;
      if (searchQuery.length === 0) {
        currentTasks = tasks;
        renderTasks();
      }
    });
});

function startDragging(taskId) {
  currentDraggedElement = taskId;
  const taskElement = document.getElementById(`task-${taskId}`);
  taskElement.classList.add("dragging");
}

function endDragging(taskId) {
  const taskElement = document.getElementById(`task-${taskId}`);
  taskElement.classList.remove("dragging");
}

function allowDrop(event) {
  event.preventDefault();
}

function moveElementToContainer(category) {
  currentTasks[currentDraggedElement]["status"] = category;
  saveToLocalStorage("tasks", currentTasks);
  renderTasks();
}

function highlightColumn(columnId) {
  const column = document.getElementById(columnId);
  column.classList.add("highlight");
}

function removeHighlight(columnId) {
  const column = document.getElementById(columnId);
  column.classList.remove("highlight");
}

function deleteTask(taskId) {
  tasks.splice(taskId, 1);
  saveToLocalStorage("tasks", tasks);
  toggleDisplayNone("overlay-placeholder");
  renderTasks();
  bodyHideScrollbar();
}

function loadTaskToInput(taskId) {
  let task = tasks[taskId];

  document.getElementById("dialogEditTaskTitle").value = task.title;
  document.getElementById("dialogEditTaskDescription").value = task.description;
  document.getElementById("dialogEditTaskDueDate").value = task.dueDate;
  /* updateButtonColorsBasedOnTask(taskId); */
  updateAssignedContacts(taskId);
}

/* function updateAssignedContacts(taskId) {
  const task = tasks[taskId];
  if (!task || !task.assignedTo) {
    console.error("Invalid task or assignedTo data.");
    return;
  }

  // Clear the initials container
  const initialsContainer = document.getElementById("initials-container");
  initialsContainer.innerHTML = "";

  // Loop through the assigned contacts and render their initials
  task.assignedTo.forEach((contactId) => {
    const contact = contacts[contactId];
    const contactNumber = Number(contactId) + 1;
    if (contact) {
      initialsContainer.innerHTML += `
        <div id="assignments-icons-${contactNumber}" class="assign-initials" style="background-color: ${contact.color}">
          ${contact.initials}
        </div>`;
    }
  });
} */

  function updateAssignedContacts(taskId) {
    const task = tasks[taskId];
    if (!task || !task.assignedTo) {
      console.error("Invalid task or assignedTo data.");
      return;
    }
  
    // Clear the initials container
    const initialsContainer = document.getElementById("initials-container");
    initialsContainer.innerHTML = "";
  
    // Loop through the assigned contacts and render their initials
    task.assignedTo.forEach((contactId) => {
      const contact = contacts[contactId];
      const contactNumber = Number(contactId) + 1;
  
      // Skip invalid contacts
      if (!contact || !contact.IsInContacts) {
        return;
      }
  
      initialsContainer.innerHTML += `
        <div id="assignments-icons-${contactNumber}" class="assign-initials" style="background-color: ${contact.color}">
          ${contact.initials}
        </div>`;
    });
  }
  
  

function loadSubtasks(taskId) {
  // Task basierend auf der taskId aus dem Array tasks holen
  const task = tasks[taskId];

  // Überprüfen, ob der Task existiert und Subtasks hat
  if (!task || !task.subtasks || task.subtasks.length === 0) {
    return;
  }

  // Subtasks-Container leeren
  const subtasksContainer = document.getElementById("subtasks-container");
  subtasksContainer.innerHTML = "";

  // Alle Subtasks aus dem Task-Array rendern
  task.subtasks.forEach((subtask, index) => {
    subtasksContainer.innerHTML += renderSubtask(subtask.title);
    subtaskIdCounter = index + 1; // ID für nächste Subtask erhöhen
  });
}

function saveEditedTask(taskId) {
  const task = tasks[taskId];

  if (!document.getElementById("assign-options").classList.contains("d-none")) {
    toggleAssignmentOptions(taskId);
  }

  // Titel, Beschreibung und Fälligkeitsdatum speichern
  task.title = document.getElementById("dialogEditTaskTitle").value;
  task.description = document.getElementById("dialogEditTaskDescription").value;
  task.dueDate = document.getElementById("dialogEditTaskDueDate").value;

  // Priorität speichern
  const selectedButton = document.querySelector(".prio-button.is-inverted");
  if (selectedButton) {
    task.prio = selectedButton.getAttribute("data-prio");
  }

  // Zuordnung der Kontakte speichern
  const assignedContacts = [];
  const initialsContainer = document.getElementById("initials-container");
  initialsContainer.querySelectorAll(".assign-initials").forEach((element) => {
    const initials = element.innerText.trim();
    const contactIndex = contacts.findIndex((c) => c.initials === initials); // Finde den Index

    if (contactIndex !== -1) {
      assignedContacts.push(contactIndex); // Speichere den Index
    } else {
      console.warn("Kontakt nicht gefunden für Initialen:", initials);
    }
  });

  task.assignedTo = assignedContacts; // Speichere die Indizes der Kontakte
  renderTasks();

  // Subtasks speichern
  const subtasks = [];
  const subtasksContainer = document.getElementById("subtasks-container");
  subtasksContainer
    .querySelectorAll("li .subtask-option-text")
    .forEach((subtaskElement, index) => {
      const subtaskTitle = subtaskElement.innerText.trim();
      const originalSubtask = task.subtasks[index]; // Nimmt an, dass die Reihenfolge im HTML mit der im Array übereinstimmt
      const doneStatus = originalSubtask ? originalSubtask.done : false; // Behalte ursprünglichen Status oder setze Standardwert
      if (subtaskTitle) {
        subtasks.push({ title: subtaskTitle, done: doneStatus });
      }
    });
  task.subtasks = subtasks;

  // Tasks neu rendern und Detailansicht aktualisieren
  saveToLocalStorage("tasks", tasks);
  renderTasks();
  renderTaskDetailDialog(taskId);
  toggleDisplayNone("overlay-placeholder");
  document.getElementById("boardTaskDialog").classList.remove("hidden");
  toggleDisplayNone("overlay-placeholder");
}




