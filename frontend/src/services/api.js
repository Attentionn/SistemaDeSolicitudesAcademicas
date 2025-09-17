import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Accommodation/Request API
export const accommodationAPI = {
  // Create new request
  createRequest: (requestData) => 
    axios.post(`${API_BASE_URL}/accommodations`, requestData),
  
  // Get requests for student
  getStudentRequests: () => 
    axios.get(`${API_BASE_URL}/accommodations/student`),
  
  // Get requests for teacher with filtering
  getTeacherRequests: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.status) params.append('status', filters.status);
    return axios.get(`${API_BASE_URL}/accommodations/teacher?${params}`);
  },
  
  // Update request status (teacher only)
  updateRequestStatus: (id, status, teacherResponse) => 
    axios.patch(`${API_BASE_URL}/accommodations/${id}`, { status, teacherResponse }),
  
  // Get request by ID
  getRequestById: (id) => 
    axios.get(`${API_BASE_URL}/accommodations/${id}`)
};

// Absence API
export const absenceAPI = {
  // Create new absence notification
  createAbsence: (absenceData) => 
    axios.post(`${API_BASE_URL}/absences`, absenceData),
  
  // Get absences for student
  getStudentAbsences: () => 
    axios.get(`${API_BASE_URL}/absences/student`),
  
  // Get absences for teacher with filtering
  getTeacherAbsences: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.studentId) params.append('studentId', filters.studentId);
    return axios.get(`${API_BASE_URL}/absences/teacher?${params}`);
  },
  
  // Update absence (teacher only)
  updateAbsence: (id, tipo, observaciones) => 
    axios.patch(`${API_BASE_URL}/absences/${id}`, { tipo, observaciones }),
  
  // Get absence by ID
  getAbsenceById: (id) => 
    axios.get(`${API_BASE_URL}/absences/${id}`)
};

// Course API
export const courseAPI = {
  // Get courses for student
  getStudentCourses: () => 
    axios.get(`${API_BASE_URL}/courses/student`),
  
  // Get courses for teacher
  getTeacherCourses: () => 
    axios.get(`${API_BASE_URL}/courses/teacher`)
};
