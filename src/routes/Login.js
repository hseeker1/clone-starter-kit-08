import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './Login.css';
import caver, { KIP7 } from 'caver-js'
import Caver from 'caver-js';



const logindb = [
  {
    uname : "sohan1",
    password : "pass1"
  },
  {
    uname : "sohan2",
    password : "pass2"
  },
  {
    uname : "sohan3",
    password : "pass3"
  },
  {
    uname : "sohan4",
    password : "pass4"
  }
];

const errors = {
  uname: "invalide username",
  upass: "invalid password"
};

const mywallet = {
  myaccnt: "",
  mybalklay: 0.0,
  mybalPCT: 0.0,
  mynetwork: ""
};

const DataTransaction = {   //팝콘 전송 데이터 코딩 - not deligate 
  from: "",
  to: "0x5c26c53f1358b16d5551438f7d33d8fafad03b05",  //U+test0001
  amount: 0, // 시나리오에 정의한 팝콘 소모량 * 글쓰기 시 1팝콘 소모
  contractAddress: "0x59810df6700aa304a8890bf57841637ba36b529f", //팝콘 스마트콘트랙 어드레스
  gas: 3000000,
  txHash: null,
  receipt: null,
  error: null,
  decimal: 18 
};


function Login(){
 /* 
state = {
  errorMessagees: '',
  isSubmitted:false,
  account:'',
  balance : 0,
  network :''
} */
  
const [errorMessages, setErrorMessages] = useState({});
const [isSubmiited, setIsSubmitted] = useState(false);
const [accnt, setAccnt] = useState("");
const [bal, setBal] = useState(0.0);
const [pct, setPct] = useState(0.0);

const loadAccountInfo = async () => {
  const { klaytn } = window

  if (klaytn) {
    try {
      await klaytn.enable()
      setAccountInfo(klaytn)
      klaytn.on('accountsChanged', () => setAccountInfo(klaytn))
    } catch (err) {
     // console.log('User denied account access : '+error) 
     console.log(err) 
    }
  } else {
    console.log('Non-Kaikas browser detected. You should consider trying Kaikas!')
  }
}

const setAccountInfo = async () => {
  const { klaytn } = window
  if (klaytn === undefined) return
  const caver = new Caver(klaytn);
  mywallet.myaccnt = klaytn.selectedAddress ;
  sessionStorage.setItem("accnt", mywallet.myaccnt);
  const bal = await caver.klay.getBalance(mywallet.myaccnt);
  mywallet.mybalklay = caver.utils.fromPeb(bal,'KLAY');
   setAccnt(mywallet.myaccnt); // 어드레스 표시 업데이트
   setBal(mywallet.mybalklay); //클레이 잔액 표시 업데이트
   
   // 팝콘 잔액 표시를 위한 부분

   const kip7 = new caver.kct.kip7(DataTransaction.contractAddress);
   console.log(kip7);

   mywallet.mybalPCT = await kip7.balanceOf(mywallet.myaccnt);
   setPct(caver.utils.fromPeb(mywallet.mybalPCT, 'KLAY')); 
   console.log('PCT:' + mywallet.mybalPCT); 

  //  console.log('accnt:' + sessionStorage.getItem("accnt"));
  console.log('accnt:' + mywallet.myaccnt);  
  console.log('balance:' + mywallet.mybalklay);

}

const setNetworkInfo = () => {
  const { klaytn } = window
  if (klaytn === undefined) return
  if (klaytn.networkVersion != '1001') {
    alert('테스트넷이 아닙니다.');
    return;
  }
  mywallet.mynetwork = klaytn.networkVersion ;
  sessionStorage.setItem("knetwork", mywallet.mynetwork);
  console.log("network:" + mywallet.mynetwork);
  klaytn.on('networkChanged', () => setNetworkInfo(klaytn.networkVersion));
 
}

const testTrans = async () => {
  const { klaytn } = window
  if (klaytn === undefined) return
  const caver = new Caver(klaytn);
  
  console.log("call testTrnas myaccnt:" + mywallet.myaccnt );
 
  // 필요한 어드레스 등의 셋팅
  DataTransaction.from = mywallet.myaccnt;
  DataTransaction.amount = 1.0 ; // 시나리오에 정의한 팝콘 소모량 * 글쓰기 시 1팝콘 소모
 
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
    caver.klay
      .sendTransaction({
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
       loadAccountInfo(); // 센드 완료 후 콜백 내에서 불러서 값을 업데이트 함
      })
      .on('receipt', receipt => {
        console.log('receipt', receipt)
      //  this.setState({ receipt: JSON.stringify(receipt) })
      })
      .on('error', error => {
        console.log('error', error)
      //  this.setState({ error: error.message })
      })
    
     
}

const setkaikas = (event) => {
  event.preventDefault();
  
  const { klaytn } = window;

  loadAccountInfo();
  setNetworkInfo();  
};

const handlekaikas = (event) => {
  event.preventDefault();
  
  const { klaytn } = window;

  testTrans();
 
};


const handleSubmit = (event) => {
  event.preventDefault();

  var {uname, upass} = document.forms[0];

  const userData = logindb.find((user) => user.uname === uname.value );

  if ( userData) {
    if(userData.password !== upass.value ) {
     setErrorMessages({name : "upass", message: errors.upass});
     
    } else {
      setIsSubmitted(true);
      sessionStorage.setItem("uname", userData.uname);
    }
  } else {
    setErrorMessages({name : "uname", message: errors.uname });
  }
};

const renderErrorMessage = (name2) => name2 === errorMessages.name && (
  <div className="error">{errorMessages.message}</div>
);

const renderForm = (
    <div className="form">
    <form onSubmit = {handleSubmit}>
     <div className="input-container">
      <label>Nickname</label>
      <input type = "myid" id="uname" name="uname" required />
      {renderErrorMessage("uname")}
     </div>
     <div className="input-container">
      <label>Password</label>
      <input type = "password" id = "upass" name="upass" required />
      {renderErrorMessage("upass")}
     </div>
     <div className="button-container">
      <input type = "submit" value="로그인"/>
     </div>
      <div className="button-container">
          <input type="checkklaytn" value="kaikas" onClick={setkaikas} readOnly />
       </div>
       <label>Wallet address : {accnt} </label>
       <div className="button-container">
          <input type="checkklaytn" value="transaction" onClick={handlekaikas} readOnly/>
       </div>
       <label>Klay : {bal} PCT: {pct} </label>
    </form>
    </div>
  );

  const loggedrenderform = (
    <div className="form">
      <div> : {sessionStorage.getItem("uname")} is successfullly logged in</div>
      <div className="button-container">
          <input type="checkklaytn" value="kaikas" onClick={setkaikas} readOnly />
      </div>
      <label>Wallet address : {accnt} </label>
      <div className="button-container">
         <input type="checkklaytn" value="transaction" onClick={handlekaikas} readOnly/>
      </div>
      <label>Klay : {bal} PCT: {pct} </label>
    </div>
  );

  return (
      <div className="login__container">
        <div className="mytitle">Log In</div>
       {isSubmiited ? loggedrenderform : renderForm}
      </div>
    );
}

export default Login;
