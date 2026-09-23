import React, { useState } from 'react';
import { Tutor, TutoringSlot, DayOfWeek, StudyLevel } from '../types';
import { DAYS_OF_WEEK } from '../data';
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  Check,
  CheckCircle2,
  CalendarCheck,
  Filter,
  XCircle,
  Sparkles,
  MessageSquare,
  GraduationCap,
} from 'lucide-react';

interface FindTutorScreenProps {
  tutors: Tutor[];
  onBookSlot: (tutor: Tutor, slot: TutoringSlot) => void;
  onCancelSlot: (slotId: string) => void;
  onGoToMyWeek: () => void;
  onOpenChat: (tutor: Tutor) => void;
  onViewProfessorProfile: (tutor: Tutor) => void;
}

export const FindTutorScreen: React.FC<FindTutorScreenProps> = ({
  tutors,
  onBookSlot,
  onCancelSlot,
  onGoToMyWeek,
  onOpenChat,
  onViewProfessorProfile,
}) => {
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('All');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('All');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('All');
  const [selectedMajorFilter, setSelectedMajorFilter] = useState<string>('All');

  // Extract unique subjects & majors for phone filtering
  const allSubjects = ['All', ...Array.from(new Set(tutors.map((t) => t.subject.split(' & ')[0])))];
  const allMajors = ['All', ...Array.from(new Set(tutors.map((t) => t.major)))];

  // Filter tutors based on selected filters
  const filteredTutors = tutors.filter((tutor) => {
    if (selectedSubjectFilter !== 'All' && !tutor.subject.includes(selectedSubjectFilter)) {
      return false;
    }
    if (selectedLevelFilter !== 'All' && tutor.level !== selectedLevelFilter) {
      return false;
    }
    if (selectedMajorFilter !== 'All' && tutor.major !== selectedMajorFilter) {
      return false;
    }
    if (selectedDayFilter !== 'All') {
      const hasSlotOnDay = tutor.slots.some((s) => s.day === selectedDayFilter);
      if (!hasSlotOnDay) return false;
    }
    return true;
  });

  // Calculate stats
  const bookedSlotsCount = tutors.flatMap((t) => t.slots).filter((s) => s.isBooked).length;

  return (
    <div className="space-y-6">
      {/* Screen Title & Quick Context */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 mb-2">
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Current Week Booking Window (Sep 7 – Sep 11, 2026)</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Find a Tutor
            </h2>
            <p className="text-base text-slate-600 mt-1 leading-relaxed">
              Select an open tutoring slot below to book your 1-on-1 academic session. Check whether each course belongs to <strong>UG</strong> or <strong>PG</strong>, review the academic <strong>Major</strong>, and contact professors via chat anytime.
            </p>
          </div>
        </div>

        {/* Day Filter Pills for Quick Phone Navigation */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Filter by Day:
            </span>
            {selectedDayFilter !== 'All' && (
              <button
                type="button"
                onClick={() => setSelectedDayFilter('All')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
              >
                Clear Day
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedDayFilter('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer min-h-[36px] ${
                selectedDayFilter === 'All'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Days
            </button>
            {DAYS_OF_WEEK.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDayFilter(day)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer min-h-[36px] ${
                  selectedDayFilter === day
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Academic Level & Major Filters */}
        <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Level Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Study Level (UG / PG):
            </label>
            <div className="flex items-center gap-1.5">
              {(['All', 'UG', 'PG'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedLevelFilter(lvl)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer min-h-[36px] ${
                    selectedLevelFilter === lvl
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {lvl === 'All' ? 'All Levels' : lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Major Filter */}
          <div>
            <label
              htmlFor="major-select-filter"
              className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1"
            >
              Academic Major:
            </label>
            <select
              id="major-select-filter"
              value={selectedMajorFilter}
              onChange={(e) => setSelectedMajorFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[36px] cursor-pointer"
            >
              {allMajors.map((maj) => (
                <option key={maj} value={maj}>
                  {maj === 'All' ? 'All Majors' : maj}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Filter Dropdown */}
          <div>
            <label
              htmlFor="subject-select-filter"
              className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1"
            >
              Subject Focus:
            </label>
            <select
              id="subject-select-filter"
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[36px] cursor-pointer"
            >
              {allSubjects.map((subj) => (
                <option key={subj} value={subj}>
                  {subj === 'All' ? 'All Subjects' : subj}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Booked Session Reminder Banner if any session is booked */}
      {bookedSlotsCount > 0 && (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-emerald-900 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-base text-emerald-950">
                You have {bookedSlotsCount} confirmed booking{bookedSlotsCount > 1 ? 's' : ''} this week!
              </div>
              <div className="text-sm text-emerald-800">
                Check your weekly schedule to see your reserved appointment times.
              </div>
            </div>
          </div>
          <button
            id="find-view-my-week-btn"
            type="button"
            onClick={onGoToMyWeek}
            className="w-full sm:w-auto px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl min-h-[44px] transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>View My Week</span>
            <span>→</span>
          </button>
        </div>
      )}

      {/* Tutor Rows List */}
      <div className="space-y-5">
        {filteredTutors.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
            <p className="text-base text-slate-600 font-medium">
              No tutors found matching the selected filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedDayFilter('All');
                setSelectedSubjectFilter('All');
                setSelectedLevelFilter('All');
                setSelectedMajorFilter('All');
              }}
              className="mt-3 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl cursor-pointer min-h-[44px]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredTutors.map((tutor) => {
            const tutorHasBookedSlot = tutor.slots.some((s) => s.isBooked);

            return (
              <article
                key={tutor.id}
                id={`tutor-card-${tutor.id}`}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs ${
                  tutorHasBookedSlot
                    ? 'border-emerald-300 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Tutor Header Info */}
                <div className="p-5 sm:p-6 border-b border-slate-100">
                  <div className="flex items-start gap-3.5">
                    {/* Avatar Initials */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base shadow-xs shrink-0 ${tutor.avatarColor}`}
                      aria-label={tutor.name}
                    >
                      {tutor.avatarInitials}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
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

                        {/* Rating */}
                        <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-lg text-xs font-bold text-amber-800">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>{tutor.rating.toFixed(1)}</span>
                          <span className="text-amber-600 font-normal">
                            ({tutor.reviewCount})
                          </span>
                        </div>
                      </div>

                      {/* Subject */}
                      <p className="text-sm font-semibold text-indigo-700 mt-0.5">
                        {tutor.subject}
                      </p>

                      {/* Bio Description */}
                      <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                        {tutor.description}
                      </p>

                      {/* Professor Quick Actions: View Full Profile & Chat Request */}
                      <div className="mt-3 flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => onOpenChat(tutor)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer min-h-[34px]"
                          title="Have a query about slot booking or this subject? Send a chat request to this professor"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Chat Request</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onViewProfessorProfile(tutor)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer min-h-[34px]"
                          title="Read full background, degrees, publications, and teaching experience"
                        >
                          <GraduationCap className="w-3.5 h-3.5" />
                          <span>Professor Background & Publications</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Slots Section */}
                <div className="p-4 sm:p-5 bg-slate-50/60">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Tutoring Slots This Week ({tutor.slots.length} available)
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Select one to reserve
                    </span>
                  </div>

                  {/* Slot Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {tutor.slots.map((slot) => {
                      const isSlotBooked = slot.isBooked;

                      return (
                        <div
                          key={slot.id}
                          id={`slot-card-${slot.id}`}
                          className={`rounded-xl p-3.5 border transition-all flex flex-col justify-between min-h-[140px] ${
                            isSlotBooked
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-xs'
                              : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-xs'
                          }`}
                        >
                          <div>
                            {/* Slot Status Tag */}
                            <div className="flex items-center justify-between gap-1 mb-2">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold ${
                                  isSlotBooked
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {isSlotBooked ? (
                                  <>
                                    <Check className="w-3 h-3" />
                                    <span>CONFIRMED BOOKING</span>
                                  </>
                                ) : (
                                  <>
                                    <Clock className="w-3 h-3 text-slate-500" />
                                    <span>OPEN SLOT</span>
                                  </>
                                )}
                              </span>

                              <span className="text-xs font-semibold text-slate-500">
                                {slot.day}
                              </span>
                            </div>

                            {/* Level and Major Tag on Slot Card */}
                            <div className="flex items-center gap-1 mb-1.5 flex-wrap">
                              <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                                {tutor.level}
                              </span>
                              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-amber-50 text-amber-900 border border-amber-200">
                                {tutor.major}
                              </span>
                            </div>

                            {/* Slot Date & Time */}
                            <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              <span>{slot.dateStr}</span>
                            </div>

                            <div className="text-sm font-semibold text-slate-800 mt-1">
                              {slot.time}
                            </div>

                            <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{slot.room}</span>
                            </div>
                          </div>

                          {/* Action Button: Book or Confirmed */}
                          <div className="mt-3 pt-2 border-t border-slate-100">
                            {isSlotBooked ? (
                              <div className="space-y-1.5">
                                <div className="w-full py-2 px-3 bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Booked & Confirmed</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => onCancelSlot(slot.id)}
                                  className="w-full text-center text-xs text-slate-500 hover:text-rose-600 hover:underline font-medium py-1 cursor-pointer min-h-[36px] flex items-center justify-center"
                                >
                                  Cancel reservation
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                id={`book-slot-btn-${slot.id}`}
                                onClick={() => onBookSlot(tutor, slot)}
                                className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer min-h-[38px] flex items-center justify-center gap-1 shadow-2xs"
                              >
                                <span>Book This Slot</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
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
