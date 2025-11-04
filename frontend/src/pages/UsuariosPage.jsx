import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  TablePagination,
  CircularProgress,
  Alert,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Search as SearchIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { usuariosAPI } from '../services/api';

const UsuariosPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);

  // Cargar usuarios al montar el componente y cuando cambien los filtros
  useEffect(() => {
    loadUsuarios();
  }, [page, rowsPerPage, searchTerm]);

  const loadUsuarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await usuariosAPI.getAdministrativeUsers({
        page: page + 1, // Backend usa páginas basadas en 1
        limit: rowsPerPage,
        search: searchTerm
      });
      
      if (response.data.success) {
        setUsuarios(response.data.data);
        setTotalUsers(response.data.pagination.total);
      } else {
        setError('Error al cargar usuarios');
      }
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setError(err.response?.data?.message || 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Resetear a la primera página al buscar
  };

  const handleToggleEstado = async (usuario) => {
    try {
      const nuevoEstado = usuario.estado === 'Activo' ? 'Inactivo' : 'Activo';
      
      const response = await usuariosAPI.toggleUserStatus(usuario.id, nuevoEstado);
      
      if (response.data.success) {
        // Actualizar el estado local del usuario
        setUsuarios(prevUsuarios => 
          prevUsuarios.map(u => 
            u.id === usuario.id 
              ? { ...u, estado: nuevoEstado }
              : u
          )
        );
      } else {
        setError('Error al cambiar el estado del usuario');
      }
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      setError(err.response?.data?.message || 'Error al cambiar el estado del usuario');
    }
  };

  const getRolColor = (rol) => {
    switch (rol) {
      case 'Administrador': return 'error';
      case 'Decano': return 'warning';
      case 'Director': return 'secondary';
      default: return 'default';
    }
  };

  // Los usuarios ya vienen filtrados del backend
  const displayedUsuarios = usuarios;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ 
          fontWeight: 'bold',
          mb: 1,
          color: 'primary.main'
        }}>
          Usuarios Administrativos
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Lista de usuarios con roles administrativos del sistema
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Buscador */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 400 }}
          />
        </CardContent>
      </Card>

      {/* Tabla de usuarios */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Lista de Usuarios Administrativos
          </Typography>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                      <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Usuario</TableCell>
                      <TableCell sx={{ fontWeight: 600, display: { xs: 'none', md: 'table-cell' } }}>
                        Email
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Rol</TableCell>
                      <TableCell sx={{ fontWeight: 600, display: { xs: 'none', lg: 'table-cell' } }}>
                        Facultad
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, display: { xs: 'none', lg: 'table-cell' } }}>
                        Especialidad
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="center">Estado</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayedUsuarios.map((usuario) => (
                      <TableRow key={usuario.id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {usuario.id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              sx={{ 
                                mr: 2, 
                                width: 40, 
                                height: 40,
                                bgcolor: 'primary.main'
                              }}
                            >
                              {usuario.usuario?.charAt(0)?.toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {usuario.usuario}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <EmailIcon sx={{ fontSize: 14, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">{usuario.email}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={usuario.rol}
                            color={getRolColor(usuario.rol)}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                          <Typography variant="body2">
                            {usuario.facultad || 'No asignada'}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                          <Typography variant="body2">
                            {usuario.especialidad || 'No asignada'}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Switch
                            checked={usuario.estado === 'Activo'}
                            onChange={() => handleToggleEstado(usuario)}
                            size="small"
                            sx={{
                              '& .MuiSwitch-switchBase': {
                                color: '#fff',
                                '&.Mui-checked': {
                                  color: '#fff',
                                  '& + .MuiSwitch-track': {
                                    backgroundColor: '#4caf50',
                                    opacity: 1,
                                  },
                                },
                              },
                              '& .MuiSwitch-track': {
                                backgroundColor: '#e0e0e0',
                                opacity: 1,
                                borderRadius: '12px',
                              },
                              '& .MuiSwitch-thumb': {
                                width: 16,
                                height: 16,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                              },
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                    {displayedUsuarios.length === 0 && !loading && (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                          <Typography variant="body1" color="text.secondary">
                            {searchTerm ? 'No se encontraron usuarios que coincidan con la búsqueda' : 'No se encontraron usuarios administrativos'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Paginación */}
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={totalUsers}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Filas por página:"
                labelDisplayedRows={({ from, to, count }) => 
                  `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
                }
              />
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default UsuariosPage;
