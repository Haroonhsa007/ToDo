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
    <div className="w-full h-full flex flex-col min-h-0">
      {/* Welcome Section */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
        {/* Left Column - Welcome Message */}
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-medium text-[#000000] leading-[34px]">
            Welcome back, Sundar
          </h1>
          <span className="text-2xl sm:text-3xl lg:text-[36px]">👋</span>
        </div>

        {/* Right Column - Team Members and Invite Button */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex -space-x-2">
            {[
              { img: "https://images.unsplash.com/photo-1464347744102-11db6282f854?w=200", name: "Member 1" },
              { img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=200", name: "Member 2" },
              { img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=200", name: "Member 3" },
              { img: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200", name: "Member 4" },
              { img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=200", name: "Member 5" },
            ].map((member, idx) => (
              <div
                key={member.img}
                className="w-[36.276px] h-[36.276px] rounded-lg overflow-hidden shadow-sm bg-[#D9D9D9] relative border border-[#A1A3AB]"
                style={{ zIndex: 10 - idx }}
              >
                <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                {idx === 4 && (
                  <div className="absolute inset-0 bg-black/52 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">+4</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button className="px-4 py-2 border-2 border-[#FF6767] text-[#FF6767] bg-white rounded-lg font-medium flex items-center gap-1 text-sm hover:bg-[#FFF5F5] transition-colors">
            <MdPeople size={16} className="text-[#FF6767]" />
            <span>Invite</span>
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
                {tasks.map((task, index) => (
                  <TaskCard key={index} {...task} />
                ))}
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
                <TaskStatusChart percentage={84} label="Completed" color="completed" />
                <TaskStatusChart percentage={46} label="In Progress" color="progress" />
                <TaskStatusChart percentage={13} label="Not Started" color="not-started" />
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
