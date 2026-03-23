import type { Project } from '@/features/projects/types/project';

export const seedProjects: Project[] = [
  {
    id: 'project-family-budget',
    userId: 'current-user',
    name: 'Family Budget',
    description: 'Plan personal finances, spending caps, and calculate Surplus, Shortfall or Balanced Budget.',
    createdAt: '2026-03-20T12:30:00.000Z',
    updatedAt: '2026-03-20T12:30:00.000Z',
  },
  {
    id: 'project-summer-trip',
    userId: 'current-user',
    name: 'Summer Trip',
    description: 'Plan bookings, spending caps, and packing checklist tasks.',
    createdAt: '2026-03-10T09:30:00.000Z',
    updatedAt: '2026-03-16T18:15:00.000Z',
  },
  {
    id: 'project-kitchen-remodel',
    userId: 'current-user',
    name: 'Kitchen Remodel',
    description: 'Track budget, contractor milestones, and appliance delivery dates.',
    createdAt: '2026-03-12T10:00:00.000Z',
    updatedAt: '2026-03-17T14:00:00.000Z',
  },
];
