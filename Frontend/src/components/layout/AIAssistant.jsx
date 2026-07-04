import { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot } from 'lucide-react';
import { aiAPI } from '../../api/ai';

const AIAssistant = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm the WorkSync AI Assistant. Ask me about leave policy, attendance, payroll terms, or anything HR-related." },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const history = messages;
    setMessages((m) => [...m, { role: 'user', text }]);
    setInput('');
    setLoading(true);
    try {
      const { reply } = await aiAPI.ask(text, history);
      setMessages((m) => [...m, { role: 'assistant', text: reply }]);
    } catch (err) {
      setMessages((m) => [...m, { role: 'assistant', text: `⚠️ ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {/* Floating launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-40 w-13 h-13 rounded-full bg-primary-600 hover:bg-primary-700 text-white shadow-card-lg flex items-center justify-center transition-all hover:scale-105"
        style={{ width: 52, height: 52 }}
        aria-label="Open AI Assistant"
      >
        {open ? <X size={22} /> : <Sparkles size={22} />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-40 w-[340px] max-w-[90vw] h-[460px] max-h-[70vh] card shadow-card-lg flex flex-col overflow-hidden animate-fade-in">
          <div className="flex items-center gap-2 p-4 border-b border-warm-100 bg-warm-50">
            <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
              <Bot size={16} className="text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-warm-900">AI Assistant</p>
              <p className="text-[11px] text-warm-400">Powered by Gemini</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-primary-600 text-white rounded-br-sm'
                      : 'bg-warm-100 text-warm-800 rounded-bl-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-warm-100 text-warm-500 text-sm px-3 py-2 rounded-2xl rounded-bl-sm">
                  Thinking…
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="p-3 border-t border-warm-100 flex items-end gap-2">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask about leave, attendance, payroll…"
              className="flex-1 resize-none text-sm rounded-xl border border-warm-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="w-9 h-9 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-40 disabled:hover:bg-primary-600 text-white flex items-center justify-center transition-colors"
              aria-label="Send"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
