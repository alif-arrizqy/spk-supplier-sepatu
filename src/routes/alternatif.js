const express = require('express');
const router = express.Router();
const { nilai_target, skor, alternatif } = require('../models');
const group = require('../helpers/group');
const dataFormat = require('../helpers/dataFormat');
const jsonToTable = require('../helpers/jsonToTable');

router.get('/', async (req, res, next) => {
  const username = req.session.username;
  const user_id = req.session.userId;
  const targets = await nilai_target.getAll(user_id);
  return res.render('alternatif/index', { title: 'Supplier', username, targets });
});

router.get('/table', async (req, res, next) => {
  const user_id = req.session.userId;
  const dataSkor = await skor.getAll({ user_id });
  const tempData = group(dataSkor, 'kode_alternatif');
  const data = dataFormat(tempData);
  return res.status(200).json(jsonToTable(data));
});

router.post('/', async (req, res, next) => {
  const data = req.body;
  const user_id = req.session.userId;

  // get kode from nilai_target table
  const getKode = await nilai_target.getAll(user_id);
  const kode_nilai_target = getKode.map(e => e.kode);
  // check if kode_nilai_target is same with data
  const tempSkor = {};
  for (const value of Object.keys(data)) {
    if (kode_nilai_target.includes(value)) {
      // create new object with key is kode_nilai_target
      // and value is data from kode_nilai_target
      tempSkor[value] = data[value];
    }
  }

  const findALternatif = await alternatif.findOne({
    where: { kode_alternatif: data.kode_alternatif, user_id },
  });
  if (findALternatif) {
    req.flash('error', 'Kode Alternatif Tidak Boleh Sama');
    return res.redirect('/alternatif');
  }
  // create data supplier or alternatif
  await alternatif.create({
    user_id,
    kode_alternatif: data.kode_alternatif,
    name: data.name,
    address: data.address,
    contact: data.contact,
  });

  // create data skor
  for (const value of Object.keys(tempSkor)) {
    await skor.create({
      user_id,
      kode_alternatif: data.kode_alternatif,
      kode_nilai_target: value,
      value: tempSkor[value],
    });
  }
  req.flash('success', 'Data Berhasil Ditambahkan');
  return res.redirect('/alternatif');
});

router.post('/:kode', async (req, res) => {
  const { kode } = req.params;
  const user_id = req.session.userId;
  const data = req.body;
  const findAlternatif = await alternatif.findOne({
    where: { kode_alternatif: kode, user_id },
  });
  if (findAlternatif) {
    // update table alternatif
    findAlternatif.update({
      kode_alternatif: data.kode_alternatif,
      name: data.name,
      address: data.address,
      contact: data.contact,
    });
  }

  // get kode from nilai_target table
  const getKode = await nilai_target.getAll(user_id);
  const kode_nilai_target = getKode.map(e => e.kode);
  // check if kode_nilai_target is same with data
  const tempSkor = {};
  for (const value of Object.keys(data)) {
    if (kode_nilai_target.includes(value)) {
      // create new object with key is kode_nilai_target
      // and value is data from kode_nilai_target
      tempSkor[value] = data[value];
    }
  }

  // update table skor
  for (const value of Object.keys(tempSkor)) {
    await skor.update({ value: data[value] }, {
      where: { kode_nilai_target: value, kode_alternatif: kode, user_id },
    });
  }

  req.flash('success', 'Data Berhasil Diubah');
  return res.redirect('/alternatif');
});

router.get('/delete/:id', async (req, res, next) => {
  const id = req.params.id;
  const tempAlternatif = await alternatif.findByPk(id);
  await tempAlternatif.destroy();
  req.flash('success', 'Data Berhasil Dihapus');
  return res.redirect('/alternatif');
});

router.get('/form', async (req, res, next) => {
  const user_id = req.session.userId;
  const dataForm = await nilai_target.getAll(user_id);
  // empty value for form
  dataForm.forEach(data => {
    data.value = '';
  });
  return res.render('alternatif/form', {
    action: '/alternatif',
    title: 'Supplier',
    dataForm,
    formKodeAlternatif: '',
    formName: '',
    formAddress: '',
    formContact: '',
  });
});

router.get('/form/:kode', async (req, res, next) => {
  const kode = req.params.kode;
  const user_id = req.session.userId;

  const tempForms = await skor.getAll({ user_id, kode_alternatif: kode});
  const formKodeAlternatif = tempForms[0]['alternatif']['dataValues']['kode_alternatif'];
  const formName = tempForms[0]['alternatif']['dataValues']['name'];
  const formAddress = tempForms[0]['alternatif']['dataValues']['address'];
  const formContact = tempForms[0]['alternatif']['dataValues']['contact'];

  const dataForm = tempForms.map(temp => {
    const dataNilaiTarget = temp['nilai_target']['dataValues'];
    return { ...dataNilaiTarget, value: temp['dataValues']['value'] };
  });
  return res.render('alternatif/form', {
    action: `/alternatif/${kode}`,
    title: 'Supplier',
    dataForm,
    formKodeAlternatif,
    formName,
    formAddress,
    formContact,
  });
});

module.exports = router;
