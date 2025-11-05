import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip,
  useTheme,
  useMediaQuery,
  Paper,
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  ChevronLeft as ChevronLeftIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  Favorite as FavoriteIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 280;

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // Detectar si el usuario es docente o administrativo
  const isDocente = !user?.roles || user?.roles.length === 0;

  // Elementos del menú lateral para ADMINISTRATIVOS
  const menuItemsAdmin = [
    {
      text: 'Inicio',
      icon: <DashboardIcon />,
      path: '/dashboard',
      description: 'Panel principal'
    },
    {
      text: 'Lista Usuarios',
      icon: <PeopleIcon />,
      path: '/usuarios',
      description: 'Gestión de usuarios'
    },
    {
      text: 'Lista Cursos',
      icon: <SchoolIcon />,
      path: '/cursos',
      description: 'Gestión de cursos'
    }
  ];

  // Elementos del menú lateral para DOCENTES
  const menuItemsDocente = [
    {
      text: 'Mi Dashboard',
      icon: <DashboardIcon />,
      path: '/docente/dashboard',
      description: 'Panel principal docente'
    },
    {
      text: 'Mi Perfil',
      icon: <PersonIcon />,
      path: '/docente/perfil',
      description: 'Información personal'
    },
    {
      text: 'Formaciones',
      icon: <SchoolIcon />,
      path: '/docente/formaciones',
      description: 'Formaciones académicas'
    },
    {
      text: 'Experiencias',
      icon: <WorkIcon />,
      path: '/docente/experiencias',
      description: 'Experiencias laborales'
    },
    {
      text: 'Postular',
      icon: <ScheduleIcon />,
      path: '/docente/crearpostulacion',
      description: 'cursos de interes y disponiblidad horaria'
    },
    {
      text: 'Mis Postulaciones',
      icon: <AssignmentIcon />,
      path: '/docente/postulaciones',
      description: 'Mis postulaciones'
    }
  ];

  // Seleccionar menú según tipo de usuario
  const menuItems = isDocente ? menuItemsDocente : menuItemsAdmin;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleProfileMenuClose();
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  // Contenido del drawer
  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header del drawer */}
      <Box
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            ConvocaDocente
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            {isDocente ? 'Portal Docente' : 'Sistema de Gestión'}
          </Typography>
        </Box>
        {isMobile && (
          <IconButton 
            onClick={handleDrawerToggle}
            sx={{ color: 'white' }}
          >
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>

      {/* Información del usuario */}
      <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              mr: 2,
              bgcolor: 'primary.main',
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}
          >
            {user?.nombre?.charAt(0)?.toUpperCase() || 'U'}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
              {user?.nombre || 'Usuario'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {user?.email || 'usuario@ejemplo.com'}
            </Typography>
            <Chip 
              label={isDocente ? 'Docente' : 'Administrador'} 
              size="small" 
              color={isDocente ? 'primary' : 'secondary'}
              variant="outlined"
            />
          </Box>
        </Box>
      </Box>

      {/* Navegación */}
      <Box sx={{ flex: 1, py: 2 }}>
        <List disablePadding>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || 
                           (item.path === '/dashboard' && location.pathname === '/');
            
            return (
              <ListItem key={item.text} disablePadding sx={{ px: 2, mb: 1 }}>
                <Tooltip title={item.description} placement="right">
                  <ListItemButton
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      borderRadius: 2,
                      mx: 1,
                      py: 1.5,
                      bgcolor: isActive ? 'primary.main' : 'transparent',
                      color: isActive ? 'white' : 'text.primary',
                      '&:hover': {
                        bgcolor: isActive ? 'primary.dark' : 'action.hover',
                      },
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: isActive ? 'white' : 'primary.main',
                        minWidth: 44
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontWeight: isActive ? 600 : 500,
                        fontSize: '0.95rem'
                      }}
                    />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Footer del drawer */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary" align="center" display="block">
          ConvocaDocente
        </Typography>
        <Typography variant="caption" color="text.secondary" align="center" display="block">
          © 2025 - Universidad Maria Auxiliadora
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 1,
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {menuItems.find(item => 
              location.pathname === item.path || 
              (item.path === '/dashboard' && location.pathname === '/')
            )?.text || 'Dashboard'}
          </Typography>

          {/* Botones de acción */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>            
            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{ ml: 1 }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: 'primary.main',
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}
              >
                {user?.nombre?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Menú de perfil */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 200,
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1
            }
          }
        }}
      >
        <MenuItem onClick={() => navigate('/perfil')}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          Mi Perfil
        </MenuItem>
        <MenuItem onClick={() => navigate('/configuracion')}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Configuración
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          Cerrar Sesión
        </MenuItem>
      </Menu>

      {/* Drawer lateral */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Drawer móvil */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Mejor rendimiento en móvil
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none'
            }
          }}
        >
          {drawerContent}
        </Drawer>
        
        {/* Drawer desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
              boxShadow: 2
            }
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: 'grey.50'
        }}
      >
        <Toolbar />
        <Box sx={{ p: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
              minHeight: 'calc(100vh - 140px)'
            }}
          >
            <Outlet />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;