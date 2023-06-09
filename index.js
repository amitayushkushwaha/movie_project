// getting users desired movie name.
// af= after movie search
// be= before movie search

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhY2ZkNjFmNTdhY2E3MDZiZjdiM2Y1YzlkODlkMmE3OSIsInN1YiI6IjY0N2FmYmQ1MGUyOWEyMDBkY2JhYzk5MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZyXltxrwPq2VmAHRc47XU-fT31S9kwU1EEGgjuWMDFM",
  },
};

// list of movies as movie_card
function Movie_card(response, count, movies_list) {
  for (let i = 0; i < count; i++) {
    var Url =
      "https://image.tmdb.org/t/p/original" + response.results[i].backdrop_path;
    if (response.results[i].backdrop_path) {
      const movie_title = document.createElement("p");
      movie_title.innerHTML = response.results[i].title;
      const movie_image = document.createElement("img");
      movie_image.src = Url;
      movie_image.alt = "poster";
      // adding event listener click to every image
      movie_image.addEventListener("click", function (event) {
        event.preventDefault();
        document.getElementById("movie_details_be").classList.add("disappear");
        document.getElementById("movie_details_af").classList.add("disappear");
        const Form = document.getElementById("searching");
        Form.classList.add("disappear");
        const movie_info = document.createElement("div");
        const movie_title = document.createElement("p");
        movie_title.innerHTML = "Title: " + response.results[i].title;
        const overview = document.createElement("p");
        overview.innerHTML = "Overview: " + response.results[i].overview;
        const Genre = document.createElement("p");
        const genre_id = response.results[i].genre_ids[0];
        gen(genre_id, Genre);
        movie_info.append(movie_title, Genre, overview);
        const movie_image = document.createElement("img");
        movie_image.classList.add("one_movie");
        movie_image.src =
          "https://image.tmdb.org/t/p/original" +
          response.results[i].poster_path;
        movie_image.alt = "poster";
        document.getElementById("One_movie").append(movie_image, movie_info);
      });
      const genre_id = response.results[i].genre_ids[0];
      const Genre = document.createElement("p");
      Genre.classList.add("Genre");
      gen(genre_id, Genre);
      const movie_rating = document.createElement("p");
      const rating = response.results[i].vote_average;
      Rating(rating, movie_rating);
      const movie_info = document.createElement("div");
      movie_info.classList.add("movie_title");
      movie_info.append(Genre, movie_rating, movie_title);
      const movie_details = document.createElement("div");
      movie_details.classList.add("image");
      movie_details.append(movie_image, movie_info);
      movies_list.appendChild(movie_details);
    }
  }
}

// before specific search movies display.
function Movies() {
  const url =
    "https://api.themoviedb.org/3/discover/movie?api_key=acfd61f57aca706bf7b3f5c9d89d2a79&include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres";
  fetch(url, options)
    .then((response) => response.json())
    .then((response) => {
      const count = response.results.length;
      const movies_list = document.getElementById("movie_details_be");
      Movie_card(response, count, movies_list);
    })
    .catch((err) => {
      // when error in fetching.
      Error("movie_details_be");
    });
}
Movies();

const form = document.getElementById("form");
form.addEventListener("submit", submit_Handler);
// submit handler
function submit_Handler(event) {
  event.preventDefault();
  // making befores movies list disappear.
  const Before_movie_list = document.getElementById("movie_details_be");
  Before_movie_list.classList.add("disappear");

  // getting searched movie name
  const data = new FormData(event.target);
  const movie_name = data.get("movieName");

  // after search diabling search option so, for search again go to home
  // and on place of search displaying searched movie name.
  const Form = document.getElementById("searching");
  Form.classList.add("disappear");
  const search_section = document.getElementById("searched");
  search_section.classList.add("after_searched");
  const para = document.createElement("p");
  para.innerHTML = movie_name.toUpperCase();
  search_section.appendChild(para);

  // api calling for getting desired movie.
  const TMDBUrl =
    "https://api.themoviedb.org/3/search/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&";
  const api_key = "acfd61f57aca706bf7b3f5c9d89d2a79";
  const url = TMDBUrl + "query=" + movie_name + "&api_key=" + api_key;
  console.log(url);
  fetch(url, options)
    .then((response) => response.json())
    .then((response) => {
      // console.log(response.results[1]);
      const count = response.results.length;
      const movies_list = document.getElementById("movie_details_af");

      // when searched_movie not found.
      if (!count) {
        const movie_list = document.getElementById("movie_details_af");
        const no_movie = document.createElement("p");
        no_movie.innerHTML = "No Results found ....";
        no_movie.classList.add("err");
        movie_list.appendChild(no_movie);
      }

      // when searched_movie found
      Movie_card(response, count, movies_list);
    })
    .catch((err) => {
      // when error in fetching.
      Error("movie_details_af");
    });

  // if movie has any child
  const s = document.getElementById("One_movie");
  if (s.childElementCount) {
    s.removeChild(s.firstElementChild);
    s.removeChild(s.lastElementChild);
  }
}

// event listener to home on click
// after click on on appeared search section.
const home = document.getElementById("home");
home.addEventListener("click", clickHandler);
function clickHandler(event) {
  event.preventDefault();

  // making befores movies list appear.
  const Before_movie_list = document.getElementById("movie_details_be");
  Before_movie_list.classList.remove("disappear");

  // enabling search option
  //  removing searched movie name.
  const Form = document.getElementById("searching");
  Form.classList.remove("disappear");
  const search_section = document.getElementById("searched");
  // search_section.removeChild(search_section.lastElementChild);
  if (search_section.hasChildNodes()) {
    search_section.removeChild(search_section.firstElementChild);
  }

  search_section.classList.remove("after_searched");

  // removing searched movies as we are going at home section
  const after_movie_list = document.getElementById("movie_details_af");
  while (after_movie_list.lastElementChild) {
    after_movie_list.removeChild(after_movie_list.lastElementChild);
  }
  const s = document.getElementById("One_movie");
  if (s.childElementCount) {
    s.removeChild(s.firstElementChild);
    s.removeChild(s.lastElementChild);
  }
}
// event listener click assign to discovery
const discovery = document.getElementById("discovery");
discovery.addEventListener("click", ClickHandler);
function ClickHandler(event) {
  event.preventDefault();
  document.getElementById("movie_details_af").classList.remove("disappear");

  if (!document.getElementById("movie_details_af").childElementCount) {
    document.getElementById("movie_details_be").classList.remove("disappear");
    const Form = document.getElementById("searching");
    Form.classList.remove("disappear");
  }

  const s = document.getElementById("One_movie");
  if (s.childElementCount) {
    s.removeChild(s.firstElementChild);
    s.removeChild(s.lastElementChild);
  }
}

// Genre of a movie
function gen(val, p) {
  switch (val) {
    case 28:
      p.innerHTML = "Action ";
      break;
    case 12:
      p.innerHTML = "Adventure";
      break;
    case 16:
      p.innerHTML = "Animation";
      break;
    case 35:
      p.innerHTML = "Comedy";
      break;
    case 80:
      p.innerHTML = "Crime";
      break;
    case 99:
      p.innerHTML = "Documentary";
      break;
    case 18:
      p.innerHTML = "Drama";
      break;
    case 10751:
      p.innerHTML = "Family";
      break;
    case 14:
      p.innerHTML = "Fantasy";
      break;
    case 36:
      p.innerHTML = "History";
      break;
    case 27:
      p.innerHTML = "Horror";
      break;
    case 9648:
      p.innerHTML = " Mystery";
      break;
    case 10749:
      p.innerHTML = " Romance ";
      break;
    case 878:
      p.innerHTML = " Science Fiction";
      break;
    case 53:
      p.innerHTML = "Thriller ";
      break;
    default:
      p.innerHTML = "Action";
  }
}

// Rating of a movie

function Rating(rating, movie_rating) {
  if (rating <= 4) {
    movie_rating.innerHTML = "⭐⭐";
  } else if (rating <= 6) {
    movie_rating.innerHTML = "⭐⭐⭐";
  } else if (rating <= 8) {
    movie_rating.innerHTML = "⭐⭐⭐⭐";
  } else {
    movie_rating.innerHTML = "⭐⭐⭐⭐⭐";
  }
}

// while error in fetching
function Error(Box) {
  const movie_list = document.getElementById(Box);
  const errors = document.createElement("p");
  errors.innerHTML = "There is Something Error, Search After Sometime .....";
  errors.classList.add("err");
  movie_list.appendChild(errors);
}
