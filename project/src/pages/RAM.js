import React from 'react';
import { useCart } from '../context/CartContext';
import '../styles/RAM.css';

function RAM() {
  const { addToCart } = useCart();

  const products = [
    { id: 9, name: 'Corsair Vengeance RGB 32GB', price: 129, specs: 'DDR5 6000MHz, CL30' },
    { id: 10, name: 'G.Skill Trident Z5 64GB', price: 249, specs: 'DDR5 6400MHz, CL32' },
    { id: 11, name: 'Kingston Fury Beast 16GB', price: 79, specs: 'DDR5 5600MHz, CL36' },
    { id: 12, name: 'TeamGroup T-Force 32GB', price: 109, specs: 'DDR5 6000MHz, CL38' }
  ];

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  return (
    <main className="ram-page">
      <div className="container">
        <section className="page-header">
          <h1>Memory (RAM)</h1>
          <p>High-speed memory for optimal system performance</p>
        </section>
        
        <section className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <div className="image-placeholder">RAM</div>
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

export default RAM;