const form = document.getElementById("todoForm");
const input = document.getElementById("inputField");
const list = document.getElementById("list");
const todos = [];

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = input.value;
  input.value = null;
  if (title === "") return;

  todos.push({ title: title, checked: false });

  renderTodos();
  updateUncheckedTodoCount();
});

function renderTodos() {
  list.innerHTML = "";

  todos.forEach((todo, index) => {
    const listItem = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.checked;
    listItem.appendChild(checkbox);

    const titleText = document.createElement("span");
    titleText.textContent = todo.title;
    listItem.appendChild(titleText);

    checkbox.addEventListener("change", () => {
      todos[index].checked = checkbox.checked;
      updateUncheckedTodoCount();
    });

    list.appendChild(listItem);
  });
}

function updateUncheckedTodoCount() {
  const uncheckedTodos = todos.filter((todo) => !todo.checked).length;
  const todosLeftElement = document.getElementById("todos-left");
  todosLeftElement.textContent = `Todos left unchecked: ${uncheckedTodos}`;
}
