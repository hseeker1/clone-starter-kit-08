import React from 'react';
import PropTypes from 'prop-types';
import './Movie.css';
import { Link } from 'react-router-dom';

function Movie({ content_id, title, year, summary, poster, genres }) {
  return (
    <div className="movie">
      <Link to={{ pathname: '/movie-detail/'+content_id+'/'+title, state: { content_id, title} }}> 
        <img src={poster} alt={title} title={title} />
        <div className="movie__data">
          <h3 className="movie__title" content_id = {content_id}>{title}</h3>
          <h5 className="movie__year">{year}</h5>
          <ul className="movie__genres">
            {genres.map((genre, index) => {
              return (
                <li key={index} className="movie__genre">
                  {genre}
                </li>
              );
            })}
          </ul>
          <p className="movie__summary">{summary.slice(0, 360)}...</p>
        </div>
      </Link>
    </div>
  );
}

Movie.propTypes = {
  content_id: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  poster: PropTypes.string.isRequired,
  genres: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Movie;
