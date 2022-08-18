import React from 'react';
import PropTypes from 'prop-types';
import './Review.css';
import { Link } from 'react-router-dom';
import Likedislike from './Likedislike';


function Review({ review_id, content_id, title, owner_id, yn_reply, review_title, modified_day, review_body, yn_visible }) {
  return (
    <div className="review">
          <div className="review__data" alt={review_id}> 
          <h3 className="content__title">{title}</h3>
          <h3 className="review__title">{review_title}</h3>
          <ul className="review__owner__id">{owner_id}</ul>
          <ul className="content__id">{content_id}</ul>
          <p className="review__body">{review_body.slice(0, 2000)}...</p>
          <h5 className="modified_day">{modified_day}</h5>
        </div>
        <Likedislike
          content_id = {content_id.toString()}
          review_id= {review_id.toString()}
        login_id={sessionStorage.getItem("uname")}
         owner_id = {owner_id}
        />
    </div>
  );
}

Review.propTypes = {
  content_id: PropTypes.string.isRequired,
  review_id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  owner_id: PropTypes.string.isRequired,
  review_title: PropTypes.string.isRequired,
  review_body: PropTypes.string.isRequired
};

export default Review;