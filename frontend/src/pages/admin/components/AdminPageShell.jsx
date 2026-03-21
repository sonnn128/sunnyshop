import React from 'react';

const AdminPageShell = ({ children, className = '' }) => {
  return (
    <div className={`rounded-2xl border border-gray-200 bg-gray-50/40 p-4 md:p-6 ${className}`}>
      {children}
    </div>
  );
};

export default AdminPageShell;
