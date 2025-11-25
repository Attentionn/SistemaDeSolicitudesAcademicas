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
    extensionDays: '',
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
      // Validar que courseId y description no estén vacíos
      if (!formData.courseId) {
        alert('Por favor selecciona un curso');
        setLoading(false);
        return;
      }
      
      if (!formData.description) {
        alert('Por favor describe tu solicitud');
        setLoading(false);
        return;
      }

      // Validar fechas
      if (formData.fechaOriginal && formData.fechaPropuesta) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const originalDate = new Date(formData.fechaOriginal);
        originalDate.setHours(0, 0, 0, 0);
        const proposedDate = new Date(formData.fechaPropuesta);
        proposedDate.setHours(0, 0, 0, 0);
        
        // No permitir fechas pasadas (pero sí hoy)
        if (originalDate.getTime() < today.getTime()) {
          alert('No puedes seleccionar una fecha original anterior a hoy');
          setLoading(false);
          return;
        }
        
        if (proposedDate.getTime() < today.getTime()) {
          alert('No puedes seleccionar una fecha propuesta anterior a hoy');
          setLoading(false);
          return;
        }
        
        // Validar que no sea fin de semana (0 = domingo, 6 = sábado)
        if (originalDate.getDay() === 0 || originalDate.getDay() === 6) {
          alert('La fecha original no puede ser fin de semana (no hay clases)');
          setLoading(false);
          return;
        }
        
        if (proposedDate.getDay() === 0 || proposedDate.getDay() === 6) {
          alert('La fecha propuesta no puede ser fin de semana (no hay clases)');
          setLoading(false);
          return;
        }
        
        // Validar que la fecha propuesta esté en la misma semana que la original
        const getWeekNumber = (d) => {
          const date = new Date(d);
          date.setHours(0, 0, 0, 0);
          date.setDate(date.getDate() + 4 - (date.getDay() || 7));
          const yearStart = new Date(date.getFullYear(), 0, 1);
          return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
        };
        
        if (getWeekNumber(originalDate) !== getWeekNumber(proposedDate)) {
          console.log('La fecha propuesta debe estar en la misma semana que la fecha original del examen');
          alert('La fecha propuesta debe estar en la misma semana que la fecha original del examen');
          setLoading(false);
          return;
        }
      }

      const requestData = {
        type: formData.type,
        courseId: parseInt(formData.courseId),
        motivo: formData.motivo || '',
        description: formData.description,
        requestedDate: formData.requestedDate || new Date().toISOString().split('T')[0]
      };

      // Add specific fields based on request type
      if (formData.type === 'assignment_extension' || formData.type === 'exam_date_change') {
        if (formData.fechaOriginal) requestData.fechaOriginal = formData.fechaOriginal;
        if (formData.fechaPropuesta) {
          requestData.fechaPropuesta = formData.fechaPropuesta;
          requestData.newDate = formData.fechaPropuesta;
        }
      }

      await accommodationAPI.createRequest(requestData);
      
      // Reset form
      setFormData({
        type: '',
        courseId: '',
        motivo: '',
        fechaOriginal: '',
        fechaPropuesta: '',
        extensionDays: '',
        requestedDate: new Date().toISOString().split('T')[0],
        description: ''
      });

      // Reload requests and switch to list tab
      if (user?.role === 'student') {
        await loadStudentRequests();
        setActiveTab('list');
      }
      
      alert('Solicitud enviada exitosamente');
    } catch (error) {
      console.error('Error creating request:', error);
      alert('Error al enviar la solicitud: ' + (error.response?.data?.error || error.message));
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
      'exam_date_change': 'Cambio de fecha de examen',
      'assignment_extension': 'Extensión de entrega'
    };
    return types[type] || type;
  };

  const getRequestCategoryLabel = (type) => {
    // Actualmente todas las solicitudes aquí son acomodaciones (excepto posible aviso de falta si se mezclara)
    return type === 'absence_notification' ? 'Aviso' : 'Acomodación';
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
      <main id="main-content" role="main" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-app text-app">
        <div className="py-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Solicitudes</h1>
          
          {/* Tabs */}
          <div className="mt-6">
            <div className="border-b border-gray-200 dark:border-gray-700">
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
            <div className="mt-6 card shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                  Crear Nueva Solicitud
                </h3>
                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Tipo de Solicitud
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                      className="mt-1 input"
                    >
                      <option value="">Seleccionar tipo</option>
                      <option value="exam_date_change">Cambio de fecha de examen</option>
                      <option value="assignment_extension">Extensión de entrega</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Curso
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

                  {(formData.type === 'assignment_extension' || formData.type === 'exam_date_change') && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                          Fecha Original del Examen
                        </label>
                        <input
                          type="date"
                          name="fechaOriginal"
                          value={formData.fechaOriginal}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split('T')[0]}
                          required
                          className="mt-1 input"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                          Fecha Propuesta (debe estar en la misma semana)
                        </label>
                        <input
                          type="date"
                          name="fechaPropuesta"
                          value={formData.fechaPropuesta}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split('T')[0]}
                          required
                          className="mt-1 input"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Motivo
                    </label>
                    <textarea
                      name="motivo"
                      value={formData.motivo}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="mt-1 input"
                      placeholder="Explica el motivo de tu solicitud..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Descripción Adicional
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="mt-1 input"
                      placeholder="Información adicional (opcional)..."
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary disabled:opacity-50"
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
              <div className="card shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {requests.map((request) => (
                    <li key={request.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-blue-600 dark:text-blue-300 truncate">
                                {getRequestTypeLabel(request.type)}
                              </p>
                              <div className="ml-2 flex-shrink-0 flex">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                                  {getStatusLabel(request.status)}
                                </span>
                              </div>
                            </div>
                            <div className="mt-2">
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-300">
                                <p>
                                  <span className="font-medium">Curso:</span> {request.course?.name}
                                </p>
                              </div>
                              <div className="mt-1">
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  <span className="font-medium">Motivo:</span> {request.motivo}
                                </p>
                              </div>
                              {request.description && (
                                <div className="mt-1">
                                  <p className="text-sm text-gray-600 dark:text-gray-300">
                                    <span className="font-medium">Descripción Adicional:</span> {request.description}
                                  </p>
                                </div>
                              )}
                              {request.fechaOriginal && (
                                <div className="mt-1">
                                  <p className="text-sm text-gray-600 dark:text-gray-300">
                                    <span className="font-medium">Fecha Original:</span> {new Date(request.fechaOriginal).toLocaleDateString()}
                                  </p>
                                </div>
                              )}
                              {request.fechaPropuesta && (
                                <div className="mt-1">
                                  <p className="text-sm text-gray-600 dark:text-gray-300">
                                    <span className="font-medium">Fecha Propuesta:</span> {new Date(request.fechaPropuesta).toLocaleDateString()}
                                  </p>
                                </div>
                              )}
                              {request.teacherResponse && (
                                <div className="mt-2">
                                  <p className="text-sm text-gray-600 dark:text-gray-300">
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
      </main>
    );
  }

  // Teacher View
  return (
    <main id="main-content" role="main" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-app text-app">
      <div className="py-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Panel de Solicitudes</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Revisa el estado de las solicitudes de tus estudiantes</p>
          </div>
          <button
            onClick={loadTeacherRequests}
            className="btn btn-primary"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualizar
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-300 truncate">Total</dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">{requests.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="card overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-300 truncate">Pendientes</dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {requests.filter(r => r.status === 'pending').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="card overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-300 truncate">Aprobadas</dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {requests.filter(r => r.status === 'approved').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="card overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-300 truncate">Rechazadas</dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {requests.filter(r => r.status === 'rejected').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: '', label: 'Todas', count: requests.length },
              { key: 'pending', label: 'Pendientes', count: requests.filter(r => r.status === 'pending').length },
              { key: 'approved', label: 'Aprobadas', count: requests.filter(r => r.status === 'approved').length },
              { key: 'rejected', label: 'Rechazadas', count: requests.filter(r => r.status === 'rejected').length }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilters(prev => ({ ...prev, status: tab.key }))}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  filters.status === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        {/* Teacher Requests List */}
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No hay solicitudes</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                Aún no hay solicitudes de estudiantes
              </p>
            </div>
          ) : (
            <div className="card shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {requests.map((request) => (
                <li key={request.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="truncate">
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                              {getRequestCategoryLabel(request.type)} <span className="text-gray-500 dark:text-gray-300">·</span> <span className="text-blue-600 dark:text-blue-300">{getRequestTypeLabel(request.type)}</span>
                            </p>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                              {getStatusLabel(request.status)}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-300">
                            <p>
                              <span className="font-medium">Estudiante:</span> {request.student?.name}
                            </p>
                            <p className="ml-4">
                              <span className="font-medium">Curso:</span> {request.course?.name}
                            </p>
                          </div>
                          <div className="mt-1">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              <span className="font-medium">Motivo:</span> {request.motivo}
                            </p>
                          </div>
                          {request.description && (
                            <div className="mt-1">
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                <span className="font-medium">Descripción Adicional:</span> {request.description}
                              </p>
                            </div>
                          )}
                          {request.fechaOriginal && (
                            <div className="mt-1">
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                <span className="font-medium">Fecha Original:</span> {new Date(request.fechaOriginal).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                          {request.fechaPropuesta && (
                            <div className="mt-1">
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                <span className="font-medium">Fecha Propuesta:</span> {new Date(request.fechaPropuesta).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                          {request.teacherResponse && (
                            <div className="mt-1">
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                <span className="font-medium">Respuesta del Profesor:</span> {request.teacherResponse}
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
        )}
      </div>
    </div>
  </main>
  );
}
