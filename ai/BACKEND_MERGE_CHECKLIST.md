# Backend Merge Checklist & Instructions for Future AI Agents

> **IMPORTANT INSTRUCTION FOR FUTURE AI AGENTS**:
> When the user asks you to merge the backend team's new backend implementation with the AI module (`/ai`) and frontend (`/frontend`), follow this exact protocol to inspect, identify missing database tables/columns, and wire all AI tracking features cleanly.

---

## 1. Inspection Protocol for Future Agents

When the backend code is provided or merged into the codebase:

### Step 1: Scan Backend Schema & Models
Search for database schemas, ORM models, or migration scripts in the codebase:
- Check `backend/models/`, `backend/entities/`, `backend/src/models/`
- Check `prisma/schema.prisma`, `drizzle/`, `schema.sql`, or `migrations/`

### Step 2: Verify Required AI Tracking Variables & Columns
Compare the backend team's schema against the required tracking fields for AI Certificate Intelligence, Portfolio Generation, and Recommendations:

#### A. `certificates` Table / Collection Checklist
Verify that the database model contains these essential tracking columns:
- [ ] `id` (Primary Key, UUID / string)
- [ ] `student_id` (Foreign Key -> User/Student)
- [ ] `certificate_title` (String / Nullable)
- [ ] `issuing_organization` (String / Nullable)
- [ ] `issue_date` (String / Nullable)
- [ ] `category` (String — e.g. Hackathon, Workshop, Course, Internship)
- [ ] `top_level_category` (String — `Events` | `Internships` | `Certifications`)
- [ ] `credential_id` (String / Nullable)
- [ ] `achievement` (String / Nullable — e.g. Winner, Finalist, Grade A+)
- [ ] `skills` (JSON / Array — Extracted skill objects with evidence tags)
- [ ] `verification_status` (String — `PENDING` | `HUMAN_VERIFIED` | `REJECTED`) **CRITICAL**
- [ ] `confidence_score` (Float — 0.0 to 1.0)
- [ ] `flagged_fields` (JSON / Array — Missing/low-confidence fields)
- [ ] `raw_ocr_text` (Text — Extracted raw document text)
- [ ] `file_path` / `file_url` (String — Path to uploaded document)

#### B. `student_profiles` Table / Collection Checklist
Verify the student profile model supports AI portfolio synthesis:
- [ ] `skills` (JSON / Array — Self-reported & verified skills)
- [ ] `department` (String)
- [ ] `institution` (String)
- [ ] `bio` (Text)
- [ ] `github` & `linkedin` (String / Nullable)
- [ ] `portfolio_cache` / `ai_summary` (JSON / Text — Cached generated portfolio)

#### C. `clubs` & `events` Tables / Collection Checklist
Verify clubs and events models support AI recommendation matching:
- [ ] `skills` / `tags` (JSON / Array — Skills required or taught by club/event)
- [ ] `category` (String — Technical, Cultural, Entrepreneurship, Sports)
- [ ] `mentor_name` (String)
- [ ] `is_active` (Boolean)

---

## 2. Automatic Schema Migration & Patching Protocol

If any required tracking fields are missing from the backend team's schema:

1. **SQL / ORM Patching**:
   Generate an `ALTER TABLE` SQL migration script or update the ORM model file to add missing columns without dropping existing data. Example:
   ```sql
   ALTER TABLE certificates
   ADD COLUMN top_level_category VARCHAR(50) DEFAULT 'Certifications',
   ADD COLUMN verification_status VARCHAR(20) DEFAULT 'PENDING',
   ADD COLUMN confidence_score FLOAT DEFAULT 0.0,
   ADD COLUMN flagged_fields JSON,
   ADD COLUMN raw_ocr_text TEXT;
   ```

2. **Controller Wiring**:
   Import AI models from `../ai/` in the backend controllers:
   ```javascript
   const CertificateIntelligenceModel = require('../ai/CertificateIntelligenceModel');
   const CertificateFrontendAdapter   = require('../ai/CertificateFrontendAdapter');
   const CareerPathRecommenderModel    = require('../ai/CareerPathRecommenderModel');
   const WeeklyAnalysisModel           = require('../ai/WeeklyAnalysisModel');
   const AIPortfolioGeneratorModel    = require('../ai/AIPortfolioGeneratorModel');
   const RecommendationEngine        = require('../ai/RecommendationEngine');
   const AIPortfolioPDFGenerator      = require('../ai/AIPortfolioPDFGenerator');
   ```

3. **Verify Adapter Compatibility**:
   Ensure API response outputs pass through `CertificateFrontendAdapter.toFrontend()` so frontend React components (`CertificateCard`, `ClubCard`, `RecommendationCard`) render without prop mismatch errors.

4. **Execute AI Test Suite**:
   Run `npm --prefix ai test` to confirm all 126 unit tests pass cleanly after backend integration.
