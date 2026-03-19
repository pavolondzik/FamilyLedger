import { useState } from 'react';
import type { CreateProjectDTO } from '@/features/projects/types/project';

interface ProjectFormProps {
  initialValues?: CreateProjectDTO;
  onSubmit: (data: CreateProjectDTO) => Promise<void> | void;
  isLoading?: boolean;
  title?: string;
  submitLabel?: string;
  onCancel?: () => void;
}

const emptyProjectForm: CreateProjectDTO = {
  name: '',
  description: '',
};

const ProjectForm = ({
  initialValues,
  onSubmit,
  isLoading = false,
  title = 'Create Project',
  submitLabel = 'Create Project',
  onCancel,
}: ProjectFormProps) => {
  const [formData, setFormData] = useState<CreateProjectDTO>(initialValues ?? emptyProjectForm);
  const [nameError, setNameError] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));

    if (name === 'name' && value.trim()) {
      setNameError('');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      setNameError('Project name is required.');
      return;
    }

    await onSubmit({
      name: formData.name.trim(),
      description: formData.description?.trim() || undefined,
    });

    setNameError('');

    if (!initialValues) {
      setFormData(emptyProjectForm);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-slate-950">{title}</h2>
        <p className="text-sm leading-6 text-slate-600">
          {initialValues
            ? 'Update an existing project while keeping the API contract unchanged.'
            : 'Create a project through the mocked API. React Query will refresh the server state for you.'}
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor="name">
          Project Name
        </label>
        <input
          aria-describedby={nameError ? 'project-name-error' : undefined}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
          disabled={isLoading}
          id="name"
          name="name"
          onChange={handleChange}
          placeholder="Quarterly budget planning"
          type="text"
          value={formData.name}
        />
        {nameError && (
          <p className="text-sm text-red-600" id="project-name-error" role="alert">
            {nameError}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor="description">
          Description
        </label>
        <textarea
          className="min-h-32 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
          disabled={isLoading}
          id="description"
          name="description"
          onChange={handleChange}
          placeholder="What will this project track?"
          rows={5}
          value={formData.description}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          className="inline-flex flex-1 items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? 'Saving...' : submitLabel}
        </button>
        {onCancel && (
          <button
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            disabled={isLoading}
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ProjectForm;