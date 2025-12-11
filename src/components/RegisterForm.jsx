import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import apiService from '../services/api';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    businessAddress: '',
    gst: '',
    aadhar: ''
  });

  const [files, setFiles] = useState({
    hygienePics: [],
    view360: []
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'Hotel name is required';
    else if (formData.name.trim().length < 2) errors.name = 'Hotel name must be at least 2 characters';
    
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    else if (!/^[0-9]{10,15}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = 'Please enter a valid phone number (10-15 digits)';
    }
    
    if (!formData.address.trim()) errors.address = 'Address is required';
    else if (formData.address.trim().length < 10) errors.address = 'Address must be at least 10 characters';
    
    if (!formData.businessAddress.trim()) errors.businessAddress = 'Business address is required';
    else if (formData.businessAddress.trim().length < 10) errors.businessAddress = 'Business address must be at least 10 characters';
    
    if (!formData.gst.trim()) errors.gst = 'GST number is required';
    else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gst.trim())) {
      errors.gst = 'Please enter a valid GST number';
    }
    
    if (!formData.aadhar.trim()) errors.aadhar = 'Aadhar number is required';
    else if (!/^[0-9]{12}$/.test(formData.aadhar.trim())) {
      errors.aadhar = 'Please enter a valid 12-digit Aadhar number';
    }
    
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
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setError('');
  };

  const handleFileChange = (e, fieldName) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Validate file types and sizes
    const validFiles = selectedFiles.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (!validTypes.includes(file.type)) {
        alert(`Invalid file type: ${file.name}. Only images are allowed.`);
        return false;
      }
      
      if (file.size > maxSize) {
        alert(`File too large: ${file.name}. Maximum size is 10MB.`);
        return false;
      }
      
      return true;
    });
    
    if (validFiles.length > 0) {
      setFiles(prev => ({
        ...prev,
        [fieldName]: [...prev[fieldName], ...validFiles].slice(0, 10) // Max 10 files
      }));
    }
    
    e.target.value = ''; // Reset file input
  };

  const removeFile = (fieldName, index) => {
    setFiles(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    setError('');
    setUploadProgress(0);

    try {
      // Create FormData for file upload
      const formDataObj = new FormData();
      
      // Add text fields
      Object.keys(formData).forEach(key => {
        formDataObj.append(key, formData[key].trim());
      });
      
      // Add files
      files.hygienePics.forEach((file, index) => {
        formDataObj.append('hygienePics', file);
      });
      
      files.view360.forEach((file, index) => {
        formDataObj.append('view360', file);
      });

      console.log("📤 Submitting registration with files:", {
        textData: formData,
        fileCounts: {
          hygienePics: files.hygienePics.length,
          view360: files.view360.length
        }
      });

      const response = await apiService.uploadHotelRegistration(
        formDataObj,
        (progress) => setUploadProgress(progress)
      );

      console.log("✅ Registration successful:", response);

      if (response.success) {
        setSubmitted(true);
      } else {
        setError(response.message || 'Error submitting form');
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      
      if (error.message.includes('timeout')) {
        setError('Request timeout. Please check your internet connection and try again.');
      } else if (error.message.includes('Network error')) {
        setError('Network error. Please check if the server is running.');
      } else {
        setError(error.message || 'Error submitting form. Please try again.');
      }
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  // Show success screen after submission
  if (submitted) {
    return (
      <div className="text-center animate-fade-in">
        <CheckCircle size={64} className="mx-auto mb-6 text-green-500 animate-bounce" />
        <h2 className="text-3xl font-bold mb-4">Application Received!</h2>
        <p className="text-white/70 mb-6 text-lg">
          Your details have been received and are under review. We will finish verification and reach out in 2 business days.
        </p>
        <div className="bg-white/10 rounded-xl p-6 mt-8 backdrop-blur-sm">
          <h3 className="text-xl font-bold mb-4">What's Next?</h3>
          <ul className="text-white/70 space-y-2 text-left">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Our team will verify your documents</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>We'll conduct a quick property inspection</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>You'll get access to your partner dashboard</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Start receiving bookings immediately after approval</span>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold mb-2">Become a Partner</h2>
      <p className="text-white/70 mb-6">Fill in your details to join us</p>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-xl text-red-200 flex items-start gap-2">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="mb-4 p-3 bg-blue-500/20 border border-blue-500 rounded-xl">
          <div className="flex justify-between items-center mb-1">
            <span className="text-blue-200 text-sm">Uploading files...</span>
            <span className="text-blue-200 text-sm">{Math.round(uploadProgress)}%</span>
          </div>
          <div className="w-full bg-blue-900/50 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form fields with validation */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Full Name *
            {validationErrors.name && (
              <span className="text-red-400 text-xs ml-2">{validationErrors.name}</span>
            )}
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-white/40 focus:outline-none transition-colors ${
              validationErrors.name ? 'border-red-500' : 'border-white/20 focus:border-red-600'
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Phone Number *
            {validationErrors.phone && (
              <span className="text-red-400 text-xs ml-2">{validationErrors.phone}</span>
            )}
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 9876543210"
            className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-white/40 focus:outline-none transition-colors ${
              validationErrors.phone ? 'border-red-500' : 'border-white/20 focus:border-red-600'
            }`}
          />
        </div>

        {/* Add similar validation for other fields */}

        <div>
          <label className="block text-sm font-medium mb-2">Hygiene Pictures of Rooms</label>
          <div className="space-y-3">
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileChange(e, 'hygienePics')}
                className="hidden"
                id="hygiene-upload"
                disabled={files.hygienePics.length >= 10}
              />
              <label
                htmlFor="hygiene-upload"
                className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-white cursor-pointer transition-colors ${
                  files.hygienePics.length >= 10
                    ? 'bg-gray-500/20 border-gray-500 cursor-not-allowed'
                    : 'bg-white/10 border border-white/20 hover:bg-white/20'
                }`}
              >
                <Upload size={20} />
                <span>
                  {files.hygienePics.length > 0 
                    ? `${files.hygienePics.length} file(s) selected (Max 10)` 
                    : 'Upload hygiene pictures (optional)'}
                </span>
              </label>
            </div>
            
            {files.hygienePics.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {files.hygienePics.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Hygiene ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-white/20"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile('hygienePics', index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 truncate">
                      {file.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Similar file upload for view360 */}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl text-white font-bold text-lg hover:shadow-lg hover:shadow-red-600/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500 rounded-xl text-blue-200 text-sm">
        💡 <strong>Important:</strong> Make sure all information is accurate. Inaccurate information may delay approval.
      </div>
    </div>
  );
}