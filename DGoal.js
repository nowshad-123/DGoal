// Initialize tasks array
let tasks = [];

// Add event listeners for both the button and the Enter key
document.getElementById("addTodoBtn").addEventListener("click", addTask);
document.getElementById("todoInput").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// Function to add a task
function addTask() {
    const inputField = document.getElementById("todoInput");
    const taskText = inputField.value.trim();

    if (taskText === "") {
        alert("Please enter a task");
        return;
    }

    const taskList = document.getElementById("todoList");

    // Create new list item
    const listItem = document.createElement("li");
    listItem.className = "list-group-item d-flex justify-content-between align-items-center";

    // Create a container for the checkbox and task text
    const taskContainer = document.createElement("div");
    taskContainer.className = "d-flex align-items-center";

    // Create a checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "form-check-input me-2";

    // Store task data in a temporary object
    const taskData = {
        text: taskText,
        checked: false // Initial checked state is false
    };

    checkbox.addEventListener("change", function () {
        listItem.classList.toggle("completed-task");
        taskData.checked = checkbox.checked; // Update the checked state
    });

    // Create task text
    const taskSpan = document.createElement("span");
    taskSpan.textContent = taskText;

    // Create a container for the update and delete buttons
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "d-flex align-items-center";

    // Add update button
    const updateBtn = document.createElement("button");
    updateBtn.className = "btn btn-warning btn-sm me-2";
    updateBtn.textContent = "Update";
    updateBtn.addEventListener("click", () => {
        const newTaskText = prompt("Update your task:", taskSpan.textContent);
        if (newTaskText !== null && newTaskText.trim() !== "") {
            taskSpan.textContent = newTaskText.trim();
            taskData.text = newTaskText.trim(); // Update task data
        }
    });

    // Add delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-danger btn-sm";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
        taskList.removeChild(listItem);
        tasks = tasks.filter(task => task.text !== taskData.text); // Remove from tasks array
    });

    // Append the update and delete buttons to the button container
    buttonContainer.appendChild(updateBtn);
    buttonContainer.appendChild(deleteBtn);

    // Append the checkbox and task text to the task container
    taskContainer.appendChild(checkbox);
    taskContainer.appendChild(taskSpan);

    // Append elements to the list item
    listItem.appendChild(taskContainer);
    listItem.appendChild(buttonContainer);
    taskList.appendChild(listItem);

    // Add taskData to the tasks array
    tasks.push(taskData);

    // Clear input field
    inputField.value = "";
}

// Add event listener to the submit button
document.getElementById("submitBtn").addEventListener("click", function () {
    const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const descriptionInput = document.getElementById("descriptionInput").value.trim();

    // Create an object to save
    const tasksObject = {
        date: currentDate,
        description: descriptionInput,
        items: tasks
    };

    // Save to localStorage
    const existingTasks = JSON.parse(localStorage.getItem("todoTasks")) || [];
    existingTasks.push(tasksObject);
    localStorage.setItem("todoTasks", JSON.stringify(existingTasks));

    alert("Tasks saved to local storage!");
    updatePerformanceList(); // Update performance list after saving
    updateTotalDays(); // Update total days after saving

    // Clear the description input field
    document.getElementById("descriptionInput").value = "";
    tasks = []; // Clear the tasks array after saving
});

// Function to update total unique days
function updateTotalDays() {
    const todoTasks = JSON.parse(localStorage.getItem("todoTasks")) || [];
    const uniqueDates = new Set(todoTasks.map(task => task.date)); // Use Set to get unique dates
    const totalDays = uniqueDates.size;

    // Update the display
    document.getElementById("heading").textContent = `DGoal : ${totalDays} Days`;
}

// Function to update the performance list
function updatePerformanceList() {
    const performanceList = document.getElementById("performanceList");
    performanceList.innerHTML = ""; // Clear existing performance items

    const todoTasks = JSON.parse(localStorage.getItem("todoTasks")) || [];

    todoTasks.forEach((taskObj, index) => {
        const totalItems = taskObj.items.length; // Calculate total items
        const checkedItemsCount = taskObj.items.filter(item => item.checked).length;
        const description = taskObj.description;

        // Create list item for performance
        const performanceItem = document.createElement("li");
        performanceItem.className = "list-group-item d-flex justify-content-between align-items-center";
        performanceItem.textContent = `${taskObj.date} => ${checkedItemsCount} / ${totalItems} ==> ${description}`;

        // Create a delete button for performance items
        const deletePerformanceBtn = document.createElement("button");
        deletePerformanceBtn.className = "btn btn-danger btn-sm ms-2";
        deletePerformanceBtn.textContent = "Delete";
        deletePerformanceBtn.addEventListener("click", (event) => {
            event.stopPropagation(); // Prevent triggering the modal
            // Remove the task object from the array and update localStorage
            todoTasks.splice(index, 1);
            localStorage.setItem("todoTasks", JSON.stringify(todoTasks));
            updatePerformanceList(); // Refresh the performance list
            updateTotalDays(); // Update total days after deleting
        });

        // Add click event to show task details in the modal
        performanceItem.addEventListener("click", () => {
            showTaskDetails(taskObj.items);
        });

        // Append the delete button to the performance item
        performanceItem.appendChild(deletePerformanceBtn);

        // Append performance item to the list
        performanceList.appendChild(performanceItem);
    });
}

// Function to show task details in the modal
function showTaskDetails(items) {
    const modalBody = document.getElementById("modalBody");
    if (!modalBody) {
        console.error("Modal body element not found.");
        return; // Exit the function if modalBody is not found
    }

    modalBody.innerHTML = ""; // Clear previous content

    items.forEach(item => {
        const itemElement = document.createElement("div");
        itemElement.style.color = item.checked ? "green" : "red"; // Set color based on checked state
        itemElement.textContent = item.text; // Set item text
        modalBody.appendChild(itemElement);
    });

    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById("taskModal"));
    modal.show();
}

// Initialize the performance list and total days on page load
document.addEventListener("DOMContentLoaded", function () {
    updatePerformanceList();
    updateTotalDays();
});

