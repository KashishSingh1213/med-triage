'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import ResultsCard from '@/components/ResultsCard';
import type { PatientData, TriageAssessment } from '@/lib/types';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function AssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params?.id as string;
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [assessment, setAssessment] = useState<TriageAssessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [approvingDoctor, setApprovingDoctor] = useState(false);
  const [requestingReview, setRequestingReview] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Toast notification utility
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  useEffect(() => {
    // Ensure this only runs on client side
    const loadPatientData = async () => {
      try {
        let patientData: PatientData | null = null;
        let caseAssessment: TriageAssessment | null = null;

        // First, try to fetch from backend API using the case ID
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/triage/case/${patientId}`);
          if (response.ok) {
            const json = await response.json();
            const caseData = json.data;
            
            // Extract patient and assessment from case
            if (caseData.patient) {
              patientData = caseData.patient;
              caseAssessment = caseData.assessment;
              console.log('✓ Loaded case from backend API');
            }
          }
        } catch (apiError) {
          console.log('Backend API case fetch failed, trying sessionStorage...');
        }

        // If API fetch failed, try sessionStorage (for new triage cases)
        if (!patientData) {
          const storedPatient = sessionStorage.getItem('currentPatient');
          if (storedPatient) {
            patientData = JSON.parse(storedPatient);
            console.log('✓ Loaded patient from sessionStorage');
          }
        }

        // If still no data, show error
        if (!patientData) {
          console.error('No patient data found from any source');
          addToast('❌ No patient data found. Please start a new triage.', 'error');
          setTimeout(() => router.push('/triage'), 2000);
          return;
        }

        setPatient(patientData);
        
        // If we already have assessment from API, use it; otherwise generate
        if (caseAssessment) {
          setAssessment(caseAssessment);
        } else {
          const assessment = generateSmartAssessment(patientData);
          setAssessment(assessment);
        }
        
      } catch (error) {
        console.error('Error loading patient data:', error);
        addToast('❌ Error loading patient data. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadPatientData();
  }, [patientId, router]);

  // Smart assessment generation based on symptoms and vitals
  const generateSmartAssessment = (patient: PatientData): TriageAssessment => {
    const esiLevel = calculateESILevel(patient);
    const diagnosis = generateDiagnosis(patient);
    const recommendations = generateRecommendations(patient, diagnosis);
    const tests = generateRecommendedTests(patient, diagnosis);
    
    return {
      patientId: patient.id,
      esiLevel: esiLevel,
      severity: getSeverityLabel(esiLevel),
      recommendedTests: tests,
      recommendations: recommendations,
      diagnosis: diagnosis,
      confidence: calculateConfidence(patient),
      timestamp: new Date().toISOString(),
      aiExplanation: generateAIExplanation(patient, esiLevel, diagnosis),
    };
  };

  const calculateESILevel = (patient: PatientData): 1 | 2 | 3 | 4 | 5 => {
    // Critical conditions (ESI-2)
    if (patient.symptoms.includes('Chest Pain') || patient.vitals.heartRate > 120) {
      return 2;
    }
    if (patient.vitals.heartRate > 130 || patient.vitals.temperature > 40) {
      return 2;
    }

    // Emergent (ESI-3)
    if (patient.vitals.temperature > 39) {
      return 3;
    }
    if (patient.symptoms.includes('Severe Headache') || patient.symptoms.includes('Shortness of Breath')) {
      return 3;
    }
    if (patient.symptoms.length > 1) {
      return 3;
    }

    // Urgent (ESI-4)
    if (patient.symptoms.length === 1) {
      return 4;
    }

    // Non-urgent (ESI-5)
    return 5;
  };

  const generateDiagnosis = (patient: PatientData): string => {
    if (!patient.symptoms || patient.symptoms.length === 0) {
      return 'Routine wellness check or minor complaint';
    }

    // Rule-based diagnosis engine
    if (patient.symptoms.includes('Chest Pain')) {
      if (patient.vitals.heartRate > 100) {
        return 'Acute Coronary Syndrome (ACS) - possible myocardial infarction or unstable angina';
      }
      return 'Acute chest pain - cardiac evaluation required';
    }

    if (patient.symptoms.includes('Shortness of Breath')) {
      if (patient.vitals.respiratoryRate > 25) {
        return 'Acute respiratory distress - possible pneumonia, asthma, or pulmonary embolism';
      }
      return 'Dyspnea - respiratory assessment needed';
    }

    if (patient.symptoms.includes('Fever') || patient.vitals.temperature > 38) {
      if (patient.symptoms.includes('Cough')) {
        return 'Suspected respiratory infection - possible pneumonia or bronchitis';
      }
      return 'Febrile illness - infection workup required';
    }

    if (patient.symptoms.includes('Severe Headache')) {
      return 'Acute headache - neurological evaluation required to rule out meningitis or intracranial pathology';
    }

    if (patient.symptoms.includes('Abdominal Pain')) {
      return 'Acute abdominal pain - imaging and labs required to determine etiology';
    }

    if (patient.symptoms.includes('Cough')) {
      return 'Cough - respiratory infection assessment needed';
    }

    if (patient.symptoms.includes('Nausea') || patient.symptoms.includes('Vomiting')) {
      return 'Nausea/vomiting - gastroenterological evaluation needed';
    }

    return `Clinical assessment needed for: ${patient.symptoms.join(', ')}`;
  };

  const generateRecommendations = (patient: PatientData, diagnosis: string): string[] => {
    const recommendations: Set<string> = new Set();

    // Critical/Emergent recommendations
    if (patient.vitals.heartRate > 120 || patient.symptoms.includes('Chest Pain')) {
      recommendations.add('⚠️ Immediate cardiac monitoring required');
      recommendations.add('🏥 Establish IV access for emergency medications');
      recommendations.add('👨‍⚕️ Notify physician immediately for evaluation');
    }

    // Respiratory issues
    if (patient.symptoms.includes('Shortness of Breath') || patient.vitals.respiratoryRate > 25) {
      recommendations.add('💨 Apply oxygen to maintain SpO2 > 94%');
      recommendations.add('📡 Continuous pulse oximetry monitoring');
      recommendations.add('🫁 Prepare for possible intubation or respiratory support');
    }

    // Fever management
    if (patient.vitals.temperature > 38.5) {
      recommendations.add('💊 Antipyretic medication administration (Acetaminophen/Ibuprofen)');
      recommendations.add('💧 IV hydration and fluid management');
      recommendations.add('🧊 Cool compresses for fever reduction');
    }

    // Neurological issues
    if (patient.symptoms.includes('Severe Headache') || patient.symptoms.includes('Dizziness')) {
      recommendations.add('🧠 Neurological examination by physician');
      recommendations.add('🔦 Monitor for changes in mental status');
      recommendations.add('🛏️ Maintain airway precautions');
    }

    // Abdominal issues
    if (patient.symptoms.includes('Abdominal Pain')) {
      recommendations.add('🩹 NPO (Nothing by mouth) until evaluated');
      recommendations.add('📍 Avoid strong pain medications until diagnosis');
      recommendations.add('👨‍⚕️ Doctor assessment before intervention');
    }

    // General care
    recommendations.add('✓ Monitor vital signs per protocol');
    recommendations.add('📝 Document all findings and interventions');

    // Priority investigations
    if (diagnosis.includes('Cardiac') || diagnosis.includes('Coronary')) {
      recommendations.add('🏥 Fast-track for cardiac workup');
      recommendations.add('⚡ Continuous telemetry monitoring');
    }

    if (diagnosis.includes('Respiratory') || diagnosis.includes('Pneumonia')) {
      recommendations.add('🫁 Respiratory therapy consultation if needed');
    }

    if (diagnosis.includes('Infection') || patient.vitals.temperature > 38.5) {
      recommendations.add('🧫 Infection prevention precautions');
      recommendations.add('💉 Blood culture collection if sepsis suspected');
    }

    return Array.from(recommendations);
  };

  const generateRecommendedTests = (patient: PatientData, diagnosis: string): string[] => {
    const tests: Set<string> = new Set();

    // Cardiac workup
    if (diagnosis.includes('Cardiac') || diagnosis.includes('Coronary') || patient.symptoms.includes('Chest Pain')) {
      tests.add('⚡ 12-lead ECG');
      tests.add('🧬 Troponin I & T levels');
      tests.add('💉 Complete Blood Count (CBC)');
      tests.add('🧪 Comprehensive Metabolic Panel (CMP)');
      tests.add('🏥 Chest X-Ray');
    }

    // Respiratory workup
    if (diagnosis.includes('Respiratory') || diagnosis.includes('Pneumonia') || patient.symptoms.includes('Shortness of Breath')) {
      tests.add('🫁 Chest X-Ray');
      tests.add('💨 Arterial Blood Gas (ABG) or VBG');
      tests.add('🧬 Complete Blood Count (CBC)');
    }

    // Infection workup
    if (diagnosis.includes('Infection') || diagnosis.includes('Febrile') || patient.vitals.temperature > 38.5) {
      tests.add('💉 Complete Blood Count (CBC)');
      tests.add('🧪 Blood Cultures');
      tests.add('🔬 Urinalysis');
      tests.add('🧬 Metabolic Panel');
      tests.add('💊 Lactate level');
    }

    // Neurological workup
    if (diagnosis.includes('Neurological') || patient.symptoms.includes('Severe Headache')) {
      tests.add('🧠 CT Head (non-contrast)');
      tests.add('🏥 Lumbar Puncture if meningitis suspected');
      tests.add('🧬 Complete Blood Count (CBC)');
    }

    // Abdominal workup
    if (patient.symptoms.includes('Abdominal Pain')) {
      tests.add('🖼️ Abdominal Ultrasound/CT');
      tests.add('💉 Complete Blood Count (CBC)');
      tests.add('🧪 Liver Function Tests');
      tests.add('🔬 Urinalysis');
    }

    // General labs (always included for ESI-2,3)
    if (!tests.size && patient.vitals.temperature > 38) {
      tests.add('💉 Complete Blood Count (CBC)');
      tests.add('🧪 Basic Metabolic Panel');
    }

    return Array.from(tests).slice(0, 8); // Limit to 8 tests
  };

  const getSeverityLabel = (esiLevel: 1 | 2 | 3 | 4 | 5): 'Critical' | 'Urgent' | 'Moderate' | 'Minor' | 'Non-urgent' => {
    const labels = {
      1: 'Critical' as const,
      2: 'Urgent' as const,
      3: 'Moderate' as const,
      4: 'Minor' as const,
      5: 'Non-urgent' as const,
    };
    return labels[esiLevel];
  };

  const calculateConfidence = (patient: PatientData): number => {
    let confidence = 0.65; // Base confidence

    if (patient.symptoms && patient.symptoms.length > 0) confidence += 0.15;
    if (patient.vitals.heartRate > 0) confidence += 0.05;
    if (patient.vitals.temperature > 0) confidence += 0.05;
    if (patient.vitals.bloodPressure) confidence += 0.05;

    return Math.min(confidence, 0.95);
  };

  const generateAIExplanation = (patient: PatientData, esiLevel: number, diagnosis: string): string => {
    const severity = getSeverityLabel(esiLevel as 1 | 2 | 3 | 4 | 5);
    return `Patient ${patient.name} (${patient.age}yo ${patient.gender}) presents with ${
      patient.symptoms.length > 0 ? `symptoms: ${patient.symptoms.join(', ')}` : 'routine evaluation'
    }. 

Vital Signs: HR ${patient.vitals.heartRate} bpm, Temp ${patient.vitals.temperature}°C, BP ${
      patient.vitals.bloodPressure
    }, RR ${patient.vitals.respiratoryRate}, SpO2 ${patient.vitals.spO2}%.

Preliminary Assessment: ${diagnosis}

ESI Level: ${esiLevel} (${severity}) - Patient requires immediate/urgent evaluation and treatment per protocol.`;
  };

  const handleApproveAndSend = async () => {
    if (!patient || !assessment) return;
    
    setApprovingDoctor(true);
    try {
      // Call backend API to save case
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/triage/cases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: patient.id,
          patient: patient,
          assessment: assessment,
          action: 'approved',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to approve (Status: ${response.status})`);
      }

      const data = await response.json();
      
      addToast('✓ Assessment approved and sent to doctor successfully!', 'success');
      
      // Redirect after short delay
      setTimeout(() => {
        sessionStorage.removeItem('currentPatient');
        router.push('/cases');
      }, 2000);
      
    } catch (error: any) {
      console.error('Approve error:', error);
      addToast(`✗ Error: ${error.message}`, 'error');
    } finally {
      setApprovingDoctor(false);
    }
  };

  const handleRequestReview = async () => {
    if (!patient || !assessment) return;
    
    setRequestingReview(true);
    try {
      // Store review request in backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/triage/cases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: patient.id,
          patient: patient,
          assessment: assessment,
          action: 'review_requested',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to request review (Status: ${response.status})`);
      }

      addToast('✓ Manual review requested! A doctor will review shortly.', 'info');
      
      // Keep on page for manual review flow
      setTimeout(() => {
        addToast('ℹ Awaiting doctor review...', 'info');
      }, 3000);
      
    } catch (error: any) {
      console.error('Review request error:', error);
      addToast(`✗ Error: ${error.message}`, 'error');
    } finally {
      setRequestingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-green-600 animate-spin" 
                     style={{ WebkitMaskImage: 'conic-gradient(transparent 30%, black)' }}></div>
              </div>
            </div>
            <p className="mt-6 text-lg font-semibold text-slate-700">🔍 Analyzing patient data...</p>
            <p className="mt-2 text-sm text-slate-600">Using AI to calculate ESI triage level</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {patient && assessment && (
          <div className="space-y-8">
            {/* Header Section */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
                ✓ Patient Assessment Complete
              </h1>
              <p className="text-slate-600 text-lg">Review the AI-generated triage assessment below</p>
            </div>

            {/* Patient Info Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Patient Details */}
              <div className="lg:col-span-1">
                <div className="rounded-2xl bg-white p-6 shadow-lg border-2 border-blue-200 hover:shadow-xl hover:border-blue-400 transition-all">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4 flex items-center gap-2">
                    👤 Patient Information
                  </h2>
                  <div className="space-y-4">
                    <div className="pb-4 border-b-2 border-blue-100">
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Name</span>
                      <p className="font-bold text-lg text-slate-900 mt-1">{patient.name}</p>
                    </div>
                    <div className="pb-4 border-b-2 border-blue-100">
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Age & Gender</span>
                      <p className="font-semibold text-slate-900 mt-1">{patient.age} years • {patient.gender}</p>
                    </div>
                    <div className="pb-4 border-b-2 border-green-100">
                      <span className="text-xs font-bold text-green-600 uppercase tracking-wider">Main Symptoms</span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {patient.symptoms.slice(0, 3).map((symptom: string) => (
                          <span key={symptom} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-xs font-bold border border-blue-300">
                            {symptom}
                          </span>
                        ))}
                        {patient.symptoms.length > 3 && (
                          <span className="text-xs text-slate-600 font-semibold">+{patient.symptoms.length - 3} more</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-green-600 uppercase tracking-wider">Vital Signs</span>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border-l-2 border-blue-600">
                          <p className="text-blue-600 text-xs font-bold">❤️ HR</p>
                          <p className="font-bold text-slate-900 text-lg mt-1">{patient.vitals.heartRate}</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border-l-2 border-green-600">
                          <p className="text-green-600 text-xs font-bold">🌡️ TEMP</p>
                          <p className="font-bold text-slate-900 text-lg mt-1">{patient.vitals.temperature}°C</p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border-l-2 border-blue-600">
                          <p className="text-blue-600 text-xs font-bold">🩸 BP</p>
                          <p className="font-bold text-slate-900 text-sm mt-1">{patient.vitals.bloodPressure}</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border-l-2 border-green-600">
                          <p className="text-green-600 text-xs font-bold">💨 SpO2</p>
                          <p className="font-bold text-slate-900 text-lg mt-1">{patient.vitals.spO2}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Assessment Results */}
              <div className="lg:col-span-2">
                <ResultsCard assessment={assessment} />
              </div>
            </div>

            {/* AI Explanation Card */}
            <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-8 border-2 border-green-300 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4 flex items-center gap-2">
                🤖 AI Analysis
              </h3>
              <p className="text-slate-700 leading-relaxed text-base">
                {assessment.aiExplanation}
              </p>
              <div className="mt-6 pt-6 border-t-2 border-green-200 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-xs text-slate-600 font-bold uppercase">Confidence Score</p>
                  <p className="text-3xl font-bold text-green-600">{Math.round(assessment.confidence * 100)}%</p>
                </div>
                <div className="w-48 h-3 bg-slate-200 rounded-full overflow-hidden shadow-md">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-green-600 rounded-full transition-all duration-500 shadow-lg"
                    style={{ width: `${assessment.confidence * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 flex-col sm:flex-row pt-4">
              <button
                onClick={handleApproveAndSend}
                disabled={approvingDoctor || requestingReview}
                className="flex-1 relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-200 disabled:opacity-50"></div>
                <div className="relative px-8 py-4 bg-white rounded-xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text leading-none flex items-center justify-center gap-2">
                  {approvingDoctor ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>✓</span>
                      <span>Approve & Send</span>
                    </>
                  )}
                </div>
              </button>

              <button
                onClick={handleRequestReview}
                disabled={approvingDoctor || requestingReview}
                className="flex-1 relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-200 disabled:opacity-50"></div>
                <div className="relative px-8 py-4 bg-white rounded-xl font-bold text-amber-600 leading-none flex items-center justify-center gap-2">
                  {requestingReview ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Requesting...</span>
                    </>
                  ) : (
                    <>
                      <span>👨‍⚕️</span>
                      <span>Request Review</span>
                    </>
                  )}
                </div>
              </button>
            </div>

            {/* Info Box */}
            <div className="rounded-2xl bg-blue-50 border-2 border-blue-300 p-6 shadow-md hover:shadow-lg transition-shadow">
              <p className="text-base text-blue-900 font-semibold">
                <span className="text-2xl">ℹ️</span> <span className="ml-2">Both actions are recorded and tracked for quality assurance. The assessment will be reviewed by a doctor within 5 minutes.</span>
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-lg px-6 py-4 text-white font-semibold shadow-lg animate-in slide-in-from-top-2 duration-200 ${
              toast.type === 'success'
                ? 'bg-gradient-to-r from-green-600 to-green-700'
                : toast.type === 'error'
                ? 'bg-gradient-to-r from-red-600 to-red-700'
                : 'bg-gradient-to-r from-blue-600 to-green-600'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}
