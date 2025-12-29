import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdEdit, MdDelete, MdAdd } from 'react-icons/md';

export function TaskCategories() {
  const navigate = useNavigate();

  const [taskStatuses] = useState([
    { id: 1, name: 'Completed' },
    { id: 2, name: 'In Progress' },
    { id: 3, name: 'Not Started' },
  ]);

  const [taskPriorities] = useState([
    { id: 1, name: 'Extreme' },
    { id: 2, name: 'Moderate' },
    { id: 3, name: 'Low' },
  ]);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Main Container */}
      <div className="bg-white rounded-xl lg:rounded-2xl border border-[#D3D3D3] p-4 sm:p-6 lg:p-8 flex-1 flex flex-col min-h-0">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-4 sm:mb-6 shrink-0">
          <h1 className="text-xl sm:text-2xl lg:text-[28px] font-bold text-[#000000] border-b-[3px] border-[#FF6767] pb-1">
            Task Categories
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="text-[#000000] hover:text-[#747474] transition-colors text-sm font-medium underline"
          >
            Go Back
          </button>
        </div>

        {/* Add Category Button */}
        <button className="px-5 sm:px-6 py-2.5 bg-[#FF6767] hover:bg-[#F24E1E] text-white rounded-lg text-sm font-medium transition-colors mb-6 sm:mb-8 self-start shrink-0">
          Add Category
        </button>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto min-h-0 space-y-6 sm:space-y-8">
          {/* Task Status Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-bold text-[#000000] border-b-[3px] border-[#FF6767] pb-1">
                Task Status
              </h2>
              <button className="flex items-center gap-1 text-sm text-[#FF6767] hover:text-[#F24E1E] transition-colors font-medium">
                <MdAdd size={18} className="text-[#FF6767]" />
                <span>Add Task Status</span>
              </button>
            </div>

            {/* Status Table */}
            <div className="border border-[#D3D3D3] rounded-xl overflow-hidden overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b border-[#D3D3D3]">
                    <th className="px-4 sm:px-6 py-4 text-center text-sm font-semibold text-[#000000] w-16 sm:w-20">SN</th>
                    <th className="px-4 sm:px-6 py-4 text-center text-sm font-semibold text-[#000000]">Task Status</th>
                    <th className="px-4 sm:px-6 py-4 text-center text-sm font-semibold text-[#000000] w-52 sm:w-64">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {taskStatuses.map((status, index) => (
                    <tr key={status.id} className="border-b border-[#D3D3D3] last:border-b-0">
                      <td className="px-4 sm:px-6 py-4 text-center text-sm text-[#000000]">{index + 1}</td>
                      <td className="px-4 sm:px-6 py-4 text-center text-sm text-[#000000]">{status.name}</td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center justify-center gap-3 sm:gap-4">
                          <button className="px-4 sm:px-5 py-2 bg-[#FF6767] hover:bg-[#F24E1E] text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 min-w-[80px] justify-center">
                            <MdEdit size={16} />
                            <span>Edit</span>
                          </button>
                          <button className="px-4 sm:px-5 py-2 bg-[#FF6767] hover:bg-[#F24E1E] text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 min-w-[80px] justify-center">
                            <MdDelete size={16} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Task Priority Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-bold text-[#000000] border-b-[3px] border-[#FF6767] pb-1">
                Task Priority
              </h2>
              <button className="flex items-center gap-1 text-sm text-[#FF6767] hover:text-[#F24E1E] transition-colors font-medium">
                <MdAdd size={18} className="text-[#FF6767]" />
                <span>Add New Priority</span>
              </button>
            </div>

            {/* Priority Table */}
            <div className="border border-[#D3D3D3] rounded-xl overflow-hidden overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b border-[#D3D3D3]">
                    <th className="px-4 sm:px-6 py-4 text-center text-sm font-semibold text-[#000000] w-16 sm:w-20">SN</th>
                    <th className="px-4 sm:px-6 py-4 text-center text-sm font-semibold text-[#000000]">Task Priority</th>
                    <th className="px-4 sm:px-6 py-4 text-center text-sm font-semibold text-[#000000] w-52 sm:w-64">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {taskPriorities.map((priority, index) => (
                    <tr key={priority.id} className="border-b border-[#D3D3D3] last:border-b-0">
                      <td className="px-4 sm:px-6 py-4 text-center text-sm text-[#000000]">{index + 1}</td>
                      <td className="px-4 sm:px-6 py-4 text-center text-sm text-[#000000]">{priority.name}</td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center justify-center gap-3 sm:gap-4">
                          <button className="px-4 sm:px-5 py-2 bg-[#FF6767] hover:bg-[#F24E1E] text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 min-w-[80px] justify-center">
                            <MdEdit size={16} />
                            <span>Edit</span>
                          </button>
                          <button className="px-4 sm:px-5 py-2 bg-[#FF6767] hover:bg-[#F24E1E] text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 min-w-[80px] justify-center">
                            <MdDelete size={16} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
