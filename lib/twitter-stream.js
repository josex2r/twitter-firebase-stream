const twitter = require('./twitter-client');
const firebase = require('./firebase-client');

module.exports = function initStream(hashtag) {
  if (!hashtag) {
    return;
  }

  const stream = twitter.stream('statuses/filter', { track: hashtag });
  
  stream.on('data', (event) => {
    if (event) {
      // Check tweet geolocation
      if (event.place && !event.coordinates) {
        event.coordinates = {
          coordinates: event.place.bounding_box.coordinates[0][0]
        }
      }

      if (!event.coordinates) {
        return;
      }

      // Check if tweet is valid
      if (event.text) {
        const [lng, lat] = event.coordinates.coordinates;
        const tweet = {
          lat,
          lng,
          text: event.text,
          user: event.user.screen_name,
          img: event.user.profile_image_url,
          timestamp: Date.now()
        }

        // Store tweet in firebase
        // ...
      }
    }
  });

  stream.on('error', (error) => {
    console.error(error);
    // Wait 10s to restart the stream
    setTimeout(() => initStream(hashtag), 10000);
  });

  return stream;
}
