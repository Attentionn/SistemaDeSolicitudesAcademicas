import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { absenceAPI, courseAPI } from '../services/api';

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
    materia: '',
    motivo: '',
    courseId: ''
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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const absenceData = {
        fecha: formData.fecha,
        materia: formData.materia,
        motivo: formData.motivo,
        courseId: parseInt(formData.courseId)
      };

      await absenceAPI.createAbsence(absenceData);
      
      // Reset form
      setFormData({
        fecha: '',
        materia: '',
        motivo: '',
        courseId: ''
      });

      // Reload absences
      loadStudentAbsences();
      
      alert('Aviso de falta enviado exitosamente');
    } catch (error) {
      console.error('Error creating absence:', error);
      alert('Error al enviar el aviso de falta');
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <h1 className="text-2xl font-semibold text-gray-900">Gestión de Faltas</h1>
          
          {/* Tabs */}
          <div className="mt-6">
            <div className="border-b border-gray-200">
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
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {absences.map((absence) => (
                    <li key={absence.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-blue-600 truncate">
                                {absence.materia}
                              </p>
                              <div className="ml-2 flex-shrink-0 flex">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAbsenceTypeColor(absence.tipo)}`}>
                                  {getAbsenceTypeLabel(absence.tipo)}
                                </span>
                              </div>
                            </div>
                            <div className="mt-2">
                              <div className="flex items-center text-sm text-gray-500">
                                <p>
                                  <span className="font-medium">Fecha:</span> {new Date(absence.fecha).toLocaleDateString()}
                                </p>
                                <p className="ml-4">
                                  <span className="font-medium">Curso:</span> {absence.course?.name}
                                </p>
                              </div>
                              {absence.motivo && (
                                <div className="mt-1">
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Motivo:</span> {absence.motivo}
                                  </p>
                                </div>
                              )}
                              {absence.observaciones && (
                                <div className="mt-1">
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Observaciones del profesor:</span> {absence.observaciones}
                                  </p>
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
            </div>
          )}

          {/* Notify Future Absence Form */}
          {activeTab === 'notify' && (
            <div className="mt-6 bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Avisar Falta Futura
                </h3>
                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Curso
                    </label>
                    <select
                      name="courseId"
                      value={formData.courseId}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                    <label className="block text-sm font-medium text-gray-700">
                      Fecha de la Falta
                    </label>
                    <input
                      type="date"
                      name="fecha"
                      value={formData.fecha}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Materia
                    </label>
                    <input
                      type="text"
                      name="materia"
                      value={formData.materia}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Nombre de la materia"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Motivo
                    </label>
                    <textarea
                      name="motivo"
                      value={formData.motivo}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Explica el motivo de tu falta..."
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {loading ? 'Enviando...' : 'Enviar Aviso'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Teacher View
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <h1 className="text-2xl font-semibold text-gray-900">Gestión de Faltas de Estudiantes</h1>
        
        {/* Filters */}
        <div className="mt-6 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Filtros
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Estudiante
                </label>
                <select
                  value={filters.studentId}
                  onChange={(e) => setFilters(prev => ({ ...prev, studentId: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Todos los estudiantes</option>
                  {/* This would need to be populated with students from the teacher's courses */}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Teacher Absences List */}
        <div className="mt-6">
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {absences.map((absence) => (
                <li key={absence.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-blue-600 truncate">
                            {absence.materia}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAbsenceTypeColor(absence.tipo)}`}>
                              {getAbsenceTypeLabel(absence.tipo)}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center text-sm text-gray-500">
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
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Motivo:</span> {absence.motivo}
                              </p>
                            </div>
                          )}
                          {absence.observaciones && (
                            <div className="mt-1">
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Observaciones:</span> {absence.observaciones}
                              </p>
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
    </div>
  );
}
