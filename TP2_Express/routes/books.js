const express = require('express');
const router = express.Router();

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

const books = [
  { title: "Le Petit Prince", author: "Antoine de Saint-Exupéry" },
  { title: "L'Étranger", author: "Albert Camus" },
  { title: "La Boîte à Merveilles", author: "Ahmed Sefrioui" }
];

router.get('/', ensureAuthenticated, (req, res) => {
  res.render('books', { user: req.user.username, books });
});

module.exports = router;
