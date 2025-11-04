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
import { testConnection } from '../../services/api';
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
              {trend && (
                <Chip
                  label={`${trend > 0 ? '+' : ''}${trend}%`}
                  size="small"
                  color={trend > 0 ? 'success' : 'error'}
                  icon={<TrendingUpIcon />}
                  sx={{ fontWeight: 600 }}
                />
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
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    checkConnection();
    // Simular carga de estadísticas
    setTimeout(() => {
      setStatsLoading(false);
    }, 1500);
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
      value: '247',
      icon: <PeopleIcon />,
      color: 'primary',
      trend: 12,
      subtitle: 'Docentes registrados'
    },
    {
      title: 'Cursos Activos',
      value: '18',
      icon: <SchoolIcon />,
      color: 'success',
      trend: 25,
      subtitle: 'Cursos disponibles'
    },
    {
      title: 'Total Postulaciones',
      value: '14',
      icon: <AssignmentIcon />,
      color: 'warning',
      trend: 8,
      subtitle: 'Total postulaciones'
    },
    {
      title: 'Especialidades Registradas',
      value: '98',
      icon: <TrendingUpIcon />,
      color: 'info',
      trend: 5,
      subtitle: 'Especialidades Registradas'
    },
  ];

  return (
    <Box>
      {/* Header de bienvenida */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ 
          fontWeight: 'bold',
          mb: 1,
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          ¡Bienvenido de nuevo, {user?.nombre || 'Usuario'}! 👋
        </Typography>
      </Box>

 

      {/* Tarjetas de estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <StatCard {...stat} loading={statsLoading} />
          </Grid>
        ))}
      </Grid>

    </Box>
  );
};

export default Dashboard;
