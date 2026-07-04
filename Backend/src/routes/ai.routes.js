const express = require('express');
const db = require('../db/database');
const { verifyToken } = require('../middleware/auth');
const { askGemini } = require('../utils/gemini');

const router = express.Router();
router.use(verifyToken);

const SYSTEM_PROMPT = `You are the WorkSync AI HR Assistant, embedded in an HR management dashboard.
You help employees and admins with HR-related questions: leave policy, attendance, payroll terms,
onboarding, and general workplace questions. Be concise (2-5 sentences unless asked for detail),
friendly, and professional. If asked something outside HR/workplace topics, gently redirect.
Never invent specific personal data (salary figures, leave balances, dates) — if the user asks about
their own record, tell them to check the relevant WorkSync page (Payroll, Leaves, Attendance) instead
of guessing numbers.`;

// POST /api/ai/assistant  { message, history? }
router.post('/assistant', async (req, res) => {
  const { message, history = [] } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ message: 'A "message" string is required' });
  }

  try {
    const user = db.prepare('SELECT name, role, department, position FROM employees WHERE id = ?').get(req.user.id);
    const context = user
      ? `The current user is ${user.name}, a ${user.role} in the ${user.department} department (${user.position}).`
      : '';

    const conversation = [
      ...history
        .filter((h) => h && h.text)
        .slice(-8)
        .map((h) => ({ role: h.role === 'assistant' ? 'model' : 'user', text: h.text })),
      { role: 'user', text: message },
    ];

    const reply = await askGemini(`${SYSTEM_PROMPT}\n\n${context}`, conversation);
    res.json({ reply });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'AI assistant failed to respond' });
  }
});

// POST /api/ai/leave-reason-helper  { draft }
// Helps an employee polish a short leave request reason into clear, professional wording.
router.post('/leave-reason-helper', async (req, res) => {
  const { draft } = req.body;
  if (!draft || typeof draft !== 'string') {
    return res.status(400).json({ message: 'A "draft" string is required' });
  }
  try {
    const reply = await askGemini(
      'Rewrite the following leave-request reason in one short, clear, professional sentence. Reply with only the rewritten sentence, nothing else.',
      [{ role: 'user', text: draft }]
    );
    res.json({ suggestion: reply });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'AI assistant failed to respond' });
  }
});

module.exports = router;
