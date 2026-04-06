'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import PatientForm from '@/components/PatientForm';
import type { PatientData } from '@/lib/types';
import Link from 'next/link';

export default function TriagePage() {
  const [submittedPatient, setSubmittedPatient] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (patient: PatientData) => {
    setLoading(true);
    try {
      // Store patient data in sessionStorage for now
      sessionStorage.setItem('currentPatient', JSON.stringify(patient));
      setSubmittedPatient(patient);
      
      // Redirect to assessment page
      setTimeout(() => {
        window.location.href = `/assessment/${patient.id}`;
      }, 500);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {!submittedPatient ? (
          <>
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
                🏥 New Patient Triage
              </h1>
              <p className="text-slate-600 text-lg">Quick assessment following ESI Protocol</p>
            </div>
            <PatientForm onSubmitAction={handleFormSubmit} isLoading={loading} />
          </>
        ) : (
          <div className="rounded-xl bg-blue-50 p-12 text-center border-2 border-blue-300 shadow-md">
            <div className="inline-block">
              <div className="w-16 h-16 mx-auto mb-4 relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-green-600 animate-spin" 
                     style={{ WebkitMaskImage: 'conic-gradient(transparent 30%, black)' }}></div>
              </div>
            </div>
            <p className="text-xl font-bold text-slate-700">Processing patient data...</p>
            <p className="text-slate-600 mt-2">Redirecting to assessment page</p>
          </div>
        )}
        
        <div className="mt-12 text-center">
          <Link href="/" className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white font-bold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all">
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
