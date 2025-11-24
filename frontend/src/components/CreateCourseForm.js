import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const CreateCourseForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    schedule: '',
    classroom: '',
    teacherId: ''
  });
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/users?role=teacher`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeachers(response.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/courses`, {
        ...formData,
        teacherId: parseInt(formData.teacherId)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessage({ 
        type: 'success', 
        text: 'Curso creado exitosamente' 
      });
      
      // Limpiar formulario
      setFormData({
        name: '',
        code: '',
        description: '',
        schedule: '',
        classroom: '',
        teacherId: ''
      });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Error al crear curso' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Crear Curso
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

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre del Curso */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Curso *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: Programación Web"
            required
          />
        </div>

        {/* Código */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Código del Curso *
          </label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: TEL101"
            required
          />
          <p className="text-sm text-gray-500 mt-1">Debe ser único</p>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Descripción del curso"
            rows="3"
          />
        </div>

        {/* Horario */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Horario
          </label>
          <input
            type="text"
            name="schedule"
            value={formData.schedule}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: Lunes y Miércoles 10:00-12:00"
          />
        </div>

        {/* Salón */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Salón/Aula
          </label>
          <input
            type="text"
            name="classroom"
            value={formData.classroom}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: Lab 3"
          />
        </div>

        {/* Profesor Asignado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profesor Asignado *
          </label>
          <select
            name="teacherId"
            value={formData.teacherId}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Seleccionar profesor...</option>
            {teachers.map(teacher => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name} ({teacher.email})
              </option>
            ))}
          </select>
          {teachers.length === 0 && (
            <p className="text-sm text-orange-600 mt-1">
              ⚠️ Primero debes crear al menos un profesor
            </p>
          )}
        </div>

        {/* Botón Submit */}
        <button
          type="submit"
          disabled={loading || teachers.length === 0}
          className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-colors ${
            loading || teachers.length === 0
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Creando...' : 'Crear Curso'}
        </button>
      </form>
    </div>
  );
};

export default CreateCourseForm;
