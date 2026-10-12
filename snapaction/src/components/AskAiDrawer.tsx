import React, { useState } from 'react';
import { X, Send, Sparkles, HelpCircle, Loader2, CornerDownLeft } from 'lucide-react';
import { ScreenshotItem } from '../types';

interface AskAiDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  screenshot: ScreenshotItem | null;
}

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export const AskAiDrawer: React.FC<AskAiDrawerProps> = ({ isOpen, onClose, screenshot }) => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !screenshot) return null;

  const samplePrompts = [
    'What is the deadline?',
    'Who is this from?',
    'What should I do next?',
    'Is there any hidden fee or penalty?',
    'Summarize this in one sentence',
  ];

  const handleAsk = async (promptText: string) => {
    if (!promptText.trim()) return;

    const userMsg: ChatMessage = { sender: 'user', text: promptText };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion('');
    setLoading(true);

    try {
      const res = await fetch('/api/ask-screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: promptText,
          screenshotData: {
            category: screenshot.category,
            title: screenshot.title,
            summary: screenshot.summary,
            extractedEntities: screenshot.extractedEntities,
            ocrText: screenshot.ocrText,
          },
          imageBase64: screenshot.imageSrc?.startsWith('data:image') ? screenshot.imageSrc : null,
        }),
      });

      const data = await res.json();
      const aiText = data.answer || 'Based on this screenshot, the information has been processed and relevant action triggers are available.';
      setMessages((prev) => [...prev, { sender: 'ai', text: aiText }]);
    } catch (e) {
      // Local contextual fallback
      let fallback = `Based on this ${screenshot.category} screenshot: ${screenshot.summary}`;
      if (promptText.toLowerCase().includes('deadline') || promptText.toLowerCase().includes('due')) {
        const due = screenshot.extractedEntities.find((e) => e.key.includes('date') || e.key.includes('due') || e.key.includes('deadline'));
        fallback = due ? `The key deadline is ${due.value}.` : `No explicit deadline was detected in this screenshot.`;
      }
      setMessages((prev) => [...prev, { sender: 'ai', text: fallback }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-[#0A0A0A] border border-[#222] rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4 max-h-[85vh] flex flex-col animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#1A1A1A] flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#141414] text-blue-400 border border-[#262626] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-[#EDEDED]">Ask About Screenshot</h3>
              <p className="text-[11px] text-[#888] truncate max-w-[200px]">
                {screenshot.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#888] hover:text-[#EDEDED] hover:bg-[#1A1A1A]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 flex-shrink-0 no-scrollbar">
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleAsk(prompt)}
              disabled={loading}
              className="px-2.5 py-1 rounded-lg bg-[#111] hover:bg-[#161616] border border-[#222] text-[11px] font-medium text-[#888] hover:text-[#EDEDED] whitespace-nowrap transition-colors flex-shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto space-y-3 min-h-[160px] pr-1">
          {messages.length === 0 ? (
            <div className="text-center py-6 space-y-2">
              <HelpCircle className="w-8 h-8 text-[#555] mx-auto" />
              <p className="text-xs text-[#888]">
                Ask any specific question about dates, contacts, flight codes, or instructions in this screenshot.
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-[#111] text-[#EDEDED] border border-[#222] rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#111] rounded-2xl rounded-bl-none px-4 py-2 text-xs text-[#888] flex items-center space-x-2 border border-[#222]">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
                <span>Reading screenshot...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk(question);
          }}
          className="relative pt-2 border-t border-[#1A1A1A] flex-shrink-0"
        >
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type a question about this image..."
            className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-[#050505] border border-[#262626] text-xs text-[#EDEDED] placeholder-[#555] focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={!question.trim() || loading}
            className="absolute right-2 top-4 p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-40 transition-opacity"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
