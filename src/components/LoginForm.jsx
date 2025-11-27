// [file name]: LoginForm.jsx

import React, { useState } from 'react';

export default function LoginForm({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: ''
  });
  const [loginType, setLoginType] = useState('admin'); // 'admin' or 'hotel'
  const [hotelData, setHotelData] = useState(null);
  const [step, setStep] = useState('initial'); // 'initial', 'check-hotel', 'set-password'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setMessage(''); // Clear message when user types
  };

  const handleLoginTypeChange = (type) => {
    setLoginType(type);
    setStep('initial');
    setHotelData(null);
    setMessage('');
    setFormData({ email: '', password: '', phone: '' });
  };

  // Check hotel status
  const checkHotelStatus = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:8000/api/auth/check-hotel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: formData.phone }),
      });

      const result = await response.json();

      if (result.success) {
        setHotelData(result.data);
        if (result.data.isFirstLogin) {
          setStep('set-password');
          setMessage('Please set your password for first-time login');
        } else {
          setStep('login');
          setMessage('Please enter your password to login');
        }
      } else {
        setMessage(result.message || 'Error checking hotel status');
      }
    } catch (error) {
      console.error('Check hotel error:', error);
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Set password for first login
  const handleSetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.password) {
      setMessage('Please enter a password');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setMessage('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/auth/set-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phone: formData.phone,
          password: formData.password 
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage('Password set successfully! You can now login.');
        setStep('login');
        setFormData({ ...formData, password: '' }); // Clear password field
      } else {
        setMessage(result.message || 'Error setting password');
      }
    } catch (error) {
      console.error('Set password error:', error);
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Hotel login with password
  const handleHotelLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/auth/hotel-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phone: formData.phone,
          password: formData.password 
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Call the onLogin callback to redirect to dashboard
        onLogin({
          ...result.data,
          email: result.data.phone + '@sshhotels.in', // Generate email from phone
          role: 'hotel'
        });
      } else {
        setMessage(result.message || 'Invalid credentials!');
      }
    } catch (error) {
      console.error('Hotel login error:', error);
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Admin login (existing functionality)
  const handleAdminLogin = (e) => {
    e.preventDefault();
    
    // Check for admin credentials
    if (formData.email === 'admin@sshhotels.in' && formData.password === 'Smily@2003') {
      onLogin({
        email: formData.email,
        name: 'Admin User',
        role: 'admin'
      });
    } else {
      setMessage('Invalid admin credentials! Please try again.');
    }
  };

  const handleSubmit = (e) => {
    if (loginType === 'admin') {
      handleAdminLogin(e);
    } else if (loginType === 'hotel') {
      if (step === 'initial') {
        checkHotelStatus(e);
      } else if (step === 'set-password') {
        handleSetPassword(e);
      } else if (step === 'login') {
        handleHotelLogin(e);
      }
    }
  };

  const getButtonText = () => {
    if (loading) return 'Loading...';
    
    if (loginType === 'admin') return 'Sign In';
    
    if (loginType === 'hotel') {
      if (step === 'initial') return 'Check Status';
      if (step === 'set-password') return 'Set Password';
      if (step === 'login') return 'Sign In';
    }
    
    return 'Continue';
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">Partner Login</h2>
      <p className="text-white/70 mb-6">Sign in to your partner account</p>

      {/* Login Type Toggle */}
      <div className="flex bg-white/10 rounded-xl p-1 mb-6">
        <button
          type="button"
          onClick={() => handleLoginTypeChange('admin')}
          className={`flex-1 py-2 rounded-lg transition-colors ${
            loginType === 'admin' 
              ? 'bg-red-600 text-white' 
              : 'text-white/70 hover:text-white'
          }`}
        >
          Admin
        </button>
        <button
          type="button"
          onClick={() => handleLoginTypeChange('hotel')}
          className={`flex-1 py-2 rounded-lg transition-colors ${
            loginType === 'hotel' 
              ? 'bg-red-600 text-white' 
              : 'text-white/70 hover:text-white'
          }`}
        >
          Hotel Partner
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-xl text-center ${
          message.includes('successfully') 
            ? 'bg-green-500/20 border border-green-500 text-green-200'
            : 'bg-red-500/20 border border-red-500 text-red-200'
        }`}>
          {message}
        </div>
      )}

      {hotelData && step !== 'initial' && (
        <div className="mb-4 p-3 bg-blue-500/20 border border-blue-500 rounded-xl text-blue-200">
          <strong>{hotelData.name}</strong>
          <br />
          {hotelData.businessAddress}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Admin Login Fields */}
        {loginType === 'admin' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@sshhotels.in"
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-red-600 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-red-600 transition-colors"
              />
            </div>
          </>
        )}

        {/* Hotel Partner Login Fields */}
        {loginType === 'hotel' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-red-600 transition-colors"
              />
            </div>

            {(step === 'set-password' || step === 'login') && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  {step === 'set-password' ? 'Set Password' : 'Password'}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={
                    step === 'set-password' 
                      ? 'Enter your new password (min 6 characters)' 
                      : 'Enter your password'
                  }
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-red-600 transition-colors"
                />
                {step === 'set-password' && (
                  <p className="text-xs text-white/50 mt-2">
                    Password must be at least 6 characters long
                  </p>
                )}
              </div>
            )}
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl text-white font-bold text-lg hover:shadow-lg hover:shadow-red-600/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {getButtonText()}
        </button>
      </form>

      {loginType === 'hotel' && step === 'initial' && (
        <div className="mt-4 p-3 bg-white/10 rounded-xl text-white/70 text-sm">
          💡 Enter your registered phone number to check your approval status and login
        </div>
      )}
    </div>
  );
}
