const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

async function fetchTasks() {
  const response = await fetch('http://localhost:3000/tasks');
  const tasks = await response.json();
  
  tasks.forEach((task) => {
    addTaskToUI(task);
  });
}

function displayTask(task) {
  const li = document.createElement("li");
  li.setAttribute("key", task.id)
  if (task.isCompleted) li.classList.add("completed");
  li.innerHTML = task.task;

  li.addEventListener("click", async function () {
    li.classList.toggle("completed");
    await updateTask(task.id, !task.isCompleted);
  });

  taskList.appendChild(li);
}

taskForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  await addTask(taskText, false);
  taskInput.value = "";
});

async function addTask(task, isCompleted) {
  const response = await fetch('http://localhost:3000/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      task,
      isCompleted,  
    }),
  });
  
  if (response.ok) {
    const newTask = await response.json();
    displayTask(newTask);
  } else {
    console.error('Failed to add task');
  }
}

async function updateTask(id, isCompleted) {
  await fetch(`http://localhost:3000/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      isCompleted,  
    }),
  });
}

document.addEventListener("DOMContentLoaded", fetchTasks);
