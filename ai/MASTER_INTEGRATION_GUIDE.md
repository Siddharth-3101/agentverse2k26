# Master Backend & Frontend Integration Guide
## Campus Clubs & Events AI Platform

> **Living Documentation**: This guide provides the complete architectural blueprint, API specs, database schemas, and frontend integration contracts for connecting the independent AI modules (`/ai`) to the backend and React frontend.

---

## 1. System Architecture Overview

```
 ┌─────────────────────────────────────────────────────────────────────────┐
 │                            REACT FRONTEND                               │
 │  (Certificates.jsx, Portfolio.jsx, AllClubs.jsx, AllEvents.jsx, etc.)   │
 └────────────────────────────────────┬────────────────────────────────────┘
                                      │ REST APIs (JSON / Multipart)
                                      ▼
 ┌─────────────────────────────────────────────────────────────────────────┐
 │                          BACKEND SERVICE                                │
 │     (Node.js / Express / Fastify + SQL Database + File Storage)         │
 └────────────────────────────────────┬────────────────────────────────────┘
                                      │ CommonJS Module Imports
                                      ▼
 ┌─────────────────────────────────────────────────────────────────────────┐
 │                         INDEPENDENT AI MODULE                           │
 │                             ( /ai folder )                              │
 │                                                                         │
 │  • CertificateIntelligenceModel (RAG + OCR Text & Entity Extraction)    │
 │  • SkillExtractionService     (12+ Domain Taxonomy & Evidence Tagging)│
 │  • AIPortfolioGeneratorModel  (Evidence-Grounded Portfolio Engine)     │
 │  • AIPortfolioPDFGenerator    (Zero-Dependency PDF Exporter)           │
 │  • RecommendationEngine       (Skill & Milestone Matched Filtering)    │
 │  • WeeklyAnalysisModel        (Dual Streaks & Participation Velocity)   │
 │  • CareerPathRecommenderModel (10 Roadmap.sh Skill Trees & Milestones)  │
 │  • RoadmapTaxonomy            (Roadmap Ingestion & Alias Resolver)      │
 │  • OllamaService              (Local LLM with Anti-Hallucination)       │
 │  • CertificateFrontendAdapter (UI Payload Mapping to React Props)       │
 └─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Independent AI Module Reference (`/ai`)

All AI modules are self-contained CommonJS modules located in `/ai`:

| Class / Module | File Path | Main Method(s) | Primary Responsibility |
|---|---|---|---|
| `CertificateIntelligenceModel` | `ai/CertificateIntelligenceModel.js` | `async processCertificate(filePath, fileName, mimeType)` | Document text parsing + Tesseract page OCR + Null-safe entity extraction + Confidence scoring + Ollama double verification. |
| `SkillExtractionService` | `ai/SkillExtractionService.js` | `extractSkills(rawText, metadata)` | Multi-domain skills taxonomy dataset matching (12+ engineering & non-tech domains) & evidence tagging. |
| `AIPortfolioGeneratorModel` | `ai/AIPortfolioGeneratorModel.js` | `generatePortfolio(profile, certs, activities, projects)` | Synthesizes verified credentials & profile data into an evidence-grounded portfolio JSON. |
| `AIPortfolioPDFGenerator` | `ai/AIPortfolioPDFGenerator.js` | `generatePDF(portfolio, outputPath)` | Zero-dependency pure Node.js PDF generator producing verifiable `.pdf` files. |
| `RecommendationEngine` | `ai/RecommendationEngine.js` | `filterAndRankClubs(...)` / `filterAndRankEvents(...)` | Filters & ranks existing pools of available clubs/events based on student skills & roadmap `BUILD_NEXT` milestones. |
| `WeeklyAnalysisModel` | `ai/WeeklyAnalysisModel.js` | `analyzeWeeklyActivity(profile, certs, activities, projects)` | Calculates dual streaks (`event_streak`, `certificate_streak`), participation trend velocity (`INCREASED`, `DECREASED`, `STEADY`), and 3-category breakdown. |
| `CareerPathRecommenderModel` | `ai/CareerPathRecommenderModel.js` | `evaluateCareerPath(profile, certs, selectedRole)` | Matches student skills to career paths and determines qualitative milestone progression (`COMPLETED`, `BUILD_NEXT`, `UPCOMING`). |
| `RoadmapTaxonomy` | `ai/roadmapTaxonomy.js` | `getRoadmap(roleName)` / `getAllRoles()` | Scans `/ai/career/` for 10 official roadmap.sh career paths (`.json` & `.pdf`) with fuzzy alias resolution. |
| `OllamaService` | `ai/OllamaService.js` | `isAvailable()` / `generateGroundedEntities(...)` | Connects to local Ollama LLM (`temperature: 0.0`) with string-matching anti-hallucination guardrails. |
| `CertificateFrontendAdapter` | `ai/CertificateFrontendAdapter.js` | `toFrontend(aiCert, id)` / `toFrontendArray(...)` | Maps internal AI snake_case models to React component camelCase props. |
| `EvidenceChecker` | `ai/EvidenceChecker.js` | `verifyClaims(claims, storedCerts)` | Anti-hallucination verification ensuring claims are backed by stored evidence. |

---

## 3. 10 Integrated Career Path Roadmaps (`/ai/career/`)

The AI Career Path Recommender includes 10 pre-loaded, evidence-grounded roadmap paths from roadmap.sh:

1. **AI / ML Engineer** (`ai-engineer.json` / `ai-engineer.pdf`)
2. **AWS Cloud Engineer** (`aws.json` / `aws.pdf`)
3. **Backend Developer** (`backend.json` / `backend.pdf`)
4. **Blockchain Developer** (`blockchain.json` / `blockchain.pdf`)
5. **Cyber Security Analyst** (`cyber-security.json` / `cyber-security.pdf`)
6. **Data Analyst** (`data-analyst.json` / `data-analyst.pdf`)
7. **DevOps & Cloud Engineer** (`devops.json` / `devops.pdf`)
8. **Frontend Developer** (`frontend.json` / `frontend.pdf`)
9. **Full Stack Developer** (`full-stack.json` / `full-stack.pdf`)
10. **iOS Developer** (`ios.json` / `ios.pdf`)

---

## 4. Backend Integration Blueprint (API Specs)

### A. Certificate Upload & AI Extraction API
- **Endpoint**: `POST /api/v1/certificates/upload`
- **Content-Type**: `multipart/form-data`
- **Request Body**: `certificate` (File: PDF, PNG, JPG)

**Express Controller Example**:
```javascript
const CertificateIntelligenceModel = require('../ai/CertificateIntelligenceModel');
const CertificateFrontendAdapter   = require('../ai/CertificateFrontendAdapter');

const aiModel = new CertificateIntelligenceModel();
const adapter = new CertificateFrontendAdapter();

app.post('/api/v1/certificates/upload', upload.single('certificate'), async (req, res) => {
  const aiResult = await aiModel.processCertificate(req.file.path, req.file.originalname, req.file.mimetype);

  if (!aiResult.success) {
    return res.status(422).json({ success: false, error: aiResult.error });
  }

  // Save in DB with PENDING verification status
  const certRecord = await Database.Certificates.create({
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
    verification_status: 'PENDING'
  });

  const uiPayload = adapter.toFrontend(aiResult.extracted_data, certRecord.id);
  return res.status(201).json({ success: true, data: uiPayload, confidence: aiResult.confidence });
});
```

---

### B. AI Career Path Recommendation & Milestone API
- **Endpoint**: `POST /api/v1/career/evaluate`
- **Request Body**: `{ "selectedRole": "iOS Developer" }` (or `{}` for top AI match)

**Express Controller Example**:
```javascript
const CareerPathRecommenderModel = require('../ai/CareerPathRecommenderModel');
const careerModel = new CareerPathRecommenderModel();

app.post('/api/v1/career/evaluate', async (req, res) => {
  const profile      = await Database.StudentProfile.findOne({ student_id: req.user.id });
  const certificates = await Database.Certificates.find({ student_id: req.user.id, verification_status: 'HUMAN_VERIFIED' });

  const result = careerModel.evaluateCareerPath(profile, certificates, req.body.selectedRole);
  return res.status(200).json(result);
});
```

---

### C. AI Weekly Activity & Streaks API
- **Endpoint**: `GET /api/v1/analytics/weekly`

**Express Controller Example**:
```javascript
const WeeklyAnalysisModel = require('../ai/WeeklyAnalysisModel');
const weeklyModel = new WeeklyAnalysisModel();

app.get('/api/v1/analytics/weekly', async (req, res) => {
  const profile      = await Database.StudentProfile.findOne({ student_id: req.user.id });
  const certificates = await Database.Certificates.find({ student_id: req.user.id });
  const activities   = await Database.Activities.find({ student_id: req.user.id });

  const analysis = weeklyModel.analyzeWeeklyActivity(profile, certificates, activities);
  return res.status(200).json(analysis);
});
```

---

### D. AI Portfolio Generation & PDF Export APIs
- **Endpoints**:
  - `POST /api/v1/portfolio/generate`
  - `GET /api/v1/portfolio/pdf`

```javascript
const AIPortfolioGeneratorModel = require('../ai/AIPortfolioGeneratorModel');
const AIPortfolioPDFGenerator   = require('../ai/AIPortfolioPDFGenerator');

const generator = new AIPortfolioGeneratorModel();
const pdfGen    = new AIPortfolioPDFGenerator();

app.post('/api/v1/portfolio/generate', async (req, res) => {
  const profile      = await Database.StudentProfile.findOne({ student_id: req.user.id });
  const certificates = await Database.Certificates.find({ student_id: req.user.id });
  const activities   = await Database.Activities.find({ student_id: req.user.id });
  const projects     = await Database.Projects.find({ student_id: req.user.id });

  const result = generator.generatePortfolio(profile, certificates, activities, projects);
  return res.status(200).json({ success: true, data: result.portfolio });
});

app.get('/api/v1/portfolio/pdf', async (req, res) => {
  const portfolioData = await fetchPortfolioForUser(req.user.id);
  const tempPath      = `./temp/portfolio_${req.user.id}.pdf`;

  pdfGen.generatePDF(portfolioData, tempPath);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${portfolioData.name || 'Student'}_Portfolio.pdf"`);
  fs.createReadStream(tempPath).pipe(res);
});
```

---

### E. Skill-Matched Recommendations API
- **Endpoints**:
  - `GET /api/v1/recommendations/clubs`
  - `GET /api/v1/recommendations/events`

```javascript
const RecommendationEngine = require('../ai/RecommendationEngine');
const recEngine = new RecommendationEngine();

app.get('/api/v1/recommendations/clubs', async (req, res) => {
  const profile        = await Database.StudentProfile.findOne({ student_id: req.user.id });
  const certificates   = await Database.Certificates.find({ student_id: req.user.id });
  const availableClubs = await Database.Clubs.find({ is_active: true });

  const rankedClubs = recEngine.filterAndRankClubs(profile, certificates, availableClubs);
  return res.status(200).json({ success: true, data: rankedClubs });
});
```

---

## 5. Database Schemas (`schema.sql`)

```sql
-- Certificates Table
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

-- Clubs Table
CREATE TABLE clubs (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    mentor_name VARCHAR(100),
    president_name VARCHAR(100),
    category VARCHAR(50),
    description TEXT,
    skills JSON, -- Skills taught/required
    logo_image VARCHAR(500),
    banner_image VARCHAR(500),
    member_count INT DEFAULT 0,
    active_events_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);
```

---

## 6. Frontend Integration Blueprint (React Contracts)

When backend REST APIs are connected, wire React state fetching directly into existing frontend components without altering UI structure or styling:

### `Certificates.jsx`
```javascript
useEffect(() => {
  fetch('/api/v1/certificates')
    .then(res => res.json())
    .then(data => setCertificates(data.data));
}, []);

const handleFileUpload = async (file) => {
  const formData = new FormData();
  formData.append('certificate', file);

  const res  = await fetch('/api/v1/certificates/upload', { method: 'POST', body: formData });
  const json = await res.json();

  if (json.success) {
    setCertificates(prev => [json.data, ...prev]);
  }
};
```

### `Portfolio.jsx`
```javascript
const handleDownloadPDF = () => {
  window.open('/api/v1/portfolio/pdf', '_blank');
};
```

### `CareerPath.jsx` (or Career Component)
```javascript
const handleSelectRole = async (roleSlug) => {
  const res  = await fetch('/api/v1/career/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ selectedRole: roleSlug })
  });
  const data = await res.json();
  setCareerData(data);
};
```

---

## 7. Testing & Quality Assurance

Run the comprehensive automated unit test suite anytime:
```bash
npm --prefix ai test
```
All 126 test cases verify:
- OCR parsing & scanned PDF handling
- Zero fake data / clean null safety
- Multi-domain skill taxonomy matching
- Evidence-grounded portfolio synthesis
- Pure Node.js PDF generation
- Skill-matched club & event recommendations
- Dual streak activity velocity tracking
- 10 roadmap.sh career path integrations & qualitative milestone progression
