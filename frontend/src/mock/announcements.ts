import type { Announcement } from '@/types';
import { daysAgo } from '@/utils/date';

export const mockAnnouncements: Announcement[] = [
  {
    id: 'ann1',
    title: 'Extended Weekend Hours Starting September',
    content: 'Balingasag Public Library will now be open on Saturdays from 8:00 AM to 4:00 PM starting September to accommodate more students and researchers.',
    status: 'published',
    authorId: 'u1',
    createdAt: daysAgo(10),
    publishedAt: daysAgo(9),
  },
  {
    id: 'ann2',
    title: 'New Filipiniana Collection Now Available',
    content: 'We have added over 30 new titles to our Filipiniana and local history section, including works on the history of Balingasag and Misamis Oriental.',
    status: 'published',
    authorId: 'u2',
    createdAt: daysAgo(20),
    publishedAt: daysAgo(19),
  },
  {
    id: 'ann3',
    title: 'Library Card Renewal Reminder',
    content: 'Members whose library cards were issued before 2024 are reminded to renew their registration at the front desk to continue borrowing privileges.',
    status: 'published',
    authorId: 'u2',
    createdAt: daysAgo(35),
    publishedAt: daysAgo(34),
  },
  {
    id: 'ann4',
    title: 'Summer Reading Program 2026',
    content: 'Join our Summer Reading Program for children ages 6–12. Registration opens next week at the Children\'s Section.',
    status: 'draft',
    authorId: 'u2',
    createdAt: daysAgo(1),
  },
  {
    id: 'ann5',
    title: 'System Maintenance Notice (Resolved)',
    content: 'The library catalog system underwent scheduled maintenance. All services have since been restored.',
    status: 'archived',
    authorId: 'u1',
    createdAt: daysAgo(60),
    publishedAt: daysAgo(59),
  },
];
