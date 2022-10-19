import React, {useState} from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './Review.css';
import Caver from 'caver-js';

const DataTransaction = {   //팝콘 전송 데이터 코딩 - not deligate 
  from: "",
  to: "0x8d07FE42EEdC976B46375b641EE1cE9Be75c6186",  //kas_wallet_id
  amount: 0, // 시나리오에 정의한 팝콘 소모량 * 글쓰기 시 1팝콘 소모
  contractAddress: "0x59810df6700aa304a8890bf57841637ba36b529f", //팝콘 스마트콘트랙 어드레스
  gas: 3000000,
  txHash: null,
  receipt: null,
  error: null,
  decimal: 18 
};

const mywallet = {
  myaccnt: "",
  mybalklay: 0.0,
  mybalPCT: 0.0,
  mynetwork: ""
};



function WriteReview({ content_id, login_id, reply_id, numRows }) {
  
    let [wtitle, setInputValue] = useState("");
    let [wbody, setInputValue2] = useState("");


    const submitReview = async (e) => {

      ////////////////////////////////////////////////

      const { klaytn } = window;
      if (klaytn === undefined)  return
      const caver = new Caver(klaytn);
      mywallet.myaccnt = sessionStorage.getItem("accnt");
      console.log("call testTrnas myaccnt:" + mywallet.myaccnt );
 
        // 필요한 어드레스 등의 셋팅
      DataTransaction.from = mywallet.myaccnt;
      DataTransaction.amount = 10.0 ; // 시나리오에 정의한 팝콘 소모량 * 글쓰기 시 10팝콘 소모
 
      const data = caver.klay.abi.encodeFunctionCall(
      {
        name: 'transfer',
        type: 'function',
        inputs: [
          {
            type: 'address',
            name: 'recipient'
          },
          {
            type: 'uint256',
            name: 'amount'
          }
        ]
      },
      [
        DataTransaction.to,
        caver.utils
          .toBN(DataTransaction.amount)
          .mul(caver.utils.toBN(Number(`1e${DataTransaction.decimal}`)))
          .toString()
      ]
    )
    console.log(DataTransaction);
  await  caver.klay.sendTransaction({
        type: 'SMART_CONTRACT_EXECUTION',
        from : DataTransaction.from,
        to: DataTransaction.contractAddress,
        data, //encodeFunctionCall results
        gas: DataTransaction.gas
      })
      .on('transactionHash', transactionHash => {
        console.log('txHash', transactionHash)
      // 화면 표시 등이 있다면 처리하기 --> 함수 안이라 setState 대신 useState 로 정의한 set함수를 정의해 사용해야 함
       // this.setState({ txHash: transactionHash }) 
       // loadAccountInfo(); // 센드 완료 후 콜백 내에서 불러서 값을 업데이트 함
       axios.post('https://vrkj60roca.execute-api.ap-northeast-2.amazonaws.com/Production',
       {
           "target": "review",
           "content_id": content_id,
           "reply_id": "0",
           "owner_id": login_id,
           "review_title": wtitle,
           "review_body": wbody
       }).then(
         () => { alert('등록완료'); }
       )
      })
      .on('receipt', receipt => {
        console.log('receipt', receipt)
      //  this.setState({ receipt: JSON.stringify(receipt) })
      })
      .on('error', error => {
        console.log('error', error)
      //  this.setState({ error: error.message })
      })
    
      //////////////////////////////////////////////////////////////////////////////////////////////
      /*
      await  axios.post('https://vrkj60roca.execute-api.ap-northeast-2.amazonaws.com/Production',
              {
                  "target": "review",
                  "content_id": content_id,
                  "reply_id": "0",
                  "owner_id": login_id,
                  "review_title": wtitle,
                  "review_body": wbody
              }).then(
                () => { alert('등록완료'); }
              )
      */
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
          <button className="submit_button" value="글쓰기" onClick={(event) => { submitReview();} }>글쓰기</button>
        </div>
    );
}

/*  <button className="submit_button" value="글쓰기" onClick={(event) => { WriteSendPCT(); submitReview();} }>글쓰기</button>
 

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