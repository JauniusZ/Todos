const JSON_STORAGE_URL = "http://127.0.0.1:4000/api/v1";
const JSON_STORAGE_KEY = "todos";
const JSON_STORAGE_TOKEN = "any random string for auth";
const SESSIONSTORAGE_KEY = "todos";

const state = {
  todos: [],
  filter: "all",
};

const form = document.getElementById("todoForm");
const input = document.getElementById("inputField");
const list = document.getElementById("list");

window.addEventListener("load", () => {
  const storedTodos = sessionStorage.getItem(SESSIONSTORAGE_KEY);
  if (storedTodos) {
    state.todos = JSON.parse(storedTodos);
    renderTodos();
    updateUncheckedTodoCount();
  } else {
    randomTodos().then((todos) => {
      state.todos = todos;
      renderTodos();
      updateUncheckedTodoCount();
      sessionStorage.setItem(SESSIONSTORAGE_KEY, JSON.stringify(state.todos));
    });
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = input.value;
  input.value = null;
  if (title === "") return;

  state.todos.push({ title: title, checked: false });

  renderTodos();
  updateUncheckedTodoCount();

  sessionStorage.setItem(SESSIONSTORAGE_KEY, JSON.stringify(state.todos));
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
  if (state.filter === "checked") {
    filteredTodos = state.todos.filter((todo) => todo.checked);
  } else if (state.filter === "unchecked") {
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
      sessionStorage.setItem(SESSIONSTORAGE_KEY, JSON.stringify(state.todos));
    });

    list.appendChild(listItem);
  });
}

function updateUncheckedTodoCount() {
  const uncheckedTodos = state.todos.filter((todo) => !todo.checked).length;
  const todosLeftElement = document.getElementById("todos-left");
  todosLeftElement.textContent = uncheckedTodos;
}

document
  .getElementById("clearCheckedTodosBtn")
  .addEventListener("click", () => {
    state.todos = state.todos.filter(({ checked }) => !checked);
    renderTodos();
    sessionStorage.setItem(SESSIONSTORAGE_KEY, JSON.stringify(state.todos));
  });

function randomTodos() {
  const todos = [];
  return fetch(
    `https://baconipsum.com/api/?type=ameat-and-filler&sentences=${Math.floor(
      Math.random() * 4 + 3
    )}`
  )
    .then((response) => response.json())
    .then((data) => {
      data[0].split(".").forEach((title) => {
        const checked = !!Math.round(Math.random() * 0.9);
        title && todos.push({ title, checked });
      });
      return todos;
    });
}