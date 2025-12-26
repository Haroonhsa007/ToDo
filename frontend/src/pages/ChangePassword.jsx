import { useState } from 'react';
import { MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';

export function ChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Handle password change logic
  };

  return (
    <div className="flex-1 bg-white min-h-screen overflow-y-auto">
      {/* Header */}
      <header className="bg-white border-b border-neutral-border px-8 py-6">
        <h1 className="text-3xl font-bold text-neutral-text">Change Password</h1>
      </header>

      {/* Main Content */}
      <div className="p-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-neutral-text mb-2">
              <MdLock className="inline mr-2" />
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Enter current password"
                required
                className="w-full px-4 py-3 pr-12 rounded-lg bg-neutral-bg border border-neutral-border focus:outline-none focus:border-primary transition-colors text-neutral-text"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-text-muted hover:text-neutral-text"
              >
                {showPasswords.current ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-neutral-text mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                required
                className="w-full px-4 py-3 pr-12 rounded-lg bg-neutral-bg border border-neutral-border focus:outline-none focus:border-primary transition-colors text-neutral-text"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-text-muted hover:text-neutral-text"
              >
                {showPasswords.new ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
              </button>
            </div>
            <p className="text-xs text-neutral-text-muted mt-1">
              Password must be at least 8 characters long
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-neutral-text mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                required
                className="w-full px-4 py-3 pr-12 rounded-lg bg-neutral-bg border border-neutral-border focus:outline-none focus:border-primary transition-colors text-neutral-text"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-text-muted hover:text-neutral-text"
              >
                {showPasswords.confirm ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors shadow-md"
            >
              Update Password
            </button>
            <button
              type="button"
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

