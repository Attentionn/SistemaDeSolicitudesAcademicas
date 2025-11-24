import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const EnrollStudentForm = () => {
  const [formData, setFormData] = useState({
    studentId: '',
    courseId: '',
    searchQuery: ''
  });
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showStudentList, setShowStudentList] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [studentsRes, coursesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/users?role=student`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_BASE_URL}/courses`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setStudents(studentsRes.data);
      setFilteredStudents(studentsRes.data);
      setCourses(coursesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchEnrollments = async (courseId) => {
    if (!courseId) {
      setEnrollments([]);
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/enrollments/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEnrollments(response.data);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      setEnrollments([]);
    }
  };

  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    setFormData(prev => ({
      ...prev,
      courseId: courseId
    }));
    fetchEnrollments(courseId);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setFormData(prev => ({
      ...prev,
      searchQuery: query
    }));

    if (query.trim()) {
      const filtered = students.filter(student =>
        student.name.toLowerCase().includes(query) ||
        student.studentId?.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query)
      );
      setFilteredStudents(filtered);
      setShowStudentList(true);
    } else {
      setFilteredStudents(students);
      setShowStudentList(false);
    }
  };

  const selectStudent = (student) => {
    setFormData(prev => ({
      ...prev,
      studentId: student.id.toString(),
      searchQuery: student.name
    }));
    setShowStudentList(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      
      // Verificar si el estudiante ya está inscrito en este curso
      const alreadyEnrolled = enrollments.some(e => e.student?.id === parseInt(formData.studentId));
      if (alreadyEnrolled) {
        setMessage({ 
          type: 'error', 
          text: 'Este estudiante ya está inscrito en este curso' 
        });
        setLoading(false);
        return;
      }

      await axios.post(`${API_BASE_URL}/enrollments`, {
        studentId: parseInt(formData.studentId),
        courseId: parseInt(formData.courseId)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessage({ 
        type: 'success', 
        text: 'Estudiante inscrito exitosamente' 
      });
      
      // Refrescar lista de inscritos
      fetchEnrollments(formData.courseId);
      
      // Limpiar formulario
      setFormData({
        studentId: '',
        courseId: formData.courseId,
        searchQuery: ''
      });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Error al inscribir estudiante' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUnenroll = async (enrollmentId) => {
    if (!window.confirm('¿Estás seguro de desinscribir a este estudiante?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/enrollments/${enrollmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ 
        type: 'success', 
        text: 'Estudiante desinscrito exitosamente' 
      });
      fetchEnrollments(formData.courseId);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Error al desinscribir estudiante' 
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Gestión de Inscripciones
      </h2>

      {message.text && (
        <div className={`mb-4 p-4 rounded ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        {/* Curso */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Curso *
          </label>
          <select
            value={formData.courseId}
            onChange={handleCourseChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Seleccionar curso...</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.code} - {course.name} (Prof. {course.teacher?.name})
              </option>
            ))}
          </select>
        </div>

        {/* Búsqueda de Estudiante */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar Estudiante *
          </label>
          <input
            type="text"
            value={formData.searchQuery}
            onChange={handleSearchChange}
            placeholder="Buscar por nombre, ID de estudiante o email..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!formData.courseId}
            autoComplete="off"
          />
          
          {showStudentList && formData.courseId && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
              {filteredStudents.length > 0 ? (
                filteredStudents.map(student => (
                  <div
                    key={student.id}
                    onClick={() => selectStudent(student)}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
                  >
                    <div className="font-medium text-gray-900">{student.name}</div>
                    <div className="text-sm text-gray-500">
                      {student.studentId} - {student.email}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500 text-center">
                  No se encontraron estudiantes
                </div>
              )}
            </div>
          )}
        </div>

        {/* Botón Submit */}
        <button
          type="submit"
          disabled={loading || !formData.courseId || !formData.studentId}
          className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-colors ${
            loading || !formData.courseId || !formData.studentId
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Inscribiendo...' : 'Inscribir Estudiante'}
        </button>
      </form>

      {/* Lista de Estudiantes Inscritos */}
      {formData.courseId && (
        <div className="border-t pt-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Estudiantes Inscritos ({enrollments.length})
          </h3>
          
          {enrollments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No hay estudiantes inscritos en este curso
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID Estudiante
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Facultad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {enrollments.map(enrollment => (
                    <tr key={enrollment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {enrollment.student?.studentId || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {enrollment.student?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {enrollment.student?.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {enrollment.student?.faculty || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleUnenroll(enrollment.id)}
                          className="text-red-600 hover:text-red-900 font-medium"
                        >
                          Desinscribir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnrollStudentForm;
