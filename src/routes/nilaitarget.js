const express = require('express');
const router = express.Router();
const { nilai_target, skor } = require('../models');
const jsonToTable = require('../helpers/jsonToTable');

router.get('/', async (req, res, next) => {
  const username = req.session.username;
  const user_id = req.session.userId;
  const targets = await nilai_target.getAll(user_id);
  return res.render('nilaitarget/index', { title: 'Nilai Target', username, targets });
});

router.get('/table', async (req, res, next) => {
  const user_id = req.session.userId;
  const targets = await nilai_target.getAll(user_id);
  const data = targets.map((e, i) => {
    const category = e.category === 'core_factor' ? 'Core Factor' : 'Secondary Factor';
    return { id: e.id, name: e.name, kode: e.kode, value: e.value, category: category };
  });
  return res.json(jsonToTable(data));
});

router.post('/', async (req, res, next) => {
  const data = req.body;
  const user_id = req.session.userId;
  const findNilaiTarget = await nilai_target.findOne({ where: { kode: data.kode, user_id } });
  if (findNilaiTarget) {
    req.flash('error', 'Kode Kriteria Tidak Boleh Sama');
    return res.redirect('/nilaitarget');
  }
  await nilai_target.create({ user_id, name: data.name, kode: data.kode, value: data.value, category: data.category });
  req.flash('success', 'Data Kriteria Berhasil Ditambahkan');
  return res.redirect('/nilaitarget');
});

router.post('/:id', async (req, res, next) => {
  const id = req.params.id;
  const data = req.body;
  const user_id = req.session.userId;
  const findNilaiTarget = await nilai_target.findOne({ where: { kode: data.kode, user_id } });
  if (findNilaiTarget) {
    await nilai_target.update({ name: data.name, value: data.value, category: data.category }, { where: { id, user_id } });
    req.flash('success', 'Data Kriteria Berhasil Diubah');
    return res.redirect('/nilaitarget');
  } else {
    await nilai_target.update({ name: data.name, kode: data.kode, value: data.value, category: data.category }, { where: { id, user_id } });
    req.flash('success', 'Data Kriteria Berhasil Diubah');
    return res.redirect('/nilaitarget');
  }
});

router.get('/delete/:id', async (req, res, next) => {
  const id = req.params.id;
  const user_id = req.session.userId;
  // find nilai target by id
  const findNilaiTarget = await nilai_target.findOne({ where: { id, user_id } });
  if (findNilaiTarget) {
    await nilai_target.destroy({ where: { id, user_id } });
  }
  req.flash('success', 'Data Kriteria Berhasil Dihapus');
  return res.redirect('/nilaitarget');
});

router.get('/form', async (req, res, next) => {
  return res.render('nilaitarget/form', { 
    title: 'Nilai Target', 
    action: '/nilaitarget',
    formName: '',
    formKode: '',
    formValue: '',
    formCategory: '',
  });
});

router.get('/form/:id', async (req, res, next) => {
  const id = req.params.id;
  const user_id = req.session.userId;
  const target = await nilai_target.findOne({ where: { id, user_id } });
  return res.render('nilaitarget/form', { 
    title: 'Nilai Target', 
    action: `/nilaitarget/${id}`,
    formName: target.name,
    formKode: target.kode,
    formValue: target.value,
    formCategory: target.category,
  });
});

module.exports = router;
