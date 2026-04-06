# API_DOCUMENTATION.md

## MedTriage-Env API Documentation

Complete API reference for MedTriage-Env backend.

### Base URL
```
http://localhost:8000
```

---

## 🏥 Patient Endpoints

### Create Patient
**POST** `/api/patients`

Create a new patient record.

**Request Body:**
```json
{
  "id": "patient_001",
  "name": "John Doe",
  "age": 45,
  "gender": "M",
  "symptoms": ["Chest Pain", "Shortness of Breath"],
  "vitals": {
    "heartRate": 120,
    "bloodPressure": "160/90",
    "temperature": 37.5,
    "respiratoryRate": 24
  },
  "medicalHistory": ["Hypertension"],
  "allergies": ["Penicillin"],
  "currentMedications": ["Lisinopril"],
  "createdAt": "2026-04-06T10:00:00Z"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "patient_001",
    "name": "John Doe",
    ...
  },
  "message": "Patient record created successfully"
}
```

---

### List All Patients
**GET** `/api/patients`

Retrieve all patient records.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "patient_001",
      "name": "John Doe",
      ...
    }
  ]
}
```

---

### Get Patient Details
**GET** `/api/patients/{patient_id}`

Retrieve specific patient information.

**Parameters:**
- `patient_id` (path) - Patient ID

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "patient_001",
    "name": "John Doe",
    ...
  }
}
```

**Response (404):**
```json
{
  "success": false,
  "error": "Patient not found"
}
```

---

## 🔍 Triage Endpoints

### Run Triage Assessment
**POST** `/api/triage/assess`

Perform AI-based triage assessment on a patient.

**Request Body:**
```json
{
  "patientId": "patient_001"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "patientId": "patient_001",
    "esiLevel": 2,
    "severity": "Urgent",
    "recommendedTests": [
      "ECG",
      "Troponin Test",
      "Chest X-Ray"
    ],
    "recommendations": [
      "Monitor vital signs every 15 minutes",
      "Establish IV line",
      "Apply oxygen if SpO2 < 94%"
    ],
    "diagnosis": "Possible acute coronary syndrome - cardiac evaluation required",
    "confidence": 0.85,
    "timestamp": "2026-04-06T10:30:00Z",
    "aiExplanation": "Based on the patient's symptoms (chest pain, age 45)..."
  },
  "message": "Triage assessment completed"
}
```

---

### Get Triage Case
**GET** `/api/triage/case/{case_id}`

Retrieve a specific triage case.

**Parameters:**
- `case_id` (path) - Case ID

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "case_patient_001_1712408400",
    "patient": { ... },
    "assessment": { ... },
    "status": "completed",
    "score": 100,
    "reward": 50
  }
}
```

---

### List Triage Cases
**GET** `/api/triage/cases`

Retrieve all triage cases.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "case_patient_001_1712408400",
      "patient": { ... },
      "assessment": { ... },
      "status": "completed",
      "score": 100,
      "reward": 50
    }
  ]
}
```

---

## 📊 System Endpoints

### Health Check
**GET** `/api/health`

Check if backend is running.

**Response (200):**
```json
{
  "status": "healthy",
  "service": "MedTriage-Env Backend",
  "version": "1.0.0"
}
```

---

### Get System Statistics
**GET** `/api/stats`

Retrieve system statistics.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalPatients": 5,
    "totalCases": 3,
    "avgReward": 45.67
  }
}
```

---

## 📋 Data Models

### Patient Model
```json
{
  "id": string,
  "name": string,
  "age": number,
  "gender": "M" | "F" | "Other",
  "symptoms": string[],
  "vitals": {
    "heartRate": number,
    "bloodPressure": string,
    "temperature": number,
    "respiratoryRate": number
  },
  "medicalHistory": string[],
  "allergies": string[],
  "currentMedications": string[],
  "createdAt": string (ISO 8601)
}
```

### Assessment Model
```json
{
  "patientId": string,
  "esiLevel": 1 | 2 | 3 | 4 | 5,
  "severity": "Critical" | "Urgent" | "Moderate" | "Minor" | "Non-urgent",
  "recommendedTests": string[],
  "recommendations": string[],
  "diagnosis": string,
  "confidence": number (0-1),
  "timestamp": string (ISO 8601),
  "aiExplanation": string
}
```

### Triage Case Model
```json
{
  "id": string,
  "patient": Patient,
  "assessment": Assessment,
  "status": "pending" | "in_progress" | "completed",
  "score": number,
  "reward": number
}
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid request format or missing required fields"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "An unexpected error occurred"
}
```

---

## 🔒 Authentication

Currently no authentication is required. For production:
- Add JWT token validation
- Implement rate limiting
- Add API key management
- Use HTTPS only

---

## 🚀 Rate Limiting

Not currently implemented. Recommended:
- 100 requests per minute per IP
- 1000 requests per hour per API key

---

## 📝 Examples

### Complete Workflow Example

**1. Create Patient:**
```bash
curl -X POST http://localhost:8000/api/patients \
  -H "Content-Type: application/json" \
  -d '{
    "id": "p123",
    "name": "Jane Smith",
    "age": 35,
    "gender": "F",
    "symptoms": ["Fever", "Cough"],
    "vitals": {
      "heartRate": 95,
      "bloodPressure": "125/82",
      "temperature": 38.8,
      "respiratoryRate": 20
    },
    "medicalHistory": [],
    "allergies": [],
    "currentMedications": [],
    "createdAt": "2026-04-06T10:00:00Z"
  }'
```

**2. Run Assessment:**
```bash
curl -X POST http://localhost:8000/api/triage/assess \
  -H "Content-Type: application/json" \
  -d '{"patientId": "p123"}'
```

**3. View Results:**
Response will include ESI level, recommendations, and AI explanation.

---

**Version:** 1.0.0  
**Last Updated:** April 6, 2026
