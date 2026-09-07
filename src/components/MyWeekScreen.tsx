import React, { useState } from 'react';
import { WeeklyScheduleItem, DayOfWeek } from '../types';
import { DAYS_OF_WEEK, CURRENT_WEEK_DATES } from '../data';
import {
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Trash2,
} from 'lucide-react';

interface MyWeekScreenProps {
  schedule: WeeklyScheduleItem[];
  onGoToFindTutor: () => void;
  onCancelBooking: (slotId: string) => void;
}

export const MyWeekScreen: React.FC<MyWeekScreenProps> = ({
  schedule,
  onGoToFindTutor,
  onCancelBooking,
}) => {
  const [activeDayView, setActiveDayView] = useState<string>('All');

  // Filter items by day if a specific day is selected - only booked tutoring sessions
  const bookedTutoringItems = schedule.filter((item) => item.type === 'tutoring');

  const daysToRender =
    activeDayView === 'All'
      ? DAYS_OF_WEEK
      : DAYS_OF_WEEK.filter((d) => d === activeDayView);

  return (
    <div className="space-y-6">
      {/* Top Overview & Summary */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 mb-2 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Booked Tutoring Sessions</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              My Week
            </h2>
            <p className="text-base text-slate-600 mt-1">
              Your booked 1-on-1 tutoring sessions for the current week, organized by day.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-center min-w-[120px]">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Tutoring Booked
              </div>
              <div className="text-2xl font-black text-indigo-700 mt-0.5">
                {bookedTutoringItems.length}
              </div>
            </div>

            <button
              id="my-week-find-more-btn"
              type="button"
              onClick={onGoToFindTutor}
              className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl text-sm min-h-[44px] transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Book Another</span>
            </button>
          </div>
        </div>

        {/* Highlight notification if bookings exist */}
        {bookedTutoringItems.length > 0 ? (
          <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-sm text-emerald-950 font-medium">
              You have <strong>{bookedTutoringItems.length} confirmed tutoring appointment{bookedTutoringItems.length > 1 ? 's' : ''}</strong> scheduled for this week.
            </div>
          </div>
        ) : (
          <div className="mt-4 p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-sm text-amber-900 font-medium">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>No tutoring sessions booked yet for this week.</span>
            </div>
            <button
              type="button"
              onClick={onGoToFindTutor}
              className="text-xs font-bold text-amber-900 underline hover:text-amber-950 cursor-pointer min-h-[36px] flex items-center"
            >
              Find a slot now →
            </button>
          </div>
        )}

        {/* Day Selector Pills for Easy Phone Access */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Filter by Day:
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveDayView('All')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap min-h-[44px] transition-colors cursor-pointer ${
                activeDayView === 'All'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Full Week
            </button>
            {DAYS_OF_WEEK.map((day) => {
              const dayTutoringItems = bookedTutoringItems.filter((i) => i.day === day);
              const hasTutoring = dayTutoringItems.length > 0;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setActiveDayView(day)}
                  className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap min-h-[44px] transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeDayView === day
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{day.substring(0, 3)}</span>
                  {hasTutoring && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Daily Schedule List */}
      <div className="space-y-6">
        {daysToRender.map((day) => {
          const dayItems = bookedTutoringItems.filter((item) => item.day === day);
          const dateStr = CURRENT_WEEK_DATES[day] || day;
          const tutoringCount = dayItems.length;

          return (
            <section
              key={day}
              id={`schedule-day-${day.toLowerCase()}`}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs"
            >
              {/* Day Header */}
              <div className="bg-slate-50/80 px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-base sm:text-lg font-bold text-slate-900">
                    {day}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-md">
                    {dateStr}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {tutoringCount > 0 ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{tutoringCount} Tutoring Booked</span>
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">
                      No sessions
                    </span>
                  )}
                </div>
              </div>

              {/* Day Schedule Items */}
              <div className="p-4 sm:p-5">
                {dayItems.length === 0 ? (
                  <div className="py-6 text-center text-slate-400 text-sm">
                    <p>No tutoring sessions booked for this day.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {dayItems.map((item) => {
                      return (
                        <div
                          key={item.id}
                          id={`schedule-item-${item.id}`}
                          className="p-4 rounded-xl border bg-emerald-50/90 border-emerald-400 ring-2 ring-emerald-500/20 shadow-xs transition-all"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div className="space-y-1 flex-1">
                              {/* Type Badge & Time */}
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-emerald-600 text-white">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>CONFIRMED TUTORING SESSION</span>
                                </span>

                                <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                                  <span>{item.time}</span>
                                </div>
                              </div>

                              {/* Title / Subject */}
                              <h4 className="text-base sm:text-lg font-bold text-slate-900 pt-1">
                                {item.title}
                              </h4>

                              {/* Tutor Details */}
                              {item.tutorName && (
                                <p className="text-sm font-semibold text-emerald-900">
                                  Tutor: <strong>{item.tutorName}</strong> — {item.subject}
                                </p>
                              )}

                              {/* Location */}
                              <div className="flex items-center gap-1.5 text-xs text-slate-600 pt-0.5">
                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>{item.location}</span>
                              </div>
                            </div>

                            {/* Actions for Booked Tutoring Item */}
                            {item.slotId && (
                              <div className="self-end sm:self-start pt-2 sm:pt-0">
                                <button
                                  type="button"
                                  onClick={() => onCancelBooking(item.slotId!)}
                                  className="text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer min-h-[36px]"
                                  title="Cancel this tutoring appointment"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Cancel Booking</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
