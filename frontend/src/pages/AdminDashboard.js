import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingRequest, setEditingRequest] = useState(null);
  const [editComment, setEditComment] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/requests/admin');
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (requestId, type) => {
    try {
      await axios.patch(`http://localhost:5000/api/requests/${requestId}/approve`);
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleRejectRequest = async (requestId, type) => {
    try {
      await axios.patch(`http://localhost:5000/api/requests/${requestId}/reject`);
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const handleDeleteRequest = async (requestId, type) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta solicitud?')) {
      return;
    }
    
    try {
      if (type === 'accommodation') {
        await axios.delete(`http://localhost:5000/api/accommodations/${requestId}`);
      } else {
        await axios.delete(`http://localhost:5000/api/absences/${requestId}`);
      }
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error deleting request:', error);
    }
  };

  const handleEditRequest = (request) => {
    setEditingRequest(request);
    setEditComment(request.teacherComment || '');
  };

  const handleSaveEdit = async () => {
    if (!editingRequest) return;
    
    try {
      await axios.patch(`http://localhost:5000/api/requests/${editingRequest.id}/approve`, {
        teacherComment: editComment
      });
      setEditingRequest(null);
      setEditComment('');
      fetchRequests();
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingRequest(null);
    setEditComment('');
  };

  const filteredRequests = requests.filter(request => {
    // Filter by status
    let statusMatch = true;
    if (activeTab === 'pending') statusMatch = request.status === 'pending';
    else if (activeTab === 'approved') statusMatch = request.status === 'approved';
    else if (activeTab === 'rejected') statusMatch = request.status === 'rejected';
    
    // Filter by search term
    const searchMatch = !searchTerm || 
      request.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.student?.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.course?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.reason?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return statusMatch && searchMatch;
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando solicitudes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
            <p className="mt-2 text-gray-600">
              Gestiona todas las solicitudes del sistema
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              {/* Search Bar */}
              <div className="flex-1 max-w-lg">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar por estudiante, matrícula, curso o motivo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              
              {/* Stats */}
              <div className="flex space-x-4 text-sm text-gray-500">
                <span>Total: {requests.length}</span>
                <span>Pendientes: {requests.filter(r => r.status === 'pending').length}</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { key: 'all', label: 'Todas', count: requests.length },
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
          </div>

          {/* Requests List */}
          <div className="space-y-6">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay solicitudes</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {activeTab === 'all' 
                    ? 'No hay solicitudes en el sistema'
                    : `No hay solicitudes ${getStatusText(activeTab).toLowerCase()}`
                  }
                </p>
              </div>
            ) : (
              filteredRequests.map(request => (
                <div key={`${request.type}-${request.id}`} className="bg-white shadow rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {request.student?.name}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(request.status)}`}>
                          {getStatusText(request.status)}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {request.type === 'absence' ? 'Ausencia' : 'Acomodación'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Curso</p>
                          <p className="text-sm font-medium text-gray-900">{request.course?.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Profesor</p>
                          <p className="text-sm font-medium text-gray-900">{request.teacher?.name}</p>
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
                        <div>
                          <p className="text-sm text-gray-500">Facultad</p>
                          <p className="text-sm font-medium text-gray-900">{request.student?.faculty}</p>
                        </div>
                        {request.fecha && (
                          <div>
                            <p className="text-sm text-gray-500">Fecha de ausencia</p>
                            <p className="text-sm font-medium text-gray-900">
                              {new Date(request.fecha).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>

                      {request.reason && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-500">Motivo</p>
                          <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                            {request.reason}
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

                    {/* Action buttons */}
                    <div className="flex flex-col space-y-2 ml-4">
                      {request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApproveRequest(request.id, request.type)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Aprobar
                          </button>
                          <button
                            onClick={() => handleRejectRequest(request.id, request.type)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Rechazar
                          </button>
                        </>
                      )}
                      
                      {/* Edit button */}
                      <button
                        onClick={() => handleEditRequest(request)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Editar
                      </button>
                      
                      {/* Delete button */}
                      <button
                        onClick={() => handleDeleteRequest(request.id, request.type)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Editar Solicitud
              </h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Estudiante:</strong> {editingRequest.student?.name}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Curso:</strong> {editingRequest.course?.name}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  <strong>Tipo:</strong> {editingRequest.type === 'absence' ? 'Ausencia' : 'Acomodación'}
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comentario/Respuesta
                </label>
                <textarea
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Agrega un comentario o respuesta..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
