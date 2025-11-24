import React, { useState } from 'react';
import { X } from 'lucide-react';
import ChoiceScreen from './ChoiceScreen';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function AuthModal({ onClose }) {
  const [authType, setAuthType] = useState(null);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors z-10"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          {authType === null && (
            <ChoiceScreen onSelect={setAuthType} />
          )}
          {authType === 'login' && (
            <LoginForm onBack={() => setAuthType(null)} />
          )}
          {authType === 'register' && (
            <RegisterForm onBack={() => setAuthType(null)} />
          )}
        </div>
      </div>
    </div>
  );
}