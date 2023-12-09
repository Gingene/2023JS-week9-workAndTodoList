import { url3 } from "../api/config.js";
import alert from "./alert.js";
import { validateEmail, validatePassword } from "./validator.js";

const { alertOK, alertBad, alertMessage } = alert;

const checkUrl = `${url3}/check`;
const userUrl = `${url3}/users`;
const todoUrl = `${url3}/todos`;
let token;

const todoDom = document.querySelector(".todo");

const register = todoDom.childNodes[1];
const login = todoDom.childNodes[3];
const todoList = todoDom.childNodes[5];

const userStatus = document.querySelector(".user-status");

function validateUser(form) {
  const userAccount = form.user1.value.trim();
  const userPassword = form.user2.value.trim();
  const userNickname = form.user3.value.trim();
  if (!userAccount || !userPassword || !userNickname) {
    alertMessage("輸入不能為空", alertBad);
    return;
  }
  if (!validateEmail(userAccount)) {
    alertMessage("請輸入正確的 Email格式", alertBad);
    return;
  }
  if (!validatePassword(userPassword)) {
    alertMessage("請輸入至少6位的英文數字", alertBad);
    return;
  }
  return {
    user: {
      email: userAccount,
      nickname: userNickname,
      password: userPassword,
    },
  };
}

const registerForm = register.childNodes[3];
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = validateUser(e.target);
  if (user) {
    console.log(userUrl, user);
    await registerUser(user);
  }
});

async function registerUser(user) {
  try {
    const res = await axios.post(userUrl, user);
    if (!res.ok) {
      throw new Error(`An error has occured: ${res.status}`);
    }
    console.log(res.data);
    alertMessage("註冊成功", alertOK);
    alertMessage("請到登入區登入", alertOK);
    registerForm.reset();
  } catch (err) {
    console.error(err);
    alertMessage("註冊失敗請重新操作", alertBad);
  }
}

const loginForm = login.childNodes[3];
function loginUserInfo(form) {
  const userAccount = form.user1.value.trim();
  const userPassword = form.user2.value.trim();
  if (!userAccount || !userPassword) {
    alertMessage("輸入不能為空", alertBad);
    return;
  }
  if (!validateEmail(userAccount)) {
    alertMessage("請輸入正確的 Email格式", alertBad);
    return;
  }
  if (!validatePassword(userPassword)) {
    alertMessage("請輸入至少6位的英文數字", alertBad);
    return;
  }
  return {
    user: {
      email: userAccount,
      password: userPassword,
    },
  };
}

async function loginUser(user) {
  try {
    const res = await axios.post(`${userUrl}/sign_in`, user);
    alertMessage(`${res.data.message}`, alertOK);
    localStorage.setItem("user", JSON.stringify(res.data));
    localStorage.setItem("token", JSON.stringify(res.headers.authorization));
    checkLogin();
  } catch (err) {
    console.error(err);
  }
}
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = loginUserInfo(e.target);
  if (user) {
    loginUser(user);
  }
});

async function checkLogin() {
  token = JSON.parse(localStorage.getItem("token"));
  const user = JSON.parse(localStorage.getItem("user"));
  // console.log(token);
  if (token) {
    try {
      const status = await axios.get(checkUrl, { headers: { Authorization: token } });
      // console.log(status);
      if (status.data.message === "OK!") {
        alertMessage(`歡迎回來 ${user.nickname}`, alertOK);
        rednerUser(user);
        getTodoData();
      }
    } catch (err) {
      // console.error(err);
      alertMessage("請重新登入", alertBad);
      rednerLogin();
    }
  }
}

function rednerUser(user) {
  register.classList.add("d-none");
  login.classList.add("d-none");
  userStatus.classList.remove("d-none");
  todoList.classList.remove("d-none");
  userStatus.childNodes[1].textContent = `${user.nickname}的待辦事項`;
}

function rednerLogin() {
  register.classList.remove("d-none");
  login.classList.remove("d-none");
  userStatus.classList.add("d-none");
  todoList.classList.add("d-none");
}

async function logOnUser() {
  try {
    if (!confirm("你確定要登出嗎?")) return;
    const res = await axios.delete(`${userUrl}/sign_out`, { headers: { Authorization: token } });
    console.log(res);
    alertMessage(`已經為您登出`, alertOK);
    rednerLogin();
  } catch (err) {
    console.error(err);
    alertMessage("登出失敗請重新操作", alertBad);
  }
}

const logOutBtn = userStatus.childNodes[3];
logOutBtn.addEventListener("click", () => {
  logOnUser();
});

// todoList data
let todoData = [];
// const p = todosToProxy([]);

const todoListForm = todoList.childNodes[5];
const todoTaskList = document.querySelector(".todo__taskList");

checkLogin();

async function getTodoData() {
  try {
    const res = await axios.get(todoUrl, { headers: { Authorization: token } });
    // todoData = res.data.todos;

    todoData = res.data.todos;

    // // 更新 todoData 中的資料，保持原順序
    // newTodos.forEach((newTodo) => {
    //   const index = todoData.findIndex((existingTodo) => existingTodo.id === newTodo.id);

    //   if (index !== -1) {
    //     // 如果找到了相同 id 的項目，就更新它
    //     todoData[index] = newTodo;
    //   } else {
    //     // 如果沒找到，就將新的項目加到陣列最後
    //     todoData.push(newTodo);
    //   }
    // });
    // console.log(todoData);

    // Object.assign(p, todoData);
    rednerTodoList(todoData);
  } catch (err) {
    console.error(err);
  }
}

// function todosToProxy(todos) {
//   const todoProxy = new Proxy(todos, {
//     get(target, prop) {
//       console.log("get", target, prop);
//       return Reflect.get(target, prop);
//     },
//     set(target, prop, value) {
//       Reflect.set(target, prop, value);
//       if (prop === "length") {
//         return true;
//       }
//       // console.log(this);

//       console.log("set", target, prop);
//       rednerTodoList(target);
//       return true;
//     },
//     defineProperty(target, property, descriptor) {
//       console.log(target, property, descriptor);
//     },
//   });

//   return todoProxy;
// }

function rednerTodoList(array) {
  const fragment = document.createDocumentFragment();
  array.forEach((todo) => {
    const li = document.createElement("li");
    li.dataset.completed = todo.completed_at;
    li.id = todo.id;
    li.className = `d-flex flex-wrap jcsb aic mb-16 p-1 ${
      todo.completed_at ? "todo-success" : ""
    } `;

    const uncompletedDom = `
    <div>
      <button type="button" data-target=${todo.id} data-change="putbefore">修改</button>
      <button type="button" data-target=${todo.id} data-change="patch">待完成</button>
      <button type="button" data-target=${todo.id} data-change="delete">刪除</button>
    </div>
    `;
    const completedDom = `
    <div class="d-flex aic flex-wrap jcsb">
      <p class="me-1">已經在${todo.completed_at}完成</p>
      <div>
        <button type="button" data-target=${todo.id} data-change="patch">更改成未完成</button>
        <button type="button" data-target=${todo.id} data-change="delete">刪除</button>
      </div>
    </div>
    `;
    li.innerHTML = `
      <p>${todo.content}</p>
      ${todo.completed_at ? completedDom : uncompletedDom}
    `;
    fragment.append(li);
  });
  while (todoTaskList.firstChild) {
    todoTaskList.removeChild(todoTaskList.firstChild);
  }
  todoTaskList.append(fragment);
}

todoListForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // console.dir(e.target.userInput);
  const userInput = e.target.userInput;
  const inputValue = userInput.value.trim();
  if (!inputValue) {
    alertMessage("輸入不能為空", alertBad);
    return;
  }
  const todo = {
    todo: {
      content: inputValue,
    },
  };
  addTodo(todo);
});

async function addTodo(todo) {
  try {
    const res = await axios.post(todoUrl, todo, { headers: { Authorization: token } });
    alertMessage("新增一個任務", alertOK);
    getTodoData();
    todoListForm.reset();
  } catch (err) {
    console.error(err);
    alertMessage("新增失敗請重新操作", alertBad);
  }
}

async function changeTodo(id) {
  const input = document.querySelector("[data-input]");
  const updataTodo = {
    todo: {
      content: input.value,
    },
  };
  try {
    const res = await axios.put(`${todoUrl}/${id}`, updataTodo, {
      headers: { Authorization: token },
    });
    alertMessage("修改成功", alertOK);
    // const findTodo = todoData.find((todo) => todo.id === res.data.id);
    // findTodo.content = res.data.content;
    // rednerTodoList(todoData);
    getTodoData();
  } catch (err) {
    console.error(err);
    alertMessage("修改失敗請重新操作", alertBad);
  }
}

async function changeTodoStatus(id) {
  try {
    const res = await axios({
      method: "patch",
      url: `${todoUrl}/${id}/toggle`,
      headers: { Authorization: token },
    });
    alertMessage("修改狀態成功", alertOK);
    getTodoData();
    // findTodo.completed_at = res.data.completed_at;
    // rednerTodoList(todoData);
  } catch (err) {
    console.error(err);
    alertMessage("修改狀態失敗請重新操作", alertBad);
  }
}

async function deleteTodo(id) {
  try {
    const res = await axios.delete(`${todoUrl}/${id}`, { headers: { Authorization: token } });
    // const findTodoIndex = todoData.findIndex((todo) => todo.id === res.data.id);
    // todoData.splice(findTodoIndex, 1);
    // rednerTodoList(todoData);
    alertMessage("刪除成功", alertOK);
    getTodoData();
  } catch (err) {
    console.error(err);
    alertMessage("刪除失敗請重新操作", alertBad);
  }
}

todoTaskList.addEventListener("click", (e) => {
  const todoId = e.target.dataset.target;
  if (!todoId) {
    return;
  }
  const event = e.target.dataset.change;
  if (event === "putbefore") {
    const targetNode = document.getElementById(todoId);
    targetNode.innerHTML = `
    <input type="text" value="${targetNode.childNodes[1].textContent}" data-input/>
    <div>
      <button type="button" data-target=${todoId} data-change="put">確認</button>
    </div>
    `;
    const input = document.querySelector("[data-input]");
    input.focus();
    input.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        e.target.blur();
        changeTodo(todoId);
      } else if (e.key === "Escape") {
        rednerTodoList(todoData);
      }
    });
  }
  if (event === "put") {
    changeTodo(todoId);
  }
  if (event === "patch") {
    changeTodoStatus(todoId);
  }
  if (event === "delete") {
    deleteTodo(todoId);
  }
});

async function deleteAllTodos() {
  try {
    for (let i = 0; i < todoData.length; i++) {
      await axios.delete(`${todoUrl}/${todoData[i].id}`, { headers: { Authorization: token } });
      // console.log(todoData, "for");
    }
    // const findTodoIndex = todoData.findIndex((todo) => todo.id === res.data.id);
    // todoData.splice(findTodoIndex, 1);
    // rednerTodoList(todoData);
    // console.log(todoData);
    alertMessage("全部任務刪除成功", alertOK);
    getTodoData();
  } catch (err) {
    console.error(err);
    alertMessage("刪除失敗請重新操作", alertBad);
  }
}

const deleteAlltasksbtn = document.querySelector("[data-deletealltasksbtn]");

deleteAlltasksbtn.addEventListener("click", () => {
  if (todoData.length === 0) {
    alertMessage("任務列表為空", alertBad);
    return;
  }
  if (!confirm("你確定要刪除所有任務嗎?")) return;
  deleteAllTodos();
});

todoList.addEventListener("click", (e) => {
  const status = e.target.dataset.status;
  if (!status) {
    return;
  }
  if (status === "all") {
    rednerTodoList(todoData);
  } else if (status === "work") {
    const filterTodo = todoData.filter((todo) => todo.completed_at === null);
    rednerTodoList(filterTodo);
  } else if (status === "done") {
    const filterTodo = todoData.filter((todo) => todo.completed_at !== null);
    rednerTodoList(filterTodo);
  }
});
