import React, { useState } from 'react';

function MacetyOverview({ stats = {} }) {
  const [showProModal, setShowProModal] = useState(false);

  const statItems = [
    { value: stats.users || 1245, label: 'Usuarios', icon: 'fa-solid fa-users', color: '#4CAF50' },
    { value: stats.devicesOnline || 8, label: 'Dispositivos en línea', icon: 'fa-solid fa-wifi', color: '#2196F3' },
    { value: stats.activeSubs || 342, label: 'Suscripciones activas', icon: 'fa-solid fa-crown', color: '#FF9800' },
    { value: stats.supportTickets || 3, label: 'Tickets abiertos', icon: 'fa-solid fa-ticket', color: '#9C27B0' },
  ];

  const proFeatures = [
    { icon: 'fa-solid fa-brain', title: 'IA Inteligente', description: 'Análisis predictivo del estado de tus plantas con Machine Learning', color: '#9C27B0' },
    { icon: 'fa-solid fa-droplet', title: 'Riego Automático', description: 'Programa riegos automáticos basados en las necesidades de cada planta', color: '#2196F3' },
    { icon: 'fa-solid fa-cloud', title: 'Backup en la Nube', description: 'Tus datos siempre seguros con sincronización automática', color: '#00BCD4' },
    { icon: 'fa-solid fa-headset', title: 'Soporte Prioritario', description: 'Atención personalizada 24/7 por expertos en jardinería', color: '#4CAF50' },
    { icon: 'fa-solid fa-chart-line', title: 'Análisis Avanzado', description: 'Estadísticas detalladas y predicciones de crecimiento', color: '#FF9800' },
    { icon: 'fa-solid fa-bell', title: 'Alertas Inteligentes', description: 'Notificaciones proactivas antes de que surjan problemas', color: '#E91E63' },
  ];

  return (
    <div className="macety-overview">
      <style>{`
        .pro-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease-out;
          padding: 1rem;
        }
        .pro-modal {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border-radius: 24px;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          animation: slideUp 0.3s ease-out;
          position: relative;
        }
        .pro-modal-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
          text-align: center;
          border-radius: 24px 24px 0 0;
          position: relative;
        }
        .pro-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255,255,255,0.2);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          color: #fff;
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }
        .pro-modal-header h2 {
          color: #fff;
          margin: 0 0 0.5rem;
          font-size: 1.75rem;
        }
        .pro-modal-header p {
          color: rgba(255,255,255,0.8);
          margin: 0;
          font-size: 1rem;
        }
        .pro-close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255,255,255,0.2);
          border: none;
          color: #fff;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.25rem;
          display: grid;
          place-items: center;
          transition: background 0.2s;
        }
        .pro-close-btn:hover {
          background: rgba(255,255,255,0.3);
        }
        .pro-modal-body {
          padding: 2rem;
        }
        .pro-features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        @media (max-width: 500px) {
          .pro-features-grid {
            grid-template-columns: 1fr;
          }
        }
        .pro-feature-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 1.25rem;
          transition: transform 0.2s, background 0.2s;
        }
        .pro-feature-card:hover {
          transform: translateY(-2px);
          background: rgba(255,255,255,0.08);
        }
        .pro-feature-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          font-size: 1.25rem;
          margin-bottom: 0.75rem;
        }
        .pro-feature-card h4 {
          color: #fff;
          margin: 0 0 0.5rem;
          font-size: 1rem;
        }
        .pro-feature-card p {
          color: rgba(255,255,255,0.6);
          margin: 0;
          font-size: 0.85rem;
          line-height: 1.4;
        }
        .pro-modal-footer {
          padding: 1.5rem 2rem 2rem;
          text-align: center;
        }
        .pro-price {
          color: #fff;
          margin-bottom: 1rem;
        }
        .pro-price .amount {
          font-size: 2.5rem;
          font-weight: 700;
        }
        .pro-price .period {
          color: rgba(255,255,255,0.6);
          font-size: 1rem;
        }
        .btn-subscribe {
          width: 100%;
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 12px;
          color: #fff;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .btn-subscribe:hover {
          transform: scale(1.02);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
        }
        .pro-guarantee {
          color: rgba(255,255,255,0.5);
          font-size: 0.8rem;
          margin-top: 1rem;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>

      <h2 className="section-title"><i className="fa-solid fa-chart-line"></i> Resumen</h2>
      <div className="macety-grid">
        {statItems.map((item, index) => (
          <div className="macety-card" key={index}>
            <div className="macety-card-icon" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
              <i className={item.icon}></i>
            </div>
            <div className="macety-card-content">
              <h3>{item.value}</h3>
              <p>{item.label}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="macety-cta">
        <div className="cta-content">
          <i className="fa-solid fa-gem cta-icon"></i>
          <div>
            <h4>¿Quieres Macety Pro?</h4>
            <p>Desbloquea IA inteligente, riego automático y mucho más.</p>
          </div>
        </div>
        <button className="btn-primary btn-cta" onClick={() => setShowProModal(true)}>
          <i className="fa-solid fa-sparkles"></i> Conoce Macety Pro
        </button>
      </div>

      {showProModal && (
        <div className="pro-modal-overlay" onClick={() => setShowProModal(false)}>
          <div className="pro-modal" onClick={e => e.stopPropagation()}>
            <div className="pro-modal-header">
              <button className="pro-close-btn" onClick={() => setShowProModal(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
              <div className="pro-badge">
                <i className="fa-solid fa-crown"></i>
                PRO
              </div>
              <h2>Macety Pro</h2>
              <p>El cuidado inteligente para tus plantas</p>
            </div>
            
            <div className="pro-modal-body">
              <div className="pro-features-grid">
                {proFeatures.map((feature, index) => (
                  <div className="pro-feature-card" key={index}>
                    <div className="pro-feature-icon" style={{ backgroundColor: `${feature.color}20`, color: feature.color }}>
                      <i className={feature.icon}></i>
                    </div>
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pro-modal-footer">
              <div className="pro-price">
                <span className="amount">$9.99</span>
                <span className="period">/mes</span>
              </div>
              <button className="btn-subscribe">
                <i className="fa-solid fa-rocket"></i>
                Comenzar prueba gratis de 7 días
              </button>
              <p className="pro-guarantee">
                <i className="fa-solid fa-shield-check"></i> Cancela cuando quieras, sin compromiso
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MacetyOverview;
