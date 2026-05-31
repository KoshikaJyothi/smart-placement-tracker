# Smart Placement Tracker Architecture Plan

## Backend Directory Structure

```text
backend/
  config/
    db.js
  controllers/
    authController.js
    studentController.js
    driveController.js
    applicationController.js
  middleware/
    authMiddleware.js
  models/
    User.js
    Drive.js
    Application.js
  routes/
    authRoutes.js
    studentRoutes.js
    driveRoutes.js
    applicationRoutes.js
  utils/
    emailService.js
    placementRules.js
  server.js
```

## Mongoose Schemas

### User
- `name`: string
- `email`: unique string
- `password`: hashed string
- `role`: `admin | student | recruiter`
- `branch`: string
- `cgpa`: number
- `resumeUrl`: string
- `backlogs`: number

### Drive
- `companyName`: string
- `jobRole`: string
- `jobDescription`: string
- `eligibilityCriteria.minCGPA`: number
- `eligibilityCriteria.eligibleBranches`: string array
- `packageCTC`: string
- `bond`: string
- `applicationDeadline`: date
- `status`: `Active | Archived`
- `recruiterId`: optional reference to `User`

### Application
- `studentId`: ref `User`
- `driveId`: ref `Drive`
- `currentRound`: `Applied | Round 1 | Round 2 | Technical Interview | HR Interview | Selected | Rejected`
- `updatedBy`: ref `User`

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Students
- `GET /api/students?minCGPA=8.0&branch=CSE`
- `POST /api/students`
- `GET /api/students/:id`
- `PUT /api/students/:id`
- `DELETE /api/students/:id`

### Drives
- `GET /api/drives`
- `POST /api/drives`
- `GET /api/drives/:id`
- `PUT /api/drives/:id`
- `DELETE /api/drives/:id`

### Applications
- `POST /api/applications/apply`
- `PUT /api/applications/:id/status`
- `GET /api/applications/status?studentId=...&driveId=...`
- `GET /api/applications/all`

## Core Logic

### Eligibility Filter
The same rule is used everywhere:
`student.cgpa >= drive.eligibilityCriteria.minCGPA` and `student.branch` must exist in `drive.eligibilityCriteria.eligibleBranches`.

### Status Update Flow
1. Admin updates the application round.
2. The application stores `updatedBy`.
3. The email helper sends a notification.
4. If email credentials are missing, the helper falls back to a mock console log.

## Frontend Component Structure

```text
frontend/src/
  components/
    layout/
      Sidebar.jsx
      Topbar.jsx
      DashboardShell.jsx
    shared/
      MetricCard.jsx
      DataTable.jsx
      StatusBadge.jsx
      FilterPanel.jsx
      Timeline.jsx
      KanbanBoard.jsx
      DriveCard.jsx
  pages/
    auth/
      Login.jsx
      Signup.jsx
    admin/
      AdminDashboard.jsx
      StudentDirectory.jsx
      DriveManagement.jsx
      TrackingMatrix.jsx
    student/
      StudentDashboard.jsx
      JobBoard.jsx
      MyApplications.jsx
      ProfileEditor.jsx
    recruiter/
      RecruiterDashboard.jsx
```

## Implementation Steps

1. Create the Mongoose schemas and auth middleware.
2. Add drive CRUD APIs and student filtering APIs.
3. Add application apply/update/status routes with eligibility checks.
4. Add email notifications for round changes.
5. Build the React dashboard shell, then role-specific pages.
6. Connect the frontend to the JWT-protected backend APIs.