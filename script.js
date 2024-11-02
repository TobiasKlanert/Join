const contactsURL = "https://join-ce104-default-rtdb.europe-west1.firebasedatabase.app/contacts";
let contacts = {};

async function init(elementId, elementType) {
    await loadTemplate("menu-content", "../assets/templates/menu-template.html"); 
    await loadTemplate("header-content", "../assets/templates/header-template.html");
    addMenuHighlighter(elementId, elementType);
}

async function getContacts(){
    try {
        let response = await fetch(contactsURL + ".json");
        let responseToJSON = await response.json();
        console.log(responseToJSON);
        
    } catch (error) {
        console.log("Error");
        
    }
}