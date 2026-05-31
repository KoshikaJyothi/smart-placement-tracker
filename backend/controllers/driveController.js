const Drive = require('../models/Drive');

exports.getDrives = async (req, res) => {
  try {
    const drives = await Drive.find({}).sort({ createdAt: -1 });
    res.json(drives);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDriveById = async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.id);

    if (!drive) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    res.json(drive);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createDrive = async (req, res) => {
  try {
    const drive = await Drive.create(req.body);
    res.status(201).json(drive);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDrive = async (req, res) => {
  try {
    const drive = await Drive.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!drive) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    res.json(drive);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteDrive = async (req, res) => {
  try {
    const drive = await Drive.findByIdAndDelete(req.params.id);

    if (!drive) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    res.json({ message: 'Drive removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};