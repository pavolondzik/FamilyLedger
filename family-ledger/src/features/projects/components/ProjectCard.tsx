import type { Project } from '@/features/projects/types/project';

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (id: string) => void;
}

const ProjectCard = ({ project, onEdit, onDelete }: ProjectCardProps) => {
  return (
    <article className="rounded-[1.5rem] border border-orange-100 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-600">
            Project
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">{project.name}</h3>
        </div>
        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
          {new Date(project.updatedAt).toLocaleDateString()}
        </span>
      </div>
      {project.description && (
        <p className="mt-3 text-sm leading-6 text-slate-600">{project.description}</p>
      )}
      <div className="mt-4 text-xs text-slate-500">
        Created {new Date(project.createdAt).toLocaleDateString()}
      </div>
      <div className="mt-5 flex gap-3">
        {onEdit && (
          <button
            onClick={() => onEdit(project)}
            aria-label={`Edit ${project.name}`}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(project.id)}
            aria-label={`Delete ${project.name}`}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500"
          >
            Delete
          </button>
        )}
      </div>
    </article>
  );
};

export default ProjectCard;
