import { beforeEach, describe, expect, it } from 'vitest';

import {
  createProject,
  deleteProject,
  getProjects,
  resetProjectsStorage,
  updateProject,
} from '@/features/projects/api/projectsApi';

describe('projectsApi', () => {
  beforeEach(() => {
    resetProjectsStorage();
  });

  it('seeds projects into localStorage when no backend data exists yet', async () => {
    const projects = await getProjects();

    expect(projects).toHaveLength(2);
    expect(projects[0]?.name).toBe('Kitchen Remodel');

    const persistedProjects = await getProjects();

    expect(persistedProjects).toEqual(projects);
  });

  it('persists create, update, and delete operations through the mocked API', async () => {
    const createdProject = await createProject({
      name: 'Garden Upgrade',
      description: 'Raised beds, irrigation, and lighting.',
    });

    expect(createdProject.name).toBe('Garden Upgrade');

    const updatedProject = await updateProject(createdProject.id, {
      name: 'Garden Upgrade Phase 1',
      description: 'Raised beds only.',
    });

    expect(updatedProject.name).toBe('Garden Upgrade Phase 1');

    await deleteProject(createdProject.id);

    const projects = await getProjects();

    expect(projects.find((project) => project.id === createdProject.id)).toBeUndefined();
    expect(projects).toHaveLength(2);
  });
});