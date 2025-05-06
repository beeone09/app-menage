// Ajout de fonction 

// Sauvegarde dans localStorage
function saveData() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("scores", JSON.stringify(scores));
  }
  
  // Chargement au démarrage
  function loadData() {
    const savedTasks = localStorage.getItem("tasks");
    const savedScores = localStorage.getItem("scores");
  
    if (savedTasks) tasks = JSON.parse(savedTasks);
    if (savedScores) scores = JSON.parse(savedScores);
  }

//   Fin de fonction

const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");
const userSelect = document.getElementById("user-select");
const userName = document.getElementById("user-name");

let scores = { A: 0, B: 0 };
let tasks = [];

userSelect.addEventListener("change", () => {
  userName.textContent = userSelect.value;
});

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("task-name").value.trim();
  const user = userSelect.value;

  const userTasksToday = tasks.filter(
    (t) => t.user === user && !t.completed && isToday(t.createdAt)
  );

  if (userTasksToday.length >= 3) {
    alert("Maximum 3 tâches actives par jour !");
    return;
  }

  const task = {
    id: Date.now(),
    name,
    user,
    completed: false,
    createdAt: new Date(),
    showDetails: false,
  };

  tasks.push(task);
  saveData();
  renderTasks();
  taskForm.reset();
});

function isToday(date) {
  const today = new Date();
  const d = new Date(date);
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task) => {
    if (!task.completed) {
      const div = document.createElement("div");
      div.className = "task-item";

      div.innerHTML = `
        <p><strong>${task.name}</strong> (par ${task.user})</p>
        ${
          task.showDetails
            ? `
            <label>Durée (min): <input type="number" id="duration-${task.id}" /></label><br/>
            <label>Difficulté:
              <select id="difficulty-${task.id}">
                <option value="1">Facile</option>
                <option value="2">Moyenne</option>
                <option value="3">Difficile</option>
              </select>
            </label><br/>
            <button onclick="finalizeTask(${task.id})">Valider</button>
          `
            : `<button onclick="showDetails(${task.id})">Terminer</button>`
        }
      `;
      taskList.appendChild(div);
    }
  });
}

function showDetails(id) {
  const task = tasks.find((t) => t.id === id);
  task.showDetails = true;
  renderTasks();
}

function finalizeTask(id) {
  const task = tasks.find((t) => t.id === id);
  const duration = parseInt(document.getElementById(`duration-${id}`).value);
  const difficulty = parseInt(document.getElementById(`difficulty-${id}`).value);

  if (isNaN(duration) || isNaN(difficulty)) {
    alert("Remplis tous les champs !");
    return;
  }

  const points = Math.floor(duration * difficulty + Math.random() * 10);
  task.completed = true;
  task.duration = duration;
  task.difficulty = difficulty;
  task.points = points;
  scores[task.user] += points;

  saveData();

  updateScores();
  renderTasks();
}

function updateScores() {
  document.getElementById("scoreA").textContent = scores.A;
  document.getElementById("scoreB").textContent = scores.B;
}

userName.textContent = userSelect.value;

loadData();
updateScores();
renderTasks();

function resetWeek() {
    if (confirm("Es-tu sûr de vouloir réinitialiser les tâches et scores ?")) {
      tasks = [];
      scores = { A: 0, B: 0 };
      saveData();
      updateScores();
      renderTasks();
    }
  }
