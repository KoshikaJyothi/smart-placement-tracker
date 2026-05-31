const mongoose = require('mongoose');

const driveSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    jobRole: { type: String, required: true, trim: true },
    jobDescription: { type: String, required: true, trim: true },
    eligibilityCriteria: {
      minCGPA: { type: Number, required: true, min: 0, max: 10 },
      eligibleBranches: [{ type: String, required: true }]
    },
    packageCTC: { type: String, required: true, trim: true },
    bond: { type: String, default: 'None', trim: true },
    applicationDeadline: { type: Date, required: true },
    status: { type: String, enum: ['Active', 'Archived'], default: 'Active' },
    recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Drive', driveSchema);