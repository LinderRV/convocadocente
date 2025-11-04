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
  Tooltip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
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
  Assessment as EvaluatingIcon,
  Schedule as ScheduleIcon,
  School as SchoolIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';

const PostulacionesPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [alert, setAlert] = useState(null);
  const [page, setPage] = useState(1);
  const [selectedPostulacion, setSelectedPostulacion] = useState(null);

  // DATOS MOCK - Tabla 'postulaciones_cursos_especialidad' CON HORARIOS Y CURSOS
  const [postulaciones, setPostulaciones] = useState([
    {
      id: 1,
      user_id: 1,
      c_codfac: 'S',
      c_codesp: 'S1',
      facultad_nombre: 'CIENCIAS DE LA SALUD',
      especialidad_nombre: 'ENFERMERÍA',
      estado: 'EVALUANDO',
      mensaje_entrevista: null,
      evaluador_user_id: null,
      fecha_postulacion: '2024-02-01',
      // HORARIOS CONFIGURADOS (tabla docente_horarios)
      horarios: [
        { dia_semana: 'Lunes', hora_inicio: '08:00', hora_fin: '12:00' },
        { dia_semana: 'Miércoles', hora_inicio: '14:00', hora_fin: '18:00' },
        { dia_semana: 'Viernes', hora_inicio: '08:00', hora_fin: '12:00' }
      ],
      // CURSOS DE INTERÉS (relación con plan_estudio_curso)
      cursos_interes: [
        { id: 1, c_nomcur: 'Anatomía y Fisiología Humana' },
        { id: 2, c_nomcur: 'Fundamentos de Enfermería' },
        { id: 4, c_nomcur: 'Cuidados Intensivos' }
      ]
    },
    {
      id: 2,
      user_id: 1,
      c_codfac: 'M',
      c_codesp: 'M1',
      facultad_nombre: 'MEDICINA',
      especialidad_nombre: 'CARDIOLOGÍA',
      estado: 'APROBADO',
      mensaje_entrevista: 'Felicitaciones! Has sido seleccionado para dictar en la especialidad de Cardiología. Te contactaremos pronto para coordinar la entrevista final.',
      evaluador_user_id: 3,
      fecha_postulacion: '2024-01-28',
      horarios: [
        { dia_semana: 'Martes', hora_inicio: '08:00', hora_fin: '12:00' },
        { dia_semana: 'Jueves', hora_inicio: '14:00', hora_fin: '18:00' },
        { dia_semana: 'Sábado', hora_inicio: '08:00', hora_fin: '12:00' }
      ],
      cursos_interes: [
        { id: 8, c_nomcur: 'Cardiología Intervencional Avanzada' },
        { id: 9, c_nomcur: 'Ecocardiografía Diagnóstica' },
        { id: 11, c_nomcur: 'Urgencias Cardiológicas' }
      ]
    },
    {
      id: 3,
      user_id: 1,
      c_codfac: 'I',
      c_codesp: 'I1',
      facultad_nombre: 'INGENIERÍA',
      especialidad_nombre: 'SISTEMAS',
      estado: 'RECHAZADO',
      mensaje_entrevista: null,
      evaluador_user_id: 4,
      fecha_postulacion: '2024-01-15',
      horarios: [
        { dia_semana: 'Lunes', hora_inicio: '18:00', hora_fin: '22:00' },
        { dia_semana: 'Miércoles', hora_inicio: '18:00', hora_fin: '22:00' }
      ],
      cursos_interes: [
        { id: 15, c_nomcur: 'Programación Avanzada' },
        { id: 16, c_nomcur: 'Base de Datos' }
      ]
    },
    {
      id: 4,
      user_id: 1,
      c_codfac: 'A',
      c_codesp: 'A1',
      facultad_nombre: 'ADMINISTRACIÓN',
      especialidad_nombre: 'ADMINISTRACIÓN',
      estado: 'PENDIENTE',
      mensaje_entrevista: null,
      evaluador_user_id: null,
      fecha_postulacion: '2024-03-01',
      horarios: [
        { dia_semana: 'Lunes', hora_inicio: '14:00', hora_fin: '18:00' },
        { dia_semana: 'Martes', hora_inicio: '14:00', hora_fin: '18:00' },
        { dia_semana: 'Miércoles', hora_inicio: '14:00', hora_fin: '18:00' },
        { dia_semana: 'Jueves', hora_inicio: '14:00', hora_fin: '18:00' },
        { dia_semana: 'Viernes', hora_inicio: '14:00', hora_fin: '18:00' }
      ],
      cursos_interes: [
        { id: 19, c_nomcur: 'Gestión Estratégica' },
        { id: 20, c_nomcur: 'Marketing Digital' },
        { id: 21, c_nomcur: 'Recursos Humanos' }
      ]
    }
  ]);

  // Datos mock de facultades y especialidades disponibles
  const facultadesDisponibles = [
    { c_codfac: 'S', nom_fac: 'CIENCIAS DE LA SALUD' },
    { c_codfac: 'M', nom_fac: 'MEDICINA' },
    { c_codfac: 'I', nom_fac: 'INGENIERÍA' },
    { c_codfac: 'A', nom_fac: 'ADMINISTRACIÓN' }
  ];

  const especialidadesDisponibles = [
    { c_codfac: 'S', c_codesp: 'S1', nomesp: 'ENFERMERÍA' },
    { c_codfac: 'M', c_codesp: 'M1', nomesp: 'CARDIOLOGÍA' },
    { c_codfac: 'M', c_codesp: 'M2', nomesp: 'MEDICINA INTERNA' },
    { c_codfac: 'I', c_codesp: 'I1', nomesp: 'SISTEMAS' },
    { c_codfac: 'I', c_codesp: 'I2', nomesp: 'INDUSTRIAL' },
    { c_codfac: 'A', c_codesp: 'A1', nomesp: 'ADMINISTRACIÓN' }
  ];

  const [currentPostulacion, setCurrentPostulacion] = useState({
    c_codfac: '',
    c_codesp: ''
  });

  const estados = ['PENDIENTE', 'EVALUANDO', 'APROBADO', 'RECHAZADO'];
  
  // Filtrar especialidades por facultad seleccionada
  const especialidadesFiltradas = especialidadesDisponibles.filter(
    esp => esp.c_codfac === currentPostulacion.c_codfac
  );

  const handleOpenDialog = (postulacion = null) => {
    if (postulacion) {
      setCurrentPostulacion({
        id: postulacion.id,
        c_codfac: postulacion.c_codfac,
        c_codesp: postulacion.c_codesp
      });
      setEditMode(true);
    } else {
      setCurrentPostulacion({
        c_codfac: '',
        c_codesp: ''
      });
      setEditMode(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentPostulacion({
      c_codfac: '',
      c_codesp: ''
    });
  };

  const handleViewPostulacion = (postulacion) => {
    setSelectedPostulacion(postulacion);
    setOpenViewDialog(true);
  };

  const handleSubmit = () => {
    if (!currentPostulacion.c_codfac || !currentPostulacion.c_codesp) {
      setAlert({ 
        type: 'error', 
        message: 'Facultad y especialidad son obligatorios' 
      });
      return;
    }

    // Verificar si ya existe postulación para esta facultad y especialidad
    if (!editMode && postulaciones.some(p => 
      p.c_codfac === currentPostulacion.c_codfac && 
      p.c_codesp === currentPostulacion.c_codesp
    )) {
      setAlert({ 
        type: 'error', 
        message: 'Ya tienes una postulación para esta especialidad' 
      });
      return;
    }

    if (editMode) {
      setPostulaciones(prev => prev.map(p => 
        p.id === currentPostulacion.id ? {
          ...p,
          c_codfac: currentPostulacion.c_codfac,
          c_codesp: currentPostulacion.c_codesp,
          facultad_nombre: facultadesDisponibles.find(f => f.c_codfac === currentPostulacion.c_codfac)?.nom_fac || '',
          especialidad_nombre: especialidadesDisponibles.find(e => e.c_codesp === currentPostulacion.c_codesp)?.nomesp || ''
        } : p
      ));
      setAlert({ type: 'success', message: 'Postulación actualizada correctamente' });
    } else {
      const facultad = facultadesDisponibles.find(f => f.c_codfac === currentPostulacion.c_codfac);
      const especialidad = especialidadesDisponibles.find(e => 
        e.c_codfac === currentPostulacion.c_codfac && e.c_codesp === currentPostulacion.c_codesp
      );
      
      const newPostulacion = {
        id: Math.max(...postulaciones.map(p => p.id), 0) + 1,
        user_id: 1, // ID del usuario logueado
        c_codfac: currentPostulacion.c_codfac,
        c_codesp: currentPostulacion.c_codesp,
        facultad_nombre: facultad?.nom_fac || '',
        especialidad_nombre: especialidad?.nomesp || '',
        estado: 'PENDIENTE',
        mensaje_entrevista: null,
        evaluador_user_id: null,
        fecha_postulacion: new Date().toISOString().split('T')[0]
      };
      setPostulaciones(prev => [...prev, newPostulacion]);
      setAlert({ type: 'success', message: 'Postulación enviada correctamente' });
    }
    
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    const postulacion = postulaciones.find(p => p.id === id);
    
    if (postulacion && (postulacion.estado === 'APROBADO' || postulacion.estado === 'EVALUANDO')) {
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
            📋 Mis Postulaciones
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Gestiona tus postulaciones a especialidades docentes
        </Typography>
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
              📋 Lista de Postulaciones
            </Typography>
          </Box>

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
                          Haz clic en el botón + para crear tu primera postulación
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
                        <Chip 
                          label={postulacion.c_codfac}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {postulacion.especialidad_nombre}
                        </Typography>
                        <Chip 
                          label={postulacion.c_codesp}
                          size="small"
                          color="secondary"
                          variant="outlined"
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

      {/* Dialog para agregar/editar postulación */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AssignmentIcon color="primary" />
            <Typography variant="h6">
              {editMode ? '✏️ Editar Postulación' : '➕ Nueva Postulación'}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Facultad</InputLabel>
                  <Select
                    value={currentPostulacion.c_codfac}
                    label="Facultad"
                    onChange={(e) => setCurrentPostulacion({ 
                      ...currentPostulacion, 
                      c_codfac: e.target.value,
                      c_codesp: '' // Reset especialidad cuando cambia facultad
                    })}
                  >
                    {facultadesDisponibles.map((facultad) => (
                      <MenuItem key={facultad.c_codfac} value={facultad.c_codfac}>
                        <Box>
                          <Typography variant="subtitle2">{facultad.nom_fac}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Código: {facultad.c_codfac}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required disabled={!currentPostulacion.c_codfac}>
                  <InputLabel>Especialidad</InputLabel>
                  <Select
                    value={currentPostulacion.c_codesp}
                    label="Especialidad"
                    onChange={(e) => setCurrentPostulacion({ 
                      ...currentPostulacion, 
                      c_codesp: e.target.value 
                    })}
                  >
                    {especialidadesFiltradas.map((especialidad) => (
                      <MenuItem key={especialidad.c_codesp} value={especialidad.c_codesp}>
                        <Box>
                          <Typography variant="subtitle2">{especialidad.nomesp}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Código: {especialidad.c_codesp}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    📋 <strong>Importante:</strong> Solo puedes tener una postulación activa por especialidad. 
                    Tu postulación será revisada por el director de la especialidad seleccionada.
                  </Typography>
                </Alert>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} variant="outlined">
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            startIcon={editMode ? <EditIcon /> : <AddIcon />}
          >
            {editMode ? 'Actualizar Postulación' : 'Enviar Postulación'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para ver detalles de postulación */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ViewIcon color="info" />
            <Typography variant="h6">
              👁️ Detalles de Postulación Completa
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
                      📚 {selectedPostulacion.facultad_nombre}
                    </Typography>
                    <Typography variant="subtitle1">
                      🎓 {selectedPostulacion.especialidad_nombre}
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
                    📅 {formatFecha(selectedPostulacion.fecha_postulacion)}
                  </Typography>
                </Grid>

                {/* CÓDIGOS */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Código Facultad:</Typography>
                  <Chip 
                    label={selectedPostulacion.c_codfac}
                    color="primary"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Código Especialidad:</Typography>
                  <Chip 
                    label={selectedPostulacion.c_codesp}
                    color="secondary"
                    size="small"
                    sx={{ mt: 1 }}
                  />
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
                        📚 Cursos de Interés
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
                        ⏰ Horarios Disponibles
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
                                  🕐 {horario.hora_inicio} - {horario.hora_fin}
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

                {/* MENSAJE DEL DIRECTOR */}
                {selectedPostulacion.mensaje_entrevista && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">💬 Mensaje del Director:</Typography>
                    <Card variant="outlined" sx={{ mt: 1, p: 2, bgcolor: 'success.light' }}>
                      <Typography variant="body2">
                        {selectedPostulacion.mensaje_entrevista}
                      </Typography>
                    </Card>
                  </Grid>
                )}

                {/* EVALUADOR */}
                {selectedPostulacion.evaluador_user_id && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">👨‍💼 Evaluador:</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      ID Usuario: {selectedPostulacion.evaluador_user_id}
                    </Typography>
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

export default PostulacionesPage;
