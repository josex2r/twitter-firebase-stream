const SocketIo = require('socket.io');
const initStream = require('./twitter-stream');

const LISTENERS = {
  // hashtag: { count: Number, stream: Object }
};

module.exports = function(server) {
  const io = SocketIo(server);

  io.on('connection', (socket) => {
    let currentHashtag;

    console.log('connection');

    socket.on('hashtag', (hashtag) => {
      const previousListener = LISTENERS[currentHashtag];

      console.log(`There are ${previousListener ? previousListener.count : 0} persons listening the hashtag "${currentHashtag}"`);
      if (previousListener) {
        previousListener.count--;

        if (previousListener.count === 0) {
          console.log(`Destroying the stream for "${currentHashtag}"`);
          // Stop listening twitter stream
          previousListener.stream.destroy();
        }
      }

      console.log('hashtag', hashtag);
      currentHashtag = hashtag;

      const currentListener = LISTENERS[currentHashtag];

      console.log(`There are ${currentListener ? currentListener.count : 0} persons listening the hashtag "${currentHashtag}"`);
      if (!currentListener) {
        // Init listening tags
        console.log(`Creating the stream for "${currentHashtag}"`);
        LISTENERS[currentHashtag] = {
          count: 1,
          stream: initStream(currentHashtag)
        };
      } else {
        currentListener.count++;
      }
    });

    socket.on('disconnect', () => {
      console.log('disconnect');

      const previousListener = LISTENERS[currentHashtag];

      console.log(`There are ${previousListener ? previousListener.count : 0} persons listening the hashtag "${currentHashtag}"`);
      if (previousListener) {
        previousListener.count--;

        if (previousListener.count === 0) {
          console.log(`Destroying the stream for "${currentHashtag}"`);
          // Stop listening twitter stream
          previousListener.stream.destroy();
        }
      }
    });
  });
}
