const admin = require("firebase-admin");
// const firebase = require('firebase/app');
// require("firebase/database");
const serviceAccount = require("./fornida-6f0cf-firebase-adminsdk-5sfkg-bb895b6084.json");


// x
// if (firebase.apps === undefined) {
  // firebase.initializeApp({
  //     credential: firebase.credential.cert(serviceAccount),
  //   databaseURL: "https://fornida-6f0cf.firebaseio.com"
  // });
// }

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://fornida-6f0cf.firebaseio.com'
});

const db = admin.database();
const buildsRef = db.ref().child('stashed');
const fb = {
    write: function (loc, data) {
      db.ref(loc).set(data);
    },
    post: function (loc, data) {
      var newPostKey = db.ref().child(loc).push().key;
      data['id'] = newPostKey;
      this.write(loc + '/' + newPostKey, data);
    },
    subscribe: function (loc) {
      return db.ref(loc);
    },
    read: function (loc) {
      return db.ref(loc).once('value').then(function (snapshot) {
          return snapshot.val();
      });
    },
    remove: function (loc) {
      console.log('removing: ', loc);
      db.ref(loc).remove();
      db.ref(loc).set(null);
    }
}

module.exports = fb;