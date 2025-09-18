import React from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Registro Deshabilitado
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            El registro de nuevos usuarios está deshabilitado.
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Solo los administradores pueden crear nuevas cuentas.
          </p>
          <div className="mt-6">
            <Link 
              to="/login" 
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}