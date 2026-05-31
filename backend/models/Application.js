const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    driveId: { type: mongoose.Schema.Types.ObjectId, ref: 'Drive', required: true },
    currentRound: {
      type: String,
      enum: ['Applied', 'Round 1', 'Round 2', 'Technical Interview', 'HR Interview', 'Selected', 'Rejected'],
      default: 'Applied'
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

applicationSchema.index({ studentId: 1, driveId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);