import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import apiService from '../services/api';

export default function LoginForm({ onLogin }) {
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });

  const [loginType, setLoginType] = useState('hotel');
  const [hotelData, setHotelData] = useState(null);
  const [step, setStep] = useState('initial');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    // Check for saved credentials
    const savedPhone = localStorage.getItem('saved_phone');
    if (savedPhone) {
      setFormData(prev => ({ ...prev, phone: savedPhone }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setMessage('');
  };

  const handleLoginTypeChange = (type) => {
    setLoginType(type);
    setStep('initial');
    setHotelData(null);
    setMessage('');
    setFormData({ phone: '', password: '' });
  };

  const checkHotelStatus = async (e) => {
    if (e) e.preventDefault();
    
    if (!formData.phone) {
      setMessage('Please enter your phone number');
      return;
    }

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      setMessage('Please enter a valid phone number (10-15 digits)');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await apiService.checkHotel(formData.phone);

      if (response.success) {
        setHotelData(response.data);
        if (response.data.isFirstLogin) {
          setStep('set-password');
          setMessage('Please set your password for first-time login');
        } else {
          setStep('login');
          setMessage('Please enter your password to login');
        }
      } else {
        setMessage(response.message || 'Error checking hotel status');
      }
    } catch (error) {
      console.error('Check hotel error:', error);
      setMessage(error.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetPassword = async (e) => {
    e.preventDefault();
    
    if (!formData.password) {
      setMessage('Please enter a password');
      return;
    }

    if (formData.password.length < 8) {
      setMessage('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await apiService.setPassword(formData.phone, formData.password);

      if (response.success) {
        setMessage('Password set successfully! You can now login.');
        setStep('login');
        setFormData(prev => ({ ...prev, password: '' }));
      } else {
        setMessage(response.message || 'Error setting password');
      }
    } catch (error) {
      console.error('Set password error:', error);
      setMessage(error.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleHotelLogin = async (e) => {
    e.preventDefault();
    
    if (!formData.password) {
      setMessage('Please enter your password');
      return;
    }

    setLoading(true);

    try {
      const response = await apiService.login(formData.phone, formData.password);

      if (response.success) {
        // Save phone if remember me is checked
        if (rememberMe) {
          localStorage.setItem('saved_phone', formData.phone);
        } else {
          localStorage.removeItem('saved_phone');
        }

        // Call the onLogin callback with user data
        onLogin({
          ...response.data,
          token: response.token,
          role: 'hotel'
        });
      } else {
        setMessage(response.message || 'Invalid credentials!');
      }
    } catch (error) {
      console.error('Hotel login error:', error);
      
      if (error.message.includes('timeout')) {
        setMessage('Request timeout. Please check your internet connection.');
      } else {
        setMessage(error.message || 'Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    
    if (!formData.phone || !formData.password) {
      setMessage('Please enter phone and password');
      return;
    }

    setLoading(true);

    try {
      const response = await apiService.login(formData.phone, formData.password);

      if (response.success && response.data.role === 'admin') {
        // Save phone if remember me is checked
        if (rememberMe) {
          localStorage.setItem('saved_phone', formData.phone);
        } else {
          localStorage.removeItem('saved_phone');
        }

        onLogin({
          ...response.data,
          token: response.token,
          role: 'admin'
        });
      } else {
        setMessage('Invalid admin credentials or insufficient permissions');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      setMessage(error.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
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
    <div className="animate-fade-in">
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
        <div className={`mb-4 p-3 rounded-xl flex items-start gap-2 ${
          message.includes('successfully') 
            ? 'bg-green-500/20 border border-green-500 text-green-200'
            : 'bg-red-500/20 border border-red-500 text-red-200'
        }`}>
          {message.includes('successfully') ? (
            <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          )}
          <span>{message}</span>
        </div>
      )}

      {hotelData && step !== 'initial' && (
        <div className="mb-4 p-3 bg-blue-500/20 border border-blue-500 rounded-xl text-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="font-bold">{hotelData.name?.charAt(0).toUpperCase() || 'H'}</span>
            </div>
            <div>
              <strong className="block">{hotelData.name}</strong>
              <span className="text-sm opacity-80">{hotelData.businessAddress}</span>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            {loginType === 'admin' ? 'Admin Phone' : 'Phone Number'} *
          </label>
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

        {(step === 'set-password' || step === 'login' || loginType === 'admin') && (
          <div>
            <label className="block text-sm font-medium mb-2">
              {step === 'set-password' ? 'Set Password' : 'Password'} *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={
                  step === 'set-password' 
                    ? 'Enter your new password (min 8 characters)' 
                    : 'Enter your password'
                }
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-red-600 transition-colors pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {step === 'set-password' && (
              <p className="text-xs text-white/50 mt-2">
                Password must be at least 8 characters long
              </p>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded bg-white/10 border-white/20 focus:ring-red-500 focus:ring-offset-0"
            />
            <span className="text-sm text-white/70">Remember me</span>
          </label>
          
          {step === 'login' && (
            <button
              type="button"
              onClick={() => {
                setStep('initial');
                setFormData(prev => ({ ...prev, password: '' }));
                setMessage('');
              }}
              className="text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              Use different phone
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl text-white font-bold text-lg hover:shadow-lg hover:shadow-red-600/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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