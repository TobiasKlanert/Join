let currentDraggedElement;
let touchStartX = 0;
let touchStartY = 0;
let scrollInterval = null;

/**
 * Filter the tasks according to a search entry
 */
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

/**
 * Close a dialog window
 */
function closeWindow() {
  document.getElementById("overlay-placeholder").classList.toggle("d-none");
  prevElement = null;
}

/**
 * Call filterTasks() when a search term is entered
 */
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("searchInputField")
    .addEventListener("input", function (event) {
      filterTasks();
    });
});

/**
 * Call filterTasks() when the Enter key is pressed in input field
 */
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

/**
 * Starts the drag operation for a task.
 * Highlights the dragged element and sets up touch event listeners.
 *
 * @param {string} taskId - The ID of the task to start dragging.
 */
function startDragging(taskId) {
  currentDraggedElement = taskId;
  const taskElement = document.getElementById(`task-${taskId}`);
  taskElement.classList.add("dragging");

  taskElement.addEventListener("touchmove", handleTouchMove, { passive: true });
  taskElement.addEventListener("touchend", handleTouchEnd);
}

/**
 * Ends the drag operation for a task.
 * Removes highlighting and cleans up touch event listeners.
 *
 * @param {string} taskId - The ID of the task to stop dragging.
 */
function endDragging(taskId) {
  const taskElement = document.getElementById(`task-${taskId}`);
  taskElement.classList.remove("dragging");

  taskElement.removeEventListener("touchmove", handleTouchMove);
  taskElement.removeEventListener("touchend", handleTouchEnd);

  stopAutoScroll();
}

/**
 * Allows an element to accept dropped items by preventing the default behavior.
 *
 * @param {DragEvent} event - The dragover event.
 */
function allowDrop(event) {
  event.preventDefault();
}

/**
 * Moves the currently dragged task to a new container based on its category.
 * Updates the task's status, saves changes, and re-renders the tasks.
 *
 * @param {string} category - The new category/status for the task.
 */
function moveElementToContainer(category) {
  currentTasks[currentDraggedElement]["status"] = category;
  saveToLocalStorage("tasks", currentTasks);
  renderTasks();
}

/**
 * Handles the start of a touch interaction for dragging a task.
 * Initializes the drag operation.
 *
 * @param {TouchEvent} event - The touchstart event.
 */
function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;

  const taskElement = event.target;
  const taskId = taskElement.dataset.taskId;
  startDragging(taskId);
}

/**
 * Handles touch movement during a drag operation.
 * Updates the position of the dragged element and manages auto-scrolling.
 *
 * @param {TouchEvent} event - The touchmove event.
 */
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

/**
 * Handles the end of a touch interaction for dragging a task.
 * Finalizes the drag operation, moves the task if necessary, and resets its position.
 *
 * @param {TouchEvent} event - The touchend event.
 */
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

/**
 * Manages auto-scrolling during a drag operation.
 * Scrolls the window when the cursor is near the edges of the screen.
 *
 * @param {number} cursorY - The Y-coordinate of the cursor.
 */
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

/**
 * Stops any ongoing auto-scrolling operation.
 */
function stopAutoScroll() {
  if (scrollInterval) {
    clearInterval(scrollInterval);
    scrollInterval = null;
  }
}

/**
 * Adds touchstart event listeners to all elements with the class "task".
 */
document.querySelectorAll(".task").forEach((taskElement) => {
  taskElement.addEventListener("touchstart", handleTouchStart, {
    passive: true,
  });
});

/**
 * Marks the column over which an element is dragged
 * @param {string} columnId - The id of the column
 */
function highlightColumn(columnId) {
  const column = document.getElementById(columnId);
  column.classList.add("highlight");
}

/**
 * Removes the marker when no element is dragged over this column anymore
 * @param {string} columnId - The id of the column
 */
function removeHighlight(columnId) {
  const column = document.getElementById(columnId);
  column.classList.remove("highlight");
}

/**
 * Removes a task from the tasks array.
 * Saves updated array to local storage.
 * Closes dialog window and refreshs the board.
 * @param {string} taskId - The id of the task to delete.
 */
function deleteTask(taskId) {
  tasks.splice(taskId, 1);
  saveToLocalStorage("tasks", tasks);
  toggleDisplayNone("overlay-placeholder");
  renderTasks();
  bodyHideScrollbar();
}

/**
 * Loads the values of a task to the input fields, to make them editable.
 * @param {string} taskId - The id of the task to edit.
 */
function loadTaskToInput(taskId) {
  let task = tasks[taskId];

  document.getElementById("dialogEditTaskTitle").value = task.title;
  document.getElementById("dialogEditTaskDescription").value = task.description;
  document.getElementById("dialogEditTaskDueDate").value = task.dueDate;
  updateAssignedContacts(taskId);
}

/**
 * Updates the assigned contacts of the task.
 * @param {string} taskId - The id of the task to edit.
 */
function updateAssignedContacts(taskId) {
  const task = tasks[taskId];
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

/**
 * Loads the subtasks of the task to the edit dialog, to make them editable.
 * @param {string} taskId - The id of the task whose subtasks are loaded.
 */
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

/**
 * Saves the edited task details by calling individual helper functions.
 *
 * @param {string} taskId - The ID of the task being edited.
 */
function saveEditedTask(taskId) {
  const task = tasks[taskId];

  handleTaskDetailsUpdate(taskId, task);
  handleTaskPriority(task);
  handleAssignedContacts(task);
  handleSubtasks(task);

  saveToLocalStorage("tasks", tasks);
  renderTasks();
  finalizeTaskDialog(taskId);
}

/**
 * Updates the title, description, and due date of the task.
 *
 * @param {string} taskId - The ID of the task being edited.
 * @param {Object} task - The task object being updated.
 */
function handleTaskDetailsUpdate(taskId, task) {
  if (!document.getElementById("assign-options").classList.contains("d-none")) {
    toggleAssignmentOptions(taskId);
  }

  task.title = document.getElementById("dialogEditTaskTitle").value;
  task.description = document.getElementById("dialogEditTaskDescription").value;
  task.dueDate = document.getElementById("dialogEditTaskDueDate").value;
}

/**
 * Updates the priority of the task based on the selected button.
 *
 * @param {Object} task - The task object being updated.
 */
function handleTaskPriority(task) {
  const selectedButton = document.querySelector(".prio-button.is-inverted");
  if (selectedButton) {
    task.prio = selectedButton.getAttribute("data-prio");
  }
}

/**
 * Updates the assigned contacts for the task based on the initials in the UI.
 *
 * @param {Object} task - The task object being updated.
 */
function handleAssignedContacts(task) {
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
}

/**
 * Updates the subtasks for the task based on the UI inputs.
 *
 * @param {Object} task - The task object being updated.
 */
function handleSubtasks(task) {
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
}

/**
 * Finalizes the task dialog by rendering the updated task and resetting UI states.
 *
 * @param {string} taskId - The ID of the task being edited.
 */
function finalizeTaskDialog(taskId) {
  renderTaskDetailDialog(taskId);
  toggleDisplayNone("overlay-placeholder");
  document.getElementById("boardTaskDialog").classList.remove("hidden");
  toggleDisplayNone("overlay-placeholder");
}