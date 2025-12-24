import React from 'react';
import { useCart } from '../context/CartContext';
import '../styles/Cart.css';

function Cart() {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal 
  } = useCart();

  const handleUpdateQuantity = (id, newQuantity) => {
    updateQuantity(id, newQuantity);
  };

  const handleRemoveItem = (id) => {
    removeFromCart(id);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  const subtotal = getCartTotal();
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <main className="cart-page">
      <div className="container">
        <section className="page-header">
          <h1>Shopping Cart</h1>
          <p>Review your selected items</p>
        </section>

        <div className="cart-content">
          <div className="cart-items">
            {cart.items.length === 0 ? (
              <div className="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Add some products to get started!</p>
              </div>
            ) : (
              <>
                <div className="cart-header">
                  <h2>Cart Items ({cart.items.length})</h2>
                  <button className="clear-cart-btn" onClick={handleClearCart}>
                    Clear Cart
                  </button>
                </div>
                {cart.items.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="item-info">
                      <h3>{item.name}</h3>
                      <p className="item-specs">{item.specs}</p>
                      <span className="item-price">${item.price}</span>
                    </div>
                    <div className="item-controls">
                      <div className="quantity-controls">
                        <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                      <span className="item-total">${(item.price * item.quantity).toFixed(2)}</span>
                      <button 
                        className="remove-btn"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {cart.items.length > 0 && (
            <div className="cart-summary">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>$0.00</span>
              </div>
              <div className="summary-row">
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button className="checkout-btn">Proceed to Checkout</button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Cart;