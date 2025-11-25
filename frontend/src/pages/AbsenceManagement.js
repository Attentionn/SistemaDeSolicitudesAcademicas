import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { absenceAPI, courseAPI } from '../services/api';

const API_BASE_URL = 'http://localhost:5000/api';

export default function AbsenceManagement() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('list');
  const [absences, setAbsences] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    studentId: ''
  });

  // Form states
  const [formData, setFormData] = useState({
    fecha: '',
    motivo: '',
    courseId: '',
    studentId: '',
    evidencia: null
  });

  const loadCourses = useCallback(async () => {
    try {
      const response = user?.role === 'student' 
        ? await courseAPI.getStudentCourses()
        : await courseAPI.getTeacherCourses();
      setCourses(response.data);
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  }, [user?.role]);

  const loadStudentAbsences = useCallback(async () => {
    try {
      const response = await absenceAPI.getStudentAbsences();
      setAbsences(response.data);
    } catch (error) {
      console.error('Error loading absences:', error);
    }
  }, []);

  const loadTeacherAbsences = useCallback(async () => {
    try {
      const response = await absenceAPI.getTeacherAbsences(filters);
      setAbsences(response.data);
    } catch (error) {
      console.error('Error loading absences:', error);
    }
  }, [filters]);

  useEffect(() => {
    loadCourses();
    if (user?.role === 'student') {
      loadStudentAbsences();
    } else if (user?.role === 'teacher') {
      loadTeacherAbsences();
    }
  }, [user, loadCourses, loadStudentAbsences, loadTeacherAbsences]);

  useEffect(() => {
    if (user?.role === 'teacher') {
      loadTeacherAbsences();
    }
  }, [filters, user?.role, loadTeacherAbsences]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'evidencia' && files && files.length > 0) {
      setFormData(prev => ({
        ...prev,
        evidencia: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.courseId) {
        alert('Por favor selecciona un curso');
        setLoading(false);
        return;
      }

      if (!formData.fecha) {
        alert('Por favor selecciona una fecha');
        setLoading(false);
        return;
      }

      // Estudiantes crean avisos de falta futura
      if (user?.role === 'student') {
        // Usar FormData para soportar archivos
        const formDataToSend = new FormData();
        formDataToSend.append('fecha', formData.fecha);
        formDataToSend.append('motivo', formData.motivo);
        formDataToSend.append('courseId', formData.courseId);
        formDataToSend.append('tipo', 'prevista');
        
        if (formData.evidencia) {
          formDataToSend.append('evidencia', formData.evidencia);
        }

        await absenceAPI.createAbsenceWithFile(formDataToSend);
        
        setFormData({
          fecha: '',
          motivo: '',
          courseId: '',
          studentId: '',
          evidencia: null
        });

        loadStudentAbsences();
        alert('Aviso de falta enviado exitosamente');
        return;
      }

      // Profesores registran faltas después
      if (user?.role === 'teacher' || user?.role === 'admin') {
        if (!formData.studentId) {
          alert('Por favor selecciona un estudiante');
          setLoading(false);
          return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('fecha', formData.fecha);
        formDataToSend.append('motivo', formData.motivo);
        formDataToSend.append('courseId', formData.courseId);
        formDataToSend.append('studentId', formData.studentId);
        formDataToSend.append('tipo', 'prevista');
        
        if (formData.evidencia) {
          formDataToSend.append('evidencia', formData.evidencia);
        }

        await absenceAPI.createAbsenceWithFile(formDataToSend);
        
        setFormData({
          fecha: '',
          motivo: '',
          courseId: '',
          studentId: '',
          evidencia: null
        });

        loadTeacherAbsences();
        alert('Falta registrada exitosamente');
        return;
      }
    } catch (error) {
      console.error('Error creating absence:', error);
      alert('Error: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleAbsenceUpdate = async (absenceId, tipo, observaciones = '') => {
    try {
      await absenceAPI.updateAbsence(absenceId, tipo, observaciones);
      loadTeacherAbsences();
      alert('Falta actualizada exitosamente');
    } catch (error) {
      console.error('Error updating absence:', error);
      alert('Error al actualizar la falta');
    }
  };

  const getAbsenceTypeLabel = (tipo) => {
    const types = {
      'justificada': 'Justificada',
      'injustificada': 'Injustificada',
      'prevista': 'Prevista'
    };
    return types[tipo] || tipo;
  };

  const getAbsenceTypeColor = (tipo) => {
    const colors = {
      'justificada': 'bg-green-100 text-green-800',
      'injustificada': 'bg-red-100 text-red-800',
      'prevista': 'bg-yellow-100 text-yellow-800'
    };
    return colors[tipo] || 'bg-gray-100 text-gray-800';
  };

  if (user?.role === 'student') {
    return (
      <main id="main-content" role="main" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-app text-app">
        <div className="py-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Gestión de Faltas</h1>
          
          {/* Tabs */}
          <div className="mt-6">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('list')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'list'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Mis Faltas
                </button>
                <button
                  onClick={() => setActiveTab('notify')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'notify'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Avisar Falta Futura
                </button>
              </nav>
            </div>
          </div>

          {/* Student Absences List */}
          {activeTab === 'list' && (
            <div className="mt-6">
              {absences.length === 0 ? (
                <div className="card shadow sm:rounded-lg p-6 text-center">
                  <p className="text-gray-600 dark:text-gray-300">No tienes faltas registradas</p>
                </div>
              ) : (
                <div className="card shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {absences.map((absence) => (
                      <li key={absence.id}>
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-blue-600 dark:text-blue-300 truncate">
                                  {absence.course?.name}
                                </p>
                                <div className="ml-2 flex-shrink-0 flex">
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAbsenceTypeColor(absence.tipo)}`}>
                                    {getAbsenceTypeLabel(absence.tipo)}
                                  </span>
                                </div>
                              </div>
                              <div className="mt-2">
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-300">
                                  <p>
                                    <span className="font-medium">Fecha:</span> {new Date(absence.fecha).toLocaleDateString()}
                                  </p>
                                  <p className="ml-4">
                                    <span className="font-medium">Profesor:</span> {absence.teacher?.name}
                                  </p>
                                </div>
                                {absence.motivo && (
                                  <div className="mt-1">
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                      <span className="font-medium">Motivo:</span> {absence.motivo}
                                    </p>
                                  </div>
                                )}
                                {absence.observaciones && (
                                  <div className="mt-1">
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                      <span className="font-medium">Observaciones:</span> {absence.observaciones}
                                    </p>
                                  </div>
                                )}
                                {absence.evidencia && (
                                  <div className="mt-2">
                                    <a
                                      href={`${API_BASE_URL}/absences/evidencia/${absence.id}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                      </svg>
                                      Ver evidencia adjunta
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Notify Future Absence Form */}
          {activeTab === 'notify' && (
            <div className="mt-6 card shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                  Avisar Falta Futura
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Avisa a tus profesores si sabes que vas a faltar a una clase
                </p>
                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Curso *
                    </label>
                    <select
                      name="courseId"
                      value={formData.courseId}
                      onChange={handleInputChange}
                      required
                      className="mt-1 input"
                    >
                      <option value="">Seleccionar curso</option>
                      {courses.map(course => (
                        <option key={course.id} value={course.id}>
                          {course.name} - {course.code}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Fecha de la Falta *
                    </label>
                    <input
                      type="date"
                      name="fecha"
                      value={formData.fecha}
                      onChange={handleInputChange}
                      required
                      className="mt-1 input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Motivo
                    </label>
                    <textarea
                      name="motivo"
                      value={formData.motivo}
                      onChange={handleInputChange}
                      rows={4}
                      className="mt-1 input"
                      placeholder="Explica el motivo de tu falta..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Evidencia (PDF o PNG)
                    </label>
                    <input
                      type="file"
                      name="evidencia"
                      accept=".pdf,.png"
                      onChange={handleInputChange}
                      className="mt-1 block w-full text-sm text-gray-900 dark:text-gray-100 
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100
                        dark:file:bg-blue-900 dark:file:text-blue-300"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Opcional: Adjunta recetas médicas u otra documentación de respaldo
                    </p>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary disabled:opacity-50"
                    >
                      {loading ? 'Enviando...' : 'Enviar Aviso'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    );
  }

  // Teacher View
  return (
    <main id="main-content" role="main" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-app text-app">
      <div className="py-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Gestión de Faltas</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Revisa y gestiona las faltas de tus estudiantes</p>
          </div>
          <button
            onClick={loadTeacherAbsences}
            className="btn btn-primary"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualizar
          </button>
        </div>

        {/* Teacher Absences List */}
        <div className="mt-6">
          <div className="card shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {absences.map((absence) => (
                <li key={absence.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-blue-600 dark:text-blue-300 truncate">
                            {absence.course?.name}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAbsenceTypeColor(absence.tipo)}`}>
                              {getAbsenceTypeLabel(absence.tipo)}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-300">
                            <p>
                              <span className="font-medium">Estudiante:</span> {absence.student?.name}
                            </p>
                            <p className="ml-4">
                              <span className="font-medium">Fecha:</span> {new Date(absence.fecha).toLocaleDateString()}
                            </p>
                            <p className="ml-4">
                              <span className="font-medium">Curso:</span> {absence.course?.name}
                            </p>
                          </div>
                          {absence.motivo && (
                            <div className="mt-1">
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                <span className="font-medium">Motivo:</span> {absence.motivo}
                              </p>
                            </div>
                          )}
                          {absence.observaciones && (
                            <div className="mt-1">
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                <span className="font-medium">Observaciones:</span> {absence.observaciones}
                              </p>
                            </div>
                          )}
                          {absence.evidencia && (
                            <div className="mt-2">
                              <a
                                href={`${API_BASE_URL}/absences/evidencia/${absence.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                </svg>
                                Ver evidencia adjunta
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                      {absence.tipo === 'prevista' && (
                        <div className="ml-4 flex-shrink-0 flex space-x-2">
                          <button
                            onClick={() => {
                              const observaciones = prompt('Observaciones (opcional):');
                              handleAbsenceUpdate(absence.id, 'justificada', observaciones || '');
                            }}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Justificar
                          </button>
                          <button
                            onClick={() => {
                              const observaciones = prompt('Observaciones (opcional):');
                              handleAbsenceUpdate(absence.id, 'injustificada', observaciones || '');
                            }}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Marcar Injustificada
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
