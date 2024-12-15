let subtaskIdCounter = 0;
let assignedWorker = [];
let priority;
let subtasks = [];
let submit = false;
let currentStatus = "toDo";
let isTitleSet,
  isCategorySet,
  isDateSet = false;

/**
 * this function loads html templates, renders initial-icons, sets the mediums priority-button
 * and sets submit to true, so an formsubmission only happens on this page because the createTask
 * function is used elsewhere
 * 
 * @param {*} elementId is the add task in the menu bar
 * @param {*} elementType gives a class, so the background is highlighted(darker)
 */
async function initAddTask(elementId, elementType) {
  await loadTemplates(elementId, elementType);
  await loadAddTask();
  assignContacts();
  initializePrioButton("medium");
  submit = true;
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
 * this function cheks if all required inputs exists,
 * afterwards all inputs are added to the task array and tasks can be rendered.
 * if a submission happens, page goes to board and render tasks
 */
function createTask() {
  let categoryText = document.getElementById("category-default-option").innerHTML;
  let category;
  if(categoryText == "Technical Task" || categoryText == "User Story"){
    category = categoryText
  }
  let dueDate = document.getElementById("due-date").value;
  let title = document.getElementById("title").value;

  checkRequiredInput(title, "required-title")
  checkRequiredInput(dueDate, "required-due-date")
  checkRequiredInput(category, "required-category")
  if (category && dueDate && title) {
  addTaskAndSubmit()
  }
}

/**
 * this function checks if a required input exist,
 * if not a reminder text is shown below input-element
 * 
 * @param {*} stat is the value of the specific input
 * @param {*} eleId id of the specific reminder text
 */
function checkRequiredInput(stat, eleId) {
  if(!stat){
  toggleDisplayNone(eleId)
  }
}

/**
 * this function pushes a new created task to the task array.
 * task is localy stored, so it can be rendered if a submission(pagereload) happens.
 * if a submission happens it is delayed, so an animation can play,
 * if not it means we are on the board page, so tasks are rendered and dialog window is closed afterwards
 */
function addTaskAndSubmit() {
  
    pushToTasks();
    saveToLocalStorage("tasks", tasks);

    if (submit) {
      let form = document.getElementById("task-form");
      animateTaskCreated();
      setTimeout(() => {
        form.submit();
      }, 1100);
    } else {
      renderTasks();
      closeDialog('boardAddTaskDialog', 'overlay-placeholder');
    }
  }

/**
 * this function gets all values from the inputs, creates a new task 
 * and set its attributes equal to the values.
 * new task is pushed to task array and ist stored localy
 */
async function pushToTasks() {
  let task = {};
  let category = document.getElementById("category-default-option").innerHTML;
  let dueDate = document.getElementById("due-date").value;
  let title = document.getElementById("title").value;
  let description = document.getElementById("description").value;
  let assignedTo = assignedWorker;
  let prio = getNewTaskPrio();
  let subtaskElements = document.getElementById("subtasks-container").children;

  for (let index = 0; index < subtaskElements.length; index++) {
    getSubtask(index)
  }

  setObjAttributes(task,category,dueDate,title,description,assignedTo,prio,subtaskElements)
  tasks.push(task);
  saveToLocalStorage("tasks", tasks);
}

/**
 * this function gets all subtasks as objects and stores them in the subtask array
 * 
 * @param {*} index is the iteration/number of the current subtask
 */
function getSubtask(index) {
  let subtask = document.getElementById(
    "subtask-option-text-" + index
  ).innerText;
  let subtaskObj = { done: false };
  subtaskObj.title = subtask;
  console.log(subtaskObj);
  subtasks.push(subtaskObj);
  }


/**
 * this function sets the attributes of the new task 
 * 
 * @param {*} task this is the new task as an empty object
 * @param {*} category this is the category of the task, technical task or user story
 * @param {*} dueDate this is the date to which the task is to be finished
 * @param {*} title this is the title of the task
 * @param {*} description this is a description of what to do
 * @param {*} assignedTo these are the worker assigned to this task
 * @param {*} prio this is the priority of the task
 */
function setObjAttributes(task,category,dueDate,title,description,assignedTo,prio) {
  task.category = category;
  task.dueDate = dueDate;
  task.title = title;
  task.description = description;
  task.assignedTo = assignedTo;
  task.prio = prio;
  task.subtasks = subtasks;
  task.status = currentStatus;
}

function getNewTaskPrio() {
  const selectedButton = document.querySelector(".prio-button.is-inverted");
  if (selectedButton) {
    return selectedButton.getAttribute("data-prio");
  }
}

/**
 * this function allowes to write subtasks in an div element that is contentEditable
 * and it removes an onclick function, so another onclick doesnt toggle this
 */
function writeSubtask() {
  let parent = document.getElementById("subtask-default-option-container");
  parent.removeAttribute("onclick", "writeSubtask()");

  changeSubtask();
}

/**
 * this function helps to write in an contentEditable div by making it empty, focusing it and changing the color.
 * it also renders images that enables to either submit the written subtask or to set the default state
 */
function changeSubtask() {
  let subtask = document.getElementById("subtask-default-option");
  let subtaskImg = document.getElementById("subtask-img");

  subtask.classList.toggle("col-custom-lg");
  subtask.classList.toggle("is-checked");

  if (subtask.classList.contains("is-checked")) {
    subtaskImg.innerHTML = renderSubtaskImg();
    subtask.innerHTML = "";
    subtask.focus();
  } else {
    subtask.innerHTML = "Add new subtasks";
    subtaskImg.innerHTML = `<div class="dropdown-img"><img  src="../assets/img/add.svg" alt=""></div>`;
  }
}

/**
 * this function sets the default state of the subtask contentEditable div
 * 
 * @param {*} event this is an onclick event
 */
function closeWriteSubtask(event) {
  let parent = document.getElementById("subtask-default-option-container");
  parent.setAttribute("onclick", "writeSubtask()");
  event.stopPropagation();

  changeSubtask();
}

/**
 * this function allowes to submit a subtask by pressing the enter button
 * 
 * @param {*} event this is a keypress event
 */
function submitIfEnter(event) {
  if (event.key === "Enter") {
    submitSubtask();
    event.preventDefault();
  }
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

/**
 * this function renders the submitted subtasks in a different div
 * it gives the subtasks id's and it empties and focuses back on the contentEditable div, 
 * so another subtask can be written conveniently
 */
function submitSubtask() {
  let textField = document.getElementById("subtask-default-option");
  let value = textField.innerHTML;
  let subtasks = document.getElementById("subtasks-container");
  subtasks.innerHTML += renderSubtask(value);
  subtaskIdCounter++;
  textField.innerHTML = "";
  textField.focus();
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
 * this functions deletes the associated rendered subtask option
 * 
 * @param {*} id this is the element id of the to deleted div
 */
function deleteSubtaskOption(id) {
  let listElement = document.getElementById("subtask-option-" + id);
  listElement.remove();
}

/**
 * this function enables editing of the renderend subtask options
 * it makes associated divs contentEditable and it focuses on them
 * it toggles classes on hovering and focus
 * and it sets properties for the clickable imgages inside the div(s)
 * 
 * @param {*} id this is the element id of the div that is to be edited
 */
function editSubtaskOption(id) {
  let contentDiv = document.getElementById("subtask-option-" + id);
  let subtaskOptions = document.getElementById("subtaskOptions");
  let text = document.getElementById("subtask-option-text-" + id);
  let firstImg = document.getElementById("first-subtask-img-" + id);
  let secondImg = document.getElementById("second-subtask-img-" + id);

  focusTextEnd(text) 

  contentDiv.classList.toggle("hover-enabler");
  contentDiv.classList.toggle("blue-underline");
  subtaskOptions.classList.toggle("subtask-options-visibility");
  
  setImgPropertiesOnEdit(id, firstImg, secondImg)
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
 * this function sets the default state of a div by removing contentEditable
 * and setting default properties to two clickable images
 * 
 * @param {*} id id of the element that is set to default
 */
function saveChange(id) {
  document.getElementById("subtask-option-text-" + id).contentEditable = "false"
  let contentDiv = document.getElementById("subtask-option-" + id);
  let subtaskOptions = document.getElementById("subtaskOptions");
  contentDiv.classList.toggle("hover-enabler");
  contentDiv.classList.toggle("blue-underline");
  subtaskOptions.classList.toggle("subtask-options-visibility");
  let firstImg = document.getElementById("first-subtask-img-" + id);
  firstImg.src = "../assets/img/edit.svg";
  firstImg.setAttribute("onclick", `editSubtaskOption(${id})`);
  let secondImg = document.getElementById("second-subtask-img-" + id);
  secondImg.src = "../assets/img/delete.svg";
  secondImg.style.filter = "invert(0)";
  secondImg.setAttribute("onclick", `deleteSubtaskOption(${id})`);
}

/**
 * this function 
 */
function animateTaskCreated() {
  let animatedElement = document.getElementById("task-added-container");
  animatedElement.classList.add("animate-task-added");
}

function toggleDropdownArrow(idNum) {
  let dropdown = document.getElementById("dropdown-arrow-" + idNum);
  dropdown.classList.toggle("turn-upside");
}

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

  const task = tasks[taskId];
  if (task && task.assignedTo) {
    task.assignedTo.forEach((index) => {
      const element = document.getElementById(
        `rendered-options-container-${index}`
      );
      if (element) {
        toggleAssignment(element, index);
      }
    });
  }
}

function stopEvent(e) {
  e.stopPropagation();
}

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

/* function assignContacts(taskId) {
  const assignOptions = document.getElementById("assign-options");
  assignOptions.innerHTML = "";

  // Get the task and its assigned contacts
  const task = tasks[taskId];
  const assignedContacts = task ? task.assignedTo : [];

  // Render options
  contacts.forEach((contact, index) => {
    assignOptions.innerHTML += renderAssignmentOptions(
      contact.initials,
      contact.name,
      index
    );

    // Set background color for the contact
    const assignmentDiv = document.getElementById(`assignments-${index + 1}`);
    assignmentDiv.style.backgroundColor = contact.color;
  });

  // Automatically call toggleAssignment for already assigned contacts
  assignedContacts.forEach((index) => {
    const element = document.getElementById(
      `rendered-options-container-${index}`
    );
    if (element) {
      toggleAssignment(element, index);
    }
  });
} */

function toggleAssignment(element, index) {
  toggleClass(element, "bg-dark");
  toggleClass(element, "col-white");
  toggleClass(element, "hover-enabler");

  let inputEle = element.getElementsByTagName("input")[0];
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
  /* sortAssignedContacts(); */
}

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

function renderInitIcons(index) {
  return `
        <div id="assignments-icons-${index + 1}" data-index="${
    index + 1
  }" class="assign-initials">
            ${contacts[index].initials}
        </div>
    `;
}

function showCategories() {
  let categories = document.getElementById("category-options");
  categories.classList.toggle("d-none");
  let category = document.getElementById("category-default-option");
  category.innerHTML = "Select Task Category";
  toggleDropdownArrow(2);
}

function selectCategory(event) {
  document.getElementById("required-category").classList.remove("opacity-1");
  let value = event.target.innerHTML;
  let category = document.getElementById("category-default-option");
  category.innerHTML = value;
  let categories = document.getElementById("category-options");
  categories.classList.toggle("d-none");
}

function showRequired(id) {
  let element = document.getElementById("required-" + id);
  let input = document.getElementById(id);
  let value = input.value;

  if (value) {
    element.classList.remove("opacity-1");
    input.classList.remove("focus-red");
    input.classList.add("focus-blue");
  } else {
    input.classList.remove("focus-blue");
    input.classList.add("focus-red");
    element.classList.add("opacity-1");
  }
}

function showReqiredText(id) {
  let input = document.getElementById(id);
  let element = document.getElementById("required-" + id);
  let value = input.value;
  if (value) {
    element.classList.remove("opacity-1");
    input.classList.add("focus-blue");
    input.classList.remove("focus-red");
  } else {
    element.classList.add("opacity-1");
    input.classList.add("focus-red");
    input.classList.remove("focus-blue");
  }
}
