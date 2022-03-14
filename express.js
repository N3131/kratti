const mysql = require("mysql2");
const express = require("express");

const connection = mysql.createPool({
    host: "kutugang-grandcluster-do-user-8991619-0.b.db.ondigitalocean.com",
    port: 25060,
    user: "doadmin",
    password: "b6mvy7tgoh8p0uqi",
    database: "defaultdb",
  });

const app = express();
//Jennin lisäykset
var cors = require("cors");
const bcrypt = require('bcrypt');
app.use(express.json());
app.use(cors());
//
/*  app.get("/Tuote", function(req,res) {
      connection.getConnection(function(err,connection) {
        connection.query("SELECT * FROM Tuote", function(error, results, fields) {
            if (error) throw error;
            res.send(results);
        });
    });
  }
  );*/
  //hae käyttäjän tiedot
  app.post('/getUser', function(req, res) {
    console.log(req.body.userId);
    connection.getConnection(function(err,connection) {
      connection.query("SELECT * FROM Kayttaja WHERE KayttajaId='"+req.body.userId+"'", function(error, results, fields) {
          if (error) throw error;
          res.json(results);
        });
      });
    }
    );
//sisäänkirjautuminen
app.post('/login', function(req, res) {
  console.log(req.body);
  console.log(req.body.email);
  console.log(req.body.pw);
  const email = req.body.email;
  const pw = req.body.pw;
  //tarkistetaan onko käyttäjää olemassa
  connection.getConnection(function(err,connection) {
    connection.query("SELECT KayttajaID, salasana FROM Kayttaja WHERE Sahkoposti='"+email+"'",function(error, results, fields) {
        if (error)  {
          console.log(err);
          res.sendStatus(500);
          return;
        }
        if (results.length == 1) {
          //tarkistetaan salasana
          bcrypt.compare(pw, results[0].salasana, function(error, response) {
            if (response == true) {
              res.json(results);
              console.log(results);
            }
            else {
              res.send("no user");
            }
              });
              }
        else {
          res.send("no user");
        }
    });
  });
});
//Jos ei syntymäpäivää, asetetaan oletusarvo
function setBdate(date) {
  if (date == '') {
    console.log("no bdate");
    return '1000-01-01';
  }
  else {
    return date;
  }
}
//rekisteröinti
app.post('/registerUser', function(req, res) {
  console.log(req.body);
  const email = req.body.email;
  const lname = req.body.lname;
  const fname = req.body.fname;
  const bdate = setBdate(req.body.bdate);
  const phone = req.body.phone;
  const pw1 = req.body.pw1;
  const pw2 = req.body.pw2;
  
  //syötteiden tarkistus
  if (checkInputs(email, lname, fname, bdate, phone, pw1, pw2)) {
    console.log("valid input");
  //katsotaan onko käyttäjää jo olemassa
  connection.getConnection(function(err,connection) {
    connection.query("SELECT * FROM Kayttaja WHERE Sahkoposti='"+email+"'", function(error, results, fields) {
      if (error)  {
        console.log(err);
        res.sendStatus(500);
        return;
      }
        //Jos ei ole jo sähköpostilla tiliä, luodaan uusi
        if (results < 1) {
          //luodaan KayttajaID, syntymäpäivä oikeaan muotoon?, tarkistetaan vielä salasana, puhnro kaikki yhteen jos ei ole laitettu lomakkeessa, tehdään samat tarkistukset kuin front-endin puolella
          //
          // phone == phone.replace(/ /g, '');
          //TÄMÄN GENEROINTI!!!!!!!!!!!!!!!
          // const KayttajaID = "poisto1";
        
          // console.log("current bdate: "+bdate);

          //salasanan hash
          bcrypt.hash(pw1, 10, (err, hash) => {
          //lisätään tietokantaan
          connection.query("INSERT INTO Kayttaja (Sahkoposti, Salasana, Kirjautumistaso, Etunimi, Sukunimi, Syntymapvm, Puhnro) VALUES ('"+email+"','"+hash+"', 1,'"+fname+"','"+lname+"',(str_to_date('"+bdate+"','%Y-%m-%d')),'"+phone+"')", function(error, results, fields) {
            if (error)  {
              console.log("error1: "+err);
              res.sendStatus(500);
              return;
            } 
            console.log("rekisteröityminen onnistui");
            //lähetä tiedot sisäänkirjautuneisuutta varten
            connection.query("SELECT KayttajaID FROM Kayttaja WHERE Sahkoposti='"+email+"'", function(error, results, fields) {
              if (error)  {
                console.log("error2: "+err);
                res.sendStatus(500);
                return;
              }
              console.log(results);
              res.send(results);
            });
          });
        });
        }
        else {
            console.log("Sähköposti on jo käytössä");
        }
      });
    });
  }
  else {
    console.log("invalid input");
  }
});
//tarkista onko salasana sama
function checkPw(p1, p2) {
  if (p1 == p2) {
    return true;
  }
  else {
    return false;
  }
}
//muokkaa käyttäjän tietoja
app.post('/editUser', function(req, res) {
  console.log(req.body);
  const bdate = setBdate(req.body.bdate);
  
  //Hae käyttäjä tietokannasta
  connection.getConnection(function(err,connection) {
    connection.query("SELECT * FROM Kayttaja WHERE KayttajaID='"+req.body.userId+"'", function(error, results, fields) {
      if (error)  {
        console.log(err);
        res.sendStatus(500);
        return;
      }

        //Tarkistetaan onko käyttäjä olemassa
        if (results.length == 1) {
          //päivitetään tiedot
          connection.query("UPDATE Kayttaja SET Sahkoposti='"+req.body.email+"', Etunimi='"+req.body.fname+"', Sukunimi='"+req.body.lname+"', Syntymapvm=(str_to_date('"+bdate+"','%Y-%m-%d')), Puhnro='"+req.body.phone+"', Tkatuosoite='"+req.body.shippingaddress+"',Tpostinro='"+req.body.spostalcode+"',Tkaupunki='"+req.body.scity+"', Lkatuosoite='"+req.body.billingaddress+"', Lpostinro='"+req.body.bpostalcode+"', Lkaupunki='"+req.body.bcity+"' WHERE KayttajaID='"+req.body.userId+"'", function(error, results, fields) {
            if (error)  {
              console.log("error1: "+error);
              res.sendStatus(500);
              return;
            }
            console.log("muokkaus onnistui");
              console.log(results);
              res.json(results);
            });
          // });
        }
        else {
            console.log("käyttäjää ei löydy");
        }
      });
    });
});

//syötteiden tarkistus
function checkInputs(email, lname, fname, bdate, phone, pw1, pw2) {
  // console.log(/^([a-z0-9]{4,})$/.test('ab1')); 
  // const emailCheck = email.includes("@");
  // const pwCheck = false;
  checkPw(pw1, pw2);
  // const emailPatt =  new RegExp("");

  const emailCheck = /([@])/.test(email);
  // const phoneCheck = /([0-9])/.test(phone);
  const pw1Check = /([A-Za-z0-9~!@#$%/><,.?-_*^+|]{6,50})/.test(pw1);

  console.log("emailCheck: "+emailCheck);
  // console.log("phoneCheck: "+phoneCheck);
  console.log("pw1Check: "+pw1Check);
  console.log("checkPw: "+checkPw(pw1, pw2));
  //jos syötteet oikeassa muodossa, annetaan ohjelman jatkaa
  if (emailCheck && pw1Check && checkPw(pw1, pw2)) {
    return true;
  }
  else {
    return false;
  }
};

app.listen(3000, ()=> {
    console.log("http://localhost:3000/Tuote");
    console.log("http://localhost:3000/login");
})

//lähteet
//https://www.tutorialspoint.com/expressjs/expressjs_database.htm
//https://masteringjs.io/tutorials/express/file-upload
//https://blog.logrocket.com/axios-or-fetch-api/
//https://www.freecodecamp.org/news/create-a-react-frontend-a-node-express-backend-and-connect-them-together-c5798926047c/
//https://www.codespot.org/hashing-passwords-in-nodejs/
