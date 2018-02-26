const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Twitter Stream',
        error: req.query.error,
        logout: !!req.query.logout
    });
});

module.exports = router;
