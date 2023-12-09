import "./helper/axios.min.js";
const currentPath = window.location.pathname;

if (
  currentPath === "/EmojiHub.html" ||
  currentPath === "/2023JS-week9-workAndTodoList/EmojiHub.html"
) {
  import("./app/emojihub.js");
} else if (
  currentPath === "/GiphyHub.html" ||
  currentPath === "/2023JS-week9-workAndTodoList/GiphyHub.html"
) {
  import("./app/giphyhub.js");
} else if (
  currentPath === "/todoList.html" ||
  currentPath === "/2023JS-week9-workAndTodoList/todoList.html"
) {
  import("./app/todoList.js");
}
