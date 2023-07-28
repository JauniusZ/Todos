const form = document.getElementById("todoForm");
const input = document.getElementById("inputField");
const list = document.getElementById("list");

form.addEventListener("submit", (event) => {
  console.log(event.target);
  event.preventDefault();
  const title = input.value;
  input.value = null;
  if (title === "") return;

  const listItem = document.createElement("li");
  listItem.textContent = title;
  list.appendChild(listItem);
});
