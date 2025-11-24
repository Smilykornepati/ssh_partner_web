import React from 'react';

export default function ChoiceScreen({ onSelect }) {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold mb-2">Welcome to SSH Hotels</h2>
      <p className="text-white/70 mb-8">Choose an option to continue</p>

      <div className="space-y-4">
        <button
          onClick={() => onSelect('login')}
          className="w-full py-4 px-6 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl text-white font-bold text-lg hover:shadow-lg hover:shadow-red-600/50 transition-all duration-300 transform hover:scale-105"
        >
          Already a Partner?
        </button>

        <button
          onClick={() => onSelect('register')}
          className="w-full py-4 px-6 border-2 border-white/30 rounded-xl text-white font-bold text-lg hover:bg-white/10 transition-all duration-300"
        >
          Become a New Partner
        </button>
      </div>
    </div>
  );
}