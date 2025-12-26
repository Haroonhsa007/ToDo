import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaGoogle } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

export function Register({ onRegister }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    onRegister?.();
  };

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#ff6969]">

      {/* Background Pattern */}
      <div className="absolute inset-0 origin-center">
        <img
          src="/site_svgs/register-page/register_backgroung.svg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-100"
          aria-hidden="true"
        />
      </div>

      {/* Register Card */}
      <div className="bg-[#fdf9f9] rounded-3xl shadow-strong w-full max-w-6xl grid md:grid-cols-2 overflow-hidden relative z-10">

        {/* Left Side - Illustration */}
        <div className="bg-gradient-to-br from-primary/10 via-secondary-blue/10 to-secondary-purple/10 p-12 relative hidden md:flex">
          {/* The illustration is absolutely positioned to the bottom left corner */}
          <div className="absolute left-0 bottom-0 w-full flex justify-start items-end">
            <img
              src="/site_svgs/register-page/register.svg"
              alt="Register illustration"
              className="w-full max-w-md h-auto object-contain mb-[10px] ml-0"
            />
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-12">
          <h1 className="text-4xl font-bold text-neutral-text mb-8">Sign Up</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name Input */}
            <div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-text-muted">
                  <img
                    src="/site_svgs/register-page/first-name.svg"
                    alt=""
                    className="w-6 h-6"
                    aria-hidden="true"
                  />
                </div>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Enter First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full pl-14 pr-4 py-4 border-2 border-neutral-border rounded-xl focus:outline-none focus:border-primary transition-colors text-neutral-text"
                />
              </div>
            </div>

            {/* Last Name Input */}
            <div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-text-muted">
                  <img
                    src="/site_svgs/register-page/last-name.svg"
                    alt=""
                    className="w-6 h-6"
                    aria-hidden="true"
                  />
                </div>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Enter Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full pl-14 pr-4 py-4 border-2 border-neutral-border rounded-xl focus:outline-none focus:border-primary transition-colors text-neutral-text"
                />
              </div>
            </div>

            {/* Username Input */}
            <div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-text-muted">
                  <img
                    src="/site_svgs/register-page/uesername.svg"
                    alt=""
                    className="w-6 h-6"
                    aria-hidden="true"
                  />
                </div>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter Username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-14 pr-4 py-4 border-2 border-neutral-border rounded-xl focus:outline-none focus:border-primary transition-colors text-neutral-text"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-text-muted">
                  <img
                    src="/site_svgs/register-page/email.svg"
                    alt=""
                    className="w-6 h-6"
                    aria-hidden="true"
                  />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-14 pr-4 py-4 border-2 border-neutral-border rounded-xl focus:outline-none focus:border-primary transition-colors text-neutral-text"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-text-muted">
                  <img
                    src="/site_svgs/register-page/password.svg"
                    alt=""
                    className="w-6 h-6"
                    aria-hidden="true"
                  />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-14 pr-4 py-4 border-2 border-neutral-border rounded-xl focus:outline-none focus:border-primary transition-colors text-neutral-text"
                />
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-text-muted">
                  <img
                    src="/site_svgs/register-page/confirm-password.svg"
                    alt=""
                    className="w-6 h-6"
                    aria-hidden="true"
                  />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
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
                className="w-4 h-4 text-primary border-neutral-border rounded-md focus:ring-primary"
              />
              <label htmlFor="remember" className="ml-2 text-neutral-text-light">
                I agree to the Terms and Conditions
              </label>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="text-white w-full bg-primary bg-[#ff6969] hover:bg-[#ff4d4d] hover:shadow-xl font-semibold py-4 rounded-xl transition-colors shadow-lg shadow-primary/30"
            >
              Register
            </button>
          </form>

          {/* Social Register */}
          {/* <div className="mt-2">
            <p className="text-neutral-text-light mb-4">Or, Register with</p>
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
          </div> */}

          {/* Login Link */}
          <p className="text-neutral-text-light mt-6">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-[#008BD9] hover:underline font-medium"
            >
              Sign In
            </Link>
          </p>
        </div>


      </div>
    </div>
  );
}

