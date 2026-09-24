"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import CartDrawer from './CartDrawer';
import { useCart } from '@/context/CartContext';
import styles from './Header.module.css';

import { signOut } from 'next-auth/react';
import type { Session } from 'next-auth';

export default function Header({ session }: { session: Session | null }) {
  const { isCartOpen, setIsCartOpen, totalCount } = useCart();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsMobileSearchOpen(false);
      setIsMobileMenuOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const toggleCategory = (cat: string) => {
    setExpandedCategory(expandedCategory === cat ? null : cat);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      {/* Announcement Bar */}
      <div className={styles.announcement}>
        <div className="marquee-container">
          <div className="marquee-content">
            <span>WEEKEND'S EXTENDED SAVING - UPTO 60% OFF</span>
            <span style={{ margin: '0 2rem' }}>•</span>
            <span>WEEKEND'S EXTENDED SAVING - UPTO 60% OFF</span>
            <span style={{ margin: '0 2rem' }}>•</span>
            <span>WEEKEND'S EXTENDED SAVING - UPTO 60% OFF</span>
            <span style={{ margin: '0 2rem' }}>•</span>
            <span>WEEKEND'S EXTENDED SAVING - UPTO 60% OFF</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className={styles.navContainer}>
        {/* Mobile Hamburger Toggle */}
        <button 
          className={styles.hamburger} 
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open mobile menu"
          type="button"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Desktop Navigation Links */}
        <nav className={styles.navLinks}>
          <Link href="/collections/new">NEW ARRIVALS</Link>
          
          <div className={styles.navItem}>
            <Link href="/collections/tops">TOPS</Link>
            <div className={styles.megaMenu}>
              <div className={styles.megaMenuContent}>
                <div className={styles.megaMenuLinks}>
                  <Link href="/collections/tops/tank-top">TANK TOP</Link>
                  <Link href="/collections/tops/tshirt">TSHIRT</Link>
                  <Link href="/collections/tops/hoodies">HOODIES</Link>
                  <Link href="/collections/tops/jackets">JACKETS</Link>
                  <Link href="/collections/tops/full-sleeve">FULL SLEEVE T SHIRT</Link>
                  <Link href="/collections/tops/baby-tee">BABY TEE</Link>
                </div>
                <div className={styles.megaMenuImages}>
                  <div className={styles.megaMenuImageWrapper}>
                    <Image src="/images/tops.jpg" alt="Tops 1" fill style={{ objectFit: 'cover' }} />
                  </div>
                  <div className={styles.megaMenuImageWrapper}>
                    <Image src="/images/hero.jpg" alt="Tops 2" fill style={{ objectFit: 'cover' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.navItem}>
            <Link href="/collections/bottoms">BOTTOMS</Link>
            <div className={styles.megaMenu}>
              <div className={styles.megaMenuContent}>
                <div className={styles.megaMenuLinks}>
                  <Link href="/collections/bottoms/baggy">BAGGY PANTS</Link>
                  <Link href="/collections/bottoms/cargos">CARGOS</Link>
                  <Link href="/collections/bottoms/denim">DENIM</Link>
                  <Link href="/collections/bottoms/shorts">SHORTS</Link>
                </div>
                <div className={styles.megaMenuImages}>
                  <div className={styles.megaMenuImageWrapper}>
                    <Image src="/images/hero.jpg" alt="Bottoms 1" fill style={{ objectFit: 'cover' }} />
                  </div>
                  <div className={styles.megaMenuImageWrapper}>
                    <Image src="/images/tops.jpg" alt="Bottoms 2" fill style={{ objectFit: 'cover' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Center Logo */}
        <div className={styles.logo}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
            <Image 
              src="/images/logo.png" 
              alt="CULT'S Logo" 
              width={160} 
              height={52} 
              style={{ objectFit: 'contain' }}
              className={styles.logoImg}
            />
          </Link>
        </div>

        {/* Right Actions */}
        <div className={styles.actions}>
          {/* Desktop Search Bar */}
          <form className={styles.searchBarContainer} onSubmit={handleSearchSubmit}>
            <input 
              type="text" 
              placeholder="What are you looking for?" 
              className={styles.searchInput} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className={styles.searchIcons}>
              <button type="submit" aria-label="Search" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'inherit' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </button>
            </div>
          </form>

          {/* Mobile Search Button Toggle */}
          <button 
            type="button"
            className={styles.mobileSearchToggle} 
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            aria-label="Toggle mobile search"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
          
          <div className={styles.iconGroup}>
            {/* User Account Menu (Desktop) */}
            <div 
              className={styles.userMenuWrapper} 
              style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
              onMouseEnter={() => setIsUserMenuOpen(true)}
              onMouseLeave={() => setIsUserMenuOpen(false)}
            >
              <Link href={session ? "/account" : "/login"} aria-label="Login / Sign Up" title="My Account" className={styles.iconBtn}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </Link>
              {session && isUserMenuOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '0.5rem',
                  backgroundColor: '#0a0a0a',
                  border: '1px solid #333',
                  borderRadius: '4px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.8)',
                  padding: '0.75rem 0',
                  minWidth: '180px',
                  zIndex: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem'
                }}>
                  <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid #222', fontSize: '0.75rem', color: '#888' }}>
                    Signed in as <span style={{ color: '#fff', fontWeight: 600 }}>{session.user?.name || session.user?.email}</span>
                  </div>
                  <Link 
                    href="/account" 
                    style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', color: '#ddd', textDecoration: 'none' }}
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    My Account
                  </Link>
                  <Link 
                    href="/account/orders" 
                    style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', color: '#ddd', textDecoration: 'none' }}
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <Link 
                    href="/account/wishlist" 
                    style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', color: '#ddd', textDecoration: 'none' }}
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Wishlist
                  </Link>
                  <button 
                    onClick={() => { setIsUserMenuOpen(false); signOut({ callbackUrl: '/' }); }}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', color: '#ff6b6b', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Wishlist Link */}
            <Link href="/account/wishlist" aria-label="Wishlist" title="My Wishlist" className={styles.iconBtn}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </Link>

            {/* Cart Button */}
            <button 
              aria-label="Cart" 
              onClick={() => setIsCartOpen(true)}
              style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              {totalCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-10px',
                  background: '#ff3b3b',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #000',
                }}>
                  {totalCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Mobile Search Bar */}
      {isMobileSearchOpen && (
        <div className={styles.mobileSearchDropdown}>
          <form className={styles.mobileSearchForm} onSubmit={handleSearchSubmit}>
            <input 
              type="text" 
              placeholder="Search streetwear drops..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.mobileSearchInput}
              autoFocus
            />
            <button type="submit" className={styles.mobileSearchSubmitBtn}>
              SEARCH
            </button>
          </form>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      <div 
        className={`${styles.mobileDrawerOverlay} ${isMobileMenuOpen ? styles.mobileDrawerOpen : ''}`}
        onClick={closeMobileMenu}
        aria-hidden="true"
      />
      <div className={`${styles.mobileDrawer} ${isMobileMenuOpen ? styles.mobileDrawerOpen : ''}`} data-lenis-prevent>
        <div className={styles.mobileDrawerHeader}>
          <Image src="/images/logo.png" alt="CULT'S Logo" width={130} height={42} style={{ objectFit: 'contain' }} />
          <button className={styles.mobileDrawerCloseBtn} onClick={closeMobileMenu} aria-label="Close menu">
            ✕
          </button>
        </div>

        {/* Mobile Search */}
        <div className={styles.mobileDrawerSearch}>
          <form onSubmit={handleSearchSubmit} className={styles.drawerSearchForm}>
            <input 
              type="text" 
              placeholder="Search catalog..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.drawerSearchInput}
            />
            <button type="submit" className={styles.drawerSearchBtn} aria-label="Submit search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
          </form>
        </div>

        {/* Mobile Navigation Links */}
        <nav className={styles.mobileNavLinks}>
          <Link href="/collections/new" className={styles.mobileNavLink} onClick={closeMobileMenu}>
            NEW ARRIVALS
            <span className={styles.dropBadge}>HOT</span>
          </Link>

          {/* TOPS Accordion */}
          <div className={styles.mobileAccordion}>
            <button 
              type="button" 
              className={styles.mobileAccordionToggle} 
              onClick={() => toggleCategory('tops')}
            >
              <span>TOPS</span>
              <span className={styles.accordionArrow}>{expandedCategory === 'tops' ? '−' : '+'}</span>
            </button>
            {expandedCategory === 'tops' && (
              <div className={styles.mobileSubLinks}>
                <Link href="/collections/tops" onClick={closeMobileMenu}>ALL TOPS</Link>
                <Link href="/collections/tops/hoodies" onClick={closeMobileMenu}>HOODIES</Link>
                <Link href="/collections/tops/tshirt" onClick={closeMobileMenu}>TSHIRTS</Link>
                <Link href="/collections/tops/jackets" onClick={closeMobileMenu}>JACKETS</Link>
                <Link href="/collections/tops/tank-top" onClick={closeMobileMenu}>TANK TOPS</Link>
                <Link href="/collections/tops/full-sleeve" onClick={closeMobileMenu}>FULL SLEEVE</Link>
                <Link href="/collections/tops/baby-tee" onClick={closeMobileMenu}>BABY TEE</Link>
              </div>
            )}
          </div>

          {/* BOTTOMS Accordion */}
          <div className={styles.mobileAccordion}>
            <button 
              type="button" 
              className={styles.mobileAccordionToggle} 
              onClick={() => toggleCategory('bottoms')}
            >
              <span>BOTTOMS</span>
              <span className={styles.accordionArrow}>{expandedCategory === 'bottoms' ? '−' : '+'}</span>
            </button>
            {expandedCategory === 'bottoms' && (
              <div className={styles.mobileSubLinks}>
                <Link href="/collections/bottoms" onClick={closeMobileMenu}>ALL BOTTOMS</Link>
                <Link href="/collections/bottoms/baggy" onClick={closeMobileMenu}>BAGGY PANTS</Link>
                <Link href="/collections/bottoms/cargos" onClick={closeMobileMenu}>CARGOS</Link>
                <Link href="/collections/bottoms/denim" onClick={closeMobileMenu}>DENIM</Link>
                <Link href="/collections/bottoms/shorts" onClick={closeMobileMenu}>SHORTS</Link>
              </div>
            )}
          </div>

          <Link href="/account/wishlist" className={styles.mobileNavLink} onClick={closeMobileMenu}>
            MY WISHLIST
          </Link>

          <Link href="/account/orders" className={styles.mobileNavLink} onClick={closeMobileMenu}>
            MY ORDERS & TRACKING
          </Link>

          <Link href={session ? "/account" : "/login"} className={styles.mobileNavLink} onClick={closeMobileMenu}>
            {session ? 'MY ACCOUNT' : 'LOGIN / REGISTER'}
          </Link>
        </nav>

        {/* Mobile Drawer Footer */}
        <div className={styles.mobileDrawerFooter}>
          {session ? (
            <button 
              type="button"
              className={styles.drawerSignOutBtn} 
              onClick={() => { closeMobileMenu(); signOut({ callbackUrl: '/' }); }}
            >
              SIGN OUT ({session.user?.name || session.user?.email})
            </button>
          ) : (
            <Link href="/login" className={`btn ${styles.drawerLoginBtn}`} onClick={closeMobileMenu}>
              SIGN IN / REGISTER
            </Link>
          )}
          <p className={styles.drawerCopyright}>CULT'S STUDIOS © LUXURY STREETWEAR</p>
        </div>
      </div>

      <CartDrawer />
    </header>
  );
}
