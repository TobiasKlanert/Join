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
          <div class="board-task-subtasks">
          <div class="subtasks-progress-bar">
              <div class="subtasks-progress" style="width: ${calculateProgress(
                taskId
              )}%;"></div>
          </div>
          <span>${getTasksDone(taskId)}/${task.subtasks.length} Subtasks</span>
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
      <div class="board-no-task">No tasks ${getStatusDescription(statusList)}</div>
      `;
  }

  function getTaskDetailDialogRef(taskId) {
    return `
        <h1>Test ${taskId}</h1>
    `;
  }