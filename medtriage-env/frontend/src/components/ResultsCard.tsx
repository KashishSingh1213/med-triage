'use client';

import type { ESILevel, TriageAssessment } from '@/lib/types';
import { ESI_LEVELS } from '@/lib/constants';

interface ResultsCardProps {
  assessment: TriageAssessment;
}

export default function ResultsCard({ assessment }: ResultsCardProps) {
  const esiLevel = assessment.esiLevel as ESILevel;
  const levelInfo = ESI_LEVELS[esiLevel];

  // Color mapping for different ESI levels
  const colorMap = {
    1: { bg: 'from-red-500 to-red-600', light: 'bg-red-50', border: 'border-red-500', badges: 'bg-red-100 text-red-800' },
    2: { bg: 'from-orange-500 to-orange-600', light: 'bg-orange-50', border: 'border-orange-500', badges: 'bg-orange-100 text-orange-800' },
    3: { bg: 'from-amber-500 to-amber-600', light: 'bg-amber-50', border: 'border-amber-500', badges: 'bg-amber-100 text-amber-800' },
    4: { bg: 'from-yellow-500 to-yellow-600', light: 'bg-yellow-50', border: 'border-yellow-500', badges: 'bg-yellow-100 text-yellow-800' },
    5: { bg: 'from-green-500 to-green-600', light: 'bg-green-50', border: 'border-green-500', badges: 'bg-green-100 text-green-800' },
  };

  const colors = colorMap[esiLevel];

  return (
    <div className="space-y-5">
      {/* Main ESI Level Card - Premium Design */}
      <div className={`rounded-2xl bg-gradient-to-br ${colors.bg} p-8 text-white shadow-2xl transform hover:scale-105 transition-transform duration-300 border-4 border-white relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="relative z-10 grid grid-cols-2 gap-8">
          <div>
            <p className="text-white/80 text-sm font-semibold uppercase tracking-wider mb-2">🎯 Triage Priority</p>
            <div className="flex items-baseline gap-3">
              <div className="text-6xl font-black">{esiLevel}</div>
              <div className="text-2xl font-bold opacity-90">out of 5</div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white/80 text-sm font-semibold uppercase tracking-wider mb-2">🧠 AI Confidence</p>
            <div className="flex items-baseline justify-end gap-2">
              <div className="text-4xl font-black">{(assessment.confidence * 100).toFixed(0)}</div>
              <div className="text-2xl font-bold opacity-90">%</div>
            </div>
          </div>
        </div>
        <div className="relative z-10 mt-6 pt-6 border-t border-white/30">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-bold text-lg">{levelInfo.label}</p>
              <p className="text-white/90 mt-1">{levelInfo.description}</p>
            </div>
            <div className="text-5xl opacity-20">
              {esiLevel === 1 && '🚨'}
              {esiLevel === 2 && '⚠️'}
              {esiLevel === 3 && '🔔'}
              {esiLevel === 4 && '📋'}
              {esiLevel === 5 && '✓'}
            </div>
          </div>
        </div>
      </div>

      {/* Severity Badge */}
      <div className={`rounded-xl ${colors.light} p-6 border-2 ${colors.border}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 font-semibold text-sm uppercase">Severity Level</p>
            <p className="text-2xl font-bold mt-2">{assessment.severity}</p>
          </div>
          <div className={`${colors.badges} px-4 py-2 rounded-lg font-bold text-lg`}>
            {esiLevel === 1 && '🚨 Critical'}
            {esiLevel === 2 && '⚠️ Emergent'}
            {esiLevel === 3 && '🔔 Urgent'}
            {esiLevel === 4 && '📋 Semi-Urgent'}
            {esiLevel === 5 && '✓ Non-Urgent'}
          </div>
        </div>
      </div>

      {/* Confidence Indicator */}
      <div className="rounded-xl bg-white border-2 border-blue-200 p-6 shadow-md hover:shadow-lg hover:border-blue-400 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900">📊 Confidence Score</h3>
          <span className="text-2xl font-bold text-blue-600">{(assessment.confidence * 100).toFixed(1)}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-600 h-full rounded-full transition-all duration-1000 ease-out shadow-md"
            style={{ width: `${assessment.confidence * 100}%` }}
          ></div>
        </div>
        <p className="text-xs text-slate-600 mt-3">
          {assessment.confidence > 0.8
            ? '✓ High confidence in this assessment'
            : assessment.confidence > 0.6
            ? '~ Medium confidence, recommend review'
            : '⚠ Low confidence, manual review recommended'}
        </p>
      </div>

      {/* Recommended Tests */}
      {assessment.recommendedTests.length > 0 && (
        <div className="rounded-xl bg-blue-50 border-2 border-blue-500 p-6 shadow-md hover:shadow-lg hover:border-blue-600 transition-all duration-300">
          <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2 text-lg">
            <span>🧪</span> Recommended Tests
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {assessment.recommendedTests.map((test: string, i: number) => (
              <div key={i} className="bg-white rounded-lg p-3 border-l-4 border-blue-500 hover:border-blue-600 hover:shadow-md transition-all flex items-start gap-3">
                <span className="text-blue-600 font-bold text-lg flex-shrink-0">✓</span>
                <span className="text-sm font-semibold text-slate-700">{test}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clinical Recommendations */}
      {assessment.recommendations.length > 0 && (
        <div className="rounded-xl bg-green-50 border-2 border-green-500 p-6 shadow-md hover:shadow-lg hover:border-green-600 transition-all duration-300">
          <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2 text-lg">
            <span>💚</span> Clinical Recommendations
          </h3>
          <div className="space-y-3">
            {assessment.recommendations.map((rec: string, i: number) => (
              <div key={i} className="bg-white rounded-lg p-3 border-l-4 border-green-500 hover:border-green-600 hover:shadow-md transition-all flex items-start gap-3">
                <span className="text-green-600 font-bold text-lg flex-shrink-0">→</span>
                <span className="text-sm text-slate-700">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Diagnosis */}
      <div className="rounded-xl bg-blue-50 border-2 border-blue-600 p-6 shadow-md hover:shadow-lg hover:border-blue-700 transition-all duration-300">
        <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2 text-lg">
          <span>🔬</span> Preliminary Diagnosis
        </h3>
        <p className="text-blue-900 font-semibold text-lg bg-white rounded-lg p-4 border-l-4 border-blue-600 hover:border-blue-700 transition-colors">
          {assessment.diagnosis}
        </p>
      </div>

      {/* AI Explanation Box */}
      <div className="rounded-xl bg-green-50 border-2 border-green-600 p-6 shadow-md hover:shadow-lg hover:border-green-700 transition-all duration-300">
        <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2 text-lg">
          <span>🤖</span> AI Analysis Details
        </h3>
        <div className="bg-white rounded-lg p-4 border-l-4 border-green-600 hover:border-green-700 transition-colors">
          <p className="text-slate-700 text-sm leading-relaxed">{assessment.aiExplanation}</p>
        </div>
      </div>
    </div>
  );
}
