const contactsURL = "https://join-ce104-default-rtdb.europe-west1.firebasedatabase.app/contacts";
let contacts = {};

function changeImage(button, imageUrl) {
    button.querySelector("img").src = imageUrl;
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