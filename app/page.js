"use client";

import React, { useState, useEffect } from 'react';
import MovieList from './components/movie-list';
import MovieListHeading from './components/movieListHeading';
import SearchBox from './components/search-box';
import AddFavorites from './components/addFavorites';
import RemoveFavorites from './components/removeFavorites';

// const OMDB_API_KEY = 'd74b16e8'; // Reminder: Move this to environment variables for production

const OMDB_API_KEY = process.env.OMDB_API_KEY;

// Custom hook for debouncing
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default function Page() {
  const [movies, setMovies] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearchValue = useDebounce(searchValue, 500);

  //const delay = ms => new Promise(res => setTimeout(res, ms));

  useEffect(() => {
    const getMovieRequest = async () => {
      if (!debouncedSearchValue) {
        setMovies([]);
        setErrorMessage('');
        return;
      }
      const url = `https://www.omdbapi.com/?s=${encodeURIComponent(debouncedSearchValue)}&apikey=${OMDB_API_KEY}`;
      setIsLoading(true); // Start loading

      try {

        //await delay(2000);

        const response = await fetch(url);
        const responseJson = await response.json();

        setIsLoading(false); // Stop loading
        if (responseJson.Search) {
          const moviesWithDetails = await Promise.all(
            responseJson.Search.map(async (movie) => {
              const detailsUrl = `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${OMDB_API_KEY}`;
              const detailsResponse = await fetch(detailsUrl);
              const detailsJson = await detailsResponse.json();
              return { ...movie, Genre: detailsJson.Genre, Ratings: detailsJson.Ratings };
            })
          );
          setMovies(moviesWithDetails);
          setErrorMessage('');
        } else {
          setMovies([]);
          setErrorMessage('Movie not found!');
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
        setIsLoading(false); // Stop loading on error
        setErrorMessage('Failed to fetch movies. Please try again later.');
        setMovies([]);
      }
    };

    getMovieRequest();
  }, [debouncedSearchValue]);

  useEffect(() => {
    const movieFavorites = localStorage.getItem('react-movie-app-favorites');
    setFavorites(movieFavorites ? JSON.parse(movieFavorites) : []);
  }, []);

  const saveToLocalStorage = (items) => {
    localStorage.setItem('react-movie-app-favorites', JSON.stringify(items));
  };

  const handleClearSearch = () => {
    setSearchValue('');
    setErrorMessage('');
  };

  const addFavoriteMovie = (movie) => {
    const newFavoriteList = [...favorites, movie];
    setFavorites(newFavoriteList);
    saveToLocalStorage(newFavoriteList);
  };

  const removeFavoriteMovie = (movie) => {
    const newFavoriteList = favorites.filter((favorite) => favorite.imdbID !== movie.imdbID);
    setFavorites(newFavoriteList);
    saveToLocalStorage(newFavoriteList);
  };

  const clearFavorites = () => {
    const confirmClear = window.confirm("Are you sure you want to clear all favorites?");
    if (confirmClear) {
      setFavorites([]);
      localStorage.setItem('react-movie-app-favorites', JSON.stringify([]));
    }
  };

  return (
    <main className="bg-gray-900 p-2">
      <div className="mb-9">
        <MovieListHeading heading="CinemaPicks" />
        <p className="text-center text-white">Welcome to CinemaPicks, your go-to app for all things movies.</p>
        <div className="flex flex-col items-center justify-center mt-6">
            <SearchBox value={searchValue} onChange={setSearchValue} onClear={handleClearSearch} />
            {isLoading && <p className="text-white">Loading...</p>}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </div>
      </div>
      <div>
        <MovieList
          movies={movies}
          handleFavoritesClick={addFavoriteMovie}
          FavoriteComponent={AddFavorites}
        />
      </div>
      
      <div>
        <MovieListHeading heading="Favorites" />
      </div>
      <div>
        <MovieList
          movies={favorites}
          handleFavoritesClick={removeFavoriteMovie}
          FavoriteComponent={RemoveFavorites}
        />
      </div>
      <div>
      <button 
          onClick={clearFavorites} 
          className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition duration-300 ease-in-out my-4"
        >
          Clear List
        </button>
      </div>
      
    </main>
  );
}
    