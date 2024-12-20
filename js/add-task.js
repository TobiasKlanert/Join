let subtaskIdCounter = 0;
let assignedWorker = [];
let priority;
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
  assignedWorker = [];
  assignContacts();
  initializePrioButton("medium");
  submit = true;
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
      animateTaskCreated();
      setTimeout(() => {
        renderTasks();
        closeDialog('boardAddTaskDialog', 'overlay-placeholder');
      }, 1100);
      }
  }

/**
 * Function to create and push a new task to the task array.
 * Gathers all inputs, creates a task object, and stores it locally.
 */
async function pushToTasks() {
  let task = {};
  let category = getCategory();
  let dueDate = getDueDate();
  let title = getTitle();
  let description = getDescription();
  let assignedTo = assignedWorker;
  let prio = getNewTaskPrio();
  let subtasks = collectSubtasks();

  setObjAttributes(task, category, dueDate, title, description, assignedTo, prio, subtasks);
  tasks.push(task);
  saveToLocalStorage("tasks", tasks);
}

/**
 * Collects all subtasks from the DOM, converts them into objects, and returns them as an array.
 * @returns {Array<Object>} Array of subtask objects.
 */
function collectSubtasks() {
  let subtasks = [];
  let subtaskElements = document.getElementById("subtasks-container").children;
  
  for (let subtaskElement of subtaskElements) {
    if (isValidSubtaskElement(subtaskElement)) {
      let subtaskTitle = subtaskElement.innerText.trim();
      subtasks.push(createSubtaskObject(subtaskTitle));
    }
  }
  return subtasks;
}

/**
 * Checks if the given element is a valid subtask element.
 * @param {HTMLElement} element The DOM element to check.
 * @returns {boolean} True if the element is a valid subtask, otherwise false.
 */
function isValidSubtaskElement(element) {
  return element.id && element.id.startsWith("subtask-option-") && element.innerText.trim() !== "";
}

/**
 * Creates a subtask object from a given title.
 * @param {string} title The title of the subtask.
 * @returns {Object} The subtask object with `title` and `done` properties.
 */
function createSubtaskObject(title) {
  return { title: title, done: false };
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
function setObjAttributes(task,category,dueDate,title,description,assignedTo,prio,subtasks) {
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

function clearFormAddTask(){
  let form = document.getElementById('task-form')
  form.reset()
  let category = document.getElementById('category-default-option')
  category.innerHTML = 'Select Task Category'
  if (priority != 'medium') {
    changeColors('.medium-color', 'medium')
  }
  let subtask = document.getElementById('subtask-default-option')
  if (subtask.classList.contains('is-checked')) {
    closeWriteSubtask(event)
  }
  let subtaskContainer = document.getElementById('subtasks-container')
  subtaskContainer.innerHTML = ""

  let assignments = document.querySelectorAll('.rendered-options-container.bg-dark')
  assignments.forEach(element => {
    toggleClasses(element)
    document.getElementById('initials-container').innerHTML = ""
    element.querySelector('input').classList.remove('is-checked')
    assignedWorker = []
    });
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
 * this function toggles a dropdown container which shows categories for a task
 */
function showCategories() {
  let categories = document.getElementById("category-options");
  categories.classList.toggle("d-none");
  let category = document.getElementById("category-default-option");
  category.innerHTML = "Select Task Category";
  toggleDropdownArrow(2);
}

/**
 * this function replaces the default text of an element with the selected categoy
 * 
 * @param {*} event this is the click event which selects the category
 */
function selectCategory(event) {
  document.getElementById("required-category").classList.add("opacity-0");
  let value = event.target.innerHTML;
  let category = document.getElementById("category-default-option");
  category.innerHTML = value;
  let categories = document.getElementById("category-options");
  categories.classList.toggle("d-none");
}
