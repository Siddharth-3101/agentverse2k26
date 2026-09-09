/**
 * OllamaService.js
 * Independent Ollama Local LLM Service with Strict Anti-Hallucination Guardrails.
 *
 * Connects to local Ollama server (http://localhost:11434).
 * Enforces temperature: 0.0 and strict system prompts:
 *   - NEVER fabricates, hallucinates, or invents names, dates, certificates, or orgs.
 *   - ONLY uses data provided in prompt input / DB records.
 *   - Returns clean JSON with null for any unverified / missing fields.
 */

'use strict';

const OLLAMA_DEFAULT_URL   = 'http://localhost:11434';
const OLLAMA_DEFAULT_MODEL = 'llama3.2'; // or llama3 / mistral / gemma2

class OllamaService {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || OLLAMA_DEFAULT_URL;
    this.model   = options.model   || OLLAMA_DEFAULT_MODEL;
    this.timeout = options.timeout || 10000; // 10s timeout
  }

  /**
   * Check if local Ollama server is running and accessible.
   * @returns {Promise<boolean>}
   */
  async isAvailable() {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 1500);

      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        signal: controller.signal
      });

      clearTimeout(timer);
      return response.ok;
    } catch (_) {
      return false;
    }
  }

  /**
   * Send a prompt to Ollama with strict anti-hallucination system instructions.
   * @param {string} prompt       - Input text / user query
   * @param {string} systemPrompt - System prompt instructions
   * @param {Object} options      - Additional parameters
   * @returns {Promise<Object>} JSON response object
   */
  async generateJson(prompt, systemPrompt = '', options = {}) {
    const strictSystemPrompt = [
      'SYSTEM DIRECTIVE: You are an unbiased, factual data processing engine for an academic platform.',
      'STRICT ANTI-HALLUCINATION RULES:',
      '1. You MUST ONLY use information explicitly provided in the user prompt.',
      '2. You MUST NEVER fabricate, assume, invent, or hallucinate names, dates, institutions, certificates, credentials, or achievements.',
      '3. If a field or piece of evidence is absent in the input data, you MUST set that field to null.',
      '4. Output valid, raw JSON ONLY. Do not include markdown commentary, conversational filler, or preamble.',
      systemPrompt
    ].filter(Boolean).join('\n\n');

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), options.timeout || this.timeout);

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          model   : options.model || this.model,
          prompt  : prompt,
          system  : strictSystemPrompt,
          format  : 'json',
          stream  : false,
          options : {
            temperature : 0.0,  // Deterministic mode — zero creativity
            top_p       : 0.1
          }
        })
      });

      clearTimeout(timer);

      if (!response.ok) {
        throw new Error(`Ollama HTTP error ${response.status}`);
      }

      const data = await response.json();
      const rawText = data.response ? data.response.trim() : '';

      try {
        return JSON.parse(rawText);
      } catch (jsonErr) {
        // Handle markdown codeblock wrapping if Ollama wraps JSON in ```json
        const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned);
      }

    } catch (err) {
      console.warn('[OllamaService] Call failed or timed out:', err.message);
      return null;
    }
  }

  // ─── High-Level Factual Task Methods ────────────────────────────────────────

  /**
   * Parse certificate text via Ollama.
   * Return fields strictly derived from text.
   */
  async extractCertificateEntities(rawText) {
    if (!rawText || !rawText.trim()) return null;

    const systemPrompt = `
Extract certificate entities into this exact JSON format:
{
  "student_name": string or null,
  "certificate_title": string or null,
  "issuing_organization": string or null,
  "date": string or null,
  "credential_id": string or null,
  "achievement": string or null
}
Remember: Return null for any field not explicitly present in the input text.
`;

    const prompt = `DOCUMENT TEXT:\n"""\n${rawText}\n"""`;

    return await this.generateJson(prompt, systemPrompt);
  }

  /**
   * Generate an executive portfolio summary strictly from student profile and certs.
   */
  async generatePortfolioSummary(studentProfile, certificates = []) {
    const certListText = certificates.map(c =>
      `- ${c.certificate_title || c.title || 'Certificate'} issued by ${c.organization || c.issuing_organization || 'Organization'} (${c.date || 'Date N/A'})`
    ).join('\n');

    const prompt = `
STUDENT PROFILE:
Name: ${studentProfile.name || 'Student'}
Department: ${studentProfile.department || 'Academic Department'}
Institution: ${studentProfile.institution || 'University'}

STORED CERTIFICATES:
${certListText || '(No certificates uploaded)'}

Task: Write a concise 2-sentence factual summary of this student's academic background and credentials.
Format JSON: { "summary": string }
Rule: Include ONLY facts present in the input data above.
`;

    const res = await this.generateJson(prompt, 'Write a factual 2-sentence student summary in JSON.');
    return res && res.summary ? res.summary : null;
  }
}

module.exports = OllamaService;
