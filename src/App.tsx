import React, { useEffect, useState } from 'react';
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

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('find');
  const [tutors, setTutors] = useState<Tutor[]>(INITIAL_TUTORS);
  const [schedule, setSchedule] = useState<WeeklyScheduleItem[]>(INITIAL_STUDENT_SCHEDULE);
  const [chatRequests, setChatRequests] = useState<ChatRequest[]>([]);


  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://tutorslot-mgmt6110.disqus.com/embed.js';
    script.setAttribute('data-timestamp', Date.now().toString());
    script.async = true;
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

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

  /**
   * Book a tutoring slot:
   * 1. Updates the tutor slot to isBooked: true
   * 2. Adds the new confirmed appointment with Level & Major and default rate of S$35 into My Week
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
                  price: 35,
                  isPaid: false,
                  bookedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                }
              : s
          ),
        };
      })
    );

    // 2. Add to weekly schedule immediately (with Level, Major, price: 35, isPaid: false)
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
      level: tutor.level,
      major: tutor.major,
      slotId: slot.id,
      price: 35,
      isPaid: false,
    };

    setSchedule((prevSchedule) => {
      const filtered = prevSchedule.filter((item) => item.slotId !== slot.id);
      return [...filtered, newScheduleItem];
    });

    // 3. Show confirmation feedback
    setModalState({
      isOpen: true,
      tutor,
      slot: { ...slot, isBooked: true, price: 35, isPaid: false },
    });
  };

  /**
   * Cancel a booked tutoring session:
   * 1. Restores the tutor slot to available
   * 2. Removes the appointment from My Week schedule
   * (Paid classes are blocked from cancellation)
   */
  const handleCancelSlot = (slotId: string) => {
    // Check if slot is already paid - safeguard against cancellation
    const targetScheduleItem = schedule.find((item) => item.slotId === slotId);
    if (targetScheduleItem?.isPaid) {
      alert('Paid tutoring sessions cannot be cancelled or refunded.');
      return;
    }

    setTutors((prevTutors) =>
      prevTutors.map((t) => ({
        ...t,
        slots: t.slots.map((s) =>
          s.id === slotId ? { ...s, isBooked: false, bookedAt: undefined, isPaid: false } : s
        ),
      }))
    );

    setSchedule((prevSchedule) => prevSchedule.filter((item) => item.slotId !== slotId));

    if (modalState.slot?.id === slotId) {
      setModalState({ isOpen: false, tutor: null, slot: null });
    }
  };

  /**
   * Process payment confirmation for one or multiple classes:
   * 1. Marks the schedule items as isPaid: true
   * 2. Locks the tutor slots so they cannot be cancelled
   */
  const handleConfirmPayment = (slotIds: string[], paymentMethod: string) => {
    const paidAtTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Update schedule items
    setSchedule((prev) =>
      prev.map((item) => {
        if (item.slotId && slotIds.includes(item.slotId)) {
          return {
            ...item,
            isPaid: true,
            paidAt: paidAtTimestamp,
            paymentMethod,
          };
        }
        return item;
      })
    );

    // Update tutor slots state
    setTutors((prev) =>
      prev.map((tutor) => ({
        ...tutor,
        slots: tutor.slots.map((slot) => {
          if (slotIds.includes(slot.id)) {
            return {
              ...slot,
              isPaid: true,
            };
          }
          return slot;
        }),
      }))
    );
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

  const handleGoToProfessors = () => {
    setActiveScreen('professors');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Chat request dispatch
  const handleSendChatRequest = (data: {
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
      tutorId: data.tutorId,
      tutorName: data.tutorName,
      subject: data.subject,
      studentName: data.studentName,
      studentEmail: data.studentEmail,
      queryType: data.queryType,
      message: data.message,
      preferredContact: data.preferredContact,
      status: 'sent',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatRequests((prev) => [newChat, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white pb-12">
      {/* App Header with navigation switch & Help Icon */}
      <Header
        activeScreen={activeScreen}
        onSelectScreen={setActiveScreen}
        bookedCount={bookedSessionsCount}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 space-y-6">
        {/* Live Weather for SMU In-Person Sessions */}
        <CityWeatherWidget />

        {/* Dynamic Screen View */}
        {activeScreen === 'find' && (
          <FindTutorScreen
            tutors={tutors}
            onBookSlot={handleBookSlot}
            onCancelSlot={handleCancelSlot}
            onGoToMyWeek={handleGoToMyWeek}
            onOpenChat={(tutor) => setSelectedTutorForChat(tutor)}
            onViewProfessorProfile={(_tutor) => {
              setActiveScreen('professors');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeScreen === 'professors' && (
          <ProfessorsScreen
            tutors={tutors}
            onOpenChat={(tutor) => setSelectedTutorForChat(tutor)}
            onGoToBooking={(_tutor) => {
              setActiveScreen('find');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeScreen === 'schedule' && (
          <MyWeekScreen
            schedule={schedule}
            onGoToFindTutor={handleGoToFindTutor}
            onCancelBooking={handleCancelSlot}
            onOpenPayment={(item) =>
              setPaymentModalState({ isOpen: true, item, itemsToPay: [item] })
            }
            onPayAllBookings={(unpaidItems) =>
              setPaymentModalState({
                isOpen: true,
                item: unpaidItems[0] || null,
                itemsToPay: unpaidItems,
              })
            }
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

      {/* How To Use Help / Info Dialog */}
      <HowToUseModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        onGoToFindTutor={() => {
          setActiveScreen('find');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onGoToProfessors={() => {
          setActiveScreen('professors');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Chat Request Dialog */}
      <ChatRequestModal
        isOpen={!!selectedTutorForChat}
        tutor={selectedTutorForChat}
        onClose={() => setSelectedTutorForChat(null)}
        onSubmit={handleSendChatRequest}
      />

      {/* Class Payment Modal */}
      <PaymentModal
        isOpen={paymentModalState.isOpen}
        item={paymentModalState.item}
        itemsToPay={paymentModalState.itemsToPay}
        onClose={() => setPaymentModalState({ isOpen: false, item: null })}
        onConfirmPayment={handleConfirmPayment}
      />


      {/* Disqus Comments & Feedback */}
      <section className="max-w-4xl w-full mx-auto px-4 mt-8">
        <h2 className="text-xl font-semibold mb-4">Comments & Feedback</h2>
        <div id="disqus_thread"></div>
      </section>

      {/* Global Application Footer with Open Data Licence Attribution */}
      <footer className="max-w-4xl w-full mx-auto px-4 mt-8 pt-4 border-t border-slate-200/60 text-center text-xs text-slate-500 leading-relaxed">
        <p>
          Contains information from the National Environment Agency, Singapore, which is made available under the terms of the Singapore Open Data Licence version 1.0.
        </p>
      </footer>
    </div>
  );
}
