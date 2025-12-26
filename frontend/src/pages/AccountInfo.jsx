import { useState } from 'react';
import { MdPerson, MdEmail, MdPhone, MdEdit } from 'react-icons/md';

export function AccountInfo() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Sundar Gurung',
    email: 'sundargurung360@gmail.com',
    phone: '+977 9841234567',
    bio: 'Software Developer passionate about building great products.',
  });

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    setIsEditing(false);
    // Handle save logic
  };

  return (
    <div className="flex-1 bg-white min-h-screen overflow-y-auto">
      {/* Header */}
      <header className="bg-white border-b border-neutral-border px-8 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-neutral-text">Account Information</h1>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="px-5 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-all duration-200 flex items-center gap-2 shadow-md"
          >
            <MdEdit size={20} />
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-8 max-w-4xl">
        {/* Profile Picture */}
        <div className="mb-8">
          <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 ring-4 ring-primary/20">
            <img
              src="https://ui-avatars.com/api/?name=Sundar+Gurung&background=FF6767&color=fff&size=200"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          {isEditing && (
            <div className="text-center">
              <button className="text-primary hover:underline text-sm font-medium">
                Change Photo
              </button>
            </div>
          )}
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-text mb-2">
              <MdPerson className="inline mr-2" />
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-4 py-3 rounded-lg bg-neutral-bg border border-neutral-border focus:outline-none focus:border-primary transition-colors text-neutral-text disabled:opacity-60"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-neutral-text mb-2">
              <MdEmail className="inline mr-2" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-4 py-3 rounded-lg bg-neutral-bg border border-neutral-border focus:outline-none focus:border-primary transition-colors text-neutral-text disabled:opacity-60"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-neutral-text mb-2">
              <MdPhone className="inline mr-2" />
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-4 py-3 rounded-lg bg-neutral-bg border border-neutral-border focus:outline-none focus:border-primary transition-colors text-neutral-text disabled:opacity-60"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-neutral-text mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              disabled={!isEditing}
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-neutral-bg border border-neutral-border focus:outline-none focus:border-primary transition-colors text-neutral-text resize-none disabled:opacity-60"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

