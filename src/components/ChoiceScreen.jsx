import React from 'react';

export default function ChoiceScreen({ onSelect, activeChoice }) {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold mb-2">Welcome to SSH Hotels</h2>
      <p className="text-white/70 mb-8">Choose an option to continue</p>

      <div className="space-y-4">
        <button
          onClick={() => onSelect('login')}
          className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
            activeChoice === 'login'
              ? 'bg-gradient-to-r from-red-600 to-pink-600 shadow-lg shadow-red-600/50'
              : 'bg-gradient-to-r from-red-600/50 to-pink-600/50 hover:from-red-600 hover:to-pink-600'
          }`}
        >
          Already a Partner?
        </button>

        <button
          onClick={() => onSelect('register')}
          className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg transition-all duration-300 ${
            activeChoice === 'register'
              ? 'bg-white/20 border-2 border-red-600'
              : 'border-2 border-white/30 hover:bg-white/10'
          }`}
        >
          Become a New Partner
        </button>
      </div>
    </div>
  );
}