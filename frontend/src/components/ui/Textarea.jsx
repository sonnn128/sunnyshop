import React from 'react';
import { cn } from '../../utils/cn';

const Textarea = ({ label, value, onChange, description, className, error, required }) => {
  const id = `textarea-${Math.random().toString(36).substr(2,6)}`;
  return (
    <div className="space-y-2">
      {label && <label htmlFor={id} className={cn('text-sm font-medium', error ? 'text-destructive' : 'text-foreground')}>{label}{required && <span className="text-destructive">*</span>}</label>}
      <textarea id={id} className={cn('w-full rounded-md border border-input px-3 py-2 text-sm', className, error && 'border-destructive')} value={value} onChange={onChange} />
      {description && !error && <p className="text-sm text-muted-foreground">{description}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

export default Textarea;
