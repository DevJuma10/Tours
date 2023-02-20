const express = require('express');

const router = express.Router();
const viewControler = require('../controlers/viewsControler');

router.get('/', viewControler.getOverview);

router.get('/tour/:slug', viewControler.getTour);

module.exports = router;
