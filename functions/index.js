const functions = require('firebase-functions');
const admin = require("firebase-admin");

admin.initializeApp(functions.config().firebase);

exports.fcmSend = functions.firestore.document('/messages/{messageId}').onCreate(event => {

  const message = event.data.data();
  const userId  = message.userId
  const payload = {
        notification: {
          title: message.title,
          body: message.body,
          icon: "http://www.clubimpulsotri.es/app/img/favicon.png"
        }
      };
      
      admin.firestore().collection(`/fcmTokens/`).doc(`${userId}`).get()
        .then(token => {
          return admin.messaging().sendToDevice(token.data().token, payload)
        })
        .then(res => {
          console.log("Sent Successfully", res);
        })
        .catch(err => {
          console.log(err);
        });
        
});