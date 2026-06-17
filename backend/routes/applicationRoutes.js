const express = require('express');
const router = express.Router();
const { apply, updateStatus, getAllApplications, getStatus } = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/apply', protect, authorize('student', 'admin'), apply);
router.post('/student', protect, getStatus);
router.get('/student', protect, getStatus);
router.put('/update-status', protect, authorize('admin'), updateStatus);
router.put('/:id/status', protect, authorize('admin'), updateStatus);
router.get('/status', protect, getStatus);
router.get('/all', protect, authorize('admin'), getAllApplications);

module.exports = router;