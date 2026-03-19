import {
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';

import {
	createProject,
	deleteProject,
	getProjects,
	updateProject,
} from '@/features/projects/api/projectsApi';
import type {
	CreateProjectDTO,
	Project,
	UpdateProjectDTO,
} from '@/features/projects/types/project';

interface UpdateProjectInput {
	projectId: string;
	data: UpdateProjectDTO;
}

const projectsQueryKey = ['projects'];

export const useProjects = () => {
	const queryClient = useQueryClient();

	const projectsQuery = useQuery({
		queryKey: projectsQueryKey,
		queryFn: getProjects,
	});

	const createProjectMutation = useMutation({
		mutationFn: (projectData: CreateProjectDTO) => createProject(projectData),
		onSuccess: (newProject) => {
			queryClient.setQueryData<Project[]>(projectsQueryKey, (currentProjects = []) => {
				return [newProject, ...currentProjects];
			});
		},
	});

	const updateProjectMutation = useMutation({
		mutationFn: ({ projectId, data }: UpdateProjectInput) => updateProject(projectId, data),
		onSuccess: (updatedProject) => {
			queryClient.setQueryData<Project[]>(projectsQueryKey, (currentProjects = []) => {
				return currentProjects.map((project) => {
					return project.id === updatedProject.id ? updatedProject : project;
				});
			});
		},
	});

	const deleteProjectMutation = useMutation({
		mutationFn: (projectId: string) => deleteProject(projectId),
		onSuccess: (deletedProjectId) => {
			queryClient.setQueryData<Project[]>(projectsQueryKey, (currentProjects = []) => {
				return currentProjects.filter((project) => project.id !== deletedProjectId);
			});
		},
	});

	const error =
		projectsQuery.error ||
		createProjectMutation.error ||
		updateProjectMutation.error ||
		deleteProjectMutation.error;

	return {
		projects: projectsQuery.data ?? [],
		isLoading: projectsQuery.isLoading,
		errorMessage: error instanceof Error ? error.message : null,
		addProject: createProjectMutation.mutateAsync,
		updateProject: updateProjectMutation.mutateAsync,
		deleteProject: deleteProjectMutation.mutateAsync,
		isCreating: createProjectMutation.isPending,
		isUpdating: updateProjectMutation.isPending,
		isDeleting: deleteProjectMutation.isPending,
	};
};
