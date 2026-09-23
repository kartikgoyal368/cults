"use client";

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './Hero.module.css';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Autoplay was prevented:", error);
      });
    }
  }, []);

  return (
    <section className={styles.hero}>
      <div className={styles.imageContainer}>
        <video
          ref={videoRef}
          src="/videos/now_in_the_last_replace_the_ww.mov"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className={styles.video}
        />
        <div className={styles.overlay}></div>
      </div>
      
      <div className={styles.content}>
        <h1 className={styles.title}>NEW ERA OF STREETWEAR</h1>
        <p className={styles.subtitle}>Dark. Gritty. Unapologetic.</p>
        <Link href="/collections/all" className="btn">
          SHOP THE DROP
        </Link>
      </div>
    </section>
  );
}
