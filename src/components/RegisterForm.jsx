// [file name]: RegisterForm.jsx

import React, { useState } from 'react';
import { Upload, CheckCircle } from 'lucide-react';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    businessAddress: '',
    gst: '',
    aadhar: '',
    hygienePics: [],
    view360: []
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleFileChange = (e, fieldName) => {
    const files = Array.from(e.target.files);
    setFormData({
      ...formData,
      [fieldName]: files
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log("📤 Form data being sent:", formData);
      
      // For now, let's test without files first to simplify
      const payload = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        businessAddress: formData.businessAddress,
        gst: formData.gst,
        aadhar: formData.aadhar,
        hygienePics: [],
        view360: []
      };

      console.log("🔄 Sending request to backend...");
      const response = await fetch('http://localhost:8000/api/hotels/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log("📥 Response status:", response.status);
      const result = await response.json();
      console.log("📥 Response data:", result);

      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.message || 'Error submitting form');
        alert('Error submitting form: ' + result.message);
      }
    } catch (error) {
      console.error('❌ Submission error:', error);
      setError('Network error. Please check if server is running.');
      alert('Error submitting form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show success screen after submission
  if (submitted) {
    return (
      <div className="text-center">
        <CheckCircle size={64} className="mx-auto mb-6 text-green-500" />
        <h2 className="text-3xl font-bold mb-4">Application Received!</h2>
        <p className="text-white/70 mb-6 text-lg">
          Your details have been received and are under review. We will finish verification and reach out in 2 business days.
        </p>
        <div className="bg-white/10 rounded-xl p-6 mt-8">
          <h3 className="text-xl font-bold mb-4">What's Next?</h3>
          <ul className="text-white/70 space-y-2 text-left">
            <li>• Our team will verify your documents</li>
            <li>• We'll conduct a quick property inspection</li>
            <li>• You'll get access to your partner dashboard</li>
            <li>• Start receiving bookings immediately after approval</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">Become a Partner</h2>
      <p className="text-white/70 mb-6">Fill in your details to join us</p>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-xl text-red-200">
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-red-600 transition-colors"
          />
        </div>

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

        <div>
          <label className="block text-sm font-medium mb-2">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your address"
            required
            rows="2"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-red-600 transition-colors resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Business Address</label>
          <textarea
            name="businessAddress"
            value={formData.businessAddress}
            onChange={handleChange}
            placeholder="Enter your business address"
            required
            rows="2"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-red-600 transition-colors resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">GST Number</label>
          <input
            type="text"
            name="gst"
            value={formData.gst}
            onChange={handleChange}
            placeholder="Enter GST number"
            required
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-red-600 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Aadhar Card Number</label>
          <input
            type="text"
            name="aadhar"
            value={formData.aadhar}
            onChange={handleChange}
            placeholder="Enter Aadhar number"
            required
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-red-600 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Hygiene Pictures of Rooms</label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileChange(e, 'hygienePics')}
              className="hidden"
              id="hygiene-upload"
            />
            <label
              htmlFor="hygiene-upload"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white cursor-pointer hover:bg-white/20 transition-colors"
            >
              <Upload size={20} />
              <span>
                {formData.hygienePics.length > 0 
                  ? `${formData.hygienePics.length} file(s) selected` 
                  : 'Upload hygiene pictures (optional)'}
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">360° View of Hotel</label>
          <div className="relative">
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={(e) => handleFileChange(e, 'view360')}
              className="hidden"
              id="360-upload"
            />
            <label
              htmlFor="360-upload"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white cursor-pointer hover:bg-white/20 transition-colors"
            >
              <Upload size={20} />
              <span>
                {formData.view360.length > 0 
                  ? `${formData.view360.length} file(s) selected` 
                  : 'Upload 360° view (optional)'}
            </span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl text-white font-bold text-lg hover:shadow-lg hover:shadow-red-600/50 transition-all duration-300 transform hover:scale-105 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500 rounded-xl text-blue-200 text-sm">
        💡 <strong>Testing Tip:</strong> Make sure your backend server is running on port 8000
      </div>
    </div>
  );
}
