import React, { useState } from 'react';
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
  MenuItem
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
  Badge as BadgeIcon
} from '@mui/icons-material';

const PerfilDocentePage = () => {
  const [editMode, setEditMode] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [alert, setAlert] = useState(null);

  // DATOS MOCK - Tabla 'docentes'
  const [perfilData, setPerfilData] = useState({
    id: 1,
    user_id: 11, // ID del usuario autenticado
    nombres: "drmedicina",
    apellidos: "López García",
    dni: "12345678",
    fecha_nacimiento: "1985-05-15",
    genero: "Masculino",
    pais: "Perú",
    direccion: "Av. Los Médicos 123, Lima, Perú",
    telefono: "+51 987654321",
    cv_archivo: "cv_drmedicina.pdf"
  });

  const [tempData, setTempData] = useState({...perfilData});

  const generos = ['Masculino', 'Femenino'];
  const paises = ['Perú', 'Colombia', 'Ecuador', 'Bolivia', 'Chile', 'Argentina', 'Brasil', 'Otro'];

  const handleEdit = () => {
    setTempData({...perfilData});
    setEditMode(true);
  };

  const handleCancel = () => {
    setTempData({...perfilData});
    setEditMode(false);
  };

  const handleSave = () => {
    // Aquí iría la lógica para guardar en la base de datos
    setPerfilData({...tempData});
    setEditMode(false);
    setAlert({ type: 'success', message: 'Perfil actualizado correctamente' });
  };

  const handleUploadCV = () => {
    setOpenDialog(true);
  };

  const handleFileUpload = () => {
    // Aquí iría la lógica para subir archivo
    setPerfilData({...perfilData, cv_archivo: 'nuevo_cv_drmedicina.pdf'});
    setOpenDialog(false);
    setAlert({ type: 'success', message: 'CV actualizado correctamente' });
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

  return (
    <Box sx={{ p: 3 }}>
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
              
              <Chip 
                label={`${calculateAge(perfilData.fecha_nacimiento)} años`}
                color="primary"
                sx={{ mb: 2 }}
              />
              
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
                    docente@uma.edu.pe
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {perfilData.telefono}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {perfilData.pais}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

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
                    value={editMode ? tempData.fecha_nacimiento : perfilData.fecha_nacimiento}
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
                    select
                    label="País"
                    value={editMode ? tempData.pais : perfilData.pais}
                    onChange={(e) => setTempData({...tempData, pais: e.target.value})}
                    disabled={!editMode}
                    fullWidth
                  >
                    {paises.map((pais) => (
                      <MenuItem key={pais} value={pais}>
                        {pais}
                      </MenuItem>
                    ))}
                  </TextField>
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
              <input type="file" hidden accept=".pdf,.doc,.docx" />
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleFileUpload} variant="contained">
            Subir CV
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PerfilDocentePage;
