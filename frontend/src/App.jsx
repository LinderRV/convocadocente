import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';

// Context providers
import { AuthProvider } from './context/AuthContext';

// Components
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/Layout/Layout';

// Pages
import Dashboard from './components/Dashboard/Dashboard';
import Docentes from './components/Docentes/Docentes';
import LoginPage from './pages/LoginPage';

// Theme
import { theme } from './theme/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<div>Register Page</div>} />
            <Route path="/forgot-password" element={<div>Forgot Password</div>} />
            <Route path="/reset-password" element={<div>Reset Password</div>} />
            <Route path="/verify-email" element={<div>Verify Email</div>} />
            
            {/* Rutas protegidas */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="docentes" element={<Docentes />} />
              <Route path="convocatorias" element={<div>Convocatorias</div>} />
              <Route path="perfil" element={<div>Perfil</div>} />
              
              {/* Rutas para administradores */}
              <Route path="admin/*" element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <div>Admin Panel</div>
                </ProtectedRoute>
              } />
              
              {/* Rutas para coordinadores */}
              <Route path="coordinador/*" element={
                <ProtectedRoute requiredRoles={['admin', 'coordinador']}>
                  <div>Coordinador Panel</div>
                </ProtectedRoute>
              } />
            </Route>
            
            {/* Rutas de error */}
            <Route path="/unauthorized" element={<div>No autorizado</div>} />
            <Route path="*" element={<div>Página no encontrada</div>} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
