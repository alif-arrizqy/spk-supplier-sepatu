const express = require('express');
const router = express.Router();
const jsonToTable = require('../helpers/jsonToTable');
const hitung = require('../helpers/hitung');
const { nilai_target, skor, alternatif } = require('../models');

router.get('/', async (req, res, next) => {
  const user_id = req.session.userId;
  const dataSkor = await skor.getAll({ user_id });
  const nilaiTarget = await nilai_target.getAll(user_id);
  const alternatifs = await alternatif.findAll({
    where: { user_id },
    order: [['nilai_prefensi', 'DESC']],
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });

  // reformating data nilai target and skor
  if (nilaiTarget.length === 1 || dataSkor.length === 1 || alternatifs.length === 1) {
    return res.render('dashboard', {
      title: 'Dashboard',
      firstRank: '',
      totalSupplier: 0,
      resultHitung: [],
    });
  }
  const formattedNilaiTarget = nilaiTarget.map(target => {
    return {
      name: target.name,
      kode: target.kode,
      value: target.value,
      category: target.category,
    };
  });

  const formatedSkor = alternatifs.map(e => {
    dataSkor.find(el => el.kode_alternatif === e.kode_alternatif);
    return {
      kode_alternatif: e.kode_alternatif,
      name: e.name,
      arrSkor: dataSkor
        .filter(el => el.kode_alternatif === e.kode_alternatif)
        .map(el => {
          return { kode: el.kode_nilai_target, value: el.value };
        }),
    };
  });

  // call hitung function
  const resultHitung = hitung(formattedNilaiTarget, formatedSkor);

  // get first rank
  const firstRank =
    resultHitung.length != 0 && alternatifs.length != 0 ? resultHitung[0].name : '';

  res.render('dashboard', {
    title: 'Dashboard',
    firstRank,
    totalSupplier: alternatifs.length,
    resultHitung,
  });
});

router.get('/table', async (req, res, next) => {
  const user_id = req.session.userId;
  const alternatifs = await alternatif.findAll({
    where: { user_id },
    order: [['nilai_prefensi', 'DESC']],
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
  const nilaiTarget = await nilai_target.getAll(user_id);
  const dataSkor = await skor.getAll({ user_id });

  // reformating data nilai target and skor
  if (nilaiTarget.length === 1 || dataSkor.length === 1 || alternatifs.length === 1) {
    return res.render('dashboard', {
      title: 'Dashboard',
      firstRank: '',
      totalSupplier: 0,
      resultHitung: [],
    });
  }
  const formattedNilaiTarget = nilaiTarget.map(target => {
    return {
      name: target.name,
      kode: target.kode,
      value: target.value,
      category: target.category,
    };
  });

  const formatedSkor = alternatifs.map(e => {
    dataSkor.find(el => el.kode_alternatif === e.kode_alternatif);
    return {
      kode_alternatif: e.kode_alternatif,
      name: e.name,
      arrSkor: dataSkor
        .filter(el => el.kode_alternatif === e.kode_alternatif)
        .map(el => {
          return { kode: el.kode_nilai_target, value: el.value };
        }),
    };
  });

  // call hitung function
  const resultHitung = hitung(formattedNilaiTarget, formatedSkor);
  const result = resultHitung.map(e => {
    const alternatif = alternatifs.find(el => el.kode_alternatif === e.kode_alternatif);
    return {
      name: alternatif.name,
      address: alternatif.address,
      contact: alternatif.contact,
      score: alternatif.nilai_prefensi || e.value,
    };
  });
  return res.status(200).json(jsonToTable(result));
});

module.exports = router;
