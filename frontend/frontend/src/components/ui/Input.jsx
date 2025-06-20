import { forwardRef } from 'react';

const Input = forwardRef(({ 
  label, 
  type = 'text', 
  error, 
  icon: Icon,
  className = '',
  ...props 
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`
            block w-full rounded-lg border-0 py-3 px-4 shadow-sm ring-1 ring-inset 
            ${error ? 'ring-red-300' : 'ring-gray-300'} 
            placeholder:text-gray-400 
            focus:ring-2 focus:ring-inset 
            ${error ? 'focus:ring-red-500' : 'focus:ring-primary-500'} 
            ${Icon ? 'pl-10' : 'pl-4'}
            transition-all duration-200 ease-in-out
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;