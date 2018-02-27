const express = require('express');
const initStream = require('../lib/twitter-stream');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('map', {
        title: 'Twitter Stream',
        error: req.query.error,
        logout: !!req.query.logout
    });
});

router.put('/', (req, res) => {
  console.log('Initializing Twitter stream', req.query.hashtag);

  const stream = initStream(req.query.hashtag);

  if (!stream) {
    res.sendStatus(404);
  } else {
    res.sendStatus(200);
  }
});

module.exports = router;
