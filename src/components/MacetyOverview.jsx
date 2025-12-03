import React from 'react';

function MacetyOverview({ stats = {} }) {
  return (
    <div className="macety-overview">
      <h2 className="section-title"><i className="fa-solid fa-robot"></i> Macety</h2>
      <div className="macety-grid">
        <div className="macety-card">
          <h3>{stats.users || 1245}</h3>
          <p>Usuarios</p>
        </div>
        <div className="macety-card">
          <h3>{stats.devicesOnline || 8}</h3>
          <p>Dispositivos en línea</p>
        </div>
        <div className="macety-card">
          <h3>{stats.activeSubs || 342}</h3>
          <p>Suscripciones activas</p>
        </div>
        <div className="macety-card">
          <h3>{stats.supportTickets || 3}</h3>
          <p>Tickets abiertos</p>
        </div>
      </div>
      <div className="macety-cta">
        <p>¿Quieres Macety Pro? Mejora tu experiencia con backups en la nube y soporte prioritario.</p>
        <button className="btn-primary">Conoce Macety Pro</button>
      </div>
    </div>
  );
}

export default MacetyOverview;
