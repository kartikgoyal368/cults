"use client";

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

interface AccountDetailsFormProps {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    role?: string;
    createdAt?: string;
  };
}

export default function AccountDetailsForm({ user }: AccountDetailsFormProps) {
  const [name, setName] = useState(user.name || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [address, setAddress] = useState(user.address || '');

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const initialLetter = (name || user.email || 'C')[0].toUpperCase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage(null);
    setError(null);

    try {
      const res = await fetch('/api/account/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, address }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to update account details.');
      } else {
        setSuccessMessage('Account details updated successfully!');
      }
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formWrapper}>
      <div className={styles.header}>
        <Link href="/account" className={styles.backBtn} aria-label="Back to Account">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </Link>
        <h1 className={styles.title}>ACCOUNT DETAILS</h1>
      </div>

      <p className={styles.subtitle}>VIEW AND MANAGE YOUR CULT'S PROFILE</p>

      {/* Profile Overview Card */}
      <div className={styles.profileCard}>
        <div className={styles.avatar}>{initialLetter}</div>
        <div className={styles.profileMeta}>
          <div className={styles.profileName}>{name || 'Cult Member'}</div>
          <div className={styles.profileEmail}>{user.email}</div>
          <div className={styles.profileTier}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span>{user.role === 'ADMIN' ? 'ADMIN' : 'CULT MEMBER • TIER 1'}</span>
            {user.createdAt && <span>• Member since {new Date(user.createdAt).getFullYear()}</span>}
          </div>
        </div>
      </div>

      {successMessage && <div className={styles.alertSuccess}>{successMessage}</div>}
      {error && <div className={styles.alertError}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="email">EMAIL ADDRESS (PRIMARY)</label>
          <input
            type="email"
            id="email"
            name="email"
            value={user.email || ''}
            readOnly
            className={`${styles.input} ${styles.readOnly}`}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="name">FULL NAME</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={styles.input}
            placeholder="Your full name"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="phone">PHONE NUMBER</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="address">SHIPPING & BILLING ADDRESS</label>
          <textarea
            id="address"
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Apartment, Street name, City, State, PIN code"
            className={styles.textarea}
            rows={3}
          />
        </div>

        <button
          type="submit"
          className={`btn ${styles.submitBtn}`}
          disabled={isLoading}
        >
          {isLoading ? 'SAVING CHANGES...' : 'SAVE CHANGES'}
        </button>
      </form>
    </div>
  );
}
