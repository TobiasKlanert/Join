let prevElement = null;
let prevClassName;

function changeColors(className, element) {
    if (isPrevButtonInverted(prevElement, element)) {
        invertColors(prevClassName, prevElement)
    }
    invertColors(className, element)
    prevElement = element;
    prevClassName = className;
}

function isPrevButtonInverted(prevElement, element) {
    if (prevElement != null && prevElement != element && prevElement.classList.contains('is-inverted')) {
        return true;
    }
    return false;
}

function invertColors(className, element) {
    element.classList.toggle('is-inverted')

    let svg = document.querySelector(className);
    let fillColor = window.getComputedStyle(svg, null).getPropertyValue("fill")
    element.style.backgroundColor = fillColor;

    let svgPaths = document.querySelectorAll(className);
    svgPaths.forEach(e => {
        e.classList.toggle('fill-color-white')
    });
    
    element.classList.toggle('color-white')
}

function resetForm() {
    document.getElementById("task-form").reset();
}

function createTask(){
    animateTaskCreated()
}
    

function animateTaskCreated() {
    let animatedElement = document.getElementById('task-added-container');
    animatedElement.style.translate = "0% 0%"
}

function assignContacts() {
    let assignOptions = document.getElementById('assign-options');
    assignOptions.innerHTML = ""
    contacts.forEach((e,i) => {
        assignOptions.innerHTML += renderAssignmentOptions(e.initials, e.name, i);
        document.getElementById(
            "assignments-" + (i + 1)
          ).style.backgroundColor = e.color;
    });
}

function toggleAssignment(element, index) {
    toggleClass(element, 'bg-dark')
    toggleClass(element, 'col-white')
    toggleClass(element, 'hover-enabler')

    let inputEle = element.getElementsByTagName('input')[0];
    toggleClass(inputEle, 'is-cheked')
    if (inputEle.classList.contains('is-cheked')) {
        inputEle.checked = true;
    } else{
        inputEle.checked = false;
    }

    let initIcon = document.getElementById("assignments-icons-" + (index + 1));
    if (initIcon) {
        initIcon.remove()
    } else {
    let iconCont = document.getElementById('initials-container');
    iconCont.innerHTML += renderInitIcons(index)
    document.getElementById("assignments-icons-" + (index + 1)).style.backgroundColor = contacts[index].color;
}}

function renderAssignmentOptions(initials, name, index){
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
    `
}

function renderInitIcons(index) {
    return `
        <div id="assignments-icons-${index + 1}" class="assign-initials">
            ${contacts[index].initials}
        </div>
    `
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