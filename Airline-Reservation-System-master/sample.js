var express = require('express');
var ejs = require('ejs');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var bodyParser = require('body-parser')
app.use( bodyParser.json());
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: true })); 
app.use('', express.static(__dirname + '/images'));
app.use('', express.static(__dirname));
global.name1;
name1 = "nithin";
global.tktid1;
tktid1 = 88888888
app.get('/', function(request, response) {
	response.render('/zzzhtml/success_tkt.ejs');
});
app.listen(3000);