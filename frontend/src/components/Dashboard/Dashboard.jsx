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
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  People as PeopleIcon,
  Work as WorkIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  School as SchoolIcon,
  PersonAdd as PersonAddIcon,
  BarChart as BarChartIcon,
  Notifications as NotificationsIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { obtenerEstadisticasGenerales } from '../../services/dashboardAPI';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ title, value, icon, color = 'primary', trend, subtitle, loading }) => {
  const theme = useTheme();
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        position: 'relative',
        overflow: 'visible',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8]
        }
      }}
    >
      <CardContent sx={{ pb: 2 }}>
        {/* Icono decorativo */}
        <Box
          sx={{
            position: 'absolute',
            top: -10,
            right: 20,
            bgcolor: `${color}.main`,
            borderRadius: 2,
            p: 1.5,
            boxShadow: theme.shadows[4]
          }}
        >
          {React.cloneElement(icon, { sx: { color: 'white', fontSize: 28 } })}
        </Box>

        <Box sx={{ mt: 2 }}>
          {loading ? (
            <Box>
              <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Cargando...
              </Typography>
            </Box>
          ) : (
            <>
              <Typography variant="h3" component="div" sx={{ 
                fontWeight: 'bold', 
                mb: 1,
                color: `${color}.main`,
                fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
              }}>
                {value}
              </Typography>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {subtitle}
                </Typography>
              )}
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

const QuickActionCard = ({ title, description, icon, color, action, buttonText }) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <CardContent sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar sx={{ bgcolor: `${color}.main`, mr: 2 }}>
          {icon}
        </Avatar>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {description}
      </Typography>
      <Button
        variant="contained"
        fullWidth
        startIcon={<AddIcon />}
        onClick={action}
        sx={{
          mt: 'auto',
          bgcolor: `${color}.main`,
          '&:hover': {
            bgcolor: `${color}.dark`
          }
        }}
      >
        {buttonText}
      </Button>
    </CardContent>
  </Card>
);

const ActivityItem = ({ title, description, time, type, avatar }) => {
  const getTypeColor = (type) => {
    switch (type) {
      case 'success': return 'success.main';
      case 'warning': return 'warning.main';
      case 'error': return 'error.main';
      default: return 'primary.main';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircleIcon />;
      case 'warning': return <WarningIcon />;
      case 'error': return <WarningIcon />;
      default: return <NotificationsIcon />;
    }
  };

  return (
    <ListItem alignItems="flex-start" sx={{ py: 2 }}>
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: getTypeColor(type) }}>
          {avatar || getTypeIcon(type)}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        }
        secondary={
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              {description}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {time}
            </Typography>
          </>
        }
      />
    </ListItem>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const [statsLoading, setStatsLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setStatsLoading(true);
      setError(null);
      
      const response = await obtenerEstadisticasGenerales();
      
      if (response.success) {
        setDashboardStats(response.data);
      } else {
        setError('Error al cargar datos');
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setStatsLoading(false);
    }
  };

  // Generar estadísticas dinámicas desde los datos reales
  const generateStats = () => {
    if (!dashboardStats) return [];

    return [
      {
        title: 'Total Docentes',
        value: dashboardStats.totalDocentes || '0',
        icon: <PeopleIcon />,
        color: 'primary',
        subtitle: 'Docentes registrados'
      },
      {
        title: 'Cursos Activos',
        value: dashboardStats.cursosActivos || '0',
        icon: <SchoolIcon />,
        color: 'success',
        subtitle: 'Cursos disponibles'
      },
      {
        title: 'Total Postulaciones',
        value: dashboardStats.totalPostulaciones || '0',
        icon: <AssignmentIcon />,
        color: 'warning',
        subtitle: 'Total postulaciones'
      },
      {
        title: 'Especialidades',
        value: dashboardStats.totalEspecialidades || '0',
        icon: <TrendingUpIcon />,
        color: 'info',
        subtitle: 'Especialidades disponibles'
      },
      {
        title: 'Postulaciones Pendientes',
        value: dashboardStats.postulaciones?.pendientes || '0',
        icon: <ScheduleIcon />,
        color: 'warning',
        subtitle: 'En espera de revisión'
      },
      {
        title: 'En Evaluación',
        value: dashboardStats.postulaciones?.evaluando || '0',
        icon: <WorkIcon />,
        color: 'info',
        subtitle: 'Siendo evaluadas'
      },
      {
        title: 'Postulaciones Aprobadas',
        value: dashboardStats.postulaciones?.aprobadas || '0',
        icon: <CheckCircleIcon />,
        color: 'success',
        subtitle: 'Postulaciones aceptadas'
      },
      {
        title: 'Postulaciones Rechazadas',
        value: dashboardStats.postulaciones?.rechazadas || '0',
        icon: <WarningIcon />,
        color: 'error',
        subtitle: 'Postulaciones rechazadas'
      }
    ];
  };

  const stats = generateStats();

  return (
    <Box>
      {/* Header de bienvenida */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ 
          fontWeight: 'bold',
          mb: 2,
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          ¡Bienvenido de nuevo, {user?.nombre || 'Usuario'}! 👋
        </Typography>

        {/* Mostrar errores si los hay */}
        {error && (
          <Alert 
            severity="warning" 
            sx={{ mb: 2 }}
            action={
              <Button color="inherit" size="small" onClick={loadDashboardStats}>
                Reintentar
              </Button>
            }
          >
            {error}
          </Alert>
        )}
      </Box>

 

      {/* Tarjetas de estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <StatCard {...stat} loading={statsLoading} />
          </Grid>
        ))}
      </Grid>

    </Box>
  );
};

export default Dashboard;
