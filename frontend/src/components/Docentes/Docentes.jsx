import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { docentesService } from '../../services/api';

const Docentes = () => {
  const [docentes, setDocentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentDocente, setCurrentDocente] = useState({
    id: null,
    nombre: '',
    apellido: '',
    email: '',
    especialidad: '',
    telefono: '',
  });
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchDocentes();
  }, []);

  const fetchDocentes = async () => {
    try {
      setLoading(true);
      const response = await docentesService.getAll();
      if (response.success) {
        setDocentes(response.data || []);
        setAlert({ type: 'success', message: 'Datos cargados correctamente' });
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Error al cargar los docentes',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (docente = null) => {
    if (docente) {
      setCurrentDocente(docente);
      setEditMode(true);
    } else {
      setCurrentDocente({
        id: null,
        nombre: '',
        apellido: '',
        email: '',
        especialidad: '',
        telefono: '',
      });
      setEditMode(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentDocente({
      id: null,
      nombre: '',
      apellido: '',
      email: '',
      especialidad: '',
      telefono: '',
    });
  };

  const handleSubmit = async () => {
    try {
      if (!currentDocente.nombre || !currentDocente.apellido || !currentDocente.email) {
        setAlert({ type: 'error', message: 'Nombre, apellido y email son obligatorios' });
        return;
      }

      let response;
      if (editMode) {
        response = await docentesService.update(currentDocente.id, currentDocente);
      } else {
        response = await docentesService.create(currentDocente);
      }

      if (response.success) {
        setAlert({
          type: 'success',
          message: editMode ? 'Docente actualizado correctamente' : 'Docente creado correctamente',
        });
        handleClose();
        fetchDocentes();
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Error al guardar el docente',
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este docente?')) {
      try {
        const response = await docentesService.delete(id);
        if (response.success) {
          setAlert({ type: 'success', message: 'Docente eliminado correctamente' });
          fetchDocentes();
        }
      } catch (error) {
        setAlert({
          type: 'error',
          message: error.response?.data?.message || 'Error al eliminar el docente',
        });
      }
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'nombre', headerName: 'Nombre', width: 150 },
    { field: 'apellido', headerName: 'Apellido', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'especialidad', headerName: 'Especialidad', width: 180 },
    { field: 'telefono', headerName: 'Teléfono', width: 130 },
    {
      field: 'estado',
      headerName: 'Estado',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value || 'activo'}
          color={params.value === 'activo' ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 120,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => handleOpen(params.row)}
            color="primary"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDelete(params.row.id)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Gestión de Docentes
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchDocentes}
            disabled={loading}
          >
            Actualizar
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
          >
            Agregar Docente
          </Button>
        </Box>
      </Box>

      {alert && (
        <Alert severity={alert.type} sx={{ mb: 2 }} onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={docentes}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[5, 10, 20]}
              checkboxSelection
              disableSelectionOnClick
              loading={loading}
              sx={{
                '& .MuiDataGrid-cell': {
                  borderColor: 'divider',
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: 'background.paper',
                  borderColor: 'divider',
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Dialog para agregar/editar docente */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editMode ? 'Editar Docente' : 'Agregar Nuevo Docente'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Nombre"
              value={currentDocente.nombre}
              onChange={(e) =>
                setCurrentDocente({ ...currentDocente, nombre: e.target.value })
              }
              required
              fullWidth
            />
            <TextField
              label="Apellido"
              value={currentDocente.apellido}
              onChange={(e) =>
                setCurrentDocente({ ...currentDocente, apellido: e.target.value })
              }
              required
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={currentDocente.email}
              onChange={(e) =>
                setCurrentDocente({ ...currentDocente, email: e.target.value })
              }
              required
              fullWidth
            />
            <TextField
              label="Especialidad"
              value={currentDocente.especialidad}
              onChange={(e) =>
                setCurrentDocente({ ...currentDocente, especialidad: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Teléfono"
              value={currentDocente.telefono}
              onChange={(e) =>
                setCurrentDocente({ ...currentDocente, telefono: e.target.value })
              }
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editMode ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Docentes;
