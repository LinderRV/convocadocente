import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography
} from '@mui/material';
import {
  School as SchoolIcon,
  Work as WorkIcon,
  Send as SendIcon
} from '@mui/icons-material';

const DashboardDocente = () => {
  const estadisticas = {
    formaciones: { total: 3, doctorados: 1, maestrias: 1 },
    experiencias: { total: 5, actual: 1, anios: 12 },
    postulaciones: { total: 2, aprobadas: 1, pendientes: 1 }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Tarjetas de Estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <SchoolIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div">
                {estadisticas.formaciones.total}
              </Typography>
              <Typography color="text.secondary">
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
              <Typography color="text.secondary">
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
              <Typography color="text.secondary">
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
