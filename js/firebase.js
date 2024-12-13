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

// Gemeinsame Login-Funktion für Gast und normalen Benutzer
/* export async function login(isGuest = false) {
  try {
    const { auth, database } = await initializeFirebase(); // Initialisiere Firebase

    let userData;
    localStorage.setItem("isGuest", isGuest);

    if (isGuest) {
      // Gast-Login
      console.log("Gast-Login wird ausgeführt...");

      // Gast-Daten aus der Datenbank abrufen
      userData = await fetchUserData(database, "guestUser");

      if (userData) {
        console.log("Gast-Daten:", userData);
      } else {
        console.log("Gast-Daten nicht gefunden.");
      }
    } else {
      // Normaler Benutzer-Login
      console.log("Benutzer-Login wird ausgeführt...");

      // Benutzer mit E-Mail und Passwort anmelden
      const email = document.getElementById("emailInput").value.trim();
      const password = document.getElementById("passwordInput").value.trim();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      console.log("Benutzer erfolgreich eingeloggt:", user.uid);

      // Benutzerdaten aus der Datenbank abrufen
      userData = await fetchUserData(database, user.uid);

      if (userData) {
        console.log("Benutzer-Daten:", userData);
      }
    }

    // Falls Daten vorhanden sind, im localStorage speichern
    if (userData) {
      saveDataToLocalStorage(userData);
      addContactDetails();
      window.location.href = "./html/summary.html";
    }
  } catch (error) {
    console.error("Fehler beim Login:", error);
  }
} */

/* export async function login() {
  try {
    const { auth } = await initializeFirebase(); // Firebase initialisieren

    // Eingaben aus den HTML-Feldern holen
    const email = document.getElementById("emailInput").value.trim();
    const password = document.getElementById("passwordInput").value.trim();
    const errorMessageElement = document.getElementById("generalError"); // Element für Fehlermeldung
    errorMessageElement.textContent = ""; // Fehlernachricht zurücksetzen

    // Eingabefelder validieren
    if (!email || !password) {
      errorMessageElement.textContent = "Please fill in both email and password.";
      return;
    }

    // Benutzer mit E-Mail und Passwort authentifizieren
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log("Benutzer erfolgreich eingeloggt:", user.uid);

    // Erfolgreiche Authentifizierung - Weiterleitung
    window.location.href = "./html/summary.html";
  } catch (error) {
    console.error("Fehler beim Login:", error);

    const errorMessageElement = document.getElementById("generalError");
    switch (error.code) {
      case "auth/user-not-found":
        errorMessageElement.textContent = "No user found with this email.";
        break;
      case "auth/wrong-password":
        errorMessageElement.textContent = "Incorrect password. Please try again.";
        break;
      case "auth/invalid-email":
        errorMessageElement.textContent = "Invalid email format.";
        break;
      default:
        errorMessageElement.textContent = "Login failed. Please try again.";
    }
  }
} */

export async function login(isGuest = false) {
  try {
    const { auth, database } = await initializeFirebase(); // Firebase initialisieren
    const errorMessageElement = document.getElementById("generalError"); // Element für Fehlermeldung
    errorMessageElement.textContent = ""; // Fehlernachricht zurücksetzen
    errorMessageElement.style.visibility = "hidden"; // Unsichtbar machen

    let userData; // Platzhalter für die Benutzerdaten

    if (isGuest) {
      console.log("Gast-Login wird ausgeführt...");

      // Gast-Daten aus der Datenbank abrufen
      userData = await fetchUserData(database, "guestUser");

      if (userData) {
        saveDataToLocalStorage(userData); // Testdaten im localStorage speichern
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
      saveDataToLocalStorage(userData); // Daten im localStorage speichern
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

    const isGuest = localStorage.getItem("isGuest");

    if (isGuest) {
      console.log("Gastkonto eingeloggt");
      localStorage.clear();
      window.location.href = "../index.html";
    } else if (user) {
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

      // Schritt 3: Den Benutzer aus Firebase abmelden
      await signOut(auth); // Logout des Benutzers

      // Erfolgsmeldung
      console.log("Benutzer erfolgreich ausgeloggt.");
      // Optional: Weiterleitung zu einer anderen Seite (z.B. Login-Seite)
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
    const confirmPassword = document.getElementById("confirmPasswordInput").value.trim();
    let privacyPolicyCheckbox = document.getElementById('rememberMe');

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

    // Prüfen, ob die E-Mail bereits existiert
    const methods = await fetchSignInMethodsForEmail(auth, email);
    if (methods.length > 0) {
      alert(
        "Diese E-Mail-Adresse wird bereits verwendet. Bitte melden Sie sich an."
      );
      return;
    }

    // Benutzer in Firebase Authentication erstellen
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Benutzerdaten in der Datenbank speichern
    const userId = user.uid; // Eindeutige Benutzer-ID von Firebase
    const userRef = ref(database, `users/${userId}`);
    const userData = {
      name: name,
      email: email,
      contacts: [], // Leeres Array für Kontakte
      tasks: [], // Leeres Array für Aufgaben
    };

    await set(userRef, userData);

    // Erfolgsmeldung anzeigen
    successMessage.classList.add("show");
    setTimeout(function () {
      successMessage.classList.remove("show");
      window.location.href = "../index.html";
    }, 2000);
  } catch (error) {
    console.error("Fehler bei der Registrierung:", error);
    const errorMessage = document.getElementById("generalError");
    errorMessage.textContent = error.message || "Ein Fehler ist aufgetreten.";
  }
}

export async function displayGreeting() {
  let greeting = document.getElementById("greeting");
  let currentHour = new Date().getHours();
  let userName = localStorage.getItem("userFullName"); // Versuch, den Namen aus dem localStorage zu holen

  // Initialisiere Firebase
  const { auth, database } = await initializeFirebase();

  // Hole den Gast-Status aus localStorage
  const isGuest = localStorage.getItem("isGuest") === "true"; // Überprüfe, ob der Benutzer ein Gast ist

  // Der onAuthStateChanged Listener wird verwendet, um den aktuellen Authentifizierungsstatus zu überwachen
  onAuthStateChanged(auth, async (user) => {
    let greetingMessage = "";

    if (isGuest) {
      // Wenn der Benutzer ein Gast ist, zeige nur die allgemeine Begrüßung
      if (currentHour < 12) {
        greetingMessage = "Good Morning";
      } else if (currentHour < 18) {
        greetingMessage = "Good Day";
      } else {
        greetingMessage = "Good Evening";
      }
    } else if (user) {
      // Wenn ein normaler Benutzer eingeloggt ist, hole die Benutzerdaten aus der Firebase-Datenbank
      try {
        const userRef = ref(database, `users/${user.uid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          // Hole den Namen aus der Datenbank, wenn vorhanden
          userName =
            snapshot.val().name || localStorage.getItem("userFullName");
        } else {
          console.error(
            "Benutzerdaten in der Firebase-Datenbank nicht gefunden."
          );
        }
      } catch (error) {
        console.error(
          "Fehler beim Abrufen der Benutzerdaten aus Firebase:",
          error
        );
      }

      // Generiere die Begrüßungsnachricht
      if (!userName) {
        // Wenn kein Name vorhanden ist, zeige eine allgemeine Begrüßung an
        if (currentHour < 12) {
          greetingMessage = "Good Morning";
        } else if (currentHour < 18) {
          greetingMessage = "Good Day";
        } else {
          greetingMessage = "Good Evening";
        }
      } else {
        // Begrüßung mit dem Benutzernamen
        if (currentHour < 12) {
          greetingMessage = `Good Morning, <span class='user'>${userName}</span>`;
        } else if (currentHour < 18) {
          greetingMessage = `Good Day, <span class='user'>${userName}</span>`;
        } else {
          greetingMessage = `Good Evening, <span class='user'>${userName}</span>`;
        }
      }
    } else {
      // Wenn kein Benutzer eingeloggt ist und auch kein Gast-Status gesetzt ist
      if (currentHour < 12) {
        greetingMessage = "Good Morning";
      } else if (currentHour < 18) {
        greetingMessage = "Good Day";
      } else {
        greetingMessage = "Good Evening";
      }
    }

    greeting.innerHTML = greetingMessage; // Setze die Begrüßungsnachricht in das HTML-Element
  });
}
