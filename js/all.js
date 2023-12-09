import "./helper/axios.min.js";
const currentPath = window.location.pathname;

if (currentPath === "/EmojiHub.html") {
  import("./app/emojihub.js");
} else if (currentPath === "/GiphyHub.html") {
  import("./app/giphyhub.js");
} else if (currentPath === "/todoList.html") {
  import("./app/todoList.js");
}
