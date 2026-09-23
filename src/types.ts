export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export type StudyLevel = 'UG' | 'PG';

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
  isPaid?: boolean;
  price?: number;
}

export interface ProfessorProfile {
  title: string;
  department: string;
  education: string[];
  background: string;
  teachingExperience: string;
  publications: string[];
  officeLocation: string;
  email: string;
}

export interface Tutor {
  id: string;
  name: string;
  subject: string;
  level: StudyLevel;
  major: string;
  description: string;
  rating: number; // e.g. 4.9
  reviewCount: number;
  avatarInitials: string;
  avatarColor: string;
  slots: TutoringSlot[];
  profile: ProfessorProfile;
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
  level?: StudyLevel;
  major?: string;
  slotId?: string;
  price?: number;
  isPaid?: boolean;
  paidAt?: string;
  paymentMethod?: string;
}

export interface ChatRequest {
  id: string;
  tutorId: string;
  tutorName: string;
  subject: string;
  studentName: string;
  studentEmail: string;
  queryType: 'booking' | 'subject' | 'general';
  message: string;
  preferredContact: 'email' | 'portal_chat';
  status: 'sent' | 'responded';
  createdAt: string;
}

export type ActiveScreen = 'find' | 'schedule' | 'professors';

