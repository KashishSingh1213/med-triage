# tests/test_triage_engine.py
"""
Unit tests for triage engine
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from tasks.models import PatientModel, VitalsModel
from tasks.triage_engine import TriageEngine


def test_esi_calculation():
    """Test ESI level calculation"""
    engine = TriageEngine()
    
    # Test ESI-2 (high-risk)
    patient = PatientModel(
        id="test_001",
        name="Test Patient",
        age=45,
        gender="M",
        symptoms=["Chest Pain"],
        vitals=VitalsModel(
            heartRate=120,
            bloodPressure="160/90",
            temperature=37.5,
            respiratoryRate=24
        ),
        medicalHistory=[],
        allergies=[],
        currentMedications=[],
        createdAt="2026-04-06T10:00:00Z"
    )
    
    assessment = engine.assess_patient(patient)
    assert assessment.esiLevel == 2, f"Expected ESI 2, got {assessment.esiLevel}"
    print("✓ ESI-2 calculation passed")


def test_esi_non_urgent():
    """Test ESI-5 (non-urgent) calculation"""
    engine = TriageEngine()
    
    patient = PatientModel(
        id="test_002",
        name="Healthy Patient",
        age=25,
        gender="F",
        symptoms=[],
        vitals=VitalsModel(
            heartRate=72,
            bloodPressure="120/80",
            temperature=36.8,
            respiratoryRate=16
        ),
        medicalHistory=[],
        allergies=[],
        currentMedications=[],
        createdAt="2026-04-06T10:00:00Z"
    )
    
    assessment = engine.assess_patient(patient)
    assert assessment.esiLevel == 5, f"Expected ESI 5, got {assessment.esiLevel}"
    print("✓ ESI-5 calculation passed")


def test_confidence_calculation():
    """Test confidence score calculation"""
    engine = TriageEngine()
    
    patient = PatientModel(
        id="test_003",
        name="Complex Patient",
        age=60,
        gender="M",
        symptoms=["Chest Pain", "Shortness of Breath", "Nausea"],
        vitals=VitalsModel(
            heartRate=110,
            bloodPressure="150/85",
            temperature=37.8,
            respiratoryRate=22
        ),
        medicalHistory=["Hypertension", "Diabetes"],
        allergies=["Penicillin"],
        currentMedications=["Metoprolol"],
        createdAt="2026-04-06T10:00:00Z"
    )
    
    assessment = engine.assess_patient(patient)
    assert 0 <= assessment.confidence <= 1, "Confidence should be between 0 and 1"
    assert assessment.confidence > 0.7, "Confidence should be high for complete data"
    print(f"✓ Confidence calculation passed (confidence: {assessment.confidence})")


if __name__ == "__main__":
    print("Running triage engine tests...\n")
    test_esi_calculation()
    test_esi_non_urgent()
    test_confidence_calculation()
    print("\n✅ All tests passed!")
