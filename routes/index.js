const express = require('express');

const router = express.Router();
const User = require('../Models/User');

// this is /home route
router.post('/', (req, res) => {
  User.findOne(
    { username: req.body.username, password: req.body.password },
    (err, data) => {
      if (err) {
        console.log(err);
      } else if (!data) {
        res.render('login', {
          loginStatus: 'false',
          loginMsg: 'user name or password is wrong',
          registerStatus: 'false',
          registerMsg: '',
          title: 'Please Login'
        });
      } else {
        console.log(data);
        res.render('index', {
          title: 'Discussion App',
          username: req.body.username,
        });
      }
    }
  );
});

module.exports = router;
