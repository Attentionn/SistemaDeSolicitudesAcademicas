import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Helper para agregar token a las solicitudes
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default function EnrollmentManagement() {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [students, setStudents] = useState([]);
    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Load courses based on role
    const loadCourses = useCallback(async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/courses/teacher`, { 
              headers: getAuthHeader() 
            });
            setCourses(response.data);
        } catch (error) {
            console.error('Error loading courses:', error);
        }
    }, [user?.role]);

    // Load enrolled students for selected course
    const loadEnrollments = useCallback(async (courseId) => {
        if (!courseId) return;
        try {
            const response = await axios.get(`${API_BASE_URL}/enrollments/course/${courseId}`, {
              headers: getAuthHeader()
            });
            setEnrolledStudents(response.data);
        } catch (error) {
            console.error('Error loading enrollments:', error);
        }
    }, []);

    // Load all students for search
    const searchStudents = async () => {
        if (!searchTerm) return;
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/users?role=student`, {
              headers: getAuthHeader()
            });
            const allUsers = response.data;
            const filtered = allUsers.filter(u =>
                u.role === 'student' &&
                (u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    u.studentId?.includes(searchTerm))
            );
            setStudents(filtered);
        } catch (error) {
            console.error('Error searching students:', error);
            setMessage({ type: 'error', text: 'No se pudieron buscar estudiantes. Contacte al administrador.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCourses();
    }, [loadCourses]);

    useEffect(() => {
        if (selectedCourse) {
            loadEnrollments(selectedCourse);
        } else {
            setEnrolledStudents([]);
        }
    }, [selectedCourse, loadEnrollments]);

    const handleEnroll = async (studentId) => {
        try {
            await axios.post(`${API_BASE_URL}/enrollments`, { 
              studentId, 
              courseId: selectedCourse 
            }, { headers: getAuthHeader() });
            setMessage({ type: 'success', text: 'Estudiante inscrito exitosamente' });
            loadEnrollments(selectedCourse);
            setStudents(prev => prev.filter(s => s.id !== studentId));
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.error || 'Error al inscribir estudiante' });
        }
    };

    const handleDrop = async (enrollmentId) => {
        if (!window.confirm('¿Está seguro de eliminar esta inscripción?')) return;
        try {
            await axios.delete(`${API_BASE_URL}/enrollments/${enrollmentId}`, { 
              headers: getAuthHeader() 
            });
            setMessage({ type: 'success', text: 'Inscripción eliminada exitosamente' });
            loadEnrollments(selectedCourse);
        } catch (error) {
            setMessage({ type: 'error', text: 'Error al eliminar inscripción' });
        }
    };

    if (user?.role === 'student') {
        return <div className="p-4 text-app bg-app">Acceso denegado</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-app text-app">
            {/* Patrón de modo oscuro accesible:
                - Contenedores usan clase `card` que aplica fondo claro/oscuro.
                - Texto principal agrega `dark:text-gray-100` si no usa variables.
                - Listas separadoras usan `dark:divide-gray-700`.
                - Botones reutilizan `.btn` / `.btn-primary` para consistencia.
                - Alertas incluyen contraste ≥ WCAG AA y `aria-live` para feedback.
                Para nuevas páginas replicar estructura: wrapper bg-app + tarjetas card.
            */}
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Gestión de Inscripciones</h1>

            {message.text && (
                <div
                  role="alert"
                  aria-live="polite"
                  className={`p-4 mb-4 rounded-md text-sm font-medium border ${message.type === 'success'
                      ? 'bg-green-100 dark:bg-green-800/40 text-green-700 dark:text-green-200 border-green-200 dark:border-green-700'
                      : 'bg-red-100 dark:bg-red-800/40 text-red-700 dark:text-red-200 border-red-200 dark:border-red-700'
                  }`}
                >
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column: Course Selection and Current Enrollments */}
                <div className="card shadow sm:rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">1. Seleccionar Curso</h2>
                    <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="input mb-6"
                    >
                        <option value="">Seleccione un curso...</option>
                        {courses.map(course => (
                            <option key={course.id} value={course.id}>
                                {course.name} - {course.code}
                            </option>
                        ))}
                    </select>

                    {selectedCourse && (
                        <>
                            <h3 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-3">Estudiantes Inscritos ({enrolledStudents.length})</h3>
                            <div className="flow-root">
                                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {enrolledStudents.map((enrollment) => (
                                        <li key={enrollment.id} className="py-3 flex justify-between items-center">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{enrollment.student?.name}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-200">{enrollment.student?.email}</p>
                                            </div>
                                            <button
                                                onClick={() => handleDrop(enrollment.id)}
                                                className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                            >
                                                Eliminar
                                            </button>
                                        </li>
                                    ))}
                                    {enrolledStudents.length === 0 && (
                                        <li className="py-3 text-sm text-gray-600 dark:text-gray-200">No hay estudiantes inscritos.</li>
                                    )}
                                </ul>
                            </div>
                        </>
                    )}
                </div>

                {/* Right Column: Add Student */}
                <div className="card shadow sm:rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">2. Inscribir Estudiante</h2>
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            placeholder="Buscar por nombre o matrícula..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input flex-1"
                        />
                        <button
                            onClick={searchStudents}
                            disabled={!selectedCourse || loading}
                            className="btn btn-primary disabled:opacity-50"
                        >
                            {loading ? 'Buscando…' : 'Buscar'}
                        </button>
                    </div>

                    {!selectedCourse && (
                        <p className="text-sm text-gray-600 dark:text-gray-200 mb-4">Seleccione un curso primero para buscar estudiantes.</p>
                    )}

                    {students.length > 0 && (
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700 border-t border-gray-200 dark:border-gray-700">
                            {students.map((student) => {
                                const isEnrolled = enrolledStudents.some(e => e.studentId === student.id);
                                return (
                                    <li key={student.id} className="py-3 flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{student.name}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-200">{student.studentId} - {student.faculty}</p>
                                        </div>
                                        <button
                                            onClick={() => handleEnroll(student.id)}
                                            disabled={isEnrolled}
                                            className={`text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${isEnrolled ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' : 'text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300'}`}
                                        >
                                            {isEnrolled ? 'Inscrito' : 'Inscribir'}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
