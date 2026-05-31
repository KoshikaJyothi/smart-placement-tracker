const User = require('../models/User');

const studentQuery = (query) => {
	const filter = { role: 'student' };

	if (query.branch) {
		filter.branch = query.branch;
	}

	if (query.minCGPA || query.maxCGPA) {
		filter.cgpa = {};

		if (query.minCGPA) {
			filter.cgpa.$gte = Number(query.minCGPA);
		}

		if (query.maxCGPA) {
			filter.cgpa.$lte = Number(query.maxCGPA);
		}
	}

	if (query.backlogs !== undefined) {
		filter.backlogs = Number(query.backlogs);
	}

	return filter;
};

exports.getStudents = async (req, res) => {
	try {
		const filter = studentQuery(req.query);
		const students = await User.find(filter).sort({ cgpa: -1, name: 1 });
		res.json(students);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.getStudentById = async (req, res) => {
	try {
		const student = await User.findOne({ _id: req.params.id, role: 'student' });

		if (!student) {
			return res.status(404).json({ message: 'Student not found' });
		}

		res.json(student);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.createStudent = async (req, res) => {
	try {
		const student = await User.create({ ...req.body, role: 'student' });
		res.status(201).json(student);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.updateStudent = async (req, res) => {
	try {
		const student = await User.findOneAndUpdate(
			{ _id: req.params.id, role: 'student' },
			req.body,
			{ new: true, runValidators: true }
		);

		if (!student) {
			return res.status(404).json({ message: 'Student not found' });
		}

		res.json(student);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.deleteStudent = async (req, res) => {
	try {
		const student = await User.findOneAndDelete({ _id: req.params.id, role: 'student' });

		if (!student) {
			return res.status(404).json({ message: 'Student not found' });
		}

		res.json({ message: 'Student removed' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
