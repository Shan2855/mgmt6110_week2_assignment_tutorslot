import React from 'react';
import {
  HelpCircle,
  X,
  Search,
  CalendarCheck,
  Calendar,
  MessageSquare,
  GraduationCap,
  Sparkles,
  CheckCircle,
  CloudSun,
} from 'lucide-react';

interface HowToUseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToFindTutor: () => void;
  onGoToProfessors: () => void;
}

export const HowToUseModal: React.FC<HowToUseModalProps> = ({
  isOpen,
  onClose,
  onGoToFindTutor,
  onGoToProfessors,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="how-to-use-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 px-6 py-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 id="how-to-use-title" className="text-xl font-bold leading-tight">
                How to Use TutorSlot
              </h2>
              <p className="text-xs text-indigo-200 font-medium">
                Step-by-step guide to booking sessions, consulting professors, and tracking your week
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            aria-label="Close guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-slate-700">
          {/* Quick Summary Pill */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3.5 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-indigo-950 font-medium leading-relaxed">
              TutorSlot allows SMU students to find available tutoring slots, review faculty background & credentials, book 1-on-1 sessions instantly, send direct chat inquiries to professors, and check live campus weather before travelling.
            </p>
          </div>

          {/* Steps list */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Simple 4-Step Booking Workflow
            </h3>

            {/* Step 1 */}
            <div className="flex items-start gap-3.5 p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                1
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-sm font-bold text-slate-900">
                    Browse Tutors by Subject, Level (UG / PG), or Day
                  </h4>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Head to the <strong>Find a Tutor</strong> page. Use the filter chips to narrow by weekday or subject. Each tutor clearly displays their <strong>Study Level badge (UG / PG)</strong> and academic <strong>Major</strong> (e.g. Economics, Computer Science, Finance).
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3.5 p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                2
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-sm font-bold text-slate-900">
                    Select an Open Slot & Reserve
                  </h4>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Review the available room and time slots for the current week (Sep 7 – Sep 11, 2026). Click <strong>“Book This Slot”</strong> to lock in your appointment. A confirmation dialog appears instantly with the session summary.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3.5 p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                3
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-sm font-bold text-slate-900">
                    Track & Manage Your Appointments in “My Week”
                  </h4>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Switch to the <strong>My Week</strong> view anytime to see all confirmed sessions mapped out by day. You can review exact room locations, or cancel an appointment if your plans change (which immediately re-opens the slot for peers).
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-3.5 p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                4
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-violet-600" />
                  <h4 className="text-sm font-bold text-slate-900">
                    Explore Faculty Profiles & Send Chat Inquiries
                  </h4>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Visit the <strong>Faculty Profiles</strong> tab to inspect research background, academic degrees, notable publications, and teaching experience. Have a question before booking? Click <strong>“Send Chat Request”</strong> on any professor’s card to send your subject or slot query.
                </p>
              </div>
            </div>
          </div>

          {/* Bonus Features: Weather */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
              <CloudSun className="w-4 h-4 text-amber-500" />
              <span>Campus In-Person Weather Outlook</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              At the top of every page, the widget fetches Singapore’s official NEA 2-hour forecast for the SMU City area so you know whether to carry an umbrella for in-person campus study suites.
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <span className="text-xs text-slate-500">Need to get started right away?</span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                onClose();
                onGoToProfessors();
              }}
              className="flex-1 sm:flex-initial px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors cursor-pointer min-h-[40px]"
            >
              View Faculty Info
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onGoToFindTutor();
              }}
              className="flex-1 sm:flex-initial px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer min-h-[40px]"
            >
              Start Booking Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
