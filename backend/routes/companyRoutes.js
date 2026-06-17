const express = require('express');
const router = express.Router();
const { addCompany, getCompanies, deleteCompany } = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/all', getCompanies);
router.post('/add', protect, authorize('admin'), addCompany);
router.delete('/:id', protect, authorize('admin'), deleteCompany);

module.exports = router;