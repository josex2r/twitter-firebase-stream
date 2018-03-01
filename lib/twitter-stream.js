const twitter = require('./twitter-client');
const firebase = require('./firebase-client');

let stream;

// Default timeout '2m'
module.exports = function initStream(hashtag, timeout = 120000) {
  if (!hashtag) {
    return;
  }

  if (stream) {
    stream.destroy();
  }

  stream = twitter.stream('statuses/filter', { track: hashtag });
  
  stream.on('data', (event) => {
    if (event) {
      // Check tweet geolocation
      if (!event.coordinates || event.coordinates.type !== 'Point') {
        event.coordinates = {
          coordinates: [0, 0]
        }
      }
      // Check if tweet is valid
      if (event.text) {
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
  });

  stream.on('error', (error) => {
    console.error(error);
    // Wait 10s to restart the stream
    setTimeout(() => initStream(hashtag, timeout), 10000);
  });

  // Stop streaming after timeout
  setTimeout(() => {
    stream.destroy();
    stream = null;
  }, timeout);

  return stream;
}
