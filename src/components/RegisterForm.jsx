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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e, fieldName) => {
    const files = Array.from(e.target.files);
    setFormData({
      ...formData,
      [fieldName]: files
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registration Data:', formData);
    
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'hygienePics' || key === 'view360') {
        formData[key].forEach(file => {
          submitData.append(key, file);
        });
      } else {
        submitData.append(key, formData[key]);
      }
    });
    
    // Show success message
    setSubmitted(true);
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
              required
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
                  : 'Upload hygiene pictures'}
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
              required
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
                  : 'Upload 360° view'}
              </span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl text-white font-bold text-lg hover:shadow-lg hover:shadow-red-600/50 transition-all duration-300 transform hover:scale-105 mt-6"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
}