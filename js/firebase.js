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

// Funktion zur Initialisierung der Firebase-App
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
    // Firebase App initialisieren
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app); // Authentifizierung
    const database = getDatabase(app); // Datenbank
    await setPersistence(auth, browserLocalPersistence);

    console.log("Firebase erfolgreich initialisiert.");

    return { app, auth, database };
  } catch (error) {
    console.error("Fehler bei der Initialisierung von Firebase:", error);
    throw error;
  }
}

export function addArray(userData) {
  for (let index = 0; index < userData.tasks.length; index++) {
    const hasAssignedTo = userData.tasks[index].hasOwnProperty("assignedTo");
    const hasSubtasks = userData.tasks[index].hasOwnProperty("subtasks");
    if (!hasAssignedTo && !hasSubtasks) {
      userData.tasks[index]["assignedTo"] = [];
      userData.tasks[index]["subtasks"] = [];
    } else if (!hasAssignedTo) {
      userData.tasks[index]["assignedTo"] = [];
    } else if (!hasSubtasks) {
      userData.tasks[index]["subtasks"] = [];
    } else {
      console.log("passt alles");
    }
  }
}

export async function login(isGuest = false) {
  try {
    const { auth, database } = await initializeFirebase(); // Firebase initialisieren
    const errorMessageElement = document.getElementById("generalError"); // Element für Fehlermeldung
    errorMessageElement.textContent = ""; // Fehlernachricht zurücksetzen
    errorMessageElement.style.visibility = "hidden"; // Unsichtbar machen

    let userData; // Platzhalter für die Benutzerdaten

    if (isGuest) {
      // Gast-Daten aus der Datenbank abrufen
      userData = await fetchUserData(database, "guestUser");

      if (userData) {
        addArray(userData);
        saveDataToLocalStorage(userData); // Testdaten im localStorage speichern
        addContactDetails();
        localStorage.setItem("isGuest", "true"); // Kennzeichnung für Gast-Benutzer
        window.location.href = "./html/summary.html"; // Weiterleitung
      } else {
        errorMessageElement.textContent =
          "No guest data available. Please contact support.";
        errorMessageElement.style.visibility = "visible"; // Sichtbar machen
      }
      return; // Beende die Funktion nach dem Gast-Login
    }

    // Eingaben aus den HTML-Feldern holen
    const email = document.getElementById("emailInput").value.trim();
    const password = document.getElementById("passwordInput").value.trim();

    // Eingabefelder validieren
    if (!email || !password) {
      window.onerror = function (msg, url, line, col, error) {
        // Catch the error and do whatever is necessary
        return true; // Prevent the original error message from appearing in the console
      };
      errorMessageElement.textContent =
        "Please fill in both email and password.";
      emailInput.classList.add("invalid");
      passwordInput.classList.add("invalid");
      errorMessageElement.style.visibility = "visible"; // Sichtbar machen
      return;
    }

    // Benutzer mit E-Mail und Passwort authentifizieren
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Benutzerdaten aus der Datenbank abrufen
    userData = await fetchUserData(database, user.uid);

    if (userData) {
      addArray(userData);
      saveDataToLocalStorage(userData); // Daten im localStorage speichern
      addContactDetails();
      localStorage.setItem("isGuest", "false"); // Kennzeichnung für regulären Benutzer
      window.location.href = "./html/summary.html"; // Weiterleitung
    } else {
      errorMessageElement.textContent =
        "User data not found. Please contact support.";
      errorMessageElement.style.visibility = "visible"; // Sichtbar machen
    }
  } catch (error) {
    const errorMessageElement = document.getElementById("generalError");
    errorMessageElement.style.visibility = "visible"; // Sichtbar machen

    // Zeige spezifische Fehlermeldungen an, ohne sie in der Konsole auszugeben
    switch (error.code) {
      case "auth/user-not-found":
        errorMessageElement.textContent = "No user found with this email.";
        break;
      case "auth/wrong-password":
        errorMessageElement.textContent =
          "Incorrect password. Please try again.";
        break;
      case "auth/invalid-email":
        errorMessageElement.textContent = "Invalid email format.";
        break;
      default:
        errorMessageElement.textContent = "Login failed. Please try again.";
    }
  }
}

export async function logout() {
  try {
    const { auth, database } = await initializeFirebase();

    const user = auth.currentUser; // Hole den aktuell authentifizierten Benutzer
    console.log("User: ", user);

    const isGuest = localStorage.getItem("isGuest") === "true"; // Sicherstellen, dass isGuest ein Boolean ist
    console.log("Is Guest: ", isGuest);

    if (user && !isGuest) {
      // Schritt 1: Die Arrays aus dem localStorage laden
      loadDataFromLocalStorage(); // Lädt tasks und contacts in die globalen Arrays (z.B. `tasks`, `contacts`)

      // Schritt 2: Speichere die geladenen Arrays in der Firebase-Datenbank
      const userId = user.uid; // Hol die Benutzer-ID des aktuellen Benutzers
      const userRef = ref(database, `users/${userId}`); // Referenz zu dem Benutzer in der Firebase-Datenbank

      // Speichern der Arrays in der Firebase-Datenbank
      const userData = {
        tasks: tasks, // Array von Aufgaben
        contacts: contacts, // Array von Kontakten
      };

      await set(userRef, userData); // Speichere die Daten in der Firebase-Datenbank
      console.log(userData);

      // Schritt 3: Den Benutzer aus Firebase abmelden
      await signOut(auth); // Logout des Benutzers
      window.location.href = "../index.html";
    } else if (isGuest) {
      localStorage.clear();
      window.location.href = "../index.html";
    } else {
      console.log("Kein Benutzer angemeldet.");
    }
  } catch (error) {
    console.error("Fehler beim Logout:", error);
  }
}

// Funktion zum Abrufen der Benutzerdaten aus der Firebase Realtime-Datenbank
export async function fetchUserData(database, userId) {
  try {
    // Dynamischer Pfad basierend auf der Benutzer-ID
    const userRef = ref(database, `users/${userId}`); // Beispiel: 'users/userId'
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      return snapshot.val(); // Gibt die Benutzerdaten zurück
    } else {
      console.log("Keine Benutzerdaten gefunden");
      return null;
    }
  } catch (error) {
    console.error("Fehler beim Abrufen der Benutzerdaten:", error);
  }
}

// Funktion, um die Daten im localStorage zu speichern
export function saveDataToLocalStorage(data) {
  // Speichern der tasks und contacts im localStorage
  if (data.tasks) {
    localStorage.setItem("tasks", JSON.stringify(data.tasks)); // Speichern des Tasks-Arrays
  }
  if (data.contacts) {
    localStorage.setItem("contacts", JSON.stringify(data.contacts)); // Speichern des Contacts-Arrays
  }
  if (data.name) {
    localStorage.setItem("name", data.name);
  }
  if (data.name) {
    localStorage.setItem("email", data.email);
  }
  console.log("Daten im localStorage gespeichert.");
}

// Funktion zum Laden der Tasks und Contacts aus dem localStorage und Aktualisieren der globalen Arrays
export function loadDataFromLocalStorage() {
  try {
    // Lade das Tasks-Array aus dem localStorage
    const tasksData = localStorage.getItem("tasks");
    const contactsData = localStorage.getItem("contacts");

    // Überprüfe, ob die Daten existieren und konvertiere sie
    tasks = tasksData ? JSON.parse(tasksData) : []; // Wenn keine Daten vorhanden, leeres Array
    contacts = contactsData ? JSON.parse(contactsData) : []; // Wenn keine Daten vorhanden, leeres Array

    // Optional: Weitere Überprüfungen, ob die geladenen Daten tatsächlich Arrays sind
    if (!Array.isArray(tasks)) {
      console.warn(
        "Tasks-Daten aus dem localStorage sind nicht im Array-Format."
      );
      tasks = []; // Setze auf leeres Array, wenn es keine gültigen Daten gibt
    }

    if (!Array.isArray(contacts)) {
      console.warn(
        "Contacts-Daten aus dem localStorage sind nicht im Array-Format."
      );
      contacts = []; // Setze auf leeres Array, wenn es keine gültigen Daten gibt
    }

    console.log("Daten aus dem localStorage geladen.");
  } catch (error) {
    console.error("Fehler beim Laden der Daten aus dem localStorage:", error);
    tasks = []; // Leeres Array zurücksetzen, falls ein Fehler auftritt
    contacts = []; // Leeres Array zurücksetzen, falls ein Fehler auftritt
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
    errorMessage.textContent = ""; // Fehlernachrichten zurücksetzen

    // Validierung der Eingaben
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
      return;
    }

    if (password.length < 6) {
      errorMessage.textContent =
        "The password must be at least 6 characters long.";
      return;
    }

    if (!privacyPolicyCheckbox.checked) {
      generalError.textContent = "You must accept the Privacy Policy.";
      return;
    }

    // Firebase initialisieren
    const { auth, database } = await initializeFirebase();

    // Validierung der E-Mail-Adresse
    if (!/\S+@\S+\.\S+/.test(email)) {
      errorMessage.textContent = "Please enter a valid email address.";
      errorMessage.style.visibility = "visible";
      return;
    }

    try {
      // Prüfen, ob die E-Mail bereits existiert
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

    // Benutzer in Firebase Authentication erstellen
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const currentDate = new Date();
    const futureDate = new Date(currentDate);
    futureDate.setDate(currentDate.getDate() + 7); // Eine Woche hinzufügen
    const formattedDueDate = futureDate.toISOString().split("T")[0]; // YYYY-MM-DD Format

    // Benutzerdaten in der Datenbank speichern
    const userId = user.uid; // Eindeutige Benutzer-ID von Firebase
    const userRef = ref(database, `users/${userId}`);
    const userData = {
      name: name,
      email: email,
      contacts: [
        {
          name: name, // Benutzername als Kontaktname
          email: email, // Benutzer-E-Mail als Kontakt-E-Mail
          phone: "",
        },
      ], // Standardwert für Kontakte
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
      ], // Standardwert für Aufgaben
    };

    await set(userRef, userData);

    // Erfolgsmeldung anzeigen
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
