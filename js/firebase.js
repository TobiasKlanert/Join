import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import {
  getDatabase,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

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

    console.log("Firebase erfolgreich initialisiert.");

    return { app, auth, database };
  } catch (error) {
    console.error("Fehler bei der Initialisierung von Firebase:", error);
    throw error; // Fehler weiterwerfen, um ihn zu behandeln
  }
}

// Gast-Login Funktion
export async function guestLogin() {
  try {
    // Initialisiere Firebase und hole die benötigten Objekte
    const { database } = await initializeFirebase(); // Initialisiere Firebase, ohne Authentifizierung

    // Gast-Daten aus der Datenbank abrufen
    const guestUserData = await fetchUserData(database, "guestUser");

    if (guestUserData) {
      console.log("Gast-Daten:", guestUserData);

      // Speichern der Gast-Daten im localStorage
      saveDataToLocalStorage(guestUserData);
    } else {
      console.log("Gast-Daten nicht gefunden.");
    }
  } catch (error) {
    console.error("Fehler beim Gast-Login:", error);
  }
}

// Funktion für den normalen Benutzer-Login
export async function userLogin() {
  try {
    // Initialisiere Firebase und hole die benötigten Objekte
    const { auth, database } = await initializeFirebase();

    // Benutzer mit E-Mail und Passwort anmelden (hier kannst du den eigenen Login-Mechanismus verwenden)
    const userCredential = await signInWithEmailAndPassword(
      auth,
      "user@example.com",
      "password123"
    );
    const user = userCredential.user;

    console.log("Benutzer erfolgreich eingeloggt:", user.uid);

    // Benutzerdaten abrufen
    const userData = await fetchUserData(database, user.uid);

    if (userData) {
      console.log("Benutzer-Daten:", userData);

      // Daten im localStorage speichern
      saveDataToLocalStorage(userData);
    }
  } catch (error) {
    console.error("Fehler beim Benutzer-Login:", error);
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
