import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Profile.css'; 
import { API_BASE_URL } from '../config';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Estados para el modal flotante
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    try {
      const userString = localStorage.getItem('user');
      if (userString) {
        setUser(JSON.parse(userString));
      } else {
        navigate('/login');
      }
    } catch (e) {
      console.error("Error al leer el usuario del localStorage", e);
      navigate('/login');
    }
  }, [navigate]); 

  const handleLogout = () => {
    localStorage.clear(); 
    navigate('/login');
  };

  // Función que SOLO abre el modal (ya no borra directo)
  const openDeleteModal = () => {
    setShowDeleteModal(true);
    setDeleteError(null);
  };

  // Función que cierra el modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteError(null);
  };

  // La lógica real de borrado que se ejecuta al confirmar en el modal
  const confirmDeleteAccount = async () => {
    setLoading(true);
    setDeleteError(null);

    try {
      const token = localStorage.getItem('access_token');
      
      const response = await fetch(`${API_BASE_URL}/api/v1/profile`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Éxito: Cerramos sesión inmediatamente
        handleLogout(); 
      } else {
        // Error: Mostramos el mensaje DENTRO del modal
        const data = await response.json().catch(() => ({}));
        setDeleteError(data.message || "No se pudo eliminar la cuenta. Intenta de nuevo.");
      }
    } catch (error) {
      console.error("Error eliminando cuenta:", error);
      setDeleteError("Error de conexión. Verifica tu internet.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="profile-page">
        <h1 className="profile-title">Cargando...</h1>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* --- ESTILOS INLINE PARA EL MODAL (Para asegurar que funcione sin editar CSS externo) --- */}
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease-out;
        }
        .modal-content {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          width: 90%;
          max-width: 400px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
          animation: slideUp 0.2s ease-out;
        }
        .modal-title {
          color: #e74c3c;
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }
        .modal-text {
          color: #555;
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }
        .modal-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }
        .btn-cancel {
          padding: 10px 20px;
          border: 1px solid #ccc;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          color: #555;
        }
        .btn-confirm {
          padding: 10px 20px;
          border: none;
          background: #e74c3c;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          color: white;
        }
        .btn-confirm:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .error-msg {
          color: #e74c3c;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          background: #fde8e8;
          padding: 8px;
          border-radius: 4px;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>

      <h1 className="profile-title">Perfil</h1>
      
      <div className="profile-user-info">
        <div className="profile-avatar-wrapper">
          <div className="profile-avatar-placeholder">
            {user.name ? user.name.charAt(0).toUpperCase() : user.first_name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
        <div className="profile-user-details">
          <h2>{user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Usuario'}</h2>
          <p><i className="fa-solid fa-envelope"></i> {user.email}</p>
        </div>
        <div className="profile-stats">
          <div className="profile-stat">
            <div className="profile-stat-value">0</div>
            <div className="profile-stat-label">Plantas</div>
          </div>
          <div className="profile-stat">
            <div className="profile-stat-value">0</div>
            <div className="profile-stat-label">Días activo</div>
          </div>
        </div>
      </div>
      
      <h3 className="settings-title">Ajustes</h3>
      
      <ul className="settings-list">
        <li>
          <Link to="/help" className="settings-link">
            <i className="fa-solid fa-question-circle"></i>
            <span>Ayuda</span>
          </Link>
        </li>

        <li>
          {/* Botón que abre el modal */}
          <button 
            onClick={openDeleteModal} 
            className="settings-link delete-account-btn"
          >
            <i className="fa-solid fa-trash-can"></i>
            <span>Eliminar Cuenta</span>
          </button>
        </li>

        <li>
          <button onClick={handleLogout} className="settings-link logout-btn">
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            <span>Cerrar sesión</span>
          </button>
        </li>
      </ul>

      {/* --- MODAL FLOTANTE --- */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={closeDeleteModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '3rem', color: '#e74c3c', marginBottom: '1rem' }}></i>
            <h3 className="modal-title">¿Eliminar cuenta?</h3>
            <p className="modal-text">
              Esta acción es <strong>permanente</strong>. Perderás todos tus datos y no podrás recuperarlos.
            </p>

            {deleteError && <div className="error-msg">{deleteError}</div>}

            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeDeleteModal} disabled={loading}>
                Cancelar
              </button>
              <button className="btn-confirm" onClick={confirmDeleteAccount} disabled={loading}>
                {loading ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;