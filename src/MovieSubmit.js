import React from 'react';
import { useState } from 'react';

function MovieQueryForm({ addMovieQuery }) {
    const [movieQuery, setMovieQuery] = useState();
    const handleSubmit= (e) => {
        addMovieQuery([movieQuery])
        e.preventDefault();
    }

    return (
        <form onSubmit={e => { handleSubmit(e) }}>
        <label>Movie query:</label>
        <br />
        <input 
            name='movieQuery' 
            type='text'
            value={movieQuery}
            onChange={e => setMovieQuery(e.target.value)}
        />
        <br/>
        <input 
            type='submit' 
            value='Add Movie Query' 
        />
        </form>
    )
}

export default MovieQueryForm;