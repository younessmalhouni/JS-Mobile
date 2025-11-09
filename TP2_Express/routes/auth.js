const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');


router.get('/register', (req, res) => res.render('register'));


router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const userExist = await User.findOne({ username });
  if (userExist) return res.render('register', { error: 'User already exists' });

  const hashedPwd = await bcrypt.hash(password, 10);
  await new User({ username, password: hashedPwd }).save();

  res.redirect('/login');
});

// Login Page
router.get('/login', (req, res) => res.render('login'));

// Login Handle
router.post('/login', passport.authenticate('local', {
  successRedirect: '/books',
  failureRedirect: '/login',
  failureFlash: true
}));

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => res.redirect('/login'));
});

module.exports = router;
