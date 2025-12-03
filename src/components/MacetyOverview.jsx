import React from 'react';

function MacetyOverview({ stats = {} }) {
  const statItems = [
    { value: stats.users || 1245, label: 'Usuarios', icon: 'fa-solid fa-users', color: '#4CAF50' },
    { value: stats.devicesOnline || 8, label: 'Dispositivos en línea', icon: 'fa-solid fa-wifi', color: '#2196F3' },
    { value: stats.activeSubs || 342, label: 'Suscripciones activas', icon: 'fa-solid fa-crown', color: '#FF9800' },
    { value: stats.supportTickets || 3, label: 'Tickets abiertos', icon: 'fa-solid fa-ticket', color: '#9C27B0' },
  ];

  return (
    <div className="macety-overview">
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
            <p>Mejora tu experiencia con backups en la nube y soporte prioritario.</p>
          </div>
        </div>
        <button className="btn-primary btn-cta">Conoce Macety Pro</button>
      </div>
    </div>
  );
}

export default MacetyOverview;
