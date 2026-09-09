import fs from 'fs';
import path from 'path';
import * as activityService from '../services/activityService.js';
import { certFrontendAdapter } from '../services/aiService.js';

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
    const studentId = req.user?.id || req.params.studentId || 2;
    const certs = await activityService.getStudentCertificates(studentId);
    
    // Adapt to frontend UI shape if requested
    const formatted = certs.map((c) => {
      const extracted = typeof c.extracted_data === 'string' ? JSON.parse(c.extracted_data || '{}') : (c.extracted_data || {});
      const skills = typeof c.skills === 'string' ? JSON.parse(c.skills || '[]') : (c.skills || []);
      return {
        id: `cert-${c.id}`,
        dbId: c.id,
        title: c.title || extracted.certificate_title || 'Certificate',
        issuer: c.organization || extracted.issuing_organization || 'Issuer',
        issueDate: c.issue_date || extracted.date || 'Sep 2026',
        category: c.category || extracted.category || 'Coursework',
        credentialId: c.credential_id || extracted.credential_id || `AV-CERT-${c.id}`,
        grade: c.achievement || extracted.achievement || 'Verified Completion',
        skills: skills.length > 0 ? skills : (extracted.skills || ['Verified Skill']),
        isVerified: c.verification_status === 'HUMAN_VERIFIED',
        verificationStatus: c.verification_status,
        confidenceScore: c.confidence_score,
        verificationUrl: `https://agentverse.edu/verify/${c.credential_id || c.id}`,
        description: extracted.description || c.title || 'Verified credential.',
      };
    });

    res.json({ success: true, data: formatted });
  } catch (err) {
    next(err);
  }
}

export async function addCertificate(req, res, next) {
  try {
    const studentId = req.user?.id || req.body.student_id || 2;
    const cert = await activityService.addCertificate(studentId, req.body);
    res.status(201).json({ success: true, data: cert, message: 'Certificate added successfully.' });
  } catch (err) {
    next(err);
  }
}

/**
 * AI Certificate Upload & OCR Extraction Controller
 */
export async function uploadCertificate(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No certificate file uploaded.' });
    }

    const studentId = req.user?.id || 2;
    const filePath = req.file.path;
    const fileName = req.file.originalname;
    const mimeType = req.file.mimetype;

    const result = await activityService.processAndSaveCertificate(studentId, filePath, fileName, mimeType);

    res.status(201).json(result);
  } catch (err) {
    console.error('[AI Certificate Upload Error]:', err);
    res.status(err.status || 500).json({
      success: false,
      error: err.message || 'AI Certificate processing failed.',
    });
  }
}

/**
 * Update Certificate Verification Status (Admin/Teacher)
 */
export async function updateCertificateStatus(req, res, next) {
  try {
    const certId = req.params.certId;
    const { status } = req.body;
    const updated = await activityService.updateCertificateStatus(certId, status);
    res.json({ success: true, data: updated, message: `Certificate status updated to ${status}.` });
  } catch (err) {
    next(err);
  }
}

/**
 * AI Portfolio Generation Controller
 */
export async function generatePortfolio(req, res, next) {
  try {
    const studentId = req.user?.id || 2;
    const result = await activityService.generateStudentPortfolio(studentId);
    res.json({ success: true, data: result.portfolio || result });
  } catch (err) {
    console.error('[Portfolio Generation Error]:', err);
    res.status(500).json({ success: false, error: 'PORTFOLIO_GENERATION_FAILED', message: err.message });
  }
}

/**
 * AI Portfolio PDF Export & Stream Controller
 */
export async function downloadPortfolioPDF(req, res, next) {
  try {
    const studentId = req.user?.id || 2;
    const tempDir = path.resolve(process.cwd(), 'temp');
    const tempPdfPath = path.join(tempDir, `portfolio_${studentId}_${Date.now()}.pdf`);

    const result = await activityService.generatePortfolioPDF(studentId, tempPdfPath);
    const filename = `${result.portfolio?.name || 'Student'}_Portfolio.pdf`.replace(/\s+/g, '_');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    const stream = fs.createReadStream(tempPdfPath);
    stream.pipe(res);
    stream.on('finish', () => {
      try {
        if (fs.existsSync(tempPdfPath)) fs.unlinkSync(tempPdfPath);
      } catch (e) {
        // ignore unlink error
      }
    });
  } catch (err) {
    console.error('[PDF Export Error]:', err);
    res.status(500).json({ success: false, error: 'PDF_EXPORT_FAILED', message: err.message });
  }
}
