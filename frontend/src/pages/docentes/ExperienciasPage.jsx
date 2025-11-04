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
  Pagination,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Upload as UploadIcon
} from '@mui/icons-material';

const ExperienciasPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [alert, setAlert] = useState(null);
  const [page, setPage] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);

  // DATOS MOCK - Tabla 'experiencias_laborales'
  const [experiencias, setExperiencias] = useState([
    {
      id: 1,
      user_id: 11, // ID del usuario autenticado
      pais: 'Perú',
      sector: 'Público',
      empresa: 'Hospital Nacional Dos de Mayo',
      ruc: '20131370912',
      cargo: 'Médico Cardiólogo Senior',
      fecha_inicio: '2020-03-01',
      fecha_fin: null,
      actual: true,
      sin_experiencia: false,
      constancia_archivo: 'constancia_hospital_dosdemayo.pdf'
    },
    {
      id: 2,
      user_id: 11, // ID del usuario autenticado
      pais: 'Perú',
      sector: 'Privado',
      empresa: 'Clínica San Pablo',
      ruc: '20100047218',
      cargo: 'Jefe de Cardiología',
      fecha_inicio: '2018-01-15',
      fecha_fin: '2020-02-28',
      actual: false,
      sin_experiencia: false,
      constancia_archivo: 'constancia_sanpablo.pdf'
    },
    {
      id: 3,
      user_id: 11, // ID del usuario autenticado
      pais: 'Perú',
      sector: 'Público',
      empresa: 'Hospital Cayetano Heredia',
      ruc: '20131370823',
      cargo: 'Médico Residente de Cardiología',
      fecha_inicio: '2015-03-01',
      fecha_fin: '2017-12-31',
      actual: false,
      sin_experiencia: false,
      constancia_archivo: 'constancia_residencia_heredia.pdf'
    }
  ]);

  const [currentExperiencia, setCurrentExperiencia] = useState({
    user_id: 11, // ID del usuario autenticado
    pais: '',
    sector: '',
    empresa: '',
    ruc: '',
    cargo: '',
    fecha_inicio: '',
    fecha_fin: '',
    actual: false,
    sin_experiencia: false,
    constancia_archivo: ''
  });

  const sectores = ['Público', 'Privado'];
  const paises = ['Perú', 'Colombia', 'Ecuador', 'Bolivia', 'Chile', 'Argentina', 'Brasil', 'Estados Unidos', 'España', 'Otro'];

  const handleOpenDialog = (experiencia = null) => {
    if (experiencia) {
      setCurrentExperiencia({
        ...experiencia,
        fecha_inicio: experiencia.fecha_inicio || '',
        fecha_fin: experiencia.fecha_fin || ''
      });
      setEditMode(true);
    } else {
      setCurrentExperiencia({
        user_id: 11, // ID del usuario autenticado
        pais: '',
        sector: '',
        empresa: '',
        ruc: '',
        cargo: '',
        fecha_inicio: '',
        fecha_fin: '',
        actual: false,
        sin_experiencia: false,
        constancia_archivo: ''
      });
      setEditMode(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedFile(null);
    setCurrentExperiencia({
      user_id: 11, // ID del usuario autenticado
      pais: '',
      sector: '',
      empresa: '',
      ruc: '',
      cargo: '',
      fecha_inicio: '',
      fecha_fin: '',
      actual: false,
      sin_experiencia: false,
      constancia_archivo: ''
    });
  };

  const handleSubmit = () => {
    if (!currentExperiencia.pais || !currentExperiencia.sector || 
        !currentExperiencia.empresa || !currentExperiencia.cargo || !currentExperiencia.fecha_inicio) {
      setAlert({ 
        type: 'error', 
        message: 'País, sector, empresa, cargo y fecha de inicio son obligatorios' 
      });
      return;
    }

    if (!currentExperiencia.actual && !currentExperiencia.fecha_fin) {
      setAlert({ 
        type: 'error', 
        message: 'Si no es trabajo actual, debe especificar la fecha de fin' 
      });
      return;
    }

    // Si hay un archivo seleccionado, usar su nombre
    const constanciaArchivo = selectedFile ? selectedFile.name : currentExperiencia.constancia_archivo;

    if (editMode) {
      setExperiencias(prev => prev.map(e => 
        e.id === currentExperiencia.id ? {...currentExperiencia, constancia_archivo: constanciaArchivo} : e
      ));
      setAlert({ type: 'success', message: 'Experiencia actualizada correctamente' });
    } else {
      const newExperiencia = {
        ...currentExperiencia,
        constancia_archivo: constanciaArchivo,
        id: Math.max(...experiencias.map(e => e.id), 0) + 1
      };
      setExperiencias(prev => [...prev, newExperiencia]);
      setAlert({ type: 'success', message: 'Experiencia agregada correctamente' });
    }
    
    // Aquí iría la lógica para subir el archivo al servidor
    if (selectedFile) {
      console.log('Archivo a subir:', selectedFile);
      // const formData = new FormData();
      // formData.append('constancia', selectedFile);
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
      setCurrentExperiencia({
        ...currentExperiencia,
        constancia_archivo: file.name
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta experiencia laboral?')) {
      setExperiencias(prev => prev.filter(e => e.id !== id));
      setAlert({ type: 'success', message: 'Experiencia eliminada correctamente' });
    }
  };

  const formatFecha = (fecha) => {
    if (!fecha) return 'Actual';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short'
    });
  };

  const formatDuracion = (fechaInicio, fechaFin) => {
    const inicio = new Date(fechaInicio);
    const fin = fechaFin ? new Date(fechaFin) : new Date();
    const meses = (fin - inicio) / (1000 * 60 * 60 * 24 * 30);
    
    if (meses < 12) {
      return `${Math.round(meses)} meses`;
    } else {
      const años = Math.floor(meses / 12);
      const mesesRestantes = Math.round(meses % 12);
      return `${años} año${años > 1 ? 's' : ''}${mesesRestantes > 0 ? ` y ${mesesRestantes} meses` : ''}`;
    }
  };

  const getSectorColor = (sector) => {
    switch (sector) {
      case 'Público': return 'primary';
      case 'Privado': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 3 }}>
          Mis Experiencias Laborales
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

      {/* Tabla de experiencias */}
      <Card>
        <CardContent>
          {/* Header de la tabla con botón agregar */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Experiencias Registradas
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              color="primary"
            >
              Agregar Experiencia
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Cargo</TableCell>
                  <TableCell>Empresa</TableCell>
                  <TableCell>Sector</TableCell>
                  <TableCell>RUC</TableCell>
                  <TableCell>Período</TableCell>
                  <TableCell>País</TableCell>
                  <TableCell>Constancia</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {experiencias.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography variant="body1" color="text.secondary">
                        No tienes experiencias laborales registradas
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  experiencias.map((experiencia) => (
                    <TableRow key={experiencia.id}>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {experiencia.cargo}
                        </Typography>
                        {experiencia.actual && (
                          <Chip label="Actual" color="success" size="small" sx={{ mt: 0.5 }} />
                        )}
                      </TableCell>
                      <TableCell>{experiencia.empresa}</TableCell>
                      <TableCell>
                        <Chip 
                          label={experiencia.sector}
                          color={getSectorColor(experiencia.sector)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {experiencia.ruc || 'No especificado'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatFecha(experiencia.fecha_inicio)} - {formatFecha(experiencia.fecha_fin)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {experiencia.pais}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {experiencia.constancia_archivo ? (
                          <Button
                            size="small"
                            startIcon={<DownloadIcon />}
                            onClick={() => {
                              setAlert({ type: 'info', message: `Descargando ${experiencia.constancia_archivo}` });
                            }}
                          >
                            Ver
                          </Button>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Sin constancia
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenDialog(experiencia)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleDelete(experiencia.id)}
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
          {experiencias.length > 10 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination 
                count={Math.ceil(experiencias.length / 10)}
                page={page}
                onChange={(e, newPage) => setPage(newPage)}
                color="primary"
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Dialog para agregar/editar */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>
          {editMode ? 'Editar Experiencia Laboral' : 'Agregar Nueva Experiencia'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="País"
                  value={currentExperiencia.pais}
                  onChange={(e) => setCurrentExperiencia({ 
                    ...currentExperiencia, 
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
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="Sector"
                  value={currentExperiencia.sector}
                  onChange={(e) => setCurrentExperiencia({ 
                    ...currentExperiencia, 
                    sector: e.target.value 
                  })}
                  required
                  fullWidth
                >
                  {sectores.map((sector) => (
                    <MenuItem key={sector} value={sector}>
                      {sector}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Empresa"
                  value={currentExperiencia.empresa}
                  onChange={(e) => setCurrentExperiencia({ 
                    ...currentExperiencia, 
                    empresa: e.target.value 
                  })}
                  required
                  fullWidth
                  placeholder="Ej: Hospital Nacional Dos de Mayo"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="RUC"
                  value={currentExperiencia.ruc}
                  onChange={(e) => setCurrentExperiencia({ 
                    ...currentExperiencia, 
                    ruc: e.target.value 
                  })}
                  fullWidth
                  placeholder="Ej: 20131370912"
                  inputProps={{ maxLength: 11 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Cargo"
                  value={currentExperiencia.cargo}
                  onChange={(e) => setCurrentExperiencia({ 
                    ...currentExperiencia, 
                    cargo: e.target.value 
                  })}
                  required
                  fullWidth
                  placeholder="Ej: Médico Cardiólogo Senior"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  type="date"
                  label="Fecha de Inicio"
                  value={currentExperiencia.fecha_inicio}
                  onChange={(e) => setCurrentExperiencia({ 
                    ...currentExperiencia, 
                    fecha_inicio: e.target.value 
                  })}
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  type="date"
                  label="Fecha de Fin"
                  value={currentExperiencia.fecha_fin}
                  onChange={(e) => setCurrentExperiencia({ 
                    ...currentExperiencia, 
                    fecha_fin: e.target.value 
                  })}
                  InputLabelProps={{ shrink: true }}
                  disabled={currentExperiencia.actual}
                  fullWidth
                  helperText={currentExperiencia.actual ? "No necesario para trabajo actual" : ""}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={currentExperiencia.actual}
                      onChange={(e) => setCurrentExperiencia({ 
                        ...currentExperiencia, 
                        actual: e.target.checked,
                        fecha_fin: e.target.checked ? '' : currentExperiencia.fecha_fin
                      })}
                    />
                  }
                  label="Trabajo Actual"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={currentExperiencia.sin_experiencia}
                      onChange={(e) => setCurrentExperiencia({ 
                        ...currentExperiencia, 
                        sin_experiencia: e.target.checked
                      })}
                    />
                  }
                  label="Sin Experiencia Laboral"
                />
              </Grid>

              <Grid item xs={12}>
                {/* Campo para subir constancia */}
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Constancia Laboral (PDF)
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
                    
                    {(selectedFile || currentExperiencia.constancia_archivo) && (
                      <Typography variant="body2" color="text.secondary">
                        {selectedFile ? selectedFile.name : currentExperiencia.constancia_archivo}
                      </Typography>
                    )}
                  </Box>
                  
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                    Solo archivos PDF, máximo 5MB
                  </Typography>
                </Box>
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

export default ExperienciasPage;
