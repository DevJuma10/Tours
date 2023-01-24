/**
 * USERS ROUTUNG
 *
 */
const express = require('express');

const router = express.Router();
const userControler = require('../controlers/userControler');
const authControler = require('../controlers/authControler');

router.post('/signup', authControler.signup);

router.post('/login', authControler.login);

//test
router.get('/amore', authControler.amore);

router.get('/forgotPassword', authControler.forgotPassword);
router.post('/resetPassword', authControler.resetPassword);

router.route('/').get(userControler.getAllUsers).post(userControler.createUser);

router
  .route(':id')
  .patch(userControler.updateUser)
  .delete(userControler.deleteUser)
  .get(userControler.getUser);

module.exports = router;
