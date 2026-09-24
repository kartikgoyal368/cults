'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [modalContent, setModalContent] = useState<{ title: string; body: string } | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail('');
      }, 3000);
    }
  };

  const openPolicyModal = (type: 'shipping' | 'returns' | 'terms') => {
    if (type === 'shipping') {
      setModalContent({
        title: 'FREE EXPRESS SHIPPING & DISPATCH',
        body: 'All orders across India are shipped via BlueDart and Delhivery Express. Orders placed before 2:00 PM IST are dispatched on the same business day. Delivery timeline is 2 to 4 business days with real-time SMS tracking updates.',
      });
    } else if (type === 'returns') {
      setModalContent({
        title: '7-DAY HASSLE-FREE RETURNS & EXCHANGES',
        body: 'We accept returns and size exchanges within 7 days of delivery. Items must be unwashed, unworn, and in their original packaging with tags attached. Reverse pickup will be arranged free of charge.',
      });
    } else if (type === 'terms') {
      setModalContent({
        title: 'TERMS OF SERVICE & AUTHENTICITY',
        body: 'CULT\'S STUDIOS guarantees 100% authentic artisan streetwear. All garments are crafted with 240+ GSM bio-washed combed cotton with premium silkscreen graphics. We use 256-bit encrypted SSL checkout powered by Razorpay for maximum security.',
      });
    }
  };

  return (
    <footer className={styles.footer}>
      {/* Policy Modal */}
      {modalContent && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '1.25rem',
          }}
          onClick={() => setModalContent(null)}
        >
          <div 
            style={{
              backgroundColor: '#0c0c0c',
              border: '1px solid #333',
              borderRadius: '4px',
              maxWidth: '520px',
              width: '100%',
              padding: '2rem',
              color: '#fff',
              position: 'relative',
              boxShadow: '0 20px 50px rgba(0,0,0,0.9)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #222', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', letterSpacing: '0.08em', color: '#ff3b3b' }}>
                {modalContent.title}
              </h3>
              <button 
                onClick={() => setModalContent(null)}
                style={{ background: 'none', border: 'none', color: '#888', fontSize: '1.2rem', cursor: 'pointer', padding: '0.25rem' }}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#ccc' }}>
              {modalContent.body}
            </p>
            <button 
              onClick={() => setModalContent(null)}
              className="btn" 
              style={{ marginTop: '1.5rem', width: '100%', fontSize: '0.8rem', padding: '0.75rem' }}
            >
              CLOSE
            </button>
          </div>
        </div>
      )}

      <div className={styles.container}>
        <div className={styles.section}>
          <h3>CULT'S</h3>
          <p>The definitive luxury streetwear label. Heavyweight textiles, oversized draping, and underground aesthetic.</p>
          
          <div style={{ marginTop: '1rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', color: '#ff3b3b', textTransform: 'uppercase' }}>
              JOIN THE VAULT CLUB
            </span>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', marginTop: '0.5rem', gap: '0.4rem', maxWidth: '340px' }}>
              <input 
                type="email" 
                placeholder="Enter your email..." 
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                style={{
                  flex: 1,
                  background: '#141414',
                  border: '1px solid #333',
                  color: '#fff',
                  padding: '0.6rem 0.85rem',
                  fontSize: '0.8rem',
                  outline: 'none',
                }}
              />
              <button 
                type="submit" 
                style={{
                  background: '#ff3b3b',
                  color: '#fff',
                  border: 'none',
                  padding: '0 1rem',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  letterSpacing: '0.06em',
                }}
              >
                JOIN
              </button>
            </form>
            {subscribed && (
              <p style={{ color: '#4ade80', fontSize: '0.75rem', marginTop: '0.4rem', fontWeight: 600 }}>
                ✓ You're in! Use code <strong style={{ color: '#fff' }}>CULT10</strong> for 10% off your first order.
              </p>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <h4>Shop Collections</h4>
          <Link href="/">Home</Link>
          <Link href="/collections/all">All Vault Drops</Link>
          <Link href="/collections/new">New Arrivals</Link>
          <Link href="/collections/tops">Heavyweight Tops</Link>
          <Link href="/collections/tops/hoodies">Hoodies & Fleece</Link>
          <Link href="/collections/street-wear">Street Wear Series</Link>
          <Link href="/collections/basics">Cult's Basics</Link>
        </div>

        <div className={styles.section}>
          <h4>Customer Care</h4>
          <Link href="/account">My Account</Link>
          <Link href="/account/orders">Track Orders</Link>
          <Link href="/account/wishlist">Saved Wishlist</Link>
          <button 
            type="button" 
            onClick={() => openPolicyModal('shipping')}
            style={{ textAlign: 'left', background: 'none', border: 'none', color: '#aaa', padding: 0, cursor: 'pointer', font: 'inherit', fontSize: '0.95rem' }}
          >
            Shipping & Tracking
          </button>
          <button 
            type="button" 
            onClick={() => openPolicyModal('returns')}
            style={{ textAlign: 'left', background: 'none', border: 'none', color: '#aaa', padding: 0, cursor: 'pointer', font: 'inherit', fontSize: '0.95rem' }}
          >
            7-Day Returns & Exchanges
          </button>
          <button 
            type="button" 
            onClick={() => openPolicyModal('terms')}
            style={{ textAlign: 'left', background: 'none', border: 'none', color: '#aaa', padding: 0, cursor: 'pointer', font: 'inherit', fontSize: '0.95rem' }}
          >
            Terms & 256-Bit Security
          </button>
        </div>

        <div className={styles.section}>
          <h4>Studio Contact</h4>
          <p>Email: <a href="mailto:support@cults.com" style={{ color: '#fff' }}>support@cults.com</a></p>
          <p>Instagram: <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}>@cults.studios</a></p>
          <p>Studio: Mumbai, MH, India</p>
          <p style={{ fontSize: '0.8rem', color: '#777', marginTop: '0.5rem' }}>Operating Hours: 10:00 AM – 7:00 PM IST (Mon–Sat)</p>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} CULT'S STUDIOS. All rights reserved. Handcrafted & Designed in India.</p>
      </div>
    </footer>
  );
}
