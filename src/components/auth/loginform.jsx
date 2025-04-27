import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { userLogin } from '../../features/auth/authActions';
import { message } from 'antd';

const MESSAGE_MAPPINGS = {
  // Error messages
  invalid_token: 'Invalid confirmation link',
  expired_token: 'Confirmation link has expired',
  user_exists: 'User already exists',
  creation_failed: 'Account creation failed',
  timeout: 'Request timeout',
  service_now_auth_failed: 'Service configuration error',
  validation_error: 'Please fill in all fields',
  invalid_credentials: 'Invalid username or password',
  network_error: 'Network error. Please check your connection.',
  authentication_failed: 'Authentication failed',
  default_error: 'An unexpected error occurred',
  
  // Success messages
  registration_confirmed: 'Registration confirmed! You can now log in.',
  default_success: 'Action completed successfully'
};

function LoginForm() {
  // Initialize with empty strings - no default credentials
  const [formData, setFormData] = useState({ 
    username: '',
    password: '' 
  });
  
  const [messageContent, setMessageContent] = useState({ text: '', type: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessageContent({ text: '', type: '' });

    // Validate form data
    if (!formData.username.trim() || !formData.password.trim()) {
      setMessageContent({
        text: MESSAGE_MAPPINGS.validation_error,
        type: 'error'
      });
      return;
    }

    // Dispatch the login action
    const result = await dispatch(userLogin(formData));

    if (userLogin.fulfilled.match(result)) {
      const token = result.payload?.id_token;
      if (token) {
        localStorage.setItem('access_token', `Bearer ${token}`);
        message.success('Login successful');
        navigate('/dashboard');
      } else {
        message.error('Login successful but no token received');
      }
    } else if (userLogin.rejected.match(result)) {
      const { message: errorMsg, type } = result.payload || {};
      message.error(MESSAGE_MAPPINGS[type] || errorMsg || MESSAGE_MAPPINGS.default_error);
    }
  };

  // Check if user is already logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) navigate('/dashboard');
  }, [navigate]);

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="mb-4">
        {/* Message display */}
        {messageContent.text && (
          <div className={`mb-4 p-3 rounded-md ${
            messageContent.type === 'error' 
              ? 'bg-red-50 text-red-600 border border-red-200'
              : 'bg-green-50 text-green-600 border border-green-200'
          }`}>
            {messageContent.text}
          </div>
        )}

        {/* Username field */}
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-600 mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            autoComplete="new-username"
          />
        </div>

        {/* Password field */}
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-600 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            autoComplete="new-password"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={false}  // Add loading state if needed
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
        >
          Sign in
        </button>
      </form>

      {/* Sign up link */}
      <div className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-500 hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}

export default LoginForm;