import { useState } from 'react';
import { MdPerson, MdLock } from 'react-icons/md';
import { FaFacebookF, FaGoogle } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

export function Login({ onLogin, onShowRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    onLogin?.();
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}/>
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-3xl shadow-strong w-full max-w-5xl grid md:grid-cols-2 overflow-hidden relative z-10">
        {/* Left Side - Form */}
        <div className="p-10 md:p-12">
          <h1 className="text-4xl font-bold text-neutral-text mb-8">Sign In</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-text-muted">
                  <MdPerson size={24} />
                </div>
                <input
                  type="text"
                  placeholder="Enter Username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 border-2 border-neutral-border rounded-xl focus:outline-none focus:border-primary transition-colors text-neutral-text"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-text-muted">
                  <MdLock size={24} />
                </div>
                <input
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 border-2 border-neutral-border rounded-xl focus:outline-none focus:border-primary transition-colors text-neutral-text"
                />
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-primary border-neutral-border rounded focus:ring-primary"
              />
              <label htmlFor="remember" className="ml-2 text-neutral-text-light">
                Remember Me
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 rounded-xl transition-colors shadow-lg shadow-primary/30"
            >
              Login
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-8">
            <p className="text-neutral-text-light mb-4">Or, Login with</p>
            <div className="flex gap-4">
              <button className="flex-1 p-3 border-2 border-neutral-border rounded-xl hover:bg-neutral-bg transition-colors flex items-center justify-center">
                <FaFacebookF className="text-blue-600" size={24} />
              </button>
              <button className="flex-1 p-3 border-2 border-neutral-border rounded-xl hover:bg-neutral-bg transition-colors flex items-center justify-center">
                <FaGoogle className="text-red-500" size={24} />
              </button>
              <button className="flex-1 p-3 border-2 border-neutral-border rounded-xl hover:bg-neutral-bg transition-colors flex items-center justify-center">
                <FaXTwitter className="text-neutral-text" size={24} />
              </button>
            </div>
          </div>

          {/* Create Account Link */}
          <p className="text-neutral-text-light mt-6">
            Don't have an account?{' '}
            <button
              onClick={() => onShowRegister?.()}
              className="text-secondary-blue-light hover:underline font-medium"
            >
              Create One
            </button>
          </p>
        </div>

        {/* Right Side - Illustration */}
        <div className="bg-gradient-to-br from-primary/10 via-secondary-blue/10 to-secondary-purple/10 p-12 flex items-center justify-center hidden md:flex">
          <div className="text-center">
            <div className="relative inline-block">
              {/* Phone Mockup */}
              <div className="w-64 h-96 bg-secondary-blue rounded-3xl shadow-strong p-4 relative">
                <div className="bg-white rounded-2xl h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-status-completed rounded-full mx-auto mb-4 flex items-center justify-center shadow-md">
                      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-secondary-blue/30 rounded w-32 mx-auto"></div>
                      <div className="h-3 bg-secondary-blue/30 rounded w-24 mx-auto"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Character Illustration */}
              <div className="absolute -right-16 bottom-0 w-32 h-48 bg-gradient-to-b from-secondary-purple to-primary rounded-t-full opacity-80"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
