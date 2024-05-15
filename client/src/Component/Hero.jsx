import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import hero from '../assets/hero.png';
export default function Hero() {
  return (
    <div>
      <Navbar />
      <style>
        {`
          .button-hero {
            padding: 10px 20px;
            font-size: 1em;
            background-color: #16a085;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }
          .button-hero:hover {
            color: #16a085;
            background-color: #c3eae2;
          }
        `}
      </style>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
         
          minHeight: '100vh',
          backgroundColor: '#f0f8f8'
        }}
      >
        <div
          style={{
            display: 'flex',
            flex: '1',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            padding: '50px'
          }}
        >
          <div style={{ flex: '1', padding: '20px' }}>
            <h1 className='color' style={{
              fontSize: '3em',
              marginBottom: '20px',
              fontWeight: 'bold'
            }}>
              Welcome
            </h1>
            <p style={{ fontSize: '1.5em', marginBottom: '40px' }}>
              Welcome to <strong style={{color: '#16a085'}}>Connectify</strong>, your new web-based social media app. Stay connected with friends and family, share your moments, and explore new connections.
            </p>
           
            <button-hero className="button-hero" >
                <strong>
              Get Started
              </strong>
            </button-hero>
          </div>
          <div style={{ flex: '1', textAlign: 'center' }}>
            <img src={hero} alt="Hero" style={{ maxWidth: '100%', height: 'auto' }} />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
