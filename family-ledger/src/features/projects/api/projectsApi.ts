import type {
  CreateProjectDTO,
  Project,
  UpdateProjectDTO,
} from '@/features/projects/types/project';

export const PROJECTS_STORAGE_KEY = 'family-ledger.projects';

const memoryStorage = new Map<string, string>();

const seedProjects: Project[] = [
  {
    id: 'project-kitchen-remodel',
    userId: 'current-user',
    name: 'Kitchen Remodel',
    description: 'Track budget, contractor milestones, and appliance delivery dates.',
    createdAt: '2026-03-12T10:00:00.000Z',
    updatedAt: '2026-03-17T14:00:00.000Z',
  },
  {
    id: 'project-summer-trip',
    userId: 'current-user',
    name: 'Summer Trip',
    description: 'Plan bookings, spending caps, and packing checklist tasks.',
    createdAt: '2026-03-10T09:30:00.000Z',
    updatedAt: '2026-03-16T18:15:00.000Z',
  },
];

const cloneProjects = (projects: Project[]) => {
  return projects.map((project) => ({ ...project }));
};

const isStorageAvailable = () => {
  return (
    typeof window !== 'undefined' &&
    typeof window.localStorage !== 'undefined' &&
    typeof window.localStorage.getItem === 'function' &&
    typeof window.localStorage.setItem === 'function' &&
    typeof window.localStorage.removeItem === 'function'
  );
};

const getStorage = () => {
  if (isStorageAvailable()) {
    return window.localStorage;
  }

  return {
    getItem: (key: string) => {
      return memoryStorage.get(key) ?? null;
    },
    setItem: (key: string, value: string) => {
      memoryStorage.set(key, value);
    },
    removeItem: (key: string) => {
      memoryStorage.delete(key);
    },
  };
};

const sortProjects = (projects: Project[]) => {
  return [...projects].sort((left, right) => {
    return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
  });
};

const readProjectsFromStorage = (): Project[] => {
  const storage = getStorage();
  const storedProjects = storage.getItem(PROJECTS_STORAGE_KEY);

  if (!storedProjects) {
    const seededProjects = sortProjects(seedProjects);
    storage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(seededProjects));
    return cloneProjects(seededProjects);
  }

  const parsedProjects = JSON.parse(storedProjects) as Project[];
  return sortProjects(parsedProjects);
};

const writeProjectsToStorage = (projects: Project[]) => {
  const storage = getStorage();
  const nextProjects = sortProjects(projects);
  storage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(nextProjects));
  return nextProjects;
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
  memoryStorage.delete(PROJECTS_STORAGE_KEY);

  if (isStorageAvailable()) {
    window.localStorage.removeItem(PROJECTS_STORAGE_KEY);
  }
};