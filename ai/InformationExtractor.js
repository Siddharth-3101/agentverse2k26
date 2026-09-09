/**
 * InformationExtractor.js
 * Independent Entity & Information Extraction Model.
 *
 * Rules:
 *  - Returns null for any field not explicitly found in the document text.
 *  - NEVER fabricates student names, organizations, dates, or credential IDs.
 *  - NEVER uses new Date() as a fallback date.
 *  - NEVER generates random credential IDs.
 *  - NEVER assumes "Certificate of Completion" when no achievement is found.
 */

'use strict';

class InformationExtractor {
  /**
   * Parse raw text and extract certificate fields.
   * @param {string} rawText  - Text extracted from document
   * @param {string} fileName - Original file name (for source_file only)
   * @returns {Object} Extracted fields — missing fields are null, not fabricated.
   */
  extract(rawText = '', fileName = '') {
    if (!rawText || !rawText.trim()) {
      return this._emptyExtraction(fileName);
    }

    const text = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    const studentName        = this._extractStudentName(text);
    const certificateTitle   = this._extractCertificateTitle(text);
    const eventName          = this._extractEventName(text) || certificateTitle;
    const issuingOrganization = this._extractIssuingOrganization(text);
    const dateInfo           = this._extractDates(text);
    const achievement        = this._extractAchievement(text);
    const credentialId       = this._extractCredentialId(text);
    const duration           = this._extractDuration(text);
    const description        = this._cleanDescription(text);

    return {
      student_name         : studentName,
      certificate_title    : certificateTitle,
      event_name           : eventName,
      organization         : issuingOrganization,          // null if not found
      issuing_organization : issuingOrganization,
      certificate_type     : this._inferCertificateType(text),
      date                 : dateInfo.date,                // null if not found
      start_date           : dateInfo.start_date,
      end_date             : dateInfo.end_date,
      achievement          : achievement,                  // null if not found
      description          : description,
      position             : achievement,                  // same as achievement if present
      event_type           : this._inferEventType(text),
      duration             : duration,
      credential_id        : credentialId,                 // null if not found
      certificate_number   : credentialId,
      skills               : [],                          // filled later by SkillExtractionService
      source_file          : fileName || null
    };
  }

  // ─── Student Name ────────────────────────────────────────────────────────────

  _extractStudentName(text) {
    const patterns = [
      // "This certificate is awarded to\nSANJAY SUNDARARAJAN\n"
      /(?:this\s+certificate\s+is\s+(?:presented|awarded)\s+to|awarded\s+to|presented\s+to|certify\s+that)\s*[\n\r]+\s*([A-Z][A-Z\s]{2,45})\s*[\n\r]+/i,
      // "This is to certify that John Doe"
      /(?:this\s+is\s+to\s+certify\s+that|certify\s+that|awarded\s+to|presented\s+to|this\s+certificate\s+is\s+(?:presented|awarded)\s+to)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/i,
      // "Name: John Doe" or "Student: John Doe"
      /(?:^|\n)\s*(?:student|candidate|participant|name)\s*[:\-]\s*([A-Z][a-z\s]+)/im,
      // "John Doe has successfully completed"
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})\s+(?:has\s+successfully|successfully\s+completed|participated\s+in|has\s+participated)/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        // Take only the first line if match spans lines
        const candidate = match[1].split(/[\n\r]/)[0].trim();
        // Reject if it looks like a title/label, not a real name
        if (
          candidate.length >= 3 &&
          candidate.length <= 50 &&
          !/certificate|completion|participation|achievement|awarded|institute|university|college|for\s+successfully/i.test(candidate)
        ) {
          return candidate;
        }
      }
    }
    return null;
  }

  // ─── Certificate Title ───────────────────────────────────────────────────────

  _extractCertificateTitle(text) {
    const patterns = [
      // "for successfully completing\nGetting Started with Cisco Packet Tracer"
      /(?:for\s+successfully\s+completing|completing|for\s+participating\s+in|in\s+the)\s*[\n\r]+\s*([A-Za-z0-9\s&:,\-]{4,100}?)(?:\s*[\n\r]+ offered|\s*[\n\r]+ through|\s*[\n\r]+ organized|\n|\.|$)/i,
      // "Certificate of Achievement / Completion / Participation / ..."
      /certificate\s+of\s+([A-Za-z\s]{3,60}?)(?:\n|\.|\s{2,}|$)/i,
      // "Title: ..." explicit label
      /(?:^|\n)\s*title\s*[:\-]\s*(.+)/im,
      // Quoted event name in uppercase
      /"([A-Z][A-Za-z0-9\s&:,\-]{5,80})"/
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const candidate = match[1].split(/[\n\r]/)[0].trim().replace(/\s+/g, ' ');
        if (candidate.length >= 4 && candidate.length <= 120 && !/offered\s+by|through\s+the/i.test(candidate)) {
          return candidate;
        }
      }
    }
    return null;
  }

  // ─── Event Name ─────────────────────────────────────────────────────────────

  _extractEventName(text) {
    const match = text.match(
      /(?:at|during|for|in)\s+(?:the\s+)?([A-Z0-9][A-Za-z0-9\s\-&:,']{3,80}?(?:Hackathon|Challenge|Bootcamp|Workshop|Conference|Symposium|Competition|CTF|Summit|Championship|Olympiad|Fest|Conclave)\s*\d{0,4})/i
    );
    return match ? match[1].split(/[\n\r]/)[0].trim() : null;
  }

  // ─── Issuing Organization ────────────────────────────────────────────────────

  _extractIssuingOrganization(text) {
    const patterns = [
      // "offered by Karpagam College of Engineering"
      /(?:offered\s+by|issued\s+by|conducted\s+by|presented\s+by|organized\s+by|through\s+the)\s+([A-Z][A-Za-z0-9\s&,.'\-]{3,80}?(?:College|University|Institute|Academy|Society|Program|Foundation))/i,
      // Explicit labels
      /(?:^|\n)\s*(?:organized\s+by|issued\s+by|conducted\s+by|presented\s+by|authorized\s+by)\s*[:\-]?\s*(.+)/im,
      // "University / College / Institute / Academy" keyword on same line
      /([A-Z][A-Za-z\s&,.'\-]{3,80}(?:University|College|Institute|Academy|Association|Foundation|Society|Council|IIT|NIT|IIIT|BITS|Government Engineering College|GEC|AWS|Google|Cisco|Microsoft|Coursera|NPTEL))/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const candidate = match[1].split(/[\n\r]/)[0].trim().replace(/\s+/g, ' ');
        if (candidate.length >= 3 && candidate.length <= 120) {
          return candidate;
        }
      }
    }
    return null;
  }

  // ─── Dates ──────────────────────────────────────────────────────────────────

  /**
   * Extracts date from document text. Returns null for all date fields if none found.
   */
  _extractDates(text) {
    const patterns = [
      // "26 Aug 2026" or "26 August 2026"
      /\b(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})\b/i,
      // "Date: 15 March 2026" or "Issued on: 2026-03-15"
      /(?:date|issued(?:\s+on)?|on)\s*[:\-]?\s*(\d{1,2}[\s\-\/]\w+[\s\-\/]\d{4}|\w+\s+\d{1,2},?\s+\d{4}|\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4})/i,
      /\b(\d{4}-\d{2}-\d{2})\b/,
      /\b(\d{1,2}\/\d{1,2}\/\d{4})\b/
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const dateStr = match[1].trim();
        return { date: dateStr, start_date: dateStr, end_date: dateStr };
      }
    }

    return { date: null, start_date: null, end_date: null };
  }

  // ─── Achievement ─────────────────────────────────────────────────────────────

  _extractAchievement(text) {
    const patterns = [
      /\b(1st\s+place|first\s+place|2nd\s+place|second\s+place|3rd\s+place|third\s+place)\b/i,
      /\b(winner|runners?\s*up|runner-up|champion|champions)\b/i,
      /\b((?:top\s+\d+|semi-finalist|finalist)\s*(?:finalist)?)\b/i,
      /\b(successfully\s+completed|completed|completion|participated|participant)\b/i,
      /\b(grade\s+[A-F][+\-]?|distinction|merit|pass)\b/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        const raw = (match[1] || match[0]).trim();
        return raw.replace(/\b\w/g, c => c.toUpperCase());
      }
    }

    return null;
  }

  // ─── Credential ID ───────────────────────────────────────────────────────────

  _extractCredentialId(text) {
    const patterns = [
      // "Cert ID: 6ded5586-3d1b-42a3-83cf-21188178b831"
      /(?:cert(?:ificate)?\s*(?:id|no|number)|credential\s*id|verification\s*id)\s*[:\-]?\s*([a-f0-9\-]{10,40}|[A-Z0-9\-_./]{5,40})/i,
      // UUID format
      /\b([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\b/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    return null;
  }

  // ─── Duration ───────────────────────────────────────────────────────────────

  _extractDuration(text) {
    const match = text.match(/(\d+\s*(?:hours?|days?|weeks?|months?)(?:\s+(?:bootcamp|workshop|training|hackathon|course|program))?)/i);
    return match ? match[1].trim() : null;
  }

  // ─── Type Inference ──────────────────────────────────────────────────────────

  _inferCertificateType(text) {
    if (/packet\s+tracer|cisco|networking/i.test(text))           return 'Course';
    if (/hackathon|coding\s+contest|buildathon/i.test(text))      return 'Hackathon';
    if (/ctf|capture\s+the\s+flag/i.test(text))                   return 'Competition';
    if (/competition|contest|olympiad|challenge/i.test(text))      return 'Competition';
    if (/workshop|bootcamp|masterclass|training\s+program/i.test(text)) return 'Workshop';
    if (/certification|certified|professional\s+certificate/i.test(text)) return 'Certification';
    if (/course|specialization|curriculum|module/i.test(text))    return 'Course';
    return null;
  }

  _inferEventType(text) {
    if (/hackathon|buildathon/i.test(text))          return 'Hackathon';
    if (/ctf|capture\s+the\s+flag/i.test(text))      return 'CTF';
    if (/competition|contest|challenge/i.test(text)) return 'Competition';
    if (/workshop|bootcamp/i.test(text))             return 'Workshop';
    if (/course|certification|cisco/i.test(text))    return 'Course';
    return null;
  }

  // ─── Description ─────────────────────────────────────────────────────────────

  _cleanDescription(text) {
    const snippet = text.replace(/\s+/g, ' ').trim();
    if (!snippet) return null;
    return snippet.length > 300 ? snippet.substring(0, 297) + '...' : snippet;
  }

  // ─── Empty Extraction ────────────────────────────────────────────────────────

  _emptyExtraction(fileName) {
    return {
      student_name         : null,
      certificate_title    : null,
      event_name           : null,
      organization         : null,
      issuing_organization : null,
      certificate_type     : null,
      date                 : null,
      start_date           : null,
      end_date             : null,
      achievement          : null,
      description          : null,
      position             : null,
      event_type           : null,
      duration             : null,
      credential_id        : null,
      certificate_number   : null,
      skills               : [],
      source_file          : fileName || null
    };
  }
}

module.exports = InformationExtractor;
