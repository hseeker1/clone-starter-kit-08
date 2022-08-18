import React, {useState} from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './Review.css';


function WriteReview({ content_id, login_id, reply_id, numRows }) {
  
    let [wtitle, setInputValue] = useState("");
    let [wbody, setInputValue2] = useState("");

    const submitReview = (e) => {
  
        axios.post('https://vrkj60roca.execute-api.ap-northeast-2.amazonaws.com/Production',
              {
                  "target": "review",
                  "content_id": content_id,
                  "reply_id": "0",
                  "owner_id": login_id,
                  "review_title": wtitle,
                  "review_body": wbody
              }).then(
                () => {alert('등록완료');}
              )

      setInputValue("");
      setInputValue2("");
      window.location.reload(); 
    };

    console.log("content_id :" + content_id + ", login_id :" + login_id);

    return (
        <div className="form_review_write">
          <h5 className="content_title" >리뷰작성:{content_id}</h5>
          <h5 className="content_title" >{login_id}</h5>
          <input className = "title_input" type="text" placeholder="제목" name = "wtitle" onChange={(event) => setInputValue(event.target.value)} ></input>
            <input className="body_input" type="text" placeholder="내용" name="wbody" onChange={(event) => setInputValue2(event.target.value)}></input>
          <p></p>
        <button className="submit_button" value="글쓰기" onClick={submitReview}>글쓰기</button>
          <button className="go_list_button" value="목록으로">목록으로</button>
        </div>
    );
}

/*

  <div className="reviews" >
           <table className="form_review_write">
             <tr>
               <th className="content_title" >
                 리뷰작성
               </th>
             </tr>
             <tr>
               <td className="review_title">
                 <input type="text" placeholder="제목" maxlength="50" style="width:100%"></input>
               </td>
             </tr>
             <tr>
               <td className="review_body">
                 <textarea placeholder="내용" style="width: 100%; height: 100%"></textarea>
               </td>
             </tr>
             <tr>
               <td colspan="2" align="right">
                 <input type="button" value="글쓰기"></input>
                 <input type="button" value="목록으로"></input>
                </td>
              </tr>
             </table>
          </div>
          

function WriteReview({ content_id, owner_id, reply_id }) {
  return (
       <div className="form_review_write">
      <Link to={{ pathname: '/review', state: { content_id, owner_id, reply_id, review_title, review_body } }}>
      <div className="review__data">
        <h3 className="content__title">{title}</h3>
        <h3 className="review__title"><span>리뷰제목</span><input name='review_title' ></input></h3>
        <ul className="review__owner__id">{owner_id}</ul>
        <p className="review__body"><span>내용</span><textarea name='review_body'></textarea></p>
      </div>
      </Link>
    </div>
  );
} */

WriteReview.propTypes = {
    content_id: PropTypes.string.isRequired,
    login_id: PropTypes.string.isRequired,
    reply_id: PropTypes.string.isRequired
};

export default WriteReview;