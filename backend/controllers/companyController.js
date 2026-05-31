const Company = require('../models/Company');

// @desc    Create a company
// @route   POST /api/company/add
// @access  Private/Admin
exports.addCompany = async (req, res) => {
  try {
    const { name, role, minCGPA, allowedBranches, deadline } = req.body;
    const company = await Company.create({ name, role, minCGPA, allowedBranches, deadline });
    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all companies
// @route   GET /api/company/all
// @access  Public
exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find({});
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a company
// @route   DELETE /api/company/:id
// @access  Private/Admin
exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    await Company.findByIdAndDelete(req.params.id);
    res.json({ message: 'Company removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};