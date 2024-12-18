import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import {
  getDatabase,
  ref,
  get,
  set,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import { fetchSignInMethodsForEmail } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import {
  setPersistence,
  browserLocalPersistence,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

export async function initializeFirebase() {
  const firebaseConfig = {
    apiKey: "AIzaSyBe8DZkoA7TTJc9p59L3G4pAiNvWuArOfw",
    authDomain: "join-ce104.firebaseapp.com",
    databaseURL:
      "https://join-ce104-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "join-ce104",
    storageBucket: "join-ce104.firebasestorage.app",
    messagingSenderId: "191830087515",
    appId: "1:191830087515:web:38c4e1dd5e96a1ea5c6c7e",
  };

  try {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const database = getDatabase(app);
    await setPersistence(auth, browserLocalPersistence);

    return { app, auth, database };
  } catch (error) {
    console.error("Fehler bei der Initialisierung von Firebase:", error);
    throw error;
  }
}

  export function addArray(userData) {
    if (!userData.hasOwnProperty("tasks")) {
      userData["tasks"] = [];
    }
    for (let index = 0; index < userData.tasks.length; index++) {
      const task = userData.tasks[index];
      if (!task.hasOwnProperty("assignedTo")) {
        task["assignedTo"] = [];
      }
      if (!task.hasOwnProperty("subtasks")) {
        task["subtasks"] = [];
      }
    }
  }
  

export async function login(isGuest = false) {
  try {
    const { auth, database } = await initializeFirebase();
    const errorMessageElement = document.getElementById("generalError");
    errorMessageElement.textContent = "";
    errorMessageElement.style.visibility = "hidden";

    let userData;

    if (isGuest) {
      userData = await fetchUserData(database, "guestUser");

      if (userData) {
        addArray(userData);
        saveDataToLocalStorage(userData);
        localStorage.setItem("isGuest", "true");
        window.location.href = "./html/summary.html";
      } else {
        errorMessageElement.textContent =
          "No guest data available. Please contact support.";
        errorMessageElement.style.visibility = "visible";
      }
      return;
    }

    const email = document.getElementById("emailInput").value.trim();
    const password = document.getElementById("passwordInput").value.trim();
    removeInvalidClass();
    if (!email || !password) {
      window.onerror = function (msg, url, line, col, error) {
        return true;
      };
      errorMessageElement.textContent =
        "Please fill in both email and password.";
      errorMessageElement.style.visibility = "visible";
      if (!email) {
        emailInput.classList.add("invalid");
      }
      if (!password) {
        passwordInput.classList.add("invalid");
      }
      if (!email && !password) {
        emailInput.classList.add("invalid");
        passwordInput.classList.add("invalid");
      }
      return;
    }

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    userData = await fetchUserData(database, user.uid);

    if (userData) {
      addArray(userData);
      saveDataToLocalStorage(userData);
      localStorage.setItem("isGuest", "false");
      window.location.href = "./html/summary.html";
    } else {
      errorMessageElement.textContent =
        "User data not found. Please contact support.";
      errorMessageElement.style.visibility = "visible";
    }
  } catch (error) {
    const errorMessageElement = document.getElementById("generalError");
    errorMessageElement.style.visibility = "visible";

    switch (error.code) {
      case "auth/user-not-found":
        errorMessageElement.textContent = "No user found with this email.";
        emailInput.classList.add("invalid");
        break;
      case "auth/wrong-password":
        errorMessageElement.textContent =
          "Incorrect password. Please try again.";
        passwordInput.classList.add("invalid");
        break;
      case "auth/invalid-email":
        errorMessageElement.textContent = "Invalid email format.";
        emailInput.classList.add("invalid");
        break;
      default:
        errorMessageElement.textContent = "Login failed. Please try again.";
        emailInput.classList.add("invalid");
        passwordInput.classList.add("invalid");
    }
  }
}

export async function logout() {
  try {
    const { auth, database } = await initializeFirebase();

    const user = auth.currentUser;

    const isGuest = localStorage.getItem("isGuest") === "true";

    if (user && !isGuest) {

      loadDataFromLocalStorage();

      const name = localStorage.getItem("name");
      const email = localStorage.getItem("email");

      if (!name || !email) {
        console.error("Name oder E-Mail fehlen im localStorage.");
        throw new Error("Name oder E-Mail können nicht gespeichert werden.");
      }

      const userId = user.uid; 
      const userRef = ref(database, `users/${userId}`);

      const userData = {
        name: name,
        email: email,
        tasks: tasks,
        contacts: contacts,
      };

      await set(userRef, userData);

      const rememberedEmail = localStorage.getItem("rememberedEmail");
      localStorage.clear();
      if (rememberedEmail) {
        localStorage.setItem("rememberedEmail", rememberedEmail);
      }
      sessionStorage.clear();

      await signOut(auth);
      window.location.href = "../index.html";
    } else if (isGuest) {
      localStorage.clear();
      window.location.href = "../index.html";
    } 
  } catch (error) {
    console.error("Fehler beim Logout:", error);
  }
}

export async function fetchUserData(database, userId) {
  try {
    const userRef = ref(database, `users/${userId}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Fehler beim Abrufen der Benutzerdaten:", error);
  }
}

export function saveDataToLocalStorage(data) {
  if (data.tasks) {
    localStorage.setItem("tasks", JSON.stringify(data.tasks));
  }
  if (data.contacts) {
    localStorage.setItem("contacts", JSON.stringify(data.contacts));
  }
  if (data.name) {
    localStorage.setItem("name", data.name);
  }
  if (data.name) {
    localStorage.setItem("email", data.email);
  }
}

export function loadDataFromLocalStorage() {
  try {
    const tasksData = localStorage.getItem("tasks");
    const contactsData = localStorage.getItem("contacts");

    tasks = tasksData ? JSON.parse(tasksData) : [];
    contacts = contactsData ? JSON.parse(contactsData) : [];

    if (!Array.isArray(tasks)) {
      tasks = [];
    }

    if (!Array.isArray(contacts)) {
      contacts = [];
    }
  } catch (error) {
    console.error("Error loading data from the localStorage: ", error);
    tasks = [];
    contacts = [];
  }
}

export async function handleSignUp() {
  try {
    // Hole die Eingaben aus den HTML-Feldern
    const name = document.getElementById("addContactName").value.trim();
    const email = document.getElementById("emailInput").value.trim();
    const password = document.getElementById("passwordInput").value.trim();
    const confirmPassword = document
      .getElementById("confirmPasswordInput")
      .value.trim();
    let privacyPolicyCheckbox = document.getElementById("rememberMe");

    const errorMessage = document.getElementById("generalError");
    errorMessage.textContent = "";

    removeInvalidClass();

    if (!name || !email || !password || !confirmPassword) {
      errorMessage.textContent = "All fields must be filled in.";
      errorMessage.style.visibility = "visible";
      addContactName.classList.add("invalid");
      emailInput.classList.add("invalid");
      passwordInput.classList.add("invalid");
      confirmPasswordInput.classList.add("invalid");
      return;
    }

    if (password !== confirmPassword) {
      errorMessage.textContent = "Passwords do not match.";
      errorMessage.style.visibility = "visible";
      passwordInput.classList.add("invalid");
      confirmPasswordInput.classList.add("invalid");
      return;
    }

    if (password.length < 6) {
      errorMessage.textContent =
        "The password must be at least 6 characters long.";
      errorMessage.style.visibility = "visible";
      passwordInput.classList.add("invalid");
      confirmPasswordInput.classList.add("invalid");
      return;
    }

    if (!privacyPolicyCheckbox.checked) {
      generalError.textContent = "You must accept the Privacy Policy.";
      errorMessage.style.visibility = "visible";
      return;
    }

    const { auth, database } = await initializeFirebase();

    if (!/\S+@\S+\.\S+/.test(email)) {
      errorMessage.textContent = "Please enter a valid email address.";
      errorMessage.style.visibility = "visible";
      emailInput.classList.add("invalid");
      return;
    }

    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length > 0) {
        errorMessage.textContent =
          "This email address is already in use. Please log in.";
        errorMessage.style.visibility = "visible";
        return;
      }
    } catch (apiError) {
      console.error("Error during email lookup:", apiError);
      errorMessage.textContent =
        "There was a problem verifying your email. Please try again later.";
      errorMessage.style.visibility = "visible";
      return;
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const currentDate = new Date();
    const futureDate = new Date(currentDate);
    futureDate.setDate(currentDate.getDate() + 7);
    const formattedDueDate = futureDate.toISOString().split("T")[0];

    const userId = user.uid;
    const userRef = ref(database, `users/${userId}`);
    const userData = {
      name: name,
      email: email,
      contacts: [
        {
          name: name,
          email: email,
          phone: "",
          IsInContacts: true,
          isOwnUser: true,
          color: applyRandomColor(),
          initials: getInitials(name),
        },
      ],
      tasks: [
        {
          assignedTo: {},
          category: "technical task",
          title: "Example Task",
          dueDate: formattedDueDate,
          prio: "low",
          status: "toDo",
          description: "This is an example task.",
          subtasks: {},
        },
      ],
    };

    await set(userRef, userData);

    successMessage.classList.add("show");
    setTimeout(function () {
      successMessage.classList.remove("show");
      window.location.href = "../index.html";
    }, 2000);
  } catch (error) {
    const errorMessage = document.getElementById("generalError");
    if (error.code === "auth/email-already-in-use") {
      errorMessage.textContent =
        "This email address is already in use. Please log in.";
    } else {
      errorMessage.textContent =
        error.message || "An error occurred during registration.";
    }
    errorMessage.style.visibility = "visible";
  }
}

function removeInvalidClass() {
  const invalidElements = document.querySelectorAll(".invalid");
  invalidElements.forEach((element) => {
    element.classList.remove("invalid");
  });
}
