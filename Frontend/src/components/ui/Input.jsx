import { forwardRef } from 'react';

export const Input = forwardRef(({ label, error, icon: Icon, ...props }, ref) => (
  <div className="w-full">
    {label && <label className="label-text">{label}</label>}
    <div className="relative">
      {Icon && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-400 pointer-events-none">
          <Icon size={15} />
        </div>
      )}
      <input
        ref={ref}
        className={`input-field ${Icon ? 'pl-10' : ''} ${error ? 'border-primary-400 focus:ring-primary-400/20 focus:border-primary-500' : ''}`}
        {...props}
      />
    </div>
    {error && <p className="mt-1.5 text-xs text-primary-600 font-medium">{error}</p>}
  </div>
));
Input.displayName = 'Input';

export const Textarea = forwardRef(({ label, error, rows = 3, ...props }, ref) => (
  <div className="w-full">
    {label && <label className="label-text">{label}</label>}
    <textarea
      ref={ref}
      rows={rows}
      className={`input-field resize-none ${error ? 'border-primary-400' : ''}`}
      {...props}
    />
    {error && <p className="mt-1.5 text-xs text-primary-600 font-medium">{error}</p>}
  </div>
));
Textarea.displayName = 'Textarea';

export const Select = forwardRef(({ label, error, options = [], placeholder, ...props }, ref) => (
  <div className="w-full">
    {label && <label className="label-text">{label}</label>}
    <select
      ref={ref}
      className={`input-field ${error ? 'border-primary-400' : ''}`}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <p className="mt-1.5 text-xs text-primary-600 font-medium">{error}</p>}
  </div>
));
Select.displayName = 'Select';
