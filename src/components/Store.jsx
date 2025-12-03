import React from 'react';

function Store({ products = [] }) {
  return (
    <div className="store-section">
      <h2 className="section-title"><i className="fa-solid fa-shop"></i> Tienda</h2>
      <div className="store-grid">
        {products.map((p) => (
          <div className="store-card" key={p.id}>
            <img src={p.image} alt={p.name} className="store-image" />
            <div className="store-body">
              <h4 className="store-name">{p.name}</h4>
              <p className="store-desc">{p.description}</p>
              <div className="store-footer">
                <span className="store-price">${p.price}</span>
                <button className="btn-primary">Agregar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Store;
