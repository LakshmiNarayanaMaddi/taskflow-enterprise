import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { projectsApi } from '../../api/projects';
import { FolderKanban, CheckSquare, Clock, Plus } from 'lucide-react';
import Button from '../../components/common/Button';

const DashboardPage = () => {
  const { user }   = useSelector(state => state.auth);
  const navigate   = useNavigate();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn:  projectsApi.getAll,
  });

  const totalTasks = projects.reduce(
    (sum, p) => sum + (p.taskCount || 0), 0);

  const stats = [
    {
      label: 'Total Projects',
      value: projects.length,
      icon:  FolderKanban,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Total Tasks',
      value: totalTasks,
      icon:  CheckSquare,
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'Active Now',
      value: projects.filter(p => p.status === 'ACTIVE').length,
      icon:  Clock,
      color: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <div className="p-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Good morning 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back, {user?.email}
          </p>
        </div>
        <Button onClick={() => navigate('/projects/new')}>
          <Plus size={16} className="mr-2" />
          New Project
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label}
               className="bg-white rounded-xl border border-gray-200
                          p-6 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center
                            justify-center ${color}`}>
              <Icon size={22} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {value}
              </p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Projects */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center
                        justify-between">
          <h2 className="font-semibold text-gray-900">
            Recent Projects
          </h2>
          <Button variant="secondary"
                  onClick={() => navigate('/projects')}>
            View all
          </Button>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-400">
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="p-8 text-center">
            <FolderKanban size={40}
                          className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">No projects yet</p>
            <Button onClick={() => navigate('/projects/new')}>
              Create your first project
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {projects.slice(0, 5).map(project => (
              <div
                key={project.id}
                onClick={() => navigate(`/projects/${project.id}`)}
                className="p-4 hover:bg-gray-50 cursor-pointer
                           flex items-center justify-between
                           transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary-100 rounded-lg
                                  flex items-center justify-center">
                    <FolderKanban size={16}
                                  className="text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {project.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {project.taskCount} tasks ·{' '}
                      {project.memberCount} members
                    </p>
                  </div>
                </div>
                <span className={`
                  text-xs font-medium px-2.5 py-1 rounded-full
                  ${project.status === 'ACTIVE'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'}
                `}>
                  {project.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;