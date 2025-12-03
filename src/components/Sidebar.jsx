import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom'; 
import defaultAvatar from '../assets/user_avatar.png'; 

function Sidebar() {
  const [userName, setUserName] = useState('Usuario');
  const [userAvatar, setUserAvatar] = useState(defaultAvatar);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const userString = localStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        setUserName(user.first_name || user.name || 'Usuario');
        setUserAvatar(user.avatar_url || defaultAvatar);
      }
    } catch (e) {
      console.error("Error al leer el usuario del localStorage", e);
    }
  }, []);

  return (
    <nav className="sidebar">
      <div className="sidebar-profile">
        <img src={userAvatar} alt="Avatar" className="sidebar-avatar" />
        <span className="sidebar-username">{userName}</span>
      </div>
      
      <div className="sidebar-links">
        {/* Enlace a la página principal */}
        <NavLink to="/" end className="sidebar-link">
          <i className="fa-solid fa-leaf"></i>
          <span>Mis plantas</span>
        </NavLink>

        {/* Botón para agregar plantas - como NavLink */}
        <NavLink 
          to="/add-plant/step-1" 
          className="sidebar-link sidebar-add-plant-link"
        >
          <div className="add-icon">
            <i className="fa-solid fa-plus"></i>
          </div>
          <span>Añadir planta</span>
        </NavLink>
        <NavLink to="/store" className="sidebar-link">
          <i className="fa-solid fa-store"></i>
          <span>Tienda</span>
        </NavLink>
        <NavLink to="/comunidad" className="sidebar-link">
          <i className="fa-solid fa-users"></i>
          <span>Comunidad</span>cc 
        </NavLink>

        

       
        
          {/* Enlace a perfil */}
          <NavLink to="/profile" className="sidebar-link">
            <i className="fa-solid fa-user"></i>
            <span>Perfil</span>
          </NavLink>
          
        
      </div>
    </nav>
  );
}

export default Sidebar;