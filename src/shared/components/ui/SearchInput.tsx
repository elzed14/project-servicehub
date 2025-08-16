import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Clock } from 'lucide-react';

interface SearchSuggestion {
  id: string;
  text: string;
  type?: 'recent' | 'suggestion' | 'category';
  icon?: React.ReactNode;
}

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  suggestions?: SearchSuggestion[];
  showSuggestions?: boolean;
  loading?: boolean;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = 'Rechercher...',
  suggestions = [],
  showSuggestions = true,
  loading = false,
  className = ''
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowDropdown(newValue.length > 0 && showSuggestions && suggestions.length > 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch?.(value);
      setShowDropdown(false);
    }
    if (e.key === 'Escape') {
      setShowDropdown(false);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onChange(suggestion.text);
    onSearch?.(suggestion.text);
    setShowDropdown(false);
  };

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.text.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className={`w-5 h-5 ${isFocused ? 'text-blue-500' : 'text-gray-400'}`} />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsFocused(true);
            if (showSuggestions && suggestions.length > 0) {
              setShowDropdown(true);
            }
          }}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`
            w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-colors duration-200
            ${isFocused ? 'border-blue-500' : ''}
          `}
        />

        {value && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showDropdown && filteredSuggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto"
        >
          {filteredSuggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none flex items-center space-x-3"
            >
              <div className="flex-shrink-0">
                {suggestion.icon || (
                  suggestion.type === 'recent' ? (
                    <Clock className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Search className="w-4 h-4 text-gray-400" />
                  )
                )}
              </div>
              <span className="text-gray-900">{suggestion.text}</span>
              {suggestion.type === 'recent' && (
                <span className="text-xs text-gray-500 ml-auto">Récent</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchInput;