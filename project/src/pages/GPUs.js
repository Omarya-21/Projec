import React from 'react';
import { useCart } from '../context/CartContext';
import '../styles/GPUs.css';

function GPUs() {
  const { addToCart } = useCart();

  const products = [
    { id: 5, name: 'NVIDIA RTX 4090', price: 1599, specs: '24GB GDDR6X, 16384 Cores' },
    { id: 6, name: 'AMD RX 7900 XTX', price: 999, specs: '24GB GDDR6, 6144 Stream Processors' },
    { id: 7, name: 'NVIDIA RTX 4080', price: 1199, specs: '16GB GDDR6X, 9728 Cores' },
    { id: 8, name: 'AMD RX 7800 XT', price: 499, specs: '16GB GDDR6, 3840 Stream Processors' }
  ];

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  return (
    <main className="gpus-page">
      <div className="container">
        <section className="page-header">
          <h1>Graphics Cards (GPUs)</h1>
          <p>Powerful graphics cards for gaming and content creation</p>
        </section>
        
        <section className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <div className="image-placeholder">GPU</div>
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

export default GPUs;