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

module.exports = router;
