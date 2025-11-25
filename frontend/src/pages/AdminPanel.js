import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import CreateUserForm from '../components/CreateUserForm';
import CreateCourseForm from '../components/CreateCourseForm';
import EnrollStudentForm from '../components/EnrollStudentForm';

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('users');

  const sections = [
    { id: 'users', label: 'Gestión de Usuarios', icon: '👥' },
    { id: 'courses', label: 'Gestión de Cursos', icon: '📚' },
    { id: 'enrollments', label: 'Inscripciones', icon: '🎓' }
  ];

  if (user?.role !== 'admin') {
    return (
      <main id="main-content" role="main" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-app text-app">
        <div className="py-6">
          <div className="text-center card">
            <h1 className="text-2xl font-bold text-red-600">Acceso Denegado</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">No tienes permisos para acceder a esta sección.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" role="main" className="min-h-screen bg-app text-app">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Panel de Administración</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">Bienvenido, {user?.name}</p>
            </div>
            <button onClick={logout} className="btn bg-red-600 hover:bg-red-700 text-white">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Secciones del panel">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={'py-4 px-1 border-b-2 font-medium text-sm transition-colors ' + (activeSection === section.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-500')}
              >
                <span className="flex items-center space-x-2">
                  <span>{section.icon}</span>
                  <span>{section.label}</span>
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {activeSection === 'users' && (
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Gestión de Usuarios</h2>
              <p className="text-gray-600 dark:text-gray-300">Crea y administra profesores y estudiantes del sistema.</p>
            </div>
            <div className="card"><CreateUserForm /></div>
          </section>
        )}
        {activeSection === 'courses' && (
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Gestión de Cursos</h2>
              <p className="text-gray-600 dark:text-gray-300">Crea cursos y asígnalos a los profesores.</p>
            </div>
            <div className="card"><CreateCourseForm /></div>
          </section>
        )}
        {activeSection === 'enrollments' && (
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Inscripciones</h2>
              <p className="text-gray-600 dark:text-gray-300">Inscribe estudiantes a los cursos disponibles.</p>
            </div>
            <div className="card"><EnrollStudentForm /></div>
          </section>
        )}
      </div>
    </main>
  );
}
