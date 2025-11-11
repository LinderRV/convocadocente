// Servicio de autenticación con Google - IMPLEMENTACIÓN REAL OPTIMIZADA
class GoogleAuthService {
  constructor() {
    this.clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    this.isInitialized = false;
  }

  // Inicializar Google Identity Services
  async init() {
    return new Promise((resolve, reject) => {
      if (this.isInitialized) {
        resolve();
        return;
      }

      // Cargar Google Identity Services
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        if (window.google) {
          // Configurar Google Identity con configuración optimizada
          window.google.accounts.id.initialize({
            client_id: this.clientId,
            callback: this.handleCredentialResponse.bind(this),
            auto_select: false,
            cancel_on_tap_outside: true,
            use_fedcm_for_prompt: false, // Deshabilitar FedCM para evitar errores CORS
            itp_support: true
          });
          this.isInitialized = true;
          resolve();
        } else {
          reject(new Error('Error al cargar Google Identity Services'));
        }
      };

      script.onerror = () => {
        reject(new Error('Error al cargar script de Google'));
      };

      document.head.appendChild(script);
    });
  }

  // Manejar respuesta de credenciales
  handleCredentialResponse(response) {
    // Esta función será sobrescrita
    console.log('Credential response:', response);
  }

  // Iniciar sesión con Google - Usar directamente popup para mejor experiencia
  async signIn() {
    if (!this.isInitialized) {
      await this.init();
    }

    // Usar directamente el popup OAuth2 para evitar problemas de FedCM
    return this.signInWithPopup();
  }

  // Método principal con popup (OAuth 2.0) - Más confiable
  async signInWithPopup() {
    if (!this.isInitialized) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: this.clientId,
        scope: 'email profile openid',
        callback: async (response) => {
          if (response.access_token && !response.error) {
            try {
              // Obtener información del usuario
              const userInfo = await this.getUserInfo(response.access_token);
              resolve({
                access_token: response.access_token,
                userInfo: userInfo
              });
            } catch (error) {
              reject(new Error('Error al obtener información del usuario: ' + error.message));
            }
          } else {
            reject(new Error(response.error || 'No se obtuvo access token de Google'));
          }
        },
      });
      
      // Solicitar token
      tokenClient.requestAccessToken({
        prompt: 'select_account' // Siempre mostrar selector de cuenta
      });
    });
  }

  // Obtener información del usuario desde Google API
  async getUserInfo(accessToken) {
    const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  }

  // Cerrar sesión
  signOut() {
    if (window.google && window.google.accounts) {
      // Revocar tokens si es posible
      try {
        window.google.accounts.id.disableAutoSelect();
      } catch (error) {
        console.log('No se pudo desactivar auto-select:', error);
      }
    }
  }
}

// Exportar instancia singleton
const googleAuthService = new GoogleAuthService();
export default googleAuthService;
