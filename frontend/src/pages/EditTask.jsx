import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdCalendarToday } from 'react-icons/md';

export function EditTask() {
  const navigate = useNavigate();
  const location = useLocation();
  const task = location.state?.task;
  const fileInputRef = useRef(null);
  const dateInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || '',
    dueDate: task?.dueDate || '',
    image: task?.image || null,
  });

  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState(task?.image || null);

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePriorityChange = (priority) => {
    setFormData({
      ...formData,
      priority: formData.priority === priority ? '' : priority,
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData({
          ...formData,
          image: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    navigate(-1);
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    if (dateString.includes('/')) {
      const parts = dateString.split('/');
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }
    return dateString;
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
            Edit Task
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
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full max-w-[420px] h-11 px-4 rounded-md bg-white border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors text-black text-sm"
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
                  value={formatDateForInput(formData.dueDate)}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      dueDate: e.target.value,
                    });
                  }}
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
                    type="checkbox"
                    checked={formData.priority === 'Extreme'}
                    onChange={() => handlePriorityChange('Extreme')}
                    className="w-4 h-4 border border-gray-300 rounded-sm cursor-pointer accent-[#F21E1E]"
                  />
                </label>

                {/* Moderate */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <span className="w-2 h-2 rounded-full bg-[#0225FF]"></span>
                  <span className="text-sm text-gray-600">Moderate</span>
                  <input
                    type="checkbox"
                    checked={formData.priority === 'Moderate'}
                    onChange={() => handlePriorityChange('Moderate')}
                    className="w-4 h-4 border border-gray-300 rounded-sm cursor-pointer accent-[#0225FF]"
                  />
                </label>

                {/* Low */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <span className="w-2 h-2 rounded-full bg-[#05A301]"></span>
                  <span className="text-sm text-gray-600">Low</span>
                  <input
                    type="checkbox"
                    checked={formData.priority === 'Low'}
                    onChange={() => handlePriorityChange('Low')}
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
                  Task Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Start writing here...."
                  className="w-full h-[200px] px-4 py-3 rounded-md bg-white border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors text-black text-sm placeholder:text-gray-400 resize-none"
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
                          setFormData({ ...formData, image: null });
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
                        className="px-4 py-1.5 border border-gray-300 rounded text-xs text-gray-600 hover:bg-gray-50 transition-colors"
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
              className="px-8 py-2.5 bg-[#FF6767] hover:bg-[#E55A5A] text-white rounded-full text-sm font-medium transition-colors"
            >
              Done
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
