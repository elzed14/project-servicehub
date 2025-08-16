import React, { useState } from 'react';
import Input from './Input';
import { security } from '../../utils/security';

interface SecureInputProps {
  type: 'email' | 'password' | 'text';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  showValidation?: boolean;
}

export const SecureInput: React.FC<SecureInputProps> = ({
  type,
  value,
  onChange,
  placeholder,
  required,
  showValidation = true
}) => {
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (newValue: string) => {
    // Sanitisation automatique
    const sanitized = security.sanitizeHtml(newValue);
    onChange(sanitized);

    // Validation en temps réel
    if (showValidation) {
      let newErrors: string[] = [];
      
      if (type === 'email' && newValue && !security.validateEmail(newValue)) {
        newErrors.push('Email invalide');
      }
      
      if (type === 'password' && newValue) {
        const validation = security.validatePassword(newValue);
        newErrors = validation.errors;
      }
      
      setErrors(newErrors);
    }
  };

  return (
    <div className="space-y-1">
      <Input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        className={errors.length > 0 ? 'border-red-500' : ''}
      />
      {showValidation && errors.length > 0 && (
        <div className="text-xs text-red-500 space-y-1">
          {errors.map((error, index) => (
            <div key={index}>• {error}</div>
          ))}
        </div>
      )}
    </div>
  );
};