import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { projectsApi } from '../../api/projects';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  FolderKanban, Plus, X, Trash2,
  ChevronRight, Users, CheckSquare
} from 'lucide-react';

const projectSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().optional(),
});

const ProjectsPage = () => {
  const navigate     = useNavigate();
  const queryClient  = useQueryClient();
  const [showModal, setShowModal] = useState(false);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn:  projectsApi.getAll,
  });

  const { register, handleSubmit,
          reset, formState: { errors } } = useForm({
    resolver: zodResolver(projectSchema),
  });

  const createMutation = useMutation({
    mutationFn: projectsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
      setShowModal(false);
      reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: projectsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
    },
  });

  const onSubmit = (data) => {
    createMutation.mutate(data);
  };

  return (
    <div className="p-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Projects
          </h1>
          <p className="text-gray-500 mt-1">
            {projects.length} projects total
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={16} className="mr-2" />
          New Project
        </Button>
      </div>

      {/* Projects grid */}
      {isLoading ? (
        <div className="grid grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i}
                 className="bg-white rounded-xl border border-gray-200
                            p-6 animate-pulse h-48" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20">
          <FolderKanban size={48}
                        className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No projects yet
          </h3>
          <p className="text-gray-500 mb-6">
            Create your first project to get started
          </p>
          <Button onClick={() => setShowModal(true)}>
            <Plus size={16} className="mr-2" />
            Create Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2
                        lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div
              key={project.id}
              className="bg-white rounded-xl border border-gray-200
                         p-6 hover:shadow-md transition-all
                         cursor-pointer group"
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              {/* Project header */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-xl
                                flex items-center justify-center">
                  <FolderKanban size={20}
                                className="text-primary-600" />
                </div>
                <div className="flex items-center gap-2 opacity-0
                                group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(
                        'Delete this project?')) {
                        deleteMutation.mutate(project.id);
                      }
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-500
                               hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                  <ChevronRight size={15}
                                className="text-gray-400" />
                </div>
              </div>

              {/* Project name */}
              <h3 className="font-semibold text-gray-900 mb-1">
                {project.name}
              </h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                {project.description || 'No description'}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-4 text-xs
                              text-gray-500 pt-4 border-t border-gray-100">
                <span className="flex items-center gap-1">
                  <CheckSquare size={13} />
                  {project.taskCount} tasks
                </span>
                <span className="flex items-center gap-1">
                  <Users size={13} />
                  {project.memberCount} members
                </span>
                <span className={`
                  ml-auto px-2 py-0.5 rounded-full text-xs font-medium
                  ${project.status === 'ACTIVE'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'}
                `}>
                  {project.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50
                        flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Create New Project
              </h2>
              <button
                onClick={() => { setShowModal(false); reset(); }}
                className="p-2 hover:bg-gray-100 rounded-lg
                           transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-4">
              <Input
                label="Project name"
                placeholder="e.g. TaskFlow Frontend"
                register={register('name')}
                error={errors.name?.message}
              />
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Description (optional)
                </label>
                <textarea
                  {...register('description')}
                  placeholder="What is this project about?"
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border
                             border-gray-300 text-sm resize-none
                             focus:outline-none focus:ring-2
                             focus:ring-primary-500"
                />
              </div>

              <div className="flex gap-3 mt-2">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => { setShowModal(false); reset(); }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  loading={createMutation.isPending}
                >
                  Create Project
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;