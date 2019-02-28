const express = require('express');
const router = express.Router();

const ctrlHome = require('../controllers/home');
const ctrlAdmin = require('../controllers/admin');
const ctrlLogin = require('../controllers/login');

const isAdmin = (req, res, next) => {
  if (req.session.isAdmin) {
    return next();
  }
  res.redirect('/');
};

router.get('/', ctrlHome.index);
router.post('/', ctrlHome.mail);

router.get('/login', ctrlLogin.login);
router.post('/login', ctrlLogin.auth);

router.get('/admin', isAdmin, ctrlAdmin.admin);
router.post('/admin/upload', isAdmin, ctrlAdmin.upload);
router.post('/admin/skills', isAdmin, ctrlAdmin.skills);

module.exports = router;
