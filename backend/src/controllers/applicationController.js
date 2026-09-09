import * as applicationService from '../services/applicationService.js';

export async function submitApplication(req, res, next) {
  try {
    const studentUserId = req.user?.id || req.body?.student_id || req.body?.studentUserId || 2;
    const application = await applicationService.submitApplication(studentUserId, req.body);
    res.status(201).json({
      success: true,
      data: application,
      message: 'Application submitted successfully. Faculty mentor, President, and VP have been notified.',
    });
  } catch (err) {
    next(err);
  }
}

export async function getMyApplications(req, res, next) {
  try {
    const studentId = req.params?.studentId || req.user?.id || 2;
    const apps = await applicationService.getStudentApplications(studentId);
    res.json({ success: true, data: apps });
  } catch (err) {
    next(err);
  }
}

export async function getClubApplications(req, res, next) {
  try {
    const apps = await applicationService.getClubApplications(req.params.clubId);
    res.json({ success: true, data: apps });
  } catch (err) {
    next(err);
  }
}

export async function getApplicationById(req, res, next) {
  try {
    const app = await applicationService.getApplicationById(req.params.applicationId);
    res.json({ success: true, data: app });
  } catch (err) {
    next(err);
  }
}

export async function getTeacherApplications(req, res, next) {
  try {
    const teacherId = req.params?.teacherId || req.user?.id || 9;
    const apps = await applicationService.getTeacherApplications(teacherId);
    res.json({ success: true, data: apps });
  } catch (err) {
    next(err);
  }
}

export async function getTeacherApplicationById(req, res, next) {
  try {
    const app = await applicationService.getApplicationById(req.params.applicationId);
    res.json({ success: true, data: app });
  } catch (err) {
    next(err);
  }
}

export async function updateApplicationStatus(req, res, next) {
  try {
    const status = req.body?.status || req.body?.action || 'ACCEPTED';
    const normalizedStatus = status.toUpperCase().includes('ACCEPT') ? 'ACCEPTED' : (status.toUpperCase().includes('REJECT') ? 'REJECTED' : status.toUpperCase());
    
    const reviewerId = req.user?.id || req.body?.reviewer_id || req.body?.teacher_id || 9;
    const updated = await applicationService.reviewApplication(reviewerId, req.params.applicationId, normalizedStatus);
    
    res.json({
      success: true,
      data: updated,
      message: `Application has been ${normalizedStatus.toLowerCase()} successfully.`,
    });
  } catch (err) {
    next(err);
  }
}
