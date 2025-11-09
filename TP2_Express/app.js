const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const path = require('path');
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/tp2_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log(err));


require('./config/passport')(passport);


app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/', require('./routes/auth'));
app.use('/books', require('./routes/books'));


app.listen(3000, '0.0.0.0', () => console.log('Server running on http://localhost:3000'));

