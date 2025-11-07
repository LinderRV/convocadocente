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
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
  Upload as UploadIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import experienciasAPI from '../../services/docentes/experienciasAPI';

const ExperienciasPage = () => {
  const { user } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [alert, setAlert] = useState(null);
  const [page, setPage] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estado real conectado al backend
  const [experiencias, setExperiencias] = useState([]);

  const [currentExperiencia, setCurrentExperiencia] = useState({
    user_id: user?.id || null,
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

  const handleOpenDialog = (experiencia = null) => {
    if (experiencia) {
      setCurrentExperiencia({
        ...experiencia,
        pais: experiencia.pais ? String(experiencia.pais) : '',
        sector: experiencia.sector ? String(experiencia.sector) : '',
        empresa: experiencia.empresa ? String(experiencia.empresa) : '',
        ruc: experiencia.ruc ? String(experiencia.ruc) : '',
        cargo: experiencia.cargo ? String(experiencia.cargo) : '',
        fecha_inicio: experiencia.fecha_inicio ? experiencia.fecha_inicio.split('T')[0] : '',
        fecha_fin: experiencia.fecha_fin ? experiencia.fecha_fin.split('T')[0] : '',
        actual: Boolean(experiencia.actual),
        sin_experiencia: Boolean(experiencia.sin_experiencia),
        constancia_archivo: experiencia.constancia_archivo ? String(experiencia.constancia_archivo) : ''
      });
      setEditMode(true);
    } else {
      setCurrentExperiencia({
        user_id: user?.id || null,
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
      user_id: user?.id || null,
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
  };

  const handleSubmit = async () => {
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

    try {
      setLoading(true);
      
      if (editMode) {
        // Actualizar experiencia existente
        const response = await experienciasAPI.updateExperiencia(currentExperiencia.id, {
          pais: currentExperiencia.pais,
          sector: currentExperiencia.sector,
          empresa: currentExperiencia.empresa,
          ruc: currentExperiencia.ruc,
          cargo: currentExperiencia.cargo,
          fecha_inicio: currentExperiencia.fecha_inicio,
          fecha_fin: currentExperiencia.fecha_fin || null,
          actual: currentExperiencia.actual,
          sin_experiencia: currentExperiencia.sin_experiencia
        }, selectedFile); // Pasar el archivo seleccionado directamente

        if (response.success) {
          setAlert({ type: 'success', message: 'Experiencia actualizada correctamente' });
          await loadExperiencias();
        }
      } else {
        // Crear nueva experiencia
        const response = await experienciasAPI.createExperiencia({
          pais: currentExperiencia.pais,
          sector: currentExperiencia.sector,
          empresa: currentExperiencia.empresa,
          ruc: currentExperiencia.ruc,
          cargo: currentExperiencia.cargo,
          fecha_inicio: currentExperiencia.fecha_inicio,
          fecha_fin: currentExperiencia.fecha_fin || null,
          actual: currentExperiencia.actual,
          sin_experiencia: currentExperiencia.sin_experiencia
        }, selectedFile); // Pasar el archivo seleccionado directamente

        if (response.success) {
          setAlert({ type: 'success', message: 'Experiencia creada correctamente' });
          await loadExperiencias();
        }
      }
      
      handleCloseDialog();
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.message || 'Error al guardar la experiencia'
      });
    } finally {
      setLoading(false);
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
      setCurrentExperiencia({
        ...currentExperiencia,
        constancia_archivo: file.name
      });
    }
  };

  // Cargar experiencias al montar el componente
  useEffect(() => {
    loadExperiencias();
  }, []);

  const loadExperiencias = async () => {
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

      const response = await experienciasAPI.getExperiencias(page, 10);
      if (response.success) {
        setExperiencias(response.data);
        // setTotalPages(response.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error('Error cargando experiencias:', error);
      setAlert({ 
        type: 'error', 
        message: error.message || 'Error al cargar las experiencias' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta experiencia?')) {
      try {
        setLoading(true);
        await experienciasAPI.deleteExperiencia(id);
        setAlert({ type: 'success', message: 'Experiencia eliminada correctamente' });
        await loadExperiencias();
      } catch (error) {
        console.error('Error eliminando experiencia:', error);
        setAlert({ type: 'error', message: 'Error al eliminar la experiencia' });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDownload = async (experiencia) => {
    if (!experiencia.constancia_archivo) {
      setAlert({ type: 'error', message: 'No hay archivo disponible para descargar' });
      return;
    }

    try {
      await experienciasAPI.downloadDocumento(experiencia.id);
    } catch (error) {
      console.error('Error descargando archivo:', error);
      setAlert({ type: 'error', message: 'Error al descargar el archivo' });
    }
  };

  const formatFecha = (fecha) => {
    if (!fecha) return 'Actual';
    // Extraer solo la parte de fecha YYYY-MM-DD
    return fecha.split('T')[0];
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
                        {Boolean(experiencia.actual) && (
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
                            onClick={() => handleDownload(experiencia)}
                          >
                            Descargar
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
                  label="País"
                  value={currentExperiencia.pais}
                  onChange={(e) => setCurrentExperiencia({ 
                    ...currentExperiencia, 
                    pais: e.target.value 
                  })}
                  required
                  fullWidth
                  placeholder="Ejemplo: Perú"
                />
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
                  disabled={Boolean(currentExperiencia.actual)}
                  fullWidth
                  helperText={Boolean(currentExperiencia.actual) ? "No necesario para trabajo actual" : ""}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={Boolean(currentExperiencia.actual)}
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
                      checked={Boolean(currentExperiencia.sin_experiencia)}
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
