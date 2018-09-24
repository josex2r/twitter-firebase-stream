const firebase = require('firebase');	

module.exports = firebase.initializeApp({	
  apiKey: process.env.FIREBASE_API,	
  authDomain: process.env.FIREBASE_AUTH,	
  databaseURL: process.env.FIREBASE_DATABASE,	
  storageBucket: process.env.FIREBASE_STORAGE,	
  messagingSenderId: process.env.FIREBASE_MESSAGING,	
  projectId: process.env.FIREBASE_PROJECT	
});
