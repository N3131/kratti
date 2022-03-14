import React from 'react';
import {Link} from "react-router-dom";
import {Redirect} from 'react-router-dom';
import axios from "axios";

class Form extends React.Component {
    constructor(props) {
        super(props);
         this.state = {
             userId: '',
             email: '',
             lname: '',
             fname: '',
             bdate: '',
             phone: '',
             billingaddress: '',
             bpostalcode: '',
             bcity: '',
             shippingaddress: '',
             spostalcode: '',
             scity: '',
             redirect: '',
            };
       }
       //hae käyttäjä ja käyttäjän tiedot
       getUser = () => {
        const loggedInUser = localStorage.getItem("user");
         this.setState({userId: loggedInUser});
         console.log(loggedInUser);
         axios.post("http://localhost:3000/getUser", {
             userId: loggedInUser
             }).then(res => {
             console.log("getUser works");
             const user = res.data;
            user.map((u) => (
                 this.setState({
                     fname: u.Etunimi,
                     lname: u.Sukunimi,
                     email: u.Sahkoposti,
                     bdate: u.Syntymapvm.substring(0,10),
                     phone: u.Puhnro,
                     billingaddress: u.Lkatuosoite,
                     bpostalcode: u.Lpostinro,
                     bcity: u.Lkaupunki,
                     shippingaddress: u.Tkatuosoite,
                     spostalcode: u.Tpostinro,
                     scity: u.Tkaupunki,
         })
        ));
   }, error => { console.log(error);});
     }
     //tallenna muutokset
    editUser = (e) => {
        e.preventDefault();
        console.log("editUser");
        axios.post("http://localhost:3000/editUser", {
            userId: this.state.userId,
            email:  this.state.email,
            lname:  this.state.lname,
            fname:  this.state.fname,
            bdate:  this.state.bdate,
            phone:  this.state.phone,
            billingaddress:  this.state.billingaddress,
            bpostalcode:  this.state.bpostalcode,
            bcity:  this.state.bcity,
            shippingaddress:  this.state.shippingaddress,
            spostalcode:  this.state.spostalcode,
            scity:  this.state.scity
        }).then(res => {
          console.log("editUser works");
            this.setState({redirect:<Redirect to={'/profile'}/>});
        }, error => { console.log(error);});
      }

      //päivitä state kenttien muutosten mukaan
     handleChange = (e) => {
        //  e.preventDefault();
        let stateName = e.target.name;
        this.setState({[stateName]:e.target.value});
     }
 
     componentDidMount(){
         this.getUser();
     }

    render() {
        return (
            <form onSubmit={this.editUser} action="">
                <label for="fname">Etunimi</label>
                <input type="text" name="fname" class="form-control" value={this.state.fname}
    onChange={this.handleChange} required/>
                <label for="lname">Sukunimi</label>
                <input type="text" name="lname" class="form-control" value={this.state.lname}
    onChange={this.handleChange} required/>
               <label for="email">Sähköpostiosoite</label>
                <input type="email" name="email" class="form-control" value={this.state.email}
    onChange={this.handleChange} required/>
                <label for="phone">Puhelinnumero</label>
                <input type="text" name="phone" value={this.state.phone} onChange={this.handleChange}class="form-control"/>
                <label for="bdate">Syntymäaika</label>
                <input type="date" name="bdate" value={this.state.bdate} onChange={this.handleChange} class="form-control"/>
                <label for="customer-id">Asiakasnumero</label>
                <p>123456789</p>
                <label>Laskutusosoite</label>
                <div class="profile_addr">
                <div>
               <label for="billingaddress">Lähiosoite</label>
                <input type="text" name="billingaddress" value={this.state.billingaddress} onChange={this.handleChange} class="form-control"/>
                </div>
                <div>
                <label for="b-postal-code">Postinumero</label>
                <input type="text" /*pattern="[0-9]{5,18}"*/ name="bpostalcode" value={this.state.bpostalcode} onChange={this.handleChange} class="form-control"/>
                </div>
                <div>
                <label for="bcity">Kaupunki</label>
                <input type="text" name="bcity" value={this.state.bcity} onChange={this.handleChange}class="form-control"/>
                </div>
                </div>
                 <label>Toimitusosoite</label>
                 <div class="profile_addr">
                <div>
                 <label for="shippingaddress">Lähiosoite</label>
                <input type="text" name="shippingaddress" value={this.state.shippingaddress} onChange={this.handleChange} class="form-control"/>
                </div>
                <div>
                <label for="spostalcode">Postinumero</label>
                <input type="text" /*pattern="[0-9]{5,18}"*/ name="spostalcode" value={this.state.spostalcode} onChange={this.handleChange} class="form-control"/>
                </div>
                <div>
                <label for="scity">Kaupunki</label>
                <input type="text" name="scity" value={this.state.scity} onChange={this.handleChange}class="form-control"/>
                </div>
        </div>
                <input type="submit" value="Tallenna" class="login_button margin mt-5" />
                {this.state.redirect}
            </form>
        );
    }
}

const profileEdit = () => {
    return(
        <section class="profile login_section">
        <h2>Profiili</h2>
        <div class="profile_info_area">
            <h3>Tiedot</h3>
            <div class="profile_info">
            <Form/>
            </div>
        </div>
    </section>
    );
}

export default profileEdit;