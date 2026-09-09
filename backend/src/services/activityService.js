import fs from 'fs';
import path from 'path';
import { getPool } from '../config/db.js';
import {
  certIntelligenceModel,
  certFrontendAdapter,
  portfolioGenerator,
  portfolioPdfGen,
} from './aiService.js';

const formatDateForDb = (dateVal) => {
  if (!dateVal) return null;
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return null;
    return d.toISOString().slice(0, 19).replace('T', ' ');
  } catch {
    return null;
  }
};

export async function getAllActivities(query = {}) {
  const pool = getPool();
  const { activity_type, limit, organizer, club_id } = query;

  let sql = 'SELECT * FROM activities WHERE 1=1';
  const params = [];

  if (activity_type && activity_type !== 'All') {
    sql += ' AND activity_type = ?';
    params.push(activity_type);
  }

  if (organizer) {
    sql += ' AND (organizer = ? OR organizer LIKE ?)';
    params.push(organizer, `%${organizer}%`);
  }

  if (club_id) {
    sql += ' AND organizer = (SELECT name FROM clubs WHERE id = ?)';
    params.push(club_id);
  }

  sql += ' ORDER BY start_date DESC, created_at DESC';

  if (limit) {
    sql += ' LIMIT ?';
    params.push(parseInt(limit, 10));
  }

  const [activities] = await pool.query(sql, params);
  return activities;
}

export async function getActivityById(activityId) {
  const pool = getPool();
  const [activities] = await pool.query('SELECT * FROM activities WHERE id = ?', [activityId]);

  if (activities.length === 0) {
    throw { status: 404, message: 'Activity not found.' };
  }

  return activities[0];
}

export async function createActivity(data) {
  const pool = getPool();
  const {
    title,
    description,
    activity_type,
    organizer,
    college,
    start_date,
    end_date,
    location,
    mode,
    fee,
    team_size,
    deadline,
    logo_url,
    banner_url,
    google_form_url,
    is_featured,
    tags,
    eligibility,
    contact_numbers,
  } = data;

  if (!title) {
    throw { status: 400, message: 'Title is a required field.' };
  }

  const actType = activity_type || 'Competitions';
  
  const toValidJson = (val) => {
    if (!val) return null;
    if (typeof val === 'object') return JSON.stringify(val);
    try {
      JSON.parse(val);
      return val;
    } catch {
      return JSON.stringify([val]);
    }
  };

  const tagsJson = toValidJson(tags);
  const eligibilityJson = toValidJson(eligibility);
  const contactJson = toValidJson(contact_numbers);

  const formattedStartDate = formatDateForDb(start_date);
  const formattedEndDate = formatDateForDb(end_date);
  const formattedDeadline = formatDateForDb(deadline);

  const [result] = await pool.query(
    `INSERT INTO activities (title, description, activity_type, organizer, college, start_date, end_date, location, mode, fee, team_size, deadline, logo_url, banner_url, google_form_url, is_featured, tags, eligibility, contact_numbers)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      title,
      description || null,
      actType,
      organizer || null,
      college || null,
      formattedStartDate,
      formattedEndDate,
      location || null,
      mode || 'Offline',
      fee || 'Free',
      team_size || null,
      formattedDeadline,
      logo_url || null,
      banner_url || null,
      google_form_url || null,
      is_featured ? 1 : 0,
      tagsJson,
      eligibilityJson,
      contactJson,
    ]
  );

  return getActivityById(result.insertId);
}

export async function updateActivity(activityId, data) {
  const pool = getPool();
  const {
    title,
    description,
    activity_type,
    organizer,
    start_date,
    end_date,
    location,
    mode,
    fee,
    team_size,
    deadline,
    logo_url,
    banner_url,
    google_form_url,
    is_featured,
    tags,
    eligibility,
  } = data;

  await getActivityById(activityId);

  const tagsJson = tags !== undefined ? JSON.stringify(tags) : undefined;
  const eligibilityJson = eligibility !== undefined ? JSON.stringify(eligibility) : undefined;

  await pool.query(
    `UPDATE activities 
     SET title = COALESCE(?, title),
         description = COALESCE(?, description),
         activity_type = COALESCE(?, activity_type),
         organizer = COALESCE(?, organizer),
         start_date = COALESCE(?, start_date),
         end_date = COALESCE(?, end_date),
         location = COALESCE(?, location),
         mode = COALESCE(?, mode),
         fee = COALESCE(?, fee),
         team_size = COALESCE(?, team_size),
         deadline = COALESCE(?, deadline),
         logo_url = COALESCE(?, logo_url),
         banner_url = COALESCE(?, banner_url),
         google_form_url = COALESCE(?, google_form_url),
         is_featured = COALESCE(?, is_featured),
         tags = COALESCE(?, tags),
         eligibility = COALESCE(?, eligibility)
     WHERE id = ?`,
    [
      title,
      description,
      activity_type,
      organizer,
      start_date,
      end_date,
      location,
      mode,
      fee,
      team_size,
      deadline,
      logo_url,
      banner_url,
      google_form_url,
      is_featured !== undefined ? (is_featured ? 1 : 0) : undefined,
      tagsJson,
      eligibilityJson,
      activityId,
    ]
  );

  return getActivityById(activityId);
}

export async function deleteActivity(activityId) {
  const pool = getPool();
  await getActivityById(activityId);
  await pool.query('DELETE FROM activities WHERE id = ?', [activityId]);
  return { success: true, message: 'Activity deleted successfully.' };
}

export async function getStudentActivities(studentUserId) {
  const pool = getPool();
  const [studentActs] = await pool.query(
    `SELECT sa.id as registration_id, sa.participation_status, sa.achievement, sa.certificate_url as student_cert_url, sa.created_at as registered_at,
            a.* 
     FROM student_activities sa 
     JOIN activities a ON sa.activity_id = a.id 
     WHERE sa.student_id = ? 
     ORDER BY a.start_date DESC`,
    [studentUserId]
  );
  return studentActs;
}

export async function registerStudentForActivity(studentUserId, activityId, data = {}) {
  const pool = getPool();
  const { participation_status, achievement, certificate_url } = data;

  await getActivityById(activityId);

  await pool.query(
    `INSERT INTO student_activities (student_id, activity_id, participation_status, achievement, certificate_url)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE 
       participation_status = COALESCE(VALUES(participation_status), participation_status),
       achievement = COALESCE(VALUES(achievement), achievement),
       certificate_url = COALESCE(VALUES(certificate_url), certificate_url)`,
    [
      studentUserId,
      activityId,
      participation_status || 'REGISTERED',
      achievement || null,
      certificate_url || null,
    ]
  );

  return getStudentActivities(studentUserId);
}

export async function getClubActivities(clubId) {
  const pool = getPool();
  const [club] = await pool.query('SELECT name FROM clubs WHERE id = ?', [clubId]);
  const organizerName = club[0]?.name || '';

  const [activities] = await pool.query(
    `SELECT * FROM activities WHERE organizer = ? OR organizer LIKE ? ORDER BY start_date DESC`,
    [organizerName, `%${organizerName}%`]
  );
  return activities;
}

export async function getStudentCertificates(studentUserId) {
  const pool = getPool();
  const [certs] = await pool.query(
    `SELECT * FROM certificates WHERE student_id = ? ORDER BY created_at DESC`,
    [studentUserId]
  );
  return certs;
}

export async function getCertificateById(certId) {
  const pool = getPool();
  const [certs] = await pool.query('SELECT * FROM certificates WHERE id = ?', [certId]);
  if (certs.length === 0) {
    throw { status: 404, message: 'Certificate not found.' };
  }
  return certs[0];
}

export async function addCertificate(studentUserId, data) {
  const pool = getPool();
  const {
    title,
    organization,
    category,
    top_level_category,
    issue_date,
    credential_id,
    achievement,
    skills,
    verification_status,
    confidence_score,
    flagged_fields,
    raw_ocr_text,
    file_path,
    certificate_url,
    extracted_data,
  } = data;

  if (!title) {
    throw { status: 400, message: 'Certificate title is required.' };
  }

  const skillsJson = skills ? JSON.stringify(skills) : null;
  const flaggedJson = flagged_fields ? JSON.stringify(flagged_fields) : null;
  const extractedJson = extracted_data ? JSON.stringify(extracted_data) : null;

  const [result] = await pool.query(
    `INSERT INTO certificates 
     (student_id, title, organization, category, top_level_category, issue_date, credential_id, achievement, skills, verification_status, confidence_score, flagged_fields, raw_ocr_text, file_path, certificate_url, extracted_data)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      studentUserId,
      title,
      organization || null,
      category || 'Coursework',
      top_level_category || 'Certifications',
      issue_date || null,
      credential_id || null,
      achievement || null,
      skillsJson,
      verification_status || 'PENDING',
      confidence_score || 0.0,
      flaggedJson,
      raw_ocr_text || null,
      file_path || null,
      certificate_url || null,
      extractedJson,
    ]
  );

  return getCertificateById(result.insertId);
}

export async function updateCertificateStatus(certId, status) {
  const pool = getPool();
  const validStatuses = ['PENDING', 'HUMAN_VERIFIED', 'REJECTED'];
  if (!validStatuses.includes(status)) {
    throw { status: 400, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` };
  }

  await getCertificateById(certId);
  await pool.query('UPDATE certificates SET verification_status = ? WHERE id = ?', [status, certId]);
  return getCertificateById(certId);
}

/**
 * AI Certificate Extraction Pipeline
 * Reads uploaded certificate file, processes via CertificateIntelligenceModel, saves into DB,
 * and returns adapted frontend payload.
 */
export async function processAndSaveCertificate(studentUserId, filePath, fileName, mimeType) {
  const pool = getPool();

  // 1. Process via AI Intelligence Model
  const aiResult = await certIntelligenceModel.processCertificate(filePath, fileName, mimeType);

  if (!aiResult || !aiResult.success) {
    throw {
      status: 422,
      message: aiResult?.error || 'OCR or document parsing failed. Please upload a clearer PDF or image.',
    };
  }

  const extracted = aiResult.extracted_data || {};
  const confidence = aiResult.confidence || {};
  const textInfo = aiResult.text_extraction || {};

  const title = extracted.certificate_title || fileName || 'Verified Certificate';
  const organization = extracted.issuing_organization || 'Academic Institution';
  const category = extracted.category || 'Coursework';
  const topLevelCategory = extracted.topLevelCategory || 'Certifications';
  const issueDate = extracted.date || extracted.issue_date || null;
  const credentialId = extracted.credential_id || null;
  const achievement = extracted.achievement || null;
  const skills = extracted.skills || [];
  const flaggedFields = confidence.flagged_fields || [];
  const rawOcrText = textInfo.raw_text || '';
  const overallConfidence = confidence.overall || 0.0;

  // 2. Insert into MySQL DB
  const [result] = await pool.query(
    `INSERT INTO certificates 
     (student_id, title, organization, category, top_level_category, issue_date, credential_id, achievement, skills, verification_status, confidence_score, flagged_fields, raw_ocr_text, file_path, extracted_data)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?, ?, ?, ?, ?)`,
    [
      studentUserId,
      title,
      organization,
      category,
      topLevelCategory,
      issueDate,
      credentialId,
      achievement,
      JSON.stringify(skills),
      overallConfidence,
      JSON.stringify(flaggedFields),
      rawOcrText,
      filePath,
      JSON.stringify(extracted),
    ]
  );

  const certId = result.insertId;
  const dbRecord = await getCertificateById(certId);

  // 3. Map to React UI component format
  const frontendPayload = certFrontendAdapter.toFrontend(extracted, certId);

  return {
    success: true,
    data: frontendPayload,
    dbRecord,
    confidence: aiResult.confidence,
    verification: aiResult.verification,
  };
}

/**
 * AI Portfolio Synthesis
 * Combines student profile, verified credentials, activities, and projects into grounded portfolio JSON.
 */
export async function generateStudentPortfolio(studentUserId) {
  const pool = getPool();

  // 1. Fetch user + student profile
  const [users] = await pool.query(
    `SELECT u.id, u.full_name, u.email, u.department, u.year_of_study, sp.student_id as student_id_number
     FROM users u
     LEFT JOIN student_profiles sp ON u.id = sp.user_id
     WHERE u.id = ?`,
    [studentUserId]
  );

  const user = users[0] || { id: studentUserId, full_name: 'Student', email: '' };

  const profile = {
    id: user.id,
    name: user.full_name,
    full_name: user.full_name,
    email: user.email,
    department: user.department || 'Computer Science and Engineering',
    university: 'Government Engineering College / DCRUST',
    institution: 'Government Engineering College',
    batch: `Batch of ${2027 - (user.year_of_study || 2)} (${user.year_of_study || 3}rd Year)`,
    github: 'https://github.com/Siddharth-3101',
    linkedin: 'https://linkedin.com/in/siddharth-mehta',
  };

  // 2. Fetch certificates
  const [certs] = await pool.query(
    `SELECT * FROM certificates WHERE student_id = ? ORDER BY created_at DESC`,
    [studentUserId]
  );

  // Parse JSON fields safely
  const parsedCerts = certs.map((c) => ({
    ...c,
    certificate_title: c.title,
    issuing_organization: c.organization,
    skills: typeof c.skills === 'string' ? JSON.parse(c.skills || '[]') : (c.skills || []),
    extracted_data: typeof c.extracted_data === 'string' ? JSON.parse(c.extracted_data || '{}') : (c.extracted_data || {}),
  }));

  // 3. Fetch student activities
  const activities = await getStudentActivities(studentUserId);

  // 4. Projects (dummy or from DB if available)
  const projects = [
    {
      id: 'proj-1',
      title: 'AgentVerse — Autonomous Campus Intelligence Platform',
      tech: ['React', 'Node.js', 'Express', 'Tailwind', 'Python', 'Recharts'],
      description: 'A comprehensive university governance portal connecting students, societies, and faculty with automated role verification and skill telemetry.',
      link: 'https://github.com/Siddharth-3101/agentverse2k26',
    },
    {
      id: 'proj-2',
      title: 'DeFi AgriShield Micro-Lending Portal',
      tech: ['Solidity', 'Node.js', 'ZK-Proofs', 'React'],
      description: 'Decentralized credit appraisal engine allowing rural farmers to verify crop yields on-chain without exposing private financial disclosures.',
      link: 'https://github.com/Siddharth-3101',
    },
  ];

  const result = portfolioGenerator.generatePortfolio(profile, parsedCerts, activities, projects);
  return result;
}

/**
 * AI Portfolio PDF Export
 */
export async function generatePortfolioPDF(studentUserId, outputPath) {
  const portfolioResult = await generateStudentPortfolio(studentUserId);
  const portfolioData = portfolioResult.portfolio || portfolioResult;

  // Ensure output directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  portfolioPdfGen.generatePDF(portfolioData, outputPath);
  return { success: true, filePath: outputPath, portfolio: portfolioData };
}
