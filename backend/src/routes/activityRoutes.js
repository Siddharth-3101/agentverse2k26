import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import * as activityController from '../controllers/activityController.js';
import { authenticateUser, requireRole } from '../middleware/auth.js';

const router = Router();

// Ensure upload temp directory exists
const uploadDir = path.resolve(process.cwd(), 'uploads', 'temp');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
});

// Optional token extractor middleware (does not block unauthenticated development requests)
const optionalAuth = (req, res, next) => {
  if (req.headers.authorization) {
    return authenticateUser(req, res, next);
  }
  next();
};

// ─── General Activity Routes ────────────────────────────────────────────────
router.get(['/activities', '/events', '/activity'], activityController.getActivities);
router.get(['/activities/:activityId', '/events/:activityId', '/activity/:activityId'], activityController.getActivityById);
router.post(['/activities', '/events', '/activity'], optionalAuth, activityController.createActivity);
router.put(['/activities/:activityId', '/events/:activityId', '/activity/:activityId'], optionalAuth, activityController.updateActivity);
router.delete(['/activities/:activityId', '/events/:activityId', '/activity/:activityId'], optionalAuth, activityController.deleteActivity);

// ─── Student & Club Activities ──────────────────────────────────────────────
router.get(['/students/:studentId/activities', '/student/:studentId/activities', '/student/:studentId', '/students/:studentId/events'], optionalAuth, activityController.getStudentActivities);
router.post(['/students/:studentId/activities', '/student/:studentId/activities', '/students/:studentId/events'], optionalAuth, activityController.registerForActivity);
router.post('/student/:studentId/:activityId', optionalAuth, (req, res, next) => {
  req.body.activityId = req.params.activityId;
  return activityController.registerForActivity(req, res, next);
});
router.get(['/clubs/:clubId/activities', '/club/:clubId/activities', '/clubs/:clubId/events'], activityController.getClubActivities);

// ─── Certificate Routes (AI Upload, Retrieve, Manage) ───────────────────────
router.get(['/certificates', '/certificate'], optionalAuth, activityController.getCertificates);
router.get(['/student/:studentId/certificates', '/students/:studentId/certificates', '/student/:studentId/certs'], optionalAuth, activityController.getCertificates);
router.post(['/certificates', '/certificate'], optionalAuth, activityController.addCertificate);
router.post(['/certificates/upload', '/certificate/upload'], upload.single('certificate'), optionalAuth, activityController.uploadCertificate);
router.patch(['/certificates/:certId/status', '/certificates/:certId'], optionalAuth, activityController.updateCertificateStatus);
router.put(['/certificates/:certId/status', '/certificates/:certId'], optionalAuth, activityController.updateCertificateStatus);

// ─── AI Portfolio Routes ────────────────────────────────────────────────────
router.post(['/portfolio/generate', '/portfolio'], optionalAuth, activityController.generatePortfolio);
router.get(['/portfolio/generate', '/portfolio'], optionalAuth, activityController.generatePortfolio);
router.get(['/portfolio/pdf', '/portfolio/download'], optionalAuth, activityController.downloadPortfolioPDF);

export default router;

