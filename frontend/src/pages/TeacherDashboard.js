import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/requests/teacher');
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (requestId, type) => {
    try {
      if (type === 'accommodation') {
        await axios.patch(`http://localhost:5000/api/accommodations/${requestId}`, {
          status: 'approved'
        });
      } else if (type === 'absence') {
        await axios.patch(`http://localhost:5000/api/absences/${requestId}`, {
          status: 'approved'
        });
      }
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleRejectRequest = async (requestId, type, teacherResponse = '') => {
    try {
      if (type === 'accommodation') {
        await axios.patch(`http://localhost:5000/api/accommodations/${requestId}`, {
          status: 'rejected',
          teacherResponse
        });
      } else if (type === 'absence') {
        await axios.patch(`http://localhost:5000/api/absences/${requestId}`, {
          status: 'rejected',
          observaciones: teacherResponse
        });
      }
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const filteredRequests = requests.filter(request => {
    if (activeTab === 'pending') return request.status === 'pending';
    if (activeTab === 'approved') return request.status === 'approved';
    if (activeTab === 'rejected') return request.status === 'rejected';
    return true;
  });

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Pendiente',
      approved: 'Aprobada',
      rejected: 'Rechazada'
    };
    return texts[status] || status;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Profesor</h1>
          <p className="mt-2 text-gray-600">Gestiona las solicitudes de tus estudiantes</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
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
                    <dt className="text-sm font-medium text-gray-500 truncate">Pendientes</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {requests.filter(r => r.status === 'pending').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
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
                    <dt className="text-sm font-medium text-gray-500 truncate">Aprobadas</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {requests.filter(r => r.status === 'approved').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
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
                    <dt className="text-sm font-medium text-gray-500 truncate">Rechazadas</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {requests.filter(r => r.status === 'rejected').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'pending', label: 'Pendientes', count: requests.filter(r => r.status === 'pending').length },
              { key: 'approved', label: 'Aprobadas', count: requests.filter(r => r.status === 'approved').length },
              { key: 'rejected', label: 'Rechazadas', count: requests.filter(r => r.status === 'rejected').length }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay solicitudes</h3>
              <p className="mt-1 text-sm text-gray-500">
                {activeTab === 'pending' 
                  ? 'No tienes solicitudes pendientes de revisión'
                  : `No hay solicitudes ${activeTab === 'approved' ? 'aprobadas' : 'rechazadas'}`
                }
              </p>
            </div>
          ) : (
            filteredRequests.map(request => (
              <div key={request.id} className="bg-white shadow rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {request.student?.name}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(request.status)}`}>
                        {getStatusText(request.status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Curso</p>
                        <p className="text-sm font-medium text-gray-900">{request.course?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Tipo de solicitud</p>
                        <p className="text-sm font-medium text-gray-900">
                          {request.type === 'absence' ? 'Ausencia' : 'Acomodación'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Fecha de solicitud</p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Matrícula</p>
                        <p className="text-sm font-medium text-gray-900">{request.student?.studentId}</p>
                      </div>
                    </div>

                    {request.motivo && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-500">Motivo</p>
                        <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                          {request.motivo}
                        </p>
                      </div>
                    )}
                    {request.description && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-500">Descripción Adicional</p>
                        <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                          {request.description}
                        </p>
                      </div>
                    )}

                    {/* Campos específicos de acomodaciones */}
                    {request.type === 'accommodation' && (
                      <div className="mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {request.requestedDate && (
                            <div>
                              <p className="text-sm text-gray-500">Fecha Original</p>
                              <p className="text-sm font-medium text-gray-900">
                                {new Date(request.requestedDate).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                          {request.newDate && (
                            <div>
                              <p className="text-sm text-gray-500">Fecha Propuesta</p>
                              <p className="text-sm font-medium text-gray-900">
                                {new Date(request.newDate).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                          {request.newClassroom && (
                            <div>
                              <p className="text-sm text-gray-500">Nuevo Aula</p>
                              <p className="text-sm font-medium text-gray-900">
                                {request.newClassroom}
                              </p>
                            </div>
                          )}
                          {request.extensionDays && (
                            <div>
                              <p className="text-sm text-gray-500">Días de Extensión</p>
                              <p className="text-sm font-medium text-gray-900">
                                {request.extensionDays} días
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Campos específicos de ausencias */}
                    {request.type === 'absence' && request.fecha && (
                      <div className="mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Fecha de Ausencia</p>
                            <p className="text-sm font-medium text-gray-900">
                              {new Date(request.fecha).toLocaleDateString()}
                            </p>
                          </div>
                          {request.materia && (
                            <div>
                              <p className="text-sm text-gray-500">Materia</p>
                              <p className="text-sm font-medium text-gray-900">
                                {request.materia}
                              </p>
                            </div>
                          )}
                          {request.tipo && (
                            <div>
                              <p className="text-sm text-gray-500">Tipo de Ausencia</p>
                              <p className="text-sm font-medium text-gray-900">
                                {request.tipo}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {request.teacherComment && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-500">Comentario del profesor</p>
                        <p className="text-sm text-gray-900 bg-blue-50 p-3 rounded-md">
                          {request.teacherComment}
                        </p>
                      </div>
                    )}
                  </div>

                  {request.status === 'pending' && (
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleApproveRequest(request.id, request.type)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Aprobar
                      </button>
                      <button
                        onClick={() => {
                          const response = prompt('Motivo del rechazo (opcional):');
                          handleRejectRequest(request.id, request.type, response || '');
                        }}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Rechazar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
