# 📋 Join – a Kanban-based project management tool

**Join** is a web-based task management application inspired by the Kanban methodology. Built with vanilla JavaScript, HTML, and CSS, and integrated with Firebase for backend services, Join enables users to create, manage, and track tasks in real-time.

## 🚀 Features

* **User Authentication**: Secure sign-up and login functionality using Firebase Authentication.
* **Real-Time Database**: Tasks and user data are stored and synchronized using Firebase Realtime Database.
* **Responsive Design**: Optimized for various devices, ensuring usability on desktops, tablets, and smartphones.
* **Drag-and-Drop Interface**: Intuitive task management with drag-and-drop capabilities across different boards.

## 🔮 Future Development

Planned for future versions: expanding Join to support **true collaborative task management**, enabling multiple users to interact and edit boards in real time with presence indicators and shared activity context.

## 🛠️ Technologies Used

* **Frontend**: HTML5, CSS3, JavaScript
* **Backend**: Firebase (Authentication, Realtime Database)
* **Version Control**: Git & GitHub

## 📁 Project Structure

```
Join/
├── assets/               # Images, Fonts and Templates
├── js/                   # JavaScript files
├── styles/               # Stylesheets
├── index.html            # Main HTML file
└── README.md             # Project documentation
```

## ⚙️ Setup and Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/TobiasKlanert/Join.git
   ```

2. **Navigate to the Project Directory**:

   ```bash
   cd Join
   ```

3. **Configure Firebase**:

   * Create a new file named `firebase-config.js` in the js directory.

   * Copy the contents from `example-config.js` into `firebase-config.js`.

   * Replace the placeholder values with your actual Firebase project credentials.


4. **Open the Application**:

   * Open `index.html` in your preferred web browser to start using Join.

## 🔐 Security Considerations

Ensure that your Firebase rules are set appropriately to protect user data. Regularly review and update your security rules in the Firebase console to prevent unauthorized access.

## 📬 Contact

For questions or suggestions, feel free to contact:

**Tobias Klanert**  
[GitHub](https://github.com/TobiasKlanert)  
[LinkedIn](https://www.linkedin.com/in/tobias-klanert-80563731a/)

---

© 2025 Tobias Klanert – All rights reserved.