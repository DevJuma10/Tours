const express = require('express');

const router = express.Router();
const viewControler = require('../controlers/viewsControler');
const authControler = require('../controlers/authControler');

router.get('/login', viewControler.getLoginForm);

router.use(authControler.isLogedIn);

router.get('/', viewControler.getOverview);

router.get('/tour/:slug', authControler.protect, viewControler.getTour);

module.exports = router;
