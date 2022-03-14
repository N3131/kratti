import React from 'react';
import profilepic from '../kuvat/default-profile-pic.png';
import ProfilePic from './ProfilePic';
import {Link} from "react-router-dom";
import axios from "axios";
//Muokkaa-painike
class EditButton extends React.Component {
    render() {
        return (
            <Link to="/ProfileEdit" style={{ textDecoration: 'none' }}><button>Muokkaa</button></Link>
        );
    }
}
//vaihda salasanaa-painike
class PasswordButton extends React.Component {
    render() {
        return (
            <Link to="/ChangePassword" style={{ textDecoration: 'none' }}><button>Vaihda salasanaa</button></Link>
        );
    }
}
//profiilin tiedot
class ProfileInfo extends React.Component {
    constructor(props) {
        super(props);
         this.state = {
             userId: 'ei asiakasnumeroa',
             email: 'ei sähköpostia',
             lname: 'ei etunimeä',
             fname: 'ei sukunimeä',
             bdate: 'ei annettu',
             phone: 'ei annettu',
             billingaddress: 'ei osoitetta',
             bpostalcode: '',
             bcity: '',
             shippingaddress: 'ei osoitetta',
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
                    fname: '' ? 'ei nimeä' : u.Etunimi,
                    lname: '' ? 'ei nimeä' : u.Sukunimi,
                    email: '' ? 'ei sähköpostia' : u.Sahkoposti,
                    bdate: '' ? 'ei syntymäpäivää' : u.Syntymapvm.substring(0, 10),
                    phone: ' ' ? 'ei numeroa' : u.Puhnro,
                    billingaddress: u.Lkatuosoite,
                    bpostalcode: u.Lpostinro,
                    bcity: u.Lkaupunki,
                    shippingaddress: u.Tkatuosoite,
                    spostalcode: u.Tpostinro,
                    scity: u.Tkaupunki
        })
       ));
       
  }, error => { console.log(error);});
    }

    componentDidMount(){
        this.getUser();
    }

    render() {
        return (
            <div>
                <div class="profile_info">
                    <div>
                    <label for="name">Nimi</label>
                    <p name="name">{this.state.fname} {this.state.lname}</p>
                    </div>
                    <div>
                    <label for="email">Sähköposti</label>
                    <p name="email">{this.state.email}</p>
                    </div>
                    <div>
                    <label for="phone">Puhelinnumero</label>
                    <p name="phone">{this.state.phone}</p>
                    </div>
                    <div>
                    <label for="birth-date">Syntymäaika</label>
                    <p name="birth-date">{this.state.bdate}</p>
                    </div>
                    <div>
                    <label for="customer-id">Asiakasnumero</label>
                    <p name="customer-id">{this.state.userId}</p>
                    </div>
                </div>
                <div class="profile_info">
                    <div>
                    <label for="billing-address">Laskutusosoite</label>
                    <p name="billing-address">{this.state.billingaddress} {this.state.bpostalcode} {this.state.bcity}</p>
                    </div>
                    <div>
                    <label for="shipping-address">Toimitusosoite</label>
                    <p name="shipping-address">{this.state.shippingaddress} {this.state.spostalcode} {this.state.scity}</p>
                    </div>
                    <div class="profile_button_container">
                    <PasswordButton/>
                    <EditButton/>
                    </div>
                </div>
            </div>
        );
    }
}

const profile = () => {
    return(
        <section class="profile login_section">
        <h2>Profiili</h2>
        <div class="profile_info_area">
            <h3>Tiedot</h3>
            <Link to="/ChangeProfilePic" style={{ textDecoration: 'none' }} data-toggle="tooltip" data-placement="bottom" title="Vaihda profiilikuva"><ProfilePic/></Link>
            <ProfileInfo/>
        </div>
    </section>
    );
}

export default profile;