document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('taskInput');
  const addTaskButton = document.getElementById('addTaskButton');
  const taskList = document.getElementById('taskList');

  // Fetch tasks from server
  const fetchTasks = async () => {
    const response = await fetch('/api/tasks');
    const tasks = await response.json();
    renderTasks(tasks);
  };

  // Render tasks
  const renderTasks = (tasks) => {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''}`;
      li.innerHTML = `
        <span>${task.text}</span>
        <div>
          <button onclick="toggleTask(${index})">${task.completed ? 'Undo' : 'Complete'}</button>
          <button onclick="deleteTask(${index})">Delete</button>
        </div>
      `;
      taskList.appendChild(li);
    });
  };

  // Add task
  addTaskButton.addEventListener('click', async () => {
    const taskText = taskInput.value.trim();
    if (taskText) {
      const newTask = { text: taskText, completed: false };
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      taskInput.value = '';
      fetchTasks();
    }
  });

  // Toggle task completion
  window.toggleTask = async (index) => {
    const response = await fetch('/api/tasks');
    const tasks = await response.json();
    const task = tasks[index];
    task.completed = !task.completed;
    await fetch(`/api/tasks/${index}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    fetchTasks();
  };

  // Delete task
  window.deleteTask = async (index) => {
    await fetch(`/api/tasks/${index}`, { method: 'DELETE' });
    fetchTasks();
  };

  fetchTasks();
});