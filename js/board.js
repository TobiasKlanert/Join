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
  toggleDisplayNone("taskDetailDialogContainer");
  renderTasks();
}

function loadTaskToInput(taskId) {
  let task = tasks[taskId]

  document.getElementById('dialogEditTaskTitle').value = task.title;
  document.getElementById('dialogEditTaskDescription').value = task.description;
  document.getElementById('dialogEditTaskDueDate').value = task.dueDate;
  updateButtonColorsBasedOnTask(taskId);
  updateAssignedContacts(taskId);
}

function updateButtonColorsBasedOnTask(taskId) {
  const task = tasks[taskId];
  if (!task || !task.prio) {
    console.error("Invalid task or priority.");
    return;
  }

  // Define a mapping of priorities to button elements
  const prioToButton = {
    urgent: document.querySelector('.prio-button.urgent-button'),
    medium: document.querySelector('.prio-button[id="medium"]'),
    low: document.querySelector('.prio-button[id="low"]'),
  };

  // Reset all buttons to their default state
  Object.keys(prioToButton).forEach((prio) => {
    const button = prioToButton[prio];
    if (button.classList.contains("is-inverted")) {
      invertColors(`.${prio}-color`, button); // Reset colors
    }
  });

  // Set the selected button
  const selectedButton = prioToButton[task.prio];
  if (selectedButton) {
    changeColors(`.${task.prio}-color`, selectedButton);
  } else {
    console.error("No matching button for priority:", task.prio);
  }
}

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
    const contact = contacts[contactId]; // Assume contactId is the index in the contacts array
    if (contact) {
      initialsContainer.innerHTML += `
        <div class="assign-initials" style="background-color: ${contact.color}">
          ${contact.initials}
        </div>`;
    }
  });
}

