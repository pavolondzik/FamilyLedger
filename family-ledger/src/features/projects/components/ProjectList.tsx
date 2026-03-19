import ProjectCard from '@/features/projects/components/ProjectCard';
import type { Project } from '@/features/projects/types/project';

interface ProjectListProps {
  projects: Project[];
  onEdit?: (project: Project) => void;
  onDelete?: (id: string) => void;
}

const ProjectList = ({ projects, onEdit, onDelete }: ProjectListProps) => {
  if (projects.length === 0) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-orange-200 bg-orange-50 px-6 py-10 text-center text-slate-600">
        No projects yet. Create one to start tracking work for a user.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ProjectList;