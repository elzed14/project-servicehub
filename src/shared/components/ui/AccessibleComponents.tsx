import React from 'react';
import { motion } from 'framer-motion';

// Composant accessible pour les liens de navigation
export const AccessibleNavLink: React.FC<{
  href: string;
  children: React.ReactNode;
  current?: boolean;
}> = ({ href, children, current = false }) => (
  <a
    href={href}
    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
      current 
        ? 'bg-blue-600 text-white' 
        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
    }`}
    aria-current={current ? 'page' : undefined}
  >
    {children}
  </a>
);

// Composant de saut de navigation pour l'accessibilité
export const SkipToContent: React.FC = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
  >
    Aller au contenu principal
  </a>
);

// Composant d'image accessible avec lazy loading
export const AccessibleImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}> = ({ src, alt, className = '', loading = 'lazy' }) => (
  <img
    src={src}
    alt={alt}
    loading={loading}
    className={`${className}`}
    onError={(e) => {
      e.currentTarget.src = '/placeholder-image.jpg';
    }}
  />
);

// Composant de formulaire accessible
export const AccessibleForm: React.FC<{
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
}> = ({ children, onSubmit, title }) => (
  <form onSubmit={onSubmit} role="form" aria-labelledby="form-title">
    <h2 id="form-title" className="sr-only">{title}</h2>
    {children}
  </form>
);

// Input accessible avec validation
export const AccessibleInput: React.FC<{
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  error?: string;
  value: string;
  onChange: (value: string) => void;
}> = ({ id, label, type = 'text', required = false, error, value, onChange }) => (
  <div className="mb-4">
    <label 
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-2"
    >
      {label}
      {required && <span className="text-red-500 ml-1" aria-label="requis">*</span>}
    </label>
    <input
      id={id}
      type={type}
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
      aria-invalid={error ? 'true' : 'false'}
      aria-describedby={error ? `${id}-error` : undefined}
    />
    {error && (
      <p id={`${id}-error`} className="mt-1 text-sm text-red-600" role="alert">
        {error}
      </p>
    )}
  </div>
);

// Composant de notification accessible
export const AccessibleAlert: React.FC<{
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}> = ({ type, message, onClose }) => {
  const colors = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200'
  };

  return (
    <div
      className={`p-4 border rounded-md ${colors[type]}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex justify-between items-start">
        <p>{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 text-current hover:opacity-75"
            aria-label="Fermer la notification"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};