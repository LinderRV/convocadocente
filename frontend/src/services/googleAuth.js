// Servicio de autenticación con Google - IMPLEMENTACIÓN REAL
class GoogleAuthService {
  constructor() {
    this.clientId = '977301681092-9ai03ej4dh51k6n80404m7s6mlc5on1j.apps.googleusercontent.com';
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
          // Configurar Google Identity
          window.google.accounts.id.initialize({
            client_id: this.clientId,
            callback: this.handleCredentialResponse.bind(this),
            auto_select: false,
            cancel_on_tap_outside: true,
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

  // Iniciar sesión con Google
  async signIn() {
    if (!this.isInitialized) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      this.handleCredentialResponse = (response) => {
        if (response.credential) {
          // Decodificar el JWT token
          const userInfo = this.parseJwtToken(response.credential);
          resolve({
            credential: response.credential,
            userInfo: userInfo
          });
        } else {
          reject(new Error('No se recibieron credenciales de Google'));
        }
      };

      // Mostrar el prompt de Google
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Si el prompt no se muestra, usar popup como alternativa
          this.signInWithPopup().then(resolve).catch(reject);
        }
      });
    });
  }

  // Alternativa con popup (OAuth 2.0)
  async signInWithPopup() {
    if (!this.isInitialized) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: this.clientId,
        scope: 'email profile openid',
        callback: async (response) => {
          if (response.access_token) {
            try {
              // Obtener información del usuario
              const userInfo = await this.getUserInfo(response.access_token);
              resolve({
                access_token: response.access_token,
                userInfo: userInfo
              });
            } catch (error) {
              reject(error);
            }
          } else {
            reject(new Error('No se obtuvo access token de Google'));
          }
        },
      });
      
      tokenClient.requestAccessToken();
    });
  }

  // Obtener información del usuario desde Google API
  async getUserInfo(accessToken) {
    const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener información del usuario de Google');
    }
    
    return await response.json();
  }

  // Decodificar JWT token de Google
  parseJwtToken(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error al decodificar token JWT de Google:', error);
      return null;
    }
  }

  // Cerrar sesión
  signOut() {
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
  }
}

// Exportar instancia singleton
const googleAuthService = new GoogleAuthService();
export default googleAuthService;
