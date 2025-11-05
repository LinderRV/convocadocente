import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  MenuItem,
  CircularProgress,
  Backdrop
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Upload as UploadIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Badge as BadgeIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import docenteAPI from '../../services/docentes/docenteAPI';

const PerfilDocentePage = () => {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Estado inicial vacío - se llenará con datos del API
  const [perfilData, setPerfilData] = useState({
    id: null,
    user_id: null,
    nombres: "",
    apellidos: "",
    dni: "",
    fecha_nacimiento: "",
    genero: "",
    pais: "Perú",
    direccion: "",
    telefono: "",
    cv_archivo: null
  });

  const [tempData, setTempData] = useState({...perfilData});

  const generos = ['Masculino', 'Femenino'];

  // Cargar perfil al montar componente
  useEffect(() => {
    loadPerfil();
  }, []);

  const loadPerfil = async () => {
    try {
      setLoading(true);
      const response = await docenteAPI.getPerfil();
      if (response.success) {
        const formattedData = {
          ...response.data,
          fecha_nacimiento: formatDateForInput(response.data.fecha_nacimiento)
        };
        setPerfilData(formattedData);
        setTempData(formattedData);
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Error al cargar el perfil'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setTempData({...perfilData});
    setEditMode(true);
  };

  const handleCancel = () => {
    setTempData({...perfilData});
    setEditMode(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const response = await docenteAPI.updatePerfil({
        nombres: tempData.nombres,
        apellidos: tempData.apellidos,
        dni: tempData.dni,
        fecha_nacimiento: tempData.fecha_nacimiento,
        genero: tempData.genero,
        pais: tempData.pais,
        direccion: tempData.direccion,
        telefono: tempData.telefono
      });

      if (response.success) {
        const formattedData = {
          ...response.data,
          fecha_nacimiento: formatDateForInput(response.data.fecha_nacimiento)
        };
        setPerfilData(formattedData);
        setEditMode(false);
        setAlert({ type: 'success', message: 'Perfil actualizado correctamente' });
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Error al actualizar el perfil'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUploadCV = () => {
    setSelectedFile(null);
    setOpenDialog(true);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de archivo
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setAlert({
          type: 'error',
          message: 'Solo se permiten archivos PDF, DOC y DOCX'
        });
        return;
      }

      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        setAlert({
          type: 'error',
          message: 'El archivo no puede superar los 5MB'
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setAlert({
        type: 'error',
        message: 'Por favor selecciona un archivo'
      });
      return;
    }

    try {
      setSaving(true);
      const response = await docenteAPI.uploadCV(selectedFile);
      
      if (response.success) {
        setPerfilData({...perfilData, cv_archivo: response.data.cv_archivo});
        setOpenDialog(false);
        setSelectedFile(null);
        setAlert({ type: 'success', message: 'CV actualizado correctamente' });
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Error al subir el CV'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadCV = async () => {
    try {
      await docenteAPI.downloadCV();
      setAlert({ type: 'success', message: 'CV descargado correctamente' });
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Error al descargar el CV'
      });
    }
  };

  const handleDeleteCV = async () => {
    setOpenDeleteDialog(true);
  };

  const confirmDeleteCV = async () => {
    try {
      setSaving(true);
      const response = await docenteAPI.deleteCV();
      
      if (response.success) {
        setPerfilData({...perfilData, cv_archivo: null});
        setAlert({ type: 'success', message: 'CV eliminado correctamente' });
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Error al eliminar el CV'
      });
    } finally {
      setSaving(false);
      setOpenDeleteDialog(false);
    }
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Función para formatear fecha para input date
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) return '';
    // Formatear a YYYY-MM-DD
    return date.toISOString().split('T')[0];
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Loading Backdrop */}
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading || saving}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Mi Perfil Docente
        </Typography>
        {!editMode ? (
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEdit}
            color="primary"
          >
            Editar Perfil
          </Button>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              color="primary"
            >
              Guardar
            </Button>
          </Box>
        )}
      </Box>

      {alert && (
        <Alert 
          severity={alert.type} 
          sx={{ mb: 3 }} 
          onClose={() => setAlert(null)}
        >
          {alert.message}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Información Personal Principal */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{ 
                  width: 120, 
                  height: 120, 
                  margin: '0 auto 20px',
                  bgcolor: 'primary.main',
                  fontSize: '3rem'
                }}
              >
                <PersonIcon sx={{ fontSize: '4rem' }} />
              </Avatar>
              
              <Typography variant="h5" component="h2" gutterBottom>
                {perfilData.nombres} {perfilData.apellidos}
              </Typography>
              
              <Box sx={{ textAlign: 'left', mt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BadgeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    DNI: {perfilData.dni}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {user?.email || 'Sin email'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {perfilData.telefono}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<UploadIcon />}
                  onClick={handleUploadCV}
                  fullWidth
                  color="secondary"
                >
                  {perfilData.cv_archivo ? 'Actualizar CV' : 'Subir CV'}
                </Button>
                
                {perfilData.cv_archivo && (
                  <>
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      onClick={handleDownloadCV}
                      fullWidth
                      color="primary"
                    >
                      Descargar CV
                    </Button>
                    
                    <Button
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      onClick={handleDeleteCV}
                      fullWidth
                      color="error"
                    >
                      Eliminar CV
                    </Button>
                  </>
                )}
              </Box>
              
              {perfilData.cv_archivo && (
                <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                  Archivo actual: {perfilData.cv_archivo}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Formulario de Datos */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Información Personal
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nombres"
                    value={editMode ? tempData.nombres : perfilData.nombres}
                    onChange={(e) => setTempData({...tempData, nombres: e.target.value})}
                    disabled={!editMode}
                    fullWidth
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Apellidos"
                    value={editMode ? tempData.apellidos : perfilData.apellidos}
                    onChange={(e) => setTempData({...tempData, apellidos: e.target.value})}
                    disabled={!editMode}
                    fullWidth
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="DNI"
                    value={editMode ? tempData.dni : perfilData.dni}
                    onChange={(e) => setTempData({...tempData, dni: e.target.value})}
                    disabled={!editMode}
                    fullWidth
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    type="date"
                    label="Fecha de Nacimiento"
                    value={editMode ? formatDateForInput(tempData.fecha_nacimiento) : formatDateForInput(perfilData.fecha_nacimiento)}
                    onChange={(e) => setTempData({...tempData, fecha_nacimiento: e.target.value})}
                    disabled={!editMode}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Género"
                    value={editMode ? tempData.genero : perfilData.genero}
                    onChange={(e) => setTempData({...tempData, genero: e.target.value})}
                    disabled={!editMode}
                    fullWidth
                  >
                    {generos.map((genero) => (
                      <MenuItem key={genero} value={genero}>
                        {genero}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="País"
                    value={editMode ? tempData.pais : perfilData.pais}
                    onChange={(e) => setTempData({...tempData, pais: e.target.value})}
                    disabled={!editMode}
                    fullWidth
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Teléfono"
                    value={editMode ? tempData.telefono : perfilData.telefono}
                    onChange={(e) => setTempData({...tempData, telefono: e.target.value})}
                    disabled={!editMode}
                    fullWidth
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    label="Dirección"
                    value={editMode ? tempData.direccion : perfilData.direccion}
                    onChange={(e) => setTempData({...tempData, direccion: e.target.value})}
                    disabled={!editMode}
                    fullWidth
                    multiline
                    rows={3}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog para subir CV */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Subir CV / Hoja de Vida</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <UploadIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Selecciona tu archivo CV
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Formatos permitidos: PDF, DOC, DOCX (Máximo 5MB)
            </Typography>
            
            <Button
              variant="contained"
              component="label"
              sx={{ mt: 2 }}
            >
              Elegir Archivo
              <input 
                type="file" 
                hidden 
                accept=".pdf,.doc,.docx" 
                onChange={handleFileSelect}
              />
            </Button>
            
            {selectedFile && (
              <Typography variant="body2" sx={{ mt: 2 }}>
                Archivo seleccionado: {selectedFile.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button 
            onClick={handleFileUpload} 
            variant="contained"
            disabled={!selectedFile || saving}
          >
            {saving ? 'Subiendo...' : 'Subir CV'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para confirmar eliminación de CV */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            ¿Estás seguro de que deseas eliminar tu CV? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={confirmDeleteCV} 
            variant="contained"
            color="error"
            disabled={saving}
          >
            {saving ? 'Eliminando...' : 'Eliminar CV'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PerfilDocentePage;
