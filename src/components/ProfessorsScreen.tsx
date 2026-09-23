import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Building,
  Mail,
  MapPin,
  FileText,
  Briefcase,
  Star,
  MessageSquare,
  CalendarCheck,
  Search,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import { Tutor, StudyLevel } from '../types';

interface ProfessorsScreenProps {
  tutors: Tutor[];
  onOpenChat: (tutor: Tutor) => void;
  onGoToBooking: (tutor: Tutor) => void;
}

export const ProfessorsScreen: React.FC<ProfessorsScreenProps> = ({
  tutors,
  onOpenChat,
  onGoToBooking,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedMajor, setSelectedMajor] = useState<string>('All');
  const [expandedTutorId, setExpandedTutorId] = useState<string | null>(null);

  // Unique majors
  const allMajors = ['All', ...Array.from(new Set(tutors.map((t) => t.major)))];

  const filteredProfessors = tutors.filter((tutor) => {
    const matchesQuery =
      tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutor.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutor.major.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutor.profile.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLevel = selectedLevel === 'All' || tutor.level === selectedLevel;
    const matchesMajor = selectedMajor === 'All' || tutor.major === selectedMajor;

    return matchesQuery && matchesLevel && matchesMajor;
  });

  const toggleExpand = (id: string) => {
    setExpandedTutorId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-50 text-violet-800 mb-2 border border-violet-200">
              <GraduationCap className="w-3.5 h-3.5 text-violet-600" />
              <span>SMU Faculty Directory & Academic Profiles</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Faculty & Professor Profiles
            </h2>
            <p className="text-base text-slate-600 mt-1 leading-relaxed">
              Explore professor background, degrees, published research, teaching experience, and office hours. Send chat inquiries or jump directly into booking available tutoring slots.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-600"></span>
            <span>
              <strong>{tutors.length}</strong> Professors available
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by professor name, subject, major, or department…"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800"
              />
            </div>

            {/* Level Filter */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-1">
                Level:
              </span>
              {(['All', 'UG', 'PG'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer min-h-[36px] ${
                    selectedLevel === lvl
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Major Filter Chips */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-1">
              Major:
            </span>
            {allMajors.map((maj) => (
              <button
                key={maj}
                type="button"
                onClick={() => setSelectedMajor(maj)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  selectedMajor === maj
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {maj}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Professor Profile Cards */}
      <div className="space-y-6">
        {filteredProfessors.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-500">
            <p className="text-base font-semibold">No faculty profiles matched your search.</p>
            <p className="text-xs text-slate-400 mt-1">Try clearing filters or search keywords.</p>
          </div>
        ) : (
          filteredProfessors.map((tutor) => {
            const isExpanded = expandedTutorId === tutor.id;
            const openSlots = tutor.slots.filter((s) => !s.isBooked).length;

            return (
              <article
                key={tutor.id}
                id={`professor-card-${tutor.id}`}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:border-slate-300 transition-all"
              >
                {/* Header Section */}
                <div className="p-5 sm:p-6 border-b border-slate-100">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    {/* Left: Avatar & Basic Information */}
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl font-black text-xl flex items-center justify-center shrink-0 shadow-sm ${tutor.avatarColor}`}
                      >
                        {tutor.avatarInitials}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                            {tutor.name}
                          </h3>
                          {/* Study Level Badge (UG / PG) */}
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-extrabold uppercase tracking-wide ${
                              tutor.level === 'UG'
                                ? 'bg-sky-100 text-sky-800 border border-sky-300'
                                : 'bg-purple-100 text-purple-800 border border-purple-300'
                            }`}
                          >
                            Level: {tutor.level}
                          </span>
                          {/* Major Badge */}
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
                            Major: {tutor.major}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm font-semibold text-indigo-700">
                          {tutor.profile.title} • {tutor.profile.department}
                        </p>

                        <p className="text-xs text-slate-500 font-medium pt-0.5">
                          Course Tutoring: <strong className="text-slate-700">{tutor.subject}</strong>
                        </p>
                      </div>
                    </div>

                    {/* Right: Rating & Quick Actions */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2.5 shrink-0 pt-2 sm:pt-0">
                      <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg text-xs font-bold text-amber-800">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{tutor.rating.toFixed(1)}</span>
                        <span className="text-amber-600 font-normal">({tutor.reviewCount} reviews)</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Chat Request Button */}
                        <button
                          type="button"
                          onClick={() => onOpenChat(tutor)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors cursor-pointer min-h-[38px]"
                          title="Send a chat question or slot query to this professor"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Chat Request</span>
                        </button>

                        {/* Direct Booking jump */}
                        <button
                          type="button"
                          onClick={() => onGoToBooking(tutor)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer min-h-[38px] shadow-2xs"
                        >
                          <CalendarCheck className="w-3.5 h-3.5" />
                          <span>Book Slot ({openSlots})</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Details Grid */}
                <div className="p-5 sm:p-6 bg-slate-50/50 space-y-4">
                  {/* Background */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                      Academic & Professional Background
                    </h4>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {tutor.profile.background}
                    </p>
                  </div>

                  {/* Education & Credentials */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                      Education & Degrees
                    </h4>
                    <ul className="space-y-1">
                      {tutor.profile.education.map((edu, idx) => (
                        <li key={idx} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                          <span>{edu}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Teaching Experience */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                      Teaching Experience & Pedagogy
                    </h4>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {tutor.profile.teachingExperience}
                    </p>
                  </div>

                  {/* Expandable Publications & Office details */}
                  {isExpanded && (
                    <div className="pt-2 border-t border-slate-200/80 space-y-4 animate-in fade-in duration-150">
                      {/* Publications */}
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1.5">
                          <FileText className="w-3.5 h-3.5 text-indigo-600" />
                          Notable Scholarly Publications
                        </h4>
                        <ul className="space-y-1.5">
                          {tutor.profile.publications.map((pub, idx) => (
                            <li
                              key={idx}
                              className="text-xs text-slate-600 bg-white border border-slate-200/80 rounded-lg p-2.5 italic leading-relaxed"
                            >
                              {pub}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Office & Contact */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div className="bg-white border border-slate-200/80 rounded-xl p-3 flex items-center gap-2.5">
                          <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                          <div className="text-xs">
                            <span className="font-bold text-slate-700 block">Faculty Office:</span>
                            <span className="text-slate-600">{tutor.profile.officeLocation}</span>
                          </div>
                        </div>

                        <div className="bg-white border border-slate-200/80 rounded-xl p-3 flex items-center gap-2.5">
                          <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                          <div className="text-xs">
                            <span className="font-bold text-slate-700 block">Institutional Email:</span>
                            <span className="text-indigo-600 font-mono">{tutor.profile.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Toggle expand button */}
                  <div className="pt-1 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => toggleExpand(tutor.id)}
                      className="text-xs font-bold text-indigo-700 hover:text-indigo-900 underline hover:no-underline cursor-pointer py-1"
                    >
                      {isExpanded ? 'Show less information ▲' : 'View publications & contact details ▼'}
                    </button>

                    <span className="text-xs text-slate-400 font-medium">
                      Tutoring slots: <strong>{openSlots}</strong> available this week
                    </span>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};
