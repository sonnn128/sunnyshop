import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DebugAuth = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [tokenInfo, setTokenInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get from localStorage
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    try {
      setUserInfo({
        raw: userStr,
        parsed: userStr ? JSON.parse(userStr) : null
      });
    } catch (e) {
      setUserInfo({
        raw: userStr,
        error: e.message
      });
    }
    
    setTokenInfo(token);
  }, []);

  const clearAuth = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    alert('Đã xóa auth data!');
    window.location.reload();
  };

  const setTestAdmin = () => {
    const testUser = {
      _id: 'test123',
      email: 'admin@test.com',
      username: 'Admin Test',
      role: 'admin'
    };
    localStorage.setItem('user', JSON.stringify(testUser));
    localStorage.setItem('token', 'test-token');
    alert('Đã set test admin!');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-6">🔍 Debug Authentication</h1>
          
          {/* User Info */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">User Object (localStorage)</h2>
            <div className="bg-gray-50 p-4 rounded border">
              <pre className="text-sm overflow-auto">
                {JSON.stringify(userInfo, null, 2)}
              </pre>
            </div>
          </div>

          {/* Token Info */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Token (localStorage)</h2>
            <div className="bg-gray-50 p-4 rounded border">
              <pre className="text-sm overflow-auto break-all">
                {tokenInfo || 'No token'}
              </pre>
            </div>
          </div>

          {/* Parsed Info */}
          {userInfo?.parsed && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">📋 User Details</h2>
              <div className="bg-blue-50 p-4 rounded border border-blue-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>ID:</strong> {userInfo.parsed._id || 'N/A'}
                  </div>
                  <div>
                    <strong>Email:</strong> {userInfo.parsed.email || 'N/A'}
                  </div>
                  <div>
                    <strong>Username:</strong> {userInfo.parsed.username || userInfo.parsed.fullName || 'N/A'}
                  </div>
                  <div>
                    <strong className={userInfo.parsed.role ? 'text-green-600' : 'text-red-600'}>
                      Role:
                    </strong> {userInfo.parsed.role || '❌ KHÔNG CÓ ROLE'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Role Check */}
          {userInfo?.parsed && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">🛡️ Role Check</h2>
              <div className="bg-gray-50 p-4 rounded border">
                <div className="space-y-2">
                  <div>
                    <strong>Has role field:</strong> {userInfo.parsed.role ? '✅ Yes' : '❌ No'}
                  </div>
                  <div>
                    <strong>Role value:</strong> {userInfo.parsed.role || 'undefined'}
                  </div>
                  <div>
                    <strong>Is Admin User:</strong> {['staff', 'manager', 'admin'].includes(userInfo.parsed.role) ? '✅ Yes' : '❌ No'}
                  </div>
                  <div>
                    <strong>Can access admin panel:</strong> {['staff', 'manager', 'admin'].includes(userInfo.parsed.role) ? '✅ Yes' : '❌ No (customer or no role)'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold mb-3">Actions</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={clearAuth}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                🗑️ Clear Auth Data
              </button>
              <button
                onClick={setTestAdmin}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                ✅ Set Test Admin
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                🔐 Go to Login
              </button>
              <button
                onClick={() => navigate('/admin-panel')}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                🎛️ Try Admin Panel
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                🔄 Reload
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <h3 className="font-semibold mb-2">📝 Hướng dẫn:</h3>
            <ol className="list-decimal ml-5 space-y-1 text-sm">
              <li>Kiểm tra "User Object" có field <code className="bg-yellow-100 px-1">role</code> không</li>
              <li>Nếu KHÔNG có role → Backend chưa trả về role trong login response</li>
              <li>Nếu CÓ role nhưng = "customer" → User này không phải admin</li>
              <li>Nếu CÓ role = "staff/manager/admin" → Nên vào được admin panel</li>
              <li>Click "Set Test Admin" để test với admin giả</li>
              <li>Click "Try Admin Panel" để thử vào admin panel</li>
            </ol>
          </div>

          {/* Fix Instructions */}
          {userInfo?.parsed && !userInfo.parsed.role && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
              <h3 className="font-semibold text-red-700 mb-2">❌ Vấn đề: User không có role!</h3>
              <p className="text-sm mb-2">Backend cần làm:</p>
              <ol className="list-decimal ml-5 space-y-1 text-sm">
                <li>Thêm field <code className="bg-red-100 px-1">role</code> vào User model</li>
                <li>Login API phải trả về: <code className="bg-red-100 px-1">{'{ user: { ..., role: "admin" }, token: "..." }'}</code></li>
                <li>Update existing users với default role = "customer"</li>
                <li>Set admin users với role = "admin"</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebugAuth;
