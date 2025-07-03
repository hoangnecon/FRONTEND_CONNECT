// src/components/auth/LoginPage.js
import React from 'react';
import { Shield } from 'lucide-react';

const LoginPage = ({
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  handleLogin,
  handleAdminLogin,
}) => {
  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
      <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">C</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Login to your account</h1>
          <p className="text-gray-400 text-sm">Enter your email below to login to your account</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              placeholder="m@example.com"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-white text-sm font-medium">Password</label>
              <button className="text-orange-500 text-sm hover:text-orange-400">
                Forgot your password?
              </button>
            </div>
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-white text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Login
          </button>

          <div className="text-center text-gray-400 text-sm">
            <p>Or continue with</p>
          </div>

          <button
            onClick={handleAdminLogin}
            className="w-full bg-gray-700 text-white py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
          >
            <Shield size={20} />
            Login as Admin
          </button>

          <div className="text-center text-gray-400 text-sm">
            <span>Don't have an account? </span>
            <button className="text-white hover:text-orange-400">Sign up</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;