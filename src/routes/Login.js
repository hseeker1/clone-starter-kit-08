import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './Login.css';
import caver from 'caver-js'


function Login() {

const [errorMessages, setErrorMessages] = useState({});
const [isSubmiited, setIsSubmitted] = useState(false);

const logindb = [
  {
    uname : "sohan1",
    password : "pass1"
  },
  {
    uname : "sohan2",
    password : "pass2"
  }
];

const errors = {
  uname: "invalide username",
  upass: "invalid password"
};

const handlekaikas = (event) => {
  event.preventDefault();
  const { klaytn } = window

  if (klaytn) {
    try {
      klaytn.enable()
      this.setAccountInfo(klaytn)
      klaytn.on('accountsChanged', () => this.setAccountInfo(klaytn))
    } catch (error) {
      console.log('User denied account access')
    }
  } else {
    console.log('Non-Kaikas browser detected. You should consider trying Kaikas!')
  }

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

const renderErrorMessage = (name) => name === errorMessages.name && (
  <div className="error">{errorMessages.message}</div>
);

  const renderForm = (
    <div className="form">
    <form onSubmit = {handleSubmit}>
     <div className="input-container">
      <label>Nickname</label>
      <input type = "myid" name="uname" required />
      {renderErrorMessage("uname")}
     </div>
     <div className="input-container">
      <label>Password</label>
      <input type = "password" name="upass" required />
      {renderErrorMessage("upass")}
     </div>
     <div className="button-container">
      <input type = "submit" />
     </div>
      <div className="button-container">
          <input type="button" onClick={handlekaikas}/>
       </div>
    </form>
    </div>
  );

  return (
    <div className="login__container">
      <div className="mytitle">Log In</div>
      {isSubmiited ? <div>User is successfullly logged in</div> : renderForm}
    </div>
  );
}

export default Login;
