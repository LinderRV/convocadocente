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
  Pagination
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Upload as UploadIcon
} from '@mui/icons-material';

const FormacionesPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [alert, setAlert] = useState(null);
  const [page, setPage] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);

  // DATOS MOCK - Tabla 'formaciones_academicas'
  const [formaciones, setFormaciones] = useState([
    {
      id: 1,
      user_id: 11, // ID del usuario autenticado
      nivel_formacion: 'Doctorado',
      programa_academico: 'Doctorado en Medicina',
      institucion: 'Universidad Nacional Mayor de San Marcos',
      pais: 'Perú',
      fecha_obtencion: '2020-12-15',
      documento_archivo: 'doctorado_medicina.pdf'
    },
    {
      id: 2,
      user_id: 11, // ID del usuario autenticado
      nivel_formacion: 'Maestría',
      programa_academico: 'Maestría en Cardiología',
      institucion: 'Universidad Cayetano Heredia',
      pais: 'Perú',
      fecha_obtencion: '2018-07-20',
      documento_archivo: 'maestria_cardiologia.pdf'
    },
    {
      id: 3,
      user_id: 11, // ID del usuario autenticado
      nivel_formacion: 'Licenciatura',
      programa_academico: 'Medicina Humana',
      institucion: 'Universidad Nacional de Piura',
      pais: 'Perú',
      fecha_obtencion: '2015-12-10',
      documento_archivo: 'titulo_medicina.pdf'
    }
  ]);

  const [currentFormacion, setCurrentFormacion] = useState({
    user_id: 11, // ID del usuario autenticado
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

  const paises = ['Perú', 'Colombia', 'Ecuador', 'Bolivia', 'Chile', 'Argentina', 'Brasil', 'Estados Unidos', 'España', 'Otro'];

  const handleOpenDialog = (formacion = null) => {
    if (formacion) {
      setCurrentFormacion({
        ...formacion,
        fecha_obtencion: formacion.fecha_obtencion || ''
      });
      setEditMode(true);
    } else {
      setCurrentFormacion({
        user_id: 11, // ID del usuario autenticado
        nivel_formacion: '',
        programa_academico: '',
        institucion: '',
        pais: '',
        fecha_obtencion: '',
        documento_archivo: ''
      });
      setEditMode(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedFile(null);
    setCurrentFormacion({
      user_id: 11, // ID del usuario autenticado
      nivel_formacion: '',
      programa_academico: '',
      institucion: '',
      pais: '',
      fecha_obtencion: '',
      documento_archivo: ''
    });
  };

  const handleSubmit = () => {
    if (!currentFormacion.nivel_formacion || !currentFormacion.programa_academico || 
        !currentFormacion.institucion || !currentFormacion.pais) {
      setAlert({ 
        type: 'error', 
        message: 'Nivel de formación, programa académico, institución y país son obligatorios' 
      });
      return;
    }

    // Si hay un archivo seleccionado, usar su nombre
    const documentoArchivo = selectedFile ? selectedFile.name : currentFormacion.documento_archivo;

    if (editMode) {
      setFormaciones(prev => prev.map(f => 
        f.id === currentFormacion.id ? {...currentFormacion, documento_archivo: documentoArchivo} : f
      ));
      setAlert({ type: 'success', message: 'Formación actualizada correctamente' });
    } else {
      const newFormacion = {
        ...currentFormacion,
        documento_archivo: documentoArchivo,
        id: Math.max(...formaciones.map(f => f.id), 0) + 1
      };
      setFormaciones(prev => [...prev, newFormacion]);
      setAlert({ type: 'success', message: 'Formación agregada correctamente' });
    }
    
    // Aquí iría la lógica para subir el archivo al servidor
    if (selectedFile) {
      console.log('Archivo a subir:', selectedFile);
      // const formData = new FormData();
      // formData.append('documento', selectedFile);
      // Enviar formData al backend
    }
    
    handleCloseDialog();
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
      setCurrentFormacion({
        ...currentFormacion,
        documento_archivo: file.name
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta formación académica?')) {
      setFormaciones(prev => prev.filter(f => f.id !== id));
      setAlert({ type: 'success', message: 'Formación eliminada correctamente' });
    }
  };

  const formatFecha = (fecha) => {
    if (!fecha) return 'No especificada';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long'
    });
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

  return (
    <Box sx={{ p: 3 }}>
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
                            onClick={() => {
                              // Lógica para descargar documento
                              setAlert({ type: 'info', message: `Descargando ${formacion.documento_archivo}` });
                            }}
                          >
                            Ver
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
                        <IconButton 
                          size="small" 
                          onClick={() => handleDelete(formacion.id)}
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
          {formaciones.length > 10 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination 
                count={Math.ceil(formaciones.length / 10)}
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
              select
              label="País"
              value={currentFormacion.pais}
              onChange={(e) => setCurrentFormacion({ 
                ...currentFormacion, 
                pais: e.target.value 
              })}
              required
              fullWidth
            >
              {paises.map((pais) => (
                <MenuItem key={pais} value={pais}>
                  {pais}
                </MenuItem>
              ))}
            </TextField>
            
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
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editMode ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FormacionesPage;
