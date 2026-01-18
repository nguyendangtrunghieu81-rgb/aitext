import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { User, LoginStatus } from './types';

const App: React.FC = () => {
  const [loginStatus, setLoginStatus] = useState<LoginStatus>(LoginStatus.LOGGED_OUT);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setLoginStatus(LoginStatus.LOGGED_IN);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginStatus(LoginStatus.LOGGED_OUT);
  };

  // If apiKey is missing, show a critical error screen (development safety)
  if (!process.env.API_KEY) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white p-6 text-center">
        <div>
          <h1 className="text-3xl font-bold text-red-500 mb-4">Cấu hình chưa hoàn tất</h1>
          <p>Không tìm thấy <code>process.env.API_KEY</code>.</p>
          <p className="mt-2 text-gray-400">Vui lòng kiểm tra file cấu hình hoặc biến môi trường.</p>
        </div>
      </div>
    );
  }

  // Routing Logic
  if (loginStatus === LoginStatus.LOGGED_IN && currentUser) {
    return <Dashboard user={currentUser} onLogout={handleLogout} />;
  }

  return <Login onLoginSuccess={handleLoginSuccess} />;
};

export default App;