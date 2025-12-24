import React from 'react';
import { useCart } from '../context/CartContext';
import '../styles/PowerSupplies.css';

function PowerSupplies() {
  const { addToCart } = useCart();

  const products = [
    { id: 17, name: 'Corsair RM850x', price: 149, specs: '850W, 80+ Gold, Fully Modular' },
    { id: 18, name: 'Seasonic Prime TX-1000', price: 249, specs: '1000W, 80+ Titanium, Fully Modular' },
    { id: 19, name: 'EVGA SuperNOVA 750 G6', price: 129, specs: '750W, 80+ Gold, Fully Modular' },
    { id: 20, name: 'be quiet! Straight Power 11', price: 139, specs: '850W, 80+ Platinum, Fully Modular' }
  ];

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  return (
    <main className="psu-page">
      <div className="container">
        <section className="page-header">
          <h1>Power Supplies</h1>
          <p>Reliable power for your high-end components</p>
        </section>
        
        <section className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <div className="image-placeholder">PSU</div>
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="specs">{product.specs}</p>
                <div className="product-footer">
                  <span className="price">${product.price}</span>
                  <button 
                    className="add-to-cart"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}

export default PowerSupplies;