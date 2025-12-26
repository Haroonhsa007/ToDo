import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdColorLens } from 'react-icons/md';

export function CreateCategories() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    color: '#FF8787',
    description: '',
  });

  const colors = [
    '#FF8787', '#4A90E2', '#9B59B6', '#04C400',
    '#FFA500', '#E74C3C', '#1ABC9C', '#34495E'
  ];

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Handle category creation
    navigate(-1);
  };

  return (
    <div className="flex-1 bg-white min-h-screen overflow-y-auto">
      {/* Header */}
      <header className="bg-white border-b border-neutral-border px-8 py-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-neutral-bg rounded-lg transition-colors"
          >
            <MdArrowBack size={24} className="text-neutral-text" />
          </button>
          <h1 className="text-3xl font-bold text-neutral-text">Create Category</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-text mb-2">
              Category Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter category name"
              required
              className="w-full px-4 py-3 rounded-lg bg-neutral-bg border border-neutral-border focus:outline-none focus:border-primary transition-colors text-neutral-text"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-neutral-text mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter category description (optional)"
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-neutral-bg border border-neutral-border focus:outline-none focus:border-primary transition-colors text-neutral-text resize-none"
            />
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-neutral-text mb-3">
              <MdColorLens className="inline mr-2" />
              Category Color
            </label>
            <div className="flex items-center gap-4">
              <div className="flex gap-2 flex-wrap">
                {colors.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-12 h-12 rounded-lg transition-all ${
                      formData.color === color ? 'ring-4 ring-primary ring-offset-2' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-12 h-12 rounded-lg border-2 border-neutral-border"
                  style={{ backgroundColor: formData.color }}
                />
                <input
                  type="text"
                  value={formData.color}
                  onChange={e => setFormData({ ...formData, color: e.target.value })}
                  className="px-3 py-2 rounded-lg bg-neutral-bg border border-neutral-border focus:outline-none focus:border-primary transition-colors text-neutral-text"
                  placeholder="#FF8787"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium text-neutral-text mb-2">
              Preview
            </label>
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-border/20">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: formData.color }}
                >
                  {formData.name.charAt(0).toUpperCase() || 'C'}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-neutral-text">
                    {formData.name || 'Category Name'}
                  </h3>
                  <p className="text-sm text-neutral-text-muted">
                    {formData.description || 'Category description'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors shadow-md"
            >
              Create Category
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 border-2 border-neutral-border text-neutral-text rounded-lg font-medium hover:bg-neutral-bg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

