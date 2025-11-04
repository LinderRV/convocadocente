import React, { useState } from 'react';
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
  TextField,
  MenuItem,
  Alert,
  Fab,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
  HourglassEmpty as PendingIcon,
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  Visibility as ViewIcon,
  Description as DocumentIcon
} from '@mui/icons-material';

const PostulacionesPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [alert, setAlert] = useState(null);
  const [page, setPage] = useState(1);
  const [selectedPostulacion, setSelectedPostulacion] = useState(null);

  // DATOS MOCK - Tabla 'postulaciones_cursos_especialidad'
  const [postulaciones, setPostulaciones] = useState([
    {
      id: 1,
      convocatoria_id: 1,
      convocatoria_titulo: 'Convocatoria Docentes Medicina 2024-I',
      curso_id: 1,
      curso_nombre: 'Cardiología Intervencional Avanzada',
      especialidad_id: 1,
      especialidad_nombre: 'Cardiología',
      fecha_postulacion: '2024-02-01',
      estado: 'En Evaluación',
      puntaje_obtenido: null,
      observaciones_evaluacion: null,
      documentos_adjuntos: 'cv_actualizado.pdf, certificados_especialidad.pdf',
      carta_motivacion: 'Estimados miembros del comité evaluador, me dirijo a ustedes para postularme al curso de Cardiología Intervencional Avanzada...',
      fecha_limite: '2024-02-28'
    },
    {
      id: 2,
      convocatoria_id: 1,
      convocatoria_titulo: 'Convocatoria Docentes Medicina 2024-I',
      curso_id: 2,
      curso_nombre: 'Ecocardiografía Diagnóstica',
      especialidad_id: 1,
      especialidad_nombre: 'Cardiología',
      fecha_postulacion: '2024-01-28',
      estado: 'Aprobado',
      puntaje_obtenido: 87,
      observaciones_evaluacion: 'Excelente perfil profesional. Experiencia comprobada en ecocardiografía. Recomendado para la cátedra.',
      documentos_adjuntos: 'cv_actualizado.pdf, certificados_especialidad.pdf, carta_recomendacion.pdf',
      carta_motivacion: 'Mi experiencia de 8 años en ecocardiografía diagnóstica me permite aportar conocimientos actualizados...',
      fecha_limite: '2024-02-28'
    },
    {
      id: 3,
      convocatoria_id: 2,
      convocatoria_titulo: 'Convocatoria Medicina Interna 2024-I',
      curso_id: 3,
      curso_nombre: 'Medicina Interna General',
      especialidad_id: 2,
      especialidad_nombre: 'Medicina Interna',
      fecha_postulacion: '2024-01-15',
      estado: 'Rechazado',
      puntaje_obtenido: 65,
      observaciones_evaluacion: 'Perfil adecuado pero se requiere mayor experiencia docente universitaria.',
      documentos_adjuntos: 'cv_actualizado.pdf',
      carta_motivacion: 'Aunque mi especialidad es cardiología, tengo bases sólidas en medicina interna...',
      fecha_limite: '2024-01-31'
    },
    {
      id: 4,
      convocatoria_id: 3,
      convocatoria_titulo: 'Convocatoria Postgrado Cardiología 2024-II',
      curso_id: 4,
      curso_nombre: 'Investigación Clínica en Cardiología',
      especialidad_id: 1,
      especialidad_nombre: 'Cardiología',
      fecha_postulacion: '2024-03-01',
      estado: 'Pendiente',
      puntaje_obtenido: null,
      observaciones_evaluacion: null,
      documentos_adjuntos: 'cv_actualizado.pdf, proyecto_investigacion.pdf',
      carta_motivacion: 'Mi interés en la investigación clínica cardiovascular se fundamenta en...',
      fecha_limite: '2024-03-31'
    }
  ]);

  // Datos mock de convocatorias y cursos disponibles
  const convocatoriasDisponibles = [
    { id: 1, titulo: 'Convocatoria Docentes Medicina 2024-I', fecha_limite: '2024-02-28', estado: 'Abierta' },
    { id: 2, titulo: 'Convocatoria Medicina Interna 2024-I', fecha_limite: '2024-01-31', estado: 'Cerrada' },
    { id: 3, titulo: 'Convocatoria Postgrado Cardiología 2024-II', fecha_limite: '2024-03-31', estado: 'Abierta' },
    { id: 4, titulo: 'Convocatoria Cirugía General 2024-I', fecha_limite: '2024-04-15', estado: 'Próximamente' }
  ];

  const cursosDisponibles = [
    { id: 1, nombre: 'Cardiología Intervencional Avanzada', especialidad: 'Cardiología' },
    { id: 2, nombre: 'Ecocardiografía Diagnóstica', especialidad: 'Cardiología' },
    { id: 3, nombre: 'Medicina Interna General', especialidad: 'Medicina Interna' },
    { id: 4, nombre: 'Investigación Clínica en Cardiología', especialidad: 'Cardiología' }
  ];

  const [currentPostulacion, setCurrentPostulacion] = useState({
    convocatoria_id: '',
    curso_id: '',
    especialidad_id: '',
    carta_motivacion: '',
    documentos_adjuntos: ''
  });

  const estados = ['Pendiente', 'En Evaluación', 'Aprobado', 'Rechazado'];
  
  // Estadísticas calculadas
  const estadisticas = {
    total: postulaciones.length,
    pendientes: postulaciones.filter(p => p.estado === 'Pendiente' || p.estado === 'En Evaluación').length,
    aprobadas: postulaciones.filter(p => p.estado === 'Aprobado').length,
    rechazadas: postulaciones.filter(p => p.estado === 'Rechazado').length
  };

  const handleOpenDialog = (postulacion = null) => {
    if (postulacion) {
      setCurrentPostulacion({
        ...postulacion
      });
      setEditMode(true);
    } else {
      setCurrentPostulacion({
        convocatoria_id: '',
        curso_id: '',
        especialidad_id: '',
        carta_motivacion: '',
        documentos_adjuntos: ''
      });
      setEditMode(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentPostulacion({
      convocatoria_id: '',
      curso_id: '',
      especialidad_id: '',
      carta_motivacion: '',
      documentos_adjuntos: ''
    });
  };

  const handleViewPostulacion = (postulacion) => {
    setSelectedPostulacion(postulacion);
    setOpenViewDialog(true);
  };

  const handleSubmit = () => {
    if (!currentPostulacion.convocatoria_id || !currentPostulacion.curso_id || !currentPostulacion.carta_motivacion) {
      setAlert({ 
        type: 'error', 
        message: 'Convocatoria, curso y carta de motivación son obligatorios' 
      });
      return;
    }

    // Verificar si ya existe postulación para esta convocatoria y curso
    if (!editMode && postulaciones.some(p => 
      p.convocatoria_id == currentPostulacion.convocatoria_id && 
      p.curso_id == currentPostulacion.curso_id
    )) {
      setAlert({ 
        type: 'error', 
        message: 'Ya tienes una postulación para este curso en esta convocatoria' 
      });
      return;
    }

    if (editMode) {
      setPostulaciones(prev => prev.map(p => 
        p.id === currentPostulacion.id ? currentPostulacion : p
      ));
      setAlert({ type: 'success', message: 'Postulación actualizada correctamente' });
    } else {
      const convocatoria = convocatoriasDisponibles.find(c => c.id == currentPostulacion.convocatoria_id);
      const curso = cursosDisponibles.find(c => c.id == currentPostulacion.curso_id);
      
      const newPostulacion = {
        ...currentPostulacion,
        id: Math.max(...postulaciones.map(p => p.id), 0) + 1,
        convocatoria_titulo: convocatoria?.titulo || '',
        curso_nombre: curso?.nombre || '',
        especialidad_nombre: curso?.especialidad || '',
        fecha_postulacion: new Date().toISOString().split('T')[0],
        estado: 'Pendiente',
        puntaje_obtenido: null,
        observaciones_evaluacion: null,
        fecha_limite: convocatoria?.fecha_limite || ''
      };
      setPostulaciones(prev => [...prev, newPostulacion]);
      setAlert({ type: 'success', message: 'Postulación enviada correctamente' });
    }
    
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    const postulacion = postulaciones.find(p => p.id === id);
    
    if (postulacion && (postulacion.estado === 'Aprobado' || postulacion.estado === 'En Evaluación')) {
      setAlert({ 
        type: 'error', 
        message: 'No puedes eliminar una postulación que está siendo evaluada o ya fue aprobada' 
      });
      return;
    }

    if (window.confirm('¿Estás seguro de que quieres eliminar esta postulación?')) {
      setPostulaciones(prev => prev.filter(p => p.id !== id));
      setAlert({ type: 'success', message: 'Postulación eliminada correctamente' });
    }
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
      case 'Aprobado': return 'success';
      case 'Rechazado': return 'error';
      case 'En Evaluación': return 'warning';
      case 'Pendiente': return 'info';
      default: return 'default';
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'Aprobado': return <ApprovedIcon />;
      case 'Rechazado': return <RejectedIcon />;
      case 'En Evaluación': return <PendingIcon />;
      case 'Pendiente': return <AssignmentIcon />;
      default: return <AssignmentIcon />;
    }
  };

  const getProgresoEstado = (estado) => {
    switch (estado) {
      case 'Pendiente': return 25;
      case 'En Evaluación': return 50;
      case 'Aprobado': return 100;
      case 'Rechazado': return 100;
      default: return 0;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header con estadísticas */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 3 }}>
          Mis Postulaciones
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <AssignmentIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" component="div">
                  {estadisticas.total}
                </Typography>
                <Typography color="text.secondary">
                  Total Postulaciones
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <PendingIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" component="div">
                  {estadisticas.pendientes}
                </Typography>
                <Typography color="text.secondary">
                  En Proceso
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <ApprovedIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" component="div">
                  {estadisticas.aprobadas}
                </Typography>
                <Typography color="text.secondary">
                  Aprobadas
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <RejectedIcon color="error" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" component="div">
                  {estadisticas.rechazadas}
                </Typography>
                <Typography color="text.secondary">
                  Rechazadas
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {alert && (
        <Alert 
          severity={alert.type} 
          sx={{ mb: 2 }} 
          onClose={() => setAlert(null)}
        >
          {alert.message}
        </Alert>
      )}

      {/* Tabla de postulaciones */}
      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Convocatoria</TableCell>
                  <TableCell>Curso</TableCell>
                  <TableCell>Especialidad</TableCell>
                  <TableCell>Fecha Postulación</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Progreso</TableCell>
                  <TableCell>Puntaje</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {postulaciones.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography variant="body1" color="text.secondary">
                        No tienes postulaciones registradas
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  postulaciones.map((postulacion) => (
                    <TableRow key={postulacion.id}>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {postulacion.convocatoria_titulo}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Límite: {formatFecha(postulacion.fecha_limite)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {postulacion.curso_nombre}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={postulacion.especialidad_nombre}
                          color="primary"
                          size="small"
                        />
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
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={getProgresoEstado(postulacion.estado)}
                            color={getEstadoColor(postulacion.estado)}
                          />
                        </Box>
                        <Typography variant="caption">
                          {getProgresoEstado(postulacion.estado)}%
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {postulacion.puntaje_obtenido ? (
                          <Typography variant="body2" fontWeight="bold" color="primary">
                            {postulacion.puntaje_obtenido}/100
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Pendiente
                          </Typography>
                        )}
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
                        
                        {(postulacion.estado === 'Pendiente' || postulacion.estado === 'Rechazado') && (
                          <Tooltip title="Editar">
                            <IconButton 
                              size="small" 
                              onClick={() => handleOpenDialog(postulacion)}
                              color="primary"
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        
                        {postulacion.estado === 'Pendiente' && (
                          <Tooltip title="Eliminar">
                            <IconButton 
                              size="small" 
                              onClick={() => handleDelete(postulacion.id)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

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

      {/* Botón flotante para agregar */}
      <Fab 
        color="primary" 
        aria-label="add"
        sx={{ 
          position: 'fixed', 
          bottom: 16, 
          right: 16 
        }}
        onClick={() => handleOpenDialog()}
      >
        <AddIcon />
      </Fab>

      {/* Dialog para agregar/editar postulación */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>
          {editMode ? 'Editar Postulación' : 'Nueva Postulación'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Convocatoria</InputLabel>
                  <Select
                    value={currentPostulacion.convocatoria_id}
                    label="Convocatoria"
                    onChange={(e) => setCurrentPostulacion({ 
                      ...currentPostulacion, 
                      convocatoria_id: e.target.value 
                    })}
                    disabled={editMode}
                  >
                    {convocatoriasDisponibles.filter(c => c.estado === 'Abierta').map((conv) => (
                      <MenuItem key={conv.id} value={conv.id}>
                        <Box>
                          <Typography variant="subtitle2">{conv.titulo}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Límite: {formatFecha(conv.fecha_limite)}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Curso</InputLabel>
                  <Select
                    value={currentPostulacion.curso_id}
                    label="Curso"
                    onChange={(e) => setCurrentPostulacion({ 
                      ...currentPostulacion, 
                      curso_id: e.target.value 
                    })}
                    disabled={editMode}
                  >
                    {cursosDisponibles.map((curso) => (
                      <MenuItem key={curso.id} value={curso.id}>
                        <Box>
                          <Typography variant="subtitle2">{curso.nombre}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {curso.especialidad}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Carta de Motivación"
                  value={currentPostulacion.carta_motivacion}
                  onChange={(e) => setCurrentPostulacion({ 
                    ...currentPostulacion, 
                    carta_motivacion: e.target.value 
                  })}
                  multiline
                  rows={6}
                  required
                  fullWidth
                  placeholder="Explica por qué estás interesado en este curso, tu experiencia relevante y qué puedes aportar..."
                  helperText="Esta carta será evaluada por el comité de selección"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Documentos Adjuntos"
                  value={currentPostulacion.documentos_adjuntos}
                  onChange={(e) => setCurrentPostulacion({ 
                    ...currentPostulacion, 
                    documentos_adjuntos: e.target.value 
                  })}
                  fullWidth
                  placeholder="Lista los documentos que adjuntas (CV, certificados, cartas de recomendación, etc.)"
                  helperText="Puedes subir los documentos desde tu perfil"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editMode ? 'Actualizar' : 'Enviar Postulación'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para ver detalles de postulación */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Detalles de Postulación
        </DialogTitle>
        <DialogContent>
          {selectedPostulacion && (
            <Box sx={{ pt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    {selectedPostulacion.curso_nombre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {selectedPostulacion.convocatoria_titulo}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Estado:</Typography>
                  <Chip 
                    icon={getEstadoIcon(selectedPostulacion.estado)}
                    label={selectedPostulacion.estado}
                    color={getEstadoColor(selectedPostulacion.estado)}
                    sx={{ mt: 1 }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Fecha de Postulación:</Typography>
                  <Typography variant="body2">
                    {formatFecha(selectedPostulacion.fecha_postulacion)}
                  </Typography>
                </Grid>

                {selectedPostulacion.puntaje_obtenido && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2">Puntaje Obtenido:</Typography>
                    <Typography variant="h6" color="primary">
                      {selectedPostulacion.puntaje_obtenido}/100
                    </Typography>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Typography variant="subtitle2">Carta de Motivación:</Typography>
                  <Typography variant="body2" sx={{ mt: 1, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    {selectedPostulacion.carta_motivacion}
                  </Typography>
                </Grid>

                {selectedPostulacion.observaciones_evaluacion && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Observaciones del Comité:</Typography>
                    <Typography variant="body2" sx={{ mt: 1, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      {selectedPostulacion.observaciones_evaluacion}
                    </Typography>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Typography variant="subtitle2">Documentos Adjuntos:</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {selectedPostulacion.documentos_adjuntos || 'Ninguno'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PostulacionesPage;
