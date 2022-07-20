import React, { useState, useEffect } from 'react';
import './App.css';
import Amplify, { API, Auth, graphqlOperation } from 'aws-amplify'
import { withAuthenticator } from '@aws-amplify/ui-react';
import awsconfig from './aws-exports';
import axios from 'axios';
import { createMovie, updateMovie } from './graphql/mutations'
import { listMovies } from './graphql/queries'
import { apiKey } from './configure.js'
import logo from './WhatAmIWatching.png'
import Grid from "@mui/material/Grid"

Amplify.configure(awsconfig)

const initialState = { moviequery: '' }

const App = () => {
  const [formState, setFormState] = useState(initialState)
  const [movies, setMovies] = useState([])
  const [movieData, setMovieData] = useState([])
  const [movieQueried, setMovieQueried] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(0)
  const [watchState, setWatchState] = useState('to watch')
  const [recommendedMovies, setRecommendedMovies] = useState([])

  useEffect(() => {
    fetchMovies()
  }, [])

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value })
  }

  async function handleSubmit() {
    try {
      if (!formState.moviequery) return
      const params = {
        api_key: apiKey,
        query: formState.moviequery,
        include_adult: false
      }
      const queryString = new URLSearchParams(params).toString();
      const data = await axios.get('https://api.themoviedb.org/3/search/movie?' + queryString);
      setMovieData(data.data.results);
      setMovieQueried(true);
    } catch (err) {
      console.log('error fetching movie')
    }
  }

  async function fetchMovies() {
    try {
      const movieData = await API.graphql(graphqlOperation(listMovies))
      const movies = movieData.data.listMovies.items
      setMovies(movies)
    } catch (err) { console.log('error fetching movies') }
  }

  async function handleMovieSubmit(e) {
    e.preventDefault();
    addMovie();
  }

  async function handleMovieStateChange(e, movie) {
    e.preventDefault();
    try {
      const movieDetails = {
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        poster_path: movie.poster_path,
        watch_status: "watched",
        vote_average: movie.vote_average,
        movie_id: movie.movie_id
      };
      await API.graphql(graphqlOperation(updateMovie, {input: movieDetails}));
      fetchMovies();
    } catch (err) {
      console.log('error updating movie:', err)
    }
  }

  async function generateRecommendations(e, movie) {
    e.preventDefault()
    try {
      const params = {
        api_key: apiKey
      }
      const queryString = new URLSearchParams(params).toString();
      const data = await axios.get(`https://api.themoviedb.org/3/movie/${movie.movie_id}/recommendations?${queryString}`);
      setRecommendedMovies(data.data.results.slice(0,4));
    } catch (err) {
      console.log('error getting movie recommendations:', err)
    }
  }

  async function recommendationToToWatch(e, movie) {
    e.preventDefault();
    console.log(JSON.stringify(movie));
    try {
      const {title, overview, poster_path, vote_average, id } = movie;
      const currMovie = {title, overview, poster_path, vote_average, movie_id: id, watch_status: "to watch" };
      setMovies([...movies, currMovie]);
      await API.graphql(graphqlOperation(createMovie, {input: currMovie}));
      fetchMovies();
    } catch (err) {
      console.log('error creating movie from recommendation:', err)
    }
  }

  async function addMovie() {
    try {
      const currMovieData = movieData[selectedMovie]
      const {title, overview, poster_path, vote_average, id } = currMovieData;
      const movie = { title, overview, poster_path, watch_status: watchState, vote_average, movie_id: id };
      setMovies([...movies, movie]);
      setFormState(initialState);
      setMovieQueried(false);
      await API.graphql(graphqlOperation(createMovie, {input: movie}));
    } catch (err) {
      console.log('error creating movie:', err);
    }
  }

  const signOut = async () => {
    try {
        await Auth.signOut();
        window.location.reload();
    } catch (error) {
        console.log('error signing out: ', error);
    }
  };

  return (
    <div style={styles.overview}>
      <div style={styles.container}>
        <img src={logo}/>
        <input
          onChange={event => setInput('moviequery', event.target.value)}
          style={styles.input}
          value={formState.moviequery} 
          placeholder="Movie Query"
        />
        <button style={styles.button} onClick={handleSubmit}>Query Movie</button>
        { movieQueried ?
        <form onSubmit={(e) => {handleMovieSubmit(e)}}>
          <label>
            Which movie?:
            <select value={selectedMovie} onChange={(e) => {setSelectedMovie(e.target.value)}}>
              {
              movieData.map((movie, index) => (
                <option key={index} value={index}>{movie.title}</option>
              ))
              }
            </select>
          </label>
          <label>
            Have you watched this movie already?:
            <select value={watchState} onChange={(e) => {setWatchState(e.target.value)}}>
              <option value="to watch">No</option>
              <option value="watched">Yes</option>
            </select>
          </label>
          <input type="submit" value="Submit" />
        </form>
        : null}
        <button onClick={signOut}>
          Sign Out
        </button>
      </div>
      <Grid container direction="row" spacing={2} justifyContent="center">
        <Grid item xs>
          <h1>To Watch:</h1>
          {movies.filter(movie => movie.watch_status === "to watch").map(filteredMovie => (
            <div>
              <img 
              src={`https://image.tmdb.org/t/p/w300${filteredMovie.poster_path}`}
              alt="movie poster"
              />
              <h2>{filteredMovie.title}</h2>
              <button value={filteredMovie} onClick={(e) => {handleMovieStateChange(e, filteredMovie, "watched")}}>Add to Watched</button>
              <button value={filteredMovie} onClick={(e) => {generateRecommendations(e, filteredMovie)}}>Generate Recommendations from this movie</button>
            </div>
          ))}
        </Grid>
        {recommendedMovies.length > 0 ? <Grid item xs>
          <h1>Recommendations:</h1>
          {recommendedMovies.map(movie => (
            <div>
              <img 
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt="movie poster"
              />
              <h2>{movie.title}</h2>
              <button value={movie} onClick={(e) => {recommendationToToWatch(e, movie)}}>Add to To-Watch</button>
            </div>
          ))}
        </Grid>: null}
        <Grid item xs>
          <h1>Watched:</h1>
          {movies.filter(movie => movie.watch_status === "watched").map(filteredMovie => (
            <div>
              <img 
              src={`https://image.tmdb.org/t/p/w300${filteredMovie.poster_path}`}
              alt="movie poster"
              />
              <h2>{filteredMovie.title}</h2>
              <button value={filteredMovie} onClick={(e) => {generateRecommendations(e, filteredMovie)}}>Generate Recommendations from this movie</button>
            </div>
          ))}
        </Grid>
      </Grid>
    </div>
  )
}

const styles = {
  overview: { display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px', justifyContent: 'center'},
  container: { width: 400, margin: '0 auto', display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', padding: 20 },
  todo: {  marginBottom: 15 },
  input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 18 },
  button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 18, padding: '12px 0px' },
  hr: { width: '100%', height: 1 }
}

export default withAuthenticator(App, true);