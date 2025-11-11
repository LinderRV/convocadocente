import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Divider,
  Stack,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  Fade,
  useTheme,
  Snackbar
} from '@mui/material';
import { 
  Google as GoogleIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Visibility,
  VisibilityOff,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, register, googleLogin } = useAuth();
  const theme = useTheme();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Agregar campos para registro
  const [registerData, setRegisterData] = useState({
    nombre: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    if (isRegisterMode) {
      setRegisterData({
        ...registerData,
        [e.target.name]: e.target.value
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Usar Google Auth REAL con las credenciales proporcionadas
      const result = await googleLogin();
      
      if (result.success) {
        setSuccessMessage('¡Inicio de sesión exitoso con Google!');
        setOpenSnackbar(true);
        navigate(result.redirectPath || '/dashboard');
      } else {
        setError(result.error || 'Error al iniciar sesión con Google');
      }
    } catch (err) {
      console.error('Error en Google Login:', err);
      setError('Error de conexión con Google: ' + (err.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await register(registerData);
      
      if (result.success) {
        setSuccessMessage('¡Registro exitoso! Ahora puedes iniciar sesión.');
        setOpenSnackbar(true);
        setIsRegisterMode(false);
        // Limpiar formulario
        setRegisterData({
          nombre: '',
          email: '',
          password: ''
        });
      } else {
        setError(result.error || 'Error en el registro');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        navigate(result.redirectPath || '/dashboard');
      } else {
        setError(result.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        /*background: 'linear-gradient(135deg, #e50a5e 0%, #764ba2 100%)',*/
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}
    >
      <Container component="main" maxWidth="md">
        <Fade in timeout={800}>
          <Card
            elevation={24}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Box sx={{ display: 'flex', minHeight: '500px' }}>
              {/* Panel izquierdo - Información */}
              <Box
                sx={{
                  flex: 1,
                  background: 'linear-gradient(45deg, #64082b 30%, #e50a5e 90%)',
                  display: { xs: 'none', md: 'flex' },
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'white',
                  p: 4,
                  textAlign: 'center'
                }}
              >
                {/* Logo UMA */}
                <Box
                  component="img"
                  src="/logo-uma.png"
                  alt="Universidad María Auxiliadora"
                  sx={{
                    width: { md: '180px', lg: '260px' },
                    height: 'auto',
                    mb: 3,
                    filter: 'brightness(0) invert(1)', // Hace el logo blanco
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }}
                />
                
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                  ConvocaDocente
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
                  Sistema oficial de convocatoria docente de la Universidad María Auxiliadora.
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8, maxWidth: 300 }}>
                  {isRegisterMode 
                    ? 'Únete a nuestra plataforma y accede a las mejores oportunidades académicas'
                    : 'Cambia tu historia'
                  }
                </Typography>
              </Box>

              {/* Panel derecho - Formulario */}
              <Box sx={{ flex: 1, p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {/* Logo para móviles */}
                <Box 
                  sx={{ 
                    display: { xs: 'flex', md: 'none' }, 
                    justifyContent: 'center', 
                    mb: 3 
                  }}
                >
                  <Box
                    component="img"
                    src="/logo-uma.png"
                    alt="Universidad María Auxiliadora"
                    sx={{
                      width: '100px',
                      height: 'auto',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  />
                </Box>

                <Box sx={{ mb: 4, textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="600" color="primary" gutterBottom>
                    {isRegisterMode ? 'Crear Cuenta' : 'Bienvenido'}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {isRegisterMode 
                      ? 'Completa tus datos para comenzar'
                      : 'Ingresa tus credenciales para continuar'
                    }
                  </Typography>
                </Box>

                {error && (
                  <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {error}
                  </Alert>
                )}

                <Box component="form" onSubmit={isRegisterMode ? handleRegister : handleSubmit}>
                  {isRegisterMode && (
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="nombre"
                      label="Nombre"
                      name="nombre"
                      autoComplete="name"
                      value={registerData.nombre}
                      onChange={handleChange}
                      disabled={loading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 2 }}
                    />
                  )}
                  
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Correo Electrónico"
                    name="email"
                    autoComplete="email"
                    value={isRegisterMode ? registerData.email : formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />
                  
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Contraseña"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete={isRegisterMode ? "new-password" : "current-password"}
                    value={isRegisterMode ? registerData.password : formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 3 }}
                  />
                  
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{
                      mb: 3,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      textTransform: 'none',
                      background: 'linear-gradient(45deg, #64082b 30%, #e50a5e 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #e50a5e 30%, #64082b 90%)',
                      }
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      isRegisterMode ? 'Crear Cuenta' : 'Iniciar Sesión'
                    )}
                  </Button>

                  {!isRegisterMode && (
                    <>
                      <Divider sx={{ my: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                          o continúa con
                        </Typography>
                      </Divider>

                      <Button
                        fullWidth
                        variant="outlined"
                        size="large"
                        startIcon={<GoogleIcon />}
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        sx={{
                          mb: 3,
                          py: 1.5,
                          borderRadius: 2,
                          textTransform: 'none',
                          borderColor: '#db4437',
                          color: '#db4437',
                          '&:hover': {
                            backgroundColor: 'rgba(219, 68, 55, 0.04)',
                            borderColor: '#db4437',
                          }
                        }}
                      >
                        Continuar con Google
                      </Button>
                    </>
                  )}

                  <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
                    <Typography variant="body2" color="text.secondary">
                      {isRegisterMode ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
                    </Typography>
                    <Button
                      variant="text"
                      onClick={() => {
                        setIsRegisterMode(!isRegisterMode);
                        setError('');
                        setSuccessMessage('');
                      }}
                      disabled={loading}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        color: 'primary.main'
                      }}
                    >
                      {isRegisterMode ? 'Inicia sesión' : 'Regístrate'}
                    </Button>
                  </Stack>
                </Box>
              </Box>
            </Box>
          </Card>
        </Fade>

        {/* Snackbar para mensajes de éxito */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity="success"
            variant="filled"
            icon={<CheckCircleIcon fontSize="inherit" />}
            sx={{
              borderRadius: 2,
              fontSize: '1rem',
              fontWeight: 500,
              '& .MuiAlert-icon': {
                fontSize: '1.5rem'
              }
            }}
          >
            {successMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default LoginPage;
