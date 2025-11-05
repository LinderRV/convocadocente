import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Alert,
  Checkbox,
  FormControlLabel,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  AccessTime as AccessTimeIcon,
  School as SchoolIcon,
  Category as CategoryIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { postulacionDocenteAPI } from '../../services/docentes/postulacionDocenteAPI';

const CrearPostulacionPage = () => {
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  // Datos del backend
  const [facultades, setFacultades] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [cursos, setCursos] = useState([]);

  // Jerarquía de selección
  const [facultadSeleccionada, setFacultadSeleccionada] = useState('');
  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState('');

  // Estado simple para cada día
  const [horarios, setHorarios] = useState({
    'Lunes': { activo: false, hora_inicio: '', hora_fin: '' },
    'Martes': { activo: false, hora_inicio: '', hora_fin: '' },
    'Miércoles': { activo: false, hora_inicio: '', hora_fin: '' },
    'Jueves': { activo: false, hora_inicio: '', hora_fin: '' },
    'Viernes': { activo: false, hora_inicio: '', hora_fin: '' },
    'Sábado': { activo: false, hora_inicio: '', hora_fin: '' },
    'Domingo': { activo: false, hora_inicio: '', hora_fin: '' }
  });

  // Cursos de interés seleccionados
  const [cursosInteres, setCursosInteres] = useState([]);

  // Cargar facultades al montar el componente
  useEffect(() => {
    cargarFacultades();
  }, []);

  const cargarFacultades = async () => {
    try {
      setLoading(true);
      const response = await postulacionDocenteAPI.getFacultades();
      if (response.success) {
        setFacultades(response.data);
      } else {
        setAlert({ type: 'error', message: response.message || 'Error al cargar facultades' });
      }
    } catch (error) {
      console.error('Error al cargar facultades:', error);
      setAlert({ type: 'error', message: 'Error al cargar facultades' });
    } finally {
      setLoading(false);
    }
  };

  const cargarEspecialidades = async (c_codfac) => {
    try {
      setLoading(true);
      const response = await postulacionDocenteAPI.getEspecialidadesByFacultad(c_codfac);
      if (response.success) {
        setEspecialidades(response.data);
      } else {
        setAlert({ type: 'error', message: response.message || 'Error al cargar especialidades' });
      }
    } catch (error) {
      console.error('Error al cargar especialidades:', error);
      setAlert({ type: 'error', message: 'Error al cargar especialidades' });
    } finally {
      setLoading(false);
    }
  };

  const cargarCursos = async (c_codfac, c_codesp) => {
    try {
      setLoading(true);
      const response = await postulacionDocenteAPI.getCursosByEspecialidad(c_codfac, c_codesp);
      if (response.success) {
        setCursos(response.data);
      } else {
        setAlert({ type: 'error', message: response.message || 'Error al cargar cursos' });
      }
    } catch (error) {
      console.error('Error al cargar cursos:', error);
      setAlert({ type: 'error', message: 'Error al cargar cursos' });
    } finally {
      setLoading(false);
    }
  };

  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  // Verificar si ya existe postulación para la especialidad
  const verificarPostulacionExistente = async (c_codfac, c_codesp) => {
    try {
      const response = await postulacionDocenteAPI.verificarPostulacion(c_codfac, c_codesp);
      return response.data;
    } catch (error) {
      console.error('Error al verificar postulación:', error);
      return { puede_postular: true, postulacion_existente: null };
    }
  };

  // Manejar cambio de facultad - REINICIA TODO
  const handleFacultadChange = async (nuevaFacultad) => {
    setFacultadSeleccionada(nuevaFacultad);
    setEspecialidadSeleccionada(''); // Reset especialidad
    setEspecialidades([]); // Limpiar especialidades
    setCursos([]); // Limpiar cursos
    
    // Limpiar horarios
    setHorarios({
      'Lunes': { activo: false, hora_inicio: '', hora_fin: '' },
      'Martes': { activo: false, hora_inicio: '', hora_fin: '' },
      'Miércoles': { activo: false, hora_inicio: '', hora_fin: '' },
      'Jueves': { activo: false, hora_inicio: '', hora_fin: '' },
      'Viernes': { activo: false, hora_inicio: '', hora_fin: '' },
      'Sábado': { activo: false, hora_inicio: '', hora_fin: '' },
      'Domingo': { activo: false, hora_inicio: '', hora_fin: '' }
    });
    
    // Limpiar cursos de interés
    setCursosInteres([]);
    
    // Cargar especialidades de la nueva facultad
    if (nuevaFacultad) {
      await cargarEspecialidades(nuevaFacultad);
      setAlert({ 
        type: 'info', 
        message: 'Facultad seleccionada. Ahora elige una especialidad.' 
      });
    }
  };

  // Manejar cambio de especialidad - REINICIA horarios y cursos
  const handleEspecialidadChange = async (nuevaEspecialidad) => {
    setEspecialidadSeleccionada(nuevaEspecialidad);
    setCursos([]); // Limpiar cursos previos
    
    // Limpiar horarios
    setHorarios({
      'Lunes': { activo: false, hora_inicio: '', hora_fin: '' },
      'Martes': { activo: false, hora_inicio: '', hora_fin: '' },
      'Miércoles': { activo: false, hora_inicio: '', hora_fin: '' },
      'Jueves': { activo: false, hora_inicio: '', hora_fin: '' },
      'Viernes': { activo: false, hora_inicio: '', hora_fin: '' },
      'Sábado': { activo: false, hora_inicio: '', hora_fin: '' },
      'Domingo': { activo: false, hora_inicio: '', hora_fin: '' }
    });
    
    // Limpiar cursos de interés
    setCursosInteres([]);
    
    // Cargar cursos de la nueva especialidad
    if (nuevaEspecialidad && facultadSeleccionada) {
      await cargarCursos(facultadSeleccionada, nuevaEspecialidad);
      setAlert({ 
        type: 'info', 
        message: 'Especialidad seleccionada. Configura tus horarios y elige cursos de interés.' 
      });
    }
  };

  // Manejar selección/deselección de curso
  const handleCursoToggle = (cursoId) => {
    setCursosInteres(prev => {
      if (prev.includes(cursoId)) {
        // Quitar curso
        const newList = prev.filter(id => id !== cursoId);
        setAlert({ type: 'success', message: 'Curso eliminado de tus intereses' });
        return newList;
      } else {
        // Agregar curso
        const newList = [...prev, cursoId];
        setAlert({ type: 'success', message: 'Curso agregado a tus intereses' });
        return newList;
      }
    });
  };

  // Obtener curso por ID
  const getCursoById = (id) => {
    return cursos.find(c => c.id === id) || null;
  };

  // Manejar cambio de checkbox
  const handleCheckboxChange = (dia) => {
    setHorarios(prev => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        activo: !prev[dia].activo,
        // Si se desmarca, limpiar las horas
        hora_inicio: !prev[dia].activo ? prev[dia].hora_inicio : '',
        hora_fin: !prev[dia].activo ? prev[dia].hora_fin : ''
      }
    }));
  };

  // Manejar cambio de horas
  const handleTimeChange = (dia, campo, valor) => {
    setHorarios(prev => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        [campo]: valor
      }
    }));
  };

  // Guardar todos los horarios y cursos
  const handleGuardar = async () => {
    if (!facultadSeleccionada || !especialidadSeleccionada) {
      setAlert({ 
        type: 'error', 
        message: 'Debe seleccionar una facultad y especialidad primero' 
      });
      return;
    }

    const horariosActivos = [];
    let errores = [];

    // Validar cada día activo
    Object.entries(horarios).forEach(([dia, data]) => {
      if (data.activo) {
        if (!data.hora_inicio || !data.hora_fin) {
          errores.push(`${dia}: Debe completar hora de inicio y fin`);
          return;
        }

        const inicio = new Date(`2024-01-01 ${data.hora_inicio}`);
        const fin = new Date(`2024-01-01 ${data.hora_fin}`);

        if (inicio >= fin) {
          errores.push(`${dia}: La hora de inicio debe ser menor que la hora de fin`);
          return;
        }

        horariosActivos.push({
          dia_semana: dia,
          hora_inicio: data.hora_inicio,
          hora_fin: data.hora_fin
        });
      }
    });

    if (errores.length > 0) {
      setAlert({ 
        type: 'error', 
        message: errores.join('. ') 
      });
      return;
    }

    if (horariosActivos.length === 0) {
      setAlert({ 
        type: 'error', 
        message: 'Debe seleccionar al menos un día con horario disponible' 
      });
      return;
    }

    if (cursosInteres.length === 0) {
      setAlert({ 
        type: 'error', 
        message: 'Debe seleccionar al menos un curso de interés' 
      });
      return;
    }

    // Verificar si ya existe una postulación para esta especialidad
    try {
      setLoading(true);
      
      const verificacion = await verificarPostulacionExistente(facultadSeleccionada, especialidadSeleccionada);
      
      if (!verificacion.puede_postular) {
        setAlert({ 
          type: 'warning', 
          message: '⚠️ Ya te has postulado a esta especialidad. Solo puedes tener una postulación activa por especialidad.'
        });
        setLoading(false);
        return;
      }

      // Crear postulación en el backend
      const postulacionData = {
        c_codfac: facultadSeleccionada,
        c_codesp: especialidadSeleccionada,
        horarios: horariosActivos,
        cursos: cursosInteres
      };

      const response = await postulacionDocenteAPI.crearPostulacion(postulacionData);
      
      if (response.success) {
        setAlert({ 
          type: 'success', 
          message: 'Postulación creada exitosamente' 
        });
        
        // Limpiar formulario
        setFacultadSeleccionada('');
        setEspecialidadSeleccionada('');
        setEspecialidades([]);
        setCursos([]);
        setHorarios({
          'Lunes': { activo: false, hora_inicio: '', hora_fin: '' },
          'Martes': { activo: false, hora_inicio: '', hora_fin: '' },
          'Miércoles': { activo: false, hora_inicio: '', hora_fin: '' },
          'Jueves': { activo: false, hora_inicio: '', hora_fin: '' },
          'Viernes': { activo: false, hora_inicio: '', hora_fin: '' },
          'Sábado': { activo: false, hora_inicio: '', hora_fin: '' },
          'Domingo': { activo: false, hora_inicio: '', hora_fin: '' }
        });
        setCursosInteres([]);
      } else {
        // Mensaje específico para postulación duplicada
        const mensaje = response.message || 'Error al crear la postulación';
        const esPostulacionDuplicada = mensaje.includes('postulación activa') || 
                                       mensaje.includes('Ya tienes una postulación') ||
                                       mensaje.includes('duplicada');
        
        setAlert({ 
          type: 'warning', 
          message: esPostulacionDuplicada ? 
            '⚠️ Ya te has postulado a esta especialidad. Solo puedes tener una postulación activa por especialidad.' : 
            mensaje
        });
      }
    } catch (error) {
      console.error('Error al crear postulación:', error);
      
      // Verificar si es error de postulación duplicada
      const errorMessage = error.message || '';
      const esPostulacionDuplicada = errorMessage.includes('postulación activa') || 
                                     errorMessage.includes('Ya tienes una postulación') ||
                                     errorMessage.includes('400');
      
      setAlert({ 
        type: esPostulacionDuplicada ? 'warning' : 'error',
        message: esPostulacionDuplicada ? 
          '⚠️ Ya te has postulado a esta especialidad. Solo puedes tener una postulación activa por especialidad.' :
          'Error al crear la postulación. Por favor intente nuevamente.'
      });
    } finally {
      setLoading(false);
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
          <ScheduleIcon color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            � Crear Nueva Postulación
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Selecciona una especialidad y configura tus horarios disponibles y cursos de interés
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

      {/* Selección de Facultad y Especialidad */}
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            mb: 3,
            pb: 2,
            borderBottom: '2px solid #f0f0f0'
          }}>
            <SchoolIcon color="primary" sx={{ fontSize: 32 }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              �️ Seleccionar Facultad y Especialidad
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Facultad</InputLabel>
                <Select
                  value={facultadSeleccionada}
                  label="Facultad"
                  onChange={(e) => handleFacultadChange(e.target.value)}
                  disabled={loading}
                >
                  {facultades.map((facultad) => (
                    <MenuItem key={facultad.c_codfac} value={facultad.c_codfac}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {facultad.nom_fac}
                      </Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={!facultadSeleccionada || loading}>
                <InputLabel>Especialidad</InputLabel>
                <Select
                  value={especialidadSeleccionada}
                  label="Especialidad"
                  onChange={(e) => handleEspecialidadChange(e.target.value)}
                >
                  {especialidades.map((especialidad) => (
                    <MenuItem key={especialidad.c_codesp} value={especialidad.c_codesp}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {especialidad.nomesp}
                      </Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {facultadSeleccionada && especialidadSeleccionada && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                ⚠️ <strong>Importante:</strong> Al cambiar de facultad o especialidad se reiniciará toda la configuración. 
                Solo puedes tener una postulación activa por especialidad.
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>

      {facultadSeleccionada && especialidadSeleccionada && (
        <Card elevation={3} sx={{ mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              mb: 3,
              pb: 2,
              borderBottom: '2px solid #f0f0f0'
            }}>
              <CategoryIcon color="primary" sx={{ fontSize: 32 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                📚 Cursos de Interés
              </Typography>
            </Box>

            {cursos.length > 0 && (
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Selecciona los cursos en los que te gustaría dictar clases:
                </Typography>
                <List dense>
                  {cursos.map((curso) => (
                    <ListItem 
                      key={curso.id} 
                      sx={{ 
                        pl: 0,
                        py: 1,
                        borderRadius: '6px',
                        mb: 1,
                        bgcolor: cursosInteres.includes(curso.id) ? '#e8f5e8' : 'transparent',
                      }}
                    >
                      <Checkbox
                        checked={cursosInteres.includes(curso.id)}
                        onChange={() => handleCursoToggle(curso.id)}
                        color="success"
                        sx={{ mr: 1 }}
                      />
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

                {cursosInteres.length > 0 && (
                  <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      ✅ Cursos Seleccionados:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {cursosInteres.map((cursoId) => {
                        const curso = getCursoById(cursoId);
                        return curso ? (
                          <Chip 
                            key={cursoId}
                            label={curso.c_nomcur}
                            color="success"
                            size="small"
                            onDelete={() => handleCursoToggle(cursoId)}
                          />
                        ) : null;
                      })}
                    </Box>
                  </Box>
                )}
              </Box>
            )}

            {cursos.length === 0 && especialidadSeleccionada && (
              <Alert severity="warning">
                <Typography variant="body2">
                  {loading ? 'Cargando cursos...' : 'No hay cursos disponibles para esta especialidad.'}
                </Typography>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Sección de Horarios Disponibles - AL FINAL */}
      {facultadSeleccionada && especialidadSeleccionada && (
        <Card elevation={3} sx={{ mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              mb: 3,
              pb: 2,
              borderBottom: '2px solid #f0f0f0'
            }}>
              <AccessTimeIcon color="primary" sx={{ fontSize: 32 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                ⏰ Horarios Disponibles
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Configura tu disponibilidad horaria para dictar clases:
            </Typography>

            <Grid container spacing={2}>
              {diasSemana.map((dia) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={dia}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      bgcolor: horarios[dia].activo ? '#e8f5e8' : '#fafafa',
                      borderColor: horarios[dia].activo ? 'success.main' : 'grey.300',
                      borderWidth: horarios[dia].activo ? 2 : 1,
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {dia.toUpperCase()}
                        </Typography>
                        <Chip 
                          label={horarios[dia].activo ? "✓" : "✗"} 
                          color={horarios[dia].activo ? "success" : "default"}
                          size="small"
                        />
                      </Box>

                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={horarios[dia].activo}
                            onChange={() => handleCheckboxChange(dia)}
                            color="success"
                            size="small"
                          />
                        }
                        label={
                          <Typography variant="body2">
                            Disponible
                          </Typography>
                        }
                        sx={{ mb: 1 }}
                      />

                      {horarios[dia].activo && (
                        <Box sx={{ mt: 1 }}>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <TextField
                              type="time"
                              value={horarios[dia].hora_inicio}
                              onChange={(e) => handleTimeChange(dia, 'hora_inicio', e.target.value)}
                              size="small"
                              sx={{ flex: 1 }}
                            />
                            <Typography variant="caption">a</Typography>
                            <TextField
                              type="time"
                              value={horarios[dia].hora_fin}
                              onChange={(e) => handleTimeChange(dia, 'hora_fin', e.target.value)}
                              size="small"
                              sx={{ flex: 1 }}
                            />
                          </Box>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {facultadSeleccionada && especialidadSeleccionada && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Card elevation={3}>
            <CardContent sx={{ p: 3 }}>
              <Divider sx={{ mb: 3 }} />
              <Button
                variant="contained"
                size="large"
                onClick={handleGuardar}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ScheduleIcon />}
                sx={{ 
                  bgcolor: 'primary.main',
                  color: 'white',
                  fontWeight: 'bold',
                  px: 6,
                  py: 2,
                  fontSize: '16px',
                  borderRadius: '12px',
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.2)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                {loading ? 'ENVIANDO...' : 'ENVIAR POSTULACIÓN'}
              </Button>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default CrearPostulacionPage;
