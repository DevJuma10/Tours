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

//Protect all routes comming after this middleware
router.use(authControler.protect);

router.patch('/updateMyPassword', authControler.updatePassword);
router.patch('/updateMe', userControler.updateMe);
router.delete('/deleteMe', userControler.deleteMe);
router.route('/me').get(userControler.getMe, userControler.getUser);

//Restrict all routes to admins
router.use(authControler.restrictTo('admin'));

router.route('/').get(userControler.getAllUsers).post(userControler.createUser);

router
  .route('/:id')
  .get(userControler.getUser)
  .patch(userControler.updateUser)
  .delete(userControler.deleteUser);

module.exports = router;
