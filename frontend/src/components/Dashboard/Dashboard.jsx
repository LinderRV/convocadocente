import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  People as PeopleIcon,
  Work as WorkIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { testConnection } from '../../services/api';

const StatCard = ({ title, value, icon, color = 'primary', trend }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', color: `${color}.main` }}>
          {icon}
        </Box>
        {trend && (
          <Chip
            label={`+${trend}%`}
            size="small"
            color={trend > 0 ? 'success' : 'error'}
            icon={<TrendingUpIcon />}
          />
        )}
      </Box>
      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      setLoading(true);
      const response = await testConnection();
      setConnectionStatus({ success: true, message: response.message });
    } catch (error) {
      setConnectionStatus({
        success: false,
        message: error.response?.data?.message || 'Error de conexión con el servidor',
      });
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: 'Total Docentes',
      value: '24',
      icon: <PeopleIcon sx={{ fontSize: 32 }} />,
      color: 'primary',
      trend: 12,
    },
    {
      title: 'Convocatorias Activas',
      value: '8',
      icon: <WorkIcon sx={{ fontSize: 32 }} />,
      color: 'success',
      trend: 25,
    },
    {
      title: 'Postulaciones',
      value: '156',
      icon: <AssignmentIcon sx={{ fontSize: 32 }} />,
      color: 'warning',
      trend: 8,
    },
    {
      title: 'Procesos Completados',
      value: '12',
      icon: <TrendingUpIcon sx={{ fontSize: 32 }} />,
      color: 'info',
      trend: 15,
    },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Dashboard - Sistema de Convocatorias
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Bienvenido al sistema de gestión de convocatorias docentes
      </Typography>

      {/* Estado de conexión */}
      <Box sx={{ mb: 3 }}>
        {loading ? (
          <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Verificando conexión con la base de datos...
            </Typography>
            <LinearProgress />
          </Box>
        ) : connectionStatus ? (
          <Alert
            severity={connectionStatus.success ? 'success' : 'error'}
            action={
              <Button color="inherit" size="small" onClick={checkConnection}>
                Reintentar
              </Button>
            }
          >
            {connectionStatus.message}
          </Alert>
        ) : null}
      </Box>

      {/* Tarjetas de estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Secciones adicionales */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Actividad Reciente
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Aquí aparecerán las últimas actividades del sistema...
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Alert severity="info">
                  🚀 Sistema listo para usar. Navega a "Docentes" para comenzar a gestionar los registros.
                </Alert>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Acciones Rápidas
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button variant="contained" fullWidth startIcon={<PeopleIcon />}>
                  Agregar Docente
                </Button>
                <Button variant="outlined" fullWidth startIcon={<WorkIcon />}>
                  Nueva Convocatoria
                </Button>
                <Button variant="outlined" fullWidth startIcon={<AssignmentIcon />}>
                  Ver Reportes
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
