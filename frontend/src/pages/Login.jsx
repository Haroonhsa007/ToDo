import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdPerson, MdLock } from 'react-icons/md';
import { FaFacebookF, FaGoogle } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

export function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    onLogin?.();
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-6 relative overflow-hidden bg-[#ff6161]">

      {/* Background Pattern */}
      <div className="absolute inset-0 origin-center">
        <img
          src="/site_svgs/register-page/register_backgroung.svg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-100"
          aria-hidden="true"
        />
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
                className="w-4 h-4 text-primary border-neutral-border rounded-lg focus:ring-primary"
              />
              <label htmlFor="remember" className="ml-2 text-neutral-text-light">
                Remember Me
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="text-white w-full bg-primary bg-[#ff6969] hover:bg-[#ff4d4d] hover:shadow-xl font-semibold py-4 rounded-xl transition-colors shadow-lg shadow-primary/30"
            >
              Login
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-neutral-text-light">Or, Login with</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 group relative rounded-xl border-2 border-neutral-border hover:border-[#1877F2] hover:bg-[#1877F2]/5 transition-all duration-300 flex items-center justify-center py-3.5 shadow-sm hover:shadow-md">
                <img
                  src="/site_svgs/login-page/facebook.svg"
                  alt="Login with Facebook"
                  className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
                />
              </button>
              <button className="flex-1 group relative rounded-xl border-2 border-neutral-border hover:border-[#4285F4] hover:bg-[#4285F4]/5 transition-all duration-300 flex items-center justify-center py-3.5 shadow-sm hover:shadow-md">
                <img
                  src="/site_svgs/login-page/google.svg"
                  alt="Login with Google"
                  className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
                />
              </button>
              <button className="flex-1 group relative rounded-xl border-2 border-neutral-border hover:border-[#1DA1F2] hover:bg-[#1DA1F2]/5 transition-all duration-300 flex items-center justify-center py-3.5 shadow-sm hover:shadow-md">
                <img
                  src="/site_svgs/login-page/twitter.svg"
                  alt="Login with Twitter"
                  className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
                />
              </button>
            </div>
          </div>

          {/* Create Account Link */}
          <p className="text-neutral-text-light mt-6">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-[#008BD9] hover:underline font-medium"
            >
              Create One
            </Link>
          </p>
        </div>

        {/* Right Side - Illustration */}
        <div className="bg-gradient-to-br from-primary/10 via-secondary-blue/10 to-secondary-purple/10 p-12 flex items-center justify-center hidden md:flex">
          <div className="flex items-end h-full w-full">
            <img
              src="/site_svgs/login-page/login.svg"
              alt="Login illustration"
              className="w-full max-w-md h-auto object-contain mx-auto scale-130"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
