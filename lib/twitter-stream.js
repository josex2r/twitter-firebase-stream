const twitter = require('./twitter-client');
const firebase = require('./firebase-client');

module.exports = function initStream(hashtag) {
  if (!hashtag) {
    return;
  }
  
  // Listen twitter stream
  // ...
  // return stream;
}
