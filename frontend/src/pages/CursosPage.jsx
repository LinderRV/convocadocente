import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  CircularProgress,
  Alert,
  Switch
} from '@mui/material';
import {
  Search as SearchIcon
} from '@mui/icons-material';
import cursosAPI from '../services/cursosAPI';

const CursosPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cursos, setCursos] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar cursos desde la API
  const loadCursos = async (page = 1, search = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await cursosAPI.getCursos(page, pagination.itemsPerPage, search);
      
      if (response.success) {
        setCursos(response.data);
        setPagination(response.pagination);
      } else {
        setError(response.message || 'Error al cargar cursos');
      }
    } catch (error) {
      console.error('Error al cargar cursos:', error);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Cambiar estado de un curso
  const handleToggleEstado = async (cursoId) => {
    try {
      const response = await cursosAPI.toggleCursoStatus(cursoId);
      
      if (response.success) {
        // Actualizar la lista de cursos
        await loadCursos(pagination.currentPage, searchTerm);
      } else {
        setError(response.message || 'Error al actualizar estado');
      }
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      setError('Error al cambiar estado del curso');
    }
  };

  // Manejar cambio de página
  const handleChangePage = (event, newPage) => {
    loadCursos(newPage + 1, searchTerm);
  };

  // Manejar cambio de búsqueda
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    
    // Debounce search
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      loadCursos(1, value);
    }, 500);
  };

  // Cargar datos iniciales
  useEffect(() => {
    loadCursos();
  }, []);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ 
          fontWeight: 'bold',
          mb: 1,
          color: 'primary.main'
        }}>
          Plan de Estudios - Cursos
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Lista de cursos del plan de estudios
        </Typography>
      </Box>

      {/* Mensaje de error */}
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
            placeholder="Buscar cursos..."
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

      {/* Tabla de cursos */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Lista de Cursos del Plan de Estudios
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
                      <TableCell sx={{ fontWeight: 600 }}>Código Plan</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Código Facultad</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Código Especialidad</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Código Curso</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Nombre Curso</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Ciclo</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="center">Estado</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cursos.map((curso) => (
                      <TableRow key={curso.id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {curso.id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {curso.n_codplan}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {curso.c_codfac}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {curso.c_codesp}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: 'primary.main' }}>
                            {curso.c_codcur}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {curso.c_nomcur}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {curso.n_ciclo}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Switch
                            checked={curso.estado === 1}
                            onChange={() => handleToggleEstado(curso.id)}
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
                    {cursos.length === 0 && !loading && (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                          <Typography variant="body1" color="text.secondary">
                            {searchTerm ? 'No se encontraron cursos que coincidan con la búsqueda' : 'No se encontraron cursos'}
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
                count={pagination.totalItems}
                rowsPerPage={pagination.itemsPerPage}
                page={pagination.currentPage - 1}
                onPageChange={handleChangePage}
                onRowsPerPageChange={(event) => {
                  const newRowsPerPage = parseInt(event.target.value, 10);
                  setPagination(prev => ({ ...prev, itemsPerPage: newRowsPerPage }));
                  loadCursos(1, searchTerm);
                }}
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

export default CursosPage;
