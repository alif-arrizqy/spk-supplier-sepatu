const express = require('express');
const router = express.Router();
const dataFormat = require('../helpers/dataFormat');
const group = require('../helpers/group');
const jsonToTable = require('../helpers/jsonToTable');
// const hitung = require('../helpers/hitung');
const { nilai_target, skor, alternatif } = require('../models');

router.get('/', async (req, res, next) => {
  const user_id = req.session.userId;
  const username = req.session.username;
  // const locations = await link.getAll({ user_id });
  // const supplierLength = await supplier.findAll({
  //   where: { user_id },
  //   order: [
  //     ['hasil', 'DESC'],
  //     ['name', 'DESC'],
  //   ],
  // });

  // const criterias = await criteria.getAll(user_id);
  // const totalCriterias =
  //   criterias.length !== 0 ? criterias.map(e => e.bobot).reduce((acc, val) => +(acc + val).toFixed(5)) : 0;
  // const rangking = supplierLength.length != 0 && supplierLength[0].hasil ? supplierLength[0].name : '';
  // let tempData, datas, hitungs, hasils;
  // if (locations.length > 1) {
  //   hasils = locations[0].supplier.hasil;
  //   tempData = group(locations, 'supplier_id');
  //   datas = dataFormat(tempData);
  //   hitungs = hitung({ datas, criterias });
  // }
  // res.render('dashboard', {
  //   title: 'Dashboard',
  //   username,
  //   location: supplierLength.length,
  //   criteria: criterias.length,
  //   rangking,
  //   hitungs,
  //   hasils,
  //   totalCriterias,
  // });
  const dataSkor = await skor.getAll({ user_id });
  const targets = await nilai_target.getAll(user_id);
  const findFirstRank = await alternatif.findAll({
    where: { user_id },
    order: [['nilai_prefensi', 'DESC']],
  });
  const firstRank = findFirstRank.length != 0 && findFirstRank[0].nilai_prefensi ? findFirstRank[0].name : '';
  let tempData, data;
  if (dataSkor.length > 1) {
    tempData = group(dataSkor, 'kode_alternatif');
    data = dataFormat(tempData);
    // hitungs = hitung({ data, targets });
  }
  res.render('dashboard', {
    title: 'Dashboard',
    username,
    firstRank,
    totalSupplier: findFirstRank.length,
  });
});

router.get('/table', async (req, res, next) => {
  const user_id = req.session.userId;
  // const locationsAddress = await supplier.findAll({
  //   where: { user_id },
  //   order: [
  //     ['hasil', 'DESC'],
  //     ['name', 'ASC'],
  //   ],
  //   attributes: { exclude: ['createdAt', 'updatedAt'] },
  // });
  // const locations = await link.getAll({ user_id });
  // const tempData = group(locations, 'supplier_id');
  // const criterias = await criteria.findAll({ where: { user_id } });
  // const datas = dataFormat(tempData);
  // const hitungs = hitung({ datas, criterias });
  // const test = hitungs.hasil.sort((a, b) => b.hasil - a.hasil || b.kualitas - a.kualitas);
  // const tempLocation = test.map(e => {
  //   const location = locationsAddress.find(el => el.id === e.id);
  //   return {
  //     name: e.location,
  //     alamat: location.alamat,
  //     contact: location.contact,
  //     hasil: e.hasil,
  //   };
  // });
  // return res.json(jsonToTable(tempLocation));

  const alternatifs = await alternatif.findAll({
    where: { user_id },
    order: [['nilai_prefensi', 'DESC']],
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
  const dataSkor = await skor.getAll({ user_id });
  const tempData = group(dataSkor, 'kode_alternatif');
  const data = dataFormat(tempData);
  // const targets = await nilai_target.getAll(user_id);
  // const hitungs = hitung({ data, targets });
  const result = alternatifs.map(e => {
    const skor = data.find(el => el.kode_alternatif === e.kode);
    return {
      name: e.name,
      address: e.address,
      contact: e.contact,
      score: e.nilai_prefensi,
    };
  });
  return res.status(200).json(jsonToTable(result));
});

module.exports = router;
