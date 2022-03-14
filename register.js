import React from 'react';
import {Redirect} from 'react-router-dom';
import axios from "axios";

class Feedback extends React.Component {
    render() {
    return (
        <div class="invalid-feedback">
        Tämä kenttä on pakollinen.
        </div>
      );
    }
}

class PasswordFeedback extends React.Component {
 
  render() {
  return (
      <div class="invalid-feedback">
      {this.props.data}
      </div>
    );
  }
}

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      lname: '',
      fname: '',
      bdate: '',
      phone: '',
      pw1: '',
      pw2: '',
      feed: 'Tämä kenttä on pakollinen.',
      redirect: '',
      action: 'javascript:void(0);'};
  }

  stateHandler = (e) => {
    let stateName = e.target.name;
    this.setState({[stateName]:e.target.value});
  }
/*
  checkPassword = () => {
    if(this.state.pw1==this.state.pw2 && this.state.pw1.length>=6) {
      this.setState({feed:""});
      this.setState({action:"/profile"});

    }
    else if (this.state.pw1.length<6) {
      this.setState({feed:"Salasana on liian lyhyt"});
    }
    else {
      this.setState({feed:"Salasanat eivät täsmää"});
    }
  }*/

registerUser = () => {
  axios.post("http://localhost:3000/registerUser", {
    email: this.state.email,
    lname: this.state.lname,
    fname: this.state.fname,
    bdate: this.state.bdate,
    phone: this.state.phone,
    pw1: this.state.pw1,
    pw2: this.state.pw2
  }).then(res => {
    console.log("registerUser works");
    const user = res.data;
      user.map((u) => (
        localStorage.setItem('user', u.KayttajaID)
       ));
      this.setState({redirect:<Redirect to={'/profile'}/>});
  }, error => { console.log(error);});
}

  redirectUser = () => {
    axios.get("http://localhost:3000/registerComplete").then( res => {
      // console.log("res: " + res.data)
      this.setState({path: res.data})
    },  error => {console.log(error);});
  }

  render() {
    return (
      <form class="login_form was-validated" onSubmit={this.registerUser} action={this.state.action}>
      <label for="email">Sähköpostiosoite*</label>
      <input type="email" name="email" class="form-control is-invalid" placeholder="esimerkki@email.com" onChange={this.stateHandler} required/>
      <Feedback/>
      <label for="fname">Etunimi*</label>
      <input type="text" name="fname" class="form-control is-invalid" onChange={this.stateHandler} required/>
      <Feedback/>
      <label for="lname">Sukunimi*</label>
      <input type="text" name="lname" class="form-control is-invalid" onChange={this.stateHandler} required/>
      <Feedback/>
      <label for="bdate">Syntymäaika</label>
      <input type="date" name="bdate" class="form-control" onChange={this.stateHandler}/>
      <label for="phone">Matkapuhelinnumero</label>
      <input type="tel" name="phone" class="form-control" placeholder="" onChange={this.stateHandler}/>
      <label for="pw">Salasana (vähintään 6 merkkiä)*</label>
      <input type="password" name="pw1" id="pw1" class="form-control is-invalid " onChange={this.stateHandler} /*pattern="[A-Za-z0-9~!@#$%/()[]{}><,.?-_*^+|]{6}"*/ title="hyväksytään vain a-z 0-9 ~!@#$%/><,.?-_*^+|" required/>
      <PasswordFeedback data={this.state.feed}/>
      <label for="pw2">Salasana uudelleen*</label>
      <input type="password" name="pw2" id="pw2" class="form-control is-invalid" onChange={this.stateHandler} /*pattern="[A-Za-z0-9~!@#$%/()[]{}><,.?-_*^+|]{6}"*/ title="hyväksytään vain a-z 0-9 ~!@#$%/><,.?-_*^+|" required/>
      <PasswordFeedback data={this.state.feed}/>
      <div class="register-check form-check">
      <input type="checkbox" class="" name="tos" required/>
      <label for="tos">Hyväksyn <a href="#">käyttöehdot</a>*</label>
      {/* <Feedback/> */}
      </div>
      <div class="register-check">
      <input type="checkbox" class="" name="mails"/>
      <label for="mails" class="">Haluan sähköpostiini mainoskirjeitä Kratin uusimmista tuotteista ja tarjouksista.</label>
      </div>
      <input type="submit" value="Rekisteröidy" class="login_button_white"/>
      {this.state.redirect}
  </form> 
    )
  }
}

const register = () => {
      return (
        <section class="login_section">
        <h2>Rekisteröidy</h2>
        <section class="login_flex_container">
        <Form />
        </section>
        </section>
      );
}

export default register;