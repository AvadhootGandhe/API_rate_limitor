import { Clock, User, Briefcase } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { useApi } from '../hooks/useApi';
import { apiService } from '../services/api';

interface Task {
  id: number;
  name: string;
  assignedTo: string;
  campaign: string;
  deadline: string;
}

interface TaskCardProps {
  task: Task;
}

function TaskCard({ task }: TaskCardProps) {
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

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  color: string;
  count: number;
}

function TaskColumn({ title, tasks, color, count }: TaskColumnProps) {
  return (
    <div className="flex-1 min-w-[300px]">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className={`px-4 py-3 border-b border-gray-200`}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
              {count}
            </span>
          </div>
        </div>
        
        <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
          {tasks.length > 0 ? (
            tasks.map(task => <TaskCard key={task.id} task={task} />)
          ) : (
            <p className="text-center text-sm text-gray-500 py-8">No tasks</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function Tasks() {
  const { data, loading, error } = useApi(apiService.getTasks);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Employee Tasks</h1>
        <p className="text-sm text-gray-600 mt-1">Manage and track team tasks across all campaigns.</p>
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Tasks</p>
              <p className="text-3xl font-semibold text-gray-900">{data.pending.length}</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <Clock size={24} className="text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">In Progress</p>
              <p className="text-3xl font-semibold text-gray-900">{data.inProgress.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Briefcase size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
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

      {/* Task Board */}
      <div className="flex gap-6 overflow-x-auto pb-4">
        <TaskColumn
          title="Pending"
          tasks={data.pending}
          color="bg-orange-100 text-orange-700"
          count={data.pending.length}
        />
        <TaskColumn
          title="In Progress"
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
    </div>
  );
}
