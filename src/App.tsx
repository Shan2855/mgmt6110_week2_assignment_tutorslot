import React, { useState } from 'react';
import { ActiveScreen, Tutor, TutoringSlot, WeeklyScheduleItem } from './types';
import { INITIAL_TUTORS, INITIAL_STUDENT_SCHEDULE } from './data';
import { Header } from './components/Header';
import { FindTutorScreen } from './components/FindTutorScreen';
import { MyWeekScreen } from './components/MyWeekScreen';
import { BookingConfirmationModal } from './components/BookingConfirmationModal';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('find');
  const [tutors, setTutors] = useState<Tutor[]>(INITIAL_TUTORS);
  const [schedule, setSchedule] = useState<WeeklyScheduleItem[]>(INITIAL_STUDENT_SCHEDULE);

  // Modal confirmation state
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    tutor: Tutor | null;
    slot: TutoringSlot | null;
  }>({
    isOpen: false,
    tutor: null,
    slot: null,
  });

  // Count total booked tutoring sessions
  const bookedSessionsCount = schedule.filter((item) => item.type === 'tutoring').length;

  /**
   * Book a tutoring slot:
   * 1. Updates the tutor slot to isBooked: true
   * 2. Adds the new confirmed appointment into the student's My Week schedule
   * 3. Displays the confirmation modal
   */
  const handleBookSlot = (tutor: Tutor, slot: TutoringSlot) => {
    // 1. Update tutor slot state
    setTutors((prevTutors) =>
      prevTutors.map((t) => {
        if (t.id !== tutor.id) return t;
        return {
          ...t,
          slots: t.slots.map((s) =>
            s.id === slot.id
              ? {
                  ...s,
                  isBooked: true,
                  bookedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                }
              : s
          ),
        };
      })
    );

    // 2. Add to weekly schedule immediately
    const newScheduleItem: WeeklyScheduleItem = {
      id: `booking-${slot.id}-${Date.now()}`,
      day: slot.day,
      dateStr: slot.dateStr,
      time: slot.time,
      title: `1-on-1 Tutoring: ${tutor.subject}`,
      type: 'tutoring',
      location: slot.room,
      tutorName: tutor.name,
      subject: tutor.subject,
      slotId: slot.id,
    };

    setSchedule((prevSchedule) => {
      // Prevent duplicates just in case
      const filtered = prevSchedule.filter((item) => item.slotId !== slot.id);
      return [...filtered, newScheduleItem];
    });

    // 3. Show confirmation feedback
    setModalState({
      isOpen: true,
      tutor,
      slot: { ...slot, isBooked: true },
    });
  };

  /**
   * Cancel a booked tutoring session:
   * 1. Restores the tutor slot to available
   * 2. Removes the appointment from My Week schedule
   */
  const handleCancelSlot = (slotId: string) => {
    // 1. Restore tutor slot
    setTutors((prevTutors) =>
      prevTutors.map((t) => ({
        ...t,
        slots: t.slots.map((s) =>
          s.id === slotId ? { ...s, isBooked: false, bookedAt: undefined } : s
        ),
      }))
    );

    // 2. Remove from student schedule
    setSchedule((prevSchedule) => prevSchedule.filter((item) => item.slotId !== slotId));

    // Close modal if open for that slot
    if (modalState.slot?.id === slotId) {
      setModalState({ isOpen: false, tutor: null, slot: null });
    }
  };

  const handleGoToMyWeek = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
    setActiveScreen('schedule');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToFindTutor = () => {
    setActiveScreen('find');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white pb-12">
      {/* App Header with navigation switch */}
      <Header
        activeScreen={activeScreen}
        onSelectScreen={setActiveScreen}
        bookedCount={bookedSessionsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6">
        {activeScreen === 'find' ? (
          <FindTutorScreen
            tutors={tutors}
            onBookSlot={handleBookSlot}
            onCancelSlot={handleCancelSlot}
            onGoToMyWeek={handleGoToMyWeek}
          />
        ) : (
          <MyWeekScreen
            schedule={schedule}
            onGoToFindTutor={handleGoToFindTutor}
            onCancelBooking={handleCancelSlot}
          />
        )}
      </main>

      {/* Booking Confirmation Dialog */}
      <BookingConfirmationModal
        isOpen={modalState.isOpen}
        tutor={modalState.tutor}
        slot={modalState.slot}
        onClose={() => setModalState({ isOpen: false, tutor: null, slot: null })}
        onGoToMyWeek={handleGoToMyWeek}
      />
    </div>
  );
}
