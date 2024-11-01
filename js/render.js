function loadTemplate(elementId, templatePath) {
  fetch(templatePath)
    .then((response) => response.text())
    .then((html) => (document.getElementById(elementId).innerHTML = html))
    .catch((error) => console.error("Fehler beim Laden des Templates:", error));
}

// Doesn't work - not used
function removeClassIfPresent(elementId, className) {
  const element = document.getElementById(elementId);
  if (element && element.classList.contains(className)) {
    element.classList.remove(className);
  }
}

function removeHighlighter() {
  removeClassIfPresent("addTask", "highlight-menu-links-as-active");
  removeClassIfPresent("board", "highlight-menu-links-as-active");
  removeClassIfPresent("contacts", "highlight-menu-links-as-active");
  removeClassIfPresent("summary", "highlight-menu-links-as-active");
  removeClassIfPresent("legalNotice", "highlight-legals-links-as-active");
  removeClassIfPresent("privacyPolicy", "highlight-legals-links-as-active");
}

function addMenuHighlighter(id) {
  removeHighlighter();
  const element = document.getElementById(id);
  if (element) {
    element.classList.add("highlight-menu-links-as-active");
  } else {
    console.warn(`Element mit ID "${id}" nicht gefunden.`);
  }
}

function addLegalsHighlighter(id) {
  removeHighlighter();
  const element = document.getElementById(id);
  if (element) {
    element.classList.add("highlight-legals-links-as-active");
  } else {
    console.warn(`Element mit ID "${id}" nicht gefunden.`);
  }
}
