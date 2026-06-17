const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    driveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Drive',
      validate: {
        validator: function () {
          return this.companyId || this.driveId;
        },
        message: 'Either companyId or driveId is required'
      }
    },
    currentRound: {
      type: String,
      enum: ['Applied', 'Round 1', 'Round 2', 'Technical Interview', 'HR Interview', 'Selected', 'Rejected'],
      default: 'Applied'
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

applicationSchema.index({ studentId: 1, driveId: 1 }, { unique: true, sparse: true });
applicationSchema.index({ studentId: 1, companyId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Application', applicationSchema);