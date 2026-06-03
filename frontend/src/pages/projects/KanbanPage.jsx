import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient }
  from '@tanstack/react-query';
import { projectsApi } from '../../api/projects';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import {
  ArrowLeft, Plus, X, GripVertical,
  AlertCircle, Clock, ArrowUp, Zap
} from 'lucide-react';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.string().default('MEDIUM'),
});

const COLUMNS = [
  { id: 'TODO',        label: 'To Do',       color: 'bg-gray-100'   },
  { id: 'IN_PROGRESS', label: 'In Progress', color: 'bg-blue-100'   },
  { id: 'IN_REVIEW',   label: 'In Review',   color: 'bg-amber-100'  },
  { id: 'DONE',        label: 'Done',        color: 'bg-green-100'  },
];

const PRIORITY_CONFIG = {
  LOW:      { icon: Clock,        color: 'text-gray-400',  label: 'Low'      },
  MEDIUM:   { icon: ArrowUp,      color: 'text-blue-500',  label: 'Medium'   },
  HIGH:     { icon: AlertCircle,  color: 'text-amber-500', label: 'High'     },
  CRITICAL: { icon: Zap,          color: 'text-red-500',   label: 'Critical' },
};

const TaskCard = ({ task, onStatusChange, projectId }) => {
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.MEDIUM;
  const PriorityIcon = priority.icon;

  const statuses = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];
  const currentIndex = statuses.indexOf(task.status);

  return (
    <div className="bg-white rounded-xl border border-gray-200
                    p-4 shadow-sm hover:shadow-md
                    transition-all cursor-grab group">

      {/* Priority badge */}
      <div className="flex items-center justify-between mb-2">
        <span className={`flex items-center gap-1 text-xs
                         font-medium ${priority.color}`}>
          <PriorityIcon size={12} />
          {priority.label}
        </span>
      </div>

      {/* Title */}
      <p className="text-sm font-medium text-gray-900 mb-3
                    line-clamp-2">
        {task.title}
      </p>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-400 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Move buttons */}
      <div className="flex gap-1 mt-3 pt-3 border-t border-gray-100
                      opacity-0 group-hover:opacity-100 transition-opacity">
        {currentIndex > 0 && (
          <button
            onClick={() => onStatusChange(
              task.id, statuses[currentIndex - 1])}
            className="flex-1 text-xs py-1 px-2 rounded-lg
                       bg-gray-100 hover:bg-gray-200
                       text-gray-600 transition-colors"
          >
            ← Back
          </button>
        )}
        {currentIndex < statuses.length - 1 && (
          <button
            onClick={() => onStatusChange(
              task.id, statuses[currentIndex + 1])}
            className="flex-1 text-xs py-1 px-2 rounded-lg
                       bg-primary-50 hover:bg-primary-100
                       text-primary-700 font-medium transition-colors"
          >
            Move →
          </button>
        )}
      </div>
    </div>
  );
};

const KanbanPage = () => {
  const { projectId } = useParams();
  const navigate      = useNavigate();
  const queryClient   = useQueryClient();
  const [showModal, setShowModal]       = useState(false);
  const [addingToColumn, setAddingToColumn] = useState(null);

  const { data: project } = useQuery({
    queryKey: ['project', projectId],
    queryFn:  () => projectsApi.getById(projectId),
  });

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks', projectId],
    queryFn:  () => projectsApi.getTasks(projectId),
  });

  const { register, handleSubmit, reset,
          formState: { errors } } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: { priority: 'MEDIUM' },
  });

  const createMutation = useMutation({
    mutationFn: (data) => projectsApi.createTask(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks', projectId]);
      queryClient.invalidateQueries(['projects']);
      setShowModal(false);
      setAddingToColumn(null);
      reset();
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ taskId, status }) =>
      projectsApi.updateTaskStatus(projectId, taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks', projectId]);
    },
  });

  const onSubmit = (data) => {
    createMutation.mutate(data);
  };

  const handleStatusChange = (taskId, status) => {
    statusMutation.mutate({ taskId, status });
  };

  const getTasksByStatus = (status) =>
    tasks.filter(t => t.status === status);

  return (
    <div className="p-6 h-full">

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/projects')}
          className="p-2 hover:bg-gray-100 rounded-lg
                     transition-colors text-gray-500"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">
            {project?.name || 'Loading...'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {tasks.length} tasks total
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={16} className="mr-2" />
          Add Task
        </Button>
      </div>

      {/* Kanban columns */}
      {isLoading ? (
        <div className="flex gap-4">
          {COLUMNS.map(col => (
            <div key={col.id}
                 className="flex-1 bg-gray-100 rounded-xl
                            h-96 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map(column => {
            const columnTasks = getTasksByStatus(column.id);
            return (
              <div key={column.id}
                   className="flex-shrink-0 w-72">

                {/* Column header */}
                <div className={`
                  flex items-center justify-between
                  px-4 py-3 rounded-xl mb-3 ${column.color}
                `}>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700 text-sm">
                      {column.label}
                    </span>
                    <span className="bg-white text-gray-600
                                     text-xs font-medium px-2 py-0.5
                                     rounded-full">
                      {columnTasks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setAddingToColumn(column.id);
                      setShowModal(true);
                    }}
                    className="p-1 hover:bg-white hover:bg-opacity-60
                               rounded-lg transition-colors text-gray-500"
                  >
                    <Plus size={15} />
                  </button>
                </div>

                {/* Tasks */}
                <div className="flex flex-col gap-3 min-h-20">
                  {columnTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      projectId={projectId}
                      onStatusChange={handleStatusChange}
                    />
                  ))}

                  {columnTasks.length === 0 && (
                    <div className="border-2 border-dashed
                                    border-gray-200 rounded-xl
                                    p-6 text-center">
                      <p className="text-xs text-gray-400">
                        No tasks here
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50
                        flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Add Task
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setAddingToColumn(null);
                  reset();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-4">
              <Input
                label="Task title"
                placeholder="e.g. Set up authentication"
                register={register('title')}
                error={errors.title?.message}
              />

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Description (optional)
                </label>
                <textarea
                  {...register('description')}
                  placeholder="Describe the task..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border
                             border-gray-300 text-sm resize-none
                             focus:outline-none focus:ring-2
                             focus:ring-primary-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select
                  {...register('priority')}
                  className="w-full px-3 py-2 rounded-lg border
                             border-gray-300 text-sm bg-white
                             focus:outline-none focus:ring-2
                             focus:ring-primary-500"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>

              <div className="flex gap-3 mt-2">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    setShowModal(false);
                    setAddingToColumn(null);
                    reset();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  loading={createMutation.isPending}
                >
                  Add Task
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanPage;