/**
 * this function checks if a required input exist,
 * if not a reminder text is shown below input-element
 * 
 * @param {*} stat is the value of the specific input
 * @param {*} eleId id of the specific reminder text
 */
function checkRequiredInput(stat, eleId) {
  if(!stat){
    document.getElementById(eleId).classList.remove('opacity-0')
  }
}

/**
 * this function loads the add task html template into the main of this page
 */
async function loadAddTask() {
  await loadTemplate(
    "main-add-task",
    "../assets/templates/add-task-template.html"
  );
}

/**
 * this function makes a div contenEditable and it focuses on the end of the text inside said div
 * 
 * @param {*} text this is the container in which the text lies
 */
function focusTextEnd(text) {
  text.contentEditable = "true"
  text.focus();
  let textLength = text.innerText.length;
  let selection = window.getSelection();
  let range = document.createRange();
  range.selectNodeContents(text);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

/**
 * this function sets attributes for two images
 * 
 * @param {*} id this is id of the element in which the images are in
 * @param {*} img1 this is the first image
 * @param {*} img2 this is the secons image
 */
function setImgPropertiesOnEdit(id, img1, img2) {
  img1.src = "../assets/img/delete.svg";
  img1.setAttribute("onclick", `deleteSubtaskOption(${id})`);
  
  img2.src = "../assets/img/check.svg";
  img2.style.filter = "invert(1)";
  img2.setAttribute("onclick", `saveChange(${id}, event)`);
}

/**
 * this function adds an animation to a message, when a new task is created
 */
function animateTaskCreated() {
  let animatedElement = document.getElementById("task-added-container");
  animatedElement.classList.add("animate-task-added");
}

/**
 * this function turns arrow images upside-down to indicate that an element has been clicked on
 */
function toggleDropdownArrow(idNum) {
  let dropdown = document.getElementById("dropdown-arrow-" + idNum);
  dropdown.classList.toggle("turn-upside");
}


/**
 * this function shows a dropdown-container in which all contacts are shown with their initials and sorted like a list.
 * contacts can be clicked/checked to be highlighted.
 * div is contentEditable, you can write in it to search for contacts
 * 
 * @param {*} taskId 
 */
function toggleAssignmentOptions(taskId) {
  sortContactsByName("assign-options", ".contacts-name", "fullName");
  sortContactsByName("initials-container", "assign-initials", "initials");
  toggleClass(document.getElementById("assign-options"), "d-none");
  toggleDropdownArrow(1);

  let defaultOpt = document.getElementById("default-option");
  defaultOpt.classList.toggle("is-checked");

  if (defaultOpt.classList.contains("is-checked")) {
    defaultOpt.addEventListener("click", stopEvent);
    defaultOpt.textContent = "";
    searchAssignments();
    defaultOpt.focus();
  } else {
    defaultOpt.removeEventListener("click", stopEvent);
    defaultOpt.innerHTML = "Select contacts to assign";
  }
}

/**
 * this functions stops an event propagation
 * 
 * @param {*} e this is the event
 */
function stopEvent(e) {
  e.stopPropagation();
}


/**
 * this is a search function that filters all contacts matching what was written in a div
 */
function searchAssignments() {
  let search = document.getElementById("default-option");
  let value = search.textContent;

  let contacs = document.getElementsByClassName("contacts-name");
  for (let index = 0; index < contacs.length; index++) {
    const element = contacs[index];

    if (element.innerHTML.toUpperCase().includes(value.toUpperCase())) {
      element.parentNode.parentNode.style.display = "flex";
    } else {
      element.parentNode.parentNode.style.display = "none";
    }
  }
}

/**
 * this function iterates through the contacts array and renders the contacts initials
 * in a circle with the corresponding backgroundcolor
 */
function assignContacts() {
  let assignOptions = document.getElementById("assign-options");
  assignOptions.innerHTML = "";
  contacts.forEach((e, i) => {
    if (e && e.IsInContacts) {
      assignOptions.innerHTML += renderAssignmentOptions(e.initials, e.name, i);
      document.getElementById("assignments-" + (i + 1)).style.backgroundColor =
        e.color;
    }
  });
}

/**
 * this function renders initials icons of contacts that where previously clicked
 * it removes them if clicked again
 * it also highlight those contacts that were clicked
 * 
 * @param {*} element this is the contact in the dropdown container that is to be/not to be highlighted/checked
 * @param {*} index this is the index of the element in the contact array
 */
function toggleAssignment(element, index) {
  toggleClasses(element);

  let inputEle = element.getElementsByTagName("input")[0];
  GetOrRemoveAssignment(inputEle)

  let initIcon = document.getElementById("assignments-icons-" + (index + 1));
  if (initIcon) {
    initIcon.remove();
  } else {
    let iconCont = document.getElementById("initials-container");
    iconCont.innerHTML += renderInitIcons(index);
    document.getElementById(
      "assignments-icons-" + (index + 1)
    ).style.backgroundColor = contacts[index].color;
  }
}

/**
 * this function gets the last char of the id on an clicked element
 * this char is a number and is equal to an corresponding index in the contacts array
 * this number gets either pushed or spliced from an array 
 * 
 * @param {*} inputEle this is the clicked contact in an dropdwon container
 */
function GetOrRemoveAssignment(inputEle) {
  toggleClass(inputEle, "is-checked");
  if (inputEle.classList.contains("is-checked")) {
    inputEle.checked = true;
    let id = inputEle.id.slice(-1);
    assignedWorker.push(id);
  } else {
    inputEle.checked = false;
    let id = inputEle.id.slice(-1);
    for (let index = 0; index < assignedWorker.length; index++) {
      const element = assignedWorker[index];
      if (id == element) {
        assignedWorker.splice(assignedWorker[index], 1);
      }
    }
  }
}


/**
 * this function toggles some classes, so an elements is highlighted or not
 * 
 * @param {*} element this is a clickable contact in an dropdow container
 */
function toggleClasses(element) {
  toggleClass(element, "bg-dark");
  toggleClass(element, "col-white");
  toggleClass(element, "hover-enabler");
}

/**
 * this functon renders the name and initials of a contact
 * 
 * @param {*} initials these are the initials of the contact
 * @param {*} name this is the name of the contact
 * @param {*} index this is the index of the contact in the contacts array
 * @returns this is the rendered html template
 */
function renderAssignmentOptions(initials, name, index) {
  return `
        <div id="rendered-options-container-${index}" class="rendered-options-container hover-enabler" onclick="toggleAssignment(this, ${index})">
            <div class="rendered-option">
                <div id="assignments-${index + 1}" class="assign-initials">
                        ${initials}
                    </div>
                <div class="contacts-name">${getShortenedDescription(name, 24)} ${getOwnUser(name, "string")}</div>
            </div>
            <input type="checkbox" id="assign-check-${index}">
        </div>
    `;
}

/**
 * this function renders the initials of a contact thats was clicked in a dropdown container
 * 
 * @param {*} index this is the index of the contact in the contacts array
 * @returns this is the rendered html template
 */
function renderInitIcons(index) {
  return `
        <div id="assignments-icons-${index + 1}" data-index="${
    index + 1
  }" class="assign-initials">
            ${contacts[index].initials}
        </div>
    `;
}

/**
 * this function shows reminder text for a required input if the input is empty and vice versa
 * it also changes the color of a box shadow to indicate whether an input is empty or not
 * 
 * @param {*} id this is the id of the input element / reminder text
 */
function showRequired(id) {
  let element = document.getElementById("required-" + id);
  let input = document.getElementById(id);
  let value = input.value;

  if (value) {
    element.classList.add("opacity-0");
    input.classList.remove("focus-red");
    input.classList.add("focus-blue");
  } else {
    input.classList.remove("focus-blue");
    input.classList.add("focus-red");
    element.classList.remove("opacity-0");
  }
}

/**
 * this function shows reminder text for a required input if the input is empty and vice versa
 * it also changes the color of a box shadow to indicate whether an input is empty or not
 * 
 * @param {*} id this is the id of the input element / reminder text
 */
function showReqiredText(id) {
  let input = document.getElementById(id);
  let element = document.getElementById("required-" + id);
  let value = input.value;
  if (value) {
    element.classList.add("opacity-0");
    input.classList.add("focus-blue");
    input.classList.remove("focus-red");
  } else {
    element.classList.remove("opacity-0");
    input.classList.add("focus-red");
    input.classList.remove("focus-blue");
  }
}

/**
 * Retrieves the category input value.
 * @returns {string} The selected category.
 */
function getCategory() {
  return document.getElementById("category-default-option").innerHTML.trim();
}

/**
 * Retrieves the due date input value.
 * @returns {string} The selected due date.
 */
function getDueDate() {
  return document.getElementById("due-date").value.trim();
}

/**
 * Retrieves the task title input value.
 * @returns {string} The entered task title.
 */
function getTitle() {
  return document.getElementById("title").value.trim();
}

/**
 * Retrieves the task description input value.
 * @returns {string} The entered task description.
 */
function getDescription() {
  return document.getElementById("description").value.trim();
}

/**
 * this function is the rendered html template for the subtasks 
 * 
 * @param {*} value this is what is written in the contentEditable subtask div
 * @returns 
 */
function renderSubtask(value) {
  return `
  <ul id="subtask-option-${subtaskIdCounter}" class="subtask-options hover-enabler"> 
  <li>
      
        <div class="subtask-options-body">
          <div id="subtask-option-text-${subtaskIdCounter}" class="subtask-option-text">
            ${value}
          </div>
          <div id="subtaskOptions" class="subtask-options-img subtask-options-visibility">
            <img id="first-subtask-img-${subtaskIdCounter}" onclick="editSubtaskOption(${subtaskIdCounter})" src="../assets/img/edit.svg">
            <div class="seperation-subtask"></div>
            <img id="second-subtask-img-${subtaskIdCounter}" onclick="deleteSubtaskOption(${subtaskIdCounter})" src="../assets/img/delete.svg">
          </div
        </div>
      
    </li>
  </ul>
  `;
}

/**
 * this function renders two images with onclick events,
 * one submits the subtask, the other sets the default state of the contentEditable subtask div
 * 
 * @returns 
 */
function renderSubtaskImg() {
  return `
        <div class="dropdown-arrow">
            <div class="dropdown-img" onclick="closeWriteSubtask(event)">
                <img  src="../assets/img/close-button.svg" alt="">
            </div>
        </div>

        <div class="seperation-subtask"></div>

        <div class="dropdown-arrow" onclick="submitSubtask()">
            <div class="dropdown-img">
                <img style="filter:invert(1)" src="../assets/img/check.svg" alt="">

            </div>
        </div>
        
    `;
}