/**
 * ClassificationService.js
 * Independent Activity & Certificate Classification Engine.
 *
 * Supports Top-Level Upload Categories:
 *  - Events (Hackathon, Competition, Workshop, Conference, Club Activity, Sports, Cultural, Volunteering, Leadership)
 *  - Internships (Internship, Industrial Training, Work Experience)
 *  - Certifications (Certification, Course, Specialization, Publication, Other)
 */

'use strict';

const TOP_LEVEL_CATEGORIES = ['Events', 'Internships', 'Certifications'];

const FINE_CATEGORIES = [
  'Workshop', 'Hackathon', 'Course', 'Competition', 'Publication',
  'Internship', 'Certification', 'Conference', 'Club Activity',
  'Sports', 'Cultural', 'Volunteering', 'Leadership', 'Other'
];

const TOP_LEVEL_MAP = {
  'Hackathon'    : 'Events',
  'Competition'  : 'Events',
  'Workshop'     : 'Events',
  'Conference'   : 'Events',
  'Club Activity': 'Events',
  'Sports'       : 'Events',
  'Cultural'     : 'Events',
  'Volunteering' : 'Events',
  'Leadership'   : 'Events',
  'Internship'   : 'Internships',
  'Certification': 'Certifications',
  'Course'       : 'Certifications',
  'Publication'  : 'Certifications',
  'Other'        : 'Certifications'
};

const LOW_CONFIDENCE_THRESHOLD = 0.60;

class ClassificationService {
  constructor() {
    this.topLevelCategories = TOP_LEVEL_CATEGORIES;
    this.categories         = FINE_CATEGORIES;

    this.categoryRules = [
      {
        category : 'Hackathon',
        keywords : ['hackathon', 'codefest', 'buildathon', 'ideathon', 'makeathon', 'hack-a-thon', 'code clash', 'devfest'],
        weight   : 3
      },
      {
        category : 'Competition',
        keywords : ['competition', 'contest', 'challenge', 'ctf', 'capture the flag', 'olympiad', 'quiz competition', 'coding contest'],
        weight   : 2.5
      },
      {
        category : 'Workshop',
        keywords : ['workshop', 'hands-on', 'masterclass', 'bootcamp', 'training program', 'webinar', 'tutorial session'],
        weight   : 2.5
      },
      {
        category : 'Course',
        keywords : ['course', 'specialization', 'nptel', 'coursera', 'udemy', 'edx', 'learning path', 'curriculum', 'module'],
        weight   : 2
      },
      {
        category : 'Certification',
        keywords : ['certified', 'certification', 'aws certified', 'google cloud certified', 'azure certified', 'professional certificate', 'licensed practitioner'],
        weight   : 2.5
      },
      {
        category : 'Publication',
        keywords : ['publication', 'published paper', 'journal', 'ieee', 'springer', 'conference paper', 'research paper', 'proceedings', 'doi'],
        weight   : 3
      },
      {
        category : 'Internship',
        keywords : ['internship', 'intern', 'trainee', 'apprentice', 'summer internship', 'industrial training', 'work experience'],
        weight   : 3
      },
      {
        category : 'Conference',
        keywords : ['conference', 'symposium', 'summit', 'forum', 'conclave', 'colloquium'],
        weight   : 2
      },
      {
        category : 'Club Activity',
        keywords : ['club', 'society', 'student chapter', 'acm', 'ieee student branch', 'rotaract', 'gdsc', 'technical club'],
        weight   : 2
      },
      {
        category : 'Sports',
        keywords : ['sports', 'athletics', 'football', 'cricket', 'basketball', 'chess', 'badminton', 'tennis', 'swimming', 'inter-college sports', 'sports championship'],
        weight   : 3
      },
      {
        category : 'Cultural',
        keywords : ['cultural', 'dance', 'music', 'drama', 'theatre', 'cultural fest', 'fine arts', 'literary', 'elocution', 'debate'],
        weight   : 3
      },
      {
        category : 'Volunteering',
        keywords : ['volunteer', 'nss', 'blood donation', 'community service', 'social work', 'ngo', 'outreach program'],
        weight   : 3
      },
      {
        category : 'Leadership',
        keywords : ['president', 'vice president', 'head', 'coordinator', 'secretary', 'chairperson', 'team lead', 'club president', 'organizer'],
        weight   : 2.5
      }
    ];
  }

  /**
   * Classify certificate/activity based on text content.
   * @param {string} text           - Raw extracted text
   * @param {Object} extractedInfo  - Optional extracted fields { certificate_title, event_name, event_type }
   * @returns {{ category: string, topLevelCategory: string, confidence: number, matchReason: string, requiresVerification: boolean }}
   */
  classify(text = '', extractedInfo = {}) {
    const combinedText = [
      text,
      extractedInfo.certificate_title || '',
      extractedInfo.event_name         || '',
      extractedInfo.event_type         || '',
      extractedInfo.certificate_type   || ''
    ].join(' ').toLowerCase();

    let bestCategory  = 'Other';
    let maxScore      = 0;
    let matchReason   = 'No keywords matched — defaulting to Other';
    const matchedRules = [];

    for (const rule of this.categoryRules) {
      let score            = 0;
      const matchedKeywords = [];

      for (const kw of rule.keywords) {
        if (combinedText.includes(kw)) {
          score += rule.weight;
          matchedKeywords.push(kw);
        }
      }

      if (score > 0) {
        matchedRules.push({ category: rule.category, score, keywords: matchedKeywords });
      }

      if (score > maxScore) {
        maxScore      = score;
        bestCategory  = rule.category;
        matchReason   = `Matched: ${matchedKeywords.join(', ')}`;
      }
    }

    const rawConfidence = maxScore > 0 ? Math.min(0.95, 0.50 + (maxScore / 12)) : 0.50;
    const confidence    = Number(rawConfidence.toFixed(2));
    const requiresVerification = confidence < LOW_CONFIDENCE_THRESHOLD;

    const finalCategory     = requiresVerification ? 'Other' : bestCategory;
    const topLevelCategory  = TOP_LEVEL_MAP[finalCategory] || 'Certifications';

    return {
      category            : finalCategory,
      topLevelCategory    : topLevelCategory,
      confidence          : confidence,
      matchReason         : matchReason,
      requiresVerification: requiresVerification,
      allMatches          : matchedRules
    };
  }

  getTopLevelCategory(fineCategory) {
    return TOP_LEVEL_MAP[fineCategory] || 'Certifications';
  }

  isValidCategory(category) {
    return FINE_CATEGORIES.includes(category) || TOP_LEVEL_CATEGORIES.includes(category);
  }
}

module.exports = ClassificationService;
