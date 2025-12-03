import React, { useState, useEffect } from 'react'; // <-- 1. Importamos hooks
import './Community.css';

// --- (Importaciones de Imágenes) ---
import avatarSofia from '../assets/avatar_sofia.png';
import avatarCarlos from '../assets/avatar_sofia.png'; // (Deberías cambiar esto por los avatares correctos)
import avatarAna from '../assets/avatar_sofia.png';
import avatarJavier from '../assets/avatar_sofia.png';
import featuredSuculentas from '../assets/sustrato_suculentas.jpg';
import featuredRiego from '../assets/plant_ficus.jfif';

// --- URLs (Placeholders para tu backend) ---
const FEATURED_POSTS_API_URL = 'http://localhost:8081/api/v1/community/featured';
const ALL_POSTS_API_URL = 'http://localhost:8081/api/v1/community/posts';

// --- Datos de ejemplo (Estado inicial) ---
const mockFeaturedPosts = [
  {
    id: 1,
    title: 'Consejos para el cuidado de suculentas',
    description: 'Aprende los mejores métodos...',
    image: featuredSuculentas
  },
  {
    id: 2,
    title: 'Preguntas frecuentes sobre el riego',
    description: 'Resuelve tus dudas sobre la frecuencia...',
    image: featuredRiego
  }
];
const mockAllPosts = [
  {
    id: 1,
    user: { name: 'Sofía García', avatar: avatarSofia },
    timestamp: 'Hace 2 días',
    text: 'Mi planta está mostrando hojas amarillas...',
    comments: 12,
    likes: 2
  },
  // ... (tus otros posts de ejemplo)
];

// --- Componente de la Página ---
function Community() {
  // --- 2. USAMOS useState PARA LOS DATOS ---
  const [featuredPosts, setFeaturedPosts] = useState(mockFeaturedPosts);
  const [allPosts, setAllPosts] = useState(mockAllPosts);
  const [loading, setLoading] = useState(false); // Empezamos en 'false' para ver los mocks
  const [error, setError] = useState(null);
  
  // --- 3. AQUÍ IRÁ LA LÓGICA DE LA API ---
  useEffect(() => {
    
    const fetchCommunityData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          throw new Error('No estás autenticado. Por favor, inicia sesión.');
        }

        // Pedir posts destacados (cuando el link exista)
        const featuredRes = await fetch(FEATURED_POSTS_API_URL, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!featuredRes.ok) throw new Error('Error al cargar posts destacados');
        const featuredData = await featuredRes.json();
        
        // Pedir todos los posts (cuando el link exista)
        const allPostsRes = await fetch(ALL_POSTS_API_URL, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!allPostsRes.ok) throw new Error('Error al cargar los posts');
        const allPostsData = await allPostsRes.json();

        // Actualizar el estado con datos reales
        setFeaturedPosts(featuredData);
        setAllPosts(allPostsData);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // --- ¡Cuando tu amigo cree los links, solo borra las '//' de abajo! ---
    // fetchCommunityData();

  }, []); // Se ejecuta solo una vez al cargar

  
  // --- 4. RENDERIZADO CON ESTADOS DE CARGA Y ERROR ---
  if (loading) {
    return <div className="page-content"><h1>Cargando comunidad...</h1></div>;
  }
  
  // Usamos el estilo de error de 'auth-error-message' que ya existe
  if (error) {
    return <div className="page-content"><p className="auth-error-message">{error}</p></div>;
  }
  
  // Renderizado normal (usa los datos de 'useState')
  return (
    <div className="community-page">
      {/* 1. Cabecera */}
      <h1 className="community-title">Comunidad</h1>
      <p className="community-subtitle">Comparte consejos, haz preguntas y conéctate con otros entusiastas de las plantas.</p>
      
      {/* 2. Barra de Búsqueda */}
      <div className="community-search-bar">
        <i className="fa-solid fa-search"></i>
        <input type="text" placeholder="Buscar temas" />
      </div>

      {/* 3. Publicaciones Destacadas */}
      <section className="featured-posts-section">
        <h2>Publicaciones destacadas</h2>
        <div className="featured-posts-grid">
          {featuredPosts.map(post => (
            <div className="featured-post-card" key={post.id}>
              <div className="featured-post-info">
                <h3>{post.title}</h3>
                <p>{post.description}</p>
              </div>
              <img src={post.image} alt={post.title} className="featured-post-image" />
            </div>
          ))}
        </div>
      </section>

      {/* 4. Todas las Publicaciones */}
      <section className="all-posts-section">
        <h2>Todas las publicaciones</h2>
        <div className="post-feed">
          {allPosts.map(post => (
            <div className="post-item" key={post.id}>
              <img src={post.user.avatar} alt={post.user.name} className="post-avatar" />
              <div className="post-body">
                <div className="post-header">
                  <span className="post-user-name">{post.user.name}</span>
                  <span className="post-timestamp">{post.timestamp}</span>
                </div>
                <p className="post-content">{post.text}</p>
                <div className="post-actions">
                  <button className="action-btn"><i className="fa-solid fa-comment"></i> {post.comments}</button>
                  <button className="action-btn"><i className="fa-solid fa-thumbs-up"></i> {post.likes}</button>
                  <button className="action-btn"><i className="fa-solid fa-thumbs-down"></i></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default Community;