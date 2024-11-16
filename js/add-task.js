let prevElement = null;
let prevClassName;
let subtaskIdCounter = 0;

function changeColors(className, element) {
  if (isPrevButtonInverted(prevElement, element)) {
    invertColors(prevClassName, prevElement);
  }
  invertColors(className, element);
  prevElement = element;
  prevClassName = className;
}

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

function resetForm() {
  document.getElementById("task-form").reset();
}

function createTask() {
  let form = document.getElementById("task-form");
  form.submit();
  animateTaskCreated();
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
  if (event.key === 'Enter') {
    submitSubtask()
    event.preventDefault()
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
  let textField = document.getElementById("subtask-default-option")
  let value = textField.innerHTML;
  let subtasks = document.getElementById("subtasks-container");
  subtasks.innerHTML += renderSubtask(value);
  subtaskIdCounter++
  textField.innerHTML = ""
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
            <img id="first-subtask-img-${subtaskIdCounter}" onclick="editSubtaskOption(${subtaskIdCounter}, event)" src="../assets/img/edit.svg">
            <div class="seperation-subtask"></div>
            <img id="second-subtask-img-${subtaskIdCounter}" onclick="deleteSubtaskOption(${subtaskIdCounter})" src="../assets/img/delete.svg">
          </div
        </div>
      
    </li>
  </ul>
  `;
}

function deleteSubtaskOption(id) {
  let listElement = document.getElementById('subtask-option-' + id)
  listElement.remove()
}

function editSubtaskOption(id, event) {
  let contentDiv = document.getElementById('subtask-option-' + id)
  let text = document.getElementById('subtask-option-text-' + id)
  let firstImg =  document.getElementById('first-subtask-img-' + id)
  let secondImg =  document.getElementById('second-subtask-img-' + id)
  text.contentEditable = "true"
  text.focus();
  let textLength = text.innerText.length
  console.log(textLength)
  let selection = window.getSelection()
  let range = document.createRange()
  range.selectNodeContents(text)
  range.collapse(false)
  selection.removeAllRanges();  
  selection.addRange(range);

  contentDiv.classList.toggle('hover-enabler')
  firstImg.src="../assets/img/delete.svg"
  firstImg.setAttribute('onclick' , `deleteSubtaskOption(${id})`)
  
  secondImg.src="../assets/img/check.svg"
  secondImg.style.filter = "invert(1)"
  secondImg.setAttribute('onclick', `saveChange(${id}, event)`)
  event.stopPropagation()
}

function saveChange(id, event) {
  let contentDiv = document.getElementById('subtask-option-' + id)
  contentDiv.classList.toggle('hover-enabler')
  let firstImg =  document.getElementById('first-subtask-img-' + id)
  firstImg.src="../assets/img/edit.svg"
  firstImg.setAttribute('onclick', `editSubtaskOption(${id})`)
  let secondImg =  document.getElementById('second-subtask-img-' + id)
  secondImg.src="../assets/img/delete.svg"
  secondImg.style.filter = "invert(0)"
  secondImg.setAttribute('onclick', `deleteSubtaskOption(${id})`)
  event.stopPropagation()
}

function animateTaskCreated() {
  let animatedElement = document.getElementById("task-added-container");
  animatedElement.style.translate = "0% 0%";
}

function toggleDropdownArrow(idNum) {
  let dropdown = document.getElementById("dropdown-arrow-" + idNum);
  dropdown.classList.toggle("turn-upside");
}

function toggleAssignmentOptions() {
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

function toggleAssignment(element, index) {
  toggleClass(element, "bg-dark");
  toggleClass(element, "col-white");
  toggleClass(element, "hover-enabler");

  let inputEle = element.getElementsByTagName("input")[0];
  toggleClass(inputEle, "is-checked");
  if (inputEle.classList.contains("is-checked")) {
    inputEle.checked = true;
  } else {
    inputEle.checked = false;
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
        <div id="assignments-icons-${index + 1}" class="assign-initials">
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

// function taskFormSubmit() {
//     console.log('2');
//     document.getElementById('task-form').submit()
// }

// function renderUserToAssignment() {
//     let assignOptions = document.getElementById('assignment');
//     console.log(assignOptions);

//     assignOptions.innerHTML = "";
//     for (let index = 0; index < contacts.length; index++) {
//         const contact = contacts[index];
//         assignOptions.innerHTML += renderUserIcon(contact)
//     }

//     };
// let assignOptions = document.getElementById('assignment');
// let option = document.getElementById('high').innerHTML += `<div style="background-color:red">hallo hallo</div>`

// function renderUserIcon(contact) {
//     return `
//     <option>
//         <div style="background-color:${contact.color};" class="user-info-inits">${contact.initials}</div>
//         <div>${contact.name}</div>
//     </option>`
// }

// document.getElementById('create-task-button').onclick = function() {
//     console.log('1');

//     setTimeout(taskFormSubmit, 3000);
// }

// setTimeout(taskFormSubmit, 3000);
