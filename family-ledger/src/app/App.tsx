import { useDispatch, useSelector } from 'react-redux'

import {
  ProjectForm,
  ProjectList,
  useProjects,
  selectProject,
  clearSelection,
  type CreateProjectDTO,
} from '@/features/projects'
import type { RootState } from '@/lib/store'

const App = () => {
  const dispatch = useDispatch()
  const selectedProject = useSelector((state: RootState) => state.projectsUi.selectedProject)
  const {
    projects,
    isLoading,
    errorMessage,
    addProject,
    updateProject,
    deleteProject,
    isCreating,
    isUpdating,
    isDeleting,
  } = useProjects()

  const projectCount = projects.length
  const newestProject = projects[0]
  const isSubmitting = isCreating || isUpdating
  const isEditing = selectedProject !== null

  const handleCreateProject = async (projectData: CreateProjectDTO) => {
    await addProject(projectData)
  }

  const handleUpdateProject = async (projectData: CreateProjectDTO) => {
    if (!selectedProject) {
      return
    }

    await updateProject({
      projectId: selectedProject.id,
      data: projectData,
    })
    dispatch(clearSelection())
  }

  const handleDeleteProject = async (projectId: string) => {
    await deleteProject(projectId)

    if (selectedProject?.id === projectId) {
      dispatch(clearSelection())
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff7ed,_#ffedd5_35%,_#fed7aa_65%,_#fdba74)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/70 p-8 shadow-[0_30px_90px_rgba(120,53,15,0.18)] backdrop-blur">
          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-end">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-700">
                Family Ledger
              </p>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Projects are your server state. React Query keeps them synced while local UI state stays simple.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-700 sm:text-lg">
                For now, the Projects feature reads and writes through a mocked API backed by localStorage.
                When your .NET backend is ready, this API layer is the only place you need to swap.
              </p>
            </div>

            <div className="grid gap-4 rounded-[1.5rem] bg-slate-950 p-6 text-white shadow-xl sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-orange-300">Projects</p>
                <p className="mt-3 text-4xl font-semibold">{projectCount}</p>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-orange-300">Latest Update</p>
                <p className="mt-3 text-lg font-medium">
                  {newestProject ? newestProject.name : 'Seed data loading'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {errorMessage && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <section className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <div className="rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_70px_rgba(120,53,15,0.12)] backdrop-blur">
            <ProjectForm
              key={selectedProject?.id ?? 'create-project'}
              initialValues={selectedProject ? {
                name: selectedProject.name,
                description: selectedProject.description ?? '',
              } : undefined}
              isLoading={isSubmitting}
              onCancel={isEditing ? () => dispatch(clearSelection()) : undefined}
              onSubmit={isEditing ? handleUpdateProject : handleCreateProject}
              submitLabel={isEditing ? 'Save Changes' : 'Create Project'}
              title={isEditing ? 'Edit Project' : 'Create Project'}
            />
          </div>

          <div className="rounded-[1.75rem] border border-white/70 bg-white/75 p-6 shadow-[0_20px_70px_rgba(120,53,15,0.12)] backdrop-blur">
            <div className="mb-6 flex flex-col gap-2 border-b border-orange-100 pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-950">Projects Workspace</h2>
                <p className="text-sm text-slate-600">
                  useState handles edit mode here. React Query owns the API data lifecycle.
                </p>
              </div>
              {isDeleting && (
                <p className="text-sm font-medium text-orange-700">Deleting project...</p>
              )}
            </div>

            {isLoading ? (
              <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50 px-5 py-8 text-center text-slate-600">
                Loading projects from the mocked API...
              </div>
            ) : (
              <ProjectList
                onDelete={handleDeleteProject}
                onEdit={(project) => dispatch(selectProject(project))}
                projects={projects}
              />
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
