'use client';

import Header from '@/components/Header';
import Link from 'next/link';
import { ESI_LEVELS } from '@/lib/constants';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section - Premium Design */}
        <section className="relative py-20 sm:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  ✨ AI Medical Intelligence
                </div>
                <h1 className="text-5xl sm:text-6xl font-black text-slate-900 leading-tight">
                  Smart <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Medical Triage</span> System
                </h1>
              </div>
              
              <p className="text-xl text-slate-700 leading-relaxed">
                Powered by advanced AI, our triage system instantly analyzes patient symptoms and vital signs to provide accurate ESI prioritization for emergency departments.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Link href="/triage" className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-300">
                  <span className="relative z-10">🚀 Start Assessment</span>
                </Link>
                
                <Link href="/cases" className="px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl hover:from-blue-500 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300">
                  📋 View Cases
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-600">
                  <p className="text-2xl font-bold text-blue-600">99.2%</p>
                  <p className="text-sm text-slate-700">Accuracy</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-600">
                  <p className="text-2xl font-bold text-green-600">&lt;5s</p>
                  <p className="text-sm text-slate-700">Analysis Time</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-600">
                  <p className="text-2xl font-bold text-blue-600">24/7</p>
                  <p className="text-sm text-slate-700">Available</p>
                </div>
              </div>
            </div>

            {/* Illustration */}
            <div className="hidden lg:block relative">
              <div className="relative w-full h-96 bg-gradient-to-br from-blue-400 to-green-500 rounded-3xl shadow-2xl opacity-90"></div>
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-gradient-to-br from-blue-300 to-green-400 rounded-3xl shadow-lg opacity-40 blur-2xl"></div>
              <div className="absolute -top-8 -left-8 w-48 h-48 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-3xl shadow-lg opacity-30 blur-2xl"></div>
            </div>
          </div>
        </section>

        {/* Key Features - Modern Grid */}
        <section className="py-20 border-y border-blue-200">
          <h2 className="text-4xl font-bold text-center mb-12 text-slate-900">Why Choose MedTriage-Env?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-2 border-blue-200 hover:border-blue-600">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">AI-Powered</h3>
              <p className="text-slate-700">Advanced ML algorithms analyze complex patient presentations instantly</p>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-2 border-green-200 hover:border-green-600">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Real-Time</h3>
              <p className="text-slate-700">Instant ESI level assignment and priority recommendations</p>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-2 border-blue-200 hover:border-blue-600">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Evidence-Based</h3>
              <p className="text-slate-700">Based on proven ESI triage protocol for consistency</p>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-2 border-green-200 hover:border-green-600">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Reliable</h3>
              <p className="text-slate-700">99.2% accuracy with continuous learning and improvement</p>
            </div>
          </div>
        </section>

        {/* ESI Levels Showcase */}
        <section className="py-20">
          <h2 className="text-4xl font-bold text-center mb-12 text-slate-900">ESI Triage Level System</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.entries(ESI_LEVELS).map(([level, info]: [string, any]) => {
              const colors: any = {
                1: { bg: 'from-red-500 via-red-600 to-red-700', light: 'bg-red-50', icon: '🚨', accent: 'ring-red-500' },
                2: { bg: 'from-orange-500 via-orange-600 to-orange-700', light: 'bg-orange-50', icon: '⚠️', accent: 'ring-orange-500' },
                3: { bg: 'from-amber-500 via-amber-600 to-amber-700', light: 'bg-amber-50', icon: '🔔', accent: 'ring-amber-500' },
                4: { bg: 'from-yellow-500 via-yellow-600 to-yellow-700', light: 'bg-yellow-50', icon: '📋', accent: 'ring-yellow-500' },
                5: { bg: 'from-green-500 via-green-600 to-green-700', light: 'bg-green-50', icon: '✓', accent: 'ring-green-500' },
              };
              const color = colors[level];

              return (
                <div key={level} className="group cursor-pointer">
                  <div className={`relative rounded-2xl bg-gradient-to-br ${color.bg} p-8 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 h-full flex flex-col items-center justify-center text-center ring-2 ring-white`}>
                    <div className="text-6xl mb-3 transform group-hover:scale-110 transition-transform duration-300">{color.icon}</div>
                    <div className="text-sm font-semibold opacity-90 uppercase tracking-widest mb-1">Level</div>
                    <h3 className="text-4xl font-black mb-2">{level}</h3>
                    <p className="text-white font-bold text-lg leading-tight mb-3">{info.label}</p>
                    <p className="text-white/90 text-xs leading-relaxed">{info.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Medical Imagery Grid - Collage */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 my-20 rounded-3xl border-2 border-blue-200">
          <h2 className="text-4xl font-bold text-center mb-12 text-slate-900">Healthcare Excellence</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Large featured image */}
            <div className="md:col-span-2 lg:col-span-2 lg:row-span-2 group">
              <div className="relative w-full h-96 rounded-3xl shadow-2xl overflow-hidden cursor-pointer hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                <img 
                  src="https://images.unsplash.com/photo-1631217314831-c6227db76b6e?w=800&q=80" 
                  alt="Modern Emergency Care" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/40 to-green-600/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <p className="text-3xl font-bold drop-shadow-lg">Modern Emergency Care</p>
                    <p className="text-sm opacity-90 mt-2 drop-shadow">State-of-the-art facilities</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Expert Team */}
            <div className="group cursor-pointer">
              <div className="relative w-full h-48 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80" 
                  alt="Expert Team" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-green-600/40 to-emerald-600/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <p className="font-bold text-sm drop-shadow-lg">Expert Team</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-time Data */}
            <div className="group cursor-pointer">
              <div className="relative w-full h-48 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1579154204601-01d430c07b71?w=400&q=80" 
                  alt="Real-time Data" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/40 to-cyan-600/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <p className="font-bold text-sm drop-shadow-lg">Real-time Data</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 24/7 Response */}
            <div className="group cursor-pointer">
              <div className="relative w-full h-48 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1590674899484-201ef762ced7?w=400&q=80" 
                  alt="24/7 Response" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-red-600/40 to-pink-600/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <p className="font-bold text-sm drop-shadow-lg">24/7 Response</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Tech */}
            <div className="group cursor-pointer">
              <div className="relative w-full h-48 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1576091160563-112d4d3f5b15?w=400&q=80" 
                  alt="Advanced Tech" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/40 to-indigo-600/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <p className="font-bold text-sm drop-shadow-lg">Advanced Tech</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Care */}
            <div className="group cursor-pointer">
              <div className="relative w-full h-48 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1576091160597-112173faf977?w=400&q=80" 
                  alt="Patient Care" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/40 to-amber-600/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <p className="font-bold text-sm drop-shadow-lg">Patient Care</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works - Step by Step */}
        <section className="py-20 bg-blue-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 my-20 rounded-3xl border-2 border-blue-200">
          <h2 className="text-4xl font-bold text-center mb-12 text-slate-900">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: 1, title: 'Patient Intake', desc: 'Enter patient data and collect vital signs', icon: '📝' },
              { num: 2, title: 'AI Analysis', desc: 'Advanced AI evaluates symptoms and vitals', icon: '🧠' },
              { num: 3, title: 'ESI Assignment', desc: 'Automatic ESI level and priority determination', icon: '📊' },
              { num: 4, title: 'Clinical Review', desc: 'Doctor confirms or adjusts assignment', icon: '👨‍⚕️' },
            ].map((step) => (
              <div key={step.num} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg border-t-4 border-green-600 h-full flex flex-col items-center text-center">
                  <div className="text-5xl mb-4">{step.icon}</div>
                  <div className="inline-block w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-green-600 text-white font-bold flex items-center justify-center mb-4 text-xl">
                    {step.num}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-700 text-sm">{step.desc}</p>
                </div>
                {step.num < 4 && (
                  <div className="hidden lg:flex justify-center pt-4">
                    <div className="w-1 h-12 bg-gradient-to-b from-blue-600 to-green-600"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="relative bg-gradient-to-r from-blue-600 via-green-600 to-blue-700 rounded-3xl overflow-hidden shadow-2xl">
            {/* Background blur effects */}
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 py-16 px-8 sm:px-12 text-center">
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">Ready to Transform Your ER?</h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Start using AI-powered triage today and improve patient outcomes while reducing wait times.
              </p>
              <Link href="/triage" className="inline-block px-10 py-4 bg-white text-blue-600 font-bold text-lg rounded-xl hover:bg-blue-50 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                🚀 Begin Your First Assessment
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900 text-white mt-20 py-12 border-t-4 border-blue-600">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-lg mb-4 text-blue-400">MedTriage-Env</h3>
                <p className="text-slate-400 text-sm">Advanced AI-powered medical triage system for emergency departments.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-green-400">Product</h4>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li><Link href="/triage" className="hover:text-green-400 transition">Triage System</Link></li>
                  <li><Link href="/cases" className="hover:text-green-400 transition">Case History</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-blue-400">Features</h4>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li><a href="#" className="hover:text-blue-400 transition">AI Analysis</a></li>
                  <li><a href="#" className="hover:text-blue-400 transition">Real-time Priority</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-green-400">Support</h4>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li><a href="#" className="hover:text-green-400 transition">Documentation</a></li>
                  <li><a href="#" className="hover:text-green-400 transition">Contact Us</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-800 pt-8">
              <p className="text-center text-slate-400 text-sm">© 2026 MedTriage-Env. All rights reserved. | Advanced Medical Triage System</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
