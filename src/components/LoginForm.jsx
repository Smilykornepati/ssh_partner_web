import React, { useState } from 'react';

export default function LoginForm({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check for admin credentials
    if (formData.email === 'admin@sshhotels.in' && formData.password === 'Smily@2003') {
      // Call the onLogin callback to redirect to dashboard
      onLogin({
        email: formData.email,
        name: 'Admin User',
        role: 'admin'
      });
    } else {
      console.log('Login Data:', formData);
      alert('Invalid credentials! Please try again.');
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">Partner Login</h2>
      <p className="text-white/70 mb-6">Sign in to your partner account</p>

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl text-white font-bold text-lg hover:shadow-lg hover:shadow-red-600/50 transition-all duration-300 transform hover:scale-105"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}