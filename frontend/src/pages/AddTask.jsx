import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdCalendarToday } from 'react-icons/md';
import { todoAPI } from '../services/api';
import { useAPI } from '../hooks/useAPI';
import toast from 'react-hot-toast';

export function AddTask() {
  const navigate = useNavigate();
  const { loading, execute } = useAPI();
  const fileInputRef = useRef(null);
  const dateInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Moderate',
    status: 'Not Started',
    dueDate: '',
    image: null,
    imageFile: null,
  });

  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePriorityChange = (priority) => {
    setFormData({
      ...formData,
      priority: formData.priority === priority ? 'Moderate' : priority,
    });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.type.startsWith('image/')) {
      // Store the file for upload
      setFormData({
        ...formData,
        imageFile: file,
      });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Please select an image file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      toast.error('Please fill in title and description');
      return;
    }

    try {
      const taskData = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        image: formData.imageFile,
      };

      if (formData.dueDate) {
        // Convert date to ISO format
        const date = new Date(formData.dueDate);
        taskData.due_date = date.toISOString();
      }

      await execute(
        () => todoAPI.create(taskData),
        'Task created successfully!'
      );

      navigate(-1);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  // Custom image upload icon matching the design
  const ImageUploadIcon = () => (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M65 10H15C12.2386 10 10 12.2386 10 15V65C10 67.7614 12.2386 70 15 70H65C67.7614 70 70 67.7614 70 65V15C70 12.2386 67.7614 10 65 10Z" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="28" cy="28" r="6" stroke="#D1D5DB" strokeWidth="2"/>
      <path d="M70 52L55 37L15 70" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M58 30V18" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round"/>
      <path d="M52 24L58 18L64 24" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40"
        onClick={() => navigate(-1)}
      />

      {/* Modal */}
      <div 
        className="relative bg-white rounded-xl shadow-xl w-full max-w-[760px] mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-6 pb-4">
          <h1 className="text-lg font-bold text-black border-b-2 border-[#FF6767] pb-1">
            Add New Task
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="text-black hover:text-gray-600 transition-colors text-sm font-medium"
          >
            Go Back
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 pb-8">
          {/* Form Container with Border */}
          <div className="border border-gray-200 rounded-xl p-6">
            {/* Title */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-black mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                disabled={loading}
                className="w-full max-w-[420px] h-11 px-4 rounded-md bg-white border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors text-black text-sm"
                required
              />
            </div>

            {/* Date */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-black mb-2">
                Date
              </label>
              <div className="relative w-full max-w-[420px]">
                <input
                  ref={dateInputRef}
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full h-11 px-4 pr-10 rounded-md bg-white border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors text-black text-sm [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-10 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <MdCalendarToday size={18} />
                </div>
              </div>
            </div>

            {/* Priority */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-black mb-2">
                Priority
              </label>
              <div className="flex items-center gap-8">
                {/* Extreme */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <span className="w-2 h-2 rounded-full bg-[#F21E1E]"></span>
                  <span className="text-sm text-gray-600">Extreme</span>
                  <input
                    type="radio"
                    name="priority"
                    checked={formData.priority === 'Extreme'}
                    onChange={() => handlePriorityChange('Extreme')}
                    disabled={loading}
                    className="w-4 h-4 border border-gray-300 rounded-sm cursor-pointer accent-[#F21E1E]"
                  />
                </label>

                {/* Moderate */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <span className="w-2 h-2 rounded-full bg-[#42ADE2]"></span>
                  <span className="text-sm text-gray-600">Moderate</span>
                  <input
                    type="radio"
                    name="priority"
                    checked={formData.priority === 'Moderate'}
                    onChange={() => handlePriorityChange('Moderate')}
                    disabled={loading}
                    className="w-4 h-4 border border-gray-300 rounded-sm cursor-pointer accent-[#42ADE2]"
                  />
                </label>

                {/* Low */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <span className="w-2 h-2 rounded-full bg-[#05A301]"></span>
                  <span className="text-sm text-gray-600">Low</span>
                  <input
                    type="radio"
                    name="priority"
                    checked={formData.priority === 'Low'}
                    onChange={() => handlePriorityChange('Low')}
                    disabled={loading}
                    className="w-4 h-4 border border-gray-300 rounded-sm cursor-pointer accent-[#05A301]"
                  />
                </label>
              </div>
            </div>

            {/* Task Description and Upload Image Row */}
            <div className="flex gap-6">
              {/* Task Description */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-black mb-2">
                  Task Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Start writing here...."
                  disabled={loading}
                  className="w-full h-[200px] px-4 py-3 rounded-md bg-white border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors text-black text-sm placeholder:text-gray-400 resize-none"
                  required
                />
              </div>

              {/* Upload Image */}
              <div className="w-[220px] shrink-0">
                <label className="block text-sm font-medium text-black mb-2">
                  Upload Image
                </label>
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border rounded-md h-[200px] flex flex-col items-center justify-center ${
                    dragActive 
                      ? 'border-gray-400 bg-gray-50' 
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  {previewImage ? (
                    <div className="space-y-2 w-full px-3 text-center">
                      <img 
                        src={previewImage} 
                        alt="Preview" 
                        className="w-full h-32 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewImage(null);
                          setFormData({ ...formData, imageFile: null });
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                        className="text-xs text-red-500 hover:text-red-600 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="mb-2">
                        <ImageUploadIcon />
                      </div>
                      <p className="text-xs text-gray-400 mb-0.5">
                        Drag&Drop files here
                      </p>
                      <p className="text-xs text-gray-400 mb-2">
                        or
                      </p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={loading}
                        className="px-4 py-1.5 border border-gray-300 rounded text-xs text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        Browse
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileInput}
                        className="hidden"
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Done Button */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 bg-[#FF6767] hover:bg-[#E55A5A] text-white rounded-full text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Done'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
