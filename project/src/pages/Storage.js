import React from 'react';
import { useCart } from '../context/CartContext';
import '../styles/Storage.css';

function Storage() {
  const { addToCart } = useCart();

  const products = [
    { id: 13, name: 'Samsung 990 Pro 2TB', price: 179, specs: 'NVMe PCIe 4.0, 7450MB/s Read' },
    { id: 14, name: 'WD Black SN850X 4TB', price: 299, specs: 'NVMe PCIe 4.0, 7300MB/s Read' },
    { id: 15, name: 'Crucial P5 Plus 1TB', price: 89, specs: 'NVMe PCIe 4.0, 6600MB/s Read' },
    { id: 16, name: 'Seagate FireCuda 8TB', price: 199, specs: 'HDD, 7200RPM, 256MB Cache' }
  ];

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  return (
    <main className="storage-page">
      <div className="container">
        <section className="page-header">
          <h1>Storage Solutions</h1>
          <p>SSD and HDD storage for all your needs</p>
        </section>
        
        <section className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <div className="image-placeholder">SSD/HDD</div>
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

export default Storage;