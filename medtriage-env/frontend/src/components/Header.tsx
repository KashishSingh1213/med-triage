'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b-2 border-blue-600 shadow-md">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🏥</span>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">MedTriage-Env</span>
          </Link>
          <nav className="hidden space-x-8 md:flex">
            <Link href="/" className="text-slate-600 hover:text-blue-600 font-semibold transition">
              Home
            </Link>
            <Link href="/triage" className="text-slate-600 hover:text-green-600 font-semibold transition">
              New Triage
            </Link>
            <Link href="/cases" className="text-slate-600 hover:text-blue-600 font-semibold transition">
              Cases
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
