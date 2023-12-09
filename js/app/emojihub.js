import { url1 } from "../api/config.js";

const randomUrl = `${url1}/random`;

const emojiHub = document.querySelector(".emojiHub");
const emojiHubBtn = document.querySelector(".emojiHub__cta");

async function getEmoji() {
  try {
    const res = await axios.get(randomUrl);
    rednerEmoji(res.data);
  } catch (err) {
    const errData = {
      name: err.message,
      category: err.message,
      group: err.message,
      htmlCode: ["&#10060;"],
    };
    rednerEmoji(errData);
  }

  //   axios
  //     .get(randomUrl)
  //     .then((res) => {
  //       console.log(res.data);
  //       rednerEmoji(res.data);
  //     })
  //     .catch((err) => {
  //       const errData = {
  //         name: err.message,
  //         category: err.message,
  //         group: err.message,
  //         htmlCode: ["&#10060;"],
  //       };
  //       rednerEmoji(errData);
  //     });
}

function rednerEmoji(jsonData) {
  const emoji = parseEmoji(jsonData.htmlCode[0]);
  emojiHub.childNodes[3].textContent = emoji;
  // const fragment = document.createDocumentFragment();
  const htmlStr = `
    <li>${jsonData.name}</li>
    <li>${jsonData.category}</li>
    <li>${jsonData.group}</li>
  `;
  emojiHub.childNodes[5].innerHTML = htmlStr;
}

function parseEmoji(data) {
  //因為我們取得資料時是給予 JSON 格式，若將其直接放進 HTML 會以 String 的方式渲染，所以我們這邊透過 DOM 元素轉譯的方式將這段 emoji 代碼進行轉換，讓其能正常呈現出圖案
  return new DOMParser().parseFromString(`<!DOCTYPE html><body>${data}`, "text/html").body
    .textContent;
}

emojiHubBtn.addEventListener("click", async () => {
  await getEmoji();
});
