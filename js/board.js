let currentDraggedElement;

function filterTasks() {
  let searchInput = document.getElementById("searchInputField").value;
  console.log(searchInput);
  currentTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchInput.toLowerCase())
  );
  console.log(currentTasks);

  renderTasks();
}

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("searchInputField")
    .addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        filterTasks();
      }
    });
});

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("searchInputField")
    .addEventListener("input", function (event) {
      const searchQuery = event.target.value;
      if (searchQuery.length === 0) {
        currentTasks = tasks;
        renderTasks();
      }
    });
});

function startDragging(taskId) {
  currentDraggedElement = taskId;
}

function allowDrop(event) {
  event.preventDefault();
}

function moveElementToContainer(category) {
  currentTasks[currentDraggedElement]['status'] = category;
  renderTasks();
}