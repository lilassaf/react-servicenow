import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from "../../features/auth/authActions";
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    user_name: '',
    user_password: '',
    first_name: '',
    last_name: '',
    email: '',
    mobile_phone: ''
  });
  
  const [validationErrors, setValidationErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const errors = {};
    if (!formData.user_name.trim()) errors.user_name = 'Username is required';
    if (formData.user_password.length < 6) errors.user_password = 'Password must be at least 6 characters';
    if (!formData.first_name.trim()) errors.first_name = 'First name is required';
    if (!formData.last_name.trim()) errors.last_name = 'Last name is required';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) errors.email = 'Valid email is required';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    
    if (!validateForm()) return;

    try {
      const result = await dispatch(registerUser(formData));
      
      if (registerUser.fulfilled.match(result)) {
        setSuccessMessage('A confirmation email has been sent. Please check your inbox to complete registration.');
        
        // Reset form after successful registration
        setFormData({
          user_name: '',
          user_password: '',
          first_name: '',
          last_name: '',
          email: '',
          mobile_phone: ''
        });
        
        // Navigate to login page and show success message
        setTimeout(() => {
          navigate('/login', { state: { successMessage: 'Registration successful! Please confirm your email.' } });
        }, 2000); // Wait 2 seconds before redirecting
      }
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  return (
    <form onSubmit={handleRegister} className="max-w-md mx-auto">
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="user_name" className="block text-gray-600 mb-1">
          Username *
        </label>
        <input
          type="text"
          id="user_name"
          name="user_name"
          className={`w-full border rounded-md py-2 px-3 ${validationErrors.user_name ? 'border-red-500' : 'border-gray-300'}`}
          value={formData.user_name}
          onChange={handleChange}
          autoComplete="username"
        />
        {validationErrors.user_name && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.user_name}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="user_password" className="block text-gray-600 mb-1">
          Password *
        </label>
        <input
          type="password"
          id="user_password"
          name="user_password"
          className={`w-full border rounded-md py-2 px-3 ${validationErrors.user_password ? 'border-red-500' : 'border-gray-300'}`}
          value={formData.user_password}
          onChange={handleChange}
          autoComplete="new-password"
        />
        {validationErrors.user_password && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.user_password}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="first_name" className="block text-gray-600 mb-1">
            First Name *
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            className={`w-full border rounded-md py-2 px-3 ${validationErrors.first_name ? 'border-red-500' : 'border-gray-300'}`}
            value={formData.first_name}
            onChange={handleChange}
            autoComplete="given-name"
          />
          {validationErrors.first_name && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.first_name}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="last_name" className="block text-gray-600 mb-1">
            Last Name *
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            className={`w-full border rounded-md py-2 px-3 ${validationErrors.last_name ? 'border-red-500' : 'border-gray-300'}`}
            value={formData.last_name}
            onChange={handleChange}
            autoComplete="family-name"
          />
          {validationErrors.last_name && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.last_name}</p>
          )}
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-600 mb-1">
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className={`w-full border rounded-md py-2 px-3 ${validationErrors.email ? 'border-red-500' : 'border-gray-300'}`}
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
        />
        {validationErrors.email && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
        )}
      </div>

      <div className="mb-6">
        <label htmlFor="mobile_phone" className="block text-gray-600 mb-1">
          Mobile Phone
        </label>
        <input
          type="tel"
          id="mobile_phone"
          name="mobile_phone"
          className="w-full border border-gray-300 rounded-md py-2 px-3"
          value={formData.mobile_phone}
          onChange={handleChange}
          autoComplete="tel"
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : 'Register'}
      </button>
      
      <div className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <a href="/login" className="text-blue-600 hover:underline">Login here</a>.
      </div>
    </form>
  );
};

export default RegisterForm;
