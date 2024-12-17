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
    document.getElementById(eleId).classList.remove('opacity-0')
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
  let subtasks = []
  for (let index = 0; index < subtaskElements.length; index++) {
    getSubtask(index ,subtasks)
  }

  setObjAttributes(task,category,dueDate,title,description,assignedTo,prio,subtasks)
  tasks.push(task);
  saveToLocalStorage("tasks", tasks);
}

/**
 * this function gets all subtasks as objects and stores them in the subtask array
 * 
 * @param {*} index is the iteration/number of the current subtask
 */
function getSubtask(index, subtasks) {
  let subtask = document.getElementById(
    "subtask-option-text-" + index
  ).innerText;
  let subtaskObj = { done: false };
  subtaskObj.title = subtask;
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



