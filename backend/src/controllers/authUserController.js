import * as authUserService from '../services/authUserService.js';

export async function login(req, res, next) {
  try {
    const { email, password, password_hash } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }
    const data = await authUserService.loginUser({ email, password, password_hash });
    res.json({ success: true, data, message: 'Login successful.' });
  } catch (err) {
    next(err);
  }
}

export async function getMe(req, res, next) {
  try {
    const userProfile = await authUserService.getUserProfile(req.user.id);
    res.json({ success: true, data: userProfile });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res) {
  res.json({ success: true, message: 'Logged out successfully.' });
}

export async function getProfile(req, res, next) {
  try {
    const profile = await authUserService.getUserProfile(req.user.id);
    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const updated = await authUserService.updateUserProfile(req.user.id, req.body);
    res.json({ success: true, data: updated, message: 'Profile updated successfully.' });
  } catch (err) {
    next(err);
  }
}

export async function getStudent(req, res, next) {
  try {
    const student = await authUserService.getStudentById(req.params.studentId);
    res.json({ success: true, data: student });
  } catch (err) {
    next(err);
  }
}

export async function updateStudent(req, res, next) {
  try {
    // Only student themselves or teacher/admin can update student details
    if (req.user.role === 'STUDENT' && req.user.id != req.params.studentId) {
      return res.status(403).json({ success: false, message: 'Forbidden. You can only update your own profile.' });
    }
    const updated = await authUserService.updateStudentDetails(req.params.studentId, req.body);
    res.json({ success: true, data: updated, message: 'Student details updated.' });
  } catch (err) {
    next(err);
  }
}

export async function getTeacher(req, res, next) {
  try {
    const teacher = await authUserService.getTeacherById(req.params.teacherId);
    res.json({ success: true, data: teacher });
  } catch (err) {
    next(err);
  }
}

export async function updateTeacher(req, res, next) {
  try {
    // Only teacher themselves or admin can update teacher details
    if (req.user.role === 'TEACHER' && req.user.id != req.params.teacherId) {
      return res.status(403).json({ success: false, message: 'Forbidden. You can only update your own profile.' });
    }
    const updated = await authUserService.updateTeacherDetails(req.params.teacherId, req.body);
    res.json({ success: true, data: updated, message: 'Teacher details updated.' });
  } catch (err) {
    next(err);
  }
}
