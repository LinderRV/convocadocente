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
  Checkbox,
  FormGroup,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  AccessTime as TimeIcon,
  CalendarToday as CalendarIcon,
  EventAvailable as EventIcon
} from '@mui/icons-material';

const HorariosPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [alert, setAlert] = useState(null);
  const [page, setPage] = useState(1);

  // DATOS MOCK - Tabla 'docente_horarios'
  const [horarios, setHorarios] = useState([
    {
      id: 1,
      dia_semana: 'Lunes',
      turno: 'Mañana',
      hora_inicio: '08:00',
      hora_fin: '12:00',
      es_disponible: true,
      fecha_registro: '2024-01-15',
      observaciones: 'Disponible para cursos de pregrado y postgrado'
    },
    {
      id: 2,
      dia_semana: 'Lunes',
      turno: 'Tarde',
      hora_inicio: '14:00',
      hora_fin: '18:00',
      es_disponible: true,
      fecha_registro: '2024-01-15',
      observaciones: 'Preferible para cursos clínicos'
    },
    {
      id: 3,
      dia_semana: 'Martes',
      turno: 'Mañana',
      hora_inicio: '08:00',
      hora_fin: '12:00',
      es_disponible: false,
      fecha_registro: '2024-01-15',
      observaciones: 'No disponible por consulta externa en hospital'
    },
    {
      id: 4,
      dia_semana: 'Miércoles',
      turno: 'Mañana',
      hora_inicio: '09:00',
      hora_fin: '13:00',
      es_disponible: true,
      fecha_registro: '2024-01-16',
      observaciones: 'Ideal para seminarios y conferencias'
    },
    {
      id: 5,
      dia_semana: 'Jueves',
      turno: 'Tarde',
      hora_inicio: '15:00',
      hora_fin: '19:00',
      es_disponible: true,
      fecha_registro: '2024-01-16',
      observaciones: 'Disponible para clases prácticas'
    },
    {
      id: 6,
      dia_semana: 'Viernes',
      turno: 'Mañana',
      hora_inicio: '08:00',
      hora_fin: '11:00',
      es_disponible: true,
      fecha_registro: '2024-01-17',
      observaciones: 'Horario reducido por actividades de investigación'
    }
  ]);

  const [currentHorario, setCurrentHorario] = useState({
    dia_semana: '',
    turno: '',
    hora_inicio: '',
    hora_fin: '',
    es_disponible: true,
    observaciones: ''
  });

  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const turnos = ['Mañana', 'Tarde', 'Noche'];

  // Estadísticas calculadas
  const estadisticas = {
    total: horarios.length,
    disponibles: horarios.filter(h => h.es_disponible).length,
    noDisponibles: horarios.filter(h => !h.es_disponible).length,
    horasSemanales: horarios.filter(h => h.es_disponible).reduce((total, h) => {
      const inicio = new Date(`2024-01-01 ${h.hora_inicio}`);
      const fin = new Date(`2024-01-01 ${h.hora_fin}`);
      const horas = (fin - inicio) / (1000 * 60 * 60);
      return total + horas;
    }, 0)
  };

  const handleOpenDialog = (horario = null) => {
    if (horario) {
      setCurrentHorario({
        ...horario
      });
      setEditMode(true);
    } else {
      setCurrentHorario({
        dia_semana: '',
        turno: '',
        hora_inicio: '',
        hora_fin: '',
        es_disponible: true,
        observaciones: ''
      });
      setEditMode(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentHorario({
      dia_semana: '',
      turno: '',
      hora_inicio: '',
      hora_fin: '',
      es_disponible: true,
      observaciones: ''
    });
  };

  const handleSubmit = () => {
    if (!currentHorario.dia_semana || !currentHorario.turno || 
        !currentHorario.hora_inicio || !currentHorario.hora_fin) {
      setAlert({ 
        type: 'error', 
        message: 'Día, turno, hora de inicio y hora de fin son obligatorios' 
      });
      return;
    }

    // Validar que hora de inicio sea menor que hora de fin
    const inicio = new Date(`2024-01-01 ${currentHorario.hora_inicio}`);
    const fin = new Date(`2024-01-01 ${currentHorario.hora_fin}`);
    
    if (inicio >= fin) {
      setAlert({ 
        type: 'error', 
        message: 'La hora de inicio debe ser menor que la hora de fin' 
      });
      return;
    }

    // Verificar solapamiento de horarios (solo para nuevo registro o edición que cambie día/horas)
    const conflicto = horarios.some(h => {
      if (editMode && h.id === currentHorario.id) return false; // Excluir el horario actual en edición
      
      if (h.dia_semana !== currentHorario.dia_semana) return false;
      
      const existeInicio = new Date(`2024-01-01 ${h.hora_inicio}`);
      const existeFin = new Date(`2024-01-01 ${h.hora_fin}`);
      
      return (inicio < existeFin && fin > existeInicio);
    });

    if (conflicto) {
      setAlert({ 
        type: 'error', 
        message: 'Este horario se solapa con otro horario existente en el mismo día' 
      });
      return;
    }

    if (editMode) {
      setHorarios(prev => prev.map(h => 
        h.id === currentHorario.id ? currentHorario : h
      ));
      setAlert({ type: 'success', message: 'Horario actualizado correctamente' });
    } else {
      const newHorario = {
        ...currentHorario,
        id: Math.max(...horarios.map(h => h.id), 0) + 1,
        fecha_registro: new Date().toISOString().split('T')[0]
      };
      setHorarios(prev => [...prev, newHorario]);
      setAlert({ type: 'success', message: 'Horario agregado correctamente' });
    }
    
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este horario?')) {
      setHorarios(prev => prev.filter(h => h.id !== id));
      setAlert({ type: 'success', message: 'Horario eliminado correctamente' });
    }
  };

  const handleToggleDisponibilidad = (id) => {
    setHorarios(prev => prev.map(h => 
      h.id === id ? { ...h, es_disponible: !h.es_disponible } : h
    ));
    setAlert({ type: 'success', message: 'Disponibilidad actualizada' });
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatHora = (hora) => {
    return hora.substring(0, 5); // Formato HH:MM
  };

  const getTurnoColor = (turno) => {
    switch (turno) {
      case 'Mañana': return 'primary';
      case 'Tarde': return 'warning';
      case 'Noche': return 'secondary';
      default: return 'default';
    }
  };

  const getDiaColor = (dia) => {
    const colores = {
      'Lunes': 'error',
      'Martes': 'warning', 
      'Miércoles': 'success',
      'Jueves': 'info',
      'Viernes': 'primary',
      'Sábado': 'secondary'
    };
    return colores[dia] || 'default';
  };

  const calcularDuracion = (horaInicio, horaFin) => {
    const inicio = new Date(`2024-01-01 ${horaInicio}`);
    const fin = new Date(`2024-01-01 ${horaFin}`);
    const horas = (fin - inicio) / (1000 * 60 * 60);
    return `${horas}h`;
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header con estadísticas */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 3 }}>
          Mis Horarios Disponibles
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <ScheduleIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" component="div">
                  {estadisticas.total}
                </Typography>
                <Typography color="text.secondary">
                  Total Horarios
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <EventIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" component="div">
                  {estadisticas.disponibles}
                </Typography>
                <Typography color="text.secondary">
                  Disponibles
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <CalendarIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" component="div">
                  {estadisticas.noDisponibles}
                </Typography>
                <Typography color="text.secondary">
                  No Disponibles
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <TimeIcon color="error" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" component="div">
                  {Math.round(estadisticas.horasSemanales)}
                </Typography>
                <Typography color="text.secondary">
                  Horas Disponibles/Semana
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

      {/* Tabla de horarios */}
      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Día</TableCell>
                  <TableCell>Turno</TableCell>
                  <TableCell>Horario</TableCell>
                  <TableCell>Duración</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Observaciones</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {horarios.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body1" color="text.secondary">
                        No tienes horarios registrados
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  horarios.map((horario) => (
                    <TableRow key={horario.id}>
                      <TableCell>
                        <Chip 
                          label={horario.dia_semana}
                          color={getDiaColor(horario.dia_semana)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={horario.turno}
                          color={getTurnoColor(horario.turno)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {formatHora(horario.hora_inicio)} - {formatHora(horario.hora_fin)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {calcularDuracion(horario.hora_inicio, horario.hora_fin)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={horario.es_disponible}
                          onChange={() => handleToggleDisponibilidad(horario.id)}
                          color="success"
                          size="small"
                        />
                        <Typography variant="caption" display="block">
                          {horario.es_disponible ? 'Disponible' : 'No disponible'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            maxWidth: 200, 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                          title={horario.observaciones}
                        >
                          {horario.observaciones || 'Sin observaciones'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenDialog(horario)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleDelete(horario.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Paginación */}
          {horarios.length > 10 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination 
                count={Math.ceil(horarios.length / 10)}
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

      {/* Dialog para agregar/editar */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editMode ? 'Editar Horario' : 'Agregar Nuevo Horario'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Día de la Semana</InputLabel>
                  <Select
                    value={currentHorario.dia_semana}
                    label="Día de la Semana"
                    onChange={(e) => setCurrentHorario({ 
                      ...currentHorario, 
                      dia_semana: e.target.value 
                    })}
                  >
                    {diasSemana.map((dia) => (
                      <MenuItem key={dia} value={dia}>
                        {dia}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Turno</InputLabel>
                  <Select
                    value={currentHorario.turno}
                    label="Turno"
                    onChange={(e) => setCurrentHorario({ 
                      ...currentHorario, 
                      turno: e.target.value 
                    })}
                  >
                    {turnos.map((turno) => (
                      <MenuItem key={turno} value={turno}>
                        {turno}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  type="time"
                  label="Hora de Inicio"
                  value={currentHorario.hora_inicio}
                  onChange={(e) => setCurrentHorario({ 
                    ...currentHorario, 
                    hora_inicio: e.target.value 
                  })}
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  type="time"
                  label="Hora de Fin"
                  value={currentHorario.hora_fin}
                  onChange={(e) => setCurrentHorario({ 
                    ...currentHorario, 
                    hora_fin: e.target.value 
                  })}
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={currentHorario.es_disponible}
                      onChange={(e) => setCurrentHorario({ 
                        ...currentHorario, 
                        es_disponible: e.target.checked 
                      })}
                      color="success"
                    />
                  }
                  label="Disponible para dictar clases"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Observaciones"
                  value={currentHorario.observaciones}
                  onChange={(e) => setCurrentHorario({ 
                    ...currentHorario, 
                    observaciones: e.target.value 
                  })}
                  multiline
                  rows={3}
                  fullWidth
                  placeholder="Agrega comentarios sobre este horario (ej: preferencias, limitaciones, etc.)"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editMode ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HorariosPage;
