import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryAPI } from '../services/api';
import { useAPI } from '../hooks/useAPI';

export function CreateCategories() {
  const navigate = useNavigate();
  const { loading, execute } = useAPI();
  const [categoryName, setCategoryName] = useState('');
  const [color, setColor] = useState('#FF6767');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      alert('Please enter a category name');
      return;
    }

    const result = await execute(() => categoryAPI.create({ name: categoryName, color }), 'Category created successfully!');

    if (result) {
      // Navigate to Task Categories page
      navigate('/categories');
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Main Container */}
      <div className="bg-white rounded-xl lg:rounded-2xl border border-[#D3D3D3] p-4 sm:p-6 lg:p-8 flex-1 flex flex-col min-h-0 relative">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-6">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#000000] border-b-2 border-[#FF6767] pb-1">
            Create Categories
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="text-[#000000] hover:text-[#747474] transition-colors text-sm font-medium underline"
          >
            Go Back
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Category Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#000000] mb-2">
              Category Name
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
              className="w-full max-w-md h-11 px-4 rounded-lg bg-white border border-[#D3D3D3] focus:outline-none focus:border-[#A1A3AB] transition-colors text-[#000000] text-sm"
            />
          </div>

          {/* Category Color */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#000000] mb-2">
              Category Color
            </label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-16 h-11 rounded-lg border border-[#D3D3D3] cursor-pointer"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#FF6767"
                className="w-32 h-11 px-4 rounded-lg bg-white border border-[#D3D3D3] focus:outline-none focus:border-[#A1A3AB] transition-colors text-[#000000] text-sm"
              />
              <div
                className="w-11 h-11 rounded-lg border border-[#D3D3D3]"
                style={{ backgroundColor: color }}
                title="Color preview"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#FF6767] hover:bg-[#F24E1E] text-white rounded-lg text-sm font-medium transition-colors"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => navigate('/categories')}
              className="px-6 py-2.5 bg-[#FF6767] hover:bg-[#F24E1E] text-white rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
