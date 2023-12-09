const alertDiv = document.querySelector(".alert");

const alertOK = "alert-OK";
const alertBad = "alert-bad";

function alertMessage(message, type) {
  alertDiv.classList.remove("d-none");
  const div = document.createElement("div");
  div.textContent = message;
  div.className = "alert-info";
  div.classList.add(type);
  alertDiv.appendChild(div);
  setTimeout(() => {
    alertDiv.classList.add("d-none");
    alertDiv.removeChild(div);
  }, 3000);
}

const alert = {
  alertOK,
  alertBad,
  alertMessage,
};

export default alert;
