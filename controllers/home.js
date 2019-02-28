const nodemailer = require('nodemailer');
const config = require('../config/config.json');
const db = require('../models/db');

module.exports.index = function(req, res) {
  const sendObj = {
    title: 'Home page',
    description: '“Главное — это музыка”',
    videoLink: 'https://www.youtube.com/watch?v=nBE85Qy_SLc'
  };

  const goods = db.getState().goods || [];
  const skills = db.getState().skills || {};

  res.render('pages/index', Object.assign({}, sendObj, { goods }, { skills }));
};

module.exports.mail = (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.text) {
    return res.json({ msg: 'Все поля нужно заполнить!', status: 'Error' });
  }
  const transporter = nodemailer.createTransport(config.mail.smtp);
  const mailOptions = {
    from: `"${req.body.name}" <${req.body.email}>`,
    to: config.mail.smtp.auth.user,
    subject: config.mail.subject,
    text:
      req.body.text.trim().slice(0, 500) +
      `\n Отправлено с: <${req.body.email}>`
  };
  transporter.sendMail(mailOptions, error => {
    if (error) {
      return res.json({
        msg: `При отправке письма произошла ошибка!: ${error}`,
        status: 'Error'
      });
    }
    res.json({ msg: 'Письмо успешно отправлено!', status: 'Ok' });
  });
};
