import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';

// Estados de autenticación
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Tipos de acciones
const AuthActionTypes = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  LOAD_USER_START: 'LOAD_USER_START',
  LOAD_USER_SUCCESS: 'LOAD_USER_SUCCESS',
  LOAD_USER_FAILURE: 'LOAD_USER_FAILURE',
  UPDATE_PROFILE: 'UPDATE_PROFILE',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer de autenticación
const authReducer = (state, action) => {
  switch (action.type) {
    case AuthActionTypes.LOGIN_START:
    case AuthActionTypes.LOAD_USER_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case AuthActionTypes.LOGIN_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };

    case AuthActionTypes.LOAD_USER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };

    case AuthActionTypes.UPDATE_PROFILE:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
        error: null
      };

    case AuthActionTypes.LOGIN_FAILURE:
    case AuthActionTypes.LOAD_USER_FAILURE:
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };

    case AuthActionTypes.LOGOUT:
      localStorage.removeItem('token');
      return {
        ...initialState,
        isLoading: false,
        token: null
      };

    case AuthActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};

// Crear contexto
const AuthContext = createContext();

// Hook para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Cargar usuario al inicializar la app
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        dispatch({ type: AuthActionTypes.LOAD_USER_FAILURE, payload: null });
        return;
      }

      try {
        dispatch({ type: AuthActionTypes.LOAD_USER_START });
        const response = await authAPI.getProfile();
        
        if (response.data.success) {
          dispatch({
            type: AuthActionTypes.LOAD_USER_SUCCESS,
            payload: response.data.data
          });
        } else {
          throw new Error('Error al cargar el perfil');
        }
      } catch (error) {
        console.error('Error al cargar usuario:', error);
        dispatch({
          type: AuthActionTypes.LOAD_USER_FAILURE,
          payload: error.response?.data?.message || 'Error al cargar usuario'
        });
      }
    };

    loadUser();
  }, []);

  // Función para iniciar sesión
  const login = async (email, password) => {
    try {
      dispatch({ type: AuthActionTypes.LOGIN_START });
      
      const response = await authAPI.login({ email, password });
      
      if (response.data.success) {
        dispatch({
          type: AuthActionTypes.LOGIN_SUCCESS,
          payload: response.data.data
        });
        return { success: true };
      } else {
        throw new Error(response.data.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
      dispatch({
        type: AuthActionTypes.LOGIN_FAILURE,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  // Función para registrarse
  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      
      if (response.data.success) {
        return { success: true, message: response.data.message };
      } else {
        throw new Error(response.data.message || 'Error al registrarse');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al registrarse';
      return { success: false, error: errorMessage };
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      dispatch({ type: AuthActionTypes.LOGOUT });
    }
  };

  // Función para actualizar perfil
  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      
      if (response.data.success) {
        dispatch({
          type: AuthActionTypes.UPDATE_PROFILE,
          payload: response.data.data
        });
        return { success: true, message: response.data.message };
      } else {
        throw new Error(response.data.message || 'Error al actualizar perfil');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al actualizar perfil';
      return { success: false, error: errorMessage };
    }
  };

  // Función para cambiar contraseña
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await authAPI.changePassword({
        currentPassword,
        newPassword
      });
      
      if (response.data.success) {
        return { success: true, message: response.data.message };
      } else {
        throw new Error(response.data.message || 'Error al cambiar contraseña');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al cambiar contraseña';
      return { success: false, error: errorMessage };
    }
  };

  // Función para limpiar errores
  const clearError = () => {
    dispatch({ type: AuthActionTypes.CLEAR_ERROR });
  };

  // Verificar si el usuario tiene un rol específico
  const hasRole = (role) => {
    return state.user?.rol === role;
  };

  // Verificar si el usuario es administrador
  const isAdmin = () => {
    return state.user?.rol === 'admin';
  };

  // Verificar si el usuario es coordinador o administrador
  const isCoordinatorOrAdmin = () => {
    return ['admin', 'coordinador'].includes(state.user?.rol);
  };

  // Valor del contexto
  const value = {
    // Estado
    ...state,
    
    // Acciones
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError,
    
    // Utilidades
    hasRole,
    isAdmin,
    isCoordinatorOrAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
