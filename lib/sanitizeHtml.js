/**
 * Server-safe HTML sanitizer for blog content.
 * Strips dangerous tags (script, iframe, object, embed, form) and event handlers
 * while preserving safe formatting HTML (p, h1-h6, ul, ol, li, a, img, blockquote, etc.)
 * 
 * This avoids the jsdom dependency issues that `isomorphic-dompurify` causes on Vercel.
 */

// Dangerous tags that should be completely removed (tag + content)
const DANGEROUS_TAGS_WITH_CONTENT = /(<\s*(?:script|iframe|object|embed|form|applet|base|link(?=\s[^>]*rel\s*=\s*["']?(?:import|preload|prefetch)))[^>]*>[\s\S]*?<\s*\/\s*(?:script|iframe|object|embed|form|applet|base|link)\s*>)/gi;

// Self-closing dangerous tags
const DANGEROUS_SELF_CLOSING = /<\s*(?:script|iframe|object|embed|form|applet|base|meta)\b[^>]*\/?>/gi;

// Event handlers (onclick, onerror, onload, etc.)
const EVENT_HANDLERS = /\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi;

// javascript: and data: URI schemes in href/src/action attributes
const DANGEROUS_URIS = /(?:href|src|action|formaction|xlink:href)\s*=\s*(?:"(?:javascript|data|vbscript):[^"]*"|'(?:javascript|data|vbscript):[^']*')/gi;

// Style expressions (expression(), url() with javascript:)
const DANGEROUS_STYLES = /style\s*=\s*(?:"[^"]*(?:expression|javascript:|url\s*\()[^"]*"|'[^']*(?:expression|javascript:|url\s*\()[^']*')/gi;

/**
 * Sanitize HTML string by removing dangerous elements while preserving safe formatting.
 * @param {string} html - Raw HTML string
 * @returns {string} - Sanitized HTML string
 */
export function sanitizeHtml(html) {
  if (!html || typeof html !== 'string') return '';

  let clean = html;

  // 1. Remove dangerous tags with their content
  clean = clean.replace(DANGEROUS_TAGS_WITH_CONTENT, '');

  // 2. Remove self-closing dangerous tags
  clean = clean.replace(DANGEROUS_SELF_CLOSING, '');

  // 3. Remove event handlers from all tags
  clean = clean.replace(EVENT_HANDLERS, '');

  // 4. Remove dangerous URI schemes
  clean = clean.replace(DANGEROUS_URIS, 'href="about:blank"');

  // 5. Remove dangerous style expressions
  clean = clean.replace(DANGEROUS_STYLES, '');

  // 6. Replace &nbsp; with regular space (RTL text overflow fix)
  clean = clean.replace(/&nbsp;/g, ' ');
  clean = clean.replace(/\u00A0/g, ' ');
  clean = clean.replace(/\s+/g, ' ');
  clean = clean.trim();

  return clean;
}
