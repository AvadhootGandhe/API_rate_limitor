import { Clock, User, Briefcase } from 'lucide-react';
import { LoadingSpinner } from '../LoadingSpinner';
import { ErrorMessage } from '../ErrorMessage';
import { useApi } from '../../hooks/useApi';
import { apiService } from '../../services/api';

interface Task {
  id: number;
  name: string;
  assignedTo: string;
  campaign: string;
  deadline: string;
}

function TaskCard({ task }: { task: Task }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
      <h4 className="font-medium text-gray-900 mb-3">{task.name}</h4>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User size={16} className="text-gray-400" />
          <span>{task.assignedTo}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Briefcase size={16} className="text-gray-400" />
          <span className="truncate">{task.campaign}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock size={16} className="text-gray-400" />
          <span>{formatDate(task.deadline)}</span>
        </div>
      </div>
    </div>
  );
}

function TaskColumn({
  title,
  tasks,
  color,
  count,
}: {
  title: string;
  tasks: Task[];
  color: string;
  count: number;
}) {
  return (
    <div className="flex-1 min-w-[300px]">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>{count}</span>
          </div>
        </div>

        <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
          {tasks.length > 0 ? (
            tasks.map((task) => <TaskCard key={task.id} task={task} />)
          ) : (
            <p className="text-center text-sm text-gray-500 py-8">No tasks</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function DashboardTasksSection() {
  const { data, loading, error } = useApi(apiService.getTasks);

  if (loading) {
    return (
      <section className="rounded-2xl border border-gray-200 bg-white/80 p-8">
        <LoadingSpinner />
      </section>
    );
  }
  if (error) return <ErrorMessage message={error} />;
  if (!data) return null;

  return (
    <section id="tasks" className="space-y-6 scroll-mt-24">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Team tasks</h2>
        <p className="text-sm text-gray-600 mt-1">Kanban-style columns: pending, in progress, completed.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending tasks</p>
              <p className="text-3xl font-semibold text-gray-900">{data.pending.length}</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <Clock size={24} className="text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">In progress</p>
              <p className="text-3xl font-semibold text-gray-900">{data.inProgress.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Briefcase size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-3xl font-semibold text-gray-900">{data.completed.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <User size={24} className="text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4">
        <TaskColumn
          title="Pending"
          tasks={data.pending}
          color="bg-orange-100 text-orange-700"
          count={data.pending.length}
        />
        <TaskColumn
          title="In progress"
          tasks={data.inProgress}
          color="bg-blue-100 text-blue-700"
          count={data.inProgress.length}
        />
        <TaskColumn
          title="Completed"
          tasks={data.completed}
          color="bg-green-100 text-green-700"
          count={data.completed.length}
        />
      </div>
    </section>
  );
}
