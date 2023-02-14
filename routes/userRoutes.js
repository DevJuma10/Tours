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

router.post('/forgotPassword', authControler.forgotPassword);
router.patch('/resetPassword/:token', authControler.resetPassword);
router.patch(
  '/updateMyPassword',
  authControler.protect,
  authControler.updatePassword
);

router.patch('/updateMe', authControler.protect, userControler.updateMe);
// router.delete('/deleteMe', authControler.protect, userControler.deleteMe);

router.route('/').get(userControler.getAllUsers).post(userControler.createUser);

router
  .route('/me')
  .get(authControler.protect, userControler.getMe, userControler.getUser);

router
  .route('/:id')
  .patch(userControler.updateUser)
  .delete(userControler.deleteUser)
  .get(userControler.getUser);

module.exports = router;
