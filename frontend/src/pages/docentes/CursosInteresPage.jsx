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
  Autocomplete
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
  Favorite as FavoriteIcon,
  Star as StarIcon,
  LocalLibrary as LibraryIcon
} from '@mui/icons-material';

const CursosInteresPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [alert, setAlert] = useState(null);
  const [page, setPage] = useState(1);

  // DATOS MOCK - Tabla 'docente_cursos_interes'
  const [cursosInteres, setCursosInteres] = useState([
    {
      id: 1,
      curso_id: 1,
      curso_nombre: 'Cardiología Intervencional Avanzada',
      especialidad: 'Cardiología',
      facultad: 'Medicina',
      nivel_prioridad: 'Alta',
      fecha_registro: '2024-01-15',
      comentarios: 'Tengo amplia experiencia en este campo y me gustaría enseñar técnicas avanzadas de cateterismo.'
    },
    {
      id: 2,
      curso_id: 2,
      curso_nombre: 'Ecocardiografía Diagnóstica',
      especialidad: 'Cardiología',
      facultad: 'Medicina',
      nivel_prioridad: 'Alta',
      fecha_registro: '2024-01-20',
      comentarios: 'Manejo todas las modalidades de ecocardiografía y tengo certificaciones internacionales.'
    },
    {
      id: 3,
      curso_id: 3,
      curso_nombre: 'Medicina Interna General',
      especialidad: 'Medicina Interna',
      facultad: 'Medicina',
      nivel_prioridad: 'Media',
      fecha_registro: '2024-02-05',
      comentarios: 'Puedo dictar cursos generales de medicina interna para estudiantes de pregrado.'
    },
    {
      id: 4,
      curso_id: 4,
      curso_nombre: 'Investigación Clínica en Cardiología',
      especialidad: 'Cardiología',
      facultad: 'Medicina',
      nivel_prioridad: 'Baja',
      fecha_registro: '2024-02-10',
      comentarios: 'Tengo experiencia en investigación pero prefiero enfocarme en la práctica clínica.'
    }
  ]);

  // Datos mock de cursos disponibles
  const cursosDisponibles = [
    { id: 1, nombre: 'Cardiología Intervencional Avanzada', especialidad: 'Cardiología', facultad: 'Medicina' },
    { id: 2, nombre: 'Ecocardiografía Diagnóstica', especialidad: 'Cardiología', facultad: 'Medicina' },
    { id: 3, nombre: 'Medicina Interna General', especialidad: 'Medicina Interna', facultad: 'Medicina' },
    { id: 4, nombre: 'Investigación Clínica en Cardiología', especialidad: 'Cardiología', facultad: 'Medicina' },
    { id: 5, nombre: 'Farmacología Cardiovascular', especialidad: 'Cardiología', facultad: 'Medicina' },
    { id: 6, nombre: 'Urgencias Cardiológicas', especialidad: 'Cardiología', facultad: 'Medicina' },
    { id: 7, nombre: 'Anatomía Cardiovascular', especialidad: 'Anatomía', facultad: 'Medicina' },
    { id: 8, nombre: 'Fisiología Cardíaca', especialidad: 'Fisiología', facultad: 'Medicina' }
  ];

  const [currentCursoInteres, setCurrentCursoInteres] = useState({
    curso_id: null,
    curso_nombre: '',
    especialidad: '',
    facultad: '',
    nivel_prioridad: '',
    comentarios: ''
  });

  const nivelesPrivridad = ['Alta', 'Media', 'Baja'];

  // Estadísticas calculadas
  const estadisticas = {
    total: cursosInteres.length,
    prioridadAlta: cursosInteres.filter(c => c.nivel_prioridad === 'Alta').length,
    especialidades: [...new Set(cursosInteres.map(c => c.especialidad))].length,
    facultades: [...new Set(cursosInteres.map(c => c.facultad))].length
  };

  const handleOpenDialog = (cursoInteres = null) => {
    if (cursoInteres) {
      setCurrentCursoInteres({
        ...cursoInteres
      });
      setEditMode(true);
    } else {
      setCurrentCursoInteres({
        curso_id: null,
        curso_nombre: '',
        especialidad: '',
        facultad: '',
        nivel_prioridad: '',
        comentarios: ''
      });
      setEditMode(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentCursoInteres({
      curso_id: null,
      curso_nombre: '',
      especialidad: '',
      facultad: '',
      nivel_prioridad: '',
      comentarios: ''
    });
  };

  const handleCursoChange = (event, newValue) => {
    if (newValue) {
      setCurrentCursoInteres({
        ...currentCursoInteres,
        curso_id: newValue.id,
        curso_nombre: newValue.nombre,
        especialidad: newValue.especialidad,
        facultad: newValue.facultad
      });
    } else {
      setCurrentCursoInteres({
        ...currentCursoInteres,
        curso_id: null,
        curso_nombre: '',
        especialidad: '',
        facultad: ''
      });
    }
  };

  const handleSubmit = () => {
    if (!currentCursoInteres.curso_id || !currentCursoInteres.nivel_prioridad) {
      setAlert({ 
        type: 'error', 
        message: 'Curso y nivel de prioridad son obligatorios' 
      });
      return;
    }

    // Verificar si el curso ya está registrado (solo para nuevo registro)
    if (!editMode && cursosInteres.some(c => c.curso_id === currentCursoInteres.curso_id)) {
      setAlert({ 
        type: 'error', 
        message: 'Este curso ya está registrado en tus intereses' 
      });
      return;
    }

    if (editMode) {
      setCursosInteres(prev => prev.map(c => 
        c.id === currentCursoInteres.id ? currentCursoInteres : c
      ));
      setAlert({ type: 'success', message: 'Curso de interés actualizado correctamente' });
    } else {
      const newCursoInteres = {
        ...currentCursoInteres,
        id: Math.max(...cursosInteres.map(c => c.id), 0) + 1,
        fecha_registro: new Date().toISOString().split('T')[0]
      };
      setCursosInteres(prev => [...prev, newCursoInteres]);
      setAlert({ type: 'success', message: 'Curso de interés agregado correctamente' });
    }
    
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este curso de tu lista de intereses?')) {
      setCursosInteres(prev => prev.filter(c => c.id !== id));
      setAlert({ type: 'success', message: 'Curso eliminado de tus intereses' });
    }
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case 'Alta': return 'error';
      case 'Media': return 'warning';
      case 'Baja': return 'info';
      default: return 'default';
    }
  };

  const getPrioridadIcon = (prioridad) => {
    switch (prioridad) {
      case 'Alta': return <StarIcon />;
      case 'Media': return <FavoriteIcon />;
      case 'Baja': return <LibraryIcon />;
      default: return <SchoolIcon />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header con estadísticas */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 3 }}>
          Mis Cursos de Interés
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <SchoolIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" component="div">
                  {estadisticas.total}
                </Typography>
                <Typography color="text.secondary">
                  Total Cursos
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <StarIcon color="error" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" component="div">
                  {estadisticas.prioridadAlta}
                </Typography>
                <Typography color="text.secondary">
                  Prioridad Alta
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <FavoriteIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" component="div">
                  {estadisticas.especialidades}
                </Typography>
                <Typography color="text.secondary">
                  Especialidades
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <LibraryIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" component="div">
                  {estadisticas.facultades}
                </Typography>
                <Typography color="text.secondary">
                  Facultades
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

      {/* Tabla de cursos de interés */}
      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Curso</TableCell>
                  <TableCell>Especialidad</TableCell>
                  <TableCell>Facultad</TableCell>
                  <TableCell>Prioridad</TableCell>
                  <TableCell>Fecha Registro</TableCell>
                  <TableCell>Comentarios</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cursosInteres.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body1" color="text.secondary">
                        No tienes cursos de interés registrados
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  cursosInteres.map((cursoInteres) => (
                    <TableRow key={cursoInteres.id}>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {cursoInteres.curso_nombre}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={cursoInteres.especialidad}
                          color="primary"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{cursoInteres.facultad}</TableCell>
                      <TableCell>
                        <Chip 
                          icon={getPrioridadIcon(cursoInteres.nivel_prioridad)}
                          label={cursoInteres.nivel_prioridad}
                          color={getPrioridadColor(cursoInteres.nivel_prioridad)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{formatFecha(cursoInteres.fecha_registro)}</TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            maxWidth: 200, 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                          title={cursoInteres.comentarios}
                        >
                          {cursoInteres.comentarios || 'Sin comentarios'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenDialog(cursoInteres)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleDelete(cursoInteres.id)}
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
          {cursosInteres.length > 10 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination 
                count={Math.ceil(cursosInteres.length / 10)}
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
          {editMode ? 'Editar Curso de Interés' : 'Agregar Nuevo Curso de Interés'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Autocomplete
              options={cursosDisponibles}
              getOptionLabel={(option) => `${option.nombre} (${option.especialidad})`}
              value={cursosDisponibles.find(c => c.id === currentCursoInteres.curso_id) || null}
              onChange={handleCursoChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Seleccionar Curso"
                  required
                  placeholder="Busca y selecciona un curso..."
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box>
                    <Typography variant="subtitle2">
                      {option.nombre}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {option.especialidad} - {option.facultad}
                    </Typography>
                  </Box>
                </Box>
              )}
              disabled={editMode}
            />
            
            {currentCursoInteres.especialidad && (
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Especialidad"
                    value={currentCursoInteres.especialidad}
                    fullWidth
                    disabled
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Facultad"
                    value={currentCursoInteres.facultad}
                    fullWidth
                    disabled
                  />
                </Grid>
              </Grid>
            )}
            
            <FormControl fullWidth required>
              <InputLabel>Nivel de Prioridad</InputLabel>
              <Select
                value={currentCursoInteres.nivel_prioridad}
                label="Nivel de Prioridad"
                onChange={(e) => setCurrentCursoInteres({ 
                  ...currentCursoInteres, 
                  nivel_prioridad: e.target.value 
                })}
              >
                {nivelesPrivridad.map((nivel) => (
                  <MenuItem key={nivel} value={nivel}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getPrioridadIcon(nivel)}
                      {nivel}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              label="Comentarios"
              value={currentCursoInteres.comentarios}
              onChange={(e) => setCurrentCursoInteres({ 
                ...currentCursoInteres, 
                comentarios: e.target.value 
              })}
              multiline
              rows={3}
              fullWidth
              placeholder="Describe tu experiencia, interés o capacidades relacionadas con este curso..."
              helperText="Estos comentarios ayudarán a evaluar tu idoneidad para dictar el curso"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editMode ? 'Actualizar' : 'Agregar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CursosInteresPage;
