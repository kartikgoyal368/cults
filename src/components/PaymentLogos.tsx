import React from 'react';
import Image from 'next/image';

interface LogoProps {
  size?: number;
  className?: string;
}

// Circular Google Pay Logo
export function GooglePayLogo({ size = 32, className = '' }: LogoProps) {
  return (
    <span 
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
        overflow: 'hidden',
        flexShrink: 0,
        verticalAlign: 'middle',
      }}
      className={className}
      title="Google Pay"
    >
      <Image
        src="/images/payments/circle-gpay.svg"
        alt="Google Pay"
        width={size}
        height={size}
        style={{ objectFit: 'contain' }}
      />
    </span>
  );
}

// Circular PhonePe Logo
export function PhonePeLogo({ size = 32, className = '' }: LogoProps) {
  return (
    <span 
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: '#5f259f',
        boxShadow: '0 2px 6px rgba(95,37,159,0.35)',
        overflow: 'hidden',
        flexShrink: 0,
        verticalAlign: 'middle',
      }}
      className={className}
      title="PhonePe"
    >
      <Image
        src="/images/payments/circle-phonepe.svg"
        alt="PhonePe"
        width={size}
        height={size}
        style={{ objectFit: 'contain' }}
      />
    </span>
  );
}

// Circular Paytm Logo
export function PaytmLogo({ size = 32, className = '' }: LogoProps) {
  return (
    <span 
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
        overflow: 'hidden',
        flexShrink: 0,
        verticalAlign: 'middle',
      }}
      className={className}
      title="Paytm"
    >
      <Image
        src="/images/payments/circle-paytm.svg"
        alt="Paytm"
        width={size}
        height={size}
        style={{ objectFit: 'contain' }}
      />
    </span>
  );
}

// Circular Visa Logo
export function VisaLogo({ size = 32, className = '' }: LogoProps) {
  return (
    <span 
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
        overflow: 'hidden',
        flexShrink: 0,
        verticalAlign: 'middle',
      }}
      className={className}
      title="Visa"
    >
      <Image
        src="/images/payments/circle-visa.svg"
        alt="Visa"
        width={size}
        height={size}
        style={{ objectFit: 'contain' }}
      />
    </span>
  );
}

// Circular RuPay Logo
export function RuPayLogo({ size = 32, className = '' }: LogoProps) {
  return (
    <span 
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
        overflow: 'hidden',
        flexShrink: 0,
        verticalAlign: 'middle',
      }}
      className={className}
      title="RuPay"
    >
      <Image
        src="/images/payments/circle-rupay.svg"
        alt="RuPay"
        width={size}
        height={size}
        style={{ objectFit: 'contain' }}
      />
    </span>
  );
}

// Circular Mastercard Logo
export function MastercardLogo({ size = 32, className = '' }: LogoProps) {
  return (
    <span 
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
        overflow: 'hidden',
        flexShrink: 0,
        verticalAlign: 'middle',
      }}
      className={className}
      title="Mastercard"
    >
      <Image
        src="/images/payments/circle-mastercard.svg"
        alt="Mastercard"
        width={size}
        height={size}
        style={{ objectFit: 'contain' }}
      />
    </span>
  );
}
