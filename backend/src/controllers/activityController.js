import * as activityService from '../services/activityService.js';

export async function getActivities(req, res, next) {
  try {
    const activities = await activityService.getAllActivities(req.query);
    res.json({ success: true, data: activities });
  } catch (err) {
    next(err);
  }
}

export async function getActivityById(req, res, next) {
  try {
    const activity = await activityService.getActivityById(req.params.activityId);
    res.json({ success: true, data: activity });
  } catch (err) {
    next(err);
  }
}

export async function createActivity(req, res, next) {
  try {
    const newActivity = await activityService.createActivity(req.body);
    res.status(201).json({ success: true, data: newActivity, message: 'Activity created successfully.' });
  } catch (err) {
    next(err);
  }
}

export async function updateActivity(req, res, next) {
  try {
    const updated = await activityService.updateActivity(req.params.activityId, req.body);
    res.json({ success: true, data: updated, message: 'Activity updated successfully.' });
  } catch (err) {
    next(err);
  }
}

export async function deleteActivity(req, res, next) {
  try {
    const result = await activityService.deleteActivity(req.params.activityId);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function getStudentActivities(req, res, next) {
  try {
    const studentId = req.params.studentId || req.user.id;
    const activities = await activityService.getStudentActivities(studentId);
    res.json({ success: true, data: activities });
  } catch (err) {
    next(err);
  }
}

export async function registerForActivity(req, res, next) {
  try {
    const studentId = req.params.studentId || req.user.id;
    const { activityId } = req.body;
    const registered = await activityService.registerStudentForActivity(studentId, activityId, req.body);
    res.status(201).json({ success: true, data: registered, message: 'Registered for activity.' });
  } catch (err) {
    next(err);
  }
}

export async function getClubActivities(req, res, next) {
  try {
    const activities = await activityService.getClubActivities(req.params.clubId);
    res.json({ success: true, data: activities });
  } catch (err) {
    next(err);
  }
}

export async function getCertificates(req, res, next) {
  try {
    const studentId = req.user.id;
    const certs = await activityService.getStudentCertificates(studentId);
    res.json({ success: true, data: certs });
  } catch (err) {
    next(err);
  }
}

export async function addCertificate(req, res, next) {
  try {
    const studentId = req.user.id;
    const cert = await activityService.addCertificate(studentId, req.body);
    res.status(201).json({ success: true, data: cert, message: 'Certificate added successfully.' });
  } catch (err) {
    next(err);
  }
}
