const express = require('express');

const router = express.Router();

const User = require('../Models/User');

router.get('/', (req, res) => {
  res.render('login', {
    loginStatus: 'true',
    loginMsg: '',
    registerStatus: 'false',
    registerMsg: '',
    title: 'Please Login',
  });
});

router.post('/', (req, res) => {
  const user = new User({
    username: req.body.username,
    mobile: Number(req.body.mobile),
    email: req.body.email,
    password: req.body.password,
  });
  user
    .save()
    .then((addedUser) => {
      res.render('login', {
        registerMsg: 'Register Success, Please proceed...',
        registerStatus: 'true',
        loginStatus: 'true',
        loginMsg: '',
        title: 'Please Login'
      });
      console.log(addedUser);
    })
    .catch((err) => {
      res.render('register', {
        errStatus: 'true',
        errMsg: 'Mobile or Email already exists!',
        title: 'Please Login'
      });
      console.log(err);
    });
});

module.exports = router;
