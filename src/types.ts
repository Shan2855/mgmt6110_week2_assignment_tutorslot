export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export interface TutoringSlot {
  id: string;
  tutorId: string;
  day: DayOfWeek;
  dateStr: string; // e.g. "Mon, Sep 7"
  time: string; // e.g. "10:00 AM - 11:00 AM"
  room: string; // e.g. "Study Hall 2B" or "Learning Center Room 104"
  isBooked: boolean;
  studentName?: string;
  bookedAt?: string;
}

export interface Tutor {
  id: string;
  name: string;
  subject: string;
  description: string;
  rating: number; // e.g. 4.9
  reviewCount: number;
  avatarInitials: string;
  avatarColor: string;
  slots: TutoringSlot[];
}

export interface WeeklyScheduleItem {
  id: string;
  day: DayOfWeek;
  dateStr: string;
  time: string;
  title: string;
  type: 'tutoring';
  location: string;
  tutorName?: string;
  subject?: string;
  slotId?: string;
}

export type ActiveScreen = 'find' | 'schedule';
