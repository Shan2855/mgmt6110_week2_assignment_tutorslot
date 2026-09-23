import React, { useState } from 'react';
import {
  MessageSquare,
  X,
  Send,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Tutor } from '../types';

interface ChatRequestModalProps {
  isOpen: boolean;
  tutor: Tutor | null;
  onClose: () => void;
  onSubmit: (data: {
    tutorId: string;
    tutorName: string;
    subject: string;
    studentName: string;
    studentEmail: string;
    queryType: 'booking' | 'subject' | 'general';
    message: string;
    preferredContact: 'email' | 'portal_chat';
  }) => void;
}

export const ChatRequestModal: React.FC<ChatRequestModalProps> = ({
  isOpen,
  tutor,
  onClose,
  onSubmit,
}) => {
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [queryType, setQueryType] = useState<'booking' | 'subject' | 'general'>('booking');
  const [message, setMessage] = useState('');
  const [preferredContact, setPreferredContact] = useState<'email' | 'portal_chat'>('portal_chat');
  const [submitted, setSubmitted] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen || !tutor) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentEmail.trim() || !message.trim()) {
      setValidationError('Please fill in your name, email, and query message.');
      return;
    }
    setValidationError(null);

    onSubmit({
      tutorId: tutor.id,
      tutorName: tutor.name,
      subject: tutor.subject,
      studentName: studentName.trim(),
      studentEmail: studentEmail.trim(),
      queryType,
      message: message.trim(),
      preferredContact,
    });

    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setMessage('');
    setValidationError(null);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-indigo-600 px-6 py-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 id="chat-modal-title" className="text-lg font-bold leading-tight">
                Send Chat Request
              </h2>
              <p className="text-xs text-indigo-100 font-medium">
                Connect directly with {tutor.name}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {submitted ? (
          <div className="p-6 text-center space-y-4 flex-1 flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Chat Request Sent!
            </h3>
            <p className="text-sm text-slate-600 max-w-sm leading-relaxed">
              Your inquiry has been routed to <strong>{tutor.name}</strong> ({tutor.profile.department}). The professor receives notification with your message and preferred response channel.
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700 w-full text-left space-y-1">
              <div><strong>Recipient:</strong> {tutor.name} &lt;{tutor.profile.email}&gt;</div>
              <div><strong>Subject Focus:</strong> {tutor.subject} ({tutor.level} • {tutor.major})</div>
              <div><strong>Preferred Channel:</strong> {preferredContact === 'portal_chat' ? 'TutorSlot Student Chat' : 'Direct Email'}</div>
            </div>
            <button
              type="button"
              onClick={handleResetAndClose}
              className="mt-4 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer min-h-[44px]"
            >
              Back to TutorSlot
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
            {/* Tutor Context summary */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl font-bold text-sm flex items-center justify-center shrink-0 ${tutor.avatarColor}`}
              >
                {tutor.avatarInitials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {tutor.name}
                  </h4>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-indigo-100 text-indigo-700">
                    {tutor.level}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-200 text-slate-700">
                    {tutor.major}
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate">{tutor.subject}</p>
              </div>
            </div>

            {validationError && (
              <div className="text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-2.5">
                {validationError}
              </div>
            )}

            {/* Query Type radio selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Inquiry Topic / Reason
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setQueryType('booking')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    queryType === 'booking'
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-900 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <span>Slot Booking</span>
                </button>
                <button
                  type="button"
                  onClick={() => setQueryType('subject')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    queryType === 'subject'
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-900 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>Subject Query</span>
                </button>
                <button
                  type="button"
                  onClick={() => setQueryType('general')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    queryType === 'general'
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-900 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <HelpCircle className="w-4 h-4 text-indigo-600" />
                  <span>General Advice</span>
                </button>
              </div>
            </div>

            {/* Student Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="student-name"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Your Full Name
                </label>
                <input
                  id="student-name"
                  type="text"
                  required
                  placeholder="e.g. Alex Tan"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="student-email"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Your SMU Email
                </label>
                <input
                  id="student-email"
                  type="email"
                  required
                  placeholder="e.g. alex.tan.2024@smu.edu.sg"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="query-message"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Your Message / Question for {tutor.name}
              </label>
              <textarea
                id="query-message"
                required
                rows={3}
                placeholder="Ask about slot availability, prerequisite readings, homework concepts, or specific topic coverage..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              />
            </div>

            {/* Preferred contact channel */}
            <div>
              <span className="block text-xs font-bold text-slate-700 mb-1">
                How would you prefer the professor to reply?
              </span>
              <div className="flex gap-4 text-xs font-medium text-slate-700">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="preferredChannel"
                    checked={preferredContact === 'portal_chat'}
                    onChange={() => setPreferredContact('portal_chat')}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Portal Chat & App Notification</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="preferredChannel"
                    checked={preferredContact === 'email'}
                    onChange={() => setPreferredContact('email')}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Direct Email Reply</span>
                </label>
              </div>
            </div>

            {/* Submit buttons */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors cursor-pointer min-h-[42px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer min-h-[42px] flex items-center gap-1.5 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Request</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
