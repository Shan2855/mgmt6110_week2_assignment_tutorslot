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
  CreditCard,
  Lock,
  AlertTriangle,
  Receipt,
  ShieldCheck,
} from 'lucide-react';

interface MyWeekScreenProps {
  schedule: WeeklyScheduleItem[];
  onGoToFindTutor: () => void;
  onCancelBooking: (slotId: string) => void;
  onOpenPayment: (item: WeeklyScheduleItem) => void;
  onPayAllBookings: (items: WeeklyScheduleItem[]) => void;
}

export const MyWeekScreen: React.FC<MyWeekScreenProps> = ({
  schedule,
  onGoToFindTutor,
  onCancelBooking,
  onOpenPayment,
  onPayAllBookings,
}) => {
  const [activeDayView, setActiveDayView] = useState<string>('All');

  // Filter items by day if a specific day is selected - only booked tutoring sessions
  const bookedTutoringItems = schedule.filter((item) => item.type === 'tutoring');

  // Breakdown of paid vs unpaid items
  const unpaidItems = bookedTutoringItems.filter((item) => !item.isPaid);
  const paidItems = bookedTutoringItems.filter((item) => item.isPaid);

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
              Your booked 1-on-1 tutoring sessions for the current week, organized by day. Pay for your booked sessions and review course locations.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-center min-w-[110px]">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Booked
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

        {/* Payment Summary Bar when sessions exist */}
        {bookedTutoringItems.length > 0 && (
          <div className="mt-4 p-4 rounded-xl border border-indigo-200 bg-indigo-50/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-indigo-700" />
                <span className="text-sm font-bold text-indigo-950">
                  Tutoring Tuition & Payment Status:
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-200 text-indigo-900">
                  {paidItems.length} / {bookedTutoringItems.length} Paid
                </span>
              </div>
              <p className="text-xs text-indigo-800">
                Standard peer/faculty tutoring rate: <strong>S$35.00</strong> per class.
                {unpaidItems.length > 0 ? (
                  <span> You have <strong>{unpaidItems.length} unpaid class{unpaidItems.length > 1 ? 'es' : ''}</strong> awaiting payment.</span>
                ) : (
                  <span> All booked classes for this week are fully paid!</span>
                )}
              </p>
            </div>

            {unpaidItems.length > 0 && (
              <button
                type="button"
                onClick={() => onPayAllBookings(unpaidItems)}
                className="w-full md:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2 min-h-[42px]"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay All {unpaidItems.length} Classes (S${(unpaidItems.length * 35).toFixed(2)})</span>
              </button>
            )}
          </div>
        )}

        {/* NOTIFICATION BOX: Once payment is done, classes cannot be cancelled */}
        {bookedTutoringItems.length > 0 && (
          <div className="mt-3 p-3.5 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-950 leading-relaxed">
              <strong className="font-bold text-amber-900 block">
                Cancellation & Refund Rule:
              </strong>
              Tutoring classes can be cancelled for free while unpaid. <strong>Once payment is done, classes cannot be cancelled or refunded</strong> to ensure faculty schedules and room reservations remain guaranteed.
            </div>
          </div>
        )}

        {bookedTutoringItems.length === 0 && (
          <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
              <AlertCircle className="w-5 h-5 text-slate-400 shrink-0" />
              <span>No tutoring sessions booked yet for this week.</span>
            </div>
            <button
              type="button"
              onClick={onGoToFindTutor}
              className="text-xs font-bold text-indigo-600 underline hover:text-indigo-800 cursor-pointer min-h-[36px] flex items-center"
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
                      const isItemPaid = !!item.isPaid;

                      return (
                        <div
                          key={item.id}
                          id={`schedule-item-${item.id}`}
                          className={`p-4 rounded-xl border transition-all ${
                            isItemPaid
                              ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-500/20'
                              : 'bg-white border-indigo-200 ring-1 ring-indigo-500/10'
                          } shadow-xs`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div className="space-y-1.5 flex-1">
                              {/* Badges: Type & Payment Status */}
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-slate-900 text-white">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>CONFIRMED APPOINTMENT</span>
                                </span>

                                {/* Payment badge */}
                                {isItemPaid ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-extrabold bg-emerald-600 text-white shadow-2xs">
                                    <ShieldCheck className="w-3 h-3" />
                                    <span>PAID (S${(item.price ?? 35).toFixed(2)})</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                    <AlertCircle className="w-3 h-3 text-amber-700" />
                                    <span>UNPAID (S${(item.price ?? 35).toFixed(2)})</span>
                                  </span>
                                )}

                                <div className="text-xs font-bold text-slate-700 flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                                  <span>{item.time}</span>
                                </div>
                              </div>

                              {/* Title / Subject */}
                              <div className="flex items-center gap-2 flex-wrap pt-0.5">
                                <h4 className="text-base sm:text-lg font-bold text-slate-900">
                                  {item.title}
                                </h4>
                                {item.level && (
                                  <span
                                    className={`inline-flex items-center px-2 py-0.2 rounded text-[11px] font-extrabold uppercase ${
                                      item.level === 'UG'
                                        ? 'bg-sky-100 text-sky-800 border border-sky-300'
                                        : 'bg-purple-100 text-purple-800 border border-purple-300'
                                    }`}
                                  >
                                    Level: {item.level}
                                  </span>
                                )}
                                {item.major && (
                                  <span className="inline-flex items-center px-2 py-0.2 rounded text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                                    Major: {item.major}
                                  </span>
                                )}
                              </div>

                              {/* Tutor Details */}
                              {item.tutorName && (
                                <p className="text-sm font-semibold text-slate-800">
                                  Tutor: <strong>{item.tutorName}</strong> — {item.subject}
                                </p>
                              )}

                              {/* Location */}
                              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>{item.location}</span>
                              </div>

                              {/* Payment status message if paid */}
                              {isItemPaid && (
                                <p className="text-xs text-emerald-800 font-medium pt-1 flex items-center gap-1">
                                  <Lock className="w-3 h-3 text-emerald-600" />
                                  <span>
                                    Paid via {item.paymentMethod || 'Online Transfer'} at {item.paidAt || 'today'}. This class is locked and cannot be cancelled.
                                  </span>
                                </p>
                              )}
                            </div>

                            {/* Actions on this item */}
                            <div className="self-end sm:self-start pt-2 sm:pt-0 flex flex-col sm:flex-row items-end sm:items-center gap-2">
                              {/* Payment button if unpaid */}
                              {!isItemPaid && (
                                <button
                                  type="button"
                                  onClick={() => onOpenPayment(item)}
                                  className="text-xs text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer min-h-[36px] shadow-2xs"
                                  title="Pay for this tutoring session"
                                >
                                  <CreditCard className="w-3.5 h-3.5" />
                                  <span>Pay S$35.00</span>
                                </button>
                              )}

                              {/* Cancellation Button: Disabled with explanation if paid, active if unpaid */}
                              {isItemPaid ? (
                                <div
                                  className="text-xs text-slate-400 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 cursor-not-allowed min-h-[36px]"
                                  title="Non-cancellation rule: Paid classes cannot be cancelled"
                                >
                                  <Lock className="w-3 h-3 text-slate-400" />
                                  <span>Cannot Cancel (Paid)</span>
                                </div>
                              ) : (
                                item.slotId && (
                                  <button
                                    type="button"
                                    onClick={() => onCancelBooking(item.slotId!)}
                                    className="text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer min-h-[36px]"
                                    title="Cancel this unpaid reservation"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Cancel Booking</span>
                                  </button>
                                )
                              )}
                            </div>
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
