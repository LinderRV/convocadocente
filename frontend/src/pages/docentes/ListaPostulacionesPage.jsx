import React, { useState, useEffect } from 'react';
import listaPostulacionesAPI from '../../services/docentes/docenteListaPostulacionesAPI';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  Tooltip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  HourglassEmpty as PendingIcon,
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  Visibility as ViewIcon,
  Assessment as EvaluatingIcon,
  School as SchoolIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';

const ListaPostulacionesPage = () => {
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedPostulacion, setSelectedPostulacion] = useState(null);
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar postulaciones al montar el componente
  useEffect(() => {
    cargarPostulaciones();
  }, []);

  const cargarPostulaciones = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await listaPostulacionesAPI.obtenerPostulaciones();
      
      if (response.success) {
        setPostulaciones(response.data);
      } else {
        setError(response.message || 'Error al cargar las postulaciones');
      }
    } catch (err) {
      setError(err.message || 'Error al conectar con el servidor');
      console.error('Error al cargar postulaciones:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPostulacion = (postulacion) => {
    setSelectedPostulacion(postulacion);
    setOpenViewDialog(true);
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'APROBADO': return 'success';
      case 'RECHAZADO': return 'error';
      case 'EVALUANDO': return 'warning';
      case 'PENDIENTE': return 'info';
      default: return 'default';
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'APROBADO': return <ApprovedIcon />;
      case 'RECHAZADO': return <RejectedIcon />;
      case 'EVALUANDO': return <EvaluatingIcon />;
      case 'PENDIENTE': return <PendingIcon />;
      default: return <AssignmentIcon />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          mb: 3,
          pb: 2,
          borderBottom: '2px solid #f0f0f0'
        }}>
          <AssignmentIcon color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Mis Postulaciones
          </Typography>
        </Box>
      </Box>

      {/* Tabla de postulaciones */}
      <Card elevation={3}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            mb: 3,
            pb: 2,
            borderBottom: '2px solid #f0f0f0'
          }}>
            <AssignmentIcon color="primary" sx={{ fontSize: 32 }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Lista de Postulaciones
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <Typography>Cargando postulaciones...</Typography>
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Facultad</TableCell>
                    <TableCell>Especialidad</TableCell>
                    <TableCell>Fecha Postulación</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {postulaciones.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Box sx={{ 
                          textAlign: 'center', 
                          py: 4,
                          color: 'text.secondary'
                        }}>
                          <AssignmentIcon sx={{ fontSize: 48, mb: 2, opacity: 0.3 }} />
                          <Typography variant="body1" fontWeight="medium">
                            No tienes postulaciones registradas
                          </Typography>
                          <Typography variant="body2">
                            No hay postulaciones realizadas
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    postulaciones.map((postulacion) => (
                      <TableRow key={postulacion.id}>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {postulacion.facultad_nombre}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {postulacion.especialidad_nombre}
                          </Typography>
                        </TableCell>
                        <TableCell>{formatFecha(postulacion.fecha_postulacion)}</TableCell>
                        <TableCell>
                          <Chip 
                            icon={getEstadoIcon(postulacion.estado)}
                            label={postulacion.estado}
                            color={getEstadoColor(postulacion.estado)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Ver Detalles">
                            <IconButton 
                              size="small" 
                              onClick={() => handleViewPostulacion(postulacion)}
                              color="info"
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Paginación */}
          {postulaciones.length > 10 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination 
                count={Math.ceil(postulaciones.length / 10)}
                page={page}
                onChange={(e, newPage) => setPage(newPage)}
                color="primary"
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Dialog para ver detalles de postulación */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ViewIcon color="info" />
            <Typography variant="h6">
              Detalles de Postulación Completa
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedPostulacion && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                {/* INFORMACIÓN GENERAL */}
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                    <Typography variant="h6" gutterBottom>
                      {selectedPostulacion.facultad_nombre}
                    </Typography>
                    <Typography variant="subtitle1">
                      {selectedPostulacion.especialidad_nombre}
                    </Typography>
                  </Card>
                </Grid>

                {/* ESTADO Y FECHA */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Estado:</Typography>
                  <Chip 
                    icon={getEstadoIcon(selectedPostulacion.estado)}
                    label={selectedPostulacion.estado}
                    color={getEstadoColor(selectedPostulacion.estado)}
                    sx={{ mt: 1 }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Fecha de Postulación:</Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {formatFecha(selectedPostulacion.fecha_postulacion)}
                  </Typography>
                </Grid>

                {/* SEPARADOR */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>

                {/* CURSOS DE INTERÉS */}
                <Grid item xs={12} md={6}>
                  <Card elevation={2} sx={{ p: 2, height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <SchoolIcon color="success" />
                      <Typography variant="h6" color="success.main">
                        Cursos de Interés
                      </Typography>
                    </Box>
                    
                    {selectedPostulacion.cursos_interes && selectedPostulacion.cursos_interes.length > 0 ? (
                      <List dense>
                        {selectedPostulacion.cursos_interes.map((curso, index) => (
                          <ListItem key={index} sx={{ pl: 0 }}>
                            <ListItemIcon>
                              <Chip 
                                label={index + 1} 
                                size="small" 
                                color="success" 
                                sx={{ width: 24, height: 24, fontSize: '0.7rem' }}
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography variant="body2" fontWeight="medium">
                                  {curso.c_nomcur}
                                </Typography>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Alert severity="warning" sx={{ mt: 1 }}>
                        <Typography variant="body2">
                          No hay cursos de interés registrados
                        </Typography>
                      </Alert>
                    )}
                  </Card>
                </Grid>

                {/* HORARIOS DISPONIBLES */}
                <Grid item xs={12} md={6}>
                  <Card elevation={2} sx={{ p: 2, height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <AccessTimeIcon color="info" />
                      <Typography variant="h6" color="info.main">
                        Horarios Disponibles
                      </Typography>
                    </Box>
                    
                    {selectedPostulacion.horarios && selectedPostulacion.horarios.length > 0 ? (
                      <List dense>
                        {selectedPostulacion.horarios.map((horario, index) => (
                          <ListItem key={index} sx={{ pl: 0 }}>
                            <ListItemIcon>
                              <Chip 
                                label={horario.dia_semana.substring(0, 3).toUpperCase()} 
                                size="small" 
                                color="info" 
                                sx={{ width: 40, fontSize: '0.7rem' }}
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography variant="body2" fontWeight="medium">
                                  {horario.dia_semana}
                                </Typography>
                              }
                              secondary={
                                <Typography variant="caption" color="text.secondary">
                                  {horario.hora_inicio} - {horario.hora_fin}
                                </Typography>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Alert severity="warning" sx={{ mt: 1 }}>
                        <Typography variant="body2">
                          No hay horarios disponibles registrados
                        </Typography>
                      </Alert>
                    )}
                  </Card>
                </Grid>

                {/* RESPUESTA DE LA UNIVERSIDAD */}
                {selectedPostulacion.comentario_evaluacion && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Respuesta de la Universidad:</Typography>
                    <Card variant="outlined" sx={{ mt: 1, p: 2, bgcolor: 'success.light' }}>
                      <Typography variant="body2">
                        {selectedPostulacion.comentario_evaluacion}
                      </Typography>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenViewDialog(false)} variant="contained" size="large">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ListaPostulacionesPage;
