import React from 'react';
import { CheckCircle2, Calendar, ArrowRight, X, MapPin, Clock } from 'lucide-react';
import { TutoringSlot, Tutor } from '../types';

interface BookingConfirmationModalProps {
  slot: TutoringSlot | null;
  tutor: Tutor | null;
  isOpen: boolean;
  onClose: () => void;
  onGoToMyWeek: () => void;
}

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  slot,
  tutor,
  isOpen,
  onClose,
  onGoToMyWeek,
}) => {
  if (!isOpen || !slot || !tutor) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Top celebratory bar */}
        <div className="bg-emerald-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 id="modal-title" className="text-lg font-bold leading-tight">
                Session Confirmed!
              </h2>
              <p className="text-xs text-emerald-100 font-medium">
                Added directly to your weekly schedule
              </p>
            </div>
          </div>
          <button
            id="close-modal-btn"
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Details Card */}
        <div className="p-6 space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-1">
              Tutor & Subject
            </div>
            <div className="text-base font-bold text-slate-900">
              {tutor.name}
            </div>
            <div className="text-sm text-indigo-700 font-medium mt-0.5">
              {tutor.subject}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-1 gap-2.5">
              <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                <span>
                  {slot.day}, {slot.dateStr}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                <span>{slot.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                <span>{slot.room}</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">
            Your appointment is locked in for this week. It is now visible in the <strong>My Week</strong> view under <strong>{slot.day}</strong>.
          </p>

          {/* Action buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              id="modal-view-week-btn"
              type="button"
              onClick={onGoToMyWeek}
              className="flex-1 min-h-[48px] px-4 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl text-base flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <span>View in My Week</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              id="modal-stay-btn"
              type="button"
              onClick={onClose}
              className="min-h-[48px] px-4 py-3 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-medium rounded-xl text-sm transition-colors cursor-pointer"
            >
              Stay on Tutors
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
