import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Avatar,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Pagination
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  Download as DownloadIcon,
  Info as InfoIcon,
  MenuBook as FormacionIcon,
  Schedule as CursosHorariosIcon
} from '@mui/icons-material';

// Importar API
import { postulacionesAPI } from '../services/postulacionesAPI';

const PostulacionesPage = () => {
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPostulacion, setSelectedPostulacion] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('view'); // 'view', 'edit', 'approve', 'reject', 'evaluar'
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5); // 5 postulaciones por página
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [mensajeEvaluacion, setMensajeEvaluacion] = useState('');
  // Estado para modal de información docente
  const [openInfoDocenteDialog, setOpenInfoDocenteDialog] = useState(false);
  const [selectedDocente, setSelectedDocente] = useState(null);
  // Estados para modales de formaciones y experiencias
  const [openFormacionesDialog, setOpenFormacionesDialog] = useState(false);
  const [selectedFormaciones, setSelectedFormaciones] = useState([]);
  const [openExperienciasDialog, setOpenExperienciasDialog] = useState(false);
  const [selectedExperiencias, setSelectedExperiencias] = useState([]);
  // Estados para modal de cursos y horarios
  const [openCursosHorariosDialog, setOpenCursosHorariosDialog] = useState(false);
  const [selectedCursosHorarios, setSelectedCursosHorarios] = useState(null);

  // Cargar postulaciones desde la API
  const loadPostulaciones = async () => {
    try {
      setLoading(true);
      const response = await postulacionesAPI.getPostulaciones(page, rowsPerPage);
      setPostulaciones(response.data);
    } catch (error) {
      console.error('Error al cargar postulaciones:', error);
      // Mantener array vacío en caso de error
      setPostulaciones([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPostulaciones();
  }, [page, rowsPerPage]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDIENTE':
        return 'warning';
      case 'EVALUANDO':
        return 'info';
      case 'APROBADO':
        return 'success';
      case 'RECHAZADO':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewPostulacion = (postulacion) => {
    setSelectedPostulacion(postulacion);
    setDialogType('view');
    setOpenDialog(true);
  };

  const handleApprovePostulacion = (postulacion) => {
    setSelectedPostulacion(postulacion);
    setDialogType('approve');
    setOpenDialog(true);
  };

  const handleRejectPostulacion = (postulacion) => {
    setSelectedPostulacion(postulacion);
    setDialogType('reject');
    setOpenDialog(true);
  };

  const handleEditPostulacion = (postulacion) => {
    setSelectedPostulacion(postulacion);
    setDialogType('edit');
    setOpenDialog(true);
  };

  const handleEvaluarPostulacion = (postulacion) => {
    setSelectedPostulacion(postulacion);
    setNuevoEstado(postulacion.estado);
    setMensajeEvaluacion(postulacion.comentario_evaluacion || '');
    setDialogType('evaluar');
    setOpenDialog(true);
  };

  // Manejar actualización de estado
  const handleUpdateEstado = async () => {
    try {
      await postulacionesAPI.updateEstado(selectedPostulacion.id, {
        estado: nuevoEstado,
        comentario_evaluacion: mensajeEvaluacion
      });
      
      // Recargar datos
      await loadPostulaciones();
      
      // Cerrar modal
      setOpenDialog(false);
      setSelectedPostulacion(null);
      setNuevoEstado('');
      setMensajeEvaluacion('');
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  const handleViewInfoDocente = (postulacion) => {
    setSelectedDocente(postulacion.docente);
    setOpenInfoDocenteDialog(true);
  };

  const handleViewFormaciones = (postulacion) => {
    setSelectedFormaciones(postulacion.formaciones_academicas);
    setOpenFormacionesDialog(true);
  };

  const handleViewExperiencias = (postulacion) => {
    setSelectedExperiencias(postulacion.experiencias_laborales);
    setOpenExperienciasDialog(true);
  };

  const handleViewCursosHorarios = (postulacion) => {
    setSelectedCursosHorarios({
      cursosInteres: postulacion.cursosInteres,
      horarios: postulacion.horarios
    });
    setOpenCursosHorariosDialog(true);
  };

  // Cálculos para paginación
  const totalPages = Math.ceil(postulaciones.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedPostulaciones = postulaciones.slice(startIndex, endIndex);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  if (loading) {
    return null;
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
          Gestión de Postulaciones
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Administra las postulaciones de docentes para cursos de especialidad
        </Typography>
      </Box>

      {/* Tabla de Postulaciones */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Docente</TableCell>
                <TableCell>Especialidad</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Fecha Postulación</TableCell>
                <TableCell>Información Docente</TableCell>
                <TableCell>Formaciones Académicas</TableCell>
                <TableCell>Experiencias Laborales</TableCell>
                <TableCell>Cursos y Horarios</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedPostulaciones.map((postulacion) => (
                <TableRow key={postulacion.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {postulacion.docente.nombre.charAt(0)}
                      </Avatar>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {postulacion.docente.nombre}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {postulacion.especialidad.nombre}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {postulacion.especialidad.facultad}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={postulacion.estado}
                      color={getStatusColor(postulacion.estado)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(postulacion.fecha_postulacion)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Ver detalles de información personal">
                      <IconButton 
                        onClick={() => handleViewInfoDocente(postulacion)}
                        size="small"
                        color="info"
                      >
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Ver detalles de formaciones académicas">
                      <IconButton 
                        onClick={() => handleViewFormaciones(postulacion)}
                        size="small"
                        color="success"
                      >
                        <FormacionIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Ver detalles de experiencias laborales">
                      <IconButton 
                        onClick={() => handleViewExperiencias(postulacion)}
                        size="small"
                        color="secondary"
                      >
                        <WorkIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Ver detalles de cursos de interés y horarios">
                      <IconButton 
                        onClick={() => handleViewCursosHorarios(postulacion)}
                        size="small"
                        color="primary"
                      >
                        <CursosHorariosIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Evaluar postulación">
                      <IconButton 
                        onClick={() => handleEvaluarPostulacion(postulacion)}
                        size="small"
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Paginación */}
        {postulaciones.length > rowsPerPage && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <Pagination 
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Paper>

      {/* Dialog para ver detalles */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogType === 'evaluar' && 'Evaluar Postulación'}
        </DialogTitle>
        <DialogContent dividers>
          {selectedPostulacion && dialogType === 'evaluar' && (
            <Grid container spacing={3}>
              {/* Solo formulario de evaluación */}
              <Grid item xs={12}>
                <Stack spacing={3}>
                  <FormControl fullWidth>
                    <InputLabel>Estado de la Postulación</InputLabel>
                    <Select
                      value={nuevoEstado}
                      label="Estado de la Postulación"
                      onChange={(e) => setNuevoEstado(e.target.value)}
                    >
                      <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
                      <MenuItem value="EVALUANDO">EVALUANDO</MenuItem>
                      <MenuItem value="APROBADO">APROBADO</MenuItem>
                      <MenuItem value="RECHAZADO">RECHAZADO</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label={
                      nuevoEstado === 'APROBADO' ? 'Mensaje de entrevista' :
                      nuevoEstado === 'RECHAZADO' ? 'Motivo de rechazo' :
                      nuevoEstado === 'EVALUANDO' ? 'Comentarios de evaluación' :
                      'Observaciones'
                    }
                    placeholder={
                      nuevoEstado === 'APROBADO' ? 'Ingrese mensaje con detalles de la entrevista...' :
                      nuevoEstado === 'RECHAZADO' ? 'Ingrese el motivo del rechazo...' :
                      nuevoEstado === 'EVALUANDO' ? 'Ingrese comentarios sobre el proceso de evaluación...' :
                      'Ingrese observaciones adicionales...'
                    }
                    value={mensajeEvaluacion}
                    onChange={(e) => setMensajeEvaluacion(e.target.value)}
                    required={nuevoEstado === 'APROBADO' || nuevoEstado === 'RECHAZADO'}
                  />
                </Stack>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Cancelar
          </Button>
          {dialogType === 'evaluar' && (
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleUpdateEstado}
              disabled={!nuevoEstado || ((nuevoEstado === 'APROBADO' || nuevoEstado === 'RECHAZADO') && !mensajeEvaluacion)}
            >
              Actualizar Estado
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Modal para mostrar información del docente */}
      <Dialog 
        open={openInfoDocenteDialog} 
        onClose={() => setOpenInfoDocenteDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          bgcolor: 'info.main', 
          color: 'white', 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1 
        }}>
          <InfoIcon />
          Información Personal del Docente
        </DialogTitle>
        <DialogContent dividers>
          {selectedDocente && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {/* Información básica */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
                  Datos Personales
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, fontSize: '1.5rem' }}>
                    {selectedDocente.nombres?.charAt(0) || selectedDocente.nombre?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {selectedDocente.nombres} {selectedDocente.apellidos}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedDocente.email}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Detalles personales */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Documento de Identidad
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
                    {selectedDocente.dni || 'No especificado'}
                  </Typography>
                  
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Fecha de Nacimiento
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
                    {selectedDocente.fecha_nacimiento ? 
                      new Date(selectedDocente.fecha_nacimiento).toLocaleDateString('es-ES') : 
                      'No especificada'
                    }
                  </Typography>

                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Género
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {selectedDocente.genero || 'No especificado'}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    País de Residencia
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
                    {selectedDocente.pais || 'No especificado'}
                  </Typography>
                  
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Dirección
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
                    {selectedDocente.direccion || 'No especificada'}
                  </Typography>

                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Teléfono
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {selectedDocente.telefono || 'No especificado'}
                  </Typography>
                </Paper>
              </Grid>

              {/* Información del CV */}
              {selectedDocente.cv_archivo && (
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
                    <Typography variant="subtitle2" color="primary.main" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Curriculum Vitae
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <InfoIcon color="primary" />
                      <Typography variant="body1">
                        Archivo: {selectedDocente.cv_archivo}
                      </Typography>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        color="primary"
                        sx={{ ml: 'auto' }}
                      >
                        Descargar CV
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setOpenInfoDocenteDialog(false)}
            variant="contained"
            color="primary"
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para mostrar formaciones académicas */}
      <Dialog 
        open={openFormacionesDialog} 
        onClose={() => setOpenFormacionesDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ 
          bgcolor: 'success.main', 
          color: 'white', 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1 
        }}>
          <FormacionIcon />
          Formaciones Académicas del Docente
        </DialogTitle>
        <DialogContent dividers>
          {selectedFormaciones && selectedFormaciones.length > 0 ? (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {/* Header */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: 'success.main', fontWeight: 'bold' }}>
                  Historial Académico
                </Typography>
              </Grid>
              
              {/* Lista de formaciones */}
              {selectedFormaciones.map((formacion, index) => (
                <Grid item xs={12} key={formacion.id}>
                  <Paper sx={{ 
                    p: 3, 
                    bgcolor: 'grey.50', 
                    border: '1px solid',
                    borderColor: 'success.200',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: 3,
                      borderColor: 'success.main'
                    }
                  }}>
                    <Grid container spacing={3}>
                      {/* Información principal */}
                      <Grid item xs={12} md={8}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                          <Avatar sx={{ 
                            bgcolor: 'success.main', 
                            width: 48, 
                            height: 48,
                            fontSize: '1.2rem',
                            fontWeight: 'bold'
                          }}>
                            {index + 1}
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main', mb: 1 }}>
                              {formacion.programa_academico}
                            </Typography>
                            <Chip 
                              label={formacion.nivel_formacion} 
                              color="success" 
                              variant="outlined"
                              sx={{ mb: 2, fontWeight: 'bold' }}
                            />
                            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                              {formacion.institucion}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formacion.pais}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      {/* Fecha y documento */}
                      <Grid item xs={12} md={4}>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Fecha de Obtención
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 3 }}>
                            {formacion.fecha_obtencion ? 
                              new Date(formacion.fecha_obtencion).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              }) : 
                              'No especificada'
                            }
                          </Typography>
                        </Box>
                      </Grid>

                      {/* Información del documento */}
                      {formacion.documento_archivo && (
                        <Grid item xs={12}>
                          <Paper sx={{ 
                            p: 2, 
                            bgcolor: 'success.50', 
                            border: '1px solid', 
                            borderColor: 'success.200',
                            borderRadius: 1
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <InfoIcon color="success" />
                              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                                <strong>Documento:</strong> {formacion.documento_archivo}
                              </Typography>
                              <Button 
                                variant="outlined" 
                                size="small" 
                                color="success"
                                sx={{ minWidth: 'auto' }}
                              >
                                Descargar
                              </Button>
                            </Box>
                          </Paper>
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              py: 6 
            }}>
              <FormacionIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Sin formaciones académicas registradas
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Este docente no ha registrado ninguna formación académica.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setOpenFormacionesDialog(false)}
            variant="contained"
            color="success"
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para mostrar experiencias laborales */}
      <Dialog 
        open={openExperienciasDialog} 
        onClose={() => setOpenExperienciasDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ 
          bgcolor: 'secondary.main', 
          color: 'white', 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1 
        }}>
          <WorkIcon />
          Experiencias Laborales del Docente
        </DialogTitle>
        <DialogContent dividers>
          {selectedExperiencias && selectedExperiencias.length > 0 ? (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {/* Header */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: 'secondary.main', fontWeight: 'bold' }}>
                  Historial Laboral
                </Typography>
              </Grid>
              
              {/* Lista de experiencias */}
              {selectedExperiencias.map((experiencia, index) => (
                <Grid item xs={12} key={experiencia.id}>
                  <Paper sx={{ 
                    p: 3, 
                    bgcolor: 'grey.50', 
                    border: '1px solid',
                    borderColor: 'secondary.200',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: 3,
                      borderColor: 'secondary.main'
                    }
                  }}>
                    <Grid container spacing={3}>
                      {/* Información principal */}
                      <Grid item xs={12} md={8}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                          <Avatar sx={{ 
                            bgcolor: 'secondary.main', 
                            width: 48, 
                            height: 48,
                            fontSize: '1.2rem',
                            fontWeight: 'bold'
                          }}>
                            {index + 1}
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'secondary.main', mb: 1 }}>
                              {experiencia.cargo}
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                              {experiencia.empresa}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                              <Chip 
                                label={experiencia.sector} 
                                color="secondary" 
                                variant="outlined"
                                size="small"
                              />
                              <Chip 
                                label={experiencia.pais} 
                                color="default" 
                                variant="outlined"
                                size="small"
                              />
                              {experiencia.actual === 1 && (
                                <Chip 
                                  label="Trabajo Actual" 
                                  color="success" 
                                  variant="filled"
                                  size="small"
                                  sx={{ fontWeight: 'bold' }}
                                />
                              )}
                            </Box>
                            {experiencia.ruc && (
                              <Typography variant="body2" color="text.secondary">
                                RUC: {experiencia.ruc}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Grid>

                      {/* Fechas y período */}
                      <Grid item xs={12} md={4}>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Período Laboral
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                            {experiencia.fecha_inicio ? 
                              new Date(experiencia.fecha_inicio).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'short'
                              }) : 
                              'No especificada'
                            }
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            hasta
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 3 }}>
                            {experiencia.actual === 1 ? 
                              'Actualidad' : 
                              (experiencia.fecha_fin ? 
                                new Date(experiencia.fecha_fin).toLocaleDateString('es-ES', {
                                  year: 'numeric',
                                  month: 'short'
                                }) : 
                                'No especificada'
                              )
                            }
                          </Typography>
                        </Box>
                      </Grid>

                      {/* Información de la constancia */}
                      {experiencia.constancia_archivo && (
                        <Grid item xs={12}>
                          <Paper sx={{ 
                            p: 2, 
                            bgcolor: 'secondary.50', 
                            border: '1px solid', 
                            borderColor: 'secondary.200',
                            borderRadius: 1
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <InfoIcon color="secondary" />
                              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                                <strong>Constancia:</strong> {experiencia.constancia_archivo}
                              </Typography>
                              <Button 
                                variant="outlined" 
                                size="small" 
                                color="secondary"
                                sx={{ minWidth: 'auto' }}
                              >
                                Descargar
                              </Button>
                            </Box>
                          </Paper>
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              py: 6 
            }}>
              <WorkIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Sin experiencias laborales registradas
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Este docente no ha registrado ninguna experiencia laboral.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setOpenExperienciasDialog(false)}
            variant="contained"
            color="secondary"
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para mostrar cursos y horarios */}
      <Dialog 
        open={openCursosHorariosDialog} 
        onClose={() => setOpenCursosHorariosDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ 
          bgcolor: 'primary.main', 
          color: 'white', 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1 
        }}>
          <CursosHorariosIcon />
          Cursos de Interés y Horarios Disponibles
        </DialogTitle>
        <DialogContent dividers>
          {selectedCursosHorarios && (
            <Grid container spacing={4} sx={{ mt: 1 }}>
              {/* Sección de Cursos de Interés */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
                  Cursos de Interés
                </Typography>
                
                {selectedCursosHorarios.cursosInteres && selectedCursosHorarios.cursosInteres.length > 0 ? (
                  <Grid container spacing={2}>
                    {selectedCursosHorarios.cursosInteres.map((curso, index) => (
                      <Grid item xs={12} key={curso.id}>
                        <Paper sx={{ 
                          p: 2, 
                          bgcolor: 'grey.50', 
                          border: '1px solid',
                          borderColor: 'primary.200',
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: 2,
                            borderColor: 'primary.main'
                          }
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ 
                              bgcolor: 'primary.main', 
                              width: 40, 
                              height: 40,
                              fontSize: '1rem',
                              fontWeight: 'bold'
                            }}>
                              {index + 1}
                            </Avatar>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 0.5 }}>
                                {curso.nombre}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Código: {curso.codigo}
                              </Typography>
                              {curso.ciclo && (
                                <Chip 
                                  label={`Ciclo ${curso.ciclo}`} 
                                  color="primary" 
                                  variant="outlined"
                                  size="small"
                                />
                              )}
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    py: 4 
                  }}>
                    <AssignmentIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                    <Typography variant="body1" color="text.secondary">
                      Sin cursos de interés registrados
                    </Typography>
                  </Box>
                )}
              </Grid>

              {/* Sección de Horarios Disponibles */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
                  Horarios Disponibles
                </Typography>
                
                {selectedCursosHorarios.horarios && selectedCursosHorarios.horarios.length > 0 ? (
                  <Grid container spacing={2}>
                    {selectedCursosHorarios.horarios.map((horario, index) => (
                      <Grid item xs={12} key={index}>
                        <Paper sx={{ 
                          p: 2, 
                          bgcolor: 'grey.50', 
                          border: '1px solid',
                          borderColor: 'primary.200',
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: 2,
                            borderColor: 'primary.main'
                          }
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ 
                              bgcolor: 'primary.main', 
                              width: 40, 
                              height: 40,
                              fontSize: '0.9rem',
                              fontWeight: 'bold'
                            }}>
                              <ScheduleIcon />
                            </Avatar>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 0.5 }}>
                                {horario.dia}
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {horario.hora_inicio} - {horario.hora_fin}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Disponibilidad: {((new Date(`1970-01-01T${horario.hora_fin}:00`) - new Date(`1970-01-01T${horario.hora_inicio}:00`)) / (1000 * 60 * 60)).toFixed(1)} horas
                              </Typography>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    py: 4 
                  }}>
                    <ScheduleIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                    <Typography variant="body1" color="text.secondary">
                      Sin horarios disponibles registrados
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setOpenCursosHorariosDialog(false)}
            variant="contained"
            color="primary"
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PostulacionesPage;
