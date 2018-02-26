const twitter = require('./twitter-client');

module.exports = function init() {
    const stream = twitter.stream('statuses/filter', { track: 'javascript' });

    stream.on('data', (event) => {
        console.log(event && event.text);
    });

    stream.on('error', (error) => {
        throw error;
    });

    // You can also get the stream in a callback if you prefer. 
    twitter.stream('statuses/filter', { track: 'javascript' }, (stream) => {
        stream.on('data', (event) => {
            console.log(event && event.text);
        });

        stream.on('error', (error) => {
        console.log(error)
            throw error;
        });
    });
}