const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const validation = require('./utils/validation');
const db = require('../models/db');

module.exports.admin = function(req, res) {
  res.render('pages/admin', {
    title: 'Admin page',
    msgfile: req.query.msgfile,
    msgskill: req.query.msgskill
  });
};

module.exports.upload = (req, res, next) => {
  let form = new formidable.IncomingForm();
  let upload = path.join('./public', 'upload');

  form.uploadDir = path.join(process.cwd(), upload);
  form.parse(req, function(err, fields, files) {
    if (err) {
      return next(err);
    }
    const valid = validation(fields, files);
    if (valid.err) {
      fs.unlinkSync(files.photo.path);
      return res.redirect(`/admin/?msgfile=${valid.status}`);
    }

    const fileName = path.join(upload, files.photo.name);

    fs.rename(files.photo.path, fileName, function(err) {
      if (err) {
        console.error(err.message);
        return;
      }
      let dir = fileName.substr(fileName.indexOf('\\'));

      db.get('goods')
        .push({
          name: fields.name,
          price: fields.price,
          picture: dir
        })
        .write();
      res.redirect('/admin/?msgfile=Картинка успешно загружена');
    });
  });
};

module.exports.skills = (req, res) => {
  if (
    !req.body.age ||
    !req.body.concerts ||
    !req.body.cities ||
    !req.body.years
  ) {
    return res.redirect('/admin/?msgskill=Все поля обязательны к заполнению');
  }

  db.get('skills')
    .set('age', req.body.age)
    .set('concerts', req.body.concerts)
    .set('cities', req.body.cities)
    .set('years', req.body.years)
    .write();
  res.redirect('/admin/?msgskill=Данные успешно загружены');
};
