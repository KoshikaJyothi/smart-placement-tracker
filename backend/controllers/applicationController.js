const Application = require('../models/Application');
const Drive = require('../models/Drive');
const sendEmail = require('../utils/emailService');
const User = require('../models/User');
const { isStudentEligibleForDrive } = require('../utils/placementRules');

// @desc    Apply to a drive
// @route   POST /api/applications/apply
// @access  Private/Student
exports.apply = async (req, res) => {
  try {
    const { driveId, companyId } = req.body;

    if (companyId) {
      const Company = require('../models/Company');

      const company = await Company.findById(companyId);

      if (!company) {
        return res.status(404).json({ message: 'Company not found' });
      }

      const student = await User.findById(req.user._id);

      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      const existing = await Application.findOne({ studentId: req.user._id, companyId });

      if (existing) {
        return res.status(400).json({ message: 'Already applied to this company' });
      }

      const application = await Application.create({
        studentId: req.user._id,
        companyId,
        currentRound: 'Applied',
        updatedBy: req.user._id
      });

      return res.status(201).json(application);
    }

    const drive = await Drive.findById(driveId);

    if (!drive) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    if (drive.status !== 'Active') {
      return res.status(400).json({ message: 'Drive is not active' });
    }

    const student = await User.findById(req.user._id);

    if (!isStudentEligibleForDrive(student, drive)) {
      return res.status(400).json({ message: 'Student is not eligible for this drive' });
    }
    
    const existing = await Application.findOne({ studentId: req.user._id, driveId });

    if (existing) {
      return res.status(400).json({ message: 'Already applied to this drive' });
    }

    const application = await Application.create({
      studentId: req.user._id,
      driveId,
      currentRound: 'Applied',
      updatedBy: req.user._id
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get application statuses for a student or drive
// @route   GET /api/applications/status?studentId=...&driveId=...
// @access  Private
exports.getStatus = async (req, res) => {
  try {
    const query = {};

    if (req.query.studentId) {
      query.studentId = req.query.studentId;
    }

    if (req.query.driveId) {
      query.driveId = req.query.driveId;
    }

    if (req.user.role === 'student') {
      query.studentId = req.user._id;
    }

    const applications = await Application.find(query)
      .populate('studentId', 'name email branch cgpa resumeUrl backlogs')
      .populate('companyId')
      .populate('driveId');

    res.json(
      applications.map((application) => {
        const payload = application.toObject();
        return {
          ...payload,
          status: payload.currentRound,
          round: payload.currentRound
        };
      })
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private/Admin
exports.updateStatus = async (req, res) => {
  try {
    const applicationId = req.params.id || req.body.applicationId;
    const currentRound = req.body.currentRound || req.body.round || req.body.status;
    
    const application = await Application.findById(applicationId)
      .populate('studentId', 'name email branch cgpa resumeUrl backlogs')
      .populate('companyId')
      .populate('driveId');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.currentRound = currentRound || application.currentRound;
    application.updatedBy = req.user._id;
    await application.save();

    try {
      await sendEmail({
        email: application.studentId.email,
        subject: `Placement Update - ${application.driveId.companyName}`,
        message: `<p>Dear ${application.studentId.name},</p>
                  <p>Your application status for <strong>${application.driveId.companyName}</strong> has been updated.</p>
                  <p><strong>Current Round:</strong> ${application.currentRound}</p>
                  <br/>
                  <p>Best regards,<br/>Placement Cell</p>`
      });
    } catch (err) {
      console.error('Email failed to send', err);
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all applications for admin
// @route   GET /api/applications/all
// @access  Private/Admin
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('studentId', 'name email branch cgpa resumeUrl backlogs role')
      .populate('companyId')
      .populate('driveId');

    res.json(
      applications.map((application) => {
        const payload = application.toObject();
        return {
          ...payload,
          status: payload.currentRound,
          round: payload.currentRound
        };
      })
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};