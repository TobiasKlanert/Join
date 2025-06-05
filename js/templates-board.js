/**
 * Returns the HTML-template for the task overview on Board.
 *
 * @param {string} taskId - The id of the task that should be rendered.
 * @returns - The HTML-template for the task.
 */
function getTaskContentRef(taskId) {
  let task = currentTasks[taskId];
  return `
    <div
      id="task-${taskId}"
      data-task-id="${taskId}"
      draggable="true"
      ondragstart="startDragging(${taskId})"
      ondragend="endDragging(${taskId})"
      onclick="openTaskDetailDialog(${taskId})"
      class="board-task"
    >
      <div class="board-task-category">
        <div class="board-task-label ${getTaskLabel(taskId)}">
          ${firstLetterUpperCase(task.category)}
        </div>
        <button
          id="btnMoveTask-${taskId}"
          class="btn-move btn-move-visibility"
          onclick="toggleMoveDialog(${taskId}), stopEventBubbling(event)"
        >
          Move
        </button>
      </div>
      <div class="board-task-body" id="taskBody-${taskId}">
        ${getTaskBodyRef(taskId, task)}
      </div>
    </div>
  `;
}

function getTaskBodyRef(taskId, task) {
  return `
    <div class="board-task-text">
      <div class="board-task-title">${task.title}</div>
      <div class="board-task-description">
        ${getShortenedDescription(task.description, 48)}
      </div>
    </div>
    <div id="progressBar-${taskId}" class="board-task-subtasks"></div>
    <div class="board-task-meta">
      <div id="boardTaskContacts-${taskId}" class="board-task-contacts"></div>
      <div class="board-task-priority">
        <img src="../assets/img/prio-${task.prio}.svg" alt="" />
      </div>
    </div>
  `;
}

/**
 * Returns the HTML-template for marking an empty list.
 *
 * @param {string} statusList - The Name of the empty list.
 * @returns - The HTML-template for marking an empty list.
 */
function getNoTaskContentRef(statusList) {
  return `
        <div class="board-no-task">No tasks ${getStatusDescription(
          statusList
        )}</div>
        `;
}

/**
 * Returns the HTML-template for the task detail dialog.
 *
 * @param {string} taskId - The id of the task which details should be rendered.
 * @returns - The HTML-template for the task detail dialog.
 */
function getTaskDetailDialogRef(taskId) {
  let task = currentTasks[taskId];
  return `
        <div class="overlay" onclick="closeDialog('boardTaskDialog', 'overlay-placeholder')">
          <div onclick="stopEventBubbling(event)" id="boardTaskDialog" class="board-task-dialog dialog hidden">
            <div class="board-task-dialog-header">
              <div class="board-task-dialog-label ${getTaskLabel(taskId)}">
              ${firstLetterUpperCase(task.category)}
              </div>
              <button
              onclick="closeDialog('boardTaskDialog', 'overlay-placeholder')"
              class="close-button board-task-dialog-close-button">
              <img src="../assets/img/close-button.svg" alt="" />
              </button>
            </div>
            <div class="board-task-dialog-body">
              <h1>${task.title}</h1>
              <div class="fs20px">
                ${task.description}
              </div>
              <div class="gap-25px">
                <span class="fs20px color-grey">Due date:</span>
                <span class="fs20px">${task.dueDate}</span>
              </div>
              <div class="gap-25px">
                <span class="fs20px color-grey">Priority:</span>
                <div class="board-task-dialog-priority fs20px">
                  ${firstLetterUpperCase(task.prio)}
                  <img src="../assets/img/prio-${task.prio}.svg" alt="" />
                </div>
              </div>
              <div class="board-task-dialog-assigned-to gap-8px">
                <span id="assignedToTitle" class="color-grey fs20px">Assigned To:</span>
                <div id="dialogAssignedUser"></div>
              </div>
              <div class="board-task-dialog-subtasks gap-8px">
                <span id="subtasksTitle" class="fs20px color-grey">Subtasks</span>
                <div id="dialogSubtasks" class="board-task-dialog-subtasks-list">
                </div>
              </div>
            </div>
            <div class="board-task-dialog-footer">
              <button
                onclick="deleteTask(${taskId})"
                class="gap-8px border-right button-hover-light-blue-svg">
                <img src="../assets/img/delete.svg" alt="" />
                Delete
              </button>
              <button 
                onclick="renderEditTask(${taskId})"
                class="gap-8px button-hover-light-blue-svg">
                <img src="../assets/img/edit.svg" alt="" />
                Edit
              </button>
            </div>
          </div>
        </div>
      `;
}

/**
 * Returns the HTML-template to show the edit task dialog.
 *
 * @param {string} taskId - The id of the task which should be edited.
 * @returns The HTML-template to show the edit task dialog.
 */
function getEditTaskDialog(taskId) {
  return `
          <div class="overlay" id="overlayEditTask">
    <form id="dialogEditTask" class="dialog-edit-task dialog">
      <div class="close-dialog-edit-task">
        <button
          type="button"
          onclick="closeDialog('dialogEditTask', 'overlay-placeholder')"
          class="close-button-edit-task"
        >
          <img src="../assets/img/close-button.svg" alt="">
        </button>
      </div>
      <div class="dialog-edit-task-content">
        <div class="dialog-edit-task-title">
          <h4>Title</h4>
          <input id="dialogEditTaskTitle" type="text" required>
        </div>
        <div class="dialog-edit-task-description">
          <h4>Description</h4>
          <textarea id="dialogEditTaskDescription" name="description"></textarea>
        </div>
        <div class="dialog-edit-task-due-date">
          <h4>Due date</h4>
          <input id="dialogEditTaskDueDate" type="date" required>
        </div>
        <div class="dialog-edit-task-priority">
          <h4>Priority</h4>
          <div id="prio-buttons" class="prio-buttons">
            <button
              onclick="changeColors('.urgent-color', 'urgent')"
              class="prio-button urgent-button"
              type="button"
              name="urgent"
              id="urgent"
              value="urgent"
              data-prio="urgent"
            >
              Urgent<svg
                width="21"
                height="16"
                viewBox="0 0 21 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  class="urgent-color"
                  d="M19.6528 15.2547C19.4182 15.2551 19.1896 15.1803 19.0007 15.0412L10.7487 8.958L2.49663 15.0412C2.38078 15.1267 2.24919 15.1887 2.10939 15.2234C1.96959 15.2582 1.82431 15.2651 1.68184 15.2437C1.53937 15.2223 1.40251 15.1732 1.27906 15.099C1.15562 15.0247 1.04801 14.927 0.96238 14.8112C0.876751 14.6954 0.814779 14.5639 0.780002 14.4243C0.745226 14.2846 0.738325 14.1394 0.759696 13.997C0.802855 13.7095 0.958545 13.4509 1.19252 13.2781L10.0966 6.70761C10.2853 6.56802 10.5139 6.49268 10.7487 6.49268C10.9835 6.49268 11.212 6.56802 11.4007 6.70761L20.3048 13.2781C20.4908 13.415 20.6286 13.6071 20.6988 13.827C20.7689 14.0469 20.7678 14.2833 20.6955 14.5025C20.6232 14.7216 20.4834 14.9124 20.2962 15.0475C20.1089 15.1826 19.8837 15.2551 19.6528 15.2547Z"
                  fill="#FF3D00"
                />
                <path
                  class="urgent-color"
                  d="M19.6528 9.50568C19.4182 9.50609 19.1896 9.43124 19.0007 9.29214L10.7487 3.20898L2.49663 9.29214C2.26266 9.46495 1.96957 9.5378 1.68184 9.49468C1.39412 9.45155 1.13532 9.29597 0.962385 9.06218C0.789449 8.82838 0.716541 8.53551 0.7597 8.24799C0.802859 7.96048 0.95855 7.70187 1.19252 7.52906L10.0966 0.958588C10.2853 0.818997 10.5139 0.743652 10.7487 0.743652C10.9835 0.743652 11.212 0.818997 11.4007 0.958588L20.3048 7.52906C20.4908 7.66598 20.6286 7.85809 20.6988 8.07797C20.769 8.29785 20.7678 8.53426 20.6955 8.75344C20.6232 8.97262 20.4834 9.16338 20.2962 9.29847C20.1089 9.43356 19.8837 9.50608 19.6528 9.50568Z"
                  fill="#FF3D00"
                />
              </svg>
            </button>
            <button
              onclick="changeColors('.medium-color', 'medium')"
              class="prio-button"
              type="button"
              name="medium"
              id="medium"
              value="medium"
              data-prio="medium"
            >
              Medium
              <svg
                width="21"
                height="8"
                viewBox="0 0 21 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  class="medium-color"
                  d="M19.1526 7.72528H1.34443C1.05378 7.72528 0.775033 7.60898 0.569514 7.40197C0.363995 7.19495 0.248535 6.91419 0.248535 6.62143C0.248535 6.32867 0.363995 6.0479 0.569514 5.84089C0.775033 5.63388 1.05378 5.51758 1.34443 5.51758H19.1526C19.4433 5.51758 19.722 5.63388 19.9276 5.84089C20.1331 6.0479 20.2485 6.32867 20.2485 6.62143C20.2485 6.91419 20.1331 7.19495 19.9276 7.40197C19.722 7.60898 19.4433 7.72528 19.1526 7.72528Z"
                  fill="#FFA800"
                />
                <path
                  class="medium-color"
                  d="M19.1526 2.48211H1.34443C1.05378 2.48211 0.775033 2.36581 0.569514 2.1588C0.363995 1.95179 0.248535 1.67102 0.248535 1.37826C0.248535 1.0855 0.363995 0.804736 0.569514 0.597724C0.775033 0.390712 1.05378 0.274414 1.34443 0.274414L19.1526 0.274414C19.4433 0.274414 19.722 0.390712 19.9276 0.597724C20.1331 0.804736 20.2485 1.0855 20.2485 1.37826C20.2485 1.67102 20.1331 1.95179 19.9276 2.1588C19.722 2.36581 19.4433 2.48211 19.1526 2.48211Z"
                  fill="#FFA800"
                />
              </svg>
            </button>
            <button
              onclick="changeColors('.low-color', 'low')"
              class="prio-button"
              type="button"
              name="low"
              id="low"
              value="low"
              data-prio="low"
            >
              Low
              <svg
                width="21"
                height="16"
                viewBox="0 0 21 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  class="low-color"
                  d="M10.2485 9.50589C10.0139 9.5063 9.7854 9.43145 9.59655 9.29238L0.693448 2.72264C0.57761 2.63708 0.47977 2.52957 0.405515 2.40623C0.33126 2.28289 0.282043 2.14614 0.260675 2.00379C0.217521 1.71631 0.290421 1.42347 0.463337 1.1897C0.636253 0.955928 0.895022 0.800371 1.18272 0.757248C1.47041 0.714126 1.76347 0.786972 1.99741 0.95976L10.2485 7.04224L18.4997 0.95976C18.6155 0.874204 18.7471 0.812285 18.8869 0.777538C19.0266 0.742791 19.1719 0.735896 19.3144 0.757248C19.4568 0.7786 19.5937 0.82778 19.7171 0.901981C19.8405 0.976181 19.9481 1.07395 20.0337 1.1897C20.1194 1.30545 20.1813 1.43692 20.2161 1.57661C20.2509 1.71629 20.2578 1.86145 20.2364 2.00379C20.215 2.14614 20.1658 2.28289 20.0916 2.40623C20.0173 2.52957 19.9195 2.63708 19.8036 2.72264L10.9005 9.29238C10.7117 9.43145 10.4831 9.5063 10.2485 9.50589Z"
                  fill="#7AE229"
                />
                <path
                  class="low-color"
                  d="M10.2485 15.2544C10.0139 15.2548 9.7854 15.18 9.59655 15.0409L0.693448 8.47117C0.459502 8.29839 0.30383 8.03981 0.260675 7.75233C0.217521 7.46485 0.290421 7.17201 0.463337 6.93824C0.636253 6.70446 0.895021 6.54891 1.18272 6.50578C1.47041 6.46266 1.76347 6.53551 1.99741 6.7083L10.2485 12.7908L18.4997 6.7083C18.7336 6.53551 19.0267 6.46266 19.3144 6.50578C19.602 6.54891 19.8608 6.70446 20.0337 6.93824C20.2066 7.17201 20.2795 7.46485 20.2364 7.75233C20.1932 8.03981 20.0376 8.29839 19.8036 8.47117L10.9005 15.0409C10.7117 15.18 10.4831 15.2548 10.2485 15.2544Z"
                  fill="#7AE229"
                />
              </svg>
            </button>
          </div>
        </div>
        <div class="dialog-edit-task-assigned-user">
          <h4>Assigned to</h4>
          <div class="assign-options-container">
            <div class="assign-selector">
              <div
                id="assign-default-option"
                class="assign-default-option"
                
              >
                <div
                  id="default-option"
                  class="default-option"
                  contenteditable="true"
                  oninput="searchAssignments()"
                >
                  Select contacts to assign
                </div>
                <div id="dropdown-arrow-1" class="dropdown-arrow">
                  <div>
                    <img
                      class="dropdown-img"
                      src="../assets/img/arrow_drop_downaa.svg"
                      alt=""
                    >
                  </div>
                </div>
              </div>
              <div id="assign-options" class="assign-options box-shadow d-none"></div>
            </div>
            <div id="initials-container" class="initials-container"></div>
          </div>
        </div>
        <div class="dialog-edit-task-subtasks">
          <h4>Subtasks</h4>
          <div class="subtask-selector">
            <div
              id="subtask-default-option-container"
              class="assign-default-option"
              onclick="writeSubtask()"
            >
              <div
                id="subtask-default-option"
                class="subtask-text col-custom-lg"
                contenteditable="true"
                onkeypress="submitIfEnter(event)"
              >
                Add new subtasks
              </div>
              <div id="subtask-img" class="dropdown-arrow">
                <div class="dropdown-img">
                  <img src="../assets/img/add.svg" alt="">
                </div>
              </div>
            </div>
            <div id="subtasks-container" class="subtasks-container"></div>
          </div>
        </div>
      </div>
      <div class="dialog-edit-task-button-container">
        <button
          id="editTaskSaveButton"
          onclick="saveEditedTask(${taskId})"
          type="button"
          class="dialog-edit-task-ok-button button-hover-light-blue-background"
        >
          <span>Ok</span>
          <img src="../assets/img/check.svg" alt="">
        </button>
      </div>
    </form>
  </div>
      `;
}

function getMoveTaskDialog(taskId) {
  return `
    <div class="dialog-move-task" id="dialogMoveTask">
      <div class="board-task-title">Move task to:</div>
      <div class="btn-container">
        <button onclick="initiateMoveToContainer('toDo', ${taskId}), stopEventBubbling(event)" id="btnTodo" class="btn-move">To do</button>
        <button onclick="initiateMoveToContainer('inProgress', ${taskId}), stopEventBubbling(event)" id="btnInProgress" class="btn-move">In progress</button>
        <button onclick="initiateMoveToContainer('awaitFeedback', ${taskId}), stopEventBubbling(event)" id="btnAwaitFeedback" class="btn-move">Await feedback</button>
        <button onclick="initiateMoveToContainer('done', ${taskId}), stopEventBubbling(event)" id="btnDone" class="btn-move">Done</button>
      </div>
    </div>
  `;
}
