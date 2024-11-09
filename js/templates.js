function getTaskContentRef(taskId) {
  let task = currentTasks[taskId];
  return `
    <div draggable="true" ondragstart="startDragging(${taskId})" onclick="renderTaskDetailDialog(${taskId})" class="board-task">
        <div class="board-task-category">
            <div class="board-task-label ${getTaskLabel(taskId)}">
                ${firstLetterUpperCase(task.category)}
            </div>
        </div>
        <div class="board-task-text">
            <div class="board-task-title">
                ${task.title}
            </div>
            <div class="board-task-description">
                ${task.description}
            </div>
        </div>
        <div id="progressBar-${taskId}" class="board-task-subtasks">
        </div>
        <div class="board-task-meta">
            <div id="boardTaskContacts-${taskId}" class="board-task-contacts">
            </div>
            <div class="board-task-priority">
                <img src="../assets/img/prio-${task.prio}.svg" alt="">
            </div>
        </div>
    </div>
      `;
}

function getNoTaskContentRef(statusList) {
  return `
      <div class="board-no-task">No tasks ${getStatusDescription(
        statusList
      )}</div>
      `;
}

function getTaskDetailDialogRef(taskId) {
    let task = currentTasks[taskId];
  return `
    <div class="overlay">
        <div class="board-task-dialog">
        <div class="board-task-dialog-header">
            <div class="board-task-dialog-label ${getTaskLabel(taskId)}">
            ${firstLetterUpperCase(task.category)}
            </div>
            <button
            onclick="toggleDisplayNone('taskDetailDialogContainer')"
            class="close-button board-task-dialog-close-button">
            <img src="../assets/img/close-button.svg" alt="" />
            </button>
        </div>
        <h1>${task.title}</h1>
        <span class="board-task-dialog-description fs20px">
            ${task.description}
        </span>
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
            <span class="color-grey fs20px">Assigned To:</span>
            <div id="dialogAssignedUser"></div>
        </div>
        <div class="board-task-dialog-subtasks gap-8px">
            <span class="fs20px color-grey">Subtasks</span>
            <div id="dialogSubtasks" class="board-task-dialog-subtasks-list">
            </div>
        </div>
        <div class="board-task-dialog-footer">
            <button
            class="gap-8px border-right button-hover-light-blue-svg">
            <img src="../assets/img/delete.svg" alt="" />
            Delete
            </button>
            <button class="gap-8px button-hover-light-blue-svg">
            <img src="../assets/img/edit.svg" alt="" />
            Edit
            </button>
        </div>
        </div>
    </div>
    `;
}