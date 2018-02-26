const twitter = require('./twitter-client');
const firebase = require('./firebase-client');

const HASHTAG = 'food';

module.exports = function init() {
  const stream = twitter.stream('statuses/filter', { track: HASHTAG });

  stream.on('data', (event) => {
    if (event) {
        // Check if tweet is valid
        if (typeof event.contributors === 'object' && typeof event.id_str === 'string' && event.text) {
          // console.log(event)
          // timestamp_ms, lang, created_at, geo, coordinates
          // user.profile_image_url, user.name, user.screen_name
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
            console.log(lat, lng, event.text)
            firebase.database().ref(`tweets/${HASHTAG}`).set(tweet);
          }
        }
    }
  });

  stream.on('error', (error) => {
    throw error;
  });

}
