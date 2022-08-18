import React from 'react';
import axios from 'axios';
import Review from '../components/Review';
import WriteReview from '../components/WriteReview';
import './Detail.css';

class Detail extends React.Component {
   state = {
    isLoading: true,
    reviews: [],
    content_id : 0, 
    numRows: 0
  }; 

  getReviews = async () => {
    const mycontent_id = this.props.match.params.url_content_id;
    var myurl;
    if (mycontent_id){
      myurl = 'https://8snn27pzii.execute-api.ap-northeast-2.amazonaws.com/web3studydbconn?content_id=' + mycontent_id;
    }
    else{
      myurl = 'https://8snn27pzii.execute-api.ap-northeast-2.amazonaws.com/web3studydbconn?content_id=ALL';
    }
    const { data:reviews } = await axios.get(myurl); 
    console.log('myurl : ' + myurl);
    // 람다로 만든 API URL : 리뷰 리스트 업, content_id 에 해당하는 영화 아이디를 넣음
    var numRows = reviews.length ;
    this.setState({ reviews, isLoading: false, mycontent_id, numRows });
  };
  
  componentDidMount() {
   // const { location, history } = this.props;
    const { history } = this.props;
    if (this.props.match.params.url_content_id === undefined) { //location.state === undefined ||
      history.push('/');
    } 
    this.getReviews();
  }

  render() {
    // const { location } = this.props;
    
    const { isLoading, reviews, numRows } = this.state;
    const url_content_id = this.props.match.params.url_content_id;
    const url_content_title = this.props.match.params.url_content_title ;
    console.log("login_id render:" + sessionStorage.getItem("uname"));
    
     if (isLoading) {
      return (
        <section className="reviewcontainer">
        <div className="loader">
          <span className="loader__text">Loading...</span>
        </div>
        </section>
      );
    }

    if (!this.state) {
      return null; // defense code have not mean.
    }

    if (!numRows) {
      return (
      <section className="reviewcontainer">
         <div className="reviews">
            <span>{url_content_title}에 대해 첫리뷰를 작성해주세요</span>
         <WriteReview
            content_id={url_content_id.toString()}
            login_id={sessionStorage.getItem("uname")}
            reply_id= "0"
            numRows = {0}
          />
        </div>  
      </section>
      );
    }

    return (
      <section className="reviewcontainer">
          <div className="reviews">
          <WriteReview
            content_id={url_content_id.toString()}
            login_id ={sessionStorage.getItem("uname")}
            reply_id= "0"
            numRows = {numRows}
          />
            {
              reviews.map((review) => {
               return (
                <Review
                   key={review.id.toString()}
                  review_id = {review.id.toString()}
                  content_id={review.content_id.toString()}
                  title= {url_content_title}
                  owner_id={review.owner_id}
                  yn_reply={review.yn_reply}
                  review_title={review.review_title}
                  review_body={review.review_body}
                  modified_day={review.modified_day}
                  yn_visible={review.yn_visible}
                />
              );
            })}
          </div>
      </section> );
  }
}

export default Detail;