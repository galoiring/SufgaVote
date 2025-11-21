import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'sonner';

// Components
import CoupleLogin from './components/common/CoupleLogin';
import AdminLogin from './components/common/AdminLogin';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminDashboard from './components/admin/AdminDashboard';
import VotingDashboard from './components/voting/VotingDashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" richColors />
        <Routes>
          {/* Homepage is couple login */}
          <Route path="/" element={<CoupleLogin />} />

          {/* Admin login at specific URL */}
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/voting/*"
            element={
              <ProtectedRoute requireCouple>
                <VotingDashboard />
              </ProtectedRoute>
            }
          />

          {/* Redirect any unknown routes to homepage */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
