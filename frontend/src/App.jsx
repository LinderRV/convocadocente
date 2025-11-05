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
import LoginPage from './pages/LoginPage';

// Pages Docentes
import DashboardDocente from './components/docentes/DashboardDocente';
import PerfilDocentePage from './pages/docentes/PerfilDocentePage';
import FormacionesPage from './pages/docentes/FormacionesPage';
import ExperienciasPage from './pages/docentes/ExperienciasPage';
import CrearPostulacionPage from './pages/docentes/CrearPostulacionPage';
import PostulacionesPage from './pages/docentes/PostulacionesPage';

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
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="usuarios" element={<UsuariosPage />} />
              <Route path="cursos" element={<CursosPage />} />
              <Route path="convocatorias" element={<div>Convocatorias</div>} />
              <Route path="perfil" element={<div>Perfil</div>} />
              <Route path="configuracion" element={<div>Configuración</div>} />
              
              {/* Rutas para DOCENTES */}
              <Route path="docente/dashboard" element={<DashboardDocente />} />
              <Route path="docente/perfil" element={<PerfilDocentePage />} />
              <Route path="docente/formaciones" element={<FormacionesPage />} />
              <Route path="docente/experiencias" element={<ExperienciasPage />} />
              <Route path="docente/crearpostulacion" element={<CrearPostulacionPage />} />
              <Route path="docente/postulaciones" element={<PostulacionesPage />} />
              
              {/* Rutas para DIRECTORES */}
              <Route path="director/dashboard" element={<DashboardDirector />} />
              
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
