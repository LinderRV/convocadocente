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

  // Datos mockeados para desarrollo
  const mockPostulaciones = [
    {
      id: 1,
      docente: {
        id: 11,
        nombre: 'Dr. Juan Carlos Medicina',
        email: 'docente@uma.edu.pe',
        telefono: '912234934',
        dni: '7563221',
        cv_archivo: 'cv_11_1762279121199.docx',
        // Información adicional de la tabla docentes
        nombres: 'Juan Carlos',
        apellidos: 'Medicina Rojas',
        fecha_nacimiento: '1985-03-15',
        genero: 'Masculino',
        pais: 'Perú',
        direccion: 'Av. Los Cedros 123, Lima'
      },
      // Formaciones académicas de la tabla formaciones_academicas
      formaciones_academicas: [
        {
          id: 1,
          nivel_formacion: 'Doctorado',
          programa_academico: 'MEDICINA GENERAL',
          institucion: 'Universidad Nacional Mayor de San Marcos',
          pais: 'PERÚ',
          fecha_obtencion: '2015-12-20',
          documento_archivo: 'formacion_1_doctorado.pdf'
        },
        {
          id: 2,
          nivel_formacion: 'Maestría',
          programa_academico: 'SALUD PÚBLICA',
          institucion: 'USENS',
          pais: 'ESPAÑA',
          fecha_obtencion: '2010-10-20',
          documento_archivo: 'formacion_1_maestria.pdf'
        }
      ],
      especialidad: {
        codigo: 'S1',
        nombre: 'ENFERMERÍA',
        facultad: 'CIENCIAS DE LA SALUD'
      },
      estado: 'PENDIENTE',
      fecha_postulacion: '2025-11-04T23:47:35Z',
      evaluador: {
        id: 10,
        nombre: 'James Pérez Lima',
        email: 'james.perezlima@gmail.com'
      },
      cursosInteres: [
        { id: 1, codigo: 'COUD002', nombre: 'Matemáticas', ciclo: 1 },
        { id: 3, codigo: 'ESG0201', nombre: 'LIDERAZGO', ciclo: null }
      ],
      horarios: [
        { dia: 'Lunes', hora_inicio: '10:40', hora_fin: '18:00' },
        { dia: 'Jueves', hora_inicio: '08:00', hora_fin: '20:41' }
      ],
      mensaje_entrevista: null
    },
    {
      id: 2,
      docente: {
        id: 12,
        nombre: 'Dra. María Elena García',
        email: 'maria.garcia@uma.edu.pe',
        telefono: '987654321',
        dni: '12345678',
        cv_archivo: 'cv_12_1762279121200.pdf',
        // Información adicional de la tabla docentes
        nombres: 'María Elena',
        apellidos: 'García Mendoza',
        fecha_nacimiento: '1982-07-22',
        genero: 'Femenino',
        pais: 'Perú',
        direccion: 'Jr. Las Flores 456, Callao'
      },
      // Formaciones académicas de la tabla formaciones_academicas
      formaciones_academicas: [
        {
          id: 3,
          nivel_formacion: 'Licenciatura',
          programa_academico: 'ENFERMERÍA',
          institucion: 'Universidad Cayetano Heredia',
          pais: 'PERÚ',
          fecha_obtencion: '2008-01-20',
          documento_archivo: 'formacion_2_licenciatura.pdf'
        },
        {
          id: 4,
          nivel_formacion: 'Especialización',
          programa_academico: 'CUIDADOS INTENSIVOS',
          institucion: 'Hospital Nacional Dos de Mayo',
          pais: 'PERÚ',
          fecha_obtencion: '2012-06-15',
          documento_archivo: 'formacion_2_especializacion.pdf'
        }
      ],
      especialidad: {
        codigo: 'S1',
        nombre: 'ENFERMERÍA',
        facultad: 'CIENCIAS DE LA SALUD'
      },
      estado: 'EVALUANDO',
      fecha_postulacion: '2025-11-03T15:30:00Z',
      evaluador: {
        id: 10,
        nombre: 'James Pérez Lima',
        email: 'james.perezlima@gmail.com'
      },
      cursosInteres: [
        { id: 1, codigo: 'COUD002', nombre: 'Matemáticas', ciclo: 1 }
      ],
      horarios: [
        { dia: 'Martes', hora_inicio: '14:00', hora_fin: '18:00' },
        { dia: 'Viernes', hora_inicio: '08:00', hora_fin: '12:00' }
      ],
      mensaje_entrevista: 'En proceso de evaluación de documentos'
    },
    {
      id: 3,
      docente: {
        id: 13,
        nombre: 'Dr. Carlos Alberto Rodríguez',
        email: 'carlos.rodriguez@uma.edu.pe',
        telefono: '956789123',
        dni: '87654321',
        cv_archivo: 'cv_13_1762279121201.pdf',
        // Información adicional de la tabla docentes
        nombres: 'Carlos Alberto',
        apellidos: 'Rodríguez Vargas',
        fecha_nacimiento: '1978-11-05',
        genero: 'Masculino',
        pais: 'Colombia',
        direccion: 'Av. Universitaria 789, San Miguel'
      },
      // Formaciones académicas de la tabla formaciones_academicas
      formaciones_academicas: [
        {
          id: 5,
          nivel_formacion: 'Post-Doctorado',
          programa_academico: 'INVESTIGACIÓN EN ENFERMERÍA',
          institucion: 'Universidad de Barcelona',
          pais: 'ESPAÑA',
          fecha_obtencion: '2020-09-10',
          documento_archivo: 'formacion_3_postdoctorado.pdf'
        },
        {
          id: 6,
          nivel_formacion: 'Maestría',
          programa_academico: 'GESTIÓN EN SALUD',
          institucion: 'UNGENS',
          pais: 'CHILE',
          fecha_obtencion: '2015-02-20',
          documento_archivo: 'formacion_3_maestria.pdf'
        }
      ],
      especialidad: {
        codigo: 'S1',
        nombre: 'ENFERMERÍA',
        facultad: 'CIENCIAS DE LA SALUD'
      },
      estado: 'APROBADO',
      fecha_postulacion: '2025-11-01T10:15:00Z',
      evaluador: {
        id: 10,
        nombre: 'James Pérez Lima',
        email: 'james.perezlima@gmail.com'
      },
      cursosInteres: [
        { id: 3, codigo: 'ESG0201', nombre: 'LIDERAZGO', ciclo: null }
      ],
      horarios: [
        { dia: 'Lunes', hora_inicio: '08:00', hora_fin: '12:00' },
        { dia: 'Miércoles', hora_inicio: '14:00', hora_fin: '18:00' },
        { dia: 'Viernes', hora_inicio: '08:00', hora_fin: '12:00' }
      ],
      mensaje_entrevista: 'Felicitaciones! Su postulación ha sido aprobada. Por favor coordinar entrevista para el día 15 de noviembre a las 10:00 AM.'
    }
  ];

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setPostulaciones(mockPostulaciones);
      setLoading(false);
    }, 1000);
  }, []);

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
    setMensajeEvaluacion(postulacion.mensaje_entrevista || '');
    setDialogType('evaluar');
    setOpenDialog(true);
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
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Cargando postulaciones...</Typography>
      </Box>
    );
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
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {postulacion.docente.nombre}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {postulacion.docente.email}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          DNI: {postulacion.docente.dni}
                        </Typography>
                      </Box>
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
                        size="small"
                        color="info"
                      >
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Género: {postulacion.docente.genero}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        País: {postulacion.docente.pais}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Ver detalles de formaciones académicas">
                      <IconButton 
                        size="small"
                        color="success"
                      >
                        <FormacionIcon />
                      </IconButton>
                    </Tooltip>
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Total: {postulacion.formaciones_academicas.length} formaciones
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Último: {postulacion.formaciones_academicas[0]?.nivel_formacion || 'N/A'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Ver detalles de cursos de interés y horarios">
                      <IconButton 
                        size="small"
                        color="primary"
                      >
                        <CursosHorariosIcon />
                      </IconButton>
                    </Tooltip>
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Cursos: {postulacion.cursosInteres.length}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Horarios: {postulacion.horarios.length} disponibles
                      </Typography>
                    </Box>
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
              disabled={!nuevoEstado || ((nuevoEstado === 'APROBADO' || nuevoEstado === 'RECHAZADO') && !mensajeEvaluacion)}
            >
              Actualizar Estado
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PostulacionesPage;
