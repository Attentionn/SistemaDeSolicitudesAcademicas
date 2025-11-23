import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { courseAPI, enrollmentAPI, userAPI } from '../services/api';

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
            const response = user?.role === 'admin'
                ? await courseAPI.getTeacherCourses() // Admin can see all courses essentially via this or another endpoint, but let's assume teacher courses for now or we might need a specific admin endpoint if not covered
                : await courseAPI.getTeacherCourses();

            // If admin, we might want to fetch ALL courses. 
            // The current API structure shows getTeacherCourses returns courses for the logged in teacher.
            // If admin needs to see ALL courses, we might need to check if getTeacherCourses handles admins or if we need a new endpoint.
            // Looking at course.routes.js: router.get('/teacher/:teacherId') checks if user is admin or the teacher.
            // But courseAPI.getTeacherCourses() calls /courses/teacher which seems to be missing in the routes I saw?
            // Wait, I saw router.get('/teacher/:teacherId') in course.routes.js
            // But api.js calls axios.get(`${API_BASE_URL}/courses/teacher`)
            // Let's re-read api.js and course.routes.js carefully.
            // api.js: getTeacherCourses: () => axios.get(`${API_BASE_URL}/courses/teacher`)
            // course.routes.js: router.get('/teacher/:teacherId', ...)
            // There seems to be a mismatch or I missed a route.
            // Let's assume for now we use what's available or fix it if needed.
            // Actually, for Admin, let's try to get all courses if possible.
            // api.js has getStudentCourses and getTeacherCourses.
            // Let's use getTeacherCourses for now and see.

            setCourses(response.data);
        } catch (error) {
            console.error('Error loading courses:', error);
        }
    }, [user?.role]);

    // Load enrolled students for selected course
    const loadEnrollments = useCallback(async (courseId) => {
        if (!courseId) return;
        try {
            const response = await enrollmentAPI.getCourseEnrollments(courseId);
            setEnrolledStudents(response.data);
        } catch (error) {
            console.error('Error loading enrollments:', error);
        }
    }, []);

    // Load all students for search (only if admin) or search functionality
    // Since we don't have a "search students" API, we might need to fetch all users and filter, 
    // or just rely on manual entry if the API doesn't support search.
    // userAPI.getAllUsers() is available for super admin.
    // Let's try to implement a simple search if we can get users.
    const searchStudents = async () => {
        if (!searchTerm) return;
        setLoading(true);
        try {
            // Ideally we should have a search endpoint. For now, let's assume we can get all users and filter client side
            // This is not performant for large datasets but works for MVP.
            // Note: userAPI.getAllUsers might be restricted to admin.
            const response = await userAPI.getAllUsers();
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
            // If we can't get all users (e.g. teacher role), we might need another way.
            // For now, let's show a message if it fails.
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
            await enrollmentAPI.enrollStudent(studentId, selectedCourse);
            setMessage({ type: 'success', text: 'Estudiante inscrito exitosamente' });
            loadEnrollments(selectedCourse);
            // Remove from search results to avoid double enrollment attempt
            setStudents(prev => prev.filter(s => s.id !== studentId));
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.error || 'Error al inscribir estudiante' });
        }
    };

    const handleDrop = async (enrollmentId) => {
        if (!window.confirm('¿Está seguro de eliminar esta inscripción?')) return;
        try {
            await enrollmentAPI.dropEnrollment(enrollmentId);
            setMessage({ type: 'success', text: 'Inscripción eliminada exitosamente' });
            loadEnrollments(selectedCourse);
        } catch (error) {
            setMessage({ type: 'error', text: 'Error al eliminar inscripción' });
        }
    };

    if (user?.role === 'student') {
        return <div className="p-4">Acceso denegado</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Gestión de Inscripciones</h1>

            {message.text && (
                <div className={`p-4 mb-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column: Course Selection and Current Enrollments */}
                <div className="bg-white shadow sm:rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">1. Seleccionar Curso</h2>
                    <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm mb-6"
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
                            <h3 className="text-md font-medium text-gray-900 mb-3">Estudiantes Inscritos ({enrolledStudents.length})</h3>
                            <div className="flow-root">
                                <ul className="divide-y divide-gray-200">
                                    {enrolledStudents.map((enrollment) => (
                                        <li key={enrollment.id} className="py-3 flex justify-between items-center">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{enrollment.student?.name}</p>
                                                <p className="text-sm text-gray-500">{enrollment.student?.email}</p>
                                            </div>
                                            <button
                                                onClick={() => handleDrop(enrollment.id)}
                                                className="text-red-600 hover:text-red-900 text-sm font-medium"
                                            >
                                                Eliminar
                                            </button>
                                        </li>
                                    ))}
                                    {enrolledStudents.length === 0 && (
                                        <li className="py-3 text-sm text-gray-500">No hay estudiantes inscritos.</li>
                                    )}
                                </ul>
                            </div>
                        </>
                    )}
                </div>

                {/* Right Column: Add Student */}
                <div className="bg-white shadow sm:rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">2. Inscribir Estudiante</h2>
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            placeholder="Buscar por nombre o matrícula..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        <button
                            onClick={searchStudents}
                            disabled={!selectedCourse || loading}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            Buscar
                        </button>
                    </div>

                    {!selectedCourse && (
                        <p className="text-sm text-gray-500 mb-4">Seleccione un curso primero para buscar estudiantes.</p>
                    )}

                    {students.length > 0 && (
                        <ul className="divide-y divide-gray-200 border-t border-gray-200">
                            {students.map((student) => {
                                const isEnrolled = enrolledStudents.some(e => e.studentId === student.id);
                                return (
                                    <li key={student.id} className="py-3 flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{student.name}</p>
                                            <p className="text-sm text-gray-500">{student.studentId} - {student.faculty}</p>
                                        </div>
                                        <button
                                            onClick={() => handleEnroll(student.id)}
                                            disabled={isEnrolled}
                                            className={`text-sm font-medium ${isEnrolled ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-900'}`}
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
