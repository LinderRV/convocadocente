import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Paper,
  Avatar,
  Divider,
  Alert
} from '@mui/material';
import {
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import dashboardDirectorAPI from '../../services/directores/dashboardDirectorAPI';

const StatCard = ({ title, value, icon, color = 'primary', loading, subtitle }) => (
  <Card 
    sx={{ 
      height: '100%',
      position: 'relative',
      overflow: 'visible',
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: 6
      }
    }}
  >
    <CardContent>
      <Box
        sx={{
          position: 'absolute',
          top: -10,
          right: 20,
          bgcolor: `${color}.main`,
          borderRadius: 2,
          p: 1.5,
          boxShadow: 3
        }}
      >
        {React.cloneElement(icon, { sx: { color: 'white', fontSize: 24 } })}
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="h3" component="div" sx={{ 
          fontWeight: 'bold', 
          mb: 1,
          color: `${color}.main`
        }}>
          {loading ? '...' : value}
        </Typography>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
    </CardContent>
  </Card>
);

const DashboardDirector = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    cursosActivos: 0,
    totalPostulaciones: 0,
    postulacionesPendientes: 0,
    postulacionesAprobadas: 0
  });
  const [especialidadInfo, setEspecialidadInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar estadísticas de cursos
  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Cargar estadísticas reales del dashboard
      const statsResponse = await dashboardDirectorAPI.getDashboardStats();
      
      if (statsResponse.success) {
        setStats(statsResponse.data);
        // Usar la información de especialidad que viene en las estadísticas
        if (statsResponse.data.especialidad) {
          setEspecialidadInfo({
            especialidad: {
              nombre: statsResponse.data.especialidad.nombre_especialidad
            }
          });
        }
      }
      
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      setError(error.message || 'Error al cargar las estadísticas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const cardStats = [
    {
      title: 'Cursos Activos',
      value: stats.cursosActivos,
      icon: <SchoolIcon />,
      color: 'success',
      subtitle: 'Disponibles para postulación'
    },
    {
      title: 'Postulaciones',
      value: stats.totalPostulaciones,
      icon: <PeopleIcon />,
      color: 'info',
      subtitle: 'Docentes postulados'
    },
    {
      title: 'Pendientes de evaluación',
      value: stats.postulacionesPendientes,
      icon: <ScheduleIcon />,
      color: 'warning',
      subtitle: 'En espera de revisión'
    },
    {
      title: 'Aprobadas',
      value: stats.postulacionesAprobadas,
      icon: <CheckCircleIcon />,
      color: 'primary',
      subtitle: 'Postulaciones aceptadas'
    }
  ];

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header de Bienvenida */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          ¡Bienvenido, Director!
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {especialidadInfo ? 
            `Panel de gestión - Especialidad de ${especialidadInfo.especialidad.nombre}` :
            'Panel de gestión de especialidad'
          }
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Gestiona los cursos de tu especialidad y supervisa las postulaciones docentes
        </Typography>
      </Box>

      {/* Tarjetas de Estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {cardStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              loading={loading}
              subtitle={stat.subtitle}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardDirector;
