// https://developers.giphy.com/docs/api#quick-start-guide
import { url2 } from "../api/config.js";

const giphyHubForm = document.querySelector("[data-giphyhub-form]");
giphyHubForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.dir(e.target);
  const submitOption = {
    apiKey: e.target.apiKey.value, // 取得input上與name對應的元素
    keyword: e.target.keyword.value,
    rating: e.target.rating.value,
    lang: e.target.lang.value,
    limit: e.target.limit.value,
  };
  try {
    const giphyData = await getGiphy(submitOption);
    renderGiphyImage(giphyData.data);
  } catch (err) {
    console.log(err);
  }
});

async function getGiphy(option) {
  const { apiKey, keyword, rating, lang, limit } = option;
  let offset = 0;
  const apiUrl = `${url2}?api_key=${apiKey}&q=${keyword}&limit=${limit}&offset=${offset}&rating=${rating}&lang=${lang}`;
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error(`An error has occured: ${response.status}`);
  }
  return await response.json();
}

async function renderGiphyImage(arrayData) {
  if (!arrayData[0]) return;
  const gallery = document.querySelector(".gallery");
  // console.log(arrayData);
  const fragment = document.createDocumentFragment();
  arrayData.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <img src=${item.images.downsized_medium.url} alt=${item.title}>
      <div>
        <h3><a href=${item.url}>${item.title}</h3></a>
      </div>
    `;
    fragment.appendChild(li);
  });
  gallery.append(fragment);
}
