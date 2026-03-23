import type {
  CreateProjectDTO,
  Project,
  UpdateProjectDTO,
} from '@/features/projects/types/project';
import { seedProjects } from '@/data/seeds';
import {
  readFromStorage,
  writeToStorage,
  resetStorageForKey,
} from '@/data/seedInitializer';

export const PROJECTS_STORAGE_KEY = 'family-ledger.projects';

const sortProjects = (projects: Project[]) => {
  return [...projects].sort((left, right) => {
    return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
  });
};

const readProjectsFromStorage = (): Project[] => {
  return readFromStorage(PROJECTS_STORAGE_KEY, seedProjects, sortProjects);
};

const writeProjectsToStorage = (projects: Project[]) => {
  return writeToStorage(PROJECTS_STORAGE_KEY, projects, sortProjects);
};

const buildProjectPayload = (data: CreateProjectDTO | UpdateProjectDTO) => {
  const name = data.name.trim();

  if (!name) {
    throw new Error('Project name is required.');
  }

  const description = data.description?.trim();

  return {
    name,
    description: description || undefined,
  };
};

const generateProjectId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `project-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
};

export const getProjects = async (): Promise<Project[]> => {
  return readProjectsFromStorage();
};

export const createProject = async (data: CreateProjectDTO): Promise<Project> => {
  const payload = buildProjectPayload(data);
  const now = new Date().toISOString();
  const newProject: Project = {
    id: generateProjectId(),
    userId: 'current-user',
    name: payload.name,
    description: payload.description,
    createdAt: now,
    updatedAt: now,
  };

  const currentProjects = readProjectsFromStorage();
  writeProjectsToStorage([newProject, ...currentProjects]);

  return newProject;
};

export const updateProject = async (
  projectId: string,
  data: UpdateProjectDTO,
): Promise<Project> => {
  const payload = buildProjectPayload(data);
  const currentProjects = readProjectsFromStorage();
  const existingProject = currentProjects.find((project) => project.id === projectId);

  if (!existingProject) {
    throw new Error('Project not found.');
  }

  const updatedProject: Project = {
    ...existingProject,
    name: payload.name,
    description: payload.description,
    updatedAt: new Date().toISOString(),
  };

  writeProjectsToStorage(
    currentProjects.map((project) => {
      return project.id === projectId ? updatedProject : project;
    }),
  );

  return updatedProject;
};

export const deleteProject = async (projectId: string): Promise<string> => {
  const currentProjects = readProjectsFromStorage();
  const filteredProjects = currentProjects.filter((project) => project.id !== projectId);

  if (filteredProjects.length === currentProjects.length) {
    throw new Error('Project not found.');
  }

  writeProjectsToStorage(filteredProjects);

  return projectId;
};

export const resetProjectsStorage = () => {
  resetStorageForKey(PROJECTS_STORAGE_KEY);
};