import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userLogin } from '../../features/auth/authActions';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Clear any potential stored values on mount
  useEffect(() => {
    setFormData({
      username: '',
      password: ''
    });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(userLogin(formData));
      if (response?.payload?.id_token) {
        localStorage.setItem('access_token', response.payload.id_token);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <div className="mb-4">
        <label htmlFor="username" className="block text-gray-600">
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className={`w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 ${error ? 'border-red-500' : ''}`}
          autoComplete="new-username"  // Changed from "username"
          disabled={loading}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block text-gray-600">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={`w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 ${error ? 'border-red-500' : ''}`}
          autoComplete="new-password"  // Changed from "current-password"
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full disabled:bg-blue-400"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

export default LoginForm;