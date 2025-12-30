import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAPI } from '../hooks/useAPI';
import toast from 'react-hot-toast';

export function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { loading, execute } = useAPI();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.username || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    if (!rememberMe) {
      toast.error('Please agree to the Terms and Conditions');
      return;
    }

    const result = await execute(
      () => register(formData),
      'Registration successful!'
    );

    if (result?.success) {
      navigate('/dashboard');
    }
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
                  className="w-full pl-14 pr-4 py-4 border-2 border-neutral-border rounded-xl focus:outline-none focus:border-primary transition-colors text-neutral-text"
                  required
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
                  disabled={loading}
                  className="w-full pl-14 pr-4 py-4 border-2 border-neutral-border rounded-xl focus:outline-none focus:border-primary transition-colors text-neutral-text"
                  required
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
                  disabled={loading}
                  className="w-full pl-14 pr-4 py-4 border-2 border-neutral-border rounded-xl focus:outline-none focus:border-primary transition-colors text-neutral-text"
                  required
                  minLength={8}
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
                  disabled={loading}
                  className="w-full pl-14 pr-4 py-4 border-2 border-neutral-border rounded-xl focus:outline-none focus:border-primary transition-colors text-neutral-text"
                  required
                  minLength={8}
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
              disabled={loading}
              className="text-white w-full bg-primary bg-[#ff6969] hover:bg-[#ff4d4d] hover:shadow-xl font-semibold py-4 rounded-xl transition-colors shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

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
