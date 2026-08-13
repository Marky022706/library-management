import type { Announcement } from '../types';

export const announcements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Library Closure on Ninoy Aquino Day',
    content:
      'The Balingasag Public Library will be closed on August 21, 2025 in observance of Ninoy Aquino Day. We will resume normal operations on August 22. We apologize for any inconvenience.',
    status: 'published',
    date: '2025-08-08',
  },
  {
    id: 'ann-2',
    title: 'New Books Available!',
    content:
      'We are pleased to announce the arrival of new books into our collection! Visit the library to check out the latest titles in Science, Technology, and Filipino Literature sections. These books are now available for borrowing.',
    status: 'published',
    date: '2025-08-05',
  },
  {
    id: 'ann-3',
    title: 'Library Card Renewal Reminder',
    content:
      'Members whose library cards expire this month are reminded to renew their cards at the circulation desk. Bring one valid ID and your current library card for renewal. Cards expire annually.',
    status: 'published',
    date: '2025-08-01',
  },
  {
    id: 'ann-4',
    title: 'Extended Hours During Exam Week',
    content:
      'To support students preparing for exams, the library will extend its operating hours until 8:00 PM from August 25 to August 29. Regular hours resume on September 1.',
    status: 'published',
    date: '2025-07-25',
  },
  {
    id: 'ann-5',
    title: 'Volunteer Readers Needed for Story Time',
    content:
      'We are looking for volunteers to read to children during our weekly Story Time sessions. If interested, please leave your contact details at the circulation desk.',
    status: 'draft',
    date: '2025-07-20',
  },
  {
    id: 'ann-6',
    title: 'Community Reading Program',
    content:
      'Join our upcoming reading and learning activities designed for students, families, and lifelong learners across Balingasag. Schedules are posted at the circulation desk and on our public updates feed.',
    status: 'published',
    date: '2025-07-22',
  },
];
