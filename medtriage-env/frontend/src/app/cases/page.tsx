'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';

interface Case {
  id: string;
  patient?: { name?: string; age?: number };
  patientId: string;
  status: string;
  createdAt: string;
  assessment?: { esiLevel?: number };
}

export default function CasesPage() {
  const [mockCases] = useState<Case[]>([
    { id: '1', patientId: '1', patient: { name: 'John Doe', age: 45 }, status: 'Completed', createdAt: new Date(Date.now() - 7200000).toISOString(), assessment: { esiLevel: 2 } },
    { id: '2', patientId: '2', patient: { name: 'Jane Smith', age: 38 }, status: 'In Progress', createdAt: new Date(Date.now() - 3600000).toISOString(), assessment: { esiLevel: 3 } },
    { id: '3', patientId: '3', patient: { name: 'Bob Johnson', age: 62 }, status: 'Completed', createdAt: new Date(Date.now() - 1800000).toISOString(), assessment: { esiLevel: 4 } },
  ]);
  
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCases = async () => {
      try {
        // Try to fetch from backend API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/triage/cases`);
        if (response.ok) {
          const json = await response.json();
          const apiCases = json.data?.filter((c: Case) => c.patient) || [];
          
          // Combine backend cases with mock cases for demo purposes
          if (apiCases.length > 0) {
            setCases([...apiCases, ...mockCases.slice(0, Math.max(0, 3 - apiCases.length))]);
          } else {
            setCases(mockCases);
          }
        } else {
          setCases(mockCases);
        }
      } catch (error) {
        console.log('Using mock cases as fallback');
        setCases(mockCases);
      } finally {
        setLoading(false);
      }
    };

    loadCases();
  }, []);

  // Status badge colors
  const statusColors = {
    'Completed': 'bg-green-100 text-green-800 border border-green-300',
    'In Progress': 'bg-blue-100 text-blue-800 border border-blue-300',
    'Pending': 'bg-amber-100 text-amber-800 border border-amber-300',
  };

  // ESI level badge colors
  const esiColors = {
    1: 'bg-red-100 text-red-900 border-2 border-red-400',
    2: 'bg-orange-100 text-orange-900 border-2 border-orange-400',
    3: 'bg-amber-100 text-amber-900 border-2 border-amber-400',
    4: 'bg-yellow-100 text-yellow-900 border-2 border-yellow-400',
    5: 'bg-green-100 text-green-900 border-2 border-green-400',
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
            📋 Triage Cases Management
          </h1>
          <p className="text-slate-600 text-lg">View and manage all patient triage assessments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 p-6 shadow-md hover:shadow-lg transition-shadow">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Total Cases</p>
            <p className="text-4xl font-bold text-blue-900 mt-2">{cases.length}</p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 p-6 shadow-md hover:shadow-lg transition-shadow">
            <p className="text-green-600 font-semibold text-sm uppercase tracking-wider">Completed</p>
            <p className="text-4xl font-bold text-green-900 mt-2">{cases.filter(c => c.status === 'Completed').length}</p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-300 p-6 shadow-md hover:shadow-lg transition-shadow">
            <p className="text-amber-600 font-semibold text-sm uppercase tracking-wider">In Progress</p>
            <p className="text-4xl font-bold text-amber-900 mt-2">{cases.filter(c => c.status === 'In Progress').length}</p>
          </div>
        </div>

        {/* Cases Table */}
        <div className="rounded-2xl bg-white border-2 border-blue-200 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
          <table className="w-full">
            {/* Header */}
            <thead className="bg-gradient-to-r from-blue-600 to-green-600">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-white">👤 Patient</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white">🎯 ESI Level</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white">⏱️ Status</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white">🕐 Time</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white">📌 Action</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-blue-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-600">
                    <div className="inline-flex items-center gap-2">
                      <div className="animate-spin h-5 w-5 text-blue-600"></div>
                      <span>Loading cases...</span>
                    </div>
                  </td>
                </tr>
              ) : cases.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-600">
                    <span>No cases found. Start a new triage assessment!</span>
                  </td>
                </tr>
              ) : (
                cases.map((caseItem, index) => (
                  <tr
                    key={caseItem.id}
                    className={`transition-all duration-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-blue-50'
                    } hover:bg-green-50 border-l-4 border-transparent hover:border-green-600`}
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                      {caseItem.patient?.name || `Patient ${caseItem.patientId}`}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`esi-card esi-card-${caseItem.assessment?.esiLevel || 3} inline-block px-4 py-2 text-sm font-bold rounded-lg ${
                          esiColors[(caseItem.assessment?.esiLevel || 3) as keyof typeof esiColors]
                        }`}
                      >
                        ESI {caseItem.assessment?.esiLevel || 3}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-4 py-2 text-sm font-semibold rounded-lg ${
                          statusColors[caseItem.status as keyof typeof statusColors]
                        }`}
                      >
                        {caseItem.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                      {new Date(caseItem.createdAt).toLocaleDateString()} {new Date(caseItem.createdAt).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Link
                        href={`/assessment/${caseItem.id}`}
                        className="px-4 py-2 rounded-lg font-bold bg-gradient-to-r from-blue-600 to-green-600 text-white hover:shadow-lg transform hover:scale-105 transition-all duration-200 inline-block"
                      >
                        View Details →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Info */}
        <div className="mt-8 rounded-xl bg-blue-50 border-2 border-blue-200 p-6">
          <p className="text-slate-700 text-sm">
            <span className="font-bold text-blue-600">💡 Tip:</span> Click on any case to view detailed assessment results and make clinical decisions.
          </p>
        </div>
      </main>
    </div>
  );
}
