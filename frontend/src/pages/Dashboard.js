import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import SuperAdminPanel from './SuperAdminPanel';
// AdminDashboard ya no se muestra aquí para evitar duplicar funciones de /admin

export default function Dashboard() {
  const { user } = useAuth();
  
  // Si es admin, redirigir al panel dedicado /admin para evitar duplicación
  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  
  // Profesores ahora usan el mismo panel base con tarjetas para navegar (Solicitudes / Faltas)
  
  console.log('User data:', user);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-app text-app">
      <div className="py-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Panel</h1>
        <div className="mt-6">
          <div className="card shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                ¡Bienvenido, {user?.name}!
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-600 dark:text-gray-200">
                {user?.role === 'student' ? 'Panel de Estudiante' : user?.role === 'teacher' ? 'Panel de Profesor' : user?.role}
              </p>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700">
              <dl>
                <div className="bg-gray-50 dark:bg-gray-800/60 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-600 dark:text-gray-300">Nombre completo</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                    {user?.name}
                  </dd>
                </div>
                <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-600 dark:text-gray-300">Correo electrónico</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                    {user?.email}
                  </dd>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/60 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-600 dark:text-gray-300">Rol</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                    {user?.role === 'student' ? 'estudiante' : user?.role}
                  </dd>
                </div>
                {user?.role === 'student' && (
                  <>
                    <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-600 dark:text-gray-300">Matrícula</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                        {user?.studentId}
                      </dd>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/60 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-600 dark:text-gray-300">Facultad</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                        {user?.faculty || 'No especificada'}
                      </dd>
                    </div>
                  </>
                )}
              </dl>
            </div>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" aria-label="Accesos rápidos">
          <Link
            to="/solicitudes"
            className="relative group card p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg hover:shadow-md transition-shadow"
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 ring-4 ring-white dark:ring-gray-900">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                <span className="absolute inset-0" aria-hidden="true" />
                Solicitudes
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-200">
                {user?.role === 'student' 
                  ? 'Crear y gestionar tus solicitudes de extensión y cambio de examen'
                  : 'Revisar y aprobar solicitudes de tus estudiantes'
                }
              </p>
            </div>
            <span className="pointer-events-none absolute top-6 right-6 text-gray-300 dark:text-gray-500 group-hover:text-gray-400 dark:group-hover:text-gray-400" aria-hidden="true">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
              </svg>
            </span>
          </Link>

          <Link
            to="/faltas"
            className="relative group card p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg hover:shadow-md transition-shadow"
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 ring-4 ring-white dark:ring-gray-900">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                <span className="absolute inset-0" aria-hidden="true" />
                Gestión de Faltas
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-200">
                {user?.role === 'student' 
                  ? 'Ver tus faltas y avisar sobre faltas futuras'
                  : 'Revisar faltas notificadas por estudiantes y registrar observaciones'
                }
              </p>
            </div>
            <span className="pointer-events-none absolute top-6 right-6 text-gray-300 dark:text-gray-500 group-hover:text-gray-400 dark:group-hover:text-gray-400" aria-hidden="true">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
              </svg>
            </span>
          </Link>

          <Link
            to="/mis-solicitudes"
            className="relative group card p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg hover:shadow-md transition-shadow"
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 ring-4 ring-white dark:ring-gray-900">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                <span className="absolute inset-0" aria-hidden="true" />
                Mis Solicitudes
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-200">
                Revisa el estado de tus solicitudes enviadas
              </p>
            </div>
            <span className="pointer-events-none absolute top-6 right-6 text-gray-300 dark:text-gray-500 group-hover:text-gray-400 dark:group-hover:text-gray-400" aria-hidden="true">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
} 