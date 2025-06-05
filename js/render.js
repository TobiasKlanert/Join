let prevElement = null;
let prevClassName;

/**
 * Toggles the CSS class "d-none" on an specified element.
 * This class is used to hide an element by setting its display to "none".
 *
 * @param {string} divId - The ID of the div element whose visibility is to be toggled.
 */
function toggleDisplayNone(divId) {
  document.getElementById(divId).classList.toggle("d-none");
}

/**
 * Loads header and menu templates.
 * Removes menu buttons if no user is logged in.
 * Renders user initials into menu button, if a user is logged in.
 *
 * @param {string} elementId - The ID of the element to highlight.
 * @param {string} elementType - The type of element to highlight.
 * @returns {Promise<void>} - A promise that resolves when all templates are loaded.
 */
async function loadTemplates(elementId, elementType) {
  await loadTemplate("menu-content", "../assets/templates/menu-template.html");
  await loadTemplate(
    "header-content",
    "../assets/templates/header-template.html"
  );
  addMenuHighlighter(elementId, elementType);
  const loginStatus = checkLoginStatus();
  if (loginStatus) {
    removeElements();
  } else {
    getLoggedInUserInitials();
  }
}

/**
 * Calculates and sets the initials of the logged-in user in the menu button.
 * If the user is logged in as a guest, the letter "G" will be displayed.
 */
function getLoggedInUserInitials() {
  let initialsContainer = document.getElementById("userCircle");
  let initials = "";
  const isGuest = localStorage.getItem("isGuest") === "true";

  if (isGuest) {
    initials = "G";
  } else {
    initials = getInitials(localStorage.getItem("name"));
  }

  initialsContainer.innerHTML = "";
  initialsContainer.innerHTML = initials;
}

/**
 * Loads an HTML template from a specified URL and inserts it into the given element.
 *
 * @param {string} elementId - The ID of the element to insert the template into.
 * @param {string} templatePath - The path to the template to load.
 * @returns {Promise<void>} - A promise that resolves when the template has been successfully loaded.
 */
async function loadTemplate(elementId, templatePath) {
  await fetch(templatePath)
    .then((response) => response.text())
    .then((html) => (document.getElementById(elementId).innerHTML = html))
    .catch((error) => console.error("Fehler beim Laden des Templates:", error));
}

/**
 * Highlights the specified menu or contact element and updates its appearance.
 *
 * @param {string} elementId - The ID of the element to highlight.
 * @param {string} elementType - The type of the element (e.g., 'menu' or 'contact').
 */
function addMenuHighlighter(elementId, elementType) {
  const element = document.getElementById(elementId);
  resetContactHighlights();

  if (element) {
    updateElementHighlight(element, elementType, elementId);
  } else {
    return null;
  }
}

/**
 * Removes highlight from all contact elements and restores hover classes.
 */
function resetContactHighlights() {
  for (let index = 0; index < contacts.length; index++) {
    const contact = document.getElementById(`contact-${index}`);
    if (
      contact &&
      contact.classList.contains("highlight-contact-links-as-active")
    ) {
      contact.classList.remove("highlight-contact-links-as-active");
      contact.classList.add("contact-hover");
    }
  }
}

/**
 * Updates the highlight and hover state for the given element based on its type.
 *
 * @param {HTMLElement} element - The DOM element to update.
 * @param {string} elementType - The type of the element (e.g., 'menu' or 'contact').
 * @param {string} elementId - The ID of the element.
 */
function updateElementHighlight(element, elementType, elementId) {
  element.classList.add(`highlight-${elementType}-links-as-active`);
  element.classList.remove(`${elementType}-hover`);

  if (elementType === "menu") {
    updateElementImage(element, elementId);
  }
}

/**
 * Changes the image associated with a menu element to its highlighted version.
 *
 * @param {HTMLElement} element - The menu element whose image will be updated.
 * @param {string} elementId - The ID of the menu element.
 */
function updateElementImage(element, elementId) {
  const imagePath = `../assets/img/${elementId}-icon-highlight.svg`;
  changeImage(element, imagePath);
}

/**
 * Changes the image source for the specified element.
 *
 * @param {HTMLElement} element - The element whose image source needs to be updated.
 * @param {string} imagePath - The new image path to set.
 */
function changeImage(element, imagePath) {
  // Assuming the element contains an <img> tag as its child.
  const img = element.querySelector("img");
  if (img) {
    img.src = imagePath;
  }
}

/**
 * Toggles visibility of a specific dialog.
 *
 * @param {string} element - Name of the dialog to be toggled.
 */
async function toggleDialog(element) {
  setTimeout(() => {
    document.getElementById(element).classList.toggle("hidden");
  }, 1);
}

/**
 * Closes a specific dialog
 *
 * @param {string} dialog - Name of the dialog to be closed.
 * @param {string} overlay - Name of the overlay to be closed.
 */
async function closeDialog(dialog, overlay) {
  toggleDialog(dialog);
  bodyHideScrollbar();
  setTimeout(() => {
    toggleDisplayNone(overlay);
  }, 125);
}

/**
 * Changes the source of an image within a specified link element.
 *
 * @param {HTMLElement} link - The link element containing the image.
 * @param {string} imageUrl - The new source URL for the image.
 */
function changeImage(link, imageUrl) {
  link.querySelector("img").src = imageUrl;
}

/**
 * Shortens a description to a specified maximum length, appending ellipses if truncated.
 *
 * @param {string} description - The original description text.
 * @param {number} maxLength - The maximum allowed length of the shortened description.
 * @returns {string} The shortened description, with "..." if truncated.
 */
function getShortenedDescription(description, maxLength) {
  if (description.length > maxLength) {
    return description.substring(0, maxLength) + "...";
  }
  return description;
}

/**
 * Initializes the "Medium" priority button by applying styles and setting its priority state.
 */
function initializeMediumButton() {
  const mediumButton = document.getElementById("medium");
  const mediumColorClass = ".medium-color";
  const mediumSvg = document.querySelector(mediumColorClass);

  mediumButton.classList.add("is-inverted", "color-white");
  mediumButton.style.backgroundColor = window
    .getComputedStyle(mediumSvg, null)
    .getPropertyValue("fill");

  document.querySelectorAll(mediumColorClass).forEach((e) => {
    e.classList.add("fill-color-white");
  });

  prevElement = mediumButton;
  prevClassName = mediumColorClass;
  priority = "medium";
}

/**
 * Initializes a priority button based on the specified priority type.
 *
 * @param {string} prio - The priority type (e.g., "low", "medium", "urgent").
 */
function initializePrioButton(prio) {
  const button = document.getElementById(prio);
  const colorClass = `.${prio}-color`;
  const svg = document.querySelector(colorClass);

  button.classList.add("is-inverted", "color-white");
  button.style.backgroundColor = window
    .getComputedStyle(svg, null)
    .getPropertyValue("fill");

  document.querySelectorAll(colorClass).forEach((e) => {
    e.classList.add("fill-color-white");
  });

  prevElement = button;
  prevClassName = colorClass;
  priority = prio;
}

/**
 * Updates the priority button colors and handles toggling of the selected state.
 *
 * @param {string} className - The CSS class of the element to update.
 * @param {string} id - The ID of the button to update.
 * @param {string} prio - The new priority type (e.g., "low", "medium", "urgent").
 */
function changeColors(className, id, prio) {
  let element = document.getElementById(id);

  if (isPrevButtonInverted(prevElement, element)) {
    invertColors(prevClassName, prevElement);
  }
  invertColors(className, element);
  prevElement = element;
  prevClassName = className;
  priority = prio;
}

/**
 * Checks if the previously selected button is inverted (i.e., in the toggled state).
 *
 * @param {HTMLElement|null} prevElement - The previously selected element.
 * @param {HTMLElement} element - The currently selected element.
 * @returns {boolean} True if the previous button is inverted; otherwise, false.
 */
function isPrevButtonInverted(prevElement, element) {
  if (
    prevElement != null &&
    prevElement != element &&
    prevElement.classList.contains("is-inverted")
  ) {
    return true;
  }
  return false;
}

/**
 * Toggles the color inversion for a specified element and updates its styles.
 *
 * @param {string} className - The CSS class for the SVG element to update.
 * @param {HTMLElement} element - The button element to update.
 */
function invertColors(className, element) {
  element.classList.toggle("is-inverted");

  let svg = document.querySelector(className);
  let fillColor = window.getComputedStyle(svg, null).getPropertyValue("fill");
  element.style.backgroundColor = fillColor;

  let svgPaths = document.querySelectorAll(className);
  svgPaths.forEach((e) => {
    e.classList.toggle("fill-color-white");
  });

  element.classList.toggle("color-white");
}

/**
 * Sorts the children of a container element by the specified key.
 *
 * @param {string} element - The ID of the container element.
 * @param {string} selector - The selector used to extract text content for sorting.
 * @param {string} key - The sorting key ('fullName' or 'initials').
 */
function sortContactsByName(element, selector, key) {
  const container = document.getElementById(element);
  const templates = Array.from(container.children);

  switch (key) {
    case "fullName":
      sortByFullName(templates, selector);
      break;
    case "initials":
      sortByInitials(templates);
      break;
  }
  appendSortedTemplates(container, templates);
}

/**
 * Determines if a contact element refers to the current user.
 *
 * @param {HTMLElement} contact - The contact element to check.
 * @param {string} selector - The selector used to extract the contact name.
 * @returns {boolean} True if the contact is the current user, false otherwise.
 */
function isYou(contact, selector) {
  const name = contact.querySelector(selector).textContent.trim().toLowerCase();
  return name.includes("(you)");
}

/**
 * Sorts an array of templates by full name.
 *
 * @param {HTMLElement[]} templates - The array of template elements to sort.
 * @param {string} selector - The selector used to extract text content for sorting.
 */
function sortByFullName(templates, selector) {
  templates.sort((a, b) => {
    const nameA = a.querySelector(selector).textContent.trim().toLowerCase();
    const nameB = b.querySelector(selector).textContent.trim().toLowerCase();

    if (isYou(a, selector)) return -1;
    if (isYou(b, selector)) return 1;

    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });
}

/**
 * Sorts an array of templates by initials.
 *
 * @param {HTMLElement[]} templates - The array of template elements to sort.
 */
function sortByInitials(templates) {
  templates.sort((a, b) => {
    const textA = a.textContent.trim();
    const textB = b.textContent.trim();
    const isBracketedA = /^\(\+\d+\)$/.test(textA);
    const isBracketedB = /^\(\+\d+\)$/.test(textB);

    if (isBracketedA && isBracketedB) {
      return textA.localeCompare(textB);
    }
    if (isBracketedA) return 1;
    if (isBracketedB) return -1;

    return textA.localeCompare(textB);
  });
}  

/**
 * Appends the sorted templates back to the container element.
 *
 * @param {HTMLElement} container - The container element to update.
 * @param {HTMLElement[]} templates - The sorted array of template elements.
 */
function appendSortedTemplates(container, templates) {
  templates.forEach((template) => container.appendChild(template));
}

/**
 * Toggles the scrollbar of the HTML body.
 */
function bodyHideScrollbar() {
  document.body.classList.toggle("no-scroll");
}

/**
 * Clears the content of the overlay placeholder.
 */
function clearOverlayPlaceholder() {
  document.getElementById("overlay-placeholder").innerHTML = "";
}