document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('task-form');
    const taskContainer = document.getElementById('task-container');
  
    loadTasks();
  
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addTask();
    });
  
    taskContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('edit-btn') || e.target.classList.contains('fa-pen')) {
            editTask(e.target);
        }
        if (e.target.classList.contains('delete-btn')|| e.target.classList.contains('fa-trash')) {
            if (confirm("Are you sure you want to delete this task?")) {
                deleteTask(e.target);
            }
        }
    });
  
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(function(task) {
            createTaskElement(task);
        });
    }
  
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
  
    function editTask(editBtn) {
        const taskItem = editBtn.closest('.task-item');
        const taskTitle = taskItem.querySelector('.task-name').textContent;
        const taskDescription = taskItem.querySelector('.task-desc').textContent;
        const taskDate = taskItem.querySelector('.task-date').textContent;
        const taskId = taskItem.dataset.taskId;
        // console.log(taskItem);
        //changing the normal div into form
        //title
        const taskName = taskItem.querySelector('.task-name');
        const inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.value = taskTitle;
        inputElement.id = 'editTitle'
        taskName.parentNode.replaceChild(inputElement, taskName);
        // document.getElementById('task-title').value = taskTitle;
        // document.getElementById('task-description').value = taskDescription;
        // document.getElementById('date').value = taskDate;
        //description
        const descElement = taskItem.querySelector('.task-desc');
        const textareaElement = document.createElement('textarea');
        textareaElement.id = 'editDescription';
        textareaElement.rows = 4;  // Set the number of rows
        textareaElement.cols = 50; // Set the number of columns
        textareaElement.value = descElement.textContent;
        descElement.parentNode.replaceChild(textareaElement, descElement);

        //date
        const dateElement = taskItem.querySelector('.task-date');
        const dateInputElement = document.createElement('input');
        dateInputElement.id = 'editDate';
        dateInputElement.type = 'date';
        dateInputElement.value = dateElement.textContent;
        dateElement.parentNode.replaceChild(dateInputElement, dateElement);
        //creating button
        const editButton = taskItem.getElementsByClassName('edit-btn')[0];
        const deleteButton = taskItem.getElementsByClassName('delete-btn')[0];
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        editButton.parentNode.replaceChild(saveButton, editButton);
        deleteButton.remove();
        //creating task
        
        
        let tasks = JSON.parse(localStorage.getItem('tasks'))
        // console.log(tasks);
        saveButton.onclick = function() {
            const tasktoUpdate = {
                title: inputElement.value,
                description: textareaElement.value,
                date: dateInputElement.value,
                id: taskId
            };
            taskName.value = inputElement.textContent;
            inputElement.parentNode.replaceChild(taskName, inputElement);
            descElement.value = textareaElement.textContent;
            textareaElement.parentNode.replaceChild(descElement, textareaElement);
            dateElement.value = dateInputElement.textContent;
            dateInputElement.parentNode.replaceChild(dateElement, dateInputElement);

            tasks = tasks.map(item => {
                if (item.id === tasktoUpdate.id) {
                    // console.log("working");
                    
                    return { ...item, ...tasktoUpdate }; // update all properties except `id`
                }
                return item; // return unchanged items
            });
            // tasks.forEach(element => {
            //     if (element.id===tasktoUpdate.id) {
            //         element.title = tasktoUpdate.title;
            //         element.description = tasktoUpdate.description;
            //         element.date = tasktoUpdate.date;
            //     }
            // });
            tasks = JSON.stringify(tasks, null, 2);
            localStorage.setItem('tasks', tasks);
            const taskContainer = document.getElementById('task-container');
            //Clear all tasks by setting innerHTML to an empty string
            taskContainer.innerHTML = '';
            
            loadTasks();
            const taskaction = taskItem.getElementsByClassName('task-actions')[0];
            saveButton.remove();
            taskaction.appendChild(editButton)
            taskaction.appendChild(deleteButton)
        };
    }
  
    function deleteTask(deleteBtn) {
        const taskItem = deleteBtn.closest('.task-item');
        const taskId = taskItem.dataset.taskId;
  
        taskItem.remove();
  
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const updatedTasks = tasks.filter(function(task) {
            return task.id != taskId;
        });
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
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
                <button id="save-btn" style="display: none;">Save</button>
            </div>
        `;
  
        taskContainer.appendChild(taskItem);
    }
  
    function saveTasks() {
        const tasks = Array.from(taskContainer.children).map(function(taskItem) {
            return {
                title: taskItem.querySelector('.task-name').textContent,
                description: taskItem.querySelector('.task-desc').textContent,
                date: taskItem.querySelector('.task-date').textContent,
                id: taskItem.dataset.taskId
            };
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});