import React, { useState, useEffect } from 'react';
import './Review.css';
import axios from 'axios';
import PropTypes from 'prop-types';

function Likedislike({content_id, review_id, login_id, owner_id}) {
    

    const [likecnt, setlikecnt] = useState(0);
    const [Dislikecnt, setDislikecnt] = useState(0);
    const [ownerchk, setownerchk] = useState(1);
    const [likedisable, setLikeDisable] = useState(false);
    const [Dislikedisable, setDislikeDisable] = useState(false);


    //const loginID = owner_id;
   //  const loginID = "testid";

   

     useEffect(() => {
         async function fetchData () {

             console.log('content_id : ' + content_id + '  review_id :' + review_id + '  login_id :' + login_id);

            axios.post('https://vrkj60roca.execute-api.ap-northeast-2.amazonaws.com/Production',
                 {
                     "target": "getlike",
                     "content_id": content_id,
                     "review_id": review_id
                 })
                 .then((response) => {

                     const res = JSON.parse(response.data.body);

                     if (response.data.statusCode === 200 && res.length > 0) {
                         setlikecnt(likecnt => 0);
                         setDislikecnt(Dislikecnt => 0);
                       
                         for (let nn in res) {
                             if (res[nn].yn_like === 1) {
                                 console.log("like : " + res[nn].CNT);
                                 setlikecnt(likecnt => res[nn].CNT);
                             }
                             else {
                                 console.log("dislike : " + res[nn].CNT);
                                 setDislikecnt(Dislikecnt => res[nn].CNT);
                             }

                         }
                     }

                    axios.post('https://vrkj60roca.execute-api.ap-northeast-2.amazonaws.com/Production',
                         {
                             "target": "ownerlist",
                             "content_id": content_id,
                             "review_id": review_id
                         }) 
                    .then((response)=> {
                        
                        if(  JSON.parse(response.data.body).filter(function (e) { return e.owner_id === login_id }).length > 0 ) {
                            setownerchk(1) ;
                            setLikeDisable(true);
                            setDislikeDisable(true);
                        }
                        else {
                            setownerchk(0) ;
                        }
                      console.log("review_id like owner chk no. : " + ownerchk);
                        
                    })
                    .catch((error) => {console.log(error);})                    
                 })
                 .catch((error) => {
                     console.log(error.response);
                     setlikecnt(likecnt => 0);
                     setDislikecnt(Dislikecnt => 0);
                 });
         }

         fetchData();
         // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const likeadd = () => {
        console.log('like add loginID:' + login_id + " owner_id: " + owner_id + " ownerchk: " + ownerchk );
        if (login_id === owner_id ) {
            alert('내 리뷰에 내가 좋아요는 못합니다.!')
        } 
        else if (ownerchk > 0) {
            alert('좋아요 혹은 싫어요를 이미 선택했습니다.')
        }
        else {
            setlikecnt(likecnt => likecnt + 1);
            axios.post('https://vrkj60roca.execute-api.ap-northeast-2.amazonaws.com/Production',
                {
                    "target": "putlike",
                    "content_id": content_id,
                    "review_id": review_id,
                    "owner_id": login_id,
                    "yn_like" : true
                })
                .then((response) => {

                    console.log(response);

                })
                .catch((error) => { console.log(error); })
                
        }
        setLikeDisable(true);
        setDislikeDisable(true);
    }

    const Dislikeadd = () => {
        console.log('Dislike add loginID:' + login_id + " owner_id: " + owner_id + " ownerchk: " + ownerchk);
        if (login_id === owner_id) {
            alert('내 리뷰에 내가 싫어요는 못합니다.!')
        }
        else if (ownerchk > 0) {
            alert('좋아요 혹은 싫어요를 이미 선택했습니다.')
        }
        else {
            setDislikecnt(Dislikecnt => Dislikecnt + 1);
            axios.post('https://vrkj60roca.execute-api.ap-northeast-2.amazonaws.com/Production',
                {
                    "target": "putlike",
                    "content_id": content_id,
                    "review_id": review_id,
                    "owner_id": login_id,
                    "yn_like": false
                })
                .then((response) => {

                    console.log(response);

                })
                .catch((error) => { console.log(error); })  
        }
        setLikeDisable(true);
        setDislikeDisable(true);
       
    }


    return (
        <div className = "likedislike" > {review_id} / {login_id} / {ownerchk}
            <img src="./assets/iconmonstr-thumb-14.svg" alt="like" /><button disabled={likedisable} onClick={likeadd}>{likecnt}</button>  
            <img src="./assets/iconmonstr-thumb-20.svg" alt="dislkie" /><button disabled={Dislikedisable} onClick={Dislikeadd}>{Dislikecnt}</button>
        </div>
    );
}

Likedislike.propTypes = {
    content_id: PropTypes.string.isRequired,
    review_id: PropTypes.string.isRequired,
    owner_id: PropTypes.string.isRequired
};

export default Likedislike; 