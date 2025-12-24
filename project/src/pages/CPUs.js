import React from 'react';
import { useCart } from '../context/CartContext';
import '../styles/CPUs.css';

function CPUs() {
  const { addToCart } = useCart();

  const products = [
    { id: 1, name: 'Intel Core i9-14900K', price: 589, specs: '24 Cores, 32 Threads, 6.0GHz' },
    { id: 2, name: 'AMD Ryzen 9 7950X', price: 699, specs: '16 Cores, 32 Threads, 5.7GHz' },
    { id: 3, name: 'Intel Core i7-14700K', price: 419, specs: '20 Cores, 28 Threads, 5.6GHz' },
    { id: 4, name: 'AMD Ryzen 7 7800X3D', price: 449, specs: '8 Cores, 16 Threads, 5.0GHz' }
  ];

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  return (
    <main className="cpus-page">
      <div className="container">
        <section className="page-header">
          <h1>Processors (CPUs)</h1>
          <p>High-performance processors for gaming and productivity</p>
        </section>
        
        <section className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <div className="image-placeholder">CPU</div>
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

export default CPUs;