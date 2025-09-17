import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { accommodationAPI, courseAPI } from '../services/api';

export default function SolicitudesPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('create');
  const [requests, setRequests] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    status: ''
  });

  // Form states
  const [formData, setFormData] = useState({
    type: '',
    courseId: '',
    motivo: '',
    fechaOriginal: '',
    fechaPropuesta: '',
    requestedDate: new Date().toISOString().split('T')[0],
    description: ''
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

  const loadStudentRequests = useCallback(async () => {
    try {
      const response = await accommodationAPI.getStudentRequests();
      setRequests(response.data);
    } catch (error) {
      console.error('Error loading requests:', error);
    }
  }, []);

  const loadTeacherRequests = useCallback(async () => {
    try {
      const response = await accommodationAPI.getTeacherRequests(filters);
      setRequests(response.data);
    } catch (error) {
      console.error('Error loading requests:', error);
    }
  }, [filters]);

  useEffect(() => {
    loadCourses();
    if (user?.role === 'student') {
      loadStudentRequests();
    } else if (user?.role === 'teacher') {
      loadTeacherRequests();
    }
  }, [user, loadCourses, loadStudentRequests, loadTeacherRequests]);

  useEffect(() => {
    if (user?.role === 'teacher') {
      loadTeacherRequests();
    }
  }, [filters, user?.role, loadTeacherRequests]);

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
      const requestData = {
        type: formData.type,
        courseId: parseInt(formData.courseId),
        motivo: formData.motivo,
        description: formData.description,
        requestedDate: formData.requestedDate
      };

      // Add specific fields based on request type
      if (formData.type === 'deadline_extension') {
        requestData.fechaOriginal = formData.fechaOriginal;
        requestData.fechaPropuesta = formData.fechaPropuesta;
      } else if (formData.type === 'exam_change') {
        requestData.fechaOriginal = formData.fechaOriginal;
        requestData.fechaPropuesta = formData.fechaPropuesta;
      }

      await accommodationAPI.createRequest(requestData);
      
      // Reset form
      setFormData({
        type: '',
        courseId: '',
        motivo: '',
        fechaOriginal: '',
        fechaPropuesta: '',
        requestedDate: new Date().toISOString().split('T')[0],
        description: ''
      });

      // Reload requests
      if (user?.role === 'student') {
        loadStudentRequests();
      }
      
      alert('Solicitud enviada exitosamente');
    } catch (error) {
      console.error('Error creating request:', error);
      alert('Error al enviar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, status, teacherResponse = '') => {
    try {
      await accommodationAPI.updateRequestStatus(requestId, status, teacherResponse);
      loadTeacherRequests();
      alert(`Solicitud ${status === 'approved' ? 'aprobada' : 'rechazada'}`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error al actualizar la solicitud');
    }
  };

  const getRequestTypeLabel = (type) => {
    const types = {
      'deadline_extension': 'Extensión de deadline',
      'exam_change': 'Cambio de examen',
      'exam_date_change': 'Cambio de fecha de examen',
      'classroom_change': 'Cambio de salón',
      'notes_request': 'Solicitud de apuntes',
      'assignment_extension': 'Extensión de entrega',
      'absence_notification': 'Aviso de falta'
    };
    return types[type] || type;
  };

  const getStatusLabel = (status) => {
    const statuses = {
      'pending': 'Pendiente',
      'approved': 'Aprobada',
      'rejected': 'Rechazada'
    };
    return statuses[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (user?.role === 'student') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <h1 className="text-2xl font-semibold text-gray-900">Solicitudes</h1>
          
          {/* Tabs */}
          <div className="mt-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('create')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'create'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Nueva Solicitud
                </button>
                <button
                  onClick={() => setActiveTab('list')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'list'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Mis Solicitudes
                </button>
              </nav>
            </div>
          </div>

          {/* Create Request Form */}
          {activeTab === 'create' && (
            <div className="mt-6 bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Crear Nueva Solicitud
                </h3>
                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tipo de Solicitud
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">Seleccionar tipo</option>
                      <option value="deadline_extension">Extensión de deadline</option>
                      <option value="exam_change">Cambio de examen</option>
                    </select>
                  </div>

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

                  {(formData.type === 'deadline_extension' || formData.type === 'exam_change') && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Fecha Original
                        </label>
                        <input
                          type="date"
                          name="fechaOriginal"
                          value={formData.fechaOriginal}
                          onChange={handleInputChange}
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Fecha Propuesta
                        </label>
                        <input
                          type="date"
                          name="fechaPropuesta"
                          value={formData.fechaPropuesta}
                          onChange={handleInputChange}
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </>
                  )}

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
                      placeholder="Explica el motivo de tu solicitud..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Descripción Adicional
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Información adicional (opcional)..."
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {loading ? 'Enviando...' : 'Enviar Solicitud'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Student Requests List */}
          {activeTab === 'list' && (
            <div className="mt-6">
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {requests.map((request) => (
                    <li key={request.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-blue-600 truncate">
                                {getRequestTypeLabel(request.type)}
                              </p>
                              <div className="ml-2 flex-shrink-0 flex">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                                  {getStatusLabel(request.status)}
                                </span>
                              </div>
                            </div>
                            <div className="mt-2">
                              <div className="flex items-center text-sm text-gray-500">
                                <p>
                                  <span className="font-medium">Curso:</span> {request.course?.name}
                                </p>
                              </div>
                              <div className="mt-1">
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Motivo:</span> {request.motivo}
                                </p>
                              </div>
                              {request.fechaOriginal && (
                                <div className="mt-1">
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Fecha Original:</span> {new Date(request.fechaOriginal).toLocaleDateString()}
                                  </p>
                                </div>
                              )}
                              {request.fechaPropuesta && (
                                <div className="mt-1">
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Fecha Propuesta:</span> {new Date(request.fechaPropuesta).toLocaleDateString()}
                                  </p>
                                </div>
                              )}
                              {request.teacherResponse && (
                                <div className="mt-2">
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Respuesta del profesor:</span> {request.teacherResponse}
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
        </div>
      </div>
    );
  }

  // Teacher View
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <h1 className="text-2xl font-semibold text-gray-900">Solicitudes de Estudiantes</h1>
        
        {/* Filters */}
        <div className="mt-6 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Filtros
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tipo de Solicitud
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Todos los tipos</option>
                  <option value="deadline_extension">Extensión de deadline</option>
                  <option value="exam_change">Cambio de examen</option>
                  <option value="exam_date_change">Cambio de fecha de examen</option>
                  <option value="classroom_change">Cambio de salón</option>
                  <option value="notes_request">Solicitud de apuntes</option>
                  <option value="assignment_extension">Extensión de entrega</option>
                  <option value="absence_notification">Aviso de falta</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Estado
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Todos los estados</option>
                  <option value="pending">Pendiente</option>
                  <option value="approved">Aprobada</option>
                  <option value="rejected">Rechazada</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Teacher Requests List */}
        <div className="mt-6">
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {requests.map((request) => (
                <li key={request.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-blue-600 truncate">
                            {getRequestTypeLabel(request.type)}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                              {getStatusLabel(request.status)}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <p>
                              <span className="font-medium">Estudiante:</span> {request.student?.name}
                            </p>
                            <p className="ml-4">
                              <span className="font-medium">Curso:</span> {request.course?.name}
                            </p>
                          </div>
                          <div className="mt-1">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Motivo:</span> {request.motivo}
                            </p>
                          </div>
                          {request.fechaOriginal && (
                            <div className="mt-1">
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Fecha Original:</span> {new Date(request.fechaOriginal).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                          {request.fechaPropuesta && (
                            <div className="mt-1">
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Fecha Propuesta:</span> {new Date(request.fechaPropuesta).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      {request.status === 'pending' && (
                        <div className="ml-4 flex-shrink-0 flex space-x-2">
                          <button
                            onClick={() => handleStatusUpdate(request.id, 'approved')}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Aprobar
                          </button>
                          <button
                            onClick={() => {
                              const response = prompt('Motivo del rechazo (opcional):');
                              handleStatusUpdate(request.id, 'rejected', response || '');
                            }}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Rechazar
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
