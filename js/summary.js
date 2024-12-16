/**
 * Main function to display the greeting.
 */
function displayGreeting() {
  const greeting = document.getElementById("greeting");
  const currentHour = getCurrentHour();
  const isGuest = checkIfGuest();
  const userName = getUserName();

  const greetingMessage = isGuest
    ? getGuestGreetingMessage(currentHour)
    : getUserGreetingMessage(currentHour, userName);

  updateGreetingElement(greeting, greetingMessage);
}

/**
 * Get the current hour of the day.
 * @returns {number} - The current hour (0-23).
 */
function getCurrentHour() {
  return new Date().getHours();
}

/**
 * Check if the user is a guest.
 * @returns {boolean} - True if the user is a guest, false otherwise.
 */
function checkIfGuest() {
  return localStorage.getItem("isGuest") === "true";
}

/**
 * Get the stored user name from local storage.
 * @returns {string} - The user name, or an empty string if not found.
 */
function getUserName() {
  return localStorage.getItem("name") || "";
}

/**
 * Get the greeting message for a guest user.
 * @param {number} currentHour - The current hour (0-23).
 * @returns {string} - The greeting message for the guest.
 */
function getGuestGreetingMessage(currentHour) {
  if (currentHour < 12) {
    return "Good Morning";
  } else if (currentHour < 18) {
    return "Good Day";
  } else {
    return "Good Evening";
  }
}

/**
 * Get the greeting message for a logged-in user.
 * @param {number} currentHour - The current hour (0-23).
 * @param {string} userName - The name of the user.
 * @returns {string} - The personalized greeting message.
 */
function getUserGreetingMessage(currentHour, userName) {
  if (currentHour < 12) {
    return `Good Morning, <span class='user'>${userName}</span>`;
  } else if (currentHour < 18) {
    return `Good Day, <span class='user'>${userName}</span>`;
  } else {
    return `Good Evening, <span class='user'>${userName}</span>`;
  }
}

/**
 * Update the greeting element with the provided message.
 * @param {HTMLElement} element - The DOM element to update.
 * @param {string} message - The message to display.
 */
function updateGreetingElement(element, message) {
  element.innerHTML = "";
  element.innerHTML = message;
}

/**
 * Main function to load data into the summary section.
 */
function loadDataToSummary() {
  const counters = initializeCounters();
  updateTaskCounters(counters);
  updateSummaryUI(counters);
}

/**
 * Initialize all task counters.
 * @returns {Object} - An object containing all counters initialized to zero.
 */
function initializeCounters() {
  return {
    toDo: 0,
    done: 0,
    urgent: 0,
    inProgress: 0,
    awaitFeedback: 0,
  };
}

/**
 * Update task counters based on the tasks array.
 * @param {Object} counters - The counters object to update.
 */
function updateTaskCounters(counters) {
  for (let taskIndex = 0; taskIndex < tasks.length; taskIndex++) {
    incrementStatusCounter(counters, tasks[taskIndex].status);

    if (tasks[taskIndex].prio === "urgent") {
      counters.urgent += 1;
    }
  }
}

/**
 * Increment the counter for a specific task status.
 * @param {Object} counters - The counters object.
 * @param {string} status - The task status to increment.
 */
function incrementStatusCounter(counters, status) {
  switch (status) {
    case "toDo":
      counters.toDo += 1;
      break;
    case "done":
      counters.done += 1;
      break;
    case "inProgress":
      counters.inProgress += 1;
      break;
    case "awaitFeedback":
      counters.awaitFeedback += 1;
      break;
  }
}

/**
 * Update the summary section UI with the counters.
 * @param {Object} counters - The counters object containing the updated values.
 */
function updateSummaryUI(counters) {
  document.getElementById("tasksInBoard").innerHTML = tasks.length;
  document.getElementById("summaryToDo").innerHTML = counters.toDo;
  document.getElementById("summaryDone").innerHTML = counters.done;
  document.getElementById("summaryUrgent").innerHTML = counters.urgent;
  document.getElementById("summaryInProgress").innerHTML = counters.inProgress;
  document.getElementById("summaryAwaitFeedback").innerHTML = counters.awaitFeedback;
  document.getElementById("summaryUpcomingDeadline").innerHTML = getDeadline();
}

/**
 * Main function to get the closest deadline for urgent tasks.
 * @returns {string|null} - The closest deadline as a formatted string or null if no tasks are urgent.
 */
function getDeadline() {
  const today = new Date();
  const closestTask = findClosestUrgentTask(today);
  return formatDeadline(closestTask);
}

/**
 * Find the closest urgent task based on its due date.
 * @param {Date} today - The current date.
 * @returns {Object|null} - The closest urgent task or null if none are found.
 */
function findClosestUrgentTask(today) {
  let closestTask = null;
  let closestDifference = Infinity;

  tasks.forEach((task) => {
    if (task.prio === "urgent") {
      const taskDueDate = new Date(task.dueDate);
      const difference = Math.abs(taskDueDate - today);

      if (difference < closestDifference) {
        closestDifference = difference;
        closestTask = task;
      }
    }
  });

  return closestTask;
}

/**
 * Format the deadline of a task.
 * @param {Object|null} task - The task object to format, or null if no task is provided.
 * @returns {string|null} - The formatted deadline string or null if no task.
 */
function formatDeadline(task) {
  if (task) {
    return new Date(task.dueDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return null;
}