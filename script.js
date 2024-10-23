const apiKey = ''; // Reemplaza con tu clave API
const apiUrl = 'https://api.themoviedb.org/3';
const movieList = document.getElementById('movies');
const movieDetails = document.getElementById('movie-details');
const detailsContainer = document.getElementById('details');
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const favoritesList = document.getElementById('favorites-list');
const addToFavoritesButton = document.getElementById('add-to-favorites');
let selectedMovieId = null;
let favoriteMovies = JSON.parse(localStorage.getItem('favorites')) || [];

// CONSULTAR LA API DE TMDB DE LAS PELICULAS PUPULARES
async function fetchPopularMovies() {
    try {
        const response = await fetch(`${apiUrl}/movie/popular?api_key=${apiKey}`);
        if (!response.ok) {
            throw new Error('Error en la consulta');
        }
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Error fetching popular movies:', error);
    }
}

// MOSTRAR LISTA DE PELÍCULAS
function displayMovies(movies) {
    movieList.innerHTML = ''; // Limpia la lista de películas
    movies.forEach(movie => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <span>${movie.title}</span>
        `;
        li.onclick = () => showMovieDetails(movie.id); // Muestra detalles al hacer clic en la película
        movieList.appendChild(li);
    });
}

// MOSTRAR LOS DETALLES DE UNA PELÍCULA
async function showMovieDetails(movieId) {
    try {
        const response = await fetch(`${apiUrl}/movie/${movieId}?api_key=${apiKey}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const movie = await response.json();
        detailsContainer.innerHTML = `
            <h3>${movie.title}</h3>
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <p>${movie.overview}</p>
        `;
        selectedMovieId = movie.id;
        movieDetails.classList.remove('hidden');
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

// EVENTO BUSCAR PELÍCULA
searchButton.addEventListener('click', async () => {
    const query = searchInput.value;
    if (query) {
        try {
            const response = await fetch(`${apiUrl}/search/movie?query=${encodeURIComponent(query)}&api_key=${apiKey}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            displayMovies(data.results);
        } catch (error) {
            console.error('Error searching movies:', error);
        }
    }
});

// EVENTO PARA AGREGAR A FAVORITOS
addToFavoritesButton.addEventListener('click', () => {
    if (selectedMovieId) {
        const favoriteMovie = {
            id: selectedMovieId,
            title: document.querySelector('#details h3').textContent
        };
        addToFavorites(favoriteMovie);
    }
});

// FUNCIÒN PARA AGREGAR A FAVORITOS
function addToFavorites(movie) {
    if (!favoriteMovies.some(favMovie => favMovie.id === movie.id)) {
        favoriteMovies.push(movie);
        localStorage.setItem('favorites', JSON.stringify(favoriteMovies));
        displayFavorites();
    }
}

// MOSTRAR FAVORITOS
function displayFavorites() {
    favoritesList.innerHTML = '';
    favoriteMovies.forEach(movie => {
        const favoriteItem = document.createElement('li');
        favoriteItem.textContent = movie.title;
        favoritesList.appendChild(favoriteItem);
    });
}

// Initial fetch of popular movies and display favorites
fetchPopularMovies(); // Obtiene y muestra las películas populares
displayFavorites(); // Muestra las películas favoritas guardadas