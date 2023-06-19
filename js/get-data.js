let currentPage = 1;
const itemsPerPage = 6;
let data;
let categories = [];
let selectedPrice = "all";

function getData() {
  fetch("https://api.zerek.edus.kz/v1/main/page/group")
    .then((response) => response.json())
    .then((responseData) => {
      data = responseData.data;
      getCategories();
      displayData();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function getCategories() {
  data.forEach((item) => {
    if (!categories.includes(item.club_category_name)) {
      categories.push(item.club_category_name);
    }
  });

  const filterSelect = document.getElementById("filter-select");
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    filterSelect.appendChild(option);
  });
}

function displayData() {
  const filterSelect = document.getElementById("filter-select");
  const selectedCategory = filterSelect.value;

  const priceSelect = document.getElementById("price-select");
  selectedPrice = priceSelect.value;

  let filteredData = data;
  if (selectedCategory !== "all") {
    filteredData = data.filter(
      (item) => item.club_category_name === selectedCategory
    );
  }

  if (selectedPrice !== "all") {
    filteredData = filteredData.filter((item) => {
      if (selectedPrice === "free") {
        return item.cost < 1;
      } else if (selectedPrice === "paid") {
        return item.cost > 1;
      }
    });
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const container = document.getElementById("data-container");
  container.innerHTML = "";

  filteredData.slice(startIndex, endIndex).forEach((item) => {
    const div = document.createElement("div");
    div.classList.add("section__hobbies__item");

    const lang = localStorage.getItem("currentLanguage");

    item.cost = Math.ceil(item.cost);

    const priceClassName =
      item.cost === 0
        ? "section__hobbies__item__free"
        : "section__hobbies__item__price";

    let imgSrc = "";
    if (item.club_category_name === "Технико-творческий") {
      imgSrc = "it.png";
    } else if (item.club_category_name === "Спортивный") {
      imgSrc = "sport.png";
    } else if (item.club_category_name === "Музыкальный") {
      imgSrc = "music.png";
    } else if (item.club_category_name === "Гуманитарные-естественные науки") {
      imgSrc = "earth.png";
    } else if (item.club_category_name === "Художественная эстетика") {
      imgSrc = "art.png";
    } else {
      imgSrc = "botanic.png";
    }

    if (lang === "ru") {
      div.innerHTML = `
      <span id="testData" class="${priceClassName}">
        <span class="cost__of__club">${item.cost}₸</span>
        /<span>в месяц</span>
      </span>
      <div class="section__hobbies__item__content">
        <img src="./assets/img/hobby/${imgSrc}" alt>
        <div>
          <div class="section__hobbies__item__content__title">${
            item.name_ru
          }</div>
          <div class="section__hobbies__item__content__subtitle">${
            item.full_address
          }</div>
        </div>
      </div>
      <div class="section__hobbies__item__title count__width">Количество мест:</div>
      <div class="section__hobbies__item__count">${
        item.place_count - item.occupied_place_count
      }</div>
      <a href="https://portal.zerek.edus.kz/#/login/parent" class="section__goverment__item__action"><span>Подать заявление</span> <svg
      width="7" height="12" viewBox="0 0 7 12" fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path d="M1 11L6 6L1 1" stroke="#2176FF" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </a>
    `;
    } else {
      div.innerHTML = `
      <span id="testData" class="${priceClassName}">
        <span class="cost__of__club">${item.cost}₸</span>
        /<span>айына</span>
      </span>
      <div class="section__hobbies__item__content">
        <img src="./assets/img/hobby/${imgSrc}" alt>
        <div>
          <div class="section__hobbies__item__content__title">${
            item.name_kk
          }</div>
          <div class="section__hobbies__item__content__subtitle">${
            item.full_address
          }</div>
        </div>
      </div>
      <div class="section__hobbies__item__title count__width">Курстағы орындар саны:</div>
      <div class="section__hobbies__item__count">${
        item.place_count - item.occupied_place_count
      }</div>
      <a href="https://portal.zerek.edus.kz/#/login/parent" class="section__goverment__item__action"><span>Өтінім тастау</span> <svg
      width="7" height="12" viewBox="0 0 7 12" fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path d="M1 11L6 6L1 1" stroke="#2176FF" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </a>
    `;
    }

    container.appendChild(div);
    test();
  });

  const paginationContainer = document.getElementById("pagination-container");
  paginationContainer.innerHTML = "";

  if (filteredData.length > itemsPerPage) {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const previousArrow = document.createElement("div");
    previousArrow.classList.add("pagination-arrow");
    previousArrow.innerHTML = `<svg width="8" height="15" viewBox="0 0 8 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.5 1L1 8L7.5 14.5" stroke="#1D1F23" stroke-linecap="round"/>
    </svg>    
    `;
    previousArrow.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        displayData();
      }
    });
    paginationContainer.appendChild(previousArrow);

    for (let i = 1; i <= totalPages; i++) {
      const pageNumber = document.createElement("div");
      pageNumber.classList.add("pagination-number");
      pageNumber.textContent = i;
      if (i === currentPage) {
        pageNumber.classList.add("active");
      }
      pageNumber.addEventListener("click", () => {
        currentPage = i;
        displayData();
      });
      paginationContainer.appendChild(pageNumber);
    }

    const nextArrow = document.createElement("div");
    nextArrow.classList.add("pagination-arrow");
    nextArrow.innerHTML = `<svg width="8" height="15" viewBox="0 0 8 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.5 1L7 8L0.5 14.5" stroke="#1D1F23" stroke-linecap="round"/>
    </svg>
    `;
    nextArrow.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        displayData();
      }
    });
    paginationContainer.appendChild(nextArrow);
  }
}

const filterSelect = document.getElementById("filter-select");
filterSelect.addEventListener("change", () => {
  currentPage = 1;
  displayData();
});

const priceSelect = document.getElementById("price-select");
priceSelect.addEventListener("change", () => {
  currentPage = 1;
  displayData();
});

getData();

document.getElementById("language-toggle").addEventListener("click", reload);
function reload() {
  location.reload();
}

function test() {
  const lang = localStorage.getItem("currentLanguage");

  const elements = document.getElementsByClassName(
    "section__hobbies__item__free"
  );
  for (let i = 0; i < elements.length; i++) {
    if (lang === "ru") {
      elements[i].innerHTML = "Бесплатно";
    } else {
      elements[i].innerHTML = "Тегін";
    }
  }
}
