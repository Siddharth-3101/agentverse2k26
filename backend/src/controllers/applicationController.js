import * as applicationService from '../services/applicationService.js';

export async function submitApplication(req, res, next) {
  try {
    const studentUserId = req.user.id;
    const application = await applicationService.submitApplication(studentUserId, req.body);
    res.status(201).json({
      success: true,
      data: application,
      message: 'Application submitted successfully. Assigned teacher notified.',
    });
  } catch (err) {
    next(err);
  }
}

export async function getMyApplications(req, res, next) {
  try {
    const apps = await applicationService.getStudentApplications(req.user.id);
    res.json({ success: true, data: apps });
  } catch (err) {
    next(err);
  }
}

export async function getApplicationById(req, res, next) {
  try {
    const app = await applicationService.getApplicationById(req.params.applicationId);
    
    // Check authorization: Student can only view own app, Teacher can view if for their club
    if (req.user.role === 'STUDENT' && app.student_id != req.user.id) {
      return res.status(403).json({ success: false, message: 'Forbidden. Access denied to another student application.' });
    }

    res.json({ success: true, data: app });
  } catch (err) {
    next(err);
  }
}

export async function getTeacherApplications(req, res, next) {
  try {
    const apps = await applicationService.getTeacherApplications(req.user.id);
    res.json({ success: true, data: apps });
  } catch (err) {
    next(err);
  }
}

export async function getTeacherApplicationById(req, res, next) {
  try {
    const app = await applicationService.getApplicationById(req.params.applicationId);
    
    // Verify teacher owns the club
    const teacherApps = await applicationService.getTeacherApplications(req.user.id);
    const ownsApp = teacherApps.some((a) => a.id == req.params.applicationId);

    if (!ownsApp) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You can only view applications belonging to your assigned club.',
      });
    }

    res.json({ success: true, data: app });
  } catch (err) {
    next(err);
  }
}

export async function updateApplicationStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status field is required (ACCEPTED or REJECTED).' });
    }

    const updated = await applicationService.reviewApplication(req.user.id, req.params.applicationId, status);
    res.json({
      success: true,
      data: updated,
      message: `Application has been ${status.toLowerCase()} successfully.`,
    });
  } catch (err) {
    next(err);
  }
}
