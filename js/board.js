let currentDraggedElement;
let touchStartX = 0;
let touchStartY = 0;
let scrollInterval = null;

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

  taskElement.addEventListener("touchmove", handleTouchMove, { passive: true });
  taskElement.addEventListener("touchend", handleTouchEnd);
}

function endDragging(taskId) {
  const taskElement = document.getElementById(`task-${taskId}`);
  taskElement.classList.remove("dragging");

  taskElement.removeEventListener("touchmove", handleTouchMove);
  taskElement.removeEventListener("touchend", handleTouchEnd);

  stopAutoScroll();
}

function allowDrop(event) {
  event.preventDefault();
}

function moveElementToContainer(category) {
  currentTasks[currentDraggedElement]["status"] = category;
  saveToLocalStorage("tasks", currentTasks);
  renderTasks();
}

function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;

  const taskElement = event.target;
  const taskId = taskElement.dataset.taskId;
  startDragging(taskId);
}

function handleTouchMove(event) {
  const touch = event.touches[0];
  const taskElement = document.getElementById(`task-${currentDraggedElement}`);
  const scrollOffsetY = window.scrollY || document.documentElement.scrollTop;
  const scrollOffsetX = window.scrollX || document.documentElement.scrollLeft;

  taskElement.style.position = "absolute";
  taskElement.style.left = `${touch.clientX + scrollOffsetX}px`;
  taskElement.style.top = `${touch.clientY + scrollOffsetY}px`;

  handleAutoScroll(touch.clientY);
}

function handleTouchEnd(event) {
  const taskElement = document.getElementById(`task-${currentDraggedElement}`);
  taskElement.style.position = "static";

  const dropTarget = document.elementFromPoint(
    event.changedTouches[0].clientX,
    event.changedTouches[0].clientY
  );

  if (dropTarget && dropTarget.classList.contains("drop-zone")) {
    const category = dropTarget.dataset.category;
    moveElementToContainer(category);
  }

  endDragging(currentDraggedElement);
  currentDraggedElement = null;
}

function handleAutoScroll(cursorY) {
  const threshold = 50;
  const scrollSpeed = 10;

  stopAutoScroll();

  if (cursorY < threshold) {
    scrollInterval = setInterval(() => {
      window.scrollBy(0, -scrollSpeed);
    }, 16);
  } else if (cursorY > window.innerHeight - threshold) {
    scrollInterval = setInterval(() => {
      window.scrollBy(0, scrollSpeed);
    }, 16);
  }
}

function stopAutoScroll() {
  if (scrollInterval) {
    clearInterval(scrollInterval);
    scrollInterval = null;
  }
}

document.querySelectorAll(".task").forEach((taskElement) => {
  taskElement.addEventListener("touchstart", handleTouchStart, {
    passive: true,
  });
});

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
  updateAssignedContacts(taskId);
}

function updateAssignedContacts(taskId) {
  const task = tasks[taskId];
  if (!task || !task.assignedTo) {
    return;
  }

  const initialsContainer = document.getElementById("initials-container");
  initialsContainer.innerHTML = "";

  task.assignedTo.forEach((contactId) => {
    const contact = contacts[contactId];
    const contactNumber = Number(contactId) + 1;

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
  const task = tasks[taskId];

  if (!task || !task.subtasks || task.subtasks.length === 0) {
    return;
  }

  const subtasksContainer = document.getElementById("subtasks-container");
  subtasksContainer.innerHTML = "";

  task.subtasks.forEach((subtask, index) => {
    subtasksContainer.innerHTML += renderSubtask(subtask.title);
    subtaskIdCounter = index + 1;
  });
}

function saveEditedTask(taskId) {
  const task = tasks[taskId];

  if (!document.getElementById("assign-options").classList.contains("d-none")) {
    toggleAssignmentOptions(taskId);
  }

  task.title = document.getElementById("dialogEditTaskTitle").value;
  task.description = document.getElementById("dialogEditTaskDescription").value;
  task.dueDate = document.getElementById("dialogEditTaskDueDate").value;

  const selectedButton = document.querySelector(".prio-button.is-inverted");
  if (selectedButton) {
    task.prio = selectedButton.getAttribute("data-prio");
  }

  const assignedContacts = [];
  const initialsContainer = document.getElementById("initials-container");
  initialsContainer.querySelectorAll(".assign-initials").forEach((element) => {
    const initials = element.innerText.trim();
    const contactIndex = contacts.findIndex((c) => c.initials === initials);

    if (contactIndex !== -1) {
      assignedContacts.push(contactIndex);
    } else {
      console.warn("Kontakt nicht gefunden für Initialen:", initials);
    }
  });

  task.assignedTo = assignedContacts;
  renderTasks();

  const subtasks = [];
  const subtasksContainer = document.getElementById("subtasks-container");
  subtasksContainer
    .querySelectorAll("li .subtask-option-text")
    .forEach((subtaskElement, index) => {
      const subtaskTitle = subtaskElement.innerText.trim();
      const originalSubtask = task.subtasks[index];
      const doneStatus = originalSubtask ? originalSubtask.done : false;
      if (subtaskTitle) {
        subtasks.push({ title: subtaskTitle, done: doneStatus });
      }
    });
  task.subtasks = subtasks;

  saveToLocalStorage("tasks", tasks);
  renderTasks();
  renderTaskDetailDialog(taskId);
  toggleDisplayNone("overlay-placeholder");
  document.getElementById("boardTaskDialog").classList.remove("hidden");
  toggleDisplayNone("overlay-placeholder");
}
