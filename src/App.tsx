import React, { useState, useEffect } from 'react';
import { ActiveScreen, Tutor, TutoringSlot, WeeklyScheduleItem, ChatRequest } from './types';
import { INITIAL_TUTORS, INITIAL_STUDENT_SCHEDULE } from './data';
import { Header } from './components/Header';
import { FindTutorScreen } from './components/FindTutorScreen';
import { MyWeekScreen } from './components/MyWeekScreen';
import { ProfessorsScreen } from './components/ProfessorsScreen';
import { BookingConfirmationModal } from './components/BookingConfirmationModal';
import { HowToUseModal } from './components/HowToUseModal';
import { ChatRequestModal } from './components/ChatRequestModal';
import { PaymentModal } from './components/PaymentModal';
import { CityWeatherWidget } from './components/CityWeatherWidget';
import { ErrorBoundary } from './components/ErrorBoundary';
import { RotateCcw } from 'lucide-react';

const STORAGE_KEY_SCHEDULE = 'tutorslot_schedule_v1';
const STORAGE_KEY_TUTORS = 'tutorslot_tutors_v1';
const STORAGE_KEY_CHATS = 'tutorslot_chats_v1';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('find');

  // Initialize state with persistence from localStorage
  const [tutors, setTutors] = useState<Tutor[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TUTORS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback on error
    }
    return INITIAL_TUTORS;
  });

  const [schedule, setSchedule] = useState<WeeklyScheduleItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SCHEDULE);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback on error
    }
    return INITIAL_STUDENT_SCHEDULE;
  });

  const [chatRequests, setChatRequests] = useState<ChatRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHATS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback on error
    }
    return [];
  });

  // Save changes to localStorage whenever state updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TUTORS, JSON.stringify(tutors));
    } catch {
      // Ignore storage errors
    }
  }, [tutors]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SCHEDULE, JSON.stringify(schedule));
    } catch {
      // Ignore storage errors
    }
  }, [schedule]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CHATS, JSON.stringify(chatRequests));
    } catch {
      // Ignore storage errors
    }
  }, [chatRequests]);

  // Reset demo state back to pristine state
  const handleResetDemoData = () => {
    try {
      localStorage.removeItem(STORAGE_KEY_TUTORS);
      localStorage.removeItem(STORAGE_KEY_SCHEDULE);
      localStorage.removeItem(STORAGE_KEY_CHATS);
    } catch {
      // Ignore storage errors
    }
    setTutors(INITIAL_TUTORS);
    setSchedule(INITIAL_STUDENT_SCHEDULE);
    setChatRequests([]);
  };

  // Modals state
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [selectedTutorForChat, setSelectedTutorForChat] = useState<Tutor | null>(null);

  // Payment Modal state
  const [paymentModalState, setPaymentModalState] = useState<{
    isOpen: boolean;
    item: WeeklyScheduleItem | null;
    itemsToPay?: WeeklyScheduleItem[];
  }>({
    isOpen: false,
    item: null,
  });

  // Booking Confirmation Modal state
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

  // Booking a slot handler
  const handleBookSlot = (tutor: Tutor, slot: TutoringSlot) => {
    // 1. Update the tutor slot to be marked as booked
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
                  studentName: 'Alex Tan',
                  bookedAt: new Date().toISOString(),
                  isPaid: false,
                  price: 35,
                }
              : s
          ),
        };
      })
    );

    // 2. Add this session to the student's weekly schedule (unpaid by default)
    const newScheduleItem: WeeklyScheduleItem = {
      id: `booking-${slot.id}-${Date.now()}`,
      day: slot.day,
      dateStr: slot.dateStr,
      time: slot.time,
      title: `${tutor.subject} Tutoring`,
      type: 'tutoring',
      location: slot.room,
      tutorName: tutor.name,
      subject: tutor.subject,
      level: tutor.level,
      major: tutor.major,
      slotId: slot.id,
      price: 35,
      isPaid: false,
    };

    setSchedule((prev) => [...prev, newScheduleItem]);

    // 3. Open confirmation dialog
    setModalState({
      isOpen: true,
      tutor,
      slot,
    });
  };

  // Cancellation handler (allowed only if unpaid)
  const handleCancelSlot = (slotId: string) => {
    // Find item to check if paid
    const targetItem = schedule.find((it) => it.slotId === slotId);
    if (targetItem && targetItem.isPaid) {
      alert('This session has been paid for and cannot be cancelled or refunded.');
      return;
    }

    // Free the slot in the tutors list
    setTutors((prevTutors) =>
      prevTutors.map((t) => ({
        ...t,
        slots: t.slots.map((s) =>
          s.id === slotId
            ? {
                ...s,
                isBooked: false,
                studentName: undefined,
                bookedAt: undefined,
                isPaid: false,
              }
            : s
        ),
      }))
    );

    // Remove from the student's schedule
    setSchedule((prev) => prev.filter((item) => item.slotId !== slotId));
  };

  // Payment confirmation handler
  const handleConfirmPayment = (slotIds: string[], paymentMethod: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Mark as paid in schedule
    setSchedule((prev) =>
      prev.map((item) => {
        if (item.slotId && slotIds.includes(item.slotId)) {
          return {
            ...item,
            isPaid: true,
            paidAt: timestamp,
            paymentMethod,
          };
        }
        return item;
      })
    );

    // Mark as paid in tutors list
    setTutors((prevTutors) =>
      prevTutors.map((t) => ({
        ...t,
        slots: t.slots.map((s) => {
          if (slotIds.includes(s.id)) {
            return {
              ...s,
              isPaid: true,
            };
          }
          return s;
        }),
      }))
    );
  };

  // Single item payment trigger
  const handleOpenPayment = (item: WeeklyScheduleItem) => {
    setPaymentModalState({
      isOpen: true,
      item,
      itemsToPay: [item],
    });
  };

  // Batch payment trigger
  const handlePayAllBookings = (items: WeeklyScheduleItem[]) => {
    setPaymentModalState({
      isOpen: true,
      item: items[0] || null,
      itemsToPay: items,
    });
  };

  // Open chat request modal
  const handleOpenChat = (tutor: Tutor) => {
    setSelectedTutorForChat(tutor);
  };

  // Submit chat request handler
  const handleSubmitChatRequest = (data: {
    tutorId: string;
    tutorName: string;
    subject: string;
    studentName: string;
    studentEmail: string;
    queryType: 'booking' | 'subject' | 'general';
    message: string;
    preferredContact: 'email' | 'portal_chat';
  }) => {
    const newChat: ChatRequest = {
      id: `chat-${Date.now()}`,
      ...data,
      status: 'sent',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatRequests((prev) => [newChat, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased">
      {/* Top Navigation & App Header */}
      <Header
        activeScreen={activeScreen}
        onSelectScreen={setActiveScreen}
        bookedCount={bookedSessionsCount}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Real-time Weather in City widget */}
        <CityWeatherWidget />

        <ErrorBoundary onResetToHome={() => setActiveScreen('find')}>
          {/* Screen 1: Find a Tutor & Book Slots */}
          {activeScreen === 'find' && (
            <FindTutorScreen
              tutors={tutors}
              onBookSlot={handleBookSlot}
              onCancelSlot={handleCancelSlot}
              onGoToMyWeek={() => setActiveScreen('schedule')}
              onOpenChat={handleOpenChat}
              onViewProfessorProfile={(_tutor) => setActiveScreen('professors')}
            />
          )}

          {/* Screen 2: My Week (Schedule & Booked Sessions & Payment) */}
          {activeScreen === 'schedule' && (
            <MyWeekScreen
              schedule={schedule}
              onGoToFindTutor={() => setActiveScreen('find')}
              onCancelBooking={handleCancelSlot}
              onOpenPayment={handleOpenPayment}
              onPayAllBookings={handlePayAllBookings}
            />
          )}

          {/* Screen 3: Faculty Profiles & Background Information */}
          {activeScreen === 'professors' && (
            <ProfessorsScreen
              tutors={tutors}
              onOpenChat={handleOpenChat}
              onGoToBooking={(_tutor) => setActiveScreen('find')}
            />
          )}
        </ErrorBoundary>
      </main>

      {/* Booking Confirmation Dialog */}
      <BookingConfirmationModal
        isOpen={modalState.isOpen}
        slot={modalState.slot}
        tutor={modalState.tutor}
        onClose={() => setModalState({ isOpen: false, tutor: null, slot: null })}
        onGoToMyWeek={() => {
          setModalState({ isOpen: false, tutor: null, slot: null });
          setActiveScreen('schedule');
        }}
      />

      {/* How to Use / Step-by-Step Guide Modal */}
      <HowToUseModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        onGoToFindTutor={() => {
          setIsHelpOpen(false);
          setActiveScreen('find');
        }}
        onGoToProfessors={() => {
          setIsHelpOpen(false);
          setActiveScreen('professors');
        }}
      />

      {/* Chat / Query Request Modal */}
      <ChatRequestModal
        isOpen={!!selectedTutorForChat}
        tutor={selectedTutorForChat}
        onClose={() => setSelectedTutorForChat(null)}
        onSubmit={handleSubmitChatRequest}
      />

      {/* Payment Gateway Modal with Non-Cancellation Rules */}
      <PaymentModal
        isOpen={paymentModalState.isOpen}
        item={paymentModalState.item}
        itemsToPay={paymentModalState.itemsToPay}
        onClose={() => setPaymentModalState({ isOpen: false, item: null, itemsToPay: undefined })}
        onConfirmPayment={handleConfirmPayment}
      />

      {/* Simple Academic Footer with Reset Demo Data Control */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-slate-600">
            TutorSlot — Student Tutoring Appointment & Academic Schedule Planner
          </p>
          <p>
            Current Term: Academic Year 2026/2027 • Week 2 • Faculty Office Hours & Peer Tutoring Center
          </p>
          {chatRequests.length > 0 && (
            <p className="text-emerald-700 font-medium pt-0.5">
              ✓ {chatRequests.length} active consultation query sent to faculty.
            </p>
          )}

          {/* Minimal Reset Demo Data Control */}
          <div className="pt-2 flex items-center justify-center">
            <button
              type="button"
              id="reset-demo-data-btn"
              onClick={handleResetDemoData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-slate-500 hover:text-rose-700 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-lg transition-colors cursor-pointer"
              title="Clears all local bookings and restores the prototype to its default state"
            >
              <RotateCcw className="w-3 h-3 text-slate-400 group-hover:text-rose-500" />
              <span>Reset Demo Data</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
