import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { userLogin } from '../../features/auth/authActions';

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
  
  const [message, setMessage] = useState({ text: '', type: '' });
  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle URL query parameters
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const error = query.get('error');
    const success = query.get('success');

    if (success) {
      setMessage({
        text: MESSAGE_MAPPINGS[success] || MESSAGE_MAPPINGS.default_success,
        type: 'success'
      });
      navigate(location.pathname, { replace: true });
    }

    if (error) {
      setMessage({
        text: MESSAGE_MAPPINGS[error] || MESSAGE_MAPPINGS.default_error,
        type: 'error'
      });
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (!formData.username.trim() || !formData.password.trim()) {
      setMessage({
        text: MESSAGE_MAPPINGS.validation_error,
        type: 'error'
      });
      return;
    }

    try {
      const result = await dispatch(userLogin(formData));
      
      if (userLogin.fulfilled.match(result)) {
        if (result.payload?.id_token) {
          localStorage.setItem('access_token', `Bearer ${result.payload.id_token}`);
          navigate('/dashboard');
        } else {
          setMessage({
            text: 'Login successful but no token received',
            type: 'error'
          });
        }
      }
    } catch (error) {
      const errorMessage = typeof error === 'string' 
        ? error 
        : error.message || MESSAGE_MAPPINGS.default_error;
      
      setMessage({
        text: errorMessage,
        type: 'error'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      {/* Message display */}
      {message.text && (
        <div className={`mb-4 p-3 rounded-md ${
          message.type === 'error' 
            ? 'bg-red-50 text-red-600 border border-red-200'
            : 'bg-green-50 text-green-600 border border-green-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Username field - completely empty */}
      <div className="mb-4">
        <label htmlFor="username" className="block text-gray-600 mb-1">
          Username
        </label>
        <input
  type="text"
  id="username"
  name="username"
  value={formData.username}
  onChange={(e) => setFormData({...formData, username: e.target.value})}
  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
  autoComplete="new-username"  // Override browser autofill
/>
      </div>

      {/* Password field - completely empty */}
      <div className="mb-6">
        <label htmlFor="password" className="block text-gray-600 mb-1">
          Password
        </label>
        <input
  type="password"
  id="password"
  name="password"
  value={formData.password}
  onChange={(e) => setFormData({...formData, password: e.target.value})}
  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
  autoComplete="new-password"  // Override browser autofill
/>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md disabled:bg-blue-300 disabled:cursor-not-allowed"
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}

export default LoginForm;