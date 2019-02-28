const db = require('../models/db');
const psw = require('../libs/password');

module.exports.login = function(req, res) {
  if (req.session.isAdmin) {
    return res.redirect('/admin');
  }
  res.render('pages/login', { title: 'Login page', msglogin: req.query.msg });
};

module.exports.auth = function(req, res) {
  if (!req.body.email) {
    return res.redirect('/login/?msg=Please enter email');
  }
  if (!req.body.password) {
    return res.redirect('/login/?msg=Please enter password');
  }
  const user = db.getState().user;
  if (user.email === req.body.email && psw.validPassword(req.body.password)) {
    req.session.isAdmin = true;
    return res.redirect('/admin');
  } else {
    return res.redirect('/login/?msg=Enter the correct username and password!');
  }
};
