$(document).ready(function () {
  $(".hamburger-menu").click(function () {
    $(".hamburger-menu").toggleClass("humClicked");
    $("#menu_content").toggleClass("closed-menu", "open-menu");
  });
});

// Accordion Action
const accordionItem = document.querySelectorAll(".section__faq__item");

accordionItem.forEach((el) =>
  el.addEventListener("click", () => {
    if (el.classList.contains("active")) {
      el.classList.remove("active");
    } else {
      accordionItem.forEach((el2) => el2.classList.remove("active"));
      el.classList.add("active");
    }
  })
);

document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll("nav a");

  for (const link of navLinks) {
    link.addEventListener("click", smoothScroll);
  }

  function smoothScroll(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute("href");
    const targetPosition = document.querySelector(targetId).offsetTop;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1000; // Adjust the duration (in milliseconds) as needed

    let start = null;

    function animation(currentTime) {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
  }
});

function translateContent() {
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach((element) => {
    const key = element.dataset.i18n;
    element.textContent = i18next.t(key);
  });
}

const languageToggle = document.getElementById("language-toggle");
languageToggle.addEventListener("click", () => {
  const currentLanguage = languageToggle.dataset.language;
  const newLanguage = currentLanguage === "kz" ? "ru" : "kz";
  i18next.changeLanguage(newLanguage, (err, t) => {
    if (err) return console.log("something went wrong loading", err);
    languageToggle.dataset.language = newLanguage;
    languageToggle.textContent = newLanguage === "kz" ? "Қазақша" : "Русский";
    localStorage.setItem("currentLanguage", newLanguage);
    translateContent();
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const storedLanguage = localStorage.getItem("currentLanguage");
  const defaultLanguage = storedLanguage || "kz";
  i18next.changeLanguage(defaultLanguage, (err, t) => {
    if (err) return console.log("something went wrong loading", err);
    languageToggle.dataset.language = defaultLanguage;
    languageToggle.textContent =
      defaultLanguage === "kz" ? "Қазақша" : "Русский";
    translateContent();
  });
});

document.addEventListener("DOMContentLoaded", () => {
  translateContent();
});

function getCurrentCityName() {
  const defaultCity = "Актау";
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const API_KEY = "9b81d3e4265e2d1a5b8b73f1591ec139";
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&lang=ru&appid=${API_KEY}`;

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const cityName = data.name;

        console.log("Current city:", cityName);
        if (cityName) {
          pushCityName(cityName);
        } else if (cityName === "") {
          pushCityName(defaultCity);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });
  } else {
    console.error("Geolocation is not supported by your browser.");
    pushCityName(defaultCity);
  }
}

function pushCityName(city) {
  document.getElementById("current__city").textContent = city;
}

getCurrentCityName();
