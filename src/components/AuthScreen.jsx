import React, { useState } from 'react';
import { ArrowLeft, Hotel } from 'lucide-react';
import ChoiceScreen from './ChoiceScreen';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function AuthScreen({ onBack, onLogin }) {
  const [authType, setAuthType] = useState(null);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-red-700 via-purple-900 to-black opacity-60"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(207,4,41,0.3),transparent_50%)]"></div>
      </div>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
      >
        <ArrowLeft size={24} />
        <span className="text-lg font-semibold">Back to Home</span>
      </button>

      {/* Split Screen Layout */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left Side - Choice Screen */}
        <div className="flex items-center justify-center p-8 lg:border-r border-white/10">
          <div className="max-w-md w-full">
            <ChoiceScreen onSelect={setAuthType} activeChoice={authType} />
          </div>
        </div>

        {/* Right Side - Login/Register Form */}
        <div className="flex items-center justify-center p-8">
          <div className="max-w-md w-full">
            {authType === null && (
              <div className="text-center">
                <Hotel size={64} className="mx-auto mb-4 text-red-500" />
                <p className="text-white/60 text-lg">
                  Select an option to continue
                </p>
              </div>
            )}
            {authType === 'login' && <LoginForm onLogin={onLogin} />}
            {authType === 'register' && <RegisterForm />}
          </div>
        </div>
      </div>
    </div>
  );
}