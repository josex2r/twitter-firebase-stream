const Twitter = require('twitter');	

module.exports = new Twitter({	
  consumer_key: process.env.CONSUMER_PUBLIC,	
  consumer_secret: process.env.CONSUMER_PRIVATE,	
  access_token_key: process.env.TOKEN_PUBLIC,	
  access_token_secret: process.env.TOKEN_PRIVATE	
}); 
