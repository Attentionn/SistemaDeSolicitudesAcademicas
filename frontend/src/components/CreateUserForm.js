import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const CreateUserForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    studentId: '',
    faculty: ''
  });
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/faculties`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setFaculties(response.data);
    } catch (error) {
      console.error('Error fetching faculties:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (e) => {
    const role = e.target.value;
    setFormData(prev => ({
      ...prev,
      role,
      studentId: role === 'teacher' ? '' : prev.studentId
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const dataToSend = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        faculty: formData.faculty || null
      };

      if (formData.role === 'student') {
        dataToSend.studentId = formData.studentId;
      }

      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/users`, dataToSend, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessage({ 
        type: 'success', 
        text: `${formData.role === 'student' ? 'Estudiante' : 'Profesor'} creado exitosamente` 
      });
      
      // Limpiar formulario
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'student',
        studentId: '',
        faculty: ''
      });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Error al crear usuario' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Crear Usuario
      </h2>

      {message.text && (
        <div className={`mb-4 p-4 rounded ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tipo de Usuario */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Tipo de Usuario *
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleRoleChange}
            className="input w-full"
            required
          >
            <option value="student">Estudiante</option>
            <option value="teacher">Profesor</option>
          </select>
        </div>

        {/* Nombre Completo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Nombre Completo *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input w-full"
            placeholder="Ej: Juan Pérez García"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input w-full"
            placeholder="ejemplo@ucol.mx"
            required
          />
        </div>

        {/* Contraseña */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Contraseña *
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="input w-full"
            placeholder="Mínimo 8 caracteres"
            minLength="8"
            required
          />
        </div>

        {/* ID de Estudiante (solo si es estudiante) */}
        {formData.role === 'student' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              ID de Estudiante *
            </label>
            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              className="input w-full"
              placeholder="Ej: 20231001"
              required={formData.role === 'student'}
            />
          </div>
        )}

        {/* Facultad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Facultad
          </label>
          {faculties.length > 0 ? (
            <select
              name="faculty"
              value={formData.faculty}
              onChange={handleChange}
              className="input w-full"
            >
              <option value="">Seleccionar facultad...</option>
              {faculties.map(faculty => (
                <option key={faculty.id} value={faculty.name}>
                  {faculty.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              name="faculty"
              value={formData.faculty}
              onChange={handleChange}
              className="input w-full"
              placeholder="Ej: Telemática"
            />
          )}
        </div>

        {/* Botón Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full disabled:opacity-50"
        >
          {loading ? 'Creando...' : `Crear ${formData.role === 'student' ? 'Estudiante' : 'Profesor'}`}
        </button>
      </form>
    </div>
  );
};

export default CreateUserForm;
