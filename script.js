const JSON_STORAGE_URL = "http://158.129.206.250:4000/api/v1";
const JSON_STORAGE_KEY = "todos";
const JSON_STORAGE_TOKEN = "any random string for auth";

const state = {
  todos: [],
  filter: "all",
};

const form = document.getElementById("todoForm");
const input = document.getElementById("inputField");
const list = document.getElementById("list");

window.addEventListener("load", () => {
  const storedTodos = sessionStorage.getItem(JSON_STORAGE_KEY);
  if (storedTodos) {
    state.todos = JSON.parse(storedTodos);
    renderTodos();
    updateUncheckedTodoCount();
  } else {
    fetchTodosFromServer();
  }
});

window.addEventListener("unload", () => {
  sessionStorage.setItem(JSON_STORAGE_KEY, JSON.stringify(state.todos));
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = input.value;
  input.value = null;
  if (title === "") return;

  state.todos.push({ title: title, checked: false });

  renderTodos();
  updateUncheckedTodoCount();

  saveTodosToServer(state.todos);
});

const filterInputs = document.getElementsByName("filters");
filterInputs.forEach((input) => {
  input.addEventListener("change", () => {
    state.filter = input.value;
    renderTodos();
  });
});

function renderTodos() {
  list.innerHTML = "";
  let filteredTodos;
  if (state.filter === "completed") {
    filteredTodos = state.todos.filter((todo) => todo.checked);
  } else if (state.filter === "not_completed") {
    filteredTodos = state.todos.filter((todo) => !todo.checked);
  } else {
    filteredTodos = state.todos;
  }

  filteredTodos.forEach((todo, index) => {
    const listItem = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.checked;
    listItem.appendChild(checkbox);

    const titleText = document.createElement("span");
    titleText.textContent = todo.title;
    listItem.appendChild(titleText);

    checkbox.addEventListener("change", () => {
      state.todos[index].checked = checkbox.checked;
      updateUncheckedTodoCount();
      saveTodosToServer(state.todos);
    });

    list.appendChild(listItem);
  });
}

function updateUncheckedTodoCount() {
  const uncheckedTodos = state.todos.filter((todo) => !todo.checked).length;
  const todosLeftElement = document.getElementById("todos-left");
  todosLeftElement.textContent = `Todos left unchecked: ${uncheckedTodos}`;
}

document.getElementById("clearCheckedTodosBtn").addEventListener("click", () => {
  state.todos = state.todos.filter(({ checked }) => !checked);
  renderTodos();
  saveTodosToServer(state.todos);
});

function saveTodosToServer(todos) {
  fetch(JSON_STORAGE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: JSON_STORAGE_TOKEN,
    },
    body: JSON.stringify({
      [JSON_STORAGE_KEY]: todos,
    }),
  }).catch(console.error);
}

function fetchTodosFromServer() {
  fetch(`${JSON_STORAGE_URL}/${JSON_STORAGE_KEY}`, {
    headers: { token: JSON_STORAGE_TOKEN },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data[JSON_STORAGE_KEY]) {
        const todosList = data[JSON_STORAGE_KEY];
        if (Array.isArray(todosList)) {
          state.todos = todosList;
          renderTodos();
          updateUncheckedTodoCount();
        }
      }
    })
    .catch(console.error);
}