'use client';

import { useState } from 'react';
import type { PatientData } from '@/lib/types';
import { COMMON_SYMPTOMS } from '@/lib/constants';

interface PatientFormProps {
  onSubmitAction: (data: PatientData) => void;
  isLoading?: boolean;
}

export default function PatientForm({ onSubmitAction, isLoading = false }: PatientFormProps) {
  const [formData, setFormData] = useState<Partial<PatientData>>({
    name: '',
    age: 0,
    gender: 'M',
    symptoms: [],
    medicalHistory: [],
    allergies: [],
    currentMedications: [],
    vitals: {
      heartRate: 0,
      bloodPressure: '',
      temperature: 0,
      respiratoryRate: 0,
      spO2: 95,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.age) {
      onSubmitAction({
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        ...formData,
      } as PatientData);
    }
  };

  const toggleSymptom = (symptom: string) => {
    setFormData((prev: Partial<PatientData>) => ({
      ...prev,
      symptoms: prev.symptoms?.includes(symptom)
        ? prev.symptoms.filter((s: string) => s !== symptom)
        : [...(prev.symptoms || []), symptom],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl bg-white p-8 shadow-xl border-2 border-blue-200">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Patient Intake Form</h2>

      {/* Basic Info */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-slate-700">Name</label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-lg border-2 border-blue-300 px-4 py-2 focus:border-blue-600 focus:outline-none transition"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700">Age</label>
          <input
            type="number"
            value={formData.age || ''}
            onChange={e => setFormData({ ...formData, age: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-lg border-2 border-blue-300 px-4 py-2 focus:border-blue-600 focus:outline-none transition"
            required
          />
        </div>
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-semibold text-slate-700">Gender</label>
        <select
          value={formData.gender || 'M'}
          onChange={e => setFormData({ ...formData, gender: e.target.value as 'M' | 'F' | 'Other' })}
          className="mt-1 block w-full rounded-lg border-2 border-green-300 px-4 py-2 focus:border-green-600 focus:outline-none transition"
        >
          <option value="M">Male</option>
          <option value="F">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Vitals */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="block text-sm font-semibold text-slate-700">❤️ Heart Rate (bpm)</label>
          <input
            type="number"
            value={formData.vitals?.heartRate || ''}
            onChange={e =>
              setFormData({
                ...formData,
                vitals: { ...formData.vitals!, heartRate: parseInt(e.target.value) },
              })
            }
            className="mt-1 block w-full rounded-lg border-2 border-blue-300 px-4 py-2 focus:border-blue-600 focus:outline-none transition"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700">🩸 Blood Pressure</label>
          <input
            type="text"
            placeholder="e.g., 120/80"
            value={formData.vitals?.bloodPressure || ''}
            onChange={e =>
              setFormData({
                ...formData,
                vitals: { ...formData.vitals!, bloodPressure: e.target.value },
              })
            }
            className="mt-1 block w-full rounded-lg border-2 border-blue-300 px-4 py-2 focus:border-blue-600 focus:outline-none transition"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700">🌡️ Temperature (°C)</label>
          <input
            type="number"
            step="0.1"
            value={formData.vitals?.temperature || ''}
            onChange={e =>
              setFormData({
                ...formData,
                vitals: { ...formData.vitals!, temperature: parseFloat(e.target.value) },
              })
            }
            className="mt-1 block w-full rounded-lg border-2 border-green-300 px-4 py-2 focus:border-green-600 focus:outline-none transition"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700">💨 Respiratory Rate</label>
          <input
            type="number"
            value={formData.vitals?.respiratoryRate || ''}
            onChange={e =>
              setFormData({
                ...formData,
                vitals: { ...formData.vitals!, respiratoryRate: parseInt(e.target.value) },
              })
            }
            className="mt-1 block w-full rounded-lg border-2 border-green-300 px-4 py-2 focus:border-green-600 focus:outline-none transition"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700">💙 SpO₂ (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={formData.vitals?.spO2 || ''}
            onChange={e =>
              setFormData({
                ...formData,
                vitals: { ...formData.vitals!, spO2: parseInt(e.target.value) },
              })
            }
            className="mt-1 block w-full rounded-lg border-2 border-blue-300 px-4 py-2 focus:border-blue-600 focus:outline-none transition"
          />
        </div>
      </div>

      {/* Symptoms */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-3">Select Symptoms</label>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {COMMON_SYMPTOMS.map((symptom: string) => (
            <button
              key={symptom}
              type="button"
              onClick={() => toggleSymptom(symptom)}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all border-2 ${
                formData.symptoms?.includes(symptom)
                  ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white border-blue-600 shadow-lg'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400'
              }`}
            >
              {symptom}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-green-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
      >
        {isLoading ? '⏳ Processing...' : '✓ Approve & Send'}
      </button>
    </form>
  );
}
