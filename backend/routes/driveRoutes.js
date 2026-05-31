const express = require('express');
const router = express.Router();
const {
  getDrives,
  getDriveById,
  createDrive,
  updateDrive,
  deleteDrive
} = require('../controllers/driveController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/').get(getDrives).post(protect, authorize('admin'), createDrive);
router.route('/:id').get(getDriveById).put(protect, authorize('admin'), updateDrive).delete(protect, authorize('admin'), deleteDrive);

module.exports = router;