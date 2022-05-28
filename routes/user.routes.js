const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');

/*----- AUTH -----*/
router.post('/register', authController.signUp);

/*----- CRUD -----*/
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);

module.exports = router;