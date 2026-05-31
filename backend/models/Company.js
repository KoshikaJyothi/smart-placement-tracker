const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  minCGPA: { type: Number, required: true },
  allowedBranches: [{ type: String, required: true }],
  deadline: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);