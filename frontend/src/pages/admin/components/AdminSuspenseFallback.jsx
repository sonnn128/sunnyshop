import React from 'react';

const AdminSuspenseFallback = () => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-10 md:p-14 shadow-sm">
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
        <div>
          <p className="text-sm font-medium text-gray-900">Đang tải dữ liệu...</p>
          <p className="mt-1 text-xs text-gray-500">Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    </div>
  );
};

export default AdminSuspenseFallback;
