import * as alumniService from '../services/alumniService.js';

export async function getClubAlumni(req, res, next) {
  try {
    const clubId = req.params.clubId;
    const alumni = await alumniService.getAlumniByClubId(clubId);
    res.json({ success: true, data: alumni });
  } catch (err) {
    next(err);
  }
}

export async function getAllAlumni(req, res, next) {
  try {
    const filters = {
      clubId: req.query.club_id || req.query.clubId || null,
      company: req.query.company || null,
      search: req.query.search || null,
    };
    const alumni = await alumniService.getAllAlumni(filters);
    res.json({ success: true, data: alumni });
  } catch (err) {
    next(err);
  }
}

export async function getAlumniById(req, res, next) {
  try {
    const alumnus = await alumniService.getAlumniById(req.params.alumniId);
    res.json({ success: true, data: alumnus });
  } catch (err) {
    next(err);
  }
}

export async function contactAlumnus(req, res, next) {
  try {
    const studentUserId = req.user?.id || req.body.student_id || 1;
    const alumniId = req.params.alumniId;
    const result = await alumniService.sendAlumniContactMessage(studentUserId, alumniId, req.body);
    res.status(201).json({ success: true, data: result, message: 'Mentorship request sent successfully.' });
  } catch (err) {
    next(err);
  }
}
