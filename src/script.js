// Constants and helper functions
const PAGES = {
  HOME: "home",
  CHARACTER: "character",
  FAVORITE: "favorite",
};

// const apiUrl = "http://localhost:3000/";
const apiUrl = "https://marvel-backend-kcle.onrender.com/";
const loadingGIFs = [
  "src/images/ironman.gif",
  "src/images/deadpool.gif",
  "src/images/loading.gif",
];
const getEl = (id) => document.getElementById(id);
const showEl = (id) => (document.getElementById(id).style.display = "block");
const hideEl = (id) => (document.getElementById(id).style.display = "none");

// Remove a character from favorites
const removeFavorite = (characterId, id) => (e) => {
  e.stopPropagation();
  let favorites = localStorage.getItem("marvel-favorites");
  if (favorites) {
    favorites = JSON.parse(favorites);
    favorites = favorites.filter((i) => i.id != characterId);
  }
  localStorage.setItem("marvel-favorites", JSON.stringify(favorites));
  const item = document.querySelector(`#${id} div[data-id="${characterId}"]`);
  const favButton = item.querySelector(".favorite-btn");
  const unfavButton = item.querySelector(".unfavorite-btn");
  unfavButton.style.display = "none";
  favButton.style.display = "block";
  location.reload();
};

// Add a character to favorites
const addFavorite = (hero) => (e) => {
  const heroPayload = {
    id: hero.id,
    name: hero.name,
    description: hero.description,
  };
  if (hero.thumbnail) {
    const img = hero.thumbnail.path + "." + hero.thumbnail.extension;
    heroPayload.image = img;
  }
  e.stopPropagation();
  let favorites = localStorage.getItem("marvel-favorites");
  if (!favorites) {
    favorites = [heroPayload];
  } else {
    favorites = JSON.parse(favorites);
    favorites.push(heroPayload);
  }
  localStorage.setItem("marvel-favorites", JSON.stringify(favorites));
  const item = document.querySelector(
    `#heroes div[data-id="${heroPayload.id}"]`
  );
  const favButton = item.querySelector(".favorite-btn");
  const unfavButton = item.querySelector(".unfavorite-btn");
  favButton.style.display = "none";
  unfavButton.style.display = "block";
};

// Handle character click from anywhere
const characterClicked = (characterId) => () => {
  const url = new URL(location.href);
  const params = new URLSearchParams(url.searchParams);
  params.set("character", characterId);
  params.set("page", PAGES.CHARACTER);
  location.href = url.origin + url.pathname + "?" + params.toString();
};

// Display list of series, comics, stories
const multiplyItem = (id) => (item) => {
  const el = getEl(id);
  let blueprint = getEl("comic-blueprint");
  blueprint = blueprint.cloneNode(true);

  //Comic image
  const img = blueprint.querySelector("img");
  if (item.thumbnail) {
    const comicImg = item.thumbnail.path + "." + item.thumbnail.extension;
    img.setAttribute("src", comicImg);
  }

  //Comic name
  const text = blueprint.querySelector("p");
  text.innerHTML = item.title;

  const appendItem = blueprint.querySelector("div");
  el.append(appendItem);
};

// Display list of heros in home page and favorite page
const multiplyHero = (id) => (hero) => {
  let blueprint = getEl("hero-blueprint");
  blueprint = blueprint.cloneNode(true);

  //Hero Image
  const img = blueprint.querySelector("img");
  if (id !== "favoriteHeros") {
    let heroImg = "";
    if (hero.thumbnail) {
      heroImg = hero.thumbnail.path + "." + hero.thumbnail.extension;
    }
    img.setAttribute("src", heroImg);
  } else {
    img.setAttribute("src", hero.image);
  }

  //Hero name
  const title = blueprint.querySelector(".card-title");
  title.innerHTML = hero.name;

  //Hero description
  const descriptionEl = blueprint.querySelector(".card-text");
  let description = hero.description;
  if (description.length === 0) {
    descriptionEl.classList.add("pb-24");
    description = "No descrption found...\n\n";
  }
  if (description.length > 60) {
    description = description.substring(0, 60) + "...";
  }
  descriptionEl.innerHTML = description;

  //Set event listener
  const favButton = blueprint.querySelector(".favorite-btn");
  favButton.addEventListener("click", addFavorite(hero));
  const unfavButton = blueprint.querySelector(".unfavorite-btn");
  unfavButton.addEventListener("click", removeFavorite(hero.id, id));

  //Check if favorite hero
  let favorites = localStorage.getItem("marvel-favorites");
  if (favorites) {
    favorites = JSON.parse(favorites);
    const findFav = favorites.find((i) => i.id == hero.id);
    if (findFav) {
      favButton.style.display = "none";
      unfavButton.style.display = "block";
    }
  }

  const appendItem = blueprint.querySelector(".item");
  appendItem.setAttribute("data-id", hero.id);
  appendItem.addEventListener("click", characterClicked(hero.id));
  const row = getEl(id);
  row.append(appendItem);
};

// Favorite button click in hero page
const viewPageFavBtn = (hero) => (e) => {
  let favorites = localStorage.getItem("marvel-favorites");
  const heroPayload = {
    id: hero.id.toString(),
    name: hero.name,
    description: hero.description,
  };
  if (hero.thumbnail) {
    const img = hero.thumbnail.path + "." + hero.thumbnail.extension;
    heroPayload.image = img;
  }
  if (!favorites) {
    favorites = [heroPayload];
  } else {
    favorites = JSON.parse(favorites);
    favorites.push(heroPayload);
  }
  localStorage.setItem("marvel-favorites", JSON.stringify(favorites));
  getEl("favorite-btn").style.display = "none";
  getEl("unfavorite-btn").style.display = "block";
};

// Remove favorite button click in hero page
const viewPageUnFavBtn = (hero) => (e) => {
  let favorites = localStorage.getItem("marvel-favorites");
  if (favorites) {
    favorites = JSON.parse(favorites);
    favorites = favorites.filter((i) => i.id != hero.id);
  }
  localStorage.setItem("marvel-favorites", JSON.stringify(favorites));
  getEl("favorite-btn").style.display = "block";
  getEl("unfavorite-btn").style.display = "none";
};

// Handle click on a searced result
const clickResult = (id) => () => {
  const url = new URL(location.href);
  const searchParams = new URLSearchParams(url.searchParams);
  searchParams.set("page", PAGES.CHARACTER);
  searchParams.set("character", id);
  location.href = url.origin + url.pathname + "?" + searchParams.toString();
};

function goToHome(){
  const url = new URL(location.href);
  const searchParams = new URLSearchParams(url.searchParams);
  searchParams.set("page", PAGES.HOME);
  location.href = url.origin + url.pathname + "?" + searchParams.toString();
}

function goToFav(){
  const url = new URL(location.href);
  const searchParams = new URLSearchParams(url.searchParams);
  searchParams.set("page", PAGES.FAVORITE);
  location.href = url.origin + url.pathname + "?" + searchParams.toString();
}

// Handle search submit form
const handleSearchSubmit = async (e) => {
  e.preventDefault();
  const val = getEl("search").value;
  hideEl("results");
  document.querySelector(".resultsBox").innerHTML = null;
  if (val.length) {
    const response = await fetch(apiUrl + "characters/search/" + val);
    const heros = await response.json();
    if (heros.length === 0) {
      const noResult = getEl("noResultBox").cloneNode(true);
      noResult.classList.remove("d-none");
      noResult.classList.add("d-flex");
      document.querySelector(".resultsBox").append(noResult);
    } else {
      showEl("results");
      const searchResults = heros.slice(0, 20);
      searchResults.forEach((hero) => {
        const result = getEl("result-blueprint").cloneNode(true);
        const heroImg = hero.thumbnail.path + "." + hero.thumbnail.extension;
        result.querySelector("img").setAttribute("src", heroImg);
        result.querySelector("span").innerHTML = hero.name;
        const appendItem = result.querySelector(".result");
        appendItem.addEventListener("click", clickResult(hero.id));
        document.querySelector(".resultsBox").append(appendItem);
      });
    }
  }
};

// Handle on input change in search form
const handleInput = (e) => {
  if (e.target.value.length === 0) {
    hideEl("results");
    document.querySelector(".resultsBox").innerHTML = null;
  }
};

// Show different gifs as loaders
const showLoading = () => {
  var randomNo = Math.floor(Math.random() * 3);
  console.log(randomNo);
  document
    .querySelector("#loading img")
    .setAttribute("src", loadingGIFs[randomNo]);
  hideEl("homePage");
  hideEl("viewPage");
  hideEl("favoritePage");
};

// Add event listeners
getEl("searchForm").addEventListener("submit", handleSearchSubmit);
getEl("search").addEventListener("keyup", handleInput);

//IIFE
{
}
(async () => {
  // Get page url and values from query params
  const url = new URL(location.href);
  const params = new URLSearchParams(url.searchParams);
  const page = params.get("page");
  const characterId = params.get("character");
  let currentPage = PAGES.HOME;
  if (page) {
    if (page === PAGES.CHARACTER) {
      currentPage = PAGES.CHARACTER;
    } else if (page === PAGES.FAVORITE) {
      currentPage = PAGES.FAVORITE;
    }
  }

  if (currentPage === PAGES.HOME) {
    // If page is home page
    showLoading();
    document.querySelector(".nav-link.active").classList.remove("active");
    getEl("homeTab").classList.add("active");
    const response = await fetch(apiUrl + "characters");
    const heros = await response.json();
    heros.forEach(multiplyHero("heroes"));
    hideEl("loading");
    showEl("homePage");
  } else if (currentPage === PAGES.CHARACTER) {
    // If page is character page

    showLoading();
    const response = await fetch(apiUrl + "character/" + characterId);
    const character = await response.json();

    getEl("hero-name").innerHTML = character.name;
    getEl("hero-description").innerHTML = character.description;
    let heroImg = "";
    if (character.thumbnail) {
      heroImg = character.thumbnail.path + "." + character.thumbnail.extension;
    }
    getEl("hero-img").setAttribute("src", heroImg);
    if (character.urls) {
      const getLink = (type) =>
        character.urls.find((i) => i.type === type)?.url ?? "#";
      getEl("detail-btn").setAttribute("href", getLink("detail"));
      getEl("wiki-btn").setAttribute("href", getLink("wiki"));
      getEl("comic-btn").setAttribute("href", getLink("comiclink"));
    }

    character.events?.items.slice(0, 6).forEach((item) => {
      const a = document.createElement("a");
      a.setAttribute("href", item.resourceURI);
      a.innerHTML = item.name;
      const li = document.createElement("li");
      li.appendChild(a);
      getEl("event-list").append(li);
    });
    let favorites = localStorage.getItem("marvel-favorites");

    if (favorites) {
      favorites = JSON.parse(favorites);
      const findFav = favorites.find((i) => i.id == character.id);
      if (findFav) {
        getEl("favorite-btn").style.display = "none";
        getEl("unfavorite-btn").style.display = "block";
      }
    }

    getEl("favorite-btn").addEventListener("click", viewPageFavBtn(character));
    getEl("unfavorite-btn").addEventListener(
      "click",
      viewPageUnFavBtn(character)
    );

    const response1 = await fetch(apiUrl + "comics/" + characterId);
    let comics = await response1.json();
    comics = comics.slice(0, 6);
    comics.forEach(multiplyItem("comics"));
    showEl("viewPage");
    hideEl("loading");

    const response2 = await fetch(apiUrl + "series/" + characterId);
    let series = await response2.json();
    series = series.slice(0, 6);
    series.forEach(multiplyItem("series"));

    const response3 = await fetch(apiUrl + "stories/" + characterId);
    let stories = await response3.json();
    stories = stories.slice(0, 6);
    stories.forEach(multiplyItem("stories"));
  } else {
    // If page is favorites page
    showLoading();
    document.querySelector(".nav-link.active").classList.remove("active");
    getEl("favTab").classList.add("active");
    let favorites = localStorage.getItem("marvel-favorites");
    favorites = JSON.parse(favorites);

    favorites.forEach(multiplyHero("favoriteHeros"));
    hideEl("loading");
    showEl("favoritePage");
  }
})();
