const express = require('express');

const router = express.Router();

// this is /register page
router.get('/', (req, res) => {
  res.render('register', {
    errStatus: 'false',
    errMsg: '',
  });
});

module.exports = router;
