function displayGreeting() {
    let greeting = document.getElementById("greeting");
    let currentHour = new Date().getHours();
    let greetingMessage;

    if (currentHour < 12) {
        greetingMessage = "Good Morning, <span class='user'>User!</span>";
    } else if (currentHour < 18) {
        greetingMessage = "Good Day, <span class='user'>User!</span>";
    } else {
        greetingMessage = "Good Evening, <span class='user'>User!</span>";
    }

    greeting.innerHTML = greetingMessage;
}

displayGreeting();