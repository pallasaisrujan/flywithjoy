
var admin = require("firebase-admin");
var firebase = require("firebase");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://flywithjoy544.firebaseio.com"
});
var ref = admin.database().ref('users');
ref.on("value", function(snapshot) {
    console.log(snapshot.val());
 }, function (error) {
    console.log("Error: " + error.code);
 });