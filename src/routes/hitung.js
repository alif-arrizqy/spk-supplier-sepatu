const express = require('express');
const router = express.Router();
const hitung = require('../helpers/hitung');
const { nilai_target, skor, alternatif } = require('../models');

router.get('/', async (req, res, next) => {
  const user_id = req.session.userId;
  const alternatifs = await alternatif.findAll({
    where: { user_id },
    order: [['nilai_prefensi', 'DESC']],
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
  const nilaiTarget = await nilai_target.getAll(user_id);
  const dataSkor = await skor.getAll({ user_id });

  if (nilaiTarget.length === 1 || dataSkor.length === 1 || alternatifs.length === 1) {
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
    dataSkor.find(el => el.alternatif_id === e.id);
    return {
      kode_alternatif: e.id,
      name: e.name,
      arrSkor: dataSkor
        .filter(el => el.alternatif_id === e.id)
        .map(el => {
          // find kode_nilai_target from nilai_target table
          const kodeNilaiTarget = nilaiTarget.find(nilai => nilai.id === el.nilai_target_id);
          return { kode: kodeNilaiTarget.kode, value: el.value };
        }),
    };
  });

  // call hitung function
  const resultHitung = hitung(formattedNilaiTarget, formatedSkor);
  resultHitung.map(e => {
    console.log(`kode_alternatif: ${e.kode_alternatif}, name: ${e.name}, rank: ${e.rank}, value: ${e.value}`);
    // alternatif.update({ nilai_prefensi: e.value }, { where: { kode_alternatif: e.kode_alternatif, user_id } });
  })
  req.flash('success', 'Perhitungan Berhasil');
  return res.redirect('/dashboard');
});

module.exports = router;
