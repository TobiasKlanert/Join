function displayGreeting() {
  let greeting = document.getElementById("greeting");
  let currentHour = new Date().getHours();
  let userName = localStorage.getItem("userFullName");
  let greetingMessage;

if (!userName) {
  if (currentHour < 12) {
    greetingMessage = "Good Morning";
  } else if (currentHour < 18) {
    greetingMessage = "Good Day"; 
  } else {
    greetingMessage = "Good Evening";
  }
} else {
  if (currentHour < 12) {
    greetingMessage = `Good Morning, <span class='user'>${userName}</span>`;
  } else if (currentHour < 18) {
    greetingMessage = `Good Day, <span class='user'>${userName}</span>`;
  } else {
    greetingMessage = `Good Evening, <span class='user'>${userName}</span>`;
  }
}
  greeting.innerHTML = greetingMessage;
}

displayGreeting();

function loadDataToSummary() {
  let counterToDo = 0;
  let counterDone = 0;
  let counterUrgent = 0;
  let counterInProgress = 0;
  let counterAwaitFeedback = 0;

  for (taskIndex = 0; taskIndex < tasks.length; taskIndex++) {
    switch (tasks[taskIndex].status) {
      case "toDo":
        counterToDo += 1;
        break;
      case "done":
        counterDone += 1;
        break;
      case "inProgress":
        counterInProgress += 1;
        break;
      case "awaitFeedback":
        counterAwaitFeedback += 1;
        break;
    }

    if (tasks[taskIndex].prio === "urgent") {
      counterUrgent += 1;
    }
  }

  document.getElementById("tasksInBoard").innerHTML = tasks.length;
  document.getElementById("summaryToDo").innerHTML = counterToDo;
  document.getElementById("summaryDone").innerHTML = counterDone;
  document.getElementById("summaryUrgent").innerHTML = counterUrgent;
  document.getElementById("summaryInProgress").innerHTML = counterInProgress;
  document.getElementById("summaryAwaitFeedback").innerHTML = counterAwaitFeedback;
  document.getElementById("summaryUpcomingDeadline").innerHTML = getDeadline();
}

function getDeadline() {
  const today = new Date();
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

  if (closestTask) {
    return new Date(closestTask.dueDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return null;
}


function setUserCircleInitials() {
  let userName = localStorage.getItem("userFullName");
  let initials;
  let userCircle = document.getElementById("userCircle");
  if (userName) {
    let nameParts = userName.split(" ");
    let firstName = nameParts[0]?.charAt(0).toLocaleUpperCase();
    let lastName = nameParts[1]?.charAt(0).toLocaleUpperCase();
  
    initials = firstName + lastName;
  } else {
    initials = "G";
  }
 
  if (userCircle) {
      userCircle.innerHTML = initials;
  }
}


