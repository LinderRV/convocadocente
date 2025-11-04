import React, { useState, useEffect } from 'react';
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
  Pagination,
  CircularProgress,
  Backdrop
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  DeleteOutline as DeleteOutlineIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import formacionesAPI from '../../services/formacionesAPI';

const FormacionesPage = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [alert, setAlert] = useState(null);
  const [page, setPage] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const [formaciones, setFormaciones] = useState([]);

  const [currentFormacion, setCurrentFormacion] = useState({
    nivel_formacion: '',
    programa_academico: '',
    institucion: '',
    pais: '',
    fecha_obtencion: '',
    documento_archivo: ''
  });

  const nivelesFormacion = [
    'Técnico Superior',
    'Licenciatura',
    'Ingeniería',
    'Especialización',
    'Maestría',
    'Doctorado',
    'Post-Doctorado',
    'Otro'
  ];

  // Cargar formaciones al montar el componente
  useEffect(() => {
    // Debug: Verificar estado de autenticación
    console.log('User from context:', user);
    console.log('isAuthenticated:', isAuthenticated);
    console.log('authLoading:', authLoading);
    console.log('Token in localStorage:', localStorage.getItem('token'));
    
    if (!authLoading && isAuthenticated && user) {
      loadFormaciones();
    } else if (!authLoading && !isAuthenticated) {
      setAlert({
        type: 'error',
        message: 'No estás autenticado. Por favor, inicia sesión nuevamente.'
      });
      setLoading(false);
    }
  }, [page, user, isAuthenticated, authLoading]);

  const loadFormaciones = async () => {
    try {
      setLoading(true);
      
      // Verificar que el usuario esté autenticado
      const token = localStorage.getItem('token');
      if (!token) {
        setAlert({
          type: 'error',
          message: 'No hay token de autenticación. Por favor, inicia sesión nuevamente.'
        });
        return;
      }

      const response = await formacionesAPI.getFormaciones(page, 10);
      if (response.success) {
        setFormaciones(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error('Error loading formaciones:', error);
      
      // Manejo específico de errores de autenticación
      if (error.message?.includes('Token') || error.message?.includes('Unauthorized')) {
        setAlert({
          type: 'error',
          message: 'Sesión expirada. Por favor, inicia sesión nuevamente.'
        });
      } else {
        setAlert({
          type: 'error',
          message: error.message || 'Error al cargar las formaciones'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Formatear fecha para input date
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  };

  const handleOpenDialog = (formacion = null) => {
    if (formacion) {
      setCurrentFormacion({
        ...formacion,
        fecha_obtencion: formatDateForInput(formacion.fecha_obtencion)
      });
      setEditMode(true);
    } else {
      setCurrentFormacion({
        nivel_formacion: '',
        programa_academico: '',
        institucion: '',
        pais: '',
        fecha_obtencion: '',
        documento_archivo: ''
      });
      setEditMode(false);
    }
    setSelectedFile(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedFile(null);
    setCurrentFormacion({
      nivel_formacion: '',
      programa_academico: '',
      institucion: '',
      pais: '',
      fecha_obtencion: '',
      documento_archivo: ''
    });
  };

  const handleSubmit = async () => {
    if (!currentFormacion.nivel_formacion || !currentFormacion.programa_academico || 
        !currentFormacion.institucion || !currentFormacion.pais) {
      setAlert({ 
        type: 'error', 
        message: 'Nivel de formación, programa académico, institución y país son obligatorios' 
      });
      return;
    }

    try {
      setSaving(true);
      
      if (editMode) {
        // Actualizar formación existente
        const response = await formacionesAPI.updateFormacion(currentFormacion.id, {
          nivel_formacion: currentFormacion.nivel_formacion,
          programa_academico: currentFormacion.programa_academico,
          institucion: currentFormacion.institucion,
          pais: currentFormacion.pais,
          fecha_obtencion: currentFormacion.fecha_obtencion || null
        }, selectedFile); // Pasar el archivo seleccionado directamente

        if (response.success) {
          setAlert({ type: 'success', message: 'Formación actualizada correctamente' });
          await loadFormaciones();
        }
      } else {
        // Crear nueva formación
        const response = await formacionesAPI.createFormacion({
          nivel_formacion: currentFormacion.nivel_formacion,
          programa_academico: currentFormacion.programa_academico,
          institucion: currentFormacion.institucion,
          pais: currentFormacion.pais,
          fecha_obtencion: currentFormacion.fecha_obtencion || null
        }, selectedFile); // Pasar el archivo seleccionado directamente

        if (response.success) {
          setAlert({ type: 'success', message: 'Formación creada correctamente' });
          await loadFormaciones();
        }
      }
      
      handleCloseDialog();
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Error al guardar la formación'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (formacionId) => {
    if (!selectedFile) return;

    try {
      const response = await formacionesAPI.uploadDocumento(formacionId, selectedFile);
      if (response.success) {
        setAlert({ type: 'success', message: 'Documento subido correctamente' });
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Error al subir el documento'
      });
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validar que sea PDF
      if (file.type !== 'application/pdf') {
        setAlert({ type: 'error', message: 'Solo se permiten archivos PDF' });
        return;
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setAlert({ type: 'error', message: 'El archivo no puede ser mayor a 5MB' });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleDownloadDocument = async (formacion) => {
    try {
      await formacionesAPI.downloadDocumento(formacion.id);
      setAlert({ type: 'success', message: 'Documento descargado correctamente' });
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Error al descargar el documento'
      });
    }
  };

  const formatFecha = (fecha) => {
    if (!fecha) return 'No especificada';
    return fecha.split('T')[0];
  };

  const getNivelColor = (nivel) => {
    switch (nivel) {
      case 'Doctorado': case 'Post-Doctorado': return 'error';
      case 'Maestría': return 'warning';
      case 'Especialización': return 'info';
      case 'Licenciatura': case 'Ingeniería': return 'primary';
      case 'Técnico Superior': return 'secondary';
      default: return 'default';
    }
  };

  // Mostrar loading mientras se verifica la autenticación
  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Mostrar error si no está autenticado
  if (!isAuthenticated) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error" align="center">
          No estás autenticado. Por favor, inicia sesión para acceder a esta página.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Loading Backdrop */}
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading || saving}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 3 }}>
          Mis Formaciones Académicas
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

      {/* Tabla de formaciones */}
      <Card>
        <CardContent>
          {/* Header de la tabla con botón agregar */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Formaciones Registradas
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              color="primary"
            >
              Agregar Formación
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nivel de Formación</TableCell>
                  <TableCell>Programa Académico</TableCell>
                  <TableCell>Institución</TableCell>
                  <TableCell>País</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Documento</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formaciones.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body1" color="text.secondary">
                        No tienes formaciones académicas registradas
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  formaciones.map((formacion) => (
                    <TableRow key={formacion.id}>
                      <TableCell>
                        <Chip 
                          label={formacion.nivel_formacion}
                          color={getNivelColor(formacion.nivel_formacion)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{formacion.programa_academico}</TableCell>
                      <TableCell>{formacion.institucion}</TableCell>
                      <TableCell>{formacion.pais}</TableCell>
                      <TableCell>{formatFecha(formacion.fecha_obtencion)}</TableCell>
                      <TableCell>
                        {formacion.documento_archivo ? (
                          <Button
                            size="small"
                            startIcon={<DownloadIcon />}
                            onClick={() => handleDownloadDocument(formacion)}
                          >
                            Descargar
                          </Button>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Sin documento
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenDialog(formacion)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Paginación */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination 
                count={totalPages}
                page={page}
                onChange={(e, newPage) => setPage(newPage)}
                color="primary"
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Dialog para agregar/editar */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editMode ? 'Editar Formación Académica' : 'Agregar Nueva Formación'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              select
              label="Nivel de Formación"
              value={currentFormacion.nivel_formacion}
              onChange={(e) => setCurrentFormacion({ 
                ...currentFormacion, 
                nivel_formacion: e.target.value 
              })}
              required
              fullWidth
            >
              {nivelesFormacion.map((nivel) => (
                <MenuItem key={nivel} value={nivel}>
                  {nivel}
                </MenuItem>
              ))}
            </TextField>
            
            <TextField
              label="Programa Académico"
              value={currentFormacion.programa_academico}
              onChange={(e) => setCurrentFormacion({ 
                ...currentFormacion, 
                programa_academico: e.target.value 
              })}
              required
              fullWidth
              placeholder="Ej: Medicina Humana, Doctorado en Cardiología"
            />
            
            <TextField
              label="Institución"
              value={currentFormacion.institucion}
              onChange={(e) => setCurrentFormacion({ 
                ...currentFormacion, 
                institucion: e.target.value 
              })}
              required
              fullWidth
              placeholder="Ej: Universidad Nacional Mayor de San Marcos"
            />
            
            <TextField
              label="País"
              value={currentFormacion.pais}
              onChange={(e) => setCurrentFormacion({ 
                ...currentFormacion, 
                pais: e.target.value 
              })}
              required
              fullWidth
              placeholder="Ej: Perú, Colombia, España, etc."
            />
            
            <TextField
              type="date"
              label="Fecha de Obtención"
              value={currentFormacion.fecha_obtencion}
              onChange={(e) => setCurrentFormacion({ 
                ...currentFormacion, 
                fecha_obtencion: e.target.value 
              })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            
            {/* Campo para subir documento */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Documento PDF
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<UploadIcon />}
                  sx={{ minWidth: 150 }}
                >
                  Seleccionar PDF
                  <input
                    type="file"
                    hidden
                    accept=".pdf"
                    onChange={handleFileChange}
                  />
                </Button>
                
                {(selectedFile || currentFormacion.documento_archivo) && (
                  <Typography variant="body2" color="text.secondary">
                    {selectedFile ? selectedFile.name : currentFormacion.documento_archivo}
                  </Typography>
                )}
              </Box>
              
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                Solo archivos PDF, máximo 5MB
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} variant="contained" disabled={saving}>
            {saving ? 'Guardando...' : (editMode ? 'Actualizar' : 'Crear')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FormacionesPage;
