const isStudentEligibleForDrive = (student, drive) => {
  if (!student || !drive) {
    return false;
  }

  const minCGPA = Number(drive.eligibilityCriteria?.minCGPA ?? 0);
  const eligibleBranches = drive.eligibilityCriteria?.eligibleBranches ?? [];

  return Number(student.cgpa ?? 0) >= minCGPA && eligibleBranches.includes(student.branch);
};

module.exports = { isStudentEligibleForDrive };