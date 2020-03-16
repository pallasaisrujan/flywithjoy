var express = require('express');
var ejs = require('ejs');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var firebase = require("firebase");
var admin = require("firebase-admin");
var serviceAccount = require("C:/serviceAccountKey.json");
var firebaseConfig = {
    apiKey: "AIzaSyAAnftr_V41781WmnBhjBUoNoaFqDryMBU",
    authDomain: "flywithjoy544.firebaseapp.com",
    databaseURL: "https://flywithjoy544.firebaseio.com",
    projectId: "flywithjoy544",
    storageBucket: "flywithjoy544.appspot.com",
    messagingSenderId: "388580664614",
    appId: "1:388580664614:web:1a66523e8db00cb903cde7",
    measurementId: "G-15EHGWBNH8"
  };
firebase.initializeApp(firebaseConfig);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://flywithjoy544.firebaseio.com"
});
var app = express();
var bodyParser = require('body-parser')
app.use( bodyParser.json());
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: true })); 
app.use('', express.static(__dirname + '/images'));
app.use('', express.static(__dirname));
app.get('/', function(request, response) {
	response.redirect('login.html');
});
global.usrrcd;
global.name1;
global.email1;
global.phone1;
app.post('/login_post', function(req, res) {
	var email = req.body.email;
  var password = req.body.pass;
  admin.auth().getUserByEmail(email)
        .then(function(userRecord) {
          usrrcd = userRecord;
          name1 = usrrcd.displayName;
          email1 = usrrcd.email;
          phone1 = usrrcd.phoneNumber;
          firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            });
            setTimeout(fun2, 3000);
            function fun2(){
            firebase.auth().onAuthStateChanged(function(user) {
              if (user) {
                res.render('/zzzhtml/home.ejs');
              } else {
                res.redirect('redirect2.html');
              }
              });
            }
        })
        .catch(function(error) {
          console.log('Error fetching user data:', error);
        });
});
app.post('/nav_home', function(req,res) {
  res.render('/zzzhtml/home.ejs');
});
app.post('/nav_profile', function(req,res) {
  res.render('/zzzhtml/profile.ejs');
});
app.post('/nav_booking', function(req,res) {
  res.render('/zzzhtml/booking.ejs');
});
app.post('/nav_pnr', function(req,res) {
  res.render('/zzzhtml/pnr_enq.ejs');
});
global.pnr_dt;
global.pnr_fn;
global.pnr_pag;
global.pnr_pgen;
global.pnr_pnam;
global.pnr_pnati;
global.pnr_psea;
global.pnr_tkid;
global.pnr_pag2;
global.pnr_pgen2;
global.pnr_pnam2;
global.pnr_pnati2;
global.pnr_psea2;
global.len5;
global.pnr_pfrom;
global.pnr_pto;
app.post('/pnr_chk', function(req,res) {
  pnr_pag = [];
  pnr_pgen = [];
  pnr_pnam = [];
  pnr_pnati = [];
  pnr_psea = [];
  var pnr = req.body.pnrnum;
  var ref = admin.app().database().ref();
  var pnrref = ref.child("/tickets/" + pnr);
  pnrref.once("value").then(function(snapshot){
    var tktd = snapshot.val();
    pnr_dt = tktd.dt_tvl;
    pnr_fn = tktd.fName;
    pnr_tkid = tktd.tktid;
    pnr_pfrom = tktd.pfrom;
    pnr_pto = tktd.pto;
    if(Array.isArray(tktd.psngr_ages)){
      for(var a=0;a<tktd.psngr_ages.length;a++){
        pnr_pag.push(tktd.psngr_ages[a]);
        pnr_pgen.push(tktd.psngr_genders[a]);
        pnr_pnam.push(tktd.psngr_names[a]);
        pnr_pnati.push(tktd.psngr_nations[a]);
        pnr_psea.push(tktd.seats[a]);
      }
    }
    else{
      pnr_pag.push(tktd.psngr_ages);
        pnr_pgen.push(tktd.psngr_genders);
        pnr_pnam.push(tktd.psngr_names);
        pnr_pnati.push(tktd.psngr_nations);
        pnr_psea.push(tktd.seats);
    }
    pnr_pag2 = JSON.stringify(pnr_pag);
    pnr_pgen2 = JSON.stringify(pnr_pgen);
    pnr_pnam2 = JSON.stringify(pnr_pnam);
    pnr_pnati2 = JSON.stringify(pnr_pnati);
    pnr_psea2 = JSON.stringify(pnr_psea);
    len5 = pnr_pnam.length;
    //console.log(pnr_pnam);
    res.render('/zzzhtml/pnr_result.ejs');
  });
});
global.bdate;
global.bname;
global.bid;
global.i3;
global.n3;
global.bdate2;
global.bname2;
global.bid2;
global.len3;
app.post('/nav_mybook', function(req,res) {
  var ref = admin.app().database().ref();
  bdate = [];
  bname = [];
  bid = [];
  i3 = 0;
  var b1ref = ref.child("/tickets");
  b1ref.orderByChild('usr_booked').equalTo(email1).once("value").then(function(snapshot){
    tkts_booked = snapshot.val();
    var keys = Object.keys(tkts_booked);
    //console.log(keys,seats_booked);
    for (var g=0;g<keys.length;g++){
      var tmp = ref.child("/tickets/" + keys[g]);
      tmp.once("value").then(function(snapshot){
        var tmp2 = snapshot.val();
        //console.log(tmp2);
        bdate.push(tmp2.dt_tvl);
        bname.push(tmp2.fName);
        bid.push(tmp2.tktid);
        //console.log(sts);
        bdate2 = JSON.stringify(bdate);
        bname2 = JSON.stringify(bname)
        bid2 = JSON.stringify(bid);
        len3 = bdate.length;
      });
    }
  });
  setTimeout(() => {
    res.render('/zzzhtml/mybookings.ejs');
  },5000);
});
global.chosenf;
global.seats_booked;
global.sts;
global.sts2;
app.post('/proceed_book', function(req,res) {
  chosenf = req.body.select_c;
  sts = [];
  var ref = admin.app().database().ref();
  var tktref = ref.child("/tickets");
  tktref.orderByChild('dt_tvl').equalTo(tvldt).once("value").then(function(snapshot){
    seats_booked = snapshot.val();
    var keys = Object.keys(seats_booked);
    //console.log(keys,seats_booked);
    for (var z=0;z<keys.length;z++){
      var tmp = ref.child("/tickets/" + keys[z]);
      tmp.once("value").then(function(snapshot){
        var tmp2 = snapshot.val();
        //console.log(tmp2);
        if(Array.isArray(tmp2.seats)){
          for(var x=0;x<tmp2.seats.length;x++){
            if(tmp2.fName == chosenf && tmp2.pfrom == from1 && tmp2.pto == to1){
              sts.push(tmp2.seats[x]);
            }
          }
        }
        else{
          if(tmp2.fName == chosenf  && tmp2.pfrom == from1 && tmp2.pto == to1){
            sts.push(tmp2.seats);
          }
        }
        //console.log(sts);
        sts2 = JSON.stringify(sts);
      });
    }
  });
  setTimeout(() => {
    res.render('/zzzhtml/seat_select.ejs');
  },3000);
});
function randomInt(low, high) {
  return Math.floor(Math.random() * (high - low) + low)
}
global.tktid1;
global.seats1;
global.ntkts;
app.post('/pass_details', function(req,res) {
  seats1 = req.body.seat;
  if(Array.isArray(seats1)){
    ntkts = seats1.length;
  }
  else{
    ntkts = 1;
  }
  //email1
  //console.log(seats1);
  //console.log(ntkts);
  tktid1 = randomInt(10000000,99999999);
  res.render('/zzzhtml/pass_det.ejs');
});
app.post('/cnf_book', function(req,res) {
  var ps_names = req.body.name;
  var ps_ages = req.body.age;
  var ps_nations = req.body.nation;
  var ps_genders = req.body.gender;
  var ref = admin.app().database().ref();
  var tktref = ref.child("/tickets/" + tktid1);
  tktref.set({
    seats: seats1,
    tktid: tktid1,
    usr_booked:email1,
    dt_tvl:tvldt,
    psngr_names: ps_names,
    psngr_ages: ps_ages,
    psngr_nations: ps_nations,
    psngr_genders: ps_genders,
    fName: chosenf,
    pfrom: from1,
    pto: to1
  });
  res.render('/zzzhtml/success_tkt.ejs');
});
global.pcode = [];
global.pdisc = [];
global.pcode2;
global.pdisc2;
global.i2;
global.n2;
global.pref2;
global.len2;
app.post('/nav_promo', function(req,res) {
  var ref = admin.app().database().ref();
  pcode = [];
  pdisc = [];
  i2 = 0;
  var p1ref = ref.child("/promocodes");
  p1ref.once('value').then(function(snapshot) { 
      n2 = snapshot.numChildren();
      for(i2=1;i2<n2+1;i2++){
        var pref = ref.child("/promocodes/" + i2);
        pref.once("value").then(function(snapshot) {
          pref2 = snapshot.val();
              pcode.push(pref2.Code);
              pdisc.push(pref2.Discount);
            pcode2 = JSON.stringify(pcode);
            pdisc2 = JSON.stringify(pdisc);
            //console.log(pcode2);
            len2 = pcode.length;
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });
        }//end of for
      setTimeout(() => {
        res.render('/zzzhtml/promocode.ejs'); 
      },3000);
      });
});
global.fname = [];
global.ffrom = [];
global.fto = [];
global.fdep = [];
global.farr = [];
global.fprc = [];
global.i = 0;
global.fref2;
global.len;
global.fname2;
global.ffrom2;
global.fto2;
global.fdep2;
global.farr2;
global.fprc2;
global.n;
global.tvldt;
global.from1;
global.to1;
app.post('/search_flights', function(req,res) {
  from1 = req.body.from;
  to1 = req.body.to;
  var cls = req.body.class;
  tvldt = req.body.date;
  //console.log(tvldt);
  var ref = admin.app().database().ref();
  fname = [];
  ffrom = [];
  fto = [];
  fdep = [];
  farr = [];
  fprc = [];
  i = 0;
  var f1ref = ref.child("/flights");
  f1ref.once('value').then(function(snapshot) { 
      n = snapshot.numChildren();
      for(i=1;i<n+1;i++){
        var fref = ref.child("/flights/" + i);
        fref.once("value").then(function(snapshot) {
          fref2 = snapshot.val();
          //console.log("enter for" +i);
          //console.log(fref2.flightName);
            //console.log(fref2,from1,to1);
            if((fref2.From == from1) && (fref2.To == to1) && (fref2.Class == cls)){
              fname.push(fref2.flightName);
              ffrom.push(fref2.From);
              fto.push(fref2.To);
              fdep.push(fref2.Departure);
              farr.push(fref2.Arrival);
              fprc.push(fref2.price);
              //console.log("in push if");
            }
            fname2 = JSON.stringify(fname);
            ffrom2 = JSON.stringify(ffrom);
            fto2 = JSON.stringify(fto);
            fdep2 = JSON.stringify(fdep);
            farr2 = JSON.stringify(farr);
            fprc2 = JSON.stringify(fprc);
            len = fname.length;
            //console.log(i,fname[i]);
            //console.log(fname.length);
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });
        }//end of for
      //console.log(fname);
      //console.log("out of for");
      //i = 0;
      //console.log(len);
      setTimeout(() => {
        res.render('/zzzhtml/search.ejs'); 
      },6000);
    //console.log(fname);
      });
});
app.post('/edit', function(req,res) {
  res.render('/zzzhtml/profile_edit.ejs');
});
app.post('/verify', function(req,res) {
  firebase.auth().currentUser.sendEmailVerification();
  res.render('/zzzhtml/profile.ejs',{usrrcd1:usrrcd});
});
app.post('/save', function(req,res) {
  name1 = req.body.fullname;
  email1 = usrrcd.email;
  phone1 = req.body.phone;
  var ref = admin.app().database().ref();
  var usrref = ref.child("/users/" + usrrcd.uid);
  usrref.update({
    name: name1,
    phoneNumber:phone1
    });
  admin.auth().updateUser(usrrcd.uid, {
    displayName:name1,
    phoneNumber: phone1
 })
.then(function(userRecord) {
   //
})
.catch(function(error) {
   //
});
  res.render('/zzzhtml/profile.ejs');
});
app.post('/signup_post', function(req, res) {
    var name = req.body.name;
	var email = req.body.email;
    var password = req.body.pass;
    var cnfpass = req.body.cnf_pass;
    var phone = req.body.phone;
    if(password===cnfpass && verifyNull(email,password) && verifyEmail(email,password)){
    //user creation module
    admin.auth().createUser({
      email: email,
      emailVerified: false,
      phoneNumber: '+91' + phone,
      password: password,
      displayName: name,
      disabled: false
    })
      .then(function(userRecord) {
        console.log('Successfully created new user:', userRecord.uid);
        admin.auth().getUserByEmail(email)
        .then(function(userRecord) {
          var ref = admin.app().database().ref();
          var usrref = ref.child("/users/" + userRecord.uid);
          usrref.set({
            name: name,
            email: email,
            phoneNumber:phone
          });
        })
        .catch(function(error) {
          console.log('Error fetching user data:', error);
        });
        res.redirect('redirect3.html'); //user creation success
      })
      .catch(function(error) {
        res.redirect('redirect5.html'); //user creation failed
      });
      //user creation module end
    }
    else{
        res.redirect('redirect.html');
    }
});
function verifyNull(em,pa){
    if(!em.length){
        alert('Please enter email');
    }
    else if(!pa.length){
        alert('Please enter password');
    }
    else {
        return true;
    }
}
function verifyEmail(em){
    var x = em;
    var atpos = x.indexOf("@");
    var dotpos = x.lastIndexOf(".");
    if (atpos< 1 || dotpos<atpos+2 || dotpos+2>=x.length) {
        alert("Not a valid e-mail address");
        return false;
    }
    else {
        return true;
    }
}
var emailAddress;//reset email
app.post('/pass_reset_link', function(req, res) {
  var auth = firebase.auth();
  emailAddress = req.body.email;
  
  auth.sendPasswordResetEmail(emailAddress).then(function() {
    // Email sent.
    res.redirect("redirect7.html");
  }).catch(function(error) {
    // An error happened.
  });
});
app.post('/upd_passwd', function(req, res) {
  var usrid;
  var ps = req.body.pass;
  admin.auth().getUserByEmail(emailAddress)
        .then(function(userRecord) {
          usrid = userRecord.uid;
          admin.auth().updateUser(usrid, {
            password: ps
          })
            .then(function(userRecord) {
              //
              console.log("updating password");
              res.redirect("redirect6.html");
            })
            .catch(function(error) {
              //
              console.log("Error updating password");
            });
        })
        .catch(function(error) {
          console.log('Error fetching user data:', error);
        });
});
app.post('/logout', function(req, res) {
	firebase.auth().signOut().then(function() {
		// Sign-out successful.
	  }).catch(function(error) {
		// An error happened.
    });
    res.redirect('login.html');
});
app.listen(3000);