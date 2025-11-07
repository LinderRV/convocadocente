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
import UsuariosPage from './pages/UsuariosPage';
import CursosPage from './pages/CursosPage';
import PostulacionesPage from './pages/PostulacionesPage';
import LoginPage from './pages/LoginPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Pages Docentes
import DashboardDocente from './components/docentes/DashboardDocente';
import PerfilDocentePage from './pages/docentes/PerfilDocentePage';
import FormacionesPage from './pages/docentes/FormacionesPage';
import ExperienciasPage from './pages/docentes/ExperienciasPage';
import CrearPostulacionPage from './pages/docentes/CrearPostulacionPage';
import PostulacionesDocentePage from './pages/docentes/ListaPostulacionesPage';

// Pages Directores
import DashboardDirector from './components/directores/DashboardDirector';

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
              <Route index element={
                <ProtectedRoute allowedRoles={['admin', 'decano']}>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="dashboard" element={
                <ProtectedRoute allowedRoles={['admin', 'decano']}>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="usuarios" element={
                <ProtectedRoute allowedRoles={['admin', 'decano']}>
                  <UsuariosPage />
                </ProtectedRoute>
              } />
              <Route path="cursos" element={<CursosPage />} />
              <Route path="postulaciones" element={
                <ProtectedRoute allowedRoles={['admin', 'decano', 'director']}>
                  <PostulacionesPage />
                </ProtectedRoute>
              } />
              <Route path="convocatorias" element={<div>Convocatorias</div>} />
              <Route path="perfil" element={<div>Perfil</div>} />
              <Route path="configuracion" element={<div>Configuración</div>} />
              
              {/* Rutas para DOCENTES */}
              <Route path="docente/dashboard" element={
                <ProtectedRoute allowedRoles={['docente']}>
                  <DashboardDocente />
                </ProtectedRoute>
              } />
              <Route path="docente/perfil" element={
                <ProtectedRoute allowedRoles={['docente']}>
                  <PerfilDocentePage />
                </ProtectedRoute>
              } />
              <Route path="docente/formaciones" element={
                <ProtectedRoute allowedRoles={['docente']}>
                  <FormacionesPage />
                </ProtectedRoute>
              } />
              <Route path="docente/experiencias" element={
                <ProtectedRoute allowedRoles={['docente']}>
                  <ExperienciasPage />
                </ProtectedRoute>
              } />
              <Route path="docente/crearpostulacion" element={
                <ProtectedRoute allowedRoles={['docente']}>
                  <CrearPostulacionPage />
                </ProtectedRoute>
              } />
              <Route path="docente/postulaciones" element={
                <ProtectedRoute allowedRoles={['docente']}>
                  <PostulacionesDocentePage />
                </ProtectedRoute>
              } />
              
              {/* Rutas para DIRECTORES */}
              <Route path="director/dashboard" element={
                <ProtectedRoute allowedRoles={['director']}>
                  <DashboardDirector />
                </ProtectedRoute>
              } />
              
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
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<div>Página no encontrada</div>} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
