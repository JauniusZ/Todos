const form = document.getElementById("todoForm");
const input = document.getElementById("inputField");
const list = document.getElementById("list");

const state = {
  todos: [],
  filter: "all",
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = input.value;
  input.value = null;
  if (title === "") return;

  state.todos.push({ title: title, checked: false });

  renderTodos();
  updateUncheckedTodoCount();
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

  let filteredTodos = [];

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
    });

    list.appendChild(listItem);
  });
}

function updateUncheckedTodoCount() {
  const uncheckedTodos = state.todos.filter((todo) => !todo.checked).length;
  const todosLeftElement = document.getElementById("todos-left");
  todosLeftElement.textContent = `Todos left unchecked: ${uncheckedTodos}`;
}

document
  .getElementById("clearCheckedTodosBtn")
  .addEventListener("click", () => {
    state.todos = state.todos.filter((todo) => !todo.checked);

    renderTodos();
    updateUncheckedTodoCount();
  });
