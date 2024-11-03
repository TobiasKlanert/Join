const contactsURL = "https://join-ce104-default-rtdb.europe-west1.firebasedatabase.app/contacts";
let contacts = [];
let colors = ["red","lightblue","darkblue","orange","violet","pink","cyan","lightcoral",]
let randomColors = [...colors];


async function init() {
    loadTemplates()
    getUser()
}

async function loadTemplates() {
    await loadTemplate("menu-content", "../assets/templates/menu-template.html"); 
    await loadTemplate("header-content", "../assets/templates/header-template.html");
    addMenuHighlighter(elementId, elementType);
}

async function getUser() {
    let contactsInfo = await getContacts()
    for (let index = 0; index < 15; index++) {
        let contact = contactsInfo["user" + (index + 1)];
        let randomColor = randomColors.splice([Math.floor(Math.random() * randomColors.length)], 1);
        contact.color = randomColor[0]

        if (randomColors.length == 0) {
           randomColors = [...colors];
        }
        

        let initials = contact.name.charAt(0).toUpperCase() + contact.name.charAt(contact.name.indexOf(" ") + 1).toUpperCase()
        contact.initials = initials;
      
        contact.IsInContacts = false;

        contacts.push(contact)
      
        
    }
    let idsOfAplha = document.getElementsByClassName('alphabet-list')
    console.log(idsOfAplha);
    
    for (let index = 0; index < 10; index++) {
        let firstLetter = contacts[index].name.charAt(0).toUpperCase();
        for (let index = 0; index < idsOfAplha.length; index++) {
            const element = idsOfAplha[index];
            
            
            let lastCharacter = idsOfAplha[index]
            lastCharacter = lastCharacter.id.slice(-1).toUpperCase()

            
            if (lastCharacter == firstLetter) {
                idsOfAplha[index].style.display = "block"
                idsOfAplha[index].innerHTML += renderInitIcons(index)
                contacts[index].IsInContacts = true;
                document.getElementById('initials-' + (index + 1)).style.backgroundColor = contacts[index].color
            }
            
            
        }
        
    }
    console.log(contacts);
}

function renderInitIcons(index) {
    return `
        <div id="initials-${index + 1}" class="initials" onclick="displayContactInfo(${index + 1})">${contacts[index].initials}</div>
    `
}

function displayContactInfo(id) {
    console.log("hello");
    
}


async function getContacts(){
    try {
        let response = await fetch(contactsURL + ".json");
        let responseToJSON = await response.json();
        console.log(responseToJSON);
        return responseToJSON
    } catch (error) {
        console.log("Error");
        
    }
}