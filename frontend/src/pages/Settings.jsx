import { Link } from 'react-router-dom';

export function Settings() {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-text">Settings</h1>
      </div>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          <Link
            to="/account-info"
            className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-border/20 hover:shadow-medium transition-shadow text-left block"
          >
            <h3 className="font-semibold text-lg text-neutral-text mb-2">Account Information</h3>
            <p className="text-neutral-text-light text-sm">Update your profile information</p>
          </Link>
          <Link
            to="/change-password"
            className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-border/20 hover:shadow-medium transition-shadow text-left block"
          >
            <h3 className="font-semibold text-lg text-neutral-text mb-2">Change Password</h3>
            <p className="text-neutral-text-light text-sm">Update your account password</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

