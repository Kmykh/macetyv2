import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import MacetyCharacter from '../components/MacetyCharacter';
import './Auth.css';
// Importamos la URL base desde la configuración
import { API_BASE_URL } from '../config';

function Login() {
  const navigate = useNavigate();
  const location = useLocation(); // 1. Obtenemos la ubicación
  
  // 2. Revisamos si el 'ProtectedRoute' nos envió aquí
  const fromPage = location.state?.from?.pathname || '/';

  const [showPassword, setShowPassword] = useState(false);
  const [macetyState, setMacetyState] = useState('saludando');
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      // USAMOS LA VARIABLE IMPORTADA AQUÍ
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      // Handle empty or invalid JSON responses
      const text = await response.text();
      let data = {};
      if (text) {
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          console.error('Error parsing JSON:', parseError, 'Raw response:', text);
          throw new Error('Respuesta inválida del servidor');
        }
      }

      if (!response.ok) {
        throw new Error(data.message || 'Error del servidor');
      }
      
      console.log('Login exitoso:', data);
      
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('user', JSON.stringify(data.user)); 

      // --- 3. ¡REDIRECCIÓN INTELIGENTE! ---
      // Te envía a la página que querías ver, o al Home ('/') si solo fuiste al login.
      navigate(fromPage, { replace: true }); 

    } catch (err) {
      setError(err.message);
      console.error('Error en el login:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- (Funciones de Macety - sin cambios) ---
  const updateMacetyState = (passwordIsVisible, passwordIsFocused) => {
    if (passwordIsFocused) {
      if (passwordIsVisible) setMacetyState('saludando');
      else setMacetyState('ojosTapados');
    } else {
      setMacetyState('saludando');
    }
  };
  const togglePasswordVisibility = () => {
    const newShowPasswordState = !showPassword;
    setShowPassword(newShowPasswordState);
    updateMacetyState(newShowPasswordState, true); 
  };
  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
    updateMacetyState(showPassword, true);
  };
  const handlePasswordBlur = () => {
    setIsPasswordFocused(false);
    updateMacetyState(showPassword, false); 
  };


  return (
    <div className="auth-container">
      <header className="auth-header">
        <div className="logo">NaturaFy</div>
        <Link to="/register" className="header-button">Crear Cuenta</Link>
      </header>
      
      <main className="auth-main">
        <Link to="/" className="auth-back-arrow">←</Link>

        <div className="auth-card">
          <MacetyCharacter state={macetyState} />
          <h2>Iniciar Sesión</h2>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <input 
                type="email" id="email" name="email"
                className="form-input" placeholder="Correo electrónico"
                required disabled={loading}
                onBlur={handlePasswordBlur} 
                onFocus={handlePasswordBlur}
              />
            </div>
            
            <div 
              className="password-wrapper"
              onFocus={handlePasswordFocus}
              onBlur={handlePasswordBlur}
            > 
              <input 
                type={showPassword ? 'text' : 'password'} 
                id="password" name="password"
                className="form-input-with-eye" placeholder="Contraseña"
                required disabled={loading}
              />
              <button 
                type="button" 
                className="eye-icon-btn" 
                onClick={togglePasswordVisibility}
                disabled={loading}
              >
                {showPassword ? (
                  <i className="fa-solid fa-eye"></i>
                ) : (
                  <i className="fa-solid fa-eye-slash"></i>
                )}
              </button>
            </div>
            
            {error && (
              <p className="auth-error-message">{error}</p>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Cargando...' : 'Iniciar Sesión'}
            </button>
          </form>
          
          <div className="auth-card-footer">
            <a href="#">¿Olvidaste tu contraseña?</a>
            <Link to="/register">Crear cuenta</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;