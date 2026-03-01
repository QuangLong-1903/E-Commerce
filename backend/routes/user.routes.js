const express = require('express');
const router = express.Router();

const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats,
} = require('../controllers/user.controller');

const { protect, admin } = require('../middleware/auth');
const { mongoIdValidation, paginationValidation } = require('../middleware/validate');

// All routes require admin access
router.use(protect, admin);

router.get('/stats', getUserStats);
router.get('/', paginationValidation, getUsers);
router.get('/:id', mongoIdValidation('id'), getUserById);
router.put('/:id', mongoIdValidation('id'), updateUser);
router.delete('/:id', mongoIdValidation('id'), deleteUser);

module.exports = router;
