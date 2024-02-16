const express = require('express');
const router = express.Router();
const { alternatif, nilaitarget } = require('../models');
const NilaiTarget = require('../models/nilaitarget');

router.get('/', async (req, res, next) => {
    const username = req.session.username;
    const user_id = req.session.userId;
    const nilaitargets = await nilaitarget.getAll(user_id);
    console.log(user_id, username, nilaitargets);
    return res.render('alternatif/index', { title: 'Data Alternatif', username, nilaitargets });
});

router.get('/table', async (req, res, next) => {
    const user_id = req.session.userId;
    return res.status(200).json(await alternatif.getAll({ user_id }));
});

module.exports = router;