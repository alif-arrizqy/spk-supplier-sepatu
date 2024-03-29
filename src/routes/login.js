const express = require('express');
const router = express.Router();
const dataLaporan = require('../helpers/dataLaporan');
const { user } = require('../models');

const bcrypt = require('bcryptjs');

router.get('/', (req, res, next) => {
  res.render('login', { title: 'Login', layout: 'layouts/blank' });
});

router.post('/', async (req, res, next) => {
  const username = req.body.username.toLowerCase().trim();
  const password = req.body.password.trim();
  const tempUser = await user.findOne({ where: { username } });
  if (!tempUser) {
    req.flash('error', 'Username atau Password Salah');
    return res.redirect('/login');
  }
  const isValidPassword = await bcrypt.compare(password, tempUser.password);
  if (!isValidPassword) {
    req.flash('error', 'Username atau Password Salah');
    return res.redirect('/login');
  }
  req.flash('success', 'Login Berhasil');
  req.session.login = true;
  req.session.userId = tempUser.id;
  req.session.username = tempUser.name;
  return res.redirect('/dashboard');
});

router.post('/register', async (req, res, next) => {
  const name = req.body.name;
  const username = req.body.username.toLowerCase();
  const laporan = req.body.laporan;
  const tempUser = await user.findOne({ where: { username } });
  if (tempUser) {
    req.flash('error', 'Username Sudah Ada Harap menggunakan Username Yang Lain');
    return res.redirect('/login');
  }
  const password = await bcrypt.hash(req.body.password, 10);
  const create = await user.create({ name, username, password });
  laporan && dataLaporan(create.id);
  req.flash('success', 'Silahkan Masuk');
  res.redirect('/login');
});

router.post('/logout', (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
  });
  res.redirect('/login');
});

module.exports = router;
