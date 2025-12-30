import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdAdd } from 'react-icons/md';
import { TaskCard, CompletedTaskCard } from '../components/features/TaskCard';
import { TaskStatusChart } from '../components/features/TaskStatusChart';
import { todoAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useAPI } from '../hooks/useAPI';

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { loading, execute } = useAPI();
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [statistics, setStatistics] = useState({
    completed_percentage: 0,
    in_progress_percentage: 0,
    not_started_percentage: 0,
  });

  // Format date as "20 June • Today"
  const formatDate = () => {
    const today = new Date();
    const day = today.getDate();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    const month = monthNames[today.getMonth()];
    return `${day} ${month} • Today`;
  };

  // Format date for display
  const formatTaskDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Fetch tasks and statistics
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch all tasks (excluding completed)
      const allTasksData = await execute(() => todoAPI.getAll());
      let allTasks = [];
      if (allTasksData?.results) {
        allTasks = allTasksData.results;
      } else if (Array.isArray(allTasksData)) {
        allTasks = allTasksData;
      }
      
      // Filter non-completed tasks
      setTasks(allTasks.filter(task => task.status !== 'Completed'));

      // Fetch completed tasks
      const completedData = await execute(() => todoAPI.getAll({ status: 'Completed' }));
      if (completedData?.results) {
        setCompletedTasks(completedData.results.slice(0, 2)); // Show only 2 completed tasks
      } else if (Array.isArray(completedData)) {
        setCompletedTasks(completedData.slice(0, 2));
      }

      // Fetch statistics
      const stats = await execute(() => todoAPI.getStatistics());
      if (stats) {
        setStatistics({
          completed_percentage: stats.completed_percentage || 0,
          in_progress_percentage: stats.in_progress_percentage || 0,
          not_started_percentage: stats.not_started_percentage || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const userName = user?.name || user?.username || 'User';

  return (
    <div className="w-full h-full flex flex-col min-h-0">
      {/* Welcome Section */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
        {/* Left Column - Welcome Message */}
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-medium text-[#000000] leading-[34px]">
            Welcome back, {userName.split(' ')[0]}
          </h1>
          <span className="text-2xl sm:text-3xl lg:text-[36px]">👋</span>
        </div>

        {/* Right Column - Add Task Button */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={() => navigate('/add-task')}
            className="px-4 py-2 border-2 border-[#FF6767] text-[#FF6767] bg-white rounded-lg font-medium flex items-center gap-1 text-sm hover:bg-[#FFF5F5] transition-colors"
          >
            <MdAdd size={16} className="text-[#FF6767]" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className='flex-1 min-h-0 flex flex-col'>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 flex-1 min-h-0">
          {/* Column 1 - To-Do Tasks */}
          <div className="flex flex-col min-h-0">
            <div className="bg-[#F5F8FF] rounded-[14px] p-4 lg:p-6 shadow-[0px_121px_34px_0px_rgba(0,0,0,0),0px_77px_31px_0px_rgba(0,0,0,0.01),0px_44px_26px_0px_rgba(0,0,0,0.02),0px_19px_19px_0px_rgba(0,0,0,0.03),0px_5px_11px_0px_rgba(0,0,0,0.04)] border border-[rgba(161,163,171,0.63)] flex flex-col flex-1 min-h-0">
              <div className="flex items-start justify-between mb-4 shrink-0">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 shrink-0 mt-0.5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#A1A3AB] w-full h-full">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-[#FF6767] text-[15px] font-medium">To-Do</h2>
                    <span className="text-[#A1A3AB] text-xs">{formatDate()}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/add-task')}
                  className="flex items-center gap-1 text-[#A1A3AB] hover:text-[#747474] transition-colors"
                >
                  <MdAdd size={16} className="text-[#FF4C23]" />
                  <span className="text-xs">Add task</span>
                </button>
              </div>

              <div className="space-y-4 overflow-y-auto flex-1 min-h-0">
                {loading ? (
                  <div className="text-center text-[#A1A3AB] py-8">Loading tasks...</div>
                ) : tasks.length === 0 ? (
                  <div className="text-center text-[#A1A3AB] py-8">No tasks yet. Add your first task!</div>
                ) : (
                  tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      id={task.id}
                      title={task.title}
                      description={task.description}
                      priority={task.priority}
                      status={task.status}
                      image={task.image_url}
                      createdAt={formatTaskDate(task.created_at)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Column 2 - Task Status and Completed Tasks */}
          <div className="flex flex-col gap-4 min-h-0">
            {/* Task Status Charts */}
            <div className="bg-[#F5F8FF] rounded-[14px] p-4 lg:p-6 shadow-[0px_83px_23px_0px_rgba(0,0,0,0),0px_53px_21px_0px_rgba(0,0,0,0.01),0px_30px_18px_0px_rgba(0,0,0,0.02),0px_13px_13px_0px_rgba(0,0,0,0.03),0px_3px_7px_0px_rgba(0,0,0,0.04)] border border-[#D3D3D3] shrink-0">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-5 shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#A1A3AB] w-full h-full">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h2 className="text-[#FF6767] text-[15px] font-medium">Task Status</h2>
              </div>

              <div className="flex flex-row justify-around gap-2 w-full overflow-x-auto pb-1">
                <TaskStatusChart 
                  percentage={Math.round(statistics.completed_percentage)} 
                  label="Completed" 
                  color="completed" 
                />
                <TaskStatusChart 
                  percentage={Math.round(statistics.in_progress_percentage)} 
                  label="In Progress" 
                  color="progress" 
                />
                <TaskStatusChart 
                  percentage={Math.round(statistics.not_started_percentage)} 
                  label="Not Started" 
                  color="not-started" 
                />
              </div>
            </div>

            {/* Completed Tasks */}
            <div className="bg-[#F5F8FF] rounded-[14px] p-4 lg:p-6 shadow-[0px_71px_20px_0px_rgba(0,0,0,0),0px_45px_18px_0px_rgba(0,0,0,0.01),0px_26px_15px_0px_rgba(0,0,0,0.02),0px_11px_11px_0px_rgba(0,0,0,0.03),0px_3px_6px_0px_rgba(0,0,0,0.04)] border border-[#D3D3D3] flex-1 flex flex-col min-h-0">
              <div className="flex items-center gap-2 mb-4 shrink-0">
                <div className="w-5 h-5 rounded-full bg-[#05A301] flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-[#F24E1E] text-[15px] font-medium">Completed Task</h2>
              </div>

              <div className="space-y-4 overflow-y-auto flex-1 min-h-0">
                {loading ? (
                  <div className="text-center text-[#A1A3AB] py-8">Loading...</div>
                ) : completedTasks.length === 0 ? (
                  <div className="text-center text-[#A1A3AB] py-8">No completed tasks yet.</div>
                ) : (
                  completedTasks.map((task) => (
                    <CompletedTaskCard
                      key={task.id}
                      title={task.title}
                      description={task.description}
                      image={task.image_url}
                      completedAt={`Completed ${formatTaskDate(task.updated_at)}`}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
