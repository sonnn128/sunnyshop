import React from 'react';

const Toggle = ({ checked, onChange, label }) => {
  return (
    <label className="inline-flex items-center space-x-2 cursor-pointer">
      <span className={`w-10 h-6 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-muted'}`} onClick={() => onChange(!checked)}>
        <span className={`inline-block w-4 h-4 bg-white rounded-full transform transition-transform ${checked ? 'translate-x-4' : 'translate-x-1'}`} />
      </span>
      {label && <span className="text-sm">{label}</span>}
    </label>
  );
};

export default Toggle;
