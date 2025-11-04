import React, { useState } from 'react';
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
  Divider
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  AccessTime as AccessTimeIcon,
  School as SchoolIcon,
  Category as CategoryIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';

const HorariosPage = () => {
  const [alert, setAlert] = useState(null);

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

  // Datos mock - JERARQUÍA CORRECTA
  const facultadesDisponibles = [
    { c_codfac: 'S', nom_fac: 'CIENCIAS DE LA SALUD' },
    { c_codfac: 'M', nom_fac: 'MEDICINA' },
    { c_codfac: 'I', nom_fac: 'INGENIERÍA' },
    { c_codfac: 'A', nom_fac: 'ADMINISTRACIÓN' }
  ];

  const especialidadesPorFacultad = {
    'S': [
      { c_codesp: 'S1', nomesp: 'ENFERMERÍA' },
      { c_codesp: 'S2', nomesp: 'OBSTETRICIA' }
    ],
    'M': [
      { c_codesp: 'M1', nomesp: 'CARDIOLOGÍA' },
      { c_codesp: 'M2', nomesp: 'MEDICINA INTERNA' },
      { c_codesp: 'M3', nomesp: 'NEUROLOGÍA' }
    ],
    'I': [
      { c_codesp: 'I1', nomesp: 'SISTEMAS' },
      { c_codesp: 'I2', nomesp: 'INDUSTRIAL' },
      { c_codesp: 'I3', nomesp: 'CIVIL' }
    ],
    'A': [
      { c_codesp: 'A1', nomesp: 'ADMINISTRACIÓN' },
      { c_codesp: 'A2', nomesp: 'CONTABILIDAD' }
    ]
  };

  // Cursos por especialidad específica (plan_estudio_curso)
  const cursosPorEspecialidad = {
    'S-S1': [ // CIENCIAS DE LA SALUD - ENFERMERÍA
      { id: 1, c_nomcur: 'Anatomía y Fisiología Humana' },
      { id: 2, c_nomcur: 'Fundamentos de Enfermería' },
      { id: 3, c_nomcur: 'Farmacología en Enfermería' },
      { id: 4, c_nomcur: 'Cuidados Intensivos' }
    ],
    'S-S2': [ // CIENCIAS DE LA SALUD - OBSTETRICIA
      { id: 5, c_nomcur: 'Obstetricia Básica' },
      { id: 6, c_nomcur: 'Ginecología Clínica' },
      { id: 7, c_nomcur: 'Atención Prenatal' }
    ],
    'M-M1': [ // MEDICINA - CARDIOLOGÍA
      { id: 8, c_nomcur: 'Cardiología Intervencional Avanzada' },
      { id: 9, c_nomcur: 'Ecocardiografía Diagnóstica' },
      { id: 10, c_nomcur: 'Farmacología Cardiovascular' },
      { id: 11, c_nomcur: 'Urgencias Cardiológicas' }
    ],
    'M-M2': [ // MEDICINA - MEDICINA INTERNA
      { id: 12, c_nomcur: 'Medicina Interna General' },
      { id: 13, c_nomcur: 'Endocrinología Clínica' },
      { id: 14, c_nomcur: 'Gastroenterología' }
    ],
    'I-I1': [ // INGENIERÍA - SISTEMAS
      { id: 15, c_nomcur: 'Programación Avanzada' },
      { id: 16, c_nomcur: 'Base de Datos' },
      { id: 17, c_nomcur: 'Ingeniería de Software' },
      { id: 18, c_nomcur: 'Redes de Computadores' }
    ],
    'A-A1': [ // ADMINISTRACIÓN - ADMINISTRACIÓN
      { id: 19, c_nomcur: 'Gestión Estratégica' },
      { id: 20, c_nomcur: 'Marketing Digital' },
      { id: 21, c_nomcur: 'Recursos Humanos' }
    ]
  };

  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  // Manejar cambio de facultad - REINICIA TODO
  const handleFacultadChange = (nuevaFacultad) => {
    setFacultadSeleccionada(nuevaFacultad);
    setEspecialidadSeleccionada(''); // Reset especialidad
    
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
    
    setAlert({ 
      type: 'info', 
      message: 'Facultad cambiada. Selecciona una especialidad y configura nuevamente.' 
    });
  };

  // Manejar cambio de especialidad - REINICIA horarios y cursos
  const handleEspecialidadChange = (nuevaEspecialidad) => {
    setEspecialidadSeleccionada(nuevaEspecialidad);
    
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
    
    setAlert({ 
      type: 'info', 
      message: 'Especialidad cambiada. Configura tus horarios y cursos de interés.' 
    });
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
    for (const key in cursosPorEspecialidad) {
      const curso = cursosPorEspecialidad[key].find(c => c.id === id);
      if (curso) return curso;
    }
    return null;
  };

  // Obtener especialidades filtradas por facultad
  const especialidadesFiltradas = facultadSeleccionada ? 
    especialidadesPorFacultad[facultadSeleccionada] || [] : [];

  // Obtener cursos de la especialidad seleccionada
  const cursosDisponibles = facultadSeleccionada && especialidadSeleccionada ? 
    cursosPorEspecialidad[`${facultadSeleccionada}-${especialidadSeleccionada}`] || [] : [];

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
  const handleGuardar = () => {
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

    // TODO: Aquí enviar datos al backend
    const facultad = facultadesDisponibles.find(f => f.c_codfac === facultadSeleccionada);
    const especialidad = especialidadesFiltradas.find(e => e.c_codesp === especialidadSeleccionada);
    
    console.log('Datos a guardar:', {
      facultad: facultad,
      especialidad: especialidad,
      c_codfac: facultadSeleccionada,
      c_codesp: especialidadSeleccionada,
      horarios: horariosActivos,
      cursos: cursosInteres
    });
    
    setAlert({ 
      type: 'success', 
      message: `Configuración guardada para ${facultad?.nom_fac} - ${especialidad?.nomesp}: ${horariosActivos.length} días y ${cursosInteres.length} cursos seleccionados` 
    });
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
            📅 Configuración de Postulación
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
                >
                  {facultadesDisponibles.map((facultad) => (
                    <MenuItem key={facultad.c_codfac} value={facultad.c_codfac}>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {facultad.nom_fac}
                        </Typography>
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
              <FormControl fullWidth disabled={!facultadSeleccionada}>
                <InputLabel>Especialidad</InputLabel>
                <Select
                  value={especialidadSeleccionada}
                  label="Especialidad"
                  onChange={(e) => handleEspecialidadChange(e.target.value)}
                >
                  {especialidadesFiltradas.map((especialidad) => (
                    <MenuItem key={especialidad.c_codesp} value={especialidad.c_codesp}>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {especialidad.nomesp}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Código: {especialidad.c_codesp}
                        </Typography>
                      </Box>
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

            {cursosDisponibles.length > 0 && (
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Selecciona los cursos en los que te gustaría dictar clases:
                </Typography>
                <List dense>
                  {cursosDisponibles.map((curso) => (
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

            {cursosDisponibles.length === 0 && (
              <Alert severity="warning">
                <Typography variant="body2">
                  No hay cursos disponibles para esta especialidad.
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
                startIcon={<ScheduleIcon />}
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
                GUARDAR
              </Button>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default HorariosPage;
