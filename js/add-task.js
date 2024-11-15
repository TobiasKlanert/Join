let prevElement = null;
let prevClassName;

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
    let parent = document.getElementById('subtask-default-option-container')
    parent.removeAttribute('onclick', 'writeSubtask()')

    changeSubtask()
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
    subtask.innerHTML = 'Add new subtasks'
    subtaskImg.innerHTML = `<div class="dropdown-img"><img  src="../assets/img/add.svg" alt=""></div>`
  }
}

function closeWriteSubtask(event) {
    let parent = document.getElementById('subtask-default-option-container')
    parent.setAttribute('onclick', 'writeSubtask()')
    event.stopPropagation()

    changeSubtask()
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
                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_250045_4743" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="24">
                <rect x="0.248535" width="24" height="24" fill="#D9D9D9"/>
                </mask>
                <g mask="url(#mask0_250045_4743)">
                <path d="M9.79923 15.15L18.2742 6.675C18.4742 6.475 18.7117 6.375 18.9867 6.375C19.2617 6.375 19.4992 6.475 19.6992 6.675C19.8992 6.875 19.9992 7.1125 19.9992 7.3875C19.9992 7.6625 19.8992 7.9 19.6992 8.1L10.4992 17.3C10.2992 17.5 10.0659 17.6 9.79923 17.6C9.53256 17.6 9.29923 17.5 9.09923 17.3L4.79923 13C4.59923 12.8 4.5034 12.5625 4.51173 12.2875C4.52006 12.0125 4.62423 11.775 4.82423 11.575C5.02423 11.375 5.26173 11.275 5.53673 11.275C5.81173 11.275 6.04923 11.375 6.24923 11.575L9.79923 15.15Z" fill="#2A3647"/>
                </g>
                </svg>

            </div>
        </div>
        
    `;
}

function submitSubtask() {
  let value = document.getElementById('subtask-default-option').innerHTML
  let subtasks = document.getElementById('subtasks-container')
  subtasks.innerHTML = renderSubtask(value)
}

function renderSubtask(value) {
  return `
    <li>
      <span class="subtask-options">
        <span>${value}</span>
        <span class="subtask-options-img">
          <img src="../assets/img/edit.svg">
          <span class="seperation-subtask"></span>
          <img src="../assets/img/delete.svg">
        </span>
      </span>
    </li>
  `
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
  toggleDropdownArrow(1)

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
  let category = document.getElementById('category-default-option')
  category.innerHTML = "Select Task Category"
  toggleDropdownArrow(2)
}

function selectCategory(event) {
  let value = event.target.innerHTML;
  let category = document.getElementById('category-default-option');
  category.innerHTML = value
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
