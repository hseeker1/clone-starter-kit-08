import React, { useState, useEffect } from 'react';
import './Review.css';
import axios from 'axios';
import PropTypes from 'prop-types';
import Caver from 'caver-js';

const walletdb = [
    {
      uname : "sohan1",
      accnt : "0x5BDCdEfed912981Db7f5c6f7b67717b8144Fd69f" // my_personal_wallet
    },
    {
      uname : "sohan2",
      accnt : "0xd1deA81Dc7C8168C1677a584281fd0725904CCa4" // my_test_wallet
    },
    {
      uname : "sohan3",
      accnt : "0x8d07FE42EEdC976B46375b641EE1cE9Be75c6186" // kas_wallet_id
    },
    {
      uname : "sohan4",
      accnt : "0x5c26c53f1358b16d5551438f7d33d8fafad03b05" // svc_wallet_id
    },
    {
      uname : "new1",
      accnt : "0x145415e851F4d80C7213481746E04F77219b33C6" // newcome & 리뷰작성
    },
    {
      uname : "review1",
      accnt : "0x0795f4690A3aacF5B08202D2ED7118266338e26B" //  시연NFT리뷰 기작성자
    },
    {
        uname : "like1",
        accnt : "0x145415e851F4d80C7213481746E04F77219b33C6" //  좋아요 
      },
  ];

const mywallet = {
    myaccnt: "",
    mybalklay: 0.0,
    mybalPCT: 0.0,
    mynetwork: ""
  };
  

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

    const likeadd =  () => {
        console.log('like add loginID:' + login_id + " owner_id: " + owner_id + " ownerchk: " + ownerchk );
        if (login_id === owner_id ) {
            alert('내 리뷰에 내가 좋아요는 못합니다.!')
        } 
        else if (ownerchk > 0) {
            alert('좋아요 혹은 싫어요를 이미 선택했습니다.')
        }
        else {
            
            const reviewer_accnt = walletdb.find((user) => user.uname === owner_id );
            mywallet.myaccnt = sessionStorage.getItem("accnt");
            
            // let reviewer_accnt = '0x5BDCdEfed912981Db7f5c6f7b67717b8144Fd69f';
            
            console.log("call like accnt:" + mywallet.myaccnt );
            console.log("reviewer id : " + owner_id + " accnt:" + reviewer_accnt.accnt )

            
            setlikecnt(likecnt => likecnt + 1);

            axios.post('https://b4dvqo4yol.execute-api.ap-northeast-2.amazonaws.com/prod/',
            {
                "act" : "likeReward",  
                "like_push_wallet": mywallet.myaccnt,
                "reviewer_wallet" : reviewer_accnt.accnt,
                "like_count" : "5"
            }).then(
                () => { 
                    axios.post('https://vrkj60roca.execute-api.ap-northeast-2.amazonaws.com/Production',
                    {
                        "target": "putlike",
                        "content_id": content_id,
                        "review_id": review_id,
                        "owner_id": login_id,
                        "yn_like" : true
                    })
                .then((response) => { console.log(response); })
                .catch((error) => { console.log(error); })
                alert('팝콘을 받았습니다'); 
                }
            )
  
          
                
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