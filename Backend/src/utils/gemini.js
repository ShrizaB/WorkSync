// Thin wrapper around Google's Gemini API (free tier) using the plain REST
// endpoint via the built-in fetch (Node 18+), so no extra SDK is required.
//
// Get a free key (no credit card needed) at https://aistudio.google.com/apikey
// and set GEMINI_API_KEY in Backend/.env

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const GEMINI_URL = (model) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

/**
 * Calls Gemini with a system instruction + conversation history and returns plain text.
 * @param {string} systemInstruction
 * @param {{role: 'user'|'model', text: string}[]} messages
 */
async function askGemini(systemInstruction, messages) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const err = new Error('GEMINI_API_KEY is not configured on the server. Add a free key from https://aistudio.google.com/apikey to Backend/.env');
    err.status = 503;
    throw err;
  }

  const body = {
    system_instruction: { parts: [{ text: systemInstruction }] },
    contents: messages.map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
    generationConfig: { temperature: 0.6, maxOutputTokens: 512 },
  };

  const res = await fetch(`${GEMINI_URL(GEMINI_MODEL)}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    const err = new Error(`Gemini API error (${res.status}): ${errText || res.statusText}`);
    err.status = res.status === 429 ? 429 : 502;
    throw err;
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || '';
  if (!text) {
    const err = new Error('Gemini returned an empty response (it may have been blocked by safety filters).');
    err.status = 502;
    throw err;
  }
  return text.trim();
}

module.exports = { askGemini };
