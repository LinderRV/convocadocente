import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CircularProgress, Box, Alert, Typography } from '@mui/material';

const ProtectedRoute = ({ children, requiredRoles = [], allowedRoles = null }) => {
  const { isAuthenticated, isLoading, user, getRedirectPath } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras se verifica autenticación
  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si están en la raíz (/), redirigir según el tipo de usuario
  if (location.pathname === '/') {
    const redirectPath = getRedirectPath(user);
    return <Navigate to={redirectPath} replace />;
  }

  // Determinar tipo de usuario
  const isDocente = !user?.roles || user?.roles.length === 0;
  const isDirector = user?.roles?.includes('Director');
  const isAdministrador = user?.roles?.includes('Administrador');
  const isDecano = user?.roles?.includes('Decano');

  // Verificar permisos específicos para rutas protegidas por rol
  if (allowedRoles && allowedRoles.length > 0) {
    const hasAllowedRole = allowedRoles.some(role => {
      switch (role) {
        case 'docente':
          return isDocente;
        case 'director':
          return isDirector;
        case 'admin':
          return isAdministrador;
        case 'decano':
          return isDecano;
        default:
          return false;
      }
    });

    if (!hasAllowedRole) {
      return (
        <Box sx={{ p: 3 }}>
          <Alert severity="error">
            <Typography variant="h6">Acceso Denegado</Typography>
            <Typography>
              No tienes permisos para acceder a esta página.
            </Typography>
          </Alert>
        </Box>
      );
    }
  }

  // Si se requieren roles específicos, verificar que el usuario los tenga
  if (requiredRoles.length > 0 && !requiredRoles.includes(user?.rol)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
