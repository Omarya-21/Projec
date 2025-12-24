import React from 'react';
import '../styles/Home.css';

function Home() {
  return (
    <main className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to PC Parts Shop</h1>
          <p>Build your dream PC with our premium components</p>
        </div>
      </section>
      
      <section className="description">
        <div className="container">
          <h2>Website Description</h2>
          <p>This website helps users explore, choose, and add different PC parts to a cart for building a custom PC.</p>
        </div>
      </section>
      
      <section className="about">
        <div className="container">
          <h2>About the Creator</h2>
          <p>Created by <strong>Omar Yammine</strong></p>
        </div>
      </section>
    </main>
  );
}

export default Home;