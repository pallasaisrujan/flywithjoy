var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var admin = require("firebase-admin");
var jsdom = require("jsdom");
var JSDOM = jsdom.JSDOM;
global.document = new JSDOM('signup.html').window.document;
const { window } = new JSDOM(`...`);
var JSAlert = require("js-alert");
var serviceAccount = require("C:/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://flywithjoy544.firebaseio.com"
});
var app = express();
var bodyParser = require('body-parser')
app.use( bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use('', express.static(__dirname + '/images'));
app.use('', express.static(__dirname));
app.get('/', function(request, response) {
    response.sendFile('/zzzhtml/signup.html');
});
app.post('/signup_post', function(req, res) {
    var name = req.body.name;
	var email = req.body.email;
    var password = req.body.pass;
    var cnfpass = req.body.cnf_pass;
    var phone = req.body.phone;
    if(password===cnfpass && verifyNull(email,password) && verifyEmail(email,password)){
        createusr(email,phone,password,name);
    }
    else{
        res.sendFile('/zzzhtml/redirect.html');
    }
});
app.listen(3000);
function createusr(em,ph,p,n,){
    admin.auth().createUser({
        email: em,
        emailVerified: false,
        phoneNumber: '+91' + ph,
        password: p,
        displayName: n,
        disabled: false
      })
        .then(function(userRecord) {
          console.log('Successfully created new user:', userRecord.uid);
        })
        .catch(function(error) {
          console.log('Error creating new user:', error);
        });
}
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