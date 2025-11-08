import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Backdrop
} from '@mui/material';
import {
  School as SchoolIcon,
  Work as WorkIcon,
  Send as SendIcon
} from '@mui/icons-material';
import dashboardAPI from '../../services/dashboardAPI';

const DashboardDocente = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [estadisticas, setEstadisticas] = useState({
    formaciones: { total: 0 },
    experiencias: { total: 0 },
    postulaciones: { total: 0 }
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const estadisticasResponse = await dashboardAPI.obtenerEstadisticas();
      
      if (estadisticasResponse.success) {
        setEstadisticas(estadisticasResponse.data);
      }
      
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
      setError('Error al cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Tarjetas de Estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <SchoolIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div">
                {estadisticas.formaciones.total}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                Formaciones Académicas
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <WorkIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div">
                {estadisticas.experiencias.total}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                Experiencias Laborales
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <SendIcon color="secondary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div">
                {estadisticas.postulaciones.total}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                Postulaciones
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardDocente;
