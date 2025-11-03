import React from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const LoadingCard = ({ message = 'Cargando...' }) => (
  <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
    <CircularProgress sx={{ mb: 2 }} />
    <Typography variant="body1">{message}</Typography>
  </Paper>
);

const ErrorCard = ({ 
  message = 'Ha ocurrido un error', 
  severity = 'error',
  onRetry 
}) => (
  <Alert 
    severity={severity} 
    action={
      onRetry && (
        <Button size="small" onClick={onRetry}>
          Reintentar
        </Button>
      )
    }
  >
    {message}
  </Alert>
);

const EmptyState = ({ 
  title = 'No hay datos', 
  description = 'No se encontraron elementos para mostrar',
  icon 
}) => (
  <Paper elevation={1} sx={{ p: 6, textAlign: 'center' }}>
    {icon && (
      <Box sx={{ mb: 2, color: 'text.secondary' }}>
        {icon}
      </Box>
    )}
    <Typography variant="h6" color="text.secondary" gutterBottom>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {description}
    </Typography>
  </Paper>
);

const PageHeader = ({ 
  title, 
  subtitle, 
  actions, 
  breadcrumbs 
}) => (
  <Box sx={{ mb: 3 }}>
    {breadcrumbs && (
      <Box sx={{ mb: 1 }}>
        {breadcrumbs}
      </Box>
    )}
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        mb: 1 
      }}
    >
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body1" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      {actions && (
        <Box sx={{ ml: 2 }}>
          {actions}
        </Box>
      )}
    </Box>
  </Box>
);

const StatusChip = ({ 
  status, 
  colorMap = {
    activo: 'success',
    inactivo: 'default',
    publicada: 'success',
    borrador: 'warning',
    cerrada: 'error',
    cancelada: 'error'
  },
  ...props 
}) => {
  const color = colorMap[status] || 'default';
  
  return (
    <Chip 
      label={status} 
      color={color}
      size="small"
      {...props}
    />
  );
};

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirmar acción',
  message = '¿Estás seguro de que deseas realizar esta acción?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  severity = 'warning'
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle sx={{ pb: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {severity === 'warning' && <WarningIcon color="warning" />}
        {severity === 'error' && <ErrorIcon color="error" />}
        {severity === 'info' && <InfoIcon color="info" />}
        {title}
      </Box>
    </DialogTitle>
    <DialogContent>
      <Typography variant="body1">
        {message}
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="inherit">
        {cancelText}
      </Button>
      <Button 
        onClick={onConfirm} 
        color={severity === 'error' ? 'error' : 'primary'}
        variant="contained"
      >
        {confirmText}
      </Button>
    </DialogActions>
  </Dialog>
);

export {
  LoadingCard,
  ErrorCard,
  EmptyState,
  PageHeader,
  StatusChip,
  ConfirmDialog
};
