import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { adaptRequests, countByStatus } from '../services/requestAdapter';

const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [rawRequests, setRawRequests] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingRequest, setEditingRequest] = useState(null);
  const [editComment, setEditComment] = useState('');

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/requests/admin`, { headers: getAuthHeader() });
      setRawRequests(response.data);
      setRequests(adaptRequests(response.data));
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally { setLoading(false); }
  };

  const handleApproveRequest = async (id, kind) => {
    try {
      if (kind === 'accommodation') {
        await axios.patch(`${API_BASE_URL}/accommodations/${id}`, { status: 'approved' }, { headers: getAuthHeader() });
      } else {
        await axios.patch(`${API_BASE_URL}/absences/${id}`, { tipo: 'justificada' }, { headers: getAuthHeader() });
      }
      fetchRequests();
    } catch (e) { console.error('Error approving request:', e); }
  };

  const handleRejectRequest = async (id, kind, comment = '') => {
    try {
      if (kind === 'accommodation') {
        await axios.patch(`${API_BASE_URL}/accommodations/${id}`, { status: 'rejected', teacherResponse: comment }, { headers: getAuthHeader() });
      } else {
        await axios.patch(`${API_BASE_URL}/absences/${id}`, { tipo: 'injustificada', observaciones: comment }, { headers: getAuthHeader() });
      }
      fetchRequests();
    } catch (e) { console.error('Error rejecting request:', e); }
  };

  const handleDeleteRequest = async (id, kind) => {
    if (!window.confirm('¿Estás seguro de eliminar esta solicitud?')) return;
    try {
      const endpoint = kind === 'accommodation' ? 'accommodations' : 'absences';
      await axios.delete(`${API_BASE_URL}/${endpoint}/${id}`, { headers: getAuthHeader() });
      fetchRequests();
    } catch (e) { console.error('Error deleting request:', e); }
  };

  const handleEditRequest = (req) => {
    setEditingRequest(req);
    setEditComment(req.teacherComment || req.teacherResponse || req.observaciones || '');
  };

  const handleSaveEdit = async () => {
    if (!editingRequest) return;
    try {
      if (editingRequest.kind === 'accommodation') {
        await axios.patch(`${API_BASE_URL}/accommodations/${editingRequest.id}`, { teacherResponse: editComment }, { headers: getAuthHeader() });
      } else {
        await axios.patch(`${API_BASE_URL}/absences/${editingRequest.id}`, { observaciones: editComment }, { headers: getAuthHeader() });
      }
      setEditingRequest(null);
      setEditComment('');
      fetchRequests();
    } catch (e) { console.error('Error updating request:', e); }
  };

  const handleCancelEdit = () => { setEditingRequest(null); setEditComment(''); };

  const filteredRequests = requests.filter(r => {
    if (['pending', 'approved', 'rejected'].includes(activeTab) && r.status !== activeTab) return false;
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return (
      r.student?.name?.toLowerCase().includes(term) ||
      (r.student?.studentId && r.student.studentId.toLowerCase().includes(term)) ||
      r.course?.name?.toLowerCase().includes(term) ||
      (r.motivo && r.motivo.toLowerCase().includes(term)) ||
      (r.description && r.description.toLowerCase().includes(term))
    );
  });

  const stats = countByStatus(requests);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando solicitudes...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
            <p className="mt-2 text-gray-600">Gestiona todas las solicitudes del sistema</p>
          </div>
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex-1 max-w-lg">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
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
              <div className="flex space-x-4 text-sm text-gray-500">
                <span>Total: {stats.total}</span>
                <span>Pendientes: {stats.pending}</span>
              </div>
            </div>
          </div>
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { key: 'all', label: 'Todas', count: stats.total },
                  { key: 'pending', label: 'Pendientes', count: stats.pending },
                  { key: 'approved', label: 'Aprobadas', count: stats.approved },
                  { key: 'rejected', label: 'Rechazadas', count: stats.rejected }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.key ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </nav>
            </div>
          </div>
          <div className="space-y-6">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay solicitudes</h3>
                <p className="mt-1 text-sm text-gray-500">{activeTab === 'all' ? 'No hay solicitudes en el sistema' : `No hay solicitudes en estado ${activeTab}`}</p>
              </div>
            ) : (
              filteredRequests.map(r => (
                <div key={`${r.kind}-${r.id}`} className="bg-white shadow rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{r.student?.name}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${r.badgeClass}`}>{r.statusLabel}</span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{r.kind === 'absence' ? 'Ausencia' : 'Acomodación'}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <div><p className="text-sm text-gray-500">Curso</p><p className="text-sm font-medium text-gray-900">{r.course?.name}</p></div>
                        <div><p className="text-sm text-gray-500">Profesor</p><p className="text-sm font-medium text-gray-900">{r.teacher?.name}</p></div>
                        <div><p className="text-sm text-gray-500">Fecha solicitud</p><p className="text-sm font-medium text-gray-900">{new Date(r.createdAt).toLocaleDateString()}</p></div>
                        <div><p className="text-sm text-gray-500">Matrícula</p><p className="text-sm font-medium text-gray-900">{r.student?.studentId}</p></div>
                        <div><p className="text-sm text-gray-500">Facultad</p><p className="text-sm font-medium text-gray-900">{r.student?.faculty}</p></div>
                        {r.fecha && (<div><p className="text-sm text-gray-500">Fecha ausencia</p><p className="text-sm font-medium text-gray-900">{new Date(r.fecha).toLocaleDateString()}</p></div>)}
                      </div>
                      {r.motivo && (<div className="mb-4"><p className="text-sm text-gray-500">Motivo</p><p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{r.motivo}</p></div>)}
                      {r.description && (<div className="mb-4"><p className="text-sm text-gray-500">Descripción</p><p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{r.description}</p></div>)}
                      {r.kind === 'accommodation' && (
                        <div className="mb-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {r.requestedDate && (<div><p className="text-sm text-gray-500">Fecha Original</p><p className="text-sm font-medium text-gray-900">{new Date(r.requestedDate).toLocaleDateString()}</p></div>)}
                          {r.newDate && (<div><p className="text-sm text-gray-500">Fecha Propuesta</p><p className="text-sm font-medium text-gray-900">{new Date(r.newDate).toLocaleDateString()}</p></div>)}
                          {r.newClassroom && (<div><p className="text-sm text-gray-500">Nuevo Aula</p><p className="text-sm font-medium text-gray-900">{r.newClassroom}</p></div>)}
                          {r.extensionDays && (<div><p className="text-sm text-gray-500">Días Extensión</p><p className="text-sm font-medium text-gray-900">{r.extensionDays} días</p></div>)}
                        </div></div>
                      )}
                      {r.kind === 'absence' && r.fecha && (
                        <div className="mb-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div><p className="text-sm text-gray-500">Fecha Ausencia</p><p className="text-sm font-medium text-gray-900">{new Date(r.fecha).toLocaleDateString()}</p></div>
                          {r.tipo && (<div><p className="text-sm text-gray-500">Tipo</p><p className="text-sm font-medium text-gray-900">{r.tipo}</p></div>)}
                        </div></div>
                      )}
                      {r.teacherComment || r.teacherResponse || r.observaciones ? (
                        <div className="mb-4"><p className="text-sm text-gray-500">Comentario</p><p className="text-sm text-gray-900 bg-blue-50 p-3 rounded-md">{r.teacherComment || r.teacherResponse || r.observaciones}</p></div>
                      ) : null}
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                      {r.status === 'pending' && (
                        <>
                          <button onClick={() => handleApproveRequest(r.id, r.kind)} className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">Aprobar</button>
                          <button onClick={() => handleRejectRequest(r.id, r.kind)} className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">Rechazar</button>
                        </>
                      )}
                      <button onClick={() => handleEditRequest(r)} className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50">Editar</button>
                      <button onClick={() => handleDeleteRequest(r.id, r.kind)} className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">Eliminar</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {editingRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Editar Solicitud</h3>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2"><strong>Estudiante:</strong> {editingRequest.student?.name}</p>
                <p className="text-sm text-gray-600 mb-2"><strong>Curso:</strong> {editingRequest.course?.name}</p>
                <p className="text-sm text-gray-600 mb-4"><strong>Tipo:</strong> {editingRequest.kind === 'absence' ? 'Ausencia' : 'Acomodación'}</p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Comentario/Respuesta</label>
                <textarea value={editComment} onChange={(e) => setEditComment(e.target.value)} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Agrega un comentario o respuesta..." />
              </div>
              <div className="flex justify-end space-x-3">
                <button onClick={handleCancelEdit} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">Cancelar</button>
                <button onClick={handleSaveEdit} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
