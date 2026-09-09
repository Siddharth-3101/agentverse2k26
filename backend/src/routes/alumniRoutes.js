import { Router } from 'express';
import * as alumniController from '../controllers/alumniController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

const optionalAuth = (req, res, next) => {
  if (req.headers.authorization) {
    return authenticateUser(req, res, next);
  }
  next();
};

router.get(['/alumni', '/alumnis'], optionalAuth, alumniController.getAllAlumni);
router.get(['/clubs/:clubId/alumni', '/club/:clubId/alumni'], optionalAuth, alumniController.getClubAlumni);
router.get(['/alumni/:alumniId'], optionalAuth, alumniController.getAlumniById);
router.post(['/alumni/:alumniId/contact', '/alumni/:alumniId/message'], optionalAuth, alumniController.contactAlumnus);

export default router;
