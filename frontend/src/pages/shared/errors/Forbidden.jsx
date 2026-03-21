import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldX, Home, ArrowLeft } from 'lucide-react';

const Forbidden = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <ShieldX className="w-12 h-12 text-error" />
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-6xl font-bold text-gray-900 mb-4">403</h1>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Truy cập bị từ chối
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-8">
          Xin lỗi, bạn không có quyền truy cập trang này. Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Home className="w-5 h-5 mr-2" />
            Về trang chủ
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg text-sm text-left">
          <h3 className="font-semibold text-blue-900 mb-2">
            Bạn cần quyền truy cập?
          </h3>
          <ul className="text-blue-800 space-y-1">
            <li>• Liên hệ với quản trị viên hệ thống</li>
            <li>• Kiểm tra vai trò tài khoản của bạn</li>
            <li>• Đăng nhập lại nếu phiên làm việc đã hết hạn</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
