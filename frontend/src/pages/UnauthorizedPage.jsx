import React from 'react';
import { Box, Typography, Button, Paper, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock as LockIcon, Home as HomeIcon } from '@mui/icons-material';

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoHome = () => {
    // Determinar la ruta correcta según el tipo de usuario
    const isDocente = !user?.roles || user?.roles.length === 0;
    const isDirector = user?.roles?.includes('Director');
    
    if (isDocente) {
      navigate('/docente/dashboard');
    } else if (isDirector) {
      navigate('/director/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.50',
        p: 3
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 500,
          textAlign: 'center',
          borderRadius: 3
        }}
      >
        <Box sx={{ mb: 3 }}>
          <LockIcon
            sx={{
              fontSize: 80,
              color: 'error.main',
              mb: 2
            }}
          />
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
            Acceso Denegado
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            No tienes permisos para acceder a esta página
          </Typography>
        </Box>

        <Alert severity="warning" sx={{ mb: 3, textAlign: 'left' }}>
          <Typography variant="body2">
            <strong>Tu rol actual:</strong> {
              !user?.roles || user?.roles.length === 0 
                ? 'Docente' 
                : user?.roles?.join(', ')
            }
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Esta página está restringida para otros tipos de usuario.
          </Typography>
        </Alert>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            onClick={handleGoHome}
            sx={{ px: 3 }}
          >
            Ir a mi Panel
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
            sx={{ px: 3 }}
          >
            Volver Atrás
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default UnauthorizedPage;
