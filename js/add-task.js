let subtaskIdCounter = 0;
let assignedWorker = []
let priority;
let subtasks = []
let submit = false;
let currentStatus = 'toDo'
let isTitleSet, isCategorySet, isDateSet = false

async function initAddTask(elementId, elementType) {
  await loadTemplates(elementId, elementType);
  await loadAddTask()
  await getUser();
  assignContacts();
  await getTasks();
  console.table(tasks);
  submit = true
}

// function enableSubmit() {
//   let categorySet = false;
  
//   let titleValue = document.getElementById('title').value
//   let dateValue = document.getElementById('due-date').value
//   let categoryValue = document.getElementById('category-default-option').innerText
//   if (categoryValue == 'Technical Task' || categoryValue == 'User Story') {
//     categorySet = true
//   }
//   if (titleValue && dateValue && categorySet) {
    
//     document.getElementById('create-task-button').removeAttribute('disabled', 'true')
//     console.log(true);
//   } else {
//     console.log(false);
//     document.getElementById('create-task-button').setAttribute('disabled', 'true')
//   }
// }

async function initAddTaskTemplate(){
  await getUser();
  assignContacts();
}

async function loadAddTask() {
  await loadTemplate('main-add-task', '../assets/templates/add-task-template.html')
}  

function resetForm() {
  document.getElementById("task-form").reset();
}

function createTask() {
  let category = document.getElementById('category-default-option').innerHTML
  let dueDate = document.getElementById('due-date').value
  let title = document.getElementById('title').value
  console.log(category);
  
  if (category != 'Technical Task' && category != 'User Story') {
    document.getElementById('required-category').classList.add('opacity-1')
    console.log(true);
  }
  if (!title) {
    document.getElementById('required-title').classList.add('opacity-1')
  }
  if (!dueDate) {
    document.getElementById('required-due-date').classList.add('opacity-1')
  }
  if (category && dueDate && title) {
    pushToTasks();

  if (submit) {
    let form = document.getElementById("task-form");
    animateTaskCreated();
    setTimeout(() => {form.submit()}, 1100);
  } else{
    renderTasks();
  }
}
}

async function pushToTasks() {
  
  let task = {}
  let category = document.getElementById('category-default-option').innerHTML
  let dueDate = document.getElementById('due-date').value
  let title = document.getElementById('title').value
  let description = document.getElementById('description').value
  let assignedTo = assignedWorker
  let prio = priority
  let subtaskElements = document.getElementById('subtasks-container').children
  
  for (let index = 0; index < subtaskElements.length; index++) {
    let subtask = document.getElementById('subtask-option-text-' + index).innerText
    let subtaskObj = {done: false}
    subtaskObj.title = subtask
    console.log(subtaskObj);
    subtasks.push(subtaskObj)
  }
  task.category = category
  task.dueDate = dueDate
  task.title = title
  task.description = description
  task.assignedTo = assignedTo
  task.prio = prio
  task.subtasks = subtasks
  task.status = currentStatus
  tasks.push(task)
  console.log(tasks);
  let taskJSON = JSON.stringify(task)
  localStorage.setItem("task", taskJSON)
  console.log(taskJSON);
  
}


function writeSubtask() {
  let parent = document.getElementById("subtask-default-option-container");
  parent.removeAttribute("onclick", "writeSubtask()");

  changeSubtask();
}

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

function closeWriteSubtask(event) {
  let parent = document.getElementById("subtask-default-option-container");
  parent.setAttribute("onclick", "writeSubtask()");
  event.stopPropagation();

  changeSubtask();
}

function submitIfEnter(event) {
  if (event.key === "Enter") {
    submitSubtask();
    event.preventDefault();
  }
}

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

function submitSubtask() {
  let textField = document.getElementById("subtask-default-option");
  let value = textField.innerHTML;
  let subtasks = document.getElementById("subtasks-container");
  subtasks.innerHTML += renderSubtask(value);
  subtaskIdCounter++;
  textField.innerHTML = "";
  textField.focus();
}

function renderSubtask(value) {
  return `
  <ul id="subtask-option-${subtaskIdCounter}" class="hover-enabler"> 
  <li>
      
        <div class="subtask-options">
          <div id="subtask-option-text-${subtaskIdCounter}" class="subtask-option-text">
            ${value}
          </div>
          <div class="subtask-options-img">
            <img id="first-subtask-img-${subtaskIdCounter}" onclick="editSubtaskOption(${subtaskIdCounter})" src="../assets/img/edit.svg">
            <div class="seperation-subtask"></div>
            <img id="second-subtask-img-${subtaskIdCounter}" onclick="deleteSubtaskOption(${subtaskIdCounter})" src="../assets/img/delete.svg">
          </div
        </div>
      
    </li>
  </ul>
  `;
}

function deleteSubtaskOption(id) {
  let listElement = document.getElementById("subtask-option-" + id);
  listElement.remove();
}

function editSubtaskOption(id) {
  let contentDiv = document.getElementById("subtask-option-" + id);
  let text = document.getElementById("subtask-option-text-" + id);
  let firstImg = document.getElementById("first-subtask-img-" + id);
  let secondImg = document.getElementById("second-subtask-img-" + id);
  text.contentEditable = "true";
  text.focus();
  let textLength = text.innerText.length;
  let selection = window.getSelection();
  let range = document.createRange();
  range.selectNodeContents(text);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);

  contentDiv.classList.toggle("hover-enabler");
  firstImg.src = "../assets/img/delete.svg";
  firstImg.setAttribute("onclick", `deleteSubtaskOption(${id})`);

  secondImg.src = "../assets/img/check.svg";
  secondImg.style.filter = "invert(1)";
  secondImg.setAttribute("onclick", `saveChange(${id}, event)`);
}

function saveChange(id) {
  let contentDiv = document.getElementById("subtask-option-" + id);
  contentDiv.classList.toggle("hover-enabler");
  let firstImg = document.getElementById("first-subtask-img-" + id);
  firstImg.src = "../assets/img/edit.svg";
  firstImg.setAttribute("onclick", `editSubtaskOption(${id})`);
  let secondImg = document.getElementById("second-subtask-img-" + id);
  secondImg.src = "../assets/img/delete.svg";
  secondImg.style.filter = "invert(0)";
  secondImg.setAttribute("onclick", `deleteSubtaskOption(${id})`);
}

function animateTaskCreated() {
  let animatedElement = document.getElementById("task-added-container");
  animatedElement.classList.add('animate-task-added')
}

function toggleDropdownArrow(idNum) {
  let dropdown = document.getElementById("dropdown-arrow-" + idNum);
  dropdown.classList.toggle("turn-upside");
}

function toggleAssignmentOptions(taskId) {
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
    assignOptions.innerHTML += renderAssignmentOptions(e.initials, e.name, i);
    document.getElementById("assignments-" + (i + 1)).style.backgroundColor =
      e.color;
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
    assignedWorker.push(id)
  } else {
    inputEle.checked = false;
    let id = inputEle.id.slice(-1);
    for (let index = 0; index < assignedWorker.length; index++) {
      const element = assignedWorker[index];
      if (id == element) {
        assignedWorker.splice(assignedWorker[index], 1)
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
  sortAssignedContacts();
} 

function renderAssignmentOptions(initials, name, index) {
  return `
        <div id="rendered-options-container-${index}" class="rendered-options-container hover-enabler" onclick="toggleAssignment(this, ${index})">
            <div class="rendered-option">
                <div id="assignments-${index + 1}" class="assign-initials">
                        ${initials}
                    </div>
                <div class="contacts-name">${name}</div>
            </div>
            <input type="checkbox" id="assign-check-${index}">
        </div>
    `;
}

function renderInitIcons(index) {
  return `
        <div id="assignments-icons-${index + 1}" data-index="${index + 1}" class="assign-initials">
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
  let value = event.target.innerHTML;
  let category = document.getElementById("category-default-option");
  category.innerHTML = value;
  let categories = document.getElementById("category-options");
  categories.classList.toggle("d-none");
}

function showRequired(id) {
  let element = document.getElementById('required-' + id);
  let input = document.getElementById(id);
  let value = input.value
  
  
  if (value) {
    element.classList.remove('opacity-1')
    input.classList.remove('focus-red')
    input.classList.add('focus-blue')
  } else{
    input.classList.remove('focus-blue')
    input.classList.add('focus-red')
    element.classList.add('opacity-1')
  }
}

function showReqiredText(id) {
  let input = document.getElementById(id);
  let element = document.getElementById('required-' + id);
  let value = input.value
  if (value) {
    element.classList.remove('opacity-1')
    input.classList.add('focus-blue')
    input.classList.remove('focus-red')
  } else{
  element.classList.add('opacity-1')
  input.classList.add('focus-red')
  input.classList.remove('focus-blue')
}
}

function showCategoryRequiredText() {
  console.log('3456');
  
  let element = document.getElementById('required-category');
  element.remove('opacity-1')
  element.style.opacity = '0'
}
