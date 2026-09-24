'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import styles from './page.module.css';

interface OrderItem {
  id: string;
  productId?: string | null;
  name: string;
  price: string;
  quantity: number;
  size?: string | null;
  imageUrl?: string | null;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: string;
  trackingNumber?: string | null;
  shippingAddress?: string | null;
  paymentMethod?: string | null;
  createdAt: string;
  items: OrderItem[];
}

interface ProductImage {
  id: string;
  url: string;
}

interface Product {
  id: string;
  name: string;
  price: string;
  description?: string | null;
  tag?: string | null;
  category?: string | null;
  images: ProductImage[];
}

interface OrdersClientProps {
  initialOrders: Order[];
  allProducts: Product[];
}

export default function OrdersClient({
  initialOrders,
  allProducts,
}: OrdersClientProps) {
  const router = useRouter();
  const { setBuyNowItem } = useCart();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [isOrdering, setIsOrdering] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [expandedTracking, setExpandedTracking] = useState<Record<string, boolean>>({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSelectSize = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const toggleTracking = (orderId: string) => {
    setExpandedTracking((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const handleQuickOrder = async (product: Product) => {
    const size = selectedSizes[product.id] || 'L';
    setIsOrdering((prev) => ({ ...prev, [product.id]: true }));

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          size,
          quantity: 1,
        }),
      });

      if (!res.ok) {
        // If guest or unauthorized, take directly to checkout
        const itemPriceNum = parseInt(product.price.replace(/[^0-9]/g, ''), 10) || 0;
        setBuyNowItem({
          id: `${product.id}-${size}`,
          productId: product.id,
          name: product.name,
          price: product.price,
          priceNumber: itemPriceNum,
          image: product.images[0]?.url || '/images/1.png',
          size,
          quantity: 1,
        });
        router.push('/checkout');
        return;
      }

      const data = await res.json();
      if (data.order) {
        // Prepend new order to list
        const formattedOrder: Order = {
          id: data.order.id,
          orderNumber: data.order.orderNumber,
          status: data.order.status,
          total: data.order.total,
          trackingNumber: data.order.trackingNumber,
          shippingAddress: data.order.shippingAddress,
          paymentMethod: data.order.paymentMethod,
          createdAt: new Date().toISOString(),
          items: data.order.items || [],
        };
        setOrders((prev) => [formattedOrder, ...prev]);
        showToast(`Order #${formattedOrder.orderNumber} placed successfully!`);
      }
    } catch {
      showToast('Error placing order.');
    } finally {
      setIsOrdering((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  // Filter orders by status
  const filteredOrders = orders.filter((order) => {
    if (statusFilter === 'ALL') return true;
    return order.status.toUpperCase() === statusFilter;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED':
        return styles.badgeDelivered;
      case 'IN TRANSIT':
        return styles.badgeInTransit;
      case 'PROCESSING':
        return styles.badgeProcessing;
      default:
        return styles.badgeDefault;
    }
  };

  return (
    <div className={styles.clientContainer}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className={styles.toast}>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SECTION 1: USER'S ORDERS */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>YOUR ORDER HISTORY</h2>
            <p className={styles.sectionSubtitle}>
              Track recent shipments, download invoices, or reorder vault drops.
            </p>
          </div>

          {/* Status Filter Chips */}
          <div className={styles.statusFilters}>
            {['ALL', 'PROCESSING', 'IN TRANSIT', 'DELIVERED'].map((filter) => (
              <button
                key={filter}
                className={`${styles.filterBtn} ${statusFilter === filter ? styles.activeFilter : ''}`}
                onClick={() => setStatusFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <p className={styles.emptyTitle}>NO ORDERS FOUND</p>
            <p className={styles.emptyDesc}>
              {statusFilter !== 'ALL'
                ? `You have no orders with status "${statusFilter}".`
                : 'You have not placed any orders yet. Discover all products below to place your first order!'}
            </p>
          </div>
        ) : (
          <div className={styles.ordersList}>
            {filteredOrders.map((order) => {
              const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });
              const isTrackingOpen = !!expandedTracking[order.id];

              return (
                <div key={order.id} className={styles.orderCard}>
                  {/* Order Top Bar */}
                  <div className={styles.orderTopBar}>
                    <div className={styles.orderMeta}>
                      <div className={styles.orderNumber}>
                        ORDER #{order.orderNumber}
                      </div>
                      <div className={styles.orderDate}>Placed on {formattedDate}</div>
                    </div>

                    <div className={styles.orderTopRight}>
                      <div className={styles.orderTotal}>
                        <span className={styles.totalLabel}>TOTAL</span>
                        <span className={styles.totalValue}>{order.total}</span>
                      </div>
                      <span className={`${styles.statusBadge} ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Tracking Timeline Stepper */}
                  <div className={styles.trackingTimeline}>
                    <div className={`${styles.step} ${styles.stepDone}`}>
                      <div className={styles.stepDot}></div>
                      <span className={styles.stepLabel}>CONFIRMED</span>
                    </div>
                    <div className={`${styles.stepLine} ${order.status !== 'PROCESSING' ? styles.lineDone : ''}`}></div>
                    <div className={`${styles.step} ${order.status !== 'PROCESSING' ? styles.stepDone : styles.stepActive}`}>
                      <div className={styles.stepDot}></div>
                      <span className={styles.stepLabel}>PROCESSING</span>
                    </div>
                    <div className={`${styles.stepLine} ${order.status === 'DELIVERED' || order.status === 'IN TRANSIT' ? styles.lineDone : ''}`}></div>
                    <div className={`${styles.step} ${order.status === 'DELIVERED' ? styles.stepDone : order.status === 'IN TRANSIT' ? styles.stepActive : ''}`}>
                      <div className={styles.stepDot}></div>
                      <span className={styles.stepLabel}>IN TRANSIT</span>
                    </div>
                    <div className={`${styles.stepLine} ${order.status === 'DELIVERED' ? styles.lineDone : ''}`}></div>
                    <div className={`${styles.step} ${order.status === 'DELIVERED' ? styles.stepDone : ''}`}>
                      <div className={styles.stepDot}></div>
                      <span className={styles.stepLabel}>DELIVERED</span>
                    </div>
                  </div>

                  {/* Order Items List */}
                  <div className={styles.itemsList}>
                    {order.items.map((item) => (
                      <div key={item.id} className={styles.itemRow}>
                        <div className={styles.itemImageWrapper}>
                          <Image
                            src={item.imageUrl || '/images/1.png'}
                            alt={item.name}
                            width={80}
                            height={100}
                            className={styles.itemImage}
                          />
                        </div>

                        <div className={styles.itemDetails}>
                          <div className={styles.itemName}>{item.name}</div>
                          <div className={styles.itemSpecs}>
                            <span>Size: <strong>{item.size || 'L'}</strong></span>
                            <span>•</span>
                            <span>Qty: <strong>{item.quantity}</strong></span>
                            <span>•</span>
                            <span className={styles.itemPrice}>{item.price}</span>
                          </div>
                          {order.trackingNumber && (
                            <div className={styles.trackingRef}>
                              Tracking: <code>{order.trackingNumber}</code>
                            </div>
                          )}
                        </div>

                        <div className={styles.itemActions}>
                          {item.productId && (
                            <Link href={`/product/${item.productId}`} className={styles.viewItemBtn}>
                              VIEW PRODUCT
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Expanded Tracking Modal / Details */}
                  {isTrackingOpen && (
                    <div className={styles.trackingDetailsBox}>
                      <div className={styles.trackingDetailsTitle}>
                        LOGISTICS & COURIER TRACKING
                      </div>
                      <div className={styles.trackingGrid}>
                        <div>
                          <strong>Courier:</strong> BlueDart Express / Cults Logistics
                        </div>
                        <div>
                          <strong>Waybill / AWB:</strong> {order.trackingNumber || 'CLT-EXP-992144'}
                        </div>
                        <div>
                          <strong>Shipping Address:</strong> {order.shippingAddress || 'Address on file'}
                        </div>
                        <div>
                          <strong>Payment Method:</strong> {order.paymentMethod || 'Online / Prepaid'}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Order Card Footer */}
                  <div className={styles.orderFooter}>
                    <button
                      className={styles.trackBtn}
                      onClick={() => toggleTracking(order.id)}
                    >
                      {isTrackingOpen ? 'HIDE TRACKING' : 'TRACK PACKAGE'}
                    </button>
                    {order.items[0]?.productId && (
                      <Link
                        href={`/product/${order.items[0].productId}`}
                        className={styles.buyAgainBtn}
                      >
                        BUY AGAIN
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: ALL STORE PRODUCTS SHOWCASE */}
      <div className={styles.section}>
        <div className={styles.catalogHeader}>
          <div>
            <h2 className={styles.sectionTitle}>ALL STORE PRODUCTS</h2>
            <p className={styles.sectionSubtitle}>
              Explore our complete drops catalog. Order any piece directly with 1-click dispatch.
            </p>
          </div>
          <div className={styles.catalogCountBadge}>
            {allProducts.length} PRODUCTS AVAILABLE
          </div>
        </div>

        <div className={styles.productGrid}>
          {allProducts.map((product) => {
            const selectedSize = selectedSizes[product.id] || 'L';
            const mainImage = product.images[0]?.url || '/images/1.png';
            const ordering = isOrdering[product.id];

            return (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.productImageWrapper}>
                  <Link href={`/product/${product.id}`}>
                    <Image
                      src={mainImage}
                      alt={product.name}
                      width={400}
                      height={500}
                      className={styles.productCardImage}
                    />
                  </Link>

                  {product.tag && (
                    <span className={styles.productTag}>{product.tag}</span>
                  )}
                  <span className={styles.productCategoryTag}>
                    {product.category === 'basics' ? "CULT'S BASICS" : 'STREET WEAR'}
                  </span>
                </div>

                <div className={styles.productCardInfo}>
                  <Link href={`/product/${product.id}`} className={styles.productCardTitle}>
                    {product.name}
                  </Link>
                  <div className={styles.productCardPrice}>{product.price}</div>

                  {/* Size Selector */}
                  <div className={styles.sizeSection}>
                    <span className={styles.sizeLabel}>SIZE:</span>
                    <div className={styles.sizeOptions}>
                      {['S', 'M', 'L', 'XL'].map((size) => (
                        <button
                          key={size}
                          className={`${styles.sizeBtn} ${selectedSize === size ? styles.selectedSize : ''}`}
                          onClick={() => handleSelectSize(product.id, size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className={styles.cardActions}>
                    <button
                      className={styles.orderNowBtn}
                      onClick={() => handleQuickOrder(product)}
                      disabled={ordering}
                    >
                      {ordering ? 'ORDERING...' : 'ORDER NOW'}
                    </button>
                    <Link
                      href={`/product/${product.id}`}
                      className={styles.detailsBtn}
                      title="View Details"
                    >
                      VIEW
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
