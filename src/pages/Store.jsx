import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext'; // <-- 1. Importa el hook del carrito
import './Store.css';

// --- Tus datos de ejemplo (completos) ---
const allProducts = {
  macetas: [
    { id: 'p1', title: 'MaceTy Pro', description: 'La maceta inteligente definitiva para el cuidado de plantas interior.' },
    { id: 'p2', title: 'MaceTy Mini', description: 'Perfecta para espacios pequeños, ideal para principiantes.' },
    { id: 'p3', title: 'MaceTy Air', description: 'Diseño minimalista, control total sobre el sistema de nutrientes.' },
  ],
  accesorios: [
    { id: 'a1', title: 'Sensor de Humedad', description: 'Monitorea la humedad del suelo en tiempo real.' },
    { id: 'a2', title: 'Luz de Crecimiento LED', description: 'Proporciona la luz óptima para el crecimiento de tus plantas.' },
    { id: 'a3', title: 'Soporte Ajustable', description: 'Ajusta la altura de tu maceta para adaptarse al crecimiento.' },
  ],
  sustratos: [
    { id: 's1', title: 'Sustrato Universal', description: 'Ideal para la mayoría de las plantas de interior.' },
    { id: 's2', title: 'Sustrato para Suculentas', description: 'Drenante formulado para suculentas y cactus.' },
    { id: 's3', title: 'Sustrato para Orquídeas', description: 'Mezcla aireada para el desarrollo de las raíces.' },
  ],
  cuidado: [
    { id: 'c1', title: 'Asesoría Personalizada', description: 'Obtén recomendaciones específicas para tus plantas.' },
    { id: 'c2', title: 'Planes de Cuidado Mensual', description: 'Deja el cuidado de tus plantas en manos expertas.' },
    { id: 'c3', title: 'Talleres de Jardinería', description: 'Aprende nuevas técnicas de jardinería con expertos.' },
  ]
};
// --- Fin de datos ---

function Store() {
  const [activeTab, setActiveTab] = useState('todo'); 
  const [searchTerm, setSearchTerm] = useState(''); // <-- 2. NUEVO ESTADO PARA BUSCAR
  const { cartItems } = useCart(); // <-- 3. TRAE LOS ITEMS DEL CARRITO

  // Calcula el total de items en el carrito (sumando cantidades)
  const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);

  // --- 4. NUEVA LÓGICA DE FILTRADO ---
  const filterProducts = (products) => {
    if (searchTerm === '') return products; // Si no hay búsqueda, devuelve todo
    // Devuelve solo productos cuyo título incluya el término de búsqueda
    return products.filter(p => 
      p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Obtenemos las listas de productos ya filtradas
  const filteredMacetas = filterProducts(allProducts.macetas);
  const filteredAccesorios = filterProducts(allProducts.accesorios);
  const filteredSustratos = filterProducts(allProducts.sustratos);
  const filteredServicios = filterProducts(allProducts.cuidado);

  return (
    <div className="store-page">
      {/* 1. Cabecera (Search y Cart) */}
      <div className="store-header">
        <div className="search-wrapper">
          <i className="fa-solid fa-search"></i>
          {/* --- 5. CONECTA EL INPUT DE BÚSQUEDA --- */}
          <input 
            type="text" 
            placeholder="Buscar productos..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="cart-button">
          <i className="fa-solid fa-shopping-cart"></i>
          {/* --- 6. MUESTRA EL NÚMERO DE ITEMS --- */}
          {totalItemsInCart > 0 && (
            <span className="cart-badge">{totalItemsInCart}</span>
          )}
        </button>
      </div>
      
      {/* 2. Navegación Secundaria (sin cambios) */}
      <nav className="store-nav">
        <button className={`store-nav-link ${activeTab === 'todo' ? 'active' : ''}`} onClick={() => setActiveTab('todo')}>Todo</button>
        <button className={`store-nav-link ${activeTab === 'macetas' ? 'active' : ''}`} onClick={() => setActiveTab('macetas')}>Macetas Inteligentes</button>
        <button className={`store-nav-link ${activeTab === 'accesorios' ? 'active' : ''}`} onClick={() => setActiveTab('accesorios')}>Accesorios</button>
        <button className={`store-nav-link ${activeTab === 'sustratos' ? 'active' : ''}`} onClick={() => setActiveTab('sustratos')}>Sustratos</button>
        <button className={`store-nav-link ${activeTab === 'cuidado' ? 'active' : ''}`} onClick={() => setActiveTab('cuidado')}>Cuidado de Plantas</button>
      </nav>
      
      {/* 3. Secciones de Productos (AHORA USA LOS PRODUCTOS FILTRADOS) */}
      <div className="store-content">
                
        {(activeTab === 'todo' || activeTab === 'macetas') && (
          <section id="macetas" className="store-section">
            <h2>Tienda MaceTy</h2>
            <div className="product-grid">
              {filteredMacetas.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
          </section>
        )}
        
        {(activeTab === 'todo' || activeTab === 'accesorios') && (
          <section id="accesorios" className="store-section">
            <h2>Descubre nuestros accesorios</h2>
            <div className="product-grid">
              {filteredAccesorios.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
          </section>
        )}
        
        {(activeTab === 'todo' || activeTab === 'sustratos') && (
          <section id="sustratos" className="store-section">
            <h2>Sustratos recomendados</h2>
            <div className="product-grid">
              {filteredSustratos.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
          </section>
        )}
        
        {(activeTab === 'todo' || activeTab === 'cuidado') && (
          <section id="cuidado" className="store-section">
            <h2>Servicios de cuidado de plantas</h2>
            <div className="product-grid">
              {filteredServicios.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default Store;