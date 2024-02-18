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
  // validation kode_nilai_target, must be integer and min 1 and max 5
  for (const value of Object.keys(data)) {
    console.log(`value: ${value}`);
    console.log(`datavalue: ${data[value]}`);

    
  }

  // const tempAlternatif = await alternatif.findOne({
  //   where: {
  //     user_id,
  //     kode_alternatif: data.kode_alternatif,
  //   },
  // });
  // if (tempAlternatif) {
  //   req.flash('error', 'Kode Alternatif Tidak Boleh Sama');
  //   return res.redirect('/alternatif');
  // }
  // // create data supplier or alternatif
  // const alternatifData = await alternatif.create({
  //   user_id,
  //   kode_alternatif: data.kode_alternatif,
  //   name: data.name,
  //   address: data.address,
  //   contact: data.contact,
  // });
  // for (const value of Object.keys(data)) {
  //   if (value != 'kode_alternatif') {
  //     // create data skor
  //     await skor.create({
  //       user_id,
  //       kode_alternatif: data.kode_alternatif,
  //       kode_nilai_target: value,
  //       value: data[value],
  //     });
  //   }
  // }
  req.flash('success', 'Data Berhasil Ditambahkan');
  return res.redirect('/alternatif');
});

router.post('/:id', async (req, res) => {
  const { id } = req.params;
  const user_id = req.session.userId;
  const data = req.body;
  const tempAlternatif = await alternatif.findOne({
    where: { id, user_id },
  });
  if (tempAlternatif) {
    // update table alternatif
    tempAlternatif.update({
      kode_alternatif: data.kode_alternatif,
      name: data.name,
      address: data.address,
      contact: data.contact,
    });
  }
  for (const value of Object.keys(data)) {
    if (value != 'kode_alternatif') {
      // update table skor
      await skor.update(
        {
          user_id,
          kode_alternatif: data.kode_alternatif,
          kode_nilai_target: value,
          value: data[value],
        },
        {
          where: { user_id, kode_alternatif, kode_nilai_target },
        }
      );
    }
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
  return res.render('alternatif/form', { 
    action: '/alternatif',
    title: 'Supplier',
    dataForm,
    kode_alternatif: '',
    name: '',
    address: '',
    contact: '',
  });
});

router.get('/form/:id', async (req, res, next) => {
  const { id } = req.params;
  const user_id = req.session.userId;
  const targets = await nilai_target.getAll(user_id);
  // ini salah
  const tempForms = await skor.getAll({ user_id, kode_alternatif: id });
  const kode_alternatif = tempForms[0]['alternatif']['kode_alternatif'];
  const name = tempForms[0]['alternatif']['name'];
  const address = tempForms[0]['alternatif']['address'];
  const contact = tempForms[0]['alternatif']['contact'];
  const dataForm = targets.map(target => {
    const dataNilaiTarget = target.dataValues;
    const find = tempForms.find(form => form.kode_nilai_target === target.kode_nilai_target);
    return { ...dataNilaiTarget, value: find ? find.value : '' };
  });
  return res.render('alternatif/form', {
    action: `/alternatif/${id}`,
    title: 'Supplier',
    dataForm,
    kode_alternatif,
    name,
    address,
    contact,
  });
});

module.exports = router;
