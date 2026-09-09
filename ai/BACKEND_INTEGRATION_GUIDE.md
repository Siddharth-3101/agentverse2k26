# Backend Integration Guide for Teammates
## Integrating the Independent AI Module with Node.js / Express Backend

This document explains how the backend engineering team can connect the independent AI module (`/ai`) to your REST API endpoints, database, and file storage.

---

## 1. Directory Overview (`/ai`)

All AI files are self-contained CommonJS modules located in `c:\Users\alagu\sid-clubs\agentverse2k26-friend\ai\`:

| File | Purpose | Main Class / Method |
|---|---|---|
| `CertificateIntelligenceModel.js` | Master Certificate Extractor Pipeline | `async processCertificate(filePath, fileName, mimeType)` |
| `CareerPathRecommenderModel.js` | 10-Career Roadmap Matching & Progression Engine | `evaluateCareerPath(profile, certs, selectedRole)` |
| `WeeklyAnalysisModel.js` | Dual Streaks & Activity Velocity Engine | `analyzeWeeklyActivity(profile, certs, activities, projects)` |
| `AIPortfolioGeneratorModel.js` | Evidence-Grounded Portfolio Generator | `generatePortfolio(profile, certificates, activities, projects)` |
| `AIPortfolioPDFGenerator.js` | PDF Portfolio Exporter | `generatePDF(portfolio, outputPath)` |
| `RecommendationEngine.js` | Skill-matched Club & Event Recommendations | `filterAndRankClubs(profile, certs, pool)` / `recommendEvents(...)` |
| `CertificateFrontendAdapter.js` | Converts AI internal data to React UI shape | `toFrontend(aiCert, id)` / `toFrontendArray(aiCerts)` |
| `roadmapTaxonomy.js` | Roadmap.sh Skill Trees (10 Pre-loaded Careers) | `getRoadmap(roleName)` / `getAllRoles()` |
| `OllamaService.js` | Local Ollama LLM Anti-Hallucination Service | `isAvailable()` / `generateGroundedEntities(...)` |
| `DocumentTextExtractor.js` | PDF parsing + Tesseract OCR | `async extractText(filePath, mimeType)` |
| `InformationExtractor.js` | Null-safe entity extraction | `extract(rawText, fileName)` |
| `ClassificationService.js` | Categorizes events, internships, certs | `classify(text, info)` |
| `SkillExtractionService.js` | Multi-domain skills taxonomy dataset | `extractSkills(text, metadata)` |
| `ConfidenceScorer.js` | Field-level heuristic scoring | `evaluate(extracted, rawText, classification)` |
| `EvidenceChecker.js` | Anti-hallucination claim verification | `verifyClaims(claims, storedCerts)` |

---

## 2. API Endpoint Implementations (Express.js Examples)

### A. Certificate Upload & AI Extraction Endpoint
**Route**: `POST /api/v1/certificates/upload`  
**Middleware**: Multer (file upload to temp storage)

```javascript
const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const upload  = multer({ dest: 'uploads/temp/' });

const CertificateIntelligenceModel = require('../ai/CertificateIntelligenceModel');
const CertificateFrontendAdapter   = require('../ai/CertificateFrontendAdapter');

const aiModel = new CertificateIntelligenceModel();
const adapter = new CertificateFrontendAdapter();

router.post('/upload', upload.single('certificate'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'NO_FILE_PROVIDED' });
    }

    const aiResult = await aiModel.processCertificate(
      req.file.path,
      req.file.originalname,
      req.file.mimetype
    );

    if (!aiResult.success) {
      return res.status(422).json({
        success: false,
        error: aiResult.error,
        message: 'OCR or text extraction failed. Please upload a clearer document.'
      });
    }

    const dbRecord = await CertificateModel.create({
      student_id: req.user.id,
      title: aiResult.extracted_data.certificate_title,
      issuer: aiResult.extracted_data.issuing_organization,
      issue_date: aiResult.extracted_data.date,
      category: aiResult.extracted_data.category,
      top_level_category: aiResult.extracted_data.topLevelCategory || 'Certifications',
      credential_id: aiResult.extracted_data.credential_id,
      skills: aiResult.extracted_data.skills,
      raw_ocr_text: aiResult.text_extraction.raw_text,
      confidence_score: aiResult.confidence.overall,
      verification_status: 'PENDING',
      file_path: req.file.path
    });

    const frontendPayload = adapter.toFrontend(aiResult.extracted_data, dbRecord.id);

    return res.status(201).json({
      success: true,
      data: frontendPayload,
      confidence: aiResult.confidence,
      verification: aiResult.verification
    });

  } catch (error) {
    console.error('Certificate extraction endpoint error:', error);
    return res.status(500).json({ success: false, error: 'INTERNAL_SERVER_ERROR' });
  }
});
```

---

### B. AI Career Path Recommendation Endpoint
**Route**: `POST /api/v1/career/evaluate`

```javascript
const CareerPathRecommenderModel = require('../ai/CareerPathRecommenderModel');
const careerModel = new CareerPathRecommenderModel();

router.post('/evaluate', async (req, res) => {
  try {
    const studentId    = req.user.id;
    const profile      = await StudentProfileModel.findOne({ student_id: studentId });
    const certificates = await CertificateModel.find({ student_id: studentId, verification_status: 'HUMAN_VERIFIED' });

    const selectedRole = req.body.selectedRole || null;
    const result       = careerModel.evaluateCareerPath(profile, certificates, selectedRole);

    return res.status(200).json(result);
  } catch (error) {
    console.error('Career evaluation error:', error);
    return res.status(500).json({ success: false, error: 'CAREER_EVALUATION_FAILED' });
  }
});
```

---

### C. AI Weekly Activity & Streaks Analytics Endpoint
**Route**: `GET /api/v1/analytics/weekly`

```javascript
const WeeklyAnalysisModel = require('../ai/WeeklyAnalysisModel');
const weeklyModel = new WeeklyAnalysisModel();

router.get('/weekly', async (req, res) => {
  try {
    const studentId    = req.user.id;
    const profile      = await StudentProfileModel.findOne({ student_id: studentId });
    const certificates = await CertificateModel.find({ student_id: studentId });
    const activities   = await ActivityModel.find({ student_id: studentId });

    const result = weeklyModel.analyzeWeeklyActivity(profile, certificates, activities);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Weekly analysis error:', error);
    return res.status(500).json({ success: false, error: 'WEEKLY_ANALYSIS_FAILED' });
  }
});
```

---

### D. AI Portfolio Generation & Download PDF Endpoints
**Routes**:
- `POST /api/v1/portfolio/generate`
- `GET /api/v1/portfolio/pdf`

```javascript
const AIPortfolioGeneratorModel = require('../ai/AIPortfolioGeneratorModel');
const AIPortfolioPDFGenerator   = require('../ai/AIPortfolioPDFGenerator');
const generator  = new AIPortfolioGeneratorModel();
const pdfGen     = new AIPortfolioPDFGenerator();
const path       = require('path');
const fs         = require('fs');

router.post('/generate', async (req, res) => {
  try {
    const studentId    = req.user.id;
    const profile      = await StudentProfileModel.findOne({ student_id: studentId });
    const certificates = await CertificateModel.find({ student_id: studentId });
    const activities   = await ActivityModel.find({ student_id: studentId });
    const projects     = await ProjectModel.find({ student_id: studentId });

    const portfolioResult = generator.generatePortfolio(profile, certificates, activities, projects);
    return res.status(200).json({ success: true, portfolio: portfolioResult.portfolio });
  } catch (error) {
    console.error('Portfolio generation error:', error);
    return res.status(500).json({ success: false, error: 'PORTFOLIO_GENERATION_FAILED' });
  }
});

router.get('/pdf', async (req, res) => {
  try {
    const studentId     = req.user.id;
    const portfolioData = await fetchGeneratedPortfolio(studentId);
    const tempPdfPath   = path.join(__dirname, `../temp/portfolio_${studentId}.pdf`);

    pdfGen.generatePDF(portfolioData, tempPdfPath);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${portfolioData.name || 'Student'}_Portfolio.pdf"`);

    const fileStream = fs.createReadStream(tempPdfPath);
    fileStream.pipe(res);
    fileStream.on('end', () => fs.unlinkSync(tempPdfPath));
  } catch (error) {
    console.error('PDF export error:', error);
    return res.status(500).json({ success: false, error: 'PDF_EXPORT_FAILED' });
  }
});
```

---

## 3. Database Schema Recommendations

### `certificates` Table / Collection:
```sql
CREATE TABLE certificates (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL,
    certificate_title VARCHAR(255),
    issuing_organization VARCHAR(255),
    issue_date VARCHAR(50),
    category VARCHAR(50),
    top_level_category VARCHAR(50) DEFAULT 'Certifications', -- Events | Internships | Certifications
    credential_id VARCHAR(100),
    achievement VARCHAR(100),
    skills JSON,
    verification_status VARCHAR(20) DEFAULT 'PENDING', -- PENDING | HUMAN_VERIFIED | REJECTED
    confidence_score FLOAT DEFAULT 0.0,
    raw_ocr_text TEXT,
    file_path VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 4. Verification Workflow (Human-in-the-Loop)

```
Student uploads Certificate (PNG / PDF)
       │
       ▼
AI Pipeline extracts entities & tags verification_status: "PENDING"
       │
       ▼
Backend saves record in DB with PENDING status
       │
       ▼
Club Faculty / Admin reviews uploaded certificate on Admin Dashboard
       │
       ├── Approves → Update DB record to verification_status: "HUMAN_VERIFIED"
       └── Rejects  → Update DB record to verification_status: "REJECTED"
       │
       ▼
AI Portfolio Generator automatically includes "HUMAN_VERIFIED" credentials
with high-evidence badges on the student's public portfolio!
```

---

## 5. Testing the AI Module

The backend team can verify the AI module locally anytime by running:
```bash
npm --prefix ai test
```
All 126 test cases will execute and verify extraction, skill harvesting, confidence scoring, evidence grounding, PDF generation, dual streaks, and 10 roadmap.sh career paths.

