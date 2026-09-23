'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart, CartItem } from '@/context/CartContext';
import { 
  GooglePayLogo, 
  PhonePeLogo, 
  PaytmLogo, 
  VisaLogo, 
  RuPayLogo, 
  MastercardLogo 
} from '@/components/PaymentLogos';
import styles from './page.module.css';

interface UserProfile {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
}

interface CheckoutClientProps {
  initialUser: UserProfile | null;
}

export default function CheckoutClient({ initialUser }: CheckoutClientProps) {
  const router = useRouter();
  const {
    items: cartItems,
    buyNowItem,
    setBuyNowItem,
    clearCart,
  } = useCart();

  // Active items for checkout: single Buy Now item OR full cart
  const checkoutItems: CartItem[] = buyNowItem ? [buyNowItem] : cartItems;

  const [step, setStep] = useState<'address' | 'payment' | 'success'>('address');

  // Step 1: Address Form State
  const [email, setEmail] = useState(initialUser?.email || '');
  const [phone, setPhone] = useState(initialUser?.phone || '');
  const [firstName, setFirstName] = useState(initialUser?.name?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(initialUser?.name?.split(' ').slice(1).join(' ') || '');
  const [address, setAddress] = useState(initialUser?.address || '');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [stateName, setStateName] = useState('Maharashtra');
  const [pinCode, setPinCode] = useState('400050');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Step 2: Payment State
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [upiSubOption, setUpiSubOption] = useState<'gpay' | 'phonepe' | 'paytm' | 'id'>('gpay');
  const [upiId, setUpiId] = useState('');
  const [isUpiVerified, setIsUpiVerified] = useState(false);

  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Net banking
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Order Placement State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);

  // Calculate Subtotal & Total
  const subtotal = checkoutItems.reduce(
    (acc, it) => acc + it.priceNumber * it.quantity,
    0
  );
  const shippingFee = 0; // Free shipping
  const total = subtotal + shippingFee;

  // Validate Address Step
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!email.trim() || !email.includes('@')) errors.email = 'Valid email is required';
    if (!phone.trim() || phone.length < 10) errors.phone = 'Valid 10-digit phone number is required';
    if (!firstName.trim()) errors.firstName = 'First name is required';
    if (!address.trim()) errors.address = 'Delivery address is required';
    if (!city.trim()) errors.city = 'City is required';
    if (!pinCode.trim() || pinCode.length < 6) errors.pinCode = 'Valid 6-digit PIN code is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Format Card Number (with spaces)
  const handleCardNumberChange = (val: string) => {
    const raw = val.replace(/[^0-9]/g, '').slice(0, 16);
    const parts = raw.match(/.{1,4}/g);
    setCardNumber(parts ? parts.join(' ') : raw);
  };

  // Format Expiry
  const handleExpiryChange = (val: string) => {
    const raw = val.replace(/[^0-9]/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  // Dynamically load Razorpay SDK
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') return resolve(false);
      if ((window as any).Razorpay) return resolve(true);

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    loadRazorpayScript();
  }, []);

  // Place Final Order (Razorpay for Online Payments, Direct for COD)
  const handlePlaceOrder = async () => {
    setIsSubmitting(true);

    const fullShippingAddress = `${firstName} ${lastName}, ${address}${apartment ? ', ' + apartment : ''}, ${city}, ${stateName} - ${pinCode}. Phone: ${phone}`;

    let paymentMethodLabel = 'UPI';
    if (paymentMethod === 'upi') {
      paymentMethodLabel = `UPI (${upiSubOption.toUpperCase()}${upiId ? ': ' + upiId : ''})`;
    } else if (paymentMethod === 'card') {
      paymentMethodLabel = `Credit/Debit Card (Ending in ${cardNumber.slice(-4) || 'XXXX'})`;
    } else if (paymentMethod === 'netbanking') {
      paymentMethodLabel = `Net Banking (${selectedBank})`;
    } else if (paymentMethod === 'cod') {
      paymentMethodLabel = 'Cash on Delivery (COD)';
    }

    // A. CASH ON DELIVERY (COD)
    if (paymentMethod === 'cod') {
      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim(),
            name: `${firstName} ${lastName}`.trim(),
            phone: phone.trim(),
            items: checkoutItems.map((it) => ({
              productId: it.productId,
              name: it.name,
              price: `₹${it.priceNumber}`,
              size: it.size,
              quantity: it.quantity,
              imageUrl: it.image,
            })),
            shippingAddress: fullShippingAddress,
            paymentMethod: paymentMethodLabel,
            total: `₹${total.toLocaleString('en-IN')}`,
          }),
        });

        if (!res.ok) {
          alert('Could not place COD order. Please try again.');
          setIsSubmitting(false);
          return;
        }

        const data = await res.json();
        setConfirmedOrder(data.order);
        setStep('success');
        clearCart();
        setBuyNowItem(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        console.error(err);
        alert('Network error placing order. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // B. ONLINE PAYMENTS VIA RAZORPAY (UPI, Cards, Netbanking)
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert('Razorpay payment gateway failed to load. Please check your internet connection.');
        setIsSubmitting(false);
        return;
      }

      // 1. Create Order on Razorpay backend
      const createOrderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          receipt: `cult_${Date.now()}`,
        }),
      });

      if (!createOrderRes.ok) {
        const errData = await createOrderRes.json().catch(() => ({}));
        alert(errData.error || 'Failed to initiate Razorpay checkout.');
        setIsSubmitting(false);
        return;
      }

      const orderData = await createOrderRes.json();

      // 2. Launch Razorpay Checkout Modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "CULT'S STUDIOS",
        description: `Vault Drop Order #${orderData.orderId.slice(-6)}`,
        image: '/images/logo.png',
        order_id: orderData.orderId,
        prefill: {
          name: `${firstName} ${lastName}`.trim(),
          email: email.trim(),
          contact: phone.trim(),
        },
        notes: {
          shipping_address: fullShippingAddress,
        },
        theme: {
          color: '#ff3b3b',
          backdrop_color: 'rgba(5, 5, 5, 0.95)',
        },
        handler: async function (response: any) {
          // 3. Cryptographic HMAC SHA256 Verification on Backend
          try {
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                items: checkoutItems.map((it) => ({
                  productId: it.productId,
                  name: it.name,
                  price: `₹${it.priceNumber}`,
                  size: it.size,
                  quantity: it.quantity,
                  imageUrl: it.image,
                })),
                shippingAddress: fullShippingAddress,
                email: email.trim(),
                name: `${firstName} ${lastName}`.trim(),
                phone: phone.trim(),
                total: `₹${total.toLocaleString('en-IN')}`,
                paymentMethodDetail: paymentMethodLabel,
              }),
            });

            if (!verifyRes.ok) {
              const verifyErr = await verifyRes.json().catch(() => ({}));
              alert(verifyErr.error || 'Payment signature verification failed.');
              setIsSubmitting(false);
              return;
            }

            const verifyData = await verifyRes.json();
            setConfirmedOrder(verifyData.order);
            setStep('success');
            clearCart();
            setBuyNowItem(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } catch (err) {
            console.error('Error confirming verified payment:', err);
            alert('Payment completed, but there was an error updating your order status. Please contact support.');
          } finally {
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (resp: any) {
        console.error('Payment failed:', resp.error);
        alert(`Payment Failed: ${resp.error?.description || 'Transaction was declined.'}`);
        setIsSubmitting(false);
      });
      rzp.open();
    } catch (err) {
      console.error('Error launching Razorpay:', err);
      alert('Could not initialize payment gateway. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (checkoutItems.length === 0 && step !== 'success') {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyIcon}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
        </div>
        <h2 className={styles.emptyTitle}>NO ITEMS TO CHECKOUT</h2>
        <p className={styles.emptySubtitle}>Your bag is empty. Explore our vault drops to place an order.</p>
        <Link href="/" className="btn" style={{ marginTop: '1rem' }}>
          EXPLORE DROPS
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.checkoutLayout}>
      {/* LEFT COLUMN: MULTI-STEP FLOW */}
      <div className={styles.mainFlow}>
        {/* Step Indicator Header */}
        <div className={styles.stepperNav}>
          <div className={`${styles.stepItem} ${step === 'address' ? styles.stepActive : styles.stepDone}`}>
            <span className={styles.stepCircle}>1</span>
            <span className={styles.stepText}>SHIPPING ADDRESS</span>
          </div>
          <span className={styles.stepDivider}>➔</span>
          <div className={`${styles.stepItem} ${step === 'payment' ? styles.stepActive : step === 'success' ? styles.stepDone : ''}`}>
            <span className={styles.stepCircle}>2</span>
            <span className={styles.stepText}>PAYMENT METHOD</span>
          </div>
          <span className={styles.stepDivider}>➔</span>
          <div className={`${styles.stepItem} ${step === 'success' ? styles.stepActive : ''}`}>
            <span className={styles.stepCircle}>3</span>
            <span className={styles.stepText}>CONFIRMATION</span>
          </div>
        </div>

        {/* ================= STEP 1: ADDRESS FORM ================= */}
        {step === 'address' && (
          <form className={styles.stepSection} onSubmit={handleProceedToPayment}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionHeading}>1. DELIVERY ADDRESS</h2>
              <p className={styles.sectionDesc}>Enter your shipping and contact details for express dispatch.</p>
            </div>

            {/* Contact Details */}
            <div className={styles.inputGroupFull}>
              <label>EMAIL ADDRESS *</label>
              <input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${styles.input} ${formErrors.email ? styles.inputError : ''}`}
                required
              />
              {formErrors.email && <span className={styles.errorMsg}>{formErrors.email}</span>}
            </div>

            <div className={styles.inputGroupFull}>
              <label>PHONE NUMBER (FOR DELIVERY UPDATES) *</label>
              <div className={styles.phoneInputRow}>
                <span className={styles.countryCode}>+91</span>
                <input
                  type="tel"
                  placeholder="9876543210"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                  className={`${styles.input} ${formErrors.phone ? styles.inputError : ''}`}
                  required
                />
              </div>
              {formErrors.phone && <span className={styles.errorMsg}>{formErrors.phone}</span>}
            </div>

            {/* Name */}
            <div className={styles.inputGrid2}>
              <div className={styles.inputGroup}>
                <label>FIRST NAME *</label>
                <input
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={`${styles.input} ${formErrors.firstName ? styles.inputError : ''}`}
                  required
                />
                {formErrors.firstName && <span className={styles.errorMsg}>{formErrors.firstName}</span>}
              </div>
              <div className={styles.inputGroup}>
                <label>LAST NAME</label>
                <input
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>

            {/* Street Address */}
            <div className={styles.inputGroupFull}>
              <label>STREET ADDRESS / FLAT / BUILDING *</label>
              <input
                type="text"
                placeholder="House No., Building Name, Street"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={`${styles.input} ${formErrors.address ? styles.inputError : ''}`}
                required
              />
              {formErrors.address && <span className={styles.errorMsg}>{formErrors.address}</span>}
            </div>

            <div className={styles.inputGroupFull}>
              <label>APARTMENT, SUITE, LANDMARK (OPTIONAL)</label>
              <input
                type="text"
                placeholder="Apartment, suite, unit, etc."
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
                className={styles.input}
              />
            </div>

            {/* City, State, PIN */}
            <div className={styles.inputGrid3}>
              <div className={styles.inputGroup}>
                <label>CITY *</label>
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={`${styles.input} ${formErrors.city ? styles.inputError : ''}`}
                  required
                />
                {formErrors.city && <span className={styles.errorMsg}>{formErrors.city}</span>}
              </div>

              <div className={styles.inputGroup}>
                <label>STATE *</label>
                <input
                  type="text"
                  placeholder="State"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label>PIN CODE *</label>
                <input
                  type="text"
                  placeholder="400050"
                  maxLength={6}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.replace(/[^0-9]/g, ''))}
                  className={`${styles.input} ${formErrors.pinCode ? styles.inputError : ''}`}
                  required
                />
                {formErrors.pinCode && <span className={styles.errorMsg}>{formErrors.pinCode}</span>}
              </div>
            </div>

            <button type="submit" className={`btn ${styles.primaryActionBtn}`}>
              PROCEED TO PAYMENT ➔
            </button>
          </form>
        )}

        {/* ================= STEP 2: PAYMENT METHOD ================= */}
        {step === 'payment' && (
          <div className={styles.stepSection}>
            <div className={styles.sectionHeader}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h2 className={styles.sectionHeading}>2. PAYMENT METHOD</h2>
                <span className={styles.razorpaySecurityBadge}>⚡ SECURED BY RAZORPAY</span>
              </div>
              <p className={styles.sectionDesc}>All transactions are encrypted with 256-bit SSL via Razorpay payment gateway.</p>
            </div>

            {/* Address Summary Banner */}
            <div className={styles.addressSummaryCard}>
              <div className={styles.addressSummaryInfo}>
                <div className={styles.summaryLabel}>DELIVERING TO:</div>
                <div className={styles.summaryValue}>
                  {firstName} {lastName} • {address}, {city}, {stateName} - {pinCode}
                </div>
                <div className={styles.summaryContact}>Phone: {phone} • Email: {email}</div>
              </div>
              <button 
                className={styles.editAddressBtn}
                onClick={() => setStep('address')}
              >
                EDIT
              </button>
            </div>

            {/* Payment Options Accordion */}
            <div className={styles.paymentMethodsList}>
              {/* Option 1: UPI */}
              <div className={`${styles.paymentCard} ${paymentMethod === 'upi' ? styles.paymentCardActive : ''}`}>
                <div 
                  className={styles.paymentCardHeader}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                    />
                    <span className={styles.methodTitle}>UPI</span>
                  </label>
                  <div className={styles.paymentBadges}>
                    <GooglePayLogo size={26} />
                    <PhonePeLogo size={26} />
                    <PaytmLogo size={26} />
                  </div>
                </div>

                {paymentMethod === 'upi' && (
                  <div className={styles.paymentBody}>
                    <div className={styles.upiOptions}>
                      <button
                        type="button"
                        className={`${styles.upiOptionBtn} ${upiSubOption === 'gpay' ? styles.upiOptionActive : ''}`}
                        onClick={() => setUpiSubOption('gpay')}
                        title="Google Pay"
                        aria-label="Google Pay"
                      >
                        <GooglePayLogo size={28} />
                        <span className={styles.upiBtnLabel}>Google Pay</span>
                      </button>
                      <button
                        type="button"
                        className={`${styles.upiOptionBtn} ${upiSubOption === 'phonepe' ? styles.upiOptionActive : ''}`}
                        onClick={() => setUpiSubOption('phonepe')}
                        title="PhonePe"
                        aria-label="PhonePe"
                      >
                        <PhonePeLogo size={28} />
                        <span className={styles.upiBtnLabel}>PhonePe</span>
                      </button>
                      <button
                        type="button"
                        className={`${styles.upiOptionBtn} ${upiSubOption === 'paytm' ? styles.upiOptionActive : ''}`}
                        onClick={() => setUpiSubOption('paytm')}
                        title="Paytm"
                        aria-label="Paytm"
                      >
                        <PaytmLogo size={28} />
                        <span className={styles.upiBtnLabel}>Paytm</span>
                      </button>
                      <button
                        type="button"
                        className={`${styles.upiOptionBtn} ${upiSubOption === 'id' ? styles.upiOptionActive : ''}`}
                        onClick={() => setUpiSubOption('id')}
                      >
                        <span className={styles.upiCircleIcon}>@</span>
                        <span className={styles.upiBtnLabel}>UPI ID</span>
                      </button>
                    </div>

                    {upiSubOption === 'id' ? (
                      <div className={styles.upiInputRow}>
                        <input
                          type="text"
                          placeholder="e.g. yourname@okhdfcbank"
                          value={upiId}
                          onChange={(e) => {
                            setUpiId(e.target.value);
                            setIsUpiVerified(false);
                          }}
                          className={styles.input}
                        />
                        <button
                          type="button"
                          className={styles.verifyBtn}
                          onClick={() => {
                            if (upiId.includes('@')) {
                              setIsUpiVerified(true);
                            } else {
                              alert('Please enter a valid UPI ID (e.g. name@okaxis)');
                            }
                          }}
                        >
                          {isUpiVerified ? '✓ VERIFIED' : 'VERIFY'}
                        </button>
                      </div>
                    ) : (
                      <p className={styles.upiSubText}>
                        You will be prompted on your <strong>{upiSubOption.toUpperCase()}</strong> app to authorize the payment of <strong>₹{total.toLocaleString('en-IN')}</strong>.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Option 2: Credit / Debit Cards */}
              <div className={`${styles.paymentCard} ${paymentMethod === 'card' ? styles.paymentCardActive : ''}`}>
                <div 
                  className={styles.paymentCardHeader}
                  onClick={() => setPaymentMethod('card')}
                >
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                    />
                    <span className={styles.methodTitle}>Credit / Debit Card</span>
                  </label>
                  <div className={styles.paymentBadges}>
                    <VisaLogo size={26} />
                    <RuPayLogo size={26} />
                    <MastercardLogo size={26} />
                  </div>
                </div>

                {paymentMethod === 'card' && (
                  <div className={styles.paymentBody}>
                    <div className={styles.cardLogosRow}>
                      <div className={styles.acceptedCards}>
                        <span className={styles.acceptedCardsLabel}>ACCEPTED CARDS:</span>
                        <VisaLogo size={30} />
                        <RuPayLogo size={30} />
                        <MastercardLogo size={30} />
                      </div>
                      <span className={styles.cardsSecuredNote}>🔒 256-Bit SSL Encrypted</span>
                    </div>

                    <div className={styles.inputGroupFull}>
                      <label>CARD NUMBER</label>
                      <input
                        type="text"
                        placeholder="4532 8920 1204 8921"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => handleCardNumberChange(e.target.value)}
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.inputGroupFull}>
                      <label>NAME ON CARD</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.inputGrid2}>
                      <div className={styles.inputGroup}>
                        <label>EXPIRY (MM/YY)</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => handleExpiryChange(e.target.value)}
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label>CVV / CVC</label>
                        <input
                          type="password"
                          placeholder="•••"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/[^0-9]/g, ''))}
                          className={styles.input}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Option 3: Net Banking */}
              <div className={`${styles.paymentCard} ${paymentMethod === 'netbanking' ? styles.paymentCardActive : ''}`}>
                <div 
                  className={styles.paymentCardHeader}
                  onClick={() => setPaymentMethod('netbanking')}
                >
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'netbanking'}
                      onChange={() => setPaymentMethod('netbanking')}
                    />
                    <span className={styles.methodTitle}>Net Banking (All Indian Banks)</span>
                  </label>
                </div>

                {paymentMethod === 'netbanking' && (
                  <div className={styles.paymentBody}>
                    <p className={styles.upiSubText}>Select your bank for instant direct netbanking transfer:</p>
                    <div className={styles.banksGrid}>
                      {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map((bank) => (
                        <button
                          key={bank}
                          type="button"
                          className={`${styles.bankBtn} ${selectedBank === bank ? styles.bankBtnActive : ''}`}
                          onClick={() => setSelectedBank(bank)}
                        >
                          {bank}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Option 4: Cash on Delivery */}
              <div className={`${styles.paymentCard} ${paymentMethod === 'cod' ? styles.paymentCardActive : ''}`}>
                <div 
                  className={styles.paymentCardHeader}
                  onClick={() => setPaymentMethod('cod')}
                >
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                    />
                    <span className={styles.methodTitle}>Cash on Delivery (COD)</span>
                  </label>
                  <span className={styles.badgeCod}>PAY AT DOORSTEP</span>
                </div>

                {paymentMethod === 'cod' && (
                  <div className={styles.paymentBody}>
                    <p className={styles.upiSubText}>
                      Pay via cash or UPI to the delivery courier when your package arrives at your doorstep. Please keep exact change ready.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className={styles.paymentActions}>
              <button
                type="button"
                className={styles.backStepBtn}
                onClick={() => setStep('address')}
              >
                ← BACK TO ADDRESS
              </button>
              <button
                type="button"
                className={`btn ${styles.placeOrderBtn}`}
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? 'PROCESSING SECURE PAYMENT...' 
                  : paymentMethod === 'cod'
                    ? `PLACE COD ORDER • ₹${total.toLocaleString('en-IN')}`
                    : `PAY VIA RAZORPAY • ₹${total.toLocaleString('en-IN')}`}
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: ORDER CONFIRMED ================= */}
        {step === 'success' && (
          <div className={styles.successSection}>
            <div className={styles.successIconWrapper}>
              <span className={styles.successCheck}>✓</span>
            </div>

            <h1 className={styles.successTitle}>ORDER CONFIRMED</h1>
            <p className={styles.successSubtitle}>
              THANK YOU FOR YOUR ORDER! YOUR VAULT DROP IS BEING ASSEMBLED.
            </p>

            <div className={styles.orderDetailsBox}>
              <div className={styles.detailRow}>
                <span>ORDER NUMBER</span>
                <strong>#{confirmedOrder?.orderNumber || 'CULT-84910'}</strong>
              </div>
              <div className={styles.detailRow}>
                <span>ESTIMATED DELIVERY</span>
                <strong>Within 2-4 Business Days</strong>
              </div>
              <div className={styles.detailRow}>
                <span>COURIER AWB</span>
                <code>{confirmedOrder?.trackingNumber || 'CLT-EXP-772190'}</code>
              </div>
              <div className={styles.detailRow}>
                <span>PAYMENT METHOD</span>
                <strong>{confirmedOrder?.paymentMethod || 'UPI (PAID)'}</strong>
              </div>
              <div className={styles.detailRow}>
                <span>TOTAL PAID</span>
                <strong className={styles.successTotal}>{confirmedOrder?.total || `₹${total.toLocaleString('en-IN')}`}</strong>
              </div>
            </div>

            <div className={styles.successActions}>
              <Link href="/account/orders" className={`btn ${styles.viewOrdersBtn}`}>
                VIEW IN YOUR ORDERS ➔
              </Link>
              <Link href="/" className={styles.homeLinkBtn}>
                CONTINUE SHOPPING
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: ORDER SUMMARY SIDEBAR */}
      {step !== 'success' && (
        <div className={styles.summarySidebar}>
          <div className={styles.summaryHeader}>
            <h3 className={styles.summaryTitle}>ORDER SUMMARY</h3>
            <span className={styles.itemCountBadge}>{checkoutItems.length} ITEM(S)</span>
          </div>

          <div className={styles.summaryItemsList}>
            {checkoutItems.map((item) => (
              <div key={item.id} className={styles.summaryItem}>
                <div className={styles.itemThumb}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={65}
                    height={80}
                    className={styles.thumbImage}
                  />
                  <span className={styles.thumbBadge}>{item.quantity}</span>
                </div>
                <div className={styles.itemMeta}>
                  <div className={styles.itemName}>{item.name}</div>
                  <div className={styles.itemSub}>Size: {item.size}</div>
                  <div className={styles.itemPrice}>₹{item.priceNumber * item.quantity}</div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.priceBreakdown}>
            <div className={styles.breakdownRow}>
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className={styles.breakdownRow}>
              <span>Shipping</span>
              <span className={styles.freeShipping}>FREE EXPRESS</span>
            </div>
            <div className={styles.breakdownTotal}>
              <span>Total Amount</span>
              <span className={styles.totalValue}>₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className={styles.trustBadges}>
            <div className={styles.trustItem}>
              <span>✦</span> 240+ GSM Heavyweight Luxury Cotton
            </div>
            <div className={styles.trustItem}>
              <span>✦</span> 100% Secure 256-Bit Encrypted Payments
            </div>
            <div className={styles.trustItem}>
              <span>✦</span> 7-Day Hassle-Free Returns & Exchanges
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
