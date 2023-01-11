/**
 * USERS ROUTUNG
 *
 */
const express = require('express');
const router = express.Router();
const userControler = require('../controlers/userControler');
const authControler = require('./../controlers/authControler');

router.post('/signup', authControler.signup);

router.route('/').get(userControler.getAllUsers).post(userControler.createUser);

router
  .route(':id')
  .patch(userControler.updateUser)
  .delete(userControler.deleteUser)
  .get(userControler.getUser);

module.exports = router;
