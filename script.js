document.addEventListener("DOMContentLoaded", function () {
    const userSelect = document.getElementById("user-select");
    const taskInput = document.getElementById("task");
    const addTaskButton = document.getElementById("add-task");
    const todoList = document.getElementById("todo-list");
    const removeTaskButton = document.getElementById("remove-task");
    const resetListButton = document.getElementById("reset-list");

    // Enable input and button when a user is selected
    userSelect.addEventListener("change", function () {
        const selectedUser = userSelect.value;
        clearTodoList();
        if (selectedUser !== "") {
            taskInput.removeAttribute("disabled");
            addTaskButton.removeAttribute("disabled");
            removeTaskButton.removeAttribute("disabled");
            resetListButton.removeAttribute("disabled");
            populateTodoList(selectedUser);
        } else {
            taskInput.setAttribute("disabled", "true");
            addTaskButton.setAttribute("disabled", "true");
            removeTaskButton.setAttribute("disabled", "true");
            resetListButton.setAttribute("disabled", "true");
        }
    });

    // Handle "Add" button click
    addTaskButton.addEventListener("click", function () {
        const selectedUser = userSelect.value;
        const taskText = taskInput.value.trim();
        if (taskText !== "") {
            const listItem = createTaskListItem(selectedUser, taskText);
            todoList.appendChild(listItem);
            saveTodoList(selectedUser);
            taskInput.value = ""; // Clear the input field
        }
    });

    // Handle "Remove Task" button click
    removeTaskButton.addEventListener("click", function () {
        const selectedUser = userSelect.value;
        const selectedItems = Array.from(todoList.children).filter((item) =>
            item.classList.contains("completed")
        );
        selectedItems.forEach((item) => item.remove());
        saveTodoList(selectedUser);
    });

    // Handle "Reset List" button click
    resetListButton.addEventListener("click", function () {
        const selectedUser = userSelect.value;
        const confirmation = confirm("Are you sure you want to reset the to-do list?");
        if (confirmation) {
            clearTodoList();
            saveTodoList(selectedUser);
        }
    });

    // Directly handle click event on list items
    todoList.addEventListener("click", function (event) {
        const clickedItem = event.target;
        if (clickedItem.tagName === "LI") {
            clickedItem.classList.toggle("completed");
            saveTodoList(userSelect.value);
        }
    });

    // Function to create a new task list item
    function createTaskListItem(user, taskText, completed = false) {
        const listItem = document.createElement("li");
        listItem.textContent = `${user}: ${taskText}`;
        if (completed) {
            listItem.classList.add("completed");
        }
        return listItem;
    }

    // Function to clear the to-do list
    function clearTodoList() {
        todoList.innerHTML = "";
    }

    // Function to populate the to-do list for the selected user
    function populateTodoList(selectedUser) {
        const tasks = getTasksForUser(selectedUser);
        for (const task of tasks) {
            const listItem = createTaskListItem(selectedUser, task.text, task.completed);
            todoList.appendChild(listItem);
        }
    }

    // Function to save the to-do list to local storage
    function saveTodoList(user) {
        const tasks = Array.from(todoList.children).map((item) => {
            const completed = item.classList.contains("completed");
            const text = item.textContent.replace(`${user}: `, '');
            return { text, completed };
        });
        localStorage.setItem(user, JSON.stringify(tasks));
    }

    // Function to get tasks for the selected user from local storage
    function getTasksForUser(user) {
        const storedTasks = localStorage.getItem(user);
        return storedTasks ? JSON.parse(storedTasks) : [];
    }
});
