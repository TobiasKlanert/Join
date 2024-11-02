async function loadTemplate(elementId, templatePath) {
  await fetch(templatePath)
    .then((response) => response.text())
    .then((html) => (document.getElementById(elementId).innerHTML = html))
    .catch((error) => console.error("Fehler beim Laden des Templates:", error));
}

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

function changeImage(link, imageUrl) {
  link.querySelector("img").src = imageUrl;
}

function addMenuHighlighter(elementId, elementType) {
  const element = document.getElementById(elementId);
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
