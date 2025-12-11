// [file name]: Dashboard.jsx

import React, { useState } from 'react';
import { 
  Settings, 
  Hotel, 
  TrendingUp, 
  Calendar, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import Operations from './Operations';
import Rooms from './Rooms';


export default function Dashboard({ onLogout, user }) {
  const [activeTab, setActiveTab] = useState('operations');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'operations', label: 'Operations', icon: Settings },
    { id: 'rooms', label: 'Rooms', icon: Hotel },
    { id: 'revenue', label: 'Revenue', icon: TrendingUp },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
  ];

  const handleLogout = () => {
    // Clear tokens from api service
    apiService.clearTokens();
    // Call parent logout handler
    onLogout();
  };
        const renderContent = () => {
            switch (activeTab) {
              case 'operations':
                return <Operations user={user} />;
              case 'rooms':
                return <Rooms user={user} />;
      case 'revenue':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Revenue Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-bold mb-2">Today's Revenue</h3>
                <p className="text-3xl font-bold text-green-500">₹0</p>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-bold mb-2">Monthly Revenue</h3>
                <p className="text-3xl font-bold text-red-500">₹0</p>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-bold mb-2">Occupancy Rate</h3>
                <p className="text-3xl font-bold text-blue-500">0%</p>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-bold mb-2">Total Bookings</h3>
                <p className="text-3xl font-bold text-purple-500">0</p>
              </div>
            </div>
          </div>
        );
      case 'bookings':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Bookings Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-bold mb-4">Today's Check-ins</h3>
                <div className="space-y-3">
                  {[1].map((item) => (
                    <div key={item} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="font-semibold">Room {item}0{item}</p>
                        <p className="text-white/60 text-sm">Guest Name</p>
                      </div>
                      <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-sm">2:00 PM</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-bold mb-4">Today's Check-outs</h3>
                <div className="space-y-3">
                  {[1, 2].map((item) => (
                    <div key={item} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="font-semibold">Room {item}</p>
                        <p className="text-white/60 text-sm">Guest Name</p>
                      </div>
                      <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-sm">11:00 AM</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-red-700 via-purple-900 to-black opacity-60"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(207,4,41,0.3),transparent_50%)]"></div>
      </div>

      <div className="relative z-10 flex h-screen">
        {/* Mobile Menu Button */}
        <button
          className="lg:hidden fixed top-6 left-6 z-50 text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-black/80 backdrop-blur-lg border-r border-white/10
          transform transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-6 border-b border-white/10">
            <div className="text-2xl font-bold">
              <span className="text-red-600">SSH</span>
              <span className="text-white"> Hotels</span>
            </div>
            <p className="text-white/60 text-sm mt-1">Partner Dashboard</p>
          </div>

          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    activeTab === item.id
                      ? 'bg-red-600 text-white'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}

            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-white/70 hover:bg-red-600/20 hover:text-white transition-all mt-8"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-black/50 backdrop-blur-lg border-b border-white/10 p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold capitalize">
                {menuItems.find(item => item.id === activeTab)?.label}
              </h1>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold">{user?.name || 'User'}</p>
                  <p className="text-white/60 text-sm">
                    {user?.email || user?.phone || 'user@sshhotels.in'}
                  </p>
                </div>
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="font-bold">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-auto p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}
