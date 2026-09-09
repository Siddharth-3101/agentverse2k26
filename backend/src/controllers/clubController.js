import * as clubService from '../services/clubService.js';

export async function getClubs(req, res, next) {
  try {
    const clubs = await clubService.getAllClubs();
    res.json({ success: true, data: clubs });
  } catch (err) {
    next(err);
  }
}

export async function getClubById(req, res, next) {
  try {
    const club = await clubService.getClubById(req.params.clubId);
    res.json({ success: true, data: club });
  } catch (err) {
    next(err);
  }
}

export async function getClubMembers(req, res, next) {
  try {
    const members = await clubService.getClubMembers(req.params.clubId);
    res.json({ success: true, data: members });
  } catch (err) {
    next(err);
  }
}

export async function getClubMentor(req, res, next) {
  try {
    const mentor = await clubService.getClubMentor(req.params.clubId);
    res.json({ success: true, data: mentor });
  } catch (err) {
    next(err);
  }
}

export async function getStudentClubs(req, res, next) {
  try {
    const clubs = await clubService.getStudentClubs(req.params.studentId);
    res.json({ success: true, data: clubs });
  } catch (err) {
    next(err);
  }
}

export async function getTeacherClub(req, res, next) {
  try {
    const club = await clubService.getTeacherClub(req.params.teacherId);
    res.json({ success: true, data: club });
  } catch (err) {
    next(err);
  }
}

export async function createClub(req, res, next) {
  try {
    const newClub = await clubService.createClub(req.body);
    res.status(201).json({ success: true, data: newClub, message: 'Club created successfully.' });
  } catch (err) {
    next(err);
  }
}

export async function updateClub(req, res, next) {
  try {
    const updated = await clubService.updateClub(req.params.clubId, req.body);
    res.json({ success: true, data: updated, message: 'Club updated successfully.' });
  } catch (err) {
    next(err);
  }
}
