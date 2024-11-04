function toggleDisplayNone(divId) {
  document.getElementById(divId).classList.toggle("d-none");
}

async function loadTemplate(elementId, templatePath) {
  await fetch(templatePath)
    .then((response) => response.text())
    .then((html) => (document.getElementById(elementId).innerHTML = html))
    .catch((error) => console.error("Fehler beim Laden des Templates:", error));
}

function changeImage(link, imageUrl) {
  link.querySelector("img").src = imageUrl;
}

function addMenuHighlighter(elementId, elementType) {
  const element = document.getElementById(elementId);
  for (index = 0; index < contacts.length; index++) {
    let contact = document.getElementById(`contact-${index}`);
    if (
      contact &&
      contact.classList.contains("highlight-contact-links-as-active")
    ) {
      contact.classList.remove("highlight-contact-links-as-active");
      contact.classList.add("contact-hover");
    }
  }
  if (element) {
    element.classList.add(`highlight-${elementType}-links-as-active`);
    element.classList.remove(`${elementType}-hover`);
    if (elementType == "menu") {
      changeImage(element, `../assets/img/${elementId}-icon-highlight.svg`);
    }
  } else {
    return null;
  }
}

/* Vor Abgabe löschen! Testen ob vielleicht doch noch benötigt!  */

/* function removeClassIfPresent(elementId, className) {
  const element = document.getElementById(elementId);
  if (element && element.classList.contains(className)) {
    element.classList.remove(className);
  }
} */

/* function removeHighlighter(contactId) {
  removeClassIfPresent("addTask", "highlight-menu-links-as-active");
  removeClassIfPresent("board", "highlight-menu-links-as-active");
  removeClassIfPresent("contacts", "highlight-menu-links-as-active");
  removeClassIfPresent("summary", "highlight-menu-links-as-active");
  removeClassIfPresent("legalNotice", "highlight-legals-links-as-active");
  removeClassIfPresent("privacyPolicy", "highlight-legals-links-as-active");
  removeClassIfPresent(`contact-${contactId}`, "highlight-contact-as-active")
} */
