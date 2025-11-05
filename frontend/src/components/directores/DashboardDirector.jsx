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
import { cursosAPI } from '../../services/cursosAPI';

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
    totalCursos: 0,
    cursosActivos: 0,
    cursosInactivos: 0,
    totalPostulaciones: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar estadísticas de cursos
  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Aquí podríamos cargar estadísticas específicas del director
      // Por ahora usamos datos mock
      const mockStats = {
        totalCursos: 12,
        cursosActivos: 8,
        cursosInactivos: 4,
        totalPostulaciones: 15
      };
      
      setStats(mockStats);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      setError('Error al cargar las estadísticas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  // Obtener el nombre de la especialidad del director
  const getEspecialidadDirector = () => {
    // Esto debería venir del contexto de usuario con la especialidad asignada
    return 'Enfermería'; // Valor por defecto
  };

  const cardStats = [
    {
      title: 'Cursos Totales',
      value: stats.totalCursos,
      icon: <SchoolIcon />,
      color: 'primary',
      subtitle: 'En mi especialidad'
    },
    {
      title: 'Cursos Activos',
      value: stats.cursosActivos,
      icon: <CheckCircleIcon />,
      color: 'success',
      subtitle: 'Disponibles para postulación'
    },
    {
      title: 'Cursos Inactivos',
      value: stats.cursosInactivos,
      icon: <CancelIcon />,
      color: 'warning',
      subtitle: 'No disponibles'
    },
    {
      title: 'Postulaciones',
      value: stats.totalPostulaciones,
      icon: <PeopleIcon />,
      color: 'info',
      subtitle: 'Docentes postulados'
    }
  ];

  const recentActivities = [
    {
      text: 'Nuevo docente postulado a Anatomía I',
      time: 'Hace 2 horas',
      type: 'postulacion'
    },
    {
      text: 'Curso "Fisiología" activado',
      time: 'Ayer',
      type: 'curso'
    },
    {
      text: 'Evaluación pendiente para 3 postulaciones',
      time: 'Hace 1 día',
      type: 'evaluacion'
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
          Panel de gestión - Especialidad de {getEspecialidadDirector()}
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

      {/* Sección Principal */}
      <Grid container spacing={3}>
        {/* Panel de Acceso Rápido */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Gestión de Cursos
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Paper
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      bgcolor: 'primary.main',
                      color: 'white',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                        transform: 'translateY(-2px)'
                      }
                    }}
                    onClick={() => window.location.href = '/cursos'}
                  >
                    <SchoolIcon sx={{ fontSize: 48, mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Administrar Cursos
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Gestiona el estado de los cursos de tu especialidad
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Paper
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      bgcolor: 'success.main',
                      color: 'white',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: 'success.dark',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    <AssessmentIcon sx={{ fontSize: 48, mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Evaluar Postulaciones
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Revisa y evalúa las postulaciones de docentes
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Panel de Actividad Reciente */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Actividad Reciente
              </Typography>
              
              <List disablePadding>
                {recentActivities.map((activity, index) => (
                  <Box key={index}>
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Avatar sx={{ 
                          width: 32, 
                          height: 32, 
                          bgcolor: activity.type === 'postulacion' ? 'info.main' : 
                                   activity.type === 'curso' ? 'success.main' : 'warning.main'
                        }}>
                          {activity.type === 'postulacion' ? <PeopleIcon sx={{ fontSize: 16 }} /> :
                           activity.type === 'curso' ? <SchoolIcon sx={{ fontSize: 16 }} /> :
                           <ScheduleIcon sx={{ fontSize: 16 }} />}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {activity.text}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            {activity.time}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < recentActivities.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Información de Especialidad */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Tu Especialidad
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip 
              label={`Especialidad: ${getEspecialidadDirector()}`}
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 'bold' }}
            />
            <Typography variant="body2" color="text.secondary">
              Como Director de esta especialidad, puedes gestionar todos los cursos asignados y evaluar las postulaciones de docentes.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DashboardDirector;
