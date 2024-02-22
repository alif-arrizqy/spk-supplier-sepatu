const express = require('express');
const router = express.Router();
const jsonToTable = require('../helpers/jsonToTable');
const hitung = require('../helpers/hitung');
const { nilai_target, skor, alternatif } = require('../models');

router.get('/', async (req, res, next) => {
  const user_id = req.session.userId;
  const username = req.session.username;
  const dataSkor = await skor.getAll({ user_id });
  const nilaiTarget = await nilai_target.getAll(user_id);
  const findFirstRank = await alternatif.findAll({
    where: { user_id },
    order: [['nilai_prefensi', 'DESC']],
  });
  const alternatifs = await alternatif.findAll({
    where: { user_id },
    order: [['nilai_prefensi', 'DESC']],
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });

  // reformating data nilai target and skor
  if (nilaiTarget.length === 0 || dataSkor.length === 0 || alternatifs.length === 0) {
    return res.render('dashboard', {
      title: 'Dashboard',
      username,
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
    resultHitung.length != 0 && findFirstRank[0].nilai_prefensi ? findFirstRank[0].name : resultHitung[0].name;

  res.render('dashboard', {
    title: 'Dashboard',
    username,
    firstRank,
    totalSupplier: findFirstRank.length,
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
  if (nilaiTarget.length === 0 || dataSkor.length === 0 || alternatifs.length === 0) {
    return res.render('dashboard', {
      title: 'Dashboard',
      username,
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
      score: e.value || alternatif.nilai_prefensi,
    };
  });
  return res.status(200).json(jsonToTable(result));
});

module.exports = router;
