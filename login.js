import React from 'react';
import {Link} from "react-router-dom";
import {Redirect} from 'react-router-dom';
import axios from "axios";

class Form extends React.Component {
  
  constructor(props) {
    super(props);
     this.state = {
        email: '',
        pw: '',
        path: 'no path',
        loginmsg: 'Kirjautuminen epäonnistui - salasana tai sähköposti on väärin.',
        userId: '',
        redirect: ''};
   }

  stateHandler = (e) => {
    let stateName = e.target.name;
    this.setState({[stateName]:e.target.value});
  }
  //käyttäjän hakeminen
  handleSubmit = (e) => {
    e.preventDefault();
    axios.post("//localhost:3000/login", {
      email: this.state.email, 
      pw: this.state.pw
    }).then(res => {
      console.log("handleSubmit works");
      const user = res.data;
       if (user !== "no user") {
        user.map((u) => (
          localStorage.setItem('user',u.KayttajaID)
         ));
        this.setState({redirect:<Redirect to={'/profile'}/>});
      }
      else {
          this.setState({redirect:<div><p>{this.state.loginmsg}</p></div>});
       }
    }, error => { console.log(error);});
   }
   //uudelle sivulle ohjaaminen
   renderRedirect = () => {
     if (this.state.user != "no user") {
      this.setState({redirect:<Redirect to={'/profile'}/>});
    }
    else if (this.state.user == "no user") {
        this.setState({redirect:<div><p>{this.state.loginmsg}</p></div>});
     }
   }

   /*getTesti = () => {
     axios.get("http://localhost:3000/Tuote").then( res => {console.log("res: " + res.data)}, error => {console.log(error);});
   }*/
/*
   componentWillReceiveProps(nextProps) {
     this.UpdatePath();
   }*/

   UpdatePath = () => {
    // this.setState({path: pathdata});
    axios.get("http://localhost:3000/getUser").then( res => {
      // console.log("res: " + res.data)
      this.setState({path: res.data})
    },  error => {console.log(error);});
   }

   componentDidMount() {
    //  this.getTesti();
   }

  render() {
    return (
      <form class="login_form form-group" onSubmit={this.handleSubmit} action="">
        <label for="email">Sähköposti</label>
        <input type="email" name="email" class="form-control" onChange={this.stateHandler} required/>
        <label for="pw">Salasana</label>
        <input type="password" name="pw" class="form-control" onChange={this.stateHandler} required/>
        <input type="submit" value="Kirjaudu sisään" class="login_button_white"/>
        {this.state.redirect}
      </form>
    );
  }
}

const login = () => {
      return (
        <section class="login_section">
        <h2>Kirjaudu sisään</h2>
        <section class="login_flex_container">
          <Form/>
          <a href="#">Unohtuiko salasana?</a>
          <div class="login_div">
            <p>Eikö sinulla ole vielä tiliä? Rekisteröidy.</p>
            <Link to='/register'><button class="login_button">Rekisteröidy</button></Link>
          </div>    
        </section>
        </section>
      );
}

export default login;