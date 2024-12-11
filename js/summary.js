function displayGreeting() {
  let greeting = document.getElementById("greeting");
  let currentHour = new Date().getHours();
  let userName = localStorage.getItem("name");

  const isGuest = localStorage.getItem("isGuest") === "true";

  let greetingMessage = "";

  if (isGuest) {
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

  greeting.innerHTML = "";
  greeting.innerHTML = greetingMessage;
}

function createContactFromUser() {
  let newContactName = localStorage.getItem("name");
  let newContactMail = localStorage.getItem("email");
  let newContactPhone = "";

  const isGuest = localStorage.getItem("isGuest") === "true";

  if (!isGuest) {
    // Prüfen, ob Kontakte im Local Storage existieren
    let storedContacts = localStorage.getItem("contacts");
    contacts = storedContacts ? JSON.parse(storedContacts) : [];

    // Überprüfen, ob der Kontakt bereits existiert
    const contactExists = contacts.some(
      (contact) => contact.email === newContactMail
    );

    if (contactExists) {
      return; // Funktion beenden, wenn der Kontakt bereits existiert
    }

    // Neuen Kontakt erstellen
    let newContact = {
      name: newContactName,
      email: newContactMail,
      phone: newContactPhone,
      IsInContacts: true,
      color: applyRandomColor(),
      initials: getInitials(newContactName),
    };

    // Kontakt zur Liste hinzufügen und speichern
    contacts.push(newContact);
    saveToLocalStorage("contacts", contacts);
  }
}

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
  document.getElementById("summaryAwaitFeedback").innerHTML =
    counterAwaitFeedback;
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

async function loadHeader() {
  const headerContainer = document.getElementById("headerContainer");
  const response = await fetch("header-template.html");
  const headerHTML = await response.text();
  headerContainer.innerHTML = headerHTML;

  setUserCircleInitials();
}
