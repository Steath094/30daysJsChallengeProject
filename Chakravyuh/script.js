const taskForm = document.getElementById('task-form');
const taskContainer = document.getElementById('task-container');
addTask();
function addTask() {
    const titleInput = document.getElementById('task-title');
    const descriptionInput = document.getElementById('task-description');
    const dateInput = document.getElementById('date');
  
    const task = {
        title: titleInput.value,
        description: descriptionInput.value,
        date: dateInput.value,
        id: Date.now()
    };
    createTaskElement(task);
    saveTasks();
  
    titleInput.value = '';
    descriptionInput.value = '';
    dateInput.value = '';
}

function createTaskElement(task) {
    const taskItem = document.createElement('div');
    taskItem.classList.add('task-item');
    taskItem.dataset.taskId = task.id;
    taskItem.innerHTML = `
    <div class="task-info">
        <h3 class="task-name">${task.title}</h3>
        <p class="task-desc">${task.description}</p>
        <p class="task-date">${task.date}</p>
    </div>
    <div class="task-actions">
        <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
        <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
    </div>
    `;

    taskContainer.appendChild(taskItem);
}