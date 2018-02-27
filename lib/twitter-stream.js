const twitter = require('./twitter-client');
const firebase = require('./firebase-client');

let stream;
// Default timeout '5m'
module.exports = function initStream(hashtag, timeout = 300000) {
  if (!hashtag) {
    return;
  }

  // Stop current stream
  if (stream) {
    stream.destroy();
  }

  stream = twitter.stream('statuses/filter', { track: hashtag });
  
  stream.on('data', (event) => {
    if (event) {
      // Check if tweet is valid
      if (typeof event.contributors === 'object' && typeof event.id_str === 'string' && event.text) {
        // Check if tweet has geolocation
        if (event.coordinates && event.coordinates.type === 'Point') {
          const [lng, lat] = event.coordinates.coordinates;
          const tweet = {
            lat,
            lng,
            text: event.text,
            user: event.user.screen_name,
            img: event.user.profile_image_url
          }

          // Store tweet in firebase
          firebase.database().ref(`tweets/${hashtag}`).push(tweet).then(() => {
            console.log('Tweet saved!', tweet);
          }, () => {
            console.error('There was an error storing the tweet');
          });
        }
      }
    }
  });

  stream.on('error', (error) => {
    console.error(error);
    initStream(hashtag, timeout);
  });

  setTimeout(() => stream.stop(), timeout);

  return stream;
}
