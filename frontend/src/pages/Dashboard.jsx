import { useNavigate } from 'react-router-dom';
import { MdAdd, MdAccessTime, MdPeople } from 'react-icons/md';
import { TaskCard, CompletedTaskCard } from '../components/features/TaskCard';
import { TaskStatusChart } from '../components/features/TaskStatusChart';

export function Dashboard() {
  const navigate = useNavigate();

  // Format date as "20 June • Today"
  const formatDate = () => {
    const today = new Date();
    const day = today.getDate();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    const month = monthNames[today.getMonth()];
    return `${day} ${month} • Today`;
  };

  // Sample tasks data
  const tasks = [
    {
      title: "Attend Nischal's Birthday Party",
      description:
        "Buy gifts on the way and pick up cake from the bakery. (6 PM | Fresh Elements).....",
      priority: 'Moderate',
      status: 'Not Started',
      image: 'https://images.unsplash.com/photo-1464347744102-11db6282f854?w=200',
      createdAt: '20/06/2023',
    },
    {
      title: 'Landing Page Design for TravelDays',
      description:
        'Get the work done by EOD and discuss with client before leaving. (4 PM | Meeting Room)',
      priority: 'Moderate',
      status: 'In Progress',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=200',
      createdAt: '20/06/2023',
    },
    {
      title: 'Presentation on Final Product',
      description:
        'Make sure everything is functioning and all the necessities are properly met. Prepare the team and get the documents ready for...',
      priority: 'Moderate',
      status: 'In Progress',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=200',
      createdAt: '19/06/2023',
    },
  ];

  const completedTasks = [
    {
      title: 'Walk the dog',
      description: 'Take the dog to the park and bring treats as well.',
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200',
      completedAt: 'Completed 2 days ago.',
    },
    {
      title: 'Conduct meeting',
      description: 'Meet with the client and finalize requirements.',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=200',
      completedAt: 'Completed 2 days ago.',
    },
  ];

  return (
    <div className="w-full">
      {/* Welcome Section */}
      <div className="mb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        {/* Left Column - Welcome Message */}
        <div className="flex items-center gap-2">
          <h1 className="text-base sm:text-lg lg:text-xl font-bold text-neutral-text">
            Welcome back, Sundar
          </h1>
          <span className="text-base sm:text-lg lg:text-xl">👋</span>
        </div>

        {/* Right Column - Team Members and Invite Button */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex -space-x-1 sm:-space-x-2">
            {[
              {
                img: "https://images.unsplash.com/photo-1464347744102-11db6282f854?w=200",
                name: "Member 1",
              },
              {
                img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=200",
                name: "Member 2",
              },
              {
                img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=200",
                name: "Member 3",
              },
              {
                img: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200",
                name: "Member 4",
              },
              {
                img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=200",
                name: "Member 5",
              },
            ].map((member, idx) => (
              <div
                key={member.img}
                className="w-7 h-7 rounded-[8px] border-2 border-[#A1A3AB] overflow-hidden shadow-sm bg-gray-400 relative"
                style={{ zIndex: 10 - idx }}
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
                {idx === 4 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white text-xs font-semibold select-none pointer-events-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]">+4</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button className="px-2 sm:px-3 py-1 sm:py-1.5 border-2 border-[#FF6B6B] text-[#FF6B6B] bg-white rounded-lg font-medium transition-all duration-200 flex items-center gap-1 text-xs hover:bg-white hover:shadow-none shadow-none"
          >
            <MdPeople size={16} className="sm:w-4 sm:h-4 text-[#FF6B6B]" />
            <span className="">Invite</span>
          </button>

        </div>
      </div>

      {/* Main Content */}
      {/* <div className="bg-white rounded-lg p-2 sm:p-3 shadow" style={{ border: '1px solid #A1A3AB' }}> */}
      <div className=''>
        {/* Content Grid - 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Column 1 - To-Do Tasks */}
          <div>
            <div className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-2xl border border-[#A1A3AB]">
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className="flex items-start gap-1 sm:gap-2">
                  <MdAccessTime className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-text-muted shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <h2 className="text-status-not-started text-sm sm:text-base font-semibold mb-0.5">To-Do</h2>
                    <span className="text-neutral-text-muted text-[10px] sm:text-xs">{formatDate()}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/add-task')}
                  className="flex items-center gap-1 px-1 py-1 bg-transparent border-none shadow-none hover:bg-transparent transition-all duration-200"
                  style={{ color: '#A1A3AB', fontSize: '1rem', fontWeight: 400, lineHeight: 1, letterSpacing: 0 }}
                >
                  <MdAdd
                    size={18}
                    style={{ color: '#FF4C23', minWidth: '18px', minHeight: '18px' }}
                  />
                  <span
                    style={{
                      color: '#A1A3AB',
                      fontSize: '1rem',
                      fontWeight: 400,
                      letterSpacing: 0,
                      lineHeight: 1.1,
                    }}
                  >
                    Add Task
                  </span>
                </button>
                
              </div>

              <div className="space-y-2 px-6">
                {tasks.map((task, index) => (
                  <TaskCard key={index} {...task} />
                ))}
              </div>
            </div>
          </div>

          {/* Column 2 - Task Status and Completed Tasks */}
          <div className="flex flex-col gap-3">
            {/* Row 1 - Task Status Charts (Horizontal) */}
            <div className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-soft border border-neutral-border/20">
              <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                <div className="w-4 h-4 sm:w-5 sm:h-5 shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-text-muted w-full h-full">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h2 className="text-status-not-started text-sm sm:text-base font-semibold">Task Status</h2>
              </div>

              <div className="flex flex-row justify-around gap-0.5 xs:gap-1 sm:gap-1.5 lg:gap-2 w-full overflow-x-auto pb-1">
                <TaskStatusChart percentage={84} label="Completed" color="completed" />
                <TaskStatusChart percentage={46} label="In Progress" color="progress" />
                <TaskStatusChart percentage={13} label="Not Started" color="not-started" />
              </div>
            </div>

            {/* Row 2 - Completed Tasks (Latest 2) */}
            <div className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-soft border border-neutral-border/20">
              <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-status-completed flex items-center justify-center shrink-0">
                  <svg className="w-2 h-2 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-status-not-started text-sm sm:text-base font-semibold">Completed Task</h2>
              </div>

              <div className="space-y-2">
                {completedTasks.slice(0, 2).map((task, index) => (
                  <CompletedTaskCard key={index} {...task} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
