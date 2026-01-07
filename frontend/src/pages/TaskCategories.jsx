import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdEdit, MdDelete, MdAdd } from 'react-icons/md';
import { categoryAPI } from '../services/api';
import { useAPI } from '../hooks/useAPI';

export function TaskCategories() {
  const navigate = useNavigate();
  const { loading, execute } = useAPI();
  const [categories, setCategories] = useState([]);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const data = await execute(() => categoryAPI.getAll());
    // Handle both array response and object with results
    if (Array.isArray(data)) {
      setCategories(data);
    } else if (data?.results && Array.isArray(data.results)) {
      setCategories(data.results);
    } else {
      setCategories([]);
    }
  };

  // Handle delete category
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    await execute(() => categoryAPI.delete(id), 'Category deleted successfully!');
    fetchCategories(); // Refresh list
  };

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
        <button
          onClick={() => navigate('/create-categories')}
          className="px-5 sm:px-6 py-2.5 bg-[#FF6767] hover:bg-[#F24E1E] text-white rounded-lg text-sm font-medium transition-colors mb-6 sm:mb-8 self-start shrink-0"
        >
          Add Category
        </button>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {/* Categories Section */}
          <div>
            {loading && categories.length === 0 ? (
              <div className="text-center text-[#A1A3AB] py-8">Loading categories...</div>
            ) : categories.length === 0 ? (
              <div className="text-center text-[#A1A3AB] py-8">No categories yet. Create your first category!</div>
            ) : (
              <div className="border border-[#D3D3D3] rounded-xl overflow-hidden overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="border-b border-[#D3D3D3]">
                      <th className="px-4 sm:px-6 py-4 text-center text-sm font-semibold text-[#000000] w-16 sm:w-20">SN</th>
                      <th className="px-4 sm:px-6 py-4 text-center text-sm font-semibold text-[#000000]">Category Name</th>
                      <th className="px-4 sm:px-6 py-4 text-center text-sm font-semibold text-[#000000] w-24">Color</th>
                      <th className="px-4 sm:px-6 py-4 text-center text-sm font-semibold text-[#000000] w-52 sm:w-64">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category, index) => (
                      <tr key={category.id} className="border-b border-[#D3D3D3] last:border-b-0">
                        <td className="px-4 sm:px-6 py-4 text-center text-sm text-[#000000]">{index + 1}</td>
                        <td className="px-4 sm:px-6 py-4 text-center text-sm text-[#000000]">{category.name}</td>
                        <td className="px-4 sm:px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div
                              className="w-8 h-8 rounded-lg border border-[#D3D3D3]"
                              style={{ backgroundColor: category.color }}
                              title={category.color}
                            />
                            <span className="text-xs text-[#747474]">{category.color}</span>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center justify-center gap-3 sm:gap-4">
                            <button
                              onClick={() => handleDelete(category.id)}
                              className="px-4 sm:px-5 py-2 bg-[#FF6767] hover:bg-[#F24E1E] text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 min-w-[80px] justify-center"
                            >
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
