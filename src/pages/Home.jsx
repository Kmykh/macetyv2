import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PlantCard from '../components/PlantCard';
import RecentActivity from '../components/RecentActivity';
import Store from '../components/Store';
import Community from '../components/Community';
import MacetyOverview from '../components/MacetyOverview';
import './Home.css';
import { API_BASE_URL } from '../config';

const mockActivities = [
  { id: 1, text: 'Ficus fue regada con 77ml', timestamp: 'Hace 2 horas' },
  { id: 2, text: 'Palma: exposición a luz directa detectada', timestamp: 'Hace 5 horas' },
];

const mockProducts = [
  { id: 'p1', name: 'Sustrato Universal 2kg', description: 'Mezcla rica en nutrientes para uso diario.', price: '8.99', image: '/src/assets/sustrato_universal.jfif' },
  { id: 'p2', name: 'Soporte Ajustable', description: 'Soporte ajustable con drenaje.', price: '14.50', image: '/src/assets/soporte_ajustable.jfif' },
  { id: 'p3', name: 'Taller Jardinería', description: 'Acceso a taller online: cuidados básicos.', price: '25.00', image: '/src/assets/talleres_jardineria.jfif' },
];

const mockPosts = [
  { id: 'c1', author: 'María', time: 'Hace 1h', content: '¿Alguien recomienda sustrato para suculentas?', likes: 12, comments: 3 },
  { id: 'c2', author: 'Carlos', time: 'Ayer', content: 'Mi Ficus reaccionó muy bien al cambio de maceta.', likes: 8, comments: 1 },
  { id: 'c3', author: 'Ana', time: '2 días', content: 'Comparte foto de tu rincón verde 🌿', likes: 20, comments: 5 },
];

function Home() {
  const navigate = useNavigate();
  const [plants, setPlants] = useState([]);
  const [userName, setUserName] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        setUserName(user.first_name || user.name);
      } catch (e) { console.error('Error parsing user', e); }
    }

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('access_token');
        if (!token) { navigate('/login'); return; }

        const plantsResponse = await fetch(`${API_BASE_URL}/api/v1/plants`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (plantsResponse.status === 401) { localStorage.clear(); navigate('/login'); return; }
        const plantsData = await plantsResponse.json();

        const plantsWithSensors = await Promise.all(
          plantsData.map(async (plant) => {
            try {
              const sensorRes = await fetch(`${API_BASE_URL}/api/v1/plants/${plant.id}/sensor/latest`, {
                headers: { 'Authorization': `Bearer ${token}` }
              });
              if (sensorRes.ok) {
                const sensorData = await sensorRes.json();
                return { ...plant, sensorData };
              }
              return plant;
            } catch (e) {
              console.error(`Error sensor planta ${plant.id}`, e);
              return plant;
            }
          })
        );

        setPlants(plantsWithSensors);

      } catch (err) {
        console.error(err);
        setPlants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) return <div className="home-dashboard"><div className="dashboard-message"><p>Cargando tu jardín...</p></div></div>;

  const macetyStats = { users: 1245, devicesOnline: 8, activeSubs: 342, supportTickets: 3 };

  return (
    <div className="home-dashboard">
      <div className="dashboard-header">
        <h1>El Jardín de {userName || 'Usuario'}</h1>
        <p>{plants.length} {plants.length === 1 ? 'planta monitoreada' : 'plantas monitoreadas'}</p>
      </div>

      <MacetyOverview stats={macetyStats} />

      <Community posts={mockPosts} />

      <Store products={mockProducts} />

      {plants.length === 0 ? (
        <div className="empty-state-card">
          <i className="fa-solid fa-seedling empty-icon"></i>
          <h3>¡Tu jardín está vacío!</h3>
          <p>Añade una planta para comenzar.</p>
        </div>
      ) : (
        <>
          <h2 className="section-title"><i className="fa-solid fa-leaf"></i> Mis Plantas</h2>
          <div className="plant-grid">
            {plants.map(plant => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        </>
      )}

      <div className="recent-activity-section">
        <h2 className="activity-header"><i className="fa-solid fa-clock-rotate-left"></i> Actividad Reciente</h2>
        <RecentActivity activities={mockActivities} />
      </div>
    </div>
  );
}

export default Home;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PlantCard from '../components/PlantCard';
import RecentActivity from '../components/RecentActivity';
import './Home.css';
import { API_BASE_URL } from '../config';

const mockActivities = [
  { id: 1, text: 'Ficus fue regada con 77ml', timestamp: '3/10/2025 10:21 p.m.' },
];

function Home() {
  const navigate = useNavigate();
  const [plants, setPlants] = useState([]);
  const [userName, setUserName] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar usuario
    const userString = localStorage.getItem('user');
    if (userString) {
        try {
            const user = JSON.parse(userString);
            setUserName(user.first_name || user.name);
        } catch(e) { console.error("Error parsing user", e); }
    }

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('access_token');
        if (!token) { navigate('/login'); return; }

        // 1. Obtener lista de plantas
        const plantsResponse = await fetch(`${API_BASE_URL}/api/v1/plants`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (plantsResponse.status === 401) { localStorage.clear(); navigate('/login'); return; }
        
        const plantsData = await plantsResponse.json();

        // 2. Obtener DATOS DE SENSORES (en paralelo para cada planta)
        const plantsWithSensors = await Promise.all(
          plantsData.map(async (plant) => {
            try {
              // Llamada al endpoint: /api/v1/plants/{id}/sensor/latest
              const sensorRes = await fetch(`${API_BASE_URL}/api/v1/plants/${plant.id}/sensor/latest`, {
                headers: { 'Authorization': `Bearer ${token}` }
              });
              
              if (sensorRes.ok) {
                const sensorData = await sensorRes.json();
                // Inyectamos los datos del sensor dentro del objeto planta
                return { ...plant, sensorData }; 
              }
              return plant; // Si no hay sensor, devolvemos la planta normal
            } catch (e) {
              console.error(`Error sensor planta ${plant.id}`, e);
              return plant;
            }
          })
        );

        setPlants(plantsWithSensors);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) return <div className="home-dashboard"><div className="dashboard-message"><p>Cargando tu jardín...</p></div></div>;

  return (
    <div className="home-dashboard">
      <div className="dashboard-header">
        <h1>El Jardín de {userName || 'Usuario'}</h1>
        <p>{plants.length} {plants.length === 1 ? 'planta monitoreada' : 'plantas monitoreadas'}</p>
      </div>
      
      {plants.length === 0 ? (
        <div className="empty-state-card">
           <i className="fa-solid fa-seedling empty-icon"></i>
           <h3>¡Tu jardín está vacío!</h3>
           <p>Añade una planta para comenzar.</p>
        </div>
      ) : (
        <div className="plant-grid">
          {plants.map(plant => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      )}

      
    </div>
  );
}

export default Home;