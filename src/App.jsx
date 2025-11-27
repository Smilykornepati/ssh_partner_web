import React, { useState, useEffect } from 'react';
import { Hotel, Clock, Users, TrendingUp, CheckCircle, ArrowRight, Menu, X } from 'lucide-react';
import AuthScreen from './components/AuthScreen';
import Dashboard from './components/Dashboard';

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthScreen, setShowAuthScreen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // If user is logged in, show dashboard
  if (user) {
    return <Dashboard onLogout={handleLogout} />;
  }

  // If auth screen is active, show that
  if (showAuthScreen) {
    return <AuthScreen onBack={() => setShowAuthScreen(false)} onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Rest of the existing App.jsx content remains exactly the same */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-red-700 via-purple-900 to-black opacity-60"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(207,4,41,0.3),transparent_50%)]"></div>
      </div>

      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-lg border-b border-white/10' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold">
              <span className="text-red-600">SSH</span>
              <span className="text-white"> Hotels</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-white/80 hover:text-white transition-colors">Features</a>
              <a href="#benefits" className="text-white/80 hover:text-white transition-colors">Benefits</a>
              <a href="#how-it-works" className="text-white/80 hover:text-white transition-colors">How It Works</a>
              <a href="#contact" className="text-white/80 hover:text-white transition-colors">Contact</a>
            </div>

            <button 
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 flex flex-col gap-4">
              <a href="#features" className="text-white/80 hover:text-white transition-colors">Features</a>
              <a href="#benefits" className="text-white/80 hover:text-white transition-colors">Benefits</a>
              <a href="#how-it-works" className="text-white/80 hover:text-white transition-colors">How It Works</a>
              <a href="#contact" className="text-white/80 hover:text-white transition-colors">Contact</a>
            </div>
          )}
        </div>
      </nav>

      {/* Rest of the landing page content remains exactly the same */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-6 inline-block">
            <span className="px-4 py-2 rounded-full bg-red-900/30 border border-red-600/50 text-red-400 text-sm font-semibold">
              Partner Program
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Maximize Your Hotel's <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">
              Revenue Potential
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join SSH Hotels and unlock hourly bookings for co-living spaces, PGs, and hotels. 
            Maximize occupancy, increase revenue, and reach more customers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button 
              onClick={() => setShowAuthScreen(true)}
              className="group relative px-8 py-5 bg-gradient-to-r from-red-600 to-pink-600 rounded-full text-white font-bold text-lg shadow-2xl shadow-red-600/50 hover:shadow-red-600/70 transform hover:scale-105 transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started Now
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </span>
            </button>
            
            <button className="px-8 py-5 border-2 border-white/30 rounded-full text-white font-semibold text-lg hover:bg-white/10 transition-all duration-300">
              Learn More
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-16">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <div className="text-4xl font-bold text-red-500 mb-2">500+</div>
              <div className="text-white/70">Partner Hotels</div>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <div className="text-4xl font-bold text-red-500 mb-2">40%</div>
              <div className="text-white/70">Revenue Increase</div>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <div className="text-4xl font-bold text-red-500 mb-2">24/7</div>
              <div className="text-white/70">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Partner With Us?</h2>
            <p className="text-xl text-white/70">Unlock powerful features designed for your success</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Clock, title: 'Hourly Bookings', desc: 'Flexible hourly booking system to maximize room utilization' },
              { icon: TrendingUp, title: 'Increase Revenue', desc: 'Boost occupancy rates and earn more from existing inventory' },
              { icon: Users, title: 'Wide Reach', desc: 'Access to thousands of verified customers actively searching' },
              { icon: Hotel, title: 'Easy Management', desc: 'Intuitive dashboard to manage bookings and availability' }
            ].map((feature, idx) => (
              <div 
                key={idx}
                className="group bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-red-600/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-white/70">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="benefits" className="relative z-10 py-24 px-6 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Built for <span className="text-red-500">Modern Hotels</span>
              </h2>
              <p className="text-xl text-white/70 mb-8">
                Whether you run a co-living space, PG, or hotel, our platform is designed to help you succeed in the hourly booking market.
              </p>
              
              <div className="space-y-4">
                {[
                  'Zero commission for the first 3 months',
                  'Real-time booking management',
                  'Automated payment processing',
                  'Dedicated account manager',
                  'Marketing support included',
                  'Free training and onboarding'
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="text-red-500 mt-1 flex-shrink-0" size={24} />
                    <span className="text-lg text-white/90">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-red-900/20 to-purple-900/20 rounded-3xl p-8 backdrop-blur-lg border border-white/10">
                <div className="space-y-6">
                  <div className="bg-black/30 rounded-2xl p-6">
                    <div className="text-sm text-white/60 mb-2">Average Monthly Revenue</div>
                    <div className="text-3xl font-bold text-red-500">₹2,45,000</div>
                    <div className="text-sm text-green-400 mt-1">↑ 45% from last month</div>
                  </div>
                  <div className="bg-black/30 rounded-2xl p-6">
                    <div className="text-sm text-white/60 mb-2">Bookings This Month</div>
                    <div className="text-3xl font-bold">1,247</div>
                  </div>
                  <div className="bg-black/30 rounded-2xl p-6">
                    <div className="text-sm text-white/60 mb-2">Occupancy Rate</div>
                    <div className="text-3xl font-bold">87%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple Onboarding Process</h2>
            <p className="text-xl text-white/70">Get started in just 3 easy steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Register', desc: 'Sign up and provide your property details' },
              { step: '02', title: 'Setup', desc: 'Complete verification and list your rooms' },
              { step: '03', title: 'Go Live', desc: 'Start receiving bookings immediately' }
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-red-600/50 transition-all">
                  <div className="text-6xl font-bold text-red-500/20 mb-4">{item.step}</div>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-white/70">{item.desc}</p>
                </div>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="text-red-500" size={32} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-red-900/20 to-purple-900/20 rounded-3xl p-12 backdrop-blur-lg border border-white/10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Grow Your Business?
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Join hundreds of successful hotel partners already using SSH Hotels
            </p>
            
            <button 
              onClick={() => setShowAuthScreen(true)}
              className="group relative px-10 py-6 bg-gradient-to-r from-red-600 to-pink-600 rounded-full text-white font-bold text-xl shadow-2xl shadow-red-600/50 hover:shadow-red-600/70 transform hover:scale-105 transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-3">
                Start Your Partnership
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
              </span>
            </button>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold mb-4">
                <span className="text-red-600">SSH</span> Hotels
              </div>
              <p className="text-white/60">Revolutionizing hourly bookings for hotels, PGs, and co-living spaces.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <div className="space-y-2 text-white/60">
                <div>Features</div>
                <div>Pricing</div>
                <div>Dashboard</div>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <div className="space-y-2 text-white/60">
                <div>About Us</div>
                <div>Careers</div>
                <div>Contact</div>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <div className="space-y-2 text-white/60">
                <div>Privacy Policy</div>
                <div>Terms of Service</div>
                <div>Cookie Policy</div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-white/60">
            © 2024 SSH Hotels. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}