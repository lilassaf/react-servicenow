import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userLogin } from '../../features/auth/authActions';
import { useNavigate } from 'react-router-dom';

// Error message mappings
const ERROR_MESSAGES = {
  validation_error: 'Please fill in all fields',
  invalid_credentials: 'Invalid username or password',
  network_error: 'Network error. Please check your connection.',
  timeout: 'Request timeout. Please try again.',
  service_unavailable: 'Service unavailable. Please try later.',
  authentication_failed: 'Authentication failed',
  default: 'An unexpected error occurred'
};

function LoginForm() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getErrorMessage = (error) => {
    if (!error) return null;
    return ERROR_MESSAGES[error.type] || error.message || ERROR_MESSAGES.default;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!formData.username.trim() || !formData.password.trim()) {
      setError({ type: 'validation_error' });
      return;
    }

    const result = await dispatch(userLogin(formData));
    
    if (userLogin.rejected.match(result)) {
      setError(result.payload);
    } else if (userLogin.fulfilled.match(result)) {
      if (result.payload?.id_token) {
        localStorage.setItem('access_token', `Bearer ${result.payload.id_token}`);
        navigate('/dashboard');
      } else {
        setError({ type: 'authentication_error', message: 'Login successful but no token received' });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      {/* Form fields */}
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
          className={`w-full border rounded-md py-2 px-3 focus:outline-none ${
            error ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
          }`}
          autoComplete="new-username"
          disabled={loading}
        />
      </div>

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
          className={`w-full border rounded-md py-2 px-3 focus:outline-none ${
            error ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
          }`}
          autoComplete="new-password"
          disabled={loading}
        />
      </div>

      {/* Error display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
          {getErrorMessage(error)}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 px-4 rounded-md font-medium text-white ${
          loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}

export default LoginForm;