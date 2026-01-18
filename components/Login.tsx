import React, { useState } from 'react';
import { ADMIN_USERNAME, ADMIN_PASSWORD, APP_TITLE, ERR_LOGIN_FAILED } from '../constants';
import { User } from '../types';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Secure authentication check (in a real app, this hits a backend)
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      onLoginSuccess({
        username: ADMIN_USERNAME,
        fullName: "Quản trị viên",
        role: "admin"
      });
    } else {
      setError(ERR_LOGIN_FAILED);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-indigo-700 p-8 text-center">
          <h1 className="text-2xl font-bold text-white tracking-wide uppercase">{APP_TITLE}</h1>
          <p className="text-indigo-200 mt-2 text-sm">Hệ thống chuyển đổi giọng nói cao cấp</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Tài khoản</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="Nhập tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg shadow-indigo-200"
          >
            ĐĂNG NHẬP HỆ THỐNG
          </button>

          <div className="text-center">
             <p className="text-xs text-gray-400">Chỉ dành cho người dùng được cấp quyền.</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;