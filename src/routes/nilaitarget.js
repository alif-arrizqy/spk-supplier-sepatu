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

module.exports = router;
