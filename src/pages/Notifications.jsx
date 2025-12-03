import React, { useState, useEffect } from 'react';
import './Page.css'; // Reutilizamos estilos
import { API_BASE_URL } from '../config';
import { API_BASE_URL_WS } from '../config';

function Notifications() {
  // --- 1. Usamos useState para guardar las notificaciones ---
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 2. useEffect para cargar datos ---
  useEffect(() => {
    // Función para cargar las notificaciones "viejas"
    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('access_token');
        if (!token) throw new Error('No estás autenticado.');

        const response = await fetch(`${API_BASE_URL}/api/v1/notifications`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Error al cargar notificaciones');
        
        const data = await response.json();
        setNotifications(data); // Guardamos las notificaciones viejas

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // --- 3. ¡AQUÍ ESTÁ LA MAGIA! ---
    // Función para conectarse al WebSocket y escuchar
    const connectWebSocket = () => {
      // (Tu amigo te dará la URL correcta)
      const socket = new WebSocket(`${API_BASE_URL_WS}/api/v1/notifications/subscribe`);

      // Cuando el socket se abre
      socket.onopen = () => {
        console.log('Conectado al WebSocket de notificaciones');
        // Opcional: enviar el token para autenticar la conexión
        // socket.send(JSON.stringify({ token: localStorage.getItem('access_token') }));
      };

      // Cuando RECIBIMOS un mensaje del servidor
      socket.onmessage = (event) => {
        const newNotification = JSON.parse(event.data);
        console.log('¡Nueva notificación recibida!:', newNotification);
        
        // Añadimos la nueva notificación AL PRINCIPIO de la lista
        setNotifications(prevNotifications => [newNotification, ...prevNotifications]);
      };

      // Manejo de errores
      socket.onerror = (err) => {
        console.error('Error de WebSocket:', err);
      };

      // Cuando la conexión se cierra (importante para limpiar)
      socket.onclose = () => {
        console.log('Desconectado del WebSocket');
      };

      // Función de limpieza: se ejecuta cuando el componente se "desmonta"
      return () => {
        socket.close();
      };
    };

    // Ejecutamos ambas funciones al cargar la página
    fetchNotifications();
    // const wsCleanup = connectWebSocket(); // <-- ¡Descomenta esto cuando tu amigo tenga el link!

    // return () => {
    //   wsCleanup(); // Limpia el WebSocket cuando sales de la página
    // };

  }, []); // El array vacío [] hace que se ejecute solo una vez

  // --- 4. Renderizado ---

  if (loading) {
    return <div className="page-content"><h1>Cargando notificaciones...</h1></div>;
  }

  if (error) {
    return <div className="page-content"><p className="auth-error-message">{error}</p></div>;
  }

  return (
    <div className="page-content">
      <h1>Notificaciones</h1>
      
      <ul className="notification-list">
        {/* Si no hay notificaciones, muestra un mensaje */}
        {notifications.length === 0 ? (
          <p>No tienes notificaciones nuevas.</p>
        ) : (
          // Mapeamos las notificaciones del 'useState'
          notifications.map(noti => (
            <li className={`notification-item ${!noti.is_read ? 'unread' : ''}`} key={noti.id}>
              <i className={`fa-solid ${noti.icon || 'fa-bell'} ${noti.icon_class || 'icon-community'}`}></i>
              <div className="notification-details">
                {/* Asumimos que el backend nos da 'message' y 'timestamp' */}
                <p>{noti.message}</p>
                <span className="timestamp">{noti.timestamp}</span>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default Notifications;